/**
 * LOC: BANKREC001
 * File: /reuse/edwards/financial/banking-reconciliation-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (ORM for database operations)
 *   - @nestjs/common (NestJS framework)
 *   - @nestjs/swagger (API documentation)
 *   - ./financial-accounts-management-kit (Account operations)
 *
 * DOWNSTREAM (imported by):
 *   - Backend banking modules
 *   - Cash management services
 *   - Treasury management systems
 *   - Bank reconciliation workflows
 */
/**
 * File: /reuse/edwards/financial/banking-reconciliation-kit.ts
 * Locator: WC-EDWARDS-BANKREC-001
 * Purpose: Comprehensive Banking Reconciliation - Oracle JD Edwards EnterpriseOne-level bank reconciliation, cash positioning, statement import, automated clearing
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, TypeScript 5.x, financial-accounts-management-kit
 * Downstream: ../backend/banking/*, Cash Management Services, Treasury Systems, Reconciliation Workflows
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+
 * Exports: 45 functions for bank accounts, statement import (BAI2/OFX), bank reconciliation, cash positioning, outstanding items, automated clearing, bank feeds
 *
 * LLM Context: Enterprise-grade banking reconciliation for Oracle JD Edwards EnterpriseOne compliance.
 * Provides comprehensive bank account management, automated statement import (BAI2, OFX, CSV formats),
 * intelligent reconciliation matching, cash positioning, outstanding checks/deposits tracking,
 * automated clearing rules, bank feed integration, reconciliation reporting, and audit trails.
 *
 * Database Schema Design:
 * - bank_accounts: Bank account master data with routing numbers, account types, balances
 * - bank_statements: Imported statements with opening/closing balances, statement dates
 * - bank_statement_lines: Individual transactions from bank statements
 * - bank_reconciliation_headers: Reconciliation sessions with status workflow
 * - bank_reconciliation_matches: Matched GL transactions to bank statement lines
 * - outstanding_checks: Uncleared checks register with aging
 * - outstanding_deposits: Deposits in transit tracking
 * - bank_feeds_config: Automated bank feed API configuration (OAuth 2.0)
 * - cash_position: Real-time cash positioning across all accounts
 * - clearing_rules: Automated matching rule engine
 *
 * Indexing Strategy:
 * - Composite indexes: (bank_account_id, statement_date), (reconciliation_id, match_status)
 * - Matching optimization: (bank_account_id, transaction_date, amount) for algorithm performance
 * - Partial indexes: WHERE match_status = 'unmatched' for outstanding items
 * - Covering indexes: Dashboard queries with included columns
 * - GIN indexes: JSON metadata for flexible querying
 *
 * Query Optimization:
 * - Materialized views for cash position summary (refreshed every 5 minutes)
 * - Partitioning bank_statement_lines by month for high-volume accounts
 * - Batch statement import using COPY command (10,000 lines/batch)
 * - Parallel reconciliation matching with connection pooling
 * - Prepared statements for repeated matching queries
 */
import { Sequelize, Transaction } from 'sequelize';
interface BankAccount {
    bankAccountId: number;
    accountNumber: string;
    accountName: string;
    bankName: string;
    bankCode: string;
    routingNumber: string;
    accountType: 'checking' | 'savings' | 'money_market' | 'credit_card' | 'line_of_credit';
    currency: string;
    currentBalance: number;
    availableBalance: number;
    isActive: boolean;
    glAccountId: number;
    glAccountCode: string;
    lastReconciledDate: Date | null;
    lastStatementDate: Date | null;
    metadata: Record<string, any>;
}
interface BankStatement {
    statementId: number;
    bankAccountId: number;
    statementNumber: string;
    statementDate: Date;
    openingBalance: number;
    closingBalance: number;
    totalDebits: number;
    totalCredits: number;
    lineCount: number;
    importDate: Date;
    importedBy: string;
    fileFormat: 'BAI2' | 'OFX' | 'QFX' | 'CSV' | 'MT940';
    fileName: string;
    status: 'imported' | 'processing' | 'reconciled' | 'archived';
}
interface BankStatementLine {
    lineId: number;
    statementId: number;
    bankAccountId: number;
    transactionDate: Date;
    valueDate: Date;
    transactionType: string;
    transactionCode: string;
    description: string;
    referenceNumber: string;
    checkNumber: string | null;
    debitAmount: number;
    creditAmount: number;
    balance: number;
    isMatched: boolean;
    matchedGlTransactionId: number | null;
    metadata: Record<string, any>;
}
interface BankReconciliationHeader {
    reconciliationId: number;
    bankAccountId: number;
    statementId: number;
    reconciliationDate: Date;
    reconciliationType: 'manual' | 'automated' | 'hybrid';
    fiscalYear: number;
    fiscalPeriod: number;
    statementBalance: number;
    glBalance: number;
    variance: number;
    matchedCount: number;
    unmatchedBankCount: number;
    unmatchedGlCount: number;
    status: 'draft' | 'in_progress' | 'balanced' | 'approved' | 'posted';
    reconciledBy: string;
    approvedBy: string | null;
    approvedAt: Date | null;
}
interface BankReconciliationMatch {
    matchId: number;
    reconciliationId: number;
    statementLineId: number;
    glTransactionId: number;
    matchType: 'exact' | 'rule_based' | 'manual' | 'group';
    matchConfidence: number;
    matchDate: Date;
    matchedBy: string;
    isCleared: boolean;
    clearedDate: Date | null;
}
interface OutstandingCheck {
    outstandingId: number;
    bankAccountId: number;
    checkNumber: string;
    checkDate: Date;
    payee: string;
    amount: number;
    glTransactionId: number;
    status: 'outstanding' | 'cleared' | 'void' | 'stale';
    clearedDate: Date | null;
    clearedStatementId: number | null;
    daysOutstanding: number;
    isStale: boolean;
    voidReason: string | null;
}
interface OutstandingDeposit {
    depositId: number;
    bankAccountId: number;
    depositDate: Date;
    depositAmount: number;
    depositType: 'cash' | 'check' | 'wire' | 'ach' | 'other';
    glTransactionId: number;
    status: 'in_transit' | 'cleared' | 'returned';
    clearedDate: Date | null;
    clearedStatementId: number | null;
    daysInTransit: number;
}
interface BankFeedConfig {
    feedConfigId: number;
    bankAccountId: number;
    feedProvider: string;
    feedType: 'api' | 'sftp' | 'email' | 'manual';
    isActive: boolean;
    apiEndpoint: string | null;
    authType: 'oauth2' | 'api_key' | 'basic' | 'certificate';
    credentials: Record<string, any>;
    schedule: string;
    lastSyncDate: Date | null;
    nextSyncDate: Date | null;
    autoReconcile: boolean;
}
interface CashPosition {
    positionId: number;
    positionDate: Date;
    totalCash: number;
    availableCash: number;
    clearedBalance: number;
    outstandingChecks: number;
    depositsInTransit: number;
    projectedBalance: number;
    accountBreakdown: CashPositionAccount[];
}
interface CashPositionAccount {
    bankAccountId: number;
    accountName: string;
    currentBalance: number;
    availableBalance: number;
    outstandingChecks: number;
    depositsInTransit: number;
}
interface ClearingRule {
    ruleId: number;
    ruleName: string;
    ruleType: 'exact_match' | 'amount_tolerance' | 'date_range' | 'pattern_match' | 'group_match';
    priority: number;
    isActive: boolean;
    conditions: Record<string, any>;
    amountTolerance: number;
    dateRangeDays: number;
    matchPattern: string | null;
    autoApprove: boolean;
}
interface ReconciliationDashboard {
    bankAccountId: number;
    accountName: string;
    lastReconciledDate: Date | null;
    daysOutstanding: number;
    unreconciledCount: number;
    unreconciledAmount: number;
    outstandingChecksCount: number;
    outstandingChecksAmount: number;
    depositsInTransitCount: number;
    depositsInTransitAmount: number;
    varianceAmount: number;
    status: 'current' | 'overdue' | 'critical';
}
interface BAI2ParseResult {
    fileHeader: Record<string, any>;
    groupHeaders: Record<string, any>[];
    accountIdentifiers: Record<string, any>[];
    transactions: BankStatementLine[];
    accountTrailers: Record<string, any>[];
    groupTrailers: Record<string, any>[];
    fileTrailer: Record<string, any>;
    parseErrors: string[];
}
export declare class CreateBankAccountDto {
    accountNumber: string;
    accountName: string;
    bankName: string;
    bankCode: string;
    routingNumber: string;
    accountType: string;
    currency: string;
    glAccountCode: string;
}
export declare class ImportBankStatementDto {
    bankAccountId: number;
    fileFormat: string;
    fileContent: string;
    fileName: string;
    autoReconcile?: boolean;
}
export declare class CreateReconciliationDto {
    bankAccountId: number;
    statementId: number;
    reconciliationDate: Date;
    reconciliationType: string;
    reconciledBy: string;
}
export declare class MatchTransactionDto {
    reconciliationId: number;
    statementLineId: number;
    glTransactionId: number;
    matchType: string;
    matchConfidence: number;
}
export declare class CashPositionRequestDto {
    positionDate: Date;
    bankAccountIds?: number[];
    includeProjections?: boolean;
}
export declare class CreateClearingRuleDto {
    ruleName: string;
    ruleType: string;
    priority: number;
    amountTolerance?: number;
    dateRangeDays?: number;
    autoApprove?: boolean;
}
export declare class OutstandingItemsRequestDto {
    bankAccountId: number;
    asOfDate: Date;
    itemType?: string;
    includeStale?: boolean;
}
/**
 * Sequelize model for Bank Accounts with routing and GL mapping.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} BankAccount model
 *
 * @example
 * ```typescript
 * const BankAccount = createBankAccountModel(sequelize);
 * const account = await BankAccount.create({
 *   accountNumber: '123456789',
 *   accountName: 'Operating Account',
 *   bankName: 'Chase Bank',
 *   routingNumber: '021000021',
 *   accountType: 'checking',
 *   currency: 'USD',
 *   glAccountCode: '1010-000'
 * });
 * ```
 */
export declare const createBankAccountModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        accountNumber: string;
        accountName: string;
        bankName: string;
        bankCode: string;
        routingNumber: string;
        accountType: string;
        currency: string;
        currentBalance: number;
        availableBalance: number;
        isActive: boolean;
        glAccountId: number;
        glAccountCode: string;
        lastReconciledDate: Date | null;
        lastStatementDate: Date | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
        readonly createdBy: string;
        readonly updatedBy: string;
    };
};
/**
 * Sequelize model for Bank Statements with opening/closing balances.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} BankStatement model
 */
export declare const createBankStatementModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        bankAccountId: number;
        statementNumber: string;
        statementDate: Date;
        openingBalance: number;
        closingBalance: number;
        totalDebits: number;
        totalCredits: number;
        lineCount: number;
        importDate: Date;
        importedBy: string;
        fileFormat: string;
        fileName: string;
        status: string;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Bank Statement Lines (individual transactions).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} BankStatementLine model
 */
export declare const createBankStatementLineModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        statementId: number;
        bankAccountId: number;
        transactionDate: Date;
        valueDate: Date;
        transactionType: string;
        transactionCode: string;
        description: string;
        referenceNumber: string;
        checkNumber: string | null;
        debitAmount: number;
        creditAmount: number;
        balance: number;
        isMatched: boolean;
        matchedGlTransactionId: number | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
    };
};
/**
 * Sequelize model for Bank Reconciliation Headers.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} BankReconciliationHeader model
 */
export declare const createBankReconciliationHeaderModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        bankAccountId: number;
        statementId: number;
        reconciliationDate: Date;
        reconciliationType: string;
        fiscalYear: number;
        fiscalPeriod: number;
        statementBalance: number;
        glBalance: number;
        variance: number;
        matchedCount: number;
        unmatchedBankCount: number;
        unmatchedGlCount: number;
        status: string;
        reconciledBy: string;
        approvedBy: string | null;
        approvedAt: Date | null;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Bank Reconciliation Matches.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} BankReconciliationMatch model
 */
export declare const createBankReconciliationMatchModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        reconciliationId: number;
        statementLineId: number;
        glTransactionId: number;
        matchType: string;
        matchConfidence: number;
        matchDate: Date;
        matchedBy: string;
        isCleared: boolean;
        clearedDate: Date | null;
        readonly createdAt: Date;
    };
};
/**
 * Sequelize model for Outstanding Checks register.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} OutstandingCheck model
 */
export declare const createOutstandingCheckModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        bankAccountId: number;
        checkNumber: string;
        checkDate: Date;
        payee: string;
        amount: number;
        glTransactionId: number;
        status: string;
        clearedDate: Date | null;
        clearedStatementId: number | null;
        daysOutstanding: number;
        isStale: boolean;
        voidReason: string | null;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Outstanding Deposits (deposits in transit).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} OutstandingDeposit model
 */
export declare const createOutstandingDepositModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        bankAccountId: number;
        depositDate: Date;
        depositAmount: number;
        depositType: string;
        glTransactionId: number;
        status: string;
        clearedDate: Date | null;
        clearedStatementId: number | null;
        daysInTransit: number;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Bank Feed Configuration.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} BankFeedConfig model
 */
export declare const createBankFeedConfigModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        bankAccountId: number;
        feedProvider: string;
        feedType: string;
        isActive: boolean;
        apiEndpoint: string | null;
        authType: string;
        credentials: Record<string, any>;
        schedule: string;
        lastSyncDate: Date | null;
        nextSyncDate: Date | null;
        autoReconcile: boolean;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Clearing Rules (automated matching).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ClearingRule model
 */
export declare const createClearingRuleModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        ruleName: string;
        ruleType: string;
        priority: number;
        isActive: boolean;
        conditions: Record<string, any>;
        amountTolerance: number;
        dateRangeDays: number;
        matchPattern: string | null;
        autoApprove: boolean;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Cash Position snapshots.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CashPosition model
 */
export declare const createCashPositionModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        positionDate: Date;
        totalCash: number;
        availableCash: number;
        clearedBalance: number;
        outstandingChecks: number;
        depositsInTransit: number;
        projectedBalance: number;
        accountBreakdown: Record<string, any>;
        readonly createdAt: Date;
    };
};
/**
 * Create a new bank account with GL mapping.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateBankAccountDto} accountData - Account creation data
 * @param {string} userId - User creating the account
 * @param {Transaction} transaction - Optional Sequelize transaction
 * @returns {Promise<BankAccount>} Created bank account
 *
 * @example
 * ```typescript
 * const account = await createBankAccount(sequelize, {
 *   accountNumber: '123456789',
 *   accountName: 'Operating Account',
 *   bankName: 'Chase Bank',
 *   bankCode: 'CHASE',
 *   routingNumber: '021000021',
 *   accountType: 'checking',
 *   currency: 'USD',
 *   glAccountCode: '1010-000'
 * }, 'user123');
 * ```
 */
export declare function createBankAccount(sequelize: Sequelize, accountData: CreateBankAccountDto, userId: string, transaction?: Transaction): Promise<BankAccount>;
/**
 * Get bank account by ID with current balances.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} bankAccountId - Bank account ID
 * @returns {Promise<BankAccount | null>} Bank account or null
 */
export declare function getBankAccountById(sequelize: Sequelize, bankAccountId: number): Promise<BankAccount | null>;
/**
 * Update bank account balances from latest statement.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} bankAccountId - Bank account ID
 * @param {number} currentBalance - Updated current balance
 * @param {number} availableBalance - Updated available balance
 * @param {Date} statementDate - Statement date
 * @param {string} userId - User performing update
 * @param {Transaction} transaction - Optional Sequelize transaction
 * @returns {Promise<void>}
 */
export declare function updateBankAccountBalance(sequelize: Sequelize, bankAccountId: number, currentBalance: number, availableBalance: number, statementDate: Date, userId: string, transaction?: Transaction): Promise<void>;
/**
 * List all active bank accounts with summary information.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {boolean} includeInactive - Include inactive accounts
 * @returns {Promise<BankAccount[]>} Array of bank accounts
 */
export declare function listBankAccounts(sequelize: Sequelize, includeInactive?: boolean): Promise<BankAccount[]>;
/**
 * Deactivate a bank account (soft delete).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} bankAccountId - Bank account ID
 * @param {string} userId - User deactivating the account
 * @param {Transaction} transaction - Optional Sequelize transaction
 * @returns {Promise<void>}
 */
export declare function deactivateBankAccount(sequelize: Sequelize, bankAccountId: number, userId: string, transaction?: Transaction): Promise<void>;
/**
 * Parse BAI2 file format into structured transactions.
 *
 * @param {string} fileContent - BAI2 file content
 * @returns {Promise<BAI2ParseResult>} Parsed BAI2 data
 *
 * @example
 * ```typescript
 * const parseResult = await parseBAI2File(fileContent);
 * console.log(`Parsed ${parseResult.transactions.length} transactions`);
 * ```
 */
export declare function parseBAI2File(fileContent: string): Promise<BAI2ParseResult>;
/**
 * Parse OFX (Open Financial Exchange) file format.
 *
 * @param {string} fileContent - OFX file content
 * @returns {Promise<BankStatementLine[]>} Parsed transactions
 */
export declare function parseOFXFile(fileContent: string): Promise<BankStatementLine[]>;
/**
 * Import bank statement from file (supports BAI2, OFX, CSV).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {ImportBankStatementDto} importData - Import request data
 * @param {string} userId - User importing statement
 * @param {Transaction} transaction - Optional Sequelize transaction
 * @returns {Promise<BankStatement>} Imported statement
 *
 * @example
 * ```typescript
 * const statement = await importBankStatement(sequelize, {
 *   bankAccountId: 1,
 *   fileFormat: 'BAI2',
 *   fileContent: fileContent,
 *   fileName: 'statement_2024_01.bai',
 *   autoReconcile: true
 * }, 'user123');
 * ```
 */
export declare function importBankStatement(sequelize: Sequelize, importData: ImportBankStatementDto, userId: string, transaction?: Transaction): Promise<BankStatement>;
/**
 * Get bank statement by ID with all lines.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} statementId - Statement ID
 * @returns {Promise<BankStatement & { lines: BankStatementLine[] } | null>} Statement with lines
 */
export declare function getBankStatementById(sequelize: Sequelize, statementId: number): Promise<(BankStatement & {
    lines: BankStatementLine[];
}) | null>;
/**
 * List bank statements for an account with date range filter.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} bankAccountId - Bank account ID
 * @param {Date} startDate - Start date filter
 * @param {Date} endDate - End date filter
 * @returns {Promise<BankStatement[]>} Array of statements
 */
export declare function listBankStatements(sequelize: Sequelize, bankAccountId: number, startDate?: Date, endDate?: Date): Promise<BankStatement[]>;
/**
 * Delete bank statement and all associated lines.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} statementId - Statement ID
 * @param {Transaction} transaction - Optional Sequelize transaction
 * @returns {Promise<void>}
 */
export declare function deleteBankStatement(sequelize: Sequelize, statementId: number, transaction?: Transaction): Promise<void>;
/**
 * Get unmatched bank statement lines for reconciliation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} bankAccountId - Bank account ID
 * @param {Date} startDate - Start date filter
 * @param {Date} endDate - End date filter
 * @returns {Promise<BankStatementLine[]>} Unmatched transactions
 */
export declare function getUnmatchedBankTransactions(sequelize: Sequelize, bankAccountId: number, startDate?: Date, endDate?: Date): Promise<BankStatementLine[]>;
/**
 * Create a new bank reconciliation session.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateReconciliationDto} reconData - Reconciliation data
 * @param {Transaction} transaction - Optional Sequelize transaction
 * @returns {Promise<BankReconciliationHeader>} Created reconciliation
 *
 * @example
 * ```typescript
 * const recon = await createBankReconciliation(sequelize, {
 *   bankAccountId: 1,
 *   statementId: 123,
 *   reconciliationDate: new Date('2024-01-31'),
 *   reconciliationType: 'automated',
 *   reconciledBy: 'user123'
 * });
 * ```
 */
export declare function createBankReconciliation(sequelize: Sequelize, reconData: CreateReconciliationDto, transaction?: Transaction): Promise<BankReconciliationHeader>;
/**
 * Match bank statement line to GL transaction (exact match).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {MatchTransactionDto} matchData - Match data
 * @param {string} userId - User performing match
 * @param {Transaction} transaction - Optional Sequelize transaction
 * @returns {Promise<BankReconciliationMatch>} Created match
 */
export declare function matchBankTransactionToGL(sequelize: Sequelize, matchData: MatchTransactionDto, userId: string, transaction?: Transaction): Promise<BankReconciliationMatch>;
/**
 * Automated reconciliation matching using clearing rules.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} reconciliationId - Reconciliation ID
 * @param {Transaction} transaction - Optional Sequelize transaction
 * @returns {Promise<BankReconciliationMatch[]>} Array of auto-matched items
 *
 * @description
 * Applies clearing rules in priority order to automatically match bank
 * transactions to GL transactions. Uses amount tolerance, date range,
 * and pattern matching strategies.
 */
export declare function executeAutomatedReconciliation(sequelize: Sequelize, reconciliationId: number, transaction?: Transaction): Promise<BankReconciliationMatch[]>;
/**
 * Calculate reconciliation variance and update status.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} reconciliationId - Reconciliation ID
 * @param {Transaction} transaction - Optional Sequelize transaction
 * @returns {Promise<BankReconciliationHeader>} Updated reconciliation
 */
export declare function calculateReconciliationVariance(sequelize: Sequelize, reconciliationId: number, transaction?: Transaction): Promise<BankReconciliationHeader>;
/**
 * Approve and post reconciliation to ledger.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} reconciliationId - Reconciliation ID
 * @param {string} approvedBy - User approving reconciliation
 * @param {Transaction} transaction - Optional Sequelize transaction
 * @returns {Promise<void>}
 */
export declare function approveReconciliation(sequelize: Sequelize, reconciliationId: number, approvedBy: string, transaction?: Transaction): Promise<void>;
/**
 * Get reconciliation summary dashboard.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} bankAccountId - Bank account ID (optional, all if not provided)
 * @returns {Promise<ReconciliationDashboard[]>} Dashboard data
 */
export declare function getReconciliationDashboard(sequelize: Sequelize, bankAccountId?: number): Promise<ReconciliationDashboard[]>;
/**
 * Unmatch a previously matched transaction.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} matchId - Match ID to unmatch
 * @param {Transaction} transaction - Optional Sequelize transaction
 * @returns {Promise<void>}
 */
export declare function unmatchBankTransaction(sequelize: Sequelize, matchId: number, transaction?: Transaction): Promise<void>;
/**
 * Calculate current cash position across all accounts.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CashPositionRequestDto} request - Position request
 * @param {Transaction} transaction - Optional Sequelize transaction
 * @returns {Promise<CashPosition>} Cash position snapshot
 *
 * @example
 * ```typescript
 * const position = await calculateCashPosition(sequelize, {
 *   positionDate: new Date(),
 *   bankAccountIds: [1, 2, 3],
 *   includeProjections: true
 * });
 * console.log(`Total cash: $${position.totalCash}`);
 * ```
 */
export declare function calculateCashPosition(sequelize: Sequelize, request: CashPositionRequestDto, transaction?: Transaction): Promise<CashPosition>;
/**
 * Get cash position history for trending analysis.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<CashPosition[]>} Historical cash positions
 */
export declare function getCashPositionHistory(sequelize: Sequelize, startDate: Date, endDate: Date): Promise<CashPosition[]>;
/**
 * Project future cash position based on outstanding items.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} daysForward - Number of days to project
 * @returns {Promise<{ projectedDate: Date; projectedBalance: number }[]>} Projections
 */
export declare function projectCashPosition(sequelize: Sequelize, daysForward: number): Promise<{
    projectedDate: Date;
    projectedBalance: number;
}[]>;
/**
 * Create outstanding check record.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {OutstandingCheck} checkData - Check data
 * @param {Transaction} transaction - Optional Sequelize transaction
 * @returns {Promise<OutstandingCheck>} Created outstanding check
 */
export declare function createOutstandingCheck(sequelize: Sequelize, checkData: Omit<OutstandingCheck, 'outstandingId' | 'clearedDate' | 'clearedStatementId' | 'daysOutstanding' | 'isStale' | 'voidReason'>, transaction?: Transaction): Promise<OutstandingCheck>;
/**
 * Clear outstanding check (mark as cleared).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} checkId - Outstanding check ID
 * @param {number} statementId - Statement where check cleared
 * @param {Date} clearedDate - Cleared date
 * @param {Transaction} transaction - Optional Sequelize transaction
 * @returns {Promise<void>}
 */
export declare function clearOutstandingCheck(sequelize: Sequelize, checkId: number, statementId: number, clearedDate: Date, transaction?: Transaction): Promise<void>;
/**
 * Get outstanding checks for an account.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {OutstandingItemsRequestDto} request - Request parameters
 * @returns {Promise<OutstandingCheck[]>} Outstanding checks
 */
export declare function getOutstandingChecks(sequelize: Sequelize, request: OutstandingItemsRequestDto): Promise<OutstandingCheck[]>;
/**
 * Mark checks as stale (>180 days outstanding).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} transaction - Optional Sequelize transaction
 * @returns {Promise<number>} Number of checks marked stale
 */
export declare function markStaleChecks(sequelize: Sequelize, transaction?: Transaction): Promise<number>;
/**
 * Void an outstanding check.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} checkId - Outstanding check ID
 * @param {string} voidReason - Reason for voiding
 * @param {Transaction} transaction - Optional Sequelize transaction
 * @returns {Promise<void>}
 */
export declare function voidOutstandingCheck(sequelize: Sequelize, checkId: number, voidReason: string, transaction?: Transaction): Promise<void>;
/**
 * Create outstanding deposit (deposit in transit).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {OutstandingDeposit} depositData - Deposit data
 * @param {Transaction} transaction - Optional Sequelize transaction
 * @returns {Promise<OutstandingDeposit>} Created deposit
 */
export declare function createOutstandingDeposit(sequelize: Sequelize, depositData: Omit<OutstandingDeposit, 'depositId' | 'clearedDate' | 'clearedStatementId' | 'daysInTransit'>, transaction?: Transaction): Promise<OutstandingDeposit>;
/**
 * Clear outstanding deposit.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} depositId - Deposit ID
 * @param {number} statementId - Statement where deposit cleared
 * @param {Date} clearedDate - Cleared date
 * @param {Transaction} transaction - Optional Sequelize transaction
 * @returns {Promise<void>}
 */
export declare function clearOutstandingDeposit(sequelize: Sequelize, depositId: number, statementId: number, clearedDate: Date, transaction?: Transaction): Promise<void>;
/**
 * Get deposits in transit for an account.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {OutstandingItemsRequestDto} request - Request parameters
 * @returns {Promise<OutstandingDeposit[]>} Deposits in transit
 */
export declare function getDepositsInTransit(sequelize: Sequelize, request: OutstandingItemsRequestDto): Promise<OutstandingDeposit[]>;
/**
 * Create automated clearing rule.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateClearingRuleDto} ruleData - Rule data
 * @param {Transaction} transaction - Optional Sequelize transaction
 * @returns {Promise<ClearingRule>} Created rule
 */
export declare function createClearingRule(sequelize: Sequelize, ruleData: CreateClearingRuleDto, transaction?: Transaction): Promise<ClearingRule>;
/**
 * Update clearing rule configuration.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} ruleId - Rule ID
 * @param {Partial<ClearingRule>} updates - Rule updates
 * @param {Transaction} transaction - Optional Sequelize transaction
 * @returns {Promise<void>}
 */
export declare function updateClearingRule(sequelize: Sequelize, ruleId: number, updates: Partial<ClearingRule>, transaction?: Transaction): Promise<void>;
/**
 * Get all clearing rules ordered by priority.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {boolean} activeOnly - Only active rules
 * @returns {Promise<ClearingRule[]>} Clearing rules
 */
export declare function getClearingRules(sequelize: Sequelize, activeOnly?: boolean): Promise<ClearingRule[]>;
/**
 * Deactivate clearing rule.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} ruleId - Rule ID
 * @param {Transaction} transaction - Optional Sequelize transaction
 * @returns {Promise<void>}
 */
export declare function deactivateClearingRule(sequelize: Sequelize, ruleId: number, transaction?: Transaction): Promise<void>;
/**
 * Configure bank feed for automated statement import.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {BankFeedConfig} feedConfig - Feed configuration
 * @param {Transaction} transaction - Optional Sequelize transaction
 * @returns {Promise<BankFeedConfig>} Created feed config
 */
export declare function configureBankFeed(sequelize: Sequelize, feedConfig: Omit<BankFeedConfig, 'feedConfigId' | 'lastSyncDate' | 'nextSyncDate'>, transaction?: Transaction): Promise<BankFeedConfig>;
/**
 * Execute bank feed sync (import latest statement).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} feedConfigId - Feed config ID
 * @param {Transaction} transaction - Optional Sequelize transaction
 * @returns {Promise<BankStatement | null>} Imported statement or null
 */
export declare function executeBankFeedSync(sequelize: Sequelize, feedConfigId: number, transaction?: Transaction): Promise<BankStatement | null>;
/**
 * Get bank feed configuration by account.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} bankAccountId - Bank account ID
 * @returns {Promise<BankFeedConfig | null>} Feed config or null
 */
export declare function getBankFeedConfig(sequelize: Sequelize, bankAccountId: number): Promise<BankFeedConfig | null>;
/**
 * Disable bank feed for an account.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} feedConfigId - Feed config ID
 * @param {Transaction} transaction - Optional Sequelize transaction
 * @returns {Promise<void>}
 */
export declare function disableBankFeed(sequelize: Sequelize, feedConfigId: number, transaction?: Transaction): Promise<void>;
export {};
//# sourceMappingURL=banking-reconciliation-kit.d.ts.map