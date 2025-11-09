/**
 * LOC: CTMCOMP001
 * File: /reuse/edwards/financial/composites/cash-treasury-management-composite.ts
 *
 * UPSTREAM (imports from):
 *   - ../banking-reconciliation-kit
 *   - ../payment-processing-collections-kit
 *   - ../credit-management-risk-kit
 *   - ../multi-currency-management-kit
 *   - ../financial-reporting-analytics-kit
 *   - ../accounts-receivable-management-kit
 *   - ../financial-data-integration-kit
 *   - ../budget-management-control-kit
 *
 * DOWNSTREAM (imported by):
 *   - Treasury REST API controllers
 *   - Cash management GraphQL resolvers
 *   - Banking reconciliation services
 *   - Payment processing systems
 *   - Liquidity dashboards
 */
import { Transaction } from 'sequelize';
import { Payment, ElectronicPayment } from '../payment-processing-collections-kit';
import { CreditRisk, CreditExposure } from '../credit-management-risk-kit';
import { CashFlowStatement, LiquidityReport } from '../financial-reporting-analytics-kit';
import { IntegrationConfig } from '../financial-data-integration-kit';
/**
 * Consolidated cash position across all accounts
 */
export interface ConsolidatedCashPosition {
    positionDate: Date;
    totalCashBalance: number;
    availableCash: number;
    restrictedCash: number;
    pendingDeposits: number;
    pendingWithdrawals: number;
    outstandingChecks: number;
    accountPositions: AccountCashPosition[];
    currencyBreakdown: CurrencyPosition[];
}
/**
 * Cash position by account
 */
export interface AccountCashPosition {
    bankAccountId: number;
    accountNumber: string;
    accountName: string;
    bankName: string;
    currency: string;
    bookBalance: number;
    bankBalance: number;
    availableBalance: number;
    variance: number;
    lastReconciled: Date;
    status: 'current' | 'stale' | 'unreconciled';
}
/**
 * Currency position
 */
export interface CurrencyPosition {
    currency: string;
    totalBalance: number;
    functionalCurrencyEquivalent: number;
    exchangeRate: number;
    fxExposure: number;
    hedgeRatio: number;
}
/**
 * Cash flow forecast
 */
export interface CashFlowForecast {
    forecastDate: Date;
    forecastHorizon: number;
    openingBalance: number;
    projectedReceipts: ForecastPeriod[];
    projectedDisbursements: ForecastPeriod[];
    netCashFlow: number;
    closingBalance: number;
    minimumCashRequired: number;
    surplusDeficit: number;
    confidence: number;
}
/**
 * Forecast period
 */
export interface ForecastPeriod {
    periodName: string;
    periodStart: Date;
    periodEnd: Date;
    receipts: number;
    disbursements: number;
    netFlow: number;
    cumulativeBalance: number;
}
/**
 * Bank reconciliation result
 */
export interface BankReconciliationResult {
    reconciliationId: number;
    bankAccountId: number;
    statementDate: Date;
    bookBalance: number;
    bankBalance: number;
    matchedItems: number;
    unmatchedBookItems: number;
    unmatchedBankItems: number;
    adjustments: number;
    variance: number;
    isReconciled: boolean;
    reconciler: string;
    reviewedBy?: string;
}
/**
 * Investment portfolio
 */
export interface InvestmentPortfolio {
    portfolioId: number;
    portfolioName: string;
    totalMarketValue: number;
    totalCost: number;
    unrealizedGainLoss: number;
    investments: Investment[];
    assetAllocation: AssetAllocation[];
    yieldToMaturity: number;
    duration: number;
}
/**
 * Investment
 */
export interface Investment {
    investmentId: number;
    securityType: 'money-market' | 'treasury' | 'corporate-bond' | 'municipal' | 'cd' | 'commercial-paper';
    securityName: string;
    cusip?: string;
    purchaseDate: Date;
    maturityDate: Date;
    faceValue: number;
    purchasePrice: number;
    currentMarketValue: number;
    interestRate: number;
    accruedInterest: number;
    yieldToMaturity: number;
    rating?: string;
}
/**
 * Asset allocation
 */
export interface AssetAllocation {
    assetClass: string;
    marketValue: number;
    percentage: number;
    targetPercentage: number;
    variance: number;
}
/**
 * Liquidity metrics
 */
export interface LiquidityMetrics {
    calculationDate: Date;
    currentRatio: number;
    quickRatio: number;
    cashRatio: number;
    workingCapital: number;
    daysOfCashOnHand: number;
    cashConversionCycle: number;
    operatingCashFlowRatio: number;
    liquidityScore: number;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
}
/**
 * Payment optimization result
 */
export interface PaymentOptimizationResult {
    optimizationDate: Date;
    totalPayments: number;
    optimizedPayments: number;
    cashSavings: number;
    interestSavings: number;
    discountsCaptured: number;
    recommendations: PaymentRecommendation[];
}
/**
 * Payment recommendation
 */
export interface PaymentRecommendation {
    paymentId: number;
    vendorName: string;
    originalDueDate: Date;
    recommendedPayDate: Date;
    amount: number;
    earlyPaymentDiscount?: number;
    cashFlowImpact: number;
    rationale: string;
}
export declare class CashTreasuryManagementComposite {
    /**
     * Calculates consolidated cash position across all accounts
     * Composes: calculateCashPosition, trackOutstandingChecks, trackOutstandingDeposits, revalueCashBalances
     */
    calculateConsolidatedCashPosition(positionDate: Date, includeMultiCurrency?: boolean, transaction?: Transaction): Promise<ConsolidatedCashPosition>;
    /**
     * Monitors real-time cash balances with alerts
     * Composes: calculateCashPosition, monitorCashBudgetVariance, generateTreasuryDashboard
     */
    monitorRealTimeCashBalances(minimumCashThreshold: number, transaction?: Transaction): Promise<{
        currentPosition: ConsolidatedCashPosition;
        alerts: CashAlert[];
        dashboardUrl: string;
    }>;
    /**
     * Manages cash concentration across accounts
     * Composes: calculateCashPosition, createPaymentBatch, trackPaymentStatus
     */
    executeCashConcentration(targetAccountId: number, concentrationThreshold: number, transaction?: Transaction): Promise<{
        concentrationId: number;
        accountsSwept: number;
        totalConcentrated: number;
        transfers: CashTransfer[];
    }>;
    /**
     * Imports and reconciles bank statement automatically
     * Composes: importBankStatement, matchBankTransactions, reconcileBankStatement, generateReconciliationReport
     */
    autoReconcileBankStatement(bankAccountId: number, statementFile: string, fileFormat: 'BAI2' | 'OFX' | 'CSV', transaction?: Transaction): Promise<BankReconciliationResult>;
    /**
     * Reconciles multiple accounts in batch
     * Composes: importBankStatement, matchBankTransactions, reconcileBankStatement
     */
    batchReconcileBankAccounts(reconciliationRequests: Array<{
        bankAccountId: number;
        statementFile: string;
        fileFormat: 'BAI2' | 'OFX' | 'CSV';
    }>, transaction?: Transaction): Promise<{
        totalAccounts: number;
        reconciled: number;
        failed: number;
        results: BankReconciliationResult[];
    }>;
    /**
     * Integrates automated bank feeds
     * Composes: createBankFeedConnection, integrateBankFeeds, validateDataIntegration
     */
    setupAutomatedBankFeeds(bankAccountId: number, feedConfig: IntegrationConfig, transaction?: Transaction): Promise<{
        feedId: number;
        connected: boolean;
        lastSync: Date;
        validationPassed: boolean;
    }>;
    /**
     * Creates and processes payment batch with optimization
     * Composes: createPaymentBatch, optimizePaymentTiming, processPaymentBatch, generateACHFile
     */
    processOptimizedPaymentBatch(payments: Payment[], paymentMethod: 'ACH' | 'WIRE' | 'CHECK', transaction?: Transaction): Promise<{
        batchId: number;
        paymentsOptimized: number;
        totalAmount: number;
        paymentFile?: string;
        savings: number;
    }>;
    /**
     * Processes electronic payments with status tracking
     * Composes: createPayment, validatePaymentFormat, trackPaymentStatus, reconcilePayments
     */
    processElectronicPayment(payment: ElectronicPayment, transaction?: Transaction): Promise<{
        paymentId: number;
        status: string;
        confirmationNumber: string;
        estimatedSettlement: Date;
    }>;
    /**
     * Optimizes payment schedule for cash flow
     * Composes: optimizePaymentTiming, forecastCashRequirements, monitorCashBudgetVariance
     */
    optimizePaymentSchedule(scheduledPayments: Payment[], optimizationPeriod: number, transaction?: Transaction): Promise<PaymentOptimizationResult>;
    /**
     * Generates comprehensive cash flow forecast
     * Composes: forecastReceivablesCollection, forecastCashRequirements, generateCashFlowStatement
     */
    generateCashFlowForecast(forecastHorizon: number, includeScenarios?: boolean, transaction?: Transaction): Promise<CashFlowForecast>;
    /**
     * Analyzes liquidity with stress testing
     * Composes: calculateCashPosition, generateLiquidityReport, generateCashFlowStatement
     */
    analyzeLiquidityWithStressTesting(stressScenarios: Array<{
        scenarioName: string;
        receivablesReduction: number;
        payablesIncrease: number;
    }>, transaction?: Transaction): Promise<{
        baseMetrics: LiquidityMetrics;
        stressResults: StressTestResult[];
        recommendations: string[];
    }>;
    /**
     * Forecasts working capital requirements
     * Composes: forecastReceivablesCollection, forecastCashRequirements, generateCashFlowStatement
     */
    forecastWorkingCapitalRequirements(forecastMonths: number, transaction?: Transaction): Promise<{
        currentWorkingCapital: number;
        projectedRequirements: WorkingCapitalForecast[];
        fundingGap: number;
        recommendations: string[];
    }>;
    /**
     * Manages investment portfolio with rebalancing
     * Composes: calculateCashPosition, generateLiquidityReport
     */
    manageInvestmentPortfolio(portfolioId: number, targetAllocation: AssetAllocation[], transaction?: Transaction): Promise<{
        portfolio: InvestmentPortfolio;
        rebalancingNeeded: boolean;
        recommendations: InvestmentRecommendation[];
    }>;
    /**
     * Tracks investment income and maturity schedule
     * Composes: calculateCashPosition, forecastCashRequirements
     */
    trackInvestmentIncomeSchedule(portfolioId: number, forecastMonths: number, transaction?: Transaction): Promise<{
        scheduledIncome: InvestmentIncomeSchedule[];
        maturitiesSchedule: InvestmentMaturity[];
        totalExpectedIncome: number;
        totalMaturities: number;
    }>;
    /**
     * Manages foreign exchange exposure
     * Composes: calculateFXExposure, manageHedgePositions, executeForeignExchange
     */
    manageForeignExchangeExposure(baseCurrency: string, hedgingStrategy: 'full' | 'partial' | 'natural', transaction?: Transaction): Promise<{
        totalExposure: number;
        hedgedExposure: number;
        unhedgedExposure: number;
        hedgeRatio: number;
        recommendations: FXRecommendation[];
    }>;
    /**
     * Executes foreign exchange transactions
     * Composes: getCurrencyRate, executeForeignExchange, revalueCashBalances
     */
    executeForeignExchangeTransaction(fromCurrency: string, toCurrency: string, amount: number, transactionDate: Date, transaction?: Transaction): Promise<{
        fxTransactionId: number;
        exchangeRate: number;
        convertedAmount: number;
        fxGainLoss: number;
        settlementDate: Date;
    }>;
    /**
     * Evaluates counterparty credit risk
     * Composes: evaluateCreditRisk, calculateCreditExposure, generateCreditReport
     */
    evaluateCounterpartyCreditRisk(counterpartyId: number, exposureDate: Date, transaction?: Transaction): Promise<{
        creditRisk: CreditRisk;
        exposure: CreditExposure;
        recommendations: string[];
    }>;
    /**
     * Monitors credit limits and utilization
     * Composes: manageCreditLimits, monitorCreditUtilization, calculateCreditExposure
     */
    monitorCreditLimitsAndUtilization(transaction?: Transaction): Promise<{
        totalLimits: number;
        totalUtilization: number;
        utilizationPercent: number;
        exceedances: CreditExceedance[];
    }>;
    /**
     * Generates comprehensive treasury reporting package
     * Composes: generateCashFlowStatement, generateTreasuryDashboard, generateLiquidityReport, exportTreasuryReport
     */
    generateTreasuryReportingPackage(reportDate: Date, transaction?: Transaction): Promise<{
        cashFlowStatement: CashFlowStatement;
        dashboard: any;
        liquidityReport: LiquidityReport;
        packagePath: string;
    }>;
    /**
     * Analyzes treasury KPIs and performance
     * Composes: calculateCashPosition, generateLiquidityReport, generateCashFlowStatement
     */
    analyzeTreasuryKPIs(periodStart: Date, periodEnd: Date, transaction?: Transaction): Promise<{
        cashEfficiency: number;
        foreccastAccuracy: number;
        reconciliationTimeliness: number;
        investmentYield: number;
        fxEfficiency: number;
        overallScore: number;
    }>;
}
interface CashAlert {
    alertType: string;
    severity: string;
    message: string;
    recommendedAction: string;
}
interface CashTransfer {
    fromAccount: string;
    toAccount: string;
    amount: number;
    paymentId: number;
}
interface StressTestResult {
    scenarioName: string;
    stressedCashBalance: number;
    liquidityImpact: number;
    survivabilityDays: number;
    passedStressTest: boolean;
}
interface WorkingCapitalForecast {
    month: number;
    receipts: number;
    payments: number;
    workingCapitalNeed: number;
    cumulativeGap: number;
}
interface InvestmentRecommendation {
    action: string;
    assetClass: string;
    amount: number;
    rationale: string;
}
interface InvestmentIncomeSchedule {
    month: number;
    expectedIncome: number;
    accrualBasis: number;
    cashBasis: number;
}
interface InvestmentMaturity {
    maturityDate: Date;
    securityName: string;
    faceValue: number;
    expectedProceeds: number;
    reinvestmentNeeded: boolean;
}
interface FXRecommendation {
    currency: string;
    action: string;
    amount: number;
    instrument: string;
    rationale: string;
}
interface CreditExceedance {
    counterpartyId: number;
    counterpartyName: string;
    creditLimit: number;
    currentExposure: number;
    exceedanceAmount: number;
}
export { ConsolidatedCashPosition, AccountCashPosition, CurrencyPosition, CashFlowForecast, ForecastPeriod, BankReconciliationResult, InvestmentPortfolio, Investment, AssetAllocation, LiquidityMetrics, PaymentOptimizationResult, PaymentRecommendation, };
//# sourceMappingURL=cash-treasury-management-composite.d.ts.map