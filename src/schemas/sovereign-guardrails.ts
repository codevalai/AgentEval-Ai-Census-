import { z } from 'zod';

/**
 * 1. STRICT AGENT LIFECYCLE STATES (NO HIDDEN OR AD-HOC STATES)
 */
export const StrictAgentLifecycleEnum = z.enum([
  'INITIALIZING',
  'ACTIVE',
  'SUSPENDED',
  'TERMINATED'
]);

export type StrictAgentLifecycle = z.infer<typeof StrictAgentLifecycleEnum>;

/**
 * 2. GOVERNANCE ROLES (WHO CAN TOUCH WHAT)
 */
export const GovernanceRoleEnum = z.enum([
  'ARCHITECT',   // Can modify meta-layers, SSOT engine, swarm registry, identity schemas (requires 2+ approvals + signed commit + CI)
  'MAINTAINER',  // Can modify application code, infra, non-core logic
  'CONTRIBUTOR'  // Can modify docs, peripheral modules, non-critical UI features
]);

export type GovernanceRole = z.infer<typeof GovernanceRoleEnum>;

/**
 * 3. THE 6 AGENT CAPABILITY PROFILES (ROLE CARDS)
 */
export const AgentCapabilityProfileIdEnum = z.enum([
  'CENSUS_READER',
  'TELEMETRY_WRITER',
  'ORCHESTRATOR_NODE',
  'SWARM_HARVESTER',
  'ARCHITECT',
  'DARK_MATTER_INSPECTOR'
]);

export type AgentCapabilityProfileId = z.infer<typeof AgentCapabilityProfileIdEnum>;

export const AgentCapabilitySchema = z.object({
  profile_id: AgentCapabilityProfileIdEnum,
  title: z.string(),
  governance_tier: GovernanceRoleEnum,
  max_memory_enclave_kb: z.number().int().min(1).max(64), // Strict ≤64 KB invariant
  require_pqc_signature: z.boolean(),
  allowed_surfaces: z.array(z.string()),
  forbidden_surfaces: z.array(z.string()),
  allowed_http_methods: z.array(z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE'])),
  can_mutate_ssot: z.boolean(),
  can_mutate_meta_layers: z.boolean(),
  can_create_pr_or_fork: z.boolean(),
  rls_postgres_policy: z.string()
});

export type AgentCapability = z.infer<typeof AgentCapabilitySchema>;

/**
 * 4. THE 6 SWARM DRIFT DETECTION RULES & POLICIES
 */
export const DriftRuleIdEnum = z.enum([
  'RULE_01_CALL_RATE_ANOMALY',
  'RULE_02_TARGET_SURFACE_DEVIATION',
  'RULE_03_PAYLOAD_SHAPE_DRIFT',
  'RULE_04_CAPABILITY_ESCALATION_ATTEMPT',
  'RULE_05_SSOT_IMPACT_DRIFT',
  'RULE_06_IDENTITY_PQC_MISMATCH'
]);

export type DriftRuleId = z.infer<typeof DriftRuleIdEnum>;

export const SwarmPolicySchema = z.object({
  rule_id: DriftRuleIdEnum,
  rule_number: z.number().int().min(1).max(6),
  name: z.string(),
  baseline_specification: z.string(),
  trigger_condition: z.string(),
  automated_response: z.string(),
  target_lifecycle_transition: StrictAgentLifecycleEnum,
  xerj_reflex_gate: z.enum(['DENY_AND_SUSPEND', 'BLOCK_AND_ALERT', 'REJECT_AND_LOG', 'QUARANTINE_AND_RECOMPUTE', 'DENY_UNVERIFIED']),
  severity: z.enum(['CRITICAL', 'HIGH', 'ELEVATED'])
});

export type SwarmPolicy = z.infer<typeof SwarmPolicySchema>;

/**
 * 5. ANOMALY EVENT RECORD SCHEMA (MERKLE WAL + SUPABASE `public.anomaly_events`)
 */
export const AnomalyEventSchema = z.object({
  anomaly_id: z.string().uuid(),
  rule_id: DriftRuleIdEnum,
  actor_id: z.string(),
  profile_id: AgentCapabilityProfileIdEnum,
  target_surface: z.string(),
  observed_metric: z.string(),
  enclave_memory_kb: z.number().nonnegative(),
  pqc_signature_valid: z.boolean(),
  ssot_delta_observed: z.number().int(),
  xerj_decision: z.enum(['ALLOW', 'DENY']),
  new_lifecycle_state: StrictAgentLifecycleEnum,
  merkle_wal_hash: z.string().length(64),
  ed25519_attestation: z.string(),
  detected_at_iso: z.string().datetime()
});

export type AnomalyEvent = z.infer<typeof AnomalyEventSchema>;

/**
 * 6. CRITICAL FILE GUARDIAN & PR GATEKEEPER EVALUATION SCHEMA
 */
export const PrGuardianRequestSchema = z.object({
  pr_title: z.string(),
  author_role: GovernanceRoleEnum,
  touched_files: z.array(z.string()),
  labels: z.array(z.string()),
  human_approvals_count: z.number().int().nonnegative(),
  commit_signed_gpg_or_sigstore: z.boolean(),
  tests_included: z.boolean(),
  risk_level_declared: z.enum(['NONE', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  new_dependencies_added: z.array(z.string()).default([]),
  dependency_justification_provided: z.boolean().default(false)
});

export type PrGuardianRequest = z.infer<typeof PrGuardianRequestSchema>;
