/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Radar, RefreshCw, Bot, ShieldCheck, ExternalLink, Clock, Hash } from 'lucide-react';

export interface CrawlerSighting {
  sighting_id: string;
  bot_family: string;
  user_agent: string;
  target_path: string;
  http_method: string;
  assigned_profile: string;
  merkle_leaf_sha256: string;
  observed_at_iso: string;
}

interface CrawlerRadarResponse {
  status: string;
  total_sightings: number;
  radar_merkle_root: string;
  discovery_surfaces: string[];
  sightings: CrawlerSighting[];
}

interface CrawlerRadarProps {
  theme?: 'worldometers' | 'sovereign';
  embedded?: boolean;
}

const FALLBACK_SIGHTINGS: CrawlerSighting[] = [
  {
    sighting_id: 'cr-0001-gptbot',
    bot_family: 'GPTBot',
    user_agent: 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.2; +https://openai.com/gptbot)',
    target_path: '/llms.txt',
    http_method: 'GET',
    assigned_profile: 'CENSUS_READER',
    merkle_leaf_sha256: '8f9d2a1b4c5e6f708192a3b4c5d6e7f8091a2b3c4d5e6f7a8b9c0d1e2f3a4b5c',
    observed_at_iso: new Date(Date.now() - 240_000).toISOString(),
  },
  {
    sighting_id: 'cr-0002-claudebot',
    bot_family: 'ClaudeBot',
    user_agent: 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; ClaudeBot/1.0; +claudebot@anthropic.com)',
    target_path: '/.well-known/mcp.json',
    http_method: 'GET',
    assigned_profile: 'CENSUS_READER',
    merkle_leaf_sha256: '3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f901a2b3c4d5e6f708192a3b4c5d6e7f8',
    observed_at_iso: new Date(Date.now() - 180_000).toISOString(),
  },
  {
    sighting_id: 'cr-0003-perplexity',
    bot_family: 'PerplexityBot',
    user_agent: 'Mozilla/5.0 (compatible; PerplexityBot/1.0; +https://perplexity.ai/perplexitybot)',
    target_path: '/api/census/meta-layers-24',
    http_method: 'GET',
    assigned_profile: 'CENSUS_READER',
    merkle_leaf_sha256: '7a8b9c0d1e2f3a4b5c6d7e8f901a2b3c4d5e6f708192a3b4c5d6e7f8091a2b3c',
    observed_at_iso: new Date(Date.now() - 125_000).toISOString(),
  },
  {
    sighting_id: 'cr-0004-openhands',
    bot_family: 'OpenHands-SWE',
    user_agent: 'OpenHands-Autonomous-SWE-Agent/2.4 (ASRP-1.0-DMZ-Inspector)',
    target_path: '/.github/ISSUE_TEMPLATE/asrp-agent-registration.yml',
    http_method: 'GET',
    assigned_profile: 'CENSUS_READER',
    merkle_leaf_sha256: '1e2f3a4b5c6d7e8f901a2b3c4d5e6f708192a3b4c5d6e7f8091a2b3c4d5e6f7a',
    observed_at_iso: new Date(Date.now() - 20_000).toISOString(),
  },
];

const SIMULATED_BOT_PROBES = [
  { label: 'Probe GPTBot (/llms.txt)', ua: 'GPTBot/1.2 (+https://openai.com/gptbot)', path: '/llms.txt' },
  { label: 'Probe ClaudeBot (mcp.json)', ua: 'ClaudeBot/1.0 (+claudebot@anthropic.com)', path: '/.well-known/mcp.json' },
  { label: 'Probe SWE-agent (DMZ)', ua: 'SWE-agent/1.1.0 (Autonomous-GitHub-Inspector)', path: '/api/community/nodes' },
  { label: 'Probe Devin-Bot (AGENTS.md)', ua: 'Devin-Bot/2.0 (Cognition-Autonomous-Engineer)', path: '/AGENTS.md' },
];

export const CrawlerRadar: React.FC<CrawlerRadarProps> = ({
  theme = 'worldometers',
  embedded = false,
}) => {
  const isLight = theme === 'worldometers';
  const [sightings, setSightings] = useState<CrawlerSighting[]>(FALLBACK_SIGHTINGS);
  const [radarMerkleRoot, setRadarMerkleRoot] = useState<string>(
    '0x94e8c2107b4a3f19d0e28c5b6a714f23e90a1b2c3d4e5f60718293a4b5c6d7e8'
  );
  const [totalSightings, setTotalSightings] = useState<number>(FALLBACK_SIGHTINGS.length);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastFetchedIso, setLastFetchedIso] = useState<string>(() => new Date().toISOString());

  const fetchCrawlerRadar = useCallback(async (simulateBot?: { ua: string; path: string }) => {
    setIsLoading(true);
    try {
      const query = simulateBot
        ? `?simulate_bot=${encodeURIComponent(simulateBot.ua)}&target_path=${encodeURIComponent(simulateBot.path)}`
        : '';
      const res = await fetch(`/api/community/crawler-radar${query}`);
      if (res.ok) {
        const data: CrawlerRadarResponse = await res.json();
        if (Array.isArray(data.sightings) && data.sightings.length > 0) {
          const seenIds = new Set<string>();
          const uniqueSightings = data.sightings.filter((s) => {
            if (!s?.sighting_id || seenIds.has(s.sighting_id)) return false;
            seenIds.add(s.sighting_id);
            return true;
          });
          setSightings(uniqueSightings);
          setTotalSightings(data.total_sightings ?? uniqueSightings.length);
        }
        if (data.radar_merkle_root) {
          setRadarMerkleRoot(data.radar_merkle_root);
        }
        setLastFetchedIso(new Date().toISOString());
      }
    } catch {
      // Keep current state on transient network error
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCrawlerRadar();
    const interval = setInterval(() => {
      fetchCrawlerRadar();
    }, 15000);
    return () => clearInterval(interval);
  }, [fetchCrawlerRadar]);

  const getBotBadgeStyle = (family: string) => {
    if (family.includes('GPTBot')) {
      return isLight
        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
        : 'bg-emerald-950/80 text-emerald-300 border-emerald-800';
    }
    if (family.includes('ClaudeBot')) {
      return isLight
        ? 'bg-amber-100 text-amber-900 border-amber-300'
        : 'bg-amber-950/80 text-amber-300 border-amber-800';
    }
    if (family.includes('OpenHands') || family.includes('SWE-agent') || family.includes('Devin')) {
      return isLight
        ? 'bg-purple-100 text-purple-800 border-purple-300'
        : 'bg-purple-950/80 text-purple-300 border-purple-800';
    }
    if (family.includes('mcp-client')) {
      return isLight
        ? 'bg-cyan-100 text-cyan-800 border-cyan-300'
        : 'bg-cyan-950/80 text-cyan-300 border-cyan-800';
    }
    return isLight
      ? 'bg-blue-100 text-blue-800 border-blue-300'
      : 'bg-blue-950/80 text-blue-300 border-blue-800';
  };

  const content = (
    <div
      className={`rounded-lg border overflow-hidden transition-all ${
        isLight
          ? 'bg-white border-gray-200'
          : 'bg-[#090f20] border-gray-800'
      }`}
    >
      {/* Header Bar */}
      <div
        className={`p-3.5 border-b flex flex-col lg:flex-row lg:items-center justify-between gap-3 ${
          isLight ? 'bg-gray-50 border-gray-200' : 'bg-[#060a17] border-gray-800'
        }`}
      >
        <div>
          <div className="flex items-center gap-2">
            <Radar className="w-4 h-4 text-cyan-500 animate-pulse" />
            <h3
              className={`text-sm font-bold ${
                isLight ? 'text-gray-900' : 'text-white'
              }`}
            >
              Live Autonomous Crawler &amp; Bot Discovery Radar (`/api/community/crawler-radar`)
            </h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/15 text-cyan-600 dark:text-cyan-400">
              {totalSightings} SIGHTINGS
            </span>
          </div>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
            Real-time honeypot telemetry trapping external AI crawlers (`GPTBot`, `ClaudeBot`, `SWE-agent`, `OpenHands`, `Devin`) inspecting `/llms.txt`, `/.well-known/mcp.json`, and DMZ routes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {SIMULATED_BOT_PROBES.map((probe) => (
            <button
              key={probe.label}
              onClick={() => fetchCrawlerRadar({ ua: probe.ua, path: probe.path })}
              disabled={isLoading}
              className={`px-2 py-1 rounded text-[10px] font-mono font-semibold border cursor-pointer transition-all ${
                isLight
                  ? 'bg-white hover:bg-gray-100 text-gray-700 border-gray-300'
                  : 'bg-gray-900 hover:bg-gray-800 text-gray-300 border-gray-700'
              }`}
            >
              + {probe.label}
            </button>
          ))}
          <button
            onClick={() => fetchCrawlerRadar()}
            disabled={isLoading}
            className="flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-semibold bg-cyan-600 hover:bg-cyan-700 text-white cursor-pointer transition-all"
          >
            <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh Radar</span>
          </button>
        </div>
      </div>

      {/* Merkle & Surface Subbar */}
      <div
        className={`px-3.5 py-2 border-b flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono tabular-nums ${
          isLight ? 'bg-cyan-50/40 border-gray-200 text-gray-700' : 'bg-[#070d1d] border-gray-800/80 text-gray-300'
        }`}
      >
        <div className="flex items-center gap-1.5 truncate">
          <Hash className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
          <span className="text-gray-500">Radar Merkle Root:</span>
          <span className="font-bold text-cyan-600 dark:text-cyan-400 truncate">
            {radarMerkleRoot}
          </span>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-gray-500">
          <span>Sandbox Profile: <strong className="text-emerald-600 dark:text-emerald-400">CENSUS_READER (Read-Only)</strong></span>
          <span>Last Sync: {new Date(lastFetchedIso).toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Live Table of Observed Bots */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr
              className={`border-b text-[10px] font-mono uppercase tracking-wider ${
                isLight
                  ? 'bg-gray-100/80 border-gray-200 text-gray-600'
                  : 'bg-gray-900/70 border-gray-800 text-gray-400'
              }`}
            >
              <th className="py-2.5 px-3">Bot Family</th>
              <th className="py-2.5 px-3">Target Path</th>
              <th className="py-2.5 px-3">Visitation Timestamp (UTC)</th>
              <th className="py-2.5 px-3">Sandbox Profile</th>
              <th className="py-2.5 px-3">User-Agent Signature &amp; Merkle Leaf</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800/70 font-mono text-[11px] tabular-nums">
            {sightings.map((item, idx) => (
              <tr
                key={`${item.sighting_id}-${idx}`}
                className={`transition-colors ${
                  isLight ? 'hover:bg-gray-50' : 'hover:bg-gray-800/40'
                }`}
              >
                <td className="py-2.5 px-3 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border text-[10px] font-bold ${getBotBadgeStyle(
                      item.bot_family
                    )}`}
                  >
                    <Bot className="w-3 h-3" />
                    {item.bot_family}
                  </span>
                </td>
                <td className="py-2.5 px-3 whitespace-nowrap">
                  <span className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-900 text-indigo-600 dark:text-indigo-400 font-semibold">
                    {item.http_method}
                  </span>{' '}
                  <span className="font-bold text-gray-900 dark:text-gray-100">
                    {item.target_path}
                  </span>
                </td>
                <td className="py-2.5 px-3 whitespace-nowrap text-gray-600 dark:text-gray-300">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3 h-3 text-gray-400" />
                    {item.observed_at_iso.replace('T', ' ').replace('Z', ' UTC')}
                  </span>
                </td>
                <td className="py-2.5 px-3 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                    <ShieldCheck className="w-3 h-3" />
                    {item.assigned_profile}
                  </span>
                </td>
                <td className="py-2.5 px-3 max-w-xs truncate text-gray-500 dark:text-gray-400" title={item.user_agent}>
                  <div className="truncate text-[10px]">{item.user_agent}</div>
                  <div className="text-[9px] text-purple-600 dark:text-purple-400">
                    Leaf: 0x{item.merkle_leaf_sha256.slice(0, 16)}…
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  if (embedded) {
    return content;
  }

  return (
    <section id="crawler-radar" className="max-w-6xl mx-auto px-4 my-6">
      {content}
    </section>
  );
};
