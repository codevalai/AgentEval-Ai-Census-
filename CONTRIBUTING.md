# Contributing to Cod3Eval Sovereign Infinity

Thank you for contributing to **Cod3Eval Sovereign Infinity**. To preserve strict mathematical determinism and cleanroom provenance across the planetary census, all contributions must satisfy the following engineering invariants before merge.

---

## 1. Zero-Drift SSOT Mathematical Discipline

Any modification to population baselines, regional weights, platform shares, or the 76-domain taxonomy **must** preserve the exact multi-dimensional accounting identity in `src/lib/censusSSOT.ts`:

- **Active Concurrent Pool**: `342,892,410,000 + Δ`
- **Latent Blueprints & Staged Pool**: `471,480,590,000 + Δ` (`282.89B` Blueprints + `188.59B` Staged Registries)
- **Combined Indexed Population**: `814,373,000,000 + Δ` (`71.9%` of `1.132T` Ceiling)
- **Unindexed Dark Matter Population**: `318,000,000,000` (`28.1%` of `1.132T` Ceiling across 4 macro zones / 5 telemetry segments)
- **Planetary Persistent + Warm Ceiling**: `1,132,373,000,000` (`1.132 Trillion`)

Never use un-reconciled `Math.round()` or `Math.floor()` across array slices without allocating the Euclidean remainder to the anchor index (or using the Hare-Niemeyer Largest Remainder allocator `distributeTaxonomyExact` / `partitionExactSSOT`).

---

## 2. Pre-Submission Verification Suite

Before opening a Pull Request, run the full verification pipeline locally on **Node.js 22 LTS**:

```bash
# 1. Strict TypeScript typechecking (must exit with 0 errors)
npm run lint

# 2. Production Vite bundle compilation
npm run build

# 3. Deterministic Merkle Spine Replay & 7-Dimension SSOT Audit
npm run replay-verify
```

---

## 3. Cleanroom & RBAC Codeowners

All pull requests are automatically evaluated by `.github/workflows/governance-rfc-check.yml` and `.github/CODEOWNERS`. Changes touching core subsystems (`src/lib/merkleSpine.ts`, `src/lib/censusSSOT.ts`, `src/lib/threatRadarBackend.ts`) require steward review and a passing Z3 SMT-LIB2 `SAT_ALL_POLICIES_VERIFIED` proof.
