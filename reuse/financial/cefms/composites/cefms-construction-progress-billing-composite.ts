/**
 * LOC: CEFMSCPB001
 * File: /reuse/financial/cefms/composites/cefms-construction-progress-billing-composite.ts
 *
 * UPSTREAM (imports from):
 *   - ../../../government/project-program-management-kit.ts
 *   - ../../../government/procurement-contract-management-kit.ts
 *   - ../../../government/capital-asset-planning-kit.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend CEFMS construction billing services
 *   - USACE project management systems
 *   - Progress payment modules
 */

/**
 * File: /reuse/financial/cefms/composites/cefms-construction-progress-billing-composite.ts
 * Locator: WC-CEFMS-CPB-001
 * Purpose: USACE CEFMS Construction Progress Billing - contracts, progress billing, percentage-of-completion, retainage, change orders, milestone billing
 *
 * Upstream: Composes utilities from government project and procurement kits
 * Downstream: ../../../backend/cefms/*, Construction controllers, billing processors, revenue recognition
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 44+ composite functions for USACE CEFMS construction progress billing operations
 *
 * LLM Context: Production-ready USACE CEFMS construction progress billing system.
 * Comprehensive construction contract lifecycle management, progress billing with AIA G702/G703 formats,
 * percentage-of-completion revenue recognition, cost-to-cost methods, retainage tracking and release,
 * change order processing, milestone-based billing, earned value management, contract performance metrics,
 * payment application workflows, subcontractor billing, owner pay applications, GAAP/GASB compliance for
 * long-term construction contracts, and comprehensive audit trails for all billing transactions.
 */

import { Model, DataTypes, Sequelize, Transaction, Op } from 'sequelize';
import { Injectable } from '@nestjs/common';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface ConstructionContractData {
  contractId: string;
  contractNumber: string;
  contractName: string;
  contractType: 'lump_sum' | 'unit_price' | 'cost_plus' | 'time_and_materials' | 'gmp';
  contractorId: string;
  contractorName: string;
  projectId: string;
  projectName: string;
  originalContractAmount: number;
  currentContractAmount: number;
  startDate: Date;
  completionDate: Date;
  percentComplete: number;
  status: 'active' | 'completed' | 'suspended' | 'terminated';
  fundCode: string;
  departmentCode: string;
  retainageRate: number;
  bondRequired: boolean;
  bondAmount?: number;
}

interface ProgressBillingData {
  billingId: string;
  contractId: string;
  billingPeriod: string;
  billingDate: Date;
  workCompleted: number;
  materialsStored: number;
  totalEarned: number;
  previousBillings: number;
  currentBilling: number;
  retainageWithheld: number;
  netDue: number;
  percentComplete: number;
  status: 'draft' | 'submitted' | 'approved' | 'paid' | 'rejected';
  submittedBy: string;
  approvedBy?: string;
}

interface PaymentApplicationData {
  applicationId: string;
  contractId: string;
  billingId: string;
  applicationNumber: number;
  applicationDate: Date;
  periodEndDate: Date;
  scheduledValue: number;
  workCompleted: number;
  materialsStored: number;
  totalCompletedAndStored: number;
  retainagePercent: number;
  retainageAmount: number;
  totalEarned: number;
  lessRetainage: number;
  totalEarnedLessRetainage: number;
  lessPreviousCertificates: number;
  currentPaymentDue: number;
  balanceToFinish: number;
  status: 'pending' | 'certified' | 'approved' | 'paid';
}

interface ContractRetainageData {
  retainageId: string;
  contractId: string;
  billingId?: string;
  retainageType: 'progress' | 'final' | 'warranty';
  retainageAmount: number;
  retainageRate: number;
  withheldDate: Date;
  releaseEligibleDate?: Date;
  releaseDate?: Date;
  releasedAmount: number;
  status: 'withheld' | 'eligible' | 'released' | 'partial';
  releasedBy?: string;
}

interface ChangeOrderData {
  changeOrderId: string;
  changeOrderNumber: string;
  contractId: string;
  changeOrderDate: Date;
  description: string;
  changeType: 'addition' | 'deletion' | 'modification' | 'time_extension';
  costImpact: number;
  timeImpact: number;
  justification: string;
  requestedBy: string;
  approvedBy?: string;
  approvalDate?: Date;
  status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'executed';
}

interface CostTrackingData {
  costId: string;
  contractId: string;
  costCategory: 'labor' | 'materials' | 'equipment' | 'subcontractor' | 'overhead' | 'other';
  costDate: Date;
  budgetedCost: number;
  actualCost: number;
  committedCost: number;
  variance: number;
  percentOfBudget: number;
  description: string;
  recordedBy: string;
}

interface MilestoneBillingData {
  milestoneId: string;
  contractId: string;
  milestoneName: string;
  milestoneDescription: string;
  milestoneValue: number;
  milestoneWeight: number;
  plannedDate: Date;
  actualDate?: Date;
  status: 'pending' | 'in_progress' | 'completed' | 'verified';
  percentComplete: number;
  billable: boolean;
  billingId?: string;
  approvedBy?: string;
}

interface ContractRevenueData {
  revenueId: string;
  contractId: string;
  fiscalYear: number;
  fiscalPeriod: number;
  recognitionMethod: 'percentage_of_completion' | 'cost_to_cost' | 'milestone' | 'completed_contract';
  totalContractRevenue: number;
  totalEstimatedCosts: number;
  costsIncurred: number;
  percentComplete: number;
  revenueRecognized: number;
  costRecognized: number;
  grossProfit: number;
  grossProfitPercent: number;
  isPosted: boolean;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Sequelize model for Construction Contracts with comprehensive tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ConstructionContract model
 *
 * @example
 * ```typescript
 * const ConstructionContract = createConstructionContractModel(sequelize);
 * const contract = await ConstructionContract.create({
 *   contractId: 'CC-2024-001',
 *   contractNumber: 'USACE-BLD-2024-001',
 *   contractName: 'Administration Building Construction',
 *   contractType: 'lump_sum',
 *   originalContractAmount: 5000000,
 *   startDate: new Date('2024-01-15'),
 *   completionDate: new Date('2025-12-31')
 * });
 * ```
 */
export const createConstructionContractModel = (sequelize: Sequelize) => {
  class ConstructionContract extends Model {
    public id!: string;
    public contractId!: string;
    public contractNumber!: string;
    public contractName!: string;
    public contractType!: string;
    public contractorId!: string;
    public contractorName!: string;
    public projectId!: string;
    public projectName!: string;
    public originalContractAmount!: number;
    public currentContractAmount!: number;
    public startDate!: Date;
    public completionDate!: Date;
    public percentComplete!: number;
    public status!: string;
    public fundCode!: string;
    public departmentCode!: string;
    public retainageRate!: number;
    public bondRequired!: boolean;
    public bondAmount!: number | null;
    public totalBilled!: number;
    public totalPaid!: number;
    public retainageWithheld!: number;
    public changeOrdersTotal!: number;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  ConstructionContract.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      contractId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Contract identifier',
      },
      contractNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Contract number',
      },
      contractName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Contract name',
      },
      contractType: {
        type: DataTypes.ENUM('lump_sum', 'unit_price', 'cost_plus', 'time_and_materials', 'gmp'),
        allowNull: false,
        comment: 'Contract type',
      },
      contractorId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Contractor identifier',
      },
      contractorName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Contractor name',
      },
      projectId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Project identifier',
      },
      projectName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Project name',
      },
      originalContractAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Original contract amount',
        validate: {
          min: 0,
        },
      },
      currentContractAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Current contract amount including change orders',
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Contract start date',
      },
      completionDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Scheduled completion date',
      },
      percentComplete: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Percent complete',
      },
      status: {
        type: DataTypes.ENUM('active', 'completed', 'suspended', 'terminated'),
        allowNull: false,
        defaultValue: 'active',
        comment: 'Contract status',
      },
      fundCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Fund code',
      },
      departmentCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Department code',
      },
      retainageRate: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 10,
        comment: 'Retainage rate percentage',
      },
      bondRequired: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Performance bond required',
      },
      bondAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: true,
        comment: 'Bond amount',
      },
      totalBilled: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Total billed to date',
      },
      totalPaid: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Total paid to date',
      },
      retainageWithheld: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Total retainage withheld',
      },
      changeOrdersTotal: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Total change orders value',
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
      tableName: 'construction_contracts',
      timestamps: true,
      indexes: [
        { fields: ['contractId'], unique: true },
        { fields: ['contractNumber'], unique: true },
        { fields: ['contractorId'] },
        { fields: ['projectId'] },
        { fields: ['status'] },
        { fields: ['fundCode'] },
        { fields: ['departmentCode'] },
      ],
    },
  );

  return ConstructionContract;
};

/**
 * Sequelize model for Progress Billing with period tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ProgressBilling model
 */
export const createProgressBillingModel = (sequelize: Sequelize) => {
  class ProgressBilling extends Model {
    public id!: string;
    public billingId!: string;
    public contractId!: string;
    public billingPeriod!: string;
    public billingDate!: Date;
    public workCompleted!: number;
    public materialsStored!: number;
    public totalEarned!: number;
    public previousBillings!: number;
    public currentBilling!: number;
    public retainageWithheld!: number;
    public netDue!: number;
    public percentComplete!: number;
    public status!: string;
    public submittedBy!: string;
    public approvedBy!: string | null;
    public approvalDate!: Date | null;
    public paymentDate!: Date | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  ProgressBilling.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      billingId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Billing identifier',
      },
      contractId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Contract identifier',
      },
      billingPeriod: {
        type: DataTypes.STRING(20),
        allowNull: false,
        comment: 'Billing period (YYYY-MM)',
      },
      billingDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Billing date',
      },
      workCompleted: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Work completed value',
      },
      materialsStored: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Materials stored on site',
      },
      totalEarned: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Total earned to date',
      },
      previousBillings: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Previous billings total',
      },
      currentBilling: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Current billing amount',
      },
      retainageWithheld: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Retainage withheld this period',
      },
      netDue: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Net amount due',
      },
      percentComplete: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        comment: 'Percent complete',
      },
      status: {
        type: DataTypes.ENUM('draft', 'submitted', 'approved', 'paid', 'rejected'),
        allowNull: false,
        defaultValue: 'draft',
        comment: 'Billing status',
      },
      submittedBy: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Submitted by user',
      },
      approvedBy: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Approved by user',
      },
      approvalDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Approval date',
      },
      paymentDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Payment date',
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
      tableName: 'progress_billings',
      timestamps: true,
      indexes: [
        { fields: ['billingId'], unique: true },
        { fields: ['contractId'] },
        { fields: ['billingPeriod'] },
        { fields: ['status'] },
        { fields: ['billingDate'] },
      ],
    },
  );

  return ProgressBilling;
};

/**
 * Sequelize model for Payment Applications (AIA G702/G703).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} PaymentApplication model
 */
export const createPaymentApplicationModel = (sequelize: Sequelize) => {
  class PaymentApplication extends Model {
    public id!: string;
    public applicationId!: string;
    public contractId!: string;
    public billingId!: string;
    public applicationNumber!: number;
    public applicationDate!: Date;
    public periodEndDate!: Date;
    public scheduledValue!: number;
    public workCompleted!: number;
    public materialsStored!: number;
    public totalCompletedAndStored!: number;
    public retainagePercent!: number;
    public retainageAmount!: number;
    public totalEarned!: number;
    public lessRetainage!: number;
    public totalEarnedLessRetainage!: number;
    public lessPreviousCertificates!: number;
    public currentPaymentDue!: number;
    public balanceToFinish!: number;
    public status!: string;
    public certifiedBy!: string | null;
    public certifiedDate!: Date | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  PaymentApplication.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      applicationId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Application identifier',
      },
      contractId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Contract identifier',
      },
      billingId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Billing identifier',
      },
      applicationNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Application number',
      },
      applicationDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Application date',
      },
      periodEndDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Period end date',
      },
      scheduledValue: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Scheduled value of work',
      },
      workCompleted: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Work completed',
      },
      materialsStored: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Materials stored',
      },
      totalCompletedAndStored: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Total completed and stored',
      },
      retainagePercent: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        comment: 'Retainage percentage',
      },
      retainageAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Retainage amount',
      },
      totalEarned: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Total earned',
      },
      lessRetainage: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Less retainage',
      },
      totalEarnedLessRetainage: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Total earned less retainage',
      },
      lessPreviousCertificates: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Less previous certificates',
      },
      currentPaymentDue: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Current payment due',
      },
      balanceToFinish: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Balance to finish',
      },
      status: {
        type: DataTypes.ENUM('pending', 'certified', 'approved', 'paid'),
        allowNull: false,
        defaultValue: 'pending',
        comment: 'Application status',
      },
      certifiedBy: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Certified by user',
      },
      certifiedDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Certification date',
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
      tableName: 'payment_applications',
      timestamps: true,
      indexes: [
        { fields: ['applicationId'], unique: true },
        { fields: ['contractId'] },
        { fields: ['billingId'] },
        { fields: ['applicationNumber'] },
        { fields: ['status'] },
      ],
    },
  );

  return PaymentApplication;
};

/**
 * Sequelize model for Contract Retainage tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ContractRetainage model
 */
export const createContractRetainageModel = (sequelize: Sequelize) => {
  class ContractRetainage extends Model {
    public id!: string;
    public retainageId!: string;
    public contractId!: string;
    public billingId!: string | null;
    public retainageType!: string;
    public retainageAmount!: number;
    public retainageRate!: number;
    public withheldDate!: Date;
    public releaseEligibleDate!: Date | null;
    public releaseDate!: Date | null;
    public releasedAmount!: number;
    public status!: string;
    public releasedBy!: string | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  ContractRetainage.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      retainageId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Retainage identifier',
      },
      contractId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Contract identifier',
      },
      billingId: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Billing identifier',
      },
      retainageType: {
        type: DataTypes.ENUM('progress', 'final', 'warranty'),
        allowNull: false,
        comment: 'Retainage type',
      },
      retainageAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Retainage amount',
      },
      retainageRate: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        comment: 'Retainage rate',
      },
      withheldDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Date withheld',
      },
      releaseEligibleDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Eligible for release date',
      },
      releaseDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Actual release date',
      },
      releasedAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Amount released',
      },
      status: {
        type: DataTypes.ENUM('withheld', 'eligible', 'released', 'partial'),
        allowNull: false,
        defaultValue: 'withheld',
        comment: 'Retainage status',
      },
      releasedBy: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Released by user',
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
      tableName: 'contract_retainages',
      timestamps: true,
      indexes: [
        { fields: ['retainageId'], unique: true },
        { fields: ['contractId'] },
        { fields: ['billingId'] },
        { fields: ['status'] },
        { fields: ['releaseEligibleDate'] },
      ],
    },
  );

  return ContractRetainage;
};

/**
 * Sequelize model for Change Orders with approval workflow.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ChangeOrder model
 */
export const createChangeOrderModel = (sequelize: Sequelize) => {
  class ChangeOrder extends Model {
    public id!: string;
    public changeOrderId!: string;
    public changeOrderNumber!: string;
    public contractId!: string;
    public changeOrderDate!: Date;
    public description!: string;
    public changeType!: string;
    public costImpact!: number;
    public timeImpact!: number;
    public justification!: string;
    public requestedBy!: string;
    public approvedBy!: string | null;
    public approvalDate!: Date | null;
    public status!: string;
    public executionDate!: Date | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  ChangeOrder.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      changeOrderId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Change order identifier',
      },
      changeOrderNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Change order number',
      },
      contractId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Contract identifier',
      },
      changeOrderDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Change order date',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Change order description',
      },
      changeType: {
        type: DataTypes.ENUM('addition', 'deletion', 'modification', 'time_extension'),
        allowNull: false,
        comment: 'Change type',
      },
      costImpact: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Cost impact (positive or negative)',
      },
      timeImpact: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Time impact in days',
      },
      justification: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Justification',
      },
      requestedBy: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Requested by user',
      },
      approvedBy: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Approved by user',
      },
      approvalDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Approval date',
      },
      status: {
        type: DataTypes.ENUM('draft', 'submitted', 'approved', 'rejected', 'executed'),
        allowNull: false,
        defaultValue: 'draft',
        comment: 'Change order status',
      },
      executionDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Execution date',
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
      tableName: 'change_orders',
      timestamps: true,
      indexes: [
        { fields: ['changeOrderId'], unique: true },
        { fields: ['changeOrderNumber'], unique: true },
        { fields: ['contractId'] },
        { fields: ['status'] },
        { fields: ['changeOrderDate'] },
      ],
    },
  );

  return ChangeOrder;
};

/**
 * Sequelize model for Cost Tracking and earned value.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CostTracking model
 */
export const createCostTrackingModel = (sequelize: Sequelize) => {
  class CostTracking extends Model {
    public id!: string;
    public costId!: string;
    public contractId!: string;
    public costCategory!: string;
    public costDate!: Date;
    public budgetedCost!: number;
    public actualCost!: number;
    public committedCost!: number;
    public variance!: number;
    public percentOfBudget!: number;
    public description!: string;
    public recordedBy!: string;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  CostTracking.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      costId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Cost tracking identifier',
      },
      contractId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Contract identifier',
      },
      costCategory: {
        type: DataTypes.ENUM('labor', 'materials', 'equipment', 'subcontractor', 'overhead', 'other'),
        allowNull: false,
        comment: 'Cost category',
      },
      costDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Cost date',
      },
      budgetedCost: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Budgeted cost',
      },
      actualCost: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Actual cost incurred',
      },
      committedCost: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Committed cost',
      },
      variance: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Cost variance',
      },
      percentOfBudget: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        comment: 'Percent of budget',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Cost description',
      },
      recordedBy: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Recorded by user',
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
      tableName: 'cost_tracking',
      timestamps: true,
      indexes: [
        { fields: ['costId'], unique: true },
        { fields: ['contractId'] },
        { fields: ['costCategory'] },
        { fields: ['costDate'] },
      ],
    },
  );

  return CostTracking;
};

/**
 * Sequelize model for Milestone Billing.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} MilestoneBilling model
 */
export const createMilestoneBillingModel = (sequelize: Sequelize) => {
  class MilestoneBilling extends Model {
    public id!: string;
    public milestoneId!: string;
    public contractId!: string;
    public milestoneName!: string;
    public milestoneDescription!: string;
    public milestoneValue!: number;
    public milestoneWeight!: number;
    public plannedDate!: Date;
    public actualDate!: Date | null;
    public status!: string;
    public percentComplete!: number;
    public billable!: boolean;
    public billingId!: string | null;
    public approvedBy!: string | null;
    public approvalDate!: Date | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  MilestoneBilling.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      milestoneId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Milestone identifier',
      },
      contractId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Contract identifier',
      },
      milestoneName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Milestone name',
      },
      milestoneDescription: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Milestone description',
      },
      milestoneValue: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Milestone value',
      },
      milestoneWeight: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        comment: 'Milestone weight percentage',
      },
      plannedDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Planned completion date',
      },
      actualDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Actual completion date',
      },
      status: {
        type: DataTypes.ENUM('pending', 'in_progress', 'completed', 'verified'),
        allowNull: false,
        defaultValue: 'pending',
        comment: 'Milestone status',
      },
      percentComplete: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Percent complete',
      },
      billable: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Billable status',
      },
      billingId: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Associated billing identifier',
      },
      approvedBy: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Approved by user',
      },
      approvalDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Approval date',
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
      tableName: 'milestone_billings',
      timestamps: true,
      indexes: [
        { fields: ['milestoneId'], unique: true },
        { fields: ['contractId'] },
        { fields: ['status'] },
        { fields: ['plannedDate'] },
        { fields: ['billable'] },
      ],
    },
  );

  return MilestoneBilling;
};

/**
 * Sequelize model for Contract Revenue Recognition.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ContractRevenue model
 */
export const createContractRevenueModel = (sequelize: Sequelize) => {
  class ContractRevenue extends Model {
    public id!: string;
    public revenueId!: string;
    public contractId!: string;
    public fiscalYear!: number;
    public fiscalPeriod!: number;
    public recognitionMethod!: string;
    public totalContractRevenue!: number;
    public totalEstimatedCosts!: number;
    public costsIncurred!: number;
    public percentComplete!: number;
    public revenueRecognized!: number;
    public costRecognized!: number;
    public grossProfit!: number;
    public grossProfitPercent!: number;
    public isPosted!: boolean;
    public postedDate!: Date | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  ContractRevenue.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      revenueId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Revenue identifier',
      },
      contractId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Contract identifier',
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
      recognitionMethod: {
        type: DataTypes.ENUM('percentage_of_completion', 'cost_to_cost', 'milestone', 'completed_contract'),
        allowNull: false,
        comment: 'Revenue recognition method',
      },
      totalContractRevenue: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Total contract revenue',
      },
      totalEstimatedCosts: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Total estimated costs',
      },
      costsIncurred: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Costs incurred to date',
      },
      percentComplete: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        comment: 'Percent complete',
      },
      revenueRecognized: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Revenue recognized',
      },
      costRecognized: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Cost recognized',
      },
      grossProfit: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Gross profit',
      },
      grossProfitPercent: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        comment: 'Gross profit percent',
      },
      isPosted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Posted to GL',
      },
      postedDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Posted date',
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
      tableName: 'contract_revenues',
      timestamps: true,
      indexes: [
        { fields: ['revenueId'], unique: true },
        { fields: ['contractId'] },
        { fields: ['fiscalYear', 'fiscalPeriod'] },
        { fields: ['isPosted'] },
      ],
    },
  );

  return ContractRevenue;
};

// ============================================================================
// CONSTRUCTION CONTRACT MANAGEMENT (1-6)
// ============================================================================

/**
 * Creates new construction contract with validation.
 *
 * @param {ConstructionContractData} contractData - Contract data
 * @param {Model} ConstructionContract - ConstructionContract model
 * @param {string} userId - User creating contract
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created contract
 *
 * @example
 * ```typescript
 * const contract = await createConstructionContract({
 *   contractId: 'CC-2024-001',
 *   contractNumber: 'USACE-BLD-2024-001',
 *   contractName: 'Building Construction',
 *   contractType: 'lump_sum',
 *   originalContractAmount: 5000000
 * }, ConstructionContract, 'user123');
 * ```
 */
export const createConstructionContract = async (
  contractData: ConstructionContractData,
  ConstructionContract: any,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const contract = await ConstructionContract.create(
    {
      ...contractData,
      currentContractAmount: contractData.originalContractAmount,
      totalBilled: 0,
      totalPaid: 0,
      retainageWithheld: 0,
      changeOrdersTotal: 0,
    },
    { transaction },
  );

  console.log(`Construction contract created: ${contract.contractId} by ${userId}`);
  return contract;
};

/**
 * Updates contract completion percentage.
 *
 * @param {string} contractId - Contract ID
 * @param {number} percentComplete - Percent complete
 * @param {Model} ConstructionContract - ConstructionContract model
 * @returns {Promise<any>} Updated contract
 */
export const updateContractPercentComplete = async (
  contractId: string,
  percentComplete: number,
  ConstructionContract: any,
): Promise<any> => {
  const contract = await ConstructionContract.findOne({ where: { contractId } });
  if (!contract) throw new Error('Contract not found');

  contract.percentComplete = percentComplete;
  await contract.save();

  return contract;
};

/**
 * Retrieves active contracts by project.
 *
 * @param {string} projectId - Project ID
 * @param {Model} ConstructionContract - ConstructionContract model
 * @returns {Promise<any[]>} Active contracts
 */
export const getActiveContractsByProject = async (
  projectId: string,
  ConstructionContract: any,
): Promise<any[]> => {
  return await ConstructionContract.findAll({
    where: { projectId, status: 'active' },
    order: [['contractNumber', 'ASC']],
  });
};

/**
 * Retrieves contracts by contractor.
 *
 * @param {string} contractorId - Contractor ID
 * @param {Model} ConstructionContract - ConstructionContract model
 * @returns {Promise<any[]>} Contractor contracts
 */
export const getContractsByContractor = async (
  contractorId: string,
  ConstructionContract: any,
): Promise<any[]> => {
  return await ConstructionContract.findAll({
    where: { contractorId },
    order: [['startDate', 'DESC']],
  });
};

/**
 * Validates contract bond requirements.
 *
 * @param {number} contractAmount - Contract amount
 * @returns {{ bondRequired: boolean; bondAmount: number; bondType: string }}
 */
export const validateBondRequirements = (
  contractAmount: number,
): { bondRequired: boolean; bondAmount: number; bondType: string } => {
  const threshold = 150000;
  const bondRequired = contractAmount >= threshold;
  const bondAmount = bondRequired ? contractAmount : 0;
  const bondType = bondRequired ? 'performance_and_payment' : 'none';

  return {
    bondRequired,
    bondAmount,
    bondType,
  };
};

/**
 * Generates contract summary report.
 *
 * @param {string} contractId - Contract ID
 * @param {Model} ConstructionContract - ConstructionContract model
 * @param {Model} ProgressBilling - ProgressBilling model
 * @param {Model} ChangeOrder - ChangeOrder model
 * @returns {Promise<any>} Contract summary
 */
export const generateContractSummary = async (
  contractId: string,
  ConstructionContract: any,
  ProgressBilling: any,
  ChangeOrder: any,
): Promise<any> => {
  const contract = await ConstructionContract.findOne({ where: { contractId } });
  if (!contract) throw new Error('Contract not found');

  const billings = await ProgressBilling.findAll({
    where: { contractId },
  });

  const changeOrders = await ChangeOrder.findAll({
    where: { contractId, status: 'executed' },
  });

  const totalBilled = billings.reduce(
    (sum: number, b: any) => sum + parseFloat(b.currentBilling),
    0,
  );

  const totalChangeOrders = changeOrders.reduce(
    (sum: number, c: any) => sum + parseFloat(c.costImpact),
    0,
  );

  return {
    contract,
    totalBilled,
    totalChangeOrders,
    billingCount: billings.length,
    changeOrderCount: changeOrders.length,
    remainingValue: parseFloat(contract.currentContractAmount) - totalBilled,
  };
};

// ============================================================================
// PROGRESS BILLING & PAYMENT APPLICATIONS (7-14)
// ============================================================================

/**
 * Creates progress billing for contract period.
 *
 * @param {ProgressBillingData} billingData - Billing data
 * @param {Model} ProgressBilling - ProgressBilling model
 * @param {Model} ConstructionContract - ConstructionContract model
 * @returns {Promise<any>} Created billing
 */
export const createProgressBilling = async (
  billingData: ProgressBillingData,
  ProgressBilling: any,
  ConstructionContract: any,
): Promise<any> => {
  const contract = await ConstructionContract.findOne({
    where: { contractId: billingData.contractId },
  });
  if (!contract) throw new Error('Contract not found');

  const billing = await ProgressBilling.create(billingData);

  // Update contract totals
  contract.totalBilled = parseFloat(contract.totalBilled) + billingData.currentBilling;
  contract.retainageWithheld = parseFloat(contract.retainageWithheld) + billingData.retainageWithheld;
  contract.percentComplete = billingData.percentComplete;
  await contract.save();

  return billing;
};

/**
 * Calculates current period billing amount.
 *
 * @param {number} workCompleted - Work completed value
 * @param {number} materialsStored - Materials stored value
 * @param {number} previousBillings - Previous billings total
 * @param {number} retainageRate - Retainage rate percentage
 * @returns {{ totalEarned: number; currentBilling: number; retainageWithheld: number; netDue: number }}
 */
export const calculateProgressBillingAmount = (
  workCompleted: number,
  materialsStored: number,
  previousBillings: number,
  retainageRate: number,
): { totalEarned: number; currentBilling: number; retainageWithheld: number; netDue: number } => {
  const totalEarned = workCompleted + materialsStored;
  const currentBilling = totalEarned - previousBillings;
  const retainageWithheld = (currentBilling * retainageRate) / 100;
  const netDue = currentBilling - retainageWithheld;

  return {
    totalEarned,
    currentBilling,
    retainageWithheld,
    netDue,
  };
};

/**
 * Approves progress billing for payment.
 *
 * @param {string} billingId - Billing ID
 * @param {string} approvedBy - Approving user
 * @param {Model} ProgressBilling - ProgressBilling model
 * @returns {Promise<any>} Approved billing
 */
export const approveProgressBilling = async (
  billingId: string,
  approvedBy: string,
  ProgressBilling: any,
): Promise<any> => {
  const billing = await ProgressBilling.findOne({ where: { billingId } });
  if (!billing) throw new Error('Billing not found');

  billing.status = 'approved';
  billing.approvedBy = approvedBy;
  billing.approvalDate = new Date();
  await billing.save();

  return billing;
};

/**
 * Creates AIA G702/G703 payment application.
 *
 * @param {PaymentApplicationData} applicationData - Application data
 * @param {Model} PaymentApplication - PaymentApplication model
 * @returns {Promise<any>} Created payment application
 */
export const createPaymentApplication = async (
  applicationData: PaymentApplicationData,
  PaymentApplication: any,
): Promise<any> => {
  return await PaymentApplication.create(applicationData);
};

/**
 * Calculates AIA payment application amounts.
 *
 * @param {number} scheduledValue - Scheduled value
 * @param {number} workCompleted - Work completed
 * @param {number} materialsStored - Materials stored
 * @param {number} retainagePercent - Retainage percentage
 * @param {number} previousCertificates - Previous certificates amount
 * @returns {any} Calculated payment application amounts
 */
export const calculatePaymentApplication = (
  scheduledValue: number,
  workCompleted: number,
  materialsStored: number,
  retainagePercent: number,
  previousCertificates: number,
): any => {
  const totalCompletedAndStored = workCompleted + materialsStored;
  const totalEarned = totalCompletedAndStored;
  const retainageAmount = (totalEarned * retainagePercent) / 100;
  const lessRetainage = retainageAmount;
  const totalEarnedLessRetainage = totalEarned - lessRetainage;
  const lessPreviousCertificates = previousCertificates;
  const currentPaymentDue = totalEarnedLessRetainage - lessPreviousCertificates;
  const balanceToFinish = scheduledValue - totalEarned;

  return {
    scheduledValue,
    workCompleted,
    materialsStored,
    totalCompletedAndStored,
    retainagePercent,
    retainageAmount,
    totalEarned,
    lessRetainage,
    totalEarnedLessRetainage,
    lessPreviousCertificates,
    currentPaymentDue,
    balanceToFinish,
  };
};

/**
 * Certifies payment application.
 *
 * @param {string} applicationId - Application ID
 * @param {string} certifiedBy - Certifying user
 * @param {Model} PaymentApplication - PaymentApplication model
 * @returns {Promise<any>} Certified application
 */
export const certifyPaymentApplication = async (
  applicationId: string,
  certifiedBy: string,
  PaymentApplication: any,
): Promise<any> => {
  const application = await PaymentApplication.findOne({ where: { applicationId } });
  if (!application) throw new Error('Payment application not found');

  application.status = 'certified';
  application.certifiedBy = certifiedBy;
  application.certifiedDate = new Date();
  await application.save();

  return application;
};

/**
 * Retrieves billing history for contract.
 *
 * @param {string} contractId - Contract ID
 * @param {Model} ProgressBilling - ProgressBilling model
 * @returns {Promise<any[]>} Billing history
 */
export const getBillingHistory = async (
  contractId: string,
  ProgressBilling: any,
): Promise<any[]> => {
  return await ProgressBilling.findAll({
    where: { contractId },
    order: [['billingDate', 'DESC']],
  });
};

/**
 * Generates billing summary report.
 *
 * @param {string} contractId - Contract ID
 * @param {Model} ProgressBilling - ProgressBilling model
 * @returns {Promise<any>} Billing summary
 */
export const generateBillingSummary = async (
  contractId: string,
  ProgressBilling: any,
): Promise<any> => {
  const billings = await ProgressBilling.findAll({
    where: { contractId },
  });

  const totalBilled = billings.reduce(
    (sum: number, b: any) => sum + parseFloat(b.currentBilling),
    0,
  );

  const totalRetainage = billings.reduce(
    (sum: number, b: any) => sum + parseFloat(b.retainageWithheld),
    0,
  );

  const paidBillings = billings.filter((b: any) => b.status === 'paid');
  const totalPaid = paidBillings.reduce(
    (sum: number, b: any) => sum + parseFloat(b.netDue),
    0,
  );

  return {
    contractId,
    totalBillings: billings.length,
    totalBilled,
    totalRetainage,
    totalPaid,
    pendingPayment: totalBilled - totalPaid,
  };
};

// ============================================================================
// PERCENTAGE-OF-COMPLETION & COST TRACKING (15-22)
// ============================================================================

/**
 * Calculates percentage-of-completion using cost-to-cost method.
 *
 * @param {number} costsIncurred - Costs incurred to date
 * @param {number} totalEstimatedCosts - Total estimated costs
 * @returns {{ percentComplete: number; costRatio: number }}
 */
export const calculatePercentageOfCompletion = (
  costsIncurred: number,
  totalEstimatedCosts: number,
): { percentComplete: number; costRatio: number } => {
  if (totalEstimatedCosts === 0) {
    return { percentComplete: 0, costRatio: 0 };
  }

  const costRatio = costsIncurred / totalEstimatedCosts;
  const percentComplete = costRatio * 100;

  return {
    percentComplete: Math.min(percentComplete, 100),
    costRatio,
  };
};

/**
 * Recognizes revenue using percentage-of-completion method.
 *
 * @param {string} contractId - Contract ID
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {Model} ConstructionContract - ConstructionContract model
 * @param {Model} CostTracking - CostTracking model
 * @param {Model} ContractRevenue - ContractRevenue model
 * @returns {Promise<any>} Revenue recognition
 */
export const recognizeRevenuePercentageOfCompletion = async (
  contractId: string,
  fiscalYear: number,
  fiscalPeriod: number,
  ConstructionContract: any,
  CostTracking: any,
  ContractRevenue: any,
): Promise<any> => {
  const contract = await ConstructionContract.findOne({ where: { contractId } });
  if (!contract) throw new Error('Contract not found');

  const costs = await CostTracking.findAll({ where: { contractId } });
  const totalCostsIncurred = costs.reduce(
    (sum: number, c: any) => sum + parseFloat(c.actualCost),
    0,
  );

  // Assume totalEstimatedCosts from contract metadata or calculate
  const totalEstimatedCosts = parseFloat(contract.currentContractAmount) * 0.85; // Example 85% cost ratio

  const { percentComplete } = calculatePercentageOfCompletion(
    totalCostsIncurred,
    totalEstimatedCosts,
  );

  const totalContractRevenue = parseFloat(contract.currentContractAmount);
  const revenueRecognized = (totalContractRevenue * percentComplete) / 100;
  const costRecognized = totalCostsIncurred;
  const grossProfit = revenueRecognized - costRecognized;
  const grossProfitPercent = revenueRecognized > 0 ? (grossProfit / revenueRecognized) * 100 : 0;

  const revenue = await ContractRevenue.create({
    revenueId: `REV-${contractId}-${fiscalYear}-${fiscalPeriod}`,
    contractId,
    fiscalYear,
    fiscalPeriod,
    recognitionMethod: 'cost_to_cost',
    totalContractRevenue,
    totalEstimatedCosts,
    costsIncurred: totalCostsIncurred,
    percentComplete,
    revenueRecognized,
    costRecognized,
    grossProfit,
    grossProfitPercent,
    isPosted: false,
  });

  return revenue;
};

/**
 * Tracks project costs by category.
 *
 * @param {CostTrackingData} costData - Cost data
 * @param {Model} CostTracking - CostTracking model
 * @returns {Promise<any>} Cost tracking record
 */
export const trackProjectCosts = async (
  costData: CostTrackingData,
  CostTracking: any,
): Promise<any> => {
  const variance = costData.actualCost - costData.budgetedCost;
  const percentOfBudget = costData.budgetedCost > 0
    ? (costData.actualCost / costData.budgetedCost) * 100
    : 0;

  return await CostTracking.create({
    ...costData,
    variance,
    percentOfBudget,
  });
};

/**
 * Calculates earned value metrics.
 *
 * @param {number} budgetedCost - Budgeted cost of work scheduled (BCWS)
 * @param {number} actualCost - Actual cost of work performed (ACWP)
 * @param {number} earnedValue - Budgeted cost of work performed (BCWP)
 * @returns {any} Earned value metrics
 */
export const calculateEarnedValueMetrics = (
  budgetedCost: number,
  actualCost: number,
  earnedValue: number,
): any => {
  const scheduleVariance = earnedValue - budgetedCost;
  const costVariance = earnedValue - actualCost;
  const schedulePerformanceIndex = budgetedCost > 0 ? earnedValue / budgetedCost : 0;
  const costPerformanceIndex = actualCost > 0 ? earnedValue / actualCost : 0;

  return {
    budgetedCost,
    actualCost,
    earnedValue,
    scheduleVariance,
    costVariance,
    schedulePerformanceIndex,
    costPerformanceIndex,
    isOnSchedule: scheduleVariance >= 0,
    isOnBudget: costVariance >= 0,
  };
};

/**
 * Retrieves cost performance report.
 *
 * @param {string} contractId - Contract ID
 * @param {Model} CostTracking - CostTracking model
 * @returns {Promise<any>} Cost performance report
 */
export const getCostPerformanceReport = async (
  contractId: string,
  CostTracking: any,
): Promise<any> => {
  const costs = await CostTracking.findAll({ where: { contractId } });

  const totalBudgeted = costs.reduce(
    (sum: number, c: any) => sum + parseFloat(c.budgetedCost),
    0,
  );

  const totalActual = costs.reduce(
    (sum: number, c: any) => sum + parseFloat(c.actualCost),
    0,
  );

  const totalVariance = costs.reduce(
    (sum: number, c: any) => sum + parseFloat(c.variance),
    0,
  );

  const byCategory = costs.reduce((acc: any, c: any) => {
    if (!acc[c.costCategory]) {
      acc[c.costCategory] = {
        budgeted: 0,
        actual: 0,
        variance: 0,
      };
    }
    acc[c.costCategory].budgeted += parseFloat(c.budgetedCost);
    acc[c.costCategory].actual += parseFloat(c.actualCost);
    acc[c.costCategory].variance += parseFloat(c.variance);
    return acc;
  }, {});

  return {
    contractId,
    totalBudgeted,
    totalActual,
    totalVariance,
    variancePercent: totalBudgeted > 0 ? (totalVariance / totalBudgeted) * 100 : 0,
    byCategory,
  };
};

/**
 * Validates cost variance threshold.
 *
 * @param {number} variance - Cost variance
 * @param {number} budgetedCost - Budgeted cost
 * @param {number} threshold - Threshold percentage
 * @returns {{ withinThreshold: boolean; variancePercent: number }}
 */
export const validateCostVarianceThreshold = (
  variance: number,
  budgetedCost: number,
  threshold: number = 10,
): { withinThreshold: boolean; variancePercent: number } => {
  const variancePercent = budgetedCost > 0 ? (variance / budgetedCost) * 100 : 0;
  const withinThreshold = Math.abs(variancePercent) <= threshold;

  return {
    withinThreshold,
    variancePercent,
  };
};

/**
 * Generates cost forecast based on trends.
 *
 * @param {string} contractId - Contract ID
 * @param {Model} CostTracking - CostTracking model
 * @param {Model} ConstructionContract - ConstructionContract model
 * @returns {Promise<any>} Cost forecast
 */
export const generateCostForecast = async (
  contractId: string,
  CostTracking: any,
  ConstructionContract: any,
): Promise<any> => {
  const contract = await ConstructionContract.findOne({ where: { contractId } });
  if (!contract) throw new Error('Contract not found');

  const costs = await CostTracking.findAll({ where: { contractId } });

  const totalActual = costs.reduce(
    (sum: number, c: any) => sum + parseFloat(c.actualCost),
    0,
  );

  const percentComplete = parseFloat(contract.percentComplete);
  const estimatedTotalCost = percentComplete > 0
    ? (totalActual / percentComplete) * 100
    : totalActual;

  const estimatedCostAtCompletion = estimatedTotalCost;
  const currentContractAmount = parseFloat(contract.currentContractAmount);
  const costOverrun = estimatedCostAtCompletion - (currentContractAmount * 0.85);

  return {
    contractId,
    percentComplete,
    costsToDate: totalActual,
    estimatedTotalCost,
    estimatedCostAtCompletion,
    currentContractAmount,
    estimatedProfit: currentContractAmount - estimatedCostAtCompletion,
    costOverrun,
    hasOverrun: costOverrun > 0,
  };
};

// ============================================================================
// RETAINAGE MANAGEMENT (23-28)
// ============================================================================

/**
 * Withholds retainage for progress billing.
 *
 * @param {ContractRetainageData} retainageData - Retainage data
 * @param {Model} ContractRetainage - ContractRetainage model
 * @returns {Promise<any>} Retainage record
 */
export const withholdRetainage = async (
  retainageData: ContractRetainageData,
  ContractRetainage: any,
): Promise<any> => {
  return await ContractRetainage.create(retainageData);
};

/**
 * Calculates retainage amount for billing.
 *
 * @param {number} billingAmount - Billing amount
 * @param {number} retainageRate - Retainage rate percentage
 * @returns {{ retainageAmount: number; netPayment: number }}
 */
export const calculateRetainageAmount = (
  billingAmount: number,
  retainageRate: number,
): { retainageAmount: number; netPayment: number } => {
  const retainageAmount = (billingAmount * retainageRate) / 100;
  const netPayment = billingAmount - retainageAmount;

  return {
    retainageAmount,
    netPayment,
  };
};

/**
 * Releases retainage payment.
 *
 * @param {string} retainageId - Retainage ID
 * @param {number} releaseAmount - Amount to release
 * @param {string} releasedBy - Releasing user
 * @param {Model} ContractRetainage - ContractRetainage model
 * @returns {Promise<any>} Released retainage
 */
export const releaseRetainage = async (
  retainageId: string,
  releaseAmount: number,
  releasedBy: string,
  ContractRetainage: any,
): Promise<any> => {
  const retainage = await ContractRetainage.findOne({ where: { retainageId } });
  if (!retainage) throw new Error('Retainage not found');

  retainage.releasedAmount = parseFloat(retainage.releasedAmount) + releaseAmount;
  retainage.status = retainage.releasedAmount >= parseFloat(retainage.retainageAmount)
    ? 'released'
    : 'partial';
  retainage.releaseDate = new Date();
  retainage.releasedBy = releasedBy;
  await retainage.save();

  return retainage;
};

/**
 * Retrieves total retainage withheld for contract.
 *
 * @param {string} contractId - Contract ID
 * @param {Model} ContractRetainage - ContractRetainage model
 * @returns {Promise<any>} Retainage summary
 */
export const getTotalRetainageWithheld = async (
  contractId: string,
  ContractRetainage: any,
): Promise<any> => {
  const retainages = await ContractRetainage.findAll({
    where: { contractId, status: { [Op.in]: ['withheld', 'eligible', 'partial'] } },
  });

  const totalWithheld = retainages.reduce(
    (sum: number, r: any) => sum + parseFloat(r.retainageAmount),
    0,
  );

  const totalReleased = retainages.reduce(
    (sum: number, r: any) => sum + parseFloat(r.releasedAmount),
    0,
  );

  return {
    contractId,
    totalWithheld,
    totalReleased,
    totalPending: totalWithheld - totalReleased,
    retainageCount: retainages.length,
  };
};

/**
 * Identifies eligible retainage for release.
 *
 * @param {string} contractId - Contract ID
 * @param {Date} asOfDate - As of date
 * @param {Model} ContractRetainage - ContractRetainage model
 * @returns {Promise<any[]>} Eligible retainages
 */
export const getEligibleRetainageForRelease = async (
  contractId: string,
  asOfDate: Date,
  ContractRetainage: any,
): Promise<any[]> => {
  return await ContractRetainage.findAll({
    where: {
      contractId,
      status: { [Op.in]: ['withheld', 'eligible'] },
      releaseEligibleDate: { [Op.lte]: asOfDate },
    },
    order: [['releaseEligibleDate', 'ASC']],
  });
};

/**
 * Generates retainage tracking report.
 *
 * @param {string} contractId - Contract ID
 * @param {Model} ContractRetainage - ContractRetainage model
 * @returns {Promise<any>} Retainage report
 */
export const generateRetainageReport = async (
  contractId: string,
  ContractRetainage: any,
): Promise<any> => {
  const retainages = await ContractRetainage.findAll({
    where: { contractId },
  });

  const byType = retainages.reduce((acc: any, r: any) => {
    if (!acc[r.retainageType]) {
      acc[r.retainageType] = {
        count: 0,
        withheld: 0,
        released: 0,
      };
    }
    acc[r.retainageType].count++;
    acc[r.retainageType].withheld += parseFloat(r.retainageAmount);
    acc[r.retainageType].released += parseFloat(r.releasedAmount);
    return acc;
  }, {});

  return {
    contractId,
    totalRetainages: retainages.length,
    byType,
    retainages,
  };
};

// ============================================================================
// CHANGE ORDER MANAGEMENT (29-35)
// ============================================================================

/**
 * Creates change order for contract.
 *
 * @param {ChangeOrderData} changeOrderData - Change order data
 * @param {Model} ChangeOrder - ChangeOrder model
 * @returns {Promise<any>} Created change order
 */
export const createChangeOrder = async (
  changeOrderData: ChangeOrderData,
  ChangeOrder: any,
): Promise<any> => {
  return await ChangeOrder.create(changeOrderData);
};

/**
 * Approves change order.
 *
 * @param {string} changeOrderId - Change order ID
 * @param {string} approvedBy - Approving user
 * @param {Model} ChangeOrder - ChangeOrder model
 * @returns {Promise<any>} Approved change order
 */
export const approveChangeOrder = async (
  changeOrderId: string,
  approvedBy: string,
  ChangeOrder: any,
): Promise<any> => {
  const changeOrder = await ChangeOrder.findOne({ where: { changeOrderId } });
  if (!changeOrder) throw new Error('Change order not found');

  changeOrder.status = 'approved';
  changeOrder.approvedBy = approvedBy;
  changeOrder.approvalDate = new Date();
  await changeOrder.save();

  return changeOrder;
};

/**
 * Executes approved change order and updates contract.
 *
 * @param {string} changeOrderId - Change order ID
 * @param {Model} ChangeOrder - ChangeOrder model
 * @param {Model} ConstructionContract - ConstructionContract model
 * @returns {Promise<any>} Executed change order
 */
export const executeChangeOrder = async (
  changeOrderId: string,
  ChangeOrder: any,
  ConstructionContract: any,
): Promise<any> => {
  const changeOrder = await ChangeOrder.findOne({ where: { changeOrderId } });
  if (!changeOrder) throw new Error('Change order not found');

  if (changeOrder.status !== 'approved') {
    throw new Error('Change order must be approved before execution');
  }

  // Update contract amount
  const contract = await ConstructionContract.findOne({
    where: { contractId: changeOrder.contractId },
  });
  if (!contract) throw new Error('Contract not found');

  contract.currentContractAmount = parseFloat(contract.currentContractAmount) + parseFloat(changeOrder.costImpact);
  contract.changeOrdersTotal = parseFloat(contract.changeOrdersTotal) + parseFloat(changeOrder.costImpact);

  // Update completion date if time impact
  if (changeOrder.timeImpact > 0) {
    const currentDate = new Date(contract.completionDate);
    currentDate.setDate(currentDate.getDate() + changeOrder.timeImpact);
    contract.completionDate = currentDate;
  }

  await contract.save();

  changeOrder.status = 'executed';
  changeOrder.executionDate = new Date();
  await changeOrder.save();

  return changeOrder;
};

/**
 * Calculates cumulative change order impact.
 *
 * @param {string} contractId - Contract ID
 * @param {Model} ChangeOrder - ChangeOrder model
 * @returns {Promise<any>} Change order impact summary
 */
export const calculateChangeOrderImpact = async (
  contractId: string,
  ChangeOrder: any,
): Promise<any> => {
  const changeOrders = await ChangeOrder.findAll({
    where: { contractId, status: { [Op.in]: ['approved', 'executed'] } },
  });

  const totalCostImpact = changeOrders.reduce(
    (sum: number, c: any) => sum + parseFloat(c.costImpact),
    0,
  );

  const totalTimeImpact = changeOrders.reduce(
    (sum: number, c: any) => sum + c.timeImpact,
    0,
  );

  const byType = changeOrders.reduce((acc: any, c: any) => {
    if (!acc[c.changeType]) {
      acc[c.changeType] = {
        count: 0,
        costImpact: 0,
        timeImpact: 0,
      };
    }
    acc[c.changeType].count++;
    acc[c.changeType].costImpact += parseFloat(c.costImpact);
    acc[c.changeType].timeImpact += c.timeImpact;
    return acc;
  }, {});

  return {
    contractId,
    totalChangeOrders: changeOrders.length,
    totalCostImpact,
    totalTimeImpact,
    byType,
  };
};

/**
 * Retrieves change order history for contract.
 *
 * @param {string} contractId - Contract ID
 * @param {Model} ChangeOrder - ChangeOrder model
 * @returns {Promise<any[]>} Change order history
 */
export const getChangeOrderHistory = async (
  contractId: string,
  ChangeOrder: any,
): Promise<any[]> => {
  return await ChangeOrder.findAll({
    where: { contractId },
    order: [['changeOrderDate', 'DESC']],
  });
};

/**
 * Validates change order authorization threshold.
 *
 * @param {number} costImpact - Cost impact amount
 * @param {number} originalContractAmount - Original contract amount
 * @returns {{ requiresExecutiveApproval: boolean; percentOfContract: number }}
 */
export const validateChangeOrderAuthorization = (
  costImpact: number,
  originalContractAmount: number,
): { requiresExecutiveApproval: boolean; percentOfContract: number } => {
  const percentOfContract = (Math.abs(costImpact) / originalContractAmount) * 100;
  const requiresExecutiveApproval = percentOfContract > 10;

  return {
    requiresExecutiveApproval,
    percentOfContract,
  };
};

/**
 * Generates change order summary report.
 *
 * @param {string} contractId - Contract ID
 * @param {Model} ChangeOrder - ChangeOrder model
 * @returns {Promise<any>} Change order summary
 */
export const generateChangeOrderSummary = async (
  contractId: string,
  ChangeOrder: any,
): Promise<any> => {
  const changeOrders = await ChangeOrder.findAll({
    where: { contractId },
  });

  const approvedChangeOrders = changeOrders.filter((c: any) =>
    ['approved', 'executed'].includes(c.status),
  );

  const pendingChangeOrders = changeOrders.filter((c: any) =>
    ['draft', 'submitted'].includes(c.status),
  );

  return {
    contractId,
    totalChangeOrders: changeOrders.length,
    approvedCount: approvedChangeOrders.length,
    pendingCount: pendingChangeOrders.length,
    approvedCostImpact: approvedChangeOrders.reduce(
      (sum: number, c: any) => sum + parseFloat(c.costImpact),
      0,
    ),
    pendingCostImpact: pendingChangeOrders.reduce(
      (sum: number, c: any) => sum + parseFloat(c.costImpact),
      0,
    ),
  };
};

// ============================================================================
// MILESTONE & REVENUE RECOGNITION (36-44)
// ============================================================================

/**
 * Creates milestone for contract.
 *
 * @param {MilestoneBillingData} milestoneData - Milestone data
 * @param {Model} MilestoneBilling - MilestoneBilling model
 * @returns {Promise<any>} Created milestone
 */
export const createMilestone = async (
  milestoneData: MilestoneBillingData,
  MilestoneBilling: any,
): Promise<any> => {
  return await MilestoneBilling.create(milestoneData);
};

/**
 * Completes milestone and marks as billable.
 *
 * @param {string} milestoneId - Milestone ID
 * @param {string} approvedBy - Approving user
 * @param {Model} MilestoneBilling - MilestoneBilling model
 * @returns {Promise<any>} Completed milestone
 */
export const completeMilestone = async (
  milestoneId: string,
  approvedBy: string,
  MilestoneBilling: any,
): Promise<any> => {
  const milestone = await MilestoneBilling.findOne({ where: { milestoneId } });
  if (!milestone) throw new Error('Milestone not found');

  milestone.status = 'completed';
  milestone.actualDate = new Date();
  milestone.percentComplete = 100;
  milestone.billable = true;
  milestone.approvedBy = approvedBy;
  milestone.approvalDate = new Date();
  await milestone.save();

  return milestone;
};

/**
 * Retrieves billable milestones for contract.
 *
 * @param {string} contractId - Contract ID
 * @param {Model} MilestoneBilling - MilestoneBilling model
 * @returns {Promise<any[]>} Billable milestones
 */
export const getBillableMilestones = async (
  contractId: string,
  MilestoneBilling: any,
): Promise<any[]> => {
  return await MilestoneBilling.findAll({
    where: {
      contractId,
      billable: true,
      billingId: null,
    },
    order: [['plannedDate', 'ASC']],
  });
};

/**
 * Calculates milestone billing amount.
 *
 * @param {string} contractId - Contract ID
 * @param {Model} MilestoneBilling - MilestoneBilling model
 * @returns {Promise<{ totalValue: number; count: number }>}
 */
export const calculateMilestoneBillingAmount = async (
  contractId: string,
  MilestoneBilling: any,
): Promise<{ totalValue: number; count: number }> => {
  const milestones = await getBillableMilestones(contractId, MilestoneBilling);

  const totalValue = milestones.reduce(
    (sum: number, m: any) => sum + parseFloat(m.milestoneValue),
    0,
  );

  return {
    totalValue,
    count: milestones.length,
  };
};

/**
 * Posts revenue recognition to general ledger.
 *
 * @param {string} revenueId - Revenue ID
 * @param {Model} ContractRevenue - ContractRevenue model
 * @returns {Promise<any>} Posted revenue
 */
export const postRevenueRecognition = async (
  revenueId: string,
  ContractRevenue: any,
): Promise<any> => {
  const revenue = await ContractRevenue.findOne({ where: { revenueId } });
  if (!revenue) throw new Error('Revenue recognition not found');

  if (revenue.isPosted) {
    throw new Error('Revenue already posted');
  }

  revenue.isPosted = true;
  revenue.postedDate = new Date();
  await revenue.save();

  return revenue;
};

/**
 * Retrieves revenue recognition for fiscal period.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {Model} ContractRevenue - ContractRevenue model
 * @returns {Promise<any[]>} Revenue recognitions
 */
export const getRevenueRecognitionByPeriod = async (
  fiscalYear: number,
  fiscalPeriod: number,
  ContractRevenue: any,
): Promise<any[]> => {
  return await ContractRevenue.findAll({
    where: { fiscalYear, fiscalPeriod },
    order: [['contractId', 'ASC']],
  });
};

/**
 * Generates revenue recognition summary.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {Model} ContractRevenue - ContractRevenue model
 * @returns {Promise<any>} Revenue summary
 */
export const generateRevenueSummary = async (
  fiscalYear: number,
  ContractRevenue: any,
): Promise<any> => {
  const revenues = await ContractRevenue.findAll({
    where: { fiscalYear },
  });

  const totalRevenue = revenues.reduce(
    (sum: number, r: any) => sum + parseFloat(r.revenueRecognized),
    0,
  );

  const totalCost = revenues.reduce(
    (sum: number, r: any) => sum + parseFloat(r.costRecognized),
    0,
  );

  const totalProfit = revenues.reduce(
    (sum: number, r: any) => sum + parseFloat(r.grossProfit),
    0,
  );

  return {
    fiscalYear,
    totalContracts: revenues.length,
    totalRevenue,
    totalCost,
    totalProfit,
    profitMargin: totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0,
  };
};

/**
 * Validates revenue recognition compliance.
 *
 * @param {string} contractId - Contract ID
 * @param {Model} ConstructionContract - ConstructionContract model
 * @param {Model} ContractRevenue - ContractRevenue model
 * @returns {Promise<{ compliant: boolean; issues: string[] }>}
 */
export const validateRevenueRecognitionCompliance = async (
  contractId: string,
  ConstructionContract: any,
  ContractRevenue: any,
): Promise<{ compliant: boolean; issues: string[] }> => {
  const contract = await ConstructionContract.findOne({ where: { contractId } });
  if (!contract) throw new Error('Contract not found');

  const revenues = await ContractRevenue.findAll({ where: { contractId } });

  const issues: string[] = [];

  // Check if revenue exceeds contract amount
  const totalRevenue = revenues.reduce(
    (sum: number, r: any) => sum + parseFloat(r.revenueRecognized),
    0,
  );

  if (totalRevenue > parseFloat(contract.currentContractAmount)) {
    issues.push('Revenue recognized exceeds contract amount');
  }

  // Check for consistent recognition method
  const methods = [...new Set(revenues.map((r: any) => r.recognitionMethod))];
  if (methods.length > 1) {
    issues.push('Multiple recognition methods used for same contract');
  }

  return {
    compliant: issues.length === 0,
    issues,
  };
};

/**
 * Generates comprehensive project financial report.
 *
 * @param {string} contractId - Contract ID
 * @param {Model} ConstructionContract - ConstructionContract model
 * @param {Model} ProgressBilling - ProgressBilling model
 * @param {Model} CostTracking - CostTracking model
 * @param {Model} ContractRevenue - ContractRevenue model
 * @returns {Promise<any>} Comprehensive financial report
 */
export const generateProjectFinancialReport = async (
  contractId: string,
  ConstructionContract: any,
  ProgressBilling: any,
  CostTracking: any,
  ContractRevenue: any,
): Promise<any> => {
  const contract = await ConstructionContract.findOne({ where: { contractId } });
  if (!contract) throw new Error('Contract not found');

  const billings = await ProgressBilling.findAll({ where: { contractId } });
  const costs = await CostTracking.findAll({ where: { contractId } });
  const revenues = await ContractRevenue.findAll({ where: { contractId } });

  const totalBilled = billings.reduce(
    (sum: number, b: any) => sum + parseFloat(b.currentBilling),
    0,
  );

  const totalCosts = costs.reduce(
    (sum: number, c: any) => sum + parseFloat(c.actualCost),
    0,
  );

  const totalRevenue = revenues.reduce(
    (sum: number, r: any) => sum + parseFloat(r.revenueRecognized),
    0,
  );

  return {
    contract: {
      contractId: contract.contractId,
      contractNumber: contract.contractNumber,
      contractName: contract.contractName,
      originalAmount: parseFloat(contract.originalContractAmount),
      currentAmount: parseFloat(contract.currentContractAmount),
      percentComplete: parseFloat(contract.percentComplete),
    },
    billing: {
      totalBilled,
      retainageWithheld: parseFloat(contract.retainageWithheld),
      netPayments: totalBilled - parseFloat(contract.retainageWithheld),
    },
    costs: {
      totalCosts,
      budgetedCosts: costs.reduce((sum: number, c: any) => sum + parseFloat(c.budgetedCost), 0),
      variance: costs.reduce((sum: number, c: any) => sum + parseFloat(c.variance), 0),
    },
    revenue: {
      totalRevenue,
      grossProfit: totalRevenue - totalCosts,
      profitMargin: totalRevenue > 0 ? ((totalRevenue - totalCosts) / totalRevenue) * 100 : 0,
    },
    performance: {
      isOnSchedule: parseFloat(contract.percentComplete) >= 50,
      isOnBudget: totalCosts <= parseFloat(contract.currentContractAmount) * 0.85,
    },
  };
};

// ============================================================================
// NESTJS SERVICE WRAPPER
// ============================================================================

@Injectable()
export class CEFMSConstructionProgressBillingService {
  constructor(private readonly sequelize: Sequelize) {}

  async createContract(contractData: ConstructionContractData, userId: string) {
    const ConstructionContract = createConstructionContractModel(this.sequelize);
    return createConstructionContract(contractData, ConstructionContract, userId);
  }

  async createBilling(billingData: ProgressBillingData) {
    const ProgressBilling = createProgressBillingModel(this.sequelize);
    const ConstructionContract = createConstructionContractModel(this.sequelize);
    return createProgressBilling(billingData, ProgressBilling, ConstructionContract);
  }

  async createChangeOrder(changeOrderData: ChangeOrderData) {
    const ChangeOrder = createChangeOrderModel(this.sequelize);
    return createChangeOrder(changeOrderData, ChangeOrder);
  }

  async recognizeRevenue(contractId: string, fiscalYear: number, fiscalPeriod: number) {
    const ConstructionContract = createConstructionContractModel(this.sequelize);
    const CostTracking = createCostTrackingModel(this.sequelize);
    const ContractRevenue = createContractRevenueModel(this.sequelize);
    return recognizeRevenuePercentageOfCompletion(
      contractId,
      fiscalYear,
      fiscalPeriod,
      ConstructionContract,
      CostTracking,
      ContractRevenue,
    );
  }

  async releaseRetainage(retainageId: string, amount: number, userId: string) {
    const ContractRetainage = createContractRetainageModel(this.sequelize);
    return releaseRetainage(retainageId, amount, userId, ContractRetainage);
  }
}

export default {
  // Models
  createConstructionContractModel,
  createProgressBillingModel,
  createPaymentApplicationModel,
  createContractRetainageModel,
  createChangeOrderModel,
  createCostTrackingModel,
  createMilestoneBillingModel,
  createContractRevenueModel,

  // Contract Management
  createConstructionContract,
  updateContractPercentComplete,
  getActiveContractsByProject,
  getContractsByContractor,
  validateBondRequirements,
  generateContractSummary,

  // Progress Billing
  createProgressBilling,
  calculateProgressBillingAmount,
  approveProgressBilling,
  createPaymentApplication,
  calculatePaymentApplication,
  certifyPaymentApplication,
  getBillingHistory,
  generateBillingSummary,

  // Cost Tracking
  calculatePercentageOfCompletion,
  recognizeRevenuePercentageOfCompletion,
  trackProjectCosts,
  calculateEarnedValueMetrics,
  getCostPerformanceReport,
  validateCostVarianceThreshold,
  generateCostForecast,

  // Retainage Management
  withholdRetainage,
  calculateRetainageAmount,
  releaseRetainage,
  getTotalRetainageWithheld,
  getEligibleRetainageForRelease,
  generateRetainageReport,

  // Change Order Management
  createChangeOrder,
  approveChangeOrder,
  executeChangeOrder,
  calculateChangeOrderImpact,
  getChangeOrderHistory,
  validateChangeOrderAuthorization,
  generateChangeOrderSummary,

  // Milestone & Revenue Recognition
  createMilestone,
  completeMilestone,
  getBillableMilestones,
  calculateMilestoneBillingAmount,
  postRevenueRecognition,
  getRevenueRecognitionByPeriod,
  generateRevenueSummary,
  validateRevenueRecognitionCompliance,
  generateProjectFinancialReport,

  // Service
  CEFMSConstructionProgressBillingService,
};
