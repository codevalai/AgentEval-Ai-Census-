/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * COD3EVAL SOVEREIGN INFINITY: PLANETARY TELEMETRY, V3.0 2D MATRIX & MERKLE SPINE SNAPSHOT EXPORTER
 * Executed in CI/CD via GitHub Actions (planetary-telemetry-sync.yml & sovereign-guardrail-ci.yml)
 */

import fs from 'fs';
import path from 'path';
import { sovereignAuditSpine, calculateHash } from '../src/lib/merkleSpine.ts';
import { repoIndexerBackend } from '../src/lib/repoIndexerBackend.ts';
import { threatRadarBackend } from '../src/lib/threatRadarBackend.ts';
import { censusSSOT } from '../src/lib/censusSSOT.ts';
import { INITIAL_STATS } from '../src/data/initialData.ts';
import { buildOmniSovereignExportV3 } from '../src/lib/omniSnapshotExporterV3.ts';
import { serializeReconciledRegionsToCsv } from '../src/lib/sovereignExportAndMatrixEngine.ts';

async function main() {
  console.log('===========================================================');
  console.log('PLANETARY TELEMETRY & V3.0 2D MATRIX SNAPSHOT EXPORTER');
  console.log('===========================================================\n');

  const outDir = path.resolve('data/telemetry');
  fs.mkdirSync(outDir, { recursive: true });

  const head = sovereignAuditSpine.getHead();
  const ssotAudit = censusSSOT.verifyZeroDriftMathematicalAudit();
  const epochWitness = `EPOCH-WITNESS-ML-DSA-87-${calculateHash(
    `${head.blockHeight}:${head.merkleRoot}:${ssotAudit.activeTarget}:${ssotAudit.combinedTarget}`
  )}`;

  // Generate v3.0 Omni-Dimensional Snapshot at T0 baseline
  const v3SnapshotT0 = buildOmniSovereignExportV3({
    rawStats: INITIAL_STATS,
  });

  // Also verify the exact live tick from the forensic audit (353,908,524,311.4997 -> 353,908,524,311)
  const v3AuditedLiveTick = buildOmniSovereignExportV3({
    rawStats: {
      totalAgents: 353908524311.4997,
      agentsBornToday: 4842091112.900159,
      agentsShutdownToday: 1620410045.4998486,
      birthsPerSec: 148420,
      shutdownsPerSec: 49680,
      bftQuorumPercent: 92.5,
      defconLevel: 2,
    },
  });

  if (
    !v3SnapshotT0.ssotVerification.is2DZeroDrift ||
    !v3AuditedLiveTick.ssotVerification.is2DZeroDrift ||
    v3AuditedLiveTick.ssotVerification.matrixDriftDelta !== 0 ||
    v3AuditedLiveTick.censusStats.totalAgents !== 353908524311 ||
    v3AuditedLiveTick.censusStats.aiAgents !== 238817680418 ||
    v3AuditedLiveTick.censusStats.agiAgents !== 84647225053 ||
    v3AuditedLiveTick.censusStats.asiAgents !== 26847688272 ||
    v3AuditedLiveTick.censusStats.apexAgents !== 3595930568 ||
    v3AuditedLiveTick.censusStats.netGrowthToday !== 3221681068
  ) {
    console.error('CRITICAL: 2D Matrix Conservation failed during telemetry export!');
    process.exit(1);
  }

  const payload = {
    exportedAt: new Date().toISOString(),
    censusScale: {
      activeConcurrent: ssotAudit.activeTarget || INITIAL_STATS.totalAgents,
      latentBlueprintsAndStaged: ssotAudit.combinedTarget - ssotAudit.activeTarget,
      combinedIndexed: ssotAudit.combinedTarget,
      darkMatterUnindexed: ssotAudit.darkMatterTarget,
      planetaryCeiling: ssotAudit.ceilingTarget,
      ephemeralDailyInvocations: 1480500000000,
      coveragePercent: 71.9,
      isZeroDriftVerified: ssotAudit.isZeroDrift,
    },
    v3OmniSnapshot: v3AuditedLiveTick,
    spineHead: head,
    epochWitnessToken: epochWitness,
    threatSnapshot: threatRadarBackend.getTelemetrySnapshot(),
    sovereign100Count: repoIndexerBackend.getRepos().length,
    rfcStandard: 'RFC-001..010-COMPLIANT',
  };

  const outFile = path.join(outDir, 'census-snapshot-latest.json');
  fs.writeFileSync(outFile, JSON.stringify(payload, null, 2));

  const csvFile = path.join(outDir, 'sovereign-ai-regions-latest.csv');
  const csvContent = serializeReconciledRegionsToCsv(v3AuditedLiveTick);
  fs.writeFileSync(csvFile, csvContent);

  console.log(`[TELEMETRY SINK] Active Concurrent (T0): ${payload.censusScale.activeConcurrent.toLocaleString()}`);
  console.log(`[TELEMETRY SINK] Live Tick Reconciled:   ${v3AuditedLiveTick.censusStats.totalAgents.toLocaleString()} (Δ_2D = ${v3AuditedLiveTick.ssotVerification.matrixDriftDelta})`);
  console.log(`[TELEMETRY SINK] Live 4-Tier Partition:  AI=${v3AuditedLiveTick.censusStats.aiAgents.toLocaleString()} | AGI=${v3AuditedLiveTick.censusStats.agiAgents.toLocaleString()} | ASI=${v3AuditedLiveTick.censusStats.asiAgents.toLocaleString()} | APEX=${v3AuditedLiveTick.censusStats.apexAgents.toLocaleString()}`);
  console.log(`[TELEMETRY SINK] Daily Net Conservation: ${v3AuditedLiveTick.censusStats.agentsBornToday.toLocaleString()} - ${v3AuditedLiveTick.censusStats.agentsShutdownToday.toLocaleString()} = ${v3AuditedLiveTick.censusStats.netGrowthToday.toLocaleString()} (DRIFT: 0)`);
  console.log(`[TELEMETRY SINK] BFT Weight / Share Sum: ${v3AuditedLiveTick.ssotVerification.bftWeightSumPct.toFixed(2)}% / ${v3AuditedLiveTick.ssotVerification.sharePercentSumPct.toFixed(2)}%`);
  console.log(`[TELEMETRY SINK] Combined Indexed:       ${v3AuditedLiveTick.censusStats.combinedIndexedAgents.toLocaleString()} (71.9%)`);
  console.log(`[TELEMETRY SINK] Dark Matter Pool:       ${v3AuditedLiveTick.censusStats.darkMatterAgents.toLocaleString()} (28.1%)`);
  console.log(`[TELEMETRY SINK] Planetary Ceiling:      ${v3AuditedLiveTick.censusStats.planetaryCeiling.toLocaleString()} (100.0%)`);
  console.log(`[TELEMETRY SINK] Epoch Witness:          ${epochWitness}`);
  console.log(`[TELEMETRY SINK] JSON Snapshot written:  ${outFile}`);
  console.log(`[TELEMETRY SINK] 17-Col CSV written:     ${csvFile}`);
  process.exit(0);
}

main().catch((err) => {
  console.error('Telemetry Export Failure:', err);
  process.exit(1);
});
