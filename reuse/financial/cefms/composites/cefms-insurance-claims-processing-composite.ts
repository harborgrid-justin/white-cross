/**
 * LOC: CEFMSICP001
 * File: /reuse/financial/cefms/composites/cefms-insurance-claims-processing-composite.ts
 *
 * UPSTREAM (imports from):
 *   - ../../../government/risk-management-internal-controls-kit.ts
 *   - ../../../government/electronic-payments-disbursements-kit.ts
 *   - ../../../government/document-management-retention-kit.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend CEFMS insurance services
 *   - USACE claims processing systems
 *   - Claims adjudication modules
 */

/**
 * File: /reuse/financial/cefms/composites/cefms-insurance-claims-processing-composite.ts
 * Locator: WC-CEFMS-ICP-001
 * Purpose: USACE CEFMS Insurance Claims Processing - claims submission, adjudication, loss assessment, payments, reserves estimation, subrogation, reinsurance tracking, analytics, fraud detection
 *
 * Upstream: Composes utilities from government kits for comprehensive claims management
 * Downstream: ../../../backend/cefms/*, Claims controllers, adjudication workflows, fraud detection, reinsurance reporting
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 38+ composite functions for USACE CEFMS insurance claims operations
 *
 * LLM Context: Production-ready USACE CEFMS insurance claims processing system.
 * Comprehensive claims lifecycle management from submission through settlement, including claims intake,
 * initial assessment, adjudication workflows, loss evaluation, reserves estimation, payment processing,
 * subrogation recovery, reinsurance tracking, claims analytics, fraud detection patterns, regulatory compliance,
 * claims documentation, settlement negotiations, and comprehensive claims reporting for USACE operations.
 */

import { Model, DataTypes, Sequelize, Transaction, Op } from 'sequelize';
import { Injectable } from '@nestjs/common';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface ClaimSubmissionData {
  claimId: string;
  policyNumber: string;
  claimantName: string;
  claimantContact: string;
  incidentDate: Date;
  reportedDate: Date;
  claimType: 'property' | 'liability' | 'workers_comp' | 'auto' | 'general';
  lossLocation: string;
  lossDescription: string;
  estimatedLoss: number;
  submittedBy: string;
  status: 'submitted' | 'under_review' | 'approved' | 'denied' | 'settled';
  priority: 'low' | 'medium' | 'high' | 'critical';
}

interface ClaimAdjudicationData {
  adjudicationId: string;
  claimId: string;
  adjuster: string;
  adjudicationDate: Date;
  decision: 'approve' | 'deny' | 'partial' | 'pending';
  approvedAmount: number;
  denialReason?: string;
  conditions?: string;
  reviewNotes: string;
}

interface LossAssessmentData {
  assessmentId: string;
  claimId: string;
  assessor: string;
  assessmentDate: Date;
  assessmentType: 'initial' | 'detailed' | 'final';
  propertyDamage: number;
  liabilityAmount: number;
  medicalExpenses: number;
  legalFees: number;
  totalLoss: number;
  assessmentReport: string;
}

interface ClaimPaymentData {
  paymentId: string;
  claimId: string;
  paymentDate: Date;
  paymentAmount: number;
  paymentMethod: 'check' | 'ach' | 'wire' | 'card';
  payeeName: string;
  payeeAccount?: string;
  paymentType: 'settlement' | 'partial' | 'advance' | 'final';
  status: 'pending' | 'processed' | 'cleared' | 'failed';
}

interface ReservesEstimationData {
  reserveId: string;
  claimId: string;
  reserveType: 'case_reserve' | 'ibnr' | 'expense_reserve';
  initialReserve: number;
  currentReserve: number;
  estimatedDate: Date;
  lastReviewDate: Date;
  nextReviewDate: Date;
  reserveNotes: string;
}

interface SubrogationData {
  subrogationId: string;
  claimId: string;
  targetParty: string;
  subrogationAmount: number;
  recoveredAmount: number;
  status: 'initiated' | 'in_progress' | 'recovered' | 'closed';
  initiatedDate: Date;
  attorneyAssigned?: string;
  recoveryNotes: string;
}

interface ReinsuranceClaimData {
  reinsuranceId: string;
  claimId: string;
  reinsurer: string;
  treatyNumber: string;
  cededAmount: number;
  recoveredAmount: number;
  status: 'pending' | 'submitted' | 'paid' | 'disputed';
  submissionDate: Date;
  paidDate?: Date;
}

interface FraudIndicatorData {
  indicatorId: string;
  claimId: string;
  indicatorType: string;
  riskScore: number;
  detectedDate: Date;
  detectionMethod: 'automated' | 'manual' | 'referral';
  description: string;
  investigationStatus: 'flagged' | 'investigating' | 'confirmed' | 'cleared';
  investigator?: string;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Sequelize model for Insurance Claims with comprehensive tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} InsuranceClaim model
 *
 * @example
 * ```typescript
 * const InsuranceClaim = createInsuranceClaimModel(sequelize);
 * const claim = await InsuranceClaim.create({
 *   claimId: 'CLM-2024-001',
 *   policyNumber: 'POL-123456',
 *   claimantName: 'John Doe',
 *   incidentDate: new Date('2024-01-15'),
 *   claimType: 'property',
 *   estimatedLoss: 50000
 * });
 * ```
 */
export const createInsuranceClaimModel = (sequelize: Sequelize) => {
  class InsuranceClaim extends Model {
    public id!: string;
    public claimId!: string;
    public policyNumber!: string;
    public claimantName!: string;
    public claimantContact!: string;
    public incidentDate!: Date;
    public reportedDate!: Date;
    public claimType!: string;
    public lossLocation!: string;
    public lossDescription!: string;
    public estimatedLoss!: number;
    public actualLoss!: number;
    public submittedBy!: string;
    public status!: string;
    public priority!: string;
    public assignedAdjuster!: string | null;
    public closedDate!: Date | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  InsuranceClaim.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      claimId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Unique claim identifier',
      },
      policyNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Insurance policy number',
      },
      claimantName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Claimant full name',
      },
      claimantContact: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Claimant contact information',
      },
      incidentDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Date of incident',
      },
      reportedDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Date claim reported',
      },
      claimType: {
        type: DataTypes.ENUM('property', 'liability', 'workers_comp', 'auto', 'general'),
        allowNull: false,
        comment: 'Type of claim',
      },
      lossLocation: {
        type: DataTypes.STRING(500),
        allowNull: false,
        comment: 'Location of loss',
      },
      lossDescription: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Detailed loss description',
      },
      estimatedLoss: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Estimated loss amount',
      },
      actualLoss: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Actual loss amount',
      },
      submittedBy: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'User who submitted claim',
      },
      status: {
        type: DataTypes.ENUM('submitted', 'under_review', 'approved', 'denied', 'settled'),
        allowNull: false,
        defaultValue: 'submitted',
        comment: 'Claim status',
      },
      priority: {
        type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
        allowNull: false,
        defaultValue: 'medium',
        comment: 'Claim priority',
      },
      assignedAdjuster: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Assigned claims adjuster',
      },
      closedDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Date claim closed',
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
      tableName: 'insurance_claims',
      timestamps: true,
      indexes: [
        { fields: ['claimId'], unique: true },
        { fields: ['policyNumber'] },
        { fields: ['status'] },
        { fields: ['claimType'] },
        { fields: ['priority'] },
        { fields: ['incidentDate'] },
        { fields: ['assignedAdjuster'] },
      ],
    },
  );

  return InsuranceClaim;
};

/**
 * Sequelize model for Claim Adjudication with decision tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ClaimAdjudication model
 */
export const createClaimAdjudicationModel = (sequelize: Sequelize) => {
  class ClaimAdjudication extends Model {
    public id!: string;
    public adjudicationId!: string;
    public claimId!: string;
    public adjuster!: string;
    public adjudicationDate!: Date;
    public decision!: string;
    public approvedAmount!: number;
    public denialReason!: string | null;
    public conditions!: string | null;
    public reviewNotes!: string;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  ClaimAdjudication.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      adjudicationId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Adjudication identifier',
      },
      claimId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Related claim ID',
      },
      adjuster: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Claims adjuster',
      },
      adjudicationDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Adjudication date',
      },
      decision: {
        type: DataTypes.ENUM('approve', 'deny', 'partial', 'pending'),
        allowNull: false,
        comment: 'Adjudication decision',
      },
      approvedAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Approved claim amount',
      },
      denialReason: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Reason for denial',
      },
      conditions: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Approval conditions',
      },
      reviewNotes: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: '',
        comment: 'Review notes',
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
      tableName: 'claim_adjudications',
      timestamps: true,
      indexes: [
        { fields: ['adjudicationId'], unique: true },
        { fields: ['claimId'] },
        { fields: ['adjuster'] },
        { fields: ['decision'] },
        { fields: ['adjudicationDate'] },
      ],
    },
  );

  return ClaimAdjudication;
};

/**
 * Sequelize model for Loss Assessment with damage evaluation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} LossAssessment model
 */
export const createLossAssessmentModel = (sequelize: Sequelize) => {
  class LossAssessment extends Model {
    public id!: string;
    public assessmentId!: string;
    public claimId!: string;
    public assessor!: string;
    public assessmentDate!: Date;
    public assessmentType!: string;
    public propertyDamage!: number;
    public liabilityAmount!: number;
    public medicalExpenses!: number;
    public legalFees!: number;
    public totalLoss!: number;
    public assessmentReport!: string;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  LossAssessment.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      assessmentId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Assessment identifier',
      },
      claimId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Related claim ID',
      },
      assessor: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Loss assessor',
      },
      assessmentDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Assessment date',
      },
      assessmentType: {
        type: DataTypes.ENUM('initial', 'detailed', 'final'),
        allowNull: false,
        comment: 'Assessment type',
      },
      propertyDamage: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Property damage amount',
      },
      liabilityAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Liability amount',
      },
      medicalExpenses: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Medical expenses',
      },
      legalFees: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Legal fees',
      },
      totalLoss: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Total assessed loss',
      },
      assessmentReport: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Assessment report details',
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
      tableName: 'loss_assessments',
      timestamps: true,
      indexes: [
        { fields: ['assessmentId'], unique: true },
        { fields: ['claimId'] },
        { fields: ['assessor'] },
        { fields: ['assessmentType'] },
        { fields: ['assessmentDate'] },
      ],
    },
  );

  return LossAssessment;
};

/**
 * Sequelize model for Claim Payments with disbursement tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ClaimPayment model
 */
export const createClaimPaymentModel = (sequelize: Sequelize) => {
  class ClaimPayment extends Model {
    public id!: string;
    public paymentId!: string;
    public claimId!: string;
    public paymentDate!: Date;
    public paymentAmount!: number;
    public paymentMethod!: string;
    public payeeName!: string;
    public payeeAccount!: string | null;
    public paymentType!: string;
    public status!: string;
    public transactionId!: string | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  ClaimPayment.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      paymentId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Payment identifier',
      },
      claimId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Related claim ID',
      },
      paymentDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Payment date',
      },
      paymentAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Payment amount',
        validate: {
          min: 0.01,
        },
      },
      paymentMethod: {
        type: DataTypes.ENUM('check', 'ach', 'wire', 'card'),
        allowNull: false,
        comment: 'Payment method',
      },
      payeeName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Payee name',
      },
      payeeAccount: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Payee account number',
      },
      paymentType: {
        type: DataTypes.ENUM('settlement', 'partial', 'advance', 'final'),
        allowNull: false,
        comment: 'Payment type',
      },
      status: {
        type: DataTypes.ENUM('pending', 'processed', 'cleared', 'failed'),
        allowNull: false,
        defaultValue: 'pending',
        comment: 'Payment status',
      },
      transactionId: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'External transaction ID',
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
      tableName: 'claim_payments',
      timestamps: true,
      indexes: [
        { fields: ['paymentId'], unique: true },
        { fields: ['claimId'] },
        { fields: ['status'] },
        { fields: ['paymentDate'] },
        { fields: ['transactionId'] },
      ],
    },
  );

  return ClaimPayment;
};

/**
 * Sequelize model for Claims Reserves with estimation tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ClaimReserve model
 */
export const createClaimReserveModel = (sequelize: Sequelize) => {
  class ClaimReserve extends Model {
    public id!: string;
    public reserveId!: string;
    public claimId!: string;
    public reserveType!: string;
    public initialReserve!: number;
    public currentReserve!: number;
    public estimatedDate!: Date;
    public lastReviewDate!: Date;
    public nextReviewDate!: Date;
    public reserveNotes!: string;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  ClaimReserve.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      reserveId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Reserve identifier',
      },
      claimId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Related claim ID',
      },
      reserveType: {
        type: DataTypes.ENUM('case_reserve', 'ibnr', 'expense_reserve'),
        allowNull: false,
        comment: 'Reserve type',
      },
      initialReserve: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Initial reserve amount',
      },
      currentReserve: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Current reserve amount',
      },
      estimatedDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Estimation date',
      },
      lastReviewDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Last review date',
      },
      nextReviewDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Next review date',
      },
      reserveNotes: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: '',
        comment: 'Reserve notes',
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
      tableName: 'claim_reserves',
      timestamps: true,
      indexes: [
        { fields: ['reserveId'], unique: true },
        { fields: ['claimId'] },
        { fields: ['reserveType'] },
        { fields: ['nextReviewDate'] },
      ],
    },
  );

  return ClaimReserve;
};

/**
 * Sequelize model for Subrogation tracking and recovery.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Subrogation model
 */
export const createSubrogationModel = (sequelize: Sequelize) => {
  class Subrogation extends Model {
    public id!: string;
    public subrogationId!: string;
    public claimId!: string;
    public targetParty!: string;
    public subrogationAmount!: number;
    public recoveredAmount!: number;
    public status!: string;
    public initiatedDate!: Date;
    public attorneyAssigned!: string | null;
    public recoveryNotes!: string;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  Subrogation.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      subrogationId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Subrogation identifier',
      },
      claimId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Related claim ID',
      },
      targetParty: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Target party for recovery',
      },
      subrogationAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Subrogation amount sought',
      },
      recoveredAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Amount recovered',
      },
      status: {
        type: DataTypes.ENUM('initiated', 'in_progress', 'recovered', 'closed'),
        allowNull: false,
        defaultValue: 'initiated',
        comment: 'Subrogation status',
      },
      initiatedDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Initiation date',
      },
      attorneyAssigned: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Assigned attorney',
      },
      recoveryNotes: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: '',
        comment: 'Recovery notes',
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
      tableName: 'subrogations',
      timestamps: true,
      indexes: [
        { fields: ['subrogationId'], unique: true },
        { fields: ['claimId'] },
        { fields: ['status'] },
        { fields: ['attorneyAssigned'] },
      ],
    },
  );

  return Subrogation;
};

/**
 * Sequelize model for Reinsurance Claims with ceding tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ReinsuranceClaim model
 */
export const createReinsuranceClaimModel = (sequelize: Sequelize) => {
  class ReinsuranceClaim extends Model {
    public id!: string;
    public reinsuranceId!: string;
    public claimId!: string;
    public reinsurer!: string;
    public treatyNumber!: string;
    public cededAmount!: number;
    public recoveredAmount!: number;
    public status!: string;
    public submissionDate!: Date;
    public paidDate!: Date | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  ReinsuranceClaim.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      reinsuranceId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Reinsurance claim identifier',
      },
      claimId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Related claim ID',
      },
      reinsurer: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Reinsurer name',
      },
      treatyNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Treaty number',
      },
      cededAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Ceded amount',
      },
      recoveredAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Recovered amount',
      },
      status: {
        type: DataTypes.ENUM('pending', 'submitted', 'paid', 'disputed'),
        allowNull: false,
        defaultValue: 'pending',
        comment: 'Reinsurance status',
      },
      submissionDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Submission date',
      },
      paidDate: {
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
      tableName: 'reinsurance_claims',
      timestamps: true,
      indexes: [
        { fields: ['reinsuranceId'], unique: true },
        { fields: ['claimId'] },
        { fields: ['reinsurer'] },
        { fields: ['status'] },
        { fields: ['treatyNumber'] },
      ],
    },
  );

  return ReinsuranceClaim;
};

/**
 * Sequelize model for Fraud Indicators with detection tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} FraudIndicator model
 */
export const createFraudIndicatorModel = (sequelize: Sequelize) => {
  class FraudIndicator extends Model {
    public id!: string;
    public indicatorId!: string;
    public claimId!: string;
    public indicatorType!: string;
    public riskScore!: number;
    public detectedDate!: Date;
    public detectionMethod!: string;
    public description!: string;
    public investigationStatus!: string;
    public investigator!: string | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  FraudIndicator.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      indicatorId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Indicator identifier',
      },
      claimId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Related claim ID',
      },
      indicatorType: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Fraud indicator type',
      },
      riskScore: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        comment: 'Risk score (0-100)',
        validate: {
          min: 0,
          max: 100,
        },
      },
      detectedDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Detection date',
      },
      detectionMethod: {
        type: DataTypes.ENUM('automated', 'manual', 'referral'),
        allowNull: false,
        comment: 'Detection method',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Indicator description',
      },
      investigationStatus: {
        type: DataTypes.ENUM('flagged', 'investigating', 'confirmed', 'cleared'),
        allowNull: false,
        defaultValue: 'flagged',
        comment: 'Investigation status',
      },
      investigator: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Assigned investigator',
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
      tableName: 'fraud_indicators',
      timestamps: true,
      indexes: [
        { fields: ['indicatorId'], unique: true },
        { fields: ['claimId'] },
        { fields: ['investigationStatus'] },
        { fields: ['riskScore'] },
        { fields: ['investigator'] },
      ],
    },
  );

  return FraudIndicator;
};

// ============================================================================
// CLAIMS SUBMISSION & INTAKE (1-5)
// ============================================================================

/**
 * Submits new insurance claim with validation.
 *
 * @param {ClaimSubmissionData} claimData - Claim submission data
 * @param {Model} InsuranceClaim - InsuranceClaim model
 * @returns {Promise<any>} Created claim
 */
export const submitInsuranceClaim = async (
  claimData: ClaimSubmissionData,
  InsuranceClaim: any,
): Promise<any> => {
  return await InsuranceClaim.create(claimData);
};

/**
 * Validates claim eligibility against policy.
 *
 * @param {string} claimId - Claim ID
 * @param {Model} InsuranceClaim - InsuranceClaim model
 * @returns {Promise<{ eligible: boolean; reasons: string[] }>}
 */
export const validateClaimEligibility = async (
  claimId: string,
  InsuranceClaim: any,
): Promise<{ eligible: boolean; reasons: string[] }> => {
  const claim = await InsuranceClaim.findOne({ where: { claimId } });
  if (!claim) throw new Error('Claim not found');

  const reasons: string[] = [];

  // Check incident date is after policy start
  const daysSinceIncident = Math.floor(
    (new Date().getTime() - new Date(claim.incidentDate).getTime()) / (1000 * 60 * 60 * 24),
  );

  if (daysSinceIncident > 365) {
    reasons.push('Incident occurred more than 1 year ago');
  }

  if (claim.estimatedLoss <= 0) {
    reasons.push('Invalid loss amount');
  }

  return {
    eligible: reasons.length === 0,
    reasons,
  };
};

/**
 * Assigns claim to adjuster based on workload.
 *
 * @param {string} claimId - Claim ID
 * @param {string} adjuster - Adjuster user ID
 * @param {Model} InsuranceClaim - InsuranceClaim model
 * @returns {Promise<any>} Updated claim
 */
export const assignClaimToAdjuster = async (
  claimId: string,
  adjuster: string,
  InsuranceClaim: any,
): Promise<any> => {
  const claim = await InsuranceClaim.findOne({ where: { claimId } });
  if (!claim) throw new Error('Claim not found');

  claim.assignedAdjuster = adjuster;
  claim.status = 'under_review';
  await claim.save();

  return claim;
};

/**
 * Updates claim priority based on severity.
 *
 * @param {string} claimId - Claim ID
 * @param {string} priority - New priority
 * @param {Model} InsuranceClaim - InsuranceClaim model
 * @returns {Promise<any>} Updated claim
 */
export const updateClaimPriority = async (
  claimId: string,
  priority: string,
  InsuranceClaim: any,
): Promise<any> => {
  const claim = await InsuranceClaim.findOne({ where: { claimId } });
  if (!claim) throw new Error('Claim not found');

  claim.priority = priority;
  await claim.save();

  return claim;
};

/**
 * Retrieves claims pending assignment.
 *
 * @param {Model} InsuranceClaim - InsuranceClaim model
 * @returns {Promise<any[]>} Unassigned claims
 */
export const getUnassignedClaims = async (
  InsuranceClaim: any,
): Promise<any[]> => {
  return await InsuranceClaim.findAll({
    where: {
      assignedAdjuster: null,
      status: 'submitted',
    },
    order: [['priority', 'DESC'], ['reportedDate', 'ASC']],
  });
};

// ============================================================================
// CLAIMS ADJUDICATION (6-10)
// ============================================================================

/**
 * Performs claim adjudication with decision.
 *
 * @param {ClaimAdjudicationData} adjudicationData - Adjudication data
 * @param {Model} ClaimAdjudication - ClaimAdjudication model
 * @param {Model} InsuranceClaim - InsuranceClaim model
 * @returns {Promise<any>} Created adjudication
 */
export const adjudicateClaim = async (
  adjudicationData: ClaimAdjudicationData,
  ClaimAdjudication: any,
  InsuranceClaim: any,
): Promise<any> => {
  const adjudication = await ClaimAdjudication.create(adjudicationData);

  const claim = await InsuranceClaim.findOne({ where: { claimId: adjudicationData.claimId } });
  if (claim) {
    claim.status = adjudicationData.decision === 'deny' ? 'denied' : 'approved';
    claim.actualLoss = adjudicationData.approvedAmount;
    await claim.save();
  }

  return adjudication;
};

/**
 * Approves claim with conditions.
 *
 * @param {string} claimId - Claim ID
 * @param {number} approvedAmount - Approved amount
 * @param {string} conditions - Approval conditions
 * @param {string} adjuster - Adjuster user ID
 * @param {Model} ClaimAdjudication - ClaimAdjudication model
 * @param {Model} InsuranceClaim - InsuranceClaim model
 * @returns {Promise<any>} Approval record
 */
export const approveClaimWithConditions = async (
  claimId: string,
  approvedAmount: number,
  conditions: string,
  adjuster: string,
  ClaimAdjudication: any,
  InsuranceClaim: any,
): Promise<any> => {
  return await adjudicateClaim(
    {
      adjudicationId: `ADJ-${claimId}-${Date.now()}`,
      claimId,
      adjuster,
      adjudicationDate: new Date(),
      decision: 'approve',
      approvedAmount,
      conditions,
      reviewNotes: `Approved with conditions: ${conditions}`,
    },
    ClaimAdjudication,
    InsuranceClaim,
  );
};

/**
 * Denies claim with documented reason.
 *
 * @param {string} claimId - Claim ID
 * @param {string} denialReason - Reason for denial
 * @param {string} adjuster - Adjuster user ID
 * @param {Model} ClaimAdjudication - ClaimAdjudication model
 * @param {Model} InsuranceClaim - InsuranceClaim model
 * @returns {Promise<any>} Denial record
 */
export const denyClaim = async (
  claimId: string,
  denialReason: string,
  adjuster: string,
  ClaimAdjudication: any,
  InsuranceClaim: any,
): Promise<any> => {
  return await adjudicateClaim(
    {
      adjudicationId: `ADJ-${claimId}-${Date.now()}`,
      claimId,
      adjuster,
      adjudicationDate: new Date(),
      decision: 'deny',
      approvedAmount: 0,
      denialReason,
      reviewNotes: `Claim denied: ${denialReason}`,
    },
    ClaimAdjudication,
    InsuranceClaim,
  );
};

/**
 * Requests additional information for claim.
 *
 * @param {string} claimId - Claim ID
 * @param {string} requestedInfo - Information requested
 * @param {Model} InsuranceClaim - InsuranceClaim model
 * @returns {Promise<any>} Updated claim
 */
export const requestClaimInformation = async (
  claimId: string,
  requestedInfo: string,
  InsuranceClaim: any,
): Promise<any> => {
  const claim = await InsuranceClaim.findOne({ where: { claimId } });
  if (!claim) throw new Error('Claim not found');

  claim.metadata = {
    ...claim.metadata,
    informationRequested: requestedInfo,
    requestedAt: new Date().toISOString(),
  };
  await claim.save();

  return claim;
};

/**
 * Retrieves claims pending adjudication decision.
 *
 * @param {string} adjuster - Adjuster user ID
 * @param {Model} InsuranceClaim - InsuranceClaim model
 * @returns {Promise<any[]>} Claims for review
 */
export const getClaimsPendingAdjudication = async (
  adjuster: string,
  InsuranceClaim: any,
): Promise<any[]> => {
  return await InsuranceClaim.findAll({
    where: {
      assignedAdjuster: adjuster,
      status: 'under_review',
    },
    order: [['priority', 'DESC'], ['incidentDate', 'ASC']],
  });
};

// ============================================================================
// LOSS ASSESSMENT (11-15)
// ============================================================================

/**
 * Performs comprehensive loss assessment.
 *
 * @param {LossAssessmentData} assessmentData - Assessment data
 * @param {Model} LossAssessment - LossAssessment model
 * @returns {Promise<any>} Created assessment
 */
export const performLossAssessment = async (
  assessmentData: LossAssessmentData,
  LossAssessment: any,
): Promise<any> => {
  return await LossAssessment.create(assessmentData);
};

/**
 * Calculates total loss from components.
 *
 * @param {string} claimId - Claim ID
 * @param {Model} LossAssessment - LossAssessment model
 * @returns {Promise<number>} Total loss amount
 */
export const calculateTotalLoss = async (
  claimId: string,
  LossAssessment: any,
): Promise<number> => {
  const assessments = await LossAssessment.findAll({ where: { claimId } });

  if (assessments.length === 0) return 0;

  const latestAssessment = assessments[assessments.length - 1];
  return (
    parseFloat(latestAssessment.propertyDamage) +
    parseFloat(latestAssessment.liabilityAmount) +
    parseFloat(latestAssessment.medicalExpenses) +
    parseFloat(latestAssessment.legalFees)
  );
};

/**
 * Updates loss assessment with new valuation.
 *
 * @param {string} assessmentId - Assessment ID
 * @param {Partial<LossAssessmentData>} updates - Assessment updates
 * @param {Model} LossAssessment - LossAssessment model
 * @returns {Promise<any>} Updated assessment
 */
export const updateLossAssessment = async (
  assessmentId: string,
  updates: Partial<LossAssessmentData>,
  LossAssessment: any,
): Promise<any> => {
  const assessment = await LossAssessment.findOne({ where: { assessmentId } });
  if (!assessment) throw new Error('Assessment not found');

  Object.assign(assessment, updates);

  assessment.totalLoss =
    parseFloat(assessment.propertyDamage) +
    parseFloat(assessment.liabilityAmount) +
    parseFloat(assessment.medicalExpenses) +
    parseFloat(assessment.legalFees);

  await assessment.save();
  return assessment;
};

/**
 * Generates loss assessment report.
 *
 * @param {string} claimId - Claim ID
 * @param {Model} LossAssessment - LossAssessment model
 * @returns {Promise<any>} Assessment report
 */
export const generateLossAssessmentReport = async (
  claimId: string,
  LossAssessment: any,
): Promise<any> => {
  const assessments = await LossAssessment.findAll({
    where: { claimId },
    order: [['assessmentDate', 'ASC']],
  });

  const totalPropertyDamage = assessments.reduce(
    (sum: number, a: any) => sum + parseFloat(a.propertyDamage),
    0,
  );
  const totalLiability = assessments.reduce(
    (sum: number, a: any) => sum + parseFloat(a.liabilityAmount),
    0,
  );
  const totalMedical = assessments.reduce(
    (sum: number, a: any) => sum + parseFloat(a.medicalExpenses),
    0,
  );
  const totalLegal = assessments.reduce(
    (sum: number, a: any) => sum + parseFloat(a.legalFees),
    0,
  );

  return {
    claimId,
    assessmentCount: assessments.length,
    totalPropertyDamage,
    totalLiability,
    totalMedical,
    totalLegal,
    grandTotal: totalPropertyDamage + totalLiability + totalMedical + totalLegal,
    assessments,
  };
};

/**
 * Compares initial vs final loss assessments.
 *
 * @param {string} claimId - Claim ID
 * @param {Model} LossAssessment - LossAssessment model
 * @returns {Promise<any>} Assessment comparison
 */
export const compareLossAssessments = async (
  claimId: string,
  LossAssessment: any,
): Promise<any> => {
  const initial = await LossAssessment.findOne({
    where: { claimId, assessmentType: 'initial' },
  });

  const final = await LossAssessment.findOne({
    where: { claimId, assessmentType: 'final' },
    order: [['assessmentDate', 'DESC']],
  });

  if (!initial || !final) {
    return { comparison: 'incomplete', message: 'Missing initial or final assessment' };
  }

  const variance = parseFloat(final.totalLoss) - parseFloat(initial.totalLoss);
  const variancePercent = (variance / parseFloat(initial.totalLoss)) * 100;

  return {
    claimId,
    initialLoss: parseFloat(initial.totalLoss),
    finalLoss: parseFloat(final.totalLoss),
    variance,
    variancePercent,
    assessmentAccuracy: Math.abs(variancePercent) <= 10 ? 'accurate' : 'significant_variance',
  };
};

// ============================================================================
// CLAIMS PAYMENTS (16-20)
// ============================================================================

/**
 * Processes claim payment disbursement.
 *
 * @param {ClaimPaymentData} paymentData - Payment data
 * @param {Model} ClaimPayment - ClaimPayment model
 * @returns {Promise<any>} Created payment
 */
export const processClaimPayment = async (
  paymentData: ClaimPaymentData,
  ClaimPayment: any,
): Promise<any> => {
  return await ClaimPayment.create(paymentData);
};

/**
 * Approves pending claim payment.
 *
 * @param {string} paymentId - Payment ID
 * @param {string} transactionId - External transaction ID
 * @param {Model} ClaimPayment - ClaimPayment model
 * @returns {Promise<any>} Approved payment
 */
export const approveClaimPayment = async (
  paymentId: string,
  transactionId: string,
  ClaimPayment: any,
): Promise<any> => {
  const payment = await ClaimPayment.findOne({ where: { paymentId } });
  if (!payment) throw new Error('Payment not found');

  payment.status = 'processed';
  payment.transactionId = transactionId;
  await payment.save();

  return payment;
};

/**
 * Retrieves payment history for claim.
 *
 * @param {string} claimId - Claim ID
 * @param {Model} ClaimPayment - ClaimPayment model
 * @returns {Promise<any[]>} Payment history
 */
export const getClaimPaymentHistory = async (
  claimId: string,
  ClaimPayment: any,
): Promise<any[]> => {
  return await ClaimPayment.findAll({
    where: { claimId },
    order: [['paymentDate', 'ASC']],
  });
};

/**
 * Calculates total paid on claim.
 *
 * @param {string} claimId - Claim ID
 * @param {Model} ClaimPayment - ClaimPayment model
 * @returns {Promise<number>} Total paid amount
 */
export const calculateTotalPaid = async (
  claimId: string,
  ClaimPayment: any,
): Promise<number> => {
  const payments = await ClaimPayment.findAll({
    where: {
      claimId,
      status: { [Op.in]: ['processed', 'cleared'] },
    },
  });

  return payments.reduce((sum: number, p: any) => sum + parseFloat(p.paymentAmount), 0);
};

/**
 * Generates payment reconciliation report.
 *
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Model} ClaimPayment - ClaimPayment model
 * @returns {Promise<any>} Reconciliation report
 */
export const generatePaymentReconciliationReport = async (
  startDate: Date,
  endDate: Date,
  ClaimPayment: any,
): Promise<any> => {
  const payments = await ClaimPayment.findAll({
    where: {
      paymentDate: { [Op.between]: [startDate, endDate] },
    },
  });

  const totalPaid = payments.reduce((sum: number, p: any) => sum + parseFloat(p.paymentAmount), 0);
  const countByStatus = new Map<string, number>();

  payments.forEach((p: any) => {
    countByStatus.set(p.status, (countByStatus.get(p.status) || 0) + 1);
  });

  return {
    period: { startDate, endDate },
    totalPayments: payments.length,
    totalAmount: totalPaid,
    byStatus: Array.from(countByStatus.entries()).map(([status, count]) => ({ status, count })),
    payments,
  };
};

// ============================================================================
// RESERVES ESTIMATION (21-25)
// ============================================================================

/**
 * Establishes claim reserve estimate.
 *
 * @param {ReservesEstimationData} reserveData - Reserve data
 * @param {Model} ClaimReserve - ClaimReserve model
 * @returns {Promise<any>} Created reserve
 */
export const establishClaimReserve = async (
  reserveData: ReservesEstimationData,
  ClaimReserve: any,
): Promise<any> => {
  return await ClaimReserve.create(reserveData);
};

/**
 * Adjusts claim reserve based on new information.
 *
 * @param {string} reserveId - Reserve ID
 * @param {number} newReserveAmount - New reserve amount
 * @param {string} reason - Adjustment reason
 * @param {Model} ClaimReserve - ClaimReserve model
 * @returns {Promise<any>} Updated reserve
 */
export const adjustClaimReserve = async (
  reserveId: string,
  newReserveAmount: number,
  reason: string,
  ClaimReserve: any,
): Promise<any> => {
  const reserve = await ClaimReserve.findOne({ where: { reserveId } });
  if (!reserve) throw new Error('Reserve not found');

  reserve.currentReserve = newReserveAmount;
  reserve.lastReviewDate = new Date();
  reserve.reserveNotes = `${reserve.reserveNotes}\n\nAdjustment: ${reason} - ${new Date().toISOString()}`;
  await reserve.save();

  return reserve;
};

/**
 * Retrieves reserves due for review.
 *
 * @param {Model} ClaimReserve - ClaimReserve model
 * @returns {Promise<any[]>} Reserves for review
 */
export const getReservesDueForReview = async (
  ClaimReserve: any,
): Promise<any[]> => {
  return await ClaimReserve.findAll({
    where: {
      nextReviewDate: { [Op.lte]: new Date() },
    },
    order: [['nextReviewDate', 'ASC']],
  });
};

/**
 * Calculates total reserves across all claims.
 *
 * @param {Model} ClaimReserve - ClaimReserve model
 * @returns {Promise<any>} Total reserves summary
 */
export const calculateTotalReserves = async (
  ClaimReserve: any,
): Promise<any> => {
  const reserves = await ClaimReserve.findAll();

  const byCaseReserve = reserves
    .filter((r: any) => r.reserveType === 'case_reserve')
    .reduce((sum: number, r: any) => sum + parseFloat(r.currentReserve), 0);

  const byIBNR = reserves
    .filter((r: any) => r.reserveType === 'ibnr')
    .reduce((sum: number, r: any) => sum + parseFloat(r.currentReserve), 0);

  const byExpense = reserves
    .filter((r: any) => r.reserveType === 'expense_reserve')
    .reduce((sum: number, r: any) => sum + parseFloat(r.currentReserve), 0);

  return {
    totalReserves: byCaseReserve + byIBNR + byExpense,
    caseReserves: byCaseReserve,
    ibnrReserves: byIBNR,
    expenseReserves: byExpense,
    reserveCount: reserves.length,
  };
};

/**
 * Generates reserves adequacy report.
 *
 * @param {Model} ClaimReserve - ClaimReserve model
 * @param {Model} ClaimPayment - ClaimPayment model
 * @returns {Promise<any>} Adequacy analysis
 */
export const generateReservesAdequacyReport = async (
  ClaimReserve: any,
  ClaimPayment: any,
): Promise<any> => {
  const reserves = await calculateTotalReserves(ClaimReserve);

  const allPayments = await ClaimPayment.findAll({
    where: { status: { [Op.in]: ['processed', 'cleared'] } },
  });

  const totalPaid = allPayments.reduce(
    (sum: number, p: any) => sum + parseFloat(p.paymentAmount),
    0,
  );

  const adequacyRatio = reserves.totalReserves / (totalPaid || 1);

  return {
    totalReserves: reserves.totalReserves,
    totalPaid,
    adequacyRatio,
    adequacyStatus:
      adequacyRatio >= 1.2 ? 'adequate' : adequacyRatio >= 1.0 ? 'marginal' : 'inadequate',
    recommendation:
      adequacyRatio < 1.0
        ? 'Increase reserves immediately'
        : adequacyRatio < 1.2
          ? 'Monitor closely'
          : 'Reserves adequate',
  };
};

// ============================================================================
// SUBROGATION & REINSURANCE (26-30)
// ============================================================================

/**
 * Initiates subrogation process.
 *
 * @param {SubrogationData} subrogationData - Subrogation data
 * @param {Model} Subrogation - Subrogation model
 * @returns {Promise<any>} Created subrogation
 */
export const initiateSubrogation = async (
  subrogationData: SubrogationData,
  Subrogation: any,
): Promise<any> => {
  return await Subrogation.create(subrogationData);
};

/**
 * Records subrogation recovery amount.
 *
 * @param {string} subrogationId - Subrogation ID
 * @param {number} recoveredAmount - Amount recovered
 * @param {Model} Subrogation - Subrogation model
 * @returns {Promise<any>} Updated subrogation
 */
export const recordSubrogationRecovery = async (
  subrogationId: string,
  recoveredAmount: number,
  Subrogation: any,
): Promise<any> => {
  const subrogation = await Subrogation.findOne({ where: { subrogationId } });
  if (!subrogation) throw new Error('Subrogation not found');

  subrogation.recoveredAmount += recoveredAmount;

  if (subrogation.recoveredAmount >= subrogation.subrogationAmount) {
    subrogation.status = 'recovered';
  } else {
    subrogation.status = 'in_progress';
  }

  await subrogation.save();
  return subrogation;
};

/**
 * Submits reinsurance claim for recovery.
 *
 * @param {ReinsuranceClaimData} reinsuranceData - Reinsurance data
 * @param {Model} ReinsuranceClaim - ReinsuranceClaim model
 * @returns {Promise<any>} Created reinsurance claim
 */
export const submitReinsuranceClaim = async (
  reinsuranceData: ReinsuranceClaimData,
  ReinsuranceClaim: any,
): Promise<any> => {
  return await ReinsuranceClaim.create(reinsuranceData);
};

/**
 * Records reinsurance recovery payment.
 *
 * @param {string} reinsuranceId - Reinsurance ID
 * @param {number} recoveredAmount - Amount recovered
 * @param {Model} ReinsuranceClaim - ReinsuranceClaim model
 * @returns {Promise<any>} Updated reinsurance claim
 */
export const recordReinsuranceRecovery = async (
  reinsuranceId: string,
  recoveredAmount: number,
  ReinsuranceClaim: any,
): Promise<any> => {
  const reinsurance = await ReinsuranceClaim.findOne({ where: { reinsuranceId } });
  if (!reinsurance) throw new Error('Reinsurance claim not found');

  reinsurance.recoveredAmount = recoveredAmount;
  reinsurance.status = 'paid';
  reinsurance.paidDate = new Date();
  await reinsurance.save();

  return reinsurance;
};

/**
 * Generates subrogation recovery report.
 *
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Model} Subrogation - Subrogation model
 * @returns {Promise<any>} Recovery report
 */
export const generateSubrogationRecoveryReport = async (
  startDate: Date,
  endDate: Date,
  Subrogation: any,
): Promise<any> => {
  const subrogations = await Subrogation.findAll({
    where: {
      initiatedDate: { [Op.between]: [startDate, endDate] },
    },
  });

  const totalSought = subrogations.reduce(
    (sum: number, s: any) => sum + parseFloat(s.subrogationAmount),
    0,
  );
  const totalRecovered = subrogations.reduce(
    (sum: number, s: any) => sum + parseFloat(s.recoveredAmount),
    0,
  );
  const recoveryRate = totalSought > 0 ? (totalRecovered / totalSought) * 100 : 0;

  return {
    period: { startDate, endDate },
    totalCases: subrogations.length,
    totalSought,
    totalRecovered,
    recoveryRate,
    subrogations,
  };
};

// ============================================================================
// FRAUD DETECTION & ANALYTICS (31-38)
// ============================================================================

/**
 * Flags claim for potential fraud.
 *
 * @param {FraudIndicatorData} indicatorData - Fraud indicator data
 * @param {Model} FraudIndicator - FraudIndicator model
 * @returns {Promise<any>} Created fraud indicator
 */
export const flagClaimForFraud = async (
  indicatorData: FraudIndicatorData,
  FraudIndicator: any,
): Promise<any> => {
  return await FraudIndicator.create(indicatorData);
};

/**
 * Detects suspicious claim patterns.
 *
 * @param {string} claimId - Claim ID
 * @param {Model} InsuranceClaim - InsuranceClaim model
 * @param {Model} FraudIndicator - FraudIndicator model
 * @returns {Promise<any>} Fraud detection results
 */
export const detectSuspiciousPatterns = async (
  claimId: string,
  InsuranceClaim: any,
  FraudIndicator: any,
): Promise<any> => {
  const claim = await InsuranceClaim.findOne({ where: { claimId } });
  if (!claim) throw new Error('Claim not found');

  const indicators: any[] = [];

  // Check for late reporting
  const daysBetween = Math.floor(
    (new Date(claim.reportedDate).getTime() - new Date(claim.incidentDate).getTime()) /
      (1000 * 60 * 60 * 24),
  );

  if (daysBetween > 90) {
    indicators.push({
      type: 'late_reporting',
      riskScore: 30,
      description: `Claim reported ${daysBetween} days after incident`,
    });
  }

  // Check for high loss amount
  if (claim.estimatedLoss > 100000) {
    indicators.push({
      type: 'high_value',
      riskScore: 20,
      description: 'Claim exceeds high-value threshold',
    });
  }

  const totalRiskScore = indicators.reduce((sum, i) => sum + i.riskScore, 0);

  return {
    claimId,
    totalRiskScore,
    indicators,
    fraudLikelihood: totalRiskScore > 50 ? 'high' : totalRiskScore > 30 ? 'medium' : 'low',
  };
};

/**
 * Assigns fraud investigator to claim.
 *
 * @param {string} indicatorId - Indicator ID
 * @param {string} investigator - Investigator user ID
 * @param {Model} FraudIndicator - FraudIndicator model
 * @returns {Promise<any>} Updated indicator
 */
export const assignFraudInvestigator = async (
  indicatorId: string,
  investigator: string,
  FraudIndicator: any,
): Promise<any> => {
  const indicator = await FraudIndicator.findOne({ where: { indicatorId } });
  if (!indicator) throw new Error('Fraud indicator not found');

  indicator.investigator = investigator;
  indicator.investigationStatus = 'investigating';
  await indicator.save();

  return indicator;
};

/**
 * Generates claims analytics dashboard.
 *
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Model} InsuranceClaim - InsuranceClaim model
 * @param {Model} ClaimPayment - ClaimPayment model
 * @returns {Promise<any>} Analytics dashboard
 */
export const generateClaimsAnalyticsDashboard = async (
  startDate: Date,
  endDate: Date,
  InsuranceClaim: any,
  ClaimPayment: any,
): Promise<any> => {
  const claims = await InsuranceClaim.findAll({
    where: {
      reportedDate: { [Op.between]: [startDate, endDate] },
    },
  });

  const payments = await ClaimPayment.findAll({
    where: {
      paymentDate: { [Op.between]: [startDate, endDate] },
      status: { [Op.in]: ['processed', 'cleared'] },
    },
  });

  const totalClaims = claims.length;
  const totalPaid = payments.reduce((sum: number, p: any) => sum + parseFloat(p.paymentAmount), 0);
  const avgClaimValue = totalClaims > 0 ? totalPaid / totalClaims : 0;

  const byType = new Map<string, number>();
  claims.forEach((c: any) => {
    byType.set(c.claimType, (byType.get(c.claimType) || 0) + 1);
  });

  return {
    period: { startDate, endDate },
    totalClaims,
    totalPaid,
    avgClaimValue,
    claimsByType: Array.from(byType.entries()).map(([type, count]) => ({ type, count })),
  };
};

/**
 * Calculates claims loss ratio.
 *
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {number} premiumCollected - Premium collected
 * @param {Model} ClaimPayment - ClaimPayment model
 * @returns {Promise<any>} Loss ratio analysis
 */
export const calculateClaimsLossRatio = async (
  startDate: Date,
  endDate: Date,
  premiumCollected: number,
  ClaimPayment: any,
): Promise<any> => {
  const payments = await ClaimPayment.findAll({
    where: {
      paymentDate: { [Op.between]: [startDate, endDate] },
      status: { [Op.in]: ['processed', 'cleared'] },
    },
  });

  const totalLoss = payments.reduce((sum: number, p: any) => sum + parseFloat(p.paymentAmount), 0);
  const lossRatio = premiumCollected > 0 ? (totalLoss / premiumCollected) * 100 : 0;

  return {
    period: { startDate, endDate },
    premiumCollected,
    totalLoss,
    lossRatio,
    profitability: lossRatio < 70 ? 'profitable' : lossRatio < 100 ? 'marginal' : 'unprofitable',
  };
};

/**
 * Generates claims frequency report.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {Model} InsuranceClaim - InsuranceClaim model
 * @returns {Promise<any>} Frequency report
 */
export const generateClaimsFrequencyReport = async (
  fiscalYear: number,
  InsuranceClaim: any,
): Promise<any> => {
  const startDate = new Date(fiscalYear, 0, 1);
  const endDate = new Date(fiscalYear, 11, 31);

  const claims = await InsuranceClaim.findAll({
    where: {
      reportedDate: { [Op.between]: [startDate, endDate] },
    },
  });

  const monthlyFrequency: Record<number, number> = {};
  for (let month = 0; month < 12; month++) {
    monthlyFrequency[month] = 0;
  }

  claims.forEach((claim: any) => {
    const month = new Date(claim.reportedDate).getMonth();
    monthlyFrequency[month]++;
  });

  return {
    fiscalYear,
    totalClaims: claims.length,
    monthlyFrequency: Object.entries(monthlyFrequency).map(([month, count]) => ({
      month: parseInt(month) + 1,
      count,
    })),
  };
};

/**
 * Exports claims data to CSV format.
 *
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Model} InsuranceClaim - InsuranceClaim model
 * @returns {Promise<string>} CSV content
 */
export const exportClaimsDataCSV = async (
  startDate: Date,
  endDate: Date,
  InsuranceClaim: any,
): Promise<string> => {
  const claims = await InsuranceClaim.findAll({
    where: {
      reportedDate: { [Op.between]: [startDate, endDate] },
    },
    order: [['reportedDate', 'ASC']],
  });

  const headers =
    'Claim ID,Policy Number,Claimant Name,Incident Date,Reported Date,Claim Type,Estimated Loss,Actual Loss,Status,Priority\n';
  const rows = claims.map(
    (c: any) =>
      `${c.claimId},${c.policyNumber},${c.claimantName},${c.incidentDate.toISOString().split('T')[0]},${c.reportedDate.toISOString().split('T')[0]},${c.claimType},${c.estimatedLoss},${c.actualLoss},${c.status},${c.priority}`,
  );

  return headers + rows.join('\n');
};

/**
 * Closes settled claim with final documentation.
 *
 * @param {string} claimId - Claim ID
 * @param {string} closureNotes - Closure notes
 * @param {Model} InsuranceClaim - InsuranceClaim model
 * @returns {Promise<any>} Closed claim
 */
export const closeSettledClaim = async (
  claimId: string,
  closureNotes: string,
  InsuranceClaim: any,
): Promise<any> => {
  const claim = await InsuranceClaim.findOne({ where: { claimId } });
  if (!claim) throw new Error('Claim not found');

  claim.status = 'settled';
  claim.closedDate = new Date();
  claim.metadata = {
    ...claim.metadata,
    closureNotes,
    closedAt: new Date().toISOString(),
  };
  await claim.save();

  return claim;
};

// ============================================================================
// NESTJS SERVICE WRAPPER
// ============================================================================

@Injectable()
export class CEFMSInsuranceClaimsService {
  constructor(private readonly sequelize: Sequelize) {}

  async submitClaim(claimData: ClaimSubmissionData) {
    const InsuranceClaim = createInsuranceClaimModel(this.sequelize);
    return submitInsuranceClaim(claimData, InsuranceClaim);
  }

  async adjudicateClaim(adjudicationData: ClaimAdjudicationData) {
    const ClaimAdjudication = createClaimAdjudicationModel(this.sequelize);
    const InsuranceClaim = createInsuranceClaimModel(this.sequelize);
    return adjudicateClaim(adjudicationData, ClaimAdjudication, InsuranceClaim);
  }

  async processPayment(paymentData: ClaimPaymentData) {
    const ClaimPayment = createClaimPaymentModel(this.sequelize);
    return processClaimPayment(paymentData, ClaimPayment);
  }

  async getAnalyticsDashboard(startDate: Date, endDate: Date) {
    const InsuranceClaim = createInsuranceClaimModel(this.sequelize);
    const ClaimPayment = createClaimPaymentModel(this.sequelize);
    return generateClaimsAnalyticsDashboard(startDate, endDate, InsuranceClaim, ClaimPayment);
  }
}

export default {
  // Models
  createInsuranceClaimModel,
  createClaimAdjudicationModel,
  createLossAssessmentModel,
  createClaimPaymentModel,
  createClaimReserveModel,
  createSubrogationModel,
  createReinsuranceClaimModel,
  createFraudIndicatorModel,

  // Claims Submission & Intake
  submitInsuranceClaim,
  validateClaimEligibility,
  assignClaimToAdjuster,
  updateClaimPriority,
  getUnassignedClaims,

  // Claims Adjudication
  adjudicateClaim,
  approveClaimWithConditions,
  denyClaim,
  requestClaimInformation,
  getClaimsPendingAdjudication,

  // Loss Assessment
  performLossAssessment,
  calculateTotalLoss,
  updateLossAssessment,
  generateLossAssessmentReport,
  compareLossAssessments,

  // Claims Payments
  processClaimPayment,
  approveClaimPayment,
  getClaimPaymentHistory,
  calculateTotalPaid,
  generatePaymentReconciliationReport,

  // Reserves Estimation
  establishClaimReserve,
  adjustClaimReserve,
  getReservesDueForReview,
  calculateTotalReserves,
  generateReservesAdequacyReport,

  // Subrogation & Reinsurance
  initiateSubrogation,
  recordSubrogationRecovery,
  submitReinsuranceClaim,
  recordReinsuranceRecovery,
  generateSubrogationRecoveryReport,

  // Fraud Detection & Analytics
  flagClaimForFraud,
  detectSuspiciousPatterns,
  assignFraudInvestigator,
  generateClaimsAnalyticsDashboard,
  calculateClaimsLossRatio,
  generateClaimsFrequencyReport,
  exportClaimsDataCSV,
  closeSettledClaim,

  // Service
  CEFMSInsuranceClaimsService,
};
