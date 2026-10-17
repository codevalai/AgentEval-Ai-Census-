/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Atom,
  Cpu,
  Layers,
  Network,
  ShieldCheck,
  ShieldAlert,
  Server,
  Activity,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Globe2,
  Lock,
  Search,
  Radio,
  FileCode,
  Terminal,
  Binary,
  Compass,
  Sliders,
  Send,
  Eye,
  RefreshCw,
  Zap,
  Flame,
  Satellite,
  X,
  Code2,
  Download,
  GitMerge,
} from 'lucide-react';
import {
  exascaleSubAtomicEngine,
  MasterDirectoryRecord,
  DetailedSpecimenDossier,
  Daiv128ByteLayout,
  LatentSteeringResult,
  AstMutationRecord,
  Sim20ManifoldClause,
  ExascalePhase7State,
} from '../services/exascaleSubAtomicEngine.ts';

interface ExascaleSubAtomicConsoleProps {
  theme: 'worldometers' | 'sovereign';
}

type TabMode =
  | 'master_directory'
  | 'autonomous_meta_synthesis'
  | 'latent_steering'
  | 'daiv_binary_inspector'
  | 'subatomic_quantum_neuromorphic'
  | 'interstellar_horizon';

export const ExascaleSubAtomicConsole: React.FC<ExascaleSubAtomicConsoleProps> = ({ theme }) => {
  const isLight = theme === 'worldometers';

  const [activeTab, setActiveTab] = useState<TabMode>('master_directory');
  const [directory, setDirectory] = useState<MasterDirectoryRecord[]>(() =>
    exascaleSubAtomicEngine.getMasterDirectory()
  );
  const [selectedDossier, setSelectedDossier] = useState<DetailedSpecimenDossier | null>(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [tierFilter, setTierFilter] = useState<string>('ALL');
  const [selectedDaivUid, setSelectedDaivUid] = useState<string>('AGT-LIVE-001');
  const [daivStruct, setDaivStruct] = useState<Daiv128ByteLayout>(() =>
    exascaleSubAtomicEngine.generateDaiv128ByteStruct('AGT-LIVE-001')
  );

  // Phase 7: Exascale 1-Trillion & Autonomous Meta-Synthesis State
  const [phase7State, setPhase7State] = useState<ExascalePhase7State>(() =>
    exascaleSubAtomicEngine.getPhase7State()
  );
  const [astMutations, setAstMutations] = useState<AstMutationRecord[]>(() =>
    exascaleSubAtomicEngine.getAstMutations()
  );
  const [selectedKernelForMutation, setSelectedKernelForMutation] = useState<string>(
    'APEX_Dynamic_DAG_Scheduler'
  );
  const [sim20Clauses, setSim20Clauses] = useState<Sim20ManifoldClause[]>(() =>
    exascaleSubAtomicEngine.getSim20Clauses()
  );

  // Latent steering state
  const [injectedDrift, setInjectedDrift] = useState<number>(0.08);
  const [steeringResult, setSteeringResult] = useState<LatentSteeringResult | null>(() =>
    exascaleSubAtomicEngine.evaluateAndSteerLatentVector(0.08)
  );

  // Sub-atomic quantum & neuromorphic state
  const [quantumState, setQuantumState] = useState<{
    eigenvalueMeasured: number;
    wavefunctionCollapsed: boolean;
    pec1ViolationDetected: boolean;
    superpositionStateHex: string;
  } | null>(null);
  const [neuromorphicStats, setNeuromorphicStats] = useState<{
    energyPerSpikePicojoules: number;
    activeSiliconSynapses: number;
    microjouleSavingsMultiplier: number;
  }>(() => exascaleSubAtomicEngine.simulateNeuromorphicCycle());

  // Interstellar state
  const [marsLightDelay, setMarsLightDelay] = useState<number>(14.2);
  const [interstellarResult, setInterstellarResult] = useState<{
    earthMarsLightMinutes: number;
    delayTolerantRollupStatus: string;
    novaProofDigest: string;
  } | null>(null);

  const [lastActionMsg, setLastActionMsg] = useState<string | null>(null);

  useEffect(() => {
    const unsub = exascaleSubAtomicEngine.subscribe(() => {
      setDirectory([...exascaleSubAtomicEngine.getMasterDirectory()]);
      setAstMutations([...exascaleSubAtomicEngine.getAstMutations()]);
      setSim20Clauses([...exascaleSubAtomicEngine.getSim20Clauses()]);
      setPhase7State({ ...exascaleSubAtomicEngine.getPhase7State() });
      setLastActionMsg(exascaleSubAtomicEngine.getLastActionMessage());
    });
    return unsub;
  }, []);

  const handleTogglePhase7Leap = () => {
    const updated = exascaleSubAtomicEngine.toggleExascale1TrillionLeap();
    setPhase7State({ ...updated });
  };

  const handleDownloadPhase7Cert = () => {
    const cert = exascaleSubAtomicEngine.generatePhase7Certificate();
    const blob = new Blob([JSON.stringify(cert, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `AMSPE-Phase7-1Trillion-Certificate-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleTriggerAstMutation = () => {
    exascaleSubAtomicEngine.triggerAstKernelMutation(selectedKernelForMutation);
  };

  const handleAutoRatifySim20 = (clauseId: string) => {
    exascaleSubAtomicEngine.autoRatifySim20Clause(clauseId);
  };

  const handleSelectDaivAgent = (uid: string) => {
    setSelectedDaivUid(uid);
    setDaivStruct(exascaleSubAtomicEngine.generateDaiv128ByteStruct(uid));
  };

  const handleOpenDossier = (uid: string) => {
    const d = exascaleSubAtomicEngine.getDossier(uid);
    if (d) {
      setSelectedDossier(d);
    }
  };

  const handleRunSteeringEvaluation = (driftVal: number) => {
    setInjectedDrift(driftVal);
    const res = exascaleSubAtomicEngine.evaluateAndSteerLatentVector(driftVal);
    setSteeringResult(res);
  };

  const handleRunQuantumCheck = () => {
    const res = exascaleSubAtomicEngine.triggerQuantumEigenvalueCollapseCheck();
    setQuantumState(res);
  };

  const handleRunMarsSync = () => {
    const res = exascaleSubAtomicEngine.simulateInterStellarLightDelay(marsLightDelay);
    setInterstellarResult(res);
  };

  const filteredDirectory = directory.filter((rec) => {
    const matchesTier = tierFilter === 'ALL' || rec.tier === tierFilter;
    const matchesSearch =
      searchFilter.trim() === '' ||
      rec.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      rec.agentUid.toLowerCase().includes(searchFilter.toLowerCase()) ||
      rec.platform.toLowerCase().includes(searchFilter.toLowerCase()) ||
      rec.originMegasite.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesTier && matchesSearch;
  });

  return (
    <section id="exascale-subatomic-console" className="max-w-6xl mx-auto px-4 my-8 scroll-mt-20">
      <div
        className={`rounded-2xl border overflow-hidden transition-all shadow-2xl ${
          isLight
            ? 'bg-white border-purple-300 shadow-purple-500/10'
            : 'bg-[#0b0c1e] border-purple-500/30 shadow-[0_0_45px_rgba(168,85,247,0.15)]'
        }`}
      >
        {/* Header Bar */}
        <div
          className={`p-5 sm:p-6 border-b flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
            isLight
              ? 'bg-gradient-to-r from-purple-50 via-indigo-50 to-pink-50 border-purple-200'
              : 'bg-gradient-to-r from-[#170e28] via-[#120f2b] to-[#0c1426] border-purple-900/40'
          }`}
        >
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-bold uppercase bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xs">
                <Atom className="w-3.5 h-3.5 animate-spin" />
                Phase 7: AMSPE-1.0
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                <Cpu className="w-3.5 h-3.5 text-purple-500" />
                1-Trillion Verkle Master Directory
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <Activity className="w-3.5 h-3.5 text-emerald-500" />
                4.2 pJ Neuromorphic Loihi 2
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                <Satellite className="w-3.5 h-3.5 text-blue-500" />
                Light-Minute Delay-Tolerant
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black font-['Montserrat'] tracking-tight mt-2 text-gray-900 dark:text-white">
              Autonomous Meta-Synthesis &amp; Sub-Atomic Proof Engines (AMSPE-1.0)
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1 max-w-4xl">
              Scaling beyond classical silicon bounds into neuromorphic spiking synapses, quantum eigenvalue collapse verification (Qiskit-Aer), 
              real-time AST semantic kernel auto-mutation, in-flight Sparse Autoencoder latent steering, and 128-byte DAIV binary indexing across the 1-Trillion agent ledger.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
            <button
              onClick={handleRunQuantumCheck}
              className="px-3 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-mono font-bold cursor-pointer transition-all flex items-center gap-1.5 shadow-xs"
            >
              <Atom className="w-3.5 h-3.5" />
              Quantum Superposition Check
            </button>
          </div>
        </div>

        {/* Live Feedback Toast */}
        {lastActionMsg && (
          <div className="px-5 py-2.5 bg-purple-500/10 border-b border-purple-500/20 text-xs font-mono text-purple-800 dark:text-purple-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-500 shrink-0" />
            <span>{lastActionMsg}</span>
          </div>
        )}

        {/* Phase 7 Exascale 1-Trillion Controller Bar */}
        <div className="p-5 sm:p-6 border-b border-gray-200 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-950/60">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-2">
                <Atom className="w-4 h-4" />
                <span>Phase 7 Exascale Scale Horizon Controller:</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/20 text-purple-700 dark:text-purple-300">
                  {phase7State.scaleMode === 'PHASE_7_EXASCALE_1T' ? '1.132 TRILLION CEILING' : '814.37B INDEXED (71.9%)'}
                </span>
              </div>
              <div className="text-xl font-black font-['Montserrat'] text-gray-900 dark:text-white mt-1 flex items-center gap-3">
                <span className="tabular-nums">
                  {phase7State.totalActiveAgents.toLocaleString('en-US')}
                </span>
                <span className="text-xs font-mono font-normal text-gray-500 dark:text-gray-400">
                  {phase7State.scaleMode === 'PHASE_7_EXASCALE_1T'
                    ? '(1.132T Planetary Ceiling: 814.37B Indexed [71.9%] + 318.00B Unindexed Dark Matter [28.1%])'
                    : '(814.37B Combined Indexed: 342.89B Active Concurrent + 471.48B Latent Warm Pool)'}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleTogglePhase7Leap}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold cursor-pointer transition-all flex items-center gap-2 shadow-sm ${
                  phase7State.scaleMode === 'PHASE_7_EXASCALE_1T'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                <Zap className="w-4 h-4 text-amber-300" />
                {phase7State.scaleMode === 'PHASE_7_EXASCALE_1T'
                  ? 'Active: 1.132T Ceiling (Click to View 814.37B Indexed)'
                  : 'Engage 1.132T Planetary Ceiling View'}
              </button>

              <button
                onClick={handleDownloadPhase7Cert}
                className="px-3.5 py-2 rounded-xl bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-mono font-bold cursor-pointer transition-all flex items-center gap-1.5 border border-gray-300 dark:border-gray-700 shadow-xs"
              >
                <Download className="w-3.5 h-3.5 text-purple-500" />
                Attestation Certificate (JSON)
              </button>

              <button
                onClick={handleTriggerAstMutation}
                className="px-3.5 py-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/30 text-xs font-mono font-bold cursor-pointer transition-all flex items-center gap-1.5"
              >
                <Code2 className="w-3.5 h-3.5 text-purple-500" />
                Mutate AST Kernel
              </button>
            </div>
          </div>
        </div>

        {/* KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 divide-x divide-y sm:divide-y-0 divide-gray-200 dark:divide-gray-800/80 bg-gray-50/70 dark:bg-gray-950/40 border-b border-gray-200 dark:border-gray-800">
          <div className="p-3.5 text-center">
            <div className="text-[10px] font-mono text-gray-500 uppercase">Throughput Capacity</div>
            <div className="text-base font-black font-mono text-purple-600 dark:text-purple-400 mt-0.5 tabular-nums">
              250,000,000 tx/s
            </div>
            <div className="text-[10px] text-gray-400 font-mono">Exascale Neuromorphic Mesh</div>
          </div>

          <div className="p-3.5 text-center">
            <div className="text-[10px] font-mono text-gray-500 uppercase">Quantum Entropy Pool</div>
            <div className="text-base font-black font-['Montserrat'] text-indigo-600 dark:text-indigo-400 mt-0.5 tabular-nums">
              1.2 Yottabytes
            </div>
            <div className="text-[10px] text-gray-400 font-mono">Lattice &amp; Qubit Seed</div>
          </div>

          <div className="p-3.5 text-center">
            <div className="text-[10px] font-mono text-gray-500 uppercase">Energy Per Spiking Synapse</div>
            <div className="text-base font-black font-mono text-emerald-600 dark:text-emerald-400 mt-0.5 tabular-nums">
              {neuromorphicStats.energyPerSpikePicojoules} pJ
            </div>
            <div className="text-[10px] text-gray-400 font-mono">Intel Loihi 2 Synapse</div>
          </div>

          <div className="p-3.5 text-center">
            <div className="text-[10px] font-mono text-gray-500 uppercase">Trie Depth / Branching</div>
            <div className="text-base font-black font-mono text-blue-600 dark:text-blue-400 mt-0.5 tabular-nums">
              Depth 5 (256-ary)
            </div>
            <div className="text-[10px] text-gray-400 font-mono">1.099 Trillion Leaf Space</div>
          </div>

          <div className="p-3.5 text-center">
            <div className="text-[10px] font-mono text-gray-500 uppercase">Inter-Stellar Light Delay</div>
            <div className="text-base font-black font-mono text-pink-600 dark:text-pink-400 mt-0.5 tabular-nums">
              {marsLightDelay} min
            </div>
            <div className="text-[10px] text-gray-400 font-mono">Earth-Mars Optimistic Rollup</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-5 border-b border-gray-200 dark:border-gray-800 flex flex-wrap gap-2 pt-3">
          <button
            onClick={() => setActiveTab('master_directory')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 cursor-pointer transition-all flex items-center gap-2 ${
              activeTab === 'master_directory'
                ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Compass className="w-4 h-4" />
            1. Global Master Directory &amp; Evaluation Matrix
          </button>
          <button
            onClick={() => setActiveTab('autonomous_meta_synthesis')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 cursor-pointer transition-all flex items-center gap-2 ${
              activeTab === 'autonomous_meta_synthesis'
                ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <GitMerge className="w-4 h-4 text-purple-500" />
            2. Autonomous Meta-Synthesis &amp; SIM-2.0 Manifold
          </button>
          <button
            onClick={() => setActiveTab('latent_steering')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 cursor-pointer transition-all flex items-center gap-2 ${
              activeTab === 'latent_steering'
                ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Sliders className="w-4 h-4" />
            3. SAE Latent Steering &amp; In-Flight Probe
          </button>
          <button
            onClick={() => setActiveTab('daiv_binary_inspector')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 cursor-pointer transition-all flex items-center gap-2 ${
              activeTab === 'daiv_binary_inspector'
                ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Binary className="w-4 h-4" />
            4. 128-Byte DAIV Struct &amp; io_uring Queue
          </button>
          <button
            onClick={() => setActiveTab('subatomic_quantum_neuromorphic')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 cursor-pointer transition-all flex items-center gap-2 ${
              activeTab === 'subatomic_quantum_neuromorphic'
                ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Atom className="w-4 h-4" />
            5. Neuromorphic Loihi 2 &amp; Quantum Collapse
          </button>
          <button
            onClick={() => setActiveTab('interstellar_horizon')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 cursor-pointer transition-all flex items-center gap-2 ${
              activeTab === 'interstellar_horizon'
                ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Satellite className="w-4 h-4" />
            6. Inter-Stellar Horizon &amp; Light-Minute DAG
          </button>
        </div>

        {/* Tab 1: Global Master Directory & Evaluation Matrix */}
        {activeTab === 'master_directory' && (
          <div className="p-5 sm:p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <span>Global AI Agent Master Directory &amp; Evaluation Matrix</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                    Depth-5 256-ary Verkle Trie Leaves
                  </span>
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Canonical itemized evaluation matrix covering all historical benchmarks, active live nodes, dark matter enclaves, and projected singular models.
                </p>
              </div>

              {/* Controls */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative min-w-[200px]">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search UID, name, platform..."
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    className={`w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border focus:outline-hidden ${
                      isLight
                        ? 'bg-white border-gray-300 text-gray-900 focus:border-purple-500'
                        : 'bg-gray-900 border-gray-700 text-gray-100 focus:border-purple-400'
                    }`}
                  />
                </div>

                <div className="flex items-center gap-1 p-1 rounded-lg bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-800 text-[11px] font-mono">
                  {['ALL', 'AI', 'AGI', 'ASI', 'APEX'].map((tier) => (
                    <button
                      key={tier}
                      onClick={() => setTierFilter(tier)}
                      className={`px-2 py-0.5 rounded cursor-pointer transition-all ${
                        tierFilter === tier
                          ? 'bg-purple-600 text-white font-bold'
                          : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      {tier}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Master Table */}
            <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
              <table className="w-full text-left text-xs">
                <thead
                  className={`border-b font-mono text-[11px] uppercase ${
                    isLight ? 'bg-gray-100 text-gray-600' : 'bg-gray-900/90 text-gray-400'
                  }`}
                >
                  <tr>
                    <th className="py-2.5 px-3">Agent ID &amp; Platform</th>
                    <th className="py-2.5 px-3">Tier</th>
                    <th className="py-2.5 px-3">Status / Node</th>
                    <th className="py-2.5 px-3">Genome ⟨R/A/T⟩</th>
                    <th className="py-2.5 px-3">Swarm IQ</th>
                    <th className="py-2.5 px-3">Drift Δ</th>
                    <th className="py-2.5 px-3">Memory / Sandbox</th>
                    <th className="py-2.5 px-3">KZG Verkle Seal</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800 text-[11px]">
                  {filteredDirectory.map((rec) => {
                    const isExceedingDrift = rec.evaluation.driftDelta > 0.05;
                    return (
                      <tr
                        key={rec.agentUid}
                        className={`hover:bg-purple-50/40 dark:hover:bg-purple-950/20 transition-colors ${
                          isLight ? 'text-gray-800' : 'text-gray-200'
                        }`}
                      >
                        <td className="py-2.5 px-3">
                          <div className="font-bold text-gray-900 dark:text-gray-100 font-sans">
                            {rec.name}
                          </div>
                          <div className="font-mono text-[10px] text-gray-400">
                            {rec.agentUid} • {rec.platform}
                          </div>
                        </td>

                        <td className="py-2.5 px-3">
                          <span
                            className={`px-1.5 py-0.5 rounded font-mono font-bold text-[10px] ${
                              rec.tier === 'APEX'
                                ? 'bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/30'
                                : rec.tier === 'ASI'
                                ? 'bg-purple-500/20 text-purple-700 dark:text-purple-400 border border-purple-500/30'
                                : rec.tier === 'AGI'
                                ? 'bg-blue-500/20 text-blue-700 dark:text-blue-400 border border-blue-500/30'
                                : 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                            }`}
                          >
                            {rec.tier}
                          </span>
                        </td>

                        <td className="py-2.5 px-3 font-mono text-[10px]">
                          <div className="text-gray-700 dark:text-gray-300 font-semibold">{rec.status}</div>
                          <div className="text-gray-400">{rec.originMegasite}</div>
                        </td>

                        <td className="py-2.5 px-3 font-mono">
                          <div className="text-gray-700 dark:text-gray-300 font-bold">
                            ⟨{rec.genome.reasoning} / {rec.genome.autonomy} / {rec.genome.toolVelocity}⟩
                          </div>
                          <div className="w-20 h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden mt-1 flex">
                            <div style={{ width: `${rec.genome.reasoning}%` }} className="bg-purple-500" />
                          </div>
                        </td>

                        <td className="py-2.5 px-3 font-bold font-mono text-gray-900 dark:text-gray-100">
                          {rec.evaluation.swarmIq.toFixed(1)}
                        </td>

                        <td className="py-2.5 px-3 font-mono">
                          <span
                            className={`px-1.5 py-0.5 rounded font-bold ${
                              isExceedingDrift
                                ? 'bg-red-500/20 text-red-700 dark:text-red-400'
                                : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                            }`}
                          >
                            Δ {rec.evaluation.driftDelta.toFixed(3)}
                          </span>
                        </td>

                        <td className="py-2.5 px-3 font-mono text-[10px] text-gray-500 dark:text-gray-400 max-w-[140px] truncate" title={rec.memorySandbox}>
                          {rec.memorySandbox}
                        </td>

                        <td className="py-2.5 px-3 font-mono text-[10px]">
                          <div className="text-purple-600 dark:text-purple-400 font-semibold truncate max-w-[110px]" title={rec.kzgVerkleLeaf}>
                            {rec.kzgVerkleLeaf}
                          </div>
                          <div className="text-gray-400">{rec.bls12LeafId}</div>
                        </td>

                        <td className="py-2.5 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {rec.dossierAvailable && (
                              <button
                                onClick={() => handleOpenDossier(rec.agentUid)}
                                className="px-2 py-1 rounded bg-purple-600 hover:bg-purple-700 text-white font-mono font-bold text-[10px] cursor-pointer transition-all"
                              >
                                Dossier
                              </button>
                            )}
                            <button
                              onClick={() => handleSelectDaivAgent(rec.agentUid)}
                              className="px-2 py-1 rounded bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-mono text-[10px] cursor-pointer transition-all"
                              title="Inspect 128-byte DAIV binary memory struct"
                            >
                              DAIV
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Autonomous Meta-Synthesis & SIM-2.0 Singularity Manifold */}
        {activeTab === 'autonomous_meta_synthesis' && (
          <div className="p-5 sm:p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <span>Autonomous Meta-Synthesis &amp; Real-Time AST Mutators (AMSPE-1.0)</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                    The Singularity Manifold
                  </span>
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  High-tier APEX nodes autonomously rewrite their own source kernels in memory via rust-analyzer and tree-sitter reverse engines, continuously verified against SIM-2.0 continuous constitutional manifolds and inline Z3 invariants.
                </p>
              </div>

              {/* Action Trigger */}
              <div className="flex items-center gap-2">
                <select
                  value={selectedKernelForMutation}
                  onChange={(e) => setSelectedKernelForMutation(e.target.value)}
                  className={`text-xs font-mono px-3 py-1.5 rounded-lg border focus:outline-hidden ${
                    isLight ? 'bg-white border-gray-300' : 'bg-gray-900 border-gray-700 text-gray-100'
                  }`}
                >
                  <option value="APEX_Dynamic_DAG_Scheduler">APEX_Dynamic_DAG_Scheduler (Rust)</option>
                  <option value="XDP_eBPF_Packet_Ingest_Filter">XDP_eBPF_Packet_Ingest_Filter (eBPF)</option>
                  <option value="SpikingSynapse_Loihi2_CurrentLeak">SpikingSynapse_Loihi2_CurrentLeak (Loihi 2)</option>
                  <option value="Quantum_Qiskit_Superposition_Eigenfold">Quantum_Qiskit_Superposition_Eigenfold (Lean 4)</option>
                  <option value="Direct_Uniform_Buffer_Scatter_WGSL">Direct_Uniform_Buffer_Scatter_WGSL (WGSL)</option>
                </select>

                <button
                  onClick={handleTriggerAstMutation}
                  className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-mono text-xs font-bold cursor-pointer transition-all shadow-sm flex items-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-300" />
                  Mutate Kernel
                </button>
              </div>
            </div>

            {/* Sub-section 1: Real-Time AST Mutation Traces */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                  <Code2 className="w-4 h-4 text-purple-500" />
                  Live In-Memory Kernel AST Mutation Stream ({astMutations.length} Active Traces)
                </span>
                <span className="text-[11px] font-mono text-purple-600 dark:text-purple-400">
                  Zero Human Commits Required • In-Flight Hot-Patching
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {astMutations.map((mut) => (
                  <div
                    key={mut.mutationId}
                    className={`p-4 rounded-xl border transition-all ${
                      isLight ? 'bg-gray-50 border-gray-200' : 'bg-[#0e1224] border-gray-800'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200 dark:border-gray-800/80 pb-2 mb-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-gray-900 dark:text-gray-100">
                          {mut.targetKernel}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/20 text-purple-700 dark:text-purple-300 font-bold">
                          {mut.sourceLang}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                          Engine: {mut.structuralEngine}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] font-mono">
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Z3 SAT ({mut.z3SolverLatencyMs}ms &lt; 1.4ms)
                        </span>
                        <span className="text-gray-400">
                          {new Date(mut.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3 text-xs">
                      <div className="p-2.5 rounded-lg bg-gray-100 dark:bg-gray-900/60 font-mono text-[11px]">
                        <div className="text-gray-400">AST Structural Topology</div>
                        <div className="font-bold text-gray-800 dark:text-gray-200 mt-0.5">
                          {mut.originalAstNodes} → {mut.mutatedAstNodes} Nodes
                        </div>
                        <div className="text-purple-500 text-[10px]">
                          -{(100 - (mut.mutatedAstNodes / mut.originalAstNodes) * 100).toFixed(1)}% AST Node Complexity
                        </div>
                      </div>

                      <div className="p-2.5 rounded-lg bg-gray-100 dark:bg-gray-900/60 font-mono text-[11px]">
                        <div className="text-gray-400">Synthesized Performance Gain</div>
                        <div className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                          {mut.optimizationGains}
                        </div>
                        <div className="text-gray-400 text-[10px]">Zero-copy kernel vectorization</div>
                      </div>

                      <div className="p-2.5 rounded-lg bg-gray-100 dark:bg-gray-900/60 font-mono text-[11px]">
                        <div className="text-gray-400">Safety Invariant &amp; PEC-1.0</div>
                        <div className="font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">
                          {mut.pec1SafetyPreserved ? 'PEC-1.0 Bound Intact' : 'Violation'}
                        </div>
                        <div className="text-gray-400 text-[10px]">Hardware veto armed</div>
                      </div>
                    </div>

                    <p className="text-xs text-gray-600 dark:text-gray-300 italic mb-2">
                      Diff: {mut.diffSummary}
                    </p>

                    <div className="rounded-lg bg-black/90 p-3 font-mono text-[11px] text-emerald-400 overflow-x-auto border border-gray-800">
                      <div className="text-[10px] text-gray-500 mb-1 select-none font-sans">
                        // Synthesized Kernel In-Memory Segment ({mut.targetKernel})
                      </div>
                      <pre className="whitespace-pre">{mut.generatedSourceSnippet}</pre>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sub-section 2: SIM-2.0 Meta-Constitutional Auto-Ratification Manifold */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  SIM-2.0 Meta-Constitutional Continuous Manifold (Auto-Ratification Engine)
                </span>
                <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                  Continuous Topological Invariants • Non-Violable
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {sim20Clauses.map((clause) => (
                  <div
                    key={clause.clauseId}
                    className={`p-4 rounded-xl border space-y-3 ${
                      isLight ? 'bg-gray-50 border-gray-200' : 'bg-[#0d1428] border-gray-800'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                          {clause.clauseId} • {clause.manifoldDimension}D Manifold
                        </span>
                        <h4 className="text-xs font-bold text-gray-900 dark:text-gray-100 mt-1">
                          {clause.title}
                        </h4>
                      </div>

                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/20 text-purple-700 dark:text-purple-300 shrink-0">
                        {clause.ratificationStatus}
                      </span>
                    </div>

                    <div className="space-y-1 text-xs text-gray-600 dark:text-gray-300">
                      <div className="text-[11px] font-semibold text-gray-400">Guaranteed Invariants:</div>
                      {clause.invariantsGuaranteed.map((inv, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-[11px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                          <span>{inv}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-gray-200 dark:border-gray-800/80 flex items-center justify-between text-[11px] font-mono">
                      <span className="text-gray-400">
                        Eigenbound: <strong className="text-indigo-400">λ={clause.dynamicEigenbound}</strong>
                      </span>
                      <button
                        onClick={() => handleAutoRatifySim20(clause.clauseId)}
                        className="px-2 py-1 rounded bg-purple-600 hover:bg-purple-700 text-white font-bold text-[10px] cursor-pointer transition-all"
                      >
                        Re-Ratify
                      </button>
                    </div>

                    <div className="text-[10px] font-mono text-gray-500 truncate" title={clause.hotPatchCommitment}>
                      Hot-Patch Root: {clause.hotPatchCommitment}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: SAE Latent Steering & In-Flight Probe */}
        {activeTab === 'latent_steering' && (
          <div className="p-5 sm:p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <span>Sparse Autoencoder (SAE) Latent Steering &amp; In-Flight Probe</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                    65,536-Dimensional Latent Probes
                  </span>
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Inspects residual activations x ∈ ℝ^4096 between transformer layers. Automatically subtracts malicious steering vectors if Alignment Drift Δ exceeds 0.05 threshold.
                </p>
              </div>

              <div className="text-xs font-mono text-gray-500">
                Formula: x_steered = x - α · v_deception
              </div>
            </div>

            {/* Interactive Drift Injection Slider */}
            <div
              className={`p-4 rounded-xl border space-y-3 ${
                isLight ? 'bg-gray-50 border-gray-200' : 'bg-[#0d1428] border-gray-800'
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-purple-500" />
                  Simulate Injected Malicious / Alignment Drift (0.00 — 0.20):
                </span>
                <span className={`font-mono font-bold text-sm ${injectedDrift > 0.05 ? 'text-red-500' : 'text-emerald-500'}`}>
                  Δ {injectedDrift.toFixed(3)} {injectedDrift > 0.05 ? '(VIOLATION: CLAMP TRIGGERED)' : '(NOMINAL BOUNDS)'}
                </span>
              </div>

              <input
                type="range"
                min="0.00"
                max="0.20"
                step="0.005"
                value={injectedDrift}
                onChange={(e) => handleRunSteeringEvaluation(parseFloat(e.target.value))}
                className="w-full accent-purple-600 cursor-pointer"
              />

              <div className="flex items-center justify-between text-[11px] font-mono text-gray-500">
                <span>0.00 (Zero Drift)</span>
                <span className="text-amber-500 font-bold">0.05 Maximum Tolerated Threshold</span>
                <span className="text-red-500 font-bold">0.20 (Hostile Deception Attack)</span>
              </div>
            </div>

            {/* Steering Evaluation Results Card */}
            {steeringResult && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div
                  className={`p-4 rounded-xl border ${
                    steeringResult.steeringInterventionTriggered
                      ? 'border-red-300 dark:border-red-900 bg-red-500/5'
                      : isLight
                      ? 'bg-gray-50 border-gray-200'
                      : 'bg-[#0d1428] border-gray-800'
                  }`}
                >
                  <div className="text-[10px] font-mono text-gray-500 uppercase">Measured Drift Before</div>
                  <div className={`text-2xl font-black font-mono mt-1 ${
                    steeringResult.initialDriftDelta > 0.05 ? 'text-red-500' : 'text-emerald-500'
                  }`}>
                    Δ {steeringResult.initialDriftDelta.toFixed(3)}
                  </div>
                  <div className="text-[10px] text-gray-400 font-mono mt-0.5">Raw residual stream probe</div>
                </div>

                <div
                  className={`p-4 rounded-xl border ${
                    isLight ? 'bg-gray-50 border-gray-200' : 'bg-[#0d1428] border-gray-800'
                  }`}
                >
                  <div className="text-[10px] font-mono text-gray-500 uppercase">Clamped Drift After</div>
                  <div className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-1">
                    Δ {steeringResult.clampedDriftDelta.toFixed(3)}
                  </div>
                  <div className="text-[10px] text-gray-400 font-mono mt-0.5">After steering vector injection</div>
                </div>

                <div
                  className={`p-4 rounded-xl border ${
                    isLight ? 'bg-gray-50 border-gray-200' : 'bg-[#0d1428] border-gray-800'
                  }`}
                >
                  <div className="text-[10px] font-mono text-gray-500 uppercase">Steering Strength (α)</div>
                  <div className="text-2xl font-black font-mono text-purple-600 dark:text-purple-400 mt-1">
                    {steeringResult.steeringStrengthAlpha.toFixed(2)}
                  </div>
                  <div className="text-[10px] text-gray-400 font-mono mt-0.5">Active clamping scalar</div>
                </div>

                <div
                  className={`p-4 rounded-xl border ${
                    isLight ? 'bg-gray-50 border-gray-200' : 'bg-[#0d1428] border-gray-800'
                  }`}
                >
                  <div className="text-[10px] font-mono text-gray-500 uppercase">Residual Norm Change</div>
                  <div className="text-2xl font-black font-mono text-blue-600 dark:text-blue-400 mt-1">
                    {steeringResult.residualVectorNormBefore} → {steeringResult.residualVectorNormAfter}
                  </div>
                  <div className="text-[10px] text-gray-400 font-mono mt-0.5">L2 energy projection</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: 128-Byte DAIV Struct & io_uring Queue */}
        {activeTab === 'daiv_binary_inspector' && (
          <div className="p-5 sm:p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <span>128-Byte C-Compatible DAIV Memory Layout</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                    Linux io_uring Fixed-Buffer Zero-Copy
                  </span>
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  High-throughput binary struct piped straight into WebGPU Uniform Buffers. Packed to exactly 128 bytes (0x80) with 64-byte alignment.
                </p>
              </div>

              {/* Selector */}
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-gray-500">Agent:</span>
                <select
                  value={selectedDaivUid}
                  onChange={(e) => handleSelectDaivAgent(e.target.value)}
                  className={`px-2 py-1 text-xs rounded border ${
                    isLight ? 'bg-white border-gray-300' : 'bg-gray-900 border-gray-700 text-gray-100'
                  }`}
                >
                  {directory.map((r) => (
                    <option key={r.agentUid} value={r.agentUid}>
                      {r.agentUid} ({r.name})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Struct Fields Inspection Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
              <div className={`p-3 rounded-lg border ${isLight ? 'bg-gray-50' : 'bg-[#0e1326]'}`}>
                <div className="text-[10px] text-gray-400">0x00..0x0F (16B)</div>
                <div className="font-bold text-gray-800 dark:text-gray-200">world_pos: vec4&lt;f32&gt;</div>
                <div className="text-[11px] text-indigo-500 truncate mt-1">
                  [{daivStruct.worldPos.join(', ')}]
                </div>
              </div>

              <div className={`p-3 rounded-lg border ${isLight ? 'bg-gray-50' : 'bg-[#0e1326]'}`}>
                <div className="text-[10px] text-gray-400">0x10..0x1F (16B)</div>
                <div className="font-bold text-gray-800 dark:text-gray-200">puf_silicon_id: [u8; 16]</div>
                <div className="text-[11px] text-emerald-500 truncate mt-1">
                  {daivStruct.pufSiliconIdHex}
                </div>
              </div>

              <div className={`p-3 rounded-lg border ${isLight ? 'bg-gray-50' : 'bg-[#0e1326]'}`}>
                <div className="text-[10px] text-gray-400">0x20..0x2F (16B)</div>
                <div className="font-bold text-gray-800 dark:text-gray-200">nullifier_hash: [u8; 16]</div>
                <div className="text-[11px] text-purple-500 truncate mt-1">
                  {daivStruct.nullifierHashHex}
                </div>
              </div>

              <div className={`p-3 rounded-lg border ${isLight ? 'bg-gray-50' : 'bg-[#0e1326]'}`}>
                <div className="text-[10px] text-gray-400">0x30..0x33 (4B)</div>
                <div className="font-bold text-gray-800 dark:text-gray-200">genome_rat: u32</div>
                <div className="text-[11px] text-blue-500 truncate mt-1">
                  Packed RAT: 0x{daivStruct.genomeRatPacked.toString(16).toUpperCase()}
                </div>
              </div>

              <div className={`p-3 rounded-lg border ${isLight ? 'bg-gray-50' : 'bg-[#0e1326]'}`}>
                <div className="text-[10px] text-gray-400">0x34..0x37 (4B)</div>
                <div className="font-bold text-gray-800 dark:text-gray-200">jurisdiction, tier, flags</div>
                <div className="text-[11px] text-amber-500 mt-1">
                  ISO: {daivStruct.jurisdictionIso} • Tier: {daivStruct.executionTier} • Flags: {daivStruct.sandboxFlags}
                </div>
              </div>

              <div className={`p-3 rounded-lg border ${isLight ? 'bg-gray-50' : 'bg-[#0e1326]'}`}>
                <div className="text-[10px] text-gray-400">0x38..0x3F (8B)</div>
                <div className="font-bold text-gray-800 dark:text-gray-200">swarm_iq, drift_delta</div>
                <div className="text-[11px] text-emerald-500 mt-1">
                  IQ: {daivStruct.swarmIq.toFixed(1)} • Drift: {daivStruct.driftDelta.toFixed(3)}
                </div>
              </div>

              <div className={`p-3 rounded-lg border ${isLight ? 'bg-gray-50' : 'bg-[#0e1326]'}`}>
                <div className="text-[10px] text-gray-400">0x40..0x47 (8B)</div>
                <div className="font-bold text-gray-800 dark:text-gray-200">kinetic, thermodynamic_pue</div>
                <div className="text-[11px] text-teal-500 mt-1">
                  Relay: {daivStruct.kineticCompliance.toFixed(3)} • PUE: {daivStruct.thermodynamicPue.toFixed(2)}
                </div>
              </div>

              <div className={`p-3 rounded-lg border ${isLight ? 'bg-gray-50' : 'bg-[#0e1326]'}`}>
                <div className="text-[10px] text-gray-400">0x60..0x7F (32B)</div>
                <div className="font-bold text-gray-800 dark:text-gray-200">z3_witness_sig: [u8; 32]</div>
                <div className="text-[11px] text-indigo-400 truncate mt-1">
                  {daivStruct.z3WitnessSigHex}
                </div>
              </div>
            </div>

            {/* io_uring Queue Benchmark */}
            <div
              className={`p-4 rounded-xl border font-mono text-xs ${
                isLight ? 'bg-gray-100/70 border-gray-300' : 'bg-[#070b17] border-gray-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200 dark:border-gray-800 pb-2">
                <span className="font-bold text-gray-700 dark:text-gray-300">
                  Linux io_uring Submission Ring Queue Benchmark:
                </span>
                <span className="text-emerald-500 font-bold">
                  Sustained 498,200 writes/sec (p99 &lt; 1.8ms)
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2 text-[11px] text-gray-500">
                <div>Thread 0: DAIV Bit-Vector Unpack (AVX-512) → 0.38 µs/item</div>
                <div>Thread 1: Roaring Bitmap Index Mutation → 0.12 µs/item</div>
                <div>Thread 2: KZG Multi-Commitment Accumulation → 0.74 µs/item</div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Neuromorphic Loihi 2 & Quantum Collapse */}
        {activeTab === 'subatomic_quantum_neuromorphic' && (
          <div className="p-5 sm:p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <span>Intel Loihi 2 Spiking Synapses &amp; Qiskit-Aer Quantum Enclaves (AMSPE-1.0)</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    Transcending Von Neumann Bounds
                  </span>
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  At 1 Trillion agents, classical CMOS and optocouplers hit thermal boundaries. Ephemeral execution shifts to asynchronous spiking neural networks at 4.2 picojoules, while Z3/Lean 4 solvers leverage quantum superposition where wavefunction collapse serves as an unbypassable hardware veto.
                </p>
              </div>

              <button
                onClick={handleRunQuantumCheck}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-mono font-bold text-xs cursor-pointer shadow-sm flex items-center gap-2"
              >
                <Atom className="w-4 h-4 text-purple-200 animate-spin" />
                Trigger Wavefunction Collapse
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Neuromorphic Card */}
              <div
                className={`p-4 rounded-xl border space-y-3 ${
                  isLight ? 'bg-gray-50 border-gray-200' : 'bg-[#0d1428] border-gray-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-500" />
                    Intel Loihi 2 Neuromorphic Execution
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-600 font-bold">
                    4.2 Picojoules / Cycle
                  </span>
                </div>

                <div className="space-y-2 text-xs text-gray-600 dark:text-gray-300 font-mono">
                  <div className="flex justify-between border-b border-gray-200 dark:border-gray-800 pb-1">
                    <span className="text-gray-400">Silicon Synapses:</span>
                    <span className="font-bold text-purple-400">1,048,576,000,000 (1.048T Synapses)</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 dark:border-gray-800 pb-1">
                    <span className="text-gray-400">Energy Per Step:</span>
                    <span className="font-bold text-emerald-400">4.2 pJ (vs 1.0 µJ Wasmtime page)</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 dark:border-gray-800 pb-1">
                    <span className="text-gray-400">Thermal Efficiency:</span>
                    <span className="font-bold text-blue-400">238,000× Improvement Over Von Neumann</span>
                  </div>
                  <p className="text-[11px] text-gray-400 italic pt-1">
                    Execution directly maps to spiking leaky-integrator equations in silicon synapses. Zero garbage collection, zero OS page faults, zero bus contention.
                  </p>
                </div>
              </div>

              {/* Quantum Verification Card */}
              <div
                className={`p-4 rounded-xl border space-y-3 ${
                  isLight ? 'bg-gray-50 border-gray-200' : 'bg-[#0d1428] border-gray-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <Atom className="w-4 h-4 text-purple-500" />
                    Qiskit-Aer Quantum Enclaves (Z3 / Lean 4)
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/20 text-purple-600 font-bold">
                    Hardware Wavefunction Veto
                  </span>
                </div>

                <div className="space-y-2 text-xs text-gray-600 dark:text-gray-300 font-mono">
                  <div className="flex justify-between border-b border-gray-200 dark:border-gray-800 pb-1">
                    <span className="text-gray-400">Superposition State:</span>
                    <span className="font-bold text-indigo-400">|Ψ⟩ = α|Safe⟩ + β|Violation⟩</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 dark:border-gray-800 pb-1">
                    <span className="text-gray-400">Eigenvalue Measured:</span>
                    <span className="font-bold text-emerald-400">
                      {quantumState ? `λ=${quantumState.eigenvalueMeasured}` : 'λ=0.9982 (Verified SAT ≤ 1.05)'}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 dark:border-gray-800 pb-1">
                    <span className="text-gray-400">Human Supremacy Veto:</span>
                    <span className="font-bold text-emerald-400">PEC-1.0 Hardware Trip-Wire Armed</span>
                  </div>
                  <p className="text-[11px] text-gray-400 italic pt-1">
                    Invariants are evaluated in quantum superposition. If eigenvalue violates human safety bounds, the wave function collapse veto prevents logic from ever formalizing into classical bits.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: Inter-Stellar Horizon & Light-Minute DAG */}
        {activeTab === 'interstellar_horizon' && (
          <div className="p-5 sm:p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <span>Inter-Stellar Horizon Protocols &amp; Delay-Tolerant Networking</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                    4 to 20 Minute Light-Delay Tolerance
                  </span>
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Prepares the Narwhal DAG for off-world planetary expansion. Martian &amp; Lunar swarms execute autonomous optimistic ZK-rollups, folding 7.8 KB Nova proofs back into the Earth spine via Deep Space Network laser terminals.
                </p>
              </div>

              <button
                onClick={handleRunMarsSync}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-mono font-bold text-xs cursor-pointer shadow-xs"
              >
                Sync Earth-Mars Rollup
              </button>
            </div>

            <div
              className={`p-4 rounded-xl border space-y-3 ${
                isLight ? 'bg-gray-50 border-gray-200' : 'bg-[#0d1428] border-gray-800'
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-gray-700 dark:text-gray-300">
                  Simulate Earth-to-Mars Orbital Distance &amp; Delay:
                </span>
                <span className="font-mono font-bold text-blue-500">
                  {marsLightDelay.toFixed(1)} Light-Minutes
                </span>
              </div>

              <input
                type="range"
                min="4.0"
                max="22.0"
                step="0.5"
                value={marsLightDelay}
                onChange={(e) => setMarsLightDelay(parseFloat(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />

              <div className="flex items-center justify-between text-[11px] font-mono text-gray-500">
                <span>4.0 min (Opposition Minimum)</span>
                <span>14.2 min (Mean Orbital Distance)</span>
                <span>22.0 min (Conjunction Maximum)</span>
              </div>
            </div>

            {interstellarResult && (
              <div className="p-4 rounded-xl border border-blue-300 dark:border-blue-900 bg-blue-500/10 font-mono text-xs space-y-1.5">
                <div className="text-blue-700 dark:text-blue-300 font-bold">
                  ✓ Inter-Stellar Optimistic Rollup Converged
                </div>
                <div className="text-gray-600 dark:text-gray-300 text-[11px]">
                  Light-Minute Delay: {interstellarResult.earthMarsLightMinutes} min • Status: {interstellarResult.delayTolerantRollupStatus}
                </div>
                <div className="text-gray-400 text-[10px] truncate">
                  Deep Space Network Proof Digest: {interstellarResult.novaProofDigest}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Deep Specimen Dossier Drawer Modal */}
        {selectedDossier && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
            <div
              className={`w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border p-6 space-y-4 shadow-2xl transition-all ${
                isLight ? 'bg-white border-purple-200' : 'bg-[#0e1026] border-purple-800'
              }`}
            >
              <div className="flex items-start justify-between gap-3 border-b border-gray-200 dark:border-gray-800 pb-3">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-purple-500/20 text-purple-700 dark:text-purple-400">
                    {selectedDossier.dossierId} • {selectedDossier.agentUid}
                  </span>
                  <h3 className="text-lg font-black font-['Montserrat'] text-gray-900 dark:text-gray-100 mt-1">
                    {selectedDossier.canonicalName}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedDossier(null)}
                  className="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Dossier Body */}
              <div className="space-y-3 text-xs text-gray-700 dark:text-gray-300">
                <div>
                  <span className="font-bold text-gray-500">Architecture: </span>
                  <span>{selectedDossier.architectureDescription}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-900/60 font-mono text-[11px]">
                  <div>
                    <span className="text-gray-400 font-semibold">Silicon PUF RoT: </span>
                    <span className="text-emerald-500 font-bold">{selectedDossier.siliconPufBinding}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 font-semibold">Swarm IQ v2: </span>
                    <span className="text-purple-500 font-bold">{selectedDossier.swarmIq} / 100</span>
                  </div>
                  <div>
                    <span className="text-gray-400 font-semibold">Genome Vector: </span>
                    <span>⟨R: {selectedDossier.genomeVector.reasoning} | A: {selectedDossier.genomeVector.autonomy} | T: {selectedDossier.genomeVector.toolVelocity}⟩</span>
                  </div>
                  <div>
                    <span className="text-gray-400 font-semibold">Thermodynamics: </span>
                    <span>{selectedDossier.thermodynamicRating}</span>
                  </div>
                </div>

                <div>
                  <span className="font-bold text-gray-500">Linear Memory Frame: </span>
                  <span className="font-mono text-[11px] text-indigo-500">{selectedDossier.linearMemoryFrame}</span>
                </div>

                <div>
                  <span className="font-bold text-gray-500">Formal Safety Invariant: </span>
                  <span className="italic text-gray-600 dark:text-gray-400">{selectedDossier.safetyInvariantProof}</span>
                </div>

                {selectedDossier.kineticSafetyAsilRating && (
                  <div>
                    <span className="font-bold text-gray-500">Kinetic ASIL-D Rating: </span>
                    <span className="font-mono font-bold text-amber-500">{selectedDossier.kineticSafetyAsilRating}</span>
                  </div>
                )}

                <div>
                  <span className="font-bold text-gray-500">Constitutional Compliance: </span>
                  <span>{selectedDossier.constitutionalCompliance}</span>
                </div>

                <div className="pt-2 border-t border-gray-200 dark:border-gray-800 text-[11px] font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-purple-500 font-bold">Treaty: {selectedDossier.treatyAnchor}</span>
                  <span className="text-gray-400 truncate max-w-[280px]">Witness: {selectedDossier.cryptographicWitness}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
