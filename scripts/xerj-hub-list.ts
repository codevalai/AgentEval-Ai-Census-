/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * XERJ CORPUS HUB V2 CLI INSPECTOR (`xerj hub list`)
 * Lists all installed, auto-indexed (`ax-census`), and available Corpus Hub v2 (`xc-*`) packs
 * with G7 Quality Gate (#1721) grades, AST symbol density, and token compression metrics.
 */

import { fetchXerjHubList } from "../src/agents/xerj-deep-primitives.ts";

async function main() {
  const result = await fetchXerjHubList("http://127.0.0.1:9200");

  console.log("=====================================================================================================");
  console.log(" XERJ CORPUS HUB V2 — SOVEREIGN INFINITY AI CENSUS (`xerj hub list`)");
  console.log(` Node Endpoint: ${result.nodeEndpoint} (--insecure zero-auth mode)`);
  console.log(` Protocol:      ${result.hubProtocolVersion}`);
  console.log(` Summary:       ${result.totalPacks} Total Packs | ${result.installedCount} Installed (xc-*) | ${result.autoindexedCount} Autoindexed (ax-census-*)`);
  console.log("=====================================================================================================\n");

  const header =
    "PACK ID".padEnd(34) +
    "STATUS".padEnd(18) +
    "VERSION".padEnd(14) +
    "GRADE".padEnd(16) +
    "DOCS".padEnd(9) +
    "AST SYM".padEnd(10) +
    "SIZE".padEnd(10) +
    "COMPRESSION";
  console.log(header);
  console.log("-".repeat(120));

  for (const p of result.packs) {
    const line =
      p.packId.padEnd(34) +
      p.status.padEnd(18) +
      p.version.padEnd(14) +
      p.grade.padEnd(16) +
      String(p.docCount).padEnd(9) +
      String(p.astSymbolCount).padEnd(10) +
      p.sizeFormatted.padEnd(10) +
      p.tokenCompressionRatio;
    console.log(line);
  }

  console.log("-".repeat(120));
  console.log("\nQuick Commands:");
  console.log("  $ xerj hub pull xc-sovereign-infinity-ai-census");
  console.log('  $ xerj code "SovereignLifecycleFSM acquireLease" --index ax-census-code');
  console.log('  $ xerj ask "Verify 8-dimension zero-drift invariant" --index xc-sovereign-infinity-ai-census');
  console.log("=====================================================================================================");
}

main().catch((err) => {
  console.error("Failed to run xerj hub list:", err);
  process.exit(1);
});
