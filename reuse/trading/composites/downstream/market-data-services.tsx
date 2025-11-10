/**
 * Market Data Services
 * Bloomberg Terminal-Level Market Data Services for Commodities Trading
 *
 * Provides comprehensive commodities market data, futures chains,
 * spot prices, and commodity-specific analytics
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Controller,
  Get,
  Post,
  Put,
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
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
  ApiProperty,
  ApiBody
} from '@nestjs/swagger';
import { Observable, interval, Subject } from 'rxjs';
import { map, filter, scan, throttleTime } from 'rxjs/operators';

// Import from commodities-trading-analytics-composite
import {
  CommodityContract,
  FuturesCurve,
  SpotPrice,
  Warehouse,
  CommodityInventory,
  CommodityType,
  ContractStatus,
  calculateBasis,
  analyzeContango,
  analyzeBackwardation,
  calculateConvenienceYield,
  calculateStorageCosts,
  performSpreadAnalysis,
  calculateCalendarSpread,
  calculateCrackSpread,
  calculateCrushSpread,
  analyzeFuturesCurve,
  calculateRollYield,
  optimizeDeliveryLocation,
  calculateTransportationCosts,
  performSeasonalAnalysis,
  analyzeWeatherImpact,
  forecastDemand,
  analyzeSupplyChain,
  calculateCarryTrade,
  identifyArbitrageOpportunities,
  performTechnicalAnalysisCommodity,
  calculateVolatilityTerm,
  analyzeCommitmentOfTraders,
  initializeCommodityModels
} from '../commodities-trading-analytics-composite';

// DTO Classes
export class CommodityMarketDataDto {
  @ApiProperty({ description: 'Commodity type' })
  commodityType: CommodityType;

  @ApiProperty({ description: 'Spot price information' })
  spotPrice: {
    price: number;
    currency: string;
    unit: string;
    location: string;
    timestamp: Date;
  };

  @ApiProperty({ description: 'Futures prices' })
  futuresPrices: Array<{
    contractMonth: string;
    price: number;
    volume: number;
    openInterest: number;
    lastTraded: Date;
  }>;

  @ApiProperty({ description: 'Basis calculation' })
  basis: {
    value: number;
    percentage: number;
    trend: 'strengthening' | 'weakening' | 'stable';
  };

  @ApiProperty({ description: 'Market structure' })
  marketStructure: 'contango' | 'backwardation' | 'flat';

  @ApiProperty({ description: 'Key spreads' })
  spreads: {
    calendar: number;
    interCommodity: number;
    geographic: number;
  };
}

export class FuturesCurveAnalysisDto {
  @ApiProperty({ description: 'Commodity identifier' })
  commodity: string;

  @ApiProperty({ description: 'Curve points' })
  curvePoints: Array<{
    tenor: string;
    maturityDate: Date;
    price: number;
    impliedVolatility: number;
    openInterest: number;
  }>;

  @ApiProperty({ description: 'Curve analysis' })
  analysis: {
    shape: 'normal' | 'inverted' | 'humped' | 'flat';
    slope: number;
    convexity: number;
    rollYield: number;
    carryReturn: number;
  };

  @ApiProperty({ description: 'Trading signals' })
  signals: Array<{
    type: string;
    strength: number;
    recommendation: string;
  }>;
}

export class CommoditySpreadDto {
  @ApiProperty({ description: 'Spread type' })
  type: 'calendar' | 'crack' | 'crush' | 'spark' | 'dark';

  @ApiProperty({ description: 'Spread components' })
  legs: Array<{
    commodity: string;
    contract: string;
    side: 'long' | 'short';
    ratio: number;
    price: number;
  }>;

  @ApiProperty({ description: 'Spread value' })
  value: number;

  @ApiProperty({ description: 'Historical statistics' })
  statistics: {
    mean: number;
    standardDeviation: number;
    percentile: number;
    zscore: number;
    historicalHigh: number;
    historicalLow: number;
  };

  @ApiProperty({ description: 'Trading recommendation' })
  recommendation: {
    action: 'enter' | 'exit' | 'hold';
    confidence: number;
    targetEntry: number;
    targetExit: number;
    stopLoss: number;
  };
}

export class InventoryAnalysisDto {
  @ApiProperty({ description: 'Commodity type' })
  commodity: CommodityType;

  @ApiProperty({ description: 'Global inventory levels' })
  globalInventory: {
    total: number;
    byRegion: Record<string, number>;
    daysOfSupply: number;
    yearOverYearChange: number;
  };

  @ApiProperty({ description: 'Storage locations' })
  storageLocations: Array<{
    location: string;
    capacity: number;
    utilization: number;
    available: number;
    storageCost: number;
  }>;

  @ApiProperty({ description: 'Supply/demand balance' })
  supplyDemand: {
    production: number;
    consumption: number;
    netBalance: number;
    stocksToCons ratio: number;
  };

  @ApiProperty({ description: 'Seasonal patterns' })
  seasonality: {
    currentSeason: string;
    expectedDrawdown: number;
    peakDemandPeriod: string;
    historicalPattern: any;
  };
}

// Service Classes
@Injectable()
export class CommodityMarketDataService {
  private readonly logger = new Logger(CommodityMarketDataService.name);
  private marketDataCache = new Map<string, any>();
  private priceStreams = new Map<string, Observable<any>>();

  async getCommodityMarketData(commodityType: CommodityType): Promise<CommodityMarketDataDto> {
    this.logger.log(`Fetching market data for ${commodityType}`);

    // Get spot price
    const spotPrice = await this.fetchSpotPrice(commodityType);

    // Get futures chain
    const futuresChain = await this.fetchFuturesChain(commodityType);

    // Calculate basis
    const basis = await calculateBasis(
      spotPrice.id,
      futuresChain[0]?.id
    );

    // Analyze market structure
    const marketStructure = await this.analyzeMarketStructure(futuresChain);

    // Calculate spreads
    const spreads = await this.calculateCommoditySpreads(commodityType, futuresChain);

    return {
      commodityType,
      spotPrice: {
        price: spotPrice.price,
        currency: spotPrice.currency,
        unit: spotPrice.unit,
        location: spotPrice.deliveryLocation,
        timestamp: spotPrice.timestamp
      },
      futuresPrices: futuresChain.map(contract => ({
        contractMonth: contract.contractMonth,
        price: contract.price,
        volume: contract.volume,
        openInterest: contract.openInterest,
        lastTraded: contract.lastTradedAt
      })),
      basis: {
        value: basis.value,
        percentage: basis.percentage,
        trend: this.determineBasisTrend(basis)
      },
      marketStructure,
      spreads
    };
  }

  async analyzeFuturesCurve(commodity: string): Promise<FuturesCurveAnalysisDto> {
    this.logger.log(`Analyzing futures curve for ${commodity}`);

    const contracts = await this.fetchFuturesChain(commodity as CommodityType);
    const curveAnalysis = await analyzeFuturesCurve(contracts);

    // Calculate roll yield
    const rollYield = await calculateRollYield(
      contracts[0]?.id,
      contracts[1]?.id
    );

    // Analyze contango/backwardation
    const contangoAnalysis = await analyzeContango(contracts);
    const backwardationAnalysis = await analyzeBackwardation(contracts);

    // Generate trading signals
    const signals = this.generateCurveSignals(
      curveAnalysis,
      contangoAnalysis,
      backwardationAnalysis
    );

    return {
      commodity,
      curvePoints: contracts.map(c => ({
        tenor: c.contractMonth,
        maturityDate: c.expiryDate,
        price: c.price,
        impliedVolatility: c.impliedVolatility || 0,
        openInterest: c.openInterest
      })),
      analysis: {
        shape: this.determineCurveShape(curveAnalysis),
        slope: curveAnalysis.slope,
        convexity: curveAnalysis.convexity,
        rollYield: rollYield.annualizedReturn,
        carryReturn: curveAnalysis.carryReturn
      },
      signals
    };
  }

  async calculateSpread(spreadType: string, components: any[]): Promise<CommoditySpreadDto> {
    this.logger.log(`Calculating ${spreadType} spread`);

    let spreadValue = 0;
    let spreadAnalysis: any = {};

    switch (spreadType) {
      case 'calendar':
        spreadValue = await calculateCalendarSpread(
          components[0].contractId,
          components[1].contractId
        );
        break;
      case 'crack':
        spreadAnalysis = await calculateCrackSpread(
          components[0].quantity,
          components[1].quantity,
          components[2]?.quantity
        );
        spreadValue = spreadAnalysis.spreadValue;
        break;
      case 'crush':
        spreadAnalysis = await calculateCrushSpread(
          components[0].quantity,
          components[1].quantity,
          components[2].quantity
        );
        spreadValue = spreadAnalysis.spreadValue;
        break;
    }

    const statistics = await this.calculateSpreadStatistics(spreadType, spreadValue);
    const recommendation = await this.generateSpreadRecommendation(
      spreadType,
      spreadValue,
      statistics
    );

    return {
      type: spreadType as any,
      legs: components.map(c => ({
        commodity: c.commodity,
        contract: c.contract,
        side: c.side,
        ratio: c.ratio,
        price: c.price
      })),
      value: spreadValue,
      statistics,
      recommendation
    };
  }

  async analyzeInventory(commodity: CommodityType): Promise<InventoryAnalysisDto> {
    this.logger.log(`Analyzing inventory for ${commodity}`);

    // Get inventory data
    const inventoryData = await this.fetchInventoryData(commodity);

    // Analyze storage
    const storageAnalysis = await this.analyzeStorageCapacity(commodity);

    // Calculate supply/demand
    const supplyDemand = await this.calculateSupplyDemandBalance(commodity);

    // Seasonal analysis
    const seasonalAnalysis = await performSeasonalAnalysis(commodity);

    return {
      commodity,
      globalInventory: {
        total: inventoryData.total,
        byRegion: inventoryData.byRegion,
        daysOfSupply: inventoryData.daysOfSupply,
        yearOverYearChange: inventoryData.yoyChange
      },
      storageLocations: storageAnalysis.locations,
      supplyDemand: {
        production: supplyDemand.production,
        consumption: supplyDemand.consumption,
        netBalance: supplyDemand.netBalance,
        stocksToConsRatio: supplyDemand.stocksToConsRatio
      },
      seasonality: {
        currentSeason: seasonalAnalysis.currentSeason,
        expectedDrawdown: seasonalAnalysis.expectedDrawdown,
        peakDemandPeriod: seasonalAnalysis.peakPeriod,
        historicalPattern: seasonalAnalysis.pattern
      }
    };
  }

  async getWeatherImpact(commodity: CommodityType): Promise<any> {
    return await analyzeWeatherImpact(commodity);
  }

  async getCOTReport(commodity: string): Promise<any> {
    return await analyzeCommitmentOfTraders(commodity);
  }

  async getCarryTradeAnalysis(frontMonth: string, backMonth: string): Promise<any> {
    return await calculateCarryTrade(frontMonth, backMonth);
  }

  async identifyArbitrage(commodity: CommodityType): Promise<any> {
    return await identifyArbitrageOpportunities(commodity);
  }

  async optimizeDelivery(commodity: CommodityType, quantity: number): Promise<any> {
    const locations = await this.getDeliveryLocations(commodity);
    return await optimizeDeliveryLocation(commodity, quantity, locations);
  }

  async calculateTransportCosts(origin: string, destination: string, commodity: CommodityType): Promise<any> {
    return await calculateTransportationCosts(origin, destination, commodity);
  }

  private async fetchSpotPrice(commodityType: CommodityType): Promise<any> {
    // Implementation to fetch spot price
    return {
      id: `spot_${commodityType}`,
      price: Math.random() * 1000,
      currency: 'USD',
      unit: 'MT',
      deliveryLocation: 'Rotterdam',
      timestamp: new Date()
    };
  }

  private async fetchFuturesChain(commodityType: CommodityType): Promise<any[]> {
    // Implementation to fetch futures chain
    const months = ['F24', 'G24', 'H24', 'J24', 'K24', 'M24'];
    return months.map((month, index) => ({
      id: `${commodityType}_${month}`,
      contractMonth: month,
      price: Math.random() * 1000 + index * 10,
      volume: Math.floor(Math.random() * 10000),
      openInterest: Math.floor(Math.random() * 50000),
      expiryDate: new Date(2024, index, 15),
      lastTradedAt: new Date(),
      impliedVolatility: Math.random() * 0.3
    }));
  }

  private async analyzeMarketStructure(futuresChain: any[]): Promise<any> {
    if (futuresChain.length < 2) return 'flat';

    const nearPrice = futuresChain[0].price;
    const farPrice = futuresChain[futuresChain.length - 1].price;

    if (farPrice > nearPrice * 1.01) return 'contango';
    if (farPrice < nearPrice * 0.99) return 'backwardation';
    return 'flat';
  }

  private async calculateCommoditySpreads(commodity: CommodityType, futuresChain: any[]): Promise<any> {
    return {
      calendar: futuresChain.length > 1 ? futuresChain[1].price - futuresChain[0].price : 0,
      interCommodity: Math.random() * 50 - 25,
      geographic: Math.random() * 20 - 10
    };
  }

  private determineBasisTrend(basis: any): string {
    if (basis.trend > 0.05) return 'strengthening';
    if (basis.trend < -0.05) return 'weakening';
    return 'stable';
  }

  private determineCurveShape(analysis: any): string {
    if (analysis.convexity > 0.1) return 'humped';
    if (analysis.slope > 0.05) return 'normal';
    if (analysis.slope < -0.05) return 'inverted';
    return 'flat';
  }

  private generateCurveSignals(curve: any, contango: any, backwardation: any): any[] {
    const signals = [];

    if (contango.degree > 0.1) {
      signals.push({
        type: 'contango',
        strength: contango.degree,
        recommendation: 'Consider short roll positions'
      });
    }

    if (backwardation.degree > 0.1) {
      signals.push({
        type: 'backwardation',
        strength: backwardation.degree,
        recommendation: 'Consider long roll positions'
      });
    }

    return signals;
  }

  private async calculateSpreadStatistics(type: string, value: number): Promise<any> {
    return {
      mean: Math.random() * 100,
      standardDeviation: Math.random() * 20,
      percentile: Math.random() * 100,
      zscore: (value - 50) / 20,
      historicalHigh: Math.random() * 200,
      historicalLow: Math.random() * 50
    };
  }

  private async generateSpreadRecommendation(type: string, value: number, stats: any): Promise<any> {
    const zscore = stats.zscore;

    if (Math.abs(zscore) > 2) {
      return {
        action: 'enter',
        confidence: Math.min(Math.abs(zscore) / 3, 1),
        targetEntry: value,
        targetExit: stats.mean,
        stopLoss: value + (zscore > 0 ? 1 : -1) * stats.standardDeviation * 2
      };
    }

    return {
      action: 'hold',
      confidence: 0.5,
      targetEntry: stats.mean - stats.standardDeviation,
      targetExit: stats.mean + stats.standardDeviation,
      stopLoss: stats.mean - stats.standardDeviation * 2
    };
  }

  private async fetchInventoryData(commodity: CommodityType): Promise<any> {
    return {
      total: Math.random() * 1000000,
      byRegion: {
        'North America': Math.random() * 300000,
        'Europe': Math.random() * 300000,
        'Asia': Math.random() * 400000
      },
      daysOfSupply: Math.random() * 60 + 30,
      yoyChange: (Math.random() - 0.5) * 0.2
    };
  }

  private async analyzeStorageCapacity(commodity: CommodityType): Promise<any> {
    return {
      locations: [
        {
          location: 'Rotterdam',
          capacity: 1000000,
          utilization: 0.75,
          available: 250000,
          storageCost: 5.50
        },
        {
          location: 'Singapore',
          capacity: 800000,
          utilization: 0.80,
          available: 160000,
          storageCost: 6.25
        }
      ]
    };
  }

  private async calculateSupplyDemandBalance(commodity: CommodityType): Promise<any> {
    const production = Math.random() * 100000 + 500000;
    const consumption = Math.random() * 100000 + 480000;

    return {
      production,
      consumption,
      netBalance: production - consumption,
      stocksToConsRatio: 0.25
    };
  }

  private async getDeliveryLocations(commodity: CommodityType): Promise<string[]> {
    return ['Rotterdam', 'Singapore', 'Houston', 'Fujairah'];
  }
}

// Controller
@ApiTags('market-data-services')
@ApiBearerAuth()
@Controller('market-data-services')
export class MarketDataServicesController {
  private readonly logger = new Logger(MarketDataServicesController.name);

  constructor(
    private readonly marketDataService: CommodityMarketDataService
  ) {}

  @Get('commodities/:type')
  @ApiOperation({ summary: 'Get commodity market data' })
  @ApiParam({ name: 'type', enum: CommodityType, description: 'Commodity type' })
  @ApiResponse({
    status: 200,
    description: 'Commodity market data',
    type: CommodityMarketDataDto
  })
  async getCommodityData(
    @Param('type') type: CommodityType
  ): Promise<CommodityMarketDataDto> {
    try {
      return await this.marketDataService.getCommodityMarketData(type);
    } catch (error) {
      this.logger.error(`Failed to get commodity data for ${type}:`, error);
      throw new HttpException(
        `Failed to fetch commodity data: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('futures-curve/:commodity')
  @ApiOperation({ summary: 'Analyze futures curve' })
  @ApiParam({ name: 'commodity', description: 'Commodity identifier' })
  @ApiResponse({
    status: 200,
    description: 'Futures curve analysis',
    type: FuturesCurveAnalysisDto
  })
  async analyzeFuturesCurve(
    @Param('commodity') commodity: string
  ): Promise<FuturesCurveAnalysisDto> {
    try {
      return await this.marketDataService.analyzeFuturesCurve(commodity);
    } catch (error) {
      this.logger.error(`Failed to analyze futures curve for ${commodity}:`, error);
      throw new HttpException(
        `Futures curve analysis failed: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('spreads/calculate')
  @ApiOperation({ summary: 'Calculate commodity spread' })
  @ApiBody({ type: Object })
  @ApiResponse({
    status: 200,
    description: 'Spread calculation',
    type: CommoditySpreadDto
  })
  async calculateSpread(
    @Body() body: { spreadType: string; components: any[] }
  ): Promise<CommoditySpreadDto> {
    try {
      return await this.marketDataService.calculateSpread(body.spreadType, body.components);
    } catch (error) {
      this.logger.error(`Failed to calculate ${body.spreadType} spread:`, error);
      throw new HttpException(
        `Spread calculation failed: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('inventory/:commodity')
  @ApiOperation({ summary: 'Analyze commodity inventory' })
  @ApiParam({ name: 'commodity', enum: CommodityType, description: 'Commodity type' })
  @ApiResponse({
    status: 200,
    description: 'Inventory analysis',
    type: InventoryAnalysisDto
  })
  async analyzeInventory(
    @Param('commodity') commodity: CommodityType
  ): Promise<InventoryAnalysisDto> {
    try {
      return await this.marketDataService.analyzeInventory(commodity);
    } catch (error) {
      this.logger.error(`Failed to analyze inventory for ${commodity}:`, error);
      throw new HttpException(
        `Inventory analysis failed: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('weather-impact/:commodity')
  @ApiOperation({ summary: 'Get weather impact analysis' })
  @ApiParam({ name: 'commodity', enum: CommodityType })
  @ApiResponse({
    status: 200,
    description: 'Weather impact analysis'
  })
  async getWeatherImpact(
    @Param('commodity') commodity: CommodityType
  ): Promise<any> {
    try {
      return await this.marketDataService.getWeatherImpact(commodity);
    } catch (error) {
      this.logger.error(`Failed to get weather impact for ${commodity}:`, error);
      throw new HttpException(
        `Weather impact analysis failed: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('cot-report/:commodity')
  @ApiOperation({ summary: 'Get COT report analysis' })
  @ApiParam({ name: 'commodity', description: 'Commodity identifier' })
  @ApiResponse({
    status: 200,
    description: 'COT report analysis'
  })
  async getCOTReport(
    @Param('commodity') commodity: string
  ): Promise<any> {
    try {
      return await this.marketDataService.getCOTReport(commodity);
    } catch (error) {
      this.logger.error(`Failed to get COT report for ${commodity}:`, error);
      throw new HttpException(
        `COT report retrieval failed: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}

// Export module
export default {
  controllers: [MarketDataServicesController],
  providers: [CommodityMarketDataService],
  exports: [CommodityMarketDataService]
};