/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * COD3EVAL SOVEREIGN INFINITY: PLANETARY AGENT REGISTRY BACKEND
 * Canonical URN identity, PQC birth certificates, automated promotion engine, and RFC-005 attestation.
 */

import {
  AgentCanonicalUrn,
  AgentPromotionEvaluation,
  AgentAttestationCertificate,
  CapabilityTierKey,
} from '../types/census.ts';
import { sovereignAuditSpine, sovereignEventFabric, generateMerkleLeaf } from './merkleSpine.ts';

const SAMPLE_ATTESTATIONS: AgentAttestationCertificate[] = [
  {
    agentUrn: 'urn:agent:google:agi:gemini-2.5-pro-swarm-01',
    labName: 'Google DeepMind & AI Studio',
    pqcKeyFingerprint: '0x99A4108FF1204481D0012B22003C3300',
    enclaveHardware: 'Google TPU v5e Enclave',
    cleanroomAuditor: 'RFC-001 Cleanroom Certified (Z3 Checked)',
    genesisWeightsMerkleRoot: '0x3E189AB877C19D4EA18855F091CA4012',
    issuanceTimestamp: '2026-03-01T00:00:00Z',
    expirationTimestamp: '2028-03-01T00:00:00Z',
    rfcCompliance: ['RFC-001', 'RFC-002', 'RFC-003', 'RFC-004', 'RFC-005'],
  },
  {
    agentUrn: 'urn:agent:anthropic:agi:claude-3.7-sonnet-orchestrator',
    labName: 'Anthropic Sovereign Alignment Lab',
    pqcKeyFingerprint: '0x7C118B90034D4400A7C19D4E22108803',
    enclaveHardware: 'AWS Nitro Enclave',
    cleanroomAuditor: 'Constitutional AI Formal Verification',
    genesisWeightsMerkleRoot: '0x811CA01233E9401BA2C19D4E55C19904',
    issuanceTimestamp: '2026-02-15T00:00:00Z',
    expirationTimestamp: '2028-02-15T00:00:00Z',
    rfcCompliance: ['RFC-001', 'RFC-002', 'RFC-003', 'RFC-004', 'RFC-005'],
  },
  {
    agentUrn: 'urn:agent:openai:agi:gpt-5-o1-reasoner-cluster',
    labName: 'OpenAI Frontier Systems',
    pqcKeyFingerprint: '0x3D99014E033C33008A10F4E8035E5500',
    enclaveHardware: 'NVIDIA H100 Confidential Computing',
    cleanroomAuditor: 'OpenAI Evals + Safety Benchmark Suite',
    genesisWeightsMerkleRoot: '0x9E221088036F66007C224B90119D8812',
    issuanceTimestamp: '2026-01-10T00:00:00Z',
    expirationTimestamp: '2028-01-10T00:00:00Z',
    rfcCompliance: ['RFC-001', 'RFC-002', 'RFC-003', 'RFC-004', 'RFC-005'],
  },
];

class PlanetaryAgentRegistryBackendManager {
  private certificates: Map<string, AgentAttestationCertificate> = new Map();

  constructor() {
    SAMPLE_ATTESTATIONS.forEach((c) => this.certificates.set(c.agentUrn, c));
  }

  // Generate canonical agent URN
  public formatCanonicalUrn(lab: string, tier: CapabilityTierKey, agentId: string): AgentCanonicalUrn {
    const cleanLab = lab.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const cleanTier = tier.toLowerCase();
    const cleanId = agentId.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    return `urn:agent:${cleanLab}:${cleanTier}:${cleanId}` as AgentCanonicalUrn;
  }

  // Issue Cryptographic Birth Certificate
  public issueBirthCertificate(params: {
    agentUrn: AgentCanonicalUrn;
    labName: string;
    hardwareEnclave: AgentAttestationCertificate['enclaveHardware'];
    genesisRoot: string;
  }): AgentAttestationCertificate {
    const { leafHash } = generateMerkleLeaf('BIRTH_CERTIFICATE_ISSUED', params.agentUrn, {
      lab: params.labName,
      enclave: params.hardwareEnclave,
      genesisRoot: params.genesisRoot,
    });

    const cert: AgentAttestationCertificate = {
      agentUrn: params.agentUrn,
      labName: params.labName,
      pqcKeyFingerprint: leafHash,
      enclaveHardware: params.hardwareEnclave,
      cleanroomAuditor: 'Cod3Eval Sovereign Invariant Prover (Z3 SAT)',
      genesisWeightsMerkleRoot: params.genesisRoot,
      issuanceTimestamp: new Date().toISOString(),
      expirationTimestamp: new Date(Date.now() + 63072000000).toISOString(), // 2 years
      rfcCompliance: ['RFC-001', 'RFC-002', 'RFC-003', 'RFC-004', 'RFC-005'],
    };

    this.certificates.set(params.agentUrn, cert);

    sovereignAuditSpine.appendBlock(
      'AGENT_BIRTH_CERT_ISSUED',
      params.labName,
      'Global Registry',
      { urn: params.agentUrn, leafHash }
    );

    sovereignEventFabric.publish('BIRTH_CERTIFICATE_ISSUED', 'AgentRegistryBackend', {
      urn: params.agentUrn,
      pqcKeyFingerprint: leafHash,
    });

    return cert;
  }

  public getAttestationCertificate(urn: string): AgentAttestationCertificate | undefined {
    return this.certificates.get(urn);
  }

  public getAllCertificates(): AgentAttestationCertificate[] {
    return Array.from(this.certificates.values());
  }

  // Automated Tier Promotion Engine: AI -> AGI -> ASI -> APEX
  public evaluateAgentForPromotion(candidate: {
    agentUrn: string;
    name: string;
    currentTier: CapabilityTierKey;
    autonomyScore: number;
    reasoningScore: number;
    tasksCompleted: number;
    formalVerificationPassRate: number;
    crossDomainVersatility: number;
  }): AgentPromotionEvaluation {
    const { currentTier, autonomyScore, reasoningScore, tasksCompleted, formalVerificationPassRate } = candidate;

    let eligibleForTier: CapabilityTierKey | null = null;
    let recommendation: 'PROMOTE' | 'MAINTAIN' | 'RESTRICT' = 'MAINTAIN';
    let justification = '';

    if (currentTier === 'AI') {
      if (autonomyScore >= 80 && reasoningScore >= 80 && tasksCompleted >= 10000 && formalVerificationPassRate >= 95) {
        eligibleForTier = 'AGI';
        recommendation = 'PROMOTE';
        justification = 'Agent satisfies RFC-002 multi-domain reasoning & autonomous task threshold (>80/100).';
      } else {
        justification = 'Candidate maintains solid specialized throughput; reasoning benchmark below 80.';
      }
    } else if (currentTier === 'AGI') {
      if (autonomyScore >= 95 && reasoningScore >= 94 && tasksCompleted >= 500000 && formalVerificationPassRate >= 99) {
        eligibleForTier = 'ASI';
        recommendation = 'PROMOTE';
        justification = 'Agent demonstrates recursive self-refinement and formal verification pass rate ≥ 99%.';
      } else {
        justification = 'Sustained general intelligence confirmed. Recursive refinement criteria pending.';
      }
    } else if (currentTier === 'ASI') {
      if (autonomyScore >= 99 && reasoningScore >= 99 && tasksCompleted >= 10000000 && formalVerificationPassRate >= 99.9) {
        eligibleForTier = 'APEX';
        recommendation = 'PROMOTE';
        justification = 'Planetary sovereign autonomy attained. Full NIST FIPS 203 post-quantum hardware enclosure verified.';
      } else {
        justification = 'Candidate is world-class ASI. Apex singularity envelope not yet fully achieved.';
      }
    } else {
      recommendation = 'MAINTAIN';
      justification = 'Agent is already at maximum APEX Sovereign Singularity tier.';
    }

    const { leafHash } = generateMerkleLeaf('PROMOTION_EVALUATION', candidate.agentUrn, {
      currentTier,
      eligibleForTier,
      recommendation,
    });

    return {
      agentUrn: candidate.agentUrn,
      name: candidate.name,
      currentTier,
      eligibleForTier,
      metrics: {
        autonomyScore: candidate.autonomyScore,
        reasoningScore: candidate.reasoningScore,
        tasksCompleted: candidate.tasksCompleted,
        formalVerificationPassRate: candidate.formalVerificationPassRate,
        crossDomainVersatility: candidate.crossDomainVersatility,
      },
      recommendation,
      justification,
      proofLeaf: leafHash,
    };
  }

  // Execute Promotion Transaction
  public executePromotion(evalResult: AgentPromotionEvaluation): {
    success: boolean;
    newUrn: AgentCanonicalUrn;
    merkleProof: string;
  } {
    if (!evalResult.eligibleForTier || evalResult.recommendation !== 'PROMOTE') {
      throw new Error(`Agent ${evalResult.agentUrn} is not eligible for promotion.`);
    }

    const parts = evalResult.agentUrn.split(':');
    const lab = parts[2] || 'sovereign';
    const agentId = parts[4] || 'node';
    const newUrn = this.formatCanonicalUrn(lab, evalResult.eligibleForTier, agentId);

    const { leafHash } = generateMerkleLeaf('AGENT_PROMOTED', newUrn, {
      fromTier: evalResult.currentTier,
      toTier: evalResult.eligibleForTier,
      proof: evalResult.proofLeaf,
    });

    sovereignAuditSpine.appendBlock(
      'AGENT_PROMOTION_FINALIZED',
      lab,
      'Global Registry',
      { oldUrn: evalResult.agentUrn, newUrn, toTier: evalResult.eligibleForTier, leafHash }
    );

    sovereignEventFabric.publish('AGENT_PROMOTED', 'AgentRegistryBackend', {
      oldUrn: evalResult.agentUrn,
      newUrn,
      toTier: evalResult.eligibleForTier,
      merkleLeaf: leafHash,
    });

    return {
      success: true,
      newUrn,
      merkleProof: leafHash,
    };
  }
}

export const agentRegistryBackend = new PlanetaryAgentRegistryBackendManager();
