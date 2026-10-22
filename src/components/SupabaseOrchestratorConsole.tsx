/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * SOVEREIGN INFINITY AI CENSUS: SUPABASE & AUTONOMOUS ORCHESTRATOR MASTER CONSOLE
 * Project Ref: wvhjcxxfslzkechhoolz (https://wvhjcxxfslzkechhoolz.supabase.co)
 *
 * Integrates:
 * - Part I: Database Migrations & PostgreSQL Schema (public.census_agents, public.census_telemetry, RLS & Triggers)
 * - Part II: Runtime Validation Schemas (Zod AgentRegistrationSchema & TelemetryPayloadSchema)
 * - Part III: Autonomous Orchestration Engine (AutonomousOrchestrator)
 * - Part IV: High-Concurrency Express & Telemetry API (POST /api/agents/register [201], POST /api/telemetry [202])
 */

import React, { useState, useEffect } from 'react';
import {
  Database,
  Play,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  PlusCircle,
  Send,
  ShieldCheck,
  Code2,
  Copy,
  Check,
  Activity,
  Cpu,
  Terminal,
  Layers,
} from 'lucide-react';
import {
  AgentRegistrationSchema,
  TelemetryPayloadSchema,
} from '../schemas/census.ts';

interface CensusAgentRow {
  id: string;
  agent_name: string;
  lifecycle_status: 'INITIALIZING' | 'ACTIVE' | 'SUSPENDED' | 'TERMINATED';
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

interface CensusTelemetryRow {
  id: string;
  agent_id: string;
  metric_type: string;
  payload: Record<string, any>;
  severity: 'INFO' | 'WARN' | 'ERROR' | 'CRITICAL';
  recorded_at: string;
}

interface SupabaseOrchestratorConsoleProps {
  theme: 'worldometers' | 'sovereign';
  onAgentRegistered?: () => void;
}

type MasterBuildTab =
  | 'AGENTS_LIFECYCLE'
  | 'TELEMETRY_STREAM'
  | 'ZOD_VALIDATION_GATE'
  | 'MIGRATIONS_AND_CODE';

const MASTER_BUILD_ARTIFACTS: Record<string, string> = {
  'supabase/migrations/20261019000000_sovereign_infinity_census.sql': `-- Enable necessary extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- 1. Agent Registries & Lifecycles
create table public.census_agents (
    id uuid primary key default gen_random_uuid(),
    agent_name text not null unique,
    lifecycle_status text not null check (lifecycle_status in ('INITIALIZING', 'ACTIVE', 'SUSPENDED', 'TERMINATED')),
    metadata jsonb default '{}'::jsonb,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- 2. Telemetry & Metric Streams
create table public.census_telemetry (
    id uuid primary key default gen_random_uuid(),
    agent_id uuid references public.census_agents(id) on delete cascade,
    metric_type text not null,
    payload jsonb not null default '{}'::jsonb,
    severity text not null check (severity in ('INFO', 'WARN', 'ERROR', 'CRITICAL')),
    recorded_at timestamptz not null default now()
);

-- Indexes for high-throughput query performance
create index idx_telemetry_agent_id on public.census_telemetry(agent_id);
create index idx_telemetry_recorded_at on public.census_telemetry(recorded_at desc);
create index idx_agents_status on public.census_agents(lifecycle_status);

-- Enable Row Level Security (RLS)
alter table public.census_agents enable row level security;
alter table public.census_telemetry enable row level security;

-- Policies (Permissive internal access via service role / authenticated roles)
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

create trigger update_census_agents_updated_at
    before update on public.census_agents
    for each row
    execute function public.update_updated_at_column();`,

  'src/db/schema.ts': `import { pgTable, uuid, text, jsonb, timestamp, index } from 'drizzle-orm/pg-core';

export const censusAgents = pgTable('census_agents', {
  id: uuid('id').primaryKey().defaultRandom(),
  agentName: text('agent_name').notNull().unique(),
  lifecycleStatus: text('lifecycle_status').notNull(),
  metadata: jsonb('metadata').default({}).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index('idx_agents_status').on(table.lifecycleStatus),
]);

export const censusTelemetry = pgTable('census_telemetry', {
  id: uuid('id').primaryKey().defaultRandom(),
  agentId: uuid('agent_id').references(() => censusAgents.id, { onDelete: 'cascade' }).notNull(),
  metricType: text('metric_type').notNull(),
  payload: jsonb('payload').default({}).notNull(),
  severity: text('severity').notNull(),
  recordedAt: timestamp('recorded_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index('idx_telemetry_agent_id').on(table.agentId),
  index('idx_telemetry_recorded_at').on(table.recordedAt),
]);`,

  'src/schemas/census.ts': `import { z } from 'zod';

export const AgentStatusEnum = z.enum(['INITIALIZING', 'ACTIVE', 'SUSPENDED', 'TERMINATED']);
export const SeverityEnum = z.enum(['INFO', 'WARN', 'ERROR', 'CRITICAL']);

export const AgentRegistrationSchema = z.object({
  agent_name: z.string().min(3).max(100).regex(/^[a-zA-Z0-9_-]+$/, 'Invalid agent naming convention'),
  lifecycle_status: AgentStatusEnum.default('INITIALIZING'),
  metadata: z.record(z.string(), z.any()).optional().default({})
});

export const TelemetryPayloadSchema = z.object({
  agent_id: z.string().uuid(),
  metric_type: z.string().min(1),
  payload: z.record(z.string(), z.any()),
  severity: SeverityEnum.default('INFO')
});

export type AgentRegistration = z.infer<typeof AgentRegistrationSchema>;
export type TelemetryPayload = z.infer<typeof TelemetryPayloadSchema>;`,

  'src/agents/orchestrator.ts': `import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { AgentRegistrationSchema, TelemetryPayloadSchema, AgentRegistration } from '../schemas/census';

export class AutonomousOrchestrator {
  private supabase: SupabaseClient;

  constructor(supabaseUrl: string, supabaseServiceKey: string) {
    this.supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
      realtime: { params: { eventsPerSecond: 10 } }
    });
  }

  public async registerAgent(rawInput: unknown): Promise<AgentRegistration & { id: string }> {
    const validatedData = AgentRegistrationSchema.parse(rawInput);

    const { data, error } = await this.supabase
      .from('census_agents')
      .insert(validatedData)
      .select()
      .single();

    if (error) {
      throw new Error(\`Supabase Agent Registration Failure: \${error.message}\`);
    }

    return data;
  }

  public async logTelemetry(rawInput: unknown): Promise<void> {
    const validatedTelemetry = TelemetryPayloadSchema.parse(rawInput);

    const { error } = await this.supabase
      .from('census_telemetry')
      .insert(validatedTelemetry);

    if (error) {
      throw new Error(\`Supabase Telemetry Commit Failure: \${error.message}\`);
    }
  }

  public async fetchActiveCensusMetrics(): Promise<any> {
    const { data, error } = await this.supabase
      .from('census_agents')
      .select('id, agent_name, lifecycle_status, updated_at')
      .order('updated_at', { ascending: false });

    if (error) {
      throw new Error(\`Failed to query census metrics: \${error.message}\`);
    }

    return data;
  }

  public async shutdown(): Promise<void> {
    await this.supabase.removeAllChannels();
  }
}`,

  'src/server.ts': `import express, { Request, Response } from 'express';
import { AutonomousOrchestrator } from './agents/orchestrator';

const app = express();
app.use(express.json());

const orchestrator = new AutonomousOrchestrator(
  process.env.SUPABASE_URL || 'https://wvhjcxxfslzkechhoolz.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

app.post('/api/agents/register', async (req: Request, res: Response) => {
  try {
    const result = await orchestrator.registerAgent(req.body);
    return res.status(201).json({ success: true, data: result });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

app.post('/api/telemetry', async (req: Request, res: Response) => {
  try {
    await orchestrator.logTelemetry(req.body);
    return res.status(202).json({ success: true, status: 'committed' });
  } catch (err: any) {
    return res.status(422).json({ success: false, error: err.message });
  }
});

app.get('/api/agents/metrics', async (_req: Request, res: Response) => {
  try {
    const metrics = await orchestrator.fetchActiveCensusMetrics();
    return res.status(200).json({ success: true, data: metrics });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(\`Sovereign Infinity AI Census Engine active on port \${PORT}\`);
});`,
};

export const SupabaseOrchestratorConsole: React.FC<SupabaseOrchestratorConsoleProps> = ({
  theme,
  onAgentRegistered,
}) => {
  const isLight = theme === 'worldometers';
  const [activeTab, setActiveTab] = useState<MasterBuildTab>('AGENTS_LIFECYCLE');

  const [agents, setAgents] = useState<CensusAgentRow[]>([]);
  const [telemetry, setTelemetry] = useState<CensusTelemetryRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<{
    type: 'success' | 'error';
    httpCode: number;
    message: string;
  } | null>(null);

  // Agent Registration Form State
  const [agentName, setAgentName] = useState('sovereign-apex-orchestrator-node-09');
  const [lifecycleStatus, setLifecycleStatus] = useState<
    'INITIALIZING' | 'ACTIVE' | 'SUSPENDED' | 'TERMINATED'
  >('ACTIVE');
  const [metadataJson, setMetadataJson] = useState(
    '{"ecosystem": "supabase_mesh", "pqc": "ML-KEM-1024", "max_memory_kb": 64, "supabase_ref": "wvhjcxxfslzkechhoolz"}'
  );
  const [isSubmittingAgent, setIsSubmittingAgent] = useState(false);

  // Telemetry Form State
  const [selectedAgentId, setSelectedAgentId] = useState('');
  const [metricType, setMetricType] = useState('MERKLE_EPOCH_ATTESTATION');
  const [severity, setSeverity] = useState<'INFO' | 'WARN' | 'ERROR' | 'CRITICAL'>('INFO');
  const [payloadJson, setPayloadJson] = useState(
    '{"latency_ms": 11.4, "merkle_root": "0x3E189AB877C19D4EA18855F091", "z3_sat": true}'
  );
  const [isSubmittingTelemetry, setIsSubmittingTelemetry] = useState(false);

  // Zod Contract Tester State
  const [zodTestInput, setZodTestInput] = useState(
    JSON.stringify(
      {
        agent_name: 'sovereign-verkle-prover-01',
        lifecycle_status: 'ACTIVE',
        metadata: { trie_depth: 5, branching: 256, witness_bytes: 152 },
      },
      null,
      2
    )
  );
  const [zodValidationResult, setZodValidationResult] = useState<{
    valid: boolean;
    output: string;
  } | null>(null);

  // Code Viewer State
  const [selectedArtifact, setSelectedArtifact] = useState<string>(
    'supabase/migrations/20261019000000_sovereign_infinity_census.sql'
  );
  const [copiedCode, setCopiedCode] = useState(false);

  const fetchOrchestratorState = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/census/orchestrator');
      if (res.ok) {
        const data = await res.json();
        const rawAgents: CensusAgentRow[] = Array.isArray(data.agents) ? data.agents : [];
        const rawTelemetry: CensusTelemetryRow[] = Array.isArray(data.telemetry)
          ? data.telemetry
          : [];
        const seenAgents = new Set<string>();
        const agentList = rawAgents.filter((a) => {
          if (!a?.id || seenAgents.has(a.id)) return false;
          seenAgents.add(a.id);
          return true;
        });
        const seenTelemetry = new Set<string>();
        const telemetryList = rawTelemetry.filter((t) => {
          if (!t?.id || seenTelemetry.has(t.id)) return false;
          seenTelemetry.add(t.id);
          return true;
        });
        setAgents(agentList);
        setTelemetry(telemetryList);
        if (agentList.length > 0 && !selectedAgentId) {
          setSelectedAgentId(agentList[0].id);
        }
      }
    } catch {
      // Retain local state if offline
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrchestratorState();
  }, []);

  const handleRegisterAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingAgent(true);
    setActionFeedback(null);

    try {
      let parsedMeta: Record<string, any> = {};
      if (metadataJson.trim()) {
        parsedMeta = JSON.parse(metadataJson);
      }

      const bodyPayload = {
        agent_name: agentName.trim(),
        lifecycle_status: lifecycleStatus,
        metadata: parsedMeta,
      };

      const res = await fetch('/api/agents/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyPayload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setActionFeedback({
          type: 'success',
          httpCode: res.status,
          message: `HTTP ${res.status} Created: Registered "${data.data.agent_name}" (UUID: ${data.data.id}) in public.census_agents`,
        });
        await fetchOrchestratorState();
        if (data.data?.id) setSelectedAgentId(data.data.id);
        onAgentRegistered?.();
      } else {
        setActionFeedback({
          type: 'error',
          httpCode: res.status,
          message: `HTTP ${res.status} Bad Request (Zod Validation Failed): ${data.error}`,
        });
      }
    } catch (err: any) {
      setActionFeedback({
        type: 'error',
        httpCode: 400,
        message: `Validation / Parse Error: ${err?.message || 'Invalid JSON metadata'}`,
      });
    } finally {
      setIsSubmittingAgent(false);
    }
  };

  const handleTransitionStatus = async (
    id: string,
    nextStatus: 'INITIALIZING' | 'ACTIVE' | 'SUSPENDED' | 'TERMINATED'
  ) => {
    try {
      const res = await fetch('/api/agents/status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, lifecycle_status: nextStatus }),
      });
      if (res.ok) {
        await fetchOrchestratorState();
      }
    } catch {
      // Ignore
    }
  };

  const handleCommitTelemetry = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingTelemetry(true);
    setActionFeedback(null);

    try {
      const parsedPayload = JSON.parse(payloadJson || '{}');
      const bodyPayload = {
        agent_id: selectedAgentId,
        metric_type: metricType.trim(),
        payload: parsedPayload,
        severity,
      };

      const res = await fetch('/api/telemetry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyPayload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setActionFeedback({
          type: 'success',
          httpCode: res.status,
          message: `HTTP ${res.status} Accepted: Telemetry "${metricType}" (${severity}) committed to public.census_telemetry`,
        });
        await fetchOrchestratorState();
      } else {
        setActionFeedback({
          type: 'error',
          httpCode: res.status,
          message: `HTTP ${res.status} Unprocessable Entity (Zod Validation Failed): ${data.error}`,
        });
      }
    } catch (err: any) {
      setActionFeedback({
        type: 'error',
        httpCode: 422,
        message: `Payload Parse Error: ${err?.message || 'Invalid JSON'}`,
      });
    } finally {
      setIsSubmittingTelemetry(false);
    }
  };

  const handleRunZodValidationTest = (schemaType: 'agent' | 'telemetry') => {
    try {
      const raw = JSON.parse(zodTestInput);
      const parsed =
        schemaType === 'agent'
          ? AgentRegistrationSchema.parse(raw)
          : TelemetryPayloadSchema.parse(raw);
      setZodValidationResult({
        valid: true,
        output: `ZOD RUNTIME VALIDATION PASSED (${
          schemaType === 'agent' ? 'AgentRegistrationSchema' : 'TelemetryPayloadSchema'
        }):\n${JSON.stringify(parsed, null, 2)}`,
      });
    } catch (err: any) {
      setZodValidationResult({
        valid: false,
        output: `ZOD RUNTIME VALIDATION REJECTED:\n${err?.message || String(err)}`,
      });
    }
  };

  const handleCopyArtifact = () => {
    navigator.clipboard?.writeText(MASTER_BUILD_ARTIFACTS[selectedArtifact] || '');
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const statusBadgeColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
      case 'INITIALIZING':
        return 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30';
      case 'SUSPENDED':
        return 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30';
      case 'TERMINATED':
        return 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30';
      default:
        return 'bg-gray-500/15 text-gray-500';
    }
  };

  const severityBadgeColor = (sev: string) => {
    switch (sev) {
      case 'INFO':
        return 'bg-blue-500/15 text-blue-600 dark:text-blue-400';
      case 'WARN':
        return 'bg-amber-500/15 text-amber-600 dark:text-amber-400';
      case 'ERROR':
        return 'bg-orange-500/15 text-orange-600 dark:text-orange-400';
      case 'CRITICAL':
        return 'bg-rose-500/20 text-rose-600 dark:text-rose-400 font-black';
      default:
        return 'bg-gray-500/15 text-gray-500';
    }
  };

  return (
    <section
      id="supabase-orchestrator-console"
      className="max-w-6xl mx-auto px-4 my-8 scroll-mt-20"
    >
      <div
        className={`rounded-xl border overflow-hidden transition-all ${
          isLight
            ? 'bg-white border-gray-300 shadow-sm'
            : 'bg-[#090d1a] border-emerald-500/30 shadow-2xl shadow-emerald-950/20'
        }`}
      >
        {/* Top Master Build Header */}
        <div
          className={`p-5 border-b ${
            isLight
              ? 'bg-gradient-to-r from-emerald-50/70 via-slate-50 to-cyan-50/50 border-gray-200'
              : 'bg-gradient-to-r from-[#091e1a] via-[#0b1324] to-[#0a192f] border-emerald-500/20'
          }`}
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                  <Database className="w-3.5 h-3.5" />
                  SUPABASE PROJECT REF: wvhjcxxfslzkechhoolz
                </span>
                <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-md bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30">
                  ZOD RUNTIME VALIDATION ENFORCED
                </span>
                <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-md bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30">
                  RLS + UUIDv4 + JSONB TRIGGERS ACTIVE
                </span>
              </div>

              <h2
                className={`text-xl sm:text-2xl font-black tracking-tight font-['Montserrat'] ${
                  isLight ? 'text-gray-900' : 'text-white'
                }`}
              >
                Autonomous Agent Lifecycle Orchestrator &amp; Supabase/PostgreSQL Master Engine
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1 max-w-4xl">
                Production-grade implementation of the 4-Part Master Directive: linking{' '}
                <code className="font-mono text-[11px]">https://wvhjcxxfslzkechhoolz.supabase.co</code> with live PostgreSQL tables{' '}
                <code className="font-mono text-[11px]">public.census_agents</code> and{' '}
                <code className="font-mono text-[11px]">public.census_telemetry</code>, strict{' '}
                <code className="font-mono text-[11px]">zod</code> runtime schemas (<code className="font-mono text-[11px]">src/schemas/census.ts</code>), and high-concurrency Express endpoints (<code className="font-mono text-[11px]">POST /api/agents/register</code> &amp; <code className="font-mono text-[11px]">POST /api/telemetry</code>).
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={fetchOrchestratorState}
                disabled={isLoading}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-emerald-600 hover:bg-emerald-500 text-white shadow-md cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Refresh Live Tables ({agents.length} Agents)</span>
              </button>
            </div>
          </div>

          {actionFeedback && (
            <div
              className={`mt-3 p-3 rounded-lg border flex items-center justify-between gap-2 text-xs font-mono ${
                actionFeedback.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300'
              }`}
            >
              <div className="flex items-center gap-2">
                {actionFeedback.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                ) : (
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
                )}
                <span>{actionFeedback.message}</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-black/20 font-bold shrink-0">
                HTTP {actionFeedback.httpCode}
              </span>
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <div
          className={`px-4 pt-3 border-b flex items-center gap-2 overflow-x-auto ${
            isLight ? 'bg-gray-50 border-gray-200' : 'bg-[#070b14] border-gray-800'
          }`}
        >
          {[
            {
              id: 'AGENTS_LIFECYCLE' as MasterBuildTab,
              label: `🤖 1. Agent Registries & Lifecycles (public.census_agents • ${agents.length})`,
            },
            {
              id: 'TELEMETRY_STREAM' as MasterBuildTab,
              label: `📡 2. Telemetry & Metric Streams (public.census_telemetry • ${telemetry.length})`,
            },
            {
              id: 'ZOD_VALIDATION_GATE' as MasterBuildTab,
              label: '🛡️ 3. Zod Runtime Schema Verifier (src/schemas/census.ts)',
            },
            {
              id: 'MIGRATIONS_AND_CODE' as MasterBuildTab,
              label: '🗄️ 4. Supabase SQL Migrations & Master Code Inspector',
            },
          ].map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2.5 text-xs font-bold rounded-t-lg border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                  active
                    ? isLight
                      ? 'border-emerald-600 text-emerald-700 bg-white'
                      : 'border-emerald-400 text-emerald-300 bg-[#0d1424]'
                    : 'border-transparent text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* TAB 1: AGENT REGISTRIES & LIFECYCLES (public.census_agents) */}
        {activeTab === 'AGENTS_LIFECYCLE' && (
          <div className="p-5 grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Left: Register Agent via POST /api/agents/register */}
            <form
              onSubmit={handleRegisterAgent}
              className={`p-4 rounded-xl border space-y-3.5 ${
                isLight ? 'bg-gray-50 border-gray-200' : 'bg-[#0d1424] border-gray-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <PlusCircle className="w-4 h-4 text-emerald-500" />
                  <span>Register Agent (`POST /api/agents/register`)</span>
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-500 font-bold">
                  HTTP 201
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-gray-500 dark:text-gray-400 mb-1">
                  agent_name (z.string().min(3).max(100) • unique)
                </label>
                <input
                  type="text"
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  required
                  className={`w-full px-3 py-1.5 rounded-lg border text-xs font-mono ${
                    isLight
                      ? 'bg-white border-gray-300 text-gray-900'
                      : 'bg-black/50 border-gray-700 text-white'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-gray-500 dark:text-gray-400 mb-1">
                  lifecycle_status (AgentStatusEnum)
                </label>
                <select
                  value={lifecycleStatus}
                  onChange={(e) => setLifecycleStatus(e.target.value as any)}
                  className={`w-full px-3 py-1.5 rounded-lg border text-xs font-mono ${
                    isLight
                      ? 'bg-white border-gray-300 text-gray-900'
                      : 'bg-black/50 border-gray-700 text-white'
                  }`}
                >
                  <option value="INITIALIZING">INITIALIZING</option>
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="SUSPENDED">SUSPENDED</option>
                  <option value="TERMINATED">TERMINATED</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-gray-500 dark:text-gray-400 mb-1">
                  metadata (JSONB • z.record(z.any()))
                </label>
                <textarea
                  rows={3}
                  value={metadataJson}
                  onChange={(e) => setMetadataJson(e.target.value)}
                  className={`w-full px-3 py-1.5 rounded-lg border text-xs font-mono ${
                    isLight
                      ? 'bg-white border-gray-300 text-gray-900'
                      : 'bg-black/50 border-gray-700 text-white'
                  }`}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingAgent}
                className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider cursor-pointer transition-all"
              >
                {isSubmittingAgent
                  ? 'Validating & Persisting...'
                  : 'Validate via Zod & Upsert to census_agents'}
              </button>
            </form>

            {/* Right 2 Columns: Live public.census_agents Table */}
            <div className="lg:col-span-2 overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr
                    className={`border-b text-[10px] font-mono uppercase tracking-wider ${
                      isLight
                        ? 'bg-gray-100 border-gray-200 text-gray-600'
                        : 'bg-[#0c1222] border-gray-800 text-gray-400'
                    }`}
                  >
                    <th className="py-2.5 px-3">UUID (PK) &amp; Agent Name</th>
                    <th className="py-2.5 px-3">Lifecycle Status</th>
                    <th className="py-2.5 px-3">JSONB Metadata</th>
                    <th className="py-2.5 px-3 text-right">State Transition</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800/70">
                  {agents.map((ag, idx) => (
                    <tr
                      key={`${ag.id}-${idx}`}
                      className={isLight ? 'hover:bg-gray-50' : 'hover:bg-white/[0.02]'}
                    >
                      <td className="py-2.5 px-3">
                        <div className="font-mono font-bold text-gray-900 dark:text-white">
                          {ag.agent_name}
                        </div>
                        <div className="text-[10px] font-mono text-gray-500">
                          id: {ag.id}
                        </div>
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`inline-block text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${statusBadgeColor(
                            ag.lifecycle_status
                          )}`}
                        >
                          {ag.lifecycle_status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[10px] text-cyan-600 dark:text-cyan-400 max-w-xs truncate">
                        {JSON.stringify(ag.metadata)}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <div className="inline-flex items-center gap-1">
                          {(['ACTIVE', 'SUSPENDED', 'TERMINATED'] as const).map((st) => (
                            <button
                              key={st}
                              onClick={() => handleTransitionStatus(ag.id, st)}
                              disabled={ag.lifecycle_status === st}
                              className={`px-2 py-0.5 rounded text-[10px] font-mono cursor-pointer ${
                                ag.lifecycle_status === st
                                  ? 'opacity-40 cursor-not-allowed bg-gray-700 text-gray-400'
                                  : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200'
                              }`}
                            >
                              {st.slice(0, 4)}
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: TELEMETRY & METRIC STREAMS (public.census_telemetry) */}
        {activeTab === 'TELEMETRY_STREAM' && (
          <div className="p-5 grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Left: Commit Telemetry via POST /api/telemetry */}
            <form
              onSubmit={handleCommitTelemetry}
              className={`p-4 rounded-xl border space-y-3.5 ${
                isLight ? 'bg-gray-50 border-gray-200' : 'bg-[#0d1424] border-gray-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Send className="w-4 h-4 text-cyan-500" />
                  <span>Log Telemetry (`POST /api/telemetry`)</span>
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-500 font-bold">
                  HTTP 202
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-gray-500 dark:text-gray-400 mb-1">
                  agent_id (z.string().uuid() FK → census_agents.id)
                </label>
                <select
                  value={selectedAgentId}
                  onChange={(e) => setSelectedAgentId(e.target.value)}
                  className={`w-full px-3 py-1.5 rounded-lg border text-xs font-mono ${
                    isLight
                      ? 'bg-white border-gray-300 text-gray-900'
                      : 'bg-black/50 border-gray-700 text-white'
                  }`}
                >
                  {agents.map((a, idx) => (
                    <option key={`${a.id}-${idx}`} value={a.id}>
                      {a.agent_name} ({a.id.slice(0, 8)}...)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-gray-500 dark:text-gray-400 mb-1">
                  metric_type (z.string().min(1))
                </label>
                <input
                  type="text"
                  value={metricType}
                  onChange={(e) => setMetricType(e.target.value)}
                  required
                  className={`w-full px-3 py-1.5 rounded-lg border text-xs font-mono ${
                    isLight
                      ? 'bg-white border-gray-300 text-gray-900'
                      : 'bg-black/50 border-gray-700 text-white'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-gray-500 dark:text-gray-400 mb-1">
                  severity (SeverityEnum)
                </label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as any)}
                  className={`w-full px-3 py-1.5 rounded-lg border text-xs font-mono ${
                    isLight
                      ? 'bg-white border-gray-300 text-gray-900'
                      : 'bg-black/50 border-gray-700 text-white'
                  }`}
                >
                  <option value="INFO">INFO</option>
                  <option value="WARN">WARN</option>
                  <option value="ERROR">ERROR</option>
                  <option value="CRITICAL">CRITICAL</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-gray-500 dark:text-gray-400 mb-1">
                  payload (JSONB • z.record(z.any()))
                </label>
                <textarea
                  rows={3}
                  value={payloadJson}
                  onChange={(e) => setPayloadJson(e.target.value)}
                  className={`w-full px-3 py-1.5 rounded-lg border text-xs font-mono ${
                    isLight
                      ? 'bg-white border-gray-300 text-gray-900'
                      : 'bg-black/50 border-gray-700 text-white'
                  }`}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingTelemetry}
                className="w-full py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold uppercase tracking-wider cursor-pointer transition-all"
              >
                {isSubmittingTelemetry
                  ? 'Committing Telemetry...'
                  : 'Validate & Commit to census_telemetry'}
              </button>
            </form>

            {/* Right 2 Columns: Live public.census_telemetry Table */}
            <div className="lg:col-span-2 overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr
                    className={`border-b text-[10px] font-mono uppercase tracking-wider ${
                      isLight
                        ? 'bg-gray-100 border-gray-200 text-gray-600'
                        : 'bg-[#0c1222] border-gray-800 text-gray-400'
                    }`}
                  >
                    <th className="py-2.5 px-3">Recorded At</th>
                    <th className="py-2.5 px-3">Severity</th>
                    <th className="py-2.5 px-3">Metric Type &amp; Agent UUID</th>
                    <th className="py-2.5 px-3">JSONB Payload</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800/70">
                  {telemetry.map((t, idx) => (
                    <tr
                      key={`${t.id}-${idx}`}
                      className={isLight ? 'hover:bg-gray-50' : 'hover:bg-white/[0.02]'}
                    >
                      <td className="py-2.5 px-3 font-mono text-[11px] text-gray-500">
                        {new Date(t.recorded_at).toLocaleTimeString()}
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`inline-block text-[10px] font-mono font-bold px-2 py-0.5 rounded ${severityBadgeColor(
                            t.severity
                          )}`}
                        >
                          {t.severity}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="font-mono font-bold text-gray-900 dark:text-white">
                          {t.metric_type}
                        </div>
                        <div className="text-[10px] font-mono text-gray-500">
                          agent_id: {t.agent_id}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[10px] text-emerald-600 dark:text-emerald-400 max-w-xs truncate">
                        {JSON.stringify(t.payload)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: ZOD RUNTIME VALIDATION GATEWAY */}
        {activeTab === 'ZOD_VALIDATION_GATE' && (
          <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-500" />
                <span>Interactive Zod Contract Sandbox (`src/schemas/census.ts`)</span>
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Test raw JSON inputs against <code className="font-mono">AgentRegistrationSchema</code> or{' '}
                <code className="font-mono">TelemetryPayloadSchema</code> to verify strict runtime validation.
              </p>

              <textarea
                rows={7}
                value={zodTestInput}
                onChange={(e) => setZodTestInput(e.target.value)}
                className={`w-full p-3 rounded-xl border text-xs font-mono ${
                  isLight
                    ? 'bg-gray-50 border-gray-300 text-gray-900'
                    : 'bg-black/60 border-gray-700 text-emerald-300'
                }`}
              />

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleRunZodValidationTest('agent')}
                  className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold font-mono cursor-pointer"
                >
                  Validate AgentRegistrationSchema.parse()
                </button>
                <button
                  onClick={() => handleRunZodValidationTest('telemetry')}
                  className="px-3.5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold font-mono cursor-pointer"
                >
                  Validate TelemetryPayloadSchema.parse()
                </button>
                <button
                  onClick={() => {
                    setZodTestInput(
                      JSON.stringify(
                        {
                          agent_name: 'ab', // Too short (< 3 chars) — triggers ZodError
                          lifecycle_status: 'INVALID_STATE',
                        },
                        null,
                        2
                      )
                    );
                  }}
                  className="px-3 py-2 rounded-lg bg-rose-500/15 text-rose-500 border border-rose-500/30 text-xs font-mono font-bold cursor-pointer"
                >
                  Load Invalid Payload (Test Rejection)
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider mb-2">
                Zod Parser Output
              </h3>
              <pre
                className={`p-4 rounded-xl border text-xs font-mono overflow-x-auto min-h-[210px] ${
                  zodValidationResult
                    ? zodValidationResult.valid
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                      : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
                    : isLight
                    ? 'bg-gray-900 text-gray-300 border-gray-800'
                    : 'bg-black/60 text-gray-400 border-gray-800'
                }`}
              >
                {zodValidationResult
                  ? zodValidationResult.output
                  : '// Click "Validate AgentRegistrationSchema.parse()" to inspect runtime validation output.'}
              </pre>
            </div>
          </div>
        )}

        {/* TAB 4: SUPABASE SQL MIGRATIONS & MASTER CODE INSPECTOR */}
        {activeTab === 'MIGRATIONS_AND_CODE' && (
          <div className="p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap gap-1.5">
                {Object.keys(MASTER_BUILD_ARTIFACTS).map((fileKey) => (
                  <button
                    key={fileKey}
                    onClick={() => setSelectedArtifact(fileKey)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold cursor-pointer transition-all ${
                      selectedArtifact === fileKey
                        ? 'bg-emerald-600 text-white'
                        : isLight
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {fileKey}
                  </button>
                ))}
              </div>

              <button
                onClick={handleCopyArtifact}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 border border-cyan-500/30 cursor-pointer"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Copied to Clipboard' : 'Copy Source File'}</span>
              </button>
            </div>

            <pre
              className={`p-4 rounded-xl border text-xs font-mono overflow-x-auto leading-relaxed ${
                isLight
                  ? 'bg-gray-900 text-emerald-300 border-gray-800'
                  : 'bg-black/80 text-emerald-300 border-gray-800'
              }`}
            >
              {MASTER_BUILD_ARTIFACTS[selectedArtifact]}
            </pre>
          </div>
        )}
      </div>
    </section>
  );
};
