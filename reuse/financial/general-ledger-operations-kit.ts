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

import { Model, DataTypes, Sequelize, Transaction, Op, ValidationError } from 'sequelize';
import { Injectable } from '@nestjs/common';
import { ApiProperty, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface JournalEntryHeader {
  journalEntryId: number;
  entryNumber: string;
  entryDate: Date;
  postingDate: Date;
  fiscalYear: number;
  fiscalPeriod: number;
  entryType: 'standard' | 'adjusting' | 'closing' | 'reversing' | 'reclassification';
  source: string;
  reference: string;
  description: string;
  status: 'draft' | 'pending' | 'approved' | 'posted' | 'reversed' | 'rejected';
  totalDebit: number;
  totalCredit: number;
}

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

interface PostingBatch {
  batchId: string;
  batchDate: Date;
  fiscalYear: number;
  fiscalPeriod: number;
  entryCount: number;
  totalDebits: number;
  totalCredits: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  processedBy?: string;
  processedAt?: Date;
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

interface ReversalEntry {
  originalEntryId: number;
  reversalEntryId: number;
  reversalDate: Date;
  reversalReason: string;
  reversedBy: string;
}

interface AuditTrailEntry {
  auditId: number;
  tableName: string;
  recordId: number;
  action: 'INSERT' | 'UPDATE' | 'DELETE' | 'POST' | 'REVERSE';
  userId: string;
  timestamp: Date;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  ipAddress?: string;
}

// ============================================================================
// DTO CLASSES
// ============================================================================

export class CreateJournalEntryDto {
  @ApiProperty({ description: 'Entry date', example: '2024-01-15' })
  entryDate!: Date;

  @ApiProperty({ description: 'Posting date', example: '2024-01-15' })
  postingDate!: Date;

  @ApiProperty({ description: 'Entry type', enum: ['standard', 'adjusting', 'closing', 'reversing'] })
  entryType!: string;

  @ApiProperty({ description: 'Source system', example: 'AP' })
  source!: string;

  @ApiProperty({ description: 'Reference number', example: 'INV-12345' })
  reference!: string;

  @ApiProperty({ description: 'Entry description' })
  description!: string;

  @ApiProperty({ description: 'Journal entry lines', type: [Object] })
  lines!: JournalEntryLine[];
}

export class PostJournalEntryDto {
  @ApiProperty({ description: 'Journal entry ID' })
  journalEntryId!: number;

  @ApiProperty({ description: 'Posting date' })
  postingDate!: Date;

  @ApiProperty({ description: 'User posting the entry' })
  userId!: string;
}

export class TrialBalanceRequestDto {
  @ApiProperty({ description: 'Fiscal year' })
  fiscalYear!: number;

  @ApiProperty({ description: 'Fiscal period' })
  fiscalPeriod!: number;

  @ApiProperty({ description: 'Include zero balances', default: false })
  includeZeroBalances?: boolean;

  @ApiProperty({ description: 'Account type filter', required: false })
  accountType?: string;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

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
export const createJournalEntryHeaderModel = (sequelize: Sequelize) => {
  class JournalEntryHeader extends Model {
    public id!: number;
    public entryNumber!: string;
    public entryDate!: Date;
    public postingDate!: Date;
    public fiscalYear!: number;
    public fiscalPeriod!: number;
    public entryType!: string;
    public source!: string;
    public reference!: string;
    public description!: string;
    public status!: string;
    public totalDebit!: number;
    public totalCredit!: number;
    public isBalanced!: boolean;
    public isReversing!: boolean;
    public reversalDate!: Date | null;
    public originalEntryId!: number | null;
    public reversedEntryId!: number | null;
    public batchId!: string | null;
    public approvedBy!: string | null;
    public approvedAt!: Date | null;
    public postedBy!: string | null;
    public postedAt!: Date | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly createdBy!: string;
    public readonly updatedBy!: string;
  }

  JournalEntryHeader.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      entryNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Unique journal entry number',
      },
      entryDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Entry transaction date',
      },
      postingDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Date to post to ledger',
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
        comment: 'Fiscal period (1-13)',
        validate: {
          min: 1,
          max: 13,
        },
      },
      entryType: {
        type: DataTypes.ENUM('standard', 'adjusting', 'closing', 'reversing', 'reclassification'),
        allowNull: false,
        comment: 'Journal entry type',
      },
      source: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Source system (AP, AR, GL, etc.)',
      },
      reference: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Reference number from source',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Entry description',
      },
      status: {
        type: DataTypes.ENUM('draft', 'pending', 'approved', 'posted', 'reversed', 'rejected'),
        allowNull: false,
        defaultValue: 'draft',
        comment: 'Entry status',
      },
      totalDebit: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Total debit amount',
      },
      totalCredit: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Total credit amount',
      },
      isBalanced: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Whether debits equal credits',
      },
      isReversing: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Whether entry should auto-reverse',
      },
      reversalDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Date to reverse entry',
      },
      originalEntryId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Original entry if this is a reversal',
        references: {
          model: 'journal_entry_headers',
          key: 'id',
        },
      },
      reversedEntryId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Reversal entry ID if reversed',
        references: {
          model: 'journal_entry_headers',
          key: 'id',
        },
      },
      batchId: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Posting batch ID',
      },
      approvedBy: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'User who approved entry',
      },
      approvedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Approval timestamp',
      },
      postedBy: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'User who posted entry',
      },
      postedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Posting timestamp',
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
        comment: 'User who created the entry',
      },
      updatedBy: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'User who last updated the entry',
      },
    },
    {
      sequelize,
      tableName: 'journal_entry_headers',
      timestamps: true,
      indexes: [
        { fields: ['entryNumber'], unique: true },
        { fields: ['entryDate'] },
        { fields: ['postingDate'] },
        { fields: ['fiscalYear', 'fiscalPeriod'] },
        { fields: ['status'] },
        { fields: ['source'] },
        { fields: ['batchId'] },
      ],
      hooks: {
        beforeCreate: (entry) => {
          if (!entry.createdBy) {
            throw new Error('createdBy is required');
          }
          entry.updatedBy = entry.createdBy;
        },
        beforeUpdate: (entry) => {
          if (!entry.updatedBy) {
            throw new Error('updatedBy is required');
          }
        },
        beforeSave: (entry) => {
          // Validate balance
          const debit = Number(entry.totalDebit || 0);
          const credit = Number(entry.totalCredit || 0);
          entry.isBalanced = Math.abs(debit - credit) < 0.01;
        },
      },
    },
  );

  return JournalEntryHeader;
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
export const createJournalEntryLineModel = (sequelize: Sequelize) => {
  class JournalEntryLine extends Model {
    public id!: number;
    public journalEntryId!: number;
    public lineNumber!: number;
    public accountId!: number;
    public accountCode!: string;
    public debitAmount!: number;
    public creditAmount!: number;
    public description!: string;
    public dimensions!: Record<string, string>;
    public projectCode!: string | null;
    public activityCode!: string | null;
    public costCenterCode!: string | null;
    public fundCode!: string | null;
    public organizationCode!: string | null;
    public programCode!: string | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  JournalEntryLine.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      journalEntryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Reference to journal entry header',
        references: {
          model: 'journal_entry_headers',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      lineNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Line number within entry',
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
      accountCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Account code (denormalized for performance)',
      },
      debitAmount: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Debit amount',
        validate: {
          min: 0,
        },
      },
      creditAmount: {
        type: DataTypes.DECIMAL(20, 2),
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
        comment: 'Line item description',
      },
      dimensions: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Account dimensions (fund, org, program, etc.)',
      },
      projectCode: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Project code',
      },
      activityCode: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Activity code',
      },
      costCenterCode: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Cost center code',
      },
      fundCode: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Fund code',
      },
      organizationCode: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Organization code',
      },
      programCode: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Program code',
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
        { fields: ['journalEntryId', 'lineNumber'], unique: true },
        { fields: ['accountId'] },
        { fields: ['accountCode'] },
        { fields: ['projectCode'] },
        { fields: ['costCenterCode'] },
      ],
      validate: {
        debitOrCreditRequired() {
          if (Number(this.debitAmount) === 0 && Number(this.creditAmount) === 0) {
            throw new Error('Either debit or credit amount must be non-zero');
          }
          if (Number(this.debitAmount) > 0 && Number(this.creditAmount) > 0) {
            throw new Error('Cannot have both debit and credit amounts');
          }
        },
      },
    },
  );

  return JournalEntryLine;
};

// ============================================================================
// JOURNAL ENTRY CREATION AND MANAGEMENT (1-10)
// ============================================================================

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
export const createJournalEntry = async (
  sequelize: Sequelize,
  entryData: CreateJournalEntryDto,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const JournalEntryHeader = createJournalEntryHeaderModel(sequelize);
  const JournalEntryLine = createJournalEntryLineModel(sequelize);

  // Generate entry number
  const entryNumber = await generateJournalEntryNumber(sequelize, entryData.source, transaction);

  // Determine fiscal year and period
  const { fiscalYear, fiscalPeriod } = getFiscalYearPeriod(entryData.postingDate);

  // Validate period is open
  const isOpen = await isPeriodOpen(sequelize, fiscalYear, fiscalPeriod);
  if (!isOpen) {
    throw new Error(`Fiscal period ${fiscalYear}-${fiscalPeriod} is closed`);
  }

  // Calculate totals
  let totalDebit = 0;
  let totalCredit = 0;

  for (const line of entryData.lines) {
    totalDebit += Number(line.debitAmount || 0);
    totalCredit += Number(line.creditAmount || 0);
  }

  // Validate balance
  if (Math.abs(totalDebit - totalCredit) >= 0.01) {
    throw new Error(`Journal entry is not balanced: Debits=${totalDebit}, Credits=${totalCredit}`);
  }

  // Create header
  const header = await JournalEntryHeader.create(
    {
      entryNumber,
      entryDate: entryData.entryDate,
      postingDate: entryData.postingDate,
      fiscalYear,
      fiscalPeriod,
      entryType: entryData.entryType,
      source: entryData.source,
      reference: entryData.reference,
      description: entryData.description,
      status: 'draft',
      totalDebit,
      totalCredit,
      isBalanced: true,
      createdBy: userId,
      updatedBy: userId,
    },
    { transaction },
  );

  // Create lines
  for (let i = 0; i < entryData.lines.length; i++) {
    const lineData = entryData.lines[i];

    await JournalEntryLine.create(
      {
        journalEntryId: header.id,
        lineNumber: i + 1,
        accountId: lineData.accountId,
        accountCode: lineData.accountCode,
        debitAmount: lineData.debitAmount || 0,
        creditAmount: lineData.creditAmount || 0,
        description: lineData.description,
        dimensions: lineData.dimensions || {},
        projectCode: lineData.projectCode,
        activityCode: lineData.activityCode,
        costCenterCode: lineData.costCenterCode,
      },
      { transaction },
    );
  }

  return header;
};

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
export const updateJournalEntry = async (
  sequelize: Sequelize,
  entryId: number,
  updateData: Partial<CreateJournalEntryDto>,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const JournalEntryHeader = createJournalEntryHeaderModel(sequelize);

  const entry = await JournalEntryHeader.findByPk(entryId, { transaction });
  if (!entry) {
    throw new Error('Journal entry not found');
  }

  if (entry.status !== 'draft') {
    throw new Error('Cannot update journal entry that is not in draft status');
  }

  await entry.update({ ...updateData, updatedBy: userId }, { transaction });

  return entry;
};

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
export const deleteJournalEntry = async (
  sequelize: Sequelize,
  entryId: number,
  userId: string,
  transaction?: Transaction,
): Promise<void> => {
  const JournalEntryHeader = createJournalEntryHeaderModel(sequelize);

  const entry = await JournalEntryHeader.findByPk(entryId, { transaction });
  if (!entry) {
    throw new Error('Journal entry not found');
  }

  if (entry.status !== 'draft') {
    throw new Error('Cannot delete journal entry that is not in draft status');
  }

  await createAuditTrail(sequelize, 'journal_entry_headers', entryId, 'DELETE', userId, {
    entryNumber: entry.entryNumber,
    description: entry.description,
  });

  await entry.destroy({ transaction });
};

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
export const validateJournalEntry = async (
  sequelize: Sequelize,
  entryId: number,
): Promise<{ valid: boolean; errors: string[] }> => {
  const JournalEntryHeader = createJournalEntryHeaderModel(sequelize);
  const JournalEntryLine = createJournalEntryLineModel(sequelize);

  const errors: string[] = [];

  const entry = await JournalEntryHeader.findByPk(entryId);
  if (!entry) {
    return { valid: false, errors: ['Journal entry not found'] };
  }

  // Check balance
  if (!entry.isBalanced) {
    errors.push('Entry is not balanced - debits must equal credits');
  }

  // Check period is open
  const isOpen = await isPeriodOpen(sequelize, entry.fiscalYear, entry.fiscalPeriod);
  if (!isOpen) {
    errors.push(`Fiscal period ${entry.fiscalYear}-${entry.fiscalPeriod} is closed`);
  }

  // Check lines exist
  const lines = await JournalEntryLine.findAll({
    where: { journalEntryId: entryId },
  });

  if (lines.length === 0) {
    errors.push('Entry has no line items');
  }

  // Validate each line
  for (const line of lines) {
    // Check account exists and is active
    const account = await sequelize.query(
      'SELECT * FROM chart_of_accounts WHERE id = ? AND is_active = true',
      {
        replacements: [line.accountId],
        type: 'SELECT',
      },
    );

    if (!account || (account as any[]).length === 0) {
      errors.push(`Account ${line.accountCode} is not active or does not exist`);
    }
  }

  return { valid: errors.length === 0, errors };
};

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
export const approveJournalEntry = async (
  sequelize: Sequelize,
  entryId: number,
  userId: string,
  transaction?: Transaction,
): Promise<void> => {
  const JournalEntryHeader = createJournalEntryHeaderModel(sequelize);

  const entry = await JournalEntryHeader.findByPk(entryId, { transaction });
  if (!entry) {
    throw new Error('Journal entry not found');
  }

  if (entry.status !== 'pending' && entry.status !== 'draft') {
    throw new Error('Entry must be in pending or draft status to approve');
  }

  // Validate before approval
  const validation = await validateJournalEntry(sequelize, entryId);
  if (!validation.valid) {
    throw new Error(`Cannot approve invalid entry: ${validation.errors.join(', ')}`);
  }

  await entry.update(
    {
      status: 'approved',
      approvedBy: userId,
      approvedAt: new Date(),
      updatedBy: userId,
    },
    { transaction },
  );

  await createAuditTrail(sequelize, 'journal_entry_headers', entryId, 'UPDATE', userId, {
    action: 'APPROVE',
    entryNumber: entry.entryNumber,
  });
};

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
export const rejectJournalEntry = async (
  sequelize: Sequelize,
  entryId: number,
  reason: string,
  userId: string,
  transaction?: Transaction,
): Promise<void> => {
  const JournalEntryHeader = createJournalEntryHeaderModel(sequelize);

  const entry = await JournalEntryHeader.findByPk(entryId, { transaction });
  if (!entry) {
    throw new Error('Journal entry not found');
  }

  await entry.update(
    {
      status: 'rejected',
      metadata: {
        ...entry.metadata,
        rejectionReason: reason,
        rejectedBy: userId,
        rejectedAt: new Date().toISOString(),
      },
      updatedBy: userId,
    },
    { transaction },
  );

  await createAuditTrail(sequelize, 'journal_entry_headers', entryId, 'UPDATE', userId, {
    action: 'REJECT',
    reason,
  });
};

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
export const generateJournalEntryNumber = async (
  sequelize: Sequelize,
  source: string,
  transaction?: Transaction,
): Promise<string> => {
  const year = new Date().getFullYear();
  const prefix = `JE-${source}-${year}-`;

  const [results] = await sequelize.query(
    `SELECT entry_number FROM journal_entry_headers
     WHERE entry_number LIKE ?
     ORDER BY entry_number DESC
     LIMIT 1`,
    {
      replacements: [`${prefix}%`],
      transaction,
    },
  );

  let nextNumber = 1;

  if (results && results.length > 0) {
    const lastNumber = (results[0] as any).entry_number;
    const match = lastNumber.match(/(\d+)$/);
    if (match) {
      nextNumber = parseInt(match[1], 10) + 1;
    }
  }

  return `${prefix}${nextNumber.toString().padStart(5, '0')}`;
};

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
export const getJournalEntryWithLines = async (
  sequelize: Sequelize,
  entryId: number,
): Promise<any> => {
  const JournalEntryHeader = createJournalEntryHeaderModel(sequelize);
  const JournalEntryLine = createJournalEntryLineModel(sequelize);

  const header = await JournalEntryHeader.findByPk(entryId);
  if (!header) {
    return null;
  }

  const lines = await JournalEntryLine.findAll({
    where: { journalEntryId: entryId },
    order: [['lineNumber', 'ASC']],
  });

  return {
    ...header.toJSON(),
    lines,
  };
};

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
export const searchJournalEntries = async (
  sequelize: Sequelize,
  criteria: Record<string, any>,
): Promise<any[]> => {
  const JournalEntryHeader = createJournalEntryHeaderModel(sequelize);

  const where: any = {};

  if (criteria.fiscalYear) where.fiscalYear = criteria.fiscalYear;
  if (criteria.fiscalPeriod) where.fiscalPeriod = criteria.fiscalPeriod;
  if (criteria.status) where.status = criteria.status;
  if (criteria.source) where.source = criteria.source;
  if (criteria.entryType) where.entryType = criteria.entryType;
  if (criteria.startDate && criteria.endDate) {
    where.entryDate = { [Op.between]: [criteria.startDate, criteria.endDate] };
  }

  return await JournalEntryHeader.findAll({
    where,
    order: [['entryDate', 'DESC'], ['entryNumber', 'DESC']],
  });
};

// ============================================================================
// POSTING TO GENERAL LEDGER (11-20)
// ============================================================================

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
export const postJournalEntry = async (
  sequelize: Sequelize,
  entryId: number,
  userId: string,
  transaction?: Transaction,
): Promise<void> => {
  const JournalEntryHeader = createJournalEntryHeaderModel(sequelize);
  const JournalEntryLine = createJournalEntryLineModel(sequelize);

  const entry = await JournalEntryHeader.findByPk(entryId, { transaction });
  if (!entry) {
    throw new Error('Journal entry not found');
  }

  if (entry.status !== 'approved') {
    throw new Error('Entry must be approved before posting');
  }

  // Validate entry
  const validation = await validateJournalEntry(sequelize, entryId);
  if (!validation.valid) {
    throw new Error(`Cannot post invalid entry: ${validation.errors.join(', ')}`);
  }

  // Get all lines
  const lines = await JournalEntryLine.findAll({
    where: { journalEntryId: entryId },
    transaction,
  });

  // Post to account balances
  for (const line of lines) {
    const amount = Number(line.debitAmount) > 0 ? Number(line.debitAmount) : Number(line.creditAmount);
    const type = Number(line.debitAmount) > 0 ? 'debit' : 'credit';

    await updateAccountBalanceForPosting(
      sequelize,
      line.accountId,
      entry.fiscalYear,
      entry.fiscalPeriod,
      amount,
      type,
      transaction,
    );
  }

  // Update entry status
  await entry.update(
    {
      status: 'posted',
      postedBy: userId,
      postedAt: new Date(),
      updatedBy: userId,
    },
    { transaction },
  );

  await createAuditTrail(sequelize, 'journal_entry_headers', entryId, 'POST', userId, {
    entryNumber: entry.entryNumber,
    fiscalYear: entry.fiscalYear,
    fiscalPeriod: entry.fiscalPeriod,
  });
};

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
export const batchPostJournalEntries = async (
  sequelize: Sequelize,
  entryIds: number[],
  userId: string,
): Promise<{ batchId: string; posted: number; failed: number; errors: any[] }> => {
  const batchId = `BATCH-${Date.now()}`;
  let posted = 0;
  let failed = 0;
  const errors: any[] = [];

  for (const entryId of entryIds) {
    const t = await sequelize.transaction();

    try {
      await postJournalEntry(sequelize, entryId, userId, t);
      await t.commit();
      posted++;
    } catch (error) {
      await t.rollback();
      failed++;
      errors.push({
        entryId,
        error: (error as Error).message,
      });
    }
  }

  // Record batch
  await sequelize.query(
    `INSERT INTO posting_batches (batch_id, batch_date, entry_count, posted_count, failed_count, status, processed_by, processed_at, created_at, updated_at)
     VALUES (?, NOW(), ?, ?, ?, 'completed', ?, NOW(), NOW(), NOW())`,
    {
      replacements: [batchId, entryIds.length, posted, failed, userId],
    },
  );

  return { batchId, posted, failed, errors };
};

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
export const updateAccountBalanceForPosting = async (
  sequelize: Sequelize,
  accountId: number,
  fiscalYear: number,
  fiscalPeriod: number,
  amount: number,
  type: 'debit' | 'credit',
  transaction?: Transaction,
): Promise<void> => {
  // First, ensure balance record exists
  await sequelize.query(
    `INSERT INTO account_balances (account_id, fiscal_year, fiscal_period, beginning_balance, debit_amount, credit_amount, ending_balance, created_at, updated_at)
     VALUES (?, ?, ?, 0, 0, 0, 0, NOW(), NOW())
     ON CONFLICT (account_id, fiscal_year, fiscal_period) DO NOTHING`,
    {
      replacements: [accountId, fiscalYear, fiscalPeriod],
      transaction,
    },
  );

  // Update appropriate amount
  const field = type === 'debit' ? 'debit_amount' : 'credit_amount';

  await sequelize.query(
    `UPDATE account_balances
     SET ${field} = ${field} + ?,
         ending_balance = beginning_balance + debit_amount - credit_amount,
         available_balance = ending_balance - encumbrance_amount,
         updated_at = NOW()
     WHERE account_id = ? AND fiscal_year = ? AND fiscal_period = ?`,
    {
      replacements: [amount, accountId, fiscalYear, fiscalPeriod],
      transaction,
    },
  );
};

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
export const reverseJournalEntry = async (
  sequelize: Sequelize,
  entryId: number,
  reversalDate: Date,
  reason: string,
  userId: string,
): Promise<any> => {
  const t = await sequelize.transaction();

  try {
    const JournalEntryHeader = createJournalEntryHeaderModel(sequelize);
    const JournalEntryLine = createJournalEntryLineModel(sequelize);

    // Get original entry
    const originalEntry = await JournalEntryHeader.findByPk(entryId, { transaction: t });
    if (!originalEntry) {
      throw new Error('Original journal entry not found');
    }

    if (originalEntry.status !== 'posted') {
      throw new Error('Can only reverse posted entries');
    }

    if (originalEntry.reversedEntryId) {
      throw new Error('Entry has already been reversed');
    }

    // Get original lines
    const originalLines = await JournalEntryLine.findAll({
      where: { journalEntryId: entryId },
      transaction: t,
    });

    // Determine fiscal year/period for reversal
    const { fiscalYear, fiscalPeriod } = getFiscalYearPeriod(reversalDate);

    // Create reversal entry header
    const reversalNumber = await generateJournalEntryNumber(sequelize, 'REV', t);

    const reversalEntry = await JournalEntryHeader.create(
      {
        entryNumber: reversalNumber,
        entryDate: reversalDate,
        postingDate: reversalDate,
        fiscalYear,
        fiscalPeriod,
        entryType: 'reversing',
        source: originalEntry.source,
        reference: `REV-${originalEntry.reference}`,
        description: `Reversal of ${originalEntry.entryNumber}: ${reason}`,
        status: 'approved',
        totalDebit: originalEntry.totalCredit, // Reversed
        totalCredit: originalEntry.totalDebit, // Reversed
        isBalanced: true,
        originalEntryId: entryId,
        createdBy: userId,
        updatedBy: userId,
      },
      { transaction: t },
    );

    // Create reversed lines (swap debits and credits)
    for (const line of originalLines) {
      await JournalEntryLine.create(
        {
          journalEntryId: reversalEntry.id,
          lineNumber: line.lineNumber,
          accountId: line.accountId,
          accountCode: line.accountCode,
          debitAmount: line.creditAmount, // Reversed
          creditAmount: line.debitAmount, // Reversed
          description: `Reversal: ${line.description}`,
          dimensions: line.dimensions,
          projectCode: line.projectCode,
          activityCode: line.activityCode,
          costCenterCode: line.costCenterCode,
        },
        { transaction: t },
      );
    }

    // Post the reversal entry
    await postJournalEntry(sequelize, reversalEntry.id, userId, t);

    // Update original entry
    await originalEntry.update(
      {
        status: 'reversed',
        reversedEntryId: reversalEntry.id,
        updatedBy: userId,
      },
      { transaction: t },
    );

    await createAuditTrail(sequelize, 'journal_entry_headers', entryId, 'UPDATE', userId, {
      action: 'REVERSE',
      reversalEntryId: reversalEntry.id,
      reason,
    }, t);

    await t.commit();

    return reversalEntry;
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

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
export const createAdjustingEntry = async (
  sequelize: Sequelize,
  entryData: CreateJournalEntryDto,
  userId: string,
): Promise<any> => {
  return await createJournalEntry(
    sequelize,
    {
      ...entryData,
      entryType: 'adjusting',
      source: 'ADJ',
    },
    userId,
  );
};

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
export const createClosingEntry = async (
  sequelize: Sequelize,
  fiscalYear: number,
  userId: string,
): Promise<any> => {
  // Get revenue and expense balances
  const [revenues] = await sequelize.query(
    `SELECT ab.account_id, coa.account_code, SUM(ab.credit_amount - ab.debit_amount) as balance
     FROM account_balances ab
     JOIN chart_of_accounts coa ON ab.account_id = coa.id
     WHERE ab.fiscal_year = ? AND coa.account_type = 'REVENUE'
     GROUP BY ab.account_id, coa.account_code
     HAVING SUM(ab.credit_amount - ab.debit_amount) != 0`,
    { replacements: [fiscalYear] },
  );

  const [expenses] = await sequelize.query(
    `SELECT ab.account_id, coa.account_code, SUM(ab.debit_amount - ab.credit_amount) as balance
     FROM account_balances ab
     JOIN chart_of_accounts coa ON ab.account_id = coa.id
     WHERE ab.fiscal_year = ? AND coa.account_type = 'EXPENSE'
     GROUP BY ab.account_id, coa.account_code
     HAVING SUM(ab.debit_amount - ab.credit_amount) != 0`,
    { replacements: [fiscalYear] },
  );

  // Build closing entry lines
  const lines: any[] = [];
  let lineNumber = 1;

  // Close revenue accounts (debit revenue, credit income summary)
  for (const revenue of revenues as any[]) {
    lines.push({
      lineNumber: lineNumber++,
      accountId: revenue.account_id,
      accountCode: revenue.account_code,
      debitAmount: Math.abs(revenue.balance),
      creditAmount: 0,
      description: 'Close revenue to income summary',
      dimensions: {},
    });
  }

  // Close expense accounts (debit income summary, credit expenses)
  for (const expense of expenses as any[]) {
    lines.push({
      lineNumber: lineNumber++,
      accountId: expense.account_id,
      accountCode: expense.account_code,
      debitAmount: 0,
      creditAmount: Math.abs(expense.balance),
      description: 'Close expense to income summary',
      dimensions: {},
    });
  }

  // Add income summary lines (these would balance the entry)
  // In a real implementation, would get income summary account from config

  return await createJournalEntry(
    sequelize,
    {
      entryDate: new Date(fiscalYear, 11, 31), // Dec 31
      postingDate: new Date(fiscalYear, 11, 31),
      entryType: 'closing',
      source: 'CLOSE',
      reference: `CLOSE-${fiscalYear}`,
      description: `Year-end closing entry for ${fiscalYear}`,
      lines,
    },
    userId,
  );
};

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
export const createReclassificationEntry = async (
  sequelize: Sequelize,
  fromAccountId: number,
  toAccountId: number,
  amount: number,
  reason: string,
  userId: string,
): Promise<any> => {
  // Get account codes
  const [fromAccount] = await sequelize.query(
    'SELECT account_code FROM chart_of_accounts WHERE id = ?',
    { replacements: [fromAccountId] },
  );

  const [toAccount] = await sequelize.query(
    'SELECT account_code FROM chart_of_accounts WHERE id = ?',
    { replacements: [toAccountId] },
  );

  if (!fromAccount || (fromAccount as any[]).length === 0) {
    throw new Error('From account not found');
  }

  if (!toAccount || (toAccount as any[]).length === 0) {
    throw new Error('To account not found');
  }

  const fromCode = (fromAccount as any[])[0].account_code;
  const toCode = (toAccount as any[])[0].account_code;

  return await createJournalEntry(
    sequelize,
    {
      entryDate: new Date(),
      postingDate: new Date(),
      entryType: 'reclassification',
      source: 'RECLASS',
      reference: `RECLASS-${fromCode}-${toCode}`,
      description: `Reclassification: ${reason}`,
      lines: [
        {
          lineNumber: 1,
          accountId: fromAccountId,
          accountCode: fromCode,
          debitAmount: 0,
          creditAmount: amount,
          description: `Reclassify from ${fromCode}`,
          dimensions: {},
        },
        {
          lineNumber: 2,
          accountId: toAccountId,
          accountCode: toCode,
          debitAmount: amount,
          creditAmount: 0,
          description: `Reclassify to ${toCode}`,
          dimensions: {},
        },
      ],
    },
    userId,
  );
};

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
export const validatePostingBatch = async (
  sequelize: Sequelize,
  entryIds: number[],
): Promise<{ valid: boolean; errors: any[] }> => {
  const errors: any[] = [];

  for (const entryId of entryIds) {
    const validation = await validateJournalEntry(sequelize, entryId);
    if (!validation.valid) {
      errors.push({
        entryId,
        errors: validation.errors,
      });
    }
  }

  return { valid: errors.length === 0, errors };
};

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
export const unpostJournalEntry = async (
  sequelize: Sequelize,
  entryId: number,
  reason: string,
  userId: string,
): Promise<void> => {
  const t = await sequelize.transaction();

  try {
    const JournalEntryHeader = createJournalEntryHeaderModel(sequelize);
    const JournalEntryLine = createJournalEntryLineModel(sequelize);

    const entry = await JournalEntryHeader.findByPk(entryId, { transaction: t });
    if (!entry) {
      throw new Error('Journal entry not found');
    }

    if (entry.status !== 'posted') {
      throw new Error('Entry is not posted');
    }

    // Get lines
    const lines = await JournalEntryLine.findAll({
      where: { journalEntryId: entryId },
      transaction: t,
    });

    // Reverse the posting to account balances
    for (const line of lines) {
      const amount = Number(line.debitAmount) > 0 ? Number(line.debitAmount) : Number(line.creditAmount);
      const type = Number(line.debitAmount) > 0 ? 'credit' : 'debit'; // Reversed

      await updateAccountBalanceForPosting(
        sequelize,
        line.accountId,
        entry.fiscalYear,
        entry.fiscalPeriod,
        amount,
        type,
        t,
      );
    }

    // Update entry status
    await entry.update(
      {
        status: 'approved',
        postedBy: null,
        postedAt: null,
        metadata: {
          ...entry.metadata,
          unpostReason: reason,
          unpostedBy: userId,
          unpostedAt: new Date().toISOString(),
        },
        updatedBy: userId,
      },
      { transaction: t },
    );

    await createAuditTrail(sequelize, 'journal_entry_headers', entryId, 'UPDATE', userId, {
      action: 'UNPOST',
      reason,
    }, t);

    await t.commit();
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

// ============================================================================
// TRIAL BALANCE AND REPORTING (21-30)
// ============================================================================

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
export const generateTrialBalance = async (
  sequelize: Sequelize,
  fiscalYear: number,
  fiscalPeriod: number,
  includeZeroBalances = false,
): Promise<TrialBalanceEntry[]> => {
  const query = `
    SELECT
      coa.account_code,
      coa.account_name,
      coa.account_type,
      coa.normal_balance,
      COALESCE(SUM(ab.debit_amount), 0) as total_debits,
      COALESCE(SUM(ab.credit_amount), 0) as total_credits,
      COALESCE(SUM(ab.ending_balance), 0) as net_balance
    FROM chart_of_accounts coa
    LEFT JOIN account_balances ab ON coa.id = ab.account_id
      AND ab.fiscal_year = ?
      AND ab.fiscal_period <= ?
    WHERE coa.is_active = true
    GROUP BY coa.id, coa.account_code, coa.account_name, coa.account_type, coa.normal_balance
    ${includeZeroBalances ? '' : 'HAVING COALESCE(SUM(ab.ending_balance), 0) != 0'}
    ORDER BY coa.account_code
  `;

  const [results] = await sequelize.query(query, {
    replacements: [fiscalYear, fiscalPeriod],
  });

  return (results as any[]).map((row) => ({
    accountCode: row.account_code,
    accountName: row.account_name,
    accountType: row.account_type,
    debitBalance: row.normal_balance === 'debit' ? Number(row.net_balance) : 0,
    creditBalance: row.normal_balance === 'credit' ? Number(row.net_balance) : 0,
    netBalance: Number(row.net_balance),
  }));
};

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
export const generateAdjustedTrialBalance = async (
  sequelize: Sequelize,
  fiscalYear: number,
  fiscalPeriod: number,
): Promise<TrialBalanceEntry[]> => {
  // Same as regular trial balance but includes adjusting entries
  return await generateTrialBalance(sequelize, fiscalYear, fiscalPeriod, false);
};

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
export const generatePostClosingTrialBalance = async (
  sequelize: Sequelize,
  fiscalYear: number,
): Promise<TrialBalanceEntry[]> => {
  const query = `
    SELECT
      coa.account_code,
      coa.account_name,
      coa.account_type,
      coa.normal_balance,
      COALESCE(SUM(ab.ending_balance), 0) as net_balance
    FROM chart_of_accounts coa
    LEFT JOIN account_balances ab ON coa.id = ab.account_id
      AND ab.fiscal_year = ?
      AND ab.fiscal_period = 12
    WHERE coa.is_active = true
      AND coa.account_type IN ('ASSET', 'LIABILITY', 'EQUITY', 'FUND_BALANCE')
    GROUP BY coa.id, coa.account_code, coa.account_name, coa.account_type, coa.normal_balance
    HAVING COALESCE(SUM(ab.ending_balance), 0) != 0
    ORDER BY coa.account_code
  `;

  const [results] = await sequelize.query(query, {
    replacements: [fiscalYear],
  });

  return (results as any[]).map((row) => ({
    accountCode: row.account_code,
    accountName: row.account_name,
    accountType: row.account_type,
    debitBalance: row.normal_balance === 'debit' ? Number(row.net_balance) : 0,
    creditBalance: row.normal_balance === 'credit' ? Number(row.net_balance) : 0,
    netBalance: Number(row.net_balance),
  }));
};

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
export const validateTrialBalance = (
  trialBalance: TrialBalanceEntry[],
): { balanced: boolean; totalDebits: number; totalCredits: number; difference: number } => {
  let totalDebits = 0;
  let totalCredits = 0;

  for (const entry of trialBalance) {
    totalDebits += Number(entry.debitBalance);
    totalCredits += Number(entry.creditBalance);
  }

  const difference = totalDebits - totalCredits;
  const balanced = Math.abs(difference) < 0.01;

  return { balanced, totalDebits, totalCredits, difference };
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
export const generateGLDetailReport = async (
  sequelize: Sequelize,
  accountId: number,
  fiscalYear: number,
  fiscalPeriod: number,
): Promise<any[]> => {
  const query = `
    SELECT
      jeh.entry_number,
      jeh.entry_date,
      jeh.posting_date,
      jeh.description as entry_description,
      jel.line_number,
      jel.description as line_description,
      jel.debit_amount,
      jel.credit_amount,
      jeh.reference,
      jeh.source,
      jeh.posted_by,
      jeh.posted_at
    FROM journal_entry_lines jel
    JOIN journal_entry_headers jeh ON jel.journal_entry_id = jeh.id
    WHERE jel.account_id = ?
      AND jeh.fiscal_year = ?
      AND jeh.fiscal_period = ?
      AND jeh.status = 'posted'
    ORDER BY jeh.posting_date, jeh.entry_number, jel.line_number
  `;

  const [results] = await sequelize.query(query, {
    replacements: [accountId, fiscalYear, fiscalPeriod],
  });

  return results as any[];
};

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
export const generateAccountActivitySummary = async (
  sequelize: Sequelize,
  accountId: number,
  startDate: Date,
  endDate: Date,
): Promise<any> => {
  const query = `
    SELECT
      COUNT(*) as transaction_count,
      SUM(jel.debit_amount) as total_debits,
      SUM(jel.credit_amount) as total_credits,
      MIN(jeh.entry_date) as first_transaction,
      MAX(jeh.entry_date) as last_transaction
    FROM journal_entry_lines jel
    JOIN journal_entry_headers jeh ON jel.journal_entry_id = jeh.id
    WHERE jel.account_id = ?
      AND jeh.entry_date BETWEEN ? AND ?
      AND jeh.status = 'posted'
  `;

  const [results] = await sequelize.query(query, {
    replacements: [accountId, startDate, endDate],
  });

  return (results as any[])[0];
};

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
export const exportTrialBalanceToCSV = (trialBalance: TrialBalanceEntry[]): string => {
  const headers = 'Account Code,Account Name,Account Type,Debit Balance,Credit Balance,Net Balance\n';

  const rows = trialBalance.map((entry) => {
    return `"${entry.accountCode}","${entry.accountName}","${entry.accountType}",${entry.debitBalance},${entry.creditBalance},${entry.netBalance}`;
  });

  return headers + rows.join('\n');
};

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
export const generateFinancialStatement = async (
  sequelize: Sequelize,
  statementType: 'balance_sheet' | 'income_statement',
  fiscalYear: number,
  fiscalPeriod: number,
): Promise<any> => {
  if (statementType === 'balance_sheet') {
    return await generateBalanceSheet(sequelize, fiscalYear, fiscalPeriod);
  } else {
    return await generateIncomeStatement(sequelize, fiscalYear, fiscalPeriod);
  }
};

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
export const generateBalanceSheet = async (
  sequelize: Sequelize,
  fiscalYear: number,
  fiscalPeriod: number,
): Promise<any> => {
  const query = `
    SELECT
      coa.account_type,
      coa.account_category,
      coa.account_code,
      coa.account_name,
      COALESCE(SUM(ab.ending_balance), 0) as balance
    FROM chart_of_accounts coa
    LEFT JOIN account_balances ab ON coa.id = ab.account_id
      AND ab.fiscal_year = ?
      AND ab.fiscal_period = ?
    WHERE coa.is_active = true
      AND coa.account_type IN ('ASSET', 'LIABILITY', 'EQUITY', 'FUND_BALANCE')
    GROUP BY coa.account_type, coa.account_category, coa.account_code, coa.account_name
    ORDER BY coa.account_type, coa.account_code
  `;

  const [results] = await sequelize.query(query, {
    replacements: [fiscalYear, fiscalPeriod],
  });

  // Organize by account type
  const balanceSheet: any = {
    assets: [],
    liabilities: [],
    equity: [],
    totalAssets: 0,
    totalLiabilities: 0,
    totalEquity: 0,
  };

  for (const row of results as any[]) {
    const item = {
      accountCode: row.account_code,
      accountName: row.account_name,
      category: row.account_category,
      balance: Number(row.balance),
    };

    if (row.account_type === 'ASSET') {
      balanceSheet.assets.push(item);
      balanceSheet.totalAssets += item.balance;
    } else if (row.account_type === 'LIABILITY') {
      balanceSheet.liabilities.push(item);
      balanceSheet.totalLiabilities += item.balance;
    } else {
      balanceSheet.equity.push(item);
      balanceSheet.totalEquity += item.balance;
    }
  }

  return balanceSheet;
};

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
export const generateIncomeStatement = async (
  sequelize: Sequelize,
  fiscalYear: number,
  fiscalPeriod: number,
): Promise<any> => {
  const query = `
    SELECT
      coa.account_type,
      coa.account_category,
      coa.account_code,
      coa.account_name,
      COALESCE(SUM(
        CASE
          WHEN coa.account_type = 'REVENUE' THEN ab.credit_amount - ab.debit_amount
          WHEN coa.account_type = 'EXPENSE' THEN ab.debit_amount - ab.credit_amount
          ELSE 0
        END
      ), 0) as amount
    FROM chart_of_accounts coa
    LEFT JOIN account_balances ab ON coa.id = ab.account_id
      AND ab.fiscal_year = ?
      AND ab.fiscal_period <= ?
    WHERE coa.is_active = true
      AND coa.account_type IN ('REVENUE', 'EXPENSE')
    GROUP BY coa.account_type, coa.account_category, coa.account_code, coa.account_name
    ORDER BY coa.account_type, coa.account_code
  `;

  const [results] = await sequelize.query(query, {
    replacements: [fiscalYear, fiscalPeriod],
  });

  const incomeStatement: any = {
    revenues: [],
    expenses: [],
    totalRevenue: 0,
    totalExpenses: 0,
    netIncome: 0,
  };

  for (const row of results as any[]) {
    const item = {
      accountCode: row.account_code,
      accountName: row.account_name,
      category: row.account_category,
      amount: Number(row.amount),
    };

    if (row.account_type === 'REVENUE') {
      incomeStatement.revenues.push(item);
      incomeStatement.totalRevenue += item.amount;
    } else {
      incomeStatement.expenses.push(item);
      incomeStatement.totalExpenses += item.amount;
    }
  }

  incomeStatement.netIncome = incomeStatement.totalRevenue - incomeStatement.totalExpenses;

  return incomeStatement;
};

// ============================================================================
// PERIOD CLOSE OPERATIONS (31-40)
// ============================================================================

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
export const initiatePeriodClose = async (
  sequelize: Sequelize,
  fiscalYear: number,
  fiscalPeriod: number,
  userId: string,
): Promise<PeriodCloseStatus> => {
  // Check if period is already closed
  const [existing] = await sequelize.query(
    'SELECT * FROM period_close_status WHERE fiscal_year = ? AND fiscal_period = ?',
    { replacements: [fiscalYear, fiscalPeriod] },
  );

  if (existing && (existing as any[]).length > 0) {
    const status = (existing as any[])[0].status;
    if (status === 'closed' || status === 'locked') {
      throw new Error(`Period ${fiscalYear}-${fiscalPeriod} is already ${status}`);
    }
  }

  // Create period close record
  await sequelize.query(
    `INSERT INTO period_close_status (fiscal_year, fiscal_period, status, initiated_by, initiated_at, created_at, updated_at)
     VALUES (?, ?, 'closing', ?, NOW(), NOW(), NOW())
     ON CONFLICT (fiscal_year, fiscal_period)
     DO UPDATE SET status = 'closing', initiated_by = ?, initiated_at = NOW(), updated_at = NOW()`,
    { replacements: [fiscalYear, fiscalPeriod, userId, userId] },
  );

  return await getPeriodCloseStatus(sequelize, fiscalYear, fiscalPeriod);
};

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
export const getPeriodCloseStatus = async (
  sequelize: Sequelize,
  fiscalYear: number,
  fiscalPeriod: number,
): Promise<PeriodCloseStatus> => {
  const [statusResults] = await sequelize.query(
    'SELECT * FROM period_close_status WHERE fiscal_year = ? AND fiscal_period = ?',
    { replacements: [fiscalYear, fiscalPeriod] },
  );

  if (!statusResults || (statusResults as any[]).length === 0) {
    return {
      fiscalYear,
      fiscalPeriod,
      status: 'open',
      checklistItems: [],
    };
  }

  const statusData = (statusResults as any[])[0];

  const [checklistResults] = await sequelize.query(
    'SELECT * FROM period_close_checklist WHERE fiscal_year = ? AND fiscal_period = ? ORDER BY item_order',
    { replacements: [fiscalYear, fiscalPeriod] },
  );

  return {
    fiscalYear: statusData.fiscal_year,
    fiscalPeriod: statusData.fiscal_period,
    status: statusData.status,
    closeDate: statusData.close_date,
    closedBy: statusData.closed_by,
    checklistItems: (checklistResults as any[]).map((item) => ({
      itemId: item.item_id,
      itemName: item.item_name,
      itemType: item.item_type,
      status: item.status,
      completedBy: item.completed_by,
      completedAt: item.completed_at,
      notes: item.notes,
    })),
  };
};

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
export const validatePeriodCloseReadiness = async (
  sequelize: Sequelize,
  fiscalYear: number,
  fiscalPeriod: number,
): Promise<{ ready: boolean; issues: string[] }> => {
  const issues: string[] = [];

  // Check for unposted entries
  const [unpostedCount] = await sequelize.query(
    `SELECT COUNT(*) as count FROM journal_entry_headers
     WHERE fiscal_year = ? AND fiscal_period = ?
     AND status IN ('draft', 'pending', 'approved')`,
    { replacements: [fiscalYear, fiscalPeriod] },
  );

  if ((unpostedCount as any[])[0].count > 0) {
    issues.push(`${(unpostedCount as any[])[0].count} unposted journal entries`);
  }

  // Check trial balance
  const trialBalance = await generateTrialBalance(sequelize, fiscalYear, fiscalPeriod, false);
  const validation = validateTrialBalance(trialBalance);

  if (!validation.balanced) {
    issues.push(`Trial balance is out of balance by ${validation.difference}`);
  }

  // Check for unreconciled accounts
  const [unreconciledCount] = await sequelize.query(
    `SELECT COUNT(*) as count FROM account_balances
     WHERE fiscal_year = ? AND fiscal_period = ?
     AND reconciliation_status != 'reconciled'`,
    { replacements: [fiscalYear, fiscalPeriod] },
  );

  if ((unreconciledCount as any[])[0].count > 0) {
    issues.push(`${(unreconciledCount as any[])[0].count} unreconciled accounts`);
  }

  return { ready: issues.length === 0, issues };
};

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
export const completePeriodClose = async (
  sequelize: Sequelize,
  fiscalYear: number,
  fiscalPeriod: number,
  userId: string,
): Promise<void> => {
  // Validate readiness
  const validation = await validatePeriodCloseReadiness(sequelize, fiscalYear, fiscalPeriod);
  if (!validation.ready) {
    throw new Error(`Cannot close period: ${validation.issues.join(', ')}`);
  }

  await sequelize.query(
    `UPDATE period_close_status
     SET status = 'closed', close_date = NOW(), closed_by = ?, updated_at = NOW()
     WHERE fiscal_year = ? AND fiscal_period = ?`,
    { replacements: [userId, fiscalYear, fiscalPeriod] },
  );

  await createAuditTrail(sequelize, 'period_close_status', 0, 'UPDATE', userId, {
    action: 'CLOSE_PERIOD',
    fiscalYear,
    fiscalPeriod,
  });
};

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
export const reopenPeriod = async (
  sequelize: Sequelize,
  fiscalYear: number,
  fiscalPeriod: number,
  reason: string,
  userId: string,
): Promise<void> => {
  await sequelize.query(
    `UPDATE period_close_status
     SET status = 'open', updated_at = NOW()
     WHERE fiscal_year = ? AND fiscal_period = ?`,
    { replacements: [fiscalYear, fiscalPeriod] },
  );

  await createAuditTrail(sequelize, 'period_close_status', 0, 'UPDATE', userId, {
    action: 'REOPEN_PERIOD',
    fiscalYear,
    fiscalPeriod,
    reason,
  });
};

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
export const isPeriodOpen = async (
  sequelize: Sequelize,
  fiscalYear: number,
  fiscalPeriod: number,
): Promise<boolean> => {
  const [results] = await sequelize.query(
    'SELECT status FROM period_close_status WHERE fiscal_year = ? AND fiscal_period = ?',
    { replacements: [fiscalYear, fiscalPeriod] },
  );

  if (!results || (results as any[]).length === 0) {
    return true; // Period not initialized = open
  }

  const status = (results as any[])[0].status;
  return status === 'open' || status === 'closing';
};

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
export const lockPeriod = async (
  sequelize: Sequelize,
  fiscalYear: number,
  fiscalPeriod: number,
  userId: string,
): Promise<void> => {
  await sequelize.query(
    `UPDATE period_close_status
     SET status = 'locked', locked_by = ?, locked_at = NOW(), updated_at = NOW()
     WHERE fiscal_year = ? AND fiscal_period = ?`,
    { replacements: [userId, fiscalYear, fiscalPeriod] },
  );

  await createAuditTrail(sequelize, 'period_close_status', 0, 'UPDATE', userId, {
    action: 'LOCK_PERIOD',
    fiscalYear,
    fiscalPeriod,
  });
};

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
export const createYearEndClosingEntries = async (
  sequelize: Sequelize,
  fiscalYear: number,
  userId: string,
): Promise<number[]> => {
  const entryIds: number[] = [];

  // Create closing entry for revenue and expense accounts
  const closingEntry = await createClosingEntry(sequelize, fiscalYear, userId);
  entryIds.push(closingEntry.id);

  // Auto-approve and post
  await approveJournalEntry(sequelize, closingEntry.id, userId);
  await postJournalEntry(sequelize, closingEntry.id, userId);

  return entryIds;
};

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
export const processAutomaticReversingEntries = async (
  sequelize: Sequelize,
  reversalDate: Date,
  userId: string,
): Promise<number> => {
  const JournalEntryHeader = createJournalEntryHeaderModel(sequelize);

  // Find entries marked for reversal
  const entriesToReverse = await JournalEntryHeader.findAll({
    where: {
      isReversing: true,
      reversalDate: { [Op.lte]: reversalDate },
      status: 'posted',
      reversedEntryId: null,
    },
  });

  let count = 0;

  for (const entry of entriesToReverse) {
    try {
      await reverseJournalEntry(sequelize, entry.id, reversalDate, 'Automatic reversal', userId);
      count++;
    } catch (error) {
      console.error(`Failed to reverse entry ${entry.entryNumber}:`, error);
    }
  }

  return count;
};

// ============================================================================
// HELPER FUNCTIONS (41-45)
// ============================================================================

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
export const getFiscalYearPeriod = (
  date: Date,
  fiscalYearStartMonth = 10, // October start (federal fiscal year)
): { fiscalYear: number; fiscalPeriod: number } => {
  const month = date.getMonth() + 1; // 1-12
  const year = date.getFullYear();

  let fiscalYear = year;
  let fiscalPeriod = month;

  if (fiscalYearStartMonth !== 1) {
    if (month >= fiscalYearStartMonth) {
      fiscalYear = year + 1;
      fiscalPeriod = month - fiscalYearStartMonth + 1;
    } else {
      fiscalYear = year;
      fiscalPeriod = 12 - fiscalYearStartMonth + month + 1;
    }
  }

  return { fiscalYear, fiscalPeriod };
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
export const createAuditTrail = async (
  sequelize: Sequelize,
  tableName: string,
  recordId: number,
  action: string,
  userId: string,
  changes?: Record<string, any>,
  transaction?: Transaction,
): Promise<void> => {
  await sequelize.query(
    `INSERT INTO audit_trail (table_name, record_id, action, user_id, timestamp, changes, created_at)
     VALUES (?, ?, ?, ?, NOW(), ?, NOW())`,
    {
      replacements: [tableName, recordId, action, userId, JSON.stringify(changes || {})],
      transaction,
    },
  );
};

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
export const validateAccountCoding = (
  rule: AccountCodingRule,
  dimensions: Record<string, string>,
): boolean => {
  for (const requiredDim of rule.requiredDimensions) {
    if (!dimensions[requiredDim]) {
      throw new Error(`Required dimension ${requiredDim} is missing`);
    }
  }

  return true;
};

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
export const reconcileGLToSubLedger = async (
  sequelize: Sequelize,
  accountId: number,
  fiscalYear: number,
  fiscalPeriod: number,
  subLedgerBalance: number,
): Promise<LedgerReconciliationItem> => {
  const [glBalance] = await sequelize.query(
    'SELECT ending_balance FROM account_balances WHERE account_id = ? AND fiscal_year = ? AND fiscal_period = ?',
    { replacements: [accountId, fiscalYear, fiscalPeriod] },
  );

  const glBalanceAmount = glBalance && (glBalance as any[]).length > 0
    ? Number((glBalance as any[])[0].ending_balance)
    : 0;

  const variance = glBalanceAmount - subLedgerBalance;
  const variancePercent = subLedgerBalance !== 0 ? (variance / subLedgerBalance) * 100 : 0;

  const status = Math.abs(variance) < 0.01 ? 'matched' : 'variance';

  return {
    accountId,
    fiscalYear,
    fiscalPeriod,
    glBalance: glBalanceAmount,
    subLedgerBalance,
    variance,
    variancePercent,
    status,
  };
};

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
export const formatJournalEntryNumber = (
  prefix: string,
  year: number,
  sequenceNumber: number,
): string => {
  return `${prefix}-${year}-${sequenceNumber.toString().padStart(5, '0')}`;
};

/**
 * Default export with all utilities.
 */
export default {
  // Models
  createJournalEntryHeaderModel,
  createJournalEntryLineModel,

  // Journal Entry Management
  createJournalEntry,
  updateJournalEntry,
  deleteJournalEntry,
  validateJournalEntry,
  approveJournalEntry,
  rejectJournalEntry,
  generateJournalEntryNumber,
  getJournalEntryWithLines,
  searchJournalEntries,

  // Posting Operations
  postJournalEntry,
  batchPostJournalEntries,
  updateAccountBalanceForPosting,
  reverseJournalEntry,
  createAdjustingEntry,
  createClosingEntry,
  createReclassificationEntry,
  validatePostingBatch,
  unpostJournalEntry,

  // Trial Balance and Reporting
  generateTrialBalance,
  generateAdjustedTrialBalance,
  generatePostClosingTrialBalance,
  validateTrialBalance,
  generateGLDetailReport,
  generateAccountActivitySummary,
  exportTrialBalanceToCSV,
  generateFinancialStatement,
  generateBalanceSheet,
  generateIncomeStatement,

  // Period Close Operations
  initiatePeriodClose,
  getPeriodCloseStatus,
  validatePeriodCloseReadiness,
  completePeriodClose,
  reopenPeriod,
  isPeriodOpen,
  lockPeriod,
  createYearEndClosingEntries,
  processAutomaticReversingEntries,

  // Helper Functions
  getFiscalYearPeriod,
  createAuditTrail,
  validateAccountCoding,
  reconcileGLToSubLedger,
  formatJournalEntryNumber,
};
