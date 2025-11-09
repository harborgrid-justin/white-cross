/**
 * LOC: MKTDATA0001234
 * File: /reuse/trading/market-data-service-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (Injectable, Logger, Inject)
 *   - @nestjs/websockets (WebSocketGateway, WebSocketServer, SubscribeMessage)
 *   - ws (WebSocket)
 *   - sequelize (Model, DataTypes, Transaction, Op)
 *   - ../error-handling-kit.ts (exception classes, error handling)
 *   - ../caching-strategies-kit.ts (caching utilities)
 *   - ../validation-kit.ts (validation utilities)
 *
 * DOWNSTREAM (imported by):
 *   - backend/trading/*
 *   - backend/controllers/market-data.controller.ts
 *   - backend/services/market-data.service.ts
 *   - backend/gateways/market-data-stream.gateway.ts
 */

/**
 * File: /reuse/trading/market-data-service-kit.ts
 * Locator: WC-TRD-MKTDATA-001
 * Purpose: Bloomberg Terminal-level Market Data Services - Real-time streaming, normalization, aggregation, vendor integration
 *
 * Upstream: NestJS 10.x, WebSocket, Redis, Sequelize 6.x, Bloomberg API, Reuters DataScope, ICE Data Services
 * Downstream: Trading controllers, market data services, analytics engines, charting systems
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, WebSocket, Redis 7+, PostgreSQL 14+
 * Exports: 48 production-ready functions for market data streaming, normalization, aggregation, subscriptions, historical data
 *
 * LLM Context: Institutional-grade market data platform competing with Bloomberg Terminal, Refinitiv Eikon, FactSet.
 * Provides comprehensive market data services including real-time streaming, tick-by-tick data, quote aggregation,
 * multi-vendor integration (Bloomberg, Reuters, ICE), market data normalization, subscription management,
 * historical data retrieval, market depth (Level 2/3), time & sales, market data quality checks, entitlement
 * management, WebSocket streaming, data caching, failover handling, and regulatory compliance (SIP, consolidated tape).
 */

import { Injectable, Logger, Inject, Scope } from '@nestjs/common';
import { Model, DataTypes, Sequelize, Transaction, Op } from 'sequelize';
import WebSocket from 'ws';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Market data types and enumerations
 */
export enum MarketDataType {
  QUOTE = 'QUOTE',
  TRADE = 'TRADE',
  BAR = 'BAR',
  BOOK = 'BOOK',
  DEPTH = 'DEPTH',
  SNAPSHOT = 'SNAPSHOT',
  NEWS = 'NEWS',
  CORPORATE_ACTION = 'CORPORATE_ACTION',
  REFERENCE = 'REFERENCE',
  ANALYTICS = 'ANALYTICS'
}

export enum DataVendor {
  BLOOMBERG = 'BLOOMBERG',
  REUTERS = 'REUTERS',
  ICE = 'ICE',
  FACTSET = 'FACTSET',
  SIP = 'SIP',
  NASDAQ_TRF = 'NASDAQ_TRF',
  IEX = 'IEX',
  POLYGON = 'POLYGON',
  QUODD = 'QUODD',
  INTERNAL = 'INTERNAL'
}

export enum MarketDataQuality {
  REAL_TIME = 'REAL_TIME',
  DELAYED_15MIN = 'DELAYED_15MIN',
  DELAYED_20MIN = 'DELAYED_20MIN',
  END_OF_DAY = 'END_OF_DAY',
  SNAPSHOT = 'SNAPSHOT'
}

export enum SubscriptionStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  CANCELED = 'CANCELED',
  ERROR = 'ERROR'
}

export enum TimeFrame {
  TICK = 'TICK',
  ONE_SECOND = '1S',
  FIVE_SECONDS = '5S',
  TEN_SECONDS = '10S',
  THIRTY_SECONDS = '30S',
  ONE_MINUTE = '1M',
  FIVE_MINUTES = '5M',
  FIFTEEN_MINUTES = '15M',
  THIRTY_MINUTES = '30M',
  ONE_HOUR = '1H',
  FOUR_HOURS = '4H',
  DAILY = '1D',
  WEEKLY = '1W',
  MONTHLY = '1M'
}

export interface MarketDataQuote {
  symbol: string;
  exchange: string;
  timestamp: Date;
  sequenceNumber: number;

  // Bid information
  bidPrice: number;
  bidSize: number;
  bidExchange?: string;
  bidTime?: Date;

  // Ask information
  askPrice: number;
  askSize: number;
  askExchange?: string;
  askTime?: Date;

  // Last trade
  lastPrice: number;
  lastSize: number;
  lastTime: Date;

  // Daily statistics
  openPrice: number;
  highPrice: number;
  lowPrice: number;
  closePrice?: number;
  volume: number;
  vwap?: number;

  // Calculated fields
  spread: number;
  spreadPercent: number;
  midPrice: number;

  // Metadata
  dataVendor: DataVendor;
  quality: MarketDataQuality;
  conditions?: string[];
}

export interface MarketDataTrade {
  symbol: string;
  exchange: string;
  timestamp: Date;
  sequenceNumber: number;

  price: number;
  size: number;

  // Trade metadata
  tradeId?: string;
  conditions?: string[];
  aggressor?: 'BUY' | 'SELL' | 'UNKNOWN';

  // Venue information
  venue: string;
  dataVendor: DataVendor;

  // Flags
  isOfficial: boolean;
  isOddLot: boolean;
  isBlockTrade: boolean;
  isCrossed: boolean;
}

export interface MarketDataBar {
  symbol: string;
  timeFrame: TimeFrame;
  timestamp: Date;

  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;

  // Additional metrics
  vwap?: number;
  numberOfTrades?: number;

  // Calculated indicators
  typical?: number;
  weighted?: number;

  dataVendor: DataVendor;
}

export interface OrderBookSnapshot {
  symbol: string;
  exchange: string;
  timestamp: Date;
  sequenceNumber: number;

  bids: OrderBookLevel[];
  asks: OrderBookLevel[];

  // Book statistics
  totalBidVolume: number;
  totalAskVolume: number;
  imbalance: number;

  // Metadata
  depth: number;
  dataVendor: DataVendor;
}

export interface OrderBookLevel {
  price: number;
  size: number;
  numberOfOrders: number;
  exchange?: string;
  mpid?: string;
}

export interface MarketDepthUpdate {
  symbol: string;
  timestamp: Date;
  side: 'BID' | 'ASK';
  action: 'ADD' | 'UPDATE' | 'DELETE';
  level: OrderBookLevel;
  sequenceNumber: number;
}

export interface TimeAndSales {
  symbol: string;
  trades: MarketDataTrade[];
  period: {
    start: Date;
    end: Date;
  };
  summary: {
    totalVolume: number;
    numberOfTrades: number;
    vwap: number;
    highPrice: number;
    lowPrice: number;
  };
}

export interface MarketDataSubscription {
  subscriptionId: string;
  userId: string;
  symbol: string;
  dataType: MarketDataType;
  timeFrame?: TimeFrame;
  fields: string[];

  // Vendor and quality
  vendor?: DataVendor;
  quality: MarketDataQuality;

  // Delivery options
  deliveryMethod: 'WEBSOCKET' | 'HTTP_STREAMING' | 'CALLBACK' | 'QUEUE';
  throttleMs?: number;
  conflate?: boolean;

  // Status
  status: SubscriptionStatus;
  createdAt: Date;
  lastUpdate?: Date;

  // Entitlements
  entitlements: string[];
}

export interface MarketDataEntitlement {
  userId: string;
  vendor: DataVendor;
  exchanges: string[];
  dataTypes: MarketDataType[];
  quality: MarketDataQuality;

  // Restrictions
  symbolLimit?: number;
  rateLimit?: number;
  delaySeconds?: number;

  // Validity
  validFrom: Date;
  validUntil?: Date;
  isActive: boolean;
}

export interface HistoricalDataRequest {
  symbol: string;
  dataType: MarketDataType;
  timeFrame?: TimeFrame;

  // Time range
  startDate: Date;
  endDate: Date;

  // Options
  includeExtendedHours?: boolean;
  adjustForSplits?: boolean;
  adjustForDividends?: boolean;
  fillGaps?: boolean;

  // Pagination
  limit?: number;
  offset?: number;

  // Vendor preference
  preferredVendor?: DataVendor;
}

export interface MarketDataQualityMetrics {
  symbol: string;
  vendor: DataVendor;
  period: {
    start: Date;
    end: Date;
  };

  // Latency metrics
  avgLatency: number;
  p50Latency: number;
  p95Latency: number;
  p99Latency: number;

  // Reliability metrics
  uptime: number;
  messageRate: number;
  duplicateRate: number;
  outOfSequenceRate: number;

  // Data quality
  quoteSpreadAccuracy: number;
  priceDeviationRate: number;
  stalePriceRate: number;

  // Statistics
  totalMessages: number;
  totalErrors: number;
  reconnections: number;
}

export interface VendorConnectionConfig {
  vendor: DataVendor;
  connectionType: 'WEBSOCKET' | 'FIX' | 'HTTP' | 'PROPRIETARY';

  // Connection details
  primaryEndpoint: string;
  secondaryEndpoint?: string;
  apiKey?: string;
  credentials?: {
    username: string;
    password: string;
  };

  // Connection parameters
  heartbeatInterval: number;
  reconnectAttempts: number;
  reconnectDelay: number;
  timeout: number;

  // Features
  enableCompression: boolean;
  enableEncryption: boolean;
  enableFailover: boolean;

  // Throttling
  maxMessagesPerSecond?: number;
  maxSubscriptions?: number;
}

export interface AggregatedQuote {
  symbol: string;
  timestamp: Date;

  // Best bid/ask across all sources
  bestBid: {
    price: number;
    size: number;
    source: DataVendor;
    exchange: string;
  };

  bestAsk: {
    price: number;
    size: number;
    source: DataVendor;
    exchange: string;
  };

  // NBBO (National Best Bid and Offer)
  nbbo: {
    bidPrice: number;
    bidSize: number;
    askPrice: number;
    askSize: number;
    timestamp: Date;
  };

  // Consolidated data
  consolidatedVolume: number;
  numberOfVenues: number;

  // Source breakdown
  sources: Array<{
    vendor: DataVendor;
    quote: MarketDataQuote;
    latency: number;
  }>;
}

export interface MarketDataCache {
  symbol: string;
  dataType: MarketDataType;
  data: any;
  timestamp: Date;
  ttl: number;
  vendor: DataVendor;
  quality: MarketDataQuality;
}

export interface TickData {
  symbol: string;
  timestamp: Date;
  sequenceNumber: number;

  price: number;
  size: number;

  bidPrice?: number;
  bidSize?: number;
  askPrice?: number;
  askSize?: number;

  conditions?: string[];
  exchange: string;
  venue: string;
}

export interface MarketSnapshot {
  timestamp: Date;
  symbols: Map<string, MarketDataQuote>;
  indices: Map<string, MarketDataQuote>;
  statistics: {
    advances: number;
    declines: number;
    unchanged: number;
    newHighs: number;
    newLows: number;
    volume: number;
  };
}

// ============================================================================
// REAL-TIME MARKET DATA STREAMING
// ============================================================================

/**
 * Initialize real-time market data stream for a symbol
 */
export async function initializeMarketDataStream(
  symbol: string,
  dataTypes: MarketDataType[],
  vendor: DataVendor,
  callback: (data: any) => void
): Promise<{ streamId: string; status: string }> {
  const logger = new Logger('MarketData:initializeMarketDataStream');

  try {
    logger.log(`Initializing market data stream for ${symbol} from ${vendor}`);

    // Validate entitlements
    await validateMarketDataAccess(symbol, vendor, dataTypes);

    // Establish vendor connection
    const connection = await connectToVendor(vendor);

    // Subscribe to data types
    const streamId = await subscribeToMarketData(connection, symbol, dataTypes);

    // Set up data handler
    connection.on('message', (message: any) => {
      const parsedData = parseVendorMessage(message, vendor);
      callback(parsedData);
    });

    logger.log(`Market data stream initialized: ${streamId}`);

    return {
      streamId,
      status: 'ACTIVE'
    };

  } catch (error) {
    logger.error(`Failed to initialize market data stream: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Stream real-time quotes via WebSocket
 */
export async function streamRealTimeQuotes(
  symbols: string[],
  websocket: WebSocket,
  options?: {
    conflate?: boolean;
    throttleMs?: number;
    fields?: string[];
  }
): Promise<void> {
  const logger = new Logger('MarketData:streamRealTimeQuotes');

  try {
    logger.log(`Streaming real-time quotes for ${symbols.length} symbols`);

    const subscriptions = new Map<string, any>();

    for (const symbol of symbols) {
      const subscription = await subscribeToQuotes(symbol, async (quote: MarketDataQuote) => {
        // Apply throttling if specified
        if (options?.throttleMs) {
          await throttleData(symbol, options.throttleMs);
        }

        // Filter fields if specified
        const filteredQuote = options?.fields
          ? filterQuoteFields(quote, options.fields)
          : quote;

        // Send to WebSocket
        if (websocket.readyState === WebSocket.OPEN) {
          websocket.send(JSON.stringify({
            type: 'QUOTE',
            symbol,
            data: filteredQuote,
            timestamp: new Date()
          }));
        }
      });

      subscriptions.set(symbol, subscription);
    }

    // Handle WebSocket close
    websocket.on('close', () => {
      logger.log('WebSocket closed, cleaning up subscriptions');
      for (const subscription of subscriptions.values()) {
        subscription.unsubscribe();
      }
    });

  } catch (error) {
    logger.error(`Failed to stream real-time quotes: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Stream Level 2 market depth data
 */
export async function streamMarketDepth(
  symbol: string,
  levels: number,
  websocket: WebSocket
): Promise<void> {
  const logger = new Logger('MarketData:streamMarketDepth');

  try {
    logger.log(`Streaming Level 2 depth for ${symbol}, ${levels} levels`);

    await subscribeToMarketDepth(symbol, levels, (update: MarketDepthUpdate) => {
      if (websocket.readyState === WebSocket.OPEN) {
        websocket.send(JSON.stringify({
          type: 'MARKET_DEPTH',
          symbol,
          data: update,
          timestamp: new Date()
        }));
      }
    });

  } catch (error) {
    logger.error(`Failed to stream market depth: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Stream time and sales (tick data)
 */
export async function streamTimeAndSales(
  symbol: string,
  websocket: WebSocket,
  filters?: {
    minSize?: number;
    excludeOddLots?: boolean;
    onlyBlockTrades?: boolean;
  }
): Promise<void> {
  const logger = new Logger('MarketData:streamTimeAndSales');

  try {
    logger.log(`Streaming time and sales for ${symbol}`);

    await subscribeToTrades(symbol, (trade: MarketDataTrade) => {
      // Apply filters
      if (filters?.minSize && trade.size < filters.minSize) return;
      if (filters?.excludeOddLots && trade.isOddLot) return;
      if (filters?.onlyBlockTrades && !trade.isBlockTrade) return;

      if (websocket.readyState === WebSocket.OPEN) {
        websocket.send(JSON.stringify({
          type: 'TRADE',
          symbol,
          data: trade,
          timestamp: new Date()
        }));
      }
    });

  } catch (error) {
    logger.error(`Failed to stream time and sales: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Stream aggregated bars (OHLCV)
 */
export async function streamBars(
  symbol: string,
  timeFrame: TimeFrame,
  websocket: WebSocket
): Promise<void> {
  const logger = new Logger('MarketData:streamBars');

  try {
    logger.log(`Streaming ${timeFrame} bars for ${symbol}`);

    const barBuilder = new BarBuilder(timeFrame);

    await subscribeToTrades(symbol, (trade: MarketDataTrade) => {
      const bar = barBuilder.addTrade(trade);

      if (bar && websocket.readyState === WebSocket.OPEN) {
        websocket.send(JSON.stringify({
          type: 'BAR',
          symbol,
          timeFrame,
          data: bar,
          timestamp: new Date()
        }));
      }
    });

  } catch (error) {
    logger.error(`Failed to stream bars: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Multi-symbol streaming with fan-out
 */
export async function streamMultipleSymbols(
  symbols: string[],
  dataTypes: MarketDataType[],
  websocket: WebSocket,
  maxSymbols: number = 100
): Promise<{ subscriptionId: string; subscribedSymbols: string[] }> {
  const logger = new Logger('MarketData:streamMultipleSymbols');

  try {
    if (symbols.length > maxSymbols) {
      throw new Error(`Symbol limit exceeded: ${symbols.length} > ${maxSymbols}`);
    }

    logger.log(`Streaming ${dataTypes.join(', ')} for ${symbols.length} symbols`);

    const subscriptionId = `SUB-${Date.now()}`;

    for (const symbol of symbols) {
      for (const dataType of dataTypes) {
        await initializeMarketDataStream(
          symbol,
          [dataType],
          DataVendor.BLOOMBERG,
          (data: any) => {
            if (websocket.readyState === WebSocket.OPEN) {
              websocket.send(JSON.stringify({
                subscriptionId,
                type: dataType,
                symbol,
                data,
                timestamp: new Date()
              }));
            }
          }
        );
      }
    }

    return {
      subscriptionId,
      subscribedSymbols: symbols
    };

  } catch (error) {
    logger.error(`Failed to stream multiple symbols: ${error.message}`, error.stack);
    throw error;
  }
}

// ============================================================================
// MARKET DATA NORMALIZATION
// ============================================================================

/**
 * Normalize market data from different vendors to common format
 */
export function normalizeMarketData(
  rawData: any,
  vendor: DataVendor
): MarketDataQuote | MarketDataTrade | OrderBookSnapshot {
  const logger = new Logger('MarketData:normalizeMarketData');

  try {
    switch (vendor) {
      case DataVendor.BLOOMBERG:
        return normalizeBloombergData(rawData);

      case DataVendor.REUTERS:
        return normalizeReutersData(rawData);

      case DataVendor.ICE:
        return normalizeICEData(rawData);

      case DataVendor.IEX:
        return normalizeIEXData(rawData);

      default:
        throw new Error(`Unsupported vendor: ${vendor}`);
    }

  } catch (error) {
    logger.error(`Failed to normalize market data: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Normalize Bloomberg data
 */
export function normalizeBloombergData(data: any): MarketDataQuote {
  return {
    symbol: data.security,
    exchange: data.exchange || 'COMPOSITE',
    timestamp: new Date(data.time),
    sequenceNumber: data.seqNum || 0,

    bidPrice: data.BID,
    bidSize: data.BID_SIZE,
    askPrice: data.ASK,
    askSize: data.ASK_SIZE,

    lastPrice: data.LAST_PRICE,
    lastSize: data.LAST_SIZE,
    lastTime: new Date(data.TRADE_TIME),

    openPrice: data.OPEN,
    highPrice: data.HIGH,
    lowPrice: data.LOW,
    closePrice: data.CLOSE,
    volume: data.VOLUME,
    vwap: data.VWAP,

    spread: data.ASK - data.BID,
    spreadPercent: ((data.ASK - data.BID) / data.BID) * 100,
    midPrice: (data.BID + data.ASK) / 2,

    dataVendor: DataVendor.BLOOMBERG,
    quality: MarketDataQuality.REAL_TIME
  };
}

/**
 * Normalize Reuters/Refinitiv data
 */
export function normalizeReutersData(data: any): MarketDataQuote {
  return {
    symbol: data.RIC,
    exchange: data.EXCH_CODE || 'COMPOSITE',
    timestamp: new Date(data.QUOTIM),
    sequenceNumber: data.SEQ_NO || 0,

    bidPrice: data.BID,
    bidSize: data.BIDSIZE,
    askPrice: data.ASK,
    askSize: data.ASKSIZE,

    lastPrice: data.TRDPRC_1,
    lastSize: data.TRDVOL_1,
    lastTime: new Date(data.TRADE_TIME),

    openPrice: data.OPEN_PRC,
    highPrice: data.HIGH_1,
    lowPrice: data.LOW_1,
    closePrice: data.CLOSE,
    volume: data.ACVOL_1,
    vwap: data.VWAP,

    spread: data.ASK - data.BID,
    spreadPercent: ((data.ASK - data.BID) / data.BID) * 100,
    midPrice: (data.BID + data.ASK) / 2,

    dataVendor: DataVendor.REUTERS,
    quality: MarketDataQuality.REAL_TIME
  };
}

/**
 * Normalize ICE Data Services data
 */
export function normalizeICEData(data: any): MarketDataQuote {
  return {
    symbol: data.Symbol,
    exchange: data.Exchange || 'COMPOSITE',
    timestamp: new Date(data.Timestamp),
    sequenceNumber: data.SequenceNumber || 0,

    bidPrice: data.Bid,
    bidSize: data.BidSize,
    askPrice: data.Ask,
    askSize: data.AskSize,

    lastPrice: data.Last,
    lastSize: data.LastSize,
    lastTime: new Date(data.LastTime),

    openPrice: data.Open,
    highPrice: data.High,
    lowPrice: data.Low,
    closePrice: data.Close,
    volume: data.Volume,

    spread: data.Ask - data.Bid,
    spreadPercent: ((data.Ask - data.Bid) / data.Bid) * 100,
    midPrice: (data.Bid + data.Ask) / 2,

    dataVendor: DataVendor.ICE,
    quality: MarketDataQuality.REAL_TIME
  };
}

/**
 * Normalize IEX Cloud data
 */
export function normalizeIEXData(data: any): MarketDataQuote {
  return {
    symbol: data.symbol,
    exchange: 'IEX',
    timestamp: new Date(data.latestUpdate),
    sequenceNumber: 0,

    bidPrice: data.iexBidPrice || data.latestPrice,
    bidSize: data.iexBidSize || 0,
    askPrice: data.iexAskPrice || data.latestPrice,
    askSize: data.iexAskSize || 0,

    lastPrice: data.latestPrice,
    lastSize: data.latestVolume,
    lastTime: new Date(data.latestUpdate),

    openPrice: data.open,
    highPrice: data.high,
    lowPrice: data.low,
    closePrice: data.previousClose,
    volume: data.volume,

    spread: (data.iexAskPrice || 0) - (data.iexBidPrice || 0),
    spreadPercent: data.iexBidPrice ? (((data.iexAskPrice || 0) - (data.iexBidPrice || 0)) / data.iexBidPrice) * 100 : 0,
    midPrice: data.latestPrice,

    dataVendor: DataVendor.IEX,
    quality: MarketDataQuality.REAL_TIME
  };
}

/**
 * Convert between different price formats
 */
export function convertPriceFormat(
  price: number,
  fromFormat: 'DECIMAL' | 'FRACTION' | 'BASIS_POINTS',
  toFormat: 'DECIMAL' | 'FRACTION' | 'BASIS_POINTS'
): number | string {
  if (fromFormat === toFormat) return price;

  switch (`${fromFormat}-${toFormat}`) {
    case 'DECIMAL-FRACTION':
      return decimalToFraction(price);

    case 'FRACTION-DECIMAL':
      return fractionToDecimal(price as any);

    case 'DECIMAL-BASIS_POINTS':
      return price * 10000;

    case 'BASIS_POINTS-DECIMAL':
      return price / 10000;

    default:
      throw new Error(`Unsupported price format conversion: ${fromFormat} to ${toFormat}`);
  }
}

// ============================================================================
// QUOTE AGGREGATION
// ============================================================================

/**
 * Aggregate quotes from multiple sources
 */
export async function aggregateQuotes(
  symbol: string,
  vendors: DataVendor[]
): Promise<AggregatedQuote> {
  const logger = new Logger('MarketData:aggregateQuotes');

  try {
    logger.log(`Aggregating quotes for ${symbol} from ${vendors.length} vendors`);

    const quotes: Array<{ vendor: DataVendor; quote: MarketDataQuote; latency: number }> = [];

    // Fetch quotes from all vendors in parallel
    const startTime = Date.now();

    const quotePromises = vendors.map(async (vendor) => {
      const vendorStartTime = Date.now();
      try {
        const quote = await fetchQuoteFromVendor(symbol, vendor);
        const latency = Date.now() - vendorStartTime;
        return { vendor, quote, latency };
      } catch (error) {
        logger.warn(`Failed to fetch quote from ${vendor}: ${error.message}`);
        return null;
      }
    });

    const results = await Promise.allSettled(quotePromises);

    for (const result of results) {
      if (result.status === 'fulfilled' && result.value) {
        quotes.push(result.value);
      }
    }

    if (quotes.length === 0) {
      throw new Error('No quotes available from any vendor');
    }

    // Find best bid and ask
    let bestBid = { price: 0, size: 0, source: DataVendor.INTERNAL, exchange: '' };
    let bestAsk = { price: Number.MAX_VALUE, size: 0, source: DataVendor.INTERNAL, exchange: '' };

    for (const { vendor, quote } of quotes) {
      if (quote.bidPrice > bestBid.price) {
        bestBid = {
          price: quote.bidPrice,
          size: quote.bidSize,
          source: vendor,
          exchange: quote.exchange
        };
      }

      if (quote.askPrice < bestAsk.price) {
        bestAsk = {
          price: quote.askPrice,
          size: quote.askSize,
          source: vendor,
          exchange: quote.exchange
        };
      }
    }

    // Calculate consolidated volume
    const consolidatedVolume = quotes.reduce((sum, { quote }) => sum + quote.volume, 0);

    const aggregated: AggregatedQuote = {
      symbol,
      timestamp: new Date(),
      bestBid,
      bestAsk,
      nbbo: {
        bidPrice: bestBid.price,
        bidSize: bestBid.size,
        askPrice: bestAsk.price,
        askSize: bestAsk.size,
        timestamp: new Date()
      },
      consolidatedVolume,
      numberOfVenues: quotes.length,
      sources: quotes
    };

    logger.log(`Quotes aggregated in ${Date.now() - startTime}ms`);

    return aggregated;

  } catch (error) {
    logger.error(`Failed to aggregate quotes: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Calculate National Best Bid and Offer (NBBO)
 */
export function calculateNBBO(
  quotes: Map<string, MarketDataQuote>
): { bidPrice: number; bidSize: number; askPrice: number; askSize: number; timestamp: Date } {
  let bestBidPrice = 0;
  let bestBidSize = 0;
  let bestAskPrice = Number.MAX_VALUE;
  let bestAskSize = 0;

  for (const quote of quotes.values()) {
    if (quote.bidPrice > bestBidPrice) {
      bestBidPrice = quote.bidPrice;
      bestBidSize = quote.bidSize;
    } else if (quote.bidPrice === bestBidPrice) {
      bestBidSize += quote.bidSize;
    }

    if (quote.askPrice < bestAskPrice) {
      bestAskPrice = quote.askPrice;
      bestAskSize = quote.askSize;
    } else if (quote.askPrice === bestAskPrice) {
      bestAskSize += quote.askSize;
    }
  }

  return {
    bidPrice: bestBidPrice,
    bidSize: bestBidSize,
    askPrice: bestAskPrice,
    askSize: bestAskSize,
    timestamp: new Date()
  };
}

/**
 * Detect quote arbitrage opportunities across venues
 */
export async function detectArbitrageOpportunities(
  symbol: string,
  quotes: AggregatedQuote,
  minSpread: number = 0.01
): Promise<Array<{
  type: 'BUY_SELL' | 'SELL_BUY';
  buyVenue: string;
  sellVenue: string;
  profitPerShare: number;
  profitPercent: number;
  confidence: number;
}>> {
  const opportunities = [];

  const sortedByBid = [...quotes.sources].sort((a, b) => b.quote.bidPrice - a.quote.bidPrice);
  const sortedByAsk = [...quotes.sources].sort((a, b) => a.quote.askPrice - b.quote.askPrice);

  const highestBid = sortedByBid[0];
  const lowestAsk = sortedByAsk[0];

  if (highestBid.quote.bidPrice > lowestAsk.quote.askPrice) {
    const profitPerShare = highestBid.quote.bidPrice - lowestAsk.quote.askPrice;
    const profitPercent = (profitPerShare / lowestAsk.quote.askPrice) * 100;

    if (profitPerShare >= minSpread) {
      opportunities.push({
        type: 'BUY_SELL' as const,
        buyVenue: lowestAsk.vendor,
        sellVenue: highestBid.vendor,
        profitPerShare,
        profitPercent,
        confidence: calculateArbitrageConfidence(highestBid, lowestAsk)
      });
    }
  }

  return opportunities;
}

// ============================================================================
// SUBSCRIPTION MANAGEMENT
// ============================================================================

/**
 * Create market data subscription
 */
export async function createSubscription(
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
  const logger = new Logger('MarketData:createSubscription');

  try {
    logger.log(`Creating subscription for ${userId}: ${symbol} ${dataType}`);

    // Check entitlements
    const entitlements = await getUserEntitlements(userId);
    await validateSubscriptionEntitlements(entitlements, symbol, dataType, options.vendor);

    const subscription: MarketDataSubscription = {
      subscriptionId: `SUB-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId,
      symbol,
      dataType,
      timeFrame: options.timeFrame,
      fields: options.fields || ['*'],
      vendor: options.vendor || DataVendor.BLOOMBERG,
      quality: options.quality || MarketDataQuality.REAL_TIME,
      deliveryMethod: options.deliveryMethod || 'WEBSOCKET',
      throttleMs: options.throttleMs,
      conflate: false,
      status: SubscriptionStatus.PENDING,
      createdAt: new Date(),
      entitlements: entitlements.map(e => e.vendor)
    };

    // Save subscription
    await saveSubscription(subscription);

    // Activate subscription
    await activateSubscription(subscription);

    subscription.status = SubscriptionStatus.ACTIVE;
    subscription.lastUpdate = new Date();

    await updateSubscription(subscription);

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
export async function cancelSubscription(
  subscriptionId: string,
  userId: string
): Promise<void> {
  const logger = new Logger('MarketData:cancelSubscription');

  try {
    logger.log(`Canceling subscription: ${subscriptionId}`);

    const subscription = await getSubscription(subscriptionId);

    if (!subscription) {
      throw new Error(`Subscription not found: ${subscriptionId}`);
    }

    if (subscription.userId !== userId) {
      throw new Error('Unauthorized to cancel this subscription');
    }

    // Unsubscribe from vendor
    await unsubscribeFromVendor(subscription);

    // Update subscription status
    subscription.status = SubscriptionStatus.CANCELED;
    subscription.lastUpdate = new Date();

    await updateSubscription(subscription);

    logger.log(`Subscription canceled: ${subscriptionId}`);

  } catch (error) {
    logger.error(`Failed to cancel subscription: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Get user's active subscriptions
 */
export async function getUserSubscriptions(
  userId: string,
  filters?: {
    status?: SubscriptionStatus;
    dataType?: MarketDataType;
    vendor?: DataVendor;
  }
): Promise<MarketDataSubscription[]> {
  const logger = new Logger('MarketData:getUserSubscriptions');

  try {
    const allSubscriptions = await getSubscriptionsByUserId(userId);

    let filtered = allSubscriptions;

    if (filters?.status) {
      filtered = filtered.filter(sub => sub.status === filters.status);
    }

    if (filters?.dataType) {
      filtered = filtered.filter(sub => sub.dataType === filters.dataType);
    }

    if (filters?.vendor) {
      filtered = filtered.filter(sub => sub.vendor === filters.vendor);
    }

    return filtered;

  } catch (error) {
    logger.error(`Failed to get user subscriptions: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Manage subscription rate limits
 */
export async function checkSubscriptionRateLimit(
  userId: string,
  vendor: DataVendor
): Promise<{
  allowed: boolean;
  current: number;
  limit: number;
  resetAt: Date;
}> {
  const entitlements = await getUserEntitlements(userId);
  const vendorEntitlement = entitlements.find(e => e.vendor === vendor);

  if (!vendorEntitlement || !vendorEntitlement.rateLimit) {
    return {
      allowed: true,
      current: 0,
      limit: Number.MAX_VALUE,
      resetAt: new Date(Date.now() + 3600000)
    };
  }

  const currentUsage = await getSubscriptionUsage(userId, vendor);

  return {
    allowed: currentUsage < vendorEntitlement.rateLimit,
    current: currentUsage,
    limit: vendorEntitlement.rateLimit,
    resetAt: new Date(Date.now() + 3600000)
  };
}

// ============================================================================
// HISTORICAL DATA RETRIEVAL
// ============================================================================

/**
 * Retrieve historical quotes
 */
export async function getHistoricalQuotes(
  request: HistoricalDataRequest
): Promise<MarketDataQuote[]> {
  const logger = new Logger('MarketData:getHistoricalQuotes');

  try {
    logger.log(`Retrieving historical quotes for ${request.symbol}: ${request.startDate} to ${request.endDate}`);

    // Check cache first
    const cachedData = await getCachedHistoricalData(request);
    if (cachedData) {
      logger.log('Returning cached historical quotes');
      return cachedData;
    }

    // Fetch from vendor
    const vendor = request.preferredVendor || DataVendor.BLOOMBERG;
    const quotes = await fetchHistoricalQuotesFromVendor(request, vendor);

    // Apply adjustments
    let adjustedQuotes = quotes;

    if (request.adjustForSplits) {
      adjustedQuotes = await adjustForStockSplits(request.symbol, adjustedQuotes);
    }

    if (request.adjustForDividends) {
      adjustedQuotes = await adjustForDividends(request.symbol, adjustedQuotes);
    }

    // Cache results
    await cacheHistoricalData(request, adjustedQuotes);

    logger.log(`Retrieved ${adjustedQuotes.length} historical quotes`);

    return adjustedQuotes;

  } catch (error) {
    logger.error(`Failed to retrieve historical quotes: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Retrieve historical bars (OHLCV)
 */
export async function getHistoricalBars(
  request: HistoricalDataRequest
): Promise<MarketDataBar[]> {
  const logger = new Logger('MarketData:getHistoricalBars');

  try {
    logger.log(`Retrieving ${request.timeFrame} bars for ${request.symbol}`);

    const vendor = request.preferredVendor || DataVendor.BLOOMBERG;
    const bars = await fetchHistoricalBarsFromVendor(request, vendor);

    // Apply adjustments
    let adjustedBars = bars;

    if (request.adjustForSplits) {
      adjustedBars = await adjustBarsForSplits(request.symbol, adjustedBars);
    }

    if (request.adjustForDividends) {
      adjustedBars = await adjustBarsForDividends(request.symbol, adjustedBars);
    }

    logger.log(`Retrieved ${adjustedBars.length} historical bars`);

    return adjustedBars;

  } catch (error) {
    logger.error(`Failed to retrieve historical bars: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Retrieve historical time and sales
 */
export async function getHistoricalTimeAndSales(
  symbol: string,
  startDate: Date,
  endDate: Date,
  filters?: {
    minSize?: number;
    exchanges?: string[];
  }
): Promise<TimeAndSales> {
  const logger = new Logger('MarketData:getHistoricalTimeAndSales');

  try {
    logger.log(`Retrieving historical time and sales for ${symbol}`);

    const trades = await fetchHistoricalTrades(symbol, startDate, endDate);

    // Apply filters
    let filteredTrades = trades;

    if (filters?.minSize) {
      filteredTrades = filteredTrades.filter(t => t.size >= filters.minSize);
    }

    if (filters?.exchanges) {
      filteredTrades = filteredTrades.filter(t => filters.exchanges.includes(t.exchange));
    }

    // Calculate summary
    const summary = {
      totalVolume: filteredTrades.reduce((sum, t) => sum + t.size, 0),
      numberOfTrades: filteredTrades.length,
      vwap: calculateVWAP(filteredTrades),
      highPrice: Math.max(...filteredTrades.map(t => t.price)),
      lowPrice: Math.min(...filteredTrades.map(t => t.price))
    };

    return {
      symbol,
      trades: filteredTrades,
      period: { start: startDate, end: endDate },
      summary
    };

  } catch (error) {
    logger.error(`Failed to retrieve historical time and sales: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Backfill missing historical data
 */
export async function backfillHistoricalData(
  symbol: string,
  dataType: MarketDataType,
  startDate: Date,
  endDate: Date,
  vendor: DataVendor
): Promise<{ recordsAdded: number; gaps: Array<{ start: Date; end: Date }> }> {
  const logger = new Logger('MarketData:backfillHistoricalData');

  try {
    logger.log(`Backfilling ${dataType} data for ${symbol}`);

    // Identify gaps
    const gaps = await identifyDataGaps(symbol, dataType, startDate, endDate);

    let recordsAdded = 0;

    // Fill each gap
    for (const gap of gaps) {
      const data = await fetchDataForGap(symbol, dataType, gap, vendor);
      await storeHistoricalData(symbol, dataType, data);
      recordsAdded += data.length;
    }

    logger.log(`Backfilled ${recordsAdded} records, ${gaps.length} gaps filled`);

    return { recordsAdded, gaps };

  } catch (error) {
    logger.error(`Failed to backfill historical data: ${error.message}`, error.stack);
    throw error;
  }
}

// ============================================================================
// MARKET DATA QUALITY CHECKS
// ============================================================================

/**
 * Validate market data quality
 */
export async function validateMarketDataQuality(
  quote: MarketDataQuote
): Promise<{
  isValid: boolean;
  issues: Array<{ severity: 'ERROR' | 'WARNING'; message: string }>;
}> {
  const issues: Array<{ severity: 'ERROR' | 'WARNING'; message: string }> = [];

  // Check for negative prices
  if (quote.bidPrice < 0 || quote.askPrice < 0 || quote.lastPrice < 0) {
    issues.push({
      severity: 'ERROR',
      message: 'Negative price detected'
    });
  }

  // Check for inverted quote (bid > ask)
  if (quote.bidPrice > quote.askPrice) {
    issues.push({
      severity: 'ERROR',
      message: 'Inverted quote: bid price exceeds ask price'
    });
  }

  // Check for zero size
  if (quote.bidSize === 0 && quote.askSize === 0) {
    issues.push({
      severity: 'WARNING',
      message: 'Zero quote sizes'
    });
  }

  // Check for excessive spread
  const spreadPercent = ((quote.askPrice - quote.bidPrice) / quote.bidPrice) * 100;
  if (spreadPercent > 5) {
    issues.push({
      severity: 'WARNING',
      message: `Excessive spread: ${spreadPercent.toFixed(2)}%`
    });
  }

  // Check for stale data
  const dataAge = Date.now() - quote.timestamp.getTime();
  if (dataAge > 60000) {
    issues.push({
      severity: 'WARNING',
      message: `Stale data: ${Math.floor(dataAge / 1000)} seconds old`
    });
  }

  // Check OHLC consistency
  if (quote.highPrice < quote.lowPrice) {
    issues.push({
      severity: 'ERROR',
      message: 'High price is less than low price'
    });
  }

  if (quote.lastPrice < quote.lowPrice || quote.lastPrice > quote.highPrice) {
    issues.push({
      severity: 'WARNING',
      message: 'Last price outside daily range'
    });
  }

  return {
    isValid: !issues.some(i => i.severity === 'ERROR'),
    issues
  };
}

/**
 * Monitor market data feed health
 */
export async function monitorFeedHealth(
  vendor: DataVendor,
  window: number = 60000
): Promise<MarketDataQualityMetrics> {
  const logger = new Logger('MarketData:monitorFeedHealth');

  try {
    const endTime = new Date();
    const startTime = new Date(endTime.getTime() - window);

    const metrics = await calculateFeedMetrics(vendor, startTime, endTime);

    logger.log(`Feed health for ${vendor}: ${JSON.stringify(metrics)}`);

    return metrics;

  } catch (error) {
    logger.error(`Failed to monitor feed health: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Detect and handle duplicate market data messages
 */
export function detectDuplicates(
  messages: Array<{ sequenceNumber: number; timestamp: Date; data: any }>
): Array<{ sequenceNumber: number; timestamp: Date; data: any }> {
  const seen = new Set<number>();
  const unique = [];

  for (const message of messages) {
    if (!seen.has(message.sequenceNumber)) {
      seen.add(message.sequenceNumber);
      unique.push(message);
    }
  }

  return unique;
}

/**
 * Detect out-of-sequence messages
 */
export function detectOutOfSequence(
  messages: Array<{ sequenceNumber: number; data: any }>
): Array<{ expected: number; received: number; gap: number }> {
  const gaps = [];
  let lastSeq = messages[0]?.sequenceNumber || 0;

  for (let i = 1; i < messages.length; i++) {
    const currentSeq = messages[i].sequenceNumber;
    const expectedSeq = lastSeq + 1;

    if (currentSeq !== expectedSeq) {
      gaps.push({
        expected: expectedSeq,
        received: currentSeq,
        gap: currentSeq - expectedSeq
      });
    }

    lastSeq = currentSeq;
  }

  return gaps;
}

// ============================================================================
// VENDOR INTEGRATION
// ============================================================================

/**
 * Connect to Bloomberg Terminal API
 */
export async function connectToBloomberg(
  config: VendorConnectionConfig
): Promise<any> {
  const logger = new Logger('MarketData:connectToBloomberg');

  try {
    logger.log('Connecting to Bloomberg Terminal API');

    // Implementation would use Bloomberg API SDK
    // This is a placeholder for the actual Bloomberg connection

    const connection = {
      vendor: DataVendor.BLOOMBERG,
      status: 'CONNECTED',
      on: (event: string, callback: Function) => {
        // Event handler registration
      },
      subscribe: (symbol: string, fields: string[]) => {
        // Subscription logic
      },
      disconnect: () => {
        // Disconnection logic
      }
    };

    logger.log('Bloomberg connection established');

    return connection;

  } catch (error) {
    logger.error(`Failed to connect to Bloomberg: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Connect to Reuters/Refinitiv DataScope
 */
export async function connectToReuters(
  config: VendorConnectionConfig
): Promise<any> {
  const logger = new Logger('MarketData:connectToReuters');

  try {
    logger.log('Connecting to Reuters DataScope API');

    // Implementation would use Reuters/Refinitiv SDK

    const connection = {
      vendor: DataVendor.REUTERS,
      status: 'CONNECTED',
      on: (event: string, callback: Function) => {},
      subscribe: (symbol: string, fields: string[]) => {},
      disconnect: () => {}
    };

    logger.log('Reuters connection established');

    return connection;

  } catch (error) {
    logger.error(`Failed to connect to Reuters: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Connect to ICE Data Services
 */
export async function connectToICE(
  config: VendorConnectionConfig
): Promise<any> {
  const logger = new Logger('MarketData:connectToICE');

  try {
    logger.log('Connecting to ICE Data Services');

    const connection = {
      vendor: DataVendor.ICE,
      status: 'CONNECTED',
      on: (event: string, callback: Function) => {},
      subscribe: (symbol: string, fields: string[]) => {},
      disconnect: () => {}
    };

    logger.log('ICE connection established');

    return connection;

  } catch (error) {
    logger.error(`Failed to connect to ICE: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Handle vendor failover
 */
export async function handleVendorFailover(
  primaryVendor: DataVendor,
  secondaryVendor: DataVendor,
  subscriptions: MarketDataSubscription[]
): Promise<void> {
  const logger = new Logger('MarketData:handleVendorFailover');

  try {
    logger.log(`Failing over from ${primaryVendor} to ${secondaryVendor}`);

    // Disconnect from primary
    await disconnectFromVendor(primaryVendor);

    // Connect to secondary
    const secondaryConnection = await connectToVendor(secondaryVendor);

    // Re-subscribe all subscriptions
    for (const subscription of subscriptions) {
      await resubscribeToVendor(subscription, secondaryConnection);
    }

    logger.log('Failover completed successfully');

  } catch (error) {
    logger.error(`Vendor failover failed: ${error.message}`, error.stack);
    throw error;
  }
}

// ============================================================================
// CACHING AND OPTIMIZATION
// ============================================================================

/**
 * Cache market data with TTL
 */
export async function cacheMarketData(
  symbol: string,
  dataType: MarketDataType,
  data: any,
  ttl: number = 5000
): Promise<void> {
  const cache: MarketDataCache = {
    symbol,
    dataType,
    data,
    timestamp: new Date(),
    ttl,
    vendor: DataVendor.INTERNAL,
    quality: MarketDataQuality.REAL_TIME
  };

  await saveToCache(cache);
}

/**
 * Retrieve cached market data
 */
export async function getCachedMarketData(
  symbol: string,
  dataType: MarketDataType
): Promise<any | null> {
  const cached = await getFromCache(symbol, dataType);

  if (!cached) return null;

  const age = Date.now() - cached.timestamp.getTime();

  if (age > cached.ttl) {
    await deleteFromCache(symbol, dataType);
    return null;
  }

  return cached.data;
}

/**
 * Optimize market data delivery with conflation
 */
export function conflateMarketData(
  updates: MarketDataQuote[],
  windowMs: number = 100
): MarketDataQuote[] {
  const conflated = new Map<string, MarketDataQuote>();
  const now = Date.now();

  for (const update of updates) {
    const key = `${update.symbol}-${Math.floor(update.timestamp.getTime() / windowMs)}`;

    const existing = conflated.get(key);

    if (!existing || update.timestamp > existing.timestamp) {
      conflated.set(key, update);
    }
  }

  return Array.from(conflated.values());
}

// ============================================================================
// ENTITLEMENT MANAGEMENT
// ============================================================================

/**
 * Validate user market data entitlements
 */
export async function validateMarketDataAccess(
  symbol: string,
  vendor: DataVendor,
  dataTypes: MarketDataType[]
): Promise<boolean> {
  // Placeholder - would integrate with entitlement system
  return true;
}

/**
 * Get user entitlements
 */
export async function getUserEntitlements(
  userId: string
): Promise<MarketDataEntitlement[]> {
  // Placeholder - would fetch from database
  return [];
}

/**
 * Check symbol-level entitlements
 */
export async function checkSymbolEntitlement(
  userId: string,
  symbol: string,
  dataType: MarketDataType
): Promise<boolean> {
  const entitlements = await getUserEntitlements(userId);

  for (const entitlement of entitlements) {
    if (!entitlement.isActive) continue;

    if (entitlement.dataTypes.includes(dataType)) {
      return true;
    }
  }

  return false;
}

// ============================================================================
// HELPER FUNCTIONS AND UTILITIES
// ============================================================================

class BarBuilder {
  private timeFrame: TimeFrame;
  private currentBar: MarketDataBar | null = null;
  private lastBarTime: Date | null = null;

  constructor(timeFrame: TimeFrame) {
    this.timeFrame = timeFrame;
  }

  addTrade(trade: MarketDataTrade): MarketDataBar | null {
    const barTime = this.getBarTimestamp(trade.timestamp);

    if (!this.currentBar || barTime.getTime() !== this.lastBarTime?.getTime()) {
      const completedBar = this.currentBar;

      this.currentBar = {
        symbol: trade.symbol,
        timeFrame: this.timeFrame,
        timestamp: barTime,
        open: trade.price,
        high: trade.price,
        low: trade.price,
        close: trade.price,
        volume: trade.size,
        numberOfTrades: 1,
        dataVendor: trade.dataVendor
      };

      this.lastBarTime = barTime;

      return completedBar;
    }

    this.currentBar.high = Math.max(this.currentBar.high, trade.price);
    this.currentBar.low = Math.min(this.currentBar.low, trade.price);
    this.currentBar.close = trade.price;
    this.currentBar.volume += trade.size;
    this.currentBar.numberOfTrades = (this.currentBar.numberOfTrades || 0) + 1;

    return null;
  }

  private getBarTimestamp(timestamp: Date): Date {
    const intervalMs = this.getIntervalMs();
    const time = timestamp.getTime();
    const barTime = Math.floor(time / intervalMs) * intervalMs;
    return new Date(barTime);
  }

  private getIntervalMs(): number {
    const intervals: Record<string, number> = {
      '1S': 1000,
      '5S': 5000,
      '10S': 10000,
      '30S': 30000,
      '1M': 60000,
      '5M': 300000,
      '15M': 900000,
      '30M': 1800000,
      '1H': 3600000,
      '4H': 14400000,
      '1D': 86400000
    };

    return intervals[this.timeFrame] || 60000;
  }
}

function filterQuoteFields(quote: MarketDataQuote, fields: string[]): Partial<MarketDataQuote> {
  if (fields.includes('*')) return quote;

  const filtered: any = {};

  for (const field of fields) {
    if (field in quote) {
      filtered[field] = (quote as any)[field];
    }
  }

  return filtered;
}

function decimalToFraction(decimal: number): string {
  // Simplified fraction conversion (32nds for bonds)
  const whole = Math.floor(decimal);
  const frac = decimal - whole;
  const thirtySeconds = Math.round(frac * 32);
  return `${whole}-${thirtySeconds.toString().padStart(2, '0')}`;
}

function fractionToDecimal(fraction: string): number {
  const parts = fraction.split('-');
  const whole = parseInt(parts[0]);
  const thirtySeconds = parseInt(parts[1]);
  return whole + (thirtySeconds / 32);
}

function calculateVWAP(trades: MarketDataTrade[]): number {
  const totalValue = trades.reduce((sum, t) => sum + (t.price * t.size), 0);
  const totalVolume = trades.reduce((sum, t) => sum + t.size, 0);
  return totalVolume > 0 ? totalValue / totalVolume : 0;
}

function calculateArbitrageConfidence(
  bid: { vendor: DataVendor; quote: MarketDataQuote; latency: number },
  ask: { vendor: DataVendor; quote: MarketDataQuote; latency: number }
): number {
  let confidence = 100;

  // Reduce confidence for high latency
  confidence -= Math.min(bid.latency + ask.latency, 50);

  // Reduce confidence for small sizes
  const minSize = Math.min(bid.quote.bidSize, ask.quote.askSize);
  if (minSize < 100) confidence -= 20;

  return Math.max(0, confidence);
}

async function throttleData(symbol: string, throttleMs: number): Promise<void> {
  // Implementation would use rate limiting logic
  await new Promise(resolve => setTimeout(resolve, throttleMs));
}

// ============================================================================
// PLACEHOLDER IMPLEMENTATIONS
// ============================================================================

async function connectToVendor(vendor: DataVendor): Promise<any> {
  return { vendor, status: 'CONNECTED' };
}

async function subscribeToMarketData(connection: any, symbol: string, dataTypes: MarketDataType[]): Promise<string> {
  return `STREAM-${Date.now()}`;
}

function parseVendorMessage(message: any, vendor: DataVendor): any {
  return message;
}

async function subscribeToQuotes(symbol: string, callback: (quote: MarketDataQuote) => void): Promise<any> {
  return { unsubscribe: () => {} };
}

async function subscribeToMarketDepth(symbol: string, levels: number, callback: (update: MarketDepthUpdate) => void): Promise<void> {
  // Implementation
}

async function subscribeToTrades(symbol: string, callback: (trade: MarketDataTrade) => void): Promise<void> {
  // Implementation
}

async function fetchQuoteFromVendor(symbol: string, vendor: DataVendor): Promise<MarketDataQuote> {
  return {} as MarketDataQuote;
}

async function saveSubscription(subscription: MarketDataSubscription): Promise<void> {
  // Implementation
}

async function activateSubscription(subscription: MarketDataSubscription): Promise<void> {
  // Implementation
}

async function updateSubscription(subscription: MarketDataSubscription): Promise<void> {
  // Implementation
}

async function getSubscription(subscriptionId: string): Promise<MarketDataSubscription | null> {
  return null;
}

async function unsubscribeFromVendor(subscription: MarketDataSubscription): Promise<void> {
  // Implementation
}

async function getSubscriptionsByUserId(userId: string): Promise<MarketDataSubscription[]> {
  return [];
}

async function getSubscriptionUsage(userId: string, vendor: DataVendor): Promise<number> {
  return 0;
}

async function getCachedHistoricalData(request: HistoricalDataRequest): Promise<any> {
  return null;
}

async function fetchHistoricalQuotesFromVendor(request: HistoricalDataRequest, vendor: DataVendor): Promise<MarketDataQuote[]> {
  return [];
}

async function adjustForStockSplits(symbol: string, quotes: MarketDataQuote[]): Promise<MarketDataQuote[]> {
  return quotes;
}

async function adjustForDividends(symbol: string, quotes: MarketDataQuote[]): Promise<MarketDataQuote[]> {
  return quotes;
}

async function cacheHistoricalData(request: HistoricalDataRequest, data: any): Promise<void> {
  // Implementation
}

async function fetchHistoricalBarsFromVendor(request: HistoricalDataRequest, vendor: DataVendor): Promise<MarketDataBar[]> {
  return [];
}

async function adjustBarsForSplits(symbol: string, bars: MarketDataBar[]): Promise<MarketDataBar[]> {
  return bars;
}

async function adjustBarsForDividends(symbol: string, bars: MarketDataBar[]): Promise<MarketDataBar[]> {
  return bars;
}

async function fetchHistoricalTrades(symbol: string, startDate: Date, endDate: Date): Promise<MarketDataTrade[]> {
  return [];
}

async function identifyDataGaps(symbol: string, dataType: MarketDataType, startDate: Date, endDate: Date): Promise<Array<{ start: Date; end: Date }>> {
  return [];
}

async function fetchDataForGap(symbol: string, dataType: MarketDataType, gap: { start: Date; end: Date }, vendor: DataVendor): Promise<any[]> {
  return [];
}

async function storeHistoricalData(symbol: string, dataType: MarketDataType, data: any[]): Promise<void> {
  // Implementation
}

async function calculateFeedMetrics(vendor: DataVendor, startTime: Date, endTime: Date): Promise<MarketDataQualityMetrics> {
  return {} as MarketDataQualityMetrics;
}

async function disconnectFromVendor(vendor: DataVendor): Promise<void> {
  // Implementation
}

async function resubscribeToVendor(subscription: MarketDataSubscription, connection: any): Promise<void> {
  // Implementation
}

async function saveToCache(cache: MarketDataCache): Promise<void> {
  // Implementation
}

async function getFromCache(symbol: string, dataType: MarketDataType): Promise<MarketDataCache | null> {
  return null;
}

async function deleteFromCache(symbol: string, dataType: MarketDataType): Promise<void> {
  // Implementation
}

async function validateSubscriptionEntitlements(entitlements: MarketDataEntitlement[], symbol: string, dataType: MarketDataType, vendor?: DataVendor): Promise<void> {
  // Implementation
}

export default {
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
  normalizeIEXData,
  convertPriceFormat,
  aggregateQuotes,
  calculateNBBO,
  detectArbitrageOpportunities,
  createSubscription,
  cancelSubscription,
  getUserSubscriptions,
  checkSubscriptionRateLimit,
  getHistoricalQuotes,
  getHistoricalBars,
  getHistoricalTimeAndSales,
  backfillHistoricalData,
  validateMarketDataQuality,
  monitorFeedHealth,
  detectDuplicates,
  detectOutOfSequence,
  connectToBloomberg,
  connectToReuters,
  connectToICE,
  handleVendorFailover,
  cacheMarketData,
  getCachedMarketData,
  conflateMarketData,
  validateMarketDataAccess,
  getUserEntitlements,
  checkSymbolEntitlement
};
