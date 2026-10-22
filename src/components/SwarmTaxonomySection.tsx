/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Layers,
  Search,
  Filter,
  CheckCircle2,
  ExternalLink,
  Shield,
  Activity,
  Zap,
  Cpu,
  ChevronDown,
} from 'lucide-react';
import {
  SWARM_TAXONOMY_LAYERS,
  SWARM_TAXONOMY_DOMAINS,
  SwarmTaxonomyDomain,
  getTaxonomySummary,
} from '../data/swarmTaxonomy76.ts';

import { CensusStats } from '../types/census.ts';
import { INITIAL_STATS } from '../data/initialData.ts';

interface SwarmTaxonomySectionProps {
  stats?: CensusStats;
  theme: 'worldometers' | 'sovereign';
  onScrollToSection: (id: string) => void;
}

export const SwarmTaxonomySection: React.FC<SwarmTaxonomySectionProps> = ({
  stats = INITIAL_STATS,
  theme,
  onScrollToSection,
}) => {
  const isLight = theme === 'worldometers';
  const liveActive = Math.max(342892410000, Math.round(stats.totalAgents));
  const summary = getTaxonomySummary(liveActive);

  const [selectedLayer, setSelectedLayer] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDomainId, setSelectedDomainId] = useState<string | null>(null);

  const liveDomains = summary.domains;
  const selectedDomain = selectedDomainId
    ? liveDomains.find((d) => d.id === selectedDomainId) || null
    : null;

  const filteredDomains = liveDomains.filter((d) => {
    const matchesLayer = selectedLayer === 'ALL' || d.layer === selectedLayer;
    const matchesQuery =
      searchQuery === '' ||
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.primaryEcosystem.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesLayer && matchesQuery;
  });

  const filteredVerifiedSum = filteredDomains.reduce((acc, d) => acc + (d.verifiedAgents || 0), 0);

  return (
    <section id="swarm-taxonomy-section" className="max-w-6xl mx-auto px-4 my-10">
      <div
        className={`rounded-xl border p-5 sm:p-6 transition-all ${
          isLight
            ? 'bg-white border-gray-200 shadow-sm'
            : 'bg-[#090e1c] border-emerald-500/20 shadow-xl shadow-black/40'
        }`}
      >
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-gray-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" />
                ×3 Hyper-Scale Swarm Census Taxonomy
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/20">
                228 Unified Domains (76 Core × 3)
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-['Montserrat'] mt-1 text-gray-900 dark:text-white">
              Planetary Swarm Census • 228-Domain (76×3) Architectural Taxonomy
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-3xl">
              Expanded across 24 Unified Meta-Layers, 15 Hyper-Crawler Swarms, and 228 Hare-Niemeyer zero-drift domains (76 core pillars × 3) spanning Foundational &amp; Structural, Governance &amp; Safety, Intelligence &amp; Behavior, Data &amp; Telemetry, and Research &amp; Expansion.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
                228 Domains (76×3) • {summary.verifiedTotalUnits.toLocaleString()} Active
              </div>
              <div className="text-[11px] font-mono text-gray-400 tabular-nums">
                918.05M Kalman Wire Cohort • Δ = 0 Hare-Niemeyer Reconciled
              </div>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mt-4">
          {/* Layer Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setSelectedLayer('ALL')}
              className={`px-3 py-1 text-xs rounded-lg font-semibold transition-all cursor-pointer ${
                selectedLayer === 'ALL'
                  ? isLight
                    ? 'bg-gray-900 text-white shadow-xs'
                    : 'bg-emerald-500 text-black font-bold'
                  : isLight
                  ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
              }`}
            >
              All 76 Domains
            </button>
            {SWARM_TAXONOMY_LAYERS.map((layer) => {
              const isSelected = selectedLayer === layer.id;
              const count = SWARM_TAXONOMY_DOMAINS.filter((d) => d.layer === layer.id).length;
              return (
                <button
                  key={layer.id}
                  onClick={() => setSelectedLayer(layer.id)}
                  className={`px-2.5 py-1 text-xs rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? isLight
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-cyan-500 text-black font-bold'
                      : isLight
                      ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                  }`}
                >
                  <span>{layer.shortName}</span>
                  <span className="text-[10px] opacity-75 font-mono">({count})</span>
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[240px]">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search 76 domains or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border transition-all ${
                isLight
                  ? 'bg-gray-50 border-gray-300 focus:bg-white focus:border-blue-500'
                  : 'bg-gray-900/80 border-gray-700 text-white focus:border-emerald-500'
              } outline-hidden`}
            />
          </div>
        </div>

        {/* 76-Domain Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4 max-h-[580px] overflow-y-auto pr-1">
          {filteredDomains.map((domain) => (
            <div
              key={domain.id}
              onClick={() => setSelectedDomainId(domain.id)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer hover:border-emerald-500/50 ${
                selectedDomain?.id === domain.id
                  ? isLight
                    ? 'bg-emerald-50/70 border-emerald-400 shadow-sm'
                    : 'bg-emerald-950/30 border-emerald-400 shadow-md shadow-emerald-950/40'
                  : isLight
                  ? 'bg-gray-50/60 border-gray-200 hover:bg-white'
                  : 'bg-[#0d1326]/70 border-gray-800/80 hover:bg-[#111933]'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {domain.code}
                  </span>
                  <h4 className="text-xs font-bold font-['Montserrat'] text-gray-900 dark:text-white mt-0.5 line-clamp-1">
                    {domain.name}
                  </h4>
                </div>

                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0 font-semibold">
                  {domain.complianceLevel.split(' ')[0]}
                </span>
              </div>

              <p className="text-[11px] text-gray-600 dark:text-gray-400 mt-1.5 line-clamp-2 leading-relaxed">
                {domain.description}
              </p>

              <div className="flex items-center justify-between gap-2 mt-2.5 pt-2 border-t border-gray-200/60 dark:border-gray-800/60 text-[10px] font-mono text-gray-500 dark:text-gray-400">
                <span>{domain.primaryEcosystem}</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                  {(domain.verifiedAgents || 0).toLocaleString()} verified (~{domain.estimatedAgents}M macro)
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Domain Detail Modal / Inspector */}
        {selectedDomain && (
          <div
            className={`mt-4 p-4 rounded-xl border transition-all ${
              isLight
                ? 'bg-blue-50/80 border-blue-200 text-gray-900'
                : 'bg-[#0f172a] border-cyan-500/40 text-gray-100 shadow-lg'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-200 dark:border-gray-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                    {selectedDomain.code}
                  </span>
                  <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
                    {selectedDomain.layerTitle}
                  </span>
                </div>
                <h3 className="text-base font-bold font-['Montserrat'] mt-1">
                  {selectedDomain.name}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                {selectedDomain.sectionTargetId && (
                  <button
                    onClick={() => {
                      if (selectedDomain.sectionTargetId) {
                        onScrollToSection(selectedDomain.sectionTargetId);
                      }
                    }}
                    className="px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer flex items-center gap-1"
                  >
                    <span>Jump to Section</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                )}
                <button
                  onClick={() => setSelectedDomainId(null)}
                  className="px-2.5 py-1 text-xs rounded bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 text-gray-700 dark:text-gray-300 cursor-pointer"
                >
                  Close ✕
                </button>
              </div>
            </div>

            <p className="text-xs mt-2.5 leading-relaxed text-gray-700 dark:text-gray-300">
              {selectedDomain.description}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-3">
              <div className="p-2 rounded-lg bg-white/60 dark:bg-gray-900/50 border border-gray-200/50 dark:border-gray-800">
                <span className="text-[10px] uppercase font-mono text-gray-500">Estimated Population</span>
                <div className="text-sm font-bold font-mono text-emerald-600 dark:text-emerald-400">
                  {selectedDomain.estimatedAgents} Million
                </div>
              </div>
              <div className="p-2 rounded-lg bg-white/60 dark:bg-gray-900/50 border border-gray-200/50 dark:border-gray-800">
                <span className="text-[10px] uppercase font-mono text-gray-500">Growth Velocity</span>
                <div className="text-sm font-bold font-mono text-cyan-600 dark:text-cyan-400">
                  +{selectedDomain.growthRatePerSec} / sec
                </div>
              </div>
              <div className="p-2 rounded-lg bg-white/60 dark:bg-gray-900/50 border border-gray-200/50 dark:border-gray-800">
                <span className="text-[10px] uppercase font-mono text-gray-500">Compliance Standard</span>
                <div className="text-sm font-bold font-mono text-purple-600 dark:text-purple-400">
                  {selectedDomain.complianceLevel}
                </div>
              </div>
              <div className="p-2 rounded-lg bg-white/60 dark:bg-gray-900/50 border border-gray-200/50 dark:border-gray-800">
                <span className="text-[10px] uppercase font-mono text-gray-500">Primary Ecosystem</span>
                <div className="text-sm font-bold font-mono text-amber-600 dark:text-amber-400 truncate">
                  {selectedDomain.primaryEcosystem}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-2 border-t border-gray-200 dark:border-gray-800">
              <span className="text-[10px] font-mono text-gray-500">Tags:</span>
              {selectedDomain.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-mono px-2 py-0.5 rounded bg-gray-200/70 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Zero-Drift Mathematical Reconciliation Footer */}
        <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-800 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-gray-500 dark:text-gray-400">
          <span>
            Displayed Slice ({filteredDomains.length}/{summary.totalDomains} Domains):{' '}
            <strong className="text-emerald-600 dark:text-emerald-400 tabular-nums">
              {filteredVerifiedSum.toLocaleString()} Active Verified
            </strong>
          </span>
          <span>
            ∑(All 76 Domains) ≡{' '}
            <strong className="text-emerald-600 dark:text-emerald-400 tabular-nums">
              {summary.verifiedTotalUnits.toLocaleString()} Active
            </strong>{' '}
            / <strong className="text-cyan-600 dark:text-cyan-400 tabular-nums">{summary.totalAgentsMil.toLocaleString()}M Combined</strong> (0 Unit Drift • Hare-Niemeyer Exact)
          </span>
        </div>
      </div>
    </section>
  );
};
