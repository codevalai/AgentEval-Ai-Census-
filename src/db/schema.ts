import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

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

export const usersRelations = relations(users, ({ many }) => ({
  records: many(workspaceRecords),
}));

export const workspaceRecordsRelations = relations(workspaceRecords, ({ one }) => ({
  user: one(users, {
    fields: [workspaceRecords.userId],
    references: [users.id],
  }),
}));
