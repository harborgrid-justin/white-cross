"use strict";
/**
 * Cash Activity Monitoring Kit
 *
 * Comprehensive functions for detecting and analyzing suspicious cash activity patterns
 * including large deposits, structuring behavior, ATM usage, and cash-intensive transactions.
 *
 * @module CashActivityMonitoring
 * @version 1.0.0
 * @production
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectLargeCashDeposit = detectLargeCashDeposit;
exports.identifyAnomalousDepositAmount = identifyAnomalousDepositAmount;
exports.calculateDepositThreshold = calculateDepositThreshold;
exports.trackDepositGrowthPattern = trackDepositGrowthPattern;
exports.monitorCashWithdrawals = monitorCashWithdrawals;
exports.detectUnusualWithdrawalPattern = detectUnusualWithdrawalPattern;
exports.analyzeWithdrawalFrequency = analyzeWithdrawalFrequency;
exports.flagExcessiveWithdrawalAmount = flagExcessiveWithdrawalAmount;
exports.analyzeATMUsagePatterns = analyzeATMUsagePatterns;
exports.detectATMOverusage = detectATMOverusage;
exports.identifyATMHoppingBehavior = identifyATMHoppingBehavior;
exports.calculateATMActivityScore = calculateATMActivityScore;
exports.detectStructuredDeposits = detectStructuredDeposits;
exports.identifySmurfingPattern = identifySmurfingPattern;
exports.analyzeDepositFragmentation = analyzeDepositFragmentation;
exports.calculateStructuringRisk = calculateStructuringRisk;
exports.classifyCashIntensiveBusiness = classifyCashIntensiveBusiness;
exports.monitorCashIntensiveActivity = monitorCashIntensiveActivity;
exports.flagAnomalousCashIntensiveTransactions = flagAnomalousCashIntensiveTransactions;
exports.monitorCurrencyExchangeActivity = monitorCurrencyExchangeActivity;
exports.detectFXTradingAnomalies = detectFXTradingAnomalies;
exports.analyzeMulticurrencyPatterns = analyzeMulticurrencyPatterns;
exports.detectCashCourierActivity = detectCashCourierActivity;
exports.identifyCourierPatterns = identifyCourierPatterns;
exports.analyzeHighValueMovements = analyzeHighValueMovements;
exports.detectBulkCashMovements = detectBulkCashMovements;
exports.analyzeCashVolumeShifts = analyzeCashVolumeShifts;
exports.flagUnusualCashTransfer = flagUnusualCashTransfer;
exports.analyzeTellerTransactionPatterns = analyzeTellerTransactionPatterns;
exports.detectTellerAnomalies = detectTellerAnomalies;
exports.calculateTellerActivityScore = calculateTellerActivityScore;
exports.calculateCashToDepositRatio = calculateCashToDepositRatio;
exports.analyzeDepositComposition = analyzeDepositComposition;
exports.detectHighDenominationUsage = detectHighDenominationUsage;
exports.analyzeNoteDenominationDistribution = analyzeNoteDenominationDistribution;
exports.flagAnomalousHighDenominationTransactions = flagAnomalousHighDenominationTransactions;
exports.identifyFrequentCashTransactions = identifyFrequentCashTransactions;
exports.analyzeTransactionFrequencyPattern = analyzeTransactionFrequencyPattern;
exports.calculateCashTransactionIntensity = calculateCashTransactionIntensity;
exports.analyzeCashVsCheckPreferences = analyzeCashVsCheckPreferences;
exports.detectShiftToCashPayments = detectShiftToCashPayments;
exports.monitorNightDepositActivity = monitorNightDepositActivity;
exports.flagOffHoursCashDeposits = flagOffHoursCashDeposits;
exports.analyzeBranchCashAggregation = analyzeBranchCashAggregation;
exports.detectCrossbranchCashMovements = detectCrossbranchCashMovements;
exports.identifyAggregationPatterns = identifyAggregationPatterns;
exports.validateTransactionData = validateTransactionData;
exports.consolidateAlerts = consolidateAlerts;
exports.generateRiskAssessment = generateRiskAssessment;
// ============================================================================
// LARGE CASH DEPOSIT DETECTION (4 FUNCTIONS)
// ============================================================================
/**
 * Detects large cash deposits based on customer history and thresholds
 *
 * @param transaction - The cash transaction to analyze
 * @param customerProfile - The customer's cash activity profile
 * @param thresholdMultiplier - How many times the average equals a large deposit (default: 3)
 * @returns Alert object if deposit is unusually large, null otherwise
 * @throws Error if transaction data is invalid
 */
function detectLargeCashDeposit(transaction, customerProfile, thresholdMultiplier = 3) {
    if (!transaction || transaction.amount <= 0) {
        throw new Error('Invalid transaction data');
    }
    if (!customerProfile) {
        throw new Error('Invalid customer profile');
    }
    const threshold = customerProfile.averageMonthlyDeposit * thresholdMultiplier;
    if (transaction.amount > threshold) {
        return {
            alertId: `large-deposit-${transaction.transactionId}`,
            customerId: transaction.customerId,
            alertType: 'LARGE_CASH_DEPOSIT',
            severity: transaction.amount > threshold * 2 ? 'critical' : 'high',
            description: `Cash deposit of ${transaction.amount} ${transaction.currency} exceeds threshold of ${threshold}`,
            timestamp: transaction.timestamp,
            requiresInvestigation: true,
            recommendedAction: 'Review deposit source and customer business justification'
        };
    }
    return null;
}
/**
 * Identifies anomalous deposit amounts relative to statistical norms
 *
 * @param amount - The deposit amount
 * @param historicalAmounts - Array of historical deposit amounts
 * @param standardDeviations - Number of standard deviations to flag as anomalous (default: 2)
 * @returns True if amount is anomalous, false otherwise
 */
function identifyAnomalousDepositAmount(amount, historicalAmounts, standardDeviations = 2) {
    if (historicalAmounts.length === 0 || amount <= 0) {
        return false;
    }
    const mean = historicalAmounts.reduce((a, b) => a + b, 0) / historicalAmounts.length;
    const variance = historicalAmounts.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / historicalAmounts.length;
    const stdDev = Math.sqrt(variance);
    return Math.abs(amount - mean) > standardDeviations * stdDev;
}
/**
 * Calculates appropriate deposit threshold based on customer profile and regulatory requirements
 *
 * @param customerProfile - The customer's activity profile
 * @param regulatoryThreshold - Regulatory minimum threshold (e.g., 10000)
 * @param riskAdjustment - Additional multiplier based on risk level (default: 1)
 * @returns Calculated threshold amount
 */
function calculateDepositThreshold(customerProfile, regulatoryThreshold, riskAdjustment = 1) {
    const baselineThreshold = Math.max(customerProfile.averageMonthlyDeposit * 1.5, regulatoryThreshold);
    return baselineThreshold * riskAdjustment;
}
/**
 * Tracks deposit growth patterns and identifies unusual acceleration
 *
 * @param deposits - Array of monthly deposit amounts
 * @param monthCount - Number of months to analyze (default: 6)
 * @returns Growth rate and anomaly detection result
 */
function trackDepositGrowthPattern(deposits, monthCount = 6) {
    if (deposits.length < 2) {
        return { growthRate: 0, isAnomalous: false, trend: 'stable' };
    }
    const slicedDeposits = deposits.slice(-monthCount);
    const firstHalf = slicedDeposits.slice(0, Math.ceil(slicedDeposits.length / 2));
    const secondHalf = slicedDeposits.slice(Math.ceil(slicedDeposits.length / 2));
    const avgFirst = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const avgSecond = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
    const growthRate = avgFirst > 0 ? ((avgSecond - avgFirst) / avgFirst) * 100 : 0;
    const isAnomalous = Math.abs(growthRate) > 50; // > 50% growth is anomalous
    let trend;
    if (growthRate > 10)
        trend = 'increasing';
    else if (growthRate < -10)
        trend = 'decreasing';
    else
        trend = 'stable';
    return { growthRate, isAnomalous, trend };
}
// ============================================================================
// WITHDRAWAL MONITORING (4 FUNCTIONS)
// ============================================================================
/**
 * Monitors cash withdrawal patterns over a period
 *
 * @param withdrawals - Array of withdrawal transactions
 * @param timeWindow - Analysis window in days (default: 30)
 * @returns Withdrawal pattern analysis
 */
function monitorCashWithdrawals(withdrawals, timeWindow = 30) {
    if (withdrawals.length === 0) {
        return { totalWithdrawals: 0, totalAmount: 0, averageAmount: 0, frequencyPerDay: 0, maxWithdrawal: 0 };
    }
    const totalAmount = withdrawals.reduce((sum, t) => sum + t.amount, 0);
    const totalWithdrawals = withdrawals.length;
    const maxWithdrawal = Math.max(...withdrawals.map(w => w.amount));
    return {
        totalWithdrawals,
        totalAmount,
        averageAmount: totalAmount / totalWithdrawals,
        frequencyPerDay: totalWithdrawals / timeWindow,
        maxWithdrawal
    };
}
/**
 * Detects unusual withdrawal patterns indicating potential suspicious activity
 *
 * @param withdrawals - Array of withdrawal transactions
 * @param baselineFrequency - Expected daily withdrawal frequency
 * @returns Array of detected unusual patterns
 */
function detectUnusualWithdrawalPattern(withdrawals, baselineFrequency = 0.5) {
    const patterns = [];
    if (withdrawals.length === 0) {
        return patterns;
    }
    // Check frequency
    const dailyWithdrawals = withdrawals.length / 30; // assume 30-day month
    if (dailyWithdrawals > baselineFrequency * 3) {
        patterns.push('Excessive withdrawal frequency detected');
    }
    // Check consistency
    const amounts = withdrawals.map(w => w.amount);
    const avgAmount = amounts.reduce((a, b) => a + b, 0) / amounts.length;
    const deviations = amounts.filter(a => Math.abs(a - avgAmount) > avgAmount * 0.5);
    if (deviations.length > amounts.length * 0.5) {
        patterns.push('Inconsistent withdrawal amounts detected');
    }
    // Check for just-below-threshold amounts
    const justBelowThreshold = amounts.filter(a => a > 9500 && a < 10000).length;
    if (justBelowThreshold > 0) {
        patterns.push('Just-below-threshold amounts detected (smurfing indicator)');
    }
    return patterns;
}
/**
 * Analyzes withdrawal frequency patterns
 *
 * @param withdrawals - Array of withdrawal transactions sorted by timestamp
 * @returns Frequency analysis including peaks and anomalies
 */
function analyzeWithdrawalFrequency(withdrawals) {
    if (withdrawals.length < 2) {
        return { dailyFrequency: 0, weeklyFrequency: 0, peakDay: null, averageIntervalDays: 0, isRegular: false };
    }
    const dailyFrequency = withdrawals.length / 30;
    const weeklyFrequency = withdrawals.length / 4;
    // Find peak day
    const dayMap = new Map();
    withdrawals.forEach(w => {
        const day = w.timestamp.toLocaleDateString('en-US', { weekday: 'long' });
        dayMap.set(day, (dayMap.get(day) ?? 0) + 1);
    });
    const peakDay = Array.from(dayMap.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
    // Calculate average interval
    const intervals = [];
    for (let i = 1; i < withdrawals.length; i++) {
        const interval = (withdrawals[i].timestamp.getTime() - withdrawals[i - 1].timestamp.getTime()) / (1000 * 60 * 60 * 24);
        intervals.push(interval);
    }
    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    // Check regularity (low coefficient of variation indicates regular pattern)
    const variance = intervals.reduce((sum, val) => sum + Math.pow(val - avgInterval, 2), 0) / intervals.length;
    const stdDev = Math.sqrt(variance);
    const isRegular = (stdDev / avgInterval) < 0.5; // CV < 0.5
    return {
        dailyFrequency,
        weeklyFrequency,
        peakDay,
        averageIntervalDays: avgInterval,
        isRegular
    };
}
/**
 * Flags withdrawal amounts that exceed expected thresholds
 *
 * @param amount - The withdrawal amount
 * @param customerProfile - Customer's activity profile
 * @param riskLevel - Customer's risk level ('low' | 'medium' | 'high')
 * @returns True if amount should be flagged
 */
function flagExcessiveWithdrawalAmount(amount, customerProfile, riskLevel = 'medium') {
    const thresholdMultipliers = {
        low: 5,
        medium: 3,
        high: 2
    };
    const threshold = customerProfile.averageMonthlyWithdrawal * thresholdMultipliers[riskLevel];
    return amount > threshold;
}
// ============================================================================
// ATM ACTIVITY ANALYSIS (4 FUNCTIONS)
// ============================================================================
/**
 * Analyzes ATM usage patterns for a customer
 *
 * @param atmTransactions - Array of ATM transactions
 * @returns ATM usage pattern analysis
 */
function analyzeATMUsagePatterns(atmTransactions) {
    if (atmTransactions.length === 0) {
        return null;
    }
    const customerId = atmTransactions[0].customerId;
    const uniqueATMs = new Set(atmTransactions.map(t => t.branchId));
    const totalAmount = atmTransactions.reduce((sum, t) => sum + t.amount, 0);
    const avgAmount = totalAmount / atmTransactions.length;
    // Estimate frequency (assume 30-day month)
    const frequencyPerDay = atmTransactions.length / 30;
    const lastUsage = new Date(Math.max(...atmTransactions.map(t => t.timestamp.getTime())));
    return {
        atmId: atmTransactions[0].branchId,
        customerId,
        totalWithdrawals: atmTransactions.length,
        totalAmountWithdrawn: totalAmount,
        averageWithdrawalAmount: avgAmount,
        frequencyPerDay,
        uniqueATMsUsed: uniqueATMs.size,
        hopping, Suspected: uniqueATMs.size > 5 && frequencyPerDay > 1,
        lastUsageDate: lastUsage
    };
}
/**
 * Detects excessive ATM usage indicating potential smurfing
 *
 * @param atmPattern - The ATM usage pattern
 * @param maxDailyFrequency - Maximum expected daily ATM visits (default: 1)
 * @returns True if usage is excessive
 */
function detectATMOverusage(atmPattern, maxDailyFrequency = 1) {
    return atmPattern.frequencyPerDay > maxDailyFrequency * 2 ||
        atmPattern.totalWithdrawals > 40; // more than 40 transactions in period
}
/**
 * Identifies ATM hopping behavior (using multiple ATMs in short timeframes)
 *
 * @param atmTransactions - Sorted array of ATM transactions
 * @param timeWindowMinutes - Time window to detect hopping (default: 120)
 * @returns Array of detected hopping instances
 */
function identifyATMHoppingBehavior(atmTransactions, timeWindowMinutes = 120) {
    const hoppingInstances = [];
    for (let i = 0; i < atmTransactions.length - 1; i++) {
        const window = atmTransactions.slice(i);
        const timeThreshold = new Date(atmTransactions[i].timestamp.getTime() + timeWindowMinutes * 60 * 1000);
        const windowedTransactions = window.filter(t => t.timestamp <= timeThreshold);
        const uniqueATMs = new Set(windowedTransactions.map(t => t.branchId)).size;
        if (uniqueATMs >= 3) {
            const totalAmount = windowedTransactions.reduce((sum, t) => sum + t.amount, 0);
            hoppingInstances.push({
                timestamp: atmTransactions[i].timestamp,
                atmCount: uniqueATMs,
                amount: totalAmount
            });
        }
    }
    return hoppingInstances;
}
/**
 * Calculates a composite score for ATM activity riskiness
 *
 * @param atmPattern - ATM usage pattern
 * @returns Risk score from 0 (low) to 100 (critical)
 */
function calculateATMActivityScore(atmPattern) {
    let score = 0;
    // Frequency component (0-30 points)
    if (atmPattern.frequencyPerDay > 3)
        score += 30;
    else if (atmPattern.frequencyPerDay > 2)
        score += 20;
    else if (atmPattern.frequencyPerDay > 1)
        score += 10;
    // Unique ATM component (0-30 points)
    if (atmPattern.uniqueATMsUsed > 10)
        score += 30;
    else if (atmPattern.uniqueATMsUsed > 5)
        score += 20;
    else if (atmPattern.uniqueATMsUsed > 3)
        score += 10;
    // Amount consistency component (0-20 points)
    if (atmPattern.totalWithdrawals > 0) {
        const avgAmount = atmPattern.totalAmountWithdrawn / atmPattern.totalWithdrawals;
        const targetAmount = 9500; // just below reporting threshold
        if (Math.abs(avgAmount - targetAmount) < 500)
            score += 20;
    }
    // Hopping indicator (0-20 points)
    if (atmPattern.hopping)
        Suspected;
    score += 20;
    return Math.min(score, 100);
}
// ============================================================================
// STRUCTURED CASH/SMURFING DETECTION (4 FUNCTIONS)
// ============================================================================
/**
 * Detects structured cash deposits (smurfing behavior)
 *
 * @param deposits - Array of deposit transactions
 * @param threshold - Reporting threshold to avoid (e.g., 10000)
 * @param timeWindow - Time window in days (default: 30)
 * @returns Structured deposit pattern analysis
 */
function detectStructuredDeposits(deposits, threshold = 10000, timeWindow = 30) {
    const customerId = deposits[0]?.customerId ?? 'unknown';
    const now = new Date();
    const periodStart = new Date(now.getTime() - timeWindow * 24 * 60 * 60 * 1000);
    const windowedDeposits = deposits.filter(d => d.timestamp >= periodStart);
    const totalAmount = windowedDeposits.reduce((sum, d) => sum + d.amount, 0);
    const avgAmount = windowedDeposits.length > 0 ? totalAmount / windowedDeposits.length : 0;
    // Fragmentation ratio: measure of how spread out deposits are
    const fragmentationRatio = totalAmount > 0 ? windowedDeposits.length / (totalAmount / 1000) : 0;
    // Identify structuring risk
    const depositsNearThreshold = windowedDeposits.filter(d => d.amount > threshold * 0.9 && d.amount < threshold).length;
    let structuringRisk;
    if (depositsNearThreshold > windowedDeposits.length * 0.7) {
        structuringRisk = 'critical';
    }
    else if (fragmentationRatio > 0.05 && depositsNearThreshold > 0) {
        structuringRisk = 'high';
    }
    else if (fragmentationRatio > 0.03) {
        structuringRisk = 'medium';
    }
    else {
        structuringRisk = 'low';
    }
    // Identify pattern
    let pattern = 'irregular';
    if (windowedDeposits.length > 0) {
        const variance = windowedDeposits.reduce((sum, d) => sum + Math.pow(d.amount - avgAmount, 2), 0) / windowedDeposits.length;
        const stdDev = Math.sqrt(variance);
        const cv = avgAmount > 0 ? stdDev / avgAmount : 0;
        if (cv < 0.2)
            pattern = 'consistent';
        else if (cv < 0.5)
            pattern = 'variable';
    }
    return {
        customerId,
        periodStart,
        periodEnd: now,
        depositsCount: windowedDeposits.length,
        totalAmount,
        averageDepositAmount: avgAmount,
        fragmentationRatio,
        structuringRisk,
        pattern
    };
}
/**
 * Identifies smurfing patterns through multiple small transactions
 *
 * @param transactions - Array of transactions
 * @param threshold - Threshold to avoid (default: 10000)
 * @param transactionCount - Minimum transaction count to flag (default: 5)
 * @returns True if smurfing pattern detected
 */
function identifySmurfingPattern(transactions, threshold = 10000, transactionCount = 5) {
    if (transactions.length < transactionCount) {
        return false;
    }
    // Count transactions just below threshold
    const suspiciousTransactions = transactions.filter(t => t.amount > threshold * 0.85 && t.amount < threshold).length;
    // Count very consistent amounts
    const amounts = transactions.map(t => t.amount);
    const uniqueAmounts = new Set(amounts);
    return suspiciousTransactions >= transactionCount || uniqueAmounts.size <= 3;
}
/**
 * Analyzes deposit fragmentation to identify structured deposits
 *
 * @param deposits - Array of deposits
 * @returns Fragmentation analysis
 */
function analyzeDepositFragmentation(deposits) {
    if (deposits.length === 0) {
        return { fragmentationIndex: 0, isFragmented: false, recommendation: 'Insufficient data' };
    }
    const totalAmount = deposits.reduce((sum, d) => sum + d.amount, 0);
    const avgDeposit = totalAmount / deposits.length;
    // Fragmentation index: lower values = more fragmented
    const fragmentationIndex = avgDeposit / (totalAmount / deposits.length);
    const isFragmented = deposits.length > 10 && avgDeposit < 5000;
    let recommendation = 'Normal deposit pattern';
    if (isFragmented) {
        recommendation = 'Investigate for structured deposit activity';
    }
    return { fragmentationIndex, isFragmented, recommendation };
}
/**
 * Calculates overall structuring risk score
 *
 * @param pattern - Structured deposit pattern
 * @param recentTransactions - Recent transaction count
 * @returns Risk score 0-100
 */
function calculateStructuringRisk(pattern, recentTransactions) {
    let score = 0;
    // Risk level mapping
    const riskMap = {
        low: 10,
        medium: 40,
        high: 70,
        critical: 90
    };
    score += riskMap[pattern.structuringRisk] || 0;
    // Pattern consistency
    if (pattern.pattern === 'consistent')
        score += 10;
    // Transaction concentration
    if (recentTransactions > 20)
        score += 10;
    return Math.min(score, 100);
}
// ============================================================================
// CASH-INTENSIVE BUSINESS MONITORING (3 FUNCTIONS)
// ============================================================================
/**
 * Classifies a business by cash-intensity level
 *
 * @param businessType - Type of business (e.g., 'retail', 'restaurant', 'casino')
 * @param monthlyDeposits - Monthly deposit amount
 * @param monthlyTotalTransactions - Total monthly transactions
 * @returns Cash-intensive business profile
 */
function classifyCashIntensiveBusiness(businessType, monthlyDeposits, monthlyTotalTransactions) {
    // Expected cash ratios by business type
    const expectedCashRatios = {
        retail: 0.40,
        restaurant: 0.70,
        casino: 0.90,
        gas_station: 0.60,
        hotel: 0.30,
        bar: 0.75,
        laundromat: 0.95,
        parking: 0.85,
        default: 0.25
    };
    const expectedRatio = expectedCashRatios[businessType] ?? expectedCashRatios.default;
    const actualCashRatio = monthlyDeposits > 0 ? 0.5 : 0; // placeholder, assume 50% for demo
    const anomalyScore = Math.abs(actualCashRatio - expectedRatio) * 100;
    return {
        businessId: `biz-${Date.now()}`,
        businessType,
        monthlyAverageDeposit: monthlyDeposits,
        cashToTotalDepositRatio: actualCashRatio,
        expectedCashRatio: expectedRatio,
        anomalyScore,
        isWithinNorms: anomalyScore < 15,
        flags: anomalyScore > 30 ? ['Cash ratio exceeds expected for business type'] : []
    };
}
/**
 * Monitors cash-intensive business for suspicious patterns
 *
 * @param profile - Business profile
 * @param historicalProfile - Previous period profile for comparison
 * @returns Alert if anomalies detected
 */
function monitorCashIntensiveActivity(profile, historicalProfile) {
    if (profile.anomalyScore > 50) {
        return {
            alertId: `cash-intensive-${profile.businessId}`,
            customerId: profile.businessId,
            alertType: 'CASH_INTENSIVE_ANOMALY',
            severity: profile.anomalyScore > 100 ? 'critical' : 'high',
            description: `Cash ratio anomaly detected for ${profile.businessType}: ${profile.cashToTotalDepositRatio.toFixed(2)} vs expected ${profile.expectedCashRatio.toFixed(2)}`,
            timestamp: new Date(),
            requiresInvestigation: true,
            recommendedAction: 'Request business justification for elevated cash deposits'
        };
    }
    // Check for significant changes
    if (historicalProfile) {
        const ratioChange = Math.abs(profile.cashToTotalDepositRatio - historicalProfile.cashToTotalDepositRatio);
        if (ratioChange > 0.3) {
            return {
                alertId: `cash-intensive-change-${profile.businessId}`,
                customerId: profile.businessId,
                alertType: 'CASH_RATIO_CHANGE',
                severity: 'warning',
                description: `Cash ratio increased significantly: ${historicalProfile.cashToTotalDepositRatio.toFixed(2)} to ${profile.cashToTotalDepositRatio.toFixed(2)}`,
                timestamp: new Date(),
                requiresInvestigation: true,
                recommendedAction: 'Investigate reason for cash ratio increase'
            };
        }
    }
    return null;
}
/**
 * Flags transactions that don't match business profile
 *
 * @param transaction - The transaction
 * @param businessProfile - Expected business profile
 * @returns True if transaction is anomalous for the business
 */
function flagAnomalousCashIntensiveTransactions(transaction, businessProfile) {
    // Transactions significantly larger than expected for business type
    const expectedMaxTransaction = businessProfile.monthlyAverageDeposit * 0.3; // assume 30% is a single transaction max
    if (transaction.amount > expectedMaxTransaction * 2) {
        return true;
    }
    // Transactions at unusual times for the business type
    const hour = transaction.timestamp.getHours();
    if (businessProfile.businessType === 'retail' && (hour < 6 || hour > 23)) {
        return true;
    }
    return false;
}
// ============================================================================
// CURRENCY EXCHANGE MONITORING (3 FUNCTIONS)
// ============================================================================
/**
 * Monitors currency exchange activity for anomalies
 *
 * @param exchangeTransactions - Array of currency exchange transactions
 * @returns Currency exchange activity analysis
 */
function monitorCurrencyExchangeActivity(exchangeTransactions) {
    if (exchangeTransactions.length === 0) {
        return [];
    }
    // Group by currency pair
    const currencyPairs = new Map();
    exchangeTransactions.forEach(t => {
        const pair = `${t.currency}-other`; // simplified
        if (!currencyPairs.has(pair)) {
            currencyPairs.set(pair, []);
        }
        currencyPairs.get(pair).push(t);
    });
    const activities = [];
    currencyPairs.forEach((transactions, pair) => {
        const [source, target] = pair.split('-');
        const totalVolume = transactions.reduce((sum, t) => sum + t.amount, 0);
        const frequency = transactions.length;
        let frequencyPattern;
        if (frequency > 20)
            frequencyPattern = 'concentrated';
        else if (frequency > 5)
            frequencyPattern = 'regular';
        else
            frequencyPattern = 'sporadic';
        const anomalies = [];
        if (frequencyPattern === 'concentrated')
            anomalies.push('High frequency exchanges');
        if (totalVolume > 100000)
            anomalies.push('Large total exchange volume');
        activities.push({
            customerId: transactions[0].customerId,
            sourceCurrency: source,
            targetCurrency: target,
            exchangeAmount: totalVolume / transactions.length,
            exchangeRate: 1.0, // would be calculated in real system
            totalExchangeVolume30Days: totalVolume,
            frequencyPattern,
            anomalyIndicators: anomalies
        });
    });
    return activities;
}
/**
 * Detects foreign exchange trading anomalies
 *
 * @param fxTransactions - FX transactions
 * @returns Anomalies detected
 */
function detectFXTradingAnomalies(fxTransactions) {
    const anomalies = [];
    if (fxTransactions.length > 15) {
        anomalies.push('Frequent FX trading activity');
    }
    const totalFXVolume = fxTransactions.reduce((sum, t) => sum + t.amount, 0);
    if (totalFXVolume > 250000) {
        anomalies.push('Large FX trading volume');
    }
    // Check for same-day reversals (buy-sell same currency)
    const currencyMap = new Map();
    fxTransactions.forEach(t => {
        const count = currencyMap.get(t.currency) ?? 0;
        currencyMap.set(t.currency, count + 1);
    });
    currencyMap.forEach((count, currency) => {
        if (count > 5) {
            anomalies.push(`Repeated trading of ${currency}`);
        }
    });
    return anomalies;
}
/**
 * Analyzes multi-currency transaction patterns
 *
 * @param transactions - Transactions with currency info
 * @returns Multi-currency pattern analysis
 */
function analyzeMulticurrencyPatterns(transactions) {
    if (transactions.length === 0) {
        return { uniqueCurrencies: 0, dominantCurrency: '', pattern: 'single', suspiciousIndicators: [] };
    }
    const currencyMap = new Map();
    transactions.forEach(t => {
        currencyMap.set(t.currency, (currencyMap.get(t.currency) ?? 0) + 1);
    });
    const uniqueCurrencies = currencyMap.size;
    const sorted = Array.from(currencyMap.entries()).sort((a, b) => b[1] - a[1]);
    const dominantCurrency = sorted[0]?.[0] ?? '';
    let pattern = 'single';
    if (uniqueCurrencies === 2)
        pattern = 'dual';
    else if (uniqueCurrencies > 2)
        pattern = 'multi';
    const suspiciousIndicators = [];
    if (pattern === 'multi' && transactions.length > 10) {
        suspiciousIndicators.push('Multiple currency usage with frequent transactions');
    }
    return { uniqueCurrencies, dominantCurrency, pattern, suspiciousIndicators };
}
// ============================================================================
// CASH COURIER DETECTION (3 FUNCTIONS)
// ============================================================================
/**
 * Detects potential cash courier activity
 *
 * @param transactions - Transactions to analyze
 * @param transactionThreshold - Minimum transaction amount (default: 50000)
 * @returns Courier activity indicators
 */
function detectCashCourierActivity(transactions, transactionThreshold = 50000) {
    const indicators = [];
    let riskScore = 0;
    // Check for large bulk transactions
    const largeTx = transactions.filter(t => t.amount >= transactionThreshold).length;
    if (largeTx > 3) {
        indicators.push('Multiple large bulk transactions');
        riskScore += 20;
    }
    // Check for frequent large transfers
    if (transactions.length > 10 && largeTx / transactions.length > 0.3) {
        indicators.push('High frequency of large transfers');
        riskScore += 25;
    }
    // Check for regular patterns (courier visits same time/place)
    const hourMap = new Map();
    transactions.forEach(t => {
        const hour = t.timestamp.getHours();
        hourMap.set(hour, (hourMap.get(hour) ?? 0) + 1);
    });
    const maxHour = Math.max(...Array.from(hourMap.values()));
    if (maxHour > transactions.length * 0.5) {
        indicators.push('Regular transaction timing pattern');
        riskScore += 15;
    }
    return {
        isCourierActivity: riskScore >= 40,
        indicators,
        riskScore
    };
}
/**
 * Identifies patterns typical of cash courier operations
 *
 * @param transactions - Transactions to analyze
 * @returns Courier pattern indicators
 */
function identifyCourierPatterns(transactions) {
    const patterns = [];
    // Check for consistent amounts
    const amounts = transactions.map(t => t.amount);
    if (amounts.length > 2) {
        const avgAmount = amounts.reduce((a, b) => a + b) / amounts.length;
        const variance = amounts.reduce((sum, a) => sum + Math.pow(a - avgAmount, 2), 0) / amounts.length;
        const stdDev = Math.sqrt(variance);
        const cv = stdDev / avgAmount;
        if (cv < 0.15) {
            patterns.push('Consistent transaction amounts (courier rounds)');
        }
    }
    // Check for specific branches/ATMs (same locations)
    const locationSet = new Set(transactions.map(t => t.branchId));
    if (locationSet.size === 1 && transactions.length > 5) {
        patterns.push('All transactions from single location');
    }
    // Check for channel consistency
    const channelSet = new Set(transactions.map(t => t.channel));
    if (channelSet.size === 1 && transactions.length > 5) {
        patterns.push('Consistent transaction channel');
    }
    return patterns;
}
/**
 * Analyzes high-value movements potentially indicating courier activity
 *
 * @param transactions - High-value transactions
 * @returns Movement analysis
 */
function analyzeHighValueMovements(transactions) {
    if (transactions.length === 0) {
        return { totalValue: 0, averageValue: 0, concentrationRatio: 0, suspiciousMovements: 0 };
    }
    const totalValue = transactions.reduce((sum, t) => sum + t.amount, 0);
    const averageValue = totalValue / transactions.length;
    // Gini-like concentration ratio
    const sorted = transactions.map(t => t.amount).sort((a, b) => a - b);
    const topTenPercent = sorted.slice(Math.floor(sorted.length * 0.9));
    const concentrationRatio = topTenPercent.reduce((a, b) => a + b, 0) / totalValue;
    // Count suspicious movements (>100k on same day multiple times)
    const dayMap = new Map();
    transactions.forEach(t => {
        const day = t.timestamp.toDateString();
        dayMap.set(day, (dayMap.get(day) ?? 0) + t.amount);
    });
    const suspiciousMovements = Array.from(dayMap.values()).filter(v => v > 100000).length;
    return {
        totalValue,
        averageValue,
        concentrationRatio,
        suspiciousMovements
    };
}
// ============================================================================
// BULK CASH MOVEMENTS (3 FUNCTIONS)
// ============================================================================
/**
 * Detects bulk cash movements across accounts/branches
 *
 * @param transactions - Transactions to analyze
 * @param bulkThreshold - Amount threshold for bulk (default: 50000)
 * @returns Bulk movement analysis
 */
function detectBulkCashMovements(transactions, bulkThreshold = 50000) {
    const movements = [];
    const dateMap = new Map();
    transactions.forEach(t => {
        const date = t.timestamp.toDateString();
        dateMap.set(date, (dateMap.get(date) ?? 0) + t.amount);
    });
    const avgDaily = Array.from(dateMap.values()).reduce((a, b) => a + b) / dateMap.size;
    dateMap.forEach((amount, dateStr) => {
        const isAnomalous = amount > bulkThreshold || amount > avgDaily * 3;
        movements.push({
            date: new Date(dateStr),
            amount,
            isAnomalous
        });
    });
    return movements;
}
/**
 * Analyzes cash volume shifts between periods
 *
 * @param currentPeriodAmount - Current period total
 * @param previousPeriodAmount - Previous period total
 * @returns Shift analysis
 */
function analyzeCashVolumeShifts(currentPeriodAmount, previousPeriodAmount) {
    if (previousPeriodAmount === 0) {
        return { percentageChange: 0, isAnomalous: false, trend: 'stable' };
    }
    const percentageChange = ((currentPeriodAmount - previousPeriodAmount) / previousPeriodAmount) * 100;
    const isAnomalous = Math.abs(percentageChange) > 50;
    let trend = 'stable';
    if (percentageChange > 15)
        trend = 'increasing';
    else if (percentageChange < -15)
        trend = 'decreasing';
    return { percentageChange, isAnomalous, trend };
}
/**
 * Flags unusual cash transfers between entities
 *
 * @param fromEntity - Source entity
 * @param toEntity - Destination entity
 * @param amount - Transfer amount
 * @param typicalAmount - Typical transfer size
 * @returns True if transfer is suspicious
 */
function flagUnusualCashTransfer(fromEntity, toEntity, amount, typicalAmount) {
    // Transfer significantly larger than typical
    if (amount > typicalAmount * 3) {
        return true;
    }
    // Transfer to same-day multiple destinations
    if (toEntity.startsWith('temp_') && amount > 25000) {
        return true;
    }
    return false;
}
// ============================================================================
// TELLER TRANSACTION PATTERNS (3 FUNCTIONS)
// ============================================================================
/**
 * Analyzes teller transaction patterns
 *
 * @param tellerTransactions - Transactions processed by tellers
 * @returns Pattern analysis
 */
function analyzeTellerTransactionPatterns(tellerTransactions) {
    if (tellerTransactions.length === 0) {
        return { totalTransactions: 0, averageTransaction: 0, peakHours: [], mostCommonChannel: '' };
    }
    const totalAmount = tellerTransactions.reduce((sum, t) => sum + t.amount, 0);
    const averageTransaction = totalAmount / tellerTransactions.length;
    // Find peak hours
    const hourMap = new Map();
    tellerTransactions.forEach(t => {
        const hour = t.timestamp.getHours();
        hourMap.set(hour, (hourMap.get(hour) ?? 0) + 1);
    });
    const peakHours = Array.from(hourMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([hour]) => hour);
    // Most common channel
    const channelMap = new Map();
    tellerTransactions.forEach(t => {
        channelMap.set(t.channel, (channelMap.get(t.channel) ?? 0) + 1);
    });
    const mostCommonChannel = Array.from(channelMap.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'unknown';
    return { totalTransactions: tellerTransactions.length, averageTransaction, peakHours, mostCommonChannel };
}
/**
 * Detects anomalous teller behavior
 *
 * @param tellerTransactions - Teller transactions
 * @param baselineProfile - Expected baseline pattern
 * @returns Anomalies detected
 */
function detectTellerAnomalies(tellerTransactions, baselineProfile) {
    const anomalies = [];
    if (tellerTransactions.length === 0) {
        return anomalies;
    }
    const currentProfile = analyzeTellerTransactionPatterns(tellerTransactions);
    // Check for unusually large transactions
    const largeTransactions = tellerTransactions.filter(t => t.amount > baselineProfile.averageTransaction * 3);
    if (largeTransactions.length > tellerTransactions.length * 0.2) {
        anomalies.push('Excessive large transactions for teller');
    }
    // Check for transactions outside normal hours
    const offHourTransactions = tellerTransactions.filter(t => !baselineProfile.peakHours.includes(t.timestamp.getHours()));
    if (offHourTransactions.length > tellerTransactions.length * 0.4) {
        anomalies.push('Significant off-hours transactions');
    }
    return anomalies;
}
/**
 * Calculates risk score for teller activity
 *
 * @param transactions - Teller transactions
 * @returns Risk score 0-100
 */
function calculateTellerActivityScore(transactions) {
    if (transactions.length === 0) {
        return 0;
    }
    let score = 0;
    const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
    const avgTransaction = totalAmount / transactions.length;
    // Large average transaction (0-20 points)
    if (avgTransaction > 50000)
        score += 20;
    else if (avgTransaction > 25000)
        score += 10;
    // High volume (0-20 points)
    if (transactions.length > 100)
        score += 20;
    else if (transactions.length > 50)
        score += 10;
    // Cash-heavy (0-20 points)
    const cashTransactions = transactions.filter(t => t.channel === 'teller').length;
    if (cashTransactions / transactions.length > 0.8)
        score += 20;
    // Potential structuring (0-20 points)
    const justBelowThreshold = transactions.filter(t => t.amount > 9500 && t.amount < 10000).length;
    if (justBelowThreshold > 5)
        score += 20;
    // Just-above threshold (0-20 points)
    const justAboveThreshold = transactions.filter(t => t.amount > 10000 && t.amount < 10500).length;
    if (justAboveThreshold > 5)
        score += 10;
    return Math.min(score, 100);
}
// ============================================================================
// CASH RATIO ANALYSIS (2 FUNCTIONS)
// ============================================================================
/**
 * Calculates the ratio of cash deposits to total deposits
 *
 * @param cashDeposits - Total cash deposited
 * @param totalDeposits - Total of all deposits
 * @returns Cash ratio analysis
 */
function calculateCashToDepositRatio(cashDeposits, totalDeposits) {
    if (totalDeposits === 0) {
        return { ratio: 0, percentage: 0, riskLevel: 'low' };
    }
    const ratio = cashDeposits / totalDeposits;
    const percentage = ratio * 100;
    let riskLevel = 'low';
    if (percentage > 75)
        riskLevel = 'high';
    else if (percentage > 50)
        riskLevel = 'medium';
    return { ratio, percentage, riskLevel };
}
/**
 * Analyzes composition of deposit methods
 *
 * @param deposits - Deposit transactions
 * @returns Composition analysis
 */
function analyzeDepositComposition(deposits) {
    if (deposits.length === 0) {
        return { cashPercentage: 0, checkPercentage: 0, transferPercentage: 0, otherPercentage: 0, dominantMethod: '' };
    }
    const total = deposits.length;
    const cash = deposits.filter(d => d.transactionType === 'deposit').length;
    const check = deposits.filter(d => d.channel === 'teller').length;
    const transfer = deposits.filter(d => d.transactionType === 'transfer').length;
    const other = total - cash - check - transfer;
    const cashPercentage = (cash / total) * 100;
    const checkPercentage = (check / total) * 100;
    const transferPercentage = (transfer / total) * 100;
    const otherPercentage = (other / total) * 100;
    const methods = [
        { method: 'cash', percentage: cashPercentage },
        { method: 'check', percentage: checkPercentage },
        { method: 'transfer', percentage: transferPercentage },
        { method: 'other', percentage: otherPercentage }
    ];
    const dominantMethod = methods.sort((a, b) => b.percentage - a.percentage)[0]?.method ?? '';
    return {
        cashPercentage,
        checkPercentage,
        transferPercentage,
        otherPercentage,
        dominantMethod
    };
}
// ============================================================================
// HIGH-DENOMINATION NOTES (3 FUNCTIONS)
// ============================================================================
/**
 * Detects usage of high-denomination notes in transactions
 *
 * @param denominationBreakdown - Map of denomination to count
 * @returns High denomination analysis
 */
function detectHighDenominationUsage(denominationBreakdown) {
    const suspiciousIndicators = [];
    if (!denominationBreakdown || Object.keys(denominationBreakdown).length === 0) {
        return { hasHighDenominations: false, highDenominationPercentage: 0, suspiciousIndicators };
    }
    const total = Object.values(denominationBreakdown).reduce((a, b) => a + b, 0);
    const high100s = (denominationBreakdown[100] ?? 0) + (denominationBreakdown[50] ?? 0);
    const highPercentage = (high100s / total) * 100;
    if (highPercentage > 60) {
        suspiciousIndicators.push('Excessive high-denomination notes');
    }
    return {
        hasHighDenominations: highPercentage > 40,
        highDenominationPercentage: highPercentage,
        suspiciousIndicators
    };
}
/**
 * Analyzes denomination distribution patterns
 *
 * @param denominationBreakdowns - Multiple denomination breakdowns over time
 * @returns Distribution analysis
 */
function analyzeNoteDenominationDistribution(denominationBreakdowns) {
    const anomalies = [];
    if (denominationBreakdowns.length === 0) {
        return { averageDistribution: {}, standardDeviation: {}, anomalies };
    }
    // Calculate average distribution
    const allDenominations = new Set();
    denominationBreakdowns.forEach(bd => {
        Object.keys(bd).forEach(d => allDenominations.add(parseInt(d)));
    });
    const averageDistribution = {};
    const standardDeviation = {};
    allDenominations.forEach(denom => {
        const values = denominationBreakdowns.map(bd => bd[denom] ?? 0);
        const avg = values.reduce((a, b) => a + b, 0) / values.length;
        const variance = values.reduce((sum, v) => sum + Math.pow(v - avg, 2), 0) / values.length;
        averageDistribution[denom] = avg;
        standardDeviation[denom] = Math.sqrt(variance);
        // Check for outliers
        if (variance > avg * avg) {
            anomalies.push(`High variance in ${denom} denomination usage`);
        }
    });
    return { averageDistribution, standardDeviation, anomalies };
}
/**
 * Flags transactions with anomalous high-denomination usage
 *
 * @param transaction - Transaction to check
 * @param expectedDenominationPattern - Expected denomination distribution
 * @returns True if anomalous
 */
function flagAnomalousHighDenominationTransactions(transaction, expectedDenominationPattern) {
    if (!transaction.denominationBreakdown) {
        return false;
    }
    const high100Count = (transaction.denominationBreakdown[100] ?? 0) + (transaction.denominationBreakdown[50] ?? 0);
    const totalNotes = Object.values(transaction.denominationBreakdown).reduce((a, b) => a + b, 0);
    if (totalNotes === 0) {
        return false;
    }
    const highPercentage = high100Count / totalNotes;
    // Expected high percentage
    const expectedTotal = Object.values(expectedDenominationPattern).reduce((a, b) => a + b, 0);
    const expectedHigh = (expectedDenominationPattern[100] ?? 0) + (expectedDenominationPattern[50] ?? 0);
    const expectedPercentage = expectedTotal > 0 ? expectedHigh / expectedTotal : 0;
    return highPercentage > expectedPercentage + 0.4; // 40% more than expected
}
// ============================================================================
// FREQUENT CASH TRANSACTIONS (3 FUNCTIONS)
// ============================================================================
/**
 * Identifies customers with frequent cash transactions
 *
 * @param transactions - Cash transactions
 * @param frequencyThreshold - Transactions per day to flag (default: 2)
 * @returns Identified high-frequency customers
 */
function identifyFrequentCashTransactions(transactions, frequencyThreshold = 2) {
    if (transactions.length === 0) {
        return [];
    }
    const customerMap = new Map();
    transactions.forEach(t => {
        if (!customerMap.has(t.customerId)) {
            customerMap.set(t.customerId, []);
        }
        customerMap.get(t.customerId).push(t);
    });
    const result = [];
    customerMap.forEach((txs, customerId) => {
        const frequency = txs.length / 30; // per day
        if (frequency > frequencyThreshold) {
            const totalAmount = txs.reduce((sum, t) => sum + t.amount, 0);
            result.push({ customerId, frequency, totalAmount });
        }
    });
    return result;
}
/**
 * Analyzes transaction frequency patterns
 *
 * @param transactions - Transactions sorted by date
 * @returns Frequency pattern analysis
 */
function analyzeTransactionFrequencyPattern(transactions) {
    if (transactions.length < 2) {
        return {
            averageFrequencyPerDay: 0,
            peakFrequencyDay: 0,
            isHighFrequency: false,
            pattern: 'irregular'
        };
    }
    const averageFrequencyPerDay = transactions.length / 30;
    // Find peak day
    const dayMap = new Map();
    transactions.forEach(t => {
        const day = t.timestamp.toDateString();
        dayMap.set(day, (dayMap.get(day) ?? 0) + 1);
    });
    const peakFrequencyDay = Math.max(...Array.from(dayMap.values()));
    // Determine pattern
    const dayValues = Array.from(dayMap.values());
    const avgDay = dayValues.reduce((a, b) => a + b) / dayValues.length;
    const variance = dayValues.reduce((sum, v) => sum + Math.pow(v - avgDay, 2), 0) / dayValues.length;
    const stdDev = Math.sqrt(variance);
    const cv = stdDev / avgDay;
    let pattern = 'spread';
    if (cv < 0.3)
        pattern = 'clustered';
    else if (cv > 1)
        pattern = 'irregular';
    return {
        averageFrequencyPerDay,
        peakFrequencyDay,
        isHighFrequency: averageFrequencyPerDay > 2,
        pattern
    };
}
/**
 * Calculates intensity of cash transaction activity
 *
 * @param transactions - Cash transactions
 * @param period - Period in days (default: 30)
 * @returns Cash transaction intensity score 0-100
 */
function calculateCashTransactionIntensity(transactions, period = 30) {
    if (transactions.length === 0) {
        return 0;
    }
    let score = 0;
    // Transaction count component
    const dailyFrequency = transactions.length / period;
    if (dailyFrequency > 5)
        score += 30;
    else if (dailyFrequency > 3)
        score += 20;
    else if (dailyFrequency > 1)
        score += 10;
    // Amount component
    const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
    const avgAmount = totalAmount / transactions.length;
    if (avgAmount > 50000)
        score += 30;
    else if (avgAmount > 25000)
        score += 15;
    // Consistency component
    const amounts = transactions.map(t => t.amount);
    const variance = amounts.reduce((sum, a) => sum + Math.pow(a - avgAmount, 2), 0) / amounts.length;
    const stdDev = Math.sqrt(variance);
    const cv = stdDev / avgAmount;
    if (cv < 0.3)
        score += 20; // very consistent
    else if (cv > 1)
        score += 10; // highly variable
    return Math.min(score, 100);
}
// ============================================================================
// CASH VS CHECK PREFERENCES (2 FUNCTIONS)
// ============================================================================
/**
 * Analyzes customer preferences between cash and check deposits
 *
 * @param deposits - Deposit transactions
 * @returns Preference analysis
 */
function analyzeCashVsCheckPreferences(deposits) {
    if (deposits.length === 0) {
        return { cashPreference: 0, checkPreference: 0, dominantMethod: 'mixed', shiftToCash: false };
    }
    const cashDeposits = deposits.filter(d => d.transactionType === 'deposit' && d.channel === 'teller');
    const checkDeposits = deposits.filter(d => d.channel === 'teller' && d.transactionType === 'deposit');
    const cashPreference = (cashDeposits.length / deposits.length) * 100;
    const checkPreference = (checkDeposits.length / deposits.length) * 100;
    let dominantMethod = 'mixed';
    if (cashPreference > 60)
        dominantMethod = 'cash';
    else if (checkPreference > 60)
        dominantMethod = 'check';
    const shiftToCash = cashPreference > 50 && checkPreference < 30;
    return { cashPreference, checkPreference, dominantMethod, shiftToCash };
}
/**
 * Detects shift in payment method preferences
 *
 * @param currentPeriodDeposits - Current period deposits
 * @param previousPeriodDeposits - Previous period deposits
 * @returns Shift detection result
 */
function detectShiftToCashPayments(currentPeriodDeposits, previousPeriodDeposits) {
    const current = analyzeCashVsCheckPreferences(currentPeriodDeposits);
    const previous = analyzeCashVsCheckPreferences(previousPeriodDeposits);
    const changePercentage = current.cashPreference - previous.cashPreference;
    const shiftDetected = changePercentage > 20; // 20 percentage point increase
    return {
        shiftDetected,
        previousCashRatio: previous.cashPreference,
        currentCashRatio: current.cashPreference,
        changePercentage
    };
}
// ============================================================================
// NIGHT DEPOSIT MONITORING (2 FUNCTIONS)
// ============================================================================
/**
 * Monitors night deposit activity after banking hours
 *
 * @param transactions - Transactions to analyze
 * @returns Night deposit activity summary
 */
function monitorNightDepositActivity(transactions) {
    const nightDeposits = transactions.filter(t => {
        const hour = t.timestamp.getHours();
        return hour >= 20 || hour < 6; // 8 PM to 6 AM
    });
    const total = nightDeposits.reduce((sum, t) => sum + t.amount, 0);
    return {
        totalNightDeposits: nightDeposits.length,
        nightDepositFrequency: nightDeposits.length / 30,
        totalNightAmount: total,
        averageNightDeposit: nightDeposits.length > 0 ? total / nightDeposits.length : 0
    };
}
/**
 * Flags off-hours cash deposits as suspicious
 *
 * @param transaction - Transaction to check
 * @param businessType - Type of business (optional, to assess normality)
 * @returns True if deposit is suspicious for the time
 */
function flagOffHoursCashDeposits(transaction, businessType = 'general') {
    const hour = transaction.timestamp.getHours();
    const dayOfWeek = transaction.timestamp.getDay();
    // Generally off-hours
    if (hour >= 22 || hour < 6) {
        return true;
    }
    // Weekend deposits might be unusual for some businesses
    if ((dayOfWeek === 0 || dayOfWeek === 6) && hour > 18) {
        if (businessType !== 'retail' && businessType !== 'restaurant') {
            return true;
        }
    }
    return false;
}
// ============================================================================
// BRANCH CASH AGGREGATION (3 FUNCTIONS)
// ============================================================================
/**
 * Analyzes cash aggregation patterns across branches
 *
 * @param transactions - Transactions across branches
 * @param periodStart - Start of analysis period
 * @param periodEnd - End of analysis period
 * @returns Branch aggregation analysis
 */
function analyzeBranchCashAggregation(transactions, periodStart, periodEnd) {
    const branchId = transactions[0]?.branchId ?? 'unknown';
    const periodTransactions = transactions.filter(t => t.timestamp >= periodStart && t.timestamp <= periodEnd);
    const totalAmount = periodTransactions.reduce((sum, t) => sum + t.amount, 0);
    const uniqueCustomers = new Set(periodTransactions.map(t => t.customerId)).size;
    const avgDepositSize = periodTransactions.length > 0 ? totalAmount / periodTransactions.length : 0;
    // Calculate Herfindahl concentration ratio
    const customerAmounts = new Map();
    periodTransactions.forEach(t => {
        customerAmounts.set(t.customerId, (customerAmounts.get(t.customerId) ?? 0) + t.amount);
    });
    let concentrationRatio = 0;
    customerAmounts.forEach(amount => {
        const ratio = amount / totalAmount;
        concentrationRatio += ratio * ratio;
    });
    const potentialLaunderingIndicators = [];
    if (concentrationRatio > 0.3) {
        potentialLaunderingIndicators.push('High concentration of deposits from few customers');
    }
    if (avgDepositSize > 100000) {
        potentialLaunderingIndicators.push('Unusually large average deposit size');
    }
    return {
        branchId,
        periodStart,
        periodEnd,
        totalCashDeposits: periodTransactions.length,
        aggregatedAmount: totalAmount,
        uniqueCustomers,
        averageDepositSize: avgDepositSize,
        concentrationRatio,
        potentialLaunderingIndicators
    };
}
/**
 * Detects cross-branch cash movements
 *
 * @param transactions - Multi-branch transactions from same customer
 * @returns Cross-branch movement analysis
 */
function detectCrossbranchCashMovements(transactions) {
    const uniqueBranches = new Set(transactions.map(t => t.branchId));
    const suspiciousIndicators = [];
    if (uniqueBranches.size > 5) {
        suspiciousIndicators.push('Transactions across many branches');
    }
    // Check for circular patterns
    const branchSequence = transactions.map(t => t.branchId);
    if (new Set(branchSequence).size < branchSequence.length / 2) {
        suspiciousIndicators.push('Repetitive branch pattern detected');
    }
    return {
        totalBranches: uniqueBranches.size,
        uniqueBranches,
        movementPattern: uniqueBranches.size > 3 ? 'distributed' : 'concentrated',
        suspiciousIndicators
    };
}
/**
 * Identifies aggregation patterns in branch transactions
 *
 * @param aggregationData - Branch aggregation analysis results
 * @returns Pattern identification
 */
function identifyAggregationPatterns(aggregationData) {
    const patterns = [];
    let riskLevel = 'low';
    // Analyze across branches
    const highConcentration = aggregationData.filter(b => b.concentrationRatio > 0.2).length;
    if (highConcentration > aggregationData.length * 0.5) {
        patterns.push('Multiple branches with high concentration');
        riskLevel = 'high';
    }
    // Check for coordinated timing
    const timeSpread = Math.max(...aggregationData.map(b => b.periodEnd.getTime())) -
        Math.min(...aggregationData.map(b => b.periodStart.getTime()));
    if (timeSpread < 7 * 24 * 60 * 60 * 1000) { // within one week
        patterns.push('Coordinated deposits across branches within short timeframe');
        riskLevel = 'medium';
    }
    // Check for unusual customer overlap
    const totalCustomers = aggregationData.reduce((sum, b) => sum + b.uniqueCustomers, 0);
    const avgCustomersPerBranch = totalCustomers / aggregationData.length;
    if (avgCustomersPerBranch > 50) {
        patterns.push('High customer concentration per branch');
    }
    const recommendedAction = riskLevel === 'high' ? 'Conduct SAR investigation' :
        riskLevel === 'medium' ? 'Enhanced monitoring required' :
            'Standard monitoring';
    return { patterns, riskLevel, recommendedAction };
}
// ============================================================================
// UTILITY & VALIDATION FUNCTIONS
// ============================================================================
/**
 * Validates transaction data integrity
 *
 * @param transaction - Transaction to validate
 * @returns Validation result with error details if invalid
 */
function validateTransactionData(transaction) {
    const errors = [];
    if (!transaction.transactionId)
        errors.push('Missing transaction ID');
    if (!transaction.customerId)
        errors.push('Missing customer ID');
    if (transaction.amount <= 0)
        errors.push('Invalid transaction amount');
    if (!transaction.currency)
        errors.push('Missing currency');
    if (!transaction.timestamp)
        errors.push('Missing timestamp');
    if (!transaction.branchId)
        errors.push('Missing branch ID');
    return {
        isValid: errors.length === 0,
        errors
    };
}
/**
 * Consolidates multiple alerts into summary
 *
 * @param alerts - Array of cash activity alerts
 * @returns Consolidated alert summary
 */
function consolidateAlerts(alerts) {
    const criticalCount = alerts.filter(a => a.severity === 'critical').length;
    const highCount = alerts.filter(a => a.severity === 'high').length;
    const warningCount = alerts.filter(a => a.severity === 'warning').length;
    const alertTypes = new Map();
    alerts.forEach(a => {
        alertTypes.set(a.alertType, (alertTypes.get(a.alertType) ?? 0) + 1);
    });
    const topAlertTypes = Array.from(alertTypes.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([type]) => type);
    return {
        totalAlerts: alerts.length,
        criticalCount,
        highCount,
        warningCount,
        topAlertTypes,
        requiresImmediateAction: criticalCount > 0
    };
}
/**
 * Generates risk assessment summary
 *
 * @param profile - Customer cash activity profile
 * @returns Risk assessment with recommendations
 */
function generateRiskAssessment(profile) {
    const flagCount = profile.flags.size;
    let riskScore = profile.riskScore;
    // Adjust based on flag count
    riskScore += flagCount * 5;
    // Assess risk level
    let riskLevel = 'low';
    if (riskScore >= 80)
        riskLevel = 'critical';
    else if (riskScore >= 60)
        riskLevel = 'high';
    else if (riskScore >= 40)
        riskLevel = 'medium';
    const primaryConcerns = Array.from(profile.flags).slice(0, 3);
    const recommendations = [];
    if (riskLevel === 'critical') {
        recommendations.push('Initiate SAR investigation immediately');
    }
    else if (riskLevel === 'high') {
        recommendations.push('Enhanced customer due diligence required');
    }
    if (profile.cashToDepositRatio > 0.7) {
        recommendations.push('Request business justification for high cash ratio');
    }
    return {
        overallRiskScore: Math.min(riskScore, 100),
        riskLevel,
        primaryConcerns,
        recommendations
    };
}
exports.default = {
    // Large Cash Detection
    detectLargeCashDeposit,
    identifyAnomalousDepositAmount,
    calculateDepositThreshold,
    trackDepositGrowthPattern,
    // Withdrawal Monitoring
    monitorCashWithdrawals,
    detectUnusualWithdrawalPattern,
    analyzeWithdrawalFrequency,
    flagExcessiveWithdrawalAmount,
    // ATM Analysis
    analyzeATMUsagePatterns,
    detectATMOverusage,
    identifyATMHoppingBehavior,
    calculateATMActivityScore,
    // Structuring/Smurfing
    detectStructuredDeposits,
    identifySmurfingPattern,
    analyzeDepositFragmentation,
    calculateStructuringRisk,
    // Cash-Intensive Business
    classifyCashIntensiveBusiness,
    monitorCashIntensiveActivity,
    flagAnomalousCashIntensiveTransactions,
    // Currency Exchange
    monitorCurrencyExchangeActivity,
    detectFXTradingAnomalies,
    analyzeMulticurrencyPatterns,
    // Cash Courier
    detectCashCourierActivity,
    identifyCourierPatterns,
    analyzeHighValueMovements,
    // Bulk Cash
    detectBulkCashMovements,
    analyzeCashVolumeShifts,
    flagUnusualCashTransfer,
    // Teller Patterns
    analyzeTellerTransactionPatterns,
    detectTellerAnomalies,
    calculateTellerActivityScore,
    // Cash Ratio
    calculateCashToDepositRatio,
    analyzeDepositComposition,
    // High Denominations
    detectHighDenominationUsage,
    analyzeNoteDenominationDistribution,
    flagAnomalousHighDenominationTransactions,
    // Frequent Transactions
    identifyFrequentCashTransactions,
    analyzeTransactionFrequencyPattern,
    calculateCashTransactionIntensity,
    // Cash vs Check
    analyzeCashVsCheckPreferences,
    detectShiftToCashPayments,
    // Night Deposits
    monitorNightDepositActivity,
    flagOffHoursCashDeposits,
    // Branch Aggregation
    analyzeBranchCashAggregation,
    detectCrossbranchCashMovements,
    identifyAggregationPatterns,
    // Utilities
    validateTransactionData,
    consolidateAlerts,
    generateRiskAssessment
};
//# sourceMappingURL=cash-activity-monitoring-kit.js.map