/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * TRENDSHIFT SCHEMAS & VALIDATION CONTRACTS
 * Strict Zod validation contracts mirroring quantavil/trendshift CDN records,
 * SQLite snapshots, and XERJ Corpus Hub Lane A/B manifests.
 */

import { z } from 'zod';

export const TrendshiftRepoSchema = z.object({
  full_name: z.string().min(1),
  name: z.string().optional(),
  owner: z.string().optional(),
  description: z.string().nullable().optional(),
  language: z.string().nullable().optional(),
  github_url: z.string().url().optional().default('https://github.com'),
  rank: z.number().int().positive().optional().default(1),
  score: z.number().nullable().optional(),
  stars_total: z.number().int().nonnegative().optional().default(0),
  stars_gained: z.number().int().nonnegative().optional().default(0),
  forks_total: z.number().int().nonnegative().optional().default(0),
  forks_gained: z.number().int().nonnegative().optional().default(0),
  tags: z.array(z.string()).optional().default([]),
  social_mentions: z.array(z.any()).optional().default([]),
  captured_at: z.string().optional(),
  created_at: z.string().optional(),
});

export type TrendshiftRepo = z.infer<typeof TrendshiftRepoSchema>;

export interface TrendshiftSnapshotRecord {
  timeframe: 'daily' | 'weekly' | 'monthly' | 'yearly';
  period_key: string;
  language_filter: string;
  full_name: string;
  description: string | null;
  language: string | null;
  rank: number;
  score: number | null;
  stars_total: number;
  stars_gained: number;
  forks_total: number;
  forks_gained: number;
  fetched_at: string;
}

export interface TrendshiftEcosystemSyncResult {
  success: boolean;
  timeframe: string;
  language: string;
  scanned: number;
  persisted_to_supabase: number;
  manifests_generated: number;
  sample_commands: string[];
}
