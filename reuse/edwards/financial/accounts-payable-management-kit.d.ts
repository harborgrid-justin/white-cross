/**
 * LOC: EDWAP001
 * File: /reuse/edwards/financial/accounts-payable-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (ORM for database operations)
 *   - @nestjs/common (NestJS framework)
 *   - @nestjs/swagger (API documentation)
 *   - ../../financial/general-ledger-operations-kit (GL integration)
 *
 * DOWNSTREAM (imported by):
 *   - Backend financial modules
 *   - Vendor management services
 *   - Payment processing modules
 *   - Cash management systems
 */
/**
 * File: /reuse/edwards/financial/accounts-payable-management-kit.ts
 * Locator: WC-EDWARDS-AP-001
 * Purpose: Comprehensive Accounts Payable Management - JD Edwards EnterpriseOne-level vendor management, invoice processing, payments, 1099 reporting
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, TypeScript 5.x, general-ledger-operations-kit
 * Downstream: ../backend/financial/*, Vendor Services, Payment Processing, Cash Management
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+
 * Exports: 45+ functions for vendor management, invoice processing, payment processing, three-way matching, payment runs, ACH/wire transfers, 1099 reporting, vendor statements, aging reports, discount management, cash requirements forecasting
 *
 * LLM Context: Enterprise-grade accounts payable operations for JD Edwards EnterpriseOne compliance.
 * Provides comprehensive vendor management, invoice validation, automated three-way matching, payment processing,
 * ACH and wire transfer support, early payment discounts, vendor statement reconciliation, aging reports,
 * 1099 tax reporting, cash requirements forecasting, duplicate invoice detection, approval workflows,
 * and audit trails. Supports multi-currency, multi-entity operations with full GL integration.
 */
import { Sequelize, Transaction } from 'sequelize';
interface APInvoiceLine {
    lineId: number;
    invoiceId: number;
    lineNumber: number;
    accountCode: string;
    description: string;
    quantity: number;
    unitPrice: number;
    lineAmount: number;
    taxAmount: number;
    poLineNumber?: number;
    receiptLineNumber?: number;
    matchStatus: 'matched' | 'variance' | 'unmatched';
    varianceAmount: number;
    projectCode?: string;
    costCenterCode?: string;
    activityCode?: string;
}
interface PaymentRun {
    runId: number;
    runNumber: string;
    runDate: Date;
    paymentDate: Date;
    bankAccountId: number;
    paymentMethod: 'check' | 'ach' | 'wire';
    vendorSelection: 'all' | 'by_vendor' | 'by_due_date' | 'by_discount_date';
    status: 'created' | 'in_progress' | 'completed' | 'cancelled';
    totalPayments: number;
    totalAmount: number;
    processedBy: string;
    processedAt?: Date;
}
interface ThreeWayMatch {
    matchId: number;
    invoiceId: number;
    purchaseOrderId: number;
    receiptId: number;
    matchDate: Date;
    matchStatus: 'matched' | 'price_variance' | 'quantity_variance' | 'both_variance';
    priceVariance: number;
    quantityVariance: number;
    toleranceExceeded: boolean;
    requiresApproval: boolean;
    approvalStatus?: 'pending' | 'approved' | 'rejected';
}
interface VendorStatement {
    statementId: number;
    vendorId: number;
    statementDate: Date;
    beginningBalance: number;
    invoices: number;
    payments: number;
    adjustments: number;
    endingBalance: number;
    reconciliationStatus: 'unreconciled' | 'reconciling' | 'reconciled';
    reconciledBy?: string;
    reconciledAt?: Date;
}
interface APAgingBucket {
    vendorId: number;
    vendorNumber: string;
    vendorName: string;
    current: number;
    days1To30: number;
    days31To60: number;
    days61To90: number;
    days91To120: number;
    over120: number;
    totalOutstanding: number;
}
interface Form1099Data {
    vendor1099Id: number;
    vendorId: number;
    taxYear: number;
    form1099Type: '1099-NEC' | '1099-MISC' | '1099-INT' | '1099-DIV';
    box1Amount?: number;
    box2Amount?: number;
    box3Amount?: number;
    box4Amount?: number;
    totalAmount: number;
    isCorrected: boolean;
    correctionNumber?: number;
    filingStatus: 'not_filed' | 'pending' | 'filed' | 'corrected';
}
interface CashRequirement {
    requirementDate: Date;
    dueAmount: number;
    discountEligibleAmount: number;
    potentialDiscount: number;
    netRequirement: number;
    projectedBalance: number;
    shortfallAmount: number;
}
interface DiscountAnalysis {
    invoiceId: number;
    invoiceNumber: string;
    vendorId: number;
    vendorName: string;
    invoiceAmount: number;
    discountAmount: number;
    discountPercent: number;
    discountDate: Date;
    dueDate: Date;
    daysToDiscount: number;
    annualizedRate: number;
    recommendation: 'take' | 'skip';
}
export declare class CreateVendorDto {
    vendorNumber: string;
    vendorName: string;
    vendorType: string;
    taxId: string;
    is1099Vendor: boolean;
    paymentTerms: string;
    paymentMethod: string;
    defaultGLAccount: string;
}
export declare class CreateAPInvoiceDto {
    invoiceNumber: string;
    vendorId: number;
    invoiceDate: Date;
    invoiceAmount: number;
    taxAmount?: number;
    purchaseOrderNumber?: string;
    lines: APInvoiceLine[];
}
export declare class ProcessPaymentDto {
    paymentDate: Date;
    paymentMethod: string;
    bankAccountId: number;
    invoiceIds: number[];
    takeDiscounts?: boolean;
}
export declare class PaymentRunDto {
    paymentDate: Date;
    bankAccountId: number;
    paymentMethod: string;
    vendorSelection: string;
    vendorIds?: number[];
}
/**
 * Sequelize model for Vendor master data.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Vendor model
 *
 * @example
 * ```typescript
 * const Vendor = createVendorModel(sequelize);
 * const vendor = await Vendor.create({
 *   vendorNumber: 'V-10001',
 *   vendorName: 'Acme Corp',
 *   vendorType: 'supplier',
 *   status: 'active'
 * });
 * ```
 */
export declare const createVendorModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        vendorNumber: string;
        vendorName: string;
        vendorType: string;
        taxId: string;
        is1099Vendor: boolean;
        is1099Type: string | null;
        paymentTerms: string;
        paymentMethod: string;
        creditLimit: number;
        status: string;
        holdReason: string | null;
        defaultGLAccount: string;
        currency: string;
        metadata: Record<string, any>;
    };
};
/**
 * Sequelize model for AP Invoice headers.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} APInvoice model
 *
 * @example
 * ```typescript
 * const APInvoice = createAPInvoiceModel(sequelize);
 * const invoice = await APInvoice.create({
 *   invoiceNumber: 'INV-2024-001',
 *   vendorId: 1,
 *   invoiceAmount: 5000.00,
 *   status: 'pending_approval'
 * });
 * ```
 */
export declare const createAPInvoiceModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        invoiceNumber: string;
        vendorId: number;
        invoiceDate: Date;
        dueDate: Date;
        discountDate: Date | null;
        discountAmount: number;
        invoiceAmount: number;
        taxAmount: number;
        freightAmount: number;
        otherCharges: number;
        netAmount: number;
        paidAmount: number;
        discountTaken: number;
        outstandingBalance: number;
        status: string;
        approvalStatus: string;
        matchStatus: string;
        glDate: Date;
        fiscalYear: number;
        fiscalPeriod: number;
        purchaseOrderNumber: string | null;
        receivingNumber: string | null;
        description: string;
    };
};
/**
 * Sequelize model for Payment headers.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Payment model
 *
 * @example
 * ```typescript
 * const Payment = createPaymentModel(sequelize);
 * const payment = await Payment.create({
 *   paymentNumber: 'PAY-2024-001',
 *   vendorId: 1,
 *   paymentAmount: 5000.00,
 *   paymentMethod: 'ach'
 * });
 * ```
 */
export declare const createPaymentModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        paymentNumber: string;
        paymentDate: Date;
        paymentMethod: string;
        vendorId: number;
        paymentAmount: number;
        discountTaken: number;
        bankAccountId: number;
        checkNumber: string | null;
        achBatchId: string | null;
        wireReferenceNumber: string | null;
        status: string;
        clearedDate: Date | null;
        voidDate: Date | null;
        voidReason: string | null;
        currency: string;
    };
};
/**
 * Creates a new vendor with validation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateVendorDto} vendorData - Vendor data
 * @param {string} userId - User creating the vendor
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created vendor
 *
 * @example
 * ```typescript
 * const vendor = await createVendor(sequelize, {
 *   vendorNumber: 'V-10001',
 *   vendorName: 'Acme Corporation',
 *   vendorType: 'supplier',
 *   taxId: '12-3456789',
 *   paymentTerms: 'Net 30',
 *   paymentMethod: 'ach'
 * }, 'user123');
 * ```
 */
export declare const createVendor: (sequelize: Sequelize, vendorData: CreateVendorDto, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Updates vendor information.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} vendorId - Vendor ID
 * @param {Partial<CreateVendorDto>} updateData - Update data
 * @param {string} userId - User updating the vendor
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated vendor
 *
 * @example
 * ```typescript
 * const updated = await updateVendor(sequelize, 1, {
 *   paymentTerms: '2/10 Net 30'
 * }, 'user123');
 * ```
 */
export declare const updateVendor: (sequelize: Sequelize, vendorId: number, updateData: Partial<CreateVendorDto>, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Places vendor on payment hold.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} vendorId - Vendor ID
 * @param {string} holdReason - Reason for hold
 * @param {string} userId - User placing hold
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated vendor
 *
 * @example
 * ```typescript
 * const vendor = await placeVendorOnHold(sequelize, 1, 'Disputed invoice', 'user123');
 * ```
 */
export declare const placeVendorOnHold: (sequelize: Sequelize, vendorId: number, holdReason: string, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Releases vendor from payment hold.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} vendorId - Vendor ID
 * @param {string} userId - User releasing hold
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated vendor
 *
 * @example
 * ```typescript
 * const vendor = await releaseVendorHold(sequelize, 1, 'user123');
 * ```
 */
export declare const releaseVendorHold: (sequelize: Sequelize, vendorId: number, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Retrieves vendor by vendor number.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} vendorNumber - Vendor number
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Vendor record
 *
 * @example
 * ```typescript
 * const vendor = await getVendorByNumber(sequelize, 'V-10001');
 * ```
 */
export declare const getVendorByNumber: (sequelize: Sequelize, vendorNumber: string, transaction?: Transaction) => Promise<any>;
/**
 * Searches vendors by criteria.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Record<string, any>} criteria - Search criteria
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Matching vendors
 *
 * @example
 * ```typescript
 * const vendors = await searchVendors(sequelize, {
 *   vendorType: 'supplier',
 *   status: 'active',
 *   is1099Vendor: true
 * });
 * ```
 */
export declare const searchVendors: (sequelize: Sequelize, criteria: Record<string, any>, transaction?: Transaction) => Promise<any[]>;
/**
 * Deactivates a vendor.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} vendorId - Vendor ID
 * @param {string} userId - User deactivating vendor
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated vendor
 *
 * @example
 * ```typescript
 * const vendor = await deactivateVendor(sequelize, 1, 'user123');
 * ```
 */
export declare const deactivateVendor: (sequelize: Sequelize, vendorId: number, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Gets vendor payment statistics.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} vendorId - Vendor ID
 * @param {number} [days=365] - Number of days to analyze
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Vendor payment statistics
 *
 * @example
 * ```typescript
 * const stats = await getVendorPaymentStats(sequelize, 1, 90);
 * ```
 */
export declare const getVendorPaymentStats: (sequelize: Sequelize, vendorId: number, days?: number, transaction?: Transaction) => Promise<any>;
/**
 * Creates a new AP invoice with validation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateAPInvoiceDto} invoiceData - Invoice data
 * @param {string} userId - User creating invoice
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created invoice
 *
 * @example
 * ```typescript
 * const invoice = await createAPInvoice(sequelize, {
 *   invoiceNumber: 'INV-2024-001',
 *   vendorId: 1,
 *   invoiceDate: new Date(),
 *   invoiceAmount: 5000.00,
 *   lines: [...]
 * }, 'user123');
 * ```
 */
export declare const createAPInvoice: (sequelize: Sequelize, invoiceData: CreateAPInvoiceDto, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Checks for duplicate invoices from vendor.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} vendorId - Vendor ID
 * @param {string} invoiceNumber - Invoice number
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<boolean>} True if duplicate exists
 *
 * @example
 * ```typescript
 * const isDuplicate = await checkDuplicateInvoice(sequelize, 1, 'INV-2024-001');
 * ```
 */
export declare const checkDuplicateInvoice: (sequelize: Sequelize, vendorId: number, invoiceNumber: string, transaction?: Transaction) => Promise<boolean>;
/**
 * Approves an AP invoice for payment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} invoiceId - Invoice ID
 * @param {string} userId - User approving invoice
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated invoice
 *
 * @example
 * ```typescript
 * const invoice = await approveAPInvoice(sequelize, 1, 'user123');
 * ```
 */
export declare const approveAPInvoice: (sequelize: Sequelize, invoiceId: number, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Rejects an AP invoice.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} invoiceId - Invoice ID
 * @param {string} rejectionReason - Reason for rejection
 * @param {string} userId - User rejecting invoice
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated invoice
 *
 * @example
 * ```typescript
 * const invoice = await rejectAPInvoice(sequelize, 1, 'Incorrect amount', 'user123');
 * ```
 */
export declare const rejectAPInvoice: (sequelize: Sequelize, invoiceId: number, rejectionReason: string, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Performs three-way match validation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} invoiceId - Invoice ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<ThreeWayMatch>} Match result
 *
 * @example
 * ```typescript
 * const matchResult = await performThreeWayMatch(sequelize, 1);
 * ```
 */
export declare const performThreeWayMatch: (sequelize: Sequelize, invoiceId: number, transaction?: Transaction) => Promise<ThreeWayMatch>;
/**
 * Calculates due date from invoice date and payment terms.
 *
 * @param {Date} invoiceDate - Invoice date
 * @param {string} paymentTerms - Payment terms (e.g., "Net 30", "2/10 Net 30")
 * @returns {Date} Due date
 *
 * @example
 * ```typescript
 * const dueDate = calculateDueDate(new Date(), 'Net 30');
 * ```
 */
export declare const calculateDueDate: (invoiceDate: Date, paymentTerms: string) => Date;
/**
 * Calculates discount date and amount from payment terms.
 *
 * @param {Date} invoiceDate - Invoice date
 * @param {number} invoiceAmount - Invoice amount
 * @param {string} paymentTerms - Payment terms
 * @returns {{ discountDate: Date | null; discountAmount: number }} Discount terms
 *
 * @example
 * ```typescript
 * const terms = calculateDiscountTerms(new Date(), 1000, '2/10 Net 30');
 * // Returns: { discountDate: Date(10 days from now), discountAmount: 20 }
 * ```
 */
export declare const calculateDiscountTerms: (invoiceDate: Date, invoiceAmount: number, paymentTerms: string) => {
    discountDate: Date | null;
    discountAmount: number;
};
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
 * Voids an AP invoice.
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
 * const invoice = await voidAPInvoice(sequelize, 1, 'Duplicate entry', 'user123');
 * ```
 */
export declare const voidAPInvoice: (sequelize: Sequelize, invoiceId: number, voidReason: string, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Retrieves invoices pending approval.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Pending invoices
 *
 * @example
 * ```typescript
 * const pending = await getInvoicesPendingApproval(sequelize);
 * ```
 */
export declare const getInvoicesPendingApproval: (sequelize: Sequelize, transaction?: Transaction) => Promise<any[]>;
/**
 * Retrieves invoices with matching variances.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Invoices with variances
 *
 * @example
 * ```typescript
 * const variances = await getInvoicesWithVariances(sequelize);
 * ```
 */
export declare const getInvoicesWithVariances: (sequelize: Sequelize, transaction?: Transaction) => Promise<any[]>;
/**
 * Creates a payment for approved invoices.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {ProcessPaymentDto} paymentData - Payment data
 * @param {string} userId - User creating payment
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created payment
 *
 * @example
 * ```typescript
 * const payment = await createPayment(sequelize, {
 *   paymentDate: new Date(),
 *   paymentMethod: 'ach',
 *   bankAccountId: 1,
 *   invoiceIds: [1, 2, 3],
 *   takeDiscounts: true
 * }, 'user123');
 * ```
 */
export declare const createPayment: (sequelize: Sequelize, paymentData: ProcessPaymentDto, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Generates a unique payment number.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} paymentMethod - Payment method
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<string>} Payment number
 *
 * @example
 * ```typescript
 * const paymentNumber = await generatePaymentNumber(sequelize, 'ach');
 * // Returns: "ACH-2024-00001"
 * ```
 */
export declare const generatePaymentNumber: (sequelize: Sequelize, paymentMethod: string, transaction?: Transaction) => Promise<string>;
/**
 * Creates a payment application record.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} paymentId - Payment ID
 * @param {number} invoiceId - Invoice ID
 * @param {number} appliedAmount - Applied amount
 * @param {number} discountAmount - Discount amount
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Payment application record
 *
 * @example
 * ```typescript
 * const application = await createPaymentApplication(sequelize, 1, 2, 1000, 20);
 * ```
 */
export declare const createPaymentApplication: (sequelize: Sequelize, paymentId: number, invoiceId: number, appliedAmount: number, discountAmount: number, transaction?: Transaction) => Promise<any>;
/**
 * Approves a payment for transmission.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} paymentId - Payment ID
 * @param {string} userId - User approving payment
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated payment
 *
 * @example
 * ```typescript
 * const payment = await approvePayment(sequelize, 1, 'user123');
 * ```
 */
export declare const approvePayment: (sequelize: Sequelize, paymentId: number, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Voids a payment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} paymentId - Payment ID
 * @param {string} voidReason - Reason for void
 * @param {string} userId - User voiding payment
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Voided payment
 *
 * @example
 * ```typescript
 * const payment = await voidPayment(sequelize, 1, 'Incorrect amount', 'user123');
 * ```
 */
export declare const voidPayment: (sequelize: Sequelize, paymentId: number, voidReason: string, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Reverses payment applications for a voided payment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} paymentId - Payment ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await reversePaymentApplications(sequelize, 1);
 * ```
 */
export declare const reversePaymentApplications: (sequelize: Sequelize, paymentId: number, transaction?: Transaction) => Promise<void>;
/**
 * Marks payment as transmitted to bank.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} paymentId - Payment ID
 * @param {string} userId - User transmitting payment
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated payment
 *
 * @example
 * ```typescript
 * const payment = await transmitPayment(sequelize, 1, 'user123');
 * ```
 */
export declare const transmitPayment: (sequelize: Sequelize, paymentId: number, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Marks payment as cleared.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} paymentId - Payment ID
 * @param {Date} clearedDate - Date payment cleared
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated payment
 *
 * @example
 * ```typescript
 * const payment = await clearPayment(sequelize, 1, new Date());
 * ```
 */
export declare const clearPayment: (sequelize: Sequelize, paymentId: number, clearedDate: Date, transaction?: Transaction) => Promise<any>;
/**
 * Retrieves payments by status.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} status - Payment status
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Payments with specified status
 *
 * @example
 * ```typescript
 * const pending = await getPaymentsByStatus(sequelize, 'approved');
 * ```
 */
export declare const getPaymentsByStatus: (sequelize: Sequelize, status: string, transaction?: Transaction) => Promise<any[]>;
/**
 * Retrieves payment details including applications.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} paymentId - Payment ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Payment with applications
 *
 * @example
 * ```typescript
 * const details = await getPaymentDetails(sequelize, 1);
 * ```
 */
export declare const getPaymentDetails: (sequelize: Sequelize, paymentId: number, transaction?: Transaction) => Promise<any>;
/**
 * Creates a payment run for batch processing.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {PaymentRunDto} runData - Payment run data
 * @param {string} userId - User creating run
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<PaymentRun>} Created payment run
 *
 * @example
 * ```typescript
 * const run = await createPaymentRun(sequelize, {
 *   paymentDate: new Date(),
 *   bankAccountId: 1,
 *   paymentMethod: 'ach',
 *   vendorSelection: 'by_due_date'
 * }, 'user123');
 * ```
 */
export declare const createPaymentRun: (sequelize: Sequelize, runData: PaymentRunDto, userId: string, transaction?: Transaction) => Promise<PaymentRun>;
/**
 * Generates a unique payment run number.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<string>} Run number
 *
 * @example
 * ```typescript
 * const runNumber = await generatePaymentRunNumber(sequelize);
 * // Returns: "PR-2024-00001"
 * ```
 */
export declare const generatePaymentRunNumber: (sequelize: Sequelize, transaction?: Transaction) => Promise<string>;
/**
 * Selects invoices for payment run based on criteria.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {PaymentRunDto} runData - Payment run criteria
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Selected invoices
 *
 * @example
 * ```typescript
 * const invoices = await selectInvoicesForPaymentRun(sequelize, {
 *   paymentDate: new Date(),
 *   vendorSelection: 'by_due_date'
 * });
 * ```
 */
export declare const selectInvoicesForPaymentRun: (sequelize: Sequelize, runData: PaymentRunDto, transaction?: Transaction) => Promise<any[]>;
/**
 * Processes a payment run and creates payments.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} runId - Payment run ID
 * @param {string} userId - User processing run
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Processing results
 *
 * @example
 * ```typescript
 * const results = await processPaymentRun(sequelize, 1, 'user123');
 * ```
 */
export declare const processPaymentRun: (sequelize: Sequelize, runId: number, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Generates ACH file for payment run.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} runId - Payment run ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<string>} ACH file content
 *
 * @example
 * ```typescript
 * const achFile = await generateACHFile(sequelize, 1);
 * ```
 */
export declare const generateACHFile: (sequelize: Sequelize, runId: number, transaction?: Transaction) => Promise<string>;
/**
 * Analyzes available discounts for optimization.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} asOfDate - Analysis date
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<DiscountAnalysis[]>} Discount analysis results
 *
 * @example
 * ```typescript
 * const analysis = await analyzeAvailableDiscounts(sequelize, new Date());
 * ```
 */
export declare const analyzeAvailableDiscounts: (sequelize: Sequelize, asOfDate: Date, transaction?: Transaction) => Promise<DiscountAnalysis[]>;
/**
 * Calculates cash requirements forecast.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} startDate - Forecast start date
 * @param {number} days - Number of days to forecast
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<CashRequirement[]>} Cash requirements by date
 *
 * @example
 * ```typescript
 * const forecast = await calculateCashRequirements(sequelize, new Date(), 30);
 * ```
 */
export declare const calculateCashRequirements: (sequelize: Sequelize, startDate: Date, days: number, transaction?: Transaction) => Promise<CashRequirement[]>;
/**
 * Recommends optimal payment strategy for discounts.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} availableCash - Available cash balance
 * @param {Date} asOfDate - Analysis date
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Payment strategy recommendations
 *
 * @example
 * ```typescript
 * const strategy = await recommendPaymentStrategy(sequelize, 100000, new Date());
 * ```
 */
export declare const recommendPaymentStrategy: (sequelize: Sequelize, availableCash: number, asOfDate: Date, transaction?: Transaction) => Promise<any>;
/**
 * Calculates early payment discount ROI.
 *
 * @param {number} invoiceAmount - Invoice amount
 * @param {number} discountPercent - Discount percentage
 * @param {number} daysEarly - Days paid early
 * @returns {number} Annualized ROI percentage
 *
 * @example
 * ```typescript
 * const roi = calculateDiscountROI(10000, 2, 20);
 * // Returns annualized ROI for 2% discount on 20-day early payment
 * ```
 */
export declare const calculateDiscountROI: (invoiceAmount: number, discountPercent: number, daysEarly: number) => number;
/**
 * Gets invoices eligible for early payment discount.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} asOfDate - Analysis date
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Discount-eligible invoices
 *
 * @example
 * ```typescript
 * const eligible = await getDiscountEligibleInvoices(sequelize, new Date());
 * ```
 */
export declare const getDiscountEligibleInvoices: (sequelize: Sequelize, asOfDate: Date, transaction?: Transaction) => Promise<any[]>;
/**
 * Generates accounts payable aging report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} asOfDate - Aging as-of date
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<APAgingBucket[]>} Aging buckets by vendor
 *
 * @example
 * ```typescript
 * const aging = await generateAPAgingReport(sequelize, new Date());
 * ```
 */
export declare const generateAPAgingReport: (sequelize: Sequelize, asOfDate: Date, transaction?: Transaction) => Promise<APAgingBucket[]>;
/**
 * Generates 1099 tax data for vendors.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} taxYear - Tax year
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Form1099Data[]>} 1099 data by vendor
 *
 * @example
 * ```typescript
 * const data1099 = await generate1099Data(sequelize, 2024);
 * ```
 */
export declare const generate1099Data: (sequelize: Sequelize, taxYear: number, transaction?: Transaction) => Promise<Form1099Data[]>;
/**
 * Generates vendor statement.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} vendorId - Vendor ID
 * @param {Date} statementDate - Statement date
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<VendorStatement>} Vendor statement
 *
 * @example
 * ```typescript
 * const statement = await generateVendorStatement(sequelize, 1, new Date());
 * ```
 */
export declare const generateVendorStatement: (sequelize: Sequelize, vendorId: number, statementDate: Date, transaction?: Transaction) => Promise<VendorStatement>;
/**
 * Gets top vendors by payment volume.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} [limit=10] - Number of top vendors
 * @param {number} [days=365] - Analysis period in days
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Top vendors
 *
 * @example
 * ```typescript
 * const topVendors = await getTopVendorsByVolume(sequelize, 10, 365);
 * ```
 */
export declare const getTopVendorsByVolume: (sequelize: Sequelize, limit?: number, days?: number, transaction?: Transaction) => Promise<any[]>;
/**
 * Calculates payment cycle metrics.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} [days=90] - Analysis period
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Payment cycle metrics
 *
 * @example
 * ```typescript
 * const metrics = await calculatePaymentCycleMetrics(sequelize, 90);
 * ```
 */
export declare const calculatePaymentCycleMetrics: (sequelize: Sequelize, days?: number, transaction?: Transaction) => Promise<any>;
/**
 * Retrieves outstanding invoices by vendor.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} vendorId - Vendor ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Outstanding invoices
 *
 * @example
 * ```typescript
 * const outstanding = await getOutstandingInvoicesByVendor(sequelize, 1);
 * ```
 */
export declare const getOutstandingInvoicesByVendor: (sequelize: Sequelize, vendorId: number, transaction?: Transaction) => Promise<any[]>;
/**
 * Generates payment forecast based on approved invoices.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} startDate - Forecast start date
 * @param {Date} endDate - Forecast end date
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Payment forecast
 *
 * @example
 * ```typescript
 * const forecast = await generatePaymentForecast(
 *   sequelize,
 *   new Date(),
 *   new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
 * );
 * ```
 */
export declare const generatePaymentForecast: (sequelize: Sequelize, startDate: Date, endDate: Date, transaction?: Transaction) => Promise<any>;
export {};
//# sourceMappingURL=accounts-payable-management-kit.d.ts.map