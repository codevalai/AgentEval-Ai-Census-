# Security Policy & Post-Quantum Cryptographic Guarantees

## Supported Versions & Runtime Baselines

| Version | Node.js Runtime | Cryptographic Suite | Support Status |
| :--- | :--- | :--- | :--- |
| `v1.2.x (Sovereign Infinity)` | `Node.js 22.x LTS` | `NIST FIPS 203 ML-KEM-1024` + `FIPS 204 ML-DSA-87` | ✅ Active / Enforced |
| `< v1.2.0` | `Node.js 20.x` | Hybrid Classical / Pre-Ratified PQC | ⚠️ Superseded |

---

## Core Security Invariants (`RFC-001` – `RFC-010`)

Every commit and pull request merged into `main` is gated by automated GitHub Actions workflows (`governance-rfc-check.yml` and `threat-radar-automation.yml`) that enforce:

1. **`RFC-001` Cleanroom Provenance**: Zero proprietary patent or copyleft contamination across all 100 indexed repositories (`overlap === 0`).
2. **`RFC-002` Byzantine Fault Tolerant Quorum**: Global state root transitions require $\ge 85.0\%$ regional megasite consensus (`Mysticeti` / `Bullshark` DAG-BFT with `OLE-1.0` partition healing).
3. **`RFC-003` & `RFC-006` 64 KiB Linear Wasm Memory Sandboxing**: Ephemeral agent execution slices are hardware-clamped to `1 Wasm Page (65,536 Bytes)` with OpenTitan silicon PUF nonces.
4. **`RFC-004` Post-Quantum Lattice Cryptography**: Mandatory `ML-KEM-1024` key encapsulation and `ML-DSA-87` signatures with NTT butterfly timing jitter clamped to `< 50ps`.
5. **`RFC-009` Hardware Kinetic Interlocks**: Physical optocoupler relay cut-offs (`< 100µs`) and ISO 26262 ASIL-D CAN-FD torque clamps (`<= 42.0 Nm`).

---

## Reporting a Vulnerability

To report a cryptographic timing side-channel, sandbox boundary bypass, or SSOT accounting discrepancy:

1. **Automated Triage**: Run `npm run replay-verify` locally to generate a deterministic witness log.
2. **Steward Disclosure**: Contact Primary Founder & Lead Steward **Nicholas Brian** (`nicholasbrianbn@gmail.com`) with the reproduction payload and Merkle root anchor.
