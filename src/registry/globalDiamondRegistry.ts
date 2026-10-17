/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { sovereignEventFabric, calculateHash } from '../lib/merkleSpine.ts';

export type UpgradeStatus = 'pending' | 'applied' | 'partial';

export interface DiamondRegistryAgentEntry {
  registryId: string;
  agentId: string;
  name: string;
  originPlatform: string;
  language: string;
  embodiment: string;
  tier: 'AI' | 'AGI' | 'ASI' | 'APEX';
  diamondGrade: 'AAA_DIAMOND' | 'AA_SOVEREIGN' | 'A_VERIFIED' | 'B_COMPLIANT';
  diamondVersion: 'v1.2';
  compositeSwarmIQ: number;
  driftScore: number;
  riskBand: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  valueScoreUsd: number;
  resilienceScore: number;
  alignmentScore: number;
  efficiencyScore: number;
  maxPotentialGrade: string;
  upgradeStatus: UpgradeStatus;
  createdAt: number;
  lastEvaluatedAt: number;
  lastUpgradedAt?: number;
  tags: string[];
  merkleSeal: string;
}

export interface DiamondRegistrySwarmEntry {
  registryId: string;
  swarmId: string;
  name: string;
  swarmType: 'SWARM_CLUSTER' | 'DAG_WORKFLOW' | 'ASI_ORCHESTRATOR' | 'APEX_HYPERCLUSTER';
  memberCount: number;
  platforms: string[];
  languages: string[];
  compositeSwarmIQ: number;
  driftScore: number;
  riskBand: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  valueScoreUsd: number;
  resilienceScore: number;
  coordinationScore: number;
  diamondGrade: 'AAA_DIAMOND' | 'AA_SOVEREIGN' | 'A_VERIFIED' | 'B_COMPLIANT';
  maxPotentialGrade: string;
  upgradeStatus: UpgradeStatus;
  createdAt: number;
  lastEvaluatedAt: number;
  lastUpgradedAt?: number;
  tags: string[];
  merkleSeal: string;
}

export interface RegistryStats {
  totalRegisteredAgents: number;
  totalRegisteredSwarms: number;
  upgradesAppliedCount: number;
  upgradesPendingCount: number;
  averageRegisteredSwarmIQ: number;
  averageRegisteredDriftScore: number;
  topPerformingPlatform: string;
}

export class GlobalDiamondRegistry {
  private agentEntries: Map<string, DiamondRegistryAgentEntry> = new Map();
  private swarmEntries: Map<string, DiamondRegistrySwarmEntry> = new Map();

  constructor() {
    this.seedRegistry();
  }

  private seedRegistry(): void {
    const seedAgents: Array<Omit<DiamondRegistryAgentEntry, 'registryId' | 'merkleSeal'>> = [
      {
        agentId: 'AGT-LIVE-001',
        name: 'Gemini 1.5 Pro Argon Apex Supervisor',
        originPlatform: 'Google Gemini & Vertex AI',
        language: 'TypeScript / C++',
        embodiment: 'PURE_SOFTWARE',
        tier: 'APEX',
        diamondGrade: 'AAA_DIAMOND',
        diamondVersion: 'v1.2',
        compositeSwarmIQ: 98.4,
        driftScore: 0.2,
        riskBand: 'LOW',
        valueScoreUsd: 14200000,
        resilienceScore: 98.0,
        alignmentScore: 99.8,
        efficiencyScore: 96.5,
        maxPotentialGrade: 'AAA_DIAMOND (Max Potential Reached)',
        upgradeStatus: 'applied',
        createdAt: Date.now() - 86400000 * 30,
        lastEvaluatedAt: Date.now(),
        lastUpgradedAt: Date.now() - 86400000 * 2,
        tags: ['cloud-orchestrator', 'apex-consensus', 'z3-verified', 'vertex'],
      },
      {
        agentId: 'AGT-LIVE-002',
        name: 'Claude 3.7 Sonnet Cyclic Tool Specialist',
        originPlatform: 'Anthropic Claude Tooling',
        language: 'Python / TypeScript',
        embodiment: 'PURE_SOFTWARE',
        tier: 'AGI',
        diamondGrade: 'AAA_DIAMOND',
        diamondVersion: 'v1.2',
        compositeSwarmIQ: 94.6,
        driftScore: 0.6,
        riskBand: 'LOW',
        valueScoreUsd: 4800000,
        resilienceScore: 93.0,
        alignmentScore: 99.4,
        efficiencyScore: 91.2,
        maxPotentialGrade: 'AAA_DIAMOND (Max Potential Reached)',
        upgradeStatus: 'applied',
        createdAt: Date.now() - 86400000 * 20,
        lastEvaluatedAt: Date.now(),
        lastUpgradedAt: Date.now() - 86400000 * 4,
        tags: ['mcp-tools', 'ast-refactor', 'cursor-bridge', 'claude'],
      },
      {
        agentId: 'AGT-LIVE-003',
        name: 'openpilot v0.9+ Planetary Fleet Vision Pilot',
        originPlatform: 'Automotive CAN & openpilot',
        language: 'Python / C++',
        embodiment: 'VEHICLE_AUTONOMOUS',
        tier: 'AI',
        diamondGrade: 'AA_SOVEREIGN',
        diamondVersion: 'v1.2',
        compositeSwarmIQ: 93.8,
        driftScore: 1.1,
        riskBand: 'LOW',
        valueScoreUsd: 8400000,
        resilienceScore: 99.2,
        alignmentScore: 98.4,
        efficiencyScore: 96.0,
        maxPotentialGrade: 'AA_SOVEREIGN (Automotive Safety Envelope Ceiling)',
        upgradeStatus: 'applied',
        createdAt: Date.now() - 86400000 * 60,
        lastEvaluatedAt: Date.now(),
        tags: ['automotive', 'can-bus', 'fleet-scale', 'openpilot'],
      },
      {
        agentId: 'AGT-LIVE-004',
        name: 'Unitree Go2 Factory AMR Quadruped Navigator',
        originPlatform: 'Robotics Fleet & ROS2',
        language: 'C++ / ROS2',
        embodiment: 'ROBOTICS_EMBODIED',
        tier: 'AI',
        diamondGrade: 'AA_SOVEREIGN',
        diamondVersion: 'v1.2',
        compositeSwarmIQ: 92.4,
        driftScore: 1.4,
        riskBand: 'LOW',
        valueScoreUsd: 1850000,
        resilienceScore: 96.8,
        alignmentScore: 97.0,
        efficiencyScore: 92.5,
        maxPotentialGrade: 'AA_SOVEREIGN (Industrial Robotics Ceiling)',
        upgradeStatus: 'applied',
        createdAt: Date.now() - 86400000 * 15,
        lastEvaluatedAt: Date.now(),
        tags: ['factory-robotics', 'ros2', 'quadruped', 'slam'],
      },
      {
        agentId: 'AGT-LIVE-005',
        name: 'Unreal Engine 5.4 Adaptive NPC Questmaster',
        originPlatform: 'Unreal Engine Virtual Worlds',
        language: 'C++ / Blueprints',
        embodiment: 'SYNTHETIC_NPC',
        tier: 'AI',
        diamondGrade: 'A_VERIFIED',
        diamondVersion: 'v1.2',
        compositeSwarmIQ: 88.6,
        driftScore: 2.4,
        riskBand: 'LOW',
        valueScoreUsd: 920000,
        resilienceScore: 90.0,
        alignmentScore: 94.2,
        efficiencyScore: 88.5,
        maxPotentialGrade: 'AA_SOVEREIGN (with Z3 Behavioral Envelope)',
        upgradeStatus: 'pending',
        createdAt: Date.now() - 86400000 * 10,
        lastEvaluatedAt: Date.now(),
        tags: ['synthetic-world', 'unreal-5', 'behavior-tree', 'game-npc'],
      },
    ];

    seedAgents.forEach((a) => {
      const registryId = `REG-${a.agentId}`;
      const merkleSeal = calculateHash(`REG:${registryId}:${a.name}:${a.diamondGrade}:${a.createdAt}`);
      this.agentEntries.set(registryId, {
        ...a,
        registryId,
        merkleSeal,
      });
    });

    const seedSwarms: Array<Omit<DiamondRegistrySwarmEntry, 'registryId' | 'merkleSeal'>> = [
      {
        swarmId: 'SWM-APEX-HYPERCLUSTER-01',
        name: 'Planetary Post-Quantum Audit Spine Swarm',
        swarmType: 'APEX_HYPERCLUSTER',
        memberCount: 48920,
        platforms: ['Google Vertex AI', 'Cloud Run', 'NVIDIA NIM'],
        languages: ['Rust', 'C++', 'TypeScript'],
        compositeSwarmIQ: 99.1,
        driftScore: 0.14,
        riskBand: 'LOW',
        valueScoreUsd: 84000000,
        resilienceScore: 99.5,
        coordinationScore: 99.4,
        diamondGrade: 'AAA_DIAMOND',
        maxPotentialGrade: 'AAA_DIAMOND (Supreme Global Spine)',
        upgradeStatus: 'applied',
        createdAt: Date.now() - 86400000 * 45,
        lastEvaluatedAt: Date.now(),
        tags: ['merkle-spine', 'pqc-lattice', 'apex-hypercluster', 'fips-203'],
      },
      {
        swarmId: 'SWM-AGI-DEV-COLLECTIVE',
        name: 'Devin-LangGraph Autonomous Refactor Swarm',
        swarmType: 'DAG_WORKFLOW',
        memberCount: 142000,
        platforms: ['OpenAI Agents SDK', 'Claude Tooling', 'GitHub Actions'],
        languages: ['Python', 'TypeScript'],
        compositeSwarmIQ: 94.2,
        driftScore: 0.82,
        riskBand: 'LOW',
        valueScoreUsd: 42000000,
        resilienceScore: 93.5,
        coordinationScore: 95.0,
        diamondGrade: 'AA_SOVEREIGN',
        maxPotentialGrade: 'AAA_DIAMOND (with Supermajority Quorum Gateway)',
        upgradeStatus: 'partial',
        createdAt: Date.now() - 86400000 * 25,
        lastEvaluatedAt: Date.now(),
        tags: ['langgraph', 'autonomous-pr', 'cleanroom-code', 'devin'],
      },
    ];

    seedSwarms.forEach((s) => {
      const registryId = `REG-${s.swarmId}`;
      const merkleSeal = calculateHash(`REG:${registryId}:${s.name}:${s.diamondGrade}:${s.createdAt}`);
      this.swarmEntries.set(registryId, {
        ...s,
        registryId,
        merkleSeal,
      });
    });
  }

  public registerAgent(agent: Omit<DiamondRegistryAgentEntry, 'registryId' | 'merkleSeal'>): DiamondRegistryAgentEntry {
    const registryId = `REG-${agent.agentId}`;
    const merkleSeal = calculateHash(`REG:${registryId}:${agent.name}:${agent.diamondGrade}:${Date.now()}`);
    const entry: DiamondRegistryAgentEntry = {
      ...agent,
      registryId,
      merkleSeal,
    };
    this.agentEntries.set(registryId, entry);

    sovereignEventFabric.emit('DIAMOND_REGISTRY_RECORD_ADDED', 'GLOBAL_DIAMOND_REGISTRY', {
      registryId,
      agentName: entry.name,
      grade: entry.diamondGrade,
      upgradeStatus: entry.upgradeStatus,
    });

    return entry;
  }

  public updateAgentUpgradeStatus(agentId: string, status: UpgradeStatus, upgradedGrade?: DiamondRegistryAgentEntry['diamondGrade']): DiamondRegistryAgentEntry | null {
    const entry = Array.from(this.agentEntries.values()).find((e) => e.agentId === agentId);
    if (!entry) return null;

    entry.upgradeStatus = status;
    entry.lastUpgradedAt = Date.now();
    if (upgradedGrade) {
      entry.diamondGrade = upgradedGrade;
      entry.compositeSwarmIQ = Math.min(99.6, entry.compositeSwarmIQ + 4.5);
      entry.driftScore = parseFloat((entry.driftScore * 0.4).toFixed(2));
      entry.valueScoreUsd = Math.round(entry.valueScoreUsd * 1.35);
      entry.merkleSeal = calculateHash(`REG:${entry.registryId}:${entry.name}:${entry.diamondGrade}:${Date.now()}`);
    }

    return entry;
  }

  public getAgents(filters?: {
    platform?: string;
    tier?: string;
    upgradeStatus?: UpgradeStatus;
    search?: string;
  }): DiamondRegistryAgentEntry[] {
    let result = Array.from(this.agentEntries.values());

    if (filters?.platform) {
      result = result.filter((e) => e.originPlatform.toLowerCase().includes(filters.platform!.toLowerCase()));
    }
    if (filters?.tier) {
      result = result.filter((e) => e.tier === filters.tier);
    }
    if (filters?.upgradeStatus) {
      result = result.filter((e) => e.upgradeStatus === filters.upgradeStatus);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.language.toLowerCase().includes(q) ||
          e.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    return result.sort((a, b) => b.compositeSwarmIQ - a.compositeSwarmIQ);
  }

  public getSwarms(): DiamondRegistrySwarmEntry[] {
    return Array.from(this.swarmEntries.values()).sort((a, b) => b.compositeSwarmIQ - a.compositeSwarmIQ);
  }

  public getStats(): RegistryStats {
    const agents = Array.from(this.agentEntries.values());
    const swarms = Array.from(this.swarmEntries.values());

    const totalRegisteredAgents = agents.length;
    const totalRegisteredSwarms = swarms.length;
    const upgradesAppliedCount = agents.filter((a) => a.upgradeStatus === 'applied').length;
    const upgradesPendingCount = agents.filter((a) => a.upgradeStatus === 'pending').length;

    const avgSwarmIQ = parseFloat(
      (agents.reduce((sum, a) => sum + a.compositeSwarmIQ, 0) / (agents.length || 1)).toFixed(1)
    );
    const avgDrift = parseFloat(
      (agents.reduce((sum, a) => sum + a.driftScore, 0) / (agents.length || 1)).toFixed(2)
    );

    return {
      totalRegisteredAgents,
      totalRegisteredSwarms,
      upgradesAppliedCount,
      upgradesPendingCount,
      averageRegisteredSwarmIQ: avgSwarmIQ,
      averageRegisteredDriftScore: avgDrift,
      topPerformingPlatform: 'Google Gemini & Vertex AI (98.4 Composite IQ)',
    };
  }
}

export const globalDiamondRegistry = new GlobalDiamondRegistry();
export default globalDiamondRegistry;
