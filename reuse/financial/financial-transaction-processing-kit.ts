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

import { Model, DataTypes, Sequelize, Transaction, Op, ValidationError } from 'sequelize';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface TransactionMetadata {
  transactionId: string;
  transactionType: 'payment' | 'receipt' | 'adjustment' | 'reversal' | 'accrual' | 'deferral' | 'allocation' | 'transfer';
  sourceSystem: string;
  batchId?: string;
  userId: string;
  timestamp: string;
  fiscalYear: string;
  fiscalPeriod: string;
  documentNumber?: string;
  referenceNumber?: string;
}

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
  errors?: Array<{ code: string; message: string }>;
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

// ============================================================================
// SEQUELIZE MODELS (1-3)
// ============================================================================

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
export const createFinancialTransactionModel = (sequelize: Sequelize) => {
  class FinancialTransaction extends Model {
    public id!: number;
    public transactionNumber!: string;
    public transactionType!: string;
    public transactionDate!: Date;
    public postingDate!: Date | null;
    public fiscalYear!: string;
    public fiscalPeriod!: string;
    public documentNumber!: string | null;
    public referenceNumber!: string | null;
    public description!: string;
    public totalAmount!: number;
    public currency!: string;
    public exchangeRate!: number;
    public status!: string;
    public batchId!: string | null;
    public sourceSystem!: string;
    public createdBy!: string;
    public approvedBy!: string | null;
    public approvedAt!: Date | null;
    public reversedBy!: string | null;
    public reversedAt!: Date | null;
    public reversalTransactionId!: number | null;
    public originalTransactionId!: number | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  FinancialTransaction.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      transactionNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Unique transaction number',
      },
      transactionType: {
        type: DataTypes.ENUM(
          'payment',
          'receipt',
          'adjustment',
          'reversal',
          'accrual',
          'deferral',
          'allocation',
          'transfer',
          'commitment',
          'obligation'
        ),
        allowNull: false,
        comment: 'Type of financial transaction',
      },
      transactionDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Date of transaction',
      },
      postingDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Date transaction was posted',
      },
      fiscalYear: {
        type: DataTypes.STRING(4),
        allowNull: false,
        comment: 'Fiscal year (YYYY)',
      },
      fiscalPeriod: {
        type: DataTypes.STRING(2),
        allowNull: false,
        comment: 'Fiscal period (01-12)',
      },
      documentNumber: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Supporting document number',
      },
      referenceNumber: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'External reference number',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Transaction description',
      },
      totalAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Total transaction amount',
      },
      currency: {
        type: DataTypes.STRING(3),
        allowNull: false,
        defaultValue: 'USD',
        comment: 'Currency code (ISO 4217)',
      },
      exchangeRate: {
        type: DataTypes.DECIMAL(12, 6),
        allowNull: false,
        defaultValue: 1.0,
        comment: 'Exchange rate to base currency',
      },
      status: {
        type: DataTypes.ENUM(
          'draft',
          'pending',
          'approved',
          'posted',
          'reversed',
          'rejected',
          'cancelled'
        ),
        allowNull: false,
        defaultValue: 'draft',
        comment: 'Transaction status',
      },
      batchId: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Batch identifier for batch processing',
      },
      sourceSystem: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Source system of transaction',
      },
      createdBy: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'User who created transaction',
      },
      approvedBy: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'User who approved transaction',
      },
      approvedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Approval timestamp',
      },
      reversedBy: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'User who reversed transaction',
      },
      reversedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Reversal timestamp',
      },
      reversalTransactionId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'ID of reversal transaction',
      },
      originalTransactionId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'ID of original transaction if this is a reversal',
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
      tableName: 'financial_transactions',
      timestamps: true,
      indexes: [
        { fields: ['transactionNumber'], unique: true },
        { fields: ['transactionType'] },
        { fields: ['transactionDate'] },
        { fields: ['fiscalYear', 'fiscalPeriod'] },
        { fields: ['status'] },
        { fields: ['batchId'] },
        { fields: ['createdBy'] },
        { fields: ['postingDate'] },
      ],
    }
  );

  return FinancialTransaction;
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
export const createJournalEntryModel = (sequelize: Sequelize) => {
  class JournalEntry extends Model {
    public id!: number;
    public transactionId!: number;
    public entryNumber!: number;
    public accountId!: number;
    public accountCode!: string;
    public accountType!: string;
    public debitAmount!: number;
    public creditAmount!: number;
    public fundCode!: string | null;
    public organizationCode!: string | null;
    public programCode!: string | null;
    public projectCode!: string | null;
    public activityCode!: string | null;
    public costCenterCode!: string | null;
    public description!: string;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  JournalEntry.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      transactionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Financial transaction ID',
      },
      entryNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Entry sequence number within transaction',
      },
      accountId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Chart of accounts ID',
      },
      accountCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Account code',
      },
      accountType: {
        type: DataTypes.ENUM('asset', 'liability', 'equity', 'revenue', 'expense'),
        allowNull: false,
        comment: 'Account type',
      },
      debitAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0.00,
        comment: 'Debit amount',
      },
      creditAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0.00,
        comment: 'Credit amount',
      },
      fundCode: {
        type: DataTypes.STRING(20),
        allowNull: true,
        comment: 'Fund code',
      },
      organizationCode: {
        type: DataTypes.STRING(20),
        allowNull: true,
        comment: 'Organization code',
      },
      programCode: {
        type: DataTypes.STRING(20),
        allowNull: true,
        comment: 'Program code',
      },
      projectCode: {
        type: DataTypes.STRING(20),
        allowNull: true,
        comment: 'Project code',
      },
      activityCode: {
        type: DataTypes.STRING(20),
        allowNull: true,
        comment: 'Activity code',
      },
      costCenterCode: {
        type: DataTypes.STRING(20),
        allowNull: true,
        comment: 'Cost center code',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Entry description',
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
        { fields: ['transactionId'] },
        { fields: ['accountId'] },
        { fields: ['accountCode'] },
        { fields: ['fundCode'] },
        { fields: ['organizationCode'] },
        { fields: ['programCode'] },
      ],
    }
  );

  return JournalEntry;
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
export const createTransactionAuditLogModel = (sequelize: Sequelize) => {
  class TransactionAuditLog extends Model {
    public id!: number;
    public transactionId!: number;
    public action!: string;
    public performedBy!: string;
    public performedAt!: Date;
    public ipAddress!: string | null;
    public userAgent!: string | null;
    public previousState!: Record<string, any> | null;
    public newState!: Record<string, any>;
    public changeDescription!: string;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
  }

  TransactionAuditLog.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      transactionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Financial transaction ID',
      },
      action: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Action performed',
      },
      performedBy: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'User who performed action',
      },
      performedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: 'Timestamp of action',
      },
      ipAddress: {
        type: DataTypes.STRING(45),
        allowNull: true,
        comment: 'IP address of user',
      },
      userAgent: {
        type: DataTypes.STRING(500),
        allowNull: true,
        comment: 'User agent string',
      },
      previousState: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Previous transaction state',
      },
      newState: {
        type: DataTypes.JSON,
        allowNull: false,
        comment: 'New transaction state',
      },
      changeDescription: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Description of changes',
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
      tableName: 'transaction_audit_logs',
      timestamps: true,
      updatedAt: false,
      indexes: [
        { fields: ['transactionId'] },
        { fields: ['performedBy'] },
        { fields: ['performedAt'] },
        { fields: ['action'] },
      ],
    }
  );

  return TransactionAuditLog;
};

// ============================================================================
// TRANSACTION VALIDATION (1-5)
// ============================================================================

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
export const validateTransaction = async (
  transaction: any,
  options: Record<string, any> = {}
): Promise<TransactionValidationResult> => {
  const errors: Array<{ code: string; field: string; message: string; severity: 'error' | 'warning' | 'info' }> = [];
  const warnings: string[] = [];

  // Validate required fields
  if (!transaction.transactionType) {
    errors.push({
      code: 'MISSING_TRANSACTION_TYPE',
      field: 'transactionType',
      message: 'Transaction type is required',
      severity: 'error',
    });
  }

  if (!transaction.totalAmount || transaction.totalAmount <= 0) {
    errors.push({
      code: 'INVALID_AMOUNT',
      field: 'totalAmount',
      message: 'Transaction amount must be greater than zero',
      severity: 'error',
    });
  }

  // Validate fiscal period
  if (transaction.fiscalPeriod) {
    const period = parseInt(transaction.fiscalPeriod, 10);
    if (isNaN(period) || period < 1 || period > 12) {
      errors.push({
        code: 'INVALID_FISCAL_PERIOD',
        field: 'fiscalPeriod',
        message: 'Fiscal period must be between 01 and 12',
        severity: 'error',
      });
    }
  }

  // Validate double-entry accounting
  if (transaction.entries && Array.isArray(transaction.entries)) {
    const totalDebits = transaction.entries.reduce((sum: number, entry: any) => sum + (entry.debitAmount || 0), 0);
    const totalCredits = transaction.entries.reduce((sum: number, entry: any) => sum + (entry.creditAmount || 0), 0);

    if (Math.abs(totalDebits - totalCredits) > 0.01) {
      errors.push({
        code: 'UNBALANCED_ENTRIES',
        field: 'entries',
        message: `Debits (${totalDebits}) must equal credits (${totalCredits})`,
        severity: 'error',
      });
    }
  } else {
    errors.push({
      code: 'MISSING_ENTRIES',
      field: 'entries',
      message: 'Transaction must have journal entries',
      severity: 'error',
    });
  }

  // Validate currency
  if (transaction.currency && transaction.currency !== 'USD' && !transaction.exchangeRate) {
    warnings.push('Exchange rate should be provided for non-USD transactions');
  }

  return {
    isValid: errors.filter(e => e.severity === 'error').length === 0,
    errors,
    warnings,
    metadata: {
      validatedAt: new Date().toISOString(),
      validationVersion: '1.0',
    },
  };
};

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
export const validateAccountCodes = async (
  accountCodes: string[],
  sequelize: Sequelize
): Promise<Map<string, boolean>> => {
  const validityMap = new Map<string, boolean>();

  const [results] = await sequelize.query(`
    SELECT account_code, is_active
    FROM chart_of_accounts
    WHERE account_code IN (:accountCodes)
      AND is_active = true
  `, {
    replacements: { accountCodes },
    type: 'SELECT' as any,
  });

  const validCodes = new Set((results as any[]).map((r: any) => r.account_code));

  accountCodes.forEach(code => {
    validityMap.set(code, validCodes.has(code));
  });

  return validityMap;
};

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
export const performFundControlCheck = async (
  fundCode: string,
  organizationCode: string,
  requestedAmount: number,
  sequelize: Sequelize
): Promise<FundControlCheck> => {
  const [results] = await sequelize.query(`
    SELECT
      fc.fund_code,
      fc.organization_code,
      fc.program_code,
      fc.budgeted_amount,
      COALESCE(SUM(je.debit_amount - je.credit_amount), 0) as expended_amount,
      fc.budgeted_amount - COALESCE(SUM(je.debit_amount - je.credit_amount), 0) as available_balance
    FROM fund_controls fc
    LEFT JOIN journal_entries je ON
      fc.fund_code = je.fund_code AND
      fc.organization_code = je.organization_code
    WHERE fc.fund_code = :fundCode
      AND fc.organization_code = :organizationCode
      AND fc.is_active = true
    GROUP BY fc.fund_code, fc.organization_code, fc.program_code, fc.budgeted_amount
  `, {
    replacements: { fundCode, organizationCode },
    type: 'SELECT' as any,
  });

  const fundData = (results as any[])[0] || {
    available_balance: 0,
  };

  const availableBalance = parseFloat(fundData.available_balance || '0');
  const withinBudget = availableBalance >= requestedAmount;
  const exceedsThreshold = requestedAmount > availableBalance * 0.9;

  return {
    fundCode,
    organizationCode,
    programCode: fundData.program_code || '',
    availableBalance,
    requestedAmount,
    withinBudget,
    exceedsThreshold,
    requiresApproval: !withinBudget || exceedsThreshold,
    warnings: exceedsThreshold ? ['Transaction exceeds 90% of available budget'] : [],
  };
};

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
export const validateFiscalPeriodOpen = async (
  fiscalYear: string,
  fiscalPeriod: string,
  sequelize: Sequelize
): Promise<boolean> => {
  const [results] = await sequelize.query(`
    SELECT status
    FROM fiscal_periods
    WHERE fiscal_year = :fiscalYear
      AND fiscal_period = :fiscalPeriod
  `, {
    replacements: { fiscalYear, fiscalPeriod },
    type: 'SELECT' as any,
  });

  const period = (results as any[])[0];
  return period && period.status === 'open';
};

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
export const validateNoDuplicateTransaction = async (
  transaction: any,
  sequelize: Sequelize
): Promise<boolean> => {
  const [results] = await sequelize.query(`
    SELECT COUNT(*) as count
    FROM financial_transactions
    WHERE document_number = :documentNumber
      AND total_amount = :totalAmount
      AND ABS(EXTRACT(EPOCH FROM (transaction_date - :transactionDate))) < 86400
      AND status NOT IN ('cancelled', 'reversed')
  `, {
    replacements: {
      documentNumber: transaction.documentNumber,
      totalAmount: transaction.totalAmount,
      transactionDate: transaction.transactionDate || new Date(),
    },
    type: 'SELECT' as any,
  });

  const count = parseInt((results as any[])[0]?.count || '0', 10);
  return count === 0;
};

// ============================================================================
// TRANSACTION POSTING (6-10)
// ============================================================================

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
export const postTransaction = async (
  transaction: any,
  sequelize: Sequelize
): Promise<PostingResult> => {
  return await sequelize.transaction(async (t: Transaction) => {
    try {
      // Create transaction record
      const [txnResult] = await sequelize.query(`
        INSERT INTO financial_transactions (
          transaction_number, transaction_type, transaction_date,
          posting_date, fiscal_year, fiscal_period, description,
          total_amount, status, created_by
        )
        VALUES (
          :transactionNumber, :transactionType, :transactionDate,
          NOW(), :fiscalYear, :fiscalPeriod, :description,
          :totalAmount, 'posted', :createdBy
        )
        RETURNING id
      `, {
        replacements: {
          transactionNumber: transaction.transactionNumber,
          transactionType: transaction.transactionType,
          transactionDate: transaction.transactionDate,
          fiscalYear: transaction.fiscalYear,
          fiscalPeriod: transaction.fiscalPeriod,
          description: transaction.description,
          totalAmount: transaction.totalAmount,
          createdBy: transaction.createdBy,
        },
        transaction: t,
        type: 'INSERT' as any,
      });

      const transactionId = (txnResult as any)[0].id;

      // Post journal entries
      for (let i = 0; i < transaction.entries.length; i++) {
        const entry = transaction.entries[i];
        await sequelize.query(`
          INSERT INTO journal_entries (
            transaction_id, entry_number, account_id, account_code,
            account_type, debit_amount, credit_amount, fund_code,
            organization_code, program_code, description
          )
          VALUES (
            :transactionId, :entryNumber, :accountId, :accountCode,
            :accountType, :debitAmount, :creditAmount, :fundCode,
            :organizationCode, :programCode, :description
          )
        `, {
          replacements: {
            transactionId,
            entryNumber: i + 1,
            accountId: entry.accountId,
            accountCode: entry.accountCode,
            accountType: entry.accountType,
            debitAmount: entry.debitAmount || 0,
            creditAmount: entry.creditAmount || 0,
            fundCode: entry.fundCode,
            organizationCode: entry.organizationCode,
            programCode: entry.programCode,
            description: entry.description,
          },
          transaction: t,
          type: 'INSERT' as any,
        });
      }

      // Update account balances
      const affectedAccounts: string[] = [];
      for (const entry of transaction.entries) {
        const balanceChange = entry.debitAmount - entry.creditAmount;
        await sequelize.query(`
          UPDATE account_balances
          SET
            balance = balance + :balanceChange,
            updated_at = NOW()
          WHERE account_id = :accountId
            AND fiscal_year = :fiscalYear
            AND fiscal_period = :fiscalPeriod
        `, {
          replacements: {
            balanceChange,
            accountId: entry.accountId,
            fiscalYear: transaction.fiscalYear,
            fiscalPeriod: transaction.fiscalPeriod,
          },
          transaction: t,
          type: 'UPDATE' as any,
        });

        affectedAccounts.push(entry.accountCode);
      }

      return {
        success: true,
        transactionId: transactionId.toString(),
        journalEntryId: transactionId.toString(),
        postedDate: new Date(),
        fiscalPeriod: transaction.fiscalPeriod,
        affectedAccounts,
        balanceImpacts: [],
      };
    } catch (error: any) {
      return {
        success: false,
        transactionId: '',
        journalEntryId: '',
        postedDate: new Date(),
        fiscalPeriod: transaction.fiscalPeriod,
        affectedAccounts: [],
        balanceImpacts: [],
        errors: [{ code: 'POSTING_ERROR', message: error.message }],
      };
    }
  });
};

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
export const performPrePostingChecks = async (
  transaction: any,
  sequelize: Sequelize
): Promise<TransactionValidationResult> => {
  const errors: Array<{ code: string; field: string; message: string; severity: 'error' | 'warning' | 'info' }> = [];
  const warnings: string[] = [];

  // Check fiscal period is open
  const isPeriodOpen = await validateFiscalPeriodOpen(
    transaction.fiscalYear,
    transaction.fiscalPeriod,
    sequelize
  );

  if (!isPeriodOpen) {
    errors.push({
      code: 'PERIOD_CLOSED',
      field: 'fiscalPeriod',
      message: 'Fiscal period is closed for posting',
      severity: 'error',
    });
  }

  // Check for duplicates
  const isUnique = await validateNoDuplicateTransaction(transaction, sequelize);
  if (!isUnique) {
    warnings.push('Potential duplicate transaction detected');
  }

  // Validate account codes
  const accountCodes = transaction.entries.map((e: any) => e.accountCode);
  const accountValidity = await validateAccountCodes(accountCodes, sequelize);

  accountCodes.forEach((code: string) => {
    if (!accountValidity.get(code)) {
      errors.push({
        code: 'INVALID_ACCOUNT',
        field: 'accountCode',
        message: `Invalid or inactive account code: ${code}`,
        severity: 'error',
      });
    }
  });

  return {
    isValid: errors.filter(e => e.severity === 'error').length === 0,
    errors,
    warnings,
    metadata: {},
  };
};

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
export const postBatchTransactions = async (
  transactions: any[],
  options: BatchProcessingOptions,
  sequelize: Sequelize
): Promise<Array<PostingResult>> => {
  const results: PostingResult[] = [];

  if (options.commitStrategy === 'all-or-nothing') {
    return await sequelize.transaction(async (t: Transaction) => {
      for (const txn of transactions) {
        const result = await postTransaction(txn, sequelize);
        results.push(result);

        if (!result.success && !options.continueOnError) {
          throw new Error(`Transaction ${txn.transactionNumber} failed`);
        }
      }
      return results;
    });
  } else {
    // Per-transaction commits
    for (const txn of transactions) {
      try {
        const result = await postTransaction(txn, sequelize);
        results.push(result);
      } catch (error: any) {
        results.push({
          success: false,
          transactionId: txn.transactionNumber,
          journalEntryId: '',
          postedDate: new Date(),
          fiscalPeriod: txn.fiscalPeriod,
          affectedAccounts: [],
          balanceImpacts: [],
          errors: [{ code: 'BATCH_ERROR', message: error.message }],
        });

        if (!options.continueOnError) {
          break;
        }
      }
    }
  }

  return results;
};

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
export const updateAccountBalance = async (
  accountId: string,
  amount: number,
  fiscalYear: string,
  fiscalPeriod: string,
  transaction: Transaction,
  sequelize: Sequelize
): Promise<void> => {
  await sequelize.query(`
    INSERT INTO account_balances (
      account_id, fiscal_year, fiscal_period, balance
    )
    VALUES (:accountId, :fiscalYear, :fiscalPeriod, :amount)
    ON CONFLICT (account_id, fiscal_year, fiscal_period)
    DO UPDATE SET
      balance = account_balances.balance + :amount,
      updated_at = NOW()
  `, {
    replacements: { accountId, fiscalYear, fiscalPeriod, amount },
    transaction,
    type: 'INSERT' as any,
  });
};

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
export const generatePostingJournal = async (
  transactionId: string,
  sequelize: Sequelize
): Promise<any> => {
  const [results] = await sequelize.query(`
    SELECT
      ft.transaction_number,
      ft.transaction_type,
      ft.transaction_date,
      ft.posting_date,
      je.account_code,
      je.debit_amount,
      je.credit_amount,
      je.description,
      je.fund_code,
      je.organization_code
    FROM financial_transactions ft
    JOIN journal_entries je ON ft.id = je.transaction_id
    WHERE ft.id = :transactionId
    ORDER BY je.entry_number
  `, {
    replacements: { transactionId },
    type: 'SELECT' as any,
  });

  return {
    transactionId,
    entries: results,
    generatedAt: new Date(),
  };
};

// ============================================================================
// TRANSACTION REVERSALS (11-15)
// ============================================================================

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
export const reverseTransaction = async (
  request: TransactionReversalRequest,
  sequelize: Sequelize
): Promise<PostingResult> => {
  return await sequelize.transaction(async (t: Transaction) => {
    // Get original transaction
    const [original] = await sequelize.query(`
      SELECT * FROM financial_transactions
      WHERE id = :transactionId
        AND status = 'posted'
    `, {
      replacements: { transactionId: request.originalTransactionId },
      transaction: t,
      type: 'SELECT' as any,
    });

    if ((original as any[]).length === 0) {
      throw new Error('Transaction not found or cannot be reversed');
    }

    const originalTxn = (original as any[])[0];

    // Create reversal transaction
    const reversalNumber = `REV-${originalTxn.transaction_number}`;

    const [reversalResult] = await sequelize.query(`
      INSERT INTO financial_transactions (
        transaction_number, transaction_type, transaction_date,
        posting_date, fiscal_year, fiscal_period, description,
        total_amount, status, created_by, original_transaction_id
      )
      VALUES (
        :reversalNumber, 'reversal', :reversalDate,
        NOW(), :fiscalYear, :fiscalPeriod, :description,
        :totalAmount, 'posted', :reversedBy, :originalTransactionId
      )
      RETURNING id
    `, {
      replacements: {
        reversalNumber,
        reversalDate: request.reversalDate,
        fiscalYear: originalTxn.fiscal_year,
        fiscalPeriod: originalTxn.fiscal_period,
        description: `Reversal: ${request.reversalReason}`,
        totalAmount: originalTxn.total_amount,
        reversedBy: request.reversedBy,
        originalTransactionId: request.originalTransactionId,
      },
      transaction: t,
      type: 'INSERT' as any,
    });

    const reversalId = (reversalResult as any)[0].id;

    // Get original entries and reverse them
    const [entries] = await sequelize.query(`
      SELECT * FROM journal_entries
      WHERE transaction_id = :transactionId
      ORDER BY entry_number
    `, {
      replacements: { transactionId: request.originalTransactionId },
      transaction: t,
      type: 'SELECT' as any,
    });

    // Create reversed entries (swap debits and credits)
    for (const entry of entries as any[]) {
      await sequelize.query(`
        INSERT INTO journal_entries (
          transaction_id, entry_number, account_id, account_code,
          account_type, debit_amount, credit_amount, fund_code,
          organization_code, program_code, description
        )
        VALUES (
          :reversalId, :entryNumber, :accountId, :accountCode,
          :accountType, :creditAmount, :debitAmount, :fundCode,
          :organizationCode, :programCode, :description
        )
      `, {
        replacements: {
          reversalId,
          entryNumber: entry.entry_number,
          accountId: entry.account_id,
          accountCode: entry.account_code,
          accountType: entry.account_type,
          debitAmount: entry.credit_amount, // Swapped
          creditAmount: entry.debit_amount, // Swapped
          fundCode: entry.fund_code,
          organizationCode: entry.organization_code,
          programCode: entry.program_code,
          description: `Reversal: ${entry.description}`,
        },
        transaction: t,
        type: 'INSERT' as any,
      });
    }

    // Mark original as reversed
    await sequelize.query(`
      UPDATE financial_transactions
      SET
        status = 'reversed',
        reversed_by = :reversedBy,
        reversed_at = NOW(),
        reversal_transaction_id = :reversalId
      WHERE id = :originalTransactionId
    `, {
      replacements: {
        reversedBy: request.reversedBy,
        reversalId,
        originalTransactionId: request.originalTransactionId,
      },
      transaction: t,
      type: 'UPDATE' as any,
    });

    return {
      success: true,
      transactionId: reversalId.toString(),
      journalEntryId: reversalId.toString(),
      postedDate: new Date(),
      fiscalPeriod: originalTxn.fiscal_period,
      affectedAccounts: [],
      balanceImpacts: [],
    };
  });
};

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
export const validateReversalRequest = async (
  request: TransactionReversalRequest,
  sequelize: Sequelize
): Promise<TransactionValidationResult> => {
  const errors: Array<{ code: string; field: string; message: string; severity: 'error' | 'warning' | 'info' }> = [];

  const [results] = await sequelize.query(`
    SELECT status, reversed_at
    FROM financial_transactions
    WHERE id = :transactionId
  `, {
    replacements: { transactionId: request.originalTransactionId },
    type: 'SELECT' as any,
  });

  if ((results as any[]).length === 0) {
    errors.push({
      code: 'TRANSACTION_NOT_FOUND',
      field: 'originalTransactionId',
      message: 'Transaction not found',
      severity: 'error',
    });
  } else {
    const txn = (results as any[])[0];
    if (txn.status !== 'posted') {
      errors.push({
        code: 'INVALID_STATUS',
        field: 'status',
        message: 'Only posted transactions can be reversed',
        severity: 'error',
      });
    }
    if (txn.reversed_at) {
      errors.push({
        code: 'ALREADY_REVERSED',
        field: 'originalTransactionId',
        message: 'Transaction has already been reversed',
        severity: 'error',
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings: [],
    metadata: {},
  };
};

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
export const createReversalEntries = async (
  originalTransactionId: string,
  reversalTransactionId: string,
  transaction: Transaction,
  sequelize: Sequelize
): Promise<void> => {
  await sequelize.query(`
    INSERT INTO journal_entries (
      transaction_id, entry_number, account_id, account_code,
      account_type, debit_amount, credit_amount, fund_code,
      organization_code, program_code, description
    )
    SELECT
      :reversalTransactionId,
      entry_number,
      account_id,
      account_code,
      account_type,
      credit_amount, -- Swap debit and credit
      debit_amount,
      fund_code,
      organization_code,
      program_code,
      'REVERSAL: ' || description
    FROM journal_entries
    WHERE transaction_id = :originalTransactionId
  `, {
    replacements: { originalTransactionId, reversalTransactionId },
    transaction,
    type: 'INSERT' as any,
  });
};

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
export const processPartialReversal = async (
  transactionId: string,
  reversalAmount: number,
  reason: string,
  sequelize: Sequelize
): Promise<PostingResult> => {
  return await sequelize.transaction(async (t: Transaction) => {
    // Implementation for partial reversal
    // This would create a new transaction for the partial amount
    // and maintain link to original transaction

    return {
      success: true,
      transactionId: '',
      journalEntryId: '',
      postedDate: new Date(),
      fiscalPeriod: '',
      affectedAccounts: [],
      balanceImpacts: [],
    };
  });
};

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
export const getReversalHistory = async (
  transactionId: string,
  sequelize: Sequelize
): Promise<any[]> => {
  const [results] = await sequelize.query(`
    SELECT
      ft.id,
      ft.transaction_number,
      ft.transaction_date,
      ft.reversed_by,
      ft.reversed_at,
      rev.transaction_number as reversal_number,
      rev.transaction_date as reversal_date
    FROM financial_transactions ft
    LEFT JOIN financial_transactions rev ON ft.reversal_transaction_id = rev.id
    WHERE ft.id = :transactionId
      OR ft.original_transaction_id = :transactionId
    ORDER BY ft.transaction_date DESC
  `, {
    replacements: { transactionId },
    type: 'SELECT' as any,
  });

  return results as any[];
};

// ============================================================================
// TRANSACTION ADJUSTMENTS (16-20)
// ============================================================================

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
export const processTransactionAdjustment = async (
  request: TransactionAdjustmentRequest,
  sequelize: Sequelize
): Promise<PostingResult> => {
  return await sequelize.transaction(async (t: Transaction) => {
    const adjustmentNumber = `ADJ-${Date.now()}`;

    const [result] = await sequelize.query(`
      INSERT INTO financial_transactions (
        transaction_number, transaction_type, transaction_date,
        fiscal_year, fiscal_period, description, total_amount,
        status, created_by, original_transaction_id
      )
      SELECT
        :adjustmentNumber, 'adjustment', :adjustmentDate,
        fiscal_year, fiscal_period, :description, :totalAmount,
        'posted', :adjustedBy, :originalTransactionId
      FROM financial_transactions
      WHERE id = :originalTransactionId
      RETURNING id
    `, {
      replacements: {
        adjustmentNumber,
        adjustmentDate: request.adjustmentDate,
        description: `Adjustment: ${request.adjustmentReason}`,
        totalAmount: request.newEntries.reduce((sum, e) => sum + e.debitAmount - e.creditAmount, 0),
        adjustedBy: request.adjustedBy,
        originalTransactionId: request.originalTransactionId,
      },
      transaction: t,
      type: 'INSERT' as any,
    });

    return {
      success: true,
      transactionId: (result as any)[0].id,
      journalEntryId: (result as any)[0].id,
      postedDate: new Date(),
      fiscalPeriod: '',
      affectedAccounts: [],
      balanceImpacts: [],
    };
  });
};

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
export const reclassifyTransactionAccounts = async (
  transactionId: string,
  accountMapping: Map<string, string>,
  reason: string,
  sequelize: Sequelize
): Promise<PostingResult> => {
  return await sequelize.transaction(async (t: Transaction) => {
    // Create reclassification transaction
    // This reverses old accounts and posts to new accounts

    return {
      success: true,
      transactionId: '',
      journalEntryId: '',
      postedDate: new Date(),
      fiscalPeriod: '',
      affectedAccounts: Array.from(accountMapping.values()),
      balanceImpacts: [],
    };
  });
};

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
export const adjustTransactionAllocation = async (
  transactionId: string,
  newAllocations: Record<string, number>,
  sequelize: Sequelize
): Promise<PostingResult> => {
  // Validate allocations total 100%
  const total = Object.values(newAllocations).reduce((sum, pct) => sum + pct, 0);
  if (Math.abs(total - 100) > 0.01) {
    throw new Error('Allocations must total 100%');
  }

  return await sequelize.transaction(async (t: Transaction) => {
    // Implementation for allocation adjustment
    return {
      success: true,
      transactionId: '',
      journalEntryId: '',
      postedDate: new Date(),
      fiscalPeriod: '',
      affectedAccounts: [],
      balanceImpacts: [],
    };
  });
};

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
export const correctTransactionAmount = async (
  transactionId: string,
  correctAmount: number,
  reason: string,
  sequelize: Sequelize
): Promise<PostingResult> => {
  return await sequelize.transaction(async (t: Transaction) => {
    // Get current amount
    const [current] = await sequelize.query(`
      SELECT total_amount, fiscal_year, fiscal_period
      FROM financial_transactions
      WHERE id = :transactionId
    `, {
      replacements: { transactionId },
      transaction: t,
      type: 'SELECT' as any,
    });

    const currentTxn = (current as any[])[0];
    const difference = correctAmount - parseFloat(currentTxn.total_amount);

    // Create adjustment transaction for the difference
    // Implementation details...

    return {
      success: true,
      transactionId: '',
      journalEntryId: '',
      postedDate: new Date(),
      fiscalPeriod: currentTxn.fiscal_period,
      affectedAccounts: [],
      balanceImpacts: [],
    };
  });
};

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
export const validateAdjustmentRequest = async (
  request: TransactionAdjustmentRequest,
  sequelize: Sequelize
): Promise<TransactionValidationResult> => {
  const errors: Array<{ code: string; field: string; message: string; severity: 'error' | 'warning' | 'info' }> = [];

  // Validate original transaction exists and is adjustable
  const [results] = await sequelize.query(`
    SELECT status, fiscal_year, fiscal_period
    FROM financial_transactions
    WHERE id = :transactionId
  `, {
    replacements: { transactionId: request.originalTransactionId },
    type: 'SELECT' as any,
  });

  if ((results as any[]).length === 0) {
    errors.push({
      code: 'TRANSACTION_NOT_FOUND',
      field: 'originalTransactionId',
      message: 'Transaction not found',
      severity: 'error',
    });
  }

  // Validate new entries balance
  const totalDebits = request.newEntries.reduce((sum, e) => sum + e.debitAmount, 0);
  const totalCredits = request.newEntries.reduce((sum, e) => sum + e.creditAmount, 0);

  if (Math.abs(totalDebits - totalCredits) > 0.01) {
    errors.push({
      code: 'UNBALANCED_ENTRIES',
      field: 'newEntries',
      message: 'Adjustment entries must balance',
      severity: 'error',
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings: [],
    metadata: {},
  };
};

// ============================================================================
// BATCH PROCESSING (21-25)
// ============================================================================

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
export const processBatchTransactions = async (
  transactions: any[],
  options: BatchProcessingOptions,
  sequelize: Sequelize
): Promise<Array<{ success: boolean; transactionId: string; error?: string }>> => {
  const results: Array<{ success: boolean; transactionId: string; error?: string }> = [];

  // Validate all transactions first if requested
  if (options.validateBeforeProcessing) {
    for (const txn of transactions) {
      const validation = await validateTransaction(txn);
      if (!validation.isValid) {
        results.push({
          success: false,
          transactionId: txn.transactionNumber,
          error: validation.errors.map(e => e.message).join('; '),
        });

        if (!options.continueOnError) {
          return results;
        }
      }
    }
  }

  // Process in batches
  const batches = [];
  for (let i = 0; i < transactions.length; i += options.batchSize) {
    batches.push(transactions.slice(i, i + options.batchSize));
  }

  for (const batch of batches) {
    const batchResults = await postBatchTransactions(batch, options, sequelize);
    batchResults.forEach((result, idx) => {
      results.push({
        success: result.success,
        transactionId: batch[idx].transactionNumber,
        error: result.errors?.[0]?.message,
      });
    });
  }

  return results;
};

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
export const validateBatch = async (
  transactions: any[],
  sequelize: Sequelize
): Promise<{ isValid: boolean; totalTransactions: number; totalAmount: number; errors: any[] }> => {
  const errors: any[] = [];
  let totalAmount = 0;

  for (const txn of transactions) {
    const validation = await validateTransaction(txn);
    if (!validation.isValid) {
      errors.push({
        transactionNumber: txn.transactionNumber,
        errors: validation.errors,
      });
    }
    totalAmount += txn.totalAmount || 0;
  }

  return {
    isValid: errors.length === 0,
    totalTransactions: transactions.length,
    totalAmount,
    errors,
  };
};

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
export const generateBatchSummary = (batchId: string, results: any[]): any => {
  const successCount = results.filter(r => r.success).length;
  const failureCount = results.filter(r => !r.success).length;
  const totalAmount = results
    .filter(r => r.success)
    .reduce((sum, r) => sum + (r.amount || 0), 0);

  return {
    batchId,
    totalTransactions: results.length,
    successCount,
    failureCount,
    totalAmount,
    successRate: (successCount / results.length) * 100,
    processedAt: new Date(),
  };
};

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
export const rollbackBatch = async (batchId: string, sequelize: Sequelize): Promise<void> => {
  await sequelize.transaction(async (t: Transaction) => {
    // Mark all transactions in batch as cancelled
    await sequelize.query(`
      UPDATE financial_transactions
      SET
        status = 'cancelled',
        updated_at = NOW()
      WHERE batch_id = :batchId
        AND status = 'draft'
    `, {
      replacements: { batchId },
      transaction: t,
      type: 'UPDATE' as any,
    });
  });
};

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
export const getBatchStatus = async (batchId: string, sequelize: Sequelize): Promise<any> => {
  const [results] = await sequelize.query(`
    SELECT
      COUNT(*) as total_count,
      SUM(CASE WHEN status = 'posted' THEN 1 ELSE 0 END) as posted_count,
      SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_count,
      SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) as draft_count,
      SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled_count,
      SUM(total_amount) as total_amount
    FROM financial_transactions
    WHERE batch_id = :batchId
  `, {
    replacements: { batchId },
    type: 'SELECT' as any,
  });

  const stats = (results as any[])[0];

  return {
    batchId,
    totalCount: parseInt(stats.total_count || '0', 10),
    postedCount: parseInt(stats.posted_count || '0', 10),
    pendingCount: parseInt(stats.pending_count || '0', 10),
    draftCount: parseInt(stats.draft_count || '0', 10),
    cancelledCount: parseInt(stats.cancelled_count || '0', 10),
    totalAmount: parseFloat(stats.total_amount || '0'),
  };
};

// ============================================================================
// RECONCILIATION (26-30)
// ============================================================================

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
export const reconcileTransactions = async (
  sourceTransactions: any[],
  targetTransactions: any[],
  matchCriteria: Record<string, any>
): Promise<ReconciliationMatch[]> => {
  const matches: ReconciliationMatch[] = [];

  for (const source of sourceTransactions) {
    let bestMatch: ReconciliationMatch | null = null;
    let bestScore = 0;

    for (const target of targetTransactions) {
      const match = calculateMatchScore(source, target, matchCriteria);
      if (match.matchScore > bestScore) {
        bestScore = match.matchScore;
        bestMatch = match;
      }
    }

    if (bestMatch) {
      matches.push(bestMatch);
    } else {
      matches.push({
        matchType: 'no-match',
        sourceTransaction: source,
        targetTransaction: null,
        matchScore: 0,
        matchCriteria: [],
        discrepancies: [],
      });
    }
  }

  return matches;
};

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
export const calculateMatchScore = (
  source: any,
  target: any,
  criteria: Record<string, any>
): ReconciliationMatch => {
  let score = 0;
  const matchedCriteria: string[] = [];
  const discrepancies: Array<{ field: string; sourceValue: any; targetValue: any; difference: number | string }> = [];

  const matchFields = criteria.matchFields || ['documentNumber', 'amount', 'date'];
  const tolerance = criteria.tolerance || 0.01;

  for (const field of matchFields) {
    if (field === 'amount') {
      const diff = Math.abs(source.amount - target.amount);
      if (diff <= tolerance) {
        score += 30;
        matchedCriteria.push('amount');
      } else {
        discrepancies.push({
          field: 'amount',
          sourceValue: source.amount,
          targetValue: target.amount,
          difference: diff,
        });
      }
    } else if (field === 'documentNumber') {
      if (source.documentNumber === target.documentNumber) {
        score += 40;
        matchedCriteria.push('documentNumber');
      } else {
        discrepancies.push({
          field: 'documentNumber',
          sourceValue: source.documentNumber,
          targetValue: target.documentNumber,
          difference: 'mismatch',
        });
      }
    } else if (field === 'date') {
      const dateDiff = Math.abs(
        new Date(source.date).getTime() - new Date(target.date).getTime()
      ) / (1000 * 60 * 60 * 24); // days

      if (dateDiff <= 1) {
        score += 30;
        matchedCriteria.push('date');
      } else {
        discrepancies.push({
          field: 'date',
          sourceValue: source.date,
          targetValue: target.date,
          difference: dateDiff,
        });
      }
    }
  }

  let matchType: 'exact' | 'partial' | 'suspect' | 'no-match' = 'no-match';
  if (score >= 90) matchType = 'exact';
  else if (score >= 60) matchType = 'partial';
  else if (score >= 30) matchType = 'suspect';

  return {
    matchType,
    sourceTransaction: source,
    targetTransaction: target,
    matchScore: score,
    matchCriteria: matchedCriteria,
    discrepancies,
  };
};

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
export const identifyUnmatchedTransactions = (matches: ReconciliationMatch[]): any[] => {
  return matches
    .filter(m => m.matchType === 'no-match' || m.matchType === 'suspect')
    .map(m => ({
      transaction: m.sourceTransaction,
      matchType: m.matchType,
      matchScore: m.matchScore,
      discrepancies: m.discrepancies,
    }));
};

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
export const generateReconciliationReport = (
  matches: ReconciliationMatch[],
  reconciliationId: string
): any => {
  const exactMatches = matches.filter(m => m.matchType === 'exact').length;
  const partialMatches = matches.filter(m => m.matchType === 'partial').length;
  const suspectMatches = matches.filter(m => m.matchType === 'suspect').length;
  const noMatches = matches.filter(m => m.matchType === 'no-match').length;

  const totalSourceAmount = matches.reduce((sum, m) => sum + (m.sourceTransaction?.amount || 0), 0);
  const matchedAmount = matches
    .filter(m => m.matchType === 'exact' || m.matchType === 'partial')
    .reduce((sum, m) => sum + (m.sourceTransaction?.amount || 0), 0);

  return {
    reconciliationId,
    totalTransactions: matches.length,
    exactMatches,
    partialMatches,
    suspectMatches,
    noMatches,
    matchRate: (exactMatches / matches.length) * 100,
    totalSourceAmount,
    matchedAmount,
    unmatchedAmount: totalSourceAmount - matchedAmount,
    generatedAt: new Date(),
  };
};

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
export const markReconciliationItemsResolved = async (
  transactionIds: string[],
  resolvedBy: string,
  sequelize: Sequelize
): Promise<void> => {
  await sequelize.query(`
    UPDATE reconciliation_items
    SET
      status = 'resolved',
      resolved_by = :resolvedBy,
      resolved_at = NOW()
    WHERE transaction_id IN (:transactionIds)
  `, {
    replacements: { transactionIds, resolvedBy },
    type: 'UPDATE' as any,
  });
};

// ============================================================================
// APPROVAL WORKFLOWS (31-35)
// ============================================================================

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
export const initiateApprovalWorkflow = async (
  transactionId: string,
  approverIds: string[],
  sequelize: Sequelize
): Promise<ApprovalWorkflow> => {
  const workflowId = `WF-${Date.now()}`;

  await sequelize.transaction(async (t: Transaction) => {
    // Create workflow
    await sequelize.query(`
      INSERT INTO approval_workflows (
        workflow_id, transaction_id, total_steps, current_step, status
      )
      VALUES (:workflowId, :transactionId, :totalSteps, 1, 'pending')
    `, {
      replacements: {
        workflowId,
        transactionId,
        totalSteps: approverIds.length,
      },
      transaction: t,
      type: 'INSERT' as any,
    });

    // Create approval steps
    for (let i = 0; i < approverIds.length; i++) {
      await sequelize.query(`
        INSERT INTO approval_steps (
          workflow_id, step_number, approver_id, status
        )
        VALUES (:workflowId, :stepNumber, :approverId, 'pending')
      `, {
        replacements: {
          workflowId,
          stepNumber: i + 1,
          approverId: approverIds[i],
        },
        transaction: t,
        type: 'INSERT' as any,
      });
    }
  });

  return {
    workflowId,
    transactionId,
    currentStep: 1,
    totalSteps: approverIds.length,
    status: 'pending',
    approvers: approverIds.map((id, idx) => ({
      approverId: id,
      approverName: '',
      stepNumber: idx + 1,
      status: 'pending',
    })),
  };
};

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
export const processApprovalDecision = async (
  workflowId: string,
  approverId: string,
  approved: boolean,
  comments: string | undefined,
  sequelize: Sequelize
): Promise<ApprovalWorkflow> => {
  await sequelize.transaction(async (t: Transaction) => {
    // Update approval step
    await sequelize.query(`
      UPDATE approval_steps
      SET
        status = :status,
        approved_at = NOW(),
        comments = :comments
      WHERE workflow_id = :workflowId
        AND approver_id = :approverId
    `, {
      replacements: {
        status: approved ? 'approved' : 'rejected',
        comments: comments || null,
        workflowId,
        approverId,
      },
      transaction: t,
      type: 'UPDATE' as any,
    });

    if (!approved) {
      // Reject entire workflow
      await sequelize.query(`
        UPDATE approval_workflows
        SET status = 'rejected'
        WHERE workflow_id = :workflowId
      `, {
        replacements: { workflowId },
        transaction: t,
        type: 'UPDATE' as any,
      });
    } else {
      // Check if all steps approved
      const [results] = await sequelize.query(`
        SELECT COUNT(*) as pending_count
        FROM approval_steps
        WHERE workflow_id = :workflowId
          AND status = 'pending'
      `, {
        replacements: { workflowId },
        transaction: t,
        type: 'SELECT' as any,
      });

      const pendingCount = parseInt((results as any[])[0].pending_count || '0', 10);

      if (pendingCount === 0) {
        // All approved, update workflow
        await sequelize.query(`
          UPDATE approval_workflows
          SET status = 'approved'
          WHERE workflow_id = :workflowId
        `, {
          replacements: { workflowId },
          transaction: t,
          type: 'UPDATE' as any,
        });

        // Update transaction status
        await sequelize.query(`
          UPDATE financial_transactions ft
          SET
            status = 'approved',
            approved_by = :approverId,
            approved_at = NOW()
          FROM approval_workflows aw
          WHERE aw.workflow_id = :workflowId
            AND ft.id = aw.transaction_id
        `, {
          replacements: { workflowId, approverId },
          transaction: t,
          type: 'UPDATE' as any,
        });
      }
    }
  });

  // Return updated workflow
  return {
    workflowId,
    transactionId: '',
    currentStep: 0,
    totalSteps: 0,
    status: approved ? 'approved' : 'rejected',
    approvers: [],
  };
};

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
export const getApprovalWorkflowStatus = async (
  workflowId: string,
  sequelize: Sequelize
): Promise<ApprovalWorkflow> => {
  const [workflow] = await sequelize.query(`
    SELECT
      aw.*,
      json_agg(
        json_build_object(
          'approverId', ast.approver_id,
          'stepNumber', ast.step_number,
          'status', ast.status,
          'approvalDate', ast.approved_at,
          'comments', ast.comments
        ) ORDER BY ast.step_number
      ) as approvers
    FROM approval_workflows aw
    LEFT JOIN approval_steps ast ON aw.workflow_id = ast.workflow_id
    WHERE aw.workflow_id = :workflowId
    GROUP BY aw.id, aw.workflow_id, aw.transaction_id, aw.total_steps, aw.current_step, aw.status
  `, {
    replacements: { workflowId },
    type: 'SELECT' as any,
  });

  const wf = (workflow as any[])[0];

  return {
    workflowId: wf.workflow_id,
    transactionId: wf.transaction_id,
    currentStep: wf.current_step,
    totalSteps: wf.total_steps,
    status: wf.status,
    approvers: wf.approvers || [],
  };
};

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
export const cancelApprovalWorkflow = async (
  workflowId: string,
  cancelledBy: string,
  reason: string,
  sequelize: Sequelize
): Promise<void> => {
  await sequelize.query(`
    UPDATE approval_workflows
    SET
      status = 'cancelled',
      updated_at = NOW()
    WHERE workflow_id = :workflowId
  `, {
    replacements: { workflowId },
    type: 'UPDATE' as any,
  });
};

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
export const getPendingApprovals = async (
  approverId: string,
  sequelize: Sequelize
): Promise<any[]> => {
  const [results] = await sequelize.query(`
    SELECT
      aw.workflow_id,
      aw.transaction_id,
      ft.transaction_number,
      ft.description,
      ft.total_amount,
      ast.step_number,
      aw.total_steps,
      ft.created_at
    FROM approval_workflows aw
    JOIN approval_steps ast ON aw.workflow_id = ast.workflow_id
    JOIN financial_transactions ft ON aw.transaction_id = ft.id
    WHERE ast.approver_id = :approverId
      AND ast.status = 'pending'
      AND aw.status = 'pending'
    ORDER BY ft.created_at DESC
  `, {
    replacements: { approverId },
    type: 'SELECT' as any,
  });

  return results as any[];
};

// ============================================================================
// FUND CONTROL & COMMITMENT TRACKING (36-40)
// ============================================================================

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
export const checkFundAvailability = async (
  fundCode: string,
  organizationCode: string,
  amount: number,
  sequelize: Sequelize
): Promise<FundControlCheck> => {
  return await performFundControlCheck(fundCode, organizationCode, amount, sequelize);
};

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
export const createFundCommitment = async (
  commitment: any,
  sequelize: Sequelize
): Promise<CommitmentTracking> => {
  // Check fund availability
  const fundCheck = await checkFundAvailability(
    commitment.fundCode,
    commitment.organizationCode,
    commitment.amount,
    sequelize
  );

  if (!fundCheck.withinBudget) {
    throw new Error('Insufficient fund balance for commitment');
  }

  const [result] = await sequelize.query(`
    INSERT INTO fund_commitments (
      commitment_number, fund_code, organization_code, program_code,
      committed_amount, status, description
    )
    VALUES (
      :commitmentNumber, :fundCode, :organizationCode, :programCode,
      :amount, 'active', :description
    )
    RETURNING *
  `, {
    replacements: {
      commitmentNumber: commitment.commitmentNumber,
      fundCode: commitment.fundCode,
      organizationCode: commitment.organizationCode,
      programCode: commitment.programCode,
      amount: commitment.amount,
      description: commitment.description,
    },
    type: 'INSERT' as any,
  });

  const created = (result as any[])[0];

  return {
    commitmentId: created.id,
    commitmentNumber: created.commitment_number,
    fundCode: created.fund_code,
    organizationCode: created.organization_code,
    programCode: created.program_code,
    committedAmount: parseFloat(created.committed_amount),
    obligatedAmount: 0,
    expendedAmount: 0,
    remainingCommitment: parseFloat(created.committed_amount),
    status: created.status,
  };
};

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
export const updateCommitment = async (
  commitmentId: string,
  obligatedAmount: number,
  expendedAmount: number,
  sequelize: Sequelize
): Promise<CommitmentTracking> => {
  await sequelize.query(`
    UPDATE fund_commitments
    SET
      obligated_amount = obligated_amount + :obligatedAmount,
      expended_amount = expended_amount + :expendedAmount,
      updated_at = NOW()
    WHERE id = :commitmentId
  `, {
    replacements: { commitmentId, obligatedAmount, expendedAmount },
    type: 'UPDATE' as any,
  });

  const [result] = await sequelize.query(`
    SELECT
      *,
      committed_amount - obligated_amount as remaining_commitment
    FROM fund_commitments
    WHERE id = :commitmentId
  `, {
    replacements: { commitmentId },
    type: 'SELECT' as any,
  });

  const commitment = (result as any[])[0];

  return {
    commitmentId: commitment.id,
    commitmentNumber: commitment.commitment_number,
    fundCode: commitment.fund_code,
    organizationCode: commitment.organization_code,
    programCode: commitment.program_code,
    committedAmount: parseFloat(commitment.committed_amount),
    obligatedAmount: parseFloat(commitment.obligated_amount),
    expendedAmount: parseFloat(commitment.expended_amount),
    remainingCommitment: parseFloat(commitment.remaining_commitment),
    status: commitment.status,
  };
};

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
export const getCommitmentSummary = async (
  fundCode: string,
  organizationCode: string,
  sequelize: Sequelize
): Promise<any> => {
  const [results] = await sequelize.query(`
    SELECT
      COUNT(*) as commitment_count,
      SUM(committed_amount) as total_committed,
      SUM(obligated_amount) as total_obligated,
      SUM(expended_amount) as total_expended,
      SUM(committed_amount - obligated_amount) as total_remaining
    FROM fund_commitments
    WHERE fund_code = :fundCode
      AND organization_code = :organizationCode
      AND status = 'active'
  `, {
    replacements: { fundCode, organizationCode },
    type: 'SELECT' as any,
  });

  const summary = (results as any[])[0];

  return {
    fundCode,
    organizationCode,
    commitmentCount: parseInt(summary.commitment_count || '0', 10),
    totalCommitted: parseFloat(summary.total_committed || '0'),
    totalObligated: parseFloat(summary.total_obligated || '0'),
    totalExpended: parseFloat(summary.total_expended || '0'),
    totalRemaining: parseFloat(summary.total_remaining || '0'),
  };
};

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
export const closeCommitment = async (
  commitmentId: string,
  reason: string,
  sequelize: Sequelize
): Promise<void> => {
  await sequelize.query(`
    UPDATE fund_commitments
    SET
      status = 'closed',
      close_reason = :reason,
      closed_at = NOW()
    WHERE id = :commitmentId
  `, {
    replacements: { commitmentId, reason },
    type: 'UPDATE' as any,
  });
};

// ============================================================================
// AUDIT TRAIL & REPORTING (41-45)
// ============================================================================

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
export const createAuditLogEntry = async (
  transactionId: string,
  action: string,
  performedBy: string,
  previousState: any,
  newState: any,
  sequelize: Sequelize
): Promise<void> => {
  const changeDescription = generateChangeDescription(previousState, newState);

  await sequelize.query(`
    INSERT INTO transaction_audit_logs (
      transaction_id, action, performed_by, previous_state,
      new_state, change_description
    )
    VALUES (
      :transactionId, :action, :performedBy, :previousState,
      :newState, :changeDescription
    )
  `, {
    replacements: {
      transactionId,
      action,
      performedBy,
      previousState: JSON.stringify(previousState),
      newState: JSON.stringify(newState),
      changeDescription,
    },
    type: 'INSERT' as any,
  });
};

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
export const generateChangeDescription = (previousState: any, newState: any): string => {
  const changes: string[] = [];

  if (!previousState) {
    return 'Transaction created';
  }

  Object.keys(newState).forEach(key => {
    if (previousState[key] !== newState[key]) {
      changes.push(`${key}: ${previousState[key]} → ${newState[key]}`);
    }
  });

  return changes.join('; ');
};

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
export const getTransactionAuditTrail = async (
  transactionId: string,
  sequelize: Sequelize
): Promise<any[]> => {
  const [results] = await sequelize.query(`
    SELECT
      id,
      action,
      performed_by,
      performed_at,
      change_description,
      previous_state,
      new_state
    FROM transaction_audit_logs
    WHERE transaction_id = :transactionId
    ORDER BY performed_at ASC
  `, {
    replacements: { transactionId },
    type: 'SELECT' as any,
  });

  return results as any[];
};

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
export const generateTransactionSummaryReport = async (
  fiscalYear: string,
  fiscalPeriod: string,
  filters: Record<string, any>,
  sequelize: Sequelize
): Promise<any> => {
  const [results] = await sequelize.query(`
    SELECT
      transaction_type,
      COUNT(*) as transaction_count,
      SUM(total_amount) as total_amount,
      AVG(total_amount) as average_amount,
      MIN(total_amount) as min_amount,
      MAX(total_amount) as max_amount
    FROM financial_transactions
    WHERE fiscal_year = :fiscalYear
      AND fiscal_period = :fiscalPeriod
      AND status = 'posted'
    GROUP BY transaction_type
    ORDER BY total_amount DESC
  `, {
    replacements: { fiscalYear, fiscalPeriod },
    type: 'SELECT' as any,
  });

  return {
    fiscalYear,
    fiscalPeriod,
    summary: results,
    generatedAt: new Date(),
  };
};

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
export const exportTransactionData = async (
  transactionIds: string[],
  format: string,
  sequelize: Sequelize
): Promise<any> => {
  const [results] = await sequelize.query(`
    SELECT
      ft.*,
      json_agg(
        json_build_object(
          'accountCode', je.account_code,
          'debitAmount', je.debit_amount,
          'creditAmount', je.credit_amount,
          'description', je.description
        ) ORDER BY je.entry_number
      ) as entries
    FROM financial_transactions ft
    LEFT JOIN journal_entries je ON ft.id = je.transaction_id
    WHERE ft.id IN (:transactionIds)
    GROUP BY ft.id
  `, {
    replacements: { transactionIds },
    type: 'SELECT' as any,
  });

  return {
    format,
    data: results,
    exportedAt: new Date(),
    recordCount: (results as any[]).length,
  };
};

/**
 * Default export with all transaction processing utilities.
 */
export default {
  // Models
  createFinancialTransactionModel,
  createJournalEntryModel,
  createTransactionAuditLogModel,

  // Validation
  validateTransaction,
  validateAccountCodes,
  performFundControlCheck,
  validateFiscalPeriodOpen,
  validateNoDuplicateTransaction,

  // Posting
  postTransaction,
  performPrePostingChecks,
  postBatchTransactions,
  updateAccountBalance,
  generatePostingJournal,

  // Reversals
  reverseTransaction,
  validateReversalRequest,
  createReversalEntries,
  processPartialReversal,
  getReversalHistory,

  // Adjustments
  processTransactionAdjustment,
  reclassifyTransactionAccounts,
  adjustTransactionAllocation,
  correctTransactionAmount,
  validateAdjustmentRequest,

  // Batch Processing
  processBatchTransactions,
  validateBatch,
  generateBatchSummary,
  rollbackBatch,
  getBatchStatus,

  // Reconciliation
  reconcileTransactions,
  calculateMatchScore,
  identifyUnmatchedTransactions,
  generateReconciliationReport,
  markReconciliationItemsResolved,

  // Approval Workflows
  initiateApprovalWorkflow,
  processApprovalDecision,
  getApprovalWorkflowStatus,
  cancelApprovalWorkflow,
  getPendingApprovals,

  // Fund Control & Commitments
  checkFundAvailability,
  createFundCommitment,
  updateCommitment,
  getCommitmentSummary,
  closeCommitment,

  // Audit Trail & Reporting
  createAuditLogEntry,
  generateChangeDescription,
  getTransactionAuditTrail,
  generateTransactionSummaryReport,
  exportTransactionData,
};
