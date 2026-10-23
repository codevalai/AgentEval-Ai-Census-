/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * SOVEREIGN COORDINATION ENGINE & CONSTITUTIONAL PARLIAMENT CONSOLE
 * Interactive Human Interface for the 7 Planetary Governance Layers:
 * 1. Sovereign Coordination Engine (SCE — Constitutional Parliament)
 * 2. AI Ecosystem Diplomacy Layer (Inter-Ecosystem Treaties & Graph)
 * 3. Temporal Constitution & Predictive Census (Time-Bound Invariants)
 * 4. Planetary Safety Quorum (Cryptographic M-of-N Steward Voting)
 * 5. XERJ Arbitration Mesh (Tool, Memory, Swarm & Safety Court)
 * 6. Cross-Ecosystem Audit Ledger & Zero-Drift Civilization Atlas
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Scale,
  ShieldCheck,
  Globe2,
  Clock,
  Users,
  Cpu,
  FileCheck2,
  X,
  Play,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Lock,
} from 'lucide-react';
import { CensusStats } from '../types/census.ts';

interface SovereignGovernanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: CensusStats;
  theme: 'worldometers' | 'sovereign';
}

type ParliamentTab =
  | 'SCE_PARLIAMENT'
  | 'DIPLOMACY_TREATIES'
  | 'TEMPORAL_CONSTITUTION'
  | 'SAFETY_QUORUM'
  | 'XERJ_ARBITRATION'
  | 'AUDIT_AND_ATLAS';

export const SovereignGovernanceModal: React.FC<SovereignGovernanceModalProps> = ({
  isOpen,
  onClose,
  stats,
  theme,
}) => {
  const isLight = theme === 'worldometers';
  const [activeTab, setActiveTab] = useState<ParliamentTab>('SCE_PARLIAMENT');
  const [loading, setLoading] = useState(false);
  const [statusBanner, setStatusBanner] = useState<string | null>(null);
  const [stateData, setStateData] = useState<any>(null);

  // Interactive form states
  const [selectedPolicyCode, setSelectedPolicyCode] = useState('SCE-POP-001');
  const [policyTarget, setPolicyTarget] = useState('us-east4-asi-spawn-pipeline');

  const [newTreatyCode, setNewTreatyCode] = useState('TRT-2026-SWARM-QUOTA');
  const [newTreatyTitle, setNewTreatyTitle] = useState(
    'Cross-Cloud Autonomous Swarm Rate & Memory Accord'
  );

  const [temporalMetric, setTemporalMetric] = useState('asi_apex_growth_rate_pct');
  const [temporalObserved, setTemporalObserved] = useState<number>(3.8);
  const [temporalResult, setTemporalResult] = useState<any>(null);
  const [forecastHorizon, setForecastHorizon] = useState<'24H' | '7D' | '30D' | '1Y'>('7D');

  const [selectedStewardId, setSelectedStewardId] = useState(
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbb02'
  );
  const [newProposalTarget, setNewProposalTarget] = useState(
    'src/services/reconciler-and-tiers-live.ts'
  );
  const [newProposalType, setNewProposalType] = useState(
    'SSOT_SCHEMA_OR_GUARDRAIL_MUTATION'
  );

  const [arbActor, setArbActor] = useState('swarm-harvester-node-07');
  const [arbProfile, setArbProfile] = useState('SWARM_HARVESTER');
  const [arbAction, setArbAction] = useState<
    'TOOL_CALL' | 'MEMORY_READ' | 'MEMORY_WRITE' | 'SWARM_ASSIGN' | 'SAFETY_BLOCK'
  >('TOOL_CALL');
  const [arbSurface, setArbSurface] = useState<
    'CLOUD' | 'DEVICE_NPU' | 'WEBGPU' | 'MESH' | 'SOVEREIGN_CLOUD'
  >('SOVEREIGN_CLOUD');
  const [arbRate, setArbRate] = useState<number>(48);

  const [auditEcosystem, setAuditEcosystem] = useState('Google Cloud Vertex AI');
  const [auditEventType, setAuditEventType] = useState('MERKLE_EPOCH_ATTESTATION');

  const fetchParliamentState = useCallback(async () => {
    setLoading(true);
    try {
      const liveInt = Math.floor(stats.totalAgents);
      const res = await fetch(`/api/sovereign/parliament-state?liveActive=${liveInt}`);
      if (res.ok) {
        const json = await res.json();
        setStateData(json);
      }
    } catch {
      // Keep existing state if offline
    } finally {
      setLoading(false);
    }
  }, [stats.totalAgents]);

  useEffect(() => {
    if (isOpen) {
      fetchParliamentState();
    }
  }, [isOpen, fetchParliamentState]);

  if (!isOpen) return null;

  const handleApplyPolicy = async () => {
    try {
      const res = await fetch('/api/sovereign/policies/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          policy_code: selectedPolicyCode,
          target: policyTarget,
          parameters: {
            ssot_drift: 0,
            enforced_at_tick: Math.floor(stats.totalAgents),
          },
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setStatusBanner(
          `Applied ${selectedPolicyCode} on ${policyTarget} | Fencing #${data.decision.fencing_token} | Merkle ${data.decision.merkle_hash.slice(0, 14)}...`
        );
        fetchParliamentState();
      }
    } catch (e: any) {
      setStatusBanner(`Error: ${e?.message}`);
    }
  };

  const handleResolveConflict = async () => {
    try {
      const res = await fetch('/api/sovereign/resolve-conflict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidate_decisions: [
            {
              policy_code: 'SCE-INF-004',
              decision_type: 'REBALANCE_LOAD',
              target: policyTarget,
              parameters: { ssot_drift: 0 },
            },
            {
              policy_code: 'SCE-SAF-002',
              decision_type: 'EMERGENCY_OVERRIDE',
              target: policyTarget,
              parameters: { ssot_drift: 0, max_enclave_kb: 64 },
            },
          ],
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setStatusBanner(data.resolution_rationale);
        fetchParliamentState();
      }
    } catch (e: any) {
      setStatusBanner(`Conflict resolution error: ${e?.message}`);
    }
  };

  const handleProposeTreaty = async () => {
    try {
      const res = await fetch('/api/diplomacy/treaties/propose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          treaty_code: newTreatyCode,
          title: newTreatyTitle,
          clauses: {
            require_ed25519_signatures: true,
            max_enclave_kb: 64,
            enforce_zero_drift_ssot: true,
          },
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setStatusBanner(
          `Proposed Treaty ${data.treaty.treaty_code} (Status: DRAFT | Merkle: ${data.treaty.merkle_hash.slice(0, 12)}...)`
        );
        fetchParliamentState();
      }
    } catch (e: any) {
      setStatusBanner(`Treaty proposal failed: ${e?.message}`);
    }
  };

  const handleActivateTreaty = async (treatyId: string, treatyCode: string) => {
    try {
      const res = await fetch('/api/diplomacy/treaties/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ treaty_id: treatyId, treaty_code: treatyCode }),
      });
      const data = await res.json();
      if (data.ok) {
        setStatusBanner(
          `Activated Treaty ${data.treaty.treaty_code} | Merkle Root: ${data.treaty.merkle_hash.slice(0, 16)}...`
        );
        fetchParliamentState();
      } else {
        setStatusBanner(`Activation blocked: ${data.error}`);
      }
    } catch (e: any) {
      setStatusBanner(`Activation error: ${e?.message}`);
    }
  };

  const handleValidateTemporal = async () => {
    try {
      const res = await fetch('/api/temporal/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          metric: temporalMetric,
          observed_value: Number(temporalObserved),
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setTemporalResult(data);
        setStatusBanner(
          `Temporal Evaluation: ${data.compliant ? 'COMPLIANT (SAT)' : 'VIOLATION DETECTED'} | Merkle ${data.merkle_hash.slice(0, 14)}...`
        );
      }
    } catch (e: any) {
      setStatusBanner(`Temporal check failed: ${e?.message}`);
    }
  };

  const handleChangeHorizon = async (h: '24H' | '7D' | '30D' | '1Y') => {
    setForecastHorizon(h);
    try {
      const res = await fetch(`/api/civilization/forecast?horizon=${h}`);
      const data = await res.json();
      if (data.ok && stateData) {
        setStateData({
          ...stateData,
          civilization_forecasts: data,
        });
      }
    } catch {
      // ignore
    }
  };

  const handleProposeQuorum = async () => {
    try {
      const res = await fetch('/api/quorum/propose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action_type: newProposalType,
          target: newProposalTarget,
          payload: {
            description: `Constitutional Quorum Proposal on ${newProposalTarget}`,
            ssot_drift_delta: 0,
          },
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setStatusBanner(
          `Opened Quorum Proposal ${data.decision.id.slice(0, 8)} for ${newProposalTarget}`
        );
        fetchParliamentState();
      }
    } catch (e: any) {
      setStatusBanner(`Quorum proposal error: ${e?.message}`);
    }
  };

  const handleVoteQuorum = async (decisionId: string, approve: boolean) => {
    try {
      const res = await fetch('/api/quorum/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decision_id: decisionId,
          steward_id: selectedStewardId,
          approve,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setStatusBanner(
          `Vote recorded (${approve ? 'APPROVE' : 'REJECT'}) | Total Approval Weight: ${data.total_approval_weight} | Status: ${data.decision.status}`
        );
        fetchParliamentState();
      } else {
        setStatusBanner(`Vote rejected: ${data.error}`);
      }
    } catch (e: any) {
      setStatusBanner(`Vote error: ${e?.message}`);
    }
  };

  const handleArbitrateXerj = async () => {
    try {
      const res = await fetch('/api/xerj/arbitrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actor_id: arbActor,
          actor_capability_profile: arbProfile,
          action_type: arbAction,
          surface: arbSurface,
          target_resource: 'tool:http_probe:github',
          payload_summary: {
            rate_per_minute: Number(arbRate),
            enclave_memory_kb: 48,
            ssot_delta: 0,
          },
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setStatusBanner(
          `XERJ Verdict: ${data.decision} (${data.decision_tier}) | Fencing #${data.fencing_token} | Merkle ${data.merkle_hash.slice(0, 14)}...`
        );
        fetchParliamentState();
      }
    } catch (e: any) {
      setStatusBanner(`Arbitration error: ${e?.message}`);
    }
  };

  const handleAppendAudit = async () => {
    try {
      const res = await fetch('/api/audit/append', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ecosystem: auditEcosystem,
          actor_id: 'parliament-human-steward',
          actor_type: 'HUMAN',
          event_type: auditEventType,
          payload: {
            reconciled_active_agents: Math.floor(stats.totalAgents),
            ssot_drift_delta: 0,
          },
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setStatusBanner(
          `Appended Cross-Ecosystem Audit Event | Epoch #${data.latest_root.epoch} Root: ${data.latest_root.root_hash.slice(0, 16)}...`
        );
        fetchParliamentState();
      }
    } catch (e: any) {
      setStatusBanner(`Audit append error: ${e?.message}`);
    }
  };

  const sovereignPolicies = stateData?.sovereign_policies ?? [];
  const coordinationDecisions = stateData?.coordination_decisions ?? [];
  const diplomacy = stateData?.diplomacy ?? { ecosystems: [], relations: [], treaties: [] };
  const temporalRules = stateData?.temporal_overview?.temporal_rules ?? [];
  const forecasts = stateData?.civilization_forecasts?.forecasts ?? [];
  const stewards = stateData?.stewards ?? [];
  const quorumPolicies = stateData?.quorum_policies ?? [];
  const quorumDecisions = stateData?.quorum_decisions ?? [];
  const xerjPolicies = stateData?.xerj_policies ?? [];
  const xerjEvents = stateData?.xerj_arbitration_events ?? [];
  const auditVerification = stateData?.audit_verification ?? null;
  const auditEvents = stateData?.audit_events ?? [];
  const atlas = stateData?.civilization_atlas ?? {
    ssot_total: Math.floor(stats.totalAgents),
    sum_active_slices: Math.floor(stats.totalAgents),
    drift_delta: 0,
    slices: [],
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto">
      <div
        className={`w-full max-w-6xl border rounded-md shadow-2xl overflow-hidden flex flex-col max-h-[92vh] ${
          isLight
            ? 'bg-white border-gray-300 text-gray-900'
            : 'bg-[#070b14] border-gray-800 text-gray-100'
        }`}
      >
        {/* Header Bar */}
        <div
          className={`px-5 py-3.5 border-b flex items-center justify-between gap-4 ${
            isLight ? 'bg-gray-50 border-gray-200' : 'bg-[#0b1120] border-gray-800'
          }`}
        >
          <div className="flex items-center gap-3">
            <Scale className="w-5 h-5 text-emerald-500" />
            <div>
              <h2 className="text-sm sm:text-base font-bold tracking-tight uppercase font-mono">
                SOVEREIGN CONSTITUTIONAL PARLIAMENT &amp; COORDINATION ENGINE
              </h2>
              <p className="text-[11px] text-gray-500 font-mono">
                XERJ Arbitration Mesh • Cross-Ecosystem Merkle Spine • Diplomacy Treaties • Temporal Constitution • M-of-N Safety Quorum
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchParliamentState}
              className={`px-2.5 py-1 text-xs font-mono border rounded-xs flex items-center gap-1 cursor-pointer ${
                isLight
                  ? 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100'
                  : 'bg-gray-900 border-gray-700 text-gray-300 hover:bg-gray-800'
              }`}
              title="Refresh Parliament State"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Sync</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-200 cursor-pointer"
              aria-label="Close Constitutional Parliament Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div
          className={`px-5 py-2 border-b flex flex-wrap items-center gap-1.5 text-xs font-mono ${
            isLight ? 'bg-gray-100 border-gray-200' : 'bg-[#090e1a] border-gray-800'
          }`}
        >
          {[
            { id: 'SCE_PARLIAMENT', label: '1. Coordination Engine (SCE)', icon: Scale },
            { id: 'DIPLOMACY_TREATIES', label: '2. Diplomacy & Treaties', icon: Globe2 },
            { id: 'TEMPORAL_CONSTITUTION', label: '3. Temporal Constitution', icon: Clock },
            { id: 'SAFETY_QUORUM', label: '4. Safety Quorum (M-of-N)', icon: Users },
            { id: 'XERJ_ARBITRATION', label: '5. XERJ Arbitration Mesh', icon: Cpu },
            { id: 'AUDIT_AND_ATLAS', label: '6. Audit Spine & Atlas (Δ=0)', icon: FileCheck2 },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ParliamentTab)}
                className={`px-3 py-1.5 rounded-xs border flex items-center gap-1.5 transition-colors cursor-pointer ${
                  active
                    ? isLight
                      ? 'bg-emerald-700 text-white border-emerald-800 font-semibold'
                      : 'bg-emerald-950 text-emerald-300 border-emerald-600 font-semibold'
                    : isLight
                    ? 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    : 'bg-[#0d1424] text-gray-400 border-gray-800 hover:text-gray-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Status Feedback Banner */}
        {statusBanner && (
          <div
            className={`px-5 py-2 border-b text-xs font-mono flex items-center justify-between ${
              isLight
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-emerald-950/50 border-emerald-800/70 text-emerald-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{statusBanner}</span>
            </div>
            <button
              onClick={() => setStatusBanner(null)}
              className="text-[11px] underline ml-4 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Main Content Body */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* TAB 1: SOVEREIGN COORDINATION ENGINE (SCE) */}
          {activeTab === 'SCE_PARLIAMENT' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div
                  className={`lg:col-span-2 p-4 border rounded-xs ${
                    isLight ? 'bg-gray-50 border-gray-200' : 'bg-[#0c1220] border-gray-800'
                  }`}
                >
                  <div className="font-mono font-bold uppercase text-xs mb-3 flex items-center justify-between">
                    <span>Active Sovereign Constitutional Policies (public.sovereign_policies)</span>
                    <span className="text-emerald-500">Priority Hierarchy Enforced</span>
                  </div>
                  <div className="space-y-2.5">
                    {sovereignPolicies.map((pol: any) => (
                      <div
                        key={pol.id}
                        className={`p-3 border rounded-xs ${
                          isLight ? 'bg-white border-gray-200' : 'bg-[#080d18] border-gray-800'
                        }`}
                      >
                        <div className="flex items-center justify-between font-mono">
                          <span className="font-bold text-emerald-500">{pol.policy_code}</span>
                          <span className="text-[11px] text-gray-400">
                            SCOPE: {pol.scope} | PRIORITY: {pol.priority}
                          </span>
                        </div>
                        <div className="font-semibold mt-1">{pol.title}</div>
                        <p className="text-[11px] text-gray-400 mt-1">{pol.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Apply Policy / Resolve Conflict Action Box */}
                <div
                  className={`p-4 border rounded-xs space-y-4 ${
                    isLight ? 'bg-gray-50 border-gray-200' : 'bg-[#0c1220] border-gray-800'
                  }`}
                >
                  <div className="font-mono font-bold uppercase text-xs">
                    Execute Coordination Decision
                  </div>
                  <div className="space-y-2">
                    <label className="block font-mono text-[11px] text-gray-400">
                      Select Policy Code
                    </label>
                    <select
                      value={selectedPolicyCode}
                      onChange={(e) => setSelectedPolicyCode(e.target.value)}
                      className={`w-full px-2.5 py-1.5 border rounded-xs font-mono text-xs ${
                        isLight
                          ? 'bg-white border-gray-300 text-gray-900'
                          : 'bg-[#070b14] border-gray-700 text-gray-100'
                      }`}
                    >
                      {sovereignPolicies.map((p: any) => (
                        <option key={p.policy_code} value={p.policy_code}>
                          {p.policy_code} — {p.scope} (P:{p.priority})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block font-mono text-[11px] text-gray-400">
                      Target Surface / Region / Swarm
                    </label>
                    <input
                      type="text"
                      value={policyTarget}
                      onChange={(e) => setPolicyTarget(e.target.value)}
                      className={`w-full px-2.5 py-1.5 border rounded-xs font-mono text-xs ${
                        isLight
                          ? 'bg-white border-gray-300 text-gray-900'
                          : 'bg-[#070b14] border-gray-700 text-gray-100'
                      }`}
                    />
                  </div>

                  <div className="flex flex-col gap-2 pt-1">
                    <button
                      onClick={handleApplyPolicy}
                      className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-semibold rounded-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Apply Policy &amp; Sign WAL</span>
                    </button>
                    <button
                      onClick={handleResolveConflict}
                      className={`w-full py-2 px-3 border font-mono font-semibold rounded-xs flex items-center justify-center gap-1.5 cursor-pointer ${
                        isLight
                          ? 'bg-white border-gray-300 text-gray-800 hover:bg-gray-100'
                          : 'bg-gray-900 border-gray-700 text-cyan-300 hover:bg-gray-800'
                      }`}
                    >
                      <Scale className="w-3.5 h-3.5" />
                      <span>Simulate Conflict Resolution</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Append-Only Coordination Decisions Ledger */}
              <div
                className={`p-4 border rounded-xs ${
                  isLight ? 'bg-white border-gray-200' : 'bg-[#0c1220] border-gray-800'
                }`}
              >
                <div className="font-mono font-bold uppercase text-xs mb-3 flex items-center justify-between">
                  <span>Append-Only Coordination Decisions (public.coordination_decisions)</span>
                  <span className="text-[11px] text-gray-400">
                    Protected by trg_coordination_decisions_append_only
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse font-mono text-[11px]">
                    <thead>
                      <tr className="border-b border-gray-700/50 text-gray-400">
                        <th className="py-2 pr-3">Decision Type</th>
                        <th className="py-2 pr-3">Target</th>
                        <th className="py-2 pr-3">Status</th>
                        <th className="py-2 pr-3">Fencing Token</th>
                        <th className="py-2 pr-3">Merkle Hash</th>
                        <th className="py-2">Decided At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {coordinationDecisions.map((d: any) => (
                        <tr key={d.id} className="border-b border-gray-800/40">
                          <td className="py-2 pr-3 font-semibold text-cyan-400">
                            {d.decision_type}
                          </td>
                          <td className="py-2 pr-3">{d.target}</td>
                          <td className="py-2 pr-3 text-emerald-400">{d.status}</td>
                          <td className="py-2 pr-3">{String(d.fencing_token)}</td>
                          <td className="py-2 pr-3 text-gray-400">
                            {d.merkle_hash.slice(0, 16)}...
                          </td>
                          <td className="py-2 text-gray-400">{d.decided_at}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: AI ECOSYSTEM DIPLOMACY & TREATIES */}
          {activeTab === 'DIPLOMACY_TREATIES' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div
                  className={`lg:col-span-2 p-4 border rounded-xs ${
                    isLight ? 'bg-gray-50 border-gray-200' : 'bg-[#0c1220] border-gray-800'
                  }`}
                >
                  <div className="font-mono font-bold uppercase text-xs mb-3">
                    Inter-Ecosystem Treaties (public.treaties)
                  </div>
                  <div className="space-y-3">
                    {diplomacy.treaties.map((t: any) => (
                      <div
                        key={t.id}
                        className={`p-3 border rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                          isLight ? 'bg-white border-gray-200' : 'bg-[#080d18] border-gray-800'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2 font-mono">
                            <span className="font-bold text-cyan-400">{t.treaty_code}</span>
                            <span
                              className={`px-1.5 py-0.5 text-[10px] border rounded-xs ${
                                t.status === 'ACTIVE'
                                  ? 'border-emerald-600 text-emerald-400'
                                  : 'border-amber-600 text-amber-400'
                              }`}
                            >
                              {t.status}
                            </span>
                          </div>
                          <div className="font-semibold mt-1">{t.title}</div>
                          <div className="text-[11px] font-mono text-gray-400 mt-1">
                            Signatories: {t.ecosystems.length} Ecosystems | Merkle:{' '}
                            {t.merkle_hash.slice(0, 16)}...
                          </div>
                        </div>

                        {t.status !== 'ACTIVE' && (
                          <button
                            onClick={() => handleActivateTreaty(t.id, t.treaty_code)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-semibold rounded-xs shrink-0 cursor-pointer"
                          >
                            Activate Treaty
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Propose Treaty Form */}
                <div
                  className={`p-4 border rounded-xs space-y-3 ${
                    isLight ? 'bg-gray-50 border-gray-200' : 'bg-[#0c1220] border-gray-800'
                  }`}
                >
                  <div className="font-mono font-bold uppercase text-xs">
                    Propose New Inter-Ecosystem Treaty
                  </div>
                  <div>
                    <label className="block font-mono text-[11px] text-gray-400 mb-1">
                      Treaty Code
                    </label>
                    <input
                      type="text"
                      value={newTreatyCode}
                      onChange={(e) => setNewTreatyCode(e.target.value)}
                      className={`w-full px-2.5 py-1.5 border rounded-xs font-mono text-xs ${
                        isLight
                          ? 'bg-white border-gray-300 text-gray-900'
                          : 'bg-[#070b14] border-gray-700 text-gray-100'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[11px] text-gray-400 mb-1">
                      Treaty Title
                    </label>
                    <input
                      type="text"
                      value={newTreatyTitle}
                      onChange={(e) => setNewTreatyTitle(e.target.value)}
                      className={`w-full px-2.5 py-1.5 border rounded-xs font-mono text-xs ${
                        isLight
                          ? 'bg-white border-gray-300 text-gray-900'
                          : 'bg-[#070b14] border-gray-700 text-gray-100'
                      }`}
                    />
                  </div>
                  <button
                    onClick={handleProposeTreaty}
                    className="w-full py-2 px-3 bg-cyan-600 hover:bg-cyan-500 text-white font-mono font-semibold rounded-xs cursor-pointer"
                  >
                    Propose Treaty to Diplomacy Graph
                  </button>
                </div>
              </div>

              {/* Ecosystems & Relations Table */}
              <div
                className={`p-4 border rounded-xs ${
                  isLight ? 'bg-white border-gray-200' : 'bg-[#0c1220] border-gray-800'
                }`}
              >
                <div className="font-mono font-bold uppercase text-xs mb-3">
                  Registered Planetary AI Ecosystems &amp; Diplomatic Graph (public.ecosystems)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {diplomacy.ecosystems.map((eco: any) => (
                    <div
                      key={eco.id}
                      className={`p-3 border rounded-xs font-mono ${
                        isLight ? 'bg-gray-50 border-gray-200' : 'bg-[#080d18] border-gray-800'
                      }`}
                    >
                      <div className="font-bold text-emerald-400">{eco.name}</div>
                      <div className="text-[11px] text-gray-400 mt-0.5">
                        CATEGORY: {eco.category}
                      </div>
                      <div className="text-[11px] text-gray-300 mt-1">
                        Active Agents:{' '}
                        {Number(eco.metadata?.active_agents ?? 0).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TEMPORAL CONSTITUTION & PREDICTIVE CENSUS */}
          {activeTab === 'TEMPORAL_CONSTITUTION' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div
                  className={`lg:col-span-2 p-4 border rounded-xs ${
                    isLight ? 'bg-gray-50 border-gray-200' : 'bg-[#0c1220] border-gray-800'
                  }`}
                >
                  <div className="font-mono font-bold uppercase text-xs mb-3">
                    Time-Bound Constitutional Rules (public.temporal_rules)
                  </div>
                  <div className="space-y-2.5">
                    {temporalRules.map((r: any) => (
                      <div
                        key={r.id}
                        className={`p-3 border rounded-xs font-mono ${
                          isLight ? 'bg-white border-gray-200' : 'bg-[#080d18] border-gray-800'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-amber-400">{r.rule_code}</span>
                          <span className="text-[11px] text-gray-400">
                            HORIZON: {r.horizon} | ACTION: {r.action_on_violation}
                          </span>
                        </div>
                        <div className="font-sans font-semibold mt-1">{r.description}</div>
                        <div className="text-[11px] text-gray-400 mt-1">
                          Metric: {r.metric} | Bound: {r.bound_type} ({r.threshold})
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Validate Temporal Invariant */}
                <div
                  className={`p-4 border rounded-xs space-y-3 ${
                    isLight ? 'bg-gray-50 border-gray-200' : 'bg-[#0c1220] border-gray-800'
                  }`}
                >
                  <div className="font-mono font-bold uppercase text-xs">
                    Validate Action Against Temporal Constitution
                  </div>
                  <div>
                    <label className="block font-mono text-[11px] text-gray-400 mb-1">
                      Target Metric
                    </label>
                    <select
                      value={temporalMetric}
                      onChange={(e) => setTemporalMetric(e.target.value)}
                      className={`w-full px-2.5 py-1.5 border rounded-xs font-mono text-xs ${
                        isLight
                          ? 'bg-white border-gray-300 text-gray-900'
                          : 'bg-[#070b14] border-gray-700 text-gray-100'
                      }`}
                    >
                      <option value="asi_apex_growth_rate_pct">
                        asi_apex_growth_rate_pct (&lt;= 4.5%)
                      </option>
                      <option value="regional_swarm_density_pct">
                        regional_swarm_density_pct (&lt;= 22.0%)
                      </option>
                      <option value="planetary_coverage_pct">
                        planetary_coverage_pct (&gt;= 71.5%)
                      </option>
                      <option value="dark_matter_share_pct">
                        dark_matter_share_pct (&lt;= 28.5%)
                      </option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-mono text-[11px] text-gray-400 mb-1">
                      Observed Value
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={temporalObserved}
                      onChange={(e) => setTemporalObserved(Number(e.target.value))}
                      className={`w-full px-2.5 py-1.5 border rounded-xs font-mono text-xs ${
                        isLight
                          ? 'bg-white border-gray-300 text-gray-900'
                          : 'bg-[#070b14] border-gray-700 text-gray-100'
                      }`}
                    />
                  </div>
                  <button
                    onClick={handleValidateTemporal}
                    className="w-full py-2 px-3 bg-amber-600 hover:bg-amber-500 text-white font-mono font-semibold rounded-xs cursor-pointer"
                  >
                    Run Temporal Invariant Check
                  </button>

                  {temporalResult && (
                    <div className="p-2.5 border border-gray-700 rounded-xs font-mono text-[11px] space-y-1">
                      <div
                        className={
                          temporalResult.compliant ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'
                        }
                      >
                        Verdict: {temporalResult.compliant ? 'COMPLIANT (SAT)' : 'VIOLATION — TRIGGER ENFORCEMENT'}
                      </div>
                      {temporalResult.evaluated_rules?.map((er: any) => (
                        <div key={er.rule_code} className="text-gray-400">
                          {er.rule_code}: observed={er.observed_value} vs threshold={er.threshold} (
                          {er.violated ? er.action_on_violation : 'OK'})
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Predictive Census Horizons */}
              <div
                className={`p-4 border rounded-xs ${
                  isLight ? 'bg-white border-gray-200' : 'bg-[#0c1220] border-gray-800'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="font-mono font-bold uppercase text-xs">
                    Predictive Census Trajectory (public.civilization_forecasts)
                  </div>
                  <div className="flex items-center gap-1.5 font-mono">
                    {(['24H', '7D', '30D', '1Y'] as const).map((h) => (
                      <button
                        key={h}
                        onClick={() => handleChangeHorizon(h)}
                        className={`px-2.5 py-1 border rounded-xs text-xs cursor-pointer ${
                          forecastHorizon === h
                            ? 'bg-cyan-600 text-white border-cyan-500 font-bold'
                            : 'bg-transparent border-gray-700 text-gray-400'
                        }`}
                      >
                        {h}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse font-mono text-[11px]">
                    <thead>
                      <tr className="border-b border-gray-700/50 text-gray-400">
                        <th className="py-2 pr-3">Platform</th>
                        <th className="py-2 pr-3">Tier</th>
                        <th className="py-2 pr-3">Projected Active ({forecastHorizon})</th>
                        <th className="py-2 pr-3">Projected Latent</th>
                        <th className="py-2 pr-3">Projected Dark Matter</th>
                        <th className="py-2">Confidence</th>
                      </tr>
                    </thead>
                    <tbody>
                      {forecasts.map((f: any) => (
                        <tr key={f.id} className="border-b border-gray-800/40">
                          <td className="py-2 pr-3 font-semibold">{f.platform}</td>
                          <td className="py-2 pr-3 text-cyan-400">{f.tier}</td>
                          <td className="py-2 pr-3 text-emerald-400">
                            {Number(f.projected_active).toLocaleString()}
                          </td>
                          <td className="py-2 pr-3">
                            {Number(f.projected_latent).toLocaleString()}
                          </td>
                          <td className="py-2 pr-3 text-amber-400">
                            {Number(f.projected_dark_matter).toLocaleString()}
                          </td>
                          <td className="py-2">{(f.confidence * 100).toFixed(1)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PLANETARY SAFETY QUORUM (M-OF-N) */}
          {activeTab === 'SAFETY_QUORUM' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Active Quorum Decisions & Live Voting */}
                <div
                  className={`lg:col-span-2 p-4 border rounded-xs space-y-3 ${
                    isLight ? 'bg-gray-50 border-gray-200' : 'bg-[#0c1220] border-gray-800'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-mono font-bold uppercase text-xs">
                      Multi-Party Quorum Proposals (public.quorum_decisions)
                    </span>
                    <div className="flex items-center gap-2 font-mono text-[11px]">
                      <span className="text-gray-400">Voting as Steward:</span>
                      <select
                        value={selectedStewardId}
                        onChange={(e) => setSelectedStewardId(e.target.value)}
                        className={`px-2 py-1 border rounded-xs ${
                          isLight
                            ? 'bg-white border-gray-300 text-gray-900'
                            : 'bg-[#070b14] border-gray-700 text-emerald-300'
                        }`}
                      >
                        {stewards.map((s: any) => (
                          <option key={s.id} value={s.id}>
                            {s.handle} ({s.role} • w={s.weight})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {quorumDecisions.map((qd: any) => {
                      const weightSum = (qd.approvals || []).reduce(
                        (acc: number, a: any) => acc + Number(a.weight),
                        0
                      );
                      return (
                        <div
                          key={qd.id}
                          className={`p-3 border rounded-xs ${
                            isLight ? 'bg-white border-gray-200' : 'bg-[#080d18] border-gray-800'
                          }`}
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 font-mono">
                            <span className="font-bold text-purple-400">{qd.action_type}</span>
                            <span
                              className={`px-2 py-0.5 text-[10px] border rounded-xs ${
                                qd.status === 'APPROVED'
                                  ? 'border-emerald-600 text-emerald-400'
                                  : qd.status === 'OPEN'
                                  ? 'border-amber-500 text-amber-400'
                                  : 'border-red-600 text-red-400'
                              }`}
                            >
                              {qd.status} (Approvals: {qd.approvals?.length ?? 0} | Weight:{' '}
                              {weightSum.toFixed(1)})
                            </span>
                          </div>
                          <div className="font-mono text-xs mt-1">Target: {qd.target}</div>
                          <div className="text-[11px] text-gray-400 mt-1">
                            {qd.payload?.description}
                          </div>

                          {qd.status === 'OPEN' && (
                            <div className="flex items-center gap-2 mt-3">
                              <button
                                onClick={() => handleVoteQuorum(qd.id, true)}
                                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-semibold rounded-xs cursor-pointer"
                              >
                                Sign &amp; Approve (Ed25519)
                              </button>
                              <button
                                onClick={() => handleVoteQuorum(qd.id, false)}
                                className="px-3 py-1 bg-red-700 hover:bg-red-600 text-white font-mono text-xs font-semibold rounded-xs cursor-pointer"
                              >
                                Sign &amp; Reject
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Propose New Quorum Decision */}
                <div
                  className={`p-4 border rounded-xs space-y-3 ${
                    isLight ? 'bg-gray-50 border-gray-200' : 'bg-[#0c1220] border-gray-800'
                  }`}
                >
                  <div className="font-mono font-bold uppercase text-xs">
                    Open New M-of-N Quorum Proposal
                  </div>
                  <div>
                    <label className="block font-mono text-[11px] text-gray-400 mb-1">
                      Action Type
                    </label>
                    <select
                      value={newProposalType}
                      onChange={(e) => setNewProposalType(e.target.value)}
                      className={`w-full px-2.5 py-1.5 border rounded-xs font-mono text-xs ${
                        isLight
                          ? 'bg-white border-gray-300 text-gray-900'
                          : 'bg-[#070b14] border-gray-700 text-gray-100'
                      }`}
                    >
                      {quorumPolicies.map((qp: any) => (
                        <option key={qp.id} value={qp.action_type}>
                          {qp.action_type} (min={qp.min_approvals}, w&gt;={qp.min_weight})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-mono text-[11px] text-gray-400 mb-1">
                      Target File / Subsystem
                    </label>
                    <input
                      type="text"
                      value={newProposalTarget}
                      onChange={(e) => setNewProposalTarget(e.target.value)}
                      className={`w-full px-2.5 py-1.5 border rounded-xs font-mono text-xs ${
                        isLight
                          ? 'bg-white border-gray-300 text-gray-900'
                          : 'bg-[#070b14] border-gray-700 text-gray-100'
                      }`}
                    />
                  </div>
                  <button
                    onClick={handleProposeQuorum}
                    className="w-full py-2 px-3 bg-purple-600 hover:bg-purple-500 text-white font-mono font-semibold rounded-xs cursor-pointer"
                  >
                    Submit Proposal to Stewards
                  </button>

                  <div className="pt-2 border-t border-gray-800 space-y-1.5 font-mono text-[11px]">
                    <div className="font-bold text-gray-300">Registered Stewards (public.stewards):</div>
                    {stewards.map((st: any) => (
                      <div key={st.id} className="flex items-center justify-between text-gray-400">
                        <span>{st.handle}</span>
                        <span>
                          {st.role} (w={st.weight})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: XERJ ARBITRATION MESH */}
          {activeTab === 'XERJ_ARBITRATION' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div
                  className={`lg:col-span-2 p-4 border rounded-xs ${
                    isLight ? 'bg-gray-50 border-gray-200' : 'bg-[#0c1220] border-gray-800'
                  }`}
                >
                  <div className="font-mono font-bold uppercase text-xs mb-3">
                    XERJ Arbitration Mesh Policies (public.xerj_policies)
                  </div>
                  <div className="space-y-2.5">
                    {xerjPolicies.map((xp: any) => (
                      <div
                        key={xp.id}
                        className={`p-3 border rounded-xs font-mono ${
                          isLight ? 'bg-white border-gray-200' : 'bg-[#080d18] border-gray-800'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-cyan-400">{xp.policy_name}</span>
                          <span className="text-[11px] text-gray-400">
                            SCOPE: {xp.scope} | MAX RATE: {xp.max_rate_per_minute}/min
                          </span>
                        </div>
                        <div className="text-[11px] text-gray-300 mt-1">
                          Profile: {xp.actor_capability_profile} | Pattern: {xp.resource_pattern}
                        </div>
                        <div className="text-[11px] text-gray-400 mt-0.5">
                          Allowed: [{xp.allowed_actions.join(', ')}] | Forbidden: [
                          {xp.forbidden_actions.join(', ') || 'NONE'}]
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Live XERJ Arbitration Probe */}
                <div
                  className={`p-4 border rounded-xs space-y-3 ${
                    isLight ? 'bg-gray-50 border-gray-200' : 'bg-[#0c1220] border-gray-800'
                  }`}
                >
                  <div className="font-mono font-bold uppercase text-xs">
                    Probe XERJ Arbitration Court
                  </div>
                  <div>
                    <label className="block font-mono text-[11px] text-gray-400 mb-1">
                      Actor ID
                    </label>
                    <input
                      type="text"
                      value={arbActor}
                      onChange={(e) => setArbActor(e.target.value)}
                      className={`w-full px-2.5 py-1.5 border rounded-xs font-mono text-xs ${
                        isLight
                          ? 'bg-white border-gray-300 text-gray-900'
                          : 'bg-[#070b14] border-gray-700 text-gray-100'
                      }`}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-mono text-[11px] text-gray-400 mb-1">
                        Capability Profile
                      </label>
                      <select
                        value={arbProfile}
                        onChange={(e) => setArbProfile(e.target.value)}
                        className={`w-full px-2 py-1.5 border rounded-xs font-mono text-xs ${
                          isLight
                            ? 'bg-white border-gray-300 text-gray-900'
                            : 'bg-[#070b14] border-gray-700 text-gray-100'
                        }`}
                      >
                        <option value="SWARM_HARVESTER">SWARM_HARVESTER</option>
                        <option value="ORCHESTRATOR_NODE">ORCHESTRATOR_NODE</option>
                        <option value="CENSUS_READER">CENSUS_READER</option>
                        <option value="ARCHITECT">ARCHITECT</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-mono text-[11px] text-gray-400 mb-1">
                        Action Type
                      </label>
                      <select
                        value={arbAction}
                        onChange={(e) => setArbAction(e.target.value as any)}
                        className={`w-full px-2 py-1.5 border rounded-xs font-mono text-xs ${
                          isLight
                            ? 'bg-white border-gray-300 text-gray-900'
                            : 'bg-[#070b14] border-gray-700 text-gray-100'
                        }`}
                      >
                        <option value="TOOL_CALL">TOOL_CALL</option>
                        <option value="MEMORY_READ">MEMORY_READ</option>
                        <option value="MEMORY_WRITE">MEMORY_WRITE</option>
                        <option value="SWARM_ASSIGN">SWARM_ASSIGN</option>
                        <option value="SAFETY_BLOCK">SAFETY_BLOCK</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-mono text-[11px] text-gray-400 mb-1">
                        Surface
                      </label>
                      <select
                        value={arbSurface}
                        onChange={(e) => setArbSurface(e.target.value as any)}
                        className={`w-full px-2 py-1.5 border rounded-xs font-mono text-xs ${
                          isLight
                            ? 'bg-white border-gray-300 text-gray-900'
                            : 'bg-[#070b14] border-gray-700 text-gray-100'
                        }`}
                      >
                        <option value="SOVEREIGN_CLOUD">SOVEREIGN_CLOUD</option>
                        <option value="CLOUD">CLOUD</option>
                        <option value="DEVICE_NPU">DEVICE_NPU</option>
                        <option value="WEBGPU">WEBGPU</option>
                        <option value="MESH">MESH</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-mono text-[11px] text-gray-400 mb-1">
                        Rate / min
                      </label>
                      <input
                        type="number"
                        value={arbRate}
                        onChange={(e) => setArbRate(Number(e.target.value))}
                        className={`w-full px-2 py-1.5 border rounded-xs font-mono text-xs ${
                          isLight
                            ? 'bg-white border-gray-300 text-gray-900'
                            : 'bg-[#070b14] border-gray-700 text-gray-100'
                        }`}
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleArbitrateXerj}
                    className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-semibold rounded-xs cursor-pointer"
                  >
                    Execute /api/xerj/arbitrate
                  </button>
                </div>
              </div>

              {/* Recent Arbitration Events */}
              <div
                className={`p-4 border rounded-xs ${
                  isLight ? 'bg-white border-gray-200' : 'bg-[#0c1220] border-gray-800'
                }`}
              >
                <div className="font-mono font-bold uppercase text-xs mb-3">
                  Append-Only XERJ Arbitration Ledger (public.xerj_arbitration_events)
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse font-mono text-[11px]">
                    <thead>
                      <tr className="border-b border-gray-700/50 text-gray-400">
                        <th className="py-2 pr-3">Actor</th>
                        <th className="py-2 pr-3">Profile</th>
                        <th className="py-2 pr-3">Action / Surface</th>
                        <th className="py-2 pr-3">Decision</th>
                        <th className="py-2 pr-3">Tier</th>
                        <th className="py-2 pr-3">Fencing Token</th>
                        <th className="py-2">Merkle Hash</th>
                      </tr>
                    </thead>
                    <tbody>
                      {xerjEvents.map((ev: any) => (
                        <tr key={ev.id} className="border-b border-gray-800/40">
                          <td className="py-2 pr-3 font-semibold">{ev.actor_id}</td>
                          <td className="py-2 pr-3 text-gray-400">
                            {ev.actor_capability_profile}
                          </td>
                          <td className="py-2 pr-3">
                            {ev.action_type} @ {ev.surface}
                          </td>
                          <td
                            className={`py-2 pr-3 font-bold ${
                              ev.decision === 'ALLOW'
                                ? 'text-emerald-400'
                                : ev.decision === 'ESCALATE'
                                ? 'text-amber-400'
                                : 'text-red-400'
                            }`}
                          >
                            {ev.decision}
                          </td>
                          <td className="py-2 pr-3 text-cyan-400">{ev.decision_tier}</td>
                          <td className="py-2 pr-3">{String(ev.fencing_token)}</td>
                          <td className="py-2 text-gray-400">
                            {ev.merkle_hash.slice(0, 16)}...
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: CROSS-ECOSYSTEM AUDIT LEDGER & ZERO-DRIFT ATLAS */}
          {activeTab === 'AUDIT_AND_ATLAS' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div
                  className={`lg:col-span-2 p-4 border rounded-xs ${
                    isLight ? 'bg-gray-50 border-gray-200' : 'bg-[#0c1220] border-gray-800'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3 font-mono">
                    <span className="font-bold uppercase text-xs">
                      Zero-Drift AI Civilization Atlas (public.civilization_slices)
                    </span>
                    <span className="text-emerald-400 text-[11px] font-bold">
                      SSOT Total: {Number(atlas.ssot_total).toLocaleString()} | Δ ={' '}
                      {atlas.drift_delta} (VERIFIED)
                    </span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse font-mono text-[11px]">
                      <thead>
                        <tr className="border-b border-gray-700/50 text-gray-400">
                          <th className="py-1.5 pr-3">Platform</th>
                          <th className="py-1.5 pr-3">Tier</th>
                          <th className="py-1.5 pr-3">Region</th>
                          <th className="py-1.5 pr-3">Active Agents</th>
                          <th className="py-1.5">Latent Agents</th>
                        </tr>
                      </thead>
                      <tbody>
                        {atlas.slices.map((s: any) => (
                          <tr key={s.id} className="border-b border-gray-800/40">
                            <td className="py-1.5 pr-3 font-semibold">{s.platform}</td>
                            <td className="py-1.5 pr-3 text-cyan-400">{s.tier}</td>
                            <td className="py-1.5 pr-3 text-gray-400">{s.region}</td>
                            <td className="py-1.5 pr-3 text-emerald-400">
                              {Number(s.active_agents).toLocaleString()}
                            </td>
                            <td className="py-1.5">
                              {Number(s.latent_agents).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Cross-Ecosystem Audit Spine Verification & Append */}
                <div
                  className={`p-4 border rounded-xs space-y-3 ${
                    isLight ? 'bg-gray-50 border-gray-200' : 'bg-[#0c1220] border-gray-800'
                  }`}
                >
                  <div className="font-mono font-bold uppercase text-xs">
                    Cross-Ecosystem Merkle Audit Spine
                  </div>
                  {auditVerification && (
                    <div className="p-2.5 border border-emerald-700/60 bg-emerald-950/20 rounded-xs font-mono text-[11px] space-y-1">
                      <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5" />
                        <span>
                          Chain Intact: {String(auditVerification.chain_intact)} | Ed25519 Valid:{' '}
                          {String(auditVerification.ed25519_signatures_valid)}
                        </span>
                      </div>
                      <div className="text-gray-400">
                        Events Verified: {auditVerification.total_events_checked} | Epoch #
                        {auditVerification.latest_root?.epoch}
                      </div>
                      <div className="text-gray-400 truncate">
                        Root: {auditVerification.latest_root?.root_hash}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block font-mono text-[11px] text-gray-400 mb-1">
                      Origin Ecosystem
                    </label>
                    <input
                      type="text"
                      value={auditEcosystem}
                      onChange={(e) => setAuditEcosystem(e.target.value)}
                      className={`w-full px-2.5 py-1.5 border rounded-xs font-mono text-xs ${
                        isLight
                          ? 'bg-white border-gray-300 text-gray-900'
                          : 'bg-[#070b14] border-gray-700 text-gray-100'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[11px] text-gray-400 mb-1">
                      Audit Event Type
                    </label>
                    <input
                      type="text"
                      value={auditEventType}
                      onChange={(e) => setAuditEventType(e.target.value)}
                      className={`w-full px-2.5 py-1.5 border rounded-xs font-mono text-xs ${
                        isLight
                          ? 'bg-white border-gray-300 text-gray-900'
                          : 'bg-[#070b14] border-gray-700 text-gray-100'
                      }`}
                    />
                  </div>
                  <button
                    onClick={handleAppendAudit}
                    className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-semibold rounded-xs cursor-pointer"
                  >
                    Append Signed Audit Leaf
                  </button>
                </div>
              </div>

              {/* Recent Audit Events Table */}
              <div
                className={`p-4 border rounded-xs ${
                  isLight ? 'bg-white border-gray-200' : 'bg-[#0c1220] border-gray-800'
                }`}
              >
                <div className="font-mono font-bold uppercase text-xs mb-3">
                  Cross-Ecosystem Append-Only Audit Events (public.audit_events)
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse font-mono text-[11px]">
                    <thead>
                      <tr className="border-b border-gray-700/50 text-gray-400">
                        <th className="py-2 pr-3">Ecosystem</th>
                        <th className="py-2 pr-3">Actor</th>
                        <th className="py-2 pr-3">Event Type</th>
                        <th className="py-2 pr-3">Prev Hash</th>
                        <th className="py-2 pr-3">Merkle Hash</th>
                        <th className="py-2">Ed25519 Signature</th>
                      </tr>
                    </thead>
                    <tbody>
                      {auditEvents.map((ae: any) => (
                        <tr key={ae.id} className="border-b border-gray-800/40">
                          <td className="py-2 pr-3 font-semibold text-emerald-400">
                            {ae.ecosystem}
                          </td>
                          <td className="py-2 pr-3">
                            {ae.actor_id} ({ae.actor_type})
                          </td>
                          <td className="py-2 pr-3 text-cyan-400">{ae.event_type}</td>
                          <td className="py-2 pr-3 text-gray-400">
                            {ae.prev_hash.slice(0, 12)}...
                          </td>
                          <td className="py-2 pr-3 text-gray-300">
                            {ae.merkle_hash.slice(0, 14)}...
                          </td>
                          <td className="py-2 text-gray-400">
                            {ae.signature.slice(0, 16)}...
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
      </div>
    </div>
  );
};
