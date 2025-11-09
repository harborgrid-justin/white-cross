/**
 * LOC: ROITRACK001
 * File: /reuse/threat/composites/downstream/roi-tracking-services.ts
 *
 * UPSTREAM (imports from):
 *   - ../threat-metrics-analytics-composite
 *   - @nestjs/common
 */

import { Injectable, Controller, Post, Get, Body, Param, Query, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsDate, IsOptional } from 'class-validator';

export class TrackInvestmentDto {
  @ApiProperty() @IsString() investmentCategory: string;
  @ApiProperty() @IsNumber() amount: number;
  @ApiProperty() @IsString() description: string;
  @ApiProperty() @IsDate() @IsOptional() date?: Date;
}

export class CalculateROIDto {
  @ApiProperty() @IsString() investmentId: string;
  @ApiProperty() @IsNumber() timeframeMonths: number;
}

@Injectable()
export class ROITrackingService {
  private readonly logger = new Logger(ROITrackingService.name);

  async trackInvestment(dto: TrackInvestmentDto): Promise<any> {
    this.logger.log(`Tracking security investment: ${dto.investmentCategory}`);

    return {
      investmentId: `INV-${Date.now()}`,
      category: dto.investmentCategory,
      amount: dto.amount,
      description: dto.description,
      date: dto.date || new Date(),
      status: 'ACTIVE',
      expectedROI: this.calculateExpectedROI(dto.investmentCategory, dto.amount),
    };
  }

  async calculateROI(dto: CalculateROIDto): Promise<any> {
    this.logger.log(`Calculating ROI for investment: ${dto.investmentId}`);

    const investment = 100000; // Mock
    const threatsPrevent = 25;
    const avgThreatCost = 50000;
    const costAvoidance = threatsPrevent * avgThreatCost;
    const roi = ((costAvoidance - investment) / investment) * 100;

    return {
      investmentId: dto.investmentId,
      timeframe: dto.timeframeMonths,
      totalInvestment: investment,
      threatsPrevent,
      averageThreatCost: avgThreatCost,
      totalCostAvoidance: costAvoidance,
      roiPercentage: roi,
      paybackPeriod: this.calculatePaybackPeriod(investment, costAvoidance / dto.timeframeMonths),
      recommendations: this.generateROIRecommendations(roi),
      calculatedAt: new Date(),
    };
  }

  async generateROIDashboard(timeRange: number): Promise<any> {
    this.logger.log(`Generating ROI dashboard for ${timeRange} months`);

    return {
      timeRange,
      totalInvestment: 500000,
      totalCostAvoidance: 2000000,
      overallROI: 300,
      investmentBreakdown: [
        { category: 'THREAT_DETECTION', amount: 200000, roi: 350 },
        { category: 'INCIDENT_RESPONSE', amount: 150000, roi: 280 },
        { category: 'SECURITY_TRAINING', amount: 100000, roi: 250 },
        { category: 'COMPLIANCE', amount: 50000, roi: 200 },
      ],
      metrics: {
        threatsBlocked: 125,
        incidentsAvoided: 15,
        complianceViolationsPrevented: 8,
        downtimePrevented: 240, // hours
      },
      trends: { direction: 'IMPROVING', growth: 0.15 },
      generatedAt: new Date(),
    };
  }

  private calculateExpectedROI(category: string, amount: number): number {
    const roiMultipliers: Record<string, number> = {
      THREAT_DETECTION: 3.5,
      INCIDENT_RESPONSE: 2.8,
      SECURITY_TRAINING: 2.5,
      COMPLIANCE: 2.0,
    };
    return (roiMultipliers[category] || 2.0) * 100;
  }

  private calculatePaybackPeriod(investment: number, monthlyReturn: number): number {
    return Math.ceil(investment / monthlyReturn);
  }

  private generateROIRecommendations(roi: number): string[] {
    if (roi >= 200) {
      return ['Excellent ROI - continue investment', 'Consider expanding program'];
    } else if (roi >= 100) {
      return ['Good ROI - maintain current investment', 'Look for optimization opportunities'];
    } else {
      return ['ROI below target - review effectiveness', 'Consider alternative approaches'];
    }
  }
}

@ApiTags('ROI Tracking')
@Controller('api/v1/roi')
@ApiBearerAuth()
export class ROITrackingController {
  constructor(private readonly service: ROITrackingService) {}

  @Post('investments/track')
  @ApiOperation({ summary: 'Track security investment' })
  @ApiResponse({ status: 201, description: 'Investment tracked' })
  async track(@Body() dto: TrackInvestmentDto) {
    return this.service.trackInvestment(dto);
  }

  @Post('calculate')
  @ApiOperation({ summary: 'Calculate ROI' })
  @ApiResponse({ status: 200, description: 'ROI calculated' })
  async calculate(@Body() dto: CalculateROIDto) {
    return this.service.calculateROI(dto);
  }

  @Get('dashboard')
  @ApiOperation({ summary: 'Get ROI dashboard' })
  @ApiResponse({ status: 200, description: 'Dashboard generated' })
  async dashboard(@Query('timeRange') timeRange: number = 12) {
    return this.service.generateROIDashboard(timeRange);
  }
}

export default { service: ROITrackingService, controller: ROITrackingController };
