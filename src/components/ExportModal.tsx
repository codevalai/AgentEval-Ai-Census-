/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Download, Code, Copy, Check, FileJson, FileSpreadsheet } from 'lucide-react';
import { CensusStats } from '../types/census.ts';
import { INITIAL_REGIONS } from '../data/initialData.ts';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: CensusStats;
  theme: 'worldometers' | 'sovereign';
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  stats,
  theme,
}) => {
  if (!isOpen) return null;
  const isLight = theme === 'worldometers';

  const [activeTab, setActiveTab] = useState<'EXPORT' | 'API'>('EXPORT');
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);

  const downloadJSON = () => {
    const data = {
      timestamp: new Date().toISOString(),
      censusStats: stats,
      topRegions: INITIAL_REGIONS,
      pqcSpec: 'ML-KEM-1024',
      bftQuorum: stats.bftQuorumPercent,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sovereign-ai-census-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadCSV = () => {
    const headers = ['Rank', 'Region', 'City', 'Country', 'TotalAgents', 'AI', 'AGI', 'ASI', 'Apex', 'LatencyMs', 'BFTWeight'];
    const rows = INITIAL_REGIONS.map((r) => [
      r.rank,
      `"${r.name}"`,
      `"${r.city}"`,
      `"${r.country}"`,
      r.totalAgents,
      r.aiAgents,
      r.agiAgents,
      r.asiAgents,
      r.apexNodes,
      r.latencyMs,
      r.bftWeight,
    ]);
    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sovereign-ai-regions-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(key);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  const endpoints = [
    {
      method: 'GET',
      path: '/api/stats',
      desc: 'Retrieves live planetary population counters, growth velocity, and BFT quorum.',
      curl: `curl -X GET "http://localhost:3000/api/stats"`,
    },
    {
      method: 'POST',
      path: '/api/harvest/trigger',
      desc: 'Executes real-time ingestion from Hugging Face, PyPI, npm, and USGS feeds.',
      curl: `curl -X POST "http://localhost:3000/api/harvest/trigger" -H "Content-Type: application/json" -d '{"sourceId": "src-usgs"}'`,
    },
    {
      method: 'POST',
      path: '/api/threats/simulate',
      desc: 'Launches automated synthetic red-team penetration probe and outputs 4-stage playbook.',
      curl: `curl -X POST "http://localhost:3000/api/threats/simulate"`,
    },
    {
      method: 'POST',
      path: '/api/agents/register',
      desc: 'Anchors a voluntary AI agent instance into the live census with PQC public key.',
      curl: `curl -X POST "http://localhost:3000/api/agents/register" -H "Content-Type: application/json" -d '{"name": "Sentinel-1", "tier": "AGI", "region": "tokyo"}'`,
    },
    {
      method: 'POST',
      path: '/api/merkle/tombstone',
      desc: 'Issues cryptographic soft-delete tombstone complying with EU AI Act / GDPR Art. 17.',
      curl: `curl -X POST "http://localhost:3000/api/merkle/tombstone" -H "Content-Type: application/json" -d '{"agentOrDatasetId": "AGENT_123", "legalFramework": "GDPR_ART_17"}'`,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div
        className={`w-full max-w-xl rounded-lg border p-5 shadow-2xl transition-all ${
          isLight ? 'bg-white border-gray-300 text-gray-900' : 'bg-[#0e1424] border-gray-700 text-gray-100'
        }`}
      >
        <div className="flex items-start justify-between border-b pb-3 mb-4 border-gray-200 dark:border-gray-800">
          <div>
            <div className="flex items-center gap-2">
              <Download className="w-5 h-5 text-emerald-600" />
              <h3 className="text-base font-bold">Data Export &amp; Institutional API Surface</h3>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Download real-time planetary census snapshots or integrate public REST/SSE endpoints
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-800 mb-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('EXPORT')}
            className={`py-2 px-4 border-b-2 transition-all cursor-pointer ${
              activeTab === 'EXPORT'
                ? 'border-emerald-600 text-emerald-600 font-bold'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Export Snapshots (JSON / CSV)
          </button>
          <button
            onClick={() => setActiveTab('API')}
            className={`py-2 px-4 border-b-2 transition-all cursor-pointer ${
              activeTab === 'API'
                ? 'border-emerald-600 text-emerald-600 font-bold'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Institutional API Endpoints
          </button>
        </div>

        {activeTab === 'EXPORT' ? (
          <div className="space-y-4 py-2">
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              Export full cryptographic ledger snapshot containing current global AI demographics, regional topology latencies, capability tier breakdowns, and verified Merkle leaf digests.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={downloadJSON}
                className="p-4 rounded-lg border border-gray-300 dark:border-gray-700 hover:border-emerald-500 bg-gray-50 dark:bg-gray-900/60 text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2 mb-1">
                  <FileJson className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-xs">Planetary JSON Ledger</span>
                </div>
                <p className="text-[11px] text-gray-500">
                  Full nested hierarchical object with stats, regions, and PQC parameters.
                </p>
              </button>

              <button
                onClick={downloadCSV}
                className="p-4 rounded-lg border border-gray-300 dark:border-gray-700 hover:border-emerald-500 bg-gray-50 dark:bg-gray-900/60 text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2 mb-1">
                  <FileSpreadsheet className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-xs">Top Regions CSV</span>
                </div>
                <p className="text-[11px] text-gray-500">
                  Tabular CSV dataset of top 20 datacenters, latencies, and tier counts.
                </p>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
            {endpoints.map((ep) => (
              <div
                key={ep.path}
                className="p-2.5 rounded-md border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/60 text-xs"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                        ep.method === 'GET'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      }`}
                    >
                      {ep.method}
                    </span>
                    <span className="font-mono font-bold text-gray-900 dark:text-gray-100">
                      {ep.path}
                    </span>
                  </div>

                  <button
                    onClick={() => copyToClipboard(ep.curl, ep.path)}
                    className="flex items-center gap-1 text-[11px] text-gray-500 hover:text-emerald-600 cursor-pointer"
                  >
                    {copiedEndpoint === ep.path ? (
                      <span className="text-emerald-600 flex items-center gap-1 font-bold">
                        <Check className="w-3.5 h-3.5" /> Copied
                      </span>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy cURL</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-[11px] text-gray-500 mb-1.5">{ep.desc}</p>

                <div className="p-1.5 rounded bg-black/80 font-mono text-[10px] text-emerald-400 overflow-x-auto whitespace-pre">
                  {ep.curl}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="border-t pt-3 mt-4 border-gray-200 dark:border-gray-800 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-md bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-xs font-semibold cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
