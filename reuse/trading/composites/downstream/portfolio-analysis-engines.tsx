/**
 * Portfolio Analysis Engines
 * Bloomberg Terminal-Level Portfolio Analysis and Backtesting
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
  BacktestConfig,
  BacktestResult,
  createBacktest,
  runBacktest,
  analyzeBacktestResults,
  calculatePerformanceMetrics,
  performWalkForwardAnalysis,
  optimizeStrategyParameters,
  performMonteCarloBacktest,
  analyzeDrawdowns,
  calculateMaxDrawdown,
  performSensitivityAnalysis,
  generateEquityCurve,
  analyzeRollingPerformance,
  performOutOfSampleTest,
  calculateRiskAdjustedReturns,
  analyzeTradingCosts,
  performRobustnessTest,
  generateBacktestReport,
  compareStrategies,
  performCrossValidation,
  analyzeMarketRegimes,
  calculateHitRate,
  initializeBacktestingModels
} from '../strategy-backtesting-composite';

@Injectable()
export class PortfolioAnalysisService {
  async runBacktestAnalysis(config: BacktestConfig): Promise<BacktestResult> {
    const backtest = await createBacktest(config);
    const result = await runBacktest(backtest.id);
    const analysis = await analyzeBacktestResults(result);
    const metrics = await calculatePerformanceMetrics(result);
    
    return {
      ...result,
      analysis,
      metrics
    };
  }

  async optimizeStrategy(strategyId: string, parameters: any) {
    const optimized = await optimizeStrategyParameters(strategyId, parameters);
    const walkForward = await performWalkForwardAnalysis(strategyId);
    const monteCarlo = await performMonteCarloBacktest(strategyId);
    
    return { optimized, walkForward, monteCarlo };
  }

  async analyzeRisk(portfolioId: string) {
    const drawdowns = await analyzeDrawdowns(portfolioId);
    const maxDrawdown = await calculateMaxDrawdown(portfolioId);
    const riskAdjusted = await calculateRiskAdjustedReturns(portfolioId);
    const sensitivity = await performSensitivityAnalysis(portfolioId);
    
    return { drawdowns, maxDrawdown, riskAdjusted, sensitivity };
  }
}

@ApiTags('portfolio-analysis')
@Controller('portfolio-analysis')
export class PortfolioAnalysisController {
  constructor(private readonly service: PortfolioAnalysisService) {}

  @Post('backtest')
  @ApiOperation({ summary: 'Run portfolio backtest' })
  async runBacktest(@Body() config: BacktestConfig) {
    return await this.service.runBacktestAnalysis(config);
  }

  @Post('optimize/:strategyId')
  @ApiOperation({ summary: 'Optimize strategy' })
  async optimizeStrategy(
    @Param('strategyId') id: string,
    @Body() parameters: any
  ) {
    return await this.service.optimizeStrategy(id, parameters);
  }

  @Get('risk/:portfolioId')
  @ApiOperation({ summary: 'Analyze portfolio risk' })
  async analyzeRisk(@Param('portfolioId') id: string) {
    return await this.service.analyzeRisk(id);
  }
}

export default {
  controllers: [PortfolioAnalysisController],
  providers: [PortfolioAnalysisService]
};
