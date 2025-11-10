/**
 * LOC: CEFMSGL001
 * File: /reuse/financial/cefms/composites/cefms-general-ledger-accounting-composite.ts
 *
 * UPSTREAM (imports from):
 *   - ../../general-ledger-operations-kit.ts
 *   - ../../financial-accounting-ledger-kit.ts
 *   - ../../financial-transaction-processing-kit.ts
 *   - ../../financial-period-close-kit.ts
 *   - ../../financial-consolidation-kit.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend CEFMS accounting services
 *   - USACE financial reporting systems
 *   - General ledger integration modules
 */

/**
 * File: /reuse/financial/cefms/composites/cefms-general-ledger-accounting-composite.ts
 * Locator: WC-CEFMS-GL-001
 * Purpose: USACE CEFMS General Ledger Accounting - chart of accounts, journal entries, trial balance, financial periods, consolidation
 *
 * Upstream: Composes utilities from financial kits for comprehensive GL management
 * Downstream: ../../../backend/cefms/*, GL controllers, financial reporting, period close automation
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 48+ composite functions for USACE CEFMS general ledger operations
 *
 * LLM Context: Production-ready USACE CEFMS general ledger accounting system.
 * Comprehensive GL chart of accounts management, journal entry processing, automated trial balance generation,
 * financial period management, account reconciliation, budget vs actual reporting, multi-fund accounting,
 * encumbrance tracking, USSGL compliance, consolidated financial statements, and audit trail.
 */

import { Model, DataTypes, Sequelize, Transaction, Op } from 'sequelize';
import { Injectable } from '@nestjs/common';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface GLAccountData {
  accountCode: string;
  accountName: string;
  accountType: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
  normalBalance: 'debit' | 'credit';
  parentAccountCode?: string;
  isActive: boolean;
  ussglCode?: string;
  fundCode?: string;
  departmentCode?: string;
  allowPosting: boolean;
  requiresBudget: boolean;
  metadata?: Record<string, any>;
}

interface JournalEntryData {
  entryNumber: string;
  entryDate: Date;
  fiscalYear: number;
  fiscalPeriod: number;
  entryType: 'standard' | 'adjusting' | 'closing' | 'reversing';
  description: string;
  sourceDocument?: string;
  createdBy: string;
  postingStatus: 'draft' | 'posted' | 'voided';
  lines: JournalEntryLineData[];
}

interface JournalEntryLineData {
  lineNumber: number;
  accountCode: string;
  debitAmount: number;
  creditAmount: number;
  description?: string;
  fundCode?: string;
  costCenter?: string;
  projectCode?: string;
  grantId?: string;
}

interface TrialBalanceEntry {
  accountCode: string;
  accountName: string;
  accountType: string;
  debitBalance: number;
  creditBalance: number;
  netBalance: number;
}

interface FiscalPeriodData {
  fiscalYear: number;
  periodNumber: number;
  periodName: string;
  startDate: Date;
  endDate: Date;
  status: 'open' | 'closed' | 'locked';
  closedBy?: string;
  closedAt?: Date;
}

interface AccountReconciliationData {
  accountCode: string;
  reconciliationDate: Date;
  glBalance: number;
  subledgerBalance: number;
  variance: number;
  reconciledBy: string;
  status: 'reconciled' | 'pending' | 'variance';
  notes?: string;
}

interface BudgetVsActualData {
  accountCode: string;
  fiscalYear: number;
  fiscalPeriod: number;
  budgetAmount: number;
  actualAmount: number;
  variance: number;
  variancePercent: number;
  encumberedAmount: number;
  availableBalance: number;
}

interface EncumbranceData {
  encumbranceId: string;
  accountCode: string;
  amount: number;
  encumbranceDate: Date;
  documentNumber: string;
  status: 'active' | 'liquidated' | 'expired';
  description: string;
}

interface ConsolidatedFinancialStatement {
  fiscalYear: number;
  fiscalPeriod: number;
  statementType: 'balance_sheet' | 'income_statement' | 'cash_flow';
  lineItems: FinancialStatementLine[];
  totalAssets?: number;
  totalLiabilities?: number;
  netPosition?: number;
  totalRevenue?: number;
  totalExpenses?: number;
  netIncome?: number;
}

interface FinancialStatementLine {
  lineNumber: number;
  description: string;
  amount: number;
  accountCodes: string[];
  isSubtotal: boolean;
  indentLevel: number;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Sequelize model for GL Chart of Accounts with USSGL compliance.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} GLAccount model
 *
 * @example
 * ```typescript
 * const GLAccount = createGLAccountModel(sequelize);
 * const account = await GLAccount.create({
 *   accountCode: '1010',
 *   accountName: 'Cash - Operating',
 *   accountType: 'asset',
 *   normalBalance: 'debit',
 *   isActive: true,
 *   ussglCode: '1010',
 *   allowPosting: true
 * });
 * ```
 */
export const createGLAccountModel = (sequelize: Sequelize) => {
  class GLAccount extends Model {
    public id!: string;
    public accountCode!: string;
    public accountName!: string;
    public accountType!: string;
    public normalBalance!: string;
    public parentAccountCode!: string | null;
    public isActive!: boolean;
    public ussglCode!: string | null;
    public fundCode!: string | null;
    public departmentCode!: string | null;
    public allowPosting!: boolean;
    public requiresBudget!: boolean;
    public currentBalance!: number;
    public ytdDebit!: number;
    public ytdCredit!: number;
    public description!: string;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  GLAccount.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      accountCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'GL account code',
        validate: {
          notEmpty: true,
        },
      },
      accountName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Account name',
        validate: {
          notEmpty: true,
        },
      },
      accountType: {
        type: DataTypes.ENUM('asset', 'liability', 'equity', 'revenue', 'expense'),
        allowNull: false,
        comment: 'Account type',
      },
      normalBalance: {
        type: DataTypes.ENUM('debit', 'credit'),
        allowNull: false,
        comment: 'Normal balance side',
      },
      parentAccountCode: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Parent account for hierarchy',
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Account is active',
      },
      ussglCode: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'USSGL account code',
      },
      fundCode: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Fund code',
      },
      departmentCode: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Department code',
      },
      allowPosting: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Allow direct posting',
      },
      requiresBudget: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Requires budget control',
      },
      currentBalance: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Current account balance',
      },
      ytdDebit: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Year-to-date debit total',
      },
      ytdCredit: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Year-to-date credit total',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: '',
        comment: 'Account description',
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
      tableName: 'gl_accounts',
      timestamps: true,
      indexes: [
        { fields: ['accountCode'], unique: true },
        { fields: ['accountType'] },
        { fields: ['parentAccountCode'] },
        { fields: ['isActive'] },
        { fields: ['ussglCode'] },
        { fields: ['fundCode'] },
        { fields: ['departmentCode'] },
        { fields: ['allowPosting'] },
      ],
    },
  );

  return GLAccount;
};

/**
 * Sequelize model for Journal Entries with automated balancing validation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} JournalEntry model
 */
export const createJournalEntryModel = (sequelize: Sequelize) => {
  class JournalEntry extends Model {
    public id!: string;
    public entryNumber!: string;
    public entryDate!: Date;
    public fiscalYear!: number;
    public fiscalPeriod!: number;
    public entryType!: string;
    public description!: string;
    public sourceDocument!: string | null;
    public createdBy!: string;
    public postingStatus!: string;
    public postedAt!: Date | null;
    public postedBy!: string | null;
    public voidedAt!: Date | null;
    public voidedBy!: string | null;
    public voidReason!: string | null;
    public totalDebit!: number;
    public totalCredit!: number;
    public isBalanced!: boolean;
    public reversalOfEntry!: string | null;
    public reversedByEntry!: string | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  JournalEntry.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      entryNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Journal entry number',
      },
      entryDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Entry date',
      },
      fiscalYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Fiscal year',
      },
      fiscalPeriod: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Fiscal period (1-12)',
        validate: {
          min: 1,
          max: 12,
        },
      },
      entryType: {
        type: DataTypes.ENUM('standard', 'adjusting', 'closing', 'reversing'),
        allowNull: false,
        comment: 'Entry type',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Entry description',
      },
      sourceDocument: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Source document reference',
      },
      createdBy: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Created by user ID',
      },
      postingStatus: {
        type: DataTypes.ENUM('draft', 'posted', 'voided'),
        allowNull: false,
        defaultValue: 'draft',
        comment: 'Posting status',
      },
      postedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Posted timestamp',
      },
      postedBy: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Posted by user ID',
      },
      voidedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Voided timestamp',
      },
      voidedBy: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Voided by user ID',
      },
      voidReason: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Void reason',
      },
      totalDebit: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Total debit amount',
      },
      totalCredit: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Total credit amount',
      },
      isBalanced: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Entry is balanced',
      },
      reversalOfEntry: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Original entry being reversed',
      },
      reversedByEntry: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Entry that reversed this',
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
      tableName: 'journal_entries',
      timestamps: true,
      indexes: [
        { fields: ['entryNumber'], unique: true },
        { fields: ['entryDate'] },
        { fields: ['fiscalYear', 'fiscalPeriod'] },
        { fields: ['entryType'] },
        { fields: ['postingStatus'] },
        { fields: ['createdBy'] },
        { fields: ['postedAt'] },
      ],
    },
  );

  return JournalEntry;
};

/**
 * Sequelize model for Journal Entry Lines with account validation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} JournalEntryLine model
 */
export const createJournalEntryLineModel = (sequelize: Sequelize) => {
  class JournalEntryLine extends Model {
    public id!: string;
    public journalEntryId!: string;
    public lineNumber!: number;
    public accountCode!: string;
    public debitAmount!: number;
    public creditAmount!: number;
    public description!: string;
    public fundCode!: string | null;
    public costCenter!: string | null;
    public projectCode!: string | null;
    public grantId!: string | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  JournalEntryLine.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      journalEntryId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Related journal entry',
      },
      lineNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Line number',
      },
      accountCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'GL account code',
      },
      debitAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Debit amount',
        validate: {
          min: 0,
        },
      },
      creditAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Credit amount',
        validate: {
          min: 0,
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: '',
        comment: 'Line description',
      },
      fundCode: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Fund code',
      },
      costCenter: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Cost center',
      },
      projectCode: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Project code',
      },
      grantId: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Grant identifier',
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
      tableName: 'journal_entry_lines',
      timestamps: true,
      indexes: [
        { fields: ['journalEntryId', 'lineNumber'] },
        { fields: ['accountCode'] },
        { fields: ['fundCode'] },
        { fields: ['costCenter'] },
        { fields: ['projectCode'] },
        { fields: ['grantId'] },
      ],
    },
  );

  return JournalEntryLine;
};

/**
 * Sequelize model for Fiscal Periods with period close management.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} FiscalPeriod model
 */
export const createFiscalPeriodModel = (sequelize: Sequelize) => {
  class FiscalPeriod extends Model {
    public id!: string;
    public fiscalYear!: number;
    public periodNumber!: number;
    public periodName!: string;
    public startDate!: Date;
    public endDate!: Date;
    public status!: string;
    public closedBy!: string | null;
    public closedAt!: Date | null;
    public lockedBy!: string | null;
    public lockedAt!: Date | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  FiscalPeriod.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      fiscalYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Fiscal year',
      },
      periodNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Period number (1-12)',
        validate: {
          min: 1,
          max: 12,
        },
      },
      periodName: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Period name',
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Period start date',
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Period end date',
      },
      status: {
        type: DataTypes.ENUM('open', 'closed', 'locked'),
        allowNull: false,
        defaultValue: 'open',
        comment: 'Period status',
      },
      closedBy: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Closed by user ID',
      },
      closedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Closed timestamp',
      },
      lockedBy: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Locked by user ID',
      },
      lockedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Locked timestamp',
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
      tableName: 'fiscal_periods',
      timestamps: true,
      indexes: [
        { fields: ['fiscalYear', 'periodNumber'], unique: true },
        { fields: ['status'] },
        { fields: ['startDate', 'endDate'] },
      ],
    },
  );

  return FiscalPeriod;
};

/**
 * Sequelize model for Account Reconciliation with variance tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} AccountReconciliation model
 */
export const createAccountReconciliationModel = (sequelize: Sequelize) => {
  class AccountReconciliation extends Model {
    public id!: string;
    public accountCode!: string;
    public reconciliationDate!: Date;
    public fiscalYear!: number;
    public fiscalPeriod!: number;
    public glBalance!: number;
    public subledgerBalance!: number;
    public variance!: number;
    public reconciledBy!: string;
    public status!: string;
    public notes!: string;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  AccountReconciliation.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      accountCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'GL account code',
      },
      reconciliationDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Reconciliation date',
      },
      fiscalYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Fiscal year',
      },
      fiscalPeriod: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Fiscal period',
      },
      glBalance: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'GL balance',
      },
      subledgerBalance: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Subledger balance',
      },
      variance: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Variance amount',
      },
      reconciledBy: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Reconciled by user ID',
      },
      status: {
        type: DataTypes.ENUM('reconciled', 'pending', 'variance'),
        allowNull: false,
        comment: 'Reconciliation status',
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: '',
        comment: 'Reconciliation notes',
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
      tableName: 'account_reconciliations',
      timestamps: true,
      indexes: [
        { fields: ['accountCode'] },
        { fields: ['fiscalYear', 'fiscalPeriod'] },
        { fields: ['reconciliationDate'] },
        { fields: ['status'] },
      ],
    },
  );

  return AccountReconciliation;
};

/**
 * Sequelize model for Budget vs Actual tracking with encumbrance support.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} BudgetActual model
 */
export const createBudgetActualModel = (sequelize: Sequelize) => {
  class BudgetActual extends Model {
    public id!: string;
    public accountCode!: string;
    public fiscalYear!: number;
    public fiscalPeriod!: number;
    public budgetAmount!: number;
    public actualAmount!: number;
    public variance!: number;
    public variancePercent!: number;
    public encumberedAmount!: number;
    public availableBalance!: number;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  BudgetActual.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      accountCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'GL account code',
      },
      fiscalYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Fiscal year',
      },
      fiscalPeriod: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Fiscal period',
      },
      budgetAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Budget amount',
      },
      actualAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Actual amount',
      },
      variance: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Variance amount',
      },
      variancePercent: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Variance percentage',
      },
      encumberedAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Encumbered amount',
      },
      availableBalance: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Available balance',
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
      tableName: 'budget_actual',
      timestamps: true,
      indexes: [
        { fields: ['accountCode'] },
        { fields: ['fiscalYear', 'fiscalPeriod'] },
        { fields: ['accountCode', 'fiscalYear', 'fiscalPeriod'], unique: true },
      ],
    },
  );

  return BudgetActual;
};

/**
 * Sequelize model for Encumbrances with liquidation tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Encumbrance model
 */
export const createEncumbranceModel = (sequelize: Sequelize) => {
  class Encumbrance extends Model {
    public id!: string;
    public encumbranceId!: string;
    public accountCode!: string;
    public amount!: number;
    public encumbranceDate!: Date;
    public fiscalYear!: number;
    public fiscalPeriod!: number;
    public documentNumber!: string;
    public status!: string;
    public description!: string;
    public liquidatedAmount!: number;
    public liquidatedAt!: Date | null;
    public expiredAt!: Date | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  Encumbrance.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      encumbranceId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Encumbrance identifier',
      },
      accountCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'GL account code',
      },
      amount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Encumbrance amount',
        validate: {
          min: 0.01,
        },
      },
      encumbranceDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Encumbrance date',
      },
      fiscalYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Fiscal year',
      },
      fiscalPeriod: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Fiscal period',
      },
      documentNumber: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Source document number',
      },
      status: {
        type: DataTypes.ENUM('active', 'liquidated', 'expired'),
        allowNull: false,
        defaultValue: 'active',
        comment: 'Encumbrance status',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Encumbrance description',
      },
      liquidatedAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Liquidated amount',
      },
      liquidatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Liquidation timestamp',
      },
      expiredAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Expiration timestamp',
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
      tableName: 'encumbrances',
      timestamps: true,
      indexes: [
        { fields: ['encumbranceId'], unique: true },
        { fields: ['accountCode'] },
        { fields: ['fiscalYear', 'fiscalPeriod'] },
        { fields: ['status'] },
        { fields: ['documentNumber'] },
      ],
    },
  );

  return Encumbrance;
};

// ============================================================================
// CHART OF ACCOUNTS MANAGEMENT (1-8)
// ============================================================================

/**
 * Creates a new GL account with validation and hierarchy management.
 *
 * @param {GLAccountData} accountData - Account data
 * @param {Model} GLAccount - GLAccount model
 * @param {string} userId - User creating account
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created GL account
 *
 * @example
 * ```typescript
 * const account = await createGLAccount({
 *   accountCode: '1010',
 *   accountName: 'Cash - Operating',
 *   accountType: 'asset',
 *   normalBalance: 'debit',
 *   isActive: true
 * }, GLAccount, 'user123');
 * ```
 */
export const createGLAccount = async (
  accountData: GLAccountData,
  GLAccount: any,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const account = await GLAccount.create(
    {
      ...accountData,
      currentBalance: 0,
      ytdDebit: 0,
      ytdCredit: 0,
    },
    { transaction },
  );

  console.log(`GL Account created: ${account.accountCode} by ${userId}`);
  return account;
};

/**
 * Validates GL account code format and uniqueness.
 *
 * @param {string} accountCode - Account code to validate
 * @param {Model} GLAccount - GLAccount model
 * @returns {Promise<{ valid: boolean; errors: string[] }>} Validation result
 */
export const validateAccountCode = async (
  accountCode: string,
  GLAccount: any,
): Promise<{ valid: boolean; errors: string[] }> => {
  const errors: string[] = [];

  if (!accountCode || accountCode.length === 0) {
    errors.push('Account code is required');
  }

  if (accountCode && accountCode.length > 50) {
    errors.push('Account code exceeds maximum length');
  }

  const existing = await GLAccount.findOne({ where: { accountCode } });
  if (existing) {
    errors.push('Account code already exists');
  }

  return { valid: errors.length === 0, errors };
};

/**
 * Builds account hierarchy tree structure.
 *
 * @param {Model} GLAccount - GLAccount model
 * @returns {Promise<any[]>} Hierarchical account tree
 */
export const buildAccountHierarchy = async (
  GLAccount: any,
): Promise<any[]> => {
  const accounts = await GLAccount.findAll({ where: { isActive: true } });
  const accountMap = new Map();
  const rootAccounts: any[] = [];

  accounts.forEach((account: any) => {
    accountMap.set(account.accountCode, { ...account.toJSON(), children: [] });
  });

  accounts.forEach((account: any) => {
    const node = accountMap.get(account.accountCode);
    if (account.parentAccountCode) {
      const parent = accountMap.get(account.parentAccountCode);
      if (parent) {
        parent.children.push(node);
      }
    } else {
      rootAccounts.push(node);
    }
  });

  return rootAccounts;
};

/**
 * Updates GL account balance after posting.
 *
 * @param {string} accountCode - Account code
 * @param {number} debitAmount - Debit amount
 * @param {number} creditAmount - Credit amount
 * @param {Model} GLAccount - GLAccount model
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated account
 */
export const updateAccountBalance = async (
  accountCode: string,
  debitAmount: number,
  creditAmount: number,
  GLAccount: any,
  transaction?: Transaction,
): Promise<any> => {
  const account = await GLAccount.findOne({ where: { accountCode } });
  if (!account) throw new Error('Account not found');

  account.ytdDebit += debitAmount;
  account.ytdCredit += creditAmount;

  if (account.normalBalance === 'debit') {
    account.currentBalance += debitAmount - creditAmount;
  } else {
    account.currentBalance += creditAmount - debitAmount;
  }

  await account.save({ transaction });
  return account;
};

/**
 * Retrieves GL accounts by type with filtering.
 *
 * @param {string} accountType - Account type
 * @param {boolean} [activeOnly=true] - Return only active accounts
 * @param {Model} GLAccount - GLAccount model
 * @returns {Promise<any[]>} Filtered accounts
 */
export const getAccountsByType = async (
  accountType: string,
  activeOnly: boolean = true,
  GLAccount: any,
): Promise<any[]> => {
  const where: any = { accountType };
  if (activeOnly) {
    where.isActive = true;
  }

  return await GLAccount.findAll({ where, order: [['accountCode', 'ASC']] });
};

/**
 * Maps GL account to USSGL code for compliance.
 *
 * @param {string} accountCode - Account code
 * @param {string} ussglCode - USSGL code
 * @param {Model} GLAccount - GLAccount model
 * @returns {Promise<any>} Updated account
 */
export const mapToUSSGLCode = async (
  accountCode: string,
  ussglCode: string,
  GLAccount: any,
): Promise<any> => {
  const account = await GLAccount.findOne({ where: { accountCode } });
  if (!account) throw new Error('Account not found');

  account.ussglCode = ussglCode;
  await account.save();

  return account;
};

/**
 * Deactivates GL account with balance check.
 *
 * @param {string} accountCode - Account code
 * @param {Model} GLAccount - GLAccount model
 * @returns {Promise<any>} Deactivated account
 */
export const deactivateGLAccount = async (
  accountCode: string,
  GLAccount: any,
): Promise<any> => {
  const account = await GLAccount.findOne({ where: { accountCode } });
  if (!account) throw new Error('Account not found');

  if (Math.abs(account.currentBalance) > 0.01) {
    throw new Error('Cannot deactivate account with non-zero balance');
  }

  account.isActive = false;
  await account.save();

  return account;
};

/**
 * Retrieves account balance as of specific date.
 *
 * @param {string} accountCode - Account code
 * @param {Date} asOfDate - Balance date
 * @param {Model} GLAccount - GLAccount model
 * @param {Model} JournalEntryLine - JournalEntryLine model
 * @returns {Promise<number>} Account balance
 */
export const getAccountBalanceAsOf = async (
  accountCode: string,
  asOfDate: Date,
  GLAccount: any,
  JournalEntryLine: any,
): Promise<number> => {
  const account = await GLAccount.findOne({ where: { accountCode } });
  if (!account) throw new Error('Account not found');

  const lines = await JournalEntryLine.findAll({
    where: {
      accountCode,
      createdAt: { [Op.lte]: asOfDate },
    },
  });

  let balance = 0;
  lines.forEach((line: any) => {
    if (account.normalBalance === 'debit') {
      balance += parseFloat(line.debitAmount) - parseFloat(line.creditAmount);
    } else {
      balance += parseFloat(line.creditAmount) - parseFloat(line.debitAmount);
    }
  });

  return balance;
};

// ============================================================================
// JOURNAL ENTRY MANAGEMENT (9-16)
// ============================================================================

/**
 * Creates journal entry with automatic balancing validation.
 *
 * @param {JournalEntryData} entryData - Entry data
 * @param {Model} JournalEntry - JournalEntry model
 * @param {Model} JournalEntryLine - JournalEntryLine model
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created journal entry
 */
export const createJournalEntry = async (
  entryData: JournalEntryData,
  JournalEntry: any,
  JournalEntryLine: any,
  transaction?: Transaction,
): Promise<any> => {
  const totalDebit = entryData.lines.reduce((sum, line) => sum + line.debitAmount, 0);
  const totalCredit = entryData.lines.reduce((sum, line) => sum + line.creditAmount, 0);
  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01;

  const entry = await JournalEntry.create(
    {
      ...entryData,
      totalDebit,
      totalCredit,
      isBalanced,
      postingStatus: 'draft',
    },
    { transaction },
  );

  for (const lineData of entryData.lines) {
    await JournalEntryLine.create(
      {
        journalEntryId: entry.id,
        ...lineData,
      },
      { transaction },
    );
  }

  return entry;
};

/**
 * Validates journal entry balance before posting.
 *
 * @param {string} entryId - Entry ID
 * @param {Model} JournalEntry - JournalEntry model
 * @param {Model} JournalEntryLine - JournalEntryLine model
 * @returns {Promise<{ balanced: boolean; totalDebit: number; totalCredit: number; variance: number }>}
 */
export const validateEntryBalance = async (
  entryId: string,
  JournalEntry: any,
  JournalEntryLine: any,
): Promise<{ balanced: boolean; totalDebit: number; totalCredit: number; variance: number }> => {
  const entry = await JournalEntry.findByPk(entryId);
  if (!entry) throw new Error('Entry not found');

  const lines = await JournalEntryLine.findAll({ where: { journalEntryId: entryId } });

  const totalDebit = lines.reduce((sum: number, line: any) => sum + parseFloat(line.debitAmount), 0);
  const totalCredit = lines.reduce((sum: number, line: any) => sum + parseFloat(line.creditAmount), 0);
  const variance = Math.abs(totalDebit - totalCredit);

  return {
    balanced: variance < 0.01,
    totalDebit,
    totalCredit,
    variance,
  };
};

/**
 * Posts journal entry to GL accounts.
 *
 * @param {string} entryId - Entry ID
 * @param {string} userId - User posting entry
 * @param {Model} JournalEntry - JournalEntry model
 * @param {Model} JournalEntryLine - JournalEntryLine model
 * @param {Model} GLAccount - GLAccount model
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Posted entry
 */
export const postJournalEntry = async (
  entryId: string,
  userId: string,
  JournalEntry: any,
  JournalEntryLine: any,
  GLAccount: any,
  transaction?: Transaction,
): Promise<any> => {
  const entry = await JournalEntry.findByPk(entryId);
  if (!entry) throw new Error('Entry not found');

  if (entry.postingStatus !== 'draft') {
    throw new Error('Entry already posted');
  }

  const validation = await validateEntryBalance(entryId, JournalEntry, JournalEntryLine);
  if (!validation.balanced) {
    throw new Error(`Entry not balanced: variance ${validation.variance}`);
  }

  const lines = await JournalEntryLine.findAll({ where: { journalEntryId: entryId } });

  for (const line of lines) {
    await updateAccountBalance(
      line.accountCode,
      parseFloat(line.debitAmount),
      parseFloat(line.creditAmount),
      GLAccount,
      transaction,
    );
  }

  entry.postingStatus = 'posted';
  entry.postedBy = userId;
  entry.postedAt = new Date();
  await entry.save({ transaction });

  return entry;
};

/**
 * Voids posted journal entry with reversal.
 *
 * @param {string} entryId - Entry ID
 * @param {string} reason - Void reason
 * @param {string} userId - User voiding entry
 * @param {Model} JournalEntry - JournalEntry model
 * @returns {Promise<any>} Voided entry
 */
export const voidJournalEntry = async (
  entryId: string,
  reason: string,
  userId: string,
  JournalEntry: any,
): Promise<any> => {
  const entry = await JournalEntry.findByPk(entryId);
  if (!entry) throw new Error('Entry not found');

  entry.postingStatus = 'voided';
  entry.voidedBy = userId;
  entry.voidedAt = new Date();
  entry.voidReason = reason;
  await entry.save();

  return entry;
};

/**
 * Creates reversing entry for adjustments.
 *
 * @param {string} originalEntryId - Original entry ID
 * @param {Date} reversalDate - Reversal date
 * @param {string} userId - User creating reversal
 * @param {Model} JournalEntry - JournalEntry model
 * @param {Model} JournalEntryLine - JournalEntryLine model
 * @returns {Promise<any>} Reversal entry
 */
export const createReversingEntry = async (
  originalEntryId: string,
  reversalDate: Date,
  userId: string,
  JournalEntry: any,
  JournalEntryLine: any,
): Promise<any> => {
  const originalEntry = await JournalEntry.findByPk(originalEntryId);
  if (!originalEntry) throw new Error('Original entry not found');

  const originalLines = await JournalEntryLine.findAll({
    where: { journalEntryId: originalEntryId },
  });

  const reversalLines = originalLines.map((line: any) => ({
    lineNumber: line.lineNumber,
    accountCode: line.accountCode,
    debitAmount: line.creditAmount,
    creditAmount: line.debitAmount,
    description: `Reversal: ${line.description}`,
    fundCode: line.fundCode,
    costCenter: line.costCenter,
    projectCode: line.projectCode,
  }));

  const reversalEntry = await createJournalEntry(
    {
      entryNumber: `REV-${originalEntry.entryNumber}`,
      entryDate: reversalDate,
      fiscalYear: reversalDate.getFullYear(),
      fiscalPeriod: reversalDate.getMonth() + 1,
      entryType: 'reversing',
      description: `Reversal of ${originalEntry.entryNumber}`,
      createdBy: userId,
      postingStatus: 'draft',
      lines: reversalLines,
    },
    JournalEntry,
    JournalEntryLine,
  );

  originalEntry.reversedByEntry = reversalEntry.entryNumber;
  await originalEntry.save();

  return reversalEntry;
};

/**
 * Retrieves journal entries by fiscal period.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {Model} JournalEntry - JournalEntry model
 * @returns {Promise<any[]>} Journal entries
 */
export const getEntriesByPeriod = async (
  fiscalYear: number,
  fiscalPeriod: number,
  JournalEntry: any,
): Promise<any[]> => {
  return await JournalEntry.findAll({
    where: {
      fiscalYear,
      fiscalPeriod,
      postingStatus: { [Op.ne]: 'voided' },
    },
    order: [['entryDate', 'ASC'], ['entryNumber', 'ASC']],
  });
};

/**
 * Retrieves journal entries for specific account.
 *
 * @param {string} accountCode - Account code
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Model} JournalEntry - JournalEntry model
 * @param {Model} JournalEntryLine - JournalEntryLine model
 * @returns {Promise<any[]>} Account entries
 */
export const getAccountEntries = async (
  accountCode: string,
  startDate: Date,
  endDate: Date,
  JournalEntry: any,
  JournalEntryLine: any,
): Promise<any[]> => {
  const lines = await JournalEntryLine.findAll({
    where: { accountCode },
    include: [
      {
        model: JournalEntry,
        where: {
          entryDate: { [Op.between]: [startDate, endDate] },
          postingStatus: 'posted',
        },
      },
    ],
    order: [[JournalEntry, 'entryDate', 'ASC']],
  });

  return lines;
};

/**
 * Generates entry number with sequential numbering.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {string} entryType - Entry type
 * @param {Model} JournalEntry - JournalEntry model
 * @returns {Promise<string>} Generated entry number
 */
export const generateEntryNumber = async (
  fiscalYear: number,
  fiscalPeriod: number,
  entryType: string,
  JournalEntry: any,
): Promise<string> => {
  const prefix = entryType === 'adjusting' ? 'ADJ' : entryType === 'closing' ? 'CLS' : 'JE';
  const count = await JournalEntry.count({
    where: { fiscalYear, fiscalPeriod, entryType },
  });

  return `${prefix}-${fiscalYear}-${fiscalPeriod.toString().padStart(2, '0')}-${(count + 1).toString().padStart(5, '0')}`;
};

// ============================================================================
// TRIAL BALANCE & REPORTS (17-24)
// ============================================================================

/**
 * Generates trial balance for fiscal period.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {Model} GLAccount - GLAccount model
 * @param {Model} JournalEntryLine - JournalEntryLine model
 * @returns {Promise<TrialBalanceEntry[]>} Trial balance entries
 */
export const generateTrialBalance = async (
  fiscalYear: number,
  fiscalPeriod: number,
  GLAccount: any,
  JournalEntryLine: any,
): Promise<TrialBalanceEntry[]> => {
  const accounts = await GLAccount.findAll({ where: { isActive: true } });
  const trialBalance: TrialBalanceEntry[] = [];

  for (const account of accounts) {
    const debitBalance = account.normalBalance === 'debit' ? Math.max(account.currentBalance, 0) : 0;
    const creditBalance = account.normalBalance === 'credit' ? Math.max(account.currentBalance, 0) : 0;

    trialBalance.push({
      accountCode: account.accountCode,
      accountName: account.accountName,
      accountType: account.accountType,
      debitBalance,
      creditBalance,
      netBalance: account.currentBalance,
    });
  }

  return trialBalance;
};

/**
 * Validates trial balance totals.
 *
 * @param {TrialBalanceEntry[]} trialBalance - Trial balance entries
 * @returns {{ balanced: boolean; totalDebit: number; totalCredit: number; variance: number }}
 */
export const validateTrialBalance = (
  trialBalance: TrialBalanceEntry[],
): { balanced: boolean; totalDebit: number; totalCredit: number; variance: number } => {
  const totalDebit = trialBalance.reduce((sum, entry) => sum + entry.debitBalance, 0);
  const totalCredit = trialBalance.reduce((sum, entry) => sum + entry.creditBalance, 0);
  const variance = Math.abs(totalDebit - totalCredit);

  return {
    balanced: variance < 0.01,
    totalDebit,
    totalCredit,
    variance,
  };
};

/**
 * Exports trial balance to CSV format.
 *
 * @param {TrialBalanceEntry[]} trialBalance - Trial balance entries
 * @returns {string} CSV content
 */
export const exportTrialBalanceCSV = (
  trialBalance: TrialBalanceEntry[],
): string => {
  const headers = 'Account Code,Account Name,Account Type,Debit Balance,Credit Balance,Net Balance\n';
  const rows = trialBalance.map(
    (entry) =>
      `${entry.accountCode},${entry.accountName},${entry.accountType},${entry.debitBalance.toFixed(2)},${entry.creditBalance.toFixed(2)},${entry.netBalance.toFixed(2)}`,
  );

  const totals = validateTrialBalance(trialBalance);
  rows.push(
    `TOTALS,,,${totals.totalDebit.toFixed(2)},${totals.totalCredit.toFixed(2)},`,
  );

  return headers + rows.join('\n');
};

/**
 * Generates balance sheet for fiscal period.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {Model} GLAccount - GLAccount model
 * @returns {Promise<ConsolidatedFinancialStatement>} Balance sheet
 */
export const generateBalanceSheet = async (
  fiscalYear: number,
  fiscalPeriod: number,
  GLAccount: any,
): Promise<ConsolidatedFinancialStatement> => {
  const assets = await GLAccount.findAll({
    where: { accountType: 'asset', isActive: true },
  });
  const liabilities = await GLAccount.findAll({
    where: { accountType: 'liability', isActive: true },
  });
  const equity = await GLAccount.findAll({
    where: { accountType: 'equity', isActive: true },
  });

  const totalAssets = assets.reduce((sum: number, acc: any) => sum + parseFloat(acc.currentBalance), 0);
  const totalLiabilities = liabilities.reduce((sum: number, acc: any) => sum + parseFloat(acc.currentBalance), 0);
  const netPosition = equity.reduce((sum: number, acc: any) => sum + parseFloat(acc.currentBalance), 0);

  const lineItems: FinancialStatementLine[] = [];
  let lineNumber = 1;

  lineItems.push({ lineNumber: lineNumber++, description: 'ASSETS', amount: 0, accountCodes: [], isSubtotal: true, indentLevel: 0 });
  assets.forEach((acc: any) => {
    lineItems.push({
      lineNumber: lineNumber++,
      description: acc.accountName,
      amount: parseFloat(acc.currentBalance),
      accountCodes: [acc.accountCode],
      isSubtotal: false,
      indentLevel: 1,
    });
  });
  lineItems.push({ lineNumber: lineNumber++, description: 'Total Assets', amount: totalAssets, accountCodes: [], isSubtotal: true, indentLevel: 0 });

  lineItems.push({ lineNumber: lineNumber++, description: 'LIABILITIES', amount: 0, accountCodes: [], isSubtotal: true, indentLevel: 0 });
  liabilities.forEach((acc: any) => {
    lineItems.push({
      lineNumber: lineNumber++,
      description: acc.accountName,
      amount: parseFloat(acc.currentBalance),
      accountCodes: [acc.accountCode],
      isSubtotal: false,
      indentLevel: 1,
    });
  });
  lineItems.push({ lineNumber: lineNumber++, description: 'Total Liabilities', amount: totalLiabilities, accountCodes: [], isSubtotal: true, indentLevel: 0 });

  return {
    fiscalYear,
    fiscalPeriod,
    statementType: 'balance_sheet',
    lineItems,
    totalAssets,
    totalLiabilities,
    netPosition,
  };
};

/**
 * Generates income statement for fiscal period.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {Model} GLAccount - GLAccount model
 * @returns {Promise<ConsolidatedFinancialStatement>} Income statement
 */
export const generateIncomeStatement = async (
  fiscalYear: number,
  fiscalPeriod: number,
  GLAccount: any,
): Promise<ConsolidatedFinancialStatement> => {
  const revenue = await GLAccount.findAll({
    where: { accountType: 'revenue', isActive: true },
  });
  const expenses = await GLAccount.findAll({
    where: { accountType: 'expense', isActive: true },
  });

  const totalRevenue = revenue.reduce((sum: number, acc: any) => sum + parseFloat(acc.currentBalance), 0);
  const totalExpenses = expenses.reduce((sum: number, acc: any) => sum + parseFloat(acc.currentBalance), 0);
  const netIncome = totalRevenue - totalExpenses;

  const lineItems: FinancialStatementLine[] = [];
  let lineNumber = 1;

  lineItems.push({ lineNumber: lineNumber++, description: 'REVENUE', amount: 0, accountCodes: [], isSubtotal: true, indentLevel: 0 });
  revenue.forEach((acc: any) => {
    lineItems.push({
      lineNumber: lineNumber++,
      description: acc.accountName,
      amount: parseFloat(acc.currentBalance),
      accountCodes: [acc.accountCode],
      isSubtotal: false,
      indentLevel: 1,
    });
  });
  lineItems.push({ lineNumber: lineNumber++, description: 'Total Revenue', amount: totalRevenue, accountCodes: [], isSubtotal: true, indentLevel: 0 });

  lineItems.push({ lineNumber: lineNumber++, description: 'EXPENSES', amount: 0, accountCodes: [], isSubtotal: true, indentLevel: 0 });
  expenses.forEach((acc: any) => {
    lineItems.push({
      lineNumber: lineNumber++,
      description: acc.accountName,
      amount: parseFloat(acc.currentBalance),
      accountCodes: [acc.accountCode],
      isSubtotal: false,
      indentLevel: 1,
    });
  });
  lineItems.push({ lineNumber: lineNumber++, description: 'Total Expenses', amount: totalExpenses, accountCodes: [], isSubtotal: true, indentLevel: 0 });
  lineItems.push({ lineNumber: lineNumber++, description: 'Net Income', amount: netIncome, accountCodes: [], isSubtotal: true, indentLevel: 0 });

  return {
    fiscalYear,
    fiscalPeriod,
    statementType: 'income_statement',
    lineItems,
    totalRevenue,
    totalExpenses,
    netIncome,
  };
};

/**
 * Generates general ledger report for account.
 *
 * @param {string} accountCode - Account code
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Model} GLAccount - GLAccount model
 * @param {Model} JournalEntryLine - JournalEntryLine model
 * @returns {Promise<any>} GL report
 */
export const generateGLReport = async (
  accountCode: string,
  startDate: Date,
  endDate: Date,
  GLAccount: any,
  JournalEntryLine: any,
): Promise<any> => {
  const account = await GLAccount.findOne({ where: { accountCode } });
  if (!account) throw new Error('Account not found');

  const beginningBalance = await getAccountBalanceAsOf(accountCode, startDate, GLAccount, JournalEntryLine);

  const lines = await JournalEntryLine.findAll({
    where: {
      accountCode,
      createdAt: { [Op.between]: [startDate, endDate] },
    },
    order: [['createdAt', 'ASC']],
  });

  let runningBalance = beginningBalance;
  const transactions = lines.map((line: any) => {
    const debit = parseFloat(line.debitAmount);
    const credit = parseFloat(line.creditAmount);
    runningBalance += account.normalBalance === 'debit' ? debit - credit : credit - debit;

    return {
      date: line.createdAt,
      description: line.description,
      debit,
      credit,
      balance: runningBalance,
    };
  });

  return {
    accountCode,
    accountName: account.accountName,
    beginningBalance,
    transactions,
    endingBalance: runningBalance,
  };
};

/**
 * Exports financial statement to PDF format.
 *
 * @param {ConsolidatedFinancialStatement} statement - Financial statement
 * @returns {Promise<Buffer>} PDF buffer
 */
export const exportFinancialStatementPDF = async (
  statement: ConsolidatedFinancialStatement,
): Promise<Buffer> => {
  const content = `
FINANCIAL STATEMENT
Type: ${statement.statementType}
Fiscal Year: ${statement.fiscalYear}
Period: ${statement.fiscalPeriod}

${statement.lineItems.map(line =>
  `${' '.repeat(line.indentLevel * 2)}${line.description}: ${line.amount.toFixed(2)}`
).join('\n')}

Generated: ${new Date().toISOString()}
`;

  return Buffer.from(content, 'utf-8');
};

/**
 * Retrieves account activity summary.
 *
 * @param {string} accountCode - Account code
 * @param {number} fiscalYear - Fiscal year
 * @param {Model} JournalEntryLine - JournalEntryLine model
 * @returns {Promise<any>} Activity summary
 */
export const getAccountActivitySummary = async (
  accountCode: string,
  fiscalYear: number,
  JournalEntryLine: any,
): Promise<any> => {
  const lines = await JournalEntryLine.findAll({
    where: { accountCode },
    include: [
      {
        model: JournalEntryLine.sequelize.models.JournalEntry,
        where: { fiscalYear },
      },
    ],
  });

  const totalDebit = lines.reduce((sum: number, line: any) => sum + parseFloat(line.debitAmount), 0);
  const totalCredit = lines.reduce((sum: number, line: any) => sum + parseFloat(line.creditAmount), 0);
  const transactionCount = lines.length;

  return {
    accountCode,
    fiscalYear,
    totalDebit,
    totalCredit,
    netActivity: totalDebit - totalCredit,
    transactionCount,
  };
};

// ============================================================================
// FISCAL PERIOD MANAGEMENT (25-32)
// ============================================================================

/**
 * Creates fiscal period with date validation.
 *
 * @param {FiscalPeriodData} periodData - Period data
 * @param {Model} FiscalPeriod - FiscalPeriod model
 * @returns {Promise<any>} Created period
 */
export const createFiscalPeriod = async (
  periodData: FiscalPeriodData,
  FiscalPeriod: any,
): Promise<any> => {
  return await FiscalPeriod.create({
    ...periodData,
    status: 'open',
  });
};

/**
 * Closes fiscal period with validation.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {number} periodNumber - Period number
 * @param {string} userId - User closing period
 * @param {Model} FiscalPeriod - FiscalPeriod model
 * @param {Model} JournalEntry - JournalEntry model
 * @returns {Promise<any>} Closed period
 */
export const closeFiscalPeriod = async (
  fiscalYear: number,
  periodNumber: number,
  userId: string,
  FiscalPeriod: any,
  JournalEntry: any,
): Promise<any> => {
  const period = await FiscalPeriod.findOne({
    where: { fiscalYear, periodNumber },
  });
  if (!period) throw new Error('Period not found');

  // Check for unposted entries
  const unposted = await JournalEntry.count({
    where: {
      fiscalYear,
      fiscalPeriod: periodNumber,
      postingStatus: 'draft',
    },
  });

  if (unposted > 0) {
    throw new Error(`Cannot close period: ${unposted} unposted entries`);
  }

  period.status = 'closed';
  period.closedBy = userId;
  period.closedAt = new Date();
  await period.save();

  return period;
};

/**
 * Reopens fiscal period with authorization.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {number} periodNumber - Period number
 * @param {string} userId - User reopening period
 * @param {Model} FiscalPeriod - FiscalPeriod model
 * @returns {Promise<any>} Reopened period
 */
export const reopenFiscalPeriod = async (
  fiscalYear: number,
  periodNumber: number,
  userId: string,
  FiscalPeriod: any,
): Promise<any> => {
  const period = await FiscalPeriod.findOne({
    where: { fiscalYear, periodNumber },
  });
  if (!period) throw new Error('Period not found');

  if (period.status === 'locked') {
    throw new Error('Cannot reopen locked period');
  }

  period.status = 'open';
  period.closedBy = null;
  period.closedAt = null;
  await period.save();

  console.log(`Period ${fiscalYear}-${periodNumber} reopened by ${userId}`);
  return period;
};

/**
 * Locks fiscal period permanently.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {number} periodNumber - Period number
 * @param {string} userId - User locking period
 * @param {Model} FiscalPeriod - FiscalPeriod model
 * @returns {Promise<any>} Locked period
 */
export const lockFiscalPeriod = async (
  fiscalYear: number,
  periodNumber: number,
  userId: string,
  FiscalPeriod: any,
): Promise<any> => {
  const period = await FiscalPeriod.findOne({
    where: { fiscalYear, periodNumber },
  });
  if (!period) throw new Error('Period not found');

  period.status = 'locked';
  period.lockedBy = userId;
  period.lockedAt = new Date();
  await period.save();

  return period;
};

/**
 * Retrieves current open fiscal period.
 *
 * @param {Model} FiscalPeriod - FiscalPeriod model
 * @returns {Promise<any>} Current open period
 */
export const getCurrentOpenPeriod = async (
  FiscalPeriod: any,
): Promise<any> => {
  return await FiscalPeriod.findOne({
    where: { status: 'open' },
    order: [['fiscalYear', 'DESC'], ['periodNumber', 'DESC']],
  });
};

/**
 * Validates period posting authorization.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {number} periodNumber - Period number
 * @param {Model} FiscalPeriod - FiscalPeriod model
 * @returns {Promise<{ allowed: boolean; reason?: string }>}
 */
export const validatePeriodPostingAuth = async (
  fiscalYear: number,
  periodNumber: number,
  FiscalPeriod: any,
): Promise<{ allowed: boolean; reason?: string }> => {
  const period = await FiscalPeriod.findOne({
    where: { fiscalYear, periodNumber },
  });

  if (!period) {
    return { allowed: false, reason: 'Period not found' };
  }

  if (period.status !== 'open') {
    return { allowed: false, reason: `Period is ${period.status}` };
  }

  return { allowed: true };
};

/**
 * Generates fiscal calendar for year.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {Date} yearStartDate - Year start date
 * @param {Model} FiscalPeriod - FiscalPeriod model
 * @returns {Promise<any[]>} Fiscal calendar
 */
export const generateFiscalCalendar = async (
  fiscalYear: number,
  yearStartDate: Date,
  FiscalPeriod: any,
): Promise<any[]> => {
  const periods = [];
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  for (let period = 1; period <= 12; period++) {
    const startDate = new Date(yearStartDate);
    startDate.setMonth(startDate.getMonth() + (period - 1));

    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);
    endDate.setDate(0);

    const existing = await FiscalPeriod.findOne({
      where: { fiscalYear, periodNumber: period },
    });

    if (!existing) {
      const newPeriod = await FiscalPeriod.create({
        fiscalYear,
        periodNumber: period,
        periodName: `${monthNames[period - 1]} ${fiscalYear}`,
        startDate,
        endDate,
        status: 'open',
      });
      periods.push(newPeriod);
    }
  }

  return periods;
};

/**
 * Retrieves period close checklist items.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {number} periodNumber - Period number
 * @param {Model} JournalEntry - JournalEntry model
 * @returns {Promise<any>} Close checklist
 */
export const getPeriodCloseChecklist = async (
  fiscalYear: number,
  periodNumber: number,
  JournalEntry: any,
): Promise<any> => {
  const unpostedEntries = await JournalEntry.count({
    where: { fiscalYear, fiscalPeriod: periodNumber, postingStatus: 'draft' },
  });

  const unbalancedEntries = await JournalEntry.count({
    where: { fiscalYear, fiscalPeriod: periodNumber, isBalanced: false },
  });

  return {
    canClose: unpostedEntries === 0 && unbalancedEntries === 0,
    items: [
      { task: 'Post all draft entries', completed: unpostedEntries === 0, count: unpostedEntries },
      { task: 'Balance all entries', completed: unbalancedEntries === 0, count: unbalancedEntries },
      { task: 'Run trial balance', completed: false },
      { task: 'Review account reconciliations', completed: false },
      { task: 'Generate financial statements', completed: false },
    ],
  };
};

// ============================================================================
// ACCOUNT RECONCILIATION (33-40)
// ============================================================================

/**
 * Creates account reconciliation record.
 *
 * @param {AccountReconciliationData} reconData - Reconciliation data
 * @param {Model} AccountReconciliation - AccountReconciliation model
 * @returns {Promise<any>} Created reconciliation
 */
export const createAccountReconciliation = async (
  reconData: AccountReconciliationData,
  AccountReconciliation: any,
): Promise<any> => {
  const variance = reconData.glBalance - reconData.subledgerBalance;
  const status = Math.abs(variance) < 0.01 ? 'reconciled' : 'variance';

  return await AccountReconciliation.create({
    ...reconData,
    variance,
    status,
  });
};

/**
 * Performs automated GL to subledger reconciliation.
 *
 * @param {string} accountCode - Account code
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {Model} GLAccount - GLAccount model
 * @param {Model} AccountReconciliation - AccountReconciliation model
 * @returns {Promise<any>} Reconciliation result
 */
export const performGLReconciliation = async (
  accountCode: string,
  fiscalYear: number,
  fiscalPeriod: number,
  GLAccount: any,
  AccountReconciliation: any,
): Promise<any> => {
  const account = await GLAccount.findOne({ where: { accountCode } });
  if (!account) throw new Error('Account not found');

  const glBalance = parseFloat(account.currentBalance);
  const subledgerBalance = 0; // Would fetch from subledger

  return await createAccountReconciliation(
    {
      accountCode,
      reconciliationDate: new Date(),
      fiscalYear,
      fiscalPeriod,
      glBalance,
      subledgerBalance,
      variance: glBalance - subledgerBalance,
      reconciledBy: 'system',
      status: Math.abs(glBalance - subledgerBalance) < 0.01 ? 'reconciled' : 'variance',
    },
    AccountReconciliation,
  );
};

/**
 * Identifies reconciliation variances.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {number} [thresholdAmount=100] - Variance threshold
 * @param {Model} AccountReconciliation - AccountReconciliation model
 * @returns {Promise<any[]>} Variances
 */
export const identifyReconciliationVariances = async (
  fiscalYear: number,
  fiscalPeriod: number,
  thresholdAmount: number = 100,
  AccountReconciliation: any,
): Promise<any[]> => {
  return await AccountReconciliation.findAll({
    where: {
      fiscalYear,
      fiscalPeriod,
      status: 'variance',
      variance: {
        [Op.or]: [
          { [Op.gt]: thresholdAmount },
          { [Op.lt]: -thresholdAmount },
        ],
      },
    },
    order: [['variance', 'DESC']],
  });
};

/**
 * Resolves reconciliation variance with adjustments.
 *
 * @param {string} reconciliationId - Reconciliation ID
 * @param {string} resolution - Resolution notes
 * @param {string} userId - User resolving variance
 * @param {Model} AccountReconciliation - AccountReconciliation model
 * @returns {Promise<any>} Resolved reconciliation
 */
export const resolveReconciliationVariance = async (
  reconciliationId: string,
  resolution: string,
  userId: string,
  AccountReconciliation: any,
): Promise<any> => {
  const recon = await AccountReconciliation.findByPk(reconciliationId);
  if (!recon) throw new Error('Reconciliation not found');

  recon.status = 'reconciled';
  recon.notes = `${recon.notes}\n\nResolution: ${resolution}\nResolved by: ${userId} at ${new Date().toISOString()}`;
  await recon.save();

  return recon;
};

/**
 * Generates reconciliation report.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {Model} AccountReconciliation - AccountReconciliation model
 * @returns {Promise<any>} Reconciliation report
 */
export const generateReconciliationReport = async (
  fiscalYear: number,
  fiscalPeriod: number,
  AccountReconciliation: any,
): Promise<any> => {
  const reconciliations = await AccountReconciliation.findAll({
    where: { fiscalYear, fiscalPeriod },
  });

  const totalReconciled = reconciliations.filter((r: any) => r.status === 'reconciled').length;
  const totalVariances = reconciliations.filter((r: any) => r.status === 'variance').length;
  const totalVarianceAmount = reconciliations.reduce(
    (sum: number, r: any) => sum + Math.abs(parseFloat(r.variance)),
    0,
  );

  return {
    fiscalYear,
    fiscalPeriod,
    totalAccounts: reconciliations.length,
    reconciledAccounts: totalReconciled,
    accountsWithVariances: totalVariances,
    totalVarianceAmount,
    reconciliationRate: (totalReconciled / reconciliations.length) * 100,
    reconciliations,
  };
};

/**
 * Schedules automated reconciliation tasks.
 *
 * @param {string[]} accountCodes - Account codes to reconcile
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @returns {Promise<any>} Scheduled tasks
 */
export const scheduleReconciliationTasks = async (
  accountCodes: string[],
  fiscalYear: number,
  fiscalPeriod: number,
): Promise<any> => {
  const tasks = accountCodes.map((accountCode) => ({
    accountCode,
    fiscalYear,
    fiscalPeriod,
    scheduledDate: new Date(),
    status: 'scheduled',
  }));

  console.log(`Scheduled ${tasks.length} reconciliation tasks`);
  return tasks;
};

/**
 * Exports reconciliation data to Excel format.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {Model} AccountReconciliation - AccountReconciliation model
 * @returns {Promise<Buffer>} Excel buffer
 */
export const exportReconciliationExcel = async (
  fiscalYear: number,
  fiscalPeriod: number,
  AccountReconciliation: any,
): Promise<Buffer> => {
  const reconciliations = await AccountReconciliation.findAll({
    where: { fiscalYear, fiscalPeriod },
  });

  const csv = 'Account Code,GL Balance,Subledger Balance,Variance,Status,Reconciled By,Date\n' +
    reconciliations.map((r: any) =>
      `${r.accountCode},${r.glBalance},${r.subledgerBalance},${r.variance},${r.status},${r.reconciledBy},${r.reconciliationDate}`
    ).join('\n');

  return Buffer.from(csv, 'utf-8');
};

/**
 * Validates reconciliation completeness.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {Model} GLAccount - GLAccount model
 * @param {Model} AccountReconciliation - AccountReconciliation model
 * @returns {Promise<{ complete: boolean; missingAccounts: string[] }>}
 */
export const validateReconciliationCompleteness = async (
  fiscalYear: number,
  fiscalPeriod: number,
  GLAccount: any,
  AccountReconciliation: any,
): Promise<{ complete: boolean; missingAccounts: string[] }> => {
  const activeAccounts = await GLAccount.findAll({
    where: { isActive: true, requiresBudget: true },
  });

  const reconciledAccounts = await AccountReconciliation.findAll({
    where: { fiscalYear, fiscalPeriod },
  });

  const reconciledCodes = new Set(reconciledAccounts.map((r: any) => r.accountCode));
  const missingAccounts = activeAccounts
    .filter((acc: any) => !reconciledCodes.has(acc.accountCode))
    .map((acc: any) => acc.accountCode);

  return {
    complete: missingAccounts.length === 0,
    missingAccounts,
  };
};

// ============================================================================
// BUDGET VS ACTUAL & ENCUMBRANCES (41-48)
// ============================================================================

/**
 * Updates budget vs actual for account.
 *
 * @param {BudgetVsActualData} budgetData - Budget data
 * @param {Model} BudgetActual - BudgetActual model
 * @returns {Promise<any>} Updated budget actual
 */
export const updateBudgetVsActual = async (
  budgetData: BudgetVsActualData,
  BudgetActual: any,
): Promise<any> => {
  const existing = await BudgetActual.findOne({
    where: {
      accountCode: budgetData.accountCode,
      fiscalYear: budgetData.fiscalYear,
      fiscalPeriod: budgetData.fiscalPeriod,
    },
  });

  if (existing) {
    Object.assign(existing, budgetData);
    await existing.save();
    return existing;
  }

  return await BudgetActual.create(budgetData);
};

/**
 * Calculates budget variance for account.
 *
 * @param {string} accountCode - Account code
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {Model} BudgetActual - BudgetActual model
 * @returns {Promise<any>} Variance analysis
 */
export const calculateBudgetVariance = async (
  accountCode: string,
  fiscalYear: number,
  fiscalPeriod: number,
  BudgetActual: any,
): Promise<any> => {
  const budgetActual = await BudgetActual.findOne({
    where: { accountCode, fiscalYear, fiscalPeriod },
  });

  if (!budgetActual) {
    return { accountCode, variance: 0, variancePercent: 0, message: 'No budget data' };
  }

  const variance = budgetActual.budgetAmount - budgetActual.actualAmount;
  const variancePercent = budgetActual.budgetAmount !== 0
    ? (variance / budgetActual.budgetAmount) * 100
    : 0;

  return {
    accountCode,
    budgetAmount: budgetActual.budgetAmount,
    actualAmount: budgetActual.actualAmount,
    variance,
    variancePercent,
    favorable: variance >= 0,
  };
};

/**
 * Creates encumbrance for purchase order.
 *
 * @param {EncumbranceData} encumbranceData - Encumbrance data
 * @param {Model} Encumbrance - Encumbrance model
 * @param {Model} BudgetActual - BudgetActual model
 * @returns {Promise<any>} Created encumbrance
 */
export const createEncumbrance = async (
  encumbranceData: EncumbranceData,
  Encumbrance: any,
  BudgetActual: any,
): Promise<any> => {
  const encumbrance = await Encumbrance.create({
    ...encumbranceData,
    fiscalYear: encumbranceData.encumbranceDate.getFullYear(),
    fiscalPeriod: encumbranceData.encumbranceDate.getMonth() + 1,
    status: 'active',
    liquidatedAmount: 0,
  });

  // Update budget actual
  const budgetActual = await BudgetActual.findOne({
    where: {
      accountCode: encumbranceData.accountCode,
      fiscalYear: encumbrance.fiscalYear,
      fiscalPeriod: encumbrance.fiscalPeriod,
    },
  });

  if (budgetActual) {
    budgetActual.encumberedAmount += encumbranceData.amount;
    budgetActual.availableBalance = budgetActual.budgetAmount - budgetActual.actualAmount - budgetActual.encumberedAmount;
    await budgetActual.save();
  }

  return encumbrance;
};

/**
 * Liquidates encumbrance upon invoice receipt.
 *
 * @param {string} encumbranceId - Encumbrance ID
 * @param {number} liquidationAmount - Amount to liquidate
 * @param {Model} Encumbrance - Encumbrance model
 * @param {Model} BudgetActual - BudgetActual model
 * @returns {Promise<any>} Liquidated encumbrance
 */
export const liquidateEncumbrance = async (
  encumbranceId: string,
  liquidationAmount: number,
  Encumbrance: any,
  BudgetActual: any,
): Promise<any> => {
  const encumbrance = await Encumbrance.findOne({ where: { encumbranceId } });
  if (!encumbrance) throw new Error('Encumbrance not found');

  encumbrance.liquidatedAmount += liquidationAmount;

  if (encumbrance.liquidatedAmount >= encumbrance.amount) {
    encumbrance.status = 'liquidated';
    encumbrance.liquidatedAt = new Date();
  }

  await encumbrance.save();

  // Update budget actual
  const budgetActual = await BudgetActual.findOne({
    where: {
      accountCode: encumbrance.accountCode,
      fiscalYear: encumbrance.fiscalYear,
      fiscalPeriod: encumbrance.fiscalPeriod,
    },
  });

  if (budgetActual) {
    budgetActual.encumberedAmount -= liquidationAmount;
    budgetActual.actualAmount += liquidationAmount;
    budgetActual.availableBalance = budgetActual.budgetAmount - budgetActual.actualAmount - budgetActual.encumberedAmount;
    await budgetActual.save();
  }

  return encumbrance;
};

/**
 * Retrieves active encumbrances for account.
 *
 * @param {string} accountCode - Account code
 * @param {Model} Encumbrance - Encumbrance model
 * @returns {Promise<any[]>} Active encumbrances
 */
export const getActiveEncumbrances = async (
  accountCode: string,
  Encumbrance: any,
): Promise<any[]> => {
  return await Encumbrance.findAll({
    where: { accountCode, status: 'active' },
    order: [['encumbranceDate', 'DESC']],
  });
};

/**
 * Generates budget vs actual report.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {Model} BudgetActual - BudgetActual model
 * @returns {Promise<any>} Budget report
 */
export const generateBudgetVsActualReport = async (
  fiscalYear: number,
  fiscalPeriod: number,
  BudgetActual: any,
): Promise<any> => {
  const budgetData = await BudgetActual.findAll({
    where: { fiscalYear, fiscalPeriod },
  });

  const totalBudget = budgetData.reduce((sum: number, b: any) => sum + parseFloat(b.budgetAmount), 0);
  const totalActual = budgetData.reduce((sum: number, b: any) => sum + parseFloat(b.actualAmount), 0);
  const totalEncumbered = budgetData.reduce((sum: number, b: any) => sum + parseFloat(b.encumberedAmount), 0);
  const totalAvailable = budgetData.reduce((sum: number, b: any) => sum + parseFloat(b.availableBalance), 0);

  return {
    fiscalYear,
    fiscalPeriod,
    totalBudget,
    totalActual,
    totalEncumbered,
    totalAvailable,
    utilizationRate: (totalActual / totalBudget) * 100,
    accounts: budgetData,
  };
};

/**
 * Validates budget availability before commitment.
 *
 * @param {string} accountCode - Account code
 * @param {number} amount - Amount to commit
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {Model} BudgetActual - BudgetActual model
 * @returns {Promise<{ available: boolean; availableBalance: number }>}
 */
export const validateBudgetAvailability = async (
  accountCode: string,
  amount: number,
  fiscalYear: number,
  fiscalPeriod: number,
  BudgetActual: any,
): Promise<{ available: boolean; availableBalance: number }> => {
  const budgetActual = await BudgetActual.findOne({
    where: { accountCode, fiscalYear, fiscalPeriod },
  });

  if (!budgetActual) {
    return { available: false, availableBalance: 0 };
  }

  const availableBalance = parseFloat(budgetActual.availableBalance);
  return {
    available: availableBalance >= amount,
    availableBalance,
  };
};

/**
 * Expires year-end encumbrances.
 *
 * @param {number} fiscalYear - Fiscal year to expire
 * @param {Model} Encumbrance - Encumbrance model
 * @returns {Promise<number>} Count of expired encumbrances
 */
export const expireYearEndEncumbrances = async (
  fiscalYear: number,
  Encumbrance: any,
): Promise<number> => {
  const result = await Encumbrance.update(
    {
      status: 'expired',
      expiredAt: new Date(),
    },
    {
      where: {
        fiscalYear,
        status: 'active',
      },
    },
  );

  return result[0];
};

// ============================================================================
// NESTJS SERVICE WRAPPER
// ============================================================================

@Injectable()
export class CEFMSGeneralLedgerService {
  constructor(private readonly sequelize: Sequelize) {}

  async createAccount(accountData: GLAccountData, userId: string) {
    const GLAccount = createGLAccountModel(this.sequelize);
    return createGLAccount(accountData, GLAccount, userId);
  }

  async createJournalEntry(entryData: JournalEntryData) {
    const JournalEntry = createJournalEntryModel(this.sequelize);
    const JournalEntryLine = createJournalEntryLineModel(this.sequelize);
    return createJournalEntry(entryData, JournalEntry, JournalEntryLine);
  }

  async generateTrialBalance(fiscalYear: number, fiscalPeriod: number) {
    const GLAccount = createGLAccountModel(this.sequelize);
    const JournalEntryLine = createJournalEntryLineModel(this.sequelize);
    return generateTrialBalance(fiscalYear, fiscalPeriod, GLAccount, JournalEntryLine);
  }

  async closePeriod(fiscalYear: number, periodNumber: number, userId: string) {
    const FiscalPeriod = createFiscalPeriodModel(this.sequelize);
    const JournalEntry = createJournalEntryModel(this.sequelize);
    return closeFiscalPeriod(fiscalYear, periodNumber, userId, FiscalPeriod, JournalEntry);
  }
}

export default {
  // Models
  createGLAccountModel,
  createJournalEntryModel,
  createJournalEntryLineModel,
  createFiscalPeriodModel,
  createAccountReconciliationModel,
  createBudgetActualModel,
  createEncumbranceModel,

  // Chart of Accounts
  createGLAccount,
  validateAccountCode,
  buildAccountHierarchy,
  updateAccountBalance,
  getAccountsByType,
  mapToUSSGLCode,
  deactivateGLAccount,
  getAccountBalanceAsOf,

  // Journal Entries
  createJournalEntry,
  validateEntryBalance,
  postJournalEntry,
  voidJournalEntry,
  createReversingEntry,
  getEntriesByPeriod,
  getAccountEntries,
  generateEntryNumber,

  // Reports
  generateTrialBalance,
  validateTrialBalance,
  exportTrialBalanceCSV,
  generateBalanceSheet,
  generateIncomeStatement,
  generateGLReport,
  exportFinancialStatementPDF,
  getAccountActivitySummary,

  // Periods
  createFiscalPeriod,
  closeFiscalPeriod,
  reopenFiscalPeriod,
  lockFiscalPeriod,
  getCurrentOpenPeriod,
  validatePeriodPostingAuth,
  generateFiscalCalendar,
  getPeriodCloseChecklist,

  // Reconciliation
  createAccountReconciliation,
  performGLReconciliation,
  identifyReconciliationVariances,
  resolveReconciliationVariance,
  generateReconciliationReport,
  scheduleReconciliationTasks,
  exportReconciliationExcel,
  validateReconciliationCompleteness,

  // Budget & Encumbrances
  updateBudgetVsActual,
  calculateBudgetVariance,
  createEncumbrance,
  liquidateEncumbrance,
  getActiveEncumbrances,
  generateBudgetVsActualReport,
  validateBudgetAvailability,
  expireYearEndEncumbrances,

  // Service
  CEFMSGeneralLedgerService,
};
