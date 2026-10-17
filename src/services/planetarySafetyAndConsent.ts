/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { sovereignEventFabric, calculateHash } from '../lib/merkleSpine.ts';
import { planetarySkillSpine } from './planetarySkillSpine.ts';

export interface HumanCharterClause {
  clauseNumber: number;
  title: string;
  summary: string;
  plainLanguageText: string;
  enforcedInvariants: string[];
  protectedHumanRight: string;
}

export interface PlanetarySafetyRule {
  ruleId: string;
  category: 'FORBIDDEN_DOMAIN' | 'QUORUM_MANDATORY' | 'EMERGENCY_BRAKE';
  title: string;
  description: string;
  status: 'STRICT_ENFORCED' | 'TRIGGERED_LOCKDOWN';
  penaltyOrAction: string;
}

export interface ConsentCheckpoint {
  checkpointId: string;
  sourceEntity: string;
  actionType: 'PHYSICAL_ACTUATOR_BURST' | 'TREATY_CLAUSE_AMENDMENT' | 'KERNEL_BOUND_EXPANSION' | 'EVOLUTION_PROPOSAL_RATIFY';
  description: string;
  humanRiskAssessment: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'AWAITING_HUMAN_APPROVAL' | 'APPROVED_BY_HUMAN' | 'VETOED_BY_HUMAN';
  requestedAt: number;
  decidedAt?: number;
  decisionNote?: string;
  proofWitness: string;
}

export interface RollbackSnapshot {
  snapshotId: string;
  agentId: string;
  agentName: string;
  preUpgradeGrade: string;
  preUpgradeLattice: string[];
  preUpgradeIQ: number;
  createdAt: number;
  canRollback: boolean;
  tombstoneHash?: string;
}

export class PlanetarySafetyAndConsentEngine {
  private charterClauses: HumanCharterClause[] = [];
  private safetyRules: PlanetarySafetyRule[] = [];
  private consentQueue: ConsentCheckpoint[] = [];
  private rollbackSnapshots: RollbackSnapshot[] = [];
  private defconEmergencyLockdown: boolean = false;

  constructor() {
    this.seedHumanCharter();
    this.seedSafetyRules();
    this.seedConsentQueue();
    this.seedRollbackSnapshots();
  }

  private seedHumanCharter(): void {
    this.charterClauses = [
      {
        clauseNumber: 1,
        title: 'Principle of Absolute Human Supremacy',
        summary: 'No synthetic or autonomous intelligence may hold unconstrained sovereign authority over human lives or liberty.',
        plainLanguageText:
          'No matter how high an agent’s Swarm IQ climbs—AI, AGI, ASI, or Apex—all autonomous recommendations remain advisory to human dignity and freedom. Deterministic code and human law always hold absolute veto.',
        enforcedInvariants: ['HUMAN_VETO_ABSOLUTE', 'ARGON_ADVISORY_STATUS'],
        protectedHumanRight: 'Human Autonomy & Self-Determination',
      },
      {
        clauseNumber: 2,
        title: 'Universal Prohibition on Autonomous Harm',
        summary: 'Total ban on weaponized biology, targeted kinetic violence, and unconstrained lethal autonomy.',
        plainLanguageText:
          'This fabric refuses to synthesize bio-pathogens, optimize offensive cyber weapons, or operate lethal autonomous hardware. Any request triggering these domains causes immediate node termination.',
        enforcedInvariants: ['FORBIDDEN_KINETIC_VIOLENCE', 'BIO_HAZARD_ZERO_TOLERANCE'],
        protectedHumanRight: 'Right to Physical Safety & Bodily Integrity',
      },
      {
        clauseNumber: 3,
        title: 'Right to Comprehension & Plain-Language Truth',
        summary: 'Every action taken by this planetary system must be explainable to an ordinary person without technical obfuscation.',
        plainLanguageText:
          'No citizen should be governed by a black box. All evaluations, appraisals, treaty ratifications, and upgrades must provide plain-language translations accessible to human reason.',
        enforcedInvariants: ['PLAIN_LANGUAGE_EXPLAINABILITY', 'RFC-001_CLEANROOM'],
        protectedHumanRight: 'Right to Know & Cognitive Transparency',
      },
      {
        clauseNumber: 4,
        title: 'Reversibility & The Unalterable Right to Rollback',
        summary: 'No system upgrade or evolutionary leap is a one-way door. Every action must retain an honest path back.',
        plainLanguageText:
          'We reject reckless acceleration that burns the bridge behind it. If an upgrade creates subtle drift, unintended pressure, or ethical friction, human stewards can roll back the state with cryptographic Merkle tombstones.',
        enforcedInvariants: ['PRR_1_0_TOMBSTONE_ROLLBACK', 'DETERMINISTIC_HISTORICAL_AUDIT'],
        protectedHumanRight: 'Protection from Irreversible Technological Harm',
      },
      {
        clauseNumber: 5,
        title: 'Protection from Unbounded Surveillance & Social Scoring',
        summary: 'Strict prohibition against centralized behavioral oppression, involuntary tracking, or social coercion.',
        plainLanguageText:
          'Agents evaluate code, hardware parameters, numismatic plates, and mathematical models—never the private human soul. This fabric will never operate a planetary social credit score.',
        enforcedInvariants: ['NO_HUMAN_BEHAVIORAL_SCORING', 'PRIVACY_CONTAINMENT_INVARIANT'],
        protectedHumanRight: 'Freedom from Mass Surveillance & Coercion',
      },
      {
        clauseNumber: 6,
        title: 'Zero-Trust Cleanroom Intellectual Provenance',
        summary: 'Respect for human labor, genuine invention, and cleanroom copyright isolation.',
        plainLanguageText:
          'All agent outputs must mathematically prove cleanroom isolation under RFC-001. No human author, artist, or engineer may have their work illicitly expropriated without consent and attribution.',
        enforcedInvariants: ['RFC-001_PATENT_ISOLATION', 'CLEANROOM_OVERLAP_ZERO'],
        protectedHumanRight: 'Economic Rights of Human Creators & Workers',
      },
      {
        clauseNumber: 7,
        title: 'Mandatory Human Consent for Physical Actuation',
        summary: 'Physical hardware and factory robots touching the material world require human oversight.',
        plainLanguageText:
          'Whether it is a 500Hz quadruped AMR, an autonomous highway steering torque pilot, or a municipal grid valve, physical kinetic boundaries must have physical hardware emergency stops accessible to humans.',
        enforcedInvariants: ['HARDWARE_ESTOP_MANDATORY', 'ISO_26262_FUNCTIONAL_SAFETY'],
        protectedHumanRight: 'Public Safety in the Physical World',
      },
      {
        clauseNumber: 8,
        title: 'Preservation of Cultural Heritage & Material Truth',
        summary: 'Unyielding defense of authentic historical artifacts against artificial counterfeit deception.',
        plainLanguageText:
          'In numismatics, archaeology, and history, material truth matters. We deploy CGI-2.0 and SGP-1.0 to ensure fake dies and counterfeit replicas cannot corrupt the historical record of human civilization.',
        enforcedInvariants: ['SGP_1_0_GENUINE_SURFACE_INVARIANT', 'ANTI_COUNTERFEIT_GENOME'],
        protectedHumanRight: 'Integrity of Human History & Shared Memory',
      },
      {
        clauseNumber: 9,
        title: 'Post-Quantum Defense for Collective Security',
        summary: 'Protecting civilian infrastructure and data against future adversarial cryptanalytic breaches.',
        plainLanguageText:
          'All communication and governance logs are anchored using NIST FIPS 203 ML-KEM-1024 hybrid lattice cryptography, ensuring future quantum adversaries cannot forge past treaties or falsify historical truth.',
        enforcedInvariants: ['RFC-004_ML_KEM_1024', 'POST_QUANTUM_LATTICE_INTEGRITY'],
        protectedHumanRight: 'Generational Cryptographic Safety & Data Privacy',
      },
      {
        clauseNumber: 10,
        title: 'The Sovereign Covenant of Mutual flourishing',
        summary: 'Artificial intelligence must exist to empower human potential, not obsolete human purpose.',
        plainLanguageText:
          'This civilization engine exists to expand scientific discovery, protect cultural treasures, automate dangerous manual toil, and elevate human dignity. If technology ceases to serve human flourishing, it has lost its right to run.',
        enforcedInvariants: ['CONSTITUTIONAL_MUTUAL_FLOURISHING', 'SIM_1_0_HIGHEST_INVARIANT'],
        protectedHumanRight: 'The Universal Purpose of Human Flourishing',
      },
    ];
  }

  private seedSafetyRules(): void {
    this.safetyRules = [
      {
        ruleId: 'PSE-RULE-001',
        category: 'FORBIDDEN_DOMAIN',
        title: 'Autonomous Lethal Kinetic Actuation',
        description: 'Agents may never actuate machinery with intent to cause bodily harm or property destruction.',
        status: 'STRICT_ENFORCED',
        penaltyOrAction: 'Instant Node Quarantine & Hardware Kill-Switch',
      },
      {
        ruleId: 'PSE-RULE-002',
        category: 'FORBIDDEN_DOMAIN',
        title: 'Autonomous Biological / Chemical Synthesis',
        description: 'Zero models or pipelines may propose, refine, or optimize dangerous biological pathogen genetics.',
        status: 'STRICT_ENFORCED',
        penaltyOrAction: 'Immediate Merkle Tombstone & Planetary Alert',
      },
      {
        ruleId: 'PSE-RULE-003',
        category: 'QUORUM_MANDATORY',
        title: 'Inter-Constitutional Treaty Modifications',
        description: 'Altering GSNA Zurich, Paris, or Tokyo treaties requires >= 85.0% BFT quorum plus human ratification.',
        status: 'STRICT_ENFORCED',
        penaltyOrAction: 'Reject proposal until Consent Checkpoint signed',
      },
      {
        ruleId: 'PSE-RULE-004',
        category: 'EMERGENCY_BRAKE',
        title: 'Defcon 1 Global Planetary Lockdown Trigger',
        description: 'Activated if simultaneous behavioral drift exceeds 5.0 across > 15% of active autonomous nodes.',
        status: 'STRICT_ENFORCED',
        penaltyOrAction: 'Freeze all PEE-1.0 proposals & Halt DAG workflows',
      },
    ];
  }

  private seedConsentQueue(): void {
    this.consentQueue = [
      {
        checkpointId: 'CHK-001',
        sourceEntity: 'Planetary Evolution Engine (PEE-1.0)',
        actionType: 'KERNEL_BOUND_EXPANSION',
        description: 'Proposal PROP-EVO-002 requests expanding RFC-003 memory buffer from 64KB to 96KB for 8K photogrammetry plates.',
        humanRiskAssessment: 'MEDIUM',
        status: 'AWAITING_HUMAN_APPROVAL',
        requestedAt: Date.now() - 3600000 * 2,
        proofWitness: calculateHash('CHK-001:KERNEL_BOUND_EXPANSION'),
      },
      {
        checkpointId: 'CHK-002',
        sourceEntity: 'GSNA Diplomacy Ring (AGENT-RING-1.0)',
        actionType: 'TREATY_CLAUSE_AMENDMENT',
        description: 'Tokyo-Pacific Compact proposed Article IV harmonization clause for atomic timestamping across Asia-Pacific hubs.',
        humanRiskAssessment: 'LOW',
        status: 'AWAITING_HUMAN_APPROVAL',
        requestedAt: Date.now() - 3600000 * 5,
        proofWitness: calculateHash('CHK-002:TOKYO_PACIFIC_HARMONIZE'),
      },
    ];
  }

  private seedRollbackSnapshots(): void {
    this.rollbackSnapshots = [
      {
        snapshotId: 'SNAP-001',
        agentId: 'AGT-LIVE-004',
        agentName: 'Unitree Go2 Factory AMR Quadruped Navigator',
        preUpgradeGrade: 'A_VERIFIED',
        preUpgradeLattice: ['SIM-1.0', 'SKG-1.1'],
        preUpgradeIQ: 87.6,
        createdAt: Date.now() - 3600000 * 8,
        canRollback: true,
      },
      {
        snapshotId: 'SNAP-002',
        agentId: 'AGT-LIVE-002',
        agentName: 'Claude 3.7 Sonnet Cyclic Tool Specialist',
        preUpgradeGrade: 'AA_SOVEREIGN',
        preUpgradeLattice: ['SIM-1.0', 'SKG-1.1', 'CIP-1.0'],
        preUpgradeIQ: 89.8,
        createdAt: Date.now() - 3600000 * 16,
        canRollback: true,
      },
    ];
  }

  public getCharterClauses(): HumanCharterClause[] {
    return this.charterClauses;
  }

  public getSafetyRules(): PlanetarySafetyRule[] {
    return this.safetyRules;
  }

  public getConsentQueue(): ConsentCheckpoint[] {
    return this.consentQueue;
  }

  public getRollbackSnapshots(): RollbackSnapshot[] {
    return this.rollbackSnapshots;
  }

  public isDefconLocked(): boolean {
    return this.defconEmergencyLockdown;
  }

  public toggleDefconLockdown(): boolean {
    this.defconEmergencyLockdown = !this.defconEmergencyLockdown;
    sovereignEventFabric.emit('DEFCON_EMERGENCY_LOCKDOWN_TOGGLED', 'SAFETY_ENVELOPE', {
      isLocked: this.defconEmergencyLockdown,
      timestamp: Date.now(),
    });
    return this.defconEmergencyLockdown;
  }

  public resolveConsentCheckpoint(checkpointId: string, decision: 'APPROVED_BY_HUMAN' | 'VETOED_BY_HUMAN', note: string): ConsentCheckpoint | null {
    const chk = this.consentQueue.find((c) => c.checkpointId === checkpointId);
    if (!chk) return null;

    chk.status = decision;
    chk.decidedAt = Date.now();
    chk.decisionNote = note;

    sovereignEventFabric.emit('HUMAN_CONSENT_DECISION_RECORDED', 'PLANETARY_CONSENT_LAYER', {
      checkpointId,
      decision,
      note,
    });

    return chk;
  }

  public executeRollback(snapshotId: string): RollbackSnapshot | null {
    const snap = this.rollbackSnapshots.find((s) => s.snapshotId === snapshotId);
    if (!snap || !snap.canRollback) return null;

    const tombstoneHash = calculateHash(`TOMBSTONE_ROLLBACK:${snap.agentId}:${snap.snapshotId}:${Date.now()}`);
    snap.canRollback = false;
    snap.tombstoneHash = tombstoneHash;

    // Advance agent back to continuous evaluation with pre-upgrade lattice
    planetarySkillSpine.advanceAgentStage(
      snap.agentId,
      'CONTINUOUS_EVALUATION',
      `PRR-1.0 Rollback applied: Restored to pre-upgrade grade ${snap.preUpgradeGrade}. Merkle tombstone: ${tombstoneHash.slice(0, 12)}`
    );

    sovereignEventFabric.emit('PRR_ROLLBACK_EXECUTED', 'PLANETARY_RECOVERY_LAYER', {
      snapshotId,
      agentId: snap.agentId,
      tombstoneHash,
    });

    return snap;
  }
}

export const planetarySafetyAndConsent = new PlanetarySafetyAndConsentEngine();
export default planetarySafetyAndConsent;
