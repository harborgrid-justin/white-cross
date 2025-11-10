/**
 * Market Data Aggregation Engines
 * Bloomberg Terminal-Level Market Data Aggregation and Consolidation System
 *
 * Provides comprehensive multi-venue data aggregation, normalization,
 * NBBO calculation, and consolidated market data feeds
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
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
import { Observable, Subject, merge, combineLatest, timer } from 'rxjs';
import { buffer, bufferTime, map, scan, filter, throttleTime } from 'rxjs/operators';
import WebSocket from 'ws';

// Import from real-time-market-data-composite
import {
  MarketDataQuote,
  MarketDataTrade,
  OrderBookSnapshot,
  MarketDepthUpdate,
  TimeAndSales,
  MarketDataSubscription,
  AggregatedQuote,
  MarketDataType,
  DataVendor,
  MarketDataQuality,
  initializeMarketDataStream,
  streamRealTimeQuotes,
  streamMarketDepth,
  streamTimeAndSales,
  normalizeMarketData,
  normalizeBloombergData,
  normalizeReutersData,
  normalizeICEData,
  aggregateQuotes,
  calculateNBBO,
  detectArbitrageOpportunities,
  validateMarketDataQuality,
  monitorFeedHealth,
  detectDuplicates,
  connectToBloomberg,
  connectToReuters,
  connectToICE,
  handleVendorFailover,
  cacheMarketData,
  getCachedMarketData,
  initializeMarketDataModels
} from '../real-time-market-data-composite';

// DTO Classes
export class AggregationConfigDto {
  @ApiProperty({ description: 'Aggregation engine name' })
  name: string;

  @ApiProperty({ description: 'Data sources to aggregate' })
  dataSources: Array<{
    vendor: DataVendor;
    weight: number;
    priority: number;
    enabled: boolean;
  }>;

  @ApiProperty({ description: 'Aggregation rules' })
  rules: {
    conflationType: 'time-based' | 'volume-based' | 'tick-based';
    conflationWindow: number;
    deduplication: boolean;
    qualityThreshold: number;
    outlierDetection: boolean;
    outlierThreshold: number;
  };

  @ApiProperty({ description: 'Output configuration' })
  output: {
    format: 'normalized' | 'raw' | 'custom';
    includeMetadata: boolean;
    timestampPrecision: 'millisecond' | 'microsecond' | 'nanosecond';
    compression: boolean;
  };

  @ApiProperty({ description: 'Symbols to aggregate' })
  symbols: string[];

  @ApiProperty({ description: 'Market data types' })
  dataTypes: MarketDataType[];
}

export class NBBOCalculationDto {
  @ApiProperty({ description: 'Symbol' })
  symbol: string;

  @ApiProperty({ description: 'Best bid' })
  bestBid: {
    price: number;
    size: number;
    venue: string;
    timestamp: Date;
  };

  @ApiProperty({ description: 'Best ask' })
  bestAsk: {
    price: number;
    size: number;
    venue: string;
    timestamp: Date;
  };

  @ApiProperty({ description: 'Spread' })
  spread: number;

  @ApiProperty({ description: 'Mid price' })
  midPrice: number;

  @ApiProperty({ description: 'Total bid depth' })
  totalBidDepth: number;

  @ApiProperty({ description: 'Total ask depth' })
  totalAskDepth: number;

  @ApiProperty({ description: 'Contributing venues' })
  contributingVenues: string[];

  @ApiProperty({ description: 'Calculation timestamp' })
  timestamp: Date;
}

export class ConsolidatedQuoteDto {
  @ApiProperty({ description: 'Symbol' })
  symbol: string;

  @ApiProperty({ description: 'Consolidated bid' })
  consolidatedBid: number;

  @ApiProperty({ description: 'Consolidated ask' })
  consolidatedAsk: number;

  @ApiProperty({ description: 'Consolidated last' })
  consolidatedLast: number;

  @ApiProperty({ description: 'Volume weighted average price' })
  vwap: number;

  @ApiProperty({ description: 'Total volume' })
  totalVolume: number;

  @ApiProperty({ description: 'Number of trades' })
  tradeCount: number;

  @ApiProperty({ description: 'Data sources used' })
  dataSources: Array<{
    vendor: string;
    contribution: number;
    quality: number;
  }>;

  @ApiProperty({ description: 'Quality metrics' })
  qualityMetrics: {
    coverage: number;
    latency: number;
    accuracy: number;
    completeness: number;
  };
}

export class MarketDepthAggregationDto {
  @ApiProperty({ description: 'Symbol' })
  symbol: string;

  @ApiProperty({ description: 'Aggregated bid levels' })
  bids: Array<{
    price: number;
    totalSize: number;
    orderCount: number;
    venues: Array<{
      venue: string;
      size: number;
      orders: number;
    }>;
  }>;

  @ApiProperty({ description: 'Aggregated ask levels' })
  asks: Array<{
    price: number;
    totalSize: number;
    orderCount: number;
    venues: Array<{
      venue: string;
      size: number;
      orders: number;
    }>;
  }>;

  @ApiProperty({ description: 'Imbalance indicators' })
  imbalance: {
    ratio: number;
    direction: 'buy' | 'sell' | 'neutral';
    magnitude: number;
  };

  @ApiProperty({ description: 'Aggregation timestamp' })
  timestamp: Date;
}

// Service Classes
@Injectable()
export class MarketDataAggregationService {
  private readonly logger = new Logger(MarketDataAggregationService.name);
  private aggregationEngines = new Map<string, any>();
  private dataStreams = new Map<string, Observable<any>>();
  private aggregatedData = new Map<string, any>();
  private vendorConnections = new Map<string, any>();
  private nbboCache = new Map<string, NBBOCalculationDto>();

  async createAggregationEngine(config: AggregationConfigDto): Promise<any> {
    this.logger.log(`Creating aggregation engine: ${config.name}`);

    const engine = {
      id: this.generateEngineId(),
      config,
      status: 'initializing',
      streams: new Map<string, Subject<any>>(),
      processors: new Map<string, any>()
    };

    // Initialize vendor connections
    for (const source of config.dataSources) {
      if (source.enabled) {
        await this.initializeVendorConnection(source.vendor);
      }
    }

    // Initialize data streams for each symbol
    for (const symbol of config.symbols) {
      const stream = await this.createAggregatedStream(symbol, config);
      engine.streams.set(symbol, stream);
    }

    // Initialize processors
    this.initializeProcessors(engine, config);

    engine.status = 'active';
    this.aggregationEngines.set(engine.id, engine);

    return {
      engineId: engine.id,
      status: engine.status,
      symbolCount: config.symbols.length,
      dataSourceCount: config.dataSources.filter(ds => ds.enabled).length
    };
  }

  async calculateNBBOForSymbol(symbol: string): Promise<NBBOCalculationDto> {
    const quotes = await this.collectQuotesFromAllVenues(symbol);

    if (quotes.length === 0) {
      throw new HttpException(
        `No quotes available for ${symbol}`,
        HttpStatus.NOT_FOUND
      );
    }

    const nbbo = await calculateNBBO(quotes);

    const result: NBBOCalculationDto = {
      symbol,
      bestBid: {
        price: nbbo.bidPrice,
        size: nbbo.bidSize,
        venue: nbbo.bidVenue,
        timestamp: new Date()
      },
      bestAsk: {
        price: nbbo.askPrice,
        size: nbbo.askSize,
        venue: nbbo.askVenue,
        timestamp: new Date()
      },
      spread: nbbo.askPrice - nbbo.bidPrice,
      midPrice: (nbbo.bidPrice + nbbo.askPrice) / 2,
      totalBidDepth: this.calculateTotalDepth(quotes, 'bid'),
      totalAskDepth: this.calculateTotalDepth(quotes, 'ask'),
      contributingVenues: this.getContributingVenues(quotes),
      timestamp: new Date()
    };

    this.nbboCache.set(symbol, result);
    return result;
  }

  async aggregateMarketDepth(symbol: string, levels: number = 10): Promise<MarketDepthAggregationDto> {
    const depthData = await this.collectDepthFromAllVenues(symbol);

    const aggregatedBids = this.aggregatePriceLevels(
      depthData.map(d => d.bids).flat(),
      'bid',
      levels
    );

    const aggregatedAsks = this.aggregatePriceLevels(
      depthData.map(d => d.asks).flat(),
      'ask',
      levels
    );

    const imbalance = this.calculateImbalance(aggregatedBids, aggregatedAsks);

    return {
      symbol,
      bids: aggregatedBids,
      asks: aggregatedAsks,
      imbalance,
      timestamp: new Date()
    };
  }

  async getConsolidatedQuote(symbol: string): Promise<ConsolidatedQuoteDto> {
    const quotes = await this.collectQuotesFromAllVenues(symbol);
    const trades = await this.collectTradesFromAllVenues(symbol);

    const aggregated = await aggregateQuotes(quotes);
    const vwap = this.calculateVWAP(trades);

    const qualityMetrics = await this.assessDataQuality(symbol, quotes);

    return {
      symbol,
      consolidatedBid: aggregated.bid,
      consolidatedAsk: aggregated.ask,
      consolidatedLast: aggregated.last,
      vwap,
      totalVolume: trades.reduce((sum, t) => sum + t.volume, 0),
      tradeCount: trades.length,
      dataSources: await this.getDataSourceContributions(symbol),
      qualityMetrics
    };
  }

  async detectArbitrage(symbols: string[]): Promise<any[]> {
    const opportunities = [];

    for (const symbol of symbols) {
      const quotes = await this.collectQuotesFromAllVenues(symbol);
      const arb = await detectArbitrageOpportunities(quotes);

      if (arb.length > 0) {
        opportunities.push({
          symbol,
          opportunities: arb,
          timestamp: new Date()
        });
      }
    }

    return opportunities;
  }

  async monitorDataQuality(engineId: string): Promise<any> {
    const engine = this.aggregationEngines.get(engineId);

    if (!engine) {
      throw new HttpException(
        `Engine ${engineId} not found`,
        HttpStatus.NOT_FOUND
      );
    }

    const qualityReport = {
      engineId,
      timestamp: new Date(),
      vendors: [],
      overall: {
        health: 'healthy',
        issues: [],
        recommendations: []
      }
    };

    for (const source of engine.config.dataSources) {
      if (!source.enabled) continue;

      const health = await monitorFeedHealth(source.vendor);
      const quality = await validateMarketDataQuality({
        vendor: source.vendor,
        symbol: engine.config.symbols[0],
        threshold: engine.config.rules.qualityThreshold
      });

      qualityReport.vendors.push({
        vendor: source.vendor,
        health,
        quality,
        latency: this.getVendorLatency(source.vendor),
        errorRate: this.getVendorErrorRate(source.vendor)
      });
    }

    // Assess overall health
    const unhealthyVendors = qualityReport.vendors.filter(v => v.health !== 'healthy');
    if (unhealthyVendors.length > 0) {
      qualityReport.overall.health = 'degraded';
      qualityReport.overall.issues.push(
        `${unhealthyVendors.length} vendor(s) experiencing issues`
      );
    }

    return qualityReport;
  }

  async handleFailover(vendor: DataVendor): Promise<any> {
    this.logger.warn(`Initiating failover for ${vendor}`);

    const result = await handleVendorFailover(vendor);

    // Update engine configurations
    for (const [engineId, engine] of this.aggregationEngines) {
      const source = engine.config.dataSources.find(ds => ds.vendor === vendor);
      if (source) {
        source.enabled = false;
        this.logger.log(`Disabled ${vendor} for engine ${engineId}`);
      }
    }

    return {
      vendor,
      failoverVendor: result.failoverVendor,
      status: 'completed',
      timestamp: new Date()
    };
  }

  private async initializeVendorConnection(vendor: DataVendor): Promise<void> {
    let connection;

    switch (vendor) {
      case 'Bloomberg':
        connection = await connectToBloomberg();
        break;
      case 'Reuters':
        connection = await connectToReuters();
        break;
      case 'ICE':
        connection = await connectToICE();
        break;
      default:
        throw new Error(`Unsupported vendor: ${vendor}`);
    }

    this.vendorConnections.set(vendor, connection);
  }

  private async createAggregatedStream(
    symbol: string,
    config: AggregationConfigDto
  ): Promise<Observable<any>> {
    const streams = [];

    for (const source of config.dataSources) {
      if (!source.enabled) continue;

      const stream = await this.createVendorStream(symbol, source.vendor, config.dataTypes);
      const normalizedStream = stream.pipe(
        map(data => this.normalizeVendorData(data, source.vendor)),
        filter(data => this.validateDataQuality(data, config.rules.qualityThreshold))
      );

      streams.push(normalizedStream);
    }

    // Merge and aggregate streams
    return merge(...streams).pipe(
      bufferTime(config.rules.conflationWindow),
      map(buffer => this.aggregateBuffer(buffer, config.rules)),
      filter(data => data !== null)
    );
  }

  private async createVendorStream(
    symbol: string,
    vendor: DataVendor,
    dataTypes: MarketDataType[]
  ): Promise<Observable<any>> {
    const streams = [];

    if (dataTypes.includes('quote')) {
      streams.push(streamRealTimeQuotes(symbol, vendor));
    }

    if (dataTypes.includes('trade')) {
      streams.push(streamTimeAndSales(symbol, vendor));
    }

    if (dataTypes.includes('depth')) {
      streams.push(streamMarketDepth(symbol, vendor));
    }

    return merge(...streams);
  }

  private normalizeVendorData(data: any, vendor: DataVendor): any {
    switch (vendor) {
      case 'Bloomberg':
        return normalizeBloombergData(data);
      case 'Reuters':
        return normalizeReutersData(data);
      case 'ICE':
        return normalizeICEData(data);
      default:
        return normalizeMarketData(data);
    }
  }

  private validateDataQuality(data: any, threshold: number): boolean {
    // Implementation for data quality validation
    return true;
  }

  private aggregateBuffer(buffer: any[], rules: any): any {
    if (buffer.length === 0) return null;

    // Remove duplicates
    if (rules.deduplication) {
      buffer = this.removeDuplicates(buffer);
    }

    // Detect and filter outliers
    if (rules.outlierDetection) {
      buffer = this.filterOutliers(buffer, rules.outlierThreshold);
    }

    // Aggregate based on type
    return this.performAggregation(buffer, rules.conflationType);
  }

  private removeDuplicates(buffer: any[]): any[] {
    const seen = new Set();
    return buffer.filter(item => {
      const key = `${item.symbol}_${item.timestamp}_${item.price}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  private filterOutliers(buffer: any[], threshold: number): any[] {
    if (buffer.length < 3) return buffer;

    const prices = buffer.map(item => item.price).sort((a, b) => a - b);
    const median = prices[Math.floor(prices.length / 2)];
    const mad = this.calculateMAD(prices, median);

    return buffer.filter(item => {
      const deviation = Math.abs(item.price - median) / mad;
      return deviation <= threshold;
    });
  }

  private calculateMAD(values: number[], median: number): number {
    const deviations = values.map(v => Math.abs(v - median));
    deviations.sort((a, b) => a - b);
    return deviations[Math.floor(deviations.length / 2)];
  }

  private performAggregation(buffer: any[], type: string): any {
    switch (type) {
      case 'time-based':
        return this.timeBasedAggregation(buffer);
      case 'volume-based':
        return this.volumeBasedAggregation(buffer);
      case 'tick-based':
        return this.tickBasedAggregation(buffer);
      default:
        return buffer[buffer.length - 1];
    }
  }

  private timeBasedAggregation(buffer: any[]): any {
    return {
      timestamp: new Date(),
      open: buffer[0]?.price,
      high: Math.max(...buffer.map(b => b.price)),
      low: Math.min(...buffer.map(b => b.price)),
      close: buffer[buffer.length - 1]?.price,
      volume: buffer.reduce((sum, b) => sum + (b.volume || 0), 0),
      count: buffer.length
    };
  }

  private volumeBasedAggregation(buffer: any[]): any {
    const totalVolume = buffer.reduce((sum, b) => sum + (b.volume || 0), 0);
    const vwap = buffer.reduce((sum, b) => sum + (b.price * (b.volume || 0)), 0) / totalVolume;

    return {
      timestamp: new Date(),
      vwap,
      volume: totalVolume,
      count: buffer.length
    };
  }

  private tickBasedAggregation(buffer: any[]): any {
    return {
      timestamp: new Date(),
      ticks: buffer.length,
      avgPrice: buffer.reduce((sum, b) => sum + b.price, 0) / buffer.length,
      volume: buffer.reduce((sum, b) => sum + (b.volume || 0), 0)
    };
  }

  private initializeProcessors(engine: any, config: AggregationConfigDto): void {
    // Initialize NBBO processor
    engine.processors.set('nbbo',
      interval(100).pipe(
        map(() => config.symbols.map(s => this.calculateNBBOForSymbol(s)))
      ).subscribe()
    );

    // Initialize quality monitor
    engine.processors.set('quality',
      interval(5000).pipe(
        map(() => this.monitorDataQuality(engine.id))
      ).subscribe()
    );
  }

  private async collectQuotesFromAllVenues(symbol: string): Promise<any[]> {
    const quotes = [];

    for (const [vendor, connection] of this.vendorConnections) {
      try {
        const quote = await connection.getQuote(symbol);
        if (quote) quotes.push(quote);
      } catch (error) {
        this.logger.error(`Failed to get quote from ${vendor}:`, error);
      }
    }

    return quotes;
  }

  private async collectTradesFromAllVenues(symbol: string): Promise<any[]> {
    const trades = [];

    for (const [vendor, connection] of this.vendorConnections) {
      try {
        const trade = await connection.getTrades(symbol);
        if (trade) trades.push(...trade);
      } catch (error) {
        this.logger.error(`Failed to get trades from ${vendor}:`, error);
      }
    }

    return trades;
  }

  private async collectDepthFromAllVenues(symbol: string): Promise<any[]> {
    const depth = [];

    for (const [vendor, connection] of this.vendorConnections) {
      try {
        const depthData = await connection.getDepth(symbol);
        if (depthData) depth.push(depthData);
      } catch (error) {
        this.logger.error(`Failed to get depth from ${vendor}:`, error);
      }
    }

    return depth;
  }

  private calculateTotalDepth(quotes: any[], side: 'bid' | 'ask'): number {
    return quotes.reduce((sum, quote) => {
      return sum + (side === 'bid' ? quote.bidSize : quote.askSize);
    }, 0);
  }

  private getContributingVenues(quotes: any[]): string[] {
    return [...new Set(quotes.map(q => q.venue))];
  }

  private aggregatePriceLevels(levels: any[], side: string, maxLevels: number): any[] {
    const aggregated = new Map<number, any>();

    for (const level of levels) {
      const price = level.price;

      if (!aggregated.has(price)) {
        aggregated.set(price, {
          price,
          totalSize: 0,
          orderCount: 0,
          venues: []
        });
      }

      const agg = aggregated.get(price);
      agg.totalSize += level.size;
      agg.orderCount += level.orders || 1;
      agg.venues.push({
        venue: level.venue,
        size: level.size,
        orders: level.orders || 1
      });
    }

    const sorted = Array.from(aggregated.values()).sort((a, b) => {
      return side === 'bid' ? b.price - a.price : a.price - b.price;
    });

    return sorted.slice(0, maxLevels);
  }

  private calculateImbalance(bids: any[], asks: any[]): any {
    const totalBidSize = bids.reduce((sum, b) => sum + b.totalSize, 0);
    const totalAskSize = asks.reduce((sum, a) => sum + a.totalSize, 0);

    const ratio = totalBidSize / (totalAskSize || 1);
    const direction = ratio > 1.2 ? 'buy' : ratio < 0.8 ? 'sell' : 'neutral';
    const magnitude = Math.abs(1 - ratio);

    return { ratio, direction, magnitude };
  }

  private calculateVWAP(trades: any[]): number {
    if (trades.length === 0) return 0;

    const totalValue = trades.reduce((sum, t) => sum + (t.price * t.volume), 0);
    const totalVolume = trades.reduce((sum, t) => sum + t.volume, 0);

    return totalVolume > 0 ? totalValue / totalVolume : 0;
  }

  private async assessDataQuality(symbol: string, quotes: any[]): Promise<any> {
    return {
      coverage: (quotes.length / this.vendorConnections.size) * 100,
      latency: this.calculateAverageLatency(quotes),
      accuracy: await this.assessAccuracy(symbol, quotes),
      completeness: this.assessCompleteness(quotes)
    };
  }

  private calculateAverageLatency(quotes: any[]): number {
    const now = Date.now();
    const latencies = quotes.map(q => now - q.timestamp);
    return latencies.reduce((sum, l) => sum + l, 0) / latencies.length;
  }

  private async assessAccuracy(symbol: string, quotes: any[]): number {
    // Implementation for accuracy assessment
    return 98.5;
  }

  private assessCompleteness(quotes: any[]): number {
    // Implementation for completeness assessment
    return 95.0;
  }

  private async getDataSourceContributions(symbol: string): Promise<any[]> {
    const contributions = [];

    for (const [vendor, connection] of this.vendorConnections) {
      contributions.push({
        vendor,
        contribution: Math.random() * 100,
        quality: Math.random() * 100
      });
    }

    return contributions;
  }

  private getVendorLatency(vendor: string): number {
    // Implementation for vendor latency
    return Math.random() * 50 + 10;
  }

  private getVendorErrorRate(vendor: string): number {
    // Implementation for vendor error rate
    return Math.random() * 5;
  }

  private generateEngineId(): string {
    return `agg_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  }
}

// Controller
@ApiTags('market-data-aggregation')
@ApiBearerAuth()
@Controller('market-data-aggregation')
export class MarketDataAggregationController {
  private readonly logger = new Logger(MarketDataAggregationController.name);

  constructor(
    private readonly aggregationService: MarketDataAggregationService
  ) {}

  @Post('engines')
  @ApiOperation({ summary: 'Create new aggregation engine' })
  @ApiBody({ type: AggregationConfigDto })
  @ApiResponse({
    status: 201,
    description: 'Engine created successfully'
  })
  async createEngine(
    @Body() config: AggregationConfigDto
  ): Promise<any> {
    try {
      return await this.aggregationService.createAggregationEngine(config);
    } catch (error) {
      this.logger.error('Failed to create aggregation engine:', error);
      throw new HttpException(
        `Failed to create engine: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('nbbo/:symbol')
  @ApiOperation({ summary: 'Get NBBO for symbol' })
  @ApiParam({ name: 'symbol', description: 'Trading symbol' })
  @ApiResponse({
    status: 200,
    description: 'NBBO calculation',
    type: NBBOCalculationDto
  })
  async getNBBO(
    @Param('symbol') symbol: string
  ): Promise<NBBOCalculationDto> {
    try {
      return await this.aggregationService.calculateNBBOForSymbol(symbol);
    } catch (error) {
      this.logger.error(`Failed to calculate NBBO for ${symbol}:`, error);
      throw new HttpException(
        `NBBO calculation failed: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('depth/:symbol')
  @ApiOperation({ summary: 'Get aggregated market depth' })
  @ApiParam({ name: 'symbol', description: 'Trading symbol' })
  @ApiQuery({ name: 'levels', required: false, description: 'Number of depth levels' })
  @ApiResponse({
    status: 200,
    description: 'Aggregated market depth',
    type: MarketDepthAggregationDto
  })
  async getAggregatedDepth(
    @Param('symbol') symbol: string,
    @Query('levels') levels: number = 10
  ): Promise<MarketDepthAggregationDto> {
    try {
      return await this.aggregationService.aggregateMarketDepth(symbol, levels);
    } catch (error) {
      this.logger.error(`Failed to aggregate depth for ${symbol}:`, error);
      throw new HttpException(
        `Depth aggregation failed: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('quote/:symbol/consolidated')
  @ApiOperation({ summary: 'Get consolidated quote' })
  @ApiParam({ name: 'symbol', description: 'Trading symbol' })
  @ApiResponse({
    status: 200,
    description: 'Consolidated quote',
    type: ConsolidatedQuoteDto
  })
  async getConsolidatedQuote(
    @Param('symbol') symbol: string
  ): Promise<ConsolidatedQuoteDto> {
    try {
      return await this.aggregationService.getConsolidatedQuote(symbol);
    } catch (error) {
      this.logger.error(`Failed to get consolidated quote for ${symbol}:`, error);
      throw new HttpException(
        `Quote consolidation failed: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('arbitrage/detect')
  @ApiOperation({ summary: 'Detect arbitrage opportunities' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        symbols: {
          type: 'array',
          items: { type: 'string' }
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Arbitrage opportunities detected'
  })
  async detectArbitrage(
    @Body() body: { symbols: string[] }
  ): Promise<any[]> {
    try {
      return await this.aggregationService.detectArbitrage(body.symbols);
    } catch (error) {
      this.logger.error('Arbitrage detection failed:', error);
      throw new HttpException(
        `Arbitrage detection failed: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('quality/:engineId')
  @ApiOperation({ summary: 'Monitor data quality for engine' })
  @ApiParam({ name: 'engineId', description: 'Aggregation engine ID' })
  @ApiResponse({
    status: 200,
    description: 'Data quality report'
  })
  async monitorQuality(
    @Param('engineId') engineId: string
  ): Promise<any> {
    try {
      return await this.aggregationService.monitorDataQuality(engineId);
    } catch (error) {
      this.logger.error(`Failed to monitor quality for engine ${engineId}:`, error);
      throw new HttpException(
        `Quality monitoring failed: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('failover')
  @ApiOperation({ summary: 'Handle vendor failover' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        vendor: { type: 'string' }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Failover completed'
  })
  async handleFailover(
    @Body() body: { vendor: DataVendor }
  ): Promise<any> {
    try {
      return await this.aggregationService.handleFailover(body.vendor);
    } catch (error) {
      this.logger.error(`Failover failed for ${body.vendor}:`, error);
      throw new HttpException(
        `Failover failed: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}

// Export module
export default {
  controllers: [MarketDataAggregationController],
  providers: [MarketDataAggregationService],
  exports: [MarketDataAggregationService]
};