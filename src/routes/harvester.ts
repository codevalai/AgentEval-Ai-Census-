/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * ENHANCED HARVESTER CONTROLLER ROUTE
 * Ties CDN pull, SQLite / Supabase sync, and XERJ manifest builder together
 * into a single high-concurrency pipeline execution route.
 */

import { Router, Request, Response } from 'express';
import { TrendshiftHarvesterService } from '../services/trendshiftHarvester.ts';
import { XerjManifestSyncService } from '../services/xerjManifestSync.ts';
import { XerjHubBridgeService } from '../services/xerjHubBridge.ts';

const router = Router();
const harvester = new TrendshiftHarvesterService();
const manifestSync = new XerjManifestSyncService();
const hubBridge = new XerjHubBridgeService();

/**
 * POST /trendshift/sync-ecosystem
 * Triggers zero-cost ecosystem sweep via Quantavil CDN
 */
router.post('/trendshift/sync-ecosystem', async (req: Request, res: Response) => {
  const timeframe = (req.body?.timeframe as 'daily' | 'weekly' | 'monthly' | 'yearly') || 'daily';
  const language = (req.body?.language as string) || 'all';

  try {
    // 1. Fetch from Quantavil CDN
    const rawRepos = await harvester.fetchTrendingRepos(timeframe, language);

    // 2. Persist to SQLite / Supabase & register with XERJ local daemon
    const ingestionResult = await harvester.ingestToSupabaseAndXerj(rawRepos, timeframe, language);

    // 3. Generate XERJ Manifests for local indexing packs
    const manifestPaths = manifestSync.batchSyncManifests(rawRepos);
    const bridgeResult = hubBridge.processEcosystemBatch(rawRepos);

    return res.status(200).json({
      success: true,
      ecosystem_metrics: {
        timeframe,
        language,
        scanned: rawRepos.length,
        persisted_to_sqlite: ingestionResult.insertedCount,
      },
      manifests_generated: manifestPaths.length,
      lane_a_packs_compiled: bridgeResult.generatedCount,
      sample_commands: ingestionResult.xerjCommands.slice(0, 5),
      top_breakouts: rawRepos.slice(0, 5).map((r) => ({
        full_name: r.full_name,
        stars_gained: r.stars_gained,
        stars_total: r.stars_total,
        language: r.language,
        rank: r.rank,
      })),
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err.message || 'Ecosystem synchronization pipeline failed',
    });
  }
});

/**
 * GET /trendshift/trending
 * Returns trending snapshot records from SQLite
 */
router.get('/trendshift/trending', (req: Request, res: Response) => {
  const timeframe = (req.query?.timeframe as string) || 'daily';
  const language = (req.query?.language as string) || 'all';
  const limit = Math.min(Number(req.query?.limit) || 25, 100);

  const engine = harvester.getPipelineEngine();
  const rows = engine.getSnapshots(timeframe, language, limit);
  const stats = engine.getStats();

  return res.status(200).json({
    success: true,
    timeframe,
    language,
    count: rows.length,
    stats,
    records: rows,
  });
});

/**
 * GET /trendshift/stats
 */
router.get('/trendshift/stats', (_req: Request, res: Response) => {
  const engine = harvester.getPipelineEngine();
  return res.status(200).json({
    success: true,
    stats: engine.getStats(),
  });
});

export default router;
