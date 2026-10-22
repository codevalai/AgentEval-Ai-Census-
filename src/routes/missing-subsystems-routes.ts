import { Router, Request, Response } from 'express';
import {
  executeXerjSystem1Decide,
  acquireXerjFencingLease,
  linkAndQueryXerjGraph
} from '../services/xerj-zenith-engine.ts';
import {
  inspectLiveDomainTlsAndWellKnown,
  executeFormalInvariantsAndCryptoTiming
} from '../services/tls-wellknown-and-pqc.ts';
import {
  syncSovereign300FromGitHubLive,
  SOVEREIGN_300_DISCIPLINES,
  verifySovereign300AcyclicDag
} from '../services/sovereign-300-github-sync.ts';

export const sovereignSubsystemsRouter = Router();

/**
 * 1. XERJ SYSTEM-1 REFLEX & MONOTONIC LEASE ENDPOINTS
 */
sovereignSubsystemsRouter.post('/xerj/decide', async (req: Request, res: Response) => {
  const query = String(req.body?.query || 'Verify global MCP agent population invariants');
  const decision = await executeXerjSystem1Decide(query);
  res.json(decision);
});

sovereignSubsystemsRouter.post('/xerj/lease', async (req: Request, res: Response) => {
  const agentId = String(req.body?.agent_id || 'agent-sovereign-worker-01');
  const lease = await acquireXerjFencingLease(agentId, Number(req.body?.ttl_seconds || 60));
  res.json(lease);
});

sovereignSubsystemsRouter.post('/xerj/graph-link', async (req: Request, res: Response) => {
  const { source, relation, target } = req.body || {};
  const link = await linkAndQueryXerjGraph(
    String(source || 'factory:anthropic'),
    String(relation || 'SPAWNS_PROTOCOL'),
    String(target || 'protocol:mcp')
  );
  res.json(link);
});

/**
 * 2. LIVE TLS X.509 & .WELL-KNOWN/MCP.JSON DOMAIN INSPECTOR
 */
sovereignSubsystemsRouter.post('/security/inspect-domain', async (req: Request, res: Response) => {
  const domain = String(req.body?.domain || 'huggingface.co');
  const audit = await inspectLiveDomainTlsAndWellKnown(domain);
  res.json(audit);
});

/**
 * 3. REAL NANOSECOND CRYPTO TIMING & SMT-LIB2 FORMAL INVARIANT PROVER
 */
sovereignSubsystemsRouter.get('/security/formal-and-pqc-benchmark', (req: Request, res: Response) => {
  const pop = req.query.population ? Number(req.query.population) : 837445778;
  const result = executeFormalInvariantsAndCryptoTiming(pop);
  res.json(result);
});

/**
 * 4. THE SOVEREIGN 300 REPOSITORIES LIVE SYNC & DAG VERIFICATION ENDPOINTS
 */
sovereignSubsystemsRouter.get('/sovereign-300/catalog', (_req: Request, res: Response) => {
  res.json({
    total_disciplines: SOVEREIGN_300_DISCIPLINES.length,
    total_repositories: 300,
    dag_verification: verifySovereign300AcyclicDag(),
    disciplines: SOVEREIGN_300_DISCIPLINES
  });
});

sovereignSubsystemsRouter.post('/sovereign-300/sync-live', async (req: Request, res: Response) => {
  try {
    const disciplineFilter = req.body?.discipline_id ? String(req.body.discipline_id) : undefined;
    const limit = req.body?.limit ? Number(req.body.limit) : undefined;
    const syncReport = await syncSovereign300FromGitHubLive({ disciplineFilter, limit });
    res.json(syncReport);
  } catch (e: any) {
    res.status(500).json({ error: e?.message || 'Sovereign 300 sync failed' });
  }
});
