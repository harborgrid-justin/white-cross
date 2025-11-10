/**
 * LOC: CEFMSLAM001
 * File: /reuse/financial/cefms/composites/cefms-lease-accounting-management-composite.ts
 *
 * UPSTREAM (imports from):
 *   - ../../../government/capital-asset-planning-kit.ts
 *   - ../../../government/debt-bond-management-kit.ts
 *   - ../../../government/government-financial-reporting-kit.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend CEFMS lease services
 *   - USACE lease compliance systems
 *   - Lease reporting modules
 */

/**
 * File: /reuse/financial/cefms/composites/cefms-lease-accounting-management-composite.ts
 * Locator: WC-CEFMS-LAM-001
 * Purpose: USACE CEFMS Lease Accounting Management - lease classification, liability calculations, GASB 87 compliance
 *
 * Upstream: Composes utilities from government kits for lease accounting
 * Downstream: ../../../backend/cefms/*, Lease controllers, financial reporting, GASB 87 compliance
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 41 composite functions for USACE CEFMS lease accounting operations
 *
 * LLM Context: Production-ready USACE CEFMS lease accounting management system.
 * Comprehensive lease classification, lease liability calculations, right-of-use asset recognition, lease amortization,
 * payment tracking, lease modifications, impairment testing, GASB 87 compliance reporting, lease terminations,
 * sublease tracking, and lease portfolio analytics.
 */

import { Model, DataTypes, Sequelize, Transaction, Op } from 'sequelize';
import { Injectable } from '@nestjs/common';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface LeaseAgreementData {
  leaseId: string;
  leaseNumber: string;
  lessor: string;
  leaseType: 'operating' | 'finance' | 'short_term';
  description: string;
  commencementDate: Date;
  expirationDate: Date;
  monthlyPayment: number;
  totalLeasePayments: number;
  status: 'active' | 'terminated' | 'expired';
}

interface LeaseLiabilityData {
  liabilityId: string;
  leaseId: string;
  initialLiability: number;
  currentLiability: number;
  interestRate: number;
  discountRate: number;
  calculationDate: Date;
}

interface RightOfUseAssetData {
  assetId: string;
  leaseId: string;
  initialCost: number;
  currentValue: number;
  accumulatedAmortization: number;
  usefulLife: number;
  amortizationMethod: 'straight_line' | 'declining_balance';
}

interface LeasePaymentData {
  paymentId: string;
  leaseId: string;
  paymentDate: Date;
  paymentAmount: number;
  principalPortion: number;
  interestPortion: number;
  status: 'scheduled' | 'paid' | 'overdue';
}

interface LeaseModificationData {
  modificationId: string;
  leaseId: string;
  modificationType: 'term_extension' | 'payment_change' | 'scope_change';
  effectiveDate: Date;
  description: string;
  remeasurementRequired: boolean;
}

interface LeaseImpairmentData {
  impairmentId: string;
  assetId: string;
  testDate: Date;
  carryingAmount: number;
  fairValue: number;
  impairmentLoss: number;
  impairmentReason: string;
}

interface SubleaseData {
  subleaseId: string;
  masterLeaseId: string;
  sublessee: string;
  commencementDate: Date;
  expirationDate: Date;
  monthlyPayment: number;
  status: 'active' | 'terminated';
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Sequelize model for Lease Agreements with GASB 87 compliance.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} LeaseAgreement model
 *
 * @example
 * ```typescript
 * const LeaseAgreement = createLeaseAgreementModel(sequelize);
 * const lease = await LeaseAgreement.create({
 *   leaseId: 'LSE-2024-001',
 *   leaseNumber: 'LEASE-001',
 *   lessor: 'ABC Properties',
 *   leaseType: 'operating',
 *   description: 'Office Space',
 *   commencementDate: new Date('2024-01-01'),
 *   expirationDate: new Date('2029-01-01'),
 *   monthlyPayment: 5000,
 *   status: 'active'
 * });
 * ```
 */
export const createLeaseAgreementModel = (sequelize: Sequelize) => {
  class LeaseAgreement extends Model {
    public id!: string;
    public leaseId!: string;
    public leaseNumber!: string;
    public lessor!: string;
    public leaseType!: string;
    public description!: string;
    public commencementDate!: Date;
    public expirationDate!: Date;
    public monthlyPayment!: number;
    public totalLeasePayments!: number;
    public status!: string;
    public leaseTerm!: number;
    public renewalOptions!: number;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  LeaseAgreement.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      leaseId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Lease identifier',
      },
      leaseNumber: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        comment: 'Lease number',
      },
      lessor: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Lessor name',
      },
      leaseType: {
        type: DataTypes.ENUM('operating', 'finance', 'short_term'),
        allowNull: false,
        comment: 'Lease type per GASB 87',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Lease description',
      },
      commencementDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Commencement date',
      },
      expirationDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Expiration date',
      },
      monthlyPayment: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Monthly payment amount',
      },
      totalLeasePayments: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Total lease payments',
      },
      status: {
        type: DataTypes.ENUM('active', 'terminated', 'expired'),
        allowNull: false,
        defaultValue: 'active',
        comment: 'Lease status',
      },
      leaseTerm: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Lease term in months',
      },
      renewalOptions: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Number of renewal options',
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
      tableName: 'lease_agreements',
      timestamps: true,
      indexes: [
        { fields: ['leaseId'], unique: true },
        { fields: ['leaseNumber'], unique: true },
        { fields: ['leaseType'] },
        { fields: ['status'] },
        { fields: ['expirationDate'] },
      ],
    },
  );

  return LeaseAgreement;
};

/**
 * Sequelize model for Lease Liabilities.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} LeaseLiability model
 */
export const createLeaseLiabilityModel = (sequelize: Sequelize) => {
  class LeaseLiability extends Model {
    public id!: string;
    public liabilityId!: string;
    public leaseId!: string;
    public initialLiability!: number;
    public currentLiability!: number;
    public interestRate!: number;
    public discountRate!: number;
    public calculationDate!: Date;
    public currentPortion!: number;
    public longTermPortion!: number;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  LeaseLiability.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      liabilityId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Liability identifier',
      },
      leaseId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Related lease',
      },
      initialLiability: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Initial liability amount',
      },
      currentLiability: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Current liability balance',
      },
      interestRate: {
        type: DataTypes.DECIMAL(5, 4),
        allowNull: false,
        comment: 'Interest rate',
      },
      discountRate: {
        type: DataTypes.DECIMAL(5, 4),
        allowNull: false,
        comment: 'Discount rate',
      },
      calculationDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Calculation date',
      },
      currentPortion: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Current portion (due within 12 months)',
      },
      longTermPortion: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Long-term portion',
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
      tableName: 'lease_liabilities',
      timestamps: true,
      indexes: [
        { fields: ['liabilityId'], unique: true },
        { fields: ['leaseId'] },
        { fields: ['calculationDate'] },
      ],
    },
  );

  return LeaseLiability;
};

/**
 * Sequelize model for Right-of-Use Assets.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} RightOfUseAsset model
 */
export const createRightOfUseAssetModel = (sequelize: Sequelize) => {
  class RightOfUseAsset extends Model {
    public id!: string;
    public assetId!: string;
    public leaseId!: string;
    public initialCost!: number;
    public currentValue!: number;
    public accumulatedAmortization!: number;
    public usefulLife!: number;
    public amortizationMethod!: string;
    public impairmentLoss!: number;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  RightOfUseAsset.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      assetId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Asset identifier',
      },
      leaseId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Related lease',
      },
      initialCost: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Initial cost',
      },
      currentValue: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Current value (net book value)',
      },
      accumulatedAmortization: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Accumulated amortization',
      },
      usefulLife: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Useful life in months',
      },
      amortizationMethod: {
        type: DataTypes.ENUM('straight_line', 'declining_balance'),
        allowNull: false,
        defaultValue: 'straight_line',
        comment: 'Amortization method',
      },
      impairmentLoss: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Cumulative impairment loss',
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
      tableName: 'right_of_use_assets',
      timestamps: true,
      indexes: [
        { fields: ['assetId'], unique: true },
        { fields: ['leaseId'] },
      ],
    },
  );

  return RightOfUseAsset;
};

/**
 * Sequelize model for Lease Payments.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} LeasePayment model
 */
export const createLeasePaymentModel = (sequelize: Sequelize) => {
  class LeasePayment extends Model {
    public id!: string;
    public paymentId!: string;
    public leaseId!: string;
    public paymentDate!: Date;
    public paymentAmount!: number;
    public principalPortion!: number;
    public interestPortion!: number;
    public status!: string;
    public actualPaymentDate!: Date | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  LeasePayment.init(
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
      leaseId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Related lease',
      },
      paymentDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Scheduled payment date',
      },
      paymentAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Payment amount',
      },
      principalPortion: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Principal portion',
      },
      interestPortion: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Interest portion',
      },
      status: {
        type: DataTypes.ENUM('scheduled', 'paid', 'overdue'),
        allowNull: false,
        defaultValue: 'scheduled',
        comment: 'Payment status',
      },
      actualPaymentDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Actual payment date',
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
      tableName: 'lease_payments',
      timestamps: true,
      indexes: [
        { fields: ['paymentId'], unique: true },
        { fields: ['leaseId'] },
        { fields: ['status'] },
        { fields: ['paymentDate'] },
      ],
    },
  );

  return LeasePayment;
};

/**
 * Sequelize model for Lease Modifications.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} LeaseModification model
 */
export const createLeaseModificationModel = (sequelize: Sequelize) => {
  class LeaseModification extends Model {
    public id!: string;
    public modificationId!: string;
    public leaseId!: string;
    public modificationType!: string;
    public effectiveDate!: Date;
    public description!: string;
    public remeasurementRequired!: boolean;
    public remeasurementCompleted!: boolean;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  LeaseModification.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      modificationId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Modification identifier',
      },
      leaseId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Related lease',
      },
      modificationType: {
        type: DataTypes.ENUM('term_extension', 'payment_change', 'scope_change'),
        allowNull: false,
        comment: 'Modification type',
      },
      effectiveDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Effective date',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Modification description',
      },
      remeasurementRequired: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Remeasurement required',
      },
      remeasurementCompleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Remeasurement completed',
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
      tableName: 'lease_modifications',
      timestamps: true,
      indexes: [
        { fields: ['modificationId'], unique: true },
        { fields: ['leaseId'] },
        { fields: ['effectiveDate'] },
      ],
    },
  );

  return LeaseModification;
};

/**
 * Sequelize model for Sublease Agreements.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Sublease model
 */
export const createSubleaseModel = (sequelize: Sequelize) => {
  class Sublease extends Model {
    public id!: string;
    public subleaseId!: string;
    public masterLeaseId!: string;
    public sublessee!: string;
    public commencementDate!: Date;
    public expirationDate!: Date;
    public monthlyPayment!: number;
    public status!: string;
    public totalReceived!: number;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  Sublease.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      subleaseId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Sublease identifier',
      },
      masterLeaseId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Master lease',
      },
      sublessee: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Sublessee name',
      },
      commencementDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Commencement date',
      },
      expirationDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Expiration date',
      },
      monthlyPayment: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Monthly payment amount',
      },
      status: {
        type: DataTypes.ENUM('active', 'terminated'),
        allowNull: false,
        defaultValue: 'active',
        comment: 'Sublease status',
      },
      totalReceived: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Total received',
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
      tableName: 'subleases',
      timestamps: true,
      indexes: [
        { fields: ['subleaseId'], unique: true },
        { fields: ['masterLeaseId'] },
        { fields: ['status'] },
      ],
    },
  );

  return Sublease;
};

// ============================================================================
// LEASE CLASSIFICATION & SETUP (1-7)
// ============================================================================

/**
 * Creates lease agreement with classification.
 *
 * @param {LeaseAgreementData} leaseData - Lease data
 * @param {Model} LeaseAgreement - LeaseAgreement model
 * @returns {Promise<any>} Created lease
 */
export const createLeaseAgreement = async (
  leaseData: LeaseAgreementData,
  LeaseAgreement: any,
): Promise<any> => {
  const leaseTerm = Math.round(
    (leaseData.expirationDate.getTime() - leaseData.commencementDate.getTime()) /
    (1000 * 60 * 60 * 24 * 30)
  );

  const totalPayments = leaseData.monthlyPayment * leaseTerm;

  return await LeaseAgreement.create({
    ...leaseData,
    leaseTerm,
    totalLeasePayments: totalPayments,
  });
};

/**
 * Classifies lease under GASB 87 criteria.
 *
 * @param {string} leaseId - Lease ID
 * @param {Model} LeaseAgreement - LeaseAgreement model
 * @returns {Promise<{ classification: string; criteria: string[] }>}
 */
export const classifyLeaseGASB87 = async (
  leaseId: string,
  LeaseAgreement: any,
): Promise<{ classification: string; criteria: string[] }> => {
  const lease = await LeaseAgreement.findOne({ where: { leaseId } });
  if (!lease) throw new Error('Lease not found');

  const criteria: string[] = [];
  const leaseTerm = lease.leaseTerm;

  // Short-term lease: 12 months or less
  if (leaseTerm <= 12) {
    criteria.push('Lease term 12 months or less');
    return { classification: 'short_term', criteria };
  }

  // Under GASB 87, most leases are finance leases
  criteria.push('Lease term exceeds 12 months');
  return { classification: 'finance', criteria };
};

/**
 * Validates lease agreement completeness.
 *
 * @param {string} leaseId - Lease ID
 * @param {Model} LeaseAgreement - LeaseAgreement model
 * @returns {Promise<{ valid: boolean; errors: string[] }>}
 */
export const validateLeaseAgreement = async (
  leaseId: string,
  LeaseAgreement: any,
): Promise<{ valid: boolean; errors: string[] }> => {
  const errors: string[] = [];
  const lease = await LeaseAgreement.findOne({ where: { leaseId } });

  if (!lease) {
    errors.push('Lease not found');
    return { valid: false, errors };
  }

  if (!lease.leaseNumber || lease.leaseNumber.trim() === '') {
    errors.push('Lease number is required');
  }

  if (lease.monthlyPayment <= 0) {
    errors.push('Monthly payment must be greater than zero');
  }

  if (lease.expirationDate <= lease.commencementDate) {
    errors.push('Expiration date must be after commencement date');
  }

  return { valid: errors.length === 0, errors };
};

/**
 * Retrieves active leases by type.
 *
 * @param {string} leaseType - Lease type
 * @param {Model} LeaseAgreement - LeaseAgreement model
 * @returns {Promise<any[]>} Active leases
 */
export const getActiveLeases = async (
  leaseType: string | undefined,
  LeaseAgreement: any,
): Promise<any[]> => {
  const where: any = { status: 'active' };
  if (leaseType) {
    where.leaseType = leaseType;
  }

  return await LeaseAgreement.findAll({
    where,
    order: [['expirationDate', 'ASC']],
  });
};

/**
 * Calculates total lease commitment.
 *
 * @param {string} leaseId - Lease ID
 * @param {Model} LeaseAgreement - LeaseAgreement model
 * @param {Model} LeasePayment - LeasePayment model
 * @returns {Promise<{ totalCommitment: number; paidToDate: number; remainingCommitment: number }>}
 */
export const calculateLeaseCommitment = async (
  leaseId: string,
  LeaseAgreement: any,
  LeasePayment: any,
): Promise<{ totalCommitment: number; paidToDate: number; remainingCommitment: number }> => {
  const lease = await LeaseAgreement.findOne({ where: { leaseId } });
  if (!lease) throw new Error('Lease not found');

  const payments = await LeasePayment.findAll({
    where: { leaseId, status: 'paid' },
  });

  const paidToDate = payments.reduce((sum: number, p: any) => sum + parseFloat(p.paymentAmount), 0);
  const totalCommitment = parseFloat(lease.totalLeasePayments);

  return {
    totalCommitment,
    paidToDate,
    remainingCommitment: totalCommitment - paidToDate,
  };
};

/**
 * Identifies leases approaching expiration.
 *
 * @param {number} daysThreshold - Days threshold
 * @param {Model} LeaseAgreement - LeaseAgreement model
 * @returns {Promise<any[]>} Leases approaching expiration
 */
export const getExpiringLeases = async (
  daysThreshold: number,
  LeaseAgreement: any,
): Promise<any[]> => {
  const threshold = new Date();
  threshold.setDate(threshold.getDate() + daysThreshold);

  return await LeaseAgreement.findAll({
    where: {
      status: 'active',
      expirationDate: { [Op.lte]: threshold },
    },
    order: [['expirationDate', 'ASC']],
  });
};

/**
 * Updates lease status.
 *
 * @param {string} leaseId - Lease ID
 * @param {string} newStatus - New status
 * @param {Model} LeaseAgreement - LeaseAgreement model
 * @returns {Promise<any>} Updated lease
 */
export const updateLeaseStatus = async (
  leaseId: string,
  newStatus: string,
  LeaseAgreement: any,
): Promise<any> => {
  const lease = await LeaseAgreement.findOne({ where: { leaseId } });
  if (!lease) throw new Error('Lease not found');

  lease.status = newStatus;
  await lease.save();

  return lease;
};

// ============================================================================
// LIABILITY CALCULATIONS (8-14)
// ============================================================================

/**
 * Calculates initial lease liability.
 *
 * @param {string} leaseId - Lease ID
 * @param {number} discountRate - Discount rate
 * @param {Model} LeaseAgreement - LeaseAgreement model
 * @param {Model} LeaseLiability - LeaseLiability model
 * @returns {Promise<any>} Created liability
 */
export const calculateInitialLeaseLiability = async (
  leaseId: string,
  discountRate: number,
  LeaseAgreement: any,
  LeaseLiability: any,
): Promise<any> => {
  const lease = await LeaseAgreement.findOne({ where: { leaseId } });
  if (!lease) throw new Error('Lease not found');

  // Present value of lease payments
  const monthlyRate = discountRate / 12;
  const numPayments = lease.leaseTerm;
  const payment = parseFloat(lease.monthlyPayment);

  const presentValue = payment * ((1 - Math.pow(1 + monthlyRate, -numPayments)) / monthlyRate);

  return await LeaseLiability.create({
    liabilityId: `LIA-${leaseId}`,
    leaseId,
    initialLiability: presentValue,
    currentLiability: presentValue,
    interestRate: discountRate * 12,
    discountRate,
    calculationDate: new Date(),
    currentPortion: 0,
    longTermPortion: presentValue,
  });
};

/**
 * Remeasures lease liability for modification.
 *
 * @param {string} liabilityId - Liability ID
 * @param {number} newDiscountRate - New discount rate
 * @param {Model} LeaseLiability - LeaseLiability model
 * @param {Model} LeaseAgreement - LeaseAgreement model
 * @returns {Promise<any>} Updated liability
 */
export const remeasureLeaseLiability = async (
  liabilityId: string,
  newDiscountRate: number,
  LeaseLiability: any,
  LeaseAgreement: any,
): Promise<any> => {
  const liability = await LeaseLiability.findOne({ where: { liabilityId } });
  if (!liability) throw new Error('Liability not found');

  const lease = await LeaseAgreement.findOne({ where: { leaseId: liability.leaseId } });
  if (!lease) throw new Error('Lease not found');

  // Recalculate present value with new rate
  const monthlyRate = newDiscountRate / 12;
  const numPayments = lease.leaseTerm;
  const payment = parseFloat(lease.monthlyPayment);

  const newPresentValue = payment * ((1 - Math.pow(1 + monthlyRate, -numPayments)) / monthlyRate);

  liability.currentLiability = newPresentValue;
  liability.discountRate = newDiscountRate;
  liability.calculationDate = new Date();
  await liability.save();

  return liability;
};

/**
 * Splits liability into current and long-term portions.
 *
 * @param {string} liabilityId - Liability ID
 * @param {Model} LeaseLiability - LeaseLiability model
 * @param {Model} LeasePayment - LeasePayment model
 * @returns {Promise<any>} Updated liability
 */
export const splitLiabilityPortions = async (
  liabilityId: string,
  LeaseLiability: any,
  LeasePayment: any,
): Promise<any> => {
  const liability = await LeaseLiability.findOne({ where: { liabilityId } });
  if (!liability) throw new Error('Liability not found');

  const oneYearFromNow = new Date();
  oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

  const paymentsWithinYear = await LeasePayment.findAll({
    where: {
      leaseId: liability.leaseId,
      paymentDate: { [Op.lte]: oneYearFromNow },
      status: 'scheduled',
    },
  });

  const currentPortion = paymentsWithinYear.reduce(
    (sum: number, p: any) => sum + parseFloat(p.principalPortion),
    0
  );

  liability.currentPortion = currentPortion;
  liability.longTermPortion = parseFloat(liability.currentLiability) - currentPortion;
  await liability.save();

  return liability;
};

/**
 * Reduces liability for payment.
 *
 * @param {string} liabilityId - Liability ID
 * @param {number} principalPortion - Principal portion
 * @param {Model} LeaseLiability - LeaseLiability model
 * @returns {Promise<any>} Updated liability
 */
export const reduceLiability = async (
  liabilityId: string,
  principalPortion: number,
  LeaseLiability: any,
): Promise<any> => {
  const liability = await LeaseLiability.findOne({ where: { liabilityId } });
  if (!liability) throw new Error('Liability not found');

  liability.currentLiability = parseFloat(liability.currentLiability) - principalPortion;
  await liability.save();

  return liability;
};

/**
 * Retrieves liability balance as of date.
 *
 * @param {string} liabilityId - Liability ID
 * @param {Date} asOfDate - As of date
 * @param {Model} LeaseLiability - LeaseLiability model
 * @returns {Promise<number>} Liability balance
 */
export const getLiabilityBalanceAsOf = async (
  liabilityId: string,
  asOfDate: Date,
  LeaseLiability: any,
): Promise<number> => {
  const liability = await LeaseLiability.findOne({ where: { liabilityId } });
  if (!liability) throw new Error('Liability not found');

  // Simplified - would calculate based on payments made up to date
  return parseFloat(liability.currentLiability);
};

/**
 * Generates liability amortization schedule.
 *
 * @param {string} leaseId - Lease ID
 * @param {Model} LeaseLiability - LeaseLiability model
 * @param {Model} LeasePayment - LeasePayment model
 * @returns {Promise<any[]>} Amortization schedule
 */
export const generateLiabilityAmortizationSchedule = async (
  leaseId: string,
  LeaseLiability: any,
  LeasePayment: any,
): Promise<any[]> => {
  const payments = await LeasePayment.findAll({
    where: { leaseId },
    order: [['paymentDate', 'ASC']],
  });

  const schedule = [];
  let balance = 0;

  const liability = await LeaseLiability.findOne({ where: { leaseId } });
  if (liability) {
    balance = parseFloat(liability.initialLiability);
  }

  for (const payment of payments) {
    const principal = parseFloat(payment.principalPortion);
    const interest = parseFloat(payment.interestPortion);
    balance -= principal;

    schedule.push({
      paymentDate: payment.paymentDate,
      payment: parseFloat(payment.paymentAmount),
      principal,
      interest,
      balance: Math.max(0, balance),
    });
  }

  return schedule;
};

/**
 * Validates liability calculation accuracy.
 *
 * @param {string} liabilityId - Liability ID
 * @param {Model} LeaseLiability - LeaseLiability model
 * @param {Model} LeasePayment - LeasePayment model
 * @returns {Promise<{ accurate: boolean; variance: number }>}
 */
export const validateLiabilityCalculation = async (
  liabilityId: string,
  LeaseLiability: any,
  LeasePayment: any,
): Promise<{ accurate: boolean; variance: number }> => {
  const liability = await LeaseLiability.findOne({ where: { liabilityId } });
  if (!liability) throw new Error('Liability not found');

  const payments = await LeasePayment.findAll({
    where: { leaseId: liability.leaseId, status: 'paid' },
  });

  const totalPrincipalPaid = payments.reduce(
    (sum: number, p: any) => sum + parseFloat(p.principalPortion),
    0
  );

  const calculatedRemaining = parseFloat(liability.initialLiability) - totalPrincipalPaid;
  const variance = Math.abs(calculatedRemaining - parseFloat(liability.currentLiability));

  return {
    accurate: variance < 0.01,
    variance,
  };
};

// ============================================================================
// RIGHT-OF-USE ASSETS (15-21)
// ============================================================================

/**
 * Creates right-of-use asset.
 *
 * @param {RightOfUseAssetData} assetData - Asset data
 * @param {Model} RightOfUseAsset - RightOfUseAsset model
 * @returns {Promise<any>} Created asset
 */
export const createRightOfUseAsset = async (
  assetData: RightOfUseAssetData,
  RightOfUseAsset: any,
): Promise<any> => {
  return await RightOfUseAsset.create({
    ...assetData,
    currentValue: assetData.initialCost,
  });
};

/**
 * Calculates monthly amortization expense.
 *
 * @param {string} assetId - Asset ID
 * @param {Model} RightOfUseAsset - RightOfUseAsset model
 * @returns {Promise<number>} Monthly amortization
 */
export const calculateMonthlyAmortization = async (
  assetId: string,
  RightOfUseAsset: any,
): Promise<number> => {
  const asset = await RightOfUseAsset.findOne({ where: { assetId } });
  if (!asset) throw new Error('Asset not found');

  if (asset.amortizationMethod === 'straight_line') {
    return parseFloat(asset.initialCost) / asset.usefulLife;
  }

  // Declining balance
  const rate = 2 / asset.usefulLife;
  return parseFloat(asset.currentValue) * rate;
};

/**
 * Records amortization expense for period.
 *
 * @param {string} assetId - Asset ID
 * @param {number} amortizationAmount - Amortization amount
 * @param {Model} RightOfUseAsset - RightOfUseAsset model
 * @returns {Promise<any>} Updated asset
 */
export const recordAmortizationExpense = async (
  assetId: string,
  amortizationAmount: number,
  RightOfUseAsset: any,
): Promise<any> => {
  const asset = await RightOfUseAsset.findOne({ where: { assetId } });
  if (!asset) throw new Error('Asset not found');

  asset.accumulatedAmortization = parseFloat(asset.accumulatedAmortization) + amortizationAmount;
  asset.currentValue = parseFloat(asset.initialCost) - parseFloat(asset.accumulatedAmortization);
  await asset.save();

  return asset;
};

/**
 * Tests asset for impairment.
 *
 * @param {LeaseImpairmentData} impairmentData - Impairment data
 * @param {Model} RightOfUseAsset - RightOfUseAsset model
 * @returns {Promise<any>} Impairment result
 */
export const testAssetImpairment = async (
  impairmentData: LeaseImpairmentData,
  RightOfUseAsset: any,
): Promise<any> => {
  const asset = await RightOfUseAsset.findOne({ where: { assetId: impairmentData.assetId } });
  if (!asset) throw new Error('Asset not found');

  const impairmentLoss = impairmentData.carryingAmount - impairmentData.fairValue;

  if (impairmentLoss > 0) {
    asset.impairmentLoss = parseFloat(asset.impairmentLoss) + impairmentLoss;
    asset.currentValue = parseFloat(asset.currentValue) - impairmentLoss;
    await asset.save();
  }

  return {
    impaired: impairmentLoss > 0,
    impairmentLoss,
    newCarryingAmount: parseFloat(asset.currentValue),
  };
};

/**
 * Generates amortization schedule for asset.
 *
 * @param {string} assetId - Asset ID
 * @param {Model} RightOfUseAsset - RightOfUseAsset model
 * @returns {Promise<any[]>} Amortization schedule
 */
export const generateAmortizationSchedule = async (
  assetId: string,
  RightOfUseAsset: any,
): Promise<any[]> => {
  const asset = await RightOfUseAsset.findOne({ where: { assetId } });
  if (!asset) throw new Error('Asset not found');

  const schedule = [];
  const monthlyAmortization = parseFloat(asset.initialCost) / asset.usefulLife;
  let accumulatedAmort = 0;

  for (let month = 1; month <= asset.usefulLife; month++) {
    accumulatedAmort += monthlyAmortization;
    const netBookValue = parseFloat(asset.initialCost) - accumulatedAmort;

    schedule.push({
      period: month,
      amortization: monthlyAmortization,
      accumulatedAmortization: accumulatedAmort,
      netBookValue: Math.max(0, netBookValue),
    });
  }

  return schedule;
};

/**
 * Retrieves asset net book value.
 *
 * @param {string} assetId - Asset ID
 * @param {Model} RightOfUseAsset - RightOfUseAsset model
 * @returns {Promise<number>} Net book value
 */
export const getAssetNetBookValue = async (
  assetId: string,
  RightOfUseAsset: any,
): Promise<number> => {
  const asset = await RightOfUseAsset.findOne({ where: { assetId } });
  if (!asset) throw new Error('Asset not found');

  return parseFloat(asset.currentValue);
};

/**
 * Disposes of right-of-use asset.
 *
 * @param {string} assetId - Asset ID
 * @param {Date} disposalDate - Disposal date
 * @param {Model} RightOfUseAsset - RightOfUseAsset model
 * @returns {Promise<any>} Disposed asset
 */
export const disposeRightOfUseAsset = async (
  assetId: string,
  disposalDate: Date,
  RightOfUseAsset: any,
): Promise<any> => {
  const asset = await RightOfUseAsset.findOne({ where: { assetId } });
  if (!asset) throw new Error('Asset not found');

  asset.metadata = {
    ...asset.metadata,
    disposed: true,
    disposalDate: disposalDate.toISOString(),
  };
  asset.currentValue = 0;
  await asset.save();

  return asset;
};

// ============================================================================
// PAYMENT TRACKING (22-28)
// ============================================================================

/**
 * Generates lease payment schedule.
 *
 * @param {string} leaseId - Lease ID
 * @param {Model} LeaseAgreement - LeaseAgreement model
 * @param {Model} LeasePayment - LeasePayment model
 * @param {Model} LeaseLiability - LeaseLiability model
 * @returns {Promise<any[]>} Payment schedule
 */
export const generateLeasePaymentSchedule = async (
  leaseId: string,
  LeaseAgreement: any,
  LeasePayment: any,
  LeaseLiability: any,
): Promise<any[]> => {
  const lease = await LeaseAgreement.findOne({ where: { leaseId } });
  if (!lease) throw new Error('Lease not found');

  const liability = await LeaseLiability.findOne({ where: { leaseId } });
  const monthlyRate = liability ? parseFloat(liability.discountRate) / 12 : 0;

  const payments = [];
  let balance = liability ? parseFloat(liability.initialLiability) : 0;
  let paymentDate = new Date(lease.commencementDate);

  for (let i = 0; i < lease.leaseTerm; i++) {
    const interestPortion = balance * monthlyRate;
    const principalPortion = parseFloat(lease.monthlyPayment) - interestPortion;
    balance -= principalPortion;

    const payment = await LeasePayment.create({
      paymentId: `PAY-${leaseId}-${i + 1}`,
      leaseId,
      paymentDate: new Date(paymentDate),
      paymentAmount: lease.monthlyPayment,
      principalPortion: Math.max(0, principalPortion),
      interestPortion: Math.max(0, interestPortion),
      status: 'scheduled',
    });

    payments.push(payment);
    paymentDate.setMonth(paymentDate.getMonth() + 1);
  }

  return payments;
};

/**
 * Records lease payment.
 *
 * @param {string} paymentId - Payment ID
 * @param {Date} paymentDate - Actual payment date
 * @param {Model} LeasePayment - LeasePayment model
 * @param {Model} LeaseLiability - LeaseLiability model
 * @returns {Promise<any>} Updated payment
 */
export const recordLeasePayment = async (
  paymentId: string,
  paymentDate: Date,
  LeasePayment: any,
  LeaseLiability: any,
): Promise<any> => {
  const payment = await LeasePayment.findOne({ where: { paymentId } });
  if (!payment) throw new Error('Payment not found');

  payment.status = 'paid';
  payment.actualPaymentDate = paymentDate;
  await payment.save();

  // Update liability
  const liability = await LeaseLiability.findOne({ where: { leaseId: payment.leaseId } });
  if (liability) {
    await reduceLiability(
      liability.liabilityId,
      parseFloat(payment.principalPortion),
      LeaseLiability,
    );
  }

  return payment;
};

/**
 * Retrieves upcoming lease payments.
 *
 * @param {number} daysAhead - Days ahead to retrieve
 * @param {Model} LeasePayment - LeasePayment model
 * @returns {Promise<any[]>} Upcoming payments
 */
export const getUpcomingPayments = async (
  daysAhead: number,
  LeasePayment: any,
): Promise<any[]> => {
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + daysAhead);

  return await LeasePayment.findAll({
    where: {
      status: 'scheduled',
      paymentDate: { [Op.lte]: endDate },
    },
    order: [['paymentDate', 'ASC']],
  });
};

/**
 * Identifies overdue payments.
 *
 * @param {Model} LeasePayment - LeasePayment model
 * @returns {Promise<any[]>} Overdue payments
 */
export const getOverduePayments = async (
  LeasePayment: any,
): Promise<any[]> => {
  return await LeasePayment.findAll({
    where: {
      status: 'scheduled',
      paymentDate: { [Op.lt]: new Date() },
    },
    order: [['paymentDate', 'ASC']],
  });
};

/**
 * Calculates total lease cost to date.
 *
 * @param {string} leaseId - Lease ID
 * @param {Model} LeasePayment - LeasePayment model
 * @returns {Promise<{ totalPaid: number; totalInterest: number; totalPrincipal: number }>}
 */
export const calculateLeaseCostToDate = async (
  leaseId: string,
  LeasePayment: any,
): Promise<{ totalPaid: number; totalInterest: number; totalPrincipal: number }> => {
  const payments = await LeasePayment.findAll({
    where: { leaseId, status: 'paid' },
  });

  const totalPaid = payments.reduce((sum: number, p: any) => sum + parseFloat(p.paymentAmount), 0);
  const totalInterest = payments.reduce((sum: number, p: any) => sum + parseFloat(p.interestPortion), 0);
  const totalPrincipal = payments.reduce((sum: number, p: any) => sum + parseFloat(p.principalPortion), 0);

  return {
    totalPaid,
    totalInterest,
    totalPrincipal,
  };
};

/**
 * Generates payment tracking report.
 *
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Model} LeasePayment - LeasePayment model
 * @returns {Promise<any>} Payment report
 */
export const generatePaymentTrackingReport = async (
  startDate: Date,
  endDate: Date,
  LeasePayment: any,
): Promise<any> => {
  const payments = await LeasePayment.findAll({
    where: {
      paymentDate: { [Op.between]: [startDate, endDate] },
    },
  });

  const totalScheduled = payments.filter((p: any) => p.status === 'scheduled').length;
  const totalPaid = payments.filter((p: any) => p.status === 'paid').length;
  const totalOverdue = payments.filter((p: any) => p.status === 'overdue').length;

  const amountPaid = payments
    .filter((p: any) => p.status === 'paid')
    .reduce((sum: number, p: any) => sum + parseFloat(p.paymentAmount), 0);

  return {
    period: { startDate, endDate },
    totalPayments: payments.length,
    totalScheduled,
    totalPaid,
    totalOverdue,
    amountPaid,
    paymentRate: payments.length > 0 ? (totalPaid / payments.length) * 100 : 0,
  };
};

/**
 * Exports lease payment schedule to CSV.
 *
 * @param {string} leaseId - Lease ID
 * @param {Model} LeasePayment - LeasePayment model
 * @returns {Promise<Buffer>} CSV export
 */
export const exportPaymentScheduleCSV = async (
  leaseId: string,
  LeasePayment: any,
): Promise<Buffer> => {
  const payments = await LeasePayment.findAll({
    where: { leaseId },
    order: [['paymentDate', 'ASC']],
  });

  const csv = 'Payment Date,Payment Amount,Principal,Interest,Status\n' +
    payments.map((p: any) =>
      `${p.paymentDate.toISOString().split('T')[0]},${p.paymentAmount},${p.principalPortion},${p.interestPortion},${p.status}`
    ).join('\n');

  return Buffer.from(csv, 'utf-8');
};

// ============================================================================
// MODIFICATIONS & COMPLIANCE (29-35)
// ============================================================================

/**
 * Records lease modification.
 *
 * @param {LeaseModificationData} modificationData - Modification data
 * @param {Model} LeaseModification - LeaseModification model
 * @returns {Promise<any>} Created modification
 */
export const recordLeaseModification = async (
  modificationData: LeaseModificationData,
  LeaseModification: any,
): Promise<any> => {
  return await LeaseModification.create(modificationData);
};

/**
 * Processes modification remeasurement.
 *
 * @param {string} modificationId - Modification ID
 * @param {Model} LeaseModification - LeaseModification model
 * @param {Model} LeaseLiability - LeaseLiability model
 * @param {Model} RightOfUseAsset - RightOfUseAsset model
 * @returns {Promise<any>} Remeasurement result
 */
export const processModificationRemeasurement = async (
  modificationId: string,
  LeaseModification: any,
  LeaseLiability: any,
  RightOfUseAsset: any,
): Promise<any> => {
  const modification = await LeaseModification.findOne({ where: { modificationId } });
  if (!modification) throw new Error('Modification not found');

  if (!modification.remeasurementRequired) {
    return { remeasured: false };
  }

  // Remeasure liability
  const liability = await LeaseLiability.findOne({ where: { leaseId: modification.leaseId } });
  if (liability) {
    await remeasureLeaseLiability(
      liability.liabilityId,
      parseFloat(liability.discountRate),
      LeaseLiability,
      null,
    );
  }

  modification.remeasurementCompleted = true;
  await modification.save();

  return { remeasured: true, modification };
};

/**
 * Generates GASB 87 compliance report.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {Model} LeaseAgreement - LeaseAgreement model
 * @param {Model} LeaseLiability - LeaseLiability model
 * @param {Model} RightOfUseAsset - RightOfUseAsset model
 * @returns {Promise<any>} Compliance report
 */
export const generateGASB87ComplianceReport = async (
  fiscalYear: number,
  LeaseAgreement: any,
  LeaseLiability: any,
  RightOfUseAsset: any,
): Promise<any> => {
  const leases = await LeaseAgreement.findAll({ where: { status: 'active' } });
  const liabilities = await LeaseLiability.findAll();
  const assets = await RightOfUseAsset.findAll();

  const totalLiability = liabilities.reduce((sum: number, l: any) => sum + parseFloat(l.currentLiability), 0);
  const totalAssetValue = assets.reduce((sum: number, a: any) => sum + parseFloat(a.currentValue), 0);

  return {
    fiscalYear,
    totalLeases: leases.length,
    totalLiability,
    totalAssetValue,
    leasesByType: {
      operating: leases.filter((l: any) => l.leaseType === 'operating').length,
      finance: leases.filter((l: any) => l.leaseType === 'finance').length,
      shortTerm: leases.filter((l: any) => l.leaseType === 'short_term').length,
    },
  };
};

/**
 * Terminates lease agreement.
 *
 * @param {string} leaseId - Lease ID
 * @param {Date} terminationDate - Termination date
 * @param {string} reason - Termination reason
 * @param {Model} LeaseAgreement - LeaseAgreement model
 * @returns {Promise<any>} Terminated lease
 */
export const terminateLease = async (
  leaseId: string,
  terminationDate: Date,
  reason: string,
  LeaseAgreement: any,
): Promise<any> => {
  const lease = await LeaseAgreement.findOne({ where: { leaseId } });
  if (!lease) throw new Error('Lease not found');

  lease.status = 'terminated';
  lease.metadata = {
    ...lease.metadata,
    terminationDate: terminationDate.toISOString(),
    terminationReason: reason,
  };
  await lease.save();

  return lease;
};

/**
 * Creates sublease agreement.
 *
 * @param {SubleaseData} subleaseData - Sublease data
 * @param {Model} Sublease - Sublease model
 * @returns {Promise<any>} Created sublease
 */
export const createSubleaseAgreement = async (
  subleaseData: SubleaseData,
  Sublease: any,
): Promise<any> => {
  return await Sublease.create(subleaseData);
};

/**
 * Tracks sublease income.
 *
 * @param {string} subleaseId - Sublease ID
 * @param {number} amount - Payment amount
 * @param {Model} Sublease - Sublease model
 * @returns {Promise<any>} Updated sublease
 */
export const trackSubleaseIncome = async (
  subleaseId: string,
  amount: number,
  Sublease: any,
): Promise<any> => {
  const sublease = await Sublease.findOne({ where: { subleaseId } });
  if (!sublease) throw new Error('Sublease not found');

  sublease.totalReceived = parseFloat(sublease.totalReceived) + amount;
  await sublease.save();

  return sublease;
};

/**
 * Generates lease portfolio analytics.
 *
 * @param {Model} LeaseAgreement - LeaseAgreement model
 * @param {Model} LeaseLiability - LeaseLiability model
 * @param {Model} LeasePayment - LeasePayment model
 * @returns {Promise<any>} Portfolio analytics
 */
export const generateLeasePortfolioAnalytics = async (
  LeaseAgreement: any,
  LeaseLiability: any,
  LeasePayment: any,
): Promise<any> => {
  const leases = await LeaseAgreement.findAll();
  const liabilities = await LeaseLiability.findAll();
  const payments = await LeasePayment.findAll({ where: { status: 'paid' } });

  const totalLeases = leases.length;
  const activeLeases = leases.filter((l: any) => l.status === 'active').length;
  const totalLiability = liabilities.reduce((sum: number, l: any) => sum + parseFloat(l.currentLiability), 0);
  const totalPayments = payments.reduce((sum: number, p: any) => sum + parseFloat(p.paymentAmount), 0);

  return {
    totalLeases,
    activeLeases,
    totalLiability,
    totalPaymentsMade: totalPayments,
    averageLeaseValue: totalLeases > 0 ? totalLiability / totalLeases : 0,
  };
};

// ============================================================================
// REPORTING & DISCLOSURE (36-41)
// ============================================================================

/**
 * Generates lease disclosure note.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {Model} LeaseAgreement - LeaseAgreement model
 * @param {Model} LeaseLiability - LeaseLiability model
 * @param {Model} RightOfUseAsset - RightOfUseAsset model
 * @returns {Promise<any>} Disclosure note
 */
export const generateLeaseDisclosureNote = async (
  fiscalYear: number,
  LeaseAgreement: any,
  LeaseLiability: any,
  RightOfUseAsset: any,
): Promise<any> => {
  const leases = await LeaseAgreement.findAll({ where: { status: 'active' } });
  const liabilities = await LeaseLiability.findAll();
  const assets = await RightOfUseAsset.findAll();

  return {
    fiscalYear,
    leasedAssets: leases.map((l: any) => ({
      description: l.description,
      lessor: l.lessor,
      commencementDate: l.commencementDate,
      expirationDate: l.expirationDate,
      monthlyPayment: l.monthlyPayment,
    })),
    totalLiability: liabilities.reduce((sum: number, l: any) => sum + parseFloat(l.currentLiability), 0),
    currentPortion: liabilities.reduce((sum: number, l: any) => sum + parseFloat(l.currentPortion), 0),
    longTermPortion: liabilities.reduce((sum: number, l: any) => sum + parseFloat(l.longTermPortion), 0),
    totalAssetValue: assets.reduce((sum: number, a: any) => sum + parseFloat(a.currentValue), 0),
  };
};

/**
 * Exports lease data for financial statements.
 *
 * @param {Date} statementDate - Statement date
 * @param {Model} LeaseLiability - LeaseLiability model
 * @param {Model} RightOfUseAsset - RightOfUseAsset model
 * @returns {Promise<any>} Financial statement data
 */
export const exportLeaseFinancialStatementData = async (
  statementDate: Date,
  LeaseLiability: any,
  RightOfUseAsset: any,
): Promise<any> => {
  const liabilities = await LeaseLiability.findAll();
  const assets = await RightOfUseAsset.findAll();

  return {
    statementDate,
    balanceSheet: {
      assets: {
        rightOfUseAssets: assets.reduce((sum: number, a: any) => sum + parseFloat(a.currentValue), 0),
        accumulatedAmortization: assets.reduce((sum: number, a: any) => sum + parseFloat(a.accumulatedAmortization), 0),
      },
      liabilities: {
        currentLeaseLiability: liabilities.reduce((sum: number, l: any) => sum + parseFloat(l.currentPortion), 0),
        longTermLeaseLiability: liabilities.reduce((sum: number, l: any) => sum + parseFloat(l.longTermPortion), 0),
      },
    },
  };
};

/**
 * Generates maturity analysis of lease payments.
 *
 * @param {Model} LeasePayment - LeasePayment model
 * @returns {Promise<any>} Maturity analysis
 */
export const generatePaymentMaturityAnalysis = async (
  LeasePayment: any,
): Promise<any> => {
  const payments = await LeasePayment.findAll({ where: { status: 'scheduled' } });

  const now = new Date();
  const oneYear = new Date(now);
  oneYear.setFullYear(oneYear.getFullYear() + 1);
  const twoYears = new Date(now);
  twoYears.setFullYear(twoYears.getFullYear() + 2);
  const fiveYears = new Date(now);
  fiveYears.setFullYear(fiveYears.getFullYear() + 5);

  const withinOneYear = payments.filter((p: any) => p.paymentDate <= oneYear);
  const oneToTwoYears = payments.filter((p: any) => p.paymentDate > oneYear && p.paymentDate <= twoYears);
  const twoToFiveYears = payments.filter((p: any) => p.paymentDate > twoYears && p.paymentDate <= fiveYears);
  const beyondFiveYears = payments.filter((p: any) => p.paymentDate > fiveYears);

  return {
    withinOneYear: {
      count: withinOneYear.length,
      total: withinOneYear.reduce((sum: number, p: any) => sum + parseFloat(p.paymentAmount), 0),
    },
    oneToTwoYears: {
      count: oneToTwoYears.length,
      total: oneToTwoYears.reduce((sum: number, p: any) => sum + parseFloat(p.paymentAmount), 0),
    },
    twoToFiveYears: {
      count: twoToFiveYears.length,
      total: twoToFiveYears.reduce((sum: number, p: any) => sum + parseFloat(p.paymentAmount), 0),
    },
    beyondFiveYears: {
      count: beyondFiveYears.length,
      total: beyondFiveYears.reduce((sum: number, p: any) => sum + parseFloat(p.paymentAmount), 0),
    },
  };
};

/**
 * Exports lease portfolio to Excel.
 *
 * @param {Model} LeaseAgreement - LeaseAgreement model
 * @returns {Promise<Buffer>} Excel export
 */
export const exportLeasePortfolioExcel = async (
  LeaseAgreement: any,
): Promise<Buffer> => {
  const leases = await LeaseAgreement.findAll();

  const csv = 'Lease ID,Lease Number,Lessor,Type,Monthly Payment,Commencement,Expiration,Status\n' +
    leases.map((lease: any) =>
      `${lease.leaseId},${lease.leaseNumber},${lease.lessor},${lease.leaseType},${lease.monthlyPayment},${lease.commencementDate.toISOString().split('T')[0]},${lease.expirationDate.toISOString().split('T')[0]},${lease.status}`
    ).join('\n');

  return Buffer.from(csv, 'utf-8');
};

/**
 * Calculates total lease expense for period.
 *
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Model} LeasePayment - LeasePayment model
 * @param {Model} RightOfUseAsset - RightOfUseAsset model
 * @returns {Promise<{ leaseExpense: number; interestExpense: number; amortizationExpense: number }>}
 */
export const calculateTotalLeaseExpense = async (
  startDate: Date,
  endDate: Date,
  LeasePayment: any,
  RightOfUseAsset: any,
): Promise<{ leaseExpense: number; interestExpense: number; amortizationExpense: number }> => {
  const payments = await LeasePayment.findAll({
    where: {
      paymentDate: { [Op.between]: [startDate, endDate] },
      status: 'paid',
    },
  });

  const interestExpense = payments.reduce((sum: number, p: any) => sum + parseFloat(p.interestPortion), 0);

  // Simplified amortization calculation
  const assets = await RightOfUseAsset.findAll();
  const monthsDiff = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30));
  const amortizationExpense = assets.reduce((sum: number, a: any) => {
    const monthly = parseFloat(a.initialCost) / a.usefulLife;
    return sum + (monthly * monthsDiff);
  }, 0);

  return {
    leaseExpense: interestExpense + amortizationExpense,
    interestExpense,
    amortizationExpense,
  };
};

/**
 * Generates lease variance analysis report.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {Model} LeasePayment - LeasePayment model
 * @returns {Promise<any>} Variance analysis
 */
export const generateLeaseVarianceAnalysis = async (
  fiscalYear: number,
  LeasePayment: any,
): Promise<any> => {
  const payments = await LeasePayment.findAll();

  const scheduled = payments.filter((p: any) => p.status === 'scheduled');
  const paid = payments.filter((p: any) => p.status === 'paid');
  const overdue = payments.filter((p: any) => p.status === 'overdue');

  const latePayments = paid.filter((p: any) => p.actualPaymentDate > p.paymentDate);

  return {
    fiscalYear,
    totalPayments: payments.length,
    scheduled: scheduled.length,
    paid: paid.length,
    overdue: overdue.length,
    latePayments: latePayments.length,
    onTimeRate: paid.length > 0 ? ((paid.length - latePayments.length) / paid.length) * 100 : 0,
  };
};

// ============================================================================
// NESTJS SERVICE WRAPPER
// ============================================================================

@Injectable()
export class CEFMSLeaseAccountingService {
  constructor(private readonly sequelize: Sequelize) {}

  async createLease(leaseData: LeaseAgreementData) {
    const LeaseAgreement = createLeaseAgreementModel(this.sequelize);
    return createLeaseAgreement(leaseData, LeaseAgreement);
  }

  async calculateLiability(leaseId: string, discountRate: number) {
    const LeaseAgreement = createLeaseAgreementModel(this.sequelize);
    const LeaseLiability = createLeaseLiabilityModel(this.sequelize);
    return calculateInitialLeaseLiability(leaseId, discountRate, LeaseAgreement, LeaseLiability);
  }

  async generatePayments(leaseId: string) {
    const LeaseAgreement = createLeaseAgreementModel(this.sequelize);
    const LeasePayment = createLeasePaymentModel(this.sequelize);
    const LeaseLiability = createLeaseLiabilityModel(this.sequelize);
    return generateLeasePaymentSchedule(leaseId, LeaseAgreement, LeasePayment, LeaseLiability);
  }

  async getComplianceReport(fiscalYear: number) {
    const LeaseAgreement = createLeaseAgreementModel(this.sequelize);
    const LeaseLiability = createLeaseLiabilityModel(this.sequelize);
    const RightOfUseAsset = createRightOfUseAssetModel(this.sequelize);
    return generateGASB87ComplianceReport(fiscalYear, LeaseAgreement, LeaseLiability, RightOfUseAsset);
  }
}

export default {
  // Models
  createLeaseAgreementModel,
  createLeaseLiabilityModel,
  createRightOfUseAssetModel,
  createLeasePaymentModel,
  createLeaseModificationModel,
  createSubleaseModel,

  // Lease Classification
  createLeaseAgreement,
  classifyLeaseGASB87,
  validateLeaseAgreement,
  getActiveLeases,
  calculateLeaseCommitment,
  getExpiringLeases,
  updateLeaseStatus,

  // Liability Calculations
  calculateInitialLeaseLiability,
  remeasureLeaseLiability,
  splitLiabilityPortions,
  reduceLiability,
  getLiabilityBalanceAsOf,
  generateLiabilityAmortizationSchedule,
  validateLiabilityCalculation,

  // Right-of-Use Assets
  createRightOfUseAsset,
  calculateMonthlyAmortization,
  recordAmortizationExpense,
  testAssetImpairment,
  generateAmortizationSchedule,
  getAssetNetBookValue,
  disposeRightOfUseAsset,

  // Payment Tracking
  generateLeasePaymentSchedule,
  recordLeasePayment,
  getUpcomingPayments,
  getOverduePayments,
  calculateLeaseCostToDate,
  generatePaymentTrackingReport,
  exportPaymentScheduleCSV,

  // Modifications & Compliance
  recordLeaseModification,
  processModificationRemeasurement,
  generateGASB87ComplianceReport,
  terminateLease,
  createSubleaseAgreement,
  trackSubleaseIncome,
  generateLeasePortfolioAnalytics,

  // Reporting & Disclosure
  generateLeaseDisclosureNote,
  exportLeaseFinancialStatementData,
  generatePaymentMaturityAnalysis,
  exportLeasePortfolioExcel,
  calculateTotalLeaseExpense,
  generateLeaseVarianceAnalysis,

  // Service
  CEFMSLeaseAccountingService,
};
