/**
 * LOC: GENLEDG001
 * File: /reuse/financial/general-ledger-operations-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (ORM for database operations)
 *   - @nestjs/common (NestJS framework)
 *   - @nestjs/swagger (API documentation)
 *   - ./financial-accounts-management-kit (Account operations)
 *
 * DOWNSTREAM (imported by):
 *   - Backend financial modules
 *   - Journal entry services
 *   - Financial reporting modules
 *   - Period close processes
 */
/**
 * File: /reuse/financial/general-ledger-operations-kit.ts
 * Locator: WC-FIN-GENLEDG-001
 * Purpose: Comprehensive General Ledger Operations - USACE CEFMS-level journal entries, posting, trial balance, reconciliation
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, TypeScript 5.x, financial-accounts-management-kit
 * Downstream: ../backend/financial/*, Journal Entry Services, Financial Reporting, Period Close
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+
 * Exports: 45+ functions for journal entries, posting, trial balance, account coding, ledger reconciliation, period close, financial reporting
 *
 * LLM Context: Enterprise-grade general ledger operations for USACE CEFMS compliance.
 * Provides comprehensive journal entry management, automated posting, trial balance generation, account coding validation,
 * ledger reconciliation, period close workflows, adjusting entries, reversing entries, batch processing,
 * audit trails, financial reporting, and multi-currency support.
 */
import { Sequelize, Transaction } from 'sequelize';
interface JournalEntryLine {
    lineId: number;
    journalEntryId: number;
    lineNumber: number;
    accountId: number;
    accountCode: string;
    debitAmount: number;
    creditAmount: number;
    description: string;
    dimensions: Record<string, string>;
    projectCode?: string;
    activityCode?: string;
    costCenterCode?: string;
}
interface TrialBalanceEntry {
    accountCode: string;
    accountName: string;
    accountType: string;
    debitBalance: number;
    creditBalance: number;
    netBalance: number;
}
interface PeriodCloseStatus {
    fiscalYear: number;
    fiscalPeriod: number;
    status: 'open' | 'closing' | 'closed' | 'locked';
    closeDate?: Date;
    closedBy?: string;
    checklistItems: PeriodCloseChecklistItem[];
}
interface PeriodCloseChecklistItem {
    itemId: string;
    itemName: string;
    itemType: 'required' | 'optional';
    status: 'pending' | 'completed' | 'skipped';
    completedBy?: string;
    completedAt?: Date;
    notes?: string;
}
interface AccountCodingRule {
    ruleId: number;
    transactionType: string;
    sourceSystem: string;
    defaultDebitAccount: string;
    defaultCreditAccount: string;
    requiredDimensions: string[];
    validationRules: string[];
}
interface LedgerReconciliationItem {
    accountId: number;
    fiscalYear: number;
    fiscalPeriod: number;
    glBalance: number;
    subLedgerBalance: number;
    variance: number;
    variancePercent: number;
    status: 'matched' | 'variance' | 'investigated';
}
export declare class CreateJournalEntryDto {
    entryDate: Date;
    postingDate: Date;
    entryType: string;
    source: string;
    reference: string;
    description: string;
    lines: JournalEntryLine[];
}
export declare class PostJournalEntryDto {
    journalEntryId: number;
    postingDate: Date;
    userId: string;
}
export declare class TrialBalanceRequestDto {
    fiscalYear: number;
    fiscalPeriod: number;
    includeZeroBalances?: boolean;
    accountType?: string;
}
/**
 * Sequelize model for Journal Entry Headers with approval workflow.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} JournalEntryHeader model
 *
 * @example
 * ```typescript
 * const JournalEntry = createJournalEntryHeaderModel(sequelize);
 * const entry = await JournalEntry.create({
 *   entryNumber: 'JE-2024-001',
 *   entryDate: new Date(),
 *   entryType: 'standard',
 *   description: 'Payroll expenses',
 *   status: 'draft'
 * });
 * ```
 */
export declare const createJournalEntryHeaderModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        entryNumber: string;
        entryDate: Date;
        postingDate: Date;
        fiscalYear: number;
        fiscalPeriod: number;
        entryType: string;
        source: string;
        reference: string;
        description: string;
        status: string;
        totalDebit: number;
        totalCredit: number;
        isBalanced: boolean;
        isReversing: boolean;
        reversalDate: Date | null;
        originalEntryId: number | null;
        reversedEntryId: number | null;
        batchId: string | null;
        approvedBy: string | null;
        approvedAt: Date | null;
        postedBy: string | null;
        postedAt: Date | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
        readonly createdBy: string;
        readonly updatedBy: string;
    };
};
/**
 * Sequelize model for Journal Entry Lines with account coding.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} JournalEntryLine model
 *
 * @example
 * ```typescript
 * const JournalEntryLine = createJournalEntryLineModel(sequelize);
 * const line = await JournalEntryLine.create({
 *   journalEntryId: 1,
 *   lineNumber: 1,
 *   accountId: 100,
 *   debitAmount: 5000,
 *   creditAmount: 0,
 *   description: 'Payroll expense'
 * });
 * ```
 */
export declare const createJournalEntryLineModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        journalEntryId: number;
        lineNumber: number;
        accountId: number;
        accountCode: string;
        debitAmount: number;
        creditAmount: number;
        description: string;
        dimensions: Record<string, string>;
        projectCode: string | null;
        activityCode: string | null;
        costCenterCode: string | null;
        fundCode: string | null;
        organizationCode: string | null;
        programCode: string | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Creates a new journal entry with validation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateJournalEntryDto} entryData - Journal entry data
 * @param {string} userId - User creating the entry
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created journal entry
 *
 * @example
 * ```typescript
 * const entry = await createJournalEntry(sequelize, {
 *   entryDate: new Date(),
 *   postingDate: new Date(),
 *   entryType: 'standard',
 *   source: 'GL',
 *   reference: 'REF-001',
 *   description: 'Payroll entry',
 *   lines: [...]
 * }, 'user123');
 * ```
 */
export declare const createJournalEntry: (sequelize: Sequelize, entryData: CreateJournalEntryDto, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Updates a journal entry (only if in draft status).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} entryId - Journal entry ID
 * @param {Partial<CreateJournalEntryDto>} updateData - Update data
 * @param {string} userId - User updating the entry
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated journal entry
 *
 * @example
 * ```typescript
 * const updated = await updateJournalEntry(sequelize, 1, {
 *   description: 'Updated description'
 * }, 'user123');
 * ```
 */
export declare const updateJournalEntry: (sequelize: Sequelize, entryId: number, updateData: Partial<CreateJournalEntryDto>, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Deletes a journal entry (only if in draft status).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} entryId - Journal entry ID
 * @param {string} userId - User deleting the entry
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await deleteJournalEntry(sequelize, 1, 'user123');
 * ```
 */
export declare const deleteJournalEntry: (sequelize: Sequelize, entryId: number, userId: string, transaction?: Transaction) => Promise<void>;
/**
 * Validates journal entry before posting.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} entryId - Journal entry ID
 * @returns {Promise<{ valid: boolean; errors: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateJournalEntry(sequelize, 1);
 * if (!validation.valid) {
 *   console.log('Errors:', validation.errors);
 * }
 * ```
 */
export declare const validateJournalEntry: (sequelize: Sequelize, entryId: number) => Promise<{
    valid: boolean;
    errors: string[];
}>;
/**
 * Approves a journal entry for posting.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} entryId - Journal entry ID
 * @param {string} userId - User approving the entry
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await approveJournalEntry(sequelize, 1, 'manager123');
 * ```
 */
export declare const approveJournalEntry: (sequelize: Sequelize, entryId: number, userId: string, transaction?: Transaction) => Promise<void>;
/**
 * Rejects a journal entry.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} entryId - Journal entry ID
 * @param {string} reason - Rejection reason
 * @param {string} userId - User rejecting the entry
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await rejectJournalEntry(sequelize, 1, 'Incorrect account coding', 'manager123');
 * ```
 */
export declare const rejectJournalEntry: (sequelize: Sequelize, entryId: number, reason: string, userId: string, transaction?: Transaction) => Promise<void>;
/**
 * Generates unique journal entry number.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} source - Source system
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<string>} Generated entry number
 *
 * @example
 * ```typescript
 * const entryNumber = await generateJournalEntryNumber(sequelize, 'GL');
 * // Returns: 'JE-GL-2024-00001'
 * ```
 */
export declare const generateJournalEntryNumber: (sequelize: Sequelize, source: string, transaction?: Transaction) => Promise<string>;
/**
 * Retrieves journal entry with lines.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} entryId - Journal entry ID
 * @returns {Promise<any>} Journal entry with lines
 *
 * @example
 * ```typescript
 * const entry = await getJournalEntryWithLines(sequelize, 1);
 * ```
 */
export declare const getJournalEntryWithLines: (sequelize: Sequelize, entryId: number) => Promise<any>;
/**
 * Searches journal entries by criteria.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {object} criteria - Search criteria
 * @returns {Promise<any[]>} Matching journal entries
 *
 * @example
 * ```typescript
 * const entries = await searchJournalEntries(sequelize, {
 *   fiscalYear: 2024,
 *   fiscalPeriod: 1,
 *   status: 'posted'
 * });
 * ```
 */
export declare const searchJournalEntries: (sequelize: Sequelize, criteria: Record<string, any>) => Promise<any[]>;
/**
 * Posts a single journal entry to the general ledger.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} entryId - Journal entry ID
 * @param {string} userId - User posting the entry
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await postJournalEntry(sequelize, 1, 'user123');
 * ```
 */
export declare const postJournalEntry: (sequelize: Sequelize, entryId: number, userId: string, transaction?: Transaction) => Promise<void>;
/**
 * Posts multiple journal entries in a batch.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number[]} entryIds - Array of journal entry IDs
 * @param {string} userId - User posting the batch
 * @returns {Promise<{ batchId: string; posted: number; failed: number; errors: any[] }>} Batch posting result
 *
 * @example
 * ```typescript
 * const result = await batchPostJournalEntries(sequelize, [1, 2, 3], 'user123');
 * ```
 */
export declare const batchPostJournalEntries: (sequelize: Sequelize, entryIds: number[], userId: string) => Promise<{
    batchId: string;
    posted: number;
    failed: number;
    errors: any[];
}>;
/**
 * Updates account balance for journal entry posting.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} accountId - Account ID
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {number} amount - Transaction amount
 * @param {string} type - Transaction type (debit/credit)
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await updateAccountBalanceForPosting(sequelize, 1, 2024, 1, 5000, 'debit');
 * ```
 */
export declare const updateAccountBalanceForPosting: (sequelize: Sequelize, accountId: number, fiscalYear: number, fiscalPeriod: number, amount: number, type: "debit" | "credit", transaction?: Transaction) => Promise<void>;
/**
 * Reverses a posted journal entry.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} entryId - Original journal entry ID
 * @param {Date} reversalDate - Reversal date
 * @param {string} reason - Reversal reason
 * @param {string} userId - User reversing the entry
 * @returns {Promise<any>} Reversal journal entry
 *
 * @example
 * ```typescript
 * const reversalEntry = await reverseJournalEntry(
 *   sequelize, 1, new Date(), 'Correction needed', 'user123'
 * );
 * ```
 */
export declare const reverseJournalEntry: (sequelize: Sequelize, entryId: number, reversalDate: Date, reason: string, userId: string) => Promise<any>;
/**
 * Creates adjusting journal entry.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateJournalEntryDto} entryData - Entry data
 * @param {string} userId - User creating the entry
 * @returns {Promise<any>} Created adjusting entry
 *
 * @example
 * ```typescript
 * const adjusting = await createAdjustingEntry(sequelize, {...}, 'user123');
 * ```
 */
export declare const createAdjustingEntry: (sequelize: Sequelize, entryData: CreateJournalEntryDto, userId: string) => Promise<any>;
/**
 * Creates closing journal entry.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year to close
 * @param {string} userId - User creating the entry
 * @returns {Promise<any>} Created closing entry
 *
 * @example
 * ```typescript
 * const closing = await createClosingEntry(sequelize, 2023, 'user123');
 * ```
 */
export declare const createClosingEntry: (sequelize: Sequelize, fiscalYear: number, userId: string) => Promise<any>;
/**
 * Creates reclassification journal entry.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fromAccountId - Source account ID
 * @param {number} toAccountId - Target account ID
 * @param {number} amount - Reclassification amount
 * @param {string} reason - Reclassification reason
 * @param {string} userId - User creating the entry
 * @returns {Promise<any>} Created reclassification entry
 *
 * @example
 * ```typescript
 * const reclass = await createReclassificationEntry(
 *   sequelize, 100, 200, 5000, 'Correct account coding', 'user123'
 * );
 * ```
 */
export declare const createReclassificationEntry: (sequelize: Sequelize, fromAccountId: number, toAccountId: number, amount: number, reason: string, userId: string) => Promise<any>;
/**
 * Validates posting batch before processing.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number[]} entryIds - Array of entry IDs to validate
 * @returns {Promise<{ valid: boolean; errors: any[] }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validatePostingBatch(sequelize, [1, 2, 3]);
 * ```
 */
export declare const validatePostingBatch: (sequelize: Sequelize, entryIds: number[]) => Promise<{
    valid: boolean;
    errors: any[];
}>;
/**
 * Unpost a journal entry (administrative function).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} entryId - Journal entry ID
 * @param {string} reason - Unpost reason
 * @param {string} userId - User unposting the entry
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await unpostJournalEntry(sequelize, 1, 'Posted to wrong period', 'admin123');
 * ```
 */
export declare const unpostJournalEntry: (sequelize: Sequelize, entryId: number, reason: string, userId: string) => Promise<void>;
/**
 * Generates trial balance for a fiscal period.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {boolean} includeZeroBalances - Include zero balance accounts
 * @returns {Promise<TrialBalanceEntry[]>} Trial balance data
 *
 * @example
 * ```typescript
 * const trialBalance = await generateTrialBalance(sequelize, 2024, 1, false);
 * ```
 */
export declare const generateTrialBalance: (sequelize: Sequelize, fiscalYear: number, fiscalPeriod: number, includeZeroBalances?: boolean) => Promise<TrialBalanceEntry[]>;
/**
 * Generates adjusted trial balance (after adjusting entries).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @returns {Promise<TrialBalanceEntry[]>} Adjusted trial balance
 *
 * @example
 * ```typescript
 * const adjustedTB = await generateAdjustedTrialBalance(sequelize, 2024, 12);
 * ```
 */
export declare const generateAdjustedTrialBalance: (sequelize: Sequelize, fiscalYear: number, fiscalPeriod: number) => Promise<TrialBalanceEntry[]>;
/**
 * Generates post-closing trial balance.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @returns {Promise<TrialBalanceEntry[]>} Post-closing trial balance
 *
 * @example
 * ```typescript
 * const postClosing = await generatePostClosingTrialBalance(sequelize, 2023);
 * ```
 */
export declare const generatePostClosingTrialBalance: (sequelize: Sequelize, fiscalYear: number) => Promise<TrialBalanceEntry[]>;
/**
 * Validates trial balance (debits = credits).
 *
 * @param {TrialBalanceEntry[]} trialBalance - Trial balance entries
 * @returns {{ balanced: boolean; totalDebits: number; totalCredits: number; difference: number }} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateTrialBalance(trialBalanceData);
 * ```
 */
export declare const validateTrialBalance: (trialBalance: TrialBalanceEntry[]) => {
    balanced: boolean;
    totalDebits: number;
    totalCredits: number;
    difference: number;
};
/**
 * Generates general ledger detail report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} accountId - Account ID
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @returns {Promise<any[]>} GL detail transactions
 *
 * @example
 * ```typescript
 * const detail = await generateGLDetailReport(sequelize, 1, 2024, 1);
 * ```
 */
export declare const generateGLDetailReport: (sequelize: Sequelize, accountId: number, fiscalYear: number, fiscalPeriod: number) => Promise<any[]>;
/**
 * Generates account activity summary.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} accountId - Account ID
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<any>} Account activity summary
 *
 * @example
 * ```typescript
 * const summary = await generateAccountActivitySummary(
 *   sequelize, 1, new Date('2024-01-01'), new Date('2024-12-31')
 * );
 * ```
 */
export declare const generateAccountActivitySummary: (sequelize: Sequelize, accountId: number, startDate: Date, endDate: Date) => Promise<any>;
/**
 * Exports trial balance to CSV format.
 *
 * @param {TrialBalanceEntry[]} trialBalance - Trial balance data
 * @returns {string} CSV formatted trial balance
 *
 * @example
 * ```typescript
 * const csv = exportTrialBalanceToCSV(trialBalanceData);
 * ```
 */
export declare const exportTrialBalanceToCSV: (trialBalance: TrialBalanceEntry[]) => string;
/**
 * Generates financial statement data.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} statementType - Statement type (balance_sheet, income_statement)
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @returns {Promise<any>} Financial statement data
 *
 * @example
 * ```typescript
 * const balanceSheet = await generateFinancialStatement(sequelize, 'balance_sheet', 2024, 12);
 * ```
 */
export declare const generateFinancialStatement: (sequelize: Sequelize, statementType: "balance_sheet" | "income_statement", fiscalYear: number, fiscalPeriod: number) => Promise<any>;
/**
 * Generates balance sheet.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @returns {Promise<any>} Balance sheet data
 *
 * @example
 * ```typescript
 * const balanceSheet = await generateBalanceSheet(sequelize, 2024, 12);
 * ```
 */
export declare const generateBalanceSheet: (sequelize: Sequelize, fiscalYear: number, fiscalPeriod: number) => Promise<any>;
/**
 * Generates income statement.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period (or 12 for full year)
 * @returns {Promise<any>} Income statement data
 *
 * @example
 * ```typescript
 * const incomeStatement = await generateIncomeStatement(sequelize, 2024, 12);
 * ```
 */
export declare const generateIncomeStatement: (sequelize: Sequelize, fiscalYear: number, fiscalPeriod: number) => Promise<any>;
/**
 * Initiates period close process.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {string} userId - User initiating close
 * @returns {Promise<PeriodCloseStatus>} Period close status
 *
 * @example
 * ```typescript
 * const closeStatus = await initiatePeriodClose(sequelize, 2024, 1, 'user123');
 * ```
 */
export declare const initiatePeriodClose: (sequelize: Sequelize, fiscalYear: number, fiscalPeriod: number, userId: string) => Promise<PeriodCloseStatus>;
/**
 * Gets period close status and checklist.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @returns {Promise<PeriodCloseStatus>} Period close status
 *
 * @example
 * ```typescript
 * const status = await getPeriodCloseStatus(sequelize, 2024, 1);
 * ```
 */
export declare const getPeriodCloseStatus: (sequelize: Sequelize, fiscalYear: number, fiscalPeriod: number) => Promise<PeriodCloseStatus>;
/**
 * Validates period close readiness.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @returns {Promise<{ ready: boolean; issues: string[] }>} Readiness validation
 *
 * @example
 * ```typescript
 * const validation = await validatePeriodCloseReadiness(sequelize, 2024, 1);
 * ```
 */
export declare const validatePeriodCloseReadiness: (sequelize: Sequelize, fiscalYear: number, fiscalPeriod: number) => Promise<{
    ready: boolean;
    issues: string[];
}>;
/**
 * Completes period close.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {string} userId - User completing close
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await completePeriodClose(sequelize, 2024, 1, 'user123');
 * ```
 */
export declare const completePeriodClose: (sequelize: Sequelize, fiscalYear: number, fiscalPeriod: number, userId: string) => Promise<void>;
/**
 * Reopens a closed period (administrative function).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {string} reason - Reopen reason
 * @param {string} userId - User reopening period
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await reopenPeriod(sequelize, 2024, 1, 'Correction needed', 'admin123');
 * ```
 */
export declare const reopenPeriod: (sequelize: Sequelize, fiscalYear: number, fiscalPeriod: number, reason: string, userId: string) => Promise<void>;
/**
 * Checks if a period is open for posting.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @returns {Promise<boolean>} Whether period is open
 *
 * @example
 * ```typescript
 * const isOpen = await isPeriodOpen(sequelize, 2024, 1);
 * ```
 */
export declare const isPeriodOpen: (sequelize: Sequelize, fiscalYear: number, fiscalPeriod: number) => Promise<boolean>;
/**
 * Locks a period (prevents any changes).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {string} userId - User locking period
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await lockPeriod(sequelize, 2023, 12, 'admin123');
 * ```
 */
export declare const lockPeriod: (sequelize: Sequelize, fiscalYear: number, fiscalPeriod: number, userId: string) => Promise<void>;
/**
 * Creates year-end closing entries.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year to close
 * @param {string} userId - User creating closing entries
 * @returns {Promise<number[]>} Array of created entry IDs
 *
 * @example
 * ```typescript
 * const entryIds = await createYearEndClosingEntries(sequelize, 2023, 'user123');
 * ```
 */
export declare const createYearEndClosingEntries: (sequelize: Sequelize, fiscalYear: number, userId: string) => Promise<number[]>;
/**
 * Processes automatic reversing entries.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} reversalDate - Reversal date
 * @param {string} userId - User processing reversals
 * @returns {Promise<number>} Number of entries reversed
 *
 * @example
 * ```typescript
 * const count = await processAutomaticReversingEntries(sequelize, new Date('2024-01-01'), 'system');
 * ```
 */
export declare const processAutomaticReversingEntries: (sequelize: Sequelize, reversalDate: Date, userId: string) => Promise<number>;
/**
 * Gets fiscal year and period from a date.
 *
 * @param {Date} date - Date to convert
 * @param {number} fiscalYearStartMonth - Fiscal year start month (1-12)
 * @returns {{ fiscalYear: number; fiscalPeriod: number }} Fiscal year and period
 *
 * @example
 * ```typescript
 * const { fiscalYear, fiscalPeriod } = getFiscalYearPeriod(new Date('2024-03-15'));
 * ```
 */
export declare const getFiscalYearPeriod: (date: Date, fiscalYearStartMonth?: number) => {
    fiscalYear: number;
    fiscalPeriod: number;
};
/**
 * Creates audit trail entry.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tableName - Table name
 * @param {number} recordId - Record ID
 * @param {string} action - Action performed
 * @param {string} userId - User ID
 * @param {Record<string, any>} [changes] - Changes made
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await createAuditTrail(sequelize, 'journal_entry_headers', 1, 'POST', 'user123', {...});
 * ```
 */
export declare const createAuditTrail: (sequelize: Sequelize, tableName: string, recordId: number, action: string, userId: string, changes?: Record<string, any>, transaction?: Transaction) => Promise<void>;
/**
 * Validates account coding for transaction.
 *
 * @param {AccountCodingRule} rule - Coding rule
 * @param {Record<string, string>} dimensions - Provided dimensions
 * @returns {boolean} Whether coding is valid
 *
 * @example
 * ```typescript
 * const isValid = validateAccountCoding(rule, { fund: '1000', org: '01' });
 * ```
 */
export declare const validateAccountCoding: (rule: AccountCodingRule, dimensions: Record<string, string>) => boolean;
/**
 * Reconciles general ledger to sub-ledger.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} accountId - GL account ID
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {number} subLedgerBalance - Sub-ledger balance
 * @returns {Promise<LedgerReconciliationItem>} Reconciliation result
 *
 * @example
 * ```typescript
 * const recon = await reconcileGLToSubLedger(sequelize, 1, 2024, 1, 100000);
 * ```
 */
export declare const reconcileGLToSubLedger: (sequelize: Sequelize, accountId: number, fiscalYear: number, fiscalPeriod: number, subLedgerBalance: number) => Promise<LedgerReconciliationItem>;
/**
 * Generates journal entry number sequence.
 *
 * @param {string} prefix - Entry number prefix
 * @param {number} year - Year
 * @param {number} sequenceNumber - Sequence number
 * @returns {string} Formatted entry number
 *
 * @example
 * ```typescript
 * const entryNumber = formatJournalEntryNumber('JE', 2024, 1);
 * // Returns: 'JE-2024-00001'
 * ```
 */
export declare const formatJournalEntryNumber: (prefix: string, year: number, sequenceNumber: number) => string;
/**
 * Default export with all utilities.
 */
declare const _default: {
    createJournalEntryHeaderModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            entryNumber: string;
            entryDate: Date;
            postingDate: Date;
            fiscalYear: number;
            fiscalPeriod: number;
            entryType: string;
            source: string;
            reference: string;
            description: string;
            status: string;
            totalDebit: number;
            totalCredit: number;
            isBalanced: boolean;
            isReversing: boolean;
            reversalDate: Date | null;
            originalEntryId: number | null;
            reversedEntryId: number | null;
            batchId: string | null;
            approvedBy: string | null;
            approvedAt: Date | null;
            postedBy: string | null;
            postedAt: Date | null;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
            readonly createdBy: string;
            readonly updatedBy: string;
        };
    };
    createJournalEntryLineModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            journalEntryId: number;
            lineNumber: number;
            accountId: number;
            accountCode: string;
            debitAmount: number;
            creditAmount: number;
            description: string;
            dimensions: Record<string, string>;
            projectCode: string | null;
            activityCode: string | null;
            costCenterCode: string | null;
            fundCode: string | null;
            organizationCode: string | null;
            programCode: string | null;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createJournalEntry: (sequelize: Sequelize, entryData: CreateJournalEntryDto, userId: string, transaction?: Transaction) => Promise<any>;
    updateJournalEntry: (sequelize: Sequelize, entryId: number, updateData: Partial<CreateJournalEntryDto>, userId: string, transaction?: Transaction) => Promise<any>;
    deleteJournalEntry: (sequelize: Sequelize, entryId: number, userId: string, transaction?: Transaction) => Promise<void>;
    validateJournalEntry: (sequelize: Sequelize, entryId: number) => Promise<{
        valid: boolean;
        errors: string[];
    }>;
    approveJournalEntry: (sequelize: Sequelize, entryId: number, userId: string, transaction?: Transaction) => Promise<void>;
    rejectJournalEntry: (sequelize: Sequelize, entryId: number, reason: string, userId: string, transaction?: Transaction) => Promise<void>;
    generateJournalEntryNumber: (sequelize: Sequelize, source: string, transaction?: Transaction) => Promise<string>;
    getJournalEntryWithLines: (sequelize: Sequelize, entryId: number) => Promise<any>;
    searchJournalEntries: (sequelize: Sequelize, criteria: Record<string, any>) => Promise<any[]>;
    postJournalEntry: (sequelize: Sequelize, entryId: number, userId: string, transaction?: Transaction) => Promise<void>;
    batchPostJournalEntries: (sequelize: Sequelize, entryIds: number[], userId: string) => Promise<{
        batchId: string;
        posted: number;
        failed: number;
        errors: any[];
    }>;
    updateAccountBalanceForPosting: (sequelize: Sequelize, accountId: number, fiscalYear: number, fiscalPeriod: number, amount: number, type: "debit" | "credit", transaction?: Transaction) => Promise<void>;
    reverseJournalEntry: (sequelize: Sequelize, entryId: number, reversalDate: Date, reason: string, userId: string) => Promise<any>;
    createAdjustingEntry: (sequelize: Sequelize, entryData: CreateJournalEntryDto, userId: string) => Promise<any>;
    createClosingEntry: (sequelize: Sequelize, fiscalYear: number, userId: string) => Promise<any>;
    createReclassificationEntry: (sequelize: Sequelize, fromAccountId: number, toAccountId: number, amount: number, reason: string, userId: string) => Promise<any>;
    validatePostingBatch: (sequelize: Sequelize, entryIds: number[]) => Promise<{
        valid: boolean;
        errors: any[];
    }>;
    unpostJournalEntry: (sequelize: Sequelize, entryId: number, reason: string, userId: string) => Promise<void>;
    generateTrialBalance: (sequelize: Sequelize, fiscalYear: number, fiscalPeriod: number, includeZeroBalances?: boolean) => Promise<TrialBalanceEntry[]>;
    generateAdjustedTrialBalance: (sequelize: Sequelize, fiscalYear: number, fiscalPeriod: number) => Promise<TrialBalanceEntry[]>;
    generatePostClosingTrialBalance: (sequelize: Sequelize, fiscalYear: number) => Promise<TrialBalanceEntry[]>;
    validateTrialBalance: (trialBalance: TrialBalanceEntry[]) => {
        balanced: boolean;
        totalDebits: number;
        totalCredits: number;
        difference: number;
    };
    generateGLDetailReport: (sequelize: Sequelize, accountId: number, fiscalYear: number, fiscalPeriod: number) => Promise<any[]>;
    generateAccountActivitySummary: (sequelize: Sequelize, accountId: number, startDate: Date, endDate: Date) => Promise<any>;
    exportTrialBalanceToCSV: (trialBalance: TrialBalanceEntry[]) => string;
    generateFinancialStatement: (sequelize: Sequelize, statementType: "balance_sheet" | "income_statement", fiscalYear: number, fiscalPeriod: number) => Promise<any>;
    generateBalanceSheet: (sequelize: Sequelize, fiscalYear: number, fiscalPeriod: number) => Promise<any>;
    generateIncomeStatement: (sequelize: Sequelize, fiscalYear: number, fiscalPeriod: number) => Promise<any>;
    initiatePeriodClose: (sequelize: Sequelize, fiscalYear: number, fiscalPeriod: number, userId: string) => Promise<PeriodCloseStatus>;
    getPeriodCloseStatus: (sequelize: Sequelize, fiscalYear: number, fiscalPeriod: number) => Promise<PeriodCloseStatus>;
    validatePeriodCloseReadiness: (sequelize: Sequelize, fiscalYear: number, fiscalPeriod: number) => Promise<{
        ready: boolean;
        issues: string[];
    }>;
    completePeriodClose: (sequelize: Sequelize, fiscalYear: number, fiscalPeriod: number, userId: string) => Promise<void>;
    reopenPeriod: (sequelize: Sequelize, fiscalYear: number, fiscalPeriod: number, reason: string, userId: string) => Promise<void>;
    isPeriodOpen: (sequelize: Sequelize, fiscalYear: number, fiscalPeriod: number) => Promise<boolean>;
    lockPeriod: (sequelize: Sequelize, fiscalYear: number, fiscalPeriod: number, userId: string) => Promise<void>;
    createYearEndClosingEntries: (sequelize: Sequelize, fiscalYear: number, userId: string) => Promise<number[]>;
    processAutomaticReversingEntries: (sequelize: Sequelize, reversalDate: Date, userId: string) => Promise<number>;
    getFiscalYearPeriod: (date: Date, fiscalYearStartMonth?: number) => {
        fiscalYear: number;
        fiscalPeriod: number;
    };
    createAuditTrail: (sequelize: Sequelize, tableName: string, recordId: number, action: string, userId: string, changes?: Record<string, any>, transaction?: Transaction) => Promise<void>;
    validateAccountCoding: (rule: AccountCodingRule, dimensions: Record<string, string>) => boolean;
    reconcileGLToSubLedger: (sequelize: Sequelize, accountId: number, fiscalYear: number, fiscalPeriod: number, subLedgerBalance: number) => Promise<LedgerReconciliationItem>;
    formatJournalEntryNumber: (prefix: string, year: number, sequenceNumber: number) => string;
};
export default _default;
//# sourceMappingURL=general-ledger-operations-kit.d.ts.map