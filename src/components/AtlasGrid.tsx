/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BookOpen, Search, ExternalLink, ShieldCheck, CheckCircle2, ChevronRight, X } from 'lucide-react';
import { AtlasCategory } from '../types/census.ts';
import { ATLAS_CATEGORIES } from '../data/initialData.ts';

interface AtlasGridProps {
  theme: 'worldometers' | 'sovereign';
}

export const AtlasGrid: React.FC<AtlasGridProps> = ({ theme }) => {
  const isLight = theme === 'worldometers';
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<AtlasCategory | null>(null);

  const filtered = ATLAS_CATEGORIES.filter(
    (c) =>
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.categoryTag.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section id="atlas-grid" className="max-w-6xl mx-auto px-4 my-8 scroll-mt-20">
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
              <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h2
                className={`text-lg font-bold ${
                  isLight ? 'text-gray-900' : 'text-white'
                }`}
              >
                Planetary AI &amp; Tech Atlas (20 Categories • 400M+ Ingested Sources)
              </h2>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Comprehensive global registry spanning model hubs, robotics, runtime kernels, hardware accelerators, and research archives
            </p>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[200px]">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search 20 atlas categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-9 pr-3 py-1.5 text-xs rounded-md border transition-all outline-hidden ${
                isLight
                  ? 'bg-white border-gray-300 text-gray-900 focus:border-indigo-600'
                  : 'bg-gray-900 border-gray-700 text-gray-200 focus:border-cyan-500'
              }`}
            />
          </div>
        </div>

        {/* Categories 4-Column Grid */}
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {filtered.map((cat) => (
            <div
              key={cat.id}
              onClick={() => setSelectedCategory(cat)}
              className={`p-3 rounded-lg border text-xs cursor-pointer transition-all hover:-translate-y-0.5 flex flex-col justify-between ${
                isLight
                  ? 'bg-gray-50 border-gray-200 hover:border-indigo-400 hover:bg-indigo-50/20'
                  : 'bg-gray-900/60 border-gray-800 hover:border-indigo-500/60 hover:bg-indigo-950/30'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-[10px] font-mono text-gray-400 mb-1">
                  <span>CAT 0{cat.id <= 9 ? `0${cat.id}` : cat.id}</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    {cat.opennessPercent}% Open
                  </span>
                </div>

                <h3 className="font-bold text-xs text-gray-900 dark:text-gray-100 line-clamp-1 mb-1">
                  {cat.title}
                </h3>

                <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed mb-2">
                  {cat.description}
                </p>
              </div>

              <div className="border-t pt-2 border-gray-200 dark:border-gray-800 flex items-center justify-between">
                <div>
                  <span className="block text-[10px] text-gray-400">Indexed Depth:</span>
                  <span className="font-mono font-bold text-indigo-700 dark:text-indigo-400">
                    {cat.sourceCountFormatted}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-indigo-600">
                  <span>Inspect</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Inspection Modal */}
      {selectedCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            className={`w-full max-w-xl rounded-lg border p-5 shadow-2xl transition-all ${
              isLight ? 'bg-white border-gray-300 text-gray-900' : 'bg-[#0e1424] border-gray-700 text-gray-100'
            }`}
          >
            <div className="flex items-start justify-between border-b pb-3 mb-4 border-gray-200 dark:border-gray-800">
              <div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                  CATEGORY {selectedCategory.id} • {selectedCategory.categoryTag}
                </span>
                <h3 className="text-base font-bold mt-1">{selectedCategory.title}</h3>
              </div>
              <button
                onClick={() => setSelectedCategory(null)}
                className="p-1 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
              {selectedCategory.description}
            </p>

            <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
              <div className="p-2.5 rounded bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                <span className="block text-[10px] text-gray-400">Indexed Sources:</span>
                <span className="text-sm font-bold font-mono text-indigo-600 dark:text-indigo-400">
                  {selectedCategory.sourceCountFormatted}
                </span>
              </div>
              <div className="p-2.5 rounded bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                <span className="block text-[10px] text-gray-400">Ingestion Velocity:</span>
                <span className="text-sm font-bold font-mono text-emerald-600 dark:text-emerald-400">
                  {selectedCategory.ingestionRate}
                </span>
              </div>
            </div>

            <div className="mb-4">
              <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                Top Indexed Entities &amp; Platforms:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedCategory.topEntities.map((ent) => (
                  <span
                    key={ent}
                    className="text-xs font-mono px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700"
                  >
                    {ent}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                Key Ingestion Protocols:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedCategory.keyProtocols.map((p) => (
                  <span
                    key={p}
                    className="text-xs font-mono px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>

            <div className="border-t pt-3 border-gray-200 dark:border-gray-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-emerald-600">
                <ShieldCheck className="w-4 h-4" />
                <span>Zero-Patent Cleanroom Verified (RFC-001)</span>
              </div>

              <button
                onClick={() => setSelectedCategory(null)}
                className="px-3 py-1.5 rounded bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
