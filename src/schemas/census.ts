/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * PART II: RUNTIME VALIDATION SCHEMAS (src/schemas/census.ts)
 * Strict runtime data contracts using Zod for Sovereign Infinity AI Census,
 * including ExternalFeed, Developer AI Factories, KnowledgeSource, RepoNode,
 * EndpointNode, Hyper-Crawler Swarms, and the 8 Sovereign Meta-Layers.
 */

import { z } from 'zod';

export const AgentStatusEnum = z.enum(['INITIALIZING', 'ACTIVE', 'SUSPENDED', 'TERMINATED']);
export const SeverityEnum = z.enum(['INFO', 'WARN', 'ERROR', 'CRITICAL']);

export const AgentRegistrationSchema = z.object({
  agent_name: z.string().min(3).max(100),
  lifecycle_status: AgentStatusEnum.default('ACTIVE'),
  metadata: z.record(z.string(), z.any()).default({}),
});

export const TelemetryEventSchema = z.object({
  agent_id: z.string().uuid(),
  event_type: z.string().min(2).max(50),
  payload: z.record(z.string(), z.any()).default({}),
  merkle_proof: z.string().startsWith('0x'),
  latency_ms: z.number().nonnegative(),
});

export const TelemetryPayloadSchema = z.object({
  agent_id: z.string().uuid(),
  metric_type: z.string().min(1),
  payload: z.record(z.string(), z.any()),
  severity: SeverityEnum.default('INFO'),
});

// ============================================================================
// OMNISCIENT CENSUS & DEVELOPER AI FACTORY SCHEMAS
// ============================================================================

export const CensusTierEnum = z.enum(['AI', 'AGI', 'ASI', 'APEX']);
export const TrustLevelEnum = z.enum(['attested', 'inferred', 'unknown']);

export const ExternalFeedTypeEnum = z.enum([
  'cloudai',
  'devaifactory',
  'container',
  'serverless',
  'iot',
  'robotics',
  'vehicle',
  'vectordb',
  'messagebus',
  'cifactory',
  'p2pmesh',
  'desktopagent',
  'saas_ai',
]);

export const DevAgentTypeEnum = z.enum([
  'coding_agent',
  'debug_agent',
  'refactor_agent',
  'test_agent',
  'deploy_agent',
  'infra_agent',
  'doc_agent',
  'memory_agent',
  'autofix_agent',
]);

export const ModelBackendEnum = z.enum([
  'openai',
  'anthropic',
  'mistral',
  'azure',
  'google_gemini',
  'local_llm',
  'custom',
]);

export const AgentCountBreakdownSchema = z.object({
  hard: z.number().int().nonnegative(),
  inferred: z.number().int().nonnegative(),
  speculative: z.number().int().nonnegative(),
});

export const DevFactoryProductSchema = z.object({
  name: z.string().min(1),
  agent_types: z.array(DevAgentTypeEnum),
  model_backends: z.array(ModelBackendEnum),
});

export const ExternalFeedSchema = z.object({
  id: z.string().min(2),
  name: z.string().min(2),
  module_path: z.string().min(2),
  type: ExternalFeedTypeEnum,
  vendor: z.string().min(1),
  jurisdiction: z.string().default('US-Global'),
  factory_lineage: z.string().default('Foundational'),
  products: z.array(DevFactoryProductSchema).optional(),
  capabilities: z.array(z.string()),
  agent_count: AgentCountBreakdownSchema,
  tier: CensusTierEnum,
  trust_level: TrustLevelEnum,
  health_status: z.enum(['HEALTHY', 'DEGRADED', 'PROBING']).default('HEALTHY'),
  last_updated: z.string(),
});

export const KnowledgeSourceSchema = z.object({
  id: z.string().min(2),
  name: z.string().min(2),
  type: z.enum(['docs', 'repo', 'wiki', 'spec']),
  host: z.enum(['github', 'gitlab', 'bitbucket', 'docs_site', 'wiki']),
  url: z.string().url(),
  domain: z.string(),
  topics: z.array(z.string()),
  used_by_factories: z.array(z.string()),
  last_updated: z.string(),
});

export const RepoNodeSchema = z.object({
  id: z.string().min(2),
  host: z.enum(['github', 'gitlab', 'bitbucket', 'codeberg', 'self_hosted']),
  owner: z.string().min(1),
  name: z.string().min(1),
  url: z.string().url(),
  stars: z.number().int().nonnegative(),
  forks: z.number().int().nonnegative(),
  topics: z.array(z.string()),
  is_factory: z.boolean(),
  factory_type: z.enum(['model', 'agent', 'infra', 'tooling', 'data']),
  linked_factories: z.array(z.string()),
  last_commit: z.string(),
});

export const EndpointNodeSchema = z.object({
  id: z.string().min(2),
  name: z.string().min(2),
  host_type: z.enum(['cloud', 'self_hosted', 'edge']),
  provider: z.string().min(1),
  url: z.string(),
  protocol: z.enum(['http', 'grpc', 'ws']),
  capabilities: z.array(z.enum(['llm', 'embedding', 'image', 'audio', 'agent', 'control', 'memory'])),
  tier: CensusTierEnum,
  auth_type: z.enum(['api_key', 'oauth', 'none', 'mtls']),
  last_seen: z.string(),
});

export const SwarmAgentTypeEnum = z.enum([
  'github_harvester',
  'cloud_model_catalog_harvester',
  'docs_harvester',
  'infra_harvester',
  'p2p_mesh_harvester',
]);

export const SwarmTaskSchema = z.object({
  task_id: z.string(),
  swarm_type: SwarmAgentTypeEnum,
  targets: z.array(z.string()),
  rate_limit_rps: z.number().positive(),
  respect_robots_txt: z.boolean().default(true),
  freshness_score: z.number().min(0).max(1),
  status: z.enum(['IDLE', 'CRAWLING', 'NORMALIZING', 'RECONCILING', 'COMPLETED']),
});

export type AgentRegistrationInput = z.infer<typeof AgentRegistrationSchema>;
export type AgentRegistration = AgentRegistrationInput;
export type TelemetryEventInput = z.infer<typeof TelemetryEventSchema>;
export type TelemetryPayload = z.infer<typeof TelemetryPayloadSchema>;
export type ExternalFeed = z.infer<typeof ExternalFeedSchema>;
export type KnowledgeSource = z.infer<typeof KnowledgeSourceSchema>;
export type RepoNode = z.infer<typeof RepoNodeSchema>;
export type EndpointNode = z.infer<typeof EndpointNodeSchema>;
export type SwarmTask = z.infer<typeof SwarmTaskSchema>;

export const MASTER_MIGRATION_DDL = `
-- Enable cryptographic extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- 1. Agent Registries & Lifecycle Table
create table if not exists public.census_agents (
    id uuid primary key default gen_random_uuid(),
    agent_name text not null unique,
    lifecycle_status text not null check (lifecycle_status in ('INITIALIZING', 'ACTIVE', 'SUSPENDED', 'TERMINATED')),
    metadata jsonb default '{}'::jsonb,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- 2. Telemetry & Metric Streams Table
create table if not exists public.census_telemetry (
    id uuid primary key default gen_random_uuid(),
    agent_id uuid references public.census_agents(id) on delete cascade,
    metric_type text not null,
    payload jsonb not null default '{}'::jsonb,
    severity text not null check (severity in ('INFO', 'WARN', 'ERROR', 'CRITICAL')),
    recorded_at timestamptz not null default now()
);

-- Performance Indexes
create index if not exists idx_telemetry_agent_id on public.census_telemetry(agent_id);
create index if not exists idx_telemetry_recorded_at on public.census_telemetry(recorded_at desc);
create index if not exists idx_agents_status on public.census_agents(lifecycle_status);

-- Enable Row Level Security (RLS)
alter table public.census_agents enable row level security;
alter table public.census_telemetry enable row level security;

-- Policies for Service Role Bypass / Admin Control
create policy "Allow service role full access to census_agents" on public.census_agents
    as permissive for all to service_role using (true) with check (true);

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
`;
