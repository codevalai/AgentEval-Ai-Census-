/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  dotFactorySystem,
  DotFactorySystem,
  DotSpawnPlan,
  DotAgentInstance,
  QueueSnapshot,
  RegionLoadMap,
  ValuationSignal,
  DEFAULT_REGIONS,
  DEFAULT_VALUATION_SIGNALS,
} from './dotFactorySystem.ts';
import { sovereignEventFabric, calculateHash } from './merkleSpine.ts';

export type TaskStatus = 'pending' | 'assigned' | 'running' | 'completed' | 'failed';

export interface AgentTask {
  id: string;
  taskType: 'code_eval' | 'telemetry' | 'mcp_tool' | 'threat_scan' | 'governance';
  payload: Record<string, any>;
  priority: number; // 1 - 100
  status: TaskStatus;
  assignedDotId?: string;
  regionCode?: string;
  valuationSignal: ValuationSignal;
  createdAt: number;
  updatedAt: number;
}

export interface RegionalSafetyCap {
  regionCode: string;
  maxCapacity: number;
  safetyCapThreshold: number; // Max workers allowed before shedding load
  currentWorkers: number;
  isCapped: boolean;
}

export interface TaskAssignment {
  taskId: string;
  dotId: string;
  regionCode: string;
  priorityScore: number;
}

export interface ReroutedTaskRecord {
  taskId: string;
  attemptedRegion: string;
  reroutedRegion: string;
  reason: string;
}

export interface SwarmExecutionPlan {
  planId: string;
  generatedAt: number;
  tasksLoadedCount: number;
  dotSpawnPlan: DotSpawnPlan;
  taskAssignments: TaskAssignment[];
  safetyCapRejections: ReroutedTaskRecord[];
  estimatedCompletionLatencyMs: number;
  overallPriorityScore: number;
}

export interface PolicyEngineMetrics {
  totalTasksEnqueued: number;
  totalTasksExecuted: number;
  safetyCapViolationsMitigated: number;
  activeRegionalDistribution: Record<string, number>;
  bftQuorumHealthPercent: number;
}

/**
 * AgentOPolicyEngine
 *
 * Sovereign swarm policy coordinator and executor.
 * Loads queued tasks, balances regional loads against safety limits,
 * computes optimal swarm allocation plans, and coordinates Dot execution.
 */
export class AgentOPolicyEngine {
  private taskQueue: Map<string, AgentTask> = new Map();
  private regionalCaps: Map<string, RegionalSafetyCap> = new Map();
  private factory: DotFactorySystem;
  private totalEnqueued: number = 0;
  private totalExecuted: number = 0;
  private safetyViolationsMitigated: number = 0;

  constructor(factoryInstance: DotFactorySystem = dotFactorySystem) {
    this.factory = factoryInstance;
    this.initRegionalCaps();
    this.seedDefaultQueue();
  }

  private initRegionalCaps(): void {
    Object.values(DEFAULT_REGIONS).forEach((reg) => {
      this.regionalCaps.set(reg.regionCode, {
        regionCode: reg.regionCode,
        maxCapacity: reg.maxCapacity,
        safetyCapThreshold: reg.safetyCap,
        currentWorkers: reg.currentWorkers,
        isCapped: reg.currentWorkers >= reg.safetyCap,
      });
    });
  }

  private seedDefaultQueue(): void {
    const seedTasks: Array<Omit<AgentTask, 'id' | 'status' | 'createdAt' | 'updatedAt'>> = [
      {
        taskType: 'code_eval',
        payload: { repo: 'ai-studio/sovereign-core', branch: 'main', commit: '0x889a7f' },
        priority: 85,
        valuationSignal: DEFAULT_VALUATION_SIGNALS.code_eval,
      },
      {
        taskType: 'threat_scan',
        payload: { targetNode: 'us-east4-edge', check: 'KYBER_LATTICE_INTEGRITY' },
        priority: 95,
        valuationSignal: DEFAULT_VALUATION_SIGNALS.threat_scan,
      },
      {
        taskType: 'mcp_tool',
        payload: { tool: 'github_indexer', query: 'planetary_census' },
        priority: 75,
        valuationSignal: DEFAULT_VALUATION_SIGNALS.mcp_tool,
      },
      {
        taskType: 'telemetry',
        payload: { stream: 'usgs_planetary', windowSec: 60 },
        priority: 60,
        valuationSignal: DEFAULT_VALUATION_SIGNALS.telemetry,
      },
    ];

    seedTasks.forEach((t) => this.enqueueTask(t));
  }

  /**
   * Enqueue a task into the pending task queue.
   */
  public enqueueTask(
    taskInput: Omit<AgentTask, 'id' | 'status' | 'createdAt' | 'updatedAt'>
  ): AgentTask {
    const taskId = `TASK-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`.toUpperCase();
    const task: AgentTask = {
      ...taskInput,
      id: taskId,
      status: 'pending',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.taskQueue.set(taskId, task);
    this.totalEnqueued++;
    return task;
  }

  /**
   * Enqueue multiple tasks in batch.
   */
  public enqueueBatch(
    taskInputs: Array<Omit<AgentTask, 'id' | 'status' | 'createdAt' | 'updatedAt'>>
  ): AgentTask[] {
    return taskInputs.map((t) => this.enqueueTask(t));
  }

  /**
   * Loads all tasks currently pending execution.
   */
  public loadPendingTasks(limit: number = 200): AgentTask[] {
    const pending: AgentTask[] = [];
    for (const task of this.taskQueue.values()) {
      if (task.status === 'pending') {
        pending.push(task);
        if (pending.length >= limit) break;
      }
    }

    // Sort by priorityScore (priority * economicWeight * slaUrgencyFactor)
    return pending.sort((a, b) => {
      const scoreA = a.priority * a.valuationSignal.economicWeight * a.valuationSignal.slaUrgencyFactor;
      const scoreB = b.priority * b.valuationSignal.economicWeight * b.valuationSignal.slaUrgencyFactor;
      return scoreB - scoreA;
    });
  }

  /**
   * Computes the optimal swarm plan:
   * Enforces regional safety caps, balances workload across regions,
   * interfaces with DotFactory to plan spawns, and maps tasks to Dot workers.
   */
  public computeOptimalSwarmPlan(): SwarmExecutionPlan {
    const pending = this.loadPendingTasks(150);
    const planId = `OP-PLAN-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`.toUpperCase();

    // 1. Summarize queue snapshot
    const taskTypes: Record<string, number> = {};
    pending.forEach((t) => {
      taskTypes[t.taskType] = (taskTypes[t.taskType] || 0) + 1;
    });

    const queueSnapshot: QueueSnapshot = {
      pendingTasks: pending.length,
      taskTypes,
      priorityDistribution: {
        high: pending.filter((t) => t.priority >= 80).length,
        normal: pending.filter((t) => t.priority >= 50 && t.priority < 80).length,
        batch: pending.filter((t) => t.priority < 50).length,
      },
    };

    // 2. Build current regional load snapshot
    const regionLoads: RegionLoadMap = {};
    for (const [code, cap] of this.regionalCaps.entries()) {
      regionLoads[code] = {
        regionCode: code,
        currentWorkers: cap.currentWorkers,
        maxCapacity: cap.maxCapacity,
        utilizationPercent: parseFloat(((cap.currentWorkers / cap.maxCapacity) * 100).toFixed(1)),
        safetyCap: cap.safetyCapThreshold,
      };
    }

    // 3. Interface with DotFactory to generate spawn plan
    const dotSpawnPlan = this.factory.planDotSpawns(queueSnapshot, regionLoads);

    // 4. Regional load balancing & safety cap enforcement
    const taskAssignments: TaskAssignment[] = [];
    const safetyCapRejections: ReroutedTaskRecord[] = [];
    const availableRegions = Object.values(regionLoads).sort(
      (a, b) => a.utilizationPercent - b.utilizationPercent
    );

    let regionCursor = 0;

    for (let i = 0; i < pending.length; i++) {
      const task = pending[i];
      let assignedRegion = task.regionCode || availableRegions[regionCursor % availableRegions.length].regionCode;
      regionCursor++;

      // Check safety cap for the target region
      const cap = this.regionalCaps.get(assignedRegion);
      if (cap && cap.currentWorkers >= cap.safetyCapThreshold) {
        // Safety cap exceeded: shed load and reroute to least-utilized region
        const fallbackRegion = availableRegions.find((r) => r.regionCode !== assignedRegion)?.regionCode || 'us-central1';
        safetyCapRejections.push({
          taskId: task.id,
          attemptedRegion: assignedRegion,
          reroutedRegion: fallbackRegion,
          reason: `RFC-003 Regional Safety Cap reached (${cap.currentWorkers}/${cap.safetyCapThreshold}). Load shed to ${fallbackRegion}.`,
        });
        this.safetyViolationsMitigated++;
        assignedRegion = fallbackRegion;
      }

      const priorityScore = Math.round(
        task.priority * task.valuationSignal.economicWeight * task.valuationSignal.slaUrgencyFactor
      );

      taskAssignments.push({
        taskId: task.id,
        dotId: `dot-worker-assigned-${i + 1}`,
        regionCode: assignedRegion,
        priorityScore,
      });
    }

    const estimatedCompletionLatencyMs = Math.max(120, Math.floor(pending.length * 8.5));
    const overallPriorityScore = taskAssignments.reduce((acc, a) => acc + a.priorityScore, 0);

    return {
      planId,
      generatedAt: Date.now(),
      tasksLoadedCount: pending.length,
      dotSpawnPlan,
      taskAssignments,
      safetyCapRejections,
      estimatedCompletionLatencyMs,
      overallPriorityScore,
    };
  }

  /**
   * Executes the computed swarm plan:
   * Spawns Dot workers via the factory, binds them to assigned tasks,
   * updates task state machine, and logs cryptographic execution audit anchors.
   */
  public async executeSwarmPlan(plan?: SwarmExecutionPlan): Promise<{
    executedTasksCount: number;
    spawnedDotsCount: number;
    mitigatedCapCount: number;
    auditHash: string;
  }> {
    const activePlan = plan || this.computeOptimalSwarmPlan();

    // 1. Execute Dot factory spawn requests
    const spawnedDots: DotAgentInstance[] = this.factory.executeSpawnPlan(activePlan.dotSpawnPlan);

    // 2. Bind tasks to spawned workers and transition statuses
    let executedCount = 0;
    for (let i = 0; i < activePlan.taskAssignments.length; i++) {
      const assignment = activePlan.taskAssignments[i];
      const task = this.taskQueue.get(assignment.taskId);
      if (task) {
        const assignedDot = spawnedDots[i % Math.max(1, spawnedDots.length)];
        task.status = 'running';
        task.assignedDotId = assignedDot ? assignedDot.id : assignment.dotId;
        task.regionCode = assignment.regionCode;
        task.updatedAt = Date.now();

        // Increment regional active load
        const cap = this.regionalCaps.get(assignment.regionCode);
        if (cap) {
          cap.currentWorkers++;
        }

        // Simulate immediate execution cycle
        task.status = 'completed';
        executedCount++;
      }
    }

    this.totalExecuted += executedCount;

    // 3. Emit cryptographic audit anchor
    const auditHash = calculateHash(
      `EXEC:${activePlan.planId}:${executedCount}:${spawnedDots.length}:${Date.now()}`
    );

    sovereignEventFabric.emit('O_AGENT_PLAN_EXECUTE', 'AGENT_O_POLICY', {
      planId: activePlan.planId,
      executedTasks: executedCount,
      spawnedDotsCount: spawnedDots.length,
      safetyViolationsMitigated: activePlan.safetyCapRejections.length,
      auditHash,
    });

    return {
      executedTasksCount: executedCount,
      spawnedDotsCount: spawnedDots.length,
      mitigatedCapCount: activePlan.safetyCapRejections.length,
      auditHash,
    };
  }

  /**
   * Retrieves live metrics from the policy engine.
   */
  public getMetrics(): PolicyEngineMetrics {
    const activeDistribution: Record<string, number> = {};
    for (const [code, cap] of this.regionalCaps.entries()) {
      activeDistribution[code] = cap.currentWorkers;
    }

    return {
      totalTasksEnqueued: this.totalEnqueued,
      totalTasksExecuted: this.totalExecuted,
      safetyCapViolationsMitigated: this.safetyViolationsMitigated,
      activeRegionalDistribution: activeDistribution,
      bftQuorumHealthPercent: 99.4,
    };
  }
}

// Export singleton instance for app-wide policy orchestration
export const agentOPolicyEngine = new AgentOPolicyEngine();
export default agentOPolicyEngine;
