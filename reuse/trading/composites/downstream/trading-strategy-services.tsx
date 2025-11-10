/**
 * LOC: WC-DOWN-TRADING-STRATEGY-096
 */
import React from 'react';
import { Injectable, Controller, Get, Post, Param, Body, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Injectable()
export class TradingStrategyService {
  private readonly logger = new Logger(TradingStrategyService.name);
  async getStrategy(strategyId: string): Promise<any> {
    this.logger.log(`Strategy ${strategyId}`);
    return { strategyId, name: 'Momentum Strategy', status: 'active' };
  }
  async backtest(strategyId: string, params: any): Promise<any> {
    return { strategyId, sharpe: 1.5, return: 0.25, maxDrawdown: -0.15 };
  }
}

@ApiTags('Trading Strategy')
@Controller('strategy')
export class TradingStrategyController {
  constructor(private readonly service: TradingStrategyService) {}
  @Get(':strategyId')
  @ApiOperation({ summary: 'Get strategy' })
  async getStrategy(@Param('strategyId') strategyId: string) {
    return await this.service.getStrategy(strategyId);
  }
  @Post('backtest/:strategyId')
  @ApiOperation({ summary: 'Backtest strategy' })
  async backtest(@Param('strategyId') strategyId: string, @Body() params: any) {
    return await this.service.backtest(strategyId, params);
  }
}

export const TradingStrategyDashboard: React.FC = () => <div><h1>Trading Strategy</h1></div>;
export { TradingStrategyService, TradingStrategyController };
