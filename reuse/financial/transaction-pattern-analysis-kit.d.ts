/**
 * LOC: TXN-PATTERN-ANALYSIS-001
 * File: /reuse/financial/transaction-pattern-analysis-kit.ts
 *
 * UPSTREAM (imports from):
 *   - TypeScript 5.x (core types)
 *   - ../validation-sanitization-kit.ts (input validation)
 *   - ../error-handling-kit.ts (error handling)
 *
 * DOWNSTREAM (imported by):
 *   - backend/compliance/transaction-monitoring.service.ts
 *   - backend/analytics/fraud-detection.service.ts
 *   - backend/controllers/transaction-analysis.controller.ts
 *   - backend/workers/pattern-detection.worker.ts
 */
/**
 * File: /reuse/financial/transaction-pattern-analysis-kit.ts
 * Locator: WC-TXN-PATTERN-001
 * Purpose: Production-ready Transaction Pattern Analysis - comprehensive detection and behavioral analytics
 *
 * Upstream: TypeScript, validation utilities, error handling
 * Downstream: Compliance services, fraud detection engines, transaction monitoring, analytical dashboards
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x
 * Exports: 40 production-ready functions for transaction pattern analysis
 *
 * LLM Context: Enterprise-grade transaction pattern analysis system for financial compliance and fraud prevention.
 * Provides pattern recognition, anomaly detection, time-series analysis, clustering, behavioral profiling,
 * sequence pattern mining, circular transaction detection, kiting detection, dormancy analysis, activity spikes,
 * peer comparison, statistical analysis, and machine learning pattern detection.
 * Competes with industry-leading transaction monitoring and fraud detection solutions.
 */
/**
 * Core transaction structure for pattern analysis
 */
interface TransactionRecord {
    transactionId: string;
    accountId: string;
    customerId: string;
    amount: number;
    currency: string;
    transactionType: 'credit' | 'debit' | 'transfer' | 'wire' | 'check' | 'atm' | 'pos' | 'ach' | 'other';
    transactionDate: Date;
    timestamp: number;
    originatorInfo: {
        name: string;
        accountNumber?: string;
        institutionCode?: string;
        country?: string;
    };
    beneficiaryInfo: {
        name: string;
        accountNumber?: string;
        institutionCode?: string;
        country?: string;
    };
    metadata?: Record<string, any>;
    tags?: string[];
}
/**
 * Time series data point for trend analysis
 */
interface TimeSeriesPoint {
    timestamp: number;
    value: number;
    transactionCount: number;
    averageAmount: number;
    metadata?: Record<string, any>;
}
/**
 * Pattern detection result
 */
interface PatternDetectionResult {
    patternId: string;
    patternType: string;
    detected: boolean;
    confidence: number;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    matchedTransactions: string[];
    detectedAt: Date;
    riskScore: number;
    metadata?: Record<string, any>;
}
/**
 * Anomaly detection result
 */
interface AnomalyResult {
    accountId: string;
    transactionId: string;
    anomalyType: string;
    isAnomaly: boolean;
    anomalyScore: number;
    expectedBehavior: string;
    deviationReason?: string;
    comparableAverage: number;
    comparableStdDev: number;
    zScore: number;
}
/**
 * Cluster assignment result
 */
interface ClusterAssignment {
    clusterId: number;
    itemId: string;
    distance: number;
    silhouetteScore: number;
    clusterSize: number;
    centroid: number[];
}
/**
 * Behavioral profile for customer
 */
interface BehavioralProfile {
    customerId: string;
    profileId: string;
    createdAt: Date;
    updatedAt: Date;
    averageTransactionAmount: number;
    medianTransactionAmount: number;
    stdDevAmount: number;
    preferredTransactionTypes: Record<string, number>;
    typicalTransactionFrequency: number;
    geographicDistribution: Record<string, number>;
    temporalPatterns: Record<string, number>;
    averageTransactionsPerDay: number;
    peakActivityHours: number[];
    weekdayVsWeekendRatio: number;
    riskProfile: 'low' | 'medium' | 'high';
    confidenceScore: number;
}
/**
 * Peer group comparison metrics
 */
interface PeerGroupMetrics {
    customerId: string;
    peerGroupId: string;
    peerGroupSize: number;
    comparisonMetrics: {
        averageAmountPercentile: number;
        frequencyPercentile: number;
        volumePercentile: number;
        deviationFromGroupMean: number;
        groupStandardDeviation: number;
    };
    outlierStatus: 'not_outlier' | 'mild_outlier' | 'moderate_outlier' | 'severe_outlier';
    similarMembers: string[];
    dissimilarMembers: string[];
}
/**
 * Detect linear progression patterns in transaction amounts
 * Identifies sequences where amounts increase/decrease by consistent increments
 */
export declare function detectLinearProgressionPattern(transactions: TransactionRecord[], tolerance?: number, minSequenceLength?: number): PatternDetectionResult;
/**
 * Detect cyclical/seasonal patterns in transaction data
 */
export declare function detectCyclicalPattern(transactions: TransactionRecord[], cyclePeriodDays?: number, minCycles?: number): PatternDetectionResult;
/**
 * Detect multi-pattern complex sequences (layering, integration movements)
 */
export declare function detectComplexSequencePattern(transactions: TransactionRecord[], patterns?: string[]): PatternDetectionResult;
/**
 * Detect fractal/self-similar patterns across different transaction scales
 */
export declare function detectFractalPattern(transactions: TransactionRecord[], scales?: number[], tolerance?: number): PatternDetectionResult;
/**
 * Statistical anomaly detection using Z-score method
 */
export declare function detectStatisticalAnomalies(transactions: TransactionRecord[], zScoreThreshold?: number, lookbackDays?: number): AnomalyResult[];
/**
 * Isolation Forest-inspired anomaly detection
 */
export declare function detectIsolationForestAnomalies(transactions: TransactionRecord[], contamination?: number, numTrees?: number): AnomalyResult[];
/**
 * Behavioral anomaly detection (deviation from established patterns)
 */
export declare function detectBehavioralAnomalies(transaction: TransactionRecord, profile: BehavioralProfile, deviationThreshold?: number): AnomalyResult;
/**
 * Contextual anomaly detection (unusual given context)
 */
export declare function detectContextualAnomalies(transaction: TransactionRecord, recentTransactions: TransactionRecord[], contextWindow?: number): AnomalyResult;
/**
 * Generate time-series aggregation from transactions
 */
export declare function generateTimeSeries(transactions: TransactionRecord[], intervalMinutes?: number, // 1 day
aggregateType?: 'sum' | 'count' | 'avg' | 'max' | 'min'): TimeSeriesPoint[];
/**
 * Exponential moving average for trend detection
 */
export declare function calculateExponentialMovingAverage(series: TimeSeriesPoint[], alpha?: number): TimeSeriesPoint[];
/**
 * Seasonal decomposition (trend, seasonal, residual)
 */
export declare function seasonalDecomposition(series: TimeSeriesPoint[], seasonalPeriod?: number): {
    trend: TimeSeriesPoint[];
    seasonal: TimeSeriesPoint[];
    residual: TimeSeriesPoint[];
};
/**
 * Calculate autocorrelation for pattern periodicity
 */
export declare function calculateAutocorrelation(series: TimeSeriesPoint[], maxLag?: number): Record<number, number>;
/**
 * ARIMA-style differencing for stationarity
 */
export declare function differenceTimeSeries(series: TimeSeriesPoint[], order?: number): TimeSeriesPoint[];
/**
 * K-means clustering for transaction grouping
 */
export declare function performKMeansClustering(transactions: TransactionRecord[], k?: number, maxIterations?: number): ClusterAssignment[];
/**
 * DBSCAN clustering for density-based grouping
 */
export declare function performDBSCANClustering(transactions: TransactionRecord[], epsilon?: number, // distance threshold
minPoints?: number): ClusterAssignment[];
/**
 * Hierarchical agglomerative clustering
 */
export declare function performHierarchicalClustering(transactions: TransactionRecord[], numClusters?: number): ClusterAssignment[];
/**
 * Build comprehensive behavioral profile for customer
 */
export declare function buildBehavioralProfile(transactions: TransactionRecord[], lookbackDays?: number): BehavioralProfile;
/**
 * Detect dormant account activation
 */
export declare function detectDormantAccountActivation(transactions: TransactionRecord[], dormancyThresholdDays?: number, reactivationAmountMultiplier?: number): PatternDetectionResult;
/**
 * Profile account activity seasonality
 */
export declare function analyzeActivitySeasonality(transactions: TransactionRecord[], monthsToAnalyze?: number): Record<string, any>;
/**
 * Detect sequential patterns in transaction sequences (Apriori-like)
 */
export declare function detectSequentialPatterns(transactions: TransactionRecord[], minSupport?: number, maxPatternLength?: number): Array<{
    pattern: string[];
    support: number;
    confidence: number;
}>;
/**
 * Detect repeated transaction sequences (same amounts in order)
 */
export declare function detectRepeatedSequences(transactions: TransactionRecord[], minSequenceLength?: number, timeWindowDays?: number, tolerance?: number): PatternDetectionResult[];
/**
 * Mining burst patterns (sudden activity spikes)
 */
export declare function detectActivityBursts(transactions: TransactionRecord[], baselineWindowDays?: number, burstMultiplier?: number, detectionWindowDays?: number): PatternDetectionResult;
/**
 * Detect circular/round-tripping transactions (money flowing in circle)
 */
export declare function detectCircularTransactions(transactions: TransactionRecord[], lookbackDays?: number, circulationThresholdPercent?: number): PatternDetectionResult;
/**
 * Multi-leg circular path detection (complex ring patterns)
 */
export declare function detectMultiLegCircularPaths(transactions: TransactionRecord[], minPathLength?: number, lookbackDays?: number): PatternDetectionResult[];
/**
 * Detect check kiting patterns (writing checks before deposits clear)
 */
export declare function detectCheckKiting(transactions: TransactionRecord[], checkClearanceDays?: number, lookbackDays?: number): PatternDetectionResult;
/**
 * Detect ACH kiting patterns (rapid back-and-forth ACH transfers)
 */
export declare function detectACHKiting(transactions: TransactionRecord[], lookbackDays?: number, rapidityThresholdHours?: number, minOccurrences?: number): PatternDetectionResult;
/**
 * Detect pass-through accounts (money comes in and immediately goes out)
 */
export declare function detectPassThroughAccounts(transactions: TransactionRecord[], lookbackDays?: number, passThresholdPercent?: number, timeWindowHours?: number): PatternDetectionResult;
/**
 * Detect shell company patterns (activity without apparent business purpose)
 */
export declare function detectShellAccountPatterns(transactions: TransactionRecord[], profile: BehavioralProfile, lookbackDays?: number): PatternDetectionResult;
/**
 * Detect unusual transaction frequency patterns
 */
export declare function detectFrequencyAnomalies(transactions: TransactionRecord[], lookbackDays?: number, frequencyThresholdMultiplier?: number): AnomalyResult[];
/**
 * Detect unusual inter-transaction timing patterns
 */
export declare function detectTimingAnomalies(transactions: TransactionRecord[], timeWindowMinutes?: number, burstThreshold?: number): PatternDetectionResult;
/**
 * Perform peer group analysis and comparison
 */
export declare function analyzePeerGroupComparison(customerProfile: BehavioralProfile, peerProfiles: BehavioralProfile[], percentileThreshold?: number): PeerGroupMetrics;
/**
 * Mahalanobis distance-based multivariate outlier detection
 */
export declare function detectMultivariateOutliers(transactions: TransactionRecord[], threshold?: number, lookbackDays?: number): AnomalyResult[];
/**
 * Quantile-based outlier detection
 */
export declare function detectQuantileOutliers(transactions: TransactionRecord[], lowerQuantile?: number, upperQuantile?: number, iqrMultiplier?: number): AnomalyResult[];
/**
 * Simple neural network-inspired pattern detection
 */
export declare function detectMLPatterns(transactions: TransactionRecord[], modelVersion?: string, confidenceThreshold?: number): PatternDetectionResult[];
/**
 * Random Forest-inspired ensemble pattern detection
 */
export declare function detectEnsemblePatterns(transactions: TransactionRecord[], numTrees?: number, confidenceThreshold?: number): PatternDetectionResult[];
/**
 * Anomaly score ranking and prioritization
 */
export declare function rankAnomaliesByRiskScore(anomalies: AnomalyResult[], weightFactors?: Record<string, number>): Array<AnomalyResult & {
    finalRiskScore: number;
}>;
/**
 * Calculate comprehensive risk score for account based on all patterns
 */
export declare function calculateAccountRiskScore(patterns: PatternDetectionResult[], anomalies: AnomalyResult[], weights?: Record<string, number>): number;
/**
 * Consolidate and deduplicate detection results
 */
export declare function consolidateDetectionResults(patternResults: PatternDetectionResult[], anomalyResults: AnomalyResult[], confidenceThreshold?: number): {
    highRiskTransactions: Set<string>;
    detectionSummary: Record<string, any>;
    topThreats: PatternDetectionResult[];
};
/**
 * Generate pattern comparison matrix for cross-validation
 */
export declare function generatePatternComparisonMatrix(detectorResults: Map<string, PatternDetectionResult[]>, transactionIds: string[]): Record<string, Record<string, number>>;
/**
 * Calculate pattern persistence score (how consistently detected over time)
 */
export declare function calculatePatternPersistence(historicalPatterns: Array<{
    timestamp: Date;
    pattern: PatternDetectionResult;
}>, patternType: string, timeWindowDays?: number): number;
declare const _default: {
    detectLinearProgressionPattern: typeof detectLinearProgressionPattern;
    detectCyclicalPattern: typeof detectCyclicalPattern;
    detectComplexSequencePattern: typeof detectComplexSequencePattern;
    detectFractalPattern: typeof detectFractalPattern;
    detectStatisticalAnomalies: typeof detectStatisticalAnomalies;
    detectIsolationForestAnomalies: typeof detectIsolationForestAnomalies;
    detectBehavioralAnomalies: typeof detectBehavioralAnomalies;
    detectContextualAnomalies: typeof detectContextualAnomalies;
    generateTimeSeries: typeof generateTimeSeries;
    calculateExponentialMovingAverage: typeof calculateExponentialMovingAverage;
    seasonalDecomposition: typeof seasonalDecomposition;
    calculateAutocorrelation: typeof calculateAutocorrelation;
    differenceTimeSeries: typeof differenceTimeSeries;
    performKMeansClustering: typeof performKMeansClustering;
    performDBSCANClustering: typeof performDBSCANClustering;
    performHierarchicalClustering: typeof performHierarchicalClustering;
    buildBehavioralProfile: typeof buildBehavioralProfile;
    detectDormantAccountActivation: typeof detectDormantAccountActivation;
    analyzeActivitySeasonality: typeof analyzeActivitySeasonality;
    detectSequentialPatterns: typeof detectSequentialPatterns;
    detectRepeatedSequences: typeof detectRepeatedSequences;
    detectActivityBursts: typeof detectActivityBursts;
    detectCircularTransactions: typeof detectCircularTransactions;
    detectMultiLegCircularPaths: typeof detectMultiLegCircularPaths;
    detectCheckKiting: typeof detectCheckKiting;
    detectACHKiting: typeof detectACHKiting;
    detectPassThroughAccounts: typeof detectPassThroughAccounts;
    detectShellAccountPatterns: typeof detectShellAccountPatterns;
    detectFrequencyAnomalies: typeof detectFrequencyAnomalies;
    detectTimingAnomalies: typeof detectTimingAnomalies;
    analyzePeerGroupComparison: typeof analyzePeerGroupComparison;
    detectMultivariateOutliers: typeof detectMultivariateOutliers;
    detectQuantileOutliers: typeof detectQuantileOutliers;
    detectMLPatterns: typeof detectMLPatterns;
    detectEnsemblePatterns: typeof detectEnsemblePatterns;
    rankAnomaliesByRiskScore: typeof rankAnomaliesByRiskScore;
    calculateAccountRiskScore: typeof calculateAccountRiskScore;
    consolidateDetectionResults: typeof consolidateDetectionResults;
    generatePatternComparisonMatrix: typeof generatePatternComparisonMatrix;
    calculatePatternPersistence: typeof calculatePatternPersistence;
};
export default _default;
//# sourceMappingURL=transaction-pattern-analysis-kit.d.ts.map