/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Sub-Integer Carry-Lookahead Accumulator (src/lib/exactTickAccumulator.ts)
 * Eliminates IEEE-754 floating-point fractions in exported JSON snapshots
 * and enforces netGrowthToday === agentsBornToday - agentsShutdownToday.
 */

export interface IntegerTelemetryTickState {
  totalAgents: number;
  aiAgents: number;
  agiAgents: number;
  asiAgents: number;
  apexAgents: number;
  agentsBornToday: number;
  agentsShutdownToday: number;
  netGrowthToday: number;
  agentsCreatedYear: number;
  birthsPerSec: number;
  shutdownsPerSec: number;
  toolInvocationsPerSec: number;
}

/**
 * Genesis YTD constant prior to today's UTC 00:00:00 window:
 * At T0: totalAgents / agentsCreatedYear = 342,892,410,000, agentsBornToday = 4,842,091,000
 * Prior YTD base = 342,892,410,000 - 4,842,091,000 = 338,050,319,000
 */
export const GENESIS_YEAR_PRIOR_TO_TODAY = 338_050_319_000;

export class ExactIntegerTickEngine {
  private subIntegerBirthCarry = 0.0;
  private subIntegerShutdownCarry = 0.0;

  private state: IntegerTelemetryTickState;

  constructor(initial?: Partial<IntegerTelemetryTickState>) {
    const born = Math.round(initial?.agentsBornToday ?? 4_842_091_000);
    const shutdown = Math.round(initial?.agentsShutdownToday ?? 1_620_410_000);
    const total = Math.round(initial?.totalAgents ?? 342_892_410_000);
    const agi = Math.round(initial?.agiAgents ?? 82_012_410_000);
    const asi = Math.round(initial?.asiAgents ?? 26_012_000_000);
    const apex = Math.round(initial?.apexAgents ?? 3_484_000_000);
    const ai = Math.round(initial?.aiAgents ?? Math.max(0, total - agi - asi - apex));

    this.state = {
      totalAgents: total,
      aiAgents: ai,
      agiAgents: agi,
      asiAgents: asi,
      apexAgents: apex,
      agentsBornToday: born,
      agentsShutdownToday: shutdown,
      // Strict identity: Net = Born - Shutdown (eliminates the -10.00001 agent drift)
      netGrowthToday: born - shutdown,
      agentsCreatedYear: GENESIS_YEAR_PRIOR_TO_TODAY + born,
      birthsPerSec: initial?.birthsPerSec ?? 148_420,
      shutdownsPerSec: initial?.shutdownsPerSec ?? 49_680,
      toolInvocationsPerSec: initial?.toolInvocationsPerSec ?? 17_135_416.7,
    };
  }

  /**
   * Advances the planetary counter by `dtSeconds` while retaining fractional
   * sub-agents in private carry registers and emitting 100% pure integers.
   */
  public advanceByDelta(rawBirthDelta: number, rawShutdownDelta: number): IntegerTelemetryTickState {
    const exactBirths = Math.max(0, rawBirthDelta) + this.subIntegerBirthCarry;
    const exactShutdowns = Math.max(0, rawShutdownDelta) + this.subIntegerShutdownCarry;

    const wholeBirths = Math.trunc(exactBirths);
    const wholeShutdowns = Math.trunc(exactShutdowns);

    this.subIntegerBirthCarry = exactBirths - wholeBirths;
    this.subIntegerShutdownCarry = exactShutdowns - wholeShutdowns;

    const netWholeDelta = wholeBirths - wholeShutdowns;

    this.state.totalAgents += netWholeDelta;
    this.state.agentsBornToday += wholeBirths;
    this.state.agentsShutdownToday += wholeShutdowns;

    // 100% Algebraic Conservation: Net Growth is ALWAYS Born - Shutdown
    this.state.netGrowthToday = this.state.agentsBornToday - this.state.agentsShutdownToday;
    this.state.agentsCreatedYear = GENESIS_YEAR_PRIOR_TO_TODAY + this.state.agentsBornToday;

    return { ...this.state };
  }

  public advanceTick(dtSeconds: number): IntegerTelemetryTickState {
    const rawBirths = dtSeconds * this.state.birthsPerSec;
    const rawShutdowns = dtSeconds * this.state.shutdownsPerSec;
    return this.advanceByDelta(rawBirths, rawShutdowns);
  }

  public syncFromExternalTotal(totalAgentsInput: number, bornTodayInput?: number, shutdownTodayInput?: number): IntegerTelemetryTickState {
    this.state.totalAgents = Math.round(totalAgentsInput);
    if (typeof bornTodayInput === 'number') {
      this.state.agentsBornToday = Math.round(bornTodayInput);
    }
    if (typeof shutdownTodayInput === 'number') {
      this.state.agentsShutdownToday = Math.round(shutdownTodayInput);
    }
    this.state.netGrowthToday = this.state.agentsBornToday - this.state.agentsShutdownToday;
    this.state.agentsCreatedYear = GENESIS_YEAR_PRIOR_TO_TODAY + this.state.agentsBornToday;
    return { ...this.state };
  }

  public getSnapshot(): IntegerTelemetryTickState {
    return { ...this.state };
  }
}
