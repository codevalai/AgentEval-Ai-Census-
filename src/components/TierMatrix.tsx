/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Layers, ShieldAlert, Cpu, Sparkles, CheckCircle2 } from 'lucide-react';
import { CapabilityTierInfo } from '../types/census.ts';

interface TierMatrixProps {
  tiers: CapabilityTierInfo[];
  theme: 'worldometers' | 'sovereign';
}

export const TierMatrix: React.FC<TierMatrixProps> = ({ tiers, theme }) => {
  const isLight = theme === 'worldometers';

  return (
    <section id="tier-matrix" className="max-w-6xl mx-auto px-4 my-8 scroll-mt-20">
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2
            className={`text-lg font-bold flex items-center gap-2 ${
              isLight ? 'text-gray-900' : 'text-white'
            }`}
          >
            <Layers className="w-5 h-5 text-purple-600" />
            AI / AGI / ASI / APEX Capability Tier Matrix
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Deterministic promotion pipeline governing autonomy escalation, cross-domain reasoning, and multi-agent governance
          </p>
        </div>
        <div className="text-xs font-mono px-3 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold">
          Σ(4 Tiers) = {tiers.reduce((s, t) => s + t.count, 0).toLocaleString()} Active Agents (100% SSOT Synced)
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {tiers.map((tier) => {
          const isApex = tier.tier === 'APEX';
          const isASI = tier.tier === 'ASI';
          const isAGI = tier.tier === 'AGI';

          let borderClass = 'border-gray-200 dark:border-gray-800';
          let headerColor = 'text-blue-600 dark:text-blue-400';
          let bgPill = 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300';

          if (isAGI) {
            headerColor = 'text-emerald-600 dark:text-emerald-400';
            bgPill = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300';
          } else if (isASI) {
            headerColor = 'text-purple-600 dark:text-purple-400';
            bgPill = 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300';
          } else if (isApex) {
            borderClass = 'border-amber-300 dark:border-amber-600/60 ring-1 ring-amber-400/30';
            headerColor = 'text-amber-600 dark:text-amber-400';
            bgPill = 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300';
          }

          return (
            <div
              key={tier.tier}
              className={`rounded-lg p-4 border flex flex-col justify-between transition-all ${
                isLight
                  ? 'bg-white shadow-xs'
                  : 'bg-[#0d1222] shadow-xl'
              } ${borderClass}`}
            >
              <div>
                {/* Header Tag */}
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded ${bgPill}`}>
                    TIER: {tier.tier}
                  </span>
                  <span className="text-[11px] font-mono text-gray-500">
                    {tier.growthRate}
                  </span>
                </div>

                <h3 className={`text-base font-bold mb-1 ${headerColor}`}>
                  {tier.name}
                </h3>

                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
                  {tier.description}
                </p>

                {/* Metrics */}
                <div className="bg-gray-50 dark:bg-gray-900/60 p-2.5 rounded border border-gray-100 dark:border-gray-800/80 mb-3 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tasks Threshold:</span>
                    <span className="font-mono font-bold text-gray-800 dark:text-gray-200">
                      {tier.minTasks === 0 ? 'Baseline (0)' : `> ${tier.minTasks}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Autonomy Required:</span>
                    <span className="font-mono font-bold text-gray-800 dark:text-gray-200">
                      {tier.minAutonomy === 0 ? 'Task Bound' : `≥ ${tier.minAutonomy} / 100`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Reasoning Depth:</span>
                    <span className="font-mono font-bold text-gray-800 dark:text-gray-200">
                      {tier.minReasoning === 0 ? 'Narrow' : `≥ ${tier.minReasoning} / 100`}
                    </span>
                  </div>
                </div>

                {/* Representative Archetypes */}
                <div className="mb-3">
                  <span className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    Representative Archetypes:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {tier.representativeArchetypes.map((arch) => (
                      <span
                        key={arch}
                        className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                      >
                        {arch}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Promotion Rule and Population */}
              <div className="border-t pt-2.5 border-gray-100 dark:border-gray-800 mt-2">
                <div className="text-[11px] text-gray-500 mb-1 flex items-start gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="line-clamp-2">{tier.promotionCriteria}</span>
                </div>

                <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
                  <span className="text-xs font-semibold text-gray-500">Live Census:</span>
                  <span
                    className={`text-lg font-bold font-mono tabular-nums ${
                      isLight ? 'text-[#006600]' : 'text-emerald-400'
                    }`}
                  >
                    {tier.count.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
