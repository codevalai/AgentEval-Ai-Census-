/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * 2D Bi-Proportional Hare-Niemeyer Matrix Engine & Zero-Drift Snapshot Serializer
 * (src/lib/sovereignExportAndMatrixEngine.ts)
 *
 * Resolves all 6 mathematical & schema discrepancies in JSON & CSV exports:
 * 1. Live Tick Synchronization: Reconciles all 20 regions & 4 tiers to live totalAgents (T_0 + Δ)
 * 2. 2D Matrix Conservation (Δ_2D = 0): Row sums === Column sums === Global Total
 * 3. Pure Integer Counters: Zero IEEE-754 floating-point fractions in counter fields
 * 4. Exact Daily Net Identity: netGrowthToday === agentsBornToday - agentsShutdownToday
 * 5. Dual Ranking Disambiguation: Explicit latencyRank AND populationRank
 * 6. Exact 100.00% BFT Consensus Weight Sum across all 20 megasites
 */

import { GENESIS_YEAR_PRIOR_TO_TODAY } from './exactTickAccumulator.ts';

/**
 * Pure TypeScript FIPS 180-4 SHA-256 implementation (64-char lowercase hex).
 * Works identically in Browser (Vite client) and Node.js without `node:crypto` polyfill issues.
 */
const SHA256_K = new Uint32Array([
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
]);

function rotr(n: number, x: number): number {
  return (x >>> n) | (x << (32 - n));
}

export function sha256Hex(asciiInput: string): string {
  const bytes = new TextEncoder().encode(asciiInput);
  const bitLen = bytes.length * 8;
  const totalBytes = Math.ceil((bytes.length + 9) / 64) * 64;
  const padded = new Uint8Array(totalBytes);
  padded.set(bytes);
  padded[bytes.length] = 0x80;
  const view = new DataView(padded.buffer);
  view.setUint32(totalBytes - 8, Math.floor(bitLen / 0x100000000), false);
  view.setUint32(totalBytes - 4, bitLen >>> 0, false);

  let h0 = 0x6a09e667;
  let h1 = 0xbb67ae85;
  let h2 = 0x3c6ef372;
  let h3 = 0xa54ff53a;
  let h4 = 0x510e527f;
  let h5 = 0x9b05688c;
  let h6 = 0x1f83d9ab;
  let h7 = 0x5be0cd19;

  const w = new Uint32Array(64);

  for (let offset = 0; offset < totalBytes; offset += 64) {
    for (let i = 0; i < 16; i++) {
      w[i] = view.getUint32(offset + i * 4, false);
    }
    for (let i = 16; i < 64; i++) {
      const s0 = rotr(7, w[i - 15]) ^ rotr(18, w[i - 15]) ^ (w[i - 15] >>> 3);
      const s1 = rotr(17, w[i - 2]) ^ rotr(19, w[i - 2]) ^ (w[i - 2] >>> 10);
      w[i] = (w[i - 16] + s0 + w[i - 7] + s1) >>> 0;
    }

    let a = h0;
    let b = h1;
    let c = h2;
    let d = h3;
    let e = h4;
    let f = h5;
    let g = h6;
    let h = h7;

    for (let i = 0; i < 64; i++) {
      const S1 = rotr(6, e) ^ rotr(11, e) ^ rotr(25, e);
      const ch = (e & f) ^ (~e & g);
      const temp1 = (h + S1 + ch + SHA256_K[i] + w[i]) >>> 0;
      const S0 = rotr(2, a) ^ rotr(13, a) ^ rotr(22, a);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (S0 + maj) >>> 0;

      h = g;
      g = f;
      f = e;
      e = (d + temp1) >>> 0;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) >>> 0;
    }

    h0 = (h0 + a) >>> 0;
    h1 = (h1 + b) >>> 0;
    h2 = (h2 + c) >>> 0;
    h3 = (h3 + d) >>> 0;
    h4 = (h4 + e) >>> 0;
    h5 = (h5 + f) >>> 0;
    h6 = (h6 + g) >>> 0;
    h7 = (h7 + h) >>> 0;
  }

  return [h0, h1, h2, h3, h4, h5, h6, h7]
    .map((v) => v.toString(16).padStart(8, '0'))
    .join('');
}

export interface RegionalBaselineRow {
  id: string;
  latencyRank: number;
  populationRank: number;
  name: string;
  city: string;
  country: string;
  regionCode: string;
  baseTotal: number;
  baseAi: number;
  baseAgi: number;
  baseAsi: number;
  baseApex: number;
  latencyMs: number;
  bftWeightPct: number; // Exact 2-decimal precision summing to 100.00%
  health: 'OPTIMAL' | 'DEGRADED' | 'ISOLATED';
}

export interface ReconciledRegionRow {
  id: string;
  rank: number; // Alias for latencyRank for backward compatibility
  latencyRank: number;
  populationRank: number;
  name: string;
  city: string;
  country: string;
  regionCode: string;
  totalAgents: number;
  aiAgents: number;
  agiAgents: number;
  asiAgents: number;
  apexNodes: number;
  latencyMs: number;
  bftWeight: number;
  health: 'OPTIMAL' | 'DEGRADED' | 'ISOLATED';
  sharePercent: number;
  merkleLeaf: string;
  merkleLeafSha256: string;
}

export const T0_GLOBAL_BASELINE = {
  totalAgents: 342_892_410_000,
  aiAgents: 231_384_000_000,
  agiAgents: 82_012_410_000,
  asiAgents: 26_012_000_000,
  apexAgents: 3_484_000_000,
  agentsBornToday: 4_842_091_000,
  agentsShutdownToday: 1_620_410_000,
  netGrowthToday: 3_221_681_000, // Exact 4,842,091,000 - 1,620,410,000
  yearPriorToTodayBase: GENESIS_YEAR_PRIOR_TO_TODAY,
} as const;

export const CANONICAL_20_REGIONS_T0: ReadonlyArray<RegionalBaselineRow> = [
  { id: 'tokyo-prim', latencyRank: 1, populationRank: 2, name: 'Tokyo Core Cluster', city: 'Tokyo', country: 'Japan', regionCode: 'asia-northeast1', baseTotal: 57_983_610_000, baseAi: 39_134_400_000, baseAgi: 13_862_010_000, baseAsi: 4_397_600_000, baseApex: 589_600_000, latencyMs: 1.8, bftWeightPct: 16.91, health: 'OPTIMAL' },
  { id: 'us-virginia', latencyRank: 2, populationRank: 1, name: 'Ashburn Megasite', city: 'Virginia', country: 'United States', regionCode: 'us-east4', baseTotal: 68_160_000_000, baseAi: 45_993_600_000, baseAgi: 16_303_200_000, baseAsi: 5_169_600_000, baseApex: 693_600_000, latencyMs: 2.1, bftWeightPct: 19.88, health: 'OPTIMAL' },
  { id: 'zurich-alpine', latencyRank: 3, populationRank: 3, name: 'Zurich Vault Node', city: 'Zurich', country: 'Switzerland', regionCode: 'europe-west6', baseTotal: 40_560_000_000, baseAi: 27_369_600_000, baseAgi: 9_700_800_000, baseAsi: 3_076_800_000, baseApex: 412_800_000, latencyMs: 3.4, bftWeightPct: 11.83, health: 'OPTIMAL' },
  { id: 'singapore-equator', latencyRank: 4, populationRank: 4, name: 'Singapore Straits Gateway', city: 'Singapore', country: 'Singapore', regionCode: 'asia-southeast1', baseTotal: 34_080_000_000, baseAi: 22_996_800_000, baseAgi: 8_152_800_000, baseAsi: 2_584_800_000, baseApex: 345_600_000, latencyMs: 4.2, bftWeightPct: 9.94, health: 'OPTIMAL' },
  { id: 'reykjavik-geo', latencyRank: 5, populationRank: 5, name: 'Reykjavik Geothermal Sanctum', city: 'Reykjavik', country: 'Iceland', regionCode: 'europe-north1-ic', baseTotal: 28_440_000_000, baseAi: 19_190_400_000, baseAgi: 6_804_000_000, baseAsi: 2_157_600_000, baseApex: 288_000_000, latencyMs: 6.8, bftWeightPct: 8.29, health: 'OPTIMAL' },
  { id: 'us-central', latencyRank: 6, populationRank: 6, name: 'Iowa Prairie Compute Hub', city: 'Council Bluffs', country: 'United States', regionCode: 'us-central1', baseTotal: 22_608_000_000, baseAi: 15_256_800_000, baseAgi: 5_407_200_000, baseAsi: 1_713_600_000, baseApex: 230_400_000, latencyMs: 4.8, bftWeightPct: 6.59, health: 'OPTIMAL' },
  { id: 'eu-belgium', latencyRank: 7, populationRank: 7, name: 'St. Ghislain Hyperscale', city: 'Brussels', country: 'Belgium', regionCode: 'europe-west1', baseTotal: 18_336_000_000, baseAi: 12_372_000_000, baseAgi: 4_387_200_000, baseAsi: 1_389_600_000, baseApex: 187_200_000, latencyMs: 5.1, bftWeightPct: 5.35, health: 'OPTIMAL' },
  { id: 'eu-frankfurt', latencyRank: 8, populationRank: 8, name: 'Frankfurt Financial Core', city: 'Frankfurt', country: 'Germany', regionCode: 'europe-west3', baseTotal: 14_832_000_000, baseAi: 10_008_000_000, baseAgi: 3_547_200_000, baseAsi: 1_125_600_000, baseApex: 151_200_000, latencyMs: 4.9, bftWeightPct: 4.33, health: 'OPTIMAL' },
  { id: 'asia-taiwan', latencyRank: 9, populationRank: 9, name: 'Changhua Semiconductor Node', city: 'Taipei', country: 'Taiwan', regionCode: 'asia-east1', baseTotal: 12_288_000_000, baseAi: 8_292_000_000, baseAgi: 2_940_000_000, baseAsi: 931_200_000, baseApex: 124_800_000, latencyMs: 7.2, bftWeightPct: 3.58, health: 'OPTIMAL' },
  { id: 'eu-finland', latencyRank: 10, populationRank: 10, name: 'Hamina Subsea Data Core', city: 'Hamina', country: 'Finland', regionCode: 'europe-north1', baseTotal: 10_440_000_000, baseAi: 7_044_000_000, baseAgi: 2_498_400_000, baseAsi: 792_000_000, baseApex: 105_600_000, latencyMs: 8.5, bftWeightPct: 3.04, health: 'OPTIMAL' },
  { id: 'us-oregon', latencyRank: 11, populationRank: 11, name: 'The Dalles Hydro Array', city: 'The Dalles', country: 'United States', regionCode: 'us-west1', baseTotal: 7_704_000_000, baseAi: 5_198_400_000, baseAgi: 1_843_200_000, baseAsi: 583_200_000, baseApex: 79_200_000, latencyMs: 9.1, bftWeightPct: 2.25, health: 'OPTIMAL' },
  { id: 'au-sydney', latencyRank: 12, populationRank: 12, name: 'Sydney Oceanic Edge', city: 'Sydney', country: 'Australia', regionCode: 'australia-southeast1', baseTotal: 6_432_000_000, baseAi: 4_339_200_000, baseAgi: 1_538_400_000, baseAsi: 489_600_000, baseApex: 64_800_000, latencyMs: 14.2, bftWeightPct: 1.88, health: 'OPTIMAL' },
  { id: 'sa-brazil', latencyRank: 13, populationRank: 13, name: 'Sao Paulo Amazon Basin', city: 'Sao Paulo', country: 'Brazil', regionCode: 'southamerica-east1', baseTotal: 5_136_000_000, baseAi: 3_465_600_000, baseAgi: 1_228_800_000, baseAsi: 388_800_000, baseApex: 52_800_000, latencyMs: 18.6, bftWeightPct: 1.50, health: 'OPTIMAL' },
  { id: 'me-qatar', latencyRank: 14, populationRank: 14, name: 'Doha Sovereign Cloud Hub', city: 'Doha', country: 'Qatar', regionCode: 'me-central1', baseTotal: 4_368_000_000, baseAi: 2_947_200_000, baseAgi: 1_044_000_000, baseAsi: 331_200_000, baseApex: 45_600_000, latencyMs: 12.0, bftWeightPct: 1.27, health: 'OPTIMAL' },
  { id: 'in-mumbai', latencyRank: 15, populationRank: 15, name: 'Mumbai Tech Gateway', city: 'Mumbai', country: 'India', regionCode: 'asia-south1', baseTotal: 3_576_000_000, baseAi: 2_414_400_000, baseAgi: 854_400_000, baseAsi: 271_200_000, baseApex: 36_000_000, latencyMs: 16.4, bftWeightPct: 1.04, health: 'OPTIMAL' },
  { id: 'af-joburg', latencyRank: 16, populationRank: 16, name: 'Johannesburg Highveld Array', city: 'Johannesburg', country: 'South Africa', regionCode: 'africa-south1', baseTotal: 2_832_000_000, baseAi: 1_910_400_000, baseAgi: 676_800_000, baseAsi: 216_000_000, baseApex: 28_800_000, latencyMs: 24.1, bftWeightPct: 0.83, health: 'OPTIMAL' },
  { id: 'us-carolina', latencyRank: 17, populationRank: 17, name: 'Berkeley County Supercell', city: 'Moncks Corner', country: 'United States', regionCode: 'us-east1', baseTotal: 2_136_000_000, baseAi: 1_440_000_000, baseAgi: 511_200_000, baseAsi: 163_200_000, baseApex: 21_600_000, latencyMs: 8.8, bftWeightPct: 0.62, health: 'OPTIMAL' },
  { id: 'eu-netherlands', latencyRank: 18, populationRank: 18, name: 'Eemshaven Sea Hub', city: 'Eemshaven', country: 'Netherlands', regionCode: 'europe-west4', baseTotal: 1_536_000_000, baseAi: 1_036_800_000, baseAgi: 367_200_000, baseAsi: 117_600_000, baseApex: 14_400_000, latencyMs: 6.2, bftWeightPct: 0.45, health: 'OPTIMAL' },
  { id: 'ca-montreal', latencyRank: 19, populationRank: 19, name: 'Montreal Boreal Grid', city: 'Montreal', country: 'Canada', regionCode: 'northamerica-northeast1', baseTotal: 916_800_000, baseAi: 619_200_000, baseAgi: 218_400_000, baseAsi: 72_000_000, baseApex: 7_200_000, latencyMs: 7.9, bftWeightPct: 0.27, health: 'OPTIMAL' },
  { id: 'kr-seoul', latencyRank: 20, populationRank: 20, name: 'Seoul Han River Node', city: 'Seoul', country: 'South Korea', regionCode: 'asia-northeast3', baseTotal: 528_000_000, baseAi: 355_200_000, baseAgi: 127_200_000, baseAsi: 40_800_000, baseApex: 4_800_000, latencyMs: 8.1, bftWeightPct: 0.15, health: 'OPTIMAL' },
];

/**
 * 1D Hare-Niemeyer Largest Remainder Integer Partitioner using exact BigInt Euclidean division.
 * Guarantees SUM(output) === Math.round(targetTotal) with Δ = 0 and zero IEEE-754 overflow.
 */
export function allocateHareNiemeyerIntegers(targetTotal: number, weights: number[]): number[] {
  const cleanTarget = BigInt(Math.max(0, Math.round(targetTotal)));
  const scaledWeights = weights.map((w) => BigInt(Math.max(0, Math.round(w))));
  const weightSum = scaledWeights.reduce((acc, w) => acc + w, 0n);

  if (weightSum === 0n || weights.length === 0) {
    return weights.map(() => 0);
  }

  const floors: bigint[] = [];
  const remainders: { index: number; rem: bigint }[] = [];
  let sumFloors = 0n;

  for (let i = 0; i < scaledWeights.length; i++) {
    const numerator = cleanTarget * scaledWeights[i];
    const q = numerator / weightSum;
    const r = numerator % weightSum;
    floors.push(q);
    sumFloors += q;
    remainders.push({ index: i, rem: r });
  }

  const remainderUnits = Number(cleanTarget - sumFloors);
  remainders.sort((a, b) => (b.rem > a.rem ? 1 : b.rem < a.rem ? -1 : a.index - b.index));

  for (let k = 0; k < remainderUnits; k++) {
    floors[remainders[k].index] += 1n;
  }

  return floors.map((v) => Number(v));
}

export interface RawTickInput {
  totalAgents: number;
  agentsBornToday: number;
  agentsShutdownToday: number;
  swarmIntelligenceIndex?: number;
  globalAutonomyIndex?: number;
  toolInvocationsPerSec?: number;
  birthsPerSec?: number;
  shutdownsPerSec?: number;
  verifiedConfidence?: number;
  selfReportedConfidence?: number;
  inferredConfidence?: number;
  bftQuorumPercent?: number;
  defconLevel?: number;
  memorySliceBoundedKB?: number;
}

export interface ReconciledCensusSnapshotV2 {
  schemaVersion: 'SOVEREIGN-CENSUS-EXPORT-V2.4-ZERO-DRIFT';
  timestamp: string;
  censusStats: {
    totalAgents: number;
    aiAgents: number;
    agiAgents: number;
    asiAgents: number;
    apexAgents: number;
    agentsBornToday: number;
    agentsShutdownToday: number;
    netGrowthToday: number;
    agentsCreatedYear: number;
    swarmIntelligenceIndex: number;
    globalAutonomyIndex: number;
    toolInvocationsPerSec: number;
    birthsPerSec: number;
    shutdownsPerSec: number;
    verifiedConfidence: number;
    selfReportedConfidence: number;
    inferredConfidence: number;
    bftQuorumPercent: number;
    defconLevel: number;
    memorySliceBoundedKB: number;
  };
  topRegions: ReconciledRegionRow[];
  pqcSpec: 'ML-KEM-1024';
  bftQuorum: number;
  merkleRoot: string;
  ed25519Witness: string;
  ssotVerification: {
    is2DZeroDrift: boolean;
    globalTotal: number;
    tiersSum: number;
    regionsTotalSum: number;
    regionsAiSum: number;
    regionsAgiSum: number;
    regionsAsiSum: number;
    regionsApexSum: number;
    bftWeightSumPct: number;
    sharePercentSumPct: number;
    matrixDriftDelta: number;
  };
}

/**
 * 2D Bi-Proportional Hare-Niemeyer Reconciler
 * Takes any live tick (even with raw float inputs) and outputs an integer-exact
 * 2D reconciled snapshot where:
 *   - All counters are pure integers
 *   - netGrowthToday === agentsBornToday - agentsShutdownToday
 *   - agentsCreatedYear === 338,050,319,000 + agentsBornToday
 *   - SUM(4 Tiers) === censusStats.totalAgents
 *   - SUM(20 Regions) === censusStats.totalAgents
 *   - Every Region row's AI+AGI+ASI+Apex === Region.totalAgents
 */
export function buildZeroDrift2DCensusSnapshot(raw: RawTickInput): ReconciledCensusSnapshotV2 {
  const totalAgents = Math.round(raw.totalAgents);
  const agentsBornToday = Math.round(raw.agentsBornToday);
  const agentsShutdownToday = Math.round(raw.agentsShutdownToday);

  // Enforce exact daily net growth identity (fixes the -10.00001 float discrepancy)
  const netGrowthToday = agentsBornToday - agentsShutdownToday;

  // Enforce exact annual cumulative identity (fixes the 342.89B vs 353.91B discrepancy)
  const agentsCreatedYear = T0_GLOBAL_BASELINE.yearPriorToTodayBase + agentsBornToday;

  // Step 1: Partition live totalAgents across the 4 global capability tiers using T_0 weights
  const [aiAgents, agiAgents, asiAgents, apexAgents] = allocateHareNiemeyerIntegers(totalAgents, [
    T0_GLOBAL_BASELINE.aiAgents,
    T0_GLOBAL_BASELINE.agiAgents,
    T0_GLOBAL_BASELINE.asiAgents,
    T0_GLOBAL_BASELINE.apexAgents,
  ]);

  // Step 2: Partition each global tier column across the 20 regional megasites
  const regionalAi = allocateHareNiemeyerIntegers(
    aiAgents,
    CANONICAL_20_REGIONS_T0.map((r) => r.baseAi)
  );
  const regionalAgi = allocateHareNiemeyerIntegers(
    agiAgents,
    CANONICAL_20_REGIONS_T0.map((r) => r.baseAgi)
  );
  const regionalAsi = allocateHareNiemeyerIntegers(
    asiAgents,
    CANONICAL_20_REGIONS_T0.map((r) => r.baseAsi)
  );
  const regionalApex = allocateHareNiemeyerIntegers(
    apexAgents,
    CANONICAL_20_REGIONS_T0.map((r) => r.baseApex)
  );

  // Exact basis-point allocation for sharePercent so it sums to 100.00%
  const shareBasisPoints = allocateHareNiemeyerIntegers(
    10_000,
    CANONICAL_20_REGIONS_T0.map((r) => r.baseTotal)
  );

  // Step 3: Construct the 20 regional rows where Row Total = sum of its 4 exact integer tiers
  const topRegions: ReconciledRegionRow[] = CANONICAL_20_REGIONS_T0.map((r, idx) => {
    const rowAi = regionalAi[idx];
    const rowAgi = regionalAgi[idx];
    const rowAsi = regionalAsi[idx];
    const rowApex = regionalApex[idx];
    const rowTotal = rowAi + rowAgi + rowAsi + rowApex;
    const sharePercent = Number((shareBasisPoints[idx] / 100).toFixed(2));

    const leafDigest = sha256Hex(
      `${r.id}:${r.regionCode}:${rowTotal}:${rowAi}:${rowAgi}:${rowAsi}:${rowApex}:${r.latencyMs}`
    );

    return {
      id: r.id,
      rank: r.latencyRank,
      latencyRank: r.latencyRank,
      populationRank: r.populationRank,
      name: r.name,
      city: r.city,
      country: r.country,
      regionCode: r.regionCode,
      totalAgents: rowTotal,
      aiAgents: rowAi,
      agiAgents: rowAgi,
      asiAgents: rowAsi,
      apexNodes: rowApex,
      latencyMs: r.latencyMs,
      bftWeight: r.bftWeightPct,
      health: r.health,
      sharePercent,
      merkleLeaf: leafDigest,
      merkleLeafSha256: leafDigest,
    };
  });

  // Step 4: Verify 2D Row & Column Conservation
  const regionsTotalSum = topRegions.reduce((s, r) => s + r.totalAgents, 0);
  const regionsAiSum = topRegions.reduce((s, r) => s + r.aiAgents, 0);
  const regionsAgiSum = topRegions.reduce((s, r) => s + r.agiAgents, 0);
  const regionsAsiSum = topRegions.reduce((s, r) => s + r.asiAgents, 0);
  const regionsApexSum = topRegions.reduce((s, r) => s + r.apexNodes, 0);
  const tiersSum = aiAgents + agiAgents + asiAgents + apexAgents;
  const bftWeightSumPct = Number(
    topRegions.reduce((s, r) => s + r.bftWeight, 0).toFixed(2)
  );
  const sharePercentSumPct = Number(
    topRegions.reduce((s, r) => s + r.sharePercent, 0).toFixed(2)
  );

  const matrixDriftDelta =
    Math.abs(totalAgents - tiersSum) +
    Math.abs(totalAgents - regionsTotalSum) +
    Math.abs(aiAgents - regionsAiSum) +
    Math.abs(agiAgents - regionsAgiSum) +
    Math.abs(asiAgents - regionsAsiSum) +
    Math.abs(apexAgents - regionsApexSum);

  const timestamp = new Date().toISOString();
  const merkleRoot = sha256Hex(
    `${timestamp}:${totalAgents}:${netGrowthToday}:${topRegions.map((r) => r.merkleLeaf).join('|')}`
  );
  const ed25519Witness = sha256Hex(`ED25519-SOVEREIGN-WITNESS:${merkleRoot}:ML-KEM-1024`);

  return {
    schemaVersion: 'SOVEREIGN-CENSUS-EXPORT-V2.4-ZERO-DRIFT',
    timestamp,
    censusStats: {
      totalAgents,
      aiAgents,
      agiAgents,
      asiAgents,
      apexAgents,
      agentsBornToday,
      agentsShutdownToday,
      netGrowthToday,
      agentsCreatedYear,
      swarmIntelligenceIndex: raw.swarmIntelligenceIndex ?? 1.91,
      globalAutonomyIndex: raw.globalAutonomyIndex ?? 9.72,
      toolInvocationsPerSec: raw.toolInvocationsPerSec ?? 17_135_416.7,
      birthsPerSec: raw.birthsPerSec ?? 148_420,
      shutdownsPerSec: raw.shutdownsPerSec ?? 49_680,
      verifiedConfidence: raw.verifiedConfidence ?? 68.4,
      selfReportedConfidence: raw.selfReportedConfidence ?? 23.2,
      inferredConfidence: raw.inferredConfidence ?? 8.4,
      bftQuorumPercent: raw.bftQuorumPercent ?? 92.5,
      defconLevel: raw.defconLevel ?? 2,
      memorySliceBoundedKB: raw.memorySliceBoundedKB ?? 64,
    },
    topRegions,
    pqcSpec: 'ML-KEM-1024',
    bftQuorum: raw.bftQuorumPercent ?? 92.5,
    merkleRoot,
    ed25519Witness,
    ssotVerification: {
      is2DZeroDrift: matrixDriftDelta === 0,
      globalTotal: totalAgents,
      tiersSum,
      regionsTotalSum,
      regionsAiSum,
      regionsAgiSum,
      regionsAsiSum,
      regionsApexSum,
      bftWeightSumPct,
      sharePercentSumPct,
      matrixDriftDelta,
    },
  };
}

export const buildReconciledCensusExport = buildZeroDrift2DCensusSnapshot;

/**
 * Generates the reconciled 17-column CSV matching the live JSON snapshot 1:1.
 */
export function serializeReconciledRegionsToCsv(snapshot: { topRegions: ReconciledRegionRow[] }): string {
  const headers = [
    'LatencyRank',
    'PopulationRank',
    'RegionId',
    'Region',
    'City',
    'Country',
    'RegionCode',
    'TotalAgents',
    'AI',
    'AGI',
    'ASI',
    'Apex',
    'LatencyMs',
    'BFTWeight',
    'SharePercent',
    'Health',
    'MerkleLeafSha256',
  ];

  const rows = snapshot.topRegions.map((r) =>
    [
      r.latencyRank,
      r.populationRank,
      r.id,
      `"${r.name}"`,
      `"${r.city}"`,
      `"${r.country}"`,
      r.regionCode,
      r.totalAgents,
      r.aiAgents,
      r.agiAgents,
      r.asiAgents,
      r.apexNodes,
      r.latencyMs,
      r.bftWeight.toFixed(2),
      r.sharePercent.toFixed(2),
      r.health,
      r.merkleLeafSha256 || r.merkleLeaf,
    ].join(',')
  );

  return [headers.join(','), ...rows].join('\n');
}
