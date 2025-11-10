"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectLinearProgressionPattern = detectLinearProgressionPattern;
exports.detectCyclicalPattern = detectCyclicalPattern;
exports.detectComplexSequencePattern = detectComplexSequencePattern;
exports.detectFractalPattern = detectFractalPattern;
exports.detectStatisticalAnomalies = detectStatisticalAnomalies;
exports.detectIsolationForestAnomalies = detectIsolationForestAnomalies;
exports.detectBehavioralAnomalies = detectBehavioralAnomalies;
exports.detectContextualAnomalies = detectContextualAnomalies;
exports.generateTimeSeries = generateTimeSeries;
exports.calculateExponentialMovingAverage = calculateExponentialMovingAverage;
exports.seasonalDecomposition = seasonalDecomposition;
exports.calculateAutocorrelation = calculateAutocorrelation;
exports.differenceTimeSeries = differenceTimeSeries;
exports.performKMeansClustering = performKMeansClustering;
exports.performDBSCANClustering = performDBSCANClustering;
exports.performHierarchicalClustering = performHierarchicalClustering;
exports.buildBehavioralProfile = buildBehavioralProfile;
exports.detectDormantAccountActivation = detectDormantAccountActivation;
exports.analyzeActivitySeasonality = analyzeActivitySeasonality;
exports.detectSequentialPatterns = detectSequentialPatterns;
exports.detectRepeatedSequences = detectRepeatedSequences;
exports.detectActivityBursts = detectActivityBursts;
exports.detectCircularTransactions = detectCircularTransactions;
exports.detectMultiLegCircularPaths = detectMultiLegCircularPaths;
exports.detectCheckKiting = detectCheckKiting;
exports.detectACHKiting = detectACHKiting;
exports.detectPassThroughAccounts = detectPassThroughAccounts;
exports.detectShellAccountPatterns = detectShellAccountPatterns;
exports.detectFrequencyAnomalies = detectFrequencyAnomalies;
exports.detectTimingAnomalies = detectTimingAnomalies;
exports.analyzePeerGroupComparison = analyzePeerGroupComparison;
exports.detectMultivariateOutliers = detectMultivariateOutliers;
exports.detectQuantileOutliers = detectQuantileOutliers;
exports.detectMLPatterns = detectMLPatterns;
exports.detectEnsemblePatterns = detectEnsemblePatterns;
exports.rankAnomaliesByRiskScore = rankAnomaliesByRiskScore;
exports.calculateAccountRiskScore = calculateAccountRiskScore;
exports.consolidateDetectionResults = consolidateDetectionResults;
exports.generatePatternComparisonMatrix = generatePatternComparisonMatrix;
exports.calculatePatternPersistence = calculatePatternPersistence;
// ============================================================================
// PATTERN RECOGNITION ALGORITHMS
// ============================================================================
/**
 * Detect linear progression patterns in transaction amounts
 * Identifies sequences where amounts increase/decrease by consistent increments
 */
function detectLinearProgressionPattern(transactions, tolerance = 0.05, minSequenceLength = 3) {
    if (!transactions || transactions.length < minSequenceLength) {
        return {
            patternId: `linear-${Date.now()}`,
            patternType: 'linear-progression',
            detected: false,
            confidence: 0,
            severity: 'low',
            description: 'Insufficient transaction data for linear pattern detection',
            matchedTransactions: [],
            detectedAt: new Date(),
            riskScore: 0,
        };
    }
    const sorted = [...transactions].sort((a, b) => a.transactionDate.getTime() - b.transactionDate.getTime());
    const amounts = sorted.map(t => t.amount);
    let maxSequenceLength = 0;
    let bestSequenceIndices = [];
    for (let i = 0; i < amounts.length - minSequenceLength + 1; i++) {
        const differences = [];
        for (let j = i + 1; j < amounts.length; j++) {
            differences.push(amounts[j] - amounts[j - 1]);
        }
        let sequenceLength = 1;
        const firstDiff = differences[0];
        for (let j = 1; j < differences.length; j++) {
            const percentDiff = Math.abs((differences[j] - firstDiff) / firstDiff);
            if (percentDiff <= tolerance) {
                sequenceLength++;
            }
            else {
                break;
            }
        }
        if (sequenceLength >= minSequenceLength && sequenceLength > maxSequenceLength) {
            maxSequenceLength = sequenceLength;
            bestSequenceIndices = Array.from({ length: sequenceLength + 1 }, (_, k) => i + k);
        }
    }
    const detected = maxSequenceLength >= minSequenceLength;
    const confidence = detected ? Math.min(maxSequenceLength / amounts.length, 1) : 0;
    return {
        patternId: `linear-${Date.now()}`,
        patternType: 'linear-progression',
        detected,
        confidence,
        severity: confidence > 0.7 ? 'high' : confidence > 0.4 ? 'medium' : 'low',
        description: `Linear progression pattern detected with ${maxSequenceLength} sequential transactions`,
        matchedTransactions: bestSequenceIndices.map(idx => sorted[idx].transactionId),
        detectedAt: new Date(),
        riskScore: confidence * 0.8,
    };
}
/**
 * Detect cyclical/seasonal patterns in transaction data
 */
function detectCyclicalPattern(transactions, cyclePeriodDays = 7, minCycles = 2) {
    if (!transactions || transactions.length < minCycles * cyclePeriodDays) {
        return {
            patternId: `cyclical-${Date.now()}`,
            patternType: 'cyclical',
            detected: false,
            confidence: 0,
            severity: 'low',
            description: 'Insufficient data for cyclical pattern detection',
            matchedTransactions: [],
            detectedAt: new Date(),
            riskScore: 0,
        };
    }
    const cyclePeriodMs = cyclePeriodDays * 24 * 60 * 60 * 1000;
    const buckets = new Map();
    for (const txn of transactions) {
        const cyclePosition = (txn.timestamp % cyclePeriodMs) / (cyclePeriodMs / 24);
        const bucket = Math.floor(cyclePosition);
        if (!buckets.has(bucket)) {
            buckets.set(bucket, []);
        }
        buckets.get(bucket).push(txn.amount);
    }
    let filledBuckets = 0;
    let varianceAcrossCycles = 0;
    for (const amounts of buckets.values()) {
        if (amounts.length >= minCycles) {
            filledBuckets++;
            const mean = amounts.reduce((a, b) => a + b) / amounts.length;
            const variance = amounts.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / amounts.length;
            varianceAcrossCycles += variance;
        }
    }
    const cyclicalBucketRatio = filledBuckets / 24;
    const confidence = Math.min(cyclicalBucketRatio, 1);
    return {
        patternId: `cyclical-${Date.now()}`,
        patternType: 'cyclical',
        detected: confidence > 0.5,
        confidence,
        severity: confidence > 0.7 ? 'high' : confidence > 0.4 ? 'medium' : 'low',
        description: `Cyclical pattern with ${cyclePeriodDays}-day cycle detected across ${filledBuckets} time buckets`,
        matchedTransactions: transactions.map(t => t.transactionId),
        detectedAt: new Date(),
        riskScore: confidence * 0.6,
    };
}
/**
 * Detect multi-pattern complex sequences (layering, integration movements)
 */
function detectComplexSequencePattern(transactions, patterns = ['layering', 'integration', 'smurfing']) {
    if (!transactions || transactions.length < 3) {
        return {
            patternId: `complex-${Date.now()}`,
            patternType: 'complex-sequence',
            detected: false,
            confidence: 0,
            severity: 'low',
            description: 'Insufficient transactions for complex pattern analysis',
            matchedTransactions: [],
            detectedAt: new Date(),
            riskScore: 0,
        };
    }
    const sorted = [...transactions].sort((a, b) => a.transactionDate.getTime() - b.transactionDate.getTime());
    const timeGaps = sorted.slice(1).map((t, i) => t.timestamp - sorted[i].timestamp);
    const avgTimeGap = timeGaps.reduce((a, b) => a + b, 0) / timeGaps.length;
    const amounts = sorted.map(t => t.amount);
    const avgAmount = amounts.reduce((a, b) => a + b, 0) / amounts.length;
    const amountVariance = amounts.reduce((acc, val) => acc + Math.pow(val - avgAmount, 2), 0) / amounts.length;
    let detectedPatterns = [];
    // Layering detection: multiple transactions of similar sizes
    const similarSizeCount = amounts.filter(a => Math.abs(a - avgAmount) < avgAmount * 0.2).length;
    if (similarSizeCount / amounts.length > 0.6) {
        detectedPatterns.push('layering');
    }
    // Integration detection: sudden large consolidation
    if (sorted.length > 2) {
        const lastAmount = sorted[sorted.length - 1].amount;
        const priorSum = sorted.slice(0, -1).reduce((acc, t) => acc + t.amount, 0);
        if (lastAmount > priorSum * 0.8 && lastAmount < priorSum * 1.2) {
            detectedPatterns.push('integration');
        }
    }
    // Smurfing detection: many small transactions
    const smallTransactions = amounts.filter(a => a < avgAmount * 0.5).length;
    if (smallTransactions / amounts.length > 0.7 && timeGaps.every(g => g < avgTimeGap * 1.5)) {
        detectedPatterns.push('smurfing');
    }
    const matchedPatterns = detectedPatterns.filter(p => patterns.includes(p));
    const confidence = matchedPatterns.length > 0 ? Math.min((matchedPatterns.length / patterns.length) * 1.2, 1) : 0;
    return {
        patternId: `complex-${Date.now()}`,
        patternType: 'complex-sequence',
        detected: matchedPatterns.length > 0,
        confidence,
        severity: confidence > 0.8 ? 'critical' : confidence > 0.5 ? 'high' : 'medium',
        description: `Complex pattern detected: ${matchedPatterns.join(', ')}`,
        matchedTransactions: sorted.map(t => t.transactionId),
        detectedAt: new Date(),
        riskScore: confidence * 0.95,
        metadata: { detectedPatterns: matchedPatterns },
    };
}
/**
 * Detect fractal/self-similar patterns across different transaction scales
 */
function detectFractalPattern(transactions, scales = [1, 7, 30], tolerance = 0.2) {
    if (!transactions || transactions.length < 10) {
        return {
            patternId: `fractal-${Date.now()}`,
            patternType: 'fractal',
            detected: false,
            confidence: 0,
            severity: 'low',
            description: 'Insufficient data for fractal pattern analysis',
            matchedTransactions: [],
            detectedAt: new Date(),
            riskScore: 0,
        };
    }
    const patterns = new Map();
    const msPerDay = 24 * 60 * 60 * 1000;
    for (const scale of scales) {
        const scaledPatterns = [];
        const scaledMs = scale * msPerDay;
        const buckets = new Map();
        for (const txn of transactions) {
            const bucket = Math.floor(txn.timestamp / scaledMs);
            if (!buckets.has(bucket)) {
                buckets.set(bucket, []);
            }
            buckets.get(bucket).push(txn);
        }
        for (const bucket of buckets.values()) {
            scaledPatterns.push(bucket.reduce((acc, t) => acc + t.amount, 0));
        }
        patterns.set(scale, scaledPatterns);
    }
    let similarityScore = 0;
    const scaleArray = Array.from(patterns.keys());
    for (let i = 0; i < scaleArray.length - 1; i++) {
        const pattern1 = patterns.get(scaleArray[i]);
        const pattern2 = patterns.get(scaleArray[i + 1]);
        const minLength = Math.min(pattern1.length, pattern2.length);
        if (minLength > 0) {
            const mean1 = pattern1.reduce((a, b) => a + b) / pattern1.length;
            const mean2 = pattern2.reduce((a, b) => a + b) / pattern2.length;
            const normalized1 = pattern1.map(p => p / mean1);
            const normalized2 = pattern2.slice(0, minLength).map(p => p / mean2);
            let sumSquareDiff = 0;
            for (let j = 0; j < minLength; j++) {
                sumSquareDiff += Math.pow(normalized1[j] - normalized2[j], 2);
            }
            const rmse = Math.sqrt(sumSquareDiff / minLength);
            similarityScore += Math.max(0, 1 - rmse);
        }
    }
    const avgSimilarity = similarityScore / Math.max(scaleArray.length - 1, 1);
    const confidence = Math.min(avgSimilarity, 1);
    return {
        patternId: `fractal-${Date.now()}`,
        patternType: 'fractal',
        detected: confidence > tolerance,
        confidence,
        severity: confidence > 0.7 ? 'high' : 'medium',
        description: 'Fractal/self-similar pattern detected across multiple time scales',
        matchedTransactions: transactions.map(t => t.transactionId),
        detectedAt: new Date(),
        riskScore: confidence * 0.75,
    };
}
// ============================================================================
// ANOMALY DETECTION FUNCTIONS
// ============================================================================
/**
 * Statistical anomaly detection using Z-score method
 */
function detectStatisticalAnomalies(transactions, zScoreThreshold = 2.5, lookbackDays = 90) {
    if (!transactions || transactions.length === 0) {
        return [];
    }
    const now = Date.now();
    const lookbackMs = lookbackDays * 24 * 60 * 60 * 1000;
    const historicalTxns = transactions.filter(t => (now - t.timestamp) <= lookbackMs);
    if (historicalTxns.length < 2) {
        return transactions.map(t => ({
            accountId: t.accountId,
            transactionId: t.transactionId,
            anomalyType: 'statistical',
            isAnomaly: false,
            anomalyScore: 0,
            expectedBehavior: 'No historical baseline',
            comparableAverage: 0,
            comparableStdDev: 0,
            zScore: 0,
        }));
    }
    const amounts = historicalTxns.map(t => t.amount);
    const mean = amounts.reduce((a, b) => a + b, 0) / amounts.length;
    const variance = amounts.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / amounts.length;
    const stdDev = Math.sqrt(variance);
    return transactions.map(t => {
        const zScore = stdDev > 0 ? (t.amount - mean) / stdDev : 0;
        const isAnomaly = Math.abs(zScore) > zScoreThreshold;
        const anomalyScore = Math.min(Math.abs(zScore) / (zScoreThreshold * 2), 1);
        return {
            accountId: t.accountId,
            transactionId: t.transactionId,
            anomalyType: 'statistical',
            isAnomaly,
            anomalyScore,
            expectedBehavior: `Amount between ${mean * 0.5} and ${mean * 1.5}`,
            comparableAverage: mean,
            comparableStdDev: stdDev,
            zScore,
        };
    });
}
/**
 * Isolation Forest-inspired anomaly detection
 */
function detectIsolationForestAnomalies(transactions, contamination = 0.1, numTrees = 10) {
    if (!transactions || transactions.length < 2) {
        return transactions.map(t => ({
            accountId: t.accountId,
            transactionId: t.transactionId,
            anomalyType: 'isolation-forest',
            isAnomaly: false,
            anomalyScore: 0,
            expectedBehavior: 'Insufficient data for anomaly detection',
            comparableAverage: 0,
            comparableStdDev: 0,
            zScore: 0,
        }));
    }
    const features = transactions.map(t => [
        t.amount,
        t.transactionDate.getHours(),
        t.transactionDate.getDay(),
    ]);
    const anomalyScores = features.map((feature, idx) => {
        let pathLengthSum = 0;
        for (let tree = 0; tree < numTrees; tree++) {
            let pathLength = 0;
            const subsample = transactions
                .map((_, i) => i)
                .sort(() => Math.random() - 0.5)
                .slice(0, Math.min(256, transactions.length));
            for (const sampleIdx of subsample) {
                const diff = Math.abs(features[idx][0] - features[sampleIdx][0]);
                if (diff > 0) {
                    pathLength++;
                }
            }
            pathLengthSum += pathLength;
        }
        const avgPathLength = pathLengthSum / numTrees;
        const maxPathLength = Math.log2(Math.max(transactions.length, 1));
        const anomalyScore = Math.pow(2, -(avgPathLength / (maxPathLength + 1)));
        return anomalyScore;
    });
    const threshold = contamination;
    return transactions.map((t, idx) => {
        const anomalyScore = anomalyScores[idx];
        const isAnomaly = anomalyScore > threshold;
        return {
            accountId: t.accountId,
            transactionId: t.transactionId,
            anomalyType: 'isolation-forest',
            isAnomaly,
            anomalyScore,
            expectedBehavior: `Isolation anomaly score < ${threshold}`,
            comparableAverage: transactions.reduce((acc, tx) => acc + tx.amount, 0) / transactions.length,
            comparableStdDev: Math.sqrt(transactions.reduce((acc, tx) => {
                const mean = transactions.reduce((a, b) => a + b.amount, 0) / transactions.length;
                return acc + Math.pow(tx.amount - mean, 2);
            }, 0) / transactions.length),
            zScore: (anomalyScore - 0.5) * 2,
        };
    });
}
/**
 * Behavioral anomaly detection (deviation from established patterns)
 */
function detectBehavioralAnomalies(transaction, profile, deviationThreshold = 2.5) {
    const mean = profile.averageTransactionAmount;
    const stdDev = profile.stdDevAmount;
    const zScore = stdDev > 0 ? (transaction.amount - mean) / stdDev : 0;
    const expectedTypes = Object.entries(profile.preferredTransactionTypes)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([type]) => type);
    const typeDeviation = !expectedTypes.includes(transaction.transactionType) ? 1 : 0;
    const isAnomaly = Math.abs(zScore) > deviationThreshold || typeDeviation > 0.5;
    const anomalyScore = Math.min((Math.abs(zScore) / (deviationThreshold * 2)) * 0.7 + typeDeviation * 0.3, 1);
    return {
        accountId: transaction.accountId,
        transactionId: transaction.transactionId,
        anomalyType: 'behavioral',
        isAnomaly,
        anomalyScore,
        expectedBehavior: `Typical amounts: ${mean}, Type: ${expectedTypes.join('|')}`,
        deviationReason: typeDeviation > 0.5 ? 'Unusual transaction type' : undefined,
        comparableAverage: mean,
        comparableStdDev: stdDev,
        zScore,
    };
}
/**
 * Contextual anomaly detection (unusual given context)
 */
function detectContextualAnomalies(transaction, recentTransactions, contextWindow = 7 // days
) {
    const contextMs = contextWindow * 24 * 60 * 60 * 1000;
    const relevantTxns = recentTransactions.filter(t => Math.abs(t.timestamp - transaction.timestamp) <= contextMs && t.accountId === transaction.accountId);
    if (relevantTxns.length < 2) {
        return {
            accountId: transaction.accountId,
            transactionId: transaction.transactionId,
            anomalyType: 'contextual',
            isAnomaly: false,
            anomalyScore: 0,
            expectedBehavior: 'Insufficient context data',
            comparableAverage: 0,
            comparableStdDev: 0,
            zScore: 0,
        };
    }
    const contextAmounts = relevantTxns.map(t => t.amount);
    const contextMean = contextAmounts.reduce((a, b) => a + b, 0) / contextAmounts.length;
    const contextVariance = contextAmounts.reduce((acc, val) => acc + Math.pow(val - contextMean, 2), 0) / contextAmounts.length;
    const contextStdDev = Math.sqrt(contextVariance);
    const zScore = contextStdDev > 0 ? (transaction.amount - contextMean) / contextStdDev : 0;
    const isAnomaly = Math.abs(zScore) > 2;
    const anomalyScore = Math.min(Math.abs(zScore) / 4, 1);
    return {
        accountId: transaction.accountId,
        transactionId: transaction.transactionId,
        anomalyType: 'contextual',
        isAnomaly,
        anomalyScore,
        expectedBehavior: `Within recent context: ${contextMean}`,
        comparableAverage: contextMean,
        comparableStdDev: contextStdDev,
        zScore,
    };
}
// ============================================================================
// TIME-SERIES ANALYSIS FUNCTIONS
// ============================================================================
/**
 * Generate time-series aggregation from transactions
 */
function generateTimeSeries(transactions, intervalMinutes = 1440, // 1 day
aggregateType = 'sum') {
    if (!transactions || transactions.length === 0) {
        return [];
    }
    const intervalMs = intervalMinutes * 60 * 1000;
    const buckets = new Map();
    for (const txn of transactions) {
        const bucketKey = Math.floor(txn.timestamp / intervalMs);
        if (!buckets.has(bucketKey)) {
            buckets.set(bucketKey, []);
        }
        buckets.get(bucketKey).push(txn);
    }
    const points = [];
    for (const [bucketKey, txns] of buckets.entries()) {
        const timestamp = bucketKey * intervalMs;
        let value = 0;
        switch (aggregateType) {
            case 'sum':
                value = txns.reduce((acc, t) => acc + t.amount, 0);
                break;
            case 'count':
                value = txns.length;
                break;
            case 'avg':
                value = txns.reduce((acc, t) => acc + t.amount, 0) / txns.length;
                break;
            case 'max':
                value = Math.max(...txns.map(t => t.amount));
                break;
            case 'min':
                value = Math.min(...txns.map(t => t.amount));
                break;
        }
        points.push({
            timestamp,
            value,
            transactionCount: txns.length,
            averageAmount: txns.reduce((acc, t) => acc + t.amount, 0) / txns.length,
        });
    }
    return points.sort((a, b) => a.timestamp - b.timestamp);
}
/**
 * Exponential moving average for trend detection
 */
function calculateExponentialMovingAverage(series, alpha = 0.3) {
    if (!series || series.length === 0) {
        return [];
    }
    const ema = [];
    let emaValue = series[0].value;
    for (const point of series) {
        emaValue = alpha * point.value + (1 - alpha) * emaValue;
        ema.push({
            ...point,
            value: emaValue,
        });
    }
    return ema;
}
/**
 * Seasonal decomposition (trend, seasonal, residual)
 */
function seasonalDecomposition(series, seasonalPeriod = 7 // weekly
) {
    if (!series || series.length < seasonalPeriod * 2) {
        return {
            trend: series,
            seasonal: [],
            residual: [],
        };
    }
    // Moving average for trend
    const trend = [];
    for (let i = Math.floor(seasonalPeriod / 2); i < series.length - Math.floor(seasonalPeriod / 2); i++) {
        const window = series.slice(i - Math.floor(seasonalPeriod / 2), i + Math.floor(seasonalPeriod / 2) + 1);
        const avgValue = window.reduce((acc, p) => acc + p.value, 0) / window.length;
        trend.push({
            ...series[i],
            value: avgValue,
        });
    }
    // Seasonal component
    const seasonal = Array(series.length).fill(null).map((_, i) => ({
        ...series[i],
        value: 0,
    }));
    for (let s = 0; s < seasonalPeriod; s++) {
        const seasonalValues = [];
        for (let i = s; i < series.length; i += seasonalPeriod) {
            const trendVal = trend[i] ? trend[i].value : series[i].value;
            seasonalValues.push(series[i].value - trendVal);
        }
        const avgSeasonal = seasonalValues.reduce((a, b) => a + b, 0) / seasonalValues.length;
        for (let i = s; i < series.length; i += seasonalPeriod) {
            seasonal[i].value = avgSeasonal;
        }
    }
    // Residual
    const residual = series.map((point, i) => ({
        ...point,
        value: point.value - (trend[i]?.value || 0) - seasonal[i].value,
    }));
    return { trend, seasonal, residual };
}
/**
 * Calculate autocorrelation for pattern periodicity
 */
function calculateAutocorrelation(series, maxLag = 30) {
    if (!series || series.length < maxLag) {
        return {};
    }
    const mean = series.reduce((acc, p) => acc + p.value, 0) / series.length;
    const variance = series.reduce((acc, p) => acc + Math.pow(p.value - mean, 2), 0) / series.length;
    const autocorr = {};
    for (let lag = 0; lag <= maxLag; lag++) {
        let covariance = 0;
        for (let i = 0; i < series.length - lag; i++) {
            covariance += (series[i].value - mean) * (series[i + lag].value - mean);
        }
        covariance /= series.length - lag;
        autocorr[lag] = variance > 0 ? covariance / variance : 0;
    }
    return autocorr;
}
/**
 * ARIMA-style differencing for stationarity
 */
function differenceTimeSeries(series, order = 1) {
    let current = [...series];
    for (let d = 0; d < order; d++) {
        const differenced = [];
        for (let i = 1; i < current.length; i++) {
            differenced.push({
                ...current[i],
                value: current[i].value - current[i - 1].value,
            });
        }
        current = differenced;
    }
    return current;
}
// ============================================================================
// CLUSTERING ALGORITHMS
// ============================================================================
/**
 * K-means clustering for transaction grouping
 */
function performKMeansClustering(transactions, k = 5, maxIterations = 100) {
    if (!transactions || transactions.length < k) {
        return transactions.map((t, idx) => ({
            clusterId: 0,
            itemId: t.transactionId,
            distance: 0,
            silhouetteScore: 0,
            clusterSize: transactions.length,
            centroid: [0],
        }));
    }
    // Feature extraction
    const features = transactions.map(t => [
        t.amount,
        t.transactionDate.getHours(),
        t.transactionDate.getDay(),
    ]);
    // Initialize centroids randomly
    let centroids = features
        .map((_, i) => i)
        .sort(() => Math.random() - 0.5)
        .slice(0, k)
        .map(i => features[i]);
    let assignments = new Array(transactions.length).fill(0);
    let converged = false;
    let iteration = 0;
    while (!converged && iteration < maxIterations) {
        // Assign to nearest centroid
        const newAssignments = features.map(feature => {
            let minDist = Infinity;
            let cluster = 0;
            for (let c = 0; c < centroids.length; c++) {
                const dist = Math.sqrt(feature.reduce((acc, val, idx) => acc + Math.pow(val - centroids[c][idx], 2), 0));
                if (dist < minDist) {
                    minDist = dist;
                    cluster = c;
                }
            }
            return cluster;
        });
        // Calculate new centroids
        const newCentroids = Array(k)
            .fill(null)
            .map(() => [0, 0, 0]);
        const clusterCounts = new Array(k).fill(0);
        for (let i = 0; i < features.length; i++) {
            const cluster = newAssignments[i];
            newCentroids[cluster] = newCentroids[cluster].map((val, idx) => val + features[i][idx]);
            clusterCounts[cluster]++;
        }
        for (let c = 0; c < k; c++) {
            if (clusterCounts[c] > 0) {
                newCentroids[c] = newCentroids[c].map(val => val / clusterCounts[c]);
            }
        }
        converged = assignments.every((val, idx) => val === newAssignments[idx]);
        assignments = newAssignments;
        centroids = newCentroids;
        iteration++;
    }
    // Calculate cluster sizes and distances
    const clusterSizes = new Array(k).fill(0);
    for (const cluster of assignments) {
        clusterSizes[cluster]++;
    }
    return transactions.map((t, idx) => {
        const clusterId = assignments[idx];
        const feature = features[idx];
        const centroid = centroids[clusterId];
        const distance = Math.sqrt(feature.reduce((acc, val, i) => acc + Math.pow(val - centroid[i], 2), 0));
        return {
            clusterId,
            itemId: t.transactionId,
            distance,
            silhouetteScore: 0.5, // Simplified
            clusterSize: clusterSizes[clusterId],
            centroid,
        };
    });
}
/**
 * DBSCAN clustering for density-based grouping
 */
function performDBSCANClustering(transactions, epsilon = 100, // distance threshold
minPoints = 3) {
    if (!transactions || transactions.length < minPoints) {
        return transactions.map((t, idx) => ({
            clusterId: -1,
            itemId: t.transactionId,
            distance: 0,
            silhouetteScore: 0,
            clusterSize: 1,
            centroid: [t.amount],
        }));
    }
    const features = transactions.map(t => [t.amount, t.transactionDate.getTime()]);
    const visited = new Set();
    const clustered = new Set();
    let clusterId = 0;
    const assignments = new Array(transactions.length).fill(-1);
    function getNeighbors(idx) {
        const neighbors = [];
        for (let i = 0; i < features.length; i++) {
            if (i !== idx) {
                const dist = Math.sqrt(features[idx].reduce((acc, val, j) => acc + Math.pow(val - features[i][j], 2), 0));
                if (dist <= epsilon) {
                    neighbors.push(i);
                }
            }
        }
        return neighbors;
    }
    for (let i = 0; i < features.length; i++) {
        if (!visited.has(i)) {
            visited.add(i);
            const neighbors = getNeighbors(i);
            if (neighbors.length >= minPoints) {
                assignments[i] = clusterId;
                clustered.add(i);
                const queue = [...neighbors];
                while (queue.length > 0) {
                    const current = queue.shift();
                    if (!visited.has(current)) {
                        visited.add(current);
                        const currentNeighbors = getNeighbors(current);
                        if (currentNeighbors.length >= minPoints) {
                            queue.push(...currentNeighbors);
                        }
                    }
                    if (assignments[current] === -1) {
                        assignments[current] = clusterId;
                        clustered.add(current);
                    }
                }
                clusterId++;
            }
        }
    }
    const clusterSizes = new Array(clusterId).fill(0);
    for (const cluster of assignments) {
        if (cluster >= 0) {
            clusterSizes[cluster]++;
        }
    }
    return transactions.map((t, idx) => ({
        clusterId: assignments[idx],
        itemId: t.transactionId,
        distance: 0,
        silhouetteScore: 0.5,
        clusterSize: assignments[idx] >= 0 ? clusterSizes[assignments[idx]] : 1,
        centroid: [t.amount],
    }));
}
/**
 * Hierarchical agglomerative clustering
 */
function performHierarchicalClustering(transactions, numClusters = 5) {
    if (!transactions || transactions.length < numClusters) {
        return transactions.map((t, idx) => ({
            clusterId: idx,
            itemId: t.transactionId,
            distance: 0,
            silhouetteScore: 0,
            clusterSize: 1,
            centroid: [t.amount],
        }));
    }
    const features = transactions.map(t => [t.amount, t.transactionDate.getTime()]);
    let clusters = features.map((feature, idx) => ({
        id: idx,
        members: [idx],
        centroid: feature,
    }));
    while (clusters.length > numClusters) {
        let minDist = Infinity;
        let mergeI = 0;
        let mergeJ = 1;
        for (let i = 0; i < clusters.length; i++) {
            for (let j = i + 1; j < clusters.length; j++) {
                const dist = Math.sqrt(clusters[i].centroid.reduce((acc, val, k) => acc + Math.pow(val - clusters[j].centroid[k], 2), 0));
                if (dist < minDist) {
                    minDist = dist;
                    mergeI = i;
                    mergeJ = j;
                }
            }
        }
        const mergedMembers = [...clusters[mergeI].members, ...clusters[mergeJ].members];
        const newCentroid = mergedMembers.map(idx => {
            let sum = 0;
            for (const member of mergedMembers) {
                sum += features[member][mergedMembers.indexOf(idx)];
            }
            return sum / mergedMembers.length;
        });
        clusters[mergeI] = {
            id: Math.max(...clusters.map(c => c.id)) + 1,
            members: mergedMembers,
            centroid: newCentroid,
        };
        clusters.splice(mergeJ, 1);
    }
    const assignments = new Array(transactions.length).fill(-1);
    for (let clusterIdx = 0; clusterIdx < clusters.length; clusterIdx++) {
        for (const memberIdx of clusters[clusterIdx].members) {
            assignments[memberIdx] = clusterIdx;
        }
    }
    const clusterSizes = new Array(numClusters).fill(0);
    for (const cluster of assignments) {
        if (cluster >= 0) {
            clusterSizes[cluster]++;
        }
    }
    return transactions.map((t, idx) => ({
        clusterId: assignments[idx],
        itemId: t.transactionId,
        distance: 0,
        silhouetteScore: 0.5,
        clusterSize: clusterSizes[assignments[idx]],
        centroid: [t.amount],
    }));
}
// ============================================================================
// BEHAVIORAL PROFILING FUNCTIONS
// ============================================================================
/**
 * Build comprehensive behavioral profile for customer
 */
function buildBehavioralProfile(transactions, lookbackDays = 90) {
    const now = Date.now();
    const lookbackMs = lookbackDays * 24 * 60 * 60 * 1000;
    const relevantTxns = transactions.filter(t => (now - t.timestamp) <= lookbackMs);
    if (relevantTxns.length === 0) {
        return {
            customerId: transactions[0]?.customerId || 'unknown',
            profileId: `profile-${Date.now()}`,
            createdAt: new Date(),
            updatedAt: new Date(),
            averageTransactionAmount: 0,
            medianTransactionAmount: 0,
            stdDevAmount: 0,
            preferredTransactionTypes: {},
            typicalTransactionFrequency: 0,
            geographicDistribution: {},
            temporalPatterns: {},
            averageTransactionsPerDay: 0,
            peakActivityHours: [],
            weekdayVsWeekendRatio: 1,
            riskProfile: 'low',
            confidenceScore: 0,
        };
    }
    const amounts = relevantTxns.map(t => t.amount).sort((a, b) => a - b);
    const mean = amounts.reduce((a, b) => a + b, 0) / amounts.length;
    const median = amounts[Math.floor(amounts.length / 2)];
    const variance = amounts.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / amounts.length;
    const stdDev = Math.sqrt(variance);
    // Transaction types
    const typeCounts = {};
    for (const txn of relevantTxns) {
        typeCounts[txn.transactionType] = (typeCounts[txn.transactionType] || 0) + 1;
    }
    // Temporal patterns
    const hourCounts = new Array(24).fill(0);
    const dayStats = { weekday: 0, weekend: 0 };
    for (const txn of relevantTxns) {
        const date = new Date(txn.timestamp);
        hourCounts[date.getHours()]++;
        if (date.getDay() === 0 || date.getDay() === 6) {
            dayStats.weekend++;
        }
        else {
            dayStats.weekday++;
        }
    }
    const peakActivityHours = hourCounts
        .map((count, hour) => ({ hour, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)
        .map(item => item.hour);
    const weekdayVsWeekendRatio = dayStats.weekday > 0 ? dayStats.weekend / dayStats.weekday : 1;
    // Frequency calculation
    const timeSpanDays = Math.max(1, (Math.max(...relevantTxns.map(t => t.timestamp)) - Math.min(...relevantTxns.map(t => t.timestamp))) / (24 * 60 * 60 * 1000));
    const avgTxnsPerDay = relevantTxns.length / timeSpanDays;
    return {
        customerId: relevantTxns[0].customerId,
        profileId: `profile-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        averageTransactionAmount: mean,
        medianTransactionAmount: median,
        stdDevAmount: stdDev,
        preferredTransactionTypes: typeCounts,
        typicalTransactionFrequency: avgTxnsPerDay,
        geographicDistribution: {},
        temporalPatterns: Object.fromEntries(hourCounts.map((count, hour) => [`hour-${hour}`, count])),
        averageTransactionsPerDay: avgTxnsPerDay,
        peakActivityHours,
        weekdayVsWeekendRatio,
        riskProfile: stdDev > mean ? 'high' : stdDev > mean * 0.5 ? 'medium' : 'low',
        confidenceScore: Math.min(relevantTxns.length / 100, 1),
    };
}
/**
 * Detect dormant account activation
 */
function detectDormantAccountActivation(transactions, dormancyThresholdDays = 180, reactivationAmountMultiplier = 2) {
    if (!transactions || transactions.length < 2) {
        return {
            patternId: `dormancy-${Date.now()}`,
            patternType: 'dormant-reactivation',
            detected: false,
            confidence: 0,
            severity: 'low',
            description: 'Insufficient transaction data',
            matchedTransactions: [],
            detectedAt: new Date(),
            riskScore: 0,
        };
    }
    const sorted = [...transactions].sort((a, b) => a.transactionDate.getTime() - b.transactionDate.getTime());
    const dormancyMs = dormancyThresholdDays * 24 * 60 * 60 * 1000;
    const now = Date.now();
    // Find last active period and gap
    const lastTransaction = sorted[sorted.length - 1];
    const secondLastTransaction = sorted[sorted.length - 2];
    const gap = lastTransaction.timestamp - secondLastTransaction.timestamp;
    const wasDormant = gap > dormancyMs;
    const lastActivityAmount = lastTransaction.amount;
    const priorAvgAmount = sorted.slice(0, -1).reduce((acc, t) => acc + t.amount, 0) / (sorted.length - 1);
    const isAnomalousAmount = lastActivityAmount > priorAvgAmount * reactivationAmountMultiplier;
    const detected = wasDormant && isAnomalousAmount;
    const confidence = detected ? Math.min((gap / dormancyMs) * 0.5 + (lastActivityAmount / (priorAvgAmount * reactivationAmountMultiplier)) * 0.5, 1) : 0;
    return {
        patternId: `dormancy-${Date.now()}`,
        patternType: 'dormant-reactivation',
        detected,
        confidence,
        severity: confidence > 0.7 ? 'high' : 'medium',
        description: `Dormant account reactivation detected after ${Math.floor(gap / (24 * 60 * 60 * 1000))} days with anomalous amount`,
        matchedTransactions: [lastTransaction.transactionId],
        detectedAt: new Date(),
        riskScore: confidence * 0.85,
    };
}
/**
 * Profile account activity seasonality
 */
function analyzeActivitySeasonality(transactions, monthsToAnalyze = 12) {
    if (!transactions || transactions.length < 30) {
        return {
            isHighlySeasonalal: false,
            seasonalityIndex: 0,
            peakMonths: [],
            lowMonths: [],
            seasonalityRatio: 1,
        };
    }
    const monthlyVolumes = {};
    for (const txn of transactions) {
        const date = new Date(txn.timestamp);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        monthlyVolumes[key] = (monthlyVolumes[key] || 0) + txn.amount;
    }
    const volumes = Object.values(monthlyVolumes);
    const mean = volumes.reduce((a, b) => a + b, 0) / volumes.length;
    const variance = volumes.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / volumes.length;
    const stdDev = Math.sqrt(variance);
    const seasonalityIndex = stdDev / mean;
    const isHighlySeasonalal = seasonalityIndex > 0.5;
    const sorted = Object.entries(monthlyVolumes).sort((a, b) => b[1] - a[1]);
    const peakMonths = sorted.slice(0, 3).map(([month]) => month);
    const lowMonths = sorted.slice(-3).map(([month]) => month);
    const seasonalityRatio = volumes[0] > 0 ? Math.max(...volumes) / Math.min(...volumes) : 1;
    return {
        isHighlySeasonalal,
        seasonalityIndex,
        peakMonths,
        lowMonths,
        seasonalityRatio,
        monthlyVolumes,
    };
}
// ============================================================================
// SEQUENCE PATTERN MINING FUNCTIONS
// ============================================================================
/**
 * Detect sequential patterns in transaction sequences (Apriori-like)
 */
function detectSequentialPatterns(transactions, minSupport = 0.2, maxPatternLength = 4) {
    if (!transactions || transactions.length < 5) {
        return [];
    }
    const sorted = [...transactions].sort((a, b) => a.transactionDate.getTime() - b.transactionDate.getTime());
    const minSupportCount = Math.ceil(sorted.length * minSupport);
    const patterns = new Map();
    // Convert transactions to transaction types for pattern matching
    const sequence = sorted.map(t => t.transactionType);
    // Find frequent patterns of increasing lengths
    for (let patternLen = 1; patternLen <= Math.min(maxPatternLength, sequence.length); patternLen++) {
        for (let i = 0; i <= sequence.length - patternLen; i++) {
            const pattern = sequence.slice(i, i + patternLen).join('->');
            patterns.set(pattern, (patterns.get(pattern) || 0) + 1);
        }
    }
    // Filter by support
    const result = [];
    for (const [pattern, count] of patterns.entries()) {
        const support = count / sorted.length;
        if (support >= minSupport) {
            result.push({
                pattern: pattern.split('->'),
                support,
                confidence: count / sorted.length,
            });
        }
    }
    return result.sort((a, b) => b.support - a.support);
}
/**
 * Detect repeated transaction sequences (same amounts in order)
 */
function detectRepeatedSequences(transactions, minSequenceLength = 3, timeWindowDays = 30, tolerance = 0.05) {
    if (!transactions || transactions.length < minSequenceLength) {
        return [];
    }
    const results = [];
    const sorted = [...transactions].sort((a, b) => a.transactionDate.getTime() - b.transactionDate.getTime());
    for (let start = 0; start < sorted.length - minSequenceLength; start++) {
        const sequence = sorted.slice(start, start + minSequenceLength);
        const amounts = sequence.map(t => t.amount);
        const timeSpan = (sequence[sequence.length - 1].timestamp - sequence[0].timestamp) / (24 * 60 * 60 * 1000);
        if (timeSpan > timeWindowDays) {
            continue;
        }
        let matchCount = 0;
        const matches = [];
        for (let i = start + minSequenceLength; i < sorted.length - minSequenceLength; i++) {
            const potentialMatch = sorted.slice(i, i + minSequenceLength);
            const matchAmounts = potentialMatch.map(t => t.amount);
            let isMatch = true;
            for (let j = 0; j < amounts.length; j++) {
                const diff = Math.abs(matchAmounts[j] - amounts[j]) / amounts[j];
                if (diff > tolerance) {
                    isMatch = false;
                    break;
                }
            }
            if (isMatch) {
                matchCount++;
                matches.push(...potentialMatch.map(t => t.transactionId));
            }
        }
        if (matchCount > 0) {
            const confidence = Math.min(matchCount / sorted.length, 1);
            results.push({
                patternId: `repeated-seq-${start}-${Date.now()}`,
                patternType: 'repeated-sequence',
                detected: true,
                confidence,
                severity: confidence > 0.5 ? 'high' : 'medium',
                description: `Repeated sequence pattern with ${matchCount} occurrences`,
                matchedTransactions: [...sequence.map(t => t.transactionId), ...matches],
                detectedAt: new Date(),
                riskScore: confidence * 0.7,
            });
        }
    }
    return results;
}
/**
 * Mining burst patterns (sudden activity spikes)
 */
function detectActivityBursts(transactions, baselineWindowDays = 30, burstMultiplier = 3, detectionWindowDays = 7) {
    if (!transactions || transactions.length < 10) {
        return {
            patternId: `burst-${Date.now()}`,
            patternType: 'activity-burst',
            detected: false,
            confidence: 0,
            severity: 'low',
            description: 'Insufficient data for burst detection',
            matchedTransactions: [],
            detectedAt: new Date(),
            riskScore: 0,
        };
    }
    const sorted = [...transactions].sort((a, b) => a.transactionDate.getTime() - b.transactionDate.getTime());
    const now = sorted[sorted.length - 1].timestamp;
    // Baseline from lookback window
    const baselineMs = baselineWindowDays * 24 * 60 * 60 * 1000;
    const baselineTxns = sorted.filter(t => (now - t.timestamp) > baselineMs && (now - t.timestamp) < baselineMs * 2);
    // Detection window
    const detectionMs = detectionWindowDays * 24 * 60 * 60 * 1000;
    const recentTxns = sorted.filter(t => (now - t.timestamp) <= detectionMs);
    if (baselineTxns.length === 0) {
        return {
            patternId: `burst-${Date.now()}`,
            patternType: 'activity-burst',
            detected: false,
            confidence: 0,
            severity: 'low',
            description: 'Insufficient baseline data',
            matchedTransactions: [],
            detectedAt: new Date(),
            riskScore: 0,
        };
    }
    const baselineCount = baselineTxns.length / baselineWindowDays;
    const recentCount = recentTxns.length / detectionWindowDays;
    const burstRatio = recentCount / Math.max(baselineCount, 1);
    const isBurst = burstRatio >= burstMultiplier;
    const confidence = Math.min(burstRatio / (burstMultiplier * 2), 1);
    return {
        patternId: `burst-${Date.now()}`,
        patternType: 'activity-burst',
        detected: isBurst,
        confidence,
        severity: confidence > 0.8 ? 'critical' : confidence > 0.5 ? 'high' : 'medium',
        description: `Activity burst detected: ${recentCount.toFixed(2)} txns/day vs ${baselineCount.toFixed(2)} baseline`,
        matchedTransactions: recentTxns.map(t => t.transactionId),
        detectedAt: new Date(),
        riskScore: confidence * 0.9,
    };
}
// ============================================================================
// CIRCULAR TRANSACTION DETECTION
// ============================================================================
/**
 * Detect circular/round-tripping transactions (money flowing in circle)
 */
function detectCircularTransactions(transactions, lookbackDays = 30, circulationThresholdPercent = 80) {
    if (!transactions || transactions.length < 4) {
        return {
            patternId: `circular-${Date.now()}`,
            patternType: 'circular-transaction',
            detected: false,
            confidence: 0,
            severity: 'low',
            description: 'Insufficient transaction data',
            matchedTransactions: [],
            detectedAt: new Date(),
            riskScore: 0,
        };
    }
    const now = Date.now();
    const lookbackMs = lookbackDays * 24 * 60 * 60 * 1000;
    const relevant = transactions.filter(t => (now - t.timestamp) <= lookbackMs);
    // Build account graph
    const graph = new Map();
    for (const txn of relevant) {
        const from = txn.originatorInfo.accountNumber || txn.accountId;
        const to = txn.beneficiaryInfo.accountNumber || 'external';
        if (!graph.has(from)) {
            graph.set(from, new Map());
        }
        graph.get(from).set(to, (graph.get(from).get(to) || 0) + txn.amount);
    }
    // Detect circles (simple: A->B, B->A)
    let circularAmount = 0;
    const circularTxns = [];
    for (const [from, toMap] of graph.entries()) {
        for (const [to, amount] of toMap.entries()) {
            if (to !== 'external' && graph.has(to)) {
                const reverseAmount = graph.get(to).get(from) || 0;
                if (reverseAmount > 0) {
                    const circulating = Math.min(amount, reverseAmount);
                    circularAmount += circulating;
                    circularTxns.push(...relevant.filter(t => (t.originatorInfo.accountNumber === from && t.beneficiaryInfo.accountNumber === to) ||
                        (t.originatorInfo.accountNumber === to && t.beneficiaryInfo.accountNumber === from)).map(t => t.transactionId));
                }
            }
        }
    }
    const totalAmount = relevant.reduce((acc, t) => acc + t.amount, 0);
    const circulatingPercent = totalAmount > 0 ? (circularAmount / totalAmount) * 100 : 0;
    const detected = circulatingPercent >= circulationThresholdPercent;
    const confidence = Math.min(circulatingPercent / (circulationThresholdPercent * 2), 1);
    return {
        patternId: `circular-${Date.now()}`,
        patternType: 'circular-transaction',
        detected,
        confidence,
        severity: confidence > 0.7 ? 'critical' : 'high',
        description: `Circular transactions detected: ${circulatingPercent.toFixed(2)}% of volume`,
        matchedTransactions: circularTxns,
        detectedAt: new Date(),
        riskScore: confidence * 0.95,
        metadata: { circulatingPercent, circularAmount, totalAmount },
    };
}
/**
 * Multi-leg circular path detection (complex ring patterns)
 */
function detectMultiLegCircularPaths(transactions, minPathLength = 3, lookbackDays = 30) {
    if (!transactions || transactions.length < minPathLength) {
        return [];
    }
    const results = [];
    const now = Date.now();
    const lookbackMs = lookbackDays * 24 * 60 * 60 * 1000;
    const relevant = transactions.filter(t => (now - t.timestamp) <= lookbackMs);
    // Build directed graph
    const graph = new Map();
    for (const txn of relevant) {
        const from = txn.originatorInfo.accountNumber || txn.accountId;
        const to = txn.beneficiaryInfo.accountNumber || 'external';
        if (!graph.has(from)) {
            graph.set(from, []);
        }
        graph.get(from).push({ to, txn });
    }
    // DFS to find cycles
    function findCycles(start, path, visited, cycle) {
        if (path.length === 0) {
            visited.clear();
        }
        visited.add(start);
        path.push(start);
        if (graph.has(start)) {
            for (const edge of graph.get(start)) {
                if (edge.to === path[0] && path.length >= minPathLength) {
                    // Found cycle
                    const totalAmount = cycle.reduce((acc, t) => acc + t.amount, 0);
                    const confidence = Math.min((path.length / 10) * 0.7 + (totalAmount / 1000000) * 0.3, 1);
                    results.push({
                        patternId: `multileg-${Date.now()}-${Math.random()}`,
                        patternType: 'multi-leg-circular',
                        detected: true,
                        confidence,
                        severity: confidence > 0.7 ? 'critical' : 'high',
                        description: `${path.length}-leg circular path: ${path.join('->')}`,
                        matchedTransactions: cycle.map(t => t.transactionId),
                        detectedAt: new Date(),
                        riskScore: confidence * 0.95,
                    });
                }
                else if (!visited.has(edge.to)) {
                    findCycles(edge.to, [...path], new Set(visited), [...cycle, edge.txn]);
                }
            }
        }
        visited.delete(start);
    }
    for (const start of graph.keys()) {
        findCycles(start, [], new Set(), []);
    }
    return results;
}
// ============================================================================
// KITING DETECTION FUNCTIONS
// ============================================================================
/**
 * Detect check kiting patterns (writing checks before deposits clear)
 */
function detectCheckKiting(transactions, checkClearanceDays = 2, lookbackDays = 30) {
    if (!transactions || transactions.length < 4) {
        return {
            patternId: `kiting-${Date.now()}`,
            patternType: 'check-kiting',
            detected: false,
            confidence: 0,
            severity: 'low',
            description: 'Insufficient transaction data',
            matchedTransactions: [],
            detectedAt: new Date(),
            riskScore: 0,
        };
    }
    const now = Date.now();
    const lookbackMs = lookbackDays * 24 * 60 * 60 * 1000;
    const relevant = transactions.filter(t => (now - t.timestamp) <= lookbackMs);
    const sorted = relevant.sort((a, b) => a.transactionDate.getTime() - b.transactionDate.getTime());
    const checkClearanceMs = checkClearanceDays * 24 * 60 * 60 * 1000;
    let kitingIndicators = 0;
    let runningBalance = 0;
    const kitingTxns = [];
    for (let i = 0; i < sorted.length; i++) {
        const txn = sorted[i];
        runningBalance += txn.transactionType === 'credit' ? txn.amount : -txn.amount;
        // Check if checks written before deposits clear
        if (txn.transactionType === 'check' || txn.transactionType === 'debit') {
            const futureDeposits = sorted
                .slice(i + 1)
                .filter(t => t.transactionType === 'credit' || t.transactionType === 'deposit')
                .filter(t => (t.timestamp - txn.timestamp) <= checkClearanceMs)
                .reduce((acc, t) => acc + t.amount, 0);
            if (futureDeposits > 0 && runningBalance < 0) {
                kitingIndicators++;
                kitingTxns.push(txn.transactionId);
            }
        }
    }
    const kitingRatio = sorted.length > 0 ? kitingIndicators / sorted.length : 0;
    const detected = kitingRatio > 0.2;
    const confidence = Math.min(kitingRatio, 1);
    return {
        patternId: `kiting-${Date.now()}`,
        patternType: 'check-kiting',
        detected,
        confidence,
        severity: confidence > 0.7 ? 'critical' : confidence > 0.4 ? 'high' : 'medium',
        description: `Check kiting indicators detected: ${kitingIndicators} suspicious patterns`,
        matchedTransactions: kitingTxns,
        detectedAt: new Date(),
        riskScore: confidence * 0.9,
    };
}
/**
 * Detect ACH kiting patterns (rapid back-and-forth ACH transfers)
 */
function detectACHKiting(transactions, lookbackDays = 30, rapidityThresholdHours = 24, minOccurrences = 2) {
    if (!transactions || transactions.length < 4) {
        return {
            patternId: `ach-kiting-${Date.now()}`,
            patternType: 'ach-kiting',
            detected: false,
            confidence: 0,
            severity: 'low',
            description: 'Insufficient transaction data',
            matchedTransactions: [],
            detectedAt: new Date(),
            riskScore: 0,
        };
    }
    const now = Date.now();
    const lookbackMs = lookbackDays * 24 * 60 * 60 * 1000;
    const relevant = transactions.filter(t => (now - t.timestamp) <= lookbackMs && (t.transactionType === 'ach' || t.transactionType === 'transfer'));
    const rapidityMs = rapidityThresholdHours * 60 * 60 * 1000;
    let kitingPatterns = 0;
    const kitingTxns = [];
    for (let i = 0; i < relevant.length - 1; i++) {
        const txn1 = relevant[i];
        for (let j = i + 1; j < relevant.length; j++) {
            const txn2 = relevant[j];
            const timeDiff = Math.abs(txn2.timestamp - txn1.timestamp);
            // Same amount, opposite direction, rapid timing
            if (Math.abs(txn1.amount - txn2.amount) < txn1.amount * 0.05 &&
                txn1.transactionType === txn2.transactionType &&
                timeDiff <= rapidityMs &&
                txn1.originatorInfo.accountNumber === txn2.beneficiaryInfo.accountNumber) {
                kitingPatterns++;
                kitingTxns.push(txn1.transactionId, txn2.transactionId);
            }
        }
    }
    const detected = kitingPatterns >= minOccurrences;
    const confidence = Math.min((kitingPatterns / Math.max(relevant.length, 1)) * 2, 1);
    return {
        patternId: `ach-kiting-${Date.now()}`,
        patternType: 'ach-kiting',
        detected,
        confidence,
        severity: confidence > 0.7 ? 'critical' : 'high',
        description: `ACH kiting patterns detected: ${kitingPatterns} back-and-forth pairs`,
        matchedTransactions: kitingTxns,
        detectedAt: new Date(),
        riskScore: confidence * 0.85,
    };
}
// ============================================================================
// PASS-THROUGH ACCOUNT IDENTIFICATION
// ============================================================================
/**
 * Detect pass-through accounts (money comes in and immediately goes out)
 */
function detectPassThroughAccounts(transactions, lookbackDays = 30, passThresholdPercent = 80, timeWindowHours = 24) {
    if (!transactions || transactions.length < 4) {
        return {
            patternId: `passthrough-${Date.now()}`,
            patternType: 'pass-through-account',
            detected: false,
            confidence: 0,
            severity: 'low',
            description: 'Insufficient transaction data',
            matchedTransactions: [],
            detectedAt: new Date(),
            riskScore: 0,
        };
    }
    const now = Date.now();
    const lookbackMs = lookbackDays * 24 * 60 * 60 * 1000;
    const relevant = transactions.filter(t => (now - t.timestamp) <= lookbackMs);
    const timeWindowMs = timeWindowHours * 60 * 60 * 1000;
    let passedAmount = 0;
    const passTxns = [];
    // Group by account
    const byAccount = new Map();
    for (const txn of relevant) {
        const accountId = txn.accountId;
        if (!byAccount.has(accountId)) {
            byAccount.set(accountId, []);
        }
        byAccount.get(accountId).push(txn);
    }
    for (const txns of byAccount.values()) {
        const inbound = txns.filter(t => t.transactionType === 'credit' || t.transactionType === 'deposit');
        const outbound = txns.filter(t => t.transactionType === 'debit' || t.transactionType === 'transfer' || t.transactionType === 'wire');
        const inboundAmount = inbound.reduce((acc, t) => acc + t.amount, 0);
        const outboundAmount = outbound.reduce((acc, t) => acc + t.amount, 0);
        // Check if money exits shortly after entering
        for (const inTxn of inbound) {
            const closeExits = outbound.filter(t => (t.timestamp - inTxn.timestamp) >= 0 && (t.timestamp - inTxn.timestamp) <= timeWindowMs);
            const exitAmount = closeExits.reduce((acc, t) => acc + t.amount, 0);
            if (exitAmount > inTxn.amount * 0.8) {
                passedAmount += Math.min(inTxn.amount, exitAmount);
                passTxns.push(...closeExits.map(t => t.transactionId));
            }
        }
    }
    const totalInboundAmount = relevant.filter(t => t.transactionType === 'credit' || t.transactionType === 'deposit')
        .reduce((acc, t) => acc + t.amount, 0);
    const passPercent = totalInboundAmount > 0 ? (passedAmount / totalInboundAmount) * 100 : 0;
    const detected = passPercent >= passThresholdPercent;
    const confidence = Math.min(passPercent / (passThresholdPercent * 2), 1);
    return {
        patternId: `passthrough-${Date.now()}`,
        patternType: 'pass-through-account',
        detected,
        confidence,
        severity: confidence > 0.7 ? 'critical' : 'high',
        description: `Pass-through behavior detected: ${passPercent.toFixed(2)}% of inbound funds rapidly transferred out`,
        matchedTransactions: passTxns,
        detectedAt: new Date(),
        riskScore: confidence * 0.9,
    };
}
/**
 * Detect shell company patterns (activity without apparent business purpose)
 */
function detectShellAccountPatterns(transactions, profile, lookbackDays = 90) {
    if (!transactions || transactions.length < 5) {
        return {
            patternId: `shell-${Date.now()}`,
            patternType: 'shell-account',
            detected: false,
            confidence: 0,
            severity: 'low',
            description: 'Insufficient transaction data',
            matchedTransactions: [],
            detectedAt: new Date(),
            riskScore: 0,
        };
    }
    let shellIndicators = 0;
    const maxIndicators = 5;
    // Lack of consistent transaction type diversity
    const typeCount = Object.keys(profile.preferredTransactionTypes).length;
    if (typeCount <= 2) {
        shellIndicators++;
    }
    // Highly variable amounts (suggests pass-through)
    const coefficientOfVariation = profile.stdDevAmount / profile.averageTransactionAmount;
    if (coefficientOfVariation > 1) {
        shellIndicators++;
    }
    // Very low frequency or very high frequency without pattern
    if (profile.averageTransactionsPerDay < 0.5 || profile.averageTransactionsPerDay > 50) {
        shellIndicators++;
    }
    // No clear temporal pattern
    const peakActivityHours = profile.peakActivityHours;
    if (peakActivityHours.length === 0 || peakActivityHours.length > 20) {
        shellIndicators++;
    }
    // Weekday/weekend ratio too extreme
    if (profile.weekdayVsWeekendRatio < 0.1 || profile.weekdayVsWeekendRatio > 10) {
        shellIndicators++;
    }
    const confidence = Math.min(shellIndicators / maxIndicators, 1);
    const detected = confidence > 0.6;
    return {
        patternId: `shell-${Date.now()}`,
        patternType: 'shell-account',
        detected,
        confidence,
        severity: confidence > 0.8 ? 'critical' : confidence > 0.5 ? 'high' : 'medium',
        description: `Shell account indicators: ${shellIndicators}/${maxIndicators} factors present`,
        matchedTransactions: transactions.map(t => t.transactionId),
        detectedAt: new Date(),
        riskScore: confidence * 0.85,
    };
}
// ============================================================================
// UNUSUAL FREQUENCY PATTERN FUNCTIONS
// ============================================================================
/**
 * Detect unusual transaction frequency patterns
 */
function detectFrequencyAnomalies(transactions, lookbackDays = 30, frequencyThresholdMultiplier = 2.5) {
    if (!transactions || transactions.length < 5) {
        return [];
    }
    const now = Date.now();
    const lookbackMs = lookbackDays * 24 * 60 * 60 * 1000;
    const relevantTxns = transactions.filter(t => (now - t.timestamp) <= lookbackMs);
    if (relevantTxns.length === 0) {
        return [];
    }
    // Calculate daily frequency
    const dailyFrequencies = {};
    for (const txn of relevantTxns) {
        const dateKey = new Date(txn.timestamp).toISOString().split('T')[0];
        dailyFrequencies[dateKey] = (dailyFrequencies[dateKey] || 0) + 1;
    }
    const frequencies = Object.values(dailyFrequencies);
    const mean = frequencies.reduce((a, b) => a + b, 0) / frequencies.length;
    const variance = frequencies.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / frequencies.length;
    const stdDev = Math.sqrt(variance);
    const threshold = mean + (stdDev * frequencyThresholdMultiplier);
    return transactions.map(t => {
        const dateKey = new Date(t.timestamp).toISOString().split('T')[0];
        const dayFrequency = dailyFrequencies[dateKey] || 0;
        const isAnomaly = dayFrequency > threshold;
        const zScore = stdDev > 0 ? (dayFrequency - mean) / stdDev : 0;
        return {
            accountId: t.accountId,
            transactionId: t.transactionId,
            anomalyType: 'frequency',
            isAnomaly,
            anomalyScore: Math.min(Math.abs(zScore) / frequencyThresholdMultiplier, 1),
            expectedBehavior: `${mean.toFixed(0)} transactions per day`,
            comparableAverage: mean,
            comparableStdDev: stdDev,
            zScore,
        };
    });
}
/**
 * Detect unusual inter-transaction timing patterns
 */
function detectTimingAnomalies(transactions, timeWindowMinutes = 60, burstThreshold = 5) {
    if (!transactions || transactions.length < 3) {
        return {
            patternId: `timing-${Date.now()}`,
            patternType: 'timing-anomaly',
            detected: false,
            confidence: 0,
            severity: 'low',
            description: 'Insufficient data',
            matchedTransactions: [],
            detectedAt: new Date(),
            riskScore: 0,
        };
    }
    const sorted = [...transactions].sort((a, b) => a.timestamp - b.timestamp);
    const timeWindowMs = timeWindowMinutes * 60 * 1000;
    let burstCount = 0;
    const burstTxns = [];
    for (let i = 0; i < sorted.length - 1; i++) {
        let burstSize = 1;
        for (let j = i + 1; j < sorted.length && (sorted[j].timestamp - sorted[i].timestamp) <= timeWindowMs; j++) {
            burstSize++;
        }
        if (burstSize >= burstThreshold) {
            burstCount++;
            for (let j = i; j < i + burstSize && j < sorted.length; j++) {
                burstTxns.push(sorted[j].transactionId);
            }
        }
    }
    const confidence = Math.min((burstCount / sorted.length) * 2, 1);
    const detected = confidence > 0.3;
    return {
        patternId: `timing-${Date.now()}`,
        patternType: 'timing-anomaly',
        detected,
        confidence,
        severity: confidence > 0.7 ? 'high' : 'medium',
        description: `Timing anomalies: ${burstCount} burst patterns detected`,
        matchedTransactions: burstTxns,
        detectedAt: new Date(),
        riskScore: confidence * 0.6,
    };
}
// ============================================================================
// PEER GROUP COMPARISON FUNCTIONS
// ============================================================================
/**
 * Perform peer group analysis and comparison
 */
function analyzePeerGroupComparison(customerProfile, peerProfiles, percentileThreshold = 90) {
    if (!peerProfiles || peerProfiles.length === 0) {
        return {
            customerId: customerProfile.customerId,
            peerGroupId: 'empty',
            peerGroupSize: 0,
            comparisonMetrics: {
                averageAmountPercentile: 50,
                frequencyPercentile: 50,
                volumePercentile: 50,
                deviationFromGroupMean: 0,
                groupStandardDeviation: 0,
            },
            outlierStatus: 'not_outlier',
            similarMembers: [],
            dissimilarMembers: [],
        };
    }
    const allProfiles = [...peerProfiles, customerProfile];
    const amounts = allProfiles.map(p => p.averageTransactionAmount);
    const frequencies = allProfiles.map(p => p.averageTransactionsPerDay);
    const volumes = allProfiles.map(p => p.averageTransactionAmount * p.averageTransactionsPerDay);
    // Calculate percentiles
    const customerAmountRank = amounts.filter(a => a <= customerProfile.averageTransactionAmount).length;
    const customerFreqRank = frequencies.filter(f => f <= customerProfile.averageTransactionsPerDay).length;
    const customerVolumeRank = volumes.filter(v => v <= (customerProfile.averageTransactionAmount * customerProfile.averageTransactionsPerDay)).length;
    const avgAmount = amounts.reduce((a, b) => a + b, 0) / amounts.length;
    const avgFreq = frequencies.reduce((a, b) => a + b, 0) / frequencies.length;
    const avgVolume = volumes.reduce((a, b) => a + b, 0) / volumes.length;
    const varAmount = amounts.reduce((acc, val) => acc + Math.pow(val - avgAmount, 2), 0) / amounts.length;
    const varFreq = frequencies.reduce((acc, val) => acc + Math.pow(val - avgFreq, 2), 0) / frequencies.length;
    const stdDevAmount = Math.sqrt(varAmount);
    const stdDevFreq = Math.sqrt(varFreq);
    const deviationFromMeanAmount = stdDevAmount > 0 ? (customerProfile.averageTransactionAmount - avgAmount) / stdDevAmount : 0;
    // Identify similar/dissimilar members
    const distances = peerProfiles.map(p => {
        const amountDiff = Math.abs(p.averageTransactionAmount - customerProfile.averageTransactionAmount);
        const freqDiff = Math.abs(p.averageTransactionsPerDay - customerProfile.averageTransactionsPerDay);
        return { customerId: p.customerId, distance: amountDiff + freqDiff };
    });
    distances.sort((a, b) => a.distance - b.distance);
    const similarMembers = distances.slice(0, Math.ceil(distances.length * 0.2)).map(d => d.customerId);
    const dissimilarMembers = distances.slice(Math.floor(distances.length * 0.8)).map(d => d.customerId);
    // Outlier detection
    let outlierStatus = 'not_outlier';
    if (Math.abs(deviationFromMeanAmount) > 2 && Math.abs(deviationFromMeanAmount) <= 3) {
        outlierStatus = 'mild_outlier';
    }
    else if (Math.abs(deviationFromMeanAmount) > 3 && Math.abs(deviationFromMeanAmount) <= 4) {
        outlierStatus = 'moderate_outlier';
    }
    else if (Math.abs(deviationFromMeanAmount) > 4) {
        outlierStatus = 'severe_outlier';
    }
    return {
        customerId: customerProfile.customerId,
        peerGroupId: `peer-group-${Date.now()}`,
        peerGroupSize: peerProfiles.length,
        comparisonMetrics: {
            averageAmountPercentile: (customerAmountRank / allProfiles.length) * 100,
            frequencyPercentile: (customerFreqRank / allProfiles.length) * 100,
            volumePercentile: (customerVolumeRank / allProfiles.length) * 100,
            deviationFromGroupMean: deviationFromMeanAmount,
            groupStandardDeviation: stdDevAmount,
        },
        outlierStatus,
        similarMembers,
        dissimilarMembers,
    };
}
// ============================================================================
// STATISTICAL OUTLIER DETECTION
// ============================================================================
/**
 * Mahalanobis distance-based multivariate outlier detection
 */
function detectMultivariateOutliers(transactions, threshold = 3, lookbackDays = 90) {
    if (!transactions || transactions.length < 5) {
        return transactions.map(t => ({
            accountId: t.accountId,
            transactionId: t.transactionId,
            anomalyType: 'multivariate',
            isAnomaly: false,
            anomalyScore: 0,
            expectedBehavior: 'Insufficient data',
            comparableAverage: 0,
            comparableStdDev: 0,
            zScore: 0,
        }));
    }
    const now = Date.now();
    const lookbackMs = lookbackDays * 24 * 60 * 60 * 1000;
    const historical = transactions.filter(t => (now - t.timestamp) <= lookbackMs);
    // Feature vectors: [amount, hour, dayOfWeek]
    const features = historical.map(t => {
        const date = new Date(t.timestamp);
        return [t.amount, date.getHours(), date.getDay()];
    });
    if (features.length < 3) {
        return transactions.map(t => ({
            accountId: t.accountId,
            transactionId: t.transactionId,
            anomalyType: 'multivariate',
            isAnomaly: false,
            anomalyScore: 0,
            expectedBehavior: 'Insufficient historical data',
            comparableAverage: 0,
            comparableStdDev: 0,
            zScore: 0,
        }));
    }
    // Calculate means
    const means = [0, 0, 0];
    for (const feature of features) {
        means[0] += feature[0];
        means[1] += feature[1];
        means[2] += feature[2];
    }
    means[0] /= features.length;
    means[1] /= features.length;
    means[2] /= features.length;
    // Calculate covariance (simplified)
    const cov = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
    ];
    for (const feature of features) {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                cov[i][j] += (feature[i] - means[i]) * (feature[j] - means[j]);
            }
        }
    }
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            cov[i][j] /= features.length;
        }
    }
    return transactions.map(t => {
        const date = new Date(t.timestamp);
        const feature = [t.amount, date.getHours(), date.getDay()];
        // Simplified Mahalanobis (using diagonal approximation)
        let distance = 0;
        for (let i = 0; i < 3; i++) {
            const variance = Math.max(cov[i][i], 1);
            distance += Math.pow((feature[i] - means[i]) / Math.sqrt(variance), 2);
        }
        distance = Math.sqrt(distance);
        const isAnomaly = distance > threshold;
        const anomalyScore = Math.min(distance / (threshold * 2), 1);
        return {
            accountId: t.accountId,
            transactionId: t.transactionId,
            anomalyType: 'multivariate',
            isAnomaly,
            anomalyScore,
            expectedBehavior: `Multivariate distance < ${threshold}`,
            comparableAverage: means[0],
            comparableStdDev: Math.sqrt(cov[0][0]),
            zScore: (distance - 1.5) / 0.5,
        };
    });
}
/**
 * Quantile-based outlier detection
 */
function detectQuantileOutliers(transactions, lowerQuantile = 0.25, upperQuantile = 0.75, iqrMultiplier = 1.5) {
    if (!transactions || transactions.length < 4) {
        return [];
    }
    const amounts = transactions.map(t => t.amount).sort((a, b) => a - b);
    const q1Idx = Math.floor(amounts.length * lowerQuantile);
    const q3Idx = Math.floor(amounts.length * upperQuantile);
    const q1 = amounts[q1Idx];
    const q3 = amounts[q3Idx];
    const iqr = q3 - q1;
    const lowerBound = q1 - (iqr * iqrMultiplier);
    const upperBound = q3 + (iqr * iqrMultiplier);
    return transactions.map(t => {
        const isOutlier = t.amount < lowerBound || t.amount > upperBound;
        const distance = t.amount < lowerBound ? lowerBound - t.amount : t.amount > upperBound ? t.amount - upperBound : 0;
        const anomalyScore = Math.min(distance / (iqr * iqrMultiplier), 1);
        return {
            accountId: t.accountId,
            transactionId: t.transactionId,
            anomalyType: 'quantile',
            isAnomaly: isOutlier,
            anomalyScore,
            expectedBehavior: `Between ${lowerBound} and ${upperBound}`,
            comparableAverage: (q1 + q3) / 2,
            comparableStdDev: iqr,
            zScore: distance > 0 ? distance / (iqr * iqrMultiplier) : 0,
        };
    });
}
// ============================================================================
// MACHINE LEARNING PATTERN DETECTION
// ============================================================================
/**
 * Simple neural network-inspired pattern detection
 */
function detectMLPatterns(transactions, modelVersion = '1.0', confidenceThreshold = 0.7) {
    if (!transactions || transactions.length < 10) {
        return [];
    }
    const results = [];
    // Feature engineering
    const features = transactions.map(t => {
        const date = new Date(t.timestamp);
        return {
            amount: t.amount,
            hour: date.getHours(),
            dayOfWeek: date.getDay(),
            type: t.transactionType,
            txn: t,
        };
    });
    // Simple clustering-based pattern detection
    const clusters = performKMeansClustering(transactions, 4);
    const clusterProfiles = new Map();
    for (const cluster of clusters) {
        if (!clusterProfiles.has(cluster.clusterId)) {
            clusterProfiles.set(cluster.clusterId, {
                size: 0,
                amounts: [],
                hours: [],
                types: [],
            });
        }
        const profile = clusterProfiles.get(cluster.clusterId);
        const txn = transactions.find(t => t.transactionId === cluster.itemId);
        if (txn) {
            profile.size++;
            profile.amounts.push(txn.amount);
            profile.hours.push(new Date(txn.timestamp).getHours());
            profile.types.push(txn.transactionType);
        }
    }
    // Detect suspicious patterns in clusters
    for (const [clusterId, profile] of clusterProfiles.entries()) {
        const typeVariety = new Set(profile.types).size;
        const amountVariance = profile.amounts.length > 1
            ? Math.sqrt(profile.amounts.reduce((acc, val) => {
                const mean = profile.amounts.reduce((a, b) => a + b, 0) / profile.amounts.length;
                return acc + Math.pow(val - mean, 2);
            }, 0) / profile.amounts.length)
            : 0;
        if (typeVariety === 1 && amountVariance > 0) {
            const confidence = Math.min(0.8, amountVariance / (profile.amounts[0] || 1));
            if (confidence > confidenceThreshold) {
                results.push({
                    patternId: `ml-cluster-${clusterId}-${Date.now()}`,
                    patternType: 'ml-detected-pattern',
                    detected: true,
                    confidence,
                    severity: confidence > 0.85 ? 'high' : 'medium',
                    description: `ML-detected pattern in cluster ${clusterId}: Uniform type with variable amounts`,
                    matchedTransactions: transactions
                        .filter(t => clusters.find(c => c.itemId === t.transactionId && c.clusterId === clusterId))
                        .map(t => t.transactionId),
                    detectedAt: new Date(),
                    riskScore: confidence * 0.75,
                    metadata: {
                        modelVersion,
                        clusterSize: profile.size,
                        typeVariety,
                        amountVariance,
                    },
                });
            }
        }
    }
    return results;
}
/**
 * Random Forest-inspired ensemble pattern detection
 */
function detectEnsemblePatterns(transactions, numTrees = 10, confidenceThreshold = 0.6) {
    if (!transactions || transactions.length < 5) {
        return [];
    }
    const results = [];
    const voteMatrix = new Map();
    // Multiple detection algorithms voting
    const detectors = [
        () => detectStatisticalAnomalies(transactions, 2, 90),
        () => detectIsolationForestAnomalies(transactions, 0.1, 5),
        () => detectMultivariateOutliers(transactions, 2.5, 90),
        () => detectQuantileOutliers(transactions, 0.25, 0.75, 1.5),
    ];
    // Run all detectors and aggregate votes
    for (const detector of detectors) {
        const detections = detector();
        for (const detection of detections) {
            if (detection.isAnomaly) {
                const key = detection.transactionId;
                voteMatrix.set(key, (voteMatrix.get(key) || 0) + detection.anomalyScore);
            }
        }
    }
    // Convert votes to pattern detections
    for (const [txnId, voteScore] of voteMatrix.entries()) {
        const confidence = Math.min(voteScore / detectors.length, 1);
        if (confidence >= confidenceThreshold) {
            results.push({
                patternId: `ensemble-${txnId}-${Date.now()}`,
                patternType: 'ensemble-detected',
                detected: true,
                confidence,
                severity: confidence > 0.85 ? 'critical' : confidence > 0.7 ? 'high' : 'medium',
                description: `Ensemble pattern detection: ${(voteScore * 100).toFixed(0)}% detector agreement`,
                matchedTransactions: [txnId],
                detectedAt: new Date(),
                riskScore: confidence * 0.8,
            });
        }
    }
    return results;
}
/**
 * Anomaly score ranking and prioritization
 */
function rankAnomaliesByRiskScore(anomalies, weightFactors = {}) {
    const defaults = {
        anomalyScore: 0.7,
        zScore: 0.2,
        frequencyWeight: 0.1,
    };
    const weights = { ...defaults, ...weightFactors };
    return anomalies
        .map(anomaly => ({
        ...anomaly,
        finalRiskScore: (Math.min(Math.abs(anomaly.zScore) / 4, 1) * weights.zScore +
            anomaly.anomalyScore * weights.anomalyScore) /
            (weights.zScore + weights.anomalyScore),
    }))
        .sort((a, b) => b.finalRiskScore - a.finalRiskScore);
}
// ============================================================================
// UTILITY & CONSOLIDATION FUNCTIONS (4 additional functions)
// ============================================================================
/**
 * Calculate comprehensive risk score for account based on all patterns
 */
function calculateAccountRiskScore(patterns, anomalies, weights = {}) {
    const defaultWeights = {
        circular: 0.15,
        kiting: 0.15,
        passthrough: 0.12,
        dormancy: 0.10,
        statistical: 0.10,
        behavioral: 0.10,
        burst: 0.10,
        frequency: 0.08,
        other: 0.10,
    };
    const finalWeights = { ...defaultWeights, ...weights };
    let totalScore = 0;
    for (const pattern of patterns) {
        const weight = finalWeights[pattern.patternType] || finalWeights.other;
        totalScore += pattern.riskScore * weight;
    }
    const avgAnomalyScore = anomalies.length > 0
        ? anomalies.reduce((acc, a) => acc + a.anomalyScore, 0) / anomalies.length
        : 0;
    totalScore += avgAnomalyScore * 0.15;
    return Math.min(totalScore, 1);
}
/**
 * Consolidate and deduplicate detection results
 */
function consolidateDetectionResults(patternResults, anomalyResults, confidenceThreshold = 0.5) {
    const highRiskTransactions = new Set();
    for (const pattern of patternResults) {
        if (pattern.confidence >= confidenceThreshold) {
            pattern.matchedTransactions.forEach(txnId => highRiskTransactions.add(txnId));
        }
    }
    for (const anomaly of anomalyResults) {
        if (anomaly.isAnomaly && anomaly.anomalyScore >= confidenceThreshold) {
            highRiskTransactions.add(anomaly.transactionId);
        }
    }
    const patternCounts = {};
    for (const pattern of patternResults) {
        if (pattern.confidence >= confidenceThreshold) {
            patternCounts[pattern.patternType] = (patternCounts[pattern.patternType] || 0) + 1;
        }
    }
    const topThreats = patternResults
        .filter(p => p.confidence >= confidenceThreshold)
        .sort((a, b) => b.riskScore - a.riskScore)
        .slice(0, 5);
    return {
        highRiskTransactions,
        detectionSummary: {
            totalHighRiskTransactions: highRiskTransactions.size,
            patternDistribution: patternCounts,
            totalPatternsDetected: patternResults.filter(p => p.confidence >= confidenceThreshold).length,
            totalAnomaliesDetected: anomalyResults.filter(a => a.isAnomaly).length,
            averagePatternConfidence: patternResults.length > 0
                ? patternResults.reduce((acc, p) => acc + p.confidence, 0) / patternResults.length
                : 0,
        },
        topThreats,
    };
}
/**
 * Generate pattern comparison matrix for cross-validation
 */
function generatePatternComparisonMatrix(detectorResults, transactionIds) {
    const matrix = {};
    for (const txnId of transactionIds) {
        matrix[txnId] = {};
        for (const [detectorName, results] of detectorResults.entries()) {
            const matchedPattern = results.find(r => r.matchedTransactions.includes(txnId));
            matrix[txnId][detectorName] = matchedPattern ? matchedPattern.confidence : 0;
        }
    }
    return matrix;
}
/**
 * Calculate pattern persistence score (how consistently detected over time)
 */
function calculatePatternPersistence(historicalPatterns, patternType, timeWindowDays = 30) {
    if (!historicalPatterns || historicalPatterns.length === 0) {
        return 0;
    }
    const now = Date.now();
    const windowMs = timeWindowDays * 24 * 60 * 60 * 1000;
    const relevantPatterns = historicalPatterns.filter(hp => hp.pattern.patternType === patternType && (now - hp.timestamp.getTime()) <= windowMs);
    if (relevantPatterns.length === 0) {
        return 0;
    }
    // Calculate detection frequency
    const dayBuckets = {};
    for (const hp of relevantPatterns) {
        const dateKey = hp.timestamp.toISOString().split('T')[0];
        dayBuckets[dateKey] = (dayBuckets[dateKey] || 0) + 1;
    }
    const activeDays = Object.keys(dayBuckets).length;
    const totalDays = Math.ceil(timeWindowDays);
    const consistencyRatio = activeDays / totalDays;
    // Average confidence across detections
    const avgConfidence = relevantPatterns.reduce((acc, p) => acc + p.pattern.confidence, 0) / relevantPatterns.length;
    // Persistence = consistency * confidence
    return consistencyRatio * avgConfidence;
}
exports.default = {
    // Pattern Recognition (4)
    detectLinearProgressionPattern,
    detectCyclicalPattern,
    detectComplexSequencePattern,
    detectFractalPattern,
    // Anomaly Detection (4)
    detectStatisticalAnomalies,
    detectIsolationForestAnomalies,
    detectBehavioralAnomalies,
    detectContextualAnomalies,
    // Time-Series Analysis (5)
    generateTimeSeries,
    calculateExponentialMovingAverage,
    seasonalDecomposition,
    calculateAutocorrelation,
    differenceTimeSeries,
    // Clustering (3)
    performKMeansClustering,
    performDBSCANClustering,
    performHierarchicalClustering,
    // Behavioral Profiling (3)
    buildBehavioralProfile,
    detectDormantAccountActivation,
    analyzeActivitySeasonality,
    // Sequence Pattern Mining (3)
    detectSequentialPatterns,
    detectRepeatedSequences,
    detectActivityBursts,
    // Circular Transaction Detection (2)
    detectCircularTransactions,
    detectMultiLegCircularPaths,
    // Kiting Detection (2)
    detectCheckKiting,
    detectACHKiting,
    // Pass-Through Detection (2)
    detectPassThroughAccounts,
    detectShellAccountPatterns,
    // Frequency Patterns (2)
    detectFrequencyAnomalies,
    detectTimingAnomalies,
    // Peer Comparison (1)
    analyzePeerGroupComparison,
    // Statistical Outliers (2)
    detectMultivariateOutliers,
    detectQuantileOutliers,
    // ML Pattern Detection (3)
    detectMLPatterns,
    detectEnsemblePatterns,
    rankAnomaliesByRiskScore,
    // Utility & Consolidation (4)
    calculateAccountRiskScore,
    consolidateDetectionResults,
    generatePatternComparisonMatrix,
    calculatePatternPersistence,
};
//# sourceMappingURL=transaction-pattern-analysis-kit.js.map