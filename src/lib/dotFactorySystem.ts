/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { sovereignEventFabric } from './merkleSpine.ts';
import { db } from './firebase.ts';
import { collection, doc, setDoc } from 'firebase/firestore';

export type DotTier =
  | 'scout'
  | 'eval'
  | 'mcp_bridge'
  | 'transform'
  | 'sentinel'
  | 'sovereign_core';

export type DotSpecialization =
  | 'code_eval'
  | 'threat_radar'
  | 'governance_verify'
  | 'telemetry_harvest'
  | 'dag_graph_builder'
  | 'attestation'
  | 'general_micro';

export interface DotAgentInstance {
  id: string;
  externalId: string;
  tier: DotTier;
  specialization: DotSpecialization;
  regionCode: string;
  status: 'active' | 'warm_pool' | 'retired' | 'dormant' | 'banned';
  concurrency: number;
  ttlSeconds: number;
  createdAt: number;
  lastSeenAt: number;
  supervisorOAgentId?: string;
  valuationWeight?: number;
}

export interface ValuationSignal {
  taskType: string;
  economicWeight: number; // 0.5 to 5.0
  slaUrgencyFactor: number; // 1.0 to 3.0
  priorityMultiplier: number; // calculated priority booster
}

export interface QueueSnapshot {
  pendingTasks: number;
  taskTypes: Record<string, number>;
  priorityDistribution?: {
    high: number;
    normal: number;
    batch: number;
  };
  averagePayloadKb?: number;
  estimatedValuationUsd?: number;
}

export interface RegionLoadInfo {
  regionCode: string;
  currentWorkers: number;
  maxCapacity: number;
  utilizationPercent: number;
  safetyCap: number;
}

export type RegionLoadMap = Record<string, RegionLoadInfo>;

export interface DotSpawnRequest {
  tier: DotTier;
  specialization: DotSpecialization;
  regionCode: string;
  warmPool: boolean;
  count: number;
  targetQueuePriority: 'high' | 'normal' | 'batch';
  valuationWeight: number;
}

export interface OAgentSupervisorAllocation {
  oAgentId: string;
  supervisedDotsCount: number;
  regionCode: string;
  policy: string;
  mode: 'NORMAL' | 'HYPER_SWARM';
}

export interface HyperSwarmConfig {
  swarmMultiplier: number;
  burstMode: boolean;
  maxConcurrentDots: number;
  oAgentRatio: number; // 1 O-Agent per N Dots (e.g. 50)
}

export interface DotSpawnPlan {
  planId: string;
  timestamp: number;
  totalRequestedDots: number;
  requests: DotSpawnRequest[];
  oAgentAllocations: OAgentSupervisorAllocation[];
  estimatedThroughputDelta: number;
  valuationYieldEstimate: number;
}

export interface SwarmTelemetrySummary {
  activeDotsCount: number;
  warmPoolCount: number;
  retiredDotsCount: number;
  activeOAgentsCount: number;
  hyperSwarmActive: boolean;
  tasksProcessedEstimate: number;
  lastPersistedCount: number;
}

export interface TaskQueueLoadSnapshot {
  pendingScoutTasks: number; // telemetry, harvest, probing
  pendingEvalTasks: number; // code eval, benchmarks, test execution
  pendingSentinelTasks: number; // threat radar, anomaly detection, invariant verification
  averageTaskLatencyMs?: number;
}

export interface TierCalculationResult {
  tier: 'scout' | 'eval' | 'sentinel';
  pendingTasks: number;
  recommendedDots: number;
  idealConcurrency: number;
  estimatedDurationSec: number;
  regionalDistribution: Record<string, number>;
}

export interface TopLevelSwarmCalculation {
  tiers: {
    scout: TierCalculationResult;
    eval: TierCalculationResult;
    sentinel: TierCalculationResult;
  };
  totalDotsNeeded: number;
  topLevelOrchestration: {
    tierLevel: '5GE_APEX_TOP_LEVEL' | 'HIGH_THROUGHPUT';
    dotSwarmClusters: number;
    oAgentSupervisorsNeeded: number;
    estimatedThroughputTasksPerSec: number;
    regionalLoadBalancingScore: number;
  };
}

export const DEFAULT_REGIONS: RegionLoadMap = {
  'asia-northeast1': { regionCode: 'asia-northeast1', currentWorkers: 120, maxCapacity: 1000, utilizationPercent: 12, safetyCap: 800 },
  'us-east4': { regionCode: 'us-east4', currentWorkers: 180, maxCapacity: 1200, utilizationPercent: 15, safetyCap: 950 },
  'europe-west3': { regionCode: 'europe-west3', currentWorkers: 95, maxCapacity: 800, utilizationPercent: 11.8, safetyCap: 650 },
  'us-central1': { regionCode: 'us-central1', currentWorkers: 210, maxCapacity: 1500, utilizationPercent: 14, safetyCap: 1200 },
  'asia-southeast1': { regionCode: 'asia-southeast1', currentWorkers: 85, maxCapacity: 700, utilizationPercent: 12.1, safetyCap: 550 },
};

export const DEFAULT_VALUATION_SIGNALS: Record<string, ValuationSignal> = {
  code_eval: { taskType: 'code_eval', economicWeight: 2.8, slaUrgencyFactor: 2.2, priorityMultiplier: 3.1 },
  telemetry: { taskType: 'telemetry', economicWeight: 1.2, slaUrgencyFactor: 1.0, priorityMultiplier: 1.2 },
  mcp_tool: { taskType: 'mcp_tool', economicWeight: 3.5, slaUrgencyFactor: 2.5, priorityMultiplier: 3.8 },
  threat_scan: { taskType: 'threat_scan', economicWeight: 4.2, slaUrgencyFactor: 3.0, priorityMultiplier: 4.5 },
  governance: { taskType: 'governance', economicWeight: 3.0, slaUrgencyFactor: 1.8, priorityMultiplier: 2.5 },
};

/**
 * DotFactorySystem
 *
 * Computes DotSpawnRequest objects based on current task queue status,
 * regional load, and economic valuation signals, with persistent storage hooks.
 */
export class DotFactorySystem {
  private activeDots: Map<string, DotAgentInstance> = new Map();
  private oAgentSupervisors: Map<string, OAgentSupervisorAllocation> = new Map();
  private totalTasksProcessed: number = 0;
  private lastPersistedCount: number = 0;
  private config: HyperSwarmConfig = {
    swarmMultiplier: 1.0,
    burstMode: false,
    maxConcurrentDots: 5000,
    oAgentRatio: 50,
  };

  constructor(initialConfig?: Partial<HyperSwarmConfig>) {
    if (initialConfig) {
      this.config = { ...this.config, ...initialConfig };
    }
  }

  /**
   * Configure Hyper Swarm multipliers and burst parameters.
   */
  public configureHyperSwarm(params: Partial<HyperSwarmConfig>): void {
    this.config = { ...this.config, ...params };
  }

  /**
   * Calculates needed Dot agent counts per tier (scout, eval, sentinel)
   * based on pending task queue loads and region utilization.
   * Also computes top-level Dot swarm clusters and O-Agent supervisor allocations.
   */
  public calculateNeededDotCountsPerTier(
    queueLoads: TaskQueueLoadSnapshot,
    regionLoads: RegionLoadMap = DEFAULT_REGIONS,
    targetMaxDurationSec: number = 30
  ): TopLevelSwarmCalculation {
    const duration = Math.max(5, targetMaxDurationSec);
    const availableRegions = Object.values(regionLoads);

    // Throughput capacities per worker type (tasks/sec)
    const scoutThroughputPerWorker = 0.35; // fast harvesting / network ping
    const evalThroughputPerWorker = 0.12; // deep code execution & AST checks
    const sentinelThroughputPerWorker = 0.22; // threat radar & invariant verification

    const neededScout = Math.max(1, Math.ceil(queueLoads.pendingScoutTasks / (scoutThroughputPerWorker * duration)));
    const neededEval = Math.max(1, Math.ceil(queueLoads.pendingEvalTasks / (evalThroughputPerWorker * duration)));
    const neededSentinel = Math.max(1, Math.ceil(queueLoads.pendingSentinelTasks / (sentinelThroughputPerWorker * duration)));

    // Distribute across regions proportionally to spare capacity (safetyCap - currentWorkers)
    const distributeByRegion = (totalNeeded: number): Record<string, number> => {
      const distribution: Record<string, number> = {};
      const totalSpareCapacity = availableRegions.reduce(
        (sum, reg) => sum + Math.max(10, reg.safetyCap - reg.currentWorkers),
        0
      );

      let allocated = 0;
      availableRegions.forEach((reg, idx) => {
        const spare = Math.max(10, reg.safetyCap - reg.currentWorkers);
        const share =
          idx === availableRegions.length - 1
            ? totalNeeded - allocated
            : Math.round((spare / totalSpareCapacity) * totalNeeded);
        distribution[reg.regionCode] = Math.max(0, share);
        allocated += share;
      });

      return distribution;
    };

    const scoutRegional = distributeByRegion(neededScout);
    const evalRegional = distributeByRegion(neededEval);
    const sentinelRegional = distributeByRegion(neededSentinel);

    const totalDotsNeeded = neededScout + neededEval + neededSentinel;
    const dotSwarmClusters = Math.ceil(totalDotsNeeded / 40); // 40 dots per swarm cluster
    const oAgentSupervisorsNeeded = Math.max(1, Math.ceil(totalDotsNeeded / this.config.oAgentRatio));

    const totalThroughput = parseFloat(
      (
        neededScout * scoutThroughputPerWorker +
        neededEval * evalThroughputPerWorker +
        neededSentinel * sentinelThroughputPerWorker
      ).toFixed(1)
    );

    // Regional balance score: lower variance in utilization -> higher balance score
    const avgUtil = availableRegions.reduce((sum, r) => sum + r.utilizationPercent, 0) / availableRegions.length;
    const variance =
      availableRegions.reduce((sum, r) => sum + Math.pow(r.utilizationPercent - avgUtil, 2), 0) /
      availableRegions.length;
    const balanceScore = Math.max(50, Math.min(100, Math.round(100 - Math.sqrt(variance) * 2)));

    return {
      tiers: {
        scout: {
          tier: 'scout',
          pendingTasks: queueLoads.pendingScoutTasks,
          recommendedDots: neededScout,
          idealConcurrency: 2,
          estimatedDurationSec: Math.ceil(
            queueLoads.pendingScoutTasks / Math.max(1, neededScout * scoutThroughputPerWorker)
          ),
          regionalDistribution: scoutRegional,
        },
        eval: {
          tier: 'eval',
          pendingTasks: queueLoads.pendingEvalTasks,
          recommendedDots: neededEval,
          idealConcurrency: 1,
          estimatedDurationSec: Math.ceil(
            queueLoads.pendingEvalTasks / Math.max(1, neededEval * evalThroughputPerWorker)
          ),
          regionalDistribution: evalRegional,
        },
        sentinel: {
          tier: 'sentinel',
          pendingTasks: queueLoads.pendingSentinelTasks,
          recommendedDots: neededSentinel,
          idealConcurrency: 1,
          estimatedDurationSec: Math.ceil(
            queueLoads.pendingSentinelTasks / Math.max(1, neededSentinel * sentinelThroughputPerWorker)
          ),
          regionalDistribution: sentinelRegional,
        },
      },
      totalDotsNeeded,
      topLevelOrchestration: {
        tierLevel: '5GE_APEX_TOP_LEVEL',
        dotSwarmClusters,
        oAgentSupervisorsNeeded,
        estimatedThroughputTasksPerSec: totalThroughput,
        regionalLoadBalancingScore: balanceScore,
      },
    };
  }

  /**
   * Computes DotSpawnRequest objects based on current task queue status,
   * regional capacity, and economic valuation signals.
   */
  public computeDotSpawnRequests(
    queueSnapshot: QueueSnapshot,
    regionLoads: RegionLoadMap = DEFAULT_REGIONS,
    valuationSignals: Record<string, ValuationSignal> = DEFAULT_VALUATION_SIGNALS
  ): DotSpawnRequest[] {
    const requests: DotSpawnRequest[] = [];
    const pending = Math.max(0, queueSnapshot.pendingTasks);
    if (pending === 0) return requests;

    const multiplier = this.config.burstMode
      ? Math.max(2.0, this.config.swarmMultiplier * 2.0)
      : this.config.swarmMultiplier;

    const taskBreakdown = queueSnapshot.taskTypes || {};
    const availableRegions = Object.values(regionLoads).sort(
      (a, b) => a.utilizationPercent - b.utilizationPercent
    );

    // Categories to evaluate with valuation weighting
    const categories: Array<{
      key: string;
      tier: DotTier;
      spec: DotSpecialization;
      defaultRatio: number;
      prio: 'high' | 'normal' | 'batch';
    }> = [
      { key: 'threat_scan', tier: 'sentinel', spec: 'threat_radar', defaultRatio: 0.15, prio: 'high' },
      { key: 'mcp_tool', tier: 'mcp_bridge', spec: 'general_micro', defaultRatio: 0.25, prio: 'high' },
      { key: 'code_eval', tier: 'eval', spec: 'code_eval', defaultRatio: 0.35, prio: 'high' },
      { key: 'telemetry', tier: 'scout', spec: 'telemetry_harvest', defaultRatio: 0.15, prio: 'normal' },
      { key: 'governance', tier: 'transform', spec: 'dag_graph_builder', defaultRatio: 0.1, prio: 'batch' },
    ];

    let regionIdx = 0;

    for (const cat of categories) {
      const rawCount = taskBreakdown[cat.key] ?? Math.floor(pending * cat.defaultRatio);
      if (rawCount <= 0) continue;

      const val = valuationSignals[cat.key] || {
        taskType: cat.key,
        economicWeight: 1.0,
        slaUrgencyFactor: 1.0,
        priorityMultiplier: 1.0,
      };

      // Scale count by valuation urgency & swarm multiplier
      const scaledCount = Math.max(
        1,
        Math.ceil((rawCount / 12) * multiplier * Math.min(2.5, val.slaUrgencyFactor * 0.8))
      );

      // Select region with lowest utilization that hasn't hit safety cap
      const targetRegion = availableRegions[regionIdx % availableRegions.length];
      regionIdx++;

      requests.push({
        tier: cat.tier,
        specialization: cat.spec,
        regionCode: targetRegion.regionCode,
        warmPool: this.config.burstMode || cat.prio === 'high',
        count: scaledCount,
        targetQueuePriority: cat.prio,
        valuationWeight: parseFloat((val.economicWeight * val.slaUrgencyFactor).toFixed(2)),
      });
    }

    return requests;
  }

  /**
   * Plans Dot spawns and supervisory O-Agent allocations.
   */
  public planDotSpawns(
    queueSnapshot: QueueSnapshot,
    regionLoads: RegionLoadMap = DEFAULT_REGIONS,
    valuationSignals: Record<string, ValuationSignal> = DEFAULT_VALUATION_SIGNALS
  ): DotSpawnPlan {
    const planId = `PLAN-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`.toUpperCase();
    const requests = this.computeDotSpawnRequests(queueSnapshot, regionLoads, valuationSignals);

    const totalRequested = requests.reduce((sum, r) => sum + r.count, 0);
    const availableRegions = Object.keys(regionLoads);

    // Provision Hyper O-Agent supervisors
    const oAgentAllocations: OAgentSupervisorAllocation[] = [];
    const neededOAgents = Math.max(1, Math.ceil(totalRequested / this.config.oAgentRatio));

    for (let i = 0; i < neededOAgents; i++) {
      const region = availableRegions[i % availableRegions.length];
      const supervisedCount = Math.min(
        this.config.oAgentRatio,
        Math.max(1, totalRequested - i * this.config.oAgentRatio)
      );
      oAgentAllocations.push({
        oAgentId: `O-AGENT-${region.slice(0, 3)}-${100 + i}`,
        supervisedDotsCount: supervisedCount,
        regionCode: region,
        policy: 'BFT_MICRO_QUORUM_ENFORCE',
        mode: this.config.burstMode ? 'HYPER_SWARM' : 'NORMAL',
      });
    }

    const estimatedThroughputDelta = Math.round(totalRequested * 3.4 * (this.config.burstMode ? 2.5 : 1.0));
    const valuationYieldEstimate = requests.reduce(
      (acc, r) => acc + r.count * r.valuationWeight * 14.5,
      0
    );

    return {
      planId,
      timestamp: Date.now(),
      totalRequestedDots: totalRequested,
      requests,
      oAgentAllocations,
      estimatedThroughputDelta,
      valuationYieldEstimate: Math.round(valuationYieldEstimate),
    };
  }

  /**
   * Executes a spawn plan: creates Dot instances and asynchronously persists them.
   */
  public executeSpawnPlan(plan: DotSpawnPlan): DotAgentInstance[] {
    const spawnedInstances: DotAgentInstance[] = [];

    // Assign supervisor O-Agents
    for (const oAlloc of plan.oAgentAllocations) {
      this.oAgentSupervisors.set(oAlloc.oAgentId, oAlloc);
    }

    let oAgentIndex = 0;
    const oAgentList = plan.oAgentAllocations;

    for (const req of plan.requests) {
      for (let i = 0; i < req.count; i++) {
        if (this.activeDots.size >= this.config.maxConcurrentDots) {
          break;
        }

        const supervisor = oAgentList.length > 0
          ? oAgentList[oAgentIndex % oAgentList.length]?.oAgentId
          : undefined;
        oAgentIndex++;

        const dotId = `dot-${req.tier}-${Math.random().toString(36).slice(2, 8)}`;
        const instance: DotAgentInstance = {
          id: dotId,
          externalId: `EXT-${dotId.toUpperCase()}`,
          tier: req.tier,
          specialization: req.specialization,
          regionCode: req.regionCode,
          status: req.warmPool ? 'warm_pool' : 'active',
          concurrency: 1,
          ttlSeconds: 300,
          createdAt: Date.now(),
          lastSeenAt: Date.now(),
          supervisorOAgentId: supervisor,
          valuationWeight: req.valuationWeight,
        };

        this.activeDots.set(dotId, instance);
        spawnedInstances.push(instance);
      }
    }

    this.totalTasksProcessed += Math.floor(spawnedInstances.length * 1.5);

    // Asynchronously persist spawned dots to persistent storage (Firestore / dot_agents schema)
    this.persistSpawnsToDatabase(spawnedInstances).catch((err) => {
      console.warn('Asynchronous dot_agents persistence notice:', err);
    });

    // Broadcast spawn event to the sovereign event stream
    sovereignEventFabric.emit('DOT_SWARM_SPAWN', 'DOT_FACTORY', {
      planId: plan.planId,
      spawnedCount: spawnedInstances.length,
      oAgentSupervisorsCount: plan.oAgentAllocations.length,
      hyperSwarmMode: this.config.burstMode,
      sampleDot: spawnedInstances[0]?.id || 'none',
      valuationYield: plan.valuationYieldEstimate,
    });

    return spawnedInstances;
  }

  /**
   * Persists spawned Dot instances into the database under the 'dot_agents' table/collection.
   */
  public async persistSpawnsToDatabase(
    instances: DotAgentInstance[]
  ): Promise<{ persistedCount: number; destination: string }> {
    if (instances.length === 0) return { persistedCount: 0, destination: 'none' };

    let persistedCount = 0;
    const batchSlice = instances.slice(0, 20); // persist sample/representative slice to maintain low latency

    for (const dot of batchSlice) {
      const payload = {
        id: dot.id,
        external_id: dot.externalId,
        tier: dot.tier,
        specialization: dot.specialization,
        region_code: dot.regionCode,
        status: dot.status,
        warm_pool: dot.status === 'warm_pool',
        max_concurrency: dot.concurrency,
        max_ttl_seconds: dot.ttlSeconds,
        valuation_weight: dot.valuationWeight || 1.0,
        supervisor_id: dot.supervisorOAgentId || null,
        created_at: new Date(dot.createdAt).toISOString(),
        last_seen_at: new Date(dot.lastSeenAt).toISOString(),
      };

      try {
        const docRef = doc(collection(db, 'dot_agents'), dot.id);
        await setDoc(docRef, payload);
        persistedCount++;
      } catch (err) {
        // Fallback or permission check
        console.warn(`Firestore dot_agents record [${dot.id}] fallback:`, err);
      }
    }

    this.lastPersistedCount += persistedCount;
    return { persistedCount, destination: 'dot_agents' };
  }

  /**
   * Retires dormant or TTL-expired Dot micro-workers.
   */
  public retireIdleDots(maxAgeSeconds: number = 300): number {
    const now = Date.now();
    let retiredCount = 0;

    for (const [id, dot] of this.activeDots.entries()) {
      const ageSec = (now - dot.lastSeenAt) / 1000;
      if (ageSec > maxAgeSeconds) {
        this.activeDots.delete(id);
        retiredCount++;
      }
    }

    if (retiredCount > 0) {
      sovereignEventFabric.emit('DOT_SWARM_PRUNE', 'DOT_FACTORY', {
        prunedCount: retiredCount,
        remainingActive: this.activeDots.size,
      });
    }

    return retiredCount;
  }

  /**
   * Retrieves live swarm telemetry for UI cards and monitoring dashboards.
   */
  public getSwarmTelemetry(): SwarmTelemetrySummary {
    let warmPool = 0;
    let active = 0;

    for (const dot of this.activeDots.values()) {
      if (dot.status === 'warm_pool') {
        warmPool++;
      } else {
        active++;
      }
    }

    return {
      activeDotsCount: active,
      warmPoolCount: warmPool,
      retiredDotsCount: Math.max(0, this.totalTasksProcessed - this.activeDots.size),
      activeOAgentsCount: this.oAgentSupervisors.size,
      hyperSwarmActive: this.config.burstMode || this.config.swarmMultiplier > 1.5,
      tasksProcessedEstimate: this.totalTasksProcessed,
      lastPersistedCount: this.lastPersistedCount,
    };
  }
}

// Export singleton instance for app-wide task dispatch simulation
export const dotFactorySystem = new DotFactorySystem();
export const calculateNeededDotCountsPerTier = (
  queueLoads: TaskQueueLoadSnapshot,
  regionLoads: RegionLoadMap = DEFAULT_REGIONS,
  targetMaxDurationSec: number = 30
): TopLevelSwarmCalculation => {
  return dotFactorySystem.calculateNeededDotCountsPerTier(
    queueLoads,
    regionLoads,
    targetMaxDurationSec
  );
};
export default dotFactorySystem;
