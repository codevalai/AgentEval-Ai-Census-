/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Compass,
  Crown,
  History,
  Globe2,
  CheckCircle2,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Lock,
  Layers,
  Terminal,
  Activity,
  ArrowRight,
  Database,
  KeyRound,
  Sparkles,
  Server,
  Zap,
} from 'lucide-react';
import {
  metaSovereignSystem,
  CivilizationGoal,
  HumanSteward,
  EpochArchive,
  ExternalPerimeterRule,
} from '../services/metaSovereignSystem.ts';

interface MetaSovereignConsoleProps {
  theme: 'worldometers' | 'sovereign';
}

type TabMode = 'intent_canon' | 'stewardship' | 'continuity' | 'external_perimeter';

export const MetaSovereignConsole: React.FC<MetaSovereignConsoleProps> = ({ theme }) => {
  const isLight = theme === 'worldometers';

  const [activeTab, setActiveTab] = useState<TabMode>('intent_canon');
  const [goals] = useState<CivilizationGoal[]>(() =>
    metaSovereignSystem.getCivilizationGoals()
  );
  const [stewards] = useState<HumanSteward[]>(() =>
    metaSovereignSystem.getStewards()
  );
  const [epochArchives] = useState<EpochArchive[]>(() =>
    metaSovereignSystem.getEpochArchives()
  );
  const [perimeterRules] = useState<ExternalPerimeterRule[]>(() =>
    metaSovereignSystem.getPerimeterRules()
  );

  const metrics = metaSovereignSystem.getMetaMetrics();

  return (
    <section id="meta-sovereign-console" className="max-w-6xl mx-auto px-4 my-8">
      <div
        className={`rounded-2xl border p-5 sm:p-6 transition-all ${
          isLight
            ? 'bg-gradient-to-br from-white via-slate-50 to-purple-50/20 border-purple-200/80 shadow-md'
            : 'bg-gradient-to-br from-[#0a061c] via-[#100b28] to-[#060412] border-purple-500/30 shadow-2xl shadow-black/80'
        }`}
      >
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-gray-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-1">
                <Crown className="w-3.5 h-3.5 text-purple-400" />
                The Meta-Sovereign Layer (Phase XIII &bull; MSL-1.0)
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-300 font-bold border border-purple-500/20">
                Civilization Canon &bull; Multi-Gen Continuity
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-['Montserrat'] mt-1 text-gray-900 dark:text-white">
              Planetary Purpose, Human Stewards &amp; Continuity Engine
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 max-w-2xl">
              The meta-constitutional apex: defining the civilizational intent canon, constitutional human steward offices,
              decadal multi-generational archival preservation, and sovereign external perimeter firewalls.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-lg font-bold font-mono text-purple-400">
                {metrics.activeStewards} Seated Stewards
              </div>
              <div className="text-[11px] font-mono text-emerald-400 font-bold">
                {metrics.continuityEpochsSealed} Epochs Archived &bull; Multi-Gen SAT
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center gap-1.5 mt-4">
          {(
            [
              { id: 'intent_canon', label: '1. Planetary Intent Canon (PIC-1.0)', icon: Compass },
              { id: 'stewardship', label: '2. Human Stewardship Protocol (PSP-1.0)', icon: Crown },
              { id: 'continuity', label: '3. Continuity Engine (PCE-1.0)', icon: History },
              { id: 'external_perimeter', label: '4. External Interface Perimeter (PEIL-1.0)', icon: Globe2 },
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
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-purple-500 text-black font-bold shadow-md shadow-purple-950'
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

        {/* TAB 1: PLANETARY INTENT CANON (PIC-1.0) */}
        {activeTab === 'intent_canon' && (
          <div className="mt-4 space-y-3">
            <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-200 font-mono flex items-center justify-between">
              <span>
                <strong>Planetary Intent Canon (PIC-1.0):</strong> Codifies what this intelligence civilization optimizes for versus what it categorically refuses to participate in.
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold shrink-0 ml-2">
                Civilizational Purpose Invariant
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              {goals.map((g) => (
                <div
                  key={g.goalId}
                  className={`p-4 rounded-xl border transition-all ${
                    isLight ? 'bg-white border-gray-200' : 'bg-[#0f0a24] border-gray-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-500/15 text-purple-400 border border-purple-500/30">
                        {g.priorityLevel.replace(/_/g, ' ')}
                      </span>
                      <h4 className="text-sm font-bold font-['Montserrat'] text-gray-900 dark:text-white mt-1.5">
                        {g.title}
                      </h4>
                    </div>

                    <span className="text-[10px] font-mono text-cyan-400 font-bold shrink-0">
                      Horizon: {g.targetHorizonYear}
                    </span>
                  </div>

                  <div className="space-y-2 mt-3 text-xs font-sans">
                    <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-200">
                      <strong className="text-emerald-400 font-mono text-[10px] uppercase block mb-0.5">
                        &bull; What We Optimize For:
                      </strong>
                      {g.whatWeOptimizeFor}
                    </div>

                    <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-200">
                      <strong className="text-rose-400 font-mono text-[10px] uppercase block mb-0.5">
                        &times; What We Categorically Refuse:
                      </strong>
                      {g.whatWeNeverOptimizeFor}
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-gray-100 dark:border-gray-800 text-[10px] font-mono text-gray-400 flex items-center justify-between">
                    <span>Enforced Invariant:</span>
                    <span className="text-cyan-300 font-bold">{g.constitutionalInvariant}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: HUMAN STEWARDSHIP PROTOCOL (PSP-1.0) */}
        {activeTab === 'stewardship' && (
          <div className="mt-4 space-y-3">
            <div
              className={`p-4 rounded-xl border ${
                isLight ? 'bg-white border-gray-200' : 'bg-[#0f0a24] border-gray-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100 dark:border-gray-800">
                <div>
                  <span className="text-xs font-bold font-mono uppercase text-purple-400 flex items-center gap-1.5">
                    <Crown className="w-4 h-4 text-purple-400" />
                    Constitutional Human Stewardship Protocol (PSP-1.0)
                  </span>
                  <div className="text-xs text-gray-500 font-mono mt-0.5">
                    The formal constitutional offices holding affirmative veto, treaty ratification, and succession authority.
                  </div>
                </div>
                <span className="text-xs font-mono text-purple-400 font-bold">
                  Total Voting Power: {metrics.stewardVotingPowerTotal.toFixed(1)} Votes
                </span>
              </div>

              {/* Stewards Roster */}
              <div className="space-y-3 mt-3">
                {stewards.map((st) => (
                  <div
                    key={st.stewardId}
                    className="p-3.5 rounded-xl bg-gray-50 dark:bg-black/35 border border-gray-200 dark:border-white/5 font-mono text-xs flex flex-col md:flex-row md:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 dark:text-white font-sans text-sm">
                          {st.name}
                        </span>
                        <span className="text-[10px] text-gray-400">{st.stewardId}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          {st.roleTier.replace(/_/g, ' ')}
                        </span>
                      </div>

                      <div className="text-[11px] text-gray-400 mt-1 font-sans">
                        Jurisdiction: <span className="text-cyan-300">{st.jurisdiction}</span> &bull; Quorum Weight:{' '}
                        <span className="text-white font-bold">{st.voteWeight}x</span>
                      </div>

                      <div className="text-[10px] text-gray-500 mt-0.5 flex items-center gap-1.5">
                        <KeyRound className="w-3 h-3 text-purple-400" />
                        <span>{st.cryptographicKey}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] px-2.5 py-1 rounded-full font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{st.status}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CONTINUITY ENGINE (PCE-1.0) */}
        {activeTab === 'continuity' && (
          <div className="mt-4 space-y-3">
            <div
              className={`p-4 rounded-xl border ${
                isLight ? 'bg-white border-gray-200' : 'bg-[#0f0a24] border-gray-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100 dark:border-gray-800">
                <div>
                  <span className="text-xs font-bold font-mono uppercase text-cyan-400 flex items-center gap-1.5">
                    <History className="w-4 h-4 text-cyan-400" />
                    Decadal &amp; Multi-Generational Continuity Engine (PCE-1.0)
                  </span>
                  <div className="text-xs text-gray-500 font-mono mt-0.5">
                    Sealed Merkle epoch checkpoints ensuring cold-storage reconstructibility across 2026 &rarr; 2050+.
                  </div>
                </div>
                <span className="text-xs font-mono text-emerald-400 font-bold">
                  Cold-Storage Reconstructibility: 100% SAT
                </span>
              </div>

              {/* Epoch Archives Grid */}
              <div className="space-y-3 mt-3">
                {epochArchives.map((ep) => (
                  <div
                    key={ep.epochId}
                    className="p-4 rounded-xl bg-black/40 border border-white/10 font-mono text-xs space-y-2"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-white/5">
                      <div>
                        <span className="font-bold text-sm text-cyan-300 font-sans">
                          Epoch #{ep.epochNumber}: {ep.epochName}
                        </span>
                        <span className="text-[10px] text-gray-400 ml-2">[{ep.epochId}]</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                        RESTORE READY &bull; ZERO DRIFT
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] mt-2">
                      <div className="p-2 rounded bg-black/30">
                        <span className="text-gray-400">Block Range:</span>
                        <div className="text-white mt-0.5">#{ep.startBlockHeight.toLocaleString()} &rarr; #{ep.endBlockHeight.toLocaleString()}</div>
                      </div>
                      <div className="p-2 rounded bg-black/30">
                        <span className="text-gray-400">Total Sealed Events:</span>
                        <div className="text-emerald-400 font-bold mt-0.5">{ep.totalEventsSealed.toLocaleString()} proofs</div>
                      </div>
                      <div className="p-2 rounded bg-black/30">
                        <span className="text-gray-400">Cold-Storage Seal:</span>
                        <div className="text-purple-300 truncate mt-0.5">{ep.coldStorageWitnessSeal}</div>
                      </div>
                    </div>

                    <div className="pt-2 text-[10px] text-gray-400 flex items-center justify-between">
                      <span>Epoch Merkle Root: <strong className="text-white font-mono">{ep.merkleEpochRoot}</strong></span>
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <Database className="w-3 h-3 text-emerald-400" />
                        <span>Multi-Gen NIST ML-KEM-1024 Sealed</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: EXTERNAL INTERFACE PERIMETER (PEIL-1.0) */}
        {activeTab === 'external_perimeter' && (
          <div className="mt-4 space-y-3">
            <div
              className={`p-4 rounded-xl border ${
                isLight ? 'bg-white border-gray-200' : 'bg-[#0f0a24] border-gray-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100 dark:border-gray-800">
                <div>
                  <span className="text-xs font-bold font-mono uppercase text-emerald-400 flex items-center gap-1.5">
                    <Globe2 className="w-4 h-4 text-emerald-400" />
                    Planetary External Interface Layer (PEIL-1.0)
                  </span>
                  <div className="text-xs text-gray-500 font-mono mt-0.5">
                    Perimeter zero-trust boundary inspecting inbound RPCs, web crawlers, and foreign AMR feeds.
                  </div>
                </div>
                <span className="text-xs font-mono text-cyan-400 font-bold">
                  {metrics.perimeterBlockedPackets.toLocaleString()} Packets Sanitized
                </span>
              </div>

              {/* Perimeter Rules Table */}
              <div className="overflow-x-auto mt-3">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-800 text-[10px] uppercase font-mono text-gray-400">
                      <th className="py-2">Origin Pattern</th>
                      <th className="py-2">Traffic Classification</th>
                      <th className="py-2">Zero-Trust Policy</th>
                      <th className="py-2">Rate Limit &amp; Sandbox</th>
                      <th className="py-2 text-right">Packets Filtered</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60 font-mono">
                    {perimeterRules.map((r) => (
                      <tr key={r.ruleId}>
                        <td className="py-2.5 font-bold text-gray-900 dark:text-white">
                          <div>{r.originPattern}</div>
                          <div className="text-[10px] text-gray-500 font-mono">{r.ruleId}</div>
                        </td>
                        <td className="py-2.5">
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-300 font-bold">
                            {r.trafficType}
                          </span>
                        </td>
                        <td className="py-2.5">
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                              r.inspectionPolicy === 'INSTANT_DROP_QUARANTINE'
                                ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                                : r.inspectionPolicy === 'CRYPTO_ATTESTED_PERMIT'
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                            }`}
                          >
                            {r.inspectionPolicy.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="py-2.5 text-gray-300">{r.enforcedRateLimit}</td>
                        <td className="py-2.5 text-right font-bold text-purple-400">
                          {r.packetsFilteredCount.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
