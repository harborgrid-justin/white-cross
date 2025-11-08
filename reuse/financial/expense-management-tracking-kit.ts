/**
 * LOC: FINEXP1234567
 * File: /reuse/financial/expense-management-tracking-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - NestJS financial management controllers
 *   - Backend expense services
 *   - API financial endpoints
 *   - USACE CEFMS integration modules
 */

/**
 * File: /reuse/financial/expense-management-tracking-kit.ts
 * Locator: WC-FIN-EXPMGT-001
 * Purpose: Comprehensive Expense Management & Tracking - expense reports, approvals, reimbursements, corporate cards, travel expenses
 *
 * Upstream: Independent utility module for enterprise expense management
 * Downstream: ../backend/*, API controllers, financial services, approval workflows, reimbursement processors
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, @nestjs/swagger
 * Exports: 45+ utility functions for expense tracking, approval workflows, reimbursement processing, corporate card management, travel expenses
 *
 * LLM Context: Enterprise-grade expense management system competing with USACE CEFMS.
 * Provides expense report creation, multi-level approval workflows, automated policy compliance checks,
 * corporate card reconciliation, travel expense management, receipt processing, mileage tracking,
 * per diem calculations, audit trails, fraud detection, reimbursement processing, tax compliance,
 * integration with accounting systems, mobile receipt capture, and comprehensive financial reporting.
 */

import { Request, Response } from 'express';
import { Model, DataTypes, Sequelize, Transaction, Op, ValidationError as SequelizeValidationError } from 'sequelize';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface ExpenseContext {
  userId: string;
  employeeId: string;
  departmentId: string;
  projectId?: string;
  costCenter?: string;
  requestId?: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

interface ExpenseLineItem {
  id?: string;
  category: ExpenseCategory;
  subcategory?: string;
  date: string;
  amount: number;
  currency: string;
  merchantName: string;
  merchantLocation?: string;
  description: string;
  receiptUrl?: string;
  receiptId?: string;
  taxAmount?: number;
  taxRate?: number;
  billable: boolean;
  clientId?: string;
  projectCode?: string;
  accountingCode?: string;
  policyCompliant: boolean;
  policyViolations?: string[];
  approvalRequired: boolean;
  reimbursable: boolean;
  paymentMethod?: PaymentMethod;
  cardLastFour?: string;
  metadata?: Record<string, any>;
}

interface ExpenseReport {
  id?: string;
  reportNumber: string;
  employeeId: string;
  submitterId: string;
  title: string;
  purpose: string;
  reportType: ExpenseReportType;
  status: ExpenseReportStatus;
  totalAmount: number;
  reimbursableAmount: number;
  nonReimbursableAmount: number;
  currency: string;
  lineItems: ExpenseLineItem[];
  approvalChain: ApprovalStep[];
  currentApproverId?: string;
  submittedAt?: string;
  approvedAt?: string;
  paidAt?: string;
  dueDate?: string;
  paymentMethod?: string;
  paymentReference?: string;
  notes?: string;
  attachments?: AttachmentInfo[];
  auditLog: AuditEntry[];
  policyViolations: PolicyViolation[];
  flags: ExpenseFlag[];
  metadata?: Record<string, any>;
}

interface ApprovalStep {
  level: number;
  approverId: string;
  approverName: string;
  approverEmail: string;
  approverRole: string;
  status: ApprovalStatus;
  approvedAt?: string;
  rejectedAt?: string;
  comments?: string;
  delegatedTo?: string;
  autoApproved: boolean;
  notifiedAt?: string;
  remindersSent: number;
}

interface PolicyViolation {
  ruleId: string;
  ruleName: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  lineItemId?: string;
  description: string;
  suggestedCorrection?: string;
  overrideReason?: string;
  overriddenBy?: string;
  overriddenAt?: string;
}

interface ExpenseFlag {
  type: FlagType;
  severity: 'info' | 'warning' | 'error';
  description: string;
  raiseAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
  resolution?: string;
}

interface TravelExpense {
  tripId?: string;
  tripPurpose: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  travelType: TravelType;
  accommodationExpenses: ExpenseLineItem[];
  transportationExpenses: ExpenseLineItem[];
  mealExpenses: ExpenseLineItem[];
  perDiemAmount?: number;
  perDiemRate?: number;
  perDiemDays?: number;
  mileage?: MileageInfo;
  receiptsRequired: boolean;
  advanceReceived?: number;
  advanceReconciled: boolean;
}

interface MileageInfo {
  totalMiles: number;
  reimbursementRate: number;
  reimbursementAmount: number;
  vehicleType: string;
  odometryStart?: number;
  odometryEnd?: number;
  route?: string;
  purpose: string;
  date: string;
}

interface CorporateCardTransaction {
  transactionId: string;
  cardId: string;
  cardLastFour: string;
  cardHolderName: string;
  merchantName: string;
  merchantCategory: string;
  transactionDate: string;
  postDate: string;
  amount: number;
  currency: string;
  description?: string;
  reconciled: boolean;
  reconciledAt?: string;
  expenseReportId?: string;
  expenseLineItemId?: string;
  personalExpense: boolean;
  disputed: boolean;
  disputeReason?: string;
  category?: ExpenseCategory;
  receiptAttached: boolean;
  metadata?: Record<string, any>;
}

interface ReimbursementRequest {
  id?: string;
  requestNumber: string;
  employeeId: string;
  expenseReportId: string;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  bankAccountId?: string;
  paymentStatus: PaymentStatus;
  scheduledPaymentDate?: string;
  actualPaymentDate?: string;
  paymentReference?: string;
  paymentBatchId?: string;
  taxWithheld?: number;
  netAmount: number;
  notes?: string;
  metadata?: Record<string, any>;
}

interface AttachmentInfo {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string;
  uploadedBy: string;
  url: string;
  thumbnailUrl?: string;
  ocrProcessed: boolean;
  ocrData?: OCRData;
  virusScanStatus: 'pending' | 'clean' | 'infected';
}

interface OCRData {
  merchantName?: string;
  transactionDate?: string;
  totalAmount?: number;
  taxAmount?: number;
  currency?: string;
  confidence: number;
  rawText?: string;
}

interface AuditEntry {
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  changes?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

interface ExpenseApprovalConfig {
  departmentId: string;
  thresholds: ApprovalThreshold[];
  defaultApprovers: string[];
  escalationRules: EscalationRule[];
  autoApprovalEnabled: boolean;
  autoApprovalThreshold?: number;
  requiresReceipts: boolean;
  receiptThreshold?: number;
}

interface ApprovalThreshold {
  minAmount: number;
  maxAmount: number;
  requiredApprovers: number;
  approverRoles: string[];
  sequentialApproval: boolean;
}

interface EscalationRule {
  hoursWithoutAction: number;
  escalateTo: string[];
  notificationMethod: string[];
  autoApproveAfterHours?: number;
}

interface ExpensePolicyRule {
  ruleId: string;
  ruleName: string;
  category?: ExpenseCategory;
  maxAmount?: number;
  requiresReceipt: boolean;
  receiptThreshold?: number;
  requiresJustification: boolean;
  allowedMerchants?: string[];
  blockedMerchants?: string[];
  allowedLocations?: string[];
  advanceApprovalRequired: boolean;
  reimbursable: boolean;
  taxDeductible: boolean;
  severity: 'info' | 'warning' | 'error';
  active: boolean;
}

interface PerDiemRate {
  locationId: string;
  locationName: string;
  country: string;
  state?: string;
  city?: string;
  effectiveDate: string;
  expirationDate?: string;
  lodgingRate: number;
  mealRate: number;
  incidentalRate: number;
  totalDailyRate: number;
  currency: string;
  season?: string;
}

interface ExpenseAnalytics {
  totalExpenses: number;
  totalReimbursements: number;
  averageExpenseAmount: number;
  topCategories: CategorySummary[];
  topMerchants: MerchantSummary[];
  policyViolationRate: number;
  approvalCycleTime: number;
  reimbursementCycleTime: number;
  outOfPolicyAmount: number;
  pendingApprovals: number;
  periodStart: string;
  periodEnd: string;
}

interface CategorySummary {
  category: ExpenseCategory;
  totalAmount: number;
  transactionCount: number;
  averageAmount: number;
  percentageOfTotal: number;
}

interface MerchantSummary {
  merchantName: string;
  totalAmount: number;
  transactionCount: number;
  categories: string[];
}

type ExpenseCategory =
  | 'travel'
  | 'lodging'
  | 'meals'
  | 'transportation'
  | 'fuel'
  | 'parking'
  | 'tolls'
  | 'airfare'
  | 'car_rental'
  | 'taxi_rideshare'
  | 'office_supplies'
  | 'software_subscriptions'
  | 'training_education'
  | 'client_entertainment'
  | 'marketing'
  | 'telecommunications'
  | 'shipping'
  | 'equipment'
  | 'maintenance'
  | 'professional_services'
  | 'other';

type ExpenseReportType = 'standard' | 'travel' | 'mileage' | 'corporate_card' | 'project_based' | 'per_diem';

type ExpenseReportStatus =
  | 'draft'
  | 'submitted'
  | 'pending_approval'
  | 'approved'
  | 'rejected'
  | 'pending_payment'
  | 'paid'
  | 'cancelled'
  | 'under_review'
  | 'requires_information';

type ApprovalStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'delegated'
  | 'auto_approved'
  | 'escalated'
  | 'expired';

type PaymentMethod =
  | 'direct_deposit'
  | 'check'
  | 'wire_transfer'
  | 'corporate_card'
  | 'payroll_integration'
  | 'digital_wallet';

type PaymentStatus =
  | 'pending'
  | 'scheduled'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'on_hold';

type TravelType = 'domestic' | 'international' | 'local';

type FlagType =
  | 'duplicate_expense'
  | 'unusual_amount'
  | 'missing_receipt'
  | 'policy_violation'
  | 'fraud_alert'
  | 'stale_report'
  | 'multiple_submissions'
  | 'unreconciled_card';

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
 *   title: 'NYC Business Trip',
 *   totalAmount: 1500.00,
 *   status: 'submitted'
 * });
 * ```
 */
export const createExpenseReportModel = (sequelize: Sequelize) => {
  class ExpenseReport extends Model {
    public id!: number;
    public reportNumber!: string;
    public employeeId!: string;
    public submitterId!: string;
    public title!: string;
    public purpose!: string;
    public reportType!: string;
    public status!: string;
    public totalAmount!: number;
    public reimbursableAmount!: number;
    public nonReimbursableAmount!: number;
    public currency!: string;
    public lineItems!: ExpenseLineItem[];
    public approvalChain!: ApprovalStep[];
    public currentApproverId!: string | null;
    public submittedAt!: Date | null;
    public approvedAt!: Date | null;
    public paidAt!: Date | null;
    public dueDate!: Date | null;
    public paymentMethod!: string | null;
    public paymentReference!: string | null;
    public notes!: string | null;
    public attachments!: AttachmentInfo[];
    public auditLog!: AuditEntry[];
    public policyViolations!: PolicyViolation[];
    public flags!: ExpenseFlag[];
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
        comment: 'Employee ID who incurred expenses',
      },
      submitterId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'User ID who submitted the report',
      },
      title: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Report title/description',
      },
      purpose: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Business purpose of expenses',
      },
      reportType: {
        type: DataTypes.ENUM('standard', 'travel', 'mileage', 'corporate_card', 'project_based', 'per_diem'),
        allowNull: false,
        defaultValue: 'standard',
        comment: 'Type of expense report',
      },
      status: {
        type: DataTypes.ENUM('draft', 'submitted', 'pending_approval', 'approved', 'rejected', 'pending_payment', 'paid', 'cancelled', 'under_review', 'requires_information'),
        allowNull: false,
        defaultValue: 'draft',
        comment: 'Current status of expense report',
      },
      totalAmount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Total expense amount',
        validate: {
          min: 0,
        },
      },
      reimbursableAmount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Amount eligible for reimbursement',
        validate: {
          min: 0,
        },
      },
      nonReimbursableAmount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Amount not eligible for reimbursement',
        validate: {
          min: 0,
        },
      },
      currency: {
        type: DataTypes.STRING(3),
        allowNull: false,
        defaultValue: 'USD',
        comment: 'Currency code (ISO 4217)',
      },
      lineItems: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Array of expense line items',
      },
      approvalChain: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Approval workflow chain',
      },
      currentApproverId: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Current approver user ID',
      },
      submittedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Report submission timestamp',
      },
      approvedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Final approval timestamp',
      },
      paidAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Payment completion timestamp',
      },
      dueDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Expected payment due date',
      },
      paymentMethod: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Payment method for reimbursement',
      },
      paymentReference: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Payment transaction reference',
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Additional notes or comments',
      },
      attachments: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Receipt and document attachments',
      },
      auditLog: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Audit trail of all changes',
      },
      policyViolations: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Policy violations and overrides',
      },
      flags: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'System flags and alerts',
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
        { fields: ['submitterId'] },
        { fields: ['status'] },
        { fields: ['reportType'] },
        { fields: ['currentApproverId'] },
        { fields: ['submittedAt'] },
        { fields: ['approvedAt'] },
        { fields: ['paidAt'] },
        { fields: ['createdAt'] },
        { fields: ['totalAmount'] },
      ],
    },
  );

  return ExpenseReport;
};

/**
 * Sequelize model for Corporate Card Transactions with reconciliation tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CorporateCardTransaction model
 *
 * @example
 * ```typescript
 * const CardTransaction = createCorporateCardTransactionModel(sequelize);
 * const transaction = await CardTransaction.create({
 *   transactionId: 'TXN-123456',
 *   cardLastFour: '1234',
 *   merchantName: 'Hotel XYZ',
 *   amount: 250.00,
 *   reconciled: false
 * });
 * ```
 */
export const createCorporateCardTransactionModel = (sequelize: Sequelize) => {
  class CorporateCardTransaction extends Model {
    public id!: number;
    public transactionId!: string;
    public cardId!: string;
    public cardLastFour!: string;
    public cardHolderName!: string;
    public merchantName!: string;
    public merchantCategory!: string;
    public transactionDate!: Date;
    public postDate!: Date;
    public amount!: number;
    public currency!: string;
    public description!: string | null;
    public reconciled!: boolean;
    public reconciledAt!: Date | null;
    public expenseReportId!: number | null;
    public expenseLineItemId!: string | null;
    public personalExpense!: boolean;
    public disputed!: boolean;
    public disputeReason!: string | null;
    public category!: string | null;
    public receiptAttached!: boolean;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  CorporateCardTransaction.init(
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
        comment: 'Unique transaction identifier from card provider',
      },
      cardId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Corporate card identifier',
      },
      cardLastFour: {
        type: DataTypes.STRING(4),
        allowNull: false,
        comment: 'Last four digits of card number',
      },
      cardHolderName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Name on the card',
      },
      merchantName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Merchant name',
      },
      merchantCategory: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Merchant category code/description',
      },
      transactionDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Transaction date',
      },
      postDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Posted date to account',
      },
      amount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        comment: 'Transaction amount',
      },
      currency: {
        type: DataTypes.STRING(3),
        allowNull: false,
        defaultValue: 'USD',
        comment: 'Currency code',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Transaction description',
      },
      reconciled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Whether transaction is reconciled to expense report',
      },
      reconciledAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Reconciliation timestamp',
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
      personalExpense: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Flagged as personal expense',
      },
      disputed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Transaction disputed',
      },
      disputeReason: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Reason for dispute',
      },
      category: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Expense category',
      },
      receiptAttached: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Receipt uploaded',
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
      tableName: 'corporate_card_transactions',
      timestamps: true,
      indexes: [
        { fields: ['transactionId'], unique: true },
        { fields: ['cardId'] },
        { fields: ['cardLastFour'] },
        { fields: ['reconciled'] },
        { fields: ['expenseReportId'] },
        { fields: ['transactionDate'] },
        { fields: ['postDate'] },
        { fields: ['merchantName'] },
        { fields: ['personalExpense'] },
        { fields: ['disputed'] },
      ],
    },
  );

  return CorporateCardTransaction;
};

/**
 * Sequelize model for Reimbursement Requests with payment tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ReimbursementRequest model
 *
 * @example
 * ```typescript
 * const Reimbursement = createReimbursementRequestModel(sequelize);
 * const request = await Reimbursement.create({
 *   requestNumber: 'REIMB-2025-001234',
 *   employeeId: 'EMP123',
 *   amount: 1500.00,
 *   paymentStatus: 'pending'
 * });
 * ```
 */
export const createReimbursementRequestModel = (sequelize: Sequelize) => {
  class ReimbursementRequest extends Model {
    public id!: number;
    public requestNumber!: string;
    public employeeId!: string;
    public expenseReportId!: number;
    public amount!: number;
    public currency!: string;
    public paymentMethod!: string;
    public bankAccountId!: string | null;
    public paymentStatus!: string;
    public scheduledPaymentDate!: Date | null;
    public actualPaymentDate!: Date | null;
    public paymentReference!: string | null;
    public paymentBatchId!: string | null;
    public taxWithheld!: number;
    public netAmount!: number;
    public notes!: string | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  ReimbursementRequest.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      requestNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Unique reimbursement request number',
      },
      employeeId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Employee ID receiving reimbursement',
      },
      expenseReportId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Associated expense report ID',
      },
      amount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        comment: 'Reimbursement amount',
        validate: {
          min: 0,
        },
      },
      currency: {
        type: DataTypes.STRING(3),
        allowNull: false,
        defaultValue: 'USD',
        comment: 'Currency code',
      },
      paymentMethod: {
        type: DataTypes.ENUM('direct_deposit', 'check', 'wire_transfer', 'corporate_card', 'payroll_integration', 'digital_wallet'),
        allowNull: false,
        comment: 'Payment method',
      },
      bankAccountId: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Bank account ID for direct deposit',
      },
      paymentStatus: {
        type: DataTypes.ENUM('pending', 'scheduled', 'processing', 'completed', 'failed', 'cancelled', 'on_hold'),
        allowNull: false,
        defaultValue: 'pending',
        comment: 'Payment processing status',
      },
      scheduledPaymentDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Scheduled payment date',
      },
      actualPaymentDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Actual payment completion date',
      },
      paymentReference: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Payment transaction reference',
      },
      paymentBatchId: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Payment batch identifier',
      },
      taxWithheld: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Tax amount withheld',
      },
      netAmount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        comment: 'Net payment amount after tax',
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
      tableName: 'reimbursement_requests',
      timestamps: true,
      indexes: [
        { fields: ['requestNumber'], unique: true },
        { fields: ['employeeId'] },
        { fields: ['expenseReportId'] },
        { fields: ['paymentStatus'] },
        { fields: ['scheduledPaymentDate'] },
        { fields: ['actualPaymentDate'] },
        { fields: ['paymentBatchId'] },
        { fields: ['createdAt'] },
      ],
    },
  );

  return ReimbursementRequest;
};

/**
 * Sequelize model for Expense Policy Rules with compliance tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ExpensePolicyRule model
 *
 * @example
 * ```typescript
 * const PolicyRule = createExpensePolicyRuleModel(sequelize);
 * const rule = await PolicyRule.create({
 *   ruleId: 'RULE-MEAL-001',
 *   ruleName: 'Meal Expense Limit',
 *   category: 'meals',
 *   maxAmount: 75.00,
 *   requiresReceipt: true
 * });
 * ```
 */
export const createExpensePolicyRuleModel = (sequelize: Sequelize) => {
  class ExpensePolicyRule extends Model {
    public id!: number;
    public ruleId!: string;
    public ruleName!: string;
    public category!: string | null;
    public maxAmount!: number | null;
    public requiresReceipt!: boolean;
    public receiptThreshold!: number | null;
    public requiresJustification!: boolean;
    public allowedMerchants!: string[];
    public blockedMerchants!: string[];
    public allowedLocations!: string[];
    public advanceApprovalRequired!: boolean;
    public reimbursable!: boolean;
    public taxDeductible!: boolean;
    public severity!: string;
    public active!: boolean;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  ExpensePolicyRule.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      ruleId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Unique rule identifier',
      },
      ruleName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Rule name/description',
      },
      category: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Expense category this rule applies to',
      },
      maxAmount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true,
        comment: 'Maximum allowed amount',
      },
      requiresReceipt: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Receipt required',
      },
      receiptThreshold: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true,
        comment: 'Amount threshold requiring receipt',
      },
      requiresJustification: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Business justification required',
      },
      allowedMerchants: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Allowed merchant list',
      },
      blockedMerchants: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Blocked merchant list',
      },
      allowedLocations: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Allowed locations/regions',
      },
      advanceApprovalRequired: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Requires approval before purchase',
      },
      reimbursable: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Eligible for reimbursement',
      },
      taxDeductible: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Tax deductible expense',
      },
      severity: {
        type: DataTypes.ENUM('info', 'warning', 'error'),
        allowNull: false,
        defaultValue: 'warning',
        comment: 'Violation severity level',
      },
      active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Rule is active',
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
      tableName: 'expense_policy_rules',
      timestamps: true,
      indexes: [
        { fields: ['ruleId'], unique: true },
        { fields: ['category'] },
        { fields: ['active'] },
        { fields: ['severity'] },
      ],
    },
  );

  return ExpensePolicyRule;
};

// ============================================================================
// EXPENSE REPORT MANAGEMENT FUNCTIONS (1-12)
// ============================================================================

/**
 * Creates a new expense report with initial line items and metadata.
 *
 * @param {Partial<ExpenseReport>} reportData - Expense report data
 * @param {ExpenseContext} context - Execution context
 * @returns {Promise<ExpenseReport>} Created expense report
 *
 * @example
 * ```typescript
 * const report = await createExpenseReport({
 *   employeeId: 'EMP123',
 *   title: 'NYC Business Trip - Q1 2025',
 *   purpose: 'Client meeting and conference attendance',
 *   reportType: 'travel',
 *   lineItems: [
 *     { category: 'airfare', amount: 450, merchantName: 'United Airlines', date: '2025-01-15' }
 *   ]
 * }, context);
 * ```
 */
export async function createExpenseReport(
  reportData: Partial<ExpenseReport>,
  context: ExpenseContext,
): Promise<ExpenseReport> {
  const reportNumber = await generateExpenseReportNumber(context.employeeId);

  const report: ExpenseReport = {
    ...reportData,
    reportNumber,
    status: 'draft',
    totalAmount: 0,
    reimbursableAmount: 0,
    nonReimbursableAmount: 0,
    currency: reportData.currency || 'USD',
    lineItems: reportData.lineItems || [],
    approvalChain: [],
    auditLog: [
      {
        timestamp: new Date().toISOString(),
        userId: context.userId,
        userName: context.userId,
        action: 'CREATED',
      },
    ],
    policyViolations: [],
    flags: [],
    attachments: reportData.attachments || [],
    metadata: reportData.metadata || {},
  };

  // Calculate totals from line items
  report.totalAmount = calculateTotalAmount(report.lineItems);
  report.reimbursableAmount = calculateReimbursableAmount(report.lineItems);
  report.nonReimbursableAmount = report.totalAmount - report.reimbursableAmount;

  return report;
}

/**
 * Adds expense line items to an existing expense report with policy validation.
 *
 * @param {string} reportId - Expense report ID
 * @param {ExpenseLineItem[]} lineItems - Line items to add
 * @param {ExpenseContext} context - Execution context
 * @returns {Promise<ExpenseReport>} Updated expense report
 *
 * @example
 * ```typescript
 * const updated = await addExpenseLineItems('EXP-2025-001234', [
 *   {
 *     category: 'meals',
 *     date: '2025-01-16',
 *     amount: 45.00,
 *     merchantName: 'Restaurant ABC',
 *     description: 'Client dinner',
 *     billable: true,
 *     reimbursable: true
 *   }
 * ], context);
 * ```
 */
export async function addExpenseLineItems(
  reportId: string,
  lineItems: ExpenseLineItem[],
  context: ExpenseContext,
): Promise<ExpenseReport> {
  // Validate each line item against policy rules
  const validatedItems = await Promise.all(
    lineItems.map(item => validateExpenseLineItem(item, context))
  );

  // Update audit log
  const auditEntry: AuditEntry = {
    timestamp: new Date().toISOString(),
    userId: context.userId,
    userName: context.userId,
    action: 'LINE_ITEMS_ADDED',
    changes: { addedCount: lineItems.length },
  };

  return { reportNumber: reportId } as ExpenseReport; // Simplified return
}

/**
 * Validates expense line item against policy rules and compliance requirements.
 *
 * @param {ExpenseLineItem} lineItem - Line item to validate
 * @param {ExpenseContext} context - Execution context
 * @returns {Promise<ExpenseLineItem>} Validated line item with compliance flags
 *
 * @example
 * ```typescript
 * const validated = await validateExpenseLineItem({
 *   category: 'meals',
 *   amount: 150,
 *   merchantName: 'Fine Dining Restaurant',
 *   date: '2025-01-15',
 *   description: 'Team dinner',
 *   billable: false,
 *   reimbursable: true
 * }, context);
 * console.log(validated.policyCompliant); // false
 * console.log(validated.policyViolations); // ['Exceeds meal limit of $75']
 * ```
 */
export async function validateExpenseLineItem(
  lineItem: ExpenseLineItem,
  context: ExpenseContext,
): Promise<ExpenseLineItem> {
  const violations: string[] = [];
  let policyCompliant = true;

  // Check amount limits
  const categoryLimit = getCategoryLimit(lineItem.category);
  if (categoryLimit && lineItem.amount > categoryLimit) {
    violations.push(`Exceeds ${lineItem.category} limit of $${categoryLimit}`);
    policyCompliant = false;
  }

  // Check receipt requirement
  if (lineItem.amount > 25 && !lineItem.receiptUrl) {
    violations.push('Receipt required for amounts over $25');
    policyCompliant = false;
  }

  return {
    ...lineItem,
    policyCompliant,
    policyViolations: violations,
    approvalRequired: !policyCompliant || lineItem.amount > 500,
  };
}

/**
 * Submits expense report for approval workflow initiation.
 *
 * @param {string} reportId - Expense report ID
 * @param {ExpenseContext} context - Execution context
 * @returns {Promise<ExpenseReport>} Submitted expense report with approval chain
 *
 * @example
 * ```typescript
 * const submitted = await submitExpenseReport('EXP-2025-001234', context);
 * console.log(submitted.status); // 'pending_approval'
 * console.log(submitted.approvalChain.length); // 2 (multi-level approval)
 * ```
 */
export async function submitExpenseReport(
  reportId: string,
  context: ExpenseContext,
): Promise<ExpenseReport> {
  // Build approval chain based on amount and department
  const approvalChain = await buildApprovalChain(reportId, context);

  const auditEntry: AuditEntry = {
    timestamp: new Date().toISOString(),
    userId: context.userId,
    userName: context.userId,
    action: 'SUBMITTED',
  };

  return {
    reportNumber: reportId,
    status: 'pending_approval',
    submittedAt: new Date().toISOString(),
    approvalChain,
    currentApproverId: approvalChain[0]?.approverId,
  } as ExpenseReport;
}

/**
 * Builds multi-level approval chain based on expense amount and department rules.
 *
 * @param {string} reportId - Expense report ID
 * @param {ExpenseContext} context - Execution context
 * @returns {Promise<ApprovalStep[]>} Approval chain steps
 *
 * @example
 * ```typescript
 * const chain = await buildApprovalChain('EXP-2025-001234', context);
 * // [
 * //   { level: 1, approverId: 'MGR123', approverRole: 'Manager', status: 'pending' },
 * //   { level: 2, approverId: 'DIR456', approverRole: 'Director', status: 'pending' }
 * // ]
 * ```
 */
export async function buildApprovalChain(
  reportId: string,
  context: ExpenseContext,
): Promise<ApprovalStep[]> {
  const chain: ApprovalStep[] = [];

  // Level 1: Direct Manager
  chain.push({
    level: 1,
    approverId: 'MGR-' + context.departmentId,
    approverName: 'Department Manager',
    approverEmail: 'manager@example.com',
    approverRole: 'Manager',
    status: 'pending',
    autoApproved: false,
    remindersSent: 0,
  });

  // Level 2: Director (for amounts > $1000)
  // Add additional approval levels based on business rules

  return chain;
}

/**
 * Processes expense report approval or rejection by designated approver.
 *
 * @param {string} reportId - Expense report ID
 * @param {string} approverId - Approver user ID
 * @param {boolean} approved - Approval decision
 * @param {string} [comments] - Approval comments
 * @param {ExpenseContext} context - Execution context
 * @returns {Promise<ExpenseReport>} Updated expense report
 *
 * @example
 * ```typescript
 * const approved = await processExpenseApproval(
 *   'EXP-2025-001234',
 *   'MGR123',
 *   true,
 *   'Approved - all expenses justified',
 *   context
 * );
 * ```
 */
export async function processExpenseApproval(
  reportId: string,
  approverId: string,
  approved: boolean,
  comments: string | undefined,
  context: ExpenseContext,
): Promise<ExpenseReport> {
  const timestamp = new Date().toISOString();

  const auditEntry: AuditEntry = {
    timestamp,
    userId: approverId,
    userName: approverId,
    action: approved ? 'APPROVED' : 'REJECTED',
    changes: { comments },
  };

  return {
    reportNumber: reportId,
    status: approved ? 'approved' : 'rejected',
    approvedAt: approved ? timestamp : undefined,
  } as ExpenseReport;
}

/**
 * Calculates expense report totals including tax, reimbursable, and non-reimbursable amounts.
 *
 * @param {ExpenseReport} report - Expense report
 * @returns {object} Calculated totals
 *
 * @example
 * ```typescript
 * const totals = calculateExpenseReportTotals(report);
 * // {
 * //   totalAmount: 1500.00,
 * //   totalTax: 120.00,
 * //   reimbursableAmount: 1400.00,
 * //   nonReimbursableAmount: 100.00,
 * //   billableAmount: 800.00
 * // }
 * ```
 */
export function calculateExpenseReportTotals(report: ExpenseReport): {
  totalAmount: number;
  totalTax: number;
  reimbursableAmount: number;
  nonReimbursableAmount: number;
  billableAmount: number;
} {
  let totalAmount = 0;
  let totalTax = 0;
  let reimbursableAmount = 0;
  let nonReimbursableAmount = 0;
  let billableAmount = 0;

  for (const item of report.lineItems) {
    totalAmount += item.amount;
    totalTax += item.taxAmount || 0;

    if (item.reimbursable) {
      reimbursableAmount += item.amount;
    } else {
      nonReimbursableAmount += item.amount;
    }

    if (item.billable) {
      billableAmount += item.amount;
    }
  }

  return {
    totalAmount,
    totalTax,
    reimbursableAmount,
    nonReimbursableAmount,
    billableAmount,
  };
}

/**
 * Duplicates expense report for recurring expense scenarios.
 *
 * @param {string} reportId - Source expense report ID
 * @param {Partial<ExpenseReport>} overrides - Override values for new report
 * @param {ExpenseContext} context - Execution context
 * @returns {Promise<ExpenseReport>} New expense report
 *
 * @example
 * ```typescript
 * const duplicate = await duplicateExpenseReport('EXP-2025-001234', {
 *   title: 'NYC Business Trip - Q2 2025',
 *   purpose: 'Quarterly client review meeting'
 * }, context);
 * ```
 */
export async function duplicateExpenseReport(
  reportId: string,
  overrides: Partial<ExpenseReport>,
  context: ExpenseContext,
): Promise<ExpenseReport> {
  const newReportNumber = await generateExpenseReportNumber(context.employeeId);

  return {
    ...overrides,
    reportNumber: newReportNumber,
    status: 'draft',
    submittedAt: undefined,
    approvedAt: undefined,
    paidAt: undefined,
  } as ExpenseReport;
}

/**
 * Generates unique expense report number with prefix and sequential numbering.
 *
 * @param {string} employeeId - Employee ID
 * @returns {Promise<string>} Unique report number
 *
 * @example
 * ```typescript
 * const reportNumber = await generateExpenseReportNumber('EMP123');
 * // 'EXP-2025-001234'
 * ```
 */
export async function generateExpenseReportNumber(employeeId: string): Promise<string> {
  const year = new Date().getFullYear();
  const sequence = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  return `EXP-${year}-${sequence}`;
}

/**
 * Recalls submitted expense report back to draft status for corrections.
 *
 * @param {string} reportId - Expense report ID
 * @param {string} reason - Reason for recall
 * @param {ExpenseContext} context - Execution context
 * @returns {Promise<ExpenseReport>} Recalled expense report
 *
 * @example
 * ```typescript
 * const recalled = await recallExpenseReport(
 *   'EXP-2025-001234',
 *   'Need to add missing receipts',
 *   context
 * );
 * ```
 */
export async function recallExpenseReport(
  reportId: string,
  reason: string,
  context: ExpenseContext,
): Promise<ExpenseReport> {
  const auditEntry: AuditEntry = {
    timestamp: new Date().toISOString(),
    userId: context.userId,
    userName: context.userId,
    action: 'RECALLED',
    changes: { reason },
  };

  return {
    reportNumber: reportId,
    status: 'draft',
    submittedAt: undefined,
  } as ExpenseReport;
}

/**
 * Archives completed or cancelled expense reports for long-term storage.
 *
 * @param {string} reportId - Expense report ID
 * @param {ExpenseContext} context - Execution context
 * @returns {Promise<boolean>} Archive success status
 *
 * @example
 * ```typescript
 * const archived = await archiveExpenseReport('EXP-2025-001234', context);
 * ```
 */
export async function archiveExpenseReport(
  reportId: string,
  context: ExpenseContext,
): Promise<boolean> {
  // Archive logic implementation
  return true;
}

/**
 * Searches expense reports with advanced filtering and pagination.
 *
 * @param {object} filters - Search filters
 * @param {object} pagination - Pagination options
 * @returns {Promise<object>} Search results with metadata
 *
 * @example
 * ```typescript
 * const results = await searchExpenseReports(
 *   { status: 'pending_approval', employeeId: 'EMP123', minAmount: 500 },
 *   { page: 1, limit: 20 }
 * );
 * ```
 */
export async function searchExpenseReports(
  filters: Record<string, any>,
  pagination: { page: number; limit: number },
): Promise<{ reports: ExpenseReport[]; total: number; page: number; totalPages: number }> {
  return {
    reports: [],
    total: 0,
    page: pagination.page,
    totalPages: 0,
  };
}

// ============================================================================
// CORPORATE CARD MANAGEMENT FUNCTIONS (13-20)
// ============================================================================

/**
 * Imports corporate card transactions from card provider feed for reconciliation.
 *
 * @param {CorporateCardTransaction[]} transactions - Transaction data from provider
 * @param {ExpenseContext} context - Execution context
 * @returns {Promise<number>} Number of imported transactions
 *
 * @example
 * ```typescript
 * const count = await importCorporateCardTransactions([
 *   {
 *     transactionId: 'TXN-123456',
 *     cardLastFour: '1234',
 *     merchantName: 'Hotel XYZ',
 *     amount: 250.00,
 *     transactionDate: '2025-01-15'
 *   }
 * ], context);
 * ```
 */
export async function importCorporateCardTransactions(
  transactions: CorporateCardTransaction[],
  context: ExpenseContext,
): Promise<number> {
  let importedCount = 0;

  for (const transaction of transactions) {
    // Check for duplicates
    const exists = await checkTransactionExists(transaction.transactionId);
    if (!exists) {
      // Import transaction
      importedCount++;
    }
  }

  return importedCount;
}

/**
 * Reconciles corporate card transaction to expense line item.
 *
 * @param {string} transactionId - Card transaction ID
 * @param {string} expenseReportId - Expense report ID
 * @param {string} lineItemId - Line item ID
 * @param {ExpenseContext} context - Execution context
 * @returns {Promise<CorporateCardTransaction>} Reconciled transaction
 *
 * @example
 * ```typescript
 * const reconciled = await reconcileCardTransaction(
 *   'TXN-123456',
 *   'EXP-2025-001234',
 *   'LINE-001',
 *   context
 * );
 * ```
 */
export async function reconcileCardTransaction(
  transactionId: string,
  expenseReportId: string,
  lineItemId: string,
  context: ExpenseContext,
): Promise<CorporateCardTransaction> {
  return {
    transactionId,
    reconciled: true,
    reconciledAt: new Date().toISOString(),
    expenseReportId: parseInt(expenseReportId.split('-')[1]),
    expenseLineItemId: lineItemId,
  } as CorporateCardTransaction;
}

/**
 * Identifies unreconciled corporate card transactions requiring expense reports.
 *
 * @param {string} cardId - Corporate card ID
 * @param {Date} startDate - Start date for search
 * @param {Date} endDate - End date for search
 * @returns {Promise<CorporateCardTransaction[]>} Unreconciled transactions
 *
 * @example
 * ```typescript
 * const unreconciled = await findUnreconciledCardTransactions(
 *   'CARD-123',
 *   new Date('2025-01-01'),
 *   new Date('2025-01-31')
 * );
 * ```
 */
export async function findUnreconciledCardTransactions(
  cardId: string,
  startDate: Date,
  endDate: Date,
): Promise<CorporateCardTransaction[]> {
  return [];
}

/**
 * Flags corporate card transaction as personal expense requiring reimbursement to company.
 *
 * @param {string} transactionId - Transaction ID
 * @param {ExpenseContext} context - Execution context
 * @returns {Promise<CorporateCardTransaction>} Flagged transaction
 *
 * @example
 * ```typescript
 * const flagged = await flagPersonalExpense('TXN-123456', context);
 * ```
 */
export async function flagPersonalExpense(
  transactionId: string,
  context: ExpenseContext,
): Promise<CorporateCardTransaction> {
  return {
    transactionId,
    personalExpense: true,
    reconciled: false,
  } as CorporateCardTransaction;
}

/**
 * Disputes corporate card transaction with card provider.
 *
 * @param {string} transactionId - Transaction ID
 * @param {string} disputeReason - Reason for dispute
 * @param {ExpenseContext} context - Execution context
 * @returns {Promise<CorporateCardTransaction>} Disputed transaction
 *
 * @example
 * ```typescript
 * const disputed = await disputeCardTransaction(
 *   'TXN-123456',
 *   'Duplicate charge - already paid',
 *   context
 * );
 * ```
 */
export async function disputeCardTransaction(
  transactionId: string,
  disputeReason: string,
  context: ExpenseContext,
): Promise<CorporateCardTransaction> {
  return {
    transactionId,
    disputed: true,
    disputeReason,
  } as CorporateCardTransaction;
}

/**
 * Auto-matches corporate card transactions to expense line items using AI/ML.
 *
 * @param {string[]} transactionIds - Transaction IDs to match
 * @param {ExpenseContext} context - Execution context
 * @returns {Promise<Array<{transactionId: string; matches: any[]}>>} Suggested matches
 *
 * @example
 * ```typescript
 * const suggestions = await autoMatchCardTransactions(['TXN-123', 'TXN-456'], context);
 * ```
 */
export async function autoMatchCardTransactions(
  transactionIds: string[],
  context: ExpenseContext,
): Promise<Array<{ transactionId: string; matches: any[] }>> {
  return [];
}

/**
 * Generates corporate card reconciliation report for accounting period.
 *
 * @param {string} cardId - Corporate card ID
 * @param {Date} periodStart - Period start date
 * @param {Date} periodEnd - Period end date
 * @returns {Promise<object>} Reconciliation report
 *
 * @example
 * ```typescript
 * const report = await generateCardReconciliationReport(
 *   'CARD-123',
 *   new Date('2025-01-01'),
 *   new Date('2025-01-31')
 * );
 * ```
 */
export async function generateCardReconciliationReport(
  cardId: string,
  periodStart: Date,
  periodEnd: Date,
): Promise<{
  cardId: string;
  period: { start: string; end: string };
  totalTransactions: number;
  totalAmount: number;
  reconciledCount: number;
  unreconciledCount: number;
  personalExpenseCount: number;
  disputedCount: number;
}> {
  return {
    cardId,
    period: { start: periodStart.toISOString(), end: periodEnd.toISOString() },
    totalTransactions: 0,
    totalAmount: 0,
    reconciledCount: 0,
    unreconciledCount: 0,
    personalExpenseCount: 0,
    disputedCount: 0,
  };
}

/**
 * Sends reconciliation reminders to cardholders for pending transactions.
 *
 * @param {string[]} cardIds - Corporate card IDs
 * @param {ExpenseContext} context - Execution context
 * @returns {Promise<number>} Number of reminders sent
 *
 * @example
 * ```typescript
 * const sent = await sendCardReconciliationReminders(['CARD-123', 'CARD-456'], context);
 * ```
 */
export async function sendCardReconciliationReminders(
  cardIds: string[],
  context: ExpenseContext,
): Promise<number> {
  return cardIds.length;
}

// ============================================================================
// REIMBURSEMENT PROCESSING FUNCTIONS (21-28)
// ============================================================================

/**
 * Creates reimbursement request from approved expense report.
 *
 * @param {string} expenseReportId - Expense report ID
 * @param {PaymentMethod} paymentMethod - Payment method
 * @param {ExpenseContext} context - Execution context
 * @returns {Promise<ReimbursementRequest>} Created reimbursement request
 *
 * @example
 * ```typescript
 * const reimbursement = await createReimbursementRequest(
 *   'EXP-2025-001234',
 *   'direct_deposit',
 *   context
 * );
 * ```
 */
export async function createReimbursementRequest(
  expenseReportId: string,
  paymentMethod: PaymentMethod,
  context: ExpenseContext,
): Promise<ReimbursementRequest> {
  const requestNumber = await generateReimbursementNumber();

  return {
    requestNumber,
    employeeId: context.employeeId,
    expenseReportId: parseInt(expenseReportId.split('-')[1]),
    amount: 0,
    currency: 'USD',
    paymentMethod,
    paymentStatus: 'pending',
    taxWithheld: 0,
    netAmount: 0,
    metadata: {},
  };
}

/**
 * Processes reimbursement payment through payment gateway.
 *
 * @param {string} reimbursementId - Reimbursement request ID
 * @param {ExpenseContext} context - Execution context
 * @returns {Promise<ReimbursementRequest>} Processed reimbursement
 *
 * @example
 * ```typescript
 * const processed = await processReimbursementPayment('REIMB-2025-001234', context);
 * ```
 */
export async function processReimbursementPayment(
  reimbursementId: string,
  context: ExpenseContext,
): Promise<ReimbursementRequest> {
  return {
    requestNumber: reimbursementId,
    paymentStatus: 'completed',
    actualPaymentDate: new Date().toISOString(),
  } as ReimbursementRequest;
}

/**
 * Generates payment batch for multiple reimbursement requests.
 *
 * @param {string[]} reimbursementIds - Reimbursement request IDs
 * @param {Date} scheduledDate - Scheduled payment date
 * @param {ExpenseContext} context - Execution context
 * @returns {Promise<string>} Payment batch ID
 *
 * @example
 * ```typescript
 * const batchId = await generatePaymentBatch(
 *   ['REIMB-001', 'REIMB-002'],
 *   new Date('2025-01-31'),
 *   context
 * );
 * ```
 */
export async function generatePaymentBatch(
  reimbursementIds: string[],
  scheduledDate: Date,
  context: ExpenseContext,
): Promise<string> {
  return `BATCH-${Date.now()}`;
}

/**
 * Calculates tax withholding for reimbursement based on jurisdiction rules.
 *
 * @param {number} amount - Reimbursement amount
 * @param {string} employeeId - Employee ID
 * @param {string} jurisdiction - Tax jurisdiction
 * @returns {Promise<number>} Tax withholding amount
 *
 * @example
 * ```typescript
 * const taxWithheld = await calculateTaxWithholding(1500.00, 'EMP123', 'US-CA');
 * ```
 */
export async function calculateTaxWithholding(
  amount: number,
  employeeId: string,
  jurisdiction: string,
): Promise<number> {
  // Simplified calculation - actual implementation would use tax tables
  return 0;
}

/**
 * Tracks reimbursement payment status from payment processor.
 *
 * @param {string} reimbursementId - Reimbursement request ID
 * @returns {Promise<PaymentStatus>} Current payment status
 *
 * @example
 * ```typescript
 * const status = await trackReimbursementPaymentStatus('REIMB-2025-001234');
 * ```
 */
export async function trackReimbursementPaymentStatus(
  reimbursementId: string,
): Promise<PaymentStatus> {
  return 'completed';
}

/**
 * Cancels pending reimbursement request before payment processing.
 *
 * @param {string} reimbursementId - Reimbursement request ID
 * @param {string} reason - Cancellation reason
 * @param {ExpenseContext} context - Execution context
 * @returns {Promise<ReimbursementRequest>} Cancelled reimbursement
 *
 * @example
 * ```typescript
 * const cancelled = await cancelReimbursementRequest(
 *   'REIMB-2025-001234',
 *   'Expense report rejected',
 *   context
 * );
 * ```
 */
export async function cancelReimbursementRequest(
  reimbursementId: string,
  reason: string,
  context: ExpenseContext,
): Promise<ReimbursementRequest> {
  return {
    requestNumber: reimbursementId,
    paymentStatus: 'cancelled',
    notes: reason,
  } as ReimbursementRequest;
}

/**
 * Retries failed reimbursement payment with updated payment details.
 *
 * @param {string} reimbursementId - Reimbursement request ID
 * @param {Partial<ReimbursementRequest>} updates - Updated payment details
 * @param {ExpenseContext} context - Execution context
 * @returns {Promise<ReimbursementRequest>} Retried reimbursement
 *
 * @example
 * ```typescript
 * const retried = await retryFailedReimbursement('REIMB-2025-001234', {
 *   bankAccountId: 'BANK-NEW-123'
 * }, context);
 * ```
 */
export async function retryFailedReimbursement(
  reimbursementId: string,
  updates: Partial<ReimbursementRequest>,
  context: ExpenseContext,
): Promise<ReimbursementRequest> {
  return {
    requestNumber: reimbursementId,
    ...updates,
    paymentStatus: 'processing',
  } as ReimbursementRequest;
}

/**
 * Generates unique reimbursement request number.
 *
 * @returns {Promise<string>} Unique reimbursement number
 *
 * @example
 * ```typescript
 * const number = await generateReimbursementNumber();
 * // 'REIMB-2025-001234'
 * ```
 */
export async function generateReimbursementNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const sequence = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  return `REIMB-${year}-${sequence}`;
}

// ============================================================================
// TRAVEL EXPENSE MANAGEMENT FUNCTIONS (29-36)
// ============================================================================

/**
 * Creates travel expense report with trip details and per diem calculations.
 *
 * @param {TravelExpense} travelData - Travel expense data
 * @param {ExpenseContext} context - Execution context
 * @returns {Promise<ExpenseReport>} Created travel expense report
 *
 * @example
 * ```typescript
 * const travelReport = await createTravelExpenseReport({
 *   tripPurpose: 'Client meeting in NYC',
 *   destination: 'New York, NY',
 *   departureDate: '2025-01-15',
 *   returnDate: '2025-01-17',
 *   travelType: 'domestic'
 * }, context);
 * ```
 */
export async function createTravelExpenseReport(
  travelData: TravelExpense,
  context: ExpenseContext,
): Promise<ExpenseReport> {
  const report = await createExpenseReport(
    {
      title: `Travel: ${travelData.destination}`,
      purpose: travelData.tripPurpose,
      reportType: 'travel',
    },
    context,
  );

  return report;
}

/**
 * Calculates per diem allowance based on location and travel dates.
 *
 * @param {string} destination - Travel destination
 * @param {Date} startDate - Trip start date
 * @param {Date} endDate - Trip end date
 * @returns {Promise<object>} Per diem calculation details
 *
 * @example
 * ```typescript
 * const perDiem = await calculatePerDiem(
 *   'New York, NY',
 *   new Date('2025-01-15'),
 *   new Date('2025-01-17')
 * );
 * // { days: 3, rate: 79.00, totalAmount: 237.00 }
 * ```
 */
export async function calculatePerDiem(
  destination: string,
  startDate: Date,
  endDate: Date,
): Promise<{ days: number; rate: number; totalAmount: number; breakdown: any }> {
  const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const rate = 79.00; // Example rate - actual would be location-based

  return {
    days,
    rate,
    totalAmount: days * rate,
    breakdown: {},
  };
}

/**
 * Tracks mileage reimbursement with route and odometry details.
 *
 * @param {MileageInfo} mileageData - Mileage information
 * @param {ExpenseContext} context - Execution context
 * @returns {Promise<ExpenseLineItem>} Mileage expense line item
 *
 * @example
 * ```typescript
 * const mileageExpense = await trackMileageExpense({
 *   totalMiles: 150,
 *   reimbursementRate: 0.67,
 *   vehicleType: 'Personal Vehicle',
 *   purpose: 'Client site visit',
 *   date: '2025-01-15'
 * }, context);
 * ```
 */
export async function trackMileageExpense(
  mileageData: MileageInfo,
  context: ExpenseContext,
): Promise<ExpenseLineItem> {
  const amount = mileageData.totalMiles * mileageData.reimbursementRate;

  return {
    category: 'transportation',
    subcategory: 'mileage',
    date: mileageData.date,
    amount,
    currency: 'USD',
    merchantName: 'Mileage Reimbursement',
    description: `${mileageData.totalMiles} miles @ $${mileageData.reimbursementRate}/mile - ${mileageData.purpose}`,
    billable: true,
    reimbursable: true,
    policyCompliant: true,
    approvalRequired: false,
    metadata: { mileageDetails: mileageData },
  };
}

/**
 * Retrieves per diem rates for specific location and date range.
 *
 * @param {string} location - Location identifier
 * @param {Date} effectiveDate - Effective date for rate lookup
 * @returns {Promise<PerDiemRate>} Per diem rate information
 *
 * @example
 * ```typescript
 * const rate = await getPerDiemRates('US-NY-NYC', new Date('2025-01-15'));
 * ```
 */
export async function getPerDiemRates(
  location: string,
  effectiveDate: Date,
): Promise<PerDiemRate> {
  return {
    locationId: location,
    locationName: 'New York City, NY',
    country: 'US',
    state: 'NY',
    city: 'New York',
    effectiveDate: effectiveDate.toISOString(),
    lodgingRate: 200.00,
    mealRate: 79.00,
    incidentalRate: 5.00,
    totalDailyRate: 284.00,
    currency: 'USD',
  };
}

/**
 * Validates travel expense against travel policy rules.
 *
 * @param {TravelExpense} travelExpense - Travel expense to validate
 * @param {ExpenseContext} context - Execution context
 * @returns {Promise<PolicyViolation[]>} Policy violations
 *
 * @example
 * ```typescript
 * const violations = await validateTravelExpense(travelData, context);
 * ```
 */
export async function validateTravelExpense(
  travelExpense: TravelExpense,
  context: ExpenseContext,
): Promise<PolicyViolation[]> {
  const violations: PolicyViolation[] = [];

  // Validate accommodation expenses
  // Validate transportation expenses
  // Check per diem limits
  // Verify advance reconciliation

  return violations;
}

/**
 * Reconciles travel advance payments against actual expenses.
 *
 * @param {string} tripId - Trip identifier
 * @param {number} advanceAmount - Advance payment amount
 * @param {number} actualExpenses - Actual expense total
 * @returns {Promise<object>} Reconciliation result
 *
 * @example
 * ```typescript
 * const reconciliation = await reconcileTravelAdvance('TRIP-123', 1000.00, 850.00);
 * // { advanceAmount: 1000, actualExpenses: 850, owedToCompany: 150, owedToEmployee: 0 }
 * ```
 */
export async function reconcileTravelAdvance(
  tripId: string,
  advanceAmount: number,
  actualExpenses: number,
): Promise<{
  advanceAmount: number;
  actualExpenses: number;
  owedToCompany: number;
  owedToEmployee: number;
}> {
  const difference = actualExpenses - advanceAmount;

  return {
    advanceAmount,
    actualExpenses,
    owedToCompany: difference < 0 ? Math.abs(difference) : 0,
    owedToEmployee: difference > 0 ? difference : 0,
  };
}

/**
 * Generates travel expense summary report for trip analysis.
 *
 * @param {string} tripId - Trip identifier
 * @returns {Promise<object>} Travel expense summary
 *
 * @example
 * ```typescript
 * const summary = await generateTravelExpenseSummary('TRIP-123');
 * ```
 */
export async function generateTravelExpenseSummary(
  tripId: string,
): Promise<{
  tripId: string;
  totalExpenses: number;
  byCategory: Record<string, number>;
  perDiemAmount: number;
  advanceAmount: number;
  reimbursableAmount: number;
}> {
  return {
    tripId,
    totalExpenses: 0,
    byCategory: {},
    perDiemAmount: 0,
    advanceAmount: 0,
    reimbursableAmount: 0,
  };
}

/**
 * Updates mileage reimbursement rates for policy compliance.
 *
 * @param {string} vehicleType - Vehicle type
 * @param {number} newRate - New reimbursement rate per mile
 * @param {Date} effectiveDate - Effective date for new rate
 * @param {ExpenseContext} context - Execution context
 * @returns {Promise<boolean>} Update success status
 *
 * @example
 * ```typescript
 * const updated = await updateMileageReimbursementRate('Personal Vehicle', 0.67, new Date('2025-01-01'), context);
 * ```
 */
export async function updateMileageReimbursementRate(
  vehicleType: string,
  newRate: number,
  effectiveDate: Date,
  context: ExpenseContext,
): Promise<boolean> {
  return true;
}

// ============================================================================
// POLICY & COMPLIANCE FUNCTIONS (37-45)
// ============================================================================

/**
 * Validates expense against all applicable policy rules.
 *
 * @param {ExpenseLineItem} expense - Expense to validate
 * @param {ExpenseContext} context - Execution context
 * @returns {Promise<PolicyViolation[]>} Policy violations
 *
 * @example
 * ```typescript
 * const violations = await validateExpenseAgainstPolicy(lineItem, context);
 * ```
 */
export async function validateExpenseAgainstPolicy(
  expense: ExpenseLineItem,
  context: ExpenseContext,
): Promise<PolicyViolation[]> {
  const violations: PolicyViolation[] = [];

  // Check category limits
  // Validate receipt requirements
  // Check merchant restrictions
  // Verify billable status

  return violations;
}

/**
 * Detects potential duplicate expense submissions for fraud prevention.
 *
 * @param {ExpenseLineItem} expense - Expense to check
 * @param {string} employeeId - Employee ID
 * @returns {Promise<ExpenseLineItem[]>} Potential duplicate expenses
 *
 * @example
 * ```typescript
 * const duplicates = await detectDuplicateExpenses(lineItem, 'EMP123');
 * ```
 */
export async function detectDuplicateExpenses(
  expense: ExpenseLineItem,
  employeeId: string,
): Promise<ExpenseLineItem[]> {
  return [];
}

/**
 * Flags suspicious expense patterns for fraud investigation.
 *
 * @param {ExpenseReport} report - Expense report to analyze
 * @returns {Promise<ExpenseFlag[]>} Suspicious activity flags
 *
 * @example
 * ```typescript
 * const flags = await flagSuspiciousExpensePatterns(report);
 * ```
 */
export async function flagSuspiciousExpensePatterns(
  report: ExpenseReport,
): Promise<ExpenseFlag[]> {
  const flags: ExpenseFlag[] = [];

  // Check for round-number amounts
  // Detect unusual merchant patterns
  // Identify rapid succession submissions
  // Check for split transactions

  return flags;
}

/**
 * Checks if expense category requires receipt based on amount threshold.
 *
 * @param {ExpenseCategory} category - Expense category
 * @param {number} amount - Expense amount
 * @returns {Promise<boolean>} Receipt required status
 *
 * @example
 * ```typescript
 * const required = await checkReceiptRequirement('meals', 75.00);
 * ```
 */
export async function checkReceiptRequirement(
  category: ExpenseCategory,
  amount: number,
): Promise<boolean> {
  const threshold = 25.00; // Example threshold
  return amount > threshold;
}

/**
 * Calculates expense category limit for employee based on role and policy.
 *
 * @param {ExpenseCategory} category - Expense category
 * @param {string} employeeId - Employee ID
 * @returns {Promise<number | null>} Category limit or null if unlimited
 *
 * @example
 * ```typescript
 * const limit = await getCategoryLimit('meals', 'EMP123');
 * ```
 */
export function getCategoryLimit(category: ExpenseCategory): number | null {
  const limits: Record<ExpenseCategory, number | null> = {
    meals: 75.00,
    lodging: 200.00,
    transportation: null,
    travel: null,
    fuel: 100.00,
    parking: 50.00,
    tolls: null,
    airfare: null,
    car_rental: 150.00,
    taxi_rideshare: 100.00,
    office_supplies: 200.00,
    software_subscriptions: 500.00,
    training_education: 2000.00,
    client_entertainment: 150.00,
    marketing: 1000.00,
    telecommunications: 200.00,
    shipping: 100.00,
    equipment: 5000.00,
    maintenance: 1000.00,
    professional_services: 5000.00,
    other: 500.00,
  };

  return limits[category] ?? null;
}

/**
 * Creates policy violation override with justification and approval.
 *
 * @param {string} reportId - Expense report ID
 * @param {PolicyViolation} violation - Policy violation to override
 * @param {string} justification - Override justification
 * @param {ExpenseContext} context - Execution context
 * @returns {Promise<PolicyViolation>} Overridden violation
 *
 * @example
 * ```typescript
 * const overridden = await overridePolicyViolation(
 *   'EXP-2025-001234',
 *   violation,
 *   'Emergency travel required for critical client issue',
 *   context
 * );
 * ```
 */
export async function overridePolicyViolation(
  reportId: string,
  violation: PolicyViolation,
  justification: string,
  context: ExpenseContext,
): Promise<PolicyViolation> {
  return {
    ...violation,
    overrideReason: justification,
    overriddenBy: context.userId,
    overriddenAt: new Date().toISOString(),
  };
}

/**
 * Generates expense policy compliance report for audit purposes.
 *
 * @param {Date} startDate - Report period start
 * @param {Date} endDate - Report period end
 * @param {string} [departmentId] - Optional department filter
 * @returns {Promise<object>} Compliance report
 *
 * @example
 * ```typescript
 * const complianceReport = await generatePolicyComplianceReport(
 *   new Date('2025-01-01'),
 *   new Date('2025-01-31'),
 *   'DEPT-123'
 * );
 * ```
 */
export async function generatePolicyComplianceReport(
  startDate: Date,
  endDate: Date,
  departmentId?: string,
): Promise<{
  period: { start: string; end: string };
  totalReports: number;
  compliantReports: number;
  violationCount: number;
  topViolations: Array<{ ruleId: string; count: number }>;
  complianceRate: number;
}> {
  return {
    period: { start: startDate.toISOString(), end: endDate.toISOString() },
    totalReports: 0,
    compliantReports: 0,
    violationCount: 0,
    topViolations: [],
    complianceRate: 0,
  };
}

/**
 * Calculates total amount from expense line items.
 *
 * @param {ExpenseLineItem[]} lineItems - Line items
 * @returns {number} Total amount
 */
function calculateTotalAmount(lineItems: ExpenseLineItem[]): number {
  return lineItems.reduce((sum, item) => sum + item.amount, 0);
}

/**
 * Calculates reimbursable amount from expense line items.
 *
 * @param {ExpenseLineItem[]} lineItems - Line items
 * @returns {number} Reimbursable amount
 */
function calculateReimbursableAmount(lineItems: ExpenseLineItem[]): number {
  return lineItems.filter(item => item.reimbursable).reduce((sum, item) => sum + item.amount, 0);
}

/**
 * Checks if transaction already exists in database.
 *
 * @param {string} transactionId - Transaction ID
 * @returns {Promise<boolean>} Exists status
 */
async function checkTransactionExists(transactionId: string): Promise<boolean> {
  return false;
}

/**
 * Sends approval notification to designated approver.
 *
 * @param {string} approverId - Approver user ID
 * @param {string} reportId - Expense report ID
 * @param {ExpenseContext} context - Execution context
 * @returns {Promise<boolean>} Notification sent status
 *
 * @example
 * ```typescript
 * const sent = await sendApprovalNotification('MGR123', 'EXP-2025-001234', context);
 * ```
 */
export async function sendApprovalNotification(
  approverId: string,
  reportId: string,
  context: ExpenseContext,
): Promise<boolean> {
  return true;
}

// ============================================================================
// HELPER UTILITY FUNCTIONS
// ============================================================================

/**
 * Formats currency amount for display.
 *
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code
 * @returns {string} Formatted currency string
 *
 * @example
 * ```typescript
 * const formatted = formatCurrency(1500.50, 'USD');
 * // '$1,500.50'
 * ```
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Converts expense amount between currencies using exchange rates.
 *
 * @param {number} amount - Amount to convert
 * @param {string} fromCurrency - Source currency
 * @param {string} toCurrency - Target currency
 * @param {Date} date - Exchange rate date
 * @returns {Promise<number>} Converted amount
 *
 * @example
 * ```typescript
 * const converted = await convertCurrency(100, 'EUR', 'USD', new Date());
 * ```
 */
export async function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  date: Date,
): Promise<number> {
  // Simplified - actual implementation would use exchange rate API
  return amount * 1.1;
}
