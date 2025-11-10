/**
 * CEFMS Vendor Payment Processing Service
 *
 * This service provides comprehensive vendor payment processing functionality including
 * payment schedules, invoice matching, payment terms management, electronic funds transfer,
 * and payment reconciliation for the Corps of Engineers Financial Management System (CEFMS).
 *
 * Key Features:
 * - Vendor payment scheduling and processing
 * - Three-way matching (PO, receipt, invoice)
 * - Payment terms and discount management
 * - Electronic funds transfer (EFT) and wire payments
 * - Payment holds and releases
 * - Vendor payment history and reconciliation
 * - Payment approval workflows
 * - Prompt Payment Act compliance
 *
 * @module CEFMSVendorPaymentProcessingService
 */

import { Injectable, Logger, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { Sequelize, DataTypes, Model, Transaction, Op, QueryTypes } from 'sequelize';
import {
  createVendorInvoiceModel,
  createPurchaseOrderModel
} from '../cefms-vendor-invoice-processing-composite';

/**
 * Payment status enumeration
 */
export enum PaymentStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  SCHEDULED = 'SCHEDULED',
  IN_PROCESS = 'IN_PROCESS',
  PAID = 'PAID',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  ON_HOLD = 'ON_HOLD'
}

/**
 * Payment method enumeration
 */
export enum PaymentMethod {
  EFT = 'EFT',
  WIRE = 'WIRE',
  CHECK = 'CHECK',
  ACH = 'ACH',
  CREDIT_CARD = 'CREDIT_CARD'
}

/**
 * Payment terms enumeration
 */
export enum PaymentTerms {
  NET_10 = 'NET_10',
  NET_15 = 'NET_15',
  NET_30 = 'NET_30',
  NET_45 = 'NET_45',
  NET_60 = 'NET_60',
  NET_90 = 'NET_90',
  TWO_TEN_NET_30 = '2_10_NET_30',
  ONE_TEN_NET_30 = '1_10_NET_30',
  DUE_ON_RECEIPT = 'DUE_ON_RECEIPT',
  COD = 'COD',
  MILESTONE_BASED = 'MILESTONE_BASED'
}

/**
 * Hold reason enumeration
 */
export enum HoldReason {
  DISPUTE = 'DISPUTE',
  MISSING_DOCUMENTATION = 'MISSING_DOCUMENTATION',
  QUALITY_ISSUE = 'QUALITY_ISSUE',
  VENDOR_INVESTIGATION = 'VENDOR_INVESTIGATION',
  FUNDING_ISSUE = 'FUNDING_ISSUE',
  AUDIT_REVIEW = 'AUDIT_REVIEW',
  COMPLIANCE_CHECK = 'COMPLIANCE_CHECK'
}

/**
 * Matching status enumeration
 */
export enum MatchingStatus {
  NOT_MATCHED = 'NOT_MATCHED',
  PARTIALLY_MATCHED = 'PARTIALLY_MATCHED',
  FULLY_MATCHED = 'FULLY_MATCHED',
  MISMATCH = 'MISMATCH',
  OVERRIDE = 'OVERRIDE'
}

/**
 * Vendor payment data interface
 */
export interface VendorPaymentData {
  vendorId: string;
  invoiceId: string;
  purchaseOrderId?: string;
  paymentAmount: number;
  discountAmount?: number;
  taxAmount?: number;
  netPaymentAmount: number;
  paymentMethod: PaymentMethod;
  paymentTerms: PaymentTerms;
  paymentDate: Date;
  dueDate: Date;
  description: string;
  accountingCodes: string[];
  metadata?: Record<string, any>;
}

/**
 * Payment schedule data interface
 */
export interface PaymentScheduleData {
  contractId: string;
  vendorId: string;
  scheduleType: 'FIXED' | 'MILESTONE' | 'PROGRESS' | 'RECURRING';
  totalAmount: number;
  numberOfPayments: number;
  paymentFrequency?: 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY' | 'QUARTERLY';
  startDate: Date;
  endDate?: Date;
  paymentPercentages?: number[];
  milestoneIds?: string[];
}

/**
 * Three-way match data interface
 */
export interface ThreeWayMatchData {
  purchaseOrderId: string;
  receiptId: string;
  invoiceId: string;
  tolerancePercentage: number;
}

/**
 * Payment hold data interface
 */
export interface PaymentHoldData {
  paymentId: string;
  holdReason: HoldReason;
  holdDescription: string;
  expectedReleaseDate?: Date;
  requiredActions: string[];
}

/**
 * Vendor payment model
 */
export const createVendorPaymentModel = (sequelize: Sequelize) => {
  class VendorPayment extends Model {
    public id!: string;
    public paymentNumber!: string;
    public vendorId!: string;
    public vendorName!: string;
    public invoiceId!: string;
    public invoiceNumber!: string;
    public purchaseOrderId!: string;
    public poNumber!: string;
    public contractId!: string;
    public paymentAmount!: number;
    public discountAmount!: number;
    public taxAmount!: number;
    public netPaymentAmount!: number;
    public paymentMethod!: PaymentMethod;
    public paymentTerms!: PaymentTerms;
    public status!: PaymentStatus;
    public paymentDate!: Date;
    public dueDate!: Date;
    public paidDate!: Date;
    public approvedBy!: string;
    public approvedDate!: Date;
    public processedBy!: string;
    public processedDate!: Date;
    public confirmationNumber!: string;
    public description!: string;
    public accountingCodes!: string[];
    public discountTaken!: boolean;
    public discountEligibleUntil!: Date;
    public latePaymentPenalty!: number;
    public promptPaymentInterest!: number;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  VendorPayment.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        comment: 'Unique identifier for the payment'
      },
      paymentNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Unique payment number'
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
      invoiceId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Reference to the invoice'
      },
      invoiceNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Invoice number for reference'
      },
      purchaseOrderId: {
        type: DataTypes.UUID,
        allowNull: true,
        comment: 'Reference to the purchase order'
      },
      poNumber: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'PO number for reference'
      },
      contractId: {
        type: DataTypes.UUID,
        allowNull: true,
        comment: 'Reference to the contract'
      },
      paymentAmount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        comment: 'Payment amount before adjustments'
      },
      discountAmount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Discount amount'
      },
      taxAmount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Tax amount'
      },
      netPaymentAmount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        comment: 'Net payment amount after all adjustments'
      },
      paymentMethod: {
        type: DataTypes.ENUM(...Object.values(PaymentMethod)),
        allowNull: false,
        comment: 'Method of payment'
      },
      paymentTerms: {
        type: DataTypes.ENUM(...Object.values(PaymentTerms)),
        allowNull: false,
        comment: 'Payment terms'
      },
      status: {
        type: DataTypes.ENUM(...Object.values(PaymentStatus)),
        allowNull: false,
        defaultValue: PaymentStatus.PENDING,
        comment: 'Current payment status'
      },
      paymentDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Scheduled payment date'
      },
      dueDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Payment due date'
      },
      paidDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Actual date payment was made'
      },
      approvedBy: {
        type: DataTypes.STRING(200),
        allowNull: true,
        comment: 'Person who approved the payment'
      },
      approvedDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Date payment was approved'
      },
      processedBy: {
        type: DataTypes.STRING(200),
        allowNull: true,
        comment: 'Person who processed the payment'
      },
      processedDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Date payment was processed'
      },
      confirmationNumber: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Payment confirmation/transaction number'
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Payment description'
      },
      accountingCodes: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        comment: 'Accounting codes for the payment'
      },
      discountTaken: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Whether early payment discount was taken'
      },
      discountEligibleUntil: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Date until which discount is eligible'
      },
      latePaymentPenalty: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Late payment penalty amount'
      },
      promptPaymentInterest: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Prompt Payment Act interest amount'
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
        comment: 'Additional payment metadata'
      }
    },
    {
      sequelize,
      tableName: 'vendor_payments',
      timestamps: true,
      indexes: [
        { fields: ['paymentNumber'], unique: true },
        { fields: ['vendorId'] },
        { fields: ['invoiceId'] },
        { fields: ['purchaseOrderId'] },
        { fields: ['contractId'] },
        { fields: ['status'] },
        { fields: ['paymentDate'] },
        { fields: ['dueDate'] },
        { fields: ['paidDate'] }
      ]
    }
  );

  return VendorPayment;
};

/**
 * Payment schedule model
 */
export const createPaymentScheduleModel = (sequelize: Sequelize) => {
  class PaymentSchedule extends Model {
    public id!: string;
    public scheduleNumber!: string;
    public contractId!: string;
    public vendorId!: string;
    public scheduleType!: 'FIXED' | 'MILESTONE' | 'PROGRESS' | 'RECURRING';
    public totalAmount!: number;
    public paidAmount!: number;
    public remainingAmount!: number;
    public numberOfPayments!: number;
    public completedPayments!: number;
    public paymentFrequency!: string;
    public startDate!: Date;
    public endDate!: Date;
    public status!: 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'SUSPENDED';
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  PaymentSchedule.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        comment: 'Unique identifier for the payment schedule'
      },
      scheduleNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Unique schedule number'
      },
      contractId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Reference to the contract'
      },
      vendorId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Reference to the vendor'
      },
      scheduleType: {
        type: DataTypes.ENUM('FIXED', 'MILESTONE', 'PROGRESS', 'RECURRING'),
        allowNull: false,
        comment: 'Type of payment schedule'
      },
      totalAmount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        comment: 'Total amount to be paid'
      },
      paidAmount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Amount paid to date'
      },
      remainingAmount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        comment: 'Remaining amount to be paid'
      },
      numberOfPayments: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Total number of scheduled payments'
      },
      completedPayments: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Number of completed payments'
      },
      paymentFrequency: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Payment frequency for recurring schedules'
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Schedule start date'
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Schedule end date'
      },
      status: {
        type: DataTypes.ENUM('ACTIVE', 'COMPLETED', 'CANCELLED', 'SUSPENDED'),
        allowNull: false,
        defaultValue: 'ACTIVE',
        comment: 'Schedule status'
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
        comment: 'Additional schedule metadata'
      }
    },
    {
      sequelize,
      tableName: 'payment_schedules',
      timestamps: true,
      indexes: [
        { fields: ['scheduleNumber'], unique: true },
        { fields: ['contractId'] },
        { fields: ['vendorId'] },
        { fields: ['status'] }
      ]
    }
  );

  return PaymentSchedule;
};

/**
 * Payment matching model
 */
export const createPaymentMatchingModel = (sequelize: Sequelize) => {
  class PaymentMatching extends Model {
    public id!: string;
    public invoiceId!: string;
    public purchaseOrderId!: string;
    public receiptId!: string;
    public matchingStatus!: MatchingStatus;
    public quantityOrdered!: number;
    public quantityReceived!: number;
    public quantityInvoiced!: number;
    public amountOrdered!: number;
    public amountReceived!: number;
    public amountInvoiced!: number;
    public quantityVariance!: number;
    public amountVariance!: number;
    public variancePercentage!: number;
    public tolerancePercentage!: number;
    public withinTolerance!: boolean;
    public matchedBy!: string;
    public matchedDate!: Date;
    public overrideReason!: string;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  PaymentMatching.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        comment: 'Unique identifier for the matching record'
      },
      invoiceId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Reference to the invoice'
      },
      purchaseOrderId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Reference to the purchase order'
      },
      receiptId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Reference to the receipt'
      },
      matchingStatus: {
        type: DataTypes.ENUM(...Object.values(MatchingStatus)),
        allowNull: false,
        defaultValue: MatchingStatus.NOT_MATCHED,
        comment: 'Current matching status'
      },
      quantityOrdered: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        comment: 'Quantity ordered from PO'
      },
      quantityReceived: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        comment: 'Quantity received per receipt'
      },
      quantityInvoiced: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        comment: 'Quantity invoiced'
      },
      amountOrdered: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        comment: 'Amount ordered from PO'
      },
      amountReceived: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        comment: 'Amount for received goods'
      },
      amountInvoiced: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        comment: 'Amount invoiced'
      },
      quantityVariance: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        comment: 'Quantity variance'
      },
      amountVariance: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        comment: 'Amount variance'
      },
      variancePercentage: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        comment: 'Variance percentage'
      },
      tolerancePercentage: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 5.0,
        comment: 'Acceptable variance tolerance'
      },
      withinTolerance: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        comment: 'Whether variance is within tolerance'
      },
      matchedBy: {
        type: DataTypes.STRING(200),
        allowNull: true,
        comment: 'Person who performed matching'
      },
      matchedDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Date matching was performed'
      },
      overrideReason: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Reason for match override'
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
        comment: 'Additional matching metadata'
      }
    },
    {
      sequelize,
      tableName: 'payment_matching',
      timestamps: true,
      indexes: [
        { fields: ['invoiceId'] },
        { fields: ['purchaseOrderId'] },
        { fields: ['receiptId'] },
        { fields: ['matchingStatus'] },
        { fields: ['invoiceId', 'purchaseOrderId', 'receiptId'], unique: true }
      ]
    }
  );

  return PaymentMatching;
};

/**
 * Payment hold model
 */
export const createPaymentHoldModel = (sequelize: Sequelize) => {
  class PaymentHold extends Model {
    public id!: string;
    public paymentId!: string;
    public holdReason!: HoldReason;
    public holdDescription!: string;
    public holdInitiatedBy!: string;
    public holdInitiatedDate!: Date;
    public expectedReleaseDate!: Date;
    public actualReleaseDate!: Date;
    public releasedBy!: string;
    public requiredActions!: string[];
    public completedActions!: string[];
    public status!: 'ACTIVE' | 'RELEASED' | 'ESCALATED';
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  PaymentHold.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        comment: 'Unique identifier for the payment hold'
      },
      paymentId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Reference to the payment'
      },
      holdReason: {
        type: DataTypes.ENUM(...Object.values(HoldReason)),
        allowNull: false,
        comment: 'Reason for payment hold'
      },
      holdDescription: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Detailed description of the hold'
      },
      holdInitiatedBy: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Person who initiated the hold'
      },
      holdInitiatedDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: 'Date hold was initiated'
      },
      expectedReleaseDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Expected date hold will be released'
      },
      actualReleaseDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Actual date hold was released'
      },
      releasedBy: {
        type: DataTypes.STRING(200),
        allowNull: true,
        comment: 'Person who released the hold'
      },
      requiredActions: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        allowNull: false,
        comment: 'Actions required to release hold'
      },
      completedActions: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        allowNull: false,
        defaultValue: [],
        comment: 'Actions that have been completed'
      },
      status: {
        type: DataTypes.ENUM('ACTIVE', 'RELEASED', 'ESCALATED'),
        allowNull: false,
        defaultValue: 'ACTIVE',
        comment: 'Hold status'
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
        comment: 'Additional hold metadata'
      }
    },
    {
      sequelize,
      tableName: 'payment_holds',
      timestamps: true,
      indexes: [
        { fields: ['paymentId'] },
        { fields: ['holdReason'] },
        { fields: ['status'] },
        { fields: ['holdInitiatedDate'] }
      ]
    }
  );

  return PaymentHold;
};

/**
 * Payment reconciliation model
 */
export const createPaymentReconciliationModel = (sequelize: Sequelize) => {
  class PaymentReconciliation extends Model {
    public id!: string;
    public reconciliationNumber!: string;
    public reconciliationPeriod!: string;
    public startDate!: Date;
    public endDate!: Date;
    public totalPaymentsProcessed!: number;
    public totalAmountPaid!: number;
    public numberOfDiscrepancies!: number;
    public discrepancyAmount!: number;
    public reconciledBy!: string;
    public reconciledDate!: Date;
    public status!: 'IN_PROGRESS' | 'COMPLETED' | 'REVIEWED';
    public notes!: string;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  PaymentReconciliation.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        comment: 'Unique identifier for the reconciliation'
      },
      reconciliationNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Unique reconciliation number'
      },
      reconciliationPeriod: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Reconciliation period (e.g., 2024-Q1)'
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Period start date'
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Period end date'
      },
      totalPaymentsProcessed: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Total number of payments processed'
      },
      totalAmountPaid: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Total amount paid'
      },
      numberOfDiscrepancies: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Number of discrepancies found'
      },
      discrepancyAmount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Total discrepancy amount'
      },
      reconciledBy: {
        type: DataTypes.STRING(200),
        allowNull: true,
        comment: 'Person who performed reconciliation'
      },
      reconciledDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Date reconciliation was completed'
      },
      status: {
        type: DataTypes.ENUM('IN_PROGRESS', 'COMPLETED', 'REVIEWED'),
        allowNull: false,
        defaultValue: 'IN_PROGRESS',
        comment: 'Reconciliation status'
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Reconciliation notes'
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
        comment: 'Additional reconciliation metadata'
      }
    },
    {
      sequelize,
      tableName: 'payment_reconciliations',
      timestamps: true,
      indexes: [
        { fields: ['reconciliationNumber'], unique: true },
        { fields: ['reconciliationPeriod'] },
        { fields: ['status'] },
        { fields: ['startDate', 'endDate'] }
      ]
    }
  );

  return PaymentReconciliation;
};

/**
 * Main CEFMS Vendor Payment Processing Service
 *
 * Provides comprehensive vendor payment processing including payment scheduling,
 * three-way matching, payment terms management, and reconciliation.
 */
@Injectable()
export class CEFMSVendorPaymentProcessingService {
  private readonly logger = new Logger(CEFMSVendorPaymentProcessingService.name);

  constructor(private readonly sequelize: Sequelize) {}

  /**
   * Creates a vendor payment
   *
   * @param paymentData - Payment data
   * @param userId - User ID
   * @returns Created payment
   */
  async createVendorPayment(paymentData: VendorPaymentData, userId: string): Promise<any> {
    const transaction = await this.sequelize.transaction();

    try {
      this.logger.log(`Creating vendor payment for vendor: ${paymentData.vendorId}`);

      // Validate payment data
      await this.validatePaymentData(paymentData);

      // Generate payment number
      const paymentNumber = await this.generatePaymentNumber();

      // Get vendor name
      const vendorName = await this.getVendorName(paymentData.vendorId);

      // Get invoice details
      const invoice = await this.getInvoiceDetails(paymentData.invoiceId);

      // Calculate discount eligibility
      const { discountEligible, discountEligibleUntil } = this.calculateDiscountEligibility(
        paymentData.paymentTerms,
        invoice.invoiceDate
      );

      const VendorPayment = createVendorPaymentModel(this.sequelize);
      const payment = await VendorPayment.create(
        {
          paymentNumber,
          vendorId: paymentData.vendorId,
          vendorName,
          invoiceId: paymentData.invoiceId,
          invoiceNumber: invoice.invoiceNumber,
          purchaseOrderId: paymentData.purchaseOrderId || null,
          poNumber: invoice.poNumber || null,
          contractId: invoice.contractId || null,
          paymentAmount: paymentData.paymentAmount,
          discountAmount: paymentData.discountAmount || 0,
          taxAmount: paymentData.taxAmount || 0,
          netPaymentAmount: paymentData.netPaymentAmount,
          paymentMethod: paymentData.paymentMethod,
          paymentTerms: paymentData.paymentTerms,
          status: PaymentStatus.PENDING,
          paymentDate: paymentData.paymentDate,
          dueDate: paymentData.dueDate,
          description: paymentData.description,
          accountingCodes: paymentData.accountingCodes,
          discountTaken: false,
          discountEligibleUntil: discountEligible ? discountEligibleUntil : null,
          latePaymentPenalty: 0,
          promptPaymentInterest: 0,
          metadata: paymentData.metadata || {}
        },
        { transaction }
      );

      await transaction.commit();
      this.logger.log(`Vendor payment created: ${paymentNumber}`);

      return payment;
    } catch (error) {
      await transaction.rollback();
      this.logger.error(`Failed to create vendor payment: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Validates payment data
   *
   * @param paymentData - Payment data to validate
   */
  private async validatePaymentData(paymentData: VendorPaymentData): Promise<void> {
    if (paymentData.netPaymentAmount <= 0) {
      throw new BadRequestException('Net payment amount must be greater than zero');
    }

    if (paymentData.dueDate < new Date()) {
      throw new BadRequestException('Due date cannot be in the past');
    }

    // Verify invoice exists and is approved
    const invoice = await this.getInvoiceDetails(paymentData.invoiceId);
    if (invoice.status !== 'APPROVED') {
      throw new BadRequestException('Invoice must be approved before creating payment');
    }
  }

  /**
   * Generates a unique payment number
   *
   * @returns Generated payment number
   */
  private async generatePaymentNumber(): Promise<string> {
    const fiscalYear = new Date().getFullYear();
    const result = await this.sequelize.query(
      `SELECT COALESCE(MAX(CAST(SUBSTRING(payment_number FROM '[0-9]+$') AS INTEGER)), 0) + 1 as next_number
       FROM vendor_payments
       WHERE payment_number LIKE :pattern`,
      {
        replacements: { pattern: `PAY-${fiscalYear}-%` },
        type: QueryTypes.SELECT
      }
    );

    const nextNumber = result[0]['next_number'];
    return `PAY-${fiscalYear}-${String(nextNumber).padStart(6, '0')}`;
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
   * Gets invoice details
   *
   * @param invoiceId - Invoice ID
   * @returns Invoice details
   */
  private async getInvoiceDetails(invoiceId: string): Promise<any> {
    const result = await this.sequelize.query(
      `SELECT * FROM vendor_invoices WHERE id = :invoiceId`,
      {
        replacements: { invoiceId },
        type: QueryTypes.SELECT
      }
    );

    if (!result || result.length === 0) {
      throw new NotFoundException(`Invoice not found: ${invoiceId}`);
    }

    return result[0];
  }

  /**
   * Calculates discount eligibility based on payment terms
   *
   * @param paymentTerms - Payment terms
   * @param invoiceDate - Invoice date
   * @returns Discount eligibility info
   */
  private calculateDiscountEligibility(
    paymentTerms: PaymentTerms,
    invoiceDate: Date
  ): { discountEligible: boolean; discountEligibleUntil: Date | null } {
    const invoiceDateTime = new Date(invoiceDate).getTime();

    switch (paymentTerms) {
      case PaymentTerms.TWO_TEN_NET_30:
        return {
          discountEligible: true,
          discountEligibleUntil: new Date(invoiceDateTime + 10 * 24 * 60 * 60 * 1000)
        };
      case PaymentTerms.ONE_TEN_NET_30:
        return {
          discountEligible: true,
          discountEligibleUntil: new Date(invoiceDateTime + 10 * 24 * 60 * 60 * 1000)
        };
      default:
        return {
          discountEligible: false,
          discountEligibleUntil: null
        };
    }
  }

  /**
   * Performs three-way matching for payment validation
   *
   * @param matchData - Three-way match data
   * @param userId - User ID
   * @returns Matching result
   */
  async performThreeWayMatch(matchData: ThreeWayMatchData, userId: string): Promise<any> {
    const transaction = await this.sequelize.transaction();

    try {
      this.logger.log(`Performing three-way match for invoice: ${matchData.invoiceId}`);

      // Get PO, receipt, and invoice data
      const poData = await this.getPurchaseOrderData(matchData.purchaseOrderId);
      const receiptData = await this.getReceiptData(matchData.receiptId);
      const invoiceData = await this.getInvoiceDetails(matchData.invoiceId);

      // Calculate variances
      const quantityVariance = invoiceData.quantity - receiptData.quantityReceived;
      const amountVariance = invoiceData.totalAmount - poData.totalAmount;
      const variancePercentage = poData.totalAmount > 0
        ? Math.abs((amountVariance / poData.totalAmount) * 100)
        : 0;

      const withinTolerance = variancePercentage <= matchData.tolerancePercentage;
      const matchingStatus = this.determineMatchingStatus(
        quantityVariance,
        amountVariance,
        withinTolerance
      );

      const PaymentMatching = createPaymentMatchingModel(this.sequelize);
      const matching = await PaymentMatching.create(
        {
          invoiceId: matchData.invoiceId,
          purchaseOrderId: matchData.purchaseOrderId,
          receiptId: matchData.receiptId,
          matchingStatus,
          quantityOrdered: poData.quantity,
          quantityReceived: receiptData.quantityReceived,
          quantityInvoiced: invoiceData.quantity,
          amountOrdered: poData.totalAmount,
          amountReceived: receiptData.quantityReceived * poData.unitPrice,
          amountInvoiced: invoiceData.totalAmount,
          quantityVariance,
          amountVariance,
          variancePercentage,
          tolerancePercentage: matchData.tolerancePercentage,
          withinTolerance,
          matchedBy: await this.getUserName(userId),
          matchedDate: new Date(),
          metadata: {}
        },
        { transaction }
      );

      await transaction.commit();
      this.logger.log(`Three-way match completed: ${matchingStatus}`);

      return matching;
    } catch (error) {
      await transaction.rollback();
      this.logger.error(`Failed to perform three-way match: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Gets purchase order data
   *
   * @param poId - Purchase order ID
   * @returns Purchase order data
   */
  private async getPurchaseOrderData(poId: string): Promise<any> {
    const result = await this.sequelize.query(
      `SELECT * FROM purchase_orders WHERE id = :poId`,
      {
        replacements: { poId },
        type: QueryTypes.SELECT
      }
    );

    if (!result || result.length === 0) {
      throw new NotFoundException(`Purchase order not found: ${poId}`);
    }

    return result[0];
  }

  /**
   * Gets receipt data
   *
   * @param receiptId - Receipt ID
   * @returns Receipt data
   */
  private async getReceiptData(receiptId: string): Promise<any> {
    const result = await this.sequelize.query(
      `SELECT * FROM purchase_order_receipts WHERE id = :receiptId`,
      {
        replacements: { receiptId },
        type: QueryTypes.SELECT
      }
    );

    if (!result || result.length === 0) {
      throw new NotFoundException(`Receipt not found: ${receiptId}`);
    }

    return result[0];
  }

  /**
   * Determines matching status based on variances
   *
   * @param quantityVariance - Quantity variance
   * @param amountVariance - Amount variance
   * @param withinTolerance - Whether within tolerance
   * @returns Matching status
   */
  private determineMatchingStatus(
    quantityVariance: number,
    amountVariance: number,
    withinTolerance: boolean
  ): MatchingStatus {
    if (quantityVariance === 0 && amountVariance === 0) {
      return MatchingStatus.FULLY_MATCHED;
    } else if (withinTolerance) {
      return MatchingStatus.PARTIALLY_MATCHED;
    } else {
      return MatchingStatus.MISMATCH;
    }
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
   * Approves a payment
   *
   * @param paymentId - Payment ID
   * @param userId - User ID
   * @returns Approved payment
   */
  async approvePayment(paymentId: string, userId: string): Promise<any> {
    const transaction = await this.sequelize.transaction();

    try {
      this.logger.log(`Approving payment: ${paymentId}`);

      const VendorPayment = createVendorPaymentModel(this.sequelize);
      const payment = await VendorPayment.findByPk(paymentId, { transaction });

      if (!payment) {
        throw new NotFoundException(`Payment not found: ${paymentId}`);
      }

      if (payment.status !== PaymentStatus.PENDING) {
        throw new BadRequestException(`Payment must be in PENDING status to approve. Current status: ${payment.status}`);
      }

      await payment.update(
        {
          status: PaymentStatus.APPROVED,
          approvedBy: await this.getUserName(userId),
          approvedDate: new Date()
        },
        { transaction }
      );

      await transaction.commit();
      this.logger.log(`Payment approved: ${payment.paymentNumber}`);

      return payment;
    } catch (error) {
      await transaction.rollback();
      this.logger.error(`Failed to approve payment: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Processes an approved payment
   *
   * @param paymentId - Payment ID
   * @param userId - User ID
   * @returns Processed payment
   */
  async processPayment(paymentId: string, userId: string): Promise<any> {
    const transaction = await this.sequelize.transaction();

    try {
      this.logger.log(`Processing payment: ${paymentId}`);

      const VendorPayment = createVendorPaymentModel(this.sequelize);
      const payment = await VendorPayment.findByPk(paymentId, { transaction });

      if (!payment) {
        throw new NotFoundException(`Payment not found: ${paymentId}`);
      }

      if (payment.status !== PaymentStatus.APPROVED) {
        throw new BadRequestException(`Payment must be APPROVED to process. Current status: ${payment.status}`);
      }

      // Check for payment holds
      const hasHolds = await this.checkPaymentHolds(paymentId, transaction);
      if (hasHolds) {
        throw new BadRequestException('Payment has active holds and cannot be processed');
      }

      // Calculate Prompt Payment Act interest if applicable
      const promptPaymentInterest = await this.calculatePromptPaymentInterest(payment);

      // Generate confirmation number (in real system, this would come from payment gateway)
      const confirmationNumber = `CONF-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;

      await payment.update(
        {
          status: PaymentStatus.IN_PROCESS,
          processedBy: await this.getUserName(userId),
          processedDate: new Date(),
          confirmationNumber,
          promptPaymentInterest
        },
        { transaction }
      );

      // In real system, this would integrate with payment gateway
      await this.executePaymentTransaction(payment, transaction);

      await payment.update(
        {
          status: PaymentStatus.PAID,
          paidDate: new Date()
        },
        { transaction }
      );

      await transaction.commit();
      this.logger.log(`Payment processed successfully: ${payment.paymentNumber}`);

      return payment;
    } catch (error) {
      await transaction.rollback();
      this.logger.error(`Failed to process payment: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Checks if payment has active holds
   *
   * @param paymentId - Payment ID
   * @param transaction - Database transaction
   * @returns True if has active holds
   */
  private async checkPaymentHolds(paymentId: string, transaction: Transaction): Promise<boolean> {
    const PaymentHold = createPaymentHoldModel(this.sequelize);
    const holds = await PaymentHold.findAll({
      where: { paymentId, status: 'ACTIVE' },
      transaction
    });

    return holds.length > 0;
  }

  /**
   * Calculates Prompt Payment Act interest
   *
   * @param payment - Payment record
   * @returns Interest amount
   */
  private async calculatePromptPaymentInterest(payment: any): Promise<number> {
    const today = new Date();
    const dueDate = new Date(payment.dueDate);

    if (today <= dueDate) {
      return 0;
    }

    // Calculate days late
    const daysLate = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));

    // Prompt Payment Act interest rate (typically based on Treasury rate + 1%)
    const annualInterestRate = 0.05; // 5% for example
    const dailyRate = annualInterestRate / 365;

    const interest = payment.netPaymentAmount * dailyRate * daysLate;

    return Math.round(interest * 100) / 100;
  }

  /**
   * Executes payment transaction (stub for payment gateway integration)
   *
   * @param payment - Payment record
   * @param transaction - Database transaction
   */
  private async executePaymentTransaction(payment: any, transaction: Transaction): Promise<void> {
    // This would integrate with actual payment gateway (e.g., Federal Reserve, bank ACH system)
    this.logger.log(`Executing ${payment.paymentMethod} payment for ${payment.netPaymentAmount}`);

    // Update accounting system
    await this.updateAccountingRecords(payment, transaction);
  }

  /**
   * Updates accounting records for payment
   *
   * @param payment - Payment record
   * @param transaction - Database transaction
   */
  private async updateAccountingRecords(payment: any, transaction: Transaction): Promise<void> {
    for (const accountCode of payment.accountingCodes) {
      await this.sequelize.query(
        `
        UPDATE budget_allocations
        SET expended_amount = COALESCE(expended_amount, 0) + :amount
        WHERE account_code = :accountCode
          AND fiscal_year = EXTRACT(YEAR FROM CURRENT_DATE)
        `,
        {
          replacements: {
            accountCode,
            amount: payment.netPaymentAmount / payment.accountingCodes.length
          },
          type: QueryTypes.UPDATE,
          transaction
        }
      );
    }
  }

  /**
   * Places a hold on a payment
   *
   * @param holdData - Payment hold data
   * @param userId - User ID
   * @returns Created payment hold
   */
  async placePaymentHold(holdData: PaymentHoldData, userId: string): Promise<any> {
    const transaction = await this.sequelize.transaction();

    try {
      this.logger.log(`Placing hold on payment: ${holdData.paymentId}`);

      const VendorPayment = createVendorPaymentModel(this.sequelize);
      const payment = await VendorPayment.findByPk(holdData.paymentId, { transaction });

      if (!payment) {
        throw new NotFoundException(`Payment not found: ${holdData.paymentId}`);
      }

      // Update payment status
      await payment.update({ status: PaymentStatus.ON_HOLD }, { transaction });

      const PaymentHold = createPaymentHoldModel(this.sequelize);
      const hold = await PaymentHold.create(
        {
          paymentId: holdData.paymentId,
          holdReason: holdData.holdReason,
          holdDescription: holdData.holdDescription,
          holdInitiatedBy: await this.getUserName(userId),
          holdInitiatedDate: new Date(),
          expectedReleaseDate: holdData.expectedReleaseDate,
          requiredActions: holdData.requiredActions,
          completedActions: [],
          status: 'ACTIVE'
        },
        { transaction }
      );

      await transaction.commit();
      this.logger.log(`Payment hold placed: ${hold.id}`);

      return hold;
    } catch (error) {
      await transaction.rollback();
      this.logger.error(`Failed to place payment hold: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Releases a payment hold
   *
   * @param holdId - Hold ID
   * @param userId - User ID
   * @returns Released payment hold
   */
  async releasePaymentHold(holdId: string, userId: string): Promise<any> {
    const transaction = await this.sequelize.transaction();

    try {
      this.logger.log(`Releasing payment hold: ${holdId}`);

      const PaymentHold = createPaymentHoldModel(this.sequelize);
      const hold = await PaymentHold.findByPk(holdId, { transaction });

      if (!hold) {
        throw new NotFoundException(`Payment hold not found: ${holdId}`);
      }

      if (hold.status !== 'ACTIVE') {
        throw new BadRequestException('Hold must be ACTIVE to release');
      }

      await hold.update(
        {
          status: 'RELEASED',
          actualReleaseDate: new Date(),
          releasedBy: await this.getUserName(userId)
        },
        { transaction }
      );

      // Update payment status back to approved
      const VendorPayment = createVendorPaymentModel(this.sequelize);
      await VendorPayment.update(
        { status: PaymentStatus.APPROVED },
        { where: { id: hold.paymentId }, transaction }
      );

      await transaction.commit();
      this.logger.log(`Payment hold released: ${holdId}`);

      return hold;
    } catch (error) {
      await transaction.rollback();
      this.logger.error(`Failed to release payment hold: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Creates a payment schedule
   *
   * @param scheduleData - Payment schedule data
   * @param userId - User ID
   * @returns Created payment schedule
   */
  async createPaymentSchedule(
    scheduleData: PaymentScheduleData,
    userId: string
  ): Promise<any> {
    const transaction = await this.sequelize.transaction();

    try {
      this.logger.log(`Creating payment schedule for contract: ${scheduleData.contractId}`);

      const scheduleNumber = await this.generateScheduleNumber();

      const PaymentSchedule = createPaymentScheduleModel(this.sequelize);
      const schedule = await PaymentSchedule.create(
        {
          scheduleNumber,
          contractId: scheduleData.contractId,
          vendorId: scheduleData.vendorId,
          scheduleType: scheduleData.scheduleType,
          totalAmount: scheduleData.totalAmount,
          paidAmount: 0,
          remainingAmount: scheduleData.totalAmount,
          numberOfPayments: scheduleData.numberOfPayments,
          completedPayments: 0,
          paymentFrequency: scheduleData.paymentFrequency || null,
          startDate: scheduleData.startDate,
          endDate: scheduleData.endDate || null,
          status: 'ACTIVE',
          metadata: {
            createdBy: userId,
            paymentPercentages: scheduleData.paymentPercentages,
            milestoneIds: scheduleData.milestoneIds
          }
        },
        { transaction }
      );

      // Generate individual scheduled payments
      await this.generateScheduledPayments(schedule, transaction);

      await transaction.commit();
      this.logger.log(`Payment schedule created: ${scheduleNumber}`);

      return schedule;
    } catch (error) {
      await transaction.rollback();
      this.logger.error(`Failed to create payment schedule: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Generates a unique schedule number
   *
   * @returns Generated schedule number
   */
  private async generateScheduleNumber(): Promise<string> {
    const fiscalYear = new Date().getFullYear();
    const result = await this.sequelize.query(
      `SELECT COALESCE(MAX(CAST(SUBSTRING(schedule_number FROM '[0-9]+$') AS INTEGER)), 0) + 1 as next_number
       FROM payment_schedules
       WHERE schedule_number LIKE :pattern`,
      {
        replacements: { pattern: `SCH-${fiscalYear}-%` },
        type: QueryTypes.SELECT
      }
    );

    const nextNumber = result[0]['next_number'];
    return `SCH-${fiscalYear}-${String(nextNumber).padStart(6, '0')}`;
  }

  /**
   * Generates individual scheduled payments based on schedule
   *
   * @param schedule - Payment schedule
   * @param transaction - Database transaction
   */
  private async generateScheduledPayments(
    schedule: any,
    transaction: Transaction
  ): Promise<void> {
    // Implementation would create individual payment records based on schedule type
    this.logger.log(`Generating ${schedule.numberOfPayments} scheduled payments`);

    // For fixed schedules, divide equally
    // For milestone schedules, use percentages
    // For progress schedules, calculate based on completion
    // For recurring schedules, use frequency
  }

  /**
   * Initiates payment reconciliation for a period
   *
   * @param startDate - Period start date
   * @param endDate - Period end date
   * @param userId - User ID
   * @returns Created reconciliation record
   */
  async initiatePaymentReconciliation(
    startDate: Date,
    endDate: Date,
    userId: string
  ): Promise<any> {
    const transaction = await this.sequelize.transaction();

    try {
      this.logger.log(`Initiating payment reconciliation: ${startDate} to ${endDate}`);

      const reconciliationNumber = await this.generateReconciliationNumber();
      const reconciliationPeriod = this.formatReconciliationPeriod(startDate, endDate);

      // Get payment statistics for the period
      const stats = await this.getPaymentStatistics(startDate, endDate);

      const PaymentReconciliation = createPaymentReconciliationModel(this.sequelize);
      const reconciliation = await PaymentReconciliation.create(
        {
          reconciliationNumber,
          reconciliationPeriod,
          startDate,
          endDate,
          totalPaymentsProcessed: stats.totalPayments,
          totalAmountPaid: stats.totalAmount,
          numberOfDiscrepancies: 0,
          discrepancyAmount: 0,
          reconciledBy: null,
          reconciledDate: null,
          status: 'IN_PROGRESS',
          notes: '',
          metadata: { initiatedBy: userId }
        },
        { transaction }
      );

      await transaction.commit();
      this.logger.log(`Payment reconciliation initiated: ${reconciliationNumber}`);

      return reconciliation;
    } catch (error) {
      await transaction.rollback();
      this.logger.error(`Failed to initiate reconciliation: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Generates a unique reconciliation number
   *
   * @returns Generated reconciliation number
   */
  private async generateReconciliationNumber(): Promise<string> {
    const fiscalYear = new Date().getFullYear();
    const result = await this.sequelize.query(
      `SELECT COALESCE(MAX(CAST(SUBSTRING(reconciliation_number FROM '[0-9]+$') AS INTEGER)), 0) + 1 as next_number
       FROM payment_reconciliations
       WHERE reconciliation_number LIKE :pattern`,
      {
        replacements: { pattern: `REC-${fiscalYear}-%` },
        type: QueryTypes.SELECT
      }
    );

    const nextNumber = result[0]['next_number'];
    return `REC-${fiscalYear}-${String(nextNumber).padStart(4, '0')}`;
  }

  /**
   * Formats reconciliation period string
   *
   * @param startDate - Start date
   * @param endDate - End date
   * @returns Formatted period string
   */
  private formatReconciliationPeriod(startDate: Date, endDate: Date): string {
    const year = startDate.getFullYear();
    const quarter = Math.floor(startDate.getMonth() / 3) + 1;
    return `${year}-Q${quarter}`;
  }

  /**
   * Gets payment statistics for a period
   *
   * @param startDate - Start date
   * @param endDate - End date
   * @returns Payment statistics
   */
  private async getPaymentStatistics(startDate: Date, endDate: Date): Promise<any> {
    const result = await this.sequelize.query(
      `
      SELECT
        COUNT(*) as total_payments,
        SUM(net_payment_amount) as total_amount
      FROM vendor_payments
      WHERE paid_date BETWEEN :startDate AND :endDate
        AND status = 'PAID'
      `,
      {
        replacements: { startDate, endDate },
        type: QueryTypes.SELECT
      }
    );

    return {
      totalPayments: parseInt(result[0]['total_payments']) || 0,
      totalAmount: parseFloat(result[0]['total_amount']) || 0
    };
  }

  /**
   * Generates vendor payment history report
   *
   * @param vendorId - Vendor ID
   * @param startDate - Report start date
   * @param endDate - Report end date
   * @returns Payment history report
   */
  async generateVendorPaymentHistory(
    vendorId: string,
    startDate: Date,
    endDate: Date
  ): Promise<any> {
    try {
      this.logger.log(`Generating payment history for vendor: ${vendorId}`);

      const payments = await this.sequelize.query(
        `
        SELECT
          payment_number,
          invoice_number,
          payment_date,
          paid_date,
          net_payment_amount,
          payment_method,
          status,
          discount_taken,
          discount_amount,
          late_payment_penalty,
          prompt_payment_interest
        FROM vendor_payments
        WHERE vendor_id = :vendorId
          AND payment_date BETWEEN :startDate AND :endDate
        ORDER BY payment_date DESC
        `,
        {
          replacements: { vendorId, startDate, endDate },
          type: QueryTypes.SELECT
        }
      );

      const summary = {
        totalPayments: payments.length,
        totalAmountPaid: payments.reduce((sum, p) => sum + parseFloat(p['net_payment_amount']), 0),
        totalDiscountsTaken: payments.reduce((sum, p) => sum + parseFloat(p['discount_amount'] || 0), 0),
        totalLatePaymentPenalties: payments.reduce((sum, p) => sum + parseFloat(p['late_payment_penalty'] || 0), 0),
        totalPromptPaymentInterest: payments.reduce((sum, p) => sum + parseFloat(p['prompt_payment_interest'] || 0), 0),
        paymentsByStatus: this.groupPaymentsByStatus(payments)
      };

      return {
        vendorId,
        period: { startDate, endDate },
        summary,
        payments
      };
    } catch (error) {
      this.logger.error(`Failed to generate payment history: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Groups payments by status
   *
   * @param payments - Payment records
   * @returns Grouped payments
   */
  private groupPaymentsByStatus(payments: any[]): any {
    const grouped: any = {};

    for (const payment of payments) {
      const status = payment['status'];
      if (!grouped[status]) {
        grouped[status] = { count: 0, totalAmount: 0 };
      }
      grouped[status].count++;
      grouped[status].totalAmount += parseFloat(payment['net_payment_amount']);
    }

    return grouped;
  }
}

/**
 * Export all models and services
 */
export default {
  CEFMSVendorPaymentProcessingService,
  createVendorPaymentModel,
  createPaymentScheduleModel,
  createPaymentMatchingModel,
  createPaymentHoldModel,
  createPaymentReconciliationModel,
  PaymentStatus,
  PaymentMethod,
  PaymentTerms,
  HoldReason,
  MatchingStatus
};
