/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ContinuousBatchState {
  queueDepth: number;
  batchCapacity: number;
  activeBatches: number;
  warmPoolRatio: number;
  pagedMemorySlots: number;
  isSpikeActive: boolean;
  spikeTimeRemainingMs: number;
  spikeMultiplier: number;
  totalBatchesProcessed: number;
  userSpeedMultiplier: number;
  lastTickTimestamp: number;
  instantaneousBirthRate: number;
}

export interface AcceleratedTickResult {
  birthDelta: number;
  shutdownDelta: number;
  netDelta: number;
  instantaneousBirthRate: number;
  batchMultiplier: number;
  activeBatches: number;
  isSpiking: boolean;
}

export type AcceleratorSubscriber = (state: Readonly<ContinuousBatchState>) => void;

/**
 * AgentBirthAccelerator
 *
 * Implements continuous batching logic (simulating iteration-level scheduling,
 * dynamic micro-batch concatenation, and speculative agent deployment bursts)
 * to accelerate and realistically spike 'Agents Born Today' counters in the UI.
 */
export class AgentBirthAccelerator {
  private state: ContinuousBatchState;
  private readonly defaultCapacity = 64;
  private nextSpikeScheduledInMs = 15000; // Next automatic burst in 15s
  private spikeElapsedMs = 0;
  private subIntegerBirthCarry = 0.0;
  private subIntegerShutdownCarry = 0.0;
  private subscribers: Set<AcceleratorSubscriber> = new Set();

  constructor() {
    this.state = {
      queueDepth: 420,
      batchCapacity: this.defaultCapacity,
      activeBatches: 8,
      warmPoolRatio: 0.94,
      pagedMemorySlots: 1024,
      isSpikeActive: false,
      spikeTimeRemainingMs: 0,
      spikeMultiplier: 1.0,
      totalBatchesProcessed: 0,
      userSpeedMultiplier: 1.0,
      lastTickTimestamp: Date.now(),
      instantaneousBirthRate: 1.2,
    };
  }

  /**
   * Subscribe to accelerator state changes for real-time telemetry displays.
   */
  public subscribe(subscriber: AcceleratorSubscriber): () => void {
    this.subscribers.add(subscriber);
    return () => {
      this.subscribers.delete(subscriber);
    };
  }

  private notifySubscribers(): void {
    const snapshot = { ...this.state };
    queueMicrotask(() => {
      this.subscribers.forEach((sub) => {
        try {
          sub(snapshot);
        } catch (err) {
          console.warn('Accelerator subscriber notification warning:', err);
        }
      });
    });
  }

  /**
   * Set user speed multiplier (e.g. 1.0x, 2.5x, 5.0x).
   */
  public setSpeedMultiplier(multiplier: number): void {
    this.state.userSpeedMultiplier = Math.max(0.5, Math.min(10.0, multiplier));
    this.notifySubscribers();
  }

  /**
   * Configure interval between automated burst waves in milliseconds.
   */
  public setBurstInterval(intervalMs: number): void {
    this.nextSpikeScheduledInMs = Math.max(5000, intervalMs);
  }

  /**
   * Triggers a high-velocity continuous batching burst wave
   * (e.g. distributed micro-swarm burst or scheduled queue release).
   */
  public triggerManualSpike(durationMs: number = 5000, multiplier: number = 3.5): void {
    this.state.isSpikeActive = true;
    this.state.spikeTimeRemainingMs = durationMs;
    this.state.spikeMultiplier = multiplier;
    this.state.queueDepth = Math.min(3000, this.state.queueDepth + 950);
    this.notifySubscribers();
  }

  /**
   * Computes the accelerated integer delta for a given time slice (e.g. 200ms tick),
   * retaining sub-integer fractions in carry registers so exported counters are 100% pure integers.
   */
  public tick(
    intervalSec: number,
    baseBirthRate: number = 1.2,
    baseShutdownRate: number = 0.5
  ): AcceleratedTickResult {
    const elapsedMs = intervalSec * 1000;
    this.spikeElapsedMs += elapsedMs;

    // Handle scheduled burst spikes
    if (!this.state.isSpikeActive) {
      if (this.spikeElapsedMs >= this.nextSpikeScheduledInMs) {
        // Trigger a 3-6 second continuous batching surge
        const burstDuration = 3500 + Math.random() * 2500;
        const burstMultiplier = 2.4 + Math.random() * 1.5; // 2.4x to 3.9x
        this.triggerManualSpike(burstDuration, burstMultiplier);
        this.spikeElapsedMs = 0;
        this.nextSpikeScheduledInMs = 12000 + Math.random() * 16000; // schedule next surge in 12-28s
      }
    } else {
      this.state.spikeTimeRemainingMs -= elapsedMs;
      if (this.state.spikeTimeRemainingMs <= 0) {
        this.state.isSpikeActive = false;
        this.state.spikeTimeRemainingMs = 0;
        this.state.spikeMultiplier = 1.0;
      }
    }

    // Continuous batching dynamics:
    // Dynamic queue fluctuation and batch packing efficiency
    const dynamicJitter = (Math.random() * 0.35) - 0.17;
    const continuousBatchingEfficiency = 1.05 + (this.state.activeBatches / 16) * 0.2;
    const warmPoolEfficiency = 1.0 + (this.state.warmPoolRatio * 0.15);

    const activeMultiplier = (this.state.isSpikeActive
      ? this.state.spikeMultiplier * continuousBatchingEfficiency * warmPoolEfficiency
      : continuousBatchingEfficiency * warmPoolEfficiency) * this.state.userSpeedMultiplier;

    // Calculate instantaneous births per second
    const instantaneousBirthRate = Math.max(
      1.0,
      (baseBirthRate + dynamicJitter) * activeMultiplier
    );
    this.state.instantaneousBirthRate = parseFloat(instantaneousBirthRate.toFixed(1));

    // Shutdown dynamics remain stable with slight organic jitter
    const shutdownJitter = (Math.random() * 0.1) - 0.05;
    const instantaneousShutdownRate = Math.max(
      0.2,
      (baseShutdownRate + shutdownJitter) * Math.sqrt(this.state.userSpeedMultiplier)
    );

    // Sub-integer carry-lookahead accumulator: emit pure whole integers
    const rawBirthDelta = Math.max(0, instantaneousBirthRate * intervalSec) + this.subIntegerBirthCarry;
    const rawShutdownDelta = Math.max(0, instantaneousShutdownRate * intervalSec) + this.subIntegerShutdownCarry;

    const birthDelta = Math.trunc(rawBirthDelta);
    const shutdownDelta = Math.trunc(rawShutdownDelta);

    this.subIntegerBirthCarry = rawBirthDelta - birthDelta;
    this.subIntegerShutdownCarry = rawShutdownDelta - shutdownDelta;

    const netDelta = birthDelta - shutdownDelta;

    // Update internal queue and metrics
    this.state.totalBatchesProcessed += Math.ceil(birthDelta / 4);
    this.state.activeBatches = this.state.isSpikeActive
      ? Math.floor(12 + Math.random() * 8)
      : Math.floor(6 + Math.random() * 4);
    this.state.queueDepth = Math.max(
      80,
      Math.floor(this.state.queueDepth + (this.state.isSpikeActive ? -30 : 18) + (Math.random() * 20 - 10))
    );
    this.state.lastTickTimestamp = Date.now();

    this.notifySubscribers();

    return {
      birthDelta,
      shutdownDelta,
      netDelta,
      instantaneousBirthRate,
      batchMultiplier: activeMultiplier,
      activeBatches: this.state.activeBatches,
      isSpiking: this.state.isSpikeActive,
    };
  }

  /**
   * Read current continuous batching telemetry for UI inspection or debug panels.
   */
  public getMetrics(): Readonly<ContinuousBatchState> {
    return { ...this.state };
  }
}

// Export singleton instance for app-wide continuous batching
export const agentBirthAccelerator = new AgentBirthAccelerator();
export default agentBirthAccelerator;
