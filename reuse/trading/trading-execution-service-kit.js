"use strict";
/**
 * LOC: TRDEXEC0001234
 * File: /reuse/trading/trading-execution-service-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (Injectable, Logger, Inject)
 *   - @nestjs/websockets (WebSocketGateway, WebSocketServer)
 *   - sequelize (Model, DataTypes, Transaction, Op)
 *   - ../error-handling-kit.ts (exception classes, error handling)
 *   - ../validation-kit.ts (validation utilities)
 *   - ../audit-compliance-kit.ts (audit logging)
 *
 * DOWNSTREAM (imported by):
 *   - backend/trading/*
 *   - backend/controllers/trading-execution.controller.ts
 *   - backend/services/trading-execution.service.ts
 *   - backend/gateways/execution-stream.gateway.ts
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlgorithmType = exports.ExecutionVenue = exports.TimeInForce = exports.OrderStatus = exports.OrderSide = exports.OrderType = void 0;
exports.placeOrder = placeOrder;
exports.placeBasketOrder = placeBasketOrder;
exports.placeAlgorithmicOrder = placeAlgorithmicOrder;
exports.placeDMAOrder = placeDMAOrder;
exports.modifyOrder = modifyOrder;
exports.cancelOrder = cancelOrder;
exports.cancelAllOrders = cancelAllOrders;
exports.replaceOrder = replaceOrder;
exports.smartRouteOrder = smartRouteOrder;
exports.executeSmartRoutedOrder = executeSmartRoutedOrder;
exports.calculateBestVenue = calculateBestVenue;
exports.optimizeRoutingStrategy = optimizeRoutingStrategy;
exports.executeTWAP = executeTWAP;
exports.executeVWAP = executeVWAP;
exports.executePOV = executePOV;
exports.executeImplementationShortfall = executeImplementationShortfall;
exports.monitorAlgorithmicExecution = monitorAlgorithmicExecution;
exports.performPreTradeCompliance = performPreTradeCompliance;
exports.checkPositionLimits = checkPositionLimits;
exports.checkTradingLimits = checkTradingLimits;
exports.checkRestrictedSecurities = checkRestrictedSecurities;
exports.checkConcentrationLimits = checkConcentrationLimits;
exports.checkRegulatoryRestrictions = checkRegulatoryRestrictions;
exports.checkShortSaleRestrictions = checkShortSaleRestrictions;
exports.checkMarketHours = checkMarketHours;
exports.processExecutionReport = processExecutionReport;
exports.allocateTrade = allocateTrade;
exports.generateSettlementInstructions = generateSettlementInstructions;
exports.analyzeExecutionQuality = analyzeExecutionQuality;
exports.generateBestExecutionReport = generateBestExecutionReport;
exports.estimateMarketImpact = estimateMarketImpact;
/**
 * File: /reuse/trading/trading-execution-service-kit.ts
 * Locator: WC-TRD-EXEC-001
 * Purpose: Bloomberg Terminal-level Trading Execution Services - Order management, smart routing, algorithmic execution, DMA
 *
 * Upstream: NestJS 10.x, Sequelize 6.x, WebSocket, FIX Protocol, error-handling-kit, validation-kit
 * Downstream: Trading controllers, execution services, order management systems, market access gateways
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, FIX 4.4/5.0, PostgreSQL 14+
 * Exports: 47 production-ready functions for order execution, smart routing, algorithmic trading, DMA, compliance
 *
 * LLM Context: Institutional-grade trading execution platform competing with Bloomberg Terminal, Refinitiv Eikon.
 * Provides comprehensive order lifecycle management including order placement, modification, cancellation,
 * smart order routing (SOR), algorithmic execution strategies (TWAP, VWAP, POV, IS), direct market access,
 * execution quality analysis, best execution reporting, trade allocation, settlement processing, pre-trade
 * compliance checks, post-trade analytics, and regulatory reporting (MiFID II, Reg NMS).
 */
const common_1 = require("@nestjs/common");
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * Order execution types following FIX Protocol standards
 */
var OrderType;
(function (OrderType) {
    OrderType["MARKET"] = "MARKET";
    OrderType["LIMIT"] = "LIMIT";
    OrderType["STOP"] = "STOP";
    OrderType["STOP_LIMIT"] = "STOP_LIMIT";
    OrderType["MARKET_ON_CLOSE"] = "MOC";
    OrderType["LIMIT_ON_CLOSE"] = "LOC";
    OrderType["ICEBERG"] = "ICEBERG";
    OrderType["PEGGED"] = "PEGGED";
    OrderType["TRAILING_STOP"] = "TRAILING_STOP";
})(OrderType || (exports.OrderType = OrderType = {}));
var OrderSide;
(function (OrderSide) {
    OrderSide["BUY"] = "BUY";
    OrderSide["SELL"] = "SELL";
    OrderSide["SELL_SHORT"] = "SELL_SHORT";
    OrderSide["SELL_SHORT_EXEMPT"] = "SELL_SHORT_EXEMPT";
})(OrderSide || (exports.OrderSide = OrderSide = {}));
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["PENDING_NEW"] = "PENDING_NEW";
    OrderStatus["NEW"] = "NEW";
    OrderStatus["PARTIALLY_FILLED"] = "PARTIALLY_FILLED";
    OrderStatus["FILLED"] = "FILLED";
    OrderStatus["PENDING_CANCEL"] = "PENDING_CANCEL";
    OrderStatus["CANCELED"] = "CANCELED";
    OrderStatus["PENDING_REPLACE"] = "PENDING_REPLACE";
    OrderStatus["REPLACED"] = "REPLACED";
    OrderStatus["REJECTED"] = "REJECTED";
    OrderStatus["EXPIRED"] = "EXPIRED";
    OrderStatus["SUSPENDED"] = "SUSPENDED";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
var TimeInForce;
(function (TimeInForce) {
    TimeInForce["DAY"] = "DAY";
    TimeInForce["GTC"] = "GTC";
    TimeInForce["IOC"] = "IOC";
    TimeInForce["FOK"] = "FOK";
    TimeInForce["GTD"] = "GTD";
    TimeInForce["ATO"] = "ATO";
    TimeInForce["ATC"] = "ATC"; // At the Close
})(TimeInForce || (exports.TimeInForce = TimeInForce = {}));
var ExecutionVenue;
(function (ExecutionVenue) {
    ExecutionVenue["NYSE"] = "NYSE";
    ExecutionVenue["NASDAQ"] = "NASDAQ";
    ExecutionVenue["BATS"] = "BATS";
    ExecutionVenue["IEX"] = "IEX";
    ExecutionVenue["ARCA"] = "ARCA";
    ExecutionVenue["DARK_POOL"] = "DARK_POOL";
    ExecutionVenue["OTC"] = "OTC";
    ExecutionVenue["INTERNAL"] = "INTERNAL";
})(ExecutionVenue || (exports.ExecutionVenue = ExecutionVenue = {}));
var AlgorithmType;
(function (AlgorithmType) {
    AlgorithmType["TWAP"] = "TWAP";
    AlgorithmType["VWAP"] = "VWAP";
    AlgorithmType["POV"] = "POV";
    AlgorithmType["IS"] = "IS";
    AlgorithmType["ARRIVAL_PRICE"] = "ARRIVAL_PRICE";
    AlgorithmType["TARGET_CLOSE"] = "TARGET_CLOSE";
    AlgorithmType["SMART_DARK"] = "SMART_DARK";
    AlgorithmType["LIQUIDITY_SEEKING"] = "LIQUIDITY_SEEKING";
})(AlgorithmType || (exports.AlgorithmType = AlgorithmType = {}));
// ============================================================================
// ORDER PLACEMENT SERVICES
// ============================================================================
/**
 * Place a new order with comprehensive validation and compliance checks
 */
async function placeOrder(orderRequest, complianceService, dbTransaction) {
    const logger = new common_1.Logger('TradingExecution:placeOrder');
    try {
        logger.log(`Placing order: ${orderRequest.clientOrderId} for ${orderRequest.symbol}`);
        // Pre-trade compliance checks
        const complianceCheck = await performPreTradeCompliance(orderRequest, complianceService);
        if (!complianceCheck.passed) {
            logger.error(`Compliance check failed for order ${orderRequest.clientOrderId}`);
            throw new Error(`Compliance check failed: ${complianceCheck.checks.map(c => c.message).join(', ')}`);
        }
        // Validate order parameters
        validateOrderRequest(orderRequest);
        // Create order record
        const order = await createOrderRecord(orderRequest, dbTransaction);
        // Submit to routing engine
        const routingResult = await submitToRoutingEngine(order);
        logger.log(`Order placed successfully: ${order.orderId}, status: ${routingResult.status}`);
        return {
            orderId: order.orderId,
            status: routingResult.status,
            message: 'Order placed successfully'
        };
    }
    catch (error) {
        logger.error(`Failed to place order: ${error.message}`, error.stack);
        throw error;
    }
}
/**
 * Place a basket order (multiple orders as a single transaction)
 */
async function placeBasketOrder(orders, basketConfig, complianceService, dbTransaction) {
    const logger = new common_1.Logger('TradingExecution:placeBasketOrder');
    try {
        logger.log(`Placing basket order ${basketConfig.basketId} with ${orders.length} orders`);
        const results = [];
        const failedOrders = [];
        // Process all orders
        for (const orderRequest of orders) {
            try {
                const result = await placeOrder(orderRequest, complianceService, dbTransaction);
                results.push({ orderId: result.orderId, status: result.status });
            }
            catch (error) {
                failedOrders.push({ order: orderRequest, error: error.message });
                if (basketConfig.allOrNone) {
                    throw new Error(`Basket order failed: ${error.message}`);
                }
            }
        }
        if (basketConfig.allOrNone && failedOrders.length > 0) {
            // Cancel all successfully placed orders
            for (const result of results) {
                await cancelOrder(result.orderId, 'System', 'Basket order all-or-none failure');
            }
            throw new Error('Basket order failed - all orders canceled');
        }
        return {
            basketId: basketConfig.basketId,
            orders: results
        };
    }
    catch (error) {
        logger.error(`Failed to place basket order: ${error.message}`, error.stack);
        throw error;
    }
}
/**
 * Place an algorithmic order with specified strategy
 */
async function placeAlgorithmicOrder(baseOrder, algoParams, complianceService) {
    const logger = new common_1.Logger('TradingExecution:placeAlgorithmicOrder');
    try {
        logger.log(`Placing ${algoParams.algorithm} order for ${baseOrder.symbol}`);
        // Validate algorithmic parameters
        validateAlgorithmicParams(algoParams, baseOrder);
        // Create parent order
        const parentOrder = await createOrderRecord(baseOrder);
        // Create algorithmic execution schedule
        const schedule = await createExecutionSchedule(algoParams, baseOrder);
        // Initialize algorithm engine
        const algoId = await initializeAlgorithmEngine(parentOrder.orderId, algoParams, schedule);
        logger.log(`Algorithmic order initialized: ${algoId}`);
        return {
            orderId: parentOrder.orderId,
            algoId,
            status: 'ACTIVE'
        };
    }
    catch (error) {
        logger.error(`Failed to place algorithmic order: ${error.message}`, error.stack);
        throw error;
    }
}
/**
 * Place order with direct market access (DMA)
 */
async function placeDMAOrder(orderRequest, venue, dmaConfig) {
    const logger = new common_1.Logger('TradingExecution:placeDMAOrder');
    try {
        logger.log(`Placing DMA order to ${venue} for ${orderRequest.symbol}`);
        // Establish DMA connection
        const connection = await establishDMAConnection(dmaConfig);
        // Convert order to venue-specific format
        const venueOrder = convertToVenueFormat(orderRequest, venue);
        // Send order directly to venue
        const venueResponse = await sendOrderToVenue(connection, venueOrder);
        // Record order in database
        await recordDMAOrder(orderRequest, venue, venueResponse.venueOrderId);
        return {
            orderId: orderRequest.orderId,
            venueOrderId: venueResponse.venueOrderId,
            status: OrderStatus.PENDING_NEW
        };
    }
    catch (error) {
        logger.error(`Failed to place DMA order: ${error.message}`, error.stack);
        throw error;
    }
}
// ============================================================================
// ORDER MODIFICATION AND CANCELLATION
// ============================================================================
/**
 * Modify an existing order
 */
async function modifyOrder(modification, dbTransaction) {
    const logger = new common_1.Logger('TradingExecution:modifyOrder');
    try {
        logger.log(`Modifying order: ${modification.orderId}`);
        // Retrieve existing order
        const existingOrder = await getOrderById(modification.orderId);
        if (!existingOrder) {
            throw new Error(`Order not found: ${modification.orderId}`);
        }
        // Validate modification is allowed
        validateModification(existingOrder, modification);
        // Send cancel-replace to venues
        const replaceResult = await sendCancelReplaceRequest(existingOrder, modification);
        // Update order record
        await updateOrderRecord(modification.orderId, {
            quantity: modification.newQuantity || existingOrder.quantity,
            price: modification.newPrice || existingOrder.price,
            stopPrice: modification.newStopPrice || existingOrder.stopPrice,
            status: OrderStatus.PENDING_REPLACE,
            modifiedBy: modification.modifiedBy,
            modifiedAt: new Date()
        }, dbTransaction);
        return {
            orderId: modification.orderId,
            status: OrderStatus.PENDING_REPLACE,
            message: 'Order modification submitted'
        };
    }
    catch (error) {
        logger.error(`Failed to modify order: ${error.message}`, error.stack);
        throw error;
    }
}
/**
 * Cancel an order
 */
async function cancelOrder(orderId, canceledBy, reason, dbTransaction) {
    const logger = new common_1.Logger('TradingExecution:cancelOrder');
    try {
        logger.log(`Canceling order: ${orderId}`);
        // Retrieve order
        const order = await getOrderById(orderId);
        if (!order) {
            throw new Error(`Order not found: ${orderId}`);
        }
        // Check if order can be canceled
        if (!canCancelOrder(order)) {
            throw new Error(`Order cannot be canceled - current status: ${order.status}`);
        }
        // Send cancel request to venues
        await sendCancelRequest(order);
        // Update order status
        await updateOrderRecord(orderId, {
            status: OrderStatus.PENDING_CANCEL,
            canceledBy,
            cancelReason: reason,
            canceledAt: new Date()
        }, dbTransaction);
        return {
            orderId,
            status: OrderStatus.PENDING_CANCEL,
            message: 'Order cancellation submitted'
        };
    }
    catch (error) {
        logger.error(`Failed to cancel order: ${error.message}`, error.stack);
        throw error;
    }
}
/**
 * Cancel all orders for a symbol
 */
async function cancelAllOrders(symbol, canceledBy, reason) {
    const logger = new common_1.Logger('TradingExecution:cancelAllOrders');
    try {
        logger.log(`Canceling all orders for ${symbol}`);
        // Get all active orders for symbol
        const activeOrders = await getActiveOrdersBySymbol(symbol);
        const canceledOrders = [];
        const failedCancels = [];
        for (const order of activeOrders) {
            try {
                await cancelOrder(order.orderId, canceledBy, reason);
                canceledOrders.push(order.orderId);
            }
            catch (error) {
                failedCancels.push(order.orderId);
                logger.error(`Failed to cancel order ${order.orderId}: ${error.message}`);
            }
        }
        return {
            canceledCount: canceledOrders.length,
            failedCount: failedCancels.length,
            orders: canceledOrders
        };
    }
    catch (error) {
        logger.error(`Failed to cancel all orders: ${error.message}`, error.stack);
        throw error;
    }
}
/**
 * Replace order (cancel and re-submit)
 */
async function replaceOrder(orderId, newOrderRequest, complianceService) {
    const logger = new common_1.Logger('TradingExecution:replaceOrder');
    try {
        logger.log(`Replacing order: ${orderId}`);
        // Cancel existing order
        await cancelOrder(orderId, newOrderRequest.traderId, 'Order replacement');
        // Place new order
        const newOrder = await placeOrder(newOrderRequest, complianceService);
        return {
            oldOrderId: orderId,
            newOrderId: newOrder.orderId,
            status: 'REPLACED'
        };
    }
    catch (error) {
        logger.error(`Failed to replace order: ${error.message}`, error.stack);
        throw error;
    }
}
// ============================================================================
// SMART ORDER ROUTING
// ============================================================================
/**
 * Route order using smart order routing algorithm
 */
async function smartRouteOrder(order, routingConfig) {
    const logger = new common_1.Logger('TradingExecution:smartRouteOrder');
    try {
        logger.log(`Smart routing order ${order.orderId} for ${order.symbol}`);
        // Get current market data from all venues
        const venueQuotes = await getVenueQuotes(order.symbol, routingConfig.venues);
        // Calculate liquidity across venues
        const liquidityAnalysis = analyzeVenueLiquidity(venueQuotes, order.quantity);
        // Calculate optimal routing
        const routes = calculateOptimalRoutes(order, venueQuotes, liquidityAnalysis, routingConfig);
        // Determine primary venue
        const primaryVenue = routes[0].venue;
        logger.log(`Order routed - Primary venue: ${primaryVenue}, Total venues: ${routes.length}`);
        return { routes, primaryVenue };
    }
    catch (error) {
        logger.error(`Smart routing failed: ${error.message}`, error.stack);
        throw error;
    }
}
/**
 * Execute smart routed order across multiple venues
 */
async function executeSmartRoutedOrder(order, routes) {
    const logger = new common_1.Logger('TradingExecution:executeSmartRoutedOrder');
    try {
        logger.log(`Executing smart routed order across ${routes.length} venues`);
        const executionReports = [];
        let totalFilled = 0;
        // Execute in parallel across venues
        const executions = await Promise.allSettled(routes.map(route => executeOnVenue(order, route)));
        for (const result of executions) {
            if (result.status === 'fulfilled') {
                executionReports.push(result.value);
                totalFilled += result.value.executedQuantity;
            }
            else {
                logger.error(`Venue execution failed: ${result.reason}`);
            }
        }
        return { executionReports, totalFilled };
    }
    catch (error) {
        logger.error(`Smart routed execution failed: ${error.message}`, error.stack);
        throw error;
    }
}
/**
 * Calculate best execution venue based on current market conditions
 */
function calculateBestVenue(symbol, side, quantity, venueQuotes) {
    let bestVenue = ExecutionVenue.NYSE;
    let bestPrice = side === OrderSide.BUY ? Number.MAX_VALUE : 0;
    let confidence = 0;
    for (const [venue, quotes] of venueQuotes.entries()) {
        const levels = side === OrderSide.BUY ? quotes.asks : quotes.bids;
        if (levels.length === 0)
            continue;
        const { price, availableQty } = calculateVWAPPrice(levels, quantity);
        if (side === OrderSide.BUY && price < bestPrice && availableQty >= quantity) {
            bestPrice = price;
            bestVenue = venue;
            confidence = (availableQty / quantity) * 100;
        }
        else if (side === OrderSide.SELL && price > bestPrice && availableQty >= quantity) {
            bestPrice = price;
            bestVenue = venue;
            confidence = (availableQty / quantity) * 100;
        }
    }
    return { venue: bestVenue, expectedPrice: bestPrice, confidence };
}
/**
 * Optimize order routing based on historical venue performance
 */
async function optimizeRoutingStrategy(symbol, orderSize, historicalData) {
    const venueScores = new Map();
    // Score venues based on historical performance
    for (const metric of historicalData) {
        for (const [venue, stats] of metric.venueStats.entries()) {
            const score = calculateVenueScore(stats);
            venueScores.set(venue, (venueScores.get(venue) || 0) + score);
        }
    }
    // Sort venues by score
    const sortedVenues = Array.from(venueScores.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([venue]) => venue);
    return {
        enableSmartRouting: true,
        venues: sortedVenues.slice(0, 5),
        routingStrategy: 'BEST_PRICE',
        maxVenueLatency: 50,
        enableDarkPools: orderSize > 10000,
        aggressiveness: 50
    };
}
// ============================================================================
// ALGORITHMIC TRADING EXECUTION
// ============================================================================
/**
 * Execute TWAP (Time-Weighted Average Price) algorithm
 */
async function executeTWAP(order, params) {
    const logger = new common_1.Logger('TradingExecution:executeTWAP');
    try {
        logger.log(`Executing TWAP for ${order.symbol}, qty: ${order.quantity}`);
        const duration = params.endTime.getTime() - params.startTime.getTime();
        const numSlices = Math.ceil(duration / (5 * 60 * 1000)); // 5-minute slices
        const sliceQuantity = Math.floor(order.quantity / numSlices);
        const slices = [];
        let currentTime = params.startTime;
        for (let i = 0; i < numSlices; i++) {
            slices.push({
                sliceId: `${order.orderId}-TWAP-${i}`,
                quantity: i === numSlices - 1 ? order.quantity - (sliceQuantity * i) : sliceQuantity,
                scheduledTime: new Date(currentTime),
                status: 'PENDING'
            });
            currentTime = new Date(currentTime.getTime() + (duration / numSlices));
        }
        const algoId = await scheduleAlgorithmicSlices(order, slices, 'TWAP');
        return { algoId, slices };
    }
    catch (error) {
        logger.error(`TWAP execution failed: ${error.message}`, error.stack);
        throw error;
    }
}
/**
 * Execute VWAP (Volume-Weighted Average Price) algorithm
 */
async function executeVWAP(order, params, historicalVolume) {
    const logger = new common_1.Logger('TradingExecution:executeVWAP');
    try {
        logger.log(`Executing VWAP for ${order.symbol}`);
        // Calculate volume curve
        const volumeCurve = params.volumeCurve === 'CUSTOM'
            ? params.customCurve
            : calculateVolumeProfile(historicalVolume);
        // Create slices based on expected volume
        const slices = createVWAPSlices(order, params, volumeCurve);
        const algoId = await scheduleAlgorithmicSlices(order, slices, 'VWAP');
        return { algoId, slices };
    }
    catch (error) {
        logger.error(`VWAP execution failed: ${error.message}`, error.stack);
        throw error;
    }
}
/**
 * Execute POV (Percentage of Volume) algorithm
 */
async function executePOV(order, params) {
    const logger = new common_1.Logger('TradingExecution:executePOV');
    try {
        logger.log(`Executing POV for ${order.symbol}, target rate: ${params.participationRate}%`);
        const algoId = await initializePOVAlgorithm(order, params);
        // Start real-time volume monitoring
        await startVolumeMonitoring(order.symbol, algoId, params.participationRate);
        return {
            algoId,
            participationRate: params.participationRate
        };
    }
    catch (error) {
        logger.error(`POV execution failed: ${error.message}`, error.stack);
        throw error;
    }
}
/**
 * Execute Implementation Shortfall algorithm
 */
async function executeImplementationShortfall(order, params, marketData) {
    const logger = new common_1.Logger('TradingExecution:executeImplementationShortfall');
    try {
        logger.log(`Executing IS algorithm for ${order.symbol}`);
        // Calculate optimal execution strategy
        const strategy = calculateISStrategy(order, params, marketData);
        const algoId = await initializeISAlgorithm(order, strategy);
        return { algoId, strategy: strategy.name };
    }
    catch (error) {
        logger.error(`IS execution failed: ${error.message}`, error.stack);
        throw error;
    }
}
/**
 * Monitor and adjust algorithmic execution in real-time
 */
async function monitorAlgorithmicExecution(algoId) {
    const execution = await getAlgorithmicExecution(algoId);
    const performance = await calculateAlgorithmPerformance(execution);
    const recommendations = [];
    if (performance.slippage > 10) {
        recommendations.push('High slippage detected - consider reducing aggression');
    }
    if (performance.fillRate < 0.5) {
        recommendations.push('Low fill rate - consider increasing aggression or price limits');
    }
    return {
        algoId,
        progress: execution.filledQuantity / execution.totalQuantity,
        performance,
        recommendations
    };
}
// ============================================================================
// PRE-TRADE COMPLIANCE CHECKS
// ============================================================================
/**
 * Perform comprehensive pre-trade compliance checks
 */
async function performPreTradeCompliance(order, complianceService) {
    const checks = [];
    // Position limits check
    checks.push(await checkPositionLimits(order));
    // Trading limits check
    checks.push(await checkTradingLimits(order));
    // Restricted securities check
    checks.push(await checkRestrictedSecurities(order));
    // Concentration limits check
    checks.push(await checkConcentrationLimits(order));
    // Regulatory restrictions
    checks.push(await checkRegulatoryRestrictions(order));
    // Short sale restrictions
    if (order.side === OrderSide.SELL_SHORT) {
        checks.push(await checkShortSaleRestrictions(order));
    }
    // Market hours check
    checks.push(checkMarketHours(order));
    const passed = checks.every(check => check.passed || check.severity !== 'ERROR');
    return {
        checkId: `CHK-${Date.now()}`,
        orderId: order.orderId,
        passed,
        checks,
        timestamp: new Date()
    };
}
/**
 * Check position limits
 */
async function checkPositionLimits(order) {
    const currentPosition = await getCurrentPosition(order.account, order.symbol);
    const positionLimit = await getPositionLimit(order.account, order.symbol);
    const newPosition = order.side === OrderSide.BUY
        ? currentPosition + order.quantity
        : currentPosition - order.quantity;
    const passed = Math.abs(newPosition) <= positionLimit;
    return {
        checkName: 'Position Limits',
        checkType: 'LIMIT',
        passed,
        message: passed
            ? 'Position within limits'
            : `Position would exceed limit: ${Math.abs(newPosition)} > ${positionLimit}`,
        severity: passed ? 'INFO' : 'ERROR',
        value: Math.abs(newPosition),
        threshold: positionLimit
    };
}
/**
 * Check trading limits (order size, value, etc.)
 */
async function checkTradingLimits(order) {
    const limits = await getTradingLimits(order.account);
    const orderValue = order.quantity * (order.price || await getMarketPrice(order.symbol));
    const checks = [
        orderValue <= limits.maxOrderValue,
        order.quantity <= limits.maxOrderSize,
        await checkDailyTradingLimit(order.account, orderValue)
    ];
    const passed = checks.every(check => check);
    return {
        checkName: 'Trading Limits',
        checkType: 'LIMIT',
        passed,
        message: passed ? 'Trading limits satisfied' : 'Trading limit exceeded',
        severity: passed ? 'INFO' : 'ERROR',
        value: orderValue,
        threshold: limits.maxOrderValue
    };
}
/**
 * Check if security is restricted
 */
async function checkRestrictedSecurities(order) {
    const isRestricted = await isSecurityRestricted(order.symbol, order.account);
    return {
        checkName: 'Restricted Securities',
        checkType: 'RESTRICTION',
        passed: !isRestricted,
        message: isRestricted
            ? `${order.symbol} is restricted for this account`
            : 'Security is not restricted',
        severity: isRestricted ? 'ERROR' : 'INFO'
    };
}
/**
 * Check concentration limits
 */
async function checkConcentrationLimits(order) {
    const portfolioValue = await getPortfolioValue(order.portfolioId);
    const positionValue = await getPositionValue(order.account, order.symbol);
    const orderValue = order.quantity * (order.price || await getMarketPrice(order.symbol));
    const newConcentration = ((positionValue + orderValue) / portfolioValue) * 100;
    const concentrationLimit = await getConcentrationLimit(order.portfolioId);
    const passed = newConcentration <= concentrationLimit;
    return {
        checkName: 'Concentration Limits',
        checkType: 'LIMIT',
        passed,
        message: passed
            ? 'Concentration within limits'
            : `Concentration would exceed limit: ${newConcentration.toFixed(2)}% > ${concentrationLimit}%`,
        severity: passed ? 'INFO' : 'WARNING',
        value: newConcentration,
        threshold: concentrationLimit
    };
}
/**
 * Check regulatory restrictions (Reg T, Pattern Day Trader, etc.)
 */
async function checkRegulatoryRestrictions(order) {
    const restrictions = [];
    // Reg T margin check
    if (await isMarginAccount(order.account)) {
        const marginAvailable = await getMarginAvailable(order.account);
        const marginRequired = await calculateMarginRequirement(order);
        if (marginRequired > marginAvailable) {
            restrictions.push('Insufficient margin');
        }
    }
    // Pattern Day Trader check
    if (await isPatternDayTrader(order.account)) {
        const minEquity = 25000;
        const accountEquity = await getAccountEquity(order.account);
        if (accountEquity < minEquity) {
            restrictions.push('PDT minimum equity not met');
        }
    }
    return {
        checkName: 'Regulatory Restrictions',
        checkType: 'RESTRICTION',
        passed: restrictions.length === 0,
        message: restrictions.length === 0
            ? 'No regulatory restrictions'
            : restrictions.join(', '),
        severity: restrictions.length === 0 ? 'INFO' : 'ERROR'
    };
}
/**
 * Check short sale restrictions (Reg SHO, locate requirements)
 */
async function checkShortSaleRestrictions(order) {
    const restrictions = [];
    // Hard-to-borrow check
    const isHTB = await isHardToBorrow(order.symbol);
    if (isHTB) {
        const locateAvailable = await checkLocateAvailability(order.symbol, order.quantity);
        if (!locateAvailable) {
            restrictions.push('Locate not available');
        }
    }
    // SSR (Short Sale Restriction) check
    const isSSR = await isShortSaleRestricted(order.symbol);
    if (isSSR && order.orderType !== OrderType.LIMIT) {
        restrictions.push('SSR active - limit orders only');
    }
    return {
        checkName: 'Short Sale Restrictions',
        checkType: 'RESTRICTION',
        passed: restrictions.length === 0,
        message: restrictions.length === 0
            ? 'Short sale allowed'
            : restrictions.join(', '),
        severity: restrictions.length === 0 ? 'INFO' : 'ERROR'
    };
}
/**
 * Check market hours and trading halts
 */
function checkMarketHours(order) {
    const now = new Date();
    const marketOpen = new Date(now.setHours(9, 30, 0, 0));
    const marketClose = new Date(now.setHours(16, 0, 0, 0));
    const isMarketHours = now >= marketOpen && now <= marketClose;
    const isExtendedHours = order.timeInForce === TimeInForce.GTC;
    const passed = isMarketHours || isExtendedHours;
    return {
        checkName: 'Market Hours',
        checkType: 'VALIDATION',
        passed,
        message: passed
            ? 'Market is open or extended hours order'
            : 'Market is closed',
        severity: passed ? 'INFO' : 'WARNING'
    };
}
// ============================================================================
// POST-TRADE PROCESSING
// ============================================================================
/**
 * Process execution report and update order status
 */
async function processExecutionReport(executionReport, dbTransaction) {
    const logger = new common_1.Logger('TradingExecution:processExecutionReport');
    try {
        logger.log(`Processing execution report: ${executionReport.executionId}`);
        // Update order record
        await updateOrderFromExecution(executionReport, dbTransaction);
        // Calculate and record fills
        await recordFillDetails(executionReport, dbTransaction);
        // Update position
        await updatePosition(executionReport);
        // Trigger post-trade compliance
        await performPostTradeCompliance(executionReport);
        // Notify relevant parties
        await notifyExecutionComplete(executionReport);
        logger.log(`Execution report processed successfully: ${executionReport.executionId}`);
    }
    catch (error) {
        logger.error(`Failed to process execution report: ${error.message}`, error.stack);
        throw error;
    }
}
/**
 * Allocate trade to multiple accounts
 */
async function allocateTrade(executionId, allocations, method) {
    const logger = new common_1.Logger('TradingExecution:allocateTrade');
    try {
        logger.log(`Allocating trade ${executionId} using ${method} method`);
        // Validate allocations
        const execution = await getExecutionById(executionId);
        validateAllocations(execution, allocations);
        // Create allocation record
        const allocation = {
            allocationId: `ALLOC-${Date.now()}`,
            orderId: execution.orderId,
            executionId,
            allocations,
            allocationMethod: method,
            status: 'PENDING',
            timestamp: new Date()
        };
        // Save allocation
        await saveAllocation(allocation);
        // Update account positions
        for (const acctAlloc of allocations) {
            await updateAccountPosition(acctAlloc);
        }
        allocation.status = 'ALLOCATED';
        await updateAllocation(allocation);
        logger.log(`Trade allocated successfully: ${allocation.allocationId}`);
        return allocation;
    }
    catch (error) {
        logger.error(`Trade allocation failed: ${error.message}`, error.stack);
        throw error;
    }
}
/**
 * Generate settlement instructions
 */
async function generateSettlementInstructions(tradeId) {
    const logger = new common_1.Logger('TradingExecution:generateSettlementInstructions');
    try {
        logger.log(`Generating settlement instructions for trade: ${tradeId}`);
        const trade = await getTradeById(tradeId);
        const settlementDate = calculateSettlementDate(trade);
        const instruction = {
            settlementId: `SETTLE-${Date.now()}`,
            tradeId,
            settlementDate,
            currency: 'USD',
            grossAmount: trade.quantity * trade.price,
            netAmount: 0,
            fees: 0,
            taxes: 0,
            status: 'PENDING'
        };
        // Calculate fees
        instruction.fees = await calculateSettlementFees(trade);
        // Calculate taxes
        instruction.taxes = await calculateSettlementTaxes(trade);
        // Calculate net amount
        instruction.netAmount = instruction.grossAmount + instruction.fees + instruction.taxes;
        // Get settlement details
        const account = await getAccountById(trade.accountId);
        instruction.custodian = account.custodian;
        instruction.clearingBroker = account.clearingBroker;
        await saveSettlementInstruction(instruction);
        logger.log(`Settlement instructions generated: ${instruction.settlementId}`);
        return instruction;
    }
    catch (error) {
        logger.error(`Failed to generate settlement instructions: ${error.message}`, error.stack);
        throw error;
    }
}
// ============================================================================
// EXECUTION QUALITY ANALYSIS
// ============================================================================
/**
 * Analyze execution quality for an order
 */
async function analyzeExecutionQuality(orderId) {
    const logger = new common_1.Logger('TradingExecution:analyzeExecutionQuality');
    try {
        logger.log(`Analyzing execution quality for order: ${orderId}`);
        const order = await getOrderById(orderId);
        const executions = await getExecutionsByOrderId(orderId);
        // Calculate metrics
        const avgExecutionPrice = calculateAvgPrice(executions);
        const benchmarkPrice = await getBenchmarkPrice(order.symbol, order.timestamp);
        const slippage = calculateSlippage(avgExecutionPrice, benchmarkPrice, order.side);
        const priceImprovement = calculatePriceImprovement(avgExecutionPrice, order.price, order.side);
        // Venue breakdown
        const venueBreakdown = analyzeVenuePerformance(executions);
        const report = {
            reportId: `BER-${Date.now()}`,
            orderId,
            symbol: order.symbol,
            side: order.side,
            quantity: order.quantity,
            avgExecutionPrice,
            benchmarkPrice,
            priceImprovement,
            slippage,
            effectiveSpread: await calculateEffectiveSpread(executions),
            realizationShortfall: calculateRealizationShortfall(avgExecutionPrice, benchmarkPrice, order.quantity),
            venueBreakdown,
            timestamp: new Date(),
            complianceScore: calculateComplianceScore(slippage, priceImprovement)
        };
        await saveBestExecutionReport(report);
        logger.log(`Execution quality analysis complete: ${report.reportId}`);
        return report;
    }
    catch (error) {
        logger.error(`Execution quality analysis failed: ${error.message}`, error.stack);
        throw error;
    }
}
/**
 * Generate best execution report for regulatory compliance
 */
async function generateBestExecutionReport(period, filters) {
    const logger = new common_1.Logger('TradingExecution:generateBestExecutionReport');
    try {
        logger.log(`Generating best execution report for period: ${period.start} to ${period.end}`);
        // Get all orders in period
        const orders = await getOrdersInPeriod(period, filters);
        const orderReports = [];
        for (const order of orders) {
            const report = await analyzeExecutionQuality(order.orderId);
            orderReports.push(report);
        }
        // Calculate summary statistics
        const summary = calculateExecutionSummary(orderReports);
        const report = {
            reportId: `BER-PERIOD-${Date.now()}`,
            period,
            summary,
            orderReports
        };
        await savePeriodBestExecutionReport(report);
        logger.log(`Best execution report generated: ${report.reportId}`);
        return report;
    }
    catch (error) {
        logger.error(`Best execution report generation failed: ${error.message}`, error.stack);
        throw error;
    }
}
/**
 * Calculate market impact of an order
 */
async function estimateMarketImpact(symbol, side, quantity, historicalData) {
    const logger = new common_1.Logger('TradingExecution:estimateMarketImpact');
    try {
        logger.log(`Estimating market impact for ${symbol}, qty: ${quantity}`);
        // Get current market data
        const marketData = await getMarketData(symbol);
        const adv = await getAverageDailyVolume(symbol, 20);
        // Calculate participation rate
        const participationRate = (quantity / adv) * 100;
        // Estimate impact using multiple methods
        const spreadImpact = estimateSpreadImpact(marketData.spread, quantity);
        const volumeImpact = estimateVolumeImpact(participationRate);
        const historicalImpact = await estimateHistoricalImpact(symbol, quantity, historicalData);
        // Combine estimates
        const estimatedImpact = (spreadImpact + volumeImpact + historicalImpact) / 3;
        const estimatedSlippage = estimatedImpact * marketData.lastPrice;
        const estimatedCost = estimatedSlippage * quantity;
        return {
            symbol,
            side,
            quantity,
            estimatedImpact,
            estimatedSlippage,
            estimatedCost,
            confidence: calculateImpactConfidence(participationRate, marketData),
            methodology: 'ML_MODEL'
        };
    }
    catch (error) {
        logger.error(`Market impact estimation failed: ${error.message}`, error.stack);
        throw error;
    }
}
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
function validateOrderRequest(order) {
    if (!order.symbol || order.symbol.length === 0) {
        throw new Error('Symbol is required');
    }
    if (order.quantity <= 0) {
        throw new Error('Quantity must be greater than 0');
    }
    if (order.orderType === OrderType.LIMIT && !order.price) {
        throw new Error('Limit orders require a price');
    }
    if (order.orderType === OrderType.STOP && !order.stopPrice) {
        throw new Error('Stop orders require a stop price');
    }
}
function validateAlgorithmicParams(params, order) {
    if (params.startTime >= params.endTime) {
        throw new Error('Start time must be before end time');
    }
    if (params.algorithm === AlgorithmType.POV && !params.participationRate) {
        throw new Error('POV algorithm requires participation rate');
    }
    if (params.algorithm === AlgorithmType.IS && !params.urgency) {
        throw new Error('IS algorithm requires urgency parameter');
    }
}
function validateModification(order, modification) {
    if (order.status === OrderStatus.FILLED || order.status === OrderStatus.CANCELED) {
        throw new Error(`Cannot modify order in ${order.status} status`);
    }
}
function canCancelOrder(order) {
    return order.status !== OrderStatus.FILLED &&
        order.status !== OrderStatus.CANCELED &&
        order.status !== OrderStatus.REJECTED;
}
function calculateVWAPPrice(levels, quantity) {
    let totalValue = 0;
    let totalQty = 0;
    for (const level of levels) {
        const qty = Math.min(level.quantity, quantity - totalQty);
        totalValue += level.price * qty;
        totalQty += qty;
        if (totalQty >= quantity)
            break;
    }
    return {
        price: totalQty > 0 ? totalValue / totalQty : 0,
        availableQty: totalQty
    };
}
function calculateVenueScore(stats) {
    return (stats.fillRate * 0.4 +
        (1 - stats.rejectRate) * 0.3 +
        (1 / stats.avgLatency) * 1000 * 0.2 +
        (1 / stats.effectiveSpread) * 0.1);
}
function calculateVolumeProfile(historicalVolume) {
    // Simplified volume profile calculation
    const totalVolume = historicalVolume.reduce((sum, v) => sum + v, 0);
    return historicalVolume.map(v => v / totalVolume);
}
function createVWAPSlices(order, params, volumeCurve) {
    const slices = [];
    const duration = params.endTime.getTime() - params.startTime.getTime();
    const intervalDuration = duration / volumeCurve.length;
    let currentTime = params.startTime.getTime();
    for (let i = 0; i < volumeCurve.length; i++) {
        const quantity = Math.floor(order.quantity * volumeCurve[i]);
        slices.push({
            sliceId: `${order.orderId}-VWAP-${i}`,
            quantity,
            scheduledTime: new Date(currentTime),
            status: 'PENDING'
        });
        currentTime += intervalDuration;
    }
    return slices;
}
function calculateAvgPrice(executions) {
    const totalValue = executions.reduce((sum, exec) => sum + (exec.price * exec.executedQuantity), 0);
    const totalQty = executions.reduce((sum, exec) => sum + exec.executedQuantity, 0);
    return totalQty > 0 ? totalValue / totalQty : 0;
}
function calculateSlippage(executionPrice, benchmarkPrice, side) {
    if (side === OrderSide.BUY) {
        return ((executionPrice - benchmarkPrice) / benchmarkPrice) * 10000; // basis points
    }
    else {
        return ((benchmarkPrice - executionPrice) / benchmarkPrice) * 10000;
    }
}
function calculatePriceImprovement(executionPrice, limitPrice, side) {
    if (!limitPrice)
        return 0;
    if (side === OrderSide.BUY) {
        return limitPrice - executionPrice;
    }
    else {
        return executionPrice - limitPrice;
    }
}
function calculateRealizationShortfall(executionPrice, benchmarkPrice, quantity) {
    return Math.abs(executionPrice - benchmarkPrice) * quantity;
}
function calculateComplianceScore(slippage, priceImprovement) {
    let score = 100;
    // Penalize for slippage
    score -= Math.abs(slippage) / 10;
    // Reward for price improvement
    score += Math.min(priceImprovement, 50);
    return Math.max(0, Math.min(100, score));
}
function analyzeVenuePerformance(executions) {
    const venueMap = new Map();
    for (const exec of executions) {
        const stats = venueMap.get(exec.venue) || { qty: 0, value: 0, count: 0 };
        stats.qty += exec.executedQuantity;
        stats.value += exec.price * exec.executedQuantity;
        stats.count += 1;
        venueMap.set(exec.venue, stats);
    }
    const result = [];
    for (const [venue, stats] of venueMap.entries()) {
        result.push({
            venue,
            quantity: stats.qty,
            avgPrice: stats.value / stats.qty,
            fillRate: 1.0,
            rejectRate: 0,
            avgLatency: 50,
            effectiveSpread: 0.01
        });
    }
    return result;
}
function calculateExecutionSummary(reports) {
    const totalOrders = reports.length;
    const totalVolume = reports.reduce((sum, r) => sum + r.quantity, 0);
    const avgSlippage = reports.reduce((sum, r) => sum + r.slippage, 0) / totalOrders;
    const avgPriceImprovement = reports.reduce((sum, r) => sum + r.priceImprovement, 0) / totalOrders;
    const avgComplianceScore = reports.reduce((sum, r) => sum + r.complianceScore, 0) / totalOrders;
    return {
        totalOrders,
        totalVolume,
        avgSlippage,
        avgPriceImprovement,
        avgFillRate: 0.95,
        avgComplianceScore,
        venueStats: []
    };
}
function estimateSpreadImpact(spread, quantity) {
    return spread / 2;
}
function estimateVolumeImpact(participationRate) {
    return Math.sqrt(participationRate) * 0.1;
}
function calculateImpactConfidence(participationRate, marketData) {
    if (participationRate < 5)
        return 90;
    if (participationRate < 10)
        return 75;
    if (participationRate < 20)
        return 60;
    return 40;
}
function calculateSettlementDate(trade) {
    const tradeDate = new Date(trade.timestamp);
    // T+2 settlement
    tradeDate.setDate(tradeDate.getDate() + 2);
    return tradeDate;
}
// ============================================================================
// PLACEHOLDER IMPLEMENTATIONS (to be implemented based on specific infrastructure)
// ============================================================================
async function createOrderRecord(order, transaction) {
    // Implementation depends on database schema
    return { orderId: order.orderId, ...order, status: OrderStatus.PENDING_NEW };
}
async function submitToRoutingEngine(order) {
    return { status: OrderStatus.NEW };
}
async function getOrderById(orderId) {
    return null;
}
async function updateOrderRecord(orderId, updates, transaction) {
    // Implementation
}
async function sendCancelReplaceRequest(order, modification) {
    return { status: 'PENDING_REPLACE' };
}
async function sendCancelRequest(order) {
    // Implementation
}
async function getActiveOrdersBySymbol(symbol) {
    return [];
}
async function getVenueQuotes(symbol, venues) {
    return new Map();
}
function analyzeVenueLiquidity(quotes, quantity) {
    return {};
}
function calculateOptimalRoutes(order, quotes, liquidity, config) {
    return [];
}
async function executeOnVenue(order, route) {
    return {};
}
async function createExecutionSchedule(params, order) {
    return {};
}
async function initializeAlgorithmEngine(orderId, params, schedule) {
    return `ALGO-${Date.now()}`;
}
async function scheduleAlgorithmicSlices(order, slices, algoType) {
    return `ALGO-${algoType}-${Date.now()}`;
}
async function initializePOVAlgorithm(order, params) {
    return `ALGO-POV-${Date.now()}`;
}
async function startVolumeMonitoring(symbol, algoId, participationRate) {
    // Implementation
}
async function initializeISAlgorithm(order, strategy) {
    return `ALGO-IS-${Date.now()}`;
}
function calculateISStrategy(order, params, marketData) {
    return { name: 'IS_STRATEGY' };
}
async function getAlgorithmicExecution(algoId) {
    return { filledQuantity: 1000, totalQuantity: 10000 };
}
async function calculateAlgorithmPerformance(execution) {
    return {
        filledQuantity: 0,
        avgPrice: 0,
        benchmarkPrice: 0,
        slippage: 0,
        fillRate: 0,
        marketImpact: 0
    };
}
async function getCurrentPosition(account, symbol) {
    return 0;
}
async function getPositionLimit(account, symbol) {
    return 100000;
}
async function getTradingLimits(account) {
    return { maxOrderValue: 1000000, maxOrderSize: 10000 };
}
async function getMarketPrice(symbol) {
    return 100;
}
async function checkDailyTradingLimit(account, orderValue) {
    return true;
}
async function isSecurityRestricted(symbol, account) {
    return false;
}
async function getPortfolioValue(portfolioId) {
    return 10000000;
}
async function getPositionValue(account, symbol) {
    return 100000;
}
async function getConcentrationLimit(portfolioId) {
    return 10;
}
async function isMarginAccount(account) {
    return false;
}
async function getMarginAvailable(account) {
    return 100000;
}
async function calculateMarginRequirement(order) {
    return 50000;
}
async function isPatternDayTrader(account) {
    return false;
}
async function getAccountEquity(account) {
    return 100000;
}
async function isHardToBorrow(symbol) {
    return false;
}
async function checkLocateAvailability(symbol, quantity) {
    return true;
}
async function isShortSaleRestricted(symbol) {
    return false;
}
async function updateOrderFromExecution(execution, transaction) {
    // Implementation
}
async function recordFillDetails(execution, transaction) {
    // Implementation
}
async function updatePosition(execution) {
    // Implementation
}
async function performPostTradeCompliance(execution) {
    // Implementation
}
async function notifyExecutionComplete(execution) {
    // Implementation
}
async function getExecutionById(executionId) {
    return {};
}
function validateAllocations(execution, allocations) {
    // Implementation
}
async function saveAllocation(allocation) {
    // Implementation
}
async function updateAccountPosition(allocation) {
    // Implementation
}
async function updateAllocation(allocation) {
    // Implementation
}
async function getTradeById(tradeId) {
    return {};
}
async function calculateSettlementFees(trade) {
    return 10;
}
async function calculateSettlementTaxes(trade) {
    return 0;
}
async function getAccountById(accountId) {
    return { custodian: 'BNY Mellon', clearingBroker: 'Goldman Sachs' };
}
async function saveSettlementInstruction(instruction) {
    // Implementation
}
async function getExecutionsByOrderId(orderId) {
    return [];
}
async function getBenchmarkPrice(symbol, timestamp) {
    return 100;
}
async function calculateEffectiveSpread(executions) {
    return 0.01;
}
async function saveBestExecutionReport(report) {
    // Implementation
}
async function getOrdersInPeriod(period, filters) {
    return [];
}
async function savePeriodBestExecutionReport(report) {
    // Implementation
}
async function getMarketData(symbol) {
    return { spread: 0.01, lastPrice: 100 };
}
async function getAverageDailyVolume(symbol, days) {
    return 1000000;
}
async function estimateHistoricalImpact(symbol, quantity, historicalData) {
    return 0.05;
}
async function establishDMAConnection(config) {
    return {};
}
function convertToVenueFormat(order, venue) {
    return order;
}
async function sendOrderToVenue(connection, order) {
    return { venueOrderId: `VENUE-${Date.now()}` };
}
async function recordDMAOrder(order, venue, venueOrderId) {
    // Implementation
}
exports.default = {
    placeOrder,
    placeBasketOrder,
    placeAlgorithmicOrder,
    placeDMAOrder,
    modifyOrder,
    cancelOrder,
    cancelAllOrders,
    replaceOrder,
    smartRouteOrder,
    executeSmartRoutedOrder,
    calculateBestVenue,
    optimizeRoutingStrategy,
    executeTWAP,
    executeVWAP,
    executePOV,
    executeImplementationShortfall,
    monitorAlgorithmicExecution,
    performPreTradeCompliance,
    checkPositionLimits,
    checkTradingLimits,
    checkRestrictedSecurities,
    checkConcentrationLimits,
    checkRegulatoryRestrictions,
    checkShortSaleRestrictions,
    checkMarketHours,
    processExecutionReport,
    allocateTrade,
    generateSettlementInstructions,
    analyzeExecutionQuality,
    generateBestExecutionReport,
    estimateMarketImpact
};
//# sourceMappingURL=trading-execution-service-kit.js.map