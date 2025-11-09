/**
 * LOC: RISKSCORE001
 * File: /reuse/threat/composites/downstream/risk-scoring-engines.ts
 *
 * UPSTREAM (imports from):
 *   - ../behavioral-analytics-composite
 */

import { Injectable, Controller, Post, Get, Body, Param, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsObject, IsArray, Min, Max } from 'class-validator';

export class CalculateRiskScoreDto {
  @ApiProperty() @IsString() entityId: string;
  @ApiProperty() @IsString() entityType: string;
  @ApiProperty() @IsObject() factors: Record<string, number>;
  @ApiProperty() @IsArray() contextTags: string[];
}

@Injectable()
export class RiskScoringEngineService {
  private readonly logger = new Logger(RiskScoringEngineService.name);

  async calculateRiskScore(dto: CalculateRiskScoreDto): Promise<any> {
    this.logger.log(`Calculating risk score for ${dto.entityType}: ${dto.entityId}`);

    const baseScore = Object.values(dto.factors).reduce((sum, val) => sum + val, 0) / Object.keys(dto.factors).length;
    const contextMultiplier = this.getContextMultiplier(dto.contextTags);
    const finalScore = Math.min(100, baseScore * contextMultiplier);

    return {
      scoreId: `SCORE-${Date.now()}`,
      entityId: dto.entityId,
      entityType: dto.entityType,
      baseScore,
      contextMultiplier,
      finalScore,
      severity: this.determineSeverity(finalScore),
      factors: dto.factors,
      breakdown: this.generateScoreBreakdown(dto.factors),
      calculatedAt: new Date(),
    };
  }

  async aggregateRiskScores(entityIds: string[]): Promise<any> {
    const scores = entityIds.map(id => ({
      entityId: id,
      score: Math.random() * 100,
    }));

    return {
      totalEntities: entityIds.length,
      averageScore: scores.reduce((sum, s) => sum + s.score, 0) / scores.length,
      highRiskCount: scores.filter(s => s.score >= 70).length,
      scores,
    };
  }

  async compareRiskScores(entityId1: string, entityId2: string): Promise<any> {
    return {
      entity1: { id: entityId1, score: 65, severity: 'MEDIUM' },
      entity2: { id: entityId2, score: 82, severity: 'HIGH' },
      difference: 17,
      recommendation: 'Prioritize entity2 for remediation',
    };
  }

  private getContextMultiplier(tags: string[]): number {
    let multiplier = 1.0;
    if (tags.includes('PHI_ACCESS')) multiplier *= 1.3;
    if (tags.includes('ADMIN_PRIVILEGES')) multiplier *= 1.2;
    if (tags.includes('EXTERNAL_FACING')) multiplier *= 1.15;
    return multiplier;
  }

  private determineSeverity(score: number): string {
    if (score >= 80) return 'CRITICAL';
    if (score >= 60) return 'HIGH';
    if (score >= 40) return 'MEDIUM';
    return 'LOW';
  }

  private generateScoreBreakdown(factors: Record<string, number>): any[] {
    return Object.entries(factors).map(([name, value]) => ({
      factor: name,
      value,
      contribution: (value / 100) * 100,
    }));
  }
}

@ApiTags('Risk Scoring Engine')
@Controller('api/v1/risk-scoring')
@ApiBearerAuth()
export class RiskScoringEngineController {
  constructor(private readonly service: RiskScoringEngineService) {}

  @Post('calculate')
  @ApiOperation({ summary: 'Calculate risk score' })
  @ApiResponse({ status: 200, description: 'Score calculated' })
  async calculate(@Body() dto: CalculateRiskScoreDto) {
    return this.service.calculateRiskScore(dto);
  }

  @Post('aggregate')
  @ApiOperation({ summary: 'Aggregate risk scores' })
  async aggregate(@Body('entityIds') entityIds: string[]) {
    return this.service.aggregateRiskScores(entityIds);
  }

  @Get('compare/:id1/:id2')
  @ApiOperation({ summary: 'Compare risk scores' })
  async compare(@Param('id1') id1: string, @Param('id2') id2: string) {
    return this.service.compareRiskScores(id1, id2);
  }
}

export default { service: RiskScoringEngineService, controller: RiskScoringEngineController };
