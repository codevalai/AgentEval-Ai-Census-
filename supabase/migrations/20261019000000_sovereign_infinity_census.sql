-- ============================================================================
-- SOVEREIGN INFINITY AI CENSUS (ULTRA-ELITE MASTER BUILD)
-- Target Project Ref: wvhjcxxfslzkechhoolz (https://wvhjcxxfslzkechhoolz.supabase.co)
-- ============================================================================

-- Enable necessary extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- 1. Agent Registries & Lifecycles
create table if not exists public.census_agents (
    id uuid primary key default gen_random_uuid(),
    agent_name text not null unique,
    lifecycle_status text not null check (lifecycle_status in ('INITIALIZING', 'ACTIVE', 'SUSPENDED', 'TERMINATED')),
    metadata jsonb default '{}'::jsonb,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- 2. Telemetry & Metric Streams
create table if not exists public.census_telemetry (
    id uuid primary key default gen_random_uuid(),
    agent_id uuid references public.census_agents(id) on delete cascade,
    metric_type text not null,
    payload jsonb not null default '{}'::jsonb,
    severity text not null check (severity in ('INFO', 'WARN', 'ERROR', 'CRITICAL')),
    recorded_at timestamptz not null default now()
);

-- Indexes for high-throughput query performance
create index if not exists idx_telemetry_agent_id on public.census_telemetry(agent_id);
create index if not exists idx_telemetry_recorded_at on public.census_telemetry(recorded_at desc);
create index if not exists idx_agents_status on public.census_agents(lifecycle_status);

-- Enable Row Level Security (RLS)
alter table public.census_agents enable row level security;
alter table public.census_telemetry enable row level security;

-- Policies (Permissive internal access via service role / authenticated roles)
drop policy if exists "Allow service role full access to census_agents" on public.census_agents;
create policy "Allow service role full access to census_agents" on public.census_agents
    as permissive for all to service_role using (true) with check (true);

drop policy if exists "Allow service role full access to census_telemetry" on public.census_telemetry;
create policy "Allow service role full access to census_telemetry" on public.census_telemetry
    as permissive for all to service_role using (true) with check (true);

-- Automated Timestamp Update Trigger
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

drop trigger if exists update_census_agents_updated_at on public.census_agents;
create trigger update_census_agents_updated_at
    before update on public.census_agents
    for each row
    execute function public.update_updated_at_column();
