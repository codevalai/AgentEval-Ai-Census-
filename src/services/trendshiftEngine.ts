/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NATIVE TRENDSHIFT SQLITE ENGINE & PIPELINE
 * Mirrors core python backend logic of quantavil/trendshift (src/db.py and src/sync_daily.py),
 * providing relational schema management, batch snapshot upserts, and static JSON mirror exports.
 */

import Database from 'better-sqlite3';
import * as path from 'path';
import * as fs from 'fs';
import { TrendshiftSnapshotRecord } from '../schemas/trendshift.ts';

export class TrendshiftPipelineEngine {
  private db: Database.Database;

  constructor(dbPath: string = './trendshift.db') {
    const resolvedPath = path.resolve(dbPath);
    const dir = path.dirname(resolvedPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    this.db = new Database(resolvedPath);
    this.initSchema();
  }

  private initSchema() {
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

      CREATE INDEX IF NOT EXISTS idx_snapshots_timeframe_lang ON snapshots(timeframe, language_filter);
      CREATE INDEX IF NOT EXISTS idx_snapshots_rank ON snapshots(rank);
    `);
  }

  /**
   * Syncs and upserts incoming Trendshift CDN snapshot arrays into local SQLite db
   */
  public upsertSnapshotBatch(
    timeframe: 'daily' | 'weekly' | 'monthly' | 'yearly',
    periodKey: string,
    languageFilter: string,
    records: any[]
  ): number {
    const insertRepo = this.db.prepare(`
      INSERT INTO repositories (full_name, description, language, created_at)
      VALUES (@full_name, @description, @language, @created_at)
      ON CONFLICT(full_name) DO UPDATE SET
        description = excluded.description,
        language = excluded.language
    `);

    const insertSnapshot = this.db.prepare(`
      INSERT INTO snapshots (
        timeframe, period_key, language_filter, repository_full_name,
        rank, score, language, stars_total, stars_gained, forks_total, forks_gained,
        tags_json, social_mentions_json, fetched_at
      ) VALUES (
        @timeframe, @period_key, @language_filter, @repository_full_name,
        @rank, @score, @language, @stars_total, @stars_gained, @forks_total, @forks_gained,
        @tags_json, @social_mentions_json, @fetched_at
      )
      ON CONFLICT(timeframe, period_key, language_filter, repository_full_name) DO UPDATE SET
        rank = excluded.rank,
        stars_gained = excluded.stars_gained,
        stars_total = excluded.stars_total,
        fetched_at = excluded.fetched_at
    `);

    const transaction = this.db.transaction((rows: any[]) => {
      let count = 0;
      const now = new Date().toISOString();

      for (const row of rows) {
        const repoFullName = row.full_name || `${row.owner || 'unknown'}/${row.name || 'unnamed'}`;
        if (!repoFullName || repoFullName.trim() === '') continue;

        // 1. Upsert repository baseline
        insertRepo.run({
          full_name: repoFullName,
          description: row.description || null,
          language: row.language || languageFilter,
          created_at: row.created_at || now,
        });

        // 2. Upsert snapshot metric record
        insertSnapshot.run({
          timeframe,
          period_key: periodKey,
          language_filter: languageFilter,
          repository_full_name: repoFullName,
          rank: Number(row.rank) || count + 1,
          score: row.score !== undefined && row.score !== null ? Number(row.score) : null,
          language: row.language || languageFilter,
          stars_total: Number(row.stars_total || row.stars) || 0,
          stars_gained: Number(row.stars_gained || row.currentPeriodStars) || 0,
          forks_total: Number(row.forks_total || row.forks) || 0,
          forks_gained: Number(row.forks_gained) || 0,
          tags_json: JSON.stringify(row.tags || []),
          social_mentions_json: JSON.stringify(row.social_mentions || []),
          fetched_at: now,
        });

        count++;
      }
      return count;
    });

    return transaction(records);
  }

  /**
   * Compiles SQLite database records back into minified JSON files (export_json.py equivalent)
   */
  public exportToJsonFiles(outputDir: string = './data') {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const timeframes = ['daily', 'weekly', 'monthly', 'yearly'] as const;
    const indexMeta: Record<string, any> = {
      schema_version: '2.0',
      exported_at: new Date().toISOString(),
      files: {},
    };

    for (const tf of timeframes) {
      const tfDir = path.join(outputDir, tf);
      if (!fs.existsSync(tfDir)) fs.mkdirSync(tfDir, { recursive: true });

      // Query distinct language filters for this timeframe
      const filters = this.db
        .prepare(`SELECT DISTINCT language_filter FROM snapshots WHERE timeframe = ?`)
        .all(tf) as { language_filter: string }[];

      for (const { language_filter } of filters) {
        const rows = this.db
          .prepare(
            `
          SELECT s.*, r.description, r.created_at as repo_created_at
          FROM snapshots s
          JOIN repositories r ON s.repository_full_name = r.full_name
          WHERE s.timeframe = ? AND s.language_filter = ?
          ORDER BY s.rank ASC
        `
          )
          .all(tf, language_filter);

        const fileName = `${tf}-${language_filter}.json`;
        const filePath = path.join(tfDir, fileName);
        fs.writeFileSync(filePath, JSON.stringify(rows, null, 0), 'utf-8');

        indexMeta.files[`${tf}/${fileName}`] = { rows: rows.length };
      }
    }

    fs.writeFileSync(path.join(outputDir, 'index.json'), JSON.stringify(indexMeta, null, 2), 'utf-8');
  }

  /**
   * Reads latest snapshots for a given timeframe and language
   */
  public getSnapshots(timeframe: string = 'daily', language: string = 'all', limit: number = 50): any[] {
    try {
      return this.db
        .prepare(
          `
        SELECT s.*, r.description, r.created_at as repo_created_at
        FROM snapshots s
        JOIN repositories r ON s.repository_full_name = r.full_name
        WHERE s.timeframe = ? AND (s.language_filter = ? OR ? = 'all')
        ORDER BY s.rank ASC
        LIMIT ?
      `
        )
        .all(timeframe, language, language, limit);
    } catch {
      return [];
    }
  }

  public getStats(): { totalRepos: number; totalSnapshots: number } {
    try {
      const repos = this.db.prepare(`SELECT count(*) as count FROM repositories`).get() as { count: number };
      const snaps = this.db.prepare(`SELECT count(*) as count FROM snapshots`).get() as { count: number };
      return { totalRepos: repos?.count || 0, totalSnapshots: snaps?.count || 0 };
    } catch {
      return { totalRepos: 0, totalSnapshots: 0 };
    }
  }
}
