/**
 * LOC: FINTXN0001234
 * File: /reuse/financial/financial-transaction-processing-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (Model, DataTypes, Transaction, Op)
 *   - ../error-handling-kit.ts (exception classes, error handling)
 *   - ../validation-kit.ts (validation utilities)
 *
 * DOWNSTREAM (imported by):
 *   - backend/financial/*
 *   - backend/accounting/*
 *   - backend/controllers/financial-transaction.controller.ts
 *   - backend/services/financial-transaction.service.ts
 */
/**
 * File: /reuse/financial/financial-transaction-processing-kit.ts
 * Locator: WC-FIN-TXNPRC-001
 * Purpose: USACE CEFMS-level Financial Transaction Processing - validation, posting, reversals, adjustments, batch processing, reconciliation
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, error-handling-kit, validation-kit
 * Downstream: Financial controllers, accounting services, transaction processors, audit systems
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+
 * Exports: 45+ production-ready functions for transaction processing, posting, reversals, batch operations, reconciliation
 *
 * LLM Context: Enterprise-grade financial transaction processing utilities competing with USACE CEFMS.
 * Provides comprehensive transaction lifecycle management including validation, pre-posting verification,
 * transaction posting with double-entry accounting, transaction reversals, adjustments, batch processing,
 * transaction reconciliation, approval workflows, audit trails, fund controls, commitment tracking,
 * obligation management, expenditure tracking, payment processing, and financial reporting integration.
 */
import { Sequelize, Transaction } from 'sequelize';
interface AccountingEntry {
    accountId: string;
    accountCode: string;
    accountType: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
    debitAmount: number;
    creditAmount: number;
    fundCode?: string;
    organizationCode?: string;
    programCode?: string;
    projectCode?: string;
    activityCode?: string;
    description: string;
}
interface TransactionValidationResult {
    isValid: boolean;
    errors: Array<{
        code: string;
        field: string;
        message: string;
        severity: 'error' | 'warning' | 'info';
    }>;
    warnings: string[];
    metadata: Record<string, any>;
}
interface BatchProcessingOptions {
    batchId: string;
    batchSize: number;
    continueOnError: boolean;
    validateBeforeProcessing: boolean;
    commitStrategy: 'all-or-nothing' | 'per-transaction' | 'per-batch';
    parallelProcessing: boolean;
    maxConcurrency?: number;
}
interface TransactionReversalRequest {
    originalTransactionId: string;
    reversalReason: string;
    reversalDate: Date;
    reversedBy: string;
    approvalRequired: boolean;
    approverId?: string;
    metadata?: Record<string, any>;
}
interface TransactionAdjustmentRequest {
    originalTransactionId: string;
    adjustmentType: 'amount' | 'account' | 'allocation' | 'reclassification';
    adjustmentReason: string;
    adjustmentDate: Date;
    adjustedBy: string;
    newEntries: AccountingEntry[];
    approvalRequired: boolean;
    approverId?: string;
}
interface FundControlCheck {
    fundCode: string;
    organizationCode: string;
    programCode: string;
    availableBalance: number;
    requestedAmount: number;
    withinBudget: boolean;
    exceedsThreshold: boolean;
    requiresApproval: boolean;
    warnings: string[];
}
interface CommitmentTracking {
    commitmentId: string;
    commitmentNumber: string;
    fundCode: string;
    organizationCode: string;
    programCode: string;
    committedAmount: number;
    obligatedAmount: number;
    expendedAmount: number;
    remainingCommitment: number;
    status: 'active' | 'closed' | 'cancelled' | 'expired';
}
interface PostingResult {
    success: boolean;
    transactionId: string;
    journalEntryId: string;
    postedDate: Date;
    fiscalPeriod: string;
    affectedAccounts: string[];
    balanceImpacts: Array<{
        accountId: string;
        previousBalance: number;
        newBalance: number;
        changeAmount: number;
    }>;
    errors?: Array<{
        code: string;
        message: string;
    }>;
}
interface ReconciliationMatch {
    matchType: 'exact' | 'partial' | 'suspect' | 'no-match';
    sourceTransaction: any;
    targetTransaction: any;
    matchScore: number;
    matchCriteria: string[];
    discrepancies: Array<{
        field: string;
        sourceValue: any;
        targetValue: any;
        difference: number | string;
    }>;
}
interface ApprovalWorkflow {
    workflowId: string;
    transactionId: string;
    currentStep: number;
    totalSteps: number;
    status: 'pending' | 'approved' | 'rejected' | 'cancelled';
    approvers: Array<{
        approverId: string;
        approverName: string;
        stepNumber: number;
        status: 'pending' | 'approved' | 'rejected';
        approvalDate?: Date;
        comments?: string;
    }>;
}
/**
 * Financial Transaction model with comprehensive transaction tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} FinancialTransaction model
 *
 * @example
 * ```typescript
 * const FinancialTransaction = createFinancialTransactionModel(sequelize);
 * const transaction = await FinancialTransaction.create({
 *   transactionNumber: 'TXN-2024-001',
 *   transactionType: 'payment',
 *   transactionDate: new Date(),
 *   fiscalYear: '2024',
 *   fiscalPeriod: '03',
 *   totalAmount: 10000.00,
 *   status: 'pending'
 * });
 * ```
 */
export declare const createFinancialTransactionModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        transactionNumber: string;
        transactionType: string;
        transactionDate: Date;
        postingDate: Date | null;
        fiscalYear: string;
        fiscalPeriod: string;
        documentNumber: string | null;
        referenceNumber: string | null;
        description: string;
        totalAmount: number;
        currency: string;
        exchangeRate: number;
        status: string;
        batchId: string | null;
        sourceSystem: string;
        createdBy: string;
        approvedBy: string | null;
        approvedAt: Date | null;
        reversedBy: string | null;
        reversedAt: Date | null;
        reversalTransactionId: number | null;
        originalTransactionId: number | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Journal Entry model for double-entry accounting.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} JournalEntry model
 *
 * @example
 * ```typescript
 * const JournalEntry = createJournalEntryModel(sequelize);
 * const entry = await JournalEntry.create({
 *   transactionId: 123,
 *   accountId: 456,
 *   accountCode: '1010-100',
 *   debitAmount: 5000.00,
 *   creditAmount: 0.00,
 *   fundCode: 'FUND01'
 * });
 * ```
 */
export declare const createJournalEntryModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        transactionId: number;
        entryNumber: number;
        accountId: number;
        accountCode: string;
        accountType: string;
        debitAmount: number;
        creditAmount: number;
        fundCode: string | null;
        organizationCode: string | null;
        programCode: string | null;
        projectCode: string | null;
        activityCode: string | null;
        costCenterCode: string | null;
        description: string;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Transaction Audit Log model for comprehensive audit trails.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} TransactionAuditLog model
 *
 * @example
 * ```typescript
 * const TransactionAuditLog = createTransactionAuditLogModel(sequelize);
 * await TransactionAuditLog.create({
 *   transactionId: 123,
 *   action: 'approved',
 *   performedBy: 'user@example.com',
 *   previousState: { status: 'pending' },
 *   newState: { status: 'approved' }
 * });
 * ```
 */
export declare const createTransactionAuditLogModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        transactionId: number;
        action: string;
        performedBy: string;
        performedAt: Date;
        ipAddress: string | null;
        userAgent: string | null;
        previousState: Record<string, any> | null;
        newState: Record<string, any>;
        changeDescription: string;
        metadata: Record<string, any>;
        readonly createdAt: Date;
    };
};
/**
 * Validates transaction before processing with comprehensive business rules.
 *
 * @param {any} transaction - Transaction data to validate
 * @param {Record<string, any>} [options] - Validation options
 * @returns {Promise<TransactionValidationResult>} Validation result
 *
 * @example
 * ```typescript
 * const result = await validateTransaction({
 *   transactionType: 'payment',
 *   totalAmount: 10000,
 *   entries: [...],
 *   fiscalYear: '2024',
 *   fiscalPeriod: '03'
 * });
 * if (!result.isValid) {
 *   console.error('Validation errors:', result.errors);
 * }
 * ```
 */
export declare const validateTransaction: (transaction: any, options?: Record<string, any>) => Promise<TransactionValidationResult>;
/**
 * Validates account codes against chart of accounts.
 *
 * @param {string[]} accountCodes - Account codes to validate
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Map<string, boolean>>} Map of account code to validity
 *
 * @example
 * ```typescript
 * const validity = await validateAccountCodes(['1010-100', '2020-200'], sequelize);
 * validity.get('1010-100'); // true if valid
 * ```
 */
export declare const validateAccountCodes: (accountCodes: string[], sequelize: Sequelize) => Promise<Map<string, boolean>>;
/**
 * Performs fund control validation to ensure budget compliance.
 *
 * @param {string} fundCode - Fund code
 * @param {string} organizationCode - Organization code
 * @param {number} requestedAmount - Requested amount
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<FundControlCheck>} Fund control check result
 *
 * @example
 * ```typescript
 * const check = await performFundControlCheck('FUND01', 'ORG100', 50000, sequelize);
 * if (!check.withinBudget) {
 *   console.error('Insufficient funds');
 * }
 * ```
 */
export declare const performFundControlCheck: (fundCode: string, organizationCode: string, requestedAmount: number, sequelize: Sequelize) => Promise<FundControlCheck>;
/**
 * Validates fiscal period is open for posting.
 *
 * @param {string} fiscalYear - Fiscal year
 * @param {string} fiscalPeriod - Fiscal period
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<boolean>} True if period is open
 *
 * @example
 * ```typescript
 * const isOpen = await validateFiscalPeriodOpen('2024', '03', sequelize);
 * if (!isOpen) {
 *   throw new Error('Fiscal period is closed');
 * }
 * ```
 */
export declare const validateFiscalPeriodOpen: (fiscalYear: string, fiscalPeriod: string, sequelize: Sequelize) => Promise<boolean>;
/**
 * Validates transaction against duplicate detection rules.
 *
 * @param {any} transaction - Transaction to check
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<boolean>} True if no duplicate found
 *
 * @example
 * ```typescript
 * const isUnique = await validateNoDuplicateTransaction({
 *   documentNumber: 'INV-2024-001',
 *   totalAmount: 10000,
 *   vendorId: 123
 * }, sequelize);
 * ```
 */
export declare const validateNoDuplicateTransaction: (transaction: any, sequelize: Sequelize) => Promise<boolean>;
/**
 * Posts transaction to general ledger with double-entry accounting.
 *
 * @param {any} transaction - Transaction to post
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<PostingResult>} Posting result
 *
 * @example
 * ```typescript
 * const result = await postTransaction({
 *   transactionNumber: 'TXN-2024-001',
 *   entries: [...],
 *   fiscalYear: '2024',
 *   fiscalPeriod: '03'
 * }, sequelize);
 * ```
 */
export declare const postTransaction: (transaction: any, sequelize: Sequelize) => Promise<PostingResult>;
/**
 * Performs pre-posting validation checks.
 *
 * @param {any} transaction - Transaction to validate
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<TransactionValidationResult>} Pre-posting validation result
 *
 * @example
 * ```typescript
 * const result = await performPrePostingChecks(transaction, sequelize);
 * if (!result.isValid) {
 *   throw new Error('Pre-posting checks failed');
 * }
 * ```
 */
export declare const performPrePostingChecks: (transaction: any, sequelize: Sequelize) => Promise<TransactionValidationResult>;
/**
 * Posts batch of transactions with optimized performance.
 *
 * @param {any[]} transactions - Transactions to post
 * @param {BatchProcessingOptions} options - Batch processing options
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Array<PostingResult>>} Batch posting results
 *
 * @example
 * ```typescript
 * const results = await postBatchTransactions(transactions, {
 *   batchId: 'BATCH-001',
 *   batchSize: 100,
 *   continueOnError: true,
 *   commitStrategy: 'per-transaction'
 * }, sequelize);
 * ```
 */
export declare const postBatchTransactions: (transactions: any[], options: BatchProcessingOptions, sequelize: Sequelize) => Promise<Array<PostingResult>>;
/**
 * Updates account balances after posting.
 *
 * @param {string} accountId - Account ID
 * @param {number} amount - Amount to add/subtract
 * @param {string} fiscalYear - Fiscal year
 * @param {string} fiscalPeriod - Fiscal period
 * @param {Transaction} transaction - Sequelize transaction
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await updateAccountBalance('1010', 5000, '2024', '03', t, sequelize);
 * ```
 */
export declare const updateAccountBalance: (accountId: string, amount: number, fiscalYear: string, fiscalPeriod: string, transaction: Transaction, sequelize: Sequelize) => Promise<void>;
/**
 * Generates posting journal with audit trail.
 *
 * @param {string} transactionId - Transaction ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any>} Journal report
 *
 * @example
 * ```typescript
 * const journal = await generatePostingJournal('TXN-2024-001', sequelize);
 * console.log(journal.entries);
 * ```
 */
export declare const generatePostingJournal: (transactionId: string, sequelize: Sequelize) => Promise<any>;
/**
 * Reverses a posted transaction with full audit trail.
 *
 * @param {TransactionReversalRequest} request - Reversal request
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<PostingResult>} Reversal result
 *
 * @example
 * ```typescript
 * const result = await reverseTransaction({
 *   originalTransactionId: 'TXN-2024-001',
 *   reversalReason: 'Duplicate payment',
 *   reversalDate: new Date(),
 *   reversedBy: 'user@example.com',
 *   approvalRequired: true
 * }, sequelize);
 * ```
 */
export declare const reverseTransaction: (request: TransactionReversalRequest, sequelize: Sequelize) => Promise<PostingResult>;
/**
 * Validates reversal request before processing.
 *
 * @param {TransactionReversalRequest} request - Reversal request
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<TransactionValidationResult>} Validation result
 *
 * @example
 * ```typescript
 * const result = await validateReversalRequest(request, sequelize);
 * if (!result.isValid) {
 *   console.error('Cannot reverse transaction:', result.errors);
 * }
 * ```
 */
export declare const validateReversalRequest: (request: TransactionReversalRequest, sequelize: Sequelize) => Promise<TransactionValidationResult>;
/**
 * Creates reversal journal entries from original transaction.
 *
 * @param {string} originalTransactionId - Original transaction ID
 * @param {string} reversalTransactionId - Reversal transaction ID
 * @param {Transaction} transaction - Sequelize transaction
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await createReversalEntries('123', '456', t, sequelize);
 * ```
 */
export declare const createReversalEntries: (originalTransactionId: string, reversalTransactionId: string, transaction: Transaction, sequelize: Sequelize) => Promise<void>;
/**
 * Processes partial reversal of transaction.
 *
 * @param {string} transactionId - Transaction ID
 * @param {number} reversalAmount - Amount to reverse
 * @param {string} reason - Reversal reason
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<PostingResult>} Partial reversal result
 *
 * @example
 * ```typescript
 * const result = await processPartialReversal('TXN-001', 5000, 'Partial refund', sequelize);
 * ```
 */
export declare const processPartialReversal: (transactionId: string, reversalAmount: number, reason: string, sequelize: Sequelize) => Promise<PostingResult>;
/**
 * Gets reversal history for a transaction.
 *
 * @param {string} transactionId - Transaction ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any[]>} Reversal history
 *
 * @example
 * ```typescript
 * const history = await getReversalHistory('TXN-2024-001', sequelize);
 * ```
 */
export declare const getReversalHistory: (transactionId: string, sequelize: Sequelize) => Promise<any[]>;
/**
 * Processes transaction adjustment with approval workflow.
 *
 * @param {TransactionAdjustmentRequest} request - Adjustment request
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<PostingResult>} Adjustment result
 *
 * @example
 * ```typescript
 * const result = await processTransactionAdjustment({
 *   originalTransactionId: 'TXN-001',
 *   adjustmentType: 'amount',
 *   adjustmentReason: 'Correction',
 *   adjustedBy: 'user@example.com',
 *   newEntries: [...]
 * }, sequelize);
 * ```
 */
export declare const processTransactionAdjustment: (request: TransactionAdjustmentRequest, sequelize: Sequelize) => Promise<PostingResult>;
/**
 * Reclassifies transaction entries to different accounts.
 *
 * @param {string} transactionId - Transaction ID
 * @param {Map<string, string>} accountMapping - Old to new account mapping
 * @param {string} reason - Reclassification reason
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<PostingResult>} Reclassification result
 *
 * @example
 * ```typescript
 * const mapping = new Map([['1010-100', '1010-200']]);
 * const result = await reclassifyTransactionAccounts('TXN-001', mapping, 'Account reorg', sequelize);
 * ```
 */
export declare const reclassifyTransactionAccounts: (transactionId: string, accountMapping: Map<string, string>, reason: string, sequelize: Sequelize) => Promise<PostingResult>;
/**
 * Adjusts transaction allocation across cost centers.
 *
 * @param {string} transactionId - Transaction ID
 * @param {Record<string, number>} newAllocations - Cost center to percentage mapping
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<PostingResult>} Allocation adjustment result
 *
 * @example
 * ```typescript
 * const result = await adjustTransactionAllocation('TXN-001', {
 *   'CC001': 50,
 *   'CC002': 30,
 *   'CC003': 20
 * }, sequelize);
 * ```
 */
export declare const adjustTransactionAllocation: (transactionId: string, newAllocations: Record<string, number>, sequelize: Sequelize) => Promise<PostingResult>;
/**
 * Corrects transaction amount with audit trail.
 *
 * @param {string} transactionId - Transaction ID
 * @param {number} correctAmount - Corrected amount
 * @param {string} reason - Correction reason
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<PostingResult>} Correction result
 *
 * @example
 * ```typescript
 * const result = await correctTransactionAmount('TXN-001', 10500, 'Data entry error', sequelize);
 * ```
 */
export declare const correctTransactionAmount: (transactionId: string, correctAmount: number, reason: string, sequelize: Sequelize) => Promise<PostingResult>;
/**
 * Validates adjustment request before processing.
 *
 * @param {TransactionAdjustmentRequest} request - Adjustment request
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<TransactionValidationResult>} Validation result
 *
 * @example
 * ```typescript
 * const result = await validateAdjustmentRequest(request, sequelize);
 * ```
 */
export declare const validateAdjustmentRequest: (request: TransactionAdjustmentRequest, sequelize: Sequelize) => Promise<TransactionValidationResult>;
/**
 * Processes batch of transactions with comprehensive error handling.
 *
 * @param {any[]} transactions - Transactions to process
 * @param {BatchProcessingOptions} options - Batch options
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Array<{ success: boolean; transactionId: string; error?: string }>>} Batch results
 *
 * @example
 * ```typescript
 * const results = await processBatchTransactions(transactions, {
 *   batchId: 'BATCH-001',
 *   batchSize: 100,
 *   continueOnError: true,
 *   validateBeforeProcessing: true,
 *   commitStrategy: 'per-batch'
 * }, sequelize);
 * ```
 */
export declare const processBatchTransactions: (transactions: any[], options: BatchProcessingOptions, sequelize: Sequelize) => Promise<Array<{
    success: boolean;
    transactionId: string;
    error?: string;
}>>;
/**
 * Validates batch before processing with summary statistics.
 *
 * @param {any[]} transactions - Transactions to validate
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<{ isValid: boolean; totalTransactions: number; totalAmount: number; errors: any[] }>} Batch validation
 *
 * @example
 * ```typescript
 * const validation = await validateBatch(transactions, sequelize);
 * console.log(`Valid: ${validation.isValid}, Total: ${validation.totalAmount}`);
 * ```
 */
export declare const validateBatch: (transactions: any[], sequelize: Sequelize) => Promise<{
    isValid: boolean;
    totalTransactions: number;
    totalAmount: number;
    errors: any[];
}>;
/**
 * Generates batch processing summary report.
 *
 * @param {string} batchId - Batch ID
 * @param {any[]} results - Processing results
 * @returns {any} Batch summary
 *
 * @example
 * ```typescript
 * const summary = generateBatchSummary('BATCH-001', results);
 * console.log(`Success: ${summary.successCount}, Failed: ${summary.failureCount}`);
 * ```
 */
export declare const generateBatchSummary: (batchId: string, results: any[]) => any;
/**
 * Rolls back batch processing on critical error.
 *
 * @param {string} batchId - Batch ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await rollbackBatch('BATCH-001', sequelize);
 * ```
 */
export declare const rollbackBatch: (batchId: string, sequelize: Sequelize) => Promise<void>;
/**
 * Gets batch processing status with real-time progress.
 *
 * @param {string} batchId - Batch ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any>} Batch status
 *
 * @example
 * ```typescript
 * const status = await getBatchStatus('BATCH-001', sequelize);
 * console.log(`Progress: ${status.processedCount}/${status.totalCount}`);
 * ```
 */
export declare const getBatchStatus: (batchId: string, sequelize: Sequelize) => Promise<any>;
/**
 * Reconciles transactions between systems with matching algorithms.
 *
 * @param {any[]} sourceTransactions - Source system transactions
 * @param {any[]} targetTransactions - Target system transactions
 * @param {Record<string, any>} matchCriteria - Matching criteria
 * @returns {Promise<ReconciliationMatch[]>} Reconciliation matches
 *
 * @example
 * ```typescript
 * const matches = await reconcileTransactions(sourceData, targetData, {
 *   matchFields: ['documentNumber', 'amount', 'date'],
 *   tolerance: 0.01
 * });
 * ```
 */
export declare const reconcileTransactions: (sourceTransactions: any[], targetTransactions: any[], matchCriteria: Record<string, any>) => Promise<ReconciliationMatch[]>;
/**
 * Calculates match score between two transactions.
 *
 * @param {any} source - Source transaction
 * @param {any} target - Target transaction
 * @param {Record<string, any>} criteria - Match criteria
 * @returns {ReconciliationMatch} Match result
 *
 * @example
 * ```typescript
 * const match = calculateMatchScore(txn1, txn2, { matchFields: ['amount', 'date'] });
 * ```
 */
export declare const calculateMatchScore: (source: any, target: any, criteria: Record<string, any>) => ReconciliationMatch;
/**
 * Identifies unmatched transactions requiring investigation.
 *
 * @param {ReconciliationMatch[]} matches - Reconciliation matches
 * @returns {any[]} Unmatched transactions
 *
 * @example
 * ```typescript
 * const unmatched = identifyUnmatchedTransactions(matches);
 * console.log(`Found ${unmatched.length} unmatched transactions`);
 * ```
 */
export declare const identifyUnmatchedTransactions: (matches: ReconciliationMatch[]) => any[];
/**
 * Generates reconciliation report with summary statistics.
 *
 * @param {ReconciliationMatch[]} matches - Reconciliation matches
 * @param {string} reconciliationId - Reconciliation ID
 * @returns {any} Reconciliation report
 *
 * @example
 * ```typescript
 * const report = generateReconciliationReport(matches, 'RECON-2024-001');
 * console.log(report);
 * ```
 */
export declare const generateReconciliationReport: (matches: ReconciliationMatch[], reconciliationId: string) => any;
/**
 * Marks reconciliation items as resolved.
 *
 * @param {string[]} transactionIds - Transaction IDs to mark resolved
 * @param {string} resolvedBy - User resolving items
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await markReconciliationItemsResolved(['TXN-001', 'TXN-002'], 'user@example.com', sequelize);
 * ```
 */
export declare const markReconciliationItemsResolved: (transactionIds: string[], resolvedBy: string, sequelize: Sequelize) => Promise<void>;
/**
 * Initiates approval workflow for transaction.
 *
 * @param {string} transactionId - Transaction ID
 * @param {string[]} approverIds - List of approver IDs
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<ApprovalWorkflow>} Initiated workflow
 *
 * @example
 * ```typescript
 * const workflow = await initiateApprovalWorkflow('TXN-001', ['mgr1', 'mgr2'], sequelize);
 * ```
 */
export declare const initiateApprovalWorkflow: (transactionId: string, approverIds: string[], sequelize: Sequelize) => Promise<ApprovalWorkflow>;
/**
 * Processes approval decision for transaction.
 *
 * @param {string} workflowId - Workflow ID
 * @param {string} approverId - Approver ID
 * @param {boolean} approved - Approval decision
 * @param {string} [comments] - Approval comments
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<ApprovalWorkflow>} Updated workflow
 *
 * @example
 * ```typescript
 * const workflow = await processApprovalDecision('WF-001', 'mgr1', true, 'Approved', sequelize);
 * ```
 */
export declare const processApprovalDecision: (workflowId: string, approverId: string, approved: boolean, comments: string | undefined, sequelize: Sequelize) => Promise<ApprovalWorkflow>;
/**
 * Gets approval workflow status with approver details.
 *
 * @param {string} workflowId - Workflow ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<ApprovalWorkflow>} Workflow status
 *
 * @example
 * ```typescript
 * const workflow = await getApprovalWorkflowStatus('WF-001', sequelize);
 * console.log(`Status: ${workflow.status}, Step: ${workflow.currentStep}/${workflow.totalSteps}`);
 * ```
 */
export declare const getApprovalWorkflowStatus: (workflowId: string, sequelize: Sequelize) => Promise<ApprovalWorkflow>;
/**
 * Cancels approval workflow.
 *
 * @param {string} workflowId - Workflow ID
 * @param {string} cancelledBy - User cancelling workflow
 * @param {string} reason - Cancellation reason
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await cancelApprovalWorkflow('WF-001', 'user@example.com', 'Cancelled by user', sequelize);
 * ```
 */
export declare const cancelApprovalWorkflow: (workflowId: string, cancelledBy: string, reason: string, sequelize: Sequelize) => Promise<void>;
/**
 * Gets pending approvals for a user.
 *
 * @param {string} approverId - Approver ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any[]>} Pending approvals
 *
 * @example
 * ```typescript
 * const pending = await getPendingApprovals('mgr1', sequelize);
 * console.log(`${pending.length} items pending approval`);
 * ```
 */
export declare const getPendingApprovals: (approverId: string, sequelize: Sequelize) => Promise<any[]>;
/**
 * Checks fund availability before commitment.
 *
 * @param {string} fundCode - Fund code
 * @param {string} organizationCode - Organization code
 * @param {number} amount - Commitment amount
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<FundControlCheck>} Fund availability check
 *
 * @example
 * ```typescript
 * const check = await checkFundAvailability('FUND01', 'ORG100', 50000, sequelize);
 * if (!check.withinBudget) {
 *   throw new Error('Insufficient funds');
 * }
 * ```
 */
export declare const checkFundAvailability: (fundCode: string, organizationCode: string, amount: number, sequelize: Sequelize) => Promise<FundControlCheck>;
/**
 * Creates fund commitment with budget validation.
 *
 * @param {any} commitment - Commitment details
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<CommitmentTracking>} Created commitment
 *
 * @example
 * ```typescript
 * const commitment = await createFundCommitment({
 *   commitmentNumber: 'COM-001',
 *   fundCode: 'FUND01',
 *   amount: 50000,
 *   description: 'Contract commitment'
 * }, sequelize);
 * ```
 */
export declare const createFundCommitment: (commitment: any, sequelize: Sequelize) => Promise<CommitmentTracking>;
/**
 * Updates commitment with obligation or expenditure.
 *
 * @param {string} commitmentId - Commitment ID
 * @param {number} obligatedAmount - Amount obligated
 * @param {number} expendedAmount - Amount expended
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<CommitmentTracking>} Updated commitment
 *
 * @example
 * ```typescript
 * const updated = await updateCommitment('COM-001', 25000, 10000, sequelize);
 * ```
 */
export declare const updateCommitment: (commitmentId: string, obligatedAmount: number, expendedAmount: number, sequelize: Sequelize) => Promise<CommitmentTracking>;
/**
 * Gets commitment summary for fund and organization.
 *
 * @param {string} fundCode - Fund code
 * @param {string} organizationCode - Organization code
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any>} Commitment summary
 *
 * @example
 * ```typescript
 * const summary = await getCommitmentSummary('FUND01', 'ORG100', sequelize);
 * ```
 */
export declare const getCommitmentSummary: (fundCode: string, organizationCode: string, sequelize: Sequelize) => Promise<any>;
/**
 * Closes expired or completed commitments.
 *
 * @param {string} commitmentId - Commitment ID
 * @param {string} reason - Close reason
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await closeCommitment('COM-001', 'Contract completed', sequelize);
 * ```
 */
export declare const closeCommitment: (commitmentId: string, reason: string, sequelize: Sequelize) => Promise<void>;
/**
 * Creates comprehensive audit log entry for transaction.
 *
 * @param {string} transactionId - Transaction ID
 * @param {string} action - Action performed
 * @param {string} performedBy - User performing action
 * @param {any} previousState - Previous transaction state
 * @param {any} newState - New transaction state
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await createAuditLogEntry('TXN-001', 'approved', 'user@example.com', oldState, newState, sequelize);
 * ```
 */
export declare const createAuditLogEntry: (transactionId: string, action: string, performedBy: string, previousState: any, newState: any, sequelize: Sequelize) => Promise<void>;
/**
 * Generates change description from state differences.
 *
 * @param {any} previousState - Previous state
 * @param {any} newState - New state
 * @returns {string} Change description
 *
 * @example
 * ```typescript
 * const description = generateChangeDescription(oldState, newState);
 * ```
 */
export declare const generateChangeDescription: (previousState: any, newState: any) => string;
/**
 * Gets complete audit trail for transaction.
 *
 * @param {string} transactionId - Transaction ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any[]>} Audit trail entries
 *
 * @example
 * ```typescript
 * const trail = await getTransactionAuditTrail('TXN-001', sequelize);
 * trail.forEach(entry => console.log(`${entry.action} by ${entry.performedBy}`));
 * ```
 */
export declare const getTransactionAuditTrail: (transactionId: string, sequelize: Sequelize) => Promise<any[]>;
/**
 * Generates financial transaction summary report.
 *
 * @param {string} fiscalYear - Fiscal year
 * @param {string} fiscalPeriod - Fiscal period
 * @param {Record<string, any>} filters - Additional filters
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any>} Summary report
 *
 * @example
 * ```typescript
 * const report = await generateTransactionSummaryReport('2024', '03', { fundCode: 'FUND01' }, sequelize);
 * ```
 */
export declare const generateTransactionSummaryReport: (fiscalYear: string, fiscalPeriod: string, filters: Record<string, any>, sequelize: Sequelize) => Promise<any>;
/**
 * Exports transaction data to external format (CSV, Excel, PDF).
 *
 * @param {string[]} transactionIds - Transaction IDs to export
 * @param {string} format - Export format
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any>} Export data
 *
 * @example
 * ```typescript
 * const exportData = await exportTransactionData(['TXN-001', 'TXN-002'], 'csv', sequelize);
 * ```
 */
export declare const exportTransactionData: (transactionIds: string[], format: string, sequelize: Sequelize) => Promise<any>;
/**
 * Default export with all transaction processing utilities.
 */
declare const _default: {
    createFinancialTransactionModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            transactionNumber: string;
            transactionType: string;
            transactionDate: Date;
            postingDate: Date | null;
            fiscalYear: string;
            fiscalPeriod: string;
            documentNumber: string | null;
            referenceNumber: string | null;
            description: string;
            totalAmount: number;
            currency: string;
            exchangeRate: number;
            status: string;
            batchId: string | null;
            sourceSystem: string;
            createdBy: string;
            approvedBy: string | null;
            approvedAt: Date | null;
            reversedBy: string | null;
            reversedAt: Date | null;
            reversalTransactionId: number | null;
            originalTransactionId: number | null;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createJournalEntryModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            transactionId: number;
            entryNumber: number;
            accountId: number;
            accountCode: string;
            accountType: string;
            debitAmount: number;
            creditAmount: number;
            fundCode: string | null;
            organizationCode: string | null;
            programCode: string | null;
            projectCode: string | null;
            activityCode: string | null;
            costCenterCode: string | null;
            description: string;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createTransactionAuditLogModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            transactionId: number;
            action: string;
            performedBy: string;
            performedAt: Date;
            ipAddress: string | null;
            userAgent: string | null;
            previousState: Record<string, any> | null;
            newState: Record<string, any>;
            changeDescription: string;
            metadata: Record<string, any>;
            readonly createdAt: Date;
        };
    };
    validateTransaction: (transaction: any, options?: Record<string, any>) => Promise<TransactionValidationResult>;
    validateAccountCodes: (accountCodes: string[], sequelize: Sequelize) => Promise<Map<string, boolean>>;
    performFundControlCheck: (fundCode: string, organizationCode: string, requestedAmount: number, sequelize: Sequelize) => Promise<FundControlCheck>;
    validateFiscalPeriodOpen: (fiscalYear: string, fiscalPeriod: string, sequelize: Sequelize) => Promise<boolean>;
    validateNoDuplicateTransaction: (transaction: any, sequelize: Sequelize) => Promise<boolean>;
    postTransaction: (transaction: any, sequelize: Sequelize) => Promise<PostingResult>;
    performPrePostingChecks: (transaction: any, sequelize: Sequelize) => Promise<TransactionValidationResult>;
    postBatchTransactions: (transactions: any[], options: BatchProcessingOptions, sequelize: Sequelize) => Promise<Array<PostingResult>>;
    updateAccountBalance: (accountId: string, amount: number, fiscalYear: string, fiscalPeriod: string, transaction: Transaction, sequelize: Sequelize) => Promise<void>;
    generatePostingJournal: (transactionId: string, sequelize: Sequelize) => Promise<any>;
    reverseTransaction: (request: TransactionReversalRequest, sequelize: Sequelize) => Promise<PostingResult>;
    validateReversalRequest: (request: TransactionReversalRequest, sequelize: Sequelize) => Promise<TransactionValidationResult>;
    createReversalEntries: (originalTransactionId: string, reversalTransactionId: string, transaction: Transaction, sequelize: Sequelize) => Promise<void>;
    processPartialReversal: (transactionId: string, reversalAmount: number, reason: string, sequelize: Sequelize) => Promise<PostingResult>;
    getReversalHistory: (transactionId: string, sequelize: Sequelize) => Promise<any[]>;
    processTransactionAdjustment: (request: TransactionAdjustmentRequest, sequelize: Sequelize) => Promise<PostingResult>;
    reclassifyTransactionAccounts: (transactionId: string, accountMapping: Map<string, string>, reason: string, sequelize: Sequelize) => Promise<PostingResult>;
    adjustTransactionAllocation: (transactionId: string, newAllocations: Record<string, number>, sequelize: Sequelize) => Promise<PostingResult>;
    correctTransactionAmount: (transactionId: string, correctAmount: number, reason: string, sequelize: Sequelize) => Promise<PostingResult>;
    validateAdjustmentRequest: (request: TransactionAdjustmentRequest, sequelize: Sequelize) => Promise<TransactionValidationResult>;
    processBatchTransactions: (transactions: any[], options: BatchProcessingOptions, sequelize: Sequelize) => Promise<Array<{
        success: boolean;
        transactionId: string;
        error?: string;
    }>>;
    validateBatch: (transactions: any[], sequelize: Sequelize) => Promise<{
        isValid: boolean;
        totalTransactions: number;
        totalAmount: number;
        errors: any[];
    }>;
    generateBatchSummary: (batchId: string, results: any[]) => any;
    rollbackBatch: (batchId: string, sequelize: Sequelize) => Promise<void>;
    getBatchStatus: (batchId: string, sequelize: Sequelize) => Promise<any>;
    reconcileTransactions: (sourceTransactions: any[], targetTransactions: any[], matchCriteria: Record<string, any>) => Promise<ReconciliationMatch[]>;
    calculateMatchScore: (source: any, target: any, criteria: Record<string, any>) => ReconciliationMatch;
    identifyUnmatchedTransactions: (matches: ReconciliationMatch[]) => any[];
    generateReconciliationReport: (matches: ReconciliationMatch[], reconciliationId: string) => any;
    markReconciliationItemsResolved: (transactionIds: string[], resolvedBy: string, sequelize: Sequelize) => Promise<void>;
    initiateApprovalWorkflow: (transactionId: string, approverIds: string[], sequelize: Sequelize) => Promise<ApprovalWorkflow>;
    processApprovalDecision: (workflowId: string, approverId: string, approved: boolean, comments: string | undefined, sequelize: Sequelize) => Promise<ApprovalWorkflow>;
    getApprovalWorkflowStatus: (workflowId: string, sequelize: Sequelize) => Promise<ApprovalWorkflow>;
    cancelApprovalWorkflow: (workflowId: string, cancelledBy: string, reason: string, sequelize: Sequelize) => Promise<void>;
    getPendingApprovals: (approverId: string, sequelize: Sequelize) => Promise<any[]>;
    checkFundAvailability: (fundCode: string, organizationCode: string, amount: number, sequelize: Sequelize) => Promise<FundControlCheck>;
    createFundCommitment: (commitment: any, sequelize: Sequelize) => Promise<CommitmentTracking>;
    updateCommitment: (commitmentId: string, obligatedAmount: number, expendedAmount: number, sequelize: Sequelize) => Promise<CommitmentTracking>;
    getCommitmentSummary: (fundCode: string, organizationCode: string, sequelize: Sequelize) => Promise<any>;
    closeCommitment: (commitmentId: string, reason: string, sequelize: Sequelize) => Promise<void>;
    createAuditLogEntry: (transactionId: string, action: string, performedBy: string, previousState: any, newState: any, sequelize: Sequelize) => Promise<void>;
    generateChangeDescription: (previousState: any, newState: any) => string;
    getTransactionAuditTrail: (transactionId: string, sequelize: Sequelize) => Promise<any[]>;
    generateTransactionSummaryReport: (fiscalYear: string, fiscalPeriod: string, filters: Record<string, any>, sequelize: Sequelize) => Promise<any>;
    exportTransactionData: (transactionIds: string[], format: string, sequelize: Sequelize) => Promise<any>;
};
export default _default;
//# sourceMappingURL=financial-transaction-processing-kit.d.ts.map