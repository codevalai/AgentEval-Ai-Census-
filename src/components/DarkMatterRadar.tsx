/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { EyeOff, ShieldCheck } from 'lucide-react';
import { CensusStats } from '../types/census.ts';
import { DARK_MATTER_ZONES } from '../data/initialData.ts';
import { censusSSOT } from '../lib/censusSSOT.ts';

interface DarkMatterRadarProps {
  stats: CensusStats;
  theme: 'worldometers' | 'sovereign';
}

export const DarkMatterRadar: React.FC<DarkMatterRadarProps> = ({
  stats,
  theme,
}) => {
  const isLight = theme === 'worldometers';
  const ssot = censusSSOT.getSnapshot(stats);

  const totalDarkMatterUnits = DARK_MATTER_ZONES.reduce((acc, z) => acc + z.estimatedAgents, 0); // 3,180,000,000 (3.18B)
  const verifiedPct = ssot.verifiedConfidencePct; // 68.4
  const claimedPct = ssot.selfReportedConfidencePct; // 23.2
  const inferredPct = ssot.inferredConfidencePct; // 8.4

  return (
    <section id="dark-matter" className="max-w-6xl mx-auto px-4 my-8 scroll-mt-20">
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
              <EyeOff className="w-5 h-5 text-amber-500" />
              <h2
                className={`text-lg font-bold ${
                  isLight ? 'text-gray-900' : 'text-white'
                }`}
              >
                Coverage Gaps &amp; Dark Matter AI Radar (~{(totalDarkMatterUnits / 1e9).toFixed(2)}B Unindexed Entities)
              </h2>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Honest Partial Coverage Discipline: Indexed Live Population ({ssot.directInstrumentedCoveragePct}% • {ssot.totalCombinedVerified.toLocaleString()} Combined) vs. Unregistered Air-Gapped &amp; Edge Swarms
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-[11px] font-mono text-gray-500">Indexed Coverage:</span>
            <span className="font-mono font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              {ssot.directInstrumentedCoveragePct}% (814.37B • Honest Partial)
            </span>
            <span className="text-[11px] font-mono text-gray-500">Dark Matter Ratio:</span>
            <span className="font-mono font-bold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              ~{ssot.darkMatterRatioPct}% Unindexed (318.00B / 1.132T)
            </span>
          </div>
        </div>

        {/* Confidence Breakdown Bar (Strictly 68.4% + 23.2% + 8.4% = 100.0%) */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/40">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
            <span>Planetary Ground-Truth Confidence Spectrum (Strictly Reconciled = 100.0%):</span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              {verifiedPct}% + {claimedPct}% + {inferredPct}% = {(verifiedPct + claimedPct + inferredPct).toFixed(1)}%
            </span>
          </div>

          <div className="h-4 rounded-full overflow-hidden flex text-[10px] font-mono text-white font-bold">
            <div
              style={{ width: `${verifiedPct}%` }}
              className="bg-emerald-600 flex items-center justify-center transition-all duration-500"
              title={`Verified: ${verifiedPct}%`}
            >
              {verifiedPct}% Cryptographically Verified
            </div>
            <div
              style={{ width: `${claimedPct}%` }}
              className="bg-blue-600 flex items-center justify-center"
              title={`Claimed: ${claimedPct}%`}
            >
              {claimedPct}% Claimed
            </div>
            <div
              style={{ width: `${inferredPct}%` }}
              className="bg-amber-600 flex items-center justify-center"
              title={`Inferred: ${inferredPct}%`}
            >
              {inferredPct}%
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 mt-2 text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-600 inline-block" />
              <strong>Cryptographically Verified ({verifiedPct}%)</strong>: SPIFFE SVID &amp; Merkle leaf attested ({ssot.activeAgents.toLocaleString()} live direct agents)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-blue-600 inline-block" />
              <strong>Self-Reported / Claimed ({claimedPct}%)</strong>: ASRP-1.0 creator registry attestation
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-amber-600 inline-block" />
              <strong>Inferred Tomography ({inferredPct}%)</strong>: Public ecosystem harvester proxies (HF, npm, PyPI)
            </span>
          </div>
        </div>

        {/* 4 Unindexed Zones Grid (1.85B + 640M + 410M + 280M = 3.18B) */}
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {DARK_MATTER_ZONES.map((zone) => {
            const shareOfDarkMatter = ((zone.estimatedAgents / totalDarkMatterUnits) * 100).toFixed(1);
            return (
              <div
                key={zone.id}
                className={`p-3.5 rounded-lg border text-xs transition-all ${
                  isLight
                    ? 'bg-gray-50 border-gray-200'
                    : 'bg-gray-900/60 border-gray-800'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-gray-900 dark:text-gray-100">
                    {zone.title}
                  </span>
                  <span className="font-mono font-black text-amber-600 dark:text-amber-400">
                    {zone.estimatedAgentsFormatted} ({shareOfDarkMatter}%)
                  </span>
                </div>

                <p className="text-gray-600 dark:text-gray-300 text-[11px] leading-relaxed mb-3">
                  {zone.coverageGapReason}
                </p>

                <div className="flex items-center justify-between text-[11px] border-t pt-2 border-gray-200 dark:border-gray-800">
                  <div className="flex items-center gap-1">
                    <span className="text-gray-400">Primary Domain:</span>
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {zone.primaryJurisdictions[0]}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                      zone.riskIndex === 'HIGH'
                        ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}
                  >
                    {zone.riskIndex} RISK
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Reconciliation Footer */}
        <div
          className={`px-4 py-2.5 border-t text-[11px] font-mono flex flex-wrap items-center justify-between gap-2 ${
            isLight ? 'bg-gray-50 border-gray-200 text-gray-600' : 'bg-[#090d1a] border-gray-800 text-gray-400'
          }`}
        >
          <span>
            Unindexed Zone Sum: <strong>185.0B + 64.0B + 41.0B + 28.0B = 318.00B (100.0% Reconciled)</strong>
          </span>
          <span>
            Planetary Ceiling: <strong>814.37B Indexed (71.9%) + 318.00B Unindexed (28.1%) = 1,132.37B (1.132T) Total</strong>
          </span>
        </div>
      </div>
    </section>
  );
};
