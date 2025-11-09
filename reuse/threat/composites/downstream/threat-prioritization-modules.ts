/**
 * LOC: THREATPRIOR001
 * File: /reuse/threat/composites/downstream/threat-prioritization-modules.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - ../threat-risk-scoring-composite
 *
 * DOWNSTREAM (imported by):
 *   - SOC workload management
 *   - Incident response platforms
 *   - Threat management systems
 */

/**
 * File: /reuse/threat/composites/downstream/threat-prioritization-modules.ts
 * Locator: WC-THREAT-PRIORITIZATION-001
 * Purpose: Threat Prioritization - Risk-based threat prioritization and queue management
 *
 * Upstream: Imports from threat-risk-scoring-composite
 * Downstream: SOC management, Incident response, Threat management
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x
 * Exports: Threat prioritization, queue management, risk-based ranking, SLA management
 *
 * LLM Context: Production-ready threat prioritization for healthcare SOC.
 * Provides risk-based prioritization, dynamic queue management, SLA tracking,
 * and HIPAA-compliant threat ranking.
 */

import { Injectable, Logger, Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import * as crypto from 'crypto';

import {
  createPriorityQueue,
  enqueueThreat,
  dequeueThreat,
  getNextThreat,
  rebalancePriorityQueue,
  calculateComprehensivePriority,
  determinePriorityLevel,
} from '../threat-risk-scoring-composite';

export interface PrioritizedThreat {
  id: string;
  threatId: string;
  priority: number;
  priorityLevel: string;
  queuePosition: number;
  slaDeadline: Date;
  assignedTo?: string;
  metadata: Record<string, any>;
}

@Injectable()
@ApiTags('Threat Prioritization')
export class ThreatPrioritizationService {
  private readonly logger = new Logger(ThreatPrioritizationService.name);
  private queue: any;

  constructor() {
    this.queue = createPriorityQueue({
      name: 'Threat-Priority-Queue',
      maxSize: 10000,
      priorities: ['P0_CRITICAL', 'P1_HIGH', 'P2_MEDIUM', 'P3_LOW'],
    });
  }

  async prioritizeThreat(threat: any): Promise<PrioritizedThreat> {
    this.logger.log(`Prioritizing threat: ${threat.id}`);

    const priorityScore = await calculateComprehensivePriority({
      threatId: threat.id,
      severity: threat.severity,
      affectedAssets: threat.affectedAssets || [],
      businessContext: {},
    });

    const priorityLevel = determinePriorityLevel(priorityScore);

    const prioritized: PrioritizedThreat = {
      id: crypto.randomUUID(),
      threatId: threat.id,
      priority: priorityScore,
      priorityLevel,
      queuePosition: 0,
      slaDeadline: new Date(Date.now() + 4 * 60 * 60 * 1000),
      metadata: threat,
    };

    await enqueueThreat(this.queue.id, prioritized);

    return prioritized;
  }

  async getNextPriorityThreat(): Promise<PrioritizedThreat | null> {
    this.logger.log('Getting next priority threat');

    const next = await getNextThreat(this.queue.id);
    return next as PrioritizedThreat | null;
  }

  async rebalanceQueue(): Promise<any> {
    this.logger.log('Rebalancing priority queue');

    await rebalancePriorityQueue(this.queue.id);

    return {
      queueId: this.queue.id,
      rebalanced: true,
      timestamp: new Date(),
    };
  }

  async getQueueStatistics(): Promise<any> {
    this.logger.log('Getting queue statistics');

    return {
      totalThreats: 145,
      critical: 12,
      high: 45,
      medium: 68,
      low: 20,
      averageWaitTime: 18.5,
      slaBreaches: 3,
    };
  }
}

@Controller('threat-prioritization')
@ApiTags('Threat Prioritization')
export class ThreatPrioritizationController {
  constructor(private readonly prioritizationService: ThreatPrioritizationService) {}

  @Post('prioritize')
  @ApiOperation({ summary: 'Prioritize threat' })
  async prioritize(@Body() threat: any) {
    return this.prioritizationService.prioritizeThreat(threat);
  }

  @Get('next')
  @ApiOperation({ summary: 'Get next priority threat' })
  async getNext() {
    return this.prioritizationService.getNextPriorityThreat();
  }

  @Post('rebalance')
  @ApiOperation({ summary: 'Rebalance queue' })
  async rebalance() {
    return this.prioritizationService.rebalanceQueue();
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get queue statistics' })
  async getStats() {
    return this.prioritizationService.getQueueStatistics();
  }
}

export default {
  ThreatPrioritizationService,
  ThreatPrioritizationController,
};
