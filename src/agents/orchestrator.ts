/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * PART III: AUTONOMOUS ORCHESTRATION ENGINE (src/agents/orchestrator.ts)
 * Event-driven lifecycle manager with strict Zod validation, Supabase client
 * (wvhjcxxfslzkechhoolz), and Drizzle ORM PostgreSQL persistence.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import { desc, eq } from 'drizzle-orm';
import {
  AgentRegistrationSchema,
  TelemetryPayloadSchema,
  AgentRegistration,
  TelemetryPayload,
} from '../schemas/census.ts';
import { db } from '../db/index.ts';
import { censusAgents, censusTelemetry } from '../db/schema.ts';

export interface CensusAgentRecord extends AgentRegistration {
  id: string;
  created_at: string;
  updated_at: string;
}

export interface CensusTelemetryRecord extends TelemetryPayload {
  id: string;
  recorded_at: string;
}

export class AutonomousOrchestrator {
  private supabase: SupabaseClient | null = null;
  private readonly supabaseUrl: string;
  private readonly hasSupabaseKey: boolean;

  constructor(supabaseUrl: string, supabaseServiceKey: string) {
    this.supabaseUrl = supabaseUrl || 'https://wvhjcxxfslzkechhoolz.supabase.co';
    this.hasSupabaseKey = Boolean(supabaseServiceKey && supabaseServiceKey.trim().length > 10);

    if (this.hasSupabaseKey) {
      this.supabase = createClient(this.supabaseUrl, supabaseServiceKey, {
        auth: { persistSession: false },
        realtime: { params: { eventsPerSecond: 10 } },
      });
    }
  }

  public getConnectionMetadata() {
    return {
      projectRef: 'wvhjcxxfslzkechhoolz',
      supabaseUrl: this.supabaseUrl,
      supabaseClientInitialized: Boolean(this.supabase),
      postgresMirrorActive: true,
      tables: ['public.census_agents', 'public.census_telemetry'],
      rlsEnabled: true,
    };
  }

  public async registerAgent(rawInput: unknown): Promise<CensusAgentRecord> {
    // 1. Strict Zod runtime validation (throws ZodError if invalid)
    const validatedData = AgentRegistrationSchema.parse(rawInput);

    // 2. If Supabase Service Role Key is present, write to remote Supabase project wvhjcxxfslzkechhoolz
    if (this.supabase) {
      const { data, error } = await this.supabase
        .from('census_agents')
        .upsert(validatedData, { onConflict: 'agent_name' })
        .select()
        .single();

      if (!error && data) {
        return data as CensusAgentRecord;
      }
    }

    // 3. Persist to live PostgreSQL database via Drizzle ORM (public.census_agents)
    try {
      const inserted = await db
        .insert(censusAgents)
        .values({
          agentName: validatedData.agent_name,
          lifecycleStatus: validatedData.lifecycle_status,
          metadata: validatedData.metadata || {},
        })
        .onConflictDoUpdate({
          target: censusAgents.agentName,
          set: {
            lifecycleStatus: validatedData.lifecycle_status,
            metadata: validatedData.metadata || {},
            updatedAt: new Date(),
          },
        })
        .returning();

      const row = inserted[0];
      return {
        id: row.id,
        agent_name: row.agentName,
        lifecycle_status: row.lifecycleStatus as AgentRegistration['lifecycle_status'],
        metadata: (row.metadata as Record<string, any>) || {},
        created_at: row.createdAt ? new Date(row.createdAt).toISOString() : new Date().toISOString(),
        updated_at: row.updatedAt ? new Date(row.updatedAt).toISOString() : new Date().toISOString(),
      };
    } catch (error) {
      console.error('Database query failed in registerAgent:', error);
      throw new Error('Failed to register agent in PostgreSQL persistence layer.', {
        cause: error,
      });
    }
  }

  public async logTelemetry(rawInput: unknown): Promise<CensusTelemetryRecord> {
    // 1. Strict Zod runtime validation (throws ZodError if invalid)
    const validatedTelemetry = TelemetryPayloadSchema.parse(rawInput);

    // 2. If Supabase Service Role Key is present, commit to remote Supabase
    if (this.supabase) {
      const { data, error } = await this.supabase
        .from('census_telemetry')
        .insert(validatedTelemetry)
        .select()
        .single();

      if (!error && data) {
        return data as CensusTelemetryRecord;
      }
    }

    // 3. Persist to live PostgreSQL database via Drizzle ORM (public.census_telemetry)
    try {
      const inserted = await db
        .insert(censusTelemetry)
        .values({
          agentId: validatedTelemetry.agent_id,
          metricType: validatedTelemetry.metric_type,
          payload: validatedTelemetry.payload || {},
          severity: validatedTelemetry.severity,
        })
        .returning();

      const row = inserted[0];
      return {
        id: row.id || crypto.randomUUID(),
        agent_id: row.agentId || validatedTelemetry.agent_id,
        metric_type: row.metricType,
        payload: (row.payload as Record<string, any>) || {},
        severity: row.severity as TelemetryPayload['severity'],
        recorded_at: row.recordedAt ? new Date(row.recordedAt).toISOString() : new Date().toISOString(),
      };
    } catch (error) {
      console.error('Database query failed in logTelemetry:', error);
      throw new Error('Failed to commit telemetry payload to PostgreSQL persistence layer.', {
        cause: error,
      });
    }
  }

  public async listAgentsAndTelemetry(): Promise<{
    agents: CensusAgentRecord[];
    telemetry: CensusTelemetryRecord[];
  }> {
    try {
      const [agentRows, telemetryRows] = await Promise.all([
        db.select().from(censusAgents).orderBy(desc(censusAgents.updatedAt)).limit(50),
        db.select().from(censusTelemetry).orderBy(desc(censusTelemetry.recordedAt)).limit(50),
      ]);

      return {
        agents: agentRows.map((r) => ({
          id: r.id,
          agent_name: r.agentName,
          lifecycle_status: r.lifecycleStatus as AgentRegistration['lifecycle_status'],
          metadata: (r.metadata as Record<string, any>) || {},
          created_at: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
          updated_at: r.updatedAt ? new Date(r.updatedAt).toISOString() : new Date().toISOString(),
        })),
        telemetry: telemetryRows.map((t) => ({
          id: t.id,
          agent_id: t.agentId || '',
          metric_type: t.metricType,
          payload: (t.payload as Record<string, any>) || {},
          severity: t.severity as TelemetryPayload['severity'],
          recorded_at: t.recordedAt ? new Date(t.recordedAt).toISOString() : new Date().toISOString(),
        })),
      };
    } catch (error) {
      console.error('Database query failed in listAgentsAndTelemetry:', error);
      throw new Error('Failed to query census_agents and census_telemetry.', { cause: error });
    }
  }

  public async updateAgentLifecycleStatus(
    agentId: string,
    status: 'INITIALIZING' | 'ACTIVE' | 'SUSPENDED' | 'TERMINATED'
  ): Promise<CensusAgentRecord> {
    try {
      const updated = await db
        .update(censusAgents)
        .set({
          lifecycleStatus: status,
          updatedAt: new Date(),
        })
        .where(eq(censusAgents.id, agentId))
        .returning();

      if (!updated.length) {
        throw new Error('Agent ID not found in public.census_agents.');
      }

      const row = updated[0];
      return {
        id: row.id,
        agent_name: row.agentName,
        lifecycle_status: row.lifecycleStatus as AgentRegistration['lifecycle_status'],
        metadata: (row.metadata as Record<string, any>) || {},
        created_at: row.createdAt ? new Date(row.createdAt).toISOString() : new Date().toISOString(),
        updated_at: row.updatedAt ? new Date(row.updatedAt).toISOString() : new Date().toISOString(),
      };
    } catch (error) {
      console.error('Database query failed in updateAgentLifecycleStatus:', error);
      throw new Error('Failed to update agent lifecycle status.', { cause: error });
    }
  }

  public async fetchActiveCensusMetrics(): Promise<
    Array<{
      id: string;
      agent_name: string;
      lifecycle_status: AgentRegistration['lifecycle_status'];
      updated_at: string;
    }>
  > {
    if (this.supabase) {
      const { data, error } = await this.supabase
        .from('census_agents')
        .select('id, agent_name, lifecycle_status, updated_at')
        .order('updated_at', { ascending: false });

      if (!error && data) {
        return data as Array<{
          id: string;
          agent_name: string;
          lifecycle_status: AgentRegistration['lifecycle_status'];
          updated_at: string;
        }>;
      }
    }

    try {
      const rows = await db
        .select({
          id: censusAgents.id,
          agentName: censusAgents.agentName,
          lifecycleStatus: censusAgents.lifecycleStatus,
          updatedAt: censusAgents.updatedAt,
        })
        .from(censusAgents)
        .orderBy(desc(censusAgents.updatedAt));

      return rows.map((r) => ({
        id: r.id,
        agent_name: r.agentName,
        lifecycle_status: r.lifecycleStatus as AgentRegistration['lifecycle_status'],
        updated_at: r.updatedAt ? new Date(r.updatedAt).toISOString() : new Date().toISOString(),
      }));
    } catch (error) {
      console.error('Database query failed in fetchActiveCensusMetrics:', error);
      throw new Error('Failed to query census metrics.', { cause: error });
    }
  }

  public async shutdown(): Promise<void> {
    if (this.supabase) {
      await this.supabase.removeAllChannels();
    }
  }
}

export const defaultOrchestrator = new AutonomousOrchestrator(
  process.env.SUPABASE_URL || 'https://wvhjcxxfslzkechhoolz.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);
