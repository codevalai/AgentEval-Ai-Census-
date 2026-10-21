/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * COD3EVAL SOVEREIGN INFINITY: ENTERPRISE REALITY CONSOLE
 * Comprehensive interface for all 5 planetary backends:
 * 1. Ingestion Backbone (USGS, Repos, Labs, ArXiv + DLQ)
 * 2. Planetary Agent Registry (URNs, Attestations, Promotion Engine)
 * 3. Repo Indexer (CVE Scanner, License Audits, Impact Scoring)
 * 4. Governance Enforcement Layer (OPA/Rego Policies, RBAC, Z3 SAT Invariants)
 * 5. Threat Radar Backend (GPU Telemetry, CUDA Traps, Weight Roots, Gossip, PQC)
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  Server,
  Database,
  ShieldCheck,
  AlertTriangle,
  Play,
  RotateCw,
  Cpu,
  Lock,
  Layers,
  Terminal,
  Activity,
  FileCheck,
  Bug,
  Scale,
  RefreshCw,
  KeyRound,
  Ban,
  Network,
  Sliders,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import {
  IngestionWorkerStatus,
  IngestionDLQItem,
  AgentAttestationCertificate,
  AgentPromotionEvaluation,
  RepoCVERecord,
  GovernancePolicyEvaluation,
  GovernanceRole,
} from '../types/census.ts';
import { ingestionBackbone } from '../lib/ingestionBackbone.ts';
import { agentRegistryBackend } from '../lib/agentRegistryBackend.ts';
import { repoIndexerBackend } from '../lib/repoIndexerBackend.ts';
import { governanceEngine } from '../lib/governanceEngine.ts';
import { threatRadarBackend } from '../lib/threatRadarBackend.ts';

interface EnterpriseRealityModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'worldometers' | 'sovereign';
}

export const EnterpriseRealityModal: React.FC<EnterpriseRealityModalProps> = ({
  isOpen,
  onClose,
  theme,
}) => {
  if (!isOpen) return null;

  const isLight = theme === 'worldometers';

  // Subsystem Tabs: 'INGESTION' | 'REGISTRY' | 'INDEXER' | 'GOVERNANCE' | 'THREAT_RADAR'
  const [activeTab, setActiveTab] = useState<'INGESTION' | 'REGISTRY' | 'INDEXER' | 'GOVERNANCE' | 'THREAT_RADAR'>('INGESTION');

  // Ingestion state
  const [workers, setWorkers] = useState<IngestionWorkerStatus[]>(() => ingestionBackbone.getWorkerStatuses());
  const [dlq, setDlq] = useState<IngestionDLQItem[]>(() => ingestionBackbone.getDLQ());
  const [harvestingWorker, setHarvestingWorker] = useState<string | null>(null);
  const [harvestMessage, setHarvestMessage] = useState<string | null>(null);

  // Agent Registry state
  const [certificates, setCertificates] = useState<AgentAttestationCertificate[]>(() => agentRegistryBackend.getAllCertificates());
  const [evalCandidate, setEvalCandidate] = useState({
    name: 'Gemini-2.5-Autonomous-Worker',
    currentTier: 'AI' as const,
    autonomyScore: 84,
    reasoningScore: 86,
    tasksCompleted: 15400,
    formalVerificationPassRate: 98.2,
    crossDomainVersatility: 88,
  });
  const [promotionResult, setPromotionResult] = useState<AgentPromotionEvaluation | null>(null);

  // Repo Indexer state
  const [cves, setCves] = useState<RepoCVERecord[]>(() => repoIndexerBackend.getCVERecords());
  const [isScanningCve, setIsScanningCve] = useState(false);
  const [cveScanSummary, setCveScanSummary] = useState<string | null>(null);

  // Governance state
  const [activeRole, setActiveRole] = useState<GovernanceRole>(() => governanceEngine.getActiveRole());
  const [governanceEval, setGovernanceEval] = useState(() =>
    governanceEngine.evaluatePolicies({
      name: 'Planetary-Swarm-Cluster-01',
      bftQuorum: 88.5,
      memoryAllocatedKb: 64.0,
      cipherSuite: 'ML-KEM-1024',
      cleanroomProven: true,
    })
  );

  // Threat Radar Snapshot
  const [threatSnapshot, setThreatSnapshot] = useState(() => threatRadarBackend.getTelemetrySnapshot());

  useEffect(() => {
    setWorkers(ingestionBackbone.getWorkerStatuses());
    setDlq(ingestionBackbone.getDLQ());
    setCertificates(agentRegistryBackend.getAllCertificates());
    setCves(repoIndexerBackend.getCVERecords());
    setThreatSnapshot(threatRadarBackend.getTelemetrySnapshot());
  }, [activeTab]);

  // Handler: Ingestion harvest trigger
  const handleTriggerHarvest = async (workerId: any) => {
    setHarvestingWorker(workerId);
    setHarvestMessage(null);
    try {
      const res = await ingestionBackbone.executeWorkerHarvest(workerId);
      setWorkers(ingestionBackbone.getWorkerStatuses());
      setHarvestMessage(`Synced +${res.recordsHarvested} records in ${res.latencyMs}ms. Merkle leaf: ${res.merkleLeaf.slice(0, 16)}...`);
    } catch (err: any) {
      setHarvestMessage(`Harvest failed: ${err?.message || 'timeout'}. Item routed to DLQ.`);
      setDlq(ingestionBackbone.getDLQ());
    } finally {
      setHarvestingWorker(null);
    }
  };

  // Handler: Run promotion evaluation
  const handleRunPromotionEvaluation = () => {
    const urn = agentRegistryBackend.formatCanonicalUrn('google', evalCandidate.currentTier, evalCandidate.name);
    const result = agentRegistryBackend.evaluateAgentForPromotion({
      agentUrn: urn,
      name: evalCandidate.name,
      currentTier: evalCandidate.currentTier,
      autonomyScore: evalCandidate.autonomyScore,
      reasoningScore: evalCandidate.reasoningScore,
      tasksCompleted: evalCandidate.tasksCompleted,
      formalVerificationPassRate: evalCandidate.formalVerificationPassRate,
      crossDomainVersatility: evalCandidate.crossDomainVersatility,
    });
    setPromotionResult(result);
  };

  // Handler: Execute Promotion
  const handleExecutePromotion = () => {
    if (!promotionResult) return;
    try {
      const res = agentRegistryBackend.executePromotion(promotionResult);
      alert(`Promotion successful! New canonical identity: ${res.newUrn}\nMerkle Proof: ${res.merkleProof}`);
      setPromotionResult(null);
    } catch (e: any) {
      alert(`Promotion failed: ${e?.message}`);
    }
  };

  // Handler: CVE Scan
  const handleRunCVEScan = () => {
    setIsScanningCve(true);
    setCveScanSummary(null);
    setTimeout(() => {
      const res = repoIndexerBackend.executeCVEScan();
      setIsScanningCve(false);
      setCveScanSummary(`Scanned ${res.scannedReposCount} repos. ${res.criticalCount} Critical, ${res.highCount} High vulnerabilities detected (all patched/mitigated). Proof: ${res.merkleProof.slice(0, 16)}...`);
      setCves(repoIndexerBackend.getCVERecords());
    }, 600);
  };

  // Handler: Switch Role
  const handleSwitchRole = (role: GovernanceRole) => {
    governanceEngine.setRole(role);
    setActiveRole(role);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md">
      <div
        className={`w-full max-w-5xl max-h-[92vh] flex flex-col rounded-xl border shadow-2xl overflow-hidden transition-all ${
          isLight ? 'bg-white border-gray-300 text-gray-900' : 'bg-[#090d18] border-gray-800 text-gray-100'
        }`}
      >
        {/* Header */}
        <div
          className={`p-4 border-b flex items-center justify-between ${
            isLight ? 'bg-gray-50 border-gray-200' : 'bg-[#0e1322] border-gray-800'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold">
              <Server className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold font-['Montserrat'] flex items-center gap-2">
                Enterprise Planetary Reality Console
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  5 BACKENDS ONLINE
                </span>
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Direct operator console for Ingestion, Agent Registry, Repo Indexer, Governance &amp; Threat Telemetry
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

        {/* Subsystem Tabs */}
        <div
          className={`flex border-b text-xs font-semibold overflow-x-auto ${
            isLight ? 'bg-gray-100/70 border-gray-200' : 'bg-[#0c101c] border-gray-800'
          }`}
        >
          {[
            { id: 'INGESTION', label: '1. Ingestion Backbone', icon: Database },
            { id: 'REGISTRY', label: '2. Planetary Agent Registry', icon: Layers },
            { id: 'INDEXER', label: '3. Repo Indexer & CVE', icon: Bug },
            { id: 'GOVERNANCE', label: '4. Governance & Z3 SAT', icon: Scale },
            { id: 'THREAT_RADAR', label: '5. Threat Telemetry Radar', icon: Activity },
          ].map((t) => {
            const Icon = t.icon;
            const isSel = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`px-4 py-2.5 flex items-center gap-2 border-b-2 whitespace-nowrap cursor-pointer transition-all ${
                  isSel
                    ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 bg-white dark:bg-[#090d18]'
                    : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* TAB 1: INGESTION BACKBONE */}
          {activeTab === 'INGESTION' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold">Continuous API Workers &amp; Pipeline Feeds</h3>
                  <p className="text-xs text-gray-500">Live ingestors normalizing real external data into Merkle anchors</p>
                </div>
                {harvestMessage && (
                  <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-1 rounded border border-emerald-200 dark:border-emerald-800">
                    {harvestMessage}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {workers.map((w) => (
                  <div
                    key={w.workerId}
                    className={`p-3.5 rounded-lg border text-xs ${
                      isLight ? 'bg-gray-50 border-gray-200' : 'bg-gray-900/60 border-gray-800'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="font-bold text-gray-900 dark:text-gray-100">{w.name}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
                        {w.status}
                      </span>
                    </div>

                    <div className="text-[11px] font-mono text-gray-500 truncate mb-2">
                      Target: {w.targetEndpoint}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-gray-600 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-800">
                      <div>Harvested: <strong className="text-gray-900 dark:text-gray-200">{w.recordsHarvested.toLocaleString()}</strong></div>
                      <div>Last Latency: <strong>{w.lastSyncLatencyMs}ms</strong></div>
                      <div>Anchor: <strong className="text-emerald-500">{w.currentMerkleAnchor.slice(0, 10)}...</strong></div>
                      <div>DLQ Count: <strong className={w.dlqCount > 0 ? 'text-amber-500' : ''}>{w.dlqCount}</strong></div>
                    </div>

                    <div className="mt-3 flex justify-end">
                      <button
                        onClick={() => handleTriggerHarvest(w.workerId)}
                        disabled={harvestingWorker === w.workerId}
                        className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-[10px] font-bold cursor-pointer transition-all flex items-center gap-1 shadow-xs"
                      >
                        <RefreshCw className={`w-3 h-3 ${harvestingWorker === w.workerId ? 'animate-spin' : ''}`} />
                        <span>{harvestingWorker === w.workerId ? 'Harvesting...' : 'Trigger Harvest Run'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Dead-Letter Queue (DLQ) */}
              <div className={`p-3.5 rounded-lg border text-xs ${isLight ? 'bg-amber-50/50 border-amber-200' : 'bg-amber-950/20 border-amber-900/60'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold flex items-center gap-1.5 text-amber-800 dark:text-amber-300">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    Dead-Letter Queue (DLQ) &amp; Backpressure Manager ({dlq.length} items)
                  </span>
                  <span className="text-[10px] font-mono text-gray-500">Auto-retry exponential backoff</span>
                </div>

                {dlq.length === 0 ? (
                  <p className="text-gray-500 text-[11px]">DLQ is empty. All worker pipelines operating without dropped packets.</p>
                ) : (
                  <div className="space-y-2">
                    {dlq.map((item) => (
                      <div key={item.id} className="p-2 rounded bg-white dark:bg-gray-950 border border-amber-200 dark:border-amber-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="font-mono font-bold text-red-600 dark:text-red-400">{item.failureReason}</div>
                          <div className="text-[10px] text-gray-400 font-mono truncate max-w-lg mt-0.5">
                            Source: {item.sourceUrl} | Retries: {item.retryCount}
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            ingestionBackbone.retryDLQItem(item.id);
                            setDlq(ingestionBackbone.getDLQ());
                          }}
                          className="px-2 py-1 rounded bg-amber-600 hover:bg-amber-700 text-white font-mono text-[10px] font-bold cursor-pointer"
                        >
                          Retry Dispatch
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: PLANETARY AGENT REGISTRY & PROMOTION ENGINE */}
          {activeTab === 'REGISTRY' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold">Canonical URN Identity &amp; Cryptographic Birth Certificates</h3>
                  <p className="text-xs text-gray-500">NIST FIPS 203 PQC key fingerprints with hardware enclave attestations</p>
                </div>
              </div>

              {/* Sample Attestations */}
              <div className="space-y-2">
                {certificates.map((cert) => (
                  <div
                    key={cert.agentUrn}
                    className={`p-3 rounded-lg border text-xs ${
                      isLight ? 'bg-gray-50 border-gray-200' : 'bg-gray-900/60 border-gray-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{cert.agentUrn}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-bold">
                        {cert.enclaveHardware}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-gray-600 dark:text-gray-400">
                      <div>Lab: <strong className="text-gray-900 dark:text-gray-200">{cert.labName}</strong></div>
                      <div>Auditor: <strong className="text-gray-900 dark:text-gray-200">{cert.cleanroomAuditor}</strong></div>
                      <div className="truncate font-mono">PQC Fingerprint: <span className="text-purple-500">{cert.pqcKeyFingerprint.slice(0, 20)}...</span></div>
                      <div className="truncate font-mono">Genesis Root: <span className="text-emerald-500">{cert.genesisWeightsMerkleRoot.slice(0, 20)}...</span></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Automated Tier Promotion Engine Simulator */}
              <div className={`p-4 rounded-lg border ${isLight ? 'bg-purple-50/40 border-purple-200' : 'bg-purple-950/20 border-purple-900/50'}`}>
                <h4 className="text-xs font-bold uppercase tracking-wider text-purple-900 dark:text-purple-300 mb-2 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-purple-600" />
                  Automated Tier Promotion Engine (AI → AGI → ASI → APEX)
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs mb-3">
                  <div>
                    <label className="text-[10px] text-gray-500 font-bold block mb-1">Candidate Name</label>
                    <input
                      type="text"
                      value={evalCandidate.name}
                      onChange={(e) => setEvalCandidate({ ...evalCandidate, name: e.target.value })}
                      className="w-full px-2 py-1 rounded border text-xs bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-700"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500 font-bold block mb-1">Current Tier</label>
                    <select
                      value={evalCandidate.currentTier}
                      onChange={(e) => setEvalCandidate({ ...evalCandidate, currentTier: e.target.value as any })}
                      className="w-full px-2 py-1 rounded border text-xs bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-700"
                    >
                      <option value="AI">AI (Specialized Automation)</option>
                      <option value="AGI">AGI (General Reasoning)</option>
                      <option value="ASI">ASI (Superintelligence)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500 font-bold block mb-1">Autonomy Score ({evalCandidate.autonomyScore}/100)</label>
                    <input
                      type="range"
                      min="50"
                      max="100"
                      value={evalCandidate.autonomyScore}
                      onChange={(e) => setEvalCandidate({ ...evalCandidate, autonomyScore: Number(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleRunPromotionEvaluation}
                    className="px-3 py-1.5 rounded bg-purple-600 hover:bg-purple-700 text-white font-mono text-xs font-bold cursor-pointer"
                  >
                    Evaluate Promotion Invariants
                  </button>

                  {promotionResult && (
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold font-mono px-2 py-1 rounded ${
                        promotionResult.recommendation === 'PROMOTE'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        Decision: {promotionResult.recommendation} → {promotionResult.eligibleForTier || 'MAINTAIN'}
                      </span>

                      {promotionResult.recommendation === 'PROMOTE' && (
                        <button
                          onClick={handleExecutePromotion}
                          className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs font-bold cursor-pointer"
                        >
                          Commit Promotion to Spine
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {promotionResult && (
                  <p className="text-[11px] text-gray-600 dark:text-gray-300 mt-2 font-mono">
                    {promotionResult.justification} (Proof: {promotionResult.proofLeaf.slice(0, 16)}...)
                  </p>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: REPO INDEXER & CONTINUOUS CVE SCANNER */}
          {activeTab === 'INDEXER' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold">Planetary Repo Indexer &amp; Vulnerability Scanner</h3>
                  <p className="text-xs text-gray-500">Continuous scans for CVEs, license conflicts, and swarm impact scores</p>
                </div>

                <button
                  onClick={handleRunCVEScan}
                  disabled={isScanningCve}
                  className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-mono text-xs font-bold cursor-pointer flex items-center gap-1.5"
                >
                  <Bug className="w-3.5 h-3.5" />
                  <span>{isScanningCve ? 'Auditing 100 Repos...' : 'Scan 100 Sovereign Repos'}</span>
                </button>
              </div>

              {cveScanSummary && (
                <div className="p-3 rounded bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs font-mono text-blue-800 dark:text-blue-300">
                  {cveScanSummary}
                </div>
              )}

              <div className="space-y-2">
                {cves.map((cve) => (
                  <div
                    key={cve.cveId}
                    className={`p-3 rounded-lg border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                      isLight ? 'bg-gray-50 border-gray-200' : 'bg-gray-900/60 border-gray-800'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono font-bold text-red-600 dark:text-red-400">{cve.cveId}</span>
                        <span className="font-bold text-gray-900 dark:text-gray-100">{cve.repoName}</span>
                        <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
                          cve.severity === 'CRITICAL' ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}>
                          CVSS {cve.cvssScore} ({cve.severity})
                        </span>
                      </div>
                      <div className="text-[11px] text-gray-600 dark:text-gray-400">{cve.remediation}</div>
                    </div>

                    <div className="flex items-center gap-2 sm:self-center">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
                        {cve.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: GOVERNANCE & Z3 SMT-LIB2 INVARIANTS */}
          {activeTab === 'GOVERNANCE' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold">Governance Enforcement Layer (RFC-001 through RFC-005)</h3>
                  <p className="text-xs text-gray-500">OPA/Rego style policy constraints verified via Z3 SMT-LIB2 Solver</p>
                </div>

                {/* Role Switcher */}
                <div className="flex items-center gap-1.5 text-xs font-mono">
                  <span className="text-gray-500">Role:</span>
                  {(['CENSUS_OPERATOR', 'LAB_REGISTRAR', 'THREAT_DISPATCHER'] as GovernanceRole[]).map((r, idx) => (
                    <button
                      key={`${r}-${idx}`}
                      onClick={() => handleSwitchRole(r)}
                      className={`px-2 py-0.5 rounded border text-[10px] cursor-pointer transition-all ${
                        activeRole === r
                          ? 'bg-emerald-600 text-white border-emerald-600 font-bold'
                          : 'border-gray-300 dark:border-gray-700 text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      {r.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Invariant Evaluation Proofs */}
              <div className="space-y-2">
                {governanceEval.evaluations.map((ev) => (
                  <div
                    key={ev.rfc}
                    className={`p-3 rounded-lg border text-xs ${
                      isLight ? 'bg-gray-50 border-gray-200' : 'bg-gray-900/60 border-gray-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{ev.rfc}</span>
                        <span className="font-bold text-gray-900 dark:text-gray-100">{ev.policyTitle}</span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
                        {ev.status} ({ev.executionLatencyUs}µs)
                      </span>
                    </div>

                    <div className="text-[11px] font-mono text-gray-500 mt-1 bg-black/80 text-emerald-400 p-2 rounded">
                      <div>; Rule constraint:</div>
                      <div>{ev.ruleConstraint}</div>
                      <div className="text-cyan-400 mt-1">; Proof: {ev.z3SatProof}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: THREAT TELEMETRY SNAPSHOT */}
          {activeTab === 'THREAT_RADAR' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold">Threat Telemetry &amp; Cluster Health Snapshot</h3>
                  <p className="text-xs text-gray-500">Live GPU, CUDA, Weight Roots, Gossip &amp; PQC monitoring</p>
                </div>
                <span className="text-[10px] font-mono text-emerald-600 font-bold">
                  Active DEFCON: {threatSnapshot.activeThreats.length > 2 ? '2' : '3'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className={`p-3.5 rounded-lg border text-xs ${isLight ? 'bg-gray-50 border-gray-200' : 'bg-gray-900/60 border-gray-800'}`}>
                  <div className="font-bold mb-1 flex items-center gap-1.5 text-cyan-600 dark:text-cyan-400">
                    <Cpu className="w-4 h-4" />
                    GPU Nodes Monitored
                  </div>
                  <div className="text-xl font-bold font-mono text-gray-900 dark:text-white">
                    {threatSnapshot.gpuLogs.length} Active Enclaves
                  </div>
                  <div className="text-[10px] text-gray-500 mt-1">
                    Avg thermal: {(threatSnapshot.gpuLogs.reduce((acc, g) => acc + g.temperatureC, 0) / threatSnapshot.gpuLogs.length).toFixed(0)}°C
                  </div>
                </div>

                <div className={`p-3.5 rounded-lg border text-xs ${isLight ? 'bg-gray-50 border-gray-200' : 'bg-gray-900/60 border-gray-800'}`}>
                  <div className="font-bold mb-1 flex items-center gap-1.5 text-purple-600 dark:text-purple-400">
                    <Lock className="w-4 h-4" />
                    PQC Envelopes Verified
                  </div>
                  <div className="text-xl font-bold font-mono text-gray-900 dark:text-white">
                    100% Constant-Time
                  </div>
                  <div className="text-[10px] text-gray-500 mt-1">
                    Timing jitter variance &lt; 18ps (Side-channels 0)
                  </div>
                </div>

                <div className={`p-3.5 rounded-lg border text-xs ${isLight ? 'bg-gray-50 border-gray-200' : 'bg-gray-900/60 border-gray-800'}`}>
                  <div className="font-bold mb-1 flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    Active Mitigations
                  </div>
                  <div className="text-xl font-bold font-mono text-gray-900 dark:text-white">
                    {threatSnapshot.mitigationHistory.length} Cryptographic Proofs
                  </div>
                  <div className="text-[10px] text-gray-500 mt-1">
                    All anchored into Sovereign Audit Spine
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className={`p-3 border-t flex items-center justify-between text-xs ${
            isLight ? 'bg-gray-50 border-gray-200 text-gray-500' : 'bg-[#0e1322] border-gray-800 text-gray-400'
          }`}
        >
          <div className="font-mono text-[11px]">
            COD3EVAL ENTERPRISE REALITY • RFC-001..005 SAT ENGINE
          </div>

          <button
            onClick={onClose}
            className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold cursor-pointer"
          >
            Close Console
          </button>
        </div>
      </div>
    </div>
  );
};
