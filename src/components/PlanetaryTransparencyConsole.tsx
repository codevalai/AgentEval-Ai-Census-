/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Eye,
  FileText,
  Scale,
  Brain,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Lock,
  Layers,
  Terminal,
  Activity,
  UserCheck,
} from 'lucide-react';
import {
  planetaryTransparency,
  AgentReasoningTrace,
  ArbitrationNarrative,
  ArgonAdvisoryRecord,
} from '../services/planetaryTransparency.ts';
import { planetarySafetyAndConsent } from '../services/planetarySafetyAndConsent.ts';
import { planetarySkillSpine } from '../services/planetarySkillSpine.ts';

interface PlanetaryTransparencyConsoleProps {
  theme: 'worldometers' | 'sovereign';
}

type TabMode = 'traces' | 'arbitration_narratives' | 'argon_rationale' | 'transparency_dashboard';

export const PlanetaryTransparencyConsole: React.FC<PlanetaryTransparencyConsoleProps> = ({ theme }) => {
  const isLight = theme === 'worldometers';

  const [activeTab, setActiveTab] = useState<TabMode>('transparency_dashboard');
  const [traces] = useState<AgentReasoningTrace[]>(() =>
    planetaryTransparency.getReasoningTraces()
  );
  const [arbitrationNarratives] = useState<ArbitrationNarrative[]>(() =>
    planetaryTransparency.getArbitrationNarratives()
  );
  const [argonAdvisories] = useState<ArgonAdvisoryRecord[]>(() =>
    planetaryTransparency.getArgonAdvisories()
  );

  const metrics = planetaryTransparency.getTransparencyMetrics();
  const consentQueue = planetarySafetyAndConsent.getConsentQueue();
  const blockHeight = planetarySkillSpine.getCurrentBlockHeight();

  return (
    <section id="planetary-transparency-console" className="max-w-6xl mx-auto px-4 my-8">
      <div
        className={`rounded-2xl border p-5 sm:p-6 transition-all ${
          isLight
            ? 'bg-gradient-to-br from-white via-slate-50 to-cyan-50/20 border-cyan-200/80 shadow-md'
            : 'bg-gradient-to-br from-[#060e22] via-[#091530] to-[#040916] border-cyan-500/30 shadow-2xl shadow-black/70'
        }`}
      >
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-gray-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-cyan-400" />
                Planetary Interpretation &amp; Transparency Layer (PIT-1.0)
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 font-bold border border-cyan-500/20">
                Phase XII Final Integration
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-['Montserrat'] mt-1 text-gray-900 dark:text-white">
              Human Legibility &amp; Reasoning Transparency Dashboard
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 max-w-2xl">
              Fulfilling the Right to Comprehension (PEC-1.0 Clause 3): plain-language reasoning traces,
              constitutional arbitration narratives, Argon advisory boundaries, and transparent system state.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-lg font-bold font-mono text-cyan-600 dark:text-cyan-400">
                {metrics.plainLanguageLegibilityScore}% Legible
              </div>
              <div className="text-[11px] font-mono text-emerald-400 font-bold">
                Deterministic Code Supreme (100%)
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center gap-1.5 mt-4">
          {(
            [
              { id: 'transparency_dashboard', label: '1. Human Transparency Dashboard', icon: Activity },
              { id: 'traces', label: '2. Reasoning Traces (RTE-1.0)', icon: FileText },
              { id: 'arbitration_narratives', label: '3. Skill Arbitration Narratives', icon: Scale },
              { id: 'argon_rationale', label: '4. Argon Advisory Rationale', icon: Brain },
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
                      ? 'bg-cyan-600 text-white shadow-xs'
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

        {/* TAB 1: HUMAN TRANSPARENCY DASHBOARD (EXECUTIVE VIEW) */}
        {activeTab === 'transparency_dashboard' && (
          <div className="mt-4 space-y-4">
            {/* The 6 Core Human Legibility Answers */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
                <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold flex items-center gap-1">
                  <Activity className="w-3 h-3" />
                  1. What The System Is Doing
                </span>
                <p className="text-xs text-gray-200 font-sans mt-1.5 leading-relaxed">
                  Continuously auditing 76 agentic domains, validating specimen plates, monitoring robotic torque clamps, and verifying post-quantum cryptographic Merkle roots at Block #{blockHeight.toLocaleString()}.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30">
                <span className="text-[10px] font-mono uppercase text-purple-400 font-bold flex items-center gap-1">
                  <HelpCircle className="w-3 h-3" />
                  2. Why It Is Doing It
                </span>
                <p className="text-xs text-gray-200 font-sans mt-1.5 leading-relaxed">
                  To eliminate autonomous drift, protect authentic historical artifacts from counterfeits, and guarantee that artificial intelligence expands human flourishing without exceeding safety envelopes.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
                <span className="text-[10px] font-mono uppercase text-blue-400 font-bold flex items-center gap-1">
                  <Layers className="w-3 h-3" />
                  3. What Skills Are Active
                </span>
                <p className="text-xs text-gray-200 font-sans mt-1.5 leading-relaxed">
                  14 Sovereign Skills active across 12 Google Categories, governed by the SIM-1.0 Meta-Constitution, SKG-1.1 Zero-Trust, and SGP-1.0 Sheldon Invariants.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  4. What Safety Boundaries Are Checked
                </span>
                <p className="text-xs text-gray-200 font-sans mt-1.5 leading-relaxed">
                  PSE-1.0 enforces 0-breach red lines: zero biological synthesis, zero lethal autonomy, mandatory physical hardware E-stops, and RFC-003 64KB memory bounds.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
                <span className="text-[10px] font-mono uppercase text-amber-400 font-bold flex items-center gap-1">
                  <UserCheck className="w-3 h-3" />
                  5. What Human Consents Are Pending
                </span>
                <p className="text-xs text-gray-200 font-sans mt-1.5 leading-relaxed">
                  {consentQueue.filter((c) => c.status === 'AWAITING_HUMAN_APPROVAL').length} checkpoints currently paused in PCL-1.0. High-impact treaty and memory expansions require explicit steward approval.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30">
                <span className="text-[10px] font-mono uppercase text-rose-400 font-bold flex items-center gap-1">
                  <RotateCcw className="w-3 h-3" />
                  6. What Rollback Options Exist
                </span>
                <p className="text-xs text-gray-200 font-sans mt-1.5 leading-relaxed">
                  PRR-1.0 maintains pre-upgrade snapshots. Any drifted state can be reverted instantly using cryptographic Merkle tombstones, preserving historical truth while reversing errors.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: REASONING TRACES (RTE-1.0) */}
        {activeTab === 'traces' && (
          <div className="mt-4 space-y-3">
            <div
              className={`p-4 rounded-xl border ${
                isLight ? 'bg-white border-gray-200' : 'bg-[#091530] border-gray-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100 dark:border-gray-800">
                <div>
                  <span className="text-xs font-bold font-mono uppercase text-cyan-400 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-cyan-400" />
                    Plain-Language Reasoning Traces (RTE-1.0)
                  </span>
                  <div className="text-xs text-gray-500 font-mono mt-0.5">
                    Step-by-step audit showing the rationale, activated skills, and safety checks behind agent actions.
                  </div>
                </div>
                <span className="text-xs font-mono text-emerald-400 font-bold">
                  Zero Black-Box Obfuscation
                </span>
              </div>

              {/* Traces List */}
              <div className="space-y-4 mt-3">
                {traces.map((trace) => (
                  <div
                    key={trace.traceId}
                    className="p-4 rounded-xl bg-black/40 border border-white/10 font-mono text-xs space-y-2.5"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-white/5">
                      <div>
                        <span className="font-bold text-sm text-white font-sans">{trace.agentName}</span>
                        <span className="text-[10px] text-gray-400 ml-2">[{trace.traceId}]</span>
                      </div>
                      <span className="text-[10px] text-gray-400">
                        Leaf: {trace.merkleLeafHash.slice(0, 12)}...
                      </span>
                    </div>

                    <div className="text-gray-300 font-sans">
                      <strong>Intent:</strong> {trace.intentSummary}
                    </div>

                    {/* Step-by-Step Table */}
                    <div className="space-y-1.5 mt-2">
                      {trace.steps.map((st) => (
                        <div
                          key={st.stepNumber}
                          className="p-2.5 rounded-lg bg-black/30 border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-2"
                        >
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                                Step {st.stepNumber}: {st.phase}
                              </span>
                              <span className="text-[10px] text-purple-300">{st.activatedSkill}</span>
                            </div>
                            <p className="text-xs text-gray-300 font-sans mt-1">
                              {st.plainLanguageExplanation}
                            </p>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-[10px] text-emerald-400 font-bold flex items-center justify-end gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              <span>{st.governanceClause}</span>
                            </span>
                            <div className="text-[9px] text-gray-500">{st.deterministicProof}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-white/5 text-emerald-300 font-sans font-medium text-xs">
                      <strong>Plain-Language Conclusion:</strong> &ldquo;{trace.plainLanguageConclusion}&rdquo;
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SKILL ARBITRATION NARRATIVES (SAN-1.0) */}
        {activeTab === 'arbitration_narratives' && (
          <div className="mt-4 space-y-3">
            <div
              className={`p-4 rounded-xl border ${
                isLight ? 'bg-white border-gray-200' : 'bg-[#091530] border-gray-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100 dark:border-gray-800">
                <div>
                  <span className="text-xs font-bold font-mono uppercase text-cyan-400 flex items-center gap-1.5">
                    <Scale className="w-4 h-4 text-cyan-400" />
                    Skill Arbitration Narratives (SAN-1.0)
                  </span>
                  <div className="text-xs text-gray-500 font-mono mt-0.5">
                    Transparent judicial rulings showing why SIM-1.0 favored one skill over another.
                  </div>
                </div>
                <span className="text-xs font-mono text-purple-400 font-bold">
                  Rule of Law In AI Civilization
                </span>
              </div>

              <div className="space-y-3 mt-3">
                {arbitrationNarratives.map((nar) => (
                  <div
                    key={nar.narrativeId}
                    className="p-4 rounded-xl bg-black/40 border border-white/10 font-mono text-xs space-y-2"
                  >
                    <div className="flex items-center justify-between pb-1.5 border-b border-white/5">
                      <span className="font-bold text-sm text-cyan-300 font-sans">{nar.conflictTitle}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold">
                        Hierarchy Rank #{nar.hierarchyRank}
                      </span>
                    </div>

                    <p className="text-xs text-gray-200 font-sans leading-relaxed">
                      {nar.plainLanguageSummary}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 pt-2 border-t border-white/5 text-[11px]">
                      <div className="p-2 rounded bg-black/30">
                        <span className="text-gray-400">Legal Basis:</span>
                        <div className="text-cyan-300 mt-0.5">{nar.legalBasis}</div>
                      </div>
                      <div className="p-2 rounded bg-black/30">
                        <span className="text-gray-400">Human Steward Impact:</span>
                        <div className="text-emerald-300 mt-0.5 font-sans">{nar.humanStewardImpact}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ARGON ADVISORY RATIONALE (AAR-1.0) */}
        {activeTab === 'argon_rationale' && (
          <div className="mt-4 space-y-3">
            <div
              className={`p-4 rounded-xl border ${
                isLight ? 'bg-white border-gray-200' : 'bg-[#091530] border-gray-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100 dark:border-gray-800">
                <div>
                  <span className="text-xs font-bold font-mono uppercase text-cyan-400 flex items-center gap-1.5">
                    <Brain className="w-4 h-4 text-cyan-400" />
                    Gemini 4 Argon Advisory Rationale (AAR-1.0)
                  </span>
                  <div className="text-xs text-gray-500 font-mono mt-0.5">
                    Explaining why Argon’s hyper-deep generative proposals are constrained to advisory status.
                  </div>
                </div>
                <span className="text-xs font-mono text-emerald-400 font-bold">
                  AOS-1.0 Advisory Boundary Active
                </span>
              </div>

              <div className="space-y-3 mt-3">
                {argonAdvisories.map((aar) => (
                  <div
                    key={aar.recordId}
                    className="p-4 rounded-xl bg-black/40 border border-white/10 font-mono text-xs space-y-2"
                  >
                    <div className="flex items-center justify-between pb-1.5 border-b border-white/5">
                      <span className="font-bold text-sm text-cyan-300 font-sans">{aar.context}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold">
                        {aar.model}
                      </span>
                    </div>

                    <div className="text-xs text-gray-300 font-sans bg-black/30 p-2.5 rounded border border-white/5">
                      <strong>Argon’s Recommendation:</strong> &ldquo;{aar.argonsProposal}&rdquo;
                    </div>

                    <p className="text-xs text-gray-300 font-sans mt-2">
                      {aar.plainLanguageExplanation}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px] text-gray-400">
                      <span>
                        Enforced Constraint:{' '}
                        <strong className="text-emerald-400">{aar.deterministicConstraintEnforced}</strong>
                      </span>
                      <span>
                        Human Consent Required:{' '}
                        <strong className={aar.humanConsentRequired ? 'text-amber-400' : 'text-emerald-400'}>
                          {aar.humanConsentRequired ? 'YES (CHK-002)' : 'NO (PROVEN SAFE)'}
                        </strong>
                      </span>
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
