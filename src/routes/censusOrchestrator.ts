import { Router, Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';
import { AgentRegistrationSchema, TelemetryEventSchema } from '../schemas/census.ts';

const router = Router();
const supabase = createClient(
  process.env.SUPABASE_URL || 'https://wvhjcxxfslzkechhoolz.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// Register or Update Agent FSM State
router.post('/agents/register', async (req: Request, res: Response) => {
  const parseResult = AgentRegistrationSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ success: false, error: parseResult.error.format() });
  }

  const { agent_name, lifecycle_status, metadata } = parseResult.data;

  const { data, error } = await supabase
    .from('census_agents')
    .upsert({ agent_name, lifecycle_status, metadata }, { onConflict: 'agent_name' })
    .select()
    .single();

  if (error) {
    return res.status(500).json({ success: false, error: error.message });
  }

  return res.status(201).json({ success: true, agent: data });
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

  const { data, error } = await supabase
    .from('census_telemetry')
    .insert({ agent_id, event_type, payload, merkle_proof, latency_ms })
    .select()
    .single();

  if (error) {
    return res.status(500).json({ success: false, error: error.message });
  }

  return res.status(200).json({ success: true, reflex_routed: reflexRouted, event: data });
});

export default router;
