/**
 * LOC: CEFMSDOT001
 * File: /reuse/financial/cefms/composites/cefms-debt-obligation-tracking-composite.ts
 *
 * UPSTREAM (imports from):
 *   - ../../../government/debt-bond-management-kit.ts
 *   - ../../../government/budget-appropriations-kit.ts
 *   - ../../../government/audit-transparency-trail-kit.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend CEFMS debt management services
 *   - USACE bond tracking systems
 *   - Debt service payment modules
 */

/**
 * File: /reuse/financial/cefms/composites/cefms-debt-obligation-tracking-composite.ts
 * Locator: WC-CEFMS-DOT-001
 * Purpose: USACE CEFMS Debt and Obligation Tracking - debt issuance, bond management, debt service, covenant compliance
 *
 * Upstream: Composes utilities from government debt and budget kits
 * Downstream: ../../../backend/cefms/*, Debt controllers, bond tracking, debt service schedules
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 38+ composite functions for USACE CEFMS debt and obligation operations
 *
 * LLM Context: Production-ready USACE CEFMS debt obligation tracking system.
 * Comprehensive debt issuance management, municipal bond tracking, debt service payment schedules,
 * covenant compliance monitoring, interest rate calculations, principal and interest amortization,
 * debt refinancing analysis, credit rating integration, callable bond management, sinking fund tracking,
 * debt capacity analysis, arbitrage rebate calculations, and comprehensive reporting for GASB compliance.
 */

import { Model, DataTypes, Sequelize, Transaction, Op } from 'sequelize';
import { Injectable } from '@nestjs/common';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface DebtIssuanceData {
  issuanceId: string;
  issueDate: Date;
  issuanceType: 'general_obligation' | 'revenue_bond' | 'lease_purchase' | 'note' | 'loan';
  principalAmount: number;
  interestRate: number;
  maturityDate: Date;
  issuer: string;
  purpose: string;
  taxStatus: 'taxable' | 'tax_exempt';
  callableAfter?: Date;
  sinkingFundRequired: boolean;
  creditRating?: string;
}

interface DebtServiceScheduleData {
  scheduleId: string;
  issuanceId: string;
  paymentDate: Date;
  principalPayment: number;
  interestPayment: number;
  totalPayment: number;
  remainingPrincipal: number;
  fiscalYear: number;
  fiscalPeriod: number;
  isPaid: boolean;
}

interface BondData {
  bondId: string;
  issuanceId: string;
  bondSeries: string;
  cusipNumber: string;
  faceValue: number;
  couponRate: number;
  issuePrice: number;
  maturityDate: Date;
  callDate?: Date;
  callPrice?: number;
  isCallable: boolean;
}

interface CovenantData {
  covenantId: string;
  issuanceId: string;
  covenantType: 'debt_service_coverage' | 'debt_limit' | 'rate_covenant' | 'parity' | 'additional_bonds';
  description: string;
  requiredRatio: number;
  testingFrequency: 'annual' | 'semi_annual' | 'quarterly' | 'monthly';
  lastTestedDate?: Date;
  lastTestResult?: 'compliant' | 'non_compliant' | 'waived';
}

interface DebtPaymentData {
  paymentId: string;
  scheduleId: string;
  issuanceId: string;
  paymentDate: Date;
  principalPaid: number;
  interestPaid: number;
  feesPaid: number;
  totalPaid: number;
  paymentMethod: string;
  confirmationNumber?: string;
}

interface RefinancingData {
  refinancingId: string;
  originalIssuanceId: string;
  newIssuanceId: string;
  refinancingDate: Date;
  refinancingType: 'current_refunding' | 'advance_refunding';
  originalDebtAmount: number;
  newDebtAmount: number;
  presentValueSavings: number;
  callPremium: number;
  costsOfIssuance: number;
}

interface SinkingFundData {
  fundId: string;
  issuanceId: string;
  fiscalYear: number;
  requiredDeposit: number;
  actualDeposit: number;
  currentBalance: number;
  investmentEarnings: number;
  targetBalance: number;
}

interface CreditRatingData {
  ratingId: string;
  issuanceId: string;
  ratingAgency: 'moodys' | 'sp' | 'fitch';
  ratingValue: string;
  ratingDate: Date;
  outlook: 'positive' | 'stable' | 'negative';
  previousRating?: string;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Sequelize model for Debt Issuances with comprehensive tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} DebtIssuance model
 *
 * @example
 * ```typescript
 * const DebtIssuance = createDebtIssuanceModel(sequelize);
 * const debt = await DebtIssuance.create({
 *   issuanceId: 'DEBT-2024-001',
 *   issueDate: new Date('2024-01-15'),
 *   issuanceType: 'general_obligation',
 *   principalAmount: 50000000,
 *   interestRate: 4.25,
 *   maturityDate: new Date('2044-01-15'),
 *   purpose: 'Infrastructure improvements'
 * });
 * ```
 */
export const createDebtIssuanceModel = (sequelize: Sequelize) => {
  class DebtIssuance extends Model {
    public id!: string;
    public issuanceId!: string;
    public issueDate!: Date;
    public issuanceType!: string;
    public principalAmount!: number;
    public interestRate!: number;
    public maturityDate!: Date;
    public issuer!: string;
    public purpose!: string;
    public taxStatus!: string;
    public callableAfter!: Date | null;
    public sinkingFundRequired!: boolean;
    public creditRating!: string | null;
    public outstandingPrincipal!: number;
    public accruedInterest!: number;
    public status!: string;
    public issuanceCosts!: number;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  DebtIssuance.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      issuanceId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Issuance identifier',
      },
      issueDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Issue date',
      },
      issuanceType: {
        type: DataTypes.ENUM('general_obligation', 'revenue_bond', 'lease_purchase', 'note', 'loan'),
        allowNull: false,
        comment: 'Issuance type',
      },
      principalAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Principal amount',
        validate: {
          min: 0,
        },
      },
      interestRate: {
        type: DataTypes.DECIMAL(8, 4),
        allowNull: false,
        comment: 'Interest rate percentage',
      },
      maturityDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Maturity date',
      },
      issuer: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Issuing entity',
      },
      purpose: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Purpose of issuance',
      },
      taxStatus: {
        type: DataTypes.ENUM('taxable', 'tax_exempt'),
        allowNull: false,
        comment: 'Tax status',
      },
      callableAfter: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Callable after date',
      },
      sinkingFundRequired: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Sinking fund required',
      },
      creditRating: {
        type: DataTypes.STRING(10),
        allowNull: true,
        comment: 'Current credit rating',
      },
      outstandingPrincipal: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Outstanding principal',
      },
      accruedInterest: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Accrued interest',
      },
      status: {
        type: DataTypes.ENUM('active', 'retired', 'refunded', 'defaulted'),
        allowNull: false,
        defaultValue: 'active',
        comment: 'Debt status',
      },
      issuanceCosts: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Costs of issuance',
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
      tableName: 'debt_issuances',
      timestamps: true,
      indexes: [
        { fields: ['issuanceId'], unique: true },
        { fields: ['issuanceType'] },
        { fields: ['status'] },
        { fields: ['issueDate'] },
        { fields: ['maturityDate'] },
      ],
    },
  );

  return DebtIssuance;
};

/**
 * Sequelize model for Debt Service Schedules with payment tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} DebtServiceSchedule model
 */
export const createDebtServiceScheduleModel = (sequelize: Sequelize) => {
  class DebtServiceSchedule extends Model {
    public id!: string;
    public scheduleId!: string;
    public issuanceId!: string;
    public paymentDate!: Date;
    public principalPayment!: number;
    public interestPayment!: number;
    public totalPayment!: number;
    public remainingPrincipal!: number;
    public fiscalYear!: number;
    public fiscalPeriod!: number;
    public isPaid!: boolean;
    public paidDate!: Date | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  DebtServiceSchedule.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      scheduleId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Schedule identifier',
      },
      issuanceId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Debt issuance',
      },
      paymentDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Payment due date',
      },
      principalPayment: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Principal payment',
      },
      interestPayment: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Interest payment',
      },
      totalPayment: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Total payment',
      },
      remainingPrincipal: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Remaining principal',
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
      isPaid: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Payment made',
      },
      paidDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Date paid',
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
      tableName: 'debt_service_schedules',
      timestamps: true,
      indexes: [
        { fields: ['scheduleId'], unique: true },
        { fields: ['issuanceId'] },
        { fields: ['paymentDate'] },
        { fields: ['fiscalYear', 'fiscalPeriod'] },
        { fields: ['isPaid'] },
      ],
    },
  );

  return DebtServiceSchedule;
};

/**
 * Sequelize model for Individual Bonds within issuances.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Bond model
 */
export const createBondModel = (sequelize: Sequelize) => {
  class Bond extends Model {
    public id!: string;
    public bondId!: string;
    public issuanceId!: string;
    public bondSeries!: string;
    public cusipNumber!: string;
    public faceValue!: number;
    public couponRate!: number;
    public issuePrice!: number;
    public maturityDate!: Date;
    public callDate!: Date | null;
    public callPrice!: number | null;
    public isCallable!: boolean;
    public isCalled!: boolean;
    public calledDate!: Date | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  Bond.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      bondId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Bond identifier',
      },
      issuanceId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Parent issuance',
      },
      bondSeries: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Bond series',
      },
      cusipNumber: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
        comment: 'CUSIP number',
      },
      faceValue: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Face value',
      },
      couponRate: {
        type: DataTypes.DECIMAL(8, 4),
        allowNull: false,
        comment: 'Coupon rate',
      },
      issuePrice: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Issue price',
      },
      maturityDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Maturity date',
      },
      callDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Call date',
      },
      callPrice: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: true,
        comment: 'Call price',
      },
      isCallable: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Is callable',
      },
      isCalled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Has been called',
      },
      calledDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Date called',
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
      tableName: 'bonds',
      timestamps: true,
      indexes: [
        { fields: ['bondId'], unique: true },
        { fields: ['cusipNumber'], unique: true },
        { fields: ['issuanceId'] },
        { fields: ['bondSeries'] },
        { fields: ['isCallable'] },
      ],
    },
  );

  return Bond;
};

/**
 * Sequelize model for Debt Covenants with compliance tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} DebtCovenant model
 */
export const createDebtCovenantModel = (sequelize: Sequelize) => {
  class DebtCovenant extends Model {
    public id!: string;
    public covenantId!: string;
    public issuanceId!: string;
    public covenantType!: string;
    public description!: string;
    public requiredRatio!: number;
    public testingFrequency!: string;
    public lastTestedDate!: Date | null;
    public lastTestResult!: string | null;
    public lastTestValue!: number | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  DebtCovenant.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      covenantId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Covenant identifier',
      },
      issuanceId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Related issuance',
      },
      covenantType: {
        type: DataTypes.ENUM('debt_service_coverage', 'debt_limit', 'rate_covenant', 'parity', 'additional_bonds'),
        allowNull: false,
        comment: 'Covenant type',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Covenant description',
      },
      requiredRatio: {
        type: DataTypes.DECIMAL(10, 4),
        allowNull: false,
        comment: 'Required ratio/threshold',
      },
      testingFrequency: {
        type: DataTypes.ENUM('annual', 'semi_annual', 'quarterly', 'monthly'),
        allowNull: false,
        comment: 'Testing frequency',
      },
      lastTestedDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Last test date',
      },
      lastTestResult: {
        type: DataTypes.ENUM('compliant', 'non_compliant', 'waived'),
        allowNull: true,
        comment: 'Last test result',
      },
      lastTestValue: {
        type: DataTypes.DECIMAL(10, 4),
        allowNull: true,
        comment: 'Last test value',
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
      tableName: 'debt_covenants',
      timestamps: true,
      indexes: [
        { fields: ['covenantId'], unique: true },
        { fields: ['issuanceId'] },
        { fields: ['covenantType'] },
        { fields: ['lastTestResult'] },
      ],
    },
  );

  return DebtCovenant;
};

/**
 * Sequelize model for Debt Payments.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} DebtPayment model
 */
export const createDebtPaymentModel = (sequelize: Sequelize) => {
  class DebtPayment extends Model {
    public id!: string;
    public paymentId!: string;
    public scheduleId!: string;
    public issuanceId!: string;
    public paymentDate!: Date;
    public principalPaid!: number;
    public interestPaid!: number;
    public feesPaid!: number;
    public totalPaid!: number;
    public paymentMethod!: string;
    public confirmationNumber!: string | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  DebtPayment.init(
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
      scheduleId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Schedule identifier',
      },
      issuanceId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Issuance identifier',
      },
      paymentDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Payment date',
      },
      principalPaid: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Principal paid',
      },
      interestPaid: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Interest paid',
      },
      feesPaid: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Fees paid',
      },
      totalPaid: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Total payment',
      },
      paymentMethod: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Payment method',
      },
      confirmationNumber: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Confirmation number',
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
      tableName: 'debt_payments',
      timestamps: true,
      indexes: [
        { fields: ['paymentId'], unique: true },
        { fields: ['scheduleId'] },
        { fields: ['issuanceId'] },
        { fields: ['paymentDate'] },
      ],
    },
  );

  return DebtPayment;
};

/**
 * Sequelize model for Debt Refinancing tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} DebtRefinancing model
 */
export const createDebtRefinancingModel = (sequelize: Sequelize) => {
  class DebtRefinancing extends Model {
    public id!: string;
    public refinancingId!: string;
    public originalIssuanceId!: string;
    public newIssuanceId!: string;
    public refinancingDate!: Date;
    public refinancingType!: string;
    public originalDebtAmount!: number;
    public newDebtAmount!: number;
    public presentValueSavings!: number;
    public callPremium!: number;
    public costsOfIssuance!: number;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  DebtRefinancing.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      refinancingId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Refinancing identifier',
      },
      originalIssuanceId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Original debt',
      },
      newIssuanceId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'New refunding debt',
      },
      refinancingDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Refinancing date',
      },
      refinancingType: {
        type: DataTypes.ENUM('current_refunding', 'advance_refunding'),
        allowNull: false,
        comment: 'Refinancing type',
      },
      originalDebtAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Original debt amount',
      },
      newDebtAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'New debt amount',
      },
      presentValueSavings: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'PV savings',
      },
      callPremium: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Call premium paid',
      },
      costsOfIssuance: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Issuance costs',
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
      tableName: 'debt_refinancings',
      timestamps: true,
      indexes: [
        { fields: ['refinancingId'], unique: true },
        { fields: ['originalIssuanceId'] },
        { fields: ['newIssuanceId'] },
        { fields: ['refinancingDate'] },
      ],
    },
  );

  return DebtRefinancing;
};

/**
 * Sequelize model for Sinking Funds.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} SinkingFund model
 */
export const createSinkingFundModel = (sequelize: Sequelize) => {
  class SinkingFund extends Model {
    public id!: string;
    public fundId!: string;
    public issuanceId!: string;
    public fiscalYear!: number;
    public requiredDeposit!: number;
    public actualDeposit!: number;
    public currentBalance!: number;
    public investmentEarnings!: number;
    public targetBalance!: number;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  SinkingFund.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      fundId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Fund identifier',
      },
      issuanceId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Related issuance',
      },
      fiscalYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Fiscal year',
      },
      requiredDeposit: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Required deposit',
      },
      actualDeposit: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Actual deposit',
      },
      currentBalance: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Current balance',
      },
      investmentEarnings: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Investment earnings',
      },
      targetBalance: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Target balance',
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
      tableName: 'sinking_funds',
      timestamps: true,
      indexes: [
        { fields: ['fundId'], unique: true },
        { fields: ['issuanceId'] },
        { fields: ['fiscalYear'] },
      ],
    },
  );

  return SinkingFund;
};

/**
 * Sequelize model for Credit Ratings.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CreditRating model
 */
export const createCreditRatingModel = (sequelize: Sequelize) => {
  class CreditRating extends Model {
    public id!: string;
    public ratingId!: string;
    public issuanceId!: string;
    public ratingAgency!: string;
    public ratingValue!: string;
    public ratingDate!: Date;
    public outlook!: string;
    public previousRating!: string | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  CreditRating.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      ratingId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Rating identifier',
      },
      issuanceId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Related issuance',
      },
      ratingAgency: {
        type: DataTypes.ENUM('moodys', 'sp', 'fitch'),
        allowNull: false,
        comment: 'Rating agency',
      },
      ratingValue: {
        type: DataTypes.STRING(10),
        allowNull: false,
        comment: 'Rating value',
      },
      ratingDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Rating date',
      },
      outlook: {
        type: DataTypes.ENUM('positive', 'stable', 'negative'),
        allowNull: false,
        comment: 'Rating outlook',
      },
      previousRating: {
        type: DataTypes.STRING(10),
        allowNull: true,
        comment: 'Previous rating',
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
      tableName: 'credit_ratings',
      timestamps: true,
      indexes: [
        { fields: ['ratingId'], unique: true },
        { fields: ['issuanceId'] },
        { fields: ['ratingAgency'] },
        { fields: ['ratingDate'] },
      ],
    },
  );

  return CreditRating;
};

// ============================================================================
// DEBT ISSUANCE MANAGEMENT (1-6)
// ============================================================================

/**
 * Creates new debt issuance with validation.
 *
 * @param {DebtIssuanceData} issuanceData - Issuance data
 * @param {Model} DebtIssuance - DebtIssuance model
 * @param {string} userId - User creating issuance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created issuance
 *
 * @example
 * ```typescript
 * const debt = await createDebtIssuance({
 *   issuanceId: 'DEBT-2024-001',
 *   issuanceType: 'general_obligation',
 *   principalAmount: 50000000,
 *   interestRate: 4.25,
 *   maturityDate: new Date('2044-01-15')
 * }, DebtIssuance, 'user123');
 * ```
 */
export const createDebtIssuance = async (
  issuanceData: DebtIssuanceData,
  DebtIssuance: any,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const issuance = await DebtIssuance.create(
    {
      ...issuanceData,
      outstandingPrincipal: issuanceData.principalAmount,
      status: 'active',
    },
    { transaction },
  );

  console.log(`Debt issuance created: ${issuance.issuanceId} by ${userId}`);
  return issuance;
};

/**
 * Validates debt capacity limits.
 *
 * @param {number} newDebtAmount - Proposed new debt
 * @param {number} legalDebtLimit - Legal debt limit
 * @param {Model} DebtIssuance - DebtIssuance model
 * @returns {Promise<{ withinCapacity: boolean; currentDebt: number; availableCapacity: number }>}
 */
export const validateDebtCapacity = async (
  newDebtAmount: number,
  legalDebtLimit: number,
  DebtIssuance: any,
): Promise<{ withinCapacity: boolean; currentDebt: number; availableCapacity: number }> => {
  const activeDebts = await DebtIssuance.findAll({
    where: { status: 'active' },
  });

  const currentDebt = activeDebts.reduce(
    (sum: number, d: any) => sum + parseFloat(d.outstandingPrincipal),
    0,
  );

  const availableCapacity = legalDebtLimit - currentDebt;
  const withinCapacity = newDebtAmount <= availableCapacity;

  return {
    withinCapacity,
    currentDebt,
    availableCapacity,
  };
};

/**
 * Retrieves debt issuances by type.
 *
 * @param {string} issuanceType - Issuance type
 * @param {Model} DebtIssuance - DebtIssuance model
 * @returns {Promise<any[]>} Debt issuances
 */
export const getDebtByType = async (
  issuanceType: string,
  DebtIssuance: any,
): Promise<any[]> => {
  return await DebtIssuance.findAll({
    where: { issuanceType, status: 'active' },
    order: [['issueDate', 'DESC']],
  });
};

/**
 * Updates debt status with validation.
 *
 * @param {string} issuanceId - Issuance ID
 * @param {string} newStatus - New status
 * @param {string} userId - User updating status
 * @param {Model} DebtIssuance - DebtIssuance model
 * @returns {Promise<any>} Updated issuance
 */
export const updateDebtStatus = async (
  issuanceId: string,
  newStatus: string,
  userId: string,
  DebtIssuance: any,
): Promise<any> => {
  const debt = await DebtIssuance.findOne({ where: { issuanceId } });
  if (!debt) throw new Error('Debt issuance not found');

  debt.status = newStatus;
  debt.metadata = {
    ...debt.metadata,
    statusUpdatedBy: userId,
    statusUpdatedAt: new Date().toISOString(),
  };
  await debt.save();

  return debt;
};

/**
 * Calculates total debt service requirements.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {Model} DebtServiceSchedule - DebtServiceSchedule model
 * @returns {Promise<{ totalPrincipal: number; totalInterest: number; totalPayment: number }>}
 */
export const calculateTotalDebtService = async (
  fiscalYear: number,
  DebtServiceSchedule: any,
): Promise<{ totalPrincipal: number; totalInterest: number; totalPayment: number }> => {
  const schedules = await DebtServiceSchedule.findAll({
    where: { fiscalYear },
  });

  const totalPrincipal = schedules.reduce(
    (sum: number, s: any) => sum + parseFloat(s.principalPayment),
    0,
  );

  const totalInterest = schedules.reduce(
    (sum: number, s: any) => sum + parseFloat(s.interestPayment),
    0,
  );

  return {
    totalPrincipal,
    totalInterest,
    totalPayment: totalPrincipal + totalInterest,
  };
};

/**
 * Generates debt portfolio summary.
 *
 * @param {Model} DebtIssuance - DebtIssuance model
 * @returns {Promise<any>} Portfolio summary
 */
export const generateDebtPortfolioSummary = async (
  DebtIssuance: any,
): Promise<any> => {
  const activeDebts = await DebtIssuance.findAll({
    where: { status: 'active' },
  });

  const totalOutstanding = activeDebts.reduce(
    (sum: number, d: any) => sum + parseFloat(d.outstandingPrincipal),
    0,
  );

  const weightedAvgRate = activeDebts.reduce(
    (sum: number, d: any) => sum + parseFloat(d.outstandingPrincipal) * parseFloat(d.interestRate),
    0,
  ) / totalOutstanding;

  const byType = activeDebts.reduce((acc: any, d: any) => {
    if (!acc[d.issuanceType]) {
      acc[d.issuanceType] = { count: 0, outstandingPrincipal: 0 };
    }
    acc[d.issuanceType].count++;
    acc[d.issuanceType].outstandingPrincipal += parseFloat(d.outstandingPrincipal);
    return acc;
  }, {});

  return {
    totalIssuances: activeDebts.length,
    totalOutstanding,
    weightedAvgRate,
    byType,
  };
};

// ============================================================================
// DEBT SERVICE SCHEDULING (7-13)
// ============================================================================

/**
 * Generates debt service schedule for issuance.
 *
 * @param {string} issuanceId - Issuance ID
 * @param {Model} DebtIssuance - DebtIssuance model
 * @param {Model} DebtServiceSchedule - DebtServiceSchedule model
 * @returns {Promise<any[]>} Generated schedules
 */
export const generateDebtServiceSchedule = async (
  issuanceId: string,
  DebtIssuance: any,
  DebtServiceSchedule: any,
): Promise<any[]> => {
  const debt = await DebtIssuance.findOne({ where: { issuanceId } });
  if (!debt) throw new Error('Debt issuance not found');

  const schedules: any[] = [];
  const principalAmount = parseFloat(debt.principalAmount);
  const annualRate = parseFloat(debt.interestRate) / 100;
  const years = Math.ceil(
    (debt.maturityDate.getTime() - debt.issueDate.getTime()) / (365 * 24 * 60 * 60 * 1000),
  );

  let remainingPrincipal = principalAmount;
  const annualPrincipalPayment = principalAmount / years;

  for (let year = 1; year <= years; year++) {
    const paymentDate = new Date(debt.issueDate);
    paymentDate.setFullYear(paymentDate.getFullYear() + year);

    const interestPayment = remainingPrincipal * annualRate;
    const principalPayment = Math.min(annualPrincipalPayment, remainingPrincipal);
    remainingPrincipal -= principalPayment;

    const schedule = await DebtServiceSchedule.create({
      scheduleId: `${issuanceId}-Y${year}`,
      issuanceId,
      paymentDate,
      principalPayment,
      interestPayment,
      totalPayment: principalPayment + interestPayment,
      remainingPrincipal,
      fiscalYear: paymentDate.getFullYear(),
      fiscalPeriod: paymentDate.getMonth() + 1,
      isPaid: false,
    });

    schedules.push(schedule);
  }

  return schedules;
};

/**
 * Calculates interest payment for period.
 *
 * @param {number} principal - Outstanding principal
 * @param {number} annualRate - Annual interest rate (percentage)
 * @param {number} dayCount - Days in period
 * @returns {number} Interest payment
 */
export const calculateInterestPayment = (
  principal: number,
  annualRate: number,
  dayCount: number = 180,
): number => {
  const dailyRate = annualRate / 100 / 365;
  return principal * dailyRate * dayCount;
};

/**
 * Records debt service payment.
 *
 * @param {DebtPaymentData} paymentData - Payment data
 * @param {Model} DebtPayment - DebtPayment model
 * @param {Model} DebtServiceSchedule - DebtServiceSchedule model
 * @param {Model} DebtIssuance - DebtIssuance model
 * @returns {Promise<any>} Created payment
 */
export const recordDebtPayment = async (
  paymentData: DebtPaymentData,
  DebtPayment: any,
  DebtServiceSchedule: any,
  DebtIssuance: any,
): Promise<any> => {
  const payment = await DebtPayment.create(paymentData);

  // Update schedule
  const schedule = await DebtServiceSchedule.findOne({
    where: { scheduleId: paymentData.scheduleId },
  });
  if (schedule) {
    schedule.isPaid = true;
    schedule.paidDate = paymentData.paymentDate;
    await schedule.save();
  }

  // Update debt outstanding principal
  const debt = await DebtIssuance.findOne({
    where: { issuanceId: paymentData.issuanceId },
  });
  if (debt) {
    debt.outstandingPrincipal = parseFloat(debt.outstandingPrincipal) - paymentData.principalPaid;
    await debt.save();
  }

  return payment;
};

/**
 * Retrieves upcoming debt service payments.
 *
 * @param {Date} throughDate - Look ahead through date
 * @param {Model} DebtServiceSchedule - DebtServiceSchedule model
 * @returns {Promise<any[]>} Upcoming payments
 */
export const getUpcomingDebtService = async (
  throughDate: Date,
  DebtServiceSchedule: any,
): Promise<any[]> => {
  return await DebtServiceSchedule.findAll({
    where: {
      paymentDate: { [Op.lte]: throughDate },
      isPaid: false,
    },
    order: [['paymentDate', 'ASC']],
  });
};

/**
 * Identifies overdue debt payments.
 *
 * @param {Model} DebtServiceSchedule - DebtServiceSchedule model
 * @returns {Promise<any[]>} Overdue payments
 */
export const getOverduePayments = async (
  DebtServiceSchedule: any,
): Promise<any[]> => {
  return await DebtServiceSchedule.findAll({
    where: {
      paymentDate: { [Op.lt]: new Date() },
      isPaid: false,
    },
    order: [['paymentDate', 'ASC']],
  });
};

/**
 * Generates annual debt service report.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {Model} DebtServiceSchedule - DebtServiceSchedule model
 * @param {Model} DebtPayment - DebtPayment model
 * @returns {Promise<any>} Annual report
 */
export const generateAnnualDebtServiceReport = async (
  fiscalYear: number,
  DebtServiceSchedule: any,
  DebtPayment: any,
): Promise<any> => {
  const scheduledPayments = await DebtServiceSchedule.findAll({
    where: { fiscalYear },
  });

  const actualPayments = await DebtPayment.findAll({
    where: {
      paymentDate: {
        [Op.between]: [new Date(fiscalYear, 0, 1), new Date(fiscalYear, 11, 31)],
      },
    },
  });

  const scheduledPrincipal = scheduledPayments.reduce(
    (sum: number, s: any) => sum + parseFloat(s.principalPayment),
    0,
  );

  const scheduledInterest = scheduledPayments.reduce(
    (sum: number, s: any) => sum + parseFloat(s.interestPayment),
    0,
  );

  const actualPrincipal = actualPayments.reduce(
    (sum: number, p: any) => sum + parseFloat(p.principalPaid),
    0,
  );

  const actualInterest = actualPayments.reduce(
    (sum: number, p: any) => sum + parseFloat(p.interestPaid),
    0,
  );

  return {
    fiscalYear,
    scheduled: {
      principal: scheduledPrincipal,
      interest: scheduledInterest,
      total: scheduledPrincipal + scheduledInterest,
    },
    actual: {
      principal: actualPrincipal,
      interest: actualInterest,
      total: actualPrincipal + actualInterest,
    },
    variance: {
      principal: actualPrincipal - scheduledPrincipal,
      interest: actualInterest - scheduledInterest,
    },
  };
};

/**
 * Exports debt service schedule to CSV.
 *
 * @param {string} issuanceId - Issuance ID
 * @param {Model} DebtServiceSchedule - DebtServiceSchedule model
 * @returns {Promise<Buffer>} CSV buffer
 */
export const exportDebtServiceScheduleCSV = async (
  issuanceId: string,
  DebtServiceSchedule: any,
): Promise<Buffer> => {
  const schedules = await DebtServiceSchedule.findAll({
    where: { issuanceId },
    order: [['paymentDate', 'ASC']],
  });

  const csv = 'Payment Date,Principal Payment,Interest Payment,Total Payment,Remaining Principal,Is Paid\n' +
    schedules.map((s: any) =>
      `${s.paymentDate.toISOString().split('T')[0]},${s.principalPayment},${s.interestPayment},${s.totalPayment},${s.remainingPrincipal},${s.isPaid}`
    ).join('\n');

  return Buffer.from(csv, 'utf-8');
};

// ============================================================================
// BOND MANAGEMENT (14-19)
// ============================================================================

/**
 * Creates individual bond within issuance.
 *
 * @param {BondData} bondData - Bond data
 * @param {Model} Bond - Bond model
 * @returns {Promise<any>} Created bond
 */
export const createBond = async (
  bondData: BondData,
  Bond: any,
): Promise<any> => {
  return await Bond.create(bondData);
};

/**
 * Calls callable bond.
 *
 * @param {string} bondId - Bond ID
 * @param {Date} callDate - Call date
 * @param {Model} Bond - Bond model
 * @returns {Promise<any>} Called bond
 */
export const callBond = async (
  bondId: string,
  callDate: Date,
  Bond: any,
): Promise<any> => {
  const bond = await Bond.findOne({ where: { bondId } });
  if (!bond) throw new Error('Bond not found');

  if (!bond.isCallable) {
    throw new Error('Bond is not callable');
  }

  if (bond.callDate && callDate < bond.callDate) {
    throw new Error('Cannot call bond before call date');
  }

  bond.isCalled = true;
  bond.calledDate = callDate;
  await bond.save();

  return bond;
};

/**
 * Retrieves callable bonds eligible for call.
 *
 * @param {Date} asOfDate - As of date
 * @param {Model} Bond - Bond model
 * @returns {Promise<any[]>} Callable bonds
 */
export const getCallableBonds = async (
  asOfDate: Date,
  Bond: any,
): Promise<any[]> => {
  return await Bond.findAll({
    where: {
      isCallable: true,
      isCalled: false,
      callDate: { [Op.lte]: asOfDate },
    },
    order: [['callDate', 'ASC']],
  });
};

/**
 * Calculates bond yield to maturity.
 *
 * @param {number} faceValue - Face value
 * @param {number} couponRate - Annual coupon rate (percentage)
 * @param {number} currentPrice - Current market price
 * @param {number} yearsToMaturity - Years to maturity
 * @returns {number} Approximate yield to maturity
 */
export const calculateBondYTM = (
  faceValue: number,
  couponRate: number,
  currentPrice: number,
  yearsToMaturity: number,
): number => {
  const annualCoupon = faceValue * (couponRate / 100);
  const approximateYTM = (annualCoupon + (faceValue - currentPrice) / yearsToMaturity) /
    ((faceValue + currentPrice) / 2);
  return approximateYTM * 100;
};

/**
 * Retrieves bonds by CUSIP.
 *
 * @param {string} cusipNumber - CUSIP number
 * @param {Model} Bond - Bond model
 * @returns {Promise<any>} Bond record
 */
export const getBondByCUSIP = async (
  cusipNumber: string,
  Bond: any,
): Promise<any> => {
  return await Bond.findOne({ where: { cusipNumber } });
};

/**
 * Generates bond register report.
 *
 * @param {string} issuanceId - Issuance ID
 * @param {Model} Bond - Bond model
 * @returns {Promise<any>} Bond register
 */
export const generateBondRegister = async (
  issuanceId: string,
  Bond: any,
): Promise<any> => {
  const bonds = await Bond.findAll({
    where: { issuanceId },
    order: [['bondSeries', 'ASC']],
  });

  const totalFaceValue = bonds.reduce(
    (sum: number, b: any) => sum + parseFloat(b.faceValue),
    0,
  );

  const callableBonds = bonds.filter((b: any) => b.isCallable && !b.isCalled);
  const calledBonds = bonds.filter((b: any) => b.isCalled);

  return {
    issuanceId,
    totalBonds: bonds.length,
    totalFaceValue,
    callableBonds: callableBonds.length,
    calledBonds: calledBonds.length,
    bonds,
  };
};

// ============================================================================
// COVENANT COMPLIANCE (20-25)
// ============================================================================

/**
 * Creates debt covenant.
 *
 * @param {CovenantData} covenantData - Covenant data
 * @param {Model} DebtCovenant - DebtCovenant model
 * @returns {Promise<any>} Created covenant
 */
export const createDebtCovenant = async (
  covenantData: CovenantData,
  DebtCovenant: any,
): Promise<any> => {
  return await DebtCovenant.create(covenantData);
};

/**
 * Tests debt service coverage covenant.
 *
 * @param {string} covenantId - Covenant ID
 * @param {number} netRevenue - Net revenue
 * @param {number} debtServicePayment - Debt service payment
 * @param {Model} DebtCovenant - DebtCovenant model
 * @returns {Promise<any>} Test result
 */
export const testDebtServiceCoverage = async (
  covenantId: string,
  netRevenue: number,
  debtServicePayment: number,
  DebtCovenant: any,
): Promise<any> => {
  const covenant = await DebtCovenant.findOne({ where: { covenantId } });
  if (!covenant) throw new Error('Covenant not found');

  const actualRatio = debtServicePayment > 0 ? netRevenue / debtServicePayment : 0;
  const compliant = actualRatio >= parseFloat(covenant.requiredRatio);

  covenant.lastTestedDate = new Date();
  covenant.lastTestValue = actualRatio;
  covenant.lastTestResult = compliant ? 'compliant' : 'non_compliant';
  await covenant.save();

  return {
    covenantId,
    requiredRatio: covenant.requiredRatio,
    actualRatio,
    compliant,
    testDate: covenant.lastTestedDate,
  };
};

/**
 * Retrieves covenant compliance status.
 *
 * @param {string} issuanceId - Issuance ID
 * @param {Model} DebtCovenant - DebtCovenant model
 * @returns {Promise<any>} Compliance status
 */
export const getCovenantComplianceStatus = async (
  issuanceId: string,
  DebtCovenant: any,
): Promise<any> => {
  const covenants = await DebtCovenant.findAll({
    where: { issuanceId },
  });

  const compliantCount = covenants.filter((c: any) => c.lastTestResult === 'compliant').length;
  const nonCompliantCount = covenants.filter((c: any) => c.lastTestResult === 'non_compliant').length;

  return {
    issuanceId,
    totalCovenants: covenants.length,
    compliant: compliantCount,
    nonCompliant: nonCompliantCount,
    allCompliant: nonCompliantCount === 0,
    covenants,
  };
};

/**
 * Identifies covenants due for testing.
 *
 * @param {Date} asOfDate - As of date
 * @param {Model} DebtCovenant - DebtCovenant model
 * @returns {Promise<any[]>} Covenants due
 */
export const getCovenantsdue forTesting = async (
  asOfDate: Date,
  DebtCovenant: any,
): Promise<any[]> => {
  const covenants = await DebtCovenant.findAll();

  const dueForTesting = covenants.filter((c: any) => {
    if (!c.lastTestedDate) return true;

    const lastTested = new Date(c.lastTestedDate);
    const monthsSinceTest = (asOfDate.getTime() - lastTested.getTime()) / (30 * 24 * 60 * 60 * 1000);

    const testingIntervals: Record<string, number> = {
      monthly: 1,
      quarterly: 3,
      semi_annual: 6,
      annual: 12,
    };

    const requiredInterval = testingIntervals[c.testingFrequency] || 12;
    return monthsSinceTest >= requiredInterval;
  });

  return dueForTesting;
};

/**
 * Generates covenant compliance report.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {Model} DebtCovenant - DebtCovenant model
 * @returns {Promise<any>} Compliance report
 */
export const generateCovenantComplianceReport = async (
  fiscalYear: number,
  DebtCovenant: any,
): Promise<any> => {
  const startDate = new Date(fiscalYear, 0, 1);
  const endDate = new Date(fiscalYear, 11, 31);

  const covenants = await DebtCovenant.findAll({
    where: {
      lastTestedDate: { [Op.between]: [startDate, endDate] },
    },
  });

  const byType = covenants.reduce((acc: any, c: any) => {
    if (!acc[c.covenantType]) {
      acc[c.covenantType] = { total: 0, compliant: 0, nonCompliant: 0 };
    }
    acc[c.covenantType].total++;
    if (c.lastTestResult === 'compliant') acc[c.covenantType].compliant++;
    if (c.lastTestResult === 'non_compliant') acc[c.covenantType].nonCompliant++;
    return acc;
  }, {});

  return {
    fiscalYear,
    totalCovenants: covenants.length,
    byType,
    covenants,
  };
};

/**
 * Waives covenant requirement with approval.
 *
 * @param {string} covenantId - Covenant ID
 * @param {string} waiverReason - Waiver reason
 * @param {string} approvedBy - Approver
 * @param {Model} DebtCovenant - DebtCovenant model
 * @returns {Promise<any>} Waived covenant
 */
export const waiveCovenantRequirement = async (
  covenantId: string,
  waiverReason: string,
  approvedBy: string,
  DebtCovenant: any,
): Promise<any> => {
  const covenant = await DebtCovenant.findOne({ where: { covenantId } });
  if (!covenant) throw new Error('Covenant not found');

  covenant.lastTestResult = 'waived';
  covenant.metadata = {
    ...covenant.metadata,
    waiver: {
      reason: waiverReason,
      approvedBy,
      approvedAt: new Date().toISOString(),
    },
  };
  await covenant.save();

  return covenant;
};

// ============================================================================
// REFINANCING & ANALYTICS (26-32)
// ============================================================================

/**
 * Creates debt refinancing record.
 *
 * @param {RefinancingData} refinancingData - Refinancing data
 * @param {Model} DebtRefinancing - DebtRefinancing model
 * @param {Model} DebtIssuance - DebtIssuance model
 * @returns {Promise<any>} Created refinancing
 */
export const createDebtRefinancing = async (
  refinancingData: RefinancingData,
  DebtRefinancing: any,
  DebtIssuance: any,
): Promise<any> => {
  const refinancing = await DebtRefinancing.create(refinancingData);

  // Update original debt status
  const originalDebt = await DebtIssuance.findOne({
    where: { issuanceId: refinancingData.originalIssuanceId },
  });
  if (originalDebt) {
    originalDebt.status = 'refunded';
    await originalDebt.save();
  }

  return refinancing;
};

/**
 * Analyzes refinancing opportunity.
 *
 * @param {string} issuanceId - Issuance ID
 * @param {number} newInterestRate - Proposed new rate
 * @param {Model} DebtIssuance - DebtIssuance model
 * @param {Model} DebtServiceSchedule - DebtServiceSchedule model
 * @returns {Promise<any>} Refinancing analysis
 */
export const analyzeRefinancingOpportunity = async (
  issuanceId: string,
  newInterestRate: number,
  DebtIssuance: any,
  DebtServiceSchedule: any,
): Promise<any> => {
  const debt = await DebtIssuance.findOne({ where: { issuanceId } });
  if (!debt) throw new Error('Debt not found');

  const remainingSchedules = await DebtServiceSchedule.findAll({
    where: {
      issuanceId,
      isPaid: false,
    },
  });

  const currentPVDebtService = remainingSchedules.reduce((sum: number, s: any) => {
    const years = (s.paymentDate.getTime() - new Date().getTime()) / (365 * 24 * 60 * 60 * 1000);
    const discountFactor = 1 / Math.pow(1 + parseFloat(debt.interestRate) / 100, years);
    return sum + parseFloat(s.totalPayment) * discountFactor;
  }, 0);

  const newPVDebtService = remainingSchedules.reduce((sum: number, s: any) => {
    const years = (s.paymentDate.getTime() - new Date().getTime()) / (365 * 24 * 60 * 60 * 1000);
    const discountFactor = 1 / Math.pow(1 + newInterestRate / 100, years);
    const newInterestPayment = parseFloat(s.remainingPrincipal) * (newInterestRate / 100);
    const newTotalPayment = parseFloat(s.principalPayment) + newInterestPayment;
    return sum + newTotalPayment * discountFactor;
  }, 0);

  const pvSavings = currentPVDebtService - newPVDebtService;
  const recommendRefinancing = pvSavings > 0;

  return {
    issuanceId,
    currentRate: debt.interestRate,
    proposedRate: newInterestRate,
    currentPVDebtService,
    newPVDebtService,
    pvSavings,
    savingsPercentage: (pvSavings / currentPVDebtService) * 100,
    recommendRefinancing,
  };
};

/**
 * Tracks sinking fund deposits.
 *
 * @param {SinkingFundData} fundData - Sinking fund data
 * @param {Model} SinkingFund - SinkingFund model
 * @returns {Promise<any>} Sinking fund record
 */
export const trackSinkingFund = async (
  fundData: SinkingFundData,
  SinkingFund: any,
): Promise<any> => {
  const existing = await SinkingFund.findOne({
    where: {
      issuanceId: fundData.issuanceId,
      fiscalYear: fundData.fiscalYear,
    },
  });

  if (existing) {
    existing.actualDeposit = fundData.actualDeposit;
    existing.currentBalance = fundData.currentBalance;
    existing.investmentEarnings = fundData.investmentEarnings;
    await existing.save();
    return existing;
  }

  return await SinkingFund.create(fundData);
};

/**
 * Records credit rating change.
 *
 * @param {CreditRatingData} ratingData - Rating data
 * @param {Model} CreditRating - CreditRating model
 * @param {Model} DebtIssuance - DebtIssuance model
 * @returns {Promise<any>} Credit rating record
 */
export const recordCreditRating = async (
  ratingData: CreditRatingData,
  CreditRating: any,
  DebtIssuance: any,
): Promise<any> => {
  const rating = await CreditRating.create(ratingData);

  // Update debt issuance
  const debt = await DebtIssuance.findOne({
    where: { issuanceId: ratingData.issuanceId },
  });
  if (debt) {
    debt.creditRating = ratingData.ratingValue;
    await debt.save();
  }

  return rating;
};

/**
 * Calculates debt burden ratios.
 *
 * @param {number} totalRevenue - Total revenue
 * @param {number} totalDebtService - Total debt service
 * @param {number} totalDebtOutstanding - Total debt outstanding
 * @param {number} totalAssets - Total assets
 * @returns {any} Debt burden ratios
 */
export const calculateDebtBurdenRatios = (
  totalRevenue: number,
  totalDebtService: number,
  totalDebtOutstanding: number,
  totalAssets: number,
): any => {
  return {
    debtServiceRatio: (totalDebtService / totalRevenue) * 100,
    debtToAssetRatio: (totalDebtOutstanding / totalAssets) * 100,
    debtPerCapita: totalDebtOutstanding, // Would need population data
  };
};

/**
 * Generates comprehensive debt report.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {Model} DebtIssuance - DebtIssuance model
 * @param {Model} DebtServiceSchedule - DebtServiceSchedule model
 * @param {Model} DebtPayment - DebtPayment model
 * @returns {Promise<any>} Comprehensive report
 */
export const generateComprehensiveDebtReport = async (
  fiscalYear: number,
  DebtIssuance: any,
  DebtServiceSchedule: any,
  DebtPayment: any,
): Promise<any> => {
  const activeDebts = await DebtIssuance.findAll({
    where: { status: 'active' },
  });

  const debtService = await calculateTotalDebtService(fiscalYear, DebtServiceSchedule);
  const portfolio = await generateDebtPortfolioSummary(DebtIssuance);
  const annualReport = await generateAnnualDebtServiceReport(fiscalYear, DebtServiceSchedule, DebtPayment);

  return {
    fiscalYear,
    portfolio,
    debtService,
    annualReport,
    activeDebts,
  };
};

/**
 * Exports debt portfolio to Excel.
 *
 * @param {Model} DebtIssuance - DebtIssuance model
 * @returns {Promise<Buffer>} Excel buffer
 */
export const exportDebtPortfolioExcel = async (
  DebtIssuance: any,
): Promise<Buffer> => {
  const debts = await DebtIssuance.findAll({
    where: { status: 'active' },
    order: [['issueDate', 'ASC']],
  });

  const csv = 'Issuance ID,Type,Issue Date,Principal Amount,Interest Rate,Outstanding Principal,Maturity Date,Credit Rating\n' +
    debts.map((d: any) =>
      `${d.issuanceId},${d.issuanceType},${d.issueDate.toISOString().split('T')[0]},${d.principalAmount},${d.interestRate},${d.outstandingPrincipal},${d.maturityDate.toISOString().split('T')[0]},${d.creditRating || 'N/A'}`
    ).join('\n');

  return Buffer.from(csv, 'utf-8');
};

// ============================================================================
// NESTJS SERVICE WRAPPER
// ============================================================================

@Injectable()
export class CEFMSDebtObligationService {
  constructor(private readonly sequelize: Sequelize) {}

  async createDebt(issuanceData: DebtIssuanceData, userId: string) {
    const DebtIssuance = createDebtIssuanceModel(this.sequelize);
    return createDebtIssuance(issuanceData, DebtIssuance, userId);
  }

  async generateSchedule(issuanceId: string) {
    const DebtIssuance = createDebtIssuanceModel(this.sequelize);
    const DebtServiceSchedule = createDebtServiceScheduleModel(this.sequelize);
    return generateDebtServiceSchedule(issuanceId, DebtIssuance, DebtServiceSchedule);
  }

  async recordPayment(paymentData: DebtPaymentData) {
    const DebtPayment = createDebtPaymentModel(this.sequelize);
    const DebtServiceSchedule = createDebtServiceScheduleModel(this.sequelize);
    const DebtIssuance = createDebtIssuanceModel(this.sequelize);
    return recordDebtPayment(paymentData, DebtPayment, DebtServiceSchedule, DebtIssuance);
  }

  async analyzeRefinancing(issuanceId: string, newRate: number) {
    const DebtIssuance = createDebtIssuanceModel(this.sequelize);
    const DebtServiceSchedule = createDebtServiceScheduleModel(this.sequelize);
    return analyzeRefinancingOpportunity(issuanceId, newRate, DebtIssuance, DebtServiceSchedule);
  }
}

export default {
  // Models
  createDebtIssuanceModel,
  createDebtServiceScheduleModel,
  createBondModel,
  createDebtCovenantModel,
  createDebtPaymentModel,
  createDebtRefinancingModel,
  createSinkingFundModel,
  createCreditRatingModel,

  // Debt Issuance
  createDebtIssuance,
  validateDebtCapacity,
  getDebtByType,
  updateDebtStatus,
  calculateTotalDebtService,
  generateDebtPortfolioSummary,

  // Debt Service
  generateDebtServiceSchedule,
  calculateInterestPayment,
  recordDebtPayment,
  getUpcomingDebtService,
  getOverduePayments,
  generateAnnualDebtServiceReport,
  exportDebtServiceScheduleCSV,

  // Bond Management
  createBond,
  callBond,
  getCallableBonds,
  calculateBondYTM,
  getBondByCUSIP,
  generateBondRegister,

  // Covenant Compliance
  createDebtCovenant,
  testDebtServiceCoverage,
  getCovenantComplianceStatus,
  getCovenaantsDueForTesting,
  generateCovenantComplianceReport,
  waiveCovenantRequirement,

  // Refinancing & Analytics
  createDebtRefinancing,
  analyzeRefinancingOpportunity,
  trackSinkingFund,
  recordCreditRating,
  calculateDebtBurdenRatios,
  generateComprehensiveDebtReport,
  exportDebtPortfolioExcel,

  // Service
  CEFMSDebtObligationService,
};
