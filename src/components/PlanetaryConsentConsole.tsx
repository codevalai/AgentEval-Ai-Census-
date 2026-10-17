/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ShieldAlert,
  HeartHandshake,
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lock,
  Unlock,
  Scale,
  Sparkles,
  BookOpen,
  UserCheck,
  History,
  FileCheck,
  Shield,
  ShieldCheck,
  Layers,
} from 'lucide-react';
import {
  planetarySafetyAndConsent,
  HumanCharterClause,
  PlanetarySafetyRule,
  ConsentCheckpoint,
  RollbackSnapshot,
} from '../services/planetarySafetyAndConsent.ts';

interface PlanetaryConsentConsoleProps {
  theme: 'worldometers' | 'sovereign';
}

type TabMode = 'charter' | 'consent_queue' | 'safety_envelope' | 'rollback_station';

export const PlanetaryConsentConsole: React.FC<PlanetaryConsentConsoleProps> = ({ theme }) => {
  const isLight = theme === 'worldometers';

  const [activeTab, setActiveTab] = useState<TabMode>('charter');
  const [clauses] = useState<HumanCharterClause[]>(() =>
    planetarySafetyAndConsent.getCharterClauses()
  );
  const [safetyRules] = useState<PlanetarySafetyRule[]>(() =>
    planetarySafetyAndConsent.getSafetyRules()
  );
  const [consentQueue, setConsentQueue] = useState<ConsentCheckpoint[]>(() =>
    planetarySafetyAndConsent.getConsentQueue()
  );
  const [rollbackSnapshots, setRollbackSnapshots] = useState<RollbackSnapshot[]>(() =>
    planetarySafetyAndConsent.getRollbackSnapshots()
  );
  const [isDefconLocked, setIsDefconLocked] = useState<boolean>(() =>
    planetarySafetyAndConsent.isDefconLocked()
  );
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  const handleResolveConsent = (
    checkpointId: string,
    decision: 'APPROVED_BY_HUMAN' | 'VETOED_BY_HUMAN'
  ) => {
    const note = decision === 'APPROVED_BY_HUMAN' ? 'Affirmative human steward consent granted.' : 'Human steward veto exercised under Clause 1.';
    planetarySafetyAndConsent.resolveConsentCheckpoint(checkpointId, decision, note);
    setConsentQueue([...planetarySafetyAndConsent.getConsentQueue()]);
    setActionSuccessMsg(`Consent checkpoint ${checkpointId} marked as ${decision}.`);
    setTimeout(() => setActionSuccessMsg(null), 4000);
  };

  const handleExecuteRollback = (snapshotId: string) => {
    const res = planetarySafetyAndConsent.executeRollback(snapshotId);
    if (res) {
      setRollbackSnapshots([...planetarySafetyAndConsent.getRollbackSnapshots()]);
      setActionSuccessMsg(
        `⚡ Rollback executed for ${res.agentName}! Reversible Merkle tombstone stamped: ${res.tombstoneHash?.slice(0, 14)}...`
      );
      setTimeout(() => setActionSuccessMsg(null), 6000);
    }
  };

  const handleToggleDefcon = () => {
    const newState = planetarySafetyAndConsent.toggleDefconLockdown();
    setIsDefconLocked(newState);
    setActionSuccessMsg(
      newState
        ? '🚨 DEFCON 1 GLOBAL LOCKDOWN ACTIVATED! All evolution proposals and workflow actuation frozen.'
        : '🟢 DEFCON State restored to NORMAL. Planetary coordination resumed.'
    );
    setTimeout(() => setActionSuccessMsg(null), 5000);
  };

  return (
    <section id="planetary-consent-console" className="max-w-6xl mx-auto px-4 my-8">
      <div
        className={`rounded-2xl border p-5 sm:p-6 transition-all ${
          isLight
            ? 'bg-gradient-to-br from-white via-slate-50 to-emerald-50/20 border-emerald-200/80 shadow-md'
            : 'bg-gradient-to-br from-[#050b18] via-[#091326] to-[#040812] border-emerald-500/30 shadow-2xl shadow-black/70'
        }`}
      >
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-gray-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <HeartHandshake className="w-3.5 h-3.5 text-emerald-400" />
                The Human &amp; Resilience Triad (Phase XI)
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 font-bold border border-emerald-500/20">
                PCL-1.0 Consent &bull; PSE-1.0 Safety &bull; PRR-1.0 Rollback
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-['Montserrat'] mt-1 text-gray-900 dark:text-white">
              Planetary Safety Envelope &amp; Human Consent Station
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 max-w-2xl">
              Anchoring the civilization in human dignity: the 10 Non-Negotiable Human Clauses, affirmative human veto checkpoints,
              hard safety boundaries against harm, and cryptographic Merkle rollback capabilities.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs font-mono text-gray-400">Human Supremacy:</div>
              <div className="text-sm font-bold font-mono text-emerald-400 flex items-center justify-end gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>CLAUSE 1 ACTIVE</span>
              </div>
            </div>

            <button
              onClick={handleToggleDefcon}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono cursor-pointer transition-all flex items-center gap-1.5 ${
                isDefconLocked
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg animate-pulse'
                  : 'bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700'
              }`}
            >
              {isDefconLocked ? (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>DEFCON 1 ACTIVE</span>
                </>
              ) : (
                <>
                  <Unlock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>DEFCON NORMAL</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Global Feedback Banner */}
        {actionSuccessMsg && (
          <div className="mt-3 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-xs font-mono text-emerald-300 font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{actionSuccessMsg}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center gap-1.5 mt-4">
          {(
            [
              { id: 'charter', label: '1. Human Charter (10 Clauses)', icon: BookOpen },
              { id: 'consent_queue', label: '2. Human Consent Queue', icon: UserCheck },
              { id: 'safety_envelope', label: '3. Planetary Safety Envelope', icon: ShieldAlert },
              { id: 'rollback_station', label: '4. Reversible Rollback Station', icon: RotateCcw },
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
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-emerald-500 text-black font-bold shadow-md shadow-emerald-950'
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

        {/* TAB 1: THE 10 NON-NEGOTIABLE HUMAN CLAUSES */}
        {activeTab === 'charter' && (
          <div className="mt-4 space-y-3">
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-200 font-mono flex items-center justify-between">
              <span>
                <strong>Planetary Human Charter (PEC-1.0):</strong> The foundational moral contract binding all AI models, swarms, and kernels under absolute human sovereignty.
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold shrink-0 ml-2">
                10 Invariant Clauses
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              {clauses.map((clause) => (
                <div
                  key={clause.clauseNumber}
                  className={`p-4 rounded-xl border transition-all ${
                    isLight ? 'bg-white border-gray-200' : 'bg-[#091224] border-gray-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        CLAUSE {clause.clauseNumber}
                      </span>
                      <h4 className="text-sm font-bold font-['Montserrat'] text-gray-900 dark:text-white mt-1.5">
                        {clause.title}
                      </h4>
                    </div>

                    <span className="text-[10px] font-mono text-gray-400 text-right">
                      {clause.protectedHumanRight}
                    </span>
                  </div>

                  <p className="text-xs text-gray-700 dark:text-gray-300 mt-2.5 leading-relaxed font-sans font-medium">
                    &ldquo;{clause.plainLanguageText}&rdquo;
                  </p>

                  <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-2 border-t border-gray-100 dark:border-gray-800 text-[10px] font-mono text-gray-400">
                    <span className="text-gray-500">Enforced Invariants:</span>
                    {clause.enforcedInvariants.map((inv) => (
                      <span key={inv} className="px-1.5 py-0.5 rounded bg-black/30 text-cyan-300 border border-white/5">
                        {inv}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: HUMAN CONSENT & VETO CHECKPOINTS */}
        {activeTab === 'consent_queue' && (
          <div className="mt-4 space-y-3">
            <div
              className={`p-4 rounded-xl border ${
                isLight ? 'bg-white border-gray-200' : 'bg-[#091224] border-gray-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100 dark:border-gray-800">
                <div>
                  <span className="text-xs font-bold font-mono uppercase text-emerald-400 flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-emerald-400" />
                    Human Consent &amp; Veto Checkpoint Queue (PCL-1.0)
                  </span>
                  <div className="text-xs text-gray-500 font-mono mt-0.5">
                    High-impact evolutionary proposals and treaty modifications paused awaiting human confirmation.
                  </div>
                </div>
                <span className="text-xs font-mono text-amber-400 font-bold">
                  {consentQueue.filter((c) => c.status === 'AWAITING_HUMAN_APPROVAL').length} Pending Checkpoints
                </span>
              </div>

              {/* Checkpoint Queue Cards */}
              <div className="space-y-3 mt-3">
                {consentQueue.map((chk) => (
                  <div
                    key={chk.checkpointId}
                    className="p-3.5 rounded-xl bg-gray-50 dark:bg-black/35 border border-gray-200 dark:border-white/5 font-mono text-xs flex flex-col md:flex-row md:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 dark:text-white font-sans text-sm">
                          {chk.actionType.replace(/_/g, ' ')}
                        </span>
                        <span className="text-[10px] text-gray-400">{chk.checkpointId}</span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                            chk.status === 'APPROVED_BY_HUMAN'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                              : chk.status === 'VETOED_BY_HUMAN'
                              ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                              : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          }`}
                        >
                          {chk.status.replace(/_/g, ' ')}
                        </span>
                      </div>

                      <p className="text-xs text-gray-300 mt-1 font-sans">{chk.description}</p>

                      <div className="text-[10px] text-gray-400 mt-1">
                        Source: <span className="text-white">{chk.sourceEntity}</span> &bull; Risk Assessment:{' '}
                        <span className="text-amber-400 font-bold">{chk.humanRiskAssessment}</span> &bull; Proof:{' '}
                        {chk.proofWitness.slice(0, 10)}...
                      </div>

                      {chk.decisionNote && (
                        <div className="text-[11px] text-emerald-400 mt-1">
                          Decision Note: &ldquo;{chk.decisionNote}&rdquo;
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    {chk.status === 'AWAITING_HUMAN_APPROVAL' && (
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleResolveConsent(chk.checkpointId, 'APPROVED_BY_HUMAN')}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer flex items-center gap-1 shadow-md"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleResolveConsent(chk.checkpointId, 'VETOED_BY_HUMAN')}
                          className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs cursor-pointer flex items-center gap-1 shadow-md"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Veto</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PLANETARY SAFETY ENVELOPE (PSE-1.0) */}
        {activeTab === 'safety_envelope' && (
          <div className="mt-4 space-y-3">
            <div
              className={`p-4 rounded-xl border ${
                isLight ? 'bg-white border-gray-200' : 'bg-[#091224] border-gray-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100 dark:border-gray-800">
                <div>
                  <span className="text-xs font-bold font-mono uppercase text-rose-400 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-rose-400" />
                    Planetary Safety Envelope &amp; Red-Line Boundaries (PSE-1.0)
                  </span>
                  <div className="text-xs text-gray-500 font-mono mt-0.5">
                    Strict mathematical and physical constraints that zero models, swarms, or actuators may cross.
                  </div>
                </div>
                <span className="text-xs font-mono text-emerald-400 font-bold">
                  0 Active Red-Line Breaches
                </span>
              </div>

              {/* Safety Rules Table */}
              <div className="overflow-x-auto mt-3">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-800 text-[10px] uppercase font-mono text-gray-400">
                      <th className="py-2">Rule ID &amp; Title</th>
                      <th className="py-2">Category</th>
                      <th className="py-2">Hard Boundary Description</th>
                      <th className="py-2">Enforcement Action</th>
                      <th className="py-2 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60 font-mono">
                    {safetyRules.map((r) => (
                      <tr key={r.ruleId}>
                        <td className="py-2.5 font-sans font-bold text-gray-900 dark:text-white">
                          <div>{r.title}</div>
                          <div className="text-[10px] text-gray-400 font-mono">{r.ruleId}</div>
                        </td>
                        <td className="py-2.5">
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-300 font-bold border border-rose-500/30">
                            {r.category}
                          </span>
                        </td>
                        <td className="py-2.5 text-gray-300 max-w-sm">{r.description}</td>
                        <td className="py-2.5 text-amber-400">{r.penaltyOrAction}</td>
                        <td className="py-2.5 text-right font-bold text-emerald-400 flex items-center justify-end gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span>{r.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: REVERSIBLE ROLLBACK & RECOVERY (PRR-1.0) */}
        {activeTab === 'rollback_station' && (
          <div className="mt-4 space-y-3">
            <div
              className={`p-4 rounded-xl border ${
                isLight ? 'bg-white border-gray-200' : 'bg-[#091224] border-gray-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100 dark:border-gray-800">
                <div>
                  <span className="text-xs font-bold font-mono uppercase text-cyan-400 flex items-center gap-1.5">
                    <RotateCcw className="w-4 h-4 text-cyan-400" />
                    Planetary Rollback &amp; Recovery Station (PRR-1.0)
                  </span>
                  <div className="text-xs text-gray-500 font-mono mt-0.5">
                    One-click reversible restoration without erasing historical truth; anchored via cryptographic Merkle tombstones.
                  </div>
                </div>
                <span className="text-xs font-mono text-cyan-400 font-bold">
                  {rollbackSnapshots.filter((s) => s.canRollback).length} Reversible Snapshots Available
                </span>
              </div>

              {/* Snapshots Grid */}
              <div className="space-y-3 mt-3">
                {rollbackSnapshots.map((snap) => (
                  <div
                    key={snap.snapshotId}
                    className="p-3.5 rounded-xl bg-gray-50 dark:bg-black/35 border border-gray-200 dark:border-white/5 font-mono text-xs flex flex-col md:flex-row md:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 dark:text-white font-sans text-sm">
                          {snap.agentName}
                        </span>
                        <span className="text-[10px] text-gray-400">{snap.snapshotId}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-purple-500/20 text-purple-300">
                          Pre-Upgrade Grade: {snap.preUpgradeGrade}
                        </span>
                      </div>

                      <div className="text-[11px] text-gray-400 mt-1">
                        Pre-Upgrade Lattice:{' '}
                        <span className="text-cyan-300 font-bold">{snap.preUpgradeLattice.join(' • ')}</span> &bull; Base IQ: {snap.preUpgradeIQ}
                      </div>

                      {snap.tombstoneHash && (
                        <div className="text-[10px] text-emerald-400 mt-1">
                          Tombstone Anchored in PIL-1.0: {snap.tombstoneHash}
                        </div>
                      )}
                    </div>

                    {/* Rollback Trigger */}
                    <div>
                      {snap.canRollback ? (
                        <button
                          onClick={() => handleExecuteRollback(snap.snapshotId)}
                          className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs cursor-pointer flex items-center gap-1.5 shadow-md"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Execute Merkle Rollback</span>
                        </button>
                      ) : (
                        <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Rollback Applied (Tombstoned)</span>
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
