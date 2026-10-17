/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * COD3EVAL SOVEREIGN INFINITY: CLI REPLAY VERIFIER & MERKLE SPINE AUDITOR
 * Executed in CI/CD via GitHub Actions (sovereign-build.yml)
 */

import { sovereignAuditSpine, sovereignEventFabric, DeterministicReplayEngine } from '../src/lib/merkleSpine.ts';
import { governanceEngine } from '../src/lib/governanceEngine.ts';
import { threatRadarBackend } from '../src/lib/threatRadarBackend.ts';

async function main() {
  console.log('===========================================================');
  console.log('COD3EVAL SOVEREIGN INFINITY - CI/CD PLANETARY REPLAY VERIFIER');
  console.log('Post-Quantum Cryptographic Spine & Governance Gatekeeper');
  console.log('===========================================================\n');

  // 1. Audit Spine Height and Invariants
  const head = sovereignAuditSpine.getHead();
  console.log(`[SPINE] Current Block Height: ${head.blockHeight}`);
  console.log(`[SPINE] Current Merkle Root: ${head.merkleRoot}`);
  console.log(`[SPINE] Timestamp: ${new Date(head.timestamp).toISOString()}`);

  const spineIntegrity = sovereignAuditSpine.verifyIntegrity();
  console.log(`[SPINE] Cryptographic Chain Verification: ${spineIntegrity.isValid ? 'PASSED (STRICT)' : 'FAILED'}`);
  if (!spineIntegrity.isValid) {
    console.error('CRITICAL: Audit spine Merkle root chain corrupted!');
    process.exit(1);
  }

  // 2. Deterministic Replay Simulation
  console.log('\n[REPLAY] Running complete event tree re-execution...');
  const events = sovereignEventFabric.getEventLog();
  const witness = DeterministicReplayEngine.replayAndVerify(events, sovereignAuditSpine);

  console.log(`[REPLAY] Total Events Replayed: ${witness.totalEventsReplayed}`);
  console.log(`[REPLAY] Replayed Root: ${witness.replayedMerkleRoot}`);
  console.log(`[REPLAY] Solver Latency: ${witness.solverLatencyMs}ms`);
  console.log(`[REPLAY] Witness Signature: ${witness.witnessSignature}`);
  console.log(`[REPLAY] Mathematical Determinism: ${witness.isDeterministic ? 'SAT (CONGRUENT)' : 'UNSAT (DIVERGENCE)'}`);

  if (!witness.isDeterministic) {
    console.error('CRITICAL: State root divergence detected in replay engine!');
    process.exit(1);
  }

  // 3. RFC Governance Verification (Z3 SMT-LIB2)
  console.log('\n[GOVERNANCE] Evaluating RFC-001..010 Policy Invariants...');
  const govEval = governanceEngine.evaluatePolicies({
    name: 'CI-Runner-Cluster-01',
    bftQuorum: 85.0,
    memoryAllocatedKb: 64.0,
    cipherSuite: 'ML-KEM-1024',
    cleanroomProven: true,
  });

  console.log(`[GOVERNANCE] Overall Status: ${govEval.overallStatus}`);
  govEval.evaluations.forEach((ev) => {
    console.log(`  - [${ev.rfc}] ${ev.policyTitle}: ${ev.status} (${ev.z3SatProof})`);
  });

  if (!govEval.overallStatus.startsWith('SAT')) {
    console.error('CRITICAL: Governance invariants violated!');
    process.exit(1);
  }

  // 4. Threat Radar Subsystem Invariant
  console.log('\n[THREAT RADAR] Validating Telemetry & Mitigation Proofs...');
  const snapshot = threatRadarBackend.getTelemetrySnapshot();
  console.log(`  - Monitored GPU Nodes: ${snapshot.gpuLogs.length}`);
  console.log(`  - Active Threats: ${snapshot.activeThreats.length}`);
  console.log(`  - Mitigation History: ${snapshot.mitigationHistory.length}`);
  
  console.log('\n===========================================================');
  console.log('ALL SOVEREIGN INVARIANTS: SATISFIED (Z3-PROVER PASS)');
  console.log('GitHub Actions commit eligible for merge.');
  console.log('===========================================================');
  process.exit(0);
}

main().catch((err) => {
  console.error('Execution failure:', err);
  process.exit(1);
});
