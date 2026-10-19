import { relations } from 'drizzle-orm';
import { index, integer, jsonb, pgTable, serial, text, timestamp, uuid } from 'drizzle-orm/pg-core';

// Define the 'users' table linking Firebase Auth UID to relational record
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Define the 'workspace_records' table to persist Gmail and Google Docs activity
export const workspaceRecords = pgTable('workspace_records', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  itemType: text('item_type').notNull(), // 'gmail' | 'docs' | 'telemetry'
  title: text('title').notNull(),
  externalId: text('external_id'),
  snippet: text('snippet'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Define the grounded 'agents' table for Physical AI Census registry (SPIFFE identity spine)
export const agents = pgTable('agents', {
  id: serial('id').primaryKey(),
  spiffeId: text('spiffe_id').notNull().unique(),
  canonicalName: text('canonical_name').notNull(),
  ecosystem: text('ecosystem').notNull(), // 'cloud_gcp', 'mcp_universe', 'cicd_github', 'robotics_ros2'
  agentType: text('agent_type').notNull(), // 'llm_tool_agent', 'ci_runner_bot', 'mcp_tool_worker', etc.
  status: text('status').notNull().default('active'), // 'active', 'latent', 'ephemeral'
  lastSeenAt: timestamp('last_seen_at').defaultNow(),
  sourceOrigin: text('source_origin').notNull(),
  svidFingerprint: text('svid_fingerprint').notNull(),
  totalInvocations: integer('total_invocations').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

// Define the 'agent_telemetry_events' table for live immutable stream logs
export const agentTelemetryEvents = pgTable('agent_telemetry_events', {
  id: serial('id').primaryKey(),
  agentId: text('agent_id').notNull(),
  eventType: text('event_type').notNull(), // 'HEARTBEAT', 'TOOL_INVOCATION', 'BIRTH', 'SAFETY_TRIP'
  ecosystem: text('ecosystem').notNull(),
  summary: text('summary').notNull(),
  latencyMs: integer('latency_ms').default(0),
  payloadJson: text('payload_json'),
  createdAt: timestamp('created_at').defaultNow(),
});

// ============================================================================
// PART I: SOVEREIGN INFINITY AI CENSUS — SUPABASE / POSTGRESQL MASTER TABLES
// Reconciled with supabase/migrations/20261019000000_sovereign_infinity_census.sql
// ============================================================================

// 1. Agent Registries & Lifecycles (public.census_agents)
export const censusAgents = pgTable(
  'census_agents',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    agentName: text('agent_name').notNull().unique(),
    lifecycleStatus: text('lifecycle_status').notNull().default('INITIALIZING'), // 'INITIALIZING' | 'ACTIVE' | 'SUSPENDED' | 'TERMINATED'
    metadata: jsonb('metadata').$type<Record<string, any>>().default({}).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index('idx_agents_status').on(table.lifecycleStatus)]
);

// 2. Telemetry & Metric Streams (public.census_telemetry)
export const censusTelemetry = pgTable(
  'census_telemetry',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    agentId: uuid('agent_id')
      .references(() => censusAgents.id, { onDelete: 'cascade' })
      .notNull(),
    metricType: text('metric_type').notNull(),
    payload: jsonb('payload').$type<Record<string, any>>().default({}).notNull(),
    severity: text('severity').notNull().default('INFO'), // 'INFO' | 'WARN' | 'ERROR' | 'CRITICAL'
    recordedAt: timestamp('recorded_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('idx_telemetry_agent_id').on(table.agentId),
    index('idx_telemetry_recorded_at').on(table.recordedAt),
  ]
);

export const usersRelations = relations(users, ({ many }) => ({
  records: many(workspaceRecords),
}));

export const workspaceRecordsRelations = relations(workspaceRecords, ({ one }) => ({
  user: one(users, {
    fields: [workspaceRecords.userId],
    references: [users.id],
  }),
}));

export const censusAgentsRelations = relations(censusAgents, ({ many }) => ({
  telemetry: many(censusTelemetry),
}));

export const censusTelemetryRelations = relations(censusTelemetry, ({ one }) => ({
  agent: one(censusAgents, {
    fields: [censusTelemetry.agentId],
    references: [censusAgents.id],
  }),
}));
