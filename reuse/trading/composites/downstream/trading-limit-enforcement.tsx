/**
 * LOC: WC-DOWN-TRADING-LIMIT-094
 */
import React from 'react';
import { Injectable, Controller, Get, Post, Param, Body, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Injectable()
export class TradingLimitEnforcementService {
  private readonly logger = new Logger(TradingLimitEnforcementService.name);
  async checkLimit(traderId: string, symbol: string, quantity: number): Promise<{ allowed: boolean }> {
    this.logger.log(`Checking limit for ${traderId}`);
    return { allowed: true };
  }
  async getLimits(traderId: string): Promise<any[]> {
    return [{ limitType: 'position', value: 1000000, used: 500000 }];
  }
}

@ApiTags('Trading Limit Enforcement')
@Controller('limit-enforcement')
export class TradingLimitEnforcementController {
  constructor(private readonly service: TradingLimitEnforcementService) {}
  @Post('check')
  @ApiOperation({ summary: 'Check trading limit' })
  async check(@Body() body: any) {
    return await this.service.checkLimit(body.traderId, body.symbol, body.quantity);
  }
  @Get('limits/:traderId')
  @ApiOperation({ summary: 'Get trader limits' })
  async getLimits(@Param('traderId') traderId: string) {
    return await this.service.getLimits(traderId);
  }
}

export const TradingLimitEnforcementDashboard: React.FC = () => <div><h1>Trading Limit Enforcement</h1></div>;
export { TradingLimitEnforcementService, TradingLimitEnforcementController };
