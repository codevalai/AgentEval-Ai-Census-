-- ============================================================================
-- SOVEREIGN COORDINATION ENGINE, CONSTITUTIONAL PARLIAMENT, DIPLOMACY LAYER,
-- TEMPORAL CONSTITUTION, PLANETARY SAFETY QUORUM, XERJ ARBITRATION MESH &
-- CROSS-ECOSYSTEM MERKLE AUDIT LEDGER
-- Migration: 20261023_sovereign_coordination_parliament.sql
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. XERJ ARBITRATION MESH (TOOLS, MEMORY, SWARMS, SAFETY)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.xerj_policies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_name text NOT NULL UNIQUE,
  scope text NOT NULL CHECK (scope IN ('TOOL', 'MEMORY', 'SWARM', 'SAFETY')),
  actor_capability_profile text NOT NULL,
  resource_pattern text NOT NULL,
  max_rate_per_minute integer NOT NULL DEFAULT 60 CHECK (max_rate_per_minute > 0),
  allowed_actions text[] NOT NULL DEFAULT '{}',
  forbidden_actions text[] NOT NULL DEFAULT '{}',
  severity text NOT NULL CHECK (severity IN ('INFO', 'WARN', 'ERROR', 'CRITICAL')),
  created_by text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.xerj_arbitration_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id text NOT NULL,
  actor_capability_profile text NOT NULL,
  action_type text NOT NULL CHECK (action_type IN ('TOOL_CALL', 'MEMORY_READ', 'MEMORY_WRITE', 'SWARM_ASSIGN', 'SAFETY_BLOCK')),
  surface text NOT NULL CHECK (surface IN ('CLOUD', 'DEVICE_NPU', 'WEBGPU', 'MESH', 'SOVEREIGN_CLOUD')),
  target_resource text NOT NULL,
  decision text NOT NULL CHECK (decision IN ('ALLOW', 'DENY', 'ESCALATE', 'SUSPEND')),
  decision_tier text NOT NULL CHECK (decision_tier IN ('XERJ_LOCAL_SYSTEM1', 'LLM_SYSTEM2_FALLBACK')),
  reason jsonb NOT NULL DEFAULT '{}'::jsonb,
  fencing_token bigint NOT NULL,
  merkle_hash text NOT NULL CHECK (length(trim(merkle_hash)) >= 16),
  signature text NOT NULL CHECK (length(trim(signature)) >= 16),
  recorded_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_xerj_arbitration_actor ON public.xerj_arbitration_events (actor_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_xerj_arbitration_decision ON public.xerj_arbitration_events (decision, recorded_at DESC);

-- ============================================================================
-- 2. CROSS-ECOSYSTEM AUDIT LEDGER & MERKLE SPINE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.audit_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ecosystem text NOT NULL,
  actor_id text NOT NULL,
  actor_type text NOT NULL CHECK (actor_type IN ('AGENT', 'SWARM', 'HUMAN', 'SYSTEM')),
  event_type text NOT NULL,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  prev_hash text NOT NULL,
  merkle_hash text NOT NULL CHECK (length(trim(merkle_hash)) >= 16),
  signature text NOT NULL CHECK (length(trim(signature)) >= 16),
  public_key text NOT NULL,
  recorded_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_events_ecosystem ON public.audit_events (ecosystem, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_events_merkle ON public.audit_events (merkle_hash);

CREATE TABLE IF NOT EXISTS public.audit_roots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  epoch bigint NOT NULL UNIQUE,
  root_hash text NOT NULL CHECK (length(trim(root_hash)) >= 16),
  event_count bigint NOT NULL CHECK (event_count >= 0),
  computed_at timestamptz NOT NULL DEFAULT now(),
  signed_by text NOT NULL,
  signature text NOT NULL CHECK (length(trim(signature)) >= 16)
);

-- ============================================================================
-- 3. AI CIVILIZATION ATLAS & PREDICTIVE CENSUS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.civilization_slices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp timestamptz NOT NULL DEFAULT now(),
  platform text NOT NULL,
  tier text NOT NULL CHECK (tier IN ('AI', 'AGI', 'ASI', 'APEX')),
  region text NOT NULL,
  domain text NOT NULL,
  active_agents bigint NOT NULL CHECK (active_agents >= 0),
  latent_agents bigint NOT NULL CHECK (latent_agents >= 0),
  dark_matter_estimate bigint NOT NULL CHECK (dark_matter_estimate >= 0),
  ssot_total bigint NOT NULL CHECK (ssot_total > 0),
  merkle_root text NOT NULL CHECK (length(trim(merkle_root)) >= 16)
);

CREATE INDEX IF NOT EXISTS idx_civilization_slices_lookup ON public.civilization_slices (platform, tier, region, domain);

CREATE TABLE IF NOT EXISTS public.civilization_forecasts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  horizon text NOT NULL CHECK (horizon IN ('24H', '7D', '30D', '1Y')),
  generated_at timestamptz NOT NULL DEFAULT now(),
  platform text NOT NULL,
  tier text NOT NULL CHECK (tier IN ('AI', 'AGI', 'ASI', 'APEX')),
  region text NOT NULL,
  domain text NOT NULL,
  projected_active bigint NOT NULL CHECK (projected_active >= 0),
  projected_latent bigint NOT NULL CHECK (projected_latent >= 0),
  projected_dark_matter bigint NOT NULL CHECK (projected_dark_matter >= 0),
  confidence numeric NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
  assumptions jsonb NOT NULL DEFAULT '{}'::jsonb,
  merkle_hash text NOT NULL CHECK (length(trim(merkle_hash)) >= 16)
);

-- ============================================================================
-- 4. SOVEREIGN COORDINATION ENGINE (SCE — CONSTITUTIONAL PARLIAMENT)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.sovereign_policies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_code text UNIQUE NOT NULL,
  title text NOT NULL,
  scope text NOT NULL CHECK (scope IN ('POPULATION', 'SAFETY', 'SWARM', 'INFRA', 'GOVERNANCE')),
  description text NOT NULL,
  rules jsonb NOT NULL,
  priority integer NOT NULL DEFAULT 100,
  created_by text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  active boolean NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS public.coordination_decisions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_id uuid REFERENCES public.sovereign_policies(id),
  decision_type text NOT NULL CHECK (
    decision_type IN ('SPAWN_LIMIT', 'DEPRECATE_MODEL', 'REBALANCE_LOAD', 'FREEZE_SWARM', 'EMERGENCY_OVERRIDE')
  ),
  target text NOT NULL,
  parameters jsonb NOT NULL,
  status text NOT NULL CHECK (status IN ('PENDING', 'APPLIED', 'REJECTED', 'ROLLED_BACK')),
  fencing_token bigint NOT NULL,
  merkle_hash text NOT NULL CHECK (length(trim(merkle_hash)) >= 16),
  decided_by text NOT NULL,
  signature text NOT NULL CHECK (length(trim(signature)) >= 16),
  decided_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- 5. AI ECOSYSTEM DIPLOMACY LAYER (INTER-ECOSYSTEM TREATIES)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.ecosystems (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  category text NOT NULL CHECK (
    category IN ('CLOUD', 'FRONTIER_LAB', 'OPEN_HUB', 'DECENTRALIZED_NET', 'SOVEREIGN_STATE')
  ),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.ecosystem_relations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_ecosystem uuid NOT NULL REFERENCES public.ecosystems(id),
  target_ecosystem uuid NOT NULL REFERENCES public.ecosystems(id),
  relation_type text NOT NULL CHECK (
    relation_type IN ('TREATY', 'DEPENDENCY', 'COMPETITION', 'INTEROP', 'SANCTION')
  ),
  weight numeric NOT NULL CHECK (weight >= 0 AND weight <= 1),
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.treaties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  treaty_code text UNIQUE NOT NULL,
  title text NOT NULL,
  ecosystems uuid[] NOT NULL,
  clauses jsonb NOT NULL,
  status text NOT NULL CHECK (status IN ('DRAFT', 'ACTIVE', 'SUSPENDED', 'TERMINATED')),
  merkle_hash text NOT NULL CHECK (length(trim(merkle_hash)) >= 16),
  created_at timestamptz NOT NULL DEFAULT now(),
  activated_at timestamptz
);

-- ============================================================================
-- 6. TEMPORAL CONSTITUTION (TIME-BOUND INVARIANTS & FORECAST GOVERNANCE)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.temporal_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_code text UNIQUE NOT NULL,
  description text NOT NULL,
  horizon text NOT NULL CHECK (horizon IN ('1H', '24H', '7D', '30D', '1Y')),
  metric text NOT NULL,
  bound_type text NOT NULL CHECK (bound_type IN ('MAX_GROWTH_RATE', 'MAX_SWARM_DENSITY', 'MIN_COVERAGE', 'MAX_DARK_MATTER')),
  threshold numeric NOT NULL,
  action_on_violation text NOT NULL CHECK (action_on_violation IN ('THROTTLE', 'FREEZE', 'ESCALATE_QUORUM', 'REBALANCE')),
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.forecast_models (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  version text NOT NULL,
  horizon text NOT NULL,
  parameters jsonb NOT NULL,
  calibration_score numeric NOT NULL,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.forecast_realizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  forecast_id uuid NOT NULL,
  realized_at timestamptz NOT NULL DEFAULT now(),
  realized_active bigint NOT NULL,
  realized_latent bigint NOT NULL,
  realized_dark_matter bigint NOT NULL,
  error_metrics jsonb NOT NULL,
  merkle_hash text NOT NULL CHECK (length(trim(merkle_hash)) >= 16)
);

-- ============================================================================
-- 7. PLANETARY SAFETY QUORUM (CRYPTOGRAPHIC MULTI-PARTY GOVERNANCE)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.stewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  handle text UNIQUE NOT NULL,
  role text NOT NULL CHECK (role IN ('HUMAN_ARCHITECT', 'SAFETY_COUNCIL', 'SYSTEM_GUARDIAN', 'ECOSYSTEM_REP')),
  public_key text NOT NULL CHECK (length(trim(public_key)) >= 16),
  weight numeric NOT NULL DEFAULT 1.0 CHECK (weight > 0),
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.quorum_policies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  action_type text UNIQUE NOT NULL,
  min_approvals integer NOT NULL CHECK (min_approvals >= 1),
  min_weight numeric NOT NULL CHECK (min_weight > 0),
  required_roles text[] NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.quorum_decisions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  action_type text NOT NULL,
  target text NOT NULL,
  payload jsonb NOT NULL,
  status text NOT NULL CHECK (status IN ('OPEN', 'APPROVED', 'REJECTED', 'EXPIRED')),
  approvals jsonb NOT NULL DEFAULT '[]'::jsonb,
  rejections jsonb NOT NULL DEFAULT '[]'::jsonb,
  merkle_hash text NOT NULL CHECK (length(trim(merkle_hash)) >= 16),
  created_at timestamptz NOT NULL DEFAULT now(),
  decided_at timestamptz
);

-- ============================================================================
-- 8. APPEND-ONLY & CRYPTOGRAPHIC MUTATION GUARDRAILS (TRIGGERS & RLS)
-- ============================================================================

CREATE OR REPLACE FUNCTION public.block_append_only_mutation()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'Append-only table % cannot be updated or deleted under Sovereign Constitutional Law', TG_TABLE_NAME;
END;
$$;

DROP TRIGGER IF EXISTS coordination_decisions_append_only ON public.coordination_decisions;
CREATE TRIGGER coordination_decisions_append_only
  BEFORE UPDATE OR DELETE ON public.coordination_decisions
  FOR EACH ROW EXECUTE FUNCTION public.block_append_only_mutation();

DROP TRIGGER IF EXISTS xerj_arbitration_events_append_only ON public.xerj_arbitration_events;
CREATE TRIGGER xerj_arbitration_events_append_only
  BEFORE UPDATE OR DELETE ON public.xerj_arbitration_events
  FOR EACH ROW EXECUTE FUNCTION public.block_append_only_mutation();

DROP TRIGGER IF EXISTS audit_events_append_only ON public.audit_events;
CREATE TRIGGER audit_events_append_only
  BEFORE UPDATE OR DELETE ON public.audit_events
  FOR EACH ROW EXECUTE FUNCTION public.block_append_only_mutation();

DROP TRIGGER IF EXISTS audit_roots_append_only ON public.audit_roots;
CREATE TRIGGER audit_roots_append_only
  BEFORE UPDATE OR DELETE ON public.audit_roots
  FOR EACH ROW EXECUTE FUNCTION public.block_append_only_mutation();

-- Note: quorum_decisions transitions from OPEN -> APPROVED/REJECTED once decided, then becomes immutable
CREATE OR REPLACE FUNCTION public.guard_finalized_quorum_decisions()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    RAISE EXCEPTION 'Append-only table quorum_decisions cannot be deleted';
  END IF;
  IF OLD.status IN ('APPROVED', 'REJECTED', 'EXPIRED') THEN
    RAISE EXCEPTION 'Finalized quorum decision (%) is immutable and cannot be updated', OLD.id;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS quorum_decisions_finalized_guard ON public.quorum_decisions;
CREATE TRIGGER quorum_decisions_finalized_guard
  BEFORE UPDATE OR DELETE ON public.quorum_decisions
  FOR EACH ROW EXECUTE FUNCTION public.guard_finalized_quorum_decisions();

-- Enable RLS across all new Constitutional Parliament tables
ALTER TABLE public.xerj_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.xerj_arbitration_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_roots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.civilization_slices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.civilization_forecasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sovereign_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coordination_decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ecosystems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ecosystem_relations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.treaties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.temporal_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forecast_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forecast_realizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quorum_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quorum_decisions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read xerj_policies" ON public.xerj_policies FOR SELECT USING (true);
CREATE POLICY "Public read xerj_arbitration_events" ON public.xerj_arbitration_events FOR SELECT USING (true);
CREATE POLICY "Public read audit_events" ON public.audit_events FOR SELECT USING (true);
CREATE POLICY "Public read audit_roots" ON public.audit_roots FOR SELECT USING (true);
CREATE POLICY "Public read civilization_slices" ON public.civilization_slices FOR SELECT USING (true);
CREATE POLICY "Public read civilization_forecasts" ON public.civilization_forecasts FOR SELECT USING (true);
CREATE POLICY "Public read sovereign_policies" ON public.sovereign_policies FOR SELECT USING (true);
CREATE POLICY "Public read coordination_decisions" ON public.coordination_decisions FOR SELECT USING (true);
CREATE POLICY "Public read ecosystems" ON public.ecosystems FOR SELECT USING (true);
CREATE POLICY "Public read ecosystem_relations" ON public.ecosystem_relations FOR SELECT USING (true);
CREATE POLICY "Public read treaties" ON public.treaties FOR SELECT USING (true);
CREATE POLICY "Public read temporal_rules" ON public.temporal_rules FOR SELECT USING (true);
CREATE POLICY "Public read forecast_models" ON public.forecast_models FOR SELECT USING (true);
CREATE POLICY "Public read forecast_realizations" ON public.forecast_realizations FOR SELECT USING (true);
CREATE POLICY "Public read stewards" ON public.stewards FOR SELECT USING (true);
CREATE POLICY "Public read quorum_policies" ON public.quorum_policies FOR SELECT USING (true);
CREATE POLICY "Public read quorum_decisions" ON public.quorum_decisions FOR SELECT USING (true);
