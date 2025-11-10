/**
 * Portfolio Management Systems
 * Bloomberg Terminal-Level Multi-Asset Portfolio Management System
 */

import React from 'react';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Injectable
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

// Import from both FX and Fixed Income composites
import {
  analyzeCurrencyExposure,
  calculateCrossCurrencyBasis,
  performCurrencyHedging,
  calculateFXCarryTrade,
  analyzeFXVolatility,
  calculateForwardPoints,
  performFXArbitrage,
  analyzeCurrencyCorrelation,
  calculateFXVaR,
  optimizeCurrencyOverlay,
  initializeFXModels
} from '../fx-currency-trading-composite';

import {
  analyzeBondPortfolio,
  calculateDuration,
  calculateConvexity,
  calculateYieldToMaturity,
  performCreditAnalysis,
  analyzeYieldCurve,
  calculateOAS,
  performBondAttribution,
  analyzeSpreadRisk,
  calculateKeyRateDuration,
  performScenarioAnalysis as bondScenario,
  initializeFixedIncomeModels
} from '../fixed-income-analytics-composite';

@Injectable()
export class PortfolioManagementSystemService {
  async manageMultiAssetPortfolio(portfolioId: string) {
    // FX Analysis
    const currencyExposure = await analyzeCurrencyExposure(portfolioId);
    const currencyHedging = await performCurrencyHedging(portfolioId);
    const fxVar = await calculateFXVaR(portfolioId);
    
    // Fixed Income Analysis
    const bondAnalysis = await analyzeBondPortfolio(portfolioId);
    const duration = await calculateDuration(portfolioId);
    const convexity = await calculateConvexity(portfolioId);
    const creditAnalysis = await performCreditAnalysis(portfolioId);
    
    return {
      fx: { exposure: currencyExposure, hedging: currencyHedging, var: fxVar },
      fixedIncome: { analysis: bondAnalysis, duration, convexity, credit: creditAnalysis }
    };
  }

  async optimizeCrossAsset(portfolioId: string, constraints: any) {
    const currencyOverlay = await optimizeCurrencyOverlay(portfolioId, constraints);
    const yieldCurve = await analyzeYieldCurve();
    const spreadRisk = await analyzeSpreadRisk(portfolioId);
    const bondScenarios = await bondScenario(portfolioId);
    
    return {
      currencyOptimization: currencyOverlay,
      yieldCurveAnalysis: yieldCurve,
      spreadRisk,
      scenarioAnalysis: bondScenarios
    };
  }

  async calculateRiskMetrics(portfolioId: string) {
    const fxVolatility = await analyzeFXVolatility(portfolioId);
    const keyRateDuration = await calculateKeyRateDuration(portfolioId);
    const oas = await calculateOAS(portfolioId);
    const correlation = await analyzeCurrencyCorrelation(portfolioId);
    
    return { fxVolatility, keyRateDuration, optionAdjustedSpread: oas, correlation };
  }
}

@ApiTags('portfolio-systems')
@Controller('portfolio-systems')
export class PortfolioManagementSystemController {
  constructor(private readonly service: PortfolioManagementSystemService) {}

  @Get(':portfolioId/multi-asset')
  @ApiOperation({ summary: 'Manage multi-asset portfolio' })
  async manageMultiAsset(@Param('portfolioId') id: string) {
    return await this.service.manageMultiAssetPortfolio(id);
  }

  @Post(':portfolioId/optimize-cross-asset')
  @ApiOperation({ summary: 'Optimize cross-asset allocation' })
  async optimizeCrossAsset(
    @Param('portfolioId') id: string,
    @Body() constraints: any
  ) {
    return await this.service.optimizeCrossAsset(id, constraints);
  }

  @Get(':portfolioId/risk-metrics')
  @ApiOperation({ summary: 'Calculate risk metrics' })
  async calculateRisk(@Param('portfolioId') id: string) {
    return await this.service.calculateRiskMetrics(id);
  }
}

export default {
  controllers: [PortfolioManagementSystemController],
  providers: [PortfolioManagementSystemService]
};
