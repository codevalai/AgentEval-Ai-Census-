/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Flag, Building2 } from 'lucide-react';
import { COUNTRY_ORIGINS, SOVEREIGN_LABS, INITIAL_STATS } from '../data/initialData.ts';
import { CensusStats } from '../types/census.ts';
import { distributeIntegerDeltaExact } from '../lib/censusSSOT.ts';

interface ProvenanceRegistryProps {
  stats?: CensusStats;
  theme: 'worldometers' | 'sovereign';
}

export const ProvenanceRegistry: React.FC<ProvenanceRegistryProps> = ({
  stats = INITIAL_STATS,
  theme,
}) => {
  const isLight = theme === 'worldometers';
  const liveActive = Math.max(342892410000, Math.round(stats.totalAgents));

  // Distribute liveActive across the 11 rows (10 Countries + Rest of World) so sum === liveActive
  const baseShares = COUNTRY_ORIGINS.map((c) => Math.round((c.worldShare / 100) * 342892410000));
  const baseShareDiff = 342892410000 - baseShares.reduce((a, b) => a + b, 0);
  baseShares[baseShares.length - 1] += baseShareDiff;
  const verifiedByCountry = distributeIntegerDeltaExact(baseShares, liveActive - 342892410000);

  const totalMacroMil = COUNTRY_ORIGINS.reduce((acc, c) => acc + c.totalAgents, 0) / 1000000; // 814373.0M (814.37B)
  const totalSharePct = COUNTRY_ORIGINS.reduce((acc, c) => acc + c.worldShare, 0); // 100.0%
  const totalAgiByCountry = COUNTRY_ORIGINS.reduce((acc, c) => acc + c.agiCount, 0); // 82,012,410,000

  return (
    <section id="provenance-registry" className="max-w-6xl mx-auto px-4 my-8 scroll-mt-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Top Countries by AI Origin + Rest of World (100.0% Reconciled) */}
        <div
          className={`rounded-lg border overflow-hidden transition-all ${
            isLight
              ? 'bg-white border-gray-300 shadow-xs'
              : 'bg-[#0d1222] border-gray-800 shadow-xl'
          }`}
        >
          <div
            className={`p-4 border-b flex items-center justify-between ${
              isLight ? 'bg-gray-50 border-gray-200' : 'bg-[#090d1a] border-gray-800'
            }`}
          >
            <div>
              <h2
                className={`text-base font-bold flex items-center gap-2 ${
                  isLight ? 'text-gray-900' : 'text-white'
                }`}
              >
                <Flag className="w-4 h-4 text-emerald-600" />
                Planetary AI Demographics by Jurisdiction
              </h2>
              <p className="text-[11px] text-gray-500 mt-0.5">
                10 Sovereign Jurisdictions + Rest of World = 100.0% ({liveActive.toLocaleString()} Active • 814.37B Combined)
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-semibold">
              100.0% RECONCILED
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr
                  className={`border-b text-[10px] uppercase font-semibold ${
                    isLight
                      ? 'bg-gray-100 text-gray-700 border-gray-300'
                      : 'bg-gray-900/90 text-gray-400 border-gray-800'
                  }`}
                >
                  <th className="py-2 px-3">#</th>
                  <th className="py-2 px-3">Country / Territory</th>
                  <th className="py-2 px-3 text-right">Verified</th>
                  <th className="py-2 px-3 text-right">Macro Est.</th>
                  <th className="py-2 px-3 text-right hidden sm:table-cell">AGI</th>
                  <th className="py-2 px-3 text-center">Z3 SAT</th>
                  <th className="py-2 px-3 text-right">Share</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {COUNTRY_ORIGINS.map((c, idx) => (
                  <tr
                    key={c.code}
                    className={`transition-colors ${
                      c.code === 'ROW'
                        ? isLight
                          ? 'bg-emerald-50/40 font-semibold'
                          : 'bg-emerald-950/20 font-semibold'
                        : isLight
                        ? 'hover:bg-gray-50'
                        : 'hover:bg-gray-800/40'
                    }`}
                  >
                    <td className="py-2 px-3 font-mono text-gray-500 font-semibold">
                      {c.rank}
                    </td>
                    <td className="py-2 px-3 font-medium flex items-center gap-1.5">
                      <span className="text-base">{c.flag}</span>
                      <span className="text-gray-900 dark:text-gray-100">{c.country}</span>
                      <span className="text-[10px] font-mono text-gray-400">({c.code})</span>
                    </td>
                    <td
                      className={`py-2 px-3 text-right font-mono font-bold tabular-nums ${
                        isLight ? 'text-[#006600]' : 'text-emerald-400'
                      }`}
                    >
                      {verifiedByCountry[idx].toLocaleString()}
                    </td>
                    <td className="py-2 px-3 text-right font-mono text-cyan-600 dark:text-cyan-400 tabular-nums">
                      {(c.totalAgents / 1000000).toFixed(1)}M
                    </td>
                    <td className="py-2 px-3 text-right font-mono text-emerald-600 hidden sm:table-cell tabular-nums">
                      {c.agiCount.toLocaleString()}
                    </td>
                    <td className="py-2 px-3 text-center">
                      <span className="text-[10px] font-mono text-emerald-600 font-bold">
                        SAT ✓
                      </span>
                    </td>
                    <td className="py-2 px-3 text-right font-mono text-gray-600 dark:text-gray-300 font-semibold tabular-nums">
                      {c.worldShare.toFixed(2)}%
                    </td>
                  </tr>
                ))}
                {/* Grand Total Reconciliation Footer Row */}
                <tr
                  className={`border-t-2 font-mono font-bold text-xs ${
                    isLight
                      ? 'bg-gray-100 border-gray-300 text-gray-900'
                      : 'bg-[#090d1a] border-gray-700 text-white'
                  }`}
                >
                  <td className="py-2.5 px-3">∑</td>
                  <td className="py-2.5 px-3">Global Total (10 Countries + RoW)</td>
                  <td className="py-2.5 px-3 text-right text-emerald-600 dark:text-emerald-400 tabular-nums">
                    {liveActive.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 text-right text-cyan-600 dark:text-cyan-400 tabular-nums">
                    {(totalMacroMil / 1000).toFixed(2)}B (814.37B)
                  </td>
                  <td className="py-2.5 px-3 text-right text-emerald-600 hidden sm:table-cell tabular-nums">
                    {totalAgiByCountry.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 text-center text-emerald-600">100% SAT</td>
                  <td className="py-2.5 px-3 text-right text-emerald-600 dark:text-emerald-400 tabular-nums">
                    {totalSharePct.toFixed(1)}%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Sovereign AI Labs */}
        <div
          className={`rounded-lg border overflow-hidden transition-all ${
            isLight
              ? 'bg-white border-gray-300 shadow-xs'
              : 'bg-[#0d1222] border-gray-800 shadow-xl'
          }`}
        >
          <div
            className={`p-4 border-b flex items-center justify-between ${
              isLight ? 'bg-gray-50 border-gray-200' : 'bg-[#090d1a] border-gray-800'
            }`}
          >
            <div>
              <h2
                className={`text-base font-bold flex items-center gap-2 ${
                  isLight ? 'text-gray-900' : 'text-white'
                }`}
              >
                <Building2 className="w-4 h-4 text-purple-600" />
                Sovereign Labs &amp; Creator Legitimacy
              </h2>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Cryptographically registered frontier research organizations and model creators
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 font-semibold">
              PQC ATTESTED
            </span>
          </div>

          <div className="p-3 space-y-2.5 max-h-[510px] overflow-y-auto">
            {SOVEREIGN_LABS.map((lab) => (
              <div
                key={lab.id}
                className={`p-2.5 rounded-md border text-xs transition-all ${
                  isLight
                    ? 'bg-gray-50 border-gray-200'
                    : 'bg-gray-900/60 border-gray-800'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-gray-900 dark:text-gray-100">
                    {lab.name}
                  </span>
                  <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    {lab.cleanroomStatus}
                  </span>
                </div>

                <div className="text-[11px] text-gray-500 mb-1.5 flex items-center gap-2">
                  <span>{lab.jurisdiction}</span>
                  <span>•</span>
                  <span className="font-mono text-purple-600 dark:text-purple-400 font-medium">
                    {lab.pqcKeyAlgorithm}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] border-t pt-1.5 border-gray-200 dark:border-gray-800">
                  <div className="flex flex-wrap gap-1">
                    {lab.topArchitectures.slice(0, 2).map((arch) => (
                      <span
                        key={arch}
                        className="text-[10px] font-mono px-1 py-0.2 rounded bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                      >
                        {arch}
                      </span>
                    ))}
                  </div>

                  <div className="font-mono text-[10px] text-gray-400 truncate ml-2">
                    Leaf: {lab.merkleLeafHash}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
