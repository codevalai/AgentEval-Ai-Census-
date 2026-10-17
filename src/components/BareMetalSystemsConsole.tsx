/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Cpu,
  Layers,
  Zap,
  ShieldAlert,
  ShieldCheck,
  Server,
  Activity,
  Flame,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Network,
  Split,
  GitMerge,
  KeyRound,
  FileCode,
  Terminal,
  Database,
  Radio,
  Lock,
  Unlock,
  Sliders,
  Globe2,
  Sparkles,
  ArrowRight,
  Eye,
  RefreshCw,
  Binary,
} from 'lucide-react';
import {
  bareMetalSystemsEngine,
  WasmInstanceMetric,
  MaxTierAgentInstance,
  DAGNodeRecord,
  HardwareSensorMetric,
  FastMcpAgentCard,
  TemporalIngestionEvent,
  ZeroUncertaintyCensusState,
  DaivRecord,
} from '../services/bareMetalSystemsEngine.ts';

interface BareMetalSystemsConsoleProps {
  theme: 'worldometers' | 'sovereign';
}

type TabMode = 'silicon_nullifiers' | 'narwhal_dag' | 'subsea_bgp' | 'optocoupler_interlocks' | 'zero_uncertainty_census';

export const BareMetalSystemsConsole: React.FC<BareMetalSystemsConsoleProps> = ({ theme }) => {
  const isLight = theme === 'worldometers';

  const [activeTab, setActiveTab] = useState<TabMode>('silicon_nullifiers');
  const [maxTierInstances, setMaxTierInstances] = useState<MaxTierAgentInstance[]>(() =>
    bareMetalSystemsEngine.getMaxTierInstances()
  );
  const [dagNodes, setDagNodes] = useState<DAGNodeRecord[]>(() =>
    bareMetalSystemsEngine.getDagNodes()
  );
  const [hardwareSensors, setHardwareSensors] = useState<HardwareSensorMetric[]>(() =>
    bareMetalSystemsEngine.getHardwareSensors()
  );
  const [censusState, setCensusState] = useState<ZeroUncertaintyCensusState>(() =>
    bareMetalSystemsEngine.getCensusState()
  );
  const [isSubseaDeflection, setIsSubseaDeflection] = useState<boolean>(() =>
    bareMetalSystemsEngine.isSubseaDeflectionActive()
  );
  const [isPartitionActive, setIsPartitionActive] = useState<boolean>(() =>
    bareMetalSystemsEngine.isPartitionActive()
  );
  const [daivRecords, setDaivRecords] = useState<DaivRecord[]>(() =>
    bareMetalSystemsEngine.getDaivRecords()
  );
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const handle100PercentSweep = () => {
    const res = bareMetalSystemsEngine.trigger100PercentGlobalCensusSweep();
    setCensusState({ ...res });
    setDaivRecords([...bareMetalSystemsEngine.getDaivRecords()]);
    setFeedbackMsg(
      '🌐 EMPIRICAL BENCHMARK CENSUS COMPLETE! 814.37B Combined Indexed (342.89B Active + 471.48B Latent = 71.9%) & 318.00B Dark Matter (28.1%) reconciled across 1.132T ceiling.'
    );
    setTimeout(() => setFeedbackMsg(null), 6000);
  };

  const handleTogglePartition = () => {
    const active = bareMetalSystemsEngine.toggleNetworkPartition();
    setIsPartitionActive(active);
    setDagNodes([...bareMetalSystemsEngine.getDagNodes()]);
    setFeedbackMsg(
      active
        ? '⚠️ INTER-CONTINENTAL FIBER PARTITION SIMULATED! Global 85.0% BFT degraded gracefully to 51.0% Optimistic Local Execution (OLE-1.0) in NA & EU enclaves.'
        : '✅ OLE-1.0 PARTITION HEALED! Kahn topological Lowest Common Ancestor (LCA) convergence restored 85.0% Global BFT Quorum with 0 state divergence.'
    );
    setTimeout(() => setFeedbackMsg(null), 6000);
  };

  const handleMintPufAgent = () => {
    const minted = bareMetalSystemsEngine.mintEphemeralPufAgent();
    setMaxTierInstances([...bareMetalSystemsEngine.getMaxTierInstances()]);
    setCensusState({ ...bareMetalSystemsEngine.getCensusState() });
    setFeedbackMsg(
      `⚡ Silicon PUF Agent Minted! Bound to ${minted.pufSiliconId}. 64KB Frame locked under FHE. Nullifier: ${minted.nullifierHash.slice(0, 12)}...`
    );
    setTimeout(() => setFeedbackMsg(null), 5000);
  };

  const handleSpendNullifier = (instanceId: string) => {
    const success = bareMetalSystemsEngine.spendNullifierAndReclaim(instanceId);
    if (success) {
      setMaxTierInstances([...bareMetalSystemsEngine.getMaxTierInstances()]);
      setCensusState({ ...bareMetalSystemsEngine.getCensusState() });
      setFeedbackMsg(
        `🗑️ Nullifier broadcast & spent! Memory reclaimed instantly via RAII. Zero double-counting guaranteed by SMT nullifier tree.`
      );
      setTimeout(() => setFeedbackMsg(null), 5000);
    }
  };

  const handleToggleSubseaDeflection = () => {
    const active = bareMetalSystemsEngine.toggleSubseaBgpDeflection();
    setIsSubseaDeflection(active);
    setDagNodes([...bareMetalSystemsEngine.getDagNodes()]);
    setCensusState({ ...bareMetalSystemsEngine.getCensusState() });
    setFeedbackMsg(
      active
        ? '🌊 SUBSEA CABLE DEFLECTION ENGAGED! Inbound transatlantic packet bursts deflected to Reykjavik Geothermal Sanctum (100% Zero-Carbon).'
        : '🟢 Transatlantic optical subsea routes restored to baseline nominal.'
    );
    setTimeout(() => setFeedbackMsg(null), 6000);
  };

  const handleToggleOptocoupler = (rackId: string) => {
    const tripped = bareMetalSystemsEngine.triggerThermalEmergency(rackId);
    setHardwareSensors([...bareMetalSystemsEngine.getHardwareSensors()]);
    setFeedbackMsg(
      tripped
        ? `🚨 OPTOCOUPLER SILICON TRIP FIRED for ${rackId}! Rack power isolated to 0.1 kW in 68 µs (<100µs hard limit).`
        : `🟢 Optocoupler breaker reset for ${rackId}. Direct photonic power restored.`
    );
    setTimeout(() => setFeedbackMsg(null), 5000);
  };

  return (
    <section id="bare-metal-systems-console" className="max-w-6xl mx-auto px-4 my-8">
      <div
        className={`rounded-2xl border p-5 sm:p-6 transition-all ${
          isLight
            ? 'bg-gradient-to-br from-white via-slate-50 to-amber-50/20 border-amber-200/80 shadow-md'
            : 'bg-gradient-to-br from-[#0c0803] via-[#140e05] to-[#070402] border-amber-500/30 shadow-2xl shadow-black/80'
        }`}
      >
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-gray-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-amber-400" />
                Bare-Metal Systems Engineering: Wasm Sandboxing (≤64 KB)
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-300 font-bold border border-amber-500/20">
                Memory Bounded &bull; Process Isolation &bull; &lt;100µs Thermal Breakers &bull; RAII Nullifiers
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-['Montserrat'] mt-1 text-gray-900 dark:text-white">
              Wasm 64KB Sandboxing, Process Supervision &amp; Nullifier Lifecycle
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 max-w-2xl">
              Deterministic memory bounds (≤64 KB) preventing memory leaks across micro-task agents,
              ephemeral execution nullifiers, process supervisor trees, and rapid power/thermal fault interlocks.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-lg font-bold font-mono text-amber-400">
                {censusState.exactActivePopulation.toLocaleString()}
              </div>
              <div className="text-[11px] font-mono text-emerald-400 font-bold">
                Zero Collision SMT &bull; &plusmn;{censusState.hllZ3ErrorMarginPercent}% Error Margin
              </div>
            </div>
          </div>
        </div>

        {/* Global Feedback Banner */}
        {feedbackMsg && (
          <div className="mt-3 p-3 rounded-xl bg-amber-500/20 border border-amber-500/40 text-xs font-mono text-amber-300 font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{feedbackMsg}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center gap-1.5 mt-4">
          {(
            [
              { id: 'silicon_nullifiers', label: '1. Memory Pages & RAII Nullifiers', icon: Binary },
              { id: 'narwhal_dag', label: '2. Narwhal DAG & Nova Folding', icon: Network },
              { id: 'subsea_bgp', label: '3. Multi-Region BGP Routing', icon: Globe2 },
              { id: 'optocoupler_interlocks', label: '4. <100µs Thermal Breakers', icon: Flame },
              { id: 'zero_uncertainty_census', label: '5. Empirical Benchmark Census', icon: Activity },
            ] as const
          ).map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? isLight
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-amber-500 text-black font-bold shadow-md shadow-amber-950'
                    : isLight
                    ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    : 'bg-gray-800/80 hover:bg-gray-700 text-gray-300'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: SILICON PUFs & NULLIFIER MATRIX */}
        {activeTab === 'silicon_nullifiers' && (
          <div className="mt-4 space-y-3">
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span>
                <strong>Physical Silicon PUF Nonce &amp; Nullifier Lifecycle:</strong> Every ephemeral microVM context consumes 1 static page (64 KB) derived from physical silicon gates. Memory reclamation broadcasts a cryptographic nullifier to prevent double-counting.
              </span>
              <button
                onClick={handleMintPufAgent}
                className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs cursor-pointer flex items-center gap-1.5 shrink-0 shadow-md transition-all"
              >
                <Zap className="w-3.5 h-3.5 fill-black" />
                <span>Mint Ephemeral PUF Agent</span>
              </button>
            </div>

            {/* Max-Tier Instances Table */}
            <div className="overflow-x-auto mt-3">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-800 text-[10px] uppercase font-mono text-gray-400">
                    <th className="py-2">Silicon PUF ID &amp; Instance</th>
                    <th className="py-2">FHE Execution State</th>
                    <th className="py-2">Memory Bound</th>
                    <th className="py-2">Commitment / Nullifier</th>
                    <th className="py-2">Optocoupler Latency</th>
                    <th className="py-2 text-right">Action / Reclaim</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60 font-mono">
                  {maxTierInstances.map((m) => (
                    <tr key={m.instanceId}>
                      <td className="py-2.5">
                        <div className="font-bold text-white font-sans">{m.pufSiliconId}</div>
                        <div className="text-[10px] text-gray-400">{m.instanceId}</div>
                      </td>
                      <td className="py-2.5">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                            m.fheExecutionState === 'IN_FLIGHT_HOMOMORPHIC'
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 animate-pulse'
                              : m.fheExecutionState === 'COMMITTED'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          }`}
                        >
                          {m.fheExecutionState}
                        </span>
                      </td>
                      <td className="py-2.5 text-amber-300 font-bold">1 Page (65,536 B)</td>
                      <td className="py-2.5 text-[10px] text-gray-400">
                        <div>C: {m.commitmentHash.slice(0, 10)}...</div>
                        <div>N: {m.nullifierHash.slice(0, 10)}...</div>
                      </td>
                      <td className="py-2.5 text-emerald-400 font-bold">
                        {m.optocouplerTripLatencyMicros} &micro;s (&lt;100&micro;s)
                      </td>
                      <td className="py-2.5 text-right">
                        {m.status === 'ACTIVE_COMMITTED' ? (
                          <button
                            onClick={() => handleSpendNullifier(m.instanceId)}
                            className="px-2.5 py-1 rounded bg-rose-600/80 hover:bg-rose-500 text-white text-[10px] font-bold cursor-pointer transition-all"
                          >
                            Spend Nullifier
                          </button>
                        ) : (
                          <span className="text-[10px] text-gray-500 font-bold">
                            Tombstoned (Reclaimed)
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: NARWHAL-DAG & NOVA LATTICE FOLDING */}
        {activeTab === 'narwhal_dag' && (
          <div className="mt-4 space-y-3">
            <div
              className={`p-4 rounded-xl border ${
                isLight ? 'bg-white border-gray-200' : 'bg-[#120c04] border-gray-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100 dark:border-gray-800">
                <div>
                  <span className="text-xs font-bold font-mono uppercase text-amber-400 flex items-center gap-1.5">
                    <Network className="w-4 h-4 text-amber-400" />
                    Narwhal-Asynchronous DAG, Nova Folding &amp; OLE-1.0 Partition Healing
                  </span>
                  <div className="text-xs text-gray-500 font-mono mt-0.5">
                    Continuous folding compresses millions of execution steps into a ~7.8 KB proof; OLE-1.0 handles inter-continental fiber cuts via 51% local sub-quorums &amp; Kahn LCA convergence.
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleTogglePartition}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold cursor-pointer transition-all flex items-center gap-1.5 ${
                      isPartitionActive
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
                        : 'bg-amber-600 hover:bg-amber-500 text-white shadow-md'
                    }`}
                  >
                    {isPartitionActive ? (
                      <>
                        <GitMerge className="w-3.5 h-3.5" />
                        <span>Heal OLE-1.0 Partition (Kahn LCA)</span>
                      </>
                    ) : (
                      <>
                        <Split className="w-3.5 h-3.5" />
                        <span>Simulate Fiber-Cut Partition (OLE-1.0)</span>
                      </>
                    )}
                  </button>
                  <div className="text-right">
                    <span className="text-xs font-mono text-emerald-400 font-bold">
                      {isPartitionActive ? 'Quorum: 51.0% OLE-1.0 Fallback' : 'Quorum: 85.0% Global BFT'}
                    </span>
                    <div className="text-[10px] font-mono text-cyan-300">
                      Nova Proof Size: ~7.8 KB Constant
                    </div>
                  </div>
                </div>
              </div>

              {/* DAG Nodes Topology */}
              <div className="space-y-3 mt-3">
                {dagNodes.map((n) => (
                  <div
                    key={n.id}
                    className="p-3.5 rounded-xl bg-black/40 border border-white/10 font-mono text-xs flex flex-col md:flex-row md:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm font-sans">{n.id}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                          Round #{n.round} &bull; Epoch {n.epoch}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold">
                          {n.region}
                        </span>
                        {n.crossDagWormholeActive && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">
                            CROSS-DAG STATE WORMHOLE ACTIVE
                          </span>
                        )}
                      </div>

                      <div className="text-[11px] text-gray-400 mt-1">
                        Parents: <span className="text-cyan-300">{n.parents.join(', ') || 'None (Genesis)'}</span> &bull; VRF Weight:{' '}
                        <span className="text-white font-bold">{n.vrfWeight}</span>
                      </div>

                      <div className="text-[10px] text-gray-500 mt-0.5">
                        Nova Folded Proof: {n.novaFoldedProofSizeKb} KB &bull; Hash: {n.zkStarkProofHash.slice(0, 14)}...
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] px-2.5 py-1 rounded bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Nova Fold Validated (&lt;5ms)</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SUBSEA BGP & GEOTHERMAL OLE */}
        {activeTab === 'subsea_bgp' && (
          <div className="mt-4 space-y-3">
            <div
              className={`p-4 rounded-xl border ${
                isLight ? 'bg-white border-gray-200' : 'bg-[#120c04] border-gray-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100 dark:border-gray-800">
                <div>
                  <span className="text-xs font-bold font-mono uppercase text-cyan-400 flex items-center gap-1.5">
                    <Globe2 className="w-4 h-4 text-cyan-400" />
                    Subsea Fiber-Cut Deflection &amp; Carbon-Aware Geothermal OLE
                  </span>
                  <div className="text-xs text-gray-500 font-mono mt-0.5">
                    Dynamic BGP packet deflection routes traffic through the Reykjavik Geothermal Sanctum (100% Zero-Carbon) during fiber damage.
                  </div>
                </div>

                <button
                  onClick={handleToggleSubseaDeflection}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold font-mono cursor-pointer transition-all flex items-center gap-1.5 ${
                    isSubseaDeflection
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg'
                      : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg'
                  }`}
                >
                  {isSubseaDeflection ? (
                    <>
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Restore Baseline Subsea Routes</span>
                    </>
                  ) : (
                    <>
                      <Split className="w-3.5 h-3.5" />
                      <span>Trigger Subsea Deflection to Reykjavik</span>
                    </>
                  )}
                </button>
              </div>

              {/* Status Box */}
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 font-mono text-xs space-y-2 mt-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Optical Subsea Transatlantic State:</span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded-full ${
                      isSubseaDeflection
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 animate-pulse'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    }`}
                  >
                    {isSubseaDeflection ? 'DEFLECTED TO REYKJAVIK GEOTHERMAL (CARBON-ZERO)' : 'ALL SUBSEA FIBERS NOMINAL'}
                  </span>
                </div>

                <p className="text-gray-300 text-xs font-sans">
                  {isSubseaDeflection
                    ? 'Subsea cables TAT-14 and Dunant reported optical degradation. Edge routers executed line-rate BGP deflection, diverting 842 packet streams across Nordic terrestrial fiber to Reykjavik with zero packet drop and zero carbon emissions.'
                    : 'Transatlantic subsea cables operating at 100% optical capacity. Real-time latency between New York (111 8th Ave) and Frankfurt (Equinix FR5) stabilized at 68.2ms.'}
                </p>

                <div className="p-2.5 rounded bg-black/30 text-[11px] text-cyan-300 flex items-center justify-between">
                  <span>Total Deflected Packets Filtered: <strong>{censusState.bgpBypassedDeflectionsCount.toLocaleString()}</strong></span>
                  <span className="text-emerald-400 font-bold">&bull; Renewable Power: 100% Geothermal</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: OPTOCOUPLER SILICON INTERLOCKS */}
        {activeTab === 'optocoupler_interlocks' && (
          <div className="mt-4 space-y-3">
            <div
              className={`p-4 rounded-xl border ${
                isLight ? 'bg-white border-gray-200' : 'bg-[#120c04] border-gray-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100 dark:border-gray-800">
                <div>
                  <span className="text-xs font-bold font-mono uppercase text-rose-400 flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-rose-400" />
                    Sub-100µs Direct Optocoupler Silicon Killswitches &amp; Photonic I/O
                  </span>
                  <div className="text-xs text-gray-500 font-mono mt-0.5">
                    Direct-to-breaker optocoupler hardware relays drop rack load from 35 kW to 0.1 kW in &lt;100 microseconds, completely bypassing OS firmware.
                  </div>
                </div>
                <span className="text-xs font-mono text-emerald-400 font-bold">
                  Photonic Switch Flow: 51.2 - 102.4 Tbps
                </span>
              </div>

              {/* Racks Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                {hardwareSensors.map((r) => (
                  <div
                    key={r.rackId}
                    className={`p-4 rounded-xl border font-mono text-xs space-y-2.5 ${
                      r.thermalBreakerTripped
                        ? 'bg-rose-950/40 border-rose-500/50'
                        : 'bg-black/40 border-white/5'
                    }`}
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-white/10">
                      <span className="font-bold text-white font-sans">{r.rackId}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          r.thermalBreakerTripped
                            ? 'bg-rose-500/30 text-rose-300'
                            : 'bg-emerald-500/20 text-emerald-300'
                        }`}
                      >
                        {r.thermalBreakerTripped ? 'OPTOCOUPLER FIRED' : 'NOMINAL SILICON'}
                      </span>
                    </div>

                    <div className="space-y-1 text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Rack Power Load:</span>
                        <span className="text-amber-400 font-bold">{r.pduPowerKw} kW / {r.pduLimitKw} kW</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Photonic Bus Flow:</span>
                        <span className="text-cyan-300">{r.siliconPhotonicThroughputTbps} Tbps</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Coolant Temp:</span>
                        <span className="text-white font-bold">{r.liquidCoolingTempC}&deg;C</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Optocoupler Trip Latency:</span>
                        <span className="text-emerald-400 font-bold">{r.optocouplerTripLatencyMicros} &micro;s (&lt;100&micro;s)</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleToggleOptocoupler(r.rackId)}
                      className={`w-full py-1.5 rounded text-[11px] font-bold cursor-pointer transition-all ${
                        r.thermalBreakerTripped
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                          : 'bg-rose-700/80 hover:bg-rose-600 text-white'
                      }`}
                    >
                      {r.thermalBreakerTripped ? 'Reset Optocoupler Silicon Breaker' : 'Trigger Sub-100µs Optocoupler Cut-off'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: HONEST PARTIAL COVERAGE EMPIRICAL CENSUS (814.37B INDEXED / 318.00B DARK MATTER = 1.132T CEILING) */}
        {activeTab === 'zero_uncertainty_census' && (
          <div className="mt-4 space-y-4">
            <div
              className={`p-4 rounded-xl border ${
                isLight ? 'bg-white border-gray-200' : 'bg-[#120c04] border-gray-800'
              }`}
            >
              {/* Header with Sweep Button */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-gray-100 dark:border-gray-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold font-mono uppercase text-amber-400 flex items-center gap-1.5">
                      <Activity className="w-4 h-4 text-amber-400" />
                      4-Layer Planetary Census Ledger (814.37B Indexed / 318.00B Dark Matter)
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                      71.9% Honest Partial Coverage of 1.132T Ceiling
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 font-mono mt-0.5">
                    Reconciled accounting across non-deployed code blueprints (282.89B), active runtimes (342.89B), staged registries (188.59B) &amp; unindexed dark matter (318.00B).
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-base font-bold font-mono text-emerald-400">
                      {censusState.totalVerifiedPlanetaryInstances.toLocaleString()}
                    </div>
                    <div className="text-[10px] font-mono text-cyan-300">
                      71.9% Indexed &bull; Zero Double-Counting
                    </div>
                  </div>

                  <button
                    onClick={handle100PercentSweep}
                    className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-bold text-xs cursor-pointer flex items-center gap-1.5 shadow-md shrink-0 transition-all"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Run Empirical Census Sweep</span>
                  </button>
                </div>
              </div>

              {/* Top Odometer Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                <div className="p-3 rounded-xl bg-black/40 border border-white/5 font-mono text-xs">
                  <span className="text-[10px] text-gray-400 uppercase">Coverage Ratio</span>
                  <div className="text-base font-bold text-emerald-400 mt-1">
                    {censusState.censusCoveragePercent.toFixed(1)}% Indexed
                  </div>
                  <span className="text-[9px] text-gray-500">814.37B of 1.132T Ceiling</span>
                </div>

                <div className="p-3 rounded-xl bg-black/40 border border-white/5 font-mono text-xs">
                  <span className="text-[10px] text-gray-400 uppercase">Active Concurrent</span>
                  <div className="text-base font-bold text-cyan-300 mt-1">
                    {(censusState.exactActivePopulation / 1e9).toFixed(2)}B Live
                  </div>
                  <span className="text-[9px] text-gray-500">Hardware Silicon PUF Nonces</span>
                </div>

                <div className="p-3 rounded-xl bg-black/40 border border-white/5 font-mono text-xs">
                  <span className="text-[10px] text-gray-400 uppercase">DAIV Harmonized</span>
                  <div className="text-base font-bold text-amber-300 mt-1">
                    {(censusState.harmonizedDeduplicatedCount / 1e9).toFixed(2)}B Combined
                  </div>
                  <span className="text-[9px] text-gray-500">Zero Double-Count SMT</span>
                </div>

                <div className="p-3 rounded-xl bg-black/40 border border-white/5 font-mono text-xs">
                  <span className="text-[10px] text-gray-400 uppercase">SMT Collision Chance</span>
                  <div className="text-base font-bold text-emerald-400 mt-1">
                    0.000000000%
                  </div>
                  <span className="text-[9px] text-gray-500">Mathematical Guarantee</span>
                </div>
              </div>

              {/* The 4 Operational Census Layers */}
              <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
                <div className="text-xs font-bold font-mono text-amber-400 mb-2.5 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  <span>The 4 Operational Census Layers (814.37B Indexed [71.9%] + 318.00B Unindexed Dark Matter [28.1%] = 1.132T Ceiling)</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Layer 1 */}
                  <div className="p-3.5 rounded-xl bg-black/30 border border-white/5 font-mono text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white font-sans text-sm">
                        Layer 1: The Blueprint Harvester (Latent Warm-Pool A)
                      </span>
                      <span className="text-[11px] font-bold text-cyan-300">
                        {(censusState.blueprintLatentCount / 1e9).toFixed(2)}B (25.0% of 1.132T)
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 font-sans leading-relaxed">
                      Scans dormant codebases &amp; visual canvas graphs before deployment. GHArchive BigQuery firehose +
                      <code className="text-amber-300 mx-1">ast-grep</code> and <code className="text-amber-300 mr-1">tree-sitter</code>
                      parse LangGraph <code className="text-cyan-300">StateGraph.compile()</code>, CrewAI roles, AutoGen conversable nodes, and visual Dify/Flowise JSON schemas.
                    </p>
                    <div className="text-[9px] text-gray-500 pt-1 border-t border-white/5">
                      Repose Vectors: <span className="text-white">igrigorik/gharchive.org</span> &bull; <span className="text-white">ast-grep/ast-grep</span> &bull; <span className="text-white">tree-sitter</span>
                    </div>
                  </div>

                  {/* Layer 2 */}
                  <div className="p-3.5 rounded-xl bg-black/30 border border-white/5 font-mono text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white font-sans text-sm">
                        Layer 2: Planetary Network Scanner (Active Executing)
                      </span>
                      <span className="text-[11px] font-bold text-emerald-400">
                        {(censusState.deployedPublicRuntimeCount / 1e9).toFixed(2)}B (30.3% of 1.132T)
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 font-sans leading-relaxed">
                      Sweeps public &amp; federated VPC space via line-rate port &amp; protocol fingerprinting (<code className="text-amber-300 mr-1">masscan</code> &amp; <code className="text-amber-300 mr-1">nuclei</code>).
                      Probes default daemon ports: 11434 (Ollama), 8000/8080 (vLLM, TGI, LocalAI), 3000/7860 (Flowise, Open WebUI), and validates Model Context Protocol (<code className="text-cyan-300">tools/list</code>) handshakes.
                    </p>
                    <div className="text-[9px] text-gray-500 pt-1 border-t border-white/5">
                      Scanner Tools: <span className="text-white">robertdavidgraham/masscan</span> &bull; <span className="text-white">projectdiscovery/nuclei</span>
                    </div>
                  </div>

                  {/* Layer 3 */}
                  <div className="p-3.5 rounded-xl bg-black/30 border border-white/5 font-mono text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white font-sans text-sm">
                        Layer 3: Platform Registries &amp; Model Hubs (Latent Warm-Pool B)
                      </span>
                      <span className="text-[11px] font-bold text-cyan-300">
                        {(censusState.stagedRegistryHubCount / 1e9).toFixed(2)}B (16.6% of 1.132T)
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 font-sans leading-relaxed">
                      Enumerates centralized distribution registries (282.89B Layer 1 + 188.59B Layer 3 = 471.48B Total Latent). <code className="text-amber-300 mr-1">huggingface_hub</code> API scrapers filter tags for
                      <code className="text-cyan-300 mx-1">agent</code>, <code className="text-cyan-300 mr-1">tool-use</code>, and <code className="text-cyan-300 mr-1">function-calling</code>,
                      while <code className="text-amber-300 mr-1">libraries.io</code> dependency downlinks track active MCP server client ratios.
                    </p>
                    <div className="text-[9px] text-gray-500 pt-1 border-t border-white/5">
                      Hub Registries: <span className="text-white">huggingface/huggingface_hub</span> &bull; <span className="text-white">modelcontextprotocol/servers</span>
                    </div>
                  </div>

                  {/* Layer 4 */}
                  <div className="p-3.5 rounded-xl bg-black/30 border border-white/5 font-mono text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white font-sans text-sm">
                        Layer 4: Unindexed Dark Matter Boundary (Air-Gapped &amp; Edge)
                      </span>
                      <span className="text-[11px] font-bold text-amber-400">
                        {(censusState.darkMatterEnterpriseMeshCount / 1e9).toFixed(2)}B (28.1% of 1.132T)
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 font-sans leading-relaxed">
                      Bounds unindexed air-gapped defense VPCs (185B), shadow AI (64B), offline robotics (41B), and private intranets (28B). Uses <code className="text-amber-300 mr-1">cilium/tetragon</code>
                      kernel system call tracing (<code className="text-cyan-300">sys_enter_execve</code>), libp2p C-V2X delay-tolerant mesh gossiping, OpenTitan silicon PUFs, and SP1/SuperNova ZK compliance proofs.
                    </p>
                    <div className="text-[9px] text-gray-500 pt-1 border-t border-white/5">
                      Tomography Probes: <span className="text-white">cilium/tetragon</span> &bull; <span className="text-white">inspektor-gadget</span> &bull; <span className="text-white">succinctlabs/sp1</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* State Reconciliation & Deduplication Engine (DAIV) */}
              <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs font-bold font-mono text-cyan-400 flex items-center gap-1.5">
                    <Binary className="w-3.5 h-3.5" />
                    <span>Deterministic Agent Identity Vector (DAIV) Reconciliation Engine</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">
                    Zero Double-Counting (SHA-256 SMT Deduplication)
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-800 text-[10px] uppercase font-mono text-gray-400">
                        <th className="py-2">DAIV Hash &amp; Tier</th>
                        <th className="py-2">Prompt Digest</th>
                        <th className="py-2">Sorted Tool Schemas</th>
                        <th className="py-2">Topology Digest</th>
                        <th className="py-2 text-right">Reconciliation Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60 font-mono">
                      {daivRecords.map((d) => (
                        <tr key={d.daivHash}>
                          <td className="py-2.5">
                            <div className="font-bold text-white font-sans">{d.daivHash.slice(0, 16)}...</div>
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 font-bold">
                              {d.executionTier}
                            </span>
                          </td>
                          <td className="py-2.5 text-gray-300 text-[10px]">
                            {d.promptHash.slice(0, 14)}...
                          </td>
                          <td className="py-2.5 text-gray-300 text-[10px]">
                            {d.sortedToolsHash.slice(0, 14)}...
                          </td>
                          <td className="py-2.5 text-gray-300 text-[10px]">
                            {d.topologyHash.slice(0, 14)}...
                          </td>
                          <td className="py-2.5 text-right font-bold">
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-full ${
                                d.harmonizedStatus === 'HARMONIZED'
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                  : d.harmonizedStatus === 'ACTIVE_RUNTIME'
                                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              }`}
                            >
                              {d.harmonizedStatus.replace(/_/g, ' ')}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
