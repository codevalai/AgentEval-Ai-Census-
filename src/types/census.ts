/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type CapabilityTierKey = 'AI' | 'AGI' | 'ASI' | 'APEX';

export type AgentStatus =
  | 'ACTIVE'
  | 'DEPRECATED'
  | 'TOMBSTONED'
  | 'REINCARNATED'
  | 'EMBEDDED_OFFLINE'
  | 'FUTURE_PROJECTED';

export type AgentEra =
  | '2012_2017_DEEP_LEARNING'
  | '2018_2020_TRANSFORMER'
  | '2021_2023_FOUNDATION'
  | '2024_2026_MCP_SWARMS'
  | '2027_2029_SOVEREIGN_NODES'
  | '2030_APEX_SINGULARITY';

export interface AgentBehaviorGenome {
  reasoning: number; // 0-100 (Tree-of-Thought / CoT / SMT-LIB2 SAT)
  autonomy: number; // 0-100 (Human-in-loop -> Unsupervised Swarm)
  toolUse: number; // 0-100 (Read -> Root MCP Execution)
  safetyPqc: number; // 0-100 (Kyber/ML-KEM-1024 + Cleanroom)
  domainDepth: number; // 0-100 (Specialized heuristic domain capacity)
  swarmCoord: number; // 0-100 (BFT Gossip / Quorum sync)
}

export interface PlanetaryAgentRecord {
  id: string;
  name: string;
  platform: string; // e.g. 'Google AI Studio Agents', 'Microsoft AutoGen', 'LangChain Agents', 'CrewAI', 'Anthropic Claude Code', 'OpenAI Assistants', 'Replit Agents', 'Devin', 'CAMEL', 'AutoGPT', 'Cursor Agents'
  archetype: string;
  tier: CapabilityTierKey;
  regionCity: string;
  jurisdictionIso3166: string;
  flag: string;
  era: AgentEra;
  status: AgentStatus;
  createdAt: string;
  pqcKey: string;
  merkleLeafHash: string;
  lineageParent?: string;
  reincarnationVersion?: string;
  genome: AgentBehaviorGenome;
  domain: string;
  mcpTools: string[];
  tombstoneReason?: string;
  estimatedInstancesCount: number;
}

export interface TemporalTimelineEra {
  id: AgentEra;
  years: string;
  eraTitle: string;
  subtitle: string;
  agentCountFormatted: string;
  agentCountRaw: number;
  milestones: string[];
  dominantPlatforms: string[];
  cryptographicAnchor: string;
  paradigms: string[];
  status: 'HISTORICAL' | 'CURRENT' | 'PROJECTED';
}

export interface MCPServerRecord {
  id: string;
  name: string;
  protocolVersion: string;
  toolsCount: number;
  category: string;
  velocityPerSec: number;
  status: 'ONLINE' | 'STANDBY' | 'RATE_LIMITED';
  transportType: 'STDIO' | 'SSE_HTTP' | 'WEBSOCKET';
  primaryEndpoint: string;
  sampleTools: string[];
}

export interface AgentCivilizationTreaty {
  id: string;
  name: string;
  ratificationYear: string;
  signatoriesCount: number;
  coreMandate: string;
  enforcementEngine: string;
  status: 'ACTIVE_RATIFIED' | 'EMERGING';
  invariantProof: string;
}

export interface ReplayVerificationWitness {
  isDeterministic: boolean;
  totalEventsReplayed: number;
  originalMerkleRoot: string;
  replayedMerkleRoot: string;
  witnessSignature: string;
  timestamp: string;
  divergenceBlock: number | null;
  solverLatencyMs: number;
}

export interface SovereignEvent {
  eventId: string;
  topic: string;
  actor: string;
  payload: Record<string, any>;
  timestamp: number;
  sequence: number;
}

export interface AuditAnchor {
  blockHeight: number;
  eventId: string;
  actor: string;
  cityNode: string;
  previousHash: string;
  leafHash: string;
  merkleRoot: string;
  timestamp: number;
}

export interface CapabilityTierInfo {
  tier: CapabilityTierKey;
  name: string;
  badgeColor: string;
  description: string;
  minTasks: number;
  minAutonomy: number;
  minReasoning: number;
  count: number;
  growthRate: string;
  representativeArchetypes: string[];
  promotionCriteria: string;
}

export interface CensusStats {
  totalAgents: number;
  agentsBornToday: number;
  agentsShutdownToday: number;
  netGrowthToday: number;
  agentsCreatedYear: number;
  agiAgents: number;
  asiAgents: number;
  apexAgents: number;
  swarmIntelligenceIndex: number;
  globalAutonomyIndex: number;
  toolInvocationsPerSec: number;
  birthsPerSec: number;
  shutdownsPerSec: number;
  verifiedConfidence: number; // e.g. 68.4%
  selfReportedConfidence: number; // 23.2%
  inferredConfidence: number; // 8.4%
  bftQuorumPercent: number; // 85.0%
  defconLevel: number; // 2
  memorySliceBoundedKB: number; // 64
}

export interface RegionalNode {
  id: string;
  rank: number;
  name: string;
  city: string;
  country: string;
  regionCode: string;
  totalAgents: number;
  aiAgents: number;
  agiAgents: number;
  asiAgents: number;
  apexNodes: number;
  latencyMs: number;
  bftWeight: number;
  health: 'OPTIMAL' | 'DEGRADED' | 'ISOLATED';
  sharePercent: number;
}

export interface AtlasCategory {
  id: number;
  title: string;
  categoryTag: string;
  description: string;
  sourceCountFormatted: string;
  sourceCountRaw: number;
  opennessPercent: number;
  ingestionRate: string;
  topEntities: string[];
  keyProtocols: string[];
  status: 'STREAMING' | 'BATCH_SYNC' | 'AUDITING';
  verifiedCleanroom: boolean;
}

export interface CountryOrigin {
  rank: number;
  country: string;
  code: string;
  flag: string;
  totalAgents: number;
  agiCount: number;
  asiCount: number;
  apexCount: number;
  z3ProofStatus: 'VERIFIED_SAT' | 'EVALUATING';
  growthRate: string;
  worldShare: number;
}

export interface SovereignLab {
  id: string;
  name: string;
  jurisdiction: string;
  activeAgents: number;
  topArchitectures: string[];
  cleanroomStatus: 'Z3_CERTIFIED' | 'SELF_ATTESTED';
  pqcKeyAlgorithm: string;
  merkleLeafHash: string;
}

export interface ThreatVector {
  id: string;
  title: string;
  vectorType: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  affectedStacks: string[];
  status: 'MITIGATING' | 'CONTAINED' | 'INTERCEPTED';
  dropRatePercent: number;
  lastIntercepted: string;
  playbookStage: 'DETECTED' | 'ISOLATED' | 'PQC_DEFENSE' | 'CONTAINED';
  description: string;
  mitigationAction: string;
}

export interface HarvestSource {
  id: string;
  name: string;
  category: string;
  endpoint: string;
  status: 'ACTIVE' | 'STREAMING' | 'SYNCED' | 'TRIGGERED';
  lastHarvestLatency: number;
  recordsIngested: number;
  merkleLeafDigest: string;
  lastSyncTimestamp: string;
  realUrl?: string;
}

export interface GovernanceRFC {
  rfcNumber: string;
  title: string;
  status: 'RATIFIED_UNANIMOUS' | 'UNDER_REVIEW';
  quorumScore: number;
  invariantFormula: string;
  description: string;
}

export interface DarkMatterZone {
  id: string;
  title: string;
  estimatedAgents: number;
  estimatedAgentsFormatted: string;
  coverageGapReason: string;
  riskIndex: 'EXTREME' | 'HIGH' | 'ELEVATED';
  primaryJurisdictions: string[];
}

export interface BehaviorDomain {
  domain: string;
  riskLevel: 'EXTREME' | 'HIGH' | 'ELEVATED' | 'CONTROLLED';
  autonomyScore: number;
  toolVelocity: number;
  isolationStatus: 'AIR_GAPPED' | 'SANDBOX_ISOLATED' | 'MONITORED_GATEWAY';
  humanInTheLoopActive: boolean;
}

export interface RegisteredAgentInput {
  name: string;
  archetype: string;
  tier: CapabilityTierKey;
  region: string;
  jurisdiction: string;
  publicKey: string;
  intendedDomain: string;
}

export interface TombstoneInput {
  agentOrDatasetId: string;
  reason: string;
  legalFramework: 'EU_AI_ACT' | 'GDPR_ART_17' | 'CCPA_RIGHT_TO_FORGET' | 'COPYRIGHT_TAKEDOWN';
  operatorSignature: string;
}

export interface LiveEventItem {
  id: string;
  timestamp: string;
  type: 'BIRTH' | 'PROMOTION' | 'DEFENSE' | 'HARVEST' | 'TOMBSTONE' | 'INVARIANT';
  title: string;
  detail: string;
  merkleLeaf: string;
}

export type SovereignCategoryKey =
  | 'Foundational LLM Training & Architecture'
  | 'Agent Frameworks & Multi-Agent Systems'
  | 'Model Context Protocol (MCP) Ecosystem'
  | 'Planetary-Scale Distributed Systems'
  | 'Post-Quantum Cryptography & Security'
  | 'Robotics & Embodied AI'
  | 'Simulation Engines & Digital Worlds'
  | 'Data, Datasets & Planetary Ingestion'
  | 'Cloud AI Infrastructure'
  | 'Sovereign-Grade Governance, Safety & Alignment';

export interface Sovereign100Item {
  id: string;
  name: string;
  category: SovereignCategoryKey;
  repoUrl: string;
  primaryLanguage: string;
  starsFormatted: string;
  starsCount: number;
  description: string;
  pqcCompliance: boolean;
  dependentSwarmAgents: string[];
  mcpToolsExposed: string[];
  cleanroomStatus: 'VERIFIED_CLEANROOM' | 'STANDARD_OPEN_SOURCE' | 'PROPRIETARY_ATTESTED';
  merkleLeaf: string;
}

export interface DurableCensusState {
  version: number;
  lastPersistedTimestamp: number;
  totalAgents: number;
  agentsBornToday: number;
  agentsShutdownToday: number;
  netGrowthToday: number;
  agentsCreatedYear: number;
  lastSpineHeight: number;
  lastMerkleRoot: string;
  bftQuorumPercent: number;
  defconLevel: number;
}

// ==========================================
// 1. INGESTION BACKBONE TYPES
// ==========================================
export type IngestionWorkerId =
  | 'ingestion-usgs'
  | 'ingestion-repos'
  | 'ingestion-agents'
  | 'ingestion-arxiv';

export interface IngestionWorkerStatus {
  workerId: IngestionWorkerId;
  name: string;
  targetEndpoint: string;
  status: 'ACTIVE_STREAMING' | 'IDLE_POLLING' | 'BACKPRESSURE_THROTTLED' | 'SYNCED';
  intervalSeconds: number;
  recordsHarvested: number;
  lastSyncTimestamp: string;
  lastSyncLatencyMs: number;
  dlqCount: number;
  currentMerkleAnchor: string;
}

export interface IngestionDLQItem {
  id: string;
  workerId: IngestionWorkerId;
  sourceUrl: string;
  failureReason: string;
  retryCount: number;
  timestamp: string;
  payloadSnippet: string;
}

// ==========================================
// 2. PLANETARY AGENT REGISTRY BACKEND TYPES
// ==========================================
export type AgentCanonicalUrn = `urn:agent:${string}:${string}:${string}`;

export interface AgentPromotionEvaluation {
  agentUrn: string;
  name: string;
  currentTier: CapabilityTierKey;
  eligibleForTier: CapabilityTierKey | null;
  metrics: {
    autonomyScore: number;
    reasoningScore: number;
    tasksCompleted: number;
    formalVerificationPassRate: number;
    crossDomainVersatility: number;
  };
  recommendation: 'PROMOTE' | 'MAINTAIN' | 'RESTRICT';
  justification: string;
  proofLeaf: string;
}

export interface AgentAttestationCertificate {
  agentUrn: string;
  labName: string;
  pqcKeyFingerprint: string;
  enclaveHardware: 'NVIDIA H100 Confidential Computing' | 'Google TPU v5e Enclave' | 'AWS Nitro Enclave' | 'Apple Silicon Secure Enclave';
  cleanroomAuditor: string;
  genesisWeightsMerkleRoot: string;
  issuanceTimestamp: string;
  expirationTimestamp: string;
  rfcCompliance: string[];
}

// ==========================================
// 3. REPO INDEXER BACKEND TYPES
// ==========================================
export interface RepoCVERecord {
  cveId: string;
  repoId: string;
  repoName: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  cvssScore: number;
  affectedVersions: string;
  remediation: string;
  status: 'PATCHED' | 'MITIGATED' | 'OPEN_AUDIT';
}

export interface RepoLicenseAudit {
  repoId: string;
  repoName: string;
  spdxLicense: string;
  isCommercialSafe: boolean;
  hasCopyleftConflict: boolean;
  patentRetaliationClause: boolean;
  auditRating: 'A_CLEANROOM' | 'B_PERMISSIVE' | 'C_RESTRICTIVE';
}

// ==========================================
// 4. GOVERNANCE ENFORCEMENT LAYER TYPES
// ==========================================
export type GovernanceRole =
  | 'LAB_REGISTRAR'
  | 'CENSUS_OPERATOR'
  | 'THREAT_DISPATCHER'
  | 'PUBLIC_CLIENT';

export interface GovernancePolicyEvaluation {
  rfc:
    | 'RFC-001'
    | 'RFC-002'
    | 'RFC-003'
    | 'RFC-004'
    | 'RFC-005'
    | 'RFC-006'
    | 'RFC-007'
    | 'RFC-008'
    | 'RFC-009'
    | 'RFC-010';
  policyTitle: string;
  status: 'SAT_VERIFIED' | 'VIOLATION_BLOCKED';
  evaluatedResource: string;
  ruleConstraint: string;
  z3SatProof: string;
  executionLatencyUs: number;
  timestamp: string;
}

// ==========================================
// 5. THREAT RADAR BACKEND & TELEMETRY TYPES
// ==========================================
export interface GpuTelemetryLog {
  gpuId: string;
  clusterNode: string;
  deviceModel: string;
  utilizationPercent: number;
  vramUsedMb: number;
  vramTotalMb: number;
  temperatureC: number;
  kernelFaultsCount: number;
  driverVersion: string;
  timestamp: string;
}

export interface CudaOobTrap {
  trapId: string;
  node: string;
  kernelName: string;
  illegalOffsetHex: string;
  memoryBufferType: 'KV_CACHE' | 'TENSOR_WEIGHTS' | 'ACTIVATION_SLICE';
  gridCoordinates: string;
  interceptAction: 'MEMORY_CLAMPED' | 'KERNEL_ABORTED';
  timestamp: string;
}

export interface ModelWeightIntegrityRecord {
  modelId: string;
  runtimeWeightDigest: string;
  genesisWeightDigest: string;
  isIntegrityVerified: boolean;
  bitFlipCount: number;
  driftPpm: number; // Parts per million
  lastChecked: string;
}

export interface GossipFloodingMetric {
  peerId: string;
  protocol: 'GOSSIP_SUB_V1.2' | 'ZERO_MQ_MESH';
  packetsPerSec: number;
  thresholdMaxPps: number;
  droppedPacketsPerSec: number;
  bftLatencyMs: number;
  status: 'NOMINAL' | 'ELEVATED' | 'FLOOD_INTERCEPTED';
}

export interface PqcEnvelopeVerification {
  envelopeId: string;
  cipherSuite: 'ML-KEM-1024' | 'ML-DSA-87' | 'SLH-DSA-256';
  decapsulationTimeNs: number;
  timingJitterPs: number;
  constantTimeVerified: boolean;
  status: 'VALID_CONSTANT_TIME' | 'TIMING_PROBE_BLOCKED';
}

export type ThreatVectorCategory =
  | 'LATTICE_DECAPSULATION'
  | 'CUDA_OOB'
  | 'MODEL_POISONING'
  | 'GOSSIP_FLOODING';

export type MitigationActionType =
  | 'KEY_ROTATION'
  | 'QUARANTINE'
  | 'PEER_DROP'
  | 'MEMORY_SLICE_BOUNDING';

export interface ThreatTelemetryRecord {
  id: string;
  vector: ThreatVectorCategory;
  severity: 'CRITICAL' | 'HIGH' | 'ELEVATED';
  node: string;
  targetStack: string;
  summary: string;
  rawSignal: string;
  recommendedMitigation: MitigationActionType;
  autoMitigated: boolean;
  merkleLeaf: string;
  timestamp: string;
}

export interface MitigationExecutionRecord {
  id: string;
  threatId: string;
  action: MitigationActionType;
  targetNode: string;
  resultStatus: 'MITIGATED_CONFIRMED' | 'FAILED';
  details: string;
  merkleProof: string;
  timestamp: string;
}

