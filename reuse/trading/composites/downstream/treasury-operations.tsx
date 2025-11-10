/**
 * LOC: WC-DOWN-TRADING-TREASURY-098
 */
import React from 'react';
import { Injectable, Controller, Get, Post, Body, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Injectable()
export class TreasuryOperationsService {
  private readonly logger = new Logger(TreasuryOperationsService.name);
  async getCashPosition(): Promise<any> {
    this.logger.log('Getting cash position');
    return { totalCash: 5000000, available: 4500000, reserved: 500000 };
  }
  async transferFunds(request: any): Promise<any> {
    return { transferId: 'TXN1', status: 'pending', amount: request.amount };
  }
}

@ApiTags('Treasury Operations')
@Controller('treasury')
export class TreasuryOperationsController {
  constructor(private readonly service: TreasuryOperationsService) {}
  @Get('cash-position')
  @ApiOperation({ summary: 'Get cash position' })
  async getCashPosition() {
    return await this.service.getCashPosition();
  }
  @Post('transfer')
  @ApiOperation({ summary: 'Transfer funds' })
  async transfer(@Body() request: any) {
    return await this.service.transferFunds(request);
  }
}

export const TreasuryOperationsDashboard: React.FC = () => <div><h1>Treasury Operations</h1></div>;
export { TreasuryOperationsService, TreasuryOperationsController };
