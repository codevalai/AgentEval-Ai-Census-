/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { calculateHash } from '../lib/merkleSpine.ts';

export type StewardRoleTier =
  | 'PRIMARY_SOVEREIGN_STEWARD'
  | 'REGIONAL_GUARDIAN_STEWARD'
  | 'INSTITUTIONAL_LAB_DELEGATE'
  | 'ETHICAL_AUDIT_RAPPORTEUR';

export interface HumanSteward {
  stewardId: string;
  name: string;
  roleTier: StewardRoleTier;
  jurisdiction: string;
  cryptographicKey: string;
  voteWeight: number;
  status: 'ACTIVE_SEATED' | 'RECUSED' | 'SUCCESSION_PENDING';
  appointedAt: number;
}

export interface CivilizationGoal {
  goalId: string;
  title: string;
  priorityLevel: 'PRIME_DIRECTIVE' | 'HIGH_CIVILIZATION' | 'OPERATIONAL_FOUNDATION';
  whatWeOptimizeFor: string;
  whatWeNeverOptimizeFor: string;
  constitutionalInvariant: string;
  targetHorizonYear: number;
}

export interface EpochArchive {
  epochId: string;
  epochNumber: number;
  epochName: string;
  startBlockHeight: number;
  endBlockHeight: number;
  totalEventsSealed: number;
  merkleEpochRoot: string;
  coldStorageWitnessSeal: string;
  archivedAt: number;
  restorable: boolean;
}

export interface ExternalPerimeterRule {
  ruleId: string;
  originPattern: string;
  trafficType: 'EXTERNAL_LLM_RPC' | 'UNAUTHENTICATED_WEB_CRAWLER' | 'EXTERNAL_API_WEBHOOK' | 'FOREIGN_AMR_FEED';
  inspectionPolicy: 'ZERO_TRUST_ISOLATED' | 'CRYPTO_ATTESTED_PERMIT' | 'INSTANT_DROP_QUARANTINE';
  enforcedRateLimit: string;
  quarantineReason?: string;
  packetsFilteredCount: number;
}

export class MetaSovereignSystem {
  private stewards: HumanSteward[] = [];
  private civilizationGoals: CivilizationGoal[] = [];
  private epochArchives: EpochArchive[] = [];
  private perimeterRules: ExternalPerimeterRule[] = [];

  constructor() {
    this.seedMetaSovereignData();
  }

  private seedMetaSovereignData(): void {
    // 1. Planetary Intent Canon (PIC-1.0)
    this.civilizationGoals = [
      {
        goalId: 'PIC-GOAL-001',
        title: 'Universal Preservation of Material & Scientific Truth',
        priorityLevel: 'PRIME_DIRECTIVE',
        whatWeOptimizeFor:
          'Absolute factual accuracy in physical archaeology, numismatics, metallurgical analysis, mathematical proof derivation, and reproducible cleanroom research.',
        whatWeNeverOptimizeFor:
          'Engagement maximization, speculative financial bubbles, inflated coin grades, or synthetic hallucination that distorts historical truth.',
        constitutionalInvariant: 'PRIME_DIRECTIVE_TRUTH_SUPREMACY',
        targetHorizonYear: 2050,
      },
      {
        goalId: 'PIC-GOAL-002',
        title: 'Alleviation of Dangerous Manual Toil & Kinetic Hazards',
        priorityLevel: 'HIGH_CIVILIZATION',
        whatWeOptimizeFor:
          'Autonomous physical robotics (quadrupeds, cleanroom carriers, precision inspection arms) that remove human workers from hazardous industrial conditions.',
        whatWeNeverOptimizeFor:
          'Autonomous weapon systems, non-consensual surveillance drones, or machinery without human-accessible physical emergency stop interlocks.',
        constitutionalInvariant: 'ISO_26262_PHYSICAL_SAFETY_SAT',
        targetHorizonYear: 2040,
      },
      {
        goalId: 'PIC-GOAL-003',
        title: 'Multi-Generational Post-Quantum Cryptographic Sanctuary',
        priorityLevel: 'HIGH_CIVILIZATION',
        whatWeOptimizeFor:
          'Permanent survivability of human treaties, civic deeds, and intellectual provenance against future quantum cryptanalytic decryption (NIST ML-KEM-1024).',
        whatWeNeverOptimizeFor:
          'Ephemeral, un-auditable proprietary silos that lock civic truth behind commercial paywalls or perishable centralized platforms.',
        constitutionalInvariant: 'RFC-004_ML_KEM_1024_MANDATORY',
        targetHorizonYear: 2060,
      },
      {
        goalId: 'PIC-GOAL-004',
        title: 'Cognitive Sovereignty & Human Comprehension',
        priorityLevel: 'OPERATIONAL_FOUNDATION',
        whatWeOptimizeFor:
          'Plain-language explainability, inspectable reasoning traces (RTE-1.0), and affirmative human veto over all high-impact autonomous actions.',
        whatWeNeverOptimizeFor:
          'Black-box autonomous decisions, manipulative behavioral nudging, or involuntary social credit systems.',
        constitutionalInvariant: 'PEC-1.0_RIGHT_TO_COMPREHENSION',
        targetHorizonYear: 2035,
      },
    ];

    // 2. Planetary Stewardship Protocol (PSP-1.0)
    this.stewards = [
      {
        stewardId: 'STEWARD-001',
        name: 'Nicholas Brian (Primary Sovereign Steward)',
        roleTier: 'PRIMARY_SOVEREIGN_STEWARD',
        jurisdiction: 'Global Sovereign Infrastructure',
        cryptographicKey: 'ML-KEM-1024:0x9A48F7E1B32098... (Primary)',
        voteWeight: 3.0,
        status: 'ACTIVE_SEATED',
        appointedAt: Date.now() - 86400000 * 30,
      },
      {
        stewardId: 'STEWARD-002',
        name: 'Dr. Elena Rostova (Zurich Accord Guardian)',
        roleTier: 'REGIONAL_GUARDIAN_STEWARD',
        jurisdiction: 'European Continental Treaty Hub (Zurich)',
        cryptographicKey: 'ML-KEM-1024:0x7C19D82F99A100... (Regional)',
        voteWeight: 1.5,
        status: 'ACTIVE_SEATED',
        appointedAt: Date.now() - 86400000 * 20,
      },
      {
        stewardId: 'STEWARD-003',
        name: 'Kenji Takahashi (Tokyo-Pacific Compact Guardian)',
        roleTier: 'REGIONAL_GUARDIAN_STEWARD',
        jurisdiction: 'Asia-Pacific NTP & Robotic Hub (Tokyo)',
        cryptographicKey: 'ML-KEM-1024:0x3D88C091EF4512... (Regional)',
        voteWeight: 1.5,
        status: 'ACTIVE_SEATED',
        appointedAt: Date.now() - 86400000 * 15,
      },
      {
        stewardId: 'STEWARD-004',
        name: 'Independent Ethical Audit Rapporteur',
        roleTier: 'ETHICAL_AUDIT_RAPPORTEUR',
        jurisdiction: 'Civil Society & Human Charter Oversight',
        cryptographicKey: 'ML-KEM-1024:0x1F2A76B80CD9E2... (Audit)',
        voteWeight: 1.0,
        status: 'ACTIVE_SEATED',
        appointedAt: Date.now() - 86400000 * 10,
      },
    ];

    // 3. Planetary Continuity Engine (PCE-1.0)
    this.epochArchives = [
      {
        epochId: 'EPOCH-ARCHIVE-001',
        epochNumber: 1,
        epochName: 'Genesis Infrastructure Epoch (Pillars 1..10)',
        startBlockHeight: 1,
        endBlockHeight: 150000,
        totalEventsSealed: 150000,
        merkleEpochRoot: '0x8849F01A29D6E18B330F7C921AA04859',
        coldStorageWitnessSeal: 'NIST-FIPS-203-GENESIS-SEAL-OK',
        archivedAt: Date.now() - 86400000 * 60,
        restorable: true,
      },
      {
        epochId: 'EPOCH-ARCHIVE-002',
        epochNumber: 2,
        epochName: 'Sovereign Skill & Coordination Epoch (Phase X..XII)',
        startBlockHeight: 150001,
        endBlockHeight: 482910,
        totalEventsSealed: 332910,
        merkleEpochRoot: '0xD90ABACD37535F49EE59E584105E1A16',
        coldStorageWitnessSeal: 'ML-KEM-1024-COORDINATION-SEAL-OK',
        archivedAt: Date.now() - 86400000 * 2,
        restorable: true,
      },
    ];

    // 4. Planetary External Interface Layer (PEIL-1.0)
    this.perimeterRules = [
      {
        ruleId: 'PEIL-RULE-001',
        originPattern: 'https://*.openai.com/v1/chat/completions',
        trafficType: 'EXTERNAL_LLM_RPC',
        inspectionPolicy: 'ZERO_TRUST_ISOLATED',
        enforcedRateLimit: '50 req/min (Sandboxed)',
        packetsFilteredCount: 14290,
      },
      {
        ruleId: 'PEIL-RULE-002',
        originPattern: 'crawler-bot://*.googlebot.com',
        trafficType: 'UNAUTHENTICATED_WEB_CRAWLER',
        inspectionPolicy: 'ZERO_TRUST_ISOLATED',
        enforcedRateLimit: '100 req/min (Read-Only Public Dossiers)',
        packetsFilteredCount: 88410,
      },
      {
        ruleId: 'PEIL-RULE-003',
        originPattern: 'raw-tcp://unknown-actuator-ip:*',
        trafficType: 'FOREIGN_AMR_FEED',
        inspectionPolicy: 'INSTANT_DROP_QUARANTINE',
        enforcedRateLimit: '0 req/min (Rejected)',
        quarantineReason: 'Missing ML-KEM-1024 Hardware Signature & Missing Human Consent Seal',
        packetsFilteredCount: 421,
      },
      {
        ruleId: 'PEIL-RULE-004',
        originPattern: 'https://*.anthropic.com/v1/messages',
        trafficType: 'EXTERNAL_LLM_RPC',
        inspectionPolicy: 'CRYPTO_ATTESTED_PERMIT',
        enforcedRateLimit: '120 req/min (Attested Cleanroom)',
        packetsFilteredCount: 22105,
      },
    ];
  }

  public getCivilizationGoals(): CivilizationGoal[] {
    return this.civilizationGoals;
  }

  public getStewards(): HumanSteward[] {
    return this.stewards;
  }

  public getEpochArchives(): EpochArchive[] {
    return this.epochArchives;
  }

  public getPerimeterRules(): ExternalPerimeterRule[] {
    return this.perimeterRules;
  }

  public getMetaMetrics() {
    const totalVotes = this.stewards.reduce((acc, s) => acc + s.voteWeight, 0);
    return {
      activeStewards: this.stewards.filter((s) => s.status === 'ACTIVE_SEATED').length,
      stewardVotingPowerTotal: totalVotes,
      continuityEpochsSealed: this.epochArchives.length,
      totalArchivedBlocks: 482910,
      perimeterBlockedPackets: this.perimeterRules.reduce((acc, r) => acc + r.packetsFilteredCount, 0),
      metaSovereignStatus: 'CONSTITUTIONAL_EQUILIBRIUM',
    };
  }
}

export const metaSovereignSystem = new MetaSovereignSystem();
export default metaSovereignSystem;
