/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Activity, ShieldCheck, Sparkles, Database, Trash2, ArrowUpRight } from 'lucide-react';
import { LiveEventItem } from '../types/census.ts';

interface LiveEventFeedProps {
  events: LiveEventItem[];
  theme: 'worldometers' | 'sovereign';
}

export const LiveEventFeed: React.FC<LiveEventFeedProps> = ({ events, theme }) => {
  const isLight = theme === 'worldometers';

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 border-t py-1.5 px-4 text-xs backdrop-blur-md transition-colors ${
        isLight
          ? 'bg-white/95 border-gray-200 text-gray-800 shadow-md'
          : 'bg-[#060810]/95 border-gray-800 text-gray-200 shadow-2xl'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 overflow-hidden">
        <div className="flex items-center gap-2 shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
          <span className="font-bold text-[11px] uppercase tracking-wider font-mono text-emerald-600">
            EVENT FABRIC:
          </span>
        </div>

        <div className="flex-1 overflow-x-auto whitespace-nowrap scrollbar-none flex items-center gap-6 text-[11px] font-mono">
          {events.map((evt) => {
            let icon = <Sparkles className="w-3.5 h-3.5 text-blue-500 shrink-0 inline mr-1" />;
            if (evt.type === 'DEFENSE') {
              icon = <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0 inline mr-1" />;
            } else if (evt.type === 'HARVEST') {
              icon = <Database className="w-3.5 h-3.5 text-cyan-500 shrink-0 inline mr-1" />;
            } else if (evt.type === 'TOMBSTONE') {
              icon = <Trash2 className="w-3.5 h-3.5 text-amber-500 shrink-0 inline mr-1" />;
            }

            return (
              <div key={evt.id} className="inline-flex items-center gap-1.5 shrink-0">
                {icon}
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {evt.title}
                </span>
                <span className="text-gray-500 dark:text-gray-400">
                  {evt.detail}
                </span>
                <span className="text-[10px] text-purple-600 dark:text-purple-400">
                  [{evt.merkleLeaf.slice(0, 10)}]
                </span>
                <span className="text-gray-400 text-[10px] ml-1">
                  • {evt.timestamp}
                </span>
              </div>
            );
          })}
        </div>

        <div className="text-[11px] text-gray-400 hidden lg:block shrink-0 font-mono">
          Monotonic Merkle Spine v4.12
        </div>
      </div>
    </div>
  );
};
