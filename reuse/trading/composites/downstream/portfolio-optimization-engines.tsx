/**
 * Portfolio Optimization Engines
 * Bloomberg Terminal-Level Portfolio Optimization System
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

import {
  optimizeAssetAllocation,
  performRiskParity,
  generateEfficientFrontier,
  calculateSharpeRatio,
  performMonteCarloSimulation,
  performFactorAnalysis,
  calculateTrackingError,
  calculateInformationRatio,
  optimizeRebalancing,
  performBacktest,
  analyzePerformanceAttribution,
  generateRiskReport,
  calculatePortfolioGreeks,
  performStressTest,
  calculateVaR,
  calculateCVaR,
  analyzeDrawdowns,
  calculatePortfolioBeta,
  initializeMultiAssetModels
} from '../multi-asset-portfolio-composite';

@Injectable()
export class PortfolioOptimizationService {
  async optimizeAllocation(portfolioId: string, constraints: any) {
    const optimized = await optimizeAssetAllocation(portfolioId, constraints);
    const frontier = await generateEfficientFrontier(portfolioId);
    const riskParity = await performRiskParity(portfolioId);
    const rebalancing = await optimizeRebalancing(portfolioId);
    
    return { optimized, frontier, riskParity, rebalancing };
  }

  async runSimulations(portfolioId: string, scenarios: number) {
    const monteCarlo = await performMonteCarloSimulation(portfolioId, scenarios);
    const stressTest = await performStressTest(portfolioId);
    const backtest = await performBacktest(portfolioId);
    
    return { monteCarlo, stressTest, backtest };
  }

  async calculateMetrics(portfolioId: string) {
    const sharpe = await calculateSharpeRatio(portfolioId);
    const tracking = await calculateTrackingError(portfolioId);
    const information = await calculateInformationRatio(portfolioId);
    const beta = await calculatePortfolioBeta(portfolioId);
    const greeks = await calculatePortfolioGreeks(portfolioId);
    
    return { sharpe, tracking, information, beta, greeks };
  }

  async assessRisk(portfolioId: string) {
    const var95 = await calculateVaR(portfolioId, 0.95);
    const var99 = await calculateVaR(portfolioId, 0.99);
    const cvar = await calculateCVaR(portfolioId, 0.95);
    const drawdowns = await analyzeDrawdowns(portfolioId);
    const riskReport = await generateRiskReport(portfolioId);
    
    return { var95, var99, cvar, drawdowns, report: riskReport };
  }
}

@ApiTags('portfolio-optimization')
@Controller('portfolio-optimization')
export class PortfolioOptimizationController {
  constructor(private readonly service: PortfolioOptimizationService) {}

  @Post(':portfolioId/optimize')
  @ApiOperation({ summary: 'Optimize portfolio allocation' })
  async optimize(
    @Param('portfolioId') id: string,
    @Body() constraints: any
  ) {
    return await this.service.optimizeAllocation(id, constraints);
  }

  @Post(':portfolioId/simulate')
  @ApiOperation({ summary: 'Run portfolio simulations' })
  async simulate(
    @Param('portfolioId') id: string,
    @Body() body: { scenarios: number }
  ) {
    return await this.service.runSimulations(id, body.scenarios);
  }

  @Get(':portfolioId/metrics')
  @ApiOperation({ summary: 'Calculate optimization metrics' })
  async getMetrics(@Param('portfolioId') id: string) {
    return await this.service.calculateMetrics(id);
  }

  @Get(':portfolioId/risk')
  @ApiOperation({ summary: 'Assess portfolio risk' })
  async assessRisk(@Param('portfolioId') id: string) {
    return await this.service.assessRisk(id);
  }
}

export default {
  controllers: [PortfolioOptimizationController],
  providers: [PortfolioOptimizationService]
};
