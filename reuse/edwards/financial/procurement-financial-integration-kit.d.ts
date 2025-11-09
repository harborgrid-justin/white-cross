/**
 * LOC: PROCFIN001
 * File: /reuse/edwards/financial/procurement-financial-integration-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (ORM for database operations)
 *   - @nestjs/common (NestJS framework)
 *   - @nestjs/swagger (API documentation)
 *   - ../../financial/general-ledger-operations-kit (GL integration)
 *   - ../../financial/accounts-payable-processing-kit (AP integration)
 *
 * DOWNSTREAM (imported by):
 *   - Backend procurement modules
 *   - Purchase order services
 *   - Receiving services
 *   - Invoice matching modules
 *   - Procurement analytics
 */
/**
 * File: /reuse/edwards/financial/procurement-financial-integration-kit.ts
 * Locator: WC-EDW-PROCFIN-001
 * Purpose: Comprehensive Procurement Financial Integration - JD Edwards EnterpriseOne-level procurement, PO management, receiving, matching, accruals
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, TypeScript 5.x, general-ledger-operations-kit, accounts-payable-processing-kit
 * Downstream: ../backend/procurement/*, Purchase Order Services, Receiving Services, Invoice Matching, Procurement Analytics
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+
 * Exports: 45+ functions for purchase orders, requisitions, receiving, PO matching, accruals, commitments, encumbrances, supplier invoices, procurement analytics
 *
 * LLM Context: Enterprise-grade procurement financial integration competing with Oracle JD Edwards EnterpriseOne.
 * Provides comprehensive purchase order lifecycle management, purchase requisitions, goods receiving,
 * three-way matching (PO-Receipt-Invoice), commitment accounting, encumbrance tracking, accrual management,
 * supplier invoice processing, procurement analytics, spend management, and procurement compliance.
 */
import { Sequelize, Transaction } from 'sequelize';
interface PurchaseRequisitionLine {
    lineId: number;
    requisitionId: number;
    lineNumber: number;
    itemCode: string;
    itemDescription: string;
    quantity: number;
    unitOfMeasure: string;
    unitPrice: number;
    lineAmount: number;
    accountCode: string;
    deliveryDate: Date;
    specifications: string;
    status: 'pending' | 'approved' | 'ordered' | 'cancelled';
}
interface PurchaseOrderLine {
    lineId: number;
    purchaseOrderId: number;
    lineNumber: number;
    itemCode: string;
    itemDescription: string;
    categoryCode: string;
    orderedQuantity: number;
    receivedQuantity: number;
    invoicedQuantity: number;
    unitOfMeasure: string;
    unitPrice: number;
    lineAmount: number;
    accountCode: string;
    costCenter: string;
    projectCode?: string;
    wbsCode?: string;
    deliveryDate: Date;
    status: 'open' | 'partial' | 'received' | 'closed' | 'cancelled';
    taxCode?: string;
    taxAmount: number;
}
interface GoodsReceiptLine {
    lineId: number;
    receiptId: number;
    lineNumber: number;
    poLineId: number;
    itemCode: string;
    itemDescription: string;
    receivedQuantity: number;
    acceptedQuantity: number;
    rejectedQuantity: number;
    unitOfMeasure: string;
    unitPrice: number;
    lineAmount: number;
    location: string;
    lotNumber?: string;
    serialNumber?: string;
    expiryDate?: Date;
}
interface ProcurementCommitment {
    commitmentId: number;
    commitmentNumber: string;
    commitmentDate: Date;
    commitmentType: 'purchase-order' | 'contract' | 'blanket-po';
    referenceNumber: string;
    supplierCode: string;
    fiscalYear: number;
    fiscalPeriod: number;
    accountCode: string;
    costCenter: string;
    projectCode?: string;
    originalAmount: number;
    committedAmount: number;
    liquidatedAmount: number;
    remainingAmount: number;
    status: 'active' | 'partial' | 'liquidated' | 'cancelled';
}
interface ProcurementEncumbrance {
    encumbranceId: number;
    encumbranceNumber: string;
    encumbranceDate: Date;
    documentType: 'requisition' | 'purchase-order';
    documentNumber: string;
    documentId: number;
    fiscalYear: number;
    fiscalPeriod: number;
    accountCode: string;
    costCenter: string;
    projectCode?: string;
    encumbranceAmount: number;
    relievedAmount: number;
    remainingAmount: number;
    status: 'active' | 'partial' | 'relieved' | 'reversed';
    glJournalEntryId?: number;
}
interface ProcurementAccrual {
    accrualId: number;
    accrualNumber: string;
    accrualDate: Date;
    accrualType: 'goods-received-not-invoiced' | 'services-received-not-invoiced' | 'prepayment';
    purchaseOrderId: number;
    receiptId?: number;
    fiscalYear: number;
    fiscalPeriod: number;
    accountCode: string;
    costCenter: string;
    projectCode?: string;
    accrualAmount: number;
    reversedAmount: number;
    remainingAmount: number;
    status: 'active' | 'partial' | 'reversed' | 'cleared';
    reversalDate?: Date;
    glJournalEntryId?: number;
}
interface SupplierInvoiceLine {
    lineId: number;
    invoiceId: number;
    lineNumber: number;
    poLineId?: number;
    itemCode: string;
    itemDescription: string;
    quantity: number;
    unitOfMeasure: string;
    unitPrice: number;
    lineAmount: number;
    accountCode: string;
    costCenter: string;
    projectCode?: string;
    taxCode?: string;
    taxAmount: number;
}
interface ProcurementAnalytics {
    analyticsId: number;
    analysisDate: Date;
    analysisPeriod: string;
    totalPOs: number;
    totalPOValue: number;
    totalReceipts: number;
    totalInvoices: number;
    totalInvoiceValue: number;
    averagePOValue: number;
    averageLeadTime: number;
    onTimeDeliveryRate: number;
    matchRate: number;
    exceptionRate: number;
    totalSavings: number;
    totalSpend: number;
    topSuppliers: Record<string, number>;
    topCategories: Record<string, number>;
}
interface SpendAnalysis {
    supplierId: string;
    supplierName: string;
    categoryCode: string;
    categoryName: string;
    fiscalYear: number;
    fiscalPeriod: number;
    poCount: number;
    totalSpend: number;
    averageOrderValue: number;
    percentOfTotalSpend: number;
    paymentTermsDays: number;
    averageLeadTimeDays: number;
}
interface SupplierPerformance {
    supplierId: string;
    supplierName: string;
    analysisDate: Date;
    totalOrders: number;
    onTimeDeliveries: number;
    lateDeliveries: number;
    onTimeDeliveryRate: number;
    qualityRejectionRate: number;
    averageLeadTime: number;
    totalSpend: number;
    priceVariancePercent: number;
    performanceScore: number;
    performanceRating: 'excellent' | 'good' | 'fair' | 'poor';
}
interface ProcurementCompliance {
    complianceId: number;
    complianceDate: Date;
    complianceType: 'po-required' | 'approval-limits' | 'three-way-match' | 'contract-compliance';
    documentType: string;
    documentNumber: string;
    documentId: number;
    complianceStatus: 'compliant' | 'non-compliant' | 'exception-approved';
    violationType?: string;
    violationDescription?: string;
    correctionRequired: boolean;
    correctedBy?: string;
    correctedDate?: Date;
}
export declare class CreatePurchaseRequisitionDto {
    requisitionDate: Date;
    requestorId: string;
    departmentCode: string;
    priority: string;
    requisitionType: string;
    costCenter: string;
    justification: string;
    lines: Partial<PurchaseRequisitionLine>[];
}
export declare class CreatePurchaseOrderDto {
    poDate: Date;
    supplierCode: string;
    buyerId: string;
    poType: string;
    currency?: string;
    paymentTerms: string;
    shipToLocation: string;
    requisitionId?: number;
    lines: Partial<PurchaseOrderLine>[];
}
export declare class CreateGoodsReceiptDto {
    receiptDate: Date;
    purchaseOrderId: number;
    receivedBy: string;
    warehouseCode: string;
    deliveryNote?: string;
    packingSlipNumber?: string;
    lines: Partial<GoodsReceiptLine>[];
}
export declare class CreateSupplierInvoiceDto {
    invoiceDate: Date;
    supplierCode: string;
    supplierInvoiceNumber: string;
    invoiceType: string;
    currency?: string;
    dueDate: Date;
    paymentTerms: string;
    purchaseOrderId?: number;
    lines: Partial<SupplierInvoiceLine>[];
}
export declare class PerformInvoiceMatchDto {
    purchaseOrderId: number;
    receiptId?: number;
    invoiceId: number;
    matchType: string;
    priceTolerancePercent?: number;
    quantityTolerancePercent?: number;
}
/**
 * Sequelize model for Purchase Requisitions with approval workflow.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} PurchaseRequisition model
 *
 * @example
 * ```typescript
 * const Requisition = createPurchaseRequisitionModel(sequelize);
 * const req = await Requisition.create({
 *   requisitionNumber: 'REQ-2024-001',
 *   requisitionDate: new Date(),
 *   requestorId: 'john.doe',
 *   departmentCode: 'ENG-100',
 *   status: 'draft'
 * });
 * ```
 */
export declare const createPurchaseRequisitionModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        requisitionNumber: string;
        requisitionDate: Date;
        requestorId: string;
        requestorName: string;
        departmentCode: string;
        priority: string;
        requisitionType: string;
        status: string;
        totalAmount: number;
        currency: string;
        approvedBy: string | null;
        approvedDate: Date | null;
        projectId: number | null;
        costCenter: string;
        justification: string;
        metadata: Record<string, any>;
        createdBy: string;
        updatedBy: string;
    };
};
/**
 * Sequelize model for Purchase Orders with comprehensive tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} PurchaseOrder model
 *
 * @example
 * ```typescript
 * const PO = createPurchaseOrderModel(sequelize);
 * const po = await PO.create({
 *   poNumber: 'PO-2024-001',
 *   poDate: new Date(),
 *   supplierCode: 'SUPP-001',
 *   buyerId: 'buyer1',
 *   status: 'draft'
 * });
 * ```
 */
export declare const createPurchaseOrderModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        poNumber: string;
        poDate: Date;
        supplierCode: string;
        supplierName: string;
        supplierSiteCode: string | null;
        buyerId: string;
        buyerName: string;
        poType: string;
        status: string;
        currency: string;
        exchangeRate: number;
        totalAmount: number;
        receivedAmount: number;
        invoicedAmount: number;
        paidAmount: number;
        paymentTerms: string;
        deliveryTerms: string;
        shipToLocation: string;
        billToLocation: string;
        requisitionId: number | null;
        projectId: number | null;
        contractNumber: string | null;
    };
};
/**
 * Creates a purchase requisition.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreatePurchaseRequisitionDto} reqData - Requisition data
 * @param {string} userId - User creating the requisition
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<PurchaseRequisition>} Created requisition
 *
 * @example
 * ```typescript
 * const req = await createPurchaseRequisition(sequelize, {
 *   requisitionDate: new Date(),
 *   requestorId: 'john.doe',
 *   departmentCode: 'ENG-100',
 *   priority: 'normal',
 *   requisitionType: 'goods',
 *   costCenter: 'CC-200',
 *   justification: 'Equipment replacement',
 *   lines: [{ itemCode: 'ITEM-001', quantity: 10, unitPrice: 100 }]
 * }, 'john.doe');
 * ```
 */
export declare const createPurchaseRequisition: (sequelize: Sequelize, reqData: CreatePurchaseRequisitionDto, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Approves a purchase requisition.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} requisitionId - Requisition ID
 * @param {string} userId - User approving
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await approvePurchaseRequisition(sequelize, 1, 'manager');
 * ```
 */
export declare const approvePurchaseRequisition: (sequelize: Sequelize, requisitionId: number, userId: string, transaction?: Transaction) => Promise<void>;
/**
 * Converts requisition to purchase order.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} requisitionId - Requisition ID
 * @param {string} supplierCode - Supplier code
 * @param {string} buyerId - Buyer user ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<PurchaseOrder>} Created purchase order
 *
 * @example
 * ```typescript
 * const po = await convertRequisitionToPO(sequelize, 1, 'SUPP-001', 'buyer1');
 * ```
 */
export declare const convertRequisitionToPO: (sequelize: Sequelize, requisitionId: number, supplierCode: string, buyerId: string, transaction?: Transaction) => Promise<any>;
/**
 * Retrieves requisitions by status.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} status - Requisition status
 * @returns {Promise<PurchaseRequisition[]>} Requisitions
 *
 * @example
 * ```typescript
 * const pendingReqs = await getRequisitionsByStatus(sequelize, 'submitted');
 * ```
 */
export declare const getRequisitionsByStatus: (sequelize: Sequelize, status: string) => Promise<any[]>;
/**
 * Creates a purchase order.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreatePurchaseOrderDto} poData - PO data
 * @param {string} userId - User creating the PO
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<PurchaseOrder>} Created purchase order
 *
 * @example
 * ```typescript
 * const po = await createPurchaseOrder(sequelize, {
 *   poDate: new Date(),
 *   supplierCode: 'SUPP-001',
 *   buyerId: 'buyer1',
 *   poType: 'standard',
 *   paymentTerms: 'Net 30',
 *   shipToLocation: 'WH-001',
 *   lines: [{ itemCode: 'ITEM-001', orderedQuantity: 10, unitPrice: 100 }]
 * }, 'buyer1');
 * ```
 */
export declare const createPurchaseOrder: (sequelize: Sequelize, poData: CreatePurchaseOrderDto, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Approves and issues a purchase order.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} poId - PO ID
 * @param {string} userId - User approving
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await approvePurchaseOrder(sequelize, 1, 'manager');
 * ```
 */
export declare const approvePurchaseOrder: (sequelize: Sequelize, poId: number, userId: string, transaction?: Transaction) => Promise<void>;
/**
 * Closes a purchase order.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} poId - PO ID
 * @param {string} userId - User closing
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await closePurchaseOrder(sequelize, 1, 'buyer1');
 * ```
 */
export declare const closePurchaseOrder: (sequelize: Sequelize, poId: number, userId: string, transaction?: Transaction) => Promise<void>;
/**
 * Retrieves purchase orders by supplier.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} supplierCode - Supplier code
 * @returns {Promise<PurchaseOrder[]>} Purchase orders
 *
 * @example
 * ```typescript
 * const supplierPOs = await getPurchaseOrdersBySupplier(sequelize, 'SUPP-001');
 * ```
 */
export declare const getPurchaseOrdersBySupplier: (sequelize: Sequelize, supplierCode: string) => Promise<any[]>;
/**
 * Retrieves open purchase order lines for receiving.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} poId - PO ID
 * @returns {Promise<PurchaseOrderLine[]>} Open PO lines
 *
 * @example
 * ```typescript
 * const openLines = await getOpenPOLines(sequelize, 1);
 * ```
 */
export declare const getOpenPOLines: (sequelize: Sequelize, poId: number) => Promise<any[]>;
/**
 * Creates a goods receipt for a purchase order.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateGoodsReceiptDto} receiptData - Receipt data
 * @param {string} userId - User creating receipt
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<GoodsReceipt>} Created receipt
 *
 * @example
 * ```typescript
 * const receipt = await createGoodsReceipt(sequelize, {
 *   receiptDate: new Date(),
 *   purchaseOrderId: 1,
 *   receivedBy: 'receiver1',
 *   warehouseCode: 'WH-001',
 *   lines: [{ poLineId: 1, receivedQuantity: 10, acceptedQuantity: 10 }]
 * }, 'receiver1');
 * ```
 */
export declare const createGoodsReceipt: (sequelize: Sequelize, receiptData: CreateGoodsReceiptDto, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Confirms a goods receipt.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} receiptId - Receipt ID
 * @param {string} userId - User confirming
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await confirmGoodsReceipt(sequelize, 1, 'receiver1');
 * ```
 */
export declare const confirmGoodsReceipt: (sequelize: Sequelize, receiptId: number, userId: string, transaction?: Transaction) => Promise<void>;
/**
 * Retrieves goods receipts for a purchase order.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} poId - PO ID
 * @returns {Promise<GoodsReceipt[]>} Receipts
 *
 * @example
 * ```typescript
 * const receipts = await getReceiptsByPO(sequelize, 1);
 * ```
 */
export declare const getReceiptsByPO: (sequelize: Sequelize, poId: number) => Promise<any[]>;
/**
 * Performs three-way matching (PO-Receipt-Invoice).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {PerformInvoiceMatchDto} matchData - Match data
 * @param {string} userId - User performing match
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<InvoiceMatch>} Match result
 *
 * @example
 * ```typescript
 * const match = await performInvoiceMatch(sequelize, {
 *   purchaseOrderId: 1,
 *   receiptId: 1,
 *   invoiceId: 1,
 *   matchType: 'three-way',
 *   priceTolerancePercent: 5,
 *   quantityTolerancePercent: 2
 * }, 'ap_clerk');
 * ```
 */
export declare const performInvoiceMatch: (sequelize: Sequelize, matchData: PerformInvoiceMatchDto, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Approves invoice match exception.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} matchId - Match ID
 * @param {string} userId - User approving
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await approveMatchException(sequelize, 1, 'manager');
 * ```
 */
export declare const approveMatchException: (sequelize: Sequelize, matchId: number, userId: string, transaction?: Transaction) => Promise<void>;
/**
 * Retrieves invoice matches with exceptions.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<InvoiceMatch[]>} Exception matches
 *
 * @example
 * ```typescript
 * const exceptions = await getMatchExceptions(sequelize);
 * ```
 */
export declare const getMatchExceptions: (sequelize: Sequelize) => Promise<any[]>;
/**
 * Creates procurement commitment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Partial<ProcurementCommitment>} commitmentData - Commitment data
 * @param {string} userId - User creating commitment
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<ProcurementCommitment>} Created commitment
 *
 * @example
 * ```typescript
 * const commitment = await createCommitment(sequelize, {
 *   commitmentType: 'purchase-order',
 *   referenceNumber: 'PO-2024-001',
 *   supplierCode: 'SUPP-001',
 *   originalAmount: 100000
 * }, 'buyer1');
 * ```
 */
export declare const createCommitment: (sequelize: Sequelize, commitmentData: Partial<ProcurementCommitment>, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Liquidates commitment (reduce committed amount).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} commitmentId - Commitment ID
 * @param {number} amount - Amount to liquidate
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await liquidateCommitment(sequelize, 1, 50000);
 * ```
 */
export declare const liquidateCommitment: (sequelize: Sequelize, commitmentId: number, amount: number, transaction?: Transaction) => Promise<void>;
/**
 * Creates procurement encumbrance.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Partial<ProcurementEncumbrance>} encumbranceData - Encumbrance data
 * @param {string} userId - User creating encumbrance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<ProcurementEncumbrance>} Created encumbrance
 *
 * @example
 * ```typescript
 * const encumbrance = await createEncumbrance(sequelize, {
 *   documentType: 'purchase-order',
 *   documentNumber: 'PO-2024-001',
 *   documentId: 1,
 *   encumbranceAmount: 100000
 * }, 'buyer1');
 * ```
 */
export declare const createEncumbrance: (sequelize: Sequelize, encumbranceData: Partial<ProcurementEncumbrance>, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Relieves encumbrance (reduce encumbered amount).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} encumbranceId - Encumbrance ID
 * @param {number} amount - Amount to relieve
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await relieveEncumbrance(sequelize, 1, 50000);
 * ```
 */
export declare const relieveEncumbrance: (sequelize: Sequelize, encumbranceId: number, amount: number, transaction?: Transaction) => Promise<void>;
/**
 * Creates procurement accrual (GRNI, etc.).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Partial<ProcurementAccrual>} accrualData - Accrual data
 * @param {string} userId - User creating accrual
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<ProcurementAccrual>} Created accrual
 *
 * @example
 * ```typescript
 * const accrual = await createAccrual(sequelize, {
 *   accrualType: 'goods-received-not-invoiced',
 *   purchaseOrderId: 1,
 *   receiptId: 1,
 *   accrualAmount: 50000
 * }, 'ap_clerk');
 * ```
 */
export declare const createAccrual: (sequelize: Sequelize, accrualData: Partial<ProcurementAccrual>, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Reverses accrual when invoice is received.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} accrualId - Accrual ID
 * @param {number} amount - Amount to reverse
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await reverseAccrual(sequelize, 1, 50000);
 * ```
 */
export declare const reverseAccrual: (sequelize: Sequelize, accrualId: number, amount: number, transaction?: Transaction) => Promise<void>;
/**
 * Retrieves active accruals (GRNI).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<ProcurementAccrual[]>} Active accruals
 *
 * @example
 * ```typescript
 * const accruals = await getActiveAccruals(sequelize);
 * ```
 */
export declare const getActiveAccruals: (sequelize: Sequelize) => Promise<any[]>;
/**
 * Creates supplier invoice.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateSupplierInvoiceDto} invoiceData - Invoice data
 * @param {string} userId - User creating invoice
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<SupplierInvoice>} Created invoice
 *
 * @example
 * ```typescript
 * const invoice = await createSupplierInvoice(sequelize, {
 *   invoiceDate: new Date(),
 *   supplierCode: 'SUPP-001',
 *   supplierInvoiceNumber: 'INV-2024-001',
 *   invoiceType: 'standard',
 *   dueDate: new Date('2024-02-24'),
 *   paymentTerms: 'Net 30',
 *   lines: [{ itemCode: 'ITEM-001', quantity: 10, unitPrice: 100 }]
 * }, 'ap_clerk');
 * ```
 */
export declare const createSupplierInvoice: (sequelize: Sequelize, invoiceData: CreateSupplierInvoiceDto, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Approves supplier invoice for payment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} invoiceId - Invoice ID
 * @param {string} userId - User approving
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await approveSupplierInvoice(sequelize, 1, 'ap_manager');
 * ```
 */
export declare const approveSupplierInvoice: (sequelize: Sequelize, invoiceId: number, userId: string, transaction?: Transaction) => Promise<void>;
/**
 * Retrieves invoices by status.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} status - Invoice status
 * @returns {Promise<SupplierInvoice[]>} Invoices
 *
 * @example
 * ```typescript
 * const pendingInvoices = await getInvoicesByStatus(sequelize, 'pending');
 * ```
 */
export declare const getInvoicesByStatus: (sequelize: Sequelize, status: string) => Promise<any[]>;
/**
 * Generates procurement analytics dashboard.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<ProcurementAnalytics>} Analytics data
 *
 * @example
 * ```typescript
 * const analytics = await generateProcurementAnalytics(sequelize, new Date('2024-01-01'), new Date('2024-12-31'));
 * ```
 */
export declare const generateProcurementAnalytics: (sequelize: Sequelize, startDate: Date, endDate: Date) => Promise<ProcurementAnalytics>;
/**
 * Performs spend analysis by supplier and category.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @returns {Promise<SpendAnalysis[]>} Spend analysis
 *
 * @example
 * ```typescript
 * const spendAnalysis = await performSpendAnalysis(sequelize, 2024);
 * ```
 */
export declare const performSpendAnalysis: (sequelize: Sequelize, fiscalYear: number) => Promise<SpendAnalysis[]>;
/**
 * Analyzes supplier performance metrics.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} supplierCode - Supplier code
 * @returns {Promise<SupplierPerformance>} Performance metrics
 *
 * @example
 * ```typescript
 * const performance = await analyzeSupplierPerformance(sequelize, 'SUPP-001');
 * ```
 */
export declare const analyzeSupplierPerformance: (sequelize: Sequelize, supplierCode: string) => Promise<SupplierPerformance>;
/**
 * Calculates procurement savings.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @returns {Promise<number>} Total savings
 *
 * @example
 * ```typescript
 * const savings = await calculateProcurementSavings(sequelize, 2024);
 * ```
 */
export declare const calculateProcurementSavings: (sequelize: Sequelize, fiscalYear: number) => Promise<number>;
/**
 * Monitors procurement compliance.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<ProcurementCompliance[]>} Compliance report
 *
 * @example
 * ```typescript
 * const compliance = await monitorProcurementCompliance(sequelize, new Date('2024-01-01'), new Date('2024-12-31'));
 * ```
 */
export declare const monitorProcurementCompliance: (sequelize: Sequelize, startDate: Date, endDate: Date) => Promise<ProcurementCompliance[]>;
/**
 * Generates procurement KPI dashboard.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @returns {Promise<Record<string, number>>} KPI metrics
 *
 * @example
 * ```typescript
 * const kpis = await generateProcurementKPIs(sequelize, 2024, 1);
 * console.log(`PO Cycle Time: ${kpis.poCycleTime} days`);
 * ```
 */
export declare const generateProcurementKPIs: (sequelize: Sequelize, fiscalYear: number, fiscalPeriod: number) => Promise<Record<string, number>>;
export {};
//# sourceMappingURL=procurement-financial-integration-kit.d.ts.map