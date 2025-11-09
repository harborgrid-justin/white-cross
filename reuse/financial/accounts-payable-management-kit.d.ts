/**
 * LOC: FINAP9876543
 * File: /reuse/financial/accounts-payable-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable financial utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Backend AP services
 *   - Vendor management modules
 *   - Payment processing services
 *   - Financial reporting systems
 */
/**
 * File: /reuse/financial/accounts-payable-management-kit.ts
 * Locator: WC-FIN-AP-001
 * Purpose: Enterprise-grade Accounts Payable Management - vendor invoices, payment processing, three-way matching, 1099 reporting, aging analysis
 *
 * Upstream: Independent utility module for AP financial operations
 * Downstream: ../backend/financial/*, AP controllers, vendor services, payment processors, reporting modules
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 45+ functions for AP operations competing with USACE CEFMS enterprise financial management
 *
 * LLM Context: Comprehensive accounts payable utilities for production-ready financial applications.
 * Provides vendor invoice management, payment processing, three-way matching (PO/receipt/invoice), early payment discounts,
 * payment terms enforcement, 1099 reporting, aging analysis, vendor performance tracking, payment batch processing,
 * ACH/wire transfers, check printing, invoice dispute management, approval workflows, and audit trail compliance.
 */
import { Sequelize, Transaction } from 'sequelize';
interface VendorInvoiceData {
    vendorId: string;
    invoiceNumber: string;
    invoiceDate: Date;
    dueDate: Date;
    amount: number;
    taxAmount?: number;
    discountAmount?: number;
    purchaseOrderId?: string;
    receiptId?: string;
    description?: string;
    glAccountCode?: string;
    approvalStatus?: 'pending' | 'approved' | 'rejected';
    metadata?: Record<string, any>;
}
interface PaymentTerms {
    termCode: string;
    description: string;
    netDays: number;
    discountDays?: number;
    discountPercent?: number;
    isActive: boolean;
}
interface ThreeWayMatchResult {
    matched: boolean;
    poAmount: number;
    receiptQuantity: number;
    invoiceAmount: number;
    variance: number;
    variancePercent: number;
    issues: string[];
    matchedAt?: Date;
}
interface PaymentBatchData {
    batchNumber: string;
    paymentDate: Date;
    paymentMethod: 'ach' | 'wire' | 'check' | 'credit_card';
    totalAmount: number;
    invoiceIds: string[];
    bankAccountId: string;
    approvedBy: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
}
interface AgingBucket {
    bucket: string;
    daysStart: number;
    daysEnd: number | null;
    count: number;
    amount: number;
    percentage: number;
}
interface VendorPerformance {
    vendorId: string;
    vendorName: string;
    totalInvoices: number;
    totalAmount: number;
    averagePaymentDays: number;
    onTimePaymentRate: number;
    discountsCaptured: number;
    discountsMissed: number;
    disputeRate: number;
    qualityScore: number;
}
interface Form1099Data {
    vendorId: string;
    taxYear: number;
    ein: string;
    businessName: string;
    address: string;
    totalPayments: number;
    box1Rents?: number;
    box2Royalties?: number;
    box3OtherIncome?: number;
    box7NonemployeeCompensation?: number;
    federalTaxWithheld?: number;
}
interface InvoiceApprovalWorkflow {
    invoiceId: string;
    workflowSteps: ApprovalStep[];
    currentStepIndex: number;
    status: 'pending' | 'in_progress' | 'approved' | 'rejected';
    submittedAt: Date;
    completedAt?: Date;
}
interface ApprovalStep {
    stepNumber: number;
    approverRole: string;
    approverId?: string;
    approvalStatus: 'pending' | 'approved' | 'rejected';
    approvalDate?: Date;
    comments?: string;
    threshold?: number;
}
interface PaymentScheduleEntry {
    invoiceId: string;
    scheduledDate: Date;
    amount: number;
    priority: number;
    paymentMethod: string;
    status: 'scheduled' | 'processing' | 'completed' | 'cancelled';
}
interface VendorStatement {
    vendorId: string;
    statementDate: Date;
    openingBalance: number;
    invoices: VendorInvoiceData[];
    payments: PaymentData[];
    closingBalance: number;
    agingBuckets: AgingBucket[];
}
interface PaymentData {
    paymentId: string;
    invoiceId: string;
    amount: number;
    paymentDate: Date;
    paymentMethod: string;
    checkNumber?: string;
    confirmationNumber?: string;
}
interface EarlyPaymentDiscount {
    invoiceId: string;
    discountPercent: number;
    discountAmount: number;
    discountDeadline: Date;
    paymentAmount: number;
    savingsAmount: number;
}
interface APAuditEntry {
    entityType: 'invoice' | 'payment' | 'vendor' | 'batch';
    entityId: string;
    action: 'create' | 'update' | 'delete' | 'approve' | 'reject' | 'pay';
    userId: string;
    timestamp: Date;
    changes: Record<string, any>;
    ipAddress?: string;
}
/**
 * Sequelize model for Vendor Invoices with approval workflow and three-way matching.
 *
 * @swagger
 * @openapi
 * components:
 *   schemas:
 *     VendorInvoice:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         vendorId:
 *           type: string
 *         invoiceNumber:
 *           type: string
 *         amount:
 *           type: number
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} VendorInvoice model
 *
 * @example
 * ```typescript
 * const VendorInvoice = createVendorInvoiceModel(sequelize);
 * const invoice = await VendorInvoice.create({
 *   vendorId: 'VND001',
 *   invoiceNumber: 'INV-2024-001',
 *   invoiceDate: new Date(),
 *   dueDate: new Date(Date.now() + 30 * 86400000),
 *   amount: 5000.00,
 *   approvalStatus: 'pending'
 * });
 * ```
 */
export declare const createVendorInvoiceModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        vendorId: string;
        invoiceNumber: string;
        invoiceDate: Date;
        dueDate: Date;
        amount: number;
        taxAmount: number;
        discountAmount: number;
        netAmount: number;
        purchaseOrderId: string | null;
        receiptId: string | null;
        description: string;
        glAccountCode: string;
        approvalStatus: string;
        approvedBy: string | null;
        approvedAt: Date | null;
        paymentStatus: string;
        paidAmount: number;
        paymentDate: Date | null;
        threeWayMatchStatus: string;
        matchedAt: Date | null;
        disputeStatus: string | null;
        disputeReason: string | null;
        fiscalYear: number;
        fiscalPeriod: number;
        form1099Reportable: boolean;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for AP Payments with batch processing and reconciliation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} APPayment model
 *
 * @example
 * ```typescript
 * const APPayment = createAPPaymentModel(sequelize);
 * const payment = await APPayment.create({
 *   paymentBatchId: 'BATCH-2024-001',
 *   invoiceId: 'INV-001',
 *   amount: 5000.00,
 *   paymentDate: new Date(),
 *   paymentMethod: 'ach',
 *   status: 'completed'
 * });
 * ```
 */
export declare const createAPPaymentModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        paymentBatchId: string;
        invoiceId: string;
        vendorId: string;
        amount: number;
        paymentDate: Date;
        paymentMethod: string;
        checkNumber: string | null;
        achTraceNumber: string | null;
        wireConfirmation: string | null;
        bankAccountId: string;
        status: string;
        processedAt: Date | null;
        clearedAt: Date | null;
        reconciledAt: Date | null;
        voidedAt: Date | null;
        voidReason: string | null;
        discountTaken: number;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for AP Audit Trail with HIPAA compliance.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} APAuditLog model
 */
export declare const createAPAuditLogModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        entityType: string;
        entityId: string;
        action: string;
        userId: string;
        userName: string;
        changes: Record<string, any>;
        ipAddress: string;
        userAgent: string;
        readonly createdAt: Date;
    };
};
/**
 * Creates a new vendor invoice with validation and audit trail.
 *
 * @param {VendorInvoiceData} invoiceData - Invoice data
 * @param {Model} VendorInvoice - VendorInvoice model
 * @param {string} userId - User creating invoice
 * @param {Transaction} [transaction] - Optional Sequelize transaction
 * @returns {Promise<any>} Created invoice
 *
 * @example
 * ```typescript
 * const invoice = await createVendorInvoice({
 *   vendorId: 'VND001',
 *   invoiceNumber: 'INV-2024-001',
 *   invoiceDate: new Date(),
 *   dueDate: new Date(Date.now() + 30 * 86400000),
 *   amount: 5000.00
 * }, VendorInvoice, 'user123');
 * ```
 */
export declare const createVendorInvoice: (invoiceData: VendorInvoiceData, VendorInvoice: any, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Validates invoice data against business rules and vendor settings.
 *
 * @param {VendorInvoiceData} invoiceData - Invoice data to validate
 * @returns {Promise<{ valid: boolean; errors: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const result = await validateInvoiceData(invoiceData);
 * if (!result.valid) {
 *   throw new Error(result.errors.join(', '));
 * }
 * ```
 */
export declare const validateInvoiceData: (invoiceData: VendorInvoiceData) => Promise<{
    valid: boolean;
    errors: string[];
}>;
/**
 * Checks for duplicate invoices from the same vendor.
 *
 * @param {string} vendorId - Vendor identifier
 * @param {string} invoiceNumber - Invoice number
 * @param {Model} VendorInvoice - VendorInvoice model
 * @returns {Promise<boolean>} True if duplicate exists
 *
 * @example
 * ```typescript
 * const isDuplicate = await checkDuplicateInvoice('VND001', 'INV-123', VendorInvoice);
 * if (isDuplicate) throw new Error('Duplicate invoice');
 * ```
 */
export declare const checkDuplicateInvoice: (vendorId: string, invoiceNumber: string, VendorInvoice: any) => Promise<boolean>;
/**
 * Applies payment terms to calculate discount and net amount.
 *
 * @param {number} amount - Gross amount
 * @param {PaymentTerms} terms - Payment terms
 * @param {Date} invoiceDate - Invoice date
 * @param {Date} paymentDate - Planned payment date
 * @returns {EarlyPaymentDiscount} Discount calculation
 *
 * @example
 * ```typescript
 * const discount = calculatePaymentTermsDiscount(
 *   5000,
 *   { netDays: 30, discountDays: 10, discountPercent: 2 },
 *   new Date(),
 *   new Date(Date.now() + 5 * 86400000)
 * );
 * ```
 */
export declare const calculatePaymentTermsDiscount: (amount: number, terms: PaymentTerms, invoiceDate: Date, paymentDate: Date) => EarlyPaymentDiscount;
/**
 * Updates invoice approval status with workflow tracking.
 *
 * @param {string} invoiceId - Invoice ID
 * @param {string} status - New approval status
 * @param {string} userId - Approver user ID
 * @param {Model} VendorInvoice - VendorInvoice model
 * @param {string} [comments] - Approval comments
 * @returns {Promise<any>} Updated invoice
 *
 * @example
 * ```typescript
 * await updateInvoiceApprovalStatus('inv123', 'approved', 'user456', VendorInvoice);
 * ```
 */
export declare const updateInvoiceApprovalStatus: (invoiceId: string, status: "approved" | "rejected", userId: string, VendorInvoice: any, comments?: string) => Promise<any>;
/**
 * Retrieves invoices pending approval for a specific approver.
 *
 * @param {string} approverRole - Approver role
 * @param {number} [limit=50] - Max results
 * @param {Model} VendorInvoice - VendorInvoice model
 * @returns {Promise<any[]>} Pending invoices
 *
 * @example
 * ```typescript
 * const pending = await getInvoicesPendingApproval('manager', 100, VendorInvoice);
 * ```
 */
export declare const getInvoicesPendingApproval: (approverRole: string, limit: number | undefined, VendorInvoice: any) => Promise<any[]>;
/**
 * Marks invoice as disputed with reason tracking.
 *
 * @param {string} invoiceId - Invoice ID
 * @param {string} reason - Dispute reason
 * @param {string} userId - User disputing invoice
 * @param {Model} VendorInvoice - VendorInvoice model
 * @returns {Promise<any>} Updated invoice
 *
 * @example
 * ```typescript
 * await disputeInvoice('inv123', 'Incorrect pricing', 'user789', VendorInvoice);
 * ```
 */
export declare const disputeInvoice: (invoiceId: string, reason: string, userId: string, VendorInvoice: any) => Promise<any>;
/**
 * Resolves invoice dispute and updates status.
 *
 * @param {string} invoiceId - Invoice ID
 * @param {string} resolution - Resolution notes
 * @param {string} userId - User resolving dispute
 * @param {Model} VendorInvoice - VendorInvoice model
 * @returns {Promise<any>} Updated invoice
 *
 * @example
 * ```typescript
 * await resolveInvoiceDispute('inv123', 'Pricing corrected', 'user789', VendorInvoice);
 * ```
 */
export declare const resolveInvoiceDispute: (invoiceId: string, resolution: string, userId: string, VendorInvoice: any) => Promise<any>;
/**
 * Performs three-way match between PO, receipt, and invoice.
 *
 * @param {string} invoiceId - Invoice ID
 * @param {any} poData - Purchase order data
 * @param {any} receiptData - Receipt data
 * @param {number} [varianceThreshold=0.05] - Allowable variance (5%)
 * @returns {Promise<ThreeWayMatchResult>} Match result
 *
 * @example
 * ```typescript
 * const matchResult = await performThreeWayMatch('inv123', poData, receiptData, 0.05);
 * if (!matchResult.matched) {
 *   console.log('Match failed:', matchResult.issues);
 * }
 * ```
 */
export declare const performThreeWayMatch: (invoiceId: string, poData: any, receiptData: any, varianceThreshold?: number) => Promise<ThreeWayMatchResult>;
/**
 * Updates invoice three-way match status.
 *
 * @param {string} invoiceId - Invoice ID
 * @param {ThreeWayMatchResult} matchResult - Match result
 * @param {Model} VendorInvoice - VendorInvoice model
 * @returns {Promise<any>} Updated invoice
 *
 * @example
 * ```typescript
 * await updateThreeWayMatchStatus('inv123', matchResult, VendorInvoice);
 * ```
 */
export declare const updateThreeWayMatchStatus: (invoiceId: string, matchResult: ThreeWayMatchResult, VendorInvoice: any) => Promise<any>;
/**
 * Retrieves invoices requiring three-way matching.
 *
 * @param {Model} VendorInvoice - VendorInvoice model
 * @returns {Promise<any[]>} Invoices requiring matching
 *
 * @example
 * ```typescript
 * const invoices = await getInvoicesRequiringMatch(VendorInvoice);
 * ```
 */
export declare const getInvoicesRequiringMatch: (VendorInvoice: any) => Promise<any[]>;
/**
 * Processes match variances for exceptions handling.
 *
 * @param {ThreeWayMatchResult} matchResult - Match result with variances
 * @param {string} userId - User processing variance
 * @returns {Promise<{ approved: boolean; reason: string }>} Variance decision
 *
 * @example
 * ```typescript
 * const decision = await processMatchVariance(matchResult, 'user123');
 * ```
 */
export declare const processMatchVariance: (matchResult: ThreeWayMatchResult, userId: string) => Promise<{
    approved: boolean;
    reason: string;
}>;
/**
 * Creates payment batch for multiple invoices.
 *
 * @param {PaymentBatchData} batchData - Payment batch data
 * @param {Model} APPayment - APPayment model
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Created payments
 *
 * @example
 * ```typescript
 * const payments = await createPaymentBatch({
 *   batchNumber: 'BATCH-2024-001',
 *   paymentDate: new Date(),
 *   paymentMethod: 'ach',
 *   totalAmount: 50000,
 *   invoiceIds: ['inv1', 'inv2'],
 *   bankAccountId: 'bank123',
 *   approvedBy: 'user456',
 *   status: 'pending'
 * }, APPayment);
 * ```
 */
export declare const createPaymentBatch: (batchData: PaymentBatchData, APPayment: any, transaction?: Transaction) => Promise<any[]>;
/**
 * Processes ACH payment for vendor invoice.
 *
 * @param {string} paymentId - Payment ID
 * @param {any} bankingService - Banking service for ACH
 * @param {Model} APPayment - APPayment model
 * @returns {Promise<{ success: boolean; traceNumber?: string; error?: string }>} Process result
 *
 * @example
 * ```typescript
 * const result = await processACHPayment('pay123', bankingService, APPayment);
 * ```
 */
export declare const processACHPayment: (paymentId: string, bankingService: any, APPayment: any) => Promise<{
    success: boolean;
    traceNumber?: string;
    error?: string;
}>;
/**
 * Processes wire transfer for vendor payment.
 *
 * @param {string} paymentId - Payment ID
 * @param {any} bankingService - Banking service
 * @param {Model} APPayment - APPayment model
 * @returns {Promise<{ success: boolean; confirmation?: string; error?: string }>} Process result
 *
 * @example
 * ```typescript
 * const result = await processWireTransfer('pay123', bankingService, APPayment);
 * ```
 */
export declare const processWireTransfer: (paymentId: string, bankingService: any, APPayment: any) => Promise<{
    success: boolean;
    confirmation?: string;
    error?: string;
}>;
/**
 * Generates and prints check for payment.
 *
 * @param {string} paymentId - Payment ID
 * @param {string} checkNumber - Check number
 * @param {Model} APPayment - APPayment model
 * @returns {Promise<{ success: boolean; checkNumber: string }>} Print result
 *
 * @example
 * ```typescript
 * const result = await printCheck('pay123', 'CHK-10001', APPayment);
 * ```
 */
export declare const printCheck: (paymentId: string, checkNumber: string, APPayment: any) => Promise<{
    success: boolean;
    checkNumber: string;
}>;
/**
 * Voids a payment and updates related invoice.
 *
 * @param {string} paymentId - Payment ID
 * @param {string} reason - Void reason
 * @param {string} userId - User voiding payment
 * @param {Model} APPayment - APPayment model
 * @param {Model} VendorInvoice - VendorInvoice model
 * @returns {Promise<any>} Voided payment
 *
 * @example
 * ```typescript
 * await voidPayment('pay123', 'Duplicate payment', 'user456', APPayment, VendorInvoice);
 * ```
 */
export declare const voidPayment: (paymentId: string, reason: string, userId: string, APPayment: any, VendorInvoice: any) => Promise<any>;
/**
 * Reconciles payment with bank statement.
 *
 * @param {string} paymentId - Payment ID
 * @param {Date} clearedDate - Bank clearing date
 * @param {Model} APPayment - APPayment model
 * @returns {Promise<any>} Reconciled payment
 *
 * @example
 * ```typescript
 * await reconcilePayment('pay123', new Date(), APPayment);
 * ```
 */
export declare const reconcilePayment: (paymentId: string, clearedDate: Date, APPayment: any) => Promise<any>;
/**
 * Retrieves payment schedule for upcoming dates.
 *
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Model} VendorInvoice - VendorInvoice model
 * @returns {Promise<PaymentScheduleEntry[]>} Scheduled payments
 *
 * @example
 * ```typescript
 * const schedule = await getPaymentSchedule(new Date(), futureDate, VendorInvoice);
 * ```
 */
export declare const getPaymentSchedule: (startDate: Date, endDate: Date, VendorInvoice: any) => Promise<PaymentScheduleEntry[]>;
/**
 * Calculates optimal payment date considering discounts.
 *
 * @param {any} invoice - Invoice data
 * @param {PaymentTerms} terms - Payment terms
 * @param {Date} [currentDate=new Date()] - Current date
 * @returns {{ optimalDate: Date; reason: string; savings: number }} Optimal payment date
 *
 * @example
 * ```typescript
 * const optimal = calculateOptimalPaymentDate(invoice, terms);
 * console.log(`Pay on ${optimal.optimalDate} to save ${optimal.savings}`);
 * ```
 */
export declare const calculateOptimalPaymentDate: (invoice: any, terms: PaymentTerms, currentDate?: Date) => {
    optimalDate: Date;
    reason: string;
    savings: number;
};
/**
 * Generates AP aging report by vendor.
 *
 * @param {Date} [asOfDate=new Date()] - Report date
 * @param {Model} VendorInvoice - VendorInvoice model
 * @returns {Promise<Map<string, AgingBucket[]>>} Aging by vendor
 *
 * @example
 * ```typescript
 * const agingReport = await generateAPAgingReport(new Date(), VendorInvoice);
 * agingReport.forEach((buckets, vendorId) => {
 *   console.log(`Vendor ${vendorId}:`, buckets);
 * });
 * ```
 */
export declare const generateAPAgingReport: (asOfDate: Date | undefined, VendorInvoice: any) => Promise<Map<string, AgingBucket[]>>;
/**
 * Calculates aging buckets for a single vendor.
 *
 * @param {string} vendorId - Vendor identifier
 * @param {Date} asOfDate - Report date
 * @param {Model} VendorInvoice - VendorInvoice model
 * @returns {Promise<AgingBucket[]>} Aging buckets
 *
 * @example
 * ```typescript
 * const buckets = await calculateVendorAgingBuckets('VND001', new Date(), VendorInvoice);
 * ```
 */
export declare const calculateVendorAgingBuckets: (vendorId: string, asOfDate: Date, VendorInvoice: any) => Promise<AgingBucket[]>;
/**
 * Identifies overdue invoices requiring attention.
 *
 * @param {number} [daysOverdue=30] - Days past due threshold
 * @param {Model} VendorInvoice - VendorInvoice model
 * @returns {Promise<any[]>} Overdue invoices
 *
 * @example
 * ```typescript
 * const overdue = await getOverdueInvoices(30, VendorInvoice);
 * ```
 */
export declare const getOverdueInvoices: (daysOverdue: number | undefined, VendorInvoice: any) => Promise<any[]>;
/**
 * Exports aging report to CSV format.
 *
 * @param {Map<string, AgingBucket[]>} agingData - Aging data by vendor
 * @returns {string} CSV formatted report
 *
 * @example
 * ```typescript
 * const csv = exportAgingReportCSV(agingData);
 * fs.writeFileSync('aging-report.csv', csv);
 * ```
 */
export declare const exportAgingReportCSV: (agingData: Map<string, AgingBucket[]>) => string;
/**
 * Generates Form 1099 data for a vendor for tax year.
 *
 * @param {string} vendorId - Vendor identifier
 * @param {number} taxYear - Tax year
 * @param {Model} APPayment - APPayment model
 * @returns {Promise<Form1099Data>} 1099 data
 *
 * @example
 * ```typescript
 * const data1099 = await generate1099Data('VND001', 2024, APPayment);
 * ```
 */
export declare const generate1099Data: (vendorId: string, taxYear: number, APPayment: any) => Promise<Form1099Data>;
/**
 * Identifies vendors requiring 1099 reporting.
 *
 * @param {number} taxYear - Tax year
 * @param {number} [threshold=600] - Reporting threshold
 * @param {Model} APPayment - APPayment model
 * @returns {Promise<string[]>} Vendor IDs requiring 1099
 *
 * @example
 * ```typescript
 * const vendors = await get1099RequiredVendors(2024, 600, APPayment);
 * ```
 */
export declare const get1099RequiredVendors: (taxYear: number, threshold: number | undefined, APPayment: any) => Promise<string[]>;
/**
 * Exports 1099 data in IRS electronic filing format.
 *
 * @param {Form1099Data[]} data1099 - Array of 1099 data
 * @returns {string} IRS format file content
 *
 * @example
 * ```typescript
 * const irsFile = export1099ElectronicFile(data1099Array);
 * ```
 */
export declare const export1099ElectronicFile: (data1099: Form1099Data[]) => string;
/**
 * Validates vendor 1099 eligibility and completeness.
 *
 * @param {string} vendorId - Vendor identifier
 * @param {any} vendorData - Vendor data with tax info
 * @returns {{ eligible: boolean; issues: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const validation = validate1099Eligibility('VND001', vendorData);
 * if (!validation.eligible) {
 *   console.log('Issues:', validation.issues);
 * }
 * ```
 */
export declare const validate1099Eligibility: (vendorId: string, vendorData: any) => {
    eligible: boolean;
    issues: string[];
};
/**
 * Calculates vendor performance metrics.
 *
 * @param {string} vendorId - Vendor identifier
 * @param {Model} VendorInvoice - VendorInvoice model
 * @param {Model} APPayment - APPayment model
 * @returns {Promise<VendorPerformance>} Performance metrics
 *
 * @example
 * ```typescript
 * const performance = await calculateVendorPerformance('VND001', VendorInvoice, APPayment);
 * console.log(`Quality score: ${performance.qualityScore}`);
 * ```
 */
export declare const calculateVendorPerformance: (vendorId: string, VendorInvoice: any, APPayment: any) => Promise<VendorPerformance>;
/**
 * Generates vendor scorecard for evaluation.
 *
 * @param {VendorPerformance} performance - Performance metrics
 * @returns {{ grade: string; strengths: string[]; improvements: string[] }} Scorecard
 *
 * @example
 * ```typescript
 * const scorecard = generateVendorScorecard(performance);
 * console.log(`Grade: ${scorecard.grade}`);
 * ```
 */
export declare const generateVendorScorecard: (performance: VendorPerformance) => {
    grade: string;
    strengths: string[];
    improvements: string[];
};
/**
 * Ranks vendors by performance metrics.
 *
 * @param {VendorPerformance[]} performances - Array of vendor performances
 * @param {string} [metric='qualityScore'] - Ranking metric
 * @returns {VendorPerformance[]} Ranked vendors
 *
 * @example
 * ```typescript
 * const ranked = rankVendorsByPerformance(performances, 'qualityScore');
 * ```
 */
export declare const rankVendorsByPerformance: (performances: VendorPerformance[], metric?: keyof VendorPerformance) => VendorPerformance[];
/**
 * Identifies vendors requiring attention based on performance.
 *
 * @param {VendorPerformance[]} performances - Vendor performances
 * @param {number} [thresholdScore=60] - Quality score threshold
 * @returns {VendorPerformance[]} Vendors requiring attention
 *
 * @example
 * ```typescript
 * const attention = identifyVendorsRequiringAttention(performances, 60);
 * ```
 */
export declare const identifyVendorsRequiringAttention: (performances: VendorPerformance[], thresholdScore?: number) => VendorPerformance[];
/**
 * Generates vendor statement for a period.
 *
 * @param {string} vendorId - Vendor identifier
 * @param {Date} startDate - Period start date
 * @param {Date} endDate - Period end date
 * @param {Model} VendorInvoice - VendorInvoice model
 * @param {Model} APPayment - APPayment model
 * @returns {Promise<VendorStatement>} Vendor statement
 *
 * @example
 * ```typescript
 * const statement = await generateVendorStatement('VND001', startDate, endDate, VendorInvoice, APPayment);
 * ```
 */
export declare const generateVendorStatement: (vendorId: string, startDate: Date, endDate: Date, VendorInvoice: any, APPayment: any) => Promise<VendorStatement>;
/**
 * Reconciles vendor statement with internal records.
 *
 * @param {VendorStatement} ourStatement - Our statement
 * @param {VendorStatement} vendorStatement - Vendor's statement
 * @returns {{ matched: boolean; discrepancies: any[] }} Reconciliation result
 *
 * @example
 * ```typescript
 * const result = reconcileVendorStatement(ourStatement, vendorStatement);
 * if (!result.matched) {
 *   console.log('Discrepancies:', result.discrepancies);
 * }
 * ```
 */
export declare const reconcileVendorStatement: (ourStatement: VendorStatement, vendorStatement: VendorStatement) => {
    matched: boolean;
    discrepancies: any[];
};
/**
 * Exports vendor statement to PDF format.
 *
 * @param {VendorStatement} statement - Vendor statement
 * @returns {Promise<Buffer>} PDF buffer
 *
 * @example
 * ```typescript
 * const pdf = await exportVendorStatementPDF(statement);
 * fs.writeFileSync('statement.pdf', pdf);
 * ```
 */
export declare const exportVendorStatementPDF: (statement: VendorStatement) => Promise<Buffer>;
/**
 * Sends vendor statement via email.
 *
 * @param {VendorStatement} statement - Vendor statement
 * @param {string} vendorEmail - Vendor email address
 * @param {any} emailService - Email service
 * @returns {Promise<{ sent: boolean; messageId?: string }>} Send result
 *
 * @example
 * ```typescript
 * await sendVendorStatementEmail(statement, 'vendor@example.com', emailService);
 * ```
 */
export declare const sendVendorStatementEmail: (statement: VendorStatement, vendorEmail: string, emailService: any) => Promise<{
    sent: boolean;
    messageId?: string;
}>;
/**
 * Creates multi-step approval workflow for invoice.
 *
 * @param {string} invoiceId - Invoice ID
 * @param {number} amount - Invoice amount
 * @returns {InvoiceApprovalWorkflow} Approval workflow
 *
 * @example
 * ```typescript
 * const workflow = createApprovalWorkflow('inv123', 50000);
 * ```
 */
export declare const createApprovalWorkflow: (invoiceId: string, amount: number) => InvoiceApprovalWorkflow;
/**
 * Processes approval step in workflow.
 *
 * @param {InvoiceApprovalWorkflow} workflow - Approval workflow
 * @param {number} stepNumber - Step number
 * @param {boolean} approved - Approval decision
 * @param {string} approverId - Approver user ID
 * @param {string} [comments] - Approval comments
 * @returns {InvoiceApprovalWorkflow} Updated workflow
 *
 * @example
 * ```typescript
 * const updated = processApprovalStep(workflow, 1, true, 'user123', 'Approved');
 * ```
 */
export declare const processApprovalStep: (workflow: InvoiceApprovalWorkflow, stepNumber: number, approved: boolean, approverId: string, comments?: string) => InvoiceApprovalWorkflow;
/**
 * Routes invoice to appropriate approver based on rules.
 *
 * @param {any} invoice - Invoice data
 * @param {InvoiceApprovalWorkflow} workflow - Workflow
 * @returns {string} Approver role
 *
 * @example
 * ```typescript
 * const approver = routeToApprover(invoice, workflow);
 * console.log(`Route to: ${approver}`);
 * ```
 */
export declare const routeToApprover: (invoice: any, workflow: InvoiceApprovalWorkflow) => string;
/**
 * Retrieves approval history for invoice.
 *
 * @param {string} invoiceId - Invoice ID
 * @param {Model} APAuditLog - APAuditLog model
 * @returns {Promise<any[]>} Approval history
 *
 * @example
 * ```typescript
 * const history = await getApprovalHistory('inv123', APAuditLog);
 * ```
 */
export declare const getApprovalHistory: (invoiceId: string, APAuditLog: any) => Promise<any[]>;
/**
 * Logs audit event for AP operations.
 *
 * @param {APAuditEntry} auditData - Audit entry data
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await logAuditEvent({
 *   entityType: 'payment',
 *   entityId: 'pay123',
 *   action: 'create',
 *   userId: 'user456',
 *   changes: { amount: 5000 }
 * });
 * ```
 */
export declare const logAuditEvent: (auditData: APAuditEntry) => Promise<void>;
/**
 * Generates compliance report for audit period.
 *
 * @param {Date} startDate - Period start
 * @param {Date} endDate - Period end
 * @param {Model} VendorInvoice - VendorInvoice model
 * @param {Model} APPayment - APPayment model
 * @returns {Promise<any>} Compliance report
 *
 * @example
 * ```typescript
 * const report = await generateComplianceReport(startDate, endDate, VendorInvoice, APPayment);
 * ```
 */
export declare const generateComplianceReport: (startDate: Date, endDate: Date, VendorInvoice: any, APPayment: any) => Promise<any>;
/**
 * Validates SOX compliance for AP transactions.
 *
 * @param {string} transactionId - Transaction ID
 * @param {string} type - Transaction type
 * @returns {Promise<{ compliant: boolean; issues: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const sox = await validateSOXCompliance('pay123', 'payment');
 * ```
 */
export declare const validateSOXCompliance: (transactionId: string, type: "invoice" | "payment") => Promise<{
    compliant: boolean;
    issues: string[];
}>;
/**
 * Exports audit trail for external auditors.
 *
 * @param {Date} startDate - Period start
 * @param {Date} endDate - Period end
 * @param {Model} APAuditLog - APAuditLog model
 * @returns {Promise<string>} Audit trail CSV
 *
 * @example
 * ```typescript
 * const csv = await exportAuditTrail(startDate, endDate, APAuditLog);
 * ```
 */
export declare const exportAuditTrail: (startDate: Date, endDate: Date, APAuditLog: any) => Promise<string>;
/**
 * Detects anomalies in AP transactions for fraud prevention.
 *
 * @param {Model} VendorInvoice - VendorInvoice model
 * @param {Model} APPayment - APPayment model
 * @returns {Promise<any[]>} Detected anomalies
 *
 * @example
 * ```typescript
 * const anomalies = await detectAPAnomalies(VendorInvoice, APPayment);
 * anomalies.forEach(a => console.log(`Anomaly: ${a.type} - ${a.description}`));
 * ```
 */
export declare const detectAPAnomalies: (VendorInvoice: any, APPayment: any) => Promise<any[]>;
/**
 * NestJS Injectable service for Accounts Payable management.
 *
 * @example
 * ```typescript
 * @Controller('ap')
 * export class APController {
 *   constructor(private readonly apService: AccountsPayableService) {}
 *
 *   @Post('invoices')
 *   async createInvoice(@Body() data: VendorInvoiceData) {
 *     return this.apService.createInvoice(data);
 *   }
 * }
 * ```
 */
export declare class AccountsPayableService {
    private readonly sequelize;
    constructor(sequelize: Sequelize);
    createInvoice(data: VendorInvoiceData, userId: string): Promise<any>;
    generateAgingReport(asOfDate?: Date): Promise<Map<string, AgingBucket[]>>;
    processPaymentBatch(batchData: PaymentBatchData): Promise<any[]>;
    generate1099Reports(taxYear: number): Promise<Form1099Data[]>;
}
/**
 * Default export with all AP utilities.
 */
declare const _default: {
    createVendorInvoiceModel: (sequelize: Sequelize) => {
        new (): {
            id: string;
            vendorId: string;
            invoiceNumber: string;
            invoiceDate: Date;
            dueDate: Date;
            amount: number;
            taxAmount: number;
            discountAmount: number;
            netAmount: number;
            purchaseOrderId: string | null;
            receiptId: string | null;
            description: string;
            glAccountCode: string;
            approvalStatus: string;
            approvedBy: string | null;
            approvedAt: Date | null;
            paymentStatus: string;
            paidAmount: number;
            paymentDate: Date | null;
            threeWayMatchStatus: string;
            matchedAt: Date | null;
            disputeStatus: string | null;
            disputeReason: string | null;
            fiscalYear: number;
            fiscalPeriod: number;
            form1099Reportable: boolean;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createAPPaymentModel: (sequelize: Sequelize) => {
        new (): {
            id: string;
            paymentBatchId: string;
            invoiceId: string;
            vendorId: string;
            amount: number;
            paymentDate: Date;
            paymentMethod: string;
            checkNumber: string | null;
            achTraceNumber: string | null;
            wireConfirmation: string | null;
            bankAccountId: string;
            status: string;
            processedAt: Date | null;
            clearedAt: Date | null;
            reconciledAt: Date | null;
            voidedAt: Date | null;
            voidReason: string | null;
            discountTaken: number;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createAPAuditLogModel: (sequelize: Sequelize) => {
        new (): {
            id: string;
            entityType: string;
            entityId: string;
            action: string;
            userId: string;
            userName: string;
            changes: Record<string, any>;
            ipAddress: string;
            userAgent: string;
            readonly createdAt: Date;
        };
    };
    createVendorInvoice: (invoiceData: VendorInvoiceData, VendorInvoice: any, userId: string, transaction?: Transaction) => Promise<any>;
    validateInvoiceData: (invoiceData: VendorInvoiceData) => Promise<{
        valid: boolean;
        errors: string[];
    }>;
    checkDuplicateInvoice: (vendorId: string, invoiceNumber: string, VendorInvoice: any) => Promise<boolean>;
    calculatePaymentTermsDiscount: (amount: number, terms: PaymentTerms, invoiceDate: Date, paymentDate: Date) => EarlyPaymentDiscount;
    updateInvoiceApprovalStatus: (invoiceId: string, status: "approved" | "rejected", userId: string, VendorInvoice: any, comments?: string) => Promise<any>;
    getInvoicesPendingApproval: (approverRole: string, limit: number | undefined, VendorInvoice: any) => Promise<any[]>;
    disputeInvoice: (invoiceId: string, reason: string, userId: string, VendorInvoice: any) => Promise<any>;
    resolveInvoiceDispute: (invoiceId: string, resolution: string, userId: string, VendorInvoice: any) => Promise<any>;
    performThreeWayMatch: (invoiceId: string, poData: any, receiptData: any, varianceThreshold?: number) => Promise<ThreeWayMatchResult>;
    updateThreeWayMatchStatus: (invoiceId: string, matchResult: ThreeWayMatchResult, VendorInvoice: any) => Promise<any>;
    getInvoicesRequiringMatch: (VendorInvoice: any) => Promise<any[]>;
    processMatchVariance: (matchResult: ThreeWayMatchResult, userId: string) => Promise<{
        approved: boolean;
        reason: string;
    }>;
    createPaymentBatch: (batchData: PaymentBatchData, APPayment: any, transaction?: Transaction) => Promise<any[]>;
    processACHPayment: (paymentId: string, bankingService: any, APPayment: any) => Promise<{
        success: boolean;
        traceNumber?: string;
        error?: string;
    }>;
    processWireTransfer: (paymentId: string, bankingService: any, APPayment: any) => Promise<{
        success: boolean;
        confirmation?: string;
        error?: string;
    }>;
    printCheck: (paymentId: string, checkNumber: string, APPayment: any) => Promise<{
        success: boolean;
        checkNumber: string;
    }>;
    voidPayment: (paymentId: string, reason: string, userId: string, APPayment: any, VendorInvoice: any) => Promise<any>;
    reconcilePayment: (paymentId: string, clearedDate: Date, APPayment: any) => Promise<any>;
    getPaymentSchedule: (startDate: Date, endDate: Date, VendorInvoice: any) => Promise<PaymentScheduleEntry[]>;
    calculateOptimalPaymentDate: (invoice: any, terms: PaymentTerms, currentDate?: Date) => {
        optimalDate: Date;
        reason: string;
        savings: number;
    };
    generateAPAgingReport: (asOfDate: Date | undefined, VendorInvoice: any) => Promise<Map<string, AgingBucket[]>>;
    calculateVendorAgingBuckets: (vendorId: string, asOfDate: Date, VendorInvoice: any) => Promise<AgingBucket[]>;
    getOverdueInvoices: (daysOverdue: number | undefined, VendorInvoice: any) => Promise<any[]>;
    exportAgingReportCSV: (agingData: Map<string, AgingBucket[]>) => string;
    generate1099Data: (vendorId: string, taxYear: number, APPayment: any) => Promise<Form1099Data>;
    get1099RequiredVendors: (taxYear: number, threshold: number | undefined, APPayment: any) => Promise<string[]>;
    export1099ElectronicFile: (data1099: Form1099Data[]) => string;
    validate1099Eligibility: (vendorId: string, vendorData: any) => {
        eligible: boolean;
        issues: string[];
    };
    calculateVendorPerformance: (vendorId: string, VendorInvoice: any, APPayment: any) => Promise<VendorPerformance>;
    generateVendorScorecard: (performance: VendorPerformance) => {
        grade: string;
        strengths: string[];
        improvements: string[];
    };
    rankVendorsByPerformance: (performances: VendorPerformance[], metric?: keyof VendorPerformance) => VendorPerformance[];
    identifyVendorsRequiringAttention: (performances: VendorPerformance[], thresholdScore?: number) => VendorPerformance[];
    generateVendorStatement: (vendorId: string, startDate: Date, endDate: Date, VendorInvoice: any, APPayment: any) => Promise<VendorStatement>;
    reconcileVendorStatement: (ourStatement: VendorStatement, vendorStatement: VendorStatement) => {
        matched: boolean;
        discrepancies: any[];
    };
    exportVendorStatementPDF: (statement: VendorStatement) => Promise<Buffer>;
    sendVendorStatementEmail: (statement: VendorStatement, vendorEmail: string, emailService: any) => Promise<{
        sent: boolean;
        messageId?: string;
    }>;
    createApprovalWorkflow: (invoiceId: string, amount: number) => InvoiceApprovalWorkflow;
    processApprovalStep: (workflow: InvoiceApprovalWorkflow, stepNumber: number, approved: boolean, approverId: string, comments?: string) => InvoiceApprovalWorkflow;
    routeToApprover: (invoice: any, workflow: InvoiceApprovalWorkflow) => string;
    getApprovalHistory: (invoiceId: string, APAuditLog: any) => Promise<any[]>;
    logAuditEvent: (auditData: APAuditEntry) => Promise<void>;
    generateComplianceReport: (startDate: Date, endDate: Date, VendorInvoice: any, APPayment: any) => Promise<any>;
    validateSOXCompliance: (transactionId: string, type: "invoice" | "payment") => Promise<{
        compliant: boolean;
        issues: string[];
    }>;
    exportAuditTrail: (startDate: Date, endDate: Date, APAuditLog: any) => Promise<string>;
    detectAPAnomalies: (VendorInvoice: any, APPayment: any) => Promise<any[]>;
    AccountsPayableService: typeof AccountsPayableService;
};
export default _default;
//# sourceMappingURL=accounts-payable-management-kit.d.ts.map