/**
 * LOC: WC-DOWN-TRADING-DESK-090
 */
import React from 'react';
import { Injectable, Controller, Get, Param, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Injectable()
export class TradingDeskAnalyticsService {
  private readonly logger = new Logger(TradingDeskAnalyticsService.name);
  async getDeskMetrics(deskId: string): Promise<any> {
    this.logger.log(`Desk metrics for ${deskId}`);
    return { deskId, pnl: 125000, volume: 5000000, trades: 150 };
  }
  async getTraderPerformance(traderId: string): Promise<any> {
    return { traderId, pnl: 25000, winRate: 0.65, sharpe: 1.8 };
  }
}

@ApiTags('Trading Desk Analytics')
@Controller('desk-analytics')
export class TradingDeskAnalyticsController {
  constructor(private readonly service: TradingDeskAnalyticsService) {}
  @Get('desk/:id')
  @ApiOperation({ summary: 'Get desk metrics' })
  async getDeskMetrics(@Param('id') id: string) {
    return await this.service.getDeskMetrics(id);
  }
  @Get('trader/:id')
  @ApiOperation({ summary: 'Get trader performance' })
  async getTraderPerformance(@Param('id') id: string) {
    return await this.service.getTraderPerformance(id);
  }
}

export const TradingDeskAnalyticsDashboard: React.FC = () => <div><h1>Trading Desk Analytics</h1></div>;
export { TradingDeskAnalyticsService, TradingDeskAnalyticsController };
