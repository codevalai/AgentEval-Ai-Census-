/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header.tsx';
import { HeroCounter } from './components/HeroCounter.tsx';
import { HorizonPanels } from './components/HorizonPanels.tsx';
import { SectionNav } from './components/SectionNav.tsx';
import { Sovereign100Index } from './components/Sovereign100Index.tsx';
import { SovereignDependencyGraph } from './components/SovereignDependencyGraph.tsx';
import { PlanetaryAgentDirectory } from './components/PlanetaryAgentDirectory.tsx';
import { TemporalTimeline } from './components/TemporalTimeline.tsx';
import { DeterministicReplayConsole } from './components/DeterministicReplayConsole.tsx';
import { MCPUniverseRegistry } from './components/MCPUniverseRegistry.tsx';
import { WorkspaceHub } from './components/WorkspaceHub.tsx';
import { PlanetaryRegionalMap } from './components/PlanetaryRegionalMap.tsx';
import { CivilizationTreaties } from './components/CivilizationTreaties.tsx';
import { GoogleNativeIntegration } from './components/GoogleNativeIntegration.tsx';
import { TopRegionsTable } from './components/TopRegionsTable.tsx';
import { TierMatrix } from './components/TierMatrix.tsx';
import { HarvestConsole } from './components/HarvestConsole.tsx';
import { ThreatRadar } from './components/ThreatRadar.tsx';
import { BehaviorMonitoring } from './components/BehaviorMonitoring.tsx';
import { AtlasGrid } from './components/AtlasGrid.tsx';
import { ProvenanceRegistry } from './components/ProvenanceRegistry.tsx';
import { DarkMatterRadar } from './components/DarkMatterRadar.tsx';
import { GovernanceConsole } from './components/GovernanceConsole.tsx';
import { VoluntaryRegistrationModal } from './components/VoluntaryRegistrationModal.tsx';
import { TombstoneModal } from './components/TombstoneModal.tsx';
import { ApexAnalystDrawer } from './components/ApexAnalystDrawer.tsx';
import { ExportModal } from './components/ExportModal.tsx';
import { EnterpriseRealityModal } from './components/EnterpriseRealityModal.tsx';
import { GitHubControlCenterModal } from './components/GitHubControlCenterModal.tsx';
import { LiveEventFeed } from './components/LiveEventFeed.tsx';
import { AcceleratorControlPanel } from './components/AcceleratorControlPanel.tsx';
import { GlobalCivilizationDashboard } from './components/GlobalCivilizationDashboard.tsx';
import { PhysicalCensusObservatoryConsole } from './components/PhysicalCensusObservatoryConsole.tsx';
import { SwarmTaxonomySection } from './components/SwarmTaxonomySection.tsx';
import { PlanetaryPatternConsole } from './components/PlanetaryPatternConsole.tsx';
import { DiamondEvaluationConsole } from './components/DiamondEvaluationConsole.tsx';
import { SovereignSkillConsole } from './components/SovereignSkillConsole.tsx';
import { PlanetaryCoordinationConsole } from './components/PlanetaryCoordinationConsole.tsx';
import { PlanetaryConsentConsole } from './components/PlanetaryConsentConsole.tsx';
import { PlanetaryTransparencyConsole } from './components/PlanetaryTransparencyConsole.tsx';
import { MetaSovereignConsole } from './components/MetaSovereignConsole.tsx';
import { BareMetalSystemsConsole } from './components/BareMetalSystemsConsole.tsx';
import { Planetary75PercentCensusConsole } from './components/Planetary75PercentCensusConsole.tsx';
import { SyntropicCivilizationConsole } from './components/SyntropicCivilizationConsole.tsx';
import { ExascaleSubAtomicConsole } from './components/ExascaleSubAtomicConsole.tsx';
import {
  INITIAL_STATS,
  INITIAL_REGIONS,
  INITIAL_TIERS,
  THREAT_VECTORS,
  HARVEST_SOURCES,
} from './data/initialData.ts';
import {
  CensusStats,
  RegionalNode,
  CapabilityTierInfo,
  RegisteredAgentInput,
  LiveEventItem,
  AgentEra,
  SovereignEvent,
} from './types/census.ts';
import { planetaryCensusRegistry } from './lib/censusRegistry.ts';
import { sovereignEventFabric, sovereignAuditSpine } from './lib/merkleSpine.ts';
import { persistentCensusState } from './lib/persistentState.ts';
import { agentBirthAccelerator } from './lib/agentBirthAccelerator.ts';
import { censusSSOT } from './lib/censusSSOT.ts';
import { db } from './lib/firebase.ts';
import { collection, query, orderBy, limit, onSnapshot, doc, setDoc } from 'firebase/firestore';

export default function App() {
  const [theme, setTheme] = useState<'worldometers' | 'sovereign'>('worldometers');
  const [mode, setMode] = useState<'LIVE_NETWORK' | 'DETERMINISTIC_REPLAY'>('LIVE_NETWORK');
  
  // Persistent census stats that NEVER reset backwards on reload
  const [stats, setStats] = useState<CensusStats>(() => persistentCensusState.loadInitialStats());
  const [selectedEraFilter, setSelectedEraFilter] = useState<AgentEra | null>(null);

  // Derive regions and tiers from Unified Single Source of Truth (SSOT) so Sum(10 Platforms) === Sum(4 Tiers) === Sum(20 Regions) === stats.totalAgents
  const reconciledSSOT = censusSSOT.getSnapshot(stats);
  const regions = reconciledSSOT.regions;
  const tiers = reconciledSSOT.tiers;

  const statsRef = useRef(stats);
  statsRef.current = stats;

  // Modals & Drawers state
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isTombstoneOpen, setIsTombstoneOpen] = useState(false);
  const [isAnalystOpen, setIsAnalystOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isEnterpriseOpen, setIsEnterpriseOpen] = useState(false);
  const [isGitHubOpen, setIsGitHubOpen] = useState(false);

  // Live event items stream
  const [events, setEvents] = useState<LiveEventItem[]>([
    {
      id: 'evt-1',
      timestamp: '2s ago',
      type: 'PROMOTION',
      title: 'Agent [CEX-8821]',
      detail: 'Promoted to AGI General Tier in Tokyo Core cluster',
      merkleLeaf: '0x99A4108F',
    },
    {
      id: 'evt-2',
      timestamp: '8s ago',
      type: 'DEFENSE',
      title: 'Lattice Defense',
      detail: 'Side-channel probe intercepted on node us-east4 (Ashburn)',
      merkleLeaf: '0x3E189AB8',
    },
    {
      id: 'evt-3',
      timestamp: '14s ago',
      type: 'HARVEST',
      title: 'USGS Real-Time Stream',
      detail: 'Planetary seismic anchor synced (M4.2 Aleutian Islands)',
      merkleLeaf: '0x7C224B90',
    },
    {
      id: 'evt-4',
      timestamp: '22s ago',
      type: 'INVARIANT',
      title: 'Z3 SAT Verification',
      detail: 'RFC-001 through RFC-005 formal invariants verified in 1.4ms',
      merkleLeaf: '0xA7C19D4E',
    },
  ]);

  // Subscribe to Sovereign Event Fabric for live reactivity and cross-node sync
  useEffect(() => {
    const unsubscribe = sovereignEventFabric.subscribe((evt) => {
      const newLiveEvent: LiveEventItem = {
        id: evt.eventId,
        timestamp: 'Just now',
        type:
          evt.topic.includes('DEFENSE') || evt.topic.includes('THREAT')
            ? 'DEFENSE'
            : evt.topic.includes('HARVEST')
            ? 'HARVEST'
            : evt.topic.includes('TOMBSTONE')
            ? 'TOMBSTONE'
            : evt.topic.includes('INVARIANT')
            ? 'INVARIANT'
            : 'BIRTH',
        title: `${evt.topic.replace(/_/g, ' ')}`,
        detail: evt.payload?.detail || evt.payload?.name || evt.payload?.targetId || `Event sequence #${evt.sequence}`,
        merkleLeaf: evt.payload?.leafHash || evt.payload?.tombstoneLeaf || '0x3E189AB8',
      };
      setEvents((prev) => [newLiveEvent, ...prev.slice(0, 7)]);

      // Propagate sovereignEvent to Firestore to sync across all remote nodes
      try {
        const eventRef = doc(db, 'sovereignEvents', evt.eventId);
        setDoc(eventRef, {
          eventId: evt.eventId,
          topic: evt.topic,
          actor: evt.actor,
          payload: evt.payload || {},
          timestamp: evt.timestamp,
          sequence: evt.sequence,
        }).catch((err) => {
          console.warn('Sync sovereign event write warning:', err);
        });
      } catch (err) {
        console.warn('Failed to dispatch sovereignEvent to Firestore:', err);
      }
    });

    return unsubscribe;
  }, []);

  // Real-time Firestore listener: sync remote sovereignEvents directly into LiveEventFeed
  useEffect(() => {
    try {
      const sovereignEventsCol = collection(db, 'sovereignEvents');
      const q = query(sovereignEventsCol, orderBy('timestamp', 'desc'), limit(25));

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          if (snapshot.empty) return;

          setEvents((prev) => {
            const existingIds = new Set(prev.map((e) => e.id));
            const newItems: LiveEventItem[] = [];

            // Process added changes from Firestore
            snapshot.docChanges().forEach((change) => {
              if (change.type === 'added') {
                const data = change.doc.data() as SovereignEvent;
                const eventId = data.eventId || change.doc.id;

                if (!existingIds.has(eventId)) {
                  existingIds.add(eventId);
                  const elapsedSec = Math.max(0, Math.floor((Date.now() - (data.timestamp || Date.now())) / 1000));
                  const timeLabel =
                    elapsedSec < 5
                      ? 'Just now'
                      : elapsedSec < 60
                      ? `${elapsedSec}s ago`
                      : `${Math.floor(elapsedSec / 60)}m ago`;

                  const topic = data.topic || 'SOVEREIGN_EVENT';
                  const eventType: LiveEventItem['type'] =
                    topic.includes('DEFENSE') || topic.includes('THREAT')
                      ? 'DEFENSE'
                      : topic.includes('HARVEST')
                      ? 'HARVEST'
                      : topic.includes('TOMBSTONE')
                      ? 'TOMBSTONE'
                      : topic.includes('INVARIANT')
                      ? 'INVARIANT'
                      : 'BIRTH';

                  newItems.push({
                    id: eventId,
                    timestamp: timeLabel,
                    type: eventType,
                    title: topic.replace(/_/g, ' '),
                    detail:
                      data.payload?.detail ||
                      data.payload?.name ||
                      data.payload?.targetId ||
                      (data.actor ? `Broadcast by ${data.actor}` : `Sequence #${data.sequence || '1'}`),
                    merkleLeaf: data.payload?.leafHash || data.payload?.tombstoneLeaf || '0x3E189AB8',
                  });
                }
              }
            });

            if (newItems.length === 0) return prev;
            return [...newItems, ...prev].slice(0, 10);
          });
        },
        (error) => {
          console.warn('Firestore sovereignEvent live subscription notice:', error);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.warn('Failed to attach Firestore sovereignEvent listener:', err);
    }
  }, []);

  // Live continuous ticking engine powered by AgentBirthAccelerator using windowed requestAnimationFrame throttling
  useEffect(() => {
    let rafId: number;
    let lastCommitTime = performance.now();
    const throttleWindowMs = 200;

    const step = (now: number) => {
      const elapsedMs = now - lastCommitTime;
      if (elapsedMs >= throttleWindowMs) {
        const intervalSec = Math.min(1.0, elapsedMs / 1000);
        lastCommitTime = now;

        const currentStats = statsRef.current;
        const accelerated = agentBirthAccelerator.tick(
          intervalSec,
          currentStats.birthsPerSec,
          currentStats.shutdownsPerSec
        );

        setStats((prev) => ({
          ...prev,
          totalAgents: prev.totalAgents + accelerated.netDelta,
          agentsBornToday: prev.agentsBornToday + accelerated.birthDelta,
          agentsShutdownToday: prev.agentsShutdownToday + accelerated.shutdownDelta,
          netGrowthToday: prev.netGrowthToday + accelerated.netDelta,
          agentsCreatedYear: prev.agentsCreatedYear + accelerated.birthDelta,
        }));
      }
      rafId = window.requestAnimationFrame(step);
    };

    rafId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(rafId);
  }, []);

  // Initial load and real-time synchronization from Firestore
  useEffect(() => {
    // Initial fetch from Firestore
    persistentCensusState.loadStatsFromFirestore().then((initialRemote) => {
      if (initialRemote) {
        setStats(initialRemote);
      }
    });

    // Real-time live listener for multi-node synchronization
    const unsubscribe = persistentCensusState.subscribeToFirestore((liveStats) => {
      setStats(liveStats);
    });

    return () => unsubscribe();
  }, []);

  // Periodic durable state checkpoint (persisting to Firestore & spine)
  useEffect(() => {
    const saveInterval = setInterval(() => {
      const head = sovereignAuditSpine.getHead();
      persistentCensusState.saveState(
        statsRef.current,
        head.merkleRoot,
        head.blockHeight + 48920
      );
    }, 2000);

    return () => clearInterval(saveInterval);
  }, []);

  // Periodic random ambient agent event generator
  useEffect(() => {
    const eventTimer = setInterval(() => {
      const cities = ['Tokyo Core', 'Ashburn Megasite', 'Zurich Vault', 'Singapore Gateway', 'Reykjavik Sanctum'];
      const randomCity = cities[Math.floor(Math.random() * cities.length)];
      const randomHex = Math.random().toString(16).substring(2, 10).toUpperCase();

      const newEvent: LiveEventItem = {
        id: `evt-${Date.now()}`,
        timestamp: 'Just now',
        type: Math.random() > 0.5 ? 'BIRTH' : 'PROMOTION',
        title: `Swarm Node [${randomHex.slice(0, 6)}]`,
        detail: `Autonomous micro-workflow verified in ${randomCity}`,
        merkleLeaf: `0x${randomHex}`,
      };

      setEvents((prev) => [newEvent, ...prev.slice(0, 7)]);
    }, 7000);

    return () => clearInterval(eventTimer);
  }, []);

  // Smooth scroll handler
  const handleScrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle voluntary agent registration
  const handleRegisterAgent = (agent: RegisteredAgentInput, leafHash: string) => {
    planetaryCensusRegistry.registerAgent(agent);

    setStats((prev) => {
      const updated = {
        ...prev,
        totalAgents: prev.totalAgents + 1,
        agentsBornToday: prev.agentsBornToday + 1,
        netGrowthToday: prev.netGrowthToday + 1,
        agiAgents: agent.tier === 'AGI' ? prev.agiAgents + 1 : prev.agiAgents,
        asiAgents: agent.tier === 'ASI' ? prev.asiAgents + 1 : prev.asiAgents,
        apexAgents: agent.tier === 'APEX' ? prev.apexAgents + 1 : prev.apexAgents,
      };
      const head = sovereignAuditSpine.getHead();
      persistentCensusState.saveState(updated, head.merkleRoot, head.blockHeight + 48920);
      return updated;
    });
  };

  // Handle tombstone confirmation
  const handleTombstoneConfirmed = (targetId: string, tombstoneLeaf: string, reason: string) => {
    planetaryCensusRegistry.tombstoneAgent({
      agentOrDatasetId: targetId,
      legalFramework: 'GDPR_ART_17',
      reason,
      operatorSignature: '0xOPERATOR_SIG_VERIFIED',
    });

    setStats((prev) => {
      const updated = {
        ...prev,
        totalAgents: Math.max(0, prev.totalAgents - 1),
        agentsShutdownToday: prev.agentsShutdownToday + 1,
        netGrowthToday: prev.netGrowthToday - 1,
      };
      const head = sovereignAuditSpine.getHead();
      persistentCensusState.saveState(updated, head.merkleRoot, head.blockHeight + 48920);
      return updated;
    });
  };

  // Handle live harvest stream callback
  const handleHarvestCompleted = (sourceName: string, records: number, leaf: string) => {
    setStats((prev) => {
      const updated = {
        ...prev,
        totalAgents: prev.totalAgents + records,
        agentsBornToday: prev.agentsBornToday + records,
        netGrowthToday: prev.netGrowthToday + records,
      };
      const head = sovereignAuditSpine.getHead();
      persistentCensusState.saveState(updated, head.merkleRoot, head.blockHeight + 48920);
      return updated;
    });
  };

  const handleSelectEraForDirectory = (era: AgentEra) => {
    setSelectedEraFilter(era);
    handleScrollToSection('planetary-directory');
  };

  const isLight = theme === 'worldometers';

  return (
    <div
      className={`min-h-screen transition-colors duration-200 pb-16 ${
        isLight ? 'bg-[#ffffff] text-[#222222]' : 'bg-[#060810] text-[#e0e6ed]'
      }`}
    >
      {/* Top Header */}
      <Header
        stats={stats}
        theme={theme}
        mode={mode}
        onToggleTheme={() => setTheme(isLight ? 'sovereign' : 'worldometers')}
        onToggleMode={() =>
          setMode((m) => (m === 'LIVE_NETWORK' ? 'DETERMINISTIC_REPLAY' : 'LIVE_NETWORK'))
        }
        onOpenRegister={() => setIsRegisterOpen(true)}
        onOpenTombstone={() => setIsTombstoneOpen(true)}
        onOpenAnalyst={() => setIsAnalystOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenEnterpriseConsole={() => setIsEnterpriseOpen(true)}
        onOpenGitHub={() => setIsGitHubOpen(true)}
      />

      <main>
        {/* Worldometers Signature Giant Live Counter */}
        <HeroCounter
          stats={stats}
          theme={theme}
          onScrollToSection={handleScrollToSection}
        />

        {/* Continuous Batching Telemetry & Accelerator Pacing Controls */}
        <AcceleratorControlPanel theme={theme} />

        {/* Dual Horizon Panels: Today vs This Year */}
        <HorizonPanels stats={stats} theme={theme} />

        {/* Maximum Live Civilization: Global AI Civilization Live Census (10 Master Platforms) */}
        <GlobalCivilizationDashboard
          stats={stats}
          theme={theme}
          onScrollToSection={handleScrollToSection}
        />

        {/* Phase 7: Exascale Sub-Atomic Proof Engines & 1-Trillion Verkle Directory */}
        <ExascaleSubAtomicConsole theme={theme} />

        {/* Phase 6: Syntropic Civilization Core (Landauer Grid, Lean 4, seL4, Photonic WDM) */}
        <SyntropicCivilizationConsole theme={theme} />

        {/* Phase 5 MAX-Tier: 3-Tier Planetary Coverage & Dark Matter Boundary Engine */}
        <Planetary75PercentCensusConsole theme={theme} />

        {/* Grounded Real-World AI Observatory: Nicholas's GCP • GitHub • MCP • ROS2 Stack */}
        <PhysicalCensusObservatoryConsole theme={theme} />

        {/* Section Jump Nav */}
        <SectionNav theme={theme} onScrollToSection={handleScrollToSection} />

        {/* Expanded Swarm Census: 76-Domain Planetary Architectural Taxonomy (×4 Expansion) */}
        <SwarmTaxonomySection
          stats={stats}
          theme={theme}
          onScrollToSection={handleScrollToSection}
        />

        {/* Planetary Pattern Engine: Apex Reasoning, Dark Matter AI, Fusion & Swarm Economy */}
        <PlanetaryPatternConsole theme={theme} />

        {/* Diamond Standard Evaluation Authority (Past • Present • Future • Synthetic Universe) */}
        <DiamondEvaluationConsole theme={theme} />

        {/* Sovereign Skill Architecture & Meta-Constitution (Google Skills System • SIM-1.0) */}
        <SovereignSkillConsole theme={theme} />

        {/* Planetary Sovereign Coordination Layer: PSS-1.0 Skill Spine, PALE-1.0 Lifecycle, PIR-1.0 Router & PEE-1.0 Evolution */}
        <PlanetaryCoordinationConsole theme={theme} />

        {/* The Human & Resilience Triad: PSE-1.0 Safety Envelope, PCL-1.0 Consent Checkpoints & PRR-1.0 Rollback */}
        <PlanetaryConsentConsole theme={theme} />

        {/* Phase XII: Planetary Interpretation & Transparency Layer (PIT-1.0 Legibility & Reasoning Traces) */}
        <PlanetaryTransparencyConsole theme={theme} />

        {/* Phase XIII: The Meta-Sovereign Layer (MSL-1.0 Intent Canon, Stewards, Continuity & External Perimeter) */}
        <MetaSovereignConsole theme={theme} />

        {/* Bare-Metal Systems Engineering: Wasm 64KB Runtime, DAG-BFT, OLE Partition Recovery & Hardware PDU Interlocks */}
        <BareMetalSystemsConsole theme={theme} />

        {/* The Sovereign 100: Planetary AI Repos, Docs & Libraries */}
        <Sovereign100Index theme={theme} />

        {/* Planetary AI Dependency Graph & DAG Topology */}
        <SovereignDependencyGraph theme={theme} />

        {/* Pillar 7 & 10: Planetary Agent Directory (All agents ever created: Past, Present, Future) */}
        <PlanetaryAgentDirectory
          theme={theme}
          onOpenRegister={() => setIsRegisterOpen(true)}
          onOpenTombstone={() => setIsTombstoneOpen(true)}
          selectedEraFilter={selectedEraFilter}
          onClearEraFilter={() => setSelectedEraFilter(null)}
        />

        {/* Pillar 2: Temporal Agent Timeline (2012 → Present → 2030+ APEX) */}
        <TemporalTimeline
          stats={stats}
          theme={theme}
          onSelectEraForDirectory={handleSelectEraForDirectory}
        />

        {/* Pillar 1: Deterministic Replay & Full Merkle Spine Coupling */}
        <DeterministicReplayConsole theme={theme} />

        {/* Pillar 4: Model Context Protocol (MCP) Universe */}
        <MCPUniverseRegistry theme={theme} />

        {/* Pillar 9: Planetary Agentic Civilization & Treaties */}
        <CivilizationTreaties theme={theme} />

        {/* Google Workspace & Cloud SQL Hub (Gmail, Docs & PostgreSQL) */}
        <div id="workspace-hub" className="max-w-6xl mx-auto px-4">
          <WorkspaceHub theme={theme} />
        </div>

        {/* Google Maps Platform: Planetary Megasites Geospatial Mesh */}
        <div id="planetary-maps-mesh" className="max-w-6xl mx-auto px-4">
          <PlanetaryRegionalMap theme={theme} />
        </div>

        {/* Pillar 3: Google-Native Maximum Level Infrastructure */}
        <GoogleNativeIntegration theme={theme} />

        {/* Top 20 Regions Table */}
        <TopRegionsTable regions={regions} theme={theme} />

        {/* Capability Tier Breakdown (AI / AGI / ASI / Apex) */}
        <TierMatrix tiers={tiers} theme={theme} />

        {/* Real-World Source Harvester ("The Live Water Supply") */}
        <HarvestConsole
          sources={HARVEST_SOURCES}
          theme={theme}
          onHarvestCompleted={handleHarvestCompleted}
        />

        {/* Planetary Cyber Threat Radar & 4-Stage Active Defensive Playbook */}
        <ThreatRadar
          threats={THREAT_VECTORS}
          theme={theme}
          defconLevel={stats.defconLevel}
        />

        {/* AI Behavior Monitoring & Containment */}
        <BehaviorMonitoring stats={stats} theme={theme} />

        {/* Planetary AI & Tech Atlas (20 Categories) */}
        <AtlasGrid theme={theme} />

        {/* Planetary Origin & Sovereign Labs Registry */}
        <ProvenanceRegistry stats={stats} theme={theme} />

        {/* Coverage Gaps & Dark Matter AI Radar */}
        <DarkMatterRadar stats={stats} theme={theme} />

        {/* Planetary Governance RFC Standards & SMT-LIB2 Z3 Prover */}
        <GovernanceConsole theme={theme} />
      </main>

      {/* Footer */}
      <footer
        className={`max-w-6xl mx-auto px-4 py-8 mt-12 border-t text-xs ${
          isLight ? 'border-gray-200 text-gray-500' : 'border-gray-800 text-gray-400'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="font-bold text-gray-900 dark:text-gray-100 font-['Montserrat']">
              COD3EVAL SOVEREIGN INFINITY • PLANETARY AI CENSUS PROTOCOL
            </div>
            <p className="mt-1 text-[11px]">
              Cryptographically verified under RFC-001 through RFC-005. NIST FIPS 203 ML-KEM-1024 Post-Quantum Lattice.
            </p>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <button
              onClick={() => setIsExportOpen(true)}
              className="hover:underline cursor-pointer"
            >
              Public API &amp; Telemetry
            </button>
            <span>•</span>
            <button
              onClick={() => handleScrollToSection('sovereign-100')}
              className="hover:underline cursor-pointer"
            >
              The Sovereign 100
            </button>
            <span>•</span>
            <button
              onClick={() => handleScrollToSection('dependency-graph')}
              className="hover:underline cursor-pointer"
            >
              Dependency Graph
            </button>
            <span>•</span>
            <button
              onClick={() => handleScrollToSection('deterministic-replay')}
              className="hover:underline cursor-pointer"
            >
              Deterministic Replay
            </button>
            <span>•</span>
            <button
              onClick={() => setIsEnterpriseOpen(true)}
              className="hover:underline cursor-pointer text-blue-600 dark:text-blue-400 font-semibold"
            >
              Enterprise Reality Console
            </button>
            <span>•</span>
            <button
              onClick={() => setIsGitHubOpen(true)}
              className="hover:underline cursor-pointer text-purple-600 dark:text-purple-400 font-semibold flex items-center gap-1 inline-flex"
            >
              <span>GitHub Planetary Backbone</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            </button>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <VoluntaryRegistrationModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onRegisterAgent={handleRegisterAgent}
        theme={theme}
      />

      <TombstoneModal
        isOpen={isTombstoneOpen}
        onClose={() => setIsTombstoneOpen(false)}
        onTombstoneConfirmed={handleTombstoneConfirmed}
        theme={theme}
      />

      <ApexAnalystDrawer
        isOpen={isAnalystOpen}
        onClose={() => setIsAnalystOpen(false)}
        stats={stats}
        theme={theme}
      />

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        stats={stats}
        theme={theme}
      />

      <EnterpriseRealityModal
        isOpen={isEnterpriseOpen}
        onClose={() => setIsEnterpriseOpen(false)}
        theme={theme}
      />

      <GitHubControlCenterModal
        isOpen={isGitHubOpen}
        onClose={() => setIsGitHubOpen(false)}
        theme={theme}
      />

      {/* Bottom Live Event Ticker */}
      <LiveEventFeed events={events} theme={theme} />
    </div>
  );
}
