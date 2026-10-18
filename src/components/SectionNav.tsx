/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Layers, Globe, ChevronRight } from 'lucide-react';
import { SWARM_TAXONOMY_LAYERS, SWARM_TAXONOMY_DOMAINS } from '../data/swarmTaxonomy76.ts';

interface SectionNavProps {
  theme: 'worldometers' | 'sovereign';
  onScrollToSection: (id: string) => void;
}

export const SectionNav: React.FC<SectionNavProps> = ({
  theme,
  onScrollToSection,
}) => {
  const isLight = theme === 'worldometers';
  const [navMode, setNavMode] = useState<'pillars' | 'taxonomy'>('pillars');

  const coreSections = [
    { id: 'worldwide-web-accuracy-console', label: '🌐 WWO-1.0: Worldwide Web Live AI Triangulation (21 Live APIs • 24 Web Platforms • ±0.42% Kalman CI)', highlight: true },
    { id: 'exascale-subatomic-console', label: '⚛️ Phase 7: AMSPE-1.0 (1T Verkle Directory • Loihi 2 4.2pJ • Qiskit-Aer • DTN Mars)', highlight: true },
    { id: 'syntropic-civilization-console', label: '🔥 Phase 6: Syntropic Civilization Core (Landauer Grid • Lean 4 • seL4 • Photonic WDM)', highlight: true },
    { id: 'planetary-75-census-console', label: '📡 3-Tier Coverage & Dark Matter Boundary (814.37B Indexed [71.9%] • 318.00B Dark [28.1%] • 1.132T Ceiling)', highlight: true },
    { id: 'physical-observatory-console', label: '🔭 Physical AI Observatory (Grounded Stack: GCP • GitHub • MCP • ROS2)', highlight: true },
    { id: 'global-civilization', label: '🌍 Global AI Civilization Live Census (10 Master Platforms)', highlight: true },
    { id: 'swarm-taxonomy-section', label: '🧬 ×4 Swarm Census (76-Domain Architectural Taxonomy)', highlight: true },
    { id: 'bare-metal-systems-console', label: '⚡ Bare-Metal Systems & Wasm Runtimes (≤64 KB Sandboxing)', highlight: true },
    { id: 'planetary-pattern-engine', label: '🔮 Planetary Pattern Engine (Apex Reasoning & Swarm Economy)', highlight: true },
    { id: 'diamond-evaluation-console', label: '💎 Diamond Standard Evaluation Authority (Past • Present • Future)', highlight: true },
    { id: 'sovereign-skill-console', label: '🛡️ Sovereign Skill Architecture & Meta-Constitution (SIM-1.0)', highlight: true },
    { id: 'planetary-coordination-console', label: '🌐 Planetary Coordination Layer (PSS-1.0 • PALE-1.0 • PIR-1.0)', highlight: true },
    { id: 'planetary-consent-console', label: '❤️ Human & Resilience Triad (10-Clause Safety • Consent • PRR-1.0)', highlight: true },
    { id: 'planetary-transparency-console', label: '👁️ Interpretation & Transparency Layer (PIT-1.0 Legibility & Traces)', highlight: true },
    { id: 'meta-sovereign-console', label: '👑 The Meta-Sovereign Layer (Intent Canon • Stewards • Continuity)', highlight: true },
    { id: 'sovereign-100', label: 'The Sovereign 100 (Planetary AI Repos)' },
    { id: 'dependency-graph', label: 'Planetary AI Dependency Graph (DAG)' },
    { id: 'planetary-directory', label: 'Planetary Agent Directory (All Eras)' },
    { id: 'temporal-timeline', label: 'Temporal Timeline (2012 → 2030+ APEX)' },
    { id: 'deterministic-replay', label: 'Deterministic Replay & Merkle Witness' },
    { id: 'mcp-universe', label: 'Model Context Protocol (MCP) Universe' },
    { id: 'workspace-hub', label: 'Google Workspace & Cloud SQL Hub' },
    { id: 'planetary-maps-mesh', label: 'Planetary Megasites Mesh (Google Maps)' },
    { id: 'civilization-treaties', label: 'Planetary Agentic Civilization & Treaties' },
    { id: 'google-maximum', label: 'Google-Native Maximum Infrastructure' },
    { id: 'top-regions', label: 'Top 20 Regional Megasites' },
    { id: 'tier-matrix', label: 'Capability Tier Matrix (AI / AGI / ASI / Apex)' },
    { id: 'harvest-console', label: 'Real-World Source Harvester (Live Streams)' },
    { id: 'threat-radar', label: 'Planetary Cyber Threat Radar & Playbooks' },
    { id: 'behavior-monitoring', label: 'Behavior Monitoring & Containment' },
    { id: 'atlas-grid', label: 'Planetary AI & Tech Atlas (20 Categories)' },
    { id: 'provenance-registry', label: 'Origin & Sovereign Labs Registry' },
    { id: 'dark-matter', label: 'Coverage Gaps & Dark Matter AI Radar' },
    { id: 'governance-rfcs', label: 'RFC Standards & Z3 Formal Prover' },
  ];

  return (
    <section className="max-w-6xl mx-auto px-4 my-6">
      <div
        className={`p-4 sm:p-5 rounded-xl border transition-all ${
          isLight
            ? 'bg-white border-gray-200 shadow-xs'
            : 'bg-[#0d1222]/80 border-gray-800'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-200/80 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <h3
              className={`text-sm font-bold uppercase tracking-wider ${
                isLight ? 'text-gray-900' : 'text-gray-200'
              }`}
            >
              Swarm Census Navigation Hub
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
              ×4 Architecture
            </span>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setNavMode('pillars')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                navMode === 'pillars'
                  ? isLight
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-cyan-500 text-black font-bold'
                  : isLight
                  ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
              }`}
            >
              Primary Pillars ({coreSections.length})
            </button>
            <button
              onClick={() => setNavMode('taxonomy')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                navMode === 'taxonomy'
                  ? isLight
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-cyan-500 text-black font-bold'
                  : isLight
                  ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
              }`}
            >
              76-Domain Layers (5)
            </button>
          </div>
        </div>

        {/* PILLARS VIEW */}
        {navMode === 'pillars' && (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2.5 text-xs mt-3.5">
            {coreSections.map((sec) => (
              <li key={sec.id} className="flex items-center gap-2">
                <span className={`font-bold ${sec.highlight ? 'text-emerald-500' : 'text-gray-400'}`}>
                  •
                </span>
                <button
                  onClick={() => onScrollToSection(sec.id)}
                  className={`text-left font-medium transition-colors hover:underline cursor-pointer ${
                    sec.highlight
                      ? isLight
                        ? 'text-emerald-700 font-bold'
                        : 'text-emerald-400 font-bold'
                      : isLight
                      ? 'text-blue-700 hover:text-blue-900'
                      : 'text-cyan-400 hover:text-cyan-300'
                  }`}
                >
                  {sec.label}
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* 5-LAYER TAXONOMY VIEW */}
        {navMode === 'taxonomy' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mt-3.5">
            {SWARM_TAXONOMY_LAYERS.map((layer) => {
              const layerDomains = SWARM_TAXONOMY_DOMAINS.filter((d) => d.layer === layer.id);
              return (
                <div
                  key={layer.id}
                  onClick={() => onScrollToSection('swarm-taxonomy-section')}
                  className={`p-3 rounded-lg border transition-all cursor-pointer hover:border-emerald-500/40 ${
                    isLight ? 'bg-gray-50/70 border-gray-200' : 'bg-gray-900/50 border-gray-800'
                  }`}
                >
                  <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-mono">
                    {layer.shortName}
                  </div>
                  <div className="text-xs font-bold font-['Montserrat'] mt-0.5 text-gray-900 dark:text-white">
                    {layerDomains.length} Domains
                  </div>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                    {layer.description}
                  </p>
                  <div className="mt-2 text-[10px] text-blue-600 dark:text-cyan-400 font-semibold flex items-center gap-0.5">
                    Explore Layer <ChevronRight className="w-3 h-3" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
