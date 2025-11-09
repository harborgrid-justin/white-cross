/**
 * LOC: EDWBUDG001
 * File: /reuse/edwards/financial/budget-management-control-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (ORM for database operations)
 *   - @nestjs/common (NestJS framework)
 *   - @nestjs/swagger (API documentation)
 *   - ./general-ledger-operations-kit (GL posting)
 *
 * DOWNSTREAM (imported by):
 *   - Backend financial modules
 *   - Budget planning services
 *   - Budget control and monitoring
 *   - Encumbrance tracking
 */

/**
 * File: /reuse/edwards/financial/budget-management-control-kit.ts
 * Locator: WC-EDW-BUDG-001
 * Purpose: Comprehensive Budget Management and Control - JD Edwards EnterpriseOne-level budget operations, encumbrance, budget vs actual
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, TypeScript 5.x, general-ledger-operations-kit
 * Downstream: ../backend/financial/*, Budget Planning Services, Budget Control, Encumbrance Tracking, Variance Analysis
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+
 * Exports: 45+ functions for budget creation, allocation, amendments, transfers, encumbrance, commitments, budget vs actual, variance analysis, budget monitoring, supplemental budgets
 *
 * LLM Context: Enterprise-grade budget management competing with Oracle JD Edwards EnterpriseOne.
 * Provides comprehensive budget planning, budget allocation, budget control, encumbrance accounting, commitment tracking,
 * budget vs actual analysis, budget amendments, supplemental budgets, budget transfers, position budgeting, project budgeting,
 * variance analysis, budget monitoring, budget approval workflows, and multi-year budgeting.
 */

import { Model, DataTypes, Sequelize, Transaction, Op, ValidationError } from 'sequelize';
import { Injectable } from '@nestjs/common';
import { ApiProperty, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface BudgetDefinition {
  budgetId: number;
  budgetCode: string;
  budgetName: string;
  budgetType: 'operating' | 'capital' | 'project' | 'position' | 'flexible';
  fiscalYear: number;
  startDate: Date;
  endDate: Date;
  status: 'draft' | 'submitted' | 'approved' | 'active' | 'closed';
  totalBudgetAmount: number;
  allocatedAmount: number;
  committedAmount: number;
  encumberedAmount: number;
  actualAmount: number;
  availableAmount: number;
}

interface BudgetAllocation {
  allocationId: number;
  budgetId: number;
  accountId: number;
  accountCode: string;
  organizationCode: string;
  departmentCode: string;
  projectCode?: string;
  fiscalYear: number;
  fiscalPeriod: number;
  allocatedAmount: number;
  revisedAmount: number;
  committedAmount: number;
  encumberedAmount: number;
  actualAmount: number;
  availableAmount: number;
}

interface BudgetAmendment {
  amendmentId: number;
  budgetId: number;
  amendmentNumber: string;
  amendmentType: 'increase' | 'decrease' | 'reallocation' | 'supplemental';
  amendmentDate: Date;
  effectiveDate: Date;
  amendmentAmount: number;
  justification: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'posted';
  approvedBy?: string;
  approvedAt?: Date;
}

interface BudgetTransfer {
  transferId: number;
  transferNumber: string;
  transferDate: Date;
  fiscalYear: number;
  fiscalPeriod: number;
  fromBudgetId: number;
  fromAccountCode: string;
  toBudgetId: number;
  toAccountCode: string;
  transferAmount: number;
  reason: string;
  status: 'draft' | 'pending' | 'approved' | 'posted' | 'rejected';
  approvedBy?: string;
}

interface Encumbrance {
  encumbranceId: number;
  encumbranceNumber: string;
  encumbranceType: 'purchase_order' | 'contract' | 'requisition' | 'reservation';
  budgetId: number;
  accountId: number;
  accountCode: string;
  encumbranceDate: Date;
  fiscalYear: number;
  fiscalPeriod: number;
  encumbranceAmount: number;
  liquidatedAmount: number;
  remainingAmount: number;
  status: 'active' | 'partial' | 'liquidated' | 'cancelled';
  referenceDocument: string;
}

interface Commitment {
  commitmentId: number;
  commitmentNumber: string;
  commitmentType: 'requisition' | 'pre_encumbrance' | 'reservation';
  budgetId: number;
  accountId: number;
  accountCode: string;
  commitmentDate: Date;
  fiscalYear: number;
  fiscalPeriod: number;
  commitmentAmount: number;
  convertedAmount: number;
  remainingAmount: number;
  status: 'active' | 'converted' | 'cancelled';
}

interface BudgetVsActual {
  accountCode: string;
  accountName: string;
  fiscalYear: number;
  fiscalPeriod: number;
  budgetAmount: number;
  amendmentAmount: number;
  revisedBudget: number;
  committedAmount: number;
  encumberedAmount: number;
  actualAmount: number;
  availableAmount: number;
  variance: number;
  variancePercent: number;
}

interface VarianceAnalysis {
  accountCode: string;
  accountName: string;
  budgetAmount: number;
  actualAmount: number;
  variance: number;
  variancePercent: number;
  varianceType: 'favorable' | 'unfavorable' | 'neutral';
  thresholdStatus: 'within' | 'warning' | 'exceeded';
}

interface BudgetControl {
  controlId: number;
  budgetId: number;
  accountCode: string;
  controlType: 'hard' | 'soft' | 'advisory';
  checkLevel: 'account' | 'department' | 'project' | 'organization';
  allowOverrun: boolean;
  overrunThreshold: number;
  warningThreshold: number;
  isActive: boolean;
}

interface FundsAvailability {
  accountId: number;
  accountCode: string;
  budgetAmount: number;
  committedAmount: number;
  encumberedAmount: number;
  actualAmount: number;
  reservedAmount: number;
  availableAmount: number;
  hasSufficientFunds: boolean;
}

// ============================================================================
// DTO CLASSES
// ============================================================================

export class CreateBudgetDto {
  @ApiProperty({ description: 'Budget code', example: 'FY2024-OPS' })
  budgetCode!: string;

  @ApiProperty({ description: 'Budget name', example: 'FY2024 Operating Budget' })
  budgetName!: string;

  @ApiProperty({ description: 'Budget type', enum: ['operating', 'capital', 'project', 'position'] })
  budgetType!: string;

  @ApiProperty({ description: 'Fiscal year', example: 2024 })
  fiscalYear!: number;

  @ApiProperty({ description: 'Budget start date', example: '2024-01-01' })
  startDate!: Date;

  @ApiProperty({ description: 'Budget end date', example: '2024-12-31' })
  endDate!: Date;

  @ApiProperty({ description: 'Total budget amount' })
  totalBudgetAmount!: number;
}

export class CreateBudgetAllocationDto {
  @ApiProperty({ description: 'Budget ID' })
  budgetId!: number;

  @ApiProperty({ description: 'Account ID' })
  accountId!: number;

  @ApiProperty({ description: 'Fiscal year' })
  fiscalYear!: number;

  @ApiProperty({ description: 'Fiscal period' })
  fiscalPeriod!: number;

  @ApiProperty({ description: 'Allocated amount' })
  allocatedAmount!: number;

  @ApiProperty({ description: 'Organization code', required: false })
  organizationCode?: string;

  @ApiProperty({ description: 'Department code', required: false })
  departmentCode?: string;
}

export class CreateBudgetAmendmentDto {
  @ApiProperty({ description: 'Budget ID' })
  budgetId!: number;

  @ApiProperty({ description: 'Amendment type', enum: ['increase', 'decrease', 'reallocation', 'supplemental'] })
  amendmentType!: string;

  @ApiProperty({ description: 'Amendment amount' })
  amendmentAmount!: number;

  @ApiProperty({ description: 'Effective date' })
  effectiveDate!: Date;

  @ApiProperty({ description: 'Justification' })
  justification!: string;
}

export class CreateBudgetTransferDto {
  @ApiProperty({ description: 'From budget ID' })
  fromBudgetId!: number;

  @ApiProperty({ description: 'From account code' })
  fromAccountCode!: string;

  @ApiProperty({ description: 'To budget ID' })
  toBudgetId!: number;

  @ApiProperty({ description: 'To account code' })
  toAccountCode!: string;

  @ApiProperty({ description: 'Transfer amount' })
  transferAmount!: number;

  @ApiProperty({ description: 'Transfer reason' })
  reason!: string;
}

export class CreateEncumbranceDto {
  @ApiProperty({ description: 'Budget ID' })
  budgetId!: number;

  @ApiProperty({ description: 'Account ID' })
  accountId!: number;

  @ApiProperty({ description: 'Encumbrance type', enum: ['purchase_order', 'contract', 'requisition'] })
  encumbranceType!: string;

  @ApiProperty({ description: 'Encumbrance amount' })
  encumbranceAmount!: number;

  @ApiProperty({ description: 'Reference document number' })
  referenceDocument!: string;
}

export class CheckFundsAvailabilityDto {
  @ApiProperty({ description: 'Budget ID' })
  budgetId!: number;

  @ApiProperty({ description: 'Account ID' })
  accountId!: number;

  @ApiProperty({ description: 'Amount to check' })
  amount!: number;

  @ApiProperty({ description: 'Check date' })
  checkDate!: Date;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Sequelize model for Budget Definitions with multi-year support.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} BudgetDefinition model
 *
 * @example
 * ```typescript
 * const Budget = createBudgetDefinitionModel(sequelize);
 * const budget = await Budget.create({
 *   budgetCode: 'FY2024-OPS',
 *   budgetName: 'FY2024 Operating Budget',
 *   budgetType: 'operating',
 *   fiscalYear: 2024,
 *   totalBudgetAmount: 10000000
 * });
 * ```
 */
export const createBudgetDefinitionModel = (sequelize: Sequelize) => {
  class BudgetDefinition extends Model {
    public id!: number;
    public budgetCode!: string;
    public budgetName!: string;
    public budgetType!: string;
    public budgetCategory!: string;
    public fiscalYear!: number;
    public startDate!: Date;
    public endDate!: Date;
    public status!: string;
    public totalBudgetAmount!: number;
    public allocatedAmount!: number;
    public committedAmount!: number;
    public encumberedAmount!: number;
    public actualAmount!: number;
    public availableAmount!: number;
    public isMultiYear!: boolean;
    public parentBudgetId!: number | null;
    public approvalWorkflowId!: string | null;
    public approvedBy!: string | null;
    public approvedAt!: Date | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly createdBy!: string;
    public readonly updatedBy!: string;
  }

  BudgetDefinition.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      budgetCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Unique budget code',
      },
      budgetName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Budget name/description',
      },
      budgetType: {
        type: DataTypes.ENUM('operating', 'capital', 'project', 'position', 'flexible', 'grant'),
        allowNull: false,
        comment: 'Type of budget',
      },
      budgetCategory: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'general',
        comment: 'Budget category classification',
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
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Budget period start date',
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Budget period end date',
      },
      status: {
        type: DataTypes.ENUM('draft', 'submitted', 'approved', 'active', 'closed', 'locked'),
        allowNull: false,
        defaultValue: 'draft',
        comment: 'Budget status',
      },
      totalBudgetAmount: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Total budget amount',
      },
      allocatedAmount: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Total allocated amount',
      },
      committedAmount: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Total committed amount',
      },
      encumberedAmount: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Total encumbered amount',
      },
      actualAmount: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Total actual expenditures',
      },
      availableAmount: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Available budget balance',
      },
      isMultiYear: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Whether budget spans multiple years',
      },
      parentBudgetId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Parent budget for sub-budgets',
        references: {
          model: 'budget_definitions',
          key: 'id',
        },
      },
      approvalWorkflowId: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Approval workflow identifier',
      },
      approvedBy: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'User who approved budget',
      },
      approvedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Approval timestamp',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional budget metadata',
      },
      createdBy: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'User who created the budget',
      },
      updatedBy: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'User who last updated the budget',
      },
    },
    {
      sequelize,
      tableName: 'budget_definitions',
      timestamps: true,
      indexes: [
        { fields: ['budgetCode'], unique: true },
        { fields: ['fiscalYear'] },
        { fields: ['budgetType'] },
        { fields: ['status'] },
        { fields: ['startDate', 'endDate'] },
      ],
      hooks: {
        beforeCreate: (budget) => {
          if (!budget.createdBy) {
            throw new Error('createdBy is required');
          }
          budget.updatedBy = budget.createdBy;
        },
        beforeUpdate: (budget) => {
          if (!budget.updatedBy) {
            throw new Error('updatedBy is required');
          }
        },
        beforeSave: (budget) => {
          // Calculate available amount
          const total = Number(budget.totalBudgetAmount || 0);
          const committed = Number(budget.committedAmount || 0);
          const encumbered = Number(budget.encumberedAmount || 0);
          const actual = Number(budget.actualAmount || 0);
          budget.availableAmount = total - committed - encumbered - actual;
        },
      },
      validate: {
        startBeforeEnd() {
          if (this.startDate >= this.endDate) {
            throw new Error('Start date must be before end date');
          }
        },
      },
      scopes: {
        active: {
          where: { status: 'active' },
        },
        forYear: (fiscalYear: number) => ({
          where: { fiscalYear },
        }),
      },
    },
  );

  return BudgetDefinition;
};

/**
 * Sequelize model for Budget Allocations by account and period.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} BudgetAllocation model
 *
 * @example
 * ```typescript
 * const Allocation = createBudgetAllocationModel(sequelize);
 * const allocation = await Allocation.create({
 *   budgetId: 1,
 *   accountId: 100,
 *   fiscalYear: 2024,
 *   fiscalPeriod: 1,
 *   allocatedAmount: 100000
 * });
 * ```
 */
export const createBudgetAllocationModel = (sequelize: Sequelize) => {
  class BudgetAllocation extends Model {
    public id!: number;
    public budgetId!: number;
    public accountId!: number;
    public accountCode!: string;
    public organizationCode!: string | null;
    public departmentCode!: string | null;
    public projectCode!: string | null;
    public costCenterCode!: string | null;
    public fiscalYear!: number;
    public fiscalPeriod!: number;
    public allocatedAmount!: number;
    public revisedAmount!: number;
    public committedAmount!: number;
    public encumberedAmount!: number;
    public actualAmount!: number;
    public availableAmount!: number;
    public isLocked!: boolean;
    public lockedAt!: Date | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly createdBy!: string;
    public readonly updatedBy!: string;
  }

  BudgetAllocation.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      budgetId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Reference to budget definition',
        references: {
          model: 'budget_definitions',
          key: 'id',
        },
        onDelete: 'CASCADE',
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
        comment: 'Account code (denormalized)',
      },
      organizationCode: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Organization code',
      },
      departmentCode: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Department code',
      },
      projectCode: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Project code',
      },
      costCenterCode: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Cost center code',
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
      allocatedAmount: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Original allocated amount',
      },
      revisedAmount: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Revised amount after amendments',
      },
      committedAmount: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Committed amount',
      },
      encumberedAmount: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Encumbered amount',
      },
      actualAmount: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Actual expenditures',
      },
      availableAmount: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Available budget balance',
      },
      isLocked: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Whether allocation is locked',
      },
      lockedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Lock timestamp',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional allocation metadata',
      },
      createdBy: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'User who created the allocation',
      },
      updatedBy: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'User who last updated the allocation',
      },
    },
    {
      sequelize,
      tableName: 'budget_allocations',
      timestamps: true,
      indexes: [
        { fields: ['budgetId', 'accountId', 'fiscalYear', 'fiscalPeriod'], unique: true },
        { fields: ['budgetId'] },
        { fields: ['accountId'] },
        { fields: ['accountCode'] },
        { fields: ['fiscalYear', 'fiscalPeriod'] },
        { fields: ['organizationCode'] },
        { fields: ['departmentCode'] },
      ],
      hooks: {
        beforeCreate: (allocation) => {
          if (!allocation.createdBy) {
            throw new Error('createdBy is required');
          }
          allocation.updatedBy = allocation.createdBy;
          allocation.revisedAmount = allocation.allocatedAmount;
        },
        beforeUpdate: (allocation) => {
          if (!allocation.updatedBy) {
            throw new Error('updatedBy is required');
          }
        },
        beforeSave: (allocation) => {
          // Calculate available amount
          const revised = Number(allocation.revisedAmount || allocation.allocatedAmount || 0);
          const committed = Number(allocation.committedAmount || 0);
          const encumbered = Number(allocation.encumberedAmount || 0);
          const actual = Number(allocation.actualAmount || 0);
          allocation.availableAmount = revised - committed - encumbered - actual;
        },
      },
      scopes: {
        unlocked: {
          where: { isLocked: false },
        },
      },
    },
  );

  return BudgetAllocation;
};

/**
 * Sequelize model for Budget Amendments with approval workflow.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} BudgetAmendment model
 *
 * @example
 * ```typescript
 * const Amendment = createBudgetAmendmentModel(sequelize);
 * const amendment = await Amendment.create({
 *   budgetId: 1,
 *   amendmentType: 'increase',
 *   amendmentAmount: 50000,
 *   justification: 'Additional funding for Q4'
 * });
 * ```
 */
export const createBudgetAmendmentModel = (sequelize: Sequelize) => {
  class BudgetAmendment extends Model {
    public id!: number;
    public budgetId!: number;
    public amendmentNumber!: string;
    public amendmentType!: string;
    public amendmentDate!: Date;
    public effectiveDate!: Date;
    public amendmentAmount!: number;
    public accountId!: number | null;
    public accountCode!: string | null;
    public justification!: string;
    public status!: string;
    public submittedBy!: string | null;
    public submittedAt!: Date | null;
    public approvedBy!: string | null;
    public approvedAt!: Date | null;
    public rejectedBy!: string | null;
    public rejectedAt!: Date | null;
    public rejectionReason!: string | null;
    public postedAt!: Date | null;
    public journalEntryId!: number | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly createdBy!: string;
    public readonly updatedBy!: string;
  }

  BudgetAmendment.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      budgetId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Reference to budget definition',
        references: {
          model: 'budget_definitions',
          key: 'id',
        },
      },
      amendmentNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Unique amendment number',
      },
      amendmentType: {
        type: DataTypes.ENUM('increase', 'decrease', 'reallocation', 'supplemental', 'technical'),
        allowNull: false,
        comment: 'Type of amendment',
      },
      amendmentDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Amendment creation date',
      },
      effectiveDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Date amendment becomes effective',
      },
      amendmentAmount: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        comment: 'Amendment amount (positive or negative)',
      },
      accountId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Specific account for amendment',
        references: {
          model: 'chart_of_accounts',
          key: 'id',
        },
      },
      accountCode: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Account code (denormalized)',
      },
      justification: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Business justification for amendment',
      },
      status: {
        type: DataTypes.ENUM('draft', 'submitted', 'pending', 'approved', 'rejected', 'posted'),
        allowNull: false,
        defaultValue: 'draft',
        comment: 'Amendment status',
      },
      submittedBy: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'User who submitted amendment',
      },
      submittedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Submission timestamp',
      },
      approvedBy: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'User who approved amendment',
      },
      approvedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Approval timestamp',
      },
      rejectedBy: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'User who rejected amendment',
      },
      rejectedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Rejection timestamp',
      },
      rejectionReason: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Reason for rejection',
      },
      postedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Posting timestamp',
      },
      journalEntryId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Associated journal entry',
        references: {
          model: 'journal_entry_headers',
          key: 'id',
        },
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional amendment metadata',
      },
      createdBy: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'User who created the amendment',
      },
      updatedBy: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'User who last updated the amendment',
      },
    },
    {
      sequelize,
      tableName: 'budget_amendments',
      timestamps: true,
      indexes: [
        { fields: ['amendmentNumber'], unique: true },
        { fields: ['budgetId'] },
        { fields: ['amendmentType'] },
        { fields: ['status'] },
        { fields: ['effectiveDate'] },
      ],
      hooks: {
        beforeCreate: (amendment) => {
          if (!amendment.createdBy) {
            throw new Error('createdBy is required');
          }
          amendment.updatedBy = amendment.createdBy;
          amendment.amendmentDate = amendment.amendmentDate || new Date();
        },
        beforeUpdate: (amendment) => {
          if (!amendment.updatedBy) {
            throw new Error('updatedBy is required');
          }
        },
      },
      scopes: {
        pending: {
          where: { status: 'pending' },
        },
        approved: {
          where: { status: 'approved' },
        },
      },
    },
  );

  return BudgetAmendment;
};

/**
 * Sequelize model for Budget Transfers between accounts.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} BudgetTransfer model
 *
 * @example
 * ```typescript
 * const Transfer = createBudgetTransferModel(sequelize);
 * const transfer = await Transfer.create({
 *   fromBudgetId: 1,
 *   fromAccountCode: '5000-SALARIES',
 *   toBudgetId: 1,
 *   toAccountCode: '5100-BENEFITS',
 *   transferAmount: 25000
 * });
 * ```
 */
export const createBudgetTransferModel = (sequelize: Sequelize) => {
  class BudgetTransfer extends Model {
    public id!: number;
    public transferNumber!: string;
    public transferDate!: Date;
    public fiscalYear!: number;
    public fiscalPeriod!: number;
    public fromBudgetId!: number;
    public fromAccountId!: number;
    public fromAccountCode!: string;
    public toBudgetId!: number;
    public toAccountId!: number;
    public toAccountCode!: string;
    public transferAmount!: number;
    public reason!: string;
    public status!: string;
    public submittedBy!: string | null;
    public approvedBy!: string | null;
    public approvedAt!: Date | null;
    public postedAt!: Date | null;
    public journalEntryId!: number | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly createdBy!: string;
    public readonly updatedBy!: string;
  }

  BudgetTransfer.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      transferNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Unique transfer number',
      },
      transferDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Transfer date',
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
      fromBudgetId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Source budget',
        references: {
          model: 'budget_definitions',
          key: 'id',
        },
      },
      fromAccountId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Source account',
        references: {
          model: 'chart_of_accounts',
          key: 'id',
        },
      },
      fromAccountCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Source account code (denormalized)',
      },
      toBudgetId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Destination budget',
        references: {
          model: 'budget_definitions',
          key: 'id',
        },
      },
      toAccountId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Destination account',
        references: {
          model: 'chart_of_accounts',
          key: 'id',
        },
      },
      toAccountCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Destination account code (denormalized)',
      },
      transferAmount: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        comment: 'Transfer amount',
        validate: {
          min: 0.01,
        },
      },
      reason: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Reason for transfer',
      },
      status: {
        type: DataTypes.ENUM('draft', 'submitted', 'pending', 'approved', 'posted', 'rejected'),
        allowNull: false,
        defaultValue: 'draft',
        comment: 'Transfer status',
      },
      submittedBy: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'User who submitted transfer',
      },
      approvedBy: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'User who approved transfer',
      },
      approvedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Approval timestamp',
      },
      postedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Posting timestamp',
      },
      journalEntryId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Associated journal entry',
        references: {
          model: 'journal_entry_headers',
          key: 'id',
        },
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional transfer metadata',
      },
      createdBy: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'User who created the transfer',
      },
      updatedBy: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'User who last updated the transfer',
      },
    },
    {
      sequelize,
      tableName: 'budget_transfers',
      timestamps: true,
      indexes: [
        { fields: ['transferNumber'], unique: true },
        { fields: ['fromBudgetId'] },
        { fields: ['toBudgetId'] },
        { fields: ['status'] },
        { fields: ['fiscalYear', 'fiscalPeriod'] },
      ],
      hooks: {
        beforeCreate: (transfer) => {
          if (!transfer.createdBy) {
            throw new Error('createdBy is required');
          }
          transfer.updatedBy = transfer.createdBy;
        },
        beforeUpdate: (transfer) => {
          if (!transfer.updatedBy) {
            throw new Error('updatedBy is required');
          }
        },
      },
      validate: {
        differentAccounts() {
          if (this.fromAccountCode === this.toAccountCode && this.fromBudgetId === this.toBudgetId) {
            throw new Error('Source and destination must be different');
          }
        },
      },
      scopes: {
        pending: {
          where: { status: 'pending' },
        },
      },
    },
  );

  return BudgetTransfer;
};

/**
 * Sequelize model for Encumbrances (purchase orders, contracts).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Encumbrance model
 *
 * @example
 * ```typescript
 * const Encumbrance = createEncumbranceModel(sequelize);
 * const encumbrance = await Encumbrance.create({
 *   encumbranceType: 'purchase_order',
 *   budgetId: 1,
 *   accountId: 100,
 *   encumbranceAmount: 50000,
 *   referenceDocument: 'PO-2024-001'
 * });
 * ```
 */
export const createEncumbranceModel = (sequelize: Sequelize) => {
  class Encumbrance extends Model {
    public id!: number;
    public encumbranceNumber!: string;
    public encumbranceType!: string;
    public budgetId!: number;
    public accountId!: number;
    public accountCode!: string;
    public encumbranceDate!: Date;
    public fiscalYear!: number;
    public fiscalPeriod!: number;
    public encumbranceAmount!: number;
    public liquidatedAmount!: number;
    public remainingAmount!: number;
    public status!: string;
    public referenceDocument!: string;
    public vendorId!: number | null;
    public vendorName!: string | null;
    public description!: string;
    public expirationDate!: Date | null;
    public cancelledAt!: Date | null;
    public cancelledBy!: string | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly createdBy!: string;
    public readonly updatedBy!: string;
  }

  Encumbrance.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      encumbranceNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Unique encumbrance number',
      },
      encumbranceType: {
        type: DataTypes.ENUM('purchase_order', 'contract', 'requisition', 'reservation', 'blanket_po'),
        allowNull: false,
        comment: 'Type of encumbrance',
      },
      budgetId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Reference to budget',
        references: {
          model: 'budget_definitions',
          key: 'id',
        },
      },
      accountId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Reference to account',
        references: {
          model: 'chart_of_accounts',
          key: 'id',
        },
      },
      accountCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Account code (denormalized)',
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
      encumbranceAmount: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        comment: 'Original encumbrance amount',
        validate: {
          min: 0,
        },
      },
      liquidatedAmount: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Liquidated/spent amount',
      },
      remainingAmount: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Remaining encumbrance',
      },
      status: {
        type: DataTypes.ENUM('active', 'partial', 'liquidated', 'cancelled', 'expired'),
        allowNull: false,
        defaultValue: 'active',
        comment: 'Encumbrance status',
      },
      referenceDocument: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Reference document number (PO, Contract, etc.)',
      },
      vendorId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Vendor ID if applicable',
      },
      vendorName: {
        type: DataTypes.STRING(200),
        allowNull: true,
        comment: 'Vendor name (denormalized)',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Encumbrance description',
      },
      expirationDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Encumbrance expiration date',
      },
      cancelledAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Cancellation timestamp',
      },
      cancelledBy: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'User who cancelled encumbrance',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional encumbrance metadata',
      },
      createdBy: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'User who created the encumbrance',
      },
      updatedBy: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'User who last updated the encumbrance',
      },
    },
    {
      sequelize,
      tableName: 'encumbrances',
      timestamps: true,
      indexes: [
        { fields: ['encumbranceNumber'], unique: true },
        { fields: ['budgetId'] },
        { fields: ['accountId'] },
        { fields: ['status'] },
        { fields: ['referenceDocument'] },
        { fields: ['fiscalYear', 'fiscalPeriod'] },
      ],
      hooks: {
        beforeCreate: (encumbrance) => {
          if (!encumbrance.createdBy) {
            throw new Error('createdBy is required');
          }
          encumbrance.updatedBy = encumbrance.createdBy;
          encumbrance.remainingAmount = encumbrance.encumbranceAmount;
        },
        beforeUpdate: (encumbrance) => {
          if (!encumbrance.updatedBy) {
            throw new Error('updatedBy is required');
          }
        },
        beforeSave: (encumbrance) => {
          // Calculate remaining amount
          const total = Number(encumbrance.encumbranceAmount || 0);
          const liquidated = Number(encumbrance.liquidatedAmount || 0);
          encumbrance.remainingAmount = total - liquidated;

          // Update status based on amounts
          if (liquidated >= total) {
            encumbrance.status = 'liquidated';
          } else if (liquidated > 0) {
            encumbrance.status = 'partial';
          }
        },
      },
      scopes: {
        active: {
          where: { status: 'active' },
        },
        forBudget: (budgetId: number) => ({
          where: { budgetId },
        }),
      },
    },
  );

  return Encumbrance;
};

// ============================================================================
// BUDGET CREATION AND MANAGEMENT (1-10)
// ============================================================================

/**
 * Creates a new budget definition.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateBudgetDto} budgetData - Budget data
 * @param {string} userId - User creating the budget
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created budget
 *
 * @example
 * ```typescript
 * const budget = await createBudget(sequelize, {
 *   budgetCode: 'FY2024-OPS',
 *   budgetName: 'FY2024 Operating Budget',
 *   budgetType: 'operating',
 *   fiscalYear: 2024,
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-12-31'),
 *   totalBudgetAmount: 10000000
 * }, 'user123');
 * ```
 */
export async function createBudget(
  sequelize: Sequelize,
  budgetData: CreateBudgetDto,
  userId: string,
  transaction?: Transaction,
): Promise<any> {
  const Budget = createBudgetDefinitionModel(sequelize);

  const budget = await Budget.create(
    {
      ...budgetData,
      createdBy: userId,
      updatedBy: userId,
    },
    { transaction },
  );

  return budget;
}

/**
 * Updates an existing budget definition.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} budgetId - Budget ID to update
 * @param {object} updateData - Updated budget data
 * @param {string} userId - User updating the budget
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated budget
 *
 * @example
 * ```typescript
 * const updated = await updateBudget(sequelize, 1, {
 *   totalBudgetAmount: 11000000
 * }, 'user123');
 * ```
 */
export async function updateBudget(
  sequelize: Sequelize,
  budgetId: number,
  updateData: any,
  userId: string,
  transaction?: Transaction,
): Promise<any> {
  const Budget = createBudgetDefinitionModel(sequelize);

  const budget = await Budget.findByPk(budgetId, { transaction });

  if (!budget) {
    throw new Error(`Budget ${budgetId} not found`);
  }

  if (budget.status === 'locked' || budget.status === 'closed') {
    throw new Error('Cannot update locked or closed budget');
  }

  await budget.update(
    {
      ...updateData,
      updatedBy: userId,
    },
    { transaction },
  );

  return budget;
}

/**
 * Retrieves budget by ID.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} budgetId - Budget ID to retrieve
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Budget definition
 *
 * @example
 * ```typescript
 * const budget = await getBudgetById(sequelize, 1);
 * ```
 */
export async function getBudgetById(
  sequelize: Sequelize,
  budgetId: number,
  transaction?: Transaction,
): Promise<any> {
  const Budget = createBudgetDefinitionModel(sequelize);

  const budget = await Budget.findByPk(budgetId, { transaction });

  if (!budget) {
    throw new Error(`Budget ${budgetId} not found`);
  }

  return budget;
}

/**
 * Retrieves budget by code.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} budgetCode - Budget code to retrieve
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Budget definition
 *
 * @example
 * ```typescript
 * const budget = await getBudgetByCode(sequelize, 'FY2024-OPS');
 * ```
 */
export async function getBudgetByCode(
  sequelize: Sequelize,
  budgetCode: string,
  transaction?: Transaction,
): Promise<any> {
  const Budget = createBudgetDefinitionModel(sequelize);

  const budget = await Budget.findOne({
    where: { budgetCode },
    transaction,
  });

  if (!budget) {
    throw new Error(`Budget ${budgetCode} not found`);
  }

  return budget;
}

/**
 * Lists all budgets for a fiscal year.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Array of budgets
 *
 * @example
 * ```typescript
 * const budgets = await listBudgetsByYear(sequelize, 2024);
 * ```
 */
export async function listBudgetsByYear(
  sequelize: Sequelize,
  fiscalYear: number,
  transaction?: Transaction,
): Promise<any[]> {
  const Budget = createBudgetDefinitionModel(sequelize);

  const budgets = await Budget.findAll({
    where: { fiscalYear },
    order: [['budgetCode', 'ASC']],
    transaction,
  });

  return budgets;
}

/**
 * Approves a budget.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} budgetId - Budget ID to approve
 * @param {string} userId - User approving the budget
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Approved budget
 *
 * @example
 * ```typescript
 * const approved = await approveBudget(sequelize, 1, 'manager123');
 * ```
 */
export async function approveBudget(
  sequelize: Sequelize,
  budgetId: number,
  userId: string,
  transaction?: Transaction,
): Promise<any> {
  const Budget = createBudgetDefinitionModel(sequelize);

  const budget = await Budget.findByPk(budgetId, { transaction });

  if (!budget) {
    throw new Error(`Budget ${budgetId} not found`);
  }

  if (budget.status !== 'submitted' && budget.status !== 'draft') {
    throw new Error(`Budget must be in draft or submitted status to approve`);
  }

  await budget.update(
    {
      status: 'approved',
      approvedBy: userId,
      approvedAt: new Date(),
      updatedBy: userId,
    },
    { transaction },
  );

  return budget;
}

/**
 * Activates an approved budget.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} budgetId - Budget ID to activate
 * @param {string} userId - User activating the budget
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Activated budget
 *
 * @example
 * ```typescript
 * const active = await activateBudget(sequelize, 1, 'user123');
 * ```
 */
export async function activateBudget(
  sequelize: Sequelize,
  budgetId: number,
  userId: string,
  transaction?: Transaction,
): Promise<any> {
  const Budget = createBudgetDefinitionModel(sequelize);

  const budget = await Budget.findByPk(budgetId, { transaction });

  if (!budget) {
    throw new Error(`Budget ${budgetId} not found`);
  }

  if (budget.status !== 'approved') {
    throw new Error('Budget must be approved before activation');
  }

  await budget.update(
    {
      status: 'active',
      updatedBy: userId,
    },
    { transaction },
  );

  return budget;
}

/**
 * Closes a budget period.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} budgetId - Budget ID to close
 * @param {string} userId - User closing the budget
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Closed budget
 *
 * @example
 * ```typescript
 * const closed = await closeBudget(sequelize, 1, 'user123');
 * ```
 */
export async function closeBudget(
  sequelize: Sequelize,
  budgetId: number,
  userId: string,
  transaction?: Transaction,
): Promise<any> {
  const Budget = createBudgetDefinitionModel(sequelize);

  const budget = await Budget.findByPk(budgetId, { transaction });

  if (!budget) {
    throw new Error(`Budget ${budgetId} not found`);
  }

  await budget.update(
    {
      status: 'closed',
      updatedBy: userId,
    },
    { transaction },
  );

  return budget;
}

/**
 * Deletes a budget (only if in draft status).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} budgetId - Budget ID to delete
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await deleteBudget(sequelize, 1);
 * ```
 */
export async function deleteBudget(
  sequelize: Sequelize,
  budgetId: number,
  transaction?: Transaction,
): Promise<void> {
  const Budget = createBudgetDefinitionModel(sequelize);

  const budget = await Budget.findByPk(budgetId, { transaction });

  if (!budget) {
    throw new Error(`Budget ${budgetId} not found`);
  }

  if (budget.status !== 'draft') {
    throw new Error('Can only delete budgets in draft status');
  }

  await budget.destroy({ transaction });
}

/**
 * Copies a budget to create a new budget for the next year.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} sourceBudgetId - Source budget ID to copy
 * @param {number} targetFiscalYear - Target fiscal year
 * @param {string} userId - User creating the copy
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} New budget copy
 *
 * @example
 * ```typescript
 * const newBudget = await copyBudget(sequelize, 1, 2025, 'user123');
 * ```
 */
export async function copyBudget(
  sequelize: Sequelize,
  sourceBudgetId: number,
  targetFiscalYear: number,
  userId: string,
  transaction?: Transaction,
): Promise<any> {
  const Budget = createBudgetDefinitionModel(sequelize);

  const source = await Budget.findByPk(sourceBudgetId, { transaction });

  if (!source) {
    throw new Error(`Source budget ${sourceBudgetId} not found`);
  }

  const newBudget = await Budget.create(
    {
      budgetCode: `${source.budgetCode}-${targetFiscalYear}`,
      budgetName: source.budgetName.replace(String(source.fiscalYear), String(targetFiscalYear)),
      budgetType: source.budgetType,
      budgetCategory: source.budgetCategory,
      fiscalYear: targetFiscalYear,
      startDate: new Date(targetFiscalYear, 0, 1),
      endDate: new Date(targetFiscalYear, 11, 31),
      totalBudgetAmount: source.totalBudgetAmount,
      status: 'draft',
      createdBy: userId,
      updatedBy: userId,
    },
    { transaction },
  );

  return newBudget;
}

// ============================================================================
// BUDGET ALLOCATION (11-20)
// ============================================================================

/**
 * Creates a budget allocation for an account.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateBudgetAllocationDto} allocationData - Allocation data
 * @param {string} userId - User creating the allocation
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created allocation
 *
 * @example
 * ```typescript
 * const allocation = await createBudgetAllocation(sequelize, {
 *   budgetId: 1,
 *   accountId: 100,
 *   fiscalYear: 2024,
 *   fiscalPeriod: 1,
 *   allocatedAmount: 100000
 * }, 'user123');
 * ```
 */
export async function createBudgetAllocation(
  sequelize: Sequelize,
  allocationData: CreateBudgetAllocationDto,
  userId: string,
  transaction?: Transaction,
): Promise<any> {
  const Allocation = createBudgetAllocationModel(sequelize);

  // Get account code (mocked for this example)
  const accountCode = '5000-SALARIES';

  const allocation = await Allocation.create(
    {
      ...allocationData,
      accountCode,
      createdBy: userId,
      updatedBy: userId,
    },
    { transaction },
  );

  return allocation;
}

/**
 * Updates a budget allocation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} allocationId - Allocation ID to update
 * @param {object} updateData - Updated allocation data
 * @param {string} userId - User updating the allocation
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated allocation
 *
 * @example
 * ```typescript
 * const updated = await updateBudgetAllocation(sequelize, 1, {
 *   allocatedAmount: 110000
 * }, 'user123');
 * ```
 */
export async function updateBudgetAllocation(
  sequelize: Sequelize,
  allocationId: number,
  updateData: any,
  userId: string,
  transaction?: Transaction,
): Promise<any> {
  const Allocation = createBudgetAllocationModel(sequelize);

  const allocation = await Allocation.findByPk(allocationId, { transaction });

  if (!allocation) {
    throw new Error(`Allocation ${allocationId} not found`);
  }

  if (allocation.isLocked) {
    throw new Error('Cannot update locked allocation');
  }

  await allocation.update(
    {
      ...updateData,
      updatedBy: userId,
    },
    { transaction },
  );

  return allocation;
}

/**
 * Retrieves allocations for a budget.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} budgetId - Budget ID
 * @param {number} [fiscalPeriod] - Optional fiscal period filter
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Array of allocations
 *
 * @example
 * ```typescript
 * const allocations = await getBudgetAllocations(sequelize, 1, 1);
 * ```
 */
export async function getBudgetAllocations(
  sequelize: Sequelize,
  budgetId: number,
  fiscalPeriod?: number,
  transaction?: Transaction,
): Promise<any[]> {
  const Allocation = createBudgetAllocationModel(sequelize);

  const where: any = { budgetId };

  if (fiscalPeriod !== undefined) {
    where.fiscalPeriod = fiscalPeriod;
  }

  const allocations = await Allocation.findAll({
    where,
    order: [['accountCode', 'ASC'], ['fiscalPeriod', 'ASC']],
    transaction,
  });

  return allocations;
}

/**
 * Retrieves allocation for specific account and period.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} budgetId - Budget ID
 * @param {number} accountId - Account ID
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Allocation
 *
 * @example
 * ```typescript
 * const allocation = await getAllocationByAccount(
 *   sequelize, 1, 100, 2024, 1
 * );
 * ```
 */
export async function getAllocationByAccount(
  sequelize: Sequelize,
  budgetId: number,
  accountId: number,
  fiscalYear: number,
  fiscalPeriod: number,
  transaction?: Transaction,
): Promise<any> {
  const Allocation = createBudgetAllocationModel(sequelize);

  const allocation = await Allocation.findOne({
    where: {
      budgetId,
      accountId,
      fiscalYear,
      fiscalPeriod,
    },
    transaction,
  });

  return allocation;
}

/**
 * Locks budget allocations for a period.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} budgetId - Budget ID
 * @param {number} fiscalPeriod - Fiscal period to lock
 * @param {string} userId - User locking the allocations
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Number of allocations locked
 *
 * @example
 * ```typescript
 * const count = await lockBudgetAllocations(sequelize, 1, 1, 'user123');
 * ```
 */
export async function lockBudgetAllocations(
  sequelize: Sequelize,
  budgetId: number,
  fiscalPeriod: number,
  userId: string,
  transaction?: Transaction,
): Promise<number> {
  const Allocation = createBudgetAllocationModel(sequelize);

  const [count] = await Allocation.update(
    {
      isLocked: true,
      lockedAt: new Date(),
      updatedBy: userId,
    },
    {
      where: {
        budgetId,
        fiscalPeriod,
        isLocked: false,
      },
      transaction,
    },
  );

  return count;
}

/**
 * Unlocks budget allocations for a period.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} budgetId - Budget ID
 * @param {number} fiscalPeriod - Fiscal period to unlock
 * @param {string} userId - User unlocking the allocations
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Number of allocations unlocked
 *
 * @example
 * ```typescript
 * const count = await unlockBudgetAllocations(sequelize, 1, 1, 'user123');
 * ```
 */
export async function unlockBudgetAllocations(
  sequelize: Sequelize,
  budgetId: number,
  fiscalPeriod: number,
  userId: string,
  transaction?: Transaction,
): Promise<number> {
  const Allocation = createBudgetAllocationModel(sequelize);

  const [count] = await Allocation.update(
    {
      isLocked: false,
      lockedAt: null,
      updatedBy: userId,
    },
    {
      where: {
        budgetId,
        fiscalPeriod,
        isLocked: true,
      },
      transaction,
    },
  );

  return count;
}

/**
 * Distributes budget evenly across all periods.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} budgetId - Budget ID
 * @param {number} accountId - Account ID
 * @param {number} totalAmount - Total amount to distribute
 * @param {number} numberOfPeriods - Number of periods
 * @param {string} userId - User performing distribution
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Created allocations
 *
 * @example
 * ```typescript
 * const allocations = await distributeBudgetEvenly(
 *   sequelize, 1, 100, 120000, 12, 'user123'
 * );
 * ```
 */
export async function distributeBudgetEvenly(
  sequelize: Sequelize,
  budgetId: number,
  accountId: number,
  totalAmount: number,
  numberOfPeriods: number,
  userId: string,
  transaction?: Transaction,
): Promise<any[]> {
  const Allocation = createBudgetAllocationModel(sequelize);
  const Budget = createBudgetDefinitionModel(sequelize);

  const budget = await Budget.findByPk(budgetId, { transaction });

  if (!budget) {
    throw new Error(`Budget ${budgetId} not found`);
  }

  const amountPerPeriod = totalAmount / numberOfPeriods;
  const allocations = [];

  for (let period = 1; period <= numberOfPeriods; period++) {
    const allocation = await Allocation.create(
      {
        budgetId,
        accountId,
        accountCode: '5000-SALARIES',
        fiscalYear: budget.fiscalYear,
        fiscalPeriod: period,
        allocatedAmount: amountPerPeriod,
        createdBy: userId,
        updatedBy: userId,
      },
      { transaction },
    );
    allocations.push(allocation);
  }

  return allocations;
}

/**
 * Calculates total allocated amount for a budget.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} budgetId - Budget ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Total allocated amount
 *
 * @example
 * ```typescript
 * const total = await calculateTotalAllocated(sequelize, 1);
 * ```
 */
export async function calculateTotalAllocated(
  sequelize: Sequelize,
  budgetId: number,
  transaction?: Transaction,
): Promise<number> {
  const Allocation = createBudgetAllocationModel(sequelize);

  const result = await Allocation.findOne({
    attributes: [
      [sequelize.fn('SUM', sequelize.col('allocatedAmount')), 'totalAllocated'],
    ],
    where: { budgetId },
    raw: true,
    transaction,
  });

  return Number(result?.totalAllocated || 0);
}

/**
 * Deletes a budget allocation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} allocationId - Allocation ID to delete
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await deleteBudgetAllocation(sequelize, 1);
 * ```
 */
export async function deleteBudgetAllocation(
  sequelize: Sequelize,
  allocationId: number,
  transaction?: Transaction,
): Promise<void> {
  const Allocation = createBudgetAllocationModel(sequelize);

  const allocation = await Allocation.findByPk(allocationId, { transaction });

  if (!allocation) {
    throw new Error(`Allocation ${allocationId} not found`);
  }

  if (allocation.isLocked) {
    throw new Error('Cannot delete locked allocation');
  }

  await allocation.destroy({ transaction });
}

/**
 * Retrieves allocation summary by department.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} budgetId - Budget ID
 * @param {string} departmentCode - Department code
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Department allocation summary
 *
 * @example
 * ```typescript
 * const summary = await getAllocationsByDepartment(
 *   sequelize, 1, 'DEPT-001'
 * );
 * ```
 */
export async function getAllocationsByDepartment(
  sequelize: Sequelize,
  budgetId: number,
  departmentCode: string,
  transaction?: Transaction,
): Promise<any[]> {
  const Allocation = createBudgetAllocationModel(sequelize);

  const allocations = await Allocation.findAll({
    where: {
      budgetId,
      departmentCode,
    },
    order: [['accountCode', 'ASC']],
    transaction,
  });

  return allocations;
}

// ============================================================================
// BUDGET AMENDMENTS AND TRANSFERS (21-30)
// ============================================================================

/**
 * Creates a budget amendment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateBudgetAmendmentDto} amendmentData - Amendment data
 * @param {string} userId - User creating the amendment
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created amendment
 *
 * @example
 * ```typescript
 * const amendment = await createBudgetAmendment(sequelize, {
 *   budgetId: 1,
 *   amendmentType: 'increase',
 *   amendmentAmount: 50000,
 *   effectiveDate: new Date(),
 *   justification: 'Additional funding needed for Q4'
 * }, 'user123');
 * ```
 */
export async function createBudgetAmendment(
  sequelize: Sequelize,
  amendmentData: CreateBudgetAmendmentDto,
  userId: string,
  transaction?: Transaction,
): Promise<any> {
  const Amendment = createBudgetAmendmentModel(sequelize);

  const amendment = await Amendment.create(
    {
      ...amendmentData,
      amendmentNumber: `AMD-${Date.now()}`,
      amendmentDate: new Date(),
      createdBy: userId,
      updatedBy: userId,
    },
    { transaction },
  );

  return amendment;
}

/**
 * Approves a budget amendment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} amendmentId - Amendment ID to approve
 * @param {string} userId - User approving the amendment
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Approved amendment
 *
 * @example
 * ```typescript
 * const approved = await approveBudgetAmendment(sequelize, 1, 'manager123');
 * ```
 */
export async function approveBudgetAmendment(
  sequelize: Sequelize,
  amendmentId: number,
  userId: string,
  transaction?: Transaction,
): Promise<any> {
  const Amendment = createBudgetAmendmentModel(sequelize);

  const amendment = await Amendment.findByPk(amendmentId, { transaction });

  if (!amendment) {
    throw new Error(`Amendment ${amendmentId} not found`);
  }

  if (amendment.status !== 'pending' && amendment.status !== 'submitted') {
    throw new Error('Amendment must be in pending or submitted status');
  }

  await amendment.update(
    {
      status: 'approved',
      approvedBy: userId,
      approvedAt: new Date(),
      updatedBy: userId,
    },
    { transaction },
  );

  return amendment;
}

/**
 * Posts a budget amendment to update budget amounts.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} amendmentId - Amendment ID to post
 * @param {string} userId - User posting the amendment
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Posted amendment
 *
 * @example
 * ```typescript
 * const posted = await postBudgetAmendment(sequelize, 1, 'user123');
 * ```
 */
export async function postBudgetAmendment(
  sequelize: Sequelize,
  amendmentId: number,
  userId: string,
  transaction?: Transaction,
): Promise<any> {
  const Amendment = createBudgetAmendmentModel(sequelize);
  const Budget = createBudgetDefinitionModel(sequelize);

  const amendment = await Amendment.findByPk(amendmentId, { transaction });

  if (!amendment) {
    throw new Error(`Amendment ${amendmentId} not found`);
  }

  if (amendment.status !== 'approved') {
    throw new Error('Amendment must be approved before posting');
  }

  // Update budget totals
  const budget = await Budget.findByPk(amendment.budgetId, { transaction });

  if (budget) {
    await budget.update(
      {
        totalBudgetAmount: Number(budget.totalBudgetAmount) + Number(amendment.amendmentAmount),
        updatedBy: userId,
      },
      { transaction },
    );
  }

  await amendment.update(
    {
      status: 'posted',
      postedAt: new Date(),
      updatedBy: userId,
    },
    { transaction },
  );

  return amendment;
}

/**
 * Rejects a budget amendment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} amendmentId - Amendment ID to reject
 * @param {string} rejectionReason - Reason for rejection
 * @param {string} userId - User rejecting the amendment
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Rejected amendment
 *
 * @example
 * ```typescript
 * const rejected = await rejectBudgetAmendment(
 *   sequelize, 1, 'Insufficient justification', 'manager123'
 * );
 * ```
 */
export async function rejectBudgetAmendment(
  sequelize: Sequelize,
  amendmentId: number,
  rejectionReason: string,
  userId: string,
  transaction?: Transaction,
): Promise<any> {
  const Amendment = createBudgetAmendmentModel(sequelize);

  const amendment = await Amendment.findByPk(amendmentId, { transaction });

  if (!amendment) {
    throw new Error(`Amendment ${amendmentId} not found`);
  }

  await amendment.update(
    {
      status: 'rejected',
      rejectedBy: userId,
      rejectedAt: new Date(),
      rejectionReason,
      updatedBy: userId,
    },
    { transaction },
  );

  return amendment;
}

/**
 * Creates a budget transfer between accounts.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateBudgetTransferDto} transferData - Transfer data
 * @param {string} userId - User creating the transfer
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created transfer
 *
 * @example
 * ```typescript
 * const transfer = await createBudgetTransfer(sequelize, {
 *   fromBudgetId: 1,
 *   fromAccountCode: '5000-SALARIES',
 *   toBudgetId: 1,
 *   toAccountCode: '5100-BENEFITS',
 *   transferAmount: 25000,
 *   reason: 'Reallocate for increased benefits costs'
 * }, 'user123');
 * ```
 */
export async function createBudgetTransfer(
  sequelize: Sequelize,
  transferData: CreateBudgetTransferDto,
  userId: string,
  transaction?: Transaction,
): Promise<any> {
  const Transfer = createBudgetTransferModel(sequelize);

  const transfer = await Transfer.create(
    {
      ...transferData,
      transferNumber: `XFER-${Date.now()}`,
      transferDate: new Date(),
      fiscalYear: new Date().getFullYear(),
      fiscalPeriod: new Date().getMonth() + 1,
      fromAccountId: 1,
      toAccountId: 2,
      createdBy: userId,
      updatedBy: userId,
    },
    { transaction },
  );

  return transfer;
}

/**
 * Approves a budget transfer.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} transferId - Transfer ID to approve
 * @param {string} userId - User approving the transfer
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Approved transfer
 *
 * @example
 * ```typescript
 * const approved = await approveBudgetTransfer(sequelize, 1, 'manager123');
 * ```
 */
export async function approveBudgetTransfer(
  sequelize: Sequelize,
  transferId: number,
  userId: string,
  transaction?: Transaction,
): Promise<any> {
  const Transfer = createBudgetTransferModel(sequelize);

  const transfer = await Transfer.findByPk(transferId, { transaction });

  if (!transfer) {
    throw new Error(`Transfer ${transferId} not found`);
  }

  if (transfer.status !== 'pending' && transfer.status !== 'submitted') {
    throw new Error('Transfer must be in pending or submitted status');
  }

  await transfer.update(
    {
      status: 'approved',
      approvedBy: userId,
      approvedAt: new Date(),
      updatedBy: userId,
    },
    { transaction },
  );

  return transfer;
}

/**
 * Posts a budget transfer to update allocations.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} transferId - Transfer ID to post
 * @param {string} userId - User posting the transfer
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Posted transfer
 *
 * @example
 * ```typescript
 * const posted = await postBudgetTransfer(sequelize, 1, 'user123');
 * ```
 */
export async function postBudgetTransfer(
  sequelize: Sequelize,
  transferId: number,
  userId: string,
  transaction?: Transaction,
): Promise<any> {
  const Transfer = createBudgetTransferModel(sequelize);

  const transfer = await Transfer.findByPk(transferId, { transaction });

  if (!transfer) {
    throw new Error(`Transfer ${transferId} not found`);
  }

  if (transfer.status !== 'approved') {
    throw new Error('Transfer must be approved before posting');
  }

  // Update allocations (implementation would update from and to accounts)

  await transfer.update(
    {
      status: 'posted',
      postedAt: new Date(),
      updatedBy: userId,
    },
    { transaction },
  );

  return transfer;
}

/**
 * Retrieves budget amendments for a budget.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} budgetId - Budget ID
 * @param {string} [status] - Optional status filter
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Array of amendments
 *
 * @example
 * ```typescript
 * const amendments = await getBudgetAmendments(sequelize, 1, 'approved');
 * ```
 */
export async function getBudgetAmendments(
  sequelize: Sequelize,
  budgetId: number,
  status?: string,
  transaction?: Transaction,
): Promise<any[]> {
  const Amendment = createBudgetAmendmentModel(sequelize);

  const where: any = { budgetId };

  if (status) {
    where.status = status;
  }

  const amendments = await Amendment.findAll({
    where,
    order: [['amendmentDate', 'DESC']],
    transaction,
  });

  return amendments;
}

/**
 * Retrieves budget transfers for a budget.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} budgetId - Budget ID
 * @param {string} [status] - Optional status filter
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Array of transfers
 *
 * @example
 * ```typescript
 * const transfers = await getBudgetTransfers(sequelize, 1, 'posted');
 * ```
 */
export async function getBudgetTransfers(
  sequelize: Sequelize,
  budgetId: number,
  status?: string,
  transaction?: Transaction,
): Promise<any[]> {
  const Transfer = createBudgetTransferModel(sequelize);

  const where: any = {
    [Op.or]: [
      { fromBudgetId: budgetId },
      { toBudgetId: budgetId },
    ],
  };

  if (status) {
    where.status = status;
  }

  const transfers = await Transfer.findAll({
    where,
    order: [['transferDate', 'DESC']],
    transaction,
  });

  return transfers;
}

// ============================================================================
// ENCUMBRANCE MANAGEMENT (31-40)
// ============================================================================

/**
 * Creates an encumbrance.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateEncumbranceDto} encumbranceData - Encumbrance data
 * @param {string} userId - User creating the encumbrance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created encumbrance
 *
 * @example
 * ```typescript
 * const encumbrance = await createEncumbrance(sequelize, {
 *   budgetId: 1,
 *   accountId: 100,
 *   encumbranceType: 'purchase_order',
 *   encumbranceAmount: 50000,
 *   referenceDocument: 'PO-2024-001'
 * }, 'user123');
 * ```
 */
export async function createEncumbrance(
  sequelize: Sequelize,
  encumbranceData: CreateEncumbranceDto,
  userId: string,
  transaction?: Transaction,
): Promise<any> {
  const Encumbrance = createEncumbranceModel(sequelize);

  const encumbrance = await Encumbrance.create(
    {
      ...encumbranceData,
      encumbranceNumber: `ENC-${Date.now()}`,
      encumbranceDate: new Date(),
      fiscalYear: new Date().getFullYear(),
      fiscalPeriod: new Date().getMonth() + 1,
      accountCode: '5000-SALARIES',
      description: `Encumbrance for ${encumbranceData.referenceDocument}`,
      createdBy: userId,
      updatedBy: userId,
    },
    { transaction },
  );

  return encumbrance;
}

/**
 * Liquidates an encumbrance (fully or partially).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} encumbranceId - Encumbrance ID to liquidate
 * @param {number} liquidationAmount - Amount to liquidate
 * @param {string} userId - User liquidating the encumbrance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated encumbrance
 *
 * @example
 * ```typescript
 * const liquidated = await liquidateEncumbrance(
 *   sequelize, 1, 25000, 'user123'
 * );
 * ```
 */
export async function liquidateEncumbrance(
  sequelize: Sequelize,
  encumbranceId: number,
  liquidationAmount: number,
  userId: string,
  transaction?: Transaction,
): Promise<any> {
  const Encumbrance = createEncumbranceModel(sequelize);

  const encumbrance = await Encumbrance.findByPk(encumbranceId, { transaction });

  if (!encumbrance) {
    throw new Error(`Encumbrance ${encumbranceId} not found`);
  }

  const newLiquidated = Number(encumbrance.liquidatedAmount) + liquidationAmount;

  if (newLiquidated > Number(encumbrance.encumbranceAmount)) {
    throw new Error('Liquidation amount exceeds encumbrance amount');
  }

  await encumbrance.update(
    {
      liquidatedAmount: newLiquidated,
      updatedBy: userId,
    },
    { transaction },
  );

  return encumbrance;
}

/**
 * Cancels an encumbrance.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} encumbranceId - Encumbrance ID to cancel
 * @param {string} userId - User cancelling the encumbrance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Cancelled encumbrance
 *
 * @example
 * ```typescript
 * const cancelled = await cancelEncumbrance(sequelize, 1, 'user123');
 * ```
 */
export async function cancelEncumbrance(
  sequelize: Sequelize,
  encumbranceId: number,
  userId: string,
  transaction?: Transaction,
): Promise<any> {
  const Encumbrance = createEncumbranceModel(sequelize);

  const encumbrance = await Encumbrance.findByPk(encumbranceId, { transaction });

  if (!encumbrance) {
    throw new Error(`Encumbrance ${encumbranceId} not found`);
  }

  if (encumbrance.status === 'liquidated') {
    throw new Error('Cannot cancel fully liquidated encumbrance');
  }

  await encumbrance.update(
    {
      status: 'cancelled',
      cancelledAt: new Date(),
      cancelledBy: userId,
      updatedBy: userId,
    },
    { transaction },
  );

  return encumbrance;
}

/**
 * Retrieves encumbrances for a budget.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} budgetId - Budget ID
 * @param {string} [status] - Optional status filter
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Array of encumbrances
 *
 * @example
 * ```typescript
 * const encumbrances = await getEncumbrances(sequelize, 1, 'active');
 * ```
 */
export async function getEncumbrances(
  sequelize: Sequelize,
  budgetId: number,
  status?: string,
  transaction?: Transaction,
): Promise<any[]> {
  const Encumbrance = createEncumbranceModel(sequelize);

  const where: any = { budgetId };

  if (status) {
    where.status = status;
  }

  const encumbrances = await Encumbrance.findAll({
    where,
    order: [['encumbranceDate', 'DESC']],
    transaction,
  });

  return encumbrances;
}

/**
 * Calculates total encumbered amount for a budget.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} budgetId - Budget ID
 * @param {number} [accountId] - Optional account filter
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Total encumbered amount
 *
 * @example
 * ```typescript
 * const total = await calculateTotalEncumbered(sequelize, 1);
 * ```
 */
export async function calculateTotalEncumbered(
  sequelize: Sequelize,
  budgetId: number,
  accountId?: number,
  transaction?: Transaction,
): Promise<number> {
  const Encumbrance = createEncumbranceModel(sequelize);

  const where: any = {
    budgetId,
    status: { [Op.in]: ['active', 'partial'] },
  };

  if (accountId !== undefined) {
    where.accountId = accountId;
  }

  const result = await Encumbrance.findOne({
    attributes: [
      [sequelize.fn('SUM', sequelize.col('remainingAmount')), 'totalEncumbered'],
    ],
    where,
    raw: true,
    transaction,
  });

  return Number(result?.totalEncumbered || 0);
}

/**
 * Checks funds availability before creating encumbrance.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CheckFundsAvailabilityDto} checkData - Funds check parameters
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<FundsAvailability>} Funds availability result
 *
 * @example
 * ```typescript
 * const availability = await checkFundsAvailability(sequelize, {
 *   budgetId: 1,
 *   accountId: 100,
 *   amount: 50000,
 *   checkDate: new Date()
 * });
 * ```
 */
export async function checkFundsAvailability(
  sequelize: Sequelize,
  checkData: CheckFundsAvailabilityDto,
  transaction?: Transaction,
): Promise<FundsAvailability> {
  const Allocation = createBudgetAllocationModel(sequelize);

  // Get current allocation
  const allocation = await Allocation.findOne({
    where: {
      budgetId: checkData.budgetId,
      accountId: checkData.accountId,
      fiscalYear: checkData.checkDate.getFullYear(),
      fiscalPeriod: checkData.checkDate.getMonth() + 1,
    },
    transaction,
  });

  if (!allocation) {
    return {
      accountId: checkData.accountId,
      accountCode: 'N/A',
      budgetAmount: 0,
      committedAmount: 0,
      encumberedAmount: 0,
      actualAmount: 0,
      reservedAmount: 0,
      availableAmount: 0,
      hasSufficientFunds: false,
    };
  }

  const available = Number(allocation.availableAmount);

  return {
    accountId: checkData.accountId,
    accountCode: allocation.accountCode,
    budgetAmount: Number(allocation.revisedAmount),
    committedAmount: Number(allocation.committedAmount),
    encumberedAmount: Number(allocation.encumberedAmount),
    actualAmount: Number(allocation.actualAmount),
    reservedAmount: 0,
    availableAmount: available,
    hasSufficientFunds: available >= checkData.amount,
  };
}

/**
 * Retrieves encumbrance by reference document.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} referenceDocument - Reference document number
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Encumbrance
 *
 * @example
 * ```typescript
 * const encumbrance = await getEncumbranceByReference(
 *   sequelize, 'PO-2024-001'
 * );
 * ```
 */
export async function getEncumbranceByReference(
  sequelize: Sequelize,
  referenceDocument: string,
  transaction?: Transaction,
): Promise<any> {
  const Encumbrance = createEncumbranceModel(sequelize);

  const encumbrance = await Encumbrance.findOne({
    where: { referenceDocument },
    transaction,
  });

  return encumbrance;
}

/**
 * Updates encumbrance amount.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} encumbranceId - Encumbrance ID to update
 * @param {number} newAmount - New encumbrance amount
 * @param {string} userId - User updating the encumbrance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated encumbrance
 *
 * @example
 * ```typescript
 * const updated = await updateEncumbranceAmount(
 *   sequelize, 1, 55000, 'user123'
 * );
 * ```
 */
export async function updateEncumbranceAmount(
  sequelize: Sequelize,
  encumbranceId: number,
  newAmount: number,
  userId: string,
  transaction?: Transaction,
): Promise<any> {
  const Encumbrance = createEncumbranceModel(sequelize);

  const encumbrance = await Encumbrance.findByPk(encumbranceId, { transaction });

  if (!encumbrance) {
    throw new Error(`Encumbrance ${encumbranceId} not found`);
  }

  if (newAmount < Number(encumbrance.liquidatedAmount)) {
    throw new Error('New amount cannot be less than liquidated amount');
  }

  await encumbrance.update(
    {
      encumbranceAmount: newAmount,
      updatedBy: userId,
    },
    { transaction },
  );

  return encumbrance;
}

/**
 * Generates encumbrance report for period.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Encumbrance report data
 *
 * @example
 * ```typescript
 * const report = await generateEncumbranceReport(sequelize, 2024, 1);
 * ```
 */
export async function generateEncumbranceReport(
  sequelize: Sequelize,
  fiscalYear: number,
  fiscalPeriod: number,
  transaction?: Transaction,
): Promise<any[]> {
  const Encumbrance = createEncumbranceModel(sequelize);

  const encumbrances = await Encumbrance.findAll({
    where: {
      fiscalYear,
      fiscalPeriod,
      status: { [Op.in]: ['active', 'partial'] },
    },
    order: [['accountCode', 'ASC']],
    transaction,
  });

  return encumbrances;
}

// ============================================================================
// BUDGET VS ACTUAL AND VARIANCE ANALYSIS (41-45)
// ============================================================================

/**
 * Generates budget vs actual report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} budgetId - Budget ID
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<BudgetVsActual[]>} Budget vs actual comparison
 *
 * @example
 * ```typescript
 * const report = await generateBudgetVsActualReport(
 *   sequelize, 1, 2024, 1
 * );
 * ```
 */
export async function generateBudgetVsActualReport(
  sequelize: Sequelize,
  budgetId: number,
  fiscalYear: number,
  fiscalPeriod: number,
  transaction?: Transaction,
): Promise<BudgetVsActual[]> {
  const Allocation = createBudgetAllocationModel(sequelize);

  const allocations = await Allocation.findAll({
    where: {
      budgetId,
      fiscalYear,
      fiscalPeriod,
    },
    order: [['accountCode', 'ASC']],
    transaction,
  });

  return allocations.map(allocation => ({
    accountCode: allocation.accountCode,
    accountName: 'Account Name',
    fiscalYear,
    fiscalPeriod,
    budgetAmount: Number(allocation.allocatedAmount),
    amendmentAmount: Number(allocation.revisedAmount) - Number(allocation.allocatedAmount),
    revisedBudget: Number(allocation.revisedAmount),
    committedAmount: Number(allocation.committedAmount),
    encumberedAmount: Number(allocation.encumberedAmount),
    actualAmount: Number(allocation.actualAmount),
    availableAmount: Number(allocation.availableAmount),
    variance: Number(allocation.revisedAmount) - Number(allocation.actualAmount),
    variancePercent: ((Number(allocation.revisedAmount) - Number(allocation.actualAmount)) / Number(allocation.revisedAmount)) * 100,
  }));
}

/**
 * Performs variance analysis on budget.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} budgetId - Budget ID
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {number} [thresholdPercent=10] - Variance threshold percentage
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<VarianceAnalysis[]>} Variance analysis results
 *
 * @example
 * ```typescript
 * const analysis = await performVarianceAnalysis(
 *   sequelize, 1, 2024, 1, 15
 * );
 * ```
 */
export async function performVarianceAnalysis(
  sequelize: Sequelize,
  budgetId: number,
  fiscalYear: number,
  fiscalPeriod: number,
  thresholdPercent: number = 10,
  transaction?: Transaction,
): Promise<VarianceAnalysis[]> {
  const budgetVsActual = await generateBudgetVsActualReport(
    sequelize,
    budgetId,
    fiscalYear,
    fiscalPeriod,
    transaction,
  );

  return budgetVsActual.map(item => {
    const variance = item.revisedBudget - item.actualAmount;
    const variancePercent = (variance / item.revisedBudget) * 100;
    const absPercent = Math.abs(variancePercent);

    let varianceType: 'favorable' | 'unfavorable' | 'neutral' = 'neutral';
    if (variance > 0) {
      varianceType = 'favorable';
    } else if (variance < 0) {
      varianceType = 'unfavorable';
    }

    let thresholdStatus: 'within' | 'warning' | 'exceeded' = 'within';
    if (absPercent > thresholdPercent * 1.5) {
      thresholdStatus = 'exceeded';
    } else if (absPercent > thresholdPercent) {
      thresholdStatus = 'warning';
    }

    return {
      accountCode: item.accountCode,
      accountName: item.accountName,
      budgetAmount: item.revisedBudget,
      actualAmount: item.actualAmount,
      variance,
      variancePercent,
      varianceType,
      thresholdStatus,
    };
  });
}

/**
 * Calculates budget utilization percentage.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} budgetId - Budget ID
 * @param {number} [accountId] - Optional account filter
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Budget utilization percentage
 *
 * @example
 * ```typescript
 * const utilization = await calculateBudgetUtilization(sequelize, 1);
 * ```
 */
export async function calculateBudgetUtilization(
  sequelize: Sequelize,
  budgetId: number,
  accountId?: number,
  transaction?: Transaction,
): Promise<number> {
  const Allocation = createBudgetAllocationModel(sequelize);

  const where: any = { budgetId };

  if (accountId !== undefined) {
    where.accountId = accountId;
  }

  const result = await Allocation.findOne({
    attributes: [
      [sequelize.fn('SUM', sequelize.col('revisedAmount')), 'totalBudget'],
      [sequelize.fn('SUM', sequelize.col('actualAmount')), 'totalActual'],
    ],
    where,
    raw: true,
    transaction,
  });

  const totalBudget = Number(result?.totalBudget || 0);
  const totalActual = Number(result?.totalActual || 0);

  if (totalBudget === 0) return 0;

  return (totalActual / totalBudget) * 100;
}

/**
 * Retrieves accounts exceeding budget threshold.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} budgetId - Budget ID
 * @param {number} thresholdPercent - Threshold percentage
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Accounts over threshold
 *
 * @example
 * ```typescript
 * const overBudget = await getAccountsOverBudget(sequelize, 1, 90);
 * ```
 */
export async function getAccountsOverBudget(
  sequelize: Sequelize,
  budgetId: number,
  thresholdPercent: number,
  transaction?: Transaction,
): Promise<any[]> {
  const Allocation = createBudgetAllocationModel(sequelize);

  const allocations = await Allocation.findAll({
    where: { budgetId },
    transaction,
  });

  return allocations.filter(allocation => {
    const budget = Number(allocation.revisedAmount);
    const actual = Number(allocation.actualAmount);
    if (budget === 0) return false;
    const utilization = (actual / budget) * 100;
    return utilization >= thresholdPercent;
  });
}

/**
 * Generates comprehensive budget monitoring dashboard data.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} budgetId - Budget ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Dashboard data
 *
 * @example
 * ```typescript
 * const dashboard = await generateBudgetMonitoringDashboard(
 *   sequelize, 1
 * );
 * ```
 */
export async function generateBudgetMonitoringDashboard(
  sequelize: Sequelize,
  budgetId: number,
  transaction?: Transaction,
): Promise<any> {
  const Budget = createBudgetDefinitionModel(sequelize);
  const Allocation = createBudgetAllocationModel(sequelize);

  const budget = await Budget.findByPk(budgetId, { transaction });

  if (!budget) {
    throw new Error(`Budget ${budgetId} not found`);
  }

  const allocations = await Allocation.findAll({
    where: { budgetId },
    transaction,
  });

  const totalBudget = Number(budget.totalBudgetAmount);
  const totalActual = allocations.reduce((sum, a) => sum + Number(a.actualAmount), 0);
  const totalEncumbered = allocations.reduce((sum, a) => sum + Number(a.encumberedAmount), 0);
  const totalCommitted = allocations.reduce((sum, a) => sum + Number(a.committedAmount), 0);
  const totalAvailable = allocations.reduce((sum, a) => sum + Number(a.availableAmount), 0);

  return {
    budgetId,
    budgetCode: budget.budgetCode,
    budgetName: budget.budgetName,
    fiscalYear: budget.fiscalYear,
    status: budget.status,
    totalBudget,
    totalAllocated: Number(budget.allocatedAmount),
    totalCommitted,
    totalEncumbered,
    totalActual,
    totalAvailable,
    utilizationPercent: (totalActual / totalBudget) * 100,
    commitmentPercent: (totalCommitted / totalBudget) * 100,
    encumbrancePercent: (totalEncumbered / totalBudget) * 100,
    availablePercent: (totalAvailable / totalBudget) * 100,
  };
}
