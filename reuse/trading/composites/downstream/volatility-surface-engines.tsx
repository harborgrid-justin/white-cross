/**
 * LOC: WC-DOWN-TRADING-VOLSURF-100
 */
import React from 'react';
import { Injectable, Controller, Get, Param, Query, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Injectable()
export class VolatilitySurfaceEngineService {
  private readonly logger = new Logger(VolatilitySurfaceEngineService.name);
  async getVolatilitySurface(underlying: string): Promise<any> {
    this.logger.log(`Vol surface for ${underlying}`);
    return { underlying, strikes: [100, 110, 120], maturities: [0.25, 0.5, 1.0], volatilities: [[0.20, 0.22, 0.25]] };
  }
  async getImpliedVol(underlying: string, strike: number, maturity: number): Promise<number> {
    return 0.22;
  }
}

@ApiTags('Volatility Surface Engine')
@Controller('vol-surface')
export class VolatilitySurfaceEngineController {
  constructor(private readonly service: VolatilitySurfaceEngineService) {}
  @Get(':underlying')
  @ApiOperation({ summary: 'Get volatility surface' })
  async getSurface(@Param('underlying') underlying: string) {
    return await this.service.getVolatilitySurface(underlying);
  }
  @Get('implied-vol/:underlying')
  @ApiOperation({ summary: 'Get implied volatility' })
  async getImpliedVol(
    @Param('underlying') underlying: string,
    @Query('strike') strike: string,
    @Query('maturity') maturity: string
  ) {
    return { impliedVol: await this.service.getImpliedVol(underlying, parseFloat(strike), parseFloat(maturity)) };
  }
}

export const VolatilitySurfaceEngineDashboard: React.FC = () => <div><h1>Volatility Surface Engine</h1></div>;
export { VolatilitySurfaceEngineService, VolatilitySurfaceEngineController };
