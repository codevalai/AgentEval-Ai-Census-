/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * EXECUTABLE PROCESSING SCRIPT
 * Ties Zero-Auth CDN endpoint directly into compiler loop for local execution,
 * persists records to SQLite / Supabase, and compiles XERJ Lane A manifests.
 */

import { TrendshiftHarvesterService } from '../services/trendshiftHarvester.ts';
import { XerjHubBridgeService } from '../services/xerjHubBridge.ts';

export async function executeHarvesterPipeline() {
  console.log('[Sovereign Radar] Initiating zero-cost ecosystem sweep via Quantavil CDN...');

  const harvester = new TrendshiftHarvesterService();
  const bridge = new XerjHubBridgeService();

  try {
    // Pull daily Python, TypeScript, and Rust breakout feeds
    const pythonRepos = await harvester.fetchTrendingRepos('daily', 'python');
    const tsRepos = await harvester.fetchTrendingRepos('daily', 'typescript');
    const rustRepos = await harvester.fetchTrendingRepos('daily', 'rust');

    const allRepos = [...pythonRepos, ...tsRepos, ...rustRepos];
    console.log(`[Sovereign Radar] Fetched ${allRepos.length} total records from CDN. Running ingestion...`);

    // 1. Ingest to SQLite & XERJ memory
    const ingestionResult = await harvester.ingestToSupabaseAndXerj(allRepos);
    console.log(`[SQLite/Substrate] Successfully upserted ${ingestionResult.insertedCount} records.`);

    // 2. Generate local Lane A XERJ Hub manifests
    const bridgeResult = bridge.processEcosystemBatch(allRepos);
    console.log(`[XERJ Hub] Compiled ${bridgeResult.generatedCount} Lane A manifests into tools/xerj-code/hub/`);

    console.log('[Sovereign Radar] Pipeline execution complete.');
    return {
      totalRepos: allRepos.length,
      insertedCount: ingestionResult.insertedCount,
      manifestsCount: bridgeResult.generatedCount,
    };
  } catch (error: any) {
    console.error('[Sovereign Radar] Pipeline encountered a fatal exception:', error.message);
    throw error;
  }
}

// Execute directly if run via CLI
if (import.meta.url === `file://${process.argv[1]}`) {
  executeHarvesterPipeline().catch((err) => {
    console.error('Fatal execution error:', err);
    process.exit(1);
  });
}
