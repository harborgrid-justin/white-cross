/**
 * Order Flow Monitoring Systems
 * Bloomberg Terminal-Level Order Flow Analytics and Monitoring
 */

import React from 'react';
import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Injectable
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

import {
  analyzeOrderFlow,
  calculateFlowToxicity,
  identifyInstitutionalFlow,
  detectFlowPatterns,
  analyzeOrderImbalance,
  calculateVPIN,
  measureOrderFlowImbalance,
  trackLargeOrders,
  analyzeOrderClustering,
  detectIcebergOrders,
  calculateAggresiveness,
  analyzeOrderVelocity,
  identifySmartMoney,
  analyzeOrderPersistence,
  calculateDirectionalFlow,
  detectHiddenLiquidity,
  analyzeOrderFragmentation,
  trackOrderMigration,
  calculateFlowPressure,
  analyzeIntermarketSweep,
  detectPredatoryFlow,
  initializeOrderFlowModels
} from '../order-flow-analytics-composite';

@Injectable()
export class OrderFlowMonitoringService {
  async analyzeFlow(symbol: string, period: string) {
    const flow = await analyzeOrderFlow(symbol);
    const toxicity = await calculateFlowToxicity(symbol);
    const institutional = await identifyInstitutionalFlow(symbol);
    const patterns = await detectFlowPatterns(symbol);
    
    return {
      symbol,
      period,
      flowMetrics: flow,
      toxicity,
      institutionalActivity: institutional,
      patterns
    };
  }

  async detectAnomalies(symbol: string) {
    const icebergs = await detectIcebergOrders(symbol);
    const hiddenLiquidity = await detectHiddenLiquidity(symbol);
    const predatory = await detectPredatoryFlow(symbol);
    const smartMoney = await identifySmartMoney(symbol);
    
    return { icebergs, hiddenLiquidity, predatory, smartMoney };
  }

  async calculateMetrics(symbol: string) {
    const vpin = await calculateVPIN(symbol);
    const imbalance = await measureOrderFlowImbalance(symbol);
    const aggressiveness = await calculateAggresiveness(symbol);
    const pressure = await calculateFlowPressure(symbol);
    
    return { vpin, imbalance, aggressiveness, pressure };
  }
}

@ApiTags('order-flow')
@Controller('order-flow')
export class OrderFlowController {
  constructor(private readonly service: OrderFlowMonitoringService) {}

  @Get('analyze/:symbol')
  @ApiOperation({ summary: 'Analyze order flow' })
  async analyzeFlow(
    @Param('symbol') symbol: string,
    @Query('period') period: string = '1h'
  ) {
    return await this.service.analyzeFlow(symbol, period);
  }

  @Get('anomalies/:symbol')
  @ApiOperation({ summary: 'Detect flow anomalies' })
  async detectAnomalies(@Param('symbol') symbol: string) {
    return await this.service.detectAnomalies(symbol);
  }

  @Get('metrics/:symbol')
  @ApiOperation({ summary: 'Calculate flow metrics' })
  async calculateMetrics(@Param('symbol') symbol: string) {
    return await this.service.calculateMetrics(symbol);
  }
}

export default {
  controllers: [OrderFlowController],
  providers: [OrderFlowMonitoringService]
};
