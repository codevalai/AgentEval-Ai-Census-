/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * XERJ MANIFEST GENERATOR SERVICE
 * Automatically compiles validated Trendshift repositories into signed-ready metadata blocks
 * that match XERJ's registry specification (tools/xerj-code/hub/).
 */

import { TrendshiftRepo } from '../schemas/trendshift.ts';
import * as fs from 'fs';
import * as path from 'path';

export class XerjManifestSyncService {
  private outputDir: string;

  constructor(outputDir: string = './xerj-hub-manifests') {
    this.outputDir = path.resolve(outputDir);
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  /**
   * Generates a Lane A style XERJ Corpus Hub manifest for a trending repository
   */
  public generateManifest(repo: TrendshiftRepo): { slug: string; filePath: string; manifest: any } {
    const slug = repo.full_name.replace('/', '--').toLowerCase();

    const manifest = {
      corpus: `trendshift-${slug}`,
      domain: repo.language || 'general',
      topics: [repo.language?.toLowerCase() || 'opensource', 'trending-breakout'],
      ask_for: `How does ${repo.full_name} implement its core architecture and high-velocity features?`,
      dependency_names: [],
      licence: {
        spdx: 'MIT',
        class: 'permissive',
      },
      pinned_source: {
        repo: repo.full_name,
        url: repo.github_url,
        stars_gained: repo.stars_gained,
        captured_at: repo.captured_at,
      },
      pack_target: {
        format: 'hubpack.tar.zst',
        auto_index_command: `xerj autoindex ${repo.github_url}`,
      },
    };

    const filePath = path.join(this.outputDir, `${slug}.json`);
    fs.writeFileSync(filePath, JSON.stringify(manifest, null, 2), 'utf-8');

    return { slug, filePath, manifest };
  }

  public batchSyncManifests(repos: TrendshiftRepo[]): string[] {
    const generatedPaths: string[] = [];
    for (const repo of repos) {
      const result = this.generateManifest(repo);
      generatedPaths.push(result.filePath);
    }
    return generatedPaths;
  }
}
