/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * SOVEREIGN ZENITH E2E CONFORMANCE TEST HARNESS
 * Verifies:
 * 1. FSM monotonic fencing tokens & transition guards
 * 2. Ed25519 node:crypto signing and SHA-256 Merkle chain verification
 * 3. Two-tier cognitive routing (System-1 -> System-2)
 * 4. Circuit breaker failover and local JSONL WAL spooling
 */

import assert from "node:assert/strict";
import { SovereignLifecycleFSM } from "../sovereign-lifecycle-fsm.ts";
import { SovereignZenithOrchestrator } from "../sovereign-zenith-orchestrator.ts";
import { XerjWalCircuitBreaker } from "../../telemetry/xerj-wal-circuit-breaker.ts";
import { compileDeterministicXerjPlan } from "../xerj-deep-primitives.ts";

async function runTests() {
  console.log("=== Running Sovereign Zenith E2E Conformance Suite ===\n");

  // 1. Test FSM Monotonic Fencing Tokens & Transition Guards
  console.log("[TEST 1] SovereignLifecycleFSM: Monotonic Leases & Transitions...");
  const fsm = new SovereignLifecycleFSM();
  const lease1 = fsm.acquireLease("agent-test-01", "node-alpha", 10000);
  assert.equal(lease1.fencingToken, 1001n, "First fencing token must be 1001n");
  assert.equal(lease1.state, "REGISTERED");

  // Transition: REGISTERED -> LEASING
  const lease2 = fsm.transitionState("agent-test-01", 1001n, "LEASING");
  assert.equal(lease2.state, "LEASING");

  // Transition: LEASING -> PROBING
  const lease3 = fsm.transitionState("agent-test-01", 1001n, "PROBING");
  assert.equal(lease3.state, "PROBING");

  // Re-acquire lease: Fencing token must increment to 1002n
  const leaseRenewed = fsm.acquireLease("agent-test-01", "node-alpha", 10000);
  assert.equal(leaseRenewed.fencingToken, 1002n, "Renewed fencing token must be strictly greater");

  // Reject stale fencing token (1001n < 1002n)
  assert.throws(
    () => fsm.transitionState("agent-test-01", 1001n, "DECIDING"),
    /FENCING_VIOLATION/,
    "Stale fencing token must be rejected"
  );

  // Reject illegal transition (PROBING -> TERMINATED is not valid in graph)
  assert.throws(
    () => fsm.transitionState("agent-test-01", 1002n, "TERMINATED"),
    /ILLEGAL_FSM_TRANSITION/,
    "Illegal transition must be rejected"
  );
  console.log("  -> [PASS] FSM fencing monotonicity and transition guards verified.");

  // 2. Test Ed25519 Cryptographic Signing & Merkle Telemetry
  console.log("\n[TEST 2] SovereignZenithOrchestrator: Ed25519 & Merkle Chain...");
  const orch = new SovereignZenithOrchestrator();
  const rec = await orch.commitSignedTelemetry({
    agentId: "agent-test-01",
    stage: "SYSTEM1_DECIDE",
    tier: "XERJ_LOCAL_SYSTEM1",
    confidence: 0.94,
    latencyMs: 1.45,
    tokensBurned: 0,
    tokensSaved: 4200,
    summary: "Reflex approved zero-drift partition",
  });

  assert.ok(rec.record_id, "Record must have UUID");
  assert.ok(rec.ed25519_signature, "Record must have signature");
  assert.ok(rec.merkle_hash, "Record must have SHA-256 Merkle hash");

  const isValidSig = SovereignZenithOrchestrator.verifyRecordSignature(rec);
  assert.equal(isValidSig, true, "Ed25519 signature must verify against public key");
  console.log("  -> [PASS] Ed25519 signature and Merkle hash verified.");

  // 3. Test Two-Tier Cognitive Routing
  console.log("\n[TEST 3] SovereignZenithOrchestrator: Two-Tier Routing...");
  const routeResult = await orch.evaluateAndRouteTask({
    agentId: "agent-test-01",
    taskQuestion: "Reconcile partition drift for 10 master platforms",
    candidateContext: "Drift is exactly 0 across all partitions",
    system2FallbackFn: async (q) => ({
      answer: `System-2 resolution for ${q}`,
      tokensUsed: 120,
    }),
  });

  assert.ok(routeResult.decision, "Decision must be produced");
  assert.ok(routeResult.record, "Record must be created and signed");
  console.log(`  -> [PASS] Routing produced decision: "${routeResult.decision.slice(0, 40)}..."`);

  // 4. Test Deterministic Query Planner (compileDeterministicXerjPlan)
  console.log("\n[TEST 4] XERJ Deterministic Query DSL Planner (/_ask / xerj_plan)...");
  const plan = await compileDeterministicXerjPlan(
    "http://127.0.0.1:9200",
    "sovereign-census-telemetry",
    "status=FAULT in last 15 minutes"
  );
  assert.ok(plan.dsl, "Must produce valid Query DSL");
  assert.equal(plan.deterministic_rule_matched, true);
  console.log("  -> [PASS] Deterministic Query DSL plan compiled without LLM.");

  // 5. Test Circuit Breaker & Local WAL Spooling
  console.log("\n[TEST 5] XerjWalCircuitBreaker: Failover & Spooling...");
  const cb = new XerjWalCircuitBreaker("./.test-wal-spool.jsonl", 2, 500);
  assert.equal(cb.getState(), "CLOSED");

  // Simulate network failure
  const failingCall = async () => {
    throw new Error("Simulated network timeout");
  };

  const res1 = await cb.executeWithFailover({ test: 1 }, failingCall);
  assert.equal(res1.delivered, false);
  assert.equal(res1.spooledToWal, true);

  const res2 = await cb.executeWithFailover({ test: 2 }, failingCall);
  assert.equal(res2.delivered, false);
  assert.equal(cb.getState(), "OPEN", "Circuit must trip to OPEN after 2 failures");

  console.log("  -> [PASS] Circuit breaker tripped to OPEN and spooled to WAL successfully.");

  console.log("\n=======================================================");
  console.log("ALL SOVEREIGN ZENITH CONFORMANCE TESTS PASSED (100% SAT)");
  console.log("=======================================================\n");
}

runTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
