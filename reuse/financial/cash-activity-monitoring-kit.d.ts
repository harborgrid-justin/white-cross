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
/**
 * Represents a cash transaction event
 */
export interface CashTransaction {
    readonly transactionId: string;
    readonly customerId: string;
    readonly accountId: string;
    readonly amount: number;
    readonly currency: string;
    readonly transactionType: 'deposit' | 'withdrawal' | 'exchange' | 'transfer';
    readonly channel: 'teller' | 'atm' | 'mobile' | 'courier' | 'night_deposit';
    readonly timestamp: Date;
    readonly branchId: string;
    readonly denominationBreakdown?: Record<number, number>;
    readonly metadata?: Record<string, unknown>;
}
/**
 * Represents a customer's cash activity profile
 */
export interface CashActivityProfile {
    readonly customerId: string;
    readonly accountId: string;
    readonly averageMonthlyDeposit: number;
    readonly averageMonthlyWithdrawal: number;
    readonly totalCashTransactions: number;
    readonly cashToDepositRatio: number;
    readonly lastUpdated: Date;
    readonly riskScore: number;
    readonly flags: Set<string>;
}
/**
 * Represents ATM usage patterns
 */
export interface ATMUsagePattern {
    readonly atmId: string;
    readonly customerId: string;
    readonly totalWithdrawals: number;
    readonly totalAmountWithdrawn: number;
    readonly averageWithdrawalAmount: number;
    readonly frequencyPerDay: number;
    readonly uniqueATMsUsed: number;
    readonly hoppingSuspected: boolean;
    readonly lastUsageDate: Date;
}
/**
 * Represents structured cash deposit pattern
 */
export interface StructuredDepositPattern {
    readonly customerId: string;
    readonly periodStart: Date;
    readonly periodEnd: Date;
    readonly depositsCount: number;
    readonly totalAmount: number;
    readonly averageDepositAmount: number;
    readonly fragmentationRatio: number;
    readonly structuringRisk: 'low' | 'medium' | 'high' | 'critical';
    readonly pattern: 'consistent' | 'variable' | 'irregular';
}
/**
 * Represents cash-intensive business activity
 */
export interface CashIntensiveBusinessProfile {
    readonly businessId: string;
    readonly businessType: string;
    readonly monthlyAverageDeposit: number;
    readonly cashToTotalDepositRatio: number;
    readonly expectedCashRatio: number;
    readonly anomalyScore: number;
    readonly isWithinNorms: boolean;
    readonly flags: string[];
}
/**
 * Represents currency exchange activity
 */
export interface CurrencyExchangeActivity {
    readonly customerId: string;
    readonly sourceCurrency: string;
    readonly targetCurrency: string;
    readonly exchangeAmount: number;
    readonly exchangeRate: number;
    readonly totalExchangeVolume30Days: number;
    readonly frequencyPattern: 'sporadic' | 'regular' | 'concentrated';
    readonly anomalyIndicators: string[];
}
/**
 * Represents high-denomination cash activity
 */
export interface HighDenominationCashProfile {
    readonly customerId: string;
    readonly totalHighDenominationAmount: number;
    readonly percentageOfTotalCash: number;
    readonly transactionCount: number;
    readonly averagePerTransaction: number;
    readonly suspiciousPatterns: string[];
}
/**
 * Represents night deposit activity
 */
export interface NightDepositActivity {
    readonly customerId: string;
    readonly branchId: string;
    readonly depositAmount: number;
    readonly depositTime: Date;
    readonly isAfterHours: boolean;
    readonly frequencyPerMonth: number;
    readonly suspiciousIndicators: string[];
}
/**
 * Represents branch-level cash aggregation
 */
export interface BranchCashAggregation {
    readonly branchId: string;
    readonly periodStart: Date;
    readonly periodEnd: Date;
    readonly totalCashDeposits: number;
    readonly aggregatedAmount: number;
    readonly uniqueCustomers: number;
    readonly averageDepositSize: number;
    readonly concentrationRatio: number;
    readonly potentialLaunderingIndicators: string[];
}
/**
 * Alert configuration for cash activity
 */
export interface CashActivityAlert {
    readonly alertId: string;
    readonly customerId: string;
    readonly alertType: string;
    readonly severity: 'info' | 'warning' | 'high' | 'critical';
    readonly description: string;
    readonly timestamp: Date;
    readonly requiresInvestigation: boolean;
    readonly recommendedAction: string;
}
/**
 * Detects large cash deposits based on customer history and thresholds
 *
 * @param transaction - The cash transaction to analyze
 * @param customerProfile - The customer's cash activity profile
 * @param thresholdMultiplier - How many times the average equals a large deposit (default: 3)
 * @returns Alert object if deposit is unusually large, null otherwise
 * @throws Error if transaction data is invalid
 */
export declare function detectLargeCashDeposit(transaction: CashTransaction, customerProfile: CashActivityProfile, thresholdMultiplier?: number): CashActivityAlert | null;
/**
 * Identifies anomalous deposit amounts relative to statistical norms
 *
 * @param amount - The deposit amount
 * @param historicalAmounts - Array of historical deposit amounts
 * @param standardDeviations - Number of standard deviations to flag as anomalous (default: 2)
 * @returns True if amount is anomalous, false otherwise
 */
export declare function identifyAnomalousDepositAmount(amount: number, historicalAmounts: number[], standardDeviations?: number): boolean;
/**
 * Calculates appropriate deposit threshold based on customer profile and regulatory requirements
 *
 * @param customerProfile - The customer's activity profile
 * @param regulatoryThreshold - Regulatory minimum threshold (e.g., 10000)
 * @param riskAdjustment - Additional multiplier based on risk level (default: 1)
 * @returns Calculated threshold amount
 */
export declare function calculateDepositThreshold(customerProfile: CashActivityProfile, regulatoryThreshold: number, riskAdjustment?: number): number;
/**
 * Tracks deposit growth patterns and identifies unusual acceleration
 *
 * @param deposits - Array of monthly deposit amounts
 * @param monthCount - Number of months to analyze (default: 6)
 * @returns Growth rate and anomaly detection result
 */
export declare function trackDepositGrowthPattern(deposits: number[], monthCount?: number): {
    growthRate: number;
    isAnomalous: boolean;
    trend: 'increasing' | 'decreasing' | 'stable';
};
/**
 * Monitors cash withdrawal patterns over a period
 *
 * @param withdrawals - Array of withdrawal transactions
 * @param timeWindow - Analysis window in days (default: 30)
 * @returns Withdrawal pattern analysis
 */
export declare function monitorCashWithdrawals(withdrawals: CashTransaction[], timeWindow?: number): {
    totalWithdrawals: number;
    totalAmount: number;
    averageAmount: number;
    frequencyPerDay: number;
    maxWithdrawal: number;
};
/**
 * Detects unusual withdrawal patterns indicating potential suspicious activity
 *
 * @param withdrawals - Array of withdrawal transactions
 * @param baselineFrequency - Expected daily withdrawal frequency
 * @returns Array of detected unusual patterns
 */
export declare function detectUnusualWithdrawalPattern(withdrawals: CashTransaction[], baselineFrequency?: number): string[];
/**
 * Analyzes withdrawal frequency patterns
 *
 * @param withdrawals - Array of withdrawal transactions sorted by timestamp
 * @returns Frequency analysis including peaks and anomalies
 */
export declare function analyzeWithdrawalFrequency(withdrawals: CashTransaction[]): {
    dailyFrequency: number;
    weeklyFrequency: number;
    peakDay: string | null;
    averageIntervalDays: number;
    isRegular: boolean;
};
/**
 * Flags withdrawal amounts that exceed expected thresholds
 *
 * @param amount - The withdrawal amount
 * @param customerProfile - Customer's activity profile
 * @param riskLevel - Customer's risk level ('low' | 'medium' | 'high')
 * @returns True if amount should be flagged
 */
export declare function flagExcessiveWithdrawalAmount(amount: number, customerProfile: CashActivityProfile, riskLevel?: 'low' | 'medium' | 'high'): boolean;
/**
 * Analyzes ATM usage patterns for a customer
 *
 * @param atmTransactions - Array of ATM transactions
 * @returns ATM usage pattern analysis
 */
export declare function analyzeATMUsagePatterns(atmTransactions: CashTransaction[]): ATMUsagePattern | null;
/**
 * Detects excessive ATM usage indicating potential smurfing
 *
 * @param atmPattern - The ATM usage pattern
 * @param maxDailyFrequency - Maximum expected daily ATM visits (default: 1)
 * @returns True if usage is excessive
 */
export declare function detectATMOverusage(atmPattern: ATMUsagePattern, maxDailyFrequency?: number): boolean;
/**
 * Identifies ATM hopping behavior (using multiple ATMs in short timeframes)
 *
 * @param atmTransactions - Sorted array of ATM transactions
 * @param timeWindowMinutes - Time window to detect hopping (default: 120)
 * @returns Array of detected hopping instances
 */
export declare function identifyATMHoppingBehavior(atmTransactions: CashTransaction[], timeWindowMinutes?: number): Array<{
    timestamp: Date;
    atmCount: number;
    amount: number;
}>;
/**
 * Calculates a composite score for ATM activity riskiness
 *
 * @param atmPattern - ATM usage pattern
 * @returns Risk score from 0 (low) to 100 (critical)
 */
export declare function calculateATMActivityScore(atmPattern: ATMUsagePattern): number;
/**
 * Detects structured cash deposits (smurfing behavior)
 *
 * @param deposits - Array of deposit transactions
 * @param threshold - Reporting threshold to avoid (e.g., 10000)
 * @param timeWindow - Time window in days (default: 30)
 * @returns Structured deposit pattern analysis
 */
export declare function detectStructuredDeposits(deposits: CashTransaction[], threshold?: number, timeWindow?: number): StructuredDepositPattern;
/**
 * Identifies smurfing patterns through multiple small transactions
 *
 * @param transactions - Array of transactions
 * @param threshold - Threshold to avoid (default: 10000)
 * @param transactionCount - Minimum transaction count to flag (default: 5)
 * @returns True if smurfing pattern detected
 */
export declare function identifySmurfingPattern(transactions: CashTransaction[], threshold?: number, transactionCount?: number): boolean;
/**
 * Analyzes deposit fragmentation to identify structured deposits
 *
 * @param deposits - Array of deposits
 * @returns Fragmentation analysis
 */
export declare function analyzeDepositFragmentation(deposits: CashTransaction[]): {
    fragmentationIndex: number;
    isFragmented: boolean;
    recommendation: string;
};
/**
 * Calculates overall structuring risk score
 *
 * @param pattern - Structured deposit pattern
 * @param recentTransactions - Recent transaction count
 * @returns Risk score 0-100
 */
export declare function calculateStructuringRisk(pattern: StructuredDepositPattern, recentTransactions: number): number;
/**
 * Classifies a business by cash-intensity level
 *
 * @param businessType - Type of business (e.g., 'retail', 'restaurant', 'casino')
 * @param monthlyDeposits - Monthly deposit amount
 * @param monthlyTotalTransactions - Total monthly transactions
 * @returns Cash-intensive business profile
 */
export declare function classifyCashIntensiveBusiness(businessType: string, monthlyDeposits: number, monthlyTotalTransactions: number): CashIntensiveBusinessProfile;
/**
 * Monitors cash-intensive business for suspicious patterns
 *
 * @param profile - Business profile
 * @param historicalProfile - Previous period profile for comparison
 * @returns Alert if anomalies detected
 */
export declare function monitorCashIntensiveActivity(profile: CashIntensiveBusinessProfile, historicalProfile: CashIntensiveBusinessProfile | null): CashActivityAlert | null;
/**
 * Flags transactions that don't match business profile
 *
 * @param transaction - The transaction
 * @param businessProfile - Expected business profile
 * @returns True if transaction is anomalous for the business
 */
export declare function flagAnomalousCashIntensiveTransactions(transaction: CashTransaction, businessProfile: CashIntensiveBusinessProfile): boolean;
/**
 * Monitors currency exchange activity for anomalies
 *
 * @param exchangeTransactions - Array of currency exchange transactions
 * @returns Currency exchange activity analysis
 */
export declare function monitorCurrencyExchangeActivity(exchangeTransactions: CashTransaction[]): CurrencyExchangeActivity[];
/**
 * Detects foreign exchange trading anomalies
 *
 * @param fxTransactions - FX transactions
 * @returns Anomalies detected
 */
export declare function detectFXTradingAnomalies(fxTransactions: CashTransaction[]): string[];
/**
 * Analyzes multi-currency transaction patterns
 *
 * @param transactions - Transactions with currency info
 * @returns Multi-currency pattern analysis
 */
export declare function analyzeMulticurrencyPatterns(transactions: CashTransaction[]): {
    uniqueCurrencies: number;
    dominantCurrency: string;
    pattern: 'single' | 'dual' | 'multi';
    suspiciousIndicators: string[];
};
/**
 * Detects potential cash courier activity
 *
 * @param transactions - Transactions to analyze
 * @param transactionThreshold - Minimum transaction amount (default: 50000)
 * @returns Courier activity indicators
 */
export declare function detectCashCourierActivity(transactions: CashTransaction[], transactionThreshold?: number): {
    isCourierActivity: boolean;
    indicators: string[];
    riskScore: number;
};
/**
 * Identifies patterns typical of cash courier operations
 *
 * @param transactions - Transactions to analyze
 * @returns Courier pattern indicators
 */
export declare function identifyCourierPatterns(transactions: CashTransaction[]): string[];
/**
 * Analyzes high-value movements potentially indicating courier activity
 *
 * @param transactions - High-value transactions
 * @returns Movement analysis
 */
export declare function analyzeHighValueMovements(transactions: CashTransaction[]): {
    totalValue: number;
    averageValue: number;
    concentrationRatio: number;
    suspiciousMovements: number;
};
/**
 * Detects bulk cash movements across accounts/branches
 *
 * @param transactions - Transactions to analyze
 * @param bulkThreshold - Amount threshold for bulk (default: 50000)
 * @returns Bulk movement analysis
 */
export declare function detectBulkCashMovements(transactions: CashTransaction[], bulkThreshold?: number): Array<{
    date: Date;
    amount: number;
    isAnomalous: boolean;
}>;
/**
 * Analyzes cash volume shifts between periods
 *
 * @param currentPeriodAmount - Current period total
 * @param previousPeriodAmount - Previous period total
 * @returns Shift analysis
 */
export declare function analyzeCashVolumeShifts(currentPeriodAmount: number, previousPeriodAmount: number): {
    percentageChange: number;
    isAnomalous: boolean;
    trend: 'increasing' | 'decreasing' | 'stable';
};
/**
 * Flags unusual cash transfers between entities
 *
 * @param fromEntity - Source entity
 * @param toEntity - Destination entity
 * @param amount - Transfer amount
 * @param typicalAmount - Typical transfer size
 * @returns True if transfer is suspicious
 */
export declare function flagUnusualCashTransfer(fromEntity: string, toEntity: string, amount: number, typicalAmount: number): boolean;
/**
 * Analyzes teller transaction patterns
 *
 * @param tellerTransactions - Transactions processed by tellers
 * @returns Pattern analysis
 */
export declare function analyzeTellerTransactionPatterns(tellerTransactions: CashTransaction[]): {
    totalTransactions: number;
    averageTransaction: number;
    peakHours: number[];
    mostCommonChannel: string;
};
/**
 * Detects anomalous teller behavior
 *
 * @param tellerTransactions - Teller transactions
 * @param baselineProfile - Expected baseline pattern
 * @returns Anomalies detected
 */
export declare function detectTellerAnomalies(tellerTransactions: CashTransaction[], baselineProfile: {
    averageTransaction: number;
    peakHours: number[];
}): string[];
/**
 * Calculates risk score for teller activity
 *
 * @param transactions - Teller transactions
 * @returns Risk score 0-100
 */
export declare function calculateTellerActivityScore(transactions: CashTransaction[]): number;
/**
 * Calculates the ratio of cash deposits to total deposits
 *
 * @param cashDeposits - Total cash deposited
 * @param totalDeposits - Total of all deposits
 * @returns Cash ratio analysis
 */
export declare function calculateCashToDepositRatio(cashDeposits: number, totalDeposits: number): {
    ratio: number;
    percentage: number;
    riskLevel: 'low' | 'medium' | 'high';
};
/**
 * Analyzes composition of deposit methods
 *
 * @param deposits - Deposit transactions
 * @returns Composition analysis
 */
export declare function analyzeDepositComposition(deposits: CashTransaction[]): {
    cashPercentage: number;
    checkPercentage: number;
    transferPercentage: number;
    otherPercentage: number;
    dominantMethod: string;
};
/**
 * Detects usage of high-denomination notes in transactions
 *
 * @param denominationBreakdown - Map of denomination to count
 * @returns High denomination analysis
 */
export declare function detectHighDenominationUsage(denominationBreakdown: Record<number, number> | undefined): {
    hasHighDenominations: boolean;
    highDenominationPercentage: number;
    suspiciousIndicators: string[];
};
/**
 * Analyzes denomination distribution patterns
 *
 * @param denominationBreakdowns - Multiple denomination breakdowns over time
 * @returns Distribution analysis
 */
export declare function analyzeNoteDenominationDistribution(denominationBreakdowns: Record<number, number>[]): {
    averageDistribution: Record<number, number>;
    standardDeviation: Record<number, number>;
    anomalies: string[];
};
/**
 * Flags transactions with anomalous high-denomination usage
 *
 * @param transaction - Transaction to check
 * @param expectedDenominationPattern - Expected denomination distribution
 * @returns True if anomalous
 */
export declare function flagAnomalousHighDenominationTransactions(transaction: CashTransaction, expectedDenominationPattern: Record<number, number>): boolean;
/**
 * Identifies customers with frequent cash transactions
 *
 * @param transactions - Cash transactions
 * @param frequencyThreshold - Transactions per day to flag (default: 2)
 * @returns Identified high-frequency customers
 */
export declare function identifyFrequentCashTransactions(transactions: CashTransaction[], frequencyThreshold?: number): Array<{
    customerId: string;
    frequency: number;
    totalAmount: number;
}>;
/**
 * Analyzes transaction frequency patterns
 *
 * @param transactions - Transactions sorted by date
 * @returns Frequency pattern analysis
 */
export declare function analyzeTransactionFrequencyPattern(transactions: CashTransaction[]): {
    averageFrequencyPerDay: number;
    peakFrequencyDay: number;
    isHighFrequency: boolean;
    pattern: 'clustered' | 'spread' | 'irregular';
};
/**
 * Calculates intensity of cash transaction activity
 *
 * @param transactions - Cash transactions
 * @param period - Period in days (default: 30)
 * @returns Cash transaction intensity score 0-100
 */
export declare function calculateCashTransactionIntensity(transactions: CashTransaction[], period?: number): number;
/**
 * Analyzes customer preferences between cash and check deposits
 *
 * @param deposits - Deposit transactions
 * @returns Preference analysis
 */
export declare function analyzeCashVsCheckPreferences(deposits: CashTransaction[]): {
    cashPreference: number;
    checkPreference: number;
    dominantMethod: 'cash' | 'check' | 'mixed';
    shiftToCash: boolean;
};
/**
 * Detects shift in payment method preferences
 *
 * @param currentPeriodDeposits - Current period deposits
 * @param previousPeriodDeposits - Previous period deposits
 * @returns Shift detection result
 */
export declare function detectShiftToCashPayments(currentPeriodDeposits: CashTransaction[], previousPeriodDeposits: CashTransaction[]): {
    shiftDetected: boolean;
    previousCashRatio: number;
    currentCashRatio: number;
    changePercentage: number;
};
/**
 * Monitors night deposit activity after banking hours
 *
 * @param transactions - Transactions to analyze
 * @returns Night deposit activity summary
 */
export declare function monitorNightDepositActivity(transactions: CashTransaction[]): {
    totalNightDeposits: number;
    nightDepositFrequency: number;
    totalNightAmount: number;
    averageNightDeposit: number;
};
/**
 * Flags off-hours cash deposits as suspicious
 *
 * @param transaction - Transaction to check
 * @param businessType - Type of business (optional, to assess normality)
 * @returns True if deposit is suspicious for the time
 */
export declare function flagOffHoursCashDeposits(transaction: CashTransaction, businessType?: string): boolean;
/**
 * Analyzes cash aggregation patterns across branches
 *
 * @param transactions - Transactions across branches
 * @param periodStart - Start of analysis period
 * @param periodEnd - End of analysis period
 * @returns Branch aggregation analysis
 */
export declare function analyzeBranchCashAggregation(transactions: CashTransaction[], periodStart: Date, periodEnd: Date): BranchCashAggregation;
/**
 * Detects cross-branch cash movements
 *
 * @param transactions - Multi-branch transactions from same customer
 * @returns Cross-branch movement analysis
 */
export declare function detectCrossbranchCashMovements(transactions: CashTransaction[]): {
    totalBranches: number;
    uniqueBranches: Set<string>;
    movementPattern: string;
    suspiciousIndicators: string[];
};
/**
 * Identifies aggregation patterns in branch transactions
 *
 * @param aggregationData - Branch aggregation analysis results
 * @returns Pattern identification
 */
export declare function identifyAggregationPatterns(aggregationData: BranchCashAggregation[]): {
    patterns: string[];
    riskLevel: 'low' | 'medium' | 'high';
    recommendedAction: string;
};
/**
 * Validates transaction data integrity
 *
 * @param transaction - Transaction to validate
 * @returns Validation result with error details if invalid
 */
export declare function validateTransactionData(transaction: CashTransaction): {
    isValid: boolean;
    errors: string[];
};
/**
 * Consolidates multiple alerts into summary
 *
 * @param alerts - Array of cash activity alerts
 * @returns Consolidated alert summary
 */
export declare function consolidateAlerts(alerts: CashActivityAlert[]): {
    totalAlerts: number;
    criticalCount: number;
    highCount: number;
    warningCount: number;
    topAlertTypes: string[];
    requiresImmediateAction: boolean;
};
/**
 * Generates risk assessment summary
 *
 * @param profile - Customer cash activity profile
 * @returns Risk assessment with recommendations
 */
export declare function generateRiskAssessment(profile: CashActivityProfile): {
    overallRiskScore: number;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    primaryConcerns: string[];
    recommendations: string[];
};
declare const _default: {
    detectLargeCashDeposit: typeof detectLargeCashDeposit;
    identifyAnomalousDepositAmount: typeof identifyAnomalousDepositAmount;
    calculateDepositThreshold: typeof calculateDepositThreshold;
    trackDepositGrowthPattern: typeof trackDepositGrowthPattern;
    monitorCashWithdrawals: typeof monitorCashWithdrawals;
    detectUnusualWithdrawalPattern: typeof detectUnusualWithdrawalPattern;
    analyzeWithdrawalFrequency: typeof analyzeWithdrawalFrequency;
    flagExcessiveWithdrawalAmount: typeof flagExcessiveWithdrawalAmount;
    analyzeATMUsagePatterns: typeof analyzeATMUsagePatterns;
    detectATMOverusage: typeof detectATMOverusage;
    identifyATMHoppingBehavior: typeof identifyATMHoppingBehavior;
    calculateATMActivityScore: typeof calculateATMActivityScore;
    detectStructuredDeposits: typeof detectStructuredDeposits;
    identifySmurfingPattern: typeof identifySmurfingPattern;
    analyzeDepositFragmentation: typeof analyzeDepositFragmentation;
    calculateStructuringRisk: typeof calculateStructuringRisk;
    classifyCashIntensiveBusiness: typeof classifyCashIntensiveBusiness;
    monitorCashIntensiveActivity: typeof monitorCashIntensiveActivity;
    flagAnomalousCashIntensiveTransactions: typeof flagAnomalousCashIntensiveTransactions;
    monitorCurrencyExchangeActivity: typeof monitorCurrencyExchangeActivity;
    detectFXTradingAnomalies: typeof detectFXTradingAnomalies;
    analyzeMulticurrencyPatterns: typeof analyzeMulticurrencyPatterns;
    detectCashCourierActivity: typeof detectCashCourierActivity;
    identifyCourierPatterns: typeof identifyCourierPatterns;
    analyzeHighValueMovements: typeof analyzeHighValueMovements;
    detectBulkCashMovements: typeof detectBulkCashMovements;
    analyzeCashVolumeShifts: typeof analyzeCashVolumeShifts;
    flagUnusualCashTransfer: typeof flagUnusualCashTransfer;
    analyzeTellerTransactionPatterns: typeof analyzeTellerTransactionPatterns;
    detectTellerAnomalies: typeof detectTellerAnomalies;
    calculateTellerActivityScore: typeof calculateTellerActivityScore;
    calculateCashToDepositRatio: typeof calculateCashToDepositRatio;
    analyzeDepositComposition: typeof analyzeDepositComposition;
    detectHighDenominationUsage: typeof detectHighDenominationUsage;
    analyzeNoteDenominationDistribution: typeof analyzeNoteDenominationDistribution;
    flagAnomalousHighDenominationTransactions: typeof flagAnomalousHighDenominationTransactions;
    identifyFrequentCashTransactions: typeof identifyFrequentCashTransactions;
    analyzeTransactionFrequencyPattern: typeof analyzeTransactionFrequencyPattern;
    calculateCashTransactionIntensity: typeof calculateCashTransactionIntensity;
    analyzeCashVsCheckPreferences: typeof analyzeCashVsCheckPreferences;
    detectShiftToCashPayments: typeof detectShiftToCashPayments;
    monitorNightDepositActivity: typeof monitorNightDepositActivity;
    flagOffHoursCashDeposits: typeof flagOffHoursCashDeposits;
    analyzeBranchCashAggregation: typeof analyzeBranchCashAggregation;
    detectCrossbranchCashMovements: typeof detectCrossbranchCashMovements;
    identifyAggregationPatterns: typeof identifyAggregationPatterns;
    validateTransactionData: typeof validateTransactionData;
    consolidateAlerts: typeof consolidateAlerts;
    generateRiskAssessment: typeof generateRiskAssessment;
};
export default _default;
//# sourceMappingURL=cash-activity-monitoring-kit.d.ts.map