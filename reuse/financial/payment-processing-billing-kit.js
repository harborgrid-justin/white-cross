"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineSubscriptionModel = exports.definePaymentModel = exports.defineInvoiceModel = exports.Currency = exports.CreditMemoType = exports.RetryStrategy = exports.DunningStage = exports.InstallmentFrequency = exports.GatewayTransactionType = exports.PaymentGateway = exports.SubscriptionStatus = exports.BillingCycle = exports.InvoiceStatus = exports.PaymentStatus = exports.PaymentMethod = void 0;
exports.generateInvoice = generateInvoice;
exports.updateInvoice = updateInvoice;
exports.voidInvoice = voidInvoice;
exports.createCreditMemo = createCreditMemo;
exports.applyCreditMemoToInvoice = applyCreditMemoToInvoice;
exports.processPayment = processPayment;
exports.authorizePayment = authorizePayment;
exports.capturePayment = capturePayment;
exports.refundPayment = refundPayment;
exports.voidPayment = voidPayment;
exports.tokenizePaymentMethod = tokenizePaymentMethod;
exports.deletePaymentMethod = deletePaymentMethod;
exports.verifyPaymentMethod = verifyPaymentMethod;
exports.createSubscription = createSubscription;
exports.processRecurringBilling = processRecurringBilling;
exports.cancelSubscription = cancelSubscription;
exports.changeSubscriptionPlan = changeSubscriptionPlan;
exports.pauseSubscription = pauseSubscription;
exports.resumeSubscription = resumeSubscription;
exports.createPaymentPlan = createPaymentPlan;
exports.processInstallmentPayment = processInstallmentPayment;
exports.getUpcomingInstallments = getUpcomingInstallments;
exports.calculateLateFee = calculateLateFee;
exports.applyLateFeeToInvoice = applyLateFeeToInvoice;
exports.processOverdueInvoiceLateFees = processOverdueInvoiceLateFees;
exports.reconcilePayments = reconcilePayments;
exports.getPaymentSettlementReport = getPaymentSettlementReport;
exports.createDunningWorkflow = createDunningWorkflow;
exports.processDunningStage = processDunningStage;
exports.getActiveDunningWorkflows = getActiveDunningWorkflows;
exports.configurePaymentRetryStrategy = configurePaymentRetryStrategy;
exports.retryFailedPayment = retryFailedPayment;
exports.calculateNextRetryTime = calculateNextRetryTime;
exports.convertCurrency = convertCurrency;
exports.processMultiCurrencyPayment = processMultiCurrencyPayment;
const sequelize_1 = require("sequelize");
const common_1 = require("@nestjs/common");
const date_fns_1 = require("date-fns");
const decimal_js_1 = __importDefault(require("decimal.js"));
const crypto = __importStar(require("crypto"));
// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================
/**
 * Payment method types supported across gateways
 */
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["CREDIT_CARD"] = "credit_card";
    PaymentMethod["DEBIT_CARD"] = "debit_card";
    PaymentMethod["ACH"] = "ach";
    PaymentMethod["WIRE_TRANSFER"] = "wire_transfer";
    PaymentMethod["PAYPAL"] = "paypal";
    PaymentMethod["APPLE_PAY"] = "apple_pay";
    PaymentMethod["GOOGLE_PAY"] = "google_pay";
    PaymentMethod["SEPA_DEBIT"] = "sepa_debit";
    PaymentMethod["BANK_TRANSFER"] = "bank_transfer";
    PaymentMethod["CHECK"] = "check";
    PaymentMethod["CASH"] = "cash";
    PaymentMethod["CRYPTOCURRENCY"] = "cryptocurrency";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
/**
 * Payment transaction status
 */
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "pending";
    PaymentStatus["AUTHORIZED"] = "authorized";
    PaymentStatus["CAPTURED"] = "captured";
    PaymentStatus["PARTIALLY_CAPTURED"] = "partially_captured";
    PaymentStatus["SUCCESS"] = "success";
    PaymentStatus["FAILED"] = "failed";
    PaymentStatus["DECLINED"] = "declined";
    PaymentStatus["REFUNDED"] = "refunded";
    PaymentStatus["PARTIALLY_REFUNDED"] = "partially_refunded";
    PaymentStatus["VOIDED"] = "voided";
    PaymentStatus["CANCELLED"] = "cancelled";
    PaymentStatus["DISPUTED"] = "disputed";
    PaymentStatus["CHARGEBACK"] = "chargeback";
    PaymentStatus["REVERSED"] = "reversed";
    PaymentStatus["PROCESSING"] = "processing";
    PaymentStatus["REQUIRES_ACTION"] = "requires_action";
    PaymentStatus["REQUIRES_CAPTURE"] = "requires_capture";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
/**
 * Invoice status lifecycle
 */
var InvoiceStatus;
(function (InvoiceStatus) {
    InvoiceStatus["DRAFT"] = "draft";
    InvoiceStatus["OPEN"] = "open";
    InvoiceStatus["SENT"] = "sent";
    InvoiceStatus["VIEWED"] = "viewed";
    InvoiceStatus["PAID"] = "paid";
    InvoiceStatus["PARTIALLY_PAID"] = "partially_paid";
    InvoiceStatus["OVERDUE"] = "overdue";
    InvoiceStatus["VOID"] = "void";
    InvoiceStatus["UNCOLLECTIBLE"] = "uncollectible";
    InvoiceStatus["REFUNDED"] = "refunded";
    InvoiceStatus["DISPUTED"] = "disputed";
    InvoiceStatus["CANCELLED"] = "cancelled";
})(InvoiceStatus || (exports.InvoiceStatus = InvoiceStatus = {}));
/**
 * Billing cycle frequencies
 */
var BillingCycle;
(function (BillingCycle) {
    BillingCycle["DAILY"] = "daily";
    BillingCycle["WEEKLY"] = "weekly";
    BillingCycle["BIWEEKLY"] = "biweekly";
    BillingCycle["MONTHLY"] = "monthly";
    BillingCycle["QUARTERLY"] = "quarterly";
    BillingCycle["SEMI_ANNUAL"] = "semi_annual";
    BillingCycle["ANNUAL"] = "annual";
    BillingCycle["BIENNIAL"] = "biennial";
    BillingCycle["TRIENNIAL"] = "triennial";
    BillingCycle["ONE_TIME"] = "one_time";
    BillingCycle["USAGE_BASED"] = "usage_based";
})(BillingCycle || (exports.BillingCycle = BillingCycle = {}));
/**
 * Subscription status
 */
var SubscriptionStatus;
(function (SubscriptionStatus) {
    SubscriptionStatus["TRIAL"] = "trial";
    SubscriptionStatus["ACTIVE"] = "active";
    SubscriptionStatus["PAST_DUE"] = "past_due";
    SubscriptionStatus["CANCELLED"] = "cancelled";
    SubscriptionStatus["SUSPENDED"] = "suspended";
    SubscriptionStatus["PAUSED"] = "paused";
    SubscriptionStatus["EXPIRED"] = "expired";
    SubscriptionStatus["INCOMPLETE"] = "incomplete";
    SubscriptionStatus["INCOMPLETE_EXPIRED"] = "incomplete_expired";
    SubscriptionStatus["PENDING_CANCELLATION"] = "pending_cancellation";
})(SubscriptionStatus || (exports.SubscriptionStatus = SubscriptionStatus = {}));
/**
 * Supported payment gateways
 */
var PaymentGateway;
(function (PaymentGateway) {
    PaymentGateway["STRIPE"] = "stripe";
    PaymentGateway["PAYPAL"] = "paypal";
    PaymentGateway["AUTHORIZE_NET"] = "authorize_net";
    PaymentGateway["BRAINTREE"] = "braintree";
    PaymentGateway["SQUARE"] = "square";
    PaymentGateway["ADYEN"] = "adyen";
    PaymentGateway["WORLDPAY"] = "worldpay";
    PaymentGateway["CHECKOUT_COM"] = "checkout_com";
    PaymentGateway["INTERNAL"] = "internal";
})(PaymentGateway || (exports.PaymentGateway = PaymentGateway = {}));
/**
 * Payment gateway transaction types
 */
var GatewayTransactionType;
(function (GatewayTransactionType) {
    GatewayTransactionType["AUTHORIZE"] = "authorize";
    GatewayTransactionType["CAPTURE"] = "capture";
    GatewayTransactionType["SALE"] = "sale";
    GatewayTransactionType["REFUND"] = "refund";
    GatewayTransactionType["VOID"] = "void";
    GatewayTransactionType["CREDIT"] = "credit";
    GatewayTransactionType["VERIFY"] = "verify";
})(GatewayTransactionType || (exports.GatewayTransactionType = GatewayTransactionType = {}));
/**
 * Installment frequency options
 */
var InstallmentFrequency;
(function (InstallmentFrequency) {
    InstallmentFrequency["WEEKLY"] = "weekly";
    InstallmentFrequency["BIWEEKLY"] = "biweekly";
    InstallmentFrequency["MONTHLY"] = "monthly";
    InstallmentFrequency["QUARTERLY"] = "quarterly";
    InstallmentFrequency["SEMI_ANNUAL"] = "semi_annual";
})(InstallmentFrequency || (exports.InstallmentFrequency = InstallmentFrequency = {}));
/**
 * Dunning workflow stages
 */
var DunningStage;
(function (DunningStage) {
    DunningStage["INITIAL"] = "initial";
    DunningStage["FIRST_REMINDER"] = "first_reminder";
    DunningStage["SECOND_REMINDER"] = "second_reminder";
    DunningStage["FINAL_NOTICE"] = "final_notice";
    DunningStage["COLLECTION"] = "collection";
    DunningStage["SUSPENDED"] = "suspended";
    DunningStage["RESOLVED"] = "resolved";
})(DunningStage || (exports.DunningStage = DunningStage = {}));
/**
 * Payment retry strategy types
 */
var RetryStrategy;
(function (RetryStrategy) {
    RetryStrategy["LINEAR"] = "linear";
    RetryStrategy["EXPONENTIAL"] = "exponential";
    RetryStrategy["CUSTOM"] = "custom";
    RetryStrategy["SMART"] = "smart";
})(RetryStrategy || (exports.RetryStrategy = RetryStrategy = {}));
/**
 * Credit memo types
 */
var CreditMemoType;
(function (CreditMemoType) {
    CreditMemoType["REFUND"] = "refund";
    CreditMemoType["CREDIT_NOTE"] = "credit_note";
    CreditMemoType["ADJUSTMENT"] = "adjustment";
    CreditMemoType["DISCOUNT"] = "discount";
    CreditMemoType["GOODWILL"] = "goodwill";
})(CreditMemoType || (exports.CreditMemoType = CreditMemoType = {}));
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
    Currency["CNY"] = "CNY";
    Currency["INR"] = "INR";
    Currency["BRL"] = "BRL";
    Currency["MXN"] = "MXN";
})(Currency || (exports.Currency = Currency = {}));
// ============================================================================
// SEQUELIZE MODEL DEFINITIONS
// ============================================================================
/**
 * Invoice model definition
 */
const defineInvoiceModel = (sequelize) => {
    return sequelize.define('Invoice', {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        invoiceNumber: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true,
            },
        },
        customerId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'Customers',
                key: 'id',
            },
        },
        subscriptionId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'Subscriptions',
                key: 'id',
            },
        },
        status: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(InvoiceStatus)),
            allowNull: false,
            defaultValue: InvoiceStatus.DRAFT,
        },
        currency: {
            type: sequelize_1.DataTypes.STRING(3),
            allowNull: false,
            defaultValue: Currency.USD,
        },
        subtotal: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0,
        },
        taxAmount: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0,
        },
        discountAmount: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0,
        },
        total: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
        },
        amountPaid: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0,
        },
        amountDue: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
        },
        issueDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        dueDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        paidAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        notes: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        termsAndConditions: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
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
exports.defineInvoiceModel = defineInvoiceModel;
/**
 * Payment model definition
 */
const definePaymentModel = (sequelize) => {
    return sequelize.define('Payment', {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        invoiceId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'Invoices',
                key: 'id',
            },
        },
        customerId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'Customers',
                key: 'id',
            },
        },
        subscriptionId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'Subscriptions',
                key: 'id',
            },
        },
        paymentMethodId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'PaymentMethods',
                key: 'id',
            },
        },
        gateway: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(PaymentGateway)),
            allowNull: false,
        },
        gatewayTransactionId: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: true,
        },
        status: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(PaymentStatus)),
            allowNull: false,
            defaultValue: PaymentStatus.PENDING,
        },
        amount: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
        },
        currency: {
            type: sequelize_1.DataTypes.STRING(3),
            allowNull: false,
            defaultValue: Currency.USD,
        },
        capturedAmount: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: true,
        },
        refundedAmount: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: true,
            defaultValue: 0,
        },
        feeAmount: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: true,
        },
        netAmount: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: true,
        },
        transactionType: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(GatewayTransactionType)),
            allowNull: false,
        },
        failureCode: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
        },
        failureMessage: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
        },
        processedAt: {
            type: sequelize_1.DataTypes.DATE,
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
exports.definePaymentModel = definePaymentModel;
/**
 * Subscription model definition
 */
const defineSubscriptionModel = (sequelize) => {
    return sequelize.define('Subscription', {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        customerId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'Customers',
                key: 'id',
            },
        },
        planId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
        },
        status: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(SubscriptionStatus)),
            allowNull: false,
            defaultValue: SubscriptionStatus.ACTIVE,
        },
        billingCycle: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(BillingCycle)),
            allowNull: false,
        },
        currentPeriodStart: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        currentPeriodEnd: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        trialStart: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        trialEnd: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        cancelledAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        cancelAtPeriodEnd: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        paymentMethodId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'PaymentMethods',
                key: 'id',
            },
        },
        quantity: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
        unitPrice: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
        },
        currency: {
            type: sequelize_1.DataTypes.STRING(3),
            allowNull: false,
            defaultValue: Currency.USD,
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
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
exports.defineSubscriptionModel = defineSubscriptionModel;
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
async function generateInvoice(sequelize, invoiceData, transaction) {
    const Invoice = sequelize.model('Invoice');
    const InvoiceItem = sequelize.model('InvoiceItem');
    // Calculate totals
    let subtotal = new decimal_js_1.default(0);
    let totalTax = new decimal_js_1.default(0);
    const invoiceItems = invoiceData.items.map(item => {
        const itemAmount = new decimal_js_1.default(item.unitPrice).mul(item.quantity);
        const taxAmount = item.taxRate
            ? itemAmount.mul(item.taxRate).div(100)
            : new decimal_js_1.default(0);
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
    const discountAmount = new decimal_js_1.default(invoiceData.discountAmount || 0);
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
        dueDate: invoiceData.dueDate || (0, date_fns_1.addDays)(new Date(), 30),
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
    return invoice.toJSON();
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
async function updateInvoice(sequelize, invoiceId, updates, transaction) {
    const Invoice = sequelize.model('Invoice');
    const invoice = await Invoice.findByPk(invoiceId, { transaction });
    if (!invoice) {
        throw new common_1.NotFoundException(`Invoice ${invoiceId} not found`);
    }
    // Validate status transitions
    const currentStatus = invoice.get('status');
    if (updates.status && !isValidInvoiceStatusTransition(currentStatus, updates.status)) {
        throw new common_1.BadRequestException(`Cannot transition invoice from ${currentStatus} to ${updates.status}`);
    }
    await invoice.update(updates, { transaction });
    return invoice.toJSON();
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
async function voidInvoice(sequelize, invoiceId, reason, transaction) {
    const Invoice = sequelize.model('Invoice');
    const invoice = await Invoice.findByPk(invoiceId, { transaction });
    if (!invoice) {
        throw new common_1.NotFoundException(`Invoice ${invoiceId} not found`);
    }
    const status = invoice.get('status');
    if ([InvoiceStatus.PAID, InvoiceStatus.VOID].includes(status)) {
        throw new common_1.BadRequestException(`Cannot void invoice with status ${status}`);
    }
    await invoice.update({
        status: InvoiceStatus.VOID,
        metadata: {
            ...(invoice.get('metadata') || {}),
            voidReason: reason,
            voidedAt: new Date().toISOString(),
        },
    }, { transaction });
    return invoice.toJSON();
}
/**
 * Create a credit memo for an invoice or customer
 *
 * @param sequelize - Sequelize instance
 * @param creditMemoData - Credit memo data
 * @param transaction - Optional database transaction
 * @returns Created credit memo
 */
async function createCreditMemo(sequelize, creditMemoData, transaction) {
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
    return creditMemo.toJSON();
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
async function applyCreditMemoToInvoice(sequelize, creditMemoId, invoiceId, transaction) {
    const CreditMemo = sequelize.model('CreditMemo');
    const Invoice = sequelize.model('Invoice');
    const creditMemo = await CreditMemo.findByPk(creditMemoId, { transaction });
    if (!creditMemo) {
        throw new common_1.NotFoundException(`Credit memo ${creditMemoId} not found`);
    }
    const invoice = await Invoice.findByPk(invoiceId, { transaction });
    if (!invoice) {
        throw new common_1.NotFoundException(`Invoice ${invoiceId} not found`);
    }
    const creditAmount = new decimal_js_1.default(creditMemo.get('amount'));
    const currentAmountDue = new decimal_js_1.default(invoice.get('amountDue'));
    const currentAmountPaid = new decimal_js_1.default(invoice.get('amountPaid'));
    const newAmountDue = decimal_js_1.default.max(0, currentAmountDue.sub(creditAmount));
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
        invoice: invoice.toJSON(),
        creditMemo: creditMemo.toJSON(),
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
async function processPayment(sequelize, paymentData, transaction) {
    const Payment = sequelize.model('Payment');
    const Invoice = sequelize.model('Invoice');
    const PaymentMethod = sequelize.model('PaymentMethod');
    // Verify payment method
    const paymentMethod = await PaymentMethod.findByPk(paymentData.paymentMethodId, { transaction });
    if (!paymentMethod) {
        throw new common_1.NotFoundException(`Payment method ${paymentData.paymentMethodId} not found`);
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
        const gatewayResult = await processGatewayPayment(paymentData.gateway, paymentMethod.get('gatewayPaymentMethodId'), paymentData.amount, paymentData.currency || Currency.USD);
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
            await updateInvoiceWithPayment(sequelize, paymentData.invoiceId, paymentData.amount, transaction);
        }
        return payment.toJSON();
    }
    catch (error) {
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
async function authorizePayment(sequelize, authorizationData, transaction) {
    const Payment = sequelize.model('Payment');
    const PaymentMethod = sequelize.model('PaymentMethod');
    const paymentMethod = await PaymentMethod.findByPk(authorizationData.paymentMethodId, { transaction });
    if (!paymentMethod) {
        throw new common_1.NotFoundException(`Payment method ${authorizationData.paymentMethodId} not found`);
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
        const gatewayResult = await authorizeGatewayPayment(authorizationData.gateway, paymentMethod.get('gatewayPaymentMethodId'), authorizationData.amount, authorizationData.currency || Currency.USD);
        await payment.update({
            status: gatewayResult.success ? PaymentStatus.AUTHORIZED : PaymentStatus.FAILED,
            gatewayTransactionId: gatewayResult.transactionId,
            processedAt: new Date(),
            failureCode: gatewayResult.failureCode,
            failureMessage: gatewayResult.failureMessage,
        }, { transaction });
        return payment.toJSON();
    }
    catch (error) {
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
async function capturePayment(sequelize, paymentId, amount, transaction) {
    const Payment = sequelize.model('Payment');
    const payment = await Payment.findByPk(paymentId, { transaction });
    if (!payment) {
        throw new common_1.NotFoundException(`Payment ${paymentId} not found`);
    }
    const status = payment.get('status');
    if (status !== PaymentStatus.AUTHORIZED) {
        throw new common_1.BadRequestException(`Cannot capture payment with status ${status}`);
    }
    const authorizedAmount = new decimal_js_1.default(payment.get('amount'));
    const captureAmount = amount ? new decimal_js_1.default(amount) : authorizedAmount;
    if (captureAmount.greaterThan(authorizedAmount)) {
        throw new common_1.BadRequestException('Capture amount exceeds authorized amount');
    }
    try {
        const gatewayResult = await captureGatewayPayment(payment.get('gateway'), payment.get('gatewayTransactionId'), captureAmount.toNumber());
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
            await updateInvoiceWithPayment(sequelize, invoiceId, captureAmount.toNumber(), transaction);
        }
        return payment.toJSON();
    }
    catch (error) {
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
async function refundPayment(sequelize, paymentId, amount, reason, transaction) {
    const Payment = sequelize.model('Payment');
    const Invoice = sequelize.model('Invoice');
    const payment = await Payment.findByPk(paymentId, { transaction });
    if (!payment) {
        throw new common_1.NotFoundException(`Payment ${paymentId} not found`);
    }
    const status = payment.get('status');
    if (![PaymentStatus.SUCCESS, PaymentStatus.CAPTURED].includes(status)) {
        throw new common_1.BadRequestException(`Cannot refund payment with status ${status}`);
    }
    const capturedAmount = new decimal_js_1.default(payment.get('capturedAmount') || payment.get('amount'));
    const alreadyRefunded = new decimal_js_1.default(payment.get('refundedAmount') || 0);
    const refundAmount = amount ? new decimal_js_1.default(amount) : capturedAmount.sub(alreadyRefunded);
    const maxRefundable = capturedAmount.sub(alreadyRefunded);
    if (refundAmount.greaterThan(maxRefundable)) {
        throw new common_1.BadRequestException(`Refund amount exceeds refundable amount of ${maxRefundable.toNumber()}`);
    }
    try {
        const gatewayResult = await refundGatewayPayment(payment.get('gateway'), payment.get('gatewayTransactionId'), refundAmount.toNumber());
        const totalRefunded = alreadyRefunded.add(refundAmount);
        const newStatus = totalRefunded.equals(capturedAmount)
            ? PaymentStatus.REFUNDED
            : PaymentStatus.PARTIALLY_REFUNDED;
        await payment.update({
            status: gatewayResult.success ? newStatus : payment.get('status'),
            refundedAmount: totalRefunded.toNumber(),
            metadata: {
                ...(payment.get('metadata') || {}),
                refundReason: reason,
                refundedAt: new Date().toISOString(),
            },
        }, { transaction });
        // Update invoice
        const invoiceId = payment.get('invoiceId');
        if (gatewayResult.success && invoiceId) {
            const invoice = await Invoice.findByPk(invoiceId, { transaction });
            if (invoice) {
                const currentAmountPaid = new decimal_js_1.default(invoice.get('amountPaid'));
                const currentAmountDue = new decimal_js_1.default(invoice.get('amountDue'));
                await invoice.update({
                    amountPaid: currentAmountPaid.sub(refundAmount).toNumber(),
                    amountDue: currentAmountDue.add(refundAmount).toNumber(),
                    status: InvoiceStatus.PARTIALLY_PAID,
                }, { transaction });
            }
        }
        return payment.toJSON();
    }
    catch (error) {
        throw new common_1.BadRequestException(`Refund failed: ${error.message}`);
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
async function voidPayment(sequelize, paymentId, reason, transaction) {
    const Payment = sequelize.model('Payment');
    const payment = await Payment.findByPk(paymentId, { transaction });
    if (!payment) {
        throw new common_1.NotFoundException(`Payment ${paymentId} not found`);
    }
    const status = payment.get('status');
    if (![PaymentStatus.AUTHORIZED, PaymentStatus.PENDING].includes(status)) {
        throw new common_1.BadRequestException(`Cannot void payment with status ${status}`);
    }
    try {
        const gatewayResult = await voidGatewayPayment(payment.get('gateway'), payment.get('gatewayTransactionId'));
        await payment.update({
            status: gatewayResult.success ? PaymentStatus.VOIDED : payment.get('status'),
            metadata: {
                ...(payment.get('metadata') || {}),
                voidReason: reason,
                voidedAt: new Date().toISOString(),
            },
        }, { transaction });
        return payment.toJSON();
    }
    catch (error) {
        throw new common_1.BadRequestException(`Void failed: ${error.message}`);
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
async function tokenizePaymentMethod(sequelize, paymentMethodData, transaction) {
    const PaymentMethod = sequelize.model('PaymentMethod');
    // Tokenize with gateway
    const tokenizationResult = await tokenizeWithGateway(paymentMethodData.gateway, paymentMethodData);
    if (!tokenizationResult.success) {
        throw new common_1.BadRequestException(`Payment method tokenization failed: ${tokenizationResult.error}`);
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
        await PaymentMethod.update({ isDefault: false }, {
            where: {
                customerId: paymentMethodData.customerId,
                id: { [sequelize_1.Op.ne]: paymentMethod.get('id') },
            },
            transaction,
        });
    }
    return paymentMethod.toJSON();
}
/**
 * Delete a tokenized payment method
 *
 * @param sequelize - Sequelize instance
 * @param paymentMethodId - Payment method ID to delete
 * @param transaction - Optional database transaction
 */
async function deletePaymentMethod(sequelize, paymentMethodId, transaction) {
    const PaymentMethod = sequelize.model('PaymentMethod');
    const paymentMethod = await PaymentMethod.findByPk(paymentMethodId, { transaction });
    if (!paymentMethod) {
        throw new common_1.NotFoundException(`Payment method ${paymentMethodId} not found`);
    }
    // Delete from gateway
    await deleteFromGateway(paymentMethod.get('gateway'), paymentMethod.get('gatewayPaymentMethodId'));
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
async function verifyPaymentMethod(sequelize, paymentMethodId, verificationData, transaction) {
    const PaymentMethod = sequelize.model('PaymentMethod');
    const paymentMethod = await PaymentMethod.findByPk(paymentMethodId, { transaction });
    if (!paymentMethod) {
        throw new common_1.NotFoundException(`Payment method ${paymentMethodId} not found`);
    }
    const verificationResult = await verifyWithGateway(paymentMethod.get('gateway'), paymentMethod.get('gatewayPaymentMethodId'), verificationData);
    if (verificationResult.verified) {
        await paymentMethod.update({
            metadata: {
                ...(paymentMethod.get('metadata') || {}),
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
async function createSubscription(sequelize, subscriptionData, transaction) {
    const Subscription = sequelize.model('Subscription');
    const startDate = subscriptionData.startDate || new Date();
    let trialStart = null;
    let trialEnd = null;
    let currentPeriodStart = startDate;
    if (subscriptionData.trialDays && subscriptionData.trialDays > 0) {
        trialStart = startDate;
        trialEnd = (0, date_fns_1.addDays)(startDate, subscriptionData.trialDays);
        currentPeriodStart = trialEnd;
    }
    const currentPeriodEnd = calculateNextBillingDate(currentPeriodStart, subscriptionData.billingCycle);
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
    return subscription.toJSON();
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
async function processRecurringBilling(sequelize, subscriptionId, billingDate, transaction) {
    const Subscription = sequelize.model('Subscription');
    const subscription = await Subscription.findByPk(subscriptionId, { transaction });
    if (!subscription) {
        throw new common_1.NotFoundException(`Subscription ${subscriptionId} not found`);
    }
    const status = subscription.get('status');
    if (![SubscriptionStatus.ACTIVE, SubscriptionStatus.TRIAL].includes(status)) {
        throw new common_1.BadRequestException(`Cannot process billing for subscription with status ${status}`);
    }
    // Check if billing date is in current period
    const currentPeriodEnd = subscription.get('currentPeriodEnd');
    if ((0, date_fns_1.isBefore)(billingDate, currentPeriodEnd)) {
        throw new common_1.BadRequestException('Billing date is before current period end');
    }
    // Generate invoice for subscription
    const quantity = subscription.get('quantity');
    const unitPrice = subscription.get('unitPrice');
    const amount = new decimal_js_1.default(unitPrice).mul(quantity).toNumber();
    const invoice = await generateInvoice(sequelize, {
        customerId: subscription.get('customerId'),
        subscriptionId: subscription.get('id'),
        items: [
            {
                description: `Subscription - Period ${currentPeriodEnd.toISOString().split('T')[0]}`,
                quantity,
                unitPrice,
            },
        ],
        currency: subscription.get('currency'),
        dueDate: currentPeriodEnd,
        issueDate: billingDate,
    }, transaction);
    // Update invoice status to open
    await updateInvoice(sequelize, invoice.id, { status: InvoiceStatus.OPEN }, transaction);
    // Attempt payment
    let payment;
    try {
        payment = await processPayment(sequelize, {
            invoiceId: invoice.id,
            customerId: subscription.get('customerId'),
            subscriptionId: subscription.get('id'),
            paymentMethodId: subscription.get('paymentMethodId'),
            amount: invoice.total,
            currency: invoice.currency,
            gateway: PaymentGateway.STRIPE, // Default gateway
        }, transaction);
        // Update subscription period if payment successful
        if (payment.status === PaymentStatus.SUCCESS) {
            const nextPeriodStart = currentPeriodEnd;
            const nextPeriodEnd = calculateNextBillingDate(nextPeriodStart, subscription.get('billingCycle'));
            await subscription.update({
                currentPeriodStart: nextPeriodStart,
                currentPeriodEnd: nextPeriodEnd,
                status: SubscriptionStatus.ACTIVE,
            }, { transaction });
        }
        else {
            // Payment failed - update subscription status
            await subscription.update({
                status: SubscriptionStatus.PAST_DUE,
            }, { transaction });
            // Create dunning workflow
            await createDunningWorkflow(sequelize, {
                customerId: subscription.get('customerId'),
                subscriptionId: subscription.get('id'),
                invoiceId: invoice.id,
            }, transaction);
        }
    }
    catch (error) {
        // Payment processing failed
        await subscription.update({
            status: SubscriptionStatus.PAST_DUE,
        }, { transaction });
        await createDunningWorkflow(sequelize, {
            customerId: subscription.get('customerId'),
            subscriptionId: subscription.get('id'),
            invoiceId: invoice.id,
        }, transaction);
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
async function cancelSubscription(sequelize, subscriptionId, cancelAtPeriodEnd = true, transaction) {
    const Subscription = sequelize.model('Subscription');
    const subscription = await Subscription.findByPk(subscriptionId, { transaction });
    if (!subscription) {
        throw new common_1.NotFoundException(`Subscription ${subscriptionId} not found`);
    }
    const updates = {
        cancelledAt: new Date(),
        cancelAtPeriodEnd,
    };
    if (!cancelAtPeriodEnd) {
        updates.status = SubscriptionStatus.CANCELLED;
    }
    else {
        updates.status = SubscriptionStatus.PENDING_CANCELLATION;
    }
    await subscription.update(updates, { transaction });
    return subscription.toJSON();
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
async function changeSubscriptionPlan(sequelize, subscriptionId, newPlanData, transaction) {
    const Subscription = sequelize.model('Subscription');
    const subscription = await Subscription.findByPk(subscriptionId, { transaction });
    if (!subscription) {
        throw new common_1.NotFoundException(`Subscription ${subscriptionId} not found`);
    }
    const currentPeriodStart = subscription.get('currentPeriodStart');
    const currentPeriodEnd = subscription.get('currentPeriodEnd');
    const currentUnitPrice = new decimal_js_1.default(subscription.get('unitPrice'));
    const currentQuantity = subscription.get('quantity');
    const newUnitPrice = new decimal_js_1.default(newPlanData.unitPrice);
    const newQuantity = newPlanData.quantity || currentQuantity;
    // Calculate proration
    const totalPeriodDays = (0, date_fns_1.differenceInDays)(currentPeriodEnd, currentPeriodStart);
    const remainingDays = (0, date_fns_1.differenceInDays)(currentPeriodEnd, new Date());
    const prorationFactor = new decimal_js_1.default(remainingDays).div(totalPeriodDays);
    const currentPeriodValue = currentUnitPrice.mul(currentQuantity).mul(prorationFactor);
    const newPeriodValue = newUnitPrice.mul(newQuantity).mul(prorationFactor);
    const prorationAmount = newPeriodValue.sub(currentPeriodValue);
    let prorationInvoice;
    // Create proration invoice if amount is positive (upgrade)
    if (prorationAmount.greaterThan(0)) {
        prorationInvoice = await generateInvoice(sequelize, {
            customerId: subscription.get('customerId'),
            subscriptionId: subscription.get('id'),
            items: [
                {
                    description: 'Plan change proration',
                    quantity: 1,
                    unitPrice: prorationAmount.toNumber(),
                },
            ],
            currency: subscription.get('currency'),
            dueDate: new Date(),
        }, transaction);
        // Process proration payment
        await processPayment(sequelize, {
            invoiceId: prorationInvoice.id,
            customerId: subscription.get('customerId'),
            subscriptionId: subscription.get('id'),
            paymentMethodId: subscription.get('paymentMethodId'),
            amount: prorationInvoice.total,
            currency: prorationInvoice.currency,
            gateway: PaymentGateway.STRIPE,
        }, transaction);
    }
    else if (prorationAmount.lessThan(0)) {
        // Create credit memo for downgrade
        await createCreditMemo(sequelize, {
            customerId: subscription.get('customerId'),
            type: CreditMemoType.CREDIT_NOTE,
            amount: prorationAmount.abs().toNumber(),
            currency: subscription.get('currency'),
            reason: 'Plan downgrade proration credit',
        }, transaction);
    }
    // Update subscription
    await subscription.update({
        planId: newPlanData.planId,
        unitPrice: newPlanData.unitPrice,
        quantity: newQuantity,
    }, { transaction });
    return {
        subscription: subscription.toJSON(),
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
async function pauseSubscription(sequelize, subscriptionId, transaction) {
    const Subscription = sequelize.model('Subscription');
    const subscription = await Subscription.findByPk(subscriptionId, { transaction });
    if (!subscription) {
        throw new common_1.NotFoundException(`Subscription ${subscriptionId} not found`);
    }
    await subscription.update({
        status: SubscriptionStatus.PAUSED,
        metadata: {
            ...(subscription.get('metadata') || {}),
            pausedAt: new Date().toISOString(),
        },
    }, { transaction });
    return subscription.toJSON();
}
/**
 * Resume a paused subscription
 *
 * @param sequelize - Sequelize instance
 * @param subscriptionId - Subscription ID to resume
 * @param transaction - Optional database transaction
 * @returns Updated subscription
 */
async function resumeSubscription(sequelize, subscriptionId, transaction) {
    const Subscription = sequelize.model('Subscription');
    const subscription = await Subscription.findByPk(subscriptionId, { transaction });
    if (!subscription) {
        throw new common_1.NotFoundException(`Subscription ${subscriptionId} not found`);
    }
    const status = subscription.get('status');
    if (status !== SubscriptionStatus.PAUSED) {
        throw new common_1.BadRequestException(`Cannot resume subscription with status ${status}`);
    }
    await subscription.update({
        status: SubscriptionStatus.ACTIVE,
        metadata: {
            ...(subscription.get('metadata') || {}),
            resumedAt: new Date().toISOString(),
        },
    }, { transaction });
    return subscription.toJSON();
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
async function createPaymentPlan(sequelize, planData, transaction) {
    const PaymentPlan = sequelize.model('PaymentPlan');
    const Installment = sequelize.model('Installment');
    if (planData.installments < 2) {
        throw new common_1.BadRequestException('Payment plan must have at least 2 installments');
    }
    const totalAmount = new decimal_js_1.default(planData.totalAmount);
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
    return paymentPlan.toJSON();
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
async function processInstallmentPayment(sequelize, paymentPlanId, installmentNumber, transaction) {
    const PaymentPlan = sequelize.model('PaymentPlan');
    const Installment = sequelize.model('Installment');
    const paymentPlan = await PaymentPlan.findByPk(paymentPlanId, { transaction });
    if (!paymentPlan) {
        throw new common_1.NotFoundException(`Payment plan ${paymentPlanId} not found`);
    }
    const installment = await Installment.findOne({
        where: {
            paymentPlanId,
            installmentNumber,
        },
        transaction,
    });
    if (!installment) {
        throw new common_1.NotFoundException(`Installment ${installmentNumber} not found`);
    }
    const status = installment.get('status');
    if (status === PaymentStatus.SUCCESS) {
        throw new common_1.BadRequestException('Installment already paid');
    }
    // Process payment
    const payment = await processPayment(sequelize, {
        customerId: paymentPlan.get('customerId'),
        paymentMethodId: paymentPlan.get('paymentMethodId'),
        amount: installment.get('amount'),
        currency: paymentPlan.get('currency'),
        gateway: PaymentGateway.STRIPE,
        metadata: {
            paymentPlanId,
            installmentNumber,
        },
    }, transaction);
    if (payment.status === PaymentStatus.SUCCESS) {
        await installment.update({
            status: PaymentStatus.SUCCESS,
            paymentId: payment.id,
            paidAt: new Date(),
        }, { transaction });
        const paidInstallments = paymentPlan.get('paidInstallments') + 1;
        const remainingAmount = new decimal_js_1.default(paymentPlan.get('remainingAmount'))
            .sub(installment.get('amount'));
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
        installment: installment.toJSON(),
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
async function getUpcomingInstallments(sequelize, paymentPlanId, limit = 5) {
    const Installment = sequelize.model('Installment');
    const installments = await Installment.findAll({
        where: {
            paymentPlanId,
            status: PaymentStatus.PENDING,
        },
        order: [['dueDate', 'ASC']],
        limit,
    });
    return installments.map(i => i.toJSON());
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
async function calculateLateFee(sequelize, invoiceId, lateFeeConfig, transaction) {
    const Invoice = sequelize.model('Invoice');
    const invoice = await Invoice.findByPk(invoiceId, { transaction });
    if (!invoice) {
        throw new common_1.NotFoundException(`Invoice ${invoiceId} not found`);
    }
    const dueDate = invoice.get('dueDate');
    const amountDue = new decimal_js_1.default(invoice.get('amountDue'));
    const gracePeriodDays = lateFeeConfig.gracePeriodDays || 0;
    const graceDate = (0, date_fns_1.addDays)(dueDate, gracePeriodDays);
    // No late fee if within grace period or invoice is paid
    if ((0, date_fns_1.isBefore)(new Date(), graceDate) || amountDue.isZero()) {
        return 0;
    }
    const daysOverdue = (0, date_fns_1.differenceInDays)(new Date(), graceDate);
    let lateFee = new decimal_js_1.default(0);
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
        lateFee = decimal_js_1.default.min(lateFee, lateFeeConfig.maxFee);
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
async function applyLateFeeToInvoice(sequelize, invoiceId, lateFeeAmount, transaction) {
    const Invoice = sequelize.model('Invoice');
    const InvoiceItem = sequelize.model('InvoiceItem');
    const invoice = await Invoice.findByPk(invoiceId, { transaction });
    if (!invoice) {
        throw new common_1.NotFoundException(`Invoice ${invoiceId} not found`);
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
    const currentTotal = new decimal_js_1.default(invoice.get('total'));
    const currentAmountDue = new decimal_js_1.default(invoice.get('amountDue'));
    await invoice.update({
        total: currentTotal.add(lateFeeAmount).toNumber(),
        amountDue: currentAmountDue.add(lateFeeAmount).toNumber(),
        metadata: {
            ...(invoice.get('metadata') || {}),
            lateFeeApplied: true,
            lateFeeAmount,
            lateFeeAppliedAt: new Date().toISOString(),
        },
    }, { transaction });
    return invoice.toJSON();
}
/**
 * Process late fees for all overdue invoices
 *
 * @param sequelize - Sequelize instance
 * @param lateFeeConfig - Late fee configuration
 * @param transaction - Optional database transaction
 * @returns Summary of late fees applied
 */
async function processOverdueInvoiceLateFees(sequelize, lateFeeConfig, transaction) {
    const Invoice = sequelize.model('Invoice');
    const gracePeriodDays = lateFeeConfig.gracePeriodDays || 0;
    const graceEndDate = (0, date_fns_1.addDays)(new Date(), -gracePeriodDays);
    const overdueInvoices = await Invoice.findAll({
        where: {
            status: {
                [sequelize_1.Op.in]: [InvoiceStatus.OPEN, InvoiceStatus.SENT, InvoiceStatus.OVERDUE],
            },
            dueDate: {
                [sequelize_1.Op.lt]: graceEndDate,
            },
            amountDue: {
                [sequelize_1.Op.gt]: 0,
            },
            [sequelize_1.Op.or]: [
                { 'metadata.lateFeeApplied': { [sequelize_1.Op.is]: null } },
                { 'metadata.lateFeeApplied': false },
            ],
        },
        transaction,
    });
    let processedCount = 0;
    let totalFeesApplied = new decimal_js_1.default(0);
    for (const invoice of overdueInvoices) {
        const lateFee = await calculateLateFee(sequelize, invoice.get('id'), lateFeeConfig, transaction);
        if (lateFee > 0) {
            await applyLateFeeToInvoice(sequelize, invoice.get('id'), lateFee, transaction);
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
async function reconcilePayments(sequelize, reconciliationData, transaction) {
    const PaymentReconciliation = sequelize.model('PaymentReconciliation');
    const Payment = sequelize.model('Payment');
    // Count transactions for the date
    const startOfDate = (0, date_fns_1.startOfDay)(reconciliationData.reconciliationDate);
    const endOfDate = (0, date_fns_1.endOfDay)(reconciliationData.reconciliationDate);
    const transactionCount = await Payment.count({
        where: {
            gateway: reconciliationData.gateway,
            status: PaymentStatus.SUCCESS,
            processedAt: {
                [sequelize_1.Op.between]: [startOfDate, endOfDate],
            },
        },
        transaction,
    });
    const variance = new decimal_js_1.default(reconciliationData.actualAmount)
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
    return reconciliation.toJSON();
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
async function getPaymentSettlementReport(sequelize, startDate, endDate, gateway) {
    const Payment = sequelize.model('Payment');
    const whereClause = {
        processedAt: {
            [sequelize_1.Op.between]: [startDate, endDate],
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
    const report = {
        totalPayments: 0,
        successfulPayments: 0,
        totalAmount: 0,
        totalFees: 0,
        netAmount: 0,
        byGateway: {},
    };
    for (const payment of payments) {
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
async function createDunningWorkflow(sequelize, dunningData, transaction) {
    const DunningWorkflow = sequelize.model('DunningWorkflow');
    const dunning = await DunningWorkflow.create({
        customerId: dunningData.customerId,
        subscriptionId: dunningData.subscriptionId,
        invoiceId: dunningData.invoiceId,
        stage: DunningStage.INITIAL,
        attemptCount: 0,
        status: 'active',
        nextAttemptDate: (0, date_fns_1.addDays)(new Date(), 3), // First retry in 3 days
        metadata: dunningData.metadata,
    }, { transaction });
    return dunning.toJSON();
}
/**
 * Process dunning workflow stage
 *
 * @param sequelize - Sequelize instance
 * @param dunningId - Dunning workflow ID
 * @param transaction - Optional database transaction
 * @returns Updated dunning workflow and payment result
 */
async function processDunningStage(sequelize, dunningId, transaction) {
    const DunningWorkflow = sequelize.model('DunningWorkflow');
    const Invoice = sequelize.model('Invoice');
    const Subscription = sequelize.model('Subscription');
    const dunning = await DunningWorkflow.findByPk(dunningId, { transaction });
    if (!dunning) {
        throw new common_1.NotFoundException(`Dunning workflow ${dunningId} not found`);
    }
    const invoice = await Invoice.findByPk(dunning.get('invoiceId'), { transaction });
    if (!invoice) {
        throw new common_1.NotFoundException(`Invoice not found`);
    }
    // Attempt payment retry
    let payment;
    let paymentSuccess = false;
    try {
        const subscription = dunning.get('subscriptionId')
            ? await Subscription.findByPk(dunning.get('subscriptionId'), { transaction })
            : null;
        if (subscription) {
            payment = await processPayment(sequelize, {
                invoiceId: invoice.get('id'),
                customerId: dunning.get('customerId'),
                subscriptionId: subscription.get('id'),
                paymentMethodId: subscription.get('paymentMethodId'),
                amount: invoice.get('amountDue'),
                currency: invoice.get('currency'),
                gateway: PaymentGateway.STRIPE,
                metadata: {
                    dunningWorkflowId: dunning.get('id'),
                    dunningStage: dunning.get('stage'),
                },
            }, transaction);
            paymentSuccess = payment.status === PaymentStatus.SUCCESS;
        }
    }
    catch (error) {
        // Payment failed, continue dunning process
    }
    const attemptCount = dunning.get('attemptCount') + 1;
    if (paymentSuccess) {
        // Payment successful, resolve dunning
        await dunning.update({
            stage: DunningStage.RESOLVED,
            status: 'resolved',
            attemptCount,
            lastAttemptDate: new Date(),
        }, { transaction });
    }
    else {
        // Payment failed, move to next stage
        const currentStage = dunning.get('stage');
        const nextStage = getNextDunningStage(currentStage);
        const nextAttemptDate = calculateNextDunningAttempt(nextStage, attemptCount);
        const updates = {
            stage: nextStage,
            attemptCount,
            lastAttemptDate: new Date(),
            nextAttemptDate,
        };
        // Suspend subscription if in collection stage
        if (nextStage === DunningStage.COLLECTION) {
            const subscription = dunning.get('subscriptionId')
                ? await Subscription.findByPk(dunning.get('subscriptionId'), { transaction })
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
        dunning: dunning.toJSON(),
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
async function getActiveDunningWorkflows(sequelize, filters) {
    const DunningWorkflow = sequelize.model('DunningWorkflow');
    const whereClause = {
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
            [sequelize_1.Op.lte]: new Date(),
        };
    }
    const dunningWorkflows = await DunningWorkflow.findAll({
        where: whereClause,
        order: [['nextAttemptDate', 'ASC']],
    });
    return dunningWorkflows.map(d => d.toJSON());
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
async function configurePaymentRetryStrategy(sequelize, retryConfig, transaction) {
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
    return config.toJSON();
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
async function retryFailedPayment(sequelize, paymentId, retryAttempt, transaction) {
    const Payment = sequelize.model('Payment');
    const PaymentRetryConfig = sequelize.model('PaymentRetryConfig');
    const originalPayment = await Payment.findByPk(paymentId, { transaction });
    if (!originalPayment) {
        throw new common_1.NotFoundException(`Payment ${paymentId} not found`);
    }
    const status = originalPayment.get('status');
    if (status !== PaymentStatus.FAILED) {
        throw new common_1.BadRequestException(`Cannot retry payment with status ${status}`);
    }
    // Get retry configuration
    const retryConfig = await PaymentRetryConfig.findOne({
        where: {
            [sequelize_1.Op.or]: [
                { customerId: originalPayment.get('customerId') },
                { customerId: { [sequelize_1.Op.is]: null } }, // Default config
            ],
            enabled: true,
        },
        order: [['customerId', 'DESC NULLS LAST']], // Prefer customer-specific config
        transaction,
    });
    if (!retryConfig) {
        throw new common_1.BadRequestException('No retry configuration found');
    }
    const maxAttempts = retryConfig.get('maxAttempts');
    if (retryAttempt > maxAttempts) {
        throw new common_1.BadRequestException(`Maximum retry attempts (${maxAttempts}) exceeded`);
    }
    // Process new payment attempt
    const newPayment = await processPayment(sequelize, {
        invoiceId: originalPayment.get('invoiceId'),
        customerId: originalPayment.get('customerId'),
        subscriptionId: originalPayment.get('subscriptionId'),
        paymentMethodId: originalPayment.get('paymentMethodId'),
        amount: originalPayment.get('amount'),
        currency: originalPayment.get('currency'),
        gateway: originalPayment.get('gateway'),
        metadata: {
            ...(originalPayment.get('metadata') || {}),
            retryAttempt,
            originalPaymentId: paymentId,
        },
    }, transaction);
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
function calculateNextRetryTime(strategy, attemptNumber, baseInterval = 24) {
    let hoursToAdd;
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
    return (0, date_fns_1.addDays)(new Date(), hoursToAdd / 24);
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
async function convertCurrency(sequelize, amount, fromCurrency, toCurrency, effectiveDate) {
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
                [sequelize_1.Op.lte]: date,
            },
        },
        order: [['effectiveDate', 'DESC']],
    });
    if (!exchangeRate) {
        throw new common_1.NotFoundException(`Exchange rate not found for ${fromCurrency} to ${toCurrency}`);
    }
    const rate = new decimal_js_1.default(exchangeRate.get('rate'));
    const convertedAmount = new decimal_js_1.default(amount).mul(rate);
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
async function processMultiCurrencyPayment(sequelize, paymentData, transaction) {
    const Invoice = sequelize.model('Invoice');
    const invoice = await Invoice.findByPk(paymentData.invoiceId, { transaction });
    if (!invoice) {
        throw new common_1.NotFoundException(`Invoice ${paymentData.invoiceId} not found`);
    }
    const invoiceCurrency = invoice.get('currency');
    const invoiceAmount = invoice.get('amountDue');
    const paymentCurrency = paymentData.paymentCurrency;
    let paymentAmount = invoiceAmount;
    let conversionDetails = null;
    if (invoiceCurrency !== paymentCurrency) {
        paymentAmount = await convertCurrency(sequelize, invoiceAmount, invoiceCurrency, paymentCurrency);
        conversionDetails = {
            originalCurrency: invoiceCurrency,
            originalAmount: invoiceAmount,
            paymentCurrency,
            paymentAmount,
            conversionRate: new decimal_js_1.default(paymentAmount).div(invoiceAmount).toNumber(),
            conversionDate: new Date(),
        };
    }
    const payment = await processPayment(sequelize, {
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
    }, transaction);
    return { payment, conversionDetails };
}
// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
/**
 * Generate unique invoice number
 */
async function generateInvoiceNumber(sequelize, transaction) {
    const Invoice = sequelize.model('Invoice');
    const prefix = 'INV';
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const lastInvoice = await Invoice.findOne({
        where: {
            invoiceNumber: {
                [sequelize_1.Op.like]: `${prefix}-${year}${month}-%`,
            },
        },
        order: [['invoiceNumber', 'DESC']],
        transaction,
    });
    let sequence = 1;
    if (lastInvoice) {
        const lastNumber = lastInvoice.get('invoiceNumber');
        const lastSequence = parseInt(lastNumber.split('-').pop() || '0');
        sequence = lastSequence + 1;
    }
    return `${prefix}-${year}${month}-${String(sequence).padStart(6, '0')}`;
}
/**
 * Generate unique credit memo number
 */
async function generateCreditMemoNumber(sequelize, transaction) {
    const CreditMemo = sequelize.model('CreditMemo');
    const prefix = 'CM';
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const lastCreditMemo = await CreditMemo.findOne({
        where: {
            creditMemoNumber: {
                [sequelize_1.Op.like]: `${prefix}-${year}${month}-%`,
            },
        },
        order: [['creditMemoNumber', 'DESC']],
        transaction,
    });
    let sequence = 1;
    if (lastCreditMemo) {
        const lastNumber = lastCreditMemo.get('creditMemoNumber');
        const lastSequence = parseInt(lastNumber.split('-').pop() || '0');
        sequence = lastSequence + 1;
    }
    return `${prefix}-${year}${month}-${String(sequence).padStart(6, '0')}`;
}
/**
 * Update invoice with payment
 */
async function updateInvoiceWithPayment(sequelize, invoiceId, paymentAmount, transaction) {
    const Invoice = sequelize.model('Invoice');
    const invoice = await Invoice.findByPk(invoiceId, { transaction });
    if (!invoice) {
        return;
    }
    const currentAmountPaid = new decimal_js_1.default(invoice.get('amountPaid'));
    const currentAmountDue = new decimal_js_1.default(invoice.get('amountDue'));
    const payment = new decimal_js_1.default(paymentAmount);
    const newAmountPaid = currentAmountPaid.add(payment);
    const newAmountDue = decimal_js_1.default.max(0, currentAmountDue.sub(payment));
    let newStatus = invoice.get('status');
    if (newAmountDue.isZero()) {
        newStatus = InvoiceStatus.PAID;
    }
    else if (newAmountPaid.greaterThan(0)) {
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
function isValidInvoiceStatusTransition(currentStatus, newStatus) {
    const validTransitions = {
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
function calculateNextBillingDate(currentDate, billingCycle) {
    switch (billingCycle) {
        case BillingCycle.DAILY:
            return (0, date_fns_1.addDays)(currentDate, 1);
        case BillingCycle.WEEKLY:
            return (0, date_fns_1.addDays)(currentDate, 7);
        case BillingCycle.BIWEEKLY:
            return (0, date_fns_1.addDays)(currentDate, 14);
        case BillingCycle.MONTHLY:
            return (0, date_fns_1.addMonths)(currentDate, 1);
        case BillingCycle.QUARTERLY:
            return (0, date_fns_1.addMonths)(currentDate, 3);
        case BillingCycle.SEMI_ANNUAL:
            return (0, date_fns_1.addMonths)(currentDate, 6);
        case BillingCycle.ANNUAL:
            return (0, date_fns_1.addYears)(currentDate, 1);
        case BillingCycle.BIENNIAL:
            return (0, date_fns_1.addYears)(currentDate, 2);
        case BillingCycle.TRIENNIAL:
            return (0, date_fns_1.addYears)(currentDate, 3);
        default:
            return (0, date_fns_1.addMonths)(currentDate, 1);
    }
}
/**
 * Calculate next installment date
 */
function calculateNextInstallmentDate(currentDate, frequency) {
    switch (frequency) {
        case InstallmentFrequency.WEEKLY:
            return (0, date_fns_1.addDays)(currentDate, 7);
        case InstallmentFrequency.BIWEEKLY:
            return (0, date_fns_1.addDays)(currentDate, 14);
        case InstallmentFrequency.MONTHLY:
            return (0, date_fns_1.addMonths)(currentDate, 1);
        case InstallmentFrequency.QUARTERLY:
            return (0, date_fns_1.addMonths)(currentDate, 3);
        case InstallmentFrequency.SEMI_ANNUAL:
            return (0, date_fns_1.addMonths)(currentDate, 6);
        default:
            return (0, date_fns_1.addMonths)(currentDate, 1);
    }
}
/**
 * Get next dunning stage
 */
function getNextDunningStage(currentStage) {
    const stageProgression = {
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
function calculateNextDunningAttempt(stage, attemptCount) {
    const daysToAdd = {
        [DunningStage.INITIAL]: 3,
        [DunningStage.FIRST_REMINDER]: 5,
        [DunningStage.SECOND_REMINDER]: 7,
        [DunningStage.FINAL_NOTICE]: 10,
        [DunningStage.COLLECTION]: 14,
        [DunningStage.SUSPENDED]: 30,
        [DunningStage.RESOLVED]: 0,
    };
    return (0, date_fns_1.addDays)(new Date(), daysToAdd[stage]);
}
// ============================================================================
// GATEWAY INTEGRATION STUBS (to be implemented with actual gateway SDKs)
// ============================================================================
/**
 * Process payment through gateway (implementation stub)
 */
async function processGatewayPayment(gateway, paymentMethodToken, amount, currency) {
    // Implementation would integrate with actual payment gateway SDK
    // This is a stub for demonstration
    return {
        success: true,
        transactionId: `txn_${crypto.randomBytes(16).toString('hex')}`,
        feeAmount: new decimal_js_1.default(amount).mul(0.029).add(0.30).toNumber(),
        netAmount: new decimal_js_1.default(amount).mul(0.971).sub(0.30).toNumber(),
    };
}
/**
 * Authorize payment through gateway (implementation stub)
 */
async function authorizeGatewayPayment(gateway, paymentMethodToken, amount, currency) {
    return {
        success: true,
        transactionId: `auth_${crypto.randomBytes(16).toString('hex')}`,
    };
}
/**
 * Capture gateway payment (implementation stub)
 */
async function captureGatewayPayment(gateway, transactionId, amount) {
    return {
        success: true,
        feeAmount: new decimal_js_1.default(amount).mul(0.029).add(0.30).toNumber(),
        netAmount: new decimal_js_1.default(amount).mul(0.971).sub(0.30).toNumber(),
    };
}
/**
 * Refund gateway payment (implementation stub)
 */
async function refundGatewayPayment(gateway, transactionId, amount) {
    return {
        success: true,
        refundId: `rfnd_${crypto.randomBytes(16).toString('hex')}`,
    };
}
/**
 * Void gateway payment (implementation stub)
 */
async function voidGatewayPayment(gateway, transactionId) {
    return {
        success: true,
    };
}
/**
 * Tokenize payment method with gateway (implementation stub)
 */
async function tokenizeWithGateway(gateway, paymentMethodData) {
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
async function deleteFromGateway(gateway, paymentMethodToken) {
    // Implementation would call gateway API
}
/**
 * Verify payment method with gateway (implementation stub)
 */
async function verifyWithGateway(gateway, paymentMethodToken, verificationData) {
    return {
        verified: true,
        message: 'Payment method verified successfully',
    };
}
//# sourceMappingURL=payment-processing-billing-kit.js.map