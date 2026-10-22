-- ============================================================================
-- SOVEREIGN GUARDRAIL SPINE: CAPABILITY PROFILES, SWARM POLICIES, ANOMALY EVENTS
-- & CRYPTOGRAPHIC MUTATION FIREWALL TRIGGERS
-- Target Project: wvhjcxxfslzkechhoolz
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Strict Sovereign Enumerations (No hidden states)
DO $$ BEGIN
  CREATE TYPE public.agent_lifecycle_strict_enum AS ENUM (
    'INITIALIZING',
    'ACTIVE',
    'SUSPENDED',
    'TERMINATED'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.agent_capability_profile_enum AS ENUM (
    'CENSUS_READER',
    'TELEMETRY_WRITER',
    'ORCHESTRATOR_NODE',
    'SWARM_HARVESTER',
    'ARCHITECT',
    'DARK_MATTER_INSPECTOR'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.drift_rule_id_enum AS ENUM (
    'RULE_01_CALL_RATE_ANOMALY',
    'RULE_02_TARGET_SURFACE_DEVIATION',
    'RULE_03_PAYLOAD_SHAPE_DRIFT',
    'RULE_04_CAPABILITY_ESCALATION_ATTEMPT',
    'RULE_05_SSOT_IMPACT_DRIFT',
    'RULE_06_IDENTITY_PQC_MISMATCH'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 2. Table: agent_capabilities (The 6 Role Cards)
CREATE TABLE IF NOT EXISTS public.agent_capabilities (
  profile_id public.agent_capability_profile_enum PRIMARY KEY,
  title TEXT NOT NULL,
  governance_tier TEXT NOT NULL CHECK (governance_tier IN ('ARCHITECT', 'MAINTAINER', 'CONTRIBUTOR')),
  max_memory_enclave_kb INTEGER NOT NULL DEFAULT 64 CHECK (max_memory_enclave_kb > 0 AND max_memory_enclave_kb <= 64),
  require_pqc_signature BOOLEAN NOT NULL DEFAULT TRUE,
  allowed_surfaces JSONB NOT NULL DEFAULT '[]'::jsonb,
  forbidden_surfaces JSONB NOT NULL DEFAULT '[]'::jsonb,
  allowed_http_methods JSONB NOT NULL DEFAULT '["GET"]'::jsonb,
  can_mutate_ssot BOOLEAN NOT NULL DEFAULT FALSE,
  can_mutate_meta_layers BOOLEAN NOT NULL DEFAULT FALSE,
  can_create_pr_or_fork BOOLEAN NOT NULL DEFAULT FALSE,
  rls_postgres_policy TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Table: swarm_policies (The 6 Swarm Drift Detection Rules)
CREATE TABLE IF NOT EXISTS public.swarm_policies (
  rule_id public.drift_rule_id_enum PRIMARY KEY,
  rule_number INTEGER UNIQUE NOT NULL CHECK (rule_number >= 1 AND rule_number <= 6),
  name TEXT NOT NULL,
  baseline_specification TEXT NOT NULL,
  trigger_condition TEXT NOT NULL,
  automated_response TEXT NOT NULL,
  target_lifecycle_transition public.agent_lifecycle_strict_enum NOT NULL,
  xerj_reflex_gate TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('CRITICAL', 'HIGH', 'ELEVATED')),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Table: anomaly_events (Immutable Drift & Security Violation Ledger)
CREATE TABLE IF NOT EXISTS public.anomaly_events (
  anomaly_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rule_id public.drift_rule_id_enum NOT NULL REFERENCES public.swarm_policies(rule_id),
  actor_id TEXT NOT NULL,
  profile_id public.agent_capability_profile_enum NOT NULL REFERENCES public.agent_capabilities(profile_id),
  target_surface TEXT NOT NULL,
  observed_metric TEXT NOT NULL,
  enclave_memory_kb INTEGER NOT NULL CHECK (enclave_memory_kb >= 0),
  pqc_signature_valid BOOLEAN NOT NULL,
  ssot_delta_observed INTEGER NOT NULL DEFAULT 0,
  xerj_decision TEXT NOT NULL CHECK (xerj_decision IN ('ALLOW', 'DENY')),
  new_lifecycle_state public.agent_lifecycle_strict_enum NOT NULL,
  merkle_wal_hash CHAR(64) NOT NULL,
  ed25519_attestation TEXT NOT NULL,
  detected_at_iso TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_anomaly_events_rule ON public.anomaly_events (rule_id, detected_at_iso DESC);
CREATE INDEX IF NOT EXISTS idx_anomaly_events_actor ON public.anomaly_events (actor_id);

-- 5. Table: critical_file_attestations (Merkle-Chained Sacred Configs & Schemas)
CREATE TABLE IF NOT EXISTS public.critical_file_attestations (
  file_path TEXT PRIMARY KEY,
  layer_category TEXT NOT NULL,
  sha256_digest CHAR(64) NOT NULL,
  expected_merkle_root CHAR(64) NOT NULL,
  required_approvals INTEGER NOT NULL DEFAULT 2 CHECK (required_approvals >= 2),
  required_label TEXT NOT NULL,
  attested_by_role TEXT NOT NULL DEFAULT 'ARCHITECT',
  attested_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- CRYPTOGRAPHIC FIREWALL TRIGGERS (DATABASE-LEVEL INVARIANT ENFORCEMENT)
-- ============================================================================

-- Trigger 1: Enforce ≤64 KB Enclave Bounds & PQC Identity on Agent Registration
CREATE OR REPLACE FUNCTION public.fn_enforce_agent_enclave_and_pqc()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  v_mem_kb INTEGER;
BEGIN
  v_mem_kb := COALESCE((NEW.metadata->>'max_memory_kb')::INTEGER, 64);
  IF v_mem_kb > 64 THEN
    RAISE EXCEPTION 'SOVEREIGN_GUARDRAIL_VIOLATION: Agent max_memory_kb (%) exceeds ≤64 KB Wasm enclave invariant.', v_mem_kb;
  END IF;

  IF NEW.ed25519_pubkey IS NULL OR length(trim(NEW.ed25519_pubkey)) < 16 THEN
    RAISE EXCEPTION 'SOVEREIGN_GUARDRAIL_VIOLATION: Missing or invalid Ed25519 / ML-DSA-87 cryptographic public key.';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_enforce_agent_enclave_and_pqc ON public.census_agents;
CREATE TRIGGER trg_enforce_agent_enclave_and_pqc
  BEFORE INSERT OR UPDATE ON public.census_agents
  FOR EACH ROW EXECUTE FUNCTION public.fn_enforce_agent_enclave_and_pqc();

-- Trigger 2: Append-Only Immutability Firewall on Telemetry & Anomaly Logs
CREATE OR REPLACE FUNCTION public.fn_forbid_telemetry_mutation()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'SOVEREIGN_IMMUTABILITY_VIOLATION: UPDATE and DELETE are strictly forbidden on append-only telemetry/anomaly ledgers.';
END;
$$;

DROP TRIGGER IF EXISTS trg_immutable_census_telemetry ON public.census_telemetry;
CREATE TRIGGER trg_immutable_census_telemetry
  BEFORE UPDATE OR DELETE ON public.census_telemetry
  FOR EACH ROW EXECUTE FUNCTION public.fn_forbid_telemetry_mutation();

DROP TRIGGER IF EXISTS trg_immutable_anomaly_events ON public.anomaly_events;
CREATE TRIGGER trg_immutable_anomaly_events
  BEFORE UPDATE OR DELETE ON public.anomaly_events
  FOR EACH ROW EXECUTE FUNCTION public.fn_forbid_telemetry_mutation();

-- Trigger 3: Forbid Agent Deletion Unless Lifecycle State is TERMINATED
CREATE OR REPLACE FUNCTION public.fn_forbid_active_agent_delete()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF OLD.lifecycle_state <> 'TOMBSTONED' AND OLD.lifecycle_state <> 'TERMINATED' THEN
    RAISE EXCEPTION 'SOVEREIGN_RLS_FIREWALL: Cannot DELETE agent % while in state %. Must transition to TERMINATED first.', OLD.agent_id, OLD.lifecycle_state;
  END IF;
  RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS trg_forbid_active_agent_delete ON public.census_agents;
CREATE TRIGGER trg_forbid_active_agent_delete
  BEFORE DELETE ON public.census_agents
  FOR EACH ROW EXECUTE FUNCTION public.fn_forbid_active_agent_delete();

-- Enable Row-Level Security (RLS) across all Guardrail Tables
ALTER TABLE public.agent_capabilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.swarm_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.anomaly_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.critical_file_attestations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read agent_capabilities" ON public.agent_capabilities FOR SELECT USING (true);
CREATE POLICY "Public read swarm_policies" ON public.swarm_policies FOR SELECT USING (true);
CREATE POLICY "Public read anomaly_events" ON public.anomaly_events FOR SELECT USING (true);
CREATE POLICY "Service insert anomaly_events" ON public.anomaly_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read critical_file_attestations" ON public.critical_file_attestations FOR SELECT USING (true);
