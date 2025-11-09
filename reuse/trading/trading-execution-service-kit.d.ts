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
import { Transaction } from 'sequelize';
/**
 * Order execution types following FIX Protocol standards
 */
export declare enum OrderType {
    MARKET = "MARKET",
    LIMIT = "LIMIT",
    STOP = "STOP",
    STOP_LIMIT = "STOP_LIMIT",
    MARKET_ON_CLOSE = "MOC",
    LIMIT_ON_CLOSE = "LOC",
    ICEBERG = "ICEBERG",
    PEGGED = "PEGGED",
    TRAILING_STOP = "TRAILING_STOP"
}
export declare enum OrderSide {
    BUY = "BUY",
    SELL = "SELL",
    SELL_SHORT = "SELL_SHORT",
    SELL_SHORT_EXEMPT = "SELL_SHORT_EXEMPT"
}
export declare enum OrderStatus {
    PENDING_NEW = "PENDING_NEW",
    NEW = "NEW",
    PARTIALLY_FILLED = "PARTIALLY_FILLED",
    FILLED = "FILLED",
    PENDING_CANCEL = "PENDING_CANCEL",
    CANCELED = "CANCELED",
    PENDING_REPLACE = "PENDING_REPLACE",
    REPLACED = "REPLACED",
    REJECTED = "REJECTED",
    EXPIRED = "EXPIRED",
    SUSPENDED = "SUSPENDED"
}
export declare enum TimeInForce {
    DAY = "DAY",
    GTC = "GTC",// Good Till Cancel
    IOC = "IOC",// Immediate or Cancel
    FOK = "FOK",// Fill or Kill
    GTD = "GTD",// Good Till Date
    ATO = "ATO",// At the Opening
    ATC = "ATC"
}
export declare enum ExecutionVenue {
    NYSE = "NYSE",
    NASDAQ = "NASDAQ",
    BATS = "BATS",
    IEX = "IEX",
    ARCA = "ARCA",
    DARK_POOL = "DARK_POOL",
    OTC = "OTC",
    INTERNAL = "INTERNAL"
}
export declare enum AlgorithmType {
    TWAP = "TWAP",// Time-Weighted Average Price
    VWAP = "VWAP",// Volume-Weighted Average Price
    POV = "POV",// Percentage of Volume
    IS = "IS",// Implementation Shortfall
    ARRIVAL_PRICE = "ARRIVAL_PRICE",
    TARGET_CLOSE = "TARGET_CLOSE",
    SMART_DARK = "SMART_DARK",
    LIQUIDITY_SEEKING = "LIQUIDITY_SEEKING"
}
export interface OrderRequest {
    orderId: string;
    clientOrderId: string;
    symbol: string;
    side: OrderSide;
    orderType: OrderType;
    quantity: number;
    price?: number;
    stopPrice?: number;
    timeInForce: TimeInForce;
    account: string;
    portfolioId?: string;
    traderId: string;
    desk: string;
    strategy?: string;
    metadata?: Record<string, any>;
}
export interface OrderModification {
    orderId: string;
    newQuantity?: number;
    newPrice?: number;
    newStopPrice?: number;
    newTimeInForce?: TimeInForce;
    modifiedBy: string;
    reason: string;
}
export interface OrderCancellation {
    orderId: string;
    canceledBy: string;
    reason: string;
    timestamp: Date;
}
export interface ExecutionReport {
    executionId: string;
    orderId: string;
    symbol: string;
    side: OrderSide;
    quantity: number;
    executedQuantity: number;
    remainingQuantity: number;
    price: number;
    avgPrice: number;
    venue: ExecutionVenue;
    liquidityFlag: 'ADDED' | 'REMOVED' | 'ROUTED';
    commission: number;
    fees: number;
    timestamp: Date;
    status: OrderStatus;
}
export interface SmartRoutingConfig {
    enableSmartRouting: boolean;
    venues: ExecutionVenue[];
    venueWeights?: Map<ExecutionVenue, number>;
    routingStrategy: 'BEST_PRICE' | 'BEST_LIQUIDITY' | 'MINIMIZE_IMPACT' | 'CUSTOM';
    maxVenueLatency: number;
    enableDarkPools: boolean;
    minDisplaySize?: number;
    postOnly?: boolean;
    aggressiveness: number;
}
export interface AlgorithmicOrderParams {
    algorithm: AlgorithmType;
    startTime: Date;
    endTime: Date;
    participationRate?: number;
    maxParticipationRate?: number;
    minParticipationRate?: number;
    urgency?: number;
    riskAversion?: number;
    targetPrice?: number;
    priceLimit?: number;
    volumeCurve?: 'FLAT' | 'VOLUME_PROFILE' | 'CUSTOM';
    customCurve?: number[];
    allowShortfall?: boolean;
    darkPoolAllocation?: number;
    displaySize?: number;
    minFillSize?: number;
}
export interface PreTradeComplianceCheck {
    checkId: string;
    orderId: string;
    passed: boolean;
    checks: ComplianceCheckResult[];
    timestamp: Date;
    reviewedBy?: string;
}
export interface ComplianceCheckResult {
    checkName: string;
    checkType: 'LIMIT' | 'RESTRICTION' | 'VALIDATION' | 'WARNING';
    passed: boolean;
    message: string;
    severity: 'ERROR' | 'WARNING' | 'INFO';
    value?: any;
    threshold?: any;
}
export interface BestExecutionReport {
    reportId: string;
    orderId: string;
    symbol: string;
    side: OrderSide;
    quantity: number;
    avgExecutionPrice: number;
    benchmarkPrice: number;
    priceImprovement: number;
    slippage: number;
    effectiveSpread: number;
    realizationShortfall: number;
    venueBreakdown: VenueExecutionStats[];
    timestamp: Date;
    complianceScore: number;
}
export interface VenueExecutionStats {
    venue: ExecutionVenue;
    quantity: number;
    avgPrice: number;
    fillRate: number;
    rejectRate: number;
    avgLatency: number;
    effectiveSpread: number;
}
export interface TradeAllocation {
    allocationId: string;
    orderId: string;
    executionId: string;
    allocations: AccountAllocation[];
    allocationMethod: 'PRO_RATA' | 'FIFO' | 'MANUAL' | 'AVERAGE_PRICE';
    status: 'PENDING' | 'ALLOCATED' | 'AFFIRMED' | 'SETTLED';
    timestamp: Date;
}
export interface AccountAllocation {
    accountId: string;
    accountName: string;
    quantity: number;
    price: number;
    commission: number;
    netAmount: number;
}
export interface SettlementInstruction {
    settlementId: string;
    tradeId: string;
    settlementDate: Date;
    currency: string;
    grossAmount: number;
    netAmount: number;
    fees: number;
    taxes: number;
    custodian?: string;
    clearingBroker?: string;
    status: 'PENDING' | 'MATCHED' | 'AFFIRMED' | 'SETTLED' | 'FAILED';
}
export interface ExecutionQualityMetrics {
    symbol: string;
    period: {
        start: Date;
        end: Date;
    };
    totalOrders: number;
    fillRate: number;
    avgFillTime: number;
    avgSlippage: number;
    avgPriceImprovement: number;
    effectiveSpread: number;
    realizationShortfall: number;
    venueStats: Map<ExecutionVenue, VenueExecutionStats>;
    complianceScore: number;
}
export interface OrderBookSnapshot {
    symbol: string;
    venue: ExecutionVenue;
    bids: PriceLevel[];
    asks: PriceLevel[];
    timestamp: Date;
    sequenceNumber: number;
}
export interface PriceLevel {
    price: number;
    quantity: number;
    numberOfOrders: number;
}
export interface MarketImpactEstimate {
    symbol: string;
    side: OrderSide;
    quantity: number;
    estimatedImpact: number;
    estimatedSlippage: number;
    estimatedCost: number;
    confidence: number;
    methodology: 'HISTORICAL' | 'SPREAD' | 'VOLUME' | 'ML_MODEL';
}
export interface DMAConnectionConfig {
    connectionId: string;
    venue: ExecutionVenue;
    protocol: 'FIX_4.4' | 'FIX_5.0' | 'OUCH' | 'PROPRIETARY';
    host: string;
    port: number;
    senderCompId: string;
    targetCompId: string;
    username?: string;
    password?: string;
    enableHeartbeat: boolean;
    heartbeatInterval: number;
    reconnectAttempts: number;
    enableEncryption: boolean;
}
/**
 * Place a new order with comprehensive validation and compliance checks
 */
export declare function placeOrder(orderRequest: OrderRequest, complianceService: any, dbTransaction?: Transaction): Promise<{
    orderId: string;
    status: OrderStatus;
    message: string;
}>;
/**
 * Place a basket order (multiple orders as a single transaction)
 */
export declare function placeBasketOrder(orders: OrderRequest[], basketConfig: {
    basketId: string;
    allOrNone: boolean;
    strategy?: string;
}, complianceService: any, dbTransaction?: Transaction): Promise<{
    basketId: string;
    orders: Array<{
        orderId: string;
        status: OrderStatus;
    }>;
}>;
/**
 * Place an algorithmic order with specified strategy
 */
export declare function placeAlgorithmicOrder(baseOrder: OrderRequest, algoParams: AlgorithmicOrderParams, complianceService: any): Promise<{
    orderId: string;
    algoId: string;
    status: string;
}>;
/**
 * Place order with direct market access (DMA)
 */
export declare function placeDMAOrder(orderRequest: OrderRequest, venue: ExecutionVenue, dmaConfig: DMAConnectionConfig): Promise<{
    orderId: string;
    venueOrderId: string;
    status: OrderStatus;
}>;
/**
 * Modify an existing order
 */
export declare function modifyOrder(modification: OrderModification, dbTransaction?: Transaction): Promise<{
    orderId: string;
    status: OrderStatus;
    message: string;
}>;
/**
 * Cancel an order
 */
export declare function cancelOrder(orderId: string, canceledBy: string, reason: string, dbTransaction?: Transaction): Promise<{
    orderId: string;
    status: OrderStatus;
    message: string;
}>;
/**
 * Cancel all orders for a symbol
 */
export declare function cancelAllOrders(symbol: string, canceledBy: string, reason: string): Promise<{
    canceledCount: number;
    failedCount: number;
    orders: string[];
}>;
/**
 * Replace order (cancel and re-submit)
 */
export declare function replaceOrder(orderId: string, newOrderRequest: OrderRequest, complianceService: any): Promise<{
    oldOrderId: string;
    newOrderId: string;
    status: string;
}>;
/**
 * Route order using smart order routing algorithm
 */
export declare function smartRouteOrder(order: OrderRequest, routingConfig: SmartRoutingConfig): Promise<{
    routes: VenueRoute[];
    primaryVenue: ExecutionVenue;
}>;
export interface VenueRoute {
    venue: ExecutionVenue;
    quantity: number;
    expectedPrice: number;
    priority: number;
    latency: number;
}
/**
 * Execute smart routed order across multiple venues
 */
export declare function executeSmartRoutedOrder(order: OrderRequest, routes: VenueRoute[]): Promise<{
    executionReports: ExecutionReport[];
    totalFilled: number;
}>;
/**
 * Calculate best execution venue based on current market conditions
 */
export declare function calculateBestVenue(symbol: string, side: OrderSide, quantity: number, venueQuotes: Map<ExecutionVenue, OrderBookSnapshot>): {
    venue: ExecutionVenue;
    expectedPrice: number;
    confidence: number;
};
/**
 * Optimize order routing based on historical venue performance
 */
export declare function optimizeRoutingStrategy(symbol: string, orderSize: number, historicalData: ExecutionQualityMetrics[]): Promise<SmartRoutingConfig>;
/**
 * Execute TWAP (Time-Weighted Average Price) algorithm
 */
export declare function executeTWAP(order: OrderRequest, params: AlgorithmicOrderParams): Promise<{
    algoId: string;
    slices: OrderSlice[];
}>;
export interface OrderSlice {
    sliceId: string;
    quantity: number;
    scheduledTime: Date;
    executedQuantity?: number;
    avgPrice?: number;
    status: 'PENDING' | 'ACTIVE' | 'FILLED' | 'CANCELED';
}
/**
 * Execute VWAP (Volume-Weighted Average Price) algorithm
 */
export declare function executeVWAP(order: OrderRequest, params: AlgorithmicOrderParams, historicalVolume: number[]): Promise<{
    algoId: string;
    slices: OrderSlice[];
}>;
/**
 * Execute POV (Percentage of Volume) algorithm
 */
export declare function executePOV(order: OrderRequest, params: AlgorithmicOrderParams): Promise<{
    algoId: string;
    participationRate: number;
}>;
/**
 * Execute Implementation Shortfall algorithm
 */
export declare function executeImplementationShortfall(order: OrderRequest, params: AlgorithmicOrderParams, marketData: any): Promise<{
    algoId: string;
    strategy: string;
}>;
/**
 * Monitor and adjust algorithmic execution in real-time
 */
export declare function monitorAlgorithmicExecution(algoId: string): Promise<{
    algoId: string;
    progress: number;
    performance: AlgorithmPerformance;
    recommendations: string[];
}>;
export interface AlgorithmPerformance {
    filledQuantity: number;
    avgPrice: number;
    benchmarkPrice: number;
    slippage: number;
    fillRate: number;
    participationRate?: number;
    marketImpact: number;
}
/**
 * Perform comprehensive pre-trade compliance checks
 */
export declare function performPreTradeCompliance(order: OrderRequest, complianceService: any): Promise<PreTradeComplianceCheck>;
/**
 * Check position limits
 */
export declare function checkPositionLimits(order: OrderRequest): Promise<ComplianceCheckResult>;
/**
 * Check trading limits (order size, value, etc.)
 */
export declare function checkTradingLimits(order: OrderRequest): Promise<ComplianceCheckResult>;
/**
 * Check if security is restricted
 */
export declare function checkRestrictedSecurities(order: OrderRequest): Promise<ComplianceCheckResult>;
/**
 * Check concentration limits
 */
export declare function checkConcentrationLimits(order: OrderRequest): Promise<ComplianceCheckResult>;
/**
 * Check regulatory restrictions (Reg T, Pattern Day Trader, etc.)
 */
export declare function checkRegulatoryRestrictions(order: OrderRequest): Promise<ComplianceCheckResult>;
/**
 * Check short sale restrictions (Reg SHO, locate requirements)
 */
export declare function checkShortSaleRestrictions(order: OrderRequest): Promise<ComplianceCheckResult>;
/**
 * Check market hours and trading halts
 */
export declare function checkMarketHours(order: OrderRequest): ComplianceCheckResult;
/**
 * Process execution report and update order status
 */
export declare function processExecutionReport(executionReport: ExecutionReport, dbTransaction?: Transaction): Promise<void>;
/**
 * Allocate trade to multiple accounts
 */
export declare function allocateTrade(executionId: string, allocations: AccountAllocation[], method: 'PRO_RATA' | 'FIFO' | 'MANUAL' | 'AVERAGE_PRICE'): Promise<TradeAllocation>;
/**
 * Generate settlement instructions
 */
export declare function generateSettlementInstructions(tradeId: string): Promise<SettlementInstruction>;
/**
 * Analyze execution quality for an order
 */
export declare function analyzeExecutionQuality(orderId: string): Promise<BestExecutionReport>;
/**
 * Generate best execution report for regulatory compliance
 */
export declare function generateBestExecutionReport(period: {
    start: Date;
    end: Date;
}, filters?: {
    symbols?: string[];
    accounts?: string[];
    desks?: string[];
}): Promise<{
    reportId: string;
    period: {
        start: Date;
        end: Date;
    };
    summary: ExecutionQualitySummary;
    orderReports: BestExecutionReport[];
}>;
export interface ExecutionQualitySummary {
    totalOrders: number;
    totalVolume: number;
    avgSlippage: number;
    avgPriceImprovement: number;
    avgFillRate: number;
    avgComplianceScore: number;
    venueStats: VenueExecutionStats[];
}
/**
 * Calculate market impact of an order
 */
export declare function estimateMarketImpact(symbol: string, side: OrderSide, quantity: number, historicalData: any[]): Promise<MarketImpactEstimate>;
declare const _default: {
    placeOrder: typeof placeOrder;
    placeBasketOrder: typeof placeBasketOrder;
    placeAlgorithmicOrder: typeof placeAlgorithmicOrder;
    placeDMAOrder: typeof placeDMAOrder;
    modifyOrder: typeof modifyOrder;
    cancelOrder: typeof cancelOrder;
    cancelAllOrders: typeof cancelAllOrders;
    replaceOrder: typeof replaceOrder;
    smartRouteOrder: typeof smartRouteOrder;
    executeSmartRoutedOrder: typeof executeSmartRoutedOrder;
    calculateBestVenue: typeof calculateBestVenue;
    optimizeRoutingStrategy: typeof optimizeRoutingStrategy;
    executeTWAP: typeof executeTWAP;
    executeVWAP: typeof executeVWAP;
    executePOV: typeof executePOV;
    executeImplementationShortfall: typeof executeImplementationShortfall;
    monitorAlgorithmicExecution: typeof monitorAlgorithmicExecution;
    performPreTradeCompliance: typeof performPreTradeCompliance;
    checkPositionLimits: typeof checkPositionLimits;
    checkTradingLimits: typeof checkTradingLimits;
    checkRestrictedSecurities: typeof checkRestrictedSecurities;
    checkConcentrationLimits: typeof checkConcentrationLimits;
    checkRegulatoryRestrictions: typeof checkRegulatoryRestrictions;
    checkShortSaleRestrictions: typeof checkShortSaleRestrictions;
    checkMarketHours: typeof checkMarketHours;
    processExecutionReport: typeof processExecutionReport;
    allocateTrade: typeof allocateTrade;
    generateSettlementInstructions: typeof generateSettlementInstructions;
    analyzeExecutionQuality: typeof analyzeExecutionQuality;
    generateBestExecutionReport: typeof generateBestExecutionReport;
    estimateMarketImpact: typeof estimateMarketImpact;
};
export default _default;
//# sourceMappingURL=trading-execution-service-kit.d.ts.map