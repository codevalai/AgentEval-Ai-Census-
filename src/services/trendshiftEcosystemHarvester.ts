/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * TRENDSHIFT ECOSYSTEM HARVESTER (src/services/trendshiftEcosystemHarvester.ts)
 * Enterprise-grade harvester pulling daily/weekly CDN snapshots from Quantavil Trendshift,
 * maintaining local SQLite engine, upserting to Supabase relational mirror, and auto-generating
 * XERJ Lane A manifests for Corpus Hub v2 auto-indexing.
 */

import Database from 'better-sqlite3';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import * as fs from 'fs';
import * as path from 'path';

export const TrendshiftRepoSchema = z.object({
  rank: z.number().int().positive(),
  full_name: z.string().min(1),
  description: z.string().nullable().optional(),
  language: z.string().nullable().optional(),
  stars_total: z.number().int().nonnegative().default(0),
  stars_gained: z.number().int().nonnegative(),
  forks_total: z.number().int().nonnegative().default(0),
  forks_gained: z.number().int().nonnegative().default(0),
  github_url: z.string().url(),
  captured_at: z.string().default(() => new Date().toISOString())
});

export type TrendshiftRepo = z.infer<typeof TrendshiftRepoSchema>;

export class TrendshiftEcosystemHarvester {
  private db: Database.Database;
  private supabase;
  private readonly cdnBaseUrl = 'https://quantavil.github.io/trendshift/data';
  private readonly localXerjDaemon = 'http://127.0.0.1:9200/_memory/trendshift-radar';
  private manifestDir: string;

  constructor(dbPath: string = './trendshift.db', manifestDir: string = './tools/xerj-code/hub') {
    const resolvedDbPath = path.resolve(dbPath);
    const dbDir = path.dirname(resolvedDbPath);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }
    this.db = new Database(resolvedDbPath);
    this.initSqliteSchema();

    this.supabase = createClient(
      process.env.SUPABASE_URL || 'https://wvhjcxxfslzkechhoolz.supabase.co',
      process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    );

    this.manifestDir = path.resolve(manifestDir);
    if (!fs.existsSync(this.manifestDir)) {
      fs.mkdirSync(this.manifestDir, { recursive: true });
    }
  }

  private initSqliteSchema() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS repositories (
          full_name    TEXT PRIMARY KEY,
          description  TEXT,
          language     TEXT,
          created_at   TEXT
      );

      CREATE TABLE IF NOT EXISTS snapshots (
          timeframe             TEXT NOT NULL CHECK(timeframe IN ('daily','weekly','monthly','yearly')),
          period_key            TEXT NOT NULL,
          language_filter       TEXT NOT NULL DEFAULT 'all',
          repository_full_name  TEXT NOT NULL REFERENCES repositories(full_name),
          rank                  INTEGER NOT NULL,
          score                 INTEGER,
          language              TEXT,
          stars_total           INTEGER,
          stars_gained          INTEGER,
          forks_total           INTEGER,
          forks_gained          INTEGER,
          tags_json             TEXT,
          social_mentions_json  TEXT,
          fetched_at            TEXT NOT NULL,
          PRIMARY KEY (timeframe, period_key, language_filter, repository_full_name)
      );
    `);
  }

  async fetchAndIngestEcosystem(
    timeframe: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'daily',
    languages: string[] = ['python', 'typescript', 'rust', 'go']
  ): Promise<{ scanned: number; inserted: number; manifestsCreated: number; xerjCommands: string[] }> {
    let totalScanned = 0;
    let totalInserted = 0;
    let manifestsCreated = 0;
    const xerjCommands: string[] = [];
    const todayKey = new Date().toISOString().split('T')[0];

    for (const lang of languages) {
      const url = `${this.cdnBaseUrl}/${timeframe}/${timeframe}-${lang}.json`;
      try {
        const response = await fetch(url);
        if (!response.ok) {
          console.warn(`[TrendshiftHarvester] Failed to fetch CDN endpoint for ${lang}: ${response.statusText}`);
          continue;
        }

        const rawData = await response.json();
        if (!Array.isArray(rawData)) continue;

        const validRepos: TrendshiftRepo[] = [];
        let itemIndex = 0;
        for (const item of rawData) {
          itemIndex++;
          totalScanned++;
          const rawFullName = item.full_name || `${item.owner || 'unknown'}/${item.name || 'unnamed'}`;
          const parsed = TrendshiftRepoSchema.safeParse({
            rank: typeof item.rank === 'number' ? item.rank : itemIndex,
            full_name: rawFullName,
            description: item.description ?? null,
            language: item.language ?? lang,
            stars_total: Number(item.stars_total ?? item.stars ?? 0),
            stars_gained: Math.max(0, Number(item.stars_gained ?? item.currentPeriodStars ?? item.stars ?? 0)),
            forks_total: Number(item.forks_total ?? item.forks ?? 0),
            forks_gained: Math.max(0, Number(item.forks_gained ?? 0)),
            github_url: item.github_url || `https://github.com/${rawFullName}`,
            captured_at: item.captured_at || new Date().toISOString()
          });

          if (parsed.success) {
            validRepos.push(parsed.data);
          }
        }

        // 1. Local SQLite Upsert (Quantavil trendshift parity)
        this.persistToSqlite(timeframe, todayKey, lang, validRepos);

        // 2. Supabase Upsert & XERJ Daemon Dispatch (chunked in batches of 50 for high performance)
        const chunkSize = 50;
        for (let i = 0; i < validRepos.length; i += chunkSize) {
          const chunk = validRepos.slice(i, i + chunkSize);
          const recordsToUpsert = chunk.map(repo => ({
            full_name: repo.full_name,
            description: repo.description,
            language: repo.language,
            stars_total: repo.stars_total,
            stars_gained: repo.stars_gained,
            forks_total: repo.forks_total,
            forks_gained: repo.forks_gained,
            github_url: repo.github_url,
            captured_at: repo.captured_at
          }));

          const { error } = await this.supabase
            .from('census_trending_repos')
            .upsert(recordsToUpsert, { onConflict: 'full_name' });

          if (!error) {
            totalInserted += chunk.length;
          }
        }

        for (const repo of validRepos) {
          // 3. Generate XERJ Lane A Manifest if velocity meets threshold
          if (repo.stars_gained >= 25) {
            this.generateXerjLaneAManifest(repo);
            manifestsCreated++;
          }

          const cmd = `xerj autoindex ${repo.github_url}`;
          xerjCommands.push(cmd);
        }

        // Notify local XERJ daemon memory in background
        if (validRepos.length > 0) {
          fetch(this.localXerjDaemon, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              language: lang,
              repos_count: validRepos.length,
              breakouts: validRepos.filter(r => r.stars_gained >= 25).map(r => r.full_name)
            })
          }).catch(() => {});
        }
      } catch (err: any) {
        console.error(`[TrendshiftHarvester] Error processing language ${lang}:`, err.message);
      }
    }

    return { scanned: totalScanned, inserted: totalInserted, manifestsCreated, xerjCommands: Array.from(new Set(xerjCommands)) };
  }

  private persistToSqlite(timeframe: string, periodKey: string, langFilter: string, repos: TrendshiftRepo[]) {
    const insertRepo = this.db.prepare(`
      INSERT INTO repositories (full_name, description, language, created_at)
      VALUES (@full_name, @description, @language, @created_at)
      ON CONFLICT(full_name) DO UPDATE SET description = excluded.description, language = excluded.language
    `);

    const insertSnapshot = this.db.prepare(`
      INSERT INTO snapshots (timeframe, period_key, language_filter, repository_full_name, rank, stars_total, stars_gained, fetched_at)
      VALUES (@timeframe, @period_key, @language_filter, @repository_full_name, @rank, @stars_total, @stars_gained, @fetched_at)
      ON CONFLICT(timeframe, period_key, language_filter, repository_full_name) DO UPDATE SET rank = excluded.rank, stars_gained = excluded.stars_gained
    `);

    const txn = this.db.transaction((rows: TrendshiftRepo[]) => {
      for (const r of rows) {
        insertRepo.run({ full_name: r.full_name, description: r.description || null, language: r.language || langFilter, created_at: r.captured_at });
        insertSnapshot.run({
          timeframe,
          period_key: periodKey,
          language_filter: langFilter,
          repository_full_name: r.full_name,
          rank: r.rank,
          stars_total: r.stars_total,
          stars_gained: r.stars_gained,
          fetched_at: r.captured_at
        });
      }
    });

    txn(repos);
  }

  private generateXerjLaneAManifest(repo: TrendshiftRepo) {
    const slug = repo.full_name.replace('/', '--').toLowerCase();
    const manifest = {
      corpus: `trendshift-${slug}`,
      domain: repo.language ? repo.language.toLowerCase() : 'ecosystem',
      topics: [repo.language?.toLowerCase() || 'general', 'trendshift-breakout'],
      ask_for: `How does breakout repository ${repo.full_name} implement its architecture and execution?`,
      licence: { spdx: 'MIT', class: 'permissive' },
      pinned_source: { repo: repo.full_name, url: repo.github_url, stars_gained: repo.stars_gained },
      ast_routing: { auto_index_command: `xerj autoindex ${repo.github_url}` }
    };

    fs.writeFileSync(path.join(this.manifestDir, `${slug}.json`), JSON.stringify(manifest, null, 2), 'utf-8');
  }
}
