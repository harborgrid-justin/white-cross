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
import { z } from 'zod';
/**
 * Supported payment providers
 */
export declare enum PaymentProvider {
    STRIPE = "stripe",
    PAYPAL = "paypal",
    SQUARE = "square",
    BRAINTREE = "braintree",
    AUTHORIZE_NET = "authorize_net"
}
/**
 * Payment method types
 */
export declare enum PaymentMethodType {
    CARD = "card",
    BANK_ACCOUNT = "bank_account",
    ACH = "ach",
    WIRE = "wire",
    PAYPAL = "paypal",
    APPLE_PAY = "apple_pay",
    GOOGLE_PAY = "google_pay",
    SEPA_DEBIT = "sepa_debit",
    IDEAL = "ideal",
    ALIPAY = "alipay"
}
/**
 * Payment status enum
 */
export declare enum PaymentStatus {
    PENDING = "pending",
    PROCESSING = "processing",
    REQUIRES_ACTION = "requires_action",
    REQUIRES_CONFIRMATION = "requires_confirmation",
    SUCCEEDED = "succeeded",
    FAILED = "failed",
    CANCELED = "canceled",
    REFUNDED = "refunded",
    PARTIALLY_REFUNDED = "partially_refunded",
    DISPUTED = "disputed"
}
/**
 * Transaction types
 */
export declare enum TransactionType {
    PAYMENT = "payment",
    REFUND = "refund",
    PAYOUT = "payout",
    TRANSFER = "transfer",
    ADJUSTMENT = "adjustment",
    FEE = "fee",
    CHARGEBACK = "chargeback"
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
    CHF = "CHF",
    CNY = "CNY",
    INR = "INR",
    MXN = "MXN"
}
/**
 * Subscription status
 */
export declare enum SubscriptionStatus {
    ACTIVE = "active",
    TRIALING = "trialing",
    PAST_DUE = "past_due",
    CANCELED = "canceled",
    UNPAID = "unpaid",
    PAUSED = "paused",
    INCOMPLETE = "incomplete",
    INCOMPLETE_EXPIRED = "incomplete_expired"
}
/**
 * Subscription interval
 */
export declare enum BillingInterval {
    DAY = "day",
    WEEK = "week",
    MONTH = "month",
    YEAR = "year"
}
/**
 * Invoice status
 */
export declare enum InvoiceStatus {
    DRAFT = "draft",
    OPEN = "open",
    PAID = "paid",
    VOID = "void",
    UNCOLLECTIBLE = "uncollectible",
    OVERDUE = "overdue"
}
/**
 * Refund status
 */
export declare enum RefundStatus {
    PENDING = "pending",
    SUCCEEDED = "succeeded",
    FAILED = "failed",
    CANCELED = "canceled"
}
/**
 * Dispute status
 */
export declare enum DisputeStatus {
    WARNING_NEEDS_RESPONSE = "warning_needs_response",
    WARNING_UNDER_REVIEW = "warning_under_review",
    WARNING_CLOSED = "warning_closed",
    NEEDS_RESPONSE = "needs_response",
    UNDER_REVIEW = "under_review",
    CHARGE_REFUNDED = "charge_refunded",
    WON = "won",
    LOST = "lost"
}
/**
 * Dispute reason
 */
export declare enum DisputeReason {
    FRAUDULENT = "fraudulent",
    DUPLICATE = "duplicate",
    SUBSCRIPTION_CANCELED = "subscription_canceled",
    PRODUCT_UNACCEPTABLE = "product_unacceptable",
    PRODUCT_NOT_RECEIVED = "product_not_received",
    UNRECOGNIZED = "unrecognized",
    CREDIT_NOT_PROCESSED = "credit_not_processed",
    GENERAL = "general"
}
/**
 * Webhook event types
 */
export declare enum WebhookEventType {
    PAYMENT_SUCCEEDED = "payment.succeeded",
    PAYMENT_FAILED = "payment.failed",
    REFUND_CREATED = "refund.created",
    REFUND_UPDATED = "refund.updated",
    SUBSCRIPTION_CREATED = "subscription.created",
    SUBSCRIPTION_UPDATED = "subscription.updated",
    SUBSCRIPTION_DELETED = "subscription.deleted",
    INVOICE_CREATED = "invoice.created",
    INVOICE_PAID = "invoice.paid",
    INVOICE_PAYMENT_FAILED = "invoice.payment_failed",
    DISPUTE_CREATED = "dispute.created",
    DISPUTE_UPDATED = "dispute.updated",
    DISPUTE_CLOSED = "dispute.closed"
}
/**
 * Fraud risk level
 */
export declare enum FraudRiskLevel {
    LOW = "low",
    MODERATE = "moderate",
    HIGH = "high",
    BLOCKED = "blocked"
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
    score: number;
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
/**
 * Payment intent creation schema
 */
export declare const PaymentIntentCreateSchema: any;
/**
 * Payment method creation schema
 */
export declare const PaymentMethodCreateSchema: any;
/**
 * Refund creation schema
 */
export declare const RefundCreateSchema: any;
/**
 * Subscription creation schema
 */
export declare const SubscriptionCreateSchema: any;
/**
 * Invoice creation schema
 */
export declare const InvoiceCreateSchema: any;
/**
 * Card validation schema
 */
export declare const CardValidationSchema: any;
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
export declare function createPaymentIntent(config: PaymentConfig, data: z.infer<typeof PaymentIntentCreateSchema>): Promise<PaymentIntent>;
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
export declare function confirmPaymentIntent(config: PaymentConfig, intentId: string, paymentMethodId?: string): Promise<PaymentIntent>;
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
export declare function retrievePaymentIntent(config: PaymentConfig, intentId: string): Promise<PaymentIntent>;
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
export declare function cancelPaymentIntent(config: PaymentConfig, intentId: string): Promise<PaymentIntent>;
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
export declare function capturePaymentIntent(config: PaymentConfig, intentId: string, amountToCapture?: number): Promise<PaymentIntent>;
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
export declare function createPaymentMethod(config: PaymentConfig, data: z.infer<typeof PaymentMethodCreateSchema>): Promise<PaymentMethod>;
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
export declare function retrievePaymentMethod(config: PaymentConfig, paymentMethodId: string): Promise<PaymentMethod>;
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
export declare function listPaymentMethods(config: PaymentConfig, customerId: string, type?: PaymentMethodType): Promise<PaymentMethod[]>;
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
export declare function detachPaymentMethod(config: PaymentConfig, paymentMethodId: string): Promise<PaymentMethod>;
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
export declare function setDefaultPaymentMethod(config: PaymentConfig, customerId: string, paymentMethodId: string): Promise<PaymentMethod>;
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
export declare function create3DSecureAuth(config: PaymentConfig, intentId: string, options: ThreeDSecureOptions): Promise<PaymentIntent>;
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
export declare function verify3DSecureAuth(config: PaymentConfig, intentId: string, authenticationResult: string): Promise<PaymentIntent>;
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
export declare function createRefund(config: PaymentConfig, data: z.infer<typeof RefundCreateSchema>): Promise<Refund>;
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
export declare function retrieveRefund(config: PaymentConfig, refundId: string): Promise<Refund>;
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
export declare function listRefunds(config: PaymentConfig, paymentIntentId: string): Promise<Refund[]>;
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
export declare function cancelRefund(config: PaymentConfig, refundId: string): Promise<Refund>;
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
export declare function createSubscription(config: PaymentConfig, data: z.infer<typeof SubscriptionCreateSchema>): Promise<Subscription>;
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
export declare function updateSubscription(config: PaymentConfig, subscriptionId: string, updates: Partial<Subscription>): Promise<Subscription>;
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
export declare function retrieveSubscription(config: PaymentConfig, subscriptionId: string): Promise<Subscription>;
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
export declare function cancelSubscription(config: PaymentConfig, subscriptionId: string, atPeriodEnd?: boolean): Promise<Subscription>;
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
export declare function reactivateSubscription(config: PaymentConfig, subscriptionId: string): Promise<Subscription>;
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
export declare function calculateSubscriptionProration(subscription: Subscription, newQuantity: number, newPlanAmount: number): number;
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
export declare function createInvoice(config: PaymentConfig, data: z.infer<typeof InvoiceCreateSchema>): Promise<Invoice>;
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
export declare function addInvoiceLineItem(invoice: Invoice, lineItem: InvoiceLineItem): Invoice;
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
export declare function finalizeInvoice(config: PaymentConfig, invoiceId: string): Promise<Invoice>;
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
export declare function retrieveInvoice(config: PaymentConfig, invoiceId: string): Promise<Invoice>;
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
export declare function payInvoice(config: PaymentConfig, invoiceId: string, paymentMethodId?: string): Promise<Invoice>;
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
export declare function voidInvoice(config: PaymentConfig, invoiceId: string): Promise<Invoice>;
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
export declare function retrieveDispute(config: PaymentConfig, disputeId: string): Promise<Dispute>;
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
export declare function submitDisputeEvidence(config: PaymentConfig, disputeId: string, evidence: Dispute['evidence']): Promise<Dispute>;
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
export declare function closeDispute(config: PaymentConfig, disputeId: string): Promise<Dispute>;
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
export declare function verifyWebhookSignature(config: PaymentConfig, payload: string | Buffer, signature: string): boolean;
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
export declare function processWebhookEvent(config: PaymentConfig, event: WebhookEvent): Promise<{
    success: boolean;
    error?: string;
}>;
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
export declare function generateIdempotencyKey(provider: PaymentProvider, operation: string, uniqueData: Record<string, any>): string;
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
export declare function checkIdempotencyKey(key: string): Promise<IdempotencyConfig | null>;
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
export declare function storeIdempotencyKey(config: IdempotencyConfig): Promise<IdempotencyConfig>;
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
export declare function analyzePaymentFraud(payment: PaymentIntent, customerData: {
    ipAddress?: string;
    email?: string;
    accountAge?: number;
    previousTransactions?: number;
    metadata?: Record<string, any>;
}): FraudDetectionResult;
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
export declare function convertCurrency(amount: number, fromCurrency: Currency, toCurrency: Currency, exchangeRate?: number): Promise<CurrencyConversion>;
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
export declare function fetchExchangeRate(fromCurrency: Currency, toCurrency: Currency): Promise<number>;
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
export declare function validateCardNumber(cardNumber: string): boolean;
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
export declare function detectCardBrand(cardNumber: string): string;
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
export declare function maskCardNumber(cardNumber: string, visibleDigits?: number): string;
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
export declare function hashCardFingerprint(cardNumber: string): string;
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
export declare function tokenizePaymentData(data: Record<string, any>): string;
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
export declare function formatAmount(amount: number, currency: Currency): string;
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
export declare function parseAmount(amountString: string, currency: Currency): number;
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
    metadata?: string;
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
    metadata?: string;
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
    metadata?: string;
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
    metadata?: string;
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
    metadata?: string;
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
    metadata?: string;
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
    metadata?: string;
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
    metadata?: string;
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
    data: string;
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
    responseBody?: string;
    createdAt: Date;
}
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
export declare class PaymentProcessingService {
    private readonly config;
    private readonly logger;
    constructor(config: PaymentConfig);
    /**
     * Create and process a payment
     */
    createPayment(data: z.infer<typeof PaymentIntentCreateSchema>): Promise<PaymentIntent>;
    /**
     * Process a refund
     */
    processRefund(data: z.infer<typeof RefundCreateSchema>): Promise<Refund>;
    /**
     * Audit logging for compliance
     */
    private auditLog;
}
/**
 * Default payment configuration constants
 */
export declare const DEFAULT_PAYMENT_CONFIG: Partial<PaymentConfig>;
/**
 * Payment retry configuration
 */
export declare const PAYMENT_RETRY_CONFIG: {
    maxRetries: number;
    initialDelay: number;
    maxDelay: number;
    backoffMultiplier: number;
};
/**
 * Subscription proration behaviors
 */
export declare const PRORATION_BEHAVIORS: {
    readonly CREATE_PRORATIONS: "create_prorations";
    readonly NONE: "none";
    readonly ALWAYS_INVOICE: "always_invoice";
};
//# sourceMappingURL=payment-processing-kit.prod.d.ts.map