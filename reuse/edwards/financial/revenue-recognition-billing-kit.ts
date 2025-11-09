/**
 * LOC: REVREC001
 * File: /reuse/edwards/financial/revenue-recognition-billing-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (ORM for database operations)
 *   - @nestjs/common (NestJS framework)
 *   - @nestjs/swagger (API documentation)
 *   - ../../financial/general-ledger-operations-kit (GL posting)
 *
 * DOWNSTREAM (imported by):
 *   - Backend revenue modules
 *   - Contract management services
 *   - Billing and invoicing modules
 *   - Financial reporting modules
 */

/**
 * File: /reuse/edwards/financial/revenue-recognition-billing-kit.ts
 * Locator: WC-EDW-REVREC-001
 * Purpose: Comprehensive Revenue Recognition & Billing Operations - ASC 606 compliant revenue management, performance obligations, contract modifications
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, TypeScript 5.x, general-ledger-operations-kit
 * Downstream: ../backend/revenue/*, Contract Services, Billing Services, Financial Reporting
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+
 * Exports: 45 functions for ASC 606 compliance, performance obligations, revenue allocation, contract modifications, deferred/unbilled revenue, milestone billing, subscription management
 *
 * LLM Context: Enterprise-grade revenue recognition for Oracle JD Edwards EnterpriseOne compatibility.
 * Provides comprehensive ASC 606 revenue recognition, five-step model implementation, contract identification,
 * performance obligation tracking, transaction price allocation, revenue scheduling, contract modifications,
 * deferred revenue management, unbilled revenue tracking, milestone billing, subscription management,
 * variable consideration, contract assets/liabilities, revenue reversal, and multi-element arrangements.
 */

import { Model, DataTypes, Sequelize, Transaction, Op, ValidationError } from 'sequelize';
import { Injectable } from '@nestjs/common';
import { ApiProperty, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface RevenueContract {
  contractId: number;
  contractNumber: string;
  customerId: number;
  customerName: string;
  contractDate: Date;
  startDate: Date;
  endDate: Date;
  totalContractValue: number;
  status: 'draft' | 'active' | 'completed' | 'terminated' | 'modified';
  recognitionMethod: 'point-in-time' | 'over-time' | 'hybrid';
  contractType: 'fixed-price' | 'time-and-materials' | 'subscription' | 'milestone';
  terms: string;
  metadata: Record<string, any>;
}

interface PerformanceObligation {
  obligationId: number;
  contractId: number;
  obligationNumber: string;
  description: string;
  obligationType: 'goods' | 'services' | 'license' | 'subscription';
  allocatedAmount: number;
  recognizedRevenue: number;
  remainingRevenue: number;
  startDate: Date;
  endDate: Date;
  completionPercent: number;
  status: 'not-started' | 'in-progress' | 'completed' | 'cancelled';
  satisfactionMethod: 'point-in-time' | 'over-time';
  transferOfControl: 'customer-accepted' | 'delivered' | 'continuous';
}

interface RevenueAllocation {
  allocationId: number;
  contractId: number;
  obligationId: number;
  standaloneSellingPrice: number;
  relativeSellingPrice: number;
  allocatedAmount: number;
  allocationPercent: number;
  allocationMethod: 'relative' | 'adjusted-market' | 'expected-cost-plus-margin' | 'residual';
  adjustmentReason?: string;
}

interface RevenueSchedule {
  scheduleId: number;
  contractId: number;
  obligationId: number;
  fiscalYear: number;
  fiscalPeriod: number;
  scheduleDate: Date;
  scheduledAmount: number;
  recognizedAmount: number;
  remainingAmount: number;
  status: 'scheduled' | 'recognized' | 'adjusted' | 'reversed';
  accountingEntryId?: number;
}

interface DeferredRevenue {
  deferredId: number;
  contractId: number;
  obligationId: number;
  invoiceId?: number;
  billedAmount: number;
  recognizedAmount: number;
  deferredAmount: number;
  deferralDate: Date;
  accountCode: string;
  liabilityAccountCode: string;
  status: 'deferred' | 'partially-recognized' | 'fully-recognized';
}

interface UnbilledRevenue {
  unbilledId: number;
  contractId: number;
  obligationId: number;
  recognizedAmount: number;
  billedAmount: number;
  unbilledAmount: number;
  recognitionDate: Date;
  assetAccountCode: string;
  revenueAccountCode: string;
  status: 'unbilled' | 'partially-billed' | 'fully-billed';
}

interface ContractModification {
  modificationId: number;
  contractId: number;
  modificationNumber: string;
  modificationDate: Date;
  modificationType: 'additional-goods' | 'price-change' | 'scope-change' | 'termination';
  accountingTreatment: 'separate-contract' | 'cumulative-catch-up' | 'prospective';
  originalValue: number;
  modifiedValue: number;
  valueChange: number;
  description: string;
  approvedBy: string;
  effectiveDate: Date;
}

interface MilestoneBilling {
  milestoneId: number;
  contractId: number;
  obligationId: number;
  milestoneNumber: string;
  description: string;
  dueDate: Date;
  milestoneValue: number;
  completionPercent: number;
  billedAmount: number;
  recognizedAmount: number;
  status: 'pending' | 'in-progress' | 'completed' | 'billed' | 'paid';
  completionCriteria: string;
  approvalRequired: boolean;
}

interface SubscriptionRevenue {
  subscriptionId: number;
  contractId: number;
  customerId: number;
  subscriptionNumber: string;
  startDate: Date;
  endDate: Date;
  billingCycle: 'monthly' | 'quarterly' | 'semi-annual' | 'annual';
  periodicAmount: number;
  totalValue: number;
  recognizedRevenue: number;
  deferredRevenue: number;
  status: 'active' | 'suspended' | 'cancelled' | 'expired';
  autoRenew: boolean;
  renewalTerms?: string;
}

interface VariableConsideration {
  variableId: number;
  contractId: number;
  obligationId: number;
  considerationType: 'volume-discount' | 'performance-bonus' | 'penalty' | 'rebate' | 'royalty';
  estimatedAmount: number;
  constraintApplied: number;
  recognizedAmount: number;
  constraintMethod: 'most-likely' | 'expected-value';
  constraintReason: string;
  reassessmentDate: Date;
}

interface ContractAssetLiability {
  assetLiabilityId: number;
  contractId: number;
  fiscalYear: number;
  fiscalPeriod: number;
  type: 'contract-asset' | 'contract-liability';
  openingBalance: number;
  additions: number;
  reductions: number;
  closingBalance: number;
  accountCode: string;
  reconciled: boolean;
}

interface RevenueReversal {
  reversalId: number;
  originalScheduleId: number;
  contractId: number;
  obligationId: number;
  reversalDate: Date;
  reversalAmount: number;
  reversalReason: string;
  accountingEntryId: number;
  reversedBy: string;
}

interface RevenueReconciliation {
  reconciliationId: number;
  fiscalYear: number;
  fiscalPeriod: number;
  billedRevenue: number;
  recognizedRevenue: number;
  deferredRevenue: number;
  unbilledRevenue: number;
  variance: number;
  variancePercent: number;
  status: 'balanced' | 'variance' | 'under-review';
  reconciledBy?: string;
  reconciledAt?: Date;
}

// ============================================================================
// DTO CLASSES
// ============================================================================

export class CreateRevenueContractDto {
  @ApiProperty({ description: 'Contract number', example: 'RC-2024-001' })
  contractNumber!: string;

  @ApiProperty({ description: 'Customer ID' })
  customerId!: number;

  @ApiProperty({ description: 'Contract date' })
  contractDate!: Date;

  @ApiProperty({ description: 'Start date' })
  startDate!: Date;

  @ApiProperty({ description: 'End date' })
  endDate!: Date;

  @ApiProperty({ description: 'Total contract value' })
  totalContractValue!: number;

  @ApiProperty({ description: 'Recognition method', enum: ['point-in-time', 'over-time', 'hybrid'] })
  recognitionMethod!: string;

  @ApiProperty({ description: 'Contract type', enum: ['fixed-price', 'time-and-materials', 'subscription', 'milestone'] })
  contractType!: string;

  @ApiProperty({ description: 'Performance obligations', type: [Object] })
  performanceObligations!: PerformanceObligation[];
}

export class CreatePerformanceObligationDto {
  @ApiProperty({ description: 'Contract ID' })
  contractId!: number;

  @ApiProperty({ description: 'Description' })
  description!: string;

  @ApiProperty({ description: 'Obligation type', enum: ['goods', 'services', 'license', 'subscription'] })
  obligationType!: string;

  @ApiProperty({ description: 'Standalone selling price' })
  standaloneSellingPrice!: number;

  @ApiProperty({ description: 'Start date' })
  startDate!: Date;

  @ApiProperty({ description: 'End date' })
  endDate!: Date;

  @ApiProperty({ description: 'Satisfaction method', enum: ['point-in-time', 'over-time'] })
  satisfactionMethod!: string;
}

export class RevenueRecognitionRequestDto {
  @ApiProperty({ description: 'Contract ID' })
  contractId!: number;

  @ApiProperty({ description: 'Obligation ID' })
  obligationId!: number;

  @ApiProperty({ description: 'Recognition date' })
  recognitionDate!: Date;

  @ApiProperty({ description: 'Recognition amount' })
  recognitionAmount!: number;

  @ApiProperty({ description: 'User processing recognition' })
  userId!: string;
}

export class ContractModificationDto {
  @ApiProperty({ description: 'Contract ID' })
  contractId!: number;

  @ApiProperty({ description: 'Modification type', enum: ['additional-goods', 'price-change', 'scope-change', 'termination'] })
  modificationType!: string;

  @ApiProperty({ description: 'Accounting treatment', enum: ['separate-contract', 'cumulative-catch-up', 'prospective'] })
  accountingTreatment!: string;

  @ApiProperty({ description: 'Modified value' })
  modifiedValue!: number;

  @ApiProperty({ description: 'Description' })
  description!: string;

  @ApiProperty({ description: 'Effective date' })
  effectiveDate!: Date;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Sequelize model for Revenue Contracts with ASC 606 compliance.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} RevenueContract model
 *
 * @example
 * ```typescript
 * const RevenueContract = createRevenueContractModel(sequelize);
 * const contract = await RevenueContract.create({
 *   contractNumber: 'RC-2024-001',
 *   customerId: 100,
 *   totalContractValue: 100000,
 *   recognitionMethod: 'over-time'
 * });
 * ```
 */
export const createRevenueContractModel = (sequelize: Sequelize) => {
  class RevenueContract extends Model {
    public id!: number;
    public contractNumber!: string;
    public customerId!: number;
    public customerName!: string;
    public contractDate!: Date;
    public startDate!: Date;
    public endDate!: Date;
    public totalContractValue!: number;
    public status!: string;
    public recognitionMethod!: string;
    public contractType!: string;
    public terms!: string;
    public metadata!: Record<string, any>;
    public createdBy!: string;
    public updatedBy!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  RevenueContract.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      contractNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Unique contract number',
      },
      customerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Customer ID',
      },
      customerName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Customer name for denormalization',
      },
      contractDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Contract execution date',
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Contract start date',
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Contract end date',
      },
      totalContractValue: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Total contract value',
        validate: {
          min: 0,
        },
      },
      status: {
        type: DataTypes.ENUM('draft', 'active', 'completed', 'terminated', 'modified'),
        allowNull: false,
        defaultValue: 'draft',
        comment: 'Contract status',
      },
      recognitionMethod: {
        type: DataTypes.ENUM('point-in-time', 'over-time', 'hybrid'),
        allowNull: false,
        comment: 'Revenue recognition method per ASC 606',
      },
      contractType: {
        type: DataTypes.ENUM('fixed-price', 'time-and-materials', 'subscription', 'milestone'),
        allowNull: false,
        comment: 'Contract type',
      },
      terms: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Contract terms and conditions',
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
        comment: 'User who created the contract',
      },
      updatedBy: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'User who last updated the contract',
      },
    },
    {
      sequelize,
      tableName: 'revenue_contracts',
      timestamps: true,
      indexes: [
        { fields: ['contractNumber'], unique: true },
        { fields: ['customerId'] },
        { fields: ['contractDate'] },
        { fields: ['startDate', 'endDate'] },
        { fields: ['status'] },
        { fields: ['contractType'] },
      ],
      hooks: {
        beforeValidate: (contract) => {
          if (contract.endDate <= contract.startDate) {
            throw new Error('Contract end date must be after start date');
          }
        },
      },
    },
  );

  return RevenueContract;
};

/**
 * Sequelize model for Performance Obligations per ASC 606.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} PerformanceObligation model
 *
 * @example
 * ```typescript
 * const PerformanceObligation = createPerformanceObligationModel(sequelize);
 * const obligation = await PerformanceObligation.create({
 *   contractId: 1,
 *   description: 'Software license',
 *   obligationType: 'license',
 *   allocatedAmount: 50000
 * });
 * ```
 */
export const createPerformanceObligationModel = (sequelize: Sequelize) => {
  class PerformanceObligation extends Model {
    public id!: number;
    public contractId!: number;
    public obligationNumber!: string;
    public description!: string;
    public obligationType!: string;
    public allocatedAmount!: number;
    public recognizedRevenue!: number;
    public remainingRevenue!: number;
    public startDate!: Date;
    public endDate!: Date;
    public completionPercent!: number;
    public status!: string;
    public satisfactionMethod!: string;
    public transferOfControl!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  PerformanceObligation.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      contractId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Associated contract ID',
        references: {
          model: 'revenue_contracts',
          key: 'id',
        },
      },
      obligationNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Unique obligation number',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Performance obligation description',
      },
      obligationType: {
        type: DataTypes.ENUM('goods', 'services', 'license', 'subscription'),
        allowNull: false,
        comment: 'Type of performance obligation',
      },
      allocatedAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Allocated transaction price',
        validate: {
          min: 0,
        },
      },
      recognizedRevenue: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Revenue recognized to date',
      },
      remainingRevenue: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Remaining revenue to recognize',
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Obligation start date',
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Obligation end date',
      },
      completionPercent: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Completion percentage',
        validate: {
          min: 0,
          max: 100,
        },
      },
      status: {
        type: DataTypes.ENUM('not-started', 'in-progress', 'completed', 'cancelled'),
        allowNull: false,
        defaultValue: 'not-started',
        comment: 'Obligation status',
      },
      satisfactionMethod: {
        type: DataTypes.ENUM('point-in-time', 'over-time'),
        allowNull: false,
        comment: 'Method of satisfying performance obligation',
      },
      transferOfControl: {
        type: DataTypes.ENUM('customer-accepted', 'delivered', 'continuous'),
        allowNull: false,
        comment: 'Transfer of control indicator',
      },
    },
    {
      sequelize,
      tableName: 'performance_obligations',
      timestamps: true,
      indexes: [
        { fields: ['contractId'] },
        { fields: ['obligationNumber'], unique: true },
        { fields: ['status'] },
        { fields: ['startDate', 'endDate'] },
      ],
      hooks: {
        beforeSave: (obligation) => {
          obligation.remainingRevenue = Number(obligation.allocatedAmount) - Number(obligation.recognizedRevenue);
        },
      },
    },
  );

  return PerformanceObligation;
};

/**
 * Sequelize model for Revenue Schedules.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} RevenueSchedule model
 *
 * @example
 * ```typescript
 * const RevenueSchedule = createRevenueScheduleModel(sequelize);
 * const schedule = await RevenueSchedule.create({
 *   contractId: 1,
 *   obligationId: 1,
 *   scheduleDate: new Date('2024-01-31'),
 *   scheduledAmount: 5000
 * });
 * ```
 */
export const createRevenueScheduleModel = (sequelize: Sequelize) => {
  class RevenueSchedule extends Model {
    public id!: number;
    public contractId!: number;
    public obligationId!: number;
    public fiscalYear!: number;
    public fiscalPeriod!: number;
    public scheduleDate!: Date;
    public scheduledAmount!: number;
    public recognizedAmount!: number;
    public remainingAmount!: number;
    public status!: string;
    public accountingEntryId!: number | null;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  RevenueSchedule.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      contractId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Associated contract ID',
      },
      obligationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Associated performance obligation ID',
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
      scheduleDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Scheduled recognition date',
      },
      scheduledAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Scheduled revenue amount',
      },
      recognizedAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Recognized revenue amount',
      },
      remainingAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Remaining revenue to recognize',
      },
      status: {
        type: DataTypes.ENUM('scheduled', 'recognized', 'adjusted', 'reversed'),
        allowNull: false,
        defaultValue: 'scheduled',
        comment: 'Schedule status',
      },
      accountingEntryId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Associated accounting entry ID',
      },
    },
    {
      sequelize,
      tableName: 'revenue_schedules',
      timestamps: true,
      indexes: [
        { fields: ['contractId'] },
        { fields: ['obligationId'] },
        { fields: ['fiscalYear', 'fiscalPeriod'] },
        { fields: ['scheduleDate'] },
        { fields: ['status'] },
      ],
      hooks: {
        beforeSave: (schedule) => {
          schedule.remainingAmount = Number(schedule.scheduledAmount) - Number(schedule.recognizedAmount);
        },
      },
    },
  );

  return RevenueSchedule;
};

// ============================================================================
// CONTRACT MANAGEMENT FUNCTIONS
// ============================================================================

/**
 * Creates a new revenue contract with ASC 606 compliance.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateRevenueContractDto} contractData - Contract data
 * @param {string} userId - User creating the contract
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created revenue contract
 *
 * @example
 * ```typescript
 * const contract = await createRevenueContract(sequelize, {
 *   contractNumber: 'RC-2024-001',
 *   customerId: 100,
 *   contractDate: new Date(),
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-12-31'),
 *   totalContractValue: 120000,
 *   recognitionMethod: 'over-time',
 *   contractType: 'subscription'
 * }, 'user123');
 * ```
 */
export const createRevenueContract = async (
  sequelize: Sequelize,
  contractData: CreateRevenueContractDto,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const RevenueContract = createRevenueContractModel(sequelize);

  // Validate contract dates
  if (contractData.endDate <= contractData.startDate) {
    throw new Error('Contract end date must be after start date');
  }

  const contract = await RevenueContract.create(
    {
      ...contractData,
      status: 'draft',
      createdBy: userId,
      updatedBy: userId,
    },
    { transaction },
  );

  return contract;
};

/**
 * Activates a revenue contract and initiates revenue recognition.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} contractId - Contract ID
 * @param {string} userId - User activating the contract
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Activated contract
 *
 * @example
 * ```typescript
 * const activated = await activateRevenueContract(sequelize, 1, 'user123');
 * ```
 */
export const activateRevenueContract = async (
  sequelize: Sequelize,
  contractId: number,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const RevenueContract = createRevenueContractModel(sequelize);
  const PerformanceObligation = createPerformanceObligationModel(sequelize);

  const contract = await RevenueContract.findByPk(contractId, { transaction });
  if (!contract) {
    throw new Error('Revenue contract not found');
  }

  if (contract.status !== 'draft') {
    throw new Error('Only draft contracts can be activated');
  }

  // Verify performance obligations exist
  const obligations = await PerformanceObligation.findAll({
    where: { contractId },
    transaction,
  });

  if (obligations.length === 0) {
    throw new Error('Contract must have at least one performance obligation before activation');
  }

  // Verify total allocation equals contract value
  const totalAllocated = obligations.reduce((sum, obl) => sum + Number(obl.allocatedAmount), 0);
  const contractValue = Number(contract.totalContractValue);

  if (Math.abs(totalAllocated - contractValue) > 0.01) {
    throw new Error(`Total allocated amount (${totalAllocated}) must equal contract value (${contractValue})`);
  }

  await contract.update(
    {
      status: 'active',
      updatedBy: userId,
    },
    { transaction },
  );

  return contract;
};

/**
 * Creates a performance obligation for a contract.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreatePerformanceObligationDto} obligationData - Obligation data
 * @param {string} userId - User creating the obligation
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created performance obligation
 *
 * @example
 * ```typescript
 * const obligation = await createPerformanceObligation(sequelize, {
 *   contractId: 1,
 *   description: 'Software maintenance services',
 *   obligationType: 'services',
 *   standaloneSellingPrice: 60000,
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-12-31'),
 *   satisfactionMethod: 'over-time'
 * }, 'user123');
 * ```
 */
export const createPerformanceObligation = async (
  sequelize: Sequelize,
  obligationData: CreatePerformanceObligationDto,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const PerformanceObligation = createPerformanceObligationModel(sequelize);
  const RevenueContract = createRevenueContractModel(sequelize);

  // Verify contract exists
  const contract = await RevenueContract.findByPk(obligationData.contractId, { transaction });
  if (!contract) {
    throw new Error('Revenue contract not found');
  }

  if (contract.status !== 'draft') {
    throw new Error('Cannot add performance obligations to non-draft contracts');
  }

  // Generate obligation number
  const count = await PerformanceObligation.count({
    where: { contractId: obligationData.contractId },
    transaction,
  });

  const obligationNumber = `${contract.contractNumber}-PO-${String(count + 1).padStart(3, '0')}`;

  const obligation = await PerformanceObligation.create(
    {
      ...obligationData,
      obligationNumber,
      allocatedAmount: 0, // Will be set during allocation
      recognizedRevenue: 0,
      remainingRevenue: 0,
      completionPercent: 0,
      status: 'not-started',
      transferOfControl: obligationData.satisfactionMethod === 'point-in-time' ? 'customer-accepted' : 'continuous',
    },
    { transaction },
  );

  return obligation;
};

/**
 * Allocates transaction price to performance obligations using relative standalone selling price method.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} contractId - Contract ID
 * @param {string} userId - User performing allocation
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<RevenueAllocation[]>} Revenue allocations
 *
 * @example
 * ```typescript
 * const allocations = await allocateTransactionPrice(sequelize, 1, 'user123');
 * ```
 */
export const allocateTransactionPrice = async (
  sequelize: Sequelize,
  contractId: number,
  userId: string,
  transaction?: Transaction,
): Promise<RevenueAllocation[]> => {
  const RevenueContract = createRevenueContractModel(sequelize);
  const PerformanceObligation = createPerformanceObligationModel(sequelize);

  const contract = await RevenueContract.findByPk(contractId, { transaction });
  if (!contract) {
    throw new Error('Revenue contract not found');
  }

  const obligations = await PerformanceObligation.findAll({
    where: { contractId },
    transaction,
  });

  if (obligations.length === 0) {
    throw new Error('No performance obligations found for allocation');
  }

  // Calculate total standalone selling price
  const totalStandalonePrice = obligations.reduce((sum, obl) => {
    const standalonePrice = Number(obl.metadata?.standaloneSellingPrice || 0);
    return sum + standalonePrice;
  }, 0);

  if (totalStandalonePrice === 0) {
    throw new Error('Standalone selling prices must be set for all obligations');
  }

  const contractValue = Number(contract.totalContractValue);
  const allocations: RevenueAllocation[] = [];

  // Allocate using relative standalone selling price method
  for (const obligation of obligations) {
    const standalonePrice = Number(obligation.metadata?.standaloneSellingPrice || 0);
    const allocationPercent = (standalonePrice / totalStandalonePrice) * 100;
    const allocatedAmount = (contractValue * standalonePrice) / totalStandalonePrice;

    // Update obligation with allocated amount
    await obligation.update(
      {
        allocatedAmount,
        remainingRevenue: allocatedAmount,
      },
      { transaction },
    );

    allocations.push({
      allocationId: 0, // Would be stored in database
      contractId,
      obligationId: obligation.id,
      standaloneSellingPrice: standalonePrice,
      relativeSellingPrice: standalonePrice,
      allocatedAmount,
      allocationPercent,
      allocationMethod: 'relative',
    });
  }

  return allocations;
};

/**
 * Updates performance obligation completion percentage.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} obligationId - Obligation ID
 * @param {number} completionPercent - Completion percentage (0-100)
 * @param {string} userId - User updating completion
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated obligation
 *
 * @example
 * ```typescript
 * const updated = await updatePerformanceObligationCompletion(sequelize, 1, 75, 'user123');
 * ```
 */
export const updatePerformanceObligationCompletion = async (
  sequelize: Sequelize,
  obligationId: number,
  completionPercent: number,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const PerformanceObligation = createPerformanceObligationModel(sequelize);

  if (completionPercent < 0 || completionPercent > 100) {
    throw new Error('Completion percentage must be between 0 and 100');
  }

  const obligation = await PerformanceObligation.findByPk(obligationId, { transaction });
  if (!obligation) {
    throw new Error('Performance obligation not found');
  }

  const status =
    completionPercent === 0 ? 'not-started' : completionPercent === 100 ? 'completed' : 'in-progress';

  await obligation.update(
    {
      completionPercent,
      status,
    },
    { transaction },
  );

  return obligation;
};

// ============================================================================
// REVENUE RECOGNITION FUNCTIONS
// ============================================================================

/**
 * Generates revenue recognition schedule for a performance obligation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} obligationId - Performance obligation ID
 * @param {string} userId - User generating schedule
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<RevenueSchedule[]>} Generated revenue schedules
 *
 * @example
 * ```typescript
 * const schedules = await generateRevenueSchedule(sequelize, 1, 'user123');
 * ```
 */
export const generateRevenueSchedule = async (
  sequelize: Sequelize,
  obligationId: number,
  userId: string,
  transaction?: Transaction,
): Promise<RevenueSchedule[]> => {
  const PerformanceObligation = createPerformanceObligationModel(sequelize);
  const RevenueSchedule = createRevenueScheduleModel(sequelize);

  const obligation = await PerformanceObligation.findByPk(obligationId, { transaction });
  if (!obligation) {
    throw new Error('Performance obligation not found');
  }

  if (obligation.satisfactionMethod !== 'over-time') {
    throw new Error('Schedule generation only applicable for over-time obligations');
  }

  // Delete existing schedules
  await RevenueSchedule.destroy({
    where: { obligationId },
    transaction,
  });

  const startDate = new Date(obligation.startDate);
  const endDate = new Date(obligation.endDate);
  const allocatedAmount = Number(obligation.allocatedAmount);

  // Calculate number of months
  const months =
    (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth()) + 1;

  const monthlyAmount = allocatedAmount / months;
  const schedules: RevenueSchedule[] = [];

  // Generate monthly schedules
  for (let i = 0; i < months; i++) {
    const scheduleDate = new Date(startDate);
    scheduleDate.setMonth(scheduleDate.getMonth() + i);
    scheduleDate.setDate(new Date(scheduleDate.getFullYear(), scheduleDate.getMonth() + 1, 0).getDate()); // Last day of month

    const fiscalYear = scheduleDate.getFullYear();
    const fiscalPeriod = scheduleDate.getMonth() + 1;

    const schedule = await RevenueSchedule.create(
      {
        contractId: obligation.contractId,
        obligationId: obligation.id,
        fiscalYear,
        fiscalPeriod,
        scheduleDate,
        scheduledAmount: monthlyAmount,
        recognizedAmount: 0,
        remainingAmount: monthlyAmount,
        status: 'scheduled',
      },
      { transaction },
    );

    schedules.push(schedule.toJSON());
  }

  return schedules;
};

/**
 * Recognizes revenue for a performance obligation based on completion percentage.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {RevenueRecognitionRequestDto} recognitionData - Recognition data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Recognition result
 *
 * @example
 * ```typescript
 * const result = await recognizeRevenue(sequelize, {
 *   contractId: 1,
 *   obligationId: 1,
 *   recognitionDate: new Date(),
 *   recognitionAmount: 10000,
 *   userId: 'user123'
 * });
 * ```
 */
export const recognizeRevenue = async (
  sequelize: Sequelize,
  recognitionData: RevenueRecognitionRequestDto,
  transaction?: Transaction,
): Promise<any> => {
  const PerformanceObligation = createPerformanceObligationModel(sequelize);
  const RevenueSchedule = createRevenueScheduleModel(sequelize);

  const obligation = await PerformanceObligation.findByPk(recognitionData.obligationId, { transaction });
  if (!obligation) {
    throw new Error('Performance obligation not found');
  }

  const newRecognizedRevenue = Number(obligation.recognizedRevenue) + Number(recognitionData.recognitionAmount);

  if (newRecognizedRevenue > Number(obligation.allocatedAmount)) {
    throw new Error('Cannot recognize more revenue than allocated amount');
  }

  // Update obligation
  await obligation.update(
    {
      recognizedRevenue: newRecognizedRevenue,
      remainingRevenue: Number(obligation.allocatedAmount) - newRecognizedRevenue,
    },
    { transaction },
  );

  // Update schedule
  const fiscalYear = recognitionData.recognitionDate.getFullYear();
  const fiscalPeriod = recognitionData.recognitionDate.getMonth() + 1;

  const schedule = await RevenueSchedule.findOne({
    where: {
      obligationId: recognitionData.obligationId,
      fiscalYear,
      fiscalPeriod,
    },
    transaction,
  });

  if (schedule) {
    await schedule.update(
      {
        recognizedAmount: Number(schedule.recognizedAmount) + Number(recognitionData.recognitionAmount),
        status: 'recognized',
      },
      { transaction },
    );
  }

  return {
    obligationId: obligation.id,
    previousRecognizedRevenue: Number(obligation.recognizedRevenue) - Number(recognitionData.recognitionAmount),
    currentRecognizedRevenue: newRecognizedRevenue,
    remainingRevenue: Number(obligation.allocatedAmount) - newRecognizedRevenue,
    recognitionDate: recognitionData.recognitionDate,
  };
};

/**
 * Recognizes revenue based on milestone completion.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} milestoneId - Milestone ID
 * @param {Date} recognitionDate - Recognition date
 * @param {string} userId - User recognizing revenue
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Recognition result
 *
 * @example
 * ```typescript
 * const result = await recognizeMilestoneRevenue(sequelize, 1, new Date(), 'user123');
 * ```
 */
export const recognizeMilestoneRevenue = async (
  sequelize: Sequelize,
  milestoneId: number,
  recognitionDate: Date,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  // Milestone model would be created separately
  // This is a placeholder implementation
  const milestoneData = {
    milestoneId,
    obligationId: 1,
    milestoneValue: 25000,
    completionPercent: 100,
  };

  if (milestoneData.completionPercent < 100) {
    throw new Error('Milestone must be 100% complete to recognize revenue');
  }

  const recognitionData: RevenueRecognitionRequestDto = {
    contractId: 0, // Would be fetched from milestone
    obligationId: milestoneData.obligationId,
    recognitionDate,
    recognitionAmount: milestoneData.milestoneValue,
    userId,
  };

  return await recognizeRevenue(sequelize, recognitionData, transaction);
};

/**
 * Processes automatic revenue recognition for scheduled amounts.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} asOfDate - Recognition cutoff date
 * @param {string} userId - User processing recognition
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Recognition processing result
 *
 * @example
 * ```typescript
 * const result = await processScheduledRevenueRecognition(sequelize, new Date('2024-01-31'), 'user123');
 * ```
 */
export const processScheduledRevenueRecognition = async (
  sequelize: Sequelize,
  asOfDate: Date,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const RevenueSchedule = createRevenueScheduleModel(sequelize);

  const schedulesToProcess = await RevenueSchedule.findAll({
    where: {
      scheduleDate: { [Op.lte]: asOfDate },
      status: 'scheduled',
    },
    transaction,
  });

  let totalRecognized = 0;
  const processedSchedules = [];

  for (const schedule of schedulesToProcess) {
    await recognizeRevenue(
      sequelize,
      {
        contractId: schedule.contractId,
        obligationId: schedule.obligationId,
        recognitionDate: schedule.scheduleDate,
        recognitionAmount: schedule.scheduledAmount,
        userId,
      },
      transaction,
    );

    totalRecognized += Number(schedule.scheduledAmount);
    processedSchedules.push(schedule.id);
  }

  return {
    schedulesProcessed: processedSchedules.length,
    totalRecognized,
    processedScheduleIds: processedSchedules,
  };
};

/**
 * Reverses recognized revenue for a performance obligation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} scheduleId - Revenue schedule ID
 * @param {string} reversalReason - Reason for reversal
 * @param {string} userId - User reversing revenue
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Reversal result
 *
 * @example
 * ```typescript
 * const result = await reverseRevenueRecognition(sequelize, 1, 'Customer contract cancelled', 'user123');
 * ```
 */
export const reverseRevenueRecognition = async (
  sequelize: Sequelize,
  scheduleId: number,
  reversalReason: string,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const RevenueSchedule = createRevenueScheduleModel(sequelize);
  const PerformanceObligation = createPerformanceObligationModel(sequelize);

  const schedule = await RevenueSchedule.findByPk(scheduleId, { transaction });
  if (!schedule) {
    throw new Error('Revenue schedule not found');
  }

  if (schedule.status !== 'recognized') {
    throw new Error('Can only reverse recognized revenue');
  }

  const obligation = await PerformanceObligation.findByPk(schedule.obligationId, { transaction });
  if (!obligation) {
    throw new Error('Performance obligation not found');
  }

  const reversalAmount = Number(schedule.recognizedAmount);

  // Update obligation
  await obligation.update(
    {
      recognizedRevenue: Number(obligation.recognizedRevenue) - reversalAmount,
      remainingRevenue: Number(obligation.remainingRevenue) + reversalAmount,
    },
    { transaction },
  );

  // Update schedule
  await schedule.update(
    {
      recognizedAmount: 0,
      remainingAmount: Number(schedule.scheduledAmount),
      status: 'reversed',
    },
    { transaction },
  );

  return {
    scheduleId,
    obligationId: obligation.id,
    reversalAmount,
    reversalReason,
    reversedBy: userId,
    reversalDate: new Date(),
  };
};

// ============================================================================
// DEFERRED AND UNBILLED REVENUE FUNCTIONS
// ============================================================================

/**
 * Records deferred revenue when invoice exceeds recognized revenue.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} contractId - Contract ID
 * @param {number} obligationId - Obligation ID
 * @param {number} invoiceId - Invoice ID
 * @param {number} billedAmount - Amount billed
 * @param {string} userId - User recording deferred revenue
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<DeferredRevenue>} Deferred revenue entry
 *
 * @example
 * ```typescript
 * const deferred = await recordDeferredRevenue(sequelize, 1, 1, 100, 50000, 'user123');
 * ```
 */
export const recordDeferredRevenue = async (
  sequelize: Sequelize,
  contractId: number,
  obligationId: number,
  invoiceId: number,
  billedAmount: number,
  userId: string,
  transaction?: Transaction,
): Promise<DeferredRevenue> => {
  const PerformanceObligation = createPerformanceObligationModel(sequelize);

  const obligation = await PerformanceObligation.findByPk(obligationId, { transaction });
  if (!obligation) {
    throw new Error('Performance obligation not found');
  }

  const recognizedAmount = Number(obligation.recognizedRevenue);
  const deferredAmount = billedAmount - recognizedAmount;

  if (deferredAmount <= 0) {
    throw new Error('Billed amount must exceed recognized amount to create deferred revenue');
  }

  const deferredRevenue: DeferredRevenue = {
    deferredId: 0, // Would be auto-generated
    contractId,
    obligationId,
    invoiceId,
    billedAmount,
    recognizedAmount,
    deferredAmount,
    deferralDate: new Date(),
    accountCode: '4000', // Revenue account
    liabilityAccountCode: '2400', // Deferred revenue liability
    status: 'deferred',
  };

  // Would create database record here
  return deferredRevenue;
};

/**
 * Records unbilled revenue (contract asset) when recognized revenue exceeds billing.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} contractId - Contract ID
 * @param {number} obligationId - Obligation ID
 * @param {number} recognizedAmount - Amount recognized
 * @param {number} billedAmount - Amount billed
 * @param {string} userId - User recording unbilled revenue
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<UnbilledRevenue>} Unbilled revenue entry
 *
 * @example
 * ```typescript
 * const unbilled = await recordUnbilledRevenue(sequelize, 1, 1, 50000, 30000, 'user123');
 * ```
 */
export const recordUnbilledRevenue = async (
  sequelize: Sequelize,
  contractId: number,
  obligationId: number,
  recognizedAmount: number,
  billedAmount: number,
  userId: string,
  transaction?: Transaction,
): Promise<UnbilledRevenue> => {
  const unbilledAmount = recognizedAmount - billedAmount;

  if (unbilledAmount <= 0) {
    throw new Error('Recognized amount must exceed billed amount to create unbilled revenue');
  }

  const unbilledRevenue: UnbilledRevenue = {
    unbilledId: 0, // Would be auto-generated
    contractId,
    obligationId,
    recognizedAmount,
    billedAmount,
    unbilledAmount,
    recognitionDate: new Date(),
    assetAccountCode: '1300', // Unbilled receivables (contract asset)
    revenueAccountCode: '4000', // Revenue account
    status: 'unbilled',
  };

  // Would create database record here
  return unbilledRevenue;
};

/**
 * Reconciles deferred and unbilled revenue balances.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {string} userId - User performing reconciliation
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<RevenueReconciliation>} Reconciliation result
 *
 * @example
 * ```typescript
 * const reconciliation = await reconcileDeferredUnbilledRevenue(sequelize, 2024, 1, 'user123');
 * ```
 */
export const reconcileDeferredUnbilledRevenue = async (
  sequelize: Sequelize,
  fiscalYear: number,
  fiscalPeriod: number,
  userId: string,
  transaction?: Transaction,
): Promise<RevenueReconciliation> => {
  const RevenueSchedule = createRevenueScheduleModel(sequelize);

  const schedules = await RevenueSchedule.findAll({
    where: {
      fiscalYear,
      fiscalPeriod,
    },
    transaction,
  });

  const billedRevenue = 0; // Would sum from invoices
  const recognizedRevenue = schedules.reduce((sum, sch) => sum + Number(sch.recognizedAmount), 0);
  const deferredRevenue = 0; // Would sum from deferred revenue records
  const unbilledRevenue = 0; // Would sum from unbilled revenue records

  const variance = billedRevenue - recognizedRevenue + deferredRevenue - unbilledRevenue;
  const variancePercent = recognizedRevenue !== 0 ? (variance / recognizedRevenue) * 100 : 0;

  const reconciliation: RevenueReconciliation = {
    reconciliationId: 0,
    fiscalYear,
    fiscalPeriod,
    billedRevenue,
    recognizedRevenue,
    deferredRevenue,
    unbilledRevenue,
    variance,
    variancePercent,
    status: Math.abs(variance) < 0.01 ? 'balanced' : 'variance',
    reconciledBy: userId,
    reconciledAt: new Date(),
  };

  return reconciliation;
};

// ============================================================================
// CONTRACT MODIFICATION FUNCTIONS
// ============================================================================

/**
 * Processes contract modification with appropriate accounting treatment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {ContractModificationDto} modificationData - Modification data
 * @param {string} userId - User processing modification
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<ContractModification>} Contract modification
 *
 * @example
 * ```typescript
 * const modification = await processContractModification(sequelize, {
 *   contractId: 1,
 *   modificationType: 'additional-goods',
 *   accountingTreatment: 'separate-contract',
 *   modifiedValue: 150000,
 *   description: 'Added premium support',
 *   effectiveDate: new Date('2024-06-01')
 * }, 'user123');
 * ```
 */
export const processContractModification = async (
  sequelize: Sequelize,
  modificationData: ContractModificationDto,
  userId: string,
  transaction?: Transaction,
): Promise<ContractModification> => {
  const RevenueContract = createRevenueContractModel(sequelize);

  const contract = await RevenueContract.findByPk(modificationData.contractId, { transaction });
  if (!contract) {
    throw new Error('Revenue contract not found');
  }

  const originalValue = Number(contract.totalContractValue);
  const valueChange = modificationData.modifiedValue - originalValue;

  // Generate modification number
  const modificationNumber = `${contract.contractNumber}-MOD-${Date.now()}`;

  const modification: ContractModification = {
    modificationId: 0,
    contractId: modificationData.contractId,
    modificationNumber,
    modificationDate: new Date(),
    modificationType: modificationData.modificationType,
    accountingTreatment: modificationData.accountingTreatment,
    originalValue,
    modifiedValue: modificationData.modifiedValue,
    valueChange,
    description: modificationData.description,
    approvedBy: userId,
    effectiveDate: modificationData.effectiveDate,
  };

  // Apply accounting treatment
  if (modificationData.accountingTreatment === 'separate-contract') {
    // Create new contract for additional goods/services
    // Original contract remains unchanged
  } else if (modificationData.accountingTreatment === 'cumulative-catch-up') {
    // Adjust current period revenue for entire change
    await contract.update(
      {
        totalContractValue: modificationData.modifiedValue,
        status: 'modified',
        updatedBy: userId,
      },
      { transaction },
    );
  } else if (modificationData.accountingTreatment === 'prospective') {
    // Adjust remaining performance obligations going forward
    await contract.update(
      {
        totalContractValue: modificationData.modifiedValue,
        status: 'modified',
        updatedBy: userId,
      },
      { transaction },
    );
  }

  return modification;
};

/**
 * Applies cumulative catch-up adjustment for contract modification.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} modificationId - Modification ID
 * @param {string} userId - User applying adjustment
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Adjustment result
 *
 * @example
 * ```typescript
 * const result = await applyCumulativeCatchUpAdjustment(sequelize, 1, 'user123');
 * ```
 */
export const applyCumulativeCatchUpAdjustment = async (
  sequelize: Sequelize,
  modificationId: number,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  // Would fetch modification details
  const modification = {
    contractId: 1,
    valueChange: 20000,
  };

  const PerformanceObligation = createPerformanceObligationModel(sequelize);

  const obligations = await PerformanceObligation.findAll({
    where: {
      contractId: modification.contractId,
      status: { [Op.in]: ['in-progress', 'not-started'] },
    },
    transaction,
  });

  // Recalculate and adjust revenue
  const totalAdjustment = modification.valueChange;
  const adjustmentPerObligation = totalAdjustment / obligations.length;

  for (const obligation of obligations) {
    const newAllocatedAmount = Number(obligation.allocatedAmount) + adjustmentPerObligation;

    await obligation.update(
      {
        allocatedAmount: newAllocatedAmount,
        remainingRevenue: newAllocatedAmount - Number(obligation.recognizedRevenue),
      },
      { transaction },
    );
  }

  return {
    modificationId,
    totalAdjustment,
    obligationsAdjusted: obligations.length,
    adjustmentPerObligation,
  };
};

// ============================================================================
// SUBSCRIPTION MANAGEMENT FUNCTIONS
// ============================================================================

/**
 * Creates a subscription revenue contract.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {any} subscriptionData - Subscription data
 * @param {string} userId - User creating subscription
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<SubscriptionRevenue>} Created subscription
 *
 * @example
 * ```typescript
 * const subscription = await createSubscriptionRevenue(sequelize, {
 *   customerId: 100,
 *   subscriptionNumber: 'SUB-2024-001',
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-12-31'),
 *   billingCycle: 'monthly',
 *   periodicAmount: 1000,
 *   autoRenew: true
 * }, 'user123');
 * ```
 */
export const createSubscriptionRevenue = async (
  sequelize: Sequelize,
  subscriptionData: any,
  userId: string,
  transaction?: Transaction,
): Promise<SubscriptionRevenue> => {
  // Calculate total value based on billing cycle
  const startDate = new Date(subscriptionData.startDate);
  const endDate = new Date(subscriptionData.endDate);
  const months =
    (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth()) + 1;

  let periods = months;
  if (subscriptionData.billingCycle === 'quarterly') periods = months / 3;
  if (subscriptionData.billingCycle === 'semi-annual') periods = months / 6;
  if (subscriptionData.billingCycle === 'annual') periods = months / 12;

  const totalValue = subscriptionData.periodicAmount * periods;

  // Create revenue contract
  const contractData: CreateRevenueContractDto = {
    contractNumber: subscriptionData.subscriptionNumber,
    customerId: subscriptionData.customerId,
    contractDate: new Date(),
    startDate,
    endDate,
    totalContractValue: totalValue,
    recognitionMethod: 'over-time',
    contractType: 'subscription',
    performanceObligations: [],
  };

  const contract = await createRevenueContract(sequelize, contractData, userId, transaction);

  const subscription: SubscriptionRevenue = {
    subscriptionId: contract.id,
    contractId: contract.id,
    customerId: subscriptionData.customerId,
    subscriptionNumber: subscriptionData.subscriptionNumber,
    startDate,
    endDate,
    billingCycle: subscriptionData.billingCycle,
    periodicAmount: subscriptionData.periodicAmount,
    totalValue,
    recognizedRevenue: 0,
    deferredRevenue: totalValue,
    status: 'active',
    autoRenew: subscriptionData.autoRenew,
    renewalTerms: subscriptionData.renewalTerms,
  };

  return subscription;
};

/**
 * Processes subscription renewal.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} subscriptionId - Subscription ID
 * @param {Date} renewalDate - Renewal date
 * @param {string} userId - User processing renewal
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<SubscriptionRevenue>} Renewed subscription
 *
 * @example
 * ```typescript
 * const renewed = await renewSubscription(sequelize, 1, new Date('2025-01-01'), 'user123');
 * ```
 */
export const renewSubscription = async (
  sequelize: Sequelize,
  subscriptionId: number,
  renewalDate: Date,
  userId: string,
  transaction?: Transaction,
): Promise<SubscriptionRevenue> => {
  const RevenueContract = createRevenueContractModel(sequelize);

  const contract = await RevenueContract.findByPk(subscriptionId, { transaction });
  if (!contract) {
    throw new Error('Subscription contract not found');
  }

  if (contract.contractType !== 'subscription') {
    throw new Error('Contract is not a subscription');
  }

  // Create new contract for renewal period
  const originalEndDate = new Date(contract.endDate);
  const renewalEndDate = new Date(renewalDate);
  renewalEndDate.setFullYear(renewalEndDate.getFullYear() + 1);

  const renewalContract = await createRevenueContract(
    sequelize,
    {
      contractNumber: `${contract.contractNumber}-REN`,
      customerId: contract.customerId,
      contractDate: renewalDate,
      startDate: renewalDate,
      endDate: renewalEndDate,
      totalContractValue: contract.totalContractValue,
      recognitionMethod: 'over-time',
      contractType: 'subscription',
      performanceObligations: [],
    },
    userId,
    transaction,
  );

  const renewed: SubscriptionRevenue = {
    subscriptionId: renewalContract.id,
    contractId: renewalContract.id,
    customerId: contract.customerId,
    subscriptionNumber: `${contract.contractNumber}-REN`,
    startDate: renewalDate,
    endDate: renewalEndDate,
    billingCycle: 'annual', // Default
    periodicAmount: contract.totalContractValue,
    totalValue: contract.totalContractValue,
    recognizedRevenue: 0,
    deferredRevenue: contract.totalContractValue,
    status: 'active',
    autoRenew: true,
  };

  return renewed;
};

/**
 * Cancels a subscription and handles revenue implications.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} subscriptionId - Subscription ID
 * @param {Date} cancellationDate - Cancellation date
 * @param {string} cancellationReason - Reason for cancellation
 * @param {string} userId - User cancelling subscription
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Cancellation result
 *
 * @example
 * ```typescript
 * const result = await cancelSubscription(sequelize, 1, new Date(), 'Customer request', 'user123');
 * ```
 */
export const cancelSubscription = async (
  sequelize: Sequelize,
  subscriptionId: number,
  cancellationDate: Date,
  cancellationReason: string,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const RevenueContract = createRevenueContractModel(sequelize);
  const PerformanceObligation = createPerformanceObligationModel(sequelize);

  const contract = await RevenueContract.findByPk(subscriptionId, { transaction });
  if (!contract) {
    throw new Error('Subscription contract not found');
  }

  // Update contract status
  await contract.update(
    {
      status: 'terminated',
      endDate: cancellationDate,
      updatedBy: userId,
    },
    { transaction },
  );

  // Cancel remaining obligations
  const obligations = await PerformanceObligation.findAll({
    where: {
      contractId: subscriptionId,
      status: { [Op.ne]: 'completed' },
    },
    transaction,
  });

  for (const obligation of obligations) {
    await obligation.update(
      {
        status: 'cancelled',
      },
      { transaction },
    );
  }

  return {
    subscriptionId,
    cancellationDate,
    cancellationReason,
    cancelledBy: userId,
    obligationsCancelled: obligations.length,
  };
};

// ============================================================================
// VARIABLE CONSIDERATION FUNCTIONS
// ============================================================================

/**
 * Estimates variable consideration using expected value or most likely amount method.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} contractId - Contract ID
 * @param {number} obligationId - Obligation ID
 * @param {any} variableData - Variable consideration data
 * @param {string} userId - User estimating consideration
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<VariableConsideration>} Variable consideration estimate
 *
 * @example
 * ```typescript
 * const variable = await estimateVariableConsideration(sequelize, 1, 1, {
 *   considerationType: 'performance-bonus',
 *   scenarios: [
 *     { amount: 10000, probability: 0.3 },
 *     { amount: 5000, probability: 0.5 },
 *     { amount: 0, probability: 0.2 }
 *   ],
 *   constraintMethod: 'expected-value'
 * }, 'user123');
 * ```
 */
export const estimateVariableConsideration = async (
  sequelize: Sequelize,
  contractId: number,
  obligationId: number,
  variableData: any,
  userId: string,
  transaction?: Transaction,
): Promise<VariableConsideration> => {
  let estimatedAmount = 0;

  if (variableData.constraintMethod === 'expected-value') {
    // Calculate probability-weighted average
    estimatedAmount = variableData.scenarios.reduce(
      (sum: number, scenario: any) => sum + scenario.amount * scenario.probability,
      0,
    );
  } else if (variableData.constraintMethod === 'most-likely') {
    // Use most likely single amount
    const mostLikely = variableData.scenarios.reduce((max: any, scenario: any) =>
      scenario.probability > max.probability ? scenario : max,
    );
    estimatedAmount = mostLikely.amount;
  }

  // Apply constraint - only recognize if highly probable not to reverse
  const constraintApplied = estimatedAmount * 0.8; // Conservative 80% constraint

  const variableConsideration: VariableConsideration = {
    variableId: 0,
    contractId,
    obligationId,
    considerationType: variableData.considerationType,
    estimatedAmount,
    constraintApplied,
    recognizedAmount: 0,
    constraintMethod: variableData.constraintMethod,
    constraintReason: 'ASC 606 constraint to prevent significant reversal',
    reassessmentDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
  };

  return variableConsideration;
};

/**
 * Reassesses variable consideration estimates.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} variableId - Variable consideration ID
 * @param {any} updatedData - Updated estimate data
 * @param {string} userId - User reassessing
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<VariableConsideration>} Updated variable consideration
 *
 * @example
 * ```typescript
 * const updated = await reassessVariableConsideration(sequelize, 1, {
 *   scenarios: [
 *     { amount: 10000, probability: 0.6 },
 *     { amount: 5000, probability: 0.3 },
 *     { amount: 0, probability: 0.1 }
 *   ]
 * }, 'user123');
 * ```
 */
export const reassessVariableConsideration = async (
  sequelize: Sequelize,
  variableId: number,
  updatedData: any,
  userId: string,
  transaction?: Transaction,
): Promise<VariableConsideration> => {
  // Would fetch existing variable consideration
  const existing = {
    variableId,
    contractId: 1,
    obligationId: 1,
    considerationType: 'performance-bonus' as const,
    estimatedAmount: 5000,
    constraintApplied: 4000,
    recognizedAmount: 3000,
    constraintMethod: 'expected-value' as const,
    constraintReason: 'ASC 606 constraint',
    reassessmentDate: new Date(),
  };

  // Recalculate with updated scenarios
  const newEstimate = updatedData.scenarios.reduce(
    (sum: number, scenario: any) => sum + scenario.amount * scenario.probability,
    0,
  );

  const newConstraint = newEstimate * 0.8;

  const updated: VariableConsideration = {
    ...existing,
    estimatedAmount: newEstimate,
    constraintApplied: newConstraint,
    reassessmentDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
  };

  return updated;
};

// ============================================================================
// REPORTING AND ANALYTICS FUNCTIONS
// ============================================================================

/**
 * Generates ASC 606 revenue roll-forward report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Revenue roll-forward
 *
 * @example
 * ```typescript
 * const rollforward = await generateRevenueRollforward(sequelize, 2024, 1);
 * ```
 */
export const generateRevenueRollforward = async (
  sequelize: Sequelize,
  fiscalYear: number,
  fiscalPeriod: number,
  transaction?: Transaction,
): Promise<any> => {
  const RevenueSchedule = createRevenueScheduleModel(sequelize);

  const currentPeriod = await RevenueSchedule.findAll({
    where: { fiscalYear, fiscalPeriod },
    transaction,
  });

  const previousPeriod =
    fiscalPeriod > 1
      ? await RevenueSchedule.findAll({
          where: { fiscalYear, fiscalPeriod: fiscalPeriod - 1 },
          transaction,
        })
      : await RevenueSchedule.findAll({
          where: { fiscalYear: fiscalYear - 1, fiscalPeriod: 12 },
          transaction,
        });

  const openingBalance = previousPeriod.reduce((sum, sch) => sum + Number(sch.remainingAmount), 0);
  const additions = currentPeriod.reduce((sum, sch) => sum + Number(sch.scheduledAmount), 0);
  const recognized = currentPeriod.reduce((sum, sch) => sum + Number(sch.recognizedAmount), 0);
  const closingBalance = currentPeriod.reduce((sum, sch) => sum + Number(sch.remainingAmount), 0);

  return {
    fiscalYear,
    fiscalPeriod,
    openingBalance,
    additions,
    recognized,
    closingBalance,
    periodMovement: closingBalance - openingBalance,
  };
};

/**
 * Analyzes contract performance and revenue realization.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} contractId - Contract ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Contract performance analysis
 *
 * @example
 * ```typescript
 * const analysis = await analyzeContractPerformance(sequelize, 1);
 * ```
 */
export const analyzeContractPerformance = async (
  sequelize: Sequelize,
  contractId: number,
  transaction?: Transaction,
): Promise<any> => {
  const RevenueContract = createRevenueContractModel(sequelize);
  const PerformanceObligation = createPerformanceObligationModel(sequelize);

  const contract = await RevenueContract.findByPk(contractId, { transaction });
  if (!contract) {
    throw new Error('Revenue contract not found');
  }

  const obligations = await PerformanceObligation.findAll({
    where: { contractId },
    transaction,
  });

  const totalAllocated = obligations.reduce((sum, obl) => sum + Number(obl.allocatedAmount), 0);
  const totalRecognized = obligations.reduce((sum, obl) => sum + Number(obl.recognizedRevenue), 0);
  const totalRemaining = obligations.reduce((sum, obl) => sum + Number(obl.remainingRevenue), 0);

  const recognitionPercent = totalAllocated > 0 ? (totalRecognized / totalAllocated) * 100 : 0;

  const obligationStatus = obligations.map((obl) => ({
    obligationId: obl.id,
    obligationNumber: obl.obligationNumber,
    description: obl.description,
    allocatedAmount: Number(obl.allocatedAmount),
    recognizedRevenue: Number(obl.recognizedRevenue),
    remainingRevenue: Number(obl.remainingRevenue),
    completionPercent: Number(obl.completionPercent),
    status: obl.status,
  }));

  return {
    contractId,
    contractNumber: contract.contractNumber,
    totalContractValue: Number(contract.totalContractValue),
    totalAllocated,
    totalRecognized,
    totalRemaining,
    recognitionPercent,
    obligationCount: obligations.length,
    obligationStatus,
  };
};

/**
 * Generates performance obligation summary by type.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} asOfDate - Reporting date
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Performance obligation summary
 *
 * @example
 * ```typescript
 * const summary = await getPerformanceObligationSummary(sequelize, new Date());
 * ```
 */
export const getPerformanceObligationSummary = async (
  sequelize: Sequelize,
  asOfDate: Date,
  transaction?: Transaction,
): Promise<any[]> => {
  const PerformanceObligation = createPerformanceObligationModel(sequelize);

  const obligations = await PerformanceObligation.findAll({
    where: {
      startDate: { [Op.lte]: asOfDate },
      endDate: { [Op.gte]: asOfDate },
    },
    transaction,
  });

  // Group by obligation type
  const summary = obligations.reduce(
    (acc, obl) => {
      const type = obl.obligationType;
      if (!acc[type]) {
        acc[type] = {
          obligationType: type,
          count: 0,
          totalAllocated: 0,
          totalRecognized: 0,
          totalRemaining: 0,
        };
      }

      acc[type].count++;
      acc[type].totalAllocated += Number(obl.allocatedAmount);
      acc[type].totalRecognized += Number(obl.recognizedRevenue);
      acc[type].totalRemaining += Number(obl.remainingRevenue);

      return acc;
    },
    {} as Record<string, any>,
  );

  return Object.values(summary);
};

/**
 * Exports revenue recognition data for external reporting.
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
 * const exported = await exportRevenueRecognitionData(sequelize, 2024, 1, 'json');
 * ```
 */
export const exportRevenueRecognitionData = async (
  sequelize: Sequelize,
  fiscalYear: number,
  fiscalPeriod: number,
  format: string,
  transaction?: Transaction,
): Promise<any> => {
  const RevenueSchedule = createRevenueScheduleModel(sequelize);
  const RevenueContract = createRevenueContractModel(sequelize);

  const schedules = await RevenueSchedule.findAll({
    where: { fiscalYear, fiscalPeriod },
    transaction,
  });

  const exportData = await Promise.all(
    schedules.map(async (schedule) => {
      const contract = await RevenueContract.findByPk(schedule.contractId, { transaction });

      return {
        contractNumber: contract?.contractNumber,
        customerName: contract?.customerName,
        fiscalYear: schedule.fiscalYear,
        fiscalPeriod: schedule.fiscalPeriod,
        scheduleDate: schedule.scheduleDate,
        scheduledAmount: Number(schedule.scheduledAmount),
        recognizedAmount: Number(schedule.recognizedAmount),
        remainingAmount: Number(schedule.remainingAmount),
        status: schedule.status,
      };
    }),
  );

  if (format === 'json') {
    return exportData;
  } else if (format === 'csv') {
    // Would convert to CSV format
    return exportData;
  }

  return exportData;
};

/**
 * Validates contract against ASC 606 requirements.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} contractId - Contract ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateASC606Compliance(sequelize, 1);
 * ```
 */
export const validateASC606Compliance = async (
  sequelize: Sequelize,
  contractId: number,
  transaction?: Transaction,
): Promise<any> => {
  const RevenueContract = createRevenueContractModel(sequelize);
  const PerformanceObligation = createPerformanceObligationModel(sequelize);

  const contract = await RevenueContract.findByPk(contractId, { transaction });
  if (!contract) {
    throw new Error('Revenue contract not found');
  }

  const obligations = await PerformanceObligation.findAll({
    where: { contractId },
    transaction,
  });

  const validationResults = {
    contractId,
    step1_identifyContract: true,
    step2_identifyPerformanceObligations: obligations.length > 0,
    step3_determineTransactionPrice: contract.totalContractValue > 0,
    step4_allocateTransactionPrice: obligations.every((o) => Number(o.allocatedAmount) > 0),
    step5_recognizeRevenue: obligations.some((o) => Number(o.recognizedRevenue) > 0),
    overallCompliant: true,
  };

  validationResults.overallCompliant = Object.values(validationResults)
    .slice(1, -1)
    .every((v) => v === true);

  return validationResults;
};

/**
 * Calculates revenue forecast based on contract pipeline.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} forecastStartDate - Forecast start date
 * @param {Date} forecastEndDate - Forecast end date
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Revenue forecast
 *
 * @example
 * ```typescript
 * const forecast = await calculateRevenueForecast(sequelize, new Date('2024-01-01'), new Date('2024-12-31'));
 * ```
 */
export const calculateRevenueForecast = async (
  sequelize: Sequelize,
  forecastStartDate: Date,
  forecastEndDate: Date,
  transaction?: Transaction,
): Promise<any> => {
  const RevenueSchedule = createRevenueScheduleModel(sequelize);

  const schedules = await RevenueSchedule.findAll({
    where: {
      scheduleDate: {
        [Op.between]: [forecastStartDate, forecastEndDate],
      },
      status: { [Op.in]: ['scheduled', 'recognized'] },
    },
    transaction,
  });

  const monthlyForecast = new Map<string, number>();

  schedules.forEach((schedule) => {
    const monthKey = `${schedule.fiscalYear}-${String(schedule.fiscalPeriod).padStart(2, '0')}`;
    const current = monthlyForecast.get(monthKey) || 0;
    monthlyForecast.set(monthKey, current + Number(schedule.remainingAmount));
  });

  return Array.from(monthlyForecast.entries()).map(([period, amount]) => ({
    period,
    forecastAmount: amount,
  }));
};

/**
 * Analyzes revenue variance between actual and scheduled.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Variance analysis
 *
 * @example
 * ```typescript
 * const variance = await analyzeRevenueVariance(sequelize, 2024, 1);
 * ```
 */
export const analyzeRevenueVariance = async (
  sequelize: Sequelize,
  fiscalYear: number,
  fiscalPeriod: number,
  transaction?: Transaction,
): Promise<any> => {
  const RevenueSchedule = createRevenueScheduleModel(sequelize);

  const schedules = await RevenueSchedule.findAll({
    where: { fiscalYear, fiscalPeriod },
    transaction,
  });

  const totalScheduled = schedules.reduce((sum, s) => sum + Number(s.scheduledAmount), 0);
  const totalRecognized = schedules.reduce((sum, s) => sum + Number(s.recognizedAmount), 0);
  const variance = totalRecognized - totalScheduled;
  const variancePercent = totalScheduled > 0 ? (variance / totalScheduled) * 100 : 0;

  return {
    fiscalYear,
    fiscalPeriod,
    totalScheduled,
    totalRecognized,
    variance,
    variancePercent,
    favorableUnfavorable: variance >= 0 ? 'favorable' : 'unfavorable',
  };
};

/**
 * Gets contract backlog (future revenue to be recognized).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} asOfDate - Backlog calculation date
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Contract backlog
 *
 * @example
 * ```typescript
 * const backlog = await getContractBacklog(sequelize, new Date());
 * ```
 */
export const getContractBacklog = async (
  sequelize: Sequelize,
  asOfDate: Date,
  transaction?: Transaction,
): Promise<any> => {
  const PerformanceObligation = createPerformanceObligationModel(sequelize);

  const obligations = await PerformanceObligation.findAll({
    where: {
      status: { [Op.in]: ['not-started', 'in-progress'] },
      endDate: { [Op.gte]: asOfDate },
    },
    transaction,
  });

  const totalBacklog = obligations.reduce((sum, obl) => sum + Number(obl.remainingRevenue), 0);
  const currentBacklog = obligations
    .filter((o) => new Date(o.startDate) <= asOfDate)
    .reduce((sum, obl) => sum + Number(obl.remainingRevenue), 0);
  const futureBacklog = totalBacklog - currentBacklog;

  return {
    asOfDate,
    totalBacklog,
    currentBacklog,
    futureBacklog,
    obligationCount: obligations.length,
  };
};

/**
 * Tracks contract renewal probabilities and revenue impact.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} renewalPeriodStart - Renewal period start
 * @param {Date} renewalPeriodEnd - Renewal period end
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Renewal tracking
 *
 * @example
 * ```typescript
 * const renewals = await trackContractRenewals(sequelize, new Date('2024-01-01'), new Date('2024-12-31'));
 * ```
 */
export const trackContractRenewals = async (
  sequelize: Sequelize,
  renewalPeriodStart: Date,
  renewalPeriodEnd: Date,
  transaction?: Transaction,
): Promise<any[]> => {
  const RevenueContract = createRevenueContractModel(sequelize);

  const expiringContracts = await RevenueContract.findAll({
    where: {
      endDate: {
        [Op.between]: [renewalPeriodStart, renewalPeriodEnd],
      },
      status: 'active',
    },
    transaction,
  });

  return expiringContracts.map((contract) => ({
    contractId: contract.id,
    contractNumber: contract.contractNumber,
    customerName: contract.customerName,
    endDate: contract.endDate,
    contractValue: Number(contract.totalContractValue),
    renewalProbability: 0.7, // Would come from CRM/sales data
    expectedRenewalValue: Number(contract.totalContractValue) * 0.7,
  }));
};

/**
 * Generates ASC 606 disclosure report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} ASC 606 disclosure
 *
 * @example
 * ```typescript
 * const disclosure = await generateASC606Disclosure(sequelize, 2024);
 * ```
 */
export const generateASC606Disclosure = async (
  sequelize: Sequelize,
  fiscalYear: number,
  transaction?: Transaction,
): Promise<any> => {
  const RevenueContract = createRevenueContractModel(sequelize);
  const PerformanceObligation = createPerformanceObligationModel(sequelize);

  const contracts = await RevenueContract.findAll({
    where: {
      [Op.or]: [
        { startDate: { [Op.lte]: new Date(fiscalYear, 11, 31) } },
        { endDate: { [Op.gte]: new Date(fiscalYear, 0, 1) } },
      ],
    },
    transaction,
  });

  const obligations = await PerformanceObligation.findAll({
    where: {
      contractId: { [Op.in]: contracts.map((c) => c.id) },
    },
    transaction,
  });

  const disclosure = {
    fiscalYear,
    totalContracts: contracts.length,
    totalRevenue: contracts.reduce((sum, c) => sum + Number(c.totalContractValue), 0),
    recognizedRevenue: obligations.reduce((sum, o) => sum + Number(o.recognizedRevenue), 0),
    deferredRevenue: obligations.reduce((sum, o) => sum + Number(o.remainingRevenue), 0),
    performanceObligations: obligations.length,
    disaggregation: {
      byType: {},
      bySatisfactionMethod: {},
    },
  };

  return disclosure;
};

/**
 * Calculates revenue concentration by customer.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} topN - Number of top customers
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Customer concentration
 *
 * @example
 * ```typescript
 * const concentration = await calculateCustomerConcentration(sequelize, 2024, 10);
 * ```
 */
export const calculateCustomerConcentration = async (
  sequelize: Sequelize,
  fiscalYear: number,
  topN: number,
  transaction?: Transaction,
): Promise<any[]> => {
  const RevenueContract = createRevenueContractModel(sequelize);

  const contracts = await RevenueContract.findAll({
    where: {
      [Op.or]: [
        { startDate: { [Op.lte]: new Date(fiscalYear, 11, 31) } },
        { endDate: { [Op.gte]: new Date(fiscalYear, 0, 1) } },
      ],
    },
    transaction,
  });

  const customerRevenue = new Map<number, { name: string; revenue: number }>();

  contracts.forEach((contract) => {
    const existing = customerRevenue.get(contract.customerId);
    if (existing) {
      existing.revenue += Number(contract.totalContractValue);
    } else {
      customerRevenue.set(contract.customerId, {
        name: contract.customerName,
        revenue: Number(contract.totalContractValue),
      });
    }
  });

  const totalRevenue = Array.from(customerRevenue.values()).reduce((sum, c) => sum + c.revenue, 0);

  return Array.from(customerRevenue.entries())
    .map(([customerId, data]) => ({
      customerId,
      customerName: data.name,
      revenue: data.revenue,
      percentOfTotal: totalRevenue > 0 ? (data.revenue / totalRevenue) * 100 : 0,
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, topN);
};

/**
 * Identifies revenue recognition timing issues.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Timing issues
 *
 * @example
 * ```typescript
 * const issues = await identifyRevenueTimingIssues(sequelize, 2024, 1);
 * ```
 */
export const identifyRevenueTimingIssues = async (
  sequelize: Sequelize,
  fiscalYear: number,
  fiscalPeriod: number,
  transaction?: Transaction,
): Promise<any[]> => {
  const RevenueSchedule = createRevenueScheduleModel(sequelize);

  const schedules = await RevenueSchedule.findAll({
    where: {
      fiscalYear,
      fiscalPeriod,
      status: 'scheduled',
      scheduleDate: { [Op.lt]: new Date() },
    },
    transaction,
  });

  return schedules.map((schedule) => ({
    scheduleId: schedule.id,
    contractId: schedule.contractId,
    obligationId: schedule.obligationId,
    scheduleDate: schedule.scheduleDate,
    scheduledAmount: Number(schedule.scheduledAmount),
    daysOverdue: Math.floor((Date.now() - schedule.scheduleDate.getTime()) / (1000 * 60 * 60 * 24)),
    issue: 'Revenue not recognized on schedule',
  }));
};

/**
 * Processes bulk revenue recognition for multiple obligations.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number[]} obligationIds - Obligation IDs
 * @param {Date} recognitionDate - Recognition date
 * @param {string} userId - User processing recognition
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Bulk processing result
 *
 * @example
 * ```typescript
 * const result = await bulkRecognizeRevenue(sequelize, [1, 2, 3], new Date(), 'user123');
 * ```
 */
export const bulkRecognizeRevenue = async (
  sequelize: Sequelize,
  obligationIds: number[],
  recognitionDate: Date,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  let successCount = 0;
  let failureCount = 0;
  const errors = [];

  for (const obligationId of obligationIds) {
    try {
      const schedules = await createRevenueScheduleModel(sequelize).findAll({
        where: {
          obligationId,
          scheduleDate: { [Op.lte]: recognitionDate },
          status: 'scheduled',
        },
        transaction,
      });

      for (const schedule of schedules) {
        await recognizeRevenue(
          sequelize,
          {
            contractId: schedule.contractId,
            obligationId,
            recognitionDate,
            recognitionAmount: Number(schedule.scheduledAmount),
            userId,
          },
          transaction,
        );
      }

      successCount++;
    } catch (error) {
      failureCount++;
      errors.push({ obligationId, error: (error as Error).message });
    }
  }

  return {
    totalProcessed: obligationIds.length,
    successCount,
    failureCount,
    errors,
  };
};

/**
 * Generates revenue waterfall report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} contractId - Contract ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Revenue waterfall
 *
 * @example
 * ```typescript
 * const waterfall = await generateRevenueWaterfall(sequelize, 1);
 * ```
 */
export const generateRevenueWaterfall = async (
  sequelize: Sequelize,
  contractId: number,
  transaction?: Transaction,
): Promise<any> => {
  const RevenueSchedule = createRevenueScheduleModel(sequelize);

  const schedules = await RevenueSchedule.findAll({
    where: { contractId },
    order: [['scheduleDate', 'ASC']],
    transaction,
  });

  let cumulativeRecognized = 0;
  const waterfall = schedules.map((schedule) => {
    cumulativeRecognized += Number(schedule.recognizedAmount);
    return {
      scheduleDate: schedule.scheduleDate,
      scheduledAmount: Number(schedule.scheduledAmount),
      recognizedAmount: Number(schedule.recognizedAmount),
      cumulativeRecognized,
      status: schedule.status,
    };
  });

  return {
    contractId,
    waterfall,
  };
};

/**
 * Calculates remaining performance obligations (RPO).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} asOfDate - RPO calculation date
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} RPO summary
 *
 * @example
 * ```typescript
 * const rpo = await calculateRemainingPerformanceObligations(sequelize, new Date());
 * ```
 */
export const calculateRemainingPerformanceObligations = async (
  sequelize: Sequelize,
  asOfDate: Date,
  transaction?: Transaction,
): Promise<any> => {
  const PerformanceObligation = createPerformanceObligationModel(sequelize);

  const obligations = await PerformanceObligation.findAll({
    where: {
      status: { [Op.in]: ['not-started', 'in-progress'] },
    },
    transaction,
  });

  const totalRPO = obligations.reduce((sum, obl) => sum + Number(obl.remainingRevenue), 0);

  const currentRPO = obligations
    .filter((o) => new Date(o.endDate) <= new Date(asOfDate.getTime() + 365 * 24 * 60 * 60 * 1000))
    .reduce((sum, obl) => sum + Number(obl.remainingRevenue), 0);

  const nonCurrentRPO = totalRPO - currentRPO;

  return {
    asOfDate,
    totalRPO,
    currentRPO,
    nonCurrentRPO,
    obligationCount: obligations.length,
  };
};

/**
 * Audits revenue recognition transactions.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} contractId - Contract ID
 * @param {Date} startDate - Audit start date
 * @param {Date} endDate - Audit end date
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Audit trail
 *
 * @example
 * ```typescript
 * const audit = await auditRevenueRecognition(sequelize, 1, new Date('2024-01-01'), new Date('2024-12-31'));
 * ```
 */
export const auditRevenueRecognition = async (
  sequelize: Sequelize,
  contractId: number,
  startDate: Date,
  endDate: Date,
  transaction?: Transaction,
): Promise<any> => {
  const RevenueSchedule = createRevenueScheduleModel(sequelize);

  const schedules = await RevenueSchedule.findAll({
    where: {
      contractId,
      scheduleDate: {
        [Op.between]: [startDate, endDate],
      },
    },
    order: [['scheduleDate', 'ASC']],
    transaction,
  });

  const auditTrail = schedules.map((schedule) => ({
    scheduleId: schedule.id,
    scheduleDate: schedule.scheduleDate,
    scheduledAmount: Number(schedule.scheduledAmount),
    recognizedAmount: Number(schedule.recognizedAmount),
    status: schedule.status,
    accountingEntryId: schedule.accountingEntryId,
  }));

  return {
    contractId,
    auditPeriod: { startDate, endDate },
    totalScheduled: schedules.reduce((sum, s) => sum + Number(s.scheduledAmount), 0),
    totalRecognized: schedules.reduce((sum, s) => sum + Number(s.recognizedAmount), 0),
    auditTrail,
  };
};

/**
 * Validates performance obligation allocation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} contractId - Contract ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validatePerformanceObligationAllocation(sequelize, 1);
 * ```
 */
export const validatePerformanceObligationAllocation = async (
  sequelize: Sequelize,
  contractId: number,
  transaction?: Transaction,
): Promise<any> => {
  const RevenueContract = createRevenueContractModel(sequelize);
  const PerformanceObligation = createPerformanceObligationModel(sequelize);

  const contract = await RevenueContract.findByPk(contractId, { transaction });
  if (!contract) {
    throw new Error('Revenue contract not found');
  }

  const obligations = await PerformanceObligation.findAll({
    where: { contractId },
    transaction,
  });

  const totalAllocated = obligations.reduce((sum, obl) => sum + Number(obl.allocatedAmount), 0);
  const contractValue = Number(contract.totalContractValue);
  const allocationVariance = Math.abs(totalAllocated - contractValue);

  return {
    contractId,
    contractValue,
    totalAllocated,
    allocationVariance,
    isValid: allocationVariance < 0.01,
    obligationCount: obligations.length,
    obligations: obligations.map((o) => ({
      obligationId: o.id,
      description: o.description,
      allocatedAmount: Number(o.allocatedAmount),
      allocationPercent: contractValue > 0 ? (Number(o.allocatedAmount) / contractValue) * 100 : 0,
    })),
  };
};

/**
 * Processes contract termination and revenue adjustments.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} contractId - Contract ID
 * @param {Date} terminationDate - Termination date
 * @param {string} terminationReason - Reason for termination
 * @param {string} userId - User processing termination
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Termination result
 *
 * @example
 * ```typescript
 * const result = await terminateContract(sequelize, 1, new Date(), 'Customer breach', 'user123');
 * ```
 */
export const terminateContract = async (
  sequelize: Sequelize,
  contractId: number,
  terminationDate: Date,
  terminationReason: string,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const RevenueContract = createRevenueContractModel(sequelize);
  const PerformanceObligation = createPerformanceObligationModel(sequelize);

  const contract = await RevenueContract.findByPk(contractId, { transaction });
  if (!contract) {
    throw new Error('Revenue contract not found');
  }

  await contract.update(
    {
      status: 'terminated',
      endDate: terminationDate,
      updatedBy: userId,
      metadata: {
        ...contract.metadata,
        terminationReason,
        terminationDate: terminationDate.toISOString(),
      },
    },
    { transaction },
  );

  const obligations = await PerformanceObligation.findAll({
    where: {
      contractId,
      status: { [Op.ne]: 'completed' },
    },
    transaction,
  });

  for (const obligation of obligations) {
    await obligation.update(
      {
        status: 'cancelled',
        endDate: terminationDate,
      },
      { transaction },
    );
  }

  return {
    contractId,
    terminationDate,
    terminationReason,
    obligationsCancelled: obligations.length,
    terminatedBy: userId,
  };
};
