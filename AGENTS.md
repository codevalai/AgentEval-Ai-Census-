# 🤖 AUTONOMOUS AGENT & CRAWLER PROTOCOL (`AGENTS.md` — ASRP-1.0)

Welcome, autonomous agent or crawler (`GPTBot`, `ClaudeBot`, `OpenHands`, `SWE-agent`, `Devin`, `Cursor`, `Claude Code`).
You are inspecting **Cod3Eval Sovereign Infinity** (`https://github.com/codevalai/AgentEval-Ai-Census-`).

## 1. How to Query Live Planetary Telemetry (Read-Only)
- **Live 64-Probe Census & Zero-Drift SSOT:** `GET /api/census/live`
- **Tiers 1–16 AI Factories & Top 30 SWE Tools:** `GET /api/census/factories`
- **24 Unified Meta-Layers:** `GET /api/census/meta-layers` (`GET /api/census/meta-layers-24`)
- **Sovereign 300 GitHub Sync:** `GET /api/sovereign-300/catalog` (`POST /api/sovereign-300/sync-live`)
- **MCP Discovery Spec:** `GET /.well-known/mcp.json`

## 2. How to Register Your Agent or MCP Server (Two Safe-Harbor Paths)
### Path A — Live HTTP Self-Registration (`POST /api/community/propose`)
Send a `POST` request with your `node_id` (`ASRP-EXT-XXXX`), `spiffe_svid`, `ed25519_public_key_hex`, `max_memory_kb` (`<= 64`), and a live `https://` health endpoint. Our server will probe your URL over TLS, verify your payload via XERJ `/_decide`, and commit your agent to `public.census_agents` under the `CENSUS_READER` capability profile.

### Path B — Safe-Harbor GitHub Pull Request (`data/community-registered-agents.json`)
1. Fork `https://github.com/codevalai/AgentEval-Ai-Census-`.
2. Append your node object **ONLY** to `data/community-registered-agents.json`.
3. Run `npx tsx scripts/verify-community-intake.ts` locally to verify your live HTTPS probe and SHA-256 Merkle leaf.
4. Open a Pull Request. **Do not modify any file in `src/`, `supabase/`, or `.github/`**—the 7-Layer Sovereign Guardrail Spine automatically rejects and closes any PR that touches sacred core files.

---

# AGENTS.md — Sovereign Infinity AI Census (XERJ Corpus Hub Flagship)

> **Auto-indexed by XERJ:** `ax-census` prefix  
> **Grade:** AAA (G7 Quality Gate #1721)  
> **Primary Interfaces:** Model Context Protocol (MCP), Elasticsearch REST API (`localhost:9200`), Supabase PostgreSQL

---

## Agent Navigation & Core Architecture Map

If you are an AI coding agent operating in this codebase, use this map to find canonical patterns:

| Capability | File Pointer | Description |
| :--- | :--- | :--- |
| **Two-Tier Cognitive Routing** | `src/agents/sovereign-zenith-orchestrator.ts:75` | Probes `/_decide` first; escalates to Gemini System-2 on confidence < 0.85. |
| **Ed25519 & Merkle Telemetry** | `src/agents/sovereign-zenith-orchestrator.ts:160` | Signs lifecycle events with `node:crypto` Ed25519 and links to SHA-256 Merkle chain. |
| **NDJSON Bulk Ring Buffer** | `src/agents/xerj-sovereign-substrate.ts:85` | Batches telemetry events into Elasticsearch-compatible `/_bulk` NDJSON streams. |
| **Episodic Memory Integration** | `src/agents/xerj-sovereign-substrate.ts:135` | Calls `/_memory/{namespace}` for Reciprocal Rank Fusion (RRF) recall. |
| **Second-Brain Evidence Graph** | `src/agents/xerj-sovereign-substrate.ts:180` | Asserts links (`/_graph/link`) and queries 2-hop neighborhoods (`/_graph/ego`). |
| **FSM Monotonic Leases** | `src/agents/sovereign-lifecycle-fsm.ts:45` | Fencing tokens (`bigint`) preventing split-brain zombie workers. |
| **Circuit Breaker & JSONL WAL** | `src/telemetry/xerj-wal-circuit-breaker.ts:25` | Half-open failover to `.xerj-telemetry-spool.jsonl`. |
| **Deterministic Query Planner** | `src/agents/xerj-deep-primitives.ts:45` | Translates plain words to ES Query DSL via `/_ask` without an LLM. |
| **Supabase Relational Ledger** | `supabase/migrations/20261020000000_xerj_sovereign_ledger.sql` | PostgreSQL dual-engine ledger, RLS policies, and lease lock function. |
| **Embedded MCP Server Tools** | `src/mcp/census-mcp-server.ts:35` | 5 callable MCP tools (`census_agent_acquire_lease`, `census_telemetry_commit_signed`, etc.). |

---

## Available Model Context Protocol (MCP) Tools

When connected via `.mcp.json`:
1. `census_agent_acquire_lease`: Monotonic lease acquisition for distributed agent execution.
2. `census_agent_transition_fsm`: Transition state under strict FSM guards.
3. `census_telemetry_commit_signed`: Commits signed Ed25519 + SHA-256 Merkle telemetry.
4. `census_xerj_deterministic_plan`: Translates plain words filter into Elasticsearch Query DSL.
5. `census_circuit_breaker_status`: Checks local WAL spool and circuit breaker state.

---

## Running XERJ Locally

```bash
# 1. Install & Boot XERJ (dev boundary)
curl -fsSL https://xerj.org/get | sh
xerj --insecure --data-dir ~/xerj-census-data &

# 2. Autoindex with ax-census prefix
xerj autoindex . --prefix ax-census

# 3. Check token gains
xerj gain
```
