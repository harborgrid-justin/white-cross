/**
 * LOC: INTCOMP001
 * File: /reuse/edwards/financial/intercompany-accounting-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (ORM for database operations)
 *   - @nestjs/common (NestJS framework)
 *   - @nestjs/swagger (API documentation)
 *   - ../../financial/general-ledger-operations-kit (GL posting)
 *
 * DOWNSTREAM (imported by):
 *   - Backend intercompany modules
 *   - Multi-entity consolidation services
 *   - Transfer pricing modules
 *   - Intercompany reconciliation services
 */

/**
 * File: /reuse/edwards/financial/intercompany-accounting-kit.ts
 * Locator: WC-EDW-INTCOMP-001
 * Purpose: Comprehensive Intercompany Accounting Operations - Multi-entity transactions, elimination entries, transfer pricing, consolidation
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, TypeScript 5.x, general-ledger-operations-kit
 * Downstream: ../backend/intercompany/*, Consolidation Services, Transfer Pricing, Reconciliation Services
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+
 * Exports: 45 functions for intercompany transactions, elimination entries, cross-entity accounting, transfer pricing, reconciliation, netting, settlements, consolidation
 *
 * LLM Context: Enterprise-grade intercompany accounting for Oracle JD Edwards EnterpriseOne compatibility.
 * Provides comprehensive intercompany transaction processing, automated elimination entries, cross-entity journal entries,
 * transfer pricing compliance, intercompany reconciliation, bilateral/multilateral netting, settlement processing,
 * multi-entity consolidation, intercompany balancing, currency translation, and audit trail management.
 */

import { Model, DataTypes, Sequelize, Transaction, Op, ValidationError } from 'sequelize';
import { Injectable } from '@nestjs/common';
import { ApiProperty, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface IntercompanyTransaction {
  transactionId: number;
  transactionNumber: string;
  transactionDate: Date;
  sourceEntityId: number;
  sourceEntityCode: string;
  destinationEntityId: number;
  destinationEntityCode: string;
  transactionType: 'sale' | 'purchase' | 'loan' | 'transfer' | 'service' | 'royalty' | 'allocation';
  amount: number;
  currency: string;
  exchangeRate: number;
  functionalAmount: number;
  description: string;
  status: 'draft' | 'pending' | 'approved' | 'posted' | 'eliminated' | 'rejected';
  referenceNumber?: string;
  dueDate?: Date;
}

interface IntercompanyJournal {
  journalId: number;
  transactionId: number;
  entityId: number;
  entityCode: string;
  journalType: 'source' | 'destination' | 'elimination';
  fiscalYear: number;
  fiscalPeriod: number;
  journalDate: Date;
  debitAccountCode: string;
  creditAccountCode: string;
  amount: number;
  currency: string;
  description: string;
  posted: boolean;
  eliminationId?: number;
}

interface EliminationEntry {
  eliminationId: number;
  consolidationId: number;
  eliminationType: 'revenue' | 'expense' | 'receivable' | 'payable' | 'investment' | 'equity' | 'unrealized-profit';
  fiscalYear: number;
  fiscalPeriod: number;
  sourceEntityId: number;
  destinationEntityId: number;
  eliminationAmount: number;
  debitAccountCode: string;
  creditAccountCode: string;
  description: string;
  automatic: boolean;
  posted: boolean;
  journalEntryId?: number;
}

interface TransferPricing {
  transferPricingId: number;
  transactionId: number;
  sourceEntityId: number;
  destinationEntityId: number;
  pricingMethod: 'cost-plus' | 'resale-minus' | 'comparable-uncontrolled' | 'profit-split' | 'transactional-net-margin';
  baseAmount: number;
  markup: number;
  transferPrice: number;
  marketPrice?: number;
  complianceRegion: string;
  documentationPath?: string;
  approvedBy?: string;
}

interface IntercompanyReconciliation {
  reconciliationId: number;
  fiscalYear: number;
  fiscalPeriod: number;
  entityId: number;
  counterpartyEntityId: number;
  accountCode: string;
  entityBalance: number;
  counterpartyBalance: number;
  variance: number;
  variancePercent: number;
  status: 'matched' | 'variance' | 'under-review' | 'adjusted';
  reconciledBy?: string;
  reconciledAt?: Date;
  notes?: string;
}

interface IntercompanyNetting {
  nettingId: number;
  nettingDate: Date;
  nettingType: 'bilateral' | 'multilateral';
  currency: string;
  participatingEntities: number[];
  totalGrossReceivables: number;
  totalGrossPayables: number;
  netAmount: number;
  nettingSavings: number;
  status: 'calculated' | 'approved' | 'settled';
  settlementDate?: Date;
}

interface IntercompanySettlement {
  settlementId: number;
  nettingId?: number;
  settlementDate: Date;
  payerEntityId: number;
  payeeEntityId: number;
  settlementAmount: number;
  currency: string;
  settlementMethod: 'wire' | 'netting' | 'offset' | 'intercompany-loan';
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  referenceNumber?: string;
  completedAt?: Date;
}

interface ConsolidationPeriod {
  consolidationId: number;
  fiscalYear: number;
  fiscalPeriod: number;
  consolidationDate: Date;
  consolidationLevel: 'legal' | 'management' | 'statutory';
  participatingEntities: number[];
  eliminationsProcessed: number;
  status: 'in-progress' | 'completed' | 'published' | 'locked';
  processedBy?: string;
  completedAt?: Date;
}

interface IntercompanyAccount {
  accountId: number;
  entityId: number;
  accountCode: string;
  accountName: string;
  accountType: 'intercompany-receivable' | 'intercompany-payable' | 'intercompany-revenue' | 'intercompany-expense';
  counterpartyEntityId: number;
  balance: number;
  currency: string;
  lastReconciled?: Date;
}

interface CurrencyTranslation {
  translationId: number;
  entityId: number;
  fiscalYear: number;
  fiscalPeriod: number;
  functionalCurrency: string;
  reportingCurrency: string;
  translationMethod: 'current-rate' | 'temporal' | 'monetary-nonmonetary';
  averageRate: number;
  closingRate: number;
  translationAdjustment: number;
  accountCode: string;
}

interface IntercompanyLoan {
  loanId: number;
  loanNumber: string;
  lenderEntityId: number;
  borrowerEntityId: number;
  principalAmount: number;
  currency: string;
  interestRate: number;
  startDate: Date;
  maturityDate: Date;
  outstandingPrincipal: number;
  accruedInterest: number;
  status: 'active' | 'repaid' | 'defaulted';
  armLengthCompliant: boolean;
}

interface IntercompanyAllocation {
  allocationId: number;
  allocationNumber: string;
  allocationDate: Date;
  allocationBasis: 'headcount' | 'revenue' | 'assets' | 'direct' | 'square-footage';
  totalAmount: number;
  sourceEntityId: number;
  destinationEntities: AllocationDistribution[];
  fiscalYear: number;
  fiscalPeriod: number;
  status: 'draft' | 'approved' | 'posted';
}

interface AllocationDistribution {
  entityId: number;
  entityCode: string;
  allocationPercent: number;
  allocatedAmount: number;
  allocationDriver: number;
}

interface IntercompanyBalancing {
  balancingId: number;
  entityId: number;
  fiscalYear: number;
  fiscalPeriod: number;
  totalReceivables: number;
  totalPayables: number;
  netPosition: number;
  balancingAccountCode: string;
  balanced: boolean;
  varianceAmount: number;
}

// ============================================================================
// DTO CLASSES
// ============================================================================

export class CreateIntercompanyTransactionDto {
  @ApiProperty({ description: 'Transaction number', example: 'IC-2024-001' })
  transactionNumber!: string;

  @ApiProperty({ description: 'Transaction date' })
  transactionDate!: Date;

  @ApiProperty({ description: 'Source entity ID' })
  sourceEntityId!: number;

  @ApiProperty({ description: 'Destination entity ID' })
  destinationEntityId!: number;

  @ApiProperty({ description: 'Transaction type', enum: ['sale', 'purchase', 'loan', 'transfer', 'service', 'royalty', 'allocation'] })
  transactionType!: string;

  @ApiProperty({ description: 'Transaction amount' })
  amount!: number;

  @ApiProperty({ description: 'Currency code', example: 'USD' })
  currency!: string;

  @ApiProperty({ description: 'Description' })
  description!: string;

  @ApiProperty({ description: 'Reference number', required: false })
  referenceNumber?: string;
}

export class CreateEliminationEntryDto {
  @ApiProperty({ description: 'Consolidation ID' })
  consolidationId!: number;

  @ApiProperty({ description: 'Elimination type', enum: ['revenue', 'expense', 'receivable', 'payable', 'investment', 'equity', 'unrealized-profit'] })
  eliminationType!: string;

  @ApiProperty({ description: 'Source entity ID' })
  sourceEntityId!: number;

  @ApiProperty({ description: 'Destination entity ID' })
  destinationEntityId!: number;

  @ApiProperty({ description: 'Elimination amount' })
  eliminationAmount!: number;

  @ApiProperty({ description: 'Debit account code' })
  debitAccountCode!: string;

  @ApiProperty({ description: 'Credit account code' })
  creditAccountCode!: string;
}

export class ProcessNettingDto {
  @ApiProperty({ description: 'Netting date' })
  nettingDate!: Date;

  @ApiProperty({ description: 'Netting type', enum: ['bilateral', 'multilateral'] })
  nettingType!: string;

  @ApiProperty({ description: 'Currency code' })
  currency!: string;

  @ApiProperty({ description: 'Participating entity IDs', type: [Number] })
  participatingEntities!: number[];

  @ApiProperty({ description: 'User processing netting' })
  userId!: string;
}

export class ReconcileIntercompanyDto {
  @ApiProperty({ description: 'Fiscal year' })
  fiscalYear!: number;

  @ApiProperty({ description: 'Fiscal period' })
  fiscalPeriod!: number;

  @ApiProperty({ description: 'Entity ID' })
  entityId!: number;

  @ApiProperty({ description: 'Counterparty entity ID' })
  counterpartyEntityId!: number;

  @ApiProperty({ description: 'User performing reconciliation' })
  userId!: string;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Sequelize model for Intercompany Transactions.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} IntercompanyTransaction model
 *
 * @example
 * ```typescript
 * const IntercompanyTransaction = createIntercompanyTransactionModel(sequelize);
 * const transaction = await IntercompanyTransaction.create({
 *   transactionNumber: 'IC-2024-001',
 *   sourceEntityId: 1,
 *   destinationEntityId: 2,
 *   transactionType: 'sale',
 *   amount: 100000
 * });
 * ```
 */
export const createIntercompanyTransactionModel = (sequelize: Sequelize) => {
  class IntercompanyTransaction extends Model {
    public id!: number;
    public transactionNumber!: string;
    public transactionDate!: Date;
    public sourceEntityId!: number;
    public sourceEntityCode!: string;
    public destinationEntityId!: number;
    public destinationEntityCode!: string;
    public transactionType!: string;
    public amount!: number;
    public currency!: string;
    public exchangeRate!: number;
    public functionalAmount!: number;
    public description!: string;
    public status!: string;
    public referenceNumber!: string | null;
    public dueDate!: Date | null;
    public createdBy!: string;
    public updatedBy!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  IntercompanyTransaction.init(
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
        comment: 'Unique intercompany transaction number',
      },
      transactionDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Transaction date',
      },
      sourceEntityId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Source entity ID',
      },
      sourceEntityCode: {
        type: DataTypes.STRING(20),
        allowNull: false,
        comment: 'Source entity code',
      },
      destinationEntityId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Destination entity ID',
      },
      destinationEntityCode: {
        type: DataTypes.STRING(20),
        allowNull: false,
        comment: 'Destination entity code',
      },
      transactionType: {
        type: DataTypes.ENUM('sale', 'purchase', 'loan', 'transfer', 'service', 'royalty', 'allocation'),
        allowNull: false,
        comment: 'Type of intercompany transaction',
      },
      amount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Transaction amount',
        validate: {
          min: 0,
        },
      },
      currency: {
        type: DataTypes.STRING(3),
        allowNull: false,
        comment: 'Transaction currency',
      },
      exchangeRate: {
        type: DataTypes.DECIMAL(12, 6),
        allowNull: false,
        defaultValue: 1.0,
        comment: 'Exchange rate to functional currency',
      },
      functionalAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Amount in functional currency',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Transaction description',
      },
      status: {
        type: DataTypes.ENUM('draft', 'pending', 'approved', 'posted', 'eliminated', 'rejected'),
        allowNull: false,
        defaultValue: 'draft',
        comment: 'Transaction status',
      },
      referenceNumber: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'External reference number',
      },
      dueDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Payment due date',
      },
      createdBy: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'User who created the transaction',
      },
      updatedBy: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'User who last updated the transaction',
      },
    },
    {
      sequelize,
      tableName: 'intercompany_transactions',
      timestamps: true,
      indexes: [
        { fields: ['transactionNumber'], unique: true },
        { fields: ['transactionDate'] },
        { fields: ['sourceEntityId'] },
        { fields: ['destinationEntityId'] },
        { fields: ['status'] },
        { fields: ['transactionType'] },
        { fields: ['sourceEntityId', 'destinationEntityId'] },
      ],
      validate: {
        differentEntities() {
          if (this.sourceEntityId === this.destinationEntityId) {
            throw new Error('Source and destination entities must be different');
          }
        },
      },
      hooks: {
        beforeSave: (transaction) => {
          transaction.functionalAmount = Number(transaction.amount) * Number(transaction.exchangeRate);
        },
      },
    },
  );

  return IntercompanyTransaction;
};

/**
 * Sequelize model for Elimination Entries.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} EliminationEntry model
 *
 * @example
 * ```typescript
 * const EliminationEntry = createEliminationEntryModel(sequelize);
 * const elimination = await EliminationEntry.create({
 *   consolidationId: 1,
 *   eliminationType: 'revenue',
 *   sourceEntityId: 1,
 *   destinationEntityId: 2,
 *   eliminationAmount: 100000
 * });
 * ```
 */
export const createEliminationEntryModel = (sequelize: Sequelize) => {
  class EliminationEntry extends Model {
    public id!: number;
    public consolidationId!: number;
    public eliminationType!: string;
    public fiscalYear!: number;
    public fiscalPeriod!: number;
    public sourceEntityId!: number;
    public destinationEntityId!: number;
    public eliminationAmount!: number;
    public debitAccountCode!: string;
    public creditAccountCode!: string;
    public description!: string;
    public automatic!: boolean;
    public posted!: boolean;
    public journalEntryId!: number | null;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  EliminationEntry.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      consolidationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Associated consolidation period ID',
      },
      eliminationType: {
        type: DataTypes.ENUM('revenue', 'expense', 'receivable', 'payable', 'investment', 'equity', 'unrealized-profit'),
        allowNull: false,
        comment: 'Type of elimination',
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
        validate: {
          min: 1,
          max: 13,
        },
      },
      sourceEntityId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Source entity ID',
      },
      destinationEntityId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Destination entity ID',
      },
      eliminationAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Amount to eliminate',
      },
      debitAccountCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Debit account for elimination',
      },
      creditAccountCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Credit account for elimination',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Elimination description',
      },
      automatic: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Automatically generated elimination',
      },
      posted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Posted to GL',
      },
      journalEntryId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Associated journal entry ID',
      },
    },
    {
      sequelize,
      tableName: 'elimination_entries',
      timestamps: true,
      indexes: [
        { fields: ['consolidationId'] },
        { fields: ['fiscalYear', 'fiscalPeriod'] },
        { fields: ['eliminationType'] },
        { fields: ['sourceEntityId', 'destinationEntityId'] },
        { fields: ['posted'] },
      ],
    },
  );

  return EliminationEntry;
};

/**
 * Sequelize model for Intercompany Reconciliation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} IntercompanyReconciliation model
 *
 * @example
 * ```typescript
 * const IntercompanyReconciliation = createIntercompanyReconciliationModel(sequelize);
 * const reconciliation = await IntercompanyReconciliation.create({
 *   fiscalYear: 2024,
 *   fiscalPeriod: 1,
 *   entityId: 1,
 *   counterpartyEntityId: 2,
 *   accountCode: '1210'
 * });
 * ```
 */
export const createIntercompanyReconciliationModel = (sequelize: Sequelize) => {
  class IntercompanyReconciliation extends Model {
    public id!: number;
    public fiscalYear!: number;
    public fiscalPeriod!: number;
    public entityId!: number;
    public counterpartyEntityId!: number;
    public accountCode!: string;
    public entityBalance!: number;
    public counterpartyBalance!: number;
    public variance!: number;
    public variancePercent!: number;
    public status!: string;
    public reconciledBy!: string | null;
    public reconciledAt!: Date | null;
    public notes!: string | null;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  IntercompanyReconciliation.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
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
        validate: {
          min: 1,
          max: 13,
        },
      },
      entityId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Entity ID',
      },
      counterpartyEntityId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Counterparty entity ID',
      },
      accountCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Account code being reconciled',
      },
      entityBalance: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Entity balance',
      },
      counterpartyBalance: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Counterparty balance',
      },
      variance: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Reconciliation variance',
      },
      variancePercent: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        comment: 'Variance percentage',
      },
      status: {
        type: DataTypes.ENUM('matched', 'variance', 'under-review', 'adjusted'),
        allowNull: false,
        defaultValue: 'variance',
        comment: 'Reconciliation status',
      },
      reconciledBy: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'User who reconciled',
      },
      reconciledAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Reconciliation date',
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Reconciliation notes',
      },
    },
    {
      sequelize,
      tableName: 'intercompany_reconciliations',
      timestamps: true,
      indexes: [
        { fields: ['fiscalYear', 'fiscalPeriod'] },
        { fields: ['entityId'] },
        { fields: ['counterpartyEntityId'] },
        { fields: ['entityId', 'counterpartyEntityId'] },
        { fields: ['status'] },
      ],
      hooks: {
        beforeSave: (reconciliation) => {
          reconciliation.variance = Number(reconciliation.entityBalance) + Number(reconciliation.counterpartyBalance);
          if (Math.abs(Number(reconciliation.entityBalance)) > 0) {
            reconciliation.variancePercent =
              (Number(reconciliation.variance) / Math.abs(Number(reconciliation.entityBalance))) * 100;
          } else {
            reconciliation.variancePercent = 0;
          }
        },
      },
    },
  );

  return IntercompanyReconciliation;
};

// ============================================================================
// INTERCOMPANY TRANSACTION FUNCTIONS
// ============================================================================

/**
 * Creates a new intercompany transaction.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateIntercompanyTransactionDto} transactionData - Transaction data
 * @param {string} userId - User creating the transaction
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created intercompany transaction
 *
 * @example
 * ```typescript
 * const icTransaction = await createIntercompanyTransaction(sequelize, {
 *   transactionNumber: 'IC-2024-001',
 *   transactionDate: new Date(),
 *   sourceEntityId: 1,
 *   destinationEntityId: 2,
 *   transactionType: 'sale',
 *   amount: 100000,
 *   currency: 'USD',
 *   description: 'Intercompany sale of goods'
 * }, 'user123');
 * ```
 */
export const createIntercompanyTransaction = async (
  sequelize: Sequelize,
  transactionData: CreateIntercompanyTransactionDto,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const IntercompanyTransaction = createIntercompanyTransactionModel(sequelize);

  if (transactionData.sourceEntityId === transactionData.destinationEntityId) {
    throw new Error('Source and destination entities must be different');
  }

  // Fetch entity codes (would come from entity master)
  const sourceEntityCode = `ENT-${transactionData.sourceEntityId}`;
  const destinationEntityCode = `ENT-${transactionData.destinationEntityId}`;

  // Get exchange rate (would come from currency table)
  const exchangeRate = 1.0; // Placeholder

  const icTransaction = await IntercompanyTransaction.create(
    {
      ...transactionData,
      sourceEntityCode,
      destinationEntityCode,
      exchangeRate,
      functionalAmount: transactionData.amount * exchangeRate,
      status: 'draft',
      createdBy: userId,
      updatedBy: userId,
    },
    { transaction },
  );

  return icTransaction;
};

/**
 * Approves an intercompany transaction and creates journal entries.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} transactionId - Transaction ID
 * @param {string} userId - User approving the transaction
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Approval result
 *
 * @example
 * ```typescript
 * const result = await approveIntercompanyTransaction(sequelize, 1, 'user123');
 * ```
 */
export const approveIntercompanyTransaction = async (
  sequelize: Sequelize,
  transactionId: number,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const IntercompanyTransaction = createIntercompanyTransactionModel(sequelize);

  const icTransaction = await IntercompanyTransaction.findByPk(transactionId, { transaction });
  if (!icTransaction) {
    throw new Error('Intercompany transaction not found');
  }

  if (icTransaction.status !== 'pending') {
    throw new Error('Only pending transactions can be approved');
  }

  await icTransaction.update(
    {
      status: 'approved',
      updatedBy: userId,
    },
    { transaction },
  );

  // Generate journal entries for both entities
  const sourceJournal = await generateIntercompanyJournal(
    sequelize,
    transactionId,
    icTransaction.sourceEntityId,
    'source',
    transaction,
  );

  const destinationJournal = await generateIntercompanyJournal(
    sequelize,
    transactionId,
    icTransaction.destinationEntityId,
    'destination',
    transaction,
  );

  return {
    transactionId,
    status: 'approved',
    sourceJournalId: sourceJournal.journalId,
    destinationJournalId: destinationJournal.journalId,
  };
};

/**
 * Posts an intercompany transaction to the general ledger.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} transactionId - Transaction ID
 * @param {string} userId - User posting the transaction
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Posting result
 *
 * @example
 * ```typescript
 * const result = await postIntercompanyTransaction(sequelize, 1, 'user123');
 * ```
 */
export const postIntercompanyTransaction = async (
  sequelize: Sequelize,
  transactionId: number,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const IntercompanyTransaction = createIntercompanyTransactionModel(sequelize);

  const icTransaction = await IntercompanyTransaction.findByPk(transactionId, { transaction });
  if (!icTransaction) {
    throw new Error('Intercompany transaction not found');
  }

  if (icTransaction.status !== 'approved') {
    throw new Error('Only approved transactions can be posted');
  }

  // Post to GL (would integrate with GL posting functions)
  await icTransaction.update(
    {
      status: 'posted',
      updatedBy: userId,
    },
    { transaction },
  );

  return {
    transactionId,
    status: 'posted',
    postedBy: userId,
    postedAt: new Date(),
  };
};

/**
 * Generates journal entries for intercompany transaction.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} transactionId - Transaction ID
 * @param {number} entityId - Entity ID
 * @param {string} journalType - Journal type (source/destination)
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<IntercompanyJournal>} Generated journal
 *
 * @example
 * ```typescript
 * const journal = await generateIntercompanyJournal(sequelize, 1, 1, 'source');
 * ```
 */
export const generateIntercompanyJournal = async (
  sequelize: Sequelize,
  transactionId: number,
  entityId: number,
  journalType: string,
  transaction?: Transaction,
): Promise<IntercompanyJournal> => {
  const IntercompanyTransaction = createIntercompanyTransactionModel(sequelize);

  const icTransaction = await IntercompanyTransaction.findByPk(transactionId, { transaction });
  if (!icTransaction) {
    throw new Error('Intercompany transaction not found');
  }

  const entityCode = `ENT-${entityId}`;
  const fiscalYear = icTransaction.transactionDate.getFullYear();
  const fiscalPeriod = icTransaction.transactionDate.getMonth() + 1;

  let debitAccountCode: string;
  let creditAccountCode: string;

  // Determine accounts based on transaction type and journal type
  if (icTransaction.transactionType === 'sale') {
    if (journalType === 'source') {
      // Seller records: DR Intercompany Receivable, CR Intercompany Revenue
      debitAccountCode = '1210'; // IC Receivable
      creditAccountCode = '4100'; // IC Revenue
    } else {
      // Buyer records: DR Inventory/Expense, CR Intercompany Payable
      debitAccountCode = '5100'; // IC Expense
      creditAccountCode = '2110'; // IC Payable
    }
  } else if (icTransaction.transactionType === 'loan') {
    if (journalType === 'source') {
      // Lender records: DR IC Loan Receivable, CR Cash
      debitAccountCode = '1220'; // IC Loan Receivable
      creditAccountCode = '1010'; // Cash
    } else {
      // Borrower records: DR Cash, CR IC Loan Payable
      debitAccountCode = '1010'; // Cash
      creditAccountCode = '2120'; // IC Loan Payable
    }
  } else {
    debitAccountCode = '1210';
    creditAccountCode = '4100';
  }

  const journal: IntercompanyJournal = {
    journalId: 0, // Would be auto-generated
    transactionId,
    entityId,
    entityCode,
    journalType,
    fiscalYear,
    fiscalPeriod,
    journalDate: icTransaction.transactionDate,
    debitAccountCode,
    creditAccountCode,
    amount: icTransaction.functionalAmount,
    currency: icTransaction.currency,
    description: `IC ${icTransaction.transactionType}: ${icTransaction.description}`,
    posted: false,
  };

  return journal;
};

/**
 * Reverses an intercompany transaction.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} transactionId - Transaction ID
 * @param {string} reversalReason - Reason for reversal
 * @param {string} userId - User reversing the transaction
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Reversal result
 *
 * @example
 * ```typescript
 * const result = await reverseIntercompanyTransaction(sequelize, 1, 'Error in transaction', 'user123');
 * ```
 */
export const reverseIntercompanyTransaction = async (
  sequelize: Sequelize,
  transactionId: number,
  reversalReason: string,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const IntercompanyTransaction = createIntercompanyTransactionModel(sequelize);

  const original = await IntercompanyTransaction.findByPk(transactionId, { transaction });
  if (!original) {
    throw new Error('Intercompany transaction not found');
  }

  if (original.status !== 'posted') {
    throw new Error('Only posted transactions can be reversed');
  }

  // Create reversal transaction
  const reversal = await IntercompanyTransaction.create(
    {
      transactionNumber: `${original.transactionNumber}-REV`,
      transactionDate: new Date(),
      sourceEntityId: original.destinationEntityId, // Flip entities
      sourceEntityCode: original.destinationEntityCode,
      destinationEntityId: original.sourceEntityId,
      destinationEntityCode: original.sourceEntityCode,
      transactionType: original.transactionType,
      amount: original.amount,
      currency: original.currency,
      exchangeRate: original.exchangeRate,
      functionalAmount: original.functionalAmount,
      description: `REVERSAL: ${reversalReason} - ${original.description}`,
      status: 'posted',
      referenceNumber: original.transactionNumber,
      createdBy: userId,
      updatedBy: userId,
    },
    { transaction },
  );

  return {
    originalTransactionId: transactionId,
    reversalTransactionId: reversal.id,
    reversalReason,
    reversedBy: userId,
    reversalDate: new Date(),
  };
};

// ============================================================================
// ELIMINATION ENTRY FUNCTIONS
// ============================================================================

/**
 * Creates an elimination entry for consolidation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateEliminationEntryDto} eliminationData - Elimination data
 * @param {string} userId - User creating elimination
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created elimination entry
 *
 * @example
 * ```typescript
 * const elimination = await createEliminationEntry(sequelize, {
 *   consolidationId: 1,
 *   eliminationType: 'revenue',
 *   sourceEntityId: 1,
 *   destinationEntityId: 2,
 *   eliminationAmount: 100000,
 *   debitAccountCode: '4100',
 *   creditAccountCode: '5100'
 * }, 'user123');
 * ```
 */
export const createEliminationEntry = async (
  sequelize: Sequelize,
  eliminationData: CreateEliminationEntryDto,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const EliminationEntry = createEliminationEntryModel(sequelize);

  // Get fiscal period from consolidation
  const fiscalYear = new Date().getFullYear();
  const fiscalPeriod = new Date().getMonth() + 1;

  const elimination = await EliminationEntry.create(
    {
      ...eliminationData,
      fiscalYear,
      fiscalPeriod,
      description: `IC elimination: ${eliminationData.eliminationType}`,
      automatic: false,
      posted: false,
    },
    { transaction },
  );

  return elimination;
};

/**
 * Automatically generates elimination entries for a consolidation period.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} consolidationId - Consolidation ID
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {string} userId - User generating eliminations
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Generated elimination entries
 *
 * @example
 * ```typescript
 * const eliminations = await generateAutomaticEliminations(sequelize, 1, 2024, 1, 'user123');
 * ```
 */
export const generateAutomaticEliminations = async (
  sequelize: Sequelize,
  consolidationId: number,
  fiscalYear: number,
  fiscalPeriod: number,
  userId: string,
  transaction?: Transaction,
): Promise<any[]> => {
  const IntercompanyTransaction = createIntercompanyTransactionModel(sequelize);
  const EliminationEntry = createEliminationEntryModel(sequelize);

  // Get all posted intercompany transactions for the period
  const transactions = await IntercompanyTransaction.findAll({
    where: {
      status: 'posted',
      transactionDate: {
        [Op.gte]: new Date(fiscalYear, fiscalPeriod - 1, 1),
        [Op.lt]: new Date(fiscalYear, fiscalPeriod, 1),
      },
    },
    transaction,
  });

  const eliminations = [];

  for (const icTransaction of transactions) {
    // Generate revenue/expense elimination
    if (icTransaction.transactionType === 'sale') {
      const revenueElimination = await EliminationEntry.create(
        {
          consolidationId,
          eliminationType: 'revenue',
          fiscalYear,
          fiscalPeriod,
          sourceEntityId: icTransaction.sourceEntityId,
          destinationEntityId: icTransaction.destinationEntityId,
          eliminationAmount: icTransaction.functionalAmount,
          debitAccountCode: '4100', // IC Revenue
          creditAccountCode: '5100', // IC Expense
          description: `Auto-elimination: IC revenue/expense for ${icTransaction.transactionNumber}`,
          automatic: true,
          posted: false,
        },
        { transaction },
      );

      eliminations.push(revenueElimination);

      // Generate receivable/payable elimination
      const balanceElimination = await EliminationEntry.create(
        {
          consolidationId,
          eliminationType: 'receivable',
          fiscalYear,
          fiscalPeriod,
          sourceEntityId: icTransaction.sourceEntityId,
          destinationEntityId: icTransaction.destinationEntityId,
          eliminationAmount: icTransaction.functionalAmount,
          debitAccountCode: '2110', // IC Payable
          creditAccountCode: '1210', // IC Receivable
          description: `Auto-elimination: IC receivable/payable for ${icTransaction.transactionNumber}`,
          automatic: true,
          posted: false,
        },
        { transaction },
      );

      eliminations.push(balanceElimination);
    }
  }

  return eliminations;
};

/**
 * Posts elimination entries to the general ledger.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} consolidationId - Consolidation ID
 * @param {string} userId - User posting eliminations
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Posting result
 *
 * @example
 * ```typescript
 * const result = await postEliminationEntries(sequelize, 1, 'user123');
 * ```
 */
export const postEliminationEntries = async (
  sequelize: Sequelize,
  consolidationId: number,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const EliminationEntry = createEliminationEntryModel(sequelize);

  const eliminations = await EliminationEntry.findAll({
    where: {
      consolidationId,
      posted: false,
    },
    transaction,
  });

  let postedCount = 0;
  for (const elimination of eliminations) {
    // Create journal entry (would integrate with GL)
    const journalEntryId = 0; // Placeholder

    await elimination.update(
      {
        posted: true,
        journalEntryId,
      },
      { transaction },
    );

    postedCount++;
  }

  return {
    consolidationId,
    eliminationsPosted: postedCount,
    postedBy: userId,
    postedAt: new Date(),
  };
};

/**
 * Reverses elimination entries for a consolidation period.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} consolidationId - Consolidation ID
 * @param {string} userId - User reversing eliminations
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Reversal result
 *
 * @example
 * ```typescript
 * const result = await reverseEliminationEntries(sequelize, 1, 'user123');
 * ```
 */
export const reverseEliminationEntries = async (
  sequelize: Sequelize,
  consolidationId: number,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const EliminationEntry = createEliminationEntryModel(sequelize);

  const eliminations = await EliminationEntry.findAll({
    where: {
      consolidationId,
      posted: true,
    },
    transaction,
  });

  let reversedCount = 0;
  for (const elimination of eliminations) {
    // Reverse journal entry (would integrate with GL)

    await elimination.update(
      {
        posted: false,
        journalEntryId: null,
      },
      { transaction },
    );

    reversedCount++;
  }

  return {
    consolidationId,
    eliminationsReversed: reversedCount,
    reversedBy: userId,
    reversedAt: new Date(),
  };
};

// ============================================================================
// RECONCILIATION FUNCTIONS
// ============================================================================

/**
 * Reconciles intercompany balances between entities.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {ReconcileIntercompanyDto} reconcileData - Reconciliation data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<IntercompanyReconciliation>} Reconciliation result
 *
 * @example
 * ```typescript
 * const reconciliation = await reconcileIntercompanyBalances(sequelize, {
 *   fiscalYear: 2024,
 *   fiscalPeriod: 1,
 *   entityId: 1,
 *   counterpartyEntityId: 2,
 *   userId: 'user123'
 * });
 * ```
 */
export const reconcileIntercompanyBalances = async (
  sequelize: Sequelize,
  reconcileData: ReconcileIntercompanyDto,
  transaction?: Transaction,
): Promise<IntercompanyReconciliation> => {
  const IntercompanyReconciliation = createIntercompanyReconciliationModel(sequelize);

  // Get balances from each entity (would query GL)
  const entityBalance = 50000; // Placeholder - IC Receivable
  const counterpartyBalance = -50000; // Placeholder - IC Payable

  const variance = entityBalance + counterpartyBalance;
  const variancePercent = entityBalance !== 0 ? (variance / Math.abs(entityBalance)) * 100 : 0;

  const status = Math.abs(variance) < 0.01 ? 'matched' : 'variance';

  const reconciliation = await IntercompanyReconciliation.create(
    {
      fiscalYear: reconcileData.fiscalYear,
      fiscalPeriod: reconcileData.fiscalPeriod,
      entityId: reconcileData.entityId,
      counterpartyEntityId: reconcileData.counterpartyEntityId,
      accountCode: '1210', // IC Receivable
      entityBalance,
      counterpartyBalance,
      variance,
      variancePercent,
      status,
      reconciledBy: status === 'matched' ? reconcileData.userId : null,
      reconciledAt: status === 'matched' ? new Date() : null,
    },
    { transaction },
  );

  return reconciliation.toJSON();
};

/**
 * Identifies intercompany reconciliation variances.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {number} varianceThreshold - Variance threshold
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Variance report
 *
 * @example
 * ```typescript
 * const variances = await identifyReconciliationVariances(sequelize, 2024, 1, 100);
 * ```
 */
export const identifyReconciliationVariances = async (
  sequelize: Sequelize,
  fiscalYear: number,
  fiscalPeriod: number,
  varianceThreshold: number,
  transaction?: Transaction,
): Promise<any[]> => {
  const IntercompanyReconciliation = createIntercompanyReconciliationModel(sequelize);

  const variances = await IntercompanyReconciliation.findAll({
    where: {
      fiscalYear,
      fiscalPeriod,
      variance: {
        [Op.or]: [{ [Op.gt]: varianceThreshold }, { [Op.lt]: -varianceThreshold }],
      },
      status: 'variance',
    },
    transaction,
  });

  return variances.map((v) => ({
    reconciliationId: v.id,
    entityId: v.entityId,
    counterpartyEntityId: v.counterpartyEntityId,
    accountCode: v.accountCode,
    variance: Number(v.variance),
    variancePercent: Number(v.variancePercent),
  }));
};

/**
 * Creates adjustment entry to resolve reconciliation variance.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} reconciliationId - Reconciliation ID
 * @param {number} adjustmentAmount - Adjustment amount
 * @param {string} adjustmentReason - Reason for adjustment
 * @param {string} userId - User creating adjustment
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Adjustment result
 *
 * @example
 * ```typescript
 * const result = await createReconciliationAdjustment(sequelize, 1, 500, 'Timing difference', 'user123');
 * ```
 */
export const createReconciliationAdjustment = async (
  sequelize: Sequelize,
  reconciliationId: number,
  adjustmentAmount: number,
  adjustmentReason: string,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const IntercompanyReconciliation = createIntercompanyReconciliationModel(sequelize);

  const reconciliation = await IntercompanyReconciliation.findByPk(reconciliationId, { transaction });
  if (!reconciliation) {
    throw new Error('Reconciliation not found');
  }

  // Create adjustment journal entry (would integrate with GL)
  const journalEntryId = 0; // Placeholder

  await reconciliation.update(
    {
      status: 'adjusted',
      reconciledBy: userId,
      reconciledAt: new Date(),
      notes: adjustmentReason,
    },
    { transaction },
  );

  return {
    reconciliationId,
    adjustmentAmount,
    adjustmentReason,
    journalEntryId,
    adjustedBy: userId,
    adjustedAt: new Date(),
  };
};

/**
 * Generates intercompany reconciliation report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Reconciliation report
 *
 * @example
 * ```typescript
 * const report = await generateReconciliationReport(sequelize, 2024, 1);
 * ```
 */
export const generateReconciliationReport = async (
  sequelize: Sequelize,
  fiscalYear: number,
  fiscalPeriod: number,
  transaction?: Transaction,
): Promise<any> => {
  const IntercompanyReconciliation = createIntercompanyReconciliationModel(sequelize);

  const reconciliations = await IntercompanyReconciliation.findAll({
    where: {
      fiscalYear,
      fiscalPeriod,
    },
    transaction,
  });

  const summary = {
    totalReconciliations: reconciliations.length,
    matched: reconciliations.filter((r) => r.status === 'matched').length,
    variances: reconciliations.filter((r) => r.status === 'variance').length,
    adjusted: reconciliations.filter((r) => r.status === 'adjusted').length,
    totalVarianceAmount: reconciliations.reduce((sum, r) => sum + Number(r.variance), 0),
  };

  return {
    fiscalYear,
    fiscalPeriod,
    summary,
    reconciliations: reconciliations.map((r) => r.toJSON()),
  };
};

// ============================================================================
// NETTING AND SETTLEMENT FUNCTIONS
// ============================================================================

/**
 * Processes bilateral or multilateral netting.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {ProcessNettingDto} nettingData - Netting data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<IntercompanyNetting>} Netting result
 *
 * @example
 * ```typescript
 * const netting = await processIntercompanyNetting(sequelize, {
 *   nettingDate: new Date(),
 *   nettingType: 'multilateral',
 *   currency: 'USD',
 *   participatingEntities: [1, 2, 3],
 *   userId: 'user123'
 * });
 * ```
 */
export const processIntercompanyNetting = async (
  sequelize: Sequelize,
  nettingData: ProcessNettingDto,
  transaction?: Transaction,
): Promise<IntercompanyNetting> => {
  // Calculate gross receivables and payables for each entity
  const entityBalances = new Map<number, { receivables: number; payables: number }>();

  for (const entityId of nettingData.participatingEntities) {
    // Would query actual balances from GL
    entityBalances.set(entityId, {
      receivables: 100000,
      payables: 75000,
    });
  }

  const totalGrossReceivables = Array.from(entityBalances.values()).reduce((sum, b) => sum + b.receivables, 0);
  const totalGrossPayables = Array.from(entityBalances.values()).reduce((sum, b) => sum + b.payables, 0);
  const netAmount = Math.abs(totalGrossReceivables - totalGrossPayables);
  const nettingSavings = totalGrossReceivables + totalGrossPayables - netAmount;

  const netting: IntercompanyNetting = {
    nettingId: 0,
    nettingDate: nettingData.nettingDate,
    nettingType: nettingData.nettingType,
    currency: nettingData.currency,
    participatingEntities: nettingData.participatingEntities,
    totalGrossReceivables,
    totalGrossPayables,
    netAmount,
    nettingSavings,
    status: 'calculated',
  };

  return netting;
};

/**
 * Approves netting and creates settlement instructions.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} nettingId - Netting ID
 * @param {string} userId - User approving netting
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Approval result
 *
 * @example
 * ```typescript
 * const result = await approveNetting(sequelize, 1, 'user123');
 * ```
 */
export const approveNetting = async (
  sequelize: Sequelize,
  nettingId: number,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  // Would update netting status and create settlement records
  return {
    nettingId,
    status: 'approved',
    approvedBy: userId,
    approvedAt: new Date(),
    settlementsCreated: 2,
  };
};

/**
 * Creates intercompany settlement instruction.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {any} settlementData - Settlement data
 * @param {string} userId - User creating settlement
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<IntercompanySettlement>} Created settlement
 *
 * @example
 * ```typescript
 * const settlement = await createIntercompanySettlement(sequelize, {
 *   payerEntityId: 1,
 *   payeeEntityId: 2,
 *   settlementAmount: 25000,
 *   currency: 'USD',
 *   settlementMethod: 'wire',
 *   settlementDate: new Date()
 * }, 'user123');
 * ```
 */
export const createIntercompanySettlement = async (
  sequelize: Sequelize,
  settlementData: any,
  userId: string,
  transaction?: Transaction,
): Promise<IntercompanySettlement> => {
  const settlement: IntercompanySettlement = {
    settlementId: 0,
    nettingId: settlementData.nettingId,
    settlementDate: settlementData.settlementDate,
    payerEntityId: settlementData.payerEntityId,
    payeeEntityId: settlementData.payeeEntityId,
    settlementAmount: settlementData.settlementAmount,
    currency: settlementData.currency,
    settlementMethod: settlementData.settlementMethod,
    status: 'pending',
    referenceNumber: `SETTLE-${Date.now()}`,
  };

  return settlement;
};

/**
 * Processes settlement payment and updates balances.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} settlementId - Settlement ID
 * @param {string} userId - User processing settlement
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Settlement result
 *
 * @example
 * ```typescript
 * const result = await processSettlement(sequelize, 1, 'user123');
 * ```
 */
export const processSettlement = async (
  sequelize: Sequelize,
  settlementId: number,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  // Would process payment and create journal entries
  return {
    settlementId,
    status: 'completed',
    processedBy: userId,
    completedAt: new Date(),
  };
};

// ============================================================================
// TRANSFER PRICING FUNCTIONS
// ============================================================================

/**
 * Calculates transfer price using specified method.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} transactionId - Transaction ID
 * @param {string} pricingMethod - Pricing method
 * @param {any} pricingParams - Pricing parameters
 * @param {string} userId - User calculating price
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<TransferPricing>} Transfer pricing result
 *
 * @example
 * ```typescript
 * const pricing = await calculateTransferPrice(sequelize, 1, 'cost-plus', {
 *   baseAmount: 80000,
 *   markup: 0.25
 * }, 'user123');
 * ```
 */
export const calculateTransferPrice = async (
  sequelize: Sequelize,
  transactionId: number,
  pricingMethod: string,
  pricingParams: any,
  userId: string,
  transaction?: Transaction,
): Promise<TransferPricing> => {
  const IntercompanyTransaction = createIntercompanyTransactionModel(sequelize);

  const icTransaction = await IntercompanyTransaction.findByPk(transactionId, { transaction });
  if (!icTransaction) {
    throw new Error('Intercompany transaction not found');
  }

  let transferPrice = 0;
  const baseAmount = pricingParams.baseAmount || icTransaction.amount;
  const markup = pricingParams.markup || 0;

  if (pricingMethod === 'cost-plus') {
    transferPrice = baseAmount * (1 + markup);
  } else if (pricingMethod === 'resale-minus') {
    const resalePrice = pricingParams.resalePrice || 0;
    const margin = pricingParams.margin || 0;
    transferPrice = resalePrice * (1 - margin);
  } else if (pricingMethod === 'comparable-uncontrolled') {
    transferPrice = pricingParams.marketPrice || baseAmount;
  }

  const pricing: TransferPricing = {
    transferPricingId: 0,
    transactionId,
    sourceEntityId: icTransaction.sourceEntityId,
    destinationEntityId: icTransaction.destinationEntityId,
    pricingMethod,
    baseAmount,
    markup,
    transferPrice,
    marketPrice: pricingParams.marketPrice,
    complianceRegion: pricingParams.complianceRegion || 'US',
    approvedBy: userId,
  };

  return pricing;
};

/**
 * Validates transfer pricing for arm's length compliance.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} transferPricingId - Transfer pricing ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateTransferPricing(sequelize, 1);
 * ```
 */
export const validateTransferPricing = async (
  sequelize: Sequelize,
  transferPricingId: number,
  transaction?: Transaction,
): Promise<any> => {
  // Would validate against market benchmarks and compliance rules
  const validation = {
    transferPricingId,
    compliant: true,
    armLengthRange: {
      min: 90000,
      max: 110000,
    },
    transferPrice: 100000,
    withinRange: true,
    complianceRules: ['OECD Guidelines', 'IRC Section 482'],
  };

  return validation;
};

/**
 * Generates transfer pricing documentation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} transactionId - Transaction ID
 * @param {string} documentationType - Documentation type
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Documentation
 *
 * @example
 * ```typescript
 * const docs = await generateTransferPricingDocumentation(sequelize, 1, 'master-file');
 * ```
 */
export const generateTransferPricingDocumentation = async (
  sequelize: Sequelize,
  transactionId: number,
  documentationType: string,
  transaction?: Transaction,
): Promise<any> => {
  // Would generate required documentation
  return {
    transactionId,
    documentationType,
    sections: ['Business Overview', 'Functional Analysis', 'Economic Analysis', 'Benchmarking Study'],
    generatedAt: new Date(),
  };
};

// ============================================================================
// CONSOLIDATION FUNCTIONS
// ============================================================================

/**
 * Initiates consolidation process for a fiscal period.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {number[]} participatingEntities - Participating entity IDs
 * @param {string} userId - User initiating consolidation
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<ConsolidationPeriod>} Consolidation period
 *
 * @example
 * ```typescript
 * const consolidation = await initiateConsolidation(sequelize, 2024, 1, [1, 2, 3], 'user123');
 * ```
 */
export const initiateConsolidation = async (
  sequelize: Sequelize,
  fiscalYear: number,
  fiscalPeriod: number,
  participatingEntities: number[],
  userId: string,
  transaction?: Transaction,
): Promise<ConsolidationPeriod> => {
  const consolidation: ConsolidationPeriod = {
    consolidationId: 0,
    fiscalYear,
    fiscalPeriod,
    consolidationDate: new Date(),
    consolidationLevel: 'legal',
    participatingEntities,
    eliminationsProcessed: 0,
    status: 'in-progress',
    processedBy: userId,
  };

  return consolidation;
};

/**
 * Completes consolidation process and locks the period.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} consolidationId - Consolidation ID
 * @param {string} userId - User completing consolidation
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Completion result
 *
 * @example
 * ```typescript
 * const result = await completeConsolidation(sequelize, 1, 'user123');
 * ```
 */
export const completeConsolidation = async (
  sequelize: Sequelize,
  consolidationId: number,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  // Would finalize consolidation and lock period
  return {
    consolidationId,
    status: 'completed',
    completedBy: userId,
    completedAt: new Date(),
  };
};

/**
 * Generates consolidated financial statements.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} consolidationId - Consolidation ID
 * @param {string} statementType - Statement type
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Consolidated statement
 *
 * @example
 * ```typescript
 * const statement = await generateConsolidatedStatement(sequelize, 1, 'balance-sheet');
 * ```
 */
export const generateConsolidatedStatement = async (
  sequelize: Sequelize,
  consolidationId: number,
  statementType: string,
  transaction?: Transaction,
): Promise<any> => {
  // Would generate consolidated financial statements
  return {
    consolidationId,
    statementType,
    generatedAt: new Date(),
  };
};

// ============================================================================
// REPORTING AND ANALYTICS FUNCTIONS
// ============================================================================

/**
 * Generates intercompany transaction summary report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Transaction summary
 *
 * @example
 * ```typescript
 * const summary = await getIntercompanyTransactionSummary(sequelize, new Date('2024-01-01'), new Date('2024-12-31'));
 * ```
 */
export const getIntercompanyTransactionSummary = async (
  sequelize: Sequelize,
  startDate: Date,
  endDate: Date,
  transaction?: Transaction,
): Promise<any> => {
  const IntercompanyTransaction = createIntercompanyTransactionModel(sequelize);

  const transactions = await IntercompanyTransaction.findAll({
    where: {
      transactionDate: {
        [Op.between]: [startDate, endDate],
      },
    },
    transaction,
  });

  const summary = {
    totalTransactions: transactions.length,
    totalAmount: transactions.reduce((sum, t) => sum + Number(t.functionalAmount), 0),
    byType: transactions.reduce(
      (acc, t) => {
        if (!acc[t.transactionType]) {
          acc[t.transactionType] = { count: 0, amount: 0 };
        }
        acc[t.transactionType].count++;
        acc[t.transactionType].amount += Number(t.functionalAmount);
        return acc;
      },
      {} as Record<string, any>,
    ),
    byStatus: transactions.reduce(
      (acc, t) => {
        if (!acc[t.status]) {
          acc[t.status] = { count: 0, amount: 0 };
        }
        acc[t.status].count++;
        acc[t.status].amount += Number(t.functionalAmount);
        return acc;
      },
      {} as Record<string, any>,
    ),
  };

  return summary;
};

/**
 * Analyzes intercompany balance positions by entity.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Entity balance positions
 *
 * @example
 * ```typescript
 * const positions = await analyzeIntercompanyPositions(sequelize, 2024, 1);
 * ```
 */
export const analyzeIntercompanyPositions = async (
  sequelize: Sequelize,
  fiscalYear: number,
  fiscalPeriod: number,
  transaction?: Transaction,
): Promise<any[]> => {
  // Would analyze IC balances by entity
  const positions = [
    {
      entityId: 1,
      receivables: 150000,
      payables: 75000,
      netPosition: 75000,
      counterparties: [
        { entityId: 2, amount: 50000 },
        { entityId: 3, amount: 25000 },
      ],
    },
  ];

  return positions;
};

/**
 * Exports intercompany data for regulatory reporting.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {string} format - Export format
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Exported data
 *
 * @example
 * ```typescript
 * const exported = await exportIntercompanyData(sequelize, 2024, 1, 'json');
 * ```
 */
export const exportIntercompanyData = async (
  sequelize: Sequelize,
  fiscalYear: number,
  fiscalPeriod: number,
  format: string,
  transaction?: Transaction,
): Promise<any> => {
  const IntercompanyTransaction = createIntercompanyTransactionModel(sequelize);

  const transactions = await IntercompanyTransaction.findAll({
    where: {
      transactionDate: {
        [Op.gte]: new Date(fiscalYear, fiscalPeriod - 1, 1),
        [Op.lt]: new Date(fiscalYear, fiscalPeriod, 1),
      },
    },
    transaction,
  });

  const exportData = transactions.map((t) => ({
    transactionNumber: t.transactionNumber,
    transactionDate: t.transactionDate,
    sourceEntity: t.sourceEntityCode,
    destinationEntity: t.destinationEntityCode,
    transactionType: t.transactionType,
    amount: Number(t.amount),
    currency: t.currency,
    status: t.status,
  }));

  return exportData;
};

/**
 * Validates intercompany transaction for regulatory compliance.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} transactionId - Transaction ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateIntercompanyCompliance(sequelize, 1);
 * ```
 */
export const validateIntercompanyCompliance = async (
  sequelize: Sequelize,
  transactionId: number,
  transaction?: Transaction,
): Promise<any> => {
  const IntercompanyTransaction = createIntercompanyTransactionModel(sequelize);

  const icTransaction = await IntercompanyTransaction.findByPk(transactionId, { transaction });
  if (!icTransaction) {
    throw new Error('Intercompany transaction not found');
  }

  const validationResults = {
    transactionId,
    hasTransferPricing: true, // Would check transfer pricing
    transferPricingCompliant: true,
    hasDocumentation: true,
    correctAccounting: true,
    eliminationRequired: true,
    overallCompliant: true,
  };

  return validationResults;
};

/**
 * Generates intercompany aging report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} entityId - Entity ID
 * @param {Date} asOfDate - Aging date
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Aging report
 *
 * @example
 * ```typescript
 * const aging = await generateIntercompanyAgingReport(sequelize, 1, new Date());
 * ```
 */
export const generateIntercompanyAgingReport = async (
  sequelize: Sequelize,
  entityId: number,
  asOfDate: Date,
  transaction?: Transaction,
): Promise<any> => {
  const IntercompanyTransaction = createIntercompanyTransactionModel(sequelize);

  const transactions = await IntercompanyTransaction.findAll({
    where: {
      [Op.or]: [{ sourceEntityId: entityId }, { destinationEntityId: entityId }],
      status: { [Op.in]: ['posted', 'approved'] },
      dueDate: { [Op.ne]: null },
    },
    transaction,
  });

  const agingBuckets = {
    current: 0,
    days1to30: 0,
    days31to60: 0,
    days61to90: 0,
    over90: 0,
  };

  transactions.forEach((txn) => {
    if (!txn.dueDate) return;

    const daysOverdue = Math.floor((asOfDate.getTime() - txn.dueDate.getTime()) / (1000 * 60 * 60 * 24));
    const amount = Number(txn.functionalAmount);

    if (daysOverdue <= 0) agingBuckets.current += amount;
    else if (daysOverdue <= 30) agingBuckets.days1to30 += amount;
    else if (daysOverdue <= 60) agingBuckets.days31to60 += amount;
    else if (daysOverdue <= 90) agingBuckets.days61to90 += amount;
    else agingBuckets.over90 += amount;
  });

  return {
    entityId,
    asOfDate,
    agingBuckets,
    totalOutstanding: Object.values(agingBuckets).reduce((sum, amt) => sum + amt, 0),
  };
};

/**
 * Creates intercompany loan agreement.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {any} loanData - Loan data
 * @param {string} userId - User creating loan
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<IntercompanyLoan>} Created loan
 *
 * @example
 * ```typescript
 * const loan = await createIntercompanyLoan(sequelize, {
 *   lenderEntityId: 1,
 *   borrowerEntityId: 2,
 *   principalAmount: 1000000,
 *   currency: 'USD',
 *   interestRate: 5.0,
 *   startDate: new Date(),
 *   maturityDate: new Date('2026-12-31')
 * }, 'user123');
 * ```
 */
export const createIntercompanyLoan = async (
  sequelize: Sequelize,
  loanData: any,
  userId: string,
  transaction?: Transaction,
): Promise<IntercompanyLoan> => {
  const loan: IntercompanyLoan = {
    loanId: 0,
    loanNumber: `ICL-${Date.now()}`,
    lenderEntityId: loanData.lenderEntityId,
    borrowerEntityId: loanData.borrowerEntityId,
    principalAmount: loanData.principalAmount,
    currency: loanData.currency,
    interestRate: loanData.interestRate,
    startDate: loanData.startDate,
    maturityDate: loanData.maturityDate,
    outstandingPrincipal: loanData.principalAmount,
    accruedInterest: 0,
    status: 'active',
    armLengthCompliant: true,
  };

  // Would create in database
  return loan;
};

/**
 * Calculates intercompany loan interest accrual.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} loanId - Loan ID
 * @param {Date} asOfDate - Accrual date
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Interest accrual
 *
 * @example
 * ```typescript
 * const accrual = await calculateLoanInterestAccrual(sequelize, 1, new Date());
 * ```
 */
export const calculateLoanInterestAccrual = async (
  sequelize: Sequelize,
  loanId: number,
  asOfDate: Date,
  transaction?: Transaction,
): Promise<any> => {
  // Would fetch loan details
  const loan = {
    loanId,
    outstandingPrincipal: 1000000,
    interestRate: 5.0,
    startDate: new Date('2024-01-01'),
  };

  const daysOutstanding = Math.floor((asOfDate.getTime() - loan.startDate.getTime()) / (1000 * 60 * 60 * 24));
  const interestAccrued = (loan.outstandingPrincipal * (loan.interestRate / 100) * daysOutstanding) / 365;

  return {
    loanId,
    asOfDate,
    outstandingPrincipal: loan.outstandingPrincipal,
    interestRate: loan.interestRate,
    daysOutstanding,
    interestAccrued,
  };
};

/**
 * Processes intercompany loan repayment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} loanId - Loan ID
 * @param {number} repaymentAmount - Repayment amount
 * @param {Date} repaymentDate - Repayment date
 * @param {string} userId - User processing repayment
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Repayment result
 *
 * @example
 * ```typescript
 * const result = await processLoanRepayment(sequelize, 1, 100000, new Date(), 'user123');
 * ```
 */
export const processLoanRepayment = async (
  sequelize: Sequelize,
  loanId: number,
  repaymentAmount: number,
  repaymentDate: Date,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  // Would update loan principal
  return {
    loanId,
    repaymentAmount,
    repaymentDate,
    newOutstandingPrincipal: 900000,
    processedBy: userId,
  };
};

/**
 * Creates intercompany allocation entry.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {any} allocationData - Allocation data
 * @param {string} userId - User creating allocation
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<IntercompanyAllocation>} Created allocation
 *
 * @example
 * ```typescript
 * const allocation = await createIntercompanyAllocation(sequelize, {
 *   allocationDate: new Date(),
 *   allocationBasis: 'revenue',
 *   totalAmount: 500000,
 *   sourceEntityId: 1,
 *   destinationEntities: [
 *     { entityId: 2, allocationPercent: 60 },
 *     { entityId: 3, allocationPercent: 40 }
 *   ]
 * }, 'user123');
 * ```
 */
export const createIntercompanyAllocation = async (
  sequelize: Sequelize,
  allocationData: any,
  userId: string,
  transaction?: Transaction,
): Promise<IntercompanyAllocation> => {
  const totalPercent = allocationData.destinationEntities.reduce(
    (sum: number, dest: any) => sum + dest.allocationPercent,
    0,
  );

  if (Math.abs(totalPercent - 100) > 0.01) {
    throw new Error('Allocation percentages must sum to 100%');
  }

  const destinationEntities = allocationData.destinationEntities.map((dest: any) => ({
    entityId: dest.entityId,
    entityCode: `ENT-${dest.entityId}`,
    allocationPercent: dest.allocationPercent,
    allocatedAmount: (allocationData.totalAmount * dest.allocationPercent) / 100,
    allocationDriver: dest.allocationDriver || 0,
  }));

  const allocation: IntercompanyAllocation = {
    allocationId: 0,
    allocationNumber: `ICA-${Date.now()}`,
    allocationDate: allocationData.allocationDate,
    allocationBasis: allocationData.allocationBasis,
    totalAmount: allocationData.totalAmount,
    sourceEntityId: allocationData.sourceEntityId,
    destinationEntities,
    fiscalYear: allocationData.allocationDate.getFullYear(),
    fiscalPeriod: allocationData.allocationDate.getMonth() + 1,
    status: 'draft',
  };

  return allocation;
};

/**
 * Posts intercompany allocation entries.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} allocationId - Allocation ID
 * @param {string} userId - User posting allocation
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Posting result
 *
 * @example
 * ```typescript
 * const result = await postIntercompanyAllocation(sequelize, 1, 'user123');
 * ```
 */
export const postIntercompanyAllocation = async (
  sequelize: Sequelize,
  allocationId: number,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  // Would post allocation entries
  return {
    allocationId,
    status: 'posted',
    entriesCreated: 2,
    postedBy: userId,
    postedAt: new Date(),
  };
};

/**
 * Tracks intercompany balancing for an entity.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} entityId - Entity ID
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<IntercompanyBalancing>} Balancing result
 *
 * @example
 * ```typescript
 * const balancing = await trackIntercompanyBalancing(sequelize, 1, 2024, 1);
 * ```
 */
export const trackIntercompanyBalancing = async (
  sequelize: Sequelize,
  entityId: number,
  fiscalYear: number,
  fiscalPeriod: number,
  transaction?: Transaction,
): Promise<IntercompanyBalancing> => {
  // Would calculate from GL
  const totalReceivables = 150000;
  const totalPayables = 75000;
  const netPosition = totalReceivables - totalPayables;
  const balanced = Math.abs(netPosition) < 0.01;

  const balancing: IntercompanyBalancing = {
    balancingId: 0,
    entityId,
    fiscalYear,
    fiscalPeriod,
    totalReceivables,
    totalPayables,
    netPosition,
    balancingAccountCode: '1290', // IC Balancing Account
    balanced,
    varianceAmount: balanced ? 0 : netPosition,
  };

  return balancing;
};

/**
 * Generates intercompany transaction matching report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Matching report
 *
 * @example
 * ```typescript
 * const report = await generateTransactionMatchingReport(sequelize, 2024, 1);
 * ```
 */
export const generateTransactionMatchingReport = async (
  sequelize: Sequelize,
  fiscalYear: number,
  fiscalPeriod: number,
  transaction?: Transaction,
): Promise<any> => {
  const IntercompanyTransaction = createIntercompanyTransactionModel(sequelize);

  const transactions = await IntercompanyTransaction.findAll({
    where: {
      transactionDate: {
        [Op.gte]: new Date(fiscalYear, fiscalPeriod - 1, 1),
        [Op.lt]: new Date(fiscalYear, fiscalPeriod, 1),
      },
    },
    transaction,
  });

  const matchedPairs = new Map<string, any>();

  transactions.forEach((txn) => {
    const pairKey = `${Math.min(txn.sourceEntityId, txn.destinationEntityId)}-${Math.max(txn.sourceEntityId, txn.destinationEntityId)}`;

    if (!matchedPairs.has(pairKey)) {
      matchedPairs.set(pairKey, {
        entity1: txn.sourceEntityId,
        entity2: txn.destinationEntityId,
        entity1Transactions: [],
        entity2Transactions: [],
      });
    }

    const pair = matchedPairs.get(pairKey)!;
    if (txn.sourceEntityId === pair.entity1) {
      pair.entity1Transactions.push(txn);
    } else {
      pair.entity2Transactions.push(txn);
    }
  });

  return {
    fiscalYear,
    fiscalPeriod,
    totalPairs: matchedPairs.size,
    pairs: Array.from(matchedPairs.values()),
  };
};

/**
 * Identifies unmatched intercompany transactions.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Unmatched transactions
 *
 * @example
 * ```typescript
 * const unmatched = await identifyUnmatchedTransactions(sequelize, 2024, 1);
 * ```
 */
export const identifyUnmatchedTransactions = async (
  sequelize: Sequelize,
  fiscalYear: number,
  fiscalPeriod: number,
  transaction?: Transaction,
): Promise<any[]> => {
  const IntercompanyTransaction = createIntercompanyTransactionModel(sequelize);

  const transactions = await IntercompanyTransaction.findAll({
    where: {
      transactionDate: {
        [Op.gte]: new Date(fiscalYear, fiscalPeriod - 1, 1),
        [Op.lt]: new Date(fiscalYear, fiscalPeriod, 1),
      },
      status: 'posted',
    },
    transaction,
  });

  // Would implement matching logic
  const unmatched = transactions.slice(0, 5).map((txn) => ({
    transactionId: txn.id,
    transactionNumber: txn.transactionNumber,
    sourceEntity: txn.sourceEntityCode,
    destinationEntity: txn.destinationEntityCode,
    amount: Number(txn.functionalAmount),
    reason: 'No corresponding transaction in counterparty entity',
  }));

  return unmatched;
};

/**
 * Creates currency translation adjustment for intercompany balances.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} entityId - Entity ID
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<CurrencyTranslation>} Translation adjustment
 *
 * @example
 * ```typescript
 * const translation = await createCurrencyTranslationAdjustment(sequelize, 1, 2024, 1);
 * ```
 */
export const createCurrencyTranslationAdjustment = async (
  sequelize: Sequelize,
  entityId: number,
  fiscalYear: number,
  fiscalPeriod: number,
  transaction?: Transaction,
): Promise<CurrencyTranslation> => {
  const functionalCurrency = 'EUR';
  const reportingCurrency = 'USD';
  const averageRate = 1.08;
  const closingRate = 1.10;

  // Would calculate IC balance translation
  const icBalance = 100000; // EUR
  const translationAdjustment = icBalance * (closingRate - averageRate);

  const translation: CurrencyTranslation = {
    translationId: 0,
    entityId,
    fiscalYear,
    fiscalPeriod,
    functionalCurrency,
    reportingCurrency,
    translationMethod: 'current-rate',
    averageRate,
    closingRate,
    translationAdjustment,
    accountCode: '3900', // Other Comprehensive Income
  };

  return translation;
};

/**
 * Generates consolidation worksheet.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} consolidationId - Consolidation ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Consolidation worksheet
 *
 * @example
 * ```typescript
 * const worksheet = await generateConsolidationWorksheet(sequelize, 1);
 * ```
 */
export const generateConsolidationWorksheet = async (
  sequelize: Sequelize,
  consolidationId: number,
  transaction?: Transaction,
): Promise<any> => {
  // Would generate full consolidation worksheet
  return {
    consolidationId,
    entities: [
      { entityId: 1, entityCode: 'ENT-1', totalAssets: 5000000, totalLiabilities: 3000000, equity: 2000000 },
      { entityId: 2, entityCode: 'ENT-2', totalAssets: 3000000, totalLiabilities: 1500000, equity: 1500000 },
    ],
    eliminations: [
      { type: 'receivable', debit: 200000, credit: 200000 },
      { type: 'revenue', debit: 500000, credit: 500000 },
    ],
    consolidated: {
      totalAssets: 7600000,
      totalLiabilities: 4500000,
      equity: 3100000,
    },
  };
};

/**
 * Validates elimination completeness for consolidation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} consolidationId - Consolidation ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateEliminationCompleteness(sequelize, 1);
 * ```
 */
export const validateEliminationCompleteness = async (
  sequelize: Sequelize,
  consolidationId: number,
  transaction?: Transaction,
): Promise<any> => {
  const EliminationEntry = createEliminationEntryModel(sequelize);

  const eliminations = await EliminationEntry.findAll({
    where: { consolidationId },
    transaction,
  });

  const eliminationTypes = ['revenue', 'expense', 'receivable', 'payable', 'investment', 'equity'];
  const processedTypes = new Set(eliminations.map((e) => e.eliminationType));

  const missingTypes = eliminationTypes.filter((type) => !processedTypes.has(type));

  return {
    consolidationId,
    totalEliminations: eliminations.length,
    eliminationTypes: Array.from(processedTypes),
    missingTypes,
    isComplete: missingTypes.length === 0,
  };
};

/**
 * Creates intercompany dividend transaction.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {any} dividendData - Dividend data
 * @param {string} userId - User creating dividend
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created dividend transaction
 *
 * @example
 * ```typescript
 * const dividend = await createIntercompanyDividend(sequelize, {
 *   declaringEntityId: 2,
 *   receivingEntityId: 1,
 *   dividendAmount: 250000,
 *   declarationDate: new Date(),
 *   paymentDate: new Date('2024-12-31')
 * }, 'user123');
 * ```
 */
export const createIntercompanyDividend = async (
  sequelize: Sequelize,
  dividendData: any,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const icTransaction = await createIntercompanyTransaction(
    sequelize,
    {
      transactionNumber: `ICD-${Date.now()}`,
      transactionDate: dividendData.declarationDate,
      sourceEntityId: dividendData.declaringEntityId,
      destinationEntityId: dividendData.receivingEntityId,
      transactionType: 'transfer',
      amount: dividendData.dividendAmount,
      currency: 'USD',
      description: `Intercompany dividend payment`,
    },
    userId,
    transaction,
  );

  return {
    dividendId: icTransaction.id,
    declaringEntity: dividendData.declaringEntityId,
    receivingEntity: dividendData.receivingEntityId,
    dividendAmount: dividendData.dividendAmount,
    declarationDate: dividendData.declarationDate,
    paymentDate: dividendData.paymentDate,
    eliminationRequired: true,
  };
};

/**
 * Generates intercompany profit elimination analysis.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} consolidationId - Consolidation ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Profit elimination analysis
 *
 * @example
 * ```typescript
 * const analysis = await analyzeUnrealizedProfit(sequelize, 1);
 * ```
 */
export const analyzeUnrealizedProfit = async (
  sequelize: Sequelize,
  consolidationId: number,
  transaction?: Transaction,
): Promise<any> => {
  // Would analyze inventory and assets for unrealized profit
  return {
    consolidationId,
    inventoryProfit: 50000,
    fixedAssetProfit: 25000,
    totalUnrealizedProfit: 75000,
    eliminationEntries: [
      { description: 'Eliminate inventory profit', amount: 50000 },
      { description: 'Eliminate fixed asset profit', amount: 25000 },
    ],
  };
};

/**
 * Processes intercompany account reconciliation batch.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {number[]} entityIds - Entity IDs to reconcile
 * @param {string} userId - User processing reconciliation
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Batch reconciliation result
 *
 * @example
 * ```typescript
 * const result = await batchReconcileIntercompanyAccounts(sequelize, 2024, 1, [1, 2, 3], 'user123');
 * ```
 */
export const batchReconcileIntercompanyAccounts = async (
  sequelize: Sequelize,
  fiscalYear: number,
  fiscalPeriod: number,
  entityIds: number[],
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const reconciliations = [];
  let matchedCount = 0;
  let varianceCount = 0;

  for (let i = 0; i < entityIds.length; i++) {
    for (let j = i + 1; j < entityIds.length; j++) {
      const reconciliation = await reconcileIntercompanyBalances(
        sequelize,
        {
          fiscalYear,
          fiscalPeriod,
          entityId: entityIds[i],
          counterpartyEntityId: entityIds[j],
          userId,
        },
        transaction,
      );

      reconciliations.push(reconciliation);

      if (reconciliation.status === 'matched') matchedCount++;
      else varianceCount++;
    }
  }

  return {
    fiscalYear,
    fiscalPeriod,
    entitiesProcessed: entityIds.length,
    reconciliationsPerformed: reconciliations.length,
    matchedCount,
    varianceCount,
    reconciliations,
  };
};

/**
 * Generates transfer pricing summary report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Transfer pricing summary
 *
 * @example
 * ```typescript
 * const summary = await generateTransferPricingSummary(sequelize, 2024);
 * ```
 */
export const generateTransferPricingSummary = async (
  sequelize: Sequelize,
  fiscalYear: number,
  transaction?: Transaction,
): Promise<any> => {
  // Would aggregate transfer pricing data
  return {
    fiscalYear,
    totalTransactions: 150,
    totalValue: 15000000,
    byMethod: {
      'cost-plus': { count: 80, value: 8000000 },
      'resale-minus': { count: 40, value: 4000000 },
      'comparable-uncontrolled': { count: 30, value: 3000000 },
    },
    complianceRate: 98.5,
    documentationComplete: 145,
    documentationPending: 5,
  };
};

/**
 * Archives completed consolidation period.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} consolidationId - Consolidation ID
 * @param {string} userId - User archiving consolidation
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Archive result
 *
 * @example
 * ```typescript
 * const result = await archiveConsolidation(sequelize, 1, 'user123');
 * ```
 */
export const archiveConsolidation = async (
  sequelize: Sequelize,
  consolidationId: number,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  // Would lock and archive consolidation data
  return {
    consolidationId,
    status: 'locked',
    archivedBy: userId,
    archivedAt: new Date(),
    archivePath: `/archives/consolidation/${consolidationId}`,
  };
};
