/**
 * LOC: CEFMSGA004
 * File: /reuse/financial/cefms/composites/cefms-grants-assistance-management-composite.ts
 *
 * UPSTREAM (imports from):
 *   - ../../budgeting-forecasting-kit.ts
 *   - ../../revenue-recognition-kit.ts
 *   - ../../financial-compliance-audit-kit.ts
 *   - ../../expense-tracking-management-kit.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend CEFMS grants management services
 *   - USACE assistance tracking systems
 *   - Grant reporting modules
 */

/**
 * File: /reuse/financial/cefms/composites/cefms-grants-assistance-management-composite.ts
 * Locator: WC-CEFMS-GA-004
 * Purpose: USACE CEFMS Grants and Assistance Management - grant accounting, drawdowns, matching funds, compliance
 *
 * Upstream: Composes utilities from financial kits for grants management
 * Downstream: ../../../backend/cefms/*, Grant controllers, compliance reporting, drawdown processing
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 38+ composite functions for USACE CEFMS grants and assistance operations
 *
 * LLM Context: Production-ready USACE CEFMS grants and federal assistance management.
 * Comprehensive grant lifecycle tracking, award management, drawdown processing, matching fund requirements,
 * cost allocation compliance, period of performance tracking, grant reporting, indirect cost rates,
 * subrecipient monitoring, allowable cost validation, and federal audit compliance.
 */

import { Model, DataTypes, Sequelize, Transaction, Op } from 'sequelize';
import { Injectable } from '@nestjs/common';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface GrantAwardData {
  grantId: string;
  grantNumber: string;
  grantTitle: string;
  grantorAgency: string;
  awardAmount: number;
  matchingRequirement: number;
  matchingPercent: number;
  startDate: Date;
  endDate: Date;
  programCode: string;
  projectCode: string;
  cfda: string;
  status: 'active' | 'closed' | 'suspended' | 'terminated';
  metadata?: Record<string, any>;
}

interface DrawdownRequestData {
  drawdownId: string;
  grantId: string;
  requestDate: Date;
  requestAmount: number;
  periodStartDate: Date;
  periodEndDate: Date;
  requestedBy: string;
  status: 'draft' | 'submitted' | 'approved' | 'disbursed' | 'rejected';
  justification: string;
}

interface MatchingFundData {
  matchId: string;
  grantId: string;
  matchSource: 'cash' | 'in_kind' | 'third_party';
  matchAmount: number;
  matchDate: Date;
  description: string;
  documentRef?: string;
  verified: boolean;
}

interface GrantExpenditureData {
  expenditureId: string;
  grantId: string;
  costCategory: string;
  expenditureDate: Date;
  amount: number;
  directCost: boolean;
  allowable: boolean;
  allocable: boolean;
  reasonable: boolean;
  documentRef: string;
}

interface IndirectCostRateData {
  rateId: string;
  fiscalYear: number;
  rateType: 'negotiated' | 'de_minimis' | 'provisional';
  ratePercent: number;
  baseType: 'mtdc' | 'total_direct_cost';
  effectiveDate: Date;
  expirationDate: Date;
  approvalRef?: string;
}

interface SubrecipientData {
  subrecipientId: string;
  subrecipientName: string;
  ein: string;
  dunsNumber: string;
  address: string;
  contactPerson: string;
  riskRating: 'low' | 'medium' | 'high';
  monitoringFrequency: 'annual' | 'semi_annual' | 'quarterly';
  lastMonitored?: Date;
}

interface GrantComplianceCheckData {
  checkId: string;
  grantId: string;
  checkDate: Date;
  checkType: 'period_of_performance' | 'matching_funds' | 'allowable_costs' | 'reporting';
  status: 'compliant' | 'non_compliant' | 'needs_review';
  findings: string;
  corrective_action?: string;
}

interface GrantReportData {
  reportId: string;
  grantId: string;
  reportType: 'financial' | 'performance' | 'final';
  reportingPeriodStart: Date;
  reportingPeriodEnd: Date;
  dueDate: Date;
  submittedDate?: Date;
  status: 'pending' | 'submitted' | 'accepted';
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Sequelize model for Grant Awards with federal compliance tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} GrantAward model
 *
 * @example
 * ```typescript
 * const GrantAward = createGrantAwardModel(sequelize);
 * const grant = await GrantAward.create({
 *   grantId: 'GR-2024-001',
 *   grantNumber: 'USACE-2024-001',
 *   grantTitle: 'Infrastructure Improvement Grant',
 *   grantorAgency: 'USACE',
 *   awardAmount: 1000000,
 *   matchingRequirement: 250000,
 *   matchingPercent: 25,
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2025-12-31'),
 *   cfda: '12.100',
 *   status: 'active'
 * });
 * ```
 */
export const createGrantAwardModel = (sequelize: Sequelize) => {
  class GrantAward extends Model {
    public id!: string;
    public grantId!: string;
    public grantNumber!: string;
    public grantTitle!: string;
    public grantorAgency!: string;
    public awardAmount!: number;
    public matchingRequirement!: number;
    public matchingPercent!: number;
    public startDate!: Date;
    public endDate!: Date;
    public programCode!: string;
    public projectCode!: string;
    public cfda!: string;
    public status!: string;
    public totalDrawdowns!: number;
    public totalExpenditures!: number;
    public totalMatching!: number;
    public remainingBalance!: number;
    public description!: string;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  GrantAward.init(
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
      grantNumber: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Official grant number',
      },
      grantTitle: {
        type: DataTypes.STRING(300),
        allowNull: false,
        comment: 'Grant title',
      },
      grantorAgency: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Grantor agency',
      },
      awardAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Total award amount',
        validate: {
          min: 0,
        },
      },
      matchingRequirement: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Matching fund requirement',
      },
      matchingPercent: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Matching percentage',
        validate: {
          min: 0,
          max: 100,
        },
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Period of performance start',
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Period of performance end',
      },
      programCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Program code',
      },
      projectCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Project code',
      },
      cfda: {
        type: DataTypes.STRING(20),
        allowNull: false,
        comment: 'CFDA number',
      },
      status: {
        type: DataTypes.ENUM('active', 'closed', 'suspended', 'terminated'),
        allowNull: false,
        defaultValue: 'active',
        comment: 'Grant status',
      },
      totalDrawdowns: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Total drawdowns',
      },
      totalExpenditures: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Total expenditures',
      },
      totalMatching: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Total matching funds',
      },
      remainingBalance: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Remaining balance',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: '',
        comment: 'Description',
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
      tableName: 'grant_awards',
      timestamps: true,
      indexes: [
        { fields: ['grantId'], unique: true },
        { fields: ['grantNumber'] },
        { fields: ['status'] },
        { fields: ['programCode'] },
        { fields: ['projectCode'] },
        { fields: ['cfda'] },
        { fields: ['startDate', 'endDate'] },
      ],
    },
  );

  return GrantAward;
};

/**
 * Sequelize model for Drawdown Requests with approval workflow.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} DrawdownRequest model
 */
export const createDrawdownRequestModel = (sequelize: Sequelize) => {
  class DrawdownRequest extends Model {
    public id!: string;
    public drawdownId!: string;
    public grantId!: string;
    public requestDate!: Date;
    public requestAmount!: number;
    public periodStartDate!: Date;
    public periodEndDate!: Date;
    public requestedBy!: string;
    public status!: string;
    public approvedBy!: string | null;
    public approvedDate!: Date | null;
    public disbursedDate!: Date | null;
    public rejectedReason!: string | null;
    public justification!: string;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  DrawdownRequest.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      drawdownId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Drawdown identifier',
      },
      grantId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Related grant',
      },
      requestDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Request date',
      },
      requestAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Requested amount',
        validate: {
          min: 0.01,
        },
      },
      periodStartDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Period start date',
      },
      periodEndDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Period end date',
      },
      requestedBy: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Requester user ID',
      },
      status: {
        type: DataTypes.ENUM('draft', 'submitted', 'approved', 'disbursed', 'rejected'),
        allowNull: false,
        defaultValue: 'draft',
        comment: 'Request status',
      },
      approvedBy: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Approver user ID',
      },
      approvedDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Approval date',
      },
      disbursedDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Disbursement date',
      },
      rejectedReason: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Rejection reason',
      },
      justification: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Drawdown justification',
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
      tableName: 'drawdown_requests',
      timestamps: true,
      indexes: [
        { fields: ['drawdownId'], unique: true },
        { fields: ['grantId'] },
        { fields: ['status'] },
        { fields: ['requestDate'] },
        { fields: ['periodStartDate', 'periodEndDate'] },
      ],
    },
  );

  return DrawdownRequest;
};

/**
 * Sequelize model for Matching Funds with verification tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} MatchingFund model
 */
export const createMatchingFundModel = (sequelize: Sequelize) => {
  class MatchingFund extends Model {
    public id!: string;
    public matchId!: string;
    public grantId!: string;
    public matchSource!: string;
    public matchAmount!: number;
    public matchDate!: Date;
    public description!: string;
    public documentRef!: string | null;
    public verified!: boolean;
    public verifiedBy!: string | null;
    public verifiedDate!: Date | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  MatchingFund.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      matchId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Match identifier',
      },
      grantId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Related grant',
      },
      matchSource: {
        type: DataTypes.ENUM('cash', 'in_kind', 'third_party'),
        allowNull: false,
        comment: 'Match source type',
      },
      matchAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Match amount',
        validate: {
          min: 0.01,
        },
      },
      matchDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Match date',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Match description',
      },
      documentRef: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Supporting document',
      },
      verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Verification status',
      },
      verifiedBy: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Verifier user ID',
      },
      verifiedDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Verification date',
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
      tableName: 'matching_funds',
      timestamps: true,
      indexes: [
        { fields: ['matchId'], unique: true },
        { fields: ['grantId'] },
        { fields: ['matchSource'] },
        { fields: ['verified'] },
        { fields: ['matchDate'] },
      ],
    },
  );

  return MatchingFund;
};

/**
 * Sequelize model for Grant Expenditures with allowability tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} GrantExpenditure model
 */
export const createGrantExpenditureModel = (sequelize: Sequelize) => {
  class GrantExpenditure extends Model {
    public id!: string;
    public expenditureId!: string;
    public grantId!: string;
    public costCategory!: string;
    public expenditureDate!: Date;
    public amount!: number;
    public directCost!: boolean;
    public allowable!: boolean;
    public allocable!: boolean;
    public reasonable!: boolean;
    public documentRef!: string;
    public fiscalYear!: number;
    public fiscalPeriod!: number;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  GrantExpenditure.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      expenditureId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Expenditure identifier',
      },
      grantId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Related grant',
      },
      costCategory: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Cost category',
      },
      expenditureDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Expenditure date',
      },
      amount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Expenditure amount',
        validate: {
          min: 0.01,
        },
      },
      directCost: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Is direct cost',
      },
      allowable: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Is allowable cost',
      },
      allocable: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Is allocable cost',
      },
      reasonable: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Is reasonable cost',
      },
      documentRef: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Supporting document',
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
      tableName: 'grant_expenditures',
      timestamps: true,
      indexes: [
        { fields: ['expenditureId'], unique: true },
        { fields: ['grantId'] },
        { fields: ['costCategory'] },
        { fields: ['expenditureDate'] },
        { fields: ['fiscalYear', 'fiscalPeriod'] },
        { fields: ['directCost'] },
        { fields: ['allowable'] },
      ],
    },
  );

  return GrantExpenditure;
};

/**
 * Sequelize model for Indirect Cost Rates.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} IndirectCostRate model
 */
export const createIndirectCostRateModel = (sequelize: Sequelize) => {
  class IndirectCostRate extends Model {
    public id!: string;
    public rateId!: string;
    public fiscalYear!: number;
    public rateType!: string;
    public ratePercent!: number;
    public baseType!: string;
    public effectiveDate!: Date;
    public expirationDate!: Date;
    public approvalRef!: string | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  IndirectCostRate.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      rateId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Rate identifier',
      },
      fiscalYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Fiscal year',
      },
      rateType: {
        type: DataTypes.ENUM('negotiated', 'de_minimis', 'provisional'),
        allowNull: false,
        comment: 'Rate type',
      },
      ratePercent: {
        type: DataTypes.DECIMAL(10, 4),
        allowNull: false,
        comment: 'Rate percentage',
        validate: {
          min: 0,
          max: 100,
        },
      },
      baseType: {
        type: DataTypes.ENUM('mtdc', 'total_direct_cost'),
        allowNull: false,
        comment: 'Base type',
      },
      effectiveDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Effective date',
      },
      expirationDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Expiration date',
      },
      approvalRef: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Approval reference',
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
      tableName: 'indirect_cost_rates',
      timestamps: true,
      indexes: [
        { fields: ['rateId'], unique: true },
        { fields: ['fiscalYear'] },
        { fields: ['rateType'] },
        { fields: ['effectiveDate', 'expirationDate'] },
      ],
    },
  );

  return IndirectCostRate;
};

/**
 * Sequelize model for Subrecipients with risk monitoring.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Subrecipient model
 */
export const createSubrecipientModel = (sequelize: Sequelize) => {
  class Subrecipient extends Model {
    public id!: string;
    public subrecipientId!: string;
    public subrecipientName!: string;
    public ein!: string;
    public dunsNumber!: string;
    public address!: string;
    public contactPerson!: string;
    public riskRating!: string;
    public monitoringFrequency!: string;
    public lastMonitored!: Date | null;
    public nextMonitoringDue!: Date | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  Subrecipient.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      subrecipientId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Subrecipient identifier',
      },
      subrecipientName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Subrecipient name',
      },
      ein: {
        type: DataTypes.STRING(20),
        allowNull: false,
        comment: 'EIN',
      },
      dunsNumber: {
        type: DataTypes.STRING(20),
        allowNull: false,
        comment: 'DUNS number',
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Address',
      },
      contactPerson: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Contact person',
      },
      riskRating: {
        type: DataTypes.ENUM('low', 'medium', 'high'),
        allowNull: false,
        defaultValue: 'medium',
        comment: 'Risk rating',
      },
      monitoringFrequency: {
        type: DataTypes.ENUM('annual', 'semi_annual', 'quarterly'),
        allowNull: false,
        defaultValue: 'annual',
        comment: 'Monitoring frequency',
      },
      lastMonitored: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Last monitoring date',
      },
      nextMonitoringDue: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Next monitoring due',
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
      tableName: 'subrecipients',
      timestamps: true,
      indexes: [
        { fields: ['subrecipientId'], unique: true },
        { fields: ['ein'] },
        { fields: ['dunsNumber'] },
        { fields: ['riskRating'] },
        { fields: ['nextMonitoringDue'] },
      ],
    },
  );

  return Subrecipient;
};

// ============================================================================
// GRANT AWARD MANAGEMENT (1-6)
// ============================================================================

/**
 * Creates grant award with validation.
 *
 * @param {GrantAwardData} grantData - Grant data
 * @param {Model} GrantAward - GrantAward model
 * @returns {Promise<any>} Created grant
 */
export const createGrantAward = async (
  grantData: GrantAwardData,
  GrantAward: any,
): Promise<any> => {
  return await GrantAward.create({
    ...grantData,
    totalDrawdowns: 0,
    totalExpenditures: 0,
    totalMatching: 0,
    remainingBalance: grantData.awardAmount,
  });
};

/**
 * Updates grant status.
 *
 * @param {string} grantId - Grant ID
 * @param {string} status - New status
 * @param {Model} GrantAward - GrantAward model
 * @returns {Promise<any>} Updated grant
 */
export const updateGrantStatus = async (
  grantId: string,
  status: string,
  GrantAward: any,
): Promise<any> => {
  const grant = await GrantAward.findOne({ where: { grantId } });
  if (!grant) throw new Error('Grant not found');

  grant.status = status;
  await grant.save();

  return grant;
};

/**
 * Retrieves active grants.
 *
 * @param {Model} GrantAward - GrantAward model
 * @returns {Promise<any[]>} Active grants
 */
export const getActiveGrants = async (
  GrantAward: any,
): Promise<any[]> => {
  return await GrantAward.findAll({
    where: { status: 'active' },
    order: [['endDate', 'ASC']],
  });
};

/**
 * Calculates grant utilization rate.
 *
 * @param {string} grantId - Grant ID
 * @param {Model} GrantAward - GrantAward model
 * @returns {Promise<any>} Utilization metrics
 */
export const calculateGrantUtilization = async (
  grantId: string,
  GrantAward: any,
): Promise<any> => {
  const grant = await GrantAward.findOne({ where: { grantId } });
  if (!grant) throw new Error('Grant not found');

  const utilizationRate = grant.awardAmount > 0
    ? (parseFloat(grant.totalExpenditures) / parseFloat(grant.awardAmount)) * 100
    : 0;

  const drawdownRate = grant.awardAmount > 0
    ? (parseFloat(grant.totalDrawdowns) / parseFloat(grant.awardAmount)) * 100
    : 0;

  return {
    grantId,
    grantNumber: grant.grantNumber,
    awardAmount: parseFloat(grant.awardAmount),
    totalExpenditures: parseFloat(grant.totalExpenditures),
    totalDrawdowns: parseFloat(grant.totalDrawdowns),
    remainingBalance: parseFloat(grant.remainingBalance),
    utilizationRate,
    drawdownRate,
  };
};

/**
 * Validates period of performance.
 *
 * @param {string} grantId - Grant ID
 * @param {Date} checkDate - Date to check
 * @param {Model} GrantAward - GrantAward model
 * @returns {Promise<{ valid: boolean; daysRemaining?: number }>}
 */
export const validatePeriodOfPerformance = async (
  grantId: string,
  checkDate: Date,
  GrantAward: any,
): Promise<{ valid: boolean; daysRemaining?: number }> => {
  const grant = await GrantAward.findOne({ where: { grantId } });
  if (!grant) throw new Error('Grant not found');

  const valid = checkDate >= grant.startDate && checkDate <= grant.endDate;
  const daysRemaining = valid
    ? Math.floor((grant.endDate.getTime() - checkDate.getTime()) / 86400000)
    : 0;

  return { valid, daysRemaining };
};

/**
 * Generates grant summary report.
 *
 * @param {string} grantId - Grant ID
 * @param {Model} GrantAward - GrantAward model
 * @param {Model} DrawdownRequest - DrawdownRequest model
 * @param {Model} GrantExpenditure - GrantExpenditure model
 * @returns {Promise<any>} Grant summary
 */
export const generateGrantSummary = async (
  grantId: string,
  GrantAward: any,
  DrawdownRequest: any,
  GrantExpenditure: any,
): Promise<any> => {
  const grant = await GrantAward.findOne({ where: { grantId } });
  if (!grant) throw new Error('Grant not found');

  const drawdowns = await DrawdownRequest.findAll({
    where: { grantId, status: 'disbursed' },
  });

  const expenditures = await GrantExpenditure.findAll({ where: { grantId } });

  return {
    grantId,
    grantNumber: grant.grantNumber,
    grantTitle: grant.grantTitle,
    awardAmount: parseFloat(grant.awardAmount),
    totalDrawdowns: drawdowns.reduce((sum: number, d: any) => sum + parseFloat(d.requestAmount), 0),
    totalExpenditures: expenditures.reduce((sum: number, e: any) => sum + parseFloat(e.amount), 0),
    drawdownCount: drawdowns.length,
    expenditureCount: expenditures.length,
    status: grant.status,
  };
};

// ============================================================================
// DRAWDOWN PROCESSING (7-12)
// ============================================================================

/**
 * Creates drawdown request.
 *
 * @param {DrawdownRequestData} drawdownData - Drawdown data
 * @param {Model} DrawdownRequest - DrawdownRequest model
 * @returns {Promise<any>} Created drawdown
 */
export const createDrawdownRequest = async (
  drawdownData: DrawdownRequestData,
  DrawdownRequest: any,
): Promise<any> => {
  return await DrawdownRequest.create(drawdownData);
};

/**
 * Validates drawdown request against grant balance.
 *
 * @param {string} grantId - Grant ID
 * @param {number} requestAmount - Request amount
 * @param {Model} GrantAward - GrantAward model
 * @returns {Promise<{ valid: boolean; availableBalance: number }>}
 */
export const validateDrawdownRequest = async (
  grantId: string,
  requestAmount: number,
  GrantAward: any,
): Promise<{ valid: boolean; availableBalance: number }> => {
  const grant = await GrantAward.findOne({ where: { grantId } });
  if (!grant) throw new Error('Grant not found');

  const availableBalance = parseFloat(grant.remainingBalance);
  const valid = availableBalance >= requestAmount;

  return { valid, availableBalance };
};

/**
 * Approves drawdown request.
 *
 * @param {string} drawdownId - Drawdown ID
 * @param {string} userId - Approver user ID
 * @param {Model} DrawdownRequest - DrawdownRequest model
 * @returns {Promise<any>} Approved drawdown
 */
export const approveDrawdownRequest = async (
  drawdownId: string,
  userId: string,
  DrawdownRequest: any,
): Promise<any> => {
  const drawdown = await DrawdownRequest.findOne({ where: { drawdownId } });
  if (!drawdown) throw new Error('Drawdown not found');

  drawdown.status = 'approved';
  drawdown.approvedBy = userId;
  drawdown.approvedDate = new Date();
  await drawdown.save();

  return drawdown;
};

/**
 * Processes drawdown disbursement.
 *
 * @param {string} drawdownId - Drawdown ID
 * @param {Model} DrawdownRequest - DrawdownRequest model
 * @param {Model} GrantAward - GrantAward model
 * @returns {Promise<any>} Disbursed drawdown
 */
export const processDrawdownDisbursement = async (
  drawdownId: string,
  DrawdownRequest: any,
  GrantAward: any,
): Promise<any> => {
  const drawdown = await DrawdownRequest.findOne({ where: { drawdownId } });
  if (!drawdown) throw new Error('Drawdown not found');

  if (drawdown.status !== 'approved') {
    throw new Error('Drawdown must be approved');
  }

  drawdown.status = 'disbursed';
  drawdown.disbursedDate = new Date();
  await drawdown.save();

  // Update grant totals
  const grant = await GrantAward.findOne({ where: { grantId: drawdown.grantId } });
  if (grant) {
    grant.totalDrawdowns += parseFloat(drawdown.requestAmount);
    grant.remainingBalance -= parseFloat(drawdown.requestAmount);
    await grant.save();
  }

  return drawdown;
};

/**
 * Retrieves drawdown history for grant.
 *
 * @param {string} grantId - Grant ID
 * @param {Model} DrawdownRequest - DrawdownRequest model
 * @returns {Promise<any[]>} Drawdown history
 */
export const getDrawdownHistory = async (
  grantId: string,
  DrawdownRequest: any,
): Promise<any[]> => {
  return await DrawdownRequest.findAll({
    where: { grantId },
    order: [['requestDate', 'DESC']],
  });
};

/**
 * Calculates drawdown burn rate.
 *
 * @param {string} grantId - Grant ID
 * @param {Model} DrawdownRequest - DrawdownRequest model
 * @param {Model} GrantAward - GrantAward model
 * @returns {Promise<any>} Burn rate analysis
 */
export const calculateDrawdownBurnRate = async (
  grantId: string,
  DrawdownRequest: any,
  GrantAward: any,
): Promise<any> => {
  const grant = await GrantAward.findOne({ where: { grantId } });
  if (!grant) throw new Error('Grant not found');

  const drawdowns = await DrawdownRequest.findAll({
    where: { grantId, status: 'disbursed' },
    order: [['disbursedDate', 'ASC']],
  });

  if (drawdowns.length === 0) {
    return { grantId, burnRate: 0, forecastCompletionDate: grant.endDate };
  }

  const firstDrawdown = drawdowns[0];
  const monthsElapsed = Math.max(
    1,
    (new Date().getTime() - firstDrawdown.disbursedDate.getTime()) / (30 * 86400000),
  );

  const totalDrawn = parseFloat(grant.totalDrawdowns);
  const burnRate = totalDrawn / monthsElapsed;

  const remaining = parseFloat(grant.awardAmount) - totalDrawn;
  const monthsToComplete = burnRate > 0 ? remaining / burnRate : 0;

  const forecastDate = new Date();
  forecastDate.setMonth(forecastDate.getMonth() + monthsToComplete);

  return {
    grantId,
    burnRate,
    monthsElapsed,
    totalDrawn,
    remaining,
    forecastCompletionDate: forecastDate,
  };
};

// ============================================================================
// MATCHING FUNDS MANAGEMENT (13-18)
// ============================================================================

/**
 * Records matching fund contribution.
 *
 * @param {MatchingFundData} matchData - Matching fund data
 * @param {Model} MatchingFund - MatchingFund model
 * @param {Model} GrantAward - GrantAward model
 * @returns {Promise<any>} Created matching fund
 */
export const recordMatchingFund = async (
  matchData: MatchingFundData,
  MatchingFund: any,
  GrantAward: any,
): Promise<any> => {
  const match = await MatchingFund.create(matchData);

  // Update grant total matching
  const grant = await GrantAward.findOne({ where: { grantId: matchData.grantId } });
  if (grant && matchData.verified) {
    grant.totalMatching += matchData.matchAmount;
    await grant.save();
  }

  return match;
};

/**
 * Verifies matching fund contribution.
 *
 * @param {string} matchId - Match ID
 * @param {string} userId - Verifier user ID
 * @param {Model} MatchingFund - MatchingFund model
 * @param {Model} GrantAward - GrantAward model
 * @returns {Promise<any>} Verified matching fund
 */
export const verifyMatchingFund = async (
  matchId: string,
  userId: string,
  MatchingFund: any,
  GrantAward: any,
): Promise<any> => {
  const match = await MatchingFund.findOne({ where: { matchId } });
  if (!match) throw new Error('Matching fund not found');

  match.verified = true;
  match.verifiedBy = userId;
  match.verifiedDate = new Date();
  await match.save();

  // Update grant total
  const grant = await GrantAward.findOne({ where: { grantId: match.grantId } });
  if (grant) {
    grant.totalMatching += parseFloat(match.matchAmount);
    await grant.save();
  }

  return match;
};

/**
 * Validates matching requirement compliance.
 *
 * @param {string} grantId - Grant ID
 * @param {Model} GrantAward - GrantAward model
 * @param {Model} MatchingFund - MatchingFund model
 * @returns {Promise<{ compliant: boolean; requiredMatch: number; actualMatch: number; shortfall: number }>}
 */
export const validateMatchingRequirement = async (
  grantId: string,
  GrantAward: any,
  MatchingFund: any,
): Promise<{ compliant: boolean; requiredMatch: number; actualMatch: number; shortfall: number }> => {
  const grant = await GrantAward.findOne({ where: { grantId } });
  if (!grant) throw new Error('Grant not found');

  const matches = await MatchingFund.findAll({
    where: { grantId, verified: true },
  });

  const actualMatch = matches.reduce((sum: number, m: any) => sum + parseFloat(m.matchAmount), 0);
  const requiredMatch = parseFloat(grant.matchingRequirement);
  const shortfall = Math.max(0, requiredMatch - actualMatch);

  return {
    compliant: actualMatch >= requiredMatch,
    requiredMatch,
    actualMatch,
    shortfall,
  };
};

/**
 * Retrieves matching funds by source type.
 *
 * @param {string} grantId - Grant ID
 * @param {Model} MatchingFund - MatchingFund model
 * @returns {Promise<any[]>} Matching by source
 */
export const getMatchingBySource = async (
  grantId: string,
  MatchingFund: any,
): Promise<any[]> => {
  const matches = await MatchingFund.findAll({ where: { grantId } });

  const bySource = new Map<string, number>();
  matches.forEach((match: any) => {
    const current = bySource.get(match.matchSource) || 0;
    bySource.set(match.matchSource, current + parseFloat(match.matchAmount));
  });

  return Array.from(bySource.entries()).map(([source, amount]) => ({
    matchSource: source,
    totalAmount: amount,
  }));
};

/**
 * Generates matching fund report.
 *
 * @param {string} grantId - Grant ID
 * @param {Model} GrantAward - GrantAward model
 * @param {Model} MatchingFund - MatchingFund model
 * @returns {Promise<any>} Matching report
 */
export const generateMatchingFundReport = async (
  grantId: string,
  GrantAward: any,
  MatchingFund: any,
): Promise<any> => {
  const grant = await GrantAward.findOne({ where: { grantId } });
  if (!grant) throw new Error('Grant not found');

  const validation = await validateMatchingRequirement(grantId, GrantAward, MatchingFund);
  const bySource = await getMatchingBySource(grantId, MatchingFund);

  return {
    grantId,
    grantNumber: grant.grantNumber,
    requiredMatch: validation.requiredMatch,
    actualMatch: validation.actualMatch,
    shortfall: validation.shortfall,
    compliant: validation.compliant,
    bySource,
  };
};

/**
 * Exports matching data to CSV.
 *
 * @param {string} grantId - Grant ID
 * @param {Model} MatchingFund - MatchingFund model
 * @returns {Promise<string>} CSV content
 */
export const exportMatchingDataCSV = async (
  grantId: string,
  MatchingFund: any,
): Promise<string> => {
  const matches = await MatchingFund.findAll({ where: { grantId } });

  const headers = 'Match ID,Source Type,Amount,Date,Verified,Description\n';
  const rows = matches.map((m: any) =>
    `${m.matchId},${m.matchSource},${m.matchAmount},${m.matchDate.toISOString().split('T')[0]},${m.verified},${m.description}`
  );

  return headers + rows.join('\n');
};

// ============================================================================
// EXPENDITURE TRACKING (19-24)
// ============================================================================

/**
 * Records grant expenditure with allowability check.
 *
 * @param {GrantExpenditureData} expenditureData - Expenditure data
 * @param {Model} GrantExpenditure - GrantExpenditure model
 * @param {Model} GrantAward - GrantAward model
 * @returns {Promise<any>} Created expenditure
 */
export const recordGrantExpenditure = async (
  expenditureData: GrantExpenditureData,
  GrantExpenditure: any,
  GrantAward: any,
): Promise<any> => {
  const expenditure = await GrantExpenditure.create({
    ...expenditureData,
    fiscalYear: expenditureData.expenditureDate.getFullYear(),
    fiscalPeriod: expenditureData.expenditureDate.getMonth() + 1,
  });

  // Update grant total
  const grant = await GrantAward.findOne({ where: { grantId: expenditureData.grantId } });
  if (grant) {
    grant.totalExpenditures += expenditureData.amount;
    await grant.save();
  }

  return expenditure;
};

/**
 * Validates cost allowability per 2 CFR 200.
 *
 * @param {GrantExpenditureData} expenditureData - Expenditure data
 * @returns {{ allowable: boolean; reasons: string[] }}
 */
export const validateCostAllowability = (
  expenditureData: GrantExpenditureData,
): { allowable: boolean; reasons: string[] } => {
  const reasons: string[] = [];

  if (!expenditureData.allowable) {
    reasons.push('Cost not allowable per grant terms');
  }

  if (!expenditureData.allocable) {
    reasons.push('Cost not allocable to grant');
  }

  if (!expenditureData.reasonable) {
    reasons.push('Cost not reasonable');
  }

  if (!expenditureData.documentRef) {
    reasons.push('Missing supporting documentation');
  }

  return {
    allowable: reasons.length === 0,
    reasons,
  };
};

/**
 * Calculates direct vs indirect costs.
 *
 * @param {string} grantId - Grant ID
 * @param {Model} GrantExpenditure - GrantExpenditure model
 * @returns {Promise<any>} Cost breakdown
 */
export const calculateDirectVsIndirectCosts = async (
  grantId: string,
  GrantExpenditure: any,
): Promise<any> => {
  const expenditures = await GrantExpenditure.findAll({ where: { grantId } });

  const directCosts = expenditures
    .filter((e: any) => e.directCost)
    .reduce((sum: number, e: any) => sum + parseFloat(e.amount), 0);

  const indirectCosts = expenditures
    .filter((e: any) => !e.directCost)
    .reduce((sum: number, e: any) => sum + parseFloat(e.amount), 0);

  const totalCosts = directCosts + indirectCosts;

  return {
    grantId,
    directCosts,
    indirectCosts,
    totalCosts,
    directPercent: totalCosts > 0 ? (directCosts / totalCosts) * 100 : 0,
    indirectPercent: totalCosts > 0 ? (indirectCosts / totalCosts) * 100 : 0,
  };
};

/**
 * Retrieves expenditures by cost category.
 *
 * @param {string} grantId - Grant ID
 * @param {Model} GrantExpenditure - GrantExpenditure model
 * @returns {Promise<any[]>} Expenditures by category
 */
export const getExpendituresByCategory = async (
  grantId: string,
  GrantExpenditure: any,
): Promise<any[]> => {
  const expenditures = await GrantExpenditure.findAll({ where: { grantId } });

  const byCategory = new Map<string, number>();
  expenditures.forEach((exp: any) => {
    const current = byCategory.get(exp.costCategory) || 0;
    byCategory.set(exp.costCategory, current + parseFloat(exp.amount));
  });

  return Array.from(byCategory.entries()).map(([category, amount]) => ({
    costCategory: category,
    totalAmount: amount,
  }));
};

/**
 * Applies indirect cost rate to eligible costs.
 *
 * @param {string} grantId - Grant ID
 * @param {number} fiscalYear - Fiscal year
 * @param {Model} GrantExpenditure - GrantExpenditure model
 * @param {Model} IndirectCostRate - IndirectCostRate model
 * @returns {Promise<{ mtdc: number; indirectCost: number; rate: number }>}
 */
export const applyIndirectCostRate = async (
  grantId: string,
  fiscalYear: number,
  GrantExpenditure: any,
  IndirectCostRate: any,
): Promise<{ mtdc: number; indirectCost: number; rate: number }> => {
  const rate = await IndirectCostRate.findOne({
    where: {
      fiscalYear,
      effectiveDate: { [Op.lte]: new Date() },
      expirationDate: { [Op.gte]: new Date() },
    },
  });

  if (!rate) {
    return { mtdc: 0, indirectCost: 0, rate: 0 };
  }

  const expenditures = await GrantExpenditure.findAll({
    where: { grantId, fiscalYear, directCost: true },
  });

  const mtdc = expenditures.reduce((sum: number, e: any) => sum + parseFloat(e.amount), 0);
  const indirectCost = mtdc * (parseFloat(rate.ratePercent) / 100);

  return {
    mtdc,
    indirectCost,
    rate: parseFloat(rate.ratePercent),
  };
};

/**
 * Generates expenditure variance report.
 *
 * @param {string} grantId - Grant ID
 * @param {Model} GrantAward - GrantAward model
 * @param {Model} GrantExpenditure - GrantExpenditure model
 * @returns {Promise<any>} Variance report
 */
export const generateExpenditureVarianceReport = async (
  grantId: string,
  GrantAward: any,
  GrantExpenditure: any,
): Promise<any> => {
  const grant = await GrantAward.findOne({ where: { grantId } });
  if (!grant) throw new Error('Grant not found');

  const byCategory = await getExpendituresByCategory(grantId, GrantExpenditure);

  const totalExpended = byCategory.reduce((sum, cat) => sum + cat.totalAmount, 0);
  const budgetVariance = parseFloat(grant.awardAmount) - totalExpended;

  return {
    grantId,
    awardAmount: parseFloat(grant.awardAmount),
    totalExpended,
    budgetVariance,
    variancePercent: grant.awardAmount > 0 ? (budgetVariance / parseFloat(grant.awardAmount)) * 100 : 0,
    byCategory,
  };
};

// ============================================================================
// COMPLIANCE & MONITORING (25-32)
// ============================================================================

/**
 * Performs compliance check for grant.
 *
 * @param {string} grantId - Grant ID
 * @param {string} checkType - Check type
 * @param {Model} GrantAward - GrantAward model
 * @param {Model} MatchingFund - MatchingFund model
 * @param {Model} GrantExpenditure - GrantExpenditure model
 * @returns {Promise<GrantComplianceCheckData>} Compliance check result
 */
export const performComplianceCheck = async (
  grantId: string,
  checkType: string,
  GrantAward: any,
  MatchingFund: any,
  GrantExpenditure: any,
): Promise<GrantComplianceCheckData> => {
  const findings: string[] = [];
  let status: 'compliant' | 'non_compliant' | 'needs_review' = 'compliant';

  if (checkType === 'matching_funds') {
    const validation = await validateMatchingRequirement(grantId, GrantAward, MatchingFund);
    if (!validation.compliant) {
      findings.push(`Matching shortfall: $${validation.shortfall}`);
      status = 'non_compliant';
    }
  }

  if (checkType === 'period_of_performance') {
    const popValidation = await validatePeriodOfPerformance(grantId, new Date(), GrantAward);
    if (!popValidation.valid) {
      findings.push('Outside period of performance');
      status = 'non_compliant';
    }
  }

  return {
    checkId: `CHK-${grantId}-${Date.now()}`,
    grantId,
    checkDate: new Date(),
    checkType: checkType as any,
    status,
    findings: findings.join('; '),
  };
};

/**
 * Monitors subrecipient compliance.
 *
 * @param {string} subrecipientId - Subrecipient ID
 * @param {Model} Subrecipient - Subrecipient model
 * @returns {Promise<any>} Monitoring result
 */
export const monitorSubrecipient = async (
  subrecipientId: string,
  Subrecipient: any,
): Promise<any> => {
  const subrecipient = await Subrecipient.findOne({ where: { subrecipientId } });
  if (!subrecipient) throw new Error('Subrecipient not found');

  subrecipient.lastMonitored = new Date();

  // Calculate next monitoring due based on frequency
  const nextDue = new Date();
  switch (subrecipient.monitoringFrequency) {
    case 'quarterly':
      nextDue.setMonth(nextDue.getMonth() + 3);
      break;
    case 'semi_annual':
      nextDue.setMonth(nextDue.getMonth() + 6);
      break;
    case 'annual':
      nextDue.setFullYear(nextDue.getFullYear() + 1);
      break;
  }

  subrecipient.nextMonitoringDue = nextDue;
  await subrecipient.save();

  return subrecipient;
};

/**
 * Retrieves subrecipients requiring monitoring.
 *
 * @param {Model} Subrecipient - Subrecipient model
 * @returns {Promise<any[]>} Subrecipients due for monitoring
 */
export const getSubrecipientsRequiringMonitoring = async (
  Subrecipient: any,
): Promise<any[]> => {
  return await Subrecipient.findAll({
    where: {
      nextMonitoringDue: { [Op.lte]: new Date() },
    },
    order: [['riskRating', 'DESC'], ['nextMonitoringDue', 'ASC']],
  });
};

/**
 * Generates compliance dashboard.
 *
 * @param {string} grantId - Grant ID
 * @param {Model} GrantAward - GrantAward model
 * @param {Model} MatchingFund - MatchingFund model
 * @param {Model} GrantExpenditure - GrantExpenditure model
 * @returns {Promise<any>} Compliance dashboard
 */
export const generateComplianceDashboard = async (
  grantId: string,
  GrantAward: any,
  MatchingFund: any,
  GrantExpenditure: any,
): Promise<any> => {
  const matchingCheck = await performComplianceCheck(grantId, 'matching_funds', GrantAward, MatchingFund, GrantExpenditure);
  const popCheck = await performComplianceCheck(grantId, 'period_of_performance', GrantAward, MatchingFund, GrantExpenditure);
  const utilization = await calculateGrantUtilization(grantId, GrantAward);

  return {
    grantId,
    overallStatus: matchingCheck.status === 'compliant' && popCheck.status === 'compliant' ? 'compliant' : 'issues_found',
    matchingCompliance: matchingCheck,
    periodOfPerformanceCompliance: popCheck,
    utilizationMetrics: utilization,
  };
};

/**
 * Validates single audit requirements.
 *
 * @param {string} grantId - Grant ID
 * @param {number} fiscalYear - Fiscal year
 * @param {Model} GrantExpenditure - GrantExpenditure model
 * @returns {Promise<{ required: boolean; totalExpended: number; threshold: number }>}
 */
export const validateSingleAuditRequirement = async (
  grantId: string,
  fiscalYear: number,
  GrantExpenditure: any,
): Promise<{ required: boolean; totalExpended: number; threshold: number }> => {
  const expenditures = await GrantExpenditure.findAll({
    where: { grantId, fiscalYear },
  });

  const totalExpended = expenditures.reduce(
    (sum: number, e: any) => sum + parseFloat(e.amount),
    0,
  );

  const threshold = 750000; // Single audit threshold

  return {
    required: totalExpended >= threshold,
    totalExpended,
    threshold,
  };
};

/**
 * Exports compliance report to PDF.
 *
 * @param {string} grantId - Grant ID
 * @param {Model} GrantAward - GrantAward model
 * @param {Model} MatchingFund - MatchingFund model
 * @param {Model} GrantExpenditure - GrantExpenditure model
 * @returns {Promise<Buffer>} PDF buffer
 */
export const exportComplianceReportPDF = async (
  grantId: string,
  GrantAward: any,
  MatchingFund: any,
  GrantExpenditure: any,
): Promise<Buffer> => {
  const dashboard = await generateComplianceDashboard(grantId, GrantAward, MatchingFund, GrantExpenditure);

  const content = `
GRANT COMPLIANCE REPORT
Grant ID: ${grantId}
Date: ${new Date().toISOString().split('T')[0]}

Overall Status: ${dashboard.overallStatus}

Matching Fund Compliance: ${dashboard.matchingCompliance.status}
Findings: ${dashboard.matchingCompliance.findings || 'None'}

Period of Performance: ${dashboard.periodOfPerformanceCompliance.status}

Utilization Rate: ${dashboard.utilizationMetrics.utilizationRate.toFixed(2)}%

Generated: ${new Date().toISOString()}
`;

  return Buffer.from(content, 'utf-8');
};

/**
 * Generates federal audit package.
 *
 * @param {string} grantId - Grant ID
 * @param {number} fiscalYear - Fiscal year
 * @param {Model} GrantAward - GrantAward model
 * @param {Model} GrantExpenditure - GrantExpenditure model
 * @param {Model} DrawdownRequest - DrawdownRequest model
 * @returns {Promise<any>} Audit package
 */
export const generateFederalAuditPackage = async (
  grantId: string,
  fiscalYear: number,
  GrantAward: any,
  GrantExpenditure: any,
  DrawdownRequest: any,
): Promise<any> => {
  const grant = await GrantAward.findOne({ where: { grantId } });
  const expenditures = await GrantExpenditure.findAll({ where: { grantId, fiscalYear } });
  const drawdowns = await DrawdownRequest.findAll({ where: { grantId, status: 'disbursed' } });

  const totalExpended = expenditures.reduce((sum: number, e: any) => sum + parseFloat(e.amount), 0);
  const totalDrawn = drawdowns.reduce((sum: number, d: any) => sum + parseFloat(d.requestAmount), 0);

  return {
    grantId,
    grantNumber: grant.grantNumber,
    cfda: grant.cfda,
    fiscalYear,
    awardAmount: parseFloat(grant.awardAmount),
    totalExpended,
    totalDrawn,
    expenditureCount: expenditures.length,
    drawdownCount: drawdowns.length,
    expenditures,
    drawdowns,
  };
};

/**
 * Validates cost allocation compliance.
 *
 * @param {string} grantId - Grant ID
 * @param {Model} GrantExpenditure - GrantExpenditure model
 * @returns {Promise<{ compliant: boolean; issues: string[] }>}
 */
export const validateCostAllocationCompliance = async (
  grantId: string,
  GrantExpenditure: any,
): Promise<{ compliant: boolean; issues: string[] }> => {
  const expenditures = await GrantExpenditure.findAll({ where: { grantId } });
  const issues: string[] = [];

  expenditures.forEach((exp: any) => {
    if (!exp.allowable) {
      issues.push(`Expenditure ${exp.expenditureId} not allowable`);
    }
    if (!exp.allocable) {
      issues.push(`Expenditure ${exp.expenditureId} not allocable`);
    }
    if (!exp.reasonable) {
      issues.push(`Expenditure ${exp.expenditureId} not reasonable`);
    }
  });

  return {
    compliant: issues.length === 0,
    issues,
  };
};

// ============================================================================
// REPORTING (33-38)
// ============================================================================

/**
 * Generates financial status report (FSR).
 *
 * @param {string} grantId - Grant ID
 * @param {Date} reportingPeriodStart - Period start
 * @param {Date} reportingPeriodEnd - Period end
 * @param {Model} GrantAward - GrantAward model
 * @param {Model} GrantExpenditure - GrantExpenditure model
 * @param {Model} DrawdownRequest - DrawdownRequest model
 * @returns {Promise<any>} FSR report
 */
export const generateFinancialStatusReport = async (
  grantId: string,
  reportingPeriodStart: Date,
  reportingPeriodEnd: Date,
  GrantAward: any,
  GrantExpenditure: any,
  DrawdownRequest: any,
): Promise<any> => {
  const grant = await GrantAward.findOne({ where: { grantId } });
  if (!grant) throw new Error('Grant not found');

  const expenditures = await GrantExpenditure.findAll({
    where: {
      grantId,
      expenditureDate: { [Op.between]: [reportingPeriodStart, reportingPeriodEnd] },
    },
  });

  const drawdowns = await DrawdownRequest.findAll({
    where: {
      grantId,
      disbursedDate: { [Op.between]: [reportingPeriodStart, reportingPeriodEnd] },
      status: 'disbursed',
    },
  });

  const periodExpended = expenditures.reduce((sum: number, e: any) => sum + parseFloat(e.amount), 0);
  const periodDrawn = drawdowns.reduce((sum: number, d: any) => sum + parseFloat(d.requestAmount), 0);

  return {
    grantId,
    grantNumber: grant.grantNumber,
    reportingPeriod: {
      start: reportingPeriodStart,
      end: reportingPeriodEnd,
    },
    awardAmount: parseFloat(grant.awardAmount),
    periodExpended,
    periodDrawn,
    cumulativeExpended: parseFloat(grant.totalExpenditures),
    cumulativeDrawn: parseFloat(grant.totalDrawdowns),
    remainingBalance: parseFloat(grant.remainingBalance),
  };
};

/**
 * Generates performance progress report (PPR).
 *
 * @param {string} grantId - Grant ID
 * @param {Date} reportingPeriod - Reporting period
 * @param {Model} GrantAward - GrantAward model
 * @returns {Promise<any>} PPR report
 */
export const generatePerformanceProgressReport = async (
  grantId: string,
  reportingPeriod: Date,
  GrantAward: any,
): Promise<any> => {
  const grant = await GrantAward.findOne({ where: { grantId } });
  if (!grant) throw new Error('Grant not found');

  const utilization = await calculateGrantUtilization(grantId, GrantAward);

  const totalDays = Math.floor(
    (grant.endDate.getTime() - grant.startDate.getTime()) / 86400000,
  );
  const elapsedDays = Math.floor(
    (reportingPeriod.getTime() - grant.startDate.getTime()) / 86400000,
  );
  const percentTimeElapsed = (elapsedDays / totalDays) * 100;

  return {
    grantId,
    grantNumber: grant.grantNumber,
    grantTitle: grant.grantTitle,
    reportingPeriod,
    percentTimeElapsed,
    percentBudgetUtilized: utilization.utilizationRate,
    onTrack: Math.abs(percentTimeElapsed - utilization.utilizationRate) <= 10,
  };
};

/**
 * Generates final grant closeout report.
 *
 * @param {string} grantId - Grant ID
 * @param {Model} GrantAward - GrantAward model
 * @param {Model} GrantExpenditure - GrantExpenditure model
 * @param {Model} DrawdownRequest - DrawdownRequest model
 * @param {Model} MatchingFund - MatchingFund model
 * @returns {Promise<any>} Closeout report
 */
export const generateGrantCloseoutReport = async (
  grantId: string,
  GrantAward: any,
  GrantExpenditure: any,
  DrawdownRequest: any,
  MatchingFund: any,
): Promise<any> => {
  const grant = await GrantAward.findOne({ where: { grantId } });
  if (!grant) throw new Error('Grant not found');

  const summary = await generateGrantSummary(grantId, GrantAward, DrawdownRequest, GrantExpenditure);
  const matchingReport = await generateMatchingFundReport(grantId, GrantAward, MatchingFund);
  const costBreakdown = await calculateDirectVsIndirectCosts(grantId, GrantExpenditure);

  return {
    grantId,
    grantNumber: grant.grantNumber,
    grantTitle: grant.grantTitle,
    periodOfPerformance: {
      start: grant.startDate,
      end: grant.endDate,
    },
    awardAmount: parseFloat(grant.awardAmount),
    totalExpended: summary.totalExpenditures,
    totalDrawn: summary.totalDrawdowns,
    matchingRequirement: matchingReport.requiredMatch,
    matchingProvided: matchingReport.actualMatch,
    matchingCompliant: matchingReport.compliant,
    directCosts: costBreakdown.directCosts,
    indirectCosts: costBreakdown.indirectCosts,
    unexpendedBalance: parseFloat(grant.awardAmount) - summary.totalExpenditures,
  };
};

/**
 * Exports all grant reports to archive.
 *
 * @param {string} grantId - Grant ID
 * @param {Model} GrantAward - GrantAward model
 * @param {Model} GrantExpenditure - GrantExpenditure model
 * @param {Model} DrawdownRequest - DrawdownRequest model
 * @param {Model} MatchingFund - MatchingFund model
 * @returns {Promise<any>} Report archive
 */
export const exportGrantReportArchive = async (
  grantId: string,
  GrantAward: any,
  GrantExpenditure: any,
  DrawdownRequest: any,
  MatchingFund: any,
): Promise<any> => {
  const closeout = await generateGrantCloseoutReport(
    grantId,
    GrantAward,
    GrantExpenditure,
    DrawdownRequest,
    MatchingFund,
  );

  const compliance = await generateComplianceDashboard(
    grantId,
    GrantAward,
    MatchingFund,
    GrantExpenditure,
  );

  return {
    grantId,
    exportDate: new Date(),
    closeoutReport: closeout,
    complianceDashboard: compliance,
  };
};

/**
 * Validates grant reporting completeness.
 *
 * @param {string} grantId - Grant ID
 * @param {Model} GrantAward - GrantAward model
 * @returns {Promise<{ complete: boolean; missingReports: string[] }>}
 */
export const validateGrantReportingCompleteness = async (
  grantId: string,
  GrantAward: any,
): Promise<{ complete: boolean; missingReports: string[] }> => {
  const grant = await GrantAward.findOne({ where: { grantId } });
  if (!grant) throw new Error('Grant not found');

  const missingReports: string[] = [];

  // Check for required reports based on grant status
  if (grant.status === 'closed') {
    // Final reports required
    if (!grant.metadata?.finalFSRSubmitted) {
      missingReports.push('Final FSR');
    }
    if (!grant.metadata?.finalPPRSubmitted) {
      missingReports.push('Final PPR');
    }
    if (!grant.metadata?.closeoutReportSubmitted) {
      missingReports.push('Closeout Report');
    }
  }

  return {
    complete: missingReports.length === 0,
    missingReports,
  };
};

/**
 * Generates CFDA schedule for audit.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {Model} GrantAward - GrantAward model
 * @param {Model} GrantExpenditure - GrantExpenditure model
 * @returns {Promise<any[]>} CFDA schedule
 */
export const generateCFDASchedule = async (
  fiscalYear: number,
  GrantAward: any,
  GrantExpenditure: any,
): Promise<any[]> => {
  const grants = await GrantAward.findAll({ where: { status: 'active' } });

  const cfdaMap = new Map<string, { cfda: string; totalExpended: number; grantsCount: number }>();

  for (const grant of grants) {
    const expenditures = await GrantExpenditure.findAll({
      where: { grantId: grant.grantId, fiscalYear },
    });

    const totalExpended = expenditures.reduce(
      (sum: number, e: any) => sum + parseFloat(e.amount),
      0,
    );

    const current = cfdaMap.get(grant.cfda) || { cfda: grant.cfda, totalExpended: 0, grantsCount: 0 };
    current.totalExpended += totalExpended;
    current.grantsCount++;
    cfdaMap.set(grant.cfda, current);
  }

  return Array.from(cfdaMap.values());
};

// ============================================================================
// NESTJS SERVICE WRAPPER
// ============================================================================

@Injectable()
export class CEFMSGrantsAssistanceService {
  constructor(private readonly sequelize: Sequelize) {}

  async createGrant(grantData: GrantAwardData) {
    const GrantAward = createGrantAwardModel(this.sequelize);
    return createGrantAward(grantData, GrantAward);
  }

  async processDrawdown(drawdownData: DrawdownRequestData) {
    const DrawdownRequest = createDrawdownRequestModel(this.sequelize);
    return createDrawdownRequest(drawdownData, DrawdownRequest);
  }

  async recordMatching(matchData: MatchingFundData) {
    const MatchingFund = createMatchingFundModel(this.sequelize);
    const GrantAward = createGrantAwardModel(this.sequelize);
    return recordMatchingFund(matchData, MatchingFund, GrantAward);
  }

  async checkCompliance(grantId: string) {
    const GrantAward = createGrantAwardModel(this.sequelize);
    const MatchingFund = createMatchingFundModel(this.sequelize);
    const GrantExpenditure = createGrantExpenditureModel(this.sequelize);
    return generateComplianceDashboard(grantId, GrantAward, MatchingFund, GrantExpenditure);
  }
}

export default {
  // Models
  createGrantAwardModel,
  createDrawdownRequestModel,
  createMatchingFundModel,
  createGrantExpenditureModel,
  createIndirectCostRateModel,
  createSubrecipientModel,

  // Grant Awards
  createGrantAward,
  updateGrantStatus,
  getActiveGrants,
  calculateGrantUtilization,
  validatePeriodOfPerformance,
  generateGrantSummary,

  // Drawdowns
  createDrawdownRequest,
  validateDrawdownRequest,
  approveDrawdownRequest,
  processDrawdownDisbursement,
  getDrawdownHistory,
  calculateDrawdownBurnRate,

  // Matching
  recordMatchingFund,
  verifyMatchingFund,
  validateMatchingRequirement,
  getMatchingBySource,
  generateMatchingFundReport,
  exportMatchingDataCSV,

  // Expenditures
  recordGrantExpenditure,
  validateCostAllowability,
  calculateDirectVsIndirectCosts,
  getExpendituresByCategory,
  applyIndirectCostRate,
  generateExpenditureVarianceReport,

  // Compliance
  performComplianceCheck,
  monitorSubrecipient,
  getSubrecipientsRequiringMonitoring,
  generateComplianceDashboard,
  validateSingleAuditRequirement,
  exportComplianceReportPDF,
  generateFederalAuditPackage,
  validateCostAllocationCompliance,

  // Reporting
  generateFinancialStatusReport,
  generatePerformanceProgressReport,
  generateGrantCloseoutReport,
  exportGrantReportArchive,
  validateGrantReportingCompleteness,
  generateCFDASchedule,

  // Service
  CEFMSGrantsAssistanceService,
};
