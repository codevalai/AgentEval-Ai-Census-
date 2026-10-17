/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Trash2, CheckCircle2, ShieldAlert, Key } from 'lucide-react';
import { generateTombstoneProof } from '../lib/merkleSpine.ts';

interface TombstoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTombstoneConfirmed: (id: string, tombstoneLeaf: string, reason: string) => void;
  theme: 'worldometers' | 'sovereign';
}

export const TombstoneModal: React.FC<TombstoneModalProps> = ({
  isOpen,
  onClose,
  onTombstoneConfirmed,
  theme,
}) => {
  if (!isOpen) return null;
  const isLight = theme === 'worldometers';

  const [agentOrDatasetId, setAgentOrDatasetId] = useState('');
  const [legalFramework, setLegalFramework] = useState<'EU_AI_ACT' | 'GDPR_ART_17' | 'CCPA_RIGHT_TO_FORGET' | 'COPYRIGHT_TAKEDOWN'>('GDPR_ART_17');
  const [reason, setReason] = useState('Data subject exercised withdrawal of consent under Article 17.');
  const [operatorSignature, setOperatorSignature] = useState('OP_SIG_ML_DSA_87_' + Math.random().toString(36).substring(2, 8).toUpperCase());
  const [isProcessing, setIsProcessing] = useState(false);
  const [tombstoneResult, setTombstoneResult] = useState<{ tombstoneLeaf: string; nullifierRoot: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agentOrDatasetId.trim()) return;

    setIsProcessing(true);
    setTimeout(() => {
      const proof = generateTombstoneProof(agentOrDatasetId, legalFramework, reason);
      onTombstoneConfirmed(agentOrDatasetId, proof.tombstoneLeaf, reason);
      setTombstoneResult(proof);
      setIsProcessing(false);
    }, 450);
  };

  const handleReset = () => {
    setAgentOrDatasetId('');
    setTombstoneResult(null);
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
              <Trash2 className="w-5 h-5 text-amber-500" />
              <h3 className="text-base font-bold">Right-to-Forget / Soft-Delete Tombstone Terminal</h3>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Cryptographic erasure complying with GDPR Art. 17, EU AI Act, and copyright provisions without breaking Merkle monotonicity
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {tombstoneResult ? (
          <div className="text-center py-6">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h4 className="text-base font-bold text-gray-900 dark:text-white mb-1">
              Cryptographic Tombstone Committed!
            </h4>
            <p className="text-xs text-gray-500 max-w-md mx-auto mb-4">
              The targeted identity or training weights have been irreversibly soft-deleted and nullified. The Merkle tree root retains tamper-evident continuity.
            </p>

            <div className="p-3 rounded bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 font-mono text-xs text-amber-600 dark:text-amber-400 break-all mb-4 text-left space-y-1">
              <div><strong>Tombstone Leaf:</strong> {tombstoneResult.tombstoneLeaf}</div>
              <div><strong>Nullifier Root:</strong> {tombstoneResult.nullifierRoot}</div>
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
                Target Agent ID, Weight Hash, or Dataset URI:
              </label>
              <input
                type="text"
                required
                placeholder="e.g. AGENT_US_ASH_88192 or DATASET_CC_SHARD_4"
                value={agentOrDatasetId}
                onChange={(e) => setAgentOrDatasetId(e.target.value)}
                className={`w-full px-3 py-2 rounded-md border outline-hidden transition-all ${
                  isLight
                    ? 'bg-gray-50 border-gray-300 focus:border-amber-600'
                    : 'bg-gray-900 border-gray-700 focus:border-amber-500'
                }`}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Legal Authority Framework:
                </label>
                <select
                  value={legalFramework}
                  onChange={(e) => setLegalFramework(e.target.value as any)}
                  className={`w-full px-3 py-2 rounded-md border outline-hidden transition-all ${
                    isLight
                      ? 'bg-gray-50 border-gray-300'
                      : 'bg-gray-900 border-gray-700 text-gray-200'
                  }`}
                >
                  <option value="GDPR_ART_17">GDPR Art. 17 (EU)</option>
                  <option value="EU_AI_ACT">EU AI Act (Sovereign Safety)</option>
                  <option value="CCPA_RIGHT_TO_FORGET">CCPA Right-to-Forget</option>
                  <option value="COPYRIGHT_TAKEDOWN">Copyright Takedown</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Operator PQC Signature:
                </label>
                <input
                  type="text"
                  readOnly
                  value={operatorSignature}
                  className="w-full px-3 py-2 rounded-md border bg-gray-100 dark:bg-gray-950 font-mono text-[11px] text-gray-500 border-gray-300 dark:border-gray-800"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Erasure Justification / Audit Log:
              </label>
              <textarea
                rows={2}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className={`w-full px-3 py-2 rounded-md border outline-hidden transition-all ${
                  isLight
                    ? 'bg-gray-50 border-gray-300'
                    : 'bg-gray-900 border-gray-700 text-gray-200'
                }`}
              />
            </div>

            <div className="border-t pt-3 border-gray-200 dark:border-gray-800 flex items-center justify-between">
              <span className="text-[11px] text-amber-600 flex items-center gap-1 font-medium">
                <ShieldAlert className="w-3.5 h-3.5" />
                Monotonic Hash Invariant Guaranteed
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
                  disabled={isProcessing}
                  className="px-4 py-1.5 rounded-md bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold cursor-pointer shadow-sm"
                >
                  {isProcessing ? 'Issuing Tombstone...' : 'Commit Tombstone'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
