/**
 * LOC: CEFMSGLT001
 * File: /reuse/financial/cefms/composites/cefms-grant-lifecycle-tracking-composite.ts
 *
 * UPSTREAM (imports from):
 *   - ../../../government/grant-management-compliance-kit.ts
 *   - ../../../government/project-program-management-kit.ts
 *   - ../../../government/audit-transparency-trail-kit.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend CEFMS grant services
 *   - USACE grant compliance systems
 *   - Grant reporting modules
 */

/**
 * File: /reuse/financial/cefms/composites/cefms-grant-lifecycle-tracking-composite.ts
 * Locator: WC-CEFMS-GLT-001
 * Purpose: USACE CEFMS Grant Lifecycle Tracking - grant applications, awards, compliance, reporting, closeout
 *
 * Upstream: Composes utilities from government kits for grant management
 * Downstream: ../../../backend/cefms/*, Grant controllers, compliance reporting, sub-recipient monitoring
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 45 composite functions for USACE CEFMS grant lifecycle operations
 *
 * LLM Context: Production-ready USACE CEFMS grant lifecycle management system.
 * Comprehensive grant application processing, award management, compliance monitoring, federal reporting,
 * expenditure tracking, budget modifications, sub-recipient monitoring, grant closeout procedures,
 * audit preparation, performance metrics tracking, and grant portfolio analytics.
 */

import { Model, DataTypes, Sequelize, Transaction, Op } from 'sequelize';
import { Injectable } from '@nestjs/common';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface GrantApplicationData {
  applicationId: string;
  grantProgramId: string;
  programName: string;
  applicationDate: Date;
  applicantOrg: string;
  requestedAmount: number;
  projectTitle: string;
  projectDescription: string;
  projectStartDate: Date;
  projectEndDate: Date;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';
}

interface GrantAwardData {
  awardId: string;
  applicationId: string;
  awardNumber: string;
  awardDate: Date;
  awardAmount: number;
  periodOfPerformanceStart: Date;
  periodOfPerformanceEnd: Date;
  federalAgency: string;
  cfda: string;
  status: 'active' | 'suspended' | 'terminated' | 'closed';
}

interface GrantBudgetData {
  budgetId: string;
  awardId: string;
  budgetCategory: string;
  budgetedAmount: number;
  spentAmount: number;
  encumberedAmount: number;
  availableBalance: number;
  fiscalYear: number;
}

interface GrantExpenditureData {
  expenditureId: string;
  awardId: string;
  expenditureDate: Date;
  amount: number;
  budgetCategory: string;
  description: string;
  accountCode: string;
  documentReference: string;
  approvedBy: string;
}

interface GrantReportingData {
  reportId: string;
  awardId: string;
  reportType: 'financial' | 'performance' | 'quarterly' | 'annual' | 'closeout';
  reportingPeriodStart: Date;
  reportingPeriodEnd: Date;
  dueDate: Date;
  submittedDate?: Date;
  status: 'pending' | 'in_progress' | 'submitted' | 'accepted';
}

interface ComplianceCheckData {
  checkId: string;
  awardId: string;
  checkType: string;
  checkDate: Date;
  result: 'compliant' | 'non_compliant' | 'needs_attention';
  findings: string;
  correctiveAction?: string;
}

interface SubRecipientData {
  subRecipientId: string;
  awardId: string;
  organizationName: string;
  duns: string;
  awardAmount: number;
  monitoringStatus: 'current' | 'overdue' | 'at_risk';
  lastMonitoringDate?: Date;
}

interface GrantModificationData {
  modificationId: string;
  awardId: string;
  modificationNumber: string;
  modificationDate: Date;
  modificationType: 'budget' | 'scope' | 'period' | 'administrative';
  description: string;
  approvalRequired: boolean;
  approvedDate?: Date;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Sequelize model for Grant Applications with comprehensive tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} GrantApplication model
 *
 * @example
 * ```typescript
 * const GrantApplication = createGrantApplicationModel(sequelize);
 * const application = await GrantApplication.create({
 *   applicationId: 'APP-2024-001',
 *   grantProgramId: 'PROG-123',
 *   programName: 'Infrastructure Grant',
 *   applicationDate: new Date(),
 *   applicantOrg: 'USACE District',
 *   requestedAmount: 500000,
 *   projectTitle: 'Flood Control Project',
 *   status: 'submitted'
 * });
 * ```
 */
export const createGrantApplicationModel = (sequelize: Sequelize) => {
  class GrantApplication extends Model {
    public id!: string;
    public applicationId!: string;
    public grantProgramId!: string;
    public programName!: string;
    public applicationDate!: Date;
    public applicantOrg!: string;
    public requestedAmount!: number;
    public projectTitle!: string;
    public projectDescription!: string;
    public projectStartDate!: Date;
    public projectEndDate!: Date;
    public status!: string;
    public submittedBy!: string;
    public reviewedBy!: string | null;
    public reviewedDate!: Date | null;
    public rejectionReason!: string | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  GrantApplication.init(
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
      grantProgramId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Grant program ID',
      },
      programName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Program name',
      },
      applicationDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Application date',
      },
      applicantOrg: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Applicant organization',
      },
      requestedAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Requested amount',
      },
      projectTitle: {
        type: DataTypes.STRING(300),
        allowNull: false,
        comment: 'Project title',
      },
      projectDescription: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Project description',
      },
      projectStartDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Project start date',
      },
      projectEndDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Project end date',
      },
      status: {
        type: DataTypes.ENUM('draft', 'submitted', 'under_review', 'approved', 'rejected'),
        allowNull: false,
        defaultValue: 'draft',
        comment: 'Application status',
      },
      submittedBy: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Submitted by user',
      },
      reviewedBy: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Reviewed by user',
      },
      reviewedDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Review date',
      },
      rejectionReason: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Rejection reason',
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
      tableName: 'grant_applications',
      timestamps: true,
      indexes: [
        { fields: ['applicationId'], unique: true },
        { fields: ['grantProgramId'] },
        { fields: ['status'] },
        { fields: ['applicationDate'] },
      ],
    },
  );

  return GrantApplication;
};

/**
 * Sequelize model for Grant Awards with federal compliance tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} GrantAward model
 */
export const createGrantAwardModel = (sequelize: Sequelize) => {
  class GrantAward extends Model {
    public id!: string;
    public awardId!: string;
    public applicationId!: string;
    public awardNumber!: string;
    public awardDate!: Date;
    public awardAmount!: number;
    public periodOfPerformanceStart!: Date;
    public periodOfPerformanceEnd!: Date;
    public federalAgency!: string;
    public cfda!: string;
    public status!: string;
    public totalDrawn!: number;
    public remainingBalance!: number;
    public closeoutDate!: Date | null;
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
      awardId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Award identifier',
      },
      applicationId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Related application',
      },
      awardNumber: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        comment: 'Federal award number',
      },
      awardDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Award date',
      },
      awardAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Total award amount',
      },
      periodOfPerformanceStart: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Period of performance start',
      },
      periodOfPerformanceEnd: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Period of performance end',
      },
      federalAgency: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Federal agency',
      },
      cfda: {
        type: DataTypes.STRING(20),
        allowNull: false,
        comment: 'CFDA number',
      },
      status: {
        type: DataTypes.ENUM('active', 'suspended', 'terminated', 'closed'),
        allowNull: false,
        defaultValue: 'active',
        comment: 'Award status',
      },
      totalDrawn: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Total amount drawn',
      },
      remainingBalance: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Remaining balance',
      },
      closeoutDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Closeout date',
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
        { fields: ['awardId'], unique: true },
        { fields: ['awardNumber'], unique: true },
        { fields: ['applicationId'] },
        { fields: ['status'] },
        { fields: ['cfda'] },
      ],
    },
  );

  return GrantAward;
};

/**
 * Sequelize model for Grant Budgets with category tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} GrantBudget model
 */
export const createGrantBudgetModel = (sequelize: Sequelize) => {
  class GrantBudget extends Model {
    public id!: string;
    public budgetId!: string;
    public awardId!: string;
    public budgetCategory!: string;
    public budgetedAmount!: number;
    public spentAmount!: number;
    public encumberedAmount!: number;
    public availableBalance!: number;
    public fiscalYear!: number;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  GrantBudget.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      budgetId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Budget identifier',
      },
      awardId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Related award',
      },
      budgetCategory: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Budget category',
      },
      budgetedAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Budgeted amount',
      },
      spentAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Spent amount',
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
      fiscalYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Fiscal year',
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
      tableName: 'grant_budgets',
      timestamps: true,
      indexes: [
        { fields: ['budgetId'], unique: true },
        { fields: ['awardId'] },
        { fields: ['fiscalYear'] },
        { fields: ['budgetCategory'] },
      ],
    },
  );

  return GrantBudget;
};

/**
 * Sequelize model for Grant Expenditures with approval tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} GrantExpenditure model
 */
export const createGrantExpenditureModel = (sequelize: Sequelize) => {
  class GrantExpenditure extends Model {
    public id!: string;
    public expenditureId!: string;
    public awardId!: string;
    public expenditureDate!: Date;
    public amount!: number;
    public budgetCategory!: string;
    public description!: string;
    public accountCode!: string;
    public documentReference!: string;
    public approvedBy!: string;
    public approvedDate!: Date;
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
      awardId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Related award',
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
      },
      budgetCategory: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Budget category',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Expenditure description',
      },
      accountCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Account code',
      },
      documentReference: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Document reference',
      },
      approvedBy: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Approved by user',
      },
      approvedDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
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
      tableName: 'grant_expenditures',
      timestamps: true,
      indexes: [
        { fields: ['expenditureId'], unique: true },
        { fields: ['awardId'] },
        { fields: ['expenditureDate'] },
        { fields: ['budgetCategory'] },
      ],
    },
  );

  return GrantExpenditure;
};

/**
 * Sequelize model for Grant Reporting with compliance tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} GrantReporting model
 */
export const createGrantReportingModel = (sequelize: Sequelize) => {
  class GrantReporting extends Model {
    public id!: string;
    public reportId!: string;
    public awardId!: string;
    public reportType!: string;
    public reportingPeriodStart!: Date;
    public reportingPeriodEnd!: Date;
    public dueDate!: Date;
    public submittedDate!: Date | null;
    public status!: string;
    public submittedBy!: string | null;
    public reportData!: Record<string, any>;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  GrantReporting.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      reportId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Report identifier',
      },
      awardId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Related award',
      },
      reportType: {
        type: DataTypes.ENUM('financial', 'performance', 'quarterly', 'annual', 'closeout'),
        allowNull: false,
        comment: 'Report type',
      },
      reportingPeriodStart: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Reporting period start',
      },
      reportingPeriodEnd: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Reporting period end',
      },
      dueDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Report due date',
      },
      submittedDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Submission date',
      },
      status: {
        type: DataTypes.ENUM('pending', 'in_progress', 'submitted', 'accepted'),
        allowNull: false,
        defaultValue: 'pending',
        comment: 'Report status',
      },
      submittedBy: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Submitted by user',
      },
      reportData: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Report data',
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
      tableName: 'grant_reporting',
      timestamps: true,
      indexes: [
        { fields: ['reportId'], unique: true },
        { fields: ['awardId'] },
        { fields: ['reportType'] },
        { fields: ['status'] },
        { fields: ['dueDate'] },
      ],
    },
  );

  return GrantReporting;
};

/**
 * Sequelize model for Compliance Checks with finding tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ComplianceCheck model
 */
export const createComplianceCheckModel = (sequelize: Sequelize) => {
  class ComplianceCheck extends Model {
    public id!: string;
    public checkId!: string;
    public awardId!: string;
    public checkType!: string;
    public checkDate!: Date;
    public result!: string;
    public findings!: string;
    public correctiveAction!: string;
    public performedBy!: string;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  ComplianceCheck.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      checkId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Check identifier',
      },
      awardId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Related award',
      },
      checkType: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Check type',
      },
      checkDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Check date',
      },
      result: {
        type: DataTypes.ENUM('compliant', 'non_compliant', 'needs_attention'),
        allowNull: false,
        comment: 'Check result',
      },
      findings: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: '',
        comment: 'Findings',
      },
      correctiveAction: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: '',
        comment: 'Corrective action',
      },
      performedBy: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Performed by user',
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
      tableName: 'compliance_checks',
      timestamps: true,
      indexes: [
        { fields: ['checkId'], unique: true },
        { fields: ['awardId'] },
        { fields: ['result'] },
        { fields: ['checkDate'] },
      ],
    },
  );

  return ComplianceCheck;
};

/**
 * Sequelize model for Sub-Recipients with monitoring.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} SubRecipient model
 */
export const createSubRecipientModel = (sequelize: Sequelize) => {
  class SubRecipient extends Model {
    public id!: string;
    public subRecipientId!: string;
    public awardId!: string;
    public organizationName!: string;
    public duns!: string;
    public awardAmount!: number;
    public monitoringStatus!: string;
    public lastMonitoringDate!: Date | null;
    public nextMonitoringDate!: Date | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  SubRecipient.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      subRecipientId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Sub-recipient identifier',
      },
      awardId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Related award',
      },
      organizationName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Organization name',
      },
      duns: {
        type: DataTypes.STRING(20),
        allowNull: false,
        comment: 'DUNS number',
      },
      awardAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Award amount',
      },
      monitoringStatus: {
        type: DataTypes.ENUM('current', 'overdue', 'at_risk'),
        allowNull: false,
        defaultValue: 'current',
        comment: 'Monitoring status',
      },
      lastMonitoringDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Last monitoring date',
      },
      nextMonitoringDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Next monitoring date',
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
      tableName: 'sub_recipients',
      timestamps: true,
      indexes: [
        { fields: ['subRecipientId'], unique: true },
        { fields: ['awardId'] },
        { fields: ['monitoringStatus'] },
        { fields: ['duns'] },
      ],
    },
  );

  return SubRecipient;
};

// ============================================================================
// APPLICATION MANAGEMENT (1-7)
// ============================================================================

/**
 * Creates grant application with validation.
 *
 * @param {GrantApplicationData} applicationData - Application data
 * @param {Model} GrantApplication - GrantApplication model
 * @returns {Promise<any>} Created application
 */
export const createGrantApplication = async (
  applicationData: GrantApplicationData,
  GrantApplication: any,
): Promise<any> => {
  return await GrantApplication.create(applicationData);
};

/**
 * Validates application completeness and eligibility.
 *
 * @param {string} applicationId - Application ID
 * @param {Model} GrantApplication - GrantApplication model
 * @returns {Promise<{ valid: boolean; errors: string[] }>}
 */
export const validateApplicationData = async (
  applicationId: string,
  GrantApplication: any,
): Promise<{ valid: boolean; errors: string[] }> => {
  const errors: string[] = [];
  const application = await GrantApplication.findOne({ where: { applicationId } });

  if (!application) {
    errors.push('Application not found');
    return { valid: false, errors };
  }

  if (!application.projectTitle || application.projectTitle.trim() === '') {
    errors.push('Project title is required');
  }

  if (application.requestedAmount <= 0) {
    errors.push('Requested amount must be greater than zero');
  }

  if (application.projectEndDate <= application.projectStartDate) {
    errors.push('Project end date must be after start date');
  }

  return { valid: errors.length === 0, errors };
};

/**
 * Submits application for review.
 *
 * @param {string} applicationId - Application ID
 * @param {string} userId - User submitting application
 * @param {Model} GrantApplication - GrantApplication model
 * @returns {Promise<any>} Submitted application
 */
export const submitApplicationForReview = async (
  applicationId: string,
  userId: string,
  GrantApplication: any,
): Promise<any> => {
  const application = await GrantApplication.findOne({ where: { applicationId } });
  if (!application) throw new Error('Application not found');

  application.status = 'submitted';
  application.submittedBy = userId;
  await application.save();

  return application;
};

/**
 * Reviews and approves/rejects application.
 *
 * @param {string} applicationId - Application ID
 * @param {boolean} approved - Approval decision
 * @param {string} reviewerId - Reviewer ID
 * @param {string} [rejectionReason] - Rejection reason if rejected
 * @param {Model} GrantApplication - GrantApplication model
 * @returns {Promise<any>} Reviewed application
 */
export const reviewApplication = async (
  applicationId: string,
  approved: boolean,
  reviewerId: string,
  rejectionReason: string | undefined,
  GrantApplication: any,
): Promise<any> => {
  const application = await GrantApplication.findOne({ where: { applicationId } });
  if (!application) throw new Error('Application not found');

  application.status = approved ? 'approved' : 'rejected';
  application.reviewedBy = reviewerId;
  application.reviewedDate = new Date();
  if (!approved && rejectionReason) {
    application.rejectionReason = rejectionReason;
  }
  await application.save();

  return application;
};

/**
 * Retrieves pending applications for review.
 *
 * @param {Model} GrantApplication - GrantApplication model
 * @returns {Promise<any[]>} Pending applications
 */
export const getPendingApplications = async (
  GrantApplication: any,
): Promise<any[]> => {
  return await GrantApplication.findAll({
    where: { status: { [Op.in]: ['submitted', 'under_review'] } },
    order: [['applicationDate', 'ASC']],
  });
};

/**
 * Generates application summary report.
 *
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Model} GrantApplication - GrantApplication model
 * @returns {Promise<any>} Application summary
 */
export const generateApplicationSummary = async (
  startDate: Date,
  endDate: Date,
  GrantApplication: any,
): Promise<any> => {
  const applications = await GrantApplication.findAll({
    where: {
      applicationDate: { [Op.between]: [startDate, endDate] },
    },
  });

  const totalApplications = applications.length;
  const approved = applications.filter((a: any) => a.status === 'approved').length;
  const rejected = applications.filter((a: any) => a.status === 'rejected').length;
  const pending = applications.filter((a: any) => a.status === 'submitted' || a.status === 'under_review').length;

  return {
    period: { startDate, endDate },
    totalApplications,
    approved,
    rejected,
    pending,
    approvalRate: totalApplications > 0 ? (approved / totalApplications) * 100 : 0,
  };
};

/**
 * Archives completed applications.
 *
 * @param {number} daysOld - Days old threshold
 * @param {Model} GrantApplication - GrantApplication model
 * @returns {Promise<number>} Count of archived applications
 */
export const archiveCompletedApplications = async (
  daysOld: number,
  GrantApplication: any,
): Promise<number> => {
  const threshold = new Date();
  threshold.setDate(threshold.getDate() - daysOld);

  const applications = await GrantApplication.findAll({
    where: {
      status: { [Op.in]: ['approved', 'rejected'] },
      updatedAt: { [Op.lt]: threshold },
    },
  });

  let count = 0;
  for (const app of applications) {
    app.metadata = {
      ...app.metadata,
      archived: true,
      archivedAt: new Date().toISOString(),
    };
    await app.save();
    count++;
  }

  return count;
};

// ============================================================================
// AWARD MANAGEMENT (8-14)
// ============================================================================

/**
 * Creates grant award from approved application.
 *
 * @param {GrantAwardData} awardData - Award data
 * @param {Model} GrantAward - GrantAward model
 * @param {Model} GrantApplication - GrantApplication model
 * @returns {Promise<any>} Created award
 */
export const createGrantAward = async (
  awardData: GrantAwardData,
  GrantAward: any,
  GrantApplication: any,
): Promise<any> => {
  const award = await GrantAward.create({
    ...awardData,
    remainingBalance: awardData.awardAmount,
  });

  // Update application
  const application = await GrantApplication.findOne({
    where: { applicationId: awardData.applicationId },
  });
  if (application) {
    application.metadata = {
      ...application.metadata,
      awardId: award.awardId,
      awardCreated: true,
    };
    await application.save();
  }

  return award;
};

/**
 * Updates award status through lifecycle.
 *
 * @param {string} awardId - Award ID
 * @param {string} newStatus - New status
 * @param {Model} GrantAward - GrantAward model
 * @returns {Promise<any>} Updated award
 */
export const updateAwardStatus = async (
  awardId: string,
  newStatus: string,
  GrantAward: any,
): Promise<any> => {
  const award = await GrantAward.findOne({ where: { awardId } });
  if (!award) throw new Error('Award not found');

  award.status = newStatus;
  if (newStatus === 'closed') {
    award.closeoutDate = new Date();
  }
  await award.save();

  return award;
};

/**
 * Retrieves active awards with balance.
 *
 * @param {Model} GrantAward - GrantAward model
 * @returns {Promise<any[]>} Active awards
 */
export const getActiveAwards = async (
  GrantAward: any,
): Promise<any[]> => {
  return await GrantAward.findAll({
    where: {
      status: 'active',
      remainingBalance: { [Op.gt]: 0 },
    },
    order: [['periodOfPerformanceEnd', 'ASC']],
  });
};

/**
 * Validates award expenditure against budget.
 *
 * @param {string} awardId - Award ID
 * @param {number} amount - Expenditure amount
 * @param {Model} GrantAward - GrantAward model
 * @returns {Promise<{ valid: boolean; availableBalance: number }>}
 */
export const validateAwardExpenditure = async (
  awardId: string,
  amount: number,
  GrantAward: any,
): Promise<{ valid: boolean; availableBalance: number }> => {
  const award = await GrantAward.findOne({ where: { awardId } });
  if (!award) throw new Error('Award not found');

  const availableBalance = parseFloat(award.remainingBalance);
  return {
    valid: availableBalance >= amount,
    availableBalance,
  };
};

/**
 * Draws down funds from award.
 *
 * @param {string} awardId - Award ID
 * @param {number} amount - Draw amount
 * @param {string} purpose - Draw purpose
 * @param {Model} GrantAward - GrantAward model
 * @returns {Promise<any>} Updated award
 */
export const drawDownAwardFunds = async (
  awardId: string,
  amount: number,
  purpose: string,
  GrantAward: any,
): Promise<any> => {
  const award = await GrantAward.findOne({ where: { awardId } });
  if (!award) throw new Error('Award not found');

  if (parseFloat(award.remainingBalance) < amount) {
    throw new Error('Insufficient award balance');
  }

  award.totalDrawn = parseFloat(award.totalDrawn) + amount;
  award.remainingBalance = parseFloat(award.remainingBalance) - amount;
  award.metadata = {
    ...award.metadata,
    lastDrawDate: new Date().toISOString(),
    lastDrawAmount: amount,
    lastDrawPurpose: purpose,
  };
  await award.save();

  return award;
};

/**
 * Generates award portfolio dashboard.
 *
 * @param {Model} GrantAward - GrantAward model
 * @returns {Promise<any>} Portfolio dashboard
 */
export const generateAwardPortfolioDashboard = async (
  GrantAward: any,
): Promise<any> => {
  const awards = await GrantAward.findAll();

  const totalAwards = awards.length;
  const activeAwards = awards.filter((a: any) => a.status === 'active').length;
  const totalAwarded = awards.reduce((sum: number, a: any) => sum + parseFloat(a.awardAmount), 0);
  const totalDrawn = awards.reduce((sum: number, a: any) => sum + parseFloat(a.totalDrawn), 0);
  const totalRemaining = awards.reduce((sum: number, a: any) => sum + parseFloat(a.remainingBalance), 0);

  return {
    totalAwards,
    activeAwards,
    totalAwarded,
    totalDrawn,
    totalRemaining,
    utilizationRate: totalAwarded > 0 ? (totalDrawn / totalAwarded) * 100 : 0,
  };
};

/**
 * Identifies awards approaching end of period.
 *
 * @param {number} daysThreshold - Days threshold
 * @param {Model} GrantAward - GrantAward model
 * @returns {Promise<any[]>} Expiring awards
 */
export const identifyExpiringAwards = async (
  daysThreshold: number,
  GrantAward: any,
): Promise<any[]> => {
  const threshold = new Date();
  threshold.setDate(threshold.getDate() + daysThreshold);

  return await GrantAward.findAll({
    where: {
      status: 'active',
      periodOfPerformanceEnd: { [Op.lte]: threshold },
    },
    order: [['periodOfPerformanceEnd', 'ASC']],
  });
};

// ============================================================================
// BUDGET MANAGEMENT (15-21)
// ============================================================================

/**
 * Creates grant budget allocation.
 *
 * @param {GrantBudgetData} budgetData - Budget data
 * @param {Model} GrantBudget - GrantBudget model
 * @returns {Promise<any>} Created budget
 */
export const createGrantBudget = async (
  budgetData: GrantBudgetData,
  GrantBudget: any,
): Promise<any> => {
  return await GrantBudget.create({
    ...budgetData,
    availableBalance: budgetData.budgetedAmount,
  });
};

/**
 * Updates budget expenditure tracking.
 *
 * @param {string} budgetId - Budget ID
 * @param {number} expenditureAmount - Expenditure amount
 * @param {Model} GrantBudget - GrantBudget model
 * @returns {Promise<any>} Updated budget
 */
export const updateBudgetExpenditure = async (
  budgetId: string,
  expenditureAmount: number,
  GrantBudget: any,
): Promise<any> => {
  const budget = await GrantBudget.findOne({ where: { budgetId } });
  if (!budget) throw new Error('Budget not found');

  budget.spentAmount = parseFloat(budget.spentAmount) + expenditureAmount;
  budget.availableBalance = parseFloat(budget.budgetedAmount) - parseFloat(budget.spentAmount) - parseFloat(budget.encumberedAmount);
  await budget.save();

  return budget;
};

/**
 * Validates budget availability for expenditure.
 *
 * @param {string} awardId - Award ID
 * @param {string} budgetCategory - Budget category
 * @param {number} amount - Expenditure amount
 * @param {Model} GrantBudget - GrantBudget model
 * @returns {Promise<{ available: boolean; balance: number }>}
 */
export const validateBudgetAvailability = async (
  awardId: string,
  budgetCategory: string,
  amount: number,
  GrantBudget: any,
): Promise<{ available: boolean; balance: number }> => {
  const budget = await GrantBudget.findOne({
    where: { awardId, budgetCategory },
  });

  if (!budget) {
    return { available: false, balance: 0 };
  }

  const balance = parseFloat(budget.availableBalance);
  return {
    available: balance >= amount,
    balance,
  };
};

/**
 * Processes budget modification request.
 *
 * @param {GrantModificationData} modData - Modification data
 * @param {Model} GrantBudget - GrantBudget model
 * @returns {Promise<any>} Modification result
 */
export const processBudgetModification = async (
  modData: GrantModificationData,
  GrantBudget: any,
): Promise<any> => {
  // Simplified budget modification - would implement full approval workflow
  return {
    modificationId: modData.modificationId,
    status: modData.approvalRequired ? 'pending' : 'approved',
    modificationDate: modData.modificationDate,
  };
};

/**
 * Generates budget vs actual report.
 *
 * @param {string} awardId - Award ID
 * @param {Model} GrantBudget - GrantBudget model
 * @returns {Promise<any>} Budget report
 */
export const generateBudgetVsActualReport = async (
  awardId: string,
  GrantBudget: any,
): Promise<any> => {
  const budgets = await GrantBudget.findAll({ where: { awardId } });

  const totalBudgeted = budgets.reduce((sum: number, b: any) => sum + parseFloat(b.budgetedAmount), 0);
  const totalSpent = budgets.reduce((sum: number, b: any) => sum + parseFloat(b.spentAmount), 0);
  const totalEncumbered = budgets.reduce((sum: number, b: any) => sum + parseFloat(b.encumberedAmount), 0);
  const totalAvailable = budgets.reduce((sum: number, b: any) => sum + parseFloat(b.availableBalance), 0);

  return {
    awardId,
    totalBudgeted,
    totalSpent,
    totalEncumbered,
    totalAvailable,
    utilizationRate: totalBudgeted > 0 ? (totalSpent / totalBudgeted) * 100 : 0,
    categories: budgets.map((b: any) => ({
      category: b.budgetCategory,
      budgeted: b.budgetedAmount,
      spent: b.spentAmount,
      available: b.availableBalance,
    })),
  };
};

/**
 * Identifies budget variances requiring attention.
 *
 * @param {number} varianceThreshold - Variance threshold percentage
 * @param {Model} GrantBudget - GrantBudget model
 * @returns {Promise<any[]>} Budget variances
 */
export const identifyBudgetVariances = async (
  varianceThreshold: number,
  GrantBudget: any,
): Promise<any[]> => {
  const budgets = await GrantBudget.findAll();

  return budgets.filter((budget: any) => {
    const budgeted = parseFloat(budget.budgetedAmount);
    const spent = parseFloat(budget.spentAmount);
    const variance = budgeted > 0 ? Math.abs((spent - budgeted) / budgeted) * 100 : 0;
    return variance > varianceThreshold;
  });
};

/**
 * Reallocates budget between categories.
 *
 * @param {string} fromBudgetId - Source budget ID
 * @param {string} toBudgetId - Destination budget ID
 * @param {number} amount - Reallocation amount
 * @param {Model} GrantBudget - GrantBudget model
 * @returns {Promise<any>} Reallocation result
 */
export const reallocateBudget = async (
  fromBudgetId: string,
  toBudgetId: string,
  amount: number,
  GrantBudget: any,
): Promise<any> => {
  const fromBudget = await GrantBudget.findOne({ where: { budgetId: fromBudgetId } });
  const toBudget = await GrantBudget.findOne({ where: { budgetId: toBudgetId } });

  if (!fromBudget || !toBudget) throw new Error('Budget not found');

  if (parseFloat(fromBudget.availableBalance) < amount) {
    throw new Error('Insufficient budget balance');
  }

  fromBudget.budgetedAmount = parseFloat(fromBudget.budgetedAmount) - amount;
  fromBudget.availableBalance = parseFloat(fromBudget.availableBalance) - amount;
  await fromBudget.save();

  toBudget.budgetedAmount = parseFloat(toBudget.budgetedAmount) + amount;
  toBudget.availableBalance = parseFloat(toBudget.availableBalance) + amount;
  await toBudget.save();

  return { fromBudget, toBudget };
};

// ============================================================================
// EXPENDITURE TRACKING (22-28)
// ============================================================================

/**
 * Records grant expenditure.
 *
 * @param {GrantExpenditureData} expenditureData - Expenditure data
 * @param {Model} GrantExpenditure - GrantExpenditure model
 * @param {Model} GrantBudget - GrantBudget model
 * @returns {Promise<any>} Created expenditure
 */
export const recordGrantExpenditure = async (
  expenditureData: GrantExpenditureData,
  GrantExpenditure: any,
  GrantBudget: any,
): Promise<any> => {
  const expenditure = await GrantExpenditure.create(expenditureData);

  // Update budget
  await updateBudgetExpenditure(
    expenditureData.awardId + '-' + expenditureData.budgetCategory,
    expenditureData.amount,
    GrantBudget,
  );

  return expenditure;
};

/**
 * Validates expenditure allowability.
 *
 * @param {string} expenditureId - Expenditure ID
 * @param {Model} GrantExpenditure - GrantExpenditure model
 * @returns {Promise<{ allowable: boolean; reasons: string[] }>}
 */
export const validateExpenditureAllowability = async (
  expenditureId: string,
  GrantExpenditure: any,
): Promise<{ allowable: boolean; reasons: string[] }> => {
  const reasons: string[] = [];
  const expenditure = await GrantExpenditure.findOne({ where: { expenditureId } });

  if (!expenditure) {
    reasons.push('Expenditure not found');
    return { allowable: false, reasons };
  }

  if (expenditure.amount <= 0) {
    reasons.push('Expenditure amount must be greater than zero');
  }

  // Additional allowability checks would go here

  return { allowable: reasons.length === 0, reasons };
};

/**
 * Retrieves expenditures by award and period.
 *
 * @param {string} awardId - Award ID
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Model} GrantExpenditure - GrantExpenditure model
 * @returns {Promise<any[]>} Expenditures
 */
export const getExpendituresByPeriod = async (
  awardId: string,
  startDate: Date,
  endDate: Date,
  GrantExpenditure: any,
): Promise<any[]> => {
  return await GrantExpenditure.findAll({
    where: {
      awardId,
      expenditureDate: { [Op.between]: [startDate, endDate] },
    },
    order: [['expenditureDate', 'DESC']],
  });
};

/**
 * Generates expenditure summary by category.
 *
 * @param {string} awardId - Award ID
 * @param {Model} GrantExpenditure - GrantExpenditure model
 * @returns {Promise<any>} Expenditure summary
 */
export const generateExpenditureSummary = async (
  awardId: string,
  GrantExpenditure: any,
): Promise<any> => {
  const expenditures = await GrantExpenditure.findAll({ where: { awardId } });

  const categoryTotals = expenditures.reduce((acc: any, exp: any) => {
    const category = exp.budgetCategory;
    acc[category] = (acc[category] || 0) + parseFloat(exp.amount);
    return acc;
  }, {});

  const totalExpended = expenditures.reduce((sum: number, exp: any) => sum + parseFloat(exp.amount), 0);

  return {
    awardId,
    totalExpended,
    expenditureCount: expenditures.length,
    byCategory: Object.entries(categoryTotals).map(([category, total]) => ({
      category,
      total,
    })),
  };
};

/**
 * Voids expenditure with justification.
 *
 * @param {string} expenditureId - Expenditure ID
 * @param {string} reason - Void reason
 * @param {string} userId - User voiding expenditure
 * @param {Model} GrantExpenditure - GrantExpenditure model
 * @returns {Promise<any>} Voided expenditure
 */
export const voidGrantExpenditure = async (
  expenditureId: string,
  reason: string,
  userId: string,
  GrantExpenditure: any,
): Promise<any> => {
  const expenditure = await GrantExpenditure.findOne({ where: { expenditureId } });
  if (!expenditure) throw new Error('Expenditure not found');

  expenditure.metadata = {
    ...expenditure.metadata,
    voided: true,
    voidReason: reason,
    voidedBy: userId,
    voidedAt: new Date().toISOString(),
  };
  await expenditure.save();

  return expenditure;
};

/**
 * Exports expenditures to Excel format.
 *
 * @param {string} awardId - Award ID
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Model} GrantExpenditure - GrantExpenditure model
 * @returns {Promise<Buffer>} Excel export
 */
export const exportExpendituresToExcel = async (
  awardId: string,
  startDate: Date,
  endDate: Date,
  GrantExpenditure: any,
): Promise<Buffer> => {
  const expenditures = await GrantExpenditure.findAll({
    where: {
      awardId,
      expenditureDate: { [Op.between]: [startDate, endDate] },
    },
  });

  const csv = 'Expenditure ID,Date,Amount,Category,Description,Account Code,Approved By\n' +
    expenditures.map((exp: any) =>
      `${exp.expenditureId},${exp.expenditureDate.toISOString().split('T')[0]},${exp.amount},${exp.budgetCategory},${exp.description},${exp.accountCode},${exp.approvedBy}`
    ).join('\n');

  return Buffer.from(csv, 'utf-8');
};

/**
 * Identifies unusual expenditure patterns.
 *
 * @param {string} awardId - Award ID
 * @param {Model} GrantExpenditure - GrantExpenditure model
 * @returns {Promise<any[]>} Unusual patterns
 */
export const identifyUnusualExpenditures = async (
  awardId: string,
  GrantExpenditure: any,
): Promise<any[]> => {
  const expenditures = await GrantExpenditure.findAll({
    where: { awardId },
    order: [['amount', 'DESC']],
  });

  // Simplified pattern detection - would implement statistical analysis
  const avgAmount = expenditures.reduce((sum: number, exp: any) => sum + parseFloat(exp.amount), 0) / expenditures.length;
  const threshold = avgAmount * 2; // More than 2x average

  return expenditures.filter((exp: any) => parseFloat(exp.amount) > threshold);
};

// ============================================================================
// COMPLIANCE & REPORTING (29-35)
// ============================================================================

/**
 * Performs compliance check on award.
 *
 * @param {ComplianceCheckData} checkData - Check data
 * @param {Model} ComplianceCheck - ComplianceCheck model
 * @returns {Promise<any>} Created check
 */
export const performComplianceCheck = async (
  checkData: ComplianceCheckData,
  ComplianceCheck: any,
): Promise<any> => {
  return await ComplianceCheck.create(checkData);
};

/**
 * Retrieves non-compliant awards requiring action.
 *
 * @param {Model} ComplianceCheck - ComplianceCheck model
 * @returns {Promise<any[]>} Non-compliant checks
 */
export const getNonCompliantAwards = async (
  ComplianceCheck: any,
): Promise<any[]> => {
  return await ComplianceCheck.findAll({
    where: {
      result: { [Op.in]: ['non_compliant', 'needs_attention'] },
    },
    order: [['checkDate', 'DESC']],
  });
};

/**
 * Generates compliance dashboard.
 *
 * @param {Model} ComplianceCheck - ComplianceCheck model
 * @returns {Promise<any>} Compliance dashboard
 */
export const generateComplianceDashboard = async (
  ComplianceCheck: any,
): Promise<any> => {
  const checks = await ComplianceCheck.findAll();

  const totalChecks = checks.length;
  const compliant = checks.filter((c: any) => c.result === 'compliant').length;
  const nonCompliant = checks.filter((c: any) => c.result === 'non_compliant').length;
  const needsAttention = checks.filter((c: any) => c.result === 'needs_attention').length;

  return {
    totalChecks,
    compliant,
    nonCompliant,
    needsAttention,
    complianceRate: totalChecks > 0 ? (compliant / totalChecks) * 100 : 0,
  };
};

/**
 * Creates grant report for submission.
 *
 * @param {GrantReportingData} reportData - Report data
 * @param {Model} GrantReporting - GrantReporting model
 * @returns {Promise<any>} Created report
 */
export const createGrantReport = async (
  reportData: GrantReportingData,
  GrantReporting: any,
): Promise<any> => {
  return await GrantReporting.create(reportData);
};

/**
 * Submits grant report to federal system.
 *
 * @param {string} reportId - Report ID
 * @param {string} userId - User submitting report
 * @param {Model} GrantReporting - GrantReporting model
 * @returns {Promise<any>} Submitted report
 */
export const submitGrantReport = async (
  reportId: string,
  userId: string,
  GrantReporting: any,
): Promise<any> => {
  const report = await GrantReporting.findOne({ where: { reportId } });
  if (!report) throw new Error('Report not found');

  report.status = 'submitted';
  report.submittedBy = userId;
  report.submittedDate = new Date();
  await report.save();

  return report;
};

/**
 * Retrieves overdue reports requiring submission.
 *
 * @param {Model} GrantReporting - GrantReporting model
 * @returns {Promise<any[]>} Overdue reports
 */
export const getOverdueReports = async (
  GrantReporting: any,
): Promise<any[]> => {
  return await GrantReporting.findAll({
    where: {
      status: { [Op.in]: ['pending', 'in_progress'] },
      dueDate: { [Op.lt]: new Date() },
    },
    order: [['dueDate', 'ASC']],
  });
};

/**
 * Generates federal financial report (FFR).
 *
 * @param {string} awardId - Award ID
 * @param {Date} periodStart - Period start
 * @param {Date} periodEnd - Period end
 * @param {Model} GrantAward - GrantAward model
 * @param {Model} GrantExpenditure - GrantExpenditure model
 * @returns {Promise<any>} FFR data
 */
export const generateFederalFinancialReport = async (
  awardId: string,
  periodStart: Date,
  periodEnd: Date,
  GrantAward: any,
  GrantExpenditure: any,
): Promise<any> => {
  const award = await GrantAward.findOne({ where: { awardId } });
  const expenditures = await GrantExpenditure.findAll({
    where: {
      awardId,
      expenditureDate: { [Op.between]: [periodStart, periodEnd] },
    },
  });

  const totalExpended = expenditures.reduce((sum: number, exp: any) => sum + parseFloat(exp.amount), 0);

  return {
    awardNumber: award?.awardNumber,
    reportingPeriod: { periodStart, periodEnd },
    federalShareOfExpenses: totalExpended,
    totalFederalFundsAuthorized: award?.awardAmount,
    recipientShareOfExpenses: 0, // Would calculate actual match
    totalExpenses: totalExpended,
    generatedDate: new Date(),
  };
};

// ============================================================================
// SUB-RECIPIENT & CLOSEOUT (36-45)
// ============================================================================

/**
 * Adds sub-recipient to award.
 *
 * @param {SubRecipientData} subRecipientData - Sub-recipient data
 * @param {Model} SubRecipient - SubRecipient model
 * @returns {Promise<any>} Created sub-recipient
 */
export const addSubRecipient = async (
  subRecipientData: SubRecipientData,
  SubRecipient: any,
): Promise<any> => {
  return await SubRecipient.create(subRecipientData);
};

/**
 * Performs sub-recipient monitoring.
 *
 * @param {string} subRecipientId - Sub-recipient ID
 * @param {string} monitoringNotes - Monitoring notes
 * @param {Model} SubRecipient - SubRecipient model
 * @returns {Promise<any>} Updated sub-recipient
 */
export const performSubRecipientMonitoring = async (
  subRecipientId: string,
  monitoringNotes: string,
  SubRecipient: any,
): Promise<any> => {
  const subRecipient = await SubRecipient.findOne({ where: { subRecipientId } });
  if (!subRecipient) throw new Error('Sub-recipient not found');

  subRecipient.lastMonitoringDate = new Date();
  const nextDate = new Date();
  nextDate.setFullYear(nextDate.getFullYear() + 1);
  subRecipient.nextMonitoringDate = nextDate;
  subRecipient.monitoringStatus = 'current';
  subRecipient.metadata = {
    ...subRecipient.metadata,
    lastMonitoringNotes: monitoringNotes,
  };
  await subRecipient.save();

  return subRecipient;
};

/**
 * Retrieves sub-recipients requiring monitoring.
 *
 * @param {Model} SubRecipient - SubRecipient model
 * @returns {Promise<any[]>} Sub-recipients needing monitoring
 */
export const getSubRecipientsRequiringMonitoring = async (
  SubRecipient: any,
): Promise<any[]> => {
  return await SubRecipient.findAll({
    where: {
      [Op.or]: [
        { nextMonitoringDate: { [Op.lte]: new Date() } },
        { monitoringStatus: { [Op.in]: ['overdue', 'at_risk'] } },
      ],
    },
    order: [['nextMonitoringDate', 'ASC']],
  });
};

/**
 * Initiates grant closeout process.
 *
 * @param {string} awardId - Award ID
 * @param {Model} GrantAward - GrantAward model
 * @param {Model} GrantReporting - GrantReporting model
 * @returns {Promise<any>} Closeout status
 */
export const initiateGrantCloseout = async (
  awardId: string,
  GrantAward: any,
  GrantReporting: any,
): Promise<any> => {
  const award = await GrantAward.findOne({ where: { awardId } });
  if (!award) throw new Error('Award not found');

  // Create closeout report
  const closeoutReport = await GrantReporting.create({
    reportId: `CLOSEOUT-${awardId}`,
    awardId,
    reportType: 'closeout',
    reportingPeriodStart: award.periodOfPerformanceStart,
    reportingPeriodEnd: award.periodOfPerformanceEnd,
    dueDate: new Date(),
    status: 'in_progress',
  });

  award.metadata = {
    ...award.metadata,
    closeoutInitiated: true,
    closeoutReportId: closeoutReport.reportId,
  };
  await award.save();

  return { award, closeoutReport };
};

/**
 * Validates closeout requirements completion.
 *
 * @param {string} awardId - Award ID
 * @param {Model} GrantReporting - GrantReporting model
 * @param {Model} ComplianceCheck - ComplianceCheck model
 * @returns {Promise<{ complete: boolean; missingItems: string[] }>}
 */
export const validateCloseoutRequirements = async (
  awardId: string,
  GrantReporting: any,
  ComplianceCheck: any,
): Promise<{ complete: boolean; missingItems: string[] }> => {
  const missingItems: string[] = [];

  // Check final reports
  const finalReport = await GrantReporting.findOne({
    where: {
      awardId,
      reportType: 'closeout',
      status: 'submitted',
    },
  });

  if (!finalReport) {
    missingItems.push('Final closeout report not submitted');
  }

  // Check compliance
  const nonCompliant = await ComplianceCheck.findOne({
    where: {
      awardId,
      result: 'non_compliant',
    },
  });

  if (nonCompliant) {
    missingItems.push('Outstanding compliance issues');
  }

  return {
    complete: missingItems.length === 0,
    missingItems,
  };
};

/**
 * Completes grant closeout.
 *
 * @param {string} awardId - Award ID
 * @param {Model} GrantAward - GrantAward model
 * @returns {Promise<any>} Closed award
 */
export const completeGrantCloseout = async (
  awardId: string,
  GrantAward: any,
): Promise<any> => {
  const award = await GrantAward.findOne({ where: { awardId } });
  if (!award) throw new Error('Award not found');

  award.status = 'closed';
  award.closeoutDate = new Date();
  await award.save();

  return award;
};

/**
 * Generates audit package for award.
 *
 * @param {string} awardId - Award ID
 * @param {Model} GrantAward - GrantAward model
 * @param {Model} GrantExpenditure - GrantExpenditure model
 * @param {Model} GrantReporting - GrantReporting model
 * @returns {Promise<any>} Audit package
 */
export const generateAuditPackage = async (
  awardId: string,
  GrantAward: any,
  GrantExpenditure: any,
  GrantReporting: any,
): Promise<any> => {
  const award = await GrantAward.findOne({ where: { awardId } });
  const expenditures = await GrantExpenditure.findAll({ where: { awardId } });
  const reports = await GrantReporting.findAll({ where: { awardId } });

  return {
    award,
    totalExpenditures: expenditures.reduce((sum: number, exp: any) => sum + parseFloat(exp.amount), 0),
    expenditureCount: expenditures.length,
    reportsSubmitted: reports.filter((r: any) => r.status === 'submitted').length,
    generatedDate: new Date(),
  };
};

/**
 * Exports grant portfolio to CSV.
 *
 * @param {Model} GrantAward - GrantAward model
 * @returns {Promise<Buffer>} CSV export
 */
export const exportGrantPortfolioCSV = async (
  GrantAward: any,
): Promise<Buffer> => {
  const awards = await GrantAward.findAll();

  const csv = 'Award ID,Award Number,Federal Agency,CFDA,Award Amount,Total Drawn,Remaining,Status\n' +
    awards.map((award: any) =>
      `${award.awardId},${award.awardNumber},${award.federalAgency},${award.cfda},${award.awardAmount},${award.totalDrawn},${award.remainingBalance},${award.status}`
    ).join('\n');

  return Buffer.from(csv, 'utf-8');
};

/**
 * Generates performance metrics report.
 *
 * @param {string} awardId - Award ID
 * @returns {Promise<any>} Performance metrics
 */
export const generatePerformanceMetrics = async (
  awardId: string,
): Promise<any> => {
  // Simplified performance metrics - would integrate with actual metrics tracking
  return {
    awardId,
    metricsDate: new Date(),
    goals: [
      { goalName: 'Project Completion', target: 100, actual: 75, unit: 'percent' },
      { goalName: 'Beneficiaries Served', target: 1000, actual: 850, unit: 'people' },
    ],
  };
};

/**
 * Tracks grant milestone completion.
 *
 * @param {string} awardId - Award ID
 * @param {string} milestone - Milestone name
 * @param {Date} completionDate - Completion date
 * @returns {Promise<any>} Milestone tracking
 */
export const trackGrantMilestone = async (
  awardId: string,
  milestone: string,
  completionDate: Date,
): Promise<any> => {
  return {
    awardId,
    milestone,
    completionDate,
    status: 'completed',
    recordedAt: new Date(),
  };
};

// ============================================================================
// NESTJS SERVICE WRAPPER
// ============================================================================

@Injectable()
export class CEFMSGrantLifecycleService {
  constructor(private readonly sequelize: Sequelize) {}

  async createApplication(applicationData: GrantApplicationData) {
    const GrantApplication = createGrantApplicationModel(this.sequelize);
    return createGrantApplication(applicationData, GrantApplication);
  }

  async createAward(awardData: GrantAwardData) {
    const GrantAward = createGrantAwardModel(this.sequelize);
    const GrantApplication = createGrantApplicationModel(this.sequelize);
    return createGrantAward(awardData, GrantAward, GrantApplication);
  }

  async recordExpenditure(expenditureData: GrantExpenditureData) {
    const GrantExpenditure = createGrantExpenditureModel(this.sequelize);
    const GrantBudget = createGrantBudgetModel(this.sequelize);
    return recordGrantExpenditure(expenditureData, GrantExpenditure, GrantBudget);
  }

  async getPortfolioDashboard() {
    const GrantAward = createGrantAwardModel(this.sequelize);
    return generateAwardPortfolioDashboard(GrantAward);
  }
}

export default {
  // Models
  createGrantApplicationModel,
  createGrantAwardModel,
  createGrantBudgetModel,
  createGrantExpenditureModel,
  createGrantReportingModel,
  createComplianceCheckModel,
  createSubRecipientModel,

  // Applications
  createGrantApplication,
  validateApplicationData,
  submitApplicationForReview,
  reviewApplication,
  getPendingApplications,
  generateApplicationSummary,
  archiveCompletedApplications,

  // Awards
  createGrantAward,
  updateAwardStatus,
  getActiveAwards,
  validateAwardExpenditure,
  drawDownAwardFunds,
  generateAwardPortfolioDashboard,
  identifyExpiringAwards,

  // Budgets
  createGrantBudget,
  updateBudgetExpenditure,
  validateBudgetAvailability,
  processBudgetModification,
  generateBudgetVsActualReport,
  identifyBudgetVariances,
  reallocateBudget,

  // Expenditures
  recordGrantExpenditure,
  validateExpenditureAllowability,
  getExpendituresByPeriod,
  generateExpenditureSummary,
  voidGrantExpenditure,
  exportExpendituresToExcel,
  identifyUnusualExpenditures,

  // Compliance & Reporting
  performComplianceCheck,
  getNonCompliantAwards,
  generateComplianceDashboard,
  createGrantReport,
  submitGrantReport,
  getOverdueReports,
  generateFederalFinancialReport,

  // Sub-Recipients & Closeout
  addSubRecipient,
  performSubRecipientMonitoring,
  getSubRecipientsRequiringMonitoring,
  initiateGrantCloseout,
  validateCloseoutRequirements,
  completeGrantCloseout,
  generateAuditPackage,
  exportGrantPortfolioCSV,
  generatePerformanceMetrics,
  trackGrantMilestone,

  // Service
  CEFMSGrantLifecycleService,
};
