/**
 * LOC: TRDORD1234567
 * File: /reuse/trading/trading-order-models-kit.ts
 *
 * UPSTREAM (imports from):
 *   - ../error-handling-kit.ts
 *   - ../validation-kit.ts
 *   - ./market-data-models-kit.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend trading services
 *   - Order management systems
 *   - Execution management systems
 *   - Compliance and surveillance
 */
/**
 * File: /reuse/trading/trading-order-models-kit.ts
 * Locator: WC-TRD-ORD-001
 * Purpose: Bloomberg Terminal-Level Trading Order Models - Comprehensive order lifecycle & execution
 *
 * Upstream: Error handling, validation, market data utilities
 * Downstream: ../backend/*, Trading services, OMS, EMS, compliance, broker connectivity
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 48+ utility functions for orders, executions, fills, allocations, routing, algorithms
 *
 * LLM Context: Enterprise-grade order management system competing with Bloomberg EMSX.
 * Provides comprehensive order lifecycle management, execution processing, fill allocation,
 * broker routing, algorithmic trading (TWAP, VWAP, Iceberg), order types (Market, Limit, Stop),
 * compliance validation, FIX protocol support, multi-venue routing, smart order routing,
 * execution quality analytics, transaction cost analysis.
 */
import { Sequelize, Transaction } from 'sequelize';
interface Order {
    orderId: string;
    clientOrderId: string;
    securityId: string;
    orderType: OrderType;
    side: OrderSide;
    quantity: number;
    filledQuantity: number;
    remainingQuantity: number;
    price: number | null;
    stopPrice: number | null;
    limitPrice: number | null;
    timeInForce: TimeInForce;
    orderStatus: OrderStatus;
    executionInstructions: string[];
    account: string;
    portfolio: string;
    trader: string;
    submittedAt: Date;
    lastUpdatedAt: Date;
    metadata: Record<string, any>;
}
type OrderType = 'MARKET' | 'LIMIT' | 'STOP' | 'STOP_LIMIT' | 'MARKET_ON_CLOSE' | 'LIMIT_ON_CLOSE' | 'ICEBERG' | 'TWAP' | 'VWAP' | 'PEG' | 'TRAILING_STOP';
type OrderSide = 'BUY' | 'SELL' | 'SHORT_SELL' | 'SHORT_SELL_EXEMPT';
type OrderStatus = 'PENDING' | 'NEW' | 'PARTIALLY_FILLED' | 'FILLED' | 'PENDING_CANCEL' | 'CANCELLED' | 'REJECTED' | 'EXPIRED' | 'SUSPENDED';
type TimeInForce = 'DAY' | 'GTC' | 'IOC' | 'FOK' | 'GTD' | 'ATO' | 'ATC';
interface Fill {
    fillId: string;
    orderId: string;
    executionId: string;
    quantity: number;
    price: number;
    notional: number;
    fillTime: Date;
    fillTimeMicros: number;
    cumQuantity: number;
    avgPrice: number;
    leavesQuantity: number;
    fillStatus: 'PARTIAL' | 'COMPLETE';
    venue: string;
}
interface Allocation {
    allocationId: string;
    orderId: string;
    executionId: string;
    account: string;
    portfolio: string;
    quantity: number;
    price: number;
    notional: number;
    allocationPercent: number;
    allocationStatus: 'PENDING' | 'ALLOCATED' | 'CONFIRMED' | 'SETTLED';
    settlementDate: Date;
    allocatedAt: Date;
}
interface IcebergOrder extends Order {
    orderType: 'ICEBERG';
    displayQuantity: number;
    hiddenQuantity: number;
    minimumQuantity: number;
}
interface TWAPOrder extends Order {
    orderType: 'TWAP';
    startTime: Date;
    endTime: Date;
    sliceInterval: number;
    sliceQuantity: number;
    executedSlices: number;
    remainingSlices: number;
}
interface VWAPOrder extends Order {
    orderType: 'VWAP';
    startTime: Date;
    endTime: Date;
    targetVWAP: number | null;
    actualVWAP: number | null;
    volumeParticipationRate: number;
}
interface OrderLifecycle {
    orderId: string;
    events: Array<{
        eventId: string;
        eventType: string;
        eventTime: Date;
        eventTimeMicros: number;
        status: OrderStatus;
        description: string;
        metadata: Record<string, any>;
    }>;
}
interface ExecutionReport {
    reportId: string;
    orderId: string;
    reportType: 'NEW' | 'PARTIAL_FILL' | 'FILL' | 'CANCELLED' | 'REPLACED' | 'REJECTED';
    reportTime: Date;
    orderStatus: OrderStatus;
    cumQuantity: number;
    avgPrice: number;
    leavesQuantity: number;
    lastQuantity: number | null;
    lastPrice: number | null;
    text: string | null;
}
interface OrderValidation {
    valid: boolean;
    errors: Array<{
        code: string;
        message: string;
        field?: string;
    }>;
    warnings: Array<{
        code: string;
        message: string;
    }>;
    risk: {
        exposure: number;
        limitUtilization: number;
        exceedsLimit: boolean;
    };
}
interface SmartOrderRouting {
    routingId: string;
    orderId: string;
    strategy: 'BEST_EXECUTION' | 'LOWEST_COST' | 'FASTEST' | 'DARK_POOL' | 'CUSTOM';
    venues: Array<{
        venue: string;
        quantity: number;
        priority: number;
        expectedCost: number;
    }>;
    estimatedCost: number;
    estimatedSlippage: number;
}
/**
 * Sequelize model for Orders with comprehensive lifecycle tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Order model
 *
 * @example
 * ```typescript
 * const Order = createOrderModel(sequelize);
 * const order = await Order.create({
 *   clientOrderId: 'ORD-12345',
 *   securityId: 'AAPL-NASDAQ',
 *   orderType: 'LIMIT',
 *   side: 'BUY',
 *   quantity: 1000,
 *   limitPrice: 175.00
 * });
 * ```
 */
export declare const createOrderModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        orderId: string;
        clientOrderId: string;
        parentOrderId: string | null;
        securityId: string;
        orderType: string;
        side: string;
        quantity: number;
        filledQuantity: number;
        remainingQuantity: number;
        price: number | null;
        stopPrice: number | null;
        limitPrice: number | null;
        averagePrice: number | null;
        timeInForce: string;
        orderStatus: string;
        executionInstructions: string[];
        account: string;
        portfolio: string;
        strategy: string | null;
        trader: string;
        traderId: string;
        desk: string | null;
        submittedAt: Date;
        submittedAtMicros: number;
        acknowledgedAt: Date | null;
        lastUpdatedAt: Date;
        completedAt: Date | null;
        venue: string | null;
        broker: string | null;
        commission: number;
        fees: number;
        settlementDate: Date | null;
        currency: string;
        exchangeOrderId: string | null;
        fixMessageId: string | null;
        text: string | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
        readonly deletedAt: Date | null;
    };
};
/**
 * Sequelize model for Executions with fill tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Execution model
 *
 * @example
 * ```typescript
 * const Execution = createExecutionModel(sequelize);
 * const execution = await Execution.create({
 *   orderId: 'ORD-12345',
 *   quantity: 100,
 *   price: 175.25,
 *   venue: 'NASDAQ'
 * });
 * ```
 */
export declare const createExecutionModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        executionId: string;
        orderId: string;
        fillId: string;
        securityId: string;
        side: string;
        quantity: number;
        price: number;
        notional: number;
        executionTime: Date;
        executionTimeMicros: number;
        venue: string;
        exchange: string;
        broker: string;
        commission: number;
        fees: number;
        liquidity: string;
        settlementDate: Date;
        contraparty: string | null;
        tradeId: string | null;
        executionReport: Record<string, any>;
        currency: string;
        exchangeRateToUSD: number;
        notionalUSD: number;
        metadata: Record<string, any>;
        readonly createdAt: Date;
    };
};
/**
 * Sequelize model for Broker Routes and connectivity.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} BrokerRoute model
 *
 * @example
 * ```typescript
 * const BrokerRoute = createBrokerRouteModel(sequelize);
 * const route = await BrokerRoute.create({
 *   broker: 'MORGAN_STANLEY',
 *   venue: 'NASDAQ',
 *   protocol: 'FIX_4.4',
 *   enabled: true
 * });
 * ```
 */
export declare const createBrokerRouteModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        routeId: string;
        routeName: string;
        broker: string;
        brokerCode: string;
        venue: string;
        venueType: string;
        connectionStatus: string;
        protocol: string;
        fixVersion: string | null;
        senderCompId: string | null;
        targetCompId: string | null;
        connectionString: string | null;
        priority: number;
        enabled: boolean;
        routingRules: Record<string, any>;
        capabilities: string[];
        supportedOrderTypes: string[];
        lastHeartbeat: Date | null;
        lastMessageTime: Date | null;
        messageCount: number;
        errorCount: number;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Order Audit Trail.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} OrderAudit model
 *
 * @example
 * ```typescript
 * const OrderAudit = createOrderAuditModel(sequelize);
 * const audit = await OrderAudit.create({
 *   orderId: 'ORD-12345',
 *   eventType: 'STATUS_CHANGE',
 *   oldStatus: 'NEW',
 *   newStatus: 'PARTIALLY_FILLED'
 * });
 * ```
 */
export declare const createOrderAuditModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        auditId: string;
        orderId: string;
        eventType: string;
        eventTime: Date;
        eventTimeMicros: number;
        userId: string | null;
        userName: string | null;
        orderStatus: string;
        previousStatus: string | null;
        changes: Record<string, any>;
        fixMessage: string | null;
        ipAddress: string | null;
        description: string | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
    };
};
/**
 * Creates and validates a new order.
 *
 * @param {Partial<Order>} orderData - Order data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<object>} Created order
 *
 * @example
 * ```typescript
 * const order = await createOrder({
 *   clientOrderId: 'ORD-12345',
 *   securityId: 'AAPL-NASDAQ',
 *   orderType: 'LIMIT',
 *   side: 'BUY',
 *   quantity: 1000,
 *   limitPrice: 175.00,
 *   account: 'ACCT-001',
 *   trader: 'john.doe'
 * });
 * ```
 */
export declare const createOrder: (orderData: Partial<Order>, transaction?: Transaction) => Promise<any>;
/**
 * Validates order parameters and business rules.
 *
 * @param {Partial<Order>} orderData - Order data to validate
 * @returns {Promise<OrderValidation>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateOrderParameters(orderData);
 * if (!validation.valid) {
 *   console.error('Validation errors:', validation.errors);
 * }
 * ```
 */
export declare const validateOrderParameters: (orderData: Partial<Order>) => Promise<OrderValidation>;
/**
 * Validates order against compliance rules (pre-trade compliance).
 *
 * @param {Partial<Order>} orderData - Order data
 * @param {object} [complianceRules] - Compliance rules
 * @returns {Promise<{ compliant: boolean; violations: string[]; warnings: string[] }>} Compliance result
 *
 * @example
 * ```typescript
 * const compliance = await validateOrderCompliance(orderData);
 * if (!compliance.compliant) {
 *   console.error('Compliance violations:', compliance.violations);
 * }
 * ```
 */
export declare const validateOrderCompliance: (orderData: Partial<Order>, complianceRules?: any) => Promise<{
    compliant: boolean;
    violations: string[];
    warnings: string[];
}>;
/**
 * Enriches order with default values and calculated fields.
 *
 * @param {Partial<Order>} orderData - Order data
 * @returns {Promise<Partial<Order>>} Enriched order
 *
 * @example
 * ```typescript
 * const enriched = await enrichOrderWithDefaults(orderData);
 * ```
 */
export declare const enrichOrderWithDefaults: (orderData: Partial<Order>) => Promise<Partial<Order>>;
/**
 * Calculates order notional value.
 *
 * @param {number} quantity - Order quantity
 * @param {number} price - Order price
 * @param {string} [currency='USD'] - Currency
 * @returns {Promise<{ notional: number; notionalUSD: number; currency: string }>} Order value
 *
 * @example
 * ```typescript
 * const value = await calculateOrderValue(1000, 175.25);
 * console.log(`Order value: $${value.notionalUSD}`);
 * ```
 */
export declare const calculateOrderValue: (quantity: number, price: number, currency?: string) => Promise<{
    notional: number;
    notionalUSD: number;
    currency: string;
}>;
/**
 * Validates order against position and risk limits.
 *
 * @param {Partial<Order>} orderData - Order data
 * @param {string} account - Trading account
 * @returns {Promise<{ withinLimits: boolean; exposure: number; availableLimit: number }>} Risk check result
 *
 * @example
 * ```typescript
 * const riskCheck = await validateOrderRiskLimits(orderData, 'ACCT-001');
 * ```
 */
export declare const validateOrderRiskLimits: (orderData: Partial<Order>, account: string) => Promise<{
    withinLimits: boolean;
    exposure: number;
    availableLimit: number;
}>;
/**
 * Generates unique client order ID.
 *
 * @param {string} [prefix='ORD'] - ID prefix
 * @returns {Promise<string>} Generated order ID
 *
 * @example
 * ```typescript
 * const orderId = await generateClientOrderId('ALGO');
 * ```
 */
export declare const generateClientOrderId: (prefix?: string) => Promise<string>;
/**
 * Submits order to execution venue.
 *
 * @param {string} orderId - Order identifier
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<{ submitted: boolean; acknowledgedAt?: Date; exchangeOrderId?: string }>} Submission result
 *
 * @example
 * ```typescript
 * const result = await submitOrder('ORD-12345');
 * ```
 */
export declare const submitOrder: (orderId: string, transaction?: Transaction) => Promise<{
    submitted: boolean;
    acknowledgedAt?: Date;
    exchangeOrderId?: string;
}>;
/**
 * Amends existing order.
 *
 * @param {string} orderId - Order identifier
 * @param {Partial<Order>} amendments - Fields to amend
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<object>} Amendment result
 *
 * @example
 * ```typescript
 * const result = await amendOrder('ORD-12345', { quantity: 1200, limitPrice: 175.50 });
 * ```
 */
export declare const amendOrder: (orderId: string, amendments: Partial<Order>, transaction?: Transaction) => Promise<any>;
/**
 * Cancels order or pending order request.
 *
 * @param {string} orderId - Order identifier
 * @param {string} [reason] - Cancellation reason
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<{ cancelled: boolean; cancelledAt?: Date; reason?: string }>} Cancellation result
 *
 * @example
 * ```typescript
 * const result = await cancelOrder('ORD-12345', 'User requested');
 * ```
 */
export declare const cancelOrder: (orderId: string, reason?: string, transaction?: Transaction) => Promise<{
    cancelled: boolean;
    cancelledAt?: Date;
    reason?: string;
}>;
/**
 * Gets current order status and details.
 *
 * @param {string} orderId - Order identifier
 * @returns {Promise<object>} Order status
 *
 * @example
 * ```typescript
 * const status = await getOrderStatus('ORD-12345');
 * console.log(`Status: ${status.orderStatus}, Filled: ${status.filledQuantity}`);
 * ```
 */
export declare const getOrderStatus: (orderId: string) => Promise<any>;
/**
 * Tracks complete order lifecycle with all events.
 *
 * @param {string} orderId - Order identifier
 * @returns {Promise<OrderLifecycle>} Order lifecycle
 *
 * @example
 * ```typescript
 * const lifecycle = await trackOrderLifecycle('ORD-12345');
 * ```
 */
export declare const trackOrderLifecycle: (orderId: string) => Promise<OrderLifecycle>;
/**
 * Gets order fills and execution history.
 *
 * @param {string} orderId - Order identifier
 * @returns {Promise<Fill[]>} Order fills
 *
 * @example
 * ```typescript
 * const fills = await getOrderFills('ORD-12345');
 * ```
 */
export declare const getOrderFills: (orderId: string) => Promise<Fill[]>;
/**
 * Replaces order (cancel and replace).
 *
 * @param {string} orderId - Order identifier
 * @param {Partial<Order>} newOrderData - New order parameters
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<{ oldOrderId: string; newOrderId: string; replaced: boolean }>} Replace result
 *
 * @example
 * ```typescript
 * const result = await replaceOrder('ORD-12345', { quantity: 1500, limitPrice: 176.00 });
 * ```
 */
export declare const replaceOrder: (orderId: string, newOrderData: Partial<Order>, transaction?: Transaction) => Promise<{
    oldOrderId: string;
    newOrderId: string;
    replaced: boolean;
}>;
/**
 * Processes execution report from venue.
 *
 * @param {ExecutionReport} executionReport - Execution report
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<object>} Processed execution
 *
 * @example
 * ```typescript
 * const execution = await processExecution(executionReport);
 * ```
 */
export declare const processExecution: (executionReport: ExecutionReport, transaction?: Transaction) => Promise<any>;
/**
 * Records fill for order.
 *
 * @param {string} orderId - Order identifier
 * @param {number} quantity - Fill quantity
 * @param {number} price - Fill price
 * @param {object} fillDetails - Additional fill details
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Fill>} Created fill
 *
 * @example
 * ```typescript
 * const fill = await recordFill('ORD-12345', 100, 175.25, { venue: 'NASDAQ' });
 * ```
 */
export declare const recordFill: (orderId: string, quantity: number, price: number, fillDetails: any, transaction?: Transaction) => Promise<Fill>;
/**
 * Calculates average fill price for order.
 *
 * @param {string} orderId - Order identifier
 * @returns {Promise<{ avgPrice: number; totalQuantity: number; totalNotional: number }>} Average price
 *
 * @example
 * ```typescript
 * const avg = await calculateAveragePrice('ORD-12345');
 * console.log(`Average price: $${avg.avgPrice}`);
 * ```
 */
export declare const calculateAveragePrice: (orderId: string) => Promise<{
    avgPrice: number;
    totalQuantity: number;
    totalNotional: number;
}>;
/**
 * Updates order quantities after fill.
 *
 * @param {string} orderId - Order identifier
 * @param {number} fillQuantity - Fill quantity
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<{ filledQuantity: number; remainingQuantity: number; orderStatus: string }>} Updated quantities
 *
 * @example
 * ```typescript
 * const updated = await updateOrderQuantities('ORD-12345', 100);
 * ```
 */
export declare const updateOrderQuantities: (orderId: string, fillQuantity: number, transaction?: Transaction) => Promise<{
    filledQuantity: number;
    remainingQuantity: number;
    orderStatus: string;
}>;
/**
 * Finalizes completed order.
 *
 * @param {string} orderId - Order identifier
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<{ finalized: boolean; completedAt: Date; finalStatus: string }>} Finalization result
 *
 * @example
 * ```typescript
 * const result = await finalizeOrder('ORD-12345');
 * ```
 */
export declare const finalizeOrder: (orderId: string, transaction?: Transaction) => Promise<{
    finalized: boolean;
    completedAt: Date;
    finalStatus: string;
}>;
/**
 * Calculates execution slippage vs. benchmark.
 *
 * @param {string} orderId - Order identifier
 * @param {number} benchmarkPrice - Benchmark price
 * @returns {Promise<{ slippage: number; slippageBps: number; slippagePercent: number }>} Slippage metrics
 *
 * @example
 * ```typescript
 * const slippage = await calculateExecutionSlippage('ORD-12345', 175.00);
 * ```
 */
export declare const calculateExecutionSlippage: (orderId: string, benchmarkPrice: number) => Promise<{
    slippage: number;
    slippageBps: number;
    slippagePercent: number;
}>;
/**
 * Generates execution quality metrics.
 *
 * @param {string} orderId - Order identifier
 * @returns {Promise<object>} Execution quality metrics
 *
 * @example
 * ```typescript
 * const quality = await generateExecutionQualityMetrics('ORD-12345');
 * ```
 */
export declare const generateExecutionQualityMetrics: (orderId: string) => Promise<any>;
/**
 * Routes order to best execution venue.
 *
 * @param {string} orderId - Order identifier
 * @param {object} [routingOptions] - Routing options
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<{ venue: string; broker: string; routeId: string; estimatedCost: number }>} Routing result
 *
 * @example
 * ```typescript
 * const route = await routeOrder('ORD-12345', { strategy: 'BEST_EXECUTION' });
 * ```
 */
export declare const routeOrder: (orderId: string, routingOptions?: any, transaction?: Transaction) => Promise<{
    venue: string;
    broker: string;
    routeId: string;
    estimatedCost: number;
}>;
/**
 * Selects best venue based on liquidity and cost.
 *
 * @param {string} securityId - Security identifier
 * @param {number} quantity - Order quantity
 * @param {OrderSide} side - Order side
 * @returns {Promise<{ venue: string; liquidity: number; cost: number; latency: number }>} Best venue
 *
 * @example
 * ```typescript
 * const venue = await selectBestVenue('AAPL-NASDAQ', 1000, 'BUY');
 * ```
 */
export declare const selectBestVenue: (securityId: string, quantity: number, side: OrderSide) => Promise<{
    venue: string;
    liquidity: number;
    cost: number;
    latency: number;
}>;
/**
 * Applies smart order routing rules.
 *
 * @param {string} orderId - Order identifier
 * @param {object} routingRules - Routing rules
 * @returns {Promise<SmartOrderRouting>} Routing plan
 *
 * @example
 * ```typescript
 * const routingPlan = await applyRoutingRules('ORD-12345', rules);
 * ```
 */
export declare const applyRoutingRules: (orderId: string, routingRules: any) => Promise<SmartOrderRouting>;
/**
 * Validates venue connectivity before routing.
 *
 * @param {string} venue - Venue identifier
 * @returns {Promise<{ connected: boolean; latency?: number; lastHeartbeat?: Date }>} Connectivity status
 *
 * @example
 * ```typescript
 * const status = await validateVenueConnectivity('NASDAQ');
 * ```
 */
export declare const validateVenueConnectivity: (venue: string) => Promise<{
    connected: boolean;
    latency?: number;
    lastHeartbeat?: Date;
}>;
/**
 * Handles routing failure and fallback.
 *
 * @param {string} orderId - Order identifier
 * @param {string} failedVenue - Failed venue
 * @param {string} error - Error message
 * @returns {Promise<{ rerouted: boolean; newVenue?: string; action: string }>} Failure handling result
 *
 * @example
 * ```typescript
 * const result = await handleRoutingFailure('ORD-12345', 'NASDAQ', 'Connection timeout');
 * ```
 */
export declare const handleRoutingFailure: (orderId: string, failedVenue: string, error: string) => Promise<{
    rerouted: boolean;
    newVenue?: string;
    action: string;
}>;
/**
 * Gets routing statistics for venue.
 *
 * @param {string} venue - Venue identifier
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<object>} Routing statistics
 *
 * @example
 * ```typescript
 * const stats = await getRoutingStatistics('NASDAQ', startDate, endDate);
 * ```
 */
export declare const getRoutingStatistics: (venue: string, startDate: Date, endDate: Date) => Promise<any>;
/**
 * Optimizes multi-venue order splitting.
 *
 * @param {string} orderId - Order identifier
 * @param {number} quantity - Total quantity
 * @param {string[]} venues - Available venues
 * @returns {Promise<Array<{ venue: string; quantity: number; percentage: number }>>} Optimized splits
 *
 * @example
 * ```typescript
 * const splits = await optimizeMultiVenueSplitting('ORD-12345', 1000, ['NASDAQ', 'ARCA']);
 * ```
 */
export declare const optimizeMultiVenueSplitting: (orderId: string, quantity: number, venues: string[]) => Promise<Array<{
    venue: string;
    quantity: number;
    percentage: number;
}>>;
/**
 * Creates TWAP (Time-Weighted Average Price) order.
 *
 * @param {Partial<TWAPOrder>} twapData - TWAP order parameters
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<TWAPOrder>} Created TWAP order
 *
 * @example
 * ```typescript
 * const twap = await createTWAPOrder({
 *   securityId: 'AAPL-NASDAQ',
 *   side: 'BUY',
 *   quantity: 10000,
 *   startTime: new Date('2025-11-09 09:30:00'),
 *   endTime: new Date('2025-11-09 16:00:00'),
 *   sliceInterval: 300
 * });
 * ```
 */
export declare const createTWAPOrder: (twapData: Partial<TWAPOrder>, transaction?: Transaction) => Promise<any>;
/**
 * Creates VWAP (Volume-Weighted Average Price) order.
 *
 * @param {Partial<VWAPOrder>} vwapData - VWAP order parameters
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<VWAPOrder>} Created VWAP order
 *
 * @example
 * ```typescript
 * const vwap = await createVWAPOrder({
 *   securityId: 'AAPL-NASDAQ',
 *   side: 'BUY',
 *   quantity: 10000,
 *   startTime: marketOpen,
 *   endTime: marketClose,
 *   volumeParticipationRate: 0.10
 * });
 * ```
 */
export declare const createVWAPOrder: (vwapData: Partial<VWAPOrder>, transaction?: Transaction) => Promise<any>;
/**
 * Creates Iceberg order with hidden quantity.
 *
 * @param {Partial<IcebergOrder>} icebergData - Iceberg order parameters
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<IcebergOrder>} Created iceberg order
 *
 * @example
 * ```typescript
 * const iceberg = await createIcebergOrder({
 *   securityId: 'AAPL-NASDAQ',
 *   side: 'BUY',
 *   quantity: 10000,
 *   displayQuantity: 100,
 *   limitPrice: 175.00
 * });
 * ```
 */
export declare const createIcebergOrder: (icebergData: Partial<IcebergOrder>, transaction?: Transaction) => Promise<any>;
/**
 * Executes next algorithmic order slice.
 *
 * @param {string} orderId - Parent algorithmic order ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<{ sliceOrderId: string; quantity: number; executed: boolean }>} Slice execution result
 *
 * @example
 * ```typescript
 * const slice = await executeAlgorithmicSlice('TWAP-12345');
 * ```
 */
export declare const executeAlgorithmicSlice: (orderId: string, transaction?: Transaction) => Promise<{
    sliceOrderId: string;
    quantity: number;
    executed: boolean;
}>;
/**
 * Monitors algorithmic order progress.
 *
 * @param {string} orderId - Algorithmic order ID
 * @returns {Promise<{ progress: number; executedQuantity: number; remainingQuantity: number; onSchedule: boolean }>} Progress metrics
 *
 * @example
 * ```typescript
 * const progress = await monitorAlgorithmicProgress('TWAP-12345');
 * console.log(`Progress: ${progress.progress}%`);
 * ```
 */
export declare const monitorAlgorithmicProgress: (orderId: string) => Promise<{
    progress: number;
    executedQuantity: number;
    remainingQuantity: number;
    onSchedule: boolean;
}>;
/**
 * Adjusts algorithmic order parameters dynamically.
 *
 * @param {string} orderId - Algorithmic order ID
 * @param {object} adjustments - Parameter adjustments
 * @returns {Promise<{ adjusted: boolean; newParameters: object }>} Adjustment result
 *
 * @example
 * ```typescript
 * const result = await adjustAlgorithmicParameters('VWAP-12345', { volumeParticipationRate: 0.15 });
 * ```
 */
export declare const adjustAlgorithmicParameters: (orderId: string, adjustments: any) => Promise<{
    adjusted: boolean;
    newParameters: object;
}>;
/**
 * Pauses algorithmic order execution.
 *
 * @param {string} orderId - Algorithmic order ID
 * @param {string} reason - Pause reason
 * @returns {Promise<{ paused: boolean; pausedAt: Date; reason: string }>} Pause result
 *
 * @example
 * ```typescript
 * const result = await pauseAlgorithmicOrder('TWAP-12345', 'Market volatility');
 * ```
 */
export declare const pauseAlgorithmicOrder: (orderId: string, reason: string) => Promise<{
    paused: boolean;
    pausedAt: Date;
    reason: string;
}>;
/**
 * Allocates fills to accounts/portfolios.
 *
 * @param {string} orderId - Order identifier
 * @param {Array<{ account: string; percentage: number }>} allocations - Allocation percentages
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Allocation[]>} Created allocations
 *
 * @example
 * ```typescript
 * const allocations = await allocateFills('ORD-12345', [
 *   { account: 'ACCT-001', percentage: 60 },
 *   { account: 'ACCT-002', percentage: 40 }
 * ]);
 * ```
 */
export declare const allocateFills: (orderId: string, allocations: Array<{
    account: string;
    percentage: number;
}>, transaction?: Transaction) => Promise<Allocation[]>;
/**
 * Calculates allocation shares based on rules.
 *
 * @param {number} totalQuantity - Total filled quantity
 * @param {Array<{ account: string; rule: string; value: number }>} rules - Allocation rules
 * @returns {Promise<Array<{ account: string; quantity: number; percentage: number }>>} Calculated allocations
 *
 * @example
 * ```typescript
 * const shares = await calculateAllocationShares(1000, rules);
 * ```
 */
export declare const calculateAllocationShares: (totalQuantity: number, rules: Array<{
    account: string;
    rule: string;
    value: number;
}>) => Promise<Array<{
    account: string;
    quantity: number;
    percentage: number;
}>>;
/**
 * Validates allocation against order quantity.
 *
 * @param {string} orderId - Order identifier
 * @param {Allocation[]} allocations - Allocations to validate
 * @returns {Promise<{ valid: boolean; totalAllocated: number; errors: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateAllocation('ORD-12345', allocations);
 * ```
 */
export declare const validateAllocation: (orderId: string, allocations: Allocation[]) => Promise<{
    valid: boolean;
    totalAllocated: number;
    errors: string[];
}>;
/**
 * Processes allocation amendment.
 *
 * @param {string} allocationId - Allocation identifier
 * @param {Partial<Allocation>} amendments - Allocation amendments
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<{ amended: boolean; allocationId: string }>} Amendment result
 *
 * @example
 * ```typescript
 * const result = await processAllocationAmendment('ALLOC-12345', { quantity: 550 });
 * ```
 */
export declare const processAllocationAmendment: (allocationId: string, amendments: Partial<Allocation>, transaction?: Transaction) => Promise<{
    amended: boolean;
    allocationId: string;
}>;
/**
 * Generates allocation report.
 *
 * @param {string} orderId - Order identifier
 * @param {string} format - Report format
 * @returns {Promise<Buffer>} Allocation report
 *
 * @example
 * ```typescript
 * const report = await generateAllocationReport('ORD-12345', 'PDF');
 * ```
 */
export declare const generateAllocationReport: (orderId: string, format: string) => Promise<Buffer>;
/**
 * Auto-allocates fills based on pre-defined rules.
 *
 * @param {string} orderId - Order identifier
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<{ allocated: boolean; allocations: Allocation[] }>} Auto-allocation result
 *
 * @example
 * ```typescript
 * const result = await autoAllocateFills('ORD-12345');
 * ```
 */
export declare const autoAllocateFills: (orderId: string, transaction?: Transaction) => Promise<{
    allocated: boolean;
    allocations: Allocation[];
}>;
/**
 * Confirms allocation for settlement.
 *
 * @param {string} allocationId - Allocation identifier
 * @param {string} confirmedBy - User confirming
 * @returns {Promise<{ confirmed: boolean; confirmationTime: Date }>} Confirmation result
 *
 * @example
 * ```typescript
 * const result = await confirmAllocation('ALLOC-12345', 'john.doe');
 * ```
 */
export declare const confirmAllocation: (allocationId: string, confirmedBy: string) => Promise<{
    confirmed: boolean;
    confirmationTime: Date;
}>;
/**
 * Audits complete order lifecycle.
 *
 * @param {string} orderId - Order identifier
 * @returns {Promise<object>} Audit trail
 *
 * @example
 * ```typescript
 * const audit = await auditOrderLifecycle('ORD-12345');
 * ```
 */
export declare const auditOrderLifecycle: (orderId: string) => Promise<any>;
/**
 * Validates pre-trade compliance checks.
 *
 * @param {Partial<Order>} orderData - Order data
 * @returns {Promise<{ compliant: boolean; checks: Array<{ check: string; passed: boolean; details?: string }> }>} Compliance result
 *
 * @example
 * ```typescript
 * const compliance = await validatePreTradeCompliance(orderData);
 * ```
 */
export declare const validatePreTradeCompliance: (orderData: Partial<Order>) => Promise<{
    compliant: boolean;
    checks: Array<{
        check: string;
        passed: boolean;
        details?: string;
    }>;
}>;
/**
 * Validates post-trade compliance.
 *
 * @param {string} orderId - Order identifier
 * @returns {Promise<{ compliant: boolean; violations: string[]; warnings: string[] }>} Compliance result
 *
 * @example
 * ```typescript
 * const compliance = await validatePostTradeCompliance('ORD-12345');
 * ```
 */
export declare const validatePostTradeCompliance: (orderId: string) => Promise<{
    compliant: boolean;
    violations: string[];
    warnings: string[];
}>;
/**
 * Generates complete order audit trail.
 *
 * @param {string} orderId - Order identifier
 * @param {boolean} [includeFIX=false] - Include FIX messages
 * @returns {Promise<object>} Audit trail
 *
 * @example
 * ```typescript
 * const trail = await generateOrderAuditTrail('ORD-12345', true);
 * ```
 */
export declare const generateOrderAuditTrail: (orderId: string, includeFIX?: boolean) => Promise<any>;
/**
 * Exports orders for regulatory reporting.
 *
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {string} format - Export format
 * @param {object} [filters] - Additional filters
 * @returns {Promise<Buffer>} Regulatory export
 *
 * @example
 * ```typescript
 * const export = await exportOrdersForRegulatory(startDate, endDate, 'CSV');
 * ```
 */
export declare const exportOrdersForRegulatory: (startDate: Date, endDate: Date, format: string, filters?: any) => Promise<Buffer>;
/**
 * Detects potential wash sales.
 *
 * @param {string} account - Trading account
 * @param {Date} startDate - Analysis start date
 * @param {Date} endDate - Analysis end date
 * @returns {Promise<Array<{ securityId: string; buyDate: Date; sellDate: Date; loss: number }>>} Detected wash sales
 *
 * @example
 * ```typescript
 * const washSales = await detectWashSales('ACCT-001', startDate, endDate);
 * ```
 */
export declare const detectWashSales: (account: string, startDate: Date, endDate: Date) => Promise<Array<{
    securityId: string;
    buyDate: Date;
    sellDate: Date;
    loss: number;
}>>;
/**
 * Default export with all utilities.
 */
declare const _default: {
    createOrderModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            orderId: string;
            clientOrderId: string;
            parentOrderId: string | null;
            securityId: string;
            orderType: string;
            side: string;
            quantity: number;
            filledQuantity: number;
            remainingQuantity: number;
            price: number | null;
            stopPrice: number | null;
            limitPrice: number | null;
            averagePrice: number | null;
            timeInForce: string;
            orderStatus: string;
            executionInstructions: string[];
            account: string;
            portfolio: string;
            strategy: string | null;
            trader: string;
            traderId: string;
            desk: string | null;
            submittedAt: Date;
            submittedAtMicros: number;
            acknowledgedAt: Date | null;
            lastUpdatedAt: Date;
            completedAt: Date | null;
            venue: string | null;
            broker: string | null;
            commission: number;
            fees: number;
            settlementDate: Date | null;
            currency: string;
            exchangeOrderId: string | null;
            fixMessageId: string | null;
            text: string | null;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
            readonly deletedAt: Date | null;
        };
    };
    createExecutionModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            executionId: string;
            orderId: string;
            fillId: string;
            securityId: string;
            side: string;
            quantity: number;
            price: number;
            notional: number;
            executionTime: Date;
            executionTimeMicros: number;
            venue: string;
            exchange: string;
            broker: string;
            commission: number;
            fees: number;
            liquidity: string;
            settlementDate: Date;
            contraparty: string | null;
            tradeId: string | null;
            executionReport: Record<string, any>;
            currency: string;
            exchangeRateToUSD: number;
            notionalUSD: number;
            metadata: Record<string, any>;
            readonly createdAt: Date;
        };
    };
    createBrokerRouteModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            routeId: string;
            routeName: string;
            broker: string;
            brokerCode: string;
            venue: string;
            venueType: string;
            connectionStatus: string;
            protocol: string;
            fixVersion: string | null;
            senderCompId: string | null;
            targetCompId: string | null;
            connectionString: string | null;
            priority: number;
            enabled: boolean;
            routingRules: Record<string, any>;
            capabilities: string[];
            supportedOrderTypes: string[];
            lastHeartbeat: Date | null;
            lastMessageTime: Date | null;
            messageCount: number;
            errorCount: number;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createOrderAuditModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            auditId: string;
            orderId: string;
            eventType: string;
            eventTime: Date;
            eventTimeMicros: number;
            userId: string | null;
            userName: string | null;
            orderStatus: string;
            previousStatus: string | null;
            changes: Record<string, any>;
            fixMessage: string | null;
            ipAddress: string | null;
            description: string | null;
            metadata: Record<string, any>;
            readonly createdAt: Date;
        };
    };
    createOrder: (orderData: Partial<Order>, transaction?: Transaction) => Promise<any>;
    validateOrderParameters: (orderData: Partial<Order>) => Promise<OrderValidation>;
    validateOrderCompliance: (orderData: Partial<Order>, complianceRules?: any) => Promise<{
        compliant: boolean;
        violations: string[];
        warnings: string[];
    }>;
    enrichOrderWithDefaults: (orderData: Partial<Order>) => Promise<Partial<Order>>;
    calculateOrderValue: (quantity: number, price: number, currency?: string) => Promise<{
        notional: number;
        notionalUSD: number;
        currency: string;
    }>;
    validateOrderRiskLimits: (orderData: Partial<Order>, account: string) => Promise<{
        withinLimits: boolean;
        exposure: number;
        availableLimit: number;
    }>;
    generateClientOrderId: (prefix?: string) => Promise<string>;
    submitOrder: (orderId: string, transaction?: Transaction) => Promise<{
        submitted: boolean;
        acknowledgedAt?: Date;
        exchangeOrderId?: string;
    }>;
    amendOrder: (orderId: string, amendments: Partial<Order>, transaction?: Transaction) => Promise<any>;
    cancelOrder: (orderId: string, reason?: string, transaction?: Transaction) => Promise<{
        cancelled: boolean;
        cancelledAt?: Date;
        reason?: string;
    }>;
    getOrderStatus: (orderId: string) => Promise<any>;
    trackOrderLifecycle: (orderId: string) => Promise<OrderLifecycle>;
    getOrderFills: (orderId: string) => Promise<Fill[]>;
    replaceOrder: (orderId: string, newOrderData: Partial<Order>, transaction?: Transaction) => Promise<{
        oldOrderId: string;
        newOrderId: string;
        replaced: boolean;
    }>;
    processExecution: (executionReport: ExecutionReport, transaction?: Transaction) => Promise<any>;
    recordFill: (orderId: string, quantity: number, price: number, fillDetails: any, transaction?: Transaction) => Promise<Fill>;
    calculateAveragePrice: (orderId: string) => Promise<{
        avgPrice: number;
        totalQuantity: number;
        totalNotional: number;
    }>;
    updateOrderQuantities: (orderId: string, fillQuantity: number, transaction?: Transaction) => Promise<{
        filledQuantity: number;
        remainingQuantity: number;
        orderStatus: string;
    }>;
    finalizeOrder: (orderId: string, transaction?: Transaction) => Promise<{
        finalized: boolean;
        completedAt: Date;
        finalStatus: string;
    }>;
    calculateExecutionSlippage: (orderId: string, benchmarkPrice: number) => Promise<{
        slippage: number;
        slippageBps: number;
        slippagePercent: number;
    }>;
    generateExecutionQualityMetrics: (orderId: string) => Promise<any>;
    routeOrder: (orderId: string, routingOptions?: any, transaction?: Transaction) => Promise<{
        venue: string;
        broker: string;
        routeId: string;
        estimatedCost: number;
    }>;
    selectBestVenue: (securityId: string, quantity: number, side: OrderSide) => Promise<{
        venue: string;
        liquidity: number;
        cost: number;
        latency: number;
    }>;
    applyRoutingRules: (orderId: string, routingRules: any) => Promise<SmartOrderRouting>;
    validateVenueConnectivity: (venue: string) => Promise<{
        connected: boolean;
        latency?: number;
        lastHeartbeat?: Date;
    }>;
    handleRoutingFailure: (orderId: string, failedVenue: string, error: string) => Promise<{
        rerouted: boolean;
        newVenue?: string;
        action: string;
    }>;
    getRoutingStatistics: (venue: string, startDate: Date, endDate: Date) => Promise<any>;
    optimizeMultiVenueSplitting: (orderId: string, quantity: number, venues: string[]) => Promise<Array<{
        venue: string;
        quantity: number;
        percentage: number;
    }>>;
    createTWAPOrder: (twapData: Partial<TWAPOrder>, transaction?: Transaction) => Promise<any>;
    createVWAPOrder: (vwapData: Partial<VWAPOrder>, transaction?: Transaction) => Promise<any>;
    createIcebergOrder: (icebergData: Partial<IcebergOrder>, transaction?: Transaction) => Promise<any>;
    executeAlgorithmicSlice: (orderId: string, transaction?: Transaction) => Promise<{
        sliceOrderId: string;
        quantity: number;
        executed: boolean;
    }>;
    monitorAlgorithmicProgress: (orderId: string) => Promise<{
        progress: number;
        executedQuantity: number;
        remainingQuantity: number;
        onSchedule: boolean;
    }>;
    adjustAlgorithmicParameters: (orderId: string, adjustments: any) => Promise<{
        adjusted: boolean;
        newParameters: object;
    }>;
    pauseAlgorithmicOrder: (orderId: string, reason: string) => Promise<{
        paused: boolean;
        pausedAt: Date;
        reason: string;
    }>;
    allocateFills: (orderId: string, allocations: Array<{
        account: string;
        percentage: number;
    }>, transaction?: Transaction) => Promise<Allocation[]>;
    calculateAllocationShares: (totalQuantity: number, rules: Array<{
        account: string;
        rule: string;
        value: number;
    }>) => Promise<Array<{
        account: string;
        quantity: number;
        percentage: number;
    }>>;
    validateAllocation: (orderId: string, allocations: Allocation[]) => Promise<{
        valid: boolean;
        totalAllocated: number;
        errors: string[];
    }>;
    processAllocationAmendment: (allocationId: string, amendments: Partial<Allocation>, transaction?: Transaction) => Promise<{
        amended: boolean;
        allocationId: string;
    }>;
    generateAllocationReport: (orderId: string, format: string) => Promise<Buffer>;
    autoAllocateFills: (orderId: string, transaction?: Transaction) => Promise<{
        allocated: boolean;
        allocations: Allocation[];
    }>;
    confirmAllocation: (allocationId: string, confirmedBy: string) => Promise<{
        confirmed: boolean;
        confirmationTime: Date;
    }>;
    auditOrderLifecycle: (orderId: string) => Promise<any>;
    validatePreTradeCompliance: (orderData: Partial<Order>) => Promise<{
        compliant: boolean;
        checks: Array<{
            check: string;
            passed: boolean;
            details?: string;
        }>;
    }>;
    validatePostTradeCompliance: (orderId: string) => Promise<{
        compliant: boolean;
        violations: string[];
        warnings: string[];
    }>;
    generateOrderAuditTrail: (orderId: string, includeFIX?: boolean) => Promise<any>;
    exportOrdersForRegulatory: (startDate: Date, endDate: Date, format: string, filters?: any) => Promise<Buffer>;
    detectWashSales: (account: string, startDate: Date, endDate: Date) => Promise<Array<{
        securityId: string;
        buyDate: Date;
        sellDate: Date;
        loss: number;
    }>>;
};
export default _default;
//# sourceMappingURL=trading-order-models-kit.d.ts.map