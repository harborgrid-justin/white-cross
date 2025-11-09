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
import { Model, ModelStatic, Sequelize, Transaction } from 'sequelize';
/**
 * Payment method types supported across gateways
 */
export declare enum PaymentMethod {
    CREDIT_CARD = "credit_card",
    DEBIT_CARD = "debit_card",
    ACH = "ach",
    WIRE_TRANSFER = "wire_transfer",
    PAYPAL = "paypal",
    APPLE_PAY = "apple_pay",
    GOOGLE_PAY = "google_pay",
    SEPA_DEBIT = "sepa_debit",
    BANK_TRANSFER = "bank_transfer",
    CHECK = "check",
    CASH = "cash",
    CRYPTOCURRENCY = "cryptocurrency"
}
/**
 * Payment transaction status
 */
export declare enum PaymentStatus {
    PENDING = "pending",
    AUTHORIZED = "authorized",
    CAPTURED = "captured",
    PARTIALLY_CAPTURED = "partially_captured",
    SUCCESS = "success",
    FAILED = "failed",
    DECLINED = "declined",
    REFUNDED = "refunded",
    PARTIALLY_REFUNDED = "partially_refunded",
    VOIDED = "voided",
    CANCELLED = "cancelled",
    DISPUTED = "disputed",
    CHARGEBACK = "chargeback",
    REVERSED = "reversed",
    PROCESSING = "processing",
    REQUIRES_ACTION = "requires_action",
    REQUIRES_CAPTURE = "requires_capture"
}
/**
 * Invoice status lifecycle
 */
export declare enum InvoiceStatus {
    DRAFT = "draft",
    OPEN = "open",
    SENT = "sent",
    VIEWED = "viewed",
    PAID = "paid",
    PARTIALLY_PAID = "partially_paid",
    OVERDUE = "overdue",
    VOID = "void",
    UNCOLLECTIBLE = "uncollectible",
    REFUNDED = "refunded",
    DISPUTED = "disputed",
    CANCELLED = "cancelled"
}
/**
 * Billing cycle frequencies
 */
export declare enum BillingCycle {
    DAILY = "daily",
    WEEKLY = "weekly",
    BIWEEKLY = "biweekly",
    MONTHLY = "monthly",
    QUARTERLY = "quarterly",
    SEMI_ANNUAL = "semi_annual",
    ANNUAL = "annual",
    BIENNIAL = "biennial",
    TRIENNIAL = "triennial",
    ONE_TIME = "one_time",
    USAGE_BASED = "usage_based"
}
/**
 * Subscription status
 */
export declare enum SubscriptionStatus {
    TRIAL = "trial",
    ACTIVE = "active",
    PAST_DUE = "past_due",
    CANCELLED = "cancelled",
    SUSPENDED = "suspended",
    PAUSED = "paused",
    EXPIRED = "expired",
    INCOMPLETE = "incomplete",
    INCOMPLETE_EXPIRED = "incomplete_expired",
    PENDING_CANCELLATION = "pending_cancellation"
}
/**
 * Supported payment gateways
 */
export declare enum PaymentGateway {
    STRIPE = "stripe",
    PAYPAL = "paypal",
    AUTHORIZE_NET = "authorize_net",
    BRAINTREE = "braintree",
    SQUARE = "square",
    ADYEN = "adyen",
    WORLDPAY = "worldpay",
    CHECKOUT_COM = "checkout_com",
    INTERNAL = "internal"
}
/**
 * Payment gateway transaction types
 */
export declare enum GatewayTransactionType {
    AUTHORIZE = "authorize",
    CAPTURE = "capture",
    SALE = "sale",
    REFUND = "refund",
    VOID = "void",
    CREDIT = "credit",
    VERIFY = "verify"
}
/**
 * Installment frequency options
 */
export declare enum InstallmentFrequency {
    WEEKLY = "weekly",
    BIWEEKLY = "biweekly",
    MONTHLY = "monthly",
    QUARTERLY = "quarterly",
    SEMI_ANNUAL = "semi_annual"
}
/**
 * Dunning workflow stages
 */
export declare enum DunningStage {
    INITIAL = "initial",
    FIRST_REMINDER = "first_reminder",
    SECOND_REMINDER = "second_reminder",
    FINAL_NOTICE = "final_notice",
    COLLECTION = "collection",
    SUSPENDED = "suspended",
    RESOLVED = "resolved"
}
/**
 * Payment retry strategy types
 */
export declare enum RetryStrategy {
    LINEAR = "linear",
    EXPONENTIAL = "exponential",
    CUSTOM = "custom",
    SMART = "smart"
}
/**
 * Credit memo types
 */
export declare enum CreditMemoType {
    REFUND = "refund",
    CREDIT_NOTE = "credit_note",
    ADJUSTMENT = "adjustment",
    DISCOUNT = "discount",
    GOODWILL = "goodwill"
}
/**
 * Currency codes (ISO 4217)
 */
export declare enum Currency {
    USD = "USD",
    EUR = "EUR",
    GBP = "GBP",
    CAD = "CAD",
    AUD = "AUD",
    JPY = "JPY",
    CNY = "CNY",
    INR = "INR",
    BRL = "BRL",
    MXN = "MXN"
}
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
    retryIntervals: number[];
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
/**
 * Invoice model definition
 */
export declare const defineInvoiceModel: (sequelize: Sequelize) => ModelStatic<Model>;
/**
 * Payment model definition
 */
export declare const definePaymentModel: (sequelize: Sequelize) => ModelStatic<Model>;
/**
 * Subscription model definition
 */
export declare const defineSubscriptionModel: (sequelize: Sequelize) => ModelStatic<Model>;
/**
 * Generate a new invoice for a customer
 *
 * @param sequelize - Sequelize instance
 * @param invoiceData - Invoice creation data
 * @param transaction - Optional database transaction
 * @returns Created invoice with generated invoice number
 */
export declare function generateInvoice(sequelize: Sequelize, invoiceData: {
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
}, transaction?: Transaction): Promise<Invoice>;
/**
 * Update an existing invoice
 *
 * @param sequelize - Sequelize instance
 * @param invoiceId - Invoice ID to update
 * @param updates - Fields to update
 * @param transaction - Optional database transaction
 * @returns Updated invoice
 */
export declare function updateInvoice(sequelize: Sequelize, invoiceId: string, updates: {
    status?: InvoiceStatus;
    dueDate?: Date;
    notes?: string;
    termsAndConditions?: string;
    metadata?: Record<string, any>;
}, transaction?: Transaction): Promise<Invoice>;
/**
 * Void an invoice (cannot be paid or modified after voiding)
 *
 * @param sequelize - Sequelize instance
 * @param invoiceId - Invoice ID to void
 * @param reason - Reason for voiding
 * @param transaction - Optional database transaction
 * @returns Voided invoice
 */
export declare function voidInvoice(sequelize: Sequelize, invoiceId: string, reason: string, transaction?: Transaction): Promise<Invoice>;
/**
 * Create a credit memo for an invoice or customer
 *
 * @param sequelize - Sequelize instance
 * @param creditMemoData - Credit memo data
 * @param transaction - Optional database transaction
 * @returns Created credit memo
 */
export declare function createCreditMemo(sequelize: Sequelize, creditMemoData: {
    customerId: string;
    invoiceId?: string;
    type: CreditMemoType;
    amount: number;
    currency?: Currency;
    reason: string;
    metadata?: Record<string, any>;
}, transaction?: Transaction): Promise<CreditMemo>;
/**
 * Apply a credit memo to an invoice
 *
 * @param sequelize - Sequelize instance
 * @param creditMemoId - Credit memo ID
 * @param invoiceId - Invoice ID to apply credit to
 * @param transaction - Optional database transaction
 * @returns Updated invoice and credit memo
 */
export declare function applyCreditMemoToInvoice(sequelize: Sequelize, creditMemoId: string, invoiceId: string, transaction?: Transaction): Promise<{
    invoice: Invoice;
    creditMemo: CreditMemo;
}>;
/**
 * Process a payment for an invoice
 *
 * @param sequelize - Sequelize instance
 * @param paymentData - Payment processing data
 * @param transaction - Optional database transaction
 * @returns Created payment record
 */
export declare function processPayment(sequelize: Sequelize, paymentData: {
    invoiceId?: string;
    customerId: string;
    subscriptionId?: string;
    paymentMethodId: string;
    amount: number;
    currency?: Currency;
    gateway: PaymentGateway;
    metadata?: Record<string, any>;
}, transaction?: Transaction): Promise<Payment>;
/**
 * Authorize a payment (hold funds without capturing)
 *
 * @param sequelize - Sequelize instance
 * @param authorizationData - Authorization data
 * @param transaction - Optional database transaction
 * @returns Created payment record with authorized status
 */
export declare function authorizePayment(sequelize: Sequelize, authorizationData: {
    invoiceId?: string;
    customerId: string;
    paymentMethodId: string;
    amount: number;
    currency?: Currency;
    gateway: PaymentGateway;
    metadata?: Record<string, any>;
}, transaction?: Transaction): Promise<Payment>;
/**
 * Capture a previously authorized payment
 *
 * @param sequelize - Sequelize instance
 * @param paymentId - Payment ID to capture
 * @param amount - Amount to capture (can be less than authorized amount)
 * @param transaction - Optional database transaction
 * @returns Updated payment record
 */
export declare function capturePayment(sequelize: Sequelize, paymentId: string, amount?: number, transaction?: Transaction): Promise<Payment>;
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
export declare function refundPayment(sequelize: Sequelize, paymentId: string, amount?: number, reason?: string, transaction?: Transaction): Promise<Payment>;
/**
 * Void a payment (cancel authorized or pending payment)
 *
 * @param sequelize - Sequelize instance
 * @param paymentId - Payment ID to void
 * @param reason - Reason for voiding
 * @param transaction - Optional database transaction
 * @returns Updated payment record
 */
export declare function voidPayment(sequelize: Sequelize, paymentId: string, reason: string, transaction?: Transaction): Promise<Payment>;
/**
 * Create and tokenize a payment method with gateway
 *
 * @param sequelize - Sequelize instance
 * @param paymentMethodData - Payment method data
 * @param transaction - Optional database transaction
 * @returns Created payment method record
 */
export declare function tokenizePaymentMethod(sequelize: Sequelize, paymentMethodData: {
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
}, transaction?: Transaction): Promise<PaymentMethodRecord>;
/**
 * Delete a tokenized payment method
 *
 * @param sequelize - Sequelize instance
 * @param paymentMethodId - Payment method ID to delete
 * @param transaction - Optional database transaction
 */
export declare function deletePaymentMethod(sequelize: Sequelize, paymentMethodId: string, transaction?: Transaction): Promise<void>;
/**
 * Verify a payment method (micro-transactions or other verification)
 *
 * @param sequelize - Sequelize instance
 * @param paymentMethodId - Payment method ID to verify
 * @param verificationData - Verification data (amounts, codes, etc.)
 * @param transaction - Optional database transaction
 * @returns Verification result
 */
export declare function verifyPaymentMethod(sequelize: Sequelize, paymentMethodId: string, verificationData: Record<string, any>, transaction?: Transaction): Promise<{
    verified: boolean;
    message?: string;
}>;
/**
 * Create a new subscription
 *
 * @param sequelize - Sequelize instance
 * @param subscriptionData - Subscription creation data
 * @param transaction - Optional database transaction
 * @returns Created subscription
 */
export declare function createSubscription(sequelize: Sequelize, subscriptionData: {
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
}, transaction?: Transaction): Promise<Subscription>;
/**
 * Process recurring billing for a subscription
 *
 * @param sequelize - Sequelize instance
 * @param subscriptionId - Subscription ID
 * @param billingDate - Date to process billing for
 * @param transaction - Optional database transaction
 * @returns Created invoice and payment result
 */
export declare function processRecurringBilling(sequelize: Sequelize, subscriptionId: string, billingDate: Date, transaction?: Transaction): Promise<{
    invoice: Invoice;
    payment?: Payment;
}>;
/**
 * Cancel a subscription
 *
 * @param sequelize - Sequelize instance
 * @param subscriptionId - Subscription ID to cancel
 * @param cancelAtPeriodEnd - Whether to cancel immediately or at period end
 * @param transaction - Optional database transaction
 * @returns Updated subscription
 */
export declare function cancelSubscription(sequelize: Sequelize, subscriptionId: string, cancelAtPeriodEnd?: boolean, transaction?: Transaction): Promise<Subscription>;
/**
 * Upgrade or downgrade a subscription (with proration)
 *
 * @param sequelize - Sequelize instance
 * @param subscriptionId - Subscription ID
 * @param newPlanData - New plan data
 * @param transaction - Optional database transaction
 * @returns Updated subscription and proration invoice
 */
export declare function changeSubscriptionPlan(sequelize: Sequelize, subscriptionId: string, newPlanData: {
    planId: string;
    unitPrice: number;
    quantity?: number;
}, transaction?: Transaction): Promise<{
    subscription: Subscription;
    prorationInvoice?: Invoice;
}>;
/**
 * Pause a subscription (stop billing without cancelling)
 *
 * @param sequelize - Sequelize instance
 * @param subscriptionId - Subscription ID to pause
 * @param transaction - Optional database transaction
 * @returns Updated subscription
 */
export declare function pauseSubscription(sequelize: Sequelize, subscriptionId: string, transaction?: Transaction): Promise<Subscription>;
/**
 * Resume a paused subscription
 *
 * @param sequelize - Sequelize instance
 * @param subscriptionId - Subscription ID to resume
 * @param transaction - Optional database transaction
 * @returns Updated subscription
 */
export declare function resumeSubscription(sequelize: Sequelize, subscriptionId: string, transaction?: Transaction): Promise<Subscription>;
/**
 * Create a payment plan with installments
 *
 * @param sequelize - Sequelize instance
 * @param planData - Payment plan data
 * @param transaction - Optional database transaction
 * @returns Created payment plan with installments
 */
export declare function createPaymentPlan(sequelize: Sequelize, planData: {
    customerId: string;
    invoiceId?: string;
    totalAmount: number;
    currency?: Currency;
    installments: number;
    frequency: InstallmentFrequency;
    startDate?: Date;
    paymentMethodId: string;
    metadata?: Record<string, any>;
}, transaction?: Transaction): Promise<PaymentPlan>;
/**
 * Process an installment payment
 *
 * @param sequelize - Sequelize instance
 * @param paymentPlanId - Payment plan ID
 * @param installmentNumber - Installment number to process
 * @param transaction - Optional database transaction
 * @returns Payment result
 */
export declare function processInstallmentPayment(sequelize: Sequelize, paymentPlanId: string, installmentNumber: number, transaction?: Transaction): Promise<{
    installment: Installment;
    payment: Payment;
}>;
/**
 * Get upcoming installments for a payment plan
 *
 * @param sequelize - Sequelize instance
 * @param paymentPlanId - Payment plan ID
 * @param limit - Maximum number of installments to return
 * @returns Upcoming installments
 */
export declare function getUpcomingInstallments(sequelize: Sequelize, paymentPlanId: string, limit?: number): Promise<Installment[]>;
/**
 * Calculate late fees for overdue invoices
 *
 * @param sequelize - Sequelize instance
 * @param invoiceId - Invoice ID
 * @param lateFeeConfig - Late fee configuration
 * @param transaction - Optional database transaction
 * @returns Calculated late fee amount
 */
export declare function calculateLateFee(sequelize: Sequelize, invoiceId: string, lateFeeConfig: {
    flatFee?: number;
    percentageFee?: number;
    gracePeriodDays?: number;
    maxFee?: number;
}, transaction?: Transaction): Promise<number>;
/**
 * Apply late fee to an invoice
 *
 * @param sequelize - Sequelize instance
 * @param invoiceId - Invoice ID
 * @param lateFeeAmount - Late fee amount to apply
 * @param transaction - Optional database transaction
 * @returns Updated invoice
 */
export declare function applyLateFeeToInvoice(sequelize: Sequelize, invoiceId: string, lateFeeAmount: number, transaction?: Transaction): Promise<Invoice>;
/**
 * Process late fees for all overdue invoices
 *
 * @param sequelize - Sequelize instance
 * @param lateFeeConfig - Late fee configuration
 * @param transaction - Optional database transaction
 * @returns Summary of late fees applied
 */
export declare function processOverdueInvoiceLateFees(sequelize: Sequelize, lateFeeConfig: {
    flatFee?: number;
    percentageFee?: number;
    gracePeriodDays?: number;
    maxFee?: number;
}, transaction?: Transaction): Promise<{
    processedCount: number;
    totalFeesApplied: number;
}>;
/**
 * Reconcile payments for a specific date and gateway
 *
 * @param sequelize - Sequelize instance
 * @param reconciliationData - Reconciliation parameters
 * @param transaction - Optional database transaction
 * @returns Reconciliation result
 */
export declare function reconcilePayments(sequelize: Sequelize, reconciliationData: {
    reconciliationDate: Date;
    gateway: PaymentGateway;
    expectedAmount: number;
    actualAmount: number;
    reconciledBy: string;
    notes?: string;
    metadata?: Record<string, any>;
}, transaction?: Transaction): Promise<PaymentReconciliation>;
/**
 * Get payment settlement report for a date range
 *
 * @param sequelize - Sequelize instance
 * @param startDate - Start date
 * @param endDate - End date
 * @param gateway - Optional gateway filter
 * @returns Settlement report
 */
export declare function getPaymentSettlementReport(sequelize: Sequelize, startDate: Date, endDate: Date, gateway?: PaymentGateway): Promise<{
    totalPayments: number;
    successfulPayments: number;
    totalAmount: number;
    totalFees: number;
    netAmount: number;
    byGateway: Record<string, any>;
}>;
/**
 * Create a dunning workflow for a failed payment
 *
 * @param sequelize - Sequelize instance
 * @param dunningData - Dunning workflow data
 * @param transaction - Optional database transaction
 * @returns Created dunning workflow
 */
export declare function createDunningWorkflow(sequelize: Sequelize, dunningData: {
    customerId: string;
    subscriptionId?: string;
    invoiceId: string;
    metadata?: Record<string, any>;
}, transaction?: Transaction): Promise<DunningWorkflow>;
/**
 * Process dunning workflow stage
 *
 * @param sequelize - Sequelize instance
 * @param dunningId - Dunning workflow ID
 * @param transaction - Optional database transaction
 * @returns Updated dunning workflow and payment result
 */
export declare function processDunningStage(sequelize: Sequelize, dunningId: string, transaction?: Transaction): Promise<{
    dunning: DunningWorkflow;
    payment?: Payment;
}>;
/**
 * Get active dunning workflows
 *
 * @param sequelize - Sequelize instance
 * @param filters - Optional filters
 * @returns Active dunning workflows
 */
export declare function getActiveDunningWorkflows(sequelize: Sequelize, filters?: {
    customerId?: string;
    stage?: DunningStage;
    dueForRetry?: boolean;
}): Promise<DunningWorkflow[]>;
/**
 * Configure payment retry strategy for a customer
 *
 * @param sequelize - Sequelize instance
 * @param retryConfig - Retry configuration
 * @param transaction - Optional database transaction
 * @returns Created retry configuration
 */
export declare function configurePaymentRetryStrategy(sequelize: Sequelize, retryConfig: {
    customerId?: string;
    strategy: RetryStrategy;
    maxAttempts: number;
    retryIntervals: number[];
    enabled?: boolean;
    metadata?: Record<string, any>;
}, transaction?: Transaction): Promise<PaymentRetryConfig>;
/**
 * Retry a failed payment with intelligent timing
 *
 * @param sequelize - Sequelize instance
 * @param paymentId - Failed payment ID
 * @param retryAttempt - Retry attempt number
 * @param transaction - Optional database transaction
 * @returns New payment attempt
 */
export declare function retryFailedPayment(sequelize: Sequelize, paymentId: string, retryAttempt: number, transaction?: Transaction): Promise<Payment>;
/**
 * Calculate next retry time based on strategy
 *
 * @param strategy - Retry strategy
 * @param attemptNumber - Current attempt number
 * @param baseInterval - Base interval in hours
 * @returns Next retry date
 */
export declare function calculateNextRetryTime(strategy: RetryStrategy, attemptNumber: number, baseInterval?: number): Date;
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
export declare function convertCurrency(sequelize: Sequelize, amount: number, fromCurrency: Currency, toCurrency: Currency, effectiveDate?: Date): Promise<number>;
/**
 * Process multi-currency payment with conversion
 *
 * @param sequelize - Sequelize instance
 * @param paymentData - Payment data with currency conversion
 * @param transaction - Optional database transaction
 * @returns Payment with conversion details
 */
export declare function processMultiCurrencyPayment(sequelize: Sequelize, paymentData: {
    invoiceId: string;
    customerId: string;
    paymentMethodId: string;
    paymentCurrency: Currency;
    gateway: PaymentGateway;
    metadata?: Record<string, any>;
}, transaction?: Transaction): Promise<{
    payment: Payment;
    conversionDetails: any;
}>;
//# sourceMappingURL=payment-processing-billing-kit.d.ts.map