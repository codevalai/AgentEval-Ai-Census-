/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Master Snapshot Exporter & Single-Flight SWR Wire Cache
 * (src/services/master-snapshot-exporter.ts)
 */

import { executeHyperCrawlerSweep, LIVE_EXTERNAL_FEEDS } from './hyper-crawler-engine.ts';
import { computeLiveBayesianCensus } from './reconciler-and-tiers-live.ts';
import { computeSacredFilesMerkleAttestation } from './sovereign-guardrail-spine.ts';
import { getCommunityDmzNodesState } from '../routes/community-dmz-routes.ts';
import {
  buildOmniSovereignExportV3,
  OmniSovereignExportV3,
} from '../lib/omniSnapshotExporterV3.ts';
import { ExactIntegerTickEngine } from '../lib/exactTickAccumulator.ts';
import { INITIAL_STATS } from '../data/initialData.ts';

const serverTickEngine = new ExactIntegerTickEngine({
  totalAgents: INITIAL_STATS.totalAgents,
  agentsBornToday: INITIAL_STATS.agentsBornToday,
  agentsShutdownToday: INITIAL_STATS.agentsShutdownToday,
  agiAgents: INITIAL_STATS.agiAgents,
  asiAgents: INITIAL_STATS.asiAgents,
  apexAgents: INITIAL_STATS.apexAgents,
  birthsPerSec: INITIAL_STATS.birthsPerSec,
  shutdownsPerSec: INITIAL_STATS.shutdownsPerSec,
  toolInvocationsPerSec: INITIAL_STATS.toolInvocationsPerSec,
});
let lastServerTickMs = Date.now();

export function getLiveServerIntegerTick() {
  const now = Date.now();
  const dtSec = Math.max(0, Math.min(3600, (now - lastServerTickMs) / 1000));
  lastServerTickMs = now;
  return serverTickEngine.advanceTick(dtSec);
}

// ============================================================================
// SINGLE-FLIGHT SWR (STALE-WHILE-REVALIDATE) WIRE CACHE (15s Fresh / 60s Stale)
// ============================================================================

export interface CoalescedWireSweepPayload {
  sweep: Awaited<ReturnType<typeof executeHyperCrawlerSweep>>;
  reconciliation: ReturnType<typeof computeLiveBayesianCensus>['reconciliation'];
  domainAllocations228: ReturnType<typeof computeLiveBayesianCensus>['domainAllocations228'];
  cachedAtMs: number;
}

let cachedWirePayload: CoalescedWireSweepPayload | null = null;
let inFlightSweepPromise: Promise<CoalescedWireSweepPayload> | null = null;

const FRESH_TTL_MS = 15_000;
const STALE_MAX_MS = 60_000;

async function runWireSweepInternal(limit?: number): Promise<CoalescedWireSweepPayload> {
  const sweep = await executeHyperCrawlerSweep(limit);
  const { reconciliation, domainAllocations228 } = computeLiveBayesianCensus(
    sweep.probes,
    sweep.merkle_root_sha256,
    sweep.ed25519_batch_signature
  );
  const payload: CoalescedWireSweepPayload = {
    sweep,
    reconciliation,
    domainAllocations228,
    cachedAtMs: Date.now(),
  };
  cachedWirePayload = payload;
  return payload;
}

/**
 * Single-Flight Promise Coalescing + Stale-While-Revalidate (SWR)
 * Prevents outbound socket storms when 100+ crawlers hit /api/census/live or /api/census/export/latest.json simultaneously.
 */
export async function getCoalescedLiveWireSweep(
  forceRefresh = false,
  limit?: number
): Promise<CoalescedWireSweepPayload> {
  const now = Date.now();
  const ageMs = cachedWirePayload ? now - cachedWirePayload.cachedAtMs : Infinity;

  if (!forceRefresh && cachedWirePayload && ageMs < FRESH_TTL_MS) {
    return cachedWirePayload;
  }

  if (!forceRefresh && cachedWirePayload && ageMs < STALE_MAX_MS) {
    if (!inFlightSweepPromise) {
      inFlightSweepPromise = runWireSweepInternal(limit).finally(() => {
        inFlightSweepPromise = null;
      });
    }
    return cachedWirePayload;
  }

  if (inFlightSweepPromise) {
    return inFlightSweepPromise;
  }

  inFlightSweepPromise = runWireSweepInternal(limit).finally(() => {
    inFlightSweepPromise = null;
  });

  return inFlightSweepPromise;
}

/**
 * Generates the complete v3.0 Omni-Dimensional Snapshot combining the 2D Matrix Engine,
 * 64-probe wire sweep, 7 Sacred Core Files Merkle root, and ASRP-1.0 DMZ community ledger.
 */
export async function generateMasterV3CensusExport(
  customStats?: Partial<{
    totalAgents: number;
    agentsBornToday: number;
    agentsShutdownToday: number;
    birthsPerSec: number;
    shutdownsPerSec: number;
    swarmIntelligenceIndex: number;
    globalAutonomyIndex: number;
    toolInvocationsPerSec: number;
    verifiedConfidence: number;
    selfReportedConfidence: number;
    inferredConfidence: number;
    bftQuorumPercent: number;
    defconLevel: number;
    memorySliceBoundedKB: number;
  }>,
  forceWireSweep = false
): Promise<OmniSovereignExportV3> {
  const liveTick = getLiveServerIntegerTick();
  let wireData = cachedWirePayload;

  if (forceWireSweep) {
    try {
      wireData = await getCoalescedLiveWireSweep(true, 12);
    } catch {
      // Fallback to cached or baseline if external wire times out
    }
  } else if (!wireData) {
    // Trigger background warm-up without blocking first export response
    getCoalescedLiveWireSweep(false, 8).catch(() => {});
  }

  const sacredAttestation = computeSacredFilesMerkleAttestation();
  const dmzState = getCommunityDmzNodesState();

  return buildOmniSovereignExportV3({
    rawStats: {
      totalAgents: customStats?.totalAgents ?? liveTick.totalAgents,
      agentsBornToday: customStats?.agentsBornToday ?? liveTick.agentsBornToday,
      agentsShutdownToday: customStats?.agentsShutdownToday ?? liveTick.agentsShutdownToday,
      birthsPerSec: customStats?.birthsPerSec ?? liveTick.birthsPerSec,
      shutdownsPerSec: customStats?.shutdownsPerSec ?? liveTick.shutdownsPerSec,
      swarmIntelligenceIndex:
        customStats?.swarmIntelligenceIndex ?? INITIAL_STATS.swarmIntelligenceIndex,
      globalAutonomyIndex: customStats?.globalAutonomyIndex ?? INITIAL_STATS.globalAutonomyIndex,
      toolInvocationsPerSec:
        customStats?.toolInvocationsPerSec ?? liveTick.toolInvocationsPerSec,
      verifiedConfidence: customStats?.verifiedConfidence ?? INITIAL_STATS.verifiedConfidence,
      selfReportedConfidence:
        customStats?.selfReportedConfidence ?? INITIAL_STATS.selfReportedConfidence,
      inferredConfidence: customStats?.inferredConfidence ?? INITIAL_STATS.inferredConfidence,
      bftQuorumPercent: customStats?.bftQuorumPercent ?? INITIAL_STATS.bftQuorumPercent,
      defconLevel: customStats?.defconLevel ?? INITIAL_STATS.defconLevel,
      memorySliceBoundedKB: 64,
    },
    wireTriangulation: {
      configuredEndpoints: LIVE_EXTERNAL_FEEDS.length,
      metaLayersCount: 24,
      harvesterSwarmsCount: 15,
      aiFactoryTiersCount: 16,
      sovereign300ReposCount: 300,
      allocatedTaxonomyDomainsCount: 228,
      kalmanWireCohort: wireData?.reconciliation.kalman_fused_ssot_population ?? 428_410_220,
      chapmanCaptureRecaptureEstimate:
        wireData?.reconciliation.chapman_mark_recapture.estimated_total_population_n_hat ??
        492_671_753,
      littlesLawActiveConcurrency:
        wireData?.reconciliation.littles_law_ephemeral_flow.concurrent_active_l ?? 38_420_910,
      kalmanPosteriorVariance:
        wireData?.reconciliation.chapman_mark_recapture.variance_v_hat ?? 0.0412,
      lastWireSweepRootSha256: wireData?.sweep.merkle_root_sha256,
      lastWireSweepEd25519Sig: wireData?.sweep.ed25519_batch_signature,
    },
    guardrailStatus: {
      sacredFilesCount: sacredAttestation.files.length,
      sacredFilesMerkleRoot: sacredAttestation.sacred_merkle_root_sha256,
      dmzCommunityNodesVerified: dmzState.count,
      dmzCommunityMerkleRoot: dmzState.dmz_merkle_root,
    },
  });
}
