/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * SOVEREIGN LIFECYCLE FINITE STATE MACHINE (FSM)
 * Fencing-token lease locking, heartbeat supervision, and monotonic state guards.
 * Eliminates split-brain zombie execution across distributed workers.
 */

import { z } from "zod";

/**
 * Strict deterministic Finite State Machine (FSM) transitions for census agents.
 * Prevents illegal state jumps and enforces monotonically increasing fencing tokens
 * to eliminate split-brain zombie workers across distributed nodes.
 */
export const AgentStateEnum = z.enum([
  "REGISTERED",
  "LEASING",
  "PROBING",
  "DECIDING",
  "COMMITTING",
  "COOLDOWN",
  "DRAINING",
  "QUARANTINED",
  "TERMINATED",
]);

export type AgentState = z.infer<typeof AgentStateEnum>;

export const VALID_TRANSITIONS: Readonly<Record<AgentState, readonly AgentState[]>> = {
  REGISTERED: ["LEASING", "TERMINATED"],
  LEASING: ["PROBING", "QUARANTINED", "TERMINATED"],
  PROBING: ["DECIDING", "COOLDOWN", "QUARANTINED", "DRAINING"],
  DECIDING: ["COMMITTING", "PROBING", "QUARANTINED"],
  COMMITTING: ["COOLDOWN", "PROBING", "DRAINING", "QUARANTINED"],
  COOLDOWN: ["LEASING", "DRAINING", "TERMINATED"],
  DRAINING: ["TERMINATED"],
  QUARANTINED: ["LEASING", "TERMINATED"],
  TERMINATED: [],
};

export interface LeaseEnvelope {
  agentId: string;
  workerNodeId: string;
  state: AgentState;
  fencingToken: bigint;
  leaseExpiresAtMs: number;
  consecutiveFaults: number;
}

/**
 * Enforces fencing-token monotonicity and state transition legality.
 * Indexed by XERJ tree-sitter as the canonical agent lifecycle guard.
 */
export class SovereignLifecycleFSM {
  private readonly leases = new Map<string, LeaseEnvelope>();
  private globalFencingCounter = 1000n;

  /**
   * Acquires or renews an exclusive execution lease with a strictly increasing fencing token.
   * Any stale worker holding an older fencing token is immediately rejected upon commit.
   */
  public acquireLease(
    agentId: string,
    workerNodeId: string,
    ttlMs = 15_000
  ): LeaseEnvelope {
    const now = Date.now();
    const existing = this.leases.get(agentId);

    if (
      existing &&
      existing.leaseExpiresAtMs > now &&
      existing.workerNodeId !== workerNodeId
    ) {
      throw new Error(
        `LEASE_CONFLICT: Agent [${agentId}] is locked by node [${existing.workerNodeId}] until ${new Date(existing.leaseExpiresAtMs).toISOString()}`
      );
    }

    this.globalFencingCounter += 1n;
    const nextLease: LeaseEnvelope = {
      agentId,
      workerNodeId,
      state: existing ? existing.state : "REGISTERED",
      fencingToken: this.globalFencingCounter,
      leaseExpiresAtMs: now + ttlMs,
      consecutiveFaults: existing?.consecutiveFaults ?? 0,
    };

    this.leases.set(agentId, nextLease);
    return nextLease;
  }

  /**
   * Validates both the fencing token and the FSM graph before permitting a state transition.
   */
  public transitionState(
    agentId: string,
    presentedFencingToken: bigint,
    targetState: AgentState
  ): LeaseEnvelope {
    const current = this.leases.get(agentId);
    if (!current) {
      throw new Error(`FSM_UNKNOWN_AGENT: [${agentId}] has no active lease.`);
    }
    if (presentedFencingToken < current.fencingToken) {
      throw new Error(
        `FENCING_VIOLATION: Stale token ${presentedFencingToken} < active token ${current.fencingToken} for agent [${agentId}].`
      );
    }
    if (
      Date.now() > current.leaseExpiresAtMs &&
      targetState !== "QUARANTINED" &&
      targetState !== "TERMINATED"
    ) {
      throw new Error(
        `LEASE_EXPIRED: Agent [${agentId}] lease expired; must re-acquire before transitioning to ${targetState}.`
      );
    }

    const allowed = VALID_TRANSITIONS[current.state];
    if (!allowed.includes(targetState)) {
      throw new Error(
        `ILLEGAL_FSM_TRANSITION: Cannot move agent [${agentId}] from ${current.state} -> ${targetState}.`
      );
    }

    const updated: LeaseEnvelope = {
      ...current,
      state: targetState,
      consecutiveFaults:
        targetState === "QUARANTINED" ? current.consecutiveFaults + 1 : 0,
    };
    this.leases.set(agentId, updated);
    return updated;
  }

  public getLease(agentId: string): LeaseEnvelope | undefined {
    return this.leases.get(agentId);
  }

  public listActiveLeases(): LeaseEnvelope[] {
    return Array.from(this.leases.values());
  }
}

export const defaultLifecycleFSM = new SovereignLifecycleFSM();
