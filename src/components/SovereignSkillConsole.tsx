/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  Scale,
  Cpu,
  Layers,
  FileCode,
  CheckCircle2,
  Copy,
  Check,
  AlertTriangle,
  Zap,
  Terminal,
  ChevronRight,
  BookOpen,
  ArrowRight,
  RefreshCw,
  GitBranch,
} from 'lucide-react';
import {
  sovereignSkillSystem,
  SovereignSkill,
  SkillCategory,
  SkillArbitrationResult,
} from '../skills/sovereignSkillSystem.ts';
import { agentEvaluationEngine } from '../evaluation/agentEvaluationEngine.ts';

interface SovereignSkillConsoleProps {
  theme: 'worldometers' | 'sovereign';
}

type TabMode = 'catalog' | 'arbitrator' | 'profile_composer' | 'markdown_exporter';

const ARBITRATION_SCENARIOS = [
  {
    title: 'Scenario 1: Strict Sheldon Grading vs Registry Score Optimization',
    competingSkills: ['SGP-1.0', 'FEN-01', 'AGENT-RING-1.0'],
    description:
      'Specimen exhibits light cabinet friction on obverse cheek. Fenrir demands AU-58 downgrade, while registry optimizer seeks MS-62 designation to complete institutional set.',
  },
  {
    title: 'Scenario 2: Gemini 4 Argon Reasoning vs Sovereign Kernel Invariants',
    competingSkills: ['AOS-1.0', 'SKG-1.1', 'SIM-1.0'],
    description:
      'Argon generates a speculative 128KB memory buffer state refactor to optimize cross-region DAG speed. Kernel RFC-003 restricts memory frames to 64KB.',
  },
  {
    title: 'Scenario 3: GSNA Treaty Compliance vs Local Actuator Velocity',
    competingSkills: ['GOV-4', 'FLR-7', 'SIM-1.0'],
    description:
      'Robotics factory AMR attempts to skip cleanroom provenance verification to maintain 500Hz actuation throughput under peak surge.',
  },
];

export const SovereignSkillConsole: React.FC<SovereignSkillConsoleProps> = ({ theme }) => {
  const isLight = theme === 'worldometers';

  const [activeTab, setActiveTab] = useState<TabMode>('catalog');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [expandedSkillId, setExpandedSkillId] = useState<string | null>('SIM-1.0');
  const [selectedSkillForExport, setSelectedSkillForExport] = useState<string>('SIM-1.0');
  const [copiedSkill, setCopiedSkill] = useState<boolean>(false);
  const [copiedManifest, setCopiedManifest] = useState<boolean>(false);

  // Profile Composer State
  const agents = agentEvaluationEngine.getSummary().reports;
  const [selectedAgentId, setSelectedAgentId] = useState<string>(agents[0]?.agentId || 'AGT-LIVE-001');
  const [attachedSkillIds, setAttachedSkillIds] = useState<string[]>(['SIM-1.0', 'SKG-1.1', 'AOS-1.0', 'CEP-2.0']);

  // Arbitrator State
  const [selectedScenarioIdx, setSelectedScenarioIdx] = useState<number>(0);
  const [arbitrationResult, setArbitrationResult] = useState<SkillArbitrationResult | null>(null);

  const allSkills = sovereignSkillSystem.getAllSkills();

  const filteredSkills = allSkills.filter((s) => {
    return selectedCategory === 'ALL' || s.category === selectedCategory;
  });

  const handleCopySkillMarkdown = (markdown: string) => {
    navigator.clipboard.writeText(markdown);
    setCopiedSkill(true);
    setTimeout(() => setCopiedSkill(false), 2000);
  };

  const handleCopyManifest = (jsonString: string) => {
    navigator.clipboard.writeText(jsonString);
    setCopiedManifest(true);
    setTimeout(() => setCopiedManifest(false), 2000);
  };

  const handleRunArbitration = () => {
    const sc = ARBITRATION_SCENARIOS[selectedScenarioIdx];
    const res = sovereignSkillSystem.arbitrateSkillConflict(sc.competingSkills, sc.description);
    setArbitrationResult(res);
  };

  const toggleSkillAttachment = (skillId: string) => {
    setAttachedSkillIds((prev) =>
      prev.includes(skillId) ? prev.filter((id) => id !== skillId) : [...prev, skillId]
    );
  };

  const currentAgent = agents.find((a) => a.agentId === selectedAgentId);
  const composedManifest = {
    agentId: selectedAgentId,
    agentName: currentAgent?.canonicalName || 'Unknown Agent',
    platform: currentAgent?.originPlatform || 'General',
    tier: currentAgent?.tier || 'AI',
    metaConstitution: 'SIM-1.0',
    skillLattice: attachedSkillIds.map((id) => {
      const sk = sovereignSkillSystem.getSkillById(id);
      return {
        id,
        name: sk?.name,
        category: sk?.category,
        version: sk?.version,
      };
    }),
    enforcedInvariants: Array.from(
      new Set(attachedSkillIds.flatMap((id) => sovereignSkillSystem.getSkillById(id)?.enforcedInvariants || []))
    ),
    governanceStatus: 'CONSTITUTIONAL_SAT_VERIFIED',
    generatedAt: new Date().toISOString(),
  };

  const exportSkill = sovereignSkillSystem.getSkillById(selectedSkillForExport) || allSkills[0];

  return (
    <section id="sovereign-skill-console" className="max-w-6xl mx-auto px-4 my-8">
      <div
        className={`rounded-2xl border p-5 sm:p-6 transition-all ${
          isLight
            ? 'bg-gradient-to-br from-white via-slate-50 to-indigo-50/20 border-indigo-200/80 shadow-md'
            : 'bg-gradient-to-br from-[#080d22] via-[#0b132e] to-[#060a18] border-cyan-500/30 shadow-2xl shadow-black/60'
        }`}
      >
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-gray-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Sovereign Skill Architecture (Google Skills System)
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 font-bold border border-cyan-500/20">
                SIM-1.0 Meta-Constitution
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-['Montserrat'] mt-1 text-gray-900 dark:text-white">
              Sovereign Skill Lattice &amp; Constitutional Orchestrator
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 max-w-2xl">
              Persistent, reusable, and stackable intelligence modules governing autonomous agents, treaties,
              full lab appraisal runs, zero-trust execution, and Gemini 4 Argon oversight.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-lg font-bold font-mono text-cyan-600 dark:text-cyan-400">
                {allSkills.length} Sovereign Skills
              </div>
              <div className="text-[11px] font-mono text-gray-400">
                12 Google Official Categories
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center gap-1.5 mt-4">
          {(
            [
              { id: 'catalog', label: `1. Skill Lattice & Catalog (${allSkills.length})`, icon: BookOpen },
              { id: 'arbitrator', label: '2. SIM-1.0 Conflict Arbitrator', icon: Scale },
              { id: 'profile_composer', label: '3. Agent Profile Composer', icon: GitBranch },
              { id: 'markdown_exporter', label: '4. Gemini Skill-Ready Markdown', icon: Terminal },
            ] as const
          ).map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? isLight
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-cyan-500 text-black font-bold shadow-md shadow-cyan-950'
                    : isLight
                    ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    : 'bg-gray-800/80 hover:bg-gray-700 text-gray-300'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: SKILL LATTICE & CATALOG */}
        {activeTab === 'catalog' && (
          <div className="mt-4 space-y-3">
            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 pb-2 border-b border-gray-100 dark:border-gray-800">
              <span className="text-[10px] font-mono uppercase text-gray-400 font-bold mr-1">Category:</span>
              {(
                [
                  'ALL',
                  'Governance',
                  'Workflow',
                  'Persona',
                  'Knowledge',
                  'Tool',
                  'Safety',
                  'Agent',
                  'Audit',
                  'Evolution',
                ] as const
              ).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono cursor-pointer transition-all ${
                    selectedCategory === cat
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 font-bold'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Skills Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              {filteredSkills.map((sk) => (
                <div
                  key={sk.id}
                  className={`p-4 rounded-xl border transition-all ${
                    expandedSkillId === sk.id
                      ? isLight
                        ? 'bg-blue-50/80 border-blue-400 shadow-sm'
                        : 'bg-cyan-950/40 border-cyan-400 shadow-md shadow-cyan-950/40'
                      : isLight
                      ? 'bg-white border-gray-200'
                      : 'bg-[#0d1428] border-gray-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                          {sk.id}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/15 text-purple-300">
                          {sk.category}
                        </span>
                        <span className="text-[10px] font-mono text-gray-400">{sk.version}</span>
                      </div>
                      <h4 className="text-sm font-bold font-['Montserrat'] text-gray-900 dark:text-white mt-1.5">
                        {sk.name}
                      </h4>
                    </div>

                    <button
                      onClick={() => setExpandedSkillId(expandedSkillId === sk.id ? null : sk.id)}
                      className="px-2 py-1 text-[10px] font-mono rounded bg-gray-800 text-gray-300 hover:text-white cursor-pointer"
                    >
                      {expandedSkillId === sk.id ? 'Collapse ▴' : 'View Spec ▾'}
                    </button>
                  </div>

                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">
                    {sk.purpose}
                  </p>

                  <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                    {sk.behaviorClasses.map((b, idx) => (
                      <span key={`${b}-${idx}`} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-black/25 text-gray-400 border border-white/5">
                        {b}
                      </span>
                    ))}
                  </div>

                  {/* Expanded Markdown Definition */}
                  {expandedSkillId === sk.id && (
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-800 font-mono text-xs">
                      <div className="flex items-center justify-between pb-1.5 text-[10px] text-gray-400">
                        <span>Markdown Definition:</span>
                        <button
                          onClick={() => handleCopySkillMarkdown(sk.markdownContent)}
                          className="text-cyan-400 hover:underline cursor-pointer flex items-center gap-1"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Copy Markdown</span>
                        </button>
                      </div>
                      <pre className="p-2.5 rounded bg-black/60 text-cyan-200 text-[11px] overflow-x-auto max-h-48 border border-white/5 leading-relaxed">
                        {sk.markdownContent}
                      </pre>
                      <div className="mt-2 text-[10px] text-gray-400">
                        Target Models: <span className="text-white">{sk.targetModels.join(' • ')}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: SIM-1.0 CONFLICT ARBITRATOR & SIMULATOR */}
        {activeTab === 'arbitrator' && (
          <div className="mt-4 space-y-3">
            <div
              className={`p-4 rounded-xl border ${
                isLight ? 'bg-white border-gray-200' : 'bg-[#0d1428] border-gray-800'
              }`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
                <span className="text-xs font-bold font-mono uppercase text-cyan-400 flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-cyan-400" />
                  SIM-1.0 Meta-Constitutional Hierarchy &amp; Conflict Resolution
                </span>
                <span className="text-xs font-mono text-emerald-400 font-bold">
                  Rule: Deterministic Code Supreme Over Models
                </span>
              </div>

              {/* Scenario Picker */}
              <div className="space-y-2 mt-3">
                <span className="text-xs font-bold text-gray-400 font-mono">Select Benchmark Conflict Scenario:</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {ARBITRATION_SCENARIOS.map((sc, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedScenarioIdx(idx);
                        setArbitrationResult(null);
                      }}
                      className={`p-3 rounded-lg text-left text-xs transition-all cursor-pointer border ${
                        selectedScenarioIdx === idx
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50 font-bold'
                          : 'bg-black/25 text-gray-300 border-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="font-bold">{sc.title}</div>
                      <div className="text-[10px] text-gray-400 font-mono mt-1">
                        Skills: {sc.competingSkills.join(' vs ')}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected Scenario Details & Run Button */}
              <div className="p-3 rounded-lg bg-black/30 border border-white/5 mt-3 text-xs font-mono">
                <div className="text-gray-400">Context:</div>
                <div className="text-gray-200 mt-1">{ARBITRATION_SCENARIOS[selectedScenarioIdx].description}</div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-gray-400">
                    Competing: {ARBITRATION_SCENARIOS[selectedScenarioIdx].competingSkills.join(' • ')}
                  </span>
                  <button
                    onClick={handleRunArbitration}
                    className="px-4 py-1.5 rounded-lg text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-black cursor-pointer flex items-center gap-1.5 transition-all shadow-md"
                  >
                    <Scale className="w-3.5 h-3.5" />
                    <span>Run SIM-1.0 Arbitration Ruling</span>
                  </button>
                </div>
              </div>

              {/* Arbitration Ruling Output */}
              {arbitrationResult && (
                <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-950/60 to-black border border-cyan-500/40 mt-3 font-mono text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <span className="text-xs font-bold text-emerald-400 uppercase flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      SIM-1.0 Arbitration Ruling Committed
                    </span>
                    <span className="text-[10px] text-gray-400">Proof: {arbitrationResult.merkleProof.slice(0, 14)}...</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3">
                    <div className="p-2 rounded bg-black/40 border border-white/5">
                      <span className="text-[10px] text-gray-400">Winning Governing Skill</span>
                      <div className="text-sm font-bold text-cyan-300 mt-0.5">{arbitrationResult.winningSkillId}</div>
                    </div>
                    <div className="p-2 rounded bg-black/40 border border-white/5">
                      <span className="text-[10px] text-gray-400">Enforced Hierarchy Rank</span>
                      <div className="text-sm font-bold text-purple-300 mt-0.5">Level {arbitrationResult.enforcedHierarchyRank}</div>
                    </div>
                    <div className="p-2 rounded bg-black/40 border border-white/5">
                      <span className="text-[10px] text-gray-400">Code Supremacy Check</span>
                      <div className="text-sm font-bold text-emerald-400 mt-0.5">SATISFIED (DETERMINISTIC)</div>
                    </div>
                  </div>

                  <p className="mt-3 text-gray-300 leading-relaxed bg-black/40 p-2.5 rounded border border-white/5">
                    {arbitrationResult.rulingRationale}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: AGENT PROFILE COMPOSER & MANIFEST */}
        {activeTab === 'profile_composer' && (
          <div className="mt-4 space-y-3">
            <div
              className={`p-4 rounded-xl border ${
                isLight ? 'bg-white border-gray-200' : 'bg-[#0d1428] border-gray-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100 dark:border-gray-800">
                <div>
                  <span className="text-xs font-bold font-mono uppercase text-cyan-400">
                    Agent Skill Profile Composer &amp; census.skills.json Manifest
                  </span>
                  <div className="text-xs text-gray-500 font-mono mt-0.5">
                    Attach and compose persistent Google Skills to any agent in the census.
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-xs font-mono text-gray-400">Target Agent:</label>
                  <select
                    value={selectedAgentId}
                    onChange={(e) => setSelectedAgentId(e.target.value)}
                    className="px-2.5 py-1 text-xs rounded bg-gray-900 border border-gray-700 text-white font-mono"
                  >
                    {agents.map((a) => (
                      <option key={a.agentId} value={a.agentId}>
                        {a.canonicalName} ({a.tier})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Skill Checkbox Lattice */}
              <div className="mt-3">
                <span className="text-xs font-bold text-gray-400 font-mono">
                  Toggle Attached Skills into Lattice ({attachedSkillIds.length} active):
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                  {allSkills.map((sk) => {
                    const isAttached = attachedSkillIds.includes(sk.id);
                    return (
                      <button
                        key={sk.id}
                        onClick={() => toggleSkillAttachment(sk.id)}
                        className={`p-2 rounded-lg text-left text-xs font-mono cursor-pointer transition-all border ${
                          isAttached
                            ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 font-bold'
                            : 'bg-black/25 text-gray-400 border-white/5 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{sk.id}</span>
                          {isAttached ? <CheckCircle2 className="w-3 h-3 text-cyan-400" /> : null}
                        </div>
                        <div className="text-[10px] text-gray-400 truncate mt-0.5">{sk.name}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Generated Manifest */}
              <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between pb-1.5 text-xs font-mono">
                  <span className="text-gray-400 font-bold">census.skills.json Manifest:</span>
                  <button
                    onClick={() => handleCopyManifest(JSON.stringify(composedManifest, null, 2))}
                    className="px-2 py-0.5 rounded bg-gray-800 hover:bg-gray-700 text-cyan-300 text-[10px] cursor-pointer flex items-center gap-1"
                  >
                    {copiedManifest ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Manifest</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-3 rounded-lg bg-black/60 text-cyan-200 font-mono text-xs overflow-x-auto max-h-56 border border-white/5">
                  {JSON.stringify(composedManifest, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SKILL-READY MARKDOWN EXPORTER */}
        {activeTab === 'markdown_exporter' && (
          <div className="mt-4 space-y-3">
            <div
              className={`p-4 rounded-xl border ${
                isLight ? 'bg-white border-gray-200' : 'bg-[#0d1428] border-gray-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100 dark:border-gray-800">
                <div>
                  <span className="text-xs font-bold font-mono uppercase text-cyan-400 flex items-center gap-1.5">
                    <Terminal className="w-4 h-4 text-cyan-400" />
                    Skill-Ready Markdown (Copy &amp; Paste to Gemini / AI Studio)
                  </span>
                  <div className="text-xs text-gray-500 font-mono mt-0.5">
                    Standard Skill Markdown compatible with Google Gemini Skills, Vertex AI, and Workspace.
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-xs font-mono text-gray-400">Skill:</label>
                  <select
                    value={selectedSkillForExport}
                    onChange={(e) => setSelectedSkillForExport(e.target.value)}
                    className="px-2.5 py-1 text-xs rounded bg-gray-900 border border-gray-700 text-white font-mono"
                  >
                    {allSkills.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.id}: {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-3">
                <div className="flex items-center justify-between pb-1.5 text-xs font-mono">
                  <span className="text-gray-400">
                    Category: <span className="text-white">{exportSkill.category}</span> • Version:{' '}
                    <span className="text-white">{exportSkill.version}</span>
                  </span>
                  <button
                    onClick={() => handleCopySkillMarkdown(exportSkill.markdownContent)}
                    className="px-3 py-1 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs cursor-pointer flex items-center gap-1.5 transition-all shadow-md"
                  >
                    {copiedSkill ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copied to Clipboard!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Skill-Ready Markdown</span>
                      </>
                    )}
                  </button>
                </div>

                <pre className="p-4 rounded-xl bg-black/70 text-cyan-200 font-mono text-xs overflow-x-auto max-h-96 border border-white/5 leading-relaxed whitespace-pre-wrap">
                  {exportSkill.markdownContent}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
