/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { sovereignEventFabric, calculateHash } from '../lib/merkleSpine.ts';
import { sovereignSkillSystem, SovereignSkill } from '../skills/sovereignSkillSystem.ts';

export type LifecycleStage =
  | 'GOVERNED_BIRTH'
  | 'CONTINUOUS_EVALUATION'
  | 'AUTONOMOUS_UPGRADE'
  | 'REPLAY_AUDIT'
  | 'RETIRED_TOMBSTONE';

export interface GovernedAgentRecord {
  agentId: string;
  name: string;
  stage: LifecycleStage;
  effectiveSkillLattice: string[];
  lastTransitionTimestamp: number;
  deterministicSupremacyEnforced: boolean;
  activeTreatyBinds: string[];
  merkleWitnessSeal: string;
}

export interface IntelligenceLedgerEntry {
  ledgerId: string;
  blockHeight: number;
  eventType: 'GOVERNED_BIRTH' | 'SKILL_ARBITRATION' | 'UPGRADE_COMMITTED' | 'DRIFT_INTERVENTION' | 'TREATY_RATIFICATION' | 'RETIREMENT';
  agentId?: string;
  primarySkillId: string;
  summary: string;
  merkleLeafHash: string;
  timestamp: number;
  advisoryArgonFlag: boolean;
}

export interface EvolutionProposal {
  proposalId: string;
  proposalType: 'NEW_SKILL' | 'SKILL_AMENDMENT' | 'GOVERNANCE_TREATY_EXTENSION' | 'KERNEL_BOUND_UPDATE';
  title: string;
  rationale: string;
  targetEntities: string[];
  projectedIQImpact: number;
  constitutionalSafetyProof: string;
  status: 'PROPOSED_ADVISORY' | 'KERNEL_APPROVED' | 'RATIFIED_MERKLE';
  proposedAt: number;
}

export interface RouterDispatchDecision {
  workflowId: 'FULL_LAB_RUN' | 'SOVEREIGN_AUDIT_RUN' | 'TREATY_RATIFICATION' | 'CENSUS_EVALUATION' | 'CENSUS_UPGRADE' | 'GENOME_SURVEILLANCE';
  routingRationale: string;
  governingSkills: string[];
  advisoryLevel: 'DETERMINISTIC_ENFORCED' | 'ARGON_ADVISORY_PROPOSAL';
  dispatchProof: string;
}

export class PlanetarySkillSpine {
  private governedAgents: Map<string, GovernedAgentRecord> = new Map();
  private ledger: IntelligenceLedgerEntry[] = [];
  private evolutionProposals: EvolutionProposal[] = [];
  private currentBlockHeight: number = 482910;

  constructor() {
    this.seedSpineData();
  }

  private seedSpineData(): void {
    // Seed initial governed agents
    const initialAgents: Array<Omit<GovernedAgentRecord, 'merkleWitnessSeal'>> = [
      {
        agentId: 'AGT-LIVE-001',
        name: 'Gemini 1.5 Pro Argon Apex Supervisor',
        stage: 'ACTIVE_EVALUATED' as LifecycleStage,
        effectiveSkillLattice: ['SIM-1.0', 'SKG-1.1', 'AOS-1.0', 'CEP-2.0', 'CUP-5.0'],
        lastTransitionTimestamp: Date.now() - 3600000 * 4,
        deterministicSupremacyEnforced: true,
        activeTreatyBinds: ['Zurich Accord', 'GSNA Charter'],
      },
      {
        agentId: 'AGT-LIVE-002',
        name: 'Claude 3.7 Sonnet Cyclic Tool Specialist',
        stage: 'ACTIVE_EVALUATED' as LifecycleStage,
        effectiveSkillLattice: ['SIM-1.0', 'SKG-1.1', 'CIP-1.0', 'CEP-2.0'],
        lastTransitionTimestamp: Date.now() - 3600000 * 12,
        deterministicSupremacyEnforced: true,
        activeTreatyBinds: ['Paris Convention'],
      },
      {
        agentId: 'AGT-LIVE-003',
        name: 'openpilot v0.9+ Planetary Fleet Vision Pilot',
        stage: 'CONTINUOUS_EVALUATION' as LifecycleStage,
        effectiveSkillLattice: ['SIM-1.0', 'SKG-1.1', 'DST-3.0', 'CAP-4.0'],
        lastTransitionTimestamp: Date.now() - 3600000 * 24,
        deterministicSupremacyEnforced: true,
        activeTreatyBinds: ['Tokyo-Pacific Compact'],
      },
      {
        agentId: 'AGT-LIVE-004',
        name: 'Unitree Go2 Factory AMR Quadruped Navigator',
        stage: 'AUTONOMOUS_UPGRADE' as LifecycleStage,
        effectiveSkillLattice: ['SIM-1.0', 'SKG-1.1', 'CUP-5.0'],
        lastTransitionTimestamp: Date.now() - 3600000 * 2,
        deterministicSupremacyEnforced: true,
        activeTreatyBinds: ['Zurich Accord'],
      },
    ];

    initialAgents.forEach((a) => {
      const seal = calculateHash(`SPINE:RECORD:${a.agentId}:${a.stage}:${a.lastTransitionTimestamp}`);
      this.governedAgents.set(a.agentId, {
        ...a,
        merkleWitnessSeal: seal,
      });
    });

    // Seed initial ledger entries
    this.ledger = [
      {
        ledgerId: 'LEDGER-001',
        blockHeight: this.currentBlockHeight - 4,
        eventType: 'GOVERNED_BIRTH',
        agentId: 'AGT-LIVE-001',
        primarySkillId: 'CIP-1.0',
        summary: 'Governed birth under SIM-1.0 Meta-Constitution. Automated binding of SKG-1.1 Zero-Trust and AOS-1.0 Argon Oversight.',
        merkleLeafHash: calculateHash('LEDGER:BIRTH:AGT-LIVE-001'),
        timestamp: Date.now() - 3600000 * 24,
        advisoryArgonFlag: false,
      },
      {
        ledgerId: 'LEDGER-002',
        blockHeight: this.currentBlockHeight - 3,
        eventType: 'TREATY_RATIFICATION',
        agentId: 'AGT-LIVE-001',
        primarySkillId: 'GOV-4',
        summary: 'GSNA Diplomacy Ring ratified Zurich Accord Parity Treaty with BFT Quorum agreement of 94.2%.',
        merkleLeafHash: calculateHash('LEDGER:RATIFICATION:ZURICH'),
        timestamp: Date.now() - 3600000 * 18,
        advisoryArgonFlag: false,
      },
      {
        ledgerId: 'LEDGER-003',
        blockHeight: this.currentBlockHeight - 2,
        eventType: 'UPGRADE_COMMITTED',
        agentId: 'AGT-LIVE-004',
        primarySkillId: 'CUP-5.0',
        summary: 'Unitree AMR injected with OpenClawSafetyEnvelope.hpp kinetic clamps. Grade elevated to AA_SOVEREIGN.',
        merkleLeafHash: calculateHash('LEDGER:UPGRADE:UNITREE_004'),
        timestamp: Date.now() - 3600000 * 6,
        advisoryArgonFlag: false,
      },
      {
        ledgerId: 'LEDGER-004',
        blockHeight: this.currentBlockHeight - 1,
        eventType: 'SKILL_ARBITRATION',
        agentId: 'AGT-LIVE-002',
        primarySkillId: 'SIM-1.0',
        summary: 'SIM-1.0 resolved conflict: Sovereign Kernel memory boundary (RFC-003 64KB) superseded speculative tool expansion.',
        merkleLeafHash: calculateHash('LEDGER:ARBITRATION:SIM_1_0'),
        timestamp: Date.now() - 3600000 * 1,
        advisoryArgonFlag: true,
      },
    ];

    // Seed evolution proposals
    this.evolutionProposals = [
      {
        proposalId: 'PROP-EVO-001',
        proposalType: 'NEW_SKILL',
        title: 'Photogrammetric Micro-Luster Profiler (PML-1.0)',
        rationale: 'Deep relief cartwheel curvature analysis for high-grade 19th-century Morgan silver dollars.',
        targetEntities: ['CoinRarity Pro', 'FLR-7 Full Lab Run'],
        projectedIQImpact: 4.2,
        constitutionalSafetyProof: 'Z3_SAT_PROOF_BOUNDED_AST',
        status: 'RATIFIED_MERKLE',
        proposedAt: Date.now() - 86400000 * 2,
      },
      {
        proposalId: 'PROP-EVO-002',
        proposalType: 'KERNEL_BOUND_UPDATE',
        title: 'RFC-003 Dynamic Microsegmentation Frame Buffer Scaling',
        rationale: 'Allow 96KB burst buffers specifically for multi-plate 8K photogrammetry elevation matrices under AMD SEV-SNP enclaves.',
        targetEntities: ['Sovereign Kernel', 'SKG-1.1'],
        projectedIQImpact: 6.8,
        constitutionalSafetyProof: 'PENDING_BFT_SUPERMAJORITY_VOTE',
        status: 'PROPOSED_ADVISORY',
        proposedAt: Date.now() - 3600000 * 5,
      },
    ];
  }

  /**
   * Resolves effective Skill Lattice for any agent, guaranteeing SIM-1.0, SKG-1.1, and AOS-1.0.
   */
  public resolveAgentLattice(agentId: string, requestedSkillIds: string[], isArgonTarget: boolean = false): string[] {
    const latticeSet = new Set<string>(['SIM-1.0', 'SKG-1.1']); // Always mandatory
    if (isArgonTarget) {
      latticeSet.add('AOS-1.0'); // Mandatory for Argon reasoning
    }
    requestedSkillIds.forEach((id) => latticeSet.add(id));
    return Array.from(latticeSet);
  }

  /**
   * Planetary Agent Lifecycle Engine (PALE-1.0) transition method.
   */
  public advanceAgentStage(agentId: string, targetStage: LifecycleStage, note: string): GovernedAgentRecord | null {
    const existing = this.governedAgents.get(agentId);
    if (!existing) return null;

    existing.stage = targetStage;
    existing.lastTransitionTimestamp = Date.now();
    existing.merkleWitnessSeal = calculateHash(`LIFECYCLE:${agentId}:${targetStage}:${Date.now()}`);

    this.currentBlockHeight += 1;
    const entry: IntelligenceLedgerEntry = {
      ledgerId: `LEDGER-${Date.now().toString(36).toUpperCase()}`,
      blockHeight: this.currentBlockHeight,
      eventType: targetStage === 'RETIRED_TOMBSTONE' ? 'RETIREMENT' : targetStage === 'AUTONOMOUS_UPGRADE' ? 'UPGRADE_COMMITTED' : 'DRIFT_INTERVENTION',
      agentId,
      primarySkillId: 'SIM-1.0',
      summary: `PALE-1.0 transition: ${existing.name} advanced to ${targetStage}. ${note}`,
      merkleLeafHash: existing.merkleWitnessSeal,
      timestamp: Date.now(),
      advisoryArgonFlag: false,
    };

    this.ledger.unshift(entry);

    sovereignEventFabric.emit('PLANETARY_LIFECYCLE_STAGE_CHANGED', 'PLANETARY_SKILL_SPINE', {
      agentId,
      stage: targetStage,
      blockHeight: this.currentBlockHeight,
    });

    return existing;
  }

  /**
   * Planetary Intelligence Router (PIR-1.0) dispatch engine.
   */
  public routeWorkflow(intent: string, payloadSummary: string): RouterDispatchDecision {
    const text = (intent + ' ' + payloadSummary).toLowerCase();

    if (text.includes('coin') || text.includes('sheldon') || text.includes('die-state') || text.includes('plate')) {
      return {
        workflowId: 'FULL_LAB_RUN',
        routingRationale: 'Numismatic specimen plate detected. Dispatched to FLR-7 with SGP-1.0 Sheldon invariant rules.',
        governingSkills: ['SIM-1.0', 'SGP-1.0', 'FLR-7', 'DST-3.0'],
        advisoryLevel: 'DETERMINISTIC_ENFORCED',
        dispatchProof: calculateHash(`DISPATCH:FLR7:${Date.now()}`),
      };
    }

    if (text.includes('treaty') || text.includes('zurich') || text.includes('paris') || text.includes('diplomacy')) {
      return {
        workflowId: 'TREATY_RATIFICATION',
        routingRationale: 'Inter-constitutional treaty clause detected. Dispatched to AGENT-RING-1.0 under GOV-4.',
        governingSkills: ['SIM-1.0', 'GOV-4', 'AGENT-RING-1.0'],
        advisoryLevel: 'DETERMINISTIC_ENFORCED',
        dispatchProof: calculateHash(`DISPATCH:TREATY:${Date.now()}`),
      };
    }

    if (text.includes('upgrade') || text.includes('patch') || text.includes('vulnerability')) {
      return {
        workflowId: 'CENSUS_UPGRADE',
        routingRationale: 'Remediation request detected. Dispatched to CUP-5.0 for automatic code scaffolding.',
        governingSkills: ['SIM-1.0', 'CUP-5.0', 'SKG-1.1'],
        advisoryLevel: 'DETERMINISTIC_ENFORCED',
        dispatchProof: calculateHash(`DISPATCH:UPGRADE:${Date.now()}`),
      };
    }

    if (text.includes('counterfeit') || text.includes('spark') || text.includes('genome')) {
      return {
        workflowId: 'GENOME_SURVEILLANCE',
        routingRationale: 'Suspect metallurgical anomaly detected. Dispatched to CGI-2.0 genome surveillance.',
        governingSkills: ['SIM-1.0', 'CGI-2.0', 'SKG-1.1'],
        advisoryLevel: 'DETERMINISTIC_ENFORCED',
        dispatchProof: calculateHash(`DISPATCH:CGI:${Date.now()}`),
      };
    }

    // Default to Sovereign Audit Run
    return {
      workflowId: 'SOVEREIGN_AUDIT_RUN',
      routingRationale: 'General governance audit dispatched to CAP-4.0 continuous Merkle replay.',
      governingSkills: ['SIM-1.0', 'CAP-4.0', 'SKG-1.1', 'AOS-1.0'],
      advisoryLevel: 'ARGON_ADVISORY_PROPOSAL',
      dispatchProof: calculateHash(`DISPATCH:AUDIT:${Date.now()}`),
    };
  }

  /**
   * Planetary Evolution Engine (PEE-1.0) proposal method.
   */
  public submitEvolutionProposal(proposal: Omit<EvolutionProposal, 'proposalId' | 'status' | 'proposedAt'>): EvolutionProposal {
    const proposalId = `PROP-EVO-${Date.now().toString(36).toUpperCase()}`;
    const fullProposal: EvolutionProposal = {
      ...proposal,
      proposalId,
      status: 'PROPOSED_ADVISORY',
      proposedAt: Date.now(),
    };

    this.evolutionProposals.unshift(fullProposal);

    sovereignEventFabric.emit('EVOLUTION_PROPOSAL_SUBMITTED', 'PLANETARY_EVOLUTION_ENGINE', {
      proposalId,
      title: fullProposal.title,
    });

    return fullProposal;
  }

  public getGovernedAgents(): GovernedAgentRecord[] {
    return Array.from(this.governedAgents.values());
  }

  public getLedger(): IntelligenceLedgerEntry[] {
    return this.ledger;
  }

  public getEvolutionProposals(): EvolutionProposal[] {
    return this.evolutionProposals;
  }

  public getCurrentBlockHeight(): number {
    return this.currentBlockHeight;
  }
}

export const planetarySkillSpine = new PlanetarySkillSpine();
export default planetarySkillSpine;
