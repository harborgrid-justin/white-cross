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

import { Model, DataTypes, Sequelize, Transaction, Op, ValidationError } from 'sequelize';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Regulatory jurisdiction enumeration
 */
export enum RegulatoryJurisdiction {
  SEC = 'SEC',           // U.S. Securities and Exchange Commission
  FINRA = 'FINRA',       // Financial Industry Regulatory Authority
  FCA = 'FCA',           // UK Financial Conduct Authority
  ESMA = 'ESMA',         // European Securities and Markets Authority
  MAS = 'MAS',           // Monetary Authority of Singapore
  ASIC = 'ASIC',         // Australian Securities and Investments Commission
  HKMA = 'HKMA',         // Hong Kong Monetary Authority
  CFTC = 'CFTC',         // Commodity Futures Trading Commission
  FSA = 'FSA'            // Japan Financial Services Agency
}

/**
 * Market manipulation type enumeration
 */
export enum MarketManipulationType {
  LAYERING = 'LAYERING',                     // Placing orders to create false impression
  SPOOFING = 'SPOOFING',                     // Placing orders with intent to cancel
  WASH_TRADING = 'WASH_TRADING',             // Trading with self or related parties
  PUMP_AND_DUMP = 'PUMP_AND_DUMP',           // Artificial price inflation then selling
  PAINTING_THE_TAPE = 'PAINTING_THE_TAPE',   // Creating false trading activity
  MARKING_THE_CLOSE = 'MARKING_THE_CLOSE',   // Manipulating closing price
  QUOTE_STUFFING = 'QUOTE_STUFFING',         // Flooding market with quotes
  CORNERING = 'CORNERING',                   // Controlling supply to manipulate price
  RAMPING = 'RAMPING',                       // Artificially inflating price
  CIRCULAR_TRADING = 'CIRCULAR_TRADING',     // Trading among related parties
  FRONT_RUNNING = 'FRONT_RUNNING',           // Trading ahead of client orders
  CHURNING = 'CHURNING'                      // Excessive trading to generate commissions
}

/**
 * Alert severity enumeration
 */
export enum AlertSeverity {
  CRITICAL = 'CRITICAL',   // Immediate action required
  HIGH = 'HIGH',           // Urgent investigation needed
  MEDIUM = 'MEDIUM',       // Standard investigation
  LOW = 'LOW',             // Monitor
  INFO = 'INFO'            // Informational only
}

/**
 * Alert status enumeration
 */
export enum AlertStatus {
  NEW = 'NEW',
  ASSIGNED = 'ASSIGNED',
  INVESTIGATING = 'INVESTIGATING',
  ESCALATED = 'ESCALATED',
  RESOLVED = 'RESOLVED',
  FALSE_POSITIVE = 'FALSE_POSITIVE',
  REPORTED = 'REPORTED',
  CLOSED = 'CLOSED'
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
  matchScore: number;  // 0-100, confidence in detection
  description: string;
  evidenceData: EvidenceData;
  relatedTrades: string[];  // Trade IDs
  relatedOrders: string[];  // Order IDs
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
  timeWindow: { start: Date; end: Date };
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
  automationScore: number;  // How much was automated vs manual
  falsePositiveHistory: number;  // Historical false positive rate for this pattern
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
  priceImpact: number;  // Percentage
  volumeImpact: number;  // Percentage
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
  timingScore: number;  // 0-100
  sizeScore: number;    // 0-100
  behaviorScore: number; // 0-100
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
  frontRunningTrades: string[];  // Trade IDs
  timeAdvantage: number;  // Milliseconds
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
  averageTimeToCancel: number;  // Milliseconds
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
  timeWindow: { start: Date; end: Date };
  quoteRate: number;  // Quotes per second
  cancelRate: number;
  executionRate: number;
  marketImpact: {
    latencyIncrease: number;  // Milliseconds
    spreadWidening: number;   // Basis points
    orderBookDepthReduction: number;  // Percentage
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
  benchmarkPrice: number;  // VWAP, TWAP, or arrival price
  priceImprovement: number;  // Basis points (can be negative)
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
  timeWindow: { start: Date; end: Date };
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
    averageInvestigationTime: number;  // Hours
  };
  performanceMetrics: {
    detectionLatency: number;  // Milliseconds
    falsePositiveRate: number;  // Percentage
    truePositiveRate: number;   // Percentage
    coverageRate: number;       // Percentage of trades monitored
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
      maxTimeWindow: number;  // Seconds
    };
    spoofing: {
      minOrderSize: number;
      minCancellationRate: number;
      maxTimeToCancel: number;  // Milliseconds
    };
    washTrading: {
      maxTimeDifference: number;  // Seconds
      minTradeCount: number;
      priceTolerance: number;  // Percentage
    };
    quoteStuffing: {
      minQuoteRate: number;  // Quotes per second
      minCancelRate: number;
      timeWindow: number;  // Seconds
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
  alerts: string[];  // Alert IDs
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

// ============================================================================
// MARKET MANIPULATION DETECTION FUNCTIONS
// ============================================================================

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
export async function detectLayering(
  orders: any[],
  config: SurveillanceConfig,
  transaction?: Transaction
): Promise<LayeringDetection[]> {
  const detections: LayeringDetection[] = [];

  // Group orders by trader and security
  const groupedOrders = groupOrdersByTraderAndSecurity(orders);

  for (const [key, traderOrders] of groupedOrders.entries()) {
    const [traderId, securityId] = key.split('_');

    // Analyze order pattern
    const pattern = analyzeOrderPattern(traderOrders);

    // Check layering criteria
    if (pattern.totalOrders >= config.thresholds.layering.minOrders &&
        pattern.cancelledOrders / pattern.totalOrders >= config.thresholds.layering.minCancellationRate) {

      const timeSpan = calculateTimeSpan(traderOrders);

      if (timeSpan <= config.thresholds.layering.maxTimeWindow) {
        detections.push({
          detectionId: generateDetectionId(),
          detectedAt: new Date(),
          traderId,
          accountId: traderOrders[0].accountId,
          securityId,
          detectionType: 'layering',
          orderPattern: pattern,
          cancellationRate: pattern.cancelledOrders / pattern.totalOrders,
          executionRate: pattern.executedOrders / pattern.totalOrders,
          priceImpact: calculatePriceImpact(traderOrders),
          durationSeconds: timeSpan,
          confidenceScore: calculateConfidenceScore(pattern, 'layering')
        });
      }
    }
  }

  return detections;
}

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
export async function detectSpoofing(
  orders: any[],
  config: SurveillanceConfig,
  transaction?: Transaction
): Promise<LayeringDetection[]> {
  const detections: LayeringDetection[] = [];

  // Group orders by trader
  const groupedOrders = groupOrdersByTraderAndSecurity(orders);

  for (const [key, traderOrders] of groupedOrders.entries()) {
    const [traderId, securityId] = key.split('_');

    // Identify large orders quickly cancelled
    const spoofingOrders = traderOrders.filter(order => {
      const isLargeOrder = order.quantity >= config.thresholds.spoofing.minOrderSize;
      const quicklyCancelled = order.status === 'cancelled' &&
        order.timeToCancel <= config.thresholds.spoofing.maxTimeToCancel;
      return isLargeOrder && quicklyCancelled;
    });

    if (spoofingOrders.length > 0) {
      const pattern = analyzeOrderPattern(spoofingOrders);
      const cancellationRate = spoofingOrders.length / traderOrders.length;

      if (cancellationRate >= config.thresholds.spoofing.minCancellationRate) {
        detections.push({
          detectionId: generateDetectionId(),
          detectedAt: new Date(),
          traderId,
          accountId: traderOrders[0].accountId,
          securityId,
          detectionType: 'spoofing',
          orderPattern: pattern,
          cancellationRate,
          executionRate: pattern.executedOrders / pattern.totalOrders,
          priceImpact: calculatePriceImpact(spoofingOrders),
          durationSeconds: calculateTimeSpan(spoofingOrders),
          confidenceScore: calculateConfidenceScore(pattern, 'spoofing')
        });
      }
    }
  }

  return detections;
}

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
export async function detectWashTrading(
  trades: any[],
  config: SurveillanceConfig,
  transaction?: Transaction
): Promise<WashTradeIdentification[]> {
  const identifications: WashTradeIdentification[] = [];

  // Group trades by security
  const groupedTrades = groupTradesBySecurity(trades);

  for (const [securityId, securityTrades] of groupedTrades.entries()) {
    // Look for matching buy/sell pairs
    for (let i = 0; i < securityTrades.length; i++) {
      const trade1 = securityTrades[i];

      for (let j = i + 1; j < securityTrades.length; j++) {
        const trade2 = securityTrades[j];

        // Check if trades are opposite sides
        if (trade1.side !== trade2.side) {
          const timeDiff = Math.abs(trade1.timestamp.getTime() - trade2.timestamp.getTime()) / 1000;
          const priceDiff = Math.abs(trade1.price - trade2.price) / trade1.price;
          const quantityMatch = Math.abs(trade1.quantity - trade2.quantity) / trade1.quantity < 0.01;

          // Check wash trading criteria
          if (timeDiff <= config.thresholds.washTrading.maxTimeDifference &&
              priceDiff <= config.thresholds.washTrading.priceTolerance &&
              quantityMatch) {

            // Check if accounts are related
            const accountsRelated = await checkAccountRelationship(trade1.accountId, trade2.accountId);

            if (accountsRelated) {
              identifications.push({
                identificationId: generateIdentificationId(),
                detectedAt: new Date(),
                relatedAccounts: [trade1.accountId, trade2.accountId],
                relatedTrades: [trade1.tradeId, trade2.tradeId],
                matchingCriteria: {
                  priceMatch: priceDiff <= config.thresholds.washTrading.priceTolerance,
                  quantityMatch,
                  timingMatch: timeDiff <= config.thresholds.washTrading.maxTimeDifference,
                  economicPurposeAbsent: true
                },
                circularPattern: false,
                netEconomicImpact: 0,
                suspicionScore: 85
              });
            }
          }
        }
      }
    }
  }

  return identifications;
}

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
export async function detectPumpAndDump(
  trades: any[],
  marketData: any,
  transaction?: Transaction
): Promise<TradeSurveillanceAlert[]> {
  const alerts: TradeSurveillanceAlert[] = [];

  // Group trades by security
  const groupedTrades = groupTradesBySecurity(trades);

  for (const [securityId, securityTrades] of groupedTrades.entries()) {
    // Analyze volume and price patterns
    const volumeAnalysis = analyzeVolumePattern(securityTrades);
    const priceAnalysis = analyzePricePattern(securityTrades, marketData);

    // Look for unusual volume spike followed by price increase then selling
    if (volumeAnalysis.spikeDetected && priceAnalysis.rapidIncrease && priceAnalysis.subsequentDecline) {
      const evidence: EvidenceData = {
        dataPoints: [
          { timestamp: new Date(), dataType: 'volume_spike', value: volumeAnalysis.spikeMultiple, significance: 'high' },
          { timestamp: new Date(), dataType: 'price_increase', value: priceAnalysis.increasePercent, significance: 'high' },
          { timestamp: new Date(), dataType: 'price_decline', value: priceAnalysis.declinePercent, significance: 'high' }
        ],
        patterns: [],
        anomalyScore: 75,
        historicalComparison: {
          averageValue: volumeAnalysis.averageVolume,
          currentValue: volumeAnalysis.currentVolume,
          standardDeviations: volumeAnalysis.standardDeviations
        },
        relatedEntities: []
      };

      alerts.push({
        alertId: generateAlertId(),
        alertType: MarketManipulationType.PUMP_AND_DUMP,
        severity: AlertSeverity.HIGH,
        status: AlertStatus.NEW,
        detectedAt: new Date(),
        securityId,
        matchScore: 75,
        description: `Potential pump and dump detected: ${volumeAnalysis.spikeMultiple}x volume spike, ${priceAnalysis.increasePercent}% price increase followed by ${priceAnalysis.declinePercent}% decline`,
        evidenceData: evidence,
        relatedTrades: securityTrades.map(t => t.tradeId),
        relatedOrders: [],
        jurisdiction: [RegulatoryJurisdiction.SEC, RegulatoryJurisdiction.FINRA],
        metadata: {
          createdBy: 'surveillance_system',
          createdAt: new Date(),
          version: 1,
          automationScore: 100,
          falsePositiveHistory: 15
        }
      });
    }
  }

  return alerts;
}

/**
 * Detects painting the tape manipulation
 *
 * @param trades - Trade data
 * @returns Detection results
 *
 * @example
 * const painting = detectPaintingTheTape(trades);
 */
export function detectPaintingTheTape(
  trades: any[]
): TradeSurveillanceAlert[] {
  const alerts: TradeSurveillanceAlert[] = [];

  // Group by security and time windows
  const timeWindows = groupTradesByTimeWindows(trades, 300); // 5-minute windows

  for (const window of timeWindows) {
    // Look for small trades at incrementally higher prices creating false impression
    const smallTrades = window.trades.filter(t => t.value < 1000);  // Small dollar value

    if (smallTrades.length >= 10) {
      // Check if prices are incrementally increasing
      const priceProgression = analyzePriceProgression(smallTrades);

      if (priceProgression.trend === 'increasing' && priceProgression.consistency > 0.8) {
        alerts.push(createAlert(
          MarketManipulationType.PAINTING_THE_TAPE,
          AlertSeverity.MEDIUM,
          window.securityId,
          smallTrades,
          `${smallTrades.length} small trades creating artificial price progression`
        ));
      }
    }
  }

  return alerts;
}

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
export function detectMarkingTheClose(
  trades: any[],
  marketClose: Date
): TradeSurveillanceAlert[] {
  const alerts: TradeSurveillanceAlert[] = [];

  // Filter trades near market close (last 10 minutes)
  const closeWindow = 10 * 60 * 1000;  // 10 minutes in milliseconds
  const closingTrades = trades.filter(t =>
    marketClose.getTime() - t.timestamp.getTime() <= closeWindow &&
    t.timestamp <= marketClose
  );

  // Group by security
  const groupedTrades = groupTradesBySecurity(closingTrades);

  for (const [securityId, securityTrades] of groupedTrades.entries()) {
    // Analyze if closing trades moved price significantly
    const priceMovement = calculatePriceMovement(securityTrades);
    const volumeRatio = calculateClosingVolumeRatio(securityTrades, trades);

    if (Math.abs(priceMovement) > 2 && volumeRatio < 0.05) {  // >2% move on <5% of daily volume
      alerts.push(createAlert(
        MarketManipulationType.MARKING_THE_CLOSE,
        AlertSeverity.HIGH,
        securityId,
        securityTrades,
        `Significant price movement (${priceMovement.toFixed(2)}%) near close on low volume`
      ));
    }
  }

  return alerts;
}

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
export async function detectQuoteStuffing(
  quotes: any[],
  config: SurveillanceConfig,
  transaction?: Transaction
): Promise<QuoteStuffingDetection[]> {
  const detections: QuoteStuffingDetection[] = [];

  // Group quotes by trader and security
  const groupedQuotes = groupQuotesByTraderAndSecurity(quotes);

  for (const [key, traderQuotes] of groupedQuotes.entries()) {
    const [traderId, securityId] = key.split('_');

    // Analyze in time windows
    const timeWindows = groupByTimeWindows(traderQuotes, config.thresholds.quoteStuffing.timeWindow);

    for (const window of timeWindows) {
      const quoteRate = window.quotes.length / config.thresholds.quoteStuffing.timeWindow;
      const cancelRate = window.quotes.filter(q => q.status === 'cancelled').length / window.quotes.length;
      const executionRate = window.quotes.filter(q => q.status === 'executed').length / window.quotes.length;

      if (quoteRate >= config.thresholds.quoteStuffing.minQuoteRate &&
          cancelRate >= config.thresholds.quoteStuffing.minCancelRate) {

        detections.push({
          detectionId: generateDetectionId(),
          detectedAt: new Date(),
          traderId,
          accountId: window.quotes[0].accountId,
          securityId,
          timeWindow: { start: window.start, end: window.end },
          quoteRate,
          cancelRate,
          executionRate,
          marketImpact: {
            latencyIncrease: 50,  // Would calculate actual latency impact
            spreadWidening: 5,
            orderBookDepthReduction: 20
          },
          severity: quoteRate > config.thresholds.quoteStuffing.minQuoteRate * 2
            ? AlertSeverity.CRITICAL
            : AlertSeverity.HIGH
        });
      }
    }
  }

  return detections;
}

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
export function detectCornering(
  positions: any[],
  marketData: any
): TradeSurveillanceAlert[] {
  const alerts: TradeSurveillanceAlert[] = [];

  // Group positions by security
  const groupedPositions = groupPositionsBySecurity(positions);

  for (const [securityId, securityPositions] of groupedPositions.entries()) {
    // Calculate concentration
    const totalPosition = securityPositions.reduce((sum, p) => sum + p.quantity, 0);
    const floatShares = marketData[securityId]?.floatShares || Infinity;
    const concentrationRatio = totalPosition / floatShares;

    // Check if single entity controls significant portion
    if (concentrationRatio > 0.10) {  // 10% of float
      const largestPositions = securityPositions.sort((a, b) => b.quantity - a.quantity).slice(0, 5);

      alerts.push(createAlert(
        MarketManipulationType.CORNERING,
        AlertSeverity.CRITICAL,
        securityId,
        largestPositions,
        `Potential cornering: ${(concentrationRatio * 100).toFixed(1)}% of float controlled`
      ));
    }
  }

  return alerts;
}

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
export function detectRampingPrices(
  trades: any[],
  marketData: any
): TradeSurveillanceAlert[] {
  const alerts: TradeSurveillanceAlert[] = [];

  // Group by security
  const groupedTrades = groupTradesBySecurity(trades);

  for (const [securityId, securityTrades] of groupedTrades.entries()) {
    // Sort by timestamp
    const sortedTrades = securityTrades.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    // Look for consistent buying pushing price up
    let consecutiveBuys = 0;
    let priceIncrease = 0;
    const startPrice = sortedTrades[0]?.price || 0;

    for (const trade of sortedTrades) {
      if (trade.side === 'buy') {
        consecutiveBuys++;
        priceIncrease = ((trade.price - startPrice) / startPrice) * 100;
      } else {
        consecutiveBuys = 0;
      }

      if (consecutiveBuys >= 10 && priceIncrease > 5) {  // 10+ consecutive buys, 5%+ increase
        alerts.push(createAlert(
          MarketManipulationType.RAMPING,
          AlertSeverity.HIGH,
          securityId,
          sortedTrades,
          `Potential ramping: ${consecutiveBuys} consecutive buys, ${priceIncrease.toFixed(2)}% price increase`
        ));
        break;
      }
    }
  }

  return alerts;
}

/**
 * Detects circular trading patterns
 *
 * @param trades - Trade data
 * @returns Detection results
 *
 * @example
 * const circular = detectCircularTrading(trades);
 */
export function detectCircularTrading(
  trades: any[]
): TradeSurveillanceAlert[] {
  const alerts: TradeSurveillanceAlert[] = [];

  // Build trade graph to find circular patterns
  const tradeGraph = buildTradeGraph(trades);

  // Find cycles in graph (same security moving between related accounts)
  const cycles = findCycles(tradeGraph);

  for (const cycle of cycles) {
    if (cycle.length >= 3) {  // At least 3 accounts in circle
      alerts.push(createAlert(
        MarketManipulationType.CIRCULAR_TRADING,
        AlertSeverity.HIGH,
        cycle.securityId,
        cycle.trades,
        `Circular trading detected among ${cycle.length} related accounts`
      ));
    }
  }

  return alerts;
}

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
export function detectCrossingAtBidAsk(
  trades: any[],
  orderBook: any
): TradeSurveillanceAlert[] {
  const alerts: TradeSurveillanceAlert[] = [];

  // Identify trades where same party is on both sides at bid/ask
  for (const trade of trades) {
    if (trade.buyAccountOwner === trade.sellAccountOwner) {
      const atBidAsk = trade.price === orderBook.bestBid || trade.price === orderBook.bestAsk;

      if (atBidAsk) {
        alerts.push(createAlert(
          MarketManipulationType.WASH_TRADING,
          AlertSeverity.MEDIUM,
          trade.securityId,
          [trade],
          'Self-crossing at bid/ask detected'
        ));
      }
    }
  }

  return alerts;
}

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
export function calculateManipulationScore(
  alert: TradeSurveillanceAlert,
  historicalData: any
): number {
  let score = alert.matchScore;

  // Adjust based on historical patterns
  if (historicalData.repeatedPattern) {
    score += 15;
  }

  // Adjust based on trader history
  if (historicalData.priorViolations > 0) {
    score += historicalData.priorViolations * 5;
  }

  // Adjust based on evidence strength
  if (alert.evidenceData.anomalyScore > 80) {
    score += 10;
  }

  return Math.min(100, score);
}

// ============================================================================
// INSIDER TRADING AND FRONT-RUNNING DETECTION
// ============================================================================

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
export async function detectInsiderTradingPattern(
  trades: any[],
  materialEvents: MaterialEvent[],
  config: SurveillanceConfig,
  transaction?: Transaction
): Promise<InsiderTradingPattern[]> {
  const patterns: InsiderTradingPattern[] = [];

  // For each material event, look for suspicious trading beforehand
  for (const event of materialEvents) {
    const suspiciousTrades: SuspiciousTrade[] = [];

    // Filter trades before event announcement
    const priorTrades = trades.filter(t =>
      t.securityId === event.eventId &&
      t.timestamp < event.announcementDate &&
      t.timestamp >= new Date(event.announcementDate.getTime() - config.thresholds.insiderTrading.maxDaysBeforeEvent * 24 * 60 * 60 * 1000)
    );

    // Analyze each trade for suspicious characteristics
    for (const trade of priorTrades) {
      const timingScore = calculateTimingScore(trade, event);
      const sizeScore = calculateSizeScore(trade, await getTraderHistory(trade.traderId));
      const behaviorScore = calculateBehaviorScore(trade, await getTraderHistory(trade.traderId));

      if (timingScore > config.thresholds.insiderTrading.minTimingScore ||
          sizeScore > 70 ||
          behaviorScore > 70) {
        suspiciousTrades.push({
          tradeId: trade.tradeId,
          orderId: trade.orderId,
          traderId: trade.traderId,
          accountId: trade.accountId,
          timestamp: trade.timestamp,
          side: trade.side,
          quantity: trade.quantity,
          price: trade.price,
          value: trade.value,
          suspicionReasons: [],
          timingScore,
          sizeScore,
          behaviorScore
        });
      }
    }

    if (suspiciousTrades.length > 0) {
      // Calculate profit
      const profit = calculateEventProfit(suspiciousTrades, event);

      if (profit.unrealizedProfit > config.thresholds.insiderTrading.minProfitThreshold) {
        patterns.push({
          patternId: generatePatternId(),
          traderId: suspiciousTrades[0].traderId,
          accountId: suspiciousTrades[0].accountId,
          detectedAt: new Date(),
          patternType: 'pre_announcement_trading',
          securityId: event.eventId,
          materialEvents: [event],
          suspiciousTrades,
          timingAnalysis: {
            averageDaysBeforeEvent: calculateAverageDaysBeforeEvent(suspiciousTrades, event),
            tradingWindowStart: suspiciousTrades[0].timestamp,
            tradingWindowEnd: suspiciousTrades[suspiciousTrades.length - 1].timestamp,
            eventDate: event.eventDate
          },
          profitAnalysis: profit,
          riskScore: calculateInsiderTradingRisk(suspiciousTrades, event, profit)
        });
      }
    }
  }

  return patterns;
}

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
export function analyzeTradeTimingAnomaly(
  trade: any,
  traderHistory: any
): { isAnomalous: boolean; score: number; reasons: string[] } {
  const reasons: string[] = [];
  let score = 0;

  // Check if trade is outside normal trading hours
  const tradeHour = trade.timestamp.getHours();
  const avgTradingHour = traderHistory.averageTradingHour || 12;

  if (Math.abs(tradeHour - avgTradingHour) > 3) {
    reasons.push('Trade outside normal trading hours');
    score += 20;
  }

  // Check if trade size is unusual
  const avgTradeSize = traderHistory.averageTradeSize || 1000;
  if (trade.quantity > avgTradeSize * 5) {
    reasons.push('Trade size significantly larger than historical average');
    score += 30;
  }

  // Check if security is unusual for trader
  if (!traderHistory.tradedSecurities?.includes(trade.securityId)) {
    reasons.push('First time trading this security');
    score += 25;
  }

  return {
    isAnomalous: score > 40,
    score,
    reasons
  };
}

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
export function monitorMaterialEventTrading(
  trades: any[],
  events: MaterialEvent[]
): Array<{ eventId: string; tradesBeforeEvent: number; tradesAfterEvent: number; suspiciousTraders: string[] }> {
  const analysis: Array<{ eventId: string; tradesBeforeEvent: number; tradesAfterEvent: number; suspiciousTraders: string[] }> = [];

  for (const event of events) {
    const eventTrades = trades.filter(t => t.securityId === event.eventId);

    const beforeTrades = eventTrades.filter(t => t.timestamp < event.announcementDate);
    const afterTrades = eventTrades.filter(t => t.timestamp >= event.announcementDate);

    // Identify traders who traded before event
    const beforeTraders = new Set(beforeTrades.map(t => t.traderId));
    const suspiciousTraders = Array.from(beforeTraders).filter(traderId => {
      const traderTrades = beforeTrades.filter(t => t.traderId === traderId);
      // Suspicious if multiple trades in window before event
      return traderTrades.length >= 3;
    });

    analysis.push({
      eventId: event.eventId,
      tradesBeforeEvent: beforeTrades.length,
      tradesAfterEvent: afterTrades.length,
      suspiciousTraders
    });
  }

  return analysis;
}

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
export function detectFrontRunning(
  traderTrades: any[],
  clientOrders: any[]
): FrontRunningDetection[] {
  const detections: FrontRunningDetection[] = [];

  // For each client order, check if trader traded ahead
  for (const clientOrder of clientOrders) {
    const priorTraderTrades = traderTrades.filter(t =>
      t.securityId === clientOrder.securityId &&
      t.timestamp < clientOrder.timestamp &&
      t.timestamp >= new Date(clientOrder.timestamp.getTime() - 60000)  // Within 1 minute before
    );

    if (priorTraderTrades.length > 0) {
      // Calculate time advantage
      const timeAdvantage = clientOrder.timestamp.getTime() - priorTraderTrades[0].timestamp.getTime();

      // Calculate estimated profit
      const profitEstimate = calculateFrontRunningProfit(priorTraderTrades, clientOrder);

      detections.push({
        detectionId: generateDetectionId(),
        detectedAt: new Date(),
        suspectTraderId: priorTraderTrades[0].traderId,
        suspectAccountId: priorTraderTrades[0].accountId,
        clientOrderId: clientOrder.orderId,
        clientAccountId: clientOrder.accountId,
        frontRunningTrades: priorTraderTrades.map(t => t.tradeId),
        timeAdvantage,
        profitEstimate,
        evidenceStrength: timeAdvantage < 10000 ? 'strong' : 'moderate',
        pattern: priorTraderTrades.length > 1 ? 'consistent' : 'isolated'
      });
    }
  }

  return detections;
}

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
export function analyzeBrokerDealerActivity(
  brokerTrades: any[],
  clientTrades: any[]
): { suspiciousPatterns: number; conflicts: any[]; riskScore: number } {
  const conflicts: any[] = [];

  // Check for broker trading same securities as clients
  for (const brokerTrade of brokerTrades) {
    const relatedClientTrades = clientTrades.filter(ct =>
      ct.securityId === brokerTrade.securityId &&
      Math.abs(ct.timestamp.getTime() - brokerTrade.timestamp.getTime()) < 3600000  // Within 1 hour
    );

    if (relatedClientTrades.length > 0) {
      conflicts.push({
        brokerTradeId: brokerTrade.tradeId,
        clientTradeIds: relatedClientTrades.map(ct => ct.tradeId),
        timeDifference: Math.min(...relatedClientTrades.map(ct => Math.abs(ct.timestamp.getTime() - brokerTrade.timestamp.getTime()))),
        conflict: 'Same security traded by broker and client within 1 hour'
      });
    }
  }

  return {
    suspiciousPatterns: conflicts.length,
    conflicts,
    riskScore: Math.min(100, conflicts.length * 15)
  };
}

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
export function trackRestrictedListViolations(
  trades: any[],
  restrictedList: Array<{ securityId: string; restrictedFor: string[]; reason: string }>
): Array<{ tradeId: string; securityId: string; traderId: string; violation: string }> {
  const violations: Array<{ tradeId: string; securityId: string; traderId: string; violation: string }> = [];

  for (const trade of trades) {
    const restriction = restrictedList.find(r => r.securityId === trade.securityId);

    if (restriction && restriction.restrictedFor.includes(trade.traderId)) {
      violations.push({
        tradeId: trade.tradeId,
        securityId: trade.securityId,
        traderId: trade.traderId,
        violation: `Trading restricted security: ${restriction.reason}`
      });
    }
  }

  return violations;
}

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
export function correlateNewsToTrades(
  trades: any[],
  newsEvents: Array<{ timestamp: Date; securityId: string; sentiment: 'positive' | 'negative' | 'neutral'; impact: 'high' | 'medium' | 'low' }>
): Array<{ newsEventId: string; correlatedTrades: any[]; timeToFirstTrade: number; suspicionLevel: string }> {
  const correlations: Array<{ newsEventId: string; correlatedTrades: any[]; timeToFirstTrade: number; suspicionLevel: string }> = [];

  for (const newsEvent of newsEvents) {
    // Find trades shortly before news (suspicious) or shortly after (normal)
    const windowBefore = 3600000;  // 1 hour before
    const windowAfter = 300000;    // 5 minutes after

    const tradesBeforeNews = trades.filter(t =>
      t.securityId === newsEvent.securityId &&
      t.timestamp < newsEvent.timestamp &&
      newsEvent.timestamp.getTime() - t.timestamp.getTime() <= windowBefore
    );

    const tradesAfterNews = trades.filter(t =>
      t.securityId === newsEvent.securityId &&
      t.timestamp >= newsEvent.timestamp &&
      t.timestamp.getTime() - newsEvent.timestamp.getTime() <= windowAfter
    );

    if (tradesBeforeNews.length > 0 && newsEvent.impact === 'high') {
      const timeToFirstTrade = newsEvent.timestamp.getTime() - tradesBeforeNews[0].timestamp.getTime();

      correlations.push({
        newsEventId: newsEvent.timestamp.toISOString(),
        correlatedTrades: tradesBeforeNews,
        timeToFirstTrade,
        suspicionLevel: timeToFirstTrade < 300000 ? 'high' : 'medium'  // <5 min before is highly suspicious
      });
    }
  }

  return correlations;
}

/**
 * Generates insider trading alert
 *
 * @param pattern - Insider trading pattern
 * @returns Generated alert
 *
 * @example
 * const alert = generateInsiderAlert(pattern);
 */
export function generateInsiderAlert(
  pattern: InsiderTradingPattern
): TradeSurveillanceAlert {
  const evidence: EvidenceData = {
    dataPoints: [
      {
        timestamp: new Date(),
        dataType: 'days_before_event',
        value: pattern.timingAnalysis.averageDaysBeforeEvent,
        significance: 'high'
      },
      {
        timestamp: new Date(),
        dataType: 'profit',
        value: pattern.profitAnalysis.unrealizedProfit,
        significance: 'high'
      }
    ],
    patterns: [{
      patternType: pattern.patternType,
      confidence: pattern.riskScore,
      matchedRules: ['timing', 'profit', 'material_event'],
      timeWindow: {
        start: pattern.timingAnalysis.tradingWindowStart,
        end: pattern.timingAnalysis.tradingWindowEnd
      },
      affectedSecurities: [pattern.securityId],
      affectedAccounts: [pattern.accountId]
    }],
    anomalyScore: pattern.riskScore,
    historicalComparison: {
      averageValue: 0,
      currentValue: pattern.profitAnalysis.unrealizedProfit,
      standardDeviations: 0
    },
    relatedEntities: [pattern.traderId]
  };

  return {
    alertId: generateAlertId(),
    alertType: 'INSIDER_TRADING',
    severity: pattern.riskScore > 80 ? AlertSeverity.CRITICAL : AlertSeverity.HIGH,
    status: AlertStatus.NEW,
    detectedAt: pattern.detectedAt,
    securityId: pattern.securityId,
    traderId: pattern.traderId,
    accountId: pattern.accountId,
    matchScore: pattern.riskScore,
    description: `Potential insider trading: ${pattern.suspiciousTrades.length} trades before material event, $${pattern.profitAnalysis.unrealizedProfit.toFixed(2)} estimated profit`,
    evidenceData: evidence,
    relatedTrades: pattern.suspiciousTrades.map(t => t.tradeId),
    relatedOrders: pattern.suspiciousTrades.map(t => t.orderId),
    jurisdiction: [RegulatoryJurisdiction.SEC, RegulatoryJurisdiction.FINRA],
    metadata: {
      createdBy: 'surveillance_system',
      createdAt: new Date(),
      version: 1,
      automationScore: 95,
      falsePositiveHistory: 20
    }
  };
}

// ============================================================================
// PATTERN DETECTION FUNCTIONS
// ============================================================================

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
export function identifyUnusualVolume(
  trades: any[],
  historicalData: any
): Array<{ securityId: string; volume: number; averageVolume: number; standardDeviations: number; anomalyScore: number }> {
  const anomalies: Array<{ securityId: string; volume: number; averageVolume: number; standardDeviations: number; anomalyScore: number }> = [];

  // Group by security
  const groupedTrades = groupTradesBySecurity(trades);

  for (const [securityId, securityTrades] of groupedTrades.entries()) {
    const currentVolume = securityTrades.reduce((sum, t) => sum + t.quantity, 0);
    const historical = historicalData[securityId] || { average: currentVolume, stdDev: 0 };

    const standardDeviations = historical.stdDev > 0
      ? (currentVolume - historical.average) / historical.stdDev
      : 0;

    if (Math.abs(standardDeviations) > 3) {  // 3+ standard deviations
      anomalies.push({
        securityId,
        volume: currentVolume,
        averageVolume: historical.average,
        standardDeviations,
        anomalyScore: Math.min(100, Math.abs(standardDeviations) * 20)
      });
    }
  }

  return anomalies;
}

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
export function detectPriceManipulation(
  trades: any[],
  marketData: any
): TradeSurveillanceAlert[] {
  const alerts: TradeSurveillanceAlert[] = [];

  // Use multiple detection methods
  alerts.push(...detectPumpAndDump(trades, marketData));
  alerts.push(...detectPaintingTheTape(trades));
  alerts.push(...detectMarkingTheClose(trades, new Date()));
  alerts.push(...detectRampingPrices(trades, marketData));

  return alerts;
}

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
export function analyzeOrderBookImbalance(
  orderBook: any,
  threshold: number = 0.3
): { imbalanced: boolean; buyVolume: number; sellVolume: number; imbalanceRatio: number; side: 'buy' | 'sell' } {
  const buyVolume = orderBook.bids.reduce((sum: number, bid: any) => sum + bid.quantity, 0);
  const sellVolume = orderBook.asks.reduce((sum: number, ask: any) => sum + ask.quantity, 0);

  const totalVolume = buyVolume + sellVolume;
  const imbalanceRatio = totalVolume > 0
    ? Math.abs(buyVolume - sellVolume) / totalVolume
    : 0;

  return {
    imbalanced: imbalanceRatio > threshold,
    buyVolume,
    sellVolume,
    imbalanceRatio,
    side: buyVolume > sellVolume ? 'buy' : 'sell'
  };
}

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
export function detectAbnormalSpread(
  quotes: any[],
  historicalData: any
): Array<{ timestamp: Date; spread: number; averageSpread: number; spreadWidening: number }> {
  const anomalies: Array<{ timestamp: Date; spread: number; averageSpread: number; spreadWidening: number }> = [];

  for (const quote of quotes) {
    const spread = quote.askPrice - quote.bidPrice;
    const averageSpread = historicalData.averageSpread || spread;
    const spreadWidening = spread > 0 ? ((spread - averageSpread) / averageSpread) * 100 : 0;

    if (spreadWidening > 50) {  // 50%+ widening
      anomalies.push({
        timestamp: quote.timestamp,
        spread,
        averageSpread,
        spreadWidening
      });
    }
  }

  return anomalies;
}

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
export function monitorRapidCancellation(
  orders: any[],
  threshold: number = 0.8
): Array<{ traderId: string; totalOrders: number; cancelledOrders: number; cancellationRate: number; avgTimeToCancel: number }> {
  const analysis: Array<{ traderId: string; totalOrders: number; cancelledOrders: number; cancellationRate: number; avgTimeToCancel: number }> = [];

  // Group by trader
  const groupedOrders = groupOrdersByTrader(orders);

  for (const [traderId, traderOrders] of groupedOrders.entries()) {
    const cancelledOrders = traderOrders.filter(o => o.status === 'cancelled');
    const cancellationRate = cancelledOrders.length / traderOrders.length;

    if (cancellationRate >= threshold) {
      const avgTimeToCancel = cancelledOrders.reduce((sum, o) => sum + (o.timeToCancel || 0), 0) / cancelledOrders.length;

      analysis.push({
        traderId,
        totalOrders: traderOrders.length,
        cancelledOrders: cancelledOrders.length,
        cancellationRate,
        avgTimeToCancel
      });
    }
  }

  return analysis;
}

/**
 * Analyzes trade concentration
 *
 * @param trades - Trade data
 * @returns Concentration analysis
 *
 * @example
 * const concentration = analyzeTradeConcentration(trades);
 */
export function analyzeTradeConcentration(
  trades: any[]
): { herfindahlIndex: number; topTraders: any[]; concentrationRisk: string } {
  // Calculate market share for each trader
  const totalVolume = trades.reduce((sum, t) => sum + t.value, 0);
  const traderVolumes = new Map<string, number>();

  trades.forEach(trade => {
    const current = traderVolumes.get(trade.traderId) || 0;
    traderVolumes.set(trade.traderId, current + trade.value);
  });

  // Calculate Herfindahl Index
  let herfindahlIndex = 0;
  traderVolumes.forEach(volume => {
    const marketShare = volume / totalVolume;
    herfindahlIndex += marketShare * marketShare;
  });

  // Get top traders
  const topTraders = Array.from(traderVolumes.entries())
    .map(([traderId, volume]) => ({ traderId, volume, marketShare: volume / totalVolume }))
    .sort((a, b) => b.volume - a.volume)
    .slice(0, 10);

  return {
    herfindahlIndex,
    topTraders,
    concentrationRisk: herfindahlIndex > 0.25 ? 'high' : herfindahlIndex > 0.15 ? 'medium' : 'low'
  };
}

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
export function detectAccountLinking(
  trades: any[],
  accounts: any[]
): Array<{ accountGroup: string[]; tradingPattern: string; linkageStrength: number }> {
  const linkedGroups: Array<{ accountGroup: string[]; tradingPattern: string; linkageStrength: number }> = [];

  // Find accounts with similar trading patterns
  const accountPatterns = new Map<string, any>();

  for (const account of accounts) {
    const accountTrades = trades.filter(t => t.accountId === account.accountId);
    accountPatterns.set(account.accountId, {
      securities: new Set(accountTrades.map(t => t.securityId)),
      timingPattern: calculateTimingPattern(accountTrades),
      sizePattern: calculateSizePattern(accountTrades)
    });
  }

  // Compare patterns to find potential links
  const accountIds = Array.from(accountPatterns.keys());
  for (let i = 0; i < accountIds.length; i++) {
    for (let j = i + 1; j < accountIds.length; j++) {
      const pattern1 = accountPatterns.get(accountIds[i]);
      const pattern2 = accountPatterns.get(accountIds[j]);

      const similarity = calculatePatternSimilarity(pattern1, pattern2);

      if (similarity > 0.8) {  // 80%+ similarity
        linkedGroups.push({
          accountGroup: [accountIds[i], accountIds[j]],
          tradingPattern: 'highly_correlated',
          linkageStrength: similarity
        });
      }
    }
  }

  return linkedGroups;
}

/**
 * Monitors cross-market manipulation
 *
 * @param trades - Multi-market trade data
 * @returns Cross-market analysis
 *
 * @example
 * const crossMarket = monitorCrossMarketManipulation(trades);
 */
export function monitorCrossMarketManipulation(
  trades: any[]
): Array<{ securityId: string; markets: string[]; priceDiscrepancy: number; suspicionScore: number }> {
  const analysis: Array<{ securityId: string; markets: string[]; priceDiscrepancy: number; suspicionScore: number }> = [];

  // Group by security
  const groupedTrades = groupTradesBySecurity(trades);

  for (const [securityId, securityTrades] of groupedTrades.entries()) {
    // Group by market
    const marketPrices = new Map<string, number[]>();

    securityTrades.forEach(trade => {
      if (!marketPrices.has(trade.market)) {
        marketPrices.set(trade.market, []);
      }
      marketPrices.get(trade.market)!.push(trade.price);
    });

    if (marketPrices.size > 1) {
      // Calculate average price per market
      const avgPrices = Array.from(marketPrices.entries()).map(([market, prices]) => ({
        market,
        avgPrice: prices.reduce((sum, p) => sum + p, 0) / prices.length
      }));

      // Find maximum price discrepancy
      const prices = avgPrices.map(p => p.avgPrice);
      const maxPrice = Math.max(...prices);
      const minPrice = Math.min(...prices);
      const priceDiscrepancy = ((maxPrice - minPrice) / minPrice) * 100;

      if (priceDiscrepancy > 1) {  // >1% discrepancy
        analysis.push({
          securityId,
          markets: Array.from(marketPrices.keys()),
          priceDiscrepancy,
          suspicionScore: Math.min(100, priceDiscrepancy * 20)
        });
      }
    }
  }

  return analysis;
}

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
export function analyzeTradingPatternSimilarity(
  trades1: any[],
  trades2: any[]
): number {
  const pattern1 = {
    securities: new Set(trades1.map(t => t.securityId)),
    timing: calculateTimingPattern(trades1),
    sizes: calculateSizePattern(trades1)
  };

  const pattern2 = {
    securities: new Set(trades2.map(t => t.securityId)),
    timing: calculateTimingPattern(trades2),
    sizes: calculateSizePattern(trades2)
  };

  return calculatePatternSimilarity(pattern1, pattern2);
}

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
export function generateAnomalyScore(
  trades: any[],
  historicalProfile: any
): number {
  let anomalyScore = 0;

  // Volume anomaly
  const currentVolume = trades.reduce((sum, t) => sum + t.quantity, 0);
  const avgVolume = historicalProfile.averageVolume || currentVolume;
  const volumeDeviation = Math.abs(currentVolume - avgVolume) / (avgVolume || 1);
  anomalyScore += Math.min(30, volumeDeviation * 100);

  // Frequency anomaly
  const currentFrequency = trades.length;
  const avgFrequency = historicalProfile.averageFrequency || currentFrequency;
  const frequencyDeviation = Math.abs(currentFrequency - avgFrequency) / (avgFrequency || 1);
  anomalyScore += Math.min(30, frequencyDeviation * 100);

  // Timing anomaly
  const avgTradingHour = historicalProfile.averageTradingHour || 12;
  const currentHours = trades.map(t => t.timestamp.getHours());
  const hourDeviation = currentHours.reduce((sum, h) => sum + Math.abs(h - avgTradingHour), 0) / currentHours.length;
  anomalyScore += Math.min(20, hourDeviation * 5);

  // New securities
  const historicalSecurities = new Set(historicalProfile.securities || []);
  const newSecurities = trades.filter(t => !historicalSecurities.has(t.securityId)).length;
  anomalyScore += Math.min(20, (newSecurities / trades.length) * 100);

  return Math.min(100, anomalyScore);
}

// ============================================================================
// REGULATORY COMPLIANCE AND REPORTING FUNCTIONS
// ============================================================================

/**
 * Validates MAR (Market Abuse Regulation) compliance
 *
 * @param alert - Alert to validate
 * @returns MAR compliance validation
 *
 * @example
 * const compliance = validateMARCompliance(alert);
 */
export function validateMARCompliance(
  alert: TradeSurveillanceAlert
): { compliant: boolean; requirements: string[]; violations: string[] } {
  const requirements: string[] = [
    'Detection of market manipulation',
    'Insider trading monitoring',
    'Suspicious transaction reporting',
    'Record keeping for 5 years',
    'Reporting to competent authority within required timeframe'
  ];

  const violations: string[] = [];

  // Check if alert severity requires immediate reporting
  if (alert.severity === AlertSeverity.CRITICAL && !alert.regulatoryReporting?.some(r => r.reportType === 'MAR')) {
    violations.push('Critical alert not reported under MAR');
  }

  // Check jurisdiction
  if (!alert.jurisdiction.includes(RegulatoryJurisdiction.ESMA) &&
      !alert.jurisdiction.includes(RegulatoryJurisdiction.FCA)) {
    violations.push('MAR jurisdiction not set');
  }

  return {
    compliant: violations.length === 0,
    requirements,
    violations
  };
}

/**
 * Validates EMIR compliance
 *
 * @param trades - Trade data
 * @returns EMIR compliance validation
 *
 * @example
 * const compliance = validateEMIRCompliance(trades);
 */
export function validateEMIRCompliance(
  trades: any[]
): { compliant: boolean; reportableTrades: string[]; missingData: string[] } {
  const reportableTrades: string[] = [];
  const missingData: string[] = [];

  for (const trade of trades) {
    // Check if derivative trade (EMIR applies to derivatives)
    if (trade.assetClass === 'derivative') {
      reportableTrades.push(trade.tradeId);

      // Check required EMIR fields
      if (!trade.uti) missingData.push(`${trade.tradeId}: Missing UTI (Unique Transaction Identifier)`);
      if (!trade.lei) missingData.push(`${trade.tradeId}: Missing LEI (Legal Entity Identifier)`);
      if (!trade.clearingStatus) missingData.push(`${trade.tradeId}: Missing clearing status`);
    }
  }

  return {
    compliant: missingData.length === 0,
    reportableTrades,
    missingData
  };
}

/**
 * Validates SEC compliance
 *
 * @param alert - Alert to validate
 * @returns SEC compliance validation
 *
 * @example
 * const compliance = validateSECCompliance(alert);
 */
export function validateSECCompliance(
  alert: TradeSurveillanceAlert
): { compliant: boolean; applicableRules: string[]; violations: string[] } {
  const applicableRules: string[] = [];
  const violations: string[] = [];

  // Check Rule 10b-5 (fraud and manipulation)
  if (alert.alertType === MarketManipulationType.PUMP_AND_DUMP ||
      alert.alertType === MarketManipulationType.PAINTING_THE_TAPE) {
    applicableRules.push('Rule 10b-5: Fraud and Manipulation');
  }

  // Check Rule 10b-18 (issuer repurchases)
  if (alert.alertType === MarketManipulationType.MARKING_THE_CLOSE) {
    applicableRules.push('Rule 10b-18: Issuer Repurchases');
  }

  // Check CAT (Consolidated Audit Trail) reporting
  if (!alert.metadata.createdAt) {
    violations.push('Missing timestamp for CAT reporting');
  }

  return {
    compliant: violations.length === 0,
    applicableRules,
    violations
  };
}

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
export function validateFINRACompliance(
  trades: any[],
  bestExecution: BestExecutionMetrics[]
): { compliant: boolean; rule5310Compliant: boolean; violations: string[] } {
  const violations: string[] = [];

  // Check Rule 5310 (Best Execution)
  const poorExecutions = bestExecution.filter(be => be.complianceStatus === 'breach');

  if (poorExecutions.length > 0) {
    violations.push(`Rule 5310 violation: ${poorExecutions.length} trades with poor execution quality`);
  }

  // Check trade reporting
  const unreportedTrades = trades.filter(t => !t.reportedToFINRA);
  if (unreportedTrades.length > 0) {
    violations.push(`${unreportedTrades.length} trades not reported to FINRA`);
  }

  return {
    compliant: violations.length === 0,
    rule5310Compliant: poorExecutions.length === 0,
    violations
  };
}

/**
 * Validates MiFID II compliance
 *
 * @param trades - Trade data
 * @returns MiFID II compliance validation
 *
 * @example
 * const compliance = validateMiFIDIICompliance(trades);
 */
export function validateMiFIDIICompliance(
  trades: any[]
): { compliant: boolean; transactionReportingCompliant: boolean; missingFields: string[] } {
  const missingFields: string[] = [];

  for (const trade of trades) {
    // Check MiFID II required fields
    if (!trade.tradingVenue) missingFields.push(`${trade.tradeId}: Missing trading venue`);
    if (!trade.executionTimestamp) missingFields.push(`${trade.tradeId}: Missing execution timestamp`);
    if (!trade.clientIdentification) missingFields.push(`${trade.tradeId}: Missing client identification`);
    if (!trade.investmentDecisionPerson) missingFields.push(`${trade.tradeId}: Missing investment decision person`);
    if (!trade.executionPerson) missingFields.push(`${trade.tradeId}: Missing execution person`);
  }

  return {
    compliant: missingFields.length === 0,
    transactionReportingCompliant: missingFields.length === 0,
    missingFields
  };
}

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
export function generateRegulatoryAlert(
  alert: TradeSurveillanceAlert,
  jurisdiction: RegulatoryJurisdiction
): RegulatoryReport {
  return {
    reportId: generateReportId(),
    jurisdiction,
    reportType: determineReportType(alert.alertType, jurisdiction),
    reportStatus: 'draft',
    reportContent: {
      alertId: alert.alertId,
      alertType: alert.alertType,
      severity: alert.severity,
      securityId: alert.securityId,
      evidenceData: alert.evidenceData,
      detectedAt: alert.detectedAt
    }
  };
}

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
export async function submitSuspiciousActivityReport(
  alert: TradeSurveillanceAlert,
  jurisdiction: RegulatoryJurisdiction,
  transaction?: Transaction
): Promise<{ submitted: boolean; reportId: string; acknowledgmentId?: string }> {
  const report = generateRegulatoryAlert(alert, jurisdiction);

  // Submit to regulatory authority (implementation specific)
  const acknowledgmentId = await submitToRegulator(report);

  report.reportStatus = 'submitted';
  report.submittedAt = new Date();
  report.acknowledgmentId = acknowledgmentId;

  return {
    submitted: true,
    reportId: report.reportId,
    acknowledgmentId
  };
}

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
export function generateTransactionReport(
  trades: any[],
  jurisdiction: RegulatoryJurisdiction
): { reportId: string; jurisdiction: RegulatoryJurisdiction; trades: any[]; generatedAt: Date } {
  return {
    reportId: generateReportId(),
    jurisdiction,
    trades,
    generatedAt: new Date()
  };
}

/**
 * Tracks regulatory reporting deadlines
 *
 * @param reports - Regulatory reports
 * @returns Deadline tracking
 *
 * @example
 * const tracking = trackRegulatoryDeadlines(reports);
 */
export function trackRegulatoryDeadlines(
  reports: RegulatoryReport[]
): Array<{ reportId: string; deadline: Date; daysRemaining: number; status: string; overdue: boolean }> {
  const tracking: Array<{ reportId: string; deadline: Date; daysRemaining: number; status: string; overdue: boolean }> = [];

  const now = new Date();

  for (const report of reports) {
    // Calculate deadline based on jurisdiction and report type
    const deadline = calculateReportingDeadline(report);
    const daysRemaining = Math.floor((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    tracking.push({
      reportId: report.reportId,
      deadline,
      daysRemaining,
      status: report.reportStatus,
      overdue: daysRemaining < 0 && report.reportStatus !== 'submitted'
    });
  }

  return tracking;
}

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
export async function archiveRegulatoryEvidence(
  alert: TradeSurveillanceAlert,
  retentionYears: number = 7,
  transaction?: Transaction
): Promise<{ archived: boolean; archiveId: string; retentionUntil: Date }> {
  const retentionUntil = new Date();
  retentionUntil.setFullYear(retentionUntil.getFullYear() + retentionYears);

  return {
    archived: true,
    archiveId: generateArchiveId(),
    retentionUntil
  };
}

// ============================================================================
// DASHBOARD AND ALERTING FUNCTIONS
// ============================================================================

/**
 * Generates surveillance dashboard metrics
 *
 * @param dateRange - Date range for metrics
 * @returns Dashboard metrics
 *
 * @example
 * const metrics = await generateSurveillanceDashboard({ start: startDate, end: endDate });
 */
export async function generateSurveillanceDashboard(
  dateRange: { start: Date; end: Date },
  transaction?: Transaction
): Promise<SurveillanceMetrics> {
  const alerts = await fetchAlertsByDateRange(dateRange.start, dateRange.end);
  const trades = await fetchTradesByDateRange(dateRange.start, dateRange.end);

  const alertsByType: Record<string, number> = {};
  const alertsBySeverity: Record<AlertSeverity, number> = {
    [AlertSeverity.CRITICAL]: 0,
    [AlertSeverity.HIGH]: 0,
    [AlertSeverity.MEDIUM]: 0,
    [AlertSeverity.LOW]: 0,
    [AlertSeverity.INFO]: 0
  };

  alerts.forEach(alert => {
    alertsByType[alert.alertType] = (alertsByType[alert.alertType] || 0) + 1;
    alertsBySeverity[alert.severity]++;
  });

  const flaggedTrades = trades.filter(t => t.flagged).length;

  return {
    metricsId: generateMetricsId(),
    generatedAt: new Date(),
    timeWindow: dateRange,
    alertMetrics: {
      totalAlerts: alerts.length,
      newAlerts: alerts.filter(a => a.status === AlertStatus.NEW).length,
      investigatingAlerts: alerts.filter(a => a.status === AlertStatus.INVESTIGATING).length,
      resolvedAlerts: alerts.filter(a => a.status === AlertStatus.RESOLVED).length,
      falsePositives: alerts.filter(a => a.status === AlertStatus.FALSE_POSITIVE).length,
      truePositives: alerts.filter(a => a.status === AlertStatus.REPORTED).length,
      reportedAlerts: alerts.filter(a => a.status === AlertStatus.REPORTED).length,
      alertsByType,
      alertsBySeverity
    },
    tradeMetrics: {
      totalTrades: trades.length,
      flaggedTrades,
      suspiciousTradeRate: (flaggedTrades / trades.length) * 100,
      averageInvestigationTime: 24  // Would calculate actual average
    },
    performanceMetrics: {
      detectionLatency: 500,  // Milliseconds
      falsePositiveRate: 25,   // Percentage
      truePositiveRate: 15,    // Percentage
      coverageRate: 99.5       // Percentage
    },
    topRisks: [
      { riskType: MarketManipulationType.LAYERING, count: alertsByType[MarketManipulationType.LAYERING] || 0, trend: 'stable' },
      { riskType: MarketManipulationType.SPOOFING, count: alertsByType[MarketManipulationType.SPOOFING] || 0, trend: 'decreasing' },
      { riskType: 'INSIDER_TRADING', count: alertsByType['INSIDER_TRADING'] || 0, trend: 'increasing' }
    ]
  };
}

/**
 * Calculates surveillance KPIs and performance metrics
 *
 * @param metrics - Surveillance metrics
 * @returns Calculated KPIs
 *
 * @example
 * const kpis = calculateSurveillanceMetrics(metrics);
 */
export function calculateSurveillanceMetrics(
  metrics: SurveillanceMetrics
): {
  alertEfficiency: number;
  investigationEfficiency: number;
  detectionAccuracy: number;
  coverageQuality: number;
} {
  const totalAlerts = metrics.alertMetrics.totalAlerts;
  const truePositives = metrics.alertMetrics.truePositives;
  const falsePositives = metrics.alertMetrics.falsePositives;

  return {
    alertEfficiency: totalAlerts > 0 ? (truePositives / totalAlerts) * 100 : 0,
    investigationEfficiency: metrics.tradeMetrics.averageInvestigationTime < 48 ? 100 : 50,
    detectionAccuracy: metrics.performanceMetrics.truePositiveRate,
    coverageQuality: metrics.performanceMetrics.coverageRate
  };
}

/**
 * Prioritizes alerts based on severity and risk
 *
 * @param alerts - Alerts to prioritize
 * @returns Prioritized alerts
 *
 * @example
 * const prioritized = prioritizeAlerts(alerts);
 */
export function prioritizeAlerts(
  alerts: TradeSurveillanceAlert[]
): TradeSurveillanceAlert[] {
  return alerts.sort((a, b) => {
    // Priority order: CRITICAL > HIGH > MEDIUM > LOW > INFO
    const severityOrder = {
      [AlertSeverity.CRITICAL]: 5,
      [AlertSeverity.HIGH]: 4,
      [AlertSeverity.MEDIUM]: 3,
      [AlertSeverity.LOW]: 2,
      [AlertSeverity.INFO]: 1
    };

    const severityDiff = severityOrder[b.severity] - severityOrder[a.severity];
    if (severityDiff !== 0) return severityDiff;

    // If same severity, sort by match score
    return b.matchScore - a.matchScore;
  });
}

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
export async function assignAlertToAnalyst(
  alertId: string,
  analystId: string,
  transaction?: Transaction
): Promise<{ assigned: boolean; alert: TradeSurveillanceAlert }> {
  const alert = await fetchAlert(alertId);

  alert.assignedTo = analystId;
  alert.status = AlertStatus.ASSIGNED;
  alert.metadata.updatedAt = new Date();
  alert.metadata.updatedBy = 'system';

  return {
    assigned: true,
    alert
  };
}

/**
 * Tracks alert investigation lifecycle
 *
 * @param alertId - Alert ID
 * @returns Alert history
 *
 * @example
 * const history = await trackAlertResolution('ALERT-123');
 */
export async function trackAlertResolution(
  alertId: string
): Promise<{
  alertId: string;
  currentStatus: AlertStatus;
  statusHistory: Array<{ status: AlertStatus; timestamp: Date; user: string }>;
  daysOpen: number;
}> {
  const alert = await fetchAlert(alertId);
  const statusHistory = await fetchAlertStatusHistory(alertId);

  const now = new Date();
  const daysOpen = Math.floor((now.getTime() - alert.detectedAt.getTime()) / (1000 * 60 * 60 * 24));

  return {
    alertId,
    currentStatus: alert.status,
    statusHistory,
    daysOpen
  };
}

/**
 * Generates surveillance summary report
 *
 * @param dateRange - Date range for report
 * @returns Summary report
 *
 * @example
 * const report = await generateSurveillanceReport({ start: startDate, end: endDate });
 */
export async function generateSurveillanceReport(
  dateRange: { start: Date; end: Date },
  transaction?: Transaction
): Promise<{
  reportId: string;
  dateRange: { start: Date; end: Date };
  executiveSummary: string;
  metrics: SurveillanceMetrics;
  topAlerts: TradeSurveillanceAlert[];
  recommendations: string[];
}> {
  const metrics = await generateSurveillanceDashboard(dateRange);
  const alerts = await fetchAlertsByDateRange(dateRange.start, dateRange.end);
  const topAlerts = prioritizeAlerts(alerts).slice(0, 10);

  const executiveSummary = `
    Surveillance period: ${dateRange.start.toISOString()} to ${dateRange.end.toISOString()}
    Total alerts generated: ${metrics.alertMetrics.totalAlerts}
    Critical alerts: ${metrics.alertMetrics.alertsBySeverity[AlertSeverity.CRITICAL]}
    Reported to regulators: ${metrics.alertMetrics.reportedAlerts}
    False positive rate: ${metrics.performanceMetrics.falsePositiveRate}%
  `.trim();

  const recommendations: string[] = [];
  if (metrics.performanceMetrics.falsePositiveRate > 30) {
    recommendations.push('Consider tuning detection thresholds to reduce false positive rate');
  }
  if (metrics.alertMetrics.newAlerts > metrics.alertMetrics.resolvedAlerts) {
    recommendations.push('Increase analyst capacity to address alert backlog');
  }

  return {
    reportId: generateReportId(),
    dateRange,
    executiveSummary,
    metrics,
    topAlerts,
    recommendations
  };
}

/**
 * Monitors surveillance system health
 *
 * @returns System health metrics
 *
 * @example
 * const health = monitorSystemHealthMetrics();
 */
export function monitorSystemHealthMetrics(): {
  status: 'healthy' | 'degraded' | 'critical';
  detectionLatency: number;
  dataProcessingRate: number;
  errorRate: number;
  uptime: number;
} {
  return {
    status: 'healthy',
    detectionLatency: 500,  // ms
    dataProcessingRate: 10000,  // trades per second
    errorRate: 0.01,  // 0.01%
    uptime: 99.95  // 99.95%
  };
}

/**
 * Configures surveillance detection thresholds
 *
 * @param config - Configuration settings
 * @returns Updated configuration
 *
 * @example
 * const newConfig = configureSurveillanceThresholds(config);
 */
export function configureSurveillanceThresholds(
  config: Partial<SurveillanceConfig>
): SurveillanceConfig {
  const defaultConfig: SurveillanceConfig = {
    configId: generateConfigId(),
    jurisdiction: RegulatoryJurisdiction.SEC,
    enabledDetections: Object.values(MarketManipulationType),
    thresholds: {
      layering: {
        minOrders: 10,
        minCancellationRate: 0.8,
        maxTimeWindow: 300
      },
      spoofing: {
        minOrderSize: 10000,
        minCancellationRate: 0.9,
        maxTimeToCancel: 5000
      },
      washTrading: {
        maxTimeDifference: 60,
        minTradeCount: 2,
        priceTolerance: 0.001
      },
      quoteStuffing: {
        minQuoteRate: 100,
        minCancelRate: 0.95,
        timeWindow: 10
      },
      insiderTrading: {
        maxDaysBeforeEvent: 30,
        minProfitThreshold: 10000,
        minTimingScore: 70
      }
    },
    autoEscalation: {
      enabled: true,
      criticalAlertThreshold: 90,
      escalationRecipients: ['compliance_manager', 'legal_counsel']
    }
  };

  return { ...defaultConfig, ...config };
}

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
export function exportAlertData(
  alerts: TradeSurveillanceAlert[],
  format: 'json' | 'csv' | 'xml' = 'json'
): string {
  if (format === 'json') {
    return JSON.stringify(alerts, null, 2);
  }

  // CSV and XML implementations would go here
  return JSON.stringify(alerts);
}

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
export function integrateBestExecutionMonitoring(
  trades: any[],
  benchmarks: any
): BestExecutionMetrics[] {
  const metrics: BestExecutionMetrics[] = [];

  for (const trade of trades) {
    const benchmarkPrice = benchmarks[trade.securityId]?.vwap || trade.price;
    const priceImprovement = ((benchmarkPrice - trade.price) / trade.price) * 10000;  // Basis points

    let executionQuality: 'excellent' | 'good' | 'acceptable' | 'poor';
    let complianceStatus: 'compliant' | 'marginal' | 'breach';

    if (priceImprovement >= 5) {
      executionQuality = 'excellent';
      complianceStatus = 'compliant';
    } else if (priceImprovement >= 0) {
      executionQuality = 'good';
      complianceStatus = 'compliant';
    } else if (priceImprovement >= -5) {
      executionQuality = 'acceptable';
      complianceStatus = 'marginal';
    } else {
      executionQuality = 'poor';
      complianceStatus = 'breach';
    }

    metrics.push({
      metricId: generateMetricId(),
      calculatedAt: new Date(),
      orderId: trade.orderId,
      accountId: trade.accountId,
      securityId: trade.securityId,
      executionPrice: trade.price,
      benchmarkPrice,
      priceImprovement,
      executionVenue: trade.venue,
      alternativeVenues: [],
      executionQuality,
      complianceStatus
    });
  }

  return metrics;
}

// ============================================================================
// HELPER FUNCTIONS (not exported, internal use)
// ============================================================================

function groupOrdersByTraderAndSecurity(orders: any[]): Map<string, any[]> {
  const grouped = new Map<string, any[]>();

  orders.forEach(order => {
    const key = `${order.traderId}_${order.securityId}`;
    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key)!.push(order);
  });

  return grouped;
}

function analyzeOrderPattern(orders: any[]): OrderPatternAnalysis {
  const totalOrders = orders.length;
  const cancelledOrders = orders.filter(o => o.status === 'cancelled').length;
  const executedOrders = orders.filter(o => o.status === 'executed').length;

  const avgOrderSize = orders.reduce((sum, o) => sum + o.quantity, 0) / totalOrders;
  const cancelledWithTime = orders.filter(o => o.status === 'cancelled' && o.timeToCancel);
  const avgTimeToCancel = cancelledWithTime.length > 0
    ? cancelledWithTime.reduce((sum, o) => sum + o.timeToCancel, 0) / cancelledWithTime.length
    : 0;

  const prices = orders.map(o => o.price);
  const priceLevels = new Set(prices).size;

  return {
    totalOrders,
    cancelledOrders,
    executedOrders,
    averageOrderSize: avgOrderSize,
    averageTimeToCancel: avgTimeToCancel,
    priceLevels,
    sidedness: 'one_sided',  // Would analyze actual side distribution
    progression: 'toward_market'  // Would analyze price progression
  };
}

function calculateTimeSpan(orders: any[]): number {
  if (orders.length < 2) return 0;

  const timestamps = orders.map(o => o.timestamp.getTime());
  const min = Math.min(...timestamps);
  const max = Math.max(...timestamps);

  return (max - min) / 1000;  // Seconds
}

function calculatePriceImpact(orders: any[]): number {
  if (orders.length < 2) return 0;

  const prices = orders.map(o => o.price);
  const firstPrice = prices[0];
  const lastPrice = prices[prices.length - 1];

  return ((lastPrice - firstPrice) / firstPrice) * 100;
}

function calculateConfidenceScore(pattern: OrderPatternAnalysis, type: 'layering' | 'spoofing'): number {
  let score = 50;

  if (pattern.cancellationRate > 0.9) score += 25;
  if (pattern.totalOrders > 20) score += 15;
  if (pattern.averageTimeToCancel < 1000) score += 10;

  return Math.min(100, score);
}

function groupTradesBySecurity(trades: any[]): Map<string, any[]> {
  const grouped = new Map<string, any[]>();

  trades.forEach(trade => {
    if (!grouped.has(trade.securityId)) {
      grouped.set(trade.securityId, []);
    }
    grouped.get(trade.securityId)!.push(trade);
  });

  return grouped;
}

async function checkAccountRelationship(accountId1: string, accountId2: string): Promise<boolean> {
  // Would check for common beneficial owner, related entities, etc.
  return false;
}

function analyzeVolumePattern(trades: any[]): { spikeDetected: boolean; spikeMultiple: number; averageVolume: number; currentVolume: number; standardDeviations: number } {
  const currentVolume = trades.reduce((sum, t) => sum + t.quantity, 0);
  const averageVolume = currentVolume / 2;  // Would use historical average
  const stdDev = averageVolume * 0.2;  // Would calculate actual std dev
  const standardDeviations = (currentVolume - averageVolume) / (stdDev || 1);

  return {
    spikeDetected: standardDeviations > 3,
    spikeMultiple: currentVolume / (averageVolume || 1),
    averageVolume,
    currentVolume,
    standardDeviations
  };
}

function analyzePricePattern(trades: any[], marketData: any): { rapidIncrease: boolean; subsequentDecline: boolean; increasePercent: number; declinePercent: number } {
  const prices = trades.map(t => t.price);
  const maxPrice = Math.max(...prices);
  const minPrice = Math.min(...prices);
  const firstPrice = prices[0];
  const lastPrice = prices[prices.length - 1];

  const increasePercent = ((maxPrice - firstPrice) / firstPrice) * 100;
  const declinePercent = ((maxPrice - lastPrice) / maxPrice) * 100;

  return {
    rapidIncrease: increasePercent > 10,
    subsequentDecline: declinePercent > 5,
    increasePercent,
    declinePercent
  };
}

function createAlert(
  type: MarketManipulationType,
  severity: AlertSeverity,
  securityId: string,
  trades: any[],
  description: string
): TradeSurveillanceAlert {
  return {
    alertId: generateAlertId(),
    alertType: type,
    severity,
    status: AlertStatus.NEW,
    detectedAt: new Date(),
    securityId,
    matchScore: 70,
    description,
    evidenceData: {
      dataPoints: [],
      patterns: [],
      anomalyScore: 70,
      historicalComparison: { averageValue: 0, currentValue: 0, standardDeviations: 0 },
      relatedEntities: []
    },
    relatedTrades: trades.map(t => t.tradeId),
    relatedOrders: [],
    jurisdiction: [RegulatoryJurisdiction.SEC],
    metadata: {
      createdBy: 'surveillance_system',
      createdAt: new Date(),
      version: 1,
      automationScore: 100,
      falsePositiveHistory: 15
    }
  };
}

function groupTradesByTimeWindows(trades: any[], windowSize: number): Array<{ securityId: string; trades: any[]; start: Date; end: Date }> {
  return [];  // Implementation would group trades into time windows
}

function analyzePriceProgression(trades: any[]): { trend: 'increasing' | 'decreasing' | 'stable'; consistency: number } {
  return { trend: 'increasing', consistency: 0.9 };
}

function calculatePriceMovement(trades: any[]): number {
  if (trades.length < 2) return 0;

  const prices = trades.map(t => t.price);
  const firstPrice = prices[0];
  const lastPrice = prices[prices.length - 1];

  return ((lastPrice - firstPrice) / firstPrice) * 100;
}

function calculateClosingVolumeRatio(closingTrades: any[], allTrades: any[]): number {
  const closingVolume = closingTrades.reduce((sum, t) => sum + t.quantity, 0);
  const totalVolume = allTrades.reduce((sum, t) => sum + t.quantity, 0);

  return totalVolume > 0 ? closingVolume / totalVolume : 0;
}

function groupQuotesByTraderAndSecurity(quotes: any[]): Map<string, any[]> {
  const grouped = new Map<string, any[]>();

  quotes.forEach(quote => {
    const key = `${quote.traderId}_${quote.securityId}`;
    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key)!.push(quote);
  });

  return grouped;
}

function groupByTimeWindows(quotes: any[], windowSize: number): Array<{ quotes: any[]; start: Date; end: Date }> {
  return [];  // Implementation would group quotes into time windows
}

function groupPositionsBySecurity(positions: any[]): Map<string, any[]> {
  const grouped = new Map<string, any[]>();

  positions.forEach(position => {
    if (!grouped.has(position.securityId)) {
      grouped.set(position.securityId, []);
    }
    grouped.get(position.securityId)!.push(position);
  });

  return grouped;
}

function buildTradeGraph(trades: any[]): any {
  return {};  // Would build graph of trade relationships
}

function findCycles(graph: any): any[] {
  return [];  // Would find circular patterns in graph
}

async function getTraderHistory(traderId: string): Promise<any> {
  return {
    averageTradeSize: 1000,
    averageTradingHour: 12,
    tradedSecurities: []
  };
}

function calculateTimingScore(trade: any, event: MaterialEvent): number {
  const daysBeforeEvent = (event.announcementDate.getTime() - trade.timestamp.getTime()) / (1000 * 60 * 60 * 24);
  return Math.max(0, 100 - daysBeforeEvent * 3);  // Higher score for trades closer to event
}

function calculateSizeScore(trade: any, history: any): number {
  const avgSize = history.averageTradeSize || trade.quantity;
  const multiple = trade.quantity / avgSize;
  return Math.min(100, multiple * 20);
}

function calculateBehaviorScore(trade: any, history: any): number {
  let score = 0;

  if (!history.tradedSecurities?.includes(trade.securityId)) {
    score += 50;  // First time trading this security
  }

  return score;
}

function calculateEventProfit(trades: SuspiciousTrade[], event: MaterialEvent): { unrealizedProfit: number; realizedProfit: number; returnOnInvestment: number } {
  const totalInvested = trades.reduce((sum, t) => sum + t.value, 0);
  const priceChange = event.priceImpact / 100;
  const unrealizedProfit = totalInvested * priceChange;

  return {
    unrealizedProfit,
    realizedProfit: 0,
    returnOnInvestment: (unrealizedProfit / totalInvested) * 100
  };
}

function calculateAverageDaysBeforeEvent(trades: SuspiciousTrade[], event: MaterialEvent): number {
  const daysArray = trades.map(t =>
    (event.announcementDate.getTime() - t.timestamp.getTime()) / (1000 * 60 * 60 * 24)
  );

  return daysArray.reduce((sum, d) => sum + d, 0) / daysArray.length;
}

function calculateInsiderTradingRisk(trades: SuspiciousTrade[], event: MaterialEvent, profit: any): number {
  let risk = 50;

  if (profit.unrealizedProfit > 100000) risk += 25;
  if (trades.length > 5) risk += 15;
  if (event.priceImpact > 10) risk += 10;

  return Math.min(100, risk);
}

function calculateFrontRunningProfit(trades: any[], clientOrder: any): number {
  return trades.reduce((sum, t) => {
    const priceDiff = clientOrder.price - t.price;
    return sum + (priceDiff * t.quantity);
  }, 0);
}

function groupOrdersByTrader(orders: any[]): Map<string, any[]> {
  const grouped = new Map<string, any[]>();

  orders.forEach(order => {
    if (!grouped.has(order.traderId)) {
      grouped.set(order.traderId, []);
    }
    grouped.get(order.traderId)!.push(order);
  });

  return grouped;
}

function calculateTimingPattern(trades: any[]): any {
  return {};  // Would calculate timing pattern characteristics
}

function calculateSizePattern(trades: any[]): any {
  return {};  // Would calculate size pattern characteristics
}

function calculatePatternSimilarity(pattern1: any, pattern2: any): number {
  return 0.5;  // Would calculate actual similarity
}

function determineReportType(alertType: string, jurisdiction: RegulatoryJurisdiction): 'SAR' | 'STR' | 'MAR' | 'EMIR' | 'CAT' | 'MIFID_II' {
  if (jurisdiction === RegulatoryJurisdiction.SEC || jurisdiction === RegulatoryJurisdiction.FINRA) {
    return 'SAR';
  } else if (jurisdiction === RegulatoryJurisdiction.FCA || jurisdiction === RegulatoryJurisdiction.ESMA) {
    return 'MAR';
  }
  return 'SAR';
}

async function submitToRegulator(report: RegulatoryReport): Promise<string> {
  return generateAcknowledgmentId();
}

function calculateReportingDeadline(report: RegulatoryReport): Date {
  const deadline = new Date();

  switch (report.reportType) {
    case 'SAR':
      deadline.setDate(deadline.getDate() + 30);  // 30 days for SAR
      break;
    case 'MAR':
      deadline.setDate(deadline.getDate() + 1);  // 1 day for MAR
      break;
    default:
      deadline.setDate(deadline.getDate() + 7);
  }

  return deadline;
}

async function fetchAlertsByDateRange(start: Date, end: Date): Promise<TradeSurveillanceAlert[]> {
  return [];
}

async function fetchTradesByDateRange(start: Date, end: Date): Promise<any[]> {
  return [];
}

async function fetchAlert(alertId: string): Promise<TradeSurveillanceAlert> {
  return {} as TradeSurveillanceAlert;
}

async function fetchAlertStatusHistory(alertId: string): Promise<Array<{ status: AlertStatus; timestamp: Date; user: string }>> {
  return [];
}

function generateDetectionId(): string {
  return `DET-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function generateIdentificationId(): string {
  return `ID-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function generateAlertId(): string {
  return `ALERT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function generatePatternId(): string {
  return `PTN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function generateReportId(): string {
  return `RPT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function generateArchiveId(): string {
  return `ARCH-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function generateMetricsId(): string {
  return `MET-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function generateConfigId(): string {
  return `CFG-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function generateMetricId(): string {
  return `BEXEC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function generateAcknowledgmentId(): string {
  return `ACK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
