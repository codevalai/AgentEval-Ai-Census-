/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * XERJ HUB BRIDGE SERVICE
 * Advanced architecture mapping dynamic Trendshift ecosystem metrics directly into XERJ's
 * Lane A (Reference Corpus Manifests in tools/xerj-code/hub/) and Lane B (Record Packs)
 * with AST routing directives and daemon memory namespaces.
 */

import { TrendshiftRepo } from '../schemas/trendshift.ts';
import * as fs from 'fs';
import * as path from 'path';

export class XerjHubBridgeService {
  private manifestDir: string;

  constructor(manifestDir: string = './tools/xerj-code/hub') {
    this.manifestDir = path.resolve(manifestDir);
    if (!fs.existsSync(this.manifestDir)) {
      fs.mkdirSync(this.manifestDir, { recursive: true });
    }
  }

  /**
   * Compiles a Lane A Manifest structure for a breakout repository
   * matching XERJ Corpus Hub v2 standards.
   */
  public compileLaneAManifest(repo: TrendshiftRepo): { slug: string; targetPath: string; payload: any } {
    const slug = repo.full_name.replace('/', '--').toLowerCase();

    const manifestPayload = {
      corpus: slug,
      domain: repo.language ? repo.language.toLowerCase() : 'ecosystem-intelligence',
      topics: [repo.language?.toLowerCase() || 'general', 'trendshift-breakout', 'autonomous-agent-sensor'],
      ask_for: `How does high-velocity breakout repository ${repo.full_name} implement its core structural execution?`,
      dependency_names: [],
      licence: {
        spdx: 'MIT',
        class: 'permissive',
      },
      pinned_source: {
        repo: repo.full_name,
        url: repo.github_url,
        stars_gained_daily: repo.stars_gained,
        captured_at: repo.captured_at,
      },
      ast_routing: {
        auto_index_command: `xerj autoindex ${repo.github_url}`,
        daemon_namespace: `/_memory/trendshift-radar/${slug}`,
      },
    };

    const targetPath = path.join(this.manifestDir, `${slug}.json`);
    fs.writeFileSync(targetPath, JSON.stringify(manifestPayload, null, 2), 'utf-8');

    return { slug, targetPath, payload: manifestPayload };
  }

  /**
   * Batch process incoming scraped arrays from the Quantavil CDN
   */
  public processEcosystemBatch(repos: TrendshiftRepo[]): { generatedCount: number; paths: string[] } {
    const paths: string[] = [];
    for (const repo of repos) {
      // Filter only high-velocity momentum spikes or top ranked repos
      if (repo.stars_gained >= 50 || repo.rank <= 10) {
        const { targetPath } = this.compileLaneAManifest(repo);
        paths.push(targetPath);
      }
    }
    return { generatedCount: paths.length, paths };
  }
}
