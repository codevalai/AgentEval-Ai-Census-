/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * PART IV: HIGH-CONCURRENCY EXPRESS & TELEMETRY API (src/server.ts)
 * Express gateway wiring routes with error isolation, Zod runtime validation,
 * and Supabase (wvhjcxxfslzkechhoolz) / Cloud SQL PostgreSQL persistence.
 */

import express, { Request, Response } from 'express';
import { AutonomousOrchestrator } from './agents/orchestrator.ts';

export const app = express();
app.use(express.json());

export const orchestrator = new AutonomousOrchestrator(
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
    const record = await orchestrator.logTelemetry(req.body);
    return res.status(202).json({ success: true, status: 'committed', data: record });
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

app.get('/api/census/orchestrator', async (_req: Request, res: Response) => {
  try {
    const state = await orchestrator.listAgentsAndTelemetry();
    return res.status(200).json({
      success: true,
      connection: orchestrator.getConnectionMetadata(),
      ...state,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

if (import.meta.url === `file://${process.argv[1]}`) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Sovereign Infinity AI Census Engine active on port ${PORT}`);
  });
}
