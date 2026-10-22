// scripts/verify-community-intake.ts
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execSync } from 'node:child_process';
import { performance } from 'node:perf_hooks';
import { z } from 'zod';

export const CommunityNodeSchema = z.object({
  node_id: z.string().regex(/^ASRP-EXT-\d{4,6}$/, 'Must match ASRP-EXT-XXXX'),
  agent_or_server_name: z.string().min(3).max(120),
  category: z.enum([
    'MCP_SERVER',
    'AUTONOMOUS_SWE_AGENT',
    'OPEN_WEIGHTS_MODEL',
    'ROBOTICS_ROS2_NODE',
    'TELEMETRY_BRIDGE',
    'AI_FACTORY_ENDPOINT',
  ]),
  sovereignty_zone: z.enum([
    'US-Sovereign',
    'EU-AI-Act',
    'UK-AISI',
    'APAC-Compute',
    'CN-CAC',
    'Decentralized-Mesh',
  ]),
  repository_url: z.string().url().startsWith('https://github.com/'),
  live_health_url: z.string().url().startsWith('https://'),
  spiffe_svid: z.string().startsWith('spiffe://'),
  pqc_algorithm: z.enum(['ML-KEM-1024', 'ML-DSA-87', 'SLH-DSA-256s', 'Ed25519']),
  max_memory_kb: z.number().int().min(1).max(64), // Strict RFC-003 <= 64 KB Wasm Enclave Bound
  ed25519_public_key_hex: z.string().regex(/^[0-9a-fA-F]{64,128}$/),
  submitted_by_github: z.string().min(1).max(60),
  registered_at_iso: z.string().datetime(),
});

export const CommunityLedgerSchema = z.object({
  schema_version: z.literal('ASRP-1.0-DMZ'),
  repository: z.literal('https://github.com/codevalai/AgentEval-Ai-Census-'),
  constitutional_invariant: z.literal('APPEND_ONLY_SAFE_HARBOR_ZERO_SACRED_MUTATION'),
  max_enclave_memory_kb: z.literal(64),
  registered_nodes: z.array(CommunityNodeSchema).min(1),
});

// Block SSRF against private/metadata IP ranges
export function assertSafePublicUrl(rawUrl: string): void {
  const parsed = new URL(rawUrl);
  const host = parsed.hostname.toLowerCase();
  const forbiddenPatterns = [
    /^localhost$/i,
    /^127\./,
    /^10\./,
    /^192\.168\./,
    /^169\.254\./,
    /^172\.(1[6-9]|2\d|3[0-1])\./,
    /\.internal$/i,
    /\.local$/i,
  ];
  if (forbiddenPatterns.some((rx) => rx.test(host))) {
    throw new Error(`SSRF_GUARDRAIL_TRIGGERED: Forbidden private/internal host "${host}"`);
  }
}

async function main() {
  console.log('====================================================================');
  console.log('🛡️  COD3EVAL SOVEREIGN INFINITY — ASRP-1.0 DMZ INTAKE COURT VERIFIER');
  console.log('====================================================================');

  // 1. Check Git Diff Isolation if running inside an external Pull Request
  if (process.env.ENFORCE_DMZ_SINGLE_FILE === 'true') {
    const baseRef = process.env.GITHUB_BASE_REF || 'main';
    const diffOutput = execSync(`git diff --name-only origin/${baseRef}...HEAD`, {
      encoding: 'utf8',
    }).trim();
    const changedFiles = diffOutput.split('\n').filter(Boolean);

    console.log(`[STAGE 1] Changed files in PR:`, changedFiles);
    const illegalTouches = changedFiles.filter(
      (f) => f !== 'data/community-registered-agents.json'
    );

    if (illegalTouches.length > 0) {
      console.error(
        `❌ CONSTITUTIONAL_SACRED_FILE_BREACH: External PR attempted to modify protected files:`,
        illegalTouches
      );
      process.exit(1);
    }
    console.log('✓ [STAGE 1] Zero Sacred File Mutation verified (100% isolated to DMZ JSON).');
  } else {
    console.log('✓ [STAGE 1] Local / Direct Ledger Verification Mode (Single-File DMZ Lock Ready).');
  }

  // 2. Load and Validate Zod Contract
  const filePath = path.resolve(process.cwd(), 'data/community-registered-agents.json');
  const rawContent = fs.readFileSync(filePath, 'utf8');
  const parsedJson = JSON.parse(rawContent);
  const ledger = CommunityLedgerSchema.parse(parsedJson);

  // Check for duplicate node_ids or spiffe_svids
  const seenIds = new Set<string>();
  const seenSpiffe = new Set<string>();
  for (const node of ledger.registered_nodes) {
    if (seenIds.has(node.node_id)) {
      throw new Error(`DUPLICATE_NODE_ID: ${node.node_id}`);
    }
    if (seenSpiffe.has(node.spiffe_svid)) {
      throw new Error(`DUPLICATE_SPIFFE_SVID: ${node.spiffe_svid}`);
    }
    seenIds.add(node.node_id);
    seenSpiffe.add(node.spiffe_svid);
    assertSafePublicUrl(node.live_health_url);
  }
  console.log(
    `✓ [STAGE 2] Zod Schema, <=64KB Wasm Bound & SSRF Guardrail verified (${ledger.registered_nodes.length} nodes).`
  );

  // 3. Live HTTPS Wire Probe against each registered node
  const leafHashes: string[] = [];
  for (const node of ledger.registered_nodes) {
    const t0 = performance.now();
    const res = await fetch(node.live_health_url, {
      method: 'GET',
      headers: { 'User-Agent': 'Cod3Eval-Sovereign-DMZ-Verifier/3.0' },
      signal: AbortSignal.timeout(8000),
    });
    const rttMs = Number((performance.now() - t0).toFixed(2));

    if (res.status >= 500) {
      throw new Error(
        `LIVE_WIRE_PROBE_FAILED: ${node.node_id} (${node.live_health_url}) returned HTTP ${res.status}`
      );
    }

    const leaf = crypto
      .createHash('sha256')
      .update(`${node.node_id}|${node.spiffe_svid}|${node.ed25519_public_key_hex}|${res.status}`)
      .digest('hex');
    leafHashes.push(leaf);

    console.log(
      `  ✓ Probed ${node.node_id} (${node.agent_or_server_name}) -> HTTP ${res.status} in ${rttMs}ms | Leaf: 0x${leaf.slice(0, 16)}...`
    );
  }

  // 4. Compute Final DMZ Merkle Root
  const dmzMerkleRoot = crypto
    .createHash('sha256')
    .update(leafHashes.join(''))
    .digest('hex');

  console.log('--------------------------------------------------------------------');
  console.log(`✅ ASRP-1.0 DMZ VERIFICATION PASSED (SAT)`);
  console.log(`🔒 DMZ Community Merkle Root: 0x${dmzMerkleRoot}`);
  console.log('====================================================================');
}

main().catch((err) => {
  console.error('❌ DMZ VERIFICATION FAILED:', err?.message || err);
  process.exit(1);
});
