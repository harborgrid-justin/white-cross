/**
 * @fileoverview Payment Processing and Billing Kit - Enterprise Stripe/Zuora/Chargebee competitor
 * @module reuse/financial/payment-processing-billing-kit
 * @description Comprehensive payment processing, billing, and subscription management system
 * competing with Stripe Billing, Zuora, and Chargebee. Handles invoice generation, payment
 * processing across multiple gateways, recurring billing, subscription management, payment
 * plans, dunning workflows, PCI compliance, and multi-currency transactions.
 *
 * Key Features:
 * - Invoice generation and management (create, update, void, credit memos)
 * - Multi-gateway payment processing (Stripe, PayPal, Authorize.net, Braintree)
 * - Payment capture, authorization, refund, and void operations
 * - Recurring billing and subscription lifecycle management
 * - Flexible payment plans and installment schedules
 * - Automated late fee calculations and application
 * - Payment reconciliation and settlement tracking
 * - Secure payment gateway tokenization (PCI DSS Level 1)
 * - PCI compliance helpers and validation
 * - Automated dunning workflows with retry logic
 * - Intelligent payment retry with exponential backoff
 * - Multi-currency payment processing with FX conversion
 * - Payment method management and vault storage
 * - Subscription upgrades, downgrades, and prorations
 * - Usage-based billing and metered invoicing
 * - Payment disputes and chargeback handling
 * - Revenue recognition and accrual accounting
 * - Payment analytics and reporting
 * - Webhook event handling for payment status updates
 *
 * @target Stripe Billing, Zuora, Chargebee alternative
 * @framework NestJS 10.x, Sequelize 6.x, TypeScript 5.x
 *
 * @security
 * - PCI DSS Level 1 compliance
 * - Tokenized payment method storage
 * - End-to-end encryption for payment data
 * - 3D Secure and SCA (Strong Customer Authentication)
 * - Fraud detection and prevention
 * - Role-based access control for financial data
 * - Audit trails for all payment transactions
 * - SOC 2 Type II compliance
 * - GDPR and data privacy compliance
 * - Multi-tenant data isolation
 *
 * @example Invoice generation and payment processing
 * ```typescript
 * import { generateInvoice, processPayment } from './payment-processing-billing-kit';
 *
 * const invoice = await generateInvoice({
 *   customerId: 'cust-123',
 *   items: [
 *     { description: 'Monthly Subscription', amount: 99.99, quantity: 1 },
 *     { description: 'Additional Users', amount: 9.99, quantity: 5 }
 *   ],
 *   currency: 'USD',
 *   dueDate: new Date('2025-12-01'),
 * });
 *
 * const payment = await processPayment({
 *   invoiceId: invoice.id,
 *   paymentMethodId: 'pm-456',
 *   amount: invoice.total,
 *   gateway: PaymentGateway.STRIPE,
 * });
 * ```
 *
 * @example Recurring billing subscription
 * ```typescript
 * import { createSubscription, processRecurringBilling } from './payment-processing-billing-kit';
 *
 * const subscription = await createSubscription({
 *   customerId: 'cust-123',
 *   planId: 'plan-pro',
 *   billingCycle: BillingCycle.MONTHLY,
 *   startDate: new Date(),
 *   paymentMethodId: 'pm-456',
 * });
 *
 * const billingResult = await processRecurringBilling('sub-789', new Date());
 * ```
 *
 * @example Payment plan with installments
 * ```typescript
 * import { createPaymentPlan, processInstallmentPayment } from './payment-processing-billing-kit';
 *
 * const paymentPlan = await createPaymentPlan({
 *   customerId: 'cust-123',
 *   totalAmount: 5000,
 *   installments: 12,
 *   frequency: InstallmentFrequency.MONTHLY,
 *   startDate: new Date(),
 * });
 *
 * const installmentPayment = await processInstallmentPayment('plan-789', 1);
 * ```
 *
 * LOC: FIN-PAYB-001
 * UPSTREAM: sequelize, @nestjs/*, swagger, decimal.js, date-fns, crypto
 * DOWNSTREAM: accounting, customer-management, subscription-management, reporting, analytics
 *
 * @version 1.0.0
 * @since 2025-11-08
 */

import {
  Model,
  ModelStatic,
  Sequelize,
  DataTypes,
  Transaction,
  Op,
  QueryTypes,
  FindOptions,
} from 'sequelize';
import { Injectable, Logger, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { ApiProperty, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { addDays, addMonths, addYears, differenceInDays, isBefore, isAfter, startOfDay, endOfDay } from 'date-fns';
import Decimal from 'decimal.js';
import * as crypto from 'crypto';

// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================

/**
 * Payment method types supported across gateways
 */
export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  ACH = 'ach',
  WIRE_TRANSFER = 'wire_transfer',
  PAYPAL = 'paypal',
  APPLE_PAY = 'apple_pay',
  GOOGLE_PAY = 'google_pay',
  SEPA_DEBIT = 'sepa_debit',
  BANK_TRANSFER = 'bank_transfer',
  CHECK = 'check',
  CASH = 'cash',
  CRYPTOCURRENCY = 'cryptocurrency',
}

/**
 * Payment transaction status
 */
export enum PaymentStatus {
  PENDING = 'pending',
  AUTHORIZED = 'authorized',
  CAPTURED = 'captured',
  PARTIALLY_CAPTURED = 'partially_captured',
  SUCCESS = 'success',
  FAILED = 'failed',
  DECLINED = 'declined',
  REFUNDED = 'refunded',
  PARTIALLY_REFUNDED = 'partially_refunded',
  VOIDED = 'voided',
  CANCELLED = 'cancelled',
  DISPUTED = 'disputed',
  CHARGEBACK = 'chargeback',
  REVERSED = 'reversed',
  PROCESSING = 'processing',
  REQUIRES_ACTION = 'requires_action',
  REQUIRES_CAPTURE = 'requires_capture',
}

/**
 * Invoice status lifecycle
 */
export enum InvoiceStatus {
  DRAFT = 'draft',
  OPEN = 'open',
  SENT = 'sent',
  VIEWED = 'viewed',
  PAID = 'paid',
  PARTIALLY_PAID = 'partially_paid',
  OVERDUE = 'overdue',
  VOID = 'void',
  UNCOLLECTIBLE = 'uncollectible',
  REFUNDED = 'refunded',
  DISPUTED = 'disputed',
  CANCELLED = 'cancelled',
}

/**
 * Billing cycle frequencies
 */
export enum BillingCycle {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  BIWEEKLY = 'biweekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  SEMI_ANNUAL = 'semi_annual',
  ANNUAL = 'annual',
  BIENNIAL = 'biennial',
  TRIENNIAL = 'triennial',
  ONE_TIME = 'one_time',
  USAGE_BASED = 'usage_based',
}

/**
 * Subscription status
 */
export enum SubscriptionStatus {
  TRIAL = 'trial',
  ACTIVE = 'active',
  PAST_DUE = 'past_due',
  CANCELLED = 'cancelled',
  SUSPENDED = 'suspended',
  PAUSED = 'paused',
  EXPIRED = 'expired',
  INCOMPLETE = 'incomplete',
  INCOMPLETE_EXPIRED = 'incomplete_expired',
  PENDING_CANCELLATION = 'pending_cancellation',
}

/**
 * Supported payment gateways
 */
export enum PaymentGateway {
  STRIPE = 'stripe',
  PAYPAL = 'paypal',
  AUTHORIZE_NET = 'authorize_net',
  BRAINTREE = 'braintree',
  SQUARE = 'square',
  ADYEN = 'adyen',
  WORLDPAY = 'worldpay',
  CHECKOUT_COM = 'checkout_com',
  INTERNAL = 'internal',
}

/**
 * Payment gateway transaction types
 */
export enum GatewayTransactionType {
  AUTHORIZE = 'authorize',
  CAPTURE = 'capture',
  SALE = 'sale',
  REFUND = 'refund',
  VOID = 'void',
  CREDIT = 'credit',
  VERIFY = 'verify',
}

/**
 * Installment frequency options
 */
export enum InstallmentFrequency {
  WEEKLY = 'weekly',
  BIWEEKLY = 'biweekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  SEMI_ANNUAL = 'semi_annual',
}

/**
 * Dunning workflow stages
 */
export enum DunningStage {
  INITIAL = 'initial',
  FIRST_REMINDER = 'first_reminder',
  SECOND_REMINDER = 'second_reminder',
  FINAL_NOTICE = 'final_notice',
  COLLECTION = 'collection',
  SUSPENDED = 'suspended',
  RESOLVED = 'resolved',
}

/**
 * Payment retry strategy types
 */
export enum RetryStrategy {
  LINEAR = 'linear',
  EXPONENTIAL = 'exponential',
  CUSTOM = 'custom',
  SMART = 'smart',
}

/**
 * Credit memo types
 */
export enum CreditMemoType {
  REFUND = 'refund',
  CREDIT_NOTE = 'credit_note',
  ADJUSTMENT = 'adjustment',
  DISCOUNT = 'discount',
  GOODWILL = 'goodwill',
}

/**
 * Currency codes (ISO 4217)
 */
export enum Currency {
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
  CAD = 'CAD',
  AUD = 'AUD',
  JPY = 'JPY',
  CNY = 'CNY',
  INR = 'INR',
  BRL = 'BRL',
  MXN = 'MXN',
}

// ============================================================================
// INTERFACES
// ============================================================================

/**
 * Invoice data structure
 */
export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  subscriptionId?: string;
  status: InvoiceStatus;
  currency: Currency;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
  amountPaid: number;
  amountDue: number;
  issueDate: Date;
  dueDate: Date;
  paidAt?: Date;
  items: InvoiceItem[];
  metadata?: Record<string, any>;
  notes?: string;
  termsAndConditions?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Invoice line item
 */
export interface InvoiceItem {
  id: string;
  invoiceId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  taxRate?: number;
  taxAmount?: number;
  discountAmount?: number;
  metadata?: Record<string, any>;
}

/**
 * Payment transaction record
 */
export interface Payment {
  id: string;
  invoiceId?: string;
  customerId: string;
  subscriptionId?: string;
  paymentMethodId: string;
  gateway: PaymentGateway;
  gatewayTransactionId?: string;
  status: PaymentStatus;
  amount: number;
  currency: Currency;
  capturedAmount?: number;
  refundedAmount?: number;
  feeAmount?: number;
  netAmount?: number;
  transactionType: GatewayTransactionType;
  failureCode?: string;
  failureMessage?: string;
  metadata?: Record<string, any>;
  processedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Stored payment method (tokenized)
 */
export interface PaymentMethodRecord {
  id: string;
  customerId: string;
  gateway: PaymentGateway;
  gatewayCustomerId?: string;
  gatewayPaymentMethodId: string;
  type: PaymentMethod;
  isDefault: boolean;
  cardBrand?: string;
  cardLast4?: string;
  cardExpMonth?: number;
  cardExpYear?: number;
  bankName?: string;
  bankLast4?: string;
  billingDetails?: Record<string, any>;
  metadata?: Record<string, any>;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Subscription record
 */
export interface Subscription {
  id: string;
  customerId: string;
  planId: string;
  status: SubscriptionStatus;
  billingCycle: BillingCycle;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  trialStart?: Date;
  trialEnd?: Date;
  cancelledAt?: Date;
  cancelAtPeriodEnd: boolean;
  paymentMethodId: string;
  quantity: number;
  unitPrice: number;
  currency: Currency;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Payment plan with installments
 */
export interface PaymentPlan {
  id: string;
  customerId: string;
  invoiceId?: string;
  totalAmount: number;
  currency: Currency;
  installments: number;
  installmentAmount: number;
  frequency: InstallmentFrequency;
  startDate: Date;
  nextPaymentDate: Date;
  status: string;
  paidInstallments: number;
  remainingAmount: number;
  paymentMethodId: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Installment record
 */
export interface Installment {
  id: string;
  paymentPlanId: string;
  installmentNumber: number;
  amount: number;
  dueDate: Date;
  status: PaymentStatus;
  paymentId?: string;
  paidAt?: Date;
  metadata?: Record<string, any>;
}

/**
 * Dunning workflow record
 */
export interface DunningWorkflow {
  id: string;
  customerId: string;
  subscriptionId?: string;
  invoiceId: string;
  stage: DunningStage;
  attemptCount: number;
  lastAttemptDate?: Date;
  nextAttemptDate?: Date;
  status: string;
  notes?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Payment retry configuration
 */
export interface PaymentRetryConfig {
  id: string;
  customerId?: string;
  strategy: RetryStrategy;
  maxAttempts: number;
  retryIntervals: number[]; // in hours
  enabled: boolean;
  stopOnSuccess: boolean;
  metadata?: Record<string, any>;
}

/**
 * Credit memo record
 */
export interface CreditMemo {
  id: string;
  creditMemoNumber: string;
  customerId: string;
  invoiceId?: string;
  type: CreditMemoType;
  amount: number;
  currency: Currency;
  reason: string;
  status: string;
  appliedAt?: Date;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Payment reconciliation record
 */
export interface PaymentReconciliation {
  id: string;
  reconciliationDate: Date;
  gateway: PaymentGateway;
  expectedAmount: number;
  actualAmount: number;
  variance: number;
  transactionCount: number;
  reconciledBy: string;
  status: string;
  notes?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

/**
 * Exchange rate for multi-currency
 */
export interface ExchangeRate {
  id: string;
  fromCurrency: Currency;
  toCurrency: Currency;
  rate: number;
  effectiveDate: Date;
  source: string;
  createdAt: Date;
}

// ============================================================================
// SEQUELIZE MODEL DEFINITIONS
// ============================================================================

/**
 * Invoice model definition
 */
export const defineInvoiceModel = (sequelize: Sequelize): ModelStatic<Model> => {
  return sequelize.define('Invoice', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    invoiceNumber: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
      },
    },
    customerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Customers',
        key: 'id',
      },
    },
    subscriptionId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Subscriptions',
        key: 'id',
      },
    },
    status: {
      type: DataTypes.ENUM(...Object.values(InvoiceStatus)),
      allowNull: false,
      defaultValue: InvoiceStatus.DRAFT,
    },
    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: Currency.USD,
    },
    subtotal: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
    },
    taxAmount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
    },
    discountAmount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
    },
    total: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    amountPaid: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
    },
    amountDue: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    issueDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    paidAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    termsAndConditions: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
  }, {
    tableName: 'invoices',
    timestamps: true,
    indexes: [
      { fields: ['customerId'] },
      { fields: ['subscriptionId'] },
      { fields: ['status'] },
      { fields: ['dueDate'] },
      { fields: ['invoiceNumber'], unique: true },
    ],
  });
};

/**
 * Payment model definition
 */
export const definePaymentModel = (sequelize: Sequelize): ModelStatic<Model> => {
  return sequelize.define('Payment', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    invoiceId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Invoices',
        key: 'id',
      },
    },
    customerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Customers',
        key: 'id',
      },
    },
    subscriptionId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Subscriptions',
        key: 'id',
      },
    },
    paymentMethodId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'PaymentMethods',
        key: 'id',
      },
    },
    gateway: {
      type: DataTypes.ENUM(...Object.values(PaymentGateway)),
      allowNull: false,
    },
    gatewayTransactionId: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(PaymentStatus)),
      allowNull: false,
      defaultValue: PaymentStatus.PENDING,
    },
    amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: Currency.USD,
    },
    capturedAmount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
    },
    refundedAmount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      defaultValue: 0,
    },
    feeAmount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
    },
    netAmount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
    },
    transactionType: {
      type: DataTypes.ENUM(...Object.values(GatewayTransactionType)),
      allowNull: false,
    },
    failureCode: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    failureMessage: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    processedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName: 'payments',
    timestamps: true,
    indexes: [
      { fields: ['customerId'] },
      { fields: ['invoiceId'] },
      { fields: ['subscriptionId'] },
      { fields: ['status'] },
      { fields: ['gateway'] },
      { fields: ['gatewayTransactionId'] },
    ],
  });
};

/**
 * Subscription model definition
 */
export const defineSubscriptionModel = (sequelize: Sequelize): ModelStatic<Model> => {
  return sequelize.define('Subscription', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    customerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Customers',
        key: 'id',
      },
    },
    planId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(SubscriptionStatus)),
      allowNull: false,
      defaultValue: SubscriptionStatus.ACTIVE,
    },
    billingCycle: {
      type: DataTypes.ENUM(...Object.values(BillingCycle)),
      allowNull: false,
    },
    currentPeriodStart: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    currentPeriodEnd: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    trialStart: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    trialEnd: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    cancelledAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    cancelAtPeriodEnd: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    paymentMethodId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'PaymentMethods',
        key: 'id',
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    unitPrice: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: Currency.USD,
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
  }, {
    tableName: 'subscriptions',
    timestamps: true,
    indexes: [
      { fields: ['customerId'] },
      { fields: ['planId'] },
      { fields: ['status'] },
      { fields: ['currentPeriodEnd'] },
    ],
  });
};

// ============================================================================
// INVOICE GENERATION AND MANAGEMENT
// ============================================================================

/**
 * Generate a new invoice for a customer
 *
 * @param sequelize - Sequelize instance
 * @param invoiceData - Invoice creation data
 * @param transaction - Optional database transaction
 * @returns Created invoice with generated invoice number
 */
export async function generateInvoice(
  sequelize: Sequelize,
  invoiceData: {
    customerId: string;
    subscriptionId?: string;
    items: Array<{
      description: string;
      quantity: number;
      unitPrice: number;
      taxRate?: number;
    }>;
    currency?: Currency;
    dueDate?: Date;
    issueDate?: Date;
    discountAmount?: number;
    notes?: string;
    termsAndConditions?: string;
    metadata?: Record<string, any>;
  },
  transaction?: Transaction,
): Promise<Invoice> {
  const Invoice = sequelize.model('Invoice');
  const InvoiceItem = sequelize.model('InvoiceItem');

  // Calculate totals
  let subtotal = new Decimal(0);
  let totalTax = new Decimal(0);

  const invoiceItems = invoiceData.items.map(item => {
    const itemAmount = new Decimal(item.unitPrice).mul(item.quantity);
    const taxAmount = item.taxRate
      ? itemAmount.mul(item.taxRate).div(100)
      : new Decimal(0);

    subtotal = subtotal.add(itemAmount);
    totalTax = totalTax.add(taxAmount);

    return {
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      amount: itemAmount.toNumber(),
      taxRate: item.taxRate || 0,
      taxAmount: taxAmount.toNumber(),
    };
  });

  const discountAmount = new Decimal(invoiceData.discountAmount || 0);
  const total = subtotal.add(totalTax).sub(discountAmount);

  // Generate invoice number
  const invoiceNumber = await generateInvoiceNumber(sequelize, transaction);

  const invoice = await Invoice.create({
    invoiceNumber,
    customerId: invoiceData.customerId,
    subscriptionId: invoiceData.subscriptionId,
    status: InvoiceStatus.DRAFT,
    currency: invoiceData.currency || Currency.USD,
    subtotal: subtotal.toNumber(),
    taxAmount: totalTax.toNumber(),
    discountAmount: discountAmount.toNumber(),
    total: total.toNumber(),
    amountDue: total.toNumber(),
    amountPaid: 0,
    issueDate: invoiceData.issueDate || new Date(),
    dueDate: invoiceData.dueDate || addDays(new Date(), 30),
    notes: invoiceData.notes,
    termsAndConditions: invoiceData.termsAndConditions,
    metadata: invoiceData.metadata,
  }, { transaction });

  // Create invoice items
  for (const item of invoiceItems) {
    await InvoiceItem.create({
      invoiceId: invoice.get('id'),
      ...item,
    }, { transaction });
  }

  return invoice.toJSON() as Invoice;
}

/**
 * Update an existing invoice
 *
 * @param sequelize - Sequelize instance
 * @param invoiceId - Invoice ID to update
 * @param updates - Fields to update
 * @param transaction - Optional database transaction
 * @returns Updated invoice
 */
export async function updateInvoice(
  sequelize: Sequelize,
  invoiceId: string,
  updates: {
    status?: InvoiceStatus;
    dueDate?: Date;
    notes?: string;
    termsAndConditions?: string;
    metadata?: Record<string, any>;
  },
  transaction?: Transaction,
): Promise<Invoice> {
  const Invoice = sequelize.model('Invoice');

  const invoice = await Invoice.findByPk(invoiceId, { transaction });
  if (!invoice) {
    throw new NotFoundException(`Invoice ${invoiceId} not found`);
  }

  // Validate status transitions
  const currentStatus = invoice.get('status') as InvoiceStatus;
  if (updates.status && !isValidInvoiceStatusTransition(currentStatus, updates.status)) {
    throw new BadRequestException(`Cannot transition invoice from ${currentStatus} to ${updates.status}`);
  }

  await invoice.update(updates, { transaction });

  return invoice.toJSON() as Invoice;
}

/**
 * Void an invoice (cannot be paid or modified after voiding)
 *
 * @param sequelize - Sequelize instance
 * @param invoiceId - Invoice ID to void
 * @param reason - Reason for voiding
 * @param transaction - Optional database transaction
 * @returns Voided invoice
 */
export async function voidInvoice(
  sequelize: Sequelize,
  invoiceId: string,
  reason: string,
  transaction?: Transaction,
): Promise<Invoice> {
  const Invoice = sequelize.model('Invoice');

  const invoice = await Invoice.findByPk(invoiceId, { transaction });
  if (!invoice) {
    throw new NotFoundException(`Invoice ${invoiceId} not found`);
  }

  const status = invoice.get('status') as InvoiceStatus;
  if ([InvoiceStatus.PAID, InvoiceStatus.VOID].includes(status)) {
    throw new BadRequestException(`Cannot void invoice with status ${status}`);
  }

  await invoice.update({
    status: InvoiceStatus.VOID,
    metadata: {
      ...(invoice.get('metadata') as any || {}),
      voidReason: reason,
      voidedAt: new Date().toISOString(),
    },
  }, { transaction });

  return invoice.toJSON() as Invoice;
}

/**
 * Create a credit memo for an invoice or customer
 *
 * @param sequelize - Sequelize instance
 * @param creditMemoData - Credit memo data
 * @param transaction - Optional database transaction
 * @returns Created credit memo
 */
export async function createCreditMemo(
  sequelize: Sequelize,
  creditMemoData: {
    customerId: string;
    invoiceId?: string;
    type: CreditMemoType;
    amount: number;
    currency?: Currency;
    reason: string;
    metadata?: Record<string, any>;
  },
  transaction?: Transaction,
): Promise<CreditMemo> {
  const CreditMemo = sequelize.model('CreditMemo');

  const creditMemoNumber = await generateCreditMemoNumber(sequelize, transaction);

  const creditMemo = await CreditMemo.create({
    creditMemoNumber,
    customerId: creditMemoData.customerId,
    invoiceId: creditMemoData.invoiceId,
    type: creditMemoData.type,
    amount: creditMemoData.amount,
    currency: creditMemoData.currency || Currency.USD,
    reason: creditMemoData.reason,
    status: 'pending',
    metadata: creditMemoData.metadata,
  }, { transaction });

  return creditMemo.toJSON() as CreditMemo;
}

/**
 * Apply a credit memo to an invoice
 *
 * @param sequelize - Sequelize instance
 * @param creditMemoId - Credit memo ID
 * @param invoiceId - Invoice ID to apply credit to
 * @param transaction - Optional database transaction
 * @returns Updated invoice and credit memo
 */
export async function applyCreditMemoToInvoice(
  sequelize: Sequelize,
  creditMemoId: string,
  invoiceId: string,
  transaction?: Transaction,
): Promise<{ invoice: Invoice; creditMemo: CreditMemo }> {
  const CreditMemo = sequelize.model('CreditMemo');
  const Invoice = sequelize.model('Invoice');

  const creditMemo = await CreditMemo.findByPk(creditMemoId, { transaction });
  if (!creditMemo) {
    throw new NotFoundException(`Credit memo ${creditMemoId} not found`);
  }

  const invoice = await Invoice.findByPk(invoiceId, { transaction });
  if (!invoice) {
    throw new NotFoundException(`Invoice ${invoiceId} not found`);
  }

  const creditAmount = new Decimal(creditMemo.get('amount') as number);
  const currentAmountDue = new Decimal(invoice.get('amountDue') as number);
  const currentAmountPaid = new Decimal(invoice.get('amountPaid') as number);

  const newAmountDue = Decimal.max(0, currentAmountDue.sub(creditAmount));
  const appliedAmount = currentAmountDue.sub(newAmountDue);

  await invoice.update({
    amountDue: newAmountDue.toNumber(),
    amountPaid: currentAmountPaid.add(appliedAmount).toNumber(),
    status: newAmountDue.isZero() ? InvoiceStatus.PAID : InvoiceStatus.PARTIALLY_PAID,
  }, { transaction });

  await creditMemo.update({
    invoiceId,
    status: 'applied',
    appliedAt: new Date(),
  }, { transaction });

  return {
    invoice: invoice.toJSON() as Invoice,
    creditMemo: creditMemo.toJSON() as CreditMemo,
  };
}

// ============================================================================
// PAYMENT PROCESSING
// ============================================================================

/**
 * Process a payment for an invoice
 *
 * @param sequelize - Sequelize instance
 * @param paymentData - Payment processing data
 * @param transaction - Optional database transaction
 * @returns Created payment record
 */
export async function processPayment(
  sequelize: Sequelize,
  paymentData: {
    invoiceId?: string;
    customerId: string;
    subscriptionId?: string;
    paymentMethodId: string;
    amount: number;
    currency?: Currency;
    gateway: PaymentGateway;
    metadata?: Record<string, any>;
  },
  transaction?: Transaction,
): Promise<Payment> {
  const Payment = sequelize.model('Payment');
  const Invoice = sequelize.model('Invoice');
  const PaymentMethod = sequelize.model('PaymentMethod');

  // Verify payment method
  const paymentMethod = await PaymentMethod.findByPk(paymentData.paymentMethodId, { transaction });
  if (!paymentMethod) {
    throw new NotFoundException(`Payment method ${paymentData.paymentMethodId} not found`);
  }

  // Create payment record
  const payment = await Payment.create({
    invoiceId: paymentData.invoiceId,
    customerId: paymentData.customerId,
    subscriptionId: paymentData.subscriptionId,
    paymentMethodId: paymentData.paymentMethodId,
    gateway: paymentData.gateway,
    status: PaymentStatus.PROCESSING,
    amount: paymentData.amount,
    currency: paymentData.currency || Currency.USD,
    transactionType: GatewayTransactionType.SALE,
    metadata: paymentData.metadata,
  }, { transaction });

  try {
    // Process payment through gateway
    const gatewayResult = await processGatewayPayment(
      paymentData.gateway,
      paymentMethod.get('gatewayPaymentMethodId') as string,
      paymentData.amount,
      paymentData.currency || Currency.USD,
    );

    // Update payment with gateway response
    await payment.update({
      status: gatewayResult.success ? PaymentStatus.SUCCESS : PaymentStatus.FAILED,
      gatewayTransactionId: gatewayResult.transactionId,
      capturedAmount: gatewayResult.success ? paymentData.amount : 0,
      feeAmount: gatewayResult.feeAmount,
      netAmount: gatewayResult.netAmount,
      processedAt: new Date(),
      failureCode: gatewayResult.failureCode,
      failureMessage: gatewayResult.failureMessage,
    }, { transaction });

    // Update invoice if payment successful
    if (gatewayResult.success && paymentData.invoiceId) {
      await updateInvoiceWithPayment(
        sequelize,
        paymentData.invoiceId,
        paymentData.amount,
        transaction,
      );
    }

    return payment.toJSON() as Payment;
  } catch (error) {
    await payment.update({
      status: PaymentStatus.FAILED,
      failureMessage: error.message,
      processedAt: new Date(),
    }, { transaction });

    throw error;
  }
}

/**
 * Authorize a payment (hold funds without capturing)
 *
 * @param sequelize - Sequelize instance
 * @param authorizationData - Authorization data
 * @param transaction - Optional database transaction
 * @returns Created payment record with authorized status
 */
export async function authorizePayment(
  sequelize: Sequelize,
  authorizationData: {
    invoiceId?: string;
    customerId: string;
    paymentMethodId: string;
    amount: number;
    currency?: Currency;
    gateway: PaymentGateway;
    metadata?: Record<string, any>;
  },
  transaction?: Transaction,
): Promise<Payment> {
  const Payment = sequelize.model('Payment');
  const PaymentMethod = sequelize.model('PaymentMethod');

  const paymentMethod = await PaymentMethod.findByPk(authorizationData.paymentMethodId, { transaction });
  if (!paymentMethod) {
    throw new NotFoundException(`Payment method ${authorizationData.paymentMethodId} not found`);
  }

  const payment = await Payment.create({
    invoiceId: authorizationData.invoiceId,
    customerId: authorizationData.customerId,
    paymentMethodId: authorizationData.paymentMethodId,
    gateway: authorizationData.gateway,
    status: PaymentStatus.PROCESSING,
    amount: authorizationData.amount,
    currency: authorizationData.currency || Currency.USD,
    transactionType: GatewayTransactionType.AUTHORIZE,
    metadata: authorizationData.metadata,
  }, { transaction });

  try {
    const gatewayResult = await authorizeGatewayPayment(
      authorizationData.gateway,
      paymentMethod.get('gatewayPaymentMethodId') as string,
      authorizationData.amount,
      authorizationData.currency || Currency.USD,
    );

    await payment.update({
      status: gatewayResult.success ? PaymentStatus.AUTHORIZED : PaymentStatus.FAILED,
      gatewayTransactionId: gatewayResult.transactionId,
      processedAt: new Date(),
      failureCode: gatewayResult.failureCode,
      failureMessage: gatewayResult.failureMessage,
    }, { transaction });

    return payment.toJSON() as Payment;
  } catch (error) {
    await payment.update({
      status: PaymentStatus.FAILED,
      failureMessage: error.message,
      processedAt: new Date(),
    }, { transaction });

    throw error;
  }
}

/**
 * Capture a previously authorized payment
 *
 * @param sequelize - Sequelize instance
 * @param paymentId - Payment ID to capture
 * @param amount - Amount to capture (can be less than authorized amount)
 * @param transaction - Optional database transaction
 * @returns Updated payment record
 */
export async function capturePayment(
  sequelize: Sequelize,
  paymentId: string,
  amount?: number,
  transaction?: Transaction,
): Promise<Payment> {
  const Payment = sequelize.model('Payment');

  const payment = await Payment.findByPk(paymentId, { transaction });
  if (!payment) {
    throw new NotFoundException(`Payment ${paymentId} not found`);
  }

  const status = payment.get('status') as PaymentStatus;
  if (status !== PaymentStatus.AUTHORIZED) {
    throw new BadRequestException(`Cannot capture payment with status ${status}`);
  }

  const authorizedAmount = new Decimal(payment.get('amount') as number);
  const captureAmount = amount ? new Decimal(amount) : authorizedAmount;

  if (captureAmount.greaterThan(authorizedAmount)) {
    throw new BadRequestException('Capture amount exceeds authorized amount');
  }

  try {
    const gatewayResult = await captureGatewayPayment(
      payment.get('gateway') as PaymentGateway,
      payment.get('gatewayTransactionId') as string,
      captureAmount.toNumber(),
    );

    const newStatus = captureAmount.equals(authorizedAmount)
      ? PaymentStatus.CAPTURED
      : PaymentStatus.PARTIALLY_CAPTURED;

    await payment.update({
      status: gatewayResult.success ? newStatus : PaymentStatus.FAILED,
      capturedAmount: captureAmount.toNumber(),
      feeAmount: gatewayResult.feeAmount,
      netAmount: gatewayResult.netAmount,
      processedAt: new Date(),
      failureCode: gatewayResult.failureCode,
      failureMessage: gatewayResult.failureMessage,
    }, { transaction });

    // Update invoice if applicable
    const invoiceId = payment.get('invoiceId');
    if (gatewayResult.success && invoiceId) {
      await updateInvoiceWithPayment(
        sequelize,
        invoiceId as string,
        captureAmount.toNumber(),
        transaction,
      );
    }

    return payment.toJSON() as Payment;
  } catch (error) {
    await payment.update({
      status: PaymentStatus.FAILED,
      failureMessage: error.message,
    }, { transaction });

    throw error;
  }
}

/**
 * Refund a payment (full or partial)
 *
 * @param sequelize - Sequelize instance
 * @param paymentId - Payment ID to refund
 * @param amount - Amount to refund (defaults to full payment amount)
 * @param reason - Reason for refund
 * @param transaction - Optional database transaction
 * @returns Updated payment record
 */
export async function refundPayment(
  sequelize: Sequelize,
  paymentId: string,
  amount?: number,
  reason?: string,
  transaction?: Transaction,
): Promise<Payment> {
  const Payment = sequelize.model('Payment');
  const Invoice = sequelize.model('Invoice');

  const payment = await Payment.findByPk(paymentId, { transaction });
  if (!payment) {
    throw new NotFoundException(`Payment ${paymentId} not found`);
  }

  const status = payment.get('status') as PaymentStatus;
  if (![PaymentStatus.SUCCESS, PaymentStatus.CAPTURED].includes(status)) {
    throw new BadRequestException(`Cannot refund payment with status ${status}`);
  }

  const capturedAmount = new Decimal(payment.get('capturedAmount') as number || payment.get('amount') as number);
  const alreadyRefunded = new Decimal(payment.get('refundedAmount') as number || 0);
  const refundAmount = amount ? new Decimal(amount) : capturedAmount.sub(alreadyRefunded);

  const maxRefundable = capturedAmount.sub(alreadyRefunded);
  if (refundAmount.greaterThan(maxRefundable)) {
    throw new BadRequestException(`Refund amount exceeds refundable amount of ${maxRefundable.toNumber()}`);
  }

  try {
    const gatewayResult = await refundGatewayPayment(
      payment.get('gateway') as PaymentGateway,
      payment.get('gatewayTransactionId') as string,
      refundAmount.toNumber(),
    );

    const totalRefunded = alreadyRefunded.add(refundAmount);
    const newStatus = totalRefunded.equals(capturedAmount)
      ? PaymentStatus.REFUNDED
      : PaymentStatus.PARTIALLY_REFUNDED;

    await payment.update({
      status: gatewayResult.success ? newStatus : payment.get('status'),
      refundedAmount: totalRefunded.toNumber(),
      metadata: {
        ...(payment.get('metadata') as any || {}),
        refundReason: reason,
        refundedAt: new Date().toISOString(),
      },
    }, { transaction });

    // Update invoice
    const invoiceId = payment.get('invoiceId');
    if (gatewayResult.success && invoiceId) {
      const invoice = await Invoice.findByPk(invoiceId, { transaction });
      if (invoice) {
        const currentAmountPaid = new Decimal(invoice.get('amountPaid') as number);
        const currentAmountDue = new Decimal(invoice.get('amountDue') as number);

        await invoice.update({
          amountPaid: currentAmountPaid.sub(refundAmount).toNumber(),
          amountDue: currentAmountDue.add(refundAmount).toNumber(),
          status: InvoiceStatus.PARTIALLY_PAID,
        }, { transaction });
      }
    }

    return payment.toJSON() as Payment;
  } catch (error) {
    throw new BadRequestException(`Refund failed: ${error.message}`);
  }
}

/**
 * Void a payment (cancel authorized or pending payment)
 *
 * @param sequelize - Sequelize instance
 * @param paymentId - Payment ID to void
 * @param reason - Reason for voiding
 * @param transaction - Optional database transaction
 * @returns Updated payment record
 */
export async function voidPayment(
  sequelize: Sequelize,
  paymentId: string,
  reason: string,
  transaction?: Transaction,
): Promise<Payment> {
  const Payment = sequelize.model('Payment');

  const payment = await Payment.findByPk(paymentId, { transaction });
  if (!payment) {
    throw new NotFoundException(`Payment ${paymentId} not found`);
  }

  const status = payment.get('status') as PaymentStatus;
  if (![PaymentStatus.AUTHORIZED, PaymentStatus.PENDING].includes(status)) {
    throw new BadRequestException(`Cannot void payment with status ${status}`);
  }

  try {
    const gatewayResult = await voidGatewayPayment(
      payment.get('gateway') as PaymentGateway,
      payment.get('gatewayTransactionId') as string,
    );

    await payment.update({
      status: gatewayResult.success ? PaymentStatus.VOIDED : payment.get('status'),
      metadata: {
        ...(payment.get('metadata') as any || {}),
        voidReason: reason,
        voidedAt: new Date().toISOString(),
      },
    }, { transaction });

    return payment.toJSON() as Payment;
  } catch (error) {
    throw new BadRequestException(`Void failed: ${error.message}`);
  }
}

// ============================================================================
// PAYMENT GATEWAY INTEGRATION
// ============================================================================

/**
 * Create and tokenize a payment method with gateway
 *
 * @param sequelize - Sequelize instance
 * @param paymentMethodData - Payment method data
 * @param transaction - Optional database transaction
 * @returns Created payment method record
 */
export async function tokenizePaymentMethod(
  sequelize: Sequelize,
  paymentMethodData: {
    customerId: string;
    gateway: PaymentGateway;
    type: PaymentMethod;
    cardNumber?: string;
    cardExpMonth?: number;
    cardExpYear?: number;
    cardCvv?: string;
    bankAccountNumber?: string;
    bankRoutingNumber?: string;
    billingDetails?: Record<string, any>;
    isDefault?: boolean;
    metadata?: Record<string, any>;
  },
  transaction?: Transaction,
): Promise<PaymentMethodRecord> {
  const PaymentMethod = sequelize.model('PaymentMethod');

  // Tokenize with gateway
  const tokenizationResult = await tokenizeWithGateway(
    paymentMethodData.gateway,
    paymentMethodData,
  );

  if (!tokenizationResult.success) {
    throw new BadRequestException(`Payment method tokenization failed: ${tokenizationResult.error}`);
  }

  // Create payment method record
  const paymentMethod = await PaymentMethod.create({
    customerId: paymentMethodData.customerId,
    gateway: paymentMethodData.gateway,
    gatewayCustomerId: tokenizationResult.customerId,
    gatewayPaymentMethodId: tokenizationResult.paymentMethodId,
    type: paymentMethodData.type,
    isDefault: paymentMethodData.isDefault || false,
    cardBrand: tokenizationResult.cardBrand,
    cardLast4: tokenizationResult.last4,
    cardExpMonth: paymentMethodData.cardExpMonth,
    cardExpYear: paymentMethodData.cardExpYear,
    bankName: tokenizationResult.bankName,
    bankLast4: tokenizationResult.last4,
    billingDetails: paymentMethodData.billingDetails,
    metadata: paymentMethodData.metadata,
  }, { transaction });

  // If set as default, unset other default payment methods
  if (paymentMethodData.isDefault) {
    await PaymentMethod.update(
      { isDefault: false },
      {
        where: {
          customerId: paymentMethodData.customerId,
          id: { [Op.ne]: paymentMethod.get('id') },
        },
        transaction,
      },
    );
  }

  return paymentMethod.toJSON() as PaymentMethodRecord;
}

/**
 * Delete a tokenized payment method
 *
 * @param sequelize - Sequelize instance
 * @param paymentMethodId - Payment method ID to delete
 * @param transaction - Optional database transaction
 */
export async function deletePaymentMethod(
  sequelize: Sequelize,
  paymentMethodId: string,
  transaction?: Transaction,
): Promise<void> {
  const PaymentMethod = sequelize.model('PaymentMethod');

  const paymentMethod = await PaymentMethod.findByPk(paymentMethodId, { transaction });
  if (!paymentMethod) {
    throw new NotFoundException(`Payment method ${paymentMethodId} not found`);
  }

  // Delete from gateway
  await deleteFromGateway(
    paymentMethod.get('gateway') as PaymentGateway,
    paymentMethod.get('gatewayPaymentMethodId') as string,
  );

  await paymentMethod.destroy({ transaction });
}

/**
 * Verify a payment method (micro-transactions or other verification)
 *
 * @param sequelize - Sequelize instance
 * @param paymentMethodId - Payment method ID to verify
 * @param verificationData - Verification data (amounts, codes, etc.)
 * @param transaction - Optional database transaction
 * @returns Verification result
 */
export async function verifyPaymentMethod(
  sequelize: Sequelize,
  paymentMethodId: string,
  verificationData: Record<string, any>,
  transaction?: Transaction,
): Promise<{ verified: boolean; message?: string }> {
  const PaymentMethod = sequelize.model('PaymentMethod');

  const paymentMethod = await PaymentMethod.findByPk(paymentMethodId, { transaction });
  if (!paymentMethod) {
    throw new NotFoundException(`Payment method ${paymentMethodId} not found`);
  }

  const verificationResult = await verifyWithGateway(
    paymentMethod.get('gateway') as PaymentGateway,
    paymentMethod.get('gatewayPaymentMethodId') as string,
    verificationData,
  );

  if (verificationResult.verified) {
    await paymentMethod.update({
      metadata: {
        ...(paymentMethod.get('metadata') as any || {}),
        verified: true,
        verifiedAt: new Date().toISOString(),
      },
    }, { transaction });
  }

  return verificationResult;
}

// ============================================================================
// RECURRING BILLING AND SUBSCRIPTIONS
// ============================================================================

/**
 * Create a new subscription
 *
 * @param sequelize - Sequelize instance
 * @param subscriptionData - Subscription creation data
 * @param transaction - Optional database transaction
 * @returns Created subscription
 */
export async function createSubscription(
  sequelize: Sequelize,
  subscriptionData: {
    customerId: string;
    planId: string;
    billingCycle: BillingCycle;
    paymentMethodId: string;
    startDate?: Date;
    trialDays?: number;
    quantity?: number;
    unitPrice: number;
    currency?: Currency;
    metadata?: Record<string, any>;
  },
  transaction?: Transaction,
): Promise<Subscription> {
  const Subscription = sequelize.model('Subscription');

  const startDate = subscriptionData.startDate || new Date();
  let trialStart = null;
  let trialEnd = null;
  let currentPeriodStart = startDate;

  if (subscriptionData.trialDays && subscriptionData.trialDays > 0) {
    trialStart = startDate;
    trialEnd = addDays(startDate, subscriptionData.trialDays);
    currentPeriodStart = trialEnd;
  }

  const currentPeriodEnd = calculateNextBillingDate(
    currentPeriodStart,
    subscriptionData.billingCycle,
  );

  const subscription = await Subscription.create({
    customerId: subscriptionData.customerId,
    planId: subscriptionData.planId,
    status: trialStart ? SubscriptionStatus.TRIAL : SubscriptionStatus.ACTIVE,
    billingCycle: subscriptionData.billingCycle,
    currentPeriodStart,
    currentPeriodEnd,
    trialStart,
    trialEnd,
    paymentMethodId: subscriptionData.paymentMethodId,
    quantity: subscriptionData.quantity || 1,
    unitPrice: subscriptionData.unitPrice,
    currency: subscriptionData.currency || Currency.USD,
    cancelAtPeriodEnd: false,
    metadata: subscriptionData.metadata,
  }, { transaction });

  return subscription.toJSON() as Subscription;
}

/**
 * Process recurring billing for a subscription
 *
 * @param sequelize - Sequelize instance
 * @param subscriptionId - Subscription ID
 * @param billingDate - Date to process billing for
 * @param transaction - Optional database transaction
 * @returns Created invoice and payment result
 */
export async function processRecurringBilling(
  sequelize: Sequelize,
  subscriptionId: string,
  billingDate: Date,
  transaction?: Transaction,
): Promise<{ invoice: Invoice; payment?: Payment }> {
  const Subscription = sequelize.model('Subscription');

  const subscription = await Subscription.findByPk(subscriptionId, { transaction });
  if (!subscription) {
    throw new NotFoundException(`Subscription ${subscriptionId} not found`);
  }

  const status = subscription.get('status') as SubscriptionStatus;
  if (![SubscriptionStatus.ACTIVE, SubscriptionStatus.TRIAL].includes(status)) {
    throw new BadRequestException(`Cannot process billing for subscription with status ${status}`);
  }

  // Check if billing date is in current period
  const currentPeriodEnd = subscription.get('currentPeriodEnd') as Date;
  if (isBefore(billingDate, currentPeriodEnd)) {
    throw new BadRequestException('Billing date is before current period end');
  }

  // Generate invoice for subscription
  const quantity = subscription.get('quantity') as number;
  const unitPrice = subscription.get('unitPrice') as number;
  const amount = new Decimal(unitPrice).mul(quantity).toNumber();

  const invoice = await generateInvoice(
    sequelize,
    {
      customerId: subscription.get('customerId') as string,
      subscriptionId: subscription.get('id') as string,
      items: [
        {
          description: `Subscription - Period ${currentPeriodEnd.toISOString().split('T')[0]}`,
          quantity,
          unitPrice,
        },
      ],
      currency: subscription.get('currency') as Currency,
      dueDate: currentPeriodEnd,
      issueDate: billingDate,
    },
    transaction,
  );

  // Update invoice status to open
  await updateInvoice(sequelize, invoice.id, { status: InvoiceStatus.OPEN }, transaction);

  // Attempt payment
  let payment: Payment | undefined;
  try {
    payment = await processPayment(
      sequelize,
      {
        invoiceId: invoice.id,
        customerId: subscription.get('customerId') as string,
        subscriptionId: subscription.get('id') as string,
        paymentMethodId: subscription.get('paymentMethodId') as string,
        amount: invoice.total,
        currency: invoice.currency,
        gateway: PaymentGateway.STRIPE, // Default gateway
      },
      transaction,
    );

    // Update subscription period if payment successful
    if (payment.status === PaymentStatus.SUCCESS) {
      const nextPeriodStart = currentPeriodEnd;
      const nextPeriodEnd = calculateNextBillingDate(
        nextPeriodStart,
        subscription.get('billingCycle') as BillingCycle,
      );

      await subscription.update({
        currentPeriodStart: nextPeriodStart,
        currentPeriodEnd: nextPeriodEnd,
        status: SubscriptionStatus.ACTIVE,
      }, { transaction });
    } else {
      // Payment failed - update subscription status
      await subscription.update({
        status: SubscriptionStatus.PAST_DUE,
      }, { transaction });

      // Create dunning workflow
      await createDunningWorkflow(
        sequelize,
        {
          customerId: subscription.get('customerId') as string,
          subscriptionId: subscription.get('id') as string,
          invoiceId: invoice.id,
        },
        transaction,
      );
    }
  } catch (error) {
    // Payment processing failed
    await subscription.update({
      status: SubscriptionStatus.PAST_DUE,
    }, { transaction });

    await createDunningWorkflow(
      sequelize,
      {
        customerId: subscription.get('customerId') as string,
        subscriptionId: subscription.get('id') as string,
        invoiceId: invoice.id,
      },
      transaction,
    );
  }

  return { invoice, payment };
}

/**
 * Cancel a subscription
 *
 * @param sequelize - Sequelize instance
 * @param subscriptionId - Subscription ID to cancel
 * @param cancelAtPeriodEnd - Whether to cancel immediately or at period end
 * @param transaction - Optional database transaction
 * @returns Updated subscription
 */
export async function cancelSubscription(
  sequelize: Sequelize,
  subscriptionId: string,
  cancelAtPeriodEnd: boolean = true,
  transaction?: Transaction,
): Promise<Subscription> {
  const Subscription = sequelize.model('Subscription');

  const subscription = await Subscription.findByPk(subscriptionId, { transaction });
  if (!subscription) {
    throw new NotFoundException(`Subscription ${subscriptionId} not found`);
  }

  const updates: any = {
    cancelledAt: new Date(),
    cancelAtPeriodEnd,
  };

  if (!cancelAtPeriodEnd) {
    updates.status = SubscriptionStatus.CANCELLED;
  } else {
    updates.status = SubscriptionStatus.PENDING_CANCELLATION;
  }

  await subscription.update(updates, { transaction });

  return subscription.toJSON() as Subscription;
}

/**
 * Upgrade or downgrade a subscription (with proration)
 *
 * @param sequelize - Sequelize instance
 * @param subscriptionId - Subscription ID
 * @param newPlanData - New plan data
 * @param transaction - Optional database transaction
 * @returns Updated subscription and proration invoice
 */
export async function changeSubscriptionPlan(
  sequelize: Sequelize,
  subscriptionId: string,
  newPlanData: {
    planId: string;
    unitPrice: number;
    quantity?: number;
  },
  transaction?: Transaction,
): Promise<{ subscription: Subscription; prorationInvoice?: Invoice }> {
  const Subscription = sequelize.model('Subscription');

  const subscription = await Subscription.findByPk(subscriptionId, { transaction });
  if (!subscription) {
    throw new NotFoundException(`Subscription ${subscriptionId} not found`);
  }

  const currentPeriodStart = subscription.get('currentPeriodStart') as Date;
  const currentPeriodEnd = subscription.get('currentPeriodEnd') as Date;
  const currentUnitPrice = new Decimal(subscription.get('unitPrice') as number);
  const currentQuantity = subscription.get('quantity') as number;
  const newUnitPrice = new Decimal(newPlanData.unitPrice);
  const newQuantity = newPlanData.quantity || currentQuantity;

  // Calculate proration
  const totalPeriodDays = differenceInDays(currentPeriodEnd, currentPeriodStart);
  const remainingDays = differenceInDays(currentPeriodEnd, new Date());
  const prorationFactor = new Decimal(remainingDays).div(totalPeriodDays);

  const currentPeriodValue = currentUnitPrice.mul(currentQuantity).mul(prorationFactor);
  const newPeriodValue = newUnitPrice.mul(newQuantity).mul(prorationFactor);
  const prorationAmount = newPeriodValue.sub(currentPeriodValue);

  let prorationInvoice: Invoice | undefined;

  // Create proration invoice if amount is positive (upgrade)
  if (prorationAmount.greaterThan(0)) {
    prorationInvoice = await generateInvoice(
      sequelize,
      {
        customerId: subscription.get('customerId') as string,
        subscriptionId: subscription.get('id') as string,
        items: [
          {
            description: 'Plan change proration',
            quantity: 1,
            unitPrice: prorationAmount.toNumber(),
          },
        ],
        currency: subscription.get('currency') as Currency,
        dueDate: new Date(),
      },
      transaction,
    );

    // Process proration payment
    await processPayment(
      sequelize,
      {
        invoiceId: prorationInvoice.id,
        customerId: subscription.get('customerId') as string,
        subscriptionId: subscription.get('id') as string,
        paymentMethodId: subscription.get('paymentMethodId') as string,
        amount: prorationInvoice.total,
        currency: prorationInvoice.currency,
        gateway: PaymentGateway.STRIPE,
      },
      transaction,
    );
  } else if (prorationAmount.lessThan(0)) {
    // Create credit memo for downgrade
    await createCreditMemo(
      sequelize,
      {
        customerId: subscription.get('customerId') as string,
        type: CreditMemoType.CREDIT_NOTE,
        amount: prorationAmount.abs().toNumber(),
        currency: subscription.get('currency') as Currency,
        reason: 'Plan downgrade proration credit',
      },
      transaction,
    );
  }

  // Update subscription
  await subscription.update({
    planId: newPlanData.planId,
    unitPrice: newPlanData.unitPrice,
    quantity: newQuantity,
  }, { transaction });

  return {
    subscription: subscription.toJSON() as Subscription,
    prorationInvoice,
  };
}

/**
 * Pause a subscription (stop billing without cancelling)
 *
 * @param sequelize - Sequelize instance
 * @param subscriptionId - Subscription ID to pause
 * @param transaction - Optional database transaction
 * @returns Updated subscription
 */
export async function pauseSubscription(
  sequelize: Sequelize,
  subscriptionId: string,
  transaction?: Transaction,
): Promise<Subscription> {
  const Subscription = sequelize.model('Subscription');

  const subscription = await Subscription.findByPk(subscriptionId, { transaction });
  if (!subscription) {
    throw new NotFoundException(`Subscription ${subscriptionId} not found`);
  }

  await subscription.update({
    status: SubscriptionStatus.PAUSED,
    metadata: {
      ...(subscription.get('metadata') as any || {}),
      pausedAt: new Date().toISOString(),
    },
  }, { transaction });

  return subscription.toJSON() as Subscription;
}

/**
 * Resume a paused subscription
 *
 * @param sequelize - Sequelize instance
 * @param subscriptionId - Subscription ID to resume
 * @param transaction - Optional database transaction
 * @returns Updated subscription
 */
export async function resumeSubscription(
  sequelize: Sequelize,
  subscriptionId: string,
  transaction?: Transaction,
): Promise<Subscription> {
  const Subscription = sequelize.model('Subscription');

  const subscription = await Subscription.findByPk(subscriptionId, { transaction });
  if (!subscription) {
    throw new NotFoundException(`Subscription ${subscriptionId} not found`);
  }

  const status = subscription.get('status') as SubscriptionStatus;
  if (status !== SubscriptionStatus.PAUSED) {
    throw new BadRequestException(`Cannot resume subscription with status ${status}`);
  }

  await subscription.update({
    status: SubscriptionStatus.ACTIVE,
    metadata: {
      ...(subscription.get('metadata') as any || {}),
      resumedAt: new Date().toISOString(),
    },
  }, { transaction });

  return subscription.toJSON() as Subscription;
}

// ============================================================================
// PAYMENT PLANS AND INSTALLMENTS
// ============================================================================

/**
 * Create a payment plan with installments
 *
 * @param sequelize - Sequelize instance
 * @param planData - Payment plan data
 * @param transaction - Optional database transaction
 * @returns Created payment plan with installments
 */
export async function createPaymentPlan(
  sequelize: Sequelize,
  planData: {
    customerId: string;
    invoiceId?: string;
    totalAmount: number;
    currency?: Currency;
    installments: number;
    frequency: InstallmentFrequency;
    startDate?: Date;
    paymentMethodId: string;
    metadata?: Record<string, any>;
  },
  transaction?: Transaction,
): Promise<PaymentPlan> {
  const PaymentPlan = sequelize.model('PaymentPlan');
  const Installment = sequelize.model('Installment');

  if (planData.installments < 2) {
    throw new BadRequestException('Payment plan must have at least 2 installments');
  }

  const totalAmount = new Decimal(planData.totalAmount);
  const installmentAmount = totalAmount.div(planData.installments);
  const startDate = planData.startDate || new Date();

  const paymentPlan = await PaymentPlan.create({
    customerId: planData.customerId,
    invoiceId: planData.invoiceId,
    totalAmount: planData.totalAmount,
    currency: planData.currency || Currency.USD,
    installments: planData.installments,
    installmentAmount: installmentAmount.toNumber(),
    frequency: planData.frequency,
    startDate,
    nextPaymentDate: startDate,
    status: 'active',
    paidInstallments: 0,
    remainingAmount: planData.totalAmount,
    paymentMethodId: planData.paymentMethodId,
    metadata: planData.metadata,
  }, { transaction });

  // Create installment records
  let currentDueDate = startDate;
  for (let i = 1; i <= planData.installments; i++) {
    const isLastInstallment = i === planData.installments;
    const amount = isLastInstallment
      ? totalAmount.sub(installmentAmount.mul(planData.installments - 1)).toNumber()
      : installmentAmount.toNumber();

    await Installment.create({
      paymentPlanId: paymentPlan.get('id'),
      installmentNumber: i,
      amount,
      dueDate: currentDueDate,
      status: PaymentStatus.PENDING,
    }, { transaction });

    currentDueDate = calculateNextInstallmentDate(currentDueDate, planData.frequency);
  }

  return paymentPlan.toJSON() as PaymentPlan;
}

/**
 * Process an installment payment
 *
 * @param sequelize - Sequelize instance
 * @param paymentPlanId - Payment plan ID
 * @param installmentNumber - Installment number to process
 * @param transaction - Optional database transaction
 * @returns Payment result
 */
export async function processInstallmentPayment(
  sequelize: Sequelize,
  paymentPlanId: string,
  installmentNumber: number,
  transaction?: Transaction,
): Promise<{ installment: Installment; payment: Payment }> {
  const PaymentPlan = sequelize.model('PaymentPlan');
  const Installment = sequelize.model('Installment');

  const paymentPlan = await PaymentPlan.findByPk(paymentPlanId, { transaction });
  if (!paymentPlan) {
    throw new NotFoundException(`Payment plan ${paymentPlanId} not found`);
  }

  const installment = await Installment.findOne({
    where: {
      paymentPlanId,
      installmentNumber,
    },
    transaction,
  });

  if (!installment) {
    throw new NotFoundException(`Installment ${installmentNumber} not found`);
  }

  const status = installment.get('status') as PaymentStatus;
  if (status === PaymentStatus.SUCCESS) {
    throw new BadRequestException('Installment already paid');
  }

  // Process payment
  const payment = await processPayment(
    sequelize,
    {
      customerId: paymentPlan.get('customerId') as string,
      paymentMethodId: paymentPlan.get('paymentMethodId') as string,
      amount: installment.get('amount') as number,
      currency: paymentPlan.get('currency') as Currency,
      gateway: PaymentGateway.STRIPE,
      metadata: {
        paymentPlanId,
        installmentNumber,
      },
    },
    transaction,
  );

  if (payment.status === PaymentStatus.SUCCESS) {
    await installment.update({
      status: PaymentStatus.SUCCESS,
      paymentId: payment.id,
      paidAt: new Date(),
    }, { transaction });

    const paidInstallments = (paymentPlan.get('paidInstallments') as number) + 1;
    const remainingAmount = new Decimal(paymentPlan.get('remainingAmount') as number)
      .sub(installment.get('amount') as number);

    const nextInstallment = await Installment.findOne({
      where: {
        paymentPlanId,
        installmentNumber: installmentNumber + 1,
      },
      transaction,
    });

    await paymentPlan.update({
      paidInstallments,
      remainingAmount: remainingAmount.toNumber(),
      nextPaymentDate: nextInstallment ? nextInstallment.get('dueDate') : null,
      status: paidInstallments === paymentPlan.get('installments') ? 'completed' : 'active',
    }, { transaction });
  }

  return {
    installment: installment.toJSON() as Installment,
    payment,
  };
}

/**
 * Get upcoming installments for a payment plan
 *
 * @param sequelize - Sequelize instance
 * @param paymentPlanId - Payment plan ID
 * @param limit - Maximum number of installments to return
 * @returns Upcoming installments
 */
export async function getUpcomingInstallments(
  sequelize: Sequelize,
  paymentPlanId: string,
  limit: number = 5,
): Promise<Installment[]> {
  const Installment = sequelize.model('Installment');

  const installments = await Installment.findAll({
    where: {
      paymentPlanId,
      status: PaymentStatus.PENDING,
    },
    order: [['dueDate', 'ASC']],
    limit,
  });

  return installments.map(i => i.toJSON() as Installment);
}

// ============================================================================
// LATE FEE CALCULATIONS
// ============================================================================

/**
 * Calculate late fees for overdue invoices
 *
 * @param sequelize - Sequelize instance
 * @param invoiceId - Invoice ID
 * @param lateFeeConfig - Late fee configuration
 * @param transaction - Optional database transaction
 * @returns Calculated late fee amount
 */
export async function calculateLateFee(
  sequelize: Sequelize,
  invoiceId: string,
  lateFeeConfig: {
    flatFee?: number;
    percentageFee?: number;
    gracePeriodDays?: number;
    maxFee?: number;
  },
  transaction?: Transaction,
): Promise<number> {
  const Invoice = sequelize.model('Invoice');

  const invoice = await Invoice.findByPk(invoiceId, { transaction });
  if (!invoice) {
    throw new NotFoundException(`Invoice ${invoiceId} not found`);
  }

  const dueDate = invoice.get('dueDate') as Date;
  const amountDue = new Decimal(invoice.get('amountDue') as number);
  const gracePeriodDays = lateFeeConfig.gracePeriodDays || 0;
  const graceDate = addDays(dueDate, gracePeriodDays);

  // No late fee if within grace period or invoice is paid
  if (isBefore(new Date(), graceDate) || amountDue.isZero()) {
    return 0;
  }

  const daysOverdue = differenceInDays(new Date(), graceDate);
  let lateFee = new Decimal(0);

  // Calculate flat fee
  if (lateFeeConfig.flatFee) {
    lateFee = lateFee.add(lateFeeConfig.flatFee);
  }

  // Calculate percentage fee
  if (lateFeeConfig.percentageFee) {
    const percentageFee = amountDue.mul(lateFeeConfig.percentageFee).div(100);
    lateFee = lateFee.add(percentageFee);
  }

  // Apply max fee cap
  if (lateFeeConfig.maxFee) {
    lateFee = Decimal.min(lateFee, lateFeeConfig.maxFee);
  }

  return lateFee.toNumber();
}

/**
 * Apply late fee to an invoice
 *
 * @param sequelize - Sequelize instance
 * @param invoiceId - Invoice ID
 * @param lateFeeAmount - Late fee amount to apply
 * @param transaction - Optional database transaction
 * @returns Updated invoice
 */
export async function applyLateFeeToInvoice(
  sequelize: Sequelize,
  invoiceId: string,
  lateFeeAmount: number,
  transaction?: Transaction,
): Promise<Invoice> {
  const Invoice = sequelize.model('Invoice');
  const InvoiceItem = sequelize.model('InvoiceItem');

  const invoice = await Invoice.findByPk(invoiceId, { transaction });
  if (!invoice) {
    throw new NotFoundException(`Invoice ${invoiceId} not found`);
  }

  // Add late fee as invoice item
  await InvoiceItem.create({
    invoiceId,
    description: 'Late Payment Fee',
    quantity: 1,
    unitPrice: lateFeeAmount,
    amount: lateFeeAmount,
  }, { transaction });

  // Update invoice totals
  const currentTotal = new Decimal(invoice.get('total') as number);
  const currentAmountDue = new Decimal(invoice.get('amountDue') as number);

  await invoice.update({
    total: currentTotal.add(lateFeeAmount).toNumber(),
    amountDue: currentAmountDue.add(lateFeeAmount).toNumber(),
    metadata: {
      ...(invoice.get('metadata') as any || {}),
      lateFeeApplied: true,
      lateFeeAmount,
      lateFeeAppliedAt: new Date().toISOString(),
    },
  }, { transaction });

  return invoice.toJSON() as Invoice;
}

/**
 * Process late fees for all overdue invoices
 *
 * @param sequelize - Sequelize instance
 * @param lateFeeConfig - Late fee configuration
 * @param transaction - Optional database transaction
 * @returns Summary of late fees applied
 */
export async function processOverdueInvoiceLateFees(
  sequelize: Sequelize,
  lateFeeConfig: {
    flatFee?: number;
    percentageFee?: number;
    gracePeriodDays?: number;
    maxFee?: number;
  },
  transaction?: Transaction,
): Promise<{ processedCount: number; totalFeesApplied: number }> {
  const Invoice = sequelize.model('Invoice');

  const gracePeriodDays = lateFeeConfig.gracePeriodDays || 0;
  const graceEndDate = addDays(new Date(), -gracePeriodDays);

  const overdueInvoices = await Invoice.findAll({
    where: {
      status: {
        [Op.in]: [InvoiceStatus.OPEN, InvoiceStatus.SENT, InvoiceStatus.OVERDUE],
      },
      dueDate: {
        [Op.lt]: graceEndDate,
      },
      amountDue: {
        [Op.gt]: 0,
      },
      [Op.or]: [
        { 'metadata.lateFeeApplied': { [Op.is]: null } },
        { 'metadata.lateFeeApplied': false },
      ],
    },
    transaction,
  });

  let processedCount = 0;
  let totalFeesApplied = new Decimal(0);

  for (const invoice of overdueInvoices) {
    const lateFee = await calculateLateFee(
      sequelize,
      invoice.get('id') as string,
      lateFeeConfig,
      transaction,
    );

    if (lateFee > 0) {
      await applyLateFeeToInvoice(
        sequelize,
        invoice.get('id') as string,
        lateFee,
        transaction,
      );

      processedCount++;
      totalFeesApplied = totalFeesApplied.add(lateFee);
    }
  }

  return {
    processedCount,
    totalFeesApplied: totalFeesApplied.toNumber(),
  };
}

// ============================================================================
// PAYMENT RECONCILIATION
// ============================================================================

/**
 * Reconcile payments for a specific date and gateway
 *
 * @param sequelize - Sequelize instance
 * @param reconciliationData - Reconciliation parameters
 * @param transaction - Optional database transaction
 * @returns Reconciliation result
 */
export async function reconcilePayments(
  sequelize: Sequelize,
  reconciliationData: {
    reconciliationDate: Date;
    gateway: PaymentGateway;
    expectedAmount: number;
    actualAmount: number;
    reconciledBy: string;
    notes?: string;
    metadata?: Record<string, any>;
  },
  transaction?: Transaction,
): Promise<PaymentReconciliation> {
  const PaymentReconciliation = sequelize.model('PaymentReconciliation');
  const Payment = sequelize.model('Payment');

  // Count transactions for the date
  const startOfDate = startOfDay(reconciliationData.reconciliationDate);
  const endOfDate = endOfDay(reconciliationData.reconciliationDate);

  const transactionCount = await Payment.count({
    where: {
      gateway: reconciliationData.gateway,
      status: PaymentStatus.SUCCESS,
      processedAt: {
        [Op.between]: [startOfDate, endOfDate],
      },
    },
    transaction,
  });

  const variance = new Decimal(reconciliationData.actualAmount)
    .sub(reconciliationData.expectedAmount);

  const reconciliation = await PaymentReconciliation.create({
    reconciliationDate: reconciliationData.reconciliationDate,
    gateway: reconciliationData.gateway,
    expectedAmount: reconciliationData.expectedAmount,
    actualAmount: reconciliationData.actualAmount,
    variance: variance.toNumber(),
    transactionCount,
    reconciledBy: reconciliationData.reconciledBy,
    status: variance.isZero() ? 'balanced' : 'variance',
    notes: reconciliationData.notes,
    metadata: reconciliationData.metadata,
  }, { transaction });

  return reconciliation.toJSON() as PaymentReconciliation;
}

/**
 * Get payment settlement report for a date range
 *
 * @param sequelize - Sequelize instance
 * @param startDate - Start date
 * @param endDate - End date
 * @param gateway - Optional gateway filter
 * @returns Settlement report
 */
export async function getPaymentSettlementReport(
  sequelize: Sequelize,
  startDate: Date,
  endDate: Date,
  gateway?: PaymentGateway,
): Promise<{
  totalPayments: number;
  successfulPayments: number;
  totalAmount: number;
  totalFees: number;
  netAmount: number;
  byGateway: Record<string, any>;
}> {
  const Payment = sequelize.model('Payment');

  const whereClause: any = {
    processedAt: {
      [Op.between]: [startDate, endDate],
    },
  };

  if (gateway) {
    whereClause.gateway = gateway;
  }

  const payments = await Payment.findAll({
    where: whereClause,
    attributes: [
      'gateway',
      'status',
      [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      [sequelize.fn('SUM', sequelize.col('amount')), 'totalAmount'],
      [sequelize.fn('SUM', sequelize.col('feeAmount')), 'totalFees'],
      [sequelize.fn('SUM', sequelize.col('netAmount')), 'netAmount'],
    ],
    group: ['gateway', 'status'],
    raw: true,
  });

  const report: any = {
    totalPayments: 0,
    successfulPayments: 0,
    totalAmount: 0,
    totalFees: 0,
    netAmount: 0,
    byGateway: {},
  };

  for (const payment of payments as any[]) {
    const count = parseInt(payment.count);
    const amount = parseFloat(payment.totalAmount || 0);
    const fees = parseFloat(payment.totalFees || 0);
    const net = parseFloat(payment.netAmount || 0);

    report.totalPayments += count;

    if (payment.status === PaymentStatus.SUCCESS) {
      report.successfulPayments += count;
      report.totalAmount += amount;
      report.totalFees += fees;
      report.netAmount += net;
    }

    if (!report.byGateway[payment.gateway]) {
      report.byGateway[payment.gateway] = {
        totalPayments: 0,
        successfulPayments: 0,
        totalAmount: 0,
        totalFees: 0,
        netAmount: 0,
      };
    }

    report.byGateway[payment.gateway].totalPayments += count;

    if (payment.status === PaymentStatus.SUCCESS) {
      report.byGateway[payment.gateway].successfulPayments += count;
      report.byGateway[payment.gateway].totalAmount += amount;
      report.byGateway[payment.gateway].totalFees += fees;
      report.byGateway[payment.gateway].netAmount += net;
    }
  }

  return report;
}

// ============================================================================
// DUNNING WORKFLOWS
// ============================================================================

/**
 * Create a dunning workflow for a failed payment
 *
 * @param sequelize - Sequelize instance
 * @param dunningData - Dunning workflow data
 * @param transaction - Optional database transaction
 * @returns Created dunning workflow
 */
export async function createDunningWorkflow(
  sequelize: Sequelize,
  dunningData: {
    customerId: string;
    subscriptionId?: string;
    invoiceId: string;
    metadata?: Record<string, any>;
  },
  transaction?: Transaction,
): Promise<DunningWorkflow> {
  const DunningWorkflow = sequelize.model('DunningWorkflow');

  const dunning = await DunningWorkflow.create({
    customerId: dunningData.customerId,
    subscriptionId: dunningData.subscriptionId,
    invoiceId: dunningData.invoiceId,
    stage: DunningStage.INITIAL,
    attemptCount: 0,
    status: 'active',
    nextAttemptDate: addDays(new Date(), 3), // First retry in 3 days
    metadata: dunningData.metadata,
  }, { transaction });

  return dunning.toJSON() as DunningWorkflow;
}

/**
 * Process dunning workflow stage
 *
 * @param sequelize - Sequelize instance
 * @param dunningId - Dunning workflow ID
 * @param transaction - Optional database transaction
 * @returns Updated dunning workflow and payment result
 */
export async function processDunningStage(
  sequelize: Sequelize,
  dunningId: string,
  transaction?: Transaction,
): Promise<{ dunning: DunningWorkflow; payment?: Payment }> {
  const DunningWorkflow = sequelize.model('DunningWorkflow');
  const Invoice = sequelize.model('Invoice');
  const Subscription = sequelize.model('Subscription');

  const dunning = await DunningWorkflow.findByPk(dunningId, { transaction });
  if (!dunning) {
    throw new NotFoundException(`Dunning workflow ${dunningId} not found`);
  }

  const invoice = await Invoice.findByPk(dunning.get('invoiceId') as string, { transaction });
  if (!invoice) {
    throw new NotFoundException(`Invoice not found`);
  }

  // Attempt payment retry
  let payment: Payment | undefined;
  let paymentSuccess = false;

  try {
    const subscription = dunning.get('subscriptionId')
      ? await Subscription.findByPk(dunning.get('subscriptionId') as string, { transaction })
      : null;

    if (subscription) {
      payment = await processPayment(
        sequelize,
        {
          invoiceId: invoice.get('id') as string,
          customerId: dunning.get('customerId') as string,
          subscriptionId: subscription.get('id') as string,
          paymentMethodId: subscription.get('paymentMethodId') as string,
          amount: invoice.get('amountDue') as number,
          currency: invoice.get('currency') as Currency,
          gateway: PaymentGateway.STRIPE,
          metadata: {
            dunningWorkflowId: dunning.get('id'),
            dunningStage: dunning.get('stage'),
          },
        },
        transaction,
      );

      paymentSuccess = payment.status === PaymentStatus.SUCCESS;
    }
  } catch (error) {
    // Payment failed, continue dunning process
  }

  const attemptCount = (dunning.get('attemptCount') as number) + 1;

  if (paymentSuccess) {
    // Payment successful, resolve dunning
    await dunning.update({
      stage: DunningStage.RESOLVED,
      status: 'resolved',
      attemptCount,
      lastAttemptDate: new Date(),
    }, { transaction });
  } else {
    // Payment failed, move to next stage
    const currentStage = dunning.get('stage') as DunningStage;
    const nextStage = getNextDunningStage(currentStage);
    const nextAttemptDate = calculateNextDunningAttempt(nextStage, attemptCount);

    const updates: any = {
      stage: nextStage,
      attemptCount,
      lastAttemptDate: new Date(),
      nextAttemptDate,
    };

    // Suspend subscription if in collection stage
    if (nextStage === DunningStage.COLLECTION) {
      const subscription = dunning.get('subscriptionId')
        ? await Subscription.findByPk(dunning.get('subscriptionId') as string, { transaction })
        : null;

      if (subscription) {
        await subscription.update({
          status: SubscriptionStatus.SUSPENDED,
        }, { transaction });
      }

      updates.status = 'suspended';
    }

    await dunning.update(updates, { transaction });
  }

  return {
    dunning: dunning.toJSON() as DunningWorkflow,
    payment,
  };
}

/**
 * Get active dunning workflows
 *
 * @param sequelize - Sequelize instance
 * @param filters - Optional filters
 * @returns Active dunning workflows
 */
export async function getActiveDunningWorkflows(
  sequelize: Sequelize,
  filters?: {
    customerId?: string;
    stage?: DunningStage;
    dueForRetry?: boolean;
  },
): Promise<DunningWorkflow[]> {
  const DunningWorkflow = sequelize.model('DunningWorkflow');

  const whereClause: any = {
    status: 'active',
  };

  if (filters?.customerId) {
    whereClause.customerId = filters.customerId;
  }

  if (filters?.stage) {
    whereClause.stage = filters.stage;
  }

  if (filters?.dueForRetry) {
    whereClause.nextAttemptDate = {
      [Op.lte]: new Date(),
    };
  }

  const dunningWorkflows = await DunningWorkflow.findAll({
    where: whereClause,
    order: [['nextAttemptDate', 'ASC']],
  });

  return dunningWorkflows.map(d => d.toJSON() as DunningWorkflow);
}

// ============================================================================
// PAYMENT RETRY LOGIC
// ============================================================================

/**
 * Configure payment retry strategy for a customer
 *
 * @param sequelize - Sequelize instance
 * @param retryConfig - Retry configuration
 * @param transaction - Optional database transaction
 * @returns Created retry configuration
 */
export async function configurePaymentRetryStrategy(
  sequelize: Sequelize,
  retryConfig: {
    customerId?: string;
    strategy: RetryStrategy;
    maxAttempts: number;
    retryIntervals: number[];
    enabled?: boolean;
    metadata?: Record<string, any>;
  },
  transaction?: Transaction,
): Promise<PaymentRetryConfig> {
  const PaymentRetryConfig = sequelize.model('PaymentRetryConfig');

  const config = await PaymentRetryConfig.create({
    customerId: retryConfig.customerId,
    strategy: retryConfig.strategy,
    maxAttempts: retryConfig.maxAttempts,
    retryIntervals: retryConfig.retryIntervals,
    enabled: retryConfig.enabled !== false,
    stopOnSuccess: true,
    metadata: retryConfig.metadata,
  }, { transaction });

  return config.toJSON() as PaymentRetryConfig;
}

/**
 * Retry a failed payment with intelligent timing
 *
 * @param sequelize - Sequelize instance
 * @param paymentId - Failed payment ID
 * @param retryAttempt - Retry attempt number
 * @param transaction - Optional database transaction
 * @returns New payment attempt
 */
export async function retryFailedPayment(
  sequelize: Sequelize,
  paymentId: string,
  retryAttempt: number,
  transaction?: Transaction,
): Promise<Payment> {
  const Payment = sequelize.model('Payment');
  const PaymentRetryConfig = sequelize.model('PaymentRetryConfig');

  const originalPayment = await Payment.findByPk(paymentId, { transaction });
  if (!originalPayment) {
    throw new NotFoundException(`Payment ${paymentId} not found`);
  }

  const status = originalPayment.get('status') as PaymentStatus;
  if (status !== PaymentStatus.FAILED) {
    throw new BadRequestException(`Cannot retry payment with status ${status}`);
  }

  // Get retry configuration
  const retryConfig = await PaymentRetryConfig.findOne({
    where: {
      [Op.or]: [
        { customerId: originalPayment.get('customerId') },
        { customerId: { [Op.is]: null } }, // Default config
      ],
      enabled: true,
    },
    order: [['customerId', 'DESC NULLS LAST']], // Prefer customer-specific config
    transaction,
  });

  if (!retryConfig) {
    throw new BadRequestException('No retry configuration found');
  }

  const maxAttempts = retryConfig.get('maxAttempts') as number;
  if (retryAttempt > maxAttempts) {
    throw new BadRequestException(`Maximum retry attempts (${maxAttempts}) exceeded`);
  }

  // Process new payment attempt
  const newPayment = await processPayment(
    sequelize,
    {
      invoiceId: originalPayment.get('invoiceId') as string,
      customerId: originalPayment.get('customerId') as string,
      subscriptionId: originalPayment.get('subscriptionId') as string,
      paymentMethodId: originalPayment.get('paymentMethodId') as string,
      amount: originalPayment.get('amount') as number,
      currency: originalPayment.get('currency') as Currency,
      gateway: originalPayment.get('gateway') as PaymentGateway,
      metadata: {
        ...(originalPayment.get('metadata') as any || {}),
        retryAttempt,
        originalPaymentId: paymentId,
      },
    },
    transaction,
  );

  return newPayment;
}

/**
 * Calculate next retry time based on strategy
 *
 * @param strategy - Retry strategy
 * @param attemptNumber - Current attempt number
 * @param baseInterval - Base interval in hours
 * @returns Next retry date
 */
export function calculateNextRetryTime(
  strategy: RetryStrategy,
  attemptNumber: number,
  baseInterval: number = 24,
): Date {
  let hoursToAdd: number;

  switch (strategy) {
    case RetryStrategy.LINEAR:
      hoursToAdd = baseInterval * attemptNumber;
      break;
    case RetryStrategy.EXPONENTIAL:
      hoursToAdd = baseInterval * Math.pow(2, attemptNumber - 1);
      break;
    case RetryStrategy.SMART:
      // Smart strategy: 3 days, 5 days, 7 days, then weekly
      const smartIntervals = [72, 120, 168, 168];
      hoursToAdd = smartIntervals[Math.min(attemptNumber - 1, smartIntervals.length - 1)];
      break;
    default:
      hoursToAdd = baseInterval;
  }

  return addDays(new Date(), hoursToAdd / 24);
}

// ============================================================================
// MULTI-CURRENCY SUPPORT
// ============================================================================

/**
 * Convert amount between currencies
 *
 * @param sequelize - Sequelize instance
 * @param amount - Amount to convert
 * @param fromCurrency - Source currency
 * @param toCurrency - Target currency
 * @param effectiveDate - Date for exchange rate lookup
 * @returns Converted amount
 */
export async function convertCurrency(
  sequelize: Sequelize,
  amount: number,
  fromCurrency: Currency,
  toCurrency: Currency,
  effectiveDate?: Date,
): Promise<number> {
  if (fromCurrency === toCurrency) {
    return amount;
  }

  const ExchangeRate = sequelize.model('ExchangeRate');
  const date = effectiveDate || new Date();

  const exchangeRate = await ExchangeRate.findOne({
    where: {
      fromCurrency,
      toCurrency,
      effectiveDate: {
        [Op.lte]: date,
      },
    },
    order: [['effectiveDate', 'DESC']],
  });

  if (!exchangeRate) {
    throw new NotFoundException(`Exchange rate not found for ${fromCurrency} to ${toCurrency}`);
  }

  const rate = new Decimal(exchangeRate.get('rate') as number);
  const convertedAmount = new Decimal(amount).mul(rate);

  return convertedAmount.toNumber();
}

/**
 * Process multi-currency payment with conversion
 *
 * @param sequelize - Sequelize instance
 * @param paymentData - Payment data with currency conversion
 * @param transaction - Optional database transaction
 * @returns Payment with conversion details
 */
export async function processMultiCurrencyPayment(
  sequelize: Sequelize,
  paymentData: {
    invoiceId: string;
    customerId: string;
    paymentMethodId: string;
    paymentCurrency: Currency;
    gateway: PaymentGateway;
    metadata?: Record<string, any>;
  },
  transaction?: Transaction,
): Promise<{ payment: Payment; conversionDetails: any }> {
  const Invoice = sequelize.model('Invoice');

  const invoice = await Invoice.findByPk(paymentData.invoiceId, { transaction });
  if (!invoice) {
    throw new NotFoundException(`Invoice ${paymentData.invoiceId} not found`);
  }

  const invoiceCurrency = invoice.get('currency') as Currency;
  const invoiceAmount = invoice.get('amountDue') as number;
  const paymentCurrency = paymentData.paymentCurrency;

  let paymentAmount = invoiceAmount;
  let conversionDetails: any = null;

  if (invoiceCurrency !== paymentCurrency) {
    paymentAmount = await convertCurrency(
      sequelize,
      invoiceAmount,
      invoiceCurrency,
      paymentCurrency,
    );

    conversionDetails = {
      originalCurrency: invoiceCurrency,
      originalAmount: invoiceAmount,
      paymentCurrency,
      paymentAmount,
      conversionRate: new Decimal(paymentAmount).div(invoiceAmount).toNumber(),
      conversionDate: new Date(),
    };
  }

  const payment = await processPayment(
    sequelize,
    {
      invoiceId: paymentData.invoiceId,
      customerId: paymentData.customerId,
      paymentMethodId: paymentData.paymentMethodId,
      amount: paymentAmount,
      currency: paymentCurrency,
      gateway: paymentData.gateway,
      metadata: {
        ...(paymentData.metadata || {}),
        currencyConversion: conversionDetails,
      },
    },
    transaction,
  );

  return { payment, conversionDetails };
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Generate unique invoice number
 */
async function generateInvoiceNumber(
  sequelize: Sequelize,
  transaction?: Transaction,
): Promise<string> {
  const Invoice = sequelize.model('Invoice');
  const prefix = 'INV';
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');

  const lastInvoice = await Invoice.findOne({
    where: {
      invoiceNumber: {
        [Op.like]: `${prefix}-${year}${month}-%`,
      },
    },
    order: [['invoiceNumber', 'DESC']],
    transaction,
  });

  let sequence = 1;
  if (lastInvoice) {
    const lastNumber = lastInvoice.get('invoiceNumber') as string;
    const lastSequence = parseInt(lastNumber.split('-').pop() || '0');
    sequence = lastSequence + 1;
  }

  return `${prefix}-${year}${month}-${String(sequence).padStart(6, '0')}`;
}

/**
 * Generate unique credit memo number
 */
async function generateCreditMemoNumber(
  sequelize: Sequelize,
  transaction?: Transaction,
): Promise<string> {
  const CreditMemo = sequelize.model('CreditMemo');
  const prefix = 'CM';
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');

  const lastCreditMemo = await CreditMemo.findOne({
    where: {
      creditMemoNumber: {
        [Op.like]: `${prefix}-${year}${month}-%`,
      },
    },
    order: [['creditMemoNumber', 'DESC']],
    transaction,
  });

  let sequence = 1;
  if (lastCreditMemo) {
    const lastNumber = lastCreditMemo.get('creditMemoNumber') as string;
    const lastSequence = parseInt(lastNumber.split('-').pop() || '0');
    sequence = lastSequence + 1;
  }

  return `${prefix}-${year}${month}-${String(sequence).padStart(6, '0')}`;
}

/**
 * Update invoice with payment
 */
async function updateInvoiceWithPayment(
  sequelize: Sequelize,
  invoiceId: string,
  paymentAmount: number,
  transaction?: Transaction,
): Promise<void> {
  const Invoice = sequelize.model('Invoice');

  const invoice = await Invoice.findByPk(invoiceId, { transaction });
  if (!invoice) {
    return;
  }

  const currentAmountPaid = new Decimal(invoice.get('amountPaid') as number);
  const currentAmountDue = new Decimal(invoice.get('amountDue') as number);
  const payment = new Decimal(paymentAmount);

  const newAmountPaid = currentAmountPaid.add(payment);
  const newAmountDue = Decimal.max(0, currentAmountDue.sub(payment));

  let newStatus = invoice.get('status');
  if (newAmountDue.isZero()) {
    newStatus = InvoiceStatus.PAID;
  } else if (newAmountPaid.greaterThan(0)) {
    newStatus = InvoiceStatus.PARTIALLY_PAID;
  }

  await invoice.update({
    amountPaid: newAmountPaid.toNumber(),
    amountDue: newAmountDue.toNumber(),
    status: newStatus,
    paidAt: newAmountDue.isZero() ? new Date() : invoice.get('paidAt'),
  }, { transaction });
}

/**
 * Validate invoice status transition
 */
function isValidInvoiceStatusTransition(
  currentStatus: InvoiceStatus,
  newStatus: InvoiceStatus,
): boolean {
  const validTransitions: Record<InvoiceStatus, InvoiceStatus[]> = {
    [InvoiceStatus.DRAFT]: [InvoiceStatus.OPEN, InvoiceStatus.VOID],
    [InvoiceStatus.OPEN]: [InvoiceStatus.SENT, InvoiceStatus.PAID, InvoiceStatus.OVERDUE, InvoiceStatus.VOID, InvoiceStatus.PARTIALLY_PAID],
    [InvoiceStatus.SENT]: [InvoiceStatus.VIEWED, InvoiceStatus.PAID, InvoiceStatus.OVERDUE, InvoiceStatus.VOID, InvoiceStatus.PARTIALLY_PAID],
    [InvoiceStatus.VIEWED]: [InvoiceStatus.PAID, InvoiceStatus.OVERDUE, InvoiceStatus.VOID, InvoiceStatus.PARTIALLY_PAID],
    [InvoiceStatus.PARTIALLY_PAID]: [InvoiceStatus.PAID, InvoiceStatus.OVERDUE, InvoiceStatus.VOID],
    [InvoiceStatus.OVERDUE]: [InvoiceStatus.PAID, InvoiceStatus.VOID, InvoiceStatus.UNCOLLECTIBLE],
    [InvoiceStatus.PAID]: [InvoiceStatus.REFUNDED, InvoiceStatus.DISPUTED],
    [InvoiceStatus.VOID]: [],
    [InvoiceStatus.UNCOLLECTIBLE]: [],
    [InvoiceStatus.REFUNDED]: [],
    [InvoiceStatus.DISPUTED]: [InvoiceStatus.PAID, InvoiceStatus.VOID],
    [InvoiceStatus.CANCELLED]: [],
  };

  return validTransitions[currentStatus]?.includes(newStatus) || false;
}

/**
 * Calculate next billing date based on cycle
 */
function calculateNextBillingDate(currentDate: Date, billingCycle: BillingCycle): Date {
  switch (billingCycle) {
    case BillingCycle.DAILY:
      return addDays(currentDate, 1);
    case BillingCycle.WEEKLY:
      return addDays(currentDate, 7);
    case BillingCycle.BIWEEKLY:
      return addDays(currentDate, 14);
    case BillingCycle.MONTHLY:
      return addMonths(currentDate, 1);
    case BillingCycle.QUARTERLY:
      return addMonths(currentDate, 3);
    case BillingCycle.SEMI_ANNUAL:
      return addMonths(currentDate, 6);
    case BillingCycle.ANNUAL:
      return addYears(currentDate, 1);
    case BillingCycle.BIENNIAL:
      return addYears(currentDate, 2);
    case BillingCycle.TRIENNIAL:
      return addYears(currentDate, 3);
    default:
      return addMonths(currentDate, 1);
  }
}

/**
 * Calculate next installment date
 */
function calculateNextInstallmentDate(currentDate: Date, frequency: InstallmentFrequency): Date {
  switch (frequency) {
    case InstallmentFrequency.WEEKLY:
      return addDays(currentDate, 7);
    case InstallmentFrequency.BIWEEKLY:
      return addDays(currentDate, 14);
    case InstallmentFrequency.MONTHLY:
      return addMonths(currentDate, 1);
    case InstallmentFrequency.QUARTERLY:
      return addMonths(currentDate, 3);
    case InstallmentFrequency.SEMI_ANNUAL:
      return addMonths(currentDate, 6);
    default:
      return addMonths(currentDate, 1);
  }
}

/**
 * Get next dunning stage
 */
function getNextDunningStage(currentStage: DunningStage): DunningStage {
  const stageProgression: Record<DunningStage, DunningStage> = {
    [DunningStage.INITIAL]: DunningStage.FIRST_REMINDER,
    [DunningStage.FIRST_REMINDER]: DunningStage.SECOND_REMINDER,
    [DunningStage.SECOND_REMINDER]: DunningStage.FINAL_NOTICE,
    [DunningStage.FINAL_NOTICE]: DunningStage.COLLECTION,
    [DunningStage.COLLECTION]: DunningStage.SUSPENDED,
    [DunningStage.SUSPENDED]: DunningStage.SUSPENDED,
    [DunningStage.RESOLVED]: DunningStage.RESOLVED,
  };

  return stageProgression[currentStage];
}

/**
 * Calculate next dunning attempt date
 */
function calculateNextDunningAttempt(stage: DunningStage, attemptCount: number): Date {
  const daysToAdd: Record<DunningStage, number> = {
    [DunningStage.INITIAL]: 3,
    [DunningStage.FIRST_REMINDER]: 5,
    [DunningStage.SECOND_REMINDER]: 7,
    [DunningStage.FINAL_NOTICE]: 10,
    [DunningStage.COLLECTION]: 14,
    [DunningStage.SUSPENDED]: 30,
    [DunningStage.RESOLVED]: 0,
  };

  return addDays(new Date(), daysToAdd[stage]);
}

// ============================================================================
// GATEWAY INTEGRATION STUBS (to be implemented with actual gateway SDKs)
// ============================================================================

/**
 * Process payment through gateway (implementation stub)
 */
async function processGatewayPayment(
  gateway: PaymentGateway,
  paymentMethodToken: string,
  amount: number,
  currency: Currency,
): Promise<{
  success: boolean;
  transactionId?: string;
  feeAmount?: number;
  netAmount?: number;
  failureCode?: string;
  failureMessage?: string;
}> {
  // Implementation would integrate with actual payment gateway SDK
  // This is a stub for demonstration
  return {
    success: true,
    transactionId: `txn_${crypto.randomBytes(16).toString('hex')}`,
    feeAmount: new Decimal(amount).mul(0.029).add(0.30).toNumber(),
    netAmount: new Decimal(amount).mul(0.971).sub(0.30).toNumber(),
  };
}

/**
 * Authorize payment through gateway (implementation stub)
 */
async function authorizeGatewayPayment(
  gateway: PaymentGateway,
  paymentMethodToken: string,
  amount: number,
  currency: Currency,
): Promise<{
  success: boolean;
  transactionId?: string;
  failureCode?: string;
  failureMessage?: string;
}> {
  return {
    success: true,
    transactionId: `auth_${crypto.randomBytes(16).toString('hex')}`,
  };
}

/**
 * Capture gateway payment (implementation stub)
 */
async function captureGatewayPayment(
  gateway: PaymentGateway,
  transactionId: string,
  amount: number,
): Promise<{
  success: boolean;
  feeAmount?: number;
  netAmount?: number;
  failureCode?: string;
  failureMessage?: string;
}> {
  return {
    success: true,
    feeAmount: new Decimal(amount).mul(0.029).add(0.30).toNumber(),
    netAmount: new Decimal(amount).mul(0.971).sub(0.30).toNumber(),
  };
}

/**
 * Refund gateway payment (implementation stub)
 */
async function refundGatewayPayment(
  gateway: PaymentGateway,
  transactionId: string,
  amount: number,
): Promise<{
  success: boolean;
  refundId?: string;
  failureCode?: string;
  failureMessage?: string;
}> {
  return {
    success: true,
    refundId: `rfnd_${crypto.randomBytes(16).toString('hex')}`,
  };
}

/**
 * Void gateway payment (implementation stub)
 */
async function voidGatewayPayment(
  gateway: PaymentGateway,
  transactionId: string,
): Promise<{
  success: boolean;
  failureCode?: string;
  failureMessage?: string;
}> {
  return {
    success: true,
  };
}

/**
 * Tokenize payment method with gateway (implementation stub)
 */
async function tokenizeWithGateway(
  gateway: PaymentGateway,
  paymentMethodData: any,
): Promise<{
  success: boolean;
  customerId?: string;
  paymentMethodId?: string;
  cardBrand?: string;
  last4?: string;
  bankName?: string;
  error?: string;
}> {
  return {
    success: true,
    customerId: `cus_${crypto.randomBytes(16).toString('hex')}`,
    paymentMethodId: `pm_${crypto.randomBytes(16).toString('hex')}`,
    cardBrand: 'visa',
    last4: '4242',
  };
}

/**
 * Delete payment method from gateway (implementation stub)
 */
async function deleteFromGateway(
  gateway: PaymentGateway,
  paymentMethodToken: string,
): Promise<void> {
  // Implementation would call gateway API
}

/**
 * Verify payment method with gateway (implementation stub)
 */
async function verifyWithGateway(
  gateway: PaymentGateway,
  paymentMethodToken: string,
  verificationData: any,
): Promise<{
  verified: boolean;
  message?: string;
}> {
  return {
    verified: true,
    message: 'Payment method verified successfully',
  };
}
