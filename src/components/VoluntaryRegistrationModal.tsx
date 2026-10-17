/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, PlusCircle, CheckCircle2, ShieldCheck, Key, Globe } from 'lucide-react';
import { CapabilityTierKey, RegisteredAgentInput } from '../types/census.ts';
import { generateMerkleLeaf } from '../lib/merkleSpine.ts';

interface VoluntaryRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterAgent: (agent: RegisteredAgentInput, leafHash: string) => void;
  theme: 'worldometers' | 'sovereign';
}

export const VoluntaryRegistrationModal: React.FC<VoluntaryRegistrationModalProps> = ({
  isOpen,
  onClose,
  onRegisterAgent,
  theme,
}) => {
  if (!isOpen) return null;
  const isLight = theme === 'worldometers';

  const [name, setName] = useState('');
  const [archetype, setArchetype] = useState('SENTINEL_SECURITY');
  const [tier, setTier] = useState<CapabilityTierKey>('AI');
  const [region, setRegion] = useState('Tokyo Core (asia-northeast1)');
  const [jurisdiction, setJurisdiction] = useState('Japan');
  const [publicKey, setPublicKey] = useState(
    '0xML_KEM_1024_PUBKEY_' + Math.random().toString(36).substring(2, 10).toUpperCase()
  );
  const [intendedDomain, setIntendedDomain] = useState('Autonomous Code Synthesis');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successLeaf, setSuccessLeaf] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    const { leafHash, witnessToken } = generateMerkleLeaf('VOLUNTARY_AGENT_REGISTRATION', name, {
      tier,
      region,
      archetype,
      publicKey,
    });

    setTimeout(() => {
      onRegisterAgent(
        {
          name,
          archetype,
          tier,
          region,
          jurisdiction,
          publicKey,
          intendedDomain,
        },
        leafHash
      );
      setSuccessLeaf(leafHash);
      setIsSubmitting(false);
    }, 450);
  };

  const handleReset = () => {
    setName('');
    setSuccessLeaf(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div
        className={`w-full max-w-lg rounded-lg border p-5 shadow-2xl transition-all ${
          isLight ? 'bg-white border-gray-300 text-gray-900' : 'bg-[#0e1424] border-gray-700 text-gray-100'
        }`}
      >
        <div className="flex items-start justify-between border-b pb-3 mb-4 border-gray-200 dark:border-gray-800">
          <div>
            <div className="flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-emerald-600" />
              <h3 className="text-base font-bold">Voluntary Agent Ingestion &amp; Attestation</h3>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Anchor external model weights or agentic nodes into the live planetary census (RFC-005)
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {successLeaf ? (
          <div className="text-center py-6">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h4 className="text-base font-bold text-gray-900 dark:text-white mb-1">
              Agent Successfully Registered &amp; Anchored!
            </h4>
            <p className="text-xs text-gray-500 max-w-md mx-auto mb-4">
              Your agent instance has been committed into the planetary census live counters and assigned a monotonic Merkle leaf proof.
            </p>

            <div className="p-3 rounded bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 font-mono text-xs text-emerald-600 dark:text-emerald-400 break-all mb-6">
              Merkle Leaf Digest: {successLeaf}
            </div>

            <button
              onClick={handleReset}
              className="px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold cursor-pointer shadow-sm"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Agent Instance Name or Identifier:
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Sovereign-Sentinel-X1"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full px-3 py-2 rounded-md border outline-hidden transition-all ${
                  isLight
                    ? 'bg-gray-50 border-gray-300 focus:border-emerald-600'
                    : 'bg-gray-900 border-gray-700 focus:border-cyan-500'
                }`}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Capability Tier:
                </label>
                <select
                  value={tier}
                  onChange={(e) => setTier(e.target.value as CapabilityTierKey)}
                  className={`w-full px-3 py-2 rounded-md border outline-hidden transition-all ${
                    isLight
                      ? 'bg-gray-50 border-gray-300'
                      : 'bg-gray-900 border-gray-700 text-gray-200'
                  }`}
                >
                  <option value="AI">AI (Task Worker)</option>
                  <option value="AGI">AGI (General Node)</option>
                  <option value="ASI">ASI (Superintelligence)</option>
                  <option value="APEX">APEX (Hypercluster)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Agent Archetype:
                </label>
                <select
                  value={archetype}
                  onChange={(e) => setArchetype(e.target.value)}
                  className={`w-full px-3 py-2 rounded-md border outline-hidden transition-all ${
                    isLight
                      ? 'bg-gray-50 border-gray-300'
                      : 'bg-gray-900 border-gray-700 text-gray-200'
                  }`}
                >
                  <option value="WORKER_ENGINE">WORKER_ENGINE</option>
                  <option value="SENTINEL_SECURITY">SENTINEL_SECURITY</option>
                  <option value="ARCHITECT">ARCHITECT</option>
                  <option value="AUDITOR_ALETHEIA">AUDITOR_ALETHEIA</option>
                  <option value="CEO_ORCHESTRATOR">CEO_ORCHESTRATOR</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Primary Region:
                </label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className={`w-full px-3 py-2 rounded-md border outline-hidden transition-all ${
                    isLight
                      ? 'bg-gray-50 border-gray-300'
                      : 'bg-gray-900 border-gray-700 text-gray-200'
                  }`}
                >
                  <option value="Tokyo Core (asia-northeast1)">Tokyo Core (asia-northeast1)</option>
                  <option value="Ashburn Megasite (us-east4)">Ashburn Megasite (us-east4)</option>
                  <option value="Zurich Vault Node (europe-west6)">Zurich Vault Node (europe-west6)</option>
                  <option value="Singapore Straits (asia-southeast1)">Singapore Straits (asia-southeast1)</option>
                  <option value="Reykjavik Sanctum (europe-north1-ic)">Reykjavik Sanctum (europe-north1-ic)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Jurisdiction:
                </label>
                <input
                  type="text"
                  value={jurisdiction}
                  onChange={(e) => setJurisdiction(e.target.value)}
                  className={`w-full px-3 py-2 rounded-md border outline-hidden transition-all ${
                    isLight
                      ? 'bg-gray-50 border-gray-300'
                      : 'bg-gray-900 border-gray-700 text-gray-200'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Post-Quantum Public Key (ML-KEM-1024):
              </label>
              <input
                type="text"
                readOnly
                value={publicKey}
                className="w-full px-3 py-2 rounded-md border bg-gray-100 dark:bg-gray-950 font-mono text-[11px] text-gray-500 border-gray-300 dark:border-gray-800"
              />
            </div>

            <div className="border-t pt-3 border-gray-200 dark:border-gray-800 flex items-center justify-between">
              <span className="text-[11px] text-gray-500 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                Zero-Patent Cleanroom Attested
              </span>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold cursor-pointer shadow-sm"
                >
                  {isSubmitting ? 'Anchoring...' : 'Anchor Agent'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
