"use strict";
/**
 * LOC: MKTMICRO001
 * File: /reuse/trading/market-microstructure-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable market microstructure utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Trading execution analytics
 *   - Transaction cost analysis platforms
 *   - Market surveillance systems
 *   - Trading desk analytics
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.asTimestamp = exports.asBasisPoints = exports.asQuantity = exports.asPrice = void 0;
exports.parseOrderBook = parseOrderBook;
exports.calculateMidPrice = calculateMidPrice;
exports.calculateWeightedMidPrice = calculateWeightedMidPrice;
exports.calculateOrderBookImbalance = calculateOrderBookImbalance;
exports.calculateBookDepth = calculateBookDepth;
exports.estimateLiquidityProfile = estimateLiquidityProfile;
exports.calculateBestBidAsk = calculateBestBidAsk;
exports.analyzeOrderBookSlope = analyzeOrderBookSlope;
exports.detectOrderBookPattern = detectOrderBookPattern;
exports.calculateMicroPrice = calculateMicroPrice;
exports.calculateBidAskSpread = calculateBidAskSpread;
exports.calculateRelativeSpread = calculateRelativeSpread;
exports.calculateEffectiveSpread = calculateEffectiveSpread;
exports.calculateRealizedSpread = calculateRealizedSpread;
exports.estimatePriceImpact = estimatePriceImpact;
exports.calculatePermanentImpact = calculatePermanentImpact;
exports.calculateTemporaryImpact = calculateTemporaryImpact;
exports.modelMarketImpact = modelMarketImpact;
exports.calculateImplementationShortfallCost = calculateImplementationShortfallCost;
exports.calculateArrivalCost = calculateArrivalCost;
exports.calculateVWAPCost = calculateVWAPCost;
exports.calculateSlippage = calculateSlippage;
exports.estimateOpportunityCost = estimateOpportunityCost;
exports.calculateTimingCost = calculateTimingCost;
exports.calculateMarketImpactCost = calculateMarketImpactCost;
exports.analyzeFillQuality = analyzeFillQuality;
exports.calculateReversion = calculateReversion;
exports.estimateTotalTCA = estimateTotalTCA;
exports.benchmarkExecution = benchmarkExecution;
exports.generateTCAReport = generateTCAReport;
exports.analyzeOrderFlow = analyzeOrderFlow;
exports.calculateVolumeProfile = calculateVolumeProfile;
exports.estimateInformedTrading = estimateInformedTrading;
exports.calculatePINMetric = calculatePINMetric;
exports.analyzeTradeDirection = analyzeTradeDirection;
exports.calculateEffectiveTickSize = calculateEffectiveTickSize;
exports.estimateHiddenLiquidity = estimateHiddenLiquidity;
exports.analyzeMarketFragmentation = analyzeMarketFragmentation;
exports.compareLitDarkExecution = compareLitDarkExecution;
exports.calculateExecutionShortfall = calculateExecutionShortfall;
exports.modelLimitOrderDynamics = modelLimitOrderDynamics;
exports.estimateQueueJumping = estimateQueueJumping;
exports.calculateResiliency = calculateResiliency;
exports.analyzeTickData = analyzeTickData;
exports.estimateInformationShare = estimateInformationShare;
const asPrice = (value) => value;
exports.asPrice = asPrice;
const asQuantity = (value) => value;
exports.asQuantity = asQuantity;
const asBasisPoints = (value) => value;
exports.asBasisPoints = asBasisPoints;
const asTimestamp = (value) => value;
exports.asTimestamp = asTimestamp;
// ============================================================================
// ORDER BOOK ANALYTICS
// ============================================================================
/**
 * Parse and validate order book data
 * Ensures order book integrity (bids descending, asks ascending, no crossed quotes)
 *
 * @param rawOrderBook - Raw order book data
 * @returns Validated and sorted order book
 * @throws Error if order book is invalid (crossed quotes, negative sizes)
 */
function parseOrderBook(rawOrderBook) {
    if (!rawOrderBook.bids || !rawOrderBook.asks) {
        throw new Error('Order book must contain bids and asks');
    }
    // Validate and sort bids (descending by price)
    const validBids = rawOrderBook.bids
        .filter(level => level.quantity > 0 && level.price > 0)
        .sort((a, b) => b.price - a.price);
    // Validate and sort asks (ascending by price)
    const validAsks = rawOrderBook.asks
        .filter(level => level.quantity > 0 && level.price > 0)
        .sort((a, b) => a.price - b.price);
    // Check for crossed quotes
    if (validBids.length > 0 && validAsks.length > 0) {
        if (validBids[0].price >= validAsks[0].price) {
            throw new Error(`Crossed order book: best bid ${validBids[0].price} >= best ask ${validAsks[0].price}`);
        }
    }
    return {
        symbol: rawOrderBook.symbol,
        bids: validBids,
        asks: validAsks,
        timestamp: rawOrderBook.timestamp,
    };
}
/**
 * Calculate mid price (average of best bid and ask)
 *
 * @param orderBook - Order book
 * @returns Mid price
 * @throws Error if order book is empty
 */
function calculateMidPrice(orderBook) {
    if (orderBook.bids.length === 0 || orderBook.asks.length === 0) {
        throw new Error('Order book must have both bids and asks');
    }
    const bestBid = orderBook.bids[0].price;
    const bestAsk = orderBook.asks[0].price;
    return (0, exports.asPrice)((bestBid + bestAsk) / 2);
}
/**
 * Calculate volume-weighted mid price
 * More accurate than simple mid when sizes are imbalanced
 *
 * @param orderBook - Order book
 * @returns Volume-weighted mid price
 */
function calculateWeightedMidPrice(orderBook) {
    if (orderBook.bids.length === 0 || orderBook.asks.length === 0) {
        throw new Error('Order book must have both bids and asks');
    }
    const bestBid = orderBook.bids[0].price;
    const bestAsk = orderBook.asks[0].price;
    const bidSize = orderBook.bids[0].quantity;
    const askSize = orderBook.asks[0].quantity;
    const totalSize = bidSize + askSize;
    if (totalSize === 0) {
        return (0, exports.asPrice)((bestBid + bestAsk) / 2);
    }
    // Weight by inverse size (larger ask = lower weight = pushes price down)
    const weightedMid = (bestBid * askSize + bestAsk * bidSize) / totalSize;
    return (0, exports.asPrice)(weightedMid);
}
/**
 * Calculate order book imbalance
 * Measures supply/demand pressure
 *
 * @param orderBook - Order book
 * @param depth - Number of levels to include (default: 5)
 * @returns Imbalance ratio (-1 = heavy ask pressure, +1 = heavy bid pressure, 0 = balanced)
 */
function calculateOrderBookImbalance(orderBook, depth = 5) {
    if (depth < 1) {
        throw new Error('Depth must be at least 1');
    }
    const bidLevels = orderBook.bids.slice(0, depth);
    const askLevels = orderBook.asks.slice(0, depth);
    const totalBidSize = bidLevels.reduce((sum, level) => sum + level.quantity, 0);
    const totalAskSize = askLevels.reduce((sum, level) => sum + level.quantity, 0);
    const totalSize = totalBidSize + totalAskSize;
    if (totalSize === 0) {
        return 0;
    }
    return (totalBidSize - totalAskSize) / totalSize;
}
/**
 * Calculate book depth at specified levels
 * Provides cumulative size available at each price level
 *
 * @param orderBook - Order book
 * @param numberOfLevels - Number of levels to analyze
 * @returns Depth profile with cumulative sizes
 */
function calculateBookDepth(orderBook, numberOfLevels = 10) {
    if (numberOfLevels < 1) {
        throw new Error('Number of levels must be at least 1');
    }
    const bidLevels = orderBook.bids.slice(0, numberOfLevels);
    const askLevels = orderBook.asks.slice(0, numberOfLevels);
    let cumulativeBidSize = 0;
    let cumulativeAskSize = 0;
    let cumulativeBidValue = 0;
    let cumulativeAskValue = 0;
    const averageSpreadByLevel = [];
    for (let i = 0; i < numberOfLevels; i++) {
        if (i < bidLevels.length) {
            cumulativeBidSize += bidLevels[i].quantity;
            cumulativeBidValue += bidLevels[i].price * bidLevels[i].quantity;
        }
        if (i < askLevels.length) {
            cumulativeAskSize += askLevels[i].quantity;
            cumulativeAskValue += askLevels[i].price * askLevels[i].quantity;
        }
        // Calculate average spread at this level
        if (i < bidLevels.length && i < askLevels.length) {
            const levelSpread = askLevels[i].price - bidLevels[i].price;
            const midPrice = (askLevels[i].price + bidLevels[i].price) / 2;
            const spreadBps = (0, exports.asBasisPoints)((levelSpread / midPrice) * 10000);
            averageSpreadByLevel.push(spreadBps);
        }
    }
    const totalBidSize = (0, exports.asQuantity)(cumulativeBidSize);
    const totalAskSize = (0, exports.asQuantity)(cumulativeAskSize);
    const totalSize = totalBidSize + totalAskSize;
    const depthImbalance = totalSize > 0 ? (totalBidSize - totalAskSize) / totalSize : 0;
    return {
        levels: numberOfLevels,
        totalBidSize,
        totalAskSize,
        cumulativeBidValue,
        cumulativeAskValue,
        depthImbalance,
        averageSpreadByLevel,
    };
}
/**
 * Estimate liquidity profile (cumulative size vs price)
 * Shows how much liquidity is available within price range
 *
 * @param orderBook - Order book
 * @param priceRange - Price range from mid in basis points
 * @returns Cumulative liquidity within price range for each side
 */
function estimateLiquidityProfile(orderBook, priceRange) {
    const midPrice = calculateMidPrice(orderBook);
    const rangeInPrice = (midPrice * priceRange) / 10000;
    const minBidPrice = midPrice - rangeInPrice;
    const maxAskPrice = midPrice + rangeInPrice;
    const bidLiquidity = (0, exports.asQuantity)(orderBook.bids
        .filter(level => level.price >= minBidPrice)
        .reduce((sum, level) => sum + level.quantity, 0));
    const askLiquidity = (0, exports.asQuantity)(orderBook.asks
        .filter(level => level.price <= maxAskPrice)
        .reduce((sum, level) => sum + level.quantity, 0));
    return {
        bidLiquidity,
        askLiquidity,
        totalLiquidity: (0, exports.asQuantity)(bidLiquidity + askLiquidity),
    };
}
/**
 * Calculate best bid and ask (top of book)
 *
 * @param orderBook - Order book
 * @returns Best bid/ask prices and sizes
 */
function calculateBestBidAsk(orderBook) {
    if (orderBook.bids.length === 0 || orderBook.asks.length === 0) {
        throw new Error('Order book must have both bids and asks');
    }
    return {
        bestBid: orderBook.bids[0].price,
        bestBidSize: orderBook.bids[0].quantity,
        bestAsk: orderBook.asks[0].price,
        bestAskSize: orderBook.asks[0].quantity,
    };
}
/**
 * Analyze order book slope (price-quantity relationship)
 * Steeper slope = less liquid, flatter slope = more liquid
 *
 * @param orderBook - Order book
 * @param levels - Number of levels to analyze
 * @returns Slope coefficients for bid and ask sides
 */
function analyzeOrderBookSlope(orderBook, levels = 10) {
    if (levels < 2) {
        throw new Error('Need at least 2 levels for slope calculation');
    }
    const bidLevels = orderBook.bids.slice(0, levels);
    const askLevels = orderBook.asks.slice(0, levels);
    // Calculate bid slope (price decrease vs cumulative quantity)
    let bidSlope = 0;
    if (bidLevels.length >= 2) {
        const cumulativeBidQty = bidLevels.map((level, i) => bidLevels.slice(0, i + 1).reduce((sum, l) => sum + l.quantity, 0));
        const bidPrices = bidLevels.map(l => l.price);
        bidSlope = calculateSlope(cumulativeBidQty, bidPrices);
    }
    // Calculate ask slope (price increase vs cumulative quantity)
    let askSlope = 0;
    if (askLevels.length >= 2) {
        const cumulativeAskQty = askLevels.map((level, i) => askLevels.slice(0, i + 1).reduce((sum, l) => sum + l.quantity, 0));
        const askPrices = askLevels.map(l => l.price);
        askSlope = calculateSlope(cumulativeAskQty, askPrices);
    }
    const avgSlope = (Math.abs(bidSlope) + Math.abs(askSlope)) / 2;
    let liquidity;
    if (avgSlope < 0.001) {
        liquidity = 'HIGH'; // Flat slope = deep liquidity
    }
    else if (avgSlope < 0.01) {
        liquidity = 'MEDIUM';
    }
    else {
        liquidity = 'LOW'; // Steep slope = thin liquidity
    }
    return { bidSlope, askSlope, liquidity };
}
/**
 * Helper: Linear regression slope
 */
function calculateSlope(x, y) {
    if (x.length !== y.length || x.length < 2) {
        return 0;
    }
    const n = x.length;
    const meanX = x.reduce((sum, val) => sum + val, 0) / n;
    const meanY = y.reduce((sum, val) => sum + val, 0) / n;
    let numerator = 0;
    let denominator = 0;
    for (let i = 0; i < n; i++) {
        numerator += (x[i] - meanX) * (y[i] - meanY);
        denominator += Math.pow(x[i] - meanX, 2);
    }
    return denominator !== 0 ? numerator / denominator : 0;
}
/**
 * Detect order book patterns (support/resistance levels)
 * Identifies significant price levels with large quantity
 *
 * @param orderBook - Order book
 * @param threshold - Quantity threshold for significant level (as ratio of average)
 * @returns Detected support (bid) and resistance (ask) levels
 */
function detectOrderBookPattern(orderBook, threshold = 2.0) {
    if (threshold <= 0) {
        throw new Error('Threshold must be positive');
    }
    // Calculate average bid size
    const avgBidSize = orderBook.bids.length > 0
        ? orderBook.bids.reduce((sum, level) => sum + level.quantity, 0) / orderBook.bids.length
        : 0;
    // Calculate average ask size
    const avgAskSize = orderBook.asks.length > 0
        ? orderBook.asks.reduce((sum, level) => sum + level.quantity, 0) / orderBook.asks.length
        : 0;
    const supportLevels = orderBook.bids.filter(level => level.quantity >= avgBidSize * threshold);
    const resistanceLevels = orderBook.asks.filter(level => level.quantity >= avgAskSize * threshold);
    return { supportLevels, resistanceLevels };
}
/**
 * Calculate microprice (information-adjusted mid price)
 * Uses order book depth to estimate "true" price
 *
 * @param orderBook - Order book
 * @returns Microprice estimate
 *
 * Reference: Stoikov, S. (2018). "The Micro-Price: A High-Frequency Estimator of Future Prices"
 * Formula: microprice = (ask * bidSize + bid * askSize) / (bidSize + askSize)
 */
function calculateMicroPrice(orderBook) {
    if (orderBook.bids.length === 0 || orderBook.asks.length === 0) {
        throw new Error('Order book must have both bids and asks');
    }
    const bestBid = orderBook.bids[0].price;
    const bestAsk = orderBook.asks[0].price;
    const bidSize = orderBook.bids[0].quantity;
    const askSize = orderBook.asks[0].quantity;
    const totalSize = bidSize + askSize;
    if (totalSize === 0) {
        return (0, exports.asPrice)((bestBid + bestAsk) / 2);
    }
    const microPrice = (bestAsk * bidSize + bestBid * askSize) / totalSize;
    return (0, exports.asPrice)(microPrice);
}
// ============================================================================
// SPREAD AND COST ANALYSIS
// ============================================================================
/**
 * Calculate absolute bid-ask spread
 *
 * @param quote - Current quote
 * @returns Absolute spread in price units
 */
function calculateBidAskSpread(quote) {
    if (quote.askPrice < quote.bidPrice) {
        throw new Error('Ask price must be >= bid price');
    }
    return (0, exports.asPrice)(quote.askPrice - quote.bidPrice);
}
/**
 * Calculate relative spread (percentage spread)
 *
 * @param quote - Current quote
 * @returns Spread as percentage of mid price in basis points
 */
function calculateRelativeSpread(quote) {
    const spread = quote.askPrice - quote.bidPrice;
    const midPrice = (quote.bidPrice + quote.askPrice) / 2;
    if (midPrice === 0) {
        throw new Error('Mid price cannot be zero');
    }
    return (0, exports.asBasisPoints)((spread / midPrice) * 10000);
}
/**
 * Calculate effective spread
 * Measures actual cost paid relative to mid price at trade time
 *
 * @param trade - Executed trade
 * @param midPriceAtTrade - Mid price at time of trade
 * @returns Effective spread in basis points
 */
function calculateEffectiveSpread(trade, midPriceAtTrade) {
    if (midPriceAtTrade <= 0) {
        throw new Error('Mid price must be positive');
    }
    const deviation = Math.abs(trade.price - midPriceAtTrade);
    const effectiveSpread = (2 * deviation / midPriceAtTrade) * 10000;
    return (0, exports.asBasisPoints)(effectiveSpread);
}
/**
 * Calculate realized spread
 * Measures price reversion after trade (temporary vs permanent impact)
 *
 * @param trade - Executed trade
 * @param midPriceAtTrade - Mid price at time of trade
 * @param midPriceAfter - Mid price after delay (e.g., 5 minutes)
 * @returns Realized spread in basis points
 */
function calculateRealizedSpread(trade, midPriceAtTrade, midPriceAfter) {
    if (!trade.side) {
        throw new Error('Trade must have side information');
    }
    const direction = trade.side === 'BUY' ? 1 : -1;
    const realizedSpread = (2 * direction * (trade.price - midPriceAfter) / midPriceAtTrade) * 10000;
    return (0, exports.asBasisPoints)(realizedSpread);
}
/**
 * Estimate price impact using square-root model
 * Impact proportional to sqrt(quantity / daily volume)
 *
 * @param quantity - Order quantity
 * @param averageDailyVolume - Average daily trading volume
 * @param volatility - Asset volatility (annualized)
 * @param currentPrice - Current price
 * @returns Estimated price impact in basis points
 *
 * Reference: Almgren et al. (2005). "Direct estimation of equity market impact"
 */
function estimatePriceImpact(quantity, averageDailyVolume, volatility, currentPrice) {
    if (averageDailyVolume <= 0) {
        throw new Error('Average daily volume must be positive');
    }
    if (currentPrice <= 0) {
        throw new Error('Current price must be positive');
    }
    // Square-root impact model
    const participationRate = quantity / averageDailyVolume;
    const impactCoefficient = volatility * 0.1; // Typical market impact parameter
    const priceImpact = impactCoefficient * Math.sqrt(participationRate) * 10000;
    return (0, exports.asBasisPoints)(Math.max(0, priceImpact));
}
/**
 * Calculate permanent price impact (information component)
 * Persistent price change due to order information content
 *
 * @param quantity - Order quantity
 * @param averageDailyVolume - Average daily volume
 * @param volatility - Asset volatility
 * @returns Permanent impact in basis points
 */
function calculatePermanentImpact(quantity, averageDailyVolume, volatility) {
    if (averageDailyVolume <= 0) {
        throw new Error('Average daily volume must be positive');
    }
    const participationRate = quantity / averageDailyVolume;
    // Permanent impact typically 30-50% of total impact
    const permanentCoefficient = volatility * 0.05;
    const permanentImpact = permanentCoefficient * Math.sqrt(participationRate) * 10000;
    return (0, exports.asBasisPoints)(Math.max(0, permanentImpact));
}
/**
 * Calculate temporary price impact (liquidity component)
 * Transient price change that reverts after execution
 *
 * @param quantity - Order quantity
 * @param averageDailyVolume - Average daily volume
 * @param executionTime - Time taken to execute (milliseconds)
 * @returns Temporary impact in basis points
 */
function calculateTemporaryImpact(quantity, averageDailyVolume, executionTime) {
    if (averageDailyVolume <= 0) {
        throw new Error('Average daily volume must be positive');
    }
    if (executionTime <= 0) {
        throw new Error('Execution time must be positive');
    }
    const participationRate = quantity / averageDailyVolume;
    const tradingDayMs = 6.5 * 3600 * 1000; // 6.5 hours
    const timeRatio = executionTime / tradingDayMs;
    // Temporary impact decreases with slower execution
    const temporaryCoefficient = 0.5 / Math.sqrt(timeRatio);
    const temporaryImpact = temporaryCoefficient * Math.sqrt(participationRate) * 10000;
    return (0, exports.asBasisPoints)(Math.max(0, temporaryImpact));
}
/**
 * Model market impact using power law
 * Flexible impact model with calibrated parameters
 *
 * @param quantity - Order quantity
 * @param averageDailyVolume - Average daily volume
 * @param volatility - Asset volatility
 * @param permanent - Permanent impact coefficient (default 0.1)
 * @param temporary - Temporary impact coefficient (default 0.5)
 * @param power - Power law exponent (default 0.6)
 * @returns Price impact model with estimated impact
 */
function modelMarketImpact(quantity, averageDailyVolume, volatility, permanent = 0.1, temporary = 0.5, power = 0.6) {
    if (averageDailyVolume <= 0) {
        throw new Error('Average daily volume must be positive');
    }
    if (power <= 0 || power > 1) {
        throw new Error('Power exponent must be between 0 and 1');
    }
    const participationRate = quantity / averageDailyVolume;
    const permanentImpact = permanent * volatility * Math.pow(participationRate, power);
    const temporaryImpact = temporary * volatility * Math.pow(participationRate, power);
    const totalImpact = (permanentImpact + temporaryImpact) * 10000;
    return {
        permanent,
        temporary,
        volumePower: power,
        estimatedImpact: (0, exports.asBasisPoints)(totalImpact),
    };
}
// ============================================================================
// TRANSACTION COST ANALYSIS (TCA)
// ============================================================================
/**
 * Calculate Implementation Shortfall cost
 * Difference between decision price and average execution price
 *
 * @param decisionPrice - Price when decision to trade was made
 * @param fills - Array of fills
 * @param side - Order side
 * @returns Implementation shortfall in basis points
 */
function calculateImplementationShortfallCost(decisionPrice, fills, side) {
    if (fills.length === 0) {
        throw new Error('Must have at least one fill');
    }
    if (decisionPrice <= 0) {
        throw new Error('Decision price must be positive');
    }
    const totalQuantity = fills.reduce((sum, fill) => sum + fill.quantity, 0);
    const totalValue = fills.reduce((sum, fill) => sum + fill.price * fill.quantity, 0);
    const averageFillPrice = totalValue / totalQuantity;
    let shortfall;
    if (side === 'BUY') {
        shortfall = (averageFillPrice - decisionPrice) / decisionPrice;
    }
    else {
        shortfall = (decisionPrice - averageFillPrice) / decisionPrice;
    }
    return (0, exports.asBasisPoints)(shortfall * 10000);
}
/**
 * Calculate arrival cost (cost vs arrival price)
 *
 * @param arrivalPrice - Price at order arrival
 * @param fills - Array of fills
 * @param side - Order side
 * @returns Arrival cost in basis points
 */
function calculateArrivalCost(arrivalPrice, fills, side) {
    if (fills.length === 0) {
        throw new Error('Must have at least one fill');
    }
    if (arrivalPrice <= 0) {
        throw new Error('Arrival price must be positive');
    }
    const totalQuantity = fills.reduce((sum, fill) => sum + fill.quantity, 0);
    const totalValue = fills.reduce((sum, fill) => sum + fill.price * fill.quantity, 0);
    const averageFillPrice = totalValue / totalQuantity;
    let cost;
    if (side === 'BUY') {
        cost = (averageFillPrice - arrivalPrice) / arrivalPrice;
    }
    else {
        cost = (arrivalPrice - averageFillPrice) / arrivalPrice;
    }
    return (0, exports.asBasisPoints)(cost * 10000);
}
/**
 * Calculate VWAP cost (deviation from volume-weighted average price)
 *
 * @param fills - Array of fills
 * @param marketTrades - Market trades during execution period
 * @param side - Order side
 * @returns VWAP cost in basis points
 */
function calculateVWAPCost(fills, marketTrades, side) {
    if (fills.length === 0 || marketTrades.length === 0) {
        throw new Error('Must have fills and market trades');
    }
    // Calculate execution average price
    const totalFillQty = fills.reduce((sum, fill) => sum + fill.quantity, 0);
    const totalFillValue = fills.reduce((sum, fill) => sum + fill.price * fill.quantity, 0);
    const avgFillPrice = totalFillValue / totalFillQty;
    // Calculate market VWAP
    const totalMarketQty = marketTrades.reduce((sum, trade) => sum + trade.quantity, 0);
    const totalMarketValue = marketTrades.reduce((sum, trade) => sum + trade.price * trade.quantity, 0);
    const marketVWAP = totalMarketValue / totalMarketQty;
    let cost;
    if (side === 'BUY') {
        cost = (avgFillPrice - marketVWAP) / marketVWAP;
    }
    else {
        cost = (marketVWAP - avgFillPrice) / marketVWAP;
    }
    return (0, exports.asBasisPoints)(cost * 10000);
}
/**
 * Calculate slippage (difference between expected and actual execution price)
 *
 * @param expectedPrice - Expected execution price
 * @param fills - Array of fills
 * @param side - Order side
 * @returns Slippage in basis points
 */
function calculateSlippage(expectedPrice, fills, side) {
    if (fills.length === 0) {
        throw new Error('Must have at least one fill');
    }
    const totalQuantity = fills.reduce((sum, fill) => sum + fill.quantity, 0);
    const totalValue = fills.reduce((sum, fill) => sum + fill.price * fill.quantity, 0);
    const avgFillPrice = totalValue / totalQuantity;
    let slippage;
    if (side === 'BUY') {
        slippage = (avgFillPrice - expectedPrice) / expectedPrice;
    }
    else {
        slippage = (expectedPrice - avgFillPrice) / expectedPrice;
    }
    return (0, exports.asBasisPoints)(slippage * 10000);
}
/**
 * Estimate opportunity cost (cost of unfilled quantity)
 *
 * @param orderQuantity - Total order quantity
 * @param filledQuantity - Filled quantity
 * @param orderPrice - Order price
 * @param finalPrice - Final market price
 * @param side - Order side
 * @returns Opportunity cost in basis points
 */
function estimateOpportunityCost(orderQuantity, filledQuantity, orderPrice, finalPrice, side) {
    const unfilledQuantity = orderQuantity - filledQuantity;
    if (unfilledQuantity <= 0) {
        return (0, exports.asBasisPoints)(0); // Fully filled, no opportunity cost
    }
    let costPerShare;
    if (side === 'BUY') {
        costPerShare = Math.max(0, finalPrice - orderPrice); // Lost opportunity if price rose
    }
    else {
        costPerShare = Math.max(0, orderPrice - finalPrice); // Lost opportunity if price fell
    }
    const totalOpportunityCost = (costPerShare * unfilledQuantity) / filledQuantity;
    const opportunityCostBps = (totalOpportunityCost / orderPrice) * 10000;
    return (0, exports.asBasisPoints)(opportunityCostBps);
}
/**
 * Calculate timing cost (cost of execution timing vs benchmark)
 *
 * @param fills - Array of fills
 * @param benchmarkPrice - Benchmark price (e.g., arrival, VWAP)
 * @param side - Order side
 * @returns Timing cost in basis points
 */
function calculateTimingCost(fills, benchmarkPrice, side) {
    if (fills.length === 0) {
        throw new Error('Must have at least one fill');
    }
    let totalTimingCost = 0;
    let totalQuantity = 0;
    for (const fill of fills) {
        let fillCost;
        if (side === 'BUY') {
            fillCost = (fill.price - benchmarkPrice) * fill.quantity;
        }
        else {
            fillCost = (benchmarkPrice - fill.price) * fill.quantity;
        }
        totalTimingCost += fillCost;
        totalQuantity += fill.quantity;
    }
    const avgTimingCost = totalQuantity > 0 ? totalTimingCost / totalQuantity : 0;
    const timingCostBps = (avgTimingCost / benchmarkPrice) * 10000;
    return (0, exports.asBasisPoints)(timingCostBps);
}
/**
 * Calculate market impact cost component
 *
 * @param fills - Array of fills
 * @param benchmarkPrice - Pre-trade benchmark price
 * @param side - Order side
 * @returns Market impact cost in basis points
 */
function calculateMarketImpactCost(fills, benchmarkPrice, side) {
    if (fills.length === 0) {
        throw new Error('Must have at least one fill');
    }
    const totalQuantity = fills.reduce((sum, fill) => sum + fill.quantity, 0);
    // Weighted average impact
    let totalImpact = 0;
    for (let i = 0; i < fills.length; i++) {
        const fill = fills[i];
        let impact;
        if (side === 'BUY') {
            impact = (fill.price - benchmarkPrice) / benchmarkPrice;
        }
        else {
            impact = (benchmarkPrice - fill.price) / benchmarkPrice;
        }
        totalImpact += impact * fill.quantity;
    }
    const avgImpact = totalImpact / totalQuantity;
    return (0, exports.asBasisPoints)(avgImpact * 10000);
}
/**
 * Analyze fill quality metrics
 *
 * @param fills - Array of fills
 * @param orderQuantity - Total order quantity
 * @returns Fill quality metrics
 */
function analyzeFillQuality(fills, orderQuantity) {
    if (fills.length === 0) {
        throw new Error('Must have at least one fill');
    }
    const totalFilled = fills.reduce((sum, fill) => sum + fill.quantity, 0);
    const totalValue = fills.reduce((sum, fill) => sum + fill.price * fill.quantity, 0);
    const averagePrice = (0, exports.asPrice)(totalValue / totalFilled);
    const variance = fills.reduce((sum, fill) => sum + Math.pow(fill.price - averagePrice, 2) * fill.quantity, 0) / totalFilled;
    const priceStdDev = Math.sqrt(variance);
    const venueSet = {};
    fills.forEach(fill => { venueSet[fill.venue] = true; });
    const numberOfVenues = Object.keys(venueSet).length;
    const averageFillSize = (0, exports.asQuantity)(totalFilled / fills.length);
    const totalFees = (0, exports.asBasisPoints)(fills.reduce((sum, fill) => {
        const feeInPrice = (fill.price * fill.fees) / 10000;
        return sum + feeInPrice * fill.quantity;
    }, 0) / totalValue * 10000);
    return {
        fillRate: totalFilled / orderQuantity,
        averagePrice,
        priceStdDev,
        numberOfVenues,
        averageFillSize,
        totalFees,
    };
}
/**
 * Calculate price reversion after trade
 * Measures how much price reverts after execution (indicates temporary impact)
 *
 * @param fills - Array of fills
 * @param priceAfterExecution - Price after execution window
 * @param side - Order side
 * @returns Reversion in basis points (positive = favorable reversion)
 */
function calculateReversion(fills, priceAfterExecution, side) {
    if (fills.length === 0) {
        throw new Error('Must have at least one fill');
    }
    const totalQuantity = fills.reduce((sum, fill) => sum + fill.quantity, 0);
    const totalValue = fills.reduce((sum, fill) => sum + fill.price * fill.quantity, 0);
    const avgFillPrice = totalValue / totalQuantity;
    let reversion;
    if (side === 'BUY') {
        // Favorable if price drops after buying
        reversion = (avgFillPrice - priceAfterExecution) / avgFillPrice;
    }
    else {
        // Favorable if price rises after selling
        reversion = (priceAfterExecution - avgFillPrice) / avgFillPrice;
    }
    return (0, exports.asBasisPoints)(reversion * 10000);
}
/**
 * Estimate total transaction cost analysis
 * Comprehensive TCA combining all cost components
 *
 * @param params - TCA calculation parameters
 * @returns Comprehensive TCA report
 */
function estimateTotalTCA(params) {
    const { symbol, side, orderQuantity, fills, decisionPrice, arrivalPrice, marketVWAP, priceAfterExecution } = params;
    if (fills.length === 0) {
        throw new Error('Must have at least one fill');
    }
    const totalFilled = fills.reduce((sum, fill) => sum + fill.quantity, 0);
    const totalValue = fills.reduce((sum, fill) => sum + fill.price * fill.quantity, 0);
    const averageFillPrice = (0, exports.asPrice)(totalValue / totalFilled);
    const implementationShortfall = calculateImplementationShortfallCost(decisionPrice, fills, side);
    const arrivalCost = calculateArrivalCost(arrivalPrice, fills, side);
    const vwapCost = Math.abs(((side === 'BUY' ? averageFillPrice - marketVWAP : marketVWAP - averageFillPrice) / marketVWAP) * 10000);
    const slippage = calculateSlippage(arrivalPrice, fills, side);
    const marketImpact = calculateMarketImpactCost(fills, arrivalPrice, side);
    const timingCost = calculateTimingCost(fills, arrivalPrice, side);
    const opportunityCost = estimateOpportunityCost(orderQuantity, (0, exports.asQuantity)(totalFilled), arrivalPrice, priceAfterExecution, side);
    const totalCost = (0, exports.asBasisPoints)(Math.abs(implementationShortfall) + Math.abs(marketImpact) + Math.abs(timingCost) + Math.abs(opportunityCost));
    let executionQuality;
    if (totalCost < 10) {
        executionQuality = 'EXCELLENT';
    }
    else if (totalCost < 25) {
        executionQuality = 'GOOD';
    }
    else if (totalCost < 50) {
        executionQuality = 'FAIR';
    }
    else {
        executionQuality = 'POOR';
    }
    return {
        symbol,
        side,
        totalQuantity: orderQuantity,
        averageFillPrice,
        benchmarkPrice: arrivalPrice,
        implementationShortfall,
        arrivalCost,
        vwapCost: (0, exports.asBasisPoints)(vwapCost),
        slippage,
        marketImpact,
        timingCost,
        opportunityCost,
        totalCost,
        executionQuality,
    };
}
/**
 * Benchmark execution against multiple benchmarks
 *
 * @param fills - Array of fills
 * @param benchmarks - Map of benchmark names to prices
 * @param side - Order side
 * @returns Cost relative to each benchmark
 */
function benchmarkExecution(fills, benchmarks, side) {
    if (fills.length === 0) {
        throw new Error('Must have at least one fill');
    }
    const totalQuantity = fills.reduce((sum, fill) => sum + fill.quantity, 0);
    const totalValue = fills.reduce((sum, fill) => sum + fill.price * fill.quantity, 0);
    const avgFillPrice = totalValue / totalQuantity;
    const results = {};
    for (const benchmarkName in benchmarks) {
        if (benchmarks.hasOwnProperty(benchmarkName)) {
            const benchmarkPrice = benchmarks[benchmarkName];
            let cost;
            if (side === 'BUY') {
                cost = (avgFillPrice - benchmarkPrice) / benchmarkPrice;
            }
            else {
                cost = (benchmarkPrice - avgFillPrice) / benchmarkPrice;
            }
            results[benchmarkName] = (0, exports.asBasisPoints)(cost * 10000);
        }
    }
    return results;
}
/**
 * Generate comprehensive TCA report with formatted output
 *
 * @param tcaReport - TCA report data
 * @returns Formatted TCA report string
 */
function generateTCAReport(tcaReport) {
    const lines = [];
    lines.push('═══════════════════════════════════════════════════════════');
    lines.push('           TRANSACTION COST ANALYSIS REPORT');
    lines.push('═══════════════════════════════════════════════════════════');
    lines.push('');
    lines.push(`Symbol:              ${tcaReport.symbol}`);
    lines.push(`Side:                ${tcaReport.side}`);
    lines.push(`Total Quantity:      ${tcaReport.totalQuantity.toLocaleString()}`);
    lines.push(`Average Fill Price:  $${tcaReport.averageFillPrice.toFixed(2)}`);
    lines.push(`Benchmark Price:     $${tcaReport.benchmarkPrice.toFixed(2)}`);
    lines.push('');
    lines.push('───────────────────────────────────────────────────────────');
    lines.push('  COST BREAKDOWN (Basis Points)');
    lines.push('───────────────────────────────────────────────────────────');
    lines.push(`Implementation Shortfall:  ${tcaReport.implementationShortfall.toFixed(2)} bp`);
    lines.push(`Arrival Cost:              ${tcaReport.arrivalCost.toFixed(2)} bp`);
    lines.push(`VWAP Cost:                 ${tcaReport.vwapCost.toFixed(2)} bp`);
    lines.push(`Slippage:                  ${tcaReport.slippage.toFixed(2)} bp`);
    lines.push(`Market Impact:             ${tcaReport.marketImpact.toFixed(2)} bp`);
    lines.push(`Timing Cost:               ${tcaReport.timingCost.toFixed(2)} bp`);
    lines.push(`Opportunity Cost:          ${tcaReport.opportunityCost.toFixed(2)} bp`);
    lines.push('');
    lines.push(`TOTAL COST:                ${tcaReport.totalCost.toFixed(2)} bp`);
    lines.push('');
    lines.push('───────────────────────────────────────────────────────────');
    lines.push(`  EXECUTION QUALITY: ${tcaReport.executionQuality}`);
    lines.push('───────────────────────────────────────────────────────────');
    return lines.join('\n');
}
// ============================================================================
// ORDER FLOW AND EXECUTION QUALITY
// ============================================================================
/**
 * Analyze order flow imbalance
 * Measures buy vs sell pressure
 *
 * @param trades - Recent trades
 * @param timeWindow - Time window in milliseconds
 * @returns Order flow imbalance (-1 to 1, negative = sell pressure, positive = buy pressure)
 */
function analyzeOrderFlow(trades, timeWindow) {
    if (timeWindow <= 0) {
        throw new Error('Time window must be positive');
    }
    const now = Date.now();
    const cutoff = (0, exports.asTimestamp)(now - timeWindow);
    const recentTrades = trades.filter(trade => trade.timestamp >= cutoff);
    let buyVolume = 0;
    let sellVolume = 0;
    for (const trade of recentTrades) {
        if (trade.side === 'BUY') {
            buyVolume += trade.quantity;
        }
        else if (trade.side === 'SELL') {
            sellVolume += trade.quantity;
        }
    }
    const totalVolume = buyVolume + sellVolume;
    const imbalance = totalVolume > 0 ? (buyVolume - sellVolume) / totalVolume : 0;
    return {
        imbalance,
        buyVolume: (0, exports.asQuantity)(buyVolume),
        sellVolume: (0, exports.asQuantity)(sellVolume),
        totalVolume: (0, exports.asQuantity)(totalVolume),
    };
}
/**
 * Calculate intraday volume profile
 * Distribution of volume across trading day
 *
 * @param trades - Historical trades
 * @param buckets - Number of time buckets (default 30-minute intervals = 13 buckets)
 * @returns Volume distribution by time bucket
 */
function calculateVolumeProfile(trades, buckets = 13) {
    if (buckets < 1) {
        throw new Error('Number of buckets must be at least 1');
    }
    const tradingDayMs = 6.5 * 3600 * 1000; // 6.5 hours
    const bucketSize = tradingDayMs / buckets;
    // Assume trades are within one trading day
    const minTime = Math.min(...trades.map(t => t.timestamp));
    const volumeByBucket = [];
    for (let i = 0; i < buckets; i++) {
        volumeByBucket[i] = 0;
    }
    for (const trade of trades) {
        const elapsed = trade.timestamp - minTime;
        const bucketIndex = Math.min(buckets - 1, Math.floor(elapsed / bucketSize));
        volumeByBucket[bucketIndex] += trade.quantity;
    }
    // Normalize to sum to 1.0
    const totalVolume = volumeByBucket.reduce((sum, vol) => sum + vol, 0);
    if (totalVolume > 0) {
        return volumeByBucket.map((vol) => vol / totalVolume);
    }
    return volumeByBucket;
}
/**
 * Estimate probability of informed trading
 * Higher probability suggests more adverse selection risk
 *
 * @param orderFlowImbalance - Recent order flow imbalance
 * @param volatility - Current volatility
 * @param spreadWidening - Recent spread widening (0-1)
 * @returns Probability estimate (0-1)
 */
function estimateInformedTrading(orderFlowImbalance, volatility, spreadWidening) {
    if (orderFlowImbalance < -1 || orderFlowImbalance > 1) {
        throw new Error('Order flow imbalance must be between -1 and 1');
    }
    if (spreadWidening < 0 || spreadWidening > 1) {
        throw new Error('Spread widening must be between 0 and 1');
    }
    // High imbalance + high volatility + widening spread = informed trading
    const imbalanceFactor = Math.abs(orderFlowImbalance) * 0.4;
    const volatilityFactor = Math.min(1, volatility * 5) * 0.3;
    const spreadFactor = spreadWidening * 0.3;
    return Math.min(1, imbalanceFactor + volatilityFactor + spreadFactor);
}
/**
 * Calculate PIN (Probability of Informed Trading) metric
 * Academic measure of information asymmetry
 *
 * @param buyVolume - Total buy volume
 * @param sellVolume - Total sell volume
 * @param days - Number of trading days
 * @returns Simplified PIN estimate
 *
 * Reference: Easley, D., Kiefer, N. M., O'Hara, M., & Paperman, J. B. (1996).
 * "Liquidity, information, and infrequently traded stocks." The Journal of Finance.
 */
function calculatePINMetric(buyVolume, sellVolume, days) {
    if (days <= 0) {
        throw new Error('Days must be positive');
    }
    const totalVolume = buyVolume + sellVolume;
    if (totalVolume === 0) {
        return 0;
    }
    // Simplified PIN approximation
    const imbalance = Math.abs(buyVolume - sellVolume);
    const pin = imbalance / totalVolume;
    return Math.min(1, pin);
}
/**
 * Analyze trade direction (classify trades as buy or sell)
 * Uses Lee-Ready algorithm
 *
 * @param trade - Trade to classify
 * @param quote - Quote at trade time
 * @returns Classified trade direction
 *
 * Reference: Lee, C., & Ready, M. J. (1991). "Inferring trade direction from intraday data."
 */
function analyzeTradeDirection(trade, quote) {
    if (trade.side) {
        return trade.side; // Already classified
    }
    const midPrice = (quote.bidPrice + quote.askPrice) / 2;
    // Tick test: compare to mid price
    if (trade.price > midPrice) {
        return 'BUY'; // Trade above mid = buyer-initiated
    }
    else if (trade.price < midPrice) {
        return 'SELL'; // Trade below mid = seller-initiated
    }
    // At mid price, use quote test
    if (trade.price === quote.askPrice) {
        return 'BUY';
    }
    else if (trade.price === quote.bidPrice) {
        return 'SELL';
    }
    return 'UNKNOWN';
}
/**
 * Calculate effective tick size
 * Actual minimum price increment observed in market
 *
 * @param trades - Recent trades
 * @returns Effective tick size
 */
function calculateEffectiveTickSize(trades) {
    if (trades.length < 2) {
        throw new Error('Need at least 2 trades');
    }
    const priceChanges = [];
    for (let i = 1; i < trades.length; i++) {
        const change = Math.abs(trades[i].price - trades[i - 1].price);
        if (change > 0) {
            priceChanges.push(change);
        }
    }
    if (priceChanges.length === 0) {
        return (0, exports.asPrice)(0.01); // Default 1 cent
    }
    // Find minimum non-zero price change
    const effectiveTick = Math.min(...priceChanges);
    return (0, exports.asPrice)(effectiveTick);
}
/**
 * Estimate hidden liquidity in order book
 * Infers presence of iceberg/hidden orders
 *
 * @param trades - Recent trades
 * @param orderBook - Current order book
 * @returns Estimated hidden liquidity ratio
 */
function estimateHiddenLiquidity(trades, orderBook) {
    if (trades.length === 0) {
        return 0;
    }
    const { bestBid, bestBidSize, bestAsk, bestAskSize } = calculateBestBidAsk(orderBook);
    // Count trades that exhausted visible liquidity but continued at same price
    let hiddenLiquidityTrades = 0;
    for (const trade of trades) {
        if (trade.price === bestBid && trade.quantity > bestBidSize) {
            hiddenLiquidityTrades++;
        }
        else if (trade.price === bestAsk && trade.quantity > bestAskSize) {
            hiddenLiquidityTrades++;
        }
    }
    return hiddenLiquidityTrades / trades.length;
}
/**
 * Analyze market fragmentation across venues
 *
 * @param tradesByVenue - Map of venue to trades
 * @returns Fragmentation metrics
 */
function analyzeMarketFragmentation(tradesByVenue) {
    const volumeByVenue = {};
    let totalVolume = 0;
    for (const venue in tradesByVenue) {
        if (tradesByVenue.hasOwnProperty(venue)) {
            const trades = tradesByVenue[venue];
            const venueVolume = trades.reduce((sum, trade) => sum + trade.quantity, 0);
            volumeByVenue[venue] = venueVolume;
            totalVolume += venueVolume;
        }
    }
    const volumeDistribution = {};
    const marketShares = [];
    for (const venue in volumeByVenue) {
        if (volumeByVenue.hasOwnProperty(venue)) {
            const volume = volumeByVenue[venue];
            const share = totalVolume > 0 ? volume / totalVolume : 0;
            volumeDistribution[venue] = share;
            marketShares.push(share);
        }
    }
    // Herfindahl-Hirschman Index (sum of squared market shares)
    const herfindahlIndex = marketShares.reduce((sum, share) => sum + share * share, 0);
    const largestVenueShare = marketShares.length > 0 ? Math.max(...marketShares) : 0;
    return {
        numberOfVenues: Object.keys(tradesByVenue).length,
        herfindahlIndex,
        volumeDistribution,
        largestVenueShare,
    };
}
/**
 * Compare lit vs dark pool execution quality
 *
 * @param litFills - Fills from lit venues
 * @param darkFills - Fills from dark venues
 * @param benchmarkPrice - Benchmark price
 * @param side - Order side
 * @returns Comparison metrics
 */
function compareLitDarkExecution(litFills, darkFills, benchmarkPrice, side) {
    const calcAvgPrice = (fills) => {
        if (fills.length === 0)
            return (0, exports.asPrice)(0);
        const totalQty = fills.reduce((sum, f) => sum + f.quantity, 0);
        const totalValue = fills.reduce((sum, f) => sum + f.price * f.quantity, 0);
        return (0, exports.asPrice)(totalValue / totalQty);
    };
    const calcCost = (fills) => {
        if (fills.length === 0)
            return (0, exports.asBasisPoints)(0);
        const avgPrice = calcAvgPrice(fills);
        let cost;
        if (side === 'BUY') {
            cost = (avgPrice - benchmarkPrice) / benchmarkPrice;
        }
        else {
            cost = (benchmarkPrice - avgPrice) / benchmarkPrice;
        }
        return (0, exports.asBasisPoints)(cost * 10000);
    };
    const litAvgPrice = calcAvgPrice(litFills);
    const darkAvgPrice = calcAvgPrice(darkFills);
    const litCost = calcCost(litFills);
    const darkCost = calcCost(darkFills);
    const totalFills = litFills.length + darkFills.length;
    const litFillRate = totalFills > 0 ? litFills.length / totalFills : 0;
    const darkFillRate = totalFills > 0 ? darkFills.length / totalFills : 0;
    let recommendation;
    if (darkCost < litCost && darkFills.length > 0) {
        recommendation = 'DARK';
    }
    else if (litCost < darkCost && litFills.length > 0) {
        recommendation = 'LIT';
    }
    else {
        recommendation = 'MIXED';
    }
    return {
        litAvgPrice,
        darkAvgPrice,
        litCost,
        darkCost,
        litFillRate,
        darkFillRate,
        recommendation,
    };
}
/**
 * Calculate execution shortfall (performance vs benchmark)
 *
 * @param fills - Execution fills
 * @param benchmarkPrice - Benchmark price
 * @param side - Order side
 * @returns Execution shortfall in basis points (negative = outperformed)
 */
function calculateExecutionShortfall(fills, benchmarkPrice, side) {
    return calculateArrivalCost(benchmarkPrice, fills, side);
}
// ============================================================================
// ADVANCED MICROSTRUCTURE ANALYTICS
// ============================================================================
/**
 * Model limit order book dynamics
 * Estimates order arrival rates and cancellation rates
 *
 * @param orderBookSnapshots - Time series of order book snapshots
 * @returns LOB dynamics model parameters
 */
function modelLimitOrderDynamics(orderBookSnapshots) {
    if (orderBookSnapshots.length < 2) {
        throw new Error('Need at least 2 order book snapshots');
    }
    let bidArrivals = 0;
    let askArrivals = 0;
    let bidCancellations = 0;
    let askCancellations = 0;
    for (let i = 1; i < orderBookSnapshots.length; i++) {
        const prev = orderBookSnapshots[i - 1];
        const curr = orderBookSnapshots[i];
        // Estimate arrivals (increase in order count)
        const bidOrderChange = curr.bids.reduce((sum, l) => sum + l.orderCount, 0) -
            prev.bids.reduce((sum, l) => sum + l.orderCount, 0);
        const askOrderChange = curr.asks.reduce((sum, l) => sum + l.orderCount, 0) -
            prev.asks.reduce((sum, l) => sum + l.orderCount, 0);
        if (bidOrderChange > 0)
            bidArrivals += bidOrderChange;
        if (askOrderChange > 0)
            askArrivals += askOrderChange;
        if (bidOrderChange < 0)
            bidCancellations += Math.abs(bidOrderChange);
        if (askOrderChange < 0)
            askCancellations += Math.abs(askOrderChange);
    }
    const timePeriods = orderBookSnapshots.length - 1;
    return {
        bidArrivalRate: bidArrivals / timePeriods,
        askArrivalRate: askArrivals / timePeriods,
        bidCancellationRate: bidCancellations / timePeriods,
        askCancellationRate: askCancellations / timePeriods,
    };
}
/**
 * Estimate queue jumping probability
 * Likelihood of orders jumping ahead in queue
 *
 * @param orderBookSnapshots - Time series of order book snapshots
 * @returns Queue jumping probability estimate
 */
function estimateQueueJumping(orderBookSnapshots) {
    if (orderBookSnapshots.length < 2) {
        return 0;
    }
    let queueJumps = 0;
    let totalObservations = 0;
    for (let i = 1; i < orderBookSnapshots.length; i++) {
        const prev = orderBookSnapshots[i - 1];
        const curr = orderBookSnapshots[i];
        // Check if top of book order count decreased without price change
        if (prev.bids.length > 0 && curr.bids.length > 0) {
            if (prev.bids[0].price === curr.bids[0].price &&
                prev.bids[0].orderCount > curr.bids[0].orderCount) {
                queueJumps++;
            }
            totalObservations++;
        }
        if (prev.asks.length > 0 && curr.asks.length > 0) {
            if (prev.asks[0].price === curr.asks[0].price &&
                prev.asks[0].orderCount > curr.asks[0].orderCount) {
                queueJumps++;
            }
            totalObservations++;
        }
    }
    return totalObservations > 0 ? queueJumps / totalObservations : 0;
}
/**
 * Calculate market resiliency
 * Speed at which market recovers from shocks
 *
 * @param priceShock - Magnitude of price shock
 * @param recoveryTimes - Time taken to recover (milliseconds)
 * @returns Average recovery rate
 */
function calculateResiliency(priceShock, recoveryTimes) {
    if (recoveryTimes.length === 0) {
        return 0;
    }
    const avgRecoveryTime = recoveryTimes.reduce((sum, t) => sum + t, 0) / recoveryTimes.length;
    if (avgRecoveryTime === 0) {
        return Infinity; // Instant recovery
    }
    // Resiliency = shock size / recovery time (higher = more resilient)
    return priceShock / avgRecoveryTime;
}
/**
 * Analyze tick-by-tick data for microstructure insights
 *
 * @param trades - Tick data
 * @returns Microstructure statistics
 */
function analyzeTickData(trades) {
    if (trades.length < 2) {
        throw new Error('Need at least 2 trades');
    }
    const totalQuantity = trades.reduce((sum, t) => sum + t.quantity, 0);
    const avgTradeSize = (0, exports.asQuantity)(totalQuantity / trades.length);
    const timeSpan = (trades[trades.length - 1].timestamp - trades[0].timestamp) / 1000; // seconds
    const tradeFrequency = timeSpan > 0 ? trades.length / timeSpan : 0;
    // Calculate returns
    const returns = [];
    for (let i = 1; i < trades.length; i++) {
        const ret = (trades[i].price - trades[i - 1].price) / trades[i - 1].price;
        returns.push(ret);
    }
    const meanReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - meanReturn, 2), 0) / returns.length;
    const priceVolatility = Math.sqrt(variance);
    // Count upticks
    const upticks = returns.filter(r => r > 0).length;
    const tickDirection = returns.length > 0 ? upticks / returns.length : 0.5;
    return {
        avgTradeSize,
        tradeFrequency,
        priceVolatility,
        tickDirection,
    };
}
/**
 * Estimate information share (Hasbrouck)
 * Contribution of venue to price discovery
 *
 * @param venueReturns - Returns series for each venue
 * @returns Information share for each venue
 *
 * Reference: Hasbrouck, J. (1995). "One security, many markets: Determining the contributions to price discovery."
 */
function estimateInformationShare(venueReturns) {
    if (venueReturns.length === 0) {
        return [];
    }
    const n = venueReturns.length;
    // Calculate variance of each venue's returns
    const variances = venueReturns.map(returns => {
        const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;
        const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / returns.length;
        return variance;
    });
    const totalVariance = variances.reduce((sum, v) => sum + v, 0);
    // Information share proportional to variance contribution
    const informationShares = variances.map(v => (totalVariance > 0 ? v / totalVariance : 1 / n));
    return informationShares;
}
//# sourceMappingURL=market-microstructure-kit.js.map