/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * ============================================================================
 * SOVEREIGN INFINITY AI CENSUS: ULTIMATE ELITE MASTER PIPELINE (v3.8)
 * Project Ref: wvhjcxxfslzkechhoolz (https://wvhjcxxfslzkechhoolz.supabase.co)
 * ============================================================================
 */

import { z } from 'zod';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { pgTable, uuid, text, jsonb, timestamp, index } from 'drizzle-orm/pg-core';

// ============================================================================
// 1. STRICT RUNTIME VALIDATION CONTRACTS (ZOD)
// ============================================================================

export const AgentStatusEnum = z.enum(['INITIALIZING', 'ACTIVE', 'SUSPENDED', 'TERMINATED']);
export const SeverityEnum = z.enum(['INFO', 'WARN', 'ERROR', 'CRITICAL']);

export const AgentRegistrationSchema = z.object({
  agent_name: z
    .string()
    .min(3)
    .max(100)
    .regex(/^[a-zA-Z0-9_-]+$/, 'Invalid agent naming convention'),
  lifecycle_status: AgentStatusEnum.default('INITIALIZING'),
  metadata: z.record(z.string(), z.any()).optional().default({}),
});

export const TelemetryPayloadSchema = z.object({
  agent_id: z.string().uuid(),
  metric_type: z.string().min(1),
  payload: z.record(z.string(), z.any()),
  severity: SeverityEnum.default('INFO'),
});

export type AgentRegistration = z.infer<typeof AgentRegistrationSchema>;
export type TelemetryPayload = z.infer<typeof TelemetryPayloadSchema>;

// ============================================================================
// 2. DRIZZLE ORM SCHEMA DEFINITIONS (`src/db/schema.ts`)
// ============================================================================

export const censusAgents = pgTable(
  'census_agents',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    agentName: text('agent_name').notNull().unique(),
    lifecycleStatus: text('lifecycle_status').notNull(),
    metadata: jsonb('metadata').default({}).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index('idx_agents_status').on(table.lifecycleStatus)]
);

export const censusTelemetry = pgTable(
  'census_telemetry',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    agentId: uuid('agent_id')
      .references(() => censusAgents.id, { onDelete: 'cascade' })
      .notNull(),
    metricType: text('metric_type').notNull(),
    payload: jsonb('payload').default({}).notNull(),
    severity: text('severity').notNull(),
    recordedAt: timestamp('recorded_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('idx_telemetry_agent_id').on(table.agentId),
    index('idx_telemetry_recorded_at').on(table.recordedAt),
  ]
);

// ============================================================================
// 3. AUTONOMOUS ORCHESTRATION ENGINE (`src/agents/orchestrator.ts`)
// ============================================================================

export class AutonomousOrchestrator {
  private supabase: SupabaseClient;

  constructor(supabaseUrl: string, supabaseServiceKey: string) {
    this.supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
      realtime: { params: { eventsPerSecond: 10 } },
    });
  }

  public async registerAgent(rawInput: unknown): Promise<any> {
    const validatedData = AgentRegistrationSchema.parse(rawInput);

    const { data, error } = await this.supabase
      .from('census_agents')
      .insert(validatedData)
      .select()
      .single();

    if (error) {
      throw new Error(`Supabase Agent Registration Failure: ${error.message}`);
    }

    return data;
  }

  public async logTelemetry(rawInput: unknown): Promise<void> {
    const validatedTelemetry = TelemetryPayloadSchema.parse(rawInput);

    const { error } = await this.supabase
      .from('census_telemetry')
      .insert(validatedTelemetry);

    if (error) {
      throw new Error(`Supabase Telemetry Commit Failure: ${error.message}`);
    }
  }

  public async fetchActiveCensusMetrics(): Promise<any> {
    const { data, error } = await this.supabase
      .from('census_agents')
      .select('id, agent_name, lifecycle_status, updated_at')
      .order('updated_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to query census metrics: ${error.message}`);
    }

    return data;
  }

  public async shutdown(): Promise<void> {
    await this.supabase.removeAllChannels();
  }
}

// ============================================================================
// 4. DATABASE MIGRATION SCRIPT DDL (`supabase/migrations/20261019000000_sovereign_infinity_census.sql`)
// ============================================================================

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
