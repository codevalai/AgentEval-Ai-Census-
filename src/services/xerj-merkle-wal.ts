/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * XERJ MERKLE WRITE-AHEAD LOG (WAL) & ED25519 CRYPTOGRAPHIC SIGNER
 * Chained SHA-256 Merkle hashes and Node Ed25519 signatures across every
 * Sovereign Coordination decision, Audit Ledger event, Quorum vote, Temporal rule,
 * Diplomacy treaty activation, and XERJ Arbitration Mesh verdict.
 */

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

export type XerjWalEventType =
  | 'SOVEREIGN_DECISION'
  | 'AUDIT_EVENT'
  | 'QUORUM_DECISION'
  | 'TEMPORAL_RULE_CHANGE'
  | 'TREATY_ACTIVATION'
  | 'XERJ_ARBITRATION'
  | 'CRITICAL_ACTION_GOVERNED';

export interface XerjWalEntry {
  id: string;
  event_type: XerjWalEventType;
  timestamp: string;
  actor_id: string;
  payload: Record<string, any>;
  prev_hash: string;
  merkle_hash: string;
  signature: string;
  public_key: string;
}

const WAL_PATH = path.resolve(process.cwd(), '.xerj-telemetry-spool.jsonl');

// Generate deterministic or runtime Ed25519 Sovereign Signer KeyPair
const { publicKey: sovereignPubKeyObj, privateKey: sovereignPrivKeyObj } =
  crypto.generateKeyPairSync('ed25519');

export const SOVEREIGN_ED25519_PUBLIC_KEY_HEX = sovereignPubKeyObj
  .export({ type: 'spki', format: 'der' })
  .toString('hex');

const inMemoryWalHistory: XerjWalEntry[] = [];
let lastChainHash = crypto
  .createHash('sha256')
  .update('SOVEREIGN_CONSTITUTIONAL_PARLIAMENT_GENESIS_2026')
  .digest('hex');

export function computeSha256(input: string): string {
  return crypto.createHash('sha256').update(input).digest('hex');
}

export function ed25519Sign(message: string): string {
  const sig = crypto.sign(null, Buffer.from(message, 'utf8'), sovereignPrivKeyObj);
  return sig.toString('hex');
}

export function ed25519Verify(message: string, signatureHex: string, publicKeyDerHex?: string): boolean {
  try {
    const keyObj = publicKeyDerHex
      ? crypto.createPublicKey({
          key: Buffer.from(publicKeyDerHex, 'hex'),
          format: 'der',
          type: 'spki',
        })
      : sovereignPubKeyObj;
    return crypto.verify(
      null,
      Buffer.from(message, 'utf8'),
      keyObj,
      Buffer.from(signatureHex, 'hex')
    );
  } catch {
    return false;
  }
}

export function getLastWalHash(): string {
  if (inMemoryWalHistory.length > 0) {
    return inMemoryWalHistory[inMemoryWalHistory.length - 1].merkle_hash;
  }
  return lastChainHash;
}

export function appendToXerjGovernanceWal(params: {
  event_type: XerjWalEventType;
  actor_id: string;
  payload: Record<string, any>;
}): XerjWalEntry {
  const prev_hash = getLastWalHash();
  const timestamp = new Date().toISOString();
  const id = crypto.randomUUID();

  const body = JSON.stringify({
    id,
    event_type: params.event_type,
    timestamp,
    actor_id: params.actor_id,
    payload: params.payload,
    prev_hash,
  });

  const merkle_hash = computeSha256(body);
  const signature = ed25519Sign(merkle_hash);

  const entry: XerjWalEntry = {
    id,
    event_type: params.event_type,
    timestamp,
    actor_id: params.actor_id,
    payload: params.payload,
    prev_hash,
    merkle_hash,
    signature,
    public_key: SOVEREIGN_ED25519_PUBLIC_KEY_HEX,
  };

  lastChainHash = merkle_hash;
  inMemoryWalHistory.push(entry);
  if (inMemoryWalHistory.length > 250) {
    inMemoryWalHistory.shift();
  }

  try {
    fs.appendFileSync(WAL_PATH, JSON.stringify(entry) + '\n', { encoding: 'utf8' });
  } catch {
    // Fallback to in-memory ring buffer if filesystem is read-only
  }

  return entry;
}

export function getGovernanceWalEntries(limit = 50): XerjWalEntry[] {
  return inMemoryWalHistory.slice(-limit).reverse();
}
