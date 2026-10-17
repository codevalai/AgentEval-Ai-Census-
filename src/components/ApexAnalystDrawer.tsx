/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Sparkles, Send, Bot, ShieldAlert, CheckCircle, ArrowRight } from 'lucide-react';
import { CensusStats } from '../types/census.ts';
import { runApexAnalyst, AnalystResponse } from '../lib/geminiAnalyst.ts';

interface ApexAnalystDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  stats: CensusStats;
  theme: 'worldometers' | 'sovereign';
}

export const ApexAnalystDrawer: React.FC<ApexAnalystDrawerProps> = ({
  isOpen,
  onClose,
  stats,
  theme,
}) => {
  if (!isOpen) return null;
  const isLight = theme === 'worldometers';

  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalystResponse | null>(null);

  const presets = [
    'Analyze Swarm Intelligence Spike',
    'Evaluate Defcon 2 Threat Vectors',
    'Audit Planetary Bias & Gaps',
    'Explain AGI vs ASI Promotion Dynamics',
  ];

  const handleQuery = async (queryText: string) => {
    if (!queryText.trim()) return;
    setIsLoading(true);
    setPrompt(queryText);
    const resp = await runApexAnalyst(queryText, stats, stats.defconLevel);
    setResult(resp);
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs">
      <div
        className={`w-full max-w-lg h-full border-l p-5 flex flex-col justify-between overflow-y-auto shadow-2xl transition-all ${
          isLight ? 'bg-white border-gray-300 text-gray-900' : 'bg-[#0b101e] border-gray-800 text-gray-100'
        }`}
      >
        <div>
          {/* Header */}
          <div className="flex items-start justify-between border-b pb-3 mb-4 border-gray-200 dark:border-gray-800">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h3 className="text-base font-bold">Apex Analyst • Swarm Intelligence Engine</h3>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Frontier demographic reasoning powered by Google Gemini (@google/genai)
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Preset Prompts */}
          <div className="mb-4">
            <span className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Preset Swarm Investigations:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {presets.map((p) => (
                <button
                  key={p}
                  onClick={() => handleQuery(p)}
                  disabled={isLoading}
                  className={`text-xs px-2.5 py-1.5 rounded-md border text-left cursor-pointer transition-all ${
                    isLight
                      ? 'bg-purple-50 text-purple-900 border-purple-200 hover:bg-purple-100'
                      : 'bg-purple-950/40 text-purple-300 border-purple-800/80 hover:bg-purple-900/60'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Analysis Result Card */}
          {result && (
            <div className="space-y-4 mb-4">
              <div
                className={`p-4 rounded-lg border text-xs leading-relaxed ${
                  isLight ? 'bg-gray-50 border-gray-200' : 'bg-gray-900/80 border-gray-800'
                }`}
              >
                <div className="flex items-center justify-between mb-2 pb-1 border-b border-gray-200 dark:border-gray-800">
                  <span className="font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                    <Bot className="w-4 h-4" />
                    Executive Swarm Assessment
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                    {result.source}
                  </span>
                </div>

                <div className="text-gray-700 dark:text-gray-200 whitespace-pre-line mb-3">
                  {result.analysis}
                </div>

                {result.keyInsights.length > 0 && (
                  <div className="space-y-1.5 border-t pt-2 border-gray-200 dark:border-gray-800">
                    <span className="font-semibold text-gray-500 uppercase text-[10px] block">
                      Key Telemetry Signals:
                    </span>
                    {result.keyInsights.map((insight, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-[11px] text-gray-600 dark:text-gray-300">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{insight}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between text-[11px]">
                  <span className="text-gray-500">
                    Risk Posture:{' '}
                    <strong
                      className={
                        result.riskPosture === 'CRITICAL'
                          ? 'text-red-600'
                          : result.riskPosture === 'ELEVATED'
                          ? 'text-amber-600'
                          : 'text-emerald-600'
                      }
                    >
                      {result.riskPosture}
                    </strong>
                  </span>
                  <span className="text-gray-400 font-mono text-[10px]">
                    Action: {result.suggestedAction}
                  </span>
                </div>
              </div>
            </div>
          )}

          {isLoading && (
            <div className="text-center py-10">
              <Sparkles className="w-8 h-8 text-purple-500 animate-spin mx-auto mb-2" />
              <p className="text-xs text-gray-400 font-mono">
                Synthesizing demographic telemetry through Gemini 3.8 Flash...
              </p>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="border-t pt-3 border-gray-200 dark:border-gray-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleQuery(prompt);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask Apex Analyst about swarms, growth spikes, or defense..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className={`flex-1 px-3 py-2 text-xs rounded-md border outline-hidden transition-all ${
                isLight
                  ? 'bg-gray-50 border-gray-300 focus:border-purple-600'
                  : 'bg-gray-900 border-gray-700 text-gray-100 focus:border-purple-500'
              }`}
            />
            <button
              type="submit"
              disabled={isLoading || !prompt.trim()}
              className="p-2 rounded-md bg-purple-600 hover:bg-purple-700 text-white cursor-pointer shadow-sm disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
