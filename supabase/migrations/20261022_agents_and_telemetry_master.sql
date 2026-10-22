-- ============================================================================
-- SOVEREIGN INFINITY: MASTER CENSUS AGENTS & TELEMETRY LEDGER (RLS + LEASE RPC)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.census_agents (
  agent_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  spiffe_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  factory_id TEXT NOT NULL,
  tier TEXT NOT NULL,
  meta_layer TEXT NOT NULL,
  sovereignty_zone TEXT NOT NULL,
  lifecycle_state TEXT NOT NULL CHECK (lifecycle_state IN ('REGISTERED', 'PROBING', 'ACTIVE', 'DEGRADED', 'QUARANTINED', 'TOMBSTONED')),
  fencing_token BIGINT NOT NULL DEFAULT 1,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  ed25519_pubkey TEXT NOT NULL,
  registered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.census_telemetry (
  event_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id UUID NOT NULL REFERENCES public.census_agents(agent_id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  tier_routed TEXT NOT NULL,
  confidence NUMERIC(5, 4) NOT NULL,
  latency_ms NUMERIC(10, 2) NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  prev_merkle_hash CHAR(64) NOT NULL,
  merkle_hash CHAR(64) NOT NULL,
  ed25519_signature TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Atomic Monotonic Fencing Token Lease RPC (Prevents Split-Brain Zombie Agents)
CREATE OR REPLACE FUNCTION public.acquire_monotonic_agent_lease(
  p_agent_id UUID,
  p_requested_state TEXT
) RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_new_token BIGINT;
BEGIN
  UPDATE public.census_agents
  SET fencing_token = fencing_token + 1,
      lifecycle_state = p_requested_state,
      updated_at = NOW()
  WHERE agent_id = p_agent_id
  RETURNING fencing_token INTO v_new_token;

  RETURN v_new_token;
END;
$$;

ALTER TABLE public.census_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.census_telemetry ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read census_agents" ON public.census_agents FOR SELECT USING (true);
CREATE POLICY "Service write census_agents" ON public.census_agents FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read census_telemetry" ON public.census_telemetry FOR SELECT USING (true);
CREATE POLICY "Service write census_telemetry" ON public.census_telemetry FOR INSERT WITH CHECK (true);
