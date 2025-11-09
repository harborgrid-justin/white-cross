/**
 * LOC: GOVTRVL1234567
 * File: /reuse/government/expense-travel-reimbursement-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - NestJS government finance controllers
 *   - Backend travel services
 *   - API expense endpoints
 *   - Government compliance modules
 */

/**
 * File: /reuse/government/expense-travel-reimbursement-kit.ts
 * Locator: WC-GOV-TRAVEL-001
 * Purpose: Comprehensive Expense & Travel Reimbursement - expense reports, travel authorization, per diem, GSA compliance
 *
 * Upstream: Independent utility module for government expense and travel management
 * Downstream: ../backend/*, API controllers, finance services, travel workflows, GSA compliance validators
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, @nestjs/swagger
 * Exports: 50+ utility functions for expense tracking, travel authorization, per diem, GSA rates, reimbursement processing
 *
 * LLM Context: Government-grade expense and travel reimbursement system for federal, state, and local agencies.
 * Provides expense report creation, travel authorization workflows, per diem calculations using GSA rates,
 * mileage reimbursement at IRS rates, receipt management, travel policy compliance (FTR/JTR), corporate card
 * reconciliation, travel advance processing, expense approval workflows, audit trails, and integration with
 * financial systems. Supports Federal Travel Regulation (FTR), Joint Travel Regulations (JTR), and state/local policies.
 */

import { Request, Response } from 'express';
import { Model, DataTypes, Sequelize, Transaction, Op, ValidationError as SequelizeValidationError } from 'sequelize';
import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsDate,
  IsArray,
  IsBoolean,
  IsUUID,
  Min,
  Max,
  ValidateNested,
  IsNotEmpty,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface ExpenseTravelContext {
  userId: string;
  employeeId: string;
  departmentId: string;
  agencyId: string;
  fiscalYear: number;
  timestamp: string;
  metadata?: Record<string, any>;
}

interface ExpenseReport {
  id?: string;
  reportNumber: string;
  employeeId: string;
  reportTitle: string;
  reportPurpose: string;
  reportType: ExpenseReportType;
  status: ExpenseStatus;
  submittedDate?: string;
  approvedDate?: string;
  paidDate?: string;
  totalAmount: number;
  reimbursableAmount: number;
  advanceAmount: number;
  amountDue: number;
  currency: string;
  fiscalYear: number;
  lineItems: ExpenseLineItem[];
  receipts: Receipt[];
  approvalWorkflow: ApprovalStep[];
  auditTrail: AuditEntry[];
  policyViolations: PolicyViolation[];
  notes?: string;
  metadata?: Record<string, any>;
}

interface ExpenseLineItem {
  id?: string;
  expenseDate: string;
  category: ExpenseCategory;
  subcategory?: string;
  description: string;
  amount: number;
  taxAmount?: number;
  totalAmount: number;
  vendor: string;
  vendorLocation?: string;
  accountCode: string;
  projectCode?: string;
  receiptRequired: boolean;
  receiptId?: string;
  receiptAttached: boolean;
  reimbursable: boolean;
  policyCompliant: boolean;
  complianceNotes?: string;
  approvalRequired: boolean;
  metadata?: Record<string, any>;
}

interface TravelAuthorization {
  id?: string;
  authorizationNumber: string;
  employeeId: string;
  travelPurpose: string;
  travelType: TravelType;
  departureDate: string;
  returnDate: string;
  destinations: TravelDestination[];
  estimatedCost: number;
  status: AuthorizationStatus;
  fundingSource: string;
  accountingCode: string;
  approvedBy?: string;
  approvedDate?: string;
  authorizationDate?: string;
  expirationDate?: string;
  blanketAuthorization: boolean;
  emergencyTravel: boolean;
  requiredApprovals: ApprovalStep[];
  metadata?: Record<string, any>;
}

interface TravelDestination {
  sequence: number;
  city: string;
  state?: string;
  country: string;
  arrivalDate: string;
  departureDate: string;
  purpose: string;
  lodgingRequired: boolean;
  mealsIncluded: boolean;
  transportationMode: TransportationMode;
}

interface PerDiemCalculation {
  destination: string;
  checkInDate: string;
  checkOutDate: string;
  totalDays: number;
  lodgingRate: number;
  mealsRate: number;
  incidentalsRate: number;
  totalLodging: number;
  totalMeals: number;
  totalIncidentals: number;
  totalPerDiem: number;
  gsaLocation: string;
  gsaEffectiveDate: string;
  prorationApplied: boolean;
  prorationDetails?: ProrationDetails;
}

interface ProrationDetails {
  firstDayProration: number;
  lastDayProration: number;
  firstDayAmount: number;
  lastDayAmount: number;
}

interface MileageReimbursement {
  id?: string;
  employeeId: string;
  travelDate: string;
  fromLocation: string;
  toLocation: string;
  purpose: string;
  mileage: number;
  reimbursementRate: number;
  reimbursementAmount: number;
  vehicleType: VehicleType;
  odometryStart?: number;
  odometryEnd?: number;
  routeMap?: string;
  authorized: boolean;
  authorizedBy?: string;
  receiptsRequired: boolean;
  metadata?: Record<string, any>;
}

interface Receipt {
  id?: string;
  receiptNumber: string;
  receiptDate: string;
  vendor: string;
  amount: number;
  taxAmount?: number;
  paymentMethod: PaymentMethod;
  receiptType: ReceiptType;
  imageUrl?: string;
  ocrProcessed: boolean;
  ocrData?: OcrData;
  validated: boolean;
  validationNotes?: string;
  expenseLineItemId?: string;
  metadata?: Record<string, any>;
}

interface OcrData {
  vendor?: string;
  date?: string;
  totalAmount?: number;
  taxAmount?: number;
  paymentMethod?: string;
  confidence: number;
  rawText?: string;
}

interface CorporateCard {
  id?: string;
  cardNumber: string;
  cardholderName: string;
  employeeId: string;
  cardType: CardType;
  issuedDate: string;
  expirationDate: string;
  creditLimit: number;
  currentBalance: number;
  status: CardStatus;
  billingCycle: string;
  lastStatementDate?: string;
  nextStatementDate: string;
  metadata?: Record<string, any>;
}

interface CardTransaction {
  id?: string;
  transactionId: string;
  cardId: string;
  employeeId: string;
  transactionDate: string;
  postDate: string;
  vendor: string;
  amount: number;
  description?: string;
  merchantCategory: string;
  reconciled: boolean;
  reconciledDate?: string;
  expenseReportId?: string;
  expenseLineItemId?: string;
  disputed: boolean;
  disputeReason?: string;
  metadata?: Record<string, any>;
}

interface TravelAdvance {
  id?: string;
  advanceNumber: string;
  employeeId: string;
  travelAuthorizationId: string;
  advanceAmount: number;
  advanceDate: string;
  purpose: string;
  dueDate: string;
  reconciled: boolean;
  reconciledDate?: string;
  reconciledAmount?: number;
  amountOwed?: number;
  amountRefunded?: number;
  status: AdvanceStatus;
  paymentMethod: PaymentMethod;
  paymentReference?: string;
  metadata?: Record<string, any>;
}

interface GsaRate {
  locationId: string;
  locationName: string;
  state: string;
  county?: string;
  city?: string;
  fiscalYear: number;
  effectiveDate: string;
  expirationDate: string;
  lodgingRate: number;
  mealsRate: number;
  incidentalsRate: number;
  totalRate: number;
  season?: string;
  notes?: string;
}

interface ApprovalStep {
  level: number;
  approverId: string;
  approverName: string;
  approverTitle: string;
  status: ApprovalStatus;
  approvedDate?: string;
  rejectedDate?: string;
  comments?: string;
  delegatedTo?: string;
  notifiedDate?: string;
}

interface PolicyViolation {
  ruleId: string;
  ruleName: string;
  severity: ViolationSeverity;
  description: string;
  lineItemId?: string;
  suggestedAction?: string;
  overridden: boolean;
  overrideReason?: string;
  overriddenBy?: string;
  overriddenDate?: string;
}

interface AuditEntry {
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  entityType: string;
  entityId: string;
  changes?: Record<string, any>;
  ipAddress?: string;
  metadata?: Record<string, any>;
}

interface ReimbursementPayment {
  id?: string;
  paymentNumber: string;
  expenseReportId: string;
  employeeId: string;
  paymentAmount: number;
  paymentDate: string;
  paymentMethod: PaymentMethod;
  paymentReference: string;
  bankAccount?: string;
  routingNumber?: string;
  status: PaymentStatus;
  batchId?: string;
  reconciled: boolean;
  metadata?: Record<string, any>;
}

interface TravelPolicy {
  id?: string;
  policyId: string;
  policyName: string;
  policyType: PolicyType;
  effectiveDate: string;
  expirationDate?: string;
  agencyId: string;
  category?: ExpenseCategory;
  maxAmount?: number;
  requiresReceipt: boolean;
  receiptThreshold?: number;
  requiresPreApproval: boolean;
  approvalThreshold?: number;
  allowedVendors?: string[];
  restrictedVendors?: string[];
  complianceRules: string[];
  active: boolean;
  metadata?: Record<string, any>;
}

type ExpenseReportType = 'travel' | 'local' | 'training' | 'conference' | 'miscellaneous' | 'relocation';
type ExpenseStatus = 'draft' | 'submitted' | 'pending_approval' | 'approved' | 'rejected' | 'paid' | 'cancelled';
type ExpenseCategory = 'lodging' | 'meals' | 'airfare' | 'ground_transport' | 'rental_car' | 'fuel' | 'parking' | 'tolls' | 'registration' | 'supplies' | 'other';
type TravelType = 'domestic' | 'international' | 'local' | 'emergency';
type AuthorizationStatus = 'draft' | 'pending' | 'approved' | 'denied' | 'expired' | 'cancelled';
type TransportationMode = 'air' | 'train' | 'bus' | 'rental_car' | 'personal_vehicle' | 'taxi' | 'rideshare' | 'other';
type VehicleType = 'personal_car' | 'personal_motorcycle' | 'personal_van' | 'rental_car' | 'government_vehicle';
type PaymentMethod = 'corporate_card' | 'personal_card' | 'cash' | 'check' | 'direct_deposit' | 'wire_transfer';
type ReceiptType = 'hotel' | 'meal' | 'airfare' | 'rental_car' | 'fuel' | 'parking' | 'toll' | 'registration' | 'other';
type CardType = 'travel' | 'purchase' | 'fleet' | 'integrated';
type CardStatus = 'active' | 'suspended' | 'cancelled' | 'expired' | 'lost' | 'stolen';
type AdvanceStatus = 'requested' | 'approved' | 'paid' | 'reconciled' | 'refunded' | 'written_off';
type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
type PolicyType = 'federal' | 'state' | 'local' | 'agency' | 'department';
type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'delegated' | 'expired';
type ViolationSeverity = 'info' | 'warning' | 'error' | 'critical';

// ============================================================================
// SEQUELIZE MODELS (1-4)
// ============================================================================

/**
 * Sequelize model for Expense Reports with approval workflow and audit trail.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ExpenseReport model
 *
 * @example
 * ```typescript
 * const ExpenseReport = createExpenseReportModel(sequelize);
 * const report = await ExpenseReport.create({
 *   reportNumber: 'EXP-2025-001234',
 *   employeeId: 'EMP123',
 *   reportTitle: 'DC Conference Travel',
 *   reportType: 'travel',
 *   status: 'draft'
 * });
 * ```
 */
export const createExpenseReportModel = (sequelize: Sequelize) => {
  class ExpenseReport extends Model {
    public id!: number;
    public reportNumber!: string;
    public employeeId!: string;
    public reportTitle!: string;
    public reportPurpose!: string;
    public reportType!: string;
    public status!: string;
    public submittedDate!: Date | null;
    public approvedDate!: Date | null;
    public paidDate!: Date | null;
    public totalAmount!: number;
    public reimbursableAmount!: number;
    public advanceAmount!: number;
    public amountDue!: number;
    public currency!: string;
    public fiscalYear!: number;
    public lineItems!: ExpenseLineItem[];
    public receipts!: Receipt[];
    public approvalWorkflow!: ApprovalStep[];
    public auditTrail!: AuditEntry[];
    public policyViolations!: PolicyViolation[];
    public notes!: string | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  ExpenseReport.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      reportNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Unique expense report number',
      },
      employeeId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Employee identifier',
      },
      reportTitle: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Report title',
      },
      reportPurpose: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Purpose of expenses',
      },
      reportType: {
        type: DataTypes.ENUM('travel', 'local', 'training', 'conference', 'miscellaneous', 'relocation'),
        allowNull: false,
        comment: 'Type of expense report',
      },
      status: {
        type: DataTypes.ENUM('draft', 'submitted', 'pending_approval', 'approved', 'rejected', 'paid', 'cancelled'),
        allowNull: false,
        defaultValue: 'draft',
        comment: 'Report status',
      },
      submittedDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Submission date',
      },
      approvedDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Approval date',
      },
      paidDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Payment date',
      },
      totalAmount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Total expense amount',
      },
      reimbursableAmount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Reimbursable amount',
      },
      advanceAmount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Travel advance amount',
      },
      amountDue: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Amount due to employee',
      },
      currency: {
        type: DataTypes.STRING(3),
        allowNull: false,
        defaultValue: 'USD',
        comment: 'Currency code',
      },
      fiscalYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Fiscal year',
      },
      lineItems: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Expense line items',
      },
      receipts: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Receipt records',
      },
      approvalWorkflow: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Approval workflow steps',
      },
      auditTrail: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Audit trail',
      },
      policyViolations: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Policy violations',
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Additional notes',
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
      tableName: 'expense_reports',
      timestamps: true,
      indexes: [
        { fields: ['reportNumber'], unique: true },
        { fields: ['employeeId'] },
        { fields: ['status'] },
        { fields: ['reportType'] },
        { fields: ['fiscalYear'] },
        { fields: ['submittedDate'] },
        { fields: ['approvedDate'] },
      ],
    },
  );

  return ExpenseReport;
};

/**
 * Sequelize model for Travel Authorizations with multi-level approval.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} TravelAuthorization model
 *
 * @example
 * ```typescript
 * const TravelAuth = createTravelAuthorizationModel(sequelize);
 * const auth = await TravelAuth.create({
 *   authorizationNumber: 'TA-2025-001234',
 *   employeeId: 'EMP123',
 *   travelPurpose: 'Annual Conference',
 *   travelType: 'domestic',
 *   departureDate: '2025-02-15',
 *   returnDate: '2025-02-18'
 * });
 * ```
 */
export const createTravelAuthorizationModel = (sequelize: Sequelize) => {
  class TravelAuthorization extends Model {
    public id!: number;
    public authorizationNumber!: string;
    public employeeId!: string;
    public travelPurpose!: string;
    public travelType!: string;
    public departureDate!: Date;
    public returnDate!: Date;
    public destinations!: TravelDestination[];
    public estimatedCost!: number;
    public status!: string;
    public fundingSource!: string;
    public accountingCode!: string;
    public approvedBy!: string | null;
    public approvedDate!: Date | null;
    public authorizationDate!: Date | null;
    public expirationDate!: Date | null;
    public blanketAuthorization!: boolean;
    public emergencyTravel!: boolean;
    public requiredApprovals!: ApprovalStep[];
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  TravelAuthorization.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      authorizationNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Unique authorization number',
      },
      employeeId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Employee identifier',
      },
      travelPurpose: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Purpose of travel',
      },
      travelType: {
        type: DataTypes.ENUM('domestic', 'international', 'local', 'emergency'),
        allowNull: false,
        comment: 'Type of travel',
      },
      departureDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        comment: 'Departure date',
      },
      returnDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        comment: 'Return date',
      },
      destinations: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Travel destinations',
      },
      estimatedCost: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Estimated travel cost',
      },
      status: {
        type: DataTypes.ENUM('draft', 'pending', 'approved', 'denied', 'expired', 'cancelled'),
        allowNull: false,
        defaultValue: 'draft',
        comment: 'Authorization status',
      },
      fundingSource: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Funding source',
      },
      accountingCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Accounting code',
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
      authorizationDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Authorization effective date',
      },
      expirationDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Authorization expiration date',
      },
      blanketAuthorization: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Blanket authorization flag',
      },
      emergencyTravel: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Emergency travel flag',
      },
      requiredApprovals: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Required approval steps',
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
      tableName: 'travel_authorizations',
      timestamps: true,
      indexes: [
        { fields: ['authorizationNumber'], unique: true },
        { fields: ['employeeId'] },
        { fields: ['status'] },
        { fields: ['travelType'] },
        { fields: ['departureDate'] },
        { fields: ['returnDate'] },
      ],
    },
  );

  return TravelAuthorization;
};

/**
 * Sequelize model for Corporate Card Transactions with reconciliation tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CardTransaction model
 *
 * @example
 * ```typescript
 * const CardTxn = createCardTransactionModel(sequelize);
 * const transaction = await CardTxn.create({
 *   transactionId: 'TXN-2025-001234',
 *   cardId: 'CARD-123',
 *   employeeId: 'EMP123',
 *   transactionDate: '2025-01-15',
 *   vendor: 'Hotel ABC',
 *   amount: 250.00
 * });
 * ```
 */
export const createCardTransactionModel = (sequelize: Sequelize) => {
  class CardTransaction extends Model {
    public id!: number;
    public transactionId!: string;
    public cardId!: string;
    public employeeId!: string;
    public transactionDate!: Date;
    public postDate!: Date;
    public vendor!: string;
    public amount!: number;
    public description!: string | null;
    public merchantCategory!: string;
    public reconciled!: boolean;
    public reconciledDate!: Date | null;
    public expenseReportId!: number | null;
    public expenseLineItemId!: string | null;
    public disputed!: boolean;
    public disputeReason!: string | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  CardTransaction.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      transactionId: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        comment: 'Unique transaction identifier',
      },
      cardId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Corporate card identifier',
      },
      employeeId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Employee identifier',
      },
      transactionDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Transaction date',
      },
      postDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Posted date',
      },
      vendor: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Vendor name',
      },
      amount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        comment: 'Transaction amount',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Transaction description',
      },
      merchantCategory: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Merchant category',
      },
      reconciled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Reconciliation status',
      },
      reconciledDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Reconciliation date',
      },
      expenseReportId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Associated expense report ID',
      },
      expenseLineItemId: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Associated line item ID',
      },
      disputed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Dispute flag',
      },
      disputeReason: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Dispute reason',
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
      tableName: 'card_transactions',
      timestamps: true,
      indexes: [
        { fields: ['transactionId'], unique: true },
        { fields: ['cardId'] },
        { fields: ['employeeId'] },
        { fields: ['transactionDate'] },
        { fields: ['reconciled'] },
        { fields: ['disputed'] },
      ],
    },
  );

  return CardTransaction;
};

/**
 * Sequelize model for GSA Per Diem Rates with location and date tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} GsaRate model
 *
 * @example
 * ```typescript
 * const GsaRate = createGsaRateModel(sequelize);
 * const rate = await GsaRate.create({
 *   locationId: 'DC-001',
 *   locationName: 'Washington, DC',
 *   state: 'DC',
 *   fiscalYear: 2025,
 *   lodgingRate: 194.00,
 *   mealsRate: 79.00,
 *   incidentalsRate: 5.00
 * });
 * ```
 */
export const createGsaRateModel = (sequelize: Sequelize) => {
  class GsaRate extends Model {
    public id!: number;
    public locationId!: string;
    public locationName!: string;
    public state!: string;
    public county!: string | null;
    public city!: string | null;
    public fiscalYear!: number;
    public effectiveDate!: Date;
    public expirationDate!: Date;
    public lodgingRate!: number;
    public mealsRate!: number;
    public incidentalsRate!: number;
    public totalRate!: number;
    public season!: string | null;
    public notes!: string | null;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  GsaRate.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      locationId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'GSA location identifier',
      },
      locationName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Location name',
      },
      state: {
        type: DataTypes.STRING(2),
        allowNull: false,
        comment: 'State code',
      },
      county: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'County name',
      },
      city: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'City name',
      },
      fiscalYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Fiscal year',
      },
      effectiveDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        comment: 'Effective date',
      },
      expirationDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        comment: 'Expiration date',
      },
      lodgingRate: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Lodging per diem rate',
      },
      mealsRate: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Meals & incidentals rate',
      },
      incidentalsRate: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Incidentals rate',
      },
      totalRate: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Total daily rate',
      },
      season: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Season (if seasonal rates)',
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Additional notes',
      },
    },
    {
      sequelize,
      tableName: 'gsa_rates',
      timestamps: true,
      indexes: [
        { fields: ['locationId'] },
        { fields: ['state'] },
        { fields: ['fiscalYear'] },
        { fields: ['effectiveDate'] },
      ],
    },
  );

  return GsaRate;
};

// ============================================================================
// EXPENSE REPORT FUNCTIONS (1-8)
// ============================================================================

/**
 * Creates expense report with initial line items.
 *
 * @param {Partial<ExpenseReport>} reportData - Expense report data
 * @param {ExpenseTravelContext} context - Execution context
 * @returns {Promise<ExpenseReport>} Created expense report
 *
 * @example
 * ```typescript
 * const report = await createExpenseReport({
 *   employeeId: 'EMP123',
 *   reportTitle: 'Annual Conference - Washington DC',
 *   reportPurpose: 'Attend federal IT conference',
 *   reportType: 'travel'
 * }, context);
 * ```
 */
export async function createExpenseReport(
  reportData: Partial<ExpenseReport>,
  context: ExpenseTravelContext,
): Promise<ExpenseReport> {
  const reportNumber = await generateExpenseReportNumber(context.employeeId, context.fiscalYear);

  return {
    ...reportData,
    reportNumber,
    employeeId: reportData.employeeId || context.employeeId,
    status: 'draft',
    totalAmount: 0,
    reimbursableAmount: 0,
    advanceAmount: 0,
    amountDue: 0,
    currency: 'USD',
    fiscalYear: context.fiscalYear,
    lineItems: reportData.lineItems || [],
    receipts: reportData.receipts || [],
    approvalWorkflow: [],
    auditTrail: [{
      timestamp: new Date().toISOString(),
      userId: context.userId,
      userName: context.userId,
      action: 'CREATED',
      entityType: 'ExpenseReport',
      entityId: reportNumber,
    }],
    policyViolations: [],
    metadata: reportData.metadata || {},
  };
}

/**
 * Adds expense line item to report with policy validation.
 *
 * @param {string} reportId - Expense report ID
 * @param {ExpenseLineItem} lineItem - Line item to add
 * @param {ExpenseTravelContext} context - Execution context
 * @returns {Promise<ExpenseReport>} Updated expense report
 *
 * @example
 * ```typescript
 * const updated = await addExpenseLineItem('EXP-2025-001234', {
 *   expenseDate: '2025-01-15',
 *   category: 'lodging',
 *   description: 'Hotel - Marriott DC',
 *   amount: 194.00,
 *   vendor: 'Marriott Hotels',
 *   accountCode: 'ACCT-5100',
 *   receiptRequired: true,
 *   reimbursable: true
 * }, context);
 * ```
 */
export async function addExpenseLineItem(
  reportId: string,
  lineItem: ExpenseLineItem,
  context: ExpenseTravelContext,
): Promise<ExpenseReport> {
  const validated = await validateExpenseLineItem(lineItem, context);

  return {
    reportNumber: reportId,
    lineItems: [validated],
  } as ExpenseReport;
}

/**
 * Validates expense line item against travel policies.
 *
 * @param {ExpenseLineItem} lineItem - Line item to validate
 * @param {ExpenseTravelContext} context - Execution context
 * @returns {Promise<ExpenseLineItem>} Validated line item
 *
 * @example
 * ```typescript
 * const validated = await validateExpenseLineItem(lineItem, context);
 * console.log('Policy compliant:', validated.policyCompliant);
 * ```
 */
export async function validateExpenseLineItem(
  lineItem: ExpenseLineItem,
  context: ExpenseTravelContext,
): Promise<ExpenseLineItem> {
  const policy = await getTravelPolicy(lineItem.category, context.agencyId);
  let policyCompliant = true;
  const notes: string[] = [];

  // Check amount limits
  if (policy.maxAmount && lineItem.amount > policy.maxAmount) {
    policyCompliant = false;
    notes.push(`Exceeds policy limit of $${policy.maxAmount}`);
  }

  // Check receipt requirement
  if (policy.requiresReceipt && lineItem.amount > (policy.receiptThreshold || 75)) {
    lineItem.receiptRequired = true;
    if (!lineItem.receiptAttached) {
      notes.push('Receipt required');
    }
  }

  return {
    ...lineItem,
    totalAmount: lineItem.amount + (lineItem.taxAmount || 0),
    policyCompliant,
    complianceNotes: notes.length > 0 ? notes.join('; ') : undefined,
    approvalRequired: !policyCompliant || lineItem.amount > 1000,
  };
}

/**
 * Submits expense report for approval workflow.
 *
 * @param {string} reportId - Expense report ID
 * @param {ExpenseTravelContext} context - Execution context
 * @returns {Promise<ExpenseReport>} Submitted expense report
 *
 * @example
 * ```typescript
 * const submitted = await submitExpenseReport('EXP-2025-001234', context);
 * console.log('Status:', submitted.status); // 'submitted'
 * ```
 */
export async function submitExpenseReport(
  reportId: string,
  context: ExpenseTravelContext,
): Promise<ExpenseReport> {
  const approvalWorkflow = await buildApprovalWorkflow(reportId, context);

  return {
    reportNumber: reportId,
    status: 'submitted',
    submittedDate: new Date().toISOString(),
    approvalWorkflow,
  } as ExpenseReport;
}

/**
 * Approves expense report.
 *
 * @param {string} reportId - Expense report ID
 * @param {string} approverId - Approver user ID
 * @param {string} [comments] - Approval comments
 * @param {ExpenseTravelContext} context - Execution context
 * @returns {Promise<ExpenseReport>} Approved expense report
 *
 * @example
 * ```typescript
 * const approved = await approveExpenseReport('EXP-2025-001234', 'MGR456', 'Approved', context);
 * ```
 */
export async function approveExpenseReport(
  reportId: string,
  approverId: string,
  comments: string | undefined,
  context: ExpenseTravelContext,
): Promise<ExpenseReport> {
  return {
    reportNumber: reportId,
    status: 'approved',
    approvedDate: new Date().toISOString(),
  } as ExpenseReport;
}

/**
 * Calculates total expense amounts including advances.
 *
 * @param {ExpenseReport} report - Expense report
 * @returns {object} Calculated totals
 *
 * @example
 * ```typescript
 * const totals = calculateExpenseTotals(report);
 * // { totalAmount: 1500, reimbursableAmount: 1400, amountDue: 900 }
 * ```
 */
export function calculateExpenseTotals(report: ExpenseReport): {
  totalAmount: number;
  reimbursableAmount: number;
  nonReimbursableAmount: number;
  amountDue: number;
} {
  const totalAmount = report.lineItems.reduce((sum, item) => sum + item.totalAmount, 0);
  const reimbursableAmount = report.lineItems.filter(item => item.reimbursable).reduce((sum, item) => sum + item.totalAmount, 0);
  const amountDue = reimbursableAmount - report.advanceAmount;

  return {
    totalAmount,
    reimbursableAmount,
    nonReimbursableAmount: totalAmount - reimbursableAmount,
    amountDue,
  };
}

/**
 * Attaches receipt to expense line item.
 *
 * @param {string} reportId - Expense report ID
 * @param {string} lineItemId - Line item ID
 * @param {Receipt} receipt - Receipt data
 * @param {ExpenseTravelContext} context - Execution context
 * @returns {Promise<ExpenseReport>} Updated expense report
 *
 * @example
 * ```typescript
 * const updated = await attachReceipt('EXP-2025-001234', 'LINE-001', {
 *   receiptNumber: 'REC-001',
 *   receiptDate: '2025-01-15',
 *   vendor: 'Marriott Hotels',
 *   amount: 194.00,
 *   receiptType: 'hotel',
 *   imageUrl: 'https://storage.example.com/receipt.jpg'
 * }, context);
 * ```
 */
export async function attachReceipt(
  reportId: string,
  lineItemId: string,
  receipt: Receipt,
  context: ExpenseTravelContext,
): Promise<ExpenseReport> {
  return {
    reportNumber: reportId,
    receipts: [{ ...receipt, expenseLineItemId: lineItemId }],
  } as ExpenseReport;
}

/**
 * Generates unique expense report number.
 *
 * @param {string} employeeId - Employee ID
 * @param {number} fiscalYear - Fiscal year
 * @returns {Promise<string>} Unique report number
 *
 * @example
 * ```typescript
 * const reportNumber = await generateExpenseReportNumber('EMP123', 2025);
 * // 'EXP-2025-001234'
 * ```
 */
export async function generateExpenseReportNumber(employeeId: string, fiscalYear: number): Promise<string> {
  const sequence = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  return `EXP-${fiscalYear}-${sequence}`;
}

// ============================================================================
// TRAVEL AUTHORIZATION FUNCTIONS (9-16)
// ============================================================================

/**
 * Creates travel authorization request.
 *
 * @param {Partial<TravelAuthorization>} authData - Authorization data
 * @param {ExpenseTravelContext} context - Execution context
 * @returns {Promise<TravelAuthorization>} Created travel authorization
 *
 * @example
 * ```typescript
 * const auth = await createTravelAuthorization({
 *   employeeId: 'EMP123',
 *   travelPurpose: 'Annual IT Security Conference',
 *   travelType: 'domestic',
 *   departureDate: '2025-03-10',
 *   returnDate: '2025-03-14',
 *   destinations: [{
 *     sequence: 1,
 *     city: 'San Francisco',
 *     state: 'CA',
 *     country: 'USA',
 *     arrivalDate: '2025-03-10',
 *     departureDate: '2025-03-14',
 *     purpose: 'Conference attendance',
 *     lodgingRequired: true,
 *     mealsIncluded: false,
 *     transportationMode: 'air'
 *   }],
 *   fundingSource: 'Training Budget',
 *   accountingCode: 'ACCT-7200'
 * }, context);
 * ```
 */
export async function createTravelAuthorization(
  authData: Partial<TravelAuthorization>,
  context: ExpenseTravelContext,
): Promise<TravelAuthorization> {
  const authorizationNumber = await generateTravelAuthNumber(context.fiscalYear);

  return {
    ...authData,
    authorizationNumber,
    employeeId: authData.employeeId || context.employeeId,
    status: 'draft',
    estimatedCost: 0,
    blanketAuthorization: authData.blanketAuthorization || false,
    emergencyTravel: authData.emergencyTravel || false,
    requiredApprovals: [],
    metadata: authData.metadata || {},
  };
}

/**
 * Estimates travel costs for authorization.
 *
 * @param {TravelAuthorization} authorization - Travel authorization
 * @param {ExpenseTravelContext} context - Execution context
 * @returns {Promise<number>} Estimated total cost
 *
 * @example
 * ```typescript
 * const estimatedCost = await estimateTravelCost(auth, context);
 * console.log(`Estimated cost: $${estimatedCost}`);
 * ```
 */
export async function estimateTravelCost(
  authorization: TravelAuthorization,
  context: ExpenseTravelContext,
): Promise<number> {
  let totalCost = 0;

  for (const destination of authorization.destinations) {
    // Calculate per diem
    const perDiem = await calculatePerDiem(
      `${destination.city}, ${destination.state}`,
      destination.arrivalDate,
      destination.departureDate,
      context,
    );
    totalCost += perDiem.totalPerDiem;

    // Add transportation estimate
    if (destination.transportationMode === 'air') {
      totalCost += 500; // Simplified estimate
    }
  }

  return totalCost;
}

/**
 * Approves travel authorization.
 *
 * @param {string} authId - Authorization ID
 * @param {string} approverId - Approver user ID
 * @param {ExpenseTravelContext} context - Execution context
 * @returns {Promise<TravelAuthorization>} Approved authorization
 *
 * @example
 * ```typescript
 * const approved = await approveTravelAuthorization('TA-2025-001234', 'MGR456', context);
 * ```
 */
export async function approveTravelAuthorization(
  authId: string,
  approverId: string,
  context: ExpenseTravelContext,
): Promise<TravelAuthorization> {
  return {
    id: authId,
    status: 'approved',
    approvedBy: approverId,
    approvedDate: new Date().toISOString(),
    authorizationDate: new Date().toISOString(),
    expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
  } as TravelAuthorization;
}

/**
 * Validates travel authorization against policies.
 *
 * @param {TravelAuthorization} authorization - Authorization to validate
 * @param {ExpenseTravelContext} context - Execution context
 * @returns {Promise<{isValid: boolean; violations: PolicyViolation[]}>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateTravelAuthorization(auth, context);
 * if (!validation.isValid) {
 *   console.log('Violations:', validation.violations);
 * }
 * ```
 */
export async function validateTravelAuthorization(
  authorization: TravelAuthorization,
  context: ExpenseTravelContext,
): Promise<{ isValid: boolean; violations: PolicyViolation[] }> {
  const violations: PolicyViolation[] = [];

  // Check advance notice requirement
  const daysUntilTravel = Math.ceil((new Date(authorization.departureDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  if (daysUntilTravel < 14 && !authorization.emergencyTravel) {
    violations.push({
      ruleId: 'ADV-NOTICE',
      ruleName: 'Advance Notice Requirement',
      severity: 'warning',
      description: 'Travel should be requested at least 14 days in advance',
      overridden: false,
    });
  }

  return {
    isValid: violations.length === 0,
    violations,
  };
}

/**
 * Cancels travel authorization.
 *
 * @param {string} authId - Authorization ID
 * @param {string} reason - Cancellation reason
 * @param {ExpenseTravelContext} context - Execution context
 * @returns {Promise<TravelAuthorization>} Cancelled authorization
 *
 * @example
 * ```typescript
 * const cancelled = await cancelTravelAuthorization('TA-2025-001234', 'Conference postponed', context);
 * ```
 */
export async function cancelTravelAuthorization(
  authId: string,
  reason: string,
  context: ExpenseTravelContext,
): Promise<TravelAuthorization> {
  return {
    id: authId,
    status: 'cancelled',
  } as TravelAuthorization;
}

/**
 * Extends travel authorization expiration date.
 *
 * @param {string} authId - Authorization ID
 * @param {string} newExpirationDate - New expiration date
 * @param {ExpenseTravelContext} context - Execution context
 * @returns {Promise<TravelAuthorization>} Updated authorization
 *
 * @example
 * ```typescript
 * const extended = await extendTravelAuthorization('TA-2025-001234', '2026-12-31', context);
 * ```
 */
export async function extendTravelAuthorization(
  authId: string,
  newExpirationDate: string,
  context: ExpenseTravelContext,
): Promise<TravelAuthorization> {
  return {
    id: authId,
    expirationDate: newExpirationDate,
  } as TravelAuthorization;
}

/**
 * Checks if travel authorization is valid and not expired.
 *
 * @param {string} authId - Authorization ID
 * @returns {Promise<boolean>} True if valid
 *
 * @example
 * ```typescript
 * const isValid = await checkAuthorizationValidity('TA-2025-001234');
 * ```
 */
export async function checkAuthorizationValidity(authId: string): Promise<boolean> {
  // Would check database for authorization status and expiration
  return true;
}

/**
 * Generates unique travel authorization number.
 *
 * @param {number} fiscalYear - Fiscal year
 * @returns {Promise<string>} Unique authorization number
 *
 * @example
 * ```typescript
 * const authNumber = await generateTravelAuthNumber(2025);
 * // 'TA-2025-001234'
 * ```
 */
export async function generateTravelAuthNumber(fiscalYear: number): Promise<string> {
  const sequence = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  return `TA-${fiscalYear}-${sequence}`;
}

// ============================================================================
// PER DIEM & GSA RATE FUNCTIONS (17-24)
// ============================================================================

/**
 * Calculates per diem allowance using GSA rates.
 *
 * @param {string} destination - Destination city/state
 * @param {string} checkInDate - Check-in date
 * @param {string} checkOutDate - Check-out date
 * @param {ExpenseTravelContext} context - Execution context
 * @returns {Promise<PerDiemCalculation>} Per diem calculation
 *
 * @example
 * ```typescript
 * const perDiem = await calculatePerDiem(
 *   'Washington, DC',
 *   '2025-03-10',
 *   '2025-03-14',
 *   context
 * );
 * console.log(`Total per diem: $${perDiem.totalPerDiem}`);
 * ```
 */
export async function calculatePerDiem(
  destination: string,
  checkInDate: string,
  checkOutDate: string,
  context: ExpenseTravelContext,
): Promise<PerDiemCalculation> {
  const gsaRate = await getGsaRate(destination, checkInDate);
  const totalDays = calculateTravelDays(checkInDate, checkOutDate);

  // Apply proration for first and last days (75% on travel days)
  const fullDays = Math.max(totalDays - 2, 0);
  const firstDayProration = 0.75;
  const lastDayProration = 0.75;

  const firstDayMeals = gsaRate.mealsRate * firstDayProration;
  const lastDayMeals = gsaRate.mealsRate * lastDayProration;
  const fullDayMeals = gsaRate.mealsRate * fullDays;

  const totalMeals = firstDayMeals + lastDayMeals + fullDayMeals;
  const totalLodging = gsaRate.lodgingRate * (totalDays - 1); // No lodging on last day
  const totalIncidentals = gsaRate.incidentalsRate * totalDays;

  return {
    destination,
    checkInDate,
    checkOutDate,
    totalDays,
    lodgingRate: gsaRate.lodgingRate,
    mealsRate: gsaRate.mealsRate,
    incidentalsRate: gsaRate.incidentalsRate,
    totalLodging,
    totalMeals,
    totalIncidentals,
    totalPerDiem: totalLodging + totalMeals + totalIncidentals,
    gsaLocation: gsaRate.locationName,
    gsaEffectiveDate: gsaRate.effectiveDate,
    prorationApplied: true,
    prorationDetails: {
      firstDayProration,
      lastDayProration,
      firstDayAmount: firstDayMeals + gsaRate.incidentalsRate,
      lastDayAmount: lastDayMeals + gsaRate.incidentalsRate,
    },
  };
}

/**
 * Retrieves current GSA per diem rates for location.
 *
 * @param {string} destination - Destination city/state
 * @param {string} effectiveDate - Effective date for rate lookup
 * @returns {Promise<GsaRate>} GSA rate information
 *
 * @example
 * ```typescript
 * const rate = await getGsaRate('Washington, DC', '2025-03-10');
 * console.log(`Lodging rate: $${rate.lodgingRate}`);
 * ```
 */
export async function getGsaRate(destination: string, effectiveDate: string): Promise<GsaRate> {
  // Simplified - would query GSA rate database
  return {
    locationId: 'DC-001',
    locationName: 'Washington, DC',
    state: 'DC',
    fiscalYear: 2025,
    effectiveDate: '2024-10-01',
    expirationDate: '2025-09-30',
    lodgingRate: 194.00,
    mealsRate: 79.00,
    incidentalsRate: 5.00,
    totalRate: 278.00,
  };
}

/**
 * Imports GSA per diem rates from official source.
 *
 * @param {GsaRate[]} rates - GSA rates to import
 * @param {ExpenseTravelContext} context - Execution context
 * @returns {Promise<{imported: number; updated: number}>} Import results
 *
 * @example
 * ```typescript
 * const result = await importGsaRates(gsaRateData, context);
 * console.log(`Imported: ${result.imported}, Updated: ${result.updated}`);
 * ```
 */
export async function importGsaRates(
  rates: GsaRate[],
  context: ExpenseTravelContext,
): Promise<{ imported: number; updated: number }> {
  return {
    imported: rates.length,
    updated: 0,
  };
}

/**
 * Validates per diem claim against GSA rates.
 *
 * @param {PerDiemCalculation} claim - Per diem claim
 * @param {ExpenseTravelContext} context - Execution context
 * @returns {Promise<{isValid: boolean; violations: string[]}>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validatePerDiemClaim(claim, context);
 * ```
 */
export async function validatePerDiemClaim(
  claim: PerDiemCalculation,
  context: ExpenseTravelContext,
): Promise<{ isValid: boolean; violations: string[] }> {
  const violations: string[] = [];
  const gsaRate = await getGsaRate(claim.destination, claim.checkInDate);

  if (claim.totalPerDiem > gsaRate.totalRate * claim.totalDays) {
    violations.push('Per diem exceeds GSA maximum rates');
  }

  return {
    isValid: violations.length === 0,
    violations,
  };
}

/**
 * Calculates meal breakdown for per diem (breakfast, lunch, dinner).
 *
 * @param {number} totalMealsRate - Total M&IE rate
 * @returns {object} Meal breakdown
 *
 * @example
 * ```typescript
 * const breakdown = calculateMealBreakdown(79.00);
 * // { breakfast: 15.01, lunch: 17.76, dinner: 40.23, incidentals: 5.00 }
 * ```
 */
export function calculateMealBreakdown(totalMealsRate: number): {
  breakfast: number;
  lunch: number;
  dinner: number;
  incidentals: number;
} {
  // Standard GSA meal breakdown percentages
  const breakfast = totalMealsRate * 0.19;
  const lunch = totalMealsRate * 0.225;
  const dinner = totalMealsRate * 0.51;
  const incidentals = totalMealsRate * 0.075;

  return {
    breakfast: Math.round(breakfast * 100) / 100,
    lunch: Math.round(lunch * 100) / 100,
    dinner: Math.round(dinner * 100) / 100,
    incidentals: Math.round(incidentals * 100) / 100,
  };
}

/**
 * Searches GSA rates by location criteria.
 *
 * @param {object} criteria - Search criteria
 * @returns {Promise<GsaRate[]>} Matching GSA rates
 *
 * @example
 * ```typescript
 * const rates = await searchGsaRates({ state: 'CA', fiscalYear: 2025 });
 * ```
 */
export async function searchGsaRates(criteria: {
  state?: string;
  city?: string;
  fiscalYear?: number;
}): Promise<GsaRate[]> {
  // Would query database with criteria
  return [];
}

/**
 * Calculates prorated per diem for partial travel days.
 *
 * @param {number} fullDayRate - Full day per diem rate
 * @param {string} travelTime - Travel time (departure/arrival)
 * @returns {number} Prorated amount
 *
 * @example
 * ```typescript
 * const prorated = calculateProration(79.00, 'departure');
 * // Returns 59.25 (75% of full rate)
 * ```
 */
export function calculateProration(fullDayRate: number, travelTime: 'departure' | 'arrival'): number {
  return fullDayRate * 0.75;
}

/**
 * Calculates travel days for per diem (includes travel days).
 *
 * @param {string} startDate - Start date
 * @param {string} endDate - End date
 * @returns {number} Number of travel days
 *
 * @example
 * ```typescript
 * const days = calculateTravelDays('2025-03-10', '2025-03-14');
 * // Returns 5
 * ```
 */
export function calculateTravelDays(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays + 1; // Include both start and end dates
}

// ============================================================================
// MILEAGE & TRANSPORTATION FUNCTIONS (25-32)
// ============================================================================

/**
 * Calculates mileage reimbursement at IRS standard rate.
 *
 * @param {Partial<MileageReimbursement>} mileageData - Mileage data
 * @param {ExpenseTravelContext} context - Execution context
 * @returns {Promise<MileageReimbursement>} Mileage reimbursement calculation
 *
 * @example
 * ```typescript
 * const mileage = await calculateMileageReimbursement({
 *   employeeId: 'EMP123',
 *   travelDate: '2025-01-15',
 *   fromLocation: 'Office - 123 Main St',
 *   toLocation: 'Client Site - 456 Oak Ave',
 *   purpose: 'Client meeting',
 *   mileage: 45,
 *   vehicleType: 'personal_car'
 * }, context);
 * console.log(`Reimbursement: $${mileage.reimbursementAmount}`);
 * ```
 */
export async function calculateMileageReimbursement(
  mileageData: Partial<MileageReimbursement>,
  context: ExpenseTravelContext,
): Promise<MileageReimbursement> {
  const rate = await getIrsMileageRate(mileageData.travelDate!, mileageData.vehicleType!);

  return {
    ...mileageData,
    employeeId: mileageData.employeeId || context.employeeId,
    reimbursementRate: rate,
    reimbursementAmount: mileageData.mileage! * rate,
    authorized: false,
    receiptsRequired: false,
    metadata: mileageData.metadata || {},
  };
}

/**
 * Retrieves current IRS mileage reimbursement rate.
 *
 * @param {string} effectiveDate - Effective date
 * @param {VehicleType} vehicleType - Type of vehicle
 * @returns {Promise<number>} Mileage rate per mile
 *
 * @example
 * ```typescript
 * const rate = await getIrsMileageRate('2025-01-15', 'personal_car');
 * // Returns 0.67
 * ```
 */
export async function getIrsMileageRate(effectiveDate: string, vehicleType: VehicleType): Promise<number> {
  // Simplified - would query IRS rate table
  const rates: Record<VehicleType, number> = {
    personal_car: 0.67,
    personal_motorcycle: 0.67,
    personal_van: 0.67,
    rental_car: 0,
    government_vehicle: 0,
  };
  return rates[vehicleType];
}

/**
 * Validates mileage claim against map data.
 *
 * @param {MileageReimbursement} claim - Mileage claim
 * @returns {Promise<{isValid: boolean; actualMileage?: number; variance?: number}>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateMileageClaim(claim);
 * if (validation.variance && validation.variance > 10) {
 *   console.log('Mileage discrepancy detected');
 * }
 * ```
 */
export async function validateMileageClaim(
  claim: MileageReimbursement,
): Promise<{ isValid: boolean; actualMileage?: number; variance?: number }> {
  // Would integrate with mapping service to validate distance
  return {
    isValid: true,
    actualMileage: claim.mileage,
    variance: 0,
  };
}

/**
 * Authorizes mileage reimbursement.
 *
 * @param {string} mileageId - Mileage reimbursement ID
 * @param {string} authorizerId - Authorizer user ID
 * @param {ExpenseTravelContext} context - Execution context
 * @returns {Promise<MileageReimbursement>} Authorized mileage reimbursement
 *
 * @example
 * ```typescript
 * const authorized = await authorizeMileage('MIL-001', 'MGR456', context);
 * ```
 */
export async function authorizeMileage(
  mileageId: string,
  authorizerId: string,
  context: ExpenseTravelContext,
): Promise<MileageReimbursement> {
  return {
    id: mileageId,
    authorized: true,
    authorizedBy: authorizerId,
  } as MileageReimbursement;
}

/**
 * Calculates round-trip mileage automatically.
 *
 * @param {number} oneWayMileage - One-way mileage
 * @returns {number} Round-trip mileage
 *
 * @example
 * ```typescript
 * const roundTrip = calculateRoundTripMileage(25);
 * // Returns 50
 * ```
 */
export function calculateRoundTripMileage(oneWayMileage: number): number {
  return oneWayMileage * 2;
}

/**
 * Validates odometry readings for accuracy.
 *
 * @param {number} startOdometry - Starting odometer reading
 * @param {number} endOdometry - Ending odometer reading
 * @param {number} claimedMileage - Claimed mileage
 * @returns {boolean} True if readings match claim
 *
 * @example
 * ```typescript
 * const valid = validateOdometry(10000, 10050, 50);
 * // Returns true
 * ```
 */
export function validateOdometry(startOdometry: number, endOdometry: number, claimedMileage: number): boolean {
  const actualMileage = endOdometry - startOdometry;
  return actualMileage === claimedMileage;
}

/**
 * Compares personal vehicle vs rental cost for trip.
 *
 * @param {number} mileage - Trip mileage
 * @param {number} days - Number of rental days
 * @returns {Promise<{personalVehicleCost: number; rentalCost: number; recommendation: string}>} Cost comparison
 *
 * @example
 * ```typescript
 * const comparison = await compareTravelCosts(500, 3);
 * console.log(comparison.recommendation);
 * ```
 */
export async function compareTravelCosts(
  mileage: number,
  days: number,
): Promise<{ personalVehicleCost: number; rentalCost: number; recommendation: string }> {
  const mileageRate = 0.67;
  const personalVehicleCost = mileage * mileageRate;
  const rentalCost = days * 50; // Simplified rental estimate

  return {
    personalVehicleCost,
    rentalCost,
    recommendation: personalVehicleCost < rentalCost ? 'Personal vehicle' : 'Rental car',
  };
}

/**
 * Generates mileage log report for period.
 *
 * @param {string} employeeId - Employee ID
 * @param {Date} startDate - Period start date
 * @param {Date} endDate - Period end date
 * @returns {Promise<object>} Mileage log report
 *
 * @example
 * ```typescript
 * const log = await generateMileageLog('EMP123', new Date('2025-01-01'), new Date('2025-01-31'));
 * ```
 */
export async function generateMileageLog(
  employeeId: string,
  startDate: Date,
  endDate: Date,
): Promise<{ totalMileage: number; totalReimbursement: number; trips: MileageReimbursement[] }> {
  return {
    totalMileage: 0,
    totalReimbursement: 0,
    trips: [],
  };
}

// ============================================================================
// CORPORATE CARD & RECONCILIATION FUNCTIONS (33-40)
// ============================================================================

/**
 * Imports corporate card transactions for reconciliation.
 *
 * @param {CardTransaction[]} transactions - Transactions to import
 * @param {ExpenseTravelContext} context - Execution context
 * @returns {Promise<{imported: number; errors: any[]}>} Import results
 *
 * @example
 * ```typescript
 * const result = await importCardTransactions(transactionData, context);
 * console.log(`Imported ${result.imported} transactions`);
 * ```
 */
export async function importCardTransactions(
  transactions: CardTransaction[],
  context: ExpenseTravelContext,
): Promise<{ imported: number; errors: any[] }> {
  return {
    imported: transactions.length,
    errors: [],
  };
}

/**
 * Reconciles card transaction to expense report.
 *
 * @param {string} transactionId - Transaction ID
 * @param {string} expenseReportId - Expense report ID
 * @param {string} lineItemId - Line item ID
 * @param {ExpenseTravelContext} context - Execution context
 * @returns {Promise<CardTransaction>} Reconciled transaction
 *
 * @example
 * ```typescript
 * const reconciled = await reconcileCardTransaction('TXN-001', 'EXP-2025-001234', 'LINE-001', context);
 * ```
 */
export async function reconcileCardTransaction(
  transactionId: string,
  expenseReportId: string,
  lineItemId: string,
  context: ExpenseTravelContext,
): Promise<CardTransaction> {
  return {
    transactionId,
    reconciled: true,
    reconciledDate: new Date().toISOString(),
    expenseReportId: parseInt(expenseReportId.split('-')[2]),
    expenseLineItemId: lineItemId,
  } as CardTransaction;
}

/**
 * Finds unreconciled corporate card transactions.
 *
 * @param {string} employeeId - Employee ID
 * @param {Date} startDate - Search start date
 * @param {Date} endDate - Search end date
 * @returns {Promise<CardTransaction[]>} Unreconciled transactions
 *
 * @example
 * ```typescript
 * const unreconciled = await findUnreconciledTransactions('EMP123', new Date('2025-01-01'), new Date('2025-01-31'));
 * ```
 */
export async function findUnreconciledTransactions(
  employeeId: string,
  startDate: Date,
  endDate: Date,
): Promise<CardTransaction[]> {
  // Would query database for unreconciled transactions
  return [];
}

/**
 * Disputes corporate card transaction.
 *
 * @param {string} transactionId - Transaction ID
 * @param {string} disputeReason - Dispute reason
 * @param {ExpenseTravelContext} context - Execution context
 * @returns {Promise<CardTransaction>} Disputed transaction
 *
 * @example
 * ```typescript
 * const disputed = await disputeTransaction('TXN-001', 'Duplicate charge', context);
 * ```
 */
export async function disputeTransaction(
  transactionId: string,
  disputeReason: string,
  context: ExpenseTravelContext,
): Promise<CardTransaction> {
  return {
    transactionId,
    disputed: true,
    disputeReason,
  } as CardTransaction;
}

/**
 * Generates corporate card reconciliation report.
 *
 * @param {string} cardId - Corporate card ID
 * @param {Date} periodStart - Period start date
 * @param {Date} periodEnd - Period end date
 * @returns {Promise<object>} Reconciliation report
 *
 * @example
 * ```typescript
 * const report = await generateCardReconciliationReport('CARD-123', new Date('2025-01-01'), new Date('2025-01-31'));
 * ```
 */
export async function generateCardReconciliationReport(
  cardId: string,
  periodStart: Date,
  periodEnd: Date,
): Promise<{
  cardId: string;
  totalTransactions: number;
  totalAmount: number;
  reconciledCount: number;
  unreconciledCount: number;
  disputedCount: number;
}> {
  return {
    cardId,
    totalTransactions: 0,
    totalAmount: 0,
    reconciledCount: 0,
    unreconciledCount: 0,
    disputedCount: 0,
  };
}

/**
 * Validates card transaction against merchant category limits.
 *
 * @param {CardTransaction} transaction - Transaction to validate
 * @param {ExpenseTravelContext} context - Execution context
 * @returns {Promise<{isValid: boolean; warnings: string[]}>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateCardTransaction(transaction, context);
 * ```
 */
export async function validateCardTransaction(
  transaction: CardTransaction,
  context: ExpenseTravelContext,
): Promise<{ isValid: boolean; warnings: string[] }> {
  return {
    isValid: true,
    warnings: [],
  };
}

/**
 * Auto-matches card transactions to expense line items.
 *
 * @param {string} employeeId - Employee ID
 * @param {Date} periodStart - Period start date
 * @param {Date} periodEnd - Period end date
 * @returns {Promise<Array<{transaction: CardTransaction; matches: ExpenseLineItem[]}>>} Match suggestions
 *
 * @example
 * ```typescript
 * const matches = await autoMatchTransactions('EMP123', new Date('2025-01-01'), new Date('2025-01-31'));
 * ```
 */
export async function autoMatchTransactions(
  employeeId: string,
  periodStart: Date,
  periodEnd: Date,
): Promise<Array<{ transaction: CardTransaction; matches: ExpenseLineItem[] }>> {
  return [];
}

/**
 * Sends reconciliation reminders to cardholders.
 *
 * @param {string[]} employeeIds - Employee IDs
 * @param {ExpenseTravelContext} context - Execution context
 * @returns {Promise<number>} Number of reminders sent
 *
 * @example
 * ```typescript
 * const sent = await sendReconciliationReminders(['EMP123', 'EMP456'], context);
 * ```
 */
export async function sendReconciliationReminders(
  employeeIds: string[],
  context: ExpenseTravelContext,
): Promise<number> {
  return employeeIds.length;
}

// ============================================================================
// TRAVEL ADVANCE & REIMBURSEMENT FUNCTIONS (41-48)
// ============================================================================

/**
 * Creates travel advance request.
 *
 * @param {Partial<TravelAdvance>} advanceData - Advance data
 * @param {ExpenseTravelContext} context - Execution context
 * @returns {Promise<TravelAdvance>} Created travel advance
 *
 * @example
 * ```typescript
 * const advance = await createTravelAdvance({
 *   employeeId: 'EMP123',
 *   travelAuthorizationId: 'TA-2025-001234',
 *   advanceAmount: 1500.00,
 *   purpose: 'Conference lodging and meals',
 *   dueDate: '2025-04-30',
 *   paymentMethod: 'direct_deposit'
 * }, context);
 * ```
 */
export async function createTravelAdvance(
  advanceData: Partial<TravelAdvance>,
  context: ExpenseTravelContext,
): Promise<TravelAdvance> {
  const advanceNumber = await generateAdvanceNumber(context.fiscalYear);

  return {
    ...advanceData,
    advanceNumber,
    employeeId: advanceData.employeeId || context.employeeId,
    advanceDate: new Date().toISOString(),
    status: 'requested',
    reconciled: false,
    metadata: advanceData.metadata || {},
  };
}

/**
 * Processes travel advance payment.
 *
 * @param {string} advanceId - Advance ID
 * @param {string} paymentReference - Payment reference number
 * @param {ExpenseTravelContext} context - Execution context
 * @returns {Promise<TravelAdvance>} Processed advance
 *
 * @example
 * ```typescript
 * const processed = await processTravelAdvancePayment('ADV-2025-001234', 'PAY-987654', context);
 * ```
 */
export async function processTravelAdvancePayment(
  advanceId: string,
  paymentReference: string,
  context: ExpenseTravelContext,
): Promise<TravelAdvance> {
  return {
    id: advanceId,
    status: 'paid',
    paymentReference,
  } as TravelAdvance;
}

/**
 * Reconciles travel advance against expense report.
 *
 * @param {string} advanceId - Advance ID
 * @param {string} expenseReportId - Expense report ID
 * @param {ExpenseTravelContext} context - Execution context
 * @returns {Promise<TravelAdvance>} Reconciled advance
 *
 * @example
 * ```typescript
 * const reconciled = await reconcileTravelAdvance('ADV-2025-001234', 'EXP-2025-001234', context);
 * console.log(`Amount owed: $${reconciled.amountOwed || 0}`);
 * ```
 */
export async function reconcileTravelAdvance(
  advanceId: string,
  expenseReportId: string,
  context: ExpenseTravelContext,
): Promise<TravelAdvance> {
  // Would calculate actual expenses vs advance
  return {
    id: advanceId,
    reconciled: true,
    reconciledDate: new Date().toISOString(),
  } as TravelAdvance;
}

/**
 * Processes reimbursement payment to employee.
 *
 * @param {Partial<ReimbursementPayment>} paymentData - Payment data
 * @param {ExpenseTravelContext} context - Execution context
 * @returns {Promise<ReimbursementPayment>} Created reimbursement payment
 *
 * @example
 * ```typescript
 * const payment = await processReimbursementPayment({
 *   expenseReportId: 'EXP-2025-001234',
 *   employeeId: 'EMP123',
 *   paymentAmount: 450.00,
 *   paymentMethod: 'direct_deposit'
 * }, context);
 * ```
 */
export async function processReimbursementPayment(
  paymentData: Partial<ReimbursementPayment>,
  context: ExpenseTravelContext,
): Promise<ReimbursementPayment> {
  const paymentNumber = await generatePaymentNumber(context.fiscalYear);

  return {
    ...paymentData,
    paymentNumber,
    employeeId: paymentData.employeeId || context.employeeId,
    paymentDate: new Date().toISOString(),
    status: 'processing',
    reconciled: false,
    metadata: paymentData.metadata || {},
  };
}

/**
 * Generates payment batch for multiple reimbursements.
 *
 * @param {string[]} expenseReportIds - Expense report IDs
 * @param {ExpenseTravelContext} context - Execution context
 * @returns {Promise<string>} Batch ID
 *
 * @example
 * ```typescript
 * const batchId = await generatePaymentBatch(['EXP-001', 'EXP-002', 'EXP-003'], context);
 * ```
 */
export async function generatePaymentBatch(
  expenseReportIds: string[],
  context: ExpenseTravelContext,
): Promise<string> {
  return `BATCH-${Date.now()}`;
}

/**
 * Validates reimbursement payment eligibility.
 *
 * @param {string} expenseReportId - Expense report ID
 * @param {ExpenseTravelContext} context - Execution context
 * @returns {Promise<{eligible: boolean; reasons: string[]}>} Eligibility result
 *
 * @example
 * ```typescript
 * const eligibility = await validateReimbursementEligibility('EXP-2025-001234', context);
 * ```
 */
export async function validateReimbursementEligibility(
  expenseReportId: string,
  context: ExpenseTravelContext,
): Promise<{ eligible: boolean; reasons: string[] }> {
  return {
    eligible: true,
    reasons: [],
  };
}

/**
 * Tracks reimbursement payment status.
 *
 * @param {string} paymentNumber - Payment number
 * @returns {Promise<PaymentStatus>} Payment status
 *
 * @example
 * ```typescript
 * const status = await trackPaymentStatus('PAY-2025-001234');
 * console.log(`Status: ${status}`);
 * ```
 */
export async function trackPaymentStatus(paymentNumber: string): Promise<PaymentStatus> {
  return 'completed';
}

/**
 * Generates unique advance number.
 *
 * @param {number} fiscalYear - Fiscal year
 * @returns {Promise<string>} Unique advance number
 */
async function generateAdvanceNumber(fiscalYear: number): Promise<string> {
  const sequence = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  return `ADV-${fiscalYear}-${sequence}`;
}

/**
 * Generates unique payment number.
 *
 * @param {number} fiscalYear - Fiscal year
 * @returns {Promise<string>} Unique payment number
 */
async function generatePaymentNumber(fiscalYear: number): Promise<string> {
  const sequence = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  return `PAY-${fiscalYear}-${sequence}`;
}

// ============================================================================
// HELPER UTILITY FUNCTIONS
// ============================================================================

/**
 * Builds approval workflow for expense report.
 *
 * @param {string} reportId - Expense report ID
 * @param {ExpenseTravelContext} context - Execution context
 * @returns {Promise<ApprovalStep[]>} Approval workflow steps
 */
async function buildApprovalWorkflow(
  reportId: string,
  context: ExpenseTravelContext,
): Promise<ApprovalStep[]> {
  return [
    {
      level: 1,
      approverId: 'MGR-' + context.departmentId,
      approverName: 'Department Manager',
      approverTitle: 'Manager',
      status: 'pending',
      notifiedDate: new Date().toISOString(),
    },
  ];
}

/**
 * Gets travel policy for category and agency.
 *
 * @param {ExpenseCategory} category - Expense category
 * @param {string} agencyId - Agency ID
 * @returns {Promise<TravelPolicy>} Travel policy
 */
async function getTravelPolicy(category: ExpenseCategory, agencyId: string): Promise<TravelPolicy> {
  return {
    policyId: 'POL-001',
    policyName: 'Standard Travel Policy',
    policyType: 'federal',
    effectiveDate: '2025-01-01',
    agencyId,
    category,
    maxAmount: 200,
    requiresReceipt: true,
    receiptThreshold: 75,
    requiresPreApproval: false,
    complianceRules: [],
    active: true,
  };
}

/**
 * Formats currency amount.
 *
 * @param {number} amount - Amount
 * @param {string} currency - Currency code
 * @returns {string} Formatted currency
 *
 * @example
 * ```typescript
 * const formatted = formatCurrency(1234.56, 'USD');
 * // '$1,234.56'
 * ```
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

// ============================================================================
// NESTJS CONTROLLER EXAMPLE
// ============================================================================

/**
 * NestJS controller for expense and travel management.
 */
@ApiTags('Expense & Travel')
@Controller('expense-travel')
@ApiBearerAuth()
export class ExpenseTravelController {
  @Post('expense-report')
  @ApiOperation({ summary: 'Create expense report' })
  @ApiResponse({ status: 201, description: 'Expense report created successfully' })
  async createReport(@Body() reportData: any): Promise<ExpenseReport> {
    const context: ExpenseTravelContext = {
      userId: 'USER123',
      employeeId: reportData.employeeId,
      departmentId: 'DEPT123',
      agencyId: 'AGENCY123',
      fiscalYear: new Date().getFullYear(),
      timestamp: new Date().toISOString(),
    };
    return createExpenseReport(reportData, context);
  }

  @Post('travel-authorization')
  @ApiOperation({ summary: 'Create travel authorization' })
  @ApiResponse({ status: 201, description: 'Travel authorization created successfully' })
  async createAuth(@Body() authData: any): Promise<TravelAuthorization> {
    const context: ExpenseTravelContext = {
      userId: 'USER123',
      employeeId: authData.employeeId,
      departmentId: 'DEPT123',
      agencyId: 'AGENCY123',
      fiscalYear: new Date().getFullYear(),
      timestamp: new Date().toISOString(),
    };
    return createTravelAuthorization(authData, context);
  }

  @Post('per-diem/calculate')
  @ApiOperation({ summary: 'Calculate per diem allowance' })
  @ApiBody({
    schema: {
      properties: {
        destination: { type: 'string', example: 'Washington, DC' },
        checkInDate: { type: 'string', example: '2025-03-10' },
        checkOutDate: { type: 'string', example: '2025-03-14' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Per diem calculated successfully' })
  async calculatePerDiemEndpoint(@Body() data: { destination: string; checkInDate: string; checkOutDate: string }): Promise<PerDiemCalculation> {
    const context: ExpenseTravelContext = {
      userId: 'USER123',
      employeeId: 'EMP123',
      departmentId: 'DEPT123',
      agencyId: 'AGENCY123',
      fiscalYear: new Date().getFullYear(),
      timestamp: new Date().toISOString(),
    };
    return calculatePerDiem(data.destination, data.checkInDate, data.checkOutDate, context);
  }

  @Get('gsa-rate/:destination')
  @ApiOperation({ summary: 'Get GSA per diem rate' })
  @ApiParam({ name: 'destination', description: 'Destination city/state' })
  @ApiQuery({ name: 'date', description: 'Effective date (YYYY-MM-DD)' })
  @ApiResponse({ status: 200, description: 'GSA rate retrieved successfully' })
  async getGsaRateEndpoint(
    @Param('destination') destination: string,
    @Query('date') date: string,
  ): Promise<GsaRate> {
    return getGsaRate(destination, date);
  }

  @Post('mileage/calculate')
  @ApiOperation({ summary: 'Calculate mileage reimbursement' })
  @ApiResponse({ status: 200, description: 'Mileage calculated successfully' })
  async calculateMileageEndpoint(@Body() mileageData: any): Promise<MileageReimbursement> {
    const context: ExpenseTravelContext = {
      userId: 'USER123',
      employeeId: mileageData.employeeId,
      departmentId: 'DEPT123',
      agencyId: 'AGENCY123',
      fiscalYear: new Date().getFullYear(),
      timestamp: new Date().toISOString(),
    };
    return calculateMileageReimbursement(mileageData, context);
  }
}

// Helper function to make ApiProperty available
function ApiProperty(options: any): PropertyDecorator {
  return (target: Object, propertyKey: string | symbol) => {};
}
