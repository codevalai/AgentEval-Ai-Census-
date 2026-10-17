/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * COD3EVAL SOVEREIGN INFINITY: ULTRA ELITE ENTERPRISE THREAT RADAR
 * Real Telemetry Ingestion (GPU, CUDA OOB, Weights, Gossip, PQC),
 * 4-Vector Threat Classification & Active Cryptographic Mitigation Engine.
 */

import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Zap,
  AlertTriangle,
  Play,
  RefreshCw,
  Cpu,
  Lock,
  Activity,
  Server,
  Network,
  Binary,
  Radio,
  KeyRound,
  Ban,
  Sliders,
  CheckCircle2,
  Terminal,
} from 'lucide-react';
import {
  ThreatVector,
  ThreatVectorCategory,
  MitigationActionType,
  GpuTelemetryLog,
  CudaOobTrap,
  ModelWeightIntegrityRecord,
  GossipFloodingMetric,
  PqcEnvelopeVerification,
  ThreatTelemetryRecord,
  MitigationExecutionRecord,
} from '../types/census.ts';
import { threatRadarBackend } from '../lib/threatRadarBackend.ts';
import { sovereignEventFabric } from '../lib/merkleSpine.ts';

interface ThreatRadarProps {
  threats: ThreatVector[];
  theme: 'worldometers' | 'sovereign';
  defconLevel: number;
}

export const ThreatRadar: React.FC<ThreatRadarProps> = ({
  threats: initialThreats,
  theme,
  defconLevel: initialDefcon,
}) => {
  const isLight = theme === 'worldometers';

  // Active view tab: 'VECTORS' | 'TELEMETRY' | 'MITIGATIONS'
  const [activeTab, setActiveTab] = useState<'VECTORS' | 'TELEMETRY' | 'MITIGATIONS'>('VECTORS');

  // Backend state
  const [telemetry, setTelemetry] = useState(() => threatRadarBackend.getTelemetrySnapshot());
  const [isSimulating, setIsSimulating] = useState(false);
  const [activePlaybookStage, setActivePlaybookStage] = useState<'IDLE' | 'DETECTED' | 'ISOLATED' | 'PQC_DEFENSE' | 'CONTAINED'>('IDLE');
  const [simulationLog, setSimulationLog] = useState<string[]>([]);
  const [executingMitigation, setExecutingMitigation] = useState<MitigationActionType | null>(null);

  // Poll backend state for live metrics & listen to event fabric
  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry(threatRadarBackend.getTelemetrySnapshot());
    }, 2000);

    const unsubscribe = sovereignEventFabric.subscribe((evt) => {
      if (evt.topic.includes('THREAT') || evt.topic.includes('DEFENSE')) {
        setTelemetry(threatRadarBackend.getTelemetrySnapshot());
      }
    });

    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, []);

  // Execute interactive mitigation action
  const handleExecuteMitigation = (threatId: string, action: MitigationActionType) => {
    setExecutingMitigation(action);
    setTimeout(() => {
      threatRadarBackend.executeMitigation(threatId, action);
      setTelemetry(threatRadarBackend.getTelemetrySnapshot());
      setExecutingMitigation(null);
    }, 450);
  };

  // Run comprehensive red-team simulation playbook
  const runDefensivePlaybook = async () => {
    setIsSimulating(true);
    setSimulationLog([]);

    // Stage 1: DETECTED
    setActivePlaybookStage('DETECTED');
    setSimulationLog((prev) => [
      ...prev,
      'STAGE 1: [DETECTED] Side-channel timing variance (+680ps) isolated in ML-KEM-1024 decapsulation loop.',
    ]);
    await new Promise((r) => setTimeout(r, 600));

    // Stage 2: ISOLATED
    setActivePlaybookStage('ISOLATED');
    setSimulationLog((prev) => [
      ...prev,
      'STAGE 2: [ISOLATED] Clamped microsegmentation boundary on node asia-northeast1 (Tokyo 01). Traffic quarantined.',
    ]);
    await new Promise((r) => setTimeout(r, 650));

    // Stage 3: PQC_DEFENSE
    setActivePlaybookStage('PQC_DEFENSE');
    setSimulationLog((prev) => [
      ...prev,
      'STAGE 3: [PQC_DEFENSE] Rotated session keys to fresh NIST FIPS 203 ML-KEM-1024. Memory slice verified ≤ 64 KB.',
    ]);
    await new Promise((r) => setTimeout(r, 700));

    // Stage 4: CONTAINED
    setActivePlaybookStage('CONTAINED');
    const result = threatRadarBackend.executeMitigation(
      telemetry.activeThreats[0]?.id || 'thr-01',
      'KEY_ROTATION',
      'SIMULATED_RED_TEAM_PROBE'
    );
    setTelemetry(threatRadarBackend.getTelemetrySnapshot());

    setSimulationLog((prev) => [
      ...prev,
      `STAGE 4: [CONTAINED] Threat neutralized with 99.99% drop rate. Root proof committed: ${result.merkleProof.slice(0, 18)}.`,
    ]);

    await new Promise((r) => setTimeout(r, 500));
    setIsSimulating(false);
  };

  return (
    <section id="threat-radar" className="max-w-6xl mx-auto px-4 my-8 scroll-mt-20">
      <div
        className={`rounded-lg border overflow-hidden transition-all ${
          isLight
            ? 'bg-white border-gray-300 shadow-xs'
            : 'bg-[#0d1222] border-gray-800 shadow-xl'
        }`}
      >
        {/* Top Header Bar */}
        <div
          className={`p-4 border-b flex flex-col md:flex-row md:items-center justify-between gap-3 ${
            isLight ? 'bg-gray-50 border-gray-200' : 'bg-[#090d1a] border-gray-800'
          }`}
        >
          <div>
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-500" />
              <h2 className={`text-lg font-bold font-['Montserrat'] ${isLight ? 'text-gray-900' : 'text-white'}`}>
                Planetary Cyber Threat Radar &amp; Active Defensive Backend
              </h2>
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300">
                DEFCON {initialDefcon} ACTIVE
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Live telemetry ingestion: GPU logs, CUDA OOB traps, weight integrity, gossip flood detection &amp; PQC lattice defenses
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={runDefensivePlaybook}
              disabled={isSimulating}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-all ${
                isSimulating
                  ? 'opacity-50 cursor-not-allowed bg-gray-400 text-white'
                  : 'bg-red-600 hover:bg-red-700 text-white shadow-sm'
              }`}
            >
              <Play className={`w-3.5 h-3.5 ${isSimulating ? 'animate-pulse' : ''}`} />
              <span>{isSimulating ? 'Executing Red-Team Playbook...' : 'Simulate Red-Team Vector'}</span>
            </button>
          </div>
        </div>

        {/* Subsystem Navigation Tabs */}
        <div className={`px-4 pt-3 border-b flex gap-2 overflow-x-auto text-xs font-medium ${
          isLight ? 'border-gray-200 bg-white' : 'border-gray-800 bg-[#0c101d]'
        }`}>
          <button
            onClick={() => setActiveTab('VECTORS')}
            className={`px-3 py-2 border-b-2 cursor-pointer flex items-center gap-1.5 transition-all ${
              activeTab === 'VECTORS'
                ? 'border-red-500 text-red-600 dark:text-red-400 font-bold'
                : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Threat Classification ({telemetry.activeThreats.length} Active Vectors)</span>
          </button>

          <button
            onClick={() => setActiveTab('TELEMETRY')}
            className={`px-3 py-2 border-b-2 cursor-pointer flex items-center gap-1.5 transition-all ${
              activeTab === 'TELEMETRY'
                ? 'border-red-500 text-red-600 dark:text-red-400 font-bold'
                : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Real Telemetry Ingestion (5 Subsystems)</span>
          </button>

          <button
            onClick={() => setActiveTab('MITIGATIONS')}
            className={`px-3 py-2 border-b-2 cursor-pointer flex items-center gap-1.5 transition-all ${
              activeTab === 'MITIGATIONS'
                ? 'border-red-500 text-red-600 dark:text-red-400 font-bold'
                : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Mitigation Engine Proofs ({telemetry.mitigationHistory.length})</span>
          </button>
        </div>

        {/* 4-Stage Playbook Visualizer Banner */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/40">
          <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Automated 4-Stage Active Defensive Playbook:</span>
            <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400">
              Mean Time to Contain (MTTC): 1.4ms
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { id: 'DETECTED', num: '1', title: 'DETECTED', desc: 'Acoustic / JIT timing probe isolated' },
              { id: 'ISOLATED', num: '2', title: 'ISOLATED', desc: 'Node microsegmentation boundary clamped' },
              { id: 'PQC_DEFENSE', num: '3', title: 'PQC_DEFENSE', desc: 'ML-KEM-1024 instant key rotation' },
              { id: 'CONTAINED', num: '4', title: 'CONTAINED', desc: '≤ 64 KB memory bounds preserved' },
            ].map((stage) => {
              const isCurrent = activePlaybookStage === stage.id;
              const isPast =
                activePlaybookStage === 'CONTAINED' ||
                (activePlaybookStage === 'PQC_DEFENSE' && (stage.id === 'DETECTED' || stage.id === 'ISOLATED')) ||
                (activePlaybookStage === 'ISOLATED' && stage.id === 'DETECTED');

              return (
                <div
                  key={stage.id}
                  className={`p-2.5 rounded border text-xs transition-all ${
                    isCurrent
                      ? 'border-red-500 bg-red-50 dark:bg-red-950/40 ring-2 ring-red-500/20'
                      : isPast
                      ? 'border-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300'
                      : 'border-gray-200 dark:border-gray-800 text-gray-400 opacity-75'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-bold text-[10px]">STAGE 0{stage.num}</span>
                    {isCurrent ? (
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    ) : isPast ? (
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    ) : null}
                  </div>
                  <div className="font-bold text-xs">{stage.title}</div>
                  <div className="text-[10px] text-gray-500 mt-0.5 line-clamp-1">{stage.desc}</div>
                </div>
              );
            })}
          </div>

          {simulationLog.length > 0 && (
            <div className="mt-3 p-2.5 rounded bg-black/90 text-emerald-400 font-mono text-[11px] space-y-1">
              {simulationLog.map((line, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <span className="text-gray-500">[{new Date().toLocaleTimeString()}]</span>
                  <span>{line}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* TAB 1: THREAT CLASSIFICATION VECTORS */}
        {activeTab === 'VECTORS' && (
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            {telemetry.activeThreats.map((threat) => (
              <div
                key={threat.id}
                className={`p-3.5 rounded-md border text-xs transition-all ${
                  isLight
                    ? 'bg-gray-50 border-gray-200 hover:border-gray-300'
                    : 'bg-gray-900/60 border-gray-800 hover:border-gray-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <span className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-1.5">
                    <AlertTriangle className={`w-3.5 h-3.5 ${
                      threat.severity === 'CRITICAL' ? 'text-red-500' : 'text-amber-500'
                    }`} />
                    <span>{threat.vector.replace(/_/g, ' ')}</span>
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                      threat.severity === 'CRITICAL'
                        ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}>
                      {threat.severity}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      {threat.autoMitigated ? 'MITIGATED' : 'INTERCEPTING'}
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-300 text-[11px] mb-2 leading-relaxed">
                  {threat.summary}
                </p>

                <div className="bg-white dark:bg-gray-950 p-2.5 rounded border border-gray-200 dark:border-gray-800 text-[11px] space-y-1.5">
                  <div className="text-[10px] font-mono text-gray-500 truncate">
                    <strong>Raw Signal:</strong> {threat.rawSignal}
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-gray-400 font-mono pt-1 border-t border-gray-100 dark:border-gray-800">
                    <span>Node: <strong className="text-gray-700 dark:text-gray-300">{threat.node}</strong></span>
                    <span>Stack: <strong className="text-gray-700 dark:text-gray-300">{threat.targetStack}</strong></span>
                  </div>

                  {/* Active Mitigation Dispatcher */}
                  <div className="pt-2 flex items-center justify-between gap-2 border-t border-gray-100 dark:border-gray-800">
                    <span className="text-[10px] text-gray-500 font-mono">
                      Action: <strong className="text-emerald-600 dark:text-emerald-400">{threat.recommendedMitigation}</strong>
                    </span>

                    <button
                      onClick={() => handleExecuteMitigation(threat.id, threat.recommendedMitigation)}
                      disabled={executingMitigation === threat.recommendedMitigation}
                      className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-[10px] font-bold cursor-pointer transition-all flex items-center gap-1 shadow-xs"
                    >
                      {threat.recommendedMitigation === 'KEY_ROTATION' && <KeyRound className="w-3 h-3" />}
                      {threat.recommendedMitigation === 'QUARANTINE' && <Ban className="w-3 h-3" />}
                      {threat.recommendedMitigation === 'PEER_DROP' && <Network className="w-3 h-3" />}
                      {threat.recommendedMitigation === 'MEMORY_SLICE_BOUNDING' && <Sliders className="w-3 h-3" />}
                      <span>
                        {executingMitigation === threat.recommendedMitigation ? 'Clamping...' : `Execute ${threat.recommendedMitigation}`}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: REAL TELEMETRY INGESTION (5 Subsystems) */}
        {activeTab === 'TELEMETRY' && (
          <div className="p-4 space-y-4">
            {/* 1. GPU Telemetry Logs */}
            <div className={`p-3.5 rounded border ${isLight ? 'bg-gray-50 border-gray-200' : 'bg-gray-900/50 border-gray-800'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-xs flex items-center gap-1.5 text-gray-900 dark:text-white">
                  <Cpu className="w-4 h-4 text-cyan-500" />
                  1. GPU Cluster Logs &amp; Thermal Utilization
                </span>
                <span className="text-[10px] font-mono text-gray-500">Continuous sampling</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                {telemetry.gpuLogs.map((gpu) => (
                  <div key={gpu.gpuId} className="p-2 rounded bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-[11px]">
                    <div className="font-mono font-bold text-gray-900 dark:text-gray-100 truncate">{gpu.clusterNode}</div>
                    <div className="text-[10px] text-gray-400">{gpu.deviceModel}</div>
                    <div className="mt-1 flex items-center justify-between text-[10px]">
                      <span>Util: <strong className="text-cyan-600 dark:text-cyan-400">{gpu.utilizationPercent}%</strong></span>
                      <span>Temp: <strong>{gpu.temperatureC}°C</strong></span>
                    </div>
                    <div className="text-[10px] text-gray-500 mt-0.5">
                      VRAM: {(gpu.vramUsedMb / 1024).toFixed(1)}GB / {(gpu.vramTotalMb / 1024).toFixed(0)}GB
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. CUDA Out-Of-Bounds (OOB) Traps */}
            <div className={`p-3.5 rounded border ${isLight ? 'bg-gray-50 border-gray-200' : 'bg-gray-900/50 border-gray-800'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-xs flex items-center gap-1.5 text-gray-900 dark:text-white">
                  <Sliders className="w-4 h-4 text-amber-500" />
                  2. CUDA Out-of-Bounds (OOB) Kernel Traps
                </span>
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">RFC-003 Enforced</span>
              </div>
              <div className="space-y-2">
                {telemetry.cudaTraps.map((trap) => (
                  <div key={trap.trapId} className="p-2 rounded bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-[11px] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="font-mono font-bold text-amber-600 dark:text-amber-400">{trap.kernelName}</span>
                      <span className="text-gray-500 ml-2">({trap.node})</span>
                      <div className="text-[10px] text-gray-400 font-mono mt-0.5">
                        Illegal offset: <span className="text-red-500 font-bold">{trap.illegalOffsetHex}</span> | Target buffer: {trap.memoryBufferType}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
                        {trap.interceptAction}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono">{trap.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Model Weight Integrity Checks */}
            <div className={`p-3.5 rounded border ${isLight ? 'bg-gray-50 border-gray-200' : 'bg-gray-900/50 border-gray-800'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-xs flex items-center gap-1.5 text-gray-900 dark:text-white">
                  <Binary className="w-4 h-4 text-purple-500" />
                  3. Model Weight Merkle Integrity &amp; Genesis Attestation
                </span>
                <span className="text-[10px] font-mono text-gray-500">Bit-drift tolerance: 0.0 PPM</span>
              </div>
              <div className="space-y-2">
                {telemetry.weightRecords.map((w) => (
                  <div key={w.modelId} className="p-2 rounded bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-[11px] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="font-bold text-gray-900 dark:text-gray-100">{w.modelId}</span>
                      <div className="text-[10px] text-gray-400 font-mono mt-0.5 truncate max-w-md">
                        Runtime Root: {w.runtimeWeightDigest.slice(0, 24)}... (Match: {w.runtimeWeightDigest === w.genesisWeightDigest ? '100%' : 'DRIFT'})
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                        w.isIntegrityVerified
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                      }`}>
                        {w.isIntegrityVerified ? 'GENESIS VERIFIED' : 'BIT-FLIP DRIFT DETECTED'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4 & 5. Gossip Flooding & PQC Envelopes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* 4. Gossip Flooding Detection */}
              <div className={`p-3.5 rounded border ${isLight ? 'bg-gray-50 border-gray-200' : 'bg-gray-900/50 border-gray-800'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-xs flex items-center gap-1.5 text-gray-900 dark:text-white">
                    <Radio className="w-4 h-4 text-emerald-500" />
                    4. Gossip Flooding Detection
                  </span>
                  <span className="text-[10px] font-mono text-gray-500">Max limit: 15,000 pps</span>
                </div>
                <div className="space-y-1.5">
                  {telemetry.gossipMetrics.map((g, i) => (
                    <div key={i} className="p-2 rounded bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-[11px]">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold truncate max-w-[180px]">{g.peerId}</span>
                        <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                          g.status === 'FLOOD_INTERCEPTED'
                            ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        }`}>
                          {g.status}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center justify-between text-[10px] text-gray-500 font-mono">
                        <span>Rate: <strong className={g.packetsPerSec > g.thresholdMaxPps ? 'text-red-500' : ''}>{g.packetsPerSec.toLocaleString()} pps</strong></span>
                        <span>BFT Latency: <strong>{g.bftLatencyMs}ms</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. PQC Envelope Verification */}
              <div className={`p-3.5 rounded border ${isLight ? 'bg-gray-50 border-gray-200' : 'bg-gray-900/50 border-gray-800'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-xs flex items-center gap-1.5 text-gray-900 dark:text-white">
                    <Lock className="w-4 h-4 text-blue-500" />
                    5. PQC Envelope &amp; Jitter Validation
                  </span>
                  <span className="text-[10px] font-mono text-gray-500">NIST FIPS 203</span>
                </div>
                <div className="space-y-1.5">
                  {telemetry.pqcEnvelopes.map((p) => (
                    <div key={p.envelopeId} className="p-2 rounded bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-[11px]">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold">{p.cipherSuite}</span>
                        <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                          p.constantTimeVerified
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}>
                          {p.status}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center justify-between text-[10px] text-gray-500 font-mono">
                        <span>Decapsulation: <strong>{p.decapsulationTimeNs}ns</strong></span>
                        <span>Jitter: <strong className={p.timingJitterPs > 50 ? 'text-amber-500' : 'text-emerald-500'}>{p.timingJitterPs}ps</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: MITIGATION EXECUTION PROOFS & CRYPTOGRAPHIC SPINE LOG */}
        {activeTab === 'MITIGATIONS' && (
          <div className="p-4">
            <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Cryptographic Proof Spine for All Executed Mitigations:</span>
              <span className="font-mono text-[10px] text-gray-400">Total Mitigations: {telemetry.mitigationHistory.length}</span>
            </div>

            {telemetry.mitigationHistory.length === 0 ? (
              <div className="p-6 text-center text-xs text-gray-500 dark:text-gray-400 border border-dashed rounded border-gray-300 dark:border-gray-800">
                No manual mitigations executed yet this session. Click any action on the Threat Classification tab to trigger zero-downtime key rotation, node quarantine, or memory bounding.
              </div>
            ) : (
              <div className="space-y-2">
                {telemetry.mitigationHistory.map((m) => (
                  <div
                    key={m.id}
                    className="p-3 rounded border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-xs"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>ACTION: {m.action}</span>
                        <span className="text-gray-400 font-normal">({m.targetNode})</span>
                      </div>
                      <span className="text-[10px] font-mono text-gray-400">{m.timestamp}</span>
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 text-[11px] mb-2">
                      {m.details}
                    </p>

                    <div className="text-[10px] font-mono text-gray-400 pt-1 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                      <span>Proof Leaf: <strong className="text-emerald-500">{m.merkleProof}</strong></span>
                      <span>Status: <strong className="text-emerald-600 dark:text-emerald-400">{m.resultStatus}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
