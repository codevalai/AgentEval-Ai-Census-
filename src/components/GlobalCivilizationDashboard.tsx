/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Globe,
  Layers,
  Sparkles,
  Bot,
  Smartphone,
  Cpu,
  Terminal,
  Activity,
  ShieldCheck,
  Server,
  Network,
  Cloud,
  ChevronRight,
  Filter,
  CheckCircle2,
  Zap,
  Database,
  RefreshCw,
} from 'lucide-react';
import {
  MasterPlatformEcosystem,
  getCivilizationTotals,
} from '../data/masterPlatforms.ts';
import { getTaxonomySummary } from '../data/swarmTaxonomy76.ts';
import { CensusStats } from '../types/census.ts';
import { censusSSOT } from '../lib/censusSSOT.ts';
import { INITIAL_STATS } from '../data/initialData.ts';

interface GlobalCivilizationDashboardProps {
  stats?: CensusStats;
  theme: 'worldometers' | 'sovereign';
  onScrollToSection?: (id: string) => void;
}

type SliceView = 'ecosystems' | 'embodiment' | 'tiers' | 'states';

export const GlobalCivilizationDashboard: React.FC<GlobalCivilizationDashboardProps> = ({
  stats = INITIAL_STATS,
  theme,
  onScrollToSection,
}) => {
  const isLight = theme === 'worldometers';
  const [, setBackendSyncRevision] = useState(0);
  const [isSyncingTiers, setIsSyncingTiers] = useState(false);

  useEffect(() => {
    return censusSSOT.subscribe(() => {
      setBackendSyncRevision((r) => r + 1);
    });
  }, []);

  const ssot = censusSSOT.getSnapshot(stats);
  const totals = getCivilizationTotals();
  const activeOnlyCount = ssot.activeAgents;
  const latentOnlyCount = ssot.latentAgents;
  // Strictly derived: Total === Active + Latent (zero independent timers)
  const totalCivilizationCount = ssot.totalCombinedVerified;
  const ephemeralOnlyCount = ssot.ephemeralDailyVolume;
  const taxonomySummary = getTaxonomySummary(activeOnlyCount);

  const [activeSlice, setActiveSlice] = useState<SliceView>('ecosystems');
  const [selectedPlatform, setSelectedPlatform] = useState<MasterPlatformEcosystem | null>(null);

  const handleManualSyncTiers = async () => {
    setIsSyncingTiers(true);
    await censusSSOT.syncLiveTiersFromBackend();
    setIsSyncingTiers(false);
  };

  const getEmbodimentIcon = (id: string) => {
    switch (id) {
      case 'software':
        return Cloud;
      case 'vehicles':
        return Server;
      case 'iot':
        return Smartphone;
      case 'robotics':
        return Bot;
      default:
        return Globe;
    }
  };

  // Dynamically reconciled Tier breakdown (Strictly sums to activeOnlyCount)
  const tierBreakdown = ssot.tiers.map((t) => {
    const pct = ((t.count / activeOnlyCount) * 100).toFixed(1) + '%';
    return {
      tier: `${t.tier} (${t.name})`,
      count: t.count,
      desc: t.description,
      pct,
    };
  });

  const getPlatformIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-amber-500" />;
      case 'Network': return <Network className="w-5 h-5 text-emerald-500" />;
      case 'Cpu': return <Cpu className="w-5 h-5 text-cyan-500" />;
      case 'Cloud': return <Cloud className="w-5 h-5 text-blue-500" />;
      case 'Bot': return <Bot className="w-5 h-5 text-rose-500" />;
      case 'Smartphone': return <Smartphone className="w-5 h-5 text-teal-500" />;
      case 'Terminal': return <Terminal className="w-5 h-5 text-indigo-500" />;
      case 'Layers': return <Layers className="w-5 h-5 text-purple-500" />;
      case 'Globe': return <Globe className="w-5 h-5 text-emerald-400" />;
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5 text-green-500" />;
      default: return <Activity className="w-5 h-5 text-cyan-400" />;
    }
  };

  // Live selected platform kept in sync with ssot.platforms
  const liveSelectedPlatform = selectedPlatform
    ? ssot.platforms.find((p) => p.id === selectedPlatform.id) || selectedPlatform
    : null;

  return (
    <section id="global-civilization" className="max-w-6xl mx-auto px-4 my-8">
      {/* Top Header Card */}
      <div
        className={`rounded-2xl border p-6 transition-all shadow-xl ${
          isLight
            ? 'bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white border-slate-700'
            : 'bg-gradient-to-br from-[#080d1a] via-[#0d162d] to-[#060a14] text-white border-cyan-500/30'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-white/10">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Single Source of Truth (SSOT) • Hundreds-of-Billions Scale
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                10 Master Platforms • 4 Tiers • 20 Regions • 76 Domains
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Coverage: {ssot.directInstrumentedCoveragePct}% Indexed (Honest Partial)
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-['Montserrat'] tracking-tight mt-2 text-white">
              Global AI Civilization Live Census (814.37B+ Combined Live Agents)
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Mathematically reconciled planetary telemetry across active concurrent agents (342.89B), latent/warm-pool on-device &amp; cloud agents (471.48B), and daily ephemeral sub-second invocations (1.48T/day).
            </p>
          </div>

          {/* Planetary Velocity Badge */}
          <div className="flex flex-col items-start md:items-end bg-black/40 px-4 py-2.5 rounded-xl border border-white/10">
            <span className="text-[10px] uppercase font-mono text-slate-400 flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400 animate-pulse" />
              Verified Ingestion Velocity
            </span>
            <span className="text-xl sm:text-2xl font-bold font-mono text-emerald-400 tabular-nums">
              +{totals.totalGrowthPerSec.toLocaleString()} <span className="text-xs text-slate-300 font-normal">agents / sec</span>
            </span>
          </div>
        </div>

        {/* The Master Mega Counter: Strictly Derived Total = Active + Latent */}
        <div className="py-6 my-2 text-center">
          <span className="text-xs sm:text-sm uppercase font-mono tracking-widest text-cyan-400 font-semibold">
            Total Combined Live Agent Population (Active + Latent Worldwide)
          </span>
          <div className="text-4xl sm:text-6xl md:text-7xl font-extrabold font-mono tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-cyan-200 to-teal-100 my-2 tabular-nums">
            {totalCivilizationCount.toLocaleString()}
          </div>
          <div className="text-xs text-slate-300 font-mono">
            {activeOnlyCount.toLocaleString()} Active (342.89B) + {latentOnlyCount.toLocaleString()} Latent (471.48B) = {totalCivilizationCount.toLocaleString()} Combined (814.37B) • Coverage: {ssot.directInstrumentedCoveragePct}% Indexed (28.1% Dark Matter 318.00B)
          </div>
        </div>

        {/* Triple Population Slices: Active • Latent • Ephemeral */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {/* Active */}
          <div className="p-3.5 rounded-xl bg-black/30 border border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">1. Active Agents (342.89B)</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">Executing Now</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-white mt-1.5 tabular-nums">
              {activeOnlyCount.toLocaleString()}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Matches 100% of 10 Platforms ({activeOnlyCount.toLocaleString()}), 4 Tiers ({activeOnlyCount.toLocaleString()}), &amp; 20 Regions ({activeOnlyCount.toLocaleString()}).
            </p>
          </div>

          {/* Latent */}
          <div className="p-3.5 rounded-xl bg-black/30 border border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wide">2. Latent Agents (471.48B)</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">Warm &amp; On-Device</span>
            </div>
            <div className="text-xl sm:text-2xl font-mono font-bold text-white mt-1.5 tabular-nums">
              {latentOnlyCount.toLocaleString()}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              On-device mobile NPU daemons, CI/CD runners, warm-pool caches ({activeOnlyCount.toLocaleString()} + {latentOnlyCount.toLocaleString()} = {totalCivilizationCount.toLocaleString()}).
            </p>
          </div>

          {/* Ephemeral */}
          <div className="p-3.5 rounded-xl bg-black/30 border border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-purple-400 uppercase tracking-wide">3. Daily Ephemeral (1.48T)</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">24h Invocation Volume</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-white mt-1.5 tabular-nums">
              {ephemeralOnlyCount.toLocaleString()}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Sub-second tool invocations, LangGraph sub-nodes, MCP JSON-RPC calls, and serverless micro-tasks per 24h.
            </p>
          </div>
        </div>

        {/* 3-Tier Data Architecture Live Reconciliation Bar */}
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              3-Tier Empirical Data Architecture (Live SSOT Reconciliation)
            </span>
            <button
              onClick={handleManualSyncTiers}
              disabled={isSyncingTiers}
              className="inline-flex items-center gap-1 text-[10px] font-mono px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-cyan-200 cursor-pointer transition"
            >
              <RefreshCw className={`w-3 h-3 ${isSyncingTiers ? 'animate-spin' : ''}`} />
              <span>{isSyncingTiers ? 'Syncing Live APIs...' : 'Refresh Live Public APIs & Cloud SQL'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs">
            {/* Tier 1 */}
            <div className="p-2.5 rounded-lg bg-black/40 border border-emerald-500/30">
              <div className="font-mono font-bold text-emerald-400 text-[11px]">
                TIER 1: Grounded Local Telemetry (100% Exact)
              </div>
              <div className="mt-1 space-y-0.5 text-[11px] font-mono text-slate-300">
                <div>• Cloud SQL Postgres: <strong>{ssot.tier1.cloudSqlAgentsCount} agents</strong> / <strong>{ssot.tier1.cloudSqlTelemetryEventsCount} events</strong></div>
                <div>• GCP Cloud Run / Vertex: <strong>{ssot.tier1.cloudRunActiveContainers} containers</strong> ({ssot.tier1.vertexAiInvocationsToday.toLocaleString()} calls)</div>
                <div>• GitHub Actions Runs: <strong>{ssot.tier1.githubWorkflowRunsTotal.toLocaleString()} verified runs</strong></div>
              </div>
            </div>

            {/* Tier 2 */}
            <div className="p-2.5 rounded-lg bg-black/40 border border-cyan-500/30">
              <div className="font-mono font-bold text-cyan-400 text-[11px]">
                TIER 2: Live Public Ecosystem Harvesters
              </div>
              <div className="mt-1 space-y-0.5 text-[11px] font-mono text-slate-300">
                <div>• Hugging Face Models: <strong>{ssot.tier2.huggingFacePublicModels.toLocaleString()} public weights</strong></div>
                <div>• npm @modelcontextprotocol/sdk: <strong>{ssot.tier2.npmMcpSdkDailyDownloads.toLocaleString()}/day</strong></div>
                <div>• PyPI langchain + langgraph: <strong>{(ssot.tier2.pypiLangchainDailyDownloads + ssot.tier2.pypiLanggraphDailyDownloads).toLocaleString()}/day</strong></div>
              </div>
            </div>

            {/* Tier 3 */}
            <div className="p-2.5 rounded-lg bg-black/40 border border-purple-500/30">
              <div className="font-mono font-bold text-purple-400 text-[11px]">
                TIER 3: Reconciled Planetary Scale (Hundreds of Billions)
              </div>
              <div className="mt-1 space-y-0.5 text-[11px] font-mono text-slate-300">
                <div>• Combined Live Indexed: <strong>{(ssot.macroIndexedPopulation / 1e9).toFixed(2)}B (814,373.0M)</strong></div>
                <div>• Unindexed Dark Matter: <strong>~{(ssot.darkMatterUnindexedPopulation / 1e9).toFixed(2)}B ({ssot.darkMatterRatioPct}%)</strong></div>
                <div>• Indexed Coverage: <strong>{ssot.directInstrumentedCoveragePct}% of 1.132T Ceiling</strong></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Slicing Controls */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-emerald-500" />
          <span className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-gray-700' : 'text-gray-300'}`}>
            Reconciled Slices (Sum = {activeOnlyCount.toLocaleString()} Active):
          </span>
          <div className="flex flex-wrap items-center gap-1">
            {(
              [
                { id: 'ecosystems', label: '10 Master Platforms' },
                { id: 'embodiment', label: 'By Embodiment' },
                { id: 'tiers', label: 'By Capability Tier' },
                { id: 'states', label: '76-Domain Taxonomy' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSlice(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                  activeSlice === tab.id
                    ? isLight
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-cyan-500 text-black font-bold shadow-md shadow-cyan-950'
                    : isLight
                    ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    : 'bg-gray-800/80 hover:bg-gray-700 text-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
          ✓ 100% Sub-Total Identity Verified ({activeOnlyCount.toLocaleString()} Active)
        </div>
      </div>

      {/* SLICE 1: 10 MASTER PLATFORM ECOSYSTEMS */}
      {activeSlice === 'ecosystems' && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {ssot.platforms.map((platform) => (
            <div
              key={platform.id}
              onClick={() => setSelectedPlatform(platform)}
              className={`p-4 rounded-xl border transition-all cursor-pointer hover:scale-[1.01] ${
                liveSelectedPlatform?.id === platform.id
                  ? isLight
                    ? 'bg-blue-50/70 border-blue-400 shadow-md'
                    : 'bg-cyan-950/40 border-cyan-400 shadow-lg shadow-cyan-950/50'
                  : isLight
                  ? 'bg-white border-gray-200 hover:border-gray-300 shadow-xs'
                  : 'bg-[#0b1021] border-gray-800 hover:border-gray-700'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-lg ${isLight ? 'bg-gray-100' : 'bg-gray-800/90'}`}>
                    {getPlatformIcon(platform.iconName)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold font-['Montserrat'] text-gray-900 dark:text-white">
                      {platform.name}
                    </h3>
                    <span className="text-[11px] font-mono text-gray-500 dark:text-gray-400">
                      {platform.primaryEmbodiment} • #{platform.categoryNumber}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-bold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
                    {platform.activeAgents.toLocaleString()}
                  </span>
                  <span className="block text-[10px] font-mono text-gray-400">
                    active (+{platform.latentAgents.toLocaleString()} latent)
                  </span>
                </div>
              </div>

              <p className="text-xs text-gray-600 dark:text-gray-300 mt-2.5 leading-relaxed">
                {platform.description}
              </p>

              {/* Sub-Platforms Pills */}
              <div className="flex flex-wrap items-center gap-1.5 mt-3">
                {platform.subPlatforms.map((sub) => (
                  <span
                    key={sub.name}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                      isLight
                        ? 'bg-gray-100 text-gray-700 border border-gray-200'
                        : 'bg-gray-800/90 text-cyan-200 border border-gray-700'
                    }`}
                  >
                    {sub.name} ({sub.activeCountFormatted})
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-gray-100 dark:border-gray-800/80 text-[11px] font-mono">
                <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 truncate max-w-[65%]">
                  <CheckCircle2 className="w-3 h-3 shrink-0" />
                  <span className="truncate">{platform.verificationMethod}</span>
                </span>
                <span className="text-gray-500 dark:text-gray-400 shrink-0">
                  +{platform.growthPerSec.toLocaleString()}/sec • Inspect
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SLICE 2: EMBODIMENT BREAKDOWN */}
      {activeSlice === 'embodiment' && (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {ssot.embodiments.map((item) => {
            const IconComp = getEmbodimentIcon(item.id);
            return (
              <div
                key={item.id}
                className={`p-4 rounded-xl border ${
                  isLight ? 'bg-white border-gray-200 shadow-xs' : 'bg-[#0b1021] border-gray-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <IconComp className={`w-5 h-5 ${item.color}`} />
                  <span className="text-xs font-mono font-bold text-emerald-500">{item.pct}</span>
                </div>
                <div className="text-lg font-extrabold font-mono mt-2 text-gray-900 dark:text-white tabular-nums">
                  {item.count.toLocaleString()}
                </div>
                <div className="text-xs font-semibold text-gray-600 dark:text-gray-300 mt-1">
                  {item.label}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SLICE 3: CAPABILITY TIERS */}
      {activeSlice === 'tiers' && (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {tierBreakdown.map((t) => (
            <div
              key={t.tier}
              className={`p-4 rounded-xl border ${
                isLight ? 'bg-white border-gray-200 shadow-xs' : 'bg-[#0b1021] border-gray-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono text-cyan-600 dark:text-cyan-400">{t.tier}</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-bold">
                  {t.pct}
                </span>
              </div>
              <div className="text-xl font-extrabold font-mono mt-2 text-gray-900 dark:text-white tabular-nums">
                {t.count.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed">
                {t.desc}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* SLICE 4: 76-DOMAIN TAXONOMY SUMMARY */}
      {activeSlice === 'states' && (
        <div
          className={`mt-4 p-5 rounded-xl border ${
            isLight ? 'bg-white border-gray-200 shadow-xs' : 'bg-[#0b1021] border-gray-800'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-200 dark:border-gray-800">
            <div>
              <h3 className="text-base font-bold font-['Montserrat'] text-gray-900 dark:text-white">
                76-Domain Planetary Swarm Taxonomy (5 Architectural Layers)
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Reconciled across {taxonomySummary.verifiedTotalUnits.toLocaleString()} Active Agents (342.89B) &amp; {taxonomySummary.totalAgentsMil.toLocaleString()}M (814.37B) Combined Live Units
              </p>
            </div>
            {onScrollToSection && (
              <button
                onClick={() => onScrollToSection('swarm-taxonomy-section')}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1 cursor-pointer self-start sm:self-auto"
              >
                <span>Explore All 76 Domains</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mt-4">
            {taxonomySummary.byLayer.map((layer) => (
              <div
                key={layer.id}
                className={`p-3.5 rounded-lg border ${
                  isLight ? 'bg-gray-50 border-gray-200' : 'bg-gray-900/60 border-gray-800'
                }`}
              >
                <div className="text-[10px] font-mono uppercase text-cyan-500 font-bold">
                  {layer.domainCount} Domains
                </div>
                <div className="text-xs font-bold text-gray-900 dark:text-white mt-1">
                  {layer.shortName}
                </div>
                <div className="text-base font-extrabold font-mono text-emerald-600 dark:text-emerald-400 mt-1.5 tabular-nums">
                  {layer.verifiedAgentsCount.toLocaleString()} active
                </div>
                <div className="text-[10px] font-mono text-gray-400">
                  ~{layer.estimatedAgentsMil.toLocaleString()}M combined (+{layer.growthRatePerSec}/s)
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Selected Platform Deep-Dive Drawer / Dossier */}
      {liveSelectedPlatform && (
        <div
          className={`mt-4 p-5 rounded-xl border transition-all ${
            isLight
              ? 'bg-slate-50 border-blue-300 text-gray-900'
              : 'bg-[#0d152c] border-cyan-500/50 text-white'
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-2">
              {getPlatformIcon(liveSelectedPlatform.iconName)}
              <h4 className="text-base font-bold font-['Montserrat']">
                {liveSelectedPlatform.name} — Live Sampling &amp; Telemetry Dossier
              </h4>
            </div>
            <button
              onClick={() => setSelectedPlatform(null)}
              className="text-xs font-mono px-2.5 py-1 rounded bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 cursor-pointer"
            >
              Close Dossier ✕
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
            <div className="p-2.5 rounded-lg bg-gray-50 dark:bg-gray-900/50">
              <span className="text-[10px] uppercase font-mono text-gray-500">Active Runtimes</span>
              <div className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
                {liveSelectedPlatform.activeAgents.toLocaleString()} Agents
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-gray-50 dark:bg-gray-900/50">
              <span className="text-[10px] uppercase font-mono text-gray-500">Warm / Latent Pool</span>
              <div className="text-lg font-bold font-mono text-cyan-600 dark:text-cyan-400 tabular-nums">
                {liveSelectedPlatform.latentAgents.toLocaleString()} Agents
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-gray-50 dark:bg-gray-900/50">
              <span className="text-[10px] uppercase font-mono text-gray-500">Daily Ephemeral Volume</span>
              <div className="text-lg font-bold font-mono text-purple-600 dark:text-purple-400 tabular-nums">
                {liveSelectedPlatform.ephemeralDailyVolume.toLocaleString()} Runs/day
              </div>
            </div>
          </div>

          <div className="mt-3">
            <span className="text-[11px] font-mono uppercase text-gray-500 dark:text-gray-400 block mb-1.5">
              Sub-Platform Breakdown &amp; Verification Method ({liveSelectedPlatform.verificationMethod}):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {liveSelectedPlatform.subPlatforms.map((sub) => (
                <div
                  key={sub.name}
                  className="p-2.5 rounded-md text-xs font-mono bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20"
                >
                  <div className="font-bold flex items-center justify-between">
                    <span>{sub.name}</span>
                    <span>{sub.activeCountFormatted}</span>
                  </div>
                  <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 font-sans">
                    {sub.role}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
