/**
 * CEFMS Contract Management Controller
 *
 * This service provides comprehensive contract administration functionality including
 * contract creation, modifications, amendments, closeout procedures, and compliance
 * monitoring for the Corps of Engineers Financial Management System (CEFMS).
 *
 * Key Features:
 * - Contract lifecycle management (initiation through closeout)
 * - Contract modifications and amendments
 * - Deliverable and milestone tracking
 * - Performance monitoring and reporting
 * - Contract closeout procedures
 * - Compliance validation and audit support
 * - Subcontractor management
 * - Warranty and guarantee tracking
 *
 * @module CEFMSContractManagementController
 */

import { Injectable, Logger, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { Sequelize, DataTypes, Model, Transaction, Op, QueryTypes } from 'sequelize';
import {
  createPurchaseOrderModel,
  createContractObligationModel
} from '../cefms-procurement-contract-accounting-composite';

/**
 * Contract status enumeration
 */
export enum ContractStatus {
  DRAFT = 'DRAFT',
  PENDING_AWARD = 'PENDING_AWARD',
  AWARDED = 'AWARDED',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  COMPLETED = 'COMPLETED',
  CLOSED = 'CLOSED',
  TERMINATED = 'TERMINATED',
  CANCELLED = 'CANCELLED'
}

/**
 * Contract type enumeration
 */
export enum ContractType {
  FIXED_PRICE = 'FIXED_PRICE',
  COST_PLUS_FIXED_FEE = 'COST_PLUS_FIXED_FEE',
  COST_PLUS_AWARD_FEE = 'COST_PLUS_AWARD_FEE',
  COST_PLUS_INCENTIVE_FEE = 'COST_PLUS_INCENTIVE_FEE',
  TIME_AND_MATERIALS = 'TIME_AND_MATERIALS',
  LABOR_HOUR = 'LABOR_HOUR',
  INDEFINITE_DELIVERY_INDEFINITE_QUANTITY = 'INDEFINITE_DELIVERY_INDEFINITE_QUANTITY',
  INDEFINITE_DELIVERY_DEFINITE_QUANTITY = 'INDEFINITE_DELIVERY_DEFINITE_QUANTITY',
  CONSTRUCTION = 'CONSTRUCTION',
  ARCHITECT_ENGINEER = 'ARCHITECT_ENGINEER'
}

/**
 * Modification type enumeration
 */
export enum ModificationType {
  ADMINISTRATIVE = 'ADMINISTRATIVE',
  BILATERAL = 'BILATERAL',
  UNILATERAL = 'UNILATERAL',
  CHANGE_ORDER = 'CHANGE_ORDER',
  SUPPLEMENTAL_AGREEMENT = 'SUPPLEMENTAL_AGREEMENT',
  DEFINITIZATION = 'DEFINITIZATION',
  TERMINATION = 'TERMINATION',
  FUNDING = 'FUNDING'
}

/**
 * Deliverable status enumeration
 */
export enum DeliverableStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  SUBMITTED = 'SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  LATE = 'LATE'
}

/**
 * Closeout status enumeration
 */
export enum CloseoutStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  PENDING_DOCUMENTATION = 'PENDING_DOCUMENTATION',
  PENDING_FINAL_PAYMENT = 'PENDING_FINAL_PAYMENT',
  PENDING_AUDIT = 'PENDING_AUDIT',
  COMPLETED = 'COMPLETED'
}

/**
 * Contract data interface
 */
export interface ContractData {
  contractNumber: string;
  contractType: ContractType;
  vendorId: string;
  contractingOfficerId: string;
  projectId?: string;
  description: string;
  statementOfWork: string;
  awardDate: Date;
  effectiveDate: Date;
  completionDate: Date;
  periodOfPerformanceStart: Date;
  periodOfPerformanceEnd: Date;
  baseAmount: number;
  optionAmount?: number;
  totalContractValue: number;
  fundedAmount: number;
  paymentTerms: string;
  deliverySchedule: string;
  performanceBondRequired: boolean;
  performanceBondAmount?: number;
  paymentBondRequired: boolean;
  paymentBondAmount?: number;
  warrantyPeriodMonths?: number;
  metadata?: Record<string, any>;
}

/**
 * Contract modification data interface
 */
export interface ContractModificationData {
  contractId: string;
  modificationNumber: string;
  modificationType: ModificationType;
  description: string;
  reason: string;
  scope: string;
  priceAdjustment: number;
  timeExtensionDays: number;
  newCompletionDate?: Date;
  fundingAdjustment: number;
  requestedBy: string;
  approvedBy?: string;
  effectiveDate: Date;
}

/**
 * Deliverable data interface
 */
export interface DeliverableData {
  contractId: string;
  deliverableName: string;
  description: string;
  deliverableType: 'DOCUMENT' | 'PRODUCT' | 'SERVICE' | 'MILESTONE';
  dueDate: Date;
  responsibleParty: string;
  acceptanceCriteria: string;
  linkedMilestoneId?: string;
}

/**
 * Milestone data interface
 */
export interface MilestoneData {
  contractId: string;
  milestoneName: string;
  description: string;
  targetDate: Date;
  completionCriteria: string;
  paymentPercentage: number;
  paymentAmount: number;
  dependencies?: string[];
}

/**
 * Contract closeout data interface
 */
export interface ContractCloseoutData {
  contractId: string;
  closeoutInitiatedBy: string;
  finalDeliverableDate?: Date;
  finalPaymentDate?: Date;
  finalInvoiceAmount?: number;
  propertyDispositionComplete: boolean;
  patentReportingComplete: boolean;
  surplusPropertyComplete: boolean;
  releaseOfClaimsObtained: boolean;
  warrantyDocumentationComplete: boolean;
  lessons LearnedDocumented: boolean;
  finalAuditComplete: boolean;
  notes: string;
}

/**
 * Contract model
 */
export const createContractModel = (sequelize: Sequelize) => {
  class Contract extends Model {
    public id!: string;
    public contractNumber!: string;
    public contractType!: ContractType;
    public vendorId!: string;
    public vendorName!: string;
    public contractingOfficerId!: string;
    public contractingOfficerName!: string;
    public projectId!: string;
    public description!: string;
    public statementOfWork!: string;
    public status!: ContractStatus;
    public awardDate!: Date;
    public effectiveDate!: Date;
    public completionDate!: Date;
    public periodOfPerformanceStart!: Date;
    public periodOfPerformanceEnd!: Date;
    public baseAmount!: number;
    public optionAmount!: number;
    public totalContractValue!: number;
    public fundedAmount!: number;
    public expendedAmount!: number;
    public remainingFunds!: number;
    public paymentTerms!: string;
    public deliverySchedule!: string;
    public performanceBondRequired!: boolean;
    public performanceBondAmount!: number;
    public paymentBondRequired!: boolean;
    public paymentBondAmount!: number;
    public warrantyPeriodMonths!: number;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  Contract.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        comment: 'Unique identifier for the contract'
      },
      contractNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Unique contract number'
      },
      contractType: {
        type: DataTypes.ENUM(...Object.values(ContractType)),
        allowNull: false,
        comment: 'Type of contract'
      },
      vendorId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Reference to the vendor'
      },
      vendorName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Vendor name for quick reference'
      },
      contractingOfficerId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Contracting officer responsible for the contract'
      },
      contractingOfficerName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Contracting officer name'
      },
      projectId: {
        type: DataTypes.UUID,
        allowNull: true,
        comment: 'Associated project ID'
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Contract description'
      },
      statementOfWork: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Detailed statement of work'
      },
      status: {
        type: DataTypes.ENUM(...Object.values(ContractStatus)),
        allowNull: false,
        defaultValue: ContractStatus.DRAFT,
        comment: 'Current contract status'
      },
      awardDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Date contract was awarded'
      },
      effectiveDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Date contract becomes effective'
      },
      completionDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Scheduled completion date'
      },
      periodOfPerformanceStart: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Start of performance period'
      },
      periodOfPerformanceEnd: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'End of performance period'
      },
      baseAmount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        comment: 'Base contract amount'
      },
      optionAmount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true,
        defaultValue: 0,
        comment: 'Optional contract amount'
      },
      totalContractValue: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        comment: 'Total contract value (base + options + modifications)'
      },
      fundedAmount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Amount currently funded'
      },
      expendedAmount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Amount expended to date'
      },
      remainingFunds: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Remaining funded amount'
      },
      paymentTerms: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Payment terms and conditions'
      },
      deliverySchedule: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Delivery schedule details'
      },
      performanceBondRequired: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Whether performance bond is required'
      },
      performanceBondAmount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true,
        comment: 'Performance bond amount if required'
      },
      paymentBondRequired: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Whether payment bond is required'
      },
      paymentBondAmount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true,
        comment: 'Payment bond amount if required'
      },
      warrantyPeriodMonths: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Warranty period in months'
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
        comment: 'Additional contract metadata'
      }
    },
    {
      sequelize,
      tableName: 'contracts',
      timestamps: true,
      indexes: [
        { fields: ['contractNumber'], unique: true },
        { fields: ['vendorId'] },
        { fields: ['contractingOfficerId'] },
        { fields: ['projectId'] },
        { fields: ['status'] },
        { fields: ['awardDate'] },
        { fields: ['completionDate'] },
        { fields: ['contractType'] }
      ]
    }
  );

  return Contract;
};

/**
 * Contract modification model
 */
export const createContractModificationModel = (sequelize: Sequelize) => {
  class ContractModification extends Model {
    public id!: string;
    public contractId!: string;
    public modificationNumber!: string;
    public modificationType!: ModificationType;
    public description!: string;
    public reason!: string;
    public scope!: string;
    public priceAdjustment!: number;
    public timeExtensionDays!: number;
    public newCompletionDate!: Date;
    public fundingAdjustment!: number;
    public requestedBy!: string;
    public requestedDate!: Date;
    public approvedBy!: string;
    public approvedDate!: Date;
    public effectiveDate!: Date;
    public status!: string;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  ContractModification.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        comment: 'Unique identifier for the modification'
      },
      contractId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Reference to the contract'
      },
      modificationNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Unique modification number'
      },
      modificationType: {
        type: DataTypes.ENUM(...Object.values(ModificationType)),
        allowNull: false,
        comment: 'Type of modification'
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Modification description'
      },
      reason: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Reason for modification'
      },
      scope: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Scope of changes'
      },
      priceAdjustment: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Price adjustment amount (positive or negative)'
      },
      timeExtensionDays: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Number of days for time extension'
      },
      newCompletionDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'New completion date if changed'
      },
      fundingAdjustment: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Funding adjustment amount'
      },
      requestedBy: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Person who requested the modification'
      },
      requestedDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: 'Date modification was requested'
      },
      approvedBy: {
        type: DataTypes.STRING(200),
        allowNull: true,
        comment: 'Approving contracting officer'
      },
      approvedDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Date modification was approved'
      },
      effectiveDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Effective date of the modification'
      },
      status: {
        type: DataTypes.ENUM('DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'ACTIVE'),
        allowNull: false,
        defaultValue: 'DRAFT',
        comment: 'Modification status'
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
        comment: 'Additional modification metadata'
      }
    },
    {
      sequelize,
      tableName: 'contract_modifications',
      timestamps: true,
      indexes: [
        { fields: ['contractId'] },
        { fields: ['modificationNumber'], unique: true },
        { fields: ['modificationType'] },
        { fields: ['status'] },
        { fields: ['requestedDate'] },
        { fields: ['approvedDate'] }
      ]
    }
  );

  return ContractModification;
};

/**
 * Contract deliverable model
 */
export const createContractDeliverableModel = (sequelize: Sequelize) => {
  class ContractDeliverable extends Model {
    public id!: string;
    public contractId!: string;
    public deliverableName!: string;
    public description!: string;
    public deliverableType!: 'DOCUMENT' | 'PRODUCT' | 'SERVICE' | 'MILESTONE';
    public dueDate!: Date;
    public submittedDate!: Date;
    public acceptedDate!: Date;
    public responsibleParty!: string;
    public acceptanceCriteria!: string;
    public status!: DeliverableStatus;
    public reviewedBy!: string;
    public reviewComments!: string;
    public linkedMilestoneId!: string;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  ContractDeliverable.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        comment: 'Unique identifier for the deliverable'
      },
      contractId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Reference to the contract'
      },
      deliverableName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Name of the deliverable'
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Detailed description of the deliverable'
      },
      deliverableType: {
        type: DataTypes.ENUM('DOCUMENT', 'PRODUCT', 'SERVICE', 'MILESTONE'),
        allowNull: false,
        comment: 'Type of deliverable'
      },
      dueDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Due date for the deliverable'
      },
      submittedDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Date deliverable was submitted'
      },
      acceptedDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Date deliverable was accepted'
      },
      responsibleParty: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Party responsible for the deliverable'
      },
      acceptanceCriteria: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Criteria for accepting the deliverable'
      },
      status: {
        type: DataTypes.ENUM(...Object.values(DeliverableStatus)),
        allowNull: false,
        defaultValue: DeliverableStatus.NOT_STARTED,
        comment: 'Current status of the deliverable'
      },
      reviewedBy: {
        type: DataTypes.STRING(200),
        allowNull: true,
        comment: 'Person who reviewed the deliverable'
      },
      reviewComments: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Review comments'
      },
      linkedMilestoneId: {
        type: DataTypes.UUID,
        allowNull: true,
        comment: 'Linked milestone ID'
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
        comment: 'Additional deliverable metadata'
      }
    },
    {
      sequelize,
      tableName: 'contract_deliverables',
      timestamps: true,
      indexes: [
        { fields: ['contractId'] },
        { fields: ['status'] },
        { fields: ['dueDate'] },
        { fields: ['deliverableType'] },
        { fields: ['linkedMilestoneId'] }
      ]
    }
  );

  return ContractDeliverable;
};

/**
 * Contract milestone model
 */
export const createContractMilestoneModel = (sequelize: Sequelize) => {
  class ContractMilestone extends Model {
    public id!: string;
    public contractId!: string;
    public milestoneName!: string;
    public description!: string;
    public targetDate!: Date;
    public actualCompletionDate!: Date;
    public completionCriteria!: string;
    public paymentPercentage!: number;
    public paymentAmount!: number;
    public status!: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED';
    public dependencies!: string[];
    public completedBy!: string;
    public verifiedBy!: string;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  ContractMilestone.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        comment: 'Unique identifier for the milestone'
      },
      contractId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Reference to the contract'
      },
      milestoneName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Name of the milestone'
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Detailed description of the milestone'
      },
      targetDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Target completion date'
      },
      actualCompletionDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Actual completion date'
      },
      completionCriteria: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Criteria for milestone completion'
      },
      paymentPercentage: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        comment: 'Percentage of contract value tied to milestone'
      },
      paymentAmount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        comment: 'Payment amount for milestone completion'
      },
      status: {
        type: DataTypes.ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED', 'DELAYED'),
        allowNull: false,
        defaultValue: 'PENDING',
        comment: 'Milestone status'
      },
      dependencies: {
        type: DataTypes.ARRAY(DataTypes.UUID),
        allowNull: true,
        defaultValue: [],
        comment: 'Array of dependent milestone IDs'
      },
      completedBy: {
        type: DataTypes.STRING(200),
        allowNull: true,
        comment: 'Person who completed the milestone'
      },
      verifiedBy: {
        type: DataTypes.STRING(200),
        allowNull: true,
        comment: 'Person who verified milestone completion'
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
        comment: 'Additional milestone metadata'
      }
    },
    {
      sequelize,
      tableName: 'contract_milestones',
      timestamps: true,
      indexes: [
        { fields: ['contractId'] },
        { fields: ['status'] },
        { fields: ['targetDate'] },
        { fields: ['actualCompletionDate'] }
      ]
    }
  );

  return ContractMilestone;
};

/**
 * Contract closeout model
 */
export const createContractCloseoutModel = (sequelize: Sequelize) => {
  class ContractCloseout extends Model {
    public id!: string;
    public contractId!: string;
    public closeoutStatus!: CloseoutStatus;
    public closeoutInitiatedBy!: string;
    public closeoutInitiatedDate!: Date;
    public finalDeliverableDate!: Date;
    public finalPaymentDate!: Date;
    public finalInvoiceAmount!: number;
    public propertyDispositionComplete!: boolean;
    public patentReportingComplete!: boolean;
    public surplusPropertyComplete!: boolean;
    public releaseOfClaimsObtained!: boolean;
    public warrantyDocumentationComplete!: boolean;
    public lessonsLearnedDocumented!: boolean;
    public finalAuditComplete!: boolean;
    public closeoutCompletedBy!: string;
    public closeoutCompletedDate!: Date;
    public notes!: string;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  ContractCloseout.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        comment: 'Unique identifier for the closeout record'
      },
      contractId: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
        comment: 'Reference to the contract'
      },
      closeoutStatus: {
        type: DataTypes.ENUM(...Object.values(CloseoutStatus)),
        allowNull: false,
        defaultValue: CloseoutStatus.NOT_STARTED,
        comment: 'Current closeout status'
      },
      closeoutInitiatedBy: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Person who initiated closeout'
      },
      closeoutInitiatedDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: 'Date closeout was initiated'
      },
      finalDeliverableDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Date final deliverable was received'
      },
      finalPaymentDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Date final payment was made'
      },
      finalInvoiceAmount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true,
        comment: 'Final invoice amount'
      },
      propertyDispositionComplete: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Property disposition completed'
      },
      patentReportingComplete: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Patent reporting completed'
      },
      surplusPropertyComplete: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Surplus property disposition completed'
      },
      releaseOfClaimsObtained: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Release of claims obtained from contractor'
      },
      warrantyDocumentationComplete: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Warranty documentation completed'
      },
      lessonsLearnedDocumented: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Lessons learned documented'
      },
      finalAuditComplete: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Final audit completed'
      },
      closeoutCompletedBy: {
        type: DataTypes.STRING(200),
        allowNull: true,
        comment: 'Person who completed closeout'
      },
      closeoutCompletedDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Date closeout was completed'
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Closeout notes and comments'
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
        comment: 'Additional closeout metadata'
      }
    },
    {
      sequelize,
      tableName: 'contract_closeouts',
      timestamps: true,
      indexes: [
        { fields: ['contractId'], unique: true },
        { fields: ['closeoutStatus'] },
        { fields: ['closeoutInitiatedDate'] },
        { fields: ['closeoutCompletedDate'] }
      ]
    }
  );

  return ContractCloseout;
};

/**
 * Contract subcontractor model
 */
export const createContractSubcontractorModel = (sequelize: Sequelize) => {
  class ContractSubcontractor extends Model {
    public id!: string;
    public contractId!: string;
    public subcontractorId!: string;
    public subcontractorName!: string;
    public subcontractValue!: number;
    public workDescription!: string;
    public startDate!: Date;
    public endDate!: Date;
    public status!: 'ACTIVE' | 'COMPLETED' | 'TERMINATED';
    public performanceRating!: string;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  ContractSubcontractor.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        comment: 'Unique identifier for the subcontractor record'
      },
      contractId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Reference to the prime contract'
      },
      subcontractorId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Reference to the subcontractor vendor'
      },
      subcontractorName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Subcontractor name'
      },
      subcontractValue: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        comment: 'Subcontract value'
      },
      workDescription: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Description of subcontracted work'
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Subcontract start date'
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Subcontract end date'
      },
      status: {
        type: DataTypes.ENUM('ACTIVE', 'COMPLETED', 'TERMINATED'),
        allowNull: false,
        defaultValue: 'ACTIVE',
        comment: 'Subcontract status'
      },
      performanceRating: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Subcontractor performance rating'
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
        comment: 'Additional subcontractor metadata'
      }
    },
    {
      sequelize,
      tableName: 'contract_subcontractors',
      timestamps: true,
      indexes: [
        { fields: ['contractId'] },
        { fields: ['subcontractorId'] },
        { fields: ['status'] }
      ]
    }
  );

  return ContractSubcontractor;
};

/**
 * Main CEFMS Contract Management Controller Service
 *
 * Provides comprehensive contract administration, modification, and closeout
 * functionality for USACE procurement operations.
 */
@Injectable()
export class CEFMSContractManagementController {
  private readonly logger = new Logger(CEFMSContractManagementController.name);

  constructor(private readonly sequelize: Sequelize) {}

  /**
   * Creates a new contract
   *
   * @param contractData - Contract data
   * @param userId - ID of the user creating the contract
   * @returns Created contract
   */
  async createContract(contractData: ContractData, userId: string): Promise<any> {
    const transaction = await this.sequelize.transaction();

    try {
      this.logger.log(`Creating contract: ${contractData.contractNumber}`);

      // Validate contract data
      await this.validateContractData(contractData);

      // Get vendor and contracting officer names
      const vendorName = await this.getVendorName(contractData.vendorId);
      const coName = await this.getUserName(contractData.contractingOfficerId);

      const Contract = createContractModel(this.sequelize);
      const contract = await Contract.create(
        {
          ...contractData,
          vendorName,
          contractingOfficerName: coName,
          status: ContractStatus.DRAFT,
          expendedAmount: 0,
          remainingFunds: contractData.fundedAmount,
          metadata: contractData.metadata || {}
        },
        { transaction }
      );

      await transaction.commit();
      this.logger.log(`Contract created successfully: ${contractData.contractNumber}`);

      return contract;
    } catch (error) {
      await transaction.rollback();
      this.logger.error(`Failed to create contract: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Validates contract data
   *
   * @param contractData - Contract data to validate
   */
  private async validateContractData(contractData: ContractData): Promise<void> {
    if (!contractData.contractNumber || contractData.contractNumber.length === 0) {
      throw new BadRequestException('Contract number is required');
    }

    if (contractData.baseAmount <= 0) {
      throw new BadRequestException('Base amount must be greater than zero');
    }

    if (contractData.periodOfPerformanceEnd <= contractData.periodOfPerformanceStart) {
      throw new BadRequestException('Performance period end date must be after start date');
    }

    // Check for duplicate contract number
    const Contract = createContractModel(this.sequelize);
    const existing = await Contract.findOne({
      where: { contractNumber: contractData.contractNumber }
    });

    if (existing) {
      throw new ConflictException(`Contract number ${contractData.contractNumber} already exists`);
    }
  }

  /**
   * Gets vendor name by ID
   *
   * @param vendorId - Vendor ID
   * @returns Vendor name
   */
  private async getVendorName(vendorId: string): Promise<string> {
    const result = await this.sequelize.query(
      `SELECT vendor_name FROM vendors WHERE id = :vendorId`,
      {
        replacements: { vendorId },
        type: QueryTypes.SELECT
      }
    );

    if (!result || result.length === 0) {
      throw new NotFoundException(`Vendor not found: ${vendorId}`);
    }

    return result[0]['vendor_name'];
  }

  /**
   * Gets user name by ID
   *
   * @param userId - User ID
   * @returns User full name
   */
  private async getUserName(userId: string): Promise<string> {
    const result = await this.sequelize.query(
      `SELECT full_name FROM users WHERE id = :userId`,
      {
        replacements: { userId },
        type: QueryTypes.SELECT
      }
    );

    if (!result || result.length === 0) {
      return 'Unknown User';
    }

    return result[0]['full_name'];
  }

  /**
   * Awards a contract
   *
   * @param contractId - Contract ID
   * @param awardData - Award data
   * @param userId - User ID
   * @returns Updated contract
   */
  async awardContract(contractId: string, awardData: any, userId: string): Promise<any> {
    const transaction = await this.sequelize.transaction();

    try {
      this.logger.log(`Awarding contract: ${contractId}`);

      const Contract = createContractModel(this.sequelize);
      const contract = await Contract.findByPk(contractId, { transaction });

      if (!contract) {
        throw new NotFoundException(`Contract not found: ${contractId}`);
      }

      if (contract.status !== ContractStatus.PENDING_AWARD) {
        throw new BadRequestException(`Contract must be in PENDING_AWARD status to award. Current status: ${contract.status}`);
      }

      await contract.update(
        {
          status: ContractStatus.AWARDED,
          awardDate: awardData.awardDate || new Date(),
          metadata: { ...contract.metadata, awardedBy: userId, awardNotes: awardData.notes }
        },
        { transaction }
      );

      await transaction.commit();
      this.logger.log(`Contract awarded successfully: ${contract.contractNumber}`);

      return contract;
    } catch (error) {
      await transaction.rollback();
      this.logger.error(`Failed to award contract: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Activates a contract
   *
   * @param contractId - Contract ID
   * @param userId - User ID
   * @returns Updated contract
   */
  async activateContract(contractId: string, userId: string): Promise<any> {
    const transaction = await this.sequelize.transaction();

    try {
      this.logger.log(`Activating contract: ${contractId}`);

      const Contract = createContractModel(this.sequelize);
      const contract = await Contract.findByPk(contractId, { transaction });

      if (!contract) {
        throw new NotFoundException(`Contract not found: ${contractId}`);
      }

      if (contract.status !== ContractStatus.AWARDED) {
        throw new BadRequestException(`Contract must be in AWARDED status to activate. Current status: ${contract.status}`);
      }

      await contract.update(
        {
          status: ContractStatus.ACTIVE,
          metadata: { ...contract.metadata, activatedBy: userId, activatedDate: new Date() }
        },
        { transaction }
      );

      await transaction.commit();
      this.logger.log(`Contract activated successfully: ${contract.contractNumber}`);

      return contract;
    } catch (error) {
      await transaction.rollback();
      this.logger.error(`Failed to activate contract: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Creates a contract modification
   *
   * @param modificationData - Modification data
   * @param userId - User ID
   * @returns Created modification
   */
  async createContractModification(
    modificationData: ContractModificationData,
    userId: string
  ): Promise<any> {
    const transaction = await this.sequelize.transaction();

    try {
      this.logger.log(`Creating contract modification: ${modificationData.modificationNumber}`);

      const Contract = createContractModel(this.sequelize);
      const contract = await Contract.findByPk(modificationData.contractId, { transaction });

      if (!contract) {
        throw new NotFoundException(`Contract not found: ${modificationData.contractId}`);
      }

      const ContractModification = createContractModificationModel(this.sequelize);
      const modification = await ContractModification.create(
        {
          ...modificationData,
          requestedBy: await this.getUserName(userId),
          requestedDate: new Date(),
          status: 'DRAFT'
        },
        { transaction }
      );

      await transaction.commit();
      this.logger.log(`Contract modification created: ${modificationData.modificationNumber}`);

      return modification;
    } catch (error) {
      await transaction.rollback();
      this.logger.error(`Failed to create modification: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Approves a contract modification
   *
   * @param modificationId - Modification ID
   * @param userId - User ID
   * @returns Approved modification
   */
  async approveContractModification(modificationId: string, userId: string): Promise<any> {
    const transaction = await this.sequelize.transaction();

    try {
      this.logger.log(`Approving contract modification: ${modificationId}`);

      const ContractModification = createContractModificationModel(this.sequelize);
      const modification = await ContractModification.findByPk(modificationId, { transaction });

      if (!modification) {
        throw new NotFoundException(`Modification not found: ${modificationId}`);
      }

      await modification.update(
        {
          status: 'APPROVED',
          approvedBy: await this.getUserName(userId),
          approvedDate: new Date()
        },
        { transaction }
      );

      // Apply modification to contract
      await this.applyModificationToContract(modification, transaction);

      await transaction.commit();
      this.logger.log(`Contract modification approved: ${modification.modificationNumber}`);

      return modification;
    } catch (error) {
      await transaction.rollback();
      this.logger.error(`Failed to approve modification: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Applies modification changes to the contract
   *
   * @param modification - Contract modification
   * @param transaction - Database transaction
   */
  private async applyModificationToContract(
    modification: any,
    transaction: Transaction
  ): Promise<void> {
    const Contract = createContractModel(this.sequelize);
    const contract = await Contract.findByPk(modification.contractId, { transaction });

    if (!contract) {
      throw new NotFoundException(`Contract not found: ${modification.contractId}`);
    }

    const updates: any = {
      totalContractValue: parseFloat(contract.totalContractValue) + parseFloat(modification.priceAdjustment),
      fundedAmount: parseFloat(contract.fundedAmount) + parseFloat(modification.fundingAdjustment),
      remainingFunds: parseFloat(contract.remainingFunds) + parseFloat(modification.fundingAdjustment)
    };

    if (modification.newCompletionDate) {
      updates.completionDate = modification.newCompletionDate;
      updates.periodOfPerformanceEnd = modification.newCompletionDate;
    }

    await contract.update(updates, { transaction });
  }

  /**
   * Creates a contract deliverable
   *
   * @param deliverableData - Deliverable data
   * @param userId - User ID
   * @returns Created deliverable
   */
  async createContractDeliverable(
    deliverableData: DeliverableData,
    userId: string
  ): Promise<any> {
    const transaction = await this.sequelize.transaction();

    try {
      this.logger.log(`Creating contract deliverable for contract: ${deliverableData.contractId}`);

      const ContractDeliverable = createContractDeliverableModel(this.sequelize);
      const deliverable = await ContractDeliverable.create(
        {
          ...deliverableData,
          status: DeliverableStatus.NOT_STARTED,
          metadata: { createdBy: userId }
        },
        { transaction }
      );

      await transaction.commit();
      this.logger.log(`Contract deliverable created: ${deliverable.id}`);

      return deliverable;
    } catch (error) {
      await transaction.rollback();
      this.logger.error(`Failed to create deliverable: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Submits a contract deliverable
   *
   * @param deliverableId - Deliverable ID
   * @param userId - User ID
   * @returns Updated deliverable
   */
  async submitContractDeliverable(deliverableId: string, userId: string): Promise<any> {
    const transaction = await this.sequelize.transaction();

    try {
      this.logger.log(`Submitting deliverable: ${deliverableId}`);

      const ContractDeliverable = createContractDeliverableModel(this.sequelize);
      const deliverable = await ContractDeliverable.findByPk(deliverableId, { transaction });

      if (!deliverable) {
        throw new NotFoundException(`Deliverable not found: ${deliverableId}`);
      }

      await deliverable.update(
        {
          status: DeliverableStatus.SUBMITTED,
          submittedDate: new Date(),
          metadata: { ...deliverable.metadata, submittedBy: userId }
        },
        { transaction }
      );

      await transaction.commit();
      this.logger.log(`Deliverable submitted: ${deliverableId}`);

      return deliverable;
    } catch (error) {
      await transaction.rollback();
      this.logger.error(`Failed to submit deliverable: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Reviews and accepts/rejects a deliverable
   *
   * @param deliverableId - Deliverable ID
   * @param reviewData - Review data
   * @param userId - User ID
   * @returns Updated deliverable
   */
  async reviewContractDeliverable(
    deliverableId: string,
    reviewData: { approved: boolean; comments: string },
    userId: string
  ): Promise<any> {
    const transaction = await this.sequelize.transaction();

    try {
      this.logger.log(`Reviewing deliverable: ${deliverableId}`);

      const ContractDeliverable = createContractDeliverableModel(this.sequelize);
      const deliverable = await ContractDeliverable.findByPk(deliverableId, { transaction });

      if (!deliverable) {
        throw new NotFoundException(`Deliverable not found: ${deliverableId}`);
      }

      const newStatus = reviewData.approved ? DeliverableStatus.APPROVED : DeliverableStatus.REJECTED;

      await deliverable.update(
        {
          status: newStatus,
          reviewedBy: await this.getUserName(userId),
          reviewComments: reviewData.comments,
          acceptedDate: reviewData.approved ? new Date() : null
        },
        { transaction }
      );

      // If linked to milestone, check if milestone should be updated
      if (reviewData.approved && deliverable.linkedMilestoneId) {
        await this.checkMilestoneCompletion(deliverable.linkedMilestoneId, transaction);
      }

      await transaction.commit();
      this.logger.log(`Deliverable reviewed: ${deliverableId}, approved: ${reviewData.approved}`);

      return deliverable;
    } catch (error) {
      await transaction.rollback();
      this.logger.error(`Failed to review deliverable: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Checks if milestone should be marked as completed
   *
   * @param milestoneId - Milestone ID
   * @param transaction - Database transaction
   */
  private async checkMilestoneCompletion(
    milestoneId: string,
    transaction: Transaction
  ): Promise<void> {
    const ContractDeliverable = createContractDeliverableModel(this.sequelize);
    const deliverables = await ContractDeliverable.findAll({
      where: { linkedMilestoneId: milestoneId },
      transaction
    });

    const allApproved = deliverables.every(d => d.status === DeliverableStatus.APPROVED);

    if (allApproved) {
      const ContractMilestone = createContractMilestoneModel(this.sequelize);
      await ContractMilestone.update(
        {
          status: 'COMPLETED',
          actualCompletionDate: new Date()
        },
        {
          where: { id: milestoneId },
          transaction
        }
      );

      this.logger.log(`Milestone ${milestoneId} marked as completed`);
    }
  }

  /**
   * Creates a contract milestone
   *
   * @param milestoneData - Milestone data
   * @param userId - User ID
   * @returns Created milestone
   */
  async createContractMilestone(milestoneData: MilestoneData, userId: string): Promise<any> {
    const transaction = await this.sequelize.transaction();

    try {
      this.logger.log(`Creating contract milestone for contract: ${milestoneData.contractId}`);

      const ContractMilestone = createContractMilestoneModel(this.sequelize);
      const milestone = await ContractMilestone.create(
        {
          ...milestoneData,
          status: 'PENDING',
          metadata: { createdBy: userId }
        },
        { transaction }
      );

      await transaction.commit();
      this.logger.log(`Contract milestone created: ${milestone.id}`);

      return milestone;
    } catch (error) {
      await transaction.rollback();
      this.logger.error(`Failed to create milestone: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Completes a contract milestone
   *
   * @param milestoneId - Milestone ID
   * @param completionData - Completion data
   * @param userId - User ID
   * @returns Updated milestone
   */
  async completeContractMilestone(
    milestoneId: string,
    completionData: any,
    userId: string
  ): Promise<any> {
    const transaction = await this.sequelize.transaction();

    try {
      this.logger.log(`Completing milestone: ${milestoneId}`);

      const ContractMilestone = createContractMilestoneModel(this.sequelize);
      const milestone = await ContractMilestone.findByPk(milestoneId, { transaction });

      if (!milestone) {
        throw new NotFoundException(`Milestone not found: ${milestoneId}`);
      }

      await milestone.update(
        {
          status: 'COMPLETED',
          actualCompletionDate: completionData.completionDate || new Date(),
          completedBy: await this.getUserName(userId),
          verifiedBy: completionData.verifiedBy,
          metadata: { ...milestone.metadata, completionNotes: completionData.notes }
        },
        { transaction }
      );

      await transaction.commit();
      this.logger.log(`Milestone completed: ${milestoneId}`);

      return milestone;
    } catch (error) {
      await transaction.rollback();
      this.logger.error(`Failed to complete milestone: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Initiates contract closeout process
   *
   * @param contractId - Contract ID
   * @param closeoutData - Closeout data
   * @param userId - User ID
   * @returns Created closeout record
   */
  async initiateContractCloseout(
    contractId: string,
    closeoutData: Partial<ContractCloseoutData>,
    userId: string
  ): Promise<any> {
    const transaction = await this.sequelize.transaction();

    try {
      this.logger.log(`Initiating contract closeout for contract: ${contractId}`);

      const Contract = createContractModel(this.sequelize);
      const contract = await Contract.findByPk(contractId, { transaction });

      if (!contract) {
        throw new NotFoundException(`Contract not found: ${contractId}`);
      }

      if (contract.status !== ContractStatus.COMPLETED) {
        throw new BadRequestException(`Contract must be in COMPLETED status to initiate closeout. Current status: ${contract.status}`);
      }

      const ContractCloseout = createContractCloseoutModel(this.sequelize);
      const closeout = await ContractCloseout.create(
        {
          contractId,
          closeoutInitiatedBy: await this.getUserName(userId),
          closeoutInitiatedDate: new Date(),
          closeoutStatus: CloseoutStatus.IN_PROGRESS,
          propertyDispositionComplete: false,
          patentReportingComplete: false,
          surplusPropertyComplete: false,
          releaseOfClaimsObtained: false,
          warrantyDocumentationComplete: false,
          lessonsLearnedDocumented: false,
          finalAuditComplete: false,
          notes: closeoutData.notes || ''
        },
        { transaction }
      );

      await transaction.commit();
      this.logger.log(`Contract closeout initiated: ${contractId}`);

      return closeout;
    } catch (error) {
      await transaction.rollback();
      this.logger.error(`Failed to initiate closeout: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Updates contract closeout checklist
   *
   * @param closeoutId - Closeout ID
   * @param checklistUpdates - Checklist updates
   * @param userId - User ID
   * @returns Updated closeout record
   */
  async updateContractCloseoutChecklist(
    closeoutId: string,
    checklistUpdates: any,
    userId: string
  ): Promise<any> {
    const transaction = await this.sequelize.transaction();

    try {
      this.logger.log(`Updating closeout checklist: ${closeoutId}`);

      const ContractCloseout = createContractCloseoutModel(this.sequelize);
      const closeout = await ContractCloseout.findByPk(closeoutId, { transaction });

      if (!closeout) {
        throw new NotFoundException(`Closeout record not found: ${closeoutId}`);
      }

      await closeout.update(checklistUpdates, { transaction });

      // Check if all items are complete
      const allComplete = await this.checkCloseoutComplete(closeout);

      if (allComplete) {
        await closeout.update(
          {
            closeoutStatus: CloseoutStatus.COMPLETED,
            closeoutCompletedBy: await this.getUserName(userId),
            closeoutCompletedDate: new Date()
          },
          { transaction }
        );

        // Update contract status
        const Contract = createContractModel(this.sequelize);
        await Contract.update(
          { status: ContractStatus.CLOSED },
          { where: { id: closeout.contractId }, transaction }
        );
      }

      await transaction.commit();
      this.logger.log(`Closeout checklist updated: ${closeoutId}`);

      return closeout;
    } catch (error) {
      await transaction.rollback();
      this.logger.error(`Failed to update closeout checklist: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Checks if all closeout items are complete
   *
   * @param closeout - Closeout record
   * @returns True if all items complete
   */
  private async checkCloseoutComplete(closeout: any): Promise<boolean> {
    return (
      closeout.propertyDispositionComplete &&
      closeout.patentReportingComplete &&
      closeout.surplusPropertyComplete &&
      closeout.releaseOfClaimsObtained &&
      closeout.warrantyDocumentationComplete &&
      closeout.lessonsLearnedDocumented &&
      closeout.finalAuditComplete
    );
  }

  /**
   * Adds a subcontractor to a contract
   *
   * @param contractId - Contract ID
   * @param subcontractorData - Subcontractor data
   * @param userId - User ID
   * @returns Created subcontractor record
   */
  async addContractSubcontractor(
    contractId: string,
    subcontractorData: any,
    userId: string
  ): Promise<any> {
    const transaction = await this.sequelize.transaction();

    try {
      this.logger.log(`Adding subcontractor to contract: ${contractId}`);

      const subcontractorName = await this.getVendorName(subcontractorData.subcontractorId);

      const ContractSubcontractor = createContractSubcontractorModel(this.sequelize);
      const subcontractor = await ContractSubcontractor.create(
        {
          contractId,
          subcontractorId: subcontractorData.subcontractorId,
          subcontractorName,
          subcontractValue: subcontractorData.subcontractValue,
          workDescription: subcontractorData.workDescription,
          startDate: subcontractorData.startDate,
          endDate: subcontractorData.endDate,
          status: 'ACTIVE',
          metadata: { addedBy: userId }
        },
        { transaction }
      );

      await transaction.commit();
      this.logger.log(`Subcontractor added: ${subcontractor.id}`);

      return subcontractor;
    } catch (error) {
      await transaction.rollback();
      this.logger.error(`Failed to add subcontractor: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Generates contract performance report
   *
   * @param contractId - Contract ID
   * @returns Contract performance report
   */
  async generateContractPerformanceReport(contractId: string): Promise<any> {
    try {
      this.logger.log(`Generating performance report for contract: ${contractId}`);

      const Contract = createContractModel(this.sequelize);
      const contract = await Contract.findByPk(contractId);

      if (!contract) {
        throw new NotFoundException(`Contract not found: ${contractId}`);
      }

      // Get deliverables status
      const deliverables = await this.sequelize.query(
        `SELECT status, COUNT(*) as count FROM contract_deliverables WHERE contract_id = :contractId GROUP BY status`,
        {
          replacements: { contractId },
          type: QueryTypes.SELECT
        }
      );

      // Get milestones status
      const milestones = await this.sequelize.query(
        `SELECT status, COUNT(*) as count FROM contract_milestones WHERE contract_id = :contractId GROUP BY status`,
        {
          replacements: { contractId },
          type: QueryTypes.SELECT
        }
      );

      // Calculate financial performance
      const expenditureRate = contract.fundedAmount > 0
        ? (contract.expendedAmount / contract.fundedAmount) * 100
        : 0;

      // Calculate schedule performance
      const totalDays = Math.floor(
        (contract.periodOfPerformanceEnd.getTime() - contract.periodOfPerformanceStart.getTime()) / (1000 * 60 * 60 * 24)
      );
      const elapsedDays = Math.floor(
        (new Date().getTime() - contract.periodOfPerformanceStart.getTime()) / (1000 * 60 * 60 * 24)
      );
      const scheduleProgress = totalDays > 0 ? (elapsedDays / totalDays) * 100 : 0;

      return {
        contract: {
          contractNumber: contract.contractNumber,
          contractType: contract.contractType,
          status: contract.status,
          vendorName: contract.vendorName
        },
        financial: {
          totalContractValue: contract.totalContractValue,
          fundedAmount: contract.fundedAmount,
          expendedAmount: contract.expendedAmount,
          remainingFunds: contract.remainingFunds,
          expenditureRate: expenditureRate.toFixed(2)
        },
        schedule: {
          periodOfPerformanceStart: contract.periodOfPerformanceStart,
          periodOfPerformanceEnd: contract.periodOfPerformanceEnd,
          totalDays,
          elapsedDays,
          remainingDays: totalDays - elapsedDays,
          scheduleProgress: scheduleProgress.toFixed(2)
        },
        deliverables: deliverables,
        milestones: milestones
      };
    } catch (error) {
      this.logger.error(`Failed to generate performance report: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Searches contracts with filters
   *
   * @param filters - Search filters
   * @param pagination - Pagination options
   * @returns Search results
   */
  async searchContracts(
    filters: any,
    pagination: { page: number; limit: number }
  ): Promise<any> {
    try {
      const offset = (pagination.page - 1) * pagination.limit;
      const limit = pagination.limit;

      const whereClauses: string[] = [];
      const replacements: any = { limit, offset };

      if (filters.status) {
        whereClauses.push('status = :status');
        replacements.status = filters.status;
      }

      if (filters.vendorId) {
        whereClauses.push('vendor_id = :vendorId');
        replacements.vendorId = filters.vendorId;
      }

      if (filters.contractType) {
        whereClauses.push('contract_type = :contractType');
        replacements.contractType = filters.contractType;
      }

      const whereClause = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

      const countResult = await this.sequelize.query(
        `SELECT COUNT(*) as total FROM contracts ${whereClause}`,
        {
          replacements,
          type: QueryTypes.SELECT
        }
      );

      const total = parseInt(countResult[0]['total']);

      const dataResult = await this.sequelize.query(
        `SELECT * FROM contracts ${whereClause} ORDER BY created_at DESC LIMIT :limit OFFSET :offset`,
        {
          replacements,
          type: QueryTypes.SELECT
        }
      );

      return {
        data: dataResult,
        pagination: {
          page: pagination.page,
          limit: pagination.limit,
          total,
          pages: Math.ceil(total / pagination.limit)
        }
      };
    } catch (error) {
      this.logger.error(`Failed to search contracts: ${error.message}`, error.stack);
      throw error;
    }
  }
}

/**
 * Export all models and services
 */
export default {
  CEFMSContractManagementController,
  createContractModel,
  createContractModificationModel,
  createContractDeliverableModel,
  createContractMilestoneModel,
  createContractCloseoutModel,
  createContractSubcontractorModel,
  ContractStatus,
  ContractType,
  ModificationType,
  DeliverableStatus,
  CloseoutStatus
};
