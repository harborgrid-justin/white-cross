/**
 * LOC: AML-TXN-MON-001
 * File: /reuse/financial/aml-transaction-monitoring-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (Model, DataTypes, Transaction, Op)
 *   - @nestjs/common (Injectable)
 *
 * DOWNSTREAM (imported by):
 *   - backend/aml/transaction-monitoring.service.ts
 *   - backend/compliance/alert-generation.service.ts
 *   - backend/controllers/aml-monitoring.controller.ts
 */
/**
 * File: /reuse/financial/aml-transaction-monitoring-kit.ts
 * Locator: WC-AML-TXNMON-001
 * Purpose: Production-ready AML Transaction Monitoring - real-time detection, pattern analysis, alert generation
 *
 * Upstream: Sequelize 6.x, NestJS 10.x
 * Downstream: AML services, compliance controllers, alert processors
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+
 * Exports: 48 production-ready functions for AML transaction monitoring competing with industry-leading solutions
 *
 * LLM Context: Enterprise-grade AML transaction monitoring utilities for BSA/AML compliance.
 * Provides real-time transaction screening, suspicious pattern detection, velocity analysis, structuring detection,
 * threshold monitoring, cross-border tracking, risk scoring, alert generation, and regulatory reporting.
 */
import { Sequelize } from 'sequelize';
interface TransactionMonitoringRule {
    ruleId: string;
    ruleName: string;
    ruleType: 'threshold' | 'velocity' | 'pattern' | 'behavioral' | 'geographic';
    enabled: boolean;
    severity: 'low' | 'medium' | 'high' | 'critical';
    thresholds: Record<string, any>;
    timeWindow?: number;
    metadata?: Record<string, any>;
}
interface MonitoredTransaction {
    transactionId: string;
    customerId: string;
    accountId: string;
    transactionType: 'deposit' | 'withdrawal' | 'transfer' | 'wire' | 'check' | 'atm' | 'pos';
    amount: number;
    currency: string;
    transactionDate: Date;
    originatorInfo?: any;
    beneficiaryInfo?: any;
    geographicData?: any;
    metadata?: Record<string, any>;
}
interface AlertGeneration {
    alertId: string;
    transactionIds: string[];
    ruleId: string;
    alertType: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    riskScore: number;
    description: string;
    triggeredAt: Date;
    status: 'open' | 'investigating' | 'closed' | 'escalated';
}
interface VelocityCheck {
    customerId: string;
    accountId: string;
    timeWindow: number;
    transactionCount: number;
    totalAmount: number;
    averageAmount: number;
    thresholdExceeded: boolean;
    exceedancePercentage: number;
}
interface StructuringDetection {
    customerId: string;
    accountId: string;
    transactions: MonitoredTransaction[];
    totalAmount: number;
    transactionCount: number;
    timeSpan: number;
    structuringIndicators: string[];
    confidenceScore: number;
}
interface PatternAnalysis {
    patternType: 'smurfing' | 'layering' | 'integration' | 'rapid_movement' | 'unusual_timing';
    customerId: string;
    accountIds: string[];
    detectedAt: Date;
    confidence: number;
    indicators: string[];
    transactions: MonitoredTransaction[];
}
interface RiskScoringResult {
    transactionId: string;
    baseRiskScore: number;
    customerRisk: number;
    transactionRisk: number;
    geographicRisk: number;
    behavioralRisk: number;
    compositeRiskScore: number;
    riskCategory: 'low' | 'medium' | 'high' | 'critical';
}
interface CrossBorderTransaction {
    transactionId: string;
    originCountry: string;
    destinationCountry: string;
    amount: number;
    currency: string;
    jurisdictionRisk: string;
    sanctionsMatch: boolean;
    highRiskIndicators: string[];
}
/**
 * Transaction Monitoring Alert model.
 *
 * @swagger
 * @openapi
 * components:
 *   schemas:
 *     TransactionMonitoringAlert:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         transactionIds:
 *           type: array
 *           items:
 *             type: string
 *         ruleId:
 *           type: string
 *         severity:
 *           type: string
 *           enum: [low, medium, high, critical]
 *         riskScore:
 *           type: number
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} TransactionMonitoringAlert model
 *
 * @example
 * ```typescript
 * const Alert = createTransactionMonitoringAlertModel(sequelize);
 * const alert = await Alert.create({
 *   customerId: 'CUST123',
 *   ruleId: 'RULE001',
 *   severity: 'high',
 *   riskScore: 85.5,
 *   description: 'Structuring detected'
 * });
 * ```
 */
export declare const createTransactionMonitoringAlertModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        customerId: string;
        accountId: string;
        transactionIds: string[];
        ruleId: string;
        ruleName: string;
        alertType: string;
        severity: string;
        riskScore: number;
        description: string;
        triggeredAt: Date;
        status: string;
        assignedTo: string | null;
        investigatedAt: Date | null;
        investigationNotes: string | null;
        closedAt: Date | null;
        closureReason: string | null;
        dispositionCode: string | null;
        sarFiled: boolean;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Monitors transaction in real-time against all active rules.
 *
 * @param {MonitoredTransaction} transaction - Transaction to monitor
 * @param {TransactionMonitoringRule[]} rules - Active monitoring rules
 * @param {any} AlertModel - Alert model
 * @returns {Promise<AlertGeneration[]>} Generated alerts
 *
 * @example
 * ```typescript
 * const alerts = await monitorTransactionRealTime(transaction, activeRules, AlertModel);
 * console.log(`Generated ${alerts.length} alerts`);
 * ```
 */
export declare const monitorTransactionRealTime: (transaction: MonitoredTransaction, rules: TransactionMonitoringRule[], AlertModel: any) => Promise<AlertGeneration[]>;
/**
 * Evaluates a single monitoring rule against a transaction.
 *
 * @param {MonitoredTransaction} transaction - Transaction to evaluate
 * @param {TransactionMonitoringRule} rule - Monitoring rule
 * @returns {Promise<{ triggered: boolean; riskScore: number; description: string }>} Evaluation result
 */
export declare const evaluateRule: (transaction: MonitoredTransaction, rule: TransactionMonitoringRule) => Promise<{
    triggered: boolean;
    riskScore: number;
    description: string;
}>;
/**
 * Creates an alert in the system.
 *
 * @param {Partial<AlertGeneration>} alertData - Alert data
 * @param {any} AlertModel - Alert model
 * @returns {Promise<AlertGeneration>} Created alert
 */
export declare const createAlert: (alertData: Partial<AlertGeneration>, AlertModel: any) => Promise<AlertGeneration>;
/**
 * Batch processes multiple transactions for monitoring.
 *
 * @param {MonitoredTransaction[]} transactions - Transactions to monitor
 * @param {TransactionMonitoringRule[]} rules - Active rules
 * @param {any} AlertModel - Alert model
 * @returns {Promise<{ processed: number; alerts: number }>} Processing summary
 */
export declare const batchMonitorTransactions: (transactions: MonitoredTransaction[], rules: TransactionMonitoringRule[], AlertModel: any) => Promise<{
    processed: number;
    alerts: number;
}>;
/**
 * Retrieves active monitoring rules.
 *
 * @returns {Promise<TransactionMonitoringRule[]>} Active rules
 */
export declare const getActiveMonitoringRules: () => Promise<TransactionMonitoringRule[]>;
/**
 * Updates monitoring rule configuration.
 *
 * @param {string} ruleId - Rule ID
 * @param {Partial<TransactionMonitoringRule>} updates - Rule updates
 * @returns {Promise<TransactionMonitoringRule>} Updated rule
 */
export declare const updateMonitoringRule: (ruleId: string, updates: Partial<TransactionMonitoringRule>) => Promise<TransactionMonitoringRule>;
/**
 * Performs velocity check for transaction frequency.
 *
 * @param {string} customerId - Customer ID
 * @param {string} accountId - Account ID
 * @param {number} timeWindowHours - Time window in hours
 * @param {any} TransactionModel - Transaction model
 * @returns {Promise<VelocityCheck>} Velocity check result
 *
 * @example
 * ```typescript
 * const velocity = await checkTransactionVelocity('CUST123', 'ACC456', 24, TransactionModel);
 * if (velocity.thresholdExceeded) {
 *   console.log(`Velocity threshold exceeded by ${velocity.exceedancePercentage}%`);
 * }
 * ```
 */
export declare const checkTransactionVelocity: (customerId: string, accountId: string, timeWindowHours: number, TransactionModel: any) => Promise<VelocityCheck>;
/**
 * Checks velocity based on transaction volume (amount).
 *
 * @param {string} customerId - Customer ID
 * @param {number} timeWindowHours - Time window
 * @param {number} volumeThreshold - Volume threshold
 * @param {any} TransactionModel - Transaction model
 * @returns {Promise<{ exceeded: boolean; totalVolume: number; threshold: number }>} Volume check result
 */
export declare const checkVolumeVelocity: (customerId: string, timeWindowHours: number, volumeThreshold: number, TransactionModel: any) => Promise<{
    exceeded: boolean;
    totalVolume: number;
    threshold: number;
}>;
/**
 * Detects rapid transaction sequences.
 *
 * @param {string} accountId - Account ID
 * @param {number} minutesWindow - Time window in minutes
 * @param {number} countThreshold - Transaction count threshold
 * @param {any} TransactionModel - Transaction model
 * @returns {Promise<{ detected: boolean; count: number; timeSpan: number }>} Rapid sequence detection result
 */
export declare const detectRapidTransactionSequence: (accountId: string, minutesWindow: number, countThreshold: number, TransactionModel: any) => Promise<{
    detected: boolean;
    count: number;
    timeSpan: number;
}>;
/**
 * Calculates velocity score for customer.
 *
 * @param {string} customerId - Customer ID
 * @param {any} TransactionModel - Transaction model
 * @returns {Promise<number>} Velocity risk score (0-100)
 */
export declare const calculateVelocityRiskScore: (customerId: string, TransactionModel: any) => Promise<number>;
/**
 * Compares current velocity to historical baseline.
 *
 * @param {string} customerId - Customer ID
 * @param {any} TransactionModel - Transaction model
 * @returns {Promise<{ currentVelocity: number; baseline: number; deviation: number }>} Baseline comparison
 */
export declare const compareVelocityToBaseline: (customerId: string, TransactionModel: any) => Promise<{
    currentVelocity: number;
    baseline: number;
    deviation: number;
}>;
/**
 * Generates velocity alert if thresholds exceeded.
 *
 * @param {VelocityCheck} velocityCheck - Velocity check result
 * @param {any} AlertModel - Alert model
 * @returns {Promise<AlertGeneration | null>} Generated alert or null
 */
export declare const generateVelocityAlert: (velocityCheck: VelocityCheck, AlertModel: any) => Promise<AlertGeneration | null>;
/**
 * Detects potential structuring (smurfing) activity.
 *
 * @param {string} customerId - Customer ID
 * @param {number} timeWindowHours - Time window
 * @param {number} ctrThreshold - CTR threshold (default 10000)
 * @param {any} TransactionModel - Transaction model
 * @returns {Promise<StructuringDetection | null>} Structuring detection result
 *
 * @example
 * ```typescript
 * const structuring = await detectStructuring('CUST123', 48, 10000, TransactionModel);
 * if (structuring && structuring.confidenceScore > 0.7) {
 *   console.log('High confidence structuring detected');
 * }
 * ```
 */
export declare const detectStructuring: (customerId: string, timeWindowHours: number, ctrThreshold: number | undefined, TransactionModel: any) => Promise<StructuringDetection | null>;
/**
 * Detects round dollar amount patterns.
 *
 * @param {MonitoredTransaction[]} transactions - Transactions to analyze
 * @returns {{ detected: boolean; percentage: number; count: number }} Round dollar detection result
 */
export declare const detectRoundDollarAmounts: (transactions: MonitoredTransaction[]) => {
    detected: boolean;
    percentage: number;
    count: number;
};
/**
 * Identifies transactions just below CTR threshold.
 *
 * @param {MonitoredTransaction[]} transactions - Transactions
 * @param {number} ctrThreshold - CTR threshold
 * @param {number} proximityPercent - Proximity percentage (default 10%)
 * @returns {MonitoredTransaction[]} Transactions near threshold
 */
export declare const identifyNearThresholdTransactions: (transactions: MonitoredTransaction[], ctrThreshold?: number, proximityPercent?: number) => MonitoredTransaction[];
/**
 * Aggregates related transactions for structuring analysis.
 *
 * @param {string} customerId - Customer ID
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {any} TransactionModel - Transaction model
 * @returns {Promise<{ total: number; count: number; transactions: any[] }>} Aggregation result
 */
export declare const aggregateRelatedTransactions: (customerId: string, startDate: Date, endDate: Date, TransactionModel: any) => Promise<{
    total: number;
    count: number;
    transactions: any[];
}>;
/**
 * Calculates structuring confidence score.
 *
 * @param {StructuringDetection} detection - Structuring detection result
 * @returns {number} Confidence score (0-1)
 */
export declare const calculateStructuringConfidence: (detection: StructuringDetection) => number;
/**
 * Generates structuring alert.
 *
 * @param {StructuringDetection} detection - Structuring detection
 * @param {any} AlertModel - Alert model
 * @returns {Promise<AlertGeneration>} Generated alert
 */
export declare const generateStructuringAlert: (detection: StructuringDetection, AlertModel: any) => Promise<AlertGeneration>;
/**
 * Detects layering patterns (rapid fund movement).
 *
 * @param {string} customerId - Customer ID
 * @param {number} timeWindowHours - Time window
 * @param {any} TransactionModel - Transaction model
 * @returns {Promise<PatternAnalysis | null>} Pattern analysis result
 *
 * @example
 * ```typescript
 * const layering = await detectLayeringPattern('CUST123', 48, TransactionModel);
 * if (layering && layering.confidence > 0.8) {
 *   console.log('Layering pattern detected with high confidence');
 * }
 * ```
 */
export declare const detectLayeringPattern: (customerId: string, timeWindowHours: number, TransactionModel: any) => Promise<PatternAnalysis | null>;
/**
 * Detects unusual timing patterns.
 *
 * @param {string} customerId - Customer ID
 * @param {any} TransactionModel - Transaction model
 * @returns {Promise<PatternAnalysis | null>} Pattern analysis result
 */
export declare const detectUnusualTimingPattern: (customerId: string, TransactionModel: any) => Promise<PatternAnalysis | null>;
/**
 * Analyzes transaction clustering patterns.
 *
 * @param {MonitoredTransaction[]} transactions - Transactions
 * @returns {{ clusters: any[]; score: number }} Clustering analysis
 */
export declare const analyzeTransactionClustering: (transactions: MonitoredTransaction[]) => {
    clusters: any[];
    score: number;
};
/**
 * Identifies behavioral anomalies.
 *
 * @param {string} customerId - Customer ID
 * @param {any} TransactionModel - Transaction model
 * @returns {Promise<{ anomalies: string[]; score: number }>} Anomaly detection result
 */
export declare const identifyBehavioralAnomalies: (customerId: string, TransactionModel: any) => Promise<{
    anomalies: string[];
    score: number;
}>;
/**
 * Scores pattern risk.
 *
 * @param {PatternAnalysis} pattern - Pattern analysis
 * @returns {number} Risk score (0-100)
 */
export declare const scorePatternRisk: (pattern: PatternAnalysis) => number;
/**
 * Generates pattern-based alert.
 *
 * @param {PatternAnalysis} pattern - Pattern analysis
 * @param {any} AlertModel - Alert model
 * @returns {Promise<AlertGeneration>} Generated alert
 */
export declare const generatePatternAlert: (pattern: PatternAnalysis, AlertModel: any) => Promise<AlertGeneration>;
/**
 * Calculates comprehensive transaction risk score.
 *
 * @param {MonitoredTransaction} transaction - Transaction
 * @param {any} customerRiskProfile - Customer risk profile
 * @returns {Promise<RiskScoringResult>} Risk scoring result
 *
 * @example
 * ```typescript
 * const riskScore = await calculateTransactionRiskScore(transaction, customerProfile);
 * if (riskScore.compositeRiskScore > 75) {
 *   console.log(`High risk transaction: ${riskScore.riskCategory}`);
 * }
 * ```
 */
export declare const calculateTransactionRiskScore: (transaction: MonitoredTransaction, customerRiskProfile: any) => Promise<RiskScoringResult>;
/**
 * Assesses customer risk level.
 *
 * @param {string} customerId - Customer ID
 * @returns {Promise<{ riskScore: number; riskCategory: string; factors: string[] }>} Customer risk assessment
 */
export declare const assessCustomerRisk: (customerId: string) => Promise<{
    riskScore: number;
    riskCategory: string;
    factors: string[];
}>;
/**
 * Evaluates geographic risk factors.
 *
 * @param {string} country - Country code
 * @returns {{ riskScore: number; riskCategory: string; factors: string[] }} Geographic risk
 */
export declare const evaluateGeographicRisk: (country: string) => {
    riskScore: number;
    riskCategory: string;
    factors: string[];
};
/**
 * Assigns risk tier to transaction.
 *
 * @param {number} riskScore - Risk score
 * @returns {'tier1' | 'tier2' | 'tier3' | 'tier4'} Risk tier
 */
export declare const assignRiskTier: (riskScore: number) => "tier1" | "tier2" | "tier3" | "tier4";
/**
 * Updates dynamic risk score based on new information.
 *
 * @param {string} transactionId - Transaction ID
 * @param {number} newRiskScore - New risk score
 * @returns {Promise<{ updated: boolean; previousScore: number; newScore: number }>} Update result
 */
export declare const updateDynamicRiskScore: (transactionId: string, newRiskScore: number) => Promise<{
    updated: boolean;
    previousScore: number;
    newScore: number;
}>;
/**
 * Generates risk score report.
 *
 * @param {RiskScoringResult} riskScore - Risk scoring result
 * @returns {{ summary: string; recommendations: string[] }} Risk report
 */
export declare const generateRiskScoreReport: (riskScore: RiskScoringResult) => {
    summary: string;
    recommendations: string[];
};
/**
 * Monitors cross-border transactions.
 *
 * @param {MonitoredTransaction} transaction - Transaction
 * @returns {Promise<CrossBorderTransaction | null>} Cross-border analysis
 *
 * @example
 * ```typescript
 * const crossBorder = await monitorCrossBorderTransaction(transaction);
 * if (crossBorder?.sanctionsMatch) {
 *   console.log('Sanctions match detected');
 * }
 * ```
 */
export declare const monitorCrossBorderTransaction: (transaction: MonitoredTransaction) => Promise<CrossBorderTransaction | null>;
/**
 * Checks if country is under sanctions.
 *
 * @param {string} country - Country code
 * @returns {Promise<boolean>} True if sanctioned
 */
export declare const checkSanctionsMatch: (country: string) => Promise<boolean>;
/**
 * Identifies high-risk jurisdiction transactions.
 *
 * @param {MonitoredTransaction[]} transactions - Transactions
 * @returns {MonitoredTransaction[]} High-risk jurisdiction transactions
 */
export declare const identifyHighRiskJurisdictions: (transactions: MonitoredTransaction[]) => MonitoredTransaction[];
/**
 * Analyzes fund flow patterns across borders.
 *
 * @param {string} customerId - Customer ID
 * @param {any} TransactionModel - Transaction model
 * @returns {Promise<{ countries: string[]; totalAmount: number; transactions: number }>} Fund flow analysis
 */
export declare const analyzeFundFlowPatterns: (customerId: string, TransactionModel: any) => Promise<{
    countries: string[];
    totalAmount: number;
    transactions: number;
}>;
/**
 * Validates Travel Rule compliance (FATF Recommendation 16).
 *
 * @param {MonitoredTransaction} transaction - Cross-border transaction
 * @returns {{ compliant: boolean; missingFields: string[] }} Compliance result
 */
export declare const validateTravelRuleCompliance: (transaction: MonitoredTransaction) => {
    compliant: boolean;
    missingFields: string[];
};
/**
 * Generates geographic risk alert.
 *
 * @param {CrossBorderTransaction} crossBorder - Cross-border transaction
 * @param {any} AlertModel - Alert model
 * @returns {Promise<AlertGeneration>} Generated alert
 */
export declare const generateGeographicRiskAlert: (crossBorder: CrossBorderTransaction, AlertModel: any) => Promise<AlertGeneration>;
/**
 * Retrieves open alerts for investigation.
 *
 * @param {any} AlertModel - Alert model
 * @param {number} limit - Max results
 * @returns {Promise<any[]>} Open alerts
 *
 * @example
 * ```typescript
 * const openAlerts = await getOpenAlerts(AlertModel, 50);
 * console.log(`${openAlerts.length} alerts pending investigation`);
 * ```
 */
export declare const getOpenAlerts: (AlertModel: any, limit?: number) => Promise<any[]>;
/**
 * Assigns alert to investigator.
 *
 * @param {string} alertId - Alert ID
 * @param {string} investigatorId - Investigator user ID
 * @param {any} AlertModel - Alert model
 * @returns {Promise<any>} Updated alert
 */
export declare const assignAlertToInvestigator: (alertId: string, investigatorId: string, AlertModel: any) => Promise<any>;
/**
 * Closes alert with disposition.
 *
 * @param {string} alertId - Alert ID
 * @param {string} dispositionCode - Disposition code
 * @param {string} reason - Closure reason
 * @param {any} AlertModel - Alert model
 * @returns {Promise<any>} Closed alert
 */
export declare const closeAlert: (alertId: string, dispositionCode: string, reason: string, AlertModel: any) => Promise<any>;
/**
 * Escalates alert to higher authority.
 *
 * @param {string} alertId - Alert ID
 * @param {string} escalationReason - Escalation reason
 * @param {any} AlertModel - Alert model
 * @returns {Promise<any>} Escalated alert
 */
export declare const escalateAlert: (alertId: string, escalationReason: string, AlertModel: any) => Promise<any>;
/**
 * Marks alert as false positive.
 *
 * @param {string} alertId - Alert ID
 * @param {string} reason - False positive reason
 * @param {any} AlertModel - Alert model
 * @returns {Promise<any>} Updated alert
 */
export declare const markAlertFalsePositive: (alertId: string, reason: string, AlertModel: any) => Promise<any>;
/**
 * Generates alert metrics report.
 *
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {any} AlertModel - Alert model
 * @returns {Promise<any>} Alert metrics
 */
export declare const generateAlertMetrics: (startDate: Date, endDate: Date, AlertModel: any) => Promise<any>;
/**
 * Configures monitoring thresholds.
 *
 * @param {string} ruleId - Rule ID
 * @param {Record<string, any>} thresholds - Threshold configuration
 * @returns {Promise<TransactionMonitoringRule>} Updated rule
 *
 * @example
 * ```typescript
 * await configureMonitoringThresholds('RULE001', {
 *   amount: 15000,
 *   transactionCount: 8,
 *   timeWindow: 24
 * });
 * ```
 */
export declare const configureMonitoringThresholds: (ruleId: string, thresholds: Record<string, any>) => Promise<TransactionMonitoringRule>;
/**
 * Tunes rule to reduce false positives.
 *
 * @param {string} ruleId - Rule ID
 * @param {number} targetFalsePositiveRate - Target FP rate (0-1)
 * @returns {Promise<{ adjusted: boolean; newThresholds: any }>} Tuning result
 */
export declare const tuneRuleFalsePositives: (ruleId: string, targetFalsePositiveRate: number) => Promise<{
    adjusted: boolean;
    newThresholds: any;
}>;
/**
 * Enables or disables monitoring rule.
 *
 * @param {string} ruleId - Rule ID
 * @param {boolean} enabled - Enable/disable flag
 * @returns {Promise<TransactionMonitoringRule>} Updated rule
 */
export declare const toggleMonitoringRule: (ruleId: string, enabled: boolean) => Promise<TransactionMonitoringRule>;
/**
 * Calculates rule effectiveness score.
 *
 * @param {string} ruleId - Rule ID
 * @param {any} AlertModel - Alert model
 * @returns {Promise<{ effectiveness: number; sarRate: number; fpRate: number }>} Effectiveness metrics
 */
export declare const calculateRuleEffectiveness: (ruleId: string, AlertModel: any) => Promise<{
    effectiveness: number;
    sarRate: number;
    fpRate: number;
}>;
/**
 * Optimizes rule parameters based on historical performance.
 *
 * @param {string} ruleId - Rule ID
 * @param {any} AlertModel - Alert model
 * @returns {Promise<{ optimized: boolean; recommendations: string[] }>} Optimization result
 */
export declare const optimizeRuleParameters: (ruleId: string, AlertModel: any) => Promise<{
    optimized: boolean;
    recommendations: string[];
}>;
/**
 * Exports monitoring configuration.
 *
 * @param {TransactionMonitoringRule[]} rules - Monitoring rules
 * @returns {string} JSON configuration export
 */
export declare const exportMonitoringConfiguration: (rules: TransactionMonitoringRule[]) => string;
/**
 * NestJS Injectable service for AML Transaction Monitoring.
 *
 * @example
 * ```typescript
 * @Controller('aml/monitoring')
 * export class AMLMonitoringController {
 *   constructor(private readonly amlService: AMLTransactionMonitoringService) {}
 *
 *   @Post('monitor')
 *   async monitorTransaction(@Body() transaction: MonitoredTransaction) {
 *     return this.amlService.monitorTransaction(transaction);
 *   }
 * }
 * ```
 */
export declare class AMLTransactionMonitoringService {
    private readonly sequelize;
    constructor(sequelize: Sequelize);
    monitorTransaction(transaction: MonitoredTransaction): Promise<AlertGeneration[]>;
    getAlerts(limit?: number): Promise<any[]>;
    detectStructuring(customerId: string, timeWindowHours?: number): Promise<StructuringDetection | null>;
    calculateRiskScore(transaction: MonitoredTransaction, customerProfile: any): Promise<RiskScoringResult>;
}
/**
 * Default export with all AML transaction monitoring utilities.
 */
declare const _default: {
    createTransactionMonitoringAlertModel: (sequelize: Sequelize) => {
        new (): {
            id: string;
            customerId: string;
            accountId: string;
            transactionIds: string[];
            ruleId: string;
            ruleName: string;
            alertType: string;
            severity: string;
            riskScore: number;
            description: string;
            triggeredAt: Date;
            status: string;
            assignedTo: string | null;
            investigatedAt: Date | null;
            investigationNotes: string | null;
            closedAt: Date | null;
            closureReason: string | null;
            dispositionCode: string | null;
            sarFiled: boolean;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    monitorTransactionRealTime: (transaction: MonitoredTransaction, rules: TransactionMonitoringRule[], AlertModel: any) => Promise<AlertGeneration[]>;
    evaluateRule: (transaction: MonitoredTransaction, rule: TransactionMonitoringRule) => Promise<{
        triggered: boolean;
        riskScore: number;
        description: string;
    }>;
    createAlert: (alertData: Partial<AlertGeneration>, AlertModel: any) => Promise<AlertGeneration>;
    batchMonitorTransactions: (transactions: MonitoredTransaction[], rules: TransactionMonitoringRule[], AlertModel: any) => Promise<{
        processed: number;
        alerts: number;
    }>;
    getActiveMonitoringRules: () => Promise<TransactionMonitoringRule[]>;
    updateMonitoringRule: (ruleId: string, updates: Partial<TransactionMonitoringRule>) => Promise<TransactionMonitoringRule>;
    checkTransactionVelocity: (customerId: string, accountId: string, timeWindowHours: number, TransactionModel: any) => Promise<VelocityCheck>;
    checkVolumeVelocity: (customerId: string, timeWindowHours: number, volumeThreshold: number, TransactionModel: any) => Promise<{
        exceeded: boolean;
        totalVolume: number;
        threshold: number;
    }>;
    detectRapidTransactionSequence: (accountId: string, minutesWindow: number, countThreshold: number, TransactionModel: any) => Promise<{
        detected: boolean;
        count: number;
        timeSpan: number;
    }>;
    calculateVelocityRiskScore: (customerId: string, TransactionModel: any) => Promise<number>;
    compareVelocityToBaseline: (customerId: string, TransactionModel: any) => Promise<{
        currentVelocity: number;
        baseline: number;
        deviation: number;
    }>;
    generateVelocityAlert: (velocityCheck: VelocityCheck, AlertModel: any) => Promise<AlertGeneration | null>;
    detectStructuring: (customerId: string, timeWindowHours: number, ctrThreshold: number | undefined, TransactionModel: any) => Promise<StructuringDetection | null>;
    detectRoundDollarAmounts: (transactions: MonitoredTransaction[]) => {
        detected: boolean;
        percentage: number;
        count: number;
    };
    identifyNearThresholdTransactions: (transactions: MonitoredTransaction[], ctrThreshold?: number, proximityPercent?: number) => MonitoredTransaction[];
    aggregateRelatedTransactions: (customerId: string, startDate: Date, endDate: Date, TransactionModel: any) => Promise<{
        total: number;
        count: number;
        transactions: any[];
    }>;
    calculateStructuringConfidence: (detection: StructuringDetection) => number;
    generateStructuringAlert: (detection: StructuringDetection, AlertModel: any) => Promise<AlertGeneration>;
    detectLayeringPattern: (customerId: string, timeWindowHours: number, TransactionModel: any) => Promise<PatternAnalysis | null>;
    detectUnusualTimingPattern: (customerId: string, TransactionModel: any) => Promise<PatternAnalysis | null>;
    analyzeTransactionClustering: (transactions: MonitoredTransaction[]) => {
        clusters: any[];
        score: number;
    };
    identifyBehavioralAnomalies: (customerId: string, TransactionModel: any) => Promise<{
        anomalies: string[];
        score: number;
    }>;
    scorePatternRisk: (pattern: PatternAnalysis) => number;
    generatePatternAlert: (pattern: PatternAnalysis, AlertModel: any) => Promise<AlertGeneration>;
    calculateTransactionRiskScore: (transaction: MonitoredTransaction, customerRiskProfile: any) => Promise<RiskScoringResult>;
    assessCustomerRisk: (customerId: string) => Promise<{
        riskScore: number;
        riskCategory: string;
        factors: string[];
    }>;
    evaluateGeographicRisk: (country: string) => {
        riskScore: number;
        riskCategory: string;
        factors: string[];
    };
    assignRiskTier: (riskScore: number) => "tier1" | "tier2" | "tier3" | "tier4";
    updateDynamicRiskScore: (transactionId: string, newRiskScore: number) => Promise<{
        updated: boolean;
        previousScore: number;
        newScore: number;
    }>;
    generateRiskScoreReport: (riskScore: RiskScoringResult) => {
        summary: string;
        recommendations: string[];
    };
    monitorCrossBorderTransaction: (transaction: MonitoredTransaction) => Promise<CrossBorderTransaction | null>;
    checkSanctionsMatch: (country: string) => Promise<boolean>;
    identifyHighRiskJurisdictions: (transactions: MonitoredTransaction[]) => MonitoredTransaction[];
    analyzeFundFlowPatterns: (customerId: string, TransactionModel: any) => Promise<{
        countries: string[];
        totalAmount: number;
        transactions: number;
    }>;
    validateTravelRuleCompliance: (transaction: MonitoredTransaction) => {
        compliant: boolean;
        missingFields: string[];
    };
    generateGeographicRiskAlert: (crossBorder: CrossBorderTransaction, AlertModel: any) => Promise<AlertGeneration>;
    getOpenAlerts: (AlertModel: any, limit?: number) => Promise<any[]>;
    assignAlertToInvestigator: (alertId: string, investigatorId: string, AlertModel: any) => Promise<any>;
    closeAlert: (alertId: string, dispositionCode: string, reason: string, AlertModel: any) => Promise<any>;
    escalateAlert: (alertId: string, escalationReason: string, AlertModel: any) => Promise<any>;
    markAlertFalsePositive: (alertId: string, reason: string, AlertModel: any) => Promise<any>;
    generateAlertMetrics: (startDate: Date, endDate: Date, AlertModel: any) => Promise<any>;
    configureMonitoringThresholds: (ruleId: string, thresholds: Record<string, any>) => Promise<TransactionMonitoringRule>;
    tuneRuleFalsePositives: (ruleId: string, targetFalsePositiveRate: number) => Promise<{
        adjusted: boolean;
        newThresholds: any;
    }>;
    toggleMonitoringRule: (ruleId: string, enabled: boolean) => Promise<TransactionMonitoringRule>;
    calculateRuleEffectiveness: (ruleId: string, AlertModel: any) => Promise<{
        effectiveness: number;
        sarRate: number;
        fpRate: number;
    }>;
    optimizeRuleParameters: (ruleId: string, AlertModel: any) => Promise<{
        optimized: boolean;
        recommendations: string[];
    }>;
    exportMonitoringConfiguration: (rules: TransactionMonitoringRule[]) => string;
    AMLTransactionMonitoringService: typeof AMLTransactionMonitoringService;
};
export default _default;
//# sourceMappingURL=aml-transaction-monitoring-kit.d.ts.map