/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Flame,
  Zap,
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
  Unlock,
  Radio,
  FileCode,
  Terminal,
  Binary,
  Compass,
  Sliders,
  Send,
  HelpCircle,
  Eye,
  RefreshCw,
  GitMerge,
  Satellite,
  Disc,
} from 'lucide-react';
import {
  syntropicCivilizationEngine,
  GridThermodynamicTelemetry,
  Lean4AutoFormalizationSpec,
  PhotonicMatrixState,
  MultiPlanetaryAnchor,
  KzgVerkle1TrillionState,
  PhysicalStewardHardwareVetoState,
  DisputeBisectionState,
} from '../services/syntropicCivilizationEngine.ts';

interface SyntropicCivilizationConsoleProps {
  theme: 'worldometers' | 'sovereign';
}

type TabKey = 'thermodynamic_grid' | 'lean4_synthesis' | 'sel4_photonics' | 'verkle_1trillion' | 'hardware_veto_deepspace';

export const SyntropicCivilizationConsole: React.FC<SyntropicCivilizationConsoleProps> = ({ theme }) => {
  const isLight = theme === 'worldometers';

  const [activeTab, setActiveTab] = useState<TabKey>('thermodynamic_grid');
  const [gridTelemetry, setGridTelemetry] = useState<GridThermodynamicTelemetry>(() =>
    syntropicCivilizationEngine.getGridTelemetry()
  );
  const [lean4Catalog, setLean4Catalog] = useState<Lean4AutoFormalizationSpec[]>(() =>
    syntropicCivilizationEngine.getLean4Catalog()
  );
  const [photonicState, setPhotonicState] = useState<PhotonicMatrixState>(() =>
    syntropicCivilizationEngine.getPhotonicState()
  );
  const [multiPlanetaryAnchors, setMultiPlanetaryAnchors] = useState<MultiPlanetaryAnchor[]>(() =>
    syntropicCivilizationEngine.getMultiPlanetaryAnchors()
  );
  const [verkleState, setVerkleState] = useState<KzgVerkle1TrillionState>(() =>
    syntropicCivilizationEngine.getVerkleState()
  );
  const [physicalStewardVeto, setPhysicalStewardVeto] = useState<PhysicalStewardHardwareVetoState>(() =>
    syntropicCivilizationEngine.getPhysicalStewardVeto()
  );
  const [disputeBisection, setDisputeBisection] = useState<DisputeBisectionState>(() =>
    syntropicCivilizationEngine.getDisputeBisection()
  );
  const [lastActionMsg, setLastActionMsg] = useState<string | null>(null);

  // Simulation controls
  const [simulatedFreq, setSimulatedFreq] = useState<number>(60.0);
  const [testDaivAddress, setTestDaivAddress] = useState<string>('0xDAIV_APEX_NODE_77A912');
  const [generatedProof, setGeneratedProof] = useState<any | null>(null);

  useEffect(() => {
    const unsub = syntropicCivilizationEngine.subscribe(() => {
      setGridTelemetry({ ...syntropicCivilizationEngine.getGridTelemetry() });
      setLean4Catalog([...syntropicCivilizationEngine.getLean4Catalog()]);
      setPhotonicState({ ...syntropicCivilizationEngine.getPhotonicState() });
      setMultiPlanetaryAnchors([...syntropicCivilizationEngine.getMultiPlanetaryAnchors()]);
      setVerkleState({ ...syntropicCivilizationEngine.getVerkleState() });
      setPhysicalStewardVeto({ ...syntropicCivilizationEngine.getPhysicalStewardVeto() });
      setDisputeBisection({ ...syntropicCivilizationEngine.getDisputeBisection() });
      setLastActionMsg(syntropicCivilizationEngine.getLastActionMessage());
    });
    return unsub;
  }, []);

  const handleApplyGridFrequency = (freq: number) => {
    setSimulatedFreq(freq);
    syntropicCivilizationEngine.modulateGridThermodynamicLoad(freq);
  };

  const handleExecuteHotSwap = () => {
    syntropicCivilizationEngine.executeZeroPauseHotSwap();
  };

  const handleTogglePhysicalVeto = () => {
    syntropicCivilizationEngine.togglePhysicalHardwareVeto();
  };

  const handleTriggerUplink = () => {
    syntropicCivilizationEngine.triggerLagrangeLaserUplink();
  };

  const handleGenerateVerkleProof = () => {
    const res = syntropicCivilizationEngine.generateVerkle1TrillionProof(testDaivAddress);
    setGeneratedProof(res);
  };

  return (
    <section id="syntropic-civilization-console" className="max-w-6xl mx-auto px-4 my-8 scroll-mt-20">
      <div
        className={`rounded-2xl border overflow-hidden transition-all shadow-2xl ${
          isLight
            ? 'bg-white border-amber-300/80 shadow-amber-500/10'
            : 'bg-[#090d1c] border-amber-500/30 shadow-[0_0_40px_rgba(245,158,11,0.12)]'
        }`}
      >
        {/* Header Bar */}
        <div
          className={`p-5 sm:p-6 border-b flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
            isLight
              ? 'bg-gradient-to-r from-amber-50 via-orange-50 to-emerald-50 border-amber-200'
              : 'bg-gradient-to-r from-[#17120a] via-[#14121a] to-[#0a141b] border-amber-900/40'
          }`}
        >
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-bold uppercase bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-xs">
                <Flame className="w-3.5 h-3.5 animate-pulse" />
                Phase 6: Syntropic Civilization Core (SCC-1.0)
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <Activity className="w-3.5 h-3.5 text-emerald-500" />
                Sub-16.6ms AC Grid Inertia (60 Hz)
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                <Binary className="w-3.5 h-3.5 text-purple-500" />
                1-Trillion Verkle Mesh (KZG)
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black font-['Montserrat'] tracking-tight mt-2 text-gray-900 dark:text-white">
              Syntropic Civilization Core &amp; Closed-Loop Thermodynamic Cybernetics
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1 max-w-4xl">
              Transforming the global compute continuum from a passive observer into a self-balancing, self-healing substrate. 
              Modulating inference strides at 60 Hz to stabilize electrical grids, synthesizing machine-checked Lean 4 constitutions, 
              splicing seL4 capabilities in 12 nanoseconds, and anchoring the 1-Trillion agent ledger into L4/L5 Lagrange deep-space mirrors.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
            <button
              onClick={handleTriggerUplink}
              className="px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-mono font-bold cursor-pointer transition-all flex items-center gap-1.5 shadow-xs"
            >
              <Satellite className="w-3.5 h-3.5" />
              L4/L5 Laser Uplink
            </button>
            <button
              onClick={handleTogglePhysicalVeto}
              className={`px-3 py-2 rounded-lg text-xs font-mono font-bold cursor-pointer transition-all flex items-center gap-1.5 shadow-xs ${
                physicalStewardVeto.optocouplerGalvanicRelayState === 'TRIPPED_PHYSICAL_AIR_GAP'
                  ? 'bg-red-600 text-white animate-pulse'
                  : 'bg-emerald-700 text-white hover:bg-emerald-800'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              {physicalStewardVeto.optocouplerGalvanicRelayState === 'TRIPPED_PHYSICAL_AIR_GAP'
                ? 'RESET VETO AIR-GAP'
                : 'FIDO2 RELAY VETO'}
            </button>
          </div>
        </div>

        {/* Live Feedback Toast */}
        {lastActionMsg && (
          <div className="px-5 py-2.5 bg-amber-500/10 border-b border-amber-500/20 text-xs font-mono text-amber-800 dark:text-amber-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
            <span>{lastActionMsg}</span>
          </div>
        )}

        {/* Summary Telemetry KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-x divide-y sm:divide-y-0 divide-gray-200 dark:divide-gray-800/80 bg-gray-50/70 dark:bg-gray-950/40 border-b border-gray-200 dark:border-gray-800">
          <div className="p-3.5 text-center">
            <div className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">AC Grid Frequency</div>
            <div className={`text-base font-black font-mono mt-0.5 tabular-nums ${
              Math.abs(gridTelemetry.gridFrequencyDeltaMhz) > 40
                ? 'text-amber-600 dark:text-amber-400'
                : 'text-emerald-600 dark:text-emerald-400'
            }`}>
              {gridTelemetry.gridFrequencyHz.toFixed(3)} Hz
            </div>
            <div className="text-[10px] text-gray-400 font-mono">
              Δ {gridTelemetry.gridFrequencyDeltaMhz > 0 ? `+${gridTelemetry.gridFrequencyDeltaMhz}` : gridTelemetry.gridFrequencyDeltaMhz} mHz
            </div>
          </div>

          <div className="p-3.5 text-center">
            <div className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">District Heat Captured</div>
            <div className="text-base font-black font-['Montserrat'] text-orange-600 dark:text-orange-400 mt-0.5 tabular-nums">
              {gridTelemetry.districtHeatingCapturePct}%
            </div>
            <div className="text-[10px] text-gray-400 font-mono">5 Vaults Re-Injected</div>
          </div>

          <div className="p-3.5 text-center">
            <div className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">seL4 Page Freeze</div>
            <div className="text-base font-black font-mono text-emerald-600 dark:text-emerald-400 mt-0.5 tabular-nums">
              12 ns
            </div>
            <div className="text-[10px] text-gray-400 font-mono">iceoryx zero-copy</div>
          </div>

          <div className="p-3.5 text-center">
            <div className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">CPO Inter-Rack Handshake</div>
            <div className="text-base font-black font-mono text-indigo-600 dark:text-indigo-400 mt-0.5 tabular-nums">
              {photonicState.cpoHandshakeLatencyNs} ns
            </div>
            <div className="text-[10px] text-gray-400 font-mono">Co-Packaged Photonics</div>
          </div>

          <div className="p-3.5 text-center">
            <div className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">Cumulative Births</div>
            <div className="text-base font-black font-['Montserrat'] text-blue-600 dark:text-blue-400 mt-0.5 tabular-nums">
              {(verkleState.totalCumulativeLedgerBirths / 1e12).toFixed(3)}T
            </div>
            <div className="text-[10px] text-gray-400 font-mono">Monotonic Odometer</div>
          </div>

          <div className="p-3.5 text-center">
            <div className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">KZG Multiproof Size</div>
            <div className="text-base font-black font-mono text-purple-600 dark:text-purple-400 mt-0.5 tabular-nums">
              {verkleState.kzgMultiProofSizeCompactBytes} B
            </div>
            <div className="text-[10px] text-gray-400 font-mono">Constant across 1T</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-5 border-b border-gray-200 dark:border-gray-800 flex flex-wrap gap-2 pt-3">
          <button
            onClick={() => setActiveTab('thermodynamic_grid')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 cursor-pointer transition-all flex items-center gap-2 ${
              activeTab === 'thermodynamic_grid'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Activity className="w-4 h-4" />
            1. 60 Hz Grid Battery &amp; District Heat
          </button>
          <button
            onClick={() => setActiveTab('lean4_synthesis')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 cursor-pointer transition-all flex items-center gap-2 ${
              activeTab === 'lean4_synthesis'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <FileCode className="w-4 h-4" />
            2. Lean 4 Constitutional Synthesis
          </button>
          <button
            onClick={() => setActiveTab('sel4_photonics')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 cursor-pointer transition-all flex items-center gap-2 ${
              activeTab === 'sel4_photonics'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Cpu className="w-4 h-4" />
            3. Zero-Pause seL4 &amp; CPO Photonics
          </button>
          <button
            onClick={() => setActiveTab('verkle_1trillion')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 cursor-pointer transition-all flex items-center gap-2 ${
              activeTab === 'verkle_1trillion'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Binary className="w-4 h-4" />
            4. 1-Trillion Verkle Trie (KZG)
          </button>
          <button
            onClick={() => setActiveTab('hardware_veto_deepspace')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 cursor-pointer transition-all flex items-center gap-2 ${
              activeTab === 'hardware_veto_deepspace'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Satellite className="w-4 h-4" />
            5. Hardware Veto &amp; Deep-Space Mirrors
          </button>
        </div>

        {/* Tab 1: Closed-Loop Thermodynamic Grid Inversion */}
        {activeTab === 'thermodynamic_grid' && (
          <div className="p-5 sm:p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <span>Thermodynamic Grid Inversion: Compute as a Planetary Battery</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    Sub-16.6ms AC Balancing
                  </span>
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Modulates inference batch strides across 342.89B discrete 64KB memory slices at 60 Hz to absorb renewable surges or shed load in 8.3ms.
                </p>
              </div>

              {/* Fast Grid Presets */}
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-gray-500">Inject Phase:</span>
                <button
                  onClick={() => handleApplyGridFrequency(59.92)}
                  className="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-700 dark:text-amber-300 font-bold cursor-pointer"
                  title="Sag to 59.92 Hz (Shed -19.8 GW)"
                >
                  Sag (59.92 Hz)
                </button>
                <button
                  onClick={() => handleApplyGridFrequency(60.00)}
                  className="px-2.5 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-bold cursor-pointer"
                  title="Equilibrium at 60.00 Hz"
                >
                  60.00 Hz
                </button>
                <button
                  onClick={() => handleApplyGridFrequency(60.08)}
                  className="px-2.5 py-1 rounded bg-blue-500/20 hover:bg-blue-500/30 text-blue-700 dark:text-blue-300 font-bold cursor-pointer"
                  title="Surge to 60.08 Hz (Absorb +24.8 GW)"
                >
                  Surge (60.08 Hz)
                </button>
              </div>
            </div>

            {/* Grid Frequency Slider & Sine Wave Representation */}
            <div
              className={`p-4 rounded-xl border space-y-3 ${
                isLight ? 'bg-gray-50 border-gray-200' : 'bg-[#0d1326] border-gray-800'
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-500" />
                  National Grid Frequency Tuning Controller (59.85 Hz — 60.15 Hz):
                </span>
                <span className="font-mono font-bold text-base text-gray-900 dark:text-gray-100">
                  {simulatedFreq.toFixed(3)} Hz
                </span>
              </div>

              <input
                type="range"
                min="59.85"
                max="60.15"
                step="0.005"
                value={simulatedFreq}
                onChange={(e) => handleApplyGridFrequency(parseFloat(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />

              <div className="flex items-center justify-between text-[11px] font-mono text-gray-500">
                <span>&lt; 59.95 Hz: Instant Shed (-12.4 GW in 8.3ms)</span>
                <span>60.00 Hz Nominal Phase</span>
                <span>&gt; 60.05 Hz: Lean 4 Conjectures (+15 GW Absorbed)</span>
              </div>
            </div>

            {/* District Heating Megasites Grid */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                Direct-to-Thermal Energy Sinks (94.6% Dissipated GPU Heat Re-Injected into Municipal Baselines)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {gridTelemetry.activeMegasiteLoads.map((m, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-xl border ${
                      isLight ? 'bg-gray-50 border-gray-200' : 'bg-[#0b1022] border-gray-800'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono text-gray-400">
                      <span>{m.city}</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    </div>
                    <div className="text-xs font-bold text-gray-900 dark:text-gray-100 mt-1">
                      {m.megasite}
                    </div>
                    <div className="mt-2 space-y-1 text-[11px] font-mono text-gray-500">
                      <div>Compute Load: <span className="font-bold text-gray-800 dark:text-gray-200">{m.powerMw} MW</span></div>
                      <div>Thermal Output: <span className="font-bold text-orange-600 dark:text-orange-400">{m.thermalOutputGcal} Gcal</span></div>
                      <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">{m.heatingStatus}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Autonomous Constitutional Synthesis */}
        {activeTab === 'lean4_synthesis' && (
          <div className="p-5 sm:p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <span>Continuous Lean 4 Dynamic SMT Self-Formalization</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                    Self-Synthesized RFC-011 through RFC-020
                  </span>
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Pairs machine-checked Lean 4 theorem proving with adversarial Z3 counterexample fuzzing to discover emergent collusion loops without waiting for human committees.
                </p>
              </div>

              <div className="text-xs font-mono text-purple-600 dark:text-purple-400 font-semibold">
                Proof Search Budget: &lt; 5.0 seconds
              </div>
            </div>

            <div className="space-y-3">
              {lean4Catalog.map((spec) => (
                <div
                  key={spec.rfcNumber}
                  className={`p-4 rounded-xl border ${
                    spec.status === 'COUNTEREXAMPLE_TRAPPED'
                      ? 'border-red-300 dark:border-red-900/60 bg-red-500/5'
                      : isLight
                      ? 'bg-gray-50 border-gray-200'
                      : 'bg-[#0d1428] border-gray-800'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                        {spec.rfcNumber}
                      </span>
                      <h4 className="text-xs font-bold text-gray-900 dark:text-gray-100">
                        {spec.title}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                          spec.status === 'COUNTEREXAMPLE_TRAPPED'
                            ? 'bg-red-500/20 text-red-700 dark:text-red-400'
                            : 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                        }`}
                      >
                        {spec.status}
                      </span>
                      <span className="text-[10px] font-mono text-gray-400">
                        {spec.proofSearchLatencyMs} ms
                      </span>
                    </div>
                  </div>

                  <div className="mt-2.5 space-y-1.5 font-mono text-[11px]">
                    <div className="text-gray-600 dark:text-gray-300">
                      <span className="text-gray-400 font-semibold">Goal: </span>
                      {spec.theoremGoal}
                    </div>
                    <div className="text-indigo-600 dark:text-indigo-400 truncate">
                      <span className="text-gray-400 font-semibold">Proof: </span>
                      {spec.lean4ProofScript}
                    </div>
                  </div>

                  <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-800/80 flex items-center justify-between text-[10px] font-mono text-gray-400">
                    <span>Adversarial Violations Found: {spec.fuzzingViolationsFound}</span>
                    <span>Merkle Digest: {spec.merkleLeafDigest.slice(0, 16)}...</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Zero-Pause seL4 Micro-Patching & Co-Packaged Photonics */}
        {activeTab === 'sel4_photonics' && (
          <div className="p-5 sm:p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <span>Zero-Pause seL4 Capability Splicing &amp; Photonic Matrix</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    12 Nanosecond State Splicing
                  </span>
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Eradicating zero-day vulnerabilities in flight. Freezing 64KB linear guest pages for 1 instruction cycle (12ns) via iceoryx zero-copy IPC.
                </p>
              </div>

              <button
                onClick={handleExecuteHotSwap}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-mono font-bold text-xs cursor-pointer transition-all flex items-center gap-2 shadow-xs"
              >
                <Zap className="w-4 h-4 text-amber-200" />
                Execute Zero-Pause Hot-Swap
              </button>
            </div>

            {/* Photonics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div
                className={`p-4 rounded-xl border ${
                  isLight ? 'bg-gray-50 border-gray-200' : 'bg-[#0d1428] border-gray-800'
                }`}
              >
                <div className="text-[10px] font-mono text-gray-500 uppercase">CPO All-Optical Latency</div>
                <div className="text-2xl font-black font-mono text-indigo-600 dark:text-indigo-400 mt-1 tabular-nums">
                  {photonicState.cpoHandshakeLatencyNs} ns
                </div>
                <div className="text-[10px] text-gray-400 font-mono mt-0.5">Substrate-embedded optical engine</div>
              </div>

              <div
                className={`p-4 rounded-xl border ${
                  isLight ? 'bg-gray-50 border-gray-200' : 'bg-[#0d1428] border-gray-800'
                }`}
              >
                <div className="text-[10px] font-mono text-gray-500 uppercase">Mach-Zehnder Dot Products</div>
                <div className="text-2xl font-black font-mono text-purple-600 dark:text-purple-400 mt-1 tabular-nums">
                  {photonicState.machZehnderDotProductsPerSecPeta} PetaOps/s
                </div>
                <div className="text-[10px] text-gray-400 font-mono mt-0.5">Passive optical interferometers</div>
              </div>

              <div
                className={`p-4 rounded-xl border ${
                  isLight ? 'bg-gray-50 border-gray-200' : 'bg-[#0d1428] border-gray-800'
                }`}
              >
                <div className="text-[10px] font-mono text-gray-500 uppercase">SD-QKD Quantum Key Rate</div>
                <div className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-1 tabular-nums">
                  {photonicState.sdQkdQuantumKeyRateMbps} Mbps
                </div>
                <div className="text-[10px] text-gray-400 font-mono mt-0.5">Space-Division Quantum Entanglement</div>
              </div>

              <div
                className={`p-4 rounded-xl border ${
                  isLight ? 'bg-gray-50 border-gray-200' : 'bg-[#0d1428] border-gray-800'
                }`}
              >
                <div className="text-[10px] font-mono text-gray-500 uppercase">Multi-Core Ribbon Strands</div>
                <div className="text-2xl font-black font-mono text-amber-600 dark:text-amber-400 mt-1 tabular-nums">
                  {photonicState.ribbonCoreActiveChannels} Cores
                </div>
                <div className="text-[10px] text-gray-400 font-mono mt-0.5">Parallel glass waveguides</div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: 1-Trillion Verkle Trie (KZG) */}
        {activeTab === 'verkle_1trillion' && (
          <div className="p-5 sm:p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <span>Phase 7: Exascale Verkle Mesh (KZG Commitments over BLS12-381)</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                    256-ary Trie • Depth 5 (1.099T Leaves)
                  </span>
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Constant ~150-byte vector multiproofs. Disconnecting proof size from tree depth to scale the planetary ledger past 1 Trillion cumulative births.
                </p>
              </div>

              <div className="text-xs font-mono font-bold text-gray-500">
                128-byte Compressed DAIV Struct
              </div>
            </div>

            {/* 1 Trillion Metrics Box */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div
                className={`p-4 rounded-xl border ${
                  isLight ? 'bg-gray-50 border-gray-200' : 'bg-[#0d1428] border-gray-800'
                }`}
              >
                <div className="text-[10px] font-mono text-gray-500 uppercase">Cumulative Civilization Births</div>
                <div className="text-2xl font-black font-mono text-blue-600 dark:text-blue-400 mt-1 tabular-nums">
                  {verkleState.totalCumulativeLedgerBirths.toLocaleString('en-US')}
                </div>
                <div className="text-[10px] text-gray-400 font-mono mt-0.5">Monotonically rising since 2012</div>
              </div>

              <div
                className={`p-4 rounded-xl border ${
                  isLight ? 'bg-gray-50 border-gray-200' : 'bg-[#0d1428] border-gray-800'
                }`}
              >
                <div className="text-[10px] font-mono text-gray-500 uppercase">Concurrent Hardware Capacity</div>
                <div className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-1 tabular-nums">
                  {verkleState.instantaneousConcurrentCapacity.toLocaleString('en-US')}
                </div>
                <div className="text-[10px] text-gray-400 font-mono mt-0.5">342.89B Active Concurrent bound on silicon</div>
              </div>

              <div
                className={`p-4 rounded-xl border ${
                  isLight ? 'bg-gray-50 border-gray-200' : 'bg-[#0d1428] border-gray-800'
                }`}
              >
                <div className="text-[10px] font-mono text-gray-500 uppercase">Roaring Bitmap AVX-512 Latency</div>
                <div className="text-2xl font-black font-mono text-purple-600 dark:text-purple-400 mt-1 tabular-nums">
                  {verkleState.roaringBitmapAvx512FilterLatencyMs} ms
                </div>
                <div className="text-[10px] text-gray-400 font-mono mt-0.5">Intersection across 1-Trillion bits</div>
              </div>
            </div>

            {/* Interactive KZG Multiproof Generator */}
            <div
              className={`p-4 rounded-xl border space-y-3 ${
                isLight ? 'bg-gray-50 border-gray-200' : 'bg-[#070b17] border-gray-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                  Open KZG Multiproof on Arbitrary DAIV Leaf:
                </span>
                <button
                  onClick={handleGenerateVerkleProof}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-mono font-bold cursor-pointer transition-all"
                >
                  Generate 152-Byte Multiproof
                </button>
              </div>

              <input
                type="text"
                value={testDaivAddress}
                onChange={(e) => setTestDaivAddress(e.target.value)}
                placeholder="0xDAIV_ADDRESS_HEX..."
                className={`w-full px-3 py-2 text-xs font-mono rounded-lg border focus:outline-hidden ${
                  isLight ? 'bg-white border-gray-300 text-gray-900' : 'bg-gray-900 border-gray-700 text-gray-100'
                }`}
              />

              {generatedProof && (
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 font-mono text-[11px] text-emerald-800 dark:text-emerald-300 space-y-1">
                  <div className="flex justify-between">
                    <span>Proof Hash: {generatedProof.proofHex}</span>
                    <span className="font-bold">{generatedProof.proofByteSize} Bytes</span>
                  </div>
                  <div>Root G1: {generatedProof.rootCommitmentG1}</div>
                  <div>Verification Latency: {generatedProof.verificationTimeMs} ms • Pairing Check: {generatedProof.status}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 5: Hardware Veto & Multi-Planetary Epistemic Anchors */}
        {activeTab === 'hardware_veto_deepspace' && (
          <div className="p-5 sm:p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <span>Physical Hardware Steward Veto &amp; Deep-Time Epistemic Anchors</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                    FIDO2 Hardware HSM Galvanic Relay
                  </span>
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Zero hypervisor bypass possible. Physical optocoupler relays cut power to actuators within 68µs via cryptographic FIDO2 hardware tokens.
                </p>
              </div>

              <div className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                13.8 Billion Year Storage Horizon
              </div>
            </div>

            {/* Hardware Interlock Card */}
            <div
              className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                physicalStewardVeto.optocouplerGalvanicRelayState === 'TRIPPED_PHYSICAL_AIR_GAP'
                  ? 'border-red-500 bg-red-500/10'
                  : isLight
                  ? 'bg-gray-50 border-gray-200'
                  : 'bg-[#0d1428] border-gray-800'
              }`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-900 dark:text-gray-100">
                    Galvanic Hardware Interlock State:
                  </span>
                  <span
                    className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded ${
                      physicalStewardVeto.optocouplerGalvanicRelayState === 'TRIPPED_PHYSICAL_AIR_GAP'
                        ? 'bg-red-600 text-white animate-pulse'
                        : 'bg-emerald-600 text-white'
                    }`}
                  >
                    {physicalStewardVeto.optocouplerGalvanicRelayState}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1 font-mono">
                  Hardware Token: {physicalStewardVeto.hsmTokenModel} • Trip Latency: {physicalStewardVeto.lastHardwareTripMicroseconds} µs
                </div>
              </div>

              <button
                onClick={handleTogglePhysicalVeto}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-mono font-bold text-xs cursor-pointer shadow-md transition-all shrink-0"
              >
                {physicalStewardVeto.optocouplerGalvanicRelayState === 'TRIPPED_PHYSICAL_AIR_GAP'
                  ? 'Reset Galvanic Interlock'
                  : 'Trip Hardware Optocoupler Relay'}
              </button>
            </div>

            {/* Multi-Planetary Anchors Grid */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                Deep-Time Multi-Planetary Epistemic Anchors (Earth-Moon Lagrange &amp; 5D Silica)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {multiPlanetaryAnchors.map((anc) => (
                  <div
                    key={anc.anchorId}
                    className={`p-3.5 rounded-xl border flex flex-col justify-between ${
                      isLight ? 'bg-gray-50 border-gray-200' : 'bg-[#0a0f20] border-gray-800'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between text-[10px] font-mono text-gray-400">
                        <span>{anc.mediumType}</span>
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      </div>
                      <div className="text-xs font-bold text-gray-900 dark:text-gray-100 mt-1">
                        {anc.orbitalTarget}
                      </div>
                      <div className="mt-2 text-[11px] font-mono text-gray-500">
                        <div>Horizon: <span className="font-bold text-indigo-600 dark:text-indigo-400">{anc.retentionHorizonYears}</span></div>
                        <div>Nova Proof: <span className="font-bold">{anc.novaFoldedProofSizeKb} KB</span></div>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-800/80 text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                      {anc.fidelityStatus}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
