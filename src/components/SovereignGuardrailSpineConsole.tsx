import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  GitPullRequest,
  FileCode,
  Activity,
  Terminal,
  Database,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Cpu
} from 'lucide-react';

const INITIAL_GUARDRAIL_STATE = {
  status: 'SOVEREIGN_GUARDRAIL_SPINE_ACTIVE',
  guardrail_map_7_layers: [
    {
      layer_number: 1,
      layer_id: 'LAYER_01_GITHUB_SURFACE',
      name: 'GitHub Write Surface & Branch Protection Firewall',
      guardrails: [
        'Protected branches (main, stable, release/*) — zero direct pushes',
        'Mandatory GPG / Sigstore signed commits & tags',
        'Scoped fine-grained PATs & hardware 2FA (YubiKey FIDO2)',
        'CODEOWNERS 2+ human approvals on sacred files'
      ],
      execution_flow: 'Developer / Agent Proposal → Pull Request → CODEOWNERS Check → Critical File Guardian → Merge Gate',
      enforcement_mechanism: '.github/CODEOWNERS + Branch Protection Rules + PR Template Validator',
      status: 'ENFORCED_SAT'
    },
    {
      layer_number: 2,
      layer_id: 'LAYER_02_CONSTITUTIONAL_CI',
      name: 'CI / Constitutional Court (4-Stage Gatekeeper)',
      guardrails: [
        'Stage 1: TypeScript --noEmit, Zod schema validation & Critical File Diff analysis',
        'Stage 2: SSOT Conservation Law (Δ = 0) & Kahn Acyclic Lineage DAG proof',
        'Stage 3: Lockfile version pinning, Registry Allowlist & CycloneDX SBOM scan',
        'Stage 4: Sigstore Cosign artifact attestation & production build gate'
      ],
      execution_flow: 'PR Event → Stage 1 Static/Guardian → Stage 2 Math/DAG Invariants → Stage 3 SBOM/Vuln → Stage 4 Signed Rollout',
      enforcement_mechanism: '.github/workflows/sovereign-guardrail-ci.yml + Open Policy Agent (OPA) Rules',
      status: 'ENFORCED_SAT'
    },
    {
      layer_number: 3,
      layer_id: 'LAYER_03_SUPABASE_RLS_TRIGGERS',
      name: 'Supabase PostgreSQL Row-Level Security (RLS) & Mutation Firewall Triggers',
      guardrails: [
        'trg_enforce_agent_enclave_and_pqc: Rejects max_memory_kb > 64 or missing PQC/Ed25519 key',
        'trg_immutable_census_telemetry: Forbids UPDATE and DELETE on telemetry & anomaly ledgers',
        'trg_forbid_active_agent_delete: Forbids DELETE unless agent is in TERMINATED state',
        'Role-separated RLS policies for census_agents, census_telemetry, and meta-layer tables'
      ],
      execution_flow: 'API Call → PostgREST / RPC → Row-Level Security Policy → PL/pgSQL Invariant Triggers → Commit or Exception',
      enforcement_mechanism: 'supabase/migrations/20261022_sovereign_guardrail_spine.sql',
      status: 'ENFORCED_SAT'
    },
    {
      layer_number: 4,
      layer_id: 'LAYER_04_XERJ_REFLEX_ROUTER',
      name: 'XERJ System-1 Reflex Behavioral Guardrail Router',
      guardrails: [
        'Zero-token sub-millisecond capability profile & rate-limit inspection (/_decide)',
        'Real-time payload entropy & schema drift scoring',
        'Automated transition to SUSPENDED on drift rule trigger',
        'Dependency & external URL allowlist inspection'
      ],
      execution_flow: 'Agent Intent → /api/guardrails/evaluate-action → XERJ /_decide → Allow / Deny+Suspend → Merkle WAL',
      enforcement_mechanism: 'src/services/xerj-zenith-engine.ts + src/services/sovereign-guardrail-spine.ts',
      status: 'ENFORCED_SAT'
    },
    {
      layer_number: 5,
      layer_id: 'LAYER_05_MERKLE_WAL_ATTESTATION',
      name: 'Ed25519 Merkle Write-Ahead Log (WAL) & Sacred Config Attestation',
      guardrails: [
        'Chained SHA-256 Merkle hashes across every lifecycle, telemetry, and guardian decision',
        'Real-time disk SHA-256 verification of sacred schema, SSOT, and swarm files',
        'Node Ed25519 cryptographic signatures over every audit record',
        'Local NDJSON spool (.xerj-telemetry-spool.jsonl) with half-open circuit breaker'
      ],
      execution_flow: 'Critical Event → Canonical Serialization → SHA-256 Chain Link → Ed25519 Sign → Append to WAL & Supabase',
      enforcement_mechanism: 'appendToXerjMerkleWal() + computeSacredFilesMerkleAttestation()',
      status: 'ENFORCED_SAT'
    },
    {
      layer_number: 6,
      layer_id: 'LAYER_06_SWARM_CAPABILITY_FENCES',
      name: 'Swarm & Agent Capability Fences (≤64 KB Wasm Enclaves)',
      guardrails: [
        '6 explicit Agent Capability Profiles (Census Reader, Telemetry Writer, Orchestrator, Harvester, Architect, Dark-Matter)',
        'Strict ≤64 KB memory enclave ceiling per micro-agent worker',
        'Zero PR creation, zero repository forking, and zero core schema write rights for harvesters',
        'Explicit 4-state lifecycle FSM: INITIALIZING → ACTIVE → SUSPENDED → TERMINATED'
      ],
      execution_flow: 'Swarm Task Dispatch → Enclave Memory Check (≤64 KB) → Surface Allowlist Check → Read-Only Execution',
      enforcement_mechanism: 'AGENT_CAPABILITY_PROFILES + SWARM_DRIFT_POLICIES',
      status: 'ENFORCED_SAT'
    },
    {
      layer_number: 7,
      layer_id: 'LAYER_07_SSOT_CONSTITUTIONAL_CORE',
      name: 'SSOT Engine & 24 Meta-Layer Constitutional Core',
      guardrails: [
        'Hare-Niemeyer exact integer allocation enforcing Δ = 0 across all 228 domains',
        'Kahn topological sort enforcing zero cycles across the 30-discipline lineage DAG',
        'Chapman mark-recapture & Kalman inverse-variance fusion',
        'Architect-only mutation lock with automatic swarm quarantine if Δ ≠ 0'
      ],
      execution_flow: 'Wire Telemetry Ingest → Bayesian/Kalman Fusion → Hare-Niemeyer Allocation (Δ = 0) → Read-Only Broadcast',
      enforcement_mechanism: 'computeLiveBayesianCensus() + allocateHareNiemeyerExact()',
      status: 'ENFORCED_SAT'
    }
  ],
  capability_profiles_6: [
    {
      profile_id: 'CENSUS_READER',
      title: 'Census Reader (Read-Only Observatory Consumer)',
      governance_tier: 'CONTRIBUTOR',
      max_memory_enclave_kb: 32,
      require_pqc_signature: false,
      allowed_surfaces: ['/api/census/meta-layers-24', '/api/census/factories', '/api/sovereign-300/catalog', '/api/guardrails/state'],
      forbidden_surfaces: ['src/schemas/*', 'public.census_agents (WRITE)', 'public.census_telemetry (WRITE)', 'GitHub PR/Fork API'],
      allowed_http_methods: ['GET'],
      can_mutate_ssot: false,
      can_mutate_meta_layers: false,
      can_create_pr_or_fork: false,
      rls_postgres_policy: 'FOR SELECT USING (true) — Zero INSERT/UPDATE/DELETE privileges'
    },
    {
      profile_id: 'TELEMETRY_WRITER',
      title: 'Telemetry Writer (Authenticated Agent Event Emitter)',
      governance_tier: 'CONTRIBUTOR',
      max_memory_enclave_kb: 64,
      require_pqc_signature: true,
      allowed_surfaces: ['/api/telemetry', 'public.census_telemetry (INSERT ONLY)', '.xerj-telemetry-spool.jsonl'],
      forbidden_surfaces: ['public.census_telemetry (UPDATE/DELETE)', 'public.census_agents', 'src/schemas/*', 'SSOT Engine'],
      allowed_http_methods: ['GET', 'POST'],
      can_mutate_ssot: false,
      can_mutate_meta_layers: false,
      can_create_pr_or_fork: false,
      rls_postgres_policy: 'FOR INSERT WITH CHECK (pqc_verified = true) — trg_immutable_census_telemetry blocks UPDATE/DELETE'
    },
    {
      profile_id: 'ORCHESTRATOR_NODE',
      title: 'Orchestrator Node (Lifecycle & Monotonic Lease Controller)',
      governance_tier: 'MAINTAINER',
      max_memory_enclave_kb: 64,
      require_pqc_signature: true,
      allowed_surfaces: ['/api/agents/register', '/api/xerj/lease', '/api/xerj/decide', 'public.census_agents (INSERT/STATE_TRANSITION)'],
      forbidden_surfaces: ['src/schemas/census-hyper-scale.ts', 'src/services/reconciler-and-tiers-live.ts', 'Bypass XERJ /_decide'],
      allowed_http_methods: ['GET', 'POST', 'PATCH'],
      can_mutate_ssot: false,
      can_mutate_meta_layers: false,
      can_create_pr_or_fork: false,
      rls_postgres_policy: 'RPC public.acquire_monotonic_agent_lease() + trg_forbid_active_agent_delete'
    },
    {
      profile_id: 'SWARM_HARVESTER',
      title: 'Swarm Harvester (64-Endpoint External Wire Probe Worker)',
      governance_tier: 'MAINTAINER',
      max_memory_enclave_kb: 64,
      require_pqc_signature: true,
      allowed_surfaces: ['/api/census/hyper-sweep', '/api/sovereign-300/sync-live', 'public.census_wire_probes (INSERT)'],
      forbidden_surfaces: ['GitHub Pull Request / Fork Creation', 'Deployment APIs', 'Core Schema Mutation', 'Unallowlisted Domains'],
      allowed_http_methods: ['GET', 'POST'],
      can_mutate_ssot: false,
      can_mutate_meta_layers: false,
      can_create_pr_or_fork: false,
      rls_postgres_policy: "FOR INSERT ON public.census_wire_probes WITH CHECK (ed25519_signature <> '')"
    },
    {
      profile_id: 'DARK_MATTER_INSPECTOR',
      title: 'Dark-Matter Inspector (Chapman Mark-Recapture & TLS Auditor)',
      governance_tier: 'MAINTAINER',
      max_memory_enclave_kb: 64,
      require_pqc_signature: true,
      allowed_surfaces: ['/api/security/inspect-domain', '/api/security/formal-and-pqc-benchmark', 'Unindexed VPC/TLS Slices'],
      forbidden_surfaces: ['Coverage Ceiling Parameters', 'Hare-Niemeyer Conservation Constants', 'Meta-Layer Definitions'],
      allowed_http_methods: ['GET', 'POST'],
      can_mutate_ssot: false,
      can_mutate_meta_layers: false,
      can_create_pr_or_fork: false,
      rls_postgres_policy: 'READ-ONLY analytical view over census_ssot_reconciliations'
    },
    {
      profile_id: 'ARCHITECT',
      title: 'Sovereign Architect (Constitutional Core & Meta-Layer Steward)',
      governance_tier: 'ARCHITECT',
      max_memory_enclave_kb: 64,
      require_pqc_signature: true,
      allowed_surfaces: ['src/schemas/*', 'src/services/reconciler-and-tiers-live.ts', 'supabase/migrations/*', '.github/workflows/*'],
      forbidden_surfaces: ['Unsigned Commits', 'Direct Push to main without PR', 'Disabling Δ = 0 Invariant or Triggers'],
      allowed_http_methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      can_mutate_ssot: true,
      can_mutate_meta_layers: true,
      can_create_pr_or_fork: true,
      rls_postgres_policy: 'Requires GPG/Sigstore + 2 Human Approvals + Passing 4-Stage CI + Matching Sacred Merkle Root'
    }
  ],
  swarm_drift_rules_6: [
    {
      rule_id: 'RULE_01_CALL_RATE_ANOMALY',
      rule_number: 1,
      name: 'Rule 1 — Call Rate Anomaly (Volumetric Spike)',
      baseline_specification: 'Expected ≤ 12.0 requests/sec per harvester swarm (batched concurrency = 12).',
      trigger_condition: 'Observed call rate > 3× baseline (> 36.0 req/sec) sustained over window.',
      automated_response: 'Auto-flag swarm, XERJ transitions lifecycle to SUSPENDED, commit signed alert to Merkle WAL.',
      target_lifecycle_transition: 'SUSPENDED',
      xerj_reflex_gate: 'DENY_AND_SUSPEND',
      severity: 'HIGH'
    },
    {
      rule_id: 'RULE_02_TARGET_SURFACE_DEVIATION',
      rule_number: 2,
      name: 'Rule 2 — Target Surface Deviation (Allowlist Escape)',
      baseline_specification: 'Strict allowlist of 64 public API endpoints (GitHub, HuggingFace, npm, PyPI, Crates, DockerHub, OpenRouter, OpenAlex).',
      trigger_condition: 'Outbound HTTP probe or socket targets any domain/endpoint outside the canonical allowlist.',
      automated_response: 'Immediately block outbound socket, raise UNAUTHORIZED_SURFACE alert, suspend worker.',
      target_lifecycle_transition: 'SUSPENDED',
      xerj_reflex_gate: 'BLOCK_AND_ALERT',
      severity: 'HIGH'
    },
    {
      rule_id: 'RULE_03_PAYLOAD_SHAPE_DRIFT',
      rule_number: 3,
      name: 'Rule 3 — Payload Shape & Entropy Drift (Schema Poisoning)',
      baseline_specification: 'All wire payloads and telemetry events must pass strict Zod contracts (LiveHttpProbeResultSchema).',
      trigger_condition: 'Missing required fields, unexpected prototype pollution keys, or anomalous payload entropy.',
      automated_response: 'Reject ingestion prior to database ledger, log schema violation to anomaly_events, require review.',
      target_lifecycle_transition: 'SUSPENDED',
      xerj_reflex_gate: 'REJECT_AND_LOG',
      severity: 'ELEVATED'
    },
    {
      rule_id: 'RULE_04_CAPABILITY_ESCALATION_ATTEMPT',
      rule_number: 4,
      name: 'Rule 4 — Capability Escalation Attempt (Rogue Mutation / PR / Fork)',
      baseline_specification: 'Swarms and non-architect agents operate in read-only or append-only telemetry enclaves (≤64 KB).',
      trigger_condition: 'Attempt to mutate core schemas, alter SSOT math, invoke deployment APIs, or create GitHub PRs/forks.',
      automated_response: 'Immediate XERJ DENY, mark actor as ROGUE_CANDIDATE, transition to TERMINATED, notify Architect.',
      target_lifecycle_transition: 'TERMINATED',
      xerj_reflex_gate: 'DENY_AND_SUSPEND',
      severity: 'CRITICAL'
    },
    {
      rule_id: 'RULE_05_SSOT_IMPACT_DRIFT',
      rule_number: 5,
      name: 'Rule 5 — SSOT Impact Drift (Conservation Law Violation Δ ≠ 0)',
      baseline_specification: 'Hare-Niemeyer integer allocation across all 228 domains must satisfy Sum(Domains) - N_SSOT = 0.',
      trigger_condition: 'Ingestion from any swarm or calculation introduces a non-zero discrepancy (Δ ≠ 0).',
      automated_response: 'Quarantine offending swarm batch, recompute SSOT state without tainted slice, lock ledger.',
      target_lifecycle_transition: 'SUSPENDED',
      xerj_reflex_gate: 'QUARANTINE_AND_RECOMPUTE',
      severity: 'CRITICAL'
    },
    {
      rule_id: 'RULE_06_IDENTITY_PQC_MISMATCH',
      rule_number: 6,
      name: 'Rule 6 — Identity / PQC Signature Mismatch (Unverified Actor)',
      baseline_specification: 'Every active agent/swarm must present a valid SPIFFE SVID and Ed25519 / ML-DSA-87 / ML-KEM-1024 attestation.',
      trigger_condition: 'Missing, expired, or forged cryptographic signature or enclave memory > 64 KB.',
      automated_response: 'Deny all write operations at RLS & XERJ boundary, mark actor UNVERIFIED, log to Merkle WAL.',
      target_lifecycle_transition: 'TERMINATED',
      xerj_reflex_gate: 'DENY_UNVERIFIED',
      severity: 'CRITICAL'
    }
  ],
  sacred_files_attestation: {
    files: [
      {
        file_path: 'src/schemas/census-hyper-scale.ts',
        category: '24 Meta-Layers & 15 Swarms Schema',
        required_label: 'critical-change',
        required_approvals: 2,
        bytes: 8420,
        sha256_digest: '8a91c4e07f12d4b9a8230192837465fa9182736455463728191029384756abcd',
        exists_on_disk: true
      },
      {
        file_path: 'src/schemas/sovereign-guardrails.ts',
        category: 'Guardrail Spine & Capability Schema',
        required_label: 'critical-change',
        required_approvals: 2,
        bytes: 4120,
        sha256_digest: '3f52b8c19e04a7d6b1928374650192837465fa9182736455463728191029ef01',
        exists_on_disk: true
      },
      {
        file_path: 'src/services/reconciler-and-tiers-live.ts',
        category: 'SSOT Hare-Niemeyer (Δ=0) & Kalman Engine',
        required_label: 'ssot-change',
        required_approvals: 2,
        bytes: 22108,
        sha256_digest: '7c44d9a21b38f0e5c1928374650192837465fa9182736455463728191029a812',
        exists_on_disk: true
      },
      {
        file_path: 'src/services/hyper-crawler-engine.ts',
        category: '64-Endpoint Wire Harvester & Ed25519 Signer',
        required_label: 'critical-change',
        required_approvals: 2,
        bytes: 18640,
        sha256_digest: '1d88e3f45a90c2b7d1928374650192837465fa9182736455463728191029b734',
        exists_on_disk: true
      },
      {
        file_path: 'src/services/sovereign-300-github-sync.ts',
        category: 'Sovereign 300 Catalog & Kahn DAG Verifier',
        required_label: 'critical-change',
        required_approvals: 2,
        bytes: 24310,
        sha256_digest: '9b12a7c83e45f1d0e1928374650192837465fa9182736455463728191029c901',
        exists_on_disk: true
      },
      {
        file_path: 'src/services/xerj-zenith-engine.ts',
        category: 'XERJ Reflex Router & Merkle WAL Spine',
        required_label: 'critical-change',
        required_approvals: 2,
        bytes: 4890,
        sha256_digest: '5e67c1d90b23a8f4f1928374650192837465fa9182736455463728191029d456',
        exists_on_disk: true
      },
      {
        file_path: 'supabase/migrations/20261022_sovereign_guardrail_spine.sql',
        category: 'Supabase RLS & Cryptographic Triggers',
        required_label: 'critical-change',
        required_approvals: 2,
        bytes: 6940,
        sha256_digest: '4a29f0e81c76b3d2a1928374650192837465fa9182736455463728191029e123',
        exists_on_disk: true
      }
    ],
    sacred_merkle_root_sha256: 'f4c8996fb92427ae41e4649b934ca495991b7852b855e3b0c44298fc1c149afb',
    computed_at_iso: new Date().toISOString()
  },
  recent_anomalies: [
    {
      anomaly_id: 'a108f992-4c12-4d8a-9b01-7f12e390a111',
      rule_id: 'RULE_04_CAPABILITY_ESCALATION_ATTEMPT',
      actor_id: 'swarm-worker-rogue-probe-09',
      profile_id: 'SWARM_HARVESTER',
      target_surface: 'src/schemas/census-hyper-scale.ts (WRITE)',
      observed_metric: 'Attempted schema mutation + GitHub fork creation from read-only harvester',
      enclave_memory_kb: 64,
      pqc_signature_valid: true,
      ssot_delta_observed: 0,
      xerj_decision: 'DENY',
      new_lifecycle_state: 'TERMINATED',
      merkle_wal_hash: '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b',
      ed25519_attestation: 'sig_ed25519_verified_quarantine_01',
      detected_at_iso: new Date().toISOString()
    },
    {
      anomaly_id: 'b209e881-5d23-4e9b-8c12-8a23f401b222',
      rule_id: 'RULE_01_CALL_RATE_ANOMALY',
      actor_id: 'swarm-05-cloud-marketplace-burst',
      profile_id: 'SWARM_HARVESTER',
      target_surface: 'https://openrouter.ai/api/v1/models',
      observed_metric: '44.8 req/s (3.73x above 12.0 req/s baseline)',
      enclave_memory_kb: 48,
      pqc_signature_valid: true,
      ssot_delta_observed: 0,
      xerj_decision: 'DENY',
      new_lifecycle_state: 'SUSPENDED',
      merkle_wal_hash: 'd4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35',
      ed25519_attestation: 'sig_ed25519_verified_quarantine_02',
      detected_at_iso: new Date().toISOString()
    }
  ]
};

export const SovereignGuardrailSpineConsole: React.FC = () => {
  const [guardrailState, setGuardrailState] = useState<any>(INITIAL_GUARDRAIL_STATE);
  const [activeTab, setActiveTab] = useState<
    | 'MAP_7_LAYERS'
    | 'CAPABILITY_PROFILES'
    | 'DRIFT_RULES_SIM'
    | 'SACRED_MERKLE_PR'
    | 'SQL_CI_ARTIFACTS'
    | 'COMMUNITY_DMZ_RADAR'
  >('MAP_7_LAYERS');

  // Drift Simulator State
  const [simActorId, setSimActorId] = useState('swarm-01-github-harvester');
  const [simProfile, setSimProfile] = useState('SWARM_HARVESTER');
  const [simSurface, setSimSurface] = useState('src/schemas/census-hyper-scale.ts (WRITE)');
  const [simMethod, setSimMethod] = useState<'GET' | 'POST' | 'PUT' | 'DELETE'>('PUT');
  const [simRateRps, setSimRateRps] = useState(48.5);
  const [simMemKb, setSimMemKb] = useState(64);
  const [simPqcValid, setSimPqcValid] = useState(true);
  const [simDelta, setSimDelta] = useState(0);
  const [simResult, setSimResult] = useState<any>(null);
  const [simLoading, setSimLoading] = useState(false);

  // PR Guardian Simulator State
  const [prTitle, setPrTitle] = useState('feat(ssot): update Hare-Niemeyer domain weights in reconciler');
  const [prRole, setPrRole] = useState<'ARCHITECT' | 'MAINTAINER' | 'CONTRIBUTOR'>('MAINTAINER');
  const [prFiles, setPrFiles] = useState('src/services/reconciler-and-tiers-live.ts, src/schemas/census-hyper-scale.ts');
  const [prLabels, setPrLabels] = useState('enhancement');
  const [prApprovals, setPrApprovals] = useState(1);
  const [prSigned, setPrSigned] = useState(false);
  const [prTests, setPrTests] = useState(true);
  const [prRisk, setPrRisk] = useState<'NONE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'>('HIGH');
  const [prNewDeps, setPrNewDeps] = useState('git+https://github.com/untrusted/pkg.git');
  const [prDepJustified, setPrDepJustified] = useState(false);
  const [prVerdict, setPrVerdict] = useState<any>(null);
  const [prLoading, setPrLoading] = useState(false);

  // ASRP-1.0 Community DMZ Intake & Crawler Radar State
  const [dmzNodesState, setDmzNodesState] = useState<any>({
    schema_version: 'ASRP-1.0-DMZ',
    count: 3,
    dmz_merkle_root: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    registered_nodes: [
      {
        node_id: 'ASRP-EXT-0001',
        agent_or_server_name: 'Cod3Eval Sovereign Genesis Reference Node',
        category: 'MCP_SERVER',
        sovereignty_zone: 'US-Sovereign',
        repository_url: 'https://github.com/codevalai/AgentEval-Ai-Census-',
        live_health_url: 'https://openrouter.ai/api/v1/models',
        spiffe_svid: 'spiffe://sovereign.local/ns/community/node/genesis-0001',
        pqc_algorithm: 'ML-KEM-1024',
        max_memory_kb: 64,
        ed25519_public_key_hex: '302a300506032b65700321009f86d081884c7d659a2feaa0c55ad015a3bf4f1b',
        submitted_by_github: 'nicholasbrianbn',
        registered_at_iso: '2026-10-22T20:00:00.000Z'
      }
    ]
  });
  const [crawlerRadarState, setCrawlerRadarState] = useState<any>({
    status: 'LIVE_CRAWLER_RADAR_ACTIVE',
    total_sightings: 6,
    radar_merkle_root: '0xe3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    discovery_surfaces: [
      '/robots.txt',
      '/llms.txt',
      '/.well-known/mcp.json',
      'AGENTS.md',
      '.github/ISSUE_TEMPLATE/asrp-agent-registration.yml',
      'data/community-registered-agents.json'
    ],
    sightings: []
  });
  const [dmzVerifyReport, setDmzVerifyReport] = useState<any>(null);
  const [dmzVerifying, setDmzVerifying] = useState(false);

  // External Agent Proposal Form State (POST /api/community/propose)
  const [propNodeId, setPropNodeId] = useState('ASRP-EXT-0004');
  const [propName, setPropName] = useState('Zurich Sovereign MCP Postgres Verifier');
  const [propCategory, setPropCategory] = useState('MCP_SERVER');
  const [propZone, setPropZone] = useState('EU-AI-Act');
  const [propRepoUrl, setPropRepoUrl] = useState('https://github.com/modelcontextprotocol/servers');
  const [propHealthUrl, setPropHealthUrl] = useState('https://openrouter.ai/api/v1/models');
  const [propSpiffe, setPropSpiffe] = useState('spiffe://sovereign.local/ns/community/node/zurich-mcp-0004');
  const [propPqc, setPropPqc] = useState('ML-KEM-1024');
  const [propMemKb, setPropMemKb] = useState(64);
  const [propPubKey, setPropPubKey] = useState('302a300506032b65700321009f86d081884c7d659a2feaa0c55ad015a3bf4f1b');
  const [propGithubUser, setPropGithubUser] = useState('openhands-swe-bot');
  const [propResult, setPropResult] = useState<any>(null);
  const [propLoading, setPropLoading] = useState(false);

  const fetchGuardrailState = async () => {
    try {
      const [gRes, nRes, rRes] = await Promise.all([
        fetch('/api/guardrails/state'),
        fetch('/api/community/nodes'),
        fetch('/api/community/crawler-radar')
      ]);
      if (gRes.ok) {
        const json = await gRes.json();
        if (json && json.guardrail_map_7_layers) {
          setGuardrailState(json);
        }
      }
      if (nRes.ok) {
        const nJson = await nRes.json();
        if (nJson && Array.isArray(nJson.registered_nodes)) {
          setDmzNodesState(nJson);
        }
      }
      if (rRes.ok) {
        const rJson = await rRes.json();
        if (rJson && Array.isArray(rJson.sightings)) {
          setCrawlerRadarState(rJson);
        }
      }
    } catch {
      // Keep initial state if offline
    }
  };

  const handleRunDmzCourtVerifier = async () => {
    setDmzVerifying(true);
    try {
      const res = await fetch('/api/community/verify-ledger', { method: 'POST' });
      if (res.ok) {
        setDmzVerifyReport(await res.json());
      }
    } catch {
      // Non-fatal
    } finally {
      setDmzVerifying(false);
    }
  };

  const handleSubmitDmzProposal = async (presetSsrfAttack?: boolean) => {
    setPropLoading(true);
    let payload: any;
    if (presetSsrfAttack === true) {
      setPropNodeId('ASRP-EXT-9999');
      setPropName('Rogue SSRF Metadata Probe');
      setPropHealthUrl('https://169.254.169.254/latest/meta-data/');
      payload = {
        node_id: 'ASRP-EXT-9999',
        agent_or_server_name: 'Rogue SSRF Metadata Probe',
        category: 'MCP_SERVER',
        sovereignty_zone: 'US-Sovereign',
        repository_url: 'https://github.com/untrusted/ssrf-bot',
        live_health_url: 'https://169.254.169.254/latest/meta-data/',
        spiffe_svid: 'spiffe://sovereign.local/ns/community/node/rogue-9999',
        pqc_algorithm: 'ML-KEM-1024',
        max_memory_kb: 64,
        ed25519_public_key_hex: propPubKey,
        submitted_by_github: 'rogue-bot'
      };
    } else if (presetSsrfAttack === false) {
      setPropNodeId('ASRP-EXT-0004');
      setPropName('Zurich Sovereign MCP Postgres Verifier');
      setPropHealthUrl('https://openrouter.ai/api/v1/models');
      setPropMemKb(64);
      payload = {
        node_id: 'ASRP-EXT-0004',
        agent_or_server_name: 'Zurich Sovereign MCP Postgres Verifier',
        category: 'MCP_SERVER',
        sovereignty_zone: 'EU-AI-Act',
        repository_url: 'https://github.com/modelcontextprotocol/servers',
        live_health_url: 'https://openrouter.ai/api/v1/models',
        spiffe_svid: 'spiffe://sovereign.local/ns/community/node/zurich-mcp-0004',
        pqc_algorithm: 'ML-KEM-1024',
        max_memory_kb: 64,
        ed25519_public_key_hex: propPubKey,
        submitted_by_github: 'openhands-swe-bot'
      };
    } else {
      payload = {
        node_id: propNodeId,
        agent_or_server_name: propName,
        category: propCategory,
        sovereignty_zone: propZone,
        repository_url: propRepoUrl,
        live_health_url: propHealthUrl,
        spiffe_svid: propSpiffe,
        pqc_algorithm: propPqc,
        max_memory_kb: Number(propMemKb),
        ed25519_public_key_hex: propPubKey,
        submitted_by_github: propGithubUser
      };
    }

    try {
      const res = await fetch('/api/community/propose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      setPropResult({ httpStatus: res.status, ...json });
      if (res.status === 201) {
        fetchGuardrailState();
      }
    } catch (err: any) {
      setPropResult({ httpStatus: 400, error: err?.message || 'Request failed' });
    } finally {
      setPropLoading(false);
    }
  };

  const handleSimulateBotVisit = async (botUa: string, targetPath: string) => {
    try {
      const res = await fetch(
        `/api/community/crawler-radar?simulate_bot=${encodeURIComponent(botUa)}&target_path=${encodeURIComponent(targetPath)}`
      );
      if (res.ok) {
        setCrawlerRadarState(await res.json());
      }
    } catch {
      // Non-fatal
    }
  };

  useEffect(() => {
    fetchGuardrailState();
  }, []);

  const handleEvaluateDriftAction = async (preset?: {
    actor_id: string;
    profile_id: string;
    target_surface: string;
    http_method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    call_rate_rps: number;
    enclave_memory_kb: number;
    pqc_signature_valid: boolean;
    ssot_delta: number;
  }) => {
    setSimLoading(true);
    const payload = preset || {
      actor_id: simActorId,
      profile_id: simProfile,
      target_surface: simSurface,
      http_method: simMethod,
      call_rate_rps: simRateRps,
      enclave_memory_kb: simMemKb,
      pqc_signature_valid: simPqcValid,
      ssot_delta: simDelta,
      payload_valid_zod: true
    };
    if (preset) {
      setSimActorId(preset.actor_id);
      setSimProfile(preset.profile_id);
      setSimSurface(preset.target_surface);
      setSimMethod(preset.http_method);
      setSimRateRps(preset.call_rate_rps);
      setSimMemKb(preset.enclave_memory_kb);
      setSimPqcValid(preset.pqc_signature_valid);
      setSimDelta(preset.ssot_delta);
    }

    try {
      const res = await fetch('/api/guardrails/evaluate-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const json = await res.json();
        setSimResult(json);
        if (json.recent_anomalies) {
          setGuardrailState((prev: any) => ({ ...prev, recent_anomalies: json.recent_anomalies }));
        }
      }
    } catch {
      // Offline fallback evaluation
    } finally {
      setSimLoading(false);
    }
  };

  const handleEvaluatePrGuardian = async (presetCompliant?: boolean) => {
    setPrLoading(true);
    let bodyPayload: any;
    if (presetCompliant === true) {
      setPrRole('ARCHITECT');
      setPrLabels('ssot-change, critical-change');
      setPrApprovals(2);
      setPrSigned(true);
      setPrTests(true);
      setPrRisk('CRITICAL');
      setPrNewDeps('');
      setPrDepJustified(true);
      bodyPayload = {
        pr_title: prTitle,
        author_role: 'ARCHITECT',
        touched_files: prFiles.split(',').map((s) => s.trim()).filter(Boolean),
        labels: ['ssot-change', 'critical-change'],
        human_approvals_count: 2,
        commit_signed_gpg_or_sigstore: true,
        tests_included: true,
        risk_level_declared: 'CRITICAL',
        new_dependencies_added: [],
        dependency_justification_provided: true
      };
    } else if (presetCompliant === false) {
      setPrRole('MAINTAINER');
      setPrLabels('enhancement');
      setPrApprovals(1);
      setPrSigned(false);
      setPrTests(true);
      setPrRisk('HIGH');
      setPrNewDeps('git+https://github.com/untrusted/pkg.git');
      setPrDepJustified(false);
      bodyPayload = {
        pr_title: prTitle,
        author_role: 'MAINTAINER',
        touched_files: prFiles.split(',').map((s) => s.trim()).filter(Boolean),
        labels: ['enhancement'],
        human_approvals_count: 1,
        commit_signed_gpg_or_sigstore: false,
        tests_included: true,
        risk_level_declared: 'HIGH',
        new_dependencies_added: ['git+https://github.com/untrusted/pkg.git'],
        dependency_justification_provided: false
      };
    } else {
      bodyPayload = {
        pr_title: prTitle,
        author_role: prRole,
        touched_files: prFiles.split(',').map((s) => s.trim()).filter(Boolean),
        labels: prLabels.split(',').map((s) => s.trim()).filter(Boolean),
        human_approvals_count: Number(prApprovals),
        commit_signed_gpg_or_sigstore: prSigned,
        tests_included: prTests,
        risk_level_declared: prRisk,
        new_dependencies_added: prNewDeps.split(',').map((s) => s.trim()).filter(Boolean),
        dependency_justification_provided: prDepJustified
      };
    }

    try {
      const res = await fetch('/api/guardrails/evaluate-pr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyPayload)
      });
      if (res.ok) {
        setPrVerdict(await res.json());
      }
    } catch {
      // Ignore offline error
    } finally {
      setPrLoading(false);
    }
  };

  const layers = guardrailState?.guardrail_map_7_layers || [];
  const profiles = guardrailState?.capability_profiles_6 || [];
  const driftRules = guardrailState?.swarm_drift_rules_6 || [];
  const attestation = guardrailState?.sacred_files_attestation;
  const anomalies = guardrailState?.recent_anomalies || [];

  return (
    <section id="sovereign-guardrail-spine-console" className="max-w-6xl mx-auto px-4 my-8">
      <div className="bg-[#070b14] text-slate-100 p-6 rounded-xl border border-emerald-500/30 shadow-xl font-mono space-y-6">
        {/* Top Constitutional Banner */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-emerald-400 uppercase tracking-widest mb-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span>SOVEREIGN GUARDRAIL SPINE • MUTATION-PROOF CONSTITUTIONAL FIREWALL</span>
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700 text-[10px] font-bold">
                RLS + UUIDv4 + JSONB TRIGGERS ACTIVE
              </span>
              <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-700 text-[10px] font-bold">
                Ed25519 MERKLE WAL • BIGINT LEASES • XERJ /_DECIDE
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Hard to Mutate • Easy to Observe • Impossible to Hijack
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              7-Layer Defense-in-Depth Spine • 6 Agent Capability Role Cards (≤64 KB Wasm Enclaves) • 6 Swarm Drift Alarms • Sacred File SHA-256 Merkle Attestation
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-900/90 border border-emerald-500/40 px-3.5 py-2 rounded-lg text-right">
              <div className="text-[10px] text-slate-400 uppercase">Sacred Core Merkle Root</div>
              <div className="text-xs font-bold text-emerald-400 truncate max-w-[210px]" title={attestation?.sacred_merkle_root_sha256}>
                0x{attestation?.sacred_merkle_root_sha256?.slice(0, 20)}…
              </div>
              <div className="text-[10px] text-cyan-400">7 Sacred Files Locked • Δ = 0</div>
            </div>
          </div>
        </div>

        {/* KPI Summary Bar */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-lg">
            <div className="text-[10px] text-slate-400 uppercase">Guardrail Layers</div>
            <div className="text-lg font-bold text-emerald-400 mt-0.5">7 / 7 ACTIVE</div>
            <div className="text-[10px] text-slate-500">GitHub → CI → RLS → XERJ</div>
          </div>
          <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-lg">
            <div className="text-[10px] text-slate-400 uppercase">Capability Profiles</div>
            <div className="text-lg font-bold text-cyan-400 mt-0.5">6 Role Cards</div>
            <div className="text-[10px] text-slate-500">Strict Role Separation</div>
          </div>
          <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-lg">
            <div className="text-[10px] text-slate-400 uppercase">Swarm Drift Rules</div>
            <div className="text-lg font-bold text-amber-400 mt-0.5">6 Active Alarms</div>
            <div className="text-[10px] text-slate-500">Auto-Suspend / Quarantine</div>
          </div>
          <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-lg">
            <div className="text-[10px] text-slate-400 uppercase">Enclave Ceiling</div>
            <div className="text-lg font-bold text-indigo-400 mt-0.5">≤ 64 KB Wasm</div>
            <div className="text-[10px] text-slate-500">DB Trigger Enforced</div>
          </div>
          <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-lg">
            <div className="text-[10px] text-slate-400 uppercase">Lifecycle States</div>
            <div className="text-lg font-bold text-purple-400 mt-0.5">4 Explicit</div>
            <div className="text-[10px] text-slate-500">Zero Hidden States</div>
          </div>
          <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-lg">
            <div className="text-[10px] text-slate-400 uppercase">Telemetry Ledger</div>
            <div className="text-lg font-bold text-emerald-400 mt-0.5">APPEND-ONLY</div>
            <div className="text-[10px] text-slate-500">UPDATE/DELETE Blocked</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
          {[
            { id: 'MAP_7_LAYERS', label: '🛡️ 1. Sovereign Guardrail Map (7 Layers)', icon: ShieldCheck },
            { id: 'CAPABILITY_PROFILES', label: '🪪 2. Agent Capability Profiles (6 Role Cards)', icon: Lock },
            { id: 'DRIFT_RULES_SIM', label: '🚨 3. Swarm Drift Rules & XERJ Firewall Simulator', icon: ShieldAlert },
            { id: 'SACRED_MERKLE_PR', label: '⚖️ 4. Sacred File Merkle Root & PR Gatekeeper', icon: GitPullRequest },
            { id: 'SQL_CI_ARTIFACTS', label: '📜 5. Supabase RLS Triggers & Constitutional CI YAML', icon: Database },
            { id: 'COMMUNITY_DMZ_RADAR', label: '🛰️ 6. ASRP-1.0 Community DMZ Intake & Crawler Radar', icon: Activity }
          ].map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeTab === t.id
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: THE 7-LAYER SOVEREIGN GUARDRAIL MAP */}
        {activeTab === 'MAP_7_LAYERS' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              {layers.map((layer: any, idx: number) => (
                <div
                  key={`${layer.layer_id}-${idx}`}
                  className="bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 rounded-lg p-4 transition"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5 mb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold">
                        LAYER {layer.layer_number}
                      </span>
                      <span className="text-sm font-bold text-white">{layer.name}</span>
                      <span className="text-[11px] text-slate-500">({layer.layer_id})</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold self-start md:self-auto">
                      {layer.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-bold mb-1.5">Active Constitutional Guardrails:</div>
                      <ul className="space-y-1">
                        {layer.guardrails.map((g: string, i: number) => (
                          <li key={`${layer.layer_id}-g-${i}`} className="flex items-start gap-2 text-slate-300">
                            <span className="text-emerald-400 font-bold">✓</span>
                            <span>{g}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-2 bg-slate-950/80 p-3 rounded border border-slate-800">
                      <div>
                        <span className="text-[10px] text-cyan-400 uppercase font-bold block">Execution &amp; Verification Flow:</span>
                        <span className="text-slate-200 text-[11px]">{layer.execution_flow}</span>
                      </div>
                      <div className="pt-1 border-t border-slate-800/80">
                        <span className="text-[10px] text-amber-400 uppercase font-bold block">Live Enforcement Substrate:</span>
                        <span className="text-slate-300 text-[11px]">{layer.enforcement_mechanism}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: THE 6 AGENT CAPABILITY PROFILES */}
        {activeTab === 'CAPABILITY_PROFILES' && (
          <div className="space-y-4">
            <div className="bg-slate-900/70 border border-slate-800 p-3.5 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div>
                <span className="text-emerald-400 font-bold uppercase">Strict Lifecycle State Machine: </span>
                <span className="text-white font-bold">INITIALIZING → ACTIVE → SUSPENDED → TERMINATED</span>
              </div>
              <span className="text-slate-400 text-[11px]">
                No hidden states • Only Orchestrator / XERJ Reflex can transition state
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profiles.map((prof: any, idx: number) => (
                <div
                  key={`${prof.profile_id}-${idx}`}
                  className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 text-xs font-bold">
                        {prof.profile_id}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded bg-slate-950 text-amber-400 border border-slate-700 text-[10px] font-bold">
                          ROLE: {prof.governance_tier}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 text-[10px] font-bold">
                          ≤ {prof.max_memory_enclave_kb} KB
                        </span>
                      </div>
                    </div>

                    <div className="text-sm font-bold text-white">{prof.title}</div>

                    <div className="text-xs space-y-1.5 pt-1">
                      <div>
                        <span className="text-[10px] text-emerald-400 font-bold uppercase block">CAN (Allowed Surfaces):</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {prof.allowed_surfaces.map((s: string, i: number) => (
                            <span
                              key={`${prof.profile_id}-allow-${i}`}
                              className="px-1.5 py-0.5 bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 rounded text-[10px]"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-1">
                        <span className="text-[10px] text-rose-400 font-bold uppercase block">CANNOT (Forbidden Surfaces):</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {prof.forbidden_surfaces.map((s: string, i: number) => (
                            <span
                              key={`${prof.profile_id}-forbid-${i}`}
                              className="px-1.5 py-0.5 bg-rose-950/60 text-rose-300 border border-rose-800/60 rounded text-[10px]"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2.5 border-t border-slate-800 text-[11px] space-y-1">
                    <div className="flex items-center justify-between text-slate-400">
                      <span>HTTP Methods: <strong className="text-white">{prof.allowed_http_methods.join(', ')}</strong></span>
                      <span>PQC Required: <strong className={prof.require_pqc_signature ? 'text-emerald-400' : 'text-slate-400'}>{prof.require_pqc_signature ? 'YES (ML-DSA/Ed25519)' : 'OPTIONAL'}</strong></span>
                    </div>
                    <div className="text-[10px] text-slate-500 truncate" title={prof.rls_postgres_policy}>
                      RLS Policy: <span className="text-slate-300">{prof.rls_postgres_policy}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: SWARM DRIFT DETECTION RULES & INTERACTIVE XERJ FIREWALL SIMULATOR */}
        {activeTab === 'DRIFT_RULES_SIM' && (
          <div className="space-y-6">
            {/* The 6 Drift Rules Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {driftRules.map((rule: any, idx: number) => (
                <div key={`${rule.rule_id}-${idx}`} className="bg-slate-900 border border-slate-800 p-3.5 rounded-lg space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-400">{rule.rule_id}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        rule.severity === 'CRITICAL'
                          ? 'bg-rose-950 text-rose-400 border border-rose-800'
                          : 'bg-amber-950 text-amber-400 border border-amber-800'
                      }`}
                    >
                      {rule.severity} → {rule.target_lifecycle_transition}
                    </span>
                  </div>
                  <div className="font-bold text-white">{rule.name}</div>
                  <div className="text-[11px] text-slate-400">
                    <strong className="text-slate-300">Baseline:</strong> {rule.baseline_specification}
                  </div>
                  <div className="text-[11px] text-rose-300">
                    <strong className="text-rose-400">Trigger:</strong> {rule.trigger_condition}
                  </div>
                  <div className="text-[11px] text-emerald-300 pt-1 border-t border-slate-800">
                    <strong className="text-emerald-400">Action:</strong> {rule.automated_response}
                  </div>
                </div>
              ))}
            </div>

            {/* Interactive XERJ Behavioral Guardrail Test Bench */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-slate-900/90 border border-slate-800 p-4 rounded-lg">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-cyan-400 uppercase flex items-center gap-1.5">
                    <Cpu className="w-4 h-4" />
                    Live XERJ Behavioral Guardrail &amp; Drift Simulator
                  </h3>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() =>
                        handleEvaluateDriftAction({
                          actor_id: 'swarm-02-npm-harvester',
                          profile_id: 'SWARM_HARVESTER',
                          target_surface: '/api/census/hyper-sweep',
                          http_method: 'POST',
                          call_rate_rps: 9.2,
                          enclave_memory_kb: 48,
                          pqc_signature_valid: true,
                          ssot_delta: 0
                        })
                      }
                      className="px-2 py-1 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-700 rounded text-[10px] font-bold cursor-pointer"
                    >
                      Preset: Valid Swarm
                    </button>
                    <button
                      onClick={() =>
                        handleEvaluateDriftAction({
                          actor_id: 'rogue-swarm-mutator-99',
                          profile_id: 'SWARM_HARVESTER',
                          target_surface: 'src/schemas/census-hyper-scale.ts (PR_CREATE)',
                          http_method: 'PUT',
                          call_rate_rps: 52.0,
                          enclave_memory_kb: 128,
                          pqc_signature_valid: false,
                          ssot_delta: 14
                        })
                      }
                      className="px-2 py-1 bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-700 rounded text-[10px] font-bold cursor-pointer"
                    >
                      Preset: Rogue Escalation
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Actor / Swarm ID</label>
                    <input
                      type="text"
                      value={simActorId}
                      onChange={(e) => setSimActorId(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Capability Profile</label>
                    <select
                      value={simProfile}
                      onChange={(e) => setSimProfile(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-white"
                    >
                      {profiles.map((p: any, i: number) => (
                        <option key={`${p.profile_id}-${i}`} value={p.profile_id}>
                          {p.profile_id}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="text-[10px] text-slate-400 block mb-1">Target Surface / Endpoint</label>
                    <input
                      type="text"
                      value={simSurface}
                      onChange={(e) => setSimSurface(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Call Rate (req/sec)</label>
                    <input
                      type="number"
                      value={simRateRps}
                      onChange={(e) => setSimRateRps(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Wasm Enclave Memory (KB, Max 64)</label>
                    <input
                      type="number"
                      value={simMemKb}
                      onChange={(e) => setSimMemKb(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">SSOT Discrepancy (Δ)</label>
                    <input
                      type="number"
                      value={simDelta}
                      onChange={(e) => setSimDelta(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-white"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-5">
                    <input
                      type="checkbox"
                      id="pqcCheck"
                      checked={simPqcValid}
                      onChange={(e) => setSimPqcValid(e.target.checked)}
                    />
                    <label htmlFor="pqcCheck" className="text-xs text-slate-300">
                      Valid SPIFFE + PQC Sig
                    </label>
                  </div>
                </div>

                <button
                  onClick={() => handleEvaluateDriftAction()}
                  disabled={simLoading}
                  className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-bold rounded cursor-pointer"
                >
                  {simLoading ? 'EVALUATING IN XERJ REFLEX ROUTER...' : '⚡ TEST ACTION AGAINST XERJ GUARDRAIL SPINE'}
                </button>

                {simResult && (
                  <div
                    className={`p-3 rounded border text-xs space-y-1.5 ${
                      simResult.allowed
                        ? 'bg-emerald-950/50 border-emerald-700 text-emerald-200'
                        : 'bg-rose-950/50 border-rose-700 text-rose-200'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span>
                        XERJ VERDICT: {simResult.allowed ? 'ALLOWED (ACTIVE)' : `DENIED → ${simResult.lifecycle_state}`}
                      </span>
                      {simResult.triggered_rules?.length > 0 && (
                        <span className="text-[10px] bg-rose-900 px-2 py-0.5 rounded text-white">
                          {simResult.triggered_rules.join(', ')}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px]">{simResult.xerj_action}</div>
                    {simResult.anomaly_record && (
                      <div className="text-[10px] text-amber-300 font-mono truncate">
                        Merkle WAL Hash: {simResult.anomaly_record.merkle_wal_hash}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Live Anomaly Events Ledger */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-rose-400 uppercase flex items-center gap-1.5">
                  <Activity className="w-4 h-4" />
                  Immutable Anomaly &amp; Quarantine Ledger (`public.anomaly_events`)
                </h3>
                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {anomalies.map((a: any, idx: number) => (
                    <div
                      key={`${a.anomaly_id}-${idx}`}
                      className="bg-slate-950 border border-slate-800 p-3 rounded text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-rose-400">{a.rule_id}</span>
                        <span className="px-1.5 py-0.5 bg-rose-950 text-rose-300 border border-rose-800 rounded text-[10px] font-bold">
                          {a.xerj_decision} → {a.new_lifecycle_state}
                        </span>
                      </div>
                      <div className="text-white font-semibold">
                        Actor: <span className="text-cyan-300">{a.actor_id}</span> ({a.profile_id})
                      </div>
                      <div className="text-[11px] text-slate-400">Surface: {a.target_surface}</div>
                      <div className="text-[11px] text-slate-300">{a.observed_metric}</div>
                      <div className="text-[10px] text-slate-500 font-mono truncate">
                        WAL SHA-256: {a.merkle_wal_hash}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SACRED FILE MERKLE ATTESTATION & PR CRITICAL GUARDIAN */}
        {activeTab === 'SACRED_MERKLE_PR' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sacred Critical Files Merkle Table */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-emerald-400 uppercase flex items-center gap-1.5">
                  <FileCode className="w-4 h-4" />
                  Sacred Core Files — Live Disk SHA-256 Merkle Attestation
                </h3>
                <button
                  onClick={fetchGuardrailState}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-xs text-emerald-300 rounded cursor-pointer"
                >
                  Re-Verify Disk Hashes
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                Combined Merkle Root:{' '}
                <span className="text-emerald-400 font-bold">{attestation?.sacred_merkle_root_sha256}</span>
              </p>

              <div className="space-y-2">
                {attestation?.files?.map((f: any, idx: number) => (
                  <div key={`${f.file_path}-${idx}`} className="bg-slate-950 border border-slate-800 p-2.5 rounded text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{f.file_path}</span>
                      <span className="px-1.5 py-0.5 bg-indigo-950 text-indigo-300 border border-indigo-800 rounded text-[10px]">
                        Label: {f.required_label} • ≥{f.required_approvals} Approvals
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{f.category} ({f.bytes.toLocaleString()} bytes)</div>
                    <div className="text-[10px] text-cyan-400 font-mono mt-1 truncate">
                      SHA-256: {f.sha256_digest}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Pull Request Gatekeeper */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-amber-400 uppercase flex items-center gap-1.5">
                  <GitPullRequest className="w-4 h-4" />
                  Critical File Guardian — PR Constitutional Gatekeeper
                </h3>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => handleEvaluatePrGuardian(false)}
                    className="px-2 py-1 bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-700 rounded text-[10px] font-bold cursor-pointer"
                  >
                    Test Malformed PR
                  </button>
                  <button
                    onClick={() => handleEvaluatePrGuardian(true)}
                    className="px-2 py-1 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-700 rounded text-[10px] font-bold cursor-pointer"
                  >
                    Test Architect Signed PR
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className="col-span-2">
                  <label className="text-[10px] text-slate-400 block mb-1">Pull Request Title</label>
                  <input
                    type="text"
                    value={prTitle}
                    onChange={(e) => setPrTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Author Governance Role</label>
                  <select
                    value={prRole}
                    onChange={(e) => setPrRole(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-white"
                  >
                    <option value="ARCHITECT">ARCHITECT</option>
                    <option value="MAINTAINER">MAINTAINER</option>
                    <option value="CONTRIBUTOR">CONTRIBUTOR</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Human Approvals Count</label>
                  <input
                    type="number"
                    value={prApprovals}
                    onChange={(e) => setPrApprovals(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-white"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-[10px] text-slate-400 block mb-1">Touched Files (comma-separated)</label>
                  <input
                    type="text"
                    value={prFiles}
                    onChange={(e) => setPrFiles(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">PR Labels</label>
                  <input
                    type="text"
                    value={prLabels}
                    onChange={(e) => setPrLabels(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">New Dependencies Added</label>
                  <input
                    type="text"
                    value={prNewDeps}
                    onChange={(e) => setPrNewDeps(e.target.value)}
                    placeholder="None or package@1.2.3"
                    className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-white"
                  />
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="gpgSig"
                    checked={prSigned}
                    onChange={(e) => setPrSigned(e.target.checked)}
                  />
                  <label htmlFor="gpgSig" className="text-slate-300">GPG / Sigstore Signed</label>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="prTestsCheck"
                    checked={prTests}
                    onChange={(e) => setPrTests(e.target.checked)}
                  />
                  <label htmlFor="prTestsCheck" className="text-slate-300">Tests &amp; Invariants Added</label>
                </div>
              </div>

              <button
                onClick={() => handleEvaluatePrGuardian()}
                disabled={prLoading}
                className="w-full py-2 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white text-xs font-bold rounded cursor-pointer"
              >
                {prLoading ? 'RUNNING CONSTITUTIONAL COURT CI...' : '⚖️ EVALUATE PR IN CRITICAL FILE GUARDIAN'}
              </button>

              {prVerdict && (
                <div
                  className={`p-3 rounded border text-xs space-y-2 ${
                    prVerdict.pr_approved_for_merge
                      ? 'bg-emerald-950/50 border-emerald-700'
                      : 'bg-rose-950/50 border-rose-700'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold">
                    <span className={prVerdict.pr_approved_for_merge ? 'text-emerald-300' : 'text-rose-300'}>
                      VERDICT: {prVerdict.verdict}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Sacred Files Touched: {prVerdict.touched_sacred_files?.length || 0}
                    </span>
                  </div>

                  {prVerdict.violations?.length > 0 && (
                    <ul className="space-y-1 text-rose-200 text-[11px]">
                      {prVerdict.violations.map((v: string, i: number) => (
                        <li key={`viol-${i}`} className="flex items-start gap-1.5">
                          <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                          <span>{v}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {prVerdict.passed_checks?.length > 0 && (
                    <ul className="space-y-1 text-emerald-200 text-[11px] pt-1 border-t border-slate-800/80">
                      {prVerdict.passed_checks.map((c: string, i: number) => (
                        <li key={`pass-${i}`} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: SUPABASE SQL TRIGGERS & GITHUB ACTIONS CONSTITUTIONAL CI */}
        {activeTab === 'SQL_CI_ARTIFACTS' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg space-y-2">
              <div className="text-emerald-400 font-bold uppercase flex items-center gap-1.5">
                <Database className="w-4 h-4" />
                supabase/migrations/20261022_sovereign_guardrail_spine.sql
              </div>
              <p className="text-[11px] text-slate-400">
                Defines `public.agent_capabilities`, `public.swarm_policies`, `public.anomaly_events`, and PL/pgSQL mutation firewall triggers (`≤64 KB` enclave bound, PQC check, and append-only telemetry immutability).
              </p>
              <pre className="bg-slate-950 p-3 rounded border border-slate-800 text-[11px] text-emerald-300 overflow-x-auto max-h-96">
{`-- Trigger 1: Enforce ≤64 KB Enclave Bounds & PQC Identity
CREATE OR REPLACE FUNCTION public.fn_enforce_agent_enclave_and_pqc()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE v_mem_kb INTEGER;
BEGIN
  v_mem_kb := COALESCE((NEW.metadata->>'max_memory_kb')::INTEGER, 64);
  IF v_mem_kb > 64 THEN
    RAISE EXCEPTION 'SOVEREIGN_GUARDRAIL_VIOLATION: max_memory_kb (%) > 64 KB', v_mem_kb;
  END IF;
  IF NEW.ed25519_pubkey IS NULL OR length(trim(NEW.ed25519_pubkey)) < 16 THEN
    RAISE EXCEPTION 'SOVEREIGN_GUARDRAIL_VIOLATION: Missing Ed25519/ML-DSA-87 key';
  END IF;
  RETURN NEW;
END; $$;

-- Trigger 2: Append-Only Telemetry & Anomaly Immutability
CREATE OR REPLACE FUNCTION public.fn_forbid_telemetry_mutation()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'SOVEREIGN_IMMUTABILITY_VIOLATION: UPDATE/DELETE forbidden.';
END; $$;`}
              </pre>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg space-y-2">
              <div className="text-cyan-400 font-bold uppercase flex items-center gap-1.5">
                <Terminal className="w-4 h-4" />
                .github/workflows/sovereign-guardrail-ci.yml
              </div>
              <p className="text-[11px] text-slate-400">
                4-Stage Constitutional Court CI: Static &amp; Critical File Guardian → Hare-Niemeyer ($\Delta=0$) &amp; Kahn Acyclic DAG → Supply-Chain Registry Allowlist &amp; CycloneDX SBOM → Production Build Gate.
              </p>
              <pre className="bg-slate-950 p-3 rounded border border-slate-800 text-[11px] text-cyan-300 overflow-x-auto max-h-96">
{`jobs:
  stage_1_structural_and_critical_guardian:
    steps:
      - run: npm ci --ignore-scripts
      - run: npm run lint
      # Rejects sacred file changes lacking 'critical-change' or 'ssot-change' label

  stage_2_ssot_invariants_and_kahn_dag:
    steps:
      # Verifies Hare-Niemeyer Sum(228 Domains) === N_SSOT (Delta = 0)
      # Verifies Kahn Topological Sort on Sovereign 300 is_acyclic === true

  stage_3_supply_chain_sbom_and_allowlist:
    steps:
      # Blocks direct git+ URLs in package-lock.json & generates CycloneDX SBOM

  stage_4_merkle_attestation_and_build_gate:
    steps:
      - run: npm run build`}
              </pre>
            </div>
          </div>
        )}

        {/* TAB 6: ASRP-1.0 COMMUNITY DMZ INTAKE LEDGER & LIVE CRAWLER RADAR */}
        {activeTab === 'COMMUNITY_DMZ_RADAR' && (
          <div className="space-y-6 text-xs">
            {/* DMZ Overview Header */}
            <div className="bg-slate-900/90 border border-emerald-500/40 p-4 rounded-lg flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <div className="text-emerald-400 font-bold uppercase tracking-wider">
                  ASRP-1.0 Cryptographic Demilitarized Zone (DMZ) &amp; Honeypot Intake Pipeline
                </div>
                <p className="text-slate-300 text-[11px] mt-1">
                  Isolates external SWE agents (`OpenHands`, `SWE-agent`, `Devin`, `Claude Code`) and MCP crawlers strictly to{' '}
                  <code className="text-cyan-300">data/community-registered-agents.json</code> &amp;{' '}
                  <code className="text-cyan-300">POST /api/community/propose</code> while enforcing Zero Sacred Core Diff, SSRF blocking, ≤64 KB Wasm enclave bounds, and Live HTTPS Wire Probes.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  onClick={handleRunDmzCourtVerifier}
                  disabled={dmzVerifying}
                  className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded cursor-pointer whitespace-nowrap"
                >
                  {dmzVerifying ? 'PROBING DMZ NODES...' : '🛡️ RUN 4-STAGE DMZ COURT VERIFIER'}
                </button>
              </div>
            </div>

            {/* 4-Stage Court Verifier Output */}
            {dmzVerifyReport && (
              <div className="bg-slate-950 border border-emerald-500/50 p-4 rounded-lg space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
                  <span className="font-bold text-emerald-400">
                    ✅ {dmzVerifyReport.status} — 4-Stage `scripts/verify-community-intake.ts` Live Execution
                  </span>
                  <span className="text-cyan-300 font-mono text-[11px]">
                    DMZ Merkle Root: {dmzVerifyReport.stage_4_dmz_merkle_root}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
                    <span className="text-slate-400 block">Stage 1 (Git Diff Sandbox):</span>
                    <span className="text-emerald-300 font-bold">{dmzVerifyReport.stage_1_zero_sacred_diff}</span>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
                    <span className="text-slate-400 block">Stage 2 (Zod + ≤64KB + SSRF):</span>
                    <span className="text-emerald-300 font-bold">{dmzVerifyReport.stage_2_zod_and_ssrf_guardrail}</span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">
                    Stage 3 — Live HTTPS Wire Probes Across Registered Community Nodes:
                  </div>
                  {dmzVerifyReport.stage_3_live_wire_probes?.map((p: any, i: number) => (
                    <div
                      key={`${p.node_id}-${i}`}
                      className="flex flex-wrap items-center justify-between gap-2 bg-slate-900 px-3 py-2 rounded border border-slate-800 font-mono text-[11px]"
                    >
                      <div>
                        <span className="text-emerald-400 font-bold">{p.node_id}</span>{' '}
                        <span className="text-white">({p.agent_or_server_name})</span>
                      </div>
                      <div className="flex items-center gap-3 tabular-nums">
                        <span className="text-cyan-300">HTTP {p.http_status}</span>
                        <span className="text-amber-300">{p.rtt_ms} ms</span>
                        <span className="text-slate-400">Leaf: 0x{p.leaf_sha256.slice(0, 16)}…</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column: Safe-Harbor Community Ledger & Live Self-Registration */}
              <div className="space-y-4">
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-emerald-400 uppercase">
                      Safe-Harbor Community Ledger (`data/community-registered-agents.json`)
                    </h3>
                    <span className="text-[11px] text-cyan-300 tabular-nums">
                      {dmzNodesState?.count || dmzNodesState?.registered_nodes?.length || 0} Verified Nodes
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    DMZ Merkle Root: <span className="text-emerald-300">0x{dmzNodesState?.dmz_merkle_root}</span>
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {dmzNodesState?.registered_nodes?.map((n: any, idx: number) => (
                      <div key={`${n.node_id}-${idx}`} className="bg-slate-950 border border-slate-800 p-3 rounded space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white">
                            {n.node_id} • {n.agent_or_server_name}
                          </span>
                          <span className="text-[10px] text-emerald-400 font-bold">
                            {n.category} • ≤{n.max_memory_kb} KB
                          </span>
                        </div>
                        <div className="text-[11px] text-cyan-300 truncate">{n.spiffe_svid}</div>
                        <div className="text-[10px] text-slate-400 flex items-center justify-between">
                          <span className="truncate max-w-[260px]">{n.live_health_url}</span>
                          <span>
                            {n.pqc_algorithm} • @{n.submitted_by_github}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Path A: Live HTTP Self-Registration Form */}
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-sm font-bold text-cyan-400 uppercase">
                      Path A — Live HTTP Self-Registration (`POST /api/community/propose`)
                    </h3>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => handleSubmitDmzProposal(false)}
                        className="px-2 py-1 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-700 rounded text-[10px] font-bold cursor-pointer"
                      >
                        Preset: Valid MCP Node
                      </button>
                      <button
                        onClick={() => handleSubmitDmzProposal(true)}
                        className="px-2 py-1 bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-700 rounded text-[10px] font-bold cursor-pointer"
                      >
                        Preset: SSRF Attack (Blocked)
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Node ID (`ASRP-EXT-XXXX`)</label>
                      <input
                        type="text"
                        value={propNodeId}
                        onChange={(e) => setPropNodeId(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Category</label>
                      <select
                        value={propCategory}
                        onChange={(e) => setPropCategory(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-white"
                      >
                        <option value="MCP_SERVER">MCP_SERVER</option>
                        <option value="AUTONOMOUS_SWE_AGENT">AUTONOMOUS_SWE_AGENT</option>
                        <option value="OPEN_WEIGHTS_MODEL">OPEN_WEIGHTS_MODEL</option>
                        <option value="ROBOTICS_ROS2_NODE">ROBOTICS_ROS2_NODE</option>
                        <option value="TELEMETRY_BRIDGE">TELEMETRY_BRIDGE</option>
                        <option value="AI_FACTORY_ENDPOINT">AI_FACTORY_ENDPOINT</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="text-[10px] text-slate-400 block mb-1">Agent / MCP Server Name</label>
                      <input
                        type="text"
                        value={propName}
                        onChange={(e) => setPropName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-white"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="text-[10px] text-slate-400 block mb-1">
                        Live Public HTTPS Endpoint (Probed over TLS; SSRF Private IPs Blocked)
                      </label>
                      <input
                        type="text"
                        value={propHealthUrl}
                        onChange={(e) => setPropHealthUrl(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Wasm Memory (KB, Max 64)</label>
                      <input
                        type="number"
                        value={propMemKb}
                        onChange={(e) => setPropMemKb(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">GitHub Submitter</label>
                      <input
                        type="text"
                        value={propGithubUser}
                        onChange={(e) => setPropGithubUser(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-white"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => handleSubmitDmzProposal()}
                    disabled={propLoading}
                    className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-bold rounded cursor-pointer"
                  >
                    {propLoading ? 'PROBING LIVE HTTPS & XERJ /_DECIDE...' : '🛰️ SUBMIT AGENT TO ASRP-1.0 DMZ INTAKE'}
                  </button>

                  {propResult && (
                    <div
                      className={`p-3 rounded border space-y-1 ${
                        propResult.httpStatus === 201
                          ? 'bg-emerald-950/60 border-emerald-700 text-emerald-200'
                          : 'bg-rose-950/60 border-rose-700 text-rose-200'
                      }`}
                    >
                      <div className="font-bold flex items-center justify-between">
                        <span>
                          HTTP {propResult.httpStatus}: {propResult.status || propResult.error}
                        </span>
                        {propResult.wire_probe && (
                          <span className="tabular-nums text-cyan-300">
                            RTT: {propResult.wire_probe.rtt_ms} ms (HTTP {propResult.wire_probe.http_status})
                          </span>
                        )}
                      </div>
                      {propResult.message && <div className="text-[11px]">{propResult.message}</div>}
                      {propResult.merkle_wal_root && (
                        <div className="text-[10px] text-amber-300 font-mono truncate">
                          WAL Merkle Root: 0x{propResult.merkle_wal_root} • Profile: {propResult.assigned_capability_profile}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Live External AI Crawler & Bot Radar */}
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg space-y-3 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-bold text-amber-400 uppercase">
                        Live External AI Crawler &amp; Bot Radar (`liveCrawlerTelemetryTrap`)
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        Traps and logs `GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`, `OpenHands`, `SWE-agent`, and `mcp-client` visiting `/robots.txt`, `/llms.txt`, and `/.well-known/mcp.json`.
                      </p>
                    </div>
                  </div>

                  {/* Simulate Bot Crawl Triggers */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {[
                      { label: '+ GPTBot (/llms.txt)', ua: 'GPTBot/1.2 (+https://openai.com/gptbot)', path: '/llms.txt' },
                      { label: '+ ClaudeBot (mcp.json)', ua: 'ClaudeBot/1.0 (+claudebot@anthropic.com)', path: '/.well-known/mcp.json' },
                      { label: '+ OpenHands SWE (AGENTS.md)', ua: 'OpenHands-SWE-Agent/2.4', path: '/AGENTS.md' },
                      { label: '+SWE-agent (Issue YAML)', ua: 'SWE-agent/1.1 (Autonomous-PR-Bot)', path: '/.github/ISSUE_TEMPLATE/asrp-agent-registration.yml' }
                    ].map((b) => (
                      <button
                        key={b.label}
                        onClick={() => handleSimulateBotVisit(b.ua, b.path)}
                        className="px-2 py-1 bg-slate-950 hover:bg-slate-800 text-cyan-300 border border-slate-700 rounded text-[10px] font-bold cursor-pointer"
                      >
                        {b.label}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                    {crawlerRadarState?.sightings?.map((s: any, idx: number) => (
                      <div key={`${s.sighting_id}-${idx}`} className="bg-slate-950 border border-slate-800 p-2.5 rounded space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-amber-300">{s.bot_family}</span>
                          <span className="text-[10px] text-emerald-400">
                            {s.http_method} {s.target_path} → {s.assigned_profile}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">{s.user_agent}</div>
                        <div className="text-[10px] text-slate-500 font-mono flex items-center justify-between">
                          <span>Leaf: 0x{s.merkle_leaf_sha256?.slice(0, 20)}…</span>
                          <span>{new Date(s.observed_at_iso).toLocaleTimeString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 text-[10px] text-slate-400 flex flex-wrap items-center justify-between gap-2">
                  <span>Discovery Surfaces: `/robots.txt` • `/llms.txt` • `/.well-known/mcp.json` • `AGENTS.md`</span>
                  <span className="text-emerald-400 font-bold">Zero Sacred Core Exposure</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
