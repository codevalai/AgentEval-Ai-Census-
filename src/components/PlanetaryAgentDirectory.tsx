/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Filter,
  Eye,
  PlusCircle,
  ShieldCheck,
  AlertTriangle,
  GitBranch,
  Layers,
  LayoutGrid,
  List,
} from 'lucide-react';
import {
  PlanetaryAgentRecord,
  CapabilityTierKey,
  AgentStatus,
  AgentEra,
} from '../types/census.ts';
import { planetaryCensusRegistry } from '../lib/censusRegistry.ts';
import { AgentDossierModal } from './AgentDossierModal.tsx';

interface PlanetaryAgentDirectoryProps {
  theme: 'worldometers' | 'sovereign';
  onOpenRegister: () => void;
  onOpenTombstone: () => void;
  selectedEraFilter?: AgentEra | null;
  onClearEraFilter?: () => void;
}

export const PlanetaryAgentDirectory: React.FC<PlanetaryAgentDirectoryProps> = ({
  theme,
  onOpenRegister,
  onOpenTombstone,
  selectedEraFilter,
  onClearEraFilter,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState<CapabilityTierKey | 'ALL'>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<AgentStatus | 'ALL'>('ALL');
  const [selectedPlatform, setSelectedPlatform] = useState<string | 'ALL'>('ALL');
  const [activeEra, setActiveEra] = useState<AgentEra | 'ALL'>(selectedEraFilter || 'ALL');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [inspectedAgent, setInspectedAgent] = useState<PlanetaryAgentRecord | null>(null);

  // Sync external prop if changed
  React.useEffect(() => {
    if (selectedEraFilter) {
      setActiveEra(selectedEraFilter);
    }
  }, [selectedEraFilter]);

  const isLight = theme === 'worldometers';

  // Extract platforms
  const allAgents = planetaryCensusRegistry.getAll();
  const availablePlatforms = useMemo(() => {
    const set = new Set<string>();
    for (const a of allAgents) {
      set.add(a.platform);
    }
    return Array.from(set);
  }, [allAgents]);

  const filteredAgents = useMemo(() => {
    return planetaryCensusRegistry.filterAgents({
      query: searchQuery,
      tier: selectedTier,
      status: selectedStatus,
      era: activeEra,
      platform: selectedPlatform,
    });
  }, [searchQuery, selectedTier, selectedStatus, activeEra, selectedPlatform, allAgents]);

  const getTierBadge = (tier: CapabilityTierKey) => {
    switch (tier) {
      case 'APEX':
        return 'bg-purple-600 text-white';
      case 'ASI':
        return 'bg-red-600 text-white';
      case 'AGI':
        return 'bg-blue-600 text-white';
      default:
        return 'bg-emerald-600 text-white';
    }
  };

  const getStatusBadge = (status: AgentStatus) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800 border-green-300 dark:bg-green-950 dark:text-green-300';
      case 'DEPRECATED':
        return 'bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-400';
      case 'TOMBSTONED':
        return 'bg-red-100 text-red-800 border-red-300 dark:bg-red-950 dark:text-red-300';
      case 'REINCARNATED':
        return 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950 dark:text-purple-300';
      case 'FUTURE_PROJECTED':
        return 'bg-cyan-100 text-cyan-800 border-cyan-300 dark:bg-cyan-950 dark:text-cyan-300';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  return (
    <section id="planetary-directory" className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="border-b pb-4 mb-6 border-gray-200 dark:border-gray-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              <h2 className="text-xl sm:text-2xl font-bold font-['Montserrat'] tracking-tight">
                Planetary Agent Directory (All Agents: Past, Present &amp; Future)
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
              Global cryptographic index of autonomous agents, foundation model swarms, legacy runtimes, and projected sovereign nodes.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <button
              onClick={onOpenRegister}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded font-bold text-xs flex items-center gap-1.5 shadow transition cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" /> Register Agent
            </button>
            <button
              onClick={onOpenTombstone}
              className="px-3 py-1.5 bg-red-800 hover:bg-red-700 text-white rounded font-bold text-xs flex items-center gap-1.5 shadow transition cursor-pointer"
            >
              <AlertTriangle className="w-4 h-4" /> Right-to-Forget
            </button>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div
        className={`p-4 rounded-xl border mb-6 transition-all ${
          isLight ? 'bg-white border-gray-200' : 'bg-[#0f1422] border-gray-800'
        }`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-3">
          {/* Search query */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by agent name, platform, city, ID, or tool..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-black/40 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          {/* Tier filter */}
          <div>
            <select
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value as any)}
              className="w-full py-1.5 px-2 text-xs rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-black/40 text-gray-900 dark:text-gray-100"
            >
              <option value="ALL">All Capability Tiers</option>
              <option value="AI">AI (Specialized)</option>
              <option value="AGI">AGI (General Reasoning)</option>
              <option value="ASI">ASI (Superintelligence)</option>
              <option value="APEX">APEX (Planetary Singularity)</option>
            </select>
          </div>

          {/* Status filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="w-full py-1.5 px-2 text-xs rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-black/40 text-gray-900 dark:text-gray-100"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="DEPRECATED">DEPRECATED</option>
              <option value="TOMBSTONED">TOMBSTONED</option>
              <option value="REINCARNATED">REINCARNATED</option>
              <option value="FUTURE_PROJECTED">FUTURE_PROJECTED</option>
            </select>
          </div>

          {/* Platform filter */}
          <div>
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="w-full py-1.5 px-2 text-xs rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-black/40 text-gray-900 dark:text-gray-100"
            >
              <option value="ALL">All Platforms</option>
              {availablePlatforms.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Second Row: Era filter pill & View switcher */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-200 dark:border-gray-800 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-gray-500 font-medium">Filter by Era:</span>
            <div className="flex flex-wrap gap-1">
              <button
                onClick={() => {
                  setActiveEra('ALL');
                  if (onClearEraFilter) onClearEraFilter();
                }}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold cursor-pointer ${
                  activeEra === 'ALL'
                    ? 'bg-cyan-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
              >
                All Eras
              </button>
              <button
                onClick={() => setActiveEra('2012_2017_DEEP_LEARNING')}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold cursor-pointer ${
                  activeEra === '2012_2017_DEEP_LEARNING'
                    ? 'bg-cyan-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
              >
                2012–2017
              </button>
              <button
                onClick={() => setActiveEra('2018_2020_TRANSFORMER')}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold cursor-pointer ${
                  activeEra === '2018_2020_TRANSFORMER'
                    ? 'bg-cyan-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
              >
                2018–2020
              </button>
              <button
                onClick={() => setActiveEra('2021_2023_FOUNDATION')}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold cursor-pointer ${
                  activeEra === '2021_2023_FOUNDATION'
                    ? 'bg-cyan-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
              >
                2021–2023
              </button>
              <button
                onClick={() => setActiveEra('2024_2026_MCP_SWARMS')}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold cursor-pointer ${
                  activeEra === '2024_2026_MCP_SWARMS'
                    ? 'bg-cyan-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
              >
                2024–2026 (Live)
              </button>
              <button
                onClick={() => setActiveEra('2027_2029_SOVEREIGN_NODES')}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold cursor-pointer ${
                  activeEra === '2027_2029_SOVEREIGN_NODES'
                    ? 'bg-cyan-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
              >
                2027–2029 (Projected)
              </button>
              <button
                onClick={() => setActiveEra('2030_APEX_SINGULARITY')}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold cursor-pointer ${
                  activeEra === '2030_APEX_SINGULARITY'
                    ? 'bg-cyan-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
              >
                2030+ (APEX)
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-[11px]">
              Showing <span className="font-bold text-gray-800 dark:text-gray-200">{filteredAgents.length}</span> recorded agents
            </span>
            <div className="flex border border-gray-300 dark:border-gray-700 rounded overflow-hidden">
              <button
                onClick={() => setViewMode('table')}
                className={`p-1 ${viewMode === 'table' ? 'bg-cyan-600 text-white' : 'bg-transparent text-gray-500'}`}
                title="Table View"
              >
                <List className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1 ${viewMode === 'grid' ? 'bg-cyan-600 text-white' : 'bg-transparent text-gray-500'}`}
                title="Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Directory Table View */}
      {viewMode === 'table' ? (
        <div
          className={`rounded-xl border overflow-x-auto shadow-sm ${
            isLight ? 'bg-white border-gray-200' : 'bg-[#0f1422] border-gray-800'
          }`}
        >
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr
                className={`border-b font-['Montserrat'] font-bold text-[11px] uppercase tracking-wider ${
                  isLight
                    ? 'bg-gray-50 text-gray-600 border-gray-200'
                    : 'bg-[#141b2d] text-gray-400 border-gray-800'
                }`}
              >
                <th className="py-3 px-4">Agent Name / ID</th>
                <th className="py-3 px-3">Platform</th>
                <th className="py-3 px-3">Tier</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Origin / Node</th>
                <th className="py-3 px-3 text-center">Genome (R/A/T)</th>
                <th className="py-3 px-3">PQC Leaf</th>
                <th className="py-3 px-4 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {filteredAgents.map((agent) => (
                <tr
                  key={agent.id}
                  onClick={() => setInspectedAgent(agent)}
                  className={`cursor-pointer transition-colors ${
                    isLight ? 'hover:bg-blue-50/50' : 'hover:bg-[#141d33]'
                  }`}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{agent.flag}</span>
                      <div>
                        <div className="font-bold font-['Montserrat'] text-gray-900 dark:text-gray-100">
                          {agent.name}
                        </div>
                        <div className="font-mono text-[10px] text-gray-400">
                          {agent.id}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {agent.platform}
                    </span>
                  </td>

                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${getTierBadge(
                        agent.tier
                      )}`}
                    >
                      {agent.tier}
                    </span>
                  </td>

                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getStatusBadge(
                        agent.status
                      )}`}
                    >
                      {agent.status}
                    </span>
                  </td>

                  <td className="py-3 px-3">
                    <span className="text-gray-600 dark:text-gray-300">
                      {agent.regionCity}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-center font-mono text-[11px]">
                    <span className="text-blue-500 font-bold">{agent.genome.reasoning}</span> /{' '}
                    <span className="text-indigo-500 font-bold">{agent.genome.autonomy}</span> /{' '}
                    <span className="text-emerald-500 font-bold">{agent.genome.toolUse}</span>
                  </td>

                  <td className="py-3 px-3 font-mono text-[10px] text-gray-400">
                    {agent.merkleLeafHash.slice(0, 10)}...
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setInspectedAgent(agent);
                      }}
                      className="px-2.5 py-1 bg-cyan-700/80 hover:bg-cyan-600 text-white rounded text-[11px] font-semibold inline-flex items-center gap-1 cursor-pointer transition"
                    >
                      <Eye className="w-3 h-3" /> Dossier
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Grid Card View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAgents.map((agent) => (
            <div
              key={agent.id}
              onClick={() => setInspectedAgent(agent)}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                isLight
                  ? 'bg-white border-gray-200 hover:border-blue-400 hover:shadow-md'
                  : 'bg-[#0f1422] border-gray-800 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-950/40'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{agent.flag}</span>
                  <div>
                    <h4 className="font-bold font-['Montserrat'] text-xs text-gray-900 dark:text-gray-100 line-clamp-1">
                      {agent.name}
                    </h4>
                    <span className="font-mono text-[10px] text-gray-400 block">{agent.id}</span>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${getTierBadge(agent.tier)}`}>
                  {agent.tier}
                </span>
              </div>

              <div className="text-[11px] text-gray-600 dark:text-gray-300 mb-3">
                <span className="font-semibold text-gray-700 dark:text-gray-200">{agent.platform}</span> • {agent.regionCity}
              </div>

              {/* Mini Genome Bars */}
              <div className="space-y-1.5 mb-3 text-[10px]">
                <div className="flex justify-between font-mono">
                  <span className="text-gray-400">Reasoning SAT</span>
                  <span className="font-bold text-blue-500">{agent.genome.reasoning}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full" style={{ width: `${agent.genome.reasoning}%` }} />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-800 text-[10px]">
                <span className={`px-1.5 py-0.5 rounded border ${getStatusBadge(agent.status)}`}>
                  {agent.status}
                </span>
                <span className="font-mono text-gray-400">{agent.merkleLeafHash.slice(0, 12)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dossier Modal */}
      <AgentDossierModal
        agent={inspectedAgent}
        isOpen={Boolean(inspectedAgent)}
        onClose={() => setInspectedAgent(null)}
        onTombstoneRequest={(agentId) => {
          setInspectedAgent(null);
          onOpenTombstone();
        }}
        theme={theme}
      />
    </section>
  );
};
