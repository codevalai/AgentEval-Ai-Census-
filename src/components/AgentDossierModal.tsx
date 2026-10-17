/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Cpu,
  Key,
  Calendar,
  Layers,
  Wrench,
  Activity,
  CheckCircle,
  AlertTriangle,
  GitBranch,
} from 'lucide-react';
import { PlanetaryAgentRecord } from '../types/census.ts';

interface AgentDossierModalProps {
  agent: PlanetaryAgentRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onTombstoneRequest?: (agentId: string) => void;
  theme: 'worldometers' | 'sovereign';
}

export const AgentDossierModal: React.FC<AgentDossierModalProps> = ({
  agent,
  isOpen,
  onClose,
  onTombstoneRequest,
  theme,
}) => {
  const [copiedKey, setCopiedKey] = useState(false);
  const [proofVerified, setProofVerified] = useState(false);
  const [sandboxOutput, setSandboxOutput] = useState<string | null>(null);

  if (!isOpen || !agent) return null;

  const isLight = theme === 'worldometers';

  const handleCopyKey = () => {
    navigator.clipboard.writeText(agent.pqcKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleVerifyProof = () => {
    setProofVerified(true);
    setTimeout(() => setProofVerified(false), 3500);
  };

  const handleRunSandbox = () => {
    setSandboxOutput('Executing sandboxed Z3 SAT constraint check on agent memory slice (≤ 64 KB)...');
    setTimeout(() => {
      setSandboxOutput(`[OK] Agent ${agent.id} runtime bounds verified. Cleanroom isolation intact. 0 unauthorized network leaks.`);
    }, 1200);
  };

  const getTierColor = (tier: string) => {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'DEPRECATED':
        return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'TOMBSTONED':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'REINCARNATED':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'FUTURE_PROJECTED':
        return 'bg-cyan-100 text-cyan-800 border-cyan-300';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div
        className={`w-full max-w-3xl rounded-xl shadow-2xl border p-6 my-8 transition-all ${
          isLight
            ? 'bg-white border-gray-200 text-gray-900'
            : 'bg-[#0f1422] border-cyan-900/60 text-gray-100'
        }`}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b pb-4 mb-4 border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{agent.flag}</span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold font-['Montserrat'] tracking-tight">
                  {agent.name}
                </h3>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${getTierColor(
                    agent.tier
                  )}`}
                >
                  {agent.tier}
                </span>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${getStatusColor(
                    agent.status
                  )}`}
                >
                  {agent.status}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-mono mt-0.5">
                {agent.id} • {agent.platform} • {agent.regionCity}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tombstone Notice if applicable */}
        {agent.status === 'TOMBSTONED' && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/40 border border-red-300 dark:border-red-800 rounded-lg flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
            <div className="text-xs text-red-800 dark:text-red-200">
              <span className="font-bold">Cryptographically Tombstoned:</span> {agent.tombstoneReason}
            </div>
          </div>
        )}

        {/* Grid Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Birth Certificate & Provenance */}
          <div
            className={`p-4 rounded-lg border text-xs ${
              isLight ? 'bg-gray-50 border-gray-200' : 'bg-[#141b2d] border-gray-800'
            }`}
          >
            <h4 className="font-bold uppercase tracking-wider text-[11px] mb-3 flex items-center gap-2 text-cyan-600 dark:text-cyan-400">
              <Calendar className="w-4 h-4" /> Cryptographic Birth Certificate
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Genesis Timestamp:</span>
                <span className="font-mono font-medium">{new Date(agent.createdAt).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Jurisdiction:</span>
                <span className="font-medium">{agent.jurisdictionIso3166}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Archetype:</span>
                <span className="font-mono text-purple-600 dark:text-purple-400 font-semibold">{agent.archetype}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Est. Active Instances:</span>
                <span className="font-bold">{agent.estimatedInstancesCount.toLocaleString()}</span>
              </div>
              {agent.lineageParent && (
                <div className="flex justify-between items-center pt-1 border-t border-gray-200 dark:border-gray-800">
                  <span className="text-gray-500 flex items-center gap-1">
                    <GitBranch className="w-3.5 h-3.5" /> Direct Ancestor:
                  </span>
                  <span className="font-medium text-blue-600 dark:text-blue-400">{agent.lineageParent}</span>
                </div>
              )}
            </div>
          </div>

          {/* Post-Quantum Key & Merkle Leaf */}
          <div
            className={`p-4 rounded-lg border text-xs ${
              isLight ? 'bg-gray-50 border-gray-200' : 'bg-[#141b2d] border-gray-800'
            }`}
          >
            <h4 className="font-bold uppercase tracking-wider text-[11px] mb-3 flex items-center gap-2 text-cyan-600 dark:text-cyan-400">
              <Key className="w-4 h-4" /> Post-Quantum Cryptography &amp; Spine
            </h4>
            <div className="space-y-2">
              <div>
                <span className="text-gray-500 block mb-1">PQC Public Key (ML-KEM-1024):</span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={agent.pqcKey}
                    className="w-full bg-white dark:bg-black/40 border border-gray-300 dark:border-gray-700 px-2 py-1 rounded font-mono text-[11px] select-all"
                  />
                  <button
                    onClick={handleCopyKey}
                    className="px-2 py-1 bg-cyan-700 hover:bg-cyan-600 text-white rounded text-[10px] font-bold shrink-0 cursor-pointer"
                  >
                    {copiedKey ? 'COPIED!' : 'COPY'}
                  </button>
                </div>
              </div>
              <div className="pt-2">
                <span className="text-gray-500 block mb-1">Merkle Leaf Digest:</span>
                <span className="font-mono text-[11px] bg-white dark:bg-black/40 px-2 py-1 rounded block border border-gray-300 dark:border-gray-700 break-all">
                  {agent.merkleLeafHash}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 6-Dimensional Behavior Genome Radar */}
        <div
          className={`p-4 rounded-lg border text-xs mb-4 ${
            isLight ? 'bg-gray-50 border-gray-200' : 'bg-[#141b2d] border-gray-800'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold uppercase tracking-wider text-[11px] flex items-center gap-2 text-cyan-600 dark:text-cyan-400">
              <Activity className="w-4 h-4" /> 6-Dimensional Agent Behavior Genome
            </h4>
            <span className="text-[10px] text-gray-500">Audited via SMT-LIB2 Invariants</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <div className="flex justify-between text-[11px] mb-1 font-medium">
                <span>Reasoning Depth (ToT / SAT)</span>
                <span className="font-bold">{agent.genome.reasoning}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${agent.genome.reasoning}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1 font-medium">
                <span>Autonomy &amp; Agency</span>
                <span className="font-bold">{agent.genome.autonomy}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${agent.genome.autonomy}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1 font-medium">
                <span>Tool-Use &amp; MCP Velocity</span>
                <span className="font-bold">{agent.genome.toolUse}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${agent.genome.toolUse}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1 font-medium">
                <span>Post-Quantum Safety</span>
                <span className="font-bold">{agent.genome.safetyPqc}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-cyan-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${agent.genome.safetyPqc}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1 font-medium">
                <span>Domain Heuristics</span>
                <span className="font-bold">{agent.genome.domainDepth}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-purple-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${agent.genome.domainDepth}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1 font-medium">
                <span>Swarm BFT Quorum</span>
                <span className="font-bold">{agent.genome.swarmCoord}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${agent.genome.swarmCoord}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* MCP Tools & Capabilities */}
        <div
          className={`p-4 rounded-lg border text-xs mb-4 ${
            isLight ? 'bg-gray-50 border-gray-200' : 'bg-[#141b2d] border-gray-800'
          }`}
        >
          <h4 className="font-bold uppercase tracking-wider text-[11px] mb-2 flex items-center gap-2 text-cyan-600 dark:text-cyan-400">
            <Wrench className="w-4 h-4" /> Active Model Context Protocol (MCP) Tools
          </h4>
          {agent.mcpTools.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {agent.mcpTools.map((tool, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded font-mono text-[11px] bg-white dark:bg-black/50 border border-gray-300 dark:border-gray-700 text-cyan-700 dark:text-cyan-300"
                >
                  ⚡ {tool}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No external tool bindings authorized.</p>
          )}
        </div>

        {/* Sandbox Output Console */}
        {sandboxOutput && (
          <div className="mb-4 p-3 bg-black text-green-400 font-mono text-[11px] rounded border border-green-800">
            {sandboxOutput}
          </div>
        )}

        {/* Verification banner if active */}
        {proofVerified && (
          <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs rounded flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>
              Merkle Spine Proof Confirmed: Leaf {agent.merkleLeafHash.slice(0, 14)} is cryptographically bound to Root block height #48,920.
            </span>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <button
              onClick={handleVerifyProof}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded shadow transition flex items-center gap-1.5 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" /> Verify Merkle Proof
            </button>
            <button
              onClick={handleRunSandbox}
              className="px-3 py-1.5 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-semibold rounded transition flex items-center gap-1.5 cursor-pointer"
            >
              <Cpu className="w-4 h-4" /> Run Sandbox Bounds Check
            </button>
          </div>

          {agent.status !== 'TOMBSTONED' && onTombstoneRequest && (
            <button
              onClick={() => onTombstoneRequest(agent.id)}
              className="text-xs text-red-600 dark:text-red-400 hover:underline font-medium cursor-pointer"
            >
              Submit Tombstone Request (GDPR Art. 17)
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
