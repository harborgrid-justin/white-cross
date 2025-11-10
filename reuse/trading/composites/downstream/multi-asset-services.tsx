/**
 * Multi-Asset Services
 * Bloomberg Terminal-Level Multi-Asset Portfolio Management Services
 */

import React from 'react';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Logger,
  HttpException,
  HttpStatus,
  Injectable
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiProperty
} from '@nestjs/swagger';

import {
  createMultiAssetPortfolio,
  optimizeAssetAllocation,
  calculateCorrelations,
  performRiskParity,
  calculateSharpeRatio,
  calculateSortino,
  performMonteCarloSimulation,
  generateEfficientFrontier,
  calculatePortfolioBeta,
  performFactorAnalysis,
  calculateTrackingError,
  analyzeDrawdowns,
  performStressTest,
  calculateVaR,
  calculateCVaR,
  optimizeRebalancing,
  performBacktest,
  calculateInformationRatio,
  analyzePerformanceAttribution,
  generateRiskReport,
  calculatePortfolioGreeks,
  initializeMultiAssetModels
} from '../multi-asset-portfolio-composite';

export class MultiAssetPortfolioDto {
  @ApiProperty()
  portfolioId: string;
  
  @ApiProperty()
  assets: Array<{
    assetClass: string;
    symbol: string;
    weight: number;
    value: number;
  }>;
  
  @ApiProperty()
  metrics: {
    totalValue: number;
    sharpeRatio: number;
    volatility: number;
    expectedReturn: number;
  };
}

@Injectable()
export class MultiAssetService {
  private readonly logger = new Logger(MultiAssetService.name);

  async createPortfolio(assets: any[]): Promise<MultiAssetPortfolioDto> {
    const portfolio = await createMultiAssetPortfolio(assets);
    const sharpe = await calculateSharpeRatio(portfolio.id);
    
    return {
      portfolioId: portfolio.id,
      assets: portfolio.assets,
      metrics: {
        totalValue: portfolio.totalValue,
        sharpeRatio: sharpe,
        volatility: portfolio.volatility,
        expectedReturn: portfolio.expectedReturn
      }
    };
  }

  async optimizePortfolio(portfolioId: string, constraints: any): Promise<any> {
    const optimized = await optimizeAssetAllocation(portfolioId, constraints);
    const frontier = await generateEfficientFrontier(portfolioId);
    
    return {
      optimizedWeights: optimized,
      efficientFrontier: frontier
    };
  }

  async analyzeRisk(portfolioId: string): Promise<any> {
    const var95 = await calculateVaR(portfolioId, 0.95);
    const cvar = await calculateCVaR(portfolioId, 0.95);
    const drawdowns = await analyzeDrawdowns(portfolioId);
    const stressTest = await performStressTest(portfolioId);
    
    return { var95, cvar, drawdowns, stressTest };
  }
}

@ApiTags('multi-asset')
@Controller('multi-asset')
export class MultiAssetController {
  constructor(private readonly service: MultiAssetService) {}

  @Post('portfolio')
  @ApiOperation({ summary: 'Create multi-asset portfolio' })
  async createPortfolio(@Body() body: { assets: any[] }) {
    return await this.service.createPortfolio(body.assets);
  }

  @Post('optimize/:portfolioId')
  @ApiOperation({ summary: 'Optimize portfolio allocation' })
  async optimize(@Param('portfolioId') id: string, @Body() constraints: any) {
    return await this.service.optimizePortfolio(id, constraints);
  }

  @Get('risk/:portfolioId')
  @ApiOperation({ summary: 'Analyze portfolio risk' })
  async analyzeRisk(@Param('portfolioId') id: string) {
    return await this.service.analyzeRisk(id);
  }
}

export default {
  controllers: [MultiAssetController],
  providers: [MultiAssetService]
};
