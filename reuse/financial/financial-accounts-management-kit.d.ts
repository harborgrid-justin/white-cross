/**
 * LOC: FINACCT001
 * File: /reuse/financial/financial-accounts-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (ORM for database operations)
 *   - @nestjs/common (NestJS framework)
 *   - @nestjs/swagger (API documentation)
 *
 * DOWNSTREAM (imported by):
 *   - Backend financial modules
 *   - General ledger services
 *   - Budget management services
 *   - Financial reporting modules
 */
/**
 * File: /reuse/financial/financial-accounts-management-kit.ts
 * Locator: WC-FIN-ACCTMGMT-001
 * Purpose: Comprehensive Financial Accounts Management - USACE CEFMS-level chart of accounts, account hierarchy, balances, reconciliation
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, TypeScript 5.x
 * Downstream: ../backend/financial/*, General Ledger, Budget Management, Financial Reporting
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+
 * Exports: 45+ functions for account management, chart of accounts, account hierarchy, balances, reconciliation, posting rules
 *
 * LLM Context: Enterprise-grade financial accounts management for USACE CEFMS compliance.
 * Provides comprehensive chart of accounts (COA) management, hierarchical account structures, account types,
 * balance tracking, reconciliation workflows, account segments, posting rules, account validation,
 * fund accounting, appropriation tracking, multi-dimensional accounting, account periods, and financial reporting.
 */
import { Sequelize, Transaction } from 'sequelize';
interface AccountSegment {
    segmentNumber: number;
    segmentName: string;
    segmentCode: string;
    segmentValue: string;
    segmentDescription: string;
}
interface AccountStructure {
    fundCode: string;
    organizationCode: string;
    accountCode: string;
    programCode: string;
    projectCode?: string;
    activityCode?: string;
    costCenterCode?: string;
}
interface AccountBalance {
    accountId: number;
    fiscalYear: number;
    fiscalPeriod: number;
    beginningBalance: number;
    debitAmount: number;
    creditAmount: number;
    endingBalance: number;
    encumbranceAmount: number;
    availableBalance: number;
    budgetAmount?: number;
}
interface AccountHierarchy {
    accountId: number;
    parentAccountId: number | null;
    level: number;
    path: string;
    children: AccountHierarchy[];
    rollupBalance: number;
}
interface ReconciliationItem {
    itemId: string;
    accountId: number;
    reconciliationDate: Date;
    sourceAmount: number;
    ledgerAmount: number;
    differenceAmount: number;
    status: 'pending' | 'matched' | 'exception' | 'resolved';
    notes?: string;
}
interface PostingRule {
    ruleId: number;
    accountType: string;
    normalBalance: 'debit' | 'credit';
    allowDebit: boolean;
    allowCredit: boolean;
    requiresApproval: boolean;
    requiresJustification: boolean;
    validTransactionTypes: string[];
}
interface ChartOfAccountsConfig {
    segmentStructure: AccountSegment[];
    segmentDelimiter: string;
    accountFormat: string;
    validationRules: string[];
    fiscalYearStartMonth: number;
}
interface FundAccountingRule {
    fundType: string;
    appropriationType: string;
    expirationRule: 'annual' | 'multi-year' | 'no-year';
    carryoverAllowed: boolean;
    requiresObligation: boolean;
}
interface AccountDimension {
    dimensionName: string;
    dimensionValue: string;
    dimensionType: 'fund' | 'organization' | 'program' | 'project' | 'activity' | 'custom';
    isRequired: boolean;
    validValues?: string[];
}
export declare class CreateAccountDto {
    accountCode: string;
    accountName: string;
    accountType: string;
    parentAccountId?: number;
    description?: string;
    normalBalance: 'debit' | 'credit';
    isActive: boolean;
}
export declare class AccountBalanceDto {
    accountId: number;
    fiscalYear: number;
    fiscalPeriod: number;
    beginningBalance: number;
    endingBalance: number;
    availableBalance: number;
}
/**
 * Sequelize model for Chart of Accounts with hierarchical structure and segment support.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ChartOfAccounts model
 *
 * @example
 * ```typescript
 * const ChartOfAccounts = createChartOfAccountsModel(sequelize);
 * const account = await ChartOfAccounts.create({
 *   accountCode: '1000-01-001',
 *   accountName: 'Cash - Operating',
 *   accountType: 'ASSET',
 *   normalBalance: 'debit',
 *   isActive: true
 * });
 * ```
 */
export declare const createChartOfAccountsModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        accountCode: string;
        accountName: string;
        accountType: string;
        accountCategory: string;
        parentAccountId: number | null;
        normalBalance: string;
        level: number;
        path: string;
        segments: AccountSegment[];
        structure: AccountStructure;
        isActive: boolean;
        isSystemAccount: boolean;
        requiresProject: boolean;
        requiresActivity: boolean;
        allowDirectPosting: boolean;
        description: string | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
        readonly createdBy: string;
        readonly updatedBy: string;
    };
};
/**
 * Sequelize model for Account Balances with period tracking and encumbrances.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} AccountBalance model
 *
 * @example
 * ```typescript
 * const AccountBalance = createAccountBalanceModel(sequelize);
 * const balance = await AccountBalance.create({
 *   accountId: 1,
 *   fiscalYear: 2024,
 *   fiscalPeriod: 1,
 *   beginningBalance: 100000.00,
 *   debitAmount: 50000.00,
 *   creditAmount: 25000.00
 * });
 * ```
 */
export declare const createAccountBalanceModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        accountId: number;
        fiscalYear: number;
        fiscalPeriod: number;
        beginningBalance: number;
        debitAmount: number;
        creditAmount: number;
        endingBalance: number;
        encumbranceAmount: number;
        preEncumbranceAmount: number;
        obligationAmount: number;
        expenditureAmount: number;
        budgetAmount: number;
        availableBalance: number;
        lastReconciliationDate: Date | null;
        reconciliationStatus: string;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Creates a new account in the chart of accounts with hierarchy support.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateAccountDto} accountData - Account creation data
 * @param {string} userId - User creating the account
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created account
 *
 * @example
 * ```typescript
 * const account = await createAccount(sequelize, {
 *   accountCode: '1000-01-001',
 *   accountName: 'Cash - Operating',
 *   accountType: 'ASSET',
 *   normalBalance: 'debit',
 *   isActive: true
 * }, 'user123');
 * ```
 */
export declare const createAccount: (sequelize: Sequelize, accountData: CreateAccountDto, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Updates an existing account in the chart of accounts.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} accountId - Account ID to update
 * @param {Partial<CreateAccountDto>} updateData - Update data
 * @param {string} userId - User updating the account
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated account
 *
 * @example
 * ```typescript
 * const updated = await updateAccount(sequelize, 1, {
 *   accountName: 'Cash - Operating Account',
 *   description: 'Updated description'
 * }, 'user123');
 * ```
 */
export declare const updateAccount: (sequelize: Sequelize, accountId: number, updateData: Partial<CreateAccountDto>, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Deactivates an account (soft delete).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} accountId - Account ID to deactivate
 * @param {string} userId - User deactivating the account
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await deactivateAccount(sequelize, 123, 'user123');
 * ```
 */
export declare const deactivateAccount: (sequelize: Sequelize, accountId: number, userId: string, transaction?: Transaction) => Promise<void>;
/**
 * Retrieves account by account code.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} accountCode - Account code
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Account or null
 *
 * @example
 * ```typescript
 * const account = await getAccountByCode(sequelize, '1000-01-001');
 * ```
 */
export declare const getAccountByCode: (sequelize: Sequelize, accountCode: string, transaction?: Transaction) => Promise<any>;
/**
 * Retrieves all accounts of a specific type.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} accountType - Account type (ASSET, LIABILITY, etc.)
 * @param {boolean} activeOnly - Return only active accounts
 * @returns {Promise<any[]>} Array of accounts
 *
 * @example
 * ```typescript
 * const assets = await getAccountsByType(sequelize, 'ASSET', true);
 * ```
 */
export declare const getAccountsByType: (sequelize: Sequelize, accountType: string, activeOnly?: boolean) => Promise<any[]>;
/**
 * Validates account code format according to USACE CEFMS structure.
 *
 * @param {string} accountCode - Account code to validate
 * @param {ChartOfAccountsConfig} config - COA configuration
 * @returns {boolean} Whether account code is valid
 *
 * @example
 * ```typescript
 * const isValid = validateAccountCodeFormat('1000-01-001', coaConfig);
 * ```
 */
export declare const validateAccountCodeFormat: (accountCode: string, config: ChartOfAccountsConfig) => boolean;
/**
 * Parses account code into segments.
 *
 * @param {string} accountCode - Account code to parse
 * @param {string} delimiter - Segment delimiter
 * @returns {AccountSegment[]} Array of account segments
 *
 * @example
 * ```typescript
 * const segments = parseAccountSegments('1000-01-001', '-');
 * // Returns: [{ segmentNumber: 1, segmentCode: '1000', ... }, ...]
 * ```
 */
export declare const parseAccountSegments: (accountCode: string, delimiter?: string) => AccountSegment[];
/**
 * Parses account code into structured components (fund, org, account, etc.).
 *
 * @param {string} accountCode - Account code to parse
 * @returns {AccountStructure} Account structure
 *
 * @example
 * ```typescript
 * const structure = parseAccountStructure('1000-01-5001-AB-P123');
 * // Returns: { fundCode: '1000', organizationCode: '01', ... }
 * ```
 */
export declare const parseAccountStructure: (accountCode: string) => AccountStructure;
/**
 * Validates account posting rules for transaction.
 *
 * @param {any} account - Account object
 * @param {string} transactionType - Transaction type (debit/credit)
 * @param {PostingRule} postingRules - Posting rules configuration
 * @returns {boolean} Whether posting is allowed
 *
 * @example
 * ```typescript
 * const canPost = validateAccountPostingRules(account, 'debit', rules);
 * ```
 */
export declare const validateAccountPostingRules: (account: any, transactionType: "debit" | "credit", postingRules: PostingRule) => boolean;
/**
 * Builds complete account hierarchy tree.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number | null} parentId - Parent account ID (null for root)
 * @returns {Promise<AccountHierarchy[]>} Account hierarchy tree
 *
 * @example
 * ```typescript
 * const hierarchy = await buildAccountHierarchy(sequelize, null);
 * ```
 */
export declare const buildAccountHierarchy: (sequelize: Sequelize, parentId?: number | null) => Promise<AccountHierarchy[]>;
/**
 * Gets all parent accounts for a given account (breadcrumb trail).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} accountId - Account ID
 * @returns {Promise<any[]>} Array of parent accounts
 *
 * @example
 * ```typescript
 * const parents = await getAccountParents(sequelize, 123);
 * ```
 */
export declare const getAccountParents: (sequelize: Sequelize, accountId: number) => Promise<any[]>;
/**
 * Gets all child accounts for a given account.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} parentId - Parent account ID
 * @param {boolean} recursive - Include all descendants
 * @returns {Promise<any[]>} Array of child accounts
 *
 * @example
 * ```typescript
 * const children = await getAccountChildren(sequelize, 1, true);
 * ```
 */
export declare const getAccountChildren: (sequelize: Sequelize, parentId: number, recursive?: boolean) => Promise<any[]>;
/**
 * Moves account to a new parent in the hierarchy.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} accountId - Account ID to move
 * @param {number | null} newParentId - New parent account ID
 * @param {string} userId - User performing the move
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await moveAccountInHierarchy(sequelize, 123, 456, 'user123');
 * ```
 */
export declare const moveAccountInHierarchy: (sequelize: Sequelize, accountId: number, newParentId: number | null, userId: string, transaction?: Transaction) => Promise<void>;
/**
 * Updates path for all descendant accounts after hierarchy change.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} parentId - Parent account ID
 * @param {string} newParentPath - New parent path
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await updateDescendantPaths(sequelize, 123, '/1/5/123');
 * ```
 */
export declare const updateDescendantPaths: (sequelize: Sequelize, parentId: number, newParentPath: string, transaction?: Transaction) => Promise<void>;
/**
 * Creates or updates account balance for a period.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {AccountBalance} balanceData - Balance data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Account balance record
 *
 * @example
 * ```typescript
 * const balance = await createOrUpdateAccountBalance(sequelize, {
 *   accountId: 1,
 *   fiscalYear: 2024,
 *   fiscalPeriod: 1,
 *   beginningBalance: 100000,
 *   debitAmount: 50000,
 *   creditAmount: 25000
 * });
 * ```
 */
export declare const createOrUpdateAccountBalance: (sequelize: Sequelize, balanceData: AccountBalance, transaction?: Transaction) => Promise<any>;
/**
 * Retrieves account balance for a specific period.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} accountId - Account ID
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @returns {Promise<any>} Account balance or null
 *
 * @example
 * ```typescript
 * const balance = await getAccountBalance(sequelize, 1, 2024, 1);
 * ```
 */
export declare const getAccountBalance: (sequelize: Sequelize, accountId: number, fiscalYear: number, fiscalPeriod: number) => Promise<any>;
/**
 * Calculates year-to-date balance for an account.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} accountId - Account ID
 * @param {number} fiscalYear - Fiscal year
 * @param {number} throughPeriod - Through fiscal period
 * @returns {Promise<number>} YTD balance
 *
 * @example
 * ```typescript
 * const ytdBalance = await getAccountYTDBalance(sequelize, 1, 2024, 6);
 * ```
 */
export declare const getAccountYTDBalance: (sequelize: Sequelize, accountId: number, fiscalYear: number, throughPeriod: number) => Promise<number>;
/**
 * Posts transaction amount to account balance.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} accountId - Account ID
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {number} amount - Transaction amount
 * @param {string} type - Transaction type (debit/credit)
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated balance
 *
 * @example
 * ```typescript
 * await postToAccountBalance(sequelize, 1, 2024, 1, 5000, 'debit');
 * ```
 */
export declare const postToAccountBalance: (sequelize: Sequelize, accountId: number, fiscalYear: number, fiscalPeriod: number, amount: number, type: "debit" | "credit", transaction?: Transaction) => Promise<any>;
/**
 * Calculates available balance (ending balance minus encumbrances).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} accountId - Account ID
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @returns {Promise<number>} Available balance
 *
 * @example
 * ```typescript
 * const available = await calculateAvailableBalance(sequelize, 1, 2024, 1);
 * ```
 */
export declare const calculateAvailableBalance: (sequelize: Sequelize, accountId: number, fiscalYear: number, fiscalPeriod: number) => Promise<number>;
/**
 * Updates encumbrance amount for account balance.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} accountId - Account ID
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {number} amount - Encumbrance amount
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await updateEncumbranceAmount(sequelize, 1, 2024, 1, 10000);
 * ```
 */
export declare const updateEncumbranceAmount: (sequelize: Sequelize, accountId: number, fiscalYear: number, fiscalPeriod: number, amount: number, transaction?: Transaction) => Promise<void>;
/**
 * Carries forward account balances to new fiscal year.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fromYear - Source fiscal year
 * @param {number} toYear - Target fiscal year
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Number of balances carried forward
 *
 * @example
 * ```typescript
 * const count = await carryForwardBalances(sequelize, 2023, 2024);
 * ```
 */
export declare const carryForwardBalances: (sequelize: Sequelize, fromYear: number, toYear: number, transaction?: Transaction) => Promise<number>;
/**
 * Rolls up balances from child accounts to parent account.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} parentAccountId - Parent account ID
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @returns {Promise<number>} Rolled up balance
 *
 * @example
 * ```typescript
 * const rollup = await rollupChildBalances(sequelize, 1, 2024, 1);
 * ```
 */
export declare const rollupChildBalances: (sequelize: Sequelize, parentAccountId: number, fiscalYear: number, fiscalPeriod: number) => Promise<number>;
/**
 * Validates account balance integrity (debits = credits).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @returns {Promise<boolean>} Whether balances are in balance
 *
 * @example
 * ```typescript
 * const isBalanced = await validateBalanceIntegrity(sequelize, 2024, 1);
 * ```
 */
export declare const validateBalanceIntegrity: (sequelize: Sequelize, fiscalYear: number, fiscalPeriod: number) => Promise<boolean>;
/**
 * Retrieves trial balance for a fiscal period.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @returns {Promise<any[]>} Trial balance data
 *
 * @example
 * ```typescript
 * const trialBalance = await getTrialBalance(sequelize, 2024, 1);
 * ```
 */
export declare const getTrialBalance: (sequelize: Sequelize, fiscalYear: number, fiscalPeriod: number) => Promise<any[]>;
/**
 * Creates reconciliation record for account.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {ReconciliationItem} reconciliationData - Reconciliation data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created reconciliation record
 *
 * @example
 * ```typescript
 * const recon = await createAccountReconciliation(sequelize, {
 *   itemId: 'REC-001',
 *   accountId: 1,
 *   reconciliationDate: new Date(),
 *   sourceAmount: 100000,
 *   ledgerAmount: 99950,
 *   differenceAmount: 50,
 *   status: 'exception'
 * });
 * ```
 */
export declare const createAccountReconciliation: (sequelize: Sequelize, reconciliationData: ReconciliationItem, transaction?: Transaction) => Promise<any>;
/**
 * Marks account as reconciled for a period.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} accountId - Account ID
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {string} userId - User performing reconciliation
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await markAccountReconciled(sequelize, 1, 2024, 1, 'user123');
 * ```
 */
export declare const markAccountReconciled: (sequelize: Sequelize, accountId: number, fiscalYear: number, fiscalPeriod: number, userId: string, transaction?: Transaction) => Promise<void>;
/**
 * Finds reconciliation exceptions for account.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} accountId - Account ID
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<any[]>} Reconciliation exceptions
 *
 * @example
 * ```typescript
 * const exceptions = await findReconciliationExceptions(
 *   sequelize, 1, new Date('2024-01-01'), new Date('2024-01-31')
 * );
 * ```
 */
export declare const findReconciliationExceptions: (sequelize: Sequelize, accountId: number, startDate: Date, endDate: Date) => Promise<any[]>;
/**
 * Resolves reconciliation exception.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} itemId - Reconciliation item ID
 * @param {string} resolution - Resolution notes
 * @param {string} userId - User resolving exception
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await resolveReconciliationException(sequelize, 'REC-001', 'Timing difference', 'user123');
 * ```
 */
export declare const resolveReconciliationException: (sequelize: Sequelize, itemId: string, resolution: string, userId: string, transaction?: Transaction) => Promise<void>;
/**
 * Compares account balance to external system balance.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} accountId - Account ID
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {number} externalBalance - External system balance
 * @returns {Promise<{ matched: boolean; difference: number }>} Comparison result
 *
 * @example
 * ```typescript
 * const result = await compareToExternalBalance(sequelize, 1, 2024, 1, 100000);
 * ```
 */
export declare const compareToExternalBalance: (sequelize: Sequelize, accountId: number, fiscalYear: number, fiscalPeriod: number, externalBalance: number) => Promise<{
    matched: boolean;
    difference: number;
}>;
/**
 * Generates reconciliation report for account.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} accountId - Account ID
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @returns {Promise<any>} Reconciliation report
 *
 * @example
 * ```typescript
 * const report = await generateReconciliationReport(sequelize, 1, 2024, 1);
 * ```
 */
export declare const generateReconciliationReport: (sequelize: Sequelize, accountId: number, fiscalYear: number, fiscalPeriod: number) => Promise<any>;
/**
 * Auto-reconciles accounts with matching balances.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {number} tolerance - Tolerance for match (default 0.01)
 * @returns {Promise<number>} Number of auto-reconciled accounts
 *
 * @example
 * ```typescript
 * const count = await autoReconcileAccounts(sequelize, 2024, 1, 0.01);
 * ```
 */
export declare const autoReconcileAccounts: (sequelize: Sequelize, fiscalYear: number, fiscalPeriod: number, tolerance?: number) => Promise<number>;
/**
 * Flags account for manual reconciliation review.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} accountId - Account ID
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {string} reason - Reason for flagging
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await flagAccountForReview(sequelize, 1, 2024, 1, 'Large variance detected');
 * ```
 */
export declare const flagAccountForReview: (sequelize: Sequelize, accountId: number, fiscalYear: number, fiscalPeriod: number, reason: string, transaction?: Transaction) => Promise<void>;
/**
 * Clears reconciliation flags for account.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} accountId - Account ID
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {string} userId - User clearing flags
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await clearReconciliationFlags(sequelize, 1, 2024, 1, 'user123');
 * ```
 */
export declare const clearReconciliationFlags: (sequelize: Sequelize, accountId: number, fiscalYear: number, fiscalPeriod: number, userId: string, transaction?: Transaction) => Promise<void>;
/**
 * Validates account dimensions for transaction.
 *
 * @param {AccountDimension[]} dimensions - Account dimensions
 * @param {Record<string, string>} providedValues - Provided dimension values
 * @returns {boolean} Whether dimensions are valid
 *
 * @example
 * ```typescript
 * const isValid = validateAccountDimensions(dimensions, {
 *   fund: '1000',
 *   organization: '01',
 *   program: 'AB'
 * });
 * ```
 */
export declare const validateAccountDimensions: (dimensions: AccountDimension[], providedValues: Record<string, string>) => boolean;
/**
 * Applies fund accounting rules to account.
 *
 * @param {FundAccountingRule} rule - Fund accounting rule
 * @param {number} fiscalYear - Fiscal year
 * @param {Date} transactionDate - Transaction date
 * @returns {boolean} Whether transaction is allowed
 *
 * @example
 * ```typescript
 * const allowed = applyFundAccountingRules(rule, 2024, new Date('2024-06-15'));
 * ```
 */
export declare const applyFundAccountingRules: (rule: FundAccountingRule, fiscalYear: number, transactionDate: Date) => boolean;
/**
 * Checks fund availability for appropriation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} accountId - Account ID
 * @param {number} fiscalYear - Fiscal year
 * @param {number} requestedAmount - Requested amount
 * @returns {Promise<{ available: boolean; remainingBalance: number }>} Availability check
 *
 * @example
 * ```typescript
 * const check = await checkFundAvailability(sequelize, 1, 2024, 50000);
 * ```
 */
export declare const checkFundAvailability: (sequelize: Sequelize, accountId: number, fiscalYear: number, requestedAmount: number) => Promise<{
    available: boolean;
    remainingBalance: number;
}>;
/**
 * Records obligation against appropriation account.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} accountId - Account ID
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {number} amount - Obligation amount
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await recordObligation(sequelize, 1, 2024, 1, 25000);
 * ```
 */
export declare const recordObligation: (sequelize: Sequelize, accountId: number, fiscalYear: number, fiscalPeriod: number, amount: number, transaction?: Transaction) => Promise<void>;
/**
 * Liquidates obligation and records expenditure.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} accountId - Account ID
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {number} amount - Expenditure amount
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await liquidateObligation(sequelize, 1, 2024, 1, 25000);
 * ```
 */
export declare const liquidateObligation: (sequelize: Sequelize, accountId: number, fiscalYear: number, fiscalPeriod: number, amount: number, transaction?: Transaction) => Promise<void>;
/**
 * Calculates unliquidated obligations for account.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} accountId - Account ID
 * @param {number} fiscalYear - Fiscal year
 * @returns {Promise<number>} Unliquidated obligation amount
 *
 * @example
 * ```typescript
 * const unliquidated = await calculateUnliquidatedObligations(sequelize, 1, 2024);
 * ```
 */
export declare const calculateUnliquidatedObligations: (sequelize: Sequelize, accountId: number, fiscalYear: number) => Promise<number>;
/**
 * Processes year-end closing for appropriation accounts.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year to close
 * @param {FundAccountingRule} rule - Fund accounting rule
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<{ closed: number; carriedForward: number }>} Closing results
 *
 * @example
 * ```typescript
 * const result = await processYearEndClosing(sequelize, 2023, fundRule);
 * ```
 */
export declare const processYearEndClosing: (sequelize: Sequelize, fiscalYear: number, rule: FundAccountingRule, transaction?: Transaction) => Promise<{
    closed: number;
    carriedForward: number;
}>;
/**
 * Validates appropriation authority for account.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} accountId - Account ID
 * @param {number} fiscalYear - Fiscal year
 * @param {number} requestedAmount - Requested amount
 * @returns {Promise<boolean>} Whether authority is sufficient
 *
 * @example
 * ```typescript
 * const hasAuthority = await validateAppropriationAuthority(sequelize, 1, 2024, 100000);
 * ```
 */
export declare const validateAppropriationAuthority: (sequelize: Sequelize, accountId: number, fiscalYear: number, requestedAmount: number) => Promise<boolean>;
/**
 * Generates fund status report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} fundCode - Fund code
 * @param {number} fiscalYear - Fiscal year
 * @returns {Promise<any>} Fund status report
 *
 * @example
 * ```typescript
 * const report = await generateFundStatusReport(sequelize, '1000', 2024);
 * ```
 */
export declare const generateFundStatusReport: (sequelize: Sequelize, fundCode: string, fiscalYear: number) => Promise<any>;
/**
 * Exports fund accounting data to USACE CEFMS format.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} fundCode - Fund code
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @returns {Promise<any>} CEFMS export data
 *
 * @example
 * ```typescript
 * const exportData = await exportToCEFMSFormat(sequelize, '1000', 2024, 12);
 * ```
 */
export declare const exportToCEFMSFormat: (sequelize: Sequelize, fundCode: string, fiscalYear: number, fiscalPeriod: number) => Promise<any>;
/**
 * Default export with all utilities.
 */
declare const _default: {
    createChartOfAccountsModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            accountCode: string;
            accountName: string;
            accountType: string;
            accountCategory: string;
            parentAccountId: number | null;
            normalBalance: string;
            level: number;
            path: string;
            segments: AccountSegment[];
            structure: AccountStructure;
            isActive: boolean;
            isSystemAccount: boolean;
            requiresProject: boolean;
            requiresActivity: boolean;
            allowDirectPosting: boolean;
            description: string | null;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
            readonly createdBy: string;
            readonly updatedBy: string;
        };
    };
    createAccountBalanceModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            accountId: number;
            fiscalYear: number;
            fiscalPeriod: number;
            beginningBalance: number;
            debitAmount: number;
            creditAmount: number;
            endingBalance: number;
            encumbranceAmount: number;
            preEncumbranceAmount: number;
            obligationAmount: number;
            expenditureAmount: number;
            budgetAmount: number;
            availableBalance: number;
            lastReconciliationDate: Date | null;
            reconciliationStatus: string;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createAccount: (sequelize: Sequelize, accountData: CreateAccountDto, userId: string, transaction?: Transaction) => Promise<any>;
    updateAccount: (sequelize: Sequelize, accountId: number, updateData: Partial<CreateAccountDto>, userId: string, transaction?: Transaction) => Promise<any>;
    deactivateAccount: (sequelize: Sequelize, accountId: number, userId: string, transaction?: Transaction) => Promise<void>;
    getAccountByCode: (sequelize: Sequelize, accountCode: string, transaction?: Transaction) => Promise<any>;
    getAccountsByType: (sequelize: Sequelize, accountType: string, activeOnly?: boolean) => Promise<any[]>;
    validateAccountCodeFormat: (accountCode: string, config: ChartOfAccountsConfig) => boolean;
    parseAccountSegments: (accountCode: string, delimiter?: string) => AccountSegment[];
    parseAccountStructure: (accountCode: string) => AccountStructure;
    validateAccountPostingRules: (account: any, transactionType: "debit" | "credit", postingRules: PostingRule) => boolean;
    buildAccountHierarchy: (sequelize: Sequelize, parentId?: number | null) => Promise<AccountHierarchy[]>;
    getAccountParents: (sequelize: Sequelize, accountId: number) => Promise<any[]>;
    getAccountChildren: (sequelize: Sequelize, parentId: number, recursive?: boolean) => Promise<any[]>;
    moveAccountInHierarchy: (sequelize: Sequelize, accountId: number, newParentId: number | null, userId: string, transaction?: Transaction) => Promise<void>;
    updateDescendantPaths: (sequelize: Sequelize, parentId: number, newParentPath: string, transaction?: Transaction) => Promise<void>;
    createOrUpdateAccountBalance: (sequelize: Sequelize, balanceData: AccountBalance, transaction?: Transaction) => Promise<any>;
    getAccountBalance: (sequelize: Sequelize, accountId: number, fiscalYear: number, fiscalPeriod: number) => Promise<any>;
    getAccountYTDBalance: (sequelize: Sequelize, accountId: number, fiscalYear: number, throughPeriod: number) => Promise<number>;
    postToAccountBalance: (sequelize: Sequelize, accountId: number, fiscalYear: number, fiscalPeriod: number, amount: number, type: "debit" | "credit", transaction?: Transaction) => Promise<any>;
    calculateAvailableBalance: (sequelize: Sequelize, accountId: number, fiscalYear: number, fiscalPeriod: number) => Promise<number>;
    updateEncumbranceAmount: (sequelize: Sequelize, accountId: number, fiscalYear: number, fiscalPeriod: number, amount: number, transaction?: Transaction) => Promise<void>;
    carryForwardBalances: (sequelize: Sequelize, fromYear: number, toYear: number, transaction?: Transaction) => Promise<number>;
    rollupChildBalances: (sequelize: Sequelize, parentAccountId: number, fiscalYear: number, fiscalPeriod: number) => Promise<number>;
    validateBalanceIntegrity: (sequelize: Sequelize, fiscalYear: number, fiscalPeriod: number) => Promise<boolean>;
    getTrialBalance: (sequelize: Sequelize, fiscalYear: number, fiscalPeriod: number) => Promise<any[]>;
    createAccountReconciliation: (sequelize: Sequelize, reconciliationData: ReconciliationItem, transaction?: Transaction) => Promise<any>;
    markAccountReconciled: (sequelize: Sequelize, accountId: number, fiscalYear: number, fiscalPeriod: number, userId: string, transaction?: Transaction) => Promise<void>;
    findReconciliationExceptions: (sequelize: Sequelize, accountId: number, startDate: Date, endDate: Date) => Promise<any[]>;
    resolveReconciliationException: (sequelize: Sequelize, itemId: string, resolution: string, userId: string, transaction?: Transaction) => Promise<void>;
    compareToExternalBalance: (sequelize: Sequelize, accountId: number, fiscalYear: number, fiscalPeriod: number, externalBalance: number) => Promise<{
        matched: boolean;
        difference: number;
    }>;
    generateReconciliationReport: (sequelize: Sequelize, accountId: number, fiscalYear: number, fiscalPeriod: number) => Promise<any>;
    autoReconcileAccounts: (sequelize: Sequelize, fiscalYear: number, fiscalPeriod: number, tolerance?: number) => Promise<number>;
    flagAccountForReview: (sequelize: Sequelize, accountId: number, fiscalYear: number, fiscalPeriod: number, reason: string, transaction?: Transaction) => Promise<void>;
    clearReconciliationFlags: (sequelize: Sequelize, accountId: number, fiscalYear: number, fiscalPeriod: number, userId: string, transaction?: Transaction) => Promise<void>;
    validateAccountDimensions: (dimensions: AccountDimension[], providedValues: Record<string, string>) => boolean;
    applyFundAccountingRules: (rule: FundAccountingRule, fiscalYear: number, transactionDate: Date) => boolean;
    checkFundAvailability: (sequelize: Sequelize, accountId: number, fiscalYear: number, requestedAmount: number) => Promise<{
        available: boolean;
        remainingBalance: number;
    }>;
    recordObligation: (sequelize: Sequelize, accountId: number, fiscalYear: number, fiscalPeriod: number, amount: number, transaction?: Transaction) => Promise<void>;
    liquidateObligation: (sequelize: Sequelize, accountId: number, fiscalYear: number, fiscalPeriod: number, amount: number, transaction?: Transaction) => Promise<void>;
    calculateUnliquidatedObligations: (sequelize: Sequelize, accountId: number, fiscalYear: number) => Promise<number>;
    processYearEndClosing: (sequelize: Sequelize, fiscalYear: number, rule: FundAccountingRule, transaction?: Transaction) => Promise<{
        closed: number;
        carriedForward: number;
    }>;
    validateAppropriationAuthority: (sequelize: Sequelize, accountId: number, fiscalYear: number, requestedAmount: number) => Promise<boolean>;
    generateFundStatusReport: (sequelize: Sequelize, fundCode: string, fiscalYear: number) => Promise<any>;
    exportToCEFMSFormat: (sequelize: Sequelize, fundCode: string, fiscalYear: number, fiscalPeriod: number) => Promise<any>;
};
export default _default;
//# sourceMappingURL=financial-accounts-management-kit.d.ts.map