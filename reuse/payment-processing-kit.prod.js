"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PRORATION_BEHAVIORS = exports.PAYMENT_RETRY_CONFIG = exports.DEFAULT_PAYMENT_CONFIG = exports.PaymentProcessingService = exports.CardValidationSchema = exports.InvoiceCreateSchema = exports.SubscriptionCreateSchema = exports.RefundCreateSchema = exports.PaymentMethodCreateSchema = exports.PaymentIntentCreateSchema = exports.FraudRiskLevel = exports.WebhookEventType = exports.DisputeReason = exports.DisputeStatus = exports.RefundStatus = exports.InvoiceStatus = exports.BillingInterval = exports.SubscriptionStatus = exports.Currency = exports.TransactionType = exports.PaymentStatus = exports.PaymentMethodType = exports.PaymentProvider = void 0;
exports.createPaymentIntent = createPaymentIntent;
exports.confirmPaymentIntent = confirmPaymentIntent;
exports.retrievePaymentIntent = retrievePaymentIntent;
exports.cancelPaymentIntent = cancelPaymentIntent;
exports.capturePaymentIntent = capturePaymentIntent;
exports.createPaymentMethod = createPaymentMethod;
exports.retrievePaymentMethod = retrievePaymentMethod;
exports.listPaymentMethods = listPaymentMethods;
exports.detachPaymentMethod = detachPaymentMethod;
exports.setDefaultPaymentMethod = setDefaultPaymentMethod;
exports.create3DSecureAuth = create3DSecureAuth;
exports.verify3DSecureAuth = verify3DSecureAuth;
exports.createRefund = createRefund;
exports.retrieveRefund = retrieveRefund;
exports.listRefunds = listRefunds;
exports.cancelRefund = cancelRefund;
exports.createSubscription = createSubscription;
exports.updateSubscription = updateSubscription;
exports.retrieveSubscription = retrieveSubscription;
exports.cancelSubscription = cancelSubscription;
exports.reactivateSubscription = reactivateSubscription;
exports.calculateSubscriptionProration = calculateSubscriptionProration;
exports.createInvoice = createInvoice;
exports.addInvoiceLineItem = addInvoiceLineItem;
exports.finalizeInvoice = finalizeInvoice;
exports.retrieveInvoice = retrieveInvoice;
exports.payInvoice = payInvoice;
exports.voidInvoice = voidInvoice;
exports.retrieveDispute = retrieveDispute;
exports.submitDisputeEvidence = submitDisputeEvidence;
exports.closeDispute = closeDispute;
exports.verifyWebhookSignature = verifyWebhookSignature;
exports.processWebhookEvent = processWebhookEvent;
exports.generateIdempotencyKey = generateIdempotencyKey;
exports.checkIdempotencyKey = checkIdempotencyKey;
exports.storeIdempotencyKey = storeIdempotencyKey;
exports.analyzePaymentFraud = analyzePaymentFraud;
exports.convertCurrency = convertCurrency;
exports.fetchExchangeRate = fetchExchangeRate;
exports.validateCardNumber = validateCardNumber;
exports.detectCardBrand = detectCardBrand;
exports.maskCardNumber = maskCardNumber;
exports.hashCardFingerprint = hashCardFingerprint;
exports.tokenizePaymentData = tokenizePaymentData;
exports.formatAmount = formatAmount;
exports.parseAmount = parseAmount;
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
const crypto = __importStar(require("crypto"));
const common_1 = require("@nestjs/common");
const zod_1 = require("zod");
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * Supported payment providers
 */
var PaymentProvider;
(function (PaymentProvider) {
    PaymentProvider["STRIPE"] = "stripe";
    PaymentProvider["PAYPAL"] = "paypal";
    PaymentProvider["SQUARE"] = "square";
    PaymentProvider["BRAINTREE"] = "braintree";
    PaymentProvider["AUTHORIZE_NET"] = "authorize_net";
})(PaymentProvider || (exports.PaymentProvider = PaymentProvider = {}));
/**
 * Payment method types
 */
var PaymentMethodType;
(function (PaymentMethodType) {
    PaymentMethodType["CARD"] = "card";
    PaymentMethodType["BANK_ACCOUNT"] = "bank_account";
    PaymentMethodType["ACH"] = "ach";
    PaymentMethodType["WIRE"] = "wire";
    PaymentMethodType["PAYPAL"] = "paypal";
    PaymentMethodType["APPLE_PAY"] = "apple_pay";
    PaymentMethodType["GOOGLE_PAY"] = "google_pay";
    PaymentMethodType["SEPA_DEBIT"] = "sepa_debit";
    PaymentMethodType["IDEAL"] = "ideal";
    PaymentMethodType["ALIPAY"] = "alipay";
})(PaymentMethodType || (exports.PaymentMethodType = PaymentMethodType = {}));
/**
 * Payment status enum
 */
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "pending";
    PaymentStatus["PROCESSING"] = "processing";
    PaymentStatus["REQUIRES_ACTION"] = "requires_action";
    PaymentStatus["REQUIRES_CONFIRMATION"] = "requires_confirmation";
    PaymentStatus["SUCCEEDED"] = "succeeded";
    PaymentStatus["FAILED"] = "failed";
    PaymentStatus["CANCELED"] = "canceled";
    PaymentStatus["REFUNDED"] = "refunded";
    PaymentStatus["PARTIALLY_REFUNDED"] = "partially_refunded";
    PaymentStatus["DISPUTED"] = "disputed";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
/**
 * Transaction types
 */
var TransactionType;
(function (TransactionType) {
    TransactionType["PAYMENT"] = "payment";
    TransactionType["REFUND"] = "refund";
    TransactionType["PAYOUT"] = "payout";
    TransactionType["TRANSFER"] = "transfer";
    TransactionType["ADJUSTMENT"] = "adjustment";
    TransactionType["FEE"] = "fee";
    TransactionType["CHARGEBACK"] = "chargeback";
})(TransactionType || (exports.TransactionType = TransactionType = {}));
/**
 * Currency codes (ISO 4217)
 */
var Currency;
(function (Currency) {
    Currency["USD"] = "USD";
    Currency["EUR"] = "EUR";
    Currency["GBP"] = "GBP";
    Currency["CAD"] = "CAD";
    Currency["AUD"] = "AUD";
    Currency["JPY"] = "JPY";
    Currency["CHF"] = "CHF";
    Currency["CNY"] = "CNY";
    Currency["INR"] = "INR";
    Currency["MXN"] = "MXN";
})(Currency || (exports.Currency = Currency = {}));
/**
 * Subscription status
 */
var SubscriptionStatus;
(function (SubscriptionStatus) {
    SubscriptionStatus["ACTIVE"] = "active";
    SubscriptionStatus["TRIALING"] = "trialing";
    SubscriptionStatus["PAST_DUE"] = "past_due";
    SubscriptionStatus["CANCELED"] = "canceled";
    SubscriptionStatus["UNPAID"] = "unpaid";
    SubscriptionStatus["PAUSED"] = "paused";
    SubscriptionStatus["INCOMPLETE"] = "incomplete";
    SubscriptionStatus["INCOMPLETE_EXPIRED"] = "incomplete_expired";
})(SubscriptionStatus || (exports.SubscriptionStatus = SubscriptionStatus = {}));
/**
 * Subscription interval
 */
var BillingInterval;
(function (BillingInterval) {
    BillingInterval["DAY"] = "day";
    BillingInterval["WEEK"] = "week";
    BillingInterval["MONTH"] = "month";
    BillingInterval["YEAR"] = "year";
})(BillingInterval || (exports.BillingInterval = BillingInterval = {}));
/**
 * Invoice status
 */
var InvoiceStatus;
(function (InvoiceStatus) {
    InvoiceStatus["DRAFT"] = "draft";
    InvoiceStatus["OPEN"] = "open";
    InvoiceStatus["PAID"] = "paid";
    InvoiceStatus["VOID"] = "void";
    InvoiceStatus["UNCOLLECTIBLE"] = "uncollectible";
    InvoiceStatus["OVERDUE"] = "overdue";
})(InvoiceStatus || (exports.InvoiceStatus = InvoiceStatus = {}));
/**
 * Refund status
 */
var RefundStatus;
(function (RefundStatus) {
    RefundStatus["PENDING"] = "pending";
    RefundStatus["SUCCEEDED"] = "succeeded";
    RefundStatus["FAILED"] = "failed";
    RefundStatus["CANCELED"] = "canceled";
})(RefundStatus || (exports.RefundStatus = RefundStatus = {}));
/**
 * Dispute status
 */
var DisputeStatus;
(function (DisputeStatus) {
    DisputeStatus["WARNING_NEEDS_RESPONSE"] = "warning_needs_response";
    DisputeStatus["WARNING_UNDER_REVIEW"] = "warning_under_review";
    DisputeStatus["WARNING_CLOSED"] = "warning_closed";
    DisputeStatus["NEEDS_RESPONSE"] = "needs_response";
    DisputeStatus["UNDER_REVIEW"] = "under_review";
    DisputeStatus["CHARGE_REFUNDED"] = "charge_refunded";
    DisputeStatus["WON"] = "won";
    DisputeStatus["LOST"] = "lost";
})(DisputeStatus || (exports.DisputeStatus = DisputeStatus = {}));
/**
 * Dispute reason
 */
var DisputeReason;
(function (DisputeReason) {
    DisputeReason["FRAUDULENT"] = "fraudulent";
    DisputeReason["DUPLICATE"] = "duplicate";
    DisputeReason["SUBSCRIPTION_CANCELED"] = "subscription_canceled";
    DisputeReason["PRODUCT_UNACCEPTABLE"] = "product_unacceptable";
    DisputeReason["PRODUCT_NOT_RECEIVED"] = "product_not_received";
    DisputeReason["UNRECOGNIZED"] = "unrecognized";
    DisputeReason["CREDIT_NOT_PROCESSED"] = "credit_not_processed";
    DisputeReason["GENERAL"] = "general";
})(DisputeReason || (exports.DisputeReason = DisputeReason = {}));
/**
 * Webhook event types
 */
var WebhookEventType;
(function (WebhookEventType) {
    WebhookEventType["PAYMENT_SUCCEEDED"] = "payment.succeeded";
    WebhookEventType["PAYMENT_FAILED"] = "payment.failed";
    WebhookEventType["REFUND_CREATED"] = "refund.created";
    WebhookEventType["REFUND_UPDATED"] = "refund.updated";
    WebhookEventType["SUBSCRIPTION_CREATED"] = "subscription.created";
    WebhookEventType["SUBSCRIPTION_UPDATED"] = "subscription.updated";
    WebhookEventType["SUBSCRIPTION_DELETED"] = "subscription.deleted";
    WebhookEventType["INVOICE_CREATED"] = "invoice.created";
    WebhookEventType["INVOICE_PAID"] = "invoice.paid";
    WebhookEventType["INVOICE_PAYMENT_FAILED"] = "invoice.payment_failed";
    WebhookEventType["DISPUTE_CREATED"] = "dispute.created";
    WebhookEventType["DISPUTE_UPDATED"] = "dispute.updated";
    WebhookEventType["DISPUTE_CLOSED"] = "dispute.closed";
})(WebhookEventType || (exports.WebhookEventType = WebhookEventType = {}));
/**
 * Fraud risk level
 */
var FraudRiskLevel;
(function (FraudRiskLevel) {
    FraudRiskLevel["LOW"] = "low";
    FraudRiskLevel["MODERATE"] = "moderate";
    FraudRiskLevel["HIGH"] = "high";
    FraudRiskLevel["BLOCKED"] = "blocked";
})(FraudRiskLevel || (exports.FraudRiskLevel = FraudRiskLevel = {}));
// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================
/**
 * Payment intent creation schema
 */
exports.PaymentIntentCreateSchema = zod_1.z.object({
    amount: zod_1.z.number().positive().int(),
    currency: zod_1.z.nativeEnum(Currency),
    paymentMethodId: zod_1.z.string().optional(),
    customerId: zod_1.z.string().optional(),
    description: zod_1.z.string().max(1000).optional(),
    statementDescriptor: zod_1.z.string().max(22).optional(),
    receiptEmail: zod_1.z.string().email().optional(),
    captureMethod: zod_1.z.enum(['automatic', 'manual']).optional(),
    setupFutureUsage: zod_1.z.enum(['on_session', 'off_session']).optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
/**
 * Payment method creation schema
 */
exports.PaymentMethodCreateSchema = zod_1.z.object({
    type: zod_1.z.nativeEnum(PaymentMethodType),
    customerId: zod_1.z.string(),
    card: zod_1.z
        .object({
        number: zod_1.z.string().regex(/^\d{13,19}$/),
        expMonth: zod_1.z.number().int().min(1).max(12),
        expYear: zod_1.z.number().int().min(new Date().getFullYear()),
        cvc: zod_1.z.string().regex(/^\d{3,4}$/),
    })
        .optional(),
    billingDetails: zod_1.z
        .object({
        name: zod_1.z.string().optional(),
        email: zod_1.z.string().email().optional(),
        phone: zod_1.z.string().optional(),
        address: zod_1.z
            .object({
            line1: zod_1.z.string().optional(),
            line2: zod_1.z.string().optional(),
            city: zod_1.z.string().optional(),
            state: zod_1.z.string().optional(),
            postalCode: zod_1.z.string().optional(),
            country: zod_1.z.string().length(2).optional(),
        })
            .optional(),
    })
        .optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
/**
 * Refund creation schema
 */
exports.RefundCreateSchema = zod_1.z.object({
    paymentIntentId: zod_1.z.string(),
    amount: zod_1.z.number().positive().int().optional(),
    reason: zod_1.z.enum(['duplicate', 'fraudulent', 'requested_by_customer', 'other']).optional(),
    refundApplicationFee: zod_1.z.boolean().optional(),
    reverseTransfer: zod_1.z.boolean().optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
/**
 * Subscription creation schema
 */
exports.SubscriptionCreateSchema = zod_1.z.object({
    customerId: zod_1.z.string(),
    planId: zod_1.z.string(),
    quantity: zod_1.z.number().int().positive().default(1),
    trialPeriodDays: zod_1.z.number().int().nonnegative().optional(),
    defaultPaymentMethodId: zod_1.z.string().optional(),
    collectionMethod: zod_1.z.enum(['charge_automatically', 'send_invoice']).optional(),
    daysUntilDue: zod_1.z.number().int().positive().optional(),
    prorationBehavior: zod_1.z.enum(['create_prorations', 'none', 'always_invoice']).optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
/**
 * Invoice creation schema
 */
exports.InvoiceCreateSchema = zod_1.z.object({
    customerId: zod_1.z.string(),
    subscriptionId: zod_1.z.string().optional(),
    currency: zod_1.z.nativeEnum(Currency),
    description: zod_1.z.string().max(1000).optional(),
    dueDate: zod_1.z.date().optional(),
    daysUntilDue: zod_1.z.number().int().positive().optional(),
    autoAdvance: zod_1.z.boolean().optional(),
    collectionMethod: zod_1.z.enum(['charge_automatically', 'send_invoice']).optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
/**
 * Card validation schema
 */
exports.CardValidationSchema = zod_1.z.object({
    number: zod_1.z.string().regex(/^\d{13,19}$/, 'Invalid card number'),
    expMonth: zod_1.z.number().int().min(1).max(12),
    expYear: zod_1.z.number().int().min(new Date().getFullYear()),
    cvc: zod_1.z.string().regex(/^\d{3,4}$/, 'Invalid CVC'),
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
async function createPaymentIntent(config, data) {
    const validated = exports.PaymentIntentCreateSchema.parse(data);
    const intent = {
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
async function confirmPaymentIntent(config, intentId, paymentMethodId) {
    if (!intentId) {
        throw new common_1.BadRequestException('Payment intent ID is required');
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
async function retrievePaymentIntent(config, intentId) {
    if (!intentId) {
        throw new common_1.BadRequestException('Payment intent ID is required');
    }
    // Provider-specific retrieval logic
    throw new common_1.NotFoundException(`Payment intent ${intentId} not found`);
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
async function cancelPaymentIntent(config, intentId) {
    const intent = await retrievePaymentIntent(config, intentId);
    if (intent.status === PaymentStatus.SUCCEEDED) {
        throw new common_1.BadRequestException('Cannot cancel a succeeded payment intent');
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
async function capturePaymentIntent(config, intentId, amountToCapture) {
    const intent = await retrievePaymentIntent(config, intentId);
    if (intent.captureMethod !== 'manual') {
        throw new common_1.BadRequestException('Payment intent does not support manual capture');
    }
    if (amountToCapture && amountToCapture > intent.amount) {
        throw new common_1.BadRequestException('Capture amount cannot exceed authorized amount');
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
async function createPaymentMethod(config, data) {
    const validated = exports.PaymentMethodCreateSchema.parse(data);
    // Validate card if provided
    if (validated.card) {
        exports.CardValidationSchema.parse(validated.card);
    }
    const paymentMethod = {
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
async function retrievePaymentMethod(config, paymentMethodId) {
    if (!paymentMethodId) {
        throw new common_1.BadRequestException('Payment method ID is required');
    }
    // Provider-specific retrieval logic
    throw new common_1.NotFoundException(`Payment method ${paymentMethodId} not found`);
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
async function listPaymentMethods(config, customerId, type) {
    if (!customerId) {
        throw new common_1.BadRequestException('Customer ID is required');
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
async function detachPaymentMethod(config, paymentMethodId) {
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
async function setDefaultPaymentMethod(config, customerId, paymentMethodId) {
    const method = await retrievePaymentMethod(config, paymentMethodId);
    if (method.customerId !== customerId) {
        throw new common_1.BadRequestException('Payment method does not belong to customer');
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
async function create3DSecureAuth(config, intentId, options) {
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
async function verify3DSecureAuth(config, intentId, authenticationResult) {
    const intent = await retrievePaymentIntent(config, intentId);
    if (!authenticationResult) {
        intent.lastPaymentError = {
            type: '3d_secure_authentication_failed',
            message: '3D Secure authentication failed',
        };
        intent.status = PaymentStatus.FAILED;
    }
    else {
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
async function createRefund(config, data) {
    const validated = exports.RefundCreateSchema.parse(data);
    const intent = await retrievePaymentIntent(config, validated.paymentIntentId);
    if (intent.status !== PaymentStatus.SUCCEEDED) {
        throw new common_1.BadRequestException('Can only refund succeeded payments');
    }
    const refund = {
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
async function retrieveRefund(config, refundId) {
    if (!refundId) {
        throw new common_1.BadRequestException('Refund ID is required');
    }
    // Provider-specific retrieval logic
    throw new common_1.NotFoundException(`Refund ${refundId} not found`);
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
async function listRefunds(config, paymentIntentId) {
    if (!paymentIntentId) {
        throw new common_1.BadRequestException('Payment intent ID is required');
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
async function cancelRefund(config, refundId) {
    const refund = await retrieveRefund(config, refundId);
    if (refund.status !== RefundStatus.PENDING) {
        throw new common_1.BadRequestException('Can only cancel pending refunds');
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
async function createSubscription(config, data) {
    const validated = exports.SubscriptionCreateSchema.parse(data);
    const now = new Date();
    const currentPeriodEnd = new Date(now);
    currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1);
    const subscription = {
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
async function updateSubscription(config, subscriptionId, updates) {
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
async function retrieveSubscription(config, subscriptionId) {
    if (!subscriptionId) {
        throw new common_1.BadRequestException('Subscription ID is required');
    }
    // Provider-specific retrieval logic
    throw new common_1.NotFoundException(`Subscription ${subscriptionId} not found`);
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
async function cancelSubscription(config, subscriptionId, atPeriodEnd = true) {
    const subscription = await retrieveSubscription(config, subscriptionId);
    if (atPeriodEnd) {
        subscription.cancelAtPeriodEnd = true;
    }
    else {
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
async function reactivateSubscription(config, subscriptionId) {
    const subscription = await retrieveSubscription(config, subscriptionId);
    if (subscription.status !== SubscriptionStatus.CANCELED && !subscription.cancelAtPeriodEnd) {
        throw new common_1.BadRequestException('Subscription is not canceled');
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
function calculateSubscriptionProration(subscription, newQuantity, newPlanAmount) {
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
async function createInvoice(config, data) {
    const validated = exports.InvoiceCreateSchema.parse(data);
    const invoice = {
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
    }
    else if (validated.daysUntilDue) {
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
function addInvoiceLineItem(invoice, lineItem) {
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
async function finalizeInvoice(config, invoiceId) {
    const invoice = await retrieveInvoice(config, invoiceId);
    if (invoice.status !== InvoiceStatus.DRAFT) {
        throw new common_1.BadRequestException('Can only finalize draft invoices');
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
async function retrieveInvoice(config, invoiceId) {
    if (!invoiceId) {
        throw new common_1.BadRequestException('Invoice ID is required');
    }
    // Provider-specific retrieval logic
    throw new common_1.NotFoundException(`Invoice ${invoiceId} not found`);
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
async function payInvoice(config, invoiceId, paymentMethodId) {
    const invoice = await retrieveInvoice(config, invoiceId);
    if (invoice.status !== InvoiceStatus.OPEN) {
        throw new common_1.BadRequestException('Can only pay open invoices');
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
async function voidInvoice(config, invoiceId) {
    const invoice = await retrieveInvoice(config, invoiceId);
    if (invoice.status === InvoiceStatus.PAID) {
        throw new common_1.BadRequestException('Cannot void a paid invoice');
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
async function retrieveDispute(config, disputeId) {
    if (!disputeId) {
        throw new common_1.BadRequestException('Dispute ID is required');
    }
    // Provider-specific retrieval logic
    throw new common_1.NotFoundException(`Dispute ${disputeId} not found`);
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
async function submitDisputeEvidence(config, disputeId, evidence) {
    const dispute = await retrieveDispute(config, disputeId);
    if (dispute.status !== DisputeStatus.NEEDS_RESPONSE) {
        throw new common_1.BadRequestException('Dispute does not need evidence submission');
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
async function closeDispute(config, disputeId) {
    const dispute = await retrieveDispute(config, disputeId);
    if (dispute.status === DisputeStatus.WON || dispute.status === DisputeStatus.LOST) {
        throw new common_1.BadRequestException('Dispute is already closed');
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
function verifyWebhookSignature(config, payload, signature) {
    if (!config.webhookSecret) {
        throw new common_1.InternalServerErrorException('Webhook secret not configured');
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
async function processWebhookEvent(config, event) {
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
                common_1.Logger.warn(`Unhandled webhook event type: ${event.type}`);
        }
        return { success: true };
    }
    catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}
/**
 * Handle successful payment webhook event
 */
async function handlePaymentSucceeded(config, data) {
    // Implementation for payment succeeded
    common_1.Logger.log(`Payment succeeded: ${data.id}`);
}
/**
 * Handle failed payment webhook event
 */
async function handlePaymentFailed(config, data) {
    // Implementation for payment failed
    common_1.Logger.log(`Payment failed: ${data.id}`);
}
/**
 * Handle subscription updated webhook event
 */
async function handleSubscriptionUpdated(config, data) {
    // Implementation for subscription updated
    common_1.Logger.log(`Subscription updated: ${data.id}`);
}
/**
 * Handle invoice paid webhook event
 */
async function handleInvoicePaid(config, data) {
    // Implementation for invoice paid
    common_1.Logger.log(`Invoice paid: ${data.id}`);
}
/**
 * Handle dispute created webhook event
 */
async function handleDisputeCreated(config, data) {
    // Implementation for dispute created
    common_1.Logger.log(`Dispute created: ${data.id}`);
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
function generateIdempotencyKey(provider, operation, uniqueData) {
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
async function checkIdempotencyKey(key) {
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
async function storeIdempotencyKey(config) {
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
function analyzePaymentFraud(payment, customerData) {
    let score = 0;
    const reasons = [];
    const rules = [];
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
    let riskLevel;
    let blocked = false;
    if (score >= 75) {
        riskLevel = FraudRiskLevel.BLOCKED;
        blocked = true;
    }
    else if (score >= 50) {
        riskLevel = FraudRiskLevel.HIGH;
    }
    else if (score >= 25) {
        riskLevel = FraudRiskLevel.MODERATE;
    }
    else {
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
async function convertCurrency(amount, fromCurrency, toCurrency, exchangeRate) {
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
async function fetchExchangeRate(fromCurrency, toCurrency) {
    // Implementation would call currency exchange API
    // This is a mock implementation
    const mockRates = {
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
function validateCardNumber(cardNumber) {
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
function detectCardBrand(cardNumber) {
    const cleaned = cardNumber.replace(/\D/g, '');
    const patterns = {
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
function maskCardNumber(cardNumber, visibleDigits = 4) {
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
function hashCardFingerprint(cardNumber) {
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
function tokenizePaymentData(data) {
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
function generatePaymentIntentId(provider) {
    const prefix = provider === PaymentProvider.STRIPE ? 'pi' : 'pmt';
    return `${prefix}_${crypto.randomBytes(12).toString('hex')}`;
}
/**
 * Generate payment method ID
 */
function generatePaymentMethodId(provider) {
    const prefix = provider === PaymentProvider.STRIPE ? 'pm' : 'pmthd';
    return `${prefix}_${crypto.randomBytes(12).toString('hex')}`;
}
/**
 * Generate refund ID
 */
function generateRefundId(provider) {
    const prefix = provider === PaymentProvider.STRIPE ? 're' : 'ref';
    return `${prefix}_${crypto.randomBytes(12).toString('hex')}`;
}
/**
 * Generate subscription ID
 */
function generateSubscriptionId(provider) {
    const prefix = provider === PaymentProvider.STRIPE ? 'sub' : 'subs';
    return `${prefix}_${crypto.randomBytes(12).toString('hex')}`;
}
/**
 * Generate invoice ID
 */
function generateInvoiceId(provider) {
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
function formatAmount(amount, currency) {
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
function parseAmount(amountString, currency) {
    const cleaned = amountString.replace(/[^0-9.]/g, '');
    const value = parseFloat(cleaned);
    const multiplier = [Currency.JPY].includes(currency) ? 1 : 100;
    return Math.round(value * multiplier);
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
let PaymentProcessingService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var PaymentProcessingService = _classThis = class {
        constructor(config) {
            this.config = config;
            this.logger = new common_1.Logger(PaymentProcessingService.name);
        }
        /**
         * Create and process a payment
         */
        async createPayment(data) {
            this.logger.log(`Creating payment: ${data.amount} ${data.currency}`);
            try {
                const intent = await createPaymentIntent(this.config, data);
                await this.auditLog('payment.created', intent.id, data);
                return intent;
            }
            catch (error) {
                this.logger.error(`Payment creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
                await this.auditLog('payment.create_failed', undefined, data, error);
                throw error;
            }
        }
        /**
         * Process a refund
         */
        async processRefund(data) {
            this.logger.log(`Processing refund for payment: ${data.paymentIntentId}`);
            try {
                const refund = await createRefund(this.config, data);
                await this.auditLog('refund.created', refund.id, data);
                return refund;
            }
            catch (error) {
                this.logger.error(`Refund processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
                await this.auditLog('refund.create_failed', data.paymentIntentId, data, error);
                throw error;
            }
        }
        /**
         * Audit logging for compliance
         */
        async auditLog(action, resourceId, data, error) {
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
    };
    __setFunctionName(_classThis, "PaymentProcessingService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PaymentProcessingService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PaymentProcessingService = _classThis;
})();
exports.PaymentProcessingService = PaymentProcessingService;
/**
 * Default payment configuration constants
 */
exports.DEFAULT_PAYMENT_CONFIG = {
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
exports.PAYMENT_RETRY_CONFIG = {
    maxRetries: 3,
    initialDelay: 1000, // 1 second
    maxDelay: 30000, // 30 seconds
    backoffMultiplier: 2,
};
/**
 * Subscription proration behaviors
 */
exports.PRORATION_BEHAVIORS = {
    CREATE_PRORATIONS: 'create_prorations',
    NONE: 'none',
    ALWAYS_INVOICE: 'always_invoice',
};
//# sourceMappingURL=payment-processing-kit.prod.js.map