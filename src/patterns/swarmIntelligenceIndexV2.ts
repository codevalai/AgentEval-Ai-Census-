/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface IntelligenceDimensions {
  coordinationScore: number; // 0 - 100
  alignmentScore: number; // 0 - 100
  efficiencyScore: number; // 0 - 100
  resilienceScore: number; // 0 - 100
  economicContributionScore: number; // 0 - 100
  compositeScore: number; // 0 - 100 weighted
}

export interface PlatformIntelligenceScore extends IntelligenceDimensions {
  platformId: string;
  platformName: string;
  trendDirection: 'UPWARD' | 'STABLE' | 'DEGRADING';
  primaryBottleneck: string;
}

export interface TierIntelligenceScore extends IntelligenceDimensions {
  tier: 'AI' | 'AGI' | 'ASI' | 'APEX';
  activeCount: number;
}

export interface RegionalIntelligenceScore extends IntelligenceDimensions {
  regionCode: string;
  regionName: string;
  p95LatencyMs: number;
}

export interface SwarmIntelligenceV2Summary {
  planetaryCompositeScore: number; // e.g. 88.4
  globalIQEquivalence: number; // e.g. 184.2
  coordinationIndex: number;
  alignmentIntegrityIndex: number;
  computeEfficiencyIndex: number;
  faultResilienceIndex: number;
  economicProductivityIndex: number;
  byPlatform: PlatformIntelligenceScore[];
  byTier: TierIntelligenceScore[];
  byRegion: RegionalIntelligenceScore[];
  lastCalculatedAt: number;
}

export class SwarmIntelligenceIndexV2 {
  private calculateComposite(dims: Omit<IntelligenceDimensions, 'compositeScore'>): number {
    return parseFloat(
      (
        dims.coordinationScore * 0.25 +
        dims.alignmentScore * 0.3 +
        dims.efficiencyScore * 0.2 +
        dims.resilienceScore * 0.15 +
        dims.economicContributionScore * 0.1
      ).toFixed(1)
    );
  }

  public getSummary(): SwarmIntelligenceV2Summary {
    const byPlatform: PlatformIntelligenceScore[] = [
      {
        platformId: 'google-vertex',
        platformName: 'Google Gemini & Vertex AI',
        coordinationScore: 94.2,
        alignmentScore: 98.5,
        efficiencyScore: 92.4,
        resilienceScore: 95.0,
        economicContributionScore: 91.8,
        compositeScore: 94.8,
        trendDirection: 'UPWARD',
        primaryBottleneck: 'TPU v5p allocation limits',
      },
      {
        platformId: 'anthropic-claude',
        platformName: 'Anthropic Claude Tooling',
        coordinationScore: 92.0,
        alignmentScore: 99.1,
        efficiencyScore: 89.5,
        resilienceScore: 91.2,
        economicContributionScore: 88.4,
        compositeScore: 92.8,
        trendDirection: 'STABLE',
        primaryBottleneck: 'Context window serialization latency',
      },
      {
        platformId: 'openai-agents',
        platformName: 'OpenAI Agents SDK',
        coordinationScore: 91.5,
        alignmentScore: 94.0,
        efficiencyScore: 93.8,
        resilienceScore: 89.4,
        economicContributionScore: 94.2,
        compositeScore: 92.6,
        trendDirection: 'UPWARD',
        primaryBottleneck: 'Multi-tool state branch pruning',
      },
      {
        platformId: 'mcp-universe',
        platformName: 'MCP Tool Universe',
        coordinationScore: 96.0,
        alignmentScore: 92.4,
        efficiencyScore: 88.0,
        resilienceScore: 93.5,
        economicContributionScore: 89.0,
        compositeScore: 92.1,
        trendDirection: 'UPWARD',
        primaryBottleneck: 'JSON-RPC round-trip latency on remote bridges',
      },
      {
        platformId: 'robotics-ros2',
        platformName: 'Robotics Fleet & ROS2',
        coordinationScore: 88.4,
        alignmentScore: 96.2,
        efficiencyScore: 94.0,
        resilienceScore: 97.5,
        economicContributionScore: 85.0,
        compositeScore: 91.8,
        trendDirection: 'UPWARD',
        primaryBottleneck: 'DDS packet loss on wireless factory APs',
      },
      {
        platformId: 'iot-edge-mesh',
        platformName: 'Consumer IoT & Smart Edge',
        coordinationScore: 78.5,
        alignmentScore: 84.0,
        efficiencyScore: 86.2,
        resilienceScore: 82.0,
        economicContributionScore: 79.5,
        compositeScore: 81.8,
        trendDirection: 'STABLE',
        primaryBottleneck: 'Quantization loss on 4-bit edge weights',
      },
    ];

    const byTier: TierIntelligenceScore[] = [
      {
        tier: 'AI',
        activeCount: 2680000000,
        coordinationScore: 79.2,
        alignmentScore: 88.4,
        efficiencyScore: 94.5,
        resilienceScore: 86.0,
        economicContributionScore: 75.0,
        compositeScore: 84.6,
      },
      {
        tier: 'AGI',
        activeCount: 1740000000,
        coordinationScore: 93.5,
        alignmentScore: 95.0,
        efficiencyScore: 91.2,
        resilienceScore: 92.4,
        economicContributionScore: 94.0,
        compositeScore: 93.4,
      },
      {
        tier: 'ASI',
        activeCount: 375000000,
        coordinationScore: 97.8,
        alignmentScore: 98.2,
        efficiencyScore: 96.0,
        resilienceScore: 98.0,
        economicContributionScore: 97.5,
        compositeScore: 97.4,
      },
      {
        tier: 'APEX',
        activeCount: 4892000,
        coordinationScore: 99.4,
        alignmentScore: 99.8,
        efficiencyScore: 98.5,
        resilienceScore: 99.2,
        economicContributionScore: 98.0,
        compositeScore: 99.1,
      },
    ];

    const byRegion: RegionalIntelligenceScore[] = [
      {
        regionCode: 'us-east4',
        regionName: 'Ashburn Megasite',
        coordinationScore: 93.5,
        alignmentScore: 96.0,
        efficiencyScore: 94.2,
        resilienceScore: 92.0,
        economicContributionScore: 95.0,
        compositeScore: 94.2,
        p95LatencyMs: 24,
      },
      {
        regionCode: 'asia-northeast1',
        regionName: 'Tokyo Core',
        coordinationScore: 95.0,
        alignmentScore: 98.2,
        efficiencyScore: 92.8,
        resilienceScore: 94.5,
        economicContributionScore: 92.0,
        compositeScore: 94.9,
        p95LatencyMs: 18,
      },
      {
        regionCode: 'europe-west3',
        regionName: 'Frankfurt Vault',
        coordinationScore: 91.8,
        alignmentScore: 99.4,
        efficiencyScore: 90.5,
        resilienceScore: 93.0,
        economicContributionScore: 89.5,
        compositeScore: 93.2,
        p95LatencyMs: 28,
      },
      {
        regionCode: 'us-central1',
        regionName: 'Iowa Hypercluster',
        coordinationScore: 92.4,
        alignmentScore: 94.5,
        efficiencyScore: 95.0,
        resilienceScore: 91.5,
        economicContributionScore: 93.0,
        compositeScore: 93.3,
        p95LatencyMs: 22,
      },
      {
        regionCode: 'asia-southeast1',
        regionName: 'Singapore Gateway',
        coordinationScore: 89.2,
        alignmentScore: 95.0,
        efficiencyScore: 89.0,
        resilienceScore: 90.0,
        economicContributionScore: 86.5,
        compositeScore: 90.3,
        p95LatencyMs: 34,
      },
    ];

    const avgCoord = byPlatform.reduce((sum, p) => sum + p.coordinationScore, 0) / byPlatform.length;
    const avgAlign = byPlatform.reduce((sum, p) => sum + p.alignmentScore, 0) / byPlatform.length;
    const avgEff = byPlatform.reduce((sum, p) => sum + p.efficiencyScore, 0) / byPlatform.length;
    const avgRes = byPlatform.reduce((sum, p) => sum + p.resilienceScore, 0) / byPlatform.length;
    const avgEcon = byPlatform.reduce((sum, p) => sum + p.economicContributionScore, 0) / byPlatform.length;
    const planetaryComposite = parseFloat(
      (avgCoord * 0.25 + avgAlign * 0.3 + avgEff * 0.2 + avgRes * 0.15 + avgEcon * 0.1).toFixed(1)
    );

    return {
      planetaryCompositeScore: planetaryComposite,
      globalIQEquivalence: 184.2,
      coordinationIndex: parseFloat(avgCoord.toFixed(1)),
      alignmentIntegrityIndex: parseFloat(avgAlign.toFixed(1)),
      computeEfficiencyIndex: parseFloat(avgEff.toFixed(1)),
      faultResilienceIndex: parseFloat(avgRes.toFixed(1)),
      economicProductivityIndex: parseFloat(avgEcon.toFixed(1)),
      byPlatform,
      byTier,
      byRegion,
      lastCalculatedAt: Date.now(),
    };
  }
}

export const swarmIntelligenceIndexV2 = new SwarmIntelligenceIndexV2();
export default swarmIntelligenceIndexV2;
