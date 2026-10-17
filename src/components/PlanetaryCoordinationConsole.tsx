/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Compass,
  Cpu,
  Layers,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle2,
  RefreshCw,
  GitBranch,
  FileCode,
  Terminal,
  Clock,
  Sparkles,
  Scale,
  Activity,
  AlertTriangle,
  History,
  Send,
  PlusCircle,
} from 'lucide-react';
import {
  planetarySkillSpine,
  GovernedAgentRecord,
  LifecycleStage,
  IntelligenceLedgerEntry,
  EvolutionProposal,
  RouterDispatchDecision,
} from '../services/planetarySkillSpine.ts';

interface PlanetaryCoordinationConsoleProps {
  theme: 'worldometers' | 'sovereign';
}

type TabMode = 'lifecycle' | 'router' | 'ledger' | 'evolution';

const BENCHMARK_ROUTER_INTENTS = [
  {
    title: '1893-S Morgan Silver Dollar Multi-Plate Intake',
    intent: 'Specimen intake for 1893-S Morgan. Analyze high-point wear, obverse cartwheel luster, and strike quality.',
  },
  {
    title: 'Zurich Accord Cross-Border Parity Settlement',
    intent: 'Cross-border registry consensus settlement under Zurich Accord treaty clauses and BFT quorum verification.',
  },
  {
    title: 'OpenClaw Robotics AMR 500Hz Actuator Torque Burst',
    intent: 'Factory AMR reports kinetic torque exceeding safety envelope. Requesting autonomous code upgrade and clamp injection.',
  },
  {
    title: 'Counterfeit Transfer Die Genome Anomaly Surveillance',
    intent: 'Microscopic spark-erosion pit cluster detected on reverse denticles. Requesting metallurgical genome profile comparison.',
  },
];

export const PlanetaryCoordinationConsole: React.FC<PlanetaryCoordinationConsoleProps> = ({ theme }) => {
  const isLight = theme === 'worldometers';

  const [activeTab, setActiveTab] = useState<TabMode>('lifecycle');
  const [governedAgents, setGovernedAgents] = useState<GovernedAgentRecord[]>(() =>
    planetarySkillSpine.getGovernedAgents()
  );
  const [ledger, setLedger] = useState<IntelligenceLedgerEntry[]>(() =>
    planetarySkillSpine.getLedger()
  );
  const [evolutionProposals, setEvolutionProposals] = useState<EvolutionProposal[]>(() =>
    planetarySkillSpine.getEvolutionProposals()
  );
  const [blockHeight, setBlockHeight] = useState<number>(() =>
    planetarySkillSpine.getCurrentBlockHeight()
  );

  // Router State
  const [routerInput, setRouterInput] = useState<string>(BENCHMARK_ROUTER_INTENTS[0].intent);
  const [dispatchResult, setDispatchResult] = useState<RouterDispatchDecision | null>(null);

  // Evolution Form State
  const [proposalTitle, setProposalTitle] = useState<string>('Continuous Photogrammetric Hologram Profiler (PHP-1.0)');
  const [proposalRationale, setProposalRationale] = useState<string>(
    'Enables multi-angle spectral diffraction mapping of original mint luster on ultra-rarity proof specimens.'
  );
  const [proposalIQImpact, setProposalIQImpact] = useState<number>(5.4);
  const [evolutionSuccessMessage, setEvolutionSuccessMessage] = useState<string | null>(null);

  const handleAdvanceStage = (agentId: string, nextStage: LifecycleStage) => {
    const updated = planetarySkillSpine.advanceAgentStage(agentId, nextStage, 'Admin transition via PSCL-1.0 Console.');
    if (updated) {
      setGovernedAgents(planetarySkillSpine.getGovernedAgents());
      setLedger([...planetarySkillSpine.getLedger()]);
      setBlockHeight(planetarySkillSpine.getCurrentBlockHeight());
    }
  };

  const handleDispatchRouter = () => {
    if (!routerInput.trim()) return;
    const decision = planetarySkillSpine.routeWorkflow('WORKFLOW_DISPATCH', routerInput);
    setDispatchResult(decision);
  };

  const handleSubmitProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposalTitle.trim()) return;

    planetarySkillSpine.submitEvolutionProposal({
      proposalType: 'NEW_SKILL',
      title: proposalTitle,
      rationale: proposalRationale,
      targetEntities: ['CoinRarity Pro', 'Sovereign Kernel', 'GSNA'],
      projectedIQImpact: proposalIQImpact,
      constitutionalSafetyProof: 'SIM-1.0_Z3_SATISFIED_PROPOSAL',
    });

    setEvolutionProposals([...planetarySkillSpine.getEvolutionProposals()]);
    setEvolutionSuccessMessage(`🎉 Evolution proposal "${proposalTitle}" submitted to the Planetary Evolution Engine!`);
    setTimeout(() => setEvolutionSuccessMessage(null), 5000);
  };

  const getStageBadge = (stage: LifecycleStage) => {
    switch (stage) {
      case 'GOVERNED_BIRTH':
        return 'bg-blue-500/20 text-blue-300 border-blue-400/40';
      case 'CONTINUOUS_EVALUATION':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40';
      case 'AUTONOMOUS_UPGRADE':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40';
      case 'REPLAY_AUDIT':
        return 'bg-amber-500/20 text-amber-300 border-amber-400/40';
      case 'RETIRED_TOMBSTONE':
        return 'bg-rose-500/20 text-rose-300 border-rose-400/40';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-400/40';
    }
  };

  return (
    <section id="planetary-coordination-console" className="max-w-6xl mx-auto px-4 my-8">
      <div
        className={`rounded-2xl border p-5 sm:p-6 transition-all ${
          isLight
            ? 'bg-gradient-to-br from-white via-slate-50 to-blue-50/20 border-blue-200/80 shadow-md'
            : 'bg-gradient-to-br from-[#060a1a] via-[#09112a] to-[#040814] border-cyan-500/30 shadow-2xl shadow-black/70'
        }`}
      >
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-gray-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 text-cyan-400" />
                Planetary Sovereign Coordination Layer (PSCL-1.0)
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 font-bold border border-cyan-500/20">
                Phase X Operational
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-['Montserrat'] mt-1 text-gray-900 dark:text-white">
              Planetary Skill Spine &amp; Governed Intelligence Mesh
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 max-w-2xl">
              The unifying connective tissue enforcing governed agent lifecycles, autonomous intelligence routing,
              immutable Merkle ledger history, and self-evolving constitutional proposals.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-lg font-bold font-mono text-cyan-600 dark:text-cyan-400">
                Block #{blockHeight.toLocaleString()}
              </div>
              <div className="text-[11px] font-mono text-gray-400">
                {governedAgents.length} Governed Nodes • {ledger.length} Proofs
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center gap-1.5 mt-4">
          {(
            [
              { id: 'lifecycle', label: '1. Governed Agent Lifecycle (PALE-1.0)', icon: Activity },
              { id: 'router', label: '2. Intelligence Router (PIR-1.0)', icon: Compass },
              { id: 'ledger', label: '3. Intelligence Ledger (PIL-1.0)', icon: History },
              { id: 'evolution', label: '4. Evolution Engine (PEE-1.0)', icon: Sparkles },
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

        {/* TAB 1: GOVERNED AGENT LIFECYCLE (PALE-1.0) */}
        {activeTab === 'lifecycle' && (
          <div className="mt-4 space-y-3">
            <div
              className={`p-4 rounded-xl border ${
                isLight ? 'bg-white border-gray-200' : 'bg-[#0b1228] border-gray-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100 dark:border-gray-800">
                <div>
                  <span className="text-xs font-bold font-mono uppercase text-cyan-400">
                    Governed Agent Lifecycle Pipeline (PALE-1.0)
                  </span>
                  <div className="text-xs text-gray-500 font-mono mt-0.5">
                    Governed Birth (CIP-1.0) &rarr; Continuous Evaluation (CEP-2.0) &rarr; Autonomous Upgrade (CUP-5.0) &rarr; Replay Audit (CAP-4.0) &rarr; Tombstone
                  </div>
                </div>
                <span className="text-xs font-mono text-emerald-400 font-bold">
                  SIM-1.0 + SKG-1.1 Strictly Enforced
                </span>
              </div>

              {/* Governed Agents Pipeline Cards */}
              <div className="space-y-3 mt-3">
                {governedAgents.map((ag) => (
                  <div
                    key={ag.agentId}
                    className="p-3.5 rounded-xl bg-gray-50 dark:bg-black/35 border border-gray-200 dark:border-white/5 font-mono text-xs flex flex-col md:flex-row md:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 dark:text-white font-sans text-sm">
                          {ag.name}
                        </span>
                        <span className="text-[10px] text-gray-400">{ag.agentId}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${getStageBadge(ag.stage)}`}>
                          {ag.stage.replace(/_/g, ' ')}
                        </span>
                      </div>

                      <div className="text-[11px] text-gray-400 mt-1">
                        Effective Skill Lattice:{' '}
                        <span className="text-cyan-300 font-bold">{ag.effectiveSkillLattice.join(' • ')}</span>
                      </div>

                      <div className="text-[10px] text-gray-500 mt-0.5">
                        Active Treaties: {ag.activeTreatyBinds.join(', ')} • Witness Seal: {ag.merkleWitnessSeal.slice(0, 12)}...
                      </div>
                    </div>

                    {/* Transition Controls */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[10px] text-gray-400 uppercase">Transition:</span>
                      <button
                        onClick={() => handleAdvanceStage(ag.agentId, 'CONTINUOUS_EVALUATION')}
                        className="px-2 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-[10px] cursor-pointer border border-cyan-500/30"
                      >
                        Evaluate
                      </button>
                      <button
                        onClick={() => handleAdvanceStage(ag.agentId, 'AUTONOMOUS_UPGRADE')}
                        className="px-2 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[10px] cursor-pointer border border-emerald-500/30"
                      >
                        Upgrade
                      </button>
                      <button
                        onClick={() => handleAdvanceStage(ag.agentId, 'REPLAY_AUDIT')}
                        className="px-2 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[10px] cursor-pointer border border-amber-500/30"
                      >
                        Audit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: INTELLIGENCE ROUTER (PIR-1.0) */}
        {activeTab === 'router' && (
          <div className="mt-4 space-y-3">
            <div
              className={`p-4 rounded-xl border ${
                isLight ? 'bg-white border-gray-200' : 'bg-[#0b1228] border-gray-800'
              }`}
            >
              <div className="pb-3 border-b border-gray-100 dark:border-gray-800">
                <span className="text-xs font-bold font-mono uppercase text-cyan-400 flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-cyan-400" />
                  Planetary Intelligence Router (PIR-1.0)
                </span>
                <div className="text-xs text-gray-500 font-mono mt-0.5">
                  Autonomous mission selector routing complex inputs to the appropriate institutional workflow.
                </div>
              </div>

              {/* Benchmark Presets */}
              <div className="mt-3">
                <span className="text-xs font-bold text-gray-400 font-mono">Load Router Benchmark Intent:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1.5">
                  {BENCHMARK_ROUTER_INTENTS.map((b, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setRouterInput(b.intent);
                        setDispatchResult(null);
                      }}
                      className="p-2.5 rounded-lg text-left text-xs bg-black/30 hover:bg-black/50 border border-white/5 text-gray-300 cursor-pointer transition-all"
                    >
                      <div className="font-bold text-cyan-300 font-mono">{b.title}</div>
                      <div className="text-[10px] text-gray-400 truncate mt-0.5">{b.intent}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Router Input Box */}
              <div className="mt-3">
                <div className="flex items-center justify-between pb-1 text-xs font-mono text-gray-400">
                  <span>Routing Intent / Specimen Payload:</span>
                  <button
                    onClick={handleDispatchRouter}
                    className="px-3 py-1 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs cursor-pointer flex items-center gap-1.5 transition-all shadow-md"
                  >
                    <Send className="w-3 h-3" />
                    <span>Route Workflow</span>
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={routerInput}
                  onChange={(e) => setRouterInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-700 bg-black/60 text-cyan-200 font-mono text-xs outline-hidden resize-none"
                />
              </div>

              {/* Router Dispatch Output */}
              {dispatchResult && (
                <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-950/60 to-black border border-cyan-500/40 mt-3 font-mono text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <span className="text-xs font-bold text-emerald-400 uppercase flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      PIR-1.0 Workflow Dispatched: {dispatchResult.workflowId}
                    </span>
                    <span className="text-[10px] text-gray-400">Proof: {dispatchResult.dispatchProof.slice(0, 14)}...</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                    <div className="p-2 rounded bg-black/40 border border-white/5">
                      <span className="text-[10px] text-gray-400">Governing Skill Cluster</span>
                      <div className="text-sm font-bold text-cyan-300 mt-0.5">{dispatchResult.governingSkills.join(' • ')}</div>
                    </div>
                    <div className="p-2 rounded bg-black/40 border border-white/5">
                      <span className="text-[10px] text-gray-400">Execution Authority</span>
                      <div className="text-sm font-bold text-emerald-400 mt-0.5">{dispatchResult.advisoryLevel}</div>
                    </div>
                  </div>

                  <p className="mt-3 text-gray-300 leading-relaxed bg-black/40 p-2.5 rounded border border-white/5">
                    {dispatchResult.routingRationale}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: INTELLIGENCE LEDGER (PIL-1.0) */}
        {activeTab === 'ledger' && (
          <div className="mt-4 space-y-3">
            <div
              className={`p-4 rounded-xl border ${
                isLight ? 'bg-white border-gray-200' : 'bg-[#0b1228] border-gray-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100 dark:border-gray-800">
                <div>
                  <span className="text-xs font-bold font-mono uppercase text-cyan-400 flex items-center gap-1.5">
                    <History className="w-4 h-4 text-cyan-400" />
                    Planetary Intelligence Ledger (PIL-1.0)
                  </span>
                  <div className="text-xs text-gray-500 font-mono mt-0.5">
                    Cryptographically immutable record of births, upgrades, treaty ratifications, and arbitrations.
                  </div>
                </div>
                <span className="text-xs font-mono text-cyan-400 font-bold">
                  Block Height #{blockHeight.toLocaleString()}
                </span>
              </div>

              {/* Ledger Table */}
              <div className="overflow-x-auto mt-3">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-800 text-[10px] uppercase font-mono text-gray-400">
                      <th className="py-2">Block #</th>
                      <th className="py-2">Event Type</th>
                      <th className="py-2">Primary Skill</th>
                      <th className="py-2">Summary Narrative</th>
                      <th className="py-2 text-right">Leaf Hash</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60 font-mono">
                    {ledger.map((entry) => (
                      <tr key={entry.ledgerId}>
                        <td className="py-2 text-cyan-400 font-bold">#{entry.blockHeight}</td>
                        <td className="py-2">
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-300 font-bold border border-cyan-500/30">
                            {entry.eventType}
                          </span>
                        </td>
                        <td className="py-2 text-purple-400 font-bold">{entry.primarySkillId}</td>
                        <td className="py-2 text-gray-300 max-w-md truncate">{entry.summary}</td>
                        <td className="py-2 text-right text-[10px] text-gray-400">
                          {entry.merkleLeafHash.slice(0, 10)}...
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: EVOLUTION ENGINE (PEE-1.0) */}
        {activeTab === 'evolution' && (
          <div className="mt-4 space-y-3">
            <div
              className={`p-4 rounded-xl border ${
                isLight ? 'bg-white border-gray-200' : 'bg-[#0b1228] border-gray-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100 dark:border-gray-800">
                <div>
                  <span className="text-xs font-bold font-mono uppercase text-cyan-400 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    Planetary Evolution Engine (PEE-1.0)
                  </span>
                  <div className="text-xs text-gray-500 font-mono mt-0.5">
                    Self-evolving governance proposals: new skills, treaty extensions, and kernel policy amendments.
                  </div>
                </div>
                <span className="text-xs font-mono text-purple-400 font-bold">
                  All Proposals Strictly Advisory
                </span>
              </div>

              {evolutionSuccessMessage && (
                <div className="my-2.5 p-2.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-xs font-mono text-emerald-300 font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{evolutionSuccessMessage}</span>
                </div>
              )}

              {/* Active Evolution Proposals */}
              <div className="space-y-2 mt-3">
                <span className="text-xs font-bold text-gray-400 font-mono">Active Proposals:</span>
                {evolutionProposals.map((prop) => (
                  <div
                    key={prop.proposalId}
                    className="p-3 rounded-xl bg-black/30 border border-white/5 font-mono text-xs flex flex-col md:flex-row md:items-center justify-between gap-2"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white font-sans">{prop.title}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold">
                          {prop.proposalType}
                        </span>
                        <span className="text-[10px] text-emerald-400 font-bold">
                          +{prop.projectedIQImpact} Swarm IQ
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{prop.rationale}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        {prop.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Submit New Advisory Proposal Form */}
              <form onSubmit={handleSubmitProposal} className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 space-y-3">
                <span className="text-xs font-bold text-gray-400 font-mono">Draft New Evolution Proposal:</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-mono text-gray-400 uppercase">Proposal Title</label>
                    <input
                      type="text"
                      value={proposalTitle}
                      onChange={(e) => setProposalTitle(e.target.value)}
                      className="w-full px-2.5 py-1 text-xs rounded border border-gray-700 bg-black/60 text-white font-mono mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-gray-400 uppercase">Projected IQ Lift</label>
                    <input
                      type="number"
                      step="0.1"
                      value={proposalIQImpact}
                      onChange={(e) => setProposalIQImpact(parseFloat(e.target.value) || 0)}
                      className="w-full px-2.5 py-1 text-xs rounded border border-gray-700 bg-black/60 text-white font-mono mt-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-mono text-gray-400 uppercase">Constitutional Rationale</label>
                  <textarea
                    rows={2}
                    value={proposalRationale}
                    onChange={(e) => setProposalRationale(e.target.value)}
                    className="w-full p-2 text-xs rounded border border-gray-700 bg-black/60 text-white font-mono mt-1 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white cursor-pointer flex items-center gap-1.5 transition-all shadow-md"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Submit Advisory Evolution Proposal</span>
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
