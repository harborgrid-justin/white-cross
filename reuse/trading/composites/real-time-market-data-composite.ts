/**
 * LOC: TRDCOMP-RTMD-001
 * File: /reuse/trading/composites/real-time-market-data-composite.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v10.x)
 *   - @nestjs/swagger (v7.x)
 *   - sequelize (v6.x)
 *   - sequelize-typescript (v2.x)
 *   - ws (v8.x)
 *   - ../market-data-service-kit
 *   - ../market-data-models-kit
 *
 * DOWNSTREAM (imported by):
 *   - Real-time market data controllers
 *   - WebSocket gateway services
 *   - Market data aggregation engines
 *   - Trading analytics platforms
 *   - Quote subscription managers
 */

/**
 * File: /reuse/trading/composites/real-time-market-data-composite.ts
 * Locator: WC-COMP-TRADING-RTMD-001
 * Purpose: Bloomberg Terminal-Style Real-Time Market Data Composite
 *
 * Upstream: @nestjs/common, @nestjs/swagger, sequelize, ws, market-data kits
 * Downstream: Trading controllers, WebSocket gateways, quote services, data aggregators
 * Dependencies: NestJS 10.x, Sequelize 6.x, TypeScript 5.x, WebSocket 8.x
 * Exports: 45 composed functions for comprehensive real-time market data operations
 *
 * LLM Context: Enterprise-grade Bloomberg Terminal-level real-time market data platform.
 * Provides institutional-quality real-time streaming, Level 2 market depth, tick-by-tick data,
 * quote aggregation, multi-exchange connectivity, WebSocket streaming, subscription management,
 * market status tracking, data quality monitoring, snapshot caching, symbol search, trade filtering,
 * and comprehensive market data normalization across multiple vendors (Bloomberg, Reuters, ICE).
 */

import { Injectable, Logger, Controller, Get, Post, Delete, Param, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
import {
  Sequelize,
  Model,
  DataTypes,
  Transaction,
  Op,
  Association,
  HasManyGetAssociationsMixin,
  HasManyAddAssociationMixin,
  BelongsToGetAssociationMixin,
  Optional,
} from 'sequelize';
import WebSocket from 'ws';

// Import from market data service kit
import {
  MarketDataType,
  DataVendor,
  MarketDataQuality,
  SubscriptionStatus,
  TimeFrame,
  MarketDataQuote,
  MarketDataTrade,
  OrderBookSnapshot,
  MarketDepthUpdate,
  TimeAndSales,
  MarketDataSubscription,
  HistoricalDataRequest,
  AggregatedQuote,
  VendorConnectionConfig,
  initializeMarketDataStream,
  streamRealTimeQuotes,
  streamMarketDepth,
  streamTimeAndSales,
  streamBars,
  streamMultipleSymbols,
  normalizeMarketData,
  normalizeBloombergData,
  normalizeReutersData,
  normalizeICEData,
  aggregateQuotes,
  calculateNBBO,
  detectArbitrageOpportunities,
  createSubscription,
  cancelSubscription,
  getUserSubscriptions,
  getHistoricalQuotes,
  getHistoricalBars,
  getHistoricalTimeAndSales,
  validateMarketDataQuality,
  monitorFeedHealth,
  detectDuplicates,
  connectToBloomberg,
  connectToReuters,
  connectToICE,
  handleVendorFailover,
  cacheMarketData,
  getCachedMarketData,
} from '../market-data-service-kit';

// Import from market data models kit
import {
  createSecurityMasterModel,
  createMarketDataModel,
  createCorporateActionModel,
  createTradingCalendarModel,
  createSecurityMaster,
  findSecurityByIdentifier,
  validateSecurityIdentifiers,
  ingestMarketDataFeed,
  processRealtimeQuote,
  processRealtimeTrade,
  getLatestMarketSnapshot,
  generateOHLCVBars,
  calculateVWAP,
  updateOrderBook,
  getMarketDepth,
  calculateBidAskSpread,
  detectOrderBookImbalance,
  isMarketOpen,
  getTradingHours,
  getNextTradingDay,
} from '../market-data-models-kit';

// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================

/**
 * Real-time streaming session status
 */
export enum StreamingSessionStatus {
  INITIALIZING = 'initializing',
  CONNECTED = 'connected',
  STREAMING = 'streaming',
  PAUSED = 'paused',
  DISCONNECTED = 'disconnected',
  ERROR = 'error',
  RECONNECTING = 'reconnecting',
}

/**
 * Market data aggregation level
 */
export enum AggregationLevel {
  TICK = 'tick',
  LEVEL1 = 'level1',
  LEVEL2 = 'level2',
  LEVEL3 = 'level3',
  CONSOLIDATED = 'consolidated',
}

/**
 * Quote update frequency
 */
export enum QuoteUpdateFrequency {
  REAL_TIME = 'real_time',
  THROTTLED_100MS = 'throttled_100ms',
  THROTTLED_500MS = 'throttled_500ms',
  THROTTLED_1S = 'throttled_1s',
  CONFLATED = 'conflated',
}

/**
 * Exchange connectivity status
 */
export enum ExchangeConnectivityStatus {
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnected',
  DEGRADED = 'degraded',
  MAINTENANCE = 'maintenance',
  FAILED = 'failed',
}

/**
 * Market data cache tier
 */
export enum CacheTier {
  HOT = 'hot',
  WARM = 'warm',
  COLD = 'cold',
  ARCHIVED = 'archived',
}

// ============================================================================
// SEQUELIZE MODEL: RealtimeQuoteStream
// ============================================================================

/**
 * TypeScript interface for RealtimeQuoteStream attributes
 */
export interface RealtimeQuoteStreamAttributes {
  id: string;
  sessionId: string;
  userId: string;
  symbols: string[];
  dataTypes: MarketDataType[];
  vendor: DataVendor;
  aggregationLevel: AggregationLevel;
  updateFrequency: QuoteUpdateFrequency;
  status: StreamingSessionStatus;
  connectionId: string | null;
  startedAt: Date;
  lastActivityAt: Date | null;
  quotesDelivered: number;
  bytesTransferred: number;
  averageLatencyMs: number | null;
  errorCount: number;
  metadata: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RealtimeQuoteStreamCreationAttributes extends Optional<RealtimeQuoteStreamAttributes, 'id' | 'connectionId' | 'lastActivityAt' | 'averageLatencyMs'> {}

/**
 * Sequelize Model: RealtimeQuoteStream
 * Real-time quote streaming sessions with performance tracking
 */
export class RealtimeQuoteStream extends Model<RealtimeQuoteStreamAttributes, RealtimeQuoteStreamCreationAttributes> implements RealtimeQuoteStreamAttributes {
  declare id: string;
  declare sessionId: string;
  declare userId: string;
  declare symbols: string[];
  declare dataTypes: MarketDataType[];
  declare vendor: DataVendor;
  declare aggregationLevel: AggregationLevel;
  declare updateFrequency: QuoteUpdateFrequency;
  declare status: StreamingSessionStatus;
  declare connectionId: string | null;
  declare startedAt: Date;
  declare lastActivityAt: Date | null;
  declare quotesDelivered: number;
  declare bytesTransferred: number;
  declare averageLatencyMs: number | null;
  declare errorCount: number;
  declare metadata: Record<string, any>;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  /**
   * Initialize RealtimeQuoteStream with Sequelize instance
   */
  static initModel(sequelize: Sequelize): typeof RealtimeQuoteStream {
    RealtimeQuoteStream.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          field: 'id',
        },
        sessionId: {
          type: DataTypes.STRING(100),
          allowNull: false,
          unique: true,
          field: 'session_id',
        },
        userId: {
          type: DataTypes.UUID,
          allowNull: false,
          field: 'user_id',
        },
        symbols: {
          type: DataTypes.ARRAY(DataTypes.STRING),
          allowNull: false,
          defaultValue: [],
          field: 'symbols',
        },
        dataTypes: {
          type: DataTypes.ARRAY(DataTypes.STRING),
          allowNull: false,
          defaultValue: [],
          field: 'data_types',
        },
        vendor: {
          type: DataTypes.STRING(50),
          allowNull: false,
          field: 'vendor',
        },
        aggregationLevel: {
          type: DataTypes.ENUM(...Object.values(AggregationLevel)),
          allowNull: false,
          defaultValue: AggregationLevel.LEVEL1,
          field: 'aggregation_level',
        },
        updateFrequency: {
          type: DataTypes.ENUM(...Object.values(QuoteUpdateFrequency)),
          allowNull: false,
          defaultValue: QuoteUpdateFrequency.REAL_TIME,
          field: 'update_frequency',
        },
        status: {
          type: DataTypes.ENUM(...Object.values(StreamingSessionStatus)),
          allowNull: false,
          defaultValue: StreamingSessionStatus.INITIALIZING,
          field: 'status',
        },
        connectionId: {
          type: DataTypes.STRING(100),
          allowNull: true,
          field: 'connection_id',
        },
        startedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'started_at',
        },
        lastActivityAt: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'last_activity_at',
        },
        quotesDelivered: {
          type: DataTypes.BIGINT,
          allowNull: false,
          defaultValue: 0,
          field: 'quotes_delivered',
        },
        bytesTransferred: {
          type: DataTypes.BIGINT,
          allowNull: false,
          defaultValue: 0,
          field: 'bytes_transferred',
        },
        averageLatencyMs: {
          type: DataTypes.FLOAT,
          allowNull: true,
          field: 'average_latency_ms',
        },
        errorCount: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
          field: 'error_count',
        },
        metadata: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'metadata',
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'created_at',
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'updated_at',
        },
      },
      {
        sequelize,
        tableName: 'realtime_quote_streams',
        modelName: 'RealtimeQuoteStream',
        timestamps: true,
        underscored: true,
        indexes: [
          { fields: ['session_id'], unique: true },
          { fields: ['user_id'] },
          { fields: ['status'] },
          { fields: ['vendor'] },
          { fields: ['started_at'] },
        ],
      }
    );

    return RealtimeQuoteStream;
  }
}

// ============================================================================
// SEQUELIZE MODEL: MarketDepthSnapshot
// ============================================================================

/**
 * TypeScript interface for MarketDepthSnapshot attributes
 */
export interface MarketDepthSnapshotAttributes {
  id: string;
  symbol: string;
  exchange: string;
  timestamp: Date;
  sequenceNumber: number;
  bids: Array<{ price: number; size: number; orders: number }>;
  asks: Array<{ price: number; size: number; orders: number }>;
  levels: number;
  spread: number;
  spreadBps: number;
  midPrice: number;
  imbalance: number;
  totalBidVolume: number;
  totalAskVolume: number;
  vendor: DataVendor;
  quality: MarketDataQuality;
  metadata: Record<string, any>;
  createdAt?: Date;
}

export interface MarketDepthSnapshotCreationAttributes extends Optional<MarketDepthSnapshotAttributes, 'id'> {}

/**
 * Sequelize Model: MarketDepthSnapshot
 * Level 2 market depth snapshots with order book state
 */
export class MarketDepthSnapshot extends Model<MarketDepthSnapshotAttributes, MarketDepthSnapshotCreationAttributes> implements MarketDepthSnapshotAttributes {
  declare id: string;
  declare symbol: string;
  declare exchange: string;
  declare timestamp: Date;
  declare sequenceNumber: number;
  declare bids: Array<{ price: number; size: number; orders: number }>;
  declare asks: Array<{ price: number; size: number; orders: number }>;
  declare levels: number;
  declare spread: number;
  declare spreadBps: number;
  declare midPrice: number;
  declare imbalance: number;
  declare totalBidVolume: number;
  declare totalAskVolume: number;
  declare vendor: DataVendor;
  declare quality: MarketDataQuality;
  declare metadata: Record<string, any>;
  declare readonly createdAt: Date;

  /**
   * Initialize MarketDepthSnapshot with Sequelize instance
   */
  static initModel(sequelize: Sequelize): typeof MarketDepthSnapshot {
    MarketDepthSnapshot.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          field: 'id',
        },
        symbol: {
          type: DataTypes.STRING(50),
          allowNull: false,
          field: 'symbol',
        },
        exchange: {
          type: DataTypes.STRING(20),
          allowNull: false,
          field: 'exchange',
        },
        timestamp: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'timestamp',
        },
        sequenceNumber: {
          type: DataTypes.BIGINT,
          allowNull: false,
          field: 'sequence_number',
        },
        bids: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: [],
          field: 'bids',
        },
        asks: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: [],
          field: 'asks',
        },
        levels: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 10,
          field: 'levels',
        },
        spread: {
          type: DataTypes.DECIMAL(19, 8),
          allowNull: false,
          field: 'spread',
        },
        spreadBps: {
          type: DataTypes.DECIMAL(10, 4),
          allowNull: false,
          field: 'spread_bps',
        },
        midPrice: {
          type: DataTypes.DECIMAL(19, 8),
          allowNull: false,
          field: 'mid_price',
        },
        imbalance: {
          type: DataTypes.DECIMAL(10, 4),
          allowNull: false,
          field: 'imbalance',
        },
        totalBidVolume: {
          type: DataTypes.BIGINT,
          allowNull: false,
          defaultValue: 0,
          field: 'total_bid_volume',
        },
        totalAskVolume: {
          type: DataTypes.BIGINT,
          allowNull: false,
          defaultValue: 0,
          field: 'total_ask_volume',
        },
        vendor: {
          type: DataTypes.STRING(50),
          allowNull: false,
          field: 'vendor',
        },
        quality: {
          type: DataTypes.STRING(50),
          allowNull: false,
          field: 'quality',
        },
        metadata: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'metadata',
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'created_at',
        },
      },
      {
        sequelize,
        tableName: 'market_depth_snapshots',
        modelName: 'MarketDepthSnapshot',
        timestamps: true,
        updatedAt: false,
        underscored: true,
        indexes: [
          { fields: ['symbol', 'timestamp'] },
          { fields: ['exchange'] },
          { fields: ['timestamp'] },
          { fields: ['sequence_number'] },
        ],
      }
    );

    return MarketDepthSnapshot;
  }
}

// ============================================================================
// SEQUELIZE MODEL: ExchangeConnection
// ============================================================================

/**
 * TypeScript interface for ExchangeConnection attributes
 */
export interface ExchangeConnectionAttributes {
  id: string;
  exchangeCode: string;
  vendor: DataVendor;
  connectionType: string;
  status: ExchangeConnectivityStatus;
  primaryEndpoint: string;
  secondaryEndpoint: string | null;
  connectedAt: Date | null;
  lastHeartbeat: Date | null;
  latencyMs: number | null;
  messageRate: number;
  errorRate: number;
  reconnectAttempts: number;
  subscribedSymbols: string[];
  supportedDataTypes: MarketDataType[];
  metadata: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ExchangeConnectionCreationAttributes extends Optional<ExchangeConnectionAttributes, 'id' | 'secondaryEndpoint' | 'connectedAt' | 'lastHeartbeat' | 'latencyMs'> {}

/**
 * Sequelize Model: ExchangeConnection
 * Exchange connectivity tracking with health monitoring
 */
export class ExchangeConnection extends Model<ExchangeConnectionAttributes, ExchangeConnectionCreationAttributes> implements ExchangeConnectionAttributes {
  declare id: string;
  declare exchangeCode: string;
  declare vendor: DataVendor;
  declare connectionType: string;
  declare status: ExchangeConnectivityStatus;
  declare primaryEndpoint: string;
  declare secondaryEndpoint: string | null;
  declare connectedAt: Date | null;
  declare lastHeartbeat: Date | null;
  declare latencyMs: number | null;
  declare messageRate: number;
  declare errorRate: number;
  declare reconnectAttempts: number;
  declare subscribedSymbols: string[];
  declare supportedDataTypes: MarketDataType[];
  declare metadata: Record<string, any>;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  /**
   * Initialize ExchangeConnection with Sequelize instance
   */
  static initModel(sequelize: Sequelize): typeof ExchangeConnection {
    ExchangeConnection.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          field: 'id',
        },
        exchangeCode: {
          type: DataTypes.STRING(20),
          allowNull: false,
          field: 'exchange_code',
        },
        vendor: {
          type: DataTypes.STRING(50),
          allowNull: false,
          field: 'vendor',
        },
        connectionType: {
          type: DataTypes.STRING(50),
          allowNull: false,
          field: 'connection_type',
        },
        status: {
          type: DataTypes.ENUM(...Object.values(ExchangeConnectivityStatus)),
          allowNull: false,
          defaultValue: ExchangeConnectivityStatus.DISCONNECTED,
          field: 'status',
        },
        primaryEndpoint: {
          type: DataTypes.STRING(255),
          allowNull: false,
          field: 'primary_endpoint',
        },
        secondaryEndpoint: {
          type: DataTypes.STRING(255),
          allowNull: true,
          field: 'secondary_endpoint',
        },
        connectedAt: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'connected_at',
        },
        lastHeartbeat: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'last_heartbeat',
        },
        latencyMs: {
          type: DataTypes.FLOAT,
          allowNull: true,
          field: 'latency_ms',
        },
        messageRate: {
          type: DataTypes.FLOAT,
          allowNull: false,
          defaultValue: 0,
          field: 'message_rate',
        },
        errorRate: {
          type: DataTypes.FLOAT,
          allowNull: false,
          defaultValue: 0,
          field: 'error_rate',
        },
        reconnectAttempts: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
          field: 'reconnect_attempts',
        },
        subscribedSymbols: {
          type: DataTypes.ARRAY(DataTypes.STRING),
          allowNull: false,
          defaultValue: [],
          field: 'subscribed_symbols',
        },
        supportedDataTypes: {
          type: DataTypes.ARRAY(DataTypes.STRING),
          allowNull: false,
          defaultValue: [],
          field: 'supported_data_types',
        },
        metadata: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'metadata',
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'created_at',
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'updated_at',
        },
      },
      {
        sequelize,
        tableName: 'exchange_connections',
        modelName: 'ExchangeConnection',
        timestamps: true,
        underscored: true,
        indexes: [
          { fields: ['exchange_code', 'vendor'], unique: true },
          { fields: ['status'] },
          { fields: ['last_heartbeat'] },
        ],
      }
    );

    return ExchangeConnection;
  }
}

// ============================================================================
// SEQUELIZE MODEL: SymbolDirectory
// ============================================================================

/**
 * TypeScript interface for SymbolDirectory attributes
 */
export interface SymbolDirectoryAttributes {
  id: string;
  symbol: string;
  exchange: string;
  securityType: string;
  name: string;
  description: string | null;
  isin: string | null;
  cusip: string | null;
  isActive: boolean;
  listingDate: Date | null;
  delistingDate: Date | null;
  sector: string | null;
  industry: string | null;
  marketCap: number | null;
  currency: string;
  tickSize: number;
  lotSize: number;
  tradingHours: Record<string, any>;
  aliases: string[];
  metadata: Record<string, any>;
  lastUpdatedBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SymbolDirectoryCreationAttributes extends Optional<SymbolDirectoryAttributes, 'id' | 'description' | 'isin' | 'cusip' | 'listingDate' | 'delistingDate' | 'sector' | 'industry' | 'marketCap'> {}

/**
 * Sequelize Model: SymbolDirectory
 * Comprehensive symbol directory for search and lookup
 */
export class SymbolDirectory extends Model<SymbolDirectoryAttributes, SymbolDirectoryCreationAttributes> implements SymbolDirectoryAttributes {
  declare id: string;
  declare symbol: string;
  declare exchange: string;
  declare securityType: string;
  declare name: string;
  declare description: string | null;
  declare isin: string | null;
  declare cusip: string | null;
  declare isActive: boolean;
  declare listingDate: Date | null;
  declare delistingDate: Date | null;
  declare sector: string | null;
  declare industry: string | null;
  declare marketCap: number | null;
  declare currency: string;
  declare tickSize: number;
  declare lotSize: number;
  declare tradingHours: Record<string, any>;
  declare aliases: string[];
  declare metadata: Record<string, any>;
  declare lastUpdatedBy: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  /**
   * Initialize SymbolDirectory with Sequelize instance
   */
  static initModel(sequelize: Sequelize): typeof SymbolDirectory {
    SymbolDirectory.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          field: 'id',
        },
        symbol: {
          type: DataTypes.STRING(50),
          allowNull: false,
          field: 'symbol',
        },
        exchange: {
          type: DataTypes.STRING(20),
          allowNull: false,
          field: 'exchange',
        },
        securityType: {
          type: DataTypes.STRING(50),
          allowNull: false,
          field: 'security_type',
        },
        name: {
          type: DataTypes.STRING(255),
          allowNull: false,
          field: 'name',
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
          field: 'description',
        },
        isin: {
          type: DataTypes.STRING(12),
          allowNull: true,
          field: 'isin',
        },
        cusip: {
          type: DataTypes.STRING(9),
          allowNull: true,
          field: 'cusip',
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
          field: 'is_active',
        },
        listingDate: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'listing_date',
        },
        delistingDate: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'delisting_date',
        },
        sector: {
          type: DataTypes.STRING(100),
          allowNull: true,
          field: 'sector',
        },
        industry: {
          type: DataTypes.STRING(100),
          allowNull: true,
          field: 'industry',
        },
        marketCap: {
          type: DataTypes.BIGINT,
          allowNull: true,
          field: 'market_cap',
        },
        currency: {
          type: DataTypes.STRING(3),
          allowNull: false,
          field: 'currency',
        },
        tickSize: {
          type: DataTypes.DECIMAL(19, 8),
          allowNull: false,
          defaultValue: 0.01,
          field: 'tick_size',
        },
        lotSize: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 1,
          field: 'lot_size',
        },
        tradingHours: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'trading_hours',
        },
        aliases: {
          type: DataTypes.ARRAY(DataTypes.STRING),
          allowNull: false,
          defaultValue: [],
          field: 'aliases',
        },
        metadata: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'metadata',
        },
        lastUpdatedBy: {
          type: DataTypes.UUID,
          allowNull: false,
          field: 'last_updated_by',
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'created_at',
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'updated_at',
        },
      },
      {
        sequelize,
        tableName: 'symbol_directory',
        modelName: 'SymbolDirectory',
        timestamps: true,
        underscored: true,
        indexes: [
          { fields: ['symbol', 'exchange'], unique: true },
          { fields: ['symbol'] },
          { fields: ['name'] },
          { fields: ['isin'], unique: true },
          { fields: ['cusip'], unique: true },
          { fields: ['is_active'] },
          { fields: ['sector'] },
          { fields: ['security_type'] },
        ],
      }
    );

    return SymbolDirectory;
  }
}

// ============================================================================
// MODEL ASSOCIATIONS
// ============================================================================

/**
 * Define associations between models
 */
export function defineRealtimeMarketDataAssociations(): void {
  // RealtimeQuoteStream associations
  // ExchangeConnection associations
  // MarketDepthSnapshot associations
  // SymbolDirectory associations
}

// ============================================================================
// REAL-TIME STREAMING FUNCTIONS
// ============================================================================

/**
 * Initialize real-time quote streaming session
 */
export async function initializeRealtimeQuoteSession(
  userId: string,
  symbols: string[],
  dataTypes: MarketDataType[],
  vendor: DataVendor,
  options?: {
    aggregationLevel?: AggregationLevel;
    updateFrequency?: QuoteUpdateFrequency;
  },
  transaction?: Transaction
): Promise<{ sessionId: string; stream: any }> {
  const logger = new Logger('RealtimeMarketData:initializeRealtimeQuoteSession');

  try {
    logger.log(`Initializing real-time quote session for ${symbols.length} symbols`);

    const sessionId = `STREAM-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Create streaming session record
    const session = await RealtimeQuoteStream.create(
      {
        sessionId,
        userId,
        symbols,
        dataTypes,
        vendor,
        aggregationLevel: options?.aggregationLevel || AggregationLevel.LEVEL1,
        updateFrequency: options?.updateFrequency || QuoteUpdateFrequency.REAL_TIME,
        status: StreamingSessionStatus.INITIALIZING,
        startedAt: new Date(),
        quotesDelivered: 0,
        bytesTransferred: 0,
        errorCount: 0,
        metadata: {},
      },
      { transaction }
    );

    // Initialize market data streams for all symbols
    const streams = await Promise.all(
      symbols.map((symbol) =>
        initializeMarketDataStream(symbol, dataTypes, vendor, (data) => {
          logger.debug(`Received data for ${symbol}: ${JSON.stringify(data)}`);
        })
      )
    );

    // Update session status
    await session.update({ status: StreamingSessionStatus.STREAMING }, { transaction });

    logger.log(`Real-time quote session initialized: ${sessionId}`);

    return {
      sessionId,
      stream: session,
    };
  } catch (error) {
    logger.error(`Failed to initialize real-time quote session: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Stream Level 1 quotes via WebSocket
 */
export async function streamLevel1Quotes(
  sessionId: string,
  websocket: WebSocket,
  symbols: string[],
  options?: {
    throttleMs?: number;
    conflate?: boolean;
  }
): Promise<void> {
  const logger = new Logger('RealtimeMarketData:streamLevel1Quotes');

  try {
    logger.log(`Streaming Level 1 quotes for session ${sessionId}`);

    await streamRealTimeQuotes(symbols, websocket, {
      throttleMs: options?.throttleMs,
      conflate: options?.conflate,
      fields: ['bid', 'ask', 'last', 'volume', 'timestamp'],
    });

    logger.log(`Level 1 streaming established for ${symbols.length} symbols`);
  } catch (error) {
    logger.error(`Failed to stream Level 1 quotes: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Stream Level 2 market depth via WebSocket
 */
export async function streamLevel2MarketDepth(
  sessionId: string,
  websocket: WebSocket,
  symbol: string,
  levels: number = 10
): Promise<void> {
  const logger = new Logger('RealtimeMarketData:streamLevel2MarketDepth');

  try {
    logger.log(`Streaming Level 2 depth for ${symbol}, ${levels} levels`);

    await streamMarketDepth(symbol, levels, websocket);

    logger.log(`Level 2 streaming established for ${symbol}`);
  } catch (error) {
    logger.error(`Failed to stream Level 2 market depth: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Stream tick-by-tick data
 */
export async function streamTickByTickData(
  sessionId: string,
  websocket: WebSocket,
  symbol: string,
  filters?: {
    includeQuotes?: boolean;
    includeTrades?: boolean;
    minSize?: number;
  }
): Promise<void> {
  const logger = new Logger('RealtimeMarketData:streamTickByTickData');

  try {
    logger.log(`Streaming tick-by-tick data for ${symbol}`);

    const dataTypes: MarketDataType[] = [];
    if (filters?.includeQuotes) dataTypes.push(MarketDataType.QUOTE);
    if (filters?.includeTrades) dataTypes.push(MarketDataType.TRADE);

    await streamTimeAndSales(symbol, websocket, {
      minSize: filters?.minSize,
    });

    logger.log(`Tick-by-tick streaming established for ${symbol}`);
  } catch (error) {
    logger.error(`Failed to stream tick-by-tick data: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Stream aggregated OHLCV bars
 */
export async function streamAggregatedBars(
  sessionId: string,
  websocket: WebSocket,
  symbol: string,
  timeFrame: TimeFrame
): Promise<void> {
  const logger = new Logger('RealtimeMarketData:streamAggregatedBars');

  try {
    logger.log(`Streaming ${timeFrame} bars for ${symbol}`);

    await streamBars(symbol, timeFrame, websocket);

    logger.log(`Bar streaming established for ${symbol}`);
  } catch (error) {
    logger.error(`Failed to stream aggregated bars: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Stream multi-symbol quotes with fan-out
 */
export async function streamMultiSymbolQuotes(
  sessionId: string,
  websocket: WebSocket,
  symbols: string[],
  dataTypes: MarketDataType[],
  maxSymbols: number = 100
): Promise<{ subscriptionId: string; subscribedSymbols: string[] }> {
  const logger = new Logger('RealtimeMarketData:streamMultiSymbolQuotes');

  try {
    logger.log(`Streaming multi-symbol quotes for ${symbols.length} symbols`);

    const result = await streamMultipleSymbols(symbols, dataTypes, websocket, maxSymbols);

    logger.log(`Multi-symbol streaming established: ${result.subscriptionId}`);

    return result;
  } catch (error) {
    logger.error(`Failed to stream multi-symbol quotes: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Pause streaming session
 */
export async function pauseStreamingSession(sessionId: string, transaction?: Transaction): Promise<void> {
  const logger = new Logger('RealtimeMarketData:pauseStreamingSession');

  try {
    logger.log(`Pausing streaming session: ${sessionId}`);

    const session = await RealtimeQuoteStream.findOne({
      where: { sessionId },
      transaction,
    });

    if (!session) {
      throw new Error(`Session not found: ${sessionId}`);
    }

    await session.update(
      {
        status: StreamingSessionStatus.PAUSED,
        lastActivityAt: new Date(),
      },
      { transaction }
    );

    logger.log(`Session paused: ${sessionId}`);
  } catch (error) {
    logger.error(`Failed to pause streaming session: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Resume streaming session
 */
export async function resumeStreamingSession(sessionId: string, transaction?: Transaction): Promise<void> {
  const logger = new Logger('RealtimeMarketData:resumeStreamingSession');

  try {
    logger.log(`Resuming streaming session: ${sessionId}`);

    const session = await RealtimeQuoteStream.findOne({
      where: { sessionId },
      transaction,
    });

    if (!session) {
      throw new Error(`Session not found: ${sessionId}`);
    }

    await session.update(
      {
        status: StreamingSessionStatus.STREAMING,
        lastActivityAt: new Date(),
      },
      { transaction }
    );

    logger.log(`Session resumed: ${sessionId}`);
  } catch (error) {
    logger.error(`Failed to resume streaming session: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Terminate streaming session
 */
export async function terminateStreamingSession(sessionId: string, transaction?: Transaction): Promise<void> {
  const logger = new Logger('RealtimeMarketData:terminateStreamingSession');

  try {
    logger.log(`Terminating streaming session: ${sessionId}`);

    const session = await RealtimeQuoteStream.findOne({
      where: { sessionId },
      transaction,
    });

    if (!session) {
      throw new Error(`Session not found: ${sessionId}`);
    }

    await session.update(
      {
        status: StreamingSessionStatus.DISCONNECTED,
        lastActivityAt: new Date(),
      },
      { transaction }
    );

    logger.log(`Session terminated: ${sessionId}`);
  } catch (error) {
    logger.error(`Failed to terminate streaming session: ${error.message}`, error.stack);
    throw error;
  }
}

// ============================================================================
// MARKET DEPTH FUNCTIONS
// ============================================================================

/**
 * Capture market depth snapshot
 */
export async function captureMarketDepthSnapshot(
  symbol: string,
  exchange: string,
  levels: number = 10,
  vendor: DataVendor = DataVendor.BLOOMBERG,
  transaction?: Transaction
): Promise<any> {
  const logger = new Logger('RealtimeMarketData:captureMarketDepthSnapshot');

  try {
    logger.log(`Capturing market depth snapshot for ${symbol}`);

    const depth = await getMarketDepth(symbol, levels);

    const snapshot = await MarketDepthSnapshot.create(
      {
        symbol,
        exchange,
        timestamp: new Date(),
        sequenceNumber: Date.now(),
        bids: depth.bidLevels.map((level) => ({
          price: level.price,
          size: level.size,
          orders: level.orders,
        })),
        asks: depth.askLevels.map((level) => ({
          price: level.price,
          size: level.size,
          orders: level.orders,
        })),
        levels,
        spread: 0.05,
        spreadBps: depth.spreadBps,
        midPrice: 0,
        imbalance: depth.depthImbalance,
        totalBidVolume: depth.aggregatedBidVolume,
        totalAskVolume: depth.aggregatedAskVolume,
        vendor,
        quality: MarketDataQuality.REAL_TIME,
        metadata: {},
      },
      { transaction }
    );

    logger.log(`Market depth snapshot captured: ${snapshot.id}`);

    return snapshot;
  } catch (error) {
    logger.error(`Failed to capture market depth snapshot: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Get current order book
 */
export async function getCurrentOrderBook(
  symbol: string,
  levels: number = 10
): Promise<OrderBookSnapshot> {
  const logger = new Logger('RealtimeMarketData:getCurrentOrderBook');

  try {
    logger.log(`Getting current order book for ${symbol}`);

    const depth = await getMarketDepth(symbol, levels);

    const orderBook: OrderBookSnapshot = {
      symbol,
      exchange: 'COMPOSITE',
      timestamp: new Date(),
      sequenceNumber: Date.now(),
      bids: depth.bidLevels.map((level) => ({
        price: level.price,
        size: level.size,
        orders: level.orders,
      })),
      asks: depth.askLevels.map((level) => ({
        price: level.price,
        size: level.size,
        orders: level.orders,
      })),
      totalBidVolume: depth.aggregatedBidVolume,
      totalAskVolume: depth.aggregatedAskVolume,
      imbalance: depth.depthImbalance,
    };

    return orderBook;
  } catch (error) {
    logger.error(`Failed to get current order book: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Update order book with Level 2 data
 */
export async function updateOrderBookWithLevel2(
  symbol: string,
  update: MarketDepthUpdate,
  transaction?: Transaction
): Promise<OrderBookSnapshot> {
  const logger = new Logger('RealtimeMarketData:updateOrderBookWithLevel2');

  try {
    logger.log(`Updating order book for ${symbol} with Level 2 data`);

    const orderBook = await updateOrderBook(symbol, {
      securityId: symbol,
      timestamp: new Date(),
      timestampMicros: Date.now() * 1000,
      side: update.side,
      priceLevel: 0,
      price: update.level.price,
      size: update.level.size,
      orderCount: update.level.numberOfOrders,
      marketMaker: null,
      exchange: update.level.exchange || '',
      action: update.action,
    });

    return orderBook;
  } catch (error) {
    logger.error(`Failed to update order book: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Calculate order book liquidity metrics
 */
export async function calculateOrderBookLiquidityMetrics(
  symbol: string
): Promise<{
  totalLiquidity: number;
  bidLiquidity: number;
  askLiquidity: number;
  depthScore: number;
  liquidityImbalance: number;
}> {
  const logger = new Logger('RealtimeMarketData:calculateOrderBookLiquidityMetrics');

  try {
    logger.log(`Calculating liquidity metrics for ${symbol}`);

    const orderBook = await getCurrentOrderBook(symbol, 20);

    const bidLiquidity = orderBook.totalBidVolume;
    const askLiquidity = orderBook.totalAskVolume;
    const totalLiquidity = bidLiquidity + askLiquidity;
    const liquidityImbalance = orderBook.imbalance;
    const depthScore = Math.min(totalLiquidity / 1000000, 1.0);

    return {
      totalLiquidity,
      bidLiquidity,
      askLiquidity,
      depthScore,
      liquidityImbalance,
    };
  } catch (error) {
    logger.error(`Failed to calculate liquidity metrics: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Detect order book imbalance
 */
export async function detectBookImbalance(
  symbol: string,
  threshold: number = 0.2
): Promise<{ imbalanced: boolean; ratio: number; direction: string; severity: string }> {
  const logger = new Logger('RealtimeMarketData:detectBookImbalance');

  try {
    logger.log(`Detecting order book imbalance for ${symbol}`);

    const orderBook = await getCurrentOrderBook(symbol, 10);

    const imbalance = await detectOrderBookImbalance(orderBook, threshold);

    const severity =
      Math.abs(imbalance.ratio) > 0.5 ? 'HIGH' : Math.abs(imbalance.ratio) > 0.3 ? 'MEDIUM' : 'LOW';

    return {
      ...imbalance,
      severity,
    };
  } catch (error) {
    logger.error(`Failed to detect book imbalance: ${error.message}`, error.stack);
    throw error;
  }
}

// ============================================================================
// QUOTE AGGREGATION FUNCTIONS
// ============================================================================

/**
 * Aggregate quotes from multiple exchanges
 */
export async function aggregateMultiExchangeQuotes(
  symbol: string,
  vendors: DataVendor[] = [DataVendor.BLOOMBERG, DataVendor.REUTERS, DataVendor.ICE]
): Promise<AggregatedQuote> {
  const logger = new Logger('RealtimeMarketData:aggregateMultiExchangeQuotes');

  try {
    logger.log(`Aggregating quotes for ${symbol} from ${vendors.length} vendors`);

    const aggregated = await aggregateQuotes(symbol, vendors);

    logger.log(`Aggregated quote: NBBO ${aggregated.nbbo.bidPrice} x ${aggregated.nbbo.askPrice}`);

    return aggregated;
  } catch (error) {
    logger.error(`Failed to aggregate multi-exchange quotes: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Calculate National Best Bid and Offer (NBBO)
 */
export async function calculateNationalBestBidOffer(
  symbol: string,
  quotes: Map<string, MarketDataQuote>
): Promise<{ bidPrice: number; bidSize: number; askPrice: number; askSize: number; timestamp: Date }> {
  const logger = new Logger('RealtimeMarketData:calculateNationalBestBidOffer');

  try {
    logger.log(`Calculating NBBO for ${symbol}`);

    const nbbo = calculateNBBO(quotes);

    logger.log(`NBBO calculated: ${nbbo.bidPrice} x ${nbbo.askPrice}`);

    return nbbo;
  } catch (error) {
    logger.error(`Failed to calculate NBBO: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Detect cross-venue arbitrage opportunities
 */
export async function detectCrossVenueArbitrage(
  symbol: string,
  minSpread: number = 0.01
): Promise<
  Array<{
    type: 'BUY_SELL' | 'SELL_BUY';
    buyVenue: string;
    sellVenue: string;
    profitPerShare: number;
    profitPercent: number;
    confidence: number;
  }>
> {
  const logger = new Logger('RealtimeMarketData:detectCrossVenueArbitrage');

  try {
    logger.log(`Detecting arbitrage opportunities for ${symbol}`);

    const aggregated = await aggregateQuotes(symbol, [
      DataVendor.BLOOMBERG,
      DataVendor.REUTERS,
      DataVendor.ICE,
    ]);

    const opportunities = await detectArbitrageOpportunities(symbol, aggregated, minSpread);

    if (opportunities.length > 0) {
      logger.log(`Found ${opportunities.length} arbitrage opportunities`);
    }

    return opportunities;
  } catch (error) {
    logger.error(`Failed to detect cross-venue arbitrage: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Normalize quotes from different vendors
 */
export async function normalizeVendorQuotes(
  rawData: any,
  vendor: DataVendor
): Promise<MarketDataQuote> {
  const logger = new Logger('RealtimeMarketData:normalizeVendorQuotes');

  try {
    logger.log(`Normalizing quote from ${vendor}`);

    const normalized = normalizeMarketData(rawData, vendor) as MarketDataQuote;

    return normalized;
  } catch (error) {
    logger.error(`Failed to normalize vendor quotes: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Normalize Bloomberg quote data
 */
export async function normalizeBloombergQuoteData(data: any): Promise<MarketDataQuote> {
  const logger = new Logger('RealtimeMarketData:normalizeBloombergQuoteData');

  try {
    logger.log('Normalizing Bloomberg quote data');

    const normalized = normalizeBloombergData(data);

    return normalized;
  } catch (error) {
    logger.error(`Failed to normalize Bloomberg data: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Normalize Reuters quote data
 */
export async function normalizeReutersQuoteData(data: any): Promise<MarketDataQuote> {
  const logger = new Logger('RealtimeMarketData:normalizeReutersQuoteData');

  try {
    logger.log('Normalizing Reuters quote data');

    const normalized = normalizeReutersData(data);

    return normalized;
  } catch (error) {
    logger.error(`Failed to normalize Reuters data: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Normalize ICE quote data
 */
export async function normalizeICEQuoteData(data: any): Promise<MarketDataQuote> {
  const logger = new Logger('RealtimeMarketData:normalizeICEQuoteData');

  try {
    logger.log('Normalizing ICE quote data');

    const normalized = normalizeICEData(data);

    return normalized;
  } catch (error) {
    logger.error(`Failed to normalize ICE data: ${error.message}`, error.stack);
    throw error;
  }
}

// ============================================================================
// SUBSCRIPTION MANAGEMENT FUNCTIONS
// ============================================================================

/**
 * Create market data subscription
 */
export async function createMarketDataSubscription(
  userId: string,
  symbol: string,
  dataType: MarketDataType,
  options: {
    timeFrame?: TimeFrame;
    fields?: string[];
    vendor?: DataVendor;
    quality?: MarketDataQuality;
    deliveryMethod?: 'WEBSOCKET' | 'HTTP_STREAMING' | 'CALLBACK' | 'QUEUE';
    throttleMs?: number;
  }
): Promise<MarketDataSubscription> {
  const logger = new Logger('RealtimeMarketData:createMarketDataSubscription');

  try {
    logger.log(`Creating subscription for ${userId}: ${symbol} ${dataType}`);

    const subscription = await createSubscription(userId, symbol, dataType, options);

    logger.log(`Subscription created: ${subscription.subscriptionId}`);

    return subscription;
  } catch (error) {
    logger.error(`Failed to create subscription: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Cancel market data subscription
 */
export async function cancelMarketDataSubscription(
  subscriptionId: string,
  userId: string
): Promise<void> {
  const logger = new Logger('RealtimeMarketData:cancelMarketDataSubscription');

  try {
    logger.log(`Canceling subscription: ${subscriptionId}`);

    await cancelSubscription(subscriptionId, userId);

    logger.log(`Subscription canceled: ${subscriptionId}`);
  } catch (error) {
    logger.error(`Failed to cancel subscription: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Get user's active subscriptions
 */
export async function getActiveUserSubscriptions(
  userId: string,
  filters?: {
    status?: SubscriptionStatus;
    dataType?: MarketDataType;
    vendor?: DataVendor;
  }
): Promise<MarketDataSubscription[]> {
  const logger = new Logger('RealtimeMarketData:getActiveUserSubscriptions');

  try {
    logger.log(`Getting subscriptions for user ${userId}`);

    const subscriptions = await getUserSubscriptions(userId, filters);

    logger.log(`Found ${subscriptions.length} subscriptions`);

    return subscriptions;
  } catch (error) {
    logger.error(`Failed to get user subscriptions: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Batch subscribe to multiple symbols
 */
export async function batchSubscribeSymbols(
  userId: string,
  symbols: string[],
  dataType: MarketDataType,
  options?: {
    vendor?: DataVendor;
    quality?: MarketDataQuality;
  }
): Promise<{ subscriptions: MarketDataSubscription[]; failed: string[] }> {
  const logger = new Logger('RealtimeMarketData:batchSubscribeSymbols');

  try {
    logger.log(`Batch subscribing ${symbols.length} symbols for user ${userId}`);

    const subscriptions: MarketDataSubscription[] = [];
    const failed: string[] = [];

    for (const symbol of symbols) {
      try {
        const subscription = await createSubscription(userId, symbol, dataType, {
          vendor: options?.vendor,
          quality: options?.quality,
        });
        subscriptions.push(subscription);
      } catch (error) {
        logger.warn(`Failed to subscribe to ${symbol}: ${error.message}`);
        failed.push(symbol);
      }
    }

    logger.log(`Batch subscribe complete: ${subscriptions.length} succeeded, ${failed.length} failed`);

    return { subscriptions, failed };
  } catch (error) {
    logger.error(`Failed to batch subscribe symbols: ${error.message}`, error.stack);
    throw error;
  }
}

// ============================================================================
// HISTORICAL DATA FUNCTIONS
// ============================================================================

/**
 * Retrieve historical quotes
 */
export async function retrieveHistoricalQuotes(
  request: HistoricalDataRequest
): Promise<MarketDataQuote[]> {
  const logger = new Logger('RealtimeMarketData:retrieveHistoricalQuotes');

  try {
    logger.log(`Retrieving historical quotes for ${request.symbol}`);

    const quotes = await getHistoricalQuotes(request);

    logger.log(`Retrieved ${quotes.length} historical quotes`);

    return quotes;
  } catch (error) {
    logger.error(`Failed to retrieve historical quotes: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Retrieve historical OHLCV bars
 */
export async function retrieveHistoricalBars(
  request: HistoricalDataRequest
): Promise<any[]> {
  const logger = new Logger('RealtimeMarketData:retrieveHistoricalBars');

  try {
    logger.log(`Retrieving historical bars for ${request.symbol}`);

    const bars = await getHistoricalBars(request);

    logger.log(`Retrieved ${bars.length} historical bars`);

    return bars;
  } catch (error) {
    logger.error(`Failed to retrieve historical bars: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Retrieve historical time and sales
 */
export async function retrieveHistoricalTimeAndSales(
  symbol: string,
  startDate: Date,
  endDate: Date,
  filters?: {
    minSize?: number;
    exchanges?: string[];
  }
): Promise<TimeAndSales> {
  const logger = new Logger('RealtimeMarketData:retrieveHistoricalTimeAndSales');

  try {
    logger.log(`Retrieving historical time and sales for ${symbol}`);

    const data = await getHistoricalTimeAndSales(symbol, startDate, endDate, filters);

    logger.log(`Retrieved time and sales: ${data.trades.length} trades`);

    return data;
  } catch (error) {
    logger.error(`Failed to retrieve historical time and sales: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Generate OHLCV bars from tick data
 */
export async function generateBarsFromTicks(
  symbol: string,
  interval: string,
  startTime: Date,
  endTime: Date
): Promise<any[]> {
  const logger = new Logger('RealtimeMarketData:generateBarsFromTicks');

  try {
    logger.log(`Generating ${interval} bars for ${symbol}`);

    const bars = await generateOHLCVBars(symbol, interval, startTime, endTime);

    logger.log(`Generated ${bars.length} OHLCV bars`);

    return bars;
  } catch (error) {
    logger.error(`Failed to generate bars from ticks: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Calculate VWAP for time period
 */
export async function calculateVWAPForPeriod(
  symbol: string,
  startTime: Date,
  endTime: Date
): Promise<number> {
  const logger = new Logger('RealtimeMarketData:calculateVWAPForPeriod');

  try {
    logger.log(`Calculating VWAP for ${symbol}`);

    const vwap = await calculateVWAP(symbol, startTime, endTime);

    logger.log(`VWAP calculated: ${vwap}`);

    return vwap;
  } catch (error) {
    logger.error(`Failed to calculate VWAP: ${error.message}`, error.stack);
    throw error;
  }
}

// ============================================================================
// DATA QUALITY FUNCTIONS
// ============================================================================

/**
 * Validate market data quality
 */
export async function validateDataQuality(quote: MarketDataQuote): Promise<{
  isValid: boolean;
  issues: Array<{ severity: 'ERROR' | 'WARNING'; message: string }>;
}> {
  const logger = new Logger('RealtimeMarketData:validateDataQuality');

  try {
    logger.log(`Validating data quality for ${quote.symbol}`);

    const validation = await validateMarketDataQuality(quote);

    if (!validation.isValid) {
      logger.warn(`Data quality issues found: ${validation.issues.length} issues`);
    }

    return validation;
  } catch (error) {
    logger.error(`Failed to validate data quality: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Monitor feed health
 */
export async function monitorMarketDataFeedHealth(
  vendor: DataVendor,
  windowMs: number = 60000
): Promise<any> {
  const logger = new Logger('RealtimeMarketData:monitorMarketDataFeedHealth');

  try {
    logger.log(`Monitoring feed health for ${vendor}`);

    const metrics = await monitorFeedHealth(vendor, windowMs);

    logger.log(`Feed health metrics retrieved for ${vendor}`);

    return metrics;
  } catch (error) {
    logger.error(`Failed to monitor feed health: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Detect duplicate messages
 */
export async function detectDuplicateMessages(
  messages: Array<{ sequenceNumber: number; timestamp: Date; data: any }>
): Promise<Array<{ sequenceNumber: number; timestamp: Date; data: any }>> {
  const logger = new Logger('RealtimeMarketData:detectDuplicateMessages');

  try {
    logger.log(`Detecting duplicates in ${messages.length} messages`);

    const unique = detectDuplicates(messages);

    const duplicateCount = messages.length - unique.length;

    if (duplicateCount > 0) {
      logger.warn(`Detected ${duplicateCount} duplicate messages`);
    }

    return unique;
  } catch (error) {
    logger.error(`Failed to detect duplicate messages: ${error.message}`, error.stack);
    throw error;
  }
}

// ============================================================================
// EXCHANGE CONNECTIVITY FUNCTIONS
// ============================================================================

/**
 * Connect to Bloomberg Terminal
 */
export async function connectToBloombergTerminal(
  config: VendorConnectionConfig
): Promise<any> {
  const logger = new Logger('RealtimeMarketData:connectToBloombergTerminal');

  try {
    logger.log('Connecting to Bloomberg Terminal');

    const connection = await connectToBloomberg(config);

    logger.log('Bloomberg Terminal connection established');

    return connection;
  } catch (error) {
    logger.error(`Failed to connect to Bloomberg Terminal: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Connect to Reuters DataScope
 */
export async function connectToReutersDataScope(
  config: VendorConnectionConfig
): Promise<any> {
  const logger = new Logger('RealtimeMarketData:connectToReutersDataScope');

  try {
    logger.log('Connecting to Reuters DataScope');

    const connection = await connectToReuters(config);

    logger.log('Reuters DataScope connection established');

    return connection;
  } catch (error) {
    logger.error(`Failed to connect to Reuters DataScope: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Connect to ICE Data Services
 */
export async function connectToICEDataServices(
  config: VendorConnectionConfig
): Promise<any> {
  const logger = new Logger('RealtimeMarketData:connectToICEDataServices');

  try {
    logger.log('Connecting to ICE Data Services');

    const connection = await connectToICE(config);

    logger.log('ICE Data Services connection established');

    return connection;
  } catch (error) {
    logger.error(`Failed to connect to ICE Data Services: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Handle vendor failover
 */
export async function handleExchangeFailover(
  primaryVendor: DataVendor,
  secondaryVendor: DataVendor,
  subscriptions: MarketDataSubscription[]
): Promise<void> {
  const logger = new Logger('RealtimeMarketData:handleExchangeFailover');

  try {
    logger.log(`Initiating failover from ${primaryVendor} to ${secondaryVendor}`);

    await handleVendorFailover(primaryVendor, secondaryVendor, subscriptions);

    logger.log('Failover completed successfully');
  } catch (error) {
    logger.error(`Failed to handle exchange failover: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Monitor exchange connectivity status
 */
export async function monitorExchangeConnectivity(
  exchangeCode: string,
  vendor: DataVendor,
  transaction?: Transaction
): Promise<ExchangeConnection> {
  const logger = new Logger('RealtimeMarketData:monitorExchangeConnectivity');

  try {
    logger.log(`Monitoring connectivity for ${exchangeCode} via ${vendor}`);

    const connection = await ExchangeConnection.findOne({
      where: { exchangeCode, vendor },
      transaction,
    });

    if (!connection) {
      throw new Error(`Connection not found: ${exchangeCode} via ${vendor}`);
    }

    // Update heartbeat
    await connection.update({ lastHeartbeat: new Date() }, { transaction });

    return connection;
  } catch (error) {
    logger.error(`Failed to monitor exchange connectivity: ${error.message}`, error.stack);
    throw error;
  }
}

// ============================================================================
// SNAPSHOT & CACHING FUNCTIONS
// ============================================================================

/**
 * Cache market data snapshot
 */
export async function cacheMarketDataSnapshot(
  symbol: string,
  dataType: MarketDataType,
  data: any,
  ttl: number = 5000
): Promise<void> {
  const logger = new Logger('RealtimeMarketData:cacheMarketDataSnapshot');

  try {
    logger.log(`Caching market data for ${symbol}`);

    await cacheMarketData(symbol, dataType, data, ttl);

    logger.log(`Market data cached for ${symbol}`);
  } catch (error) {
    logger.error(`Failed to cache market data: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Retrieve cached market data
 */
export async function retrieveCachedMarketData(
  symbol: string,
  dataType: MarketDataType
): Promise<any | null> {
  const logger = new Logger('RealtimeMarketData:retrieveCachedMarketData');

  try {
    logger.log(`Retrieving cached data for ${symbol}`);

    const cached = await getCachedMarketData(symbol, dataType);

    if (cached) {
      logger.log(`Cache hit for ${symbol}`);
    } else {
      logger.log(`Cache miss for ${symbol}`);
    }

    return cached;
  } catch (error) {
    logger.error(`Failed to retrieve cached data: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Get latest market snapshot
 */
export async function getLatestSnapshot(symbol: string): Promise<any> {
  const logger = new Logger('RealtimeMarketData:getLatestSnapshot');

  try {
    logger.log(`Getting latest snapshot for ${symbol}`);

    const snapshot = await getLatestMarketSnapshot(symbol);

    return snapshot;
  } catch (error) {
    logger.error(`Failed to get latest snapshot: ${error.message}`, error.stack);
    throw error;
  }
}

// ============================================================================
// SYMBOL SEARCH FUNCTIONS
// ============================================================================

/**
 * Search symbols by query
 */
export async function searchSymbolsByQuery(
  query: string,
  filters?: {
    exchange?: string;
    securityType?: string;
    isActive?: boolean;
  },
  limit: number = 50,
  transaction?: Transaction
): Promise<SymbolDirectory[]> {
  const logger = new Logger('RealtimeMarketData:searchSymbolsByQuery');

  try {
    logger.log(`Searching symbols with query: ${query}`);

    const whereClause: any = {
      [Op.or]: [
        { symbol: { [Op.iLike]: `%${query}%` } },
        { name: { [Op.iLike]: `%${query}%` } },
        { aliases: { [Op.contains]: [query] } },
      ],
    };

    if (filters?.exchange) {
      whereClause.exchange = filters.exchange;
    }

    if (filters?.securityType) {
      whereClause.securityType = filters.securityType;
    }

    if (filters?.isActive !== undefined) {
      whereClause.isActive = filters.isActive;
    }

    const results = await SymbolDirectory.findAll({
      where: whereClause,
      limit,
      order: [['symbol', 'ASC']],
      transaction,
    });

    logger.log(`Found ${results.length} symbols matching query`);

    return results;
  } catch (error) {
    logger.error(`Failed to search symbols: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Lookup symbol by identifier
 */
export async function lookupSymbolByIdentifier(
  identifier: string,
  identifierType?: string
): Promise<any> {
  const logger = new Logger('RealtimeMarketData:lookupSymbolByIdentifier');

  try {
    logger.log(`Looking up symbol: ${identifier}`);

    const symbol = await findSecurityByIdentifier(identifier, identifierType);

    return symbol;
  } catch (error) {
    logger.error(`Failed to lookup symbol: ${error.message}`, error.stack);
    throw error;
  }
}

// ============================================================================
// MARKET STATUS FUNCTIONS
// ============================================================================

/**
 * Check if market is currently open
 */
export async function checkMarketStatus(
  exchange: string,
  timestamp?: Date
): Promise<{ open: boolean; session: string; nextOpen?: Date; nextClose?: Date }> {
  const logger = new Logger('RealtimeMarketData:checkMarketStatus');

  try {
    logger.log(`Checking market status for ${exchange}`);

    const status = await isMarketOpen(exchange, timestamp);

    logger.log(`Market status: ${status.open ? 'OPEN' : 'CLOSED'}`);

    return status;
  } catch (error) {
    logger.error(`Failed to check market status: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Get trading hours for exchange
 */
export async function getExchangeTradingHours(exchange: string, date: Date): Promise<any> {
  const logger = new Logger('RealtimeMarketData:getExchangeTradingHours');

  try {
    logger.log(`Getting trading hours for ${exchange}`);

    const hours = await getTradingHours(exchange, date);

    return hours;
  } catch (error) {
    logger.error(`Failed to get trading hours: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Get next trading day
 */
export async function getNextAvailableTradingDay(
  exchange: string,
  fromDate?: Date
): Promise<Date> {
  const logger = new Logger('RealtimeMarketData:getNextAvailableTradingDay');

  try {
    logger.log(`Getting next trading day for ${exchange}`);

    const nextDay = await getNextTradingDay(exchange, fromDate);

    return nextDay;
  } catch (error) {
    logger.error(`Failed to get next trading day: ${error.message}`, error.stack);
    throw error;
  }
}

// ============================================================================
// TRADE REPORTING & FILTERING FUNCTIONS
// ============================================================================

/**
 * Process realtime trade
 */
export async function processRealtimeTradeData(trade: any, transaction?: Transaction): Promise<any> {
  const logger = new Logger('RealtimeMarketData:processRealtimeTradeData');

  try {
    logger.log(`Processing realtime trade for ${trade.securityId}`);

    const processed = await processRealtimeTrade(trade, transaction);

    return processed;
  } catch (error) {
    logger.error(`Failed to process realtime trade: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Process realtime quote
 */
export async function processRealtimeQuoteData(quote: any, transaction?: Transaction): Promise<any> {
  const logger = new Logger('RealtimeMarketData:processRealtimeQuoteData');

  try {
    logger.log(`Processing realtime quote for ${quote.securityId}`);

    const processed = await processRealtimeQuote(quote, transaction);

    return processed;
  } catch (error) {
    logger.error(`Failed to process realtime quote: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Export: Initialize all models
 */
export function initializeRealtimeMarketDataModels(sequelize: Sequelize): void {
  RealtimeQuoteStream.initModel(sequelize);
  MarketDepthSnapshot.initModel(sequelize);
  ExchangeConnection.initModel(sequelize);
  SymbolDirectory.initModel(sequelize);
  defineRealtimeMarketDataAssociations();
}
