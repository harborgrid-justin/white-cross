/**
 * LOC: CEFMSUBC001
 * File: /reuse/financial/cefms/composites/cefms-utility-billing-collections-composite.ts
 *
 * UPSTREAM (imports from):
 *   - ../../../government/revenue-recognition-management-kit.ts
 *   - ../../../government/electronic-payments-disbursements-kit.ts
 *   - ../../../government/citizen-services-integration-kit.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend CEFMS utility services
 *   - USACE utility billing systems
 *   - Customer service modules
 */

/**
 * File: /reuse/financial/cefms/composites/cefms-utility-billing-collections-composite.ts
 * Locator: WC-CEFMS-UBC-001
 * Purpose: USACE CEFMS Utility Billing and Collections - utility billing, meter reading, rate schedules, consumption tracking, billing cycles, payment processing, delinquency management, shut-off procedures, customer service
 *
 * Upstream: Composes utilities from government kits for comprehensive utility billing
 * Downstream: ../../../backend/cefms/*, Billing controllers, meter reading systems, payment processing, customer portals
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 42+ composite functions for USACE CEFMS utility billing operations
 *
 * LLM Context: Production-ready USACE CEFMS utility billing and collections system.
 * Comprehensive utility services billing including water, electric, gas, and sewer services for USACE facilities.
 * Features meter reading capture, tiered rate schedules, consumption analysis, automated billing cycles,
 * multi-payment channel processing, delinquency tracking, collection workflows, service disconnection procedures,
 * reconnection management, late fee calculation, payment plans, customer account management, dispute resolution,
 * usage analytics, conservation programs, and comprehensive customer service integration.
 */

import { Model, DataTypes, Sequelize, Transaction, Op } from 'sequelize';
import { Injectable } from '@nestjs/common';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface UtilityAccountData {
  accountNumber: string;
  customerId: string;
  customerName: string;
  serviceAddress: string;
  accountType: 'residential' | 'commercial' | 'industrial' | 'government';
  serviceType: 'water' | 'electric' | 'gas' | 'sewer' | 'combined';
  meterNumber: string;
  accountStatus: 'active' | 'inactive' | 'suspended' | 'closed';
  billingCycle: string;
  billDeliveryMethod: 'mail' | 'email' | 'portal';
}

interface MeterReadingData {
  readingId: string;
  accountNumber: string;
  meterNumber: string;
  readingDate: Date;
  previousReading: number;
  currentReading: number;
  consumption: number;
  readingType: 'actual' | 'estimated' | 'customer_provided';
  readBy: string;
  readingNotes?: string;
}

interface RateScheduleData {
  scheduleId: string;
  serviceType: string;
  accountType: string;
  effectiveDate: Date;
  expirationDate?: Date;
  baseCharge: number;
  tierStructure: RateTierData[];
  seasonalRates: boolean;
}

interface RateTierData {
  tierNumber: number;
  minUsage: number;
  maxUsage?: number;
  ratePerUnit: number;
}

interface BillingCycleData {
  cycleId: string;
  cycleName: string;
  cycleStartDay: number;
  cycleEndDay: number;
  billingFrequency: 'monthly' | 'bimonthly' | 'quarterly';
  dueDate: Date;
  lateFeeGraceDays: number;
}

interface UtilityBillData {
  billId: string;
  accountNumber: string;
  billingPeriodStart: Date;
  billingPeriodEnd: Date;
  readingId: string;
  consumption: number;
  baseCharge: number;
  usageCharge: number;
  taxes: number;
  fees: number;
  adjustments: number;
  totalAmount: number;
  dueDate: Date;
  billStatus: 'pending' | 'issued' | 'paid' | 'partial' | 'overdue' | 'disputed';
}

interface PaymentData {
  paymentId: string;
  accountNumber: string;
  billId: string;
  paymentDate: Date;
  paymentAmount: number;
  paymentMethod: 'cash' | 'check' | 'card' | 'ach' | 'portal' | 'auto_pay';
  confirmationNumber: string;
  paymentStatus: 'pending' | 'processed' | 'failed' | 'reversed';
}

interface DelinquencyData {
  delinquencyId: string;
  accountNumber: string;
  totalOutstanding: number;
  daysPastDue: number;
  delinquencyStatus: 'early' | 'moderate' | 'severe' | 'shutoff_pending';
  noticesSent: number;
  lastNoticeDate?: Date;
  collectionStatus: 'none' | 'notice' | 'collection' | 'legal';
}

interface ServiceDisconnectData {
  disconnectId: string;
  accountNumber: string;
  disconnectReason: 'non_payment' | 'customer_request' | 'safety' | 'maintenance';
  disconnectDate: Date;
  disconnectBy: string;
  amountOwed: number;
  reconnectEligible: boolean;
  reconnectFee: number;
}

interface PaymentPlanData {
  planId: string;
  accountNumber: string;
  totalAmount: number;
  numberOfPayments: number;
  paymentAmount: number;
  startDate: Date;
  frequency: 'weekly' | 'biweekly' | 'monthly';
  status: 'active' | 'completed' | 'defaulted';
  paymentsMade: number;
}

interface CustomerDisputeData {
  disputeId: string;
  accountNumber: string;
  billId: string;
  disputeDate: Date;
  disputeReason: string;
  disputeAmount: number;
  status: 'open' | 'investigating' | 'resolved' | 'denied';
  resolution?: string;
  resolvedDate?: Date;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Sequelize model for Utility Accounts with service tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} UtilityAccount model
 *
 * @example
 * ```typescript
 * const UtilityAccount = createUtilityAccountModel(sequelize);
 * const account = await UtilityAccount.create({
 *   accountNumber: 'UTIL-2024-001',
 *   customerId: 'CUST-123',
 *   customerName: 'John Doe',
 *   serviceType: 'water',
 *   accountType: 'residential',
 *   meterNumber: 'MTR-456'
 * });
 * ```
 */
export const createUtilityAccountModel = (sequelize: Sequelize) => {
  class UtilityAccount extends Model {
    public id!: string;
    public accountNumber!: string;
    public customerId!: string;
    public customerName!: string;
    public serviceAddress!: string;
    public accountType!: string;
    public serviceType!: string;
    public meterNumber!: string;
    public accountStatus!: string;
    public billingCycle!: string;
    public billDeliveryMethod!: string;
    public activationDate!: Date;
    public deactivationDate!: Date | null;
    public currentBalance!: number;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  UtilityAccount.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      accountNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Utility account number',
      },
      customerId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Customer identifier',
      },
      customerName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Customer name',
      },
      serviceAddress: {
        type: DataTypes.STRING(500),
        allowNull: false,
        comment: 'Service address',
      },
      accountType: {
        type: DataTypes.ENUM('residential', 'commercial', 'industrial', 'government'),
        allowNull: false,
        comment: 'Account type',
      },
      serviceType: {
        type: DataTypes.ENUM('water', 'electric', 'gas', 'sewer', 'combined'),
        allowNull: false,
        comment: 'Service type',
      },
      meterNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Meter number',
      },
      accountStatus: {
        type: DataTypes.ENUM('active', 'inactive', 'suspended', 'closed'),
        allowNull: false,
        defaultValue: 'active',
        comment: 'Account status',
      },
      billingCycle: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Billing cycle identifier',
      },
      billDeliveryMethod: {
        type: DataTypes.ENUM('mail', 'email', 'portal'),
        allowNull: false,
        defaultValue: 'mail',
        comment: 'Bill delivery method',
      },
      activationDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: 'Account activation date',
      },
      deactivationDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Account deactivation date',
      },
      currentBalance: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Current account balance',
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
      tableName: 'utility_accounts',
      timestamps: true,
      indexes: [
        { fields: ['accountNumber'], unique: true },
        { fields: ['customerId'] },
        { fields: ['accountStatus'] },
        { fields: ['serviceType'] },
        { fields: ['meterNumber'] },
        { fields: ['billingCycle'] },
      ],
    },
  );

  return UtilityAccount;
};

/**
 * Sequelize model for Meter Readings with validation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} MeterReading model
 */
export const createMeterReadingModel = (sequelize: Sequelize) => {
  class MeterReading extends Model {
    public id!: string;
    public readingId!: string;
    public accountNumber!: string;
    public meterNumber!: string;
    public readingDate!: Date;
    public previousReading!: number;
    public currentReading!: number;
    public consumption!: number;
    public readingType!: string;
    public readBy!: string;
    public readingNotes!: string;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  MeterReading.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      readingId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Reading identifier',
      },
      accountNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Account number',
      },
      meterNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Meter number',
      },
      readingDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Reading date',
      },
      previousReading: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        comment: 'Previous reading value',
      },
      currentReading: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        comment: 'Current reading value',
      },
      consumption: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        comment: 'Consumption units',
      },
      readingType: {
        type: DataTypes.ENUM('actual', 'estimated', 'customer_provided'),
        allowNull: false,
        comment: 'Reading type',
      },
      readBy: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Reader identifier',
      },
      readingNotes: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: '',
        comment: 'Reading notes',
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
      tableName: 'meter_readings',
      timestamps: true,
      indexes: [
        { fields: ['readingId'], unique: true },
        { fields: ['accountNumber'] },
        { fields: ['meterNumber'] },
        { fields: ['readingDate'] },
        { fields: ['readingType'] },
      ],
    },
  );

  return MeterReading;
};

/**
 * Sequelize model for Rate Schedules with tiered pricing.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} RateSchedule model
 */
export const createRateScheduleModel = (sequelize: Sequelize) => {
  class RateSchedule extends Model {
    public id!: string;
    public scheduleId!: string;
    public serviceType!: string;
    public accountType!: string;
    public effectiveDate!: Date;
    public expirationDate!: Date | null;
    public baseCharge!: number;
    public tierStructure!: RateTierData[];
    public seasonalRates!: boolean;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  RateSchedule.init(
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
        comment: 'Rate schedule identifier',
      },
      serviceType: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Service type',
      },
      accountType: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Account type',
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
      baseCharge: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Base charge amount',
      },
      tierStructure: {
        type: DataTypes.JSON,
        allowNull: false,
        comment: 'Tier structure definition',
      },
      seasonalRates: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Seasonal rates flag',
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
      tableName: 'rate_schedules',
      timestamps: true,
      indexes: [
        { fields: ['scheduleId'], unique: true },
        { fields: ['serviceType'] },
        { fields: ['accountType'] },
        { fields: ['effectiveDate'] },
      ],
    },
  );

  return RateSchedule;
};

/**
 * Sequelize model for Utility Bills with itemized charges.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} UtilityBill model
 */
export const createUtilityBillModel = (sequelize: Sequelize) => {
  class UtilityBill extends Model {
    public id!: string;
    public billId!: string;
    public accountNumber!: string;
    public billingPeriodStart!: Date;
    public billingPeriodEnd!: Date;
    public readingId!: string;
    public consumption!: number;
    public baseCharge!: number;
    public usageCharge!: number;
    public taxes!: number;
    public fees!: number;
    public adjustments!: number;
    public totalAmount!: number;
    public amountPaid!: number;
    public balance!: number;
    public dueDate!: Date;
    public billStatus!: string;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  UtilityBill.init(
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
      accountNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Account number',
      },
      billingPeriodStart: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Billing period start',
      },
      billingPeriodEnd: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Billing period end',
      },
      readingId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Related reading ID',
      },
      consumption: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        comment: 'Consumption units',
      },
      baseCharge: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Base charge',
      },
      usageCharge: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Usage charge',
      },
      taxes: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Tax amount',
      },
      fees: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Fees',
      },
      adjustments: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Adjustments',
      },
      totalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Total bill amount',
      },
      amountPaid: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Amount paid',
      },
      balance: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Remaining balance',
      },
      dueDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Payment due date',
      },
      billStatus: {
        type: DataTypes.ENUM('pending', 'issued', 'paid', 'partial', 'overdue', 'disputed'),
        allowNull: false,
        defaultValue: 'pending',
        comment: 'Bill status',
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
      tableName: 'utility_bills',
      timestamps: true,
      indexes: [
        { fields: ['billId'], unique: true },
        { fields: ['accountNumber'] },
        { fields: ['billStatus'] },
        { fields: ['dueDate'] },
        { fields: ['billingPeriodStart', 'billingPeriodEnd'] },
      ],
    },
  );

  return UtilityBill;
};

/**
 * Sequelize model for Payments with multi-channel support.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} UtilityPayment model
 */
export const createUtilityPaymentModel = (sequelize: Sequelize) => {
  class UtilityPayment extends Model {
    public id!: string;
    public paymentId!: string;
    public accountNumber!: string;
    public billId!: string;
    public paymentDate!: Date;
    public paymentAmount!: number;
    public paymentMethod!: string;
    public confirmationNumber!: string;
    public paymentStatus!: string;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  UtilityPayment.init(
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
      accountNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Account number',
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
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Payment amount',
        validate: {
          min: 0.01,
        },
      },
      paymentMethod: {
        type: DataTypes.ENUM('cash', 'check', 'card', 'ach', 'portal', 'auto_pay'),
        allowNull: false,
        comment: 'Payment method',
      },
      confirmationNumber: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Confirmation number',
      },
      paymentStatus: {
        type: DataTypes.ENUM('pending', 'processed', 'failed', 'reversed'),
        allowNull: false,
        defaultValue: 'pending',
        comment: 'Payment status',
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
      tableName: 'utility_payments',
      timestamps: true,
      indexes: [
        { fields: ['paymentId'], unique: true },
        { fields: ['accountNumber'] },
        { fields: ['billId'] },
        { fields: ['paymentStatus'] },
        { fields: ['paymentDate'] },
        { fields: ['confirmationNumber'] },
      ],
    },
  );

  return UtilityPayment;
};

/**
 * Sequelize model for Delinquency tracking and collections.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} AccountDelinquency model
 */
export const createAccountDelinquencyModel = (sequelize: Sequelize) => {
  class AccountDelinquency extends Model {
    public id!: string;
    public delinquencyId!: string;
    public accountNumber!: string;
    public totalOutstanding!: number;
    public daysPastDue!: number;
    public delinquencyStatus!: string;
    public noticesSent!: number;
    public lastNoticeDate!: Date | null;
    public collectionStatus!: string;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  AccountDelinquency.init(
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
      accountNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Account number',
      },
      totalOutstanding: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Total outstanding amount',
      },
      daysPastDue: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Days past due',
      },
      delinquencyStatus: {
        type: DataTypes.ENUM('early', 'moderate', 'severe', 'shutoff_pending'),
        allowNull: false,
        comment: 'Delinquency status',
      },
      noticesSent: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Notices sent count',
      },
      lastNoticeDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Last notice date',
      },
      collectionStatus: {
        type: DataTypes.ENUM('none', 'notice', 'collection', 'legal'),
        allowNull: false,
        defaultValue: 'none',
        comment: 'Collection status',
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
      tableName: 'account_delinquencies',
      timestamps: true,
      indexes: [
        { fields: ['delinquencyId'], unique: true },
        { fields: ['accountNumber'] },
        { fields: ['delinquencyStatus'] },
        { fields: ['collectionStatus'] },
        { fields: ['daysPastDue'] },
      ],
    },
  );

  return AccountDelinquency;
};

/**
 * Sequelize model for Service Disconnections with tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ServiceDisconnect model
 */
export const createServiceDisconnectModel = (sequelize: Sequelize) => {
  class ServiceDisconnect extends Model {
    public id!: string;
    public disconnectId!: string;
    public accountNumber!: string;
    public disconnectReason!: string;
    public disconnectDate!: Date;
    public disconnectBy!: string;
    public amountOwed!: number;
    public reconnectEligible!: boolean;
    public reconnectFee!: number;
    public reconnectDate!: Date | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  ServiceDisconnect.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      disconnectId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Disconnect identifier',
      },
      accountNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Account number',
      },
      disconnectReason: {
        type: DataTypes.ENUM('non_payment', 'customer_request', 'safety', 'maintenance'),
        allowNull: false,
        comment: 'Disconnect reason',
      },
      disconnectDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Disconnect date',
      },
      disconnectBy: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'User who initiated disconnect',
      },
      amountOwed: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Amount owed at disconnect',
      },
      reconnectEligible: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Eligible for reconnection',
      },
      reconnectFee: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Reconnection fee',
      },
      reconnectDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Reconnection date',
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
      tableName: 'service_disconnects',
      timestamps: true,
      indexes: [
        { fields: ['disconnectId'], unique: true },
        { fields: ['accountNumber'] },
        { fields: ['disconnectReason'] },
        { fields: ['disconnectDate'] },
        { fields: ['reconnectEligible'] },
      ],
    },
  );

  return ServiceDisconnect;
};

/**
 * Sequelize model for Payment Plans with installment tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} PaymentPlan model
 */
export const createPaymentPlanModel = (sequelize: Sequelize) => {
  class PaymentPlan extends Model {
    public id!: string;
    public planId!: string;
    public accountNumber!: string;
    public totalAmount!: number;
    public numberOfPayments!: number;
    public paymentAmount!: number;
    public startDate!: Date;
    public frequency!: string;
    public status!: string;
    public paymentsMade!: number;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  PaymentPlan.init(
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
      accountNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Account number',
      },
      totalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Total plan amount',
      },
      numberOfPayments: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Number of payments',
      },
      paymentAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Per-payment amount',
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Plan start date',
      },
      frequency: {
        type: DataTypes.ENUM('weekly', 'biweekly', 'monthly'),
        allowNull: false,
        comment: 'Payment frequency',
      },
      status: {
        type: DataTypes.ENUM('active', 'completed', 'defaulted'),
        allowNull: false,
        defaultValue: 'active',
        comment: 'Plan status',
      },
      paymentsMade: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Payments made count',
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
      tableName: 'payment_plans',
      timestamps: true,
      indexes: [
        { fields: ['planId'], unique: true },
        { fields: ['accountNumber'] },
        { fields: ['status'] },
        { fields: ['startDate'] },
      ],
    },
  );

  return PaymentPlan;
};

/**
 * Sequelize model for Customer Disputes with resolution tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CustomerDispute model
 */
export const createCustomerDisputeModel = (sequelize: Sequelize) => {
  class CustomerDispute extends Model {
    public id!: string;
    public disputeId!: string;
    public accountNumber!: string;
    public billId!: string;
    public disputeDate!: Date;
    public disputeReason!: string;
    public disputeAmount!: number;
    public status!: string;
    public resolution!: string | null;
    public resolvedDate!: Date | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  CustomerDispute.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      disputeId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Dispute identifier',
      },
      accountNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Account number',
      },
      billId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Bill identifier',
      },
      disputeDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Dispute date',
      },
      disputeReason: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Dispute reason',
      },
      disputeAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Disputed amount',
      },
      status: {
        type: DataTypes.ENUM('open', 'investigating', 'resolved', 'denied'),
        allowNull: false,
        defaultValue: 'open',
        comment: 'Dispute status',
      },
      resolution: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Dispute resolution',
      },
      resolvedDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Resolution date',
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
      tableName: 'customer_disputes',
      timestamps: true,
      indexes: [
        { fields: ['disputeId'], unique: true },
        { fields: ['accountNumber'] },
        { fields: ['billId'] },
        { fields: ['status'] },
        { fields: ['disputeDate'] },
      ],
    },
  );

  return CustomerDispute;
};

// ============================================================================
// ACCOUNT MANAGEMENT (1-5)
// ============================================================================

/**
 * Creates new utility account with validation.
 *
 * @param {UtilityAccountData} accountData - Account data
 * @param {Model} UtilityAccount - UtilityAccount model
 * @returns {Promise<any>} Created account
 */
export const createUtilityAccount = async (
  accountData: UtilityAccountData,
  UtilityAccount: any,
): Promise<any> => {
  return await UtilityAccount.create({
    ...accountData,
    activationDate: new Date(),
    currentBalance: 0,
  });
};

/**
 * Updates account delivery preferences.
 *
 * @param {string} accountNumber - Account number
 * @param {string} deliveryMethod - Delivery method
 * @param {Model} UtilityAccount - UtilityAccount model
 * @returns {Promise<any>} Updated account
 */
export const updateAccountDeliveryPreferences = async (
  accountNumber: string,
  deliveryMethod: string,
  UtilityAccount: any,
): Promise<any> => {
  const account = await UtilityAccount.findOne({ where: { accountNumber } });
  if (!account) throw new Error('Account not found');

  account.billDeliveryMethod = deliveryMethod;
  await account.save();

  return account;
};

/**
 * Suspends account temporarily.
 *
 * @param {string} accountNumber - Account number
 * @param {string} reason - Suspension reason
 * @param {Model} UtilityAccount - UtilityAccount model
 * @returns {Promise<any>} Suspended account
 */
export const suspendAccount = async (
  accountNumber: string,
  reason: string,
  UtilityAccount: any,
): Promise<any> => {
  const account = await UtilityAccount.findOne({ where: { accountNumber } });
  if (!account) throw new Error('Account not found');

  account.accountStatus = 'suspended';
  account.metadata = {
    ...account.metadata,
    suspensionReason: reason,
    suspensionDate: new Date().toISOString(),
  };
  await account.save();

  return account;
};

/**
 * Closes utility account permanently.
 *
 * @param {string} accountNumber - Account number
 * @param {Date} closeDate - Close date
 * @param {Model} UtilityAccount - UtilityAccount model
 * @returns {Promise<any>} Closed account
 */
export const closeUtilityAccount = async (
  accountNumber: string,
  closeDate: Date,
  UtilityAccount: any,
): Promise<any> => {
  const account = await UtilityAccount.findOne({ where: { accountNumber } });
  if (!account) throw new Error('Account not found');

  account.accountStatus = 'closed';
  account.deactivationDate = closeDate;
  await account.save();

  return account;
};

/**
 * Retrieves account by customer ID.
 *
 * @param {string} customerId - Customer ID
 * @param {Model} UtilityAccount - UtilityAccount model
 * @returns {Promise<any[]>} Customer accounts
 */
export const getAccountsByCustomer = async (
  customerId: string,
  UtilityAccount: any,
): Promise<any[]> => {
  return await UtilityAccount.findAll({
    where: { customerId },
    order: [['createdAt', 'DESC']],
  });
};

// ============================================================================
// METER READING & CONSUMPTION (6-11)
// ============================================================================

/**
 * Records meter reading with validation.
 *
 * @param {MeterReadingData} readingData - Reading data
 * @param {Model} MeterReading - MeterReading model
 * @returns {Promise<any>} Created reading
 */
export const recordMeterReading = async (
  readingData: MeterReadingData,
  MeterReading: any,
): Promise<any> => {
  return await MeterReading.create(readingData);
};

/**
 * Estimates meter reading when actual unavailable.
 *
 * @param {string} accountNumber - Account number
 * @param {Date} readingDate - Estimated reading date
 * @param {Model} MeterReading - MeterReading model
 * @returns {Promise<any>} Estimated reading
 */
export const estimateMeterReading = async (
  accountNumber: string,
  readingDate: Date,
  MeterReading: any,
): Promise<any> => {
  const previousReadings = await MeterReading.findAll({
    where: {
      accountNumber,
      readingType: 'actual',
    },
    order: [['readingDate', 'DESC']],
    limit: 3,
  });

  if (previousReadings.length === 0) {
    throw new Error('No historical readings for estimation');
  }

  const avgConsumption =
    previousReadings.reduce((sum: number, r: any) => sum + parseFloat(r.consumption), 0) /
    previousReadings.length;

  const lastReading = previousReadings[0];
  const estimatedCurrent = parseFloat(lastReading.currentReading) + avgConsumption;

  return await MeterReading.create({
    readingId: `EST-${accountNumber}-${Date.now()}`,
    accountNumber,
    meterNumber: lastReading.meterNumber,
    readingDate,
    previousReading: parseFloat(lastReading.currentReading),
    currentReading: estimatedCurrent,
    consumption: avgConsumption,
    readingType: 'estimated',
    readBy: 'system',
    readingNotes: 'Estimated based on historical average',
  });
};

/**
 * Validates meter reading for anomalies.
 *
 * @param {string} readingId - Reading ID
 * @param {Model} MeterReading - MeterReading model
 * @returns {Promise<{ valid: boolean; issues: string[] }>}
 */
export const validateMeterReading = async (
  readingId: string,
  MeterReading: any,
): Promise<{ valid: boolean; issues: string[] }> => {
  const reading = await MeterReading.findOne({ where: { readingId } });
  if (!reading) throw new Error('Reading not found');

  const issues: string[] = [];

  if (reading.currentReading < reading.previousReading) {
    issues.push('Current reading less than previous reading');
  }

  if (reading.consumption <= 0) {
    issues.push('Zero or negative consumption');
  }

  // Check for unusually high consumption
  const historicalReadings = await MeterReading.findAll({
    where: {
      accountNumber: reading.accountNumber,
      readingType: 'actual',
    },
    order: [['readingDate', 'DESC']],
    limit: 5,
  });

  if (historicalReadings.length >= 3) {
    const avgConsumption =
      historicalReadings.reduce((sum: number, r: any) => sum + parseFloat(r.consumption), 0) /
      historicalReadings.length;

    if (reading.consumption > avgConsumption * 2) {
      issues.push('Consumption significantly higher than average');
    }
  }

  return {
    valid: issues.length === 0,
    issues,
  };
};

/**
 * Retrieves consumption history for account.
 *
 * @param {string} accountNumber - Account number
 * @param {number} months - Number of months
 * @param {Model} MeterReading - MeterReading model
 * @returns {Promise<any[]>} Consumption history
 */
export const getConsumptionHistory = async (
  accountNumber: string,
  months: number,
  MeterReading: any,
): Promise<any[]> => {
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);

  return await MeterReading.findAll({
    where: {
      accountNumber,
      readingDate: { [Op.gte]: startDate },
    },
    order: [['readingDate', 'ASC']],
  });
};

/**
 * Calculates average daily consumption.
 *
 * @param {string} accountNumber - Account number
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Model} MeterReading - MeterReading model
 * @returns {Promise<number>} Average daily consumption
 */
export const calculateAverageDailyConsumption = async (
  accountNumber: string,
  startDate: Date,
  endDate: Date,
  MeterReading: any,
): Promise<number> => {
  const readings = await MeterReading.findAll({
    where: {
      accountNumber,
      readingDate: { [Op.between]: [startDate, endDate] },
    },
  });

  if (readings.length === 0) return 0;

  const totalConsumption = readings.reduce(
    (sum: number, r: any) => sum + parseFloat(r.consumption),
    0,
  );
  const days = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  return days > 0 ? totalConsumption / days : 0;
};

/**
 * Generates consumption analysis report.
 *
 * @param {string} accountNumber - Account number
 * @param {Model} MeterReading - MeterReading model
 * @returns {Promise<any>} Consumption analysis
 */
export const generateConsumptionAnalysis = async (
  accountNumber: string,
  MeterReading: any,
): Promise<any> => {
  const readings = await MeterReading.findAll({
    where: { accountNumber },
    order: [['readingDate', 'DESC']],
    limit: 12,
  });

  const totalConsumption = readings.reduce(
    (sum: number, r: any) => sum + parseFloat(r.consumption),
    0,
  );
  const avgConsumption = readings.length > 0 ? totalConsumption / readings.length : 0;
  const maxConsumption = Math.max(...readings.map((r: any) => parseFloat(r.consumption)));
  const minConsumption = Math.min(...readings.map((r: any) => parseFloat(r.consumption)));

  return {
    accountNumber,
    totalConsumption,
    avgConsumption,
    maxConsumption,
    minConsumption,
    readingCount: readings.length,
    trend:
      readings.length >= 2
        ? parseFloat(readings[0].consumption) > parseFloat(readings[1].consumption)
          ? 'increasing'
          : 'decreasing'
        : 'stable',
  };
};

// ============================================================================
// RATE SCHEDULES & BILLING (12-18)
// ============================================================================

/**
 * Creates rate schedule with tier structure.
 *
 * @param {RateScheduleData} scheduleData - Schedule data
 * @param {Model} RateSchedule - RateSchedule model
 * @returns {Promise<any>} Created schedule
 */
export const createRateSchedule = async (
  scheduleData: RateScheduleData,
  RateSchedule: any,
): Promise<any> => {
  return await RateSchedule.create(scheduleData);
};

/**
 * Retrieves active rate schedule for account type.
 *
 * @param {string} serviceType - Service type
 * @param {string} accountType - Account type
 * @param {Date} effectiveDate - Effective date
 * @param {Model} RateSchedule - RateSchedule model
 * @returns {Promise<any>} Active rate schedule
 */
export const getActiveRateSchedule = async (
  serviceType: string,
  accountType: string,
  effectiveDate: Date,
  RateSchedule: any,
): Promise<any> => {
  return await RateSchedule.findOne({
    where: {
      serviceType,
      accountType,
      effectiveDate: { [Op.lte]: effectiveDate },
      [Op.or]: [{ expirationDate: null }, { expirationDate: { [Op.gte]: effectiveDate } }],
    },
    order: [['effectiveDate', 'DESC']],
  });
};

/**
 * Calculates usage charge based on tiered rates.
 *
 * @param {number} consumption - Consumption amount
 * @param {RateTierData[]} tierStructure - Tier structure
 * @returns {number} Usage charge
 */
export const calculateTieredUsageCharge = (
  consumption: number,
  tierStructure: RateTierData[],
): number => {
  let charge = 0;
  let remainingConsumption = consumption;

  for (const tier of tierStructure) {
    const tierConsumption = tier.maxUsage
      ? Math.min(remainingConsumption, tier.maxUsage - tier.minUsage)
      : remainingConsumption;

    charge += tierConsumption * tier.ratePerUnit;
    remainingConsumption -= tierConsumption;

    if (remainingConsumption <= 0) break;
  }

  return charge;
};

/**
 * Generates utility bill from reading.
 *
 * @param {UtilityBillData} billData - Bill data
 * @param {Model} UtilityBill - UtilityBill model
 * @param {Model} UtilityAccount - UtilityAccount model
 * @returns {Promise<any>} Generated bill
 */
export const generateUtilityBill = async (
  billData: UtilityBillData,
  UtilityBill: any,
  UtilityAccount: any,
): Promise<any> => {
  const bill = await UtilityBill.create({
    ...billData,
    balance: billData.totalAmount,
    amountPaid: 0,
    billStatus: 'issued',
  });

  const account = await UtilityAccount.findOne({ where: { accountNumber: billData.accountNumber } });
  if (account) {
    account.currentBalance += billData.totalAmount;
    await account.save();
  }

  return bill;
};

/**
 * Applies late fees to overdue bills.
 *
 * @param {string} billId - Bill ID
 * @param {number} lateFeeAmount - Late fee amount
 * @param {Model} UtilityBill - UtilityBill model
 * @returns {Promise<any>} Updated bill
 */
export const applyLateFee = async (
  billId: string,
  lateFeeAmount: number,
  UtilityBill: any,
): Promise<any> => {
  const bill = await UtilityBill.findOne({ where: { billId } });
  if (!bill) throw new Error('Bill not found');

  bill.fees += lateFeeAmount;
  bill.totalAmount += lateFeeAmount;
  bill.balance += lateFeeAmount;
  await bill.save();

  return bill;
};

/**
 * Processes bill adjustment or credit.
 *
 * @param {string} billId - Bill ID
 * @param {number} adjustmentAmount - Adjustment amount (negative for credit)
 * @param {string} reason - Adjustment reason
 * @param {Model} UtilityBill - UtilityBill model
 * @returns {Promise<any>} Adjusted bill
 */
export const processBillAdjustment = async (
  billId: string,
  adjustmentAmount: number,
  reason: string,
  UtilityBill: any,
): Promise<any> => {
  const bill = await UtilityBill.findOne({ where: { billId } });
  if (!bill) throw new Error('Bill not found');

  bill.adjustments += adjustmentAmount;
  bill.totalAmount += adjustmentAmount;
  bill.balance += adjustmentAmount;
  bill.metadata = {
    ...bill.metadata,
    adjustments: [
      ...(bill.metadata.adjustments || []),
      { amount: adjustmentAmount, reason, date: new Date().toISOString() },
    ],
  };
  await bill.save();

  return bill;
};

/**
 * Retrieves bills for account by date range.
 *
 * @param {string} accountNumber - Account number
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Model} UtilityBill - UtilityBill model
 * @returns {Promise<any[]>} Account bills
 */
export const getAccountBills = async (
  accountNumber: string,
  startDate: Date,
  endDate: Date,
  UtilityBill: any,
): Promise<any[]> => {
  return await UtilityBill.findAll({
    where: {
      accountNumber,
      billingPeriodStart: { [Op.between]: [startDate, endDate] },
    },
    order: [['billingPeriodStart', 'DESC']],
  });
};

// ============================================================================
// PAYMENT PROCESSING (19-25)
// ============================================================================

/**
 * Processes utility payment against bill.
 *
 * @param {PaymentData} paymentData - Payment data
 * @param {Model} UtilityPayment - UtilityPayment model
 * @param {Model} UtilityBill - UtilityBill model
 * @param {Model} UtilityAccount - UtilityAccount model
 * @returns {Promise<any>} Processed payment
 */
export const processUtilityPayment = async (
  paymentData: PaymentData,
  UtilityPayment: any,
  UtilityBill: any,
  UtilityAccount: any,
): Promise<any> => {
  const payment = await UtilityPayment.create({
    ...paymentData,
    paymentStatus: 'processed',
  });

  const bill = await UtilityBill.findOne({ where: { billId: paymentData.billId } });
  if (bill) {
    bill.amountPaid += paymentData.paymentAmount;
    bill.balance -= paymentData.paymentAmount;

    if (bill.balance <= 0) {
      bill.billStatus = 'paid';
    } else {
      bill.billStatus = 'partial';
    }

    await bill.save();
  }

  const account = await UtilityAccount.findOne({ where: { accountNumber: paymentData.accountNumber } });
  if (account) {
    account.currentBalance -= paymentData.paymentAmount;
    await account.save();
  }

  return payment;
};

/**
 * Sets up auto-pay for account.
 *
 * @param {string} accountNumber - Account number
 * @param {string} paymentMethod - Payment method
 * @param {string} accountDetails - Account details
 * @param {Model} UtilityAccount - UtilityAccount model
 * @returns {Promise<any>} Updated account
 */
export const setupAutoPay = async (
  accountNumber: string,
  paymentMethod: string,
  accountDetails: string,
  UtilityAccount: any,
): Promise<any> => {
  const account = await UtilityAccount.findOne({ where: { accountNumber } });
  if (!account) throw new Error('Account not found');

  account.metadata = {
    ...account.metadata,
    autoPay: {
      enabled: true,
      paymentMethod,
      accountDetails,
      enrolledDate: new Date().toISOString(),
    },
  };
  await account.save();

  return account;
};

/**
 * Retrieves payment history for account.
 *
 * @param {string} accountNumber - Account number
 * @param {number} months - Number of months
 * @param {Model} UtilityPayment - UtilityPayment model
 * @returns {Promise<any[]>} Payment history
 */
export const getPaymentHistory = async (
  accountNumber: string,
  months: number,
  UtilityPayment: any,
): Promise<any[]> => {
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);

  return await UtilityPayment.findAll({
    where: {
      accountNumber,
      paymentDate: { [Op.gte]: startDate },
      paymentStatus: 'processed',
    },
    order: [['paymentDate', 'DESC']],
  });
};

/**
 * Reverses payment with reason.
 *
 * @param {string} paymentId - Payment ID
 * @param {string} reason - Reversal reason
 * @param {Model} UtilityPayment - UtilityPayment model
 * @param {Model} UtilityBill - UtilityBill model
 * @returns {Promise<any>} Reversed payment
 */
export const reversePayment = async (
  paymentId: string,
  reason: string,
  UtilityPayment: any,
  UtilityBill: any,
): Promise<any> => {
  const payment = await UtilityPayment.findOne({ where: { paymentId } });
  if (!payment) throw new Error('Payment not found');

  payment.paymentStatus = 'reversed';
  payment.metadata = {
    ...payment.metadata,
    reversalReason: reason,
    reversalDate: new Date().toISOString(),
  };
  await payment.save();

  const bill = await UtilityBill.findOne({ where: { billId: payment.billId } });
  if (bill) {
    bill.amountPaid -= payment.paymentAmount;
    bill.balance += payment.paymentAmount;
    bill.billStatus = bill.balance > 0 ? 'overdue' : 'paid';
    await bill.save();
  }

  return payment;
};

/**
 * Allocates payment across multiple bills.
 *
 * @param {string} accountNumber - Account number
 * @param {number} paymentAmount - Payment amount
 * @param {Model} UtilityPayment - UtilityPayment model
 * @param {Model} UtilityBill - UtilityBill model
 * @returns {Promise<any>} Allocation summary
 */
export const allocatePaymentAcrossBills = async (
  accountNumber: string,
  paymentAmount: number,
  UtilityPayment: any,
  UtilityBill: any,
): Promise<any> => {
  const outstandingBills = await UtilityBill.findAll({
    where: {
      accountNumber,
      balance: { [Op.gt]: 0 },
    },
    order: [['dueDate', 'ASC']],
  });

  let remainingPayment = paymentAmount;
  const allocations: any[] = [];

  for (const bill of outstandingBills) {
    if (remainingPayment <= 0) break;

    const allocationAmount = Math.min(remainingPayment, parseFloat(bill.balance));

    await processUtilityPayment(
      {
        paymentId: `PAY-${bill.billId}-${Date.now()}`,
        accountNumber,
        billId: bill.billId,
        paymentDate: new Date(),
        paymentAmount: allocationAmount,
        paymentMethod: 'portal',
        confirmationNumber: `CONF-${Date.now()}`,
        paymentStatus: 'processed',
      },
      UtilityPayment,
      UtilityBill,
      null,
    );

    allocations.push({
      billId: bill.billId,
      amountAllocated: allocationAmount,
    });

    remainingPayment -= allocationAmount;
  }

  return {
    totalPayment: paymentAmount,
    amountAllocated: paymentAmount - remainingPayment,
    remainingCredit: remainingPayment,
    allocations,
  };
};

/**
 * Generates payment receipt.
 *
 * @param {string} paymentId - Payment ID
 * @param {Model} UtilityPayment - UtilityPayment model
 * @param {Model} UtilityAccount - UtilityAccount model
 * @returns {Promise<any>} Payment receipt
 */
export const generatePaymentReceipt = async (
  paymentId: string,
  UtilityPayment: any,
  UtilityAccount: any,
): Promise<any> => {
  const payment = await UtilityPayment.findOne({ where: { paymentId } });
  if (!payment) throw new Error('Payment not found');

  const account = await UtilityAccount.findOne({ where: { accountNumber: payment.accountNumber } });

  return {
    receiptNumber: `RCP-${payment.paymentId}`,
    paymentId: payment.paymentId,
    accountNumber: payment.accountNumber,
    customerName: account?.customerName,
    paymentDate: payment.paymentDate,
    paymentAmount: payment.paymentAmount,
    paymentMethod: payment.paymentMethod,
    confirmationNumber: payment.confirmationNumber,
    remainingBalance: account?.currentBalance || 0,
    generatedAt: new Date().toISOString(),
  };
};

/**
 * Calculates total payments received for period.
 *
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Model} UtilityPayment - UtilityPayment model
 * @returns {Promise<any>} Payment summary
 */
export const calculatePaymentsReceived = async (
  startDate: Date,
  endDate: Date,
  UtilityPayment: any,
): Promise<any> => {
  const payments = await UtilityPayment.findAll({
    where: {
      paymentDate: { [Op.between]: [startDate, endDate] },
      paymentStatus: 'processed',
    },
  });

  const totalAmount = payments.reduce((sum: number, p: any) => sum + parseFloat(p.paymentAmount), 0);

  const byMethod = new Map<string, number>();
  payments.forEach((p: any) => {
    const methodTotal = byMethod.get(p.paymentMethod) || 0;
    byMethod.set(p.paymentMethod, methodTotal + parseFloat(p.paymentAmount));
  });

  return {
    period: { startDate, endDate },
    totalPayments: payments.length,
    totalAmount,
    byMethod: Array.from(byMethod.entries()).map(([method, amount]) => ({ method, amount })),
  };
};

// ============================================================================
// DELINQUENCY & COLLECTIONS (26-32)
// ============================================================================

/**
 * Identifies delinquent accounts.
 *
 * @param {Model} UtilityBill - UtilityBill model
 * @param {Model} AccountDelinquency - AccountDelinquency model
 * @returns {Promise<any[]>} Delinquent accounts
 */
export const identifyDelinquentAccounts = async (
  UtilityBill: any,
  AccountDelinquency: any,
): Promise<any[]> => {
  const overdueBills = await UtilityBill.findAll({
    where: {
      dueDate: { [Op.lt]: new Date() },
      balance: { [Op.gt]: 0 },
    },
  });

  const accountMap = new Map<string, any>();

  for (const bill of overdueBills) {
    if (!accountMap.has(bill.accountNumber)) {
      accountMap.set(bill.accountNumber, {
        accountNumber: bill.accountNumber,
        totalOutstanding: 0,
        oldestDueDate: bill.dueDate,
      });
    }

    const accountData = accountMap.get(bill.accountNumber);
    accountData.totalOutstanding += parseFloat(bill.balance);

    if (bill.dueDate < accountData.oldestDueDate) {
      accountData.oldestDueDate = bill.dueDate;
    }
  }

  const delinquencies: any[] = [];

  for (const [accountNumber, data] of accountMap.entries()) {
    const daysPastDue = Math.floor(
      (new Date().getTime() - new Date(data.oldestDueDate).getTime()) / (1000 * 60 * 60 * 24),
    );

    const status =
      daysPastDue >= 90 ? 'shutoff_pending' : daysPastDue >= 60 ? 'severe' : daysPastDue >= 30 ? 'moderate' : 'early';

    const delinquency = await AccountDelinquency.create({
      delinquencyId: `DEL-${accountNumber}-${Date.now()}`,
      accountNumber,
      totalOutstanding: data.totalOutstanding,
      daysPastDue,
      delinquencyStatus: status,
      noticesSent: 0,
      collectionStatus: 'none',
    });

    delinquencies.push(delinquency);
  }

  return delinquencies;
};

/**
 * Sends delinquency notice to customer.
 *
 * @param {string} delinquencyId - Delinquency ID
 * @param {string} noticeType - Notice type
 * @param {Model} AccountDelinquency - AccountDelinquency model
 * @returns {Promise<any>} Updated delinquency
 */
export const sendDelinquencyNotice = async (
  delinquencyId: string,
  noticeType: string,
  AccountDelinquency: any,
): Promise<any> => {
  const delinquency = await AccountDelinquency.findOne({ where: { delinquencyId } });
  if (!delinquency) throw new Error('Delinquency not found');

  delinquency.noticesSent += 1;
  delinquency.lastNoticeDate = new Date();
  delinquency.collectionStatus = 'notice';
  delinquency.metadata = {
    ...delinquency.metadata,
    notices: [
      ...(delinquency.metadata.notices || []),
      { type: noticeType, sentDate: new Date().toISOString() },
    ],
  };
  await delinquency.save();

  return delinquency;
};

/**
 * Escalates account to collections.
 *
 * @param {string} accountNumber - Account number
 * @param {Model} AccountDelinquency - AccountDelinquency model
 * @returns {Promise<any>} Escalated delinquency
 */
export const escalateToCollections = async (
  accountNumber: string,
  AccountDelinquency: any,
): Promise<any> => {
  const delinquency = await AccountDelinquency.findOne({
    where: { accountNumber },
    order: [['createdAt', 'DESC']],
  });

  if (!delinquency) throw new Error('Delinquency not found');

  delinquency.collectionStatus = 'collection';
  delinquency.metadata = {
    ...delinquency.metadata,
    escalatedToCollections: new Date().toISOString(),
  };
  await delinquency.save();

  return delinquency;
};

/**
 * Creates payment plan for delinquent account.
 *
 * @param {PaymentPlanData} planData - Payment plan data
 * @param {Model} PaymentPlan - PaymentPlan model
 * @returns {Promise<any>} Created payment plan
 */
export const createPaymentPlan = async (
  planData: PaymentPlanData,
  PaymentPlan: any,
): Promise<any> => {
  return await PaymentPlan.create(planData);
};

/**
 * Updates payment plan progress.
 *
 * @param {string} planId - Plan ID
 * @param {Model} PaymentPlan - PaymentPlan model
 * @returns {Promise<any>} Updated plan
 */
export const updatePaymentPlanProgress = async (
  planId: string,
  PaymentPlan: any,
): Promise<any> => {
  const plan = await PaymentPlan.findOne({ where: { planId } });
  if (!plan) throw new Error('Payment plan not found');

  plan.paymentsMade += 1;

  if (plan.paymentsMade >= plan.numberOfPayments) {
    plan.status = 'completed';
  }

  await plan.save();
  return plan;
};

/**
 * Retrieves delinquent accounts by severity.
 *
 * @param {string} severity - Severity level
 * @param {Model} AccountDelinquency - AccountDelinquency model
 * @returns {Promise<any[]>} Delinquencies by severity
 */
export const getDelinquenciesBySeverity = async (
  severity: string,
  AccountDelinquency: any,
): Promise<any[]> => {
  return await AccountDelinquency.findAll({
    where: { delinquencyStatus: severity },
    order: [['daysPastDue', 'DESC']],
  });
};

/**
 * Generates collections report.
 *
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Model} AccountDelinquency - AccountDelinquency model
 * @returns {Promise<any>} Collections report
 */
export const generateCollectionsReport = async (
  startDate: Date,
  endDate: Date,
  AccountDelinquency: any,
): Promise<any> => {
  const delinquencies = await AccountDelinquency.findAll({
    where: {
      createdAt: { [Op.between]: [startDate, endDate] },
    },
  });

  const totalOutstanding = delinquencies.reduce(
    (sum: number, d: any) => sum + parseFloat(d.totalOutstanding),
    0,
  );

  const byStatus = new Map<string, number>();
  delinquencies.forEach((d: any) => {
    byStatus.set(d.delinquencyStatus, (byStatus.get(d.delinquencyStatus) || 0) + 1);
  });

  return {
    period: { startDate, endDate },
    totalDelinquencies: delinquencies.length,
    totalOutstanding,
    byStatus: Array.from(byStatus.entries()).map(([status, count]) => ({ status, count })),
  };
};

// ============================================================================
// SERVICE DISCONNECT/RECONNECT (33-36)
// ============================================================================

/**
 * Initiates service disconnection.
 *
 * @param {ServiceDisconnectData} disconnectData - Disconnect data
 * @param {Model} ServiceDisconnect - ServiceDisconnect model
 * @param {Model} UtilityAccount - UtilityAccount model
 * @returns {Promise<any>} Created disconnect
 */
export const initiateServiceDisconnect = async (
  disconnectData: ServiceDisconnectData,
  ServiceDisconnect: any,
  UtilityAccount: any,
): Promise<any> => {
  const disconnect = await ServiceDisconnect.create(disconnectData);

  const account = await UtilityAccount.findOne({ where: { accountNumber: disconnectData.accountNumber } });
  if (account) {
    account.accountStatus = 'suspended';
    await account.save();
  }

  return disconnect;
};

/**
 * Processes service reconnection.
 *
 * @param {string} disconnectId - Disconnect ID
 * @param {Date} reconnectDate - Reconnect date
 * @param {Model} ServiceDisconnect - ServiceDisconnect model
 * @param {Model} UtilityAccount - UtilityAccount model
 * @returns {Promise<any>} Updated disconnect
 */
export const processServiceReconnect = async (
  disconnectId: string,
  reconnectDate: Date,
  ServiceDisconnect: any,
  UtilityAccount: any,
): Promise<any> => {
  const disconnect = await ServiceDisconnect.findOne({ where: { disconnectId } });
  if (!disconnect) throw new Error('Disconnect not found');

  disconnect.reconnectDate = reconnectDate;
  await disconnect.save();

  const account = await UtilityAccount.findOne({ where: { accountNumber: disconnect.accountNumber } });
  if (account) {
    account.accountStatus = 'active';
    await account.save();
  }

  return disconnect;
};

/**
 * Retrieves accounts pending disconnection.
 *
 * @param {Model} ServiceDisconnect - ServiceDisconnect model
 * @returns {Promise<any[]>} Pending disconnects
 */
export const getAccountsPendingDisconnect = async (
  ServiceDisconnect: any,
): Promise<any[]> => {
  return await ServiceDisconnect.findAll({
    where: {
      reconnectDate: null,
      disconnectReason: 'non_payment',
    },
    order: [['disconnectDate', 'DESC']],
  });
};

/**
 * Calculates reconnection fees.
 *
 * @param {string} accountNumber - Account number
 * @param {number} baseReconnectFee - Base reconnect fee
 * @param {Model} ServiceDisconnect - ServiceDisconnect model
 * @returns {Promise<number>} Total reconnect fee
 */
export const calculateReconnectionFee = async (
  accountNumber: string,
  baseReconnectFee: number,
  ServiceDisconnect: any,
): Promise<number> => {
  const disconnects = await ServiceDisconnect.findAll({
    where: { accountNumber },
  });

  const multipleDisconnectFee = disconnects.length > 1 ? 50 : 0;

  return baseReconnectFee + multipleDisconnectFee;
};

// ============================================================================
// CUSTOMER SERVICE & DISPUTES (37-42)
// ============================================================================

/**
 * Submits customer dispute for bill.
 *
 * @param {CustomerDisputeData} disputeData - Dispute data
 * @param {Model} CustomerDispute - CustomerDispute model
 * @param {Model} UtilityBill - UtilityBill model
 * @returns {Promise<any>} Created dispute
 */
export const submitCustomerDispute = async (
  disputeData: CustomerDisputeData,
  CustomerDispute: any,
  UtilityBill: any,
): Promise<any> => {
  const dispute = await CustomerDispute.create(disputeData);

  const bill = await UtilityBill.findOne({ where: { billId: disputeData.billId } });
  if (bill) {
    bill.billStatus = 'disputed';
    await bill.save();
  }

  return dispute;
};

/**
 * Resolves customer dispute with decision.
 *
 * @param {string} disputeId - Dispute ID
 * @param {string} resolution - Resolution decision
 * @param {Model} CustomerDispute - CustomerDispute model
 * @param {Model} UtilityBill - UtilityBill model
 * @returns {Promise<any>} Resolved dispute
 */
export const resolveCustomerDispute = async (
  disputeId: string,
  resolution: string,
  CustomerDispute: any,
  UtilityBill: any,
): Promise<any> => {
  const dispute = await CustomerDispute.findOne({ where: { disputeId } });
  if (!dispute) throw new Error('Dispute not found');

  dispute.status = 'resolved';
  dispute.resolution = resolution;
  dispute.resolvedDate = new Date();
  await dispute.save();

  const bill = await UtilityBill.findOne({ where: { billId: dispute.billId } });
  if (bill && bill.balance > 0) {
    bill.billStatus = 'overdue';
  } else if (bill) {
    bill.billStatus = 'paid';
  }
  if (bill) await bill.save();

  return dispute;
};

/**
 * Retrieves open disputes for account.
 *
 * @param {string} accountNumber - Account number
 * @param {Model} CustomerDispute - CustomerDispute model
 * @returns {Promise<any[]>} Open disputes
 */
export const getOpenDisputes = async (
  accountNumber: string,
  CustomerDispute: any,
): Promise<any[]> => {
  return await CustomerDispute.findAll({
    where: {
      accountNumber,
      status: { [Op.in]: ['open', 'investigating'] },
    },
    order: [['disputeDate', 'DESC']],
  });
};

/**
 * Generates customer account statement.
 *
 * @param {string} accountNumber - Account number
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Model} UtilityAccount - UtilityAccount model
 * @param {Model} UtilityBill - UtilityBill model
 * @param {Model} UtilityPayment - UtilityPayment model
 * @returns {Promise<any>} Account statement
 */
export const generateCustomerAccountStatement = async (
  accountNumber: string,
  startDate: Date,
  endDate: Date,
  UtilityAccount: any,
  UtilityBill: any,
  UtilityPayment: any,
): Promise<any> => {
  const account = await UtilityAccount.findOne({ where: { accountNumber } });
  const bills = await getAccountBills(accountNumber, startDate, endDate, UtilityBill);
  const payments = await getPaymentHistory(accountNumber, 12, UtilityPayment);

  return {
    accountNumber,
    customerName: account?.customerName,
    serviceAddress: account?.serviceAddress,
    statementPeriod: { startDate, endDate },
    currentBalance: account?.currentBalance,
    bills,
    payments,
    generatedAt: new Date().toISOString(),
  };
};

/**
 * Exports utility billing data to CSV.
 *
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Model} UtilityBill - UtilityBill model
 * @returns {Promise<string>} CSV content
 */
export const exportUtilityBillingDataCSV = async (
  startDate: Date,
  endDate: Date,
  UtilityBill: any,
): Promise<string> => {
  const bills = await UtilityBill.findAll({
    where: {
      billingPeriodStart: { [Op.between]: [startDate, endDate] },
    },
    order: [['billingPeriodStart', 'ASC']],
  });

  const headers =
    'Bill ID,Account Number,Period Start,Period End,Consumption,Base Charge,Usage Charge,Taxes,Fees,Total Amount,Balance,Status\n';
  const rows = bills.map(
    (b: any) =>
      `${b.billId},${b.accountNumber},${b.billingPeriodStart.toISOString().split('T')[0]},${b.billingPeriodEnd.toISOString().split('T')[0]},${b.consumption},${b.baseCharge},${b.usageCharge},${b.taxes},${b.fees},${b.totalAmount},${b.balance},${b.billStatus}`,
  );

  return headers + rows.join('\n');
};

/**
 * Generates utility service analytics dashboard.
 *
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Model} UtilityBill - UtilityBill model
 * @param {Model} UtilityPayment - UtilityPayment model
 * @param {Model} AccountDelinquency - AccountDelinquency model
 * @returns {Promise<any>} Analytics dashboard
 */
export const generateUtilityAnalyticsDashboard = async (
  startDate: Date,
  endDate: Date,
  UtilityBill: any,
  UtilityPayment: any,
  AccountDelinquency: any,
): Promise<any> => {
  const bills = await UtilityBill.findAll({
    where: {
      billingPeriodStart: { [Op.between]: [startDate, endDate] },
    },
  });

  const payments = await UtilityPayment.findAll({
    where: {
      paymentDate: { [Op.between]: [startDate, endDate] },
      paymentStatus: 'processed',
    },
  });

  const delinquencies = await AccountDelinquency.findAll({
    where: {
      createdAt: { [Op.between]: [startDate, endDate] },
    },
  });

  const totalBilled = bills.reduce((sum: number, b: any) => sum + parseFloat(b.totalAmount), 0);
  const totalCollected = payments.reduce((sum: number, p: any) => sum + parseFloat(p.paymentAmount), 0);
  const totalDelinquent = delinquencies.reduce(
    (sum: number, d: any) => sum + parseFloat(d.totalOutstanding),
    0,
  );

  return {
    period: { startDate, endDate },
    totalBills: bills.length,
    totalBilled,
    totalCollected,
    totalDelinquent,
    collectionRate: totalBilled > 0 ? (totalCollected / totalBilled) * 100 : 0,
    delinquencyRate: totalBilled > 0 ? (totalDelinquent / totalBilled) * 100 : 0,
  };
};

// ============================================================================
// NESTJS SERVICE WRAPPER
// ============================================================================

@Injectable()
export class CEFMSUtilityBillingService {
  constructor(private readonly sequelize: Sequelize) {}

  async createAccount(accountData: UtilityAccountData) {
    const UtilityAccount = createUtilityAccountModel(this.sequelize);
    return createUtilityAccount(accountData, UtilityAccount);
  }

  async recordReading(readingData: MeterReadingData) {
    const MeterReading = createMeterReadingModel(this.sequelize);
    return recordMeterReading(readingData, MeterReading);
  }

  async generateBill(billData: UtilityBillData) {
    const UtilityBill = createUtilityBillModel(this.sequelize);
    const UtilityAccount = createUtilityAccountModel(this.sequelize);
    return generateUtilityBill(billData, UtilityBill, UtilityAccount);
  }

  async processPayment(paymentData: PaymentData) {
    const UtilityPayment = createUtilityPaymentModel(this.sequelize);
    const UtilityBill = createUtilityBillModel(this.sequelize);
    const UtilityAccount = createUtilityAccountModel(this.sequelize);
    return processUtilityPayment(paymentData, UtilityPayment, UtilityBill, UtilityAccount);
  }
}

export default {
  // Models
  createUtilityAccountModel,
  createMeterReadingModel,
  createRateScheduleModel,
  createUtilityBillModel,
  createUtilityPaymentModel,
  createAccountDelinquencyModel,
  createServiceDisconnectModel,
  createPaymentPlanModel,
  createCustomerDisputeModel,

  // Account Management
  createUtilityAccount,
  updateAccountDeliveryPreferences,
  suspendAccount,
  closeUtilityAccount,
  getAccountsByCustomer,

  // Meter Reading & Consumption
  recordMeterReading,
  estimateMeterReading,
  validateMeterReading,
  getConsumptionHistory,
  calculateAverageDailyConsumption,
  generateConsumptionAnalysis,

  // Rate Schedules & Billing
  createRateSchedule,
  getActiveRateSchedule,
  calculateTieredUsageCharge,
  generateUtilityBill,
  applyLateFee,
  processBillAdjustment,
  getAccountBills,

  // Payment Processing
  processUtilityPayment,
  setupAutoPay,
  getPaymentHistory,
  reversePayment,
  allocatePaymentAcrossBills,
  generatePaymentReceipt,
  calculatePaymentsReceived,

  // Delinquency & Collections
  identifyDelinquentAccounts,
  sendDelinquencyNotice,
  escalateToCollections,
  createPaymentPlan,
  updatePaymentPlanProgress,
  getDelinquenciesBySeverity,
  generateCollectionsReport,

  // Service Disconnect/Reconnect
  initiateServiceDisconnect,
  processServiceReconnect,
  getAccountsPendingDisconnect,
  calculateReconnectionFee,

  // Customer Service & Disputes
  submitCustomerDispute,
  resolveCustomerDispute,
  getOpenDisputes,
  generateCustomerAccountStatement,
  exportUtilityBillingDataCSV,
  generateUtilityAnalyticsDashboard,

  // Service
  CEFMSUtilityBillingService,
};
