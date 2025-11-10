/**
 * LOC: CEFMSRRM001
 * File: /reuse/financial/cefms/composites/cefms-revenue-recognition-management-composite.ts
 *
 * UPSTREAM (imports from):
 *   - ../../../government/revenue-recognition-management-kit.ts
 *   - ../../../government/fund-accounting-operations-kit.ts
 *   - ../../../government/grant-management-compliance-kit.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend CEFMS revenue services
 *   - USACE revenue tracking systems
 *   - Grant revenue modules
 */

/**
 * File: /reuse/financial/cefms/composites/cefms-revenue-recognition-management-composite.ts
 * Locator: WC-CEFMS-RRM-001
 * Purpose: USACE CEFMS Revenue Recognition Management - revenue streams, recognition timing, deferred revenue, accruals
 *
 * Upstream: Composes utilities from government revenue and grant kits
 * Downstream: ../../../backend/cefms/*, Revenue controllers, grant revenue tracking, accrual processing
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 42+ composite functions for USACE CEFMS revenue recognition operations
 *
 * LLM Context: Production-ready USACE CEFMS revenue recognition management system.
 * Comprehensive revenue stream tracking, recognition timing analysis (point-in-time vs. over-time),
 * deferred revenue management, accrual method processing, revenue allocation across funds,
 * performance obligation tracking, contract revenue recognition (ASC 606), grant revenue with restrictions,
 * exchange vs. non-exchange transactions, recognition criteria validation, revenue reconciliation,
 * billing integration, and GASB 33/34 compliance reporting.
 */

import { Model, DataTypes, Sequelize, Transaction, Op } from 'sequelize';
import { Injectable } from '@nestjs/common';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface RevenueStreamData {
  streamId: string;
  streamName: string;
  streamCategory: 'tax' | 'grant' | 'fee' | 'fine' | 'interest' | 'sale' | 'reimbursement' | 'other';
  revenueType: 'exchange' | 'non_exchange';
  recognitionMethod: 'point_in_time' | 'over_time' | 'milestone' | 'percentage_completion';
  fundCode: string;
  accountCode: string;
  isRecurring: boolean;
  fiscalYear: number;
  budgetedAmount: number;
  isRestricted: boolean;
}

interface RevenueTransactionData {
  transactionId: string;
  streamId: string;
  transactionDate: Date;
  amount: number;
  description: string;
  billedAmount?: number;
  collectedAmount?: number;
  customerId?: string;
  invoiceNumber?: string;
  paymentMethod?: string;
  status: 'billed' | 'collected' | 'deferred' | 'recognized' | 'voided';
}

interface DeferredRevenueData {
  deferralId: string;
  transactionId: string;
  streamId: string;
  deferredAmount: number;
  deferralDate: Date;
  recognitionStartDate: Date;
  recognitionEndDate: Date;
  recognitionPeriods: number;
  amountRecognized: number;
  amountRemaining: number;
  recognitionSchedule: 'straight_line' | 'proportional' | 'milestone';
}

interface PerformanceObligationData {
  obligationId: string;
  contractId: string;
  streamId: string;
  description: string;
  totalAmount: number;
  satisfactionMethod: 'point_in_time' | 'over_time';
  percentComplete: number;
  amountRecognized: number;
  amountRemaining: number;
  startDate: Date;
  estimatedCompletionDate: Date;
  actualCompletionDate?: Date;
  status: 'not_started' | 'in_progress' | 'completed';
}

interface GrantRevenueData {
  grantId: string;
  grantName: string;
  grantorAgency: string;
  grantNumber: string;
  awardAmount: number;
  revenueRecognized: number;
  revenueDeferred: number;
  eligibilityRequirements: string[];
  hasTimeRestriction: boolean;
  hasPurposeRestriction: boolean;
  recognitionBasis: 'expenditure_driven' | 'entitlement' | 'reimbursement';
  fiscalYear: number;
}

interface RevenueAccrualData {
  accrualId: string;
  streamId: string;
  accrualDate: Date;
  accrualAmount: number;
  accrualType: 'receivable' | 'unearned' | 'unbilled';
  fiscalYear: number;
  fiscalPeriod: number;
  isReversed: boolean;
  reversalDate?: Date;
  journalEntryNumber?: string;
}

interface RevenueAllocationData {
  allocationId: string;
  transactionId: string;
  fundCode: string;
  amount: number;
  percentage: number;
  allocationReason: string;
  isAutomated: boolean;
}

interface RevenueForecastData {
  forecastId: string;
  streamId: string;
  fiscalYear: number;
  fiscalPeriod: number;
  forecastAmount: number;
  actualAmount: number;
  variance: number;
  forecastMethod: 'historical' | 'trending' | 'seasonal' | 'manual';
  confidenceLevel: number;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Sequelize model for Revenue Streams with comprehensive classification.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} RevenueStream model
 *
 * @example
 * ```typescript
 * const RevenueStream = createRevenueStreamModel(sequelize);
 * const stream = await RevenueStream.create({
 *   streamId: 'REV-2024-001',
 *   streamName: 'Federal Grant - Infrastructure',
 *   streamCategory: 'grant',
 *   revenueType: 'non_exchange',
 *   recognitionMethod: 'over_time',
 *   fundCode: 'FUND-001',
 *   budgetedAmount: 10000000
 * });
 * ```
 */
export const createRevenueStreamModel = (sequelize: Sequelize) => {
  class RevenueStream extends Model {
    public id!: string;
    public streamId!: string;
    public streamName!: string;
    public streamCategory!: string;
    public revenueType!: string;
    public recognitionMethod!: string;
    public fundCode!: string;
    public accountCode!: string;
    public isRecurring!: boolean;
    public fiscalYear!: number;
    public budgetedAmount!: number;
    public actualAmount!: number;
    public isRestricted!: boolean;
    public restrictionType!: string | null;
    public isActive!: boolean;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  RevenueStream.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      streamId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Stream identifier',
      },
      streamName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Stream name',
      },
      streamCategory: {
        type: DataTypes.ENUM('tax', 'grant', 'fee', 'fine', 'interest', 'sale', 'reimbursement', 'other'),
        allowNull: false,
        comment: 'Revenue category',
      },
      revenueType: {
        type: DataTypes.ENUM('exchange', 'non_exchange'),
        allowNull: false,
        comment: 'Exchange vs non-exchange',
      },
      recognitionMethod: {
        type: DataTypes.ENUM('point_in_time', 'over_time', 'milestone', 'percentage_completion'),
        allowNull: false,
        comment: 'Recognition method',
      },
      fundCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Fund code',
      },
      accountCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'GL account code',
      },
      isRecurring: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Is recurring revenue',
      },
      fiscalYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Fiscal year',
      },
      budgetedAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Budgeted amount',
      },
      actualAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Actual amount recognized',
      },
      isRestricted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Has restrictions',
      },
      restrictionType: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Restriction type',
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Is active',
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
      tableName: 'revenue_streams',
      timestamps: true,
      indexes: [
        { fields: ['streamId'], unique: true },
        { fields: ['streamCategory'] },
        { fields: ['fundCode'] },
        { fields: ['fiscalYear'] },
        { fields: ['isActive'] },
      ],
    },
  );

  return RevenueStream;
};

/**
 * Sequelize model for Revenue Transactions.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} RevenueTransaction model
 */
export const createRevenueTransactionModel = (sequelize: Sequelize) => {
  class RevenueTransaction extends Model {
    public id!: string;
    public transactionId!: string;
    public streamId!: string;
    public transactionDate!: Date;
    public amount!: number;
    public description!: string;
    public billedAmount!: number;
    public collectedAmount!: number;
    public customerId!: string | null;
    public invoiceNumber!: string | null;
    public paymentMethod!: string | null;
    public status!: string;
    public recognizedDate!: Date | null;
    public fiscalYear!: number;
    public fiscalPeriod!: number;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  RevenueTransaction.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      transactionId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Transaction identifier',
      },
      streamId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Revenue stream',
      },
      transactionDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Transaction date',
      },
      amount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Transaction amount',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Description',
      },
      billedAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Billed amount',
      },
      collectedAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Collected amount',
      },
      customerId: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Customer ID',
      },
      invoiceNumber: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Invoice number',
      },
      paymentMethod: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Payment method',
      },
      status: {
        type: DataTypes.ENUM('billed', 'collected', 'deferred', 'recognized', 'voided'),
        allowNull: false,
        comment: 'Transaction status',
      },
      recognizedDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Recognition date',
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
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
    },
    {
      sequelize,
      tableName: 'revenue_transactions',
      timestamps: true,
      indexes: [
        { fields: ['transactionId'], unique: true },
        { fields: ['streamId'] },
        { fields: ['transactionDate'] },
        { fields: ['status'] },
        { fields: ['fiscalYear', 'fiscalPeriod'] },
      ],
    },
  );

  return RevenueTransaction;
};

/**
 * Sequelize model for Deferred Revenue with recognition schedules.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} DeferredRevenue model
 */
export const createDeferredRevenueModel = (sequelize: Sequelize) => {
  class DeferredRevenue extends Model {
    public id!: string;
    public deferralId!: string;
    public transactionId!: string;
    public streamId!: string;
    public deferredAmount!: number;
    public deferralDate!: Date;
    public recognitionStartDate!: Date;
    public recognitionEndDate!: Date;
    public recognitionPeriods!: number;
    public amountRecognized!: number;
    public amountRemaining!: number;
    public recognitionSchedule!: string;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  DeferredRevenue.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      deferralId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Deferral identifier',
      },
      transactionId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Related transaction',
      },
      streamId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Revenue stream',
      },
      deferredAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Deferred amount',
      },
      deferralDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Deferral date',
      },
      recognitionStartDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Recognition start',
      },
      recognitionEndDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Recognition end',
      },
      recognitionPeriods: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Number of periods',
      },
      amountRecognized: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Amount recognized',
      },
      amountRemaining: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Amount remaining',
      },
      recognitionSchedule: {
        type: DataTypes.ENUM('straight_line', 'proportional', 'milestone'),
        allowNull: false,
        comment: 'Recognition schedule type',
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
      tableName: 'deferred_revenue',
      timestamps: true,
      indexes: [
        { fields: ['deferralId'], unique: true },
        { fields: ['transactionId'] },
        { fields: ['streamId'] },
        { fields: ['recognitionStartDate'] },
        { fields: ['recognitionEndDate'] },
      ],
    },
  );

  return DeferredRevenue;
};

/**
 * Sequelize model for Performance Obligations (ASC 606).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} PerformanceObligation model
 */
export const createPerformanceObligationModel = (sequelize: Sequelize) => {
  class PerformanceObligation extends Model {
    public id!: string;
    public obligationId!: string;
    public contractId!: string;
    public streamId!: string;
    public description!: string;
    public totalAmount!: number;
    public satisfactionMethod!: string;
    public percentComplete!: number;
    public amountRecognized!: number;
    public amountRemaining!: number;
    public startDate!: Date;
    public estimatedCompletionDate!: Date;
    public actualCompletionDate!: Date | null;
    public status!: string;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  PerformanceObligation.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      obligationId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Obligation identifier',
      },
      contractId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Contract identifier',
      },
      streamId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Revenue stream',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Obligation description',
      },
      totalAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Total obligation amount',
      },
      satisfactionMethod: {
        type: DataTypes.ENUM('point_in_time', 'over_time'),
        allowNull: false,
        comment: 'Satisfaction method',
      },
      percentComplete: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Percent complete',
        validate: {
          min: 0,
          max: 100,
        },
      },
      amountRecognized: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Amount recognized',
      },
      amountRemaining: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Amount remaining',
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Start date',
      },
      estimatedCompletionDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Estimated completion',
      },
      actualCompletionDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Actual completion',
      },
      status: {
        type: DataTypes.ENUM('not_started', 'in_progress', 'completed'),
        allowNull: false,
        defaultValue: 'not_started',
        comment: 'Obligation status',
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
      tableName: 'performance_obligations',
      timestamps: true,
      indexes: [
        { fields: ['obligationId'], unique: true },
        { fields: ['contractId'] },
        { fields: ['streamId'] },
        { fields: ['status'] },
      ],
    },
  );

  return PerformanceObligation;
};

/**
 * Sequelize model for Grant Revenue with restriction tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} GrantRevenue model
 */
export const createGrantRevenueModel = (sequelize: Sequelize) => {
  class GrantRevenue extends Model {
    public id!: string;
    public grantId!: string;
    public grantName!: string;
    public grantorAgency!: string;
    public grantNumber!: string;
    public awardAmount!: number;
    public revenueRecognized!: number;
    public revenueDeferred!: number;
    public eligibilityRequirements!: string[];
    public hasTimeRestriction!: boolean;
    public hasPurposeRestriction!: boolean;
    public recognitionBasis!: string;
    public fiscalYear!: number;
    public startDate!: Date;
    public endDate!: Date;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  GrantRevenue.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      grantId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Grant identifier',
      },
      grantName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Grant name',
      },
      grantorAgency: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Grantor agency',
      },
      grantNumber: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Grant number',
      },
      awardAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Award amount',
      },
      revenueRecognized: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Revenue recognized',
      },
      revenueDeferred: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Revenue deferred',
      },
      eligibilityRequirements: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Eligibility requirements',
      },
      hasTimeRestriction: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Has time restriction',
      },
      hasPurposeRestriction: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Has purpose restriction',
      },
      recognitionBasis: {
        type: DataTypes.ENUM('expenditure_driven', 'entitlement', 'reimbursement'),
        allowNull: false,
        comment: 'Recognition basis',
      },
      fiscalYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Fiscal year',
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Grant start date',
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Grant end date',
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
      tableName: 'grant_revenue',
      timestamps: true,
      indexes: [
        { fields: ['grantId'], unique: true },
        { fields: ['grantNumber'] },
        { fields: ['grantorAgency'] },
        { fields: ['fiscalYear'] },
      ],
    },
  );

  return GrantRevenue;
};

/**
 * Sequelize model for Revenue Accruals.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} RevenueAccrual model
 */
export const createRevenueAccrualModel = (sequelize: Sequelize) => {
  class RevenueAccrual extends Model {
    public id!: string;
    public accrualId!: string;
    public streamId!: string;
    public accrualDate!: Date;
    public accrualAmount!: number;
    public accrualType!: string;
    public fiscalYear!: number;
    public fiscalPeriod!: number;
    public isReversed!: boolean;
    public reversalDate!: Date | null;
    public journalEntryNumber!: string | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  RevenueAccrual.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      accrualId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Accrual identifier',
      },
      streamId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Revenue stream',
      },
      accrualDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Accrual date',
      },
      accrualAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Accrual amount',
      },
      accrualType: {
        type: DataTypes.ENUM('receivable', 'unearned', 'unbilled'),
        allowNull: false,
        comment: 'Accrual type',
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
      isReversed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Is reversed',
      },
      reversalDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Reversal date',
      },
      journalEntryNumber: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Journal entry number',
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
      tableName: 'revenue_accruals',
      timestamps: true,
      indexes: [
        { fields: ['accrualId'], unique: true },
        { fields: ['streamId'] },
        { fields: ['fiscalYear', 'fiscalPeriod'] },
        { fields: ['isReversed'] },
      ],
    },
  );

  return RevenueAccrual;
};

/**
 * Sequelize model for Revenue Allocation across funds.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} RevenueAllocation model
 */
export const createRevenueAllocationModel = (sequelize: Sequelize) => {
  class RevenueAllocation extends Model {
    public id!: string;
    public allocationId!: string;
    public transactionId!: string;
    public fundCode!: string;
    public amount!: number;
    public percentage!: number;
    public allocationReason!: string;
    public isAutomated!: boolean;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  RevenueAllocation.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      allocationId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Allocation identifier',
      },
      transactionId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Transaction identifier',
      },
      fundCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Fund code',
      },
      amount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Allocation amount',
      },
      percentage: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        comment: 'Allocation percentage',
      },
      allocationReason: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Allocation reason',
      },
      isAutomated: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Is automated allocation',
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
      tableName: 'revenue_allocations',
      timestamps: true,
      indexes: [
        { fields: ['allocationId'], unique: true },
        { fields: ['transactionId'] },
        { fields: ['fundCode'] },
      ],
    },
  );

  return RevenueAllocation;
};

/**
 * Sequelize model for Revenue Forecasts.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} RevenueForecast model
 */
export const createRevenueForecastModel = (sequelize: Sequelize) => {
  class RevenueForecast extends Model {
    public id!: string;
    public forecastId!: string;
    public streamId!: string;
    public fiscalYear!: number;
    public fiscalPeriod!: number;
    public forecastAmount!: number;
    public actualAmount!: number;
    public variance!: number;
    public forecastMethod!: string;
    public confidenceLevel!: number;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  RevenueForecast.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      forecastId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Forecast identifier',
      },
      streamId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Revenue stream',
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
      forecastAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Forecast amount',
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
        comment: 'Variance',
      },
      forecastMethod: {
        type: DataTypes.ENUM('historical', 'trending', 'seasonal', 'manual'),
        allowNull: false,
        comment: 'Forecast method',
      },
      confidenceLevel: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 80,
        comment: 'Confidence level percentage',
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
      tableName: 'revenue_forecasts',
      timestamps: true,
      indexes: [
        { fields: ['forecastId'], unique: true },
        { fields: ['streamId'] },
        { fields: ['fiscalYear', 'fiscalPeriod'] },
      ],
    },
  );

  return RevenueForecast;
};

// ============================================================================
// REVENUE STREAM MANAGEMENT (1-7)
// ============================================================================

/**
 * Creates new revenue stream.
 *
 * @param {RevenueStreamData} streamData - Stream data
 * @param {Model} RevenueStream - RevenueStream model
 * @param {string} userId - User creating stream
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created stream
 *
 * @example
 * ```typescript
 * const stream = await createRevenueStream({
 *   streamId: 'REV-2024-001',
 *   streamName: 'Federal Grant Revenue',
 *   streamCategory: 'grant',
 *   revenueType: 'non_exchange',
 *   recognitionMethod: 'over_time'
 * }, RevenueStream, 'user123');
 * ```
 */
export const createRevenueStream = async (
  streamData: RevenueStreamData,
  RevenueStream: any,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const stream = await RevenueStream.create(streamData, { transaction });

  console.log(`Revenue stream created: ${stream.streamId} by ${userId}`);
  return stream;
};

/**
 * Validates revenue recognition criteria.
 *
 * @param {string} revenueType - Revenue type (exchange/non-exchange)
 * @param {boolean} measurable - Is measurable
 * @param {boolean} available - Is available
 * @param {boolean} earned - Is earned
 * @returns {{ shouldRecognize: boolean; reasons: string[] }}
 */
export const validateRecognitionCriteria = (
  revenueType: string,
  measurable: boolean,
  available: boolean,
  earned: boolean,
): { shouldRecognize: boolean; reasons: string[] } => {
  const reasons: string[] = [];

  if (revenueType === 'exchange') {
    if (!measurable) reasons.push('Revenue not measurable');
    if (!available) reasons.push('Revenue not available');
    if (!earned) reasons.push('Revenue not earned');
  } else {
    if (!measurable) reasons.push('Revenue not measurable');
    if (!available) reasons.push('Revenue not available within 60 days');
  }

  return {
    shouldRecognize: reasons.length === 0,
    reasons,
  };
};

/**
 * Retrieves revenue streams by category.
 *
 * @param {string} category - Stream category
 * @param {number} fiscalYear - Fiscal year
 * @param {Model} RevenueStream - RevenueStream model
 * @returns {Promise<any[]>} Revenue streams
 */
export const getStreamsByCategory = async (
  category: string,
  fiscalYear: number,
  RevenueStream: any,
): Promise<any[]> => {
  return await RevenueStream.findAll({
    where: {
      streamCategory: category,
      fiscalYear,
      isActive: true,
    },
    order: [['streamName', 'ASC']],
  });
};

/**
 * Updates revenue stream actuals.
 *
 * @param {string} streamId - Stream ID
 * @param {number} additionalAmount - Amount to add
 * @param {Model} RevenueStream - RevenueStream model
 * @returns {Promise<any>} Updated stream
 */
export const updateStreamActuals = async (
  streamId: string,
  additionalAmount: number,
  RevenueStream: any,
): Promise<any> => {
  const stream = await RevenueStream.findOne({ where: { streamId } });
  if (!stream) throw new Error('Revenue stream not found');

  stream.actualAmount = parseFloat(stream.actualAmount) + additionalAmount;
  await stream.save();

  return stream;
};

/**
 * Calculates revenue variance.
 *
 * @param {string} streamId - Stream ID
 * @param {Model} RevenueStream - RevenueStream model
 * @returns {Promise<{ variance: number; variancePercent: number; favorable: boolean }>}
 */
export const calculateRevenueVariance = async (
  streamId: string,
  RevenueStream: any,
): Promise<{ variance: number; variancePercent: number; favorable: boolean }> => {
  const stream = await RevenueStream.findOne({ where: { streamId } });
  if (!stream) throw new Error('Revenue stream not found');

  const variance = parseFloat(stream.actualAmount) - parseFloat(stream.budgetedAmount);
  const variancePercent = stream.budgetedAmount > 0
    ? (variance / parseFloat(stream.budgetedAmount)) * 100
    : 0;

  return {
    variance,
    variancePercent,
    favorable: variance > 0,
  };
};

/**
 * Generates revenue stream summary.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {Model} RevenueStream - RevenueStream model
 * @returns {Promise<any>} Stream summary
 */
export const generateStreamSummary = async (
  fiscalYear: number,
  RevenueStream: any,
): Promise<any> => {
  const streams = await RevenueStream.findAll({
    where: { fiscalYear, isActive: true },
  });

  const totalBudgeted = streams.reduce(
    (sum: number, s: any) => sum + parseFloat(s.budgetedAmount),
    0,
  );

  const totalActual = streams.reduce(
    (sum: number, s: any) => sum + parseFloat(s.actualAmount),
    0,
  );

  const byCategory = streams.reduce((acc: any, s: any) => {
    if (!acc[s.streamCategory]) {
      acc[s.streamCategory] = { budgeted: 0, actual: 0 };
    }
    acc[s.streamCategory].budgeted += parseFloat(s.budgetedAmount);
    acc[s.streamCategory].actual += parseFloat(s.actualAmount);
    return acc;
  }, {});

  return {
    fiscalYear,
    totalStreams: streams.length,
    totalBudgeted,
    totalActual,
    variance: totalActual - totalBudgeted,
    byCategory,
  };
};

/**
 * Identifies restricted revenue streams.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {Model} RevenueStream - RevenueStream model
 * @returns {Promise<any[]>} Restricted streams
 */
export const getRestrictedStreams = async (
  fiscalYear: number,
  RevenueStream: any,
): Promise<any[]> => {
  return await RevenueStream.findAll({
    where: {
      fiscalYear,
      isRestricted: true,
      isActive: true,
    },
    order: [['streamName', 'ASC']],
  });
};

// ============================================================================
// TRANSACTION PROCESSING (8-14)
// ============================================================================

/**
 * Records revenue transaction.
 *
 * @param {RevenueTransactionData} transactionData - Transaction data
 * @param {Model} RevenueTransaction - RevenueTransaction model
 * @param {Model} RevenueStream - RevenueStream model
 * @returns {Promise<any>} Created transaction
 */
export const recordRevenueTransaction = async (
  transactionData: RevenueTransactionData,
  RevenueTransaction: any,
  RevenueStream: any,
): Promise<any> => {
  const transaction = await RevenueTransaction.create({
    ...transactionData,
    fiscalYear: transactionData.transactionDate.getFullYear(),
    fiscalPeriod: transactionData.transactionDate.getMonth() + 1,
  });

  // Update stream actuals if recognized immediately
  if (transactionData.status === 'recognized') {
    await updateStreamActuals(transactionData.streamId, transactionData.amount, RevenueStream);
  }

  return transaction;
};

/**
 * Recognizes revenue transaction.
 *
 * @param {string} transactionId - Transaction ID
 * @param {Date} recognitionDate - Recognition date
 * @param {Model} RevenueTransaction - RevenueTransaction model
 * @param {Model} RevenueStream - RevenueStream model
 * @returns {Promise<any>} Recognized transaction
 */
export const recognizeRevenue = async (
  transactionId: string,
  recognitionDate: Date,
  RevenueTransaction: any,
  RevenueStream: any,
): Promise<any> => {
  const transaction = await RevenueTransaction.findOne({ where: { transactionId } });
  if (!transaction) throw new Error('Transaction not found');

  transaction.status = 'recognized';
  transaction.recognizedDate = recognitionDate;
  await transaction.save();

  await updateStreamActuals(transaction.streamId, parseFloat(transaction.amount), RevenueStream);

  return transaction;
};

/**
 * Retrieves unbilled revenue.
 *
 * @param {string} streamId - Stream ID
 * @param {Model} RevenueTransaction - RevenueTransaction model
 * @returns {Promise<any[]>} Unbilled transactions
 */
export const getUnbilledRevenue = async (
  streamId: string,
  RevenueTransaction: any,
): Promise<any[]> => {
  return await RevenueTransaction.findAll({
    where: {
      streamId,
      billedAmount: 0,
      status: { [Op.ne]: 'voided' },
    },
    order: [['transactionDate', 'ASC']],
  });
};

/**
 * Retrieves uncollected revenue.
 *
 * @param {Model} RevenueTransaction - RevenueTransaction model
 * @returns {Promise<any[]>} Uncollected transactions
 */
export const getUncollectedRevenue = async (
  RevenueTransaction: any,
): Promise<any[]> => {
  return await RevenueTransaction.findAll({
    where: {
      status: 'billed',
      collectedAmount: { [Op.lt]: Sequelize.col('billedAmount') },
    },
    order: [['transactionDate', 'ASC']],
  });
};

/**
 * Calculates collection rate.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {Model} RevenueTransaction - RevenueTransaction model
 * @returns {Promise<{ collectionRate: number; billed: number; collected: number }>}
 */
export const calculateCollectionRate = async (
  fiscalYear: number,
  RevenueTransaction: any,
): Promise<{ collectionRate: number; billed: number; collected: number }> => {
  const transactions = await RevenueTransaction.findAll({
    where: { fiscalYear },
  });

  const totalBilled = transactions.reduce(
    (sum: number, t: any) => sum + parseFloat(t.billedAmount),
    0,
  );

  const totalCollected = transactions.reduce(
    (sum: number, t: any) => sum + parseFloat(t.collectedAmount),
    0,
  );

  return {
    collectionRate: totalBilled > 0 ? (totalCollected / totalBilled) * 100 : 0,
    billed: totalBilled,
    collected: totalCollected,
  };
};

/**
 * Generates revenue by fund report.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {Model} RevenueStream - RevenueStream model
 * @returns {Promise<any>} Revenue by fund
 */
export const generateRevenueByFund = async (
  fiscalYear: number,
  RevenueStream: any,
): Promise<any> => {
  const streams = await RevenueStream.findAll({
    where: { fiscalYear },
  });

  const byFund = streams.reduce((acc: any, s: any) => {
    if (!acc[s.fundCode]) {
      acc[s.fundCode] = {
        budgeted: 0,
        actual: 0,
        count: 0,
      };
    }
    acc[s.fundCode].budgeted += parseFloat(s.budgetedAmount);
    acc[s.fundCode].actual += parseFloat(s.actualAmount);
    acc[s.fundCode].count++;
    return acc;
  }, {});

  return { fiscalYear, byFund };
};

/**
 * Exports revenue transactions to CSV.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {Model} RevenueTransaction - RevenueTransaction model
 * @returns {Promise<Buffer>} CSV buffer
 */
export const exportRevenueTransactionsCSV = async (
  fiscalYear: number,
  RevenueTransaction: any,
): Promise<Buffer> => {
  const transactions = await RevenueTransaction.findAll({
    where: { fiscalYear },
    order: [['transactionDate', 'ASC']],
  });

  const csv = 'Transaction ID,Stream ID,Date,Amount,Billed,Collected,Status\n' +
    transactions.map((t: any) =>
      `${t.transactionId},${t.streamId},${t.transactionDate.toISOString().split('T')[0]},${t.amount},${t.billedAmount},${t.collectedAmount},${t.status}`
    ).join('\n');

  return Buffer.from(csv, 'utf-8');
};

// ============================================================================
// DEFERRED REVENUE (15-21)
// ============================================================================

/**
 * Creates deferred revenue schedule.
 *
 * @param {DeferredRevenueData} deferralData - Deferral data
 * @param {Model} DeferredRevenue - DeferredRevenue model
 * @returns {Promise<any>} Created deferral
 */
export const createDeferredRevenue = async (
  deferralData: DeferredRevenueData,
  DeferredRevenue: any,
): Promise<any> => {
  return await DeferredRevenue.create({
    ...deferralData,
    amountRemaining: deferralData.deferredAmount,
  });
};

/**
 * Recognizes deferred revenue for period.
 *
 * @param {string} deferralId - Deferral ID
 * @param {number} recognitionAmount - Amount to recognize
 * @param {Model} DeferredRevenue - DeferredRevenue model
 * @param {Model} RevenueStream - RevenueStream model
 * @returns {Promise<any>} Updated deferral
 */
export const recognizeDeferredRevenue = async (
  deferralId: string,
  recognitionAmount: number,
  DeferredRevenue: any,
  RevenueStream: any,
): Promise<any> => {
  const deferral = await DeferredRevenue.findOne({ where: { deferralId } });
  if (!deferral) throw new Error('Deferral not found');

  deferral.amountRecognized = parseFloat(deferral.amountRecognized) + recognitionAmount;
  deferral.amountRemaining = parseFloat(deferral.deferredAmount) - parseFloat(deferral.amountRecognized);
  await deferral.save();

  await updateStreamActuals(deferral.streamId, recognitionAmount, RevenueStream);

  return deferral;
};

/**
 * Calculates deferred revenue recognition for period.
 *
 * @param {string} deferralId - Deferral ID
 * @param {Date} periodDate - Period date
 * @param {Model} DeferredRevenue - DeferredRevenue model
 * @returns {Promise<number>} Recognition amount
 */
export const calculateDeferredRecognition = async (
  deferralId: string,
  periodDate: Date,
  DeferredRevenue: any,
): Promise<number> => {
  const deferral = await DeferredRevenue.findOne({ where: { deferralId } });
  if (!deferral) throw new Error('Deferral not found');

  if (periodDate < deferral.recognitionStartDate || periodDate > deferral.recognitionEndDate) {
    return 0;
  }

  if (deferral.recognitionSchedule === 'straight_line') {
    return parseFloat(deferral.deferredAmount) / deferral.recognitionPeriods;
  }

  return 0;
};

/**
 * Retrieves active deferred revenue.
 *
 * @param {Date} asOfDate - As of date
 * @param {Model} DeferredRevenue - DeferredRevenue model
 * @returns {Promise<any[]>} Active deferrals
 */
export const getActiveDeferrals = async (
  asOfDate: Date,
  DeferredRevenue: any,
): Promise<any[]> => {
  return await DeferredRevenue.findAll({
    where: {
      recognitionStartDate: { [Op.lte]: asOfDate },
      recognitionEndDate: { [Op.gte]: asOfDate },
      amountRemaining: { [Op.gt]: 0 },
    },
    order: [['recognitionStartDate', 'ASC']],
  });
};

/**
 * Generates deferred revenue schedule report.
 *
 * @param {string} streamId - Stream ID
 * @param {Model} DeferredRevenue - DeferredRevenue model
 * @returns {Promise<any>} Schedule report
 */
export const generateDeferralScheduleReport = async (
  streamId: string,
  DeferredRevenue: any,
): Promise<any> => {
  const deferrals = await DeferredRevenue.findAll({
    where: { streamId },
    order: [['recognitionStartDate', 'ASC']],
  });

  const totalDeferred = deferrals.reduce(
    (sum: number, d: any) => sum + parseFloat(d.deferredAmount),
    0,
  );

  const totalRecognized = deferrals.reduce(
    (sum: number, d: any) => sum + parseFloat(d.amountRecognized),
    0,
  );

  const totalRemaining = deferrals.reduce(
    (sum: number, d: any) => sum + parseFloat(d.amountRemaining),
    0,
  );

  return {
    streamId,
    totalDeferred,
    totalRecognized,
    totalRemaining,
    deferrals,
  };
};

/**
 * Runs batch deferred revenue recognition.
 *
 * @param {Date} periodDate - Period date
 * @param {Model} DeferredRevenue - DeferredRevenue model
 * @param {Model} RevenueStream - RevenueStream model
 * @returns {Promise<any>} Batch results
 */
export const runBatchDeferredRecognition = async (
  periodDate: Date,
  DeferredRevenue: any,
  RevenueStream: any,
): Promise<any> => {
  const activeDeferrals = await getActiveDeferrals(periodDate, DeferredRevenue);

  const results = {
    processed: 0,
    totalRecognized: 0,
    errors: [] as any[],
  };

  for (const deferral of activeDeferrals) {
    try {
      const recognitionAmount = await calculateDeferredRecognition(
        deferral.deferralId,
        periodDate,
        DeferredRevenue,
      );

      if (recognitionAmount > 0) {
        await recognizeDeferredRevenue(
          deferral.deferralId,
          recognitionAmount,
          DeferredRevenue,
          RevenueStream,
        );
        results.processed++;
        results.totalRecognized += recognitionAmount;
      }
    } catch (error: any) {
      results.errors.push({
        deferralId: deferral.deferralId,
        error: error.message,
      });
    }
  }

  return results;
};

/**
 * Validates deferral completeness.
 *
 * @param {string} deferralId - Deferral ID
 * @param {Model} DeferredRevenue - DeferredRevenue model
 * @returns {Promise<{ complete: boolean; percentComplete: number }>}
 */
export const validateDeferralCompleteness = async (
  deferralId: string,
  DeferredRevenue: any,
): Promise<{ complete: boolean; percentComplete: number }> => {
  const deferral = await DeferredRevenue.findOne({ where: { deferralId } });
  if (!deferral) throw new Error('Deferral not found');

  const percentComplete = parseFloat(deferral.deferredAmount) > 0
    ? (parseFloat(deferral.amountRecognized) / parseFloat(deferral.deferredAmount)) * 100
    : 0;

  return {
    complete: parseFloat(deferral.amountRemaining) === 0,
    percentComplete,
  };
};

// ============================================================================
// PERFORMANCE OBLIGATIONS & GRANT REVENUE (22-30)
// ============================================================================

/**
 * Creates performance obligation.
 *
 * @param {PerformanceObligationData} obligationData - Obligation data
 * @param {Model} PerformanceObligation - PerformanceObligation model
 * @returns {Promise<any>} Created obligation
 */
export const createPerformanceObligation = async (
  obligationData: PerformanceObligationData,
  PerformanceObligation: any,
): Promise<any> => {
  return await PerformanceObligation.create({
    ...obligationData,
    amountRemaining: obligationData.totalAmount,
  });
};

/**
 * Updates performance obligation progress.
 *
 * @param {string} obligationId - Obligation ID
 * @param {number} percentComplete - Percent complete
 * @param {Model} PerformanceObligation - PerformanceObligation model
 * @param {Model} RevenueStream - RevenueStream model
 * @returns {Promise<any>} Updated obligation
 */
export const updateObligationProgress = async (
  obligationId: string,
  percentComplete: number,
  PerformanceObligation: any,
  RevenueStream: any,
): Promise<any> => {
  const obligation = await PerformanceObligation.findOne({ where: { obligationId } });
  if (!obligation) throw new Error('Obligation not found');

  const newRecognizedAmount = (parseFloat(obligation.totalAmount) * percentComplete) / 100;
  const additionalRecognition = newRecognizedAmount - parseFloat(obligation.amountRecognized);

  obligation.percentComplete = percentComplete;
  obligation.amountRecognized = newRecognizedAmount;
  obligation.amountRemaining = parseFloat(obligation.totalAmount) - newRecognizedAmount;

  if (percentComplete >= 100) {
    obligation.status = 'completed';
    obligation.actualCompletionDate = new Date();
  } else if (percentComplete > 0) {
    obligation.status = 'in_progress';
  }

  await obligation.save();

  if (additionalRecognition > 0) {
    await updateStreamActuals(obligation.streamId, additionalRecognition, RevenueStream);
  }

  return obligation;
};

/**
 * Records grant revenue.
 *
 * @param {GrantRevenueData} grantData - Grant data
 * @param {Model} GrantRevenue - GrantRevenue model
 * @returns {Promise<any>} Created grant
 */
export const recordGrantRevenue = async (
  grantData: GrantRevenueData,
  GrantRevenue: any,
): Promise<any> => {
  return await GrantRevenue.create(grantData);
};

/**
 * Validates grant eligibility requirements.
 *
 * @param {string} grantId - Grant ID
 * @param {Record<string, boolean>} requirementsMet - Requirements met
 * @param {Model} GrantRevenue - GrantRevenue model
 * @returns {Promise<{ eligible: boolean; unmetRequirements: string[] }>}
 */
export const validateGrantEligibility = async (
  grantId: string,
  requirementsMet: Record<string, boolean>,
  GrantRevenue: any,
): Promise<{ eligible: boolean; unmetRequirements: string[] }> => {
  const grant = await GrantRevenue.findOne({ where: { grantId } });
  if (!grant) throw new Error('Grant not found');

  const unmetRequirements = grant.eligibilityRequirements.filter(
    (req: string) => !requirementsMet[req],
  );

  return {
    eligible: unmetRequirements.length === 0,
    unmetRequirements,
  };
};

/**
 * Recognizes grant revenue based on expenditures.
 *
 * @param {string} grantId - Grant ID
 * @param {number} expenditureAmount - Expenditure amount
 * @param {Model} GrantRevenue - GrantRevenue model
 * @returns {Promise<any>} Updated grant
 */
export const recognizeGrantByExpenditure = async (
  grantId: string,
  expenditureAmount: number,
  GrantRevenue: any,
): Promise<any> => {
  const grant = await GrantRevenue.findOne({ where: { grantId } });
  if (!grant) throw new Error('Grant not found');

  if (grant.recognitionBasis !== 'expenditure_driven') {
    throw new Error('Grant not expenditure-driven');
  }

  const newRecognized = Math.min(
    parseFloat(grant.revenueRecognized) + expenditureAmount,
    parseFloat(grant.awardAmount),
  );

  grant.revenueRecognized = newRecognized;
  grant.revenueDeferred = parseFloat(grant.awardAmount) - newRecognized;
  await grant.save();

  return grant;
};

/**
 * Generates grant revenue report.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {Model} GrantRevenue - GrantRevenue model
 * @returns {Promise<any>} Grant report
 */
export const generateGrantRevenueReport = async (
  fiscalYear: number,
  GrantRevenue: any,
): Promise<any> => {
  const grants = await GrantRevenue.findAll({
    where: { fiscalYear },
  });

  const totalAwarded = grants.reduce(
    (sum: number, g: any) => sum + parseFloat(g.awardAmount),
    0,
  );

  const totalRecognized = grants.reduce(
    (sum: number, g: any) => sum + parseFloat(g.revenueRecognized),
    0,
  );

  const totalDeferred = grants.reduce(
    (sum: number, g: any) => sum + parseFloat(g.revenueDeferred),
    0,
  );

  return {
    fiscalYear,
    totalGrants: grants.length,
    totalAwarded,
    totalRecognized,
    totalDeferred,
    recognitionRate: totalAwarded > 0 ? (totalRecognized / totalAwarded) * 100 : 0,
    grants,
  };
};

/**
 * Identifies restricted grant funds.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {Model} GrantRevenue - GrantRevenue model
 * @returns {Promise<any[]>} Restricted grants
 */
export const getRestrictedGrants = async (
  fiscalYear: number,
  GrantRevenue: any,
): Promise<any[]> => {
  return await GrantRevenue.findAll({
    where: {
      fiscalYear,
      [Op.or]: [
        { hasTimeRestriction: true },
        { hasPurposeRestriction: true },
      ],
    },
    order: [['grantName', 'ASC']],
  });
};

/**
 * Tracks grant compliance status.
 *
 * @param {string} grantId - Grant ID
 * @param {boolean} compliant - Compliance status
 * @param {string} notes - Compliance notes
 * @param {Model} GrantRevenue - GrantRevenue model
 * @returns {Promise<any>} Updated grant
 */
export const trackGrantCompliance = async (
  grantId: string,
  compliant: boolean,
  notes: string,
  GrantRevenue: any,
): Promise<any> => {
  const grant = await GrantRevenue.findOne({ where: { grantId } });
  if (!grant) throw new Error('Grant not found');

  grant.metadata = {
    ...grant.metadata,
    compliance: {
      status: compliant ? 'compliant' : 'non_compliant',
      notes,
      assessedAt: new Date().toISOString(),
    },
  };
  await grant.save();

  return grant;
};

/**
 * Exports grant summary to Excel.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {Model} GrantRevenue - GrantRevenue model
 * @returns {Promise<Buffer>} Excel buffer
 */
export const exportGrantSummaryExcel = async (
  fiscalYear: number,
  GrantRevenue: any,
): Promise<Buffer> => {
  const grants = await GrantRevenue.findAll({
    where: { fiscalYear },
    order: [['grantName', 'ASC']],
  });

  const csv = 'Grant Name,Grantor,Grant Number,Award Amount,Recognized,Deferred,Recognition Basis\n' +
    grants.map((g: any) =>
      `${g.grantName},${g.grantorAgency},${g.grantNumber},${g.awardAmount},${g.revenueRecognized},${g.revenueDeferred},${g.recognitionBasis}`
    ).join('\n');

  return Buffer.from(csv, 'utf-8');
};

// ============================================================================
// ACCRUALS & ALLOCATIONS (31-38)
// ============================================================================

/**
 * Records revenue accrual.
 *
 * @param {RevenueAccrualData} accrualData - Accrual data
 * @param {Model} RevenueAccrual - RevenueAccrual model
 * @returns {Promise<any>} Created accrual
 */
export const recordRevenueAccrual = async (
  accrualData: RevenueAccrualData,
  RevenueAccrual: any,
): Promise<any> => {
  return await RevenueAccrual.create({
    ...accrualData,
    fiscalYear: accrualData.accrualDate.getFullYear(),
    fiscalPeriod: accrualData.accrualDate.getMonth() + 1,
  });
};

/**
 * Reverses revenue accrual.
 *
 * @param {string} accrualId - Accrual ID
 * @param {Date} reversalDate - Reversal date
 * @param {Model} RevenueAccrual - RevenueAccrual model
 * @returns {Promise<any>} Reversed accrual
 */
export const reverseRevenueAccrual = async (
  accrualId: string,
  reversalDate: Date,
  RevenueAccrual: any,
): Promise<any> => {
  const accrual = await RevenueAccrual.findOne({ where: { accrualId } });
  if (!accrual) throw new Error('Accrual not found');

  accrual.isReversed = true;
  accrual.reversalDate = reversalDate;
  await accrual.save();

  return accrual;
};

/**
 * Creates revenue allocation across funds.
 *
 * @param {RevenueAllocationData} allocationData - Allocation data
 * @param {Model} RevenueAllocation - RevenueAllocation model
 * @returns {Promise<any>} Created allocation
 */
export const createRevenueAllocation = async (
  allocationData: RevenueAllocationData,
  RevenueAllocation: any,
): Promise<any> => {
  return await RevenueAllocation.create(allocationData);
};

/**
 * Validates allocation percentages total 100%.
 *
 * @param {string} transactionId - Transaction ID
 * @param {Model} RevenueAllocation - RevenueAllocation model
 * @returns {Promise<{ valid: boolean; totalPercentage: number }>}
 */
export const validateAllocationTotal = async (
  transactionId: string,
  RevenueAllocation: any,
): Promise<{ valid: boolean; totalPercentage: number }> => {
  const allocations = await RevenueAllocation.findAll({
    where: { transactionId },
  });

  const totalPercentage = allocations.reduce(
    (sum: number, a: any) => sum + parseFloat(a.percentage),
    0,
  );

  return {
    valid: Math.abs(totalPercentage - 100) < 0.01,
    totalPercentage,
  };
};

/**
 * Creates revenue forecast.
 *
 * @param {RevenueForecastData} forecastData - Forecast data
 * @param {Model} RevenueForecast - RevenueForecast model
 * @returns {Promise<any>} Created forecast
 */
export const createRevenueForecast = async (
  forecastData: RevenueForecastData,
  RevenueForecast: any,
): Promise<any> => {
  return await RevenueForecast.create(forecastData);
};

/**
 * Updates forecast with actuals.
 *
 * @param {string} forecastId - Forecast ID
 * @param {number} actualAmount - Actual amount
 * @param {Model} RevenueForecast - RevenueForecast model
 * @returns {Promise<any>} Updated forecast
 */
export const updateForecastActuals = async (
  forecastId: string,
  actualAmount: number,
  RevenueForecast: any,
): Promise<any> => {
  const forecast = await RevenueForecast.findOne({ where: { forecastId } });
  if (!forecast) throw new Error('Forecast not found');

  forecast.actualAmount = actualAmount;
  forecast.variance = actualAmount - parseFloat(forecast.forecastAmount);
  await forecast.save();

  return forecast;
};

/**
 * Generates forecast accuracy report.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {Model} RevenueForecast - RevenueForecast model
 * @returns {Promise<any>} Accuracy report
 */
export const generateForecastAccuracyReport = async (
  fiscalYear: number,
  RevenueForecast: any,
): Promise<any> => {
  const forecasts = await RevenueForecast.findAll({
    where: {
      fiscalYear,
      actualAmount: { [Op.gt]: 0 },
    },
  });

  const totalForecasted = forecasts.reduce(
    (sum: number, f: any) => sum + parseFloat(f.forecastAmount),
    0,
  );

  const totalActual = forecasts.reduce(
    (sum: number, f: any) => sum + parseFloat(f.actualAmount),
    0,
  );

  const totalVariance = forecasts.reduce(
    (sum: number, f: any) => sum + Math.abs(parseFloat(f.variance)),
    0,
  );

  const accuracy = totalForecasted > 0
    ? 100 - ((totalVariance / totalForecasted) * 100)
    : 0;

  return {
    fiscalYear,
    totalForecasts: forecasts.length,
    totalForecasted,
    totalActual,
    totalVariance,
    accuracy,
  };
};

/**
 * Generates comprehensive revenue report.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {Model} RevenueStream - RevenueStream model
 * @param {Model} RevenueTransaction - RevenueTransaction model
 * @param {Model} GrantRevenue - GrantRevenue model
 * @returns {Promise<any>} Comprehensive report
 */
export const generateComprehensiveRevenueReport = async (
  fiscalYear: number,
  RevenueStream: any,
  RevenueTransaction: any,
  GrantRevenue: any,
): Promise<any> => {
  const streamSummary = await generateStreamSummary(fiscalYear, RevenueStream);
  const collectionRate = await calculateCollectionRate(fiscalYear, RevenueTransaction);
  const grantReport = await generateGrantRevenueReport(fiscalYear, GrantRevenue);

  return {
    fiscalYear,
    streamSummary,
    collectionRate,
    grantReport,
    generatedAt: new Date(),
  };
};

// ============================================================================
// NESTJS SERVICE WRAPPER
// ============================================================================

@Injectable()
export class CEFMSRevenueRecognitionService {
  constructor(private readonly sequelize: Sequelize) {}

  async createStream(streamData: RevenueStreamData, userId: string) {
    const RevenueStream = createRevenueStreamModel(this.sequelize);
    return createRevenueStream(streamData, RevenueStream, userId);
  }

  async recordTransaction(transactionData: RevenueTransactionData) {
    const RevenueTransaction = createRevenueTransactionModel(this.sequelize);
    const RevenueStream = createRevenueStreamModel(this.sequelize);
    return recordRevenueTransaction(transactionData, RevenueTransaction, RevenueStream);
  }

  async processDeferred(periodDate: Date) {
    const DeferredRevenue = createDeferredRevenueModel(this.sequelize);
    const RevenueStream = createRevenueStreamModel(this.sequelize);
    return runBatchDeferredRecognition(periodDate, DeferredRevenue, RevenueStream);
  }

  async reportGrants(fiscalYear: number) {
    const GrantRevenue = createGrantRevenueModel(this.sequelize);
    return generateGrantRevenueReport(fiscalYear, GrantRevenue);
  }
}

export default {
  // Models
  createRevenueStreamModel,
  createRevenueTransactionModel,
  createDeferredRevenueModel,
  createPerformanceObligationModel,
  createGrantRevenueModel,
  createRevenueAccrualModel,
  createRevenueAllocationModel,
  createRevenueForecastModel,

  // Stream Management
  createRevenueStream,
  validateRecognitionCriteria,
  getStreamsByCategory,
  updateStreamActuals,
  calculateRevenueVariance,
  generateStreamSummary,
  getRestrictedStreams,

  // Transaction Processing
  recordRevenueTransaction,
  recognizeRevenue,
  getUnbilledRevenue,
  getUncollectedRevenue,
  calculateCollectionRate,
  generateRevenueByFund,
  exportRevenueTransactionsCSV,

  // Deferred Revenue
  createDeferredRevenue,
  recognizeDeferredRevenue,
  calculateDeferredRecognition,
  getActiveDeferrals,
  generateDeferralScheduleReport,
  runBatchDeferredRecognition,
  validateDeferralCompleteness,

  // Performance Obligations & Grants
  createPerformanceObligation,
  updateObligationProgress,
  recordGrantRevenue,
  validateGrantEligibility,
  recognizeGrantByExpenditure,
  generateGrantRevenueReport,
  getRestrictedGrants,
  trackGrantCompliance,
  exportGrantSummaryExcel,

  // Accruals & Allocations
  recordRevenueAccrual,
  reverseRevenueAccrual,
  createRevenueAllocation,
  validateAllocationTotal,
  createRevenueForecast,
  updateForecastActuals,
  generateForecastAccuracyReport,
  generateComprehensiveRevenueReport,

  // Service
  CEFMSRevenueRecognitionService,
};
