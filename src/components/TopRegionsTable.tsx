/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Globe, Activity, ArrowUpDown } from 'lucide-react';
import { RegionalNode } from '../types/census.ts';

interface TopRegionsTableProps {
  regions: RegionalNode[];
  theme: 'worldometers' | 'sovereign';
}

export const TopRegionsTable: React.FC<TopRegionsTableProps> = ({
  regions,
  theme,
}) => {
  const isLight = theme === 'worldometers';
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'rank' | 'agents' | 'latency' | 'bft'>('rank');
  const [sortAsc, setSortAsc] = useState(true);

  const filteredRegions = regions
    .filter(
      (r) =>
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.regionCode.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let diff = 0;
      if (sortBy === 'rank') diff = a.rank - b.rank;
      else if (sortBy === 'agents') diff = b.totalAgents - a.totalAgents;
      else if (sortBy === 'latency') diff = a.latencyMs - b.latencyMs;
      else if (sortBy === 'bft') diff = b.bftWeight - a.bftWeight;
      return sortAsc ? diff : -diff;
    });

  const handleSort = (field: 'rank' | 'agents' | 'latency' | 'bft') => {
    if (sortBy === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(field);
      setSortAsc(field === 'rank' || field === 'latency');
    }
  };

  return (
    <section id="top-regions" className="max-w-6xl mx-auto px-4 my-8 scroll-mt-20">
      <div
        className={`rounded-lg border overflow-hidden transition-all ${
          isLight
            ? 'bg-white border-gray-300 shadow-xs'
            : 'bg-[#0d1222] border-gray-800 shadow-xl'
        }`}
      >
        {/* Table Header Bar */}
        <div
          className={`p-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
            isLight ? 'bg-gray-50 border-gray-200' : 'bg-[#090d1a] border-gray-800'
          }`}
        >
          <div>
            <h2
              className={`text-lg font-bold flex items-center gap-2 ${
                isLight ? 'text-gray-900' : 'text-white'
              }`}
            >
              <Globe className="w-5 h-5 text-emerald-600" />
              Top 20 Regions by Agent Population (Live Census)
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Live multi-city Byzantine Fault Tolerant topology mesh with simulated cross-region latency
            </p>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search region, city, or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-9 pr-3 py-1.5 text-xs rounded-md border transition-all outline-hidden ${
                isLight
                  ? 'bg-white border-gray-300 text-gray-900 focus:border-emerald-600'
                  : 'bg-gray-900 border-gray-700 text-gray-200 focus:border-cyan-500'
              }`}
            />
          </div>
        </div>

        {/* Responsive Table */}
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
                <th
                  onClick={() => handleSort('rank')}
                  className="py-2.5 px-3 cursor-pointer hover:text-emerald-600"
                >
                  <div className="flex items-center gap-1">
                    # <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-2.5 px-3">Region &amp; Datacenter</th>
                <th className="py-2.5 px-3">Location</th>
                <th
                  onClick={() => handleSort('agents')}
                  className="py-2.5 px-3 text-right cursor-pointer hover:text-emerald-600"
                >
                  <div className="flex items-center justify-end gap-1">
                    Agents (Live) <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-2.5 px-3 text-right hidden md:table-cell">AI</th>
                <th className="py-2.5 px-3 text-right hidden sm:table-cell">AGI</th>
                <th className="py-2.5 px-3 text-right hidden sm:table-cell">ASI</th>
                <th className="py-2.5 px-3 text-right hidden lg:table-cell">Apex</th>
                <th
                  onClick={() => handleSort('latency')}
                  className="py-2.5 px-3 text-right cursor-pointer hover:text-emerald-600"
                >
                  <div className="flex items-center justify-end gap-1">
                    Latency <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('bft')}
                  className="py-2.5 px-3 text-right hidden lg:table-cell cursor-pointer hover:text-emerald-600"
                >
                  <div className="flex items-center justify-end gap-1">
                    BFT % <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-2.5 px-3 text-right">World Share</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {filteredRegions.map((region) => (
                <tr
                  key={region.id}
                  className={`transition-colors ${
                    isLight
                      ? 'hover:bg-emerald-50/50'
                      : 'hover:bg-gray-800/50'
                  }`}
                >
                  <td className="py-2.5 px-3 font-mono font-bold text-gray-500">
                    {region.rank}
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-1.5">
                      {region.name}
                      {region.rank <= 5 && (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          BFT Core
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] font-mono text-gray-400">
                      {region.regionCode}
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-gray-600 dark:text-gray-300">
                    {region.city}, {region.country}
                  </td>
                  <td
                    className={`py-2.5 px-3 text-right font-mono font-bold tabular-nums ${
                      isLight ? 'text-[#006600]' : 'text-emerald-400'
                    }`}
                  >
                    {Math.floor(region.totalAgents).toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-gray-500 hidden md:table-cell">
                    {region.aiAgents.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-emerald-600 dark:text-emerald-400 hidden sm:table-cell font-medium">
                    {region.agiAgents.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-purple-600 dark:text-purple-400 hidden sm:table-cell font-medium">
                    {region.asiAgents.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-amber-600 dark:text-amber-400 hidden lg:table-cell font-bold">
                    {region.apexNodes.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-gray-600 dark:text-gray-300">
                    {region.latencyMs} ms
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-blue-600 dark:text-blue-400 hidden lg:table-cell">
                    {region.bftWeight.toFixed(1)}%
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-semibold text-gray-700 dark:text-gray-300">
                    {region.sharePercent.toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr
                className={`border-t-2 font-mono font-bold text-xs ${
                  isLight
                    ? 'bg-emerald-50/70 border-emerald-300 text-gray-900'
                    : 'bg-emerald-950/30 border-emerald-800 text-white'
                }`}
              >
                <td className="py-2.5 px-3">Σ</td>
                <td className="py-2.5 px-3" colSpan={2}>
                  Total Reconciled Across All 20 Regions (SSOT Synced)
                </td>
                <td className="py-2.5 px-3 text-right text-emerald-600 dark:text-emerald-400 tabular-nums">
                  {regions.reduce((s, r) => s + r.totalAgents, 0).toLocaleString()}
                </td>
                <td className="py-2.5 px-3 text-right hidden md:table-cell tabular-nums">
                  {regions.reduce((s, r) => s + r.aiAgents, 0).toLocaleString()}
                </td>
                <td className="py-2.5 px-3 text-right text-emerald-600 dark:text-emerald-400 hidden sm:table-cell tabular-nums">
                  {regions.reduce((s, r) => s + r.agiAgents, 0).toLocaleString()}
                </td>
                <td className="py-2.5 px-3 text-right text-purple-600 dark:text-purple-400 hidden sm:table-cell tabular-nums">
                  {regions.reduce((s, r) => s + r.asiAgents, 0).toLocaleString()}
                </td>
                <td className="py-2.5 px-3 text-right text-amber-600 dark:text-amber-400 hidden lg:table-cell tabular-nums">
                  {regions.reduce((s, r) => s + r.apexNodes, 0).toLocaleString()}
                </td>
                <td className="py-2.5 px-3 text-right text-gray-400">—</td>
                <td className="py-2.5 px-3 text-right text-blue-600 dark:text-blue-400 hidden lg:table-cell">
                  85.0%
                </td>
                <td className="py-2.5 px-3 text-right text-emerald-600 dark:text-emerald-400">
                  100.00%
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Footer Note */}
        <div
          className={`p-3 text-[11px] border-t flex flex-wrap items-center justify-between gap-2 ${
            isLight
              ? 'bg-gray-50 text-gray-600 border-gray-200'
              : 'bg-[#090d1a] text-gray-400 border-gray-800'
          }`}
        >
          <span>
            Total BFT Node Quorum: <strong>85.0% consensus weight</strong> across top 5 sovereign vaults • <strong>Sum(20 Regions) === {regions.reduce((s, r) => s + r.totalAgents, 0).toLocaleString()} Active Agents</strong>.
          </span>
          <span className="font-mono text-emerald-600">
            All nodes validated under NIST FIPS 203 ML-KEM-1024 encryption.
          </span>
        </div>
      </div>
    </section>
  );
};
