#!/usr/bin/env bash
# ==============================================================================
# SOVEREIGN INFINITY AI CENSUS — XERJ PRODUCTION NODE BOOTSTRAPPER
# Boots XERJ with authenticated neural embeddings and autoindexes repository.
# ==============================================================================

set -euo pipefail

DATA_DIR="${XERJ_DATA_DIR:-$HOME/.xerj-census-data}"
mkdir -p "$DATA_DIR"

echo "=== Booting Sovereign Infinity XERJ Node ==="
echo "Data Directory: $DATA_DIR"

if command -v xerj >/dev/null 2>&1; then
  echo "[OK] Found xerj binary in PATH."
else
  echo "[INSTALL] Installing XERJ binary from https://xerj.org/get..."
  curl -fsSL https://xerj.org/get | sh
fi

# Boot in authenticated neural embedding mode if available, or fallback to dev mode
if [ "${XERJ_INSECURE:-false}" = "true" ]; then
  echo "[BOOT] Starting in --insecure local developer mode on port 9200..."
  xerj --insecure --data-dir "$DATA_DIR" &
else
  echo "[BOOT] Starting in production authenticated neural mode on port 9200..."
  xerj --data-dir "$DATA_DIR" --embed-mode neural &
  sleep 1
  if [ -f "$DATA_DIR/admin.key" ]; then
    export XERJ_API_KEY="$(cat "$DATA_DIR/admin.key")"
    echo "[AUTH] Minted API Key loaded."
  fi
fi

# Wait for local node port
for i in {1..30}; do
  if curl -s "http://127.0.0.1:9200/_cat/health" >/dev/null 2>&1; then
    echo "[READY] XERJ Node is live on http://127.0.0.1:9200."
    break
  fi
  sleep 0.5
done

echo "[INDEX] Auto-indexing sovereign-infinity-ai-census with prefix ax-census..."
xerj autoindex . --prefix ax-census

echo "=== Sovereign Zenith XERJ Substrate Online ==="
