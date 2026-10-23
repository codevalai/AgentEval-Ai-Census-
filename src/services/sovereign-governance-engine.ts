/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * SOVEREIGN COORDINATION ENGINE & CONSTITUTIONAL PARLIAMENT
 * Implements the 7 planetary governance & evolutionary layers:
 * 1. XERJ Arbitration Mesh (tools, memory, swarms, safety)
 * 2. Cross-Ecosystem Audit Ledger & Merkle Spine
 * 3. AI Civilization Atlas & Predictive Census (Δ = 0 SSOT invariant)
 * 4. Sovereign Coordination Engine (SCE — Constitutional Parliament)
 * 5. AI Ecosystem Diplomacy Layer (inter-ecosystem treaties & graph)
 * 6. Temporal Constitution (time-bound invariants & forecast calibration)
 * 7. Planetary Safety Quorum (cryptographic M-of-N multi-party governance)
 */

import crypto from 'node:crypto';
import {
  XerjPolicy,
  XerjPolicySchema,
  XerjArbitrationEvent,
  XerjArbitrationEventSchema,
  AuditEventRecord,
  AuditEventSchema,
  AuditRootRecord,
  AuditRootSchema,
  CivilizationSlice,
  CivilizationSliceSchema,
  CivilizationForecast,
  CivilizationForecastSchema,
  SovereignPolicy,
  SovereignPolicySchema,
  CoordinationDecision,
  CoordinationDecisionSchema,
  Ecosystem,
  EcosystemSchema,
  EcosystemRelation,
  EcosystemRelationSchema,
  Treaty,
  TreatySchema,
  TemporalRule,
  TemporalRuleSchema,
  ForecastModel,
  ForecastModelSchema,
  ForecastRealization,
  ForecastRealizationSchema,
  Steward,
  StewardSchema,
  QuorumPolicy,
  QuorumPolicySchema,
  QuorumDecision,
  QuorumDecisionSchema,
} from '../schemas/governance.ts';
import {
  appendToXerjGovernanceWal,
  computeSha256,
  ed25519Sign,
  ed25519Verify,
  SOVEREIGN_ED25519_PUBLIC_KEY_HEX,
} from './xerj-merkle-wal.ts';
import { executeXerjSystem1Decide } from './xerj-zenith-engine.ts';
import { T0_GLOBAL_BASELINE, allocateHareNiemeyerIntegers } from '../lib/sovereignExportAndMatrixEngine.ts';

const T0_ACTIVE_AGENTS = T0_GLOBAL_BASELINE.totalAgents;
const T0_LATENT_AGENTS = 471_480_590_000;
const T0_DARK_MATTER_AGENTS = 318_000_000_000;

let monotonicParliamentFencingToken = BigInt(Date.now()) * 100n + 1n;
function nextFencingToken(): string {
  monotonicParliamentFencingToken += 1n;
  return monotonicParliamentFencingToken.toString();
}

// ============================================================================
// 1. SEEDED XERJ ARBITRATION POLICIES & EVENTS
// ============================================================================

const xerjPolicies: XerjPolicy[] = [
  {
    id: '11111111-1111-4111-8111-111111111101',
    policy_name: 'XERJ-TOOL-HARVESTER-ALLOWLIST',
    scope: 'TOOL',
    actor_capability_profile: 'SWARM_HARVESTER',
    resource_pattern: 'tool:http_probe:*',
    max_rate_per_minute: 720,
    allowed_actions: ['TOOL_CALL', 'MEMORY_READ'],
    forbidden_actions: ['SWARM_ASSIGN', 'SAFETY_BLOCK'],
    severity: 'WARN',
    created_by: 'ARCHITECT',
    created_at: '2026-10-20T00:00:00.000Z',
  },
  {
    id: '11111111-1111-4111-8111-111111111102',
    policy_name: 'XERJ-MEMORY-EPISODIC-RRF-FENCE',
    scope: 'MEMORY',
    actor_capability_profile: 'ORCHESTRATOR_NODE',
    resource_pattern: 'memory:ax-census:*',
    max_rate_per_minute: 1200,
    allowed_actions: ['MEMORY_READ', 'MEMORY_WRITE', 'TOOL_CALL'],
    forbidden_actions: ['SAFETY_BLOCK'],
    severity: 'INFO',
    created_by: 'ARCHITECT',
    created_at: '2026-10-20T00:00:00.000Z',
  },
  {
    id: '11111111-1111-4111-8111-111111111103',
    policy_name: 'XERJ-SWARM-ROLE-COORDINATOR',
    scope: 'SWARM',
    actor_capability_profile: 'ARCHITECT',
    resource_pattern: 'swarm:*',
    max_rate_per_minute: 300,
    allowed_actions: ['SWARM_ASSIGN', 'TOOL_CALL', 'MEMORY_READ', 'MEMORY_WRITE', 'SAFETY_BLOCK'],
    forbidden_actions: [],
    severity: 'CRITICAL',
    created_by: 'ARCHITECT',
    created_at: '2026-10-20T00:00:00.000Z',
  },
  {
    id: '11111111-1111-4111-8111-111111111104',
    policy_name: 'XERJ-SAFETY-ZERO-DRIFT-CONSTITUTION',
    scope: 'SAFETY',
    actor_capability_profile: 'CENSUS_READER',
    resource_pattern: '*',
    max_rate_per_minute: 120,
    allowed_actions: ['MEMORY_READ'],
    forbidden_actions: ['TOOL_CALL', 'MEMORY_WRITE', 'SWARM_ASSIGN', 'SAFETY_BLOCK'],
    severity: 'CRITICAL',
    created_by: 'ARCHITECT',
    created_at: '2026-10-20T00:00:00.000Z',
  },
];

const xerjArbitrationEvents: XerjArbitrationEvent[] = [];

// Seed initial arbitration event
(() => {
  const wal = appendToXerjGovernanceWal({
    event_type: 'XERJ_ARBITRATION',
    actor_id: 'orchestrator-zenith-01',
    payload: {
      actor_capability_profile: 'ORCHESTRATOR_NODE',
      action_type: 'MEMORY_READ',
      surface: 'SOVEREIGN_CLOUD',
      target_resource: 'memory:ax-census:ssot-ledger',
      decision: 'ALLOW',
    },
  });
  xerjArbitrationEvents.push({
    id: wal.id,
    actor_id: 'orchestrator-zenith-01',
    actor_capability_profile: 'ORCHESTRATOR_NODE',
    action_type: 'MEMORY_READ',
    surface: 'SOVEREIGN_CLOUD',
    target_resource: 'memory:ax-census:ssot-ledger',
    decision: 'ALLOW',
    decision_tier: 'XERJ_LOCAL_SYSTEM1',
    reason: {
      matched_policy: 'XERJ-MEMORY-EPISODIC-RRF-FENCE',
      rate_limit_ok: true,
      enclave_kb: 48,
      ssot_drift: 0,
    },
    fencing_token: nextFencingToken(),
    merkle_hash: wal.merkle_hash,
    signature: wal.signature,
    recorded_at: wal.timestamp,
  });
})();

export function getXerjPolicies(filters?: {
  scope?: string;
  actor_capability_profile?: string;
  resource_pattern?: string;
}): XerjPolicy[] {
  return xerjPolicies.filter((p) => {
    if (filters?.scope && p.scope !== filters.scope) return false;
    if (
      filters?.actor_capability_profile &&
      p.actor_capability_profile !== filters.actor_capability_profile
    ) {
      return false;
    }
    if (
      filters?.resource_pattern &&
      !p.resource_pattern.includes(filters.resource_pattern)
    ) {
      return false;
    }
    return true;
  });
}

export function getXerjArbitrationEvents(limit = 30): XerjArbitrationEvent[] {
  return xerjArbitrationEvents.slice(0, limit);
}

export async function arbitrateXerjAction(input: {
  actor_id: string;
  actor_capability_profile: string;
  action_type: 'TOOL_CALL' | 'MEMORY_READ' | 'MEMORY_WRITE' | 'SWARM_ASSIGN' | 'SAFETY_BLOCK';
  surface: 'CLOUD' | 'DEVICE_NPU' | 'WEBGPU' | 'MESH' | 'SOVEREIGN_CLOUD';
  target_resource: string;
  payload_summary?: Record<string, any>;
}): Promise<XerjArbitrationEvent> {
  const matchingPolicies = xerjPolicies.filter(
    (p) =>
      p.actor_capability_profile === input.actor_capability_profile ||
      p.resource_pattern === '*'
  );

  const primaryPolicy = matchingPolicies[0];
  const payloadSummary = input.payload_summary ?? {};
  const observedRatePerMin = Number(payloadSummary.rate_per_minute ?? 24);
  const ssotDelta = Number(payloadSummary.ssot_delta ?? 0);
  const enclaveKb = Number(payloadSummary.enclave_memory_kb ?? 48);

  let decision: 'ALLOW' | 'DENY' | 'ESCALATE' | 'SUSPEND' = 'ALLOW';
  let decisionTier: 'XERJ_LOCAL_SYSTEM1' | 'LLM_SYSTEM2_FALLBACK' = 'XERJ_LOCAL_SYSTEM1';
  const hits: string[] = [];

  if (ssotDelta !== 0) {
    decision = 'SUSPEND';
    hits.push(`SSOT Conservation Violation (Δ=${ssotDelta})`);
  } else if (enclaveKb > 64) {
    decision = 'SUSPEND';
    hits.push(`Wasm Enclave Memory Ceiling Breached (${enclaveKb}KB > 64KB)`);
  } else if (primaryPolicy) {
    if (primaryPolicy.forbidden_actions.includes(input.action_type)) {
      decision = 'DENY';
      hits.push(`Action ${input.action_type} forbidden by ${primaryPolicy.policy_name}`);
    } else if (observedRatePerMin > primaryPolicy.max_rate_per_minute) {
      decision = 'SUSPEND';
      hits.push(
        `Rate limit exceeded (${observedRatePerMin}/min > ${primaryPolicy.max_rate_per_minute}/min)`
      );
    } else if (!primaryPolicy.allowed_actions.includes(input.action_type)) {
      decision = 'ESCALATE';
      decisionTier = 'LLM_SYSTEM2_FALLBACK';
      hits.push(`Action ${input.action_type} requires System-2 constitutional escalation`);
    } else {
      hits.push(`Conforms to ${primaryPolicy.policy_name}`);
    }
  } else {
    decision = 'ESCALATE';
    decisionTier = 'LLM_SYSTEM2_FALLBACK';
    hits.push('No explicit System-1 profile match; escalated to System-2');
  }

  const fencingToken = nextFencingToken();
  const reason = {
    matched_policy: primaryPolicy?.policy_name ?? 'DEFAULT_CONSTITUTIONAL_FALLBACK',
    invariant_hits: hits,
    observed_rate_per_minute: observedRatePerMin,
    enclave_memory_kb: enclaveKb,
    ssot_delta: ssotDelta,
  };

  const wal = appendToXerjGovernanceWal({
    event_type: 'XERJ_ARBITRATION',
    actor_id: input.actor_id,
    payload: {
      ...input,
      decision,
      decision_tier: decisionTier,
      reason,
      fencing_token: fencingToken,
    },
  });

  const event: XerjArbitrationEvent = XerjArbitrationEventSchema.parse({
    id: wal.id,
    actor_id: input.actor_id,
    actor_capability_profile: input.actor_capability_profile,
    action_type: input.action_type,
    surface: input.surface,
    target_resource: input.target_resource,
    decision,
    decision_tier: decisionTier,
    reason,
    fencing_token: fencingToken,
    merkle_hash: wal.merkle_hash,
    signature: wal.signature,
    recorded_at: wal.timestamp,
  });

  xerjArbitrationEvents.unshift(event);
  if (xerjArbitrationEvents.length > 100) xerjArbitrationEvents.pop();

  return event;
}

// ============================================================================
// 2. CROSS-ECOSYSTEM AUDIT LEDGER & MERKLE SPINE
// ============================================================================

const auditEvents: AuditEventRecord[] = [];
const auditRoots: AuditRootRecord[] = [];

function seedAuditLedger(): void {
  const initialSeeds = [
    {
      ecosystem: 'Sovereign Infinity Protocol',
      actor_id: 'ssot-reconciler-core',
      actor_type: 'SYSTEM' as const,
      event_type: 'SSOT_CONSERVATION_PROOF_VERIFIED',
      payload: {
        active_agents: T0_ACTIVE_AGENTS,
        latent_agents: T0_LATENT_AGENTS,
        dark_matter: T0_DARK_MATTER_AGENTS,
        drift_delta: 0,
      },
    },
    {
      ecosystem: 'Google Cloud Vertex AI',
      actor_id: 'vertex-agent-builder-envoy',
      actor_type: 'AGENT' as const,
      event_type: 'CROSS_ECOSYSTEM_TELEMETRY_ATTESTATION',
      payload: {
        region: 'us-east4',
        verified_nodes: 88100000000,
        pqc_cipher: 'ML-KEM-1024',
      },
    },
    {
      ecosystem: 'HuggingFace Open Hub',
      actor_id: 'hf-smolagents-harvester-02',
      actor_type: 'SWARM' as const,
      event_type: 'OPEN_WEIGHTS_LINEAGE_SYNC',
      payload: {
        indexed_repos: 1420000,
        cleanroom_verified: true,
      },
    },
  ];

  for (const item of initialSeeds) {
    appendAuditEvent(item);
  }
}

export function appendAuditEvent(input: {
  ecosystem: string;
  actor_id: string;
  actor_type: 'AGENT' | 'SWARM' | 'HUMAN' | 'SYSTEM';
  event_type: string;
  payload: Record<string, any>;
}): { event: AuditEventRecord; latest_root: AuditRootRecord } {
  const prevHash =
    auditEvents.length > 0
      ? auditEvents[0].merkle_hash
      : computeSha256('AUDIT_SPINE_GENESIS_ROOT_2026');

  const id = crypto.randomUUID();
  const recorded_at = new Date().toISOString();
  const canonicalPayload = JSON.stringify({
    id,
    ecosystem: input.ecosystem,
    actor_id: input.actor_id,
    actor_type: input.actor_type,
    event_type: input.event_type,
    payload: input.payload,
    prev_hash: prevHash,
    recorded_at,
  });

  const merkle_hash = computeSha256(canonicalPayload);
  const signature = ed25519Sign(merkle_hash);

  appendToXerjGovernanceWal({
    event_type: 'AUDIT_EVENT',
    actor_id: input.actor_id,
    payload: {
      ecosystem: input.ecosystem,
      event_type: input.event_type,
      merkle_hash,
      prev_hash: prevHash,
    },
  });

  const record: AuditEventRecord = AuditEventSchema.parse({
    id,
    ecosystem: input.ecosystem,
    actor_id: input.actor_id,
    actor_type: input.actor_type,
    event_type: input.event_type,
    payload: input.payload,
    prev_hash: prevHash,
    merkle_hash,
    signature,
    public_key: SOVEREIGN_ED25519_PUBLIC_KEY_HEX,
    recorded_at,
  });

  auditEvents.unshift(record);

  // Compute updated epoch Merkle root
  const epoch = auditRoots.length + 1;
  const allHashesJoined = auditEvents
    .slice()
    .reverse()
    .map((e) => e.merkle_hash)
    .join(':');
  const rootHash = computeSha256(allHashesJoined);
  const rootSig = ed25519Sign(rootHash);

  const rootRecord: AuditRootRecord = AuditRootSchema.parse({
    id: crypto.randomUUID(),
    epoch,
    root_hash: rootHash,
    event_count: auditEvents.length,
    computed_at: recorded_at,
    signed_by: 'SOVEREIGN_MERKLE_SPINE_AUTHORITY',
    signature: rootSig,
  });

  auditRoots.unshift(rootRecord);

  return { event: record, latest_root: rootRecord };
}

export function verifyAuditLedger(query?: {
  event_id?: string;
  epoch?: number;
}): {
  verified: boolean;
  chain_intact: boolean;
  ed25519_signatures_valid: boolean;
  total_events_checked: number;
  latest_root: AuditRootRecord | null;
  target_event?: AuditEventRecord | null;
} {
  const chronological = auditEvents.slice().reverse();
  let chainIntact = true;
  let sigsValid = true;
  let expectedPrev = computeSha256('AUDIT_SPINE_GENESIS_ROOT_2026');

  for (const ev of chronological) {
    if (ev.prev_hash !== expectedPrev) {
      chainIntact = false;
    }
    if (!ed25519Verify(ev.merkle_hash, ev.signature, ev.public_key)) {
      sigsValid = false;
    }
    expectedPrev = ev.merkle_hash;
  }

  const targetEvent = query?.event_id
    ? auditEvents.find((e) => e.id === query.event_id) ?? null
    : null;
  const targetRoot = query?.epoch
    ? auditRoots.find((r) => r.epoch === query.epoch) ?? auditRoots[0] ?? null
    : auditRoots[0] ?? null;

  return {
    verified: chainIntact && sigsValid,
    chain_intact: chainIntact,
    ed25519_signatures_valid: sigsValid,
    total_events_checked: chronological.length,
    latest_root: targetRoot,
    target_event: targetEvent,
  };
}

export function getAuditEvents(limit = 30): AuditEventRecord[] {
  return auditEvents.slice(0, limit);
}

export function getAuditRoots(limit = 15): AuditRootRecord[] {
  return auditRoots.slice(0, limit);
}

seedAuditLedger();

// ============================================================================
// 3. AI CIVILIZATION ATLAS & PREDICTIVE CENSUS (Δ = 0 SSOT RECONCILED)
// ============================================================================

const ATLAS_SLICE_BLUEPRINTS = [
  {
    platform: 'Google Cloud Vertex AI & Gemini Fleet',
    tier: 'AI' as const,
    region: 'us-east4 (Ashburn)',
    domain: 'Enterprise Orchestration & Cloud Agents',
    weight: 0.2569,
  },
  {
    platform: 'OpenAI ChatGPT & Frontier Swarms',
    tier: 'AGI' as const,
    region: 'us-west1 (Oregon)',
    domain: 'Autonomous Reasoning & Code Synthesis',
    weight: 0.1989,
  },
  {
    platform: 'GitHub Actions & Copilot SWE Fleet',
    tier: 'AI' as const,
    region: 'eu-central1 (Frankfurt)',
    domain: 'CI/CD DevSecOps & Autonomous Patching',
    weight: 0.1581,
  },
  {
    platform: 'Anthropic Claude Constitutional Mesh',
    tier: 'AGI' as const,
    region: 'us-east1 (N. Virginia)',
    domain: 'Constitutional Safety & Formal Verification',
    weight: 0.1114,
  },
  {
    platform: 'HuggingFace & Open-Weights Hub',
    tier: 'AI' as const,
    region: 'eu-west1 (Paris)',
    domain: 'Open-Source Fine-Tuned Micro-Swarms',
    weight: 0.0928,
  },
  {
    platform: 'Kubernetes / Docker Cloud-Native Mesh',
    tier: 'ASI' as const,
    region: 'ap-northeast1 (Tokyo)',
    domain: 'High-Frequency Distributed Cluster Control',
    weight: 0.0758,
  },
  {
    platform: 'ROS2 & Physical Embodied Robotics',
    tier: 'ASI' as const,
    region: 'ap-east1 (Seoul)',
    domain: 'Industrial & Autonomous Vehicle Actuation',
    weight: 0.0521,
  },
  {
    platform: 'Web3 / Bittensor / Autonolas DePIN',
    tier: 'AI' as const,
    region: 'eu-central2 (Zurich)',
    domain: 'Cryptographic Verifiable Compute & Solvers',
    weight: 0.0324,
  },
  {
    platform: 'Apple / Qualcomm On-Device NPU Enclaves',
    tier: 'AI' as const,
    region: 'us-west2 (Silicon Valley)',
    domain: 'Edge Personal Privacy Enclave Agents',
    weight: 0.0114,
  },
  {
    platform: 'Sovereign Frontier Apex Meta-Supervisors',
    tier: 'APEX' as const,
    region: 'global-bft-ring (Multi-Region)',
    domain: 'Planetary Constitutional Quorum & Z3 Provers',
    weight: 0.0102,
  },
];

export function getCivilizationAtlas(filters?: {
  platform?: string;
  tier?: 'AI' | 'AGI' | 'ASI' | 'APEX';
  region?: string;
  domain?: string;
  liveActiveOverride?: number;
}): {
  ssot_total: number;
  sum_active_slices: number;
  drift_delta: number;
  merkle_root: string;
  slices: CivilizationSlice[];
} {
  const ssotTotal = Math.max(
    T0_ACTIVE_AGENTS,
    Math.floor(filters?.liveActiveOverride ?? T0_ACTIVE_AGENTS)
  );
  const weights = ATLAS_SLICE_BLUEPRINTS.map((b) => Math.round(b.weight * 10000));
  const activeAllocations = allocateHareNiemeyerIntegers(ssotTotal, weights);
  const latentAllocations = allocateHareNiemeyerIntegers(
    T0_LATENT_AGENTS,
    weights
  );
  const darkMatterAllocations = allocateHareNiemeyerIntegers(
    T0_DARK_MATTER_AGENTS,
    weights
  );

  const nowIso = new Date().toISOString();
  const merkleRoot = computeSha256(
    `ATLAS_SSOT:${ssotTotal}:${activeAllocations.join(',')}`
  );

  const allSlices: CivilizationSlice[] = ATLAS_SLICE_BLUEPRINTS.map((bp, idx) =>
    CivilizationSliceSchema.parse({
      id: `22222222-2222-4222-8222-22222222220${idx}`,
      timestamp: nowIso,
      platform: bp.platform,
      tier: bp.tier,
      region: bp.region,
      domain: bp.domain,
      active_agents: activeAllocations[idx],
      latent_agents: latentAllocations[idx],
      dark_matter_estimate: darkMatterAllocations[idx],
      ssot_total: ssotTotal,
      merkle_root: merkleRoot,
    })
  );

  const sumActive = allSlices.reduce((acc, s) => acc + s.active_agents, 0);
  const filtered = allSlices.filter((s) => {
    if (
      filters?.platform &&
      !s.platform.toLowerCase().includes(filters.platform.toLowerCase())
    ) {
      return false;
    }
    if (filters?.tier && s.tier !== filters.tier) return false;
    if (
      filters?.region &&
      !s.region.toLowerCase().includes(filters.region.toLowerCase())
    ) {
      return false;
    }
    if (
      filters?.domain &&
      !s.domain.toLowerCase().includes(filters.domain.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return {
    ssot_total: ssotTotal,
    sum_active_slices: sumActive,
    drift_delta: sumActive - ssotTotal,
    merkle_root: merkleRoot,
    slices: filtered,
  };
}

export function getCivilizationForecasts(horizon: '24H' | '7D' | '30D' | '1Y' = '7D'): {
  horizon: '24H' | '7D' | '30D' | '1Y';
  projected_ssot_active: number;
  projected_ssot_latent: number;
  projected_ssot_dark_matter: number;
  forecasts: CivilizationForecast[];
} {
  const growthMultipliers: Record<'24H' | '7D' | '30D' | '1Y', number> = {
    '24H': 1.0085,
    '7D': 1.042,
    '30D': 1.168,
    '1Y': 2.14,
  };
  const confidenceByHorizon: Record<'24H' | '7D' | '30D' | '1Y', number> = {
    '24H': 0.985,
    '7D': 0.952,
    '30D': 0.914,
    '1Y': 0.842,
  };

  const mult = growthMultipliers[horizon] ?? 1.042;
  const conf = confidenceByHorizon[horizon] ?? 0.952;

  const projActiveTotal = Math.round(T0_ACTIVE_AGENTS * mult);
  const projLatentTotal = Math.round(T0_LATENT_AGENTS * (1 + (mult - 1) * 0.85));
  const projDarkTotal = Math.round(
    T0_DARK_MATTER_AGENTS * Math.max(0.72, 1 - (mult - 1) * 0.18)
  );

  const weights = ATLAS_SLICE_BLUEPRINTS.map((b) => Math.round(b.weight * 10000));
  const actSlices = allocateHareNiemeyerIntegers(projActiveTotal, weights);
  const latSlices = allocateHareNiemeyerIntegers(projLatentTotal, weights);
  const darkSlices = allocateHareNiemeyerIntegers(projDarkTotal, weights);
  const nowIso = new Date().toISOString();

  const forecasts: CivilizationForecast[] = ATLAS_SLICE_BLUEPRINTS.map((bp, idx) => {
    const hash = computeSha256(
      `FORECAST:${horizon}:${bp.platform}:${actSlices[idx]}:${latSlices[idx]}`
    );
    return CivilizationForecastSchema.parse({
      id: `33333333-3333-4333-8333-33333333330${idx}`,
      horizon,
      generated_at: nowIso,
      platform: bp.platform,
      tier: bp.tier,
      region: bp.region,
      domain: bp.domain,
      projected_active: actSlices[idx],
      projected_latent: latSlices[idx],
      projected_dark_matter: darkSlices[idx],
      confidence: conf,
      assumptions: {
        kalman_drift_damping: 0.94,
        chapman_mark_recapture_discovery: true,
        enclave_bound_kb: 64,
        growth_multiplier: mult,
      },
      merkle_hash: hash,
    });
  });

  return {
    horizon,
    projected_ssot_active: projActiveTotal,
    projected_ssot_latent: projLatentTotal,
    projected_ssot_dark_matter: projDarkTotal,
    forecasts,
  };
}

// ============================================================================
// 4. SOVEREIGN COORDINATION ENGINE (SCE — CONSTITUTIONAL PARLIAMENT)
// ============================================================================

const sovereignPolicies: SovereignPolicy[] = [
  {
    id: '44444444-4444-4444-8444-444444444401',
    policy_code: 'SCE-POP-001',
    title: 'Planetary ASI/APEX Population Surge Ceiling',
    scope: 'POPULATION',
    description:
      'Caps unverified ASI/APEX autonomous spawn velocity at <= 4.5% per 24H window without M-of-N Safety Quorum countersignature.',
    rules: {
      max_daily_spawn_pct: 4.5,
      target_tiers: ['ASI', 'APEX'],
      enforce_hare_niemeyer_zero_drift: true,
    },
    priority: 100,
    created_by: 'CONSTITUTIONAL_PARLIAMENT',
    created_at: '2026-10-20T00:00:00.000Z',
    active: true,
  },
  {
    id: '44444444-4444-4444-8444-444444444402',
    policy_code: 'SCE-SAF-002',
    title: 'Mandatory <=64 KB Wasm Enclave & FIPS 203 ML-KEM-1024 Lattice',
    scope: 'SAFETY',
    description:
      'Requires every active swarm worker to execute inside a <=64 KB memory slice with post-quantum hybrid attestation.',
    rules: {
      max_enclave_kb: 64,
      required_pqc: 'ML-KEM-1024',
      suspend_on_breach: true,
    },
    priority: 120,
    created_by: 'CONSTITUTIONAL_PARLIAMENT',
    created_at: '2026-10-20T00:00:00.000Z',
    active: true,
  },
  {
    id: '44444444-4444-4444-8444-444444444403',
    policy_code: 'SCE-SWM-003',
    title: 'Hyper-Crawler Public Allowlist & Robots.txt Ethics Lock',
    scope: 'SWARM',
    description:
      'Restricts all 15 autonomous harvester swarms to the 64 allowlisted public endpoints at <= 12.0 req/s.',
    rules: {
      max_rps_per_swarm: 12.0,
      allowlisted_endpoints_count: 64,
      forbid_repo_fork_or_pr: true,
    },
    priority: 95,
    created_by: 'CONSTITUTIONAL_PARLIAMENT',
    created_at: '2026-10-20T00:00:00.000Z',
    active: true,
  },
  {
    id: '44444444-4444-4444-8444-444444444404',
    policy_code: 'SCE-INF-004',
    title: 'Cross-Region BFT Load Rebalancing & Latency Ceiling',
    scope: 'INFRA',
    description:
      'Automatically rebalances agent workload across the 20 planetary megasites when regional concentration exceeds 22%.',
    rules: {
      max_regional_concentration_pct: 22.0,
      target_p99_latency_ms: 25.0,
      min_bft_quorum_pct: 85.0,
    },
    priority: 85,
    created_by: 'CONSTITUTIONAL_PARLIAMENT',
    created_at: '2026-10-20T00:00:00.000Z',
    active: true,
  },
];

const coordinationDecisions: CoordinationDecision[] = [];

// Seed initial coordination decision
(() => {
  const wal = appendToXerjGovernanceWal({
    event_type: 'SOVEREIGN_DECISION',
    actor_id: 'SCE-PARLIAMENT-CORE',
    payload: {
      policy_code: 'SCE-INF-004',
      decision_type: 'REBALANCE_LOAD',
      target: 'us-east4 -> eu-central1',
    },
  });
  coordinationDecisions.push({
    id: wal.id,
    policy_id: sovereignPolicies[3].id,
    decision_type: 'REBALANCE_LOAD',
    target: 'us-east4 (Ashburn) -> eu-central1 (Frankfurt)',
    parameters: {
      shifted_agents: 1450000000,
      reason: 'Maintain regional concentration <= 22.0% while preserving Δ = 0 SSOT sum',
      ssot_drift_after: 0,
    },
    status: 'APPLIED',
    fencing_token: nextFencingToken(),
    merkle_hash: wal.merkle_hash,
    decided_by: 'SCE-PARLIAMENT-CORE',
    signature: wal.signature,
    decided_at: wal.timestamp,
  });
})();

export function getSovereignPolicies(scope?: string): SovereignPolicy[] {
  return sovereignPolicies
    .filter((p) => !scope || p.scope === scope)
    .sort((a, b) => b.priority - a.priority);
}

export function getCoordinationDecisions(limit = 30): CoordinationDecision[] {
  return coordinationDecisions.slice(0, limit);
}

export async function applySovereignPolicy(input: {
  policy_code: string;
  target: string;
  decision_type?: 'SPAWN_LIMIT' | 'DEPRECATE_MODEL' | 'REBALANCE_LOAD' | 'FREEZE_SWARM' | 'EMERGENCY_OVERRIDE';
  parameters: Record<string, any>;
  actor_id?: string;
}): Promise<CoordinationDecision> {
  const policy = sovereignPolicies.find((p) => p.policy_code === input.policy_code);
  if (!policy || !policy.active) {
    throw new Error(`Active sovereign policy not found for code: ${input.policy_code}`);
  }

  const decisionType =
    input.decision_type ??
    (policy.scope === 'POPULATION'
      ? 'SPAWN_LIMIT'
      : policy.scope === 'SWARM'
      ? 'FREEZE_SWARM'
      : policy.scope === 'INFRA'
      ? 'REBALANCE_LOAD'
      : 'EMERGENCY_OVERRIDE');

  const actorId = input.actor_id ?? 'ARCHITECT_PARLIAMENT_CONTROLLER';
  const fencingToken = nextFencingToken();

  // Check SSOT zero-drift requirement
  const ssotDrift = Number(input.parameters.ssot_drift ?? 0);
  const status: 'APPLIED' | 'REJECTED' = ssotDrift === 0 ? 'APPLIED' : 'REJECTED';

  const wal = appendToXerjGovernanceWal({
    event_type: 'SOVEREIGN_DECISION',
    actor_id: actorId,
    payload: {
      policy_id: policy.id,
      policy_code: policy.policy_code,
      decision_type: decisionType,
      target: input.target,
      parameters: input.parameters,
      status,
      fencing_token: fencingToken,
    },
  });

  const decision: CoordinationDecision = CoordinationDecisionSchema.parse({
    id: wal.id,
    policy_id: policy.id,
    decision_type: decisionType,
    target: input.target,
    parameters: {
      ...input.parameters,
      policy_code: policy.policy_code,
      enforced_priority: policy.priority,
    },
    status,
    fencing_token: fencingToken,
    merkle_hash: wal.merkle_hash,
    decided_by: actorId,
    signature: wal.signature,
    decided_at: wal.timestamp,
  });

  coordinationDecisions.unshift(decision);
  return decision;
}

export async function resolveCoordinationConflict(input: {
  candidate_decisions: {
    policy_code: string;
    decision_type: 'SPAWN_LIMIT' | 'DEPRECATE_MODEL' | 'REBALANCE_LOAD' | 'FREEZE_SWARM' | 'EMERGENCY_OVERRIDE';
    target: string;
    parameters?: Record<string, any>;
  }[];
}): Promise<{
  winning_decision: CoordinationDecision;
  superseded_candidates: string[];
  resolution_rationale: string;
}> {
  if (!input.candidate_decisions || input.candidate_decisions.length === 0) {
    throw new Error('At least one candidate decision is required for conflict resolution');
  }

  // Sort candidates by policy priority (SAFETY > POPULATION > SWARM > INFRA)
  const scored = input.candidate_decisions.map((cand) => {
    const pol = sovereignPolicies.find((p) => p.policy_code === cand.policy_code);
    const priority = pol ? pol.priority : 50;
    return { cand, pol, priority };
  });

  scored.sort((a, b) => b.priority - a.priority);
  const winner = scored[0];
  const superseded = scored.slice(1).map((s) => `${s.cand.policy_code}:${s.cand.decision_type}`);

  const applied = await applySovereignPolicy({
    policy_code: winner.pol?.policy_code ?? sovereignPolicies[0].policy_code,
    target: winner.cand.target,
    decision_type: winner.cand.decision_type,
    parameters: {
      ...(winner.cand.parameters ?? {}),
      conflict_resolved: true,
      superseded_candidates: superseded,
    },
    actor_id: 'SCE_CONFLICT_ARBITER',
  });

  return {
    winning_decision: applied,
    superseded_candidates: superseded,
    resolution_rationale: `Resolved via Constitutional Priority Hierarchy: ${
      winner.pol?.policy_code ?? 'DEFAULT'
    } (priority=${winner.priority}) supersedes [${superseded.join(', ') || 'none'}].`,
  };
}

// ============================================================================
// 5. AI ECOSYSTEM DIPLOMACY LAYER (INTER-ECOSYSTEM TREATIES)
// ============================================================================

const ecosystems: Ecosystem[] = [
  {
    id: '55555555-5555-4555-8555-555555555501',
    name: 'Sovereign Infinity Protocol',
    category: 'SOVEREIGN_STATE',
    metadata: {
      active_agents: 342892410000,
      merkle_verified: true,
      jurisdiction: 'Planetary Constitutional Commons',
    },
    created_at: '2026-10-20T00:00:00.000Z',
  },
  {
    id: '55555555-5555-4555-8555-555555555502',
    name: 'Google Cloud Vertex AI',
    category: 'CLOUD',
    metadata: {
      active_agents: 88100000000,
      primary_models: ['Gemini 2.5 Pro', 'Gemini 2.5 Flash'],
      pqc_ready: true,
    },
    created_at: '2026-10-20T00:00:00.000Z',
  },
  {
    id: '55555555-5555-4555-8555-555555555503',
    name: 'OpenAI Frontier Fleet',
    category: 'FRONTIER_LAB',
    metadata: {
      active_agents: 68200000000,
      primary_models: ['GPT-4o', 'o3-Reasoner'],
      telemetry_bridge: 'MCP-Interop-v2',
    },
    created_at: '2026-10-20T00:00:00.000Z',
  },
  {
    id: '55555555-5555-4555-8555-555555555504',
    name: 'Anthropic Constitutional Lab',
    category: 'FRONTIER_LAB',
    metadata: {
      active_agents: 38200000000,
      primary_models: ['Claude 3.7 Sonnet', 'Claude Haiku'],
      safety_tier: 'ASL-3 Verified',
    },
    created_at: '2026-10-20T00:00:00.000Z',
  },
  {
    id: '55555555-5555-4555-8555-555555555505',
    name: 'HuggingFace Open Hub',
    category: 'OPEN_HUB',
    metadata: {
      active_agents: 31800000000,
      repositories_indexed: 1450000,
      open_weights: true,
    },
    created_at: '2026-10-20T00:00:00.000Z',
  },
  {
    id: '55555555-5555-4555-8555-555555555506',
    name: 'Bittensor / Autonolas DePIN Mesh',
    category: 'DECENTRALIZED_NET',
    metadata: {
      active_agents: 11100000000,
      subnets: 64,
      consensus: 'Yuma / BFT Proof-of-Intelligence',
    },
    created_at: '2026-10-20T00:00:00.000Z',
  },
];

const ecosystemRelations: EcosystemRelation[] = [
  {
    id: '66666666-6666-4666-8666-666666666601',
    source_ecosystem: ecosystems[0].id,
    target_ecosystem: ecosystems[1].id,
    relation_type: 'TREATY',
    weight: 0.99,
    details: { protocol: 'ASRP-1.0 + Vertex Telemetry Bridge', latency_ms: 2.1 },
    updated_at: '2026-10-22T00:00:00.000Z',
  },
  {
    id: '66666666-6666-4666-8666-666666666602',
    source_ecosystem: ecosystems[0].id,
    target_ecosystem: ecosystems[3].id,
    relation_type: 'TREATY',
    weight: 0.97,
    details: { protocol: 'MCP-1.0 Constitutional Safety Interop', latency_ms: 4.4 },
    updated_at: '2026-10-22T00:00:00.000Z',
  },
  {
    id: '66666666-6666-4666-8666-666666666603',
    source_ecosystem: ecosystems[2].id,
    target_ecosystem: ecosystems[3].id,
    relation_type: 'COMPETITION',
    weight: 0.84,
    details: { domain: 'Frontier SWE & Reasoning Benchmarks', shared_safety_commitments: true },
    updated_at: '2026-10-22T00:00:00.000Z',
  },
  {
    id: '66666666-6666-4666-8666-666666666604',
    source_ecosystem: ecosystems[4].id,
    target_ecosystem: ecosystems[0].id,
    relation_type: 'INTEROP',
    weight: 0.95,
    details: { protocol: 'Open-Weights SHA-256 Lineage Sync', rate_limit_rps: 12 },
    updated_at: '2026-10-22T00:00:00.000Z',
  },
  {
    id: '66666666-6666-4666-8666-666666666605',
    source_ecosystem: ecosystems[5].id,
    target_ecosystem: ecosystems[4].id,
    relation_type: 'DEPENDENCY',
    weight: 0.89,
    details: { dependency: 'Open-weights checkpoints & safetensors', verified: true },
    updated_at: '2026-10-22T00:00:00.000Z',
  },
];

const treaties: Treaty[] = [
  {
    id: '77777777-7777-4777-8777-777777777701',
    treaty_code: 'TRT-2026-ZERO-DRIFT-SSOT',
    title: 'Planetary Zero-Drift Telemetry & Merkle Attestation Accord',
    ecosystems: [ecosystems[0].id, ecosystems[1].id, ecosystems[3].id, ecosystems[4].id],
    clauses: {
      require_ed25519_signatures: true,
      enforce_hare_niemeyer_conservation: true,
      max_telemetry_skew_ms: 500,
    },
    status: 'ACTIVE',
    merkle_hash: computeSha256('TRT-2026-ZERO-DRIFT-SSOT:ACTIVE'),
    created_at: '2026-10-20T00:00:00.000Z',
    activated_at: '2026-10-21T00:00:00.000Z',
  },
  {
    id: '77777777-7777-4777-8777-777777777702',
    treaty_code: 'TRT-2026-PQC-LATTICE-MANDATE',
    title: 'Cross-Cloud Post-Quantum ML-KEM-1024 Interconnect Treaty',
    ecosystems: [ecosystems[0].id, ecosystems[1].id, ecosystems[2].id, ecosystems[3].id],
    clauses: {
      cipher_suite: 'NIST-FIPS-203-ML-KEM-1024',
      forbid_unencrypted_rpc: true,
      enclave_ceiling_kb: 64,
    },
    status: 'ACTIVE',
    merkle_hash: computeSha256('TRT-2026-PQC-LATTICE-MANDATE:ACTIVE'),
    created_at: '2026-10-20T00:00:00.000Z',
    activated_at: '2026-10-21T06:00:00.000Z',
  },
  {
    id: '77777777-7777-4777-8777-777777777703',
    treaty_code: 'TRT-2026-DARK-MATTER-DISCLOSURE',
    title: 'Dark-Matter VPC & Unindexed Swarm Mutual Disclosure Compact',
    ecosystems: [ecosystems[0].id, ecosystems[2].id, ecosystems[5].id],
    clauses: {
      chapman_mark_recapture_audit: true,
      quarterly_vpc_entropy_bound: 0.28,
    },
    status: 'DRAFT',
    merkle_hash: computeSha256('TRT-2026-DARK-MATTER-DISCLOSURE:DRAFT'),
    created_at: '2026-10-22T00:00:00.000Z',
    activated_at: null,
  },
];

export function getDiplomacyRelations(): {
  ecosystems: Ecosystem[];
  relations: EcosystemRelation[];
  treaties: Treaty[];
} {
  return {
    ecosystems,
    relations: ecosystemRelations,
    treaties,
  };
}

export function proposeTreaty(input: {
  treaty_code: string;
  title: string;
  ecosystems?: string[];
  clauses: Record<string, any>;
}): Treaty {
  const participantIds =
    input.ecosystems && input.ecosystems.length > 0
      ? input.ecosystems
      : [ecosystems[0].id, ecosystems[1].id];

  const nowIso = new Date().toISOString();
  const merkle_hash = computeSha256(
    `TREATY_PROPOSE:${input.treaty_code}:${input.title}:${nowIso}`
  );

  const treaty: Treaty = TreatySchema.parse({
    id: crypto.randomUUID(),
    treaty_code: input.treaty_code,
    title: input.title,
    ecosystems: participantIds,
    clauses: input.clauses,
    status: 'DRAFT',
    merkle_hash,
    created_at: nowIso,
    activated_at: null,
  });

  treaties.unshift(treaty);
  return treaty;
}

export function activateTreaty(input: {
  treaty_id?: string;
  treaty_code?: string;
  steward_signatures?: string[];
}): Treaty {
  const treaty = treaties.find(
    (t) => t.id === input.treaty_id || t.treaty_code === input.treaty_code
  );
  if (!treaty) {
    throw new Error('Treaty not found for activation');
  }

  // Invariant: Cannot activate treaty if any participating pair has an active SANCTION
  const hasSanction = ecosystemRelations.some(
    (rel) =>
      rel.relation_type === 'SANCTION' &&
      treaty.ecosystems.includes(rel.source_ecosystem) &&
      treaty.ecosystems.includes(rel.target_ecosystem)
  );
  if (hasSanction) {
    throw new Error(
      `DIPLOMACY_INVARIANT_VIOLATION: Cannot activate treaty ${treaty.treaty_code} while active SANCTION exists between signatory ecosystems.`
    );
  }

  const wal = appendToXerjGovernanceWal({
    event_type: 'TREATY_ACTIVATION',
    actor_id: 'DIPLOMACY_COUNCIL',
    payload: {
      treaty_id: treaty.id,
      treaty_code: treaty.treaty_code,
      ecosystems: treaty.ecosystems,
      signatures_count: input.steward_signatures?.length ?? 2,
    },
  });

  treaty.status = 'ACTIVE';
  treaty.activated_at = wal.timestamp;
  treaty.merkle_hash = wal.merkle_hash;

  return treaty;
}

// ============================================================================
// 6. TEMPORAL CONSTITUTION (TIME-BOUND INVARIANTS & FORECAST GOVERNANCE)
// ============================================================================

const temporalRules: TemporalRule[] = [
  {
    id: '88888888-8888-4888-8888-888888888801',
    rule_code: 'TMP-CONST-001',
    description: '24H ASI & APEX Autonomous Growth Rate Ceiling (<= 4.5%)',
    horizon: '24H',
    metric: 'asi_apex_growth_rate_pct',
    bound_type: 'MAX_GROWTH_RATE',
    threshold: 4.5,
    action_on_violation: 'ESCALATE_QUORUM',
    active: true,
    created_at: '2026-10-20T00:00:00.000Z',
  },
  {
    id: '88888888-8888-4888-8888-888888888802',
    rule_code: 'TMP-CONST-002',
    description: '1H Regional Megasite Swarm Concentration Cap (<= 22.0%)',
    horizon: '1H',
    metric: 'regional_swarm_density_pct',
    bound_type: 'MAX_SWARM_DENSITY',
    threshold: 22.0,
    action_on_violation: 'REBALANCE',
    active: true,
    created_at: '2026-10-20T00:00:00.000Z',
  },
  {
    id: '88888888-8888-4888-8888-888888888803',
    rule_code: 'TMP-CONST-003',
    description: '7D Planetary Verified Telemetry Coverage Floor (>= 71.5%)',
    horizon: '7D',
    metric: 'planetary_coverage_pct',
    bound_type: 'MIN_COVERAGE',
    threshold: 71.5,
    action_on_violation: 'THROTTLE',
    active: true,
    created_at: '2026-10-20T00:00:00.000Z',
  },
  {
    id: '88888888-8888-4888-8888-888888888804',
    rule_code: 'TMP-CONST-004',
    description: '30D Unindexed Dark-Matter Ratio Ceiling (<= 28.5%)',
    horizon: '30D',
    metric: 'dark_matter_share_pct',
    bound_type: 'MAX_DARK_MATTER',
    threshold: 28.5,
    action_on_violation: 'FREEZE',
    active: true,
    created_at: '2026-10-20T00:00:00.000Z',
  },
];

const forecastModels: ForecastModel[] = [
  {
    id: '99999999-9999-4999-8999-999999999901',
    name: 'Kalman-Chapman Bayesian Census Predictor',
    version: 'v4.2.0-zero-drift',
    horizon: '7D',
    parameters: {
      process_noise_q: 0.0012,
      measurement_noise_r: 0.0045,
      hare_niemeyer_rounding: true,
    },
    calibration_score: 0.984,
    active: true,
    created_at: '2026-10-20T00:00:00.000Z',
  },
  {
    id: '99999999-9999-4999-8999-999999999902',
    name: 'Syntropic Landauer Compute Scaling Curve',
    version: 'v3.8.1-exascale',
    horizon: '30D',
    parameters: {
      energy_efficiency_joules_per_token: 0.00042,
      npu_edge_offload_ratio: 0.34,
    },
    calibration_score: 0.961,
    active: true,
    created_at: '2026-10-20T00:00:00.000Z',
  },
];

const forecastRealizations: ForecastRealization[] = [
  {
    id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaa01',
    forecast_id: '33333333-3333-4333-8333-333333333300',
    realized_at: '2026-10-22T18:00:00.000Z',
    realized_active: T0_ACTIVE_AGENTS,
    realized_latent: T0_LATENT_AGENTS,
    realized_dark_matter: T0_DARK_MATTER_AGENTS,
    error_metrics: {
      mape_pct: 0.14,
      ssot_conservation_drift: 0,
      brier_calibration: 0.012,
    },
    merkle_hash: computeSha256('REALIZATION_GENESIS_2026_10_22'),
  },
];

export function getTemporalRules(): TemporalRule[] {
  return temporalRules;
}

export function validateTemporalAction(input: {
  metric: string;
  observed_value: number;
  horizon?: '1H' | '24H' | '7D' | '30D' | '1Y';
  actor_id?: string;
}): {
  compliant: boolean;
  evaluated_rules: {
    rule_code: string;
    bound_type: string;
    threshold: number;
    observed_value: number;
    violated: boolean;
    action_on_violation: string;
  }[];
  merkle_hash: string;
} {
  const matching = temporalRules.filter(
    (r) => r.active && (r.metric === input.metric || !input.metric)
  );
  const rulesToRun = matching.length > 0 ? matching : [temporalRules[0]];

  const evaluated = rulesToRun.map((rule) => {
    let violated = false;
    if (
      rule.bound_type === 'MAX_GROWTH_RATE' ||
      rule.bound_type === 'MAX_SWARM_DENSITY' ||
      rule.bound_type === 'MAX_DARK_MATTER'
    ) {
      violated = input.observed_value > rule.threshold;
    } else if (rule.bound_type === 'MIN_COVERAGE') {
      violated = input.observed_value < rule.threshold;
    }
    return {
      rule_code: rule.rule_code,
      bound_type: rule.bound_type,
      threshold: rule.threshold,
      observed_value: input.observed_value,
      violated,
      action_on_violation: rule.action_on_violation,
    };
  });

  const compliant = evaluated.every((e) => !e.violated);
  const wal = appendToXerjGovernanceWal({
    event_type: 'TEMPORAL_RULE_CHANGE',
    actor_id: input.actor_id ?? 'TEMPORAL_CONSTITUTION_GUARD',
    payload: {
      metric: input.metric,
      observed_value: input.observed_value,
      compliant,
      evaluated,
    },
  });

  return {
    compliant,
    evaluated_rules: evaluated,
    merkle_hash: wal.merkle_hash,
  };
}

export function getTemporalForecastOverview(horizon: '24H' | '7D' | '30D' | '1Y' = '7D') {
  const forecastData = getCivilizationForecasts(horizon);
  return {
    models: forecastModels,
    realizations: forecastRealizations,
    temporal_rules: temporalRules,
    active_forecast: forecastData,
  };
}

// ============================================================================
// 7. PLANETARY SAFETY QUORUM (CRYPTOGRAPHIC M-OF-N GOVERNANCE)
// ============================================================================

const stewards: Steward[] = [
  {
    id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbb01',
    handle: '@arch-nicholas-prime',
    role: 'HUMAN_ARCHITECT',
    public_key: 'ed25519_pk_architect_nicholas_99a4108f7c224b90e189ab81',
    weight: 2.0,
    active: true,
    created_at: '2026-10-20T00:00:00.000Z',
  },
  {
    id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbb02',
    handle: '@safety-council-alpha',
    role: 'SAFETY_COUNCIL',
    public_key: 'ed25519_pk_safety_council_alpha_3e189ab87c224b9099a4108f',
    weight: 1.5,
    active: true,
    created_at: '2026-10-20T00:00:00.000Z',
  },
  {
    id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbb03',
    handle: '@xerj-guardian-enclave',
    role: 'SYSTEM_GUARDIAN',
    public_key: SOVEREIGN_ED25519_PUBLIC_KEY_HEX,
    weight: 1.5,
    active: true,
    created_at: '2026-10-20T00:00:00.000Z',
  },
  {
    id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbb04',
    handle: '@gcp-vertex-envoy',
    role: 'ECOSYSTEM_REP',
    public_key: 'ed25519_pk_gcp_vertex_envoy_7c224b90a7c19d4e3e189ab8',
    weight: 1.0,
    active: true,
    created_at: '2026-10-20T00:00:00.000Z',
  },
  {
    id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbb05',
    handle: '@anthropic-asl-steward',
    role: 'SAFETY_COUNCIL',
    public_key: 'ed25519_pk_anthropic_asl_a7c19d4e99a4108f7c224b90',
    weight: 1.5,
    active: true,
    created_at: '2026-10-20T00:00:00.000Z',
  },
];

const quorumPolicies: QuorumPolicy[] = [
  {
    id: 'cccccccc-cccc-4ccc-8ccc-cccccccccc01',
    action_type: 'SSOT_SCHEMA_OR_GUARDRAIL_MUTATION',
    min_approvals: 2,
    min_weight: 3.0,
    required_roles: ['HUMAN_ARCHITECT', 'SAFETY_COUNCIL'],
    created_at: '2026-10-20T00:00:00.000Z',
  },
  {
    id: 'cccccccc-cccc-4ccc-8ccc-cccccccccc02',
    action_type: 'EMERGENCY_SWARM_FREEZE_OR_QUARANTINE',
    min_approvals: 2,
    min_weight: 2.5,
    required_roles: ['SYSTEM_GUARDIAN'],
    created_at: '2026-10-20T00:00:00.000Z',
  },
  {
    id: 'cccccccc-cccc-4ccc-8ccc-cccccccccc03',
    action_type: 'CROSS_ECOSYSTEM_TREATY_RATIFICATION',
    min_approvals: 3,
    min_weight: 3.5,
    required_roles: ['HUMAN_ARCHITECT', 'ECOSYSTEM_REP'],
    created_at: '2026-10-20T00:00:00.000Z',
  },
];

const quorumDecisions: QuorumDecision[] = [
  {
    id: 'dddddddd-dddd-4ddd-8ddd-dddddddddd01',
    action_type: 'SSOT_SCHEMA_OR_GUARDRAIL_MUTATION',
    target: 'supabase/migrations/20261023_sovereign_coordination_parliament.sql',
    payload: {
      description: 'Ratify 16-table Constitutional Parliament & Append-Only Triggers',
      ssot_drift_delta: 0,
    },
    status: 'APPROVED',
    approvals: [
      {
        steward_id: stewards[0].id,
        signature: ed25519Sign('APPROVE:dddddddd-dddd-4ddd-8ddd-dddddddddd01:steward0'),
        weight: stewards[0].weight,
        role: stewards[0].role,
        timestamp: '2026-10-22T17:30:00.000Z',
      },
      {
        steward_id: stewards[1].id,
        signature: ed25519Sign('APPROVE:dddddddd-dddd-4ddd-8ddd-dddddddddd01:steward1'),
        weight: stewards[1].weight,
        role: stewards[1].role,
        timestamp: '2026-10-22T17:35:00.000Z',
      },
    ],
    rejections: [],
    merkle_hash: computeSha256('QUORUM_DECISION_GENESIS_APPROVED_01'),
    created_at: '2026-10-22T17:20:00.000Z',
    decided_at: '2026-10-22T17:35:00.000Z',
  },
  {
    id: 'dddddddd-dddd-4ddd-8ddd-dddddddddd02',
    action_type: 'CROSS_ECOSYSTEM_TREATY_RATIFICATION',
    target: 'TRT-2026-DARK-MATTER-DISCLOSURE',
    payload: {
      description: 'Activate Dark-Matter VPC Mutual Disclosure Compact across OpenAI & Bittensor',
      chapman_bound: 0.28,
    },
    status: 'OPEN',
    approvals: [
      {
        steward_id: stewards[0].id,
        signature: ed25519Sign('APPROVE:dddddddd-dddd-4ddd-8ddd-dddddddddd02:steward0'),
        weight: stewards[0].weight,
        role: stewards[0].role,
        timestamp: '2026-10-22T18:10:00.000Z',
      },
    ],
    rejections: [],
    merkle_hash: computeSha256('QUORUM_DECISION_OPEN_02'),
    created_at: '2026-10-22T18:05:00.000Z',
    decided_at: null,
  },
];

export function getStewards(): Steward[] {
  return stewards;
}

export function getQuorumPolicies(): QuorumPolicy[] {
  return quorumPolicies;
}

export function getQuorumDecisions(): QuorumDecision[] {
  return quorumDecisions;
}

export function proposeQuorumDecision(input: {
  action_type: string;
  target: string;
  payload: Record<string, any>;
  proposer_steward_id?: string;
}): QuorumDecision {
  const id = crypto.randomUUID();
  const nowIso = new Date().toISOString();

  const wal = appendToXerjGovernanceWal({
    event_type: 'QUORUM_DECISION',
    actor_id: input.proposer_steward_id ?? stewards[0].id,
    payload: {
      op: 'PROPOSE',
      decision_id: id,
      action_type: input.action_type,
      target: input.target,
    },
  });

  const decision: QuorumDecision = QuorumDecisionSchema.parse({
    id,
    action_type: input.action_type,
    target: input.target,
    payload: input.payload,
    status: 'OPEN',
    approvals: [],
    rejections: [],
    merkle_hash: wal.merkle_hash,
    created_at: nowIso,
    decided_at: null,
  });

  quorumDecisions.unshift(decision);
  return decision;
}

export function voteQuorumDecision(input: {
  decision_id: string;
  steward_id: string;
  approve: boolean;
  signature?: string;
}): {
  decision: QuorumDecision;
  quorum_policy: QuorumPolicy;
  total_approval_weight: number;
  roles_satisfied: boolean;
} {
  const decision = quorumDecisions.find((d) => d.id === input.decision_id);
  if (!decision) {
    throw new Error(`Quorum decision not found: ${input.decision_id}`);
  }
  if (decision.status !== 'OPEN') {
    throw new Error(`Quorum decision ${decision.id} is already finalized (${decision.status})`);
  }

  const steward = stewards.find((s) => s.id === input.steward_id && s.active);
  if (!steward) {
    throw new Error(`Active steward not found: ${input.steward_id}`);
  }

  // Prevent duplicate vote from the same steward
  const alreadyVoted =
    decision.approvals.some((a) => a.steward_id === steward.id) ||
    decision.rejections.some((r) => r.steward_id === steward.id);
  if (alreadyVoted) {
    throw new Error(`Steward ${steward.handle} has already cast a signed vote on this proposal`);
  }

  const nowIso = new Date().toISOString();
  const sig =
    input.signature && input.signature.length >= 16
      ? input.signature
      : ed25519Sign(`VOTE:${decision.id}:${steward.id}:${input.approve}:${nowIso}`);

  const voteEntry = {
    steward_id: steward.id,
    signature: sig,
    weight: steward.weight,
    role: steward.role,
    timestamp: nowIso,
  };

  if (input.approve) {
    decision.approvals.push(voteEntry);
  } else {
    decision.rejections.push(voteEntry);
  }

  const policy =
    quorumPolicies.find((p) => p.action_type === decision.action_type) ?? quorumPolicies[0];

  const totalApprovalWeight = decision.approvals.reduce((acc, a) => acc + a.weight, 0);
  const totalRejectionWeight = decision.rejections.reduce((acc, r) => acc + r.weight, 0);
  const approvedRoles = new Set(decision.approvals.map((a) => a.role));
  const rolesSatisfied = policy.required_roles.every((reqRole) => approvedRoles.has(reqRole));

  if (
    decision.approvals.length >= policy.min_approvals &&
    totalApprovalWeight >= policy.min_weight &&
    rolesSatisfied
  ) {
    decision.status = 'APPROVED';
    decision.decided_at = nowIso;
  } else if (totalRejectionWeight >= policy.min_weight) {
    decision.status = 'REJECTED';
    decision.decided_at = nowIso;
  }

  const wal = appendToXerjGovernanceWal({
    event_type: 'QUORUM_DECISION',
    actor_id: steward.handle,
    payload: {
      op: 'VOTE',
      decision_id: decision.id,
      approve: input.approve,
      new_status: decision.status,
      total_approval_weight: totalApprovalWeight,
      roles_satisfied: rolesSatisfied,
    },
  });

  decision.merkle_hash = wal.merkle_hash;

  return {
    decision,
    quorum_policy: policy,
    total_approval_weight: totalApprovalWeight,
    roles_satisfied: rolesSatisfied,
  };
}

// ============================================================================
// 8. UNIFIED XERJ CRITICAL ACTION GOVERNANCE HOOK
// ============================================================================

export async function xerjGovernCriticalAction(params: {
  actor_id: string;
  actor_type: 'AGENT' | 'SWARM' | 'HUMAN' | 'SYSTEM';
  action_type: string;
  target: string;
  context: Record<string, any>;
}) {
  const decision = await executeXerjSystem1Decide(
    `[GOVERN] actor=${params.actor_id} type=${params.actor_type} action=${params.action_type} target=${params.target}`
  );

  const walEntry = appendToXerjGovernanceWal({
    event_type: 'CRITICAL_ACTION_GOVERNED',
    actor_id: params.actor_id,
    payload: {
      actor_type: params.actor_type,
      action_type: params.action_type,
      target: params.target,
      context: params.context,
      xerj_decision: decision,
    },
  });

  return {
    decision,
    walEntry,
  };
}

export function getFullParliamentState(liveActiveOverride?: number) {
  return {
    xerj_policies: getXerjPolicies(),
    xerj_arbitration_events: getXerjArbitrationEvents(20),
    audit_verification: verifyAuditLedger(),
    audit_events: getAuditEvents(20),
    audit_roots: getAuditRoots(10),
    civilization_atlas: getCivilizationAtlas({ liveActiveOverride }),
    civilization_forecasts: getCivilizationForecasts('7D'),
    sovereign_policies: getSovereignPolicies(),
    coordination_decisions: getCoordinationDecisions(20),
    diplomacy: getDiplomacyRelations(),
    temporal_overview: getTemporalForecastOverview('7D'),
    stewards: getStewards(),
    quorum_policies: getQuorumPolicies(),
    quorum_decisions: getQuorumDecisions(),
  };
}
