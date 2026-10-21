-- ============================================================================
-- SOVEREIGN INFINITY AI CENSUS: XERJ DUAL-ENGINE SOVEREIGN LEDGER & LEASE LOCKS
-- Target Project Ref: wvhjcxxfslzkechhoolz (https://wvhjcxxfslzkechhoolz.supabase.co)
-- ============================================================================

-- 1. Dual-Engine Ledger: Syncs Supabase relational state with XERJ /_bulk, /_memory, and /_graph
create table if not exists public.census_xerj_telemetry_ledger (
  record_id uuid primary key default gen_random_uuid(),
  agent_id text not null,
  corpus_slug text not null default 'sovereign-infinity-ai-census',
  stage text not null check (stage in (
    'SPAWN', 'PROBE', 'SYSTEM1_DECIDE', 'SYSTEM2_ESCALATE', 'GRAPH_LINK', 'COMMIT', 'TERMINATE', 'FAULT'
  )),
  decision_tier text not null check (decision_tier in (
    'XERJ_LOCAL_SYSTEM1', 'XERJ_HYBRID_RAG', 'LLM_SYSTEM2_FALLBACK'
  )),
  confidence_score double precision not null check (confidence_score >= 0 and confidence_score <= 1),
  latency_ms double precision not null,
  tokens_burned integer not null default 0,
  tokens_saved_estimate integer not null default 0,
  payload_summary text not null,
  prev_merkle_hash text not null,
  merkle_hash text not null unique,
  ed25519_signature text not null,
  public_key_der_hex text not null,
  xerj_indexed boolean not null default true,
  created_at timestamptz not null default now()
);

-- Performance Indexes
create index if not exists idx_census_xerj_agent_stage
  on public.census_xerj_telemetry_ledger (agent_id, stage, created_at desc);

create index if not exists idx_census_xerj_merkle
  on public.census_xerj_telemetry_ledger (merkle_hash);

-- Enable Row-Level Security
alter table public.census_xerj_telemetry_ledger enable row level security;

-- Permissive service role access
drop policy if exists "Allow service role full access to census_xerj_telemetry_ledger" on public.census_xerj_telemetry_ledger;
create policy "Allow service role full access to census_xerj_telemetry_ledger" on public.census_xerj_telemetry_ledger
  as permissive for all to service_role using (true) with check (true);

-- 2. Rollup View for comparing XERJ System-1 vs System-2 Token Economics
create or replace view public.v_census_xerj_efficiency_metrics as
select
  agent_id,
  decision_tier,
  count(*) as total_decisions,
  round(avg(latency_ms)::numeric, 2) as avg_latency_ms,
  sum(tokens_burned) as total_tokens_burned,
  sum(tokens_saved_estimate) as total_tokens_saved,
  round(
    (sum(tokens_saved_estimate)::numeric / nullif(sum(tokens_burned + tokens_saved_estimate), 0)) * 100,
    2
  ) as token_reduction_pct
from public.census_xerj_telemetry_ledger
group by agent_id, decision_tier;

-- 3. Atomic Distributed Fencing-Token Lease Lock Table & Helper Function
create table if not exists public.census_agent_leases (
  agent_id text primary key,
  worker_node_id text not null,
  fencing_token bigint not null default 1000,
  lease_expires_at timestamptz not null default now() + interval '15 seconds',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.census_agent_leases enable row level security;
drop policy if exists "Allow service role full access to census_agent_leases" on public.census_agent_leases;
create policy "Allow service role full access to census_agent_leases" on public.census_agent_leases
  as permissive for all to service_role using (true) with check (true);

create or replace function public.acquire_census_agent_lease(
  p_agent_id text,
  p_worker_id text,
  p_ttl_seconds int default 15
)
returns table (
  agent_id text,
  worker_node_id text,
  fencing_token bigint,
  lease_expires_at timestamptz,
  acquired boolean
) as $$
declare
  v_now timestamptz := now();
  v_next_token bigint;
begin
  insert into public.census_agent_leases (agent_id, worker_node_id, fencing_token, lease_expires_at, updated_at)
  values (p_agent_id, p_worker_id, 1001, v_now + (p_ttl_seconds || ' seconds')::interval, v_now)
  on conflict (agent_id) do update
  set worker_node_id = p_worker_id,
      fencing_token = public.census_agent_leases.fencing_token + 1,
      lease_expires_at = v_now + (p_ttl_seconds || ' seconds')::interval,
      updated_at = v_now
  where public.census_agent_leases.lease_expires_at < v_now
     or public.census_agent_leases.worker_node_id = p_worker_id
  returning public.census_agent_leases.fencing_token into v_next_token;

  if v_next_token is not null then
    return query select p_agent_id, p_worker_id, v_next_token, v_now + (p_ttl_seconds || ' seconds')::interval, true;
  else
    return query select p_agent_id, l.worker_node_id, l.fencing_token, l.lease_expires_at, false
    from public.census_agent_leases l where l.agent_id = p_agent_id;
  end if;
end;
$$ language plpgsql;
