/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * SOVEREIGN COORDINATION PARLIAMENT & CONSTITUTIONAL GOVERNANCE ROUTES
 */

import { Router, Request, Response } from 'express';
import {
  arbitrateXerjAction,
  getXerjPolicies,
  getXerjArbitrationEvents,
  appendAuditEvent,
  verifyAuditLedger,
  getAuditEvents,
  getAuditRoots,
  getCivilizationAtlas,
  getCivilizationForecasts,
  getSovereignPolicies,
  applySovereignPolicy,
  resolveCoordinationConflict,
  getCoordinationDecisions,
  getDiplomacyRelations,
  proposeTreaty,
  activateTreaty,
  getTemporalRules,
  validateTemporalAction,
  getTemporalForecastOverview,
  proposeQuorumDecision,
  voteQuorumDecision,
  getQuorumDecisions,
  getStewards,
  getQuorumPolicies,
  getFullParliamentState,
} from '../services/sovereign-governance-engine.ts';

export const governanceRouter = Router();

// 0. Full Constitutional Parliament State
governanceRouter.get('/sovereign/parliament-state', (req: Request, res: Response) => {
  try {
    const liveActive = req.query.liveActive ? Number(req.query.liveActive) : undefined;
    const state = getFullParliamentState(liveActive);
    return res.status(200).json({ ok: true, ...state });
  } catch (err: any) {
    return res.status(500).json({ ok: false, error: err?.message || 'Failed to fetch parliament state' });
  }
});

// 1. XERJ Arbitration Mesh
governanceRouter.post('/xerj/arbitrate', async (req: Request, res: Response) => {
  try {
    const event = await arbitrateXerjAction({
      actor_id: req.body.actor_id || 'agent-worker-01',
      actor_capability_profile: req.body.actor_capability_profile || req.body.actorcapabilityprofile || 'ORCHESTRATOR_NODE',
      action_type: req.body.action_type || req.body.actiontype || 'TOOL_CALL',
      surface: req.body.surface || 'SOVEREIGN_CLOUD',
      target_resource: req.body.target_resource || 'tool:http_probe:github',
      payload_summary: req.body.payload_summary || {},
    });
    return res.status(200).json({
      ok: true,
      decision: event.decision,
      decision_tier: event.decision_tier,
      fencing_token: event.fencing_token,
      merkle_hash: event.merkle_hash,
      signature: event.signature,
      event,
    });
  } catch (err: any) {
    return res.status(400).json({ ok: false, error: err?.message || 'XERJ arbitration failed' });
  }
});

governanceRouter.get('/xerj/policies', (req: Request, res: Response) => {
  try {
    const policies = getXerjPolicies({
      scope: req.query.scope as string | undefined,
      actor_capability_profile:
        (req.query.actor_capability_profile as string | undefined) ||
        (req.query.actorcapabilityprofile as string | undefined),
      resource_pattern: req.query.resource_pattern as string | undefined,
    });
    return res.status(200).json({
      ok: true,
      policies,
      recent_events: getXerjArbitrationEvents(25),
    });
  } catch (err: any) {
    return res.status(500).json({ ok: false, error: err?.message || 'Failed to list XERJ policies' });
  }
});

// 2. Cross-Ecosystem Audit Ledger & Merkle Spine
governanceRouter.post('/audit/append', (req: Request, res: Response) => {
  try {
    const result = appendAuditEvent({
      ecosystem: req.body.ecosystem || 'Sovereign Infinity Protocol',
      actor_id: req.body.actor_id || 'system-auditor-01',
      actor_type: req.body.actor_type || 'SYSTEM',
      event_type: req.body.event_type || 'MANUAL_AUDIT_ATTESTATION',
      payload: req.body.payload || {},
    });
    return res.status(201).json({ ok: true, ...result });
  } catch (err: any) {
    return res.status(400).json({ ok: false, error: err?.message || 'Failed to append audit event' });
  }
});

governanceRouter.get('/audit/verify', (req: Request, res: Response) => {
  try {
    const verification = verifyAuditLedger({
      event_id: req.query.event_id as string | undefined,
      epoch: req.query.epoch ? Number(req.query.epoch) : undefined,
    });
    return res.status(200).json({
      ok: true,
      ...verification,
      events: getAuditEvents(25),
      roots: getAuditRoots(10),
    });
  } catch (err: any) {
    return res.status(500).json({ ok: false, error: err?.message || 'Audit verification failed' });
  }
});

// 3. AI Civilization Atlas & Predictive Census
governanceRouter.get('/civilization/atlas', (req: Request, res: Response) => {
  try {
    const atlas = getCivilizationAtlas({
      platform: req.query.platform as string | undefined,
      tier: req.query.tier as 'AI' | 'AGI' | 'ASI' | 'APEX' | undefined,
      region: req.query.region as string | undefined,
      domain: req.query.domain as string | undefined,
      liveActiveOverride: req.query.liveActive ? Number(req.query.liveActive) : undefined,
    });
    return res.status(200).json({ ok: true, ...atlas });
  } catch (err: any) {
    return res.status(500).json({ ok: false, error: err?.message || 'Civilization atlas query failed' });
  }
});

governanceRouter.get('/civilization/forecast', (req: Request, res: Response) => {
  try {
    const horizon = ((req.query.horizon as string) || '7D') as '24H' | '7D' | '30D' | '1Y';
    const forecast = getCivilizationForecasts(horizon);
    return res.status(200).json({ ok: true, ...forecast });
  } catch (err: any) {
    return res.status(500).json({ ok: false, error: err?.message || 'Civilization forecast failed' });
  }
});

// 4. Sovereign Coordination Engine (SCE)
governanceRouter.get('/sovereign/policies', (req: Request, res: Response) => {
  try {
    const policies = getSovereignPolicies(req.query.scope as string | undefined);
    const decisions = getCoordinationDecisions(25);
    return res.status(200).json({ ok: true, policies, decisions });
  } catch (err: any) {
    return res.status(500).json({ ok: false, error: err?.message || 'Failed to fetch sovereign policies' });
  }
});

governanceRouter.post('/sovereign/policies/apply', async (req: Request, res: Response) => {
  try {
    const decision = await applySovereignPolicy({
      policy_code: req.body.policy_code || 'SCE-POP-001',
      target: req.body.target || 'global-asi-spawn-pipeline',
      decision_type: req.body.decision_type,
      parameters: req.body.parameters || {},
      actor_id: req.body.actor_id,
    });
    return res.status(200).json({ ok: true, decision });
  } catch (err: any) {
    return res.status(400).json({ ok: false, error: err?.message || 'Failed to apply sovereign policy' });
  }
});

governanceRouter.post('/sovereign/resolve-conflict', async (req: Request, res: Response) => {
  try {
    const resolution = await resolveCoordinationConflict({
      candidate_decisions: req.body.candidate_decisions || [],
    });
    return res.status(200).json({ ok: true, ...resolution });
  } catch (err: any) {
    return res.status(400).json({ ok: false, error: err?.message || 'Conflict resolution failed' });
  }
});

// 5. AI Ecosystem Diplomacy Layer
governanceRouter.get('/diplomacy/relations', (_req: Request, res: Response) => {
  try {
    const data = getDiplomacyRelations();
    return res.status(200).json({ ok: true, ...data });
  } catch (err: any) {
    return res.status(500).json({ ok: false, error: err?.message || 'Failed to fetch diplomacy relations' });
  }
});

governanceRouter.post('/diplomacy/treaties/propose', (req: Request, res: Response) => {
  try {
    const treaty = proposeTreaty({
      treaty_code: req.body.treaty_code || `TRT-2026-${Date.now().toString().slice(-4)}`,
      title: req.body.title || 'Inter-Ecosystem Cryptographic Telemetry Accord',
      ecosystems: req.body.ecosystems,
      clauses: req.body.clauses || { require_ed25519: true, max_enclave_kb: 64 },
    });
    return res.status(201).json({ ok: true, treaty });
  } catch (err: any) {
    return res.status(400).json({ ok: false, error: err?.message || 'Failed to propose treaty' });
  }
});

governanceRouter.post('/diplomacy/treaties/activate', (req: Request, res: Response) => {
  try {
    const treaty = activateTreaty({
      treaty_id: req.body.treaty_id,
      treaty_code: req.body.treaty_code,
      steward_signatures: req.body.steward_signatures,
    });
    return res.status(200).json({ ok: true, treaty });
  } catch (err: any) {
    return res.status(400).json({ ok: false, error: err?.message || 'Failed to activate treaty' });
  }
});

// 6. Temporal Constitution
governanceRouter.get('/temporal/rules', (_req: Request, res: Response) => {
  try {
    return res.status(200).json({ ok: true, rules: getTemporalRules() });
  } catch (err: any) {
    return res.status(500).json({ ok: false, error: err?.message || 'Failed to fetch temporal rules' });
  }
});

governanceRouter.post('/temporal/validate', (req: Request, res: Response) => {
  try {
    const result = validateTemporalAction({
      metric: req.body.metric || 'asi_apex_growth_rate_pct',
      observed_value: Number(req.body.observed_value ?? 3.2),
      horizon: req.body.horizon,
      actor_id: req.body.actor_id,
    });
    return res.status(200).json({ ok: true, ...result });
  } catch (err: any) {
    return res.status(400).json({ ok: false, error: err?.message || 'Temporal validation failed' });
  }
});

governanceRouter.get('/temporal/forecast', (req: Request, res: Response) => {
  try {
    const horizon = ((req.query.horizon as string) || '7D') as '24H' | '7D' | '30D' | '1Y';
    const data = getTemporalForecastOverview(horizon);
    return res.status(200).json({ ok: true, ...data });
  } catch (err: any) {
    return res.status(500).json({ ok: false, error: err?.message || 'Temporal forecast failed' });
  }
});

// 7. Planetary Safety Quorum
governanceRouter.get('/quorum/decisions', (_req: Request, res: Response) => {
  try {
    return res.status(200).json({
      ok: true,
      decisions: getQuorumDecisions(),
      stewards: getStewards(),
      policies: getQuorumPolicies(),
    });
  } catch (err: any) {
    return res.status(500).json({ ok: false, error: err?.message || 'Failed to fetch quorum decisions' });
  }
});

governanceRouter.post('/quorum/propose', (req: Request, res: Response) => {
  try {
    const decision = proposeQuorumDecision({
      action_type: req.body.action_type || 'SSOT_SCHEMA_OR_GUARDRAIL_MUTATION',
      target: req.body.target || 'public.civilization_slices',
      payload: req.body.payload || {},
      proposer_steward_id: req.body.proposer_steward_id,
    });
    return res.status(201).json({ ok: true, decision });
  } catch (err: any) {
    return res.status(400).json({ ok: false, error: err?.message || 'Failed to propose quorum decision' });
  }
});

governanceRouter.post('/quorum/vote', (req: Request, res: Response) => {
  try {
    const result = voteQuorumDecision({
      decision_id: req.body.decision_id,
      steward_id: req.body.steward_id,
      approve: Boolean(req.body.approve),
      signature: req.body.signature,
    });
    return res.status(200).json({ ok: true, ...result });
  } catch (err: any) {
    return res.status(400).json({ ok: false, error: err?.message || 'Failed to record quorum vote' });
  }
});
