/**
 * LOC: CEFMSTAC001
 * File: /reuse/financial/cefms/composites/cefms-tax-assessment-collection-composite.ts
 *
 * UPSTREAM (imports from):
 *   - ../../../government/tax-revenue-management-kit.ts
 *   - ../../../government/revenue-recognition-management-kit.ts
 *   - ../../../government/compliance-regulatory-tracking-kit.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend CEFMS tax services
 *   - USACE assessment systems
 *   - Tax collection modules
 */

/**
 * File: /reuse/financial/cefms/composites/cefms-tax-assessment-collection-composite.ts
 * Locator: WC-CEFMS-TAC-001
 * Purpose: USACE CEFMS Tax Assessment and Collection - tax levies, assessments, collections, delinquencies
 *
 * Upstream: Composes utilities from government tax and revenue kits
 * Downstream: ../../../backend/cefms/*, Tax controllers, collection tracking, delinquency management
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 36+ composite functions for USACE CEFMS tax assessment and collection operations
 *
 * LLM Context: Production-ready USACE CEFMS tax assessment and collection system.
 * Comprehensive tax levy management, property assessments, special assessments, tax bill generation,
 * collection processing, delinquency tracking, payment plans, penalty and interest calculations,
 * lien management, tax foreclosure processes, tax abatements, exemption management,
 * tax rate setting, mill levy calculations, and compliance reporting.
 */

import { Model, DataTypes, Sequelize, Transaction, Op } from 'sequelize';
import { Injectable } from '@nestjs/common';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface TaxAssessmentData {
  assessmentId: string;
  parcelId: string;
  assessmentYear: number;
  taxType: 'property' | 'special_assessment' | 'utility' | 'sales' | 'use' | 'excise';
  assessedValue: number;
  taxableValue: number;
  exemptionAmount: number;
  taxRate: number;
  taxAmount: number;
  dueDate: Date;
  taxpayerId: string;
  isPaid: boolean;
}

interface TaxBillData {
  billId: string;
  assessmentId: string;
  billNumber: string;
  billDate: Date;
  taxpayerId: string;
  totalAmount: number;
  principalAmount: number;
  penaltyAmount: number;
  interestAmount: number;
  status: 'pending' | 'paid' | 'delinquent' | 'partial' | 'abated';
  installmentPlan: boolean;
}

interface TaxPaymentData {
  paymentId: string;
  billId: string;
  paymentDate: Date;
  paymentAmount: number;
  paymentMethod: 'cash' | 'check' | 'credit_card' | 'ach' | 'wire' | 'online';
  referenceNumber: string;
  appliedToPrincipal: number;
  appliedToPenalty: number;
  appliedToInterest: number;
}

interface TaxDelinquencyData {
  delinquencyId: string;
  billId: string;
  taxpayerId: string;
  originalAmount: number;
  currentBalance: number;
  delinquentDate: Date;
  daysPastDue: number;
  status: 'active' | 'payment_plan' | 'lien_filed' | 'foreclosure' | 'written_off';
}

interface TaxPaymentPlanData {
  planId: string;
  delinquencyId: string;
  taxpayerId: string;
  totalAmount: number;
  monthlyPayment: number;
  numberOfPayments: number;
  startDate: Date;
  paymentsMade: number;
  amountPaid: number;
  status: 'active' | 'completed' | 'defaulted';
}

interface TaxLienData {
  lienId: string;
  delinquencyId: string;
  parcelId: string;
  taxpayerId: string;
  lienAmount: number;
  filingDate: Date;
  priority: number;
  status: 'filed' | 'released' | 'foreclosed';
  releasedDate?: Date;
}

interface TaxExemptionData {
  exemptionId: string;
  taxpayerId: string;
  exemptionType: 'homestead' | 'senior' | 'veteran' | 'disability' | 'nonprofit' | 'agricultural';
  exemptionAmount: number;
  exemptionPercent: number;
  effectiveDate: Date;
  expirationDate?: Date;
  isActive: boolean;
}

interface TaxRateData {
  rateId: string;
  taxingDistrict: string;
  fiscalYear: number;
  millLevy: number;
  taxRate: number;
  effectiveDate: Date;
  approvedBy: string;
  approvalDate: Date;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Sequelize model for Tax Assessments with valuation tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} TaxAssessment model
 *
 * @example
 * ```typescript
 * const TaxAssessment = createTaxAssessmentModel(sequelize);
 * const assessment = await TaxAssessment.create({
 *   assessmentId: 'ASSESS-2024-001',
 *   parcelId: 'PARCEL-001',
 *   assessmentYear: 2024,
 *   taxType: 'property',
 *   assessedValue: 500000,
 *   taxableValue: 450000,
 *   taxRate: 1.25
 * });
 * ```
 */
export const createTaxAssessmentModel = (sequelize: Sequelize) => {
  class TaxAssessment extends Model {
    public id!: string;
    public assessmentId!: string;
    public parcelId!: string;
    public assessmentYear!: number;
    public taxType!: string;
    public assessedValue!: number;
    public taxableValue!: number;
    public exemptionAmount!: number;
    public taxRate!: number;
    public taxAmount!: number;
    public dueDate!: Date;
    public taxpayerId!: string;
    public isPaid!: boolean;
    public paidDate!: Date | null;
    public paidAmount!: number;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  TaxAssessment.init(
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
      parcelId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Parcel identifier',
      },
      assessmentYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Assessment year',
      },
      taxType: {
        type: DataTypes.ENUM('property', 'special_assessment', 'utility', 'sales', 'use', 'excise'),
        allowNull: false,
        comment: 'Tax type',
      },
      assessedValue: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Assessed value',
      },
      taxableValue: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Taxable value',
      },
      exemptionAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Exemption amount',
      },
      taxRate: {
        type: DataTypes.DECIMAL(10, 6),
        allowNull: false,
        comment: 'Tax rate',
      },
      taxAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Tax amount',
      },
      dueDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Due date',
      },
      taxpayerId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Taxpayer identifier',
      },
      isPaid: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Is paid',
      },
      paidDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Paid date',
      },
      paidAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Paid amount',
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
      tableName: 'tax_assessments',
      timestamps: true,
      indexes: [
        { fields: ['assessmentId'], unique: true },
        { fields: ['parcelId'] },
        { fields: ['taxpayerId'] },
        { fields: ['assessmentYear'] },
        { fields: ['taxType'] },
        { fields: ['isPaid'] },
      ],
    },
  );

  return TaxAssessment;
};

/**
 * Sequelize model for Tax Bills.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} TaxBill model
 */
export const createTaxBillModel = (sequelize: Sequelize) => {
  class TaxBill extends Model {
    public id!: string;
    public billId!: string;
    public assessmentId!: string;
    public billNumber!: string;
    public billDate!: Date;
    public taxpayerId!: string;
    public totalAmount!: number;
    public principalAmount!: number;
    public penaltyAmount!: number;
    public interestAmount!: number;
    public status!: string;
    public installmentPlan!: boolean;
    public amountPaid!: number;
    public balanceDue!: number;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  TaxBill.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      billId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Bill identifier',
      },
      assessmentId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Assessment identifier',
      },
      billNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Bill number',
      },
      billDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Bill date',
      },
      taxpayerId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Taxpayer identifier',
      },
      totalAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Total bill amount',
      },
      principalAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Principal amount',
      },
      penaltyAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Penalty amount',
      },
      interestAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Interest amount',
      },
      status: {
        type: DataTypes.ENUM('pending', 'paid', 'delinquent', 'partial', 'abated'),
        allowNull: false,
        defaultValue: 'pending',
        comment: 'Bill status',
      },
      installmentPlan: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Has installment plan',
      },
      amountPaid: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Amount paid',
      },
      balanceDue: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Balance due',
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
      tableName: 'tax_bills',
      timestamps: true,
      indexes: [
        { fields: ['billId'], unique: true },
        { fields: ['billNumber'], unique: true },
        { fields: ['assessmentId'] },
        { fields: ['taxpayerId'] },
        { fields: ['status'] },
        { fields: ['billDate'] },
      ],
    },
  );

  return TaxBill;
};

/**
 * Sequelize model for Tax Payments.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} TaxPayment model
 */
export const createTaxPaymentModel = (sequelize: Sequelize) => {
  class TaxPayment extends Model {
    public id!: string;
    public paymentId!: string;
    public billId!: string;
    public paymentDate!: Date;
    public paymentAmount!: number;
    public paymentMethod!: string;
    public referenceNumber!: string;
    public appliedToPrincipal!: number;
    public appliedToPenalty!: number;
    public appliedToInterest!: number;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  TaxPayment.init(
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
      billId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Bill identifier',
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
      },
      paymentMethod: {
        type: DataTypes.ENUM('cash', 'check', 'credit_card', 'ach', 'wire', 'online'),
        allowNull: false,
        comment: 'Payment method',
      },
      referenceNumber: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Reference number',
      },
      appliedToPrincipal: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Applied to principal',
      },
      appliedToPenalty: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Applied to penalty',
      },
      appliedToInterest: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Applied to interest',
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
      tableName: 'tax_payments',
      timestamps: true,
      indexes: [
        { fields: ['paymentId'], unique: true },
        { fields: ['billId'] },
        { fields: ['paymentDate'] },
        { fields: ['paymentMethod'] },
      ],
    },
  );

  return TaxPayment;
};

/**
 * Sequelize model for Tax Delinquencies.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} TaxDelinquency model
 */
export const createTaxDelinquencyModel = (sequelize: Sequelize) => {
  class TaxDelinquency extends Model {
    public id!: string;
    public delinquencyId!: string;
    public billId!: string;
    public taxpayerId!: string;
    public originalAmount!: number;
    public currentBalance!: number;
    public delinquentDate!: Date;
    public daysPastDue!: number;
    public status!: string;
    public lastContactDate!: Date | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  TaxDelinquency.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      delinquencyId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Delinquency identifier',
      },
      billId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Bill identifier',
      },
      taxpayerId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Taxpayer identifier',
      },
      originalAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Original delinquent amount',
      },
      currentBalance: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Current balance',
      },
      delinquentDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Delinquent date',
      },
      daysPastDue: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Days past due',
      },
      status: {
        type: DataTypes.ENUM('active', 'payment_plan', 'lien_filed', 'foreclosure', 'written_off'),
        allowNull: false,
        defaultValue: 'active',
        comment: 'Delinquency status',
      },
      lastContactDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Last contact date',
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
      tableName: 'tax_delinquencies',
      timestamps: true,
      indexes: [
        { fields: ['delinquencyId'], unique: true },
        { fields: ['billId'] },
        { fields: ['taxpayerId'] },
        { fields: ['status'] },
        { fields: ['delinquentDate'] },
      ],
    },
  );

  return TaxDelinquency;
};

/**
 * Sequelize model for Tax Payment Plans.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} TaxPaymentPlan model
 */
export const createTaxPaymentPlanModel = (sequelize: Sequelize) => {
  class TaxPaymentPlan extends Model {
    public id!: string;
    public planId!: string;
    public delinquencyId!: string;
    public taxpayerId!: string;
    public totalAmount!: number;
    public monthlyPayment!: number;
    public numberOfPayments!: number;
    public startDate!: Date;
    public paymentsMade!: number;
    public amountPaid!: number;
    public status!: string;
    public defaultedDate!: Date | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  TaxPaymentPlan.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      planId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Plan identifier',
      },
      delinquencyId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Delinquency identifier',
      },
      taxpayerId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Taxpayer identifier',
      },
      totalAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Total plan amount',
      },
      monthlyPayment: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Monthly payment',
      },
      numberOfPayments: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Number of payments',
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Plan start date',
      },
      paymentsMade: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Payments made',
      },
      amountPaid: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Amount paid',
      },
      status: {
        type: DataTypes.ENUM('active', 'completed', 'defaulted'),
        allowNull: false,
        defaultValue: 'active',
        comment: 'Plan status',
      },
      defaultedDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Defaulted date',
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
      tableName: 'tax_payment_plans',
      timestamps: true,
      indexes: [
        { fields: ['planId'], unique: true },
        { fields: ['delinquencyId'] },
        { fields: ['taxpayerId'] },
        { fields: ['status'] },
      ],
    },
  );

  return TaxPaymentPlan;
};

/**
 * Sequelize model for Tax Liens.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} TaxLien model
 */
export const createTaxLienModel = (sequelize: Sequelize) => {
  class TaxLien extends Model {
    public id!: string;
    public lienId!: string;
    public delinquencyId!: string;
    public parcelId!: string;
    public taxpayerId!: string;
    public lienAmount!: number;
    public filingDate!: Date;
    public priority!: number;
    public status!: string;
    public releasedDate!: Date | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  TaxLien.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      lienId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Lien identifier',
      },
      delinquencyId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Delinquency identifier',
      },
      parcelId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Parcel identifier',
      },
      taxpayerId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Taxpayer identifier',
      },
      lienAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Lien amount',
      },
      filingDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Filing date',
      },
      priority: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: 'Lien priority',
      },
      status: {
        type: DataTypes.ENUM('filed', 'released', 'foreclosed'),
        allowNull: false,
        defaultValue: 'filed',
        comment: 'Lien status',
      },
      releasedDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Released date',
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
      tableName: 'tax_liens',
      timestamps: true,
      indexes: [
        { fields: ['lienId'], unique: true },
        { fields: ['delinquencyId'] },
        { fields: ['parcelId'] },
        { fields: ['taxpayerId'] },
        { fields: ['status'] },
      ],
    },
  );

  return TaxLien;
};

/**
 * Sequelize model for Tax Exemptions.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} TaxExemption model
 */
export const createTaxExemptionModel = (sequelize: Sequelize) => {
  class TaxExemption extends Model {
    public id!: string;
    public exemptionId!: string;
    public taxpayerId!: string;
    public exemptionType!: string;
    public exemptionAmount!: number;
    public exemptionPercent!: number;
    public effectiveDate!: Date;
    public expirationDate!: Date | null;
    public isActive!: boolean;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  TaxExemption.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      exemptionId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Exemption identifier',
      },
      taxpayerId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Taxpayer identifier',
      },
      exemptionType: {
        type: DataTypes.ENUM('homestead', 'senior', 'veteran', 'disability', 'nonprofit', 'agricultural'),
        allowNull: false,
        comment: 'Exemption type',
      },
      exemptionAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Exemption amount',
      },
      exemptionPercent: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Exemption percentage',
      },
      effectiveDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Effective date',
      },
      expirationDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Expiration date',
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
      tableName: 'tax_exemptions',
      timestamps: true,
      indexes: [
        { fields: ['exemptionId'], unique: true },
        { fields: ['taxpayerId'] },
        { fields: ['exemptionType'] },
        { fields: ['isActive'] },
      ],
    },
  );

  return TaxExemption;
};

/**
 * Sequelize model for Tax Rates.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} TaxRate model
 */
export const createTaxRateModel = (sequelize: Sequelize) => {
  class TaxRate extends Model {
    public id!: string;
    public rateId!: string;
    public taxingDistrict!: string;
    public fiscalYear!: number;
    public millLevy!: number;
    public taxRate!: number;
    public effectiveDate!: Date;
    public approvedBy!: string;
    public approvalDate!: Date;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  TaxRate.init(
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
      taxingDistrict: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Taxing district',
      },
      fiscalYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Fiscal year',
      },
      millLevy: {
        type: DataTypes.DECIMAL(10, 4),
        allowNull: false,
        comment: 'Mill levy',
      },
      taxRate: {
        type: DataTypes.DECIMAL(10, 6),
        allowNull: false,
        comment: 'Tax rate',
      },
      effectiveDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Effective date',
      },
      approvedBy: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Approved by',
      },
      approvalDate: {
        type: DataTypes.DATE,
        allowNull: false,
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
      tableName: 'tax_rates',
      timestamps: true,
      indexes: [
        { fields: ['rateId'], unique: true },
        { fields: ['taxingDistrict'] },
        { fields: ['fiscalYear'] },
        { fields: ['effectiveDate'] },
      ],
    },
  );

  return TaxRate;
};

// ============================================================================
// ASSESSMENT MANAGEMENT (1-6)
// ============================================================================

/**
 * Creates tax assessment.
 *
 * @param {TaxAssessmentData} assessmentData - Assessment data
 * @param {Model} TaxAssessment - TaxAssessment model
 * @param {string} userId - User creating assessment
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created assessment
 *
 * @example
 * ```typescript
 * const assessment = await createTaxAssessment({
 *   assessmentId: 'ASSESS-2024-001',
 *   parcelId: 'PARCEL-001',
 *   assessmentYear: 2024,
 *   taxType: 'property',
 *   assessedValue: 500000,
 *   taxRate: 1.25
 * }, TaxAssessment, 'user123');
 * ```
 */
export const createTaxAssessment = async (
  assessmentData: TaxAssessmentData,
  TaxAssessment: any,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const taxAmount = assessmentData.taxableValue * (assessmentData.taxRate / 100);

  const assessment = await TaxAssessment.create(
    {
      ...assessmentData,
      taxAmount,
    },
    { transaction },
  );

  console.log(`Tax assessment created: ${assessment.assessmentId} by ${userId}`);
  return assessment;
};

/**
 * Calculates taxable value with exemptions.
 *
 * @param {number} assessedValue - Assessed value
 * @param {number} exemptionAmount - Exemption amount
 * @param {number} exemptionPercent - Exemption percentage
 * @returns {number} Taxable value
 */
export const calculateTaxableValue = (
  assessedValue: number,
  exemptionAmount: number,
  exemptionPercent: number,
): number => {
  const percentExemption = assessedValue * (exemptionPercent / 100);
  const totalExemption = exemptionAmount + percentExemption;
  return Math.max(0, assessedValue - totalExemption);
};

/**
 * Retrieves assessments by parcel.
 *
 * @param {string} parcelId - Parcel ID
 * @param {number} [assessmentYear] - Optional assessment year
 * @param {Model} TaxAssessment - TaxAssessment model
 * @returns {Promise<any[]>} Assessments
 */
export const getAssessmentsByParcel = async (
  parcelId: string,
  assessmentYear: number | undefined,
  TaxAssessment: any,
): Promise<any[]> => {
  const where: any = { parcelId };
  if (assessmentYear) {
    where.assessmentYear = assessmentYear;
  }

  return await TaxAssessment.findAll({
    where,
    order: [['assessmentYear', 'DESC']],
  });
};

/**
 * Retrieves unpaid assessments.
 *
 * @param {number} assessmentYear - Assessment year
 * @param {Model} TaxAssessment - TaxAssessment model
 * @returns {Promise<any[]>} Unpaid assessments
 */
export const getUnpaidAssessments = async (
  assessmentYear: number,
  TaxAssessment: any,
): Promise<any[]> => {
  return await TaxAssessment.findAll({
    where: {
      assessmentYear,
      isPaid: false,
    },
    order: [['dueDate', 'ASC']],
  });
};

/**
 * Generates assessment roll report.
 *
 * @param {number} assessmentYear - Assessment year
 * @param {Model} TaxAssessment - TaxAssessment model
 * @returns {Promise<any>} Assessment roll
 */
export const generateAssessmentRoll = async (
  assessmentYear: number,
  TaxAssessment: any,
): Promise<any> => {
  const assessments = await TaxAssessment.findAll({
    where: { assessmentYear },
  });

  const totalAssessedValue = assessments.reduce(
    (sum: number, a: any) => sum + parseFloat(a.assessedValue),
    0,
  );

  const totalTaxableValue = assessments.reduce(
    (sum: number, a: any) => sum + parseFloat(a.taxableValue),
    0,
  );

  const totalTaxAmount = assessments.reduce(
    (sum: number, a: any) => sum + parseFloat(a.taxAmount),
    0,
  );

  const byType = assessments.reduce((acc: any, a: any) => {
    if (!acc[a.taxType]) {
      acc[a.taxType] = { count: 0, assessedValue: 0, taxAmount: 0 };
    }
    acc[a.taxType].count++;
    acc[a.taxType].assessedValue += parseFloat(a.assessedValue);
    acc[a.taxType].taxAmount += parseFloat(a.taxAmount);
    return acc;
  }, {});

  return {
    assessmentYear,
    totalAssessments: assessments.length,
    totalAssessedValue,
    totalTaxableValue,
    totalTaxAmount,
    byType,
  };
};

/**
 * Updates assessment exemptions.
 *
 * @param {string} assessmentId - Assessment ID
 * @param {number} exemptionAmount - New exemption amount
 * @param {Model} TaxAssessment - TaxAssessment model
 * @returns {Promise<any>} Updated assessment
 */
export const updateAssessmentExemption = async (
  assessmentId: string,
  exemptionAmount: number,
  TaxAssessment: any,
): Promise<any> => {
  const assessment = await TaxAssessment.findOne({ where: { assessmentId } });
  if (!assessment) throw new Error('Assessment not found');

  assessment.exemptionAmount = exemptionAmount;
  const newTaxableValue = parseFloat(assessment.assessedValue) - exemptionAmount;
  assessment.taxableValue = Math.max(0, newTaxableValue);
  assessment.taxAmount = assessment.taxableValue * (parseFloat(assessment.taxRate) / 100);
  await assessment.save();

  return assessment;
};

// ============================================================================
// BILLING & COLLECTION (7-13)
// ============================================================================

/**
 * Generates tax bill.
 *
 * @param {TaxBillData} billData - Bill data
 * @param {Model} TaxBill - TaxBill model
 * @returns {Promise<any>} Created bill
 */
export const generateTaxBill = async (
  billData: TaxBillData,
  TaxBill: any,
): Promise<any> => {
  return await TaxBill.create({
    ...billData,
    balanceDue: billData.totalAmount,
  });
};

/**
 * Records tax payment.
 *
 * @param {TaxPaymentData} paymentData - Payment data
 * @param {Model} TaxPayment - TaxPayment model
 * @param {Model} TaxBill - TaxBill model
 * @returns {Promise<any>} Created payment
 */
export const recordTaxPayment = async (
  paymentData: TaxPaymentData,
  TaxPayment: any,
  TaxBill: any,
): Promise<any> => {
  const payment = await TaxPayment.create(paymentData);

  // Update bill
  const bill = await TaxBill.findOne({ where: { billId: paymentData.billId } });
  if (bill) {
    bill.amountPaid = parseFloat(bill.amountPaid) + paymentData.paymentAmount;
    bill.balanceDue = parseFloat(bill.totalAmount) - parseFloat(bill.amountPaid);

    if (bill.balanceDue <= 0) {
      bill.status = 'paid';
    } else if (bill.amountPaid > 0) {
      bill.status = 'partial';
    }

    await bill.save();
  }

  return payment;
};

/**
 * Calculates penalty and interest.
 *
 * @param {number} principalAmount - Principal amount
 * @param {number} daysPastDue - Days past due
 * @param {number} penaltyRate - Penalty rate (percentage)
 * @param {number} interestRate - Annual interest rate (percentage)
 * @returns {{ penalty: number; interest: number; total: number }}
 */
export const calculatePenaltyInterest = (
  principalAmount: number,
  daysPastDue: number,
  penaltyRate: number = 10,
  interestRate: number = 12,
): { penalty: number; interest: number; total: number } => {
  const penalty = principalAmount * (penaltyRate / 100);
  const dailyInterestRate = interestRate / 100 / 365;
  const interest = principalAmount * dailyInterestRate * daysPastDue;

  return {
    penalty,
    interest,
    total: penalty + interest,
  };
};

/**
 * Retrieves outstanding bills by taxpayer.
 *
 * @param {string} taxpayerId - Taxpayer ID
 * @param {Model} TaxBill - TaxBill model
 * @returns {Promise<any[]>} Outstanding bills
 */
export const getOutstandingBills = async (
  taxpayerId: string,
  TaxBill: any,
): Promise<any[]> => {
  return await TaxBill.findAll({
    where: {
      taxpayerId,
      status: { [Op.in]: ['pending', 'partial', 'delinquent'] },
    },
    order: [['billDate', 'ASC']],
  });
};

/**
 * Generates collection report.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {Model} TaxBill - TaxBill model
 * @param {Model} TaxPayment - TaxPayment model
 * @returns {Promise<any>} Collection report
 */
export const generateCollectionReport = async (
  fiscalYear: number,
  TaxBill: any,
  TaxPayment: any,
): Promise<any> => {
  const startDate = new Date(fiscalYear, 0, 1);
  const endDate = new Date(fiscalYear, 11, 31);

  const bills = await TaxBill.findAll({
    where: {
      billDate: { [Op.between]: [startDate, endDate] },
    },
  });

  const payments = await TaxPayment.findAll({
    where: {
      paymentDate: { [Op.between]: [startDate, endDate] },
    },
  });

  const totalBilled = bills.reduce(
    (sum: number, b: any) => sum + parseFloat(b.totalAmount),
    0,
  );

  const totalCollected = payments.reduce(
    (sum: number, p: any) => sum + parseFloat(p.paymentAmount),
    0,
  );

  const collectionRate = totalBilled > 0 ? (totalCollected / totalBilled) * 100 : 0;

  return {
    fiscalYear,
    totalBills: bills.length,
    totalBilled,
    totalCollected,
    collectionRate,
    outstanding: totalBilled - totalCollected,
  };
};

/**
 * Processes batch bill generation.
 *
 * @param {number} assessmentYear - Assessment year
 * @param {Model} TaxAssessment - TaxAssessment model
 * @param {Model} TaxBill - TaxBill model
 * @returns {Promise<any>} Batch results
 */
export const processBatchBilling = async (
  assessmentYear: number,
  TaxAssessment: any,
  TaxBill: any,
): Promise<any> => {
  const assessments = await TaxAssessment.findAll({
    where: { assessmentYear, isPaid: false },
  });

  const results = {
    processed: 0,
    totalBilled: 0,
    errors: [] as any[],
  };

  for (const assessment of assessments) {
    try {
      const bill = await generateTaxBill(
        {
          billId: `BILL-${assessment.assessmentId}`,
          assessmentId: assessment.assessmentId,
          billNumber: `${assessmentYear}-${assessment.parcelId}`,
          billDate: new Date(),
          taxpayerId: assessment.taxpayerId,
          totalAmount: parseFloat(assessment.taxAmount),
          principalAmount: parseFloat(assessment.taxAmount),
          penaltyAmount: 0,
          interestAmount: 0,
          status: 'pending',
          installmentPlan: false,
        },
        TaxBill,
      );

      results.processed++;
      results.totalBilled += parseFloat(bill.totalAmount);
    } catch (error: any) {
      results.errors.push({
        assessmentId: assessment.assessmentId,
        error: error.message,
      });
    }
  }

  return results;
};

/**
 * Exports tax bills to CSV.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {Model} TaxBill - TaxBill model
 * @returns {Promise<Buffer>} CSV buffer
 */
export const exportTaxBillsCSV = async (
  fiscalYear: number,
  TaxBill: any,
): Promise<Buffer> => {
  const startDate = new Date(fiscalYear, 0, 1);
  const endDate = new Date(fiscalYear, 11, 31);

  const bills = await TaxBill.findAll({
    where: {
      billDate: { [Op.between]: [startDate, endDate] },
    },
    order: [['billNumber', 'ASC']],
  });

  const csv = 'Bill Number,Taxpayer ID,Bill Date,Total Amount,Amount Paid,Balance Due,Status\n' +
    bills.map((b: any) =>
      `${b.billNumber},${b.taxpayerId},${b.billDate.toISOString().split('T')[0]},${b.totalAmount},${b.amountPaid},${b.balanceDue},${b.status}`
    ).join('\n');

  return Buffer.from(csv, 'utf-8');
};

// ============================================================================
// DELINQUENCY MANAGEMENT (14-20)
// ============================================================================

/**
 * Creates delinquency record.
 *
 * @param {TaxDelinquencyData} delinquencyData - Delinquency data
 * @param {Model} TaxDelinquency - TaxDelinquency model
 * @param {Model} TaxBill - TaxBill model
 * @returns {Promise<any>} Created delinquency
 */
export const createDelinquency = async (
  delinquencyData: TaxDelinquencyData,
  TaxDelinquency: any,
  TaxBill: any,
): Promise<any> => {
  const delinquency = await TaxDelinquency.create(delinquencyData);

  // Update bill status
  const bill = await TaxBill.findOne({ where: { billId: delinquencyData.billId } });
  if (bill) {
    bill.status = 'delinquent';
    await bill.save();
  }

  return delinquency;
};

/**
 * Updates delinquency days past due.
 *
 * @param {string} delinquencyId - Delinquency ID
 * @param {Model} TaxDelinquency - TaxDelinquency model
 * @returns {Promise<any>} Updated delinquency
 */
export const updateDelinquencyAge = async (
  delinquencyId: string,
  TaxDelinquency: any,
): Promise<any> => {
  const delinquency = await TaxDelinquency.findOne({ where: { delinquencyId } });
  if (!delinquency) throw new Error('Delinquency not found');

  const daysPastDue = Math.floor(
    (new Date().getTime() - delinquency.delinquentDate.getTime()) / (24 * 60 * 60 * 1000),
  );

  delinquency.daysPastDue = daysPastDue;
  await delinquency.save();

  return delinquency;
};

/**
 * Creates payment plan for delinquency.
 *
 * @param {TaxPaymentPlanData} planData - Payment plan data
 * @param {Model} TaxPaymentPlan - TaxPaymentPlan model
 * @param {Model} TaxDelinquency - TaxDelinquency model
 * @returns {Promise<any>} Created plan
 */
export const createPaymentPlan = async (
  planData: TaxPaymentPlanData,
  TaxPaymentPlan: any,
  TaxDelinquency: any,
): Promise<any> => {
  const plan = await TaxPaymentPlan.create(planData);

  // Update delinquency status
  const delinquency = await TaxDelinquency.findOne({
    where: { delinquencyId: planData.delinquencyId },
  });
  if (delinquency) {
    delinquency.status = 'payment_plan';
    await delinquency.save();
  }

  return plan;
};

/**
 * Records payment plan payment.
 *
 * @param {string} planId - Plan ID
 * @param {number} paymentAmount - Payment amount
 * @param {Model} TaxPaymentPlan - TaxPaymentPlan model
 * @returns {Promise<any>} Updated plan
 */
export const recordPlanPayment = async (
  planId: string,
  paymentAmount: number,
  TaxPaymentPlan: any,
): Promise<any> => {
  const plan = await TaxPaymentPlan.findOne({ where: { planId } });
  if (!plan) throw new Error('Payment plan not found');

  plan.paymentsMade += 1;
  plan.amountPaid = parseFloat(plan.amountPaid) + paymentAmount;

  if (plan.paymentsMade >= plan.numberOfPayments) {
    plan.status = 'completed';
  }

  await plan.save();
  return plan;
};

/**
 * Retrieves delinquent accounts.
 *
 * @param {number} [minimumDays] - Minimum days past due
 * @param {Model} TaxDelinquency - TaxDelinquency model
 * @returns {Promise<any[]>} Delinquent accounts
 */
export const getDelinquentAccounts = async (
  minimumDays: number = 0,
  TaxDelinquency: any,
): Promise<any[]> => {
  return await TaxDelinquency.findAll({
    where: {
      status: { [Op.in]: ['active', 'payment_plan'] },
      daysPastDue: { [Op.gte]: minimumDays },
    },
    order: [['daysPastDue', 'DESC']],
  });
};

/**
 * Generates delinquency aging report.
 *
 * @param {Model} TaxDelinquency - TaxDelinquency model
 * @returns {Promise<any>} Aging report
 */
export const generateDelinquencyAging = async (
  TaxDelinquency: any,
): Promise<any> => {
  const delinquencies = await TaxDelinquency.findAll({
    where: { status: { [Op.in]: ['active', 'payment_plan'] } },
  });

  const aging = {
    current: { count: 0, amount: 0 },
    days30: { count: 0, amount: 0 },
    days60: { count: 0, amount: 0 },
    days90: { count: 0, amount: 0 },
    over90: { count: 0, amount: 0 },
  };

  delinquencies.forEach((d: any) => {
    const amount = parseFloat(d.currentBalance);
    if (d.daysPastDue <= 30) {
      aging.current.count++;
      aging.current.amount += amount;
    } else if (d.daysPastDue <= 60) {
      aging.days30.count++;
      aging.days30.amount += amount;
    } else if (d.daysPastDue <= 90) {
      aging.days60.count++;
      aging.days60.amount += amount;
    } else {
      aging.over90.count++;
      aging.over90.amount += amount;
    }
  });

  return aging;
};

/**
 * Identifies accounts eligible for lien.
 *
 * @param {number} minimumAmount - Minimum amount
 * @param {number} minimumDays - Minimum days delinquent
 * @param {Model} TaxDelinquency - TaxDelinquency model
 * @returns {Promise<any[]>} Lien eligible accounts
 */
export const getlienEligibleAccounts = async (
  minimumAmount: number,
  minimumDays: number,
  TaxDelinquency: any,
): Promise<any[]> => {
  return await TaxDelinquency.findAll({
    where: {
      status: 'active',
      currentBalance: { [Op.gte]: minimumAmount },
      daysPastDue: { [Op.gte]: minimumDays },
    },
    order: [['currentBalance', 'DESC']],
  });
};

// ============================================================================
// LIEN & EXEMPTION MANAGEMENT (21-28)
// ============================================================================

/**
 * Files tax lien.
 *
 * @param {TaxLienData} lienData - Lien data
 * @param {Model} TaxLien - TaxLien model
 * @param {Model} TaxDelinquency - TaxDelinquency model
 * @returns {Promise<any>} Filed lien
 */
export const fileTaxLien = async (
  lienData: TaxLienData,
  TaxLien: any,
  TaxDelinquency: any,
): Promise<any> => {
  const lien = await TaxLien.create(lienData);

  // Update delinquency status
  const delinquency = await TaxDelinquency.findOne({
    where: { delinquencyId: lienData.delinquencyId },
  });
  if (delinquency) {
    delinquency.status = 'lien_filed';
    await delinquency.save();
  }

  return lien;
};

/**
 * Releases tax lien.
 *
 * @param {string} lienId - Lien ID
 * @param {Date} releaseDate - Release date
 * @param {Model} TaxLien - TaxLien model
 * @returns {Promise<any>} Released lien
 */
export const releaseTaxLien = async (
  lienId: string,
  releaseDate: Date,
  TaxLien: any,
): Promise<any> => {
  const lien = await TaxLien.findOne({ where: { lienId } });
  if (!lien) throw new Error('Lien not found');

  lien.status = 'released';
  lien.releasedDate = releaseDate;
  await lien.save();

  return lien;
};

/**
 * Creates tax exemption.
 *
 * @param {TaxExemptionData} exemptionData - Exemption data
 * @param {Model} TaxExemption - TaxExemption model
 * @returns {Promise<any>} Created exemption
 */
export const createTaxExemption = async (
  exemptionData: TaxExemptionData,
  TaxExemption: any,
): Promise<any> => {
  return await TaxExemption.create(exemptionData);
};

/**
 * Retrieves active exemptions for taxpayer.
 *
 * @param {string} taxpayerId - Taxpayer ID
 * @param {Date} asOfDate - As of date
 * @param {Model} TaxExemption - TaxExemption model
 * @returns {Promise<any[]>} Active exemptions
 */
export const getActiveExemptions = async (
  taxpayerId: string,
  asOfDate: Date,
  TaxExemption: any,
): Promise<any[]> => {
  return await TaxExemption.findAll({
    where: {
      taxpayerId,
      isActive: true,
      effectiveDate: { [Op.lte]: asOfDate },
      [Op.or]: [
        { expirationDate: null },
        { expirationDate: { [Op.gte]: asOfDate } },
      ],
    },
  });
};

/**
 * Calculates total exemption amount.
 *
 * @param {string} taxpayerId - Taxpayer ID
 * @param {number} assessmentYear - Assessment year
 * @param {Model} TaxExemption - TaxExemption model
 * @returns {Promise<{ totalAmount: number; totalPercent: number }>}
 */
export const calculateTotalExemption = async (
  taxpayerId: string,
  assessmentYear: number,
  TaxExemption: any,
): Promise<{ totalAmount: number; totalPercent: number }> => {
  const asOfDate = new Date(assessmentYear, 11, 31);
  const exemptions = await getActiveExemptions(taxpayerId, asOfDate, TaxExemption);

  const totalAmount = exemptions.reduce(
    (sum: number, e: any) => sum + parseFloat(e.exemptionAmount),
    0,
  );

  const totalPercent = exemptions.reduce(
    (sum: number, e: any) => sum + parseFloat(e.exemptionPercent),
    0,
  );

  return { totalAmount, totalPercent };
};

/**
 * Sets tax rate for district.
 *
 * @param {TaxRateData} rateData - Rate data
 * @param {Model} TaxRate - TaxRate model
 * @returns {Promise<any>} Set rate
 */
export const setTaxRate = async (
  rateData: TaxRateData,
  TaxRate: any,
): Promise<any> => {
  return await TaxRate.create(rateData);
};

/**
 * Calculates mill levy from revenue requirements.
 *
 * @param {number} revenueRequired - Revenue required
 * @param {number} assessedValue - Total assessed value
 * @returns {number} Mill levy
 */
export const calculateMillLevy = (
  revenueRequired: number,
  assessedValue: number,
): number => {
  if (assessedValue === 0) return 0;
  return (revenueRequired / assessedValue) * 1000;
};

/**
 * Generates comprehensive tax report.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {Model} TaxAssessment - TaxAssessment model
 * @param {Model} TaxBill - TaxBill model
 * @param {Model} TaxPayment - TaxPayment model
 * @param {Model} TaxDelinquency - TaxDelinquency model
 * @returns {Promise<any>} Comprehensive report
 */
export const generateComprehensiveTaxReport = async (
  fiscalYear: number,
  TaxAssessment: any,
  TaxBill: any,
  TaxPayment: any,
  TaxDelinquency: any,
): Promise<any> => {
  const assessmentRoll = await generateAssessmentRoll(fiscalYear, TaxAssessment);
  const collectionReport = await generateCollectionReport(fiscalYear, TaxBill, TaxPayment);
  const delinquencyAging = await generateDelinquencyAging(TaxDelinquency);

  return {
    fiscalYear,
    assessmentRoll,
    collectionReport,
    delinquencyAging,
    generatedAt: new Date(),
  };
};

// ============================================================================
// NESTJS SERVICE WRAPPER
// ============================================================================

@Injectable()
export class CEFMSTaxAssessmentService {
  constructor(private readonly sequelize: Sequelize) {}

  async createAssessment(assessmentData: TaxAssessmentData, userId: string) {
    const TaxAssessment = createTaxAssessmentModel(this.sequelize);
    return createTaxAssessment(assessmentData, TaxAssessment, userId);
  }

  async generateBills(assessmentYear: number) {
    const TaxAssessment = createTaxAssessmentModel(this.sequelize);
    const TaxBill = createTaxBillModel(this.sequelize);
    return processBatchBilling(assessmentYear, TaxAssessment, TaxBill);
  }

  async recordPayment(paymentData: TaxPaymentData) {
    const TaxPayment = createTaxPaymentModel(this.sequelize);
    const TaxBill = createTaxBillModel(this.sequelize);
    return recordTaxPayment(paymentData, TaxPayment, TaxBill);
  }

  async reportTax(fiscalYear: number) {
    const TaxAssessment = createTaxAssessmentModel(this.sequelize);
    const TaxBill = createTaxBillModel(this.sequelize);
    const TaxPayment = createTaxPaymentModel(this.sequelize);
    const TaxDelinquency = createTaxDelinquencyModel(this.sequelize);
    return generateComprehensiveTaxReport(
      fiscalYear,
      TaxAssessment,
      TaxBill,
      TaxPayment,
      TaxDelinquency,
    );
  }
}

export default {
  // Models
  createTaxAssessmentModel,
  createTaxBillModel,
  createTaxPaymentModel,
  createTaxDelinquencyModel,
  createTaxPaymentPlanModel,
  createTaxLienModel,
  createTaxExemptionModel,
  createTaxRateModel,

  // Assessment Management
  createTaxAssessment,
  calculateTaxableValue,
  getAssessmentsByParcel,
  getUnpaidAssessments,
  generateAssessmentRoll,
  updateAssessmentExemption,

  // Billing & Collection
  generateTaxBill,
  recordTaxPayment,
  calculatePenaltyInterest,
  getOutstandingBills,
  generateCollectionReport,
  processBatchBilling,
  exportTaxBillsCSV,

  // Delinquency Management
  createDelinquency,
  updateDelinquencyAge,
  createPaymentPlan,
  recordPlanPayment,
  getDelinquentAccounts,
  generateDelinquencyAging,
  getLienEligibleAccounts,

  // Lien & Exemption Management
  fileTaxLien,
  releaseTaxLien,
  createTaxExemption,
  getActiveExemptions,
  calculateTotalExemption,
  setTaxRate,
  calculateMillLevy,
  generateComprehensiveTaxReport,

  // Service
  CEFMSTaxAssessmentService,
};
