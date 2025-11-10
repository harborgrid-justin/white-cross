/**
 * LOC: WC-DOWN-TRADING-DASHBOARD-091
 */
import React from 'react';
import { Injectable, Controller, Get, Param, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Injectable()
export class TradingDeskDashboardService {
  private readonly logger = new Logger(TradingDeskDashboardService.name);
  async getDashboard(deskId: string): Promise<any> {
    this.logger.log(`Dashboard for ${deskId}`);
    return { deskId, positions: [], orders: [], pnl: 0 };
  }
}

@ApiTags('Trading Desk Dashboard')
@Controller('desk-dashboard')
export class TradingDeskDashboardController {
  constructor(private readonly service: TradingDeskDashboardService) {}
  @Get(':deskId')
  @ApiOperation({ summary: 'Get desk dashboard' })
  async getDashboard(@Param('deskId') deskId: string) {
    return await this.service.getDashboard(deskId);
  }
}

export const TradingDeskDashboardComponent: React.FC = () => <div><h1>Trading Desk Dashboard</h1></div>;
export { TradingDeskDashboardService, TradingDeskDashboardController };
