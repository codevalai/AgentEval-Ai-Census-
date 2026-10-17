/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  PlanetaryAgentRecord,
  CapabilityTierKey,
  AgentStatus,
  AgentEra,
  RegisteredAgentInput,
  TombstoneInput,
} from '../types/census.ts';
import { ALL_PLANETARY_AGENTS } from '../data/planetaryDirectory.ts';
import {
  sovereignEventFabric,
  sovereignAuditSpine,
  generateMerkleLeaf,
  generateTombstoneProof,
  calculateHash,
} from './merkleSpine.ts';

export interface AgentFilterParams {
  query?: string;
  tier?: CapabilityTierKey | 'ALL';
  status?: AgentStatus | 'ALL';
  era?: AgentEra | 'ALL';
  platform?: string | 'ALL';
}

export class PlanetaryCensusRegistry {
  private agents: PlanetaryAgentRecord[] = [];

  constructor() {
    this.agents = [...ALL_PLANETARY_AGENTS];
  }

  public getAll(): ReadonlyArray<PlanetaryAgentRecord> {
    return [...this.agents];
  }

  public getById(id: string): PlanetaryAgentRecord | undefined {
    return this.agents.find((a) => a.id === id);
  }

  public filterAgents(params: AgentFilterParams): PlanetaryAgentRecord[] {
    return this.agents.filter((agent) => {
      if (params.tier && params.tier !== 'ALL' && agent.tier !== params.tier) {
        return false;
      }
      if (params.status && params.status !== 'ALL' && agent.status !== params.status) {
        return false;
      }
      if (params.era && params.era !== 'ALL' && agent.era !== params.era) {
        return false;
      }
      if (params.platform && params.platform !== 'ALL' && agent.platform !== params.platform) {
        return false;
      }
      if (params.query && params.query.trim()) {
        const q = params.query.toLowerCase();
        const matchesName = agent.name.toLowerCase().includes(q);
        const matchesId = agent.id.toLowerCase().includes(q);
        const matchesPlatform = agent.platform.toLowerCase().includes(q);
        const matchesCity = agent.regionCity.toLowerCase().includes(q);
        const matchesDomain = agent.domain.toLowerCase().includes(q);
        const matchesArchetype = agent.archetype.toLowerCase().includes(q);
        if (!matchesName && !matchesId && !matchesPlatform && !matchesCity && !matchesDomain && !matchesArchetype) {
          return false;
        }
      }
      return true;
    });
  }

  public registerAgent(input: RegisteredAgentInput): PlanetaryAgentRecord {
    const sequence = this.agents.length + 1;
    const agentId = `AGT-2026-REG-${sequence.toString().padStart(4, '0')}`;
    const now = new Date().toISOString();

    const { leafHash } = generateMerkleLeaf('AGENT_REGISTRATION', agentId, {
      name: input.name,
      tier: input.tier,
      region: input.region,
      domain: input.intendedDomain,
    });

    const pqcKey = input.publicKey.trim() || `0xML_KEM_1024_AUTO_${calculateHash(agentId).slice(2, 18)}`;

    const newAgent: PlanetaryAgentRecord = {
      id: agentId,
      name: input.name,
      platform: 'Google AI Studio Agents',
      archetype: input.archetype,
      tier: input.tier,
      regionCity: input.region,
      jurisdictionIso3166: input.jurisdiction || 'Sovereign Cleanroom Enclave',
      flag: '🌐',
      era: '2024_2026_MCP_SWARMS',
      status: 'ACTIVE',
      createdAt: now,
      pqcKey,
      merkleLeafHash: leafHash,
      lineageParent: 'Cod3Eval Sovereign Sentinel-X1',
      genome: {
        reasoning: 88,
        autonomy: 84,
        toolUse: 90,
        safetyPqc: 95,
        domainDepth: 86,
        swarmCoord: 89,
      },
      domain: input.intendedDomain || 'Autonomous Planetary Orchestration',
      mcpTools: ['mcp_stdio_relay', 'smt_sat_verifier', 'merkle_anchor_commit'],
      estimatedInstancesCount: 1,
    };

    this.agents.unshift(newAgent);

    // Emit event and anchor to spine
    const evt = sovereignEventFabric.emit('AGENT_VOLUNTARY_REGISTERED', 'REGISTRY_PORTAL', {
      agentId,
      name: newAgent.name,
      tier: newAgent.tier,
      regionCity: newAgent.regionCity,
      merkleLeafHash: leafHash,
    });
    sovereignAuditSpine.appendAnchor(evt.eventId, 'REGISTRAR', newAgent.regionCity, leafHash);

    return newAgent;
  }

  public tombstoneAgent(input: TombstoneInput): { success: boolean; tombstoneLeaf: string; nullifierRoot: string } {
    const { tombstoneLeaf, nullifierRoot } = generateTombstoneProof(
      input.agentOrDatasetId,
      input.legalFramework,
      input.reason
    );

    const agentIndex = this.agents.findIndex((a) => a.id === input.agentOrDatasetId);
    if (agentIndex !== -1) {
      this.agents[agentIndex] = {
        ...this.agents[agentIndex],
        status: 'TOMBSTONED',
        tombstoneReason: `${input.legalFramework}: ${input.reason} (Nullifier: ${nullifierRoot.slice(0, 16)}...)`,
        pqcKey: '0xNULLIFIED_BY_TOMBSTONE_WITNESS',
      };
    }

    const evt = sovereignEventFabric.emit('AGENT_TOMBSTONED', 'LEGAL_COMPLIANCE_OPERATOR', {
      targetId: input.agentOrDatasetId,
      legalFramework: input.legalFramework,
      tombstoneLeaf,
      nullifierRoot,
    });
    sovereignAuditSpine.appendAnchor(evt.eventId, 'TOMBSTONE_ENGINE', 'Tokyo Core', tombstoneLeaf);

    return {
      success: true,
      tombstoneLeaf,
      nullifierRoot,
    };
  }

  public getStatsSummary() {
    const total = this.agents.length;
    const byTier: Record<string, number> = { AI: 0, AGI: 0, ASI: 0, APEX: 0 };
    const byStatus: Record<string, number> = {};
    const byEra: Record<string, number> = {};

    let avgReasoning = 0;
    let avgAutonomy = 0;

    for (const a of this.agents) {
      byTier[a.tier] = (byTier[a.tier] || 0) + 1;
      byStatus[a.status] = (byStatus[a.status] || 0) + 1;
      byEra[a.era] = (byEra[a.era] || 0) + 1;
      avgReasoning += a.genome.reasoning;
      avgAutonomy += a.genome.autonomy;
    }

    return {
      total,
      byTier,
      byStatus,
      byEra,
      avgReasoning: total ? Math.round(avgReasoning / total) : 0,
      avgAutonomy: total ? Math.round(avgAutonomy / total) : 0,
    };
  }
}

export const planetaryCensusRegistry = new PlanetaryCensusRegistry();
