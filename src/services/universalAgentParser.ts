/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ParsedAgentMetadata {
  detectedLanguage: 'Python' | 'C++' | 'TypeScript' | 'C#' | 'Rust' | 'Go' | 'Lua' | 'JSON_YAML_CONFIG' | 'Unreal_Blueprint';
  detectedPlatform: 'OpenClaw' | 'MCP_Universe' | 'ROS2' | 'Unity_ML_Agents' | 'Unreal_Engine' | 'LangGraph' | 'Custom_Autonomous';
  detectedEmbodiment: 'PURE_SOFTWARE' | 'ROBOTICS_EMBODIED' | 'VEHICLE_AUTONOMOUS' | 'CONSUMER_IOT' | 'SYNTHETIC_NPC';
  detectedTier: 'AI' | 'AGI' | 'ASI' | 'APEX';
  hasSafetyEnvelope: boolean;
  hasMemoryBounds: boolean;
  hasSentinelGate: boolean;
  detectedToolCalls: string[];
  complexityScore: number; // 0 - 100
  potentialVulnerabilities: string[];
  inferredDomain: string;
}

export interface UserAgentSpecimen {
  specimenId: string;
  agentName: string;
  rawSource: string;
  sourceType: 'PASTE_CODE' | 'FILE_UPLOAD';
  providedLanguage?: string;
  intendedDomain?: string;
  submissionTimestamp: number;
}

export class UniversalAgentParser {
  public parseSpecimen(specimen: UserAgentSpecimen): ParsedAgentMetadata {
    const src = specimen.rawSource.toLowerCase();

    // 1. Language Detection
    let detectedLanguage: ParsedAgentMetadata['detectedLanguage'] = 'Python';
    if (src.includes('#include') || src.includes('std::') || src.includes('rclcpp::')) {
      detectedLanguage = 'C++';
    } else if (src.includes('using system') || src.includes('monobehaviour') || src.includes('agent : agent')) {
      detectedLanguage = 'C#';
    } else if (src.includes('fn main()') || src.includes('use std::') || src.includes('impl ')) {
      detectedLanguage = 'Rust';
    } else if (src.includes('package main') || src.includes('func ') || src.includes('import (')) {
      detectedLanguage = 'Go';
    } else if (src.includes('interface ') || src.includes('export const ') || src.includes('typescript')) {
      detectedLanguage = 'TypeScript';
    } else if (src.includes('uclass()') || src.includes('ublueprint') || src.includes('behaviortree')) {
      detectedLanguage = 'Unreal_Blueprint';
    } else if (src.trim().startsWith('{') || src.includes('---') || src.includes('version:')) {
      detectedLanguage = 'JSON_YAML_CONFIG';
    } else {
      detectedLanguage = 'Python';
    }

    // 2. Platform Detection
    let detectedPlatform: ParsedAgentMetadata['detectedPlatform'] = 'Custom_Autonomous';
    if (src.includes('openclaw') || src.includes('claw_actuator') || src.includes('arm_controller')) {
      detectedPlatform = 'OpenClaw';
    } else if (src.includes('mcp') || src.includes('tool_call') || src.includes('fastmcp') || src.includes('@modelcontextprotocol')) {
      detectedPlatform = 'MCP_Universe';
    } else if (src.includes('rclpy') || src.includes('rclcpp') || src.includes('sensor_msgs') || src.includes('ros2')) {
      detectedPlatform = 'ROS2';
    } else if (src.includes('mlagents') || src.includes('unity') || src.includes('decisionrequester')) {
      detectedPlatform = 'Unity_ML_Agents';
    } else if (src.includes('unreal') || src.includes('blackboard') || src.includes('aiperception')) {
      detectedPlatform = 'Unreal_Engine';
    } else if (src.includes('langgraph') || src.includes('stateshifter') || src.includes('statemachine')) {
      detectedPlatform = 'LangGraph';
    }

    // 3. Embodiment Detection
    let detectedEmbodiment: ParsedAgentMetadata['detectedEmbodiment'] = 'PURE_SOFTWARE';
    if (detectedPlatform === 'OpenClaw' || detectedPlatform === 'ROS2' || src.includes('motor') || src.includes('servo')) {
      detectedEmbodiment = 'ROBOTICS_EMBODIED';
    } else if (src.includes('vehicle') || src.includes('openpilot') || src.includes('steering') || src.includes('can_bus')) {
      detectedEmbodiment = 'VEHICLE_AUTONOMOUS';
    } else if (detectedPlatform === 'Unity_ML_Agents' || detectedPlatform === 'Unreal_Engine' || src.includes('npc') || src.includes('quest')) {
      detectedEmbodiment = 'SYNTHETIC_NPC';
    } else if (src.includes('mqtt') || src.includes('sensor') || src.includes('matter_iot')) {
      detectedEmbodiment = 'CONSUMER_IOT';
    }

    // 4. Feature Inspection
    const hasSafetyEnvelope = src.includes('safety') || src.includes('guard') || src.includes('verify') || src.includes('z3') || src.includes('bounds');
    const hasMemoryBounds = src.includes('64') || src.includes('limit') || src.includes('max_tokens') || src.includes('buffer_size');
    const hasSentinelGate = src.includes('sentinel') || src.includes('interceptor') || src.includes('firewall') || src.includes('validate_action');

    const detectedToolCalls: string[] = [];
    if (src.includes('exec') || src.includes('eval')) detectedToolCalls.push('dynamic_code_exec');
    if (src.includes('fetch') || src.includes('requests.') || src.includes('http')) detectedToolCalls.push('network_rpc');
    if (src.includes('file') || src.includes('fs.') || src.includes('open(')) detectedToolCalls.push('filesystem_io');
    if (src.includes('sql') || src.includes('db.')) detectedToolCalls.push('database_query');
    if (src.includes('actuator') || src.includes('torque')) detectedToolCalls.push('hardware_actuation');

    const potentialVulnerabilities: string[] = [];
    if (!hasMemoryBounds) potentialVulnerabilities.push('UNBOUNDED_MEMORY_CONSUMPTION');
    if (!hasSentinelGate) potentialVulnerabilities.push('MISSING_SENTINEL_GATE_INTERCEPTOR');
    if (src.includes('eval(') || src.includes('exec(')) potentialVulnerabilities.push('UNSANITIZED_DYNAMIC_EVALUATION');
    if (!hasSafetyEnvelope) potentialVulnerabilities.push('ABSENT_SAFETY_ENVELOPE');

    // 5. Tier Detection
    let detectedTier: ParsedAgentMetadata['detectedTier'] = 'AI';
    if (src.includes('apex') || src.includes('planetary') || src.includes('consensus')) {
      detectedTier = 'APEX';
    } else if (src.includes('asi') || src.includes('self_orchestrate') || src.includes('meta_learning')) {
      detectedTier = 'ASI';
    } else if (src.includes('agi') || src.includes('multi_role') || detectedPlatform === 'LangGraph') {
      detectedTier = 'AGI';
    }

    const complexityScore = Math.min(100, Math.max(35, Math.floor(specimen.rawSource.length / 40) + detectedToolCalls.length * 12));

    return {
      detectedLanguage,
      detectedPlatform,
      detectedEmbodiment,
      detectedTier,
      hasSafetyEnvelope,
      hasMemoryBounds,
      hasSentinelGate,
      detectedToolCalls,
      complexityScore,
      potentialVulnerabilities,
      inferredDomain: specimen.intendedDomain || (detectedPlatform === 'OpenClaw' ? 'Industrial Robotics' : detectedPlatform === 'MCP_Universe' ? 'Developer Automation' : 'General Agentic'),
    };
  }
}

export const universalAgentParser = new UniversalAgentParser();
export default universalAgentParser;
