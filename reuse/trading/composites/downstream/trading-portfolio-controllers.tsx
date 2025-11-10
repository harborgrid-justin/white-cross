/**
 * LOC: WC-DOWN-TRADING-PORTFOLIO-095
 */
import React from 'react';
import { Injectable, Controller, Get, Param, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Injectable()
export class TradingPortfolioService {
  private readonly logger = new Logger(TradingPortfolioService.name);
  async getPortfolio(portfolioId: string): Promise<any> {
    this.logger.log(`Portfolio ${portfolioId}`);
    return { portfolioId, positions: [], totalValue: 1000000, pnl: 50000 };
  }
  async getPositions(portfolioId: string): Promise<any[]> {
    return [{ symbol: 'AAPL', quantity: 100, value: 15000 }];
  }
}

@ApiTags('Trading Portfolio')
@Controller('portfolio')
export class TradingPortfolioController {
  constructor(private readonly service: TradingPortfolioService) {}
  @Get(':portfolioId')
  @ApiOperation({ summary: 'Get portfolio' })
  async getPortfolio(@Param('portfolioId') portfolioId: string) {
    return await this.service.getPortfolio(portfolioId);
  }
  @Get(':portfolioId/positions')
  @ApiOperation({ summary: 'Get positions' })
  async getPositions(@Param('portfolioId') portfolioId: string) {
    return await this.service.getPositions(portfolioId);
  }
}

export const TradingPortfolioDashboard: React.FC = () => <div><h1>Trading Portfolio</h1></div>;
export { TradingPortfolioService, TradingPortfolioController };
