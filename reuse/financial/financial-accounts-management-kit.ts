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

import { Model, DataTypes, Sequelize, Transaction, Op, ValidationError } from 'sequelize';
import { Injectable } from '@nestjs/common';
import { ApiProperty, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

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

interface AccountPeriod {
  fiscalYear: number;
  fiscalPeriod: number;
  periodName: string;
  startDate: Date;
  endDate: Date;
  status: 'open' | 'closed' | 'locked';
  closedBy?: string;
  closedAt?: Date;
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

// ============================================================================
// DTO CLASSES
// ============================================================================

export class CreateAccountDto {
  @ApiProperty({ description: 'Account code', example: 'A-1000-01' })
  accountCode!: string;

  @ApiProperty({ description: 'Account name', example: 'Cash - Operating Account' })
  accountName!: string;

  @ApiProperty({ description: 'Account type', example: 'ASSET' })
  accountType!: string;

  @ApiProperty({ description: 'Parent account ID', required: false })
  parentAccountId?: number;

  @ApiProperty({ description: 'Account description' })
  description?: string;

  @ApiProperty({ description: 'Normal balance type', enum: ['debit', 'credit'] })
  normalBalance!: 'debit' | 'credit';

  @ApiProperty({ description: 'Is active', default: true })
  isActive!: boolean;
}

export class AccountBalanceDto {
  @ApiProperty({ description: 'Account ID' })
  accountId!: number;

  @ApiProperty({ description: 'Fiscal year' })
  fiscalYear!: number;

  @ApiProperty({ description: 'Fiscal period' })
  fiscalPeriod!: number;

  @ApiProperty({ description: 'Beginning balance' })
  beginningBalance!: number;

  @ApiProperty({ description: 'Ending balance' })
  endingBalance!: number;

  @ApiProperty({ description: 'Available balance' })
  availableBalance!: number;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

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
export const createChartOfAccountsModel = (sequelize: Sequelize) => {
  class ChartOfAccounts extends Model {
    public id!: number;
    public accountCode!: string;
    public accountName!: string;
    public accountType!: string;
    public accountCategory!: string;
    public parentAccountId!: number | null;
    public normalBalance!: string;
    public level!: number;
    public path!: string;
    public segments!: AccountSegment[];
    public structure!: AccountStructure;
    public isActive!: boolean;
    public isSystemAccount!: boolean;
    public requiresProject!: boolean;
    public requiresActivity!: boolean;
    public allowDirectPosting!: boolean;
    public description!: string | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly createdBy!: string;
    public readonly updatedBy!: string;
  }

  ChartOfAccounts.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      accountCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Unique account code following USACE CEFMS structure',
        validate: {
          notEmpty: true,
          len: [3, 50],
        },
      },
      accountName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Descriptive account name',
        validate: {
          notEmpty: true,
          len: [3, 200],
        },
      },
      accountType: {
        type: DataTypes.ENUM(
          'ASSET',
          'LIABILITY',
          'EQUITY',
          'REVENUE',
          'EXPENSE',
          'FUND_BALANCE',
          'APPROPRIATION',
          'BUDGETARY',
          'MEMORANDUM',
        ),
        allowNull: false,
        comment: 'Account type classification',
      },
      accountCategory: {
        type: DataTypes.STRING(100),
        allowNull: false,
        defaultValue: 'GENERAL',
        comment: 'Account category for reporting',
      },
      parentAccountId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Parent account for hierarchy',
        references: {
          model: 'chart_of_accounts',
          key: 'id',
        },
      },
      normalBalance: {
        type: DataTypes.ENUM('debit', 'credit'),
        allowNull: false,
        comment: 'Normal balance for account type',
      },
      level: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: 'Hierarchy level (1=top level)',
        validate: {
          min: 1,
          max: 10,
        },
      },
      path: {
        type: DataTypes.STRING(500),
        allowNull: false,
        defaultValue: '',
        comment: 'Hierarchical path (e.g., /1/5/12)',
      },
      segments: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Account segment breakdown',
      },
      structure: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Account structure (fund, org, account, program, etc.)',
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Account active status',
      },
      isSystemAccount: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'System-managed account (cannot be deleted)',
      },
      requiresProject: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Requires project code for transactions',
      },
      requiresActivity: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Requires activity code for transactions',
      },
      allowDirectPosting: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Allows direct journal entry posting',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Detailed account description',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
      createdBy: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'User who created the record',
      },
      updatedBy: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'User who last updated the record',
      },
    },
    {
      sequelize,
      tableName: 'chart_of_accounts',
      timestamps: true,
      indexes: [
        { fields: ['accountCode'], unique: true },
        { fields: ['accountType'] },
        { fields: ['accountCategory'] },
        { fields: ['parentAccountId'] },
        { fields: ['isActive'] },
        { fields: ['path'] },
        { fields: ['level'] },
      ],
      hooks: {
        beforeCreate: (account) => {
          if (!account.createdBy) {
            throw new Error('createdBy is required');
          }
          account.updatedBy = account.createdBy;
        },
        beforeUpdate: (account) => {
          if (!account.updatedBy) {
            throw new Error('updatedBy is required');
          }
        },
      },
    },
  );

  return ChartOfAccounts;
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
export const createAccountBalanceModel = (sequelize: Sequelize) => {
  class AccountBalance extends Model {
    public id!: number;
    public accountId!: number;
    public fiscalYear!: number;
    public fiscalPeriod!: number;
    public beginningBalance!: number;
    public debitAmount!: number;
    public creditAmount!: number;
    public endingBalance!: number;
    public encumbranceAmount!: number;
    public preEncumbranceAmount!: number;
    public obligationAmount!: number;
    public expenditureAmount!: number;
    public budgetAmount!: number;
    public availableBalance!: number;
    public lastReconciliationDate!: Date | null;
    public reconciliationStatus!: string;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  AccountBalance.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      accountId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Reference to chart of accounts',
        references: {
          model: 'chart_of_accounts',
          key: 'id',
        },
      },
      fiscalYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Fiscal year',
        validate: {
          min: 2000,
          max: 2099,
        },
      },
      fiscalPeriod: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Fiscal period (1-12 or 1-13 for 13-period calendar)',
        validate: {
          min: 1,
          max: 13,
        },
      },
      beginningBalance: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Beginning balance for period',
      },
      debitAmount: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Total debits for period',
        validate: {
          min: 0,
        },
      },
      creditAmount: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Total credits for period',
        validate: {
          min: 0,
        },
      },
      endingBalance: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Ending balance for period',
      },
      encumbranceAmount: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Total encumbrances',
        validate: {
          min: 0,
        },
      },
      preEncumbranceAmount: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Total pre-encumbrances',
        validate: {
          min: 0,
        },
      },
      obligationAmount: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Total obligations',
        validate: {
          min: 0,
        },
      },
      expenditureAmount: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Total expenditures',
        validate: {
          min: 0,
        },
      },
      budgetAmount: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Budget amount for period',
        validate: {
          min: 0,
        },
      },
      availableBalance: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Available balance (ending - encumbrances)',
      },
      lastReconciliationDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Last reconciliation date',
      },
      reconciliationStatus: {
        type: DataTypes.ENUM('pending', 'reconciled', 'exception', 'out_of_balance'),
        allowNull: false,
        defaultValue: 'pending',
        comment: 'Reconciliation status',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
    },
    {
      sequelize,
      tableName: 'account_balances',
      timestamps: true,
      indexes: [
        { fields: ['accountId', 'fiscalYear', 'fiscalPeriod'], unique: true },
        { fields: ['fiscalYear', 'fiscalPeriod'] },
        { fields: ['accountId'] },
        { fields: ['reconciliationStatus'] },
      ],
      hooks: {
        beforeSave: (balance) => {
          // Auto-calculate ending balance
          balance.endingBalance = Number(balance.beginningBalance) + Number(balance.debitAmount) - Number(balance.creditAmount);
          // Auto-calculate available balance
          balance.availableBalance = Number(balance.endingBalance) - Number(balance.encumbranceAmount);
        },
      },
    },
  );

  return AccountBalance;
};

// ============================================================================
// CHART OF ACCOUNTS MANAGEMENT (1-10)
// ============================================================================

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
export const createAccount = async (
  sequelize: Sequelize,
  accountData: CreateAccountDto,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const ChartOfAccounts = createChartOfAccountsModel(sequelize);

  // Validate account code uniqueness
  const existing = await ChartOfAccounts.findOne({
    where: { accountCode: accountData.accountCode },
    transaction,
  });

  if (existing) {
    throw new Error(`Account code ${accountData.accountCode} already exists`);
  }

  // Parse account segments
  const segments = parseAccountSegments(accountData.accountCode);
  const structure = parseAccountStructure(accountData.accountCode);

  // Determine hierarchy level and path
  let level = 1;
  let path = `/${accountData.accountCode}`;

  if (accountData.parentAccountId) {
    const parent = await ChartOfAccounts.findByPk(accountData.parentAccountId, { transaction });
    if (!parent) {
      throw new Error('Parent account not found');
    }
    level = parent.level + 1;
    path = `${parent.path}/${accountData.accountCode}`;
  }

  const account = await ChartOfAccounts.create(
    {
      ...accountData,
      level,
      path,
      segments,
      structure,
      createdBy: userId,
      updatedBy: userId,
    },
    { transaction },
  );

  return account;
};

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
export const updateAccount = async (
  sequelize: Sequelize,
  accountId: number,
  updateData: Partial<CreateAccountDto>,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const ChartOfAccounts = createChartOfAccountsModel(sequelize);

  const account = await ChartOfAccounts.findByPk(accountId, { transaction });
  if (!account) {
    throw new Error('Account not found');
  }

  if (account.isSystemAccount && updateData.isActive === false) {
    throw new Error('Cannot deactivate system account');
  }

  await account.update({ ...updateData, updatedBy: userId }, { transaction });

  return account;
};

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
export const deactivateAccount = async (
  sequelize: Sequelize,
  accountId: number,
  userId: string,
  transaction?: Transaction,
): Promise<void> => {
  const ChartOfAccounts = createChartOfAccountsModel(sequelize);

  const account = await ChartOfAccounts.findByPk(accountId, { transaction });
  if (!account) {
    throw new Error('Account not found');
  }

  if (account.isSystemAccount) {
    throw new Error('Cannot deactivate system account');
  }

  // Check for child accounts
  const childCount = await ChartOfAccounts.count({
    where: { parentAccountId: accountId },
    transaction,
  });

  if (childCount > 0) {
    throw new Error('Cannot deactivate account with active child accounts');
  }

  await account.update({ isActive: false, updatedBy: userId }, { transaction });
};

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
export const getAccountByCode = async (
  sequelize: Sequelize,
  accountCode: string,
  transaction?: Transaction,
): Promise<any> => {
  const ChartOfAccounts = createChartOfAccountsModel(sequelize);

  return await ChartOfAccounts.findOne({
    where: { accountCode },
    transaction,
  });
};

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
export const getAccountsByType = async (
  sequelize: Sequelize,
  accountType: string,
  activeOnly = true,
): Promise<any[]> => {
  const ChartOfAccounts = createChartOfAccountsModel(sequelize);

  const where: any = { accountType };
  if (activeOnly) {
    where.isActive = true;
  }

  return await ChartOfAccounts.findAll({
    where,
    order: [['accountCode', 'ASC']],
  });
};

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
export const validateAccountCodeFormat = (
  accountCode: string,
  config: ChartOfAccountsConfig,
): boolean => {
  if (!accountCode || accountCode.length === 0) {
    return false;
  }

  // Check format matches configured pattern
  const formatRegex = new RegExp(config.accountFormat);
  if (!formatRegex.test(accountCode)) {
    return false;
  }

  // Check segment count
  const segments = accountCode.split(config.segmentDelimiter);
  if (segments.length !== config.segmentStructure.length) {
    return false;
  }

  return true;
};

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
export const parseAccountSegments = (
  accountCode: string,
  delimiter = '-',
): AccountSegment[] => {
  const parts = accountCode.split(delimiter);
  const segmentNames = ['Fund', 'Organization', 'Account', 'Program', 'Project', 'Activity'];

  return parts.map((part, index) => ({
    segmentNumber: index + 1,
    segmentName: segmentNames[index] || `Segment${index + 1}`,
    segmentCode: part,
    segmentValue: part,
    segmentDescription: `${segmentNames[index] || 'Segment'}: ${part}`,
  }));
};

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
export const parseAccountStructure = (accountCode: string): AccountStructure => {
  const segments = accountCode.split('-');

  return {
    fundCode: segments[0] || '',
    organizationCode: segments[1] || '',
    accountCode: segments[2] || '',
    programCode: segments[3] || '',
    projectCode: segments[4] || undefined,
    activityCode: segments[5] || undefined,
    costCenterCode: segments[6] || undefined,
  };
};

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
export const validateAccountPostingRules = (
  account: any,
  transactionType: 'debit' | 'credit',
  postingRules: PostingRule,
): boolean => {
  if (!account.isActive) {
    throw new Error('Cannot post to inactive account');
  }

  if (!account.allowDirectPosting) {
    throw new Error('Direct posting not allowed for this account');
  }

  if (transactionType === 'debit' && !postingRules.allowDebit) {
    throw new Error('Debit posting not allowed for this account type');
  }

  if (transactionType === 'credit' && !postingRules.allowCredit) {
    throw new Error('Credit posting not allowed for this account type');
  }

  return true;
};

// ============================================================================
// ACCOUNT HIERARCHY MANAGEMENT (11-15)
// ============================================================================

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
export const buildAccountHierarchy = async (
  sequelize: Sequelize,
  parentId: number | null = null,
): Promise<AccountHierarchy[]> => {
  const ChartOfAccounts = createChartOfAccountsModel(sequelize);

  const accounts = await ChartOfAccounts.findAll({
    where: { parentAccountId: parentId, isActive: true },
    order: [['accountCode', 'ASC']],
  });

  const hierarchy: AccountHierarchy[] = [];

  for (const account of accounts) {
    const children = await buildAccountHierarchy(sequelize, account.id);

    hierarchy.push({
      accountId: account.id,
      parentAccountId: account.parentAccountId,
      level: account.level,
      path: account.path,
      children,
      rollupBalance: 0, // To be calculated
    });
  }

  return hierarchy;
};

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
export const getAccountParents = async (
  sequelize: Sequelize,
  accountId: number,
): Promise<any[]> => {
  const ChartOfAccounts = createChartOfAccountsModel(sequelize);
  const parents: any[] = [];

  let currentAccount = await ChartOfAccounts.findByPk(accountId);

  while (currentAccount && currentAccount.parentAccountId) {
    const parent = await ChartOfAccounts.findByPk(currentAccount.parentAccountId);
    if (parent) {
      parents.unshift(parent);
      currentAccount = parent;
    } else {
      break;
    }
  }

  return parents;
};

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
export const getAccountChildren = async (
  sequelize: Sequelize,
  parentId: number,
  recursive = false,
): Promise<any[]> => {
  const ChartOfAccounts = createChartOfAccountsModel(sequelize);

  if (!recursive) {
    return await ChartOfAccounts.findAll({
      where: { parentAccountId: parentId, isActive: true },
      order: [['accountCode', 'ASC']],
    });
  }

  // Recursive: get all descendants
  const children: any[] = [];
  const directChildren = await ChartOfAccounts.findAll({
    where: { parentAccountId: parentId, isActive: true },
  });

  for (const child of directChildren) {
    children.push(child);
    const descendants = await getAccountChildren(sequelize, child.id, true);
    children.push(...descendants);
  }

  return children;
};

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
export const moveAccountInHierarchy = async (
  sequelize: Sequelize,
  accountId: number,
  newParentId: number | null,
  userId: string,
  transaction?: Transaction,
): Promise<void> => {
  const ChartOfAccounts = createChartOfAccountsModel(sequelize);

  const account = await ChartOfAccounts.findByPk(accountId, { transaction });
  if (!account) {
    throw new Error('Account not found');
  }

  // Validate new parent exists
  if (newParentId) {
    const newParent = await ChartOfAccounts.findByPk(newParentId, { transaction });
    if (!newParent) {
      throw new Error('New parent account not found');
    }

    // Prevent circular reference
    const newParentPath = newParent.path;
    if (newParentPath.includes(`/${accountId}/`)) {
      throw new Error('Cannot move account to its own descendant');
    }
  }

  // Update parent and recalculate path/level
  let newLevel = 1;
  let newPath = `/${accountId}`;

  if (newParentId) {
    const parent = await ChartOfAccounts.findByPk(newParentId, { transaction });
    newLevel = parent!.level + 1;
    newPath = `${parent!.path}/${accountId}`;
  }

  await account.update(
    {
      parentAccountId: newParentId,
      level: newLevel,
      path: newPath,
      updatedBy: userId,
    },
    { transaction },
  );

  // Update all descendants
  await updateDescendantPaths(sequelize, accountId, newPath, transaction);
};

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
export const updateDescendantPaths = async (
  sequelize: Sequelize,
  parentId: number,
  newParentPath: string,
  transaction?: Transaction,
): Promise<void> => {
  const ChartOfAccounts = createChartOfAccountsModel(sequelize);

  const children = await ChartOfAccounts.findAll({
    where: { parentAccountId: parentId },
    transaction,
  });

  for (const child of children) {
    const childPath = `${newParentPath}/${child.id}`;
    const childLevel = newParentPath.split('/').filter(Boolean).length + 1;

    await child.update({ path: childPath, level: childLevel }, { transaction });

    // Recursively update descendants
    await updateDescendantPaths(sequelize, child.id, childPath, transaction);
  }
};

// ============================================================================
// ACCOUNT BALANCE MANAGEMENT (16-25)
// ============================================================================

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
export const createOrUpdateAccountBalance = async (
  sequelize: Sequelize,
  balanceData: AccountBalance,
  transaction?: Transaction,
): Promise<any> => {
  const AccountBalance = createAccountBalanceModel(sequelize);

  const [balance, created] = await AccountBalance.findOrCreate({
    where: {
      accountId: balanceData.accountId,
      fiscalYear: balanceData.fiscalYear,
      fiscalPeriod: balanceData.fiscalPeriod,
    },
    defaults: balanceData,
    transaction,
  });

  if (!created) {
    await balance.update(balanceData, { transaction });
  }

  return balance;
};

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
export const getAccountBalance = async (
  sequelize: Sequelize,
  accountId: number,
  fiscalYear: number,
  fiscalPeriod: number,
): Promise<any> => {
  const AccountBalance = createAccountBalanceModel(sequelize);

  return await AccountBalance.findOne({
    where: {
      accountId,
      fiscalYear,
      fiscalPeriod,
    },
  });
};

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
export const getAccountYTDBalance = async (
  sequelize: Sequelize,
  accountId: number,
  fiscalYear: number,
  throughPeriod: number,
): Promise<number> => {
  const AccountBalance = createAccountBalanceModel(sequelize);

  const balances = await AccountBalance.findAll({
    where: {
      accountId,
      fiscalYear,
      fiscalPeriod: { [Op.lte]: throughPeriod },
    },
    order: [['fiscalPeriod', 'ASC']],
  });

  let ytdBalance = 0;

  for (const balance of balances) {
    ytdBalance += Number(balance.debitAmount) - Number(balance.creditAmount);
  }

  return ytdBalance;
};

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
export const postToAccountBalance = async (
  sequelize: Sequelize,
  accountId: number,
  fiscalYear: number,
  fiscalPeriod: number,
  amount: number,
  type: 'debit' | 'credit',
  transaction?: Transaction,
): Promise<any> => {
  const AccountBalance = createAccountBalanceModel(sequelize);

  const balance = await AccountBalance.findOne({
    where: { accountId, fiscalYear, fiscalPeriod },
    transaction,
  });

  if (!balance) {
    throw new Error('Account balance not found for period');
  }

  const updateData: any = {};

  if (type === 'debit') {
    updateData.debitAmount = Number(balance.debitAmount) + Number(amount);
  } else {
    updateData.creditAmount = Number(balance.creditAmount) + Number(amount);
  }

  await balance.update(updateData, { transaction });

  return balance;
};

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
export const calculateAvailableBalance = async (
  sequelize: Sequelize,
  accountId: number,
  fiscalYear: number,
  fiscalPeriod: number,
): Promise<number> => {
  const balance = await getAccountBalance(sequelize, accountId, fiscalYear, fiscalPeriod);

  if (!balance) {
    return 0;
  }

  return Number(balance.endingBalance) - Number(balance.encumbranceAmount);
};

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
export const updateEncumbranceAmount = async (
  sequelize: Sequelize,
  accountId: number,
  fiscalYear: number,
  fiscalPeriod: number,
  amount: number,
  transaction?: Transaction,
): Promise<void> => {
  const AccountBalance = createAccountBalanceModel(sequelize);

  const balance = await AccountBalance.findOne({
    where: { accountId, fiscalYear, fiscalPeriod },
    transaction,
  });

  if (!balance) {
    throw new Error('Account balance not found');
  }

  await balance.update(
    {
      encumbranceAmount: Number(balance.encumbranceAmount) + Number(amount),
    },
    { transaction },
  );
};

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
export const carryForwardBalances = async (
  sequelize: Sequelize,
  fromYear: number,
  toYear: number,
  transaction?: Transaction,
): Promise<number> => {
  const AccountBalance = createAccountBalanceModel(sequelize);

  // Get ending balances from last period of fromYear
  const endingBalances = await AccountBalance.findAll({
    where: {
      fiscalYear: fromYear,
      fiscalPeriod: 12,
    },
    transaction,
  });

  let count = 0;

  for (const oldBalance of endingBalances) {
    await AccountBalance.create(
      {
        accountId: oldBalance.accountId,
        fiscalYear: toYear,
        fiscalPeriod: 1,
        beginningBalance: oldBalance.endingBalance,
        debitAmount: 0,
        creditAmount: 0,
        endingBalance: oldBalance.endingBalance,
        encumbranceAmount: 0,
        preEncumbranceAmount: 0,
        obligationAmount: 0,
        expenditureAmount: 0,
        budgetAmount: 0,
        availableBalance: oldBalance.endingBalance,
        reconciliationStatus: 'pending',
      },
      { transaction },
    );
    count++;
  }

  return count;
};

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
export const rollupChildBalances = async (
  sequelize: Sequelize,
  parentAccountId: number,
  fiscalYear: number,
  fiscalPeriod: number,
): Promise<number> => {
  const children = await getAccountChildren(sequelize, parentAccountId, true);
  const AccountBalance = createAccountBalanceModel(sequelize);

  let totalBalance = 0;

  for (const child of children) {
    const balance = await AccountBalance.findOne({
      where: {
        accountId: child.id,
        fiscalYear,
        fiscalPeriod,
      },
    });

    if (balance) {
      totalBalance += Number(balance.endingBalance);
    }
  }

  return totalBalance;
};

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
export const validateBalanceIntegrity = async (
  sequelize: Sequelize,
  fiscalYear: number,
  fiscalPeriod: number,
): Promise<boolean> => {
  const AccountBalance = createAccountBalanceModel(sequelize);

  const result = await AccountBalance.findAll({
    where: { fiscalYear, fiscalPeriod },
    attributes: [
      [sequelize.fn('SUM', sequelize.col('debitAmount')), 'totalDebits'],
      [sequelize.fn('SUM', sequelize.col('creditAmount')), 'totalCredits'],
    ],
    raw: true,
  });

  const totalDebits = Number((result[0] as any).totalDebits || 0);
  const totalCredits = Number((result[0] as any).totalCredits || 0);

  return Math.abs(totalDebits - totalCredits) < 0.01; // Allow 1 cent tolerance
};

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
export const getTrialBalance = async (
  sequelize: Sequelize,
  fiscalYear: number,
  fiscalPeriod: number,
): Promise<any[]> => {
  const AccountBalance = createAccountBalanceModel(sequelize);
  const ChartOfAccounts = createChartOfAccountsModel(sequelize);

  const balances = await AccountBalance.findAll({
    where: { fiscalYear, fiscalPeriod },
    include: [
      {
        model: ChartOfAccounts,
        attributes: ['accountCode', 'accountName', 'accountType', 'normalBalance'],
      },
    ],
    order: [[{ model: ChartOfAccounts, as: 'account' }, 'accountCode', 'ASC']],
  });

  return balances.map((balance) => ({
    accountCode: (balance as any).account.accountCode,
    accountName: (balance as any).account.accountName,
    accountType: (balance as any).account.accountType,
    normalBalance: (balance as any).account.normalBalance,
    debitAmount: balance.debitAmount,
    creditAmount: balance.creditAmount,
    endingBalance: balance.endingBalance,
  }));
};

// ============================================================================
// ACCOUNT RECONCILIATION (26-35)
// ============================================================================

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
export const createAccountReconciliation = async (
  sequelize: Sequelize,
  reconciliationData: ReconciliationItem,
  transaction?: Transaction,
): Promise<any> => {
  const result = await sequelize.query(
    `INSERT INTO account_reconciliations
     (item_id, account_id, reconciliation_date, source_amount, ledger_amount, difference_amount, status, notes, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
    {
      replacements: [
        reconciliationData.itemId,
        reconciliationData.accountId,
        reconciliationData.reconciliationDate,
        reconciliationData.sourceAmount,
        reconciliationData.ledgerAmount,
        reconciliationData.differenceAmount,
        reconciliationData.status,
        reconciliationData.notes || null,
      ],
      transaction,
    },
  );

  return result;
};

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
export const markAccountReconciled = async (
  sequelize: Sequelize,
  accountId: number,
  fiscalYear: number,
  fiscalPeriod: number,
  userId: string,
  transaction?: Transaction,
): Promise<void> => {
  const AccountBalance = createAccountBalanceModel(sequelize);

  const balance = await AccountBalance.findOne({
    where: { accountId, fiscalYear, fiscalPeriod },
    transaction,
  });

  if (!balance) {
    throw new Error('Account balance not found');
  }

  await balance.update(
    {
      reconciliationStatus: 'reconciled',
      lastReconciliationDate: new Date(),
    },
    { transaction },
  );
};

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
export const findReconciliationExceptions = async (
  sequelize: Sequelize,
  accountId: number,
  startDate: Date,
  endDate: Date,
): Promise<any[]> => {
  const [results] = await sequelize.query(
    `SELECT * FROM account_reconciliations
     WHERE account_id = ?
     AND reconciliation_date BETWEEN ? AND ?
     AND status = 'exception'
     ORDER BY reconciliation_date DESC`,
    {
      replacements: [accountId, startDate, endDate],
    },
  );

  return results as any[];
};

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
export const resolveReconciliationException = async (
  sequelize: Sequelize,
  itemId: string,
  resolution: string,
  userId: string,
  transaction?: Transaction,
): Promise<void> => {
  await sequelize.query(
    `UPDATE account_reconciliations
     SET status = 'resolved', notes = ?, resolved_by = ?, resolved_at = NOW()
     WHERE item_id = ?`,
    {
      replacements: [resolution, userId, itemId],
      transaction,
    },
  );
};

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
export const compareToExternalBalance = async (
  sequelize: Sequelize,
  accountId: number,
  fiscalYear: number,
  fiscalPeriod: number,
  externalBalance: number,
): Promise<{ matched: boolean; difference: number }> => {
  const balance = await getAccountBalance(sequelize, accountId, fiscalYear, fiscalPeriod);

  if (!balance) {
    throw new Error('Account balance not found');
  }

  const difference = Number(balance.endingBalance) - Number(externalBalance);
  const matched = Math.abs(difference) < 0.01; // 1 cent tolerance

  return { matched, difference };
};

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
export const generateReconciliationReport = async (
  sequelize: Sequelize,
  accountId: number,
  fiscalYear: number,
  fiscalPeriod: number,
): Promise<any> => {
  const balance = await getAccountBalance(sequelize, accountId, fiscalYear, fiscalPeriod);
  const account = await getAccountByCode(sequelize, balance?.accountCode);

  const [reconciliations] = await sequelize.query(
    `SELECT * FROM account_reconciliations
     WHERE account_id = ?
     AND YEAR(reconciliation_date) = ?
     AND MONTH(reconciliation_date) = ?
     ORDER BY reconciliation_date DESC`,
    {
      replacements: [accountId, fiscalYear, fiscalPeriod],
    },
  );

  return {
    account: {
      accountCode: account?.accountCode,
      accountName: account?.accountName,
    },
    fiscalYear,
    fiscalPeriod,
    balance: {
      beginningBalance: balance?.beginningBalance,
      endingBalance: balance?.endingBalance,
      reconciliationStatus: balance?.reconciliationStatus,
      lastReconciliationDate: balance?.lastReconciliationDate,
    },
    reconciliations,
  };
};

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
export const autoReconcileAccounts = async (
  sequelize: Sequelize,
  fiscalYear: number,
  fiscalPeriod: number,
  tolerance = 0.01,
): Promise<number> => {
  const AccountBalance = createAccountBalanceModel(sequelize);

  // This is a simplified version - in reality would compare to external system
  const balances = await AccountBalance.findAll({
    where: {
      fiscalYear,
      fiscalPeriod,
      reconciliationStatus: 'pending',
    },
  });

  let reconciledCount = 0;

  for (const balance of balances) {
    // Validate balance integrity
    const calculated = Number(balance.beginningBalance) + Number(balance.debitAmount) - Number(balance.creditAmount);
    const difference = Math.abs(calculated - Number(balance.endingBalance));

    if (difference <= tolerance) {
      await balance.update({
        reconciliationStatus: 'reconciled',
        lastReconciliationDate: new Date(),
      });
      reconciledCount++;
    }
  }

  return reconciledCount;
};

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
export const flagAccountForReview = async (
  sequelize: Sequelize,
  accountId: number,
  fiscalYear: number,
  fiscalPeriod: number,
  reason: string,
  transaction?: Transaction,
): Promise<void> => {
  const AccountBalance = createAccountBalanceModel(sequelize);

  const balance = await AccountBalance.findOne({
    where: { accountId, fiscalYear, fiscalPeriod },
    transaction,
  });

  if (!balance) {
    throw new Error('Account balance not found');
  }

  await balance.update(
    {
      reconciliationStatus: 'exception',
      metadata: {
        ...balance.metadata,
        flagReason: reason,
        flaggedAt: new Date().toISOString(),
      },
    },
    { transaction },
  );
};

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
export const clearReconciliationFlags = async (
  sequelize: Sequelize,
  accountId: number,
  fiscalYear: number,
  fiscalPeriod: number,
  userId: string,
  transaction?: Transaction,
): Promise<void> => {
  const AccountBalance = createAccountBalanceModel(sequelize);

  const balance = await AccountBalance.findOne({
    where: { accountId, fiscalYear, fiscalPeriod },
    transaction,
  });

  if (!balance) {
    throw new Error('Account balance not found');
  }

  const metadata = { ...balance.metadata };
  delete metadata.flagReason;
  delete metadata.flaggedAt;

  await balance.update(
    {
      reconciliationStatus: 'pending',
      metadata: {
        ...metadata,
        flagsClearedBy: userId,
        flagsClearedAt: new Date().toISOString(),
      },
    },
    { transaction },
  );
};

// ============================================================================
// ACCOUNT DIMENSIONS AND FUND ACCOUNTING (36-45)
// ============================================================================

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
export const validateAccountDimensions = (
  dimensions: AccountDimension[],
  providedValues: Record<string, string>,
): boolean => {
  for (const dimension of dimensions) {
    if (dimension.isRequired && !providedValues[dimension.dimensionName]) {
      throw new Error(`Required dimension ${dimension.dimensionName} is missing`);
    }

    if (providedValues[dimension.dimensionName] && dimension.validValues) {
      if (!dimension.validValues.includes(providedValues[dimension.dimensionName])) {
        throw new Error(
          `Invalid value for dimension ${dimension.dimensionName}: ${providedValues[dimension.dimensionName]}`,
        );
      }
    }
  }

  return true;
};

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
export const applyFundAccountingRules = (
  rule: FundAccountingRule,
  fiscalYear: number,
  transactionDate: Date,
): boolean => {
  const transactionYear = transactionDate.getFullYear();

  // Check expiration rules
  if (rule.expirationRule === 'annual' && transactionYear !== fiscalYear) {
    throw new Error('Annual appropriation expired - cannot post to previous fiscal year');
  }

  if (rule.expirationRule === 'multi-year') {
    const yearsElapsed = transactionYear - fiscalYear;
    if (yearsElapsed > 5) {
      throw new Error('Multi-year appropriation expired');
    }
  }

  return true;
};

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
export const checkFundAvailability = async (
  sequelize: Sequelize,
  accountId: number,
  fiscalYear: number,
  requestedAmount: number,
): Promise<{ available: boolean; remainingBalance: number }> => {
  // Get current period
  const currentPeriod = new Date().getMonth() + 1;

  const balance = await getAccountBalance(sequelize, accountId, fiscalYear, currentPeriod);

  if (!balance) {
    return { available: false, remainingBalance: 0 };
  }

  const availableBalance = Number(balance.availableBalance);
  const available = availableBalance >= requestedAmount;

  return {
    available,
    remainingBalance: availableBalance - requestedAmount,
  };
};

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
export const recordObligation = async (
  sequelize: Sequelize,
  accountId: number,
  fiscalYear: number,
  fiscalPeriod: number,
  amount: number,
  transaction?: Transaction,
): Promise<void> => {
  const AccountBalance = createAccountBalanceModel(sequelize);

  const balance = await AccountBalance.findOne({
    where: { accountId, fiscalYear, fiscalPeriod },
    transaction,
  });

  if (!balance) {
    throw new Error('Account balance not found');
  }

  // Check fund availability
  if (Number(balance.availableBalance) < amount) {
    throw new Error('Insufficient funds for obligation');
  }

  await balance.update(
    {
      obligationAmount: Number(balance.obligationAmount) + Number(amount),
    },
    { transaction },
  );
};

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
export const liquidateObligation = async (
  sequelize: Sequelize,
  accountId: number,
  fiscalYear: number,
  fiscalPeriod: number,
  amount: number,
  transaction?: Transaction,
): Promise<void> => {
  const AccountBalance = createAccountBalanceModel(sequelize);

  const balance = await AccountBalance.findOne({
    where: { accountId, fiscalYear, fiscalPeriod },
    transaction,
  });

  if (!balance) {
    throw new Error('Account balance not found');
  }

  if (Number(balance.obligationAmount) < amount) {
    throw new Error('Expenditure exceeds obligation amount');
  }

  await balance.update(
    {
      obligationAmount: Number(balance.obligationAmount) - Number(amount),
      expenditureAmount: Number(balance.expenditureAmount) + Number(amount),
    },
    { transaction },
  );
};

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
export const calculateUnliquidatedObligations = async (
  sequelize: Sequelize,
  accountId: number,
  fiscalYear: number,
): Promise<number> => {
  const AccountBalance = createAccountBalanceModel(sequelize);

  const balances = await AccountBalance.findAll({
    where: { accountId, fiscalYear },
  });

  let totalUnliquidated = 0;

  for (const balance of balances) {
    totalUnliquidated += Number(balance.obligationAmount);
  }

  return totalUnliquidated;
};

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
export const processYearEndClosing = async (
  sequelize: Sequelize,
  fiscalYear: number,
  rule: FundAccountingRule,
  transaction?: Transaction,
): Promise<{ closed: number; carriedForward: number }> => {
  const AccountBalance = createAccountBalanceModel(sequelize);

  const balances = await AccountBalance.findAll({
    where: { fiscalYear, fiscalPeriod: 12 },
    transaction,
  });

  let closedCount = 0;
  let carriedForwardCount = 0;

  for (const balance of balances) {
    if (rule.expirationRule === 'annual' && !rule.carryoverAllowed) {
      // Close to fund balance - don't carry forward
      // In a real implementation, would post closing entries
      closedCount++;
    } else if (rule.carryoverAllowed) {
      // Carry forward to next year
      await AccountBalance.create(
        {
          accountId: balance.accountId,
          fiscalYear: fiscalYear + 1,
          fiscalPeriod: 1,
          beginningBalance: balance.endingBalance,
          debitAmount: 0,
          creditAmount: 0,
          endingBalance: balance.endingBalance,
          encumbranceAmount: 0,
          preEncumbranceAmount: 0,
          obligationAmount: 0,
          expenditureAmount: 0,
          budgetAmount: 0,
          availableBalance: balance.endingBalance,
          reconciliationStatus: 'pending',
        },
        { transaction },
      );
      carriedForwardCount++;
    }
  }

  return { closed: closedCount, carriedForward: carriedForwardCount };
};

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
export const validateAppropriationAuthority = async (
  sequelize: Sequelize,
  accountId: number,
  fiscalYear: number,
  requestedAmount: number,
): Promise<boolean> => {
  const AccountBalance = createAccountBalanceModel(sequelize);

  const balance = await AccountBalance.findOne({
    where: {
      accountId,
      fiscalYear,
      fiscalPeriod: 1, // Budget is set in first period
    },
  });

  if (!balance) {
    throw new Error('No appropriation found for account');
  }

  const totalBudget = Number(balance.budgetAmount);
  const totalObligated = await calculateUnliquidatedObligations(sequelize, accountId, fiscalYear);

  return totalObligated + requestedAmount <= totalBudget;
};

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
export const generateFundStatusReport = async (
  sequelize: Sequelize,
  fundCode: string,
  fiscalYear: number,
): Promise<any> => {
  const ChartOfAccounts = createChartOfAccountsModel(sequelize);
  const AccountBalance = createAccountBalanceModel(sequelize);

  // Get all accounts for fund
  const accounts = await ChartOfAccounts.findAll({
    where: {
      accountCode: { [Op.like]: `${fundCode}%` },
      isActive: true,
    },
  });

  const fundStatus: any = {
    fundCode,
    fiscalYear,
    accounts: [],
    totals: {
      budgetAuthority: 0,
      obligations: 0,
      expenditures: 0,
      unliquidatedObligations: 0,
      available: 0,
    },
  };

  for (const account of accounts) {
    const balances = await AccountBalance.findAll({
      where: { accountId: account.id, fiscalYear },
    });

    let accountBudget = 0;
    let accountObligations = 0;
    let accountExpenditures = 0;

    for (const balance of balances) {
      accountBudget += Number(balance.budgetAmount);
      accountObligations += Number(balance.obligationAmount);
      accountExpenditures += Number(balance.expenditureAmount);
    }

    fundStatus.accounts.push({
      accountCode: account.accountCode,
      accountName: account.accountName,
      budget: accountBudget,
      obligations: accountObligations,
      expenditures: accountExpenditures,
      available: accountBudget - accountObligations - accountExpenditures,
    });

    fundStatus.totals.budgetAuthority += accountBudget;
    fundStatus.totals.obligations += accountObligations;
    fundStatus.totals.expenditures += accountExpenditures;
  }

  fundStatus.totals.unliquidatedObligations =
    fundStatus.totals.obligations - fundStatus.totals.expenditures;
  fundStatus.totals.available =
    fundStatus.totals.budgetAuthority - fundStatus.totals.obligations;

  return fundStatus;
};

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
export const exportToCEFMSFormat = async (
  sequelize: Sequelize,
  fundCode: string,
  fiscalYear: number,
  fiscalPeriod: number,
): Promise<any> => {
  const report = await generateFundStatusReport(sequelize, fundCode, fiscalYear);

  // Format for USACE CEFMS
  return {
    reportHeader: {
      fundCode,
      fiscalYear,
      fiscalPeriod,
      reportDate: new Date().toISOString(),
      reportType: 'FUND_STATUS',
    },
    fundData: {
      appropriation: report.totals.budgetAuthority,
      obligations: report.totals.obligations,
      expenditures: report.totals.expenditures,
      unliquidatedObligations: report.totals.unliquidatedObligations,
      unobligatedBalance: report.totals.available,
    },
    accountDetails: report.accounts.map((acc: any) => ({
      accountCode: acc.accountCode,
      accountName: acc.accountName,
      budgetAmount: acc.budget,
      obligatedAmount: acc.obligations,
      expendedAmount: acc.expenditures,
      availableAmount: acc.available,
    })),
  };
};

/**
 * Default export with all utilities.
 */
export default {
  // Models
  createChartOfAccountsModel,
  createAccountBalanceModel,

  // Chart of Accounts Management
  createAccount,
  updateAccount,
  deactivateAccount,
  getAccountByCode,
  getAccountsByType,
  validateAccountCodeFormat,
  parseAccountSegments,
  parseAccountStructure,
  validateAccountPostingRules,

  // Account Hierarchy
  buildAccountHierarchy,
  getAccountParents,
  getAccountChildren,
  moveAccountInHierarchy,
  updateDescendantPaths,

  // Account Balance Management
  createOrUpdateAccountBalance,
  getAccountBalance,
  getAccountYTDBalance,
  postToAccountBalance,
  calculateAvailableBalance,
  updateEncumbranceAmount,
  carryForwardBalances,
  rollupChildBalances,
  validateBalanceIntegrity,
  getTrialBalance,

  // Account Reconciliation
  createAccountReconciliation,
  markAccountReconciled,
  findReconciliationExceptions,
  resolveReconciliationException,
  compareToExternalBalance,
  generateReconciliationReport,
  autoReconcileAccounts,
  flagAccountForReview,
  clearReconciliationFlags,

  // Fund Accounting & Dimensions
  validateAccountDimensions,
  applyFundAccountingRules,
  checkFundAvailability,
  recordObligation,
  liquidateObligation,
  calculateUnliquidatedObligations,
  processYearEndClosing,
  validateAppropriationAuthority,
  generateFundStatusReport,
  exportToCEFMSFormat,
};
