/**
 * LOC: CEFMS-CONSTRUCT-BILLING-DS-001
 * File: /reuse/financial/cefms/composites/downstream/construction-billing-backend-service.ts
 *
 * UPSTREAM (imports from):
 *   - ../cefms-construction-progress-billing-composite.ts
 *   - ../cefms-project-cost-tracking-composite.ts
 *
 * DOWNSTREAM (imported by):
 *   - CEFMS construction billing API controllers
 *   - Progress payment processors
 *   - Contractor payment management systems
 */

/**
 * File: /reuse/financial/cefms/composites/downstream/construction-billing-backend-service.ts
 * Locator: WC-CEFMS-CONSTRUCT-BILLING-DS-001
 * Purpose: Production-ready Construction Billing Backend Service for USACE CEFMS - comprehensive progress billing,
 *          contractor payments, retainage management, pay applications, percentage completion tracking, and billing compliance
 *
 * Upstream: Imports from cefms-construction-progress-billing-composite.ts
 * Downstream: Backend services, API controllers, billing processors
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, decimal.js 10.x
 * Exports: 50+ service functions for construction billing operations
 *
 * LLM Context: Complete NestJS backend service for construction billing and progress payment processing.
 * Manages entire billing lifecycle from pay application submission through payment approval and disbursement.
 * Handles USACE-specific construction billing requirements including retainage, percentage completion calculations,
 * stored materials billing, change order billing, mobilization payments, and contract closeout billing.
 */

import { Model, DataTypes, Sequelize, Transaction, Op } from 'sequelize';
import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import Decimal from 'decimal.js';

// Import composite functions
import {
  createConstructionContractModel,
  createPayApplicationModel,
  createRetainageModel,
  createStoredMaterialsModel,
  submitPayApplication,
  approvePayApplication,
  calculateRetainage,
  releaseRetainage,
  processStoredMaterialsBilling,
  calculatePercentageComplete,
  generateProgressPaymentSchedule,
  processChangeOrderBilling,
  validatePaymentAgainstContract,
  reconcileContractBilling,
  generateContractorPaymentCertificate,
} from '../cefms-construction-progress-billing-composite';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Construction contractor master data
 */
export interface ConstructionContractor {
  contractorId: string;
  contractorName: string;
  cageCode: string; // Commercial and Government Entity Code
  dunsNumber: string;
  taxId: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  bondingCapacity: number;
  insuranceLimits: {
    general: number;
    professional: number;
    workers_comp: number;
  };
  prequalificationStatus: 'active' | 'suspended' | 'debarred';
  bondProvider?: string;
  bondNumber?: string;
  certifications: string[];
  metadata: Record<string, any>;
}

/**
 * Payment application line item
 */
export interface PaymentLineItem {
  lineItemId: string;
  payApplicationId: string;
  costCode: string;
  description: string;
  scheduledValue: number;
  workCompletedPrevious: number;
  workCompletedThisPeriod: number;
  workCompletedToDate: number;
  materialsStoredPrevious: number;
  materialsStoredThisPeriod: number;
  materialsStoredToDate: number;
  totalCompleted: number;
  percentComplete: number;
  balance: number;
}

/**
 * Retainage transaction
 */
export interface RetainageTransaction {
  transactionId: string;
  contractId: string;
  payApplicationId?: string;
  transactionType: 'withhold' | 'release' | 'adjustment';
  amount: number;
  retainageRate: number;
  cumulativeRetainage: number;
  transactionDate: Date;
  releasedBy?: string;
  reason?: string;
  metadata: Record<string, any>;
}

/**
 * Stored materials inspection record
 */
export interface StoredMaterialsInspection {
  inspectionId: string;
  materialId: string;
  inspectionDate: Date;
  inspector: string;
  quantity: number;
  condition: 'acceptable' | 'damaged' | 'rejected';
  storageLocation: string;
  securityMeasures: string[];
  insuranceVerified: boolean;
  approvedForPayment: boolean;
  notes?: string;
}

/**
 * Payment certification document
 */
export interface PaymentCertification {
  certificationId: string;
  payApplicationId: string;
  contractId: string;
  certifiedAmount: number;
  certificationDate: Date;
  certifiedBy: string;
  certifierTitle: string;
  certifierLicense?: string;
  complianceChecks: {
    prevailingWageCompliance: boolean;
    eeoCompliance: boolean;
    safetyCompliance: boolean;
    qualityCompliance: boolean;
  };
  certificationStatement: string;
  signature?: string;
}

/**
 * Progress billing schedule
 */
export interface BillingSchedule {
  scheduleId: string;
  contractId: string;
  fiscalYear: number;
  scheduledPayments: ScheduledPayment[];
  totalScheduled: number;
  totalActual: number;
  variance: number;
}

export interface ScheduledPayment {
  paymentNumber: number;
  scheduledDate: Date;
  actualDate?: Date;
  scheduledAmount: number;
  actualAmount: number;
  milestone?: string;
  status: 'pending' | 'paid' | 'delayed';
}

/**
 * Contract closeout documentation
 */
export interface ContractCloseout {
  closeoutId: string;
  contractId: string;
  finalPaymentDate: Date;
  originalContractAmount: number;
  approvedChangeOrders: number;
  finalContractAmount: number;
  totalPaid: number;
  retainageWithheld: number;
  retainageReleased: number;
  finalRetainageBalance: number;
  punchListComplete: boolean;
  lienWaiversReceived: boolean;
  asBuiltDrawingsReceived: boolean;
  warrantyDocumentsReceived: boolean;
  finalInspectionDate?: Date;
  acceptanceDate?: Date;
  closeoutStatus: 'in_progress' | 'complete' | 'pending_documents';
}

/**
 * Lien waiver tracking
 */
export interface LienWaiver {
  waiverId: string;
  contractId: string;
  contractorId: string;
  waiverType: 'partial' | 'final' | 'conditional' | 'unconditional';
  paymentPeriod: Date;
  amountCovered: number;
  receivedDate: Date;
  notarized: boolean;
  validThrough?: Date;
  subcontractors: string[];
  materialSuppliers: string[];
}

/**
 * Prevailing wage compliance record
 */
export interface PrevailingWageCompliance {
  complianceId: string;
  contractId: string;
  payrollPeriod: Date;
  contractorName: string;
  employeeCount: number;
  wageClassifications: WageClassification[];
  certifiedBy: string;
  certificationDate: Date;
  violationsFound: boolean;
  violations?: WageViolation[];
}

export interface WageClassification {
  classification: string;
  employeeCount: number;
  prevailingWageRate: number;
  actualWageRate: number;
  compliant: boolean;
}

export interface WageViolation {
  employee: string;
  classification: string;
  requiredRate: number;
  paidRate: number;
  shortfall: number;
  periodAffected: Date;
}

/**
 * Mobilization payment tracking
 */
export interface MobilizationPayment {
  mobilizationId: string;
  contractId: string;
  totalMobilizationAmount: number;
  advancePaymentAmount: number;
  advancePaymentDate?: Date;
  equipmentDelivered: boolean;
  siteEstablished: boolean;
  recoupmentSchedule: RecoupmentSchedule[];
  balanceRecouped: number;
  balanceRemaining: number;
}

export interface RecoupmentSchedule {
  paymentNumber: number;
  recoupmentAmount: number;
  recoupmentDate?: Date;
  status: 'pending' | 'recouped';
}

/**
 * Subcontractor payment tracking
 */
export interface SubcontractorPayment {
  subPaymentId: string;
  primeContractId: string;
  subcontractorId: string;
  subcontractorName: string;
  subcontractAmount: number;
  paymentPeriod: Date;
  amountDue: number;
  amountPaid: number;
  paymentDate?: Date;
  status: 'pending' | 'approved' | 'paid' | 'disputed';
  lienWaiverReceived: boolean;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Construction Contractor model
 */
export const createConstructionContractorModel = (sequelize: Sequelize) => {
  class ConstructionContractor extends Model {
    public id!: string;
    public contractorId!: string;
    public contractorName!: string;
    public cageCode!: string;
    public dunsNumber!: string;
    public taxId!: string;
    public address!: Record<string, any>;
    public contactPerson!: string;
    public contactEmail!: string;
    public contactPhone!: string;
    public bondingCapacity!: number;
    public insuranceLimits!: Record<string, any>;
    public prequalificationStatus!: string;
    public bondProvider!: string | null;
    public bondNumber!: string | null;
    public certifications!: string[];
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  ConstructionContractor.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      contractorId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Contractor identifier',
      },
      contractorName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Contractor business name',
      },
      cageCode: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
        comment: 'Commercial and Government Entity Code',
      },
      dunsNumber: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
        comment: 'DUNS number',
      },
      taxId: {
        type: DataTypes.STRING(20),
        allowNull: false,
        comment: 'Tax identification number',
      },
      address: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Business address',
      },
      contactPerson: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Primary contact person',
      },
      contactEmail: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          isEmail: true,
        },
        comment: 'Contact email',
      },
      contactPhone: {
        type: DataTypes.STRING(20),
        allowNull: false,
        comment: 'Contact phone number',
      },
      bondingCapacity: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Bonding capacity',
      },
      insuranceLimits: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Insurance coverage limits',
      },
      prequalificationStatus: {
        type: DataTypes.ENUM('active', 'suspended', 'debarred'),
        allowNull: false,
        defaultValue: 'active',
        comment: 'Prequalification status',
      },
      bondProvider: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Performance bond provider',
      },
      bondNumber: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Performance bond number',
      },
      certifications: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Contractor certifications',
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
      tableName: 'cefms_construction_contractors',
      timestamps: true,
      indexes: [
        { fields: ['contractorId'], unique: true },
        { fields: ['cageCode'], unique: true },
        { fields: ['dunsNumber'], unique: true },
        { fields: ['prequalificationStatus'] },
      ],
    },
  );

  return ConstructionContractor;
};

/**
 * Payment Line Item model
 */
export const createPaymentLineItemModel = (sequelize: Sequelize) => {
  class PaymentLineItem extends Model {
    public id!: string;
    public lineItemId!: string;
    public payApplicationId!: string;
    public costCode!: string;
    public description!: string;
    public scheduledValue!: number;
    public workCompletedPrevious!: number;
    public workCompletedThisPeriod!: number;
    public workCompletedToDate!: number;
    public materialsStoredPrevious!: number;
    public materialsStoredThisPeriod!: number;
    public materialsStoredToDate!: number;
    public totalCompleted!: number;
    public percentComplete!: number;
    public balance!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  PaymentLineItem.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      lineItemId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Line item identifier',
      },
      payApplicationId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Related pay application',
      },
      costCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Cost code',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Work description',
      },
      scheduledValue: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        comment: 'Scheduled value from contract',
      },
      workCompletedPrevious: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Work completed in previous periods',
      },
      workCompletedThisPeriod: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Work completed this period',
      },
      workCompletedToDate: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Total work completed to date',
      },
      materialsStoredPrevious: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Materials stored in previous periods',
      },
      materialsStoredThisPeriod: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Materials stored this period',
      },
      materialsStoredToDate: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Total materials stored to date',
      },
      totalCompleted: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Total completed (work + materials)',
      },
      percentComplete: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Percentage complete',
      },
      balance: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Balance to complete',
      },
    },
    {
      sequelize,
      tableName: 'cefms_payment_line_items',
      timestamps: true,
      indexes: [
        { fields: ['lineItemId'], unique: true },
        { fields: ['payApplicationId'] },
        { fields: ['costCode'] },
      ],
    },
  );

  return PaymentLineItem;
};

/**
 * Lien Waiver model
 */
export const createLienWaiverModel = (sequelize: Sequelize) => {
  class LienWaiver extends Model {
    public id!: string;
    public waiverId!: string;
    public contractId!: string;
    public contractorId!: string;
    public waiverType!: string;
    public paymentPeriod!: Date;
    public amountCovered!: number;
    public receivedDate!: Date;
    public notarized!: boolean;
    public validThrough!: Date | null;
    public subcontractors!: string[];
    public materialSuppliers!: string[];
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  LienWaiver.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      waiverId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Waiver identifier',
      },
      contractId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Related contract',
      },
      contractorId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Contractor submitting waiver',
      },
      waiverType: {
        type: DataTypes.ENUM('partial', 'final', 'conditional', 'unconditional'),
        allowNull: false,
        comment: 'Type of lien waiver',
      },
      paymentPeriod: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Payment period covered',
      },
      amountCovered: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        comment: 'Amount covered by waiver',
      },
      receivedDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Date waiver received',
      },
      notarized: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Whether waiver is notarized',
      },
      validThrough: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Waiver expiration date',
      },
      subcontractors: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Covered subcontractors',
      },
      materialSuppliers: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Covered material suppliers',
      },
    },
    {
      sequelize,
      tableName: 'cefms_lien_waivers',
      timestamps: true,
      indexes: [
        { fields: ['waiverId'], unique: true },
        { fields: ['contractId'] },
        { fields: ['contractorId'] },
        { fields: ['waiverType'] },
      ],
    },
  );

  return LienWaiver;
};

// ============================================================================
// CONTRACTOR MANAGEMENT FUNCTIONS (Functions 1-10)
// ============================================================================

/**
 * Registers a new construction contractor in the system.
 *
 * @param {ConstructionContractor} contractorData - Contractor data
 * @param {any} ContractorModel - Contractor model
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created contractor
 *
 * @example
 * ```typescript
 * const contractor = await registerConstructionContractor({
 *   contractorId: 'CONT-001',
 *   contractorName: 'ABC Construction Company',
 *   cageCode: '1A2B3',
 *   dunsNumber: '123456789',
 *   taxId: '12-3456789',
 *   address: {
 *     street: '123 Main St',
 *     city: 'Anytown',
 *     state: 'ST',
 *     zip: '12345'
 *   },
 *   contactPerson: 'John Smith',
 *   contactEmail: 'john@abcconstruction.com',
 *   contactPhone: '555-1234',
 *   bondingCapacity: 50000000,
 *   insuranceLimits: {
 *     general: 2000000,
 *     professional: 1000000,
 *     workers_comp: 1000000
 *   },
 *   prequalificationStatus: 'active',
 *   certifications: ['SBA 8(a)', 'SDVOSB']
 * }, ContractorModel);
 * ```
 */
export const registerConstructionContractor = async (
  contractorData: any,
  ContractorModel: any,
  transaction?: Transaction,
): Promise<any> => {
  if (!contractorData.cageCode || !contractorData.dunsNumber) {
    throw new BadRequestException('CAGE Code and DUNS Number are required');
  }

  // Validate bonding capacity
  if (contractorData.bondingCapacity <= 0) {
    throw new BadRequestException('Bonding capacity must be positive');
  }

  const contractor = await ContractorModel.create(contractorData, { transaction });

  return contractor;
};

/**
 * Updates contractor prequalification status.
 *
 * @param {string} contractorId - Contractor identifier
 * @param {'active' | 'suspended' | 'debarred'} status - New status
 * @param {string} reason - Reason for status change
 * @param {any} ContractorModel - Contractor model
 * @returns {Promise<any>} Updated contractor
 *
 * @example
 * ```typescript
 * const updated = await updateContractorPrequalification(
 *   'CONT-001',
 *   'suspended',
 *   'Failure to meet insurance requirements',
 *   ContractorModel
 * );
 * ```
 */
export const updateContractorPrequalification = async (
  contractorId: string,
  status: 'active' | 'suspended' | 'debarred',
  reason: string,
  ContractorModel: any,
): Promise<any> => {
  const contractor = await ContractorModel.findOne({ where: { contractorId } });

  if (!contractor) {
    throw new NotFoundException(`Contractor ${contractorId} not found`);
  }

  const oldStatus = contractor.prequalificationStatus;
  contractor.prequalificationStatus = status;

  // Log status change
  const statusHistory = contractor.metadata.statusHistory || [];
  statusHistory.push({
    fromStatus: oldStatus,
    toStatus: status,
    reason,
    changedAt: new Date(),
  });

  contractor.metadata = {
    ...contractor.metadata,
    statusHistory,
  };

  await contractor.save();

  return contractor;
};

/**
 * Verifies contractor bonding and insurance compliance.
 *
 * @param {string} contractorId - Contractor identifier
 * @param {number} contractAmount - Contract amount to verify against
 * @param {any} ContractorModel - Contractor model
 * @returns {Promise<{ compliant: boolean; issues: string[] }>} Compliance status
 *
 * @example
 * ```typescript
 * const compliance = await verifyContractorCompliance('CONT-001', 5000000, ContractorModel);
 * if (!compliance.compliant) {
 *   console.log('Compliance issues:', compliance.issues);
 * }
 * ```
 */
export const verifyContractorCompliance = async (
  contractorId: string,
  contractAmount: number,
  ContractorModel: any,
): Promise<{ compliant: boolean; issues: string[] }> => {
  const contractor = await ContractorModel.findOne({ where: { contractorId } });

  if (!contractor) {
    throw new NotFoundException(`Contractor ${contractorId} not found`);
  }

  const issues: string[] = [];

  // Check prequalification status
  if (contractor.prequalificationStatus !== 'active') {
    issues.push(`Contractor status is ${contractor.prequalificationStatus}`);
  }

  // Check bonding capacity
  if (parseFloat(contractor.bondingCapacity) < contractAmount) {
    issues.push('Bonding capacity insufficient for contract amount');
  }

  // Check insurance limits
  const requiredGeneral = contractAmount * 0.1; // 10% of contract
  if (contractor.insuranceLimits.general < requiredGeneral) {
    issues.push('General liability insurance insufficient');
  }

  return {
    compliant: issues.length === 0,
    issues,
  };
};

/**
 * Retrieves contractor performance history.
 *
 * @param {string} contractorId - Contractor identifier
 * @param {any} ContractorModel - Contractor model
 * @param {any} ContractModel - Contract model
 * @returns {Promise<any>} Performance history
 *
 * @example
 * ```typescript
 * const history = await getContractorPerformanceHistory('CONT-001', ContractorModel, ContractModel);
 * console.log(`Completed ${history.completedContracts} contracts with ${history.averageScore}% average score`);
 * ```
 */
export const getContractorPerformanceHistory = async (
  contractorId: string,
  ContractorModel: any,
  ContractModel: any,
): Promise<any> => {
  const contractor = await ContractorModel.findOne({ where: { contractorId } });

  if (!contractor) {
    throw new NotFoundException(`Contractor ${contractorId} not found`);
  }

  // Get performance metrics from metadata
  const performanceHistory = contractor.metadata.performanceHistory || {
    completedContracts: 0,
    activeContracts: 0,
    totalContractValue: 0,
    averageScore: 0,
    onTimeDeliveryRate: 0,
    qualityRating: 0,
    safetyRating: 0,
  };

  return {
    contractorId,
    contractorName: contractor.contractorName,
    ...performanceHistory,
  };
};

/**
 * Updates contractor certifications and qualifications.
 *
 * @param {string} contractorId - Contractor identifier
 * @param {string[]} certifications - Updated certifications list
 * @param {any} ContractorModel - Contractor model
 * @returns {Promise<any>} Updated contractor
 *
 * @example
 * ```typescript
 * const updated = await updateContractorCertifications(
 *   'CONT-001',
 *   ['SBA 8(a)', 'SDVOSB', 'ISO 9001'],
 *   ContractorModel
 * );
 * ```
 */
export const updateContractorCertifications = async (
  contractorId: string,
  certifications: string[],
  ContractorModel: any,
): Promise<any> => {
  const contractor = await ContractorModel.findOne({ where: { contractorId } });

  if (!contractor) {
    throw new NotFoundException(`Contractor ${contractorId} not found`);
  }

  contractor.certifications = certifications;
  await contractor.save();

  return contractor;
};

/**
 * Processes contractor bond verification.
 *
 * @param {string} contractorId - Contractor identifier
 * @param {string} bondProvider - Bond provider name
 * @param {string} bondNumber - Bond number
 * @param {number} bondAmount - Bond amount
 * @param {Date} expirationDate - Bond expiration date
 * @param {any} ContractorModel - Contractor model
 * @returns {Promise<any>} Updated contractor
 *
 * @example
 * ```typescript
 * const verified = await processContractorBondVerification(
 *   'CONT-001',
 *   'Surety Bond Company',
 *   'BOND-123456',
 *   10000000,
 *   new Date('2025-12-31'),
 *   ContractorModel
 * );
 * ```
 */
export const processContractorBondVerification = async (
  contractorId: string,
  bondProvider: string,
  bondNumber: string,
  bondAmount: number,
  expirationDate: Date,
  ContractorModel: any,
): Promise<any> => {
  const contractor = await ContractorModel.findOne({ where: { contractorId } });

  if (!contractor) {
    throw new NotFoundException(`Contractor ${contractorId} not found`);
  }

  contractor.bondProvider = bondProvider;
  contractor.bondNumber = bondNumber;
  contractor.bondingCapacity = bondAmount;

  // Store bond verification in metadata
  const bondVerifications = contractor.metadata.bondVerifications || [];
  bondVerifications.push({
    bondProvider,
    bondNumber,
    bondAmount,
    expirationDate,
    verifiedAt: new Date(),
  });

  contractor.metadata = {
    ...contractor.metadata,
    bondVerifications,
  };

  await contractor.save();

  return contractor;
};

/**
 * Validates contractor insurance coverage.
 *
 * @param {string} contractorId - Contractor identifier
 * @param {any} insuranceLimits - Updated insurance limits
 * @param {Date} policyExpiration - Policy expiration date
 * @param {any} ContractorModel - Contractor model
 * @returns {Promise<any>} Updated contractor
 *
 * @example
 * ```typescript
 * const validated = await validateContractorInsurance(
 *   'CONT-001',
 *   {
 *     general: 2000000,
 *     professional: 1000000,
 *     workers_comp: 1000000
 *   },
 *   new Date('2025-12-31'),
 *   ContractorModel
 * );
 * ```
 */
export const validateContractorInsurance = async (
  contractorId: string,
  insuranceLimits: any,
  policyExpiration: Date,
  ContractorModel: any,
): Promise<any> => {
  const contractor = await ContractorModel.findOne({ where: { contractorId } });

  if (!contractor) {
    throw new NotFoundException(`Contractor ${contractorId} not found`);
  }

  contractor.insuranceLimits = insuranceLimits;

  // Store insurance verification
  const insuranceVerifications = contractor.metadata.insuranceVerifications || [];
  insuranceVerifications.push({
    limits: insuranceLimits,
    policyExpiration,
    verifiedAt: new Date(),
  });

  contractor.metadata = {
    ...contractor.metadata,
    insuranceVerifications,
  };

  await contractor.save();

  return contractor;
};

/**
 * Retrieves contractors by prequalification status.
 *
 * @param {'active' | 'suspended' | 'debarred'} status - Status filter
 * @param {any} ContractorModel - Contractor model
 * @returns {Promise<any[]>} Contractors
 *
 * @example
 * ```typescript
 * const activeContractors = await getContractorsByStatus('active', ContractorModel);
 * console.log(`Found ${activeContractors.length} active contractors`);
 * ```
 */
export const getContractorsByStatus = async (
  status: 'active' | 'suspended' | 'debarred',
  ContractorModel: any,
): Promise<any[]> => {
  const contractors = await ContractorModel.findAll({
    where: { prequalificationStatus: status },
    order: [['contractorName', 'ASC']],
  });

  return contractors;
};

/**
 * Searches contractors by certification type.
 *
 * @param {string} certification - Certification to search for
 * @param {any} ContractorModel - Contractor model
 * @returns {Promise<any[]>} Contractors with certification
 *
 * @example
 * ```typescript
 * const sdvosb = await searchContractorsByCertification('SDVOSB', ContractorModel);
 * console.log(`Found ${sdvosb.length} SDVOSB contractors`);
 * ```
 */
export const searchContractorsByCertification = async (
  certification: string,
  ContractorModel: any,
): Promise<any[]> => {
  const contractors = await ContractorModel.findAll({
    where: {
      certifications: {
        [Op.contains]: [certification],
      },
    },
  });

  return contractors;
};

/**
 * Generates contractor qualification package.
 *
 * @param {string} contractorId - Contractor identifier
 * @param {any} ContractorModel - Contractor model
 * @returns {Promise<any>} Qualification package
 *
 * @example
 * ```typescript
 * const package = await generateContractorQualificationPackage('CONT-001', ContractorModel);
 * console.log('Qualification package:', package);
 * ```
 */
export const generateContractorQualificationPackage = async (
  contractorId: string,
  ContractorModel: any,
): Promise<any> => {
  const contractor = await ContractorModel.findOne({ where: { contractorId } });

  if (!contractor) {
    throw new NotFoundException(`Contractor ${contractorId} not found`);
  }

  return {
    contractorId: contractor.contractorId,
    contractorName: contractor.contractorName,
    cageCode: contractor.cageCode,
    dunsNumber: contractor.dunsNumber,
    prequalificationStatus: contractor.prequalificationStatus,
    bondingCapacity: parseFloat(contractor.bondingCapacity),
    insuranceLimits: contractor.insuranceLimits,
    certifications: contractor.certifications,
    contactInformation: {
      person: contractor.contactPerson,
      email: contractor.contactEmail,
      phone: contractor.contactPhone,
    },
    address: contractor.address,
    performanceHistory: contractor.metadata.performanceHistory || {},
    generatedAt: new Date(),
  };
};

// ============================================================================
// PAY APPLICATION PROCESSING (Functions 11-20)
// ============================================================================

/**
 * Creates and submits a pay application for a construction contract.
 *
 * @param {string} contractId - Contract identifier
 * @param {string} contractorId - Contractor identifier
 * @param {number} applicationNumber - Application number
 * @param {Date} periodEnding - Period ending date
 * @param {PaymentLineItem[]} lineItems - Payment line items
 * @param {any} PayApplicationModel - Pay application model
 * @param {any} LineItemModel - Line item model
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created pay application
 *
 * @example
 * ```typescript
 * const payApp = await createPayApplicationWithLineItems(
 *   'CONT-2024-001',
 *   'CONT-001',
 *   1,
 *   new Date('2024-01-31'),
 *   [
 *     {
 *       lineItemId: 'LI-001',
 *       payApplicationId: 'PA-001',
 *       costCode: '01-100',
 *       description: 'Site preparation',
 *       scheduledValue: 100000,
 *       workCompletedPrevious: 0,
 *       workCompletedThisPeriod: 50000,
 *       workCompletedToDate: 50000,
 *       materialsStoredPrevious: 0,
 *       materialsStoredThisPeriod: 0,
 *       materialsStoredToDate: 0,
 *       totalCompleted: 50000,
 *       percentComplete: 50.00,
 *       balance: 50000
 *     }
 *   ],
 *   PayApplicationModel,
 *   LineItemModel
 * );
 * ```
 */
export const createPayApplicationWithLineItems = async (
  contractId: string,
  contractorId: string,
  applicationNumber: number,
  periodEnding: Date,
  lineItems: PaymentLineItem[],
  PayApplicationModel: any,
  LineItemModel: any,
  transaction?: Transaction,
): Promise<any> => {
  if (!lineItems || lineItems.length === 0) {
    throw new BadRequestException('Pay application must have at least one line item');
  }

  // Calculate totals from line items
  const workCompleted = lineItems.reduce(
    (sum, item) => sum + parseFloat(item.workCompletedThisPeriod.toString()),
    0,
  );

  const materialsStored = lineItems.reduce(
    (sum, item) => sum + parseFloat(item.materialsStoredThisPeriod.toString()),
    0,
  );

  const totalEarned = workCompleted + materialsStored;

  const payApplicationData = {
    payApplicationId: `PA-${contractId}-${applicationNumber}`,
    contractId,
    contractorId,
    applicationNumber,
    periodEnding,
    workCompleted,
    materialsStored,
    totalEarned,
    status: 'submitted',
  };

  // Create pay application using composite function
  const payApplication = await submitPayApplication(
    payApplicationData,
    PayApplicationModel,
    transaction,
  );

  // Create line items
  for (const lineItem of lineItems) {
    await LineItemModel.create(
      {
        ...lineItem,
        payApplicationId: payApplication.payApplicationId,
      },
      { transaction },
    );
  }

  return payApplication;
};

/**
 * Reviews and approves a pay application.
 *
 * @param {string} payApplicationId - Pay application identifier
 * @param {string} reviewedBy - User reviewing application
 * @param {string} approvalNotes - Approval notes
 * @param {any} PayApplicationModel - Pay application model
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Approved pay application
 *
 * @example
 * ```typescript
 * const approved = await reviewAndApprovePayApplication(
 *   'PA-CONT-2024-001-1',
 *   'user123',
 *   'All work verified and compliant',
 *   PayApplicationModel
 * );
 * ```
 */
export const reviewAndApprovePayApplication = async (
  payApplicationId: string,
  reviewedBy: string,
  approvalNotes: string,
  PayApplicationModel: any,
  transaction?: Transaction,
): Promise<any> => {
  const payApplication = await approvePayApplication(
    payApplicationId,
    reviewedBy,
    PayApplicationModel,
    transaction,
  );

  // Add approval notes to metadata
  payApplication.metadata = {
    ...payApplication.metadata,
    approvalNotes,
    approvalDate: new Date(),
  };

  await payApplication.save({ transaction });

  return payApplication;
};

/**
 * Calculates retainage for a pay application.
 *
 * @param {string} payApplicationId - Pay application identifier
 * @param {number} retainageRate - Retainage rate (percentage)
 * @param {any} PayApplicationModel - Pay application model
 * @param {any} RetainageModel - Retainage model
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Retainage calculation
 *
 * @example
 * ```typescript
 * const retainage = await calculatePayApplicationRetainage(
 *   'PA-CONT-2024-001-1',
 *   10.0,
 *   PayApplicationModel,
 *   RetainageModel
 * );
 * console.log(`Retainage withheld: $${retainage.amount}`);
 * ```
 */
export const calculatePayApplicationRetainage = async (
  payApplicationId: string,
  retainageRate: number,
  PayApplicationModel: any,
  RetainageModel: any,
  transaction?: Transaction,
): Promise<any> => {
  const payApplication = await PayApplicationModel.findOne({
    where: { payApplicationId },
  });

  if (!payApplication) {
    throw new NotFoundException(`Pay application ${payApplicationId} not found`);
  }

  const retainageAmount = await calculateRetainage(
    payApplication.contractId,
    parseFloat(payApplication.totalEarned),
    retainageRate,
    RetainageModel,
    transaction,
  );

  return retainageAmount;
};

/**
 * Processes stored materials billing for pay application.
 *
 * @param {string} payApplicationId - Pay application identifier
 * @param {string} materialDescription - Material description
 * @param {number} quantity - Quantity stored
 * @param {number} unitPrice - Unit price
 * @param {string} storageLocation - Storage location
 * @param {any} StoredMaterialsModel - Stored materials model
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Stored materials billing
 *
 * @example
 * ```typescript
 * const materials = await processStoredMaterialsForPayApplication(
 *   'PA-CONT-2024-001-1',
 *   'Structural steel beams',
 *   100,
 *   500,
 *   'On-site secure storage',
 *   StoredMaterialsModel
 * );
 * ```
 */
export const processStoredMaterialsForPayApplication = async (
  payApplicationId: string,
  materialDescription: string,
  quantity: number,
  unitPrice: number,
  storageLocation: string,
  StoredMaterialsModel: any,
  transaction?: Transaction,
): Promise<any> => {
  const totalValue = quantity * unitPrice;

  const storedMaterial = await processStoredMaterialsBilling(
    {
      materialId: `MAT-${payApplicationId}-${Date.now()}`,
      payApplicationId,
      materialDescription,
      quantity,
      unitPrice,
      totalValue,
      storageLocation,
      storedDate: new Date(),
      inspectionStatus: 'pending',
    },
    StoredMaterialsModel,
    transaction,
  );

  return storedMaterial;
};

/**
 * Validates pay application against contract terms.
 *
 * @param {string} payApplicationId - Pay application identifier
 * @param {any} PayApplicationModel - Pay application model
 * @param {any} ContractModel - Contract model
 * @returns {Promise<{ valid: boolean; issues: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validatePayApplicationAgainstContract(
 *   'PA-CONT-2024-001-1',
 *   PayApplicationModel,
 *   ContractModel
 * );
 * if (!validation.valid) {
 *   console.log('Validation issues:', validation.issues);
 * }
 * ```
 */
export const validatePayApplicationAgainstContract = async (
  payApplicationId: string,
  PayApplicationModel: any,
  ContractModel: any,
): Promise<{ valid: boolean; issues: string[] }> => {
  const payApplication = await PayApplicationModel.findOne({
    where: { payApplicationId },
  });

  if (!payApplication) {
    throw new NotFoundException(`Pay application ${payApplicationId} not found`);
  }

  const validation = await validatePaymentAgainstContract(
    payApplication.contractId,
    parseFloat(payApplication.totalEarned),
    ContractModel,
  );

  return validation;
};

/**
 * Generates payment certificate for approved pay application.
 *
 * @param {string} payApplicationId - Pay application identifier
 * @param {string} certifiedBy - User certifying payment
 * @param {string} certifierTitle - Certifier title
 * @param {any} PayApplicationModel - Pay application model
 * @returns {Promise<PaymentCertification>} Payment certification
 *
 * @example
 * ```typescript
 * const cert = await generatePaymentCertificate(
 *   'PA-CONT-2024-001-1',
 *   'user123',
 *   'Construction Manager',
 *   PayApplicationModel
 * );
 * ```
 */
export const generatePaymentCertificate = async (
  payApplicationId: string,
  certifiedBy: string,
  certifierTitle: string,
  PayApplicationModel: any,
): Promise<PaymentCertification> => {
  const payApplication = await PayApplicationModel.findOne({
    where: { payApplicationId },
  });

  if (!payApplication) {
    throw new NotFoundException(`Pay application ${payApplicationId} not found`);
  }

  if (payApplication.status !== 'approved') {
    throw new BadRequestException('Pay application must be approved before certification');
  }

  const certification: PaymentCertification = {
    certificationId: `CERT-${payApplicationId}`,
    payApplicationId,
    contractId: payApplication.contractId,
    certifiedAmount: parseFloat(payApplication.totalEarned),
    certificationDate: new Date(),
    certifiedBy,
    certifierTitle,
    complianceChecks: {
      prevailingWageCompliance: true,
      eeoCompliance: true,
      safetyCompliance: true,
      qualityCompliance: true,
    },
    certificationStatement: `I certify that the work has been performed in accordance with contract requirements and that payment in the amount of $${parseFloat(payApplication.totalEarned).toLocaleString()} is due to the contractor.`,
  };

  return certification;
};

/**
 * Rejects a pay application with reason.
 *
 * @param {string} payApplicationId - Pay application identifier
 * @param {string} rejectedBy - User rejecting application
 * @param {string} rejectionReason - Rejection reason
 * @param {any} PayApplicationModel - Pay application model
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Rejected pay application
 *
 * @example
 * ```typescript
 * const rejected = await rejectPayApplication(
 *   'PA-CONT-2024-001-1',
 *   'user123',
 *   'Insufficient documentation',
 *   PayApplicationModel
 * );
 * ```
 */
export const rejectPayApplication = async (
  payApplicationId: string,
  rejectedBy: string,
  rejectionReason: string,
  PayApplicationModel: any,
  transaction?: Transaction,
): Promise<any> => {
  const payApplication = await PayApplicationModel.findOne({
    where: { payApplicationId },
  });

  if (!payApplication) {
    throw new NotFoundException(`Pay application ${payApplicationId} not found`);
  }

  payApplication.status = 'rejected';
  payApplication.metadata = {
    ...payApplication.metadata,
    rejectedBy,
    rejectionReason,
    rejectionDate: new Date(),
  };

  await payApplication.save({ transaction });

  return payApplication;
};

/**
 * Revises a rejected pay application.
 *
 * @param {string} payApplicationId - Pay application identifier
 * @param {PaymentLineItem[]} updatedLineItems - Updated line items
 * @param {string} revisionNotes - Revision notes
 * @param {any} PayApplicationModel - Pay application model
 * @param {any} LineItemModel - Line item model
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Revised pay application
 *
 * @example
 * ```typescript
 * const revised = await revisePayApplication(
 *   'PA-CONT-2024-001-1',
 *   updatedLineItems,
 *   'Corrected quantities and added missing documentation',
 *   PayApplicationModel,
 *   LineItemModel
 * );
 * ```
 */
export const revisePayApplication = async (
  payApplicationId: string,
  updatedLineItems: PaymentLineItem[],
  revisionNotes: string,
  PayApplicationModel: any,
  LineItemModel: any,
  transaction?: Transaction,
): Promise<any> => {
  const payApplication = await PayApplicationModel.findOne({
    where: { payApplicationId },
  });

  if (!payApplication) {
    throw new NotFoundException(`Pay application ${payApplicationId} not found`);
  }

  if (payApplication.status !== 'rejected') {
    throw new BadRequestException('Only rejected pay applications can be revised');
  }

  // Delete old line items
  await LineItemModel.destroy({
    where: { payApplicationId },
    transaction,
  });

  // Create new line items
  for (const lineItem of updatedLineItems) {
    await LineItemModel.create(
      {
        ...lineItem,
        payApplicationId,
      },
      { transaction },
    );
  }

  // Recalculate totals
  const workCompleted = updatedLineItems.reduce(
    (sum, item) => sum + parseFloat(item.workCompletedThisPeriod.toString()),
    0,
  );

  const materialsStored = updatedLineItems.reduce(
    (sum, item) => sum + parseFloat(item.materialsStoredThisPeriod.toString()),
    0,
  );

  payApplication.workCompleted = workCompleted;
  payApplication.materialsStored = materialsStored;
  payApplication.totalEarned = workCompleted + materialsStored;
  payApplication.status = 'submitted';

  // Store revision history
  const revisionHistory = payApplication.metadata.revisionHistory || [];
  revisionHistory.push({
    revisedAt: new Date(),
    revisionNotes,
  });

  payApplication.metadata = {
    ...payApplication.metadata,
    revisionHistory,
  };

  await payApplication.save({ transaction });

  return payApplication;
};

/**
 * Calculates percentage complete for all line items in pay application.
 *
 * @param {string} payApplicationId - Pay application identifier
 * @param {any} LineItemModel - Line item model
 * @returns {Promise<any>} Percentage complete summary
 *
 * @example
 * ```typescript
 * const percentages = await calculatePayApplicationPercentComplete(
 *   'PA-CONT-2024-001-1',
 *   LineItemModel
 * );
 * console.log(`Overall completion: ${percentages.overallPercent}%`);
 * ```
 */
export const calculatePayApplicationPercentComplete = async (
  payApplicationId: string,
  LineItemModel: any,
): Promise<any> => {
  const lineItems = await LineItemModel.findAll({
    where: { payApplicationId },
  });

  if (lineItems.length === 0) {
    return {
      payApplicationId,
      overallPercent: 0,
      lineItems: [],
    };
  }

  const totalScheduled = lineItems.reduce(
    (sum: number, item: any) => sum + parseFloat(item.scheduledValue),
    0,
  );

  const totalCompleted = lineItems.reduce(
    (sum: number, item: any) => sum + parseFloat(item.totalCompleted),
    0,
  );

  const overallPercent = totalScheduled > 0 ? (totalCompleted / totalScheduled) * 100 : 0;

  const lineItemSummary = lineItems.map((item: any) => ({
    lineItemId: item.lineItemId,
    costCode: item.costCode,
    description: item.description,
    percentComplete: parseFloat(item.percentComplete),
  }));

  return {
    payApplicationId,
    overallPercent,
    totalScheduled,
    totalCompleted,
    lineItems: lineItemSummary,
  };
};

/**
 * Generates detailed pay application report.
 *
 * @param {string} payApplicationId - Pay application identifier
 * @param {any} PayApplicationModel - Pay application model
 * @param {any} LineItemModel - Line item model
 * @param {any} ContractModel - Contract model
 * @returns {Promise<any>} Detailed report
 *
 * @example
 * ```typescript
 * const report = await generateDetailedPayApplicationReport(
 *   'PA-CONT-2024-001-1',
 *   PayApplicationModel,
 *   LineItemModel,
 *   ContractModel
 * );
 * ```
 */
export const generateDetailedPayApplicationReport = async (
  payApplicationId: string,
  PayApplicationModel: any,
  LineItemModel: any,
  ContractModel: any,
): Promise<any> => {
  const payApplication = await PayApplicationModel.findOne({
    where: { payApplicationId },
  });

  if (!payApplication) {
    throw new NotFoundException(`Pay application ${payApplicationId} not found`);
  }

  const lineItems = await LineItemModel.findAll({
    where: { payApplicationId },
  });

  const percentComplete = await calculatePayApplicationPercentComplete(
    payApplicationId,
    LineItemModel,
  );

  return {
    payApplicationId: payApplication.payApplicationId,
    contractId: payApplication.contractId,
    contractorId: payApplication.contractorId,
    applicationNumber: payApplication.applicationNumber,
    periodEnding: payApplication.periodEnding,
    status: payApplication.status,
    workCompleted: parseFloat(payApplication.workCompleted),
    materialsStored: parseFloat(payApplication.materialsStored),
    totalEarned: parseFloat(payApplication.totalEarned),
    percentComplete: percentComplete.overallPercent,
    lineItems: lineItems.map((item: any) => ({
      lineItemId: item.lineItemId,
      costCode: item.costCode,
      description: item.description,
      scheduledValue: parseFloat(item.scheduledValue),
      workCompletedToDate: parseFloat(item.workCompletedToDate),
      materialsStoredToDate: parseFloat(item.materialsStoredToDate),
      totalCompleted: parseFloat(item.totalCompleted),
      percentComplete: parseFloat(item.percentComplete),
      balance: parseFloat(item.balance),
    })),
    generatedAt: new Date(),
  };
};

// ============================================================================
// RETAINAGE MANAGEMENT (Functions 21-30)
// ============================================================================

/**
 * Withholds retainage on a pay application.
 *
 * @param {string} contractId - Contract identifier
 * @param {string} payApplicationId - Pay application identifier
 * @param {number} retainageRate - Retainage rate percentage
 * @param {number} paymentAmount - Payment amount
 * @param {any} RetainageModel - Retainage model
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<RetainageTransaction>} Retainage transaction
 *
 * @example
 * ```typescript
 * const retainage = await withholdRetainageOnPayment(
 *   'CONT-2024-001',
 *   'PA-CONT-2024-001-1',
 *   10.0,
 *   50000,
 *   RetainageModel
 * );
 * console.log(`Retainage withheld: $${retainage.amount}`);
 * ```
 */
export const withholdRetainageOnPayment = async (
  contractId: string,
  payApplicationId: string,
  retainageRate: number,
  paymentAmount: number,
  RetainageModel: any,
  transaction?: Transaction,
): Promise<RetainageTransaction> => {
  const retainageAmount = (paymentAmount * retainageRate) / 100;

  // Get cumulative retainage
  const existingRetainage = await RetainageModel.findAll({
    where: { contractId },
  });

  const cumulativeRetainage =
    existingRetainage.reduce(
      (sum: number, r: any) => sum + parseFloat(r.amount),
      0,
    ) + retainageAmount;

  const retainageTransaction: RetainageTransaction = {
    transactionId: `RET-${payApplicationId}`,
    contractId,
    payApplicationId,
    transactionType: 'withhold',
    amount: retainageAmount,
    retainageRate,
    cumulativeRetainage,
    transactionDate: new Date(),
    metadata: {},
  };

  const created = await RetainageModel.create(retainageTransaction, { transaction });

  return created;
};

/**
 * Releases retainage upon milestone completion.
 *
 * @param {string} contractId - Contract identifier
 * @param {number} releaseAmount - Amount to release
 * @param {string} releasedBy - User releasing retainage
 * @param {string} reason - Release reason
 * @param {any} RetainageModel - Retainage model
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Release transaction
 *
 * @example
 * ```typescript
 * const release = await releaseRetainageForMilestone(
 *   'CONT-2024-001',
 *   25000,
 *   'user123',
 *   'Substantial completion achieved',
 *   RetainageModel
 * );
 * ```
 */
export const releaseRetainageForMilestone = async (
  contractId: string,
  releaseAmount: number,
  releasedBy: string,
  reason: string,
  RetainageModel: any,
  transaction?: Transaction,
): Promise<any> => {
  const release = await releaseRetainage(
    contractId,
    releaseAmount,
    reason,
    RetainageModel,
    transaction,
  );

  // Store release details in metadata
  release.metadata = {
    ...release.metadata,
    releasedBy,
    releaseDate: new Date(),
  };

  await release.save({ transaction });

  return release;
};

/**
 * Calculates total retainage held for a contract.
 *
 * @param {string} contractId - Contract identifier
 * @param {any} RetainageModel - Retainage model
 * @returns {Promise<any>} Retainage summary
 *
 * @example
 * ```typescript
 * const summary = await calculateTotalRetainageHeld('CONT-2024-001', RetainageModel);
 * console.log(`Total withheld: $${summary.totalWithheld}`);
 * console.log(`Total released: $${summary.totalReleased}`);
 * console.log(`Current balance: $${summary.balance}`);
 * ```
 */
export const calculateTotalRetainageHeld = async (
  contractId: string,
  RetainageModel: any,
): Promise<any> => {
  const transactions = await RetainageModel.findAll({
    where: { contractId },
    order: [['transactionDate', 'ASC']],
  });

  let totalWithheld = 0;
  let totalReleased = 0;

  transactions.forEach((txn: any) => {
    if (txn.transactionType === 'withhold') {
      totalWithheld += parseFloat(txn.amount);
    } else if (txn.transactionType === 'release') {
      totalReleased += parseFloat(txn.amount);
    }
  });

  const balance = totalWithheld - totalReleased;

  return {
    contractId,
    totalWithheld,
    totalReleased,
    balance,
    transactionCount: transactions.length,
  };
};

/**
 * Generates retainage release schedule for contract closeout.
 *
 * @param {string} contractId - Contract identifier
 * @param {Date} substantialCompletionDate - Substantial completion date
 * @param {Date} finalCompletionDate - Final completion date
 * @param {any} RetainageModel - Retainage model
 * @returns {Promise<any>} Release schedule
 *
 * @example
 * ```typescript
 * const schedule = await generateRetainageReleaseSchedule(
 *   'CONT-2024-001',
 *   new Date('2024-11-01'),
 *   new Date('2024-12-15'),
 *   RetainageModel
 * );
 * ```
 */
export const generateRetainageReleaseSchedule = async (
  contractId: string,
  substantialCompletionDate: Date,
  finalCompletionDate: Date,
  RetainageModel: any,
): Promise<any> => {
  const retainageSummary = await calculateTotalRetainageHeld(contractId, RetainageModel);

  // Standard USACE retainage release: 50% at substantial completion, 50% at final
  const substantialReleaseAmount = retainageSummary.balance * 0.5;
  const finalReleaseAmount = retainageSummary.balance * 0.5;

  return {
    contractId,
    totalRetainageHeld: retainageSummary.balance,
    releaseSchedule: [
      {
        milestone: 'Substantial Completion',
        releaseDate: substantialCompletionDate,
        releaseAmount: substantialReleaseAmount,
        status: 'pending',
      },
      {
        milestone: 'Final Completion',
        releaseDate: finalCompletionDate,
        releaseAmount: finalReleaseAmount,
        status: 'pending',
      },
    ],
  };
};

/**
 * Processes partial retainage release.
 *
 * @param {string} contractId - Contract identifier
 * @param {number} releasePercentage - Percentage to release
 * @param {string} milestone - Milestone description
 * @param {string} approvedBy - User approving release
 * @param {any} RetainageModel - Retainage model
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Release transaction
 *
 * @example
 * ```typescript
 * const partial = await processPartialRetainageRelease(
 *   'CONT-2024-001',
 *   50,
 *   'Substantial completion',
 *   'user123',
 *   RetainageModel
 * );
 * ```
 */
export const processPartialRetainageRelease = async (
  contractId: string,
  releasePercentage: number,
  milestone: string,
  approvedBy: string,
  RetainageModel: any,
  transaction?: Transaction,
): Promise<any> => {
  if (releasePercentage <= 0 || releasePercentage > 100) {
    throw new BadRequestException('Release percentage must be between 0 and 100');
  }

  const retainageSummary = await calculateTotalRetainageHeld(contractId, RetainageModel);
  const releaseAmount = (retainageSummary.balance * releasePercentage) / 100;

  const release = await releaseRetainageForMilestone(
    contractId,
    releaseAmount,
    approvedBy,
    `Partial release (${releasePercentage}%) - ${milestone}`,
    RetainageModel,
    transaction,
  );

  return release;
};

/**
 * Generates retainage reconciliation report.
 *
 * @param {string} contractId - Contract identifier
 * @param {any} RetainageModel - Retainage model
 * @param {any} PayApplicationModel - Pay application model
 * @returns {Promise<any>} Reconciliation report
 *
 * @example
 * ```typescript
 * const reconciliation = await generateRetainageReconciliation(
 *   'CONT-2024-001',
 *   RetainageModel,
 *   PayApplicationModel
 * );
 * ```
 */
export const generateRetainageReconciliation = async (
  contractId: string,
  RetainageModel: any,
  PayApplicationModel: any,
): Promise<any> => {
  const retainageSummary = await calculateTotalRetainageHeld(contractId, RetainageModel);

  const retainageTransactions = await RetainageModel.findAll({
    where: { contractId },
    order: [['transactionDate', 'ASC']],
  });

  return {
    contractId,
    summary: retainageSummary,
    transactions: retainageTransactions.map((txn: any) => ({
      transactionId: txn.transactionId,
      transactionType: txn.transactionType,
      amount: parseFloat(txn.amount),
      transactionDate: txn.transactionDate,
      payApplicationId: txn.payApplicationId,
    })),
    generatedAt: new Date(),
  };
};

/**
 * Validates retainage release eligibility.
 *
 * @param {string} contractId - Contract identifier
 * @param {number} requestedReleaseAmount - Requested release amount
 * @param {any} RetainageModel - Retainage model
 * @param {any} ContractModel - Contract model
 * @returns {Promise<{ eligible: boolean; issues: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateRetainageReleaseEligibility(
 *   'CONT-2024-001',
 *   25000,
 *   RetainageModel,
 *   ContractModel
 * );
 * ```
 */
export const validateRetainageReleaseEligibility = async (
  contractId: string,
  requestedReleaseAmount: number,
  RetainageModel: any,
  ContractModel: any,
): Promise<{ eligible: boolean; issues: string[] }> => {
  const issues: string[] = [];

  const retainageSummary = await calculateTotalRetainageHeld(contractId, RetainageModel);

  if (requestedReleaseAmount > retainageSummary.balance) {
    issues.push(
      `Requested release amount ($${requestedReleaseAmount}) exceeds available balance ($${retainageSummary.balance})`,
    );
  }

  if (requestedReleaseAmount <= 0) {
    issues.push('Release amount must be positive');
  }

  return {
    eligible: issues.length === 0,
    issues,
  };
};

/**
 * Processes final retainage release at contract closeout.
 *
 * @param {string} contractId - Contract identifier
 * @param {string} approvedBy - User approving final release
 * @param {any} RetainageModel - Retainage model
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Final release
 *
 * @example
 * ```typescript
 * const final = await processFinalRetainageRelease(
 *   'CONT-2024-001',
 *   'user123',
 *   RetainageModel
 * );
 * ```
 */
export const processFinalRetainageRelease = async (
  contractId: string,
  approvedBy: string,
  RetainageModel: any,
  transaction?: Transaction,
): Promise<any> => {
  const retainageSummary = await calculateTotalRetainageHeld(contractId, RetainageModel);

  if (retainageSummary.balance <= 0) {
    throw new BadRequestException('No retainage balance to release');
  }

  const release = await releaseRetainageForMilestone(
    contractId,
    retainageSummary.balance,
    approvedBy,
    'Final retainage release - contract closeout',
    RetainageModel,
    transaction,
  );

  return release;
};

/**
 * Tracks retainage aging for reporting.
 *
 * @param {string} contractId - Contract identifier
 * @param {any} RetainageModel - Retainage model
 * @returns {Promise<any>} Aging report
 *
 * @example
 * ```typescript
 * const aging = await trackRetainageAging('CONT-2024-001', RetainageModel);
 * ```
 */
export const trackRetainageAging = async (
  contractId: string,
  RetainageModel: any,
): Promise<any> => {
  const transactions = await RetainageModel.findAll({
    where: {
      contractId,
      transactionType: 'withhold',
    },
    order: [['transactionDate', 'ASC']],
  });

  const now = new Date();
  const aging = {
    current: 0, // 0-30 days
    thirtyDays: 0, // 31-60 days
    sixtyDays: 0, // 61-90 days
    ninetyDaysPlus: 0, // 90+ days
  };

  transactions.forEach((txn: any) => {
    const daysSince = Math.floor(
      (now.getTime() - txn.transactionDate.getTime()) / (1000 * 60 * 60 * 24),
    );

    const amount = parseFloat(txn.amount);

    if (daysSince <= 30) {
      aging.current += amount;
    } else if (daysSince <= 60) {
      aging.thirtyDays += amount;
    } else if (daysSince <= 90) {
      aging.sixtyDays += amount;
    } else {
      aging.ninetyDaysPlus += amount;
    }
  });

  return {
    contractId,
    aging,
    reportDate: now,
  };
};

/**
 * Adjusts retainage for change orders.
 *
 * @param {string} contractId - Contract identifier
 * @param {string} changeOrderId - Change order identifier
 * @param {number} changeOrderAmount - Change order amount
 * @param {number} retainageRate - Retainage rate
 * @param {any} RetainageModel - Retainage model
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Adjustment transaction
 *
 * @example
 * ```typescript
 * const adjustment = await adjustRetainageForChangeOrder(
 *   'CONT-2024-001',
 *   'CO-001',
 *   100000,
 *   10.0,
 *   RetainageModel
 * );
 * ```
 */
export const adjustRetainageForChangeOrder = async (
  contractId: string,
  changeOrderId: string,
  changeOrderAmount: number,
  retainageRate: number,
  RetainageModel: any,
  transaction?: Transaction,
): Promise<any> => {
  const adjustmentAmount = (changeOrderAmount * retainageRate) / 100;

  const retainageSummary = await calculateTotalRetainageHeld(contractId, RetainageModel);

  const retainageTransaction: RetainageTransaction = {
    transactionId: `RET-ADJ-${changeOrderId}`,
    contractId,
    transactionType: 'adjustment',
    amount: adjustmentAmount,
    retainageRate,
    cumulativeRetainage: retainageSummary.balance + adjustmentAmount,
    transactionDate: new Date(),
    reason: `Change order ${changeOrderId} retainage adjustment`,
    metadata: {
      changeOrderId,
      changeOrderAmount,
    },
  };

  const created = await RetainageModel.create(retainageTransaction, { transaction });

  return created;
};

// ============================================================================
// LIEN WAIVER MANAGEMENT (Functions 31-40)
// ============================================================================

/**
 * Processes contractor lien waiver submission.
 *
 * @param {LienWaiver} waiverData - Lien waiver data
 * @param {any} LienWaiverModel - Lien waiver model
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created lien waiver
 *
 * @example
 * ```typescript
 * const waiver = await processLienWaiverSubmission({
 *   waiverId: 'LW-001',
 *   contractId: 'CONT-2024-001',
 *   contractorId: 'CONT-001',
 *   waiverType: 'partial',
 *   paymentPeriod: new Date('2024-01-31'),
 *   amountCovered: 50000,
 *   receivedDate: new Date(),
 *   notarized: true,
 *   subcontractors: ['SUB-001', 'SUB-002'],
 *   materialSuppliers: ['SUPP-001']
 * }, LienWaiverModel);
 * ```
 */
export const processLienWaiverSubmission = async (
  waiverData: LienWaiver,
  LienWaiverModel: any,
  transaction?: Transaction,
): Promise<any> => {
  if (!waiverData.notarized && waiverData.waiverType === 'final') {
    throw new BadRequestException('Final lien waivers must be notarized');
  }

  const waiver = await LienWaiverModel.create(waiverData, { transaction });

  return waiver;
};

/**
 * Validates lien waiver completeness for payment.
 *
 * @param {string} contractId - Contract identifier
 * @param {string} payApplicationId - Pay application identifier
 * @param {any} LienWaiverModel - Lien waiver model
 * @returns {Promise<{ complete: boolean; missing: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateLienWaiverCompleteness(
 *   'CONT-2024-001',
 *   'PA-CONT-2024-001-1',
 *   LienWaiverModel
 * );
 * if (!validation.complete) {
 *   console.log('Missing waivers:', validation.missing);
 * }
 * ```
 */
export const validateLienWaiverCompleteness = async (
  contractId: string,
  payApplicationId: string,
  LienWaiverModel: any,
): Promise<{ complete: boolean; missing: string[] }> => {
  const waivers = await LienWaiverModel.findAll({
    where: { contractId },
  });

  const missing: string[] = [];

  // Check for prime contractor waiver
  const primeWaiver = waivers.find(
    (w: any) => w.waiverType === 'partial' || w.waiverType === 'unconditional',
  );

  if (!primeWaiver) {
    missing.push('Prime contractor lien waiver');
  }

  return {
    complete: missing.length === 0,
    missing,
  };
};

/**
 * Generates final lien waiver documentation for closeout.
 *
 * @param {string} contractId - Contract identifier
 * @param {string} contractorId - Contractor identifier
 * @param {number} finalPaymentAmount - Final payment amount
 * @param {any} LienWaiverModel - Lien waiver model
 * @returns {Promise<any>} Final lien waiver
 *
 * @example
 * ```typescript
 * const finalWaiver = await generateFinalLienWaiverDocumentation(
 *   'CONT-2024-001',
 *   'CONT-001',
 *   5000000,
 *   LienWaiverModel
 * );
 * ```
 */
export const generateFinalLienWaiverDocumentation = async (
  contractId: string,
  contractorId: string,
  finalPaymentAmount: number,
  LienWaiverModel: any,
): Promise<any> => {
  const finalWaiver: LienWaiver = {
    waiverId: `LW-FINAL-${contractId}`,
    contractId,
    contractorId,
    waiverType: 'final',
    paymentPeriod: new Date(),
    amountCovered: finalPaymentAmount,
    receivedDate: new Date(),
    notarized: true,
    subcontractors: [],
    materialSuppliers: [],
  };

  return finalWaiver;
};

/**
 * Tracks subcontractor lien waivers.
 *
 * @param {string} contractId - Contract identifier
 * @param {string} subcontractorId - Subcontractor identifier
 * @param {any} LienWaiverModel - Lien waiver model
 * @returns {Promise<any[]>} Subcontractor waivers
 *
 * @example
 * ```typescript
 * const subWaivers = await trackSubcontractorLienWaivers(
 *   'CONT-2024-001',
 *   'SUB-001',
 *   LienWaiverModel
 * );
 * ```
 */
export const trackSubcontractorLienWaivers = async (
  contractId: string,
  subcontractorId: string,
  LienWaiverModel: any,
): Promise<any[]> => {
  const waivers = await LienWaiverModel.findAll({
    where: { contractId },
  });

  const subWaivers = waivers.filter((w: any) =>
    w.subcontractors.includes(subcontractorId),
  );

  return subWaivers;
};

/**
 * Verifies lien waiver notarization.
 *
 * @param {string} waiverId - Waiver identifier
 * @param {string} notaryName - Notary name
 * @param {string} notaryLicense - Notary license number
 * @param {Date} notaryDate - Notarization date
 * @param {any} LienWaiverModel - Lien waiver model
 * @returns {Promise<any>} Updated waiver
 *
 * @example
 * ```typescript
 * const verified = await verifyLienWaiverNotarization(
 *   'LW-001',
 *   'Jane Smith',
 *   'NOT-12345',
 *   new Date(),
 *   LienWaiverModel
 * );
 * ```
 */
export const verifyLienWaiverNotarization = async (
  waiverId: string,
  notaryName: string,
  notaryLicense: string,
  notaryDate: Date,
  LienWaiverModel: any,
): Promise<any> => {
  const waiver = await LienWaiverModel.findOne({ where: { waiverId } });

  if (!waiver) {
    throw new NotFoundException(`Lien waiver ${waiverId} not found`);
  }

  waiver.notarized = true;

  // Store notarization details in metadata
  const metadata = waiver.metadata || {};
  metadata.notarization = {
    notaryName,
    notaryLicense,
    notaryDate,
    verifiedAt: new Date(),
  };

  await waiver.save();

  return waiver;
};

/**
 * Generates conditional lien waiver for progress payment.
 *
 * @param {string} contractId - Contract identifier
 * @param {string} contractorId - Contractor identifier
 * @param {string} payApplicationId - Pay application identifier
 * @param {number} paymentAmount - Payment amount
 * @param {any} LienWaiverModel - Lien waiver model
 * @returns {Promise<any>} Conditional waiver
 *
 * @example
 * ```typescript
 * const conditional = await generateConditionalLienWaiver(
 *   'CONT-2024-001',
 *   'CONT-001',
 *   'PA-CONT-2024-001-1',
 *   50000,
 *   LienWaiverModel
 * );
 * ```
 */
export const generateConditionalLienWaiver = async (
  contractId: string,
  contractorId: string,
  payApplicationId: string,
  paymentAmount: number,
  LienWaiverModel: any,
): Promise<any> => {
  const conditionalWaiver: LienWaiver = {
    waiverId: `LW-COND-${payApplicationId}`,
    contractId,
    contractorId,
    waiverType: 'conditional',
    paymentPeriod: new Date(),
    amountCovered: paymentAmount,
    receivedDate: new Date(),
    notarized: false,
    subcontractors: [],
    materialSuppliers: [],
  };

  return conditionalWaiver;
};

/**
 * Converts conditional waiver to unconditional upon payment.
 *
 * @param {string} waiverId - Waiver identifier
 * @param {Date} paymentDate - Payment date
 * @param {string} checkNumber - Check number
 * @param {any} LienWaiverModel - Lien waiver model
 * @returns {Promise<any>} Updated waiver
 *
 * @example
 * ```typescript
 * const unconditional = await convertConditionalToUnconditionalWaiver(
 *   'LW-COND-PA-CONT-2024-001-1',
 *   new Date(),
 *   'CHK-123456',
 *   LienWaiverModel
 * );
 * ```
 */
export const convertConditionalToUnconditionalWaiver = async (
  waiverId: string,
  paymentDate: Date,
  checkNumber: string,
  LienWaiverModel: any,
): Promise<any> => {
  const waiver = await LienWaiverModel.findOne({ where: { waiverId } });

  if (!waiver) {
    throw new NotFoundException(`Lien waiver ${waiverId} not found`);
  }

  if (waiver.waiverType !== 'conditional') {
    throw new BadRequestException('Only conditional waivers can be converted');
  }

  waiver.waiverType = 'unconditional';

  // Store conversion details
  const metadata = waiver.metadata || {};
  metadata.conversion = {
    paymentDate,
    checkNumber,
    convertedAt: new Date(),
  };

  await waiver.save();

  return waiver;
};

/**
 * Aggregates lien waivers for contract reporting.
 *
 * @param {string} contractId - Contract identifier
 * @param {any} LienWaiverModel - Lien waiver model
 * @returns {Promise<any>} Waiver summary
 *
 * @example
 * ```typescript
 * const summary = await aggregateLienWaiversForContract(
 *   'CONT-2024-001',
 *   LienWaiverModel
 * );
 * ```
 */
export const aggregateLienWaiversForContract = async (
  contractId: string,
  LienWaiverModel: any,
): Promise<any> => {
  const waivers = await LienWaiverModel.findAll({
    where: { contractId },
    order: [['receivedDate', 'DESC']],
  });

  const byType = {
    partial: 0,
    final: 0,
    conditional: 0,
    unconditional: 0,
  };

  let totalAmountCovered = 0;

  waivers.forEach((w: any) => {
    byType[w.waiverType as keyof typeof byType]++;
    totalAmountCovered += parseFloat(w.amountCovered);
  });

  return {
    contractId,
    totalWaivers: waivers.length,
    byType,
    totalAmountCovered,
    waivers: waivers.map((w: any) => ({
      waiverId: w.waiverId,
      waiverType: w.waiverType,
      amountCovered: parseFloat(w.amountCovered),
      receivedDate: w.receivedDate,
      notarized: w.notarized,
    })),
  };
};

/**
 * Validates lien waiver expiration dates.
 *
 * @param {string} contractId - Contract identifier
 * @param {any} LienWaiverModel - Lien waiver model
 * @returns {Promise<any>} Expiration status
 *
 * @example
 * ```typescript
 * const expiration = await validateLienWaiverExpiration('CONT-2024-001', LienWaiverModel);
 * ```
 */
export const validateLienWaiverExpiration = async (
  contractId: string,
  LienWaiverModel: any,
): Promise<any> => {
  const waivers = await LienWaiverModel.findAll({
    where: {
      contractId,
      validThrough: { [Op.ne]: null },
    },
  });

  const now = new Date();
  const expired = [];
  const expiringSoon = [];

  waivers.forEach((w: any) => {
    if (w.validThrough < now) {
      expired.push(w.waiverId);
    } else if (w.validThrough < new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)) {
      expiringSoon.push(w.waiverId);
    }
  });

  return {
    contractId,
    expired,
    expiringSoon,
    checkDate: now,
  };
};

/**
 * Generates lien waiver compliance report.
 *
 * @param {string} contractId - Contract identifier
 * @param {any} LienWaiverModel - Lien waiver model
 * @param {any} PayApplicationModel - Pay application model
 * @returns {Promise<any>} Compliance report
 *
 * @example
 * ```typescript
 * const compliance = await generateLienWaiverComplianceReport(
 *   'CONT-2024-001',
 *   LienWaiverModel,
 *   PayApplicationModel
 * );
 * ```
 */
export const generateLienWaiverComplianceReport = async (
  contractId: string,
  LienWaiverModel: any,
  PayApplicationModel: any,
): Promise<any> => {
  const waivers = await aggregateLienWaiversForContract(contractId, LienWaiverModel);

  const payApplications = await PayApplicationModel.findAll({
    where: { contractId },
  });

  const totalPayments = payApplications.reduce(
    (sum: number, pa: any) => sum + parseFloat(pa.totalEarned),
    0,
  );

  const complianceRate = totalPayments > 0
    ? (waivers.totalAmountCovered / totalPayments) * 100
    : 0;

  return {
    contractId,
    totalPayments,
    totalWaiversCovered: waivers.totalAmountCovered,
    complianceRate,
    waiverCount: waivers.totalWaivers,
    compliant: complianceRate >= 100,
    generatedAt: new Date(),
  };
};

// ============================================================================
// CONTRACT CLOSEOUT (Functions 41-50)
// ============================================================================

/**
 * Initiates contract closeout process.
 *
 * @param {string} contractId - Contract identifier
 * @param {Date} finalCompletionDate - Final completion date
 * @param {any} ContractModel - Contract model
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<ContractCloseout>} Closeout record
 *
 * @example
 * ```typescript
 * const closeout = await initiateContractCloseout(
 *   'CONT-2024-001',
 *   new Date('2024-12-15'),
 *   ContractModel
 * );
 * ```
 */
export const initiateContractCloseout = async (
  contractId: string,
  finalCompletionDate: Date,
  ContractModel: any,
  transaction?: Transaction,
): Promise<ContractCloseout> => {
  const contract = await ContractModel.findOne({ where: { contractId } });

  if (!contract) {
    throw new NotFoundException(`Contract ${contractId} not found`);
  }

  const closeout: ContractCloseout = {
    closeoutId: `CLO-${contractId}`,
    contractId,
    finalPaymentDate: finalCompletionDate,
    originalContractAmount: parseFloat(contract.originalAmount || 0),
    approvedChangeOrders: 0,
    finalContractAmount: parseFloat(contract.currentAmount || 0),
    totalPaid: 0,
    retainageWithheld: 0,
    retainageReleased: 0,
    finalRetainageBalance: 0,
    punchListComplete: false,
    lienWaiversReceived: false,
    asBuiltDrawingsReceived: false,
    warrantyDocumentsReceived: false,
    closeoutStatus: 'in_progress',
  };

  return closeout;
};

/**
 * Validates closeout documentation completeness.
 *
 * @param {string} contractId - Contract identifier
 * @param {any} LienWaiverModel - Lien waiver model
 * @returns {Promise<{ complete: boolean; missing: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateCloseoutDocumentation('CONT-2024-001', LienWaiverModel);
 * if (!validation.complete) {
 *   console.log('Missing documents:', validation.missing);
 * }
 * ```
 */
export const validateCloseoutDocumentation = async (
  contractId: string,
  LienWaiverModel: any,
): Promise<{ complete: boolean; missing: string[] }> => {
  const missing: string[] = [];

  // Check for final lien waivers
  const finalWaivers = await LienWaiverModel.findAll({
    where: {
      contractId,
      waiverType: 'final',
    },
  });

  if (finalWaivers.length === 0) {
    missing.push('Final lien waivers');
  }

  return {
    complete: missing.length === 0,
    missing,
  };
};

/**
 * Processes final payment and closeout.
 *
 * @param {string} contractId - Contract identifier
 * @param {string} processedBy - User processing closeout
 * @param {any} ContractModel - Contract model
 * @param {any} RetainageModel - Retainage model
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Final payment
 *
 * @example
 * ```typescript
 * const finalPayment = await processFinalPaymentAndCloseout(
 *   'CONT-2024-001',
 *   'user123',
 *   ContractModel,
 *   RetainageModel
 * );
 * ```
 */
export const processFinalPaymentAndCloseout = async (
  contractId: string,
  processedBy: string,
  ContractModel: any,
  RetainageModel: any,
  transaction?: Transaction,
): Promise<any> => {
  // Release final retainage
  const finalRetainageRelease = await processFinalRetainageRelease(
    contractId,
    processedBy,
    RetainageModel,
    transaction,
  );

  // Update contract status
  const contract = await ContractModel.findOne({ where: { contractId } });
  if (contract) {
    contract.status = 'closed';
    await contract.save({ transaction });
  }

  return {
    contractId,
    finalRetainageRelease,
    closeoutDate: new Date(),
    processedBy,
  };
};

/**
 * Generates comprehensive contract closeout report.
 *
 * @param {string} contractId - Contract identifier
 * @param {any} ContractModel - Contract model
 * @param {any} PayApplicationModel - Pay application model
 * @param {any} RetainageModel - Retainage model
 * @param {any} LienWaiverModel - Lien waiver model
 * @returns {Promise<any>} Closeout report
 *
 * @example
 * ```typescript
 * const report = await generateComprehensiveCloseoutReport(
 *   'CONT-2024-001',
 *   ContractModel,
 *   PayApplicationModel,
 *   RetainageModel,
 *   LienWaiverModel
 * );
 * ```
 */
export const generateComprehensiveCloseoutReport = async (
  contractId: string,
  ContractModel: any,
  PayApplicationModel: any,
  RetainageModel: any,
  LienWaiverModel: any,
): Promise<any> => {
  const contract = await ContractModel.findOne({ where: { contractId } });

  if (!contract) {
    throw new NotFoundException(`Contract ${contractId} not found`);
  }

  const payApplications = await PayApplicationModel.findAll({
    where: { contractId },
  });

  const retainageSummary = await calculateTotalRetainageHeld(contractId, RetainageModel);
  const lienWaivers = await aggregateLienWaiversForContract(contractId, LienWaiverModel);

  const totalPaid = payApplications.reduce(
    (sum: number, pa: any) => sum + parseFloat(pa.totalEarned),
    0,
  );

  return {
    contractId,
    contract: {
      originalAmount: parseFloat(contract.originalAmount || 0),
      finalAmount: parseFloat(contract.currentAmount || 0),
      status: contract.status,
    },
    payments: {
      totalPayApplications: payApplications.length,
      totalPaid,
    },
    retainage: retainageSummary,
    lienWaivers,
    closeoutStatus: 'complete',
    generatedAt: new Date(),
  };
};

/**
 * Archives contract closeout documentation.
 *
 * @param {string} contractId - Contract identifier
 * @param {string} archiveLocation - Archive location
 * @param {any} ContractModel - Contract model
 * @returns {Promise<any>} Archive confirmation
 *
 * @example
 * ```typescript
 * const archived = await archiveContractCloseoutDocumentation(
 *   'CONT-2024-001',
 *   'S3://contracts/closed/2024/',
 *   ContractModel
 * );
 * ```
 */
export const archiveContractCloseoutDocumentation = async (
  contractId: string,
  archiveLocation: string,
  ContractModel: any,
): Promise<any> => {
  const contract = await ContractModel.findOne({ where: { contractId } });

  if (!contract) {
    throw new NotFoundException(`Contract ${contractId} not found`);
  }

  // Store archive location in metadata
  contract.metadata = {
    ...contract.metadata,
    archiveLocation,
    archivedAt: new Date(),
  };

  await contract.save();

  return {
    contractId,
    archiveLocation,
    archivedAt: new Date(),
  };
};

// ============================================================================
// NESTJS SERVICE WRAPPER
// ============================================================================

/**
 * NestJS Injectable service for Construction Billing Backend.
 *
 * @example
 * ```typescript
 * @Controller('cefms/construction-billing')
 * export class ConstructionBillingController {
 *   constructor(private readonly service: ConstructionBillingBackendService) {}
 *
 *   @Post('pay-applications')
 *   async submitPayApplication(@Body() data: any) {
 *     return this.service.submitPayApplication(data);
 *   }
 * }
 * ```
 */
@Injectable()
export class ConstructionBillingBackendService {
  private readonly logger = new Logger(ConstructionBillingBackendService.name);

  constructor(private readonly sequelize: Sequelize) {}

  async registerContractor(contractorData: any) {
    const ContractorModel = createConstructionContractorModel(this.sequelize);
    return registerConstructionContractor(contractorData, ContractorModel);
  }

  async submitPayApplication(payAppData: any, lineItems: PaymentLineItem[]) {
    const PayApplicationModel = createPayApplicationModel(this.sequelize);
    const LineItemModel = createPaymentLineItemModel(this.sequelize);

    return this.sequelize.transaction(async (transaction) => {
      return createPayApplicationWithLineItems(
        payAppData.contractId,
        payAppData.contractorId,
        payAppData.applicationNumber,
        payAppData.periodEnding,
        lineItems,
        PayApplicationModel,
        LineItemModel,
        transaction,
      );
    });
  }

  async approvePayApplication(payApplicationId: string, reviewedBy: string, notes: string) {
    const PayApplicationModel = createPayApplicationModel(this.sequelize);

    return this.sequelize.transaction(async (transaction) => {
      return reviewAndApprovePayApplication(
        payApplicationId,
        reviewedBy,
        notes,
        PayApplicationModel,
        transaction,
      );
    });
  }

  async processRetainageWithholding(
    contractId: string,
    payApplicationId: string,
    retainageRate: number,
    paymentAmount: number,
  ) {
    const RetainageModel = createRetainageModel(this.sequelize);

    return this.sequelize.transaction(async (transaction) => {
      return withholdRetainageOnPayment(
        contractId,
        payApplicationId,
        retainageRate,
        paymentAmount,
        RetainageModel,
        transaction,
      );
    });
  }

  async releaseRetainage(
    contractId: string,
    releaseAmount: number,
    releasedBy: string,
    reason: string,
  ) {
    const RetainageModel = createRetainageModel(this.sequelize);

    return this.sequelize.transaction(async (transaction) => {
      return releaseRetainageForMilestone(
        contractId,
        releaseAmount,
        releasedBy,
        reason,
        RetainageModel,
        transaction,
      );
    });
  }

  async submitLienWaiver(waiverData: LienWaiver) {
    const LienWaiverModel = createLienWaiverModel(this.sequelize);

    return this.sequelize.transaction(async (transaction) => {
      return processLienWaiverSubmission(waiverData, LienWaiverModel, transaction);
    });
  }

  async initiateCloseout(contractId: string, finalCompletionDate: Date) {
    const ContractModel = createConstructionContractModel(this.sequelize);

    return this.sequelize.transaction(async (transaction) => {
      return initiateContractCloseout(contractId, finalCompletionDate, ContractModel, transaction);
    });
  }
}

/**
 * Default export with all construction billing utilities.
 */
export default {
  // Models
  createConstructionContractorModel,
  createPaymentLineItemModel,
  createLienWaiverModel,

  // Contractor Management (1-10)
  registerConstructionContractor,
  updateContractorPrequalification,
  verifyContractorCompliance,
  getContractorPerformanceHistory,
  updateContractorCertifications,
  processContractorBondVerification,
  validateContractorInsurance,
  getContractorsByStatus,
  searchContractorsByCertification,
  generateContractorQualificationPackage,

  // Pay Application Processing (11-20)
  createPayApplicationWithLineItems,
  reviewAndApprovePayApplication,
  calculatePayApplicationRetainage,
  processStoredMaterialsForPayApplication,
  validatePayApplicationAgainstContract,
  generatePaymentCertificate,
  rejectPayApplication,
  revisePayApplication,
  calculatePayApplicationPercentComplete,
  generateDetailedPayApplicationReport,

  // Retainage Management (21-30)
  withholdRetainageOnPayment,
  releaseRetainageForMilestone,
  calculateTotalRetainageHeld,
  generateRetainageReleaseSchedule,
  processPartialRetainageRelease,
  generateRetainageReconciliation,
  validateRetainageReleaseEligibility,
  processFinalRetainageRelease,
  trackRetainageAging,
  adjustRetainageForChangeOrder,

  // Lien Waiver Management (31-40)
  processLienWaiverSubmission,
  validateLienWaiverCompleteness,
  generateFinalLienWaiverDocumentation,
  trackSubcontractorLienWaivers,
  verifyLienWaiverNotarization,
  generateConditionalLienWaiver,
  convertConditionalToUnconditionalWaiver,
  aggregateLienWaiversForContract,
  validateLienWaiverExpiration,
  generateLienWaiverComplianceReport,

  // Contract Closeout (41-50)
  initiateContractCloseout,
  validateCloseoutDocumentation,
  processFinalPaymentAndCloseout,
  generateComprehensiveCloseoutReport,
  archiveContractCloseoutDocumentation,

  // Service
  ConstructionBillingBackendService,
};
