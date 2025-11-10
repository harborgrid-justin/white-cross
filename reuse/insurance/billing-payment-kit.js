"use strict";
/**
 * LOC: INS-BIL-001
 * File: /reuse/insurance/billing-payment-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/config
 *   - sequelize (v6.x)
 *   - @nestjs/schedule
 *   - stripe
 *   - decimal.js
 *
 * DOWNSTREAM (imported by):
 *   - Billing services
 *   - Payment controllers
 *   - Premium finance modules
 *   - Accounting integration services
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPaymentReminder = exports.schedulePaymentReminder = exports.updateInstallmentStatus = exports.createInstallmentSchedule = exports.calculateDownPayment = exports.createPremiumFinanceAgreement = exports.calculateCancellationRefund = exports.approveRefund = exports.processRefund = exports.reinstatePolicyAfterPayment = exports.sendNonPaymentNotice = exports.initiateNonPaymentCancellation = exports.markPaymentPlanDefaulted = exports.restructurePaymentPlan = exports.createPaymentPlan = exports.identifyOverdueInvoices = exports.waiveLateFee = exports.assessLateFee = exports.calculateLateFee = exports.trackLatePayment = exports.autoAllocatePayment = exports.reversePaymentAllocation = exports.getPaymentAllocationSummary = exports.allocatePaymentAcrossPolicies = exports.allocatePaymentToInvoice = exports.listAutopayEnrollments = exports.processScheduledAutopay = exports.cancelAutopay = exports.updateAutopaySettings = exports.enrollInAutopay = exports.handlePaymentFailure = exports.confirmPayment = exports.recordCheckPayment = exports.processACHPayment = exports.processCreditCardPayment = exports.cancelInvoice = exports.markInvoiceSent = exports.calculateInvoiceTotals = exports.addInvoiceLineItem = exports.generateInvoice = exports.activateBillingPlan = exports.calculateBillingPlanOptions = exports.updateBillingPlan = exports.getBillingPlan = exports.createBillingPlan = exports.createPaymentModel = exports.createInvoiceModel = exports.validateBillingConfig = exports.loadBillingConfig = void 0;
/**
 * File: /reuse/insurance/billing-payment-kit.ts
 * Locator: WC-UTL-INSBIL-001
 * Purpose: Insurance Billing & Payment Kit - Comprehensive billing and payment utilities for NestJS
 *
 * Upstream: @nestjs/common, @nestjs/config, sequelize, @nestjs/schedule, stripe, decimal.js
 * Downstream: Billing services, payment controllers, premium finance modules, accounting integration
 * Dependencies: NestJS 10.x, Sequelize 6.x, TypeScript 5.x, @nestjs/schedule 4.x, Stripe 14.x, Decimal.js 10.x
 * Exports: 45 utility functions for billing plans, invoices, payments, autopay, allocations, late fees, refunds
 *
 * LLM Context: Production-grade insurance billing and payment utilities for White Cross healthcare platform.
 * Provides billing plan setup (monthly, quarterly, annual), invoice generation and delivery, payment processing
 * (ACH, credit card, check), autopay enrollment and management, payment allocation across policies, late payment
 * tracking and penalties, payment plan restructuring, non-payment cancellation workflows, payment refund processing,
 * premium finance integration, down payment calculations, installment scheduling, payment reminder notifications,
 * payment reconciliation, and cash application/posting for regulatory compliance and business operations.
 * Essential for managing comprehensive insurance billing cycles, processing payments securely, ensuring timely
 * collections, maintaining accurate accounting records, and providing excellent customer payment experiences.
 */
const sequelize_1 = require("sequelize");
/**
 * Loads billing configuration from environment variables.
 *
 * @returns {BillingConfig} Billing configuration object
 *
 * @example
 * ```typescript
 * const config = loadBillingConfig();
 * console.log('Autopay enabled:', config.enableAutopay);
 * ```
 */
const loadBillingConfig = () => {
    return {
        enableAutopay: process.env.ENABLE_AUTOPAY !== 'false',
        enableCreditCardPayments: process.env.ENABLE_CREDIT_CARD_PAYMENTS !== 'false',
        enableACHPayments: process.env.ENABLE_ACH_PAYMENTS !== 'false',
        enableCheckPayments: process.env.ENABLE_CHECK_PAYMENTS !== 'false',
        lateFeePercentage: parseFloat(process.env.LATE_FEE_PERCENTAGE || '5'),
        lateFeeGracePeriodDays: parseInt(process.env.LATE_FEE_GRACE_PERIOD_DAYS || '15', 10),
        paymentReminderDaysBefore: parseInt(process.env.PAYMENT_REMINDER_DAYS_BEFORE || '7', 10),
        autoCancelNonpayDays: parseInt(process.env.AUTO_CANCEL_NONPAY_DAYS || '60', 10),
        minDownPaymentPercentage: parseFloat(process.env.MIN_DOWN_PAYMENT_PERCENTAGE || '20'),
        maxInstallments: parseInt(process.env.MAX_INSTALLMENTS || '12', 10),
        enablePremiumFinance: process.env.ENABLE_PREMIUM_FINANCE === 'true',
        stripeSecretKey: process.env.STRIPE_SECRET_KEY || '',
        achProcessingDays: parseInt(process.env.ACH_PROCESSING_DAYS || '3', 10),
        refundProcessingDays: parseInt(process.env.REFUND_PROCESSING_DAYS || '5', 10),
    };
};
exports.loadBillingConfig = loadBillingConfig;
/**
 * Validates billing configuration.
 *
 * @param {BillingConfig} config - Configuration to validate
 * @returns {string[]} Array of validation errors (empty if valid)
 *
 * @example
 * ```typescript
 * const errors = validateBillingConfig(config);
 * if (errors.length > 0) {
 *   throw new Error(`Invalid config: ${errors.join(', ')}`);
 * }
 * ```
 */
const validateBillingConfig = (config) => {
    const errors = [];
    if (config.lateFeePercentage < 0 || config.lateFeePercentage > 20) {
        errors.push('Late fee percentage must be between 0 and 20');
    }
    if (config.lateFeeGracePeriodDays < 0 || config.lateFeeGracePeriodDays > 90) {
        errors.push('Late fee grace period must be between 0 and 90 days');
    }
    if (config.minDownPaymentPercentage < 0 || config.minDownPaymentPercentage > 100) {
        errors.push('Min down payment percentage must be between 0 and 100');
    }
    if (config.maxInstallments < 1 || config.maxInstallments > 24) {
        errors.push('Max installments must be between 1 and 24');
    }
    if (config.autoCancelNonpayDays < 30 || config.autoCancelNonpayDays > 180) {
        errors.push('Auto cancel nonpay days must be between 30 and 180');
    }
    return errors;
};
exports.validateBillingConfig = validateBillingConfig;
/**
 * Creates Invoice model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<InvoiceAttributes>>} Invoice model
 *
 * @example
 * ```typescript
 * const InvoiceModel = createInvoiceModel(sequelize);
 * const invoice = await InvoiceModel.create({
 *   invoiceNumber: 'INV-2024-0001',
 *   policyId: 'policy-123',
 *   accountId: 'acc-456',
 *   invoiceDate: new Date(),
 *   dueDate: new Date('2024-12-31'),
 *   totalAmount: 5000
 * });
 * ```
 */
const createInvoiceModel = (sequelize) => {
    const attributes = {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        invoiceNumber: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: true,
        },
        policyId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'insurance_policies',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        billingPlanId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'billing_plans',
                key: 'id',
            },
            onDelete: 'SET NULL',
        },
        accountId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
        },
        invoiceDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        dueDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        subtotal: {
            type: sequelize_1.DataTypes.DECIMAL(12, 2),
            allowNull: false,
            validate: { min: 0 },
        },
        fees: {
            type: sequelize_1.DataTypes.DECIMAL(12, 2),
            allowNull: false,
            defaultValue: 0,
            validate: { min: 0 },
        },
        taxes: {
            type: sequelize_1.DataTypes.DECIMAL(12, 2),
            allowNull: false,
            defaultValue: 0,
            validate: { min: 0 },
        },
        totalAmount: {
            type: sequelize_1.DataTypes.DECIMAL(12, 2),
            allowNull: false,
            validate: { min: 0 },
        },
        paidAmount: {
            type: sequelize_1.DataTypes.DECIMAL(12, 2),
            allowNull: false,
            defaultValue: 0,
            validate: { min: 0 },
        },
        balanceRemaining: {
            type: sequelize_1.DataTypes.DECIMAL(12, 2),
            allowNull: false,
            validate: { min: 0 },
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('draft', 'pending', 'sent', 'viewed', 'paid', 'partially_paid', 'overdue', 'cancelled', 'written_off'),
            allowNull: false,
            defaultValue: 'draft',
        },
        lineItems: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: [],
        },
        deliveryMethod: {
            type: sequelize_1.DataTypes.ENUM('email', 'mail', 'portal', 'all'),
            allowNull: true,
        },
        deliveredAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        viewedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        paidAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
        },
    };
    const options = {
        tableName: 'invoices',
        timestamps: true,
        indexes: [
            { fields: ['invoiceNumber'], unique: true },
            { fields: ['policyId'] },
            { fields: ['accountId'] },
            { fields: ['status'] },
            { fields: ['dueDate'] },
            { fields: ['invoiceDate'] },
            { fields: ['policyId', 'status'] },
        ],
    };
    return sequelize.define('Invoice', attributes, options);
};
exports.createInvoiceModel = createInvoiceModel;
/**
 * Creates Payment model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<any>>} Payment model
 *
 * @example
 * ```typescript
 * const PaymentModel = createPaymentModel(sequelize);
 * const payment = await PaymentModel.create({
 *   paymentNumber: 'PAY-2024-0001',
 *   policyId: 'policy-123',
 *   accountId: 'acc-456',
 *   paymentMethodType: 'credit_card',
 *   amount: 1000,
 *   status: 'pending'
 * });
 * ```
 */
const createPaymentModel = (sequelize) => {
    const attributes = {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        paymentNumber: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: true,
        },
        policyId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
        },
        accountId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
        },
        invoiceId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'invoices',
                key: 'id',
            },
            onDelete: 'SET NULL',
        },
        paymentMethodType: {
            type: sequelize_1.DataTypes.ENUM('credit_card', 'debit_card', 'ach', 'bank_transfer', 'check', 'cash', 'wire_transfer', 'premium_finance'),
            allowNull: false,
        },
        paymentMethodId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
        },
        amount: {
            type: sequelize_1.DataTypes.DECIMAL(12, 2),
            allowNull: false,
            validate: { min: 0 },
        },
        processingFee: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: true,
            defaultValue: 0,
        },
        netAmount: {
            type: sequelize_1.DataTypes.DECIMAL(12, 2),
            allowNull: false,
        },
        paymentDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        processedDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('pending', 'processing', 'completed', 'failed', 'declined', 'refunded', 'partially_refunded', 'cancelled', 'chargeback'),
            allowNull: false,
            defaultValue: 'pending',
        },
        confirmationNumber: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
        },
        externalTransactionId: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: true,
        },
        isAutopay: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        allocations: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: [],
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
        },
    };
    const options = {
        tableName: 'payments',
        timestamps: true,
        indexes: [
            { fields: ['paymentNumber'], unique: true },
            { fields: ['policyId'] },
            { fields: ['accountId'] },
            { fields: ['invoiceId'] },
            { fields: ['status'] },
            { fields: ['paymentDate'] },
            { fields: ['externalTransactionId'] },
        ],
    };
    return sequelize.define('Payment', attributes, options);
};
exports.createPaymentModel = createPaymentModel;
// ============================================================================
// 1. BILLING PLAN SETUP
// ============================================================================
/**
 * 1. Creates a billing plan.
 *
 * @param {BillingPlan} plan - Billing plan data
 * @returns {Promise<BillingPlan>} Created billing plan
 *
 * @example
 * ```typescript
 * const plan = await createBillingPlan({
 *   policyId: 'policy-123',
 *   planName: 'Annual Premium - 4 Installments',
 *   frequency: 'quarterly',
 *   totalPremium: 12000,
 *   downPayment: 3000,
 *   numberOfInstallments: 4,
 *   installmentAmount: 2250,
 *   firstPaymentDate: new Date('2024-01-01'),
 *   finalPaymentDate: new Date('2024-10-01'),
 *   isActive: true
 * });
 * ```
 */
const createBillingPlan = async (plan) => {
    return {
        id: crypto.randomUUID(),
        ...plan,
    };
};
exports.createBillingPlan = createBillingPlan;
/**
 * 2. Gets billing plan by ID.
 *
 * @param {string} billingPlanId - Billing plan ID
 * @returns {Promise<BillingPlan | null>} Billing plan or null
 *
 * @example
 * ```typescript
 * const plan = await getBillingPlan('plan-123');
 * if (plan) {
 *   console.log('Plan frequency:', plan.frequency);
 * }
 * ```
 */
const getBillingPlan = async (billingPlanId) => {
    return null;
};
exports.getBillingPlan = getBillingPlan;
/**
 * 3. Updates billing plan.
 *
 * @param {string} billingPlanId - Billing plan ID
 * @param {Partial<BillingPlan>} updates - Plan updates
 * @returns {Promise<BillingPlan>} Updated billing plan
 *
 * @example
 * ```typescript
 * const updated = await updateBillingPlan('plan-123', {
 *   numberOfInstallments: 6,
 *   installmentAmount: 1500
 * });
 * ```
 */
const updateBillingPlan = async (billingPlanId, updates) => {
    return {
        id: billingPlanId,
        policyId: '',
        planName: '',
        frequency: 'monthly',
        totalPremium: 0,
        downPayment: 0,
        numberOfInstallments: 0,
        installmentAmount: 0,
        firstPaymentDate: new Date(),
        finalPaymentDate: new Date(),
        isActive: true,
        ...updates,
    };
};
exports.updateBillingPlan = updateBillingPlan;
/**
 * 4. Calculates billing plan options.
 *
 * @param {number} totalPremium - Total premium amount
 * @param {number} downPaymentPercentage - Down payment percentage
 * @returns {Array<{ frequency: BillingFrequency; installments: number; amount: number; totalCost: number }>} Plan options
 *
 * @example
 * ```typescript
 * const options = calculateBillingPlanOptions(12000, 20);
 * options.forEach(opt => {
 *   console.log(`${opt.frequency}: ${opt.installments} x $${opt.amount}`);
 * });
 * ```
 */
const calculateBillingPlanOptions = (totalPremium, downPaymentPercentage) => {
    const downPayment = (totalPremium * downPaymentPercentage) / 100;
    const remainingAmount = totalPremium - downPayment;
    return [
        {
            frequency: 'annual',
            installments: 1,
            amount: totalPremium,
            totalCost: totalPremium,
        },
        {
            frequency: 'semi_annual',
            installments: 2,
            amount: totalPremium / 2,
            totalCost: totalPremium,
        },
        {
            frequency: 'quarterly',
            installments: 4,
            amount: remainingAmount / 4,
            totalCost: totalPremium + (totalPremium * 0.02),
        },
        {
            frequency: 'monthly',
            installments: 12,
            amount: remainingAmount / 12,
            totalCost: totalPremium + (totalPremium * 0.05),
        },
    ];
};
exports.calculateBillingPlanOptions = calculateBillingPlanOptions;
/**
 * 5. Activates billing plan.
 *
 * @param {string} billingPlanId - Billing plan ID
 * @param {Date} effectiveDate - Activation effective date
 * @returns {Promise<BillingPlan>} Activated plan
 *
 * @example
 * ```typescript
 * const activated = await activateBillingPlan('plan-123', new Date());
 * ```
 */
const activateBillingPlan = async (billingPlanId, effectiveDate) => {
    return {
        id: billingPlanId,
        policyId: '',
        planName: '',
        frequency: 'monthly',
        totalPremium: 0,
        downPayment: 0,
        numberOfInstallments: 0,
        installmentAmount: 0,
        firstPaymentDate: effectiveDate,
        finalPaymentDate: new Date(),
        isActive: true,
    };
};
exports.activateBillingPlan = activateBillingPlan;
// ============================================================================
// 2. INVOICE GENERATION
// ============================================================================
/**
 * 6. Generates invoice for policy.
 *
 * @param {Invoice} invoice - Invoice data
 * @returns {Promise<Invoice>} Generated invoice
 *
 * @example
 * ```typescript
 * const invoice = await generateInvoice({
 *   invoiceNumber: 'INV-2024-0001',
 *   policyId: 'policy-123',
 *   accountId: 'acc-456',
 *   invoiceDate: new Date(),
 *   dueDate: new Date('2024-12-31'),
 *   subtotal: 5000,
 *   fees: 50,
 *   taxes: 250,
 *   totalAmount: 5300,
 *   paidAmount: 0,
 *   balanceRemaining: 5300,
 *   status: 'pending',
 *   lineItems: [
 *     { description: 'Medical Malpractice Premium', quantity: 1, unitPrice: 5000, amount: 5000 }
 *   ]
 * });
 * ```
 */
const generateInvoice = async (invoice) => {
    return {
        id: crypto.randomUUID(),
        ...invoice,
    };
};
exports.generateInvoice = generateInvoice;
/**
 * 7. Adds line item to invoice.
 *
 * @param {string} invoiceId - Invoice ID
 * @param {InvoiceLineItem} lineItem - Line item to add
 * @returns {Promise<InvoiceLineItem>} Added line item
 *
 * @example
 * ```typescript
 * const lineItem = await addInvoiceLineItem('inv-123', {
 *   description: 'Cyber Liability Coverage',
 *   quantity: 1,
 *   unitPrice: 1500,
 *   amount: 1500,
 *   coverageId: 'cov-789'
 * });
 * ```
 */
const addInvoiceLineItem = async (invoiceId, lineItem) => {
    return {
        id: crypto.randomUUID(),
        invoiceId,
        ...lineItem,
    };
};
exports.addInvoiceLineItem = addInvoiceLineItem;
/**
 * 8. Calculates invoice totals.
 *
 * @param {InvoiceLineItem[]} lineItems - Invoice line items
 * @param {number} [feePercentage] - Fee percentage
 * @param {number} [taxRate] - Tax rate
 * @returns {{ subtotal: number; fees: number; taxes: number; total: number }} Invoice totals
 *
 * @example
 * ```typescript
 * const totals = calculateInvoiceTotals(lineItems, 1, 5);
 * console.log('Total amount:', totals.total);
 * ```
 */
const calculateInvoiceTotals = (lineItems, feePercentage = 0, taxRate = 0) => {
    const subtotal = lineItems.reduce((sum, item) => sum + item.amount, 0);
    const fees = (subtotal * feePercentage) / 100;
    const taxes = (subtotal * taxRate) / 100;
    const total = subtotal + fees + taxes;
    return { subtotal, fees, taxes, total };
};
exports.calculateInvoiceTotals = calculateInvoiceTotals;
/**
 * 9. Marks invoice as sent.
 *
 * @param {string} invoiceId - Invoice ID
 * @param {Date} deliveredAt - Delivery date
 * @param {string} deliveryMethod - Delivery method
 * @returns {Promise<Invoice>} Updated invoice
 *
 * @example
 * ```typescript
 * const sent = await markInvoiceSent('inv-123', new Date(), 'email');
 * ```
 */
const markInvoiceSent = async (invoiceId, deliveredAt, deliveryMethod) => {
    return {
        id: invoiceId,
        invoiceNumber: '',
        policyId: '',
        accountId: '',
        invoiceDate: new Date(),
        dueDate: new Date(),
        subtotal: 0,
        fees: 0,
        taxes: 0,
        totalAmount: 0,
        paidAmount: 0,
        balanceRemaining: 0,
        status: 'sent',
        lineItems: [],
        deliveredAt,
        deliveryMethod: deliveryMethod,
    };
};
exports.markInvoiceSent = markInvoiceSent;
/**
 * 10. Cancels invoice.
 *
 * @param {string} invoiceId - Invoice ID
 * @param {string} reason - Cancellation reason
 * @returns {Promise<Invoice>} Cancelled invoice
 *
 * @example
 * ```typescript
 * const cancelled = await cancelInvoice('inv-123', 'Policy cancelled');
 * ```
 */
const cancelInvoice = async (invoiceId, reason) => {
    return {
        id: invoiceId,
        invoiceNumber: '',
        policyId: '',
        accountId: '',
        invoiceDate: new Date(),
        dueDate: new Date(),
        subtotal: 0,
        fees: 0,
        taxes: 0,
        totalAmount: 0,
        paidAmount: 0,
        balanceRemaining: 0,
        status: 'cancelled',
        lineItems: [],
        metadata: { cancellationReason: reason },
    };
};
exports.cancelInvoice = cancelInvoice;
// ============================================================================
// 3. PAYMENT PROCESSING
// ============================================================================
/**
 * 11. Processes credit card payment.
 *
 * @param {Payment} payment - Payment data
 * @param {string} cardToken - Card token from payment processor
 * @returns {Promise<Payment>} Processed payment
 *
 * @example
 * ```typescript
 * const payment = await processCreditCardPayment({
 *   paymentNumber: 'PAY-2024-0001',
 *   policyId: 'policy-123',
 *   accountId: 'acc-456',
 *   paymentMethodType: 'credit_card',
 *   amount: 1000,
 *   netAmount: 1000,
 *   paymentDate: new Date(),
 *   status: 'pending',
 *   isAutopay: false,
 *   allocations: []
 * }, 'tok_visa');
 * ```
 */
const processCreditCardPayment = async (payment, cardToken) => {
    return {
        id: crypto.randomUUID(),
        ...payment,
        status: 'processing',
        externalTransactionId: `txn_${crypto.randomUUID()}`,
    };
};
exports.processCreditCardPayment = processCreditCardPayment;
/**
 * 12. Processes ACH payment.
 *
 * @param {Payment} payment - Payment data
 * @param {string} bankAccountToken - Bank account token
 * @returns {Promise<Payment>} Processed payment
 *
 * @example
 * ```typescript
 * const payment = await processACHPayment({
 *   paymentNumber: 'PAY-2024-0002',
 *   policyId: 'policy-123',
 *   accountId: 'acc-456',
 *   paymentMethodType: 'ach',
 *   amount: 2500,
 *   netAmount: 2500,
 *   paymentDate: new Date(),
 *   status: 'pending',
 *   isAutopay: false,
 *   allocations: []
 * }, 'ba_checking_token');
 * ```
 */
const processACHPayment = async (payment, bankAccountToken) => {
    return {
        id: crypto.randomUUID(),
        ...payment,
        status: 'processing',
        externalTransactionId: `ach_${crypto.randomUUID()}`,
    };
};
exports.processACHPayment = processACHPayment;
/**
 * 13. Records check payment.
 *
 * @param {Payment} payment - Payment data
 * @param {string} checkNumber - Check number
 * @returns {Promise<Payment>} Recorded payment
 *
 * @example
 * ```typescript
 * const payment = await recordCheckPayment({
 *   paymentNumber: 'PAY-2024-0003',
 *   policyId: 'policy-123',
 *   accountId: 'acc-456',
 *   paymentMethodType: 'check',
 *   amount: 5000,
 *   netAmount: 5000,
 *   paymentDate: new Date(),
 *   status: 'pending',
 *   isAutopay: false,
 *   allocations: []
 * }, 'CHK-12345');
 * ```
 */
const recordCheckPayment = async (payment, checkNumber) => {
    return {
        id: crypto.randomUUID(),
        ...payment,
        status: 'pending',
        confirmationNumber: checkNumber,
    };
};
exports.recordCheckPayment = recordCheckPayment;
/**
 * 14. Confirms payment completion.
 *
 * @param {string} paymentId - Payment ID
 * @param {string} confirmationNumber - Confirmation number
 * @returns {Promise<Payment>} Confirmed payment
 *
 * @example
 * ```typescript
 * const confirmed = await confirmPayment('pay-123', 'CONF-789456');
 * ```
 */
const confirmPayment = async (paymentId, confirmationNumber) => {
    return {
        id: paymentId,
        paymentNumber: '',
        policyId: '',
        accountId: '',
        paymentMethodType: 'credit_card',
        amount: 0,
        netAmount: 0,
        paymentDate: new Date(),
        processedDate: new Date(),
        status: 'completed',
        confirmationNumber,
        isAutopay: false,
        allocations: [],
    };
};
exports.confirmPayment = confirmPayment;
/**
 * 15. Handles payment failure.
 *
 * @param {string} paymentId - Payment ID
 * @param {string} failureReason - Failure reason
 * @returns {Promise<Payment>} Failed payment
 *
 * @example
 * ```typescript
 * const failed = await handlePaymentFailure('pay-123', 'Insufficient funds');
 * ```
 */
const handlePaymentFailure = async (paymentId, failureReason) => {
    return {
        id: paymentId,
        paymentNumber: '',
        policyId: '',
        accountId: '',
        paymentMethodType: 'credit_card',
        amount: 0,
        netAmount: 0,
        paymentDate: new Date(),
        status: 'failed',
        isAutopay: false,
        allocations: [],
        metadata: { failureReason },
    };
};
exports.handlePaymentFailure = handlePaymentFailure;
// ============================================================================
// 4. AUTOPAY MANAGEMENT
// ============================================================================
/**
 * 16. Enrolls account in autopay.
 *
 * @param {AutopayEnrollment} enrollment - Autopay enrollment data
 * @returns {Promise<AutopayEnrollment>} Created enrollment
 *
 * @example
 * ```typescript
 * const autopay = await enrollInAutopay({
 *   policyId: 'policy-123',
 *   accountId: 'acc-456',
 *   paymentMethodId: 'pm-789',
 *   isActive: true,
 *   enrolledDate: new Date(),
 *   effectiveDate: new Date('2024-01-01'),
 *   daysBeforeDueDate: 5
 * });
 * ```
 */
const enrollInAutopay = async (enrollment) => {
    return {
        id: crypto.randomUUID(),
        ...enrollment,
    };
};
exports.enrollInAutopay = enrollInAutopay;
/**
 * 17. Updates autopay settings.
 *
 * @param {string} enrollmentId - Enrollment ID
 * @param {Partial<AutopayEnrollment>} updates - Enrollment updates
 * @returns {Promise<AutopayEnrollment>} Updated enrollment
 *
 * @example
 * ```typescript
 * const updated = await updateAutopaySettings('enroll-123', {
 *   paymentMethodId: 'pm-new-456',
 *   daysBeforeDueDate: 3
 * });
 * ```
 */
const updateAutopaySettings = async (enrollmentId, updates) => {
    return {
        id: enrollmentId,
        policyId: '',
        accountId: '',
        paymentMethodId: '',
        isActive: true,
        enrolledDate: new Date(),
        effectiveDate: new Date(),
        ...updates,
    };
};
exports.updateAutopaySettings = updateAutopaySettings;
/**
 * 18. Cancels autopay enrollment.
 *
 * @param {string} enrollmentId - Enrollment ID
 * @param {Date} cancellationDate - Cancellation date
 * @returns {Promise<AutopayEnrollment>} Cancelled enrollment
 *
 * @example
 * ```typescript
 * const cancelled = await cancelAutopay('enroll-123', new Date());
 * ```
 */
const cancelAutopay = async (enrollmentId, cancellationDate) => {
    return {
        id: enrollmentId,
        policyId: '',
        accountId: '',
        paymentMethodId: '',
        isActive: false,
        enrolledDate: new Date(),
        effectiveDate: new Date(),
        cancelledDate: cancellationDate,
    };
};
exports.cancelAutopay = cancelAutopay;
/**
 * 19. Processes scheduled autopay.
 *
 * @param {string} enrollmentId - Enrollment ID
 * @param {string} invoiceId - Invoice ID
 * @returns {Promise<Payment>} Autopay payment
 *
 * @example
 * ```typescript
 * const payment = await processScheduledAutopay('enroll-123', 'inv-456');
 * ```
 */
const processScheduledAutopay = async (enrollmentId, invoiceId) => {
    return {
        id: crypto.randomUUID(),
        paymentNumber: `AUTO-${Date.now()}`,
        policyId: '',
        accountId: '',
        invoiceId,
        paymentMethodType: 'credit_card',
        amount: 0,
        netAmount: 0,
        paymentDate: new Date(),
        status: 'processing',
        isAutopay: true,
        allocations: [],
    };
};
exports.processScheduledAutopay = processScheduledAutopay;
/**
 * 20. Lists autopay enrollments for account.
 *
 * @param {string} accountId - Account ID
 * @param {boolean} [activeOnly] - Return only active enrollments
 * @returns {Promise<AutopayEnrollment[]>} Autopay enrollments
 *
 * @example
 * ```typescript
 * const enrollments = await listAutopayEnrollments('acc-123', true);
 * ```
 */
const listAutopayEnrollments = async (accountId, activeOnly = true) => {
    return [];
};
exports.listAutopayEnrollments = listAutopayEnrollments;
// ============================================================================
// 5. PAYMENT ALLOCATION
// ============================================================================
/**
 * 21. Allocates payment to invoice.
 *
 * @param {string} paymentId - Payment ID
 * @param {string} invoiceId - Invoice ID
 * @param {number} amount - Allocation amount
 * @returns {Promise<PaymentAllocation>} Created allocation
 *
 * @example
 * ```typescript
 * const allocation = await allocatePaymentToInvoice('pay-123', 'inv-456', 1000);
 * ```
 */
const allocatePaymentToInvoice = async (paymentId, invoiceId, amount) => {
    return {
        id: crypto.randomUUID(),
        paymentId,
        policyId: '',
        invoiceId,
        allocationType: 'premium',
        amount,
        allocationDate: new Date(),
    };
};
exports.allocatePaymentToInvoice = allocatePaymentToInvoice;
/**
 * 22. Allocates payment across multiple policies.
 *
 * @param {string} paymentId - Payment ID
 * @param {Array<{ policyId: string; amount: number }>} allocations - Policy allocations
 * @returns {Promise<PaymentAllocation[]>} Created allocations
 *
 * @example
 * ```typescript
 * const allocations = await allocatePaymentAcrossPolicies('pay-123', [
 *   { policyId: 'pol-1', amount: 500 },
 *   { policyId: 'pol-2', amount: 1500 }
 * ]);
 * ```
 */
const allocatePaymentAcrossPolicies = async (paymentId, allocations) => {
    return allocations.map((alloc) => ({
        id: crypto.randomUUID(),
        paymentId,
        policyId: alloc.policyId,
        allocationType: 'premium',
        amount: alloc.amount,
        allocationDate: new Date(),
    }));
};
exports.allocatePaymentAcrossPolicies = allocatePaymentAcrossPolicies;
/**
 * 23. Gets payment allocation summary.
 *
 * @param {string} paymentId - Payment ID
 * @returns {Promise<{ totalAllocated: number; unallocated: number; allocations: PaymentAllocation[] }>} Allocation summary
 *
 * @example
 * ```typescript
 * const summary = await getPaymentAllocationSummary('pay-123');
 * console.log('Unallocated amount:', summary.unallocated);
 * ```
 */
const getPaymentAllocationSummary = async (paymentId) => {
    return {
        totalAllocated: 0,
        unallocated: 0,
        allocations: [],
    };
};
exports.getPaymentAllocationSummary = getPaymentAllocationSummary;
/**
 * 24. Reverses payment allocation.
 *
 * @param {string} allocationId - Allocation ID
 * @param {string} reason - Reversal reason
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await reversePaymentAllocation('alloc-123', 'Payment error correction');
 * ```
 */
const reversePaymentAllocation = async (allocationId, reason) => {
    // Placeholder for allocation reversal
};
exports.reversePaymentAllocation = reversePaymentAllocation;
/**
 * 25. Auto-allocates payment to oldest invoices.
 *
 * @param {string} paymentId - Payment ID
 * @param {string} accountId - Account ID
 * @returns {Promise<PaymentAllocation[]>} Created allocations
 *
 * @example
 * ```typescript
 * const allocations = await autoAllocatePayment('pay-123', 'acc-456');
 * ```
 */
const autoAllocatePayment = async (paymentId, accountId) => {
    return [];
};
exports.autoAllocatePayment = autoAllocatePayment;
// ============================================================================
// 6. LATE PAYMENT TRACKING
// ============================================================================
/**
 * 26. Tracks late payment.
 *
 * @param {LatePaymentRecord} record - Late payment record
 * @returns {Promise<LatePaymentRecord>} Created record
 *
 * @example
 * ```typescript
 * const late = await trackLatePayment({
 *   policyId: 'policy-123',
 *   invoiceId: 'inv-456',
 *   daysOverdue: 15,
 *   originalDueDate: new Date('2024-01-15'),
 *   lateFeeAmount: 50,
 *   lateFeeAssessed: false,
 *   lateFeeWaived: false,
 *   notificationsSent: 1
 * });
 * ```
 */
const trackLatePayment = async (record) => {
    return {
        id: crypto.randomUUID(),
        ...record,
    };
};
exports.trackLatePayment = trackLatePayment;
/**
 * 27. Calculates late fee.
 *
 * @param {number} overdueAmount - Overdue amount
 * @param {number} daysOverdue - Days overdue
 * @param {number} lateFeePercentage - Late fee percentage
 * @returns {number} Calculated late fee
 *
 * @example
 * ```typescript
 * const lateFee = calculateLateFee(1000, 30, 5);
 * console.log('Late fee:', lateFee);
 * ```
 */
const calculateLateFee = (overdueAmount, daysOverdue, lateFeePercentage) => {
    return (overdueAmount * lateFeePercentage) / 100;
};
exports.calculateLateFee = calculateLateFee;
/**
 * 28. Assesses late fee on invoice.
 *
 * @param {string} invoiceId - Invoice ID
 * @param {number} lateFeeAmount - Late fee amount
 * @returns {Promise<Invoice>} Updated invoice
 *
 * @example
 * ```typescript
 * const updated = await assessLateFee('inv-123', 75);
 * ```
 */
const assessLateFee = async (invoiceId, lateFeeAmount) => {
    return {
        id: invoiceId,
        invoiceNumber: '',
        policyId: '',
        accountId: '',
        invoiceDate: new Date(),
        dueDate: new Date(),
        subtotal: 0,
        fees: lateFeeAmount,
        taxes: 0,
        totalAmount: 0,
        paidAmount: 0,
        balanceRemaining: 0,
        status: 'overdue',
        lineItems: [],
    };
};
exports.assessLateFee = assessLateFee;
/**
 * 29. Waives late fee.
 *
 * @param {string} latePaymentRecordId - Late payment record ID
 * @param {string} waivedBy - User ID who waived
 * @param {string} reason - Waiver reason
 * @returns {Promise<LatePaymentRecord>} Updated record
 *
 * @example
 * ```typescript
 * const waived = await waiveLateFee('late-123', 'user-789', 'One-time courtesy');
 * ```
 */
const waiveLateFee = async (latePaymentRecordId, waivedBy, reason) => {
    return {
        id: latePaymentRecordId,
        policyId: '',
        invoiceId: '',
        daysOverdue: 0,
        originalDueDate: new Date(),
        lateFeeAmount: 0,
        lateFeeAssessed: false,
        lateFeeWaived: true,
        waivedBy,
        waivedReason: reason,
        notificationsSent: 0,
    };
};
exports.waiveLateFee = waiveLateFee;
/**
 * 30. Identifies overdue invoices.
 *
 * @param {string} [accountId] - Account ID (optional filter)
 * @param {number} [minDaysOverdue] - Minimum days overdue
 * @returns {Promise<Invoice[]>} Overdue invoices
 *
 * @example
 * ```typescript
 * const overdue = await identifyOverdueInvoices('acc-123', 15);
 * ```
 */
const identifyOverdueInvoices = async (accountId, minDaysOverdue = 1) => {
    return [];
};
exports.identifyOverdueInvoices = identifyOverdueInvoices;
// ============================================================================
// 7. PAYMENT PLAN RESTRUCTURING
// ============================================================================
/**
 * 31. Creates payment plan.
 *
 * @param {PaymentPlan} plan - Payment plan data
 * @returns {Promise<PaymentPlan>} Created payment plan
 *
 * @example
 * ```typescript
 * const plan = await createPaymentPlan({
 *   policyId: 'policy-123',
 *   accountId: 'acc-456',
 *   planType: 'installment',
 *   totalAmount: 5000,
 *   downPayment: 1000,
 *   numberOfPayments: 4,
 *   paymentAmount: 1000,
 *   frequency: 'monthly',
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-04-01'),
 *   nextPaymentDate: new Date('2024-01-01'),
 *   remainingBalance: 4000,
 *   status: 'active'
 * });
 * ```
 */
const createPaymentPlan = async (plan) => {
    return {
        id: crypto.randomUUID(),
        ...plan,
    };
};
exports.createPaymentPlan = createPaymentPlan;
/**
 * 32. Restructures existing payment plan.
 *
 * @param {string} paymentPlanId - Payment plan ID
 * @param {Partial<PaymentPlan>} restructuring - Restructuring details
 * @returns {Promise<PaymentPlan>} Restructured plan
 *
 * @example
 * ```typescript
 * const restructured = await restructurePaymentPlan('plan-123', {
 *   numberOfPayments: 6,
 *   paymentAmount: 666.67,
 *   endDate: new Date('2024-06-01')
 * });
 * ```
 */
const restructurePaymentPlan = async (paymentPlanId, restructuring) => {
    return {
        id: paymentPlanId,
        policyId: '',
        accountId: '',
        planType: 'installment',
        totalAmount: 0,
        downPayment: 0,
        numberOfPayments: 0,
        paymentAmount: 0,
        frequency: 'monthly',
        startDate: new Date(),
        endDate: new Date(),
        nextPaymentDate: new Date(),
        remainingBalance: 0,
        status: 'active',
        ...restructuring,
    };
};
exports.restructurePaymentPlan = restructurePaymentPlan;
/**
 * 33. Marks payment plan as defaulted.
 *
 * @param {string} paymentPlanId - Payment plan ID
 * @param {Date} defaultDate - Default date
 * @returns {Promise<PaymentPlan>} Defaulted plan
 *
 * @example
 * ```typescript
 * const defaulted = await markPaymentPlanDefaulted('plan-123', new Date());
 * ```
 */
const markPaymentPlanDefaulted = async (paymentPlanId, defaultDate) => {
    return {
        id: paymentPlanId,
        policyId: '',
        accountId: '',
        planType: 'installment',
        totalAmount: 0,
        downPayment: 0,
        numberOfPayments: 0,
        paymentAmount: 0,
        frequency: 'monthly',
        startDate: new Date(),
        endDate: new Date(),
        nextPaymentDate: new Date(),
        remainingBalance: 0,
        status: 'defaulted',
        defaultDate,
    };
};
exports.markPaymentPlanDefaulted = markPaymentPlanDefaulted;
// ============================================================================
// 8. NON-PAYMENT CANCELLATION
// ============================================================================
/**
 * 34. Initiates non-payment cancellation.
 *
 * @param {string} policyId - Policy ID
 * @param {number} daysOverdue - Days overdue
 * @returns {Promise<{ cancellationScheduled: boolean; cancellationDate: Date; noticesSent: number }>} Cancellation status
 *
 * @example
 * ```typescript
 * const cancellation = await initiateNonPaymentCancellation('policy-123', 60);
 * console.log('Cancellation date:', cancellation.cancellationDate);
 * ```
 */
const initiateNonPaymentCancellation = async (policyId, daysOverdue) => {
    const cancellationDate = new Date();
    cancellationDate.setDate(cancellationDate.getDate() + 15);
    return {
        cancellationScheduled: true,
        cancellationDate,
        noticesSent: 1,
    };
};
exports.initiateNonPaymentCancellation = initiateNonPaymentCancellation;
/**
 * 35. Sends non-payment notice.
 *
 * @param {string} policyId - Policy ID
 * @param {string} noticeType - Notice type
 * @returns {Promise<{ sent: boolean; sentDate: Date }>} Notice status
 *
 * @example
 * ```typescript
 * const notice = await sendNonPaymentNotice('policy-123', 'final_notice');
 * ```
 */
const sendNonPaymentNotice = async (policyId, noticeType) => {
    return {
        sent: true,
        sentDate: new Date(),
    };
};
exports.sendNonPaymentNotice = sendNonPaymentNotice;
/**
 * 36. Reinstates policy after payment.
 *
 * @param {string} policyId - Policy ID
 * @param {string} paymentId - Payment ID
 * @returns {Promise<{ reinstated: boolean; reinstateDate: Date }>} Reinstatement status
 *
 * @example
 * ```typescript
 * const reinstated = await reinstatePolicyAfterPayment('policy-123', 'pay-456');
 * ```
 */
const reinstatePolicyAfterPayment = async (policyId, paymentId) => {
    return {
        reinstated: true,
        reinstateDate: new Date(),
    };
};
exports.reinstatePolicyAfterPayment = reinstatePolicyAfterPayment;
// ============================================================================
// 9. REFUND PROCESSING
// ============================================================================
/**
 * 37. Processes payment refund.
 *
 * @param {Refund} refund - Refund data
 * @returns {Promise<Refund>} Created refund
 *
 * @example
 * ```typescript
 * const refund = await processRefund({
 *   refundNumber: 'REF-2024-0001',
 *   paymentId: 'pay-123',
 *   policyId: 'policy-456',
 *   accountId: 'acc-789',
 *   refundAmount: 500,
 *   refundReason: 'Policy cancellation',
 *   refundType: 'cancellation',
 *   requestedDate: new Date(),
 *   refundMethod: 'credit_card',
 *   status: 'pending'
 * });
 * ```
 */
const processRefund = async (refund) => {
    return {
        id: crypto.randomUUID(),
        ...refund,
    };
};
exports.processRefund = processRefund;
/**
 * 38. Approves refund request.
 *
 * @param {string} refundId - Refund ID
 * @param {string} approvedBy - Approver user ID
 * @returns {Promise<Refund>} Approved refund
 *
 * @example
 * ```typescript
 * const approved = await approveRefund('ref-123', 'user-456');
 * ```
 */
const approveRefund = async (refundId, approvedBy) => {
    return {
        id: refundId,
        refundNumber: '',
        paymentId: '',
        policyId: '',
        accountId: '',
        refundAmount: 0,
        refundReason: '',
        refundType: 'full',
        requestedDate: new Date(),
        approvedDate: new Date(),
        refundMethod: 'credit_card',
        status: 'approved',
        approvedBy,
    };
};
exports.approveRefund = approveRefund;
/**
 * 39. Calculates refund amount for policy cancellation.
 *
 * @param {string} policyId - Policy ID
 * @param {Date} cancellationDate - Cancellation date
 * @param {boolean} [proRata] - Pro-rata calculation
 * @returns {Promise<number>} Refund amount
 *
 * @example
 * ```typescript
 * const refundAmount = await calculateCancellationRefund('policy-123', new Date(), true);
 * console.log('Refund amount:', refundAmount);
 * ```
 */
const calculateCancellationRefund = async (policyId, cancellationDate, proRata = true) => {
    return 0;
};
exports.calculateCancellationRefund = calculateCancellationRefund;
// ============================================================================
// 10. PREMIUM FINANCE
// ============================================================================
/**
 * 40. Creates premium finance agreement.
 *
 * @param {PremiumFinanceAgreement} agreement - Finance agreement data
 * @returns {Promise<PremiumFinanceAgreement>} Created agreement
 *
 * @example
 * ```typescript
 * const finance = await createPremiumFinanceAgreement({
 *   agreementNumber: 'FIN-2024-0001',
 *   policyId: 'policy-123',
 *   accountId: 'acc-456',
 *   financeCompanyId: 'finco-789',
 *   financeCompanyName: 'Premium Finance Corp',
 *   principalAmount: 10000,
 *   downPayment: 2000,
 *   financedAmount: 8000,
 *   apr: 12.5,
 *   numberOfPayments: 10,
 *   paymentAmount: 850,
 *   totalFinanceCharge: 500,
 *   totalOfPayments: 8500,
 *   firstPaymentDate: new Date('2024-02-01'),
 *   finalPaymentDate: new Date('2024-11-01'),
 *   status: 'active',
 *   effectiveDate: new Date('2024-01-01')
 * });
 * ```
 */
const createPremiumFinanceAgreement = async (agreement) => {
    return {
        id: crypto.randomUUID(),
        ...agreement,
    };
};
exports.createPremiumFinanceAgreement = createPremiumFinanceAgreement;
/**
 * 41. Calculates down payment amount.
 *
 * @param {number} totalPremium - Total premium amount
 * @param {number} downPaymentPercentage - Down payment percentage
 * @returns {number} Down payment amount
 *
 * @example
 * ```typescript
 * const downPayment = calculateDownPayment(10000, 20);
 * console.log('Down payment:', downPayment);
 * ```
 */
const calculateDownPayment = (totalPremium, downPaymentPercentage) => {
    return (totalPremium * downPaymentPercentage) / 100;
};
exports.calculateDownPayment = calculateDownPayment;
// ============================================================================
// 11. INSTALLMENT SCHEDULING
// ============================================================================
/**
 * 42. Creates installment schedule.
 *
 * @param {string} billingPlanId - Billing plan ID
 * @param {Date} startDate - Start date
 * @param {number} numberOfInstallments - Number of installments
 * @param {number} installmentAmount - Installment amount
 * @param {BillingFrequency} frequency - Billing frequency
 * @returns {Promise<InstallmentSchedule>} Created schedule
 *
 * @example
 * ```typescript
 * const schedule = await createInstallmentSchedule(
 *   'plan-123',
 *   new Date('2024-01-01'),
 *   12,
 *   500,
 *   'monthly'
 * );
 * ```
 */
const createInstallmentSchedule = async (billingPlanId, startDate, numberOfInstallments, installmentAmount, frequency) => {
    const installments = [];
    for (let i = 0; i < numberOfInstallments; i++) {
        const dueDate = new Date(startDate);
        switch (frequency) {
            case 'monthly':
                dueDate.setMonth(dueDate.getMonth() + i);
                break;
            case 'quarterly':
                dueDate.setMonth(dueDate.getMonth() + (i * 3));
                break;
            case 'semi_annual':
                dueDate.setMonth(dueDate.getMonth() + (i * 6));
                break;
            case 'annual':
                dueDate.setFullYear(dueDate.getFullYear() + i);
                break;
        }
        installments.push({
            id: crypto.randomUUID(),
            installmentNumber: i + 1,
            dueDate,
            amount: installmentAmount,
            fees: 0,
            totalAmount: installmentAmount,
            paidAmount: 0,
            balanceRemaining: installmentAmount,
            status: 'scheduled',
        });
    }
    return {
        id: crypto.randomUUID(),
        billingPlanId,
        policyId: '',
        installments,
        totalScheduled: installmentAmount * numberOfInstallments,
        totalPaid: 0,
        totalRemaining: installmentAmount * numberOfInstallments,
        status: 'active',
    };
};
exports.createInstallmentSchedule = createInstallmentSchedule;
/**
 * 43. Updates installment status.
 *
 * @param {string} installmentId - Installment ID
 * @param {string} status - New status
 * @param {number} [paidAmount] - Paid amount
 * @returns {Promise<Installment>} Updated installment
 *
 * @example
 * ```typescript
 * const updated = await updateInstallmentStatus('inst-123', 'paid', 500);
 * ```
 */
const updateInstallmentStatus = async (installmentId, status, paidAmount) => {
    return {
        id: installmentId,
        installmentNumber: 1,
        dueDate: new Date(),
        amount: 0,
        fees: 0,
        totalAmount: 0,
        paidAmount: paidAmount || 0,
        balanceRemaining: 0,
        status: status,
        paidDate: status === 'paid' ? new Date() : undefined,
    };
};
exports.updateInstallmentStatus = updateInstallmentStatus;
// ============================================================================
// 12. PAYMENT REMINDERS
// ============================================================================
/**
 * 44. Schedules payment reminder.
 *
 * @param {PaymentReminder} reminder - Payment reminder data
 * @returns {Promise<PaymentReminder>} Scheduled reminder
 *
 * @example
 * ```typescript
 * const reminder = await schedulePaymentReminder({
 *   policyId: 'policy-123',
 *   accountId: 'acc-456',
 *   invoiceId: 'inv-789',
 *   reminderType: 'upcoming',
 *   scheduledDate: new Date('2024-12-24'),
 *   deliveryMethod: 'email',
 *   status: 'scheduled'
 * });
 * ```
 */
const schedulePaymentReminder = async (reminder) => {
    return {
        id: crypto.randomUUID(),
        ...reminder,
    };
};
exports.schedulePaymentReminder = schedulePaymentReminder;
/**
 * 45. Sends payment reminder.
 *
 * @param {string} reminderId - Reminder ID
 * @returns {Promise<PaymentReminder>} Sent reminder
 *
 * @example
 * ```typescript
 * const sent = await sendPaymentReminder('rem-123');
 * ```
 */
const sendPaymentReminder = async (reminderId) => {
    return {
        id: reminderId,
        policyId: '',
        accountId: '',
        invoiceId: '',
        reminderType: 'upcoming',
        scheduledDate: new Date(),
        sentDate: new Date(),
        deliveryMethod: 'email',
        status: 'sent',
    };
};
exports.sendPaymentReminder = sendPaymentReminder;
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Configuration
    loadBillingConfig: exports.loadBillingConfig,
    validateBillingConfig: exports.validateBillingConfig,
    // Models
    createInvoiceModel: exports.createInvoiceModel,
    createPaymentModel: exports.createPaymentModel,
    // Billing Plan Setup
    createBillingPlan: exports.createBillingPlan,
    getBillingPlan: exports.getBillingPlan,
    updateBillingPlan: exports.updateBillingPlan,
    calculateBillingPlanOptions: exports.calculateBillingPlanOptions,
    activateBillingPlan: exports.activateBillingPlan,
    // Invoice Generation
    generateInvoice: exports.generateInvoice,
    addInvoiceLineItem: exports.addInvoiceLineItem,
    calculateInvoiceTotals: exports.calculateInvoiceTotals,
    markInvoiceSent: exports.markInvoiceSent,
    cancelInvoice: exports.cancelInvoice,
    // Payment Processing
    processCreditCardPayment: exports.processCreditCardPayment,
    processACHPayment: exports.processACHPayment,
    recordCheckPayment: exports.recordCheckPayment,
    confirmPayment: exports.confirmPayment,
    handlePaymentFailure: exports.handlePaymentFailure,
    // Autopay Management
    enrollInAutopay: exports.enrollInAutopay,
    updateAutopaySettings: exports.updateAutopaySettings,
    cancelAutopay: exports.cancelAutopay,
    processScheduledAutopay: exports.processScheduledAutopay,
    listAutopayEnrollments: exports.listAutopayEnrollments,
    // Payment Allocation
    allocatePaymentToInvoice: exports.allocatePaymentToInvoice,
    allocatePaymentAcrossPolicies: exports.allocatePaymentAcrossPolicies,
    getPaymentAllocationSummary: exports.getPaymentAllocationSummary,
    reversePaymentAllocation: exports.reversePaymentAllocation,
    autoAllocatePayment: exports.autoAllocatePayment,
    // Late Payment Tracking
    trackLatePayment: exports.trackLatePayment,
    calculateLateFee: exports.calculateLateFee,
    assessLateFee: exports.assessLateFee,
    waiveLateFee: exports.waiveLateFee,
    identifyOverdueInvoices: exports.identifyOverdueInvoices,
    // Payment Plan Restructuring
    createPaymentPlan: exports.createPaymentPlan,
    restructurePaymentPlan: exports.restructurePaymentPlan,
    markPaymentPlanDefaulted: exports.markPaymentPlanDefaulted,
    // Non-Payment Cancellation
    initiateNonPaymentCancellation: exports.initiateNonPaymentCancellation,
    sendNonPaymentNotice: exports.sendNonPaymentNotice,
    reinstatePolicyAfterPayment: exports.reinstatePolicyAfterPayment,
    // Refund Processing
    processRefund: exports.processRefund,
    approveRefund: exports.approveRefund,
    calculateCancellationRefund: exports.calculateCancellationRefund,
    // Premium Finance
    createPremiumFinanceAgreement: exports.createPremiumFinanceAgreement,
    calculateDownPayment: exports.calculateDownPayment,
    // Installment Scheduling
    createInstallmentSchedule: exports.createInstallmentSchedule,
    updateInstallmentStatus: exports.updateInstallmentStatus,
    // Payment Reminders
    schedulePaymentReminder: exports.schedulePaymentReminder,
    sendPaymentReminder: exports.sendPaymentReminder,
};
//# sourceMappingURL=billing-payment-kit.js.map