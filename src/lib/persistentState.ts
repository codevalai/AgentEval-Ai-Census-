/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { doc, getDoc, setDoc, onSnapshot, Unsubscribe } from 'firebase/firestore';
import { db } from './firebase.ts';
import { CensusStats, DurableCensusState } from '../types/census.ts';
import { INITIAL_STATS } from '../data/initialData.ts';
import { GENESIS_YEAR_PRIOR_TO_TODAY } from './exactTickAccumulator.ts';
import { T0_GLOBAL_BASELINE, allocateHareNiemeyerIntegers } from './sovereignExportAndMatrixEngine.ts';

const CENSUS_DOC_ID = 'stats';
const LOCAL_NODE_ID = typeof crypto !== 'undefined' && crypto.randomUUID
  ? `node_${crypto.randomUUID().slice(0, 8)}`
  : `node_${Math.random().toString(36).substring(2, 10)}`;

export class PersistentCensusStateManager {
  private static instance: PersistentCensusStateManager;
  private cachedStats: CensusStats = { ...INITIAL_STATS };
  private isInitialized = false;
  private lastRemoteTimestamp = 0;
  private nodeId = LOCAL_NODE_ID;

  private constructor() {}

  public static getInstance(): PersistentCensusStateManager {
    if (!PersistentCensusStateManager.instance) {
      PersistentCensusStateManager.instance = new PersistentCensusStateManager();
    }
    return PersistentCensusStateManager.instance;
  }

  public getNodeId(): string {
    return this.nodeId;
  }

  /**
   * Helper to compute real continuous elapsed time growth from persisted durable state.
   * Emits 100% pure integers and guarantees netGrowthToday === agentsBornToday - agentsShutdownToday.
   */
  public hydrateStatsFromState(parsed: DurableCensusState): CensusStats {
    if (
      !parsed ||
      typeof parsed.totalAgents !== 'number' ||
      parsed.totalAgents < 342892410000 ||
      parsed.totalAgents > 5000000000000
    ) {
      return { ...INITIAL_STATS };
    }
    const now = Date.now();
    const elapsedSeconds = Math.min(3600, Math.max(0, (now - (parsed.lastPersistedTimestamp || now)) / 1000));

    const birthsDelta = Math.round(elapsedSeconds * INITIAL_STATS.birthsPerSec);
    const shutdownsDelta = Math.round(elapsedSeconds * INITIAL_STATS.shutdownsPerSec);
    const netDelta = birthsDelta - shutdownsDelta;

    const totalAgents = Math.round((parsed.totalAgents || INITIAL_STATS.totalAgents) + netDelta);
    const agentsBornToday = Math.max(
      INITIAL_STATS.agentsBornToday,
      Math.round((parsed.agentsBornToday || INITIAL_STATS.agentsBornToday) + birthsDelta)
    );
    const agentsShutdownToday = Math.max(
      INITIAL_STATS.agentsShutdownToday,
      Math.round((parsed.agentsShutdownToday || INITIAL_STATS.agentsShutdownToday) + shutdownsDelta)
    );
    const netGrowthToday = agentsBornToday - agentsShutdownToday;
    const agentsCreatedYear = GENESIS_YEAR_PRIOR_TO_TODAY + agentsBornToday;

    const [aiAgents, agiAgents, asiAgents, apexAgents] = allocateHareNiemeyerIntegers(totalAgents, [
      T0_GLOBAL_BASELINE.aiAgents,
      T0_GLOBAL_BASELINE.agiAgents,
      T0_GLOBAL_BASELINE.asiAgents,
      T0_GLOBAL_BASELINE.apexAgents,
    ]);

    return {
      ...INITIAL_STATS,
      totalAgents,
      aiAgents,
      agiAgents,
      asiAgents,
      apexAgents,
      agentsBornToday,
      agentsShutdownToday,
      netGrowthToday,
      agentsCreatedYear,
      bftQuorumPercent: parsed.bftQuorumPercent || INITIAL_STATS.bftQuorumPercent,
      defconLevel: parsed.defconLevel || INITIAL_STATS.defconLevel,
    };
  }

  /**
   * Synchronous accessor for initial state rendering.
   * Checks local client cache first so numbers never jump back to baseline on reload.
   */
  public loadInitialStats(): CensusStats {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const cached = localStorage.getItem('sovereign_census_state');
        if (cached) {
          const parsed = JSON.parse(cached) as DurableCensusState;
          if (
            !parsed ||
            typeof parsed.totalAgents !== 'number' ||
            parsed.totalAgents < 342892410000 ||
            parsed.totalAgents > 5000000000000
          ) {
            localStorage.removeItem('sovereign_census_state');
            return { ...INITIAL_STATS };
          }
          const restored = this.hydrateStatsFromState(parsed);
          this.cachedStats = restored;
          return restored;
        }
      }
    } catch (e) {
      console.warn('Local initial cache hydration notice:', e);
    }
    return { ...INITIAL_STATS };
  }

  /**
   * Reads persistent census stats directly from Firestore document (/census/stats).
   */
  public async loadStatsFromFirestore(): Promise<CensusStats> {
    try {
      const docRef = doc(db, 'census', CENSUS_DOC_ID);
      const snap = await getDoc(docRef);

      if (!snap.exists()) {
        await this.saveState(this.cachedStats, '0x3E189AB877C19D4EA18855F091', 48920);
        return { ...this.cachedStats };
      }

      const parsed = snap.data() as DurableCensusState;
      if (
        !parsed ||
        typeof parsed.totalAgents !== 'number' ||
        parsed.totalAgents < 342892410000 ||
        parsed.totalAgents > 5000000000000
      ) {
        await this.saveState(INITIAL_STATS, '0x3E189AB877C19D4EA18855F091', 48920);
        return { ...INITIAL_STATS };
      }
      this.lastRemoteTimestamp = parsed.lastPersistedTimestamp || Date.now();
      const restored = this.hydrateStatsFromState(parsed);
      this.cachedStats = restored;
      this.isInitialized = true;

      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem('sovereign_census_state', JSON.stringify(parsed));
        }
      } catch (_) {}

      return restored;
    } catch (e) {
      console.warn('Failed to load census state from Firestore, using baseline:', e);
      return { ...this.cachedStats };
    }
  }

  /**
   * Persists current census numbers directly into Firestore (/census/stats),
   * syncing data across distributed nodes and updating fast local cache.
   */
  public async saveState(
    stats: CensusStats,
    lastMerkleRoot: string,
    lastSpineHeight: number
  ): Promise<void> {
    this.cachedStats = { ...stats };
    const now = Date.now();
    this.lastRemoteTimestamp = now;

    const state: DurableCensusState & { lastUpdatedByNode?: string } = {
      version: 1,
      lastPersistedTimestamp: now,
      totalAgents: Math.round(stats.totalAgents),
      agentsBornToday: Math.round(stats.agentsBornToday),
      agentsShutdownToday: Math.round(stats.agentsShutdownToday),
      netGrowthToday: Math.round(stats.netGrowthToday),
      agentsCreatedYear: Math.round(stats.agentsCreatedYear),
      lastSpineHeight,
      lastMerkleRoot,
      bftQuorumPercent: stats.bftQuorumPercent,
      defconLevel: stats.defconLevel,
      lastUpdatedByNode: this.nodeId,
    };

    // Fast local synchronous cache for zero-flash instant reload
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('sovereign_census_state', JSON.stringify(state));
      }
    } catch (_) {}

    try {
      const docRef = doc(db, 'census', CENSUS_DOC_ID);
      await setDoc(docRef, state, { merge: true });
    } catch (e) {
      console.error('Failed to persist census state to Firestore:', e);
    }
  }

  /**
   * Subscribes to real-time updates from Firestore (/census/stats)
   * so all multi-regional nodes stay synchronized without relying on localStorage.
   */
  public subscribeToFirestore(onUpdate: (stats: CensusStats) => void): Unsubscribe {
    const docRef = doc(db, 'census', CENSUS_DOC_ID);
    return onSnapshot(
      docRef,
      (snap) => {
        if (snap.exists()) {
          const parsed = snap.data() as DurableCensusState & { lastUpdatedByNode?: string };
          // If update originated from a remote node or contains a newer timestamp, hydrate
          if (parsed.lastUpdatedByNode !== this.nodeId || !this.isInitialized) {
            this.lastRemoteTimestamp = parsed.lastPersistedTimestamp || Date.now();
            const restored = this.hydrateStatsFromState(parsed);
            this.cachedStats = restored;
            this.isInitialized = true;
            onUpdate(restored);
          }
        }
      },
      (err) => {
        console.warn('Firestore census subscription notice:', err);
      }
    );
  }

  /**
   * Resets census stats in Firestore to genesis baseline.
   */
  public async resetToGenesis(): Promise<CensusStats> {
    const now = Date.now();
    this.lastRemoteTimestamp = now;

    const genesisState: DurableCensusState & { lastUpdatedByNode?: string } = {
      version: 1,
      lastPersistedTimestamp: now,
      totalAgents: Math.round(INITIAL_STATS.totalAgents),
      agentsBornToday: Math.round(INITIAL_STATS.agentsBornToday),
      agentsShutdownToday: Math.round(INITIAL_STATS.agentsShutdownToday),
      netGrowthToday: Math.round(INITIAL_STATS.netGrowthToday),
      agentsCreatedYear: Math.round(INITIAL_STATS.agentsCreatedYear),
      lastSpineHeight: 48920,
      lastMerkleRoot: '0x3E189AB877C19D4EA18855F091',
      bftQuorumPercent: INITIAL_STATS.bftQuorumPercent,
      defconLevel: INITIAL_STATS.defconLevel,
      lastUpdatedByNode: this.nodeId,
    };

    try {
      const docRef = doc(db, 'census', CENSUS_DOC_ID);
      await setDoc(docRef, genesisState);
    } catch (err) {
      console.warn('Failed to reset census state in Firestore:', err);
    }

    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('sovereign_census_state', JSON.stringify(genesisState));
      }
    } catch (_) {}

    this.cachedStats = { ...INITIAL_STATS };
    return { ...INITIAL_STATS };
  }
}

export const persistentCensusState = PersistentCensusStateManager.getInstance();
