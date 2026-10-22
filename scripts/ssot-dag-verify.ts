/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * COD3EVAL SOVEREIGN INFINITY: STAGE 2 HARE-NIEMEYER SSOT CONSERVATION (Δ = 0)
 * & KAHN 30-DISCIPLINE ACYCLIC DAG FORMAL VERIFIER
 * Executed in CI/CD via GitHub Actions (sovereign-guardrail-ci.yml)
 */

import { allocateHareNiemeyerExact } from '../src/services/reconciler-and-tiers-live.ts';
import { verifySovereign300AcyclicDag } from '../src/services/sovereign-300-github-sync.ts';

async function main() {
  console.log('===========================================================');
  console.log('STAGE 2: HARE-NIEMEYER CONSERVATION (Δ = 0) & KAHN DAG PROOF');
  console.log('===========================================================\n');

  const targetPool = 837445778;
  const weights = Array.from({ length: 228 }, (_, i) => ({
    domain_id: `D_${i + 1}`,
    weight: 1000 / (i + 1),
  }));

  const alloc = allocateHareNiemeyerExact(targetPool, weights);
  const sum = alloc.reduce((s, a) => s + a.allocated_agents, 0);
  const delta = sum - targetPool;

  console.log(`[SSOT] Target Pool:      ${targetPool.toLocaleString()}`);
  console.log(`[SSOT] Allocated Sum:    ${sum.toLocaleString()}`);
  console.log(`[SSOT] Remainder Delta:  ${delta}`);

  if (delta !== 0) {
    throw new Error(`SSOT Conservation Violated: Delta (${delta}) != 0`);
  }

  const dag = verifySovereign300AcyclicDag();
  console.log(`[KAHN DAG] Acyclic:      ${dag.is_acyclic}`);
  console.log(`[KAHN DAG] Total Nodes:  ${dag.total_nodes}`);

  if (!dag.is_acyclic) {
    throw new Error('Lineage Cycle Detected in Sovereign 300 DAG');
  }

  console.log(
    `\nSAT_VERIFIED: Delta=0, DAG Acyclic=true, Ordered Nodes=${dag.total_nodes}`
  );
  process.exit(0);
}

main().catch((err) => {
  console.error('Stage 2 Verification Failed:', err);
  process.exit(1);
});
