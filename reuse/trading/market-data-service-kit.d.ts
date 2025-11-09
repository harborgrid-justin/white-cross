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
import WebSocket from 'ws';
/**
 * Market data types and enumerations
 */
export declare enum MarketDataType {
    QUOTE = "QUOTE",
    TRADE = "TRADE",
    BAR = "BAR",
    BOOK = "BOOK",
    DEPTH = "DEPTH",
    SNAPSHOT = "SNAPSHOT",
    NEWS = "NEWS",
    CORPORATE_ACTION = "CORPORATE_ACTION",
    REFERENCE = "REFERENCE",
    ANALYTICS = "ANALYTICS"
}
export declare enum DataVendor {
    BLOOMBERG = "BLOOMBERG",
    REUTERS = "REUTERS",
    ICE = "ICE",
    FACTSET = "FACTSET",
    SIP = "SIP",
    NASDAQ_TRF = "NASDAQ_TRF",
    IEX = "IEX",
    POLYGON = "POLYGON",
    QUODD = "QUODD",
    INTERNAL = "INTERNAL"
}
export declare enum MarketDataQuality {
    REAL_TIME = "REAL_TIME",
    DELAYED_15MIN = "DELAYED_15MIN",
    DELAYED_20MIN = "DELAYED_20MIN",
    END_OF_DAY = "END_OF_DAY",
    SNAPSHOT = "SNAPSHOT"
}
export declare enum SubscriptionStatus {
    PENDING = "PENDING",
    ACTIVE = "ACTIVE",
    PAUSED = "PAUSED",
    CANCELED = "CANCELED",
    ERROR = "ERROR"
}
export declare enum TimeFrame {
    TICK = "TICK",
    ONE_SECOND = "1S",
    FIVE_SECONDS = "5S",
    TEN_SECONDS = "10S",
    THIRTY_SECONDS = "30S",
    ONE_MINUTE = "1M",
    FIVE_MINUTES = "5M",
    FIFTEEN_MINUTES = "15M",
    THIRTY_MINUTES = "30M",
    ONE_HOUR = "1H",
    FOUR_HOURS = "4H",
    DAILY = "1D",
    WEEKLY = "1W",
    MONTHLY = "1M"
}
export interface MarketDataQuote {
    symbol: string;
    exchange: string;
    timestamp: Date;
    sequenceNumber: number;
    bidPrice: number;
    bidSize: number;
    bidExchange?: string;
    bidTime?: Date;
    askPrice: number;
    askSize: number;
    askExchange?: string;
    askTime?: Date;
    lastPrice: number;
    lastSize: number;
    lastTime: Date;
    openPrice: number;
    highPrice: number;
    lowPrice: number;
    closePrice?: number;
    volume: number;
    vwap?: number;
    spread: number;
    spreadPercent: number;
    midPrice: number;
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
    tradeId?: string;
    conditions?: string[];
    aggressor?: 'BUY' | 'SELL' | 'UNKNOWN';
    venue: string;
    dataVendor: DataVendor;
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
    vwap?: number;
    numberOfTrades?: number;
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
    totalBidVolume: number;
    totalAskVolume: number;
    imbalance: number;
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
    vendor?: DataVendor;
    quality: MarketDataQuality;
    deliveryMethod: 'WEBSOCKET' | 'HTTP_STREAMING' | 'CALLBACK' | 'QUEUE';
    throttleMs?: number;
    conflate?: boolean;
    status: SubscriptionStatus;
    createdAt: Date;
    lastUpdate?: Date;
    entitlements: string[];
}
export interface MarketDataEntitlement {
    userId: string;
    vendor: DataVendor;
    exchanges: string[];
    dataTypes: MarketDataType[];
    quality: MarketDataQuality;
    symbolLimit?: number;
    rateLimit?: number;
    delaySeconds?: number;
    validFrom: Date;
    validUntil?: Date;
    isActive: boolean;
}
export interface HistoricalDataRequest {
    symbol: string;
    dataType: MarketDataType;
    timeFrame?: TimeFrame;
    startDate: Date;
    endDate: Date;
    includeExtendedHours?: boolean;
    adjustForSplits?: boolean;
    adjustForDividends?: boolean;
    fillGaps?: boolean;
    limit?: number;
    offset?: number;
    preferredVendor?: DataVendor;
}
export interface MarketDataQualityMetrics {
    symbol: string;
    vendor: DataVendor;
    period: {
        start: Date;
        end: Date;
    };
    avgLatency: number;
    p50Latency: number;
    p95Latency: number;
    p99Latency: number;
    uptime: number;
    messageRate: number;
    duplicateRate: number;
    outOfSequenceRate: number;
    quoteSpreadAccuracy: number;
    priceDeviationRate: number;
    stalePriceRate: number;
    totalMessages: number;
    totalErrors: number;
    reconnections: number;
}
export interface VendorConnectionConfig {
    vendor: DataVendor;
    connectionType: 'WEBSOCKET' | 'FIX' | 'HTTP' | 'PROPRIETARY';
    primaryEndpoint: string;
    secondaryEndpoint?: string;
    apiKey?: string;
    credentials?: {
        username: string;
        password: string;
    };
    heartbeatInterval: number;
    reconnectAttempts: number;
    reconnectDelay: number;
    timeout: number;
    enableCompression: boolean;
    enableEncryption: boolean;
    enableFailover: boolean;
    maxMessagesPerSecond?: number;
    maxSubscriptions?: number;
}
export interface AggregatedQuote {
    symbol: string;
    timestamp: Date;
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
    nbbo: {
        bidPrice: number;
        bidSize: number;
        askPrice: number;
        askSize: number;
        timestamp: Date;
    };
    consolidatedVolume: number;
    numberOfVenues: number;
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
/**
 * Initialize real-time market data stream for a symbol
 */
export declare function initializeMarketDataStream(symbol: string, dataTypes: MarketDataType[], vendor: DataVendor, callback: (data: any) => void): Promise<{
    streamId: string;
    status: string;
}>;
/**
 * Stream real-time quotes via WebSocket
 */
export declare function streamRealTimeQuotes(symbols: string[], websocket: WebSocket, options?: {
    conflate?: boolean;
    throttleMs?: number;
    fields?: string[];
}): Promise<void>;
/**
 * Stream Level 2 market depth data
 */
export declare function streamMarketDepth(symbol: string, levels: number, websocket: WebSocket): Promise<void>;
/**
 * Stream time and sales (tick data)
 */
export declare function streamTimeAndSales(symbol: string, websocket: WebSocket, filters?: {
    minSize?: number;
    excludeOddLots?: boolean;
    onlyBlockTrades?: boolean;
}): Promise<void>;
/**
 * Stream aggregated bars (OHLCV)
 */
export declare function streamBars(symbol: string, timeFrame: TimeFrame, websocket: WebSocket): Promise<void>;
/**
 * Multi-symbol streaming with fan-out
 */
export declare function streamMultipleSymbols(symbols: string[], dataTypes: MarketDataType[], websocket: WebSocket, maxSymbols?: number): Promise<{
    subscriptionId: string;
    subscribedSymbols: string[];
}>;
/**
 * Normalize market data from different vendors to common format
 */
export declare function normalizeMarketData(rawData: any, vendor: DataVendor): MarketDataQuote | MarketDataTrade | OrderBookSnapshot;
/**
 * Normalize Bloomberg data
 */
export declare function normalizeBloombergData(data: any): MarketDataQuote;
/**
 * Normalize Reuters/Refinitiv data
 */
export declare function normalizeReutersData(data: any): MarketDataQuote;
/**
 * Normalize ICE Data Services data
 */
export declare function normalizeICEData(data: any): MarketDataQuote;
/**
 * Normalize IEX Cloud data
 */
export declare function normalizeIEXData(data: any): MarketDataQuote;
/**
 * Convert between different price formats
 */
export declare function convertPriceFormat(price: number, fromFormat: 'DECIMAL' | 'FRACTION' | 'BASIS_POINTS', toFormat: 'DECIMAL' | 'FRACTION' | 'BASIS_POINTS'): number | string;
/**
 * Aggregate quotes from multiple sources
 */
export declare function aggregateQuotes(symbol: string, vendors: DataVendor[]): Promise<AggregatedQuote>;
/**
 * Calculate National Best Bid and Offer (NBBO)
 */
export declare function calculateNBBO(quotes: Map<string, MarketDataQuote>): {
    bidPrice: number;
    bidSize: number;
    askPrice: number;
    askSize: number;
    timestamp: Date;
};
/**
 * Detect quote arbitrage opportunities across venues
 */
export declare function detectArbitrageOpportunities(symbol: string, quotes: AggregatedQuote, minSpread?: number): Promise<Array<{
    type: 'BUY_SELL' | 'SELL_BUY';
    buyVenue: string;
    sellVenue: string;
    profitPerShare: number;
    profitPercent: number;
    confidence: number;
}>>;
/**
 * Create market data subscription
 */
export declare function createSubscription(userId: string, symbol: string, dataType: MarketDataType, options: {
    timeFrame?: TimeFrame;
    fields?: string[];
    vendor?: DataVendor;
    quality?: MarketDataQuality;
    deliveryMethod?: 'WEBSOCKET' | 'HTTP_STREAMING' | 'CALLBACK' | 'QUEUE';
    throttleMs?: number;
}): Promise<MarketDataSubscription>;
/**
 * Cancel market data subscription
 */
export declare function cancelSubscription(subscriptionId: string, userId: string): Promise<void>;
/**
 * Get user's active subscriptions
 */
export declare function getUserSubscriptions(userId: string, filters?: {
    status?: SubscriptionStatus;
    dataType?: MarketDataType;
    vendor?: DataVendor;
}): Promise<MarketDataSubscription[]>;
/**
 * Manage subscription rate limits
 */
export declare function checkSubscriptionRateLimit(userId: string, vendor: DataVendor): Promise<{
    allowed: boolean;
    current: number;
    limit: number;
    resetAt: Date;
}>;
/**
 * Retrieve historical quotes
 */
export declare function getHistoricalQuotes(request: HistoricalDataRequest): Promise<MarketDataQuote[]>;
/**
 * Retrieve historical bars (OHLCV)
 */
export declare function getHistoricalBars(request: HistoricalDataRequest): Promise<MarketDataBar[]>;
/**
 * Retrieve historical time and sales
 */
export declare function getHistoricalTimeAndSales(symbol: string, startDate: Date, endDate: Date, filters?: {
    minSize?: number;
    exchanges?: string[];
}): Promise<TimeAndSales>;
/**
 * Backfill missing historical data
 */
export declare function backfillHistoricalData(symbol: string, dataType: MarketDataType, startDate: Date, endDate: Date, vendor: DataVendor): Promise<{
    recordsAdded: number;
    gaps: Array<{
        start: Date;
        end: Date;
    }>;
}>;
/**
 * Validate market data quality
 */
export declare function validateMarketDataQuality(quote: MarketDataQuote): Promise<{
    isValid: boolean;
    issues: Array<{
        severity: 'ERROR' | 'WARNING';
        message: string;
    }>;
}>;
/**
 * Monitor market data feed health
 */
export declare function monitorFeedHealth(vendor: DataVendor, window?: number): Promise<MarketDataQualityMetrics>;
/**
 * Detect and handle duplicate market data messages
 */
export declare function detectDuplicates(messages: Array<{
    sequenceNumber: number;
    timestamp: Date;
    data: any;
}>): Array<{
    sequenceNumber: number;
    timestamp: Date;
    data: any;
}>;
/**
 * Detect out-of-sequence messages
 */
export declare function detectOutOfSequence(messages: Array<{
    sequenceNumber: number;
    data: any;
}>): Array<{
    expected: number;
    received: number;
    gap: number;
}>;
/**
 * Connect to Bloomberg Terminal API
 */
export declare function connectToBloomberg(config: VendorConnectionConfig): Promise<any>;
/**
 * Connect to Reuters/Refinitiv DataScope
 */
export declare function connectToReuters(config: VendorConnectionConfig): Promise<any>;
/**
 * Connect to ICE Data Services
 */
export declare function connectToICE(config: VendorConnectionConfig): Promise<any>;
/**
 * Handle vendor failover
 */
export declare function handleVendorFailover(primaryVendor: DataVendor, secondaryVendor: DataVendor, subscriptions: MarketDataSubscription[]): Promise<void>;
/**
 * Cache market data with TTL
 */
export declare function cacheMarketData(symbol: string, dataType: MarketDataType, data: any, ttl?: number): Promise<void>;
/**
 * Retrieve cached market data
 */
export declare function getCachedMarketData(symbol: string, dataType: MarketDataType): Promise<any | null>;
/**
 * Optimize market data delivery with conflation
 */
export declare function conflateMarketData(updates: MarketDataQuote[], windowMs?: number): MarketDataQuote[];
/**
 * Validate user market data entitlements
 */
export declare function validateMarketDataAccess(symbol: string, vendor: DataVendor, dataTypes: MarketDataType[]): Promise<boolean>;
/**
 * Get user entitlements
 */
export declare function getUserEntitlements(userId: string): Promise<MarketDataEntitlement[]>;
/**
 * Check symbol-level entitlements
 */
export declare function checkSymbolEntitlement(userId: string, symbol: string, dataType: MarketDataType): Promise<boolean>;
declare const _default: {
    initializeMarketDataStream: typeof initializeMarketDataStream;
    streamRealTimeQuotes: typeof streamRealTimeQuotes;
    streamMarketDepth: typeof streamMarketDepth;
    streamTimeAndSales: typeof streamTimeAndSales;
    streamBars: typeof streamBars;
    streamMultipleSymbols: typeof streamMultipleSymbols;
    normalizeMarketData: typeof normalizeMarketData;
    normalizeBloombergData: typeof normalizeBloombergData;
    normalizeReutersData: typeof normalizeReutersData;
    normalizeICEData: typeof normalizeICEData;
    normalizeIEXData: typeof normalizeIEXData;
    convertPriceFormat: typeof convertPriceFormat;
    aggregateQuotes: typeof aggregateQuotes;
    calculateNBBO: typeof calculateNBBO;
    detectArbitrageOpportunities: typeof detectArbitrageOpportunities;
    createSubscription: typeof createSubscription;
    cancelSubscription: typeof cancelSubscription;
    getUserSubscriptions: typeof getUserSubscriptions;
    checkSubscriptionRateLimit: typeof checkSubscriptionRateLimit;
    getHistoricalQuotes: typeof getHistoricalQuotes;
    getHistoricalBars: typeof getHistoricalBars;
    getHistoricalTimeAndSales: typeof getHistoricalTimeAndSales;
    backfillHistoricalData: typeof backfillHistoricalData;
    validateMarketDataQuality: typeof validateMarketDataQuality;
    monitorFeedHealth: typeof monitorFeedHealth;
    detectDuplicates: typeof detectDuplicates;
    detectOutOfSequence: typeof detectOutOfSequence;
    connectToBloomberg: typeof connectToBloomberg;
    connectToReuters: typeof connectToReuters;
    connectToICE: typeof connectToICE;
    handleVendorFailover: typeof handleVendorFailover;
    cacheMarketData: typeof cacheMarketData;
    getCachedMarketData: typeof getCachedMarketData;
    conflateMarketData: typeof conflateMarketData;
    validateMarketDataAccess: typeof validateMarketDataAccess;
    getUserEntitlements: typeof getUserEntitlements;
    checkSymbolEntitlement: typeof checkSymbolEntitlement;
};
export default _default;
//# sourceMappingURL=market-data-service-kit.d.ts.map