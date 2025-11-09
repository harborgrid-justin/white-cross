/**
 * Banking Reconciliation Automation Kit - FIN-BANK-001
 *
 * Enterprise-grade banking reconciliation system with advanced Sequelize queries.
 * Competes with BlackLine, Trintech, ReconArt platforms.
 *
 * Features:
 * - Automated bank feed processing and transaction normalization
 * - Intelligent multi-algorithm transaction matching (amount, date, fuzzy, ML)
 * - Rules engine with pattern learning and optimization
 * - Manual matching workflow with split transaction support
 * - Real-time reconciliation with variance identification
 * - Outstanding items tracking (deposits in transit, checks)
 * - Bank error detection and resolution workflow
 * - Multi-currency FX handling with revaluation
 * - Cash application with invoice matching
 * - Comprehensive audit reporting and variance analysis
 *
 * Stack: NestJS 10.x, Sequelize 6.x
 * Author: AI Agent | Date: 2025-11-08
 */
import { BankTransaction, BankFeed, MatchingRule, ManualMatch, BankError, ReconciliationReport } from '@models';
interface BankFeedConfig {
    bankCode: string;
    accountNumber: string;
    apiKey: string;
    feedType: 'OFX' | 'MT940' | 'CSV' | 'API';
    startDate: Date;
    endDate: Date;
}
interface NormalizedTransaction {
    externalId: string;
    amount: number;
    date: Date;
    description: string;
    counterparty: string;
    currency: string;
    type: 'CREDIT' | 'DEBIT';
    metadata: Record<string, any>;
}
interface MatchingRule {
    id: string;
    priority: number;
    algorithms: MatchingAlgorithm[];
    conditions: Record<string, any>;
    weight: number;
    matchRate: number;
}
interface MatchingAlgorithm {
    type: 'AMOUNT' | 'DATE_RANGE' | 'FUZZY' | 'ML';
    tolerance: number;
    parameters: Record<string, any>;
}
interface TransactionMatch {
    bankTxnId: string;
    bookTxnId: string;
    algorithm: string;
    confidence: number;
    variance: number;
}
interface ReconciliationVariance {
    id: string;
    bookBalance: number;
    bankBalance: number;
    variance: number;
    variancePercent: number;
    categories: string[];
    items: VarianceItem[];
}
interface VarianceItem {
    txnId: string;
    amount: number;
    days: number;
    category: 'IN_TRANSIT' | 'ERROR' | 'TIMING' | 'UNMATCHED';
}
interface MultiCurrencyBalance {
    currency: string;
    amount: number;
    rate: number;
    baseCurrencyAmount: number;
    revaluationGain: number;
    revaluationLoss: number;
}
interface CashApplicationMatch {
    paymentId: string;
    invoiceId: string;
    matchedAmount: number;
    remainingAmount: number;
    discountAmount: number;
    status: 'PARTIAL' | 'FULL' | 'OVERPAYMENT';
}
export declare class BankingReconciliationAutomationService {
    /**
     * BANK FEEDS (1-4)
     */
    /**
     * 1. Connect bank feed source with validation
     */
    connectBankFeed(config: BankFeedConfig): Promise<BankFeed>;
    /**
     * 2. Import and batch process bank statements
     */
    importBankStatements(feedId: string, statements: any[], batchSize?: number): Promise<{
        imported: number;
        failed: number;
        errors: any[];
    }>;
    /**
     * 3. Parse and normalize multi-format statements
     */
    parseStatements(feedId: string, format: 'OFX' | 'MT940' | 'CSV'): Promise<NormalizedTransaction[]>;
    /**
     * 4. Normalize transaction data across bank formats
     */
    normalizeData(feedId: string, transactions: NormalizedTransaction[]): Promise<BankTransaction[]>;
    /**
     * AUTO-MATCHING (5-8)
     */
    /**
     * 5. Match transactions by exact amount
     */
    matchByAmount(bankTxnId: string, tolerance?: number): Promise<TransactionMatch[]>;
    /**
     * 6. Date range matching with proximity scoring
     */
    matchByDateRange(bankTxnId: string, dateRange: {
        start: Date;
        end: Date;
    }): Promise<TransactionMatch[]>;
    /**
     * 7. Fuzzy string matching for counterparty names
     */
    matchByFuzzyMatch(bankTxnId: string, fuzzyThreshold?: number): Promise<TransactionMatch[]>;
    /**
     * 8. ML-based matching using historical patterns
     */
    matchByMLAlgorithm(bankTxnId: string, modelWeights?: Record<string, number>): Promise<TransactionMatch[]>;
    /**
     * RULES ENGINE (9-12)
     */
    /**
     * 9. Create matching rule with multi-algorithm support
     */
    createMatchingRule(rule: MatchingRule): Promise<any>;
    /**
     * 10. Apply rules engine to unmatched transactions
     */
    applyMatchingRules(feedId: string, batchSize?: number): Promise<{
        matched: number;
        applied: number;
    }>;
    /**
     * 11. Learn matching patterns from manual matches
     */
    learnMatchingPatterns(ruleLearningConfig: {
        minConfidence: number;
        minSamples: number;
        timeWindow: number;
    }): Promise<Record<string, any>>;
    /**
     * 12. Optimize rules based on historical performance
     */
    optimizeRules(): Promise<Record<string, any>>;
    /**
     * MANUAL MATCHING (13-16)
     */
    /**
     * 13. Propose matching candidates with confidence scores
     */
    proposeMatches(bankTxnId: string, limit?: number): Promise<TransactionMatch[]>;
    /**
     * 14. Review and accept/reject match suggestions
     */
    reviewMatchSuggestion(bankTxnId: string, bookTxnId: string, action: 'ACCEPT' | 'REJECT', notes?: string): Promise<ManualMatch>;
    /**
     * 15. Manual transaction linking with variance capture
     */
    manualLinkTransactions(bankTxnId: string, bookTxnIds: string[], variance: number): Promise<ManualMatch>;
    /**
     * 16. Handle split transactions across multiple book entries
     */
    splitTransaction(bankTxnId: string, splits: Array<{
        bookTxnId: string;
        amount: number;
        description: string;
    }>): Promise<ManualMatch>;
    /**
     * RECONCILIATION (17-20)
     */
    /**
     * 17. Calculate book balance with multi-level aggregation
     */
    calculateBookBalance(accountId: string, asOfDate: Date): Promise<{
        balance: number;
        detail: Record<string, any>;
    }>;
    /**
     * 18. Calculate bank balance with reconciliation adjustments
     */
    calculateBankBalance(feedId: string, asOfDate: Date): Promise<{
        balance: number;
        adjustments: Record<string, any>;
    }>;
    /**
     * 19. Identify reconciliation variance and categorize
     */
    identifyVariance(feedId: string, accountId: string, asOfDate: Date): Promise<ReconciliationVariance>;
    /**
     * 20. Perform full reconciliation with automated status updates
     */
    reconcile(feedId: string, accountId: string, asOfDate: Date): Promise<any>;
    /**
     * OUTSTANDING ITEMS (21-24)
     */
    /**
     * 21. Track deposits in transit
     */
    trackDepositsInTransit(feedId: string, asOfDate: Date): Promise<any[]>;
    /**
     * 22. Track outstanding checks
     */
    trackOutstandingChecks(accountId: string, asOfDate: Date): Promise<any[]>;
    /**
     * 23. Identify timing differences
     */
    identifyTimingDifferences(feedId: string, accountId: string): Promise<Record<string, any>>;
    /**
     * 24. Age analysis of outstanding items
     */
    ageOutstandingItems(feedId: string, accountId: string): Promise<Record<string, any>>;
    /**
     * BANK ERRORS (25-28)
     */
    /**
     * 25. Identify potential bank errors
     */
    identifyBankErrors(feedId: string, threshold?: number): Promise<BankError[]>;
    /**
     * 26. Document and classify bank errors
     */
    documentBankError(errorId: string, classification: string, documentation: Record<string, any>): Promise<BankError>;
    /**
     * 27. Communicate bank error to external parties
     */
    communicateBankError(errorId: string, recipientBankContact: string, message: string): Promise<any>;
    /**
     * 28. Resolve and reconcile bank errors
     */
    resolveBankError(errorId: string, resolution: string, resolutionDetails: Record<string, any>): Promise<BankError>;
    /**
     * MULTI-CURRENCY (29-32)
     */
    /**
     * 29. Convert multi-currency balances to reporting currency
     */
    convertBalances(balances: MultiCurrencyBalance[], targetCurrency: string, asOfDate: Date): Promise<MultiCurrencyBalance[]>;
    /**
     * 30. Handle FX differences and variance
     */
    handleFXDifferences(feedId: string, baseCurrency: string): Promise<Record<string, any>>;
    /**
     * 31. Revalue multi-currency positions
     */
    revaluePositions(asOfDate: Date, baseCurrency: string): Promise<any[]>;
    /**
     * 32. Generate multi-currency reconciliation report
     */
    generateMultiCurrencyReport(asOfDate: Date, baseCurrency: string): Promise<Record<string, any>>;
    /**
     * CASH APPLICATION (33-36)
     */
    /**
     * 33. Apply payments to invoices
     */
    applyPayment(paymentId: string, invoiceApplications: Array<{
        invoiceId: string;
        amount: number;
    }>): Promise<CashApplicationMatch[]>;
    /**
     * 34. Match invoices with payments
     */
    matchInvoicePayment(paymentId: string, invoiceId: string): Promise<CashApplicationMatch>;
    /**
     * 35. Handle partial payment and unapplied cash
     */
    handlePartialPayment(paymentId: string, appliedAmount: number, invoiceId: string): Promise<any>;
    /**
     * 36. Manage and track unapplied cash balances
     */
    manageUnappliedCash(customerId: string, lookbackDays?: number): Promise<Record<string, any>>;
    /**
     * REPORTING (37-40)
     */
    /**
     * 37. Generate comprehensive reconciliation report
     */
    generateReconciliationReport(feedId: string, accountId: string, asOfDate: Date): Promise<ReconciliationReport>;
    /**
     * 38. Variance analysis by category and time period
     */
    varianceAnalysis(feedId: string, accountId: string, startDate: Date, endDate: Date): Promise<Record<string, any>>;
    /**
     * 39. Outstanding items detail report
     */
    outstandingItemsReport(feedId: string, accountId: string): Promise<Record<string, any>>;
    /**
     * 40. Complete audit trail and compliance report
     */
    generateAuditTrailReport(feedId: string, accountId: string, startDate: Date, endDate: Date): Promise<Record<string, any>>;
    private encryptKey;
    private normalizeAmount;
    private normalizeDate;
    private normalizeDescription;
    private extractCounterparty;
    private extractMetadata;
    private evaluateRuleConditions;
}
export {};
//# sourceMappingURL=banking-reconciliation-automation-kit.d.ts.map