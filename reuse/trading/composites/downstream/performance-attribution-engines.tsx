/**
 * Performance Attribution Engines
 * Bloomberg Terminal-Level Performance Attribution and Analysis
 */

import React from 'react';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Injectable
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

import {
  calculateDailyPnL,
  calculateRealizedPnL,
  calculateUnrealizedPnL,
  performFactorAttribution,
  analyzeSectorAttribution,
  calculateSecurityAttribution,
  performBrinsonAttribution,
  analyzeTimingContribution,
  calculateSelectionEffect,
  analyzeInteractionEffect,
  performRiskAttribution,
  calculateActiveReturn,
  analyzeTrackingContribution,
  calculateInformationCoefficient,
  performStyleAttribution,
  analyzeCurrencyAttribution,
  calculateTransactionCosts,
  analyzeSlippageImpact,
  performMultiPeriodAttribution,
  generateAttributionReport,
  calculateMWRR,
  calculateTWRR,
  initializePnLModels
} from '../pnl-calculation-attribution-composite';

@Injectable()
export class PerformanceAttributionService {
  async calculatePerformance(portfolioId: string, startDate: Date, endDate: Date) {
    const dailyPnl = await calculateDailyPnL(portfolioId, startDate, endDate);
    const realizedPnl = await calculateRealizedPnL(portfolioId, startDate, endDate);
    const unrealizedPnl = await calculateUnrealizedPnL(portfolioId, endDate);
    const mwrr = await calculateMWRR(portfolioId, startDate, endDate);
    const twrr = await calculateTWRR(portfolioId, startDate, endDate);
    
    return {
      dailyPnl,
      realizedPnl,
      unrealizedPnl,
      moneyWeightedReturn: mwrr,
      timeWeightedReturn: twrr
    };
  }

  async performAttribution(portfolioId: string, benchmarkId: string) {
    const factorAttribution = await performFactorAttribution(portfolioId, benchmarkId);
    const sectorAttribution = await analyzeSectorAttribution(portfolioId, benchmarkId);
    const securityAttribution = await calculateSecurityAttribution(portfolioId, benchmarkId);
    const brinsonAttribution = await performBrinsonAttribution(portfolioId, benchmarkId);
    
    return {
      factor: factorAttribution,
      sector: sectorAttribution,
      security: securityAttribution,
      brinson: brinsonAttribution
    };
  }

  async analyzeContributions(portfolioId: string) {
    const timing = await analyzeTimingContribution(portfolioId);
    const selection = await calculateSelectionEffect(portfolioId);
    const interaction = await analyzeInteractionEffect(portfolioId);
    const activeReturn = await calculateActiveReturn(portfolioId);
    
    return { timing, selection, interaction, activeReturn };
  }
}

@ApiTags('performance-attribution')
@Controller('performance')
export class PerformanceAttributionController {
  constructor(private readonly service: PerformanceAttributionService) {}

  @Get(':portfolioId/calculate')
  @ApiOperation({ summary: 'Calculate performance metrics' })
  async calculatePerformance(
    @Param('portfolioId') id: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string
  ) {
    return await this.service.calculatePerformance(
      id,
      new Date(startDate),
      new Date(endDate)
    );
  }

  @Post(':portfolioId/attribution')
  @ApiOperation({ summary: 'Perform attribution analysis' })
  async performAttribution(
    @Param('portfolioId') id: string,
    @Body() body: { benchmarkId: string }
  ) {
    return await this.service.performAttribution(id, body.benchmarkId);
  }

  @Get(':portfolioId/contributions')
  @ApiOperation({ summary: 'Analyze performance contributions' })
  async analyzeContributions(@Param('portfolioId') id: string) {
    return await this.service.analyzeContributions(id);
  }
}

export default {
  controllers: [PerformanceAttributionController],
  providers: [PerformanceAttributionService]
};
