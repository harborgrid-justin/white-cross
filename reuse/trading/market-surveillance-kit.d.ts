/**
 * LOC: TRDSURVL0001234
 * File: /reuse/trading/market-surveillance-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (Model, DataTypes, Transaction, Op)
 *   - ../error-handling-kit.ts (exception classes, error handling)
 *   - ../validation-kit.ts (validation utilities)
 *   - ../audit-compliance-kit.ts (audit trail functions)
 *
 * DOWNSTREAM (imported by):
 *   - backend/trading/*
 *   - backend/compliance/*
 *   - backend/surveillance/*
 *   - backend/controllers/surveillance.controller.ts
 *   - backend/services/surveillance.service.ts
 *   - backend/services/compliance.service.ts
 */
/**
 * File: /reuse/trading/market-surveillance-kit.ts
 * Locator: WC-TRD-SURVL-001
 * Purpose: Bloomberg Terminal-level Market Surveillance - manipulation detection, insider trading monitoring, regulatory compliance, alert generation
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, error-handling-kit, validation-kit, audit-compliance-kit
 * Downstream: Trading controllers, compliance services, surveillance processors, regulatory reporting systems
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+
 * Exports: 49 production-ready functions for market surveillance, manipulation detection, insider trading monitoring, regulatory compliance
 *
 * LLM Context: Enterprise-grade market surveillance utilities competing with Bloomberg Terminal.
 * Provides comprehensive surveillance capabilities including market manipulation detection (layering, spoofing,
 * wash trading, pump and dump), insider trading pattern monitoring, front-running detection, quote stuffing
 * monitoring, best execution monitoring, regulatory compliance (MAR, EMIR, SEC, FINRA, MiFID II), alert
 * generation and case management, surveillance dashboards, and multi-jurisdiction regulatory reporting.
 */
import { Transaction } from 'sequelize';
/**
 * Regulatory jurisdiction enumeration
 */
export declare enum RegulatoryJurisdiction {
    SEC = "SEC",// U.S. Securities and Exchange Commission
    FINRA = "FINRA",// Financial Industry Regulatory Authority
    FCA = "FCA",// UK Financial Conduct Authority
    ESMA = "ESMA",// European Securities and Markets Authority
    MAS = "MAS",// Monetary Authority of Singapore
    ASIC = "ASIC",// Australian Securities and Investments Commission
    HKMA = "HKMA",// Hong Kong Monetary Authority
    CFTC = "CFTC",// Commodity Futures Trading Commission
    FSA = "FSA"
}
/**
 * Market manipulation type enumeration
 */
export declare enum MarketManipulationType {
    LAYERING = "LAYERING",// Placing orders to create false impression
    SPOOFING = "SPOOFING",// Placing orders with intent to cancel
    WASH_TRADING = "WASH_TRADING",// Trading with self or related parties
    PUMP_AND_DUMP = "PUMP_AND_DUMP",// Artificial price inflation then selling
    PAINTING_THE_TAPE = "PAINTING_THE_TAPE",// Creating false trading activity
    MARKING_THE_CLOSE = "MARKING_THE_CLOSE",// Manipulating closing price
    QUOTE_STUFFING = "QUOTE_STUFFING",// Flooding market with quotes
    CORNERING = "CORNERING",// Controlling supply to manipulate price
    RAMPING = "RAMPING",// Artificially inflating price
    CIRCULAR_TRADING = "CIRCULAR_TRADING",// Trading among related parties
    FRONT_RUNNING = "FRONT_RUNNING",// Trading ahead of client orders
    CHURNING = "CHURNING"
}
/**
 * Alert severity enumeration
 */
export declare enum AlertSeverity {
    CRITICAL = "CRITICAL",// Immediate action required
    HIGH = "HIGH",// Urgent investigation needed
    MEDIUM = "MEDIUM",// Standard investigation
    LOW = "LOW",// Monitor
    INFO = "INFO"
}
/**
 * Alert status enumeration
 */
export declare enum AlertStatus {
    NEW = "NEW",
    ASSIGNED = "ASSIGNED",
    INVESTIGATING = "INVESTIGATING",
    ESCALATED = "ESCALATED",
    RESOLVED = "RESOLVED",
    FALSE_POSITIVE = "FALSE_POSITIVE",
    REPORTED = "REPORTED",
    CLOSED = "CLOSED"
}
/**
 * Trade surveillance alert interface
 */
export interface TradeSurveillanceAlert {
    alertId: string;
    alertType: MarketManipulationType | 'INSIDER_TRADING' | 'BEST_EXECUTION_BREACH' | 'ANOMALY';
    severity: AlertSeverity;
    status: AlertStatus;
    detectedAt: Date;
    securityId: string;
    isin?: string;
    ticker?: string;
    traderId?: string;
    accountId?: string;
    firmId?: string;
    matchScore: number;
    description: string;
    evidenceData: EvidenceData;
    relatedTrades: string[];
    relatedOrders: string[];
    jurisdiction: RegulatoryJurisdiction[];
    assignedTo?: string;
    investigationNotes?: InvestigationNote[];
    regulatoryReporting?: RegulatoryReport[];
    metadata: AlertMetadata;
}
/**
 * Evidence data for alerts
 */
export interface EvidenceData {
    dataPoints: Array<{
        timestamp: Date;
        dataType: string;
        value: any;
        significance: string;
    }>;
    patterns: PatternMatch[];
    anomalyScore: number;
    historicalComparison: {
        averageValue: number;
        currentValue: number;
        standardDeviations: number;
    };
    relatedEntities: string[];
    visualizationData?: any;
}
/**
 * Pattern match information
 */
export interface PatternMatch {
    patternType: string;
    confidence: number;
    matchedRules: string[];
    timeWindow: {
        start: Date;
        end: Date;
    };
    affectedSecurities: string[];
    affectedAccounts: string[];
}
/**
 * Investigation note
 */
export interface InvestigationNote {
    noteId: string;
    timestamp: Date;
    author: string;
    content: string;
    noteType: 'investigation' | 'escalation' | 'resolution' | 'comment';
    attachments?: string[];
}
/**
 * Regulatory report
 */
export interface RegulatoryReport {
    reportId: string;
    jurisdiction: RegulatoryJurisdiction;
    reportType: 'SAR' | 'STR' | 'MAR' | 'EMIR' | 'CAT' | 'MIFID_II';
    reportStatus: 'draft' | 'submitted' | 'acknowledged' | 'rejected';
    submittedAt?: Date;
    submittedBy?: string;
    acknowledgmentId?: string;
    reportContent: any;
}
/**
 * Alert metadata
 */
export interface AlertMetadata {
    createdBy: string;
    createdAt: Date;
    updatedBy?: string;
    updatedAt?: Date;
    version: number;
    automationScore: number;
    falsePositiveHistory: number;
}
/**
 * Insider trading pattern interface
 */
export interface InsiderTradingPattern {
    patternId: string;
    traderId: string;
    accountId: string;
    detectedAt: Date;
    patternType: 'pre_announcement_trading' | 'unusual_timing' | 'material_non_public_info';
    securityId: string;
    materialEvents: MaterialEvent[];
    suspiciousTrades: SuspiciousTrade[];
    timingAnalysis: {
        averageDaysBeforeEvent: number;
        tradingWindowStart: Date;
        tradingWindowEnd: Date;
        eventDate: Date;
    };
    profitAnalysis: {
        unrealizedProfit: number;
        realizedProfit: number;
        returnOnInvestment: number;
    };
    riskScore: number;
}
/**
 * Material event information
 */
export interface MaterialEvent {
    eventId: string;
    eventType: 'earnings' | 'merger' | 'acquisition' | 'dividend' | 'regulatory' | 'lawsuit' | 'product_launch';
    eventDate: Date;
    announcementDate: Date;
    priceImpact: number;
    volumeImpact: number;
    isPublic: boolean;
    insiderAccessList?: string[];
}
/**
 * Suspicious trade information
 */
export interface SuspiciousTrade {
    tradeId: string;
    orderId: string;
    traderId: string;
    accountId: string;
    timestamp: Date;
    side: 'buy' | 'sell';
    quantity: number;
    price: number;
    value: number;
    suspicionReasons: string[];
    timingScore: number;
    sizeScore: number;
    behaviorScore: number;
}
/**
 * Front-running detection result
 */
export interface FrontRunningDetection {
    detectionId: string;
    detectedAt: Date;
    suspectTraderId: string;
    suspectAccountId: string;
    clientOrderId: string;
    clientAccountId: string;
    frontRunningTrades: string[];
    timeAdvantage: number;
    profitEstimate: number;
    evidenceStrength: 'weak' | 'moderate' | 'strong';
    pattern: 'consistent' | 'isolated';
}
/**
 * Wash trade identification result
 */
export interface WashTradeIdentification {
    identificationId: string;
    detectedAt: Date;
    relatedAccounts: string[];
    relatedTrades: string[];
    matchingCriteria: {
        priceMatch: boolean;
        quantityMatch: boolean;
        timingMatch: boolean;
        economicPurposeAbsent: boolean;
    };
    circularPattern: boolean;
    netEconomicImpact: number;
    suspicionScore: number;
}
/**
 * Layering and spoofing detection
 */
export interface LayeringDetection {
    detectionId: string;
    detectedAt: Date;
    traderId: string;
    accountId: string;
    securityId: string;
    detectionType: 'layering' | 'spoofing';
    orderPattern: OrderPatternAnalysis;
    cancellationRate: number;
    executionRate: number;
    priceImpact: number;
    durationSeconds: number;
    confidenceScore: number;
}
/**
 * Order pattern analysis
 */
export interface OrderPatternAnalysis {
    totalOrders: number;
    cancelledOrders: number;
    executedOrders: number;
    averageOrderSize: number;
    averageTimeToCancel: number;
    priceLevels: number;
    sidedness: 'one_sided' | 'two_sided';
    progression: 'toward_market' | 'away_from_market';
}
/**
 * Quote stuffing monitoring result
 */
export interface QuoteStuffingDetection {
    detectionId: string;
    detectedAt: Date;
    traderId: string;
    accountId: string;
    securityId: string;
    timeWindow: {
        start: Date;
        end: Date;
    };
    quoteRate: number;
    cancelRate: number;
    executionRate: number;
    marketImpact: {
        latencyIncrease: number;
        spreadWidening: number;
        orderBookDepthReduction: number;
    };
    severity: AlertSeverity;
}
/**
 * Best execution metrics
 */
export interface BestExecutionMetrics {
    metricId: string;
    calculatedAt: Date;
    orderId: string;
    accountId: string;
    securityId: string;
    executionPrice: number;
    benchmarkPrice: number;
    priceImprovement: number;
    executionVenue: string;
    alternativeVenues: Array<{
        venue: string;
        price: number;
        liquidity: number;
    }>;
    executionQuality: 'excellent' | 'good' | 'acceptable' | 'poor';
    complianceStatus: 'compliant' | 'marginal' | 'breach';
}
/**
 * Surveillance metrics dashboard data
 */
export interface SurveillanceMetrics {
    metricsId: string;
    generatedAt: Date;
    timeWindow: {
        start: Date;
        end: Date;
    };
    alertMetrics: {
        totalAlerts: number;
        newAlerts: number;
        investigatingAlerts: number;
        resolvedAlerts: number;
        falsePositives: number;
        truePositives: number;
        reportedAlerts: number;
        alertsByType: Record<string, number>;
        alertsBySeverity: Record<AlertSeverity, number>;
    };
    tradeMetrics: {
        totalTrades: number;
        flaggedTrades: number;
        suspiciousTradeRate: number;
        averageInvestigationTime: number;
    };
    performanceMetrics: {
        detectionLatency: number;
        falsePositiveRate: number;
        truePositiveRate: number;
        coverageRate: number;
    };
    topRisks: Array<{
        riskType: string;
        count: number;
        trend: 'increasing' | 'stable' | 'decreasing';
    }>;
}
/**
 * Surveillance configuration
 */
export interface SurveillanceConfig {
    configId: string;
    jurisdiction: RegulatoryJurisdiction;
    enabledDetections: MarketManipulationType[];
    thresholds: {
        layering: {
            minOrders: number;
            minCancellationRate: number;
            maxTimeWindow: number;
        };
        spoofing: {
            minOrderSize: number;
            minCancellationRate: number;
            maxTimeToCancel: number;
        };
        washTrading: {
            maxTimeDifference: number;
            minTradeCount: number;
            priceTolerance: number;
        };
        quoteStuffing: {
            minQuoteRate: number;
            minCancelRate: number;
            timeWindow: number;
        };
        insiderTrading: {
            maxDaysBeforeEvent: number;
            minProfitThreshold: number;
            minTimingScore: number;
        };
    };
    autoEscalation: {
        enabled: boolean;
        criticalAlertThreshold: number;
        escalationRecipients: string[];
    };
}
/**
 * Case management information
 */
export interface SurveillanceCase {
    caseId: string;
    alerts: string[];
    status: 'open' | 'investigating' | 'pending_approval' | 'closed';
    priority: 'critical' | 'high' | 'medium' | 'low';
    assignedTo: string;
    assignedTeam: string;
    openedAt: Date;
    closedAt?: Date;
    investigationSummary?: string;
    resolution: 'no_violation' | 'violation_confirmed' | 'reported_to_regulator' | 'enforcement_action';
    relatedCases?: string[];
    estimatedImpact: {
        financialImpact: number;
        marketImpact: string;
        reputationalRisk: string;
    };
}
/**
 * Detects layering patterns in order flow
 *
 * @param orders - Orders to analyze
 * @param config - Detection configuration
 * @returns Layering detection results
 * @throws {ValidationError} If orders data is invalid
 *
 * @example
 * const layering = await detectLayering(orders, config);
 * if (layering.length > 0) {
 *   console.log('Layering detected:', layering);
 * }
 */
export declare function detectLayering(orders: any[], config: SurveillanceConfig, transaction?: Transaction): Promise<LayeringDetection[]>;
/**
 * Detects spoofing behavior in trading activity
 *
 * @param orders - Orders to analyze
 * @param config - Detection configuration
 * @returns Spoofing detection results
 *
 * @example
 * const spoofing = await detectSpoofing(orders, config);
 */
export declare function detectSpoofing(orders: any[], config: SurveillanceConfig, transaction?: Transaction): Promise<LayeringDetection[]>;
/**
 * Identifies wash trading patterns
 *
 * @param trades - Trades to analyze
 * @param config - Detection configuration
 * @returns Wash trade identifications
 *
 * @example
 * const washTrades = await detectWashTrading(trades, config);
 */
export declare function detectWashTrading(trades: any[], config: SurveillanceConfig, transaction?: Transaction): Promise<WashTradeIdentification[]>;
/**
 * Detects pump and dump schemes
 *
 * @param trades - Trade data
 * @param marketData - Market data for analysis
 * @returns Detection results
 *
 * @example
 * const pumpDump = await detectPumpAndDump(trades, marketData);
 */
export declare function detectPumpAndDump(trades: any[], marketData: any, transaction?: Transaction): Promise<TradeSurveillanceAlert[]>;
/**
 * Detects painting the tape manipulation
 *
 * @param trades - Trade data
 * @returns Detection results
 *
 * @example
 * const painting = detectPaintingTheTape(trades);
 */
export declare function detectPaintingTheTape(trades: any[]): TradeSurveillanceAlert[];
/**
 * Detects marking the close manipulation
 *
 * @param trades - Trade data
 * @param marketClose - Market close time
 * @returns Detection results
 *
 * @example
 * const marking = detectMarkingTheClose(trades, new Date());
 */
export declare function detectMarkingTheClose(trades: any[], marketClose: Date): TradeSurveillanceAlert[];
/**
 * Detects quote stuffing behavior
 *
 * @param quotes - Quote data
 * @param config - Detection configuration
 * @returns Detection results
 *
 * @example
 * const stuffing = await detectQuoteStuffing(quotes, config);
 */
export declare function detectQuoteStuffing(quotes: any[], config: SurveillanceConfig, transaction?: Transaction): Promise<QuoteStuffingDetection[]>;
/**
 * Detects market cornering attempts
 *
 * @param positions - Position data
 * @param marketData - Market data
 * @returns Detection results
 *
 * @example
 * const cornering = detectCornering(positions, marketData);
 */
export declare function detectCornering(positions: any[], marketData: any): TradeSurveillanceAlert[];
/**
 * Detects price ramping manipulation
 *
 * @param trades - Trade data
 * @param marketData - Market data
 * @returns Detection results
 *
 * @example
 * const ramping = detectRampingPrices(trades, marketData);
 */
export declare function detectRampingPrices(trades: any[], marketData: any): TradeSurveillanceAlert[];
/**
 * Detects circular trading patterns
 *
 * @param trades - Trade data
 * @returns Detection results
 *
 * @example
 * const circular = detectCircularTrading(trades);
 */
export declare function detectCircularTrading(trades: any[]): TradeSurveillanceAlert[];
/**
 * Detects crossing at bid/ask manipulation
 *
 * @param trades - Trade data
 * @param orderBook - Order book data
 * @returns Detection results
 *
 * @example
 * const crossing = detectCrossingAtBidAsk(trades, orderBook);
 */
export declare function detectCrossingAtBidAsk(trades: any[], orderBook: any): TradeSurveillanceAlert[];
/**
 * Calculates manipulation probability score
 *
 * @param alert - Alert to score
 * @param historicalData - Historical pattern data
 * @returns Manipulation score (0-100)
 *
 * @example
 * const score = calculateManipulationScore(alert, historicalData);
 */
export declare function calculateManipulationScore(alert: TradeSurveillanceAlert, historicalData: any): number;
/**
 * Detects insider trading patterns
 *
 * @param trades - Trade data
 * @param materialEvents - Material event data
 * @param config - Detection configuration
 * @returns Insider trading patterns
 *
 * @example
 * const patterns = await detectInsiderTradingPattern(trades, events, config);
 */
export declare function detectInsiderTradingPattern(trades: any[], materialEvents: MaterialEvent[], config: SurveillanceConfig, transaction?: Transaction): Promise<InsiderTradingPattern[]>;
/**
 * Analyzes trade timing anomalies
 *
 * @param trade - Trade to analyze
 * @param traderHistory - Historical trading data
 * @returns Timing anomaly analysis
 *
 * @example
 * const anomaly = analyzeTradeTimingAnomaly(trade, history);
 */
export declare function analyzeTradeTimingAnomaly(trade: any, traderHistory: any): {
    isAnomalous: boolean;
    score: number;
    reasons: string[];
};
/**
 * Monitors trading around material events
 *
 * @param trades - Trade data
 * @param events - Material events
 * @returns Event-related trading analysis
 *
 * @example
 * const analysis = monitorMaterialEventTrading(trades, events);
 */
export declare function monitorMaterialEventTrading(trades: any[], events: MaterialEvent[]): Array<{
    eventId: string;
    tradesBeforeEvent: number;
    tradesAfterEvent: number;
    suspiciousTraders: string[];
}>;
/**
 * Detects front-running behavior
 *
 * @param traderTrades - Suspected front-runner trades
 * @param clientOrders - Client order data
 * @returns Front-running detections
 *
 * @example
 * const frontRunning = detectFrontRunning(traderTrades, clientOrders);
 */
export declare function detectFrontRunning(traderTrades: any[], clientOrders: any[]): FrontRunningDetection[];
/**
 * Analyzes broker-dealer trading activity
 *
 * @param brokerTrades - Broker-dealer trades
 * @param clientTrades - Client trades
 * @returns Analysis results
 *
 * @example
 * const analysis = analyzeBrokerDealerActivity(brokerTrades, clientTrades);
 */
export declare function analyzeBrokerDealerActivity(brokerTrades: any[], clientTrades: any[]): {
    suspiciousPatterns: number;
    conflicts: any[];
    riskScore: number;
};
/**
 * Tracks restricted list violations
 *
 * @param trades - Trade data
 * @param restrictedList - Restricted securities list
 * @returns Violations found
 *
 * @example
 * const violations = trackRestrictedListViolations(trades, restrictedList);
 */
export declare function trackRestrictedListViolations(trades: any[], restrictedList: Array<{
    securityId: string;
    restrictedFor: string[];
    reason: string;
}>): Array<{
    tradeId: string;
    securityId: string;
    traderId: string;
    violation: string;
}>;
/**
 * Correlates news events with trading activity
 *
 * @param trades - Trade data
 * @param newsEvents - News event data
 * @returns Correlation analysis
 *
 * @example
 * const correlation = correlateNewsToTrades(trades, newsEvents);
 */
export declare function correlateNewsToTrades(trades: any[], newsEvents: Array<{
    timestamp: Date;
    securityId: string;
    sentiment: 'positive' | 'negative' | 'neutral';
    impact: 'high' | 'medium' | 'low';
}>): Array<{
    newsEventId: string;
    correlatedTrades: any[];
    timeToFirstTrade: number;
    suspicionLevel: string;
}>;
/**
 * Generates insider trading alert
 *
 * @param pattern - Insider trading pattern
 * @returns Generated alert
 *
 * @example
 * const alert = generateInsiderAlert(pattern);
 */
export declare function generateInsiderAlert(pattern: InsiderTradingPattern): TradeSurveillanceAlert;
/**
 * Identifies unusual volume patterns
 *
 * @param trades - Trade data
 * @param historicalData - Historical volume data
 * @returns Volume anomalies
 *
 * @example
 * const anomalies = identifyUnusualVolume(trades, historicalData);
 */
export declare function identifyUnusualVolume(trades: any[], historicalData: any): Array<{
    securityId: string;
    volume: number;
    averageVolume: number;
    standardDeviations: number;
    anomalyScore: number;
}>;
/**
 * Detects price manipulation patterns
 *
 * @param trades - Trade data
 * @param marketData - Market data
 * @returns Price manipulation detections
 *
 * @example
 * const manipulation = detectPriceManipulation(trades, marketData);
 */
export declare function detectPriceManipulation(trades: any[], marketData: any): TradeSurveillanceAlert[];
/**
 * Analyzes order book imbalances
 *
 * @param orderBook - Order book data
 * @param threshold - Imbalance threshold
 * @returns Imbalance analysis
 *
 * @example
 * const imbalance = analyzeOrderBookImbalance(orderBook, 0.3);
 */
export declare function analyzeOrderBookImbalance(orderBook: any, threshold?: number): {
    imbalanced: boolean;
    buyVolume: number;
    sellVolume: number;
    imbalanceRatio: number;
    side: 'buy' | 'sell';
};
/**
 * Detects abnormal spread patterns
 *
 * @param quotes - Quote data
 * @param historicalData - Historical spread data
 * @returns Spread anomalies
 *
 * @example
 * const spreadAnomalies = detectAbnormalSpread(quotes, historicalData);
 */
export declare function detectAbnormalSpread(quotes: any[], historicalData: any): Array<{
    timestamp: Date;
    spread: number;
    averageSpread: number;
    spreadWidening: number;
}>;
/**
 * Monitors rapid order cancellation
 *
 * @param orders - Order data
 * @param threshold - Cancellation rate threshold
 * @returns Cancellation analysis
 *
 * @example
 * const cancellation = monitorRapidCancellation(orders, 0.8);
 */
export declare function monitorRapidCancellation(orders: any[], threshold?: number): Array<{
    traderId: string;
    totalOrders: number;
    cancelledOrders: number;
    cancellationRate: number;
    avgTimeToCancel: number;
}>;
/**
 * Analyzes trade concentration
 *
 * @param trades - Trade data
 * @returns Concentration analysis
 *
 * @example
 * const concentration = analyzeTradeConcentration(trades);
 */
export declare function analyzeTradeConcentration(trades: any[]): {
    herfindahlIndex: number;
    topTraders: any[];
    concentrationRisk: string;
};
/**
 * Detects account linking patterns
 *
 * @param trades - Trade data
 * @param accounts - Account relationship data
 * @returns Linked account detection
 *
 * @example
 * const linked = detectAccountLinking(trades, accounts);
 */
export declare function detectAccountLinking(trades: any[], accounts: any[]): Array<{
    accountGroup: string[];
    tradingPattern: string;
    linkageStrength: number;
}>;
/**
 * Monitors cross-market manipulation
 *
 * @param trades - Multi-market trade data
 * @returns Cross-market analysis
 *
 * @example
 * const crossMarket = monitorCrossMarketManipulation(trades);
 */
export declare function monitorCrossMarketManipulation(trades: any[]): Array<{
    securityId: string;
    markets: string[];
    priceDiscrepancy: number;
    suspicionScore: number;
}>;
/**
 * Analyzes trading pattern similarity
 *
 * @param trades1 - First set of trades
 * @param trades2 - Second set of trades
 * @returns Similarity score (0-1)
 *
 * @example
 * const similarity = analyzeTradingPatternSimilarity(trades1, trades2);
 */
export declare function analyzeTradingPatternSimilarity(trades1: any[], trades2: any[]): number;
/**
 * Generates anomaly score for trading behavior
 *
 * @param trades - Trade data
 * @param historicalProfile - Historical trading profile
 * @returns Anomaly score (0-100)
 *
 * @example
 * const score = generateAnomalyScore(trades, historicalProfile);
 */
export declare function generateAnomalyScore(trades: any[], historicalProfile: any): number;
/**
 * Validates MAR (Market Abuse Regulation) compliance
 *
 * @param alert - Alert to validate
 * @returns MAR compliance validation
 *
 * @example
 * const compliance = validateMARCompliance(alert);
 */
export declare function validateMARCompliance(alert: TradeSurveillanceAlert): {
    compliant: boolean;
    requirements: string[];
    violations: string[];
};
/**
 * Validates EMIR compliance
 *
 * @param trades - Trade data
 * @returns EMIR compliance validation
 *
 * @example
 * const compliance = validateEMIRCompliance(trades);
 */
export declare function validateEMIRCompliance(trades: any[]): {
    compliant: boolean;
    reportableTrades: string[];
    missingData: string[];
};
/**
 * Validates SEC compliance
 *
 * @param alert - Alert to validate
 * @returns SEC compliance validation
 *
 * @example
 * const compliance = validateSECCompliance(alert);
 */
export declare function validateSECCompliance(alert: TradeSurveillanceAlert): {
    compliant: boolean;
    applicableRules: string[];
    violations: string[];
};
/**
 * Validates FINRA compliance
 *
 * @param trades - Trade data
 * @param bestExecution - Best execution metrics
 * @returns FINRA compliance validation
 *
 * @example
 * const compliance = validateFINRACompliance(trades, bestExecution);
 */
export declare function validateFINRACompliance(trades: any[], bestExecution: BestExecutionMetrics[]): {
    compliant: boolean;
    rule5310Compliant: boolean;
    violations: string[];
};
/**
 * Validates MiFID II compliance
 *
 * @param trades - Trade data
 * @returns MiFID II compliance validation
 *
 * @example
 * const compliance = validateMiFIDIICompliance(trades);
 */
export declare function validateMiFIDIICompliance(trades: any[]): {
    compliant: boolean;
    transactionReportingCompliant: boolean;
    missingFields: string[];
};
/**
 * Generates regulatory alert for compliance team
 *
 * @param alert - Surveillance alert
 * @param jurisdiction - Target jurisdiction
 * @returns Regulatory alert
 *
 * @example
 * const regAlert = generateRegulatoryAlert(alert, RegulatoryJurisdiction.SEC);
 */
export declare function generateRegulatoryAlert(alert: TradeSurveillanceAlert, jurisdiction: RegulatoryJurisdiction): RegulatoryReport;
/**
 * Submits suspicious activity report (SAR/STR)
 *
 * @param alert - Alert to report
 * @param jurisdiction - Reporting jurisdiction
 * @returns Submission result
 *
 * @example
 * const result = await submitSuspiciousActivityReport(alert, RegulatoryJurisdiction.SEC);
 */
export declare function submitSuspiciousActivityReport(alert: TradeSurveillanceAlert, jurisdiction: RegulatoryJurisdiction, transaction?: Transaction): Promise<{
    submitted: boolean;
    reportId: string;
    acknowledgmentId?: string;
}>;
/**
 * Generates transaction report for regulatory authority
 *
 * @param trades - Trades to report
 * @param jurisdiction - Target jurisdiction
 * @returns Transaction report
 *
 * @example
 * const report = generateTransactionReport(trades, RegulatoryJurisdiction.ESMA);
 */
export declare function generateTransactionReport(trades: any[], jurisdiction: RegulatoryJurisdiction): {
    reportId: string;
    jurisdiction: RegulatoryJurisdiction;
    trades: any[];
    generatedAt: Date;
};
/**
 * Tracks regulatory reporting deadlines
 *
 * @param reports - Regulatory reports
 * @returns Deadline tracking
 *
 * @example
 * const tracking = trackRegulatoryDeadlines(reports);
 */
export declare function trackRegulatoryDeadlines(reports: RegulatoryReport[]): Array<{
    reportId: string;
    deadline: Date;
    daysRemaining: number;
    status: string;
    overdue: boolean;
}>;
/**
 * Archives regulatory evidence and documentation
 *
 * @param alert - Alert to archive
 * @param retentionYears - Years to retain evidence
 * @returns Archive confirmation
 *
 * @example
 * const archive = await archiveRegulatoryEvidence(alert, 7);
 */
export declare function archiveRegulatoryEvidence(alert: TradeSurveillanceAlert, retentionYears?: number, transaction?: Transaction): Promise<{
    archived: boolean;
    archiveId: string;
    retentionUntil: Date;
}>;
/**
 * Generates surveillance dashboard metrics
 *
 * @param dateRange - Date range for metrics
 * @returns Dashboard metrics
 *
 * @example
 * const metrics = await generateSurveillanceDashboard({ start: startDate, end: endDate });
 */
export declare function generateSurveillanceDashboard(dateRange: {
    start: Date;
    end: Date;
}, transaction?: Transaction): Promise<SurveillanceMetrics>;
/**
 * Calculates surveillance KPIs and performance metrics
 *
 * @param metrics - Surveillance metrics
 * @returns Calculated KPIs
 *
 * @example
 * const kpis = calculateSurveillanceMetrics(metrics);
 */
export declare function calculateSurveillanceMetrics(metrics: SurveillanceMetrics): {
    alertEfficiency: number;
    investigationEfficiency: number;
    detectionAccuracy: number;
    coverageQuality: number;
};
/**
 * Prioritizes alerts based on severity and risk
 *
 * @param alerts - Alerts to prioritize
 * @returns Prioritized alerts
 *
 * @example
 * const prioritized = prioritizeAlerts(alerts);
 */
export declare function prioritizeAlerts(alerts: TradeSurveillanceAlert[]): TradeSurveillanceAlert[];
/**
 * Assigns alert to compliance analyst
 *
 * @param alertId - Alert ID
 * @param analystId - Analyst user ID
 * @returns Assignment result
 *
 * @example
 * const result = await assignAlertToAnalyst('ALERT-123', 'analyst-456');
 */
export declare function assignAlertToAnalyst(alertId: string, analystId: string, transaction?: Transaction): Promise<{
    assigned: boolean;
    alert: TradeSurveillanceAlert;
}>;
/**
 * Tracks alert investigation lifecycle
 *
 * @param alertId - Alert ID
 * @returns Alert history
 *
 * @example
 * const history = await trackAlertResolution('ALERT-123');
 */
export declare function trackAlertResolution(alertId: string): Promise<{
    alertId: string;
    currentStatus: AlertStatus;
    statusHistory: Array<{
        status: AlertStatus;
        timestamp: Date;
        user: string;
    }>;
    daysOpen: number;
}>;
/**
 * Generates surveillance summary report
 *
 * @param dateRange - Date range for report
 * @returns Summary report
 *
 * @example
 * const report = await generateSurveillanceReport({ start: startDate, end: endDate });
 */
export declare function generateSurveillanceReport(dateRange: {
    start: Date;
    end: Date;
}, transaction?: Transaction): Promise<{
    reportId: string;
    dateRange: {
        start: Date;
        end: Date;
    };
    executiveSummary: string;
    metrics: SurveillanceMetrics;
    topAlerts: TradeSurveillanceAlert[];
    recommendations: string[];
}>;
/**
 * Monitors surveillance system health
 *
 * @returns System health metrics
 *
 * @example
 * const health = monitorSystemHealthMetrics();
 */
export declare function monitorSystemHealthMetrics(): {
    status: 'healthy' | 'degraded' | 'critical';
    detectionLatency: number;
    dataProcessingRate: number;
    errorRate: number;
    uptime: number;
};
/**
 * Configures surveillance detection thresholds
 *
 * @param config - Configuration settings
 * @returns Updated configuration
 *
 * @example
 * const newConfig = configureSurveillanceThresholds(config);
 */
export declare function configureSurveillanceThresholds(config: Partial<SurveillanceConfig>): SurveillanceConfig;
/**
 * Exports alert data for analysis
 *
 * @param alerts - Alerts to export
 * @param format - Export format
 * @returns Exported data
 *
 * @example
 * const exported = exportAlertData(alerts, 'json');
 */
export declare function exportAlertData(alerts: TradeSurveillanceAlert[], format?: 'json' | 'csv' | 'xml'): string;
/**
 * Integrates best execution monitoring
 *
 * @param trades - Trade data
 * @param benchmarks - Benchmark prices
 * @returns Best execution metrics
 *
 * @example
 * const metrics = integrateBestExecutionMonitoring(trades, benchmarks);
 */
export declare function integrateBestExecutionMonitoring(trades: any[], benchmarks: any): BestExecutionMetrics[];
//# sourceMappingURL=market-surveillance-kit.d.ts.map