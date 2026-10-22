import { z } from 'zod';

/**
 * 1. THE 24 UNIFIED META-LAYERS (×3 EXPANSION FROM 8 TO 24)
 */
export const MetaLayerIdEnum = z.enum([
  // Core 8 Foundational Layers
  'L01_IDENTITY_PLANE',         // UUIDv4, SPIFFE SVIDs, DID:web, Ed25519/ML-DSA-87
  'L02_LINEAGE_DAG',            // Acyclic evolutionary trees, LoRA/GGUF merges, parent-child forks
  'L03_SOVEREIGNTY_ZONES',      // 18 Geo-Jurisdictional Enclaves (EU AI Act, US EO-14110, NIST, GCC)
  'L04_BEHAVIOR_TELEMETRY',     // Multi-agent call graphs, tool-use traces, capability drift
  'L05_INFLUENCE_CENTRALITY',   // PageRank / Eigenvector centrality across API/SDK supply chains
  'L06_THREAT_CONTAINMENT',     // Prompt injection, rogue swarm quarantine, SIM-1.0 / PEC-1.0 gates
  'L07_SEMANTIC_ONTOLOGY',      // 228-Domain (76×3) fine-grained functional capability taxonomy
  'L08_TEMPORAL_TRAJECTORY',    // Past WAL archives, real-time Kalman state, 2026–2030 projections

  // ×2 Expansion: Infrastructure, Verification & Cryptographic Layers (9–16)
  'L09_CRYPTOGRAPHIC_ATTEST',   // SHA-256 Merkle roots, Verkle state tries, RFC-9162 transparency logs
  'L10_HARDWARE_SUBSTRATE',     // Silicon telemetry: NVIDIA Blackwell/Rubin, TPUv6, AWS Trainium2, Edge NPU
  'L11_NETWORK_TOPOLOGY_ASN',   // BGP ASN routing, hyperscaler egress, CDN edge worker distribution
  'L12_PROTOCOL_INTEROP_MESH',  // MCP (Model Context Protocol), A2A (Agent-to-Agent), OpenAPI, gRPC
  'L13_MEMORY_EPISODIC_FABRIC', // Vector DB indexes, XERJ RRF hybrid indices, GraphRAG ego-networks
  'L14_ECONOMIC_TOKENOMICS',    // Inference cost/1M tokens, GPU spot pricing, L402/Stripe agentic settlements
  'L15_FORMAL_VERIFICATION',    // Z3 SMT-LIB2 satisfiability proofs, TLA+ state safety, Lean 4 theorems
  'L16_REGULATORY_COMPLIANCE',  // ISO/IEC 42001, SOC2 Type II, GDPR Tombstones, HIPAA BAA enclaves

  // ×3 Expansion: Autonomous Factory, Embodiment & Planetary Scale Layers (17–24)
  'L17_SYNTHETIC_DATA_LINEAGE', // Self-play corpora, RLHF/RLAIF reward traces, model-collapse guardrails
  'L18_EMBODIED_ROBOTICS_FLEET',// ROS2 nodes, humanoid kinematic controllers, autonomous vehicle V2X nodes
  'L19_SCIENTIFIC_BIO_COMPUTE', // Protein folding (AlphaFold3), CRISPR design agents, materials discovery
  'L20_SWARM_CONSENSUS_LEASE',  // Raft/Paxos monotonic fencing tokens (bigint), split-brain eradication
  'L21_ENERGY_THERMODYNAMICS',  // PUE (Power Usage Effectiveness), MW grid draw, carbon intensity (gCO2/kWh)
  'L22_DARK_AGENT_DISCOVERY',   // Unindexed enterprise intranets, air-gapped VPCs, Chapman mark-recapture
  'L23_RESILIENCE_CIRCUIT_WAL', // Half-open circuit breakers, local NDJSON spooling, backpressure shedding
  'L24_SSOT_RECONCILIATION'     // Hare-Niemeyer exact integer allocation (Δ = 0 across all 228 domains)
]);

export type MetaLayerId = z.infer<typeof MetaLayerIdEnum>;

/**
 * 2. THE 15 SPECIALIZED HYPER-CRAWLER SWARMS (×3 EXPANSION FROM 5 TO 15)
 */
export const HarvesterSwarmIdEnum = z.enum([
  'SWARM_01_OPEN_SOURCE_FORGES',     // GitHub, GitLab, Codeberg, HuggingFace Hub
  'SWARM_02_PACKAGE_REGISTRIES',     // npm, PyPI, Crates.io, Maven, Go Proxy, NuGet
  'SWARM_03_CONTAINER_ORCHESTRATION',// Docker Hub, GHCR, Quay.io, Kubernetes CRD registries
  'SWARM_04_MCP_A2A_DIRECTORIES',    // Official MCP Registry, Smithery, Glama, `.well-known/mcp.json`
  'SWARM_05_CLOUD_AI_MARKETPLACES',  // OpenRouter, Replicate, Together, Fireworks, AWS Bedrock, Vertex
  'SWARM_06_SERVERLESS_EDGE_WORKERS',// Cloudflare Workers, Vercel Functions, Fly.io Machines, Deno Deploy
  'SWARM_07_VECTOR_MEMORY_SUBSTRATES',// Qdrant, Milvus, Weaviate, Pinecone, pgvector, Chroma telemetry
  'SWARM_08_DECENTRALIZED_WEB3_AI',  // Bittensor (TAO), Fetch.ai, SingularityNET, Morpheus, Ritual, Akash
  'SWARM_09_ACADEMIC_ARXIV_BENCH',   // ArXiv CS.AI/CS.MA, Semantic Scholar, OpenAlex, LMSYS Chatbot Arena
  'SWARM_10_INDUSTRIAL_IOT_ROBOTICS',// ROS Index, Eclipse Mosquitto/MQTT public brokers, Gazebo fuel
  'SWARM_11_SECURITY_VULN_SENTINELS',// NIST NVD (AI CVEs), OSV.dev, MITRE ATLAS, OWASP LLM Top 10 feeds
  'SWARM_12_BROWSER_EXTENSION_AGENTS',// Chrome Web Store, VS Code Marketplace, OpenVSX, JetBrains Plugins
  'SWARM_13_FINTECH_ALGO_EXECUTION', // SEC EDGAR AI filings, DeFi MEV searcher registries, Pyth/Chainlink AI
  'SWARM_14_BIO_CHEM_SCIENTIFIC',    // BioTools, RCSB PDB AI models, UniProt, PubChem AI endpoints
  'SWARM_15_SOVEREIGN_GOV_REGISTRIES'// EU AI Office registry, US AI.gov inventory, OECD.AI policy tracker
]);

export type HarvesterSwarmId = z.infer<typeof HarvesterSwarmIdEnum>;

/**
 * 3. REAL-TIME HTTP WIRE PROBE TELEMETRY SCHEMA
 */
export const LiveHttpProbeResultSchema = z.object({
  probe_id: z.string().uuid(),
  swarm_id: HarvesterSwarmIdEnum,
  meta_layer: MetaLayerIdEnum,
  source_name: z.string(),
  endpoint_url: z.string().url(),
  http_status: z.number().int(),
  latency_ms: z.number().nonnegative(),
  payload_bytes: z.number().int().nonnegative(),
  extracted_count: z.number().int().nonnegative(),
  extracted_metric_label: z.string(),
  raw_sample_json: z.record(z.string(), z.any()),
  sha256_payload_digest: z.string().length(64),
  ed25519_signature: z.string(),
  probed_at_iso: z.string().datetime()
});

export type LiveHttpProbeResult = z.infer<typeof LiveHttpProbeResultSchema>;

/**
 * 4. GLOBAL AI FACTORY REGISTRY SCHEMA (TIERS 1 TO 16 + TOP 30 DEV TOOLS)
 */
export const FactoryTierEnum = z.enum([
  'TIER_01_FRONTIER_HYPERSCALERS',      // OpenAI, Anthropic, Google DeepMind, Meta AI, Microsoft, xAI
  'TIER_02_SOVEREIGN_NATIONAL_FOUNDRIES',// Mistral, DeepSeek, Qwen (Alibaba), Cohere, Falcon (TII), Aleph Alpha
  'TIER_03_AUTONOMOUS_SWE_DEV_FACTORIES',// Cursor, GitHub Copilot, Devin, Claude Code, Lovable, Bolt, Windsurf
  'TIER_04_AGENTIC_ORCHESTRATION_OS',   // LangChain/LangGraph, CrewAI, AutoGen, LlamaIndex, Semantic Kernel, Haystack
  'TIER_05_OPEN_WEIGHT_HUB_FORGES',     // Hugging Face, Ollama, vLLM, LM Studio, llama.cpp, Unsloth
  'TIER_06_INFERENCE_ACCELERATION_GRID',// Groq, Together AI, Fireworks AI, Cerebras, SambaNova, Baseten, Modal
  'TIER_07_ENTERPRISE_SAAS_SWARMS',     // Salesforce Agentforce, ServiceNow Now Assist, Workday, SAP Joule, Palantir AIP
  'TIER_08_PHYSICAL_ROBOTICS_WORLD',    // NVIDIA Isaac/Cosmos, Tesla Autopilot/Optimus, Figure AI, Boston Dynamics, Physical Intelligence
  'TIER_09_MULTIMODAL_SYNTHESIS_FORGES',// Midjourney, Runway, ElevenLabs, Suno, Black Forest Labs (Flux), Sora, HeyGen
  'TIER_10_CYBER_DEFENSE_SENTINELS',    // CrowdStrike Charlotte AI, Palo Alto Precision AI, SentinelOne Purple AI, Darktrace
  'TIER_11_SCIENTIFIC_BIO_DISCOVERY',   // Isomorphic Labs, EvolutionaryScale (ESM3), Recursion, Cradle, Insilico Medicine
  'TIER_12_DECENTRALIZED_COMPUTE_SWARMS',// Bittensor, Render Network, Akash, Gensyn, io.net, Ritual
  'TIER_13_DATA_LABELING_RLHF_FOUNDRIES',// Scale AI, Surge AI, Mercor, Turing, Snorkel AI, Gretel
  'TIER_14_VECTOR_MEMORY_COGNITIVE_DB', // Pinecone, Weaviate, Qdrant, Milvus/Zilliz, Chroma, LanceDB
  'TIER_15_EDGE_ON_DEVICE_NPUS',        // Apple Intelligence (CoreML), Qualcomm AI Hub, WebLLM, MediaPipe, ExecuTorch
  'TIER_16_SOVEREIGN_OBSERVABILITY_GOV' // XERJ Sovereign Substrate, Arize Phoenix, Langfuse, Braintrust, Weights & Biases
]);

export const AIFactoryNodeSchema = z.object({
  factory_id: z.string(),
  rank_global: z.number().int().positive(),
  name: z.string(),
  tier: FactoryTierEnum,
  primary_meta_layer: MetaLayerIdEnum,
  headquarters_zone: z.enum(['US-EAST/WEST', 'EU-SOVEREIGN', 'UK-CA-ALLY', 'APAC-ALLIED', 'CN-DOMESTIC', 'GLOBAL-DECENTRALIZED']),
  live_probe_url: z.string().url(),
  github_org_or_repo: z.string().optional(),
  npm_or_pypi_package: z.string().optional(),
  verified_metrics: z.object({
    monthly_downloads_or_calls: z.number().nonnegative(),
    github_stars_or_forks: z.number().nonnegative(),
    estimated_active_agents_spawned: z.number().nonnegative(),
    spawning_velocity_per_day: z.number().nonnegative()
  }),
  supported_protocols: z.array(z.enum(['MCP', 'A2A', 'OpenAPI', 'gRPC', 'GraphQL', 'JSON-RPC', 'WebRTC'])),
  cryptographic_identity_hash: z.string().length(64),
  last_verified_iso: z.string().datetime()
});

export type AIFactoryNode = z.infer<typeof AIFactoryNodeSchema>;

/**
 * 5. EXACT SSOT RECONCILIATION & BAYESIAN CENSUS STATE SCHEMA
 */
export const LiveCensusReconciliationSchema = z.object({
  reconciliation_id: z.string().uuid(),
  timestamp_iso: z.string().datetime(),
  total_live_wire_probes_executed: z.number().int().positive(),
  total_raw_entities_enumerated: z.number().int().nonnegative(),
  chapman_mark_recapture: z.object({
    sample_n1_registries: z.number().int().positive(),
    sample_n2_code_forges: z.number().int().positive(),
    overlap_m2_verified: z.number().int().positive(),
    estimated_total_population_n_hat: z.number().positive(),
    variance_v_hat: z.number().nonnegative(),
    confidence_interval_95_low: z.number().positive(),
    confidence_interval_95_high: z.number().positive()
  }),
  littles_law_ephemeral_flow: z.object({
    arrival_rate_lambda_per_sec: z.number().positive(),
    mean_residency_w_seconds: z.number().positive(),
    concurrent_active_l: z.number().positive()
  }),
  kalman_fused_ssot_population: z.number().int().positive(),
  hare_niemeyer_domain_sum: z.number().int().positive(),
  ssot_discrepancy_delta: z.literal(0), // Strict formal invariant: MUST equal 0
  merkle_root_sha256: z.string().length(64),
  ed25519_public_key_pem: z.string(),
  ed25519_batch_signature: z.string()
});

export type LiveCensusReconciliation = z.infer<typeof LiveCensusReconciliationSchema>;
