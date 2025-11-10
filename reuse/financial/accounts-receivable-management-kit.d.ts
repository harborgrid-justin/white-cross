/**
 * LOC: FINAR8765432
 * File: /reuse/financial/accounts-receivable-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable financial utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Backend AR services
 *   - Customer billing modules
 *   - Collections management
 *   - Cash application services
 */
/**
 * File: /reuse/financial/accounts-receivable-management-kit.ts
 * Locator: WC-FIN-AR-001
 * Purpose: Enterprise-grade Accounts Receivable Management - customer invoices, collections, aging analysis, credit management, dunning, cash application
 *
 * Upstream: Independent utility module for AR financial operations
 * Downstream: ../backend/financial/*, AR controllers, billing services, collection workflows, payment processors
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 45+ functions for AR operations competing with USACE CEFMS enterprise financial management
 *
 * LLM Context: Comprehensive accounts receivable utilities for production-ready financial applications.
 * Provides customer invoice generation, payment collection, aging analysis, credit limit management, dunning process automation,
 * cash application matching, payment plans, collection workflows, customer statements, DSO tracking, bad debt reserves,
 * revenue recognition, payment reminders, collection agency integration, and dispute resolution.
 */
import { Sequelize, Transaction } from 'sequelize';
interface CustomerInvoiceData {
    customerId: string;
    invoiceNumber: string;
    invoiceDate: Date;
    dueDate: Date;
    amount: number;
    taxAmount?: number;
    discountAmount?: number;
    terms?: string;
    description?: string;
    glAccountCode?: string;
    poNumber?: string;
    status?: 'draft' | 'sent' | 'viewed' | 'overdue' | 'paid' | 'void';
    metadata?: Record<string, any>;
}
interface ARPaymentData {
    customerId: string;
    invoiceId: string;
    amount: number;
    paymentDate: Date;
    paymentMethod: 'cash' | 'check' | 'credit_card' | 'ach' | 'wire' | 'other';
    referenceNumber?: string;
    notes?: string;
}
interface CreditLimit {
    customerId: string;
    creditLimit: number;
    currentBalance: number;
    availableCredit: number;
    creditScore?: number;
    riskRating: 'low' | 'medium' | 'high' | 'critical';
    lastReviewDate: Date;
}
interface AgingBucket {
    bucket: string;
    daysStart: number;
    daysEnd: number | null;
    count: number;
    amount: number;
    percentage: number;
}
interface CollectionActivity {
    customerId: string;
    invoiceId?: string;
    activityType: 'call' | 'email' | 'letter' | 'meeting' | 'dispute' | 'promise_to_pay';
    activityDate: Date;
    performedBy: string;
    notes: string;
    followUpDate?: Date;
    outcome?: string;
}
interface DunningLevel {
    level: number;
    name: string;
    daysOverdue: number;
    action: 'reminder' | 'notice' | 'final_notice' | 'collections' | 'legal';
    template: string;
    escalate: boolean;
}
interface PaymentPlan {
    customerId: string;
    totalAmount: number;
    downPayment: number;
    installments: number;
    installmentAmount: number;
    frequency: 'weekly' | 'biweekly' | 'monthly';
    startDate: Date;
    endDate: Date;
    status: 'active' | 'completed' | 'defaulted' | 'cancelled';
}
interface CashApplicationMatch {
    paymentId: string;
    invoiceId: string;
    matchScore: number;
    matchType: 'exact' | 'partial' | 'suggested' | 'manual';
    amount: number;
    confidence: number;
}
interface CustomerStatement {
    customerId: string;
    statementDate: Date;
    openingBalance: number;
    invoices: CustomerInvoiceData[];
    payments: ARPaymentData[];
    closingBalance: number;
    agingBuckets: AgingBucket[];
    dueNow: number;
}
interface DSOMetrics {
    period: string;
    dso: number;
    averageDailyCredit: number;
    accountsReceivable: number;
    collectionEffectiveness: number;
    bestPossibleDSO: number;
}
interface BadDebtReserve {
    totalAR: number;
    reservePercent: number;
    reserveAmount: number;
    writeOffAmount: number;
    netAR: number;
    coverageRatio: number;
}
interface PaymentReminder {
    customerId: string;
    invoiceIds: string[];
    reminderType: 'pre_due' | 'due_today' | 'overdue' | 'final';
    daysUntilDue: number;
    totalAmount: number;
    sendDate: Date;
    status: 'scheduled' | 'sent' | 'failed';
}
interface RevenueRecognition {
    invoiceId: string;
    totalAmount: number;
    recognizedAmount: number;
    deferredAmount: number;
    recognitionSchedule: Array<{
        date: Date;
        amount: number;
        recognized: boolean;
    }>;
}
/**
 * Sequelize model for Customer Invoices with aging and payment tracking.
 *
 * @swagger
 * @openapi
 * components:
 *   schemas:
 *     CustomerInvoice:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         customerId:
 *           type: string
 *         invoiceNumber:
 *           type: string
 *         amount:
 *           type: number
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CustomerInvoice model
 *
 * @example
 * ```typescript
 * const CustomerInvoice = createCustomerInvoiceModel(sequelize);
 * const invoice = await CustomerInvoice.create({
 *   customerId: 'CUST001',
 *   invoiceNumber: 'INV-2024-001',
 *   invoiceDate: new Date(),
 *   dueDate: new Date(Date.now() + 30 * 86400000),
 *   amount: 10000.00,
 *   status: 'sent'
 * });
 * ```
 */
export declare const createCustomerInvoiceModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        customerId: string;
        invoiceNumber: string;
        invoiceDate: Date;
        dueDate: Date;
        amount: number;
        taxAmount: number;
        discountAmount: number;
        netAmount: number;
        paidAmount: number;
        balanceAmount: number;
        terms: string;
        description: string;
        glAccountCode: string;
        poNumber: string | null;
        status: string;
        sentDate: Date | null;
        viewedDate: Date | null;
        paidDate: Date | null;
        voidedDate: Date | null;
        voidReason: string | null;
        dunningLevel: number;
        lastDunningDate: Date | null;
        disputeStatus: string | null;
        disputeReason: string | null;
        fiscalYear: number;
        fiscalPeriod: number;
        revenueRecognized: number;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for AR Payments with cash application tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ARPayment model
 *
 * @example
 * ```typescript
 * const ARPayment = createARPaymentModel(sequelize);
 * const payment = await ARPayment.create({
 *   customerId: 'CUST001',
 *   amount: 10000.00,
 *   paymentDate: new Date(),
 *   paymentMethod: 'ach',
 *   status: 'unapplied'
 * });
 * ```
 */
export declare const createARPaymentModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        customerId: string;
        amount: number;
        paymentDate: Date;
        paymentMethod: string;
        referenceNumber: string | null;
        checkNumber: string | null;
        creditCardLast4: string | null;
        achTraceNumber: string | null;
        status: string;
        appliedAmount: number;
        unappliedAmount: number;
        applicationDate: Date | null;
        notes: string;
        depositedDate: Date | null;
        clearedDate: Date | null;
        reconciledDate: Date | null;
        reversedAt: Date | null;
        reversalReason: string | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Collection Activities tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CollectionActivityModel model
 */
export declare const createCollectionActivityModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        customerId: string;
        invoiceId: string | null;
        activityType: string;
        activityDate: Date;
        performedBy: string;
        notes: string;
        followUpDate: Date | null;
        outcome: string | null;
        promiseAmount: number | null;
        promiseDate: Date | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Creates a new customer invoice with validation.
 *
 * @param {CustomerInvoiceData} invoiceData - Invoice data
 * @param {Model} CustomerInvoice - CustomerInvoice model
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created invoice
 *
 * @example
 * ```typescript
 * const invoice = await createCustomerInvoice({
 *   customerId: 'CUST001',
 *   invoiceNumber: 'INV-2024-001',
 *   invoiceDate: new Date(),
 *   dueDate: new Date(Date.now() + 30 * 86400000),
 *   amount: 10000.00
 * }, CustomerInvoice);
 * ```
 */
export declare const createCustomerInvoice: (invoiceData: CustomerInvoiceData, CustomerInvoice: any, transaction?: Transaction) => Promise<any>;
/**
 * Sends invoice to customer via email or portal.
 *
 * @param {string} invoiceId - Invoice ID
 * @param {string} deliveryMethod - Delivery method
 * @param {Model} CustomerInvoice - CustomerInvoice model
 * @param {any} emailService - Email service
 * @returns {Promise<{ sent: boolean; sentDate: Date }>} Send result
 *
 * @example
 * ```typescript
 * await sendInvoiceToCustomer('inv123', 'email', CustomerInvoice, emailService);
 * ```
 */
export declare const sendInvoiceToCustomer: (invoiceId: string, deliveryMethod: "email" | "portal" | "print", CustomerInvoice: any, emailService: any) => Promise<{
    sent: boolean;
    sentDate: Date;
}>;
/**
 * Marks invoice as viewed by customer.
 *
 * @param {string} invoiceId - Invoice ID
 * @param {Model} CustomerInvoice - CustomerInvoice model
 * @returns {Promise<any>} Updated invoice
 *
 * @example
 * ```typescript
 * await markInvoiceAsViewed('inv123', CustomerInvoice);
 * ```
 */
export declare const markInvoiceAsViewed: (invoiceId: string, CustomerInvoice: any) => Promise<any>;
/**
 * Voids an invoice with reason tracking.
 *
 * @param {string} invoiceId - Invoice ID
 * @param {string} reason - Void reason
 * @param {Model} CustomerInvoice - CustomerInvoice model
 * @returns {Promise<any>} Voided invoice
 *
 * @example
 * ```typescript
 * await voidInvoice('inv123', 'Duplicate invoice', CustomerInvoice);
 * ```
 */
export declare const voidInvoice: (invoiceId: string, reason: string, CustomerInvoice: any) => Promise<any>;
/**
 * Generates batch invoices for recurring billing.
 *
 * @param {CustomerInvoiceData[]} invoicesData - Array of invoice data
 * @param {Model} CustomerInvoice - CustomerInvoice model
 * @returns {Promise<any[]>} Created invoices
 *
 * @example
 * ```typescript
 * const invoices = await generateBatchInvoices(invoicesData, CustomerInvoice);
 * ```
 */
export declare const generateBatchInvoices: (invoicesData: CustomerInvoiceData[], CustomerInvoice: any) => Promise<any[]>;
/**
 * Retrieves invoices by customer.
 *
 * @param {string} customerId - Customer ID
 * @param {Model} CustomerInvoice - CustomerInvoice model
 * @param {object} [filters] - Optional filters
 * @returns {Promise<any[]>} Customer invoices
 *
 * @example
 * ```typescript
 * const invoices = await getCustomerInvoices('CUST001', CustomerInvoice, { status: 'overdue' });
 * ```
 */
export declare const getCustomerInvoices: (customerId: string, CustomerInvoice: any, filters?: {
    status?: string;
    dateFrom?: Date;
    dateTo?: Date;
}) => Promise<any[]>;
/**
 * Calculates days past due for an invoice.
 *
 * @param {any} invoice - Invoice object
 * @param {Date} [asOfDate=new Date()] - Calculation date
 * @returns {number} Days past due (negative if not due)
 *
 * @example
 * ```typescript
 * const days = calculateDaysPastDue(invoice);
 * if (days > 0) console.log(`Invoice is ${days} days overdue`);
 * ```
 */
export declare const calculateDaysPastDue: (invoice: any, asOfDate?: Date) => number;
/**
 * Updates invoice status based on due date and payments.
 *
 * @param {string} invoiceId - Invoice ID
 * @param {Model} CustomerInvoice - CustomerInvoice model
 * @returns {Promise<any>} Updated invoice
 *
 * @example
 * ```typescript
 * await updateInvoiceStatus('inv123', CustomerInvoice);
 * ```
 */
export declare const updateInvoiceStatus: (invoiceId: string, CustomerInvoice: any) => Promise<any>;
/**
 * Records customer payment.
 *
 * @param {ARPaymentData} paymentData - Payment data
 * @param {Model} ARPayment - ARPayment model
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created payment
 *
 * @example
 * ```typescript
 * const payment = await recordCustomerPayment({
 *   customerId: 'CUST001',
 *   invoiceId: 'inv123',
 *   amount: 10000.00,
 *   paymentDate: new Date(),
 *   paymentMethod: 'ach'
 * }, ARPayment);
 * ```
 */
export declare const recordCustomerPayment: (paymentData: ARPaymentData, ARPayment: any, transaction?: Transaction) => Promise<any>;
/**
 * Applies payment to invoice (cash application).
 *
 * @param {string} paymentId - Payment ID
 * @param {string} invoiceId - Invoice ID
 * @param {number} amount - Amount to apply
 * @param {Model} ARPayment - ARPayment model
 * @param {Model} CustomerInvoice - CustomerInvoice model
 * @returns {Promise<{ payment: any; invoice: any }>} Applied payment and invoice
 *
 * @example
 * ```typescript
 * await applyPaymentToInvoice('pay123', 'inv456', 5000, ARPayment, CustomerInvoice);
 * ```
 */
export declare const applyPaymentToInvoice: (paymentId: string, invoiceId: string, amount: number, ARPayment: any, CustomerInvoice: any) => Promise<{
    payment: any;
    invoice: any;
}>;
/**
 * Auto-applies payment to oldest invoices first.
 *
 * @param {string} paymentId - Payment ID
 * @param {Model} ARPayment - ARPayment model
 * @param {Model} CustomerInvoice - CustomerInvoice model
 * @returns {Promise<CashApplicationMatch[]>} Application matches
 *
 * @example
 * ```typescript
 * const matches = await autoApplyPayment('pay123', ARPayment, CustomerInvoice);
 * ```
 */
export declare const autoApplyPayment: (paymentId: string, ARPayment: any, CustomerInvoice: any) => Promise<CashApplicationMatch[]>;
/**
 * Suggests invoice matches for payment based on amount and customer.
 *
 * @param {string} paymentId - Payment ID
 * @param {Model} ARPayment - ARPayment model
 * @param {Model} CustomerInvoice - CustomerInvoice model
 * @returns {Promise<CashApplicationMatch[]>} Suggested matches
 *
 * @example
 * ```typescript
 * const suggestions = await suggestPaymentMatches('pay123', ARPayment, CustomerInvoice);
 * ```
 */
export declare const suggestPaymentMatches: (paymentId: string, ARPayment: any, CustomerInvoice: any) => Promise<CashApplicationMatch[]>;
/**
 * Reverses a payment application.
 *
 * @param {string} paymentId - Payment ID
 * @param {string} invoiceId - Invoice ID
 * @param {string} reason - Reversal reason
 * @param {Model} ARPayment - ARPayment model
 * @param {Model} CustomerInvoice - CustomerInvoice model
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await reversePaymentApplication('pay123', 'inv456', 'Applied to wrong invoice', ARPayment, CustomerInvoice);
 * ```
 */
export declare const reversePaymentApplication: (paymentId: string, invoiceId: string, reason: string, ARPayment: any, CustomerInvoice: any) => Promise<void>;
/**
 * Processes refund to customer.
 *
 * @param {string} customerId - Customer ID
 * @param {number} amount - Refund amount
 * @param {string} reason - Refund reason
 * @param {Model} ARPayment - ARPayment model
 * @returns {Promise<any>} Refund payment record
 *
 * @example
 * ```typescript
 * await processCustomerRefund('CUST001', 500, 'Overpayment', ARPayment);
 * ```
 */
export declare const processCustomerRefund: (customerId: string, amount: number, reason: string, ARPayment: any) => Promise<any>;
/**
 * Retrieves unapplied cash for customer.
 *
 * @param {string} customerId - Customer ID
 * @param {Model} ARPayment - ARPayment model
 * @returns {Promise<{ payments: any[]; totalUnapplied: number }>} Unapplied cash
 *
 * @example
 * ```typescript
 * const { payments, totalUnapplied } = await getUnappliedCash('CUST001', ARPayment);
 * ```
 */
export declare const getUnappliedCash: (customerId: string, ARPayment: any) => Promise<{
    payments: any[];
    totalUnapplied: number;
}>;
/**
 * Reconciles bank deposits with recorded payments.
 *
 * @param {Date} depositDate - Deposit date
 * @param {number} depositAmount - Total deposit amount
 * @param {string[]} paymentIds - Payment IDs in deposit
 * @param {Model} ARPayment - ARPayment model
 * @returns {Promise<{ matched: boolean; variance: number }>} Reconciliation result
 *
 * @example
 * ```typescript
 * const result = await reconcileBankDeposit(new Date(), 50000, ['pay1', 'pay2'], ARPayment);
 * ```
 */
export declare const reconcileBankDeposit: (depositDate: Date, depositAmount: number, paymentIds: string[], ARPayment: any) => Promise<{
    matched: boolean;
    variance: number;
}>;
/**
 * Generates AR aging report by customer.
 *
 * @param {Date} [asOfDate=new Date()] - Report date
 * @param {Model} CustomerInvoice - CustomerInvoice model
 * @returns {Promise<Map<string, AgingBucket[]>>} Aging by customer
 *
 * @example
 * ```typescript
 * const agingReport = await generateARAgingReport(new Date(), CustomerInvoice);
 * ```
 */
export declare const generateARAgingReport: (asOfDate: Date | undefined, CustomerInvoice: any) => Promise<Map<string, AgingBucket[]>>;
/**
 * Calculates total accounts receivable balance.
 *
 * @param {Model} CustomerInvoice - CustomerInvoice model
 * @returns {Promise<number>} Total AR balance
 *
 * @example
 * ```typescript
 * const totalAR = await calculateTotalAR(CustomerInvoice);
 * ```
 */
export declare const calculateTotalAR: (CustomerInvoice: any) => Promise<number>;
/**
 * Identifies high-risk customers based on aging.
 *
 * @param {Map<string, AgingBucket[]>} agingData - Aging data
 * @param {number} [threshold=10000] - Amount threshold
 * @returns {string[]} High-risk customer IDs
 *
 * @example
 * ```typescript
 * const highRisk = identifyHighRiskCustomers(agingData, 10000);
 * ```
 */
export declare const identifyHighRiskCustomers: (agingData: Map<string, AgingBucket[]>, threshold?: number) => string[];
/**
 * Exports AR aging report to CSV.
 *
 * @param {Map<string, AgingBucket[]>} agingData - Aging data
 * @returns {string} CSV formatted report
 *
 * @example
 * ```typescript
 * const csv = exportARAgingCSV(agingData);
 * ```
 */
export declare const exportARAgingCSV: (agingData: Map<string, AgingBucket[]>) => string;
/**
 * Evaluates customer credit limit and availability.
 *
 * @param {string} customerId - Customer ID
 * @param {number} creditLimit - Credit limit
 * @param {Model} CustomerInvoice - CustomerInvoice model
 * @returns {Promise<CreditLimit>} Credit evaluation
 *
 * @example
 * ```typescript
 * const credit = await evaluateCustomerCredit('CUST001', 50000, CustomerInvoice);
 * if (credit.availableCredit < 1000) console.log('Credit limit reached');
 * ```
 */
export declare const evaluateCustomerCredit: (customerId: string, creditLimit: number, CustomerInvoice: any) => Promise<CreditLimit>;
/**
 * Checks if customer can place new order within credit limit.
 *
 * @param {string} customerId - Customer ID
 * @param {number} orderAmount - New order amount
 * @param {CreditLimit} creditInfo - Credit information
 * @returns {{ approved: boolean; reason?: string }} Approval decision
 *
 * @example
 * ```typescript
 * const approval = checkCreditApproval('CUST001', 5000, creditInfo);
 * if (!approval.approved) console.log(approval.reason);
 * ```
 */
export declare const checkCreditApproval: (customerId: string, orderAmount: number, creditInfo: CreditLimit) => {
    approved: boolean;
    reason?: string;
};
/**
 * Places customer on credit hold.
 *
 * @param {string} customerId - Customer ID
 * @param {string} reason - Hold reason
 * @returns {Promise<{ held: boolean; reason: string }>} Hold result
 *
 * @example
 * ```typescript
 * await placeCreditHold('CUST001', 'Payment overdue 90+ days');
 * ```
 */
export declare const placeCreditHold: (customerId: string, reason: string) => Promise<{
    held: boolean;
    reason: string;
}>;
/**
 * Releases customer from credit hold.
 *
 * @param {string} customerId - Customer ID
 * @param {string} reason - Release reason
 * @returns {Promise<{ released: boolean }>} Release result
 *
 * @example
 * ```typescript
 * await releaseCreditHold('CUST001', 'Payment received');
 * ```
 */
export declare const releaseCreditHold: (customerId: string, reason: string) => Promise<{
    released: boolean;
}>;
/**
 * Determines appropriate dunning level for invoice.
 *
 * @param {any} invoice - Invoice object
 * @param {DunningLevel[]} levels - Dunning level configuration
 * @returns {DunningLevel | null} Applicable dunning level
 *
 * @example
 * ```typescript
 * const level = determineDunningLevel(invoice, dunningLevels);
 * if (level) console.log(`Apply ${level.name} action`);
 * ```
 */
export declare const determineDunningLevel: (invoice: any, levels: DunningLevel[]) => DunningLevel | null;
/**
 * Executes dunning actions for overdue invoices.
 *
 * @param {string} customerId - Customer ID
 * @param {Model} CustomerInvoice - CustomerInvoice model
 * @param {DunningLevel[]} levels - Dunning levels
 * @returns {Promise<{ actionsPerformed: number; invoices: any[] }>} Dunning result
 *
 * @example
 * ```typescript
 * const result = await executeDunningProcess('CUST001', CustomerInvoice, dunningLevels);
 * ```
 */
export declare const executeDunningProcess: (customerId: string, CustomerInvoice: any, levels: DunningLevel[]) => Promise<{
    actionsPerformed: number;
    invoices: any[];
}>;
/**
 * Generates payment reminder for customer.
 *
 * @param {string} customerId - Customer ID
 * @param {Model} CustomerInvoice - CustomerInvoice model
 * @returns {Promise<PaymentReminder>} Payment reminder
 *
 * @example
 * ```typescript
 * const reminder = await generatePaymentReminder('CUST001', CustomerInvoice);
 * ```
 */
export declare const generatePaymentReminder: (customerId: string, CustomerInvoice: any) => Promise<PaymentReminder>;
/**
 * Schedules automated dunning communications.
 *
 * @param {Model} CustomerInvoice - CustomerInvoice model
 * @param {DunningLevel[]} levels - Dunning levels
 * @returns {Promise<PaymentReminder[]>} Scheduled reminders
 *
 * @example
 * ```typescript
 * const reminders = await scheduleDunningCommunications(CustomerInvoice, levels);
 * ```
 */
export declare const scheduleDunningCommunications: (CustomerInvoice: any, levels: DunningLevel[]) => Promise<PaymentReminder[]>;
/**
 * Logs collection activity for customer.
 *
 * @param {CollectionActivity} activity - Activity data
 * @param {Model} CollectionActivityModel - CollectionActivity model
 * @returns {Promise<any>} Logged activity
 *
 * @example
 * ```typescript
 * await logCollectionActivity({
 *   customerId: 'CUST001',
 *   activityType: 'call',
 *   activityDate: new Date(),
 *   performedBy: 'collector123',
 *   notes: 'Left voicemail'
 * }, CollectionActivityModel);
 * ```
 */
export declare const logCollectionActivity: (activity: CollectionActivity, CollectionActivityModel: any) => Promise<any>;
/**
 * Retrieves collection history for customer.
 *
 * @param {string} customerId - Customer ID
 * @param {Model} CollectionActivityModel - CollectionActivity model
 * @param {number} [limit=50] - Max results
 * @returns {Promise<any[]>} Collection activities
 *
 * @example
 * ```typescript
 * const history = await getCollectionHistory('CUST001', CollectionActivityModel);
 * ```
 */
export declare const getCollectionHistory: (customerId: string, CollectionActivityModel: any, limit?: number) => Promise<any[]>;
/**
 * Creates follow-up tasks for collectors.
 *
 * @param {string} customerId - Customer ID
 * @param {Date} followUpDate - Follow-up date
 * @param {string} assignedTo - Collector assigned
 * @param {string} notes - Task notes
 * @returns {Promise<any>} Follow-up task
 *
 * @example
 * ```typescript
 * await createCollectionFollowUp('CUST001', futureDate, 'collector123', 'Follow up on promise to pay');
 * ```
 */
export declare const createCollectionFollowUp: (customerId: string, followUpDate: Date, assignedTo: string, notes: string) => Promise<any>;
/**
 * Identifies accounts requiring collection escalation.
 *
 * @param {number} [daysThreshold=90] - Days overdue threshold
 * @param {number} [amountThreshold=5000] - Amount threshold
 * @param {Model} CustomerInvoice - CustomerInvoice model
 * @returns {Promise<any[]>} Accounts for escalation
 *
 * @example
 * ```typescript
 * const escalations = await identifyEscalationAccounts(90, 5000, CustomerInvoice);
 * ```
 */
export declare const identifyEscalationAccounts: (daysThreshold: number | undefined, amountThreshold: number | undefined, CustomerInvoice: any) => Promise<any[]>;
/**
 * Creates payment plan for customer.
 *
 * @param {PaymentPlan} planData - Payment plan data
 * @returns {Promise<PaymentPlan>} Created payment plan
 *
 * @example
 * ```typescript
 * const plan = await createPaymentPlan({
 *   customerId: 'CUST001',
 *   totalAmount: 10000,
 *   downPayment: 2000,
 *   installments: 4,
 *   installmentAmount: 2000,
 *   frequency: 'monthly',
 *   startDate: new Date(),
 *   endDate: futureDate,
 *   status: 'active'
 * });
 * ```
 */
export declare const createPaymentPlan: (planData: PaymentPlan) => Promise<PaymentPlan>;
/**
 * Generates payment plan schedule.
 *
 * @param {PaymentPlan} plan - Payment plan
 * @returns {Array<{ dueDate: Date; amount: number; installmentNumber: number }>} Payment schedule
 *
 * @example
 * ```typescript
 * const schedule = generatePaymentSchedule(plan);
 * schedule.forEach(s => console.log(`Payment ${s.installmentNumber}: ${s.amount} on ${s.dueDate}`));
 * ```
 */
export declare const generatePaymentSchedule: (plan: PaymentPlan) => Array<{
    dueDate: Date;
    amount: number;
    installmentNumber: number;
}>;
/**
 * Tracks payment plan compliance.
 *
 * @param {string} customerId - Customer ID
 * @param {PaymentPlan} plan - Payment plan
 * @param {Model} ARPayment - ARPayment model
 * @returns {Promise<{ compliant: boolean; missedPayments: number; nextDueDate: Date }>} Compliance status
 *
 * @example
 * ```typescript
 * const compliance = await trackPaymentPlanCompliance('CUST001', plan, ARPayment);
 * ```
 */
export declare const trackPaymentPlanCompliance: (customerId: string, plan: PaymentPlan, ARPayment: any) => Promise<{
    compliant: boolean;
    missedPayments: number;
    nextDueDate: Date;
}>;
/**
 * Generates customer statement for period.
 *
 * @param {string} customerId - Customer ID
 * @param {Date} startDate - Period start
 * @param {Date} endDate - Period end
 * @param {Model} CustomerInvoice - CustomerInvoice model
 * @param {Model} ARPayment - ARPayment model
 * @returns {Promise<CustomerStatement>} Customer statement
 *
 * @example
 * ```typescript
 * const statement = await generateCustomerStatement('CUST001', startDate, endDate, CustomerInvoice, ARPayment);
 * ```
 */
export declare const generateCustomerStatement: (customerId: string, startDate: Date, endDate: Date, CustomerInvoice: any, ARPayment: any) => Promise<CustomerStatement>;
/**
 * Exports customer statement to PDF.
 *
 * @param {CustomerStatement} statement - Customer statement
 * @returns {Promise<Buffer>} PDF buffer
 *
 * @example
 * ```typescript
 * const pdf = await exportCustomerStatementPDF(statement);
 * ```
 */
export declare const exportCustomerStatementPDF: (statement: CustomerStatement) => Promise<Buffer>;
/**
 * Emails customer statement.
 *
 * @param {CustomerStatement} statement - Customer statement
 * @param {string} customerEmail - Customer email
 * @param {any} emailService - Email service
 * @returns {Promise<{ sent: boolean }>} Send result
 *
 * @example
 * ```typescript
 * await emailCustomerStatement(statement, 'customer@example.com', emailService);
 * ```
 */
export declare const emailCustomerStatement: (statement: CustomerStatement, customerEmail: string, emailService: any) => Promise<{
    sent: boolean;
}>;
/**
 * Calculates Days Sales Outstanding (DSO).
 *
 * @param {Date} startDate - Period start
 * @param {Date} endDate - Period end
 * @param {Model} CustomerInvoice - CustomerInvoice model
 * @returns {Promise<DSOMetrics>} DSO metrics
 *
 * @example
 * ```typescript
 * const dso = await calculateDSO(startDate, endDate, CustomerInvoice);
 * console.log(`DSO: ${dso.dso} days`);
 * ```
 */
export declare const calculateDSO: (startDate: Date, endDate: Date, CustomerInvoice: any) => Promise<DSOMetrics>;
/**
 * Calculates collection effectiveness index (CEI).
 *
 * @param {Date} startDate - Period start
 * @param {Date} endDate - Period end
 * @param {Model} CustomerInvoice - CustomerInvoice model
 * @param {Model} ARPayment - ARPayment model
 * @returns {Promise<number>} CEI percentage
 *
 * @example
 * ```typescript
 * const cei = await calculateCEI(startDate, endDate, CustomerInvoice, ARPayment);
 * ```
 */
export declare const calculateCEI: (startDate: Date, endDate: Date, CustomerInvoice: any, ARPayment: any) => Promise<number>;
/**
 * Tracks bad debt reserve.
 *
 * @param {number} totalAR - Total accounts receivable
 * @param {number} [reservePercent=5] - Reserve percentage
 * @param {number} [writeOffAmount=0] - Write-off amount
 * @returns {BadDebtReserve} Bad debt reserve calculation
 *
 * @example
 * ```typescript
 * const reserve = trackBadDebtReserve(100000, 5, 2000);
 * ```
 */
export declare const trackBadDebtReserve: (totalAR: number, reservePercent?: number, writeOffAmount?: number) => BadDebtReserve;
/**
 * Generates AR performance dashboard data.
 *
 * @param {Model} CustomerInvoice - CustomerInvoice model
 * @param {Model} ARPayment - ARPayment model
 * @returns {Promise<any>} Dashboard data
 *
 * @example
 * ```typescript
 * const dashboard = await generateARDashboard(CustomerInvoice, ARPayment);
 * ```
 */
export declare const generateARDashboard: (CustomerInvoice: any, ARPayment: any) => Promise<any>;
/**
 * Creates revenue recognition schedule for invoice.
 *
 * @param {string} invoiceId - Invoice ID
 * @param {number} totalAmount - Total amount
 * @param {Date} startDate - Recognition start date
 * @param {number} periods - Number of periods
 * @returns {RevenueRecognition} Revenue recognition schedule
 *
 * @example
 * ```typescript
 * const schedule = createRevenueRecognitionSchedule('inv123', 12000, new Date(), 12);
 * ```
 */
export declare const createRevenueRecognitionSchedule: (invoiceId: string, totalAmount: number, startDate: Date, periods: number) => RevenueRecognition;
/**
 * Processes periodic revenue recognition.
 *
 * @param {RevenueRecognition} schedule - Revenue schedule
 * @param {Date} asOfDate - Recognition date
 * @returns {RevenueRecognition} Updated schedule
 *
 * @example
 * ```typescript
 * const updated = processRevenueRecognition(schedule, new Date());
 * ```
 */
export declare const processRevenueRecognition: (schedule: RevenueRecognition, asOfDate: Date) => RevenueRecognition;
/**
 * Generates deferred revenue report.
 *
 * @param {Model} CustomerInvoice - CustomerInvoice model
 * @returns {Promise<{ totalDeferred: number; byPeriod: any[] }>} Deferred revenue report
 *
 * @example
 * ```typescript
 * const report = await generateDeferredRevenueReport(CustomerInvoice);
 * ```
 */
export declare const generateDeferredRevenueReport: (CustomerInvoice: any) => Promise<{
    totalDeferred: number;
    byPeriod: any[];
}>;
/**
 * NestJS Injectable service for Accounts Receivable management.
 *
 * @example
 * ```typescript
 * @Controller('ar')
 * export class ARController {
 *   constructor(private readonly arService: AccountsReceivableService) {}
 *
 *   @Post('invoices')
 *   async createInvoice(@Body() data: CustomerInvoiceData) {
 *     return this.arService.createInvoice(data);
 *   }
 * }
 * ```
 */
export declare class AccountsReceivableService {
    private readonly sequelize;
    constructor(sequelize: Sequelize);
    createInvoice(data: CustomerInvoiceData): Promise<any>;
    recordPayment(data: ARPaymentData): Promise<any>;
    generateAgingReport(asOfDate?: Date): Promise<Map<string, AgingBucket[]>>;
    calculateDSOMetrics(startDate: Date, endDate: Date): Promise<DSOMetrics>;
    executeDunning(customerId: string, levels: DunningLevel[]): Promise<{
        actionsPerformed: number;
        invoices: any[];
    }>;
}
/**
 * Default export with all AR utilities.
 */
declare const _default: {
    createCustomerInvoiceModel: (sequelize: Sequelize) => {
        new (): {
            id: string;
            customerId: string;
            invoiceNumber: string;
            invoiceDate: Date;
            dueDate: Date;
            amount: number;
            taxAmount: number;
            discountAmount: number;
            netAmount: number;
            paidAmount: number;
            balanceAmount: number;
            terms: string;
            description: string;
            glAccountCode: string;
            poNumber: string | null;
            status: string;
            sentDate: Date | null;
            viewedDate: Date | null;
            paidDate: Date | null;
            voidedDate: Date | null;
            voidReason: string | null;
            dunningLevel: number;
            lastDunningDate: Date | null;
            disputeStatus: string | null;
            disputeReason: string | null;
            fiscalYear: number;
            fiscalPeriod: number;
            revenueRecognized: number;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createARPaymentModel: (sequelize: Sequelize) => {
        new (): {
            id: string;
            customerId: string;
            amount: number;
            paymentDate: Date;
            paymentMethod: string;
            referenceNumber: string | null;
            checkNumber: string | null;
            creditCardLast4: string | null;
            achTraceNumber: string | null;
            status: string;
            appliedAmount: number;
            unappliedAmount: number;
            applicationDate: Date | null;
            notes: string;
            depositedDate: Date | null;
            clearedDate: Date | null;
            reconciledDate: Date | null;
            reversedAt: Date | null;
            reversalReason: string | null;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createCollectionActivityModel: (sequelize: Sequelize) => {
        new (): {
            id: string;
            customerId: string;
            invoiceId: string | null;
            activityType: string;
            activityDate: Date;
            performedBy: string;
            notes: string;
            followUpDate: Date | null;
            outcome: string | null;
            promiseAmount: number | null;
            promiseDate: Date | null;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createCustomerInvoice: (invoiceData: CustomerInvoiceData, CustomerInvoice: any, transaction?: Transaction) => Promise<any>;
    sendInvoiceToCustomer: (invoiceId: string, deliveryMethod: "email" | "portal" | "print", CustomerInvoice: any, emailService: any) => Promise<{
        sent: boolean;
        sentDate: Date;
    }>;
    markInvoiceAsViewed: (invoiceId: string, CustomerInvoice: any) => Promise<any>;
    voidInvoice: (invoiceId: string, reason: string, CustomerInvoice: any) => Promise<any>;
    generateBatchInvoices: (invoicesData: CustomerInvoiceData[], CustomerInvoice: any) => Promise<any[]>;
    getCustomerInvoices: (customerId: string, CustomerInvoice: any, filters?: {
        status?: string;
        dateFrom?: Date;
        dateTo?: Date;
    }) => Promise<any[]>;
    calculateDaysPastDue: (invoice: any, asOfDate?: Date) => number;
    updateInvoiceStatus: (invoiceId: string, CustomerInvoice: any) => Promise<any>;
    recordCustomerPayment: (paymentData: ARPaymentData, ARPayment: any, transaction?: Transaction) => Promise<any>;
    applyPaymentToInvoice: (paymentId: string, invoiceId: string, amount: number, ARPayment: any, CustomerInvoice: any) => Promise<{
        payment: any;
        invoice: any;
    }>;
    autoApplyPayment: (paymentId: string, ARPayment: any, CustomerInvoice: any) => Promise<CashApplicationMatch[]>;
    suggestPaymentMatches: (paymentId: string, ARPayment: any, CustomerInvoice: any) => Promise<CashApplicationMatch[]>;
    reversePaymentApplication: (paymentId: string, invoiceId: string, reason: string, ARPayment: any, CustomerInvoice: any) => Promise<void>;
    processCustomerRefund: (customerId: string, amount: number, reason: string, ARPayment: any) => Promise<any>;
    getUnappliedCash: (customerId: string, ARPayment: any) => Promise<{
        payments: any[];
        totalUnapplied: number;
    }>;
    reconcileBankDeposit: (depositDate: Date, depositAmount: number, paymentIds: string[], ARPayment: any) => Promise<{
        matched: boolean;
        variance: number;
    }>;
    generateARAgingReport: (asOfDate: Date | undefined, CustomerInvoice: any) => Promise<Map<string, AgingBucket[]>>;
    calculateTotalAR: (CustomerInvoice: any) => Promise<number>;
    identifyHighRiskCustomers: (agingData: Map<string, AgingBucket[]>, threshold?: number) => string[];
    exportARAgingCSV: (agingData: Map<string, AgingBucket[]>) => string;
    evaluateCustomerCredit: (customerId: string, creditLimit: number, CustomerInvoice: any) => Promise<CreditLimit>;
    checkCreditApproval: (customerId: string, orderAmount: number, creditInfo: CreditLimit) => {
        approved: boolean;
        reason?: string;
    };
    placeCreditHold: (customerId: string, reason: string) => Promise<{
        held: boolean;
        reason: string;
    }>;
    releaseCreditHold: (customerId: string, reason: string) => Promise<{
        released: boolean;
    }>;
    determineDunningLevel: (invoice: any, levels: DunningLevel[]) => DunningLevel | null;
    executeDunningProcess: (customerId: string, CustomerInvoice: any, levels: DunningLevel[]) => Promise<{
        actionsPerformed: number;
        invoices: any[];
    }>;
    generatePaymentReminder: (customerId: string, CustomerInvoice: any) => Promise<PaymentReminder>;
    scheduleDunningCommunications: (CustomerInvoice: any, levels: DunningLevel[]) => Promise<PaymentReminder[]>;
    logCollectionActivity: (activity: CollectionActivity, CollectionActivityModel: any) => Promise<any>;
    getCollectionHistory: (customerId: string, CollectionActivityModel: any, limit?: number) => Promise<any[]>;
    createCollectionFollowUp: (customerId: string, followUpDate: Date, assignedTo: string, notes: string) => Promise<any>;
    identifyEscalationAccounts: (daysThreshold: number | undefined, amountThreshold: number | undefined, CustomerInvoice: any) => Promise<any[]>;
    createPaymentPlan: (planData: PaymentPlan) => Promise<PaymentPlan>;
    generatePaymentSchedule: (plan: PaymentPlan) => Array<{
        dueDate: Date;
        amount: number;
        installmentNumber: number;
    }>;
    trackPaymentPlanCompliance: (customerId: string, plan: PaymentPlan, ARPayment: any) => Promise<{
        compliant: boolean;
        missedPayments: number;
        nextDueDate: Date;
    }>;
    generateCustomerStatement: (customerId: string, startDate: Date, endDate: Date, CustomerInvoice: any, ARPayment: any) => Promise<CustomerStatement>;
    exportCustomerStatementPDF: (statement: CustomerStatement) => Promise<Buffer>;
    emailCustomerStatement: (statement: CustomerStatement, customerEmail: string, emailService: any) => Promise<{
        sent: boolean;
    }>;
    calculateDSO: (startDate: Date, endDate: Date, CustomerInvoice: any) => Promise<DSOMetrics>;
    calculateCEI: (startDate: Date, endDate: Date, CustomerInvoice: any, ARPayment: any) => Promise<number>;
    trackBadDebtReserve: (totalAR: number, reservePercent?: number, writeOffAmount?: number) => BadDebtReserve;
    generateARDashboard: (CustomerInvoice: any, ARPayment: any) => Promise<any>;
    createRevenueRecognitionSchedule: (invoiceId: string, totalAmount: number, startDate: Date, periods: number) => RevenueRecognition;
    processRevenueRecognition: (schedule: RevenueRecognition, asOfDate: Date) => RevenueRecognition;
    generateDeferredRevenueReport: (CustomerInvoice: any) => Promise<{
        totalDeferred: number;
        byPeriod: any[];
    }>;
    AccountsReceivableService: typeof AccountsReceivableService;
};
export default _default;
//# sourceMappingURL=accounts-receivable-management-kit.d.ts.map