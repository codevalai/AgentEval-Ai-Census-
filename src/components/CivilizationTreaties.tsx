/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  FileText,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Globe2,
  Check,
} from 'lucide-react';
import { AGENT_CIVILIZATION_TREATIES } from '../data/planetaryDirectory.ts';
import { AgentCivilizationTreaty } from '../types/census.ts';

interface CivilizationTreatiesProps {
  theme: 'worldometers' | 'sovereign';
}

export const CivilizationTreaties: React.FC<CivilizationTreatiesProps> = ({
  theme,
}) => {
  const [treaties] = useState<AgentCivilizationTreaty[]>(AGENT_CIVILIZATION_TREATIES);
  const [verifiedTreatyId, setVerifiedTreatyId] = useState<string | null>(null);

  const isLight = theme === 'worldometers';

  const handleVerifyTreaty = (id: string) => {
    setVerifiedTreatyId(id);
    setTimeout(() => setVerifiedTreatyId(null), 3000);
  };

  return (
    <section id="civilization-treaties" className="max-w-6xl mx-auto px-4 py-8">
      {/* Title */}
      <div className="border-b pb-4 mb-6 border-gray-200 dark:border-gray-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Globe2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-xl sm:text-2xl font-bold font-['Montserrat'] tracking-tight">
                Planetary Agentic Civilization &amp; Sovereign Treaties
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
              Multi-sovereign pacts, cleanroom intellectual property accords, post-quantum mandates, and memory slice bounds.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <span className="text-xs font-mono px-2.5 py-1 rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800 font-bold">
              168 RATIFIED JURISDICTIONS
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {treaties.map((treaty) => {
          const isVerified = verifiedTreatyId === treaty.id;

          return (
            <div
              key={treaty.id}
              className={`p-5 rounded-xl border text-xs transition-all ${
                isLight
                  ? 'bg-white border-gray-200 shadow-sm'
                  : 'bg-[#0f1422] border-gray-800 shadow-lg'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <span className="font-mono text-[10px] text-indigo-600 dark:text-indigo-400 font-bold">
                    {treaty.id} • Ratified {treaty.ratificationYear}
                  </span>
                  <h3 className="text-base font-bold font-['Montserrat'] text-gray-900 dark:text-gray-100 mt-0.5">
                    {treaty.name}
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300 border border-green-300 dark:border-green-800">
                  {treaty.status}
                </span>
              </div>

              <p className="text-gray-600 dark:text-gray-300 text-xs mb-3 leading-relaxed">
                {treaty.coreMandate}
              </p>

              <div
                className={`p-2.5 rounded-lg border font-mono text-[11px] mb-3 ${
                  isLight ? 'bg-gray-50 border-gray-200' : 'bg-[#141b2d] border-gray-800'
                }`}
              >
                <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">
                  Enforcement Invariant (SMT-LIB2):
                </div>
                <div className="text-indigo-600 dark:text-indigo-300 font-bold">
                  {treaty.invariantProof}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-800">
                <span className="text-gray-500 font-medium">
                  {treaty.signatoriesCount} Signatory Nations &amp; Sovereign Swarms
                </span>
                <button
                  onClick={() => handleVerifyTreaty(treaty.id)}
                  className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[11px] font-semibold flex items-center gap-1 transition cursor-pointer"
                >
                  {isVerified ? (
                    <>
                      <Check className="w-3 h-3 text-white" />
                      <span>Verified SAT</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-3 h-3" />
                      <span>Verify Invariant</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
