import { Router, Request, Response } from 'express';
import {
  SOVEREIGN_GUARDRAIL_MAP_7_LAYERS,
  AGENT_CAPABILITY_PROFILES,
  SWARM_DRIFT_POLICIES,
  computeSacredFilesMerkleAttestation,
  getRecentAnomalyEvents,
  evaluateAgentActionGuardrail,
  evaluatePullRequestGuardian
} from '../services/sovereign-guardrail-spine.ts';

export const guardrailRouter = Router();

/**
 * GET /api/guardrails/state
 * Returns the complete 7-Layer Guardrail Map, 6 Agent Capability Profiles,
 * 6 Swarm Drift Detection Rules, Live Sacred Files SHA-256 Merkle Attestation,
 * and recent Anomaly Events.
 */
guardrailRouter.get('/state', (_req: Request, res: Response) => {
  const attestation = computeSacredFilesMerkleAttestation();
  res.json({
    status: 'SOVEREIGN_GUARDRAIL_SPINE_ACTIVE',
    guardrail_map_7_layers: SOVEREIGN_GUARDRAIL_MAP_7_LAYERS,
    capability_profiles_6: AGENT_CAPABILITY_PROFILES,
    swarm_drift_rules_6: SWARM_DRIFT_POLICIES,
    sacred_files_attestation: attestation,
    recent_anomalies: getRecentAnomalyEvents()
  });
});

/**
 * POST /api/guardrails/evaluate-action
 * Simulates or enforces real-time XERJ Behavioral Guardrails & Swarm Drift Detection Rules.
 */
guardrailRouter.post('/evaluate-action', async (req: Request, res: Response) => {
  try {
    const body = req.body || {};
    const result = await evaluateAgentActionGuardrail({
      actor_id: String(body.actor_id || 'swarm-harvester-node-04'),
      profile_id: body.profile_id || 'SWARM_HARVESTER',
      target_surface: String(body.target_surface || '/api/census/hyper-sweep'),
      http_method: body.http_method || 'POST',
      call_rate_rps: Number(body.call_rate_rps ?? 8.5),
      enclave_memory_kb: Number(body.enclave_memory_kb ?? 48),
      pqc_signature_valid: Boolean(body.pqc_signature_valid ?? true),
      ssot_delta: Number(body.ssot_delta ?? 0),
      payload_valid_zod: Boolean(body.payload_valid_zod ?? true)
    });
    res.json({
      ...result,
      recent_anomalies: getRecentAnomalyEvents()
    });
  } catch (err: any) {
    res.status(400).json({ error: err?.message || 'Failed to evaluate guardrail action' });
  }
});

/**
 * POST /api/guardrails/evaluate-pr
 * Evaluates a Pull Request against the Critical File Guardian & Constitutional Court CI rules.
 */
guardrailRouter.post('/evaluate-pr', async (req: Request, res: Response) => {
  try {
    const result = await evaluatePullRequestGuardian(req.body);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err?.message || 'Failed to evaluate PR guardian rules' });
  }
});
