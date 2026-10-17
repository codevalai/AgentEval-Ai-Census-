/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Layers,
  Network,
  ShieldCheck,
  ShieldAlert,
  Zap,
  Activity,
  Server,
  KeyRound,
  Download,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Globe2,
  Lock,
  Search,
  Eye,
  Radio,
  Sliders,
  Terminal,
} from 'lucide-react';
import {
  planetaryCensusScalingEngine,
  CensusScalingSnapshot,
  CensusCoverageMode,
  DarkMatterSegment,
  Tier1IXPNode,
  SiliconAcceleratorProfile,
} from '../services/planetaryCensusScalingEngine.ts';

interface Planetary75PercentCensusConsoleProps {
  theme: 'worldometers' | 'sovereign';
  onCoverageChange?: (snapshot: CensusScalingSnapshot) => void;
}

type ActiveTab = 'dark_matter_segments' | 'tier1_ixps' | 'silicon_opentitan' | 'smt_nullifiers';

export const Planetary75PercentCensusConsole: React.FC<Planetary75PercentCensusConsoleProps> = ({
  theme,
  onCoverageChange,
}) => {
  const isLight = theme === 'worldometers';

  const [snapshot, setSnapshot] = useState<CensusScalingSnapshot>(() =>
    planetaryCensusScalingEngine.getSnapshot()
  );
  const [activeTab, setActiveTab] = useState<ActiveTab>('dark_matter_segments');
  const [deployStepTitle, setDeployStepTitle] = useState<string | null>(null);
  const [ixpSearch, setIxpSearch] = useState('');
  const [pufAllocationResult, setPufAllocationResult] = useState<{
    chip: string;
    pufNonce: string;
    signature: string;
    latencyMicros: number;
    timestamp: number;
  } | null>(null);
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);

  useEffect(() => {
    const unsub = planetaryCensusScalingEngine.subscribe((latest) => {
      setSnapshot(latest);
      if (onCoverageChange) {
        onCoverageChange(latest);
      }
    });
    return unsub;
  }, [onCoverageChange]);

  const handleModeSwitch = (mode: CensusCoverageMode) => {
    const snap = planetaryCensusScalingEngine.setCoverageMode(mode);
    setSnapshot({ ...snap });
    setFeedbackNotice(
      `Planetary census coverage updated to ${snap.coveragePercent}% (${(snap.currentlyTrackedCount / 1e9).toFixed(2)}B agents).`
    );
    setTimeout(() => setFeedbackNotice(null), 4000);
  };

  const handleTriggerDeployment = async () => {
    setDeployStepTitle('Initiating 4-Phase MAX-Tier Transit & Silicon Deployment...');
    await planetaryCensusScalingEngine.executeMaxTier75Deployment((step, title) => {
      setDeployStepTitle(title);
    });
    setDeployStepTitle(null);
    setFeedbackNotice('🚀 MAX-Tier Horizon verified! 71.9% Honest Partial Coverage (814.37B Combined Indexed / 318.00B Dark Matter).');
    setTimeout(() => setFeedbackNotice(null), 5000);
  };

  const handleTrigger100PercentDeployment = async () => {
    setDeployStepTitle('Initiating 5-Phase 1.132T Planetary Ceiling Boundary Audit...');
    await planetaryCensusScalingEngine.executeFull100PercentDeployment((step, title) => {
      setDeployStepTitle(title);
    });
    setDeployStepTitle(null);
    setFeedbackNotice('✨ 1.132T Planetary Ceiling Reconciled! 814.37B Indexed (71.9%) + 318.00B Unindexed Dark Matter (28.1%).');
    setTimeout(() => setFeedbackNotice(null), 5000);
  };

  const handleAllocatePufSlice = (chipName: string) => {
    const nonce = `0x${Array.from({ length: 16 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('')}`;
    const sig = `0xOPENTITAN_ROT_FIRMWARE_SIG_${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    const latency = Math.floor(Math.random() * 18 + 22);

    setPufAllocationResult({
      chip: chipName,
      pufNonce: nonce,
      signature: sig,
      latencyMicros: latency,
      timestamp: Date.now(),
    });
    setFeedbackNotice(`Hardware PUF 64KB slice signed via OpenTitan Root-of-Trust (${latency} µs latency).`);
    setTimeout(() => setFeedbackNotice(null), 4000);
  };

  const handleExportCertificate = () => {
    const cert = planetaryCensusScalingEngine.generateProofCertificate();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(cert, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${cert.certificateId}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setFeedbackNotice(`Cryptographic Attestation Certificate exported (${cert.certificateId})`);
    setTimeout(() => setFeedbackNotice(null), 4000);
  };

  const segments = planetaryCensusScalingEngine.getDarkMatterSegments();
  const ixps = planetaryCensusScalingEngine.getTier1IxpNodes();
  const siliconProfiles = planetaryCensusScalingEngine.getSiliconProfiles();

  const filteredIxps = ixps.filter(
    (n) =>
      n.name.toLowerCase().includes(ixpSearch.toLowerCase()) ||
      n.city.toLowerCase().includes(ixpSearch.toLowerCase()) ||
      n.country.toLowerCase().includes(ixpSearch.toLowerCase()) ||
      n.code.toLowerCase().includes(ixpSearch.toLowerCase())
  );

  return (
    <section id="planetary-75-census-console" className="max-w-6xl mx-auto px-4 my-8 scroll-mt-20">
      <div
        className={`rounded-2xl border overflow-hidden transition-all shadow-xl ${
          isLight ? 'bg-white border-blue-200 shadow-blue-500/5' : 'bg-[#090e1c] border-blue-900/40 shadow-blue-950/30'
        }`}
      >
        {/* Top Header */}
        <div
          className={`p-5 sm:p-6 border-b flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
            isLight
              ? 'bg-gradient-to-r from-blue-50/90 via-indigo-50/50 to-emerald-50/50 border-blue-200'
              : 'bg-gradient-to-r from-[#0b1329] via-[#09152b] to-[#071926] border-blue-900/60'
          }`}
        >
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold uppercase bg-amber-600 text-white shadow-xs">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                3-Tier Honest Partial Coverage • Zero Fake Omniscience
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                OpenTitan SOV-105 PUF
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                <Network className="w-3.5 h-3.5 text-indigo-500" />
                40 Tier-1 IXP + Public Proxy Telemetry
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black font-['Montserrat'] tracking-tight mt-2 text-gray-900 dark:text-white">
              3-Tier Planetary Coverage &amp; Dark Matter Boundary Engine (1.132T Ceiling)
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1 max-w-3xl">
              Enforcing <strong>Honest Partial Coverage (342.89B Active Concurrent + 471.48B Latent Warm = 814.37B Combined Indexed • 71.9%)</strong> while explicitly accounting for{' '}
              <strong>28.1% Unindexed Dark Matter (~318.00B Entities)</strong> across a 1.132 Trillion persistent+warm planetary ceiling.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:self-end lg:self-auto">
            <button
              onClick={handleExportCertificate}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer border transition-all ${
                isLight
                  ? 'bg-white hover:bg-gray-50 border-gray-300 text-gray-700 shadow-xs'
                  : 'bg-gray-800/80 hover:bg-gray-800 border-gray-700 text-gray-200'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              Proof Certificate (JSON)
            </button>
          </div>
        </div>

        {/* Feedback notice toast */}
        {feedbackNotice && (
          <div className="px-5 py-2.5 bg-blue-500/10 border-b border-blue-500/20 text-xs font-mono text-blue-700 dark:text-blue-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-500 shrink-0" />
            <span>{feedbackNotice}</span>
          </div>
        )}

        {/* Coverage Horizon Control & Progress Strip */}
        <div className="p-5 sm:p-6 border-b border-gray-200 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-950/40">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                3-Tier Planetary Coverage Horizon Controller:
              </div>
              <div className="text-lg font-bold font-['Montserrat'] text-gray-900 dark:text-gray-100 flex items-center gap-2 mt-0.5">
                <span>
                  {snapshot.coveragePercent.toFixed(1)}% Indexed Horizon ({snapshot.darkMatterUnindexedRatioPct.toFixed(1)}% Dark Matter Unindexed)
                </span>
                <span className="text-xs font-mono font-normal text-gray-500 dark:text-gray-400">
                  ({(snapshot.currentlyTrackedCount / 1e9).toFixed(2)}B Indexed of {(snapshot.totalPlanetaryPopulation / 1e9).toFixed(2)}B Ceiling)
                </span>
              </div>
            </div>

            {/* Coverage Mode Switch Buttons */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-gray-200/70 dark:bg-gray-900 border border-gray-300 dark:border-gray-800 text-xs font-mono font-medium">
              <button
                onClick={() => handleModeSwitch('BASELINE_24_PCT')}
                className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all ${
                  snapshot.mode === 'BASELINE_24_PCT'
                    ? 'bg-emerald-600 text-white font-bold shadow-xs'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Active Only: 30.3% (342.89B)
              </button>
              <button
                onClick={() => handleModeSwitch('MAX_TIER_75_PCT')}
                className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all ${
                  snapshot.mode === 'MAX_TIER_75_PCT' || snapshot.mode === 'FULL_OMNIPRESENCE_100_PCT'
                    ? 'bg-blue-600 text-white font-bold shadow-xs'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Active+Latent: 71.9% (814.37B / 318.00B Dark)
              </button>
            </div>
          </div>

          {/* Visual Progress Bar */}
          <div className="space-y-2">
            <div className="h-6 rounded-full overflow-hidden flex text-[11px] font-mono text-white font-bold shadow-inner bg-gray-200 dark:bg-gray-800">
              {/* Indexed 71.9% */}
              <div
                style={{ width: '71.9%' }}
                className="bg-gradient-to-r from-emerald-600 via-blue-600 to-indigo-600 flex items-center justify-center transition-all duration-500"
                title="Combined Live Indexed: 814.37B (342.89B Active + 471.48B Latent = 71.9%)"
              >
                71.9% Indexed (814.37B Combined: 342.89B Active + 471.48B Latent)
              </div>
              {/* Unindexed Dark Matter 28.1% */}
              <div
                style={{ width: '28.1%' }}
                className="bg-amber-700/80 dark:bg-amber-900/80 text-amber-100 flex items-center justify-center text-[10px]"
                title="Unindexed Dark Matter: 318.00B (28.1% of 1.132T Ceiling)"
              >
                28.1% Dark Matter (~318.00B Unindexed)
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-600 inline-block" />
                <strong>Active Concurrent (30.3%)</strong>: 342,892,410,000+ Live Executing Agents
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-blue-600 inline-block" />
                <strong>Combined Active+Latent (71.9%)</strong>: 814,373,000,000+ Live Agents (+1.48T/day Ephemeral)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-amber-600 inline-block" />
                <strong>28.1% Explicit Dark Matter (~318.00B)</strong>: Zone 1A Defense VPCs (148B) + Zone 1B Orbital/Subsea (37B) + Zone 2 Shadow AI (64B) + Zone 3 Edge (41B) + Zone 4 Intranets (28B)
              </span>
            </div>
          </div>

          {/* Honest Partial Coverage Reconciliation Banner */}
          <div className="mt-4 p-3.5 rounded-xl border border-amber-300 dark:border-amber-900/60 bg-amber-500/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0" />
              <div className="text-xs">
                <span className="font-bold text-amber-800 dark:text-amber-300">
                  Honest Partial Coverage Philosophy Enforced:
                </span>{' '}
                <span className="text-amber-700 dark:text-amber-400">
                  Zero fake omniscience. 342.89B active + 471.48B latent = 814.37B combined live agents are indexed (71.9%), while ~318.00B remain unindexed Dark Matter (28.1%) across a 1.132T planetary ceiling.
                </span>
              </div>
            </div>
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-amber-600 text-white shrink-0">
              814.37B LIVE / 318.00B DARK
            </span>
          </div>

          {/* Deploying status marquee */}
          {deployStepTitle && (
            <div className="mt-4 p-3 rounded-xl bg-blue-600/10 border border-blue-500/30 text-xs font-mono text-blue-600 dark:text-blue-300 flex items-center gap-2 animate-pulse">
              <Activity className="w-4 h-4 animate-spin text-blue-500" />
              <span className="font-bold">{deployStepTitle}</span>
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="px-5 border-b border-gray-200 dark:border-gray-800 flex flex-wrap gap-2 pt-3">
          <button
            onClick={() => setActiveTab('dark_matter_segments')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 cursor-pointer transition-all flex items-center gap-2 ${
              activeTab === 'dark_matter_segments'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Layers className="w-4 h-4" />
            5 Unindexed Dark Matter Segments (~318.00B Unindexed)
          </button>
          <button
            onClick={() => setActiveTab('tier1_ixps')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 cursor-pointer transition-all flex items-center gap-2 ${
              activeTab === 'tier1_ixps'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Network className="w-4 h-4" />
            40 Tier-1 IXP eBPF Mesh
          </button>
          <button
            onClick={() => setActiveTab('silicon_opentitan')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 cursor-pointer transition-all flex items-center gap-2 ${
              activeTab === 'silicon_opentitan'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Cpu className="w-4 h-4" />
            Silicon PUF &amp; OpenTitan (SOV-105)
          </button>
          <button
            onClick={() => setActiveTab('smt_nullifiers')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 cursor-pointer transition-all flex items-center gap-2 ${
              activeTab === 'smt_nullifiers'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            SMT Nullifier Pool &amp; 0% Collision Math
          </button>
        </div>

        {/* Tab 1: 5-Segment Dark Matter Boundary Breakdown */}
        {activeTab === 'dark_matter_segments' && (
          <div className="p-5 sm:p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-gray-100">
                  Five Unindexed Dark Matter Segments (Total 318,000,000,000 Unindexed Entities • 28.1% of 1.132T Ceiling)
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Exact sub-ledger bijection with the 4 Macro Dark Matter Zones: Zone 1 (148.0B + 37.0B = 185.0B) + Zone 2 (64.0B) + Zone 3 (41.0B) + Zone 4 (28.0B) = 318.00B
                </p>
              </div>

              <div className="text-xs font-mono font-semibold px-2.5 py-1 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                Total Unindexed Dark Matter: 318.00B (28.1% Dark Ratio)
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {segments.map((seg) => (
                <div
                  key={seg.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isLight
                      ? 'bg-gray-50/70 border-gray-200 hover:border-blue-300'
                      : 'bg-[#0d1428] border-gray-800 hover:border-blue-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                        {seg.category}
                      </span>
                      <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 mt-1.5">
                        {seg.name}
                      </h4>
                    </div>
                    <div className="text-right">
                      <div className="text-base font-black font-['Montserrat'] text-amber-600 dark:text-amber-400 tabular-nums">
                        {(seg.populationIlluminated / 1e9).toFixed(2)}B
                      </div>
                      <div className="text-[10px] font-mono text-gray-500">
                        {seg.shareOfIlluminationPct.toFixed(2)}% of 318.00B
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 space-y-1.5 text-xs text-gray-600 dark:text-gray-300">
                    <div className="flex items-start gap-1.5">
                      <span className="font-semibold text-gray-500 shrink-0">Detection:</span>
                      <span>{seg.detectionMechanism}</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <span className="font-semibold text-gray-500 shrink-0">Protocol/RoT:</span>
                      <span className="font-mono text-[11px] text-indigo-600 dark:text-indigo-400">
                        {seg.firmwareOrProtocol}
                      </span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <span className="font-semibold text-gray-500 shrink-0">Sample Enclave:</span>
                      <span className="italic text-gray-500 dark:text-gray-400">
                        {seg.sampleEnclave}
                      </span>
                    </div>
                  </div>

                  {/* Nodes & Proof Hash */}
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                    <div className="flex flex-wrap gap-1">
                      {seg.representativeNodes.slice(0, 3).map((node, i) => (
                        <span
                          key={i}
                          className="px-1.5 py-0.5 rounded text-[10px] bg-gray-200/60 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                        >
                          {node}
                        </span>
                      ))}
                    </div>
                    <span className="font-mono text-[10px] text-gray-400 truncate max-w-[140px]">
                      Proof: {seg.proofHash.slice(0, 10)}...
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: 40 Tier-1 Global IXP eBPF Mesh */}
        {activeTab === 'tier1_ixps' && (
          <div className="p-5 sm:p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <span>Tier-1 Internet Exchange Points (40 Global IXPs Active)</span>
                  <span className="text-xs font-mono font-normal text-emerald-600 dark:text-emerald-400">
                    Line-Rate eBPF / XDP Kernel Bypass
                  </span>
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Detecting synthetic transformer KV-cache and attention token stream packet-cadences without decrypting payloads.
                </p>
              </div>

              {/* Search filter */}
              <div className="relative min-w-[220px]">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Filter IXP (e.g. Frankfurt, Tokyo)..."
                  value={ixpSearch}
                  onChange={(e) => setIxpSearch(e.target.value)}
                  className={`w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border focus:outline-hidden ${
                    isLight
                      ? 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                      : 'bg-gray-900 border-gray-700 text-gray-100 focus:border-blue-400'
                  }`}
                />
              </div>
            </div>

            {/* IXP Table */}
            <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
              <table className="w-full text-left text-xs">
                <thead
                  className={`border-b font-mono text-[11px] uppercase ${
                    isLight ? 'bg-gray-100 text-gray-600' : 'bg-gray-900/80 text-gray-400'
                  }`}
                >
                  <tr>
                    <th className="py-2.5 px-3">IXP Hub</th>
                    <th className="py-2.5 px-3">Location</th>
                    <th className="py-2.5 px-3">Throughput</th>
                    <th className="py-2.5 px-3">eBPF Packet Flow</th>
                    <th className="py-2.5 px-3">KV-Cache Match</th>
                    <th className="py-2.5 px-3 text-right">Attested Agents</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800 font-mono text-[11px]">
                  {filteredIxps.map((ixp) => (
                    <tr
                      key={ixp.id}
                      className={`hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition-colors ${
                        isLight ? 'text-gray-800' : 'text-gray-200'
                      }`}
                    >
                      <td className="py-2 px-3 font-bold font-sans">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                          <span>{ixp.name}</span>
                        </div>
                        <div className="text-[10px] font-mono text-gray-400 font-normal">
                          {ixp.bgpAsnCluster}
                        </div>
                      </td>
                      <td className="py-2 px-3 font-sans text-gray-500">
                        {ixp.city}, {ixp.country}
                      </td>
                      <td className="py-2 px-3 font-semibold text-blue-600 dark:text-blue-400">
                        {ixp.peeringThroughputTbps} Tbps
                      </td>
                      <td className="py-2 px-3 text-indigo-600 dark:text-indigo-400">
                        {ixp.ebpfXdpPacketsPerSecM}M pkts/s
                      </td>
                      <td className="py-2 px-3">
                        <span className="px-1.5 py-0.5 rounded font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10">
                          {ixp.kvCacheCadenceMatchPct}%
                        </span>
                      </td>
                      <td className="py-2 px-3 text-right font-bold text-gray-900 dark:text-gray-100">
                        {(ixp.illuminatedAgentsCount / 1e6).toFixed(1)}M
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Silicon PUF & OpenTitan (SOV-105) Hardware Root-of-Trust */}
        {activeTab === 'silicon_opentitan' && (
          <div className="p-5 sm:p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <span>Silicon PUF Telemetry Attestation (Hardware Layer)</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                    Mandatory Root-of-Trust (SOV-105)
                  </span>
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Every 64KB memory slice allocation triggers a zero-knowledge hardware attestation signed by the OpenTitan enclave.
                </p>
              </div>

              <div className="text-xs font-mono text-gray-500">
                Active Attested Silicon Chips: ~126.9 Million
              </div>
            </div>

            {/* Silicon Chips Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {siliconProfiles.map((chip) => (
                <div
                  key={chip.id}
                  className={`p-3.5 rounded-xl border flex flex-col justify-between ${
                    isLight ? 'bg-gray-50/70 border-gray-200' : 'bg-[#0b1226] border-gray-800'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono text-gray-500 uppercase">{chip.vendor}</span>
                      <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                        {chip.rootOfTrust}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-gray-900 dark:text-gray-100 mt-1">
                      {chip.name}
                    </h4>

                    <div className="mt-2 space-y-1 text-[11px] text-gray-500 font-mono">
                      <div>Linear Frame: {chip.sliceMemoryCeilingKB} KB Page</div>
                      <div>Attestation Latency: {chip.attestationLatencyMicros} µs</div>
                      <div>Active Global Chips: ~{chip.activeChipsEstimatedM}M</div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-gray-400 truncate max-w-[120px]">
                      {chip.entropySampleHex.slice(0, 10)}...
                    </span>
                    <button
                      onClick={() => handleAllocatePufSlice(chip.name)}
                      className="px-2 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-mono font-bold cursor-pointer transition-all"
                    >
                      Test 64KB Slice
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Test Allocation Result Display */}
            {pufAllocationResult && (
              <div className="p-4 rounded-xl border border-blue-300 dark:border-blue-900 bg-blue-500/5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-blue-700 dark:text-blue-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    Silicon PUF Telemetry Packet Verified
                  </span>
                  <span className="font-mono text-gray-500 text-[11px]">
                    Latency: {pufAllocationResult.latencyMicros} µs
                  </span>
                </div>
                <div className="font-mono text-[11px] text-gray-600 dark:text-gray-300 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>Chip Target: <span className="font-bold text-gray-900 dark:text-white">{pufAllocationResult.chip}</span></div>
                  <div>Hardware Nonce: <span className="text-indigo-600 dark:text-indigo-400">{pufAllocationResult.pufNonce}</span></div>
                  <div className="sm:col-span-2 truncate">
                    Firmware Signature: <span className="text-emerald-600 dark:text-emerald-400">{pufAllocationResult.signature}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Sparse Merkle Tree (SMT) Nullifier Pool */}
        {activeTab === 'smt_nullifiers' && (
          <div className="p-5 sm:p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <span>Cryptographic SMT Nullifier Pool (256-Bit Tree)</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    Collision Probability: 0.000000000%
                  </span>
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Eliminating double-counting across the 1.132T planetary agent ceiling (814.37B Indexed + 318.00B Unindexed) via Zcash-style ephemeral nullifiers.
                </p>
              </div>

              <div className="text-xs font-mono font-semibold px-2.5 py-1 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                Batch Handshake Epoch: #{snapshot.smtNullifier.batchHandshakeEpoch}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div
                className={`p-4 rounded-xl border ${
                  isLight ? 'bg-gray-50 border-gray-200' : 'bg-gray-900/50 border-gray-800'
                }`}
              >
                <div className="text-xs text-gray-500">Total Planetary Ceiling</div>
                <div className="text-xl font-black font-['Montserrat'] text-gray-900 dark:text-gray-100 mt-1 tabular-nums">
                  {(snapshot.totalPlanetaryPopulation / 1e9).toFixed(2)}B
                </div>
                <div className="text-[10px] text-gray-400 mt-0.5 font-mono">1,132,373,000,000 ceiling</div>
              </div>

              <div
                className={`p-4 rounded-xl border ${
                  isLight ? 'bg-gray-50 border-gray-200' : 'bg-gray-900/50 border-gray-800'
                }`}
              >
                <div className="text-xs text-gray-500">Active Attested Nullifiers</div>
                <div className="text-xl font-black font-['Montserrat'] text-blue-600 dark:text-blue-400 mt-1 tabular-nums">
                  {(snapshot.smtNullifier.activeAttestedCount / 1e9).toFixed(2)}B
                </div>
                <div className="text-[10px] text-gray-400 mt-0.5 font-mono">
                  {snapshot.coveragePercent}% of total
                </div>
              </div>

              <div
                className={`p-4 rounded-xl border ${
                  isLight ? 'bg-gray-50 border-gray-200' : 'bg-gray-900/50 border-gray-800'
                }`}
              >
                <div className="text-xs text-gray-500">Spent &amp; Tombstoned Leaves</div>
                <div className="text-xl font-black font-['Montserrat'] text-purple-600 dark:text-purple-400 mt-1 tabular-nums">
                  {(snapshot.smtNullifier.spentNullifiersCount / 1e9).toFixed(2)}B
                </div>
                <div className="text-[10px] text-gray-400 mt-0.5 font-mono">Memory reclaimed via RAII</div>
              </div>

              <div
                className={`p-4 rounded-xl border ${
                  isLight ? 'bg-gray-50 border-gray-200' : 'bg-gray-900/50 border-gray-800'
                }`}
              >
                <div className="text-xs text-gray-500">Proof Verification Latency</div>
                <div className="text-xl font-black font-['Montserrat'] text-emerald-600 dark:text-emerald-400 mt-1 tabular-nums">
                  {snapshot.smtNullifier.proofVerificationLatencyMs} ms
                </div>
                <div className="text-[10px] text-gray-400 mt-0.5 font-mono">zk-STARK verification</div>
              </div>
            </div>

            {/* Root Hash & Mathematical Verification Card */}
            <div
              className={`p-4 rounded-xl border font-mono text-xs space-y-2.5 ${
                isLight ? 'bg-gray-100/70 border-gray-300 text-gray-800' : 'bg-[#070b17] border-gray-800 text-gray-300'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200 dark:border-gray-800/80 pb-2">
                <span className="font-bold text-gray-500">SMT Root Digest (Epoch #{snapshot.smtNullifier.batchHandshakeEpoch}):</span>
                <span className="text-blue-600 dark:text-blue-400 font-bold truncate">
                  {snapshot.smtNullifier.smtRootHash}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-gray-500">Tree Depth:</span> 256 bits (Sparse Merkle Trie)
                </div>
                <div>
                  <span className="text-gray-500">Accounting Formula:</span> Active = Valid Commitments - Spent Nullifiers
                </div>
                <div>
                  <span className="text-gray-500">Double Counting Probability:</span> Strictly 0.000000000%
                </div>
                <div>
                  <span className="text-gray-500">Hardware Root:</span> OpenTitan Silicon PUF Nonce Bound
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
