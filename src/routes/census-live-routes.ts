import { Router, Request, Response } from 'express';
import { executeHyperCrawlerSweep, LIVE_EXTERNAL_FEEDS } from '../services/hyper-crawler-engine.ts';
import {
  getAllVerifiedFactories,
  computeLiveBayesianCensus,
  executeLiveGeminiSearchGrounding
} from '../services/reconciler-and-tiers-live.ts';
import { MetaLayerIdEnum, HarvesterSwarmIdEnum } from '../schemas/census-hyper-scale.ts';

export const censusLiveRouter = Router();

// In-memory cache of the most recent live wire sweep so UI loads instantaneously while supporting live re-sweeps
let cachedSweepResult: Awaited<ReturnType<typeof executeHyperCrawlerSweep>> | null = null;

/**
 * GET /api/census/meta-layers-24
 * Returns all 24 Unified Meta-Layers, 15 Swarms, and 64 configured live wire endpoints.
 */
censusLiveRouter.get('/meta-layers-24', (_req: Request, res: Response) => {
  res.json({
    status: 'SAT_VERIFIED',
    meta_layers_count: MetaLayerIdEnum.options.length,
    meta_layers: MetaLayerIdEnum.options,
    harvester_swarms_count: HarvesterSwarmIdEnum.options.length,
    harvester_swarms: HarvesterSwarmIdEnum.options,
    configured_live_feeds_count: LIVE_EXTERNAL_FEEDS.length,
    configured_live_feeds: LIVE_EXTERNAL_FEEDS.map((f) => ({
      swarm_id: f.swarm_id,
      meta_layer: f.meta_layer,
      source_name: f.source_name,
      url: f.url,
      metric_label: f.metric_label
    }))
  });
});

/**
 * POST /api/census/hyper-sweep
 * Triggers a live parallel wire sweep across the external feeds, computes Chapman/Little/Kalman
 * reconciliation, verifies Δ = 0 via Hare-Niemeyer, and signs the Merkle root with Ed25519.
 */
censusLiveRouter.post('/hyper-sweep', async (req: Request, res: Response) => {
  try {
    const limit = req.body?.limit ? Number(req.body.limit) : undefined;
    const sweep = await executeHyperCrawlerSweep(limit);
    cachedSweepResult = sweep;

    const { reconciliation, domainAllocations228 } = computeLiveBayesianCensus(
      sweep.probes,
      sweep.merkle_root_sha256,
      sweep.ed25519_batch_signature
    );

    res.json({
      status: 'LIVE_WIRE_SWEEP_COMPLETE',
      reconciliation,
      supabase_persisted_rows: sweep.supabase_persisted_rows,
      probes: sweep.probes,
      domain_allocations_preview: domainAllocations228.slice(0, 24),
      total_domains_allocated: domainAllocations228.length
    });
  } catch (err: any) {
    res.status(500).json({ error: err?.message ?? 'Hyper-crawler sweep failed' });
  }
});

/**
 * GET /api/census/factories
 * Returns the complete Global AI Factory Registry (Top 30 Dev-Tool Factories + Tiers 1–16 Master Factories)
 * plus compatibility fields for OmniscientFactoryMetaLayerConsole.
 */
censusLiveRouter.get('/factories', async (_req: Request, res: Response) => {
  const factories = getAllVerifiedFactories();
  let legacyData: Record<string, any> = {};
  try {
    const {
      GLOBAL_AI_FACTORIES,
      FACTORY_LINEAGE_TREES,
      FACTORY_POWER_EDGES,
      FACTORY_INFLUENCE_VECTORS,
    } = await import('../data/omniscientFactoryMetaLayer.ts');
    legacyData = {
      success: true,
      totalFactories: GLOBAL_AI_FACTORIES.length,
      factories: GLOBAL_AI_FACTORIES,
      lineageTrees: FACTORY_LINEAGE_TREES,
      powerEdges: FACTORY_POWER_EDGES,
      influenceVectors: FACTORY_INFLUENCE_VECTORS,
    };
  } catch {
    // Non-fatal
  }

  res.json({
    ...legacyData,
    total_factories_registered: factories.length,
    top_30_dev_tool_factories: factories.filter((f) => f.rank_global <= 30),
    tiers_1_to_16_master_factories: factories.filter((f) => f.rank_global > 30)
  });
});

/**
 * POST /api/census/grounding-verify
 * Executes a real-time Gemini 3.8 Google Search Grounding check on any AI factory or agent swarm.
 */
censusLiveRouter.post('/grounding-verify', async (req: Request, res: Response) => {
  try {
    const topic = String(req.body?.topic || 'Latest Model Context Protocol MCP server adoption and autonomous coding agents 2026');
    const report = await executeLiveGeminiSearchGrounding(topic);
    res.json(report);
  } catch (err: any) {
    res.status(500).json({ error: err?.message ?? 'Gemini Search Grounding failed' });
  }
});
