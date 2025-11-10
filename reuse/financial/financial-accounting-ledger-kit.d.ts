/**
 * Financial Accounting Ledger Kit
 * ================================
 * Enterprise-grade financial accounting ledger system implementing double-entry bookkeeping,
 * multi-currency support, period management, and inter-company consolidation.
 *
 * LOC: FIN-ACCT-001
 * Targets: SAP, Oracle Financials, NetSuite
 * Framework: NestJS 10.x, Sequelize 6.x, TypeScript 5.x
 *
 * Capabilities:
 * - Chart of accounts management with hierarchical structure
 * - Journal entry posting with double-entry validation
 * - Batch posting and reconciliation
 * - Multi-period and multi-currency accounting
 * - Inter-company transactions and consolidation
 * - Audit trails and ledger validation
 * - Balance reporting (trial balance, period balances, summaries)
 *
 * Compliance: GAAP, IFRS, SOX compliance patterns
 *
 * @module FinancialAccountingLedger
 * @version 2.0.0
 * @author Enterprise Finance
 */
import { Sequelize } from 'sequelize';
declare enum AccountType {
    ASSET = "ASSET",
    LIABILITY = "LIABILITY",
    EQUITY = "EQUITY",
    REVENUE = "REVENUE",
    EXPENSE = "EXPENSE",
    GAIN = "GAIN",
    LOSS = "LOSS"
}
declare enum AccountStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    ARCHIVED = "ARCHIVED",
    SUSPENDED = "SUSPENDED"
}
declare enum JournalEntryStatus {
    DRAFT = "DRAFT",
    POSTED = "POSTED",
    VOIDED = "VOIDED",
    REVERSED = "REVERSED",
    PENDING_APPROVAL = "PENDING_APPROVAL"
}
declare enum PeriodStatus {
    OPEN = "OPEN",
    CLOSED = "CLOSED",
    ARCHIVED = "ARCHIVED",
    PENDING_CLOSE = "PENDING_CLOSE"
}
declare enum CurrencyType {
    USD = "USD",
    EUR = "EUR",
    GBP = "GBP",
    JPY = "JPY",
    CAD = "CAD",
    AUD = "AUD"
}
declare enum TransactionType {
    DEBIT = "DEBIT",
    CREDIT = "CREDIT"
}
interface ChartOfAccountsEntity {
    id: string;
    code: string;
    name: string;
    type: AccountType;
    status: AccountStatus;
    parentAccountId?: string;
    currency: CurrencyType;
    isHeader: boolean;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}
interface JournalEntryLineItem {
    accountId: string;
    amount: number;
    type: TransactionType;
    description?: string;
    referenceId?: string;
}
interface BalanceResponse {
    accountId: string;
    code: string;
    name: string;
    debitBalance: number;
    creditBalance: number;
    netBalance: number;
    currency: CurrencyType;
    asOfDate: Date;
}
interface TrialBalanceReport {
    periodId: string;
    asOfDate: Date;
    totalDebits: number;
    totalCredits: number;
    isBalanced: boolean;
    accounts: BalanceResponse[];
}
/**
 * Create new chart of accounts entry
 * @param sequelize - Database instance
 * @param account - Account details
 * @returns Created account entity
 */
export declare function createChartOfAccount(sequelize: Sequelize, account: Partial<ChartOfAccountsEntity>): Promise<ChartOfAccountsEntity>;
/**
 * Get chart of accounts by ID
 * @param sequelize - Database instance
 * @param accountId - Account identifier
 * @returns Account entity
 */
export declare function getChartOfAccount(sequelize: Sequelize, accountId: string): Promise<ChartOfAccountsEntity>;
/**
 * Update chart of accounts entry
 * @param sequelize - Database instance
 * @param accountId - Account identifier
 * @param updates - Updated fields
 * @returns Updated account entity
 */
export declare function updateChartOfAccount(sequelize: Sequelize, accountId: string, updates: Partial<ChartOfAccountsEntity>): Promise<ChartOfAccountsEntity>;
/**
 * Deactivate chart of accounts entry
 * @param sequelize - Database instance
 * @param accountId - Account identifier
 * @returns Updated account entity
 */
export declare function deactivateChartOfAccount(sequelize: Sequelize, accountId: string): Promise<ChartOfAccountsEntity>;
/**
 * Get account hierarchy tree
 * @param sequelize - Database instance
 * @param parentId - Parent account ID (null for root)
 * @returns Hierarchical account tree
 */
export declare function getAccountHierarchyTree(sequelize: Sequelize, parentId?: string): Promise<any[]>;
/**
 * Add child account to parent
 * @param sequelize - Database instance
 * @param parentId - Parent account ID
 * @param childId - Child account ID
 * @returns Updated child account
 */
export declare function addChildAccount(sequelize: Sequelize, parentId: string, childId: string): Promise<ChartOfAccountsEntity>;
/**
 * Reorder accounts in hierarchy
 * @param sequelize - Database instance
 * @param accountId - Account to move
 * @param newParentId - New parent account ID
 * @returns Updated account
 */
export declare function reorderHierarchy(sequelize: Sequelize, accountId: string, newParentId: string): Promise<ChartOfAccountsEntity>;
/**
 * Validate hierarchy integrity
 * @param sequelize - Database instance
 * @returns Validation result with errors
 */
export declare function validateHierarchyIntegrity(sequelize: Sequelize): Promise<{
    isValid: boolean;
    errors: string[];
}>;
/**
 * Create journal entry
 * @param sequelize - Database instance
 * @param periodId - Accounting period ID
 * @param lineItems - Debit and credit entries
 * @param referenceInfo - Reference document info
 * @returns Created journal entry with ID
 */
export declare function createJournalEntry(sequelize: Sequelize, periodId: string, lineItems: JournalEntryLineItem[], referenceInfo: {
    reference: string;
    description?: string;
}): Promise<{
    entryId: string;
    status: string;
}>;
/**
 * Post journal entry to ledger
 * @param sequelize - Database instance
 * @param entryId - Journal entry ID
 * @returns Posted entry status
 */
export declare function postJournalEntry(sequelize: Sequelize, entryId: string): Promise<{
    entryId: string;
    status: string;
    postedAt: Date;
}>;
/**
 * Void journal entry
 * @param sequelize - Database instance
 * @param entryId - Journal entry ID
 * @returns Voided entry status
 */
export declare function voidJournalEntry(sequelize: Sequelize, entryId: string): Promise<{
    entryId: string;
    status: string;
    voidedAt: Date;
}>;
/**
 * Reverse journal entry (creates offsetting entry)
 * @param sequelize - Database instance
 * @param entryId - Original journal entry ID
 * @returns Reversed entry ID
 */
export declare function reverseJournalEntry(sequelize: Sequelize, entryId: string): Promise<{
    originalId: string;
    reversalId: string;
}>;
/**
 * Create batch posting session
 * @param sequelize - Database instance
 * @param batchName - Batch identifier
 * @param expectedCount - Expected entries in batch
 * @returns Batch ID
 */
export declare function createBatchPosting(sequelize: Sequelize, batchName: string, expectedCount: number): Promise<{
    batchId: string;
    status: string;
}>;
/**
 * Add journal entries to batch
 * @param sequelize - Database instance
 * @param batchId - Batch ID
 * @param entryIds - Journal entry IDs to add
 * @returns Updated batch info
 */
export declare function addEntriesToBatch(sequelize: Sequelize, batchId: string, entryIds: string[]): Promise<{
    batchId: string;
    addedCount: number;
}>;
/**
 * Validate batch for posting
 * @param sequelize - Database instance
 * @param batchId - Batch ID
 * @returns Validation result with errors
 */
export declare function validateBatch(sequelize: Sequelize, batchId: string): Promise<{
    isValid: boolean;
    errors: string[];
    totalCount: number;
}>;
/**
 * Post entire batch
 * @param sequelize - Database instance
 * @param batchId - Batch ID
 * @returns Batch posting result
 */
export declare function postBatch(sequelize: Sequelize, batchId: string): Promise<{
    batchId: string;
    postedCount: number;
    failedCount: number;
    status: string;
}>;
/**
 * Get account balance
 * @param sequelize - Database instance
 * @param accountId - Account ID
 * @param asOfDate - As of date (optional)
 * @returns Balance response
 */
export declare function getAccountBalance(sequelize: Sequelize, accountId: string, asOfDate?: Date): Promise<BalanceResponse>;
/**
 * Get trial balance
 * @param sequelize - Database instance
 * @param periodId - Period ID
 * @returns Trial balance report
 */
export declare function getTrialBalance(sequelize: Sequelize, periodId: string): Promise<TrialBalanceReport>;
/**
 * Get period balance for account
 * @param sequelize - Database instance
 * @param accountId - Account ID
 * @param periodId - Period ID
 * @returns Period balance
 */
export declare function getPeriodBalance(sequelize: Sequelize, accountId: string, periodId: string): Promise<BalanceResponse>;
/**
 * Get balance summary for account range
 * @param sequelize - Database instance
 * @param accountCodes - Account code patterns
 * @returns Summary balances
 */
export declare function getBalanceSummary(sequelize: Sequelize, accountCodes: string[]): Promise<BalanceResponse[]>;
/**
 * Validate journal entry balancing
 * @param sequelize - Database instance
 * @param entryId - Journal entry ID
 * @returns Validation result
 */
export declare function validateJournalEntry(sequelize: Sequelize, entryId: string): Promise<{
    isValid: boolean;
    debits: number;
    credits: number;
    difference: number;
}>;
/**
 * Check ledger balancing
 * @param sequelize - Database instance
 * @param periodId - Period ID
 * @returns Ledger balance check
 */
export declare function checkLedgerBalance(sequelize: Sequelize, periodId: string): Promise<{
    isBalanced: boolean;
    totalDebits: number;
    totalCredits: number;
    variance: number;
}>;
/**
 * Find entry errors
 * @param sequelize - Database instance
 * @param periodId - Period ID
 * @returns Array of error entries
 */
export declare function findEntryErrors(sequelize: Sequelize, periodId: string): Promise<Array<{
    entryId: string;
    error: string;
    debits: number;
    credits: number;
}>>;
/**
 * Auto-correct common entry errors
 * @param sequelize - Database instance
 * @param entryId - Journal entry ID
 * @returns Correction result
 */
export declare function autoCorrectEntry(sequelize: Sequelize, entryId: string): Promise<{
    entryId: string;
    corrected: boolean;
    message: string;
}>;
/**
 * Open accounting period
 * @param sequelize - Database instance
 * @param periodCode - Period code
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Opened period
 */
export declare function openPeriod(sequelize: Sequelize, periodCode: string, startDate: Date, endDate: Date): Promise<{
    periodId: string;
    status: string;
    startDate: Date;
    endDate: Date;
}>;
/**
 * Close accounting period
 * @param sequelize - Database instance
 * @param periodId - Period ID
 * @returns Closed period status
 */
export declare function closePeriod(sequelize: Sequelize, periodId: string): Promise<{
    periodId: string;
    status: string;
    closedAt: Date;
}>;
/**
 * Reopen closed period
 * @param sequelize - Database instance
 * @param periodId - Period ID
 * @returns Reopened period status
 */
export declare function reopenPeriod(sequelize: Sequelize, periodId: string): Promise<{
    periodId: string;
    status: string;
    reopenedAt: Date;
}>;
/**
 * Get period status
 * @param sequelize - Database instance
 * @param periodId - Period ID
 * @returns Period status information
 */
export declare function getPeriodStatus(sequelize: Sequelize, periodId: string): Promise<{
    periodId: string;
    code: string;
    status: string;
    startDate: Date;
    endDate: Date;
    entryCount: number;
}>;
/**
 * Convert amount to different currency
 * @param sequelize - Database instance
 * @param amount - Amount to convert
 * @param fromCurrency - Source currency
 * @param toCurrency - Target currency
 * @param conversionDate - Conversion date
 * @returns Converted amount
 */
export declare function convertCurrency(sequelize: Sequelize, amount: number, fromCurrency: CurrencyType, toCurrency: CurrencyType, conversionDate: Date): Promise<{
    originalAmount: number;
    convertedAmount: number;
    rate: number;
    fromCurrency: CurrencyType;
    toCurrency: CurrencyType;
}>;
/**
 * Revalue foreign currency balances
 * @param sequelize - Database instance
 * @param accountId - Account ID
 * @param revaluationDate - Revaluation date
 * @returns Revaluation entry details
 */
export declare function revaluateForeignCurrency(sequelize: Sequelize, accountId: string, revaluationDate: Date): Promise<{
    accountId: string;
    entryId: string;
    gainLoss: number;
    status: string;
}>;
/**
 * Record realized gains/losses
 * @param sequelize - Database instance
 * @param accountId - Account ID
 * @param amount - Realized amount
 * @param description - Transaction description
 * @returns Realized entry details
 */
export declare function recordRealizedGainLoss(sequelize: Sequelize, accountId: string, amount: number, description: string): Promise<{
    accountId: string;
    entryId: string;
    amount: number;
}>;
/**
 * Update exchange rates
 * @param sequelize - Database instance
 * @param rates - Exchange rate entries
 * @param effectiveDate - Effective date
 * @returns Updated rate count
 */
export declare function updateExchangeRates(sequelize: Sequelize, rates: Array<{
    from: CurrencyType;
    to: CurrencyType;
    rate: number;
}>, effectiveDate: Date): Promise<{
    updatedCount: number;
    effectiveDate: Date;
}>;
/**
 * Record inter-company transaction
 * @param sequelize - Database instance
 * @param fromCompany - Source company
 * @param toCompany - Target company
 * @param amount - Transaction amount
 * @param description - Transaction description
 * @returns Transaction ID
 */
export declare function recordInterCompanyTransaction(sequelize: Sequelize, fromCompany: string, toCompany: string, amount: number, description: string): Promise<{
    transactionId: string;
    status: string;
}>;
/**
 * Eliminate inter-company entries
 * @param sequelize - Database instance
 * @param periodId - Period ID
 * @returns Elimination result
 */
export declare function eliminateInterCompanyEntries(sequelize: Sequelize, periodId: string): Promise<{
    eliminatedCount: number;
    totalAmount: number;
}>;
/**
 * Consolidate subsidiary balances
 * @param sequelize - Database instance
 * @param parentCompanyId - Parent company ID
 * @param periodId - Period ID
 * @returns Consolidated balances
 */
export declare function consolidateSubsidiaryBalances(sequelize: Sequelize, parentCompanyId: string, periodId: string): Promise<{
    parentCompanyId: string;
    subsidiaryCount: number;
    consolidationStatus: string;
}>;
/**
 * Reconcile inter-company balances
 * @param sequelize - Database instance
 * @param company1: string
 * @param company2: string
 * @returns Reconciliation result
 */
export declare function reconcileInterCompanyBalances(sequelize: Sequelize, company1: string, company2: string): Promise<{
    company1: string;
    company2: string;
    variance: number;
    isReconciled: boolean;
}>;
/**
 * Generate audit trail
 * @param sequelize - Database instance
 * @param periodId - Period ID
 * @param filters - Optional filters
 * @returns Audit trail entries
 */
export declare function generateAuditTrail(sequelize: Sequelize, periodId: string, filters?: {
    entityType?: string;
    action?: string;
}): Promise<Array<{
    timestamp: Date;
    entityType: string;
    action: string;
    changedBy: string;
    details: string;
}>>;
/**
 * Validate ledger integrity
 * @param sequelize - Database instance
 * @param periodId - Period ID
 * @returns Validation report
 */
export declare function validateLedgerIntegrity(sequelize: Sequelize, periodId: string): Promise<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
}>;
/**
 * Export ledger data
 * @param sequelize - Database instance
 * @param periodId - Period ID
 * @param format - Export format
 * @returns Export file path or data
 */
export declare function exportLedgerData(sequelize: Sequelize, periodId: string, format: 'CSV' | 'JSON' | 'XML'): Promise<{
    exportId: string;
    format: string;
    status: string;
    createdAt: Date;
}>;
/**
 * Archive accounting period
 * @param sequelize - Database instance
 * @param periodId - Period ID
 * @returns Archive status
 */
export declare function archiveAccountingPeriod(sequelize: Sequelize, periodId: string): Promise<{
    periodId: string;
    status: string;
    archivedAt: Date;
}>;
export { AccountType, AccountStatus, JournalEntryStatus, PeriodStatus, CurrencyType, TransactionType };
//# sourceMappingURL=financial-accounting-ledger-kit.d.ts.map