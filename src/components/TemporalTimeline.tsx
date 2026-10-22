/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Clock,
  CheckCircle2,
  Cpu,
  Layers,
  Sparkles,
  ArrowRight,
  Shield,
  Key,
} from 'lucide-react';
import { TEMPORAL_TIMELINE_ERAS } from '../data/planetaryDirectory.ts';
import { AgentEra } from '../types/census.ts';

import { CensusStats } from '../types/census.ts';
import { INITIAL_STATS } from '../data/initialData.ts';

interface TemporalTimelineProps {
  stats?: CensusStats;
  theme: 'worldometers' | 'sovereign';
  onSelectEraForDirectory?: (era: AgentEra) => void;
}

export const TemporalTimeline: React.FC<TemporalTimelineProps> = ({
  stats = INITIAL_STATS,
  theme,
  onSelectEraForDirectory,
}) => {
  const [activeEraId, setActiveEraId] = useState<AgentEra>('2024_2026_MCP_SWARMS');

  const isLight = theme === 'worldometers';
  const liveActive = Math.max(342892410000, Math.round(stats.totalAgents));
  const activeEra = TEMPORAL_TIMELINE_ERAS.find((e) => e.id === activeEraId) || TEMPORAL_TIMELINE_ERAS[3];

  return (
    <section id="temporal-timeline" className="max-w-6xl mx-auto px-4 py-8">
      {/* Title */}
      <div className="border-b pb-4 mb-6 border-gray-200 dark:border-gray-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              <h2 className="text-xl sm:text-2xl font-bold font-['Montserrat'] tracking-tight">
                Temporal Agent Timeline (2012 → Present → 2030+ APEX)
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
              Time-indexed planetary evolution tracking historical lineage, current MCP swarm velocity, and future sovereign nodes.
            </p>
          </div>
          <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-300 dark:border-blue-800 self-start sm:self-center font-bold">
            EPOCH CHRONO-INDEX
          </span>
        </div>
      </div>

      {/* Era Navigation Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-6">
        {TEMPORAL_TIMELINE_ERAS.map((era) => {
          const isActive = era.id === activeEraId;
          const isCurrent = era.status === 'CURRENT';

          return (
            <button
              key={era.id}
              onClick={() => setActiveEraId(era.id)}
              className={`p-3 rounded-lg border text-left transition cursor-pointer relative ${
                isActive
                  ? isLight
                    ? 'bg-blue-50 border-blue-500 shadow-sm'
                    : 'bg-[#152038] border-cyan-400 shadow-lg shadow-cyan-950/50'
                  : isLight
                  ? 'bg-white border-gray-200 hover:border-gray-300'
                  : 'bg-[#0f1422] border-gray-800 hover:border-gray-700'
              }`}
            >
              {isCurrent && (
                <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              )}
              <div className="text-[11px] font-bold font-mono text-gray-500 dark:text-gray-400">
                {era.years}
              </div>
              <div
                className={`text-xs font-bold font-['Montserrat'] mt-1 leading-snug line-clamp-2 ${
                  isActive
                    ? 'text-blue-700 dark:text-cyan-300'
                    : 'text-gray-800 dark:text-gray-200'
                }`}
              >
                {era.eraTitle.split(' ')[0]} {era.eraTitle.split(' ')[1]}
              </div>
              <div className="text-[10px] text-gray-400 mt-2 font-mono">
                {era.agentCountFormatted.split(' ')[0]} {era.agentCountFormatted.split(' ')[1]}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Era Spotlight Card */}
      <div
        className={`p-6 rounded-xl border transition-all ${
          isLight
            ? 'bg-white border-gray-200 shadow-sm'
            : 'bg-[#0f1422] border-gray-800 shadow-xl'
        }`}
      >
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b pb-4 mb-6 border-gray-200 dark:border-gray-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-800">
                {activeEra.years}
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                  activeEra.status === 'CURRENT'
                    ? 'bg-emerald-600 text-white'
                    : activeEra.status === 'PROJECTED'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-600 text-white'
                }`}
              >
                {activeEra.status}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-['Montserrat'] tracking-tight mt-1 text-gray-900 dark:text-gray-100">
              {activeEra.eraTitle}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1">
              {activeEra.subtitle}
            </p>
          </div>

          <div className="text-left lg:text-right shrink-0">
            <span className="text-xs text-gray-500 uppercase tracking-wider block">Planetary Agent Population</span>
            <span className="text-2xl sm:text-3xl font-bold font-mono text-cyan-600 dark:text-cyan-400 tabular-nums">
              {activeEra.id === '2024_2026_MCP_SWARMS'
                ? `${liveActive.toLocaleString()} Active (814.37B Combined)`
                : activeEra.agentCountFormatted}
            </span>
          </div>
        </div>

        {/* 3 Pillars in Era */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Key Milestones */}
          <div
            className={`p-4 rounded-lg border text-xs ${
              isLight ? 'bg-gray-50 border-gray-200' : 'bg-[#141b2d] border-gray-800'
            }`}
          >
            <h4 className="font-bold uppercase tracking-wider text-[11px] mb-3 flex items-center gap-2 text-cyan-600 dark:text-cyan-400">
              <CheckCircle2 className="w-4 h-4" /> Breakthrough Milestones
            </h4>
            <ul className="space-y-2">
              {activeEra.milestones.map((m, idx) => (
                <li key={`${activeEra.id}-milestone-${idx}`} className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold shrink-0">•</span>
                  <span className="text-gray-700 dark:text-gray-300">{m}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Dominant Platforms */}
          <div
            className={`p-4 rounded-lg border text-xs ${
              isLight ? 'bg-gray-50 border-gray-200' : 'bg-[#141b2d] border-gray-800'
            }`}
          >
            <h4 className="font-bold uppercase tracking-wider text-[11px] mb-3 flex items-center gap-2 text-cyan-600 dark:text-cyan-400">
              <Cpu className="w-4 h-4" /> Dominant Platforms &amp; Runtimes
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {activeEra.dominantPlatforms.map((plat, idx) => (
                <span
                  key={`${activeEra.id}-plat-${idx}`}
                  className="px-2 py-1 rounded bg-white dark:bg-black/50 border border-gray-300 dark:border-gray-700 font-mono text-[11px] text-gray-800 dark:text-gray-200"
                >
                  {plat}
                </span>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-800">
              <span className="text-[11px] font-bold text-gray-500 block mb-1">Architectural Paradigms:</span>
              <div className="flex flex-wrap gap-1">
                {activeEra.paradigms.map((p, idx) => (
                  <span
                    key={`${activeEra.id}-paradigm-${idx}`}
                    className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Cryptographic Anchor */}
          <div
            className={`p-4 rounded-lg border text-xs ${
              isLight ? 'bg-gray-50 border-gray-200' : 'bg-[#141b2d] border-gray-800'
            }`}
          >
            <h4 className="font-bold uppercase tracking-wider text-[11px] mb-3 flex items-center gap-2 text-cyan-600 dark:text-cyan-400">
              <Shield className="w-4 h-4" /> Merkle Spine Epoch Anchor
            </h4>
            <div className="space-y-3">
              <div>
                <span className="text-gray-500 block mb-1">Cryptographic Epoch Root:</span>
                <span className="font-mono text-[11px] px-2 py-1 rounded bg-white dark:bg-black/50 border border-gray-300 dark:border-gray-700 block font-bold text-purple-700 dark:text-purple-300 break-all">
                  {activeEra.cryptographicAnchor}
                </span>
              </div>
              <div className="p-2.5 rounded bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-900/60 text-[11px] text-cyan-900 dark:text-cyan-200">
                <span className="font-bold">Z3 Invariant Status:</span> Formally verified SAT under cleanroom memory constraints.
              </div>

              {onSelectEraForDirectory && (
                <button
                  onClick={() => onSelectEraForDirectory(activeEra.id)}
                  className="w-full mt-2 py-2 px-3 bg-cyan-700 hover:bg-cyan-600 text-white rounded font-semibold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow"
                >
                  <span>Filter Directory by {activeEra.years}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
