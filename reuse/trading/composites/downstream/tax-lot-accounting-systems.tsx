/**
 * LOC: WC-DOWN-TRADING-TAXLOT-084
 */
import React, { useState } from 'react';
import { Injectable, Controller, Get, Post, Param, Body, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiProperty } from '@nestjs/swagger';

class TaxLotDto {
  @ApiProperty() lotId: string;
  @ApiProperty() symbol: string;
  @ApiProperty() quantity: number;
  @ApiProperty() costBasis: number;
  @ApiProperty() acquisitionDate: Date;
}

@Injectable()
export class TaxLotService {
  private readonly logger = new Logger(TaxLotService.name);
  async calculateFIFO(symbol: string, qty: number): Promise<TaxLotDto[]> {
    this.logger.log(`FIFO calc for ${symbol}`);
    return [{ lotId: 'L1', symbol, quantity: qty, costBasis: qty * 100, acquisitionDate: new Date() }];
  }
  async calculateLIFO(symbol: string, qty: number): Promise<TaxLotDto[]> {
    return [{ lotId: 'L2', symbol, quantity: qty, costBasis: qty * 105, acquisitionDate: new Date() }];
  }
}

@ApiTags('Tax Lot')
@Controller('tax-lot')
export class TaxLotController {
  constructor(private readonly service: TaxLotService) {}
  @Get('fifo/:symbol/:qty')
  @ApiOperation({ summary: 'Calculate FIFO' })
  async getFIFO(@Param('symbol') symbol: string, @Param('qty') qty: string) {
    return await this.service.calculateFIFO(symbol, parseInt(qty));
  }
  @Get('lifo/:symbol/:qty')
  @ApiOperation({ summary: 'Calculate LIFO' })
  async getLIFO(@Param('symbol') symbol: string, @Param('qty') qty: string) {
    return await this.service.calculateLIFO(symbol, parseInt(qty));
  }
}

export const TaxLotDashboard: React.FC = () => <div><h1>Tax Lot Accounting</h1></div>;
export { TaxLotService, TaxLotController };
