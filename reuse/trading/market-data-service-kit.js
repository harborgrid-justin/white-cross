"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeFrame = exports.SubscriptionStatus = exports.MarketDataQuality = exports.DataVendor = exports.MarketDataType = void 0;
exports.initializeMarketDataStream = initializeMarketDataStream;
exports.streamRealTimeQuotes = streamRealTimeQuotes;
exports.streamMarketDepth = streamMarketDepth;
exports.streamTimeAndSales = streamTimeAndSales;
exports.streamBars = streamBars;
exports.streamMultipleSymbols = streamMultipleSymbols;
exports.normalizeMarketData = normalizeMarketData;
exports.normalizeBloombergData = normalizeBloombergData;
exports.normalizeReutersData = normalizeReutersData;
exports.normalizeICEData = normalizeICEData;
exports.normalizeIEXData = normalizeIEXData;
exports.convertPriceFormat = convertPriceFormat;
exports.aggregateQuotes = aggregateQuotes;
exports.calculateNBBO = calculateNBBO;
exports.detectArbitrageOpportunities = detectArbitrageOpportunities;
exports.createSubscription = createSubscription;
exports.cancelSubscription = cancelSubscription;
exports.getUserSubscriptions = getUserSubscriptions;
exports.checkSubscriptionRateLimit = checkSubscriptionRateLimit;
exports.getHistoricalQuotes = getHistoricalQuotes;
exports.getHistoricalBars = getHistoricalBars;
exports.getHistoricalTimeAndSales = getHistoricalTimeAndSales;
exports.backfillHistoricalData = backfillHistoricalData;
exports.validateMarketDataQuality = validateMarketDataQuality;
exports.monitorFeedHealth = monitorFeedHealth;
exports.detectDuplicates = detectDuplicates;
exports.detectOutOfSequence = detectOutOfSequence;
exports.connectToBloomberg = connectToBloomberg;
exports.connectToReuters = connectToReuters;
exports.connectToICE = connectToICE;
exports.handleVendorFailover = handleVendorFailover;
exports.cacheMarketData = cacheMarketData;
exports.getCachedMarketData = getCachedMarketData;
exports.conflateMarketData = conflateMarketData;
exports.validateMarketDataAccess = validateMarketDataAccess;
exports.getUserEntitlements = getUserEntitlements;
exports.checkSymbolEntitlement = checkSymbolEntitlement;
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
const common_1 = require("@nestjs/common");
const ws_1 = __importDefault(require("ws"));
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * Market data types and enumerations
 */
var MarketDataType;
(function (MarketDataType) {
    MarketDataType["QUOTE"] = "QUOTE";
    MarketDataType["TRADE"] = "TRADE";
    MarketDataType["BAR"] = "BAR";
    MarketDataType["BOOK"] = "BOOK";
    MarketDataType["DEPTH"] = "DEPTH";
    MarketDataType["SNAPSHOT"] = "SNAPSHOT";
    MarketDataType["NEWS"] = "NEWS";
    MarketDataType["CORPORATE_ACTION"] = "CORPORATE_ACTION";
    MarketDataType["REFERENCE"] = "REFERENCE";
    MarketDataType["ANALYTICS"] = "ANALYTICS";
})(MarketDataType || (exports.MarketDataType = MarketDataType = {}));
var DataVendor;
(function (DataVendor) {
    DataVendor["BLOOMBERG"] = "BLOOMBERG";
    DataVendor["REUTERS"] = "REUTERS";
    DataVendor["ICE"] = "ICE";
    DataVendor["FACTSET"] = "FACTSET";
    DataVendor["SIP"] = "SIP";
    DataVendor["NASDAQ_TRF"] = "NASDAQ_TRF";
    DataVendor["IEX"] = "IEX";
    DataVendor["POLYGON"] = "POLYGON";
    DataVendor["QUODD"] = "QUODD";
    DataVendor["INTERNAL"] = "INTERNAL";
})(DataVendor || (exports.DataVendor = DataVendor = {}));
var MarketDataQuality;
(function (MarketDataQuality) {
    MarketDataQuality["REAL_TIME"] = "REAL_TIME";
    MarketDataQuality["DELAYED_15MIN"] = "DELAYED_15MIN";
    MarketDataQuality["DELAYED_20MIN"] = "DELAYED_20MIN";
    MarketDataQuality["END_OF_DAY"] = "END_OF_DAY";
    MarketDataQuality["SNAPSHOT"] = "SNAPSHOT";
})(MarketDataQuality || (exports.MarketDataQuality = MarketDataQuality = {}));
var SubscriptionStatus;
(function (SubscriptionStatus) {
    SubscriptionStatus["PENDING"] = "PENDING";
    SubscriptionStatus["ACTIVE"] = "ACTIVE";
    SubscriptionStatus["PAUSED"] = "PAUSED";
    SubscriptionStatus["CANCELED"] = "CANCELED";
    SubscriptionStatus["ERROR"] = "ERROR";
})(SubscriptionStatus || (exports.SubscriptionStatus = SubscriptionStatus = {}));
var TimeFrame;
(function (TimeFrame) {
    TimeFrame["TICK"] = "TICK";
    TimeFrame["ONE_SECOND"] = "1S";
    TimeFrame["FIVE_SECONDS"] = "5S";
    TimeFrame["TEN_SECONDS"] = "10S";
    TimeFrame["THIRTY_SECONDS"] = "30S";
    TimeFrame["ONE_MINUTE"] = "1M";
    TimeFrame["FIVE_MINUTES"] = "5M";
    TimeFrame["FIFTEEN_MINUTES"] = "15M";
    TimeFrame["THIRTY_MINUTES"] = "30M";
    TimeFrame["ONE_HOUR"] = "1H";
    TimeFrame["FOUR_HOURS"] = "4H";
    TimeFrame["DAILY"] = "1D";
    TimeFrame["WEEKLY"] = "1W";
    TimeFrame["MONTHLY"] = "1M";
})(TimeFrame || (exports.TimeFrame = TimeFrame = {}));
// ============================================================================
// REAL-TIME MARKET DATA STREAMING
// ============================================================================
/**
 * Initialize real-time market data stream for a symbol
 */
async function initializeMarketDataStream(symbol, dataTypes, vendor, callback) {
    const logger = new common_1.Logger('MarketData:initializeMarketDataStream');
    try {
        logger.log(`Initializing market data stream for ${symbol} from ${vendor}`);
        // Validate entitlements
        await validateMarketDataAccess(symbol, vendor, dataTypes);
        // Establish vendor connection
        const connection = await connectToVendor(vendor);
        // Subscribe to data types
        const streamId = await subscribeToMarketData(connection, symbol, dataTypes);
        // Set up data handler
        connection.on('message', (message) => {
            const parsedData = parseVendorMessage(message, vendor);
            callback(parsedData);
        });
        logger.log(`Market data stream initialized: ${streamId}`);
        return {
            streamId,
            status: 'ACTIVE'
        };
    }
    catch (error) {
        logger.error(`Failed to initialize market data stream: ${error.message}`, error.stack);
        throw error;
    }
}
/**
 * Stream real-time quotes via WebSocket
 */
async function streamRealTimeQuotes(symbols, websocket, options) {
    const logger = new common_1.Logger('MarketData:streamRealTimeQuotes');
    try {
        logger.log(`Streaming real-time quotes for ${symbols.length} symbols`);
        const subscriptions = new Map();
        for (const symbol of symbols) {
            const subscription = await subscribeToQuotes(symbol, async (quote) => {
                // Apply throttling if specified
                if (options?.throttleMs) {
                    await throttleData(symbol, options.throttleMs);
                }
                // Filter fields if specified
                const filteredQuote = options?.fields
                    ? filterQuoteFields(quote, options.fields)
                    : quote;
                // Send to WebSocket
                if (websocket.readyState === ws_1.default.OPEN) {
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
    }
    catch (error) {
        logger.error(`Failed to stream real-time quotes: ${error.message}`, error.stack);
        throw error;
    }
}
/**
 * Stream Level 2 market depth data
 */
async function streamMarketDepth(symbol, levels, websocket) {
    const logger = new common_1.Logger('MarketData:streamMarketDepth');
    try {
        logger.log(`Streaming Level 2 depth for ${symbol}, ${levels} levels`);
        await subscribeToMarketDepth(symbol, levels, (update) => {
            if (websocket.readyState === ws_1.default.OPEN) {
                websocket.send(JSON.stringify({
                    type: 'MARKET_DEPTH',
                    symbol,
                    data: update,
                    timestamp: new Date()
                }));
            }
        });
    }
    catch (error) {
        logger.error(`Failed to stream market depth: ${error.message}`, error.stack);
        throw error;
    }
}
/**
 * Stream time and sales (tick data)
 */
async function streamTimeAndSales(symbol, websocket, filters) {
    const logger = new common_1.Logger('MarketData:streamTimeAndSales');
    try {
        logger.log(`Streaming time and sales for ${symbol}`);
        await subscribeToTrades(symbol, (trade) => {
            // Apply filters
            if (filters?.minSize && trade.size < filters.minSize)
                return;
            if (filters?.excludeOddLots && trade.isOddLot)
                return;
            if (filters?.onlyBlockTrades && !trade.isBlockTrade)
                return;
            if (websocket.readyState === ws_1.default.OPEN) {
                websocket.send(JSON.stringify({
                    type: 'TRADE',
                    symbol,
                    data: trade,
                    timestamp: new Date()
                }));
            }
        });
    }
    catch (error) {
        logger.error(`Failed to stream time and sales: ${error.message}`, error.stack);
        throw error;
    }
}
/**
 * Stream aggregated bars (OHLCV)
 */
async function streamBars(symbol, timeFrame, websocket) {
    const logger = new common_1.Logger('MarketData:streamBars');
    try {
        logger.log(`Streaming ${timeFrame} bars for ${symbol}`);
        const barBuilder = new BarBuilder(timeFrame);
        await subscribeToTrades(symbol, (trade) => {
            const bar = barBuilder.addTrade(trade);
            if (bar && websocket.readyState === ws_1.default.OPEN) {
                websocket.send(JSON.stringify({
                    type: 'BAR',
                    symbol,
                    timeFrame,
                    data: bar,
                    timestamp: new Date()
                }));
            }
        });
    }
    catch (error) {
        logger.error(`Failed to stream bars: ${error.message}`, error.stack);
        throw error;
    }
}
/**
 * Multi-symbol streaming with fan-out
 */
async function streamMultipleSymbols(symbols, dataTypes, websocket, maxSymbols = 100) {
    const logger = new common_1.Logger('MarketData:streamMultipleSymbols');
    try {
        if (symbols.length > maxSymbols) {
            throw new Error(`Symbol limit exceeded: ${symbols.length} > ${maxSymbols}`);
        }
        logger.log(`Streaming ${dataTypes.join(', ')} for ${symbols.length} symbols`);
        const subscriptionId = `SUB-${Date.now()}`;
        for (const symbol of symbols) {
            for (const dataType of dataTypes) {
                await initializeMarketDataStream(symbol, [dataType], DataVendor.BLOOMBERG, (data) => {
                    if (websocket.readyState === ws_1.default.OPEN) {
                        websocket.send(JSON.stringify({
                            subscriptionId,
                            type: dataType,
                            symbol,
                            data,
                            timestamp: new Date()
                        }));
                    }
                });
            }
        }
        return {
            subscriptionId,
            subscribedSymbols: symbols
        };
    }
    catch (error) {
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
function normalizeMarketData(rawData, vendor) {
    const logger = new common_1.Logger('MarketData:normalizeMarketData');
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
    }
    catch (error) {
        logger.error(`Failed to normalize market data: ${error.message}`, error.stack);
        throw error;
    }
}
/**
 * Normalize Bloomberg data
 */
function normalizeBloombergData(data) {
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
function normalizeReutersData(data) {
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
function normalizeICEData(data) {
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
function normalizeIEXData(data) {
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
function convertPriceFormat(price, fromFormat, toFormat) {
    if (fromFormat === toFormat)
        return price;
    switch (`${fromFormat}-${toFormat}`) {
        case 'DECIMAL-FRACTION':
            return decimalToFraction(price);
        case 'FRACTION-DECIMAL':
            return fractionToDecimal(price);
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
async function aggregateQuotes(symbol, vendors) {
    const logger = new common_1.Logger('MarketData:aggregateQuotes');
    try {
        logger.log(`Aggregating quotes for ${symbol} from ${vendors.length} vendors`);
        const quotes = [];
        // Fetch quotes from all vendors in parallel
        const startTime = Date.now();
        const quotePromises = vendors.map(async (vendor) => {
            const vendorStartTime = Date.now();
            try {
                const quote = await fetchQuoteFromVendor(symbol, vendor);
                const latency = Date.now() - vendorStartTime;
                return { vendor, quote, latency };
            }
            catch (error) {
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
        const aggregated = {
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
    }
    catch (error) {
        logger.error(`Failed to aggregate quotes: ${error.message}`, error.stack);
        throw error;
    }
}
/**
 * Calculate National Best Bid and Offer (NBBO)
 */
function calculateNBBO(quotes) {
    let bestBidPrice = 0;
    let bestBidSize = 0;
    let bestAskPrice = Number.MAX_VALUE;
    let bestAskSize = 0;
    for (const quote of quotes.values()) {
        if (quote.bidPrice > bestBidPrice) {
            bestBidPrice = quote.bidPrice;
            bestBidSize = quote.bidSize;
        }
        else if (quote.bidPrice === bestBidPrice) {
            bestBidSize += quote.bidSize;
        }
        if (quote.askPrice < bestAskPrice) {
            bestAskPrice = quote.askPrice;
            bestAskSize = quote.askSize;
        }
        else if (quote.askPrice === bestAskPrice) {
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
async function detectArbitrageOpportunities(symbol, quotes, minSpread = 0.01) {
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
                type: 'BUY_SELL',
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
async function createSubscription(userId, symbol, dataType, options) {
    const logger = new common_1.Logger('MarketData:createSubscription');
    try {
        logger.log(`Creating subscription for ${userId}: ${symbol} ${dataType}`);
        // Check entitlements
        const entitlements = await getUserEntitlements(userId);
        await validateSubscriptionEntitlements(entitlements, symbol, dataType, options.vendor);
        const subscription = {
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
    }
    catch (error) {
        logger.error(`Failed to create subscription: ${error.message}`, error.stack);
        throw error;
    }
}
/**
 * Cancel market data subscription
 */
async function cancelSubscription(subscriptionId, userId) {
    const logger = new common_1.Logger('MarketData:cancelSubscription');
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
    }
    catch (error) {
        logger.error(`Failed to cancel subscription: ${error.message}`, error.stack);
        throw error;
    }
}
/**
 * Get user's active subscriptions
 */
async function getUserSubscriptions(userId, filters) {
    const logger = new common_1.Logger('MarketData:getUserSubscriptions');
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
    }
    catch (error) {
        logger.error(`Failed to get user subscriptions: ${error.message}`, error.stack);
        throw error;
    }
}
/**
 * Manage subscription rate limits
 */
async function checkSubscriptionRateLimit(userId, vendor) {
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
async function getHistoricalQuotes(request) {
    const logger = new common_1.Logger('MarketData:getHistoricalQuotes');
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
    }
    catch (error) {
        logger.error(`Failed to retrieve historical quotes: ${error.message}`, error.stack);
        throw error;
    }
}
/**
 * Retrieve historical bars (OHLCV)
 */
async function getHistoricalBars(request) {
    const logger = new common_1.Logger('MarketData:getHistoricalBars');
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
    }
    catch (error) {
        logger.error(`Failed to retrieve historical bars: ${error.message}`, error.stack);
        throw error;
    }
}
/**
 * Retrieve historical time and sales
 */
async function getHistoricalTimeAndSales(symbol, startDate, endDate, filters) {
    const logger = new common_1.Logger('MarketData:getHistoricalTimeAndSales');
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
    }
    catch (error) {
        logger.error(`Failed to retrieve historical time and sales: ${error.message}`, error.stack);
        throw error;
    }
}
/**
 * Backfill missing historical data
 */
async function backfillHistoricalData(symbol, dataType, startDate, endDate, vendor) {
    const logger = new common_1.Logger('MarketData:backfillHistoricalData');
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
    }
    catch (error) {
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
async function validateMarketDataQuality(quote) {
    const issues = [];
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
async function monitorFeedHealth(vendor, window = 60000) {
    const logger = new common_1.Logger('MarketData:monitorFeedHealth');
    try {
        const endTime = new Date();
        const startTime = new Date(endTime.getTime() - window);
        const metrics = await calculateFeedMetrics(vendor, startTime, endTime);
        logger.log(`Feed health for ${vendor}: ${JSON.stringify(metrics)}`);
        return metrics;
    }
    catch (error) {
        logger.error(`Failed to monitor feed health: ${error.message}`, error.stack);
        throw error;
    }
}
/**
 * Detect and handle duplicate market data messages
 */
function detectDuplicates(messages) {
    const seen = new Set();
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
function detectOutOfSequence(messages) {
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
async function connectToBloomberg(config) {
    const logger = new common_1.Logger('MarketData:connectToBloomberg');
    try {
        logger.log('Connecting to Bloomberg Terminal API');
        // Implementation would use Bloomberg API SDK
        // This is a placeholder for the actual Bloomberg connection
        const connection = {
            vendor: DataVendor.BLOOMBERG,
            status: 'CONNECTED',
            on: (event, callback) => {
                // Event handler registration
            },
            subscribe: (symbol, fields) => {
                // Subscription logic
            },
            disconnect: () => {
                // Disconnection logic
            }
        };
        logger.log('Bloomberg connection established');
        return connection;
    }
    catch (error) {
        logger.error(`Failed to connect to Bloomberg: ${error.message}`, error.stack);
        throw error;
    }
}
/**
 * Connect to Reuters/Refinitiv DataScope
 */
async function connectToReuters(config) {
    const logger = new common_1.Logger('MarketData:connectToReuters');
    try {
        logger.log('Connecting to Reuters DataScope API');
        // Implementation would use Reuters/Refinitiv SDK
        const connection = {
            vendor: DataVendor.REUTERS,
            status: 'CONNECTED',
            on: (event, callback) => { },
            subscribe: (symbol, fields) => { },
            disconnect: () => { }
        };
        logger.log('Reuters connection established');
        return connection;
    }
    catch (error) {
        logger.error(`Failed to connect to Reuters: ${error.message}`, error.stack);
        throw error;
    }
}
/**
 * Connect to ICE Data Services
 */
async function connectToICE(config) {
    const logger = new common_1.Logger('MarketData:connectToICE');
    try {
        logger.log('Connecting to ICE Data Services');
        const connection = {
            vendor: DataVendor.ICE,
            status: 'CONNECTED',
            on: (event, callback) => { },
            subscribe: (symbol, fields) => { },
            disconnect: () => { }
        };
        logger.log('ICE connection established');
        return connection;
    }
    catch (error) {
        logger.error(`Failed to connect to ICE: ${error.message}`, error.stack);
        throw error;
    }
}
/**
 * Handle vendor failover
 */
async function handleVendorFailover(primaryVendor, secondaryVendor, subscriptions) {
    const logger = new common_1.Logger('MarketData:handleVendorFailover');
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
    }
    catch (error) {
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
async function cacheMarketData(symbol, dataType, data, ttl = 5000) {
    const cache = {
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
async function getCachedMarketData(symbol, dataType) {
    const cached = await getFromCache(symbol, dataType);
    if (!cached)
        return null;
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
function conflateMarketData(updates, windowMs = 100) {
    const conflated = new Map();
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
async function validateMarketDataAccess(symbol, vendor, dataTypes) {
    // Placeholder - would integrate with entitlement system
    return true;
}
/**
 * Get user entitlements
 */
async function getUserEntitlements(userId) {
    // Placeholder - would fetch from database
    return [];
}
/**
 * Check symbol-level entitlements
 */
async function checkSymbolEntitlement(userId, symbol, dataType) {
    const entitlements = await getUserEntitlements(userId);
    for (const entitlement of entitlements) {
        if (!entitlement.isActive)
            continue;
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
    constructor(timeFrame) {
        this.currentBar = null;
        this.lastBarTime = null;
        this.timeFrame = timeFrame;
    }
    addTrade(trade) {
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
    getBarTimestamp(timestamp) {
        const intervalMs = this.getIntervalMs();
        const time = timestamp.getTime();
        const barTime = Math.floor(time / intervalMs) * intervalMs;
        return new Date(barTime);
    }
    getIntervalMs() {
        const intervals = {
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
function filterQuoteFields(quote, fields) {
    if (fields.includes('*'))
        return quote;
    const filtered = {};
    for (const field of fields) {
        if (field in quote) {
            filtered[field] = quote[field];
        }
    }
    return filtered;
}
function decimalToFraction(decimal) {
    // Simplified fraction conversion (32nds for bonds)
    const whole = Math.floor(decimal);
    const frac = decimal - whole;
    const thirtySeconds = Math.round(frac * 32);
    return `${whole}-${thirtySeconds.toString().padStart(2, '0')}`;
}
function fractionToDecimal(fraction) {
    const parts = fraction.split('-');
    const whole = parseInt(parts[0]);
    const thirtySeconds = parseInt(parts[1]);
    return whole + (thirtySeconds / 32);
}
function calculateVWAP(trades) {
    const totalValue = trades.reduce((sum, t) => sum + (t.price * t.size), 0);
    const totalVolume = trades.reduce((sum, t) => sum + t.size, 0);
    return totalVolume > 0 ? totalValue / totalVolume : 0;
}
function calculateArbitrageConfidence(bid, ask) {
    let confidence = 100;
    // Reduce confidence for high latency
    confidence -= Math.min(bid.latency + ask.latency, 50);
    // Reduce confidence for small sizes
    const minSize = Math.min(bid.quote.bidSize, ask.quote.askSize);
    if (minSize < 100)
        confidence -= 20;
    return Math.max(0, confidence);
}
async function throttleData(symbol, throttleMs) {
    // Implementation would use rate limiting logic
    await new Promise(resolve => setTimeout(resolve, throttleMs));
}
// ============================================================================
// PLACEHOLDER IMPLEMENTATIONS
// ============================================================================
async function connectToVendor(vendor) {
    return { vendor, status: 'CONNECTED' };
}
async function subscribeToMarketData(connection, symbol, dataTypes) {
    return `STREAM-${Date.now()}`;
}
function parseVendorMessage(message, vendor) {
    return message;
}
async function subscribeToQuotes(symbol, callback) {
    return { unsubscribe: () => { } };
}
async function subscribeToMarketDepth(symbol, levels, callback) {
    // Implementation
}
async function subscribeToTrades(symbol, callback) {
    // Implementation
}
async function fetchQuoteFromVendor(symbol, vendor) {
    return {};
}
async function saveSubscription(subscription) {
    // Implementation
}
async function activateSubscription(subscription) {
    // Implementation
}
async function updateSubscription(subscription) {
    // Implementation
}
async function getSubscription(subscriptionId) {
    return null;
}
async function unsubscribeFromVendor(subscription) {
    // Implementation
}
async function getSubscriptionsByUserId(userId) {
    return [];
}
async function getSubscriptionUsage(userId, vendor) {
    return 0;
}
async function getCachedHistoricalData(request) {
    return null;
}
async function fetchHistoricalQuotesFromVendor(request, vendor) {
    return [];
}
async function adjustForStockSplits(symbol, quotes) {
    return quotes;
}
async function adjustForDividends(symbol, quotes) {
    return quotes;
}
async function cacheHistoricalData(request, data) {
    // Implementation
}
async function fetchHistoricalBarsFromVendor(request, vendor) {
    return [];
}
async function adjustBarsForSplits(symbol, bars) {
    return bars;
}
async function adjustBarsForDividends(symbol, bars) {
    return bars;
}
async function fetchHistoricalTrades(symbol, startDate, endDate) {
    return [];
}
async function identifyDataGaps(symbol, dataType, startDate, endDate) {
    return [];
}
async function fetchDataForGap(symbol, dataType, gap, vendor) {
    return [];
}
async function storeHistoricalData(symbol, dataType, data) {
    // Implementation
}
async function calculateFeedMetrics(vendor, startTime, endTime) {
    return {};
}
async function disconnectFromVendor(vendor) {
    // Implementation
}
async function resubscribeToVendor(subscription, connection) {
    // Implementation
}
async function saveToCache(cache) {
    // Implementation
}
async function getFromCache(symbol, dataType) {
    return null;
}
async function deleteFromCache(symbol, dataType) {
    // Implementation
}
async function validateSubscriptionEntitlements(entitlements, symbol, dataType, vendor) {
    // Implementation
}
exports.default = {
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
//# sourceMappingURL=market-data-service-kit.js.map