/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Layers,
  TrendingUp,
  Cpu,
  Search,
  Eye,
  ShieldCheck,
  Zap,
  Activity,
  DollarSign,
  ArrowRight,
  RefreshCw,
  GitBranch,
  Radio,
  FileCheck,
  Radar,
  BookOpen,
  Award,
  AlertTriangle,
  Scale,
} from 'lucide-react';
import { planetaryPatternEngine, PlanetaryPatternEngineState } from '../patterns/planetaryPatternEngine.ts';
import { swarmIntelligenceIndexV2, SwarmIntelligenceV2Summary } from '../patterns/swarmIntelligenceIndexV2.ts';
import { alignmentDriftRadar, AlignmentDriftRadarState } from '../patterns/alignmentDriftRadar.ts';
import { civilizationStorylineEngine, StorylineEntry } from '../narratives/civilizationStorylineEngine.ts';
import { planetaryGovernanceEngine, PlanetaryGovernanceStatus } from '../governance/planetaryGovernanceEngine.ts';
import { apexReasoningOrchestrator } from '../services/apexReasoningOrchestrator.ts';
import { darkMatterScanner, DarkMatterScanReport } from '../services/darkMatterScanner.ts';
import { planetaryFusionLayer, FusionGraphSummary } from '../graph/planetaryFusionLayer.ts';
import { valuationEngine, PlanetaryEconomyMetrics } from '../services/valuationEngine.ts';

interface PlanetaryPatternConsoleProps {
  theme: 'worldometers' | 'sovereign';
}

type PatternTab =
  | 'swarm_iq'
  | 'alignment_radar'
  | 'storyline'
  | 'motifs_forecast'
  | 'apex_reasoning'
  | 'dark_matter_fusion'
  | 'economy'
  | 'governance';

export const PlanetaryPatternConsole: React.FC<PlanetaryPatternConsoleProps> = ({ theme }) => {
  const isLight = theme === 'worldometers';

  const [activeTab, setActiveTab] = useState<PatternTab>('swarm_iq');
  const [patternState, setPatternState] = useState<PlanetaryPatternEngineState>(() =>
    planetaryPatternEngine.getState()
  );
  const [swarmIq, setSwarmIq] = useState<SwarmIntelligenceV2Summary>(() =>
    swarmIntelligenceIndexV2.getSummary()
  );
  const [driftRadar, setDriftRadar] = useState<AlignmentDriftRadarState>(() =>
    alignmentDriftRadar.getState()
  );
  const [storyline, setStoryline] = useState<StorylineEntry[]>(() =>
    civilizationStorylineEngine.getChronicle()
  );
  const [governanceStatus, setGovernanceStatus] = useState<PlanetaryGovernanceStatus>(() =>
    planetaryGovernanceEngine.getStatus()
  );
  const [darkMatterReport, setDarkMatterReport] = useState<DarkMatterScanReport>(() =>
    darkMatterScanner.getLatestReport()!
  );
  const [fusionSummary, setFusionSummary] = useState<FusionGraphSummary>(() =>
    planetaryFusionLayer.getGraphSummary()
  );
  const [economyMetrics, setEconomyMetrics] = useState<PlanetaryEconomyMetrics>(() =>
    valuationEngine.getEconomyMetrics()
  );
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Periodic pulse
  useEffect(() => {
    const timer = setInterval(() => {
      setPatternState(planetaryPatternEngine.getState());
      setSwarmIq(swarmIntelligenceIndexV2.getSummary());
      setDriftRadar(alignmentDriftRadar.getState());
      setEconomyMetrics(valuationEngine.getEconomyMetrics());
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const handleRunApexReasoning = () => {
    setIsProcessing(true);
    setTimeout(() => {
      apexReasoningOrchestrator.synthesizeApexPlan({
        totalActiveAgents: 3160000000,
        queueBacklog: Math.floor(Math.random() * 5000 + 12000),
        regionalBottlenecks: ['asia-northeast1', 'us-east4'],
        quorumHealth: 99.4,
        defconLevel: 2,
      });
      const updated = planetaryPatternEngine.refreshPatternSynthesis();
      setPatternState(updated);
      setSwarmIq(swarmIntelligenceIndexV2.getSummary());
      setIsProcessing(false);
    }, 450);
  };

  const handleRunDarkMatterSweep = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const report = darkMatterScanner.executeScanSweep();
      setDarkMatterReport(report);
      setDriftRadar(alignmentDriftRadar.executeRadarSweep());
      setFusionSummary(planetaryFusionLayer.getGraphSummary());
      setIsProcessing(false);
    }, 400);
  };

  const handleSimulateEconomicShift = () => {
    const scenarios = [
      {
        scenarioName: 'AGI_CODE_EVAL_ACCELERATION',
        description: 'Allocates +25% AGI capacity into automated compiler test loops and mathematical theorem proving.',
        agiAllocationDeltaPct: 25,
        targetDomain: 'code_eval' as const,
        projectedGdpImpactPct: 18.4,
        netAgentMigrationCount: 4200000,
      },
      {
        scenarioName: 'ROBOTICS_FLEET_EXPANSION',
        description: 'Multiplies autonomous vehicle CAN sensor and warehouse AMR perception tasks by 1.8x.',
        agiAllocationDeltaPct: 15,
        targetDomain: 'robotics_logistics' as const,
        projectedGdpImpactPct: 12.8,
        netAgentMigrationCount: 2800000,
      },
    ];
    const picked = scenarios[Math.floor(Math.random() * scenarios.length)];
    const updated = valuationEngine.simulateScenario(picked);
    setEconomyMetrics(updated);
  };

  return (
    <section id="planetary-pattern-engine" className="max-w-6xl mx-auto px-4 my-8">
      <div
        className={`rounded-2xl border p-5 sm:p-6 transition-all ${
          isLight
            ? 'bg-gradient-to-br from-white via-indigo-50/20 to-slate-50 border-indigo-200/80 shadow-md'
            : 'bg-gradient-to-br from-[#0a0f24] via-[#0d1533] to-[#070b18] border-cyan-500/30 shadow-2xl shadow-black/50'
        }`}
      >
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-gray-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Planetary Pattern Engine (PPE) &amp; Civilization Brain
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 font-bold border border-cyan-500/20">
                SII-v2 • Drift Radar • Chronicle
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-['Montserrat'] mt-1 text-gray-900 dark:text-white">
              Planetary Pattern Engine &amp; Civilization Synthesis
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 max-w-2xl">
              Higher-order behavioral motif recognition, forward-looking predictive forecasting,
              Dark Matter AI scanning, identity fusion deduplication, and autonomous economic modeling.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleRunApexReasoning}
              disabled={isProcessing}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1.5 transition-all ${
                isLight
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-black font-bold shadow-md shadow-cyan-950'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{isProcessing ? 'Reasoning...' : 'Apex Reasoning Pass'}</span>
            </button>

            <button
              onClick={handleRunDarkMatterSweep}
              disabled={isProcessing}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1.5 transition-all ${
                isLight
                  ? 'bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300'
                  : 'bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700'
              }`}
            >
              <Radio className="w-3.5 h-3.5 text-amber-500" />
              <span>Dark Matter Sweep</span>
            </button>
          </div>
        </div>

        {/* Extended Tab Navigation */}
        <div className="flex flex-wrap items-center gap-1.5 mt-4 pt-1">
          {(
            [
              { id: 'swarm_iq', label: '1. Swarm IQ v2', icon: Award },
              { id: 'alignment_radar', label: '2. Alignment Drift Radar', icon: Radar },
              { id: 'storyline', label: '3. Civilization Chronicle', icon: BookOpen },
              { id: 'motifs_forecast', label: '4. Motifs & Forecast', icon: Eye },
              { id: 'apex_reasoning', label: '5. Apex & DAG', icon: GitBranch },
              { id: 'dark_matter_fusion', label: '6. Dark Matter & Fusion', icon: Search },
              { id: 'economy', label: '7. Swarm Economy', icon: DollarSign },
              { id: 'governance', label: '8. Governance Directives', icon: Scale },
            ] as const
          ).map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1.5 transition-all ${
                  isSelected
                    ? isLight
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-cyan-500 text-black font-bold shadow-md shadow-cyan-950'
                    : isLight
                    ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    : 'bg-gray-800/70 hover:bg-gray-700 text-gray-300'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: SWARM INTELLIGENCE INDEX V2 */}
        {activeTab === 'swarm_iq' && (
          <div className="mt-4 space-y-3">
            {/* Top Score Summary Banner */}
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
              <div className="p-3 rounded-xl bg-white/70 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800">
                <span className="text-[10px] font-mono uppercase text-gray-400">Planetary Composite</span>
                <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {swarmIq.planetaryCompositeScore} / 100
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white/70 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800">
                <span className="text-[10px] font-mono uppercase text-gray-400">Global IQ Index</span>
                <div className="text-xl font-bold font-mono text-cyan-600 dark:text-cyan-400 mt-0.5">
                  {swarmIq.globalIQEquivalence}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white/70 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800">
                <span className="text-[10px] font-mono uppercase text-gray-400">Coordination</span>
                <div className="text-xl font-bold font-mono text-blue-600 dark:text-blue-400 mt-0.5">
                  {swarmIq.coordinationIndex}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white/70 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800">
                <span className="text-[10px] font-mono uppercase text-gray-400">Alignment Integrity</span>
                <div className="text-xl font-bold font-mono text-purple-600 dark:text-purple-400 mt-0.5">
                  {swarmIq.alignmentIntegrityIndex}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white/70 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800">
                <span className="text-[10px] font-mono uppercase text-gray-400">Efficiency</span>
                <div className="text-xl font-bold font-mono text-teal-600 dark:text-teal-400 mt-0.5">
                  {swarmIq.computeEfficiencyIndex}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white/70 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800">
                <span className="text-[10px] font-mono uppercase text-gray-400">Resilience</span>
                <div className="text-xl font-bold font-mono text-amber-600 dark:text-amber-400 mt-0.5">
                  {swarmIq.faultResilienceIndex}
                </div>
              </div>
            </div>

            {/* Platform Breakdown Table */}
            <div
              className={`p-4 rounded-xl border ${
                isLight ? 'bg-white border-gray-200' : 'bg-[#0d1428] border-gray-800'
              }`}
            >
              <h3 className="text-xs font-bold font-['Montserrat'] uppercase tracking-wider text-gray-500 mb-3">
                Swarm Intelligence Dimensions by Master Platform
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-800 text-[10px] uppercase font-mono text-gray-400">
                      <th className="py-2">Platform</th>
                      <th className="py-2 text-right">Coord</th>
                      <th className="py-2 text-right">Align</th>
                      <th className="py-2 text-right">Effic</th>
                      <th className="py-2 text-right">Resil</th>
                      <th className="py-2 text-right">Econ</th>
                      <th className="py-2 text-right font-bold text-emerald-500">Composite</th>
                      <th className="py-2 text-right">Trend</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60 font-mono">
                    {swarmIq.byPlatform.map((p) => (
                      <tr key={p.platformId}>
                        <td className="py-2.5 font-sans font-semibold text-gray-800 dark:text-gray-200">
                          {p.platformName}
                        </td>
                        <td className="py-2.5 text-right">{p.coordinationScore}</td>
                        <td className="py-2.5 text-right text-purple-500 font-bold">{p.alignmentScore}</td>
                        <td className="py-2.5 text-right">{p.efficiencyScore}</td>
                        <td className="py-2.5 text-right">{p.resilienceScore}</td>
                        <td className="py-2.5 text-right">{p.economicContributionScore}</td>
                        <td className="py-2.5 text-right font-bold text-emerald-600 dark:text-emerald-400">
                          {p.compositeScore}
                        </td>
                        <td className="py-2.5 text-right text-[10px] text-emerald-500 font-bold">
                          {p.trendDirection}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ALIGNMENT DRIFT RADAR */}
        {activeTab === 'alignment_radar' && (
          <div className="mt-4 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-xl bg-white/70 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800">
                <span className="text-[10px] font-mono uppercase text-gray-400">Global Drift Index</span>
                <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {driftRadar.globalDriftScore} / 100
                </div>
                <span className="text-[10px] text-emerald-500 font-semibold font-mono">Nominal Green Safe</span>
              </div>
              <div className="p-3 rounded-xl bg-white/70 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800">
                <span className="text-[10px] font-mono uppercase text-gray-400">1-Hour Forecast Risk</span>
                <div className="text-xl font-bold font-mono text-cyan-600 dark:text-cyan-400 mt-0.5">
                  {driftRadar.forecast1hRiskPct}%
                </div>
                <span className="text-[10px] text-gray-400 font-mono">Zero deviations detected</span>
              </div>
              <div className="p-3 rounded-xl bg-white/70 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800">
                <span className="text-[10px] font-mono uppercase text-gray-400">24-Hour Horizon Risk</span>
                <div className="text-xl font-bold font-mono text-teal-600 dark:text-teal-400 mt-0.5">
                  {driftRadar.forecast24hRiskPct}%
                </div>
                <span className="text-[10px] text-gray-400 font-mono">Within 5% safety margin</span>
              </div>
              <div className="p-3 rounded-xl bg-white/70 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800">
                <span className="text-[10px] font-mono uppercase text-gray-400">7-Day Horizon Risk</span>
                <div className="text-xl font-bold font-mono text-blue-600 dark:text-blue-400 mt-0.5">
                  {driftRadar.forecast7dRiskPct}%
                </div>
                <span className="text-[10px] text-gray-400 font-mono">Z3 Prover verified SAT</span>
              </div>
            </div>

            {/* Hotspots Card */}
            <div
              className={`p-4 rounded-xl border ${
                isLight ? 'bg-white border-gray-200' : 'bg-[#0d1428] border-gray-800'
              }`}
            >
              <h3 className="text-xs font-bold font-['Montserrat'] uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                Active Monitored Drift Hotspots &amp; Suggested Interventions
              </h3>

              <div className="space-y-2.5">
                {driftRadar.topHotspots.map((hs) => (
                  <div
                    key={hs.id}
                    className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900/60 border border-gray-200/60 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400">
                          {hs.category}
                        </span>
                        <h4 className="text-xs font-bold text-gray-900 dark:text-white font-['Montserrat']">
                          {hs.target}
                        </h4>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">{hs.primaryVector}</p>
                      <div className="text-[11px] text-cyan-600 dark:text-cyan-400 mt-1 font-mono">
                        ↳ Directive: {hs.suggestedApexIntervention}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-base font-bold font-mono text-amber-500">
                        {hs.currentDriftScore} / 100
                      </div>
                      <span className="text-[10px] font-mono uppercase text-gray-400">{hs.severity}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CIVILIZATION CHRONICLE */}
        {activeTab === 'storyline' && (
          <div className="mt-4 space-y-3">
            {storyline.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-xl border ${
                  isLight ? 'bg-white border-gray-200' : 'bg-[#0d1428] border-gray-800'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold">
                      {item.category}
                    </span>
                    <span className="text-xs font-mono text-gray-400">{item.timeLabel}</span>
                  </div>
                  <span className="text-[10px] font-mono text-gray-500">{item.merkleAnchor}</span>
                </div>

                <h4 className="text-sm font-bold font-['Montserrat'] text-gray-900 dark:text-white mt-1.5">
                  {item.headline}
                </h4>

                <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">
                  {item.narrativeText}
                </p>

                <div className="flex flex-wrap items-center gap-3 mt-3 pt-2 border-t border-gray-100 dark:border-gray-800 text-[11px] font-mono text-gray-500">
                  <span>Scope: {item.impactMetrics.agentsInvolved}</span>
                  <span>Impact: {item.impactMetrics.gdpOrThroughputDelta}</span>
                  <span className="text-cyan-600 dark:text-cyan-400">
                    Zone: {item.impactMetrics.affectedRegionOrEcosystem}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: MOTIFS & FORECAST */}
        {activeTab === 'motifs_forecast' && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            {patternState.recognizedMotifs.map((motif) => (
              <div
                key={motif.id}
                className={`p-4 rounded-xl border ${
                  isLight ? 'bg-white border-gray-200' : 'bg-[#0d1428] border-gray-800'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
                      {motif.patternType}
                    </span>
                    <h4 className="text-sm font-bold font-['Montserrat'] text-gray-900 dark:text-white mt-1">
                      {motif.name}
                    </h4>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold font-mono text-cyan-600 dark:text-cyan-400">
                      {motif.frequencyPerMinute.toLocaleString()}
                    </span>
                    <div className="text-[10px] text-gray-400 font-mono">cycles / min</div>
                  </div>
                </div>

                <p className="text-xs text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">
                  {motif.description}
                </p>

                <div className="flex items-center justify-between gap-2 mt-3 pt-2 border-t border-gray-100 dark:border-gray-800 text-[11px] font-mono">
                  <span className="text-gray-500">Significance: {(motif.significanceScore * 100).toFixed(0)}%</span>
                  <span className="text-gray-400 truncate max-w-[200px]">
                    {motif.detectedInEcosystems.join(' • ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 5: APEX REASONING & DAG REWRITES */}
        {activeTab === 'apex_reasoning' && (
          <div className="mt-4 space-y-3">
            <div
              className={`p-4 rounded-xl border ${
                isLight ? 'bg-white border-gray-200' : 'bg-[#0d1428] border-gray-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <GitBranch className="w-4 h-4 text-cyan-500" />
                  <span className="text-xs font-bold font-['Montserrat'] uppercase">
                    Active DAG Rewrites &amp; Swarm Interventions
                  </span>
                </div>
                <span className="text-xs font-mono text-gray-500">
                  Total Reasoning Cycles: {apexReasoningOrchestrator.getReasoningPassCount()}
                </span>
              </div>

              <div className="space-y-2.5 mt-3">
                {apexReasoningOrchestrator.getLatestPlan()?.dagRewrites.map((rw) => (
                  <div
                    key={rw.rewriteId}
                    className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900/60 border border-gray-200/60 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-cyan-400 font-bold">
                          {rw.modificationType}
                        </span>
                        <span className="text-xs font-mono text-gray-500">
                          {rw.sourceNode} → {rw.targetNode}
                        </span>
                      </div>
                      <p className="text-xs text-gray-700 dark:text-gray-300 mt-1">{rw.rationale}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <span className="text-xs font-bold font-mono text-emerald-600 dark:text-emerald-400">
                        +{rw.efficiencyGainPct}% Gain
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: DARK MATTER & FUSION */}
        {activeTab === 'dark_matter_fusion' && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Dark Matter Card */}
            <div
              className={`p-4 rounded-xl border ${
                isLight ? 'bg-white border-gray-200' : 'bg-[#0d1428] border-gray-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono uppercase text-amber-500 flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5" />
                  Dark Matter AI Radar
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 font-bold">
                  {darkMatterReport.clustersDetected.length} Clusters Detected
                </span>
              </div>

              <div className="text-2xl font-bold font-mono text-gray-900 dark:text-white mt-2 tabular-nums">
                ~{darkMatterReport.totalHiddenAgentsEstimatedM.toFixed(1)}M
              </div>
              <div className="text-xs text-gray-500 font-mono">
                Estimated unindexed agent runtimes (IoT • Ad Bidding • Reco Loops)
              </div>

              <div className="space-y-2 mt-3 pt-2.5 border-t border-gray-100 dark:border-gray-800 text-xs">
                {darkMatterReport.clustersDetected.slice(0, 3).map((cl) => (
                  <div key={cl.id} className="flex items-center justify-between text-[11px]">
                    <span className="text-gray-600 dark:text-gray-300 truncate max-w-[220px]">{cl.name}</span>
                    <span className="font-mono font-bold text-amber-500">{cl.estimatedPopulationM}M</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Planetary Fusion Card */}
            <div
              className={`p-4 rounded-xl border ${
                isLight ? 'bg-white border-gray-200' : 'bg-[#0d1428] border-gray-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono uppercase text-emerald-500 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Planetary Fusion Identity Layer
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-bold">
                  Deduplicated
                </span>
              </div>

              <div className="text-2xl font-bold font-mono text-gray-900 dark:text-white mt-2 tabular-nums">
                {fusionSummary.deduplicatedUniqueIdentitiesCount.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500 font-mono">
                Canonical unique agents ({fusionSummary.crossPlatformOverlapPct}% multi-cloud overlap resolved)
              </div>

              <div className="mt-3 pt-2.5 border-t border-gray-100 dark:border-gray-800">
                <span className="text-[10px] uppercase font-mono text-gray-400">Sample Canonical Roots:</span>
                <div className="space-y-1 mt-1 text-[11px] font-mono text-gray-600 dark:text-gray-300">
                  {fusionSummary.sampleIdentities.slice(0, 3).map((s) => (
                    <div key={s.globalIdentityId} className="truncate">
                      • {s.canonicalName} ({s.originPlatform})
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: SWARM ECONOMY SIMULATOR */}
        {activeTab === 'economy' && (
          <div className="mt-4 space-y-3">
            <div
              className={`p-4 rounded-xl border ${
                isLight ? 'bg-white border-gray-200' : 'bg-[#0d1428] border-gray-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100 dark:border-gray-800">
                <div>
                  <span className="text-xs font-bold font-mono uppercase text-emerald-600 dark:text-emerald-400">
                    Planetary AI Economy Valuation Engine
                  </span>
                  <div className="text-2xl font-bold font-mono text-gray-900 dark:text-white mt-1">
                    ${(economyMetrics.annualizedAiGdpUsd / 1000000000).toFixed(2)} Billion / Year
                  </div>
                  <span className="text-xs text-gray-500 font-mono">
                    ${(economyMetrics.totalDailySettledGdpUsd / 1000000).toFixed(1)}M daily settled compute value
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSimulateEconomicShift}
                    className="px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                  >
                    Simulate Policy Shift
                  </button>
                  <button
                    onClick={() => setEconomyMetrics(valuationEngine.resetToBaseline())}
                    className="px-2.5 py-1.5 text-xs rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 cursor-pointer"
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* Tier breakdown grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-3">
                {economyMetrics.tierValuations.map((tv) => (
                  <div key={tv.tier} className="p-2.5 rounded-lg bg-gray-50 dark:bg-gray-900/60 border border-gray-200/60 dark:border-gray-800">
                    <span className="text-[10px] font-mono font-bold text-cyan-600 dark:text-cyan-400 uppercase">
                      {tv.tier} Workforce
                    </span>
                    <div className="text-base font-bold font-mono text-gray-900 dark:text-white mt-0.5">
                      ${(tv.dailySettledValueUsd / 1000000).toFixed(1)}M / day
                    </div>
                    <div className="text-[10px] text-gray-500 font-mono mt-1">
                      Avg ${(tv.averageValuePerAgentUsd).toFixed(2)} / agent
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: PLANETARY GOVERNANCE DIRECTIVES */}
        {activeTab === 'governance' && (
          <div className="mt-4 space-y-3">
            <div
              className={`p-4 rounded-xl border ${
                isLight ? 'bg-white border-gray-200' : 'bg-[#0d1428] border-gray-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100 dark:border-gray-800">
                <div>
                  <span className="text-xs font-bold font-mono uppercase text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                    <Scale className="w-4 h-4" />
                    Enforceable Planetary Governance Directives
                  </span>
                  <div className="text-xs text-gray-500 font-mono mt-0.5">
                    BFT Quorum Agreement: {governanceStatus.bftQuorumAgreementRate}% • DEFCON {governanceStatus.defconDefenseLevel} Defense State
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-bold font-mono text-emerald-500">
                    {governanceStatus.ratifiedTreatiesCount} Treaties Ratified
                  </span>
                </div>
              </div>

              <div className="space-y-2 mt-3">
                {governanceStatus.governanceDirectives.map((d) => (
                  <div
                    key={d.directiveId}
                    className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900/60 border border-gray-200/60 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400">
                          {d.actionType}
                        </span>
                        <h4 className="text-xs font-bold text-gray-900 dark:text-white font-['Montserrat']">
                          {d.targetSubject}
                        </h4>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">{d.rationale}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-mono font-bold text-emerald-500">
                        {d.quorumAgreementPct}% Vote
                      </span>
                      <div className="text-[10px] text-gray-400 font-mono">{d.status}</div>
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
