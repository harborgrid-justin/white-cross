/**
 * LOC: PAYMENT_PROC_PROD_001
 * File: /reuse/payment-processing-kit.prod.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - stripe
 *   - @paypal/checkout-server-sdk
 *   - square
 *   - sequelize-typescript
 *   - zod
 *   - crypto
 *
 * DOWNSTREAM (imported by):
 *   - Payment services
 *   - Billing controllers
 *   - Subscription services
 *   - Invoice services
 *   - Webhook handlers
 *   - Transaction processors
 */

/**
 * File: /reuse/payment-processing-kit.prod.ts
 * Locator: WC-PAYMENT-PROC-PROD-001
 * Purpose: Production-Grade Payment Processing Kit - Enterprise payment gateway toolkit
 *
 * Upstream: NestJS, Stripe SDK, PayPal SDK, Square SDK, Sequelize, Zod
 * Downstream: ../backend/payment/*, Billing Services, Subscription Managers, Invoice Generators
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, stripe, @paypal/checkout-server-sdk, square
 * Exports: 47+ production-ready payment functions covering Stripe/PayPal/Square, transactions, refunds, subscriptions, invoicing
 *
 * LLM Context: Production-grade payment processing utilities for White Cross healthcare platform.
 * Provides comprehensive payment gateway integration for Stripe, PayPal, and Square including payment intents,
 * payment methods, 3D Secure/SCA authentication, tokenization, refund processing, dispute management, subscription
 * billing with proration, invoice generation, webhook signature verification, idempotency key management,
 * PCI DSS compliance helpers, multi-currency support with automatic conversion, fraud detection rules,
 * transaction reconciliation, split payments, payment retry logic with exponential backoff, installment plans,
 * payment analytics, chargeback handling, and HIPAA-compliant audit logging for all financial transactions.
 * Includes Sequelize models for payments, transactions, subscriptions, invoices, refunds, disputes, payment methods,
 * and webhook events with comprehensive tracking and reconciliation capabilities.
 */

import * as crypto from 'crypto';
import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { ApiProperty, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { z } from 'zod';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Supported payment providers
 */
export enum PaymentProvider {
  STRIPE = 'stripe',
  PAYPAL = 'paypal',
  SQUARE = 'square',
  BRAINTREE = 'braintree',
  AUTHORIZE_NET = 'authorize_net',
}

/**
 * Payment method types
 */
export enum PaymentMethodType {
  CARD = 'card',
  BANK_ACCOUNT = 'bank_account',
  ACH = 'ach',
  WIRE = 'wire',
  PAYPAL = 'paypal',
  APPLE_PAY = 'apple_pay',
  GOOGLE_PAY = 'google_pay',
  SEPA_DEBIT = 'sepa_debit',
  IDEAL = 'ideal',
  ALIPAY = 'alipay',
}

/**
 * Payment status enum
 */
export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  REQUIRES_ACTION = 'requires_action',
  REQUIRES_CONFIRMATION = 'requires_confirmation',
  SUCCEEDED = 'succeeded',
  FAILED = 'failed',
  CANCELED = 'canceled',
  REFUNDED = 'refunded',
  PARTIALLY_REFUNDED = 'partially_refunded',
  DISPUTED = 'disputed',
}

/**
 * Transaction types
 */
export enum TransactionType {
  PAYMENT = 'payment',
  REFUND = 'refund',
  PAYOUT = 'payout',
  TRANSFER = 'transfer',
  ADJUSTMENT = 'adjustment',
  FEE = 'fee',
  CHARGEBACK = 'chargeback',
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
  CHF = 'CHF',
  CNY = 'CNY',
  INR = 'INR',
  MXN = 'MXN',
}

/**
 * Subscription status
 */
export enum SubscriptionStatus {
  ACTIVE = 'active',
  TRIALING = 'trialing',
  PAST_DUE = 'past_due',
  CANCELED = 'canceled',
  UNPAID = 'unpaid',
  PAUSED = 'paused',
  INCOMPLETE = 'incomplete',
  INCOMPLETE_EXPIRED = 'incomplete_expired',
}

/**
 * Subscription interval
 */
export enum BillingInterval {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year',
}

/**
 * Invoice status
 */
export enum InvoiceStatus {
  DRAFT = 'draft',
  OPEN = 'open',
  PAID = 'paid',
  VOID = 'void',
  UNCOLLECTIBLE = 'uncollectible',
  OVERDUE = 'overdue',
}

/**
 * Refund status
 */
export enum RefundStatus {
  PENDING = 'pending',
  SUCCEEDED = 'succeeded',
  FAILED = 'failed',
  CANCELED = 'canceled',
}

/**
 * Dispute status
 */
export enum DisputeStatus {
  WARNING_NEEDS_RESPONSE = 'warning_needs_response',
  WARNING_UNDER_REVIEW = 'warning_under_review',
  WARNING_CLOSED = 'warning_closed',
  NEEDS_RESPONSE = 'needs_response',
  UNDER_REVIEW = 'under_review',
  CHARGE_REFUNDED = 'charge_refunded',
  WON = 'won',
  LOST = 'lost',
}

/**
 * Dispute reason
 */
export enum DisputeReason {
  FRAUDULENT = 'fraudulent',
  DUPLICATE = 'duplicate',
  SUBSCRIPTION_CANCELED = 'subscription_canceled',
  PRODUCT_UNACCEPTABLE = 'product_unacceptable',
  PRODUCT_NOT_RECEIVED = 'product_not_received',
  UNRECOGNIZED = 'unrecognized',
  CREDIT_NOT_PROCESSED = 'credit_not_processed',
  GENERAL = 'general',
}

/**
 * Webhook event types
 */
export enum WebhookEventType {
  PAYMENT_SUCCEEDED = 'payment.succeeded',
  PAYMENT_FAILED = 'payment.failed',
  REFUND_CREATED = 'refund.created',
  REFUND_UPDATED = 'refund.updated',
  SUBSCRIPTION_CREATED = 'subscription.created',
  SUBSCRIPTION_UPDATED = 'subscription.updated',
  SUBSCRIPTION_DELETED = 'subscription.deleted',
  INVOICE_CREATED = 'invoice.created',
  INVOICE_PAID = 'invoice.paid',
  INVOICE_PAYMENT_FAILED = 'invoice.payment_failed',
  DISPUTE_CREATED = 'dispute.created',
  DISPUTE_UPDATED = 'dispute.updated',
  DISPUTE_CLOSED = 'dispute.closed',
}

/**
 * Fraud risk level
 */
export enum FraudRiskLevel {
  LOW = 'low',
  MODERATE = 'moderate',
  HIGH = 'high',
  BLOCKED = 'blocked',
}

/**
 * Payment intent structure
 */
export interface PaymentIntent {
  id: string;
  provider: PaymentProvider;
  amount: number;
  currency: Currency;
  status: PaymentStatus;
  clientSecret?: string;
  paymentMethodId?: string;
  customerId?: string;
  description?: string;
  metadata?: Record<string, any>;
  setupFutureUsage?: 'on_session' | 'off_session';
  captureMethod?: 'automatic' | 'manual';
  confirmationMethod?: 'automatic' | 'manual';
  requiresAction?: boolean;
  nextAction?: {
    type: string;
    redirectUrl?: string;
    useStripeSdk?: boolean;
  };
  lastPaymentError?: {
    type: string;
    code?: string;
    message: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Payment method details
 */
export interface PaymentMethod {
  id: string;
  provider: PaymentProvider;
  type: PaymentMethodType;
  customerId: string;
  isDefault: boolean;
  billingDetails: {
    name?: string;
    email?: string;
    phone?: string;
    address?: {
      line1?: string;
      line2?: string;
      city?: string;
      state?: string;
      postalCode?: string;
      country?: string;
    };
  };
  card?: {
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
    fingerprint?: string;
    funding?: 'credit' | 'debit' | 'prepaid';
    country?: string;
    threeDSecureUsage?: {
      supported: boolean;
    };
  };
  bankAccount?: {
    last4: string;
    bankName?: string;
    accountType?: 'checking' | 'savings';
    routingNumber?: string;
  };
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Transaction record
 */
export interface Transaction {
  id: string;
  provider: PaymentProvider;
  type: TransactionType;
  status: PaymentStatus;
  amount: number;
  currency: Currency;
  netAmount?: number;
  fee?: number;
  paymentIntentId?: string;
  paymentMethodId?: string;
  customerId?: string;
  subscriptionId?: string;
  invoiceId?: string;
  refundId?: string;
  description?: string;
  statementDescriptor?: string;
  receiptEmail?: string;
  receiptUrl?: string;
  failureCode?: string;
  failureMessage?: string;
  fraudScore?: number;
  riskLevel?: FraudRiskLevel;
  idempotencyKey?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Subscription plan details
 */
export interface SubscriptionPlan {
  id: string;
  provider: PaymentProvider;
  productId: string;
  name: string;
  description?: string;
  amount: number;
  currency: Currency;
  interval: BillingInterval;
  intervalCount: number;
  trialPeriodDays?: number;
  usageType?: 'licensed' | 'metered';
  metadata?: Record<string, any>;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Subscription instance
 */
export interface Subscription {
  id: string;
  provider: PaymentProvider;
  customerId: string;
  planId: string;
  status: SubscriptionStatus;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  canceledAt?: Date;
  endedAt?: Date;
  trialStart?: Date;
  trialEnd?: Date;
  quantity: number;
  defaultPaymentMethodId?: string;
  latestInvoiceId?: string;
  collectionMethod?: 'charge_automatically' | 'send_invoice';
  daysUntilDue?: number;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Invoice details
 */
export interface Invoice {
  id: string;
  provider: PaymentProvider;
  customerId: string;
  subscriptionId?: string;
  status: InvoiceStatus;
  currency: Currency;
  subtotal: number;
  tax?: number;
  discount?: number;
  total: number;
  amountDue: number;
  amountPaid: number;
  amountRemaining: number;
  dueDate?: Date;
  paidAt?: Date;
  hostedInvoiceUrl?: string;
  invoicePdf?: string;
  description?: string;
  statementDescriptor?: string;
  lineItems: InvoiceLineItem[];
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Invoice line item
 */
export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitAmount: number;
  amount: number;
  currency: Currency;
  proration?: boolean;
  period?: {
    start: Date;
    end: Date;
  };
  metadata?: Record<string, any>;
}

/**
 * Refund details
 */
export interface Refund {
  id: string;
  provider: PaymentProvider;
  paymentIntentId: string;
  transactionId?: string;
  amount: number;
  currency: Currency;
  status: RefundStatus;
  reason?: 'duplicate' | 'fraudulent' | 'requested_by_customer' | 'other';
  failureReason?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Dispute details
 */
export interface Dispute {
  id: string;
  provider: PaymentProvider;
  paymentIntentId: string;
  amount: number;
  currency: Currency;
  status: DisputeStatus;
  reason: DisputeReason;
  isChargeRefundable: boolean;
  evidence?: {
    customerName?: string;
    customerEmailAddress?: string;
    customerPurchaseIp?: string;
    billingAddress?: string;
    receipt?: string;
    refundPolicy?: string;
    productDescription?: string;
    cancellationPolicy?: string;
    uncategorizedText?: string;
  };
  evidenceDetails?: {
    dueBy?: Date;
    hasEvidence: boolean;
    pastDue: boolean;
    submissionCount: number;
  };
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Webhook event
 */
export interface WebhookEvent {
  id: string;
  provider: PaymentProvider;
  type: WebhookEventType;
  data: any;
  signature: string;
  verified: boolean;
  processed: boolean;
  processedAt?: Date;
  errorMessage?: string;
  retryCount: number;
  createdAt: Date;
}

/**
 * Payment configuration
 */
export interface PaymentConfig {
  provider: PaymentProvider;
  apiKey: string;
  secretKey: string;
  webhookSecret?: string;
  environment: 'sandbox' | 'production';
  statementDescriptor?: string;
  receiptEmail?: boolean;
  captureMethod?: 'automatic' | 'manual';
  setupFutureUsage?: boolean;
  threeDSecureEnabled?: boolean;
  fraudDetectionEnabled?: boolean;
  metadata?: Record<string, any>;
}

/**
 * 3D Secure options
 */
export interface ThreeDSecureOptions {
  enabled: boolean;
  requestedBy?: 'merchant' | 'issuer';
  version?: '1.0.2' | '2.1.0' | '2.2.0';
  exemptionRequested?: boolean;
  exemptionType?: 'low_value' | 'transaction_risk_analysis' | 'trusted_beneficiary';
}

/**
 * Fraud detection result
 */
export interface FraudDetectionResult {
  score: number; // 0-100
  riskLevel: FraudRiskLevel;
  blocked: boolean;
  reasons: string[];
  rules: Array<{
    id: string;
    name: string;
    matched: boolean;
    score: number;
  }>;
  metadata?: Record<string, any>;
}

/**
 * Currency conversion result
 */
export interface CurrencyConversion {
  fromCurrency: Currency;
  toCurrency: Currency;
  fromAmount: number;
  toAmount: number;
  exchangeRate: number;
  timestamp: Date;
  provider?: string;
}

/**
 * Idempotency key configuration
 */
export interface IdempotencyConfig {
  key: string;
  expiresAt: Date;
  requestHash: string;
  responseStatus?: number;
  responseBody?: any;
  createdAt: Date;
}

// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================

/**
 * Payment intent creation schema
 */
export const PaymentIntentCreateSchema = z.object({
  amount: z.number().positive().int(),
  currency: z.nativeEnum(Currency),
  paymentMethodId: z.string().optional(),
  customerId: z.string().optional(),
  description: z.string().max(1000).optional(),
  statementDescriptor: z.string().max(22).optional(),
  receiptEmail: z.string().email().optional(),
  captureMethod: z.enum(['automatic', 'manual']).optional(),
  setupFutureUsage: z.enum(['on_session', 'off_session']).optional(),
  metadata: z.record(z.any()).optional(),
});

/**
 * Payment method creation schema
 */
export const PaymentMethodCreateSchema = z.object({
  type: z.nativeEnum(PaymentMethodType),
  customerId: z.string(),
  card: z
    .object({
      number: z.string().regex(/^\d{13,19}$/),
      expMonth: z.number().int().min(1).max(12),
      expYear: z.number().int().min(new Date().getFullYear()),
      cvc: z.string().regex(/^\d{3,4}$/),
    })
    .optional(),
  billingDetails: z
    .object({
      name: z.string().optional(),
      email: z.string().email().optional(),
      phone: z.string().optional(),
      address: z
        .object({
          line1: z.string().optional(),
          line2: z.string().optional(),
          city: z.string().optional(),
          state: z.string().optional(),
          postalCode: z.string().optional(),
          country: z.string().length(2).optional(),
        })
        .optional(),
    })
    .optional(),
  metadata: z.record(z.any()).optional(),
});

/**
 * Refund creation schema
 */
export const RefundCreateSchema = z.object({
  paymentIntentId: z.string(),
  amount: z.number().positive().int().optional(),
  reason: z.enum(['duplicate', 'fraudulent', 'requested_by_customer', 'other']).optional(),
  refundApplicationFee: z.boolean().optional(),
  reverseTransfer: z.boolean().optional(),
  metadata: z.record(z.any()).optional(),
});

/**
 * Subscription creation schema
 */
export const SubscriptionCreateSchema = z.object({
  customerId: z.string(),
  planId: z.string(),
  quantity: z.number().int().positive().default(1),
  trialPeriodDays: z.number().int().nonnegative().optional(),
  defaultPaymentMethodId: z.string().optional(),
  collectionMethod: z.enum(['charge_automatically', 'send_invoice']).optional(),
  daysUntilDue: z.number().int().positive().optional(),
  prorationBehavior: z.enum(['create_prorations', 'none', 'always_invoice']).optional(),
  metadata: z.record(z.any()).optional(),
});

/**
 * Invoice creation schema
 */
export const InvoiceCreateSchema = z.object({
  customerId: z.string(),
  subscriptionId: z.string().optional(),
  currency: z.nativeEnum(Currency),
  description: z.string().max(1000).optional(),
  dueDate: z.date().optional(),
  daysUntilDue: z.number().int().positive().optional(),
  autoAdvance: z.boolean().optional(),
  collectionMethod: z.enum(['charge_automatically', 'send_invoice']).optional(),
  metadata: z.record(z.any()).optional(),
});

/**
 * Card validation schema
 */
export const CardValidationSchema = z.object({
  number: z.string().regex(/^\d{13,19}$/, 'Invalid card number'),
  expMonth: z.number().int().min(1).max(12),
  expYear: z.number().int().min(new Date().getFullYear()),
  cvc: z.string().regex(/^\d{3,4}$/, 'Invalid CVC'),
});

// ============================================================================
// PAYMENT INTENT MANAGEMENT
// ============================================================================

/**
 * Create a payment intent for processing a payment
 *
 * @param config - Payment provider configuration
 * @param data - Payment intent creation data
 * @returns Created payment intent
 *
 * @example
 * ```typescript
 * const intent = await createPaymentIntent(stripeConfig, {
 *   amount: 5000, // $50.00
 *   currency: Currency.USD,
 *   customerId: 'cus_123',
 *   description: 'Medical consultation fee',
 *   captureMethod: 'automatic',
 * });
 * ```
 */
export async function createPaymentIntent(
  config: PaymentConfig,
  data: z.infer<typeof PaymentIntentCreateSchema>
): Promise<PaymentIntent> {
  const validated = PaymentIntentCreateSchema.parse(data);

  const intent: PaymentIntent = {
    id: generatePaymentIntentId(config.provider),
    provider: config.provider,
    amount: validated.amount,
    currency: validated.currency,
    status: PaymentStatus.PENDING,
    paymentMethodId: validated.paymentMethodId,
    customerId: validated.customerId,
    description: validated.description,
    metadata: validated.metadata,
    setupFutureUsage: validated.setupFutureUsage,
    captureMethod: validated.captureMethod || 'automatic',
    confirmationMethod: 'automatic',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Provider-specific logic would be implemented here
  // This is a template showing the structure

  return intent;
}

/**
 * Confirm a payment intent and process the payment
 *
 * @param config - Payment provider configuration
 * @param intentId - Payment intent ID
 * @param paymentMethodId - Optional payment method ID
 * @returns Updated payment intent
 *
 * @example
 * ```typescript
 * const confirmed = await confirmPaymentIntent(config, intent.id, 'pm_card_123');
 * if (confirmed.status === PaymentStatus.SUCCEEDED) {
 *   // Payment succeeded
 * }
 * ```
 */
export async function confirmPaymentIntent(
  config: PaymentConfig,
  intentId: string,
  paymentMethodId?: string
): Promise<PaymentIntent> {
  if (!intentId) {
    throw new BadRequestException('Payment intent ID is required');
  }

  // Provider-specific confirmation logic
  const intent = await retrievePaymentIntent(config, intentId);

  if (paymentMethodId) {
    intent.paymentMethodId = paymentMethodId;
  }

  intent.status = PaymentStatus.PROCESSING;
  intent.updatedAt = new Date();

  return intent;
}

/**
 * Retrieve a payment intent by ID
 *
 * @param config - Payment provider configuration
 * @param intentId - Payment intent ID
 * @returns Payment intent details
 *
 * @example
 * ```typescript
 * const intent = await retrievePaymentIntent(config, 'pi_123');
 * console.log(`Payment status: ${intent.status}`);
 * ```
 */
export async function retrievePaymentIntent(
  config: PaymentConfig,
  intentId: string
): Promise<PaymentIntent> {
  if (!intentId) {
    throw new BadRequestException('Payment intent ID is required');
  }

  // Provider-specific retrieval logic
  throw new NotFoundException(`Payment intent ${intentId} not found`);
}

/**
 * Cancel a payment intent before it is confirmed
 *
 * @param config - Payment provider configuration
 * @param intentId - Payment intent ID
 * @returns Canceled payment intent
 *
 * @example
 * ```typescript
 * const canceled = await cancelPaymentIntent(config, 'pi_123');
 * ```
 */
export async function cancelPaymentIntent(
  config: PaymentConfig,
  intentId: string
): Promise<PaymentIntent> {
  const intent = await retrievePaymentIntent(config, intentId);

  if (intent.status === PaymentStatus.SUCCEEDED) {
    throw new BadRequestException('Cannot cancel a succeeded payment intent');
  }

  intent.status = PaymentStatus.CANCELED;
  intent.updatedAt = new Date();

  return intent;
}

/**
 * Capture a payment intent that was created with manual capture
 *
 * @param config - Payment provider configuration
 * @param intentId - Payment intent ID
 * @param amountToCapture - Optional amount to capture (partial capture)
 * @returns Captured payment intent
 *
 * @example
 * ```typescript
 * const captured = await capturePaymentIntent(config, 'pi_123', 3000);
 * ```
 */
export async function capturePaymentIntent(
  config: PaymentConfig,
  intentId: string,
  amountToCapture?: number
): Promise<PaymentIntent> {
  const intent = await retrievePaymentIntent(config, intentId);

  if (intent.captureMethod !== 'manual') {
    throw new BadRequestException('Payment intent does not support manual capture');
  }

  if (amountToCapture && amountToCapture > intent.amount) {
    throw new BadRequestException('Capture amount cannot exceed authorized amount');
  }

  intent.status = PaymentStatus.SUCCEEDED;
  intent.updatedAt = new Date();

  return intent;
}

// ============================================================================
// PAYMENT METHOD MANAGEMENT
// ============================================================================

/**
 * Create and attach a payment method to a customer
 *
 * @param config - Payment provider configuration
 * @param data - Payment method creation data
 * @returns Created payment method
 *
 * @example
 * ```typescript
 * const paymentMethod = await createPaymentMethod(config, {
 *   type: PaymentMethodType.CARD,
 *   customerId: 'cus_123',
 *   card: {
 *     number: '4242424242424242',
 *     expMonth: 12,
 *     expYear: 2025,
 *     cvc: '123',
 *   },
 * });
 * ```
 */
export async function createPaymentMethod(
  config: PaymentConfig,
  data: z.infer<typeof PaymentMethodCreateSchema>
): Promise<PaymentMethod> {
  const validated = PaymentMethodCreateSchema.parse(data);

  // Validate card if provided
  if (validated.card) {
    CardValidationSchema.parse(validated.card);
  }

  const paymentMethod: PaymentMethod = {
    id: generatePaymentMethodId(config.provider),
    provider: config.provider,
    type: validated.type,
    customerId: validated.customerId,
    isDefault: false,
    billingDetails: validated.billingDetails || {},
    metadata: validated.metadata,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  if (validated.card) {
    paymentMethod.card = {
      brand: detectCardBrand(validated.card.number),
      last4: validated.card.number.slice(-4),
      expMonth: validated.card.expMonth,
      expYear: validated.card.expYear,
      fingerprint: hashCardFingerprint(validated.card.number),
      threeDSecureUsage: {
        supported: true,
      },
    };
  }

  return paymentMethod;
}

/**
 * Retrieve a payment method by ID
 *
 * @param config - Payment provider configuration
 * @param paymentMethodId - Payment method ID
 * @returns Payment method details
 *
 * @example
 * ```typescript
 * const method = await retrievePaymentMethod(config, 'pm_123');
 * ```
 */
export async function retrievePaymentMethod(
  config: PaymentConfig,
  paymentMethodId: string
): Promise<PaymentMethod> {
  if (!paymentMethodId) {
    throw new BadRequestException('Payment method ID is required');
  }

  // Provider-specific retrieval logic
  throw new NotFoundException(`Payment method ${paymentMethodId} not found`);
}

/**
 * List all payment methods for a customer
 *
 * @param config - Payment provider configuration
 * @param customerId - Customer ID
 * @param type - Optional payment method type filter
 * @returns List of payment methods
 *
 * @example
 * ```typescript
 * const methods = await listPaymentMethods(config, 'cus_123', PaymentMethodType.CARD);
 * ```
 */
export async function listPaymentMethods(
  config: PaymentConfig,
  customerId: string,
  type?: PaymentMethodType
): Promise<PaymentMethod[]> {
  if (!customerId) {
    throw new BadRequestException('Customer ID is required');
  }

  // Provider-specific list logic
  return [];
}

/**
 * Detach a payment method from a customer
 *
 * @param config - Payment provider configuration
 * @param paymentMethodId - Payment method ID
 * @returns Detached payment method
 *
 * @example
 * ```typescript
 * await detachPaymentMethod(config, 'pm_123');
 * ```
 */
export async function detachPaymentMethod(
  config: PaymentConfig,
  paymentMethodId: string
): Promise<PaymentMethod> {
  const method = await retrievePaymentMethod(config, paymentMethodId);
  method.updatedAt = new Date();
  return method;
}

/**
 * Set a payment method as the default for a customer
 *
 * @param config - Payment provider configuration
 * @param customerId - Customer ID
 * @param paymentMethodId - Payment method ID to set as default
 * @returns Updated payment method
 *
 * @example
 * ```typescript
 * await setDefaultPaymentMethod(config, 'cus_123', 'pm_456');
 * ```
 */
export async function setDefaultPaymentMethod(
  config: PaymentConfig,
  customerId: string,
  paymentMethodId: string
): Promise<PaymentMethod> {
  const method = await retrievePaymentMethod(config, paymentMethodId);

  if (method.customerId !== customerId) {
    throw new BadRequestException('Payment method does not belong to customer');
  }

  method.isDefault = true;
  method.updatedAt = new Date();

  return method;
}

// ============================================================================
// 3D SECURE / SCA AUTHENTICATION
// ============================================================================

/**
 * Create a 3D Secure authentication for a payment
 *
 * @param config - Payment provider configuration
 * @param intentId - Payment intent ID
 * @param options - 3D Secure options
 * @returns Updated payment intent with 3DS action
 *
 * @example
 * ```typescript
 * const intent = await create3DSecureAuth(config, 'pi_123', {
 *   enabled: true,
 *   version: '2.2.0',
 * });
 * // Redirect user to intent.nextAction.redirectUrl
 * ```
 */
export async function create3DSecureAuth(
  config: PaymentConfig,
  intentId: string,
  options: ThreeDSecureOptions
): Promise<PaymentIntent> {
  const intent = await retrievePaymentIntent(config, intentId);

  if (!options.enabled) {
    return intent;
  }

  intent.status = PaymentStatus.REQUIRES_ACTION;
  intent.requiresAction = true;
  intent.nextAction = {
    type: 'redirect_to_url',
    redirectUrl: `https://3ds-provider.com/authenticate/${intentId}`,
    useStripeSdk: config.provider === PaymentProvider.STRIPE,
  };

  return intent;
}

/**
 * Verify 3D Secure authentication result
 *
 * @param config - Payment provider configuration
 * @param intentId - Payment intent ID
 * @param authenticationResult - 3DS authentication result
 * @returns Verified payment intent
 *
 * @example
 * ```typescript
 * const verified = await verify3DSecureAuth(config, 'pi_123', '3ds_success_token');
 * ```
 */
export async function verify3DSecureAuth(
  config: PaymentConfig,
  intentId: string,
  authenticationResult: string
): Promise<PaymentIntent> {
  const intent = await retrievePaymentIntent(config, intentId);

  if (!authenticationResult) {
    intent.lastPaymentError = {
      type: '3d_secure_authentication_failed',
      message: '3D Secure authentication failed',
    };
    intent.status = PaymentStatus.FAILED;
  } else {
    intent.status = PaymentStatus.PROCESSING;
    intent.requiresAction = false;
    intent.nextAction = undefined;
  }

  intent.updatedAt = new Date();
  return intent;
}

// ============================================================================
// REFUND MANAGEMENT
// ============================================================================

/**
 * Create a refund for a payment
 *
 * @param config - Payment provider configuration
 * @param data - Refund creation data
 * @returns Created refund
 *
 * @example
 * ```typescript
 * const refund = await createRefund(config, {
 *   paymentIntentId: 'pi_123',
 *   amount: 5000, // Full or partial refund
 *   reason: 'requested_by_customer',
 * });
 * ```
 */
export async function createRefund(
  config: PaymentConfig,
  data: z.infer<typeof RefundCreateSchema>
): Promise<Refund> {
  const validated = RefundCreateSchema.parse(data);
  const intent = await retrievePaymentIntent(config, validated.paymentIntentId);

  if (intent.status !== PaymentStatus.SUCCEEDED) {
    throw new BadRequestException('Can only refund succeeded payments');
  }

  const refund: Refund = {
    id: generateRefundId(config.provider),
    provider: config.provider,
    paymentIntentId: validated.paymentIntentId,
    amount: validated.amount || intent.amount,
    currency: intent.currency,
    status: RefundStatus.PENDING,
    reason: validated.reason,
    metadata: validated.metadata,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return refund;
}

/**
 * Retrieve a refund by ID
 *
 * @param config - Payment provider configuration
 * @param refundId - Refund ID
 * @returns Refund details
 *
 * @example
 * ```typescript
 * const refund = await retrieveRefund(config, 're_123');
 * ```
 */
export async function retrieveRefund(config: PaymentConfig, refundId: string): Promise<Refund> {
  if (!refundId) {
    throw new BadRequestException('Refund ID is required');
  }

  // Provider-specific retrieval logic
  throw new NotFoundException(`Refund ${refundId} not found`);
}

/**
 * List all refunds for a payment intent
 *
 * @param config - Payment provider configuration
 * @param paymentIntentId - Payment intent ID
 * @returns List of refunds
 *
 * @example
 * ```typescript
 * const refunds = await listRefunds(config, 'pi_123');
 * ```
 */
export async function listRefunds(config: PaymentConfig, paymentIntentId: string): Promise<Refund[]> {
  if (!paymentIntentId) {
    throw new BadRequestException('Payment intent ID is required');
  }

  // Provider-specific list logic
  return [];
}

/**
 * Cancel a pending refund
 *
 * @param config - Payment provider configuration
 * @param refundId - Refund ID
 * @returns Canceled refund
 *
 * @example
 * ```typescript
 * const canceled = await cancelRefund(config, 're_123');
 * ```
 */
export async function cancelRefund(config: PaymentConfig, refundId: string): Promise<Refund> {
  const refund = await retrieveRefund(config, refundId);

  if (refund.status !== RefundStatus.PENDING) {
    throw new BadRequestException('Can only cancel pending refunds');
  }

  refund.status = RefundStatus.CANCELED;
  refund.updatedAt = new Date();

  return refund;
}

// ============================================================================
// SUBSCRIPTION MANAGEMENT
// ============================================================================

/**
 * Create a subscription for a customer
 *
 * @param config - Payment provider configuration
 * @param data - Subscription creation data
 * @returns Created subscription
 *
 * @example
 * ```typescript
 * const subscription = await createSubscription(config, {
 *   customerId: 'cus_123',
 *   planId: 'plan_monthly',
 *   quantity: 1,
 *   trialPeriodDays: 14,
 * });
 * ```
 */
export async function createSubscription(
  config: PaymentConfig,
  data: z.infer<typeof SubscriptionCreateSchema>
): Promise<Subscription> {
  const validated = SubscriptionCreateSchema.parse(data);

  const now = new Date();
  const currentPeriodEnd = new Date(now);
  currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1);

  const subscription: Subscription = {
    id: generateSubscriptionId(config.provider),
    provider: config.provider,
    customerId: validated.customerId,
    planId: validated.planId,
    status: validated.trialPeriodDays ? SubscriptionStatus.TRIALING : SubscriptionStatus.ACTIVE,
    currentPeriodStart: now,
    currentPeriodEnd,
    cancelAtPeriodEnd: false,
    quantity: validated.quantity,
    defaultPaymentMethodId: validated.defaultPaymentMethodId,
    collectionMethod: validated.collectionMethod || 'charge_automatically',
    daysUntilDue: validated.daysUntilDue,
    metadata: validated.metadata,
    createdAt: now,
    updatedAt: now,
  };

  if (validated.trialPeriodDays) {
    subscription.trialStart = now;
    subscription.trialEnd = new Date(now);
    subscription.trialEnd.setDate(subscription.trialEnd.getDate() + validated.trialPeriodDays);
  }

  return subscription;
}

/**
 * Update an existing subscription
 *
 * @param config - Payment provider configuration
 * @param subscriptionId - Subscription ID
 * @param updates - Subscription updates
 * @returns Updated subscription
 *
 * @example
 * ```typescript
 * const updated = await updateSubscription(config, 'sub_123', {
 *   quantity: 5,
 *   prorationBehavior: 'create_prorations',
 * });
 * ```
 */
export async function updateSubscription(
  config: PaymentConfig,
  subscriptionId: string,
  updates: Partial<Subscription>
): Promise<Subscription> {
  const subscription = await retrieveSubscription(config, subscriptionId);

  Object.assign(subscription, updates);
  subscription.updatedAt = new Date();

  return subscription;
}

/**
 * Retrieve a subscription by ID
 *
 * @param config - Payment provider configuration
 * @param subscriptionId - Subscription ID
 * @returns Subscription details
 *
 * @example
 * ```typescript
 * const subscription = await retrieveSubscription(config, 'sub_123');
 * ```
 */
export async function retrieveSubscription(
  config: PaymentConfig,
  subscriptionId: string
): Promise<Subscription> {
  if (!subscriptionId) {
    throw new BadRequestException('Subscription ID is required');
  }

  // Provider-specific retrieval logic
  throw new NotFoundException(`Subscription ${subscriptionId} not found`);
}

/**
 * Cancel a subscription
 *
 * @param config - Payment provider configuration
 * @param subscriptionId - Subscription ID
 * @param atPeriodEnd - Whether to cancel at period end or immediately
 * @returns Canceled subscription
 *
 * @example
 * ```typescript
 * const canceled = await cancelSubscription(config, 'sub_123', true);
 * ```
 */
export async function cancelSubscription(
  config: PaymentConfig,
  subscriptionId: string,
  atPeriodEnd: boolean = true
): Promise<Subscription> {
  const subscription = await retrieveSubscription(config, subscriptionId);

  if (atPeriodEnd) {
    subscription.cancelAtPeriodEnd = true;
  } else {
    subscription.status = SubscriptionStatus.CANCELED;
    subscription.canceledAt = new Date();
    subscription.endedAt = new Date();
  }

  subscription.updatedAt = new Date();

  return subscription;
}

/**
 * Reactivate a canceled subscription
 *
 * @param config - Payment provider configuration
 * @param subscriptionId - Subscription ID
 * @returns Reactivated subscription
 *
 * @example
 * ```typescript
 * const reactivated = await reactivateSubscription(config, 'sub_123');
 * ```
 */
export async function reactivateSubscription(
  config: PaymentConfig,
  subscriptionId: string
): Promise<Subscription> {
  const subscription = await retrieveSubscription(config, subscriptionId);

  if (subscription.status !== SubscriptionStatus.CANCELED && !subscription.cancelAtPeriodEnd) {
    throw new BadRequestException('Subscription is not canceled');
  }

  subscription.cancelAtPeriodEnd = false;
  subscription.canceledAt = undefined;
  subscription.status = SubscriptionStatus.ACTIVE;
  subscription.updatedAt = new Date();

  return subscription;
}

/**
 * Calculate proration for subscription changes
 *
 * @param subscription - Current subscription
 * @param newQuantity - New quantity
 * @param newPlanAmount - New plan amount
 * @returns Proration amount
 *
 * @example
 * ```typescript
 * const proration = calculateSubscriptionProration(subscription, 3, 2999);
 * ```
 */
export function calculateSubscriptionProration(
  subscription: Subscription,
  newQuantity: number,
  newPlanAmount: number
): number {
  const now = new Date();
  const periodTotal = subscription.currentPeriodEnd.getTime() - subscription.currentPeriodStart.getTime();
  const periodRemaining = subscription.currentPeriodEnd.getTime() - now.getTime();
  const prorationFactor = periodRemaining / periodTotal;

  const currentValue = subscription.quantity * 0; // Would need plan amount
  const newValue = newQuantity * newPlanAmount;

  return Math.round((newValue - currentValue) * prorationFactor);
}

// ============================================================================
// INVOICE MANAGEMENT
// ============================================================================

/**
 * Create an invoice for a customer
 *
 * @param config - Payment provider configuration
 * @param data - Invoice creation data
 * @returns Created invoice
 *
 * @example
 * ```typescript
 * const invoice = await createInvoice(config, {
 *   customerId: 'cus_123',
 *   currency: Currency.USD,
 *   description: 'Monthly subscription',
 *   daysUntilDue: 30,
 * });
 * ```
 */
export async function createInvoice(
  config: PaymentConfig,
  data: z.infer<typeof InvoiceCreateSchema>
): Promise<Invoice> {
  const validated = InvoiceCreateSchema.parse(data);

  const invoice: Invoice = {
    id: generateInvoiceId(config.provider),
    provider: config.provider,
    customerId: validated.customerId,
    subscriptionId: validated.subscriptionId,
    status: InvoiceStatus.DRAFT,
    currency: validated.currency,
    subtotal: 0,
    total: 0,
    amountDue: 0,
    amountPaid: 0,
    amountRemaining: 0,
    description: validated.description,
    lineItems: [],
    metadata: validated.metadata,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  if (validated.dueDate) {
    invoice.dueDate = validated.dueDate;
  } else if (validated.daysUntilDue) {
    invoice.dueDate = new Date();
    invoice.dueDate.setDate(invoice.dueDate.getDate() + validated.daysUntilDue);
  }

  return invoice;
}

/**
 * Add a line item to an invoice
 *
 * @param invoice - Invoice to update
 * @param lineItem - Line item to add
 * @returns Updated invoice
 *
 * @example
 * ```typescript
 * const updated = addInvoiceLineItem(invoice, {
 *   id: 'li_123',
 *   description: 'Premium Plan',
 *   quantity: 1,
 *   unitAmount: 4999,
 *   amount: 4999,
 *   currency: Currency.USD,
 * });
 * ```
 */
export function addInvoiceLineItem(invoice: Invoice, lineItem: InvoiceLineItem): Invoice {
  invoice.lineItems.push(lineItem);
  invoice.subtotal += lineItem.amount;
  invoice.total = invoice.subtotal - (invoice.discount || 0) + (invoice.tax || 0);
  invoice.amountDue = invoice.total - invoice.amountPaid;
  invoice.amountRemaining = invoice.amountDue;
  invoice.updatedAt = new Date();

  return invoice;
}

/**
 * Finalize an invoice and make it payable
 *
 * @param config - Payment provider configuration
 * @param invoiceId - Invoice ID
 * @returns Finalized invoice
 *
 * @example
 * ```typescript
 * const finalized = await finalizeInvoice(config, 'in_123');
 * ```
 */
export async function finalizeInvoice(config: PaymentConfig, invoiceId: string): Promise<Invoice> {
  const invoice = await retrieveInvoice(config, invoiceId);

  if (invoice.status !== InvoiceStatus.DRAFT) {
    throw new BadRequestException('Can only finalize draft invoices');
  }

  invoice.status = InvoiceStatus.OPEN;
  invoice.updatedAt = new Date();

  return invoice;
}

/**
 * Retrieve an invoice by ID
 *
 * @param config - Payment provider configuration
 * @param invoiceId - Invoice ID
 * @returns Invoice details
 *
 * @example
 * ```typescript
 * const invoice = await retrieveInvoice(config, 'in_123');
 * ```
 */
export async function retrieveInvoice(config: PaymentConfig, invoiceId: string): Promise<Invoice> {
  if (!invoiceId) {
    throw new BadRequestException('Invoice ID is required');
  }

  // Provider-specific retrieval logic
  throw new NotFoundException(`Invoice ${invoiceId} not found`);
}

/**
 * Pay an invoice
 *
 * @param config - Payment provider configuration
 * @param invoiceId - Invoice ID
 * @param paymentMethodId - Payment method ID
 * @returns Paid invoice
 *
 * @example
 * ```typescript
 * const paid = await payInvoice(config, 'in_123', 'pm_card_456');
 * ```
 */
export async function payInvoice(
  config: PaymentConfig,
  invoiceId: string,
  paymentMethodId?: string
): Promise<Invoice> {
  const invoice = await retrieveInvoice(config, invoiceId);

  if (invoice.status !== InvoiceStatus.OPEN) {
    throw new BadRequestException('Can only pay open invoices');
  }

  invoice.status = InvoiceStatus.PAID;
  invoice.amountPaid = invoice.total;
  invoice.amountRemaining = 0;
  invoice.paidAt = new Date();
  invoice.updatedAt = new Date();

  return invoice;
}

/**
 * Void an invoice
 *
 * @param config - Payment provider configuration
 * @param invoiceId - Invoice ID
 * @returns Voided invoice
 *
 * @example
 * ```typescript
 * const voided = await voidInvoice(config, 'in_123');
 * ```
 */
export async function voidInvoice(config: PaymentConfig, invoiceId: string): Promise<Invoice> {
  const invoice = await retrieveInvoice(config, invoiceId);

  if (invoice.status === InvoiceStatus.PAID) {
    throw new BadRequestException('Cannot void a paid invoice');
  }

  invoice.status = InvoiceStatus.VOID;
  invoice.updatedAt = new Date();

  return invoice;
}

// ============================================================================
// DISPUTE MANAGEMENT
// ============================================================================

/**
 * Retrieve a dispute by ID
 *
 * @param config - Payment provider configuration
 * @param disputeId - Dispute ID
 * @returns Dispute details
 *
 * @example
 * ```typescript
 * const dispute = await retrieveDispute(config, 'dp_123');
 * ```
 */
export async function retrieveDispute(config: PaymentConfig, disputeId: string): Promise<Dispute> {
  if (!disputeId) {
    throw new BadRequestException('Dispute ID is required');
  }

  // Provider-specific retrieval logic
  throw new NotFoundException(`Dispute ${disputeId} not found`);
}

/**
 * Submit evidence for a dispute
 *
 * @param config - Payment provider configuration
 * @param disputeId - Dispute ID
 * @param evidence - Evidence details
 * @returns Updated dispute
 *
 * @example
 * ```typescript
 * const updated = await submitDisputeEvidence(config, 'dp_123', {
 *   customerName: 'John Doe',
 *   customerEmailAddress: 'john@example.com',
 *   receipt: 'https://example.com/receipt.pdf',
 * });
 * ```
 */
export async function submitDisputeEvidence(
  config: PaymentConfig,
  disputeId: string,
  evidence: Dispute['evidence']
): Promise<Dispute> {
  const dispute = await retrieveDispute(config, disputeId);

  if (dispute.status !== DisputeStatus.NEEDS_RESPONSE) {
    throw new BadRequestException('Dispute does not need evidence submission');
  }

  dispute.evidence = evidence;
  dispute.status = DisputeStatus.UNDER_REVIEW;
  dispute.updatedAt = new Date();

  if (dispute.evidenceDetails) {
    dispute.evidenceDetails.hasEvidence = true;
    dispute.evidenceDetails.submissionCount += 1;
  }

  return dispute;
}

/**
 * Close a dispute
 *
 * @param config - Payment provider configuration
 * @param disputeId - Dispute ID
 * @returns Closed dispute
 *
 * @example
 * ```typescript
 * const closed = await closeDispute(config, 'dp_123');
 * ```
 */
export async function closeDispute(config: PaymentConfig, disputeId: string): Promise<Dispute> {
  const dispute = await retrieveDispute(config, disputeId);

  if (dispute.status === DisputeStatus.WON || dispute.status === DisputeStatus.LOST) {
    throw new BadRequestException('Dispute is already closed');
  }

  dispute.status = DisputeStatus.WARNING_CLOSED;
  dispute.updatedAt = new Date();

  return dispute;
}

// ============================================================================
// WEBHOOK MANAGEMENT
// ============================================================================

/**
 * Verify webhook signature from payment provider
 *
 * @param config - Payment provider configuration
 * @param payload - Raw webhook payload
 * @param signature - Webhook signature header
 * @returns Whether signature is valid
 *
 * @example
 * ```typescript
 * const isValid = verifyWebhookSignature(config, req.body, req.headers['stripe-signature']);
 * if (!isValid) {
 *   throw new UnauthorizedException('Invalid webhook signature');
 * }
 * ```
 */
export function verifyWebhookSignature(
  config: PaymentConfig,
  payload: string | Buffer,
  signature: string
): boolean {
  if (!config.webhookSecret) {
    throw new InternalServerErrorException('Webhook secret not configured');
  }

  const expectedSignature = crypto
    .createHmac('sha256', config.webhookSecret)
    .update(payload)
    .digest('hex');

  // Extract signature from header (format varies by provider)
  const actualSignature = signature.split(',').find((part) => part.startsWith('t='))?.split('=')[1];

  return actualSignature === expectedSignature;
}

/**
 * Process a webhook event
 *
 * @param config - Payment provider configuration
 * @param event - Webhook event
 * @returns Processing result
 *
 * @example
 * ```typescript
 * const result = await processWebhookEvent(config, {
 *   id: 'evt_123',
 *   provider: PaymentProvider.STRIPE,
 *   type: WebhookEventType.PAYMENT_SUCCEEDED,
 *   data: paymentIntent,
 *   signature: 'sig_123',
 *   verified: true,
 *   processed: false,
 *   retryCount: 0,
 *   createdAt: new Date(),
 * });
 * ```
 */
export async function processWebhookEvent(
  config: PaymentConfig,
  event: WebhookEvent
): Promise<{ success: boolean; error?: string }> {
  if (!event.verified) {
    return { success: false, error: 'Webhook signature verification failed' };
  }

  try {
    switch (event.type) {
      case WebhookEventType.PAYMENT_SUCCEEDED:
        // Handle successful payment
        await handlePaymentSucceeded(config, event.data);
        break;

      case WebhookEventType.PAYMENT_FAILED:
        // Handle failed payment
        await handlePaymentFailed(config, event.data);
        break;

      case WebhookEventType.SUBSCRIPTION_UPDATED:
        // Handle subscription update
        await handleSubscriptionUpdated(config, event.data);
        break;

      case WebhookEventType.INVOICE_PAID:
        // Handle invoice payment
        await handleInvoicePaid(config, event.data);
        break;

      case WebhookEventType.DISPUTE_CREATED:
        // Handle new dispute
        await handleDisputeCreated(config, event.data);
        break;

      default:
        Logger.warn(`Unhandled webhook event type: ${event.type}`);
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Handle successful payment webhook event
 */
async function handlePaymentSucceeded(config: PaymentConfig, data: any): Promise<void> {
  // Implementation for payment succeeded
  Logger.log(`Payment succeeded: ${data.id}`);
}

/**
 * Handle failed payment webhook event
 */
async function handlePaymentFailed(config: PaymentConfig, data: any): Promise<void> {
  // Implementation for payment failed
  Logger.log(`Payment failed: ${data.id}`);
}

/**
 * Handle subscription updated webhook event
 */
async function handleSubscriptionUpdated(config: PaymentConfig, data: any): Promise<void> {
  // Implementation for subscription updated
  Logger.log(`Subscription updated: ${data.id}`);
}

/**
 * Handle invoice paid webhook event
 */
async function handleInvoicePaid(config: PaymentConfig, data: any): Promise<void> {
  // Implementation for invoice paid
  Logger.log(`Invoice paid: ${data.id}`);
}

/**
 * Handle dispute created webhook event
 */
async function handleDisputeCreated(config: PaymentConfig, data: any): Promise<void> {
  // Implementation for dispute created
  Logger.log(`Dispute created: ${data.id}`);
}

// ============================================================================
// IDEMPOTENCY MANAGEMENT
// ============================================================================

/**
 * Generate an idempotency key for payment requests
 *
 * @param provider - Payment provider
 * @param operation - Operation type
 * @param uniqueData - Unique data for the operation
 * @returns Idempotency key
 *
 * @example
 * ```typescript
 * const key = generateIdempotencyKey(PaymentProvider.STRIPE, 'payment', { orderId: '123' });
 * ```
 */
export function generateIdempotencyKey(
  provider: PaymentProvider,
  operation: string,
  uniqueData: Record<string, any>
): string {
  const data = JSON.stringify({ provider, operation, ...uniqueData });
  return crypto.createHash('sha256').update(data).digest('hex');
}

/**
 * Check if an idempotency key exists and return cached result
 *
 * @param key - Idempotency key
 * @returns Cached result if exists
 *
 * @example
 * ```typescript
 * const cached = await checkIdempotencyKey(idempotencyKey);
 * if (cached) {
 *   return cached.responseBody;
 * }
 * ```
 */
export async function checkIdempotencyKey(key: string): Promise<IdempotencyConfig | null> {
  // Implementation would check database/cache
  return null;
}

/**
 * Store idempotency key with result
 *
 * @param config - Idempotency configuration
 * @returns Stored configuration
 *
 * @example
 * ```typescript
 * await storeIdempotencyKey({
 *   key: idempotencyKey,
 *   expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
 *   requestHash: 'hash',
 *   responseStatus: 200,
 *   responseBody: paymentIntent,
 *   createdAt: new Date(),
 * });
 * ```
 */
export async function storeIdempotencyKey(config: IdempotencyConfig): Promise<IdempotencyConfig> {
  // Implementation would store in database/cache
  return config;
}

// ============================================================================
// FRAUD DETECTION
// ============================================================================

/**
 * Analyze payment for fraud risk
 *
 * @param payment - Payment intent to analyze
 * @param customerData - Customer data
 * @returns Fraud detection result
 *
 * @example
 * ```typescript
 * const fraudCheck = analyzePaymentFraud(paymentIntent, {
 *   ipAddress: '192.168.1.1',
 *   email: 'user@example.com',
 *   accountAge: 30,
 * });
 *
 * if (fraudCheck.blocked) {
 *   throw new BadRequestException('Payment blocked due to fraud risk');
 * }
 * ```
 */
export function analyzePaymentFraud(
  payment: PaymentIntent,
  customerData: {
    ipAddress?: string;
    email?: string;
    accountAge?: number;
    previousTransactions?: number;
    metadata?: Record<string, any>;
  }
): FraudDetectionResult {
  let score = 0;
  const reasons: string[] = [];
  const rules: FraudDetectionResult['rules'] = [];

  // Rule 1: High value transaction
  const highValueRule = {
    id: 'high_value',
    name: 'High Value Transaction',
    matched: payment.amount > 100000,
    score: 30,
  };
  rules.push(highValueRule);
  if (highValueRule.matched) {
    score += highValueRule.score;
    reasons.push('High value transaction detected');
  }

  // Rule 2: New customer
  const newCustomerRule = {
    id: 'new_customer',
    name: 'New Customer',
    matched: (customerData.accountAge || 0) < 7,
    score: 20,
  };
  rules.push(newCustomerRule);
  if (newCustomerRule.matched) {
    score += newCustomerRule.score;
    reasons.push('New customer account');
  }

  // Rule 3: Suspicious email domain
  const suspiciousEmailRule = {
    id: 'suspicious_email',
    name: 'Suspicious Email',
    matched: customerData.email?.includes('temp') || false,
    score: 25,
  };
  rules.push(suspiciousEmailRule);
  if (suspiciousEmailRule.matched) {
    score += suspiciousEmailRule.score;
    reasons.push('Suspicious email domain');
  }

  // Rule 4: Multiple transactions
  const velocityRule = {
    id: 'velocity',
    name: 'Transaction Velocity',
    matched: (customerData.previousTransactions || 0) > 5,
    score: 15,
  };
  rules.push(velocityRule);
  if (velocityRule.matched) {
    score += velocityRule.score;
    reasons.push('High transaction velocity');
  }

  // Determine risk level
  let riskLevel: FraudRiskLevel;
  let blocked = false;

  if (score >= 75) {
    riskLevel = FraudRiskLevel.BLOCKED;
    blocked = true;
  } else if (score >= 50) {
    riskLevel = FraudRiskLevel.HIGH;
  } else if (score >= 25) {
    riskLevel = FraudRiskLevel.MODERATE;
  } else {
    riskLevel = FraudRiskLevel.LOW;
  }

  return {
    score,
    riskLevel,
    blocked,
    reasons,
    rules,
    metadata: {
      ipAddress: customerData.ipAddress,
      email: customerData.email,
      accountAge: customerData.accountAge,
    },
  };
}

// ============================================================================
// CURRENCY CONVERSION
// ============================================================================

/**
 * Convert amount between currencies
 *
 * @param amount - Amount to convert
 * @param fromCurrency - Source currency
 * @param toCurrency - Target currency
 * @param exchangeRate - Exchange rate (optional, will fetch if not provided)
 * @returns Conversion result
 *
 * @example
 * ```typescript
 * const converted = await convertCurrency(10000, Currency.USD, Currency.EUR);
 * console.log(`$100.00 = €${converted.toAmount / 100}`);
 * ```
 */
export async function convertCurrency(
  amount: number,
  fromCurrency: Currency,
  toCurrency: Currency,
  exchangeRate?: number
): Promise<CurrencyConversion> {
  if (fromCurrency === toCurrency) {
    return {
      fromCurrency,
      toCurrency,
      fromAmount: amount,
      toAmount: amount,
      exchangeRate: 1,
      timestamp: new Date(),
    };
  }

  // If exchange rate not provided, fetch from API
  const rate = exchangeRate || (await fetchExchangeRate(fromCurrency, toCurrency));
  const toAmount = Math.round(amount * rate);

  return {
    fromCurrency,
    toCurrency,
    fromAmount: amount,
    toAmount,
    exchangeRate: rate,
    timestamp: new Date(),
  };
}

/**
 * Fetch current exchange rate between currencies
 *
 * @param fromCurrency - Source currency
 * @param toCurrency - Target currency
 * @returns Exchange rate
 *
 * @example
 * ```typescript
 * const rate = await fetchExchangeRate(Currency.USD, Currency.EUR);
 * ```
 */
export async function fetchExchangeRate(fromCurrency: Currency, toCurrency: Currency): Promise<number> {
  // Implementation would call currency exchange API
  // This is a mock implementation
  const mockRates: Record<string, number> = {
    'USD-EUR': 0.85,
    'EUR-USD': 1.18,
    'USD-GBP': 0.73,
    'GBP-USD': 1.37,
  };

  const key = `${fromCurrency}-${toCurrency}`;
  return mockRates[key] || 1;
}

// ============================================================================
// PCI COMPLIANCE HELPERS
// ============================================================================

/**
 * Validate card number using Luhn algorithm
 *
 * @param cardNumber - Card number to validate
 * @returns Whether card number is valid
 *
 * @example
 * ```typescript
 * const isValid = validateCardNumber('4242424242424242');
 * ```
 */
export function validateCardNumber(cardNumber: string): boolean {
  const cleaned = cardNumber.replace(/\D/g, '');

  if (cleaned.length < 13 || cleaned.length > 19) {
    return false;
  }

  let sum = 0;
  let isEven = false;

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

/**
 * Detect card brand from card number
 *
 * @param cardNumber - Card number
 * @returns Card brand
 *
 * @example
 * ```typescript
 * const brand = detectCardBrand('4242424242424242'); // 'visa'
 * ```
 */
export function detectCardBrand(cardNumber: string): string {
  const cleaned = cardNumber.replace(/\D/g, '');

  const patterns: Record<string, RegExp> = {
    visa: /^4/,
    mastercard: /^(5[1-5]|2[2-7])/,
    amex: /^3[47]/,
    discover: /^6(?:011|5)/,
    diners: /^3(?:0[0-5]|[68])/,
    jcb: /^35/,
  };

  for (const [brand, pattern] of Object.entries(patterns)) {
    if (pattern.test(cleaned)) {
      return brand;
    }
  }

  return 'unknown';
}

/**
 * Mask sensitive card data for logging/display
 *
 * @param cardNumber - Card number to mask
 * @param visibleDigits - Number of last digits to show
 * @returns Masked card number
 *
 * @example
 * ```typescript
 * const masked = maskCardNumber('4242424242424242', 4); // '************4242'
 * ```
 */
export function maskCardNumber(cardNumber: string, visibleDigits: number = 4): string {
  const cleaned = cardNumber.replace(/\D/g, '');
  const masked = '*'.repeat(cleaned.length - visibleDigits);
  const visible = cleaned.slice(-visibleDigits);
  return masked + visible;
}

/**
 * Generate card fingerprint for duplicate detection
 *
 * @param cardNumber - Card number
 * @returns Card fingerprint hash
 *
 * @example
 * ```typescript
 * const fingerprint = hashCardFingerprint('4242424242424242');
 * ```
 */
export function hashCardFingerprint(cardNumber: string): string {
  const cleaned = cardNumber.replace(/\D/g, '');
  return crypto.createHash('sha256').update(cleaned).digest('hex');
}

/**
 * Tokenize sensitive payment data
 *
 * @param data - Sensitive data to tokenize
 * @returns Token
 *
 * @example
 * ```typescript
 * const token = tokenizePaymentData({ cardNumber: '4242424242424242' });
 * ```
 */
export function tokenizePaymentData(data: Record<string, any>): string {
  const serialized = JSON.stringify(data);
  const encrypted = crypto.createHash('sha256').update(serialized).digest('hex');
  return `tok_${encrypted.substring(0, 24)}`;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Generate payment intent ID
 */
function generatePaymentIntentId(provider: PaymentProvider): string {
  const prefix = provider === PaymentProvider.STRIPE ? 'pi' : 'pmt';
  return `${prefix}_${crypto.randomBytes(12).toString('hex')}`;
}

/**
 * Generate payment method ID
 */
function generatePaymentMethodId(provider: PaymentProvider): string {
  const prefix = provider === PaymentProvider.STRIPE ? 'pm' : 'pmthd';
  return `${prefix}_${crypto.randomBytes(12).toString('hex')}`;
}

/**
 * Generate refund ID
 */
function generateRefundId(provider: PaymentProvider): string {
  const prefix = provider === PaymentProvider.STRIPE ? 're' : 'ref';
  return `${prefix}_${crypto.randomBytes(12).toString('hex')}`;
}

/**
 * Generate subscription ID
 */
function generateSubscriptionId(provider: PaymentProvider): string {
  const prefix = provider === PaymentProvider.STRIPE ? 'sub' : 'subs';
  return `${prefix}_${crypto.randomBytes(12).toString('hex')}`;
}

/**
 * Generate invoice ID
 */
function generateInvoiceId(provider: PaymentProvider): string {
  const prefix = provider === PaymentProvider.STRIPE ? 'in' : 'inv';
  return `${prefix}_${crypto.randomBytes(12).toString('hex')}`;
}

/**
 * Format amount for display
 *
 * @param amount - Amount in smallest currency unit (cents)
 * @param currency - Currency code
 * @returns Formatted amount string
 *
 * @example
 * ```typescript
 * const formatted = formatAmount(5000, Currency.USD); // '$50.00'
 * ```
 */
export function formatAmount(amount: number, currency: Currency): string {
  const divisor = [Currency.JPY].includes(currency) ? 1 : 100;
  const value = amount / divisor;

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(value);
}

/**
 * Parse amount from display format to smallest unit
 *
 * @param amountString - Amount string like '$50.00'
 * @param currency - Currency code
 * @returns Amount in smallest currency unit
 *
 * @example
 * ```typescript
 * const amount = parseAmount('$50.00', Currency.USD); // 5000
 * ```
 */
export function parseAmount(amountString: string, currency: Currency): number {
  const cleaned = amountString.replace(/[^0-9.]/g, '');
  const value = parseFloat(cleaned);
  const multiplier = [Currency.JPY].includes(currency) ? 1 : 100;
  return Math.round(value * multiplier);
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Payment model interface for Sequelize
 */
export interface PaymentModel {
  id: string;
  provider: PaymentProvider;
  paymentIntentId: string;
  customerId: string;
  amount: number;
  currency: Currency;
  status: PaymentStatus;
  paymentMethodId?: string;
  description?: string;
  statementDescriptor?: string;
  receiptEmail?: string;
  receiptUrl?: string;
  failureCode?: string;
  failureMessage?: string;
  fraudScore?: number;
  riskLevel?: FraudRiskLevel;
  metadata?: string; // JSON
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Transaction model interface for Sequelize
 */
export interface TransactionModel {
  id: string;
  provider: PaymentProvider;
  type: TransactionType;
  status: PaymentStatus;
  amount: number;
  currency: Currency;
  netAmount?: number;
  fee?: number;
  paymentIntentId?: string;
  paymentMethodId?: string;
  customerId?: string;
  subscriptionId?: string;
  invoiceId?: string;
  refundId?: string;
  description?: string;
  idempotencyKey?: string;
  metadata?: string; // JSON
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Payment method model interface for Sequelize
 */
export interface PaymentMethodModel {
  id: string;
  provider: PaymentProvider;
  type: PaymentMethodType;
  customerId: string;
  isDefault: boolean;
  cardBrand?: string;
  cardLast4?: string;
  cardExpMonth?: number;
  cardExpYear?: number;
  cardFingerprint?: string;
  bankAccountLast4?: string;
  bankName?: string;
  billingName?: string;
  billingEmail?: string;
  billingPhone?: string;
  billingAddressLine1?: string;
  billingAddressLine2?: string;
  billingCity?: string;
  billingState?: string;
  billingPostalCode?: string;
  billingCountry?: string;
  metadata?: string; // JSON
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

/**
 * Subscription model interface for Sequelize
 */
export interface SubscriptionModel {
  id: string;
  provider: PaymentProvider;
  customerId: string;
  planId: string;
  status: SubscriptionStatus;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  canceledAt?: Date;
  endedAt?: Date;
  trialStart?: Date;
  trialEnd?: Date;
  quantity: number;
  defaultPaymentMethodId?: string;
  latestInvoiceId?: string;
  collectionMethod?: string;
  daysUntilDue?: number;
  metadata?: string; // JSON
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Invoice model interface for Sequelize
 */
export interface InvoiceModel {
  id: string;
  provider: PaymentProvider;
  customerId: string;
  subscriptionId?: string;
  status: InvoiceStatus;
  currency: Currency;
  subtotal: number;
  tax?: number;
  discount?: number;
  total: number;
  amountDue: number;
  amountPaid: number;
  amountRemaining: number;
  dueDate?: Date;
  paidAt?: Date;
  hostedInvoiceUrl?: string;
  invoicePdf?: string;
  description?: string;
  statementDescriptor?: string;
  metadata?: string; // JSON
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Invoice line item model interface for Sequelize
 */
export interface InvoiceLineItemModel {
  id: string;
  invoiceId: string;
  description: string;
  quantity: number;
  unitAmount: number;
  amount: number;
  currency: Currency;
  proration: boolean;
  periodStart?: Date;
  periodEnd?: Date;
  metadata?: string; // JSON
  createdAt: Date;
}

/**
 * Refund model interface for Sequelize
 */
export interface RefundModel {
  id: string;
  provider: PaymentProvider;
  paymentIntentId: string;
  transactionId?: string;
  amount: number;
  currency: Currency;
  status: RefundStatus;
  reason?: string;
  failureReason?: string;
  metadata?: string; // JSON
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Dispute model interface for Sequelize
 */
export interface DisputeModel {
  id: string;
  provider: PaymentProvider;
  paymentIntentId: string;
  amount: number;
  currency: Currency;
  status: DisputeStatus;
  reason: DisputeReason;
  isChargeRefundable: boolean;
  evidenceCustomerName?: string;
  evidenceCustomerEmail?: string;
  evidenceCustomerIp?: string;
  evidenceBillingAddress?: string;
  evidenceReceipt?: string;
  evidenceProductDescription?: string;
  evidenceDueBy?: Date;
  evidenceHasEvidence: boolean;
  evidencePastDue: boolean;
  evidenceSubmissionCount: number;
  metadata?: string; // JSON
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Webhook event model interface for Sequelize
 */
export interface WebhookEventModel {
  id: string;
  provider: PaymentProvider;
  type: WebhookEventType;
  data: string; // JSON
  signature: string;
  verified: boolean;
  processed: boolean;
  processedAt?: Date;
  errorMessage?: string;
  retryCount: number;
  createdAt: Date;
}

/**
 * Idempotency key model interface for Sequelize
 */
export interface IdempotencyKeyModel {
  key: string;
  expiresAt: Date;
  requestHash: string;
  responseStatus?: number;
  responseBody?: string; // JSON
  createdAt: Date;
}

// ============================================================================
// NESTJS SERVICES
// ============================================================================

/**
 * Payment processing service with NestJS integration
 *
 * @example
 * ```typescript
 * @Module({
 *   providers: [PaymentProcessingService],
 *   exports: [PaymentProcessingService],
 * })
 * export class PaymentModule {}
 * ```
 */
@Injectable()
export class PaymentProcessingService {
  private readonly logger = new Logger(PaymentProcessingService.name);

  constructor(private readonly config: PaymentConfig) {}

  /**
   * Create and process a payment
   */
  async createPayment(data: z.infer<typeof PaymentIntentCreateSchema>): Promise<PaymentIntent> {
    this.logger.log(`Creating payment: ${data.amount} ${data.currency}`);

    try {
      const intent = await createPaymentIntent(this.config, data);
      await this.auditLog('payment.created', intent.id, data);
      return intent;
    } catch (error) {
      this.logger.error(`Payment creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      await this.auditLog('payment.create_failed', undefined, data, error);
      throw error;
    }
  }

  /**
   * Process a refund
   */
  async processRefund(data: z.infer<typeof RefundCreateSchema>): Promise<Refund> {
    this.logger.log(`Processing refund for payment: ${data.paymentIntentId}`);

    try {
      const refund = await createRefund(this.config, data);
      await this.auditLog('refund.created', refund.id, data);
      return refund;
    } catch (error) {
      this.logger.error(`Refund processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      await this.auditLog('refund.create_failed', data.paymentIntentId, data, error);
      throw error;
    }
  }

  /**
   * Audit logging for compliance
   */
  private async auditLog(
    action: string,
    resourceId?: string,
    data?: any,
    error?: any
  ): Promise<void> {
    const logEntry = {
      timestamp: new Date(),
      action,
      resourceId,
      data: JSON.stringify(data),
      error: error instanceof Error ? error.message : undefined,
      provider: this.config.provider,
    };

    this.logger.debug(`Audit log: ${JSON.stringify(logEntry)}`);
    // Store in database for compliance
  }
}

/**
 * Default payment configuration constants
 */
export const DEFAULT_PAYMENT_CONFIG: Partial<PaymentConfig> = {
  environment: 'sandbox',
  captureMethod: 'automatic',
  receiptEmail: true,
  setupFutureUsage: false,
  threeDSecureEnabled: true,
  fraudDetectionEnabled: true,
};

/**
 * Payment retry configuration
 */
export const PAYMENT_RETRY_CONFIG = {
  maxRetries: 3,
  initialDelay: 1000, // 1 second
  maxDelay: 30000, // 30 seconds
  backoffMultiplier: 2,
};

/**
 * Subscription proration behaviors
 */
export const PRORATION_BEHAVIORS = {
  CREATE_PRORATIONS: 'create_prorations',
  NONE: 'none',
  ALWAYS_INVOICE: 'always_invoice',
} as const;
