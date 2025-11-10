/**
 * Portfolio Management Controllers
 * Bloomberg Terminal-Level Portfolio Management System
 */

import React from 'react';
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Injectable
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

import {
  Portfolio,
  PortfolioMetrics,
  createPortfolio,
  updatePortfolio,
  calculatePortfolioMetrics,
  performRebalancing,
  optimizePortfolio,
  calculateRiskMetrics,
  generatePerformanceReport,
  analyzePortfolioExposure,
  performScenarioAnalysis,
  calculateLiquidityMetrics,
  monitorPortfolioLimits,
  performComplianceCheck,
  generatePortfolioSnapshot,
  calculateAttributionAnalysis,
  performPortfolioStressTest,
  analyzeFactorExposures,
  calculatePortfolioCorrelation,
  optimizeTaxEfficiency,
  performPortfolioReview,
  generateClientReport,
  trackPortfolioChanges,
  initializePortfolioModels
} from '../portfolio-analytics-composite';

@Injectable()
export class PortfolioManagementService {
  async createNewPortfolio(portfolioData: any) {
    const portfolio = await createPortfolio(portfolioData);
    const metrics = await calculatePortfolioMetrics(portfolio.id);
    const risk = await calculateRiskMetrics(portfolio.id);
    
    return { portfolio, metrics, risk };
  }

  async updateExistingPortfolio(portfolioId: string, updates: any) {
    const updated = await updatePortfolio(portfolioId, updates);
    const compliance = await performComplianceCheck(portfolioId);
    const limits = await monitorPortfolioLimits(portfolioId);
    
    return { updated, compliance, limits };
  }

  async rebalancePortfolio(portfolioId: string, strategy: any) {
    const rebalanced = await performRebalancing(portfolioId, strategy);
    const optimized = await optimizePortfolio(portfolioId);
    const taxOptimized = await optimizeTaxEfficiency(portfolioId);
    
    return { rebalanced, optimized, taxOptimized };
  }

  async analyzePortfolio(portfolioId: string) {
    const exposure = await analyzePortfolioExposure(portfolioId);
    const factors = await analyzeFactorExposures(portfolioId);
    const scenario = await performScenarioAnalysis(portfolioId);
    const stress = await performPortfolioStressTest(portfolioId);
    
    return { exposure, factors, scenario, stress };
  }
}

@ApiTags('portfolio-management')
@Controller('portfolio-management')
export class PortfolioManagementController {
  constructor(private readonly service: PortfolioManagementService) {}

  @Post()
  @ApiOperation({ summary: 'Create new portfolio' })
  async createPortfolio(@Body() portfolioData: any) {
    return await this.service.createNewPortfolio(portfolioData);
  }

  @Put(':portfolioId')
  @ApiOperation({ summary: 'Update portfolio' })
  async updatePortfolio(
    @Param('portfolioId') id: string,
    @Body() updates: any
  ) {
    return await this.service.updateExistingPortfolio(id, updates);
  }

  @Post(':portfolioId/rebalance')
  @ApiOperation({ summary: 'Rebalance portfolio' })
  async rebalance(
    @Param('portfolioId') id: string,
    @Body() strategy: any
  ) {
    return await this.service.rebalancePortfolio(id, strategy);
  }

  @Get(':portfolioId/analysis')
  @ApiOperation({ summary: 'Analyze portfolio' })
  async analyze(@Param('portfolioId') id: string) {
    return await this.service.analyzePortfolio(id);
  }
}

export default {
  controllers: [PortfolioManagementController],
  providers: [PortfolioManagementService]
};
