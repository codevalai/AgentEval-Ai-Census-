/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { ArrowUp, ArrowDown, Activity, Sparkles, Zap, Layers, Flame } from 'lucide-react';
import { CensusStats } from '../types/census.ts';
import { agentBirthAccelerator, ContinuousBatchState } from '../lib/agentBirthAccelerator.ts';

interface HorizonPanelsProps {
  stats: CensusStats;
  theme: 'worldometers' | 'sovereign';
}

export const HorizonPanels: React.FC<HorizonPanelsProps> = ({ stats, theme }) => {
  const isLight = theme === 'worldometers';
  const [acceleratorState, setAcceleratorState] = useState<ContinuousBatchState>(() =>
    agentBirthAccelerator.getMetrics()
  );

  useEffect(() => {
    const unsubscribe = agentBirthAccelerator.subscribe((latest) => {
      setAcceleratorState(latest);
    });
    return unsubscribe;
  }, []);

  return (
    <section className="max-w-6xl mx-auto px-4 my-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Panel: Today */}
        <div
          className={`rounded-lg p-5 border transition-all ${
            isLight
              ? 'bg-[#f8f9fa] border-gray-300 shadow-xs'
              : 'bg-[#0d1222] border-gray-800 shadow-xl shadow-black/50'
          }`}
        >
          <div className="flex items-center justify-between border-b pb-3 mb-4 border-gray-200 dark:border-gray-800">
            <h2
              className={`text-base font-bold uppercase tracking-wider ${
                isLight ? 'text-gray-800' : 'text-cyan-300'
              }`}
            >
              Today
            </h2>
            <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-medium">
              LIVE ACCUMULATION
            </span>
          </div>

          <div className="space-y-4">
            {/* Births Today */}
            <div className="flex items-center justify-between">
              <div>
                <span className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Agents Born Today
                </span>
                <span className="block text-[11px] text-gray-500 dark:text-gray-400">
                  New agent deployments &amp; task workers initialized
                </span>
              </div>
              <div className="text-right">
                <span
                  className={`text-xl sm:text-2xl font-bold font-mono tabular-nums ${
                    acceleratorState.isSpikeActive
                      ? 'text-amber-500 dark:text-amber-400'
                      : isLight
                      ? 'text-[#006600]'
                      : 'text-emerald-400'
                  }`}
                >
                  {Math.floor(stats.agentsBornToday).toLocaleString()}
                </span>
                <span
                  className={`block text-[10px] font-mono flex items-center justify-end gap-1 ${
                    acceleratorState.isSpikeActive
                      ? 'text-amber-600 dark:text-amber-400 font-bold'
                      : 'text-emerald-600'
                  }`}
                >
                  {acceleratorState.isSpikeActive && <Flame className="w-3 h-3 text-amber-500 animate-pulse" />}
                  +{acceleratorState.instantaneousBirthRate}/sec
                </span>
              </div>
            </div>

            {/* Shutdowns Today */}
            <div className="flex items-center justify-between border-t pt-3 border-gray-200 dark:border-gray-800/80">
              <div>
                <span className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Agents Shutdown Today
                </span>
                <span className="block text-[11px] text-gray-500 dark:text-gray-400">
                  Archived, pruned, or tombstoned instances
                </span>
              </div>
              <div className="text-right">
                <span
                  className={`text-xl sm:text-2xl font-bold font-mono tabular-nums ${
                    isLight ? 'text-gray-800' : 'text-gray-300'
                  }`}
                >
                  {Math.floor(stats.agentsShutdownToday).toLocaleString()}
                </span>
                <span className="block text-[10px] text-gray-500 font-mono">
                  -{stats.shutdownsPerSec}/sec
                </span>
              </div>
            </div>

            {/* Net Swarm Growth Today */}
            <div className="flex items-center justify-between border-t pt-3 border-gray-200 dark:border-gray-800/80 bg-emerald-500/5 -mx-2 px-2 py-2 rounded">
              <div>
                <span className="block text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1">
                  <ArrowUp className="w-3.5 h-3.5 text-emerald-600" />
                  Net Swarm Growth Today
                </span>
                <span className="block text-[11px] text-gray-500 dark:text-gray-400">
                  Active net increase in planetary agent count
                </span>
              </div>
              <div className="text-right">
                <span
                  className={`text-xl sm:text-2xl font-black font-mono tabular-nums ${
                    isLight ? 'text-[#006600]' : 'text-cyan-400'
                  }`}
                >
                  +{Math.floor(stats.netGrowthToday).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Tool Invocations Rate */}
            <div className="flex items-center justify-between border-t pt-3 border-gray-200 dark:border-gray-800/80">
              <div>
                <span className="block text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  Autonomous Tool Velocity
                </span>
                <span className="block text-[11px] text-gray-500 dark:text-gray-400">
                  Sub-second MCP tool calls &amp; code execution loops
                </span>
              </div>
              <div className="text-right">
                <span className="text-base font-bold font-mono text-amber-600 dark:text-amber-400">
                  ~{stats.toolInvocationsPerSec.toLocaleString()} / sec
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: This Year */}
        <div
          className={`rounded-lg p-5 border transition-all ${
            isLight
              ? 'bg-[#f8f9fa] border-gray-300 shadow-xs'
              : 'bg-[#0d1222] border-gray-800 shadow-xl shadow-black/50'
          }`}
        >
          <div className="flex items-center justify-between border-b pb-3 mb-4 border-gray-200 dark:border-gray-800">
            <h2
              className={`text-base font-bold uppercase tracking-wider ${
                isLight ? 'text-gray-800' : 'text-purple-300'
              }`}
            >
              This Year (2026)
            </h2>
            <span className="text-[11px] font-mono text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded font-medium">
              TIER MILESTONES
            </span>
          </div>

          <div className="space-y-4">
            {/* Agents Created This Year */}
            <div className="flex items-center justify-between">
              <div>
                <span className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Agents Created This Year
                </span>
                <span className="block text-[11px] text-gray-500 dark:text-gray-400">
                  Cumulative annual instances registered
                </span>
              </div>
              <div className="text-right">
                <span
                  className={`text-xl sm:text-2xl font-bold font-mono tabular-nums ${
                    isLight ? 'text-[#006600]' : 'text-emerald-400'
                  }`}
                >
                  {Math.floor(stats.agentsCreatedYear).toLocaleString()}
                </span>
              </div>
            </div>

            {/* AGI & ASI Promotions */}
            <div className="grid grid-cols-2 gap-3 border-t pt-3 border-gray-200 dark:border-gray-800/80">
              <div className="bg-emerald-50 dark:bg-emerald-950/40 p-2.5 rounded border border-emerald-200 dark:border-emerald-900/60">
                <span className="block text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 uppercase">
                  AGI Multi-Step Graphs
                </span>
                <span className="text-lg font-bold font-mono text-emerald-700 dark:text-emerald-400">
                  {stats.agiAgents.toLocaleString()}
                </span>
                <span className="block text-[10px] text-gray-500">Multi-turn reasoning &amp; tools</span>
              </div>

              <div className="bg-purple-50 dark:bg-purple-950/40 p-2.5 rounded border border-purple-200 dark:border-purple-900/60">
                <span className="block text-[11px] font-semibold text-purple-800 dark:text-purple-300 uppercase">
                  ASI Swarm Clusters
                </span>
                <span className="text-lg font-bold font-mono text-purple-700 dark:text-purple-400">
                  {stats.asiAgents.toLocaleString()}
                </span>
                <span className="block text-[10px] text-gray-500">Distributed multi-agent teams</span>
              </div>
            </div>

            {/* Regulated High-Assurance Enclaves */}
            <div className="flex items-center justify-between border-t pt-3 border-gray-200 dark:border-gray-800/80">
              <div>
                <span className="block text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Regulated Enclaves
                </span>
                <span className="block text-[11px] text-gray-500 dark:text-gray-400">
                  Human steward quorum &amp; safety critical enclaves
                </span>
              </div>
              <div className="text-right">
                <span className="text-base font-bold font-mono text-amber-600 dark:text-amber-400">
                  {stats.apexAgents.toLocaleString()} Nodes
                </span>
              </div>
            </div>

            {/* Swarm Intelligence Index */}
            <div className="flex items-center justify-between border-t pt-3 border-gray-200 dark:border-gray-800/80 bg-purple-500/5 -mx-2 px-2 py-2 rounded">
              <div>
                <span className="block text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-purple-500" />
                  Swarm Intelligence Index
                </span>
                <span className="block text-[11px] text-gray-500 dark:text-gray-400">
                  Multi-agent collaborative efficiency (0.0 - 1.0)
                </span>
              </div>
              <div className="text-right">
                <span className="text-xl font-black font-mono text-purple-600 dark:text-purple-400">
                  {stats.swarmIntelligenceIndex} / 1.00
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
