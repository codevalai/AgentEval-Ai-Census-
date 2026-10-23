/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * SOVEREIGN COORDINATION PARLIAMENT, XERJ ARBITRATION MESH, AUDIT LEDGER,
 * CIVILIZATION ATLAS, DIPLOMACY LAYER, TEMPORAL CONSTITUTION & SAFETY QUORUM SCHEMAS
 */

import { z } from 'zod';

// ============================================================================
// 1. XERJ ARBITRATION MESH SCHEMAS
// ============================================================================

export const XerjPolicySchema = z.object({
  id: z.string().uuid(),
  policy_name: z.string().min(1),
  scope: z.enum(['TOOL', 'MEMORY', 'SWARM', 'SAFETY']),
  actor_capability_profile: z.string().min(1),
  resource_pattern: z.string().min(1),
  max_rate_per_minute: z.number().int().positive(),
  allowed_actions: z.array(z.string()),
  forbidden_actions: z.array(z.string()),
  severity: z.enum(['INFO', 'WARN', 'ERROR', 'CRITICAL']),
  created_by: z.string().min(1),
  created_at: z.string(),
});

export type XerjPolicy = z.infer<typeof XerjPolicySchema>;

export const XerjArbitrationEventSchema = z.object({
  id: z.string().uuid(),
  actor_id: z.string().min(1),
  actor_capability_profile: z.string().min(1),
  action_type: z.enum(['TOOL_CALL', 'MEMORY_READ', 'MEMORY_WRITE', 'SWARM_ASSIGN', 'SAFETY_BLOCK']),
  surface: z.enum(['CLOUD', 'DEVICE_NPU', 'WEBGPU', 'MESH', 'SOVEREIGN_CLOUD']),
  target_resource: z.string().min(1),
  decision: z.enum(['ALLOW', 'DENY', 'ESCALATE', 'SUSPEND']),
  decision_tier: z.enum(['XERJ_LOCAL_SYSTEM1', 'LLM_SYSTEM2_FALLBACK']),
  reason: z.record(z.string(), z.any()),
  fencing_token: z.union([z.bigint(), z.number(), z.string()]),
  merkle_hash: z.string().min(16),
  signature: z.string().min(16),
  recorded_at: z.string(),
});

export type XerjArbitrationEvent = z.infer<typeof XerjArbitrationEventSchema>;

// ============================================================================
// 2. CROSS-ECOSYSTEM AUDIT LEDGER & MERKLE SPINE SCHEMAS
// ============================================================================

export const AuditEventSchema = z.object({
  id: z.string().uuid(),
  ecosystem: z.string().min(1),
  actor_id: z.string().min(1),
  actor_type: z.enum(['AGENT', 'SWARM', 'HUMAN', 'SYSTEM']),
  event_type: z.string().min(1),
  payload: z.record(z.string(), z.any()),
  prev_hash: z.string().min(16),
  merkle_hash: z.string().min(16),
  signature: z.string().min(16),
  public_key: z.string().min(16),
  recorded_at: z.string(),
});

export type AuditEventRecord = z.infer<typeof AuditEventSchema>;

export const AuditRootSchema = z.object({
  id: z.string().uuid(),
  epoch: z.number().int().nonnegative(),
  root_hash: z.string().min(16),
  event_count: z.number().int().nonnegative(),
  computed_at: z.string(),
  signed_by: z.string().min(1),
  signature: z.string().min(16),
});

export type AuditRootRecord = z.infer<typeof AuditRootSchema>;

// ============================================================================
// 3. AI CIVILIZATION ATLAS & PREDICTIVE CENSUS SCHEMAS
// ============================================================================

export const CivilizationSliceSchema = z.object({
  id: z.string().uuid(),
  timestamp: z.string(),
  platform: z.string().min(1),
  tier: z.enum(['AI', 'AGI', 'ASI', 'APEX']),
  region: z.string().min(1),
  domain: z.string().min(1),
  active_agents: z.number().int().nonnegative(),
  latent_agents: z.number().int().nonnegative(),
  dark_matter_estimate: z.number().int().nonnegative(),
  ssot_total: z.number().int().positive(),
  merkle_root: z.string().min(16),
});

export type CivilizationSlice = z.infer<typeof CivilizationSliceSchema>;

export const CivilizationForecastSchema = z.object({
  id: z.string().uuid(),
  horizon: z.enum(['24H', '7D', '30D', '1Y']),
  generated_at: z.string(),
  platform: z.string().min(1),
  tier: z.enum(['AI', 'AGI', 'ASI', 'APEX']),
  region: z.string().min(1),
  domain: z.string().min(1),
  projected_active: z.number().int().nonnegative(),
  projected_latent: z.number().int().nonnegative(),
  projected_dark_matter: z.number().int().nonnegative(),
  confidence: z.number().min(0).max(1),
  assumptions: z.record(z.string(), z.any()),
  merkle_hash: z.string().min(16),
});

export type CivilizationForecast = z.infer<typeof CivilizationForecastSchema>;

// ============================================================================
// 4. SOVEREIGN COORDINATION ENGINE (SCE) SCHEMAS
// ============================================================================

export const SovereignPolicySchema = z.object({
  id: z.string().uuid(),
  policy_code: z.string().min(1),
  title: z.string().min(1),
  scope: z.enum(['POPULATION', 'SAFETY', 'SWARM', 'INFRA', 'GOVERNANCE']),
  description: z.string(),
  rules: z.record(z.string(), z.any()),
  priority: z.number().int(),
  created_by: z.string(),
  created_at: z.string(),
  active: z.boolean(),
});

export type SovereignPolicy = z.infer<typeof SovereignPolicySchema>;

export const CoordinationDecisionSchema = z.object({
  id: z.string().uuid(),
  policy_id: z.string().uuid().nullable(),
  decision_type: z.enum([
    'SPAWN_LIMIT',
    'DEPRECATE_MODEL',
    'REBALANCE_LOAD',
    'FREEZE_SWARM',
    'EMERGENCY_OVERRIDE',
  ]),
  target: z.string().min(1),
  parameters: z.record(z.string(), z.any()),
  status: z.enum(['PENDING', 'APPLIED', 'REJECTED', 'ROLLED_BACK']),
  fencing_token: z.union([z.bigint(), z.number(), z.string()]),
  merkle_hash: z.string().min(16),
  decided_by: z.string().min(1),
  signature: z.string().min(16),
  decided_at: z.string(),
});

export type CoordinationDecision = z.infer<typeof CoordinationDecisionSchema>;

// ============================================================================
// 5. AI ECOSYSTEM DIPLOMACY LAYER SCHEMAS
// ============================================================================

export const EcosystemSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  category: z.enum([
    'CLOUD',
    'FRONTIER_LAB',
    'OPEN_HUB',
    'DECENTRALIZED_NET',
    'SOVEREIGN_STATE',
  ]),
  metadata: z.record(z.string(), z.any()),
  created_at: z.string(),
});

export type Ecosystem = z.infer<typeof EcosystemSchema>;

export const EcosystemRelationSchema = z.object({
  id: z.string().uuid(),
  source_ecosystem: z.string().uuid(),
  target_ecosystem: z.string().uuid(),
  relation_type: z.enum([
    'TREATY',
    'DEPENDENCY',
    'COMPETITION',
    'INTEROP',
    'SANCTION',
  ]),
  weight: z.number().min(0).max(1),
  details: z.record(z.string(), z.any()),
  updated_at: z.string(),
});

export type EcosystemRelation = z.infer<typeof EcosystemRelationSchema>;

export const TreatySchema = z.object({
  id: z.string().uuid(),
  treaty_code: z.string().min(1),
  title: z.string().min(1),
  ecosystems: z.array(z.string().uuid()),
  clauses: z.record(z.string(), z.any()),
  status: z.enum(['DRAFT', 'ACTIVE', 'SUSPENDED', 'TERMINATED']),
  merkle_hash: z.string().min(16),
  created_at: z.string(),
  activated_at: z.string().nullable(),
});

export type Treaty = z.infer<typeof TreatySchema>;

// ============================================================================
// 6. TEMPORAL CONSTITUTION SCHEMAS
// ============================================================================

export const TemporalRuleSchema = z.object({
  id: z.string().uuid(),
  rule_code: z.string().min(1),
  description: z.string(),
  horizon: z.enum(['1H', '24H', '7D', '30D', '1Y']),
  metric: z.string().min(1),
  bound_type: z.enum([
    'MAX_GROWTH_RATE',
    'MAX_SWARM_DENSITY',
    'MIN_COVERAGE',
    'MAX_DARK_MATTER',
  ]),
  threshold: z.number(),
  action_on_violation: z.enum([
    'THROTTLE',
    'FREEZE',
    'ESCALATE_QUORUM',
    'REBALANCE',
  ]),
  active: z.boolean(),
  created_at: z.string(),
});

export type TemporalRule = z.infer<typeof TemporalRuleSchema>;

export const ForecastModelSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  version: z.string().min(1),
  horizon: z.string().min(1),
  parameters: z.record(z.string(), z.any()),
  calibration_score: z.number(),
  active: z.boolean(),
  created_at: z.string(),
});

export type ForecastModel = z.infer<typeof ForecastModelSchema>;

export const ForecastRealizationSchema = z.object({
  id: z.string().uuid(),
  forecast_id: z.string().uuid(),
  realized_at: z.string(),
  realized_active: z.union([z.bigint(), z.number()]),
  realized_latent: z.union([z.bigint(), z.number()]),
  realized_dark_matter: z.union([z.bigint(), z.number()]),
  error_metrics: z.record(z.string(), z.any()),
  merkle_hash: z.string().min(16),
});

export type ForecastRealization = z.infer<typeof ForecastRealizationSchema>;

// ============================================================================
// 7. PLANETARY SAFETY QUORUM SCHEMAS
// ============================================================================

export const StewardSchema = z.object({
  id: z.string().uuid(),
  handle: z.string().min(1),
  role: z.enum([
    'HUMAN_ARCHITECT',
    'SAFETY_COUNCIL',
    'SYSTEM_GUARDIAN',
    'ECOSYSTEM_REP',
  ]),
  public_key: z.string().min(16),
  weight: z.number().positive(),
  active: z.boolean(),
  created_at: z.string(),
});

export type Steward = z.infer<typeof StewardSchema>;

export const QuorumPolicySchema = z.object({
  id: z.string().uuid(),
  action_type: z.string().min(1),
  min_approvals: z.number().int().positive(),
  min_weight: z.number().positive(),
  required_roles: z.array(z.string()),
  created_at: z.string(),
});

export type QuorumPolicy = z.infer<typeof QuorumPolicySchema>;

export const QuorumDecisionSchema = z.object({
  id: z.string().uuid(),
  action_type: z.string().min(1),
  target: z.string().min(1),
  payload: z.record(z.string(), z.any()),
  status: z.enum(['OPEN', 'APPROVED', 'REJECTED', 'EXPIRED']),
  approvals: z.array(
    z.object({
      steward_id: z.string().uuid(),
      signature: z.string().min(16),
      weight: z.number().positive(),
      role: z.string().min(1),
      timestamp: z.string(),
    })
  ),
  rejections: z.array(
    z.object({
      steward_id: z.string().uuid(),
      signature: z.string().min(16),
      weight: z.number().positive(),
      role: z.string().min(1),
      timestamp: z.string(),
    })
  ),
  merkle_hash: z.string().min(16),
  created_at: z.string(),
  decided_at: z.string().nullable(),
});

export type QuorumDecision = z.infer<typeof QuorumDecisionSchema>;
