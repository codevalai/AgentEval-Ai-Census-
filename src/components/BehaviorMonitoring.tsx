/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Gauge, Shield, Cpu, Activity, UserCheck, AlertOctagon } from 'lucide-react';
import { BehaviorDomain, CensusStats } from '../types/census.ts';
import { BEHAVIOR_DOMAINS } from '../data/initialData.ts';

interface BehaviorMonitoringProps {
  stats: CensusStats;
  theme: 'worldometers' | 'sovereign';
}

export const BehaviorMonitoring: React.FC<BehaviorMonitoringProps> = ({
  stats,
  theme,
}) => {
  const isLight = theme === 'worldometers';

  return (
    <section id="behavior-monitoring" className="max-w-6xl mx-auto px-4 my-8 scroll-mt-20">
      <div
        className={`rounded-lg border overflow-hidden transition-all ${
          isLight
            ? 'bg-white border-gray-300 shadow-xs'
            : 'bg-[#0d1222] border-gray-800 shadow-xl'
        }`}
      >
        {/* Header */}
        <div
          className={`p-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
            isLight ? 'bg-gray-50 border-gray-200' : 'bg-[#090d1a] border-gray-800'
          }`}
        >
          <div>
            <div className="flex items-center gap-2">
              <Gauge className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h2
                className={`text-lg font-bold ${
                  isLight ? 'text-gray-900' : 'text-white'
                }`}
              >
                Real-Time AI Behavior Monitoring &amp; Domain Containment
              </h2>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Planetary autonomy indices, MCP tool invocation velocity, and air-gapped critical infrastructure sandboxes
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-[10px] text-gray-400 uppercase font-mono">Global Autonomy Index</div>
              <div className="text-lg font-black font-mono text-blue-600 dark:text-cyan-400">
                {stats.globalAutonomyIndex} <span className="text-xs font-normal text-gray-400">/ 10.0</span>
              </div>
            </div>
            <div className="text-right border-l pl-3 border-gray-200 dark:border-gray-800">
              <div className="text-[10px] text-gray-400 uppercase font-mono">Tool Velocity</div>
              <div className="text-lg font-black font-mono text-amber-600 dark:text-amber-400">
                ~{stats.toolInvocationsPerSec.toLocaleString()} <span className="text-xs font-normal text-gray-400">/s</span>
              </div>
            </div>
          </div>
        </div>

        {/* Domain Isolation Matrix Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr
                className={`border-b text-[11px] uppercase tracking-wider font-semibold ${
                  isLight
                    ? 'bg-gray-100 text-gray-700 border-gray-300'
                    : 'bg-gray-900/90 text-gray-400 border-gray-800'
                }`}
              >
                <th className="py-2.5 px-3">High-Risk Sociotechnical Domain</th>
                <th className="py-2.5 px-3">Risk Classification</th>
                <th className="py-2.5 px-3 text-right">Domain Autonomy</th>
                <th className="py-2.5 px-3 text-right">Tool Velocity</th>
                <th className="py-2.5 px-3">Isolation Sandbox Protocol</th>
                <th className="py-2.5 px-3 text-center">Human-in-the-Loop</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {BEHAVIOR_DOMAINS.map((domain) => {
                const isExtreme = domain.riskLevel === 'EXTREME';
                const isAirGapped = domain.isolationStatus === 'AIR_GAPPED';

                return (
                  <tr
                    key={domain.domain}
                    className={`transition-colors ${
                      isLight ? 'hover:bg-gray-50' : 'hover:bg-gray-800/40'
                    }`}
                  >
                    <td className="py-2.5 px-3 font-medium text-gray-900 dark:text-gray-100">
                      {domain.domain}
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                          isExtreme
                            ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                            : domain.riskLevel === 'HIGH'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                        }`}
                      >
                        {domain.riskLevel}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-gray-800 dark:text-gray-200">
                      {domain.autonomyScore.toFixed(2)} / 10
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-gray-600 dark:text-gray-400">
                      {domain.toolVelocity.toLocaleString()} /s
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                          isAirGapped
                            ? 'bg-purple-50 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border-purple-300 dark:border-purple-800'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-300 dark:border-gray-700'
                        }`}
                      >
                        {domain.isolationStatus}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      {domain.humanInTheLoopActive ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                          <UserCheck className="w-3.5 h-3.5" /> Enforced
                        </span>
                      ) : (
                        <span className="text-gray-400 text-[11px]">Autonomous</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
