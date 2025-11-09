/**
 * LOC: TRDMKT1234567
 * File: /reuse/trading/market-data-models-kit.ts
 *
 * UPSTREAM (imports from):
 *   - ../error-handling-kit.ts
 *   - ../validation-kit.ts
 *   - ../date-time-kit.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend trading services
 *   - Market data feed handlers
 *   - Trading analytics engines
 *   - Real-time pricing services
 */
/**
 * File: /reuse/trading/market-data-models-kit.ts
 * Locator: WC-TRD-MKT-001
 * Purpose: Bloomberg Terminal-Level Market Data Models & Processing - Real-time & historical market data
 *
 * Upstream: Error handling, validation, date/time utilities
 * Downstream: ../backend/*, Trading services, market data feeds, pricing engines, analytics
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 45+ utility functions for market data, securities, quotes, trades, order books, OHLCV, corporate actions
 *
 * LLM Context: Enterprise-grade market data platform competing with Bloomberg Terminal.
 * Provides security master data, real-time quotes, trade execution data, order book depth, tick data,
 * OHLCV bars, market depth, Level 2 data, corporate actions, trading calendars, market holidays,
 * data quality validation, gap detection, anomaly detection, vendor integration.
 */
import { Sequelize, Transaction } from 'sequelize';
interface SecurityMaster {
    securityId: string;
    cusip: string | null;
    isin: string | null;
    sedol: string | null;
    ticker: string;
    exchange: string;
    instrumentType: 'EQUITY' | 'BOND' | 'OPTION' | 'FUTURE' | 'ETF' | 'MUTUAL_FUND' | 'CRYPTO' | 'FX';
    securityName: string;
    currency: string;
    country: string;
    sector: string | null;
    industry: string | null;
    active: boolean;
    listingDate: Date | null;
    delistingDate: Date | null;
    metadata: Record<string, any>;
}
interface MarketPrice {
    securityId: string;
    timestamp: Date;
    price: number;
    volume: number;
    bid: number | null;
    ask: number | null;
    bidSize: number | null;
    askSize: number | null;
    last: number;
    change: number;
    changePercent: number;
    high: number;
    low: number;
    open: number;
    previousClose: number;
    vwap: number | null;
}
interface Quote {
    securityId: string;
    timestamp: Date;
    timestampMicros: number;
    bid: number;
    ask: number;
    bidSize: number;
    askSize: number;
    spread: number;
    spreadPercent: number;
    midPrice: number;
    quoteCondition: string;
    exchange: string;
    sequence: number;
}
interface Trade {
    tradeId: string;
    securityId: string;
    timestamp: Date;
    timestampMicros: number;
    price: number;
    quantity: number;
    notional: number;
    side: 'BUY' | 'SELL' | 'UNKNOWN';
    tradeCondition: string;
    exchange: string;
    venue: string;
    aggressorSide: 'BUY' | 'SELL' | 'UNKNOWN' | null;
    sequence: number;
}
interface OrderBook {
    securityId: string;
    timestamp: Date;
    bids: Array<{
        price: number;
        size: number;
        orders: number;
    }>;
    asks: Array<{
        price: number;
        size: number;
        orders: number;
    }>;
    levels: number;
    spread: number;
    midPrice: number;
    imbalance: number;
    totalBidVolume: number;
    totalAskVolume: number;
}
interface TickData {
    securityId: string;
    timestamp: Date;
    timestampMicros: number;
    tickType: 'TRADE' | 'QUOTE' | 'BBO';
    price: number | null;
    size: number | null;
    bid: number | null;
    ask: number | null;
    bidSize: number | null;
    askSize: number | null;
    conditions: string[];
    exchange: string;
    sequence: number;
}
interface OHLCVData {
    securityId: string;
    interval: '1MIN' | '5MIN' | '15MIN' | '30MIN' | '1HOUR' | '4HOUR' | 'DAILY' | 'WEEKLY' | 'MONTHLY';
    periodStart: Date;
    periodEnd: Date;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    vwap: number;
    tradeCount: number;
    openInterest: number | null;
}
interface MarketDepth {
    securityId: string;
    timestamp: Date;
    levels: number;
    bidLevels: Array<{
        price: number;
        size: number;
        orders: number;
        exchange: string;
    }>;
    askLevels: Array<{
        price: number;
        size: number;
        orders: number;
        exchange: string;
    }>;
    aggregatedBidVolume: number;
    aggregatedAskVolume: number;
    depthImbalance: number;
    spreadBps: number;
}
interface Level2Data {
    securityId: string;
    timestamp: Date;
    timestampMicros: number;
    side: 'BID' | 'ASK';
    priceLevel: number;
    price: number;
    size: number;
    orderCount: number;
    marketMaker: string | null;
    exchange: string;
    action: 'ADD' | 'MODIFY' | 'DELETE';
}
interface CorporateAction {
    actionId: string;
    securityId: string;
    actionType: 'DIVIDEND' | 'SPLIT' | 'REVERSE_SPLIT' | 'MERGER' | 'SPINOFF' | 'RIGHTS_ISSUE' | 'SPECIAL_DIVIDEND';
    exDate: Date;
    recordDate: Date;
    paymentDate: Date | null;
    announcementDate: Date;
    ratio: number | null;
    amount: number | null;
    currency: string;
    status: 'ANNOUNCED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
    description: string;
    metadata: Record<string, any>;
}
interface TradingCalendar {
    exchange: string;
    tradingDate: Date;
    isBusinessDay: boolean;
    isHoliday: boolean;
    holidayName: string | null;
    marketOpen: string | null;
    marketClose: string | null;
    preMarketOpen: string | null;
    preMarketClose: string | null;
    postMarketOpen: string | null;
    postMarketClose: string | null;
    earlyClose: boolean;
    tradingSession: 'REGULAR' | 'PRE' | 'POST' | 'EXTENDED' | 'CLOSED';
}
interface MarketDataSnapshot {
    securityId: string;
    timestamp: Date;
    price: MarketPrice;
    quote: Quote | null;
    lastTrade: Trade | null;
    orderBook: OrderBook | null;
    dailyStats: {
        open: number;
        high: number;
        low: number;
        close: number;
        volume: number;
        vwap: number;
        tradeCount: number;
    };
}
interface DataQualityMetrics {
    securityId: string;
    startTime: Date;
    endTime: Date;
    totalTicks: number;
    validTicks: number;
    invalidTicks: number;
    duplicateTicks: number;
    outOfSequenceTicks: number;
    gapCount: number;
    maxGapSeconds: number;
    qualityScore: number;
    issues: Array<{
        type: string;
        count: number;
        severity: string;
    }>;
}
/**
 * Sequelize model for Security Master with comprehensive identifier management.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} SecurityMaster model
 *
 * @example
 * ```typescript
 * const SecurityMaster = createSecurityMasterModel(sequelize);
 * const security = await SecurityMaster.create({
 *   ticker: 'AAPL',
 *   exchange: 'NASDAQ',
 *   instrumentType: 'EQUITY',
 *   securityName: 'Apple Inc.',
 *   currency: 'USD'
 * });
 * ```
 */
export declare const createSecurityMasterModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        securityId: string;
        cusip: string | null;
        isin: string | null;
        sedol: string | null;
        figi: string | null;
        ticker: string;
        exchange: string;
        instrumentType: string;
        securityName: string;
        currency: string;
        country: string;
        sector: string | null;
        industry: string | null;
        issuer: string | null;
        active: boolean;
        listingDate: Date | null;
        delistingDate: Date | null;
        lotSize: number;
        tickSize: number;
        multiplier: number;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
        readonly deletedAt: Date | null;
    };
};
/**
 * Sequelize model for Market Data with real-time price tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} MarketData model
 *
 * @example
 * ```typescript
 * const MarketData = createMarketDataModel(sequelize);
 * const price = await MarketData.create({
 *   securityId: 'AAPL-NASDAQ',
 *   price: 175.25,
 *   volume: 1000000,
 *   timestamp: new Date()
 * });
 * ```
 */
export declare const createMarketDataModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        securityId: string;
        timestamp: Date;
        timestampMicros: number;
        price: number;
        volume: number;
        bid: number | null;
        ask: number | null;
        bidSize: number | null;
        askSize: number | null;
        last: number;
        change: number;
        changePercent: number;
        high: number;
        low: number;
        open: number;
        previousClose: number;
        vwap: number | null;
        tradeCount: number;
        dataSource: string;
        quality: string;
        metadata: Record<string, any>;
        readonly createdAt: Date;
    };
};
/**
 * Sequelize model for Corporate Actions with price adjustment tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CorporateAction model
 *
 * @example
 * ```typescript
 * const CorporateAction = createCorporateActionModel(sequelize);
 * const dividend = await CorporateAction.create({
 *   securityId: 'AAPL-NASDAQ',
 *   actionType: 'DIVIDEND',
 *   exDate: new Date('2025-11-14'),
 *   amount: 0.25
 * });
 * ```
 */
export declare const createCorporateActionModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        actionId: string;
        securityId: string;
        actionType: string;
        exDate: Date;
        recordDate: Date;
        paymentDate: Date | null;
        announcementDate: Date;
        ratio: number | null;
        amount: number | null;
        currency: string;
        status: string;
        description: string;
        priceAdjustmentFactor: number | null;
        volumeAdjustmentFactor: number | null;
        processed: boolean;
        processedAt: Date | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Trading Calendar with market hours and holidays.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} TradingCalendar model
 *
 * @example
 * ```typescript
 * const TradingCalendar = createTradingCalendarModel(sequelize);
 * const calendar = await TradingCalendar.create({
 *   exchange: 'NASDAQ',
 *   tradingDate: new Date('2025-11-09'),
 *   isBusinessDay: false,
 *   isHoliday: true,
 *   holidayName: 'Thanksgiving'
 * });
 * ```
 */
export declare const createTradingCalendarModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        exchange: string;
        tradingDate: Date;
        isBusinessDay: boolean;
        isHoliday: boolean;
        holidayName: string | null;
        marketOpen: string | null;
        marketClose: string | null;
        preMarketOpen: string | null;
        preMarketClose: string | null;
        postMarketOpen: string | null;
        postMarketClose: string | null;
        earlyClose: boolean;
        tradingSession: string;
        timezone: string;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Creates or updates security master record.
 *
 * @param {Partial<SecurityMaster>} securityData - Security data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<object>} Created/updated security
 *
 * @example
 * ```typescript
 * const security = await createSecurityMaster({
 *   ticker: 'AAPL',
 *   exchange: 'NASDAQ',
 *   instrumentType: 'EQUITY',
 *   securityName: 'Apple Inc.',
 *   currency: 'USD',
 *   country: 'US'
 * });
 * ```
 */
export declare const createSecurityMaster: (securityData: Partial<SecurityMaster>, transaction?: Transaction) => Promise<any>;
/**
 * Updates security master record with new information.
 *
 * @param {string} securityId - Security identifier
 * @param {Partial<SecurityMaster>} updates - Fields to update
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<object>} Updated security
 *
 * @example
 * ```typescript
 * const updated = await updateSecurityMaster('AAPL-NASDAQ', { sector: 'Technology' });
 * ```
 */
export declare const updateSecurityMaster: (securityId: string, updates: Partial<SecurityMaster>, transaction?: Transaction) => Promise<any>;
/**
 * Finds security by any supported identifier (CUSIP, ISIN, SEDOL, ticker).
 *
 * @param {string} identifier - Security identifier
 * @param {string} [identifierType] - Type of identifier
 * @returns {Promise<SecurityMaster | null>} Found security or null
 *
 * @example
 * ```typescript
 * const security = await findSecurityByIdentifier('037833100', 'CUSIP');
 * const security2 = await findSecurityByIdentifier('AAPL');
 * ```
 */
export declare const findSecurityByIdentifier: (identifier: string, identifierType?: string) => Promise<SecurityMaster | null>;
/**
 * Validates security identifiers (CUSIP, ISIN, SEDOL) checksums.
 *
 * @param {string} identifier - Identifier to validate
 * @param {string} type - Identifier type ('CUSIP' | 'ISIN' | 'SEDOL')
 * @returns {Promise<{ valid: boolean; error?: string }>} Validation result
 *
 * @example
 * ```typescript
 * const result = await validateSecurityIdentifiers('037833100', 'CUSIP');
 * if (!result.valid) console.error(result.error);
 * ```
 */
export declare const validateSecurityIdentifiers: (identifier: string, type: string) => Promise<{
    valid: boolean;
    error?: string;
}>;
/**
 * Imports securities from external data feed.
 *
 * @param {string} feedSource - Data feed source
 * @param {any[]} securities - Securities to import
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<{ imported: number; skipped: number; errors: string[] }>} Import result
 *
 * @example
 * ```typescript
 * const result = await importSecuritiesFromFeed('BLOOMBERG', securitiesData);
 * console.log(`Imported ${result.imported} securities`);
 * ```
 */
export declare const importSecuritiesFromFeed: (feedSource: string, securities: any[], transaction?: Transaction) => Promise<{
    imported: number;
    skipped: number;
    errors: string[];
}>;
/**
 * Deactivates security on delisting.
 *
 * @param {string} securityId - Security identifier
 * @param {Date} delistingDate - Delisting date
 * @param {string} reason - Delisting reason
 * @returns {Promise<object>} Updated security
 *
 * @example
 * ```typescript
 * const deactivated = await deactivateSecurity('XYZ-NYSE', new Date(), 'Merger completion');
 * ```
 */
export declare const deactivateSecurity: (securityId: string, delistingDate: Date, reason: string) => Promise<any>;
/**
 * Gets security trading specifications (lot size, tick size, multiplier).
 *
 * @param {string} securityId - Security identifier
 * @returns {Promise<{ lotSize: number; tickSize: number; multiplier: number }>} Trading specs
 *
 * @example
 * ```typescript
 * const specs = await getSecurityTradingSpecs('AAPL-NASDAQ');
 * console.log(`Tick size: $${specs.tickSize}`);
 * ```
 */
export declare const getSecurityTradingSpecs: (securityId: string) => Promise<{
    lotSize: number;
    tickSize: number;
    multiplier: number;
}>;
/**
 * Ingests market data from external feed with validation.
 *
 * @param {string} feedId - Data feed identifier
 * @param {any[]} dataPoints - Market data points
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<{ processed: number; rejected: number; errors: string[] }>} Ingestion result
 *
 * @example
 * ```typescript
 * const result = await ingestMarketDataFeed('BLOOMBERG-EQUITY', marketData);
 * ```
 */
export declare const ingestMarketDataFeed: (feedId: string, dataPoints: any[], transaction?: Transaction) => Promise<{
    processed: number;
    rejected: number;
    errors: string[];
}>;
/**
 * Validates market data quality and detects anomalies.
 *
 * @param {string} securityId - Security identifier
 * @param {Date} startTime - Validation start time
 * @param {Date} endTime - Validation end time
 * @returns {Promise<DataQualityMetrics>} Quality metrics
 *
 * @example
 * ```typescript
 * const quality = await validateMarketDataQuality('AAPL-NASDAQ', startTime, endTime);
 * if (quality.qualityScore < 0.95) console.warn('Poor data quality');
 * ```
 */
export declare const validateMarketDataQuality: (securityId: string, startTime: Date, endTime: Date) => Promise<DataQualityMetrics>;
/**
 * Processes real-time quote update.
 *
 * @param {Quote} quote - Quote data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<object>} Processed quote
 *
 * @example
 * ```typescript
 * const quote = await processRealtimeQuote({
 *   securityId: 'AAPL-NASDAQ',
 *   bid: 175.20,
 *   ask: 175.25,
 *   bidSize: 1000,
 *   askSize: 800,
 *   timestamp: new Date()
 * });
 * ```
 */
export declare const processRealtimeQuote: (quote: Quote, transaction?: Transaction) => Promise<any>;
/**
 * Processes real-time trade execution.
 *
 * @param {Trade} trade - Trade data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<object>} Processed trade
 *
 * @example
 * ```typescript
 * const trade = await processRealtimeTrade({
 *   securityId: 'AAPL-NASDAQ',
 *   price: 175.23,
 *   quantity: 500,
 *   timestamp: new Date()
 * });
 * ```
 */
export declare const processRealtimeTrade: (trade: Trade, transaction?: Transaction) => Promise<any>;
/**
 * Handles market data gaps and missing data.
 *
 * @param {string} securityId - Security identifier
 * @param {Date} gapStart - Gap start time
 * @param {Date} gapEnd - Gap end time
 * @param {object} [options] - Gap handling options
 * @returns {Promise<{ filled: boolean; method: string; dataPoints: number }>} Gap handling result
 *
 * @example
 * ```typescript
 * const result = await handleMarketDataGap('AAPL-NASDAQ', gapStart, gapEnd, { method: 'FORWARD_FILL' });
 * ```
 */
export declare const handleMarketDataGap: (securityId: string, gapStart: Date, gapEnd: Date, options?: any) => Promise<{
    filled: boolean;
    method: string;
    dataPoints: number;
}>;
/**
 * Detects price anomalies and suspicious trades.
 *
 * @param {string} securityId - Security identifier
 * @param {number} price - Price to check
 * @param {object} [thresholds] - Anomaly detection thresholds
 * @returns {Promise<{ anomaly: boolean; type?: string; severity?: string; details?: string }>} Anomaly detection result
 *
 * @example
 * ```typescript
 * const check = await detectPriceAnomalies('AAPL-NASDAQ', 250.00, { maxDeviation: 5 });
 * ```
 */
export declare const detectPriceAnomalies: (securityId: string, price: number, thresholds?: any) => Promise<{
    anomaly: boolean;
    type?: string;
    severity?: string;
    details?: string;
}>;
/**
 * Gets latest market data snapshot for security.
 *
 * @param {string} securityId - Security identifier
 * @returns {Promise<MarketDataSnapshot>} Latest market snapshot
 *
 * @example
 * ```typescript
 * const snapshot = await getLatestMarketSnapshot('AAPL-NASDAQ');
 * console.log(`Current price: $${snapshot.price.last}`);
 * ```
 */
export declare const getLatestMarketSnapshot: (securityId: string) => Promise<MarketDataSnapshot>;
/**
 * Generates OHLCV bars for specified interval.
 *
 * @param {string} securityId - Security identifier
 * @param {string} interval - Time interval
 * @param {Date} startTime - Start time
 * @param {Date} endTime - End time
 * @returns {Promise<OHLCVData[]>} OHLCV bars
 *
 * @example
 * ```typescript
 * const bars = await generateOHLCVBars('AAPL-NASDAQ', '5MIN', startTime, endTime);
 * ```
 */
export declare const generateOHLCVBars: (securityId: string, interval: string, startTime: Date, endTime: Date) => Promise<OHLCVData[]>;
/**
 * Aggregates tick data to OHLCV bars.
 *
 * @param {TickData[]} ticks - Tick data
 * @param {string} interval - Aggregation interval
 * @returns {Promise<OHLCVData[]>} Aggregated OHLCV bars
 *
 * @example
 * ```typescript
 * const bars = await aggregateTicksToOHLCV(ticks, '1MIN');
 * ```
 */
export declare const aggregateTicksToOHLCV: (ticks: TickData[], interval: string) => Promise<OHLCVData[]>;
/**
 * Calculates Volume-Weighted Average Price (VWAP).
 *
 * @param {string} securityId - Security identifier
 * @param {Date} startTime - Calculation start time
 * @param {Date} endTime - Calculation end time
 * @returns {Promise<number>} VWAP
 *
 * @example
 * ```typescript
 * const vwap = await calculateVWAP('AAPL-NASDAQ', marketOpen, marketClose);
 * ```
 */
export declare const calculateVWAP: (securityId: string, startTime: Date, endTime: Date) => Promise<number>;
/**
 * Calculates Time-Weighted Average Price (TWAP).
 *
 * @param {string} securityId - Security identifier
 * @param {Date} startTime - Calculation start time
 * @param {Date} endTime - Calculation end time
 * @returns {Promise<number>} TWAP
 *
 * @example
 * ```typescript
 * const twap = await calculateTWAP('AAPL-NASDAQ', marketOpen, marketClose);
 * ```
 */
export declare const calculateTWAP: (securityId: string, startTime: Date, endTime: Date) => Promise<number>;
/**
 * Resamples OHLCV data to different interval.
 *
 * @param {OHLCVData[]} bars - Original OHLCV bars
 * @param {string} targetInterval - Target interval
 * @returns {Promise<OHLCVData[]>} Resampled bars
 *
 * @example
 * ```typescript
 * const hourlyBars = await resampleOHLCVData(minuteBars, '1HOUR');
 * ```
 */
export declare const resampleOHLCVData: (bars: OHLCVData[], targetInterval: string) => Promise<OHLCVData[]>;
/**
 * Adjusts OHLCV data for corporate actions.
 *
 * @param {string} securityId - Security identifier
 * @param {Date} adjustmentDate - Adjustment date
 * @param {OHLCVData[]} bars - OHLCV bars to adjust
 * @returns {Promise<OHLCVData[]>} Adjusted OHLCV bars
 *
 * @example
 * ```typescript
 * const adjusted = await adjustOHLCVForCorporateActions('AAPL-NASDAQ', splitDate, historicalBars);
 * ```
 */
export declare const adjustOHLCVForCorporateActions: (securityId: string, adjustmentDate: Date, bars: OHLCVData[]) => Promise<OHLCVData[]>;
/**
 * Exports OHLCV data to CSV format.
 *
 * @param {OHLCVData[]} bars - OHLCV bars
 * @param {object} [options] - Export options
 * @returns {Promise<Buffer>} CSV data
 *
 * @example
 * ```typescript
 * const csv = await exportOHLCVToCSV(bars, { includeHeader: true });
 * ```
 */
export declare const exportOHLCVToCSV: (bars: OHLCVData[], options?: any) => Promise<Buffer>;
/**
 * Updates order book with Level 2 data.
 *
 * @param {string} securityId - Security identifier
 * @param {Level2Data} update - Level 2 update
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<OrderBook>} Updated order book
 *
 * @example
 * ```typescript
 * const orderBook = await updateOrderBook('AAPL-NASDAQ', level2Update);
 * ```
 */
export declare const updateOrderBook: (securityId: string, update: Level2Data, transaction?: Transaction) => Promise<OrderBook>;
/**
 * Gets market depth for security.
 *
 * @param {string} securityId - Security identifier
 * @param {number} [levels=10] - Number of price levels
 * @returns {Promise<MarketDepth>} Market depth
 *
 * @example
 * ```typescript
 * const depth = await getMarketDepth('AAPL-NASDAQ', 20);
 * ```
 */
export declare const getMarketDepth: (securityId: string, levels?: number) => Promise<MarketDepth>;
/**
 * Calculates bid-ask spread metrics.
 *
 * @param {Quote} quote - Quote data
 * @returns {Promise<{ spread: number; spreadPercent: number; spreadBps: number }>} Spread metrics
 *
 * @example
 * ```typescript
 * const spreads = await calculateBidAskSpread(quote);
 * console.log(`Spread: ${spreads.spreadBps} bps`);
 * ```
 */
export declare const calculateBidAskSpread: (quote: Quote) => Promise<{
    spread: number;
    spreadPercent: number;
    spreadBps: number;
}>;
/**
 * Detects order book imbalances.
 *
 * @param {OrderBook} orderBook - Order book
 * @param {number} [threshold=0.2] - Imbalance threshold
 * @returns {Promise<{ imbalanced: boolean; ratio: number; direction: string }>} Imbalance detection
 *
 * @example
 * ```typescript
 * const imbalance = await detectOrderBookImbalance(orderBook, 0.3);
 * if (imbalance.imbalanced) console.log(`Imbalance: ${imbalance.direction}`);
 * ```
 */
export declare const detectOrderBookImbalance: (orderBook: OrderBook, threshold?: number) => Promise<{
    imbalanced: boolean;
    ratio: number;
    direction: string;
}>;
/**
 * Takes snapshot of current order book.
 *
 * @param {string} securityId - Security identifier
 * @param {number} [levels=10] - Number of levels to capture
 * @returns {Promise<OrderBook>} Order book snapshot
 *
 * @example
 * ```typescript
 * const snapshot = await snapshotOrderBook('AAPL-NASDAQ', 20);
 * ```
 */
export declare const snapshotOrderBook: (securityId: string, levels?: number) => Promise<OrderBook>;
/**
 * Calculates liquidity metrics from order book.
 *
 * @param {OrderBook} orderBook - Order book
 * @returns {Promise<{ bidLiquidity: number; askLiquidity: number; totalLiquidity: number; depthScore: number }>} Liquidity metrics
 *
 * @example
 * ```typescript
 * const liquidity = await calculateOrderBookLiquidity(orderBook);
 * ```
 */
export declare const calculateOrderBookLiquidity: (orderBook: OrderBook) => Promise<{
    bidLiquidity: number;
    askLiquidity: number;
    totalLiquidity: number;
    depthScore: number;
}>;
/**
 * Reconstructs order book from Level 2 updates.
 *
 * @param {string} securityId - Security identifier
 * @param {Level2Data[]} updates - Level 2 updates
 * @returns {Promise<OrderBook>} Reconstructed order book
 *
 * @example
 * ```typescript
 * const orderBook = await reconstructOrderBook('AAPL-NASDAQ', level2Updates);
 * ```
 */
export declare const reconstructOrderBook: (securityId: string, updates: Level2Data[]) => Promise<OrderBook>;
/**
 * Processes and stores tick data.
 *
 * @param {TickData} tick - Tick data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<object>} Processed tick
 *
 * @example
 * ```typescript
 * const tick = await processTickData(tickData);
 * ```
 */
export declare const processTickData: (tick: TickData, transaction?: Transaction) => Promise<any>;
/**
 * Filters ticks by trade conditions.
 *
 * @param {TickData[]} ticks - Tick data
 * @param {string[]} conditions - Conditions to filter by
 * @returns {Promise<TickData[]>} Filtered ticks
 *
 * @example
 * ```typescript
 * const regularTicks = await filterTicksByConditions(ticks, ['REGULAR', 'OPENING']);
 * ```
 */
export declare const filterTicksByConditions: (ticks: TickData[], conditions: string[]) => Promise<TickData[]>;
/**
 * Calculates tick-level statistics.
 *
 * @param {TickData[]} ticks - Tick data
 * @returns {Promise<object>} Tick statistics
 *
 * @example
 * ```typescript
 * const stats = await calculateTickStatistics(ticks);
 * ```
 */
export declare const calculateTickStatistics: (ticks: TickData[]) => Promise<any>;
/**
 * Detects anomalous tick prices.
 *
 * @param {TickData[]} ticks - Tick data
 * @param {object} [thresholds] - Anomaly thresholds
 * @returns {Promise<TickData[]>} Anomalous ticks
 *
 * @example
 * ```typescript
 * const anomalies = await detectAnomalousTickPrices(ticks, { maxDeviation: 5 });
 * ```
 */
export declare const detectAnomalousTickPrices: (ticks: TickData[], thresholds?: any) => Promise<TickData[]>;
/**
 * Exports tick data to time-series format.
 *
 * @param {TickData[]} ticks - Tick data
 * @param {string} format - Export format
 * @returns {Promise<Buffer>} Exported data
 *
 * @example
 * ```typescript
 * const data = await exportTickDataToTimeseries(ticks, 'CSV');
 * ```
 */
export declare const exportTickDataToTimeseries: (ticks: TickData[], format: string) => Promise<Buffer>;
/**
 * Compresses tick data for storage.
 *
 * @param {TickData[]} ticks - Tick data
 * @param {object} [options] - Compression options
 * @returns {Promise<Buffer>} Compressed data
 *
 * @example
 * ```typescript
 * const compressed = await compressTickData(ticks, { algorithm: 'GZIP' });
 * ```
 */
export declare const compressTickData: (ticks: TickData[], options?: any) => Promise<Buffer>;
/**
 * Decompresses stored tick data.
 *
 * @param {Buffer} compressedData - Compressed data
 * @param {object} [options] - Decompression options
 * @returns {Promise<TickData[]>} Decompressed ticks
 *
 * @example
 * ```typescript
 * const ticks = await decompressTickData(compressed);
 * ```
 */
export declare const decompressTickData: (compressedData: Buffer, options?: any) => Promise<TickData[]>;
/**
 * Records corporate action event.
 *
 * @param {Partial<CorporateAction>} actionData - Corporate action data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<object>} Created corporate action
 *
 * @example
 * ```typescript
 * const action = await recordCorporateAction({
 *   securityId: 'AAPL-NASDAQ',
 *   actionType: 'DIVIDEND',
 *   exDate: new Date('2025-11-14'),
 *   amount: 0.25
 * });
 * ```
 */
export declare const recordCorporateAction: (actionData: Partial<CorporateAction>, transaction?: Transaction) => Promise<any>;
/**
 * Adjusts historical prices for stock splits.
 *
 * @param {string} securityId - Security identifier
 * @param {Date} splitDate - Split effective date
 * @param {number} ratio - Split ratio
 * @returns {Promise<{ adjusted: number; affectedRecords: number }>} Adjustment result
 *
 * @example
 * ```typescript
 * const result = await adjustPricesForSplit('AAPL-NASDAQ', new Date('2020-08-31'), 4);
 * ```
 */
export declare const adjustPricesForSplit: (securityId: string, splitDate: Date, ratio: number) => Promise<{
    adjusted: number;
    affectedRecords: number;
}>;
/**
 * Adjusts historical prices for dividends.
 *
 * @param {string} securityId - Security identifier
 * @param {Date} exDate - Ex-dividend date
 * @param {number} amount - Dividend amount
 * @returns {Promise<{ adjustmentFactor: number; affectedRecords: number }>} Adjustment result
 *
 * @example
 * ```typescript
 * const result = await adjustPricesForDividend('AAPL-NASDAQ', exDate, 0.25);
 * ```
 */
export declare const adjustPricesForDividend: (securityId: string, exDate: Date, amount: number) => Promise<{
    adjustmentFactor: number;
    affectedRecords: number;
}>;
/**
 * Validates corporate action data.
 *
 * @param {Partial<CorporateAction>} actionData - Action data to validate
 * @returns {Promise<{ valid: boolean; errors: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateCorporateAction(actionData);
 * ```
 */
export declare const validateCorporateAction: (actionData: Partial<CorporateAction>) => Promise<{
    valid: boolean;
    errors: string[];
}>;
/**
 * Notifies subscribers of corporate action.
 *
 * @param {string} actionId - Corporate action ID
 * @param {string[]} subscribers - Subscriber IDs
 * @returns {Promise<{ notified: number; failed: number }>} Notification result
 *
 * @example
 * ```typescript
 * const result = await notifyCorporateActionSubscribers('CA-12345', subscriberList);
 * ```
 */
export declare const notifyCorporateActionSubscribers: (actionId: string, subscribers: string[]) => Promise<{
    notified: number;
    failed: number;
}>;
/**
 * Gets upcoming corporate actions for security.
 *
 * @param {string} securityId - Security identifier
 * @param {number} [daysAhead=30] - Days to look ahead
 * @returns {Promise<CorporateAction[]>} Upcoming corporate actions
 *
 * @example
 * ```typescript
 * const upcoming = await getUpcomingCorporateActions('AAPL-NASDAQ', 60);
 * ```
 */
export declare const getUpcomingCorporateActions: (securityId: string, daysAhead?: number) => Promise<CorporateAction[]>;
/**
 * Processes pending corporate actions.
 *
 * @param {Date} asOfDate - Processing date
 * @returns {Promise<{ processed: number; skipped: number; errors: string[] }>} Processing result
 *
 * @example
 * ```typescript
 * const result = await processPendingCorporateActions(new Date());
 * ```
 */
export declare const processPendingCorporateActions: (asOfDate: Date) => Promise<{
    processed: number;
    skipped: number;
    errors: string[];
}>;
/**
 * Checks if market is currently open.
 *
 * @param {string} exchange - Exchange code
 * @param {Date} [timestamp] - Timestamp to check (defaults to now)
 * @returns {Promise<{ open: boolean; session: string; nextOpen?: Date; nextClose?: Date }>} Market status
 *
 * @example
 * ```typescript
 * const status = await isMarketOpen('NASDAQ');
 * if (status.open) console.log(`Market open in ${status.session} session`);
 * ```
 */
export declare const isMarketOpen: (exchange: string, timestamp?: Date) => Promise<{
    open: boolean;
    session: string;
    nextOpen?: Date;
    nextClose?: Date;
}>;
/**
 * Gets trading hours for exchange.
 *
 * @param {string} exchange - Exchange code
 * @param {Date} date - Trading date
 * @returns {Promise<TradingCalendar>} Trading hours
 *
 * @example
 * ```typescript
 * const hours = await getTradingHours('NASDAQ', new Date());
 * console.log(`Market opens at ${hours.marketOpen}`);
 * ```
 */
export declare const getTradingHours: (exchange: string, date: Date) => Promise<TradingCalendar>;
/**
 * Gets market holidays for exchange.
 *
 * @param {string} exchange - Exchange code
 * @param {number} year - Year
 * @returns {Promise<TradingCalendar[]>} Market holidays
 *
 * @example
 * ```typescript
 * const holidays = await getMarketHolidays('NASDAQ', 2025);
 * ```
 */
export declare const getMarketHolidays: (exchange: string, year: number) => Promise<TradingCalendar[]>;
/**
 * Validates trading session timestamp.
 *
 * @param {string} exchange - Exchange code
 * @param {Date} timestamp - Timestamp to validate
 * @returns {Promise<{ valid: boolean; session: string; reason?: string }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateTradingSession('NASDAQ', orderTimestamp);
 * ```
 */
export declare const validateTradingSession: (exchange: string, timestamp: Date) => Promise<{
    valid: boolean;
    session: string;
    reason?: string;
}>;
/**
 * Gets next trading day for exchange.
 *
 * @param {string} exchange - Exchange code
 * @param {Date} [fromDate] - Starting date (defaults to today)
 * @returns {Promise<Date>} Next trading day
 *
 * @example
 * ```typescript
 * const nextDay = await getNextTradingDay('NASDAQ');
 * ```
 */
export declare const getNextTradingDay: (exchange: string, fromDate?: Date) => Promise<Date>;
/**
 * Default export with all utilities.
 */
declare const _default: {
    createSecurityMasterModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            securityId: string;
            cusip: string | null;
            isin: string | null;
            sedol: string | null;
            figi: string | null;
            ticker: string;
            exchange: string;
            instrumentType: string;
            securityName: string;
            currency: string;
            country: string;
            sector: string | null;
            industry: string | null;
            issuer: string | null;
            active: boolean;
            listingDate: Date | null;
            delistingDate: Date | null;
            lotSize: number;
            tickSize: number;
            multiplier: number;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
            readonly deletedAt: Date | null;
        };
    };
    createMarketDataModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            securityId: string;
            timestamp: Date;
            timestampMicros: number;
            price: number;
            volume: number;
            bid: number | null;
            ask: number | null;
            bidSize: number | null;
            askSize: number | null;
            last: number;
            change: number;
            changePercent: number;
            high: number;
            low: number;
            open: number;
            previousClose: number;
            vwap: number | null;
            tradeCount: number;
            dataSource: string;
            quality: string;
            metadata: Record<string, any>;
            readonly createdAt: Date;
        };
    };
    createCorporateActionModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            actionId: string;
            securityId: string;
            actionType: string;
            exDate: Date;
            recordDate: Date;
            paymentDate: Date | null;
            announcementDate: Date;
            ratio: number | null;
            amount: number | null;
            currency: string;
            status: string;
            description: string;
            priceAdjustmentFactor: number | null;
            volumeAdjustmentFactor: number | null;
            processed: boolean;
            processedAt: Date | null;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createTradingCalendarModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            exchange: string;
            tradingDate: Date;
            isBusinessDay: boolean;
            isHoliday: boolean;
            holidayName: string | null;
            marketOpen: string | null;
            marketClose: string | null;
            preMarketOpen: string | null;
            preMarketClose: string | null;
            postMarketOpen: string | null;
            postMarketClose: string | null;
            earlyClose: boolean;
            tradingSession: string;
            timezone: string;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createSecurityMaster: (securityData: Partial<SecurityMaster>, transaction?: Transaction) => Promise<any>;
    updateSecurityMaster: (securityId: string, updates: Partial<SecurityMaster>, transaction?: Transaction) => Promise<any>;
    findSecurityByIdentifier: (identifier: string, identifierType?: string) => Promise<SecurityMaster | null>;
    validateSecurityIdentifiers: (identifier: string, type: string) => Promise<{
        valid: boolean;
        error?: string;
    }>;
    importSecuritiesFromFeed: (feedSource: string, securities: any[], transaction?: Transaction) => Promise<{
        imported: number;
        skipped: number;
        errors: string[];
    }>;
    deactivateSecurity: (securityId: string, delistingDate: Date, reason: string) => Promise<any>;
    getSecurityTradingSpecs: (securityId: string) => Promise<{
        lotSize: number;
        tickSize: number;
        multiplier: number;
    }>;
    ingestMarketDataFeed: (feedId: string, dataPoints: any[], transaction?: Transaction) => Promise<{
        processed: number;
        rejected: number;
        errors: string[];
    }>;
    validateMarketDataQuality: (securityId: string, startTime: Date, endTime: Date) => Promise<DataQualityMetrics>;
    processRealtimeQuote: (quote: Quote, transaction?: Transaction) => Promise<any>;
    processRealtimeTrade: (trade: Trade, transaction?: Transaction) => Promise<any>;
    handleMarketDataGap: (securityId: string, gapStart: Date, gapEnd: Date, options?: any) => Promise<{
        filled: boolean;
        method: string;
        dataPoints: number;
    }>;
    detectPriceAnomalies: (securityId: string, price: number, thresholds?: any) => Promise<{
        anomaly: boolean;
        type?: string;
        severity?: string;
        details?: string;
    }>;
    getLatestMarketSnapshot: (securityId: string) => Promise<MarketDataSnapshot>;
    generateOHLCVBars: (securityId: string, interval: string, startTime: Date, endTime: Date) => Promise<OHLCVData[]>;
    aggregateTicksToOHLCV: (ticks: TickData[], interval: string) => Promise<OHLCVData[]>;
    calculateVWAP: (securityId: string, startTime: Date, endTime: Date) => Promise<number>;
    calculateTWAP: (securityId: string, startTime: Date, endTime: Date) => Promise<number>;
    resampleOHLCVData: (bars: OHLCVData[], targetInterval: string) => Promise<OHLCVData[]>;
    adjustOHLCVForCorporateActions: (securityId: string, adjustmentDate: Date, bars: OHLCVData[]) => Promise<OHLCVData[]>;
    exportOHLCVToCSV: (bars: OHLCVData[], options?: any) => Promise<Buffer>;
    updateOrderBook: (securityId: string, update: Level2Data, transaction?: Transaction) => Promise<OrderBook>;
    getMarketDepth: (securityId: string, levels?: number) => Promise<MarketDepth>;
    calculateBidAskSpread: (quote: Quote) => Promise<{
        spread: number;
        spreadPercent: number;
        spreadBps: number;
    }>;
    detectOrderBookImbalance: (orderBook: OrderBook, threshold?: number) => Promise<{
        imbalanced: boolean;
        ratio: number;
        direction: string;
    }>;
    snapshotOrderBook: (securityId: string, levels?: number) => Promise<OrderBook>;
    calculateOrderBookLiquidity: (orderBook: OrderBook) => Promise<{
        bidLiquidity: number;
        askLiquidity: number;
        totalLiquidity: number;
        depthScore: number;
    }>;
    reconstructOrderBook: (securityId: string, updates: Level2Data[]) => Promise<OrderBook>;
    processTickData: (tick: TickData, transaction?: Transaction) => Promise<any>;
    filterTicksByConditions: (ticks: TickData[], conditions: string[]) => Promise<TickData[]>;
    calculateTickStatistics: (ticks: TickData[]) => Promise<any>;
    detectAnomalousTickPrices: (ticks: TickData[], thresholds?: any) => Promise<TickData[]>;
    exportTickDataToTimeseries: (ticks: TickData[], format: string) => Promise<Buffer>;
    compressTickData: (ticks: TickData[], options?: any) => Promise<Buffer>;
    decompressTickData: (compressedData: Buffer, options?: any) => Promise<TickData[]>;
    recordCorporateAction: (actionData: Partial<CorporateAction>, transaction?: Transaction) => Promise<any>;
    adjustPricesForSplit: (securityId: string, splitDate: Date, ratio: number) => Promise<{
        adjusted: number;
        affectedRecords: number;
    }>;
    adjustPricesForDividend: (securityId: string, exDate: Date, amount: number) => Promise<{
        adjustmentFactor: number;
        affectedRecords: number;
    }>;
    validateCorporateAction: (actionData: Partial<CorporateAction>) => Promise<{
        valid: boolean;
        errors: string[];
    }>;
    notifyCorporateActionSubscribers: (actionId: string, subscribers: string[]) => Promise<{
        notified: number;
        failed: number;
    }>;
    getUpcomingCorporateActions: (securityId: string, daysAhead?: number) => Promise<CorporateAction[]>;
    processPendingCorporateActions: (asOfDate: Date) => Promise<{
        processed: number;
        skipped: number;
        errors: string[];
    }>;
    isMarketOpen: (exchange: string, timestamp?: Date) => Promise<{
        open: boolean;
        session: string;
        nextOpen?: Date;
        nextClose?: Date;
    }>;
    getTradingHours: (exchange: string, date: Date) => Promise<TradingCalendar>;
    getMarketHolidays: (exchange: string, year: number) => Promise<TradingCalendar[]>;
    validateTradingSession: (exchange: string, timestamp: Date) => Promise<{
        valid: boolean;
        session: string;
        reason?: string;
    }>;
    getNextTradingDay: (exchange: string, fromDate?: Date) => Promise<Date>;
};
export default _default;
//# sourceMappingURL=market-data-models-kit.d.ts.map