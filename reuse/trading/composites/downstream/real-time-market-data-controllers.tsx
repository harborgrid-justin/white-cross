/**
 * @fileoverview Real-time Market Data Controllers for Bloomberg Terminal Integration
 * @module RealTimeMarketDataControllers
 * @description Production-ready NestJS controllers for real-time market data streaming,
 * WebSocket management, quote aggregation, and market depth analysis
 *
 * @requires nestjs/common v10.x
 * @requires nestjs/swagger v7.x
 * @requires nestjs/websockets v10.x
 * @requires socket.io v4.x
 *
 * @upstream ../real-time-market-data-composite
 * @downstream Trading platforms, WebSocket gateways, Market data consumers
 */

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  HttpStatus,
  HttpCode,
  Logger,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
  ConflictException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiBearerAuth,
  ApiSecurity,
  ApiConsumes,
  ApiProduces,
} from '@nestjs/swagger';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import {
  IsString,
  IsNumber,
  IsArray,
  IsBoolean,
  IsOptional,
  IsEnum,
  IsDate,
  IsUUID,
  ValidateNested,
  Min,
  Max,
  ArrayMinSize,
  ArrayMaxSize,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

// Import from real-time market data composite
import {
  initializeRealTimeQuoteStream,
  streamRealTimeQuotesForSymbol,
  streamMarketDepthForSymbol,
  streamTimeAndSalesForSymbol,
  streamMarketBarData,
  streamMultipleSymbolQuotes,
  aggregateQuotesFromVenues,
  calculateNBBOQuote,
  detectCrossVenueArbitrage,
  normalizeVendorQuotes,
  normalizeBloombergQuoteData,
  normalizeReutersQuoteData,
  normalizeICEQuoteData,
  manageQuoteSubscription,
  cancelQuoteSubscription,
  getUserQuoteSubscriptions,
  cacheQuoteSnapshot,
  getCachedQuoteSnapshot,
  monitorFeedQuality,
  detectQuoteDuplicates,
  connectToVendor,
  handleVendorFailoverEvent,
  searchSymbolsByQuery,
  lookupSymbolByIdentifier,
  checkMarketStatus,
  MarketDataType,
  DataVendor,
  MarketDataQuality,
  SubscriptionStatus,
  AggregationLevel,
  QuoteUpdateFrequency,
  StreamingSessionStatus,
  RealtimeQuoteStream,
  MarketDepthSnapshot,
  SymbolDirectory,
} from '../real-time-market-data-composite';

// ============================================================================
// DTO DEFINITIONS
// ============================================================================

/**
 * DTO for creating real-time quote stream
 */
export class CreateQuoteStreamDto {
  @ApiProperty({ description: 'Symbols to stream', example: ['AAPL', 'GOOGL', 'MSFT'] })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(100)
  @IsString({ each: true })
  symbols: string[];

  @ApiProperty({ description: 'Data types to stream', example: ['QUOTE', 'TRADE', 'BID_ASK'] })
  @IsArray()
  @IsEnum(MarketDataType, { each: true })
  dataTypes: MarketDataType[];

  @ApiProperty({ description: 'Data vendor', example: 'BLOOMBERG' })
  @IsEnum(DataVendor)
  vendor: DataVendor;

  @ApiProperty({ description: 'Aggregation level', example: 'LEVEL2' })
  @IsEnum(AggregationLevel)
  aggregationLevel: AggregationLevel;

  @ApiProperty({ description: 'Update frequency', example: 'REAL_TIME' })
  @IsEnum(QuoteUpdateFrequency)
  updateFrequency: QuoteUpdateFrequency;

  @ApiProperty({ description: 'Enable conflation', example: false })
  @IsBoolean()
  @IsOptional()
  enableConflation?: boolean;

  @ApiProperty({ description: 'Snapshot interval in ms', example: 1000 })
  @IsNumber()
  @IsOptional()
  @Min(100)
  @Max(60000)
  snapshotInterval?: number;

  @ApiProperty({ description: 'Enable arbitrage detection', example: true })
  @IsBoolean()
  @IsOptional()
  enableArbitrageDetection?: boolean;

  @ApiProperty({ description: 'Include historical data', example: false })
  @IsBoolean()
  @IsOptional()
  includeHistorical?: boolean;
}

/**
 * DTO for market depth request
 */
export class MarketDepthRequestDto {
  @ApiProperty({ description: 'Symbol for market depth', example: 'AAPL' })
  @IsString()
  symbol: string;

  @ApiProperty({ description: 'Exchange', example: 'NASDAQ' })
  @IsString()
  exchange: string;

  @ApiProperty({ description: 'Number of levels', example: 10 })
  @IsNumber()
  @Min(1)
  @Max(50)
  levels: number;

  @ApiProperty({ description: 'Include order count', example: true })
  @IsBoolean()
  @IsOptional()
  includeOrderCount?: boolean;

  @ApiProperty({ description: 'Include implied levels', example: false })
  @IsBoolean()
  @IsOptional()
  includeImpliedLevels?: boolean;

  @ApiProperty({ description: 'Update frequency in ms', example: 250 })
  @IsNumber()
  @IsOptional()
  @Min(100)
  @Max(5000)
  updateFrequency?: number;
}

/**
 * DTO for time and sales request
 */
export class TimeAndSalesRequestDto {
  @ApiProperty({ description: 'Symbol', example: 'AAPL' })
  @IsString()
  symbol: string;

  @ApiProperty({ description: 'Start time', example: '2024-01-01T09:30:00Z' })
  @IsDate()
  @Type(() => Date)
  startTime: Date;

  @ApiProperty({ description: 'End time', example: '2024-01-01T16:00:00Z' })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  endTime?: Date;

  @ApiProperty({ description: 'Include conditions', example: true })
  @IsBoolean()
  @IsOptional()
  includeConditions?: boolean;

  @ApiProperty({ description: 'Include canceled trades', example: false })
  @IsBoolean()
  @IsOptional()
  includeCanceled?: boolean;

  @ApiProperty({ description: 'Minimum trade size', example: 100 })
  @IsNumber()
  @IsOptional()
  @Min(1)
  minTradeSize?: number;
}

/**
 * DTO for NBBO calculation request
 */
export class NBBORequestDto {
  @ApiProperty({ description: 'Symbols for NBBO', example: ['AAPL', 'GOOGL'] })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  @IsString({ each: true })
  symbols: string[];

  @ApiProperty({ description: 'Include protected quotes only', example: true })
  @IsBoolean()
  @IsOptional()
  protectedOnly?: boolean;

  @ApiProperty({ description: 'Include odd lots', example: false })
  @IsBoolean()
  @IsOptional()
  includeOddLots?: boolean;

  @ApiProperty({ description: 'Minimum size filter', example: 100 })
  @IsNumber()
  @IsOptional()
  @Min(1)
  minSize?: number;
}

/**
 * DTO for arbitrage detection
 */
export class ArbitrageDetectionDto {
  @ApiProperty({ description: 'Symbols to monitor', example: ['AAPL', 'MSFT'] })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(100)
  @IsString({ each: true })
  symbols: string[];

  @ApiProperty({ description: 'Minimum spread in basis points', example: 5 })
  @IsNumber()
  @Min(1)
  @Max(100)
  minSpreadBps: number;

  @ApiProperty({ description: 'Include transaction costs', example: true })
  @IsBoolean()
  @IsOptional()
  includeTransactionCosts?: boolean;

  @ApiProperty({ description: 'Venues to monitor', example: ['NYSE', 'NASDAQ'] })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  venues?: string[];
}

// ============================================================================
// REAL-TIME MARKET DATA CONTROLLER
// ============================================================================

/**
 * Controller for real-time market data operations
 */
@ApiTags('Real-Time Market Data')
@ApiBearerAuth()
@Controller('api/v1/market-data/realtime')
export class RealTimeMarketDataController {
  private readonly logger = new Logger(RealTimeMarketDataController.name);

  constructor(
    private readonly sequelize: any,
    private readonly redisClient: any,
  ) {}

  /**
   * Create new real-time quote stream
   */
  @Post('streams')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create real-time quote stream' })
  @ApiResponse({ status: 201, description: 'Stream created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request parameters' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 429, description: 'Rate limit exceeded' })
  async createQuoteStream(@Body() dto: CreateQuoteStreamDto) {
    try {
      this.logger.log(`Creating quote stream for ${dto.symbols.length} symbols`);

      // Initialize the real-time quote stream
      const stream = await initializeRealTimeQuoteStream(
        `stream-${Date.now()}`,
        dto.symbols,
        dto.dataTypes,
        dto.vendor,
        dto.aggregationLevel,
        dto.updateFrequency
      );

      // Start streaming for each symbol
      const streamPromises = dto.symbols.map(symbol =>
        streamRealTimeQuotesForSymbol(
          symbol,
          dto.dataTypes,
          dto.vendor,
          dto.aggregationLevel,
          dto.updateFrequency
        )
      );

      await Promise.all(streamPromises);

      // Enable arbitrage detection if requested
      if (dto.enableArbitrageDetection) {
        for (const symbol of dto.symbols) {
          await detectCrossVenueArbitrage(symbol, 0.01);
        }
      }

      // Cache initial snapshots
      if (dto.snapshotInterval) {
        for (const symbol of dto.symbols) {
          await cacheQuoteSnapshot(symbol, dto.vendor);
        }
      }

      return {
        streamId: stream.id,
        sessionId: stream.sessionId,
        status: stream.status,
        symbols: stream.symbols,
        vendor: stream.vendor,
        aggregationLevel: stream.aggregationLevel,
        updateFrequency: stream.updateFrequency,
        startedAt: stream.startedAt,
        message: 'Real-time quote stream created successfully',
      };
    } catch (error) {
      this.logger.error(`Failed to create quote stream: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to create real-time quote stream');
    }
  }

  /**
   * Get market depth for symbol
   */
  @Get('depth/:symbol')
  @ApiOperation({ summary: 'Get real-time market depth' })
  @ApiParam({ name: 'symbol', description: 'Trading symbol', example: 'AAPL' })
  @ApiResponse({ status: 200, description: 'Market depth retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Symbol not found' })
  async getMarketDepth(
    @Param('symbol') symbol: string,
    @Query('exchange') exchange?: string,
    @Query('levels') levels: number = 10,
  ) {
    try {
      this.logger.log(`Fetching market depth for ${symbol}`);

      const depth = await streamMarketDepthForSymbol(
        symbol,
        exchange || 'COMPOSITE',
        levels
      );

      return {
        symbol,
        exchange: depth.exchange,
        timestamp: depth.timestamp,
        levels: depth.levels,
        bids: depth.bids,
        asks: depth.asks,
        spread: depth.spread,
        spreadBps: depth.spreadBps,
        midPrice: depth.midPrice,
        imbalance: depth.imbalance,
        totalBidVolume: depth.totalBidVolume,
        totalAskVolume: depth.totalAskVolume,
      };
    } catch (error) {
      this.logger.error(`Failed to get market depth: ${error.message}`, error.stack);
      if (error.message.includes('not found')) {
        throw new NotFoundException(`Symbol ${symbol} not found`);
      }
      throw new InternalServerErrorException('Failed to retrieve market depth');
    }
  }

  /**
   * Get time and sales data
   */
  @Post('time-sales')
  @ApiOperation({ summary: 'Get time and sales data' })
  @ApiResponse({ status: 200, description: 'Time and sales data retrieved' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  async getTimeAndSales(@Body() dto: TimeAndSalesRequestDto) {
    try {
      this.logger.log(`Fetching time and sales for ${dto.symbol}`);

      const timeAndSales = await streamTimeAndSalesForSymbol(
        dto.symbol,
        dto.startTime,
        dto.endTime || new Date()
      );

      return {
        symbol: dto.symbol,
        startTime: dto.startTime,
        endTime: dto.endTime,
        trades: timeAndSales.map(trade => ({
          timestamp: trade.timestamp,
          price: trade.price,
          size: trade.size,
          exchange: trade.exchange,
          condition: dto.includeConditions ? trade.condition : undefined,
          isCanceled: dto.includeCanceled ? trade.isCanceled : undefined,
        })).filter(trade =>
          !dto.minTradeSize || trade.size >= dto.minTradeSize
        ),
        totalTrades: timeAndSales.length,
        totalVolume: timeAndSales.reduce((sum, t) => sum + t.size, 0),
      };
    } catch (error) {
      this.logger.error(`Failed to get time and sales: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to retrieve time and sales data');
    }
  }

  /**
   * Calculate NBBO for symbols
   */
  @Post('nbbo')
  @ApiOperation({ summary: 'Calculate National Best Bid and Offer' })
  @ApiResponse({ status: 200, description: 'NBBO calculated successfully' })
  async calculateNBBO(@Body() dto: NBBORequestDto) {
    try {
      this.logger.log(`Calculating NBBO for ${dto.symbols.length} symbols`);

      const nbboResults = await Promise.all(
        dto.symbols.map(async symbol => {
          const quotes = await aggregateQuotesFromVenues(
            symbol,
            [DataVendor.BLOOMBERG, DataVendor.REUTERS, DataVendor.ICE]
          );

          const nbbo = await calculateNBBOQuote(symbol, quotes);

          return {
            symbol,
            bidPrice: nbbo.bidPrice,
            bidSize: nbbo.bidSize,
            bidExchange: nbbo.bidExchange,
            askPrice: nbbo.askPrice,
            askSize: nbbo.askSize,
            askExchange: nbbo.askExchange,
            spread: nbbo.askPrice - nbbo.bidPrice,
            spreadBps: ((nbbo.askPrice - nbbo.bidPrice) / nbbo.midPrice) * 10000,
            midPrice: nbbo.midPrice,
            timestamp: nbbo.timestamp,
          };
        })
      );

      return {
        symbols: dto.symbols,
        nbbo: nbboResults,
        timestamp: new Date(),
        protectedOnly: dto.protectedOnly,
        includeOddLots: dto.includeOddLots,
      };
    } catch (error) {
      this.logger.error(`Failed to calculate NBBO: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to calculate NBBO');
    }
  }

  /**
   * Detect arbitrage opportunities
   */
  @Post('arbitrage/detect')
  @ApiOperation({ summary: 'Detect cross-venue arbitrage opportunities' })
  @ApiResponse({ status: 200, description: 'Arbitrage opportunities detected' })
  async detectArbitrage(@Body() dto: ArbitrageDetectionDto) {
    try {
      this.logger.log(`Detecting arbitrage for ${dto.symbols.length} symbols`);

      const opportunities = await Promise.all(
        dto.symbols.map(async symbol => {
          const arbs = await detectCrossVenueArbitrage(
            symbol,
            dto.minSpreadBps / 10000
          );

          return {
            symbol,
            opportunities: arbs.filter(opp => {
              if (dto.venues && dto.venues.length > 0) {
                return dto.venues.includes(opp.buyVenue) &&
                       dto.venues.includes(opp.sellVenue);
              }
              return true;
            }).map(opp => ({
              type: opp.type,
              buyVenue: opp.buyVenue,
              sellVenue: opp.sellVenue,
              profitPerShare: dto.includeTransactionCosts
                ? opp.profitPerShare - 0.01 // Subtract estimated transaction cost
                : opp.profitPerShare,
              profitPercent: opp.profitPercent,
              confidence: opp.confidence,
              estimatedCapacity: 10000, // Estimated shares that can be traded
            })),
          };
        })
      );

      return {
        symbols: dto.symbols,
        minSpreadBps: dto.minSpreadBps,
        opportunities: opportunities.filter(o => o.opportunities.length > 0),
        totalOpportunities: opportunities.reduce((sum, o) => sum + o.opportunities.length, 0),
        timestamp: new Date(),
      };
    } catch (error) {
      this.logger.error(`Failed to detect arbitrage: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to detect arbitrage opportunities');
    }
  }

  /**
   * Get user's active subscriptions
   */
  @Get('subscriptions')
  @ApiOperation({ summary: 'Get user active subscriptions' })
  @ApiResponse({ status: 200, description: 'Subscriptions retrieved successfully' })
  async getUserSubscriptions(@Query('userId') userId?: string) {
    try {
      this.logger.log(`Fetching subscriptions for user: ${userId || 'current'}`);

      const subscriptions = await getUserQuoteSubscriptions(userId || 'current-user');

      return {
        userId: userId || 'current-user',
        subscriptions: subscriptions.map(sub => ({
          id: sub.id,
          symbols: sub.symbols,
          dataTypes: sub.dataTypes,
          vendor: sub.vendor,
          status: sub.status,
          createdAt: sub.createdAt,
          quotesDelivered: sub.quotesDelivered,
          bytesTransferred: sub.bytesTransferred,
        })),
        totalActive: subscriptions.filter(s => s.status === 'ACTIVE').length,
        totalQuotesDelivered: subscriptions.reduce((sum, s) => sum + s.quotesDelivered, 0),
      };
    } catch (error) {
      this.logger.error(`Failed to get subscriptions: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to retrieve subscriptions');
    }
  }

  /**
   * Cancel subscription
   */
  @Delete('subscriptions/:subscriptionId')
  @ApiOperation({ summary: 'Cancel quote subscription' })
  @ApiParam({ name: 'subscriptionId', description: 'Subscription ID' })
  @ApiResponse({ status: 200, description: 'Subscription cancelled successfully' })
  @ApiResponse({ status: 404, description: 'Subscription not found' })
  async cancelSubscription(@Param('subscriptionId') subscriptionId: string) {
    try {
      this.logger.log(`Cancelling subscription: ${subscriptionId}`);

      await cancelQuoteSubscription(subscriptionId);

      return {
        subscriptionId,
        status: 'CANCELLED',
        message: 'Subscription cancelled successfully',
        timestamp: new Date(),
      };
    } catch (error) {
      this.logger.error(`Failed to cancel subscription: ${error.message}`, error.stack);
      if (error.message.includes('not found')) {
        throw new NotFoundException(`Subscription ${subscriptionId} not found`);
      }
      throw new InternalServerErrorException('Failed to cancel subscription');
    }
  }

  /**
   * Search symbols
   */
  @Get('symbols/search')
  @ApiOperation({ summary: 'Search symbols by query' })
  @ApiQuery({ name: 'q', description: 'Search query', example: 'AAPL' })
  @ApiQuery({ name: 'exchange', required: false, description: 'Filter by exchange' })
  @ApiQuery({ name: 'type', required: false, description: 'Security type' })
  @ApiResponse({ status: 200, description: 'Symbols found successfully' })
  async searchSymbols(
    @Query('q') query: string,
    @Query('exchange') exchange?: string,
    @Query('type') securityType?: string,
    @Query('limit') limit: number = 50,
  ) {
    try {
      this.logger.log(`Searching symbols with query: ${query}`);

      const results = await searchSymbolsByQuery(
        query,
        {
          exchange,
          securityType,
          isActive: true,
        },
        limit
      );

      return {
        query,
        results: results.map(symbol => ({
          symbol: symbol.symbol,
          name: symbol.name,
          exchange: symbol.exchange,
          securityType: symbol.securityType,
          currency: symbol.currency,
          aliases: symbol.aliases,
        })),
        totalResults: results.length,
        filters: { exchange, securityType },
      };
    } catch (error) {
      this.logger.error(`Failed to search symbols: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to search symbols');
    }
  }

  /**
   * Get market status
   */
  @Get('market/status/:exchange')
  @ApiOperation({ summary: 'Check market status for exchange' })
  @ApiParam({ name: 'exchange', description: 'Exchange code', example: 'NYSE' })
  @ApiResponse({ status: 200, description: 'Market status retrieved' })
  async getMarketStatus(@Param('exchange') exchange: string) {
    try {
      this.logger.log(`Checking market status for ${exchange}`);

      const status = await checkMarketStatus(exchange);

      return {
        exchange,
        isOpen: status.open,
        session: status.session,
        nextOpen: status.nextOpen,
        nextClose: status.nextClose,
        currentTime: new Date(),
        timezone: 'America/New_York',
        tradingHours: {
          preMarket: '04:00-09:30',
          regular: '09:30-16:00',
          afterHours: '16:00-20:00',
        },
      };
    } catch (error) {
      this.logger.error(`Failed to get market status: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to retrieve market status');
    }
  }

  /**
   * Monitor feed quality
   */
  @Get('feed/quality')
  @ApiOperation({ summary: 'Monitor market data feed quality' })
  @ApiQuery({ name: 'vendor', required: false, description: 'Filter by vendor' })
  @ApiResponse({ status: 200, description: 'Feed quality metrics retrieved' })
  async getFeedQuality(@Query('vendor') vendor?: DataVendor) {
    try {
      this.logger.log(`Monitoring feed quality for vendor: ${vendor || 'all'}`);

      const vendors = vendor ? [vendor] : [
        DataVendor.BLOOMBERG,
        DataVendor.REUTERS,
        DataVendor.ICE,
      ];

      const qualityMetrics = await Promise.all(
        vendors.map(async v => {
          const quality = await monitorFeedQuality(v);
          return {
            vendor: v,
            status: quality.status,
            latencyMs: quality.latencyMs,
            throughput: quality.throughput,
            errorRate: quality.errorRate,
            duplicateRate: quality.duplicateRate,
            lastUpdate: quality.lastUpdate,
          };
        })
      );

      return {
        vendors: qualityMetrics,
        overallStatus: qualityMetrics.every(m => m.status === 'HEALTHY') ? 'HEALTHY' : 'DEGRADED',
        timestamp: new Date(),
      };
    } catch (error) {
      this.logger.error(`Failed to get feed quality: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to retrieve feed quality metrics');
    }
  }
}

// ============================================================================
// WEBSOCKET GATEWAY
// ============================================================================

/**
 * WebSocket gateway for real-time market data streaming
 */
@WebSocketGateway(3001, {
  namespace: 'market-data',
  cors: {
    origin: '*',
    credentials: true,
  },
})
export class MarketDataWebSocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() server: Server;
  private logger = new Logger(MarketDataWebSocketGateway.name);
  private clients: Map<string, { socket: Socket; subscriptions: Set<string> }> = new Map();

  afterInit(server: Server) {
    this.logger.log('WebSocket gateway initialized');
  }

  async handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    this.clients.set(client.id, { socket: client, subscriptions: new Set() });
    client.emit('connected', { clientId: client.id, timestamp: new Date() });
  }

  async handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    const clientData = this.clients.get(client.id);
    if (clientData) {
      // Cancel all subscriptions for this client
      for (const subscription of clientData.subscriptions) {
        await this.unsubscribeFromSymbol(client, subscription);
      }
    }
    this.clients.delete(client.id);
  }

  @SubscribeMessage('subscribe')
  async handleSubscribe(
    @MessageBody() data: { symbols: string[]; dataTypes: MarketDataType[] },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      this.logger.log(`Client ${client.id} subscribing to ${data.symbols.join(', ')}`);

      const clientData = this.clients.get(client.id);
      if (!clientData) {
        throw new WsException('Client not registered');
      }

      for (const symbol of data.symbols) {
        // Add to client's subscriptions
        clientData.subscriptions.add(symbol);

        // Join room for this symbol
        await client.join(`symbol:${symbol}`);

        // Start streaming quotes for this symbol
        const stream = await streamRealTimeQuotesForSymbol(
          symbol,
          data.dataTypes,
          DataVendor.BLOOMBERG,
          AggregationLevel.LEVEL1,
          QuoteUpdateFrequency.REAL_TIME
        );

        // Send initial snapshot
        const snapshot = await getCachedQuoteSnapshot(symbol);
        if (snapshot) {
          client.emit('snapshot', {
            symbol,
            data: snapshot,
            timestamp: new Date(),
          });
        }
      }

      client.emit('subscribed', {
        symbols: data.symbols,
        status: 'SUCCESS',
        timestamp: new Date(),
      });
    } catch (error) {
      this.logger.error(`Subscription failed: ${error.message}`, error.stack);
      client.emit('error', {
        message: 'Subscription failed',
        error: error.message,
      });
    }
  }

  @SubscribeMessage('unsubscribe')
  async handleUnsubscribe(
    @MessageBody() data: { symbols: string[] },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      this.logger.log(`Client ${client.id} unsubscribing from ${data.symbols.join(', ')}`);

      for (const symbol of data.symbols) {
        await this.unsubscribeFromSymbol(client, symbol);
      }

      client.emit('unsubscribed', {
        symbols: data.symbols,
        status: 'SUCCESS',
        timestamp: new Date(),
      });
    } catch (error) {
      this.logger.error(`Unsubscription failed: ${error.message}`, error.stack);
      client.emit('error', {
        message: 'Unsubscription failed',
        error: error.message,
      });
    }
  }

  private async unsubscribeFromSymbol(client: Socket, symbol: string) {
    const clientData = this.clients.get(client.id);
    if (clientData) {
      clientData.subscriptions.delete(symbol);
      await client.leave(`symbol:${symbol}`);
    }
  }

  /**
   * Broadcast quote update to all subscribed clients
   */
  broadcastQuoteUpdate(symbol: string, quote: any) {
    this.server.to(`symbol:${symbol}`).emit('quote', {
      symbol,
      data: quote,
      timestamp: new Date(),
    });
  }

  /**
   * Broadcast market depth update
   */
  broadcastDepthUpdate(symbol: string, depth: any) {
    this.server.to(`symbol:${symbol}`).emit('depth', {
      symbol,
      data: depth,
      timestamp: new Date(),
    });
  }

  /**
   * Broadcast trade update
   */
  broadcastTradeUpdate(symbol: string, trade: any) {
    this.server.to(`symbol:${symbol}`).emit('trade', {
      symbol,
      data: trade,
      timestamp: new Date(),
    });
  }
}

// Export all components
export default {
  RealTimeMarketDataController,
  MarketDataWebSocketGateway,
  CreateQuoteStreamDto,
  MarketDepthRequestDto,
  TimeAndSalesRequestDto,
  NBBORequestDto,
  ArbitrageDetectionDto,
};