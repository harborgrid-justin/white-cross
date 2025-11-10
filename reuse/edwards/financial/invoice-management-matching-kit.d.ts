/**
 * LOC: INVMGMT001
 * File: /reuse/edwards/financial/invoice-management-matching-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (ORM for database operations)
 *   - @nestjs/common (NestJS framework)
 *   - @nestjs/swagger (API documentation)
 *   - multer (File upload handling)
 *   - sharp (Image processing)
 *
 * DOWNSTREAM (imported by):
 *   - Backend invoice modules
 *   - Accounts payable services
 *   - Payment processing services
 *   - Procurement modules
 */
/**
 * File: /reuse/edwards/financial/invoice-management-matching-kit.ts
 * Locator: WC-EDWARDS-INVMGMT-001
 * Purpose: Comprehensive Invoice Management & Matching - JD Edwards EnterpriseOne-level invoice capture, validation, three-way matching, approval workflows
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, TypeScript 5.x, Multer 1.x, Sharp 0.32.x
 * Downstream: ../backend/invoices/*, Accounts Payable Services, Payment Processing, Procurement
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+, Multer 1.x, Sharp 0.32.x
 * Exports: 45 functions for invoice capture, validation, three-way matching, two-way matching, approval workflows, holds, disputes, routing, image processing, OCR integration
 *
 * LLM Context: Enterprise-grade invoice management for JD Edwards EnterpriseOne compliance.
 * Provides comprehensive invoice capture, automated validation, three-way matching (PO/Receipt/Invoice), two-way matching,
 * multi-level approval workflows, invoice holds and exceptions, dispute management, intelligent routing, image processing,
 * OCR integration, duplicate detection, tax validation, variance analysis, automated coding, audit trails,
 * and supplier portal integration.
 */
import { Sequelize, Transaction } from 'sequelize';
interface InvoiceLine {
    invoiceLineId: number;
    invoiceId: number;
    lineNumber: number;
    purchaseOrderLineId?: number;
    itemId?: number;
    itemCode?: string;
    itemDescription: string;
    quantity: number;
    unitOfMeasure: string;
    unitPrice: number;
    lineAmount: number;
    taxAmount: number;
    discountAmount: number;
    netAmount: number;
    accountCode: string;
    glAccountId: number;
    costCenterCode?: string;
    projectCode?: string;
    matchedQuantity: number;
    varianceAmount: number;
}
interface OCRResult {
    invoiceNumber?: string;
    invoiceDate?: string;
    dueDate?: string;
    supplierName?: string;
    supplierAddress?: string;
    totalAmount?: number;
    taxAmount?: number;
    lineItems?: Array<{
        description: string;
        quantity: number;
        unitPrice: number;
        amount: number;
    }>;
    confidence: number;
    rawData: Record<string, any>;
}
export declare class CreateInvoiceDto {
    invoiceNumber: string;
    invoiceDate: Date;
    dueDate: Date;
    supplierId: number;
    supplierSiteId: number;
    purchaseOrderId?: number;
    invoiceAmount: number;
    taxAmount?: number;
    shippingAmount?: number;
    discountAmount?: number;
    currency: string;
    lines: InvoiceLine[];
}
export declare class ValidateInvoiceDto {
    invoiceId: number;
    skipDuplicateCheck?: boolean;
    skipTaxValidation?: boolean;
}
export declare class PerformThreeWayMatchDto {
    invoiceId: number;
    purchaseOrderId: number;
    receiptId: number;
    autoApproveWithinTolerance?: boolean;
}
export declare class PerformTwoWayMatchDto {
    invoiceId: number;
    purchaseOrderId: number;
    autoApproveWithinTolerance?: boolean;
}
export declare class ApproveInvoiceDto {
    invoiceId: number;
    approvalLevel: number;
    comments?: string;
}
export declare class PlaceInvoiceHoldDto {
    invoiceId: number;
    holdType: string;
    holdReason: string;
    priority: string;
}
export declare class CreateInvoiceDisputeDto {
    invoiceId: number;
    disputeType: string;
    disputeReason: string;
    disputeAmount: number;
    notifySupplier?: boolean;
}
export declare class ProcessOCRDto {
    imageId: number;
    provider?: string;
    autoCreateInvoice?: boolean;
}
export declare class RouteInvoiceDto {
    invoiceId: number;
    targetRole: string;
    targetUser?: string;
    comments?: string;
}
/**
 * Sequelize model for Invoices with comprehensive tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Invoice model
 *
 * @example
 * ```typescript
 * const Invoice = createInvoiceModel(sequelize);
 * const invoice = await Invoice.create({
 *   invoiceNumber: 'INV-2024-001',
 *   invoiceDate: new Date(),
 *   supplierId: 100,
 *   invoiceAmount: 5000.00,
 *   status: 'draft'
 * });
 * ```
 */
export declare const createInvoiceModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        invoiceNumber: string;
        invoiceDate: Date;
        dueDate: Date;
        supplierId: number;
        supplierName: string;
        supplierSiteId: number;
        purchaseOrderId: number | null;
        purchaseOrderNumber: string | null;
        invoiceAmount: number;
        taxAmount: number;
        shippingAmount: number;
        discountAmount: number;
        netAmount: number;
        currency: string;
        exchangeRate: number;
        baseAmount: number;
        status: string;
        paymentStatus: string;
        matchingStatus: string;
        approvalStatus: string;
        hasImage: boolean;
        imageUrl: string | null;
        ocrProcessed: boolean;
        ocrConfidence: number | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
        readonly createdBy: string;
        readonly updatedBy: string;
    };
};
/**
 * Sequelize model for Invoice Lines with GL coding.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} InvoiceLine model
 *
 * @example
 * ```typescript
 * const InvoiceLine = createInvoiceLineModel(sequelize);
 * const line = await InvoiceLine.create({
 *   invoiceId: 1,
 *   lineNumber: 1,
 *   itemDescription: 'Office supplies',
 *   quantity: 10,
 *   unitPrice: 25.00
 * });
 * ```
 */
export declare const createInvoiceLineModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        invoiceId: number;
        lineNumber: number;
        purchaseOrderLineId: number | null;
        itemId: number | null;
        itemCode: string | null;
        itemDescription: string;
        quantity: number;
        unitOfMeasure: string;
        unitPrice: number;
        lineAmount: number;
        taxAmount: number;
        discountAmount: number;
        netAmount: number;
        accountCode: string;
        glAccountId: number;
        costCenterCode: string | null;
        projectCode: string | null;
        matchedQuantity: number;
        varianceAmount: number;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Creates a new invoice with lines.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateInvoiceDto} invoiceData - Invoice data
 * @param {string} userId - User creating the invoice
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created invoice
 *
 * @example
 * ```typescript
 * const invoice = await createInvoice(sequelize, {
 *   invoiceNumber: 'INV-2024-001',
 *   invoiceDate: new Date(),
 *   dueDate: new Date('2024-02-15'),
 *   supplierId: 100,
 *   supplierSiteId: 1,
 *   invoiceAmount: 5000.00,
 *   taxAmount: 400.00,
 *   currency: 'USD',
 *   lines: [...]
 * }, 'user123');
 * ```
 */
export declare const createInvoice: (sequelize: Sequelize, invoiceData: CreateInvoiceDto, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Retrieves supplier details.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} supplierId - Supplier ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Supplier details
 *
 * @example
 * ```typescript
 * const supplier = await getSupplierDetails(sequelize, 100);
 * console.log(supplier.name);
 * ```
 */
export declare const getSupplierDetails: (sequelize: Sequelize, supplierId: number, transaction?: Transaction) => Promise<any>;
/**
 * Validates an invoice against validation rules.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {ValidateInvoiceDto} validationData - Validation parameters
 * @param {string} userId - User performing validation
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<{isValid: boolean; errors: string[]; warnings: string[]}>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateInvoice(sequelize, {
 *   invoiceId: 1,
 *   skipDuplicateCheck: false
 * }, 'user123');
 * if (!validation.isValid) {
 *   console.log('Errors:', validation.errors);
 * }
 * ```
 */
export declare const validateInvoice: (sequelize: Sequelize, validationData: ValidateInvoiceDto, userId: string, transaction?: Transaction) => Promise<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
}>;
/**
 * Detects potential duplicate invoices.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} invoiceId - Invoice ID to check
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} List of potential duplicates
 *
 * @example
 * ```typescript
 * const duplicates = await detectDuplicateInvoices(sequelize, 1);
 * console.log(`Found ${duplicates.length} potential duplicates`);
 * ```
 */
export declare const detectDuplicateInvoices: (sequelize: Sequelize, invoiceId: number, transaction?: Transaction) => Promise<any[]>;
/**
 * Validates invoice tax amounts.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} invoiceId - Invoice ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<{isValid: boolean; message: string}>} Validation result
 *
 * @example
 * ```typescript
 * const taxValid = await validateInvoiceTax(sequelize, 1);
 * console.log(taxValid.message);
 * ```
 */
export declare const validateInvoiceTax: (sequelize: Sequelize, invoiceId: number, transaction?: Transaction) => Promise<{
    isValid: boolean;
    message: string;
}>;
/**
 * Gets applicable tax rate for supplier and date.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} supplierId - Supplier ID
 * @param {Date} invoiceDate - Invoice date
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Tax rate as decimal
 *
 * @example
 * ```typescript
 * const rate = await getApplicableTaxRate(sequelize, 100, new Date());
 * console.log(`Tax rate: ${rate * 100}%`);
 * ```
 */
export declare const getApplicableTaxRate: (sequelize: Sequelize, supplierId: number, invoiceDate: Date, transaction?: Transaction) => Promise<number>;
/**
 * Calculates invoice line totals.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} invoiceId - Invoice ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<{totalAmount: number; totalTax: number; totalNet: number}>} Line totals
 *
 * @example
 * ```typescript
 * const totals = await calculateInvoiceLineTotals(sequelize, 1);
 * console.log(totals.totalAmount);
 * ```
 */
export declare const calculateInvoiceLineTotals: (sequelize: Sequelize, invoiceId: number, transaction?: Transaction) => Promise<{
    totalAmount: number;
    totalTax: number;
    totalNet: number;
}>;
/**
 * Performs three-way matching (PO, Receipt, Invoice).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {PerformThreeWayMatchDto} matchData - Match parameters
 * @param {string} userId - User performing match
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Match results
 *
 * @example
 * ```typescript
 * const matches = await performThreeWayMatch(sequelize, {
 *   invoiceId: 1,
 *   purchaseOrderId: 10,
 *   receiptId: 5,
 *   autoApproveWithinTolerance: true
 * }, 'user123');
 * ```
 */
export declare const performThreeWayMatch: (sequelize: Sequelize, matchData: PerformThreeWayMatchDto, userId: string, transaction?: Transaction) => Promise<any[]>;
/**
 * Gets purchase order line details.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} purchaseOrderId - PO ID
 * @param {number} lineId - PO line ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} PO line details
 *
 * @example
 * ```typescript
 * const poLine = await getPurchaseOrderLine(sequelize, 10, 1);
 * console.log(poLine.unit_price);
 * ```
 */
export declare const getPurchaseOrderLine: (sequelize: Sequelize, purchaseOrderId: number, lineId: number, transaction?: Transaction) => Promise<any>;
/**
 * Gets receipt line details.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} receiptId - Receipt ID
 * @param {number} poLineId - PO line ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Receipt line details
 *
 * @example
 * ```typescript
 * const receiptLine = await getReceiptLine(sequelize, 5, 1);
 * console.log(receiptLine.quantity);
 * ```
 */
export declare const getReceiptLine: (sequelize: Sequelize, receiptId: number, poLineId: number, transaction?: Transaction) => Promise<any>;
/**
 * Gets matching tolerance settings.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} supplierId - Supplier ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Tolerance settings
 *
 * @example
 * ```typescript
 * const tolerance = await getMatchingTolerance(sequelize, 100);
 * console.log(tolerance.priceTolerance);
 * ```
 */
export declare const getMatchingTolerance: (sequelize: Sequelize, supplierId: number, transaction?: Transaction) => Promise<any>;
/**
 * Performs two-way matching (PO and Invoice only).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {PerformTwoWayMatchDto} matchData - Match parameters
 * @param {string} userId - User performing match
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Match results
 *
 * @example
 * ```typescript
 * const matches = await performTwoWayMatch(sequelize, {
 *   invoiceId: 1,
 *   purchaseOrderId: 10,
 *   autoApproveWithinTolerance: true
 * }, 'user123');
 * ```
 */
export declare const performTwoWayMatch: (sequelize: Sequelize, matchData: PerformTwoWayMatchDto, userId: string, transaction?: Transaction) => Promise<any[]>;
/**
 * Approves an invoice.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {ApproveInvoiceDto} approvalData - Approval data
 * @param {string} userId - User approving the invoice
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Approval record
 *
 * @example
 * ```typescript
 * const approval = await approveInvoice(sequelize, {
 *   invoiceId: 1,
 *   approvalLevel: 1,
 *   comments: 'Approved for payment'
 * }, 'manager123');
 * ```
 */
export declare const approveInvoice: (sequelize: Sequelize, approvalData: ApproveInvoiceDto, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Places a hold on an invoice.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {PlaceInvoiceHoldDto} holdData - Hold data
 * @param {string} userId - User placing the hold
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Hold record
 *
 * @example
 * ```typescript
 * const hold = await placeInvoiceHold(sequelize, {
 *   invoiceId: 1,
 *   holdType: 'validation',
 *   holdReason: 'Missing documentation',
 *   priority: 'high'
 * }, 'user123');
 * ```
 */
export declare const placeInvoiceHold: (sequelize: Sequelize, holdData: PlaceInvoiceHoldDto, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Releases a hold on an invoice.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} holdId - Hold ID
 * @param {string} releaseNotes - Release notes
 * @param {string} userId - User releasing the hold
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Released hold
 *
 * @example
 * ```typescript
 * const released = await releaseInvoiceHold(sequelize, 1, 'Documentation received', 'user123');
 * ```
 */
export declare const releaseInvoiceHold: (sequelize: Sequelize, holdId: number, releaseNotes: string, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Creates an invoice dispute.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateInvoiceDisputeDto} disputeData - Dispute data
 * @param {string} userId - User creating the dispute
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Dispute record
 *
 * @example
 * ```typescript
 * const dispute = await createInvoiceDispute(sequelize, {
 *   invoiceId: 1,
 *   disputeType: 'price',
 *   disputeReason: 'Price does not match PO',
 *   disputeAmount: 500.00,
 *   notifySupplier: true
 * }, 'user123');
 * ```
 */
export declare const createInvoiceDispute: (sequelize: Sequelize, disputeData: CreateInvoiceDisputeDto, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Routes invoice to specified role or user.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {RouteInvoiceDto} routingData - Routing data
 * @param {string} userId - User performing routing
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Routing record
 *
 * @example
 * ```typescript
 * const routing = await routeInvoice(sequelize, {
 *   invoiceId: 1,
 *   targetRole: 'accounts_payable',
 *   targetUser: 'ap_clerk_001',
 *   comments: 'Please review urgently'
 * }, 'user123');
 * ```
 */
export declare const routeInvoice: (sequelize: Sequelize, routingData: RouteInvoiceDto, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Uploads invoice image/document.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} invoiceId - Invoice ID
 * @param {any} file - Uploaded file
 * @param {string} userId - User uploading the file
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Image record
 *
 * @example
 * ```typescript
 * const image = await uploadInvoiceImage(sequelize, 1, file, 'user123');
 * console.log(image.filePath);
 * ```
 */
export declare const uploadInvoiceImage: (sequelize: Sequelize, invoiceId: number, file: any, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Processes invoice image with OCR.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {ProcessOCRDto} ocrData - OCR processing data
 * @param {string} userId - User initiating OCR
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<OCRResult>} OCR result
 *
 * @example
 * ```typescript
 * const ocrResult = await processInvoiceOCR(sequelize, {
 *   imageId: 1,
 *   provider: 'google',
 *   autoCreateInvoice: true
 * }, 'user123');
 * console.log(ocrResult.confidence);
 * ```
 */
export declare const processInvoiceOCR: (sequelize: Sequelize, ocrData: ProcessOCRDto, userId: string, transaction?: Transaction) => Promise<OCRResult>;
/**
 * Applies automated GL coding rules to invoice lines.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} invoiceId - Invoice ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await applyAutomatedCoding(sequelize, 1);
 * ```
 */
export declare const applyAutomatedCoding: (sequelize: Sequelize, invoiceId: number, transaction?: Transaction) => Promise<void>;
/**
 * Creates invoice audit trail entry.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} invoiceId - Invoice ID
 * @param {string} action - Action performed
 * @param {string} userId - User performing action
 * @param {Record<string, any>} oldValues - Old values
 * @param {Record<string, any>} newValues - New values
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Audit trail entry
 *
 * @example
 * ```typescript
 * await createInvoiceAuditTrail(sequelize, 1, 'APPROVE', 'user123',
 *   { status: 'pending' }, { status: 'approved' });
 * ```
 */
export declare const createInvoiceAuditTrail: (sequelize: Sequelize, invoiceId: number, action: string, userId: string, oldValues: Record<string, any>, newValues: Record<string, any>, transaction?: Transaction) => Promise<any>;
/**
 * Retrieves invoice history with audit trail.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} invoiceId - Invoice ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Invoice audit trail
 *
 * @example
 * ```typescript
 * const history = await getInvoiceHistory(sequelize, 1);
 * console.log(history.length);
 * ```
 */
export declare const getInvoiceHistory: (sequelize: Sequelize, invoiceId: number, transaction?: Transaction) => Promise<any[]>;
/**
 * Cancels an invoice.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} invoiceId - Invoice ID
 * @param {string} cancelReason - Cancellation reason
 * @param {string} userId - User cancelling the invoice
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Cancelled invoice
 *
 * @example
 * ```typescript
 * const cancelled = await cancelInvoice(sequelize, 1, 'Duplicate entry', 'user123');
 * ```
 */
export declare const cancelInvoice: (sequelize: Sequelize, invoiceId: number, cancelReason: string, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * NestJS Controller for Invoice operations.
 */
export declare class InvoicesController {
    private readonly sequelize;
    constructor(sequelize: Sequelize);
    create(createDto: CreateInvoiceDto, userId: string): Promise<any>;
    validate(id: number, userId: string): Promise<any>;
    approve(approvalDto: ApproveInvoiceDto, userId: string): Promise<any>;
    placeHold(holdDto: PlaceInvoiceHoldDto, userId: string): Promise<any>;
    getHistory(id: number): Promise<any[]>;
    uploadImage(id: number, file: Express.Multer.File, userId: string): Promise<any>;
}
/**
 * NestJS Controller for Invoice Matching operations.
 */
export declare class InvoiceMatchingController {
    private readonly sequelize;
    constructor(sequelize: Sequelize);
    threeWayMatch(matchDto: PerformThreeWayMatchDto, userId: string): Promise<any>;
    twoWayMatch(matchDto: PerformTwoWayMatchDto, userId: string): Promise<any>;
}
/**
 * NestJS Controller for Invoice Dispute operations.
 */
export declare class InvoiceDisputesController {
    private readonly sequelize;
    constructor(sequelize: Sequelize);
    create(disputeDto: CreateInvoiceDisputeDto, userId: string): Promise<any>;
}
export {};
//# sourceMappingURL=invoice-management-matching-kit.d.ts.map