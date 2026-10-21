/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * SOVEREIGN ECOSYSTEM DAEMON SCHEDULER (src/jobs/daemonScheduler.ts)
 * Long-running background daemon synchronizing live developer momentum,
 * Trendshift CDN snapshots, Supabase telemetry, and XERJ Lane A manifests every 4 hours.
 */

import { TrendshiftEcosystemHarvester } from '../services/trendshiftEcosystemHarvester.ts';

const INTERVAL_MS = 1000 * 60 * 60 * 4; // Run every 4 hours

export async function startEcosystemDaemon() {
  const harvester = new TrendshiftEcosystemHarvester();
  console.log('[Sovereign Daemon] Background ecosystem telemetry watcher initialized.');

  const runSweep = async () => {
    try {
      console.log('[Sovereign Daemon] Triggering scheduled ecosystem sweep...');
      const metrics = await harvester.fetchAndIngestEcosystem('daily', ['python', 'typescript', 'rust', 'go']);
      console.log('[Sovereign Daemon] Sweep successful:', metrics);
    } catch (err: any) {
      console.error('[Sovereign Daemon] Sweep failed with exception:', err.message);
    }
  };

  // Initial execution on boot
  await runSweep();

  // Recurring loop
  setInterval(runSweep, INTERVAL_MS);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  startEcosystemDaemon();
}
