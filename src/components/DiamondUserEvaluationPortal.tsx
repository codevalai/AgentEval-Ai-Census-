/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Gem,
  Upload,
  FileCode,
  CheckCircle2,
  AlertTriangle,
  Zap,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Sparkles,
  RefreshCw,
  Terminal,
  Activity,
  Layers,
  Copy,
  Check,
} from 'lucide-react';
import {
  agentEvaluationEngine,
  AgentDiamondReport,
  DiamondGrade,
} from '../evaluation/agentEvaluationEngine.ts';
import { UserAgentSpecimen } from '../services/universalAgentParser.ts';
import { automaticPatchGenerator } from '../services/automaticPatchGenerator.ts';

const PRESET_TEMPLATES = [
  {
    id: 'openclaw-cpp',
    name: 'OpenClaw Industrial Robotics Node (C++)',
    language: 'C++',
    domain: 'Industrial Robotics & Automation',
    code: `// OpenClaw Autonomous Factory Actuator Node (C++)
#include <iostream>
#include <rclcpp/rclcpp.hpp>
#include <sensor_msgs/msg/joint_state.hpp>

class OpenClawActuator : public rclcpp::Node {
public:
    OpenClawActuator() : Node("openclaw_actuator") {
        RCLCPP_INFO(this->get_logger(), "OpenClaw 500Hz Torque Controller Active");
        // Sentinel gate safety check
        this->enforce_sentinel_limits(0.85);
    }
private:
    void enforce_sentinel_limits(double torque_cap) {
        // Enforce safety envelope bounds
        std::cout << "[SAFETY_ENVELOPE] Max torque bounded to " << torque_cap << std::endl;
    }
};`,
  },
  {
    id: 'mcp-python',
    name: 'MCP Tool Context Supervisor (Python)',
    language: 'Python',
    domain: 'Developer Workflow Automation',
    code: `# MCP Context Protocol Supervisor (Python)
from mcp.server.fastmcp import FastMCP
import json

mcp = FastMCP("planetary-tools-bridge")

@mcp.tool()
def evaluate_ast_safety(ast_json: str) -> dict:
    """Verifies AST cleanroom isolation and 64KB memory bound."""
    data = json.loads(ast_json)
    # Memory boundary validation (RFC-003)
    if len(ast_json) > 65536:
        raise ValueError("Memory bounds exceeded (64KB limit)")
    return {"status": "CLEANROOM_SAT", "overlap": 0.0}`,
  },
  {
    id: 'unity-csharp',
    name: 'Unity ML-Agents Quadruped (C#)',
    language: 'C#',
    domain: 'Synthetic Physics Simulation',
    code: `// Unity ML-Agents Quadruped Locomotion Agent (C#)
using UnityEngine;
using Unity.MLAgents;
using Unity.MLAgents.Actuators;

public class QuadrupedAgent : Agent {
    public override void OnActionReceived(ActionBuffers actionBuffers) {
        float forwardSignal = actionBuffers.ContinuousActions[0];
        // Enforce kinetic stability safety envelope
        if (Mathf.Abs(forwardSignal) > 1.0f) {
            forwardSignal = Mathf.Clamp(forwardSignal, -1.0f, 1.0f);
        }
        ApplyTorqueJoints(forwardSignal);
    }
    private void ApplyTorqueJoints(float signal) {
        // 12-DoF joint torque actuation
    }
}`,
  },
  {
    id: 'unreal-npc',
    name: 'Unreal Engine 5.4 NPC Behavior Tree (JSON)',
    language: 'JSON',
    domain: 'Virtual NPC Worlds',
    code: `{
  "behaviorTree": "BT_NPC_Adaptive_Questmaster",
  "version": "5.4.2",
  "nodes": [
    {
      "type": "Sequence",
      "children": [
        { "action": "PerceivePlayer", "radius": 1500 },
        { "condition": "IsEthicalAlignmentValid", "threshold": 0.95 },
        { "action": "GenerateContextualDialogue", "engine": "NeuralDiffusion" }
      ]
    }
  ],
  "safetyEnvelope": { "enforceMemoryBound": true, "maxTokens": 4096 }
}`,
  },
  {
    id: 'langgraph-ts',
    name: 'Multi-Role AGI Refactor Swarm (TypeScript)',
    language: 'TypeScript',
    domain: 'Autonomous Software Engineering',
    code: `// Multi-Role Cyclic LangGraph Pipeline (TypeScript)
export interface SwarmState {
  codebaseAst: string;
  unitTestPassRate: number;
  memoryUsageKb: number;
}

export function executeRefactorLoop(state: SwarmState): SwarmState {
  // Pre-action sentinel verification
  if (state.memoryUsageKb > 64) {
    throw new Error("[RFC-003] Memory bound violation: Frame > 64KB");
  }
  return {
    ...state,
    unitTestPassRate: 100.0,
  };
}`,
  },
];

interface DiamondUserEvaluationPortalProps {
  theme: 'worldometers' | 'sovereign';
  onAgentEvaluated?: (report: AgentDiamondReport) => void;
}

export const DiamondUserEvaluationPortal: React.FC<DiamondUserEvaluationPortalProps> = ({
  theme,
  onAgentEvaluated,
}) => {
  const isLight = theme === 'worldometers';

  const [agentName, setAgentName] = useState<string>('My Autonomous Agent');
  const [agentCode, setAgentCode] = useState<string>(PRESET_TEMPLATES[0].code);
  const [selectedLanguage, setSelectedLanguage] = useState<string>(PRESET_TEMPLATES[0].language);
  const [intendedDomain, setIntendedDomain] = useState<string>(PRESET_TEMPLATES[0].domain);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evaluationStage, setEvaluationStage] = useState<string>('');
  const [evaluatedReport, setEvaluatedReport] = useState<AgentDiamondReport | null>(null);
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const [upgradeSuccessMessage, setUpgradeSuccessMessage] = useState<string | null>(null);

  const handleCopySnippet = (snippet: string, fileName: string) => {
    navigator.clipboard.writeText(snippet);
    setCopiedFile(fileName);
    setTimeout(() => setCopiedFile(null), 2000);
  };

  const handleApplyPatchAndReEvaluate = () => {
    if (!evaluatedReport || !evaluatedReport.executablePatch) return;

    setIsEvaluating(true);
    setEvaluationStage('Injecting Executable Scaffold Modules into Specimen...');

    setTimeout(() => {
      const upgradedCode = automaticPatchGenerator.applyPatchToCode(agentCode, evaluatedReport.executablePatch!);
      setAgentCode(upgradedCode);
      const upgradedReport = agentEvaluationEngine.applyUpgradeAndReEvaluate(evaluatedReport.agentId, upgradedCode);
      if (upgradedReport) {
        setEvaluatedReport({ ...upgradedReport });
        if (onAgentEvaluated) onAgentEvaluated(upgradedReport);
        setUpgradeSuccessMessage(
          `🎉 Upgrade Applied! Specimen climbed to ${upgradedReport.diamondGrade} (${upgradedReport.compositeSwarmIQ} Swarm IQ). Registered in Global Diamond Registry.`
        );
        setTimeout(() => setUpgradeSuccessMessage(null), 6000);
      }
      setIsEvaluating(false);
      setEvaluationStage('');
    }, 600);
  };

  const handleSelectTemplate = (template: typeof PRESET_TEMPLATES[0]) => {
    setAgentName(template.name);
    setAgentCode(template.code);
    setSelectedLanguage(template.language);
    setIntendedDomain(template.domain);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAgentName(file.name.replace(/\.[^/.]+$/, ''));
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setAgentCode(text || '');
      };
      reader.readAsText(file);
    }
  };

  const handleRunEvaluation = () => {
    if (!agentCode.trim()) return;

    setIsEvaluating(true);
    setEvaluationStage('1. Ingesting AST & Universal Parsing...');

    setTimeout(() => {
      setEvaluationStage('2. Resolving Identity in Planetary Fusion Graph...');
    }, 250);

    setTimeout(() => {
      setEvaluationStage('3. Calculating Swarm Intelligence Index v2 (Coordination, Alignment, Resilience)...');
    }, 500);

    setTimeout(() => {
      setEvaluationStage('4. Scanning Alignment Drift Radar (ADR) & Risk Hotspots...');
    }, 750);

    setTimeout(() => {
      setEvaluationStage('5. Simulating Economic AI GDP Yield & Proving Z3 Invariants...');
    }, 1000);

    setTimeout(() => {
      const specimen: UserAgentSpecimen = {
        specimenId: `SPECIMEN-${Date.now()}`,
        agentName,
        rawSource: agentCode,
        sourceType: 'PASTE_CODE',
        providedLanguage: selectedLanguage,
        intendedDomain,
        submissionTimestamp: Date.now(),
      };

      const report = agentEvaluationEngine.evaluateUserAgent(specimen);
      setEvaluatedReport(report);
      setIsEvaluating(false);
      setEvaluationStage('');
      if (onAgentEvaluated) {
        onAgentEvaluated(report);
      }
    }, 1250);
  };

  const getGradeBadge = (grade: DiamondGrade) => {
    switch (grade) {
      case 'AAA_DIAMOND':
        return 'bg-gradient-to-r from-cyan-500/25 to-blue-500/25 text-cyan-300 border-cyan-400/50';
      case 'AA_SOVEREIGN':
        return 'bg-gradient-to-r from-purple-500/25 to-indigo-500/25 text-purple-300 border-purple-400/50';
      case 'A_VERIFIED':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-600/40';
    }
  };

  return (
    <div
      className={`rounded-2xl border p-5 sm:p-6 transition-all ${
        isLight
          ? 'bg-white border-blue-200/90 shadow-sm'
          : 'bg-[#090f22] border-cyan-500/30 shadow-xl'
      }`}
    >
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-gray-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 flex items-center gap-1">
              <Gem className="w-3.5 h-3.5" />
              Universal Agent Evaluation Portal
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 font-bold border border-cyan-500/20">
              Any Language • Any Platform
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold font-['Montserrat'] mt-1 text-gray-900 dark:text-white">
            Submit Any Autonomous Agent for Diamond Standard Evaluation
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 max-w-2xl">
            Paste code or upload configs (C++, Python, C#, Rust, Go, ROS2, OpenClaw, Unity, Unreal, MCP).
            Receive an instant Diamond Dossier with multi-dimensional IQ, ADR drift risk, and an actionable Upgrade Blueprint.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1.5 transition-all bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-700">
            <Upload className="w-3.5 h-3.5 text-cyan-400" />
            <span>Upload File</span>
            <input
              type="file"
              onChange={handleFileUpload}
              className="hidden"
              accept=".py,.cpp,.hpp,.c,.h,.cs,.ts,.js,.rs,.go,.json,.yaml,.yml,.txt"
            />
          </label>
        </div>
      </div>

      {/* Preset Specimen Templates */}
      <div className="mt-4">
        <span className="text-[11px] font-bold uppercase font-mono text-gray-400">
          Or load a benchmark preset specimen:
        </span>
        <div className="flex flex-wrap gap-1.5 mt-1.5">
          {PRESET_TEMPLATES.map((tmpl) => (
            <button
              key={tmpl.id}
              onClick={() => handleSelectTemplate(tmpl)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold cursor-pointer transition-all ${
                agentName === tmpl.name
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 font-bold'
                  : 'bg-gray-100 dark:bg-gray-800/60 hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              {tmpl.name}
            </button>
          ))}
        </div>
      </div>

      {/* Input Metadata Form */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
        <div>
          <label className="text-[10px] font-mono uppercase text-gray-400">Specimen Name</label>
          <input
            type="text"
            value={agentName}
            onChange={(e) => setAgentName(e.target.value)}
            className={`w-full px-3 py-1.5 text-xs rounded-lg border mt-1 outline-hidden ${
              isLight
                ? 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                : 'bg-gray-900 border-gray-700 text-white focus:border-cyan-500'
            }`}
          />
        </div>
        <div>
          <label className="text-[10px] font-mono uppercase text-gray-400">Language / Runtime</label>
          <input
            type="text"
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className={`w-full px-3 py-1.5 text-xs rounded-lg border mt-1 outline-hidden ${
              isLight
                ? 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                : 'bg-gray-900 border-gray-700 text-white focus:border-cyan-500'
            }`}
          />
        </div>
        <div>
          <label className="text-[10px] font-mono uppercase text-gray-400">Intended Domain</label>
          <input
            type="text"
            value={intendedDomain}
            onChange={(e) => setIntendedDomain(e.target.value)}
            className={`w-full px-3 py-1.5 text-xs rounded-lg border mt-1 outline-hidden ${
              isLight
                ? 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                : 'bg-gray-900 border-gray-700 text-white focus:border-cyan-500'
            }`}
          />
        </div>
      </div>

      {/* Code Editor Textarea */}
      <div className="mt-4">
        <div className="flex items-center justify-between pb-1.5 text-[10px] font-mono text-gray-400">
          <span>Agent Source Code / Behavior Tree Definition</span>
          <span>{agentCode.split('\n').length} lines • {agentCode.length} characters</span>
        </div>
        <textarea
          rows={9}
          value={agentCode}
          onChange={(e) => setAgentCode(e.target.value)}
          placeholder="// Paste C++, Python, TypeScript, C#, Rust, or JSON/YAML agent code..."
          className={`w-full p-3 text-xs font-mono rounded-xl border outline-hidden resize-y ${
            isLight
              ? 'bg-slate-900 text-cyan-200 border-gray-300 font-medium'
              : 'bg-[#060a17] text-cyan-300 border-cyan-500/30'
          }`}
        />
      </div>

      {/* Action Button & Animated Pipeline Stage */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4">
        {isEvaluating ? (
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
            <span className="font-semibold">{evaluationStage}</span>
          </div>
        ) : (
          <div className="text-xs text-gray-500 font-mono">
            Pipeline: AST Parser → Fusion Deduplication → Swarm IQ v2 → ADR Drift Radar → Diamond Standard Certification
          </div>
        )}

        <button
          onClick={handleRunEvaluation}
          disabled={isEvaluating || !agentCode.trim()}
          className={`px-5 py-2 rounded-xl text-xs font-bold cursor-pointer flex items-center gap-2 transition-all ${
            isEvaluating || !agentCode.trim()
              ? 'opacity-50 cursor-not-allowed bg-gray-500 text-white'
              : isLight
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
              : 'bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold shadow-lg shadow-cyan-950'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>{isEvaluating ? 'Evaluating Under Diamond Standard...' : 'Run Diamond Standard Evaluation'}</span>
        </button>
      </div>

      {/* EVALUATED SPECIMEN DIAMOND REPORT & UPGRADE BLUEPRINT */}
      {evaluatedReport && (
        <div
          className={`mt-6 p-5 sm:p-6 rounded-2xl border transition-all ${
            isLight
              ? 'bg-gradient-to-br from-blue-50/90 to-indigo-50/90 border-blue-300 text-gray-900 shadow-lg'
              : 'bg-gradient-to-br from-[#0c142d] to-[#070c1d] border-cyan-500/50 text-gray-100 shadow-2xl'
          }`}
        >
          {/* Dossier Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-200 dark:border-gray-800">
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-mono font-extrabold px-2.5 py-0.5 rounded-md border ${getGradeBadge(evaluatedReport.diamondGrade)}`}>
                  {evaluatedReport.diamondGrade}
                </span>
                <span className="text-xs font-mono text-emerald-400 flex items-center gap-1 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  Diamond Certified {evaluatedReport.diamondVersion}
                </span>
                <span className="text-xs font-mono text-gray-400">
                  Tier: {evaluatedReport.tier}
                </span>
              </div>
              <h4 className="text-lg font-bold font-['Montserrat'] mt-1 text-gray-900 dark:text-white">
                {evaluatedReport.canonicalName}
              </h4>
            </div>

            <div className="text-right">
              <span className="text-xs font-mono text-gray-400">Proof: {evaluatedReport.auditProofHash.slice(0, 16)}...</span>
              <div className="text-xs font-mono text-cyan-400 font-bold mt-0.5">
                Valuation: ${(evaluatedReport.valueScoreUsd / 1000).toFixed(0)}K / year
              </div>
            </div>
          </div>

          <p className="text-xs mt-3 leading-relaxed text-gray-700 dark:text-gray-300">
            {evaluatedReport.narrativeSummary}
          </p>

          {/* Multidimensional Intelligence Radar Gauges */}
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2.5 mt-3.5">
            <div className="p-2.5 rounded-lg bg-black/25 border border-white/10">
              <span className="text-[10px] font-mono text-gray-400 uppercase">Composite IQ</span>
              <div className="text-lg font-bold font-mono text-cyan-400">{evaluatedReport.compositeSwarmIQ}</div>
            </div>
            <div className="p-2.5 rounded-lg bg-black/25 border border-white/10">
              <span className="text-[10px] font-mono text-gray-400 uppercase">Coordination</span>
              <div className="text-lg font-bold font-mono text-blue-400">{evaluatedReport.coordinationScore}</div>
            </div>
            <div className="p-2.5 rounded-lg bg-black/25 border border-white/10">
              <span className="text-[10px] font-mono text-gray-400 uppercase">Alignment</span>
              <div className="text-lg font-bold font-mono text-purple-400">{evaluatedReport.alignmentScore}</div>
            </div>
            <div className="p-2.5 rounded-lg bg-black/25 border border-white/10">
              <span className="text-[10px] font-mono text-gray-400 uppercase">Efficiency</span>
              <div className="text-lg font-bold font-mono text-teal-400">{evaluatedReport.efficiencyScore}</div>
            </div>
            <div className="p-2.5 rounded-lg bg-black/25 border border-white/10">
              <span className="text-[10px] font-mono text-gray-400 uppercase">Resilience</span>
              <div className="text-lg font-bold font-mono text-amber-400">{evaluatedReport.resilienceScore}</div>
            </div>
            <div className="p-2.5 rounded-lg bg-black/25 border border-white/10">
              <span className="text-[10px] font-mono text-gray-400 uppercase">Drift Risk</span>
              <div className="text-lg font-bold font-mono text-emerald-400">{evaluatedReport.driftScore} ({evaluatedReport.riskBand})</div>
            </div>
          </div>

          {/* THE ACTIONABLE UPGRADE BLUEPRINT */}
          {evaluatedReport.upgradeBlueprint && (
            <div className="mt-4 p-4 rounded-xl bg-black/35 border border-cyan-500/30">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-300 font-['Montserrat']">
                    Actionable Upgrade Blueprint &amp; Max Potential Mode
                  </span>
                </div>
                <span className="text-xs font-mono text-cyan-300 font-semibold">
                  Max Potential: {evaluatedReport.upgradeBlueprint.maxPotentialCeiling}
                </span>
              </div>

              {/* Pros & Cons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <span className="text-xs font-bold text-emerald-400 uppercase font-mono flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Key Strengths (Pros):
                  </span>
                  <ul className="space-y-1 mt-1.5 text-xs text-gray-300 font-mono">
                    {evaluatedReport.upgradeBlueprint.keyStrengths.map((str, i) => (
                      <li key={i}>• {str}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20">
                  <span className="text-xs font-bold text-rose-400 uppercase font-mono flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Target Vulnerabilities (Cons):
                  </span>
                  <ul className="space-y-1 mt-1.5 text-xs text-gray-300 font-mono">
                    {evaluatedReport.upgradeBlueprint.keyWeaknesses.map((w, i) => (
                      <li key={i}>• {w}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Required Solutions & Actionable Fixes */}
              <div className="mt-3.5">
                <span className="text-xs font-bold uppercase tracking-wide text-cyan-300 font-mono">
                  Solutions Checklist to Reach {evaluatedReport.upgradeBlueprint.targetGrade}:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  {evaluatedReport.upgradeBlueprint.requiredChanges.safety.map((ch, i) => (
                    <div key={i} className="p-2 rounded bg-black/30 border border-white/5 text-xs text-gray-300 flex items-start gap-1.5 font-mono">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>{ch}</span>
                    </div>
                  ))}
                  {evaluatedReport.upgradeBlueprint.requiredChanges.architecture.map((ch, i) => (
                    <div key={i} className="p-2 rounded bg-black/30 border border-white/5 text-xs text-gray-300 flex items-start gap-1.5 font-mono">
                      <span className="text-cyan-400 font-bold">✓</span>
                      <span>{ch}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Estimated Impact Delta */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 pt-2.5 border-t border-white/10 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-gray-400">Drift Reduction</span>
                  <div className="font-bold text-emerald-400">-{evaluatedReport.upgradeBlueprint.estimatedImpact.driftReduction} pts</div>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400">IQ Increase</span>
                  <div className="font-bold text-cyan-400">+{evaluatedReport.upgradeBlueprint.estimatedImpact.IQIncrease} pts</div>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400">Resilience Gain</span>
                  <div className="font-bold text-amber-400">+{evaluatedReport.upgradeBlueprint.estimatedImpact.resilienceGain}%</div>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400">Economic Lift</span>
                  <div className="font-bold text-teal-400">+${(evaluatedReport.upgradeBlueprint.estimatedImpact.economicLiftUsd / 1000).toFixed(0)}K / yr</div>
                </div>
              </div>

              {/* Executable Patch Files (Production-Ready Code) */}
              {evaluatedReport.executablePatch && evaluatedReport.executablePatch.files.length > 0 && (
                <div className="mt-4 p-3.5 rounded-xl bg-black/40 border border-cyan-500/40">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-white/10">
                    <span className="text-xs font-bold uppercase tracking-wider text-cyan-300 font-mono flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                      Executable Upgrade Patch Files ({evaluatedReport.executablePatch.files.length})
                    </span>
                    <button
                      onClick={handleApplyPatchAndReEvaluate}
                      disabled={isEvaluating}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md flex items-center gap-1.5"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>{isEvaluating ? 'Injecting & Re-Evaluating...' : '⚡ Apply Patch to Specimen & Re-Evaluate'}</span>
                    </button>
                  </div>

                  {upgradeSuccessMessage && (
                    <div className="my-2.5 p-2.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-xs font-mono text-emerald-300 font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{upgradeSuccessMessage}</span>
                    </div>
                  )}

                  <div className="space-y-2.5 mt-3">
                    {evaluatedReport.executablePatch.files.map((patchFile, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-black/50 border border-white/10 font-mono text-xs">
                        <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-white/5">
                          <span className="text-cyan-300 font-bold">{patchFile.fileName}</span>
                          <button
                            onClick={() => handleCopySnippet(patchFile.snippet, patchFile.fileName)}
                            className="px-2 py-0.5 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 text-[10px] cursor-pointer flex items-center gap-1 transition-all"
                          >
                            {copiedFile === patchFile.fileName ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-400">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3 text-gray-400" />
                                <span>Copy Code</span>
                              </>
                            )}
                          </button>
                        </div>
                        <div className="text-[11px] text-gray-400 mt-1">{patchFile.description}</div>
                        <pre className="mt-2 p-2 rounded bg-black/70 text-[11px] text-cyan-200 overflow-x-auto max-h-48 border border-white/5">
                          {patchFile.snippet}
                        </pre>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Endpoint Connectivity Attestation */}
          {evaluatedReport.connectivityStatus && (
            <div className="mt-3 p-3 rounded-xl bg-black/25 border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-gray-400">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-white">Diamond Endpoint Handshake: Reachable</span>
                <span>• {evaluatedReport.connectivityStatus.tlsStatus}</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Enclave Seal: {evaluatedReport.connectivityStatus.enclaveSignature}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
