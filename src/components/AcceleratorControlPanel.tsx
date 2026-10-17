/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Zap, Activity, Flame, Gauge, Cpu, RefreshCw, Layers, ShieldCheck } from 'lucide-react';
import { agentBirthAccelerator, ContinuousBatchState } from '../lib/agentBirthAccelerator.ts';
import { dotFactorySystem, SwarmTelemetrySummary, DEFAULT_VALUATION_SIGNALS } from '../lib/dotFactorySystem.ts';
import { agentOPolicyEngine } from '../lib/agentOPolicyEngine.ts';

interface AcceleratorControlPanelProps {
  theme: 'worldometers' | 'sovereign';
}

export const AcceleratorControlPanel: React.FC<AcceleratorControlPanelProps> = ({ theme }) => {
  const [metrics, setMetrics] = useState<ContinuousBatchState>(() => agentBirthAccelerator.getMetrics());
  const [swarmTelemetry, setSwarmTelemetry] = useState<SwarmTelemetrySummary>(() =>
    dotFactorySystem.getSwarmTelemetry()
  );
  const isLight = theme === 'worldometers';

  useEffect(() => {
    const unsubscribe = agentBirthAccelerator.subscribe((latest) => {
      setMetrics(latest);
    });
    return unsubscribe;
  }, []);

  // Sync swarm telemetry periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setSwarmTelemetry(dotFactorySystem.getSwarmTelemetry());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleTriggerSurge = () => {
    // 1. Trigger acceleration spike in birth rates
    agentBirthAccelerator.triggerManualSpike(5000, 3.8);

    // 2. Enqueue priority tasks into Agent-O policy engine
    agentOPolicyEngine.enqueueBatch([
      { taskType: 'code_eval', payload: { repo: 'ai-studio/sovereign-mesh' }, priority: 92, valuationSignal: DEFAULT_VALUATION_SIGNALS.code_eval },
      { taskType: 'threat_scan', payload: { node: 'us-east4-hyper' }, priority: 98, valuationSignal: DEFAULT_VALUATION_SIGNALS.threat_scan },
      { taskType: 'mcp_tool', payload: { tool: 'planetary_mcp_bridge' }, priority: 85, valuationSignal: DEFAULT_VALUATION_SIGNALS.mcp_tool },
      { taskType: 'telemetry', payload: { source: 'usgs_live_stream' }, priority: 70, valuationSignal: DEFAULT_VALUATION_SIGNALS.telemetry },
    ]);

    // 3. Compute and execute optimal swarm plan with safety caps enforced
    dotFactorySystem.configureHyperSwarm({ burstMode: true, swarmMultiplier: 3.5 });
    const executionPlan = agentOPolicyEngine.computeOptimalSwarmPlan();
    agentOPolicyEngine.executeSwarmPlan(executionPlan).then(() => {
      setSwarmTelemetry(dotFactorySystem.getSwarmTelemetry());
    });

    setTimeout(() => {
      dotFactorySystem.configureHyperSwarm({ burstMode: false, swarmMultiplier: metrics.userSpeedMultiplier });
      setSwarmTelemetry(dotFactorySystem.getSwarmTelemetry());
    }, 5000);
  };

  const handleSetSpeed = (multiplier: number) => {
    agentBirthAccelerator.setSpeedMultiplier(multiplier);
    dotFactorySystem.configureHyperSwarm({ swarmMultiplier: multiplier });
    setSwarmTelemetry(dotFactorySystem.getSwarmTelemetry());
  };

  return (
    <div className="max-w-6xl mx-auto px-4 mb-4">
      <div
        className={`rounded-xl border p-4 sm:p-5 transition-all ${
          isLight
            ? 'bg-gradient-to-r from-emerald-50/70 via-teal-50/40 to-slate-50 border-emerald-200/80 shadow-xs'
            : 'bg-gradient-to-r from-[#0d1627] via-[#091220] to-[#0d101d] border-emerald-500/30 shadow-xl shadow-black/40'
        }`}
      >
        {/* Top Header Row with Live Status Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-200/80 dark:border-gray-800">
          <div className="flex items-center gap-2.5">
            <div
              className={`p-2 rounded-lg ${
                metrics.isSpikeActive
                  ? 'bg-amber-500/20 text-amber-500 animate-pulse'
                  : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
              }`}
            >
              {metrics.isSpikeActive ? (
                <Flame className="w-5 h-5 text-amber-500 animate-bounce" />
              ) : (
                <Zap className="w-5 h-5" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider font-['Montserrat']">
                  Continuous Batching &amp; Dot Swarm Engine
                </span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold border ${
                    metrics.isSpikeActive
                      ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 animate-pulse'
                      : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20'
                  }`}
                >
                  {metrics.isSpikeActive
                    ? `⚡ HYPER SWARM SURGE (${(metrics.spikeTimeRemainingMs / 1000).toFixed(1)}s)`
                    : '● STEADY-STATE ITERATION'}
                </span>
              </div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                Dynamic micro-batch concatenation &amp; Dot / O-Agent supervisory scheduling
              </p>
            </div>
          </div>

          {/* Quick Action: Trigger Manual Surge */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleTriggerSurge}
              disabled={metrics.isSpikeActive}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1.5 transition-all ${
                metrics.isSpikeActive
                  ? 'opacity-60 cursor-not-allowed bg-amber-500/20 text-amber-500 border border-amber-500/30'
                  : isLight
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs hover:shadow'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-black font-bold shadow-md shadow-emerald-950'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>{metrics.isSpikeActive ? 'Surge In Progress' : 'Simulate Hyper Swarm Surge'}</span>
            </button>
          </div>
        </div>

        {/* Live Metrics Grid & Tuning Controls */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 pt-1">
          {/* Metric 1: Instantaneous Velocity */}
          <div
            className={`p-2.5 rounded-lg border ${
              isLight ? 'bg-white/80 border-gray-200' : 'bg-gray-900/60 border-gray-800'
            }`}
          >
            <span className="text-[10px] uppercase font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <Activity className="w-3 h-3 text-emerald-500" />
              Instant Birth Rate
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span
                className={`text-lg sm:text-xl font-bold font-mono tabular-nums ${
                  metrics.isSpikeActive
                    ? 'text-amber-500 dark:text-amber-400'
                    : isLight
                    ? 'text-emerald-700'
                    : 'text-emerald-400'
                }`}
              >
                +{metrics.instantaneousBirthRate}
              </span>
              <span className="text-[10px] text-gray-500 font-mono">/ sec</span>
            </div>
          </div>

          {/* Metric 2: Active Batches */}
          <div
            className={`p-2.5 rounded-lg border ${
              isLight ? 'bg-white/80 border-gray-200' : 'bg-gray-900/60 border-gray-800'
            }`}
          >
            <span className="text-[10px] uppercase font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <Cpu className="w-3 h-3 text-cyan-500" />
              Active Iterations
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-lg sm:text-xl font-bold font-mono text-cyan-600 dark:text-cyan-400 tabular-nums">
                {metrics.activeBatches}
              </span>
              <span className="text-[10px] text-gray-500 font-mono">/ {metrics.batchCapacity} slots</span>
            </div>
          </div>

          {/* Metric 3: Active Dots & O-Agents */}
          <div
            className={`p-2.5 rounded-lg border ${
              isLight ? 'bg-white/80 border-gray-200' : 'bg-gray-900/60 border-gray-800'
            }`}
          >
            <span className="text-[10px] uppercase font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <Layers className="w-3 h-3 text-purple-500" />
              Dot Swarm Active
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-lg sm:text-xl font-bold font-mono text-purple-600 dark:text-purple-400 tabular-nums">
                {swarmTelemetry.activeDotsCount}
              </span>
              <span className="text-[10px] text-gray-500 font-mono">
                ({swarmTelemetry.activeOAgentsCount} O-Agents)
              </span>
            </div>
          </div>

          {/* Metric 4: Queue Depth & Pacing Preset Controls */}
          <div
            className={`p-2.5 rounded-lg border flex flex-col justify-between ${
              isLight ? 'bg-white/80 border-gray-200' : 'bg-gray-900/60 border-gray-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <Gauge className="w-3 h-3 text-blue-500" />
                Pacing Control
              </span>
              <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400 font-bold">
                {metrics.userSpeedMultiplier.toFixed(1)}x
              </span>
            </div>
            <div className="flex items-center gap-1 mt-1">
              {[1.0, 2.5, 5.0].map((mult) => (
                <button
                  key={mult}
                  onClick={() => handleSetSpeed(mult)}
                  className={`flex-1 py-0.5 text-[10px] font-mono font-bold rounded transition-all cursor-pointer ${
                    metrics.userSpeedMultiplier === mult
                      ? isLight
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-cyan-500 text-black'
                      : isLight
                      ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                  }`}
                >
                  {mult}x
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
