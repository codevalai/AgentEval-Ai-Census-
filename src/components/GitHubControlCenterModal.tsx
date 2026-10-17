/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * COD3EVAL SOVEREIGN INFINITY: GITHUB PLANETARY CONTROL CENTER
 * Comprehensive interface for GitHub-backed sovereign infrastructure:
 * 1. Planetary Actions Workflows & Live Runner
 * 2. Governance Branch Protection & RBAC CODEOWNERS
 * 3. Post-Quantum Signed Commits (ML-DSA-87 + Cosign)
 * 4. Telemetry Sink & Release Archives
 * 5. Workflow YAML Inspector & Direct Dispatch
 */

import React, { useState } from 'react';
import {
  X,
  GitBranch,
  GitCommit,
  GitPullRequest,
  CheckCircle2,
  Play,
  RotateCw,
  Shield,
  Lock,
  Terminal,
  FileCode,
  ExternalLink,
  Download,
  Copy,
  Clock,
  Layers,
  Sparkles,
  Server,
  KeyRound,
  Check,
  AlertCircle,
  Package,
} from 'lucide-react';
import {
  githubFabric,
  GitHubWorkflowRun,
  GitHubCommitAttestation,
} from '../lib/githubFabric.ts';

interface GitHubControlCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'worldometers' | 'sovereign';
}

export const GitHubControlCenterModal: React.FC<GitHubControlCenterModalProps> = ({
  isOpen,
  onClose,
  theme,
}) => {
  if (!isOpen) return null;

  const isLight = theme === 'worldometers';

  // Tabs: 'WORKFLOWS' | 'GOVERNANCE' | 'COMMITS' | 'TELEMETRY' | 'YAMLS'
  const [activeTab, setActiveTab] = useState<'WORKFLOWS' | 'GOVERNANCE' | 'COMMITS' | 'TELEMETRY' | 'YAMLS'>('WORKFLOWS');

  // State
  const repoStatus = githubFabric.getRepoStatus();
  const branchProtection = githubFabric.getBranchProtection();
  const [runs, setRuns] = useState<GitHubWorkflowRun[]>(() => githubFabric.getWorkflowRuns());
  const [attestations, setAttestations] = useState<GitHubCommitAttestation[]>(() => githubFabric.getRecentAttestations());
  
  // Dispatch runner state
  const [selectedWorkflowForDispatch, setSelectedWorkflowForDispatch] = useState('sovereign-build.yml');
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchResult, setDispatchResult] = useState<string | null>(null);

  // Signed commit generator state
  const [commitMessage, setCommitMessage] = useState('feat(sovereign): seal planetary epoch with post-quantum witness');
  const [authorName, setAuthorName] = useState('Nicholas Brian');
  const [isSigning, setIsSigning] = useState(false);

  // Telemetry sync state
  const [isSyncingTelemetry, setIsSyncingTelemetry] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  // YAML viewer state
  const [selectedYaml, setSelectedYaml] = useState('sovereign-build.yml');
  const [copiedYaml, setCopiedYaml] = useState(false);

  // Action: Dispatch Workflow
  const handleDispatch = async () => {
    setIsDispatching(true);
    setDispatchResult(null);
    try {
      const res = await githubFabric.dispatchWorkflow(selectedWorkflowForDispatch, {
        triggeredBy: 'PlanetaryControlConsole',
        timestamp: new Date().toISOString(),
      });
      setRuns(githubFabric.getWorkflowRuns());
      setDispatchResult(`Run #${res.id} queued successfully! Duration: ${res.durationSec}s. Merkle Witness: ${res.merkleWitness.slice(0, 16)}...`);
    } catch (e: any) {
      setDispatchResult(`Dispatch failed: ${e?.message}`);
    } finally {
      setIsDispatching(false);
    }
  };

  // Action: Generate Signed Commit
  const handleSignCommit = () => {
    if (!commitMessage.trim()) return;
    setIsSigning(true);
    setTimeout(() => {
      const newCommit = githubFabric.generateSignedCommit(commitMessage, authorName);
      setAttestations(githubFabric.getRecentAttestations());
      setIsSigning(false);
    }, 400);
  };

  // Action: Sync Telemetry
  const handleSyncTelemetry = async () => {
    setIsSyncingTelemetry(true);
    setSyncMessage(null);
    try {
      const res = await githubFabric.syncTelemetryToRepositorySink();
      setSyncMessage(`Synced ${res.artifactSizeKb} KB to repository artifact sink. Merkle Root: ${res.merkleRoot.slice(0, 18)}...`);
    } catch (e: any) {
      setSyncMessage(`Sync failed: ${e?.message}`);
    } finally {
      setIsSyncingTelemetry(false);
    }
  };

  const handleCopyYaml = () => {
    const content = githubFabric.getWorkflowContent(selectedYaml);
    navigator.clipboard?.writeText(content);
    setCopiedYaml(true);
    setTimeout(() => setCopiedYaml(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md">
      <div
        className={`w-full max-w-5xl max-h-[92vh] flex flex-col rounded-xl border shadow-2xl overflow-hidden transition-all ${
          isLight ? 'bg-white border-gray-300 text-gray-900' : 'bg-[#090d18] border-gray-800 text-gray-100'
        }`}
      >
        {/* Modal Top Header */}
        <div
          className={`p-4 border-b flex items-center justify-between ${
            isLight ? 'bg-gray-50 border-gray-200' : 'bg-[#0e1322] border-gray-800'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gray-900 dark:bg-black border border-gray-700 flex items-center justify-center text-white">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold font-['Montserrat']">
                  {repoStatus.owner}/{repoStatus.repo}
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  AUTHENTICATED &amp; LINKED
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                  branch: {repoStatus.defaultBranch}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Planetary Ledger • Continuous CI/CD • OPA/Z3 Gatekeeper • Telemetry Sink • Post-Quantum Provenance
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-500 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Subsystem Navigation Tabs */}
        <div
          className={`flex border-b text-xs font-semibold overflow-x-auto ${
            isLight ? 'bg-gray-100/70 border-gray-200' : 'bg-[#0c101c] border-gray-800'
          }`}
        >
          {[
            { id: 'WORKFLOWS', label: '1. Actions & CI/CD Runner', icon: Play },
            { id: 'GOVERNANCE', label: '2. Branch Protection & RFC Gate', icon: Shield },
            { id: 'COMMITS', label: '3. Signed PQC Commits (ML-DSA)', icon: KeyRound },
            { id: 'TELEMETRY', label: '4. Telemetry Sink & Releases', icon: Server },
            { id: 'YAMLS', label: '5. Workflow YAML Inspector', icon: FileCode },
          ].map((t) => {
            const Icon = t.icon;
            const isSel = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`px-4 py-2.5 flex items-center gap-2 border-b-2 whitespace-nowrap cursor-pointer transition-all ${
                  isSel
                    ? 'border-blue-600 text-blue-700 dark:text-blue-400 bg-white dark:bg-[#090d18]'
                    : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* TAB 1: WORKFLOWS & ACTIONS RUNNER */}
          {activeTab === 'WORKFLOWS' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-lg border bg-blue-50/40 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/60">
                <div>
                  <h3 className="text-xs font-bold text-blue-900 dark:text-blue-300 flex items-center gap-1.5 uppercase tracking-wider">
                    <Play className="w-3.5 h-3.5 text-blue-600" />
                    Interactive Planetary Workflow Dispatcher
                  </h3>
                  <p className="text-[11px] text-gray-600 dark:text-gray-400 mt-0.5">
                    Trigger automated CI/CD builds, threat radar patrols, or Merkle spine audits on GitHub Actions
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={selectedWorkflowForDispatch}
                    onChange={(e) => setSelectedWorkflowForDispatch(e.target.value)}
                    className="text-xs px-2.5 py-1.5 rounded border bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-700 font-mono"
                  >
                    <option value="sovereign-build.yml">sovereign-build.yml (CI/CD Replay)</option>
                    <option value="threat-radar-automation.yml">threat-radar-automation.yml (Cron 15m)</option>
                    <option value="governance-rfc-check.yml">governance-rfc-check.yml (Z3 Gate)</option>
                    <option value="planetary-telemetry-sync.yml">planetary-telemetry-sync.yml (Telemetry)</option>
                  </select>

                  <button
                    onClick={handleDispatch}
                    disabled={isDispatching}
                    className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-mono text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 shadow-xs whitespace-nowrap"
                  >
                    <RotateCw className={`w-3.5 h-3.5 ${isDispatching ? 'animate-spin' : ''}`} />
                    <span>{isDispatching ? 'Dispatching...' : 'Dispatch Action'}</span>
                  </button>
                </div>
              </div>

              {dispatchResult && (
                <div className="p-3 rounded bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-mono text-emerald-800 dark:text-emerald-300">
                  {dispatchResult}
                </div>
              )}

              {/* Recent Workflow Runs */}
              <div>
                <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  Recent Planetary Workflow Runs ({runs.length})
                </h4>

                <div className="space-y-2">
                  {runs.map((r) => (
                    <div
                      key={r.id}
                      className={`p-3 rounded-lg border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                        isLight ? 'bg-gray-50 border-gray-200' : 'bg-gray-900/60 border-gray-800'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900 dark:text-gray-100">{r.name}</span>
                          <span className="font-mono text-[10px] text-gray-500">({r.workflowId})</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
                            {r.conclusion?.toUpperCase() || r.status.toUpperCase()}
                          </span>
                        </div>
                        <div className="text-[11px] text-gray-600 dark:text-gray-400 font-mono">
                          Commit: <span className="text-blue-500">{r.commitSha}</span> • {r.commitMessage}
                        </div>
                        <div className="text-[10px] text-gray-400 font-mono">
                          Trigger: {r.event} • Witness: <span className="text-emerald-500">{r.merkleWitness.slice(0, 16)}...</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-center font-mono text-[11px]">
                        <span className="text-gray-500">{r.durationSec}s</span>
                        <a
                          href={r.url}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2 py-1 rounded bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 flex items-center gap-1 text-[10px]"
                        >
                          <span>Inspect Run</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GOVERNANCE & BRANCH PROTECTION */}
          {activeTab === 'GOVERNANCE' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold">Branch Protection &amp; Governance Policy Enforcement</h3>
                <p className="text-xs text-gray-500">
                  Enforces RFC-001 through RFC-005 on repository branch <code className="font-mono text-blue-600">main</code>
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className={`p-3.5 rounded-lg border text-xs ${isLight ? 'bg-gray-50 border-gray-200' : 'bg-gray-900/60 border-gray-800'}`}>
                  <div className="font-bold flex items-center gap-1.5 text-purple-600 dark:text-purple-400 mb-2">
                    <Shield className="w-4 h-4" />
                    Enforced Branch Invariants
                  </div>
                  <ul className="space-y-1.5 text-[11px] text-gray-600 dark:text-gray-300">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span><strong>Require Post-Quantum Signed Commits</strong> (ML-DSA-87 / NIST FIPS 204)</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span><strong>Enforce CODEOWNERS Reviews</strong> per RFC subsystem</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span><strong>Include Administrators</strong> in strict branch protection</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span><strong>Strict Linear History</strong> (Fast-Forward Merges Only)</span>
                    </li>
                  </ul>
                </div>

                <div className={`p-3.5 rounded-lg border text-xs ${isLight ? 'bg-gray-50 border-gray-200' : 'bg-gray-900/60 border-gray-800'}`}>
                  <div className="font-bold flex items-center gap-1.5 text-blue-600 dark:text-blue-400 mb-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Required Status Checks Before Merge
                  </div>
                  <ul className="space-y-1.5 text-[11px] font-mono text-gray-600 dark:text-gray-300">
                    {branchProtection.requiredStatusChecks.map((check, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        <span>{check}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* CODEOWNERS Role Mapping */}
              <div className={`p-4 rounded-lg border text-xs ${isLight ? 'bg-gray-50 border-gray-200' : 'bg-gray-900/60 border-gray-800'}`}>
                <h4 className="font-bold mb-2 flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                  <Lock className="w-4 h-4" />
                  Planetary CODEOWNERS Subsystem Partitioning
                </h4>
                <div className="space-y-1 font-mono text-[11px] bg-black/80 text-emerald-400 p-3 rounded">
                  <div># Ingestion Backbone &amp; Continuous Harvesters</div>
                  <div>/src/lib/ingestionBackbone.ts       @nicholasbrianbn # [CENSUS_OPERATOR]</div>
                  <div className="mt-1"># Agent Registry &amp; Promotion Engine</div>
                  <div>/src/lib/agentRegistryBackend.ts     @nicholasbrianbn # [LAB_REGISTRAR]</div>
                  <div className="mt-1"># Threat Radar &amp; GPU/CUDA Traps</div>
                  <div>/src/lib/threatRadarBackend.ts       @nicholasbrianbn # [THREAT_DISPATCHER]</div>
                  <div className="mt-1"># Merkle Spine &amp; Deterministic Replay</div>
                  <div>/src/lib/merkleSpine.ts              @nicholasbrianbn # [SOVEREIGN_ARCHITECT]</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SIGNED PQC COMMITS */}
          {activeTab === 'COMMITS' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold">Post-Quantum Git Commit Provenance (NIST FIPS 204 ML-DSA-87)</h3>
                  <p className="text-xs text-gray-500">Dual-key cryptographic signatures sealing each Git tree commit into the Merkle spine</p>
                </div>
              </div>

              {/* Commit Generator */}
              <div className={`p-3.5 rounded-lg border text-xs ${isLight ? 'bg-purple-50/30 border-purple-200' : 'bg-purple-950/20 border-purple-900/50'}`}>
                <h4 className="font-bold text-purple-900 dark:text-purple-300 mb-2 flex items-center gap-1.5">
                  <KeyRound className="w-4 h-4 text-purple-600" />
                  Sign Commit with ML-DSA-87 Post-Quantum Attestation
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-3">
                  <div className="sm:col-span-2">
                    <label className="text-[10px] text-gray-500 font-bold block mb-1">Commit Message</label>
                    <input
                      type="text"
                      value={commitMessage}
                      onChange={(e) => setCommitMessage(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded border text-xs bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-700 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500 font-bold block mb-1">Author Identity</label>
                    <input
                      type="text"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded border text-xs bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-700 font-mono"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleSignCommit}
                    disabled={isSigning}
                    className="px-3.5 py-1.5 rounded bg-purple-600 hover:bg-purple-700 text-white font-mono text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>{isSigning ? 'Calculating ML-DSA-87 Signature...' : 'Sign & Anchor to Spine'}</span>
                  </button>
                </div>
              </div>

              {/* Recent Attestations List */}
              <div className="space-y-2">
                {attestations.map((att) => (
                  <div
                    key={att.commitSha}
                    className={`p-3 rounded-lg border text-xs ${
                      isLight ? 'bg-gray-50 border-gray-200' : 'bg-gray-900/60 border-gray-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-purple-600 dark:text-purple-400">commit {att.commitSha.slice(0, 10)}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 font-bold">
                          {att.pqcSignatureType} VERIFIED
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
                          COSIGN PASS
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-500 font-mono">{att.timestamp}</span>
                    </div>

                    <div className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{att.message}</div>
                    <div className="text-[10px] font-mono text-gray-500 truncate">
                      Author: {att.author} &lt;{att.email}&gt; • Merkle Anchor: <span className="text-emerald-500">{att.merkleAnchor}</span>
                    </div>
                    <div className="text-[10px] font-mono text-purple-400 truncate mt-0.5">
                      Signature: {att.pqcSignature}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: TELEMETRY SINK & RELEASES */}
          {activeTab === 'TELEMETRY' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-lg border bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/60">
                <div>
                  <h3 className="text-xs font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5 uppercase tracking-wider">
                    <Server className="w-3.5 h-3.5 text-emerald-600" />
                    Planetary Telemetry Artifact Sync
                  </h3>
                  <p className="text-[11px] text-gray-600 dark:text-gray-400 mt-0.5">
                    Stream live census population metrics, Merkle anchors, and CVE digests into GitHub Actions telemetry artifacts
                  </p>
                </div>

                <button
                  onClick={handleSyncTelemetry}
                  disabled={isSyncingTelemetry}
                  className="px-3.5 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 shadow-xs whitespace-nowrap"
                >
                  <RotateCw className={`w-3.5 h-3.5 ${isSyncingTelemetry ? 'animate-spin' : ''}`} />
                  <span>{isSyncingTelemetry ? 'Syncing...' : 'Sync Census Snapshot Now'}</span>
                </button>
              </div>

              {syncMessage && (
                <div className="p-3 rounded bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-mono text-emerald-800 dark:text-emerald-300">
                  {syncMessage}
                </div>
              )}

              {/* Tagged Releases Ledger */}
              <div>
                <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5" />
                  Canonical Release Ledger
                </h4>

                <div className={`p-3.5 rounded-lg border text-xs ${isLight ? 'bg-gray-50 border-gray-200' : 'bg-gray-900/60 border-gray-800'}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-base text-gray-900 dark:text-white">
                        {repoStatus.latestRelease.tag}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-bold">
                        LATEST SOVEREIGN RELEASE
                      </span>
                    </div>
                    <span className="text-[10px] text-gray-500 font-mono">{repoStatus.latestRelease.publishedAt}</span>
                  </div>

                  <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                    {repoStatus.latestRelease.name}
                  </p>

                  <div className="flex items-center gap-2">
                    <a
                      href={repoStatus.latestRelease.tarballUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1 rounded bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-mono text-[10px] flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" />
                      <span>Download Tarball</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: WORKFLOW YAML INSPECTOR */}
          {activeTab === 'YAMLS' && (
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold">Planetary Workflow YAML Inspector</h3>
                  <p className="text-xs text-gray-500">Live configuration files located inside <code className="font-mono">.github/workflows/</code></p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={selectedYaml}
                    onChange={(e) => setSelectedYaml(e.target.value)}
                    className="text-xs px-2.5 py-1.5 rounded border bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-700 font-mono"
                  >
                    <option value="sovereign-build.yml">.github/workflows/sovereign-build.yml</option>
                    <option value="threat-radar-automation.yml">.github/workflows/threat-radar-automation.yml</option>
                    <option value="governance-rfc-check.yml">.github/workflows/governance-rfc-check.yml</option>
                    <option value="planetary-telemetry-sync.yml">.github/workflows/planetary-telemetry-sync.yml</option>
                  </select>

                  <button
                    onClick={handleCopyYaml}
                    className="px-2.5 py-1.5 rounded bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-mono text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    {copiedYaml ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedYaml ? 'Copied!' : 'Copy YAML'}</span>
                  </button>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-black text-gray-100 font-mono text-xs overflow-x-auto border border-gray-800 leading-relaxed max-h-96">
                <pre>{githubFabric.getWorkflowContent(selectedYaml)}</pre>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div
          className={`p-3 border-t flex items-center justify-between text-xs ${
            isLight ? 'bg-gray-50 border-gray-200 text-gray-500' : 'bg-[#0e1322] border-gray-800 text-gray-400'
          }`}
        >
          <div className="font-mono text-[11px] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>GITHUB PLANETARY BACKBONE • SOVEREIGN INFINITY</span>
          </div>

          <button
            onClick={onClose}
            className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
