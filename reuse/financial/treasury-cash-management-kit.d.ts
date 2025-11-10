/**
 * LOC: TRYCSH7890123
 * File: /reuse/financial/treasury-cash-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Backend financial services
 *   - Treasury management controllers
 *   - Cash flow analysis services
 *   - Bank reconciliation modules
 */
/**
 * File: /reuse/financial/treasury-cash-management-kit.ts
 * Locator: WC-FIN-TRYCSH-001
 * Purpose: USACE CEFMS-Level Treasury & Cash Management - cash positioning, bank reconciliation,
 *          cash forecasting, liquidity management, investment tracking, wire transfers
 *
 * Upstream: Independent utility module for treasury operations
 * Downstream: ../backend/*, financial controllers, treasury services, reconciliation engines
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 47 utility functions for cash management, bank reconciliation, forecasting, investments
 *
 * LLM Context: Enterprise-grade treasury and cash management utilities competing with USACE CEFMS.
 * Provides cash position tracking, multi-bank reconciliation, cash flow forecasting, liquidity analysis,
 * investment portfolio management, wire transfer processing, check clearing, automated sweeps,
 * concentration accounting, notional pooling, zero-balance accounts, treasury workstation integration,
 * SWIFT/ACH processing, fraud detection, and real-time cash visibility across distributed accounts.
 */
import { Sequelize, Transaction } from 'sequelize';
interface CashPosition {
    accountId: string;
    bankId: string;
    currency: string;
    availableBalance: number;
    ledgerBalance: number;
    floatAmount: number;
    timestamp: Date;
    metadata?: Record<string, any>;
}
interface BankTransaction {
    transactionId: string;
    valueDate: Date;
    postingDate: Date;
    amount: number;
    type: 'DEBIT' | 'CREDIT';
    description: string;
    referenceNumber: string;
    checkNumber?: string;
    counterparty?: string;
    status: 'PENDING' | 'CLEARED' | 'RECONCILED';
}
interface ReconciliationMatch {
    bankTransactionId: string;
    ledgerTransactionId: string;
    matchType: 'EXACT' | 'FUZZY' | 'MANUAL';
    matchScore: number;
    variance?: number;
    matchedBy?: string;
    matchedAt: Date;
}
interface CashFlowForecast {
    forecastDate: Date;
    projectedInflows: number;
    projectedOutflows: number;
    netCashFlow: number;
    cumulativeBalance: number;
    confidence: number;
    scenario: 'OPTIMISTIC' | 'REALISTIC' | 'PESSIMISTIC';
    assumptions: string[];
}
interface LiquidityAnalysis {
    asOfDate: Date;
    totalCash: number;
    availableCash: number;
    restrictedCash: number;
    shortTermInvestments: number;
    currentRatio: number;
    quickRatio: number;
    workingCapital: number;
    daysOfCashOnHand: number;
    recommendations: string[];
}
interface Investment {
    investmentId: string;
    accountId: string;
    securityType: 'TBILL' | 'COMMERCIAL_PAPER' | 'CD' | 'MONEY_MARKET' | 'REPO';
    cusip?: string;
    principalAmount: number;
    purchaseDate: Date;
    maturityDate: Date;
    interestRate: number;
    currentValue: number;
    accruedInterest: number;
    yieldToMaturity: number;
    ratingAgency?: string;
    creditRating?: string;
}
interface WireTransfer {
    wireId: string;
    initiatedBy: string;
    debitAccountId: string;
    creditAccountId: string;
    amount: number;
    currency: string;
    valueDate: Date;
    beneficiaryName: string;
    beneficiaryBank: string;
    beneficiaryAccount: string;
    swiftCode?: string;
    routingNumber?: string;
    purpose: string;
    status: 'PENDING' | 'APPROVED' | 'SENT' | 'RECEIVED' | 'REJECTED' | 'CANCELLED';
    approvals: WireApproval[];
}
interface WireApproval {
    approverUserId: string;
    approvalLevel: number;
    approvedAt: Date;
    comments?: string;
    ipAddress: string;
}
interface ReconciliationReport {
    reportId: string;
    accountId: string;
    periodStart: Date;
    periodEnd: Date;
    bankBalance: number;
    ledgerBalance: number;
    outstandingChecks: number;
    depositsInTransit: number;
    bankErrors: number;
    bookErrors: number;
    adjustedBankBalance: number;
    adjustedBookBalance: number;
    variance: number;
    isReconciled: boolean;
    reconciledBy?: string;
    reconciledAt?: Date;
    exceptions: ReconciliationException[];
}
interface ReconciliationException {
    exceptionId: string;
    type: 'MISSING_BANK' | 'MISSING_LEDGER' | 'AMOUNT_MISMATCH' | 'DATE_MISMATCH' | 'DUPLICATE';
    description: string;
    amount: number;
    transactionRef: string;
    status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED';
    assignedTo?: string;
    resolution?: string;
}
interface CashConcentration {
    concentrationId: string;
    masterAccountId: string;
    targetAccountIds: string[];
    sweepType: 'TARGET_BALANCE' | 'ZERO_BALANCE' | 'THRESHOLD';
    sweepFrequency: 'DAILY' | 'WEEKLY' | 'ON_DEMAND';
    sweepTime?: string;
    lastSweepDate?: Date;
    enabled: boolean;
}
/**
 * Sequelize model for Cash Positions with real-time balance tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CashPosition model
 *
 * @example
 * ```typescript
 * const CashPosition = createCashPositionModel(sequelize);
 * const position = await CashPosition.create({
 *   accountId: 'ACC-001',
 *   bankId: 'BNK-001',
 *   currency: 'USD',
 *   availableBalance: 1500000.00,
 *   ledgerBalance: 1520000.00,
 *   floatAmount: 20000.00
 * });
 * ```
 */
export declare const createCashPositionModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        accountId: string;
        bankId: string;
        accountNumber: string;
        accountName: string;
        currency: string;
        availableBalance: number;
        ledgerBalance: number;
        floatAmount: number;
        clearedBalance: number;
        unclearedChecks: number;
        unclearedDeposits: number;
        availableCredit: number;
        reservedFunds: number;
        overdraftLimit: number;
        effectiveBalance: number;
        positionDate: Date;
        valueDate: Date;
        lastUpdated: Date;
        dataSource: string;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Bank Reconciliations with exception tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} BankReconciliation model
 *
 * @example
 * ```typescript
 * const BankReconciliation = createBankReconciliationModel(sequelize);
 * const recon = await BankReconciliation.create({
 *   accountId: 'ACC-001',
 *   periodStart: new Date('2024-01-01'),
 *   periodEnd: new Date('2024-01-31'),
 *   bankBalance: 1000000.00,
 *   ledgerBalance: 995000.00,
 *   status: 'IN_PROGRESS'
 * });
 * ```
 */
export declare const createBankReconciliationModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        reconciliationId: string;
        accountId: string;
        periodStart: Date;
        periodEnd: Date;
        bankOpeningBalance: number;
        bankClosingBalance: number;
        ledgerOpeningBalance: number;
        ledgerClosingBalance: number;
        outstandingChecks: number;
        depositsInTransit: number;
        bankServiceCharges: number;
        interestEarned: number;
        nsfReturns: number;
        bankErrors: number;
        bookErrors: number;
        otherAdjustments: number;
        adjustedBankBalance: number;
        adjustedBookBalance: number;
        variance: number;
        matchedTransactions: number;
        unmatchedBankTransactions: number;
        unmatchedLedgerTransactions: number;
        status: string;
        isReconciled: boolean;
        reconciledBy: string | null;
        reconciledAt: Date | null;
        approvedBy: string | null;
        approvedAt: Date | null;
        comments: string | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Investment Portfolio tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Investment model
 *
 * @example
 * ```typescript
 * const Investment = createInvestmentModel(sequelize);
 * const investment = await Investment.create({
 *   investmentId: 'INV-001',
 *   securityType: 'TBILL',
 *   principalAmount: 100000.00,
 *   purchaseDate: new Date(),
 *   maturityDate: new Date('2024-06-30'),
 *   interestRate: 5.25
 * });
 * ```
 */
export declare const createInvestmentModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        investmentId: string;
        accountId: string;
        portfolioId: string;
        securityType: string;
        securityName: string;
        cusip: string | null;
        isin: string | null;
        principalAmount: number;
        purchaseDate: Date;
        settlementDate: Date;
        maturityDate: Date;
        interestRate: number;
        purchasePrice: number;
        currentValue: number;
        marketValue: number;
        accruedInterest: number;
        yieldToMaturity: number;
        effectiveYield: number;
        duration: number;
        creditRating: string | null;
        ratingAgency: string | null;
        counterparty: string | null;
        brokerDealer: string | null;
        status: string;
        collateralized: boolean;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Gets current cash position for a specific bank account.
 *
 * @param {string} accountId - Account identifier
 * @param {Model} CashPosition - CashPosition model
 * @returns {Promise<CashPosition>} Current cash position
 *
 * @example
 * ```typescript
 * const position = await getCurrentCashPosition('ACC-001', CashPosition);
 * console.log('Available:', position.availableBalance);
 * ```
 */
export declare const getCurrentCashPosition: (accountId: string, CashPosition: any) => Promise<CashPosition>;
/**
 * Updates cash position with new transaction or bank feed data.
 *
 * @param {string} accountId - Account identifier
 * @param {Partial<CashPosition>} updates - Position updates
 * @param {Model} CashPosition - CashPosition model
 * @param {Transaction} [transaction] - Sequelize transaction
 * @returns {Promise<CashPosition>} Updated position
 *
 * @example
 * ```typescript
 * await updateCashPosition('ACC-001', {
 *   availableBalance: 1550000.00,
 *   ledgerBalance: 1570000.00,
 *   lastUpdated: new Date()
 * }, CashPosition);
 * ```
 */
export declare const updateCashPosition: (accountId: string, updates: Partial<CashPosition>, CashPosition: any, transaction?: Transaction) => Promise<CashPosition>;
/**
 * Calculates aggregated cash position across multiple accounts.
 *
 * @param {string[]} accountIds - Array of account identifiers
 * @param {Model} CashPosition - CashPosition model
 * @param {string} [currency='USD'] - Currency filter
 * @returns {Promise<object>} Aggregated position
 *
 * @example
 * ```typescript
 * const aggregate = await calculateAggregateCashPosition(
 *   ['ACC-001', 'ACC-002', 'ACC-003'],
 *   CashPosition
 * );
 * ```
 */
export declare const calculateAggregateCashPosition: (accountIds: string[], CashPosition: any, currency?: string) => Promise<object>;
/**
 * Tracks intraday cash position changes from transaction processing.
 *
 * @param {string} accountId - Account identifier
 * @param {number} amount - Transaction amount (positive/negative)
 * @param {string} transactionType - Transaction type
 * @param {Model} CashPosition - CashPosition model
 * @param {Transaction} [transaction] - Sequelize transaction
 * @returns {Promise<CashPosition>} Updated position
 *
 * @example
 * ```typescript
 * await trackIntradayPosition('ACC-001', -50000.00, 'WIRE_OUT', CashPosition);
 * ```
 */
export declare const trackIntradayPosition: (accountId: string, amount: number, transactionType: string, CashPosition: any, transaction?: Transaction) => Promise<CashPosition>;
/**
 * Calculates available-to-spend considering float and pending transactions.
 *
 * @param {string} accountId - Account identifier
 * @param {Model} CashPosition - CashPosition model
 * @returns {Promise<number>} Available-to-spend amount
 *
 * @example
 * ```typescript
 * const available = await calculateAvailableToSpend('ACC-001', CashPosition);
 * console.log('Can spend:', available);
 * ```
 */
export declare const calculateAvailableToSpend: (accountId: string, CashPosition: any) => Promise<number>;
/**
 * Projects end-of-day cash position based on scheduled transactions.
 *
 * @param {string} accountId - Account identifier
 * @param {Array<{amount: number, type: string}>} scheduledTransactions - Scheduled txns
 * @param {Model} CashPosition - CashPosition model
 * @returns {Promise<object>} Projected EOD position
 *
 * @example
 * ```typescript
 * const projection = await projectEndOfDayPosition('ACC-001', [
 *   { amount: -100000, type: 'WIRE_OUT' },
 *   { amount: 50000, type: 'ACH_CREDIT' }
 * ], CashPosition);
 * ```
 */
export declare const projectEndOfDayPosition: (accountId: string, scheduledTransactions: Array<{
    amount: number;
    type: string;
}>, CashPosition: any) => Promise<object>;
/**
 * Monitors cash position against target balances and alerts.
 *
 * @param {string} accountId - Account identifier
 * @param {number} targetBalance - Target balance
 * @param {number} minimumBalance - Minimum threshold
 * @param {number} maximumBalance - Maximum threshold
 * @param {Model} CashPosition - CashPosition model
 * @returns {Promise<object>} Monitoring result with alerts
 *
 * @example
 * ```typescript
 * const monitoring = await monitorCashPositionThresholds(
 *   'ACC-001', 500000, 100000, 2000000, CashPosition
 * );
 * ```
 */
export declare const monitorCashPositionThresholds: (accountId: string, targetBalance: number, minimumBalance: number, maximumBalance: number, CashPosition: any) => Promise<object>;
/**
 * Calculates float analysis between ledger and available balances.
 *
 * @param {string} accountId - Account identifier
 * @param {number} days - Number of days to analyze
 * @param {Model} CashPosition - CashPosition model
 * @returns {Promise<object>} Float analysis
 *
 * @example
 * ```typescript
 * const floatAnalysis = await analyzeFloatPosition('ACC-001', 30, CashPosition);
 * ```
 */
export declare const analyzeFloatPosition: (accountId: string, days: number, CashPosition: any) => Promise<object>;
/**
 * Initiates bank reconciliation process for a period.
 *
 * @param {string} accountId - Account identifier
 * @param {Date} periodStart - Period start date
 * @param {Date} periodEnd - Period end date
 * @param {number} bankClosingBalance - Bank statement closing balance
 * @param {Model} BankReconciliation - BankReconciliation model
 * @param {Transaction} [transaction] - Sequelize transaction
 * @returns {Promise<string>} Reconciliation ID
 *
 * @example
 * ```typescript
 * const reconId = await initiateReconciliation(
 *   'ACC-001',
 *   new Date('2024-01-01'),
 *   new Date('2024-01-31'),
 *   1000000.00,
 *   BankReconciliation
 * );
 * ```
 */
export declare const initiateReconciliation: (accountId: string, periodStart: Date, periodEnd: Date, bankClosingBalance: number, BankReconciliation: any, transaction?: Transaction) => Promise<string>;
/**
 * Matches bank transactions with ledger entries using fuzzy matching.
 *
 * @param {BankTransaction[]} bankTransactions - Bank transactions
 * @param {any[]} ledgerTransactions - Ledger transactions
 * @returns {Promise<ReconciliationMatch[]>} Matched pairs
 *
 * @example
 * ```typescript
 * const matches = await matchBankTransactions(bankTxns, ledgerTxns);
 * console.log(`Matched ${matches.length} transactions`);
 * ```
 */
export declare const matchBankTransactions: (bankTransactions: BankTransaction[], ledgerTransactions: any[]) => Promise<ReconciliationMatch[]>;
/**
 * Calculates match score between bank and ledger transactions.
 *
 * @param {BankTransaction} bankTxn - Bank transaction
 * @param {any} ledgerTxn - Ledger transaction
 * @returns {number} Match score (0-1)
 *
 * @example
 * ```typescript
 * const score = calculateMatchScore(bankTxn, ledgerTxn);
 * if (score >= 0.95) console.log('High confidence match');
 * ```
 */
export declare const calculateMatchScore: (bankTxn: BankTransaction, ledgerTxn: any) => number;
/**
 * Identifies outstanding checks not yet cleared by bank.
 *
 * @param {any[]} ledgerChecks - Issued checks from ledger
 * @param {BankTransaction[]} clearedChecks - Cleared checks from bank
 * @returns {Promise<any[]>} Outstanding checks
 *
 * @example
 * ```typescript
 * const outstanding = await identifyOutstandingChecks(ledgerChecks, bankChecks);
 * console.log(`${outstanding.length} checks outstanding`);
 * ```
 */
export declare const identifyOutstandingChecks: (ledgerChecks: any[], clearedChecks: BankTransaction[]) => Promise<any[]>;
/**
 * Identifies deposits in transit not yet reflected in bank statement.
 *
 * @param {any[]} ledgerDeposits - Recorded deposits
 * @param {BankTransaction[]} bankDeposits - Bank statement deposits
 * @returns {Promise<any[]>} Deposits in transit
 *
 * @example
 * ```typescript
 * const inTransit = await identifyDepositsInTransit(ledgerDeposits, bankDeposits);
 * ```
 */
export declare const identifyDepositsInTransit: (ledgerDeposits: any[], bankDeposits: BankTransaction[]) => Promise<any[]>;
/**
 * Generates reconciliation exceptions for unmatched items.
 *
 * @param {BankTransaction[]} unmatchedBank - Unmatched bank transactions
 * @param {any[]} unmatchedLedger - Unmatched ledger transactions
 * @returns {Promise<ReconciliationException[]>} Exceptions
 *
 * @example
 * ```typescript
 * const exceptions = await generateReconciliationExceptions(
 *   unmatchedBank, unmatchedLedger
 * );
 * ```
 */
export declare const generateReconciliationExceptions: (unmatchedBank: BankTransaction[], unmatchedLedger: any[]) => Promise<ReconciliationException[]>;
/**
 * Completes bank reconciliation with adjusted balances.
 *
 * @param {string} reconciliationId - Reconciliation identifier
 * @param {object} adjustments - Reconciliation adjustments
 * @param {string} reconciledBy - User completing reconciliation
 * @param {Model} BankReconciliation - BankReconciliation model
 * @param {Transaction} [transaction] - Sequelize transaction
 * @returns {Promise<ReconciliationReport>} Reconciliation report
 *
 * @example
 * ```typescript
 * await completeReconciliation(reconId, {
 *   outstandingChecks: 50000,
 *   depositsInTransit: 25000,
 *   bankServiceCharges: 50
 * }, 'user123', BankReconciliation);
 * ```
 */
export declare const completeReconciliation: (reconciliationId: string, adjustments: {
    outstandingChecks: number;
    depositsInTransit: number;
    bankServiceCharges?: number;
    interestEarned?: number;
    nsfReturns?: number;
    bankErrors?: number;
    bookErrors?: number;
}, reconciledBy: string, BankReconciliation: any, transaction?: Transaction) => Promise<ReconciliationReport>;
/**
 * Generates bank reconciliation report with detailed analysis.
 *
 * @param {string} reconciliationId - Reconciliation identifier
 * @param {Model} BankReconciliation - BankReconciliation model
 * @returns {Promise<ReconciliationReport>} Detailed report
 *
 * @example
 * ```typescript
 * const report = await generateReconciliationReport(reconId, BankReconciliation);
 * ```
 */
export declare const generateReconciliationReport: (reconciliationId: string, BankReconciliation: any) => Promise<ReconciliationReport>;
/**
 * Creates cash flow forecast for specified period.
 *
 * @param {string} accountId - Account identifier
 * @param {Date} startDate - Forecast start date
 * @param {number} days - Number of days to forecast
 * @param {string} scenario - Forecast scenario
 * @returns {Promise<CashFlowForecast[]>} Daily forecasts
 *
 * @example
 * ```typescript
 * const forecast = await createCashFlowForecast(
 *   'ACC-001', new Date(), 30, 'REALISTIC'
 * );
 * ```
 */
export declare const createCashFlowForecast: (accountId: string, startDate: Date, days: number, scenario?: "OPTIMISTIC" | "REALISTIC" | "PESSIMISTIC") => Promise<CashFlowForecast[]>;
/**
 * Analyzes historical cash flow patterns for forecasting.
 *
 * @param {string} accountId - Account identifier
 * @param {number} days - Historical days to analyze
 * @param {any} Transaction - Transaction model
 * @returns {Promise<object>} Cash flow patterns
 *
 * @example
 * ```typescript
 * const patterns = await analyzeHistoricalCashFlow('ACC-001', 90, Transaction);
 * ```
 */
export declare const analyzeHistoricalCashFlow: (accountId: string, days: number, Transaction: any) => Promise<object>;
/**
 * Projects cash requirements for upcoming obligations.
 *
 * @param {string} accountId - Account identifier
 * @param {Date} throughDate - Project through this date
 * @param {any[]} scheduledPayments - Scheduled payment obligations
 * @returns {Promise<object>} Cash requirement projection
 *
 * @example
 * ```typescript
 * const requirements = await projectCashRequirements('ACC-001', futureDate, payments);
 * ```
 */
export declare const projectCashRequirements: (accountId: string, throughDate: Date, scheduledPayments: any[]) => Promise<object>;
/**
 * Identifies cash surplus/deficit periods in forecast.
 *
 * @param {CashFlowForecast[]} forecasts - Cash flow forecasts
 * @param {number} targetBalance - Target balance to maintain
 * @returns {Promise<object>} Surplus/deficit analysis
 *
 * @example
 * ```typescript
 * const analysis = await identifySurplusDeficitPeriods(forecasts, 500000);
 * ```
 */
export declare const identifySurplusDeficitPeriods: (forecasts: CashFlowForecast[], targetBalance: number) => Promise<object>;
/**
 * Optimizes cash deployment based on forecast and investment options.
 *
 * @param {CashFlowForecast[]} forecasts - Cash flow forecasts
 * @param {Investment[]} investmentOptions - Available investment vehicles
 * @param {number} minimumOperatingBalance - Minimum cash to maintain
 * @returns {Promise<object>} Optimization recommendations
 *
 * @example
 * ```typescript
 * const optimization = await optimizeCashDeployment(forecasts, options, 100000);
 * ```
 */
export declare const optimizeCashDeployment: (forecasts: CashFlowForecast[], investmentOptions: Investment[], minimumOperatingBalance: number) => Promise<object>;
/**
 * Generates cash management recommendations from forecast analysis.
 *
 * @param {any[]} surplusPeriods - Identified surplus periods
 * @param {any[]} deficitPeriods - Identified deficit periods
 * @returns {string[]} Recommendations
 *
 * @example
 * ```typescript
 * const recs = generateCashManagementRecommendations(surplus, deficit);
 * ```
 */
export declare const generateCashManagementRecommendations: (surplusPeriods: any[], deficitPeriods: any[]) => string[];
/**
 * Calculates comprehensive liquidity metrics and ratios.
 *
 * @param {string[]} accountIds - Account identifiers
 * @param {Model} CashPosition - CashPosition model
 * @param {any} BalanceSheet - Balance sheet data source
 * @returns {Promise<LiquidityAnalysis>} Liquidity analysis
 *
 * @example
 * ```typescript
 * const liquidity = await calculateLiquidityMetrics(accountIds, CashPosition, BS);
 * ```
 */
export declare const calculateLiquidityMetrics: (accountIds: string[], CashPosition: any, BalanceSheet: any) => Promise<LiquidityAnalysis>;
/**
 * Monitors liquidity coverage ratio for regulatory compliance.
 *
 * @param {string[]} accountIds - Account identifiers
 * @param {number} expectedOutflows30Days - 30-day expected outflows
 * @param {Model} CashPosition - CashPosition model
 * @param {Model} Investment - Investment model
 * @returns {Promise<object>} LCR analysis
 *
 * @example
 * ```typescript
 * const lcr = await monitorLiquidityCoverageRatio(accounts, 800000, CashPosition, Investment);
 * ```
 */
export declare const monitorLiquidityCoverageRatio: (accountIds: string[], expectedOutflows30Days: number, CashPosition: any, Investment: any) => Promise<object>;
/**
 * Performs stress testing on liquidity position.
 *
 * @param {string[]} accountIds - Account identifiers
 * @param {object} stressScenario - Stress test scenario parameters
 * @param {Model} CashPosition - CashPosition model
 * @returns {Promise<object>} Stress test results
 *
 * @example
 * ```typescript
 * const stress = await performLiquidityStressTest(accounts, {
 *   outflowShock: 1.5,
 *   inflowReduction: 0.7
 * }, CashPosition);
 * ```
 */
export declare const performLiquidityStressTest: (accountIds: string[], stressScenario: {
    outflowShock: number;
    inflowReduction: number;
}, CashPosition: any) => Promise<object>;
/**
 * Optimizes liquidity buffer allocation across accounts.
 *
 * @param {string[]} accountIds - Account identifiers
 * @param {number} totalBuffer - Total buffer amount to allocate
 * @param {Model} CashPosition - CashPosition model
 * @returns {Promise<object>} Allocation recommendations
 *
 * @example
 * ```typescript
 * const allocation = await optimizeLiquidityBuffer(accounts, 500000, CashPosition);
 * ```
 */
export declare const optimizeLiquidityBuffer: (accountIds: string[], totalBuffer: number, CashPosition: any) => Promise<object>;
/**
 * Generates liquidity contingency plan.
 *
 * @param {LiquidityAnalysis} currentLiquidity - Current liquidity state
 * @param {number} targetDaysOfCash - Target days of cash
 * @returns {Promise<object>} Contingency plan
 *
 * @example
 * ```typescript
 * const plan = await generateLiquidityContingencyPlan(liquidity, 60);
 * ```
 */
export declare const generateLiquidityContingencyPlan: (currentLiquidity: LiquidityAnalysis, targetDaysOfCash: number) => Promise<object>;
/**
 * Tracks available credit facilities and utilization.
 *
 * @param {string[]} facilityIds - Credit facility identifiers
 * @param {any} CreditFacility - Credit facility model
 * @returns {Promise<object>} Credit facility analysis
 *
 * @example
 * ```typescript
 * const credit = await trackCreditFacilityUtilization(facilityIds, CreditFacility);
 * ```
 */
export declare const trackCreditFacilityUtilization: (facilityIds: string[], CreditFacility: any) => Promise<object>;
/**
 * Records new investment purchase.
 *
 * @param {Partial<Investment>} investmentData - Investment details
 * @param {Model} Investment - Investment model
 * @param {Transaction} [transaction] - Sequelize transaction
 * @returns {Promise<Investment>} Created investment
 *
 * @example
 * ```typescript
 * const inv = await recordInvestmentPurchase({
 *   securityType: 'TBILL',
 *   principalAmount: 100000,
 *   maturityDate: new Date('2024-06-30'),
 *   interestRate: 5.25
 * }, Investment);
 * ```
 */
export declare const recordInvestmentPurchase: (investmentData: Partial<Investment>, Investment: any, transaction?: Transaction) => Promise<Investment>;
/**
 * Calculates accrued interest on investments.
 *
 * @param {string} investmentId - Investment identifier
 * @param {Date} asOfDate - Calculation date
 * @param {Model} Investment - Investment model
 * @returns {Promise<number>} Accrued interest amount
 *
 * @example
 * ```typescript
 * const accrued = await calculateAccruedInterest('INV-001', new Date(), Investment);
 * ```
 */
export declare const calculateAccruedInterest: (investmentId: string, asOfDate: Date, Investment: any) => Promise<number>;
/**
 * Marks investment as matured and processes proceeds.
 *
 * @param {string} investmentId - Investment identifier
 * @param {number} proceedsAmount - Maturity proceeds
 * @param {Model} Investment - Investment model
 * @param {Transaction} [transaction] - Sequelize transaction
 * @returns {Promise<object>} Maturity details
 *
 * @example
 * ```typescript
 * await processInvestmentMaturity('INV-001', 105250.00, Investment);
 * ```
 */
export declare const processInvestmentMaturity: (investmentId: string, proceedsAmount: number, Investment: any, transaction?: Transaction) => Promise<object>;
/**
 * Calculates portfolio-level investment metrics.
 *
 * @param {string} portfolioId - Portfolio identifier
 * @param {Model} Investment - Investment model
 * @returns {Promise<object>} Portfolio metrics
 *
 * @example
 * ```typescript
 * const metrics = await calculatePortfolioMetrics('PORT-001', Investment);
 * ```
 */
export declare const calculatePortfolioMetrics: (portfolioId: string, Investment: any) => Promise<object>;
/**
 * Generates investment ladder analysis for maturity distribution.
 *
 * @param {string} portfolioId - Portfolio identifier
 * @param {Model} Investment - Investment model
 * @returns {Promise<object>} Ladder analysis
 *
 * @example
 * ```typescript
 * const ladder = await generateInvestmentLadder('PORT-001', Investment);
 * ```
 */
export declare const generateInvestmentLadder: (portfolioId: string, Investment: any) => Promise<object>;
/**
 * Validates investment compliance with policy guidelines.
 *
 * @param {Investment} investment - Investment to validate
 * @param {object} policy - Investment policy parameters
 * @returns {Promise<object>} Compliance validation
 *
 * @example
 * ```typescript
 * const validation = await validateInvestmentCompliance(investment, {
 *   maxMaturity: 365,
 *   minCreditRating: 'A',
 *   allowedTypes: ['TBILL', 'CD']
 * });
 * ```
 */
export declare const validateInvestmentCompliance: (investment: Investment, policy: {
    maxMaturity?: number;
    minCreditRating?: string;
    allowedTypes?: string[];
    maxSingleIssuer?: number;
    requireCollateralization?: boolean;
}) => Promise<object>;
/**
 * Initiates wire transfer with fraud detection checks.
 *
 * @param {Partial<WireTransfer>} wireData - Wire transfer details
 * @param {string} initiatedBy - User initiating transfer
 * @param {any} WireTransfer - WireTransfer model
 * @param {Transaction} [transaction] - Sequelize transaction
 * @returns {Promise<string>} Wire transfer ID
 *
 * @example
 * ```typescript
 * const wireId = await initiateWireTransfer({
 *   debitAccountId: 'ACC-001',
 *   creditAccountId: 'ACC-EXT-001',
 *   amount: 250000,
 *   beneficiaryName: 'Vendor Corp',
 *   purpose: 'Invoice payment'
 * }, 'user123', WireTransfer);
 * ```
 */
export declare const initiateWireTransfer: (wireData: Partial<WireTransfer>, initiatedBy: string, WireTransfer: any, transaction?: Transaction) => Promise<string>;
/**
 * Approves wire transfer with dual control validation.
 *
 * @param {string} wireId - Wire transfer ID
 * @param {string} approverUserId - Approver user ID
 * @param {number} approvalLevel - Approval level
 * @param {any} WireTransfer - WireTransfer model
 * @param {Transaction} [transaction] - Sequelize transaction
 * @returns {Promise<object>} Approval status
 *
 * @example
 * ```typescript
 * await approveWireTransfer('WIRE-123', 'mgr456', 1, WireTransfer);
 * ```
 */
export declare const approveWireTransfer: (wireId: string, approverUserId: string, approvalLevel: number, WireTransfer: any, transaction?: Transaction) => Promise<object>;
/**
 * Processes approved wire transfer through payment network.
 *
 * @param {string} wireId - Wire transfer ID
 * @param {any} WireTransfer - WireTransfer model
 * @param {Transaction} [transaction] - Sequelize transaction
 * @returns {Promise<object>} Processing result
 *
 * @example
 * ```typescript
 * await processWireTransfer('WIRE-123', WireTransfer);
 * ```
 */
export declare const processWireTransfer: (wireId: string, WireTransfer: any, transaction?: Transaction) => Promise<object>;
/**
 * Performs fraud detection checks on wire transfer.
 *
 * @param {Partial<WireTransfer>} wireData - Wire transfer data
 * @returns {Promise<object>} Fraud check results
 *
 * @example
 * ```typescript
 * const checks = await performWireFraudChecks(wireData);
 * if (!checks.passed) console.error(checks.reason);
 * ```
 */
export declare const performWireFraudChecks: (wireData: Partial<WireTransfer>) => Promise<object>;
/**
 * Generates wire transfer activity report.
 *
 * @param {Date} startDate - Report start date
 * @param {Date} endDate - Report end date
 * @param {any} WireTransfer - WireTransfer model
 * @returns {Promise<object>} Activity report
 *
 * @example
 * ```typescript
 * const report = await generateWireActivityReport(
 *   new Date('2024-01-01'),
 *   new Date('2024-01-31'),
 *   WireTransfer
 * );
 * ```
 */
export declare const generateWireActivityReport: (startDate: Date, endDate: Date, WireTransfer: any) => Promise<object>;
/**
 * Executes automated cash sweep between accounts.
 *
 * @param {string} sourceAccountId - Source account
 * @param {string} targetAccountId - Target account
 * @param {number} amount - Amount to sweep
 * @param {Model} CashPosition - CashPosition model
 * @param {Transaction} [transaction] - Sequelize transaction
 * @returns {Promise<object>} Sweep result
 *
 * @example
 * ```typescript
 * await executeCashSweep('ACC-001', 'ACC-MASTER', 150000, CashPosition);
 * ```
 */
export declare const executeCashSweep: (sourceAccountId: string, targetAccountId: string, amount: number, CashPosition: any, transaction?: Transaction) => Promise<object>;
/**
 * Configures zero-balance account (ZBA) sweep parameters.
 *
 * @param {string} zbaAccountId - ZBA account
 * @param {string} masterAccountId - Master account
 * @param {string} sweepFrequency - Sweep frequency
 * @param {any} CashConcentration - CashConcentration model
 * @param {Transaction} [transaction] - Sequelize transaction
 * @returns {Promise<CashConcentration>} Configuration
 *
 * @example
 * ```typescript
 * await configureZeroBalanceAccount('ACC-ZBA-001', 'ACC-MASTER', 'DAILY', CC);
 * ```
 */
export declare const configureZeroBalanceAccount: (zbaAccountId: string, masterAccountId: string, sweepFrequency: "DAILY" | "WEEKLY" | "ON_DEMAND", CashConcentration: any, transaction?: Transaction) => Promise<CashConcentration>;
/**
 * Executes target balance sweep to maintain optimal balances.
 *
 * @param {string} accountId - Account to sweep
 * @param {number} targetBalance - Target balance to maintain
 * @param {string} masterAccountId - Master account
 * @param {Model} CashPosition - CashPosition model
 * @param {Transaction} [transaction] - Sequelize transaction
 * @returns {Promise<object>} Sweep result
 *
 * @example
 * ```typescript
 * await executeTargetBalanceSweep('ACC-001', 500000, 'ACC-MASTER', CashPosition);
 * ```
 */
export declare const executeTargetBalanceSweep: (accountId: string, targetBalance: number, masterAccountId: string, CashPosition: any, transaction?: Transaction) => Promise<object>;
/**
 * Implements notional pooling for interest optimization.
 *
 * @param {string[]} poolAccountIds - Accounts in pool
 * @param {Model} CashPosition - CashPosition model
 * @returns {Promise<object>} Pooling calculation
 *
 * @example
 * ```typescript
 * const pool = await calculateNotionalPool(poolAccounts, CashPosition);
 * ```
 */
export declare const calculateNotionalPool: (poolAccountIds: string[], CashPosition: any) => Promise<object>;
/**
 * Generates cash concentration report.
 *
 * @param {string} masterAccountId - Master account
 * @param {Date} reportDate - Report date
 * @param {any} CashConcentration - CashConcentration model
 * @param {Model} CashPosition - CashPosition model
 * @returns {Promise<object>} Concentration report
 *
 * @example
 * ```typescript
 * const report = await generateConcentrationReport('ACC-MASTER', new Date(), CC, CP);
 * ```
 */
export declare const generateConcentrationReport: (masterAccountId: string, reportDate: Date, CashConcentration: any, CashPosition: any) => Promise<object>;
/**
 * Generates comprehensive daily treasury position report.
 *
 * @param {Date} reportDate - Report date
 * @param {string[]} accountIds - Accounts to include
 * @param {Model} CashPosition - CashPosition model
 * @param {Model} Investment - Investment model
 * @returns {Promise<object>} Treasury position report
 *
 * @example
 * ```typescript
 * const report = await generateDailyTreasuryReport(
 *   new Date(), accountIds, CashPosition, Investment
 * );
 * ```
 */
export declare const generateDailyTreasuryReport: (reportDate: Date, accountIds: string[], CashPosition: any, Investment: any) => Promise<object>;
/**
 * Analyzes treasury performance metrics and KPIs.
 *
 * @param {Date} periodStart - Period start
 * @param {Date} periodEnd - Period end
 * @param {string[]} accountIds - Accounts to analyze
 * @param {Model} CashPosition - CashPosition model
 * @returns {Promise<object>} Performance metrics
 *
 * @example
 * ```typescript
 * const metrics = await analyzeTreasuryPerformance(start, end, accounts, CP);
 * ```
 */
export declare const analyzeTreasuryPerformance: (periodStart: Date, periodEnd: Date, accountIds: string[], CashPosition: any) => Promise<object>;
/**
 * Default export with all utilities.
 */
declare const _default: {
    createCashPositionModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            accountId: string;
            bankId: string;
            accountNumber: string;
            accountName: string;
            currency: string;
            availableBalance: number;
            ledgerBalance: number;
            floatAmount: number;
            clearedBalance: number;
            unclearedChecks: number;
            unclearedDeposits: number;
            availableCredit: number;
            reservedFunds: number;
            overdraftLimit: number;
            effectiveBalance: number;
            positionDate: Date;
            valueDate: Date;
            lastUpdated: Date;
            dataSource: string;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createBankReconciliationModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            reconciliationId: string;
            accountId: string;
            periodStart: Date;
            periodEnd: Date;
            bankOpeningBalance: number;
            bankClosingBalance: number;
            ledgerOpeningBalance: number;
            ledgerClosingBalance: number;
            outstandingChecks: number;
            depositsInTransit: number;
            bankServiceCharges: number;
            interestEarned: number;
            nsfReturns: number;
            bankErrors: number;
            bookErrors: number;
            otherAdjustments: number;
            adjustedBankBalance: number;
            adjustedBookBalance: number;
            variance: number;
            matchedTransactions: number;
            unmatchedBankTransactions: number;
            unmatchedLedgerTransactions: number;
            status: string;
            isReconciled: boolean;
            reconciledBy: string | null;
            reconciledAt: Date | null;
            approvedBy: string | null;
            approvedAt: Date | null;
            comments: string | null;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createInvestmentModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            investmentId: string;
            accountId: string;
            portfolioId: string;
            securityType: string;
            securityName: string;
            cusip: string | null;
            isin: string | null;
            principalAmount: number;
            purchaseDate: Date;
            settlementDate: Date;
            maturityDate: Date;
            interestRate: number;
            purchasePrice: number;
            currentValue: number;
            marketValue: number;
            accruedInterest: number;
            yieldToMaturity: number;
            effectiveYield: number;
            duration: number;
            creditRating: string | null;
            ratingAgency: string | null;
            counterparty: string | null;
            brokerDealer: string | null;
            status: string;
            collateralized: boolean;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    getCurrentCashPosition: (accountId: string, CashPosition: any) => Promise<CashPosition>;
    updateCashPosition: (accountId: string, updates: Partial<CashPosition>, CashPosition: any, transaction?: Transaction) => Promise<CashPosition>;
    calculateAggregateCashPosition: (accountIds: string[], CashPosition: any, currency?: string) => Promise<object>;
    trackIntradayPosition: (accountId: string, amount: number, transactionType: string, CashPosition: any, transaction?: Transaction) => Promise<CashPosition>;
    calculateAvailableToSpend: (accountId: string, CashPosition: any) => Promise<number>;
    projectEndOfDayPosition: (accountId: string, scheduledTransactions: Array<{
        amount: number;
        type: string;
    }>, CashPosition: any) => Promise<object>;
    monitorCashPositionThresholds: (accountId: string, targetBalance: number, minimumBalance: number, maximumBalance: number, CashPosition: any) => Promise<object>;
    analyzeFloatPosition: (accountId: string, days: number, CashPosition: any) => Promise<object>;
    initiateReconciliation: (accountId: string, periodStart: Date, periodEnd: Date, bankClosingBalance: number, BankReconciliation: any, transaction?: Transaction) => Promise<string>;
    matchBankTransactions: (bankTransactions: BankTransaction[], ledgerTransactions: any[]) => Promise<ReconciliationMatch[]>;
    calculateMatchScore: (bankTxn: BankTransaction, ledgerTxn: any) => number;
    identifyOutstandingChecks: (ledgerChecks: any[], clearedChecks: BankTransaction[]) => Promise<any[]>;
    identifyDepositsInTransit: (ledgerDeposits: any[], bankDeposits: BankTransaction[]) => Promise<any[]>;
    generateReconciliationExceptions: (unmatchedBank: BankTransaction[], unmatchedLedger: any[]) => Promise<ReconciliationException[]>;
    completeReconciliation: (reconciliationId: string, adjustments: {
        outstandingChecks: number;
        depositsInTransit: number;
        bankServiceCharges?: number;
        interestEarned?: number;
        nsfReturns?: number;
        bankErrors?: number;
        bookErrors?: number;
    }, reconciledBy: string, BankReconciliation: any, transaction?: Transaction) => Promise<ReconciliationReport>;
    generateReconciliationReport: (reconciliationId: string, BankReconciliation: any) => Promise<ReconciliationReport>;
    createCashFlowForecast: (accountId: string, startDate: Date, days: number, scenario?: "OPTIMISTIC" | "REALISTIC" | "PESSIMISTIC") => Promise<CashFlowForecast[]>;
    analyzeHistoricalCashFlow: (accountId: string, days: number, Transaction: any) => Promise<object>;
    projectCashRequirements: (accountId: string, throughDate: Date, scheduledPayments: any[]) => Promise<object>;
    identifySurplusDeficitPeriods: (forecasts: CashFlowForecast[], targetBalance: number) => Promise<object>;
    optimizeCashDeployment: (forecasts: CashFlowForecast[], investmentOptions: Investment[], minimumOperatingBalance: number) => Promise<object>;
    generateCashManagementRecommendations: (surplusPeriods: any[], deficitPeriods: any[]) => string[];
    calculateLiquidityMetrics: (accountIds: string[], CashPosition: any, BalanceSheet: any) => Promise<LiquidityAnalysis>;
    monitorLiquidityCoverageRatio: (accountIds: string[], expectedOutflows30Days: number, CashPosition: any, Investment: any) => Promise<object>;
    performLiquidityStressTest: (accountIds: string[], stressScenario: {
        outflowShock: number;
        inflowReduction: number;
    }, CashPosition: any) => Promise<object>;
    optimizeLiquidityBuffer: (accountIds: string[], totalBuffer: number, CashPosition: any) => Promise<object>;
    generateLiquidityContingencyPlan: (currentLiquidity: LiquidityAnalysis, targetDaysOfCash: number) => Promise<object>;
    trackCreditFacilityUtilization: (facilityIds: string[], CreditFacility: any) => Promise<object>;
    recordInvestmentPurchase: (investmentData: Partial<Investment>, Investment: any, transaction?: Transaction) => Promise<Investment>;
    calculateAccruedInterest: (investmentId: string, asOfDate: Date, Investment: any) => Promise<number>;
    processInvestmentMaturity: (investmentId: string, proceedsAmount: number, Investment: any, transaction?: Transaction) => Promise<object>;
    calculatePortfolioMetrics: (portfolioId: string, Investment: any) => Promise<object>;
    generateInvestmentLadder: (portfolioId: string, Investment: any) => Promise<object>;
    validateInvestmentCompliance: (investment: Investment, policy: {
        maxMaturity?: number;
        minCreditRating?: string;
        allowedTypes?: string[];
        maxSingleIssuer?: number;
        requireCollateralization?: boolean;
    }) => Promise<object>;
    initiateWireTransfer: (wireData: Partial<WireTransfer>, initiatedBy: string, WireTransfer: any, transaction?: Transaction) => Promise<string>;
    approveWireTransfer: (wireId: string, approverUserId: string, approvalLevel: number, WireTransfer: any, transaction?: Transaction) => Promise<object>;
    processWireTransfer: (wireId: string, WireTransfer: any, transaction?: Transaction) => Promise<object>;
    performWireFraudChecks: (wireData: Partial<WireTransfer>) => Promise<object>;
    generateWireActivityReport: (startDate: Date, endDate: Date, WireTransfer: any) => Promise<object>;
    executeCashSweep: (sourceAccountId: string, targetAccountId: string, amount: number, CashPosition: any, transaction?: Transaction) => Promise<object>;
    configureZeroBalanceAccount: (zbaAccountId: string, masterAccountId: string, sweepFrequency: "DAILY" | "WEEKLY" | "ON_DEMAND", CashConcentration: any, transaction?: Transaction) => Promise<CashConcentration>;
    executeTargetBalanceSweep: (accountId: string, targetBalance: number, masterAccountId: string, CashPosition: any, transaction?: Transaction) => Promise<object>;
    calculateNotionalPool: (poolAccountIds: string[], CashPosition: any) => Promise<object>;
    generateConcentrationReport: (masterAccountId: string, reportDate: Date, CashConcentration: any, CashPosition: any) => Promise<object>;
    generateDailyTreasuryReport: (reportDate: Date, accountIds: string[], CashPosition: any, Investment: any) => Promise<object>;
    analyzeTreasuryPerformance: (periodStart: Date, periodEnd: Date, accountIds: string[], CashPosition: any) => Promise<object>;
};
export default _default;
//# sourceMappingURL=treasury-cash-management-kit.d.ts.map