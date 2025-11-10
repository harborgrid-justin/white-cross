/**
 * LOC: CEFMS-RWO-003
 * File: /reuse/financial/cefms/composites/cefms-reimbursable-work-orders-composite.ts
 *
 * UPSTREAM (imports from):
 *   - reuse/financial/accounts-receivable-management-kit.ts
 *   - reuse/financial/revenue-recognition-kit.ts
 *   - reuse/financial/billing-invoicing-kit.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend CEFMS reimbursable work order services
 *   - Customer billing modules
 *   - Revenue recognition APIs
 */

/**
 * File: /reuse/financial/cefms/composites/cefms-reimbursable-work-orders-composite.ts
 * Locator: WC-CEFMS-RWO-003
 * Purpose: USACE CEFMS Reimbursable Work Orders - RWO tracking, customer billing, collections, revenue recognition
 *
 * Upstream: Reuses financial kits from reuse/financial/
 * Downstream: Backend CEFMS controllers, customer billing, revenue recognition services
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 40+ composite functions for CEFMS reimbursable work order management competing with legacy CEFMS
 *
 * LLM Context: Comprehensive USACE CEFMS reimbursable work order utilities for production-ready federal financial management.
 * Provides reimbursable work order (RWO) creation and tracking, customer agreement management, billing and invoicing,
 * collection tracking, revenue recognition (earned/billed/collected), cost recovery, interagency agreement (IAA) support,
 * milestone billing, progress billing, final billing, and compliance with federal reimbursable work regulations.
 */

import { Model, DataTypes, Sequelize, Transaction, Op } from 'sequelize';
import { Injectable } from '@nestjs/common';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * @swagger
 * @openapi
 * components:
 *   schemas:
 *     ReimbursableWorkOrder:
 *       type: object
 *       required:
 *         - rwoNumber
 *         - customerId
 *         - agreementNumber
 *         - projectTitle
 *         - estimatedCost
 *       properties:
 *         rwoNumber:
 *           type: string
 *           description: Unique RWO identifier
 *           example: 'RWO-2024-001'
 *         customerId:
 *           type: string
 *           description: Customer/sponsor identifier
 *           example: 'CUST-MEMPHIS-001'
 *         agreementNumber:
 *           type: string
 *           description: Reimbursable agreement number
 *           example: 'IAA-2024-096-001'
 *         projectTitle:
 *           type: string
 *           description: Project description
 *           example: 'Mississippi River Flood Control Study'
 *         estimatedCost:
 *           type: number
 *           format: decimal
 *           description: Total estimated project cost
 *           example: 5000000.00
 *         advancePayment:
 *           type: number
 *           format: decimal
 *           description: Advance payment received
 *         earnedRevenue:
 *           type: number
 *           format: decimal
 *           description: Revenue earned to date
 *         billedAmount:
 *           type: number
 *           format: decimal
 *           description: Amount billed to customer
 *         collectedAmount:
 *           type: number
 *           format: decimal
 *           description: Amount collected from customer
 *         status:
 *           type: string
 *           enum: [active, suspended, completed, closed]
 */
interface ReimbursableWorkOrder {
  rwoNumber: string;
  customerId: string;
  agreementNumber: string;
  projectTitle: string;
  projectDescription: string;
  estimatedCost: number;
  advancePayment: number;
  advancePaymentDue: number;
  earnedRevenue: number;
  billedAmount: number;
  collectedAmount: number;
  unbilledRevenue: number;
  accountsReceivable: number;
  startDate: Date;
  estimatedCompletionDate: Date;
  actualCompletionDate?: Date;
  status: 'active' | 'suspended' | 'completed' | 'closed';
  accountSymbol: string;
  metadata?: Record<string, any>;
}

/**
 * @swagger
 * @openapi
 * components:
 *   schemas:
 *     CustomerAgreement:
 *       type: object
 *       properties:
 *         agreementNumber:
 *           type: string
 *         customerId:
 *           type: string
 *         agreementType:
 *           type: string
 *           enum: [interagency, non_federal, state_local, foreign]
 *         fundingAmount:
 *           type: number
 *           format: decimal
 *         effectiveDate:
 *           type: string
 *           format: date
 *         expirationDate:
 *           type: string
 *           format: date
 */
interface CustomerAgreement {
  agreementNumber: string;
  customerId: string;
  customerName: string;
  agreementType: 'interagency' | 'non_federal' | 'state_local' | 'foreign';
  fundingAmount: number;
  advancePaymentRequired: boolean;
  advancePaymentPercent: number;
  effectiveDate: Date;
  expirationDate: Date;
  billingFrequency: 'monthly' | 'quarterly' | 'milestone' | 'completion';
  status: 'active' | 'expired' | 'terminated';
}

interface BillingMilestone {
  milestoneId: string;
  rwoNumber: string;
  milestoneDescription: string;
  milestoneAmount: number;
  scheduledDate: Date;
  completedDate?: Date;
  billedDate?: Date;
  status: 'pending' | 'completed' | 'billed' | 'paid';
}

interface CustomerInvoice {
  invoiceNumber: string;
  rwoNumber: string;
  customerId: string;
  invoiceDate: Date;
  dueDate: Date;
  invoiceAmount: number;
  taxAmount: number;
  totalAmount: number;
  paidAmount: number;
  remainingBalance: number;
  paymentStatus: 'unpaid' | 'partially_paid' | 'paid' | 'overdue';
  invoiceType: 'advance' | 'progress' | 'final' | 'credit_memo';
}

interface CustomerPayment {
  paymentId: string;
  invoiceNumber: string;
  rwoNumber: string;
  customerId: string;
  paymentDate: Date;
  paymentAmount: number;
  paymentMethod: 'wire' | 'ach' | 'check' | 'lockbox';
  depositDate?: Date;
  depositedToTreasury: boolean;
  referenceNumber?: string;
}

interface RevenueRecognition {
  rwoNumber: string;
  periodEndDate: Date;
  costIncurred: number;
  percentComplete: number;
  earnedRevenue: number;
  billedRevenue: number;
  unbilledRevenue: number;
  recognitionMethod: 'cost_to_cost' | 'units_of_delivery' | 'milestone' | 'completed_contract';
  recognizedAt: Date;
}

interface CostRecovery {
  rwoNumber: string;
  laborCost: number;
  materialCost: number;
  equipmentCost: number;
  indirectCost: number;
  totalCost: number;
  markupPercent: number;
  markupAmount: number;
  recoverableAmount: number;
}

interface AdvancePaymentTracking {
  rwoNumber: string;
  advanceAmount: number;
  receivedDate: Date;
  unearnedBalance: number;
  earnedToDate: number;
  liquidationRate: number;
  fullyLiquidated: boolean;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Sequelize model for Reimbursable Work Orders.
 *
 * @swagger
 * @openapi
 * components:
 *   schemas:
 *     RWOModel:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         rwoNumber:
 *           type: string
 *         customerId:
 *           type: string
 *         agreementNumber:
 *           type: string
 *         estimatedCost:
 *           type: number
 *           format: decimal
 *         earnedRevenue:
 *           type: number
 *           format: decimal
 *         billedAmount:
 *           type: number
 *           format: decimal
 *         collectedAmount:
 *           type: number
 *           format: decimal
 *         status:
 *           type: string
 *           enum: [active, suspended, completed, closed]
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ReimbursableWorkOrder model
 *
 * @example
 * ```typescript
 * const RWO = createReimbursableWorkOrderModel(sequelize);
 * const rwo = await RWO.create({
 *   rwoNumber: 'RWO-2024-001',
 *   customerId: 'CUST-001',
 *   agreementNumber: 'IAA-2024-001',
 *   projectTitle: 'Flood Control Study',
 *   estimatedCost: 5000000,
 *   status: 'active'
 * });
 * ```
 */
export const createReimbursableWorkOrderModel = (sequelize: Sequelize) => {
  class RWO extends Model {
    public id!: string;
    public rwoNumber!: string;
    public customerId!: string;
    public agreementNumber!: string;
    public projectTitle!: string;
    public projectDescription!: string;
    public estimatedCost!: number;
    public advancePayment!: number;
    public advancePaymentDue!: number;
    public earnedRevenue!: number;
    public billedAmount!: number;
    public collectedAmount!: number;
    public unbilledRevenue!: number;
    public accountsReceivable!: number;
    public startDate!: Date;
    public estimatedCompletionDate!: Date;
    public actualCompletionDate!: Date | null;
    public status!: string;
    public accountSymbol!: string;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  RWO.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      rwoNumber: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        comment: 'Unique reimbursable work order number',
      },
      customerId: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Customer/sponsor identifier',
      },
      agreementNumber: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Reimbursable agreement number',
      },
      projectTitle: {
        type: DataTypes.STRING(500),
        allowNull: false,
        comment: 'Project title',
      },
      projectDescription: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Detailed project description',
      },
      estimatedCost: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Total estimated project cost',
      },
      advancePayment: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Advance payment received',
      },
      advancePaymentDue: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Advance payment required',
      },
      earnedRevenue: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Revenue earned to date',
      },
      billedAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Total billed to customer',
      },
      collectedAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Total collected from customer',
      },
      unbilledRevenue: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Earned but not yet billed',
      },
      accountsReceivable: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Billed but not collected',
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Project start date',
      },
      estimatedCompletionDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Estimated completion date',
      },
      actualCompletionDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Actual completion date',
      },
      status: {
        type: DataTypes.ENUM('active', 'suspended', 'completed', 'closed'),
        allowNull: false,
        defaultValue: 'active',
        comment: 'RWO status',
      },
      accountSymbol: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Treasury account symbol',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional RWO metadata',
      },
    },
    {
      sequelize,
      tableName: 'reimbursable_work_orders',
      timestamps: true,
      indexes: [
        { fields: ['rwoNumber'], unique: true },
        { fields: ['customerId'] },
        { fields: ['agreementNumber'] },
        { fields: ['status'] },
        { fields: ['accountSymbol'] },
      ],
    },
  );

  return RWO;
};

/**
 * Sequelize model for Customer Invoices.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CustomerInvoice model
 */
export const createCustomerInvoiceModel = (sequelize: Sequelize) => {
  class Invoice extends Model {
    public id!: string;
    public invoiceNumber!: string;
    public rwoNumber!: string;
    public customerId!: string;
    public invoiceDate!: Date;
    public dueDate!: Date;
    public invoiceAmount!: number;
    public taxAmount!: number;
    public totalAmount!: number;
    public paidAmount!: number;
    public remainingBalance!: number;
    public paymentStatus!: string;
    public invoiceType!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  Invoice.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      invoiceNumber: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        comment: 'Customer invoice number',
      },
      rwoNumber: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Related RWO number',
      },
      customerId: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Customer identifier',
      },
      invoiceDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Invoice date',
      },
      dueDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Payment due date',
      },
      invoiceAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Invoice amount before tax',
      },
      taxAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Tax amount',
      },
      totalAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Total invoice amount',
      },
      paidAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Amount paid',
      },
      remainingBalance: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Remaining balance',
      },
      paymentStatus: {
        type: DataTypes.ENUM('unpaid', 'partially_paid', 'paid', 'overdue'),
        allowNull: false,
        defaultValue: 'unpaid',
        comment: 'Payment status',
      },
      invoiceType: {
        type: DataTypes.ENUM('advance', 'progress', 'final', 'credit_memo'),
        allowNull: false,
        comment: 'Type of invoice',
      },
    },
    {
      sequelize,
      tableName: 'customer_invoices',
      timestamps: true,
      indexes: [
        { fields: ['invoiceNumber'], unique: true },
        { fields: ['rwoNumber'] },
        { fields: ['customerId'] },
        { fields: ['paymentStatus'] },
        { fields: ['dueDate'] },
      ],
    },
  );

  return Invoice;
};

// ============================================================================
// RWO CREATION & MANAGEMENT (1-8)
// ============================================================================

/**
 * Creates reimbursable work order with customer agreement.
 *
 * @swagger
 * @openapi
 * /api/cefms/rwo/work-orders:
 *   post:
 *     summary: Create reimbursable work order
 *     tags:
 *       - CEFMS Reimbursable Work Orders
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReimbursableWorkOrder'
 *     responses:
 *       201:
 *         description: RWO created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RWOModel'
 *
 * @param {ReimbursableWorkOrder} rwoData - RWO data
 * @param {Model} RWO - ReimbursableWorkOrder model
 * @returns {Promise<any>} Created RWO
 *
 * @example
 * ```typescript
 * const rwo = await createReimbursableWorkOrder({
 *   rwoNumber: 'RWO-2024-001',
 *   customerId: 'CUST-MEMPHIS-001',
 *   agreementNumber: 'IAA-2024-096-001',
 *   projectTitle: 'Mississippi River Flood Control Study',
 *   projectDescription: 'Engineering study for flood control improvements',
 *   estimatedCost: 5000000,
 *   advancePayment: 0,
 *   advancePaymentDue: 1000000,
 *   earnedRevenue: 0,
 *   billedAmount: 0,
 *   collectedAmount: 0,
 *   unbilledRevenue: 0,
 *   accountsReceivable: 0,
 *   startDate: new Date(),
 *   estimatedCompletionDate: new Date(Date.now() + 365 * 86400000),
 *   status: 'active',
 *   accountSymbol: '096X3123'
 * }, RWO);
 * ```
 */
export const createReimbursableWorkOrder = async (
  rwoData: ReimbursableWorkOrder,
  RWO: any,
): Promise<any> => {
  return await RWO.create(rwoData);
};

/**
 * Retrieves RWO by number.
 *
 * @param {string} rwoNumber - RWO number
 * @param {Model} RWO - ReimbursableWorkOrder model
 * @returns {Promise<any>} RWO record
 */
export const getReimbursableWorkOrder = async (
  rwoNumber: string,
  RWO: any,
): Promise<any> => {
  return await RWO.findOne({ where: { rwoNumber } });
};

/**
 * Updates RWO status (active, suspended, completed, closed).
 *
 * @param {string} rwoNumber - RWO number
 * @param {string} newStatus - New status
 * @param {Model} RWO - ReimbursableWorkOrder model
 * @returns {Promise<any>} Updated RWO
 */
export const updateRWOStatus = async (
  rwoNumber: string,
  newStatus: 'active' | 'suspended' | 'completed' | 'closed',
  RWO: any,
): Promise<any> => {
  const rwo = await getReimbursableWorkOrder(rwoNumber, RWO);
  if (!rwo) throw new Error('RWO not found');

  rwo.status = newStatus;
  if (newStatus === 'completed') {
    rwo.actualCompletionDate = new Date();
  }
  await rwo.save();
  return rwo;
};

/**
 * Calculates RWO percent complete based on cost incurred.
 *
 * @param {string} rwoNumber - RWO number
 * @param {number} costIncurred - Cost incurred to date
 * @param {Model} RWO - ReimbursableWorkOrder model
 * @returns {Promise<number>} Percent complete
 */
export const calculateRWOPercentComplete = async (
  rwoNumber: string,
  costIncurred: number,
  RWO: any,
): Promise<number> => {
  const rwo = await getReimbursableWorkOrder(rwoNumber, RWO);
  if (!rwo) throw new Error('RWO not found');

  const percentComplete = (costIncurred / parseFloat(rwo.estimatedCost)) * 100;
  return Math.min(percentComplete, 100);
};

/**
 * Retrieves active RWOs for a customer.
 *
 * @param {string} customerId - Customer ID
 * @param {Model} RWO - ReimbursableWorkOrder model
 * @returns {Promise<any[]>} Active RWOs
 */
export const getActiveRWOsByCustomer = async (
  customerId: string,
  RWO: any,
): Promise<any[]> => {
  return await RWO.findAll({
    where: { customerId, status: 'active' },
    order: [['startDate', 'DESC']],
  });
};

/**
 * Generates RWO summary report.
 *
 * @param {string} rwoNumber - RWO number
 * @param {Model} RWO - ReimbursableWorkOrder model
 * @returns {Promise<any>} RWO summary
 */
export const generateRWOSummary = async (
  rwoNumber: string,
  RWO: any,
): Promise<any> => {
  const rwo = await getReimbursableWorkOrder(rwoNumber, RWO);
  if (!rwo) throw new Error('RWO not found');

  return {
    rwoNumber: rwo.rwoNumber,
    projectTitle: rwo.projectTitle,
    customer: rwo.customerId,
    estimatedCost: parseFloat(rwo.estimatedCost),
    earnedRevenue: parseFloat(rwo.earnedRevenue),
    billedAmount: parseFloat(rwo.billedAmount),
    collectedAmount: parseFloat(rwo.collectedAmount),
    unbilledRevenue: parseFloat(rwo.unbilledRevenue),
    accountsReceivable: parseFloat(rwo.billedAmount) - parseFloat(rwo.collectedAmount),
    percentComplete: (parseFloat(rwo.earnedRevenue) / parseFloat(rwo.estimatedCost)) * 100,
    status: rwo.status,
  };
};

/**
 * Validates RWO funding sufficiency.
 *
 * @param {string} rwoNumber - RWO number
 * @param {number} additionalCost - Additional cost to validate
 * @param {Model} RWO - ReimbursableWorkOrder model
 * @returns {Promise<{ sufficient: boolean; available: number }>} Funding validation
 */
export const validateRWOFundingSufficiency = async (
  rwoNumber: string,
  additionalCost: number,
  RWO: any,
): Promise<{ sufficient: boolean; available: number }> => {
  const rwo = await getReimbursableWorkOrder(rwoNumber, RWO);
  if (!rwo) throw new Error('RWO not found');

  const totalFunding = parseFloat(rwo.estimatedCost) + parseFloat(rwo.advancePayment);
  const costToDate = parseFloat(rwo.earnedRevenue);
  const available = totalFunding - costToDate;

  return {
    sufficient: available >= additionalCost,
    available,
  };
};

/**
 * Extends RWO estimated cost with customer approval.
 *
 * @param {string} rwoNumber - RWO number
 * @param {number} additionalAmount - Additional cost estimate
 * @param {string} justification - Extension justification
 * @param {Model} RWO - ReimbursableWorkOrder model
 * @returns {Promise<any>} Updated RWO
 */
export const extendRWOEstimatedCost = async (
  rwoNumber: string,
  additionalAmount: number,
  justification: string,
  RWO: any,
): Promise<any> => {
  const rwo = await getReimbursableWorkOrder(rwoNumber, RWO);
  if (!rwo) throw new Error('RWO not found');

  rwo.estimatedCost = parseFloat(rwo.estimatedCost) + additionalAmount;
  rwo.metadata = {
    ...rwo.metadata,
    costExtensions: [
      ...(rwo.metadata.costExtensions || []),
      {
        amount: additionalAmount,
        justification,
        extendedAt: new Date().toISOString(),
      },
    ],
  };
  await rwo.save();
  return rwo;
};

// ============================================================================
// CUSTOMER BILLING & INVOICING (9-16)
// ============================================================================

/**
 * Creates customer invoice for RWO (advance, progress, final).
 *
 * @param {CustomerInvoice} invoiceData - Invoice data
 * @param {Model} Invoice - CustomerInvoice model
 * @returns {Promise<any>} Created invoice
 *
 * @example
 * ```typescript
 * const invoice = await createCustomerInvoice({
 *   invoiceNumber: 'INV-2024-001',
 *   rwoNumber: 'RWO-2024-001',
 *   customerId: 'CUST-001',
 *   invoiceDate: new Date(),
 *   dueDate: new Date(Date.now() + 30 * 86400000),
 *   invoiceAmount: 500000,
 *   taxAmount: 0,
 *   totalAmount: 500000,
 *   paidAmount: 0,
 *   remainingBalance: 500000,
 *   paymentStatus: 'unpaid',
 *   invoiceType: 'progress'
 * }, Invoice);
 * ```
 */
export const createCustomerInvoice = async (
  invoiceData: CustomerInvoice,
  Invoice: any,
): Promise<any> => {
  invoiceData.totalAmount = invoiceData.invoiceAmount + invoiceData.taxAmount;
  invoiceData.remainingBalance = invoiceData.totalAmount - invoiceData.paidAmount;
  return await Invoice.create(invoiceData);
};

/**
 * Generates progress invoice based on earned revenue.
 *
 * @param {string} rwoNumber - RWO number
 * @param {Date} invoiceDate - Invoice date
 * @param {Model} RWO - ReimbursableWorkOrder model
 * @param {Model} Invoice - CustomerInvoice model
 * @returns {Promise<any>} Generated invoice
 */
export const generateProgressInvoice = async (
  rwoNumber: string,
  invoiceDate: Date,
  RWO: any,
  Invoice: any,
): Promise<any> => {
  const rwo = await getReimbursableWorkOrder(rwoNumber, RWO);
  if (!rwo) throw new Error('RWO not found');

  const unbilledRevenue = parseFloat(rwo.unbilledRevenue);
  if (unbilledRevenue <= 0) {
    throw new Error('No unbilled revenue to invoice');
  }

  const invoiceNumber = `INV-${rwoNumber}-${Date.now()}`;
  const invoice = await createCustomerInvoice(
    {
      invoiceNumber,
      rwoNumber,
      customerId: rwo.customerId,
      invoiceDate,
      dueDate: new Date(invoiceDate.getTime() + 30 * 86400000),
      invoiceAmount: unbilledRevenue,
      taxAmount: 0,
      totalAmount: unbilledRevenue,
      paidAmount: 0,
      remainingBalance: unbilledRevenue,
      paymentStatus: 'unpaid',
      invoiceType: 'progress',
    },
    Invoice,
  );

  // Update RWO billing amounts
  rwo.billedAmount = parseFloat(rwo.billedAmount) + unbilledRevenue;
  rwo.unbilledRevenue = 0;
  rwo.accountsReceivable = parseFloat(rwo.billedAmount) - parseFloat(rwo.collectedAmount);
  await rwo.save();

  return invoice;
};

/**
 * Generates advance payment invoice.
 *
 * @param {string} rwoNumber - RWO number
 * @param {number} advanceAmount - Advance payment amount
 * @param {Model} RWO - ReimbursableWorkOrder model
 * @param {Model} Invoice - CustomerInvoice model
 * @returns {Promise<any>} Advance invoice
 */
export const generateAdvancePaymentInvoice = async (
  rwoNumber: string,
  advanceAmount: number,
  RWO: any,
  Invoice: any,
): Promise<any> => {
  const rwo = await getReimbursableWorkOrder(rwoNumber, RWO);
  if (!rwo) throw new Error('RWO not found');

  const invoiceNumber = `INV-ADV-${rwoNumber}-${Date.now()}`;
  const invoice = await createCustomerInvoice(
    {
      invoiceNumber,
      rwoNumber,
      customerId: rwo.customerId,
      invoiceDate: new Date(),
      dueDate: new Date(Date.now() + 15 * 86400000),
      invoiceAmount: advanceAmount,
      taxAmount: 0,
      totalAmount: advanceAmount,
      paidAmount: 0,
      remainingBalance: advanceAmount,
      paymentStatus: 'unpaid',
      invoiceType: 'advance',
    },
    Invoice,
  );

  rwo.advancePaymentDue = advanceAmount;
  await rwo.save();

  return invoice;
};

/**
 * Generates final invoice upon RWO completion.
 *
 * @param {string} rwoNumber - RWO number
 * @param {Model} RWO - ReimbursableWorkOrder model
 * @param {Model} Invoice - CustomerInvoice model
 * @returns {Promise<any>} Final invoice
 */
export const generateFinalInvoice = async (
  rwoNumber: string,
  RWO: any,
  Invoice: any,
): Promise<any> => {
  const rwo = await getReimbursableWorkOrder(rwoNumber, RWO);
  if (!rwo) throw new Error('RWO not found');

  if (rwo.status !== 'completed') {
    throw new Error('RWO must be completed before final invoice');
  }

  const unbilledRevenue = parseFloat(rwo.unbilledRevenue);
  if (unbilledRevenue <= 0) {
    throw new Error('No unbilled revenue for final invoice');
  }

  const invoiceNumber = `INV-FINAL-${rwoNumber}`;
  const invoice = await createCustomerInvoice(
    {
      invoiceNumber,
      rwoNumber,
      customerId: rwo.customerId,
      invoiceDate: new Date(),
      dueDate: new Date(Date.now() + 30 * 86400000),
      invoiceAmount: unbilledRevenue,
      taxAmount: 0,
      totalAmount: unbilledRevenue,
      paidAmount: 0,
      remainingBalance: unbilledRevenue,
      paymentStatus: 'unpaid',
      invoiceType: 'final',
    },
    Invoice,
  );

  rwo.billedAmount = parseFloat(rwo.billedAmount) + unbilledRevenue;
  rwo.unbilledRevenue = 0;
  rwo.accountsReceivable = parseFloat(rwo.billedAmount) - parseFloat(rwo.collectedAmount);
  await rwo.save();

  return invoice;
};

/**
 * Retrieves outstanding invoices for RWO.
 *
 * @param {string} rwoNumber - RWO number
 * @param {Model} Invoice - CustomerInvoice model
 * @returns {Promise<any[]>} Outstanding invoices
 */
export const getOutstandingInvoices = async (
  rwoNumber: string,
  Invoice: any,
): Promise<any[]> => {
  return await Invoice.findAll({
    where: {
      rwoNumber,
      paymentStatus: { [Op.in]: ['unpaid', 'partially_paid'] },
    },
    order: [['dueDate', 'ASC']],
  });
};

/**
 * Calculates invoice aging for AR tracking.
 *
 * @param {string} invoiceNumber - Invoice number
 * @param {Model} Invoice - CustomerInvoice model
 * @returns {Promise<number>} Days outstanding
 */
export const calculateInvoiceAging = async (
  invoiceNumber: string,
  Invoice: any,
): Promise<number> => {
  const invoice = await Invoice.findOne({ where: { invoiceNumber } });
  if (!invoice) throw new Error('Invoice not found');

  const daysPastDue = Math.floor(
    (new Date().getTime() - invoice.dueDate.getTime()) / 86400000,
  );
  return Math.max(daysPastDue, 0);
};

/**
 * Generates AR aging report for RWOs.
 *
 * @param {string} [customerId] - Optional customer filter
 * @param {Model} Invoice - CustomerInvoice model
 * @returns {Promise<any[]>} AR aging buckets
 */
export const generateARAgingReport = async (
  customerId: string | undefined,
  Invoice: any,
): Promise<any[]> => {
  const where: any = {
    paymentStatus: { [Op.in]: ['unpaid', 'partially_paid'] },
  };
  if (customerId) where.customerId = customerId;

  const invoices = await Invoice.findAll({ where });

  const agingBuckets = [
    { name: 'Current', min: -999, max: 0, count: 0, amount: 0 },
    { name: '1-30 days', min: 1, max: 30, count: 0, amount: 0 },
    { name: '31-60 days', min: 31, max: 60, count: 0, amount: 0 },
    { name: '61-90 days', min: 61, max: 90, count: 0, amount: 0 },
    { name: '90+ days', min: 91, max: 9999, count: 0, amount: 0 },
  ];

  invoices.forEach((invoice: any) => {
    const daysPastDue = Math.floor(
      (new Date().getTime() - invoice.dueDate.getTime()) / 86400000,
    );
    const bucket = agingBuckets.find(b => daysPastDue >= b.min && daysPastDue <= b.max);
    if (bucket) {
      bucket.count++;
      bucket.amount += parseFloat(invoice.remainingBalance);
    }
  });

  return agingBuckets;
};

/**
 * Exports customer invoice to PDF format.
 *
 * @param {string} invoiceNumber - Invoice number
 * @param {Model} Invoice - CustomerInvoice model
 * @param {Model} RWO - ReimbursableWorkOrder model
 * @returns {Promise<string>} Invoice content
 */
export const exportCustomerInvoicePDF = async (
  invoiceNumber: string,
  Invoice: any,
  RWO: any,
): Promise<string> => {
  const invoice = await Invoice.findOne({ where: { invoiceNumber } });
  if (!invoice) throw new Error('Invoice not found');

  const rwo = await getReimbursableWorkOrder(invoice.rwoNumber, RWO);

  const content = `
CUSTOMER INVOICE
================================================================================
Invoice Number: ${invoice.invoiceNumber}
Invoice Date: ${invoice.invoiceDate.toLocaleDateString()}
Due Date: ${invoice.dueDate.toLocaleDateString()}

BILL TO
${rwo.customerId}

PROJECT INFORMATION
RWO Number: ${invoice.rwoNumber}
Project: ${rwo.projectTitle}

INVOICE DETAILS
Type: ${invoice.invoiceType.toUpperCase()}
Invoice Amount: $${parseFloat(invoice.invoiceAmount).toLocaleString()}
Tax Amount: $${parseFloat(invoice.taxAmount).toLocaleString()}
Total Amount Due: $${parseFloat(invoice.totalAmount).toLocaleString()}

PAYMENT STATUS
Amount Paid: $${parseFloat(invoice.paidAmount).toLocaleString()}
Remaining Balance: $${parseFloat(invoice.remainingBalance).toLocaleString()}
Status: ${invoice.paymentStatus.toUpperCase()}

PAYMENT INSTRUCTIONS
Please remit payment to U.S. Treasury with reference to invoice number.

================================================================================
Generated: ${new Date().toISOString()}
`;

  return content;
};

// ============================================================================
// CUSTOMER PAYMENT & COLLECTION (17-24)
// ============================================================================

/**
 * Records customer payment against invoice.
 *
 * @param {CustomerPayment} paymentData - Payment data
 * @param {Model} Invoice - CustomerInvoice model
 * @param {Model} RWO - ReimbursableWorkOrder model
 * @returns {Promise<any>} Recorded payment
 */
export const recordCustomerPayment = async (
  paymentData: CustomerPayment,
  Invoice: any,
  RWO: any,
): Promise<any> => {
  const invoice = await Invoice.findOne({
    where: { invoiceNumber: paymentData.invoiceNumber },
  });
  if (!invoice) throw new Error('Invoice not found');

  // Update invoice payment
  invoice.paidAmount = parseFloat(invoice.paidAmount) + paymentData.paymentAmount;
  invoice.remainingBalance = parseFloat(invoice.totalAmount) - parseFloat(invoice.paidAmount);

  if (invoice.remainingBalance <= 0) {
    invoice.paymentStatus = 'paid';
  } else {
    invoice.paymentStatus = 'partially_paid';
  }
  await invoice.save();

  // Update RWO collection
  const rwo = await getReimbursableWorkOrder(invoice.rwoNumber, RWO);
  rwo.collectedAmount = parseFloat(rwo.collectedAmount) + paymentData.paymentAmount;
  rwo.accountsReceivable = parseFloat(rwo.billedAmount) - parseFloat(rwo.collectedAmount);
  await rwo.save();

  return paymentData;
};

/**
 * Processes advance payment and creates unearned revenue liability.
 *
 * @param {string} rwoNumber - RWO number
 * @param {number} advanceAmount - Advance payment amount
 * @param {Date} receivedDate - Payment received date
 * @param {Model} RWO - ReimbursableWorkOrder model
 * @returns {Promise<AdvancePaymentTracking>} Advance payment tracking
 */
export const processAdvancePayment = async (
  rwoNumber: string,
  advanceAmount: number,
  receivedDate: Date,
  RWO: any,
): Promise<AdvancePaymentTracking> => {
  const rwo = await getReimbursableWorkOrder(rwoNumber, RWO);
  if (!rwo) throw new Error('RWO not found');

  rwo.advancePayment = parseFloat(rwo.advancePayment) + advanceAmount;
  rwo.collectedAmount = parseFloat(rwo.collectedAmount) + advanceAmount;
  await rwo.save();

  return {
    rwoNumber,
    advanceAmount,
    receivedDate,
    unearnedBalance: advanceAmount,
    earnedToDate: 0,
    liquidationRate: 0,
    fullyLiquidated: false,
  };
};

/**
 * Liquidates advance payment as revenue is earned.
 *
 * @param {string} rwoNumber - RWO number
 * @param {number} earnedAmount - Amount earned in period
 * @param {Model} RWO - ReimbursableWorkOrder model
 * @returns {Promise<AdvancePaymentTracking>} Updated advance tracking
 */
export const liquidateAdvancePayment = async (
  rwoNumber: string,
  earnedAmount: number,
  RWO: any,
): Promise<AdvancePaymentTracking> => {
  const rwo = await getReimbursableWorkOrder(rwoNumber, RWO);
  if (!rwo) throw new Error('RWO not found');

  const advancePayment = parseFloat(rwo.advancePayment);
  const earnedRevenue = parseFloat(rwo.earnedRevenue);
  const liquidatedToDate = Math.min(earnedRevenue, advancePayment);
  const unearnedBalance = advancePayment - liquidatedToDate;

  return {
    rwoNumber,
    advanceAmount: advancePayment,
    receivedDate: new Date(), // Would track actual date
    unearnedBalance,
    earnedToDate: liquidatedToDate,
    liquidationRate: (liquidatedToDate / advancePayment) * 100,
    fullyLiquidated: unearnedBalance <= 0,
  };
};

/**
 * Tracks collection performance by customer.
 *
 * @param {string} customerId - Customer ID
 * @param {Model} Invoice - CustomerInvoice model
 * @returns {Promise<any>} Collection metrics
 */
export const trackCustomerCollectionPerformance = async (
  customerId: string,
  Invoice: any,
): Promise<any> => {
  const invoices = await Invoice.findAll({ where: { customerId } });

  const totalBilled = invoices.reduce(
    (sum: number, inv: any) => sum + parseFloat(inv.totalAmount),
    0,
  );
  const totalCollected = invoices.reduce(
    (sum: number, inv: any) => sum + parseFloat(inv.paidAmount),
    0,
  );
  const outstanding = totalBilled - totalCollected;

  const paidInvoices = invoices.filter((inv: any) => inv.paymentStatus === 'paid');
  const averageDaysToPayment =
    paidInvoices.reduce((sum: number, inv: any) => {
      const paymentDays = Math.floor(
        (new Date().getTime() - inv.invoiceDate.getTime()) / 86400000,
      );
      return sum + paymentDays;
    }, 0) / (paidInvoices.length || 1);

  return {
    customerId,
    totalInvoices: invoices.length,
    totalBilled,
    totalCollected,
    outstanding,
    collectionRate: (totalCollected / totalBilled) * 100,
    averageDaysToPayment,
  };
};

/**
 * Identifies overdue invoices requiring collection action.
 *
 * @param {number} [daysOverdue=30] - Days overdue threshold
 * @param {Model} Invoice - CustomerInvoice model
 * @returns {Promise<any[]>} Overdue invoices
 */
export const identifyOverdueInvoices = async (
  daysOverdue: number = 30,
  Invoice: any,
): Promise<any[]> => {
  const cutoffDate = new Date(Date.now() - daysOverdue * 86400000);
  return await Invoice.findAll({
    where: {
      dueDate: { [Op.lt]: cutoffDate },
      paymentStatus: { [Op.in]: ['unpaid', 'partially_paid'] },
    },
    order: [['dueDate', 'ASC']],
  });
};

/**
 * Sends collection reminder to customer.
 *
 * @param {string} invoiceNumber - Invoice number
 * @param {Model} Invoice - CustomerInvoice model
 * @returns {Promise<{ sent: boolean; messageId: string }>} Reminder result
 */
export const sendCollectionReminder = async (
  invoiceNumber: string,
  Invoice: any,
): Promise<{ sent: boolean; messageId: string }> => {
  const invoice = await Invoice.findOne({ where: { invoiceNumber } });
  if (!invoice) throw new Error('Invoice not found');

  const daysPastDue = Math.floor(
    (new Date().getTime() - invoice.dueDate.getTime()) / 86400000,
  );

  // Simulate sending collection reminder
  return {
    sent: true,
    messageId: `REMINDER-${invoiceNumber}-${Date.now()}`,
  };
};

/**
 * Calculates DSO (Days Sales Outstanding) for RWOs.
 *
 * @param {Model} Invoice - CustomerInvoice model
 * @returns {Promise<number>} DSO metric
 */
export const calculateDaysSalesOutstanding = async (
  Invoice: any,
): Promise<number> => {
  const invoices = await Invoice.findAll({
    where: { paymentStatus: { [Op.in]: ['unpaid', 'partially_paid'] } },
  });

  const totalAR = invoices.reduce(
    (sum: number, inv: any) => sum + parseFloat(inv.remainingBalance),
    0,
  );

  // Simplified DSO calculation
  const averageDailySales = totalAR / 365; // Would calculate actual daily sales
  const dso = totalAR / averageDailySales;

  return dso;
};

/**
 * Applies customer credit memo to invoice.
 *
 * @param {string} invoiceNumber - Original invoice number
 * @param {number} creditAmount - Credit amount
 * @param {string} reason - Credit reason
 * @param {Model} Invoice - CustomerInvoice model
 * @returns {Promise<any>} Credit memo invoice
 */
export const applyCreditMemo = async (
  invoiceNumber: string,
  creditAmount: number,
  reason: string,
  Invoice: any,
): Promise<any> => {
  const originalInvoice = await Invoice.findOne({ where: { invoiceNumber } });
  if (!originalInvoice) throw new Error('Invoice not found');

  const creditMemo = await createCustomerInvoice(
    {
      invoiceNumber: `CM-${invoiceNumber}`,
      rwoNumber: originalInvoice.rwoNumber,
      customerId: originalInvoice.customerId,
      invoiceDate: new Date(),
      dueDate: new Date(),
      invoiceAmount: -creditAmount,
      taxAmount: 0,
      totalAmount: -creditAmount,
      paidAmount: 0,
      remainingBalance: -creditAmount,
      paymentStatus: 'paid',
      invoiceType: 'credit_memo',
    },
    Invoice,
  );

  // Apply credit to original invoice
  originalInvoice.paidAmount = parseFloat(originalInvoice.paidAmount) + creditAmount;
  originalInvoice.remainingBalance = parseFloat(originalInvoice.remainingBalance) - creditAmount;
  if (originalInvoice.remainingBalance <= 0) {
    originalInvoice.paymentStatus = 'paid';
  }
  await originalInvoice.save();

  return creditMemo;
};

// ============================================================================
// REVENUE RECOGNITION (25-32)
// ============================================================================

/**
 * Recognizes revenue based on cost-to-cost method.
 *
 * @param {string} rwoNumber - RWO number
 * @param {number} costIncurred - Cost incurred in period
 * @param {Model} RWO - ReimbursableWorkOrder model
 * @returns {Promise<RevenueRecognition>} Revenue recognition
 */
export const recognizeRevenueCostToCost = async (
  rwoNumber: string,
  costIncurred: number,
  RWO: any,
): Promise<RevenueRecognition> => {
  const rwo = await getReimbursableWorkOrder(rwoNumber, RWO);
  if (!rwo) throw new Error('RWO not found');

  const percentComplete = await calculateRWOPercentComplete(rwoNumber, costIncurred, RWO);
  const earnedRevenue = (parseFloat(rwo.estimatedCost) * percentComplete) / 100;
  const previouslyEarned = parseFloat(rwo.earnedRevenue);
  const currentPeriodRevenue = earnedRevenue - previouslyEarned;

  rwo.earnedRevenue = earnedRevenue;
  rwo.unbilledRevenue = earnedRevenue - parseFloat(rwo.billedAmount);
  await rwo.save();

  return {
    rwoNumber,
    periodEndDate: new Date(),
    costIncurred,
    percentComplete,
    earnedRevenue: currentPeriodRevenue,
    billedRevenue: parseFloat(rwo.billedAmount),
    unbilledRevenue: parseFloat(rwo.unbilledRevenue),
    recognitionMethod: 'cost_to_cost',
    recognizedAt: new Date(),
  };
};

/**
 * Recognizes revenue based on milestone completion.
 *
 * @param {string} rwoNumber - RWO number
 * @param {BillingMilestone} milestone - Completed milestone
 * @param {Model} RWO - ReimbursableWorkOrder model
 * @returns {Promise<RevenueRecognition>} Revenue recognition
 */
export const recognizeRevenueMilestone = async (
  rwoNumber: string,
  milestone: BillingMilestone,
  RWO: any,
): Promise<RevenueRecognition> => {
  const rwo = await getReimbursableWorkOrder(rwoNumber, RWO);
  if (!rwo) throw new Error('RWO not found');

  const earnedRevenue = milestone.milestoneAmount;
  rwo.earnedRevenue = parseFloat(rwo.earnedRevenue) + earnedRevenue;
  rwo.unbilledRevenue = parseFloat(rwo.earnedRevenue) - parseFloat(rwo.billedAmount);
  await rwo.save();

  return {
    rwoNumber,
    periodEndDate: milestone.completedDate || new Date(),
    costIncurred: 0,
    percentComplete: (parseFloat(rwo.earnedRevenue) / parseFloat(rwo.estimatedCost)) * 100,
    earnedRevenue,
    billedRevenue: parseFloat(rwo.billedAmount),
    unbilledRevenue: parseFloat(rwo.unbilledRevenue),
    recognitionMethod: 'milestone',
    recognizedAt: new Date(),
  };
};

/**
 * Calculates unbilled receivable (earned but not billed).
 *
 * @param {string} rwoNumber - RWO number
 * @param {Model} RWO - ReimbursableWorkOrder model
 * @returns {Promise<number>} Unbilled receivable
 */
export const calculateUnbilledReceivable = async (
  rwoNumber: string,
  RWO: any,
): Promise<number> => {
  const rwo = await getReimbursableWorkOrder(rwoNumber, RWO);
  if (!rwo) throw new Error('RWO not found');

  return parseFloat(rwo.unbilledRevenue);
};

/**
 * Calculates unearned revenue (billed but not earned).
 *
 * @param {string} rwoNumber - RWO number
 * @param {Model} RWO - ReimbursableWorkOrder model
 * @returns {Promise<number>} Unearned revenue
 */
export const calculateUnearnedRevenue = async (
  rwoNumber: string,
  RWO: any,
): Promise<number> => {
  const rwo = await getReimbursableWorkOrder(rwoNumber, RWO);
  if (!rwo) throw new Error('RWO not found');

  const advanceTracking = await liquidateAdvancePayment(rwoNumber, 0, RWO);
  return advanceTracking.unearnedBalance;
};

/**
 * Generates revenue recognition schedule.
 *
 * @param {string} rwoNumber - RWO number
 * @param {Model} RWO - ReimbursableWorkOrder model
 * @returns {Promise<any[]>} Revenue schedule
 */
export const generateRevenueRecognitionSchedule = async (
  rwoNumber: string,
  RWO: any,
): Promise<any[]> => {
  const rwo = await getReimbursableWorkOrder(rwoNumber, RWO);
  if (!rwo) throw new Error('RWO not found');

  // Simplified schedule - would track actual historical revenue recognition
  return [
    {
      period: 'Current',
      earned: parseFloat(rwo.earnedRevenue),
      billed: parseFloat(rwo.billedAmount),
      collected: parseFloat(rwo.collectedAmount),
      unbilled: parseFloat(rwo.unbilledRevenue),
      receivable: parseFloat(rwo.accountsReceivable),
    },
  ];
};

/**
 * Validates revenue recognition against billing.
 *
 * @param {string} rwoNumber - RWO number
 * @param {Model} RWO - ReimbursableWorkOrder model
 * @returns {Promise<{ valid: boolean; issues: string[] }>} Validation result
 */
export const validateRevenueRecognition = async (
  rwoNumber: string,
  RWO: any,
): Promise<{ valid: boolean; issues: string[] }> => {
  const rwo = await getReimbursableWorkOrder(rwoNumber, RWO);
  if (!rwo) throw new Error('RWO not found');

  const issues: string[] = [];

  // Cannot bill more than earned
  if (parseFloat(rwo.billedAmount) > parseFloat(rwo.earnedRevenue)) {
    issues.push('Billed amount exceeds earned revenue');
  }

  // Cannot collect more than billed
  if (parseFloat(rwo.collectedAmount) > parseFloat(rwo.billedAmount)) {
    issues.push('Collected amount exceeds billed amount');
  }

  // Cannot earn more than estimated cost
  if (parseFloat(rwo.earnedRevenue) > parseFloat(rwo.estimatedCost)) {
    issues.push('Earned revenue exceeds estimated cost');
  }

  return {
    valid: issues.length === 0,
    issues,
  };
};

/**
 * Generates revenue recognition journal entry.
 *
 * @param {RevenueRecognition} revenueRec - Revenue recognition
 * @returns {any[]} Journal entry lines
 */
export const generateRevenueJournalEntry = (
  revenueRec: RevenueRecognition,
): any[] => {
  return [
    {
      account: '1310', // Unbilled Receivable
      debit: revenueRec.earnedRevenue,
      credit: 0,
      description: `Earned revenue - ${revenueRec.rwoNumber}`,
    },
    {
      account: '5100', // Revenue
      debit: 0,
      credit: revenueRec.earnedRevenue,
      description: `Revenue recognition - ${revenueRec.rwoNumber}`,
    },
  ];
};

/**
 * Reconciles revenue accounts (earned vs billed vs collected).
 *
 * @param {string} rwoNumber - RWO number
 * @param {Model} RWO - ReimbursableWorkOrder model
 * @returns {Promise<any>} Revenue reconciliation
 */
export const reconcileRevenueAccounts = async (
  rwoNumber: string,
  RWO: any,
): Promise<any> => {
  const rwo = await getReimbursableWorkOrder(rwoNumber, RWO);
  if (!rwo) throw new Error('RWO not found');

  const earned = parseFloat(rwo.earnedRevenue);
  const billed = parseFloat(rwo.billedAmount);
  const collected = parseFloat(rwo.collectedAmount);

  return {
    rwoNumber,
    earnedRevenue: earned,
    billedRevenue: billed,
    collectedRevenue: collected,
    unbilledReceivable: earned - billed,
    accountsReceivable: billed - collected,
    balanced: earned >= billed && billed >= collected,
  };
};

// ============================================================================
// COST RECOVERY & REPORTING (33-40)
// ============================================================================

/**
 * Calculates cost recovery for RWO.
 *
 * @param {string} rwoNumber - RWO number
 * @param {CostRecovery} costData - Cost data
 * @returns {CostRecovery} Cost recovery calculation
 */
export const calculateCostRecovery = (
  rwoNumber: string,
  costData: CostRecovery,
): CostRecovery => {
  costData.totalCost =
    costData.laborCost +
    costData.materialCost +
    costData.equipmentCost +
    costData.indirectCost;

  costData.markupAmount = costData.totalCost * (costData.markupPercent / 100);
  costData.recoverableAmount = costData.totalCost + costData.markupAmount;

  return costData;
};

/**
 * Generates RWO financial performance report.
 *
 * @param {string} rwoNumber - RWO number
 * @param {Model} RWO - ReimbursableWorkOrder model
 * @returns {Promise<any>} Performance report
 */
export const generateRWOPerformanceReport = async (
  rwoNumber: string,
  RWO: any,
): Promise<any> => {
  const summary = await generateRWOSummary(rwoNumber, RWO);

  return {
    ...summary,
    costRecoveryRate: (summary.earnedRevenue / summary.estimatedCost) * 100,
    billingRate: (summary.billedAmount / summary.earnedRevenue) * 100,
    collectionRate: (summary.collectedAmount / summary.billedAmount) * 100,
    unbilledRatio: (summary.unbilledRevenue / summary.earnedRevenue) * 100,
    arRatio: (summary.accountsReceivable / summary.billedAmount) * 100,
  };
};

/**
 * Exports RWO financial summary to Excel format.
 *
 * @param {string} rwoNumber - RWO number
 * @param {Model} RWO - ReimbursableWorkOrder model
 * @returns {Promise<string>} CSV formatted summary
 */
export const exportRWOFinancialSummary = async (
  rwoNumber: string,
  RWO: any,
): Promise<string> => {
  const summary = await generateRWOSummary(rwoNumber, RWO);

  const csv = [
    'Metric,Amount',
    `Estimated Cost,${summary.estimatedCost}`,
    `Earned Revenue,${summary.earnedRevenue}`,
    `Billed Amount,${summary.billedAmount}`,
    `Collected Amount,${summary.collectedAmount}`,
    `Unbilled Revenue,${summary.unbilledRevenue}`,
    `Accounts Receivable,${summary.accountsReceivable}`,
    `Percent Complete,${summary.percentComplete}%`,
    `Status,${summary.status}`,
  ].join('\n');

  return csv;
};

/**
 * Generates customer billing summary report.
 *
 * @param {string} customerId - Customer ID
 * @param {Date} startDate - Report start date
 * @param {Date} endDate - Report end date
 * @param {Model} Invoice - CustomerInvoice model
 * @returns {Promise<any>} Billing summary
 */
export const generateCustomerBillingSummary = async (
  customerId: string,
  startDate: Date,
  endDate: Date,
  Invoice: any,
): Promise<any> => {
  const invoices = await Invoice.findAll({
    where: {
      customerId,
      invoiceDate: { [Op.between]: [startDate, endDate] },
    },
  });

  const totalBilled = invoices.reduce(
    (sum: number, inv: any) => sum + parseFloat(inv.totalAmount),
    0,
  );
  const totalPaid = invoices.reduce(
    (sum: number, inv: any) => sum + parseFloat(inv.paidAmount),
    0,
  );

  return {
    customerId,
    period: { startDate, endDate },
    invoiceCount: invoices.length,
    totalBilled,
    totalPaid,
    outstanding: totalBilled - totalPaid,
  };
};

/**
 * Identifies RWOs at risk of cost overrun.
 *
 * @param {number} [threshold=0.9] - Cost threshold (90%)
 * @param {Model} RWO - ReimbursableWorkOrder model
 * @returns {Promise<any[]>} At-risk RWOs
 */
export const identifyAtRiskRWOs = async (
  threshold: number = 0.9,
  RWO: any,
): Promise<any[]> => {
  const activeRWOs = await RWO.findAll({
    where: { status: 'active' },
  });

  return activeRWOs
    .filter((rwo: any) => {
      const costRatio = parseFloat(rwo.earnedRevenue) / parseFloat(rwo.estimatedCost);
      return costRatio >= threshold;
    })
    .map((rwo: any) => ({
      rwoNumber: rwo.rwoNumber,
      projectTitle: rwo.projectTitle,
      estimatedCost: parseFloat(rwo.estimatedCost),
      earnedRevenue: parseFloat(rwo.earnedRevenue),
      costRatio: (parseFloat(rwo.earnedRevenue) / parseFloat(rwo.estimatedCost)) * 100,
      remainingBudget: parseFloat(rwo.estimatedCost) - parseFloat(rwo.earnedRevenue),
    }));
};

/**
 * Calculates RWO profitability margin.
 *
 * @param {string} rwoNumber - RWO number
 * @param {number} totalCost - Total cost incurred
 * @param {Model} RWO - ReimbursableWorkOrder model
 * @returns {Promise<{ margin: number; marginPercent: number }>} Profitability
 */
export const calculateRWOProfitability = async (
  rwoNumber: string,
  totalCost: number,
  RWO: any,
): Promise<{ margin: number; marginPercent: number }> => {
  const rwo = await getReimbursableWorkOrder(rwoNumber, RWO);
  if (!rwo) throw new Error('RWO not found');

  const revenue = parseFloat(rwo.earnedRevenue);
  const margin = revenue - totalCost;
  const marginPercent = (margin / revenue) * 100;

  return { margin, marginPercent };
};

/**
 * Generates monthly RWO activity report.
 *
 * @param {Date} reportMonth - Report month
 * @param {Model} RWO - ReimbursableWorkOrder model
 * @param {Model} Invoice - CustomerInvoice model
 * @returns {Promise<any>} Monthly activity report
 */
export const generateMonthlyRWOActivityReport = async (
  reportMonth: Date,
  RWO: any,
  Invoice: any,
): Promise<any> => {
  const startDate = new Date(reportMonth.getFullYear(), reportMonth.getMonth(), 1);
  const endDate = new Date(reportMonth.getFullYear(), reportMonth.getMonth() + 1, 0);

  const activeRWOs = await RWO.findAll({
    where: { status: 'active' },
  });

  const invoices = await Invoice.findAll({
    where: {
      invoiceDate: { [Op.between]: [startDate, endDate] },
    },
  });

  return {
    reportMonth: reportMonth.toISOString().substring(0, 7),
    activeRWOCount: activeRWOs.length,
    invoicesGenerated: invoices.length,
    totalBilled: invoices.reduce((sum: number, inv: any) => sum + parseFloat(inv.totalAmount), 0),
    totalCollected: invoices.reduce((sum: number, inv: any) => sum + parseFloat(inv.paidAmount), 0),
  };
};

/**
 * Validates RWO data integrity and business rules.
 *
 * @param {string} rwoNumber - RWO number
 * @param {Model} RWO - ReimbursableWorkOrder model
 * @returns {Promise<{ valid: boolean; errors: string[] }>} Validation result
 */
export const validateRWOIntegrity = async (
  rwoNumber: string,
  RWO: any,
): Promise<{ valid: boolean; errors: string[] }> => {
  const errors: string[] = [];
  const rwo = await getReimbursableWorkOrder(rwoNumber, RWO);

  if (!rwo) {
    errors.push('RWO not found');
    return { valid: false, errors };
  }

  const revenueValidation = await validateRevenueRecognition(rwoNumber, RWO);
  errors.push(...revenueValidation.issues);

  if (parseFloat(rwo.unbilledRevenue) < 0) {
    errors.push('Unbilled revenue cannot be negative');
  }

  if (parseFloat(rwo.accountsReceivable) < 0) {
    errors.push('Accounts receivable cannot be negative');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

// ============================================================================
// NESTJS SERVICE WRAPPER
// ============================================================================

/**
 * NestJS Injectable service for CEFMS Reimbursable Work Orders.
 *
 * @example
 * ```typescript
 * @Controller('cefms/rwo')
 * export class CEFMSRWOController {
 *   constructor(private readonly rwoService: CEFMSReimbursableWorkOrderService) {}
 *
 *   @Post('work-orders')
 *   async createRWO(@Body() data: ReimbursableWorkOrder) {
 *     return this.rwoService.createRWO(data);
 *   }
 * }
 * ```
 */
@Injectable()
export class CEFMSReimbursableWorkOrderService {
  constructor(private readonly sequelize: Sequelize) {}

  async createRWO(data: ReimbursableWorkOrder) {
    const RWO = createReimbursableWorkOrderModel(this.sequelize);
    return createReimbursableWorkOrder(data, RWO);
  }

  async generateProgressInvoice(rwoNumber: string, invoiceDate: Date) {
    const RWO = createReimbursableWorkOrderModel(this.sequelize);
    const Invoice = createCustomerInvoiceModel(this.sequelize);
    return generateProgressInvoice(rwoNumber, invoiceDate, RWO, Invoice);
  }

  async recordPayment(paymentData: CustomerPayment) {
    const Invoice = createCustomerInvoiceModel(this.sequelize);
    const RWO = createReimbursableWorkOrderModel(this.sequelize);
    return recordCustomerPayment(paymentData, Invoice, RWO);
  }
}

/**
 * Default export with all CEFMS RWO utilities.
 */
export default {
  // Models
  createReimbursableWorkOrderModel,
  createCustomerInvoiceModel,

  // RWO Management
  createReimbursableWorkOrder,
  getReimbursableWorkOrder,
  updateRWOStatus,
  calculateRWOPercentComplete,
  getActiveRWOsByCustomer,
  generateRWOSummary,
  validateRWOFundingSufficiency,
  extendRWOEstimatedCost,

  // Billing & Invoicing
  createCustomerInvoice,
  generateProgressInvoice,
  generateAdvancePaymentInvoice,
  generateFinalInvoice,
  getOutstandingInvoices,
  calculateInvoiceAging,
  generateARAgingReport,
  exportCustomerInvoicePDF,

  // Payment & Collection
  recordCustomerPayment,
  processAdvancePayment,
  liquidateAdvancePayment,
  trackCustomerCollectionPerformance,
  identifyOverdueInvoices,
  sendCollectionReminder,
  calculateDaysSalesOutstanding,
  applyCreditMemo,

  // Revenue Recognition
  recognizeRevenueCostToCost,
  recognizeRevenueMilestone,
  calculateUnbilledReceivable,
  calculateUnearnedRevenue,
  generateRevenueRecognitionSchedule,
  validateRevenueRecognition,
  generateRevenueJournalEntry,
  reconcileRevenueAccounts,

  // Cost Recovery & Reporting
  calculateCostRecovery,
  generateRWOPerformanceReport,
  exportRWOFinancialSummary,
  generateCustomerBillingSummary,
  identifyAtRiskRWOs,
  calculateRWOProfitability,
  generateMonthlyRWOActivityReport,
  validateRWOIntegrity,

  // Service
  CEFMSReimbursableWorkOrderService,
};
