-- ============================================================================
-- SOVEREIGN INFINITY PHASE 7 (×3 HYPER-SCALE): REAL WIRE TELEMETRY & SSOT LEDGER
-- Target Project: wvhjcxxfslzkechhoolz
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Live HTTP Wire Probes Table (Stores real responses from the 64 external APIs across 15 Swarms)
CREATE TABLE IF NOT EXISTS public.census_wire_probes (
  probe_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  swarm_id TEXT NOT NULL,
  meta_layer TEXT NOT NULL,
  source_name TEXT NOT NULL,
  endpoint_url TEXT NOT NULL,
  http_status INTEGER NOT NULL,
  latency_ms NUMERIC(10, 2) NOT NULL,
  payload_bytes INTEGER NOT NULL,
  extracted_count BIGINT NOT NULL,
  extracted_metric_label TEXT NOT NULL,
  raw_sample_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  sha256_payload_digest CHAR(64) NOT NULL,
  ed25519_signature TEXT NOT NULL,
  probed_at_iso TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_census_wire_probes_swarm ON public.census_wire_probes (swarm_id, probed_at_iso DESC);
CREATE INDEX IF NOT EXISTS idx_census_wire_probes_layer ON public.census_wire_probes (meta_layer);

-- 2. SSOT Reconciliation & Bayesian Mark-Recapture Ledger (Enforces Δ = 0 constraint)
CREATE TABLE IF NOT EXISTS public.census_ssot_reconciliations (
  reconciliation_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  timestamp_iso TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  total_live_wire_probes_executed INTEGER NOT NULL,
  total_raw_entities_enumerated BIGINT NOT NULL,
  chapman_mark_recapture JSONB NOT NULL,
  littles_law_ephemeral_flow JSONB NOT NULL,
  kalman_fused_ssot_population BIGINT NOT NULL,
  hare_niemeyer_domain_sum BIGINT NOT NULL,
  ssot_discrepancy_delta INTEGER NOT NULL CHECK (ssot_discrepancy_delta = 0),
  merkle_root_sha256 CHAR(64) NOT NULL,
  ed25519_public_key_pem TEXT NOT NULL,
  ed25519_batch_signature TEXT NOT NULL
);

-- Enable Row-Level Security (RLS)
ALTER TABLE public.census_wire_probes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.census_ssot_reconciliations ENABLE ROW LEVEL SECURITY;

-- Public Read Policies for Observatory Transparency
CREATE POLICY "Allow public read on census_wire_probes"
  ON public.census_wire_probes FOR SELECT USING (true);

CREATE POLICY "Allow public read on census_ssot_reconciliations"
  ON public.census_ssot_reconciliations FOR SELECT USING (true);

-- Service Role / Authenticated Write Policies
CREATE POLICY "Allow service insert on census_wire_probes"
  ON public.census_wire_probes FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow service insert on census_ssot_reconciliations"
  ON public.census_ssot_reconciliations FOR INSERT WITH CHECK (true);
