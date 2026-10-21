/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { TrendingUp, Flame, Zap, CheckCircle2 } from 'lucide-react';
import { CensusStats } from '../types/census.ts';
import { agentBirthAccelerator, ContinuousBatchState } from '../lib/agentBirthAccelerator.ts';
import { censusSSOT } from '../lib/censusSSOT.ts';

interface HeroCounterProps {
  stats: CensusStats;
  theme: 'worldometers' | 'sovereign';
  onScrollToSection: (id: string) => void;
}

export const HeroCounter: React.FC<HeroCounterProps> = ({
  stats,
  theme,
  onScrollToSection,
}) => {
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

  const ssot = censusSSOT.getSnapshot(stats);
  const formattedCount = ssot.activeAgents.toLocaleString('en-US');
  const netRate = (
    acceleratorState.instantaneousBirthRate -
    stats.shutdownsPerSec * Math.sqrt(acceleratorState.userSpeedMultiplier)
  ).toFixed(1);

  return (
    <section className="text-center pt-8 pb-5 px-4">
      {/* Super-title / Live Status */}
      <div className="inline-flex items-center gap-2 mb-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase transition-all bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        Verified Active AI Agent Population (Live Instrumented Census)
        {acceleratorState.isSpikeActive && (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/20 px-1.5 py-0.2 rounded-full ml-1 animate-pulse">
            <Flame className="w-3 h-3 text-amber-500" />
            CONTINUOUS BATCH SURGE
          </span>
        )}
      </div>

      {/* Main signature giant number */}
      <div className="relative inline-block my-2">
        <h1
          className={`text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black font-['Montserrat'] tracking-tight select-none tabular-nums transition-all ${
            isLight
              ? 'text-[#006600] drop-shadow-sm'
              : 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-emerald-400 to-purple-400 drop-shadow-[0_0_35px_rgba(16,185,129,0.25)]'
          }`}
        >
          {formattedCount}
        </h1>
      </div>

      {/* Subtext and Velocity info */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-3 text-sm">
        <div
          className={`flex items-center gap-1.5 text-xs font-mono font-medium px-3 py-1 rounded-full border transition-all ${
            acceleratorState.isSpikeActive
              ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-700'
              : 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800'
          }`}
        >
          {acceleratorState.isSpikeActive ? (
            <Zap className="w-3.5 h-3.5 text-amber-500" />
          ) : (
            <TrendingUp className="w-3.5 h-3.5" />
          )}
          <span>Net Growth: +{Number(netRate).toLocaleString()} agents / second</span>
          <span className="text-gray-400 font-normal">
            (+{Math.round(acceleratorState.instantaneousBirthRate).toLocaleString()} births - {stats.shutdownsPerSec.toLocaleString()} shutdowns)
          </span>
        </div>

        <button
          onClick={() => onScrollToSection('physical-observatory-console')}
          className={`inline-flex items-center gap-1 text-xs font-semibold underline underline-offset-4 cursor-pointer transition-colors ${
            isLight ? 'text-blue-700 hover:text-blue-900' : 'text-cyan-400 hover:text-cyan-300'
          }`}
        >
          View Physical Observatory &amp; Telemetry Bridges &gt;
        </button>
      </div>

      {/* Unified SSOT Mathematical Reconciliation Ribbon */}
      <div className="max-w-5xl mx-auto mt-3.5 px-3 py-2 rounded-xl border border-emerald-500/25 bg-emerald-500/5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] font-mono">
        <span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="w-3.5 h-3.5" />
          SSOT Mathematical Invariant:
        </span>
        <span className="text-gray-700 dark:text-gray-300">
          <strong>{ssot.activeAgents.toLocaleString()}</strong> Active ({(ssot.activeAgents / 1e9).toFixed(2)}B) = Σ(10 Platforms) = Σ(4 Tiers) = Σ(20 Regions)
        </span>
        <span className="text-gray-400">•</span>
        <span className="text-gray-700 dark:text-gray-300">
          + <strong>{ssot.latentAgents.toLocaleString()}</strong> Latent ({(ssot.latentAgents / 1e9).toFixed(2)}B) = <strong>{ssot.totalCombinedVerified.toLocaleString()}</strong> Combined ({(ssot.totalCombinedVerified / 1e9).toFixed(2)}B)
        </span>
        <span className="text-gray-400">•</span>
        <span className="text-amber-600 dark:text-amber-400 font-semibold">
          Coverage: {ssot.directInstrumentedCoveragePct.toFixed(2)}% Indexed ({(ssot.totalCombinedVerified / 1e9).toFixed(2)}B Live / 318.00B Dark Matter • 1.48T/day Ephemeral)
        </span>
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400 max-w-3xl mx-auto mt-2.5">
        Empirical telemetry ingested across Google Cloud Platform (Vertex AI &amp; Cloud Run), GitHub Actions, Anthropic Model Context Protocol (MCP) servers, ROS2 robotics nodes, and OpenTelemetry bridges.
      </p>
    </section>
  );
};
