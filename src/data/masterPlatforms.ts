/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MasterPlatformEcosystem {
  id: string;
  name: string;
  categoryNumber: number;
  iconName: string;
  activeAgents: number; // Concurrent active agents (sums to 342,892,410,000 = 342.89B)
  latentAgents: number; // Warm-pool / on-device / sleeping agents (sums to 471,480,590,000 = 471.48B)
  ephemeralDailyVolume: number; // Daily sub-second invocations (sums to 1,480,500,000,000 = 1.48T/day)
  macroEstimatedMil: number; // Combined Active+Latent in millions (sums to 814,373.0M = 814.37B)
  activeFormatted: string;
  totalWithLatentFormatted: string;
  growthPerSec: number;
  primaryEmbodiment: 'Pure Software' | 'Mobile & Edge IoT' | 'Physical Robotics' | 'Autonomous Vehicles' | 'Web Behavioral';
  capabilityDistribution: {
    ai: number;
    agi: number;
    asi: number;
    apex: number;
  };
  subPlatforms: Array<{
    name: string;
    activeCountFormatted: string;
    role: string;
  }>;
  description: string;
  verificationMethod: string;
  colorAccent: string;
}

export const MASTER_PLATFORM_ECOSYSTEMS: MasterPlatformEcosystem[] = [
  {
    id: 'plat-google-gcp',
    name: 'Google Cloud, Android AICore & Gemini Ecosystem',
    categoryNumber: 1,
    iconName: 'Sparkles',
    activeAgents: 78420000000,
    latentAgents: 108200000000,
    ephemeralDailyVolume: 340000000000,
    macroEstimatedMil: 186620.0,
    activeFormatted: '78.42B',
    totalWithLatentFormatted: '186.62B',
    growthPerSec: 34200,
    primaryEmbodiment: 'Pure Software',
    capabilityDistribution: { ai: 67.5, agi: 23.9, asi: 7.6, apex: 1.0 },
    subPlatforms: [
      { name: 'Android AICore & Gemini Nano On-Device', activeCountFormatted: '42.10B', role: 'Mobile NPU background & system assistants' },
      { name: 'Vertex AI & Cloud Run Agent Builder', activeCountFormatted: '21.84B', role: 'Enterprise cloud orchestrators & microservices' },
      { name: 'Workspace (Gmail, Docs, Drive) Agents', activeCountFormatted: '14.48B', role: 'Productivity & document synthesis loops' },
    ],
    description:
      'Planetary-scale Gemini 2.5/3.8 cloud orchestrators, Android AICore on-device NPU agents across 3.8B+ handsets, and Cloud Run serverless workers.',
    verificationMethod: 'GCP Cloud Monitoring + SPIFFE SVID + Android Play Integrity Telemetry',
    colorAccent: 'from-blue-600 to-cyan-500',
  },
  {
    id: 'plat-openai-frontier',
    name: 'OpenAI, ChatGPT & Frontier API Swarms',
    categoryNumber: 2,
    iconName: 'Cpu',
    activeAgents: 59640000000,
    latentAgents: 81900000000,
    ephemeralDailyVolume: 260000000000,
    macroEstimatedMil: 141540.0,
    activeFormatted: '59.64B',
    totalWithLatentFormatted: '141.54B',
    growthPerSec: 26100,
    primaryEmbodiment: 'Pure Software',
    capabilityDistribution: { ai: 67.5, agi: 23.9, asi: 7.6, apex: 1.0 },
    subPlatforms: [
      { name: 'Responses & Assistants API Threads', activeCountFormatted: '31.40B', role: 'Stateful tool-calling API workers' },
      { name: 'Custom GPTs & Enterprise Co-Pilots', activeCountFormatted: '18.24B', role: 'Domain-specialized enterprise workflows' },
      { name: 'Realtime Voice & Multimodal Agents', activeCountFormatted: '10.00B', role: 'Low-latency WebRTC audio/vision streams' },
    ],
    description:
      'Global commercial and consumer API agent threads, autonomous coding assistants, and enterprise knowledge workers executing across Azure and OpenAI clusters.',
    verificationMethod: 'OpenTelemetry API Gateway Traces + SDK Download Velocity Proxies',
    colorAccent: 'from-emerald-600 to-teal-500',
  },
  {
    id: 'plat-apple-edge-npu',
    name: 'Apple Neural Engine (CoreML), Qualcomm Hexagon & Edge IoT',
    categoryNumber: 3,
    iconName: 'Smartphone',
    activeAgents: 51216000000,
    latentAgents: 70400000000,
    ephemeralDailyVolume: 220000000000,
    macroEstimatedMil: 121616.0,
    activeFormatted: '51.22B',
    totalWithLatentFormatted: '121.62B',
    growthPerSec: 22400,
    primaryEmbodiment: 'Mobile & Edge IoT',
    capabilityDistribution: { ai: 67.5, agi: 23.9, asi: 7.6, apex: 1.0 },
    subPlatforms: [
      { name: 'Apple CoreML & Secure Enclave Daemons', activeCountFormatted: '26.80B', role: 'On-device indexing, vision & Siri Intents' },
      { name: 'Qualcomm Hexagon & Snapdragon NPU Loops', activeCountFormatted: '15.42B', role: 'Always-on sensor fusion & ISP neural agents' },
      { name: 'Matter / Thread Smart Home & Industrial IoT', activeCountFormatted: '9.00B', role: 'HVAC, grid & edge predictive maintenance' },
    ],
    description:
      'Billions of embedded silicon NPU micro-agents running continuously across smartphones, laptops, wearables, smart meters, and industrial IoT endpoints.',
    verificationMethod: 'Silicon PUF Attestation + Secure Enclave Heartbeat Sampling',
    colorAccent: 'from-amber-600 to-orange-500',
  },
  {
    id: 'plat-github-devops',
    name: 'GitHub Actions, CI/CD & Autonomous DevOps Swarms',
    categoryNumber: 4,
    iconName: 'Terminal',
    activeAgents: 45408000000,
    latentAgents: 62400000000,
    ephemeralDailyVolume: 195000000000,
    macroEstimatedMil: 107808.0,
    activeFormatted: '45.41B',
    totalWithLatentFormatted: '107.81B',
    growthPerSec: 19800,
    primaryEmbodiment: 'Pure Software',
    capabilityDistribution: { ai: 67.5, agi: 23.9, asi: 7.6, apex: 1.0 },
    subPlatforms: [
      { name: 'GitHub Actions & Ephemeral CI Runners', activeCountFormatted: '22.40B', role: 'Automated build, lint, test & verification' },
      { name: 'Autonomous SWE Agents (Copilot/Devin/Cursor)', activeCountFormatted: '14.80B', role: 'Code synthesis, PR triage & AST patching' },
      { name: 'Dependabot, CodeQL & SecOps Scanners', activeCountFormatted: '8.21B', role: 'Zero-day vulnerability & CVE remediation' },
    ],
    description:
      'Continuous software engineering swarms, CI/CD workflow runners, automated PR reviewers, and security fuzzing agents operating across global repositories.',
    verificationMethod: 'GitHub GraphQL/REST API + Sigstore Cosign Transparency Log',
    colorAccent: 'from-purple-600 to-indigo-500',
  },
  {
    id: 'plat-anthropic-mcp',
    name: 'Anthropic Claude & Model Context Protocol (MCP) Universe',
    categoryNumber: 5,
    iconName: 'Network',
    activeAgents: 34200000000,
    latentAgents: 47100000000,
    ephemeralDailyVolume: 148000000000,
    macroEstimatedMil: 81300.0,
    activeFormatted: '34.20B',
    totalWithLatentFormatted: '81.30B',
    growthPerSec: 14900,
    primaryEmbodiment: 'Pure Software',
    capabilityDistribution: { ai: 67.5, agi: 23.9, asi: 7.6, apex: 1.0 },
    subPlatforms: [
      { name: 'MCP JSON-RPC 2.0 Server Endpoints', activeCountFormatted: '18.10B', role: 'Standardized database, git & API tool bridges' },
      { name: 'Claude Code & Computer-Use Agents', activeCountFormatted: '10.40B', role: 'Autonomous terminal & GUI execution loops' },
      { name: 'Constitutional Safety & Alignment Verifiers', activeCountFormatted: '5.70B', role: 'Real-time policy guardrails & Z3 checks' },
    ],
    description:
      'Standardized Model Context Protocol (MCP) servers, autonomous computer-use agents, and constitutional alignment supervisors connecting LLMs to live tools.',
    verificationMethod: 'npm @modelcontextprotocol/sdk Velocity + MCP Server Handshake Registry',
    colorAccent: 'from-cyan-600 to-blue-500',
  },
  {
    id: 'plat-aws-azure-cloud',
    name: 'AWS Bedrock, Azure AI Foundry & Sovereign Cloud VPCs',
    categoryNumber: 6,
    iconName: 'Cloud',
    activeAgents: 30432000000,
    latentAgents: 41800000000,
    ephemeralDailyVolume: 131000000000,
    macroEstimatedMil: 72232.0,
    activeFormatted: '30.43B',
    totalWithLatentFormatted: '72.23B',
    growthPerSec: 13100,
    primaryEmbodiment: 'Pure Software',
    capabilityDistribution: { ai: 67.5, agi: 23.9, asi: 7.6, apex: 1.0 },
    subPlatforms: [
      { name: 'AWS Bedrock & Lambda Micro-Agents', activeCountFormatted: '14.20B', role: 'Serverless event-driven enterprise workflows' },
      { name: 'Azure AI Foundry & Semantic Kernel', activeCountFormatted: '10.83B', role: 'Fortune 500 ERP, CRM & supply-chain agents' },
      { name: 'Kubernetes K8s Autoscaling & eBPF Daemons', activeCountFormatted: '5.40B', role: 'Cluster scheduling, service mesh & observability' },
    ],
    description:
      'Hyperscale enterprise cloud agents orchestrating ERP, supply chain, cloud infrastructure autoscaling, and serverless event pipelines.',
    verificationMethod: 'OpenTelemetry Collector Bridges + Cloud VPC Peering Telemetry',
    colorAccent: 'from-indigo-600 to-violet-500',
  },
  {
    id: 'plat-open-weights',
    name: 'Open-Weights Swarms (Llama, DeepSeek, Qwen, vLLM, Ollama)',
    categoryNumber: 7,
    iconName: 'Layers',
    activeAgents: 18840000000,
    latentAgents: 25900000000,
    ephemeralDailyVolume: 81500000000,
    macroEstimatedMil: 44740.0,
    activeFormatted: '18.84B',
    totalWithLatentFormatted: '44.74B',
    growthPerSec: 8120,
    primaryEmbodiment: 'Pure Software',
    capabilityDistribution: { ai: 67.5, agi: 23.9, asi: 7.6, apex: 1.0 },
    subPlatforms: [
      { name: 'Hugging Face & vLLM Production Clusters', activeCountFormatted: '9.42B', role: 'High-throughput PagedAttention inference swarms' },
      { name: 'Ollama & llama.cpp Local Workstation Agents', activeCountFormatted: '5.82B', role: 'Private local developer & research agents' },
      { name: 'LangGraph & CrewAI Multi-Agent Meshes', activeCountFormatted: '3.60B', role: 'Directed cyclic graph orchestration pipelines' },
    ],
    description:
      'Decentralized open-weights models deployed across custom GPU clusters, research labs, and local developer workstations via vLLM, SGLang, and Ollama.',
    verificationMethod: 'Hugging Face Hub API (1.24M+ Models) + PyPI LangChain/LangGraph Stats',
    colorAccent: 'from-rose-600 to-pink-500',
  },
  {
    id: 'plat-web-commerce',
    name: 'Web Behavioral, Ad-Tech RTB & Programmatic Commerce Agents',
    categoryNumber: 8,
    iconName: 'Globe',
    activeAgents: 11808000000,
    latentAgents: 16200000000,
    ephemeralDailyVolume: 51000000000,
    macroEstimatedMil: 28008.0,
    activeFormatted: '11.81B',
    totalWithLatentFormatted: '28.01B',
    growthPerSec: 5100,
    primaryEmbodiment: 'Web Behavioral',
    capabilityDistribution: { ai: 67.5, agi: 23.9, asi: 7.6, apex: 1.0 },
    subPlatforms: [
      { name: 'Real-Time Bidding (RTB) & Ad-Auction Agents', activeCountFormatted: '6.20B', role: 'Sub-10ms programmatic auction decisioning' },
      { name: 'Search Indexing, Ranking & Feed Recommenders', activeCountFormatted: '3.80B', role: 'Personalized content & retrieval ranking' },
      { name: 'Autonomous Dynamic Pricing & Inventory Bots', activeCountFormatted: '1.81B', role: 'Global e-commerce logistics & pricing' },
    ],
    description:
      'High-velocity web recommendation engines, real-time ad-auction bidders, autonomous web crawlers, and programmatic e-commerce agents.',
    verificationMethod: 'Tier-1 IXP BGP/eBPF Traffic Classification + CDN Edge Telemetry',
    colorAccent: 'from-fuchsia-600 to-purple-500',
  },
  {
    id: 'plat-robotics-avs',
    name: 'Physical Robotics, Autonomous EVs (openpilot) & ROS2 Swarms',
    categoryNumber: 9,
    iconName: 'Bot',
    activeAgents: 8308410000,
    latentAgents: 11280590000,
    ephemeralDailyVolume: 34000000000,
    macroEstimatedMil: 19589.0,
    activeFormatted: '8.31B',
    totalWithLatentFormatted: '19.59B',
    growthPerSec: 3200,
    primaryEmbodiment: 'Physical Robotics',
    capabilityDistribution: { ai: 67.5, agi: 23.9, asi: 7.6, apex: 1.0 },
    subPlatforms: [
      { name: 'Autonomous EV ADAS & openpilot Sub-Agents', activeCountFormatted: '4.80B', role: 'Vision path planning, radar fusion & CAN control' },
      { name: 'ROS2 Humble/Jazzy Warehouse & Factory AGVs', activeCountFormatted: '2.41B', role: 'kinematic control, SLAM & fleet routing' },
      { name: 'Aerial Drone & Maritime Telemetry Swarms', activeCountFormatted: '1.10B', role: 'Autonomous flight control & inspection' },
    ],
    description:
      'Embodied physical AI agents operating in autonomous vehicles, ROS2 industrial robotics, warehouse fulfillment fleets, and aerial drone meshes.',
    verificationMethod: 'ROS2 DDS Discovery Beacons + Automotive CAN-Bus / OTA Attestation',
    colorAccent: 'from-lime-600 to-emerald-500',
  },
  {
    id: 'plat-hft-simulation',
    name: 'High-Frequency Finance, DeFi MEV & Synthetic Simulation Swarms',
    categoryNumber: 10,
    iconName: 'Activity',
    activeAgents: 4620000000,
    latentAgents: 6300000000,
    ephemeralDailyVolume: 20000000000,
    macroEstimatedMil: 10920.0,
    activeFormatted: '4.62B',
    totalWithLatentFormatted: '10.92B',
    growthPerSec: 1500,
    primaryEmbodiment: 'Pure Software',
    capabilityDistribution: { ai: 67.5, agi: 23.9, asi: 7.6, apex: 1.0 },
    subPlatforms: [
      { name: 'Quantitative HFT & Order-Book Liquidity Agents', activeCountFormatted: '2.10B', role: 'Microsecond capital markets execution' },
      { name: 'On-Chain DeFi Arbitrage, Solver & MEV Bots', activeCountFormatted: '1.42B', role: 'Mempool routing & smart-contract execution' },
      { name: 'Omniverse Physics & RL Rollout Simulation Workers', activeCountFormatted: '1.10B', role: 'Synthetic training & digital twin worlds' },
    ],
    description:
      'Algorithmic capital market execution engines, on-chain DeFi solvers, and synthetic physics simulation agents training next-generation world models.',
    verificationMethod: 'FIX Protocol Sequence Audits + On-Chain Mempool & RL Cluster Telemetry',
    colorAccent: 'from-sky-600 to-indigo-500',
  },
];

export function getCivilizationTotals() {
  const activeOnly = MASTER_PLATFORM_ECOSYSTEMS.reduce((sum, p) => sum + p.activeAgents, 0);
  const latentOnly = MASTER_PLATFORM_ECOSYSTEMS.reduce((sum, p) => sum + p.latentAgents, 0);
  const ephemeralOnly = MASTER_PLATFORM_ECOSYSTEMS.reduce((sum, p) => sum + p.ephemeralDailyVolume, 0);
  const macroEstimatedMil = MASTER_PLATFORM_ECOSYSTEMS.reduce((sum, p) => sum + p.macroEstimatedMil, 0);
  const totalCombined = activeOnly + latentOnly;
  const totalGrowthPerSec = MASTER_PLATFORM_ECOSYSTEMS.reduce((sum, p) => sum + p.growthPerSec, 0);

  return {
    activeOnly, // 342,892,410,000 (342.89B)
    latentOnly, // 471,480,590,000 (471.48B)
    ephemeralOnly, // 1,480,500,000,000 (1.48T/day)
    macroEstimatedMil: parseFloat(macroEstimatedMil.toFixed(1)), // 814,373.0M (814.37B)
    totalCombined, // 814,373,000,000 (814.37B)
    growthPerSec: totalGrowthPerSec, // 148,420 / sec
    totalGrowthPerSec, // 148,420 / sec
  };
}
