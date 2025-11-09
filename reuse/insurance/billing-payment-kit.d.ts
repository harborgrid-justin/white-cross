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
import { Sequelize } from 'sequelize';
/**
 * Billing and payment configuration from environment
 */
export interface BillingConfigEnv {
    ENABLE_AUTOPAY: string;
    ENABLE_CREDIT_CARD_PAYMENTS: string;
    ENABLE_ACH_PAYMENTS: string;
    ENABLE_CHECK_PAYMENTS: string;
    LATE_FEE_PERCENTAGE: string;
    LATE_FEE_GRACE_PERIOD_DAYS: string;
    PAYMENT_REMINDER_DAYS_BEFORE: string;
    AUTO_CANCEL_NONPAY_DAYS: string;
    MIN_DOWN_PAYMENT_PERCENTAGE: string;
    MAX_INSTALLMENTS: string;
    ENABLE_PREMIUM_FINANCE: string;
    STRIPE_SECRET_KEY: string;
    ACH_PROCESSING_DAYS: string;
    REFUND_PROCESSING_DAYS: string;
}
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
export declare const loadBillingConfig: () => BillingConfig;
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
export declare const validateBillingConfig: (config: BillingConfig) => string[];
/**
 * Billing configuration
 */
export interface BillingConfig {
    enableAutopay: boolean;
    enableCreditCardPayments: boolean;
    enableACHPayments: boolean;
    enableCheckPayments: boolean;
    lateFeePercentage: number;
    lateFeeGracePeriodDays: number;
    paymentReminderDaysBefore: number;
    autoCancelNonpayDays: number;
    minDownPaymentPercentage: number;
    maxInstallments: number;
    enablePremiumFinance: boolean;
    stripeSecretKey: string;
    achProcessingDays: number;
    refundProcessingDays: number;
}
/**
 * Billing plan frequency
 */
export type BillingFrequency = 'monthly' | 'quarterly' | 'semi_annual' | 'annual' | 'one_time' | 'custom';
/**
 * Payment method type
 */
export type PaymentMethodType = 'credit_card' | 'debit_card' | 'ach' | 'bank_transfer' | 'check' | 'cash' | 'wire_transfer' | 'premium_finance';
/**
 * Payment status
 */
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'declined' | 'refunded' | 'partially_refunded' | 'cancelled' | 'chargeback';
/**
 * Invoice status
 */
export type InvoiceStatus = 'draft' | 'pending' | 'sent' | 'viewed' | 'paid' | 'partially_paid' | 'overdue' | 'cancelled' | 'written_off';
/**
 * Billing plan
 */
export interface BillingPlan {
    id?: string;
    policyId: string;
    planName: string;
    frequency: BillingFrequency;
    totalPremium: number;
    downPayment: number;
    numberOfInstallments: number;
    installmentAmount: number;
    installmentFee?: number;
    firstPaymentDate: Date;
    finalPaymentDate: Date;
    isActive: boolean;
    autoRenew?: boolean;
    paymentMethodId?: string;
    metadata?: Record<string, any>;
}
/**
 * Invoice
 */
export interface Invoice {
    id?: string;
    invoiceNumber: string;
    policyId: string;
    billingPlanId?: string;
    accountId: string;
    invoiceDate: Date;
    dueDate: Date;
    subtotal: number;
    fees: number;
    taxes: number;
    totalAmount: number;
    paidAmount: number;
    balanceRemaining: number;
    status: InvoiceStatus;
    lineItems: InvoiceLineItem[];
    deliveryMethod?: 'email' | 'mail' | 'portal' | 'all';
    deliveredAt?: Date;
    viewedAt?: Date;
    paidAt?: Date;
    metadata?: Record<string, any>;
}
/**
 * Invoice line item
 */
export interface InvoiceLineItem {
    id?: string;
    invoiceId?: string;
    description: string;
    quantity: number;
    unitPrice: number;
    amount: number;
    coverageId?: string;
    periodStart?: Date;
    periodEnd?: Date;
    metadata?: Record<string, any>;
}
/**
 * Payment
 */
export interface Payment {
    id?: string;
    paymentNumber: string;
    policyId: string;
    accountId: string;
    invoiceId?: string;
    paymentMethodType: PaymentMethodType;
    paymentMethodId?: string;
    amount: number;
    processingFee?: number;
    netAmount: number;
    paymentDate: Date;
    processedDate?: Date;
    status: PaymentStatus;
    confirmationNumber?: string;
    externalTransactionId?: string;
    isAutopay: boolean;
    allocations: PaymentAllocation[];
    metadata?: Record<string, any>;
}
/**
 * Payment method
 */
export interface PaymentMethod {
    id?: string;
    accountId: string;
    methodType: PaymentMethodType;
    isDefault: boolean;
    isActive: boolean;
    displayName?: string;
    cardLast4?: string;
    cardBrand?: string;
    cardExpMonth?: number;
    cardExpYear?: number;
    accountLast4?: string;
    accountType?: 'checking' | 'savings';
    routingNumber?: string;
    stripePaymentMethodId?: string;
    externalReference?: string;
    metadata?: Record<string, any>;
    createdAt?: Date;
    updatedAt?: Date;
}
/**
 * Autopay enrollment
 */
export interface AutopayEnrollment {
    id?: string;
    policyId: string;
    accountId: string;
    paymentMethodId: string;
    isActive: boolean;
    enrolledDate: Date;
    effectiveDate: Date;
    cancelledDate?: Date;
    dayOfMonth?: number;
    daysBeforeDueDate?: number;
    metadata?: Record<string, any>;
}
/**
 * Payment allocation
 */
export interface PaymentAllocation {
    id?: string;
    paymentId: string;
    policyId: string;
    invoiceId?: string;
    coverageId?: string;
    allocationType: 'premium' | 'fee' | 'tax' | 'late_fee' | 'interest' | 'other';
    amount: number;
    allocationDate: Date;
    metadata?: Record<string, any>;
}
/**
 * Late payment record
 */
export interface LatePaymentRecord {
    id?: string;
    policyId: string;
    invoiceId: string;
    daysOverdue: number;
    originalDueDate: Date;
    lateFeeAmount: number;
    lateFeeAssessed: boolean;
    lateFeeAssessedDate?: Date;
    lateFeeWaived: boolean;
    waivedBy?: string;
    waivedReason?: string;
    notificationsSent: number;
    lastNotificationDate?: Date;
    metadata?: Record<string, any>;
}
/**
 * Payment plan
 */
export interface PaymentPlan {
    id?: string;
    policyId: string;
    accountId: string;
    planType: 'installment' | 'deferred' | 'custom';
    totalAmount: number;
    downPayment: number;
    numberOfPayments: number;
    paymentAmount: number;
    frequency: BillingFrequency;
    startDate: Date;
    endDate: Date;
    nextPaymentDate: Date;
    remainingBalance: number;
    status: 'active' | 'completed' | 'defaulted' | 'cancelled';
    defaultDate?: Date;
    completedDate?: Date;
    metadata?: Record<string, any>;
}
/**
 * Refund
 */
export interface Refund {
    id?: string;
    refundNumber: string;
    paymentId: string;
    policyId: string;
    accountId: string;
    refundAmount: number;
    refundReason: string;
    refundType: 'full' | 'partial' | 'overpayment' | 'cancellation' | 'error';
    requestedDate: Date;
    approvedDate?: Date;
    processedDate?: Date;
    refundMethod: PaymentMethodType;
    status: 'pending' | 'approved' | 'processing' | 'completed' | 'declined';
    approvedBy?: string;
    externalTransactionId?: string;
    metadata?: Record<string, any>;
}
/**
 * Premium finance agreement
 */
export interface PremiumFinanceAgreement {
    id?: string;
    agreementNumber: string;
    policyId: string;
    accountId: string;
    financeCompanyId: string;
    financeCompanyName: string;
    principalAmount: number;
    downPayment: number;
    financedAmount: number;
    apr: number;
    numberOfPayments: number;
    paymentAmount: number;
    totalFinanceCharge: number;
    totalOfPayments: number;
    firstPaymentDate: Date;
    finalPaymentDate: Date;
    status: 'pending' | 'active' | 'paid_off' | 'defaulted' | 'cancelled';
    effectiveDate: Date;
    expirationDate?: Date;
    metadata?: Record<string, any>;
}
/**
 * Payment reminder
 */
export interface PaymentReminder {
    id?: string;
    policyId: string;
    accountId: string;
    invoiceId: string;
    reminderType: 'upcoming' | 'due_today' | 'overdue' | 'final_notice';
    scheduledDate: Date;
    sentDate?: Date;
    deliveryMethod: 'email' | 'sms' | 'mail' | 'phone' | 'all';
    status: 'scheduled' | 'sent' | 'delivered' | 'failed' | 'cancelled';
    metadata?: Record<string, any>;
}
/**
 * Payment reconciliation
 */
export interface PaymentReconciliation {
    id?: string;
    reconciliationDate: Date;
    reconciliationType: 'daily' | 'weekly' | 'monthly' | 'custom';
    startDate: Date;
    endDate: Date;
    totalPaymentsReceived: number;
    totalPaymentsCount: number;
    totalRefundsIssued: number;
    totalRefundsCount: number;
    netAmount: number;
    discrepancies: ReconciliationDiscrepancy[];
    reconciledBy?: string;
    status: 'in_progress' | 'completed' | 'requires_review';
    metadata?: Record<string, any>;
}
/**
 * Reconciliation discrepancy
 */
export interface ReconciliationDiscrepancy {
    id?: string;
    reconciliationId: string;
    discrepancyType: 'missing_payment' | 'duplicate_payment' | 'amount_mismatch' | 'unallocated';
    amount: number;
    description: string;
    resolved: boolean;
    resolvedBy?: string;
    resolvedDate?: Date;
    resolution?: string;
}
/**
 * Cash application
 */
export interface CashApplication {
    id?: string;
    applicationDate: Date;
    accountId: string;
    paymentId: string;
    totalAmount: number;
    allocatedAmount: number;
    unappliedAmount: number;
    allocations: PaymentAllocation[];
    appliedBy?: string;
    status: 'pending' | 'applied' | 'reversed';
    metadata?: Record<string, any>;
}
/**
 * Installment schedule
 */
export interface InstallmentSchedule {
    id?: string;
    billingPlanId: string;
    policyId: string;
    installments: Installment[];
    totalScheduled: number;
    totalPaid: number;
    totalRemaining: number;
    status: 'active' | 'completed' | 'defaulted';
    metadata?: Record<string, any>;
}
/**
 * Installment
 */
export interface Installment {
    id?: string;
    scheduleId?: string;
    installmentNumber: number;
    dueDate: Date;
    amount: number;
    fees: number;
    totalAmount: number;
    paidAmount: number;
    balanceRemaining: number;
    status: 'scheduled' | 'paid' | 'partial' | 'overdue' | 'waived';
    paidDate?: Date;
    invoiceId?: string;
    paymentIds?: string[];
    metadata?: Record<string, any>;
}
/**
 * Invoice model attributes
 */
export interface InvoiceAttributes {
    id: string;
    invoiceNumber: string;
    policyId: string;
    billingPlanId?: string;
    accountId: string;
    invoiceDate: Date;
    dueDate: Date;
    subtotal: number;
    fees: number;
    taxes: number;
    totalAmount: number;
    paidAmount: number;
    balanceRemaining: number;
    status: string;
    lineItems: any;
    deliveryMethod?: string;
    deliveredAt?: Date;
    viewedAt?: Date;
    paidAt?: Date;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
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
export declare const createInvoiceModel: (sequelize: Sequelize) => any;
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
export declare const createPaymentModel: (sequelize: Sequelize) => any;
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
export declare const createBillingPlan: (plan: BillingPlan) => Promise<BillingPlan>;
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
export declare const getBillingPlan: (billingPlanId: string) => Promise<BillingPlan | null>;
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
export declare const updateBillingPlan: (billingPlanId: string, updates: Partial<BillingPlan>) => Promise<BillingPlan>;
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
export declare const calculateBillingPlanOptions: (totalPremium: number, downPaymentPercentage: number) => Array<{
    frequency: BillingFrequency;
    installments: number;
    amount: number;
    totalCost: number;
}>;
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
export declare const activateBillingPlan: (billingPlanId: string, effectiveDate: Date) => Promise<BillingPlan>;
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
export declare const generateInvoice: (invoice: Invoice) => Promise<Invoice>;
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
export declare const addInvoiceLineItem: (invoiceId: string, lineItem: InvoiceLineItem) => Promise<InvoiceLineItem>;
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
export declare const calculateInvoiceTotals: (lineItems: InvoiceLineItem[], feePercentage?: number, taxRate?: number) => {
    subtotal: number;
    fees: number;
    taxes: number;
    total: number;
};
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
export declare const markInvoiceSent: (invoiceId: string, deliveredAt: Date, deliveryMethod: string) => Promise<Invoice>;
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
export declare const cancelInvoice: (invoiceId: string, reason: string) => Promise<Invoice>;
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
export declare const processCreditCardPayment: (payment: Payment, cardToken: string) => Promise<Payment>;
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
export declare const processACHPayment: (payment: Payment, bankAccountToken: string) => Promise<Payment>;
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
export declare const recordCheckPayment: (payment: Payment, checkNumber: string) => Promise<Payment>;
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
export declare const confirmPayment: (paymentId: string, confirmationNumber: string) => Promise<Payment>;
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
export declare const handlePaymentFailure: (paymentId: string, failureReason: string) => Promise<Payment>;
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
export declare const enrollInAutopay: (enrollment: AutopayEnrollment) => Promise<AutopayEnrollment>;
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
export declare const updateAutopaySettings: (enrollmentId: string, updates: Partial<AutopayEnrollment>) => Promise<AutopayEnrollment>;
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
export declare const cancelAutopay: (enrollmentId: string, cancellationDate: Date) => Promise<AutopayEnrollment>;
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
export declare const processScheduledAutopay: (enrollmentId: string, invoiceId: string) => Promise<Payment>;
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
export declare const listAutopayEnrollments: (accountId: string, activeOnly?: boolean) => Promise<AutopayEnrollment[]>;
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
export declare const allocatePaymentToInvoice: (paymentId: string, invoiceId: string, amount: number) => Promise<PaymentAllocation>;
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
export declare const allocatePaymentAcrossPolicies: (paymentId: string, allocations: Array<{
    policyId: string;
    amount: number;
}>) => Promise<PaymentAllocation[]>;
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
export declare const getPaymentAllocationSummary: (paymentId: string) => Promise<{
    totalAllocated: number;
    unallocated: number;
    allocations: PaymentAllocation[];
}>;
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
export declare const reversePaymentAllocation: (allocationId: string, reason: string) => Promise<void>;
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
export declare const autoAllocatePayment: (paymentId: string, accountId: string) => Promise<PaymentAllocation[]>;
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
export declare const trackLatePayment: (record: LatePaymentRecord) => Promise<LatePaymentRecord>;
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
export declare const calculateLateFee: (overdueAmount: number, daysOverdue: number, lateFeePercentage: number) => number;
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
export declare const assessLateFee: (invoiceId: string, lateFeeAmount: number) => Promise<Invoice>;
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
export declare const waiveLateFee: (latePaymentRecordId: string, waivedBy: string, reason: string) => Promise<LatePaymentRecord>;
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
export declare const identifyOverdueInvoices: (accountId?: string, minDaysOverdue?: number) => Promise<Invoice[]>;
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
export declare const createPaymentPlan: (plan: PaymentPlan) => Promise<PaymentPlan>;
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
export declare const restructurePaymentPlan: (paymentPlanId: string, restructuring: Partial<PaymentPlan>) => Promise<PaymentPlan>;
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
export declare const markPaymentPlanDefaulted: (paymentPlanId: string, defaultDate: Date) => Promise<PaymentPlan>;
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
export declare const initiateNonPaymentCancellation: (policyId: string, daysOverdue: number) => Promise<{
    cancellationScheduled: boolean;
    cancellationDate: Date;
    noticesSent: number;
}>;
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
export declare const sendNonPaymentNotice: (policyId: string, noticeType: string) => Promise<{
    sent: boolean;
    sentDate: Date;
}>;
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
export declare const reinstatePolicyAfterPayment: (policyId: string, paymentId: string) => Promise<{
    reinstated: boolean;
    reinstateDate: Date;
}>;
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
export declare const processRefund: (refund: Refund) => Promise<Refund>;
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
export declare const approveRefund: (refundId: string, approvedBy: string) => Promise<Refund>;
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
export declare const calculateCancellationRefund: (policyId: string, cancellationDate: Date, proRata?: boolean) => Promise<number>;
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
export declare const createPremiumFinanceAgreement: (agreement: PremiumFinanceAgreement) => Promise<PremiumFinanceAgreement>;
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
export declare const calculateDownPayment: (totalPremium: number, downPaymentPercentage: number) => number;
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
export declare const createInstallmentSchedule: (billingPlanId: string, startDate: Date, numberOfInstallments: number, installmentAmount: number, frequency: BillingFrequency) => Promise<InstallmentSchedule>;
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
export declare const updateInstallmentStatus: (installmentId: string, status: string, paidAmount?: number) => Promise<Installment>;
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
export declare const schedulePaymentReminder: (reminder: PaymentReminder) => Promise<PaymentReminder>;
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
export declare const sendPaymentReminder: (reminderId: string) => Promise<PaymentReminder>;
declare const _default: {
    loadBillingConfig: () => BillingConfig;
    validateBillingConfig: (config: BillingConfig) => string[];
    createInvoiceModel: (sequelize: Sequelize) => any;
    createPaymentModel: (sequelize: Sequelize) => any;
    createBillingPlan: (plan: BillingPlan) => Promise<BillingPlan>;
    getBillingPlan: (billingPlanId: string) => Promise<BillingPlan | null>;
    updateBillingPlan: (billingPlanId: string, updates: Partial<BillingPlan>) => Promise<BillingPlan>;
    calculateBillingPlanOptions: (totalPremium: number, downPaymentPercentage: number) => Array<{
        frequency: BillingFrequency;
        installments: number;
        amount: number;
        totalCost: number;
    }>;
    activateBillingPlan: (billingPlanId: string, effectiveDate: Date) => Promise<BillingPlan>;
    generateInvoice: (invoice: Invoice) => Promise<Invoice>;
    addInvoiceLineItem: (invoiceId: string, lineItem: InvoiceLineItem) => Promise<InvoiceLineItem>;
    calculateInvoiceTotals: (lineItems: InvoiceLineItem[], feePercentage?: number, taxRate?: number) => {
        subtotal: number;
        fees: number;
        taxes: number;
        total: number;
    };
    markInvoiceSent: (invoiceId: string, deliveredAt: Date, deliveryMethod: string) => Promise<Invoice>;
    cancelInvoice: (invoiceId: string, reason: string) => Promise<Invoice>;
    processCreditCardPayment: (payment: Payment, cardToken: string) => Promise<Payment>;
    processACHPayment: (payment: Payment, bankAccountToken: string) => Promise<Payment>;
    recordCheckPayment: (payment: Payment, checkNumber: string) => Promise<Payment>;
    confirmPayment: (paymentId: string, confirmationNumber: string) => Promise<Payment>;
    handlePaymentFailure: (paymentId: string, failureReason: string) => Promise<Payment>;
    enrollInAutopay: (enrollment: AutopayEnrollment) => Promise<AutopayEnrollment>;
    updateAutopaySettings: (enrollmentId: string, updates: Partial<AutopayEnrollment>) => Promise<AutopayEnrollment>;
    cancelAutopay: (enrollmentId: string, cancellationDate: Date) => Promise<AutopayEnrollment>;
    processScheduledAutopay: (enrollmentId: string, invoiceId: string) => Promise<Payment>;
    listAutopayEnrollments: (accountId: string, activeOnly?: boolean) => Promise<AutopayEnrollment[]>;
    allocatePaymentToInvoice: (paymentId: string, invoiceId: string, amount: number) => Promise<PaymentAllocation>;
    allocatePaymentAcrossPolicies: (paymentId: string, allocations: Array<{
        policyId: string;
        amount: number;
    }>) => Promise<PaymentAllocation[]>;
    getPaymentAllocationSummary: (paymentId: string) => Promise<{
        totalAllocated: number;
        unallocated: number;
        allocations: PaymentAllocation[];
    }>;
    reversePaymentAllocation: (allocationId: string, reason: string) => Promise<void>;
    autoAllocatePayment: (paymentId: string, accountId: string) => Promise<PaymentAllocation[]>;
    trackLatePayment: (record: LatePaymentRecord) => Promise<LatePaymentRecord>;
    calculateLateFee: (overdueAmount: number, daysOverdue: number, lateFeePercentage: number) => number;
    assessLateFee: (invoiceId: string, lateFeeAmount: number) => Promise<Invoice>;
    waiveLateFee: (latePaymentRecordId: string, waivedBy: string, reason: string) => Promise<LatePaymentRecord>;
    identifyOverdueInvoices: (accountId?: string, minDaysOverdue?: number) => Promise<Invoice[]>;
    createPaymentPlan: (plan: PaymentPlan) => Promise<PaymentPlan>;
    restructurePaymentPlan: (paymentPlanId: string, restructuring: Partial<PaymentPlan>) => Promise<PaymentPlan>;
    markPaymentPlanDefaulted: (paymentPlanId: string, defaultDate: Date) => Promise<PaymentPlan>;
    initiateNonPaymentCancellation: (policyId: string, daysOverdue: number) => Promise<{
        cancellationScheduled: boolean;
        cancellationDate: Date;
        noticesSent: number;
    }>;
    sendNonPaymentNotice: (policyId: string, noticeType: string) => Promise<{
        sent: boolean;
        sentDate: Date;
    }>;
    reinstatePolicyAfterPayment: (policyId: string, paymentId: string) => Promise<{
        reinstated: boolean;
        reinstateDate: Date;
    }>;
    processRefund: (refund: Refund) => Promise<Refund>;
    approveRefund: (refundId: string, approvedBy: string) => Promise<Refund>;
    calculateCancellationRefund: (policyId: string, cancellationDate: Date, proRata?: boolean) => Promise<number>;
    createPremiumFinanceAgreement: (agreement: PremiumFinanceAgreement) => Promise<PremiumFinanceAgreement>;
    calculateDownPayment: (totalPremium: number, downPaymentPercentage: number) => number;
    createInstallmentSchedule: (billingPlanId: string, startDate: Date, numberOfInstallments: number, installmentAmount: number, frequency: BillingFrequency) => Promise<InstallmentSchedule>;
    updateInstallmentStatus: (installmentId: string, status: string, paidAmount?: number) => Promise<Installment>;
    schedulePaymentReminder: (reminder: PaymentReminder) => Promise<PaymentReminder>;
    sendPaymentReminder: (reminderId: string) => Promise<PaymentReminder>;
};
export default _default;
//# sourceMappingURL=billing-payment-kit.d.ts.map