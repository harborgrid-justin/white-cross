/**
 * LOC: EDWAR001
 * File: /reuse/edwards/financial/accounts-receivable-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (ORM for database operations)
 *   - @nestjs/common (NestJS framework)
 *   - @nestjs/swagger (API documentation)
 *   - ../../financial/general-ledger-operations-kit (GL integration)
 *
 * DOWNSTREAM (imported by):
 *   - Backend financial modules
 *   - Customer billing services
 *   - Collections management modules
 *   - Cash receipts systems
 */
/**
 * File: /reuse/edwards/financial/accounts-receivable-management-kit.ts
 * Locator: WC-EDWARDS-AR-001
 * Purpose: Comprehensive Accounts Receivable Management - JD Edwards EnterpriseOne-level customer billing, collections, cash receipts, credit management
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, TypeScript 5.x, general-ledger-operations-kit
 * Downstream: ../backend/financial/*, Customer Services, Collections, Cash Management
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+
 * Exports: 45+ functions for customer management, invoice generation, payment application, collections, credit management, dunning, lockbox processing, cash receipts, AR aging, credit limits, customer statements, dispute management, payment plans, write-offs
 *
 * LLM Context: Enterprise-grade accounts receivable operations for JD Edwards EnterpriseOne compliance.
 * Provides comprehensive customer billing, automated invoice generation, payment application, collections workflows,
 * credit limit management, dunning process automation, lockbox processing, cash receipts posting,
 * AR aging analysis, customer statement generation, dispute tracking, payment plan management,
 * bad debt write-offs, and audit trails. Supports multi-currency, multi-entity operations with full GL integration.
 */
import { Sequelize, Transaction } from 'sequelize';
interface ARInvoiceLine {
    lineId: number;
    invoiceId: number;
    lineNumber: number;
    accountCode: string;
    description: string;
    quantity: number;
    unitPrice: number;
    lineAmount: number;
    taxAmount: number;
    salesOrderLine?: number;
    projectCode?: string;
    costCenterCode?: string;
    activityCode?: string;
}
interface CollectionsCase {
    caseId: number;
    customerId: number;
    caseNumber: string;
    caseDate: Date;
    totalOutstanding: number;
    oldestInvoiceDate: Date;
    daysOutstanding: number;
    collectorId: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    status: 'open' | 'in_progress' | 'promise_to_pay' | 'legal' | 'resolved' | 'closed';
    resolutionDate?: Date;
    resolutionNotes?: string;
}
interface CollectionsActivity {
    activityId: number;
    caseId: number;
    activityDate: Date;
    activityType: 'call' | 'email' | 'letter' | 'meeting' | 'legal_notice';
    contactedPerson: string;
    activityNotes: string;
    promiseDate?: Date;
    promiseAmount?: number;
    collectorId: string;
}
interface DunningRun {
    runId: number;
    runNumber: string;
    runDate: Date;
    dunningLevel: number;
    customerCount: number;
    totalAmount: number;
    status: 'created' | 'in_progress' | 'completed';
    processedBy: string;
    processedAt?: Date;
}
interface CustomerStatement {
    statementId: number;
    customerId: number;
    statementDate: Date;
    beginningBalance: number;
    charges: number;
    payments: number;
    adjustments: number;
    endingBalance: number;
    currentDue: number;
    pastDue: number;
}
interface ARAgingBucket {
    customerId: number;
    customerNumber: string;
    customerName: string;
    current: number;
    days1To30: number;
    days31To60: number;
    days61To90: number;
    days91To120: number;
    over120: number;
    totalOutstanding: number;
}
interface PaymentPlan {
    planId: number;
    customerId: number;
    planStartDate: Date;
    totalAmount: number;
    numberOfPayments: number;
    paymentFrequency: 'weekly' | 'biweekly' | 'monthly';
    paymentAmount: number;
    nextPaymentDate: Date;
    status: 'active' | 'completed' | 'defaulted' | 'cancelled';
}
interface Dispute {
    disputeId: number;
    invoiceId: number;
    customerId: number;
    disputeDate: Date;
    disputeAmount: number;
    disputeReason: string;
    disputeCategory: 'pricing' | 'quantity' | 'quality' | 'delivery' | 'other';
    status: 'open' | 'investigating' | 'resolved' | 'rejected';
    assignedTo?: string;
    resolutionDate?: Date;
    resolutionNotes?: string;
}
interface WriteOff {
    writeOffId: number;
    invoiceId: number;
    customerId: number;
    writeOffDate: Date;
    writeOffAmount: number;
    writeOffReason: string;
    writeOffType: 'bad_debt' | 'adjustment' | 'settlement';
    approvedBy: string;
    glJournalEntryId?: number;
}
export declare class CreateCustomerDto {
    customerNumber: string;
    customerName: string;
    customerType: string;
    taxId: string;
    creditLimit: number;
    paymentTerms: string;
    defaultGLAccount: string;
}
export declare class CreateARInvoiceDto {
    invoiceNumber: string;
    customerId: number;
    invoiceDate: Date;
    grossAmount: number;
    taxAmount?: number;
    salesOrderNumber?: string;
    lines: ARInvoiceLine[];
}
export declare class ProcessCashReceiptDto {
    receiptDate: Date;
    receiptMethod: string;
    customerId: number;
    receiptAmount: number;
    bankAccountId: number;
    checkNumber?: string;
    invoiceIds?: number[];
}
export declare class CreateCollectionsCaseDto {
    customerId: number;
    collectorId: string;
    priority: string;
}
/**
 * Sequelize model for Customer master data.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Customer model
 *
 * @example
 * ```typescript
 * const Customer = createCustomerModel(sequelize);
 * const customer = await Customer.create({
 *   customerNumber: 'C-10001',
 *   customerName: 'ABC Corp',
 *   customerType: 'commercial',
 *   status: 'active'
 * });
 * ```
 */
export declare const createCustomerModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        customerNumber: string;
        customerName: string;
        customerType: string;
        taxId: string;
        creditLimit: number;
        creditRating: string;
        paymentTerms: string;
        status: string;
        holdReason: string | null;
        defaultGLAccount: string;
        currency: string;
        dunningLevel: number;
        lastDunningDate: Date | null;
        metadata: Record<string, any>;
    };
};
/**
 * Sequelize model for AR Invoice headers.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ARInvoice model
 *
 * @example
 * ```typescript
 * const ARInvoice = createARInvoiceModel(sequelize);
 * const invoice = await ARInvoice.create({
 *   invoiceNumber: 'AR-2024-001',
 *   customerId: 1,
 *   grossAmount: 10000.00,
 *   status: 'posted'
 * });
 * ```
 */
export declare const createARInvoiceModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        invoiceNumber: string;
        customerId: number;
        invoiceDate: Date;
        dueDate: Date;
        invoiceAmount: number;
        taxAmount: number;
        freightAmount: number;
        otherCharges: number;
        grossAmount: number;
        appliedAmount: number;
        unappliedAmount: number;
        outstandingBalance: number;
        status: string;
        disputeStatus: string;
        glDate: Date;
        fiscalYear: number;
        fiscalPeriod: number;
        salesOrderNumber: string | null;
        shipmentNumber: string | null;
        description: string;
    };
};
/**
 * Sequelize model for Cash Receipt headers.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CashReceipt model
 *
 * @example
 * ```typescript
 * const CashReceipt = createCashReceiptModel(sequelize);
 * const receipt = await CashReceipt.create({
 *   receiptNumber: 'CR-2024-001',
 *   customerId: 1,
 *   receiptAmount: 5000.00,
 *   receiptMethod: 'check'
 * });
 * ```
 */
export declare const createCashReceiptModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        receiptNumber: string;
        receiptDate: Date;
        receiptMethod: string;
        customerId: number;
        receiptAmount: number;
        unappliedAmount: number;
        bankAccountId: number;
        checkNumber: string | null;
        referenceNumber: string | null;
        lockboxBatchId: string | null;
        status: string;
        postedDate: Date | null;
        reversalDate: Date | null;
        reversalReason: string | null;
        currency: string;
    };
};
/**
 * Creates a new customer with validation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateCustomerDto} customerData - Customer data
 * @param {string} userId - User creating the customer
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created customer
 *
 * @example
 * ```typescript
 * const customer = await createCustomer(sequelize, {
 *   customerNumber: 'C-10001',
 *   customerName: 'ABC Corporation',
 *   customerType: 'commercial',
 *   taxId: '12-3456789',
 *   creditLimit: 50000,
 *   paymentTerms: 'Net 30'
 * }, 'user123');
 * ```
 */
export declare const createCustomer: (sequelize: Sequelize, customerData: CreateCustomerDto, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Updates customer information.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} customerId - Customer ID
 * @param {Partial<CreateCustomerDto>} updateData - Update data
 * @param {string} userId - User updating the customer
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated customer
 *
 * @example
 * ```typescript
 * const updated = await updateCustomer(sequelize, 1, {
 *   creditLimit: 75000
 * }, 'user123');
 * ```
 */
export declare const updateCustomer: (sequelize: Sequelize, customerId: number, updateData: Partial<CreateCustomerDto>, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Places customer on credit hold.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} customerId - Customer ID
 * @param {string} holdReason - Reason for hold
 * @param {string} userId - User placing hold
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated customer
 *
 * @example
 * ```typescript
 * const customer = await placeCustomerOnHold(sequelize, 1, 'Exceeded credit limit', 'user123');
 * ```
 */
export declare const placeCustomerOnHold: (sequelize: Sequelize, customerId: number, holdReason: string, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Releases customer from credit hold.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} customerId - Customer ID
 * @param {string} userId - User releasing hold
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated customer
 *
 * @example
 * ```typescript
 * const customer = await releaseCustomerHold(sequelize, 1, 'user123');
 * ```
 */
export declare const releaseCustomerHold: (sequelize: Sequelize, customerId: number, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Updates customer credit limit.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} customerId - Customer ID
 * @param {number} newCreditLimit - New credit limit
 * @param {string} userId - User updating limit
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated customer
 *
 * @example
 * ```typescript
 * const customer = await updateCustomerCreditLimit(sequelize, 1, 100000, 'user123');
 * ```
 */
export declare const updateCustomerCreditLimit: (sequelize: Sequelize, customerId: number, newCreditLimit: number, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Checks if customer is over credit limit.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} customerId - Customer ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<{ isOverLimit: boolean; currentBalance: number; creditLimit: number; available: number }>} Credit status
 *
 * @example
 * ```typescript
 * const status = await checkCustomerCreditLimit(sequelize, 1);
 * ```
 */
export declare const checkCustomerCreditLimit: (sequelize: Sequelize, customerId: number, transaction?: Transaction) => Promise<{
    isOverLimit: boolean;
    currentBalance: number;
    creditLimit: number;
    available: number;
}>;
/**
 * Retrieves customer by customer number.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} customerNumber - Customer number
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Customer record
 *
 * @example
 * ```typescript
 * const customer = await getCustomerByNumber(sequelize, 'C-10001');
 * ```
 */
export declare const getCustomerByNumber: (sequelize: Sequelize, customerNumber: string, transaction?: Transaction) => Promise<any>;
/**
 * Searches customers by criteria.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Record<string, any>} criteria - Search criteria
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Matching customers
 *
 * @example
 * ```typescript
 * const customers = await searchCustomers(sequelize, {
 *   customerType: 'commercial',
 *   status: 'active',
 *   creditRating: 'excellent'
 * });
 * ```
 */
export declare const searchCustomers: (sequelize: Sequelize, criteria: Record<string, any>, transaction?: Transaction) => Promise<any[]>;
/**
 * Creates a new AR invoice with validation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateARInvoiceDto} invoiceData - Invoice data
 * @param {string} userId - User creating invoice
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created invoice
 *
 * @example
 * ```typescript
 * const invoice = await createARInvoice(sequelize, {
 *   invoiceNumber: 'AR-2024-001',
 *   customerId: 1,
 *   invoiceDate: new Date(),
 *   grossAmount: 10000.00,
 *   lines: [...]
 * }, 'user123');
 * ```
 */
export declare const createARInvoice: (sequelize: Sequelize, invoiceData: CreateARInvoiceDto, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Calculates invoice due date from invoice date and payment terms.
 *
 * @param {Date} invoiceDate - Invoice date
 * @param {string} paymentTerms - Payment terms (e.g., "Net 30")
 * @returns {Date} Due date
 *
 * @example
 * ```typescript
 * const dueDate = calculateInvoiceDueDate(new Date(), 'Net 30');
 * ```
 */
export declare const calculateInvoiceDueDate: (invoiceDate: Date, paymentTerms: string) => Date;
/**
 * Posts an AR invoice to GL.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} invoiceId - Invoice ID
 * @param {string} userId - User posting invoice
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Posted invoice
 *
 * @example
 * ```typescript
 * const invoice = await postARInvoice(sequelize, 1, 'user123');
 * ```
 */
export declare const postARInvoice: (sequelize: Sequelize, invoiceId: number, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Voids an AR invoice.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} invoiceId - Invoice ID
 * @param {string} voidReason - Reason for void
 * @param {string} userId - User voiding invoice
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Voided invoice
 *
 * @example
 * ```typescript
 * const invoice = await voidARInvoice(sequelize, 1, 'Duplicate entry', 'user123');
 * ```
 */
export declare const voidARInvoice: (sequelize: Sequelize, invoiceId: number, voidReason: string, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Retrieves invoices by status.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} status - Invoice status
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Invoices with specified status
 *
 * @example
 * ```typescript
 * const posted = await getInvoicesByStatus(sequelize, 'posted');
 * ```
 */
export declare const getInvoicesByStatus: (sequelize: Sequelize, status: string, transaction?: Transaction) => Promise<any[]>;
/**
 * Gets overdue invoices.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} [asOfDate] - As-of date (defaults to today)
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Overdue invoices
 *
 * @example
 * ```typescript
 * const overdue = await getOverdueInvoices(sequelize);
 * ```
 */
export declare const getOverdueInvoices: (sequelize: Sequelize, asOfDate?: Date, transaction?: Transaction) => Promise<any[]>;
/**
 * Generates invoice number.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} [prefix='AR'] - Invoice number prefix
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<string>} Invoice number
 *
 * @example
 * ```typescript
 * const invoiceNumber = await generateInvoiceNumber(sequelize, 'INV');
 * // Returns: "INV-2024-00001"
 * ```
 */
export declare const generateInvoiceNumber: (sequelize: Sequelize, prefix?: string, transaction?: Transaction) => Promise<string>;
/**
 * Gets fiscal year and period from date.
 *
 * @param {Date} date - Date to convert
 * @returns {{ fiscalYear: number; fiscalPeriod: number }} Fiscal year and period
 *
 * @example
 * ```typescript
 * const { fiscalYear, fiscalPeriod } = getFiscalYearPeriod(new Date('2024-03-15'));
 * // Returns: { fiscalYear: 2024, fiscalPeriod: 3 }
 * ```
 */
export declare const getFiscalYearPeriod: (date: Date) => {
    fiscalYear: number;
    fiscalPeriod: number;
};
/**
 * Creates a cash receipt.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {ProcessCashReceiptDto} receiptData - Receipt data
 * @param {string} userId - User creating receipt
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created receipt
 *
 * @example
 * ```typescript
 * const receipt = await createCashReceipt(sequelize, {
 *   receiptDate: new Date(),
 *   receiptMethod: 'check',
 *   customerId: 1,
 *   receiptAmount: 5000.00,
 *   bankAccountId: 1,
 *   checkNumber: '12345'
 * }, 'user123');
 * ```
 */
export declare const createCashReceipt: (sequelize: Sequelize, receiptData: ProcessCashReceiptDto, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Generates a unique receipt number.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} receiptMethod - Receipt method
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<string>} Receipt number
 *
 * @example
 * ```typescript
 * const receiptNumber = await generateReceiptNumber(sequelize, 'check');
 * // Returns: "CR-2024-00001"
 * ```
 */
export declare const generateReceiptNumber: (sequelize: Sequelize, receiptMethod: string, transaction?: Transaction) => Promise<string>;
/**
 * Posts a cash receipt to GL.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} receiptId - Receipt ID
 * @param {string} userId - User posting receipt
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Posted receipt
 *
 * @example
 * ```typescript
 * const receipt = await postCashReceipt(sequelize, 1, 'user123');
 * ```
 */
export declare const postCashReceipt: (sequelize: Sequelize, receiptId: number, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Applies cash receipt to invoices.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} receiptId - Receipt ID
 * @param {number[]} invoiceIds - Invoice IDs to apply to
 * @param {string} userId - User applying receipt
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated receipt
 *
 * @example
 * ```typescript
 * const receipt = await applyCashReceipt(sequelize, 1, [1, 2, 3], 'user123');
 * ```
 */
export declare const applyCashReceipt: (sequelize: Sequelize, receiptId: number, invoiceIds: number[], userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Creates a receipt application record.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} receiptId - Receipt ID
 * @param {number} invoiceId - Invoice ID
 * @param {number} appliedAmount - Applied amount
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Receipt application record
 *
 * @example
 * ```typescript
 * const application = await createReceiptApplication(sequelize, 1, 2, 1000);
 * ```
 */
export declare const createReceiptApplication: (sequelize: Sequelize, receiptId: number, invoiceId: number, appliedAmount: number, transaction?: Transaction) => Promise<any>;
/**
 * Reverses a cash receipt.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} receiptId - Receipt ID
 * @param {string} reversalReason - Reason for reversal
 * @param {string} userId - User reversing receipt
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Reversed receipt
 *
 * @example
 * ```typescript
 * const receipt = await reverseCashReceipt(sequelize, 1, 'NSF check', 'user123');
 * ```
 */
export declare const reverseCashReceipt: (sequelize: Sequelize, receiptId: number, reversalReason: string, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Reverses receipt applications.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} receiptId - Receipt ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await reverseReceiptApplications(sequelize, 1);
 * ```
 */
export declare const reverseReceiptApplications: (sequelize: Sequelize, receiptId: number, transaction?: Transaction) => Promise<void>;
/**
 * Processes lockbox file.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} lockboxBatchId - Lockbox batch ID
 * @param {any[]} lockboxRecords - Lockbox records
 * @param {string} userId - User processing lockbox
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Processing results
 *
 * @example
 * ```typescript
 * const results = await processLockboxFile(sequelize, 'LB-2024-001', lockboxData, 'user123');
 * ```
 */
export declare const processLockboxFile: (sequelize: Sequelize, lockboxBatchId: string, lockboxRecords: any[], userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Creates a collections case.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateCollectionsCaseDto} caseData - Case data
 * @param {string} userId - User creating case
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<CollectionsCase>} Created case
 *
 * @example
 * ```typescript
 * const case = await createCollectionsCase(sequelize, {
 *   customerId: 1,
 *   collectorId: 'collector1',
 *   priority: 'high'
 * }, 'user123');
 * ```
 */
export declare const createCollectionsCase: (sequelize: Sequelize, caseData: CreateCollectionsCaseDto, userId: string, transaction?: Transaction) => Promise<CollectionsCase>;
/**
 * Adds activity to collections case.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} caseId - Case ID
 * @param {string} activityType - Activity type
 * @param {string} activityNotes - Activity notes
 * @param {string} collectorId - Collector ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<CollectionsActivity>} Created activity
 *
 * @example
 * ```typescript
 * const activity = await addCollectionsActivity(sequelize, 1, 'call', 'Left voicemail', 'collector1');
 * ```
 */
export declare const addCollectionsActivity: (sequelize: Sequelize, caseId: number, activityType: string, activityNotes: string, collectorId: string, transaction?: Transaction) => Promise<CollectionsActivity>;
/**
 * Updates collections case status.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} caseId - Case ID
 * @param {string} newStatus - New status
 * @param {string} userId - User updating case
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated case
 *
 * @example
 * ```typescript
 * const case = await updateCollectionsCaseStatus(sequelize, 1, 'resolved', 'user123');
 * ```
 */
export declare const updateCollectionsCaseStatus: (sequelize: Sequelize, caseId: number, newStatus: string, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Gets open collections cases.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} [collectorId] - Optional collector filter
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Open cases
 *
 * @example
 * ```typescript
 * const cases = await getOpenCollectionsCases(sequelize, 'collector1');
 * ```
 */
export declare const getOpenCollectionsCases: (sequelize: Sequelize, collectorId?: string, transaction?: Transaction) => Promise<any[]>;
/**
 * Runs dunning process for overdue customers.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} dunningLevel - Dunning level (1-5)
 * @param {string} userId - User running dunning
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<DunningRun>} Dunning run results
 *
 * @example
 * ```typescript
 * const run = await runDunningProcess(sequelize, 1, 'user123');
 * ```
 */
export declare const runDunningProcess: (sequelize: Sequelize, dunningLevel: number, userId: string, transaction?: Transaction) => Promise<DunningRun>;
/**
 * Gets customers eligible for dunning.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} daysPastDue - Minimum days past due
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Eligible customers
 *
 * @example
 * ```typescript
 * const eligible = await getCustomersEligibleForDunning(sequelize, 30);
 * ```
 */
export declare const getCustomersEligibleForDunning: (sequelize: Sequelize, daysPastDue: number, transaction?: Transaction) => Promise<any[]>;
/**
 * Creates payment plan for customer.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} customerId - Customer ID
 * @param {number} totalAmount - Total plan amount
 * @param {number} numberOfPayments - Number of payments
 * @param {string} frequency - Payment frequency
 * @param {string} userId - User creating plan
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<PaymentPlan>} Created payment plan
 *
 * @example
 * ```typescript
 * const plan = await createPaymentPlan(sequelize, 1, 10000, 12, 'monthly', 'user123');
 * ```
 */
export declare const createPaymentPlan: (sequelize: Sequelize, customerId: number, totalAmount: number, numberOfPayments: number, frequency: string, userId: string, transaction?: Transaction) => Promise<PaymentPlan>;
/**
 * Processes payment plan payment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} planId - Payment plan ID
 * @param {number} paymentAmount - Payment amount
 * @param {string} userId - User processing payment
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated plan
 *
 * @example
 * ```typescript
 * const plan = await processPaymentPlanPayment(sequelize, 1, 833.33, 'user123');
 * ```
 */
export declare const processPaymentPlanPayment: (sequelize: Sequelize, planId: number, paymentAmount: number, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Generates accounts receivable aging report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} asOfDate - Aging as-of date
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<ARAgingBucket[]>} Aging buckets by customer
 *
 * @example
 * ```typescript
 * const aging = await generateARAgingReport(sequelize, new Date());
 * ```
 */
export declare const generateARAgingReport: (sequelize: Sequelize, asOfDate: Date, transaction?: Transaction) => Promise<ARAgingBucket[]>;
/**
 * Generates customer statement.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} customerId - Customer ID
 * @param {Date} statementDate - Statement date
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<CustomerStatement>} Customer statement
 *
 * @example
 * ```typescript
 * const statement = await generateCustomerStatement(sequelize, 1, new Date());
 * ```
 */
export declare const generateCustomerStatement: (sequelize: Sequelize, customerId: number, statementDate: Date, transaction?: Transaction) => Promise<CustomerStatement>;
/**
 * Gets top customers by revenue.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} [limit=10] - Number of top customers
 * @param {number} [days=365] - Analysis period in days
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Top customers
 *
 * @example
 * ```typescript
 * const topCustomers = await getTopCustomersByRevenue(sequelize, 10, 365);
 * ```
 */
export declare const getTopCustomersByRevenue: (sequelize: Sequelize, limit?: number, days?: number, transaction?: Transaction) => Promise<any[]>;
/**
 * Calculates DSO (Days Sales Outstanding).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} [days=90] - Analysis period
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} DSO in days
 *
 * @example
 * ```typescript
 * const dso = await calculateDSO(sequelize, 90);
 * ```
 */
export declare const calculateDSO: (sequelize: Sequelize, days?: number, transaction?: Transaction) => Promise<number>;
/**
 * Creates bad debt write-off.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} invoiceId - Invoice ID
 * @param {number} writeOffAmount - Amount to write off
 * @param {string} writeOffReason - Reason for write-off
 * @param {string} userId - User creating write-off
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<WriteOff>} Created write-off
 *
 * @example
 * ```typescript
 * const writeOff = await createBadDebtWriteOff(sequelize, 1, 5000, 'Customer bankruptcy', 'user123');
 * ```
 */
export declare const createBadDebtWriteOff: (sequelize: Sequelize, invoiceId: number, writeOffAmount: number, writeOffReason: string, userId: string, transaction?: Transaction) => Promise<WriteOff>;
/**
 * Creates dispute for invoice.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} invoiceId - Invoice ID
 * @param {number} disputeAmount - Disputed amount
 * @param {string} disputeReason - Dispute reason
 * @param {string} disputeCategory - Dispute category
 * @param {string} userId - User creating dispute
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Dispute>} Created dispute
 *
 * @example
 * ```typescript
 * const dispute = await createInvoiceDispute(sequelize, 1, 1000, 'Incorrect pricing', 'pricing', 'user123');
 * ```
 */
export declare const createInvoiceDispute: (sequelize: Sequelize, invoiceId: number, disputeAmount: number, disputeReason: string, disputeCategory: string, userId: string, transaction?: Transaction) => Promise<Dispute>;
/**
 * Resolves invoice dispute.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} disputeId - Dispute ID
 * @param {string} resolution - Resolution decision ('approved' or 'rejected')
 * @param {string} resolutionNotes - Resolution notes
 * @param {string} userId - User resolving dispute
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Dispute>} Resolved dispute
 *
 * @example
 * ```typescript
 * const dispute = await resolveInvoiceDispute(sequelize, 1, 'approved', 'Credit memo issued', 'user123');
 * ```
 */
export declare const resolveInvoiceDispute: (sequelize: Sequelize, disputeId: number, resolution: string, resolutionNotes: string, userId: string, transaction?: Transaction) => Promise<Dispute>;
/**
 * Gets collection effectiveness metrics.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} [days=90] - Analysis period
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Collection metrics
 *
 * @example
 * ```typescript
 * const metrics = await getCollectionEffectivenessMetrics(sequelize, 90);
 * ```
 */
export declare const getCollectionEffectivenessMetrics: (sequelize: Sequelize, days?: number, transaction?: Transaction) => Promise<any>;
/**
 * Gets customers exceeding credit limit.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Customers over limit
 *
 * @example
 * ```typescript
 * const overLimit = await getCustomersOverCreditLimit(sequelize);
 * ```
 */
export declare const getCustomersOverCreditLimit: (sequelize: Sequelize, transaction?: Transaction) => Promise<any[]>;
/**
 * Generates cash forecast from AR.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} startDate - Forecast start date
 * @param {Date} endDate - Forecast end date
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Cash forecast
 *
 * @example
 * ```typescript
 * const forecast = await generateCashForecast(
 *   sequelize,
 *   new Date(),
 *   new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
 * );
 * ```
 */
export declare const generateCashForecast: (sequelize: Sequelize, startDate: Date, endDate: Date, transaction?: Transaction) => Promise<any>;
/**
 * Gets outstanding invoices by customer.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} customerId - Customer ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Outstanding invoices
 *
 * @example
 * ```typescript
 * const outstanding = await getOutstandingInvoicesByCustomer(sequelize, 1);
 * ```
 */
export declare const getOutstandingInvoicesByCustomer: (sequelize: Sequelize, customerId: number, transaction?: Transaction) => Promise<any[]>;
export {};
//# sourceMappingURL=accounts-receivable-management-kit.d.ts.map