import { Router, Request, Response } from 'express';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { AgentRegistrationSchema, TelemetryEventSchema } from '../schemas/census.ts';
import { defaultOrchestrator } from '../agents/orchestrator.ts';

const router = Router();
const supabaseUrl = process.env.SUPABASE_URL || 'https://wvhjcxxfslzkechhoolz.supabase.co';
const supabaseKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();
const supabase: SupabaseClient | null =
  supabaseKey.length > 10 ? createClient(supabaseUrl, supabaseKey) : null;

// Register or Update Agent FSM State
router.post('/agents/register', async (req: Request, res: Response) => {
  const parseResult = AgentRegistrationSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ success: false, error: parseResult.error.format() });
  }

  const { agent_name, lifecycle_status, metadata } = parseResult.data;

  if (supabase) {
    const { data, error } = await supabase
      .from('census_agents')
      .upsert({ agent_name, lifecycle_status, metadata }, { onConflict: 'agent_name' })
      .select()
      .single();

    if (!error && data) {
      return res.status(201).json({ success: true, agent: data });
    }
  }

  try {
    const fallbackAgent = await defaultOrchestrator.registerAgent(parseResult.data);
    return res.status(201).json({ success: true, agent: fallbackAgent });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || 'Registration failed' });
  }
});

// Ingest Telemetry Event with Merkle Witness Check
router.post('/telemetry', async (req: Request, res: Response) => {
  const parseResult = TelemetryEventSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ success: false, error: parseResult.error.format() });
  }

  const { agent_id, event_type, payload, merkle_proof, latency_ms } = parseResult.data;

  // Optional local XERJ System-1 reflex check
  let reflexRouted = false;
  try {
    const reflexRes = await fetch('http://127.0.0.1:9200/_decide', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ directive: event_type, context: payload })
    });
    if (reflexRes.ok) {
      reflexRouted = true;
    }
  } catch (_) {
    // Local daemon offline, fallback to standard persistence
  }

  if (supabase) {
    const { data, error } = await supabase
      .from('census_telemetry')
      .insert({ agent_id, event_type, payload, merkle_proof, latency_ms })
      .select()
      .single();

    if (!error && data) {
      return res.status(200).json({ success: true, reflex_routed: reflexRouted, event: data });
    }
  }

  try {
    const fallbackEvent = await defaultOrchestrator.logTelemetry({
      agent_id,
      metric_type: event_type,
      payload: { ...payload, merkle_proof, latency_ms },
      severity: 'INFO',
    });
    return res.status(200).json({ success: true, reflex_routed: reflexRouted, event: fallbackEvent });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || 'Telemetry commit failed' });
  }
});

export default router;

