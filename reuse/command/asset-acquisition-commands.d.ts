/**
 * ASSET ACQUISITION COMMAND FUNCTIONS
 *
 * Enterprise-grade asset procurement and acquisition management system competing with
 * Oracle JD Edwards EnterpriseOne. Provides comprehensive functionality for:
 * - Purchase requisition and approval workflows
 * - Vendor selection and RFQ/RFP processing
 * - Purchase order creation and management
 * - Contract lifecycle management
 * - Budget validation and tracking
 * - Asset receiving and inspection
 * - Asset tagging and registration
 * - Procurement analytics and reporting
 * - Multi-level approval routing
 * - Supplier performance tracking
 *
 * @module AssetAcquisitionCommands
 * @version 1.0.0
 * @requires @nestjs/common ^11.1.8
 * @requires @nestjs/swagger ^8.0.7
 * @requires @nestjs/sequelize ^10.0.1
 * @requires sequelize ^6.37.5
 * @requires sequelize-typescript ^2.1.6
 * @requires class-validator ^0.14.1
 * @requires class-transformer ^0.5.1
 *
 * @example
 * ```typescript
 * import {
 *   createPurchaseRequisition,
 *   createRFQ,
 *   createPurchaseOrder,
 *   receiveAsset,
 *   PurchaseRequisition,
 *   ApprovalStatus
 * } from './asset-acquisition-commands';
 *
 * // Create purchase requisition
 * const requisition = await createPurchaseRequisition({
 *   requestorId: 'user-123',
 *   departmentId: 'dept-456',
 *   items: [{
 *     assetTypeId: 'laptop-dell-xps',
 *     quantity: 10,
 *     estimatedUnitCost: 1500,
 *     justification: 'New employee onboarding'
 *   }],
 *   priority: PriorityLevel.HIGH
 * });
 *
 * // Create RFQ for vendor quotes
 * const rfq = await createRFQ({
 *   requisitionId: requisition.id,
 *   vendorIds: ['vendor-1', 'vendor-2', 'vendor-3'],
 *   responseDeadline: new Date('2024-06-01')
 * });
 * ```
 */
import { Model } from 'sequelize-typescript';
import { Transaction, FindOptions } from 'sequelize';
/**
 * Requisition approval status
 */
export declare enum ApprovalStatus {
    DRAFT = "draft",
    PENDING = "pending",
    APPROVED = "approved",
    REJECTED = "rejected",
    CANCELLED = "cancelled",
    ON_HOLD = "on_hold"
}
/**
 * Purchase order status
 */
export declare enum PurchaseOrderStatus {
    DRAFT = "draft",
    PENDING_APPROVAL = "pending_approval",
    APPROVED = "approved",
    ISSUED = "issued",
    PARTIALLY_RECEIVED = "partially_received",
    FULLY_RECEIVED = "fully_received",
    CLOSED = "closed",
    CANCELLED = "cancelled"
}
/**
 * RFQ/RFP status
 */
export declare enum RFQStatus {
    DRAFT = "draft",
    PUBLISHED = "published",
    IN_REVIEW = "in_review",
    AWARDED = "awarded",
    CANCELLED = "cancelled",
    EXPIRED = "expired"
}
/**
 * Priority levels
 */
export declare enum PriorityLevel {
    CRITICAL = "critical",
    HIGH = "high",
    MEDIUM = "medium",
    LOW = "low"
}
/**
 * Contract types
 */
export declare enum ContractType {
    PURCHASE_AGREEMENT = "purchase_agreement",
    BLANKET_ORDER = "blanket_order",
    SERVICE_CONTRACT = "service_contract",
    LEASE_AGREEMENT = "lease_agreement",
    MAINTENANCE_CONTRACT = "maintenance_contract",
    FRAMEWORK_AGREEMENT = "framework_agreement"
}
/**
 * Contract status
 */
export declare enum ContractStatus {
    DRAFT = "draft",
    UNDER_REVIEW = "under_review",
    ACTIVE = "active",
    EXPIRED = "expired",
    TERMINATED = "terminated",
    RENEWED = "renewed"
}
/**
 * Receiving status
 */
export declare enum ReceivingStatus {
    PENDING = "pending",
    IN_INSPECTION = "in_inspection",
    ACCEPTED = "accepted",
    REJECTED = "rejected",
    PARTIALLY_ACCEPTED = "partially_accepted"
}
/**
 * Inspection result
 */
export declare enum InspectionResult {
    PASSED = "passed",
    FAILED = "failed",
    CONDITIONAL = "conditional",
    REQUIRES_REWORK = "requires_rework"
}
/**
 * Vendor rating
 */
export declare enum VendorRating {
    EXCELLENT = "excellent",
    GOOD = "good",
    AVERAGE = "average",
    POOR = "poor",
    UNRATED = "unrated"
}
/**
 * Budget status
 */
export declare enum BudgetStatus {
    AVAILABLE = "available",
    RESERVED = "reserved",
    COMMITTED = "committed",
    SPENT = "spent",
    EXCEEDED = "exceeded"
}
/**
 * Payment terms
 */
export declare enum PaymentTerms {
    NET_30 = "net_30",
    NET_60 = "net_60",
    NET_90 = "net_90",
    IMMEDIATE = "immediate",
    ON_DELIVERY = "on_delivery",
    MILESTONE_BASED = "milestone_based"
}
/**
 * Purchase requisition item interface
 */
export interface PurchaseRequisitionItem {
    assetTypeId: string;
    description: string;
    quantity: number;
    estimatedUnitCost: number;
    justification?: string;
    specifications?: Record<string, any>;
    preferredVendorId?: string;
    accountCode?: string;
    deliveryDate?: Date;
}
/**
 * Purchase requisition data
 */
export interface PurchaseRequisitionData {
    requestorId: string;
    departmentId: string;
    items: PurchaseRequisitionItem[];
    priority: PriorityLevel;
    justification: string;
    budgetId?: string;
    projectId?: string;
    expectedDeliveryDate?: Date;
    notes?: string;
}
/**
 * RFQ creation data
 */
export interface RFQCreationData {
    requisitionId?: string;
    title: string;
    description: string;
    vendorIds: string[];
    items: RFQItem[];
    responseDeadline: Date;
    evaluationCriteria?: Record<string, any>;
    termsAndConditions?: string;
    attachments?: string[];
}
/**
 * RFQ item
 */
export interface RFQItem {
    assetTypeId: string;
    description: string;
    quantity: number;
    specifications: Record<string, any>;
    deliveryRequirements?: string;
}
/**
 * Vendor quote data
 */
export interface VendorQuoteData {
    rfqId: string;
    vendorId: string;
    items: QuoteItem[];
    totalAmount: number;
    validUntil: Date;
    paymentTerms: PaymentTerms;
    deliveryTimeframe: string;
    notes?: string;
    attachments?: string[];
}
/**
 * Quote item
 */
export interface QuoteItem {
    rfqItemId: string;
    unitPrice: number;
    quantity: number;
    leadTime: number;
    specifications?: Record<string, any>;
}
/**
 * Purchase order creation data
 */
export interface PurchaseOrderData {
    vendorId: string;
    requisitionId?: string;
    quoteId?: string;
    items: PurchaseOrderItem[];
    shippingAddress: string;
    billingAddress: string;
    paymentTerms: PaymentTerms;
    expectedDeliveryDate: Date;
    notes?: string;
    contractId?: string;
}
/**
 * Purchase order item
 */
export interface PurchaseOrderItem {
    assetTypeId: string;
    description: string;
    quantity: number;
    unitPrice: number;
    taxRate?: number;
    accountCode?: string;
    specifications?: Record<string, any>;
}
/**
 * Asset receiving data
 */
export interface AssetReceivingData {
    purchaseOrderId: string;
    receivedBy: string;
    receivedDate: Date;
    items: ReceivedItem[];
    packingSlipNumber?: string;
    trackingNumber?: string;
    notes?: string;
}
/**
 * Received item
 */
export interface ReceivedItem {
    poItemId: string;
    quantityReceived: number;
    condition: string;
    serialNumbers?: string[];
    inspectionNotes?: string;
}
/**
 * Inspection data
 */
export interface InspectionData {
    receivingId: string;
    inspectorId: string;
    inspectionDate: Date;
    items: InspectedItem[];
    overallResult: InspectionResult;
    notes?: string;
    photos?: string[];
    documents?: string[];
}
/**
 * Inspected item
 */
export interface InspectedItem {
    receivedItemId: string;
    result: InspectionResult;
    defects?: string[];
    measurements?: Record<string, any>;
    notes?: string;
}
/**
 * Contract data
 */
export interface ContractData {
    vendorId: string;
    contractType: ContractType;
    contractNumber: string;
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    value: number;
    paymentTerms: PaymentTerms;
    renewalOptions?: string;
    termsAndConditions: string;
    attachments?: string[];
}
/**
 * Budget allocation data
 */
export interface BudgetAllocationData {
    budgetId: string;
    departmentId: string;
    fiscalYear: number;
    amount: number;
    categoryCode: string;
    approvedBy: string;
    notes?: string;
}
/**
 * Approval workflow data
 */
export interface ApprovalWorkflowData {
    documentType: string;
    documentId: string;
    approvers: ApproverData[];
    sequenceRequired: boolean;
    notes?: string;
}
/**
 * Approver data
 */
export interface ApproverData {
    userId: string;
    level: number;
    required: boolean;
    delegateUserId?: string;
}
/**
 * Vendor Model - Supplier management
 */
export declare class Vendor extends Model {
    id: string;
    vendorCode: string;
    name: string;
    legalName?: string;
    taxId?: string;
    email?: string;
    phone?: string;
    website?: string;
    address?: string;
    rating: VendorRating;
    defaultPaymentTerms?: PaymentTerms;
    creditLimit?: number;
    isPreferred: boolean;
    isActive: boolean;
    certifications?: string[];
    performanceMetrics?: Record<string, any>;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    requisitions?: PurchaseRequisition[];
    purchaseOrders?: PurchaseOrder[];
    contracts?: Contract[];
}
/**
 * Purchase Requisition Model - Purchase requests
 */
export declare class PurchaseRequisition extends Model {
    id: string;
    requisitionNumber: string;
    requestorId: string;
    departmentId: string;
    budgetId?: string;
    projectId?: string;
    status: ApprovalStatus;
    priority: PriorityLevel;
    justification: string;
    items: PurchaseRequisitionItem[];
    totalEstimatedCost?: number;
    expectedDeliveryDate?: Date;
    approvedBy?: string;
    approvalDate?: Date;
    rejectionReason?: string;
    notes?: string;
    attachments?: string[];
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    rfqs?: RFQ[];
    purchaseOrders?: PurchaseOrder[];
    static generateRequisitionNumber(instance: PurchaseRequisition): Promise<void>;
    static calculateTotalCost(instance: PurchaseRequisition): void;
}
/**
 * RFQ Model - Request for Quotation
 */
export declare class RFQ extends Model {
    id: string;
    rfqNumber: string;
    requisitionId?: string;
    title: string;
    description: string;
    status: RFQStatus;
    vendorIds: string[];
    items: RFQItem[];
    responseDeadline: Date;
    evaluationCriteria?: Record<string, any>;
    termsAndConditions?: string;
    attachments?: string[];
    publishedDate?: Date;
    awardedVendorId?: string;
    awardDate?: Date;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    requisition?: PurchaseRequisition;
    quotes?: VendorQuote[];
    static generateRFQNumber(instance: RFQ): Promise<void>;
}
/**
 * Vendor Quote Model - Vendor responses to RFQs
 */
export declare class VendorQuote extends Model {
    id: string;
    quoteNumber: string;
    rfqId: string;
    vendorId: string;
    items: QuoteItem[];
    totalAmount: number;
    validUntil: Date;
    paymentTerms: PaymentTerms;
    deliveryTimeframe: string;
    notes?: string;
    attachments?: string[];
    evaluationScore?: number;
    isSelected: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    rfq?: RFQ;
    vendor?: Vendor;
    static generateQuoteNumber(instance: VendorQuote): Promise<void>;
}
/**
 * Purchase Order Model - Purchase orders
 */
export declare class PurchaseOrder extends Model {
    id: string;
    poNumber: string;
    vendorId: string;
    requisitionId?: string;
    quoteId?: string;
    contractId?: string;
    status: PurchaseOrderStatus;
    items: PurchaseOrderItem[];
    subtotal?: number;
    taxAmount?: number;
    totalAmount: number;
    shippingAddress: string;
    billingAddress: string;
    paymentTerms: PaymentTerms;
    expectedDeliveryDate: Date;
    issuedDate?: Date;
    approvedBy?: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    vendor?: Vendor;
    requisition?: PurchaseRequisition;
    quote?: VendorQuote;
    receivings?: AssetReceiving[];
    static generatePONumber(instance: PurchaseOrder): Promise<void>;
    static calculateTotals(instance: PurchaseOrder): void;
}
/**
 * Asset Receiving Model - Asset receipt tracking
 */
export declare class AssetReceiving extends Model {
    id: string;
    receivingNumber: string;
    purchaseOrderId: string;
    receivedBy: string;
    receivedDate: Date;
    status: ReceivingStatus;
    items: ReceivedItem[];
    packingSlipNumber?: string;
    trackingNumber?: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    purchaseOrder?: PurchaseOrder;
    inspections?: AssetInspection[];
    static generateReceivingNumber(instance: AssetReceiving): Promise<void>;
}
/**
 * Asset Inspection Model - Receipt inspection tracking
 */
export declare class AssetInspection extends Model {
    id: string;
    inspectionNumber: string;
    receivingId: string;
    inspectorId: string;
    inspectionDate: Date;
    items: InspectedItem[];
    overallResult: InspectionResult;
    notes?: string;
    photos?: string[];
    documents?: string[];
    createdAt: Date;
    updatedAt: Date;
    receiving?: AssetReceiving;
    static generateInspectionNumber(instance: AssetInspection): Promise<void>;
}
/**
 * Contract Model - Vendor contracts
 */
export declare class Contract extends Model {
    id: string;
    contractNumber: string;
    vendorId: string;
    contractType: ContractType;
    title: string;
    description: string;
    status: ContractStatus;
    startDate: Date;
    endDate: Date;
    value: number;
    paymentTerms: PaymentTerms;
    renewalOptions?: string;
    termsAndConditions: string;
    attachments?: string[];
    autoRenewal: boolean;
    notificationDays: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    vendor?: Vendor;
}
/**
 * Budget Model - Budget tracking
 */
export declare class Budget extends Model {
    id: string;
    departmentId: string;
    fiscalYear: number;
    categoryCode: string;
    allocatedAmount: number;
    reservedAmount: number;
    committedAmount: number;
    spentAmount: number;
    availableAmount?: number;
    status: BudgetStatus;
    approvedBy?: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    static calculateAvailable(instance: Budget): void;
}
/**
 * Approval Workflow Model - Approval routing
 */
export declare class ApprovalWorkflow extends Model {
    id: string;
    documentType: string;
    documentId: string;
    approvers: ApproverData[];
    currentApproverId?: string;
    currentLevel: number;
    status: ApprovalStatus;
    sequenceRequired: boolean;
    approvalHistory?: Array<{
        userId: string;
        action: string;
        timestamp: Date;
        comments?: string;
    }>;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Creates a new purchase requisition
 *
 * @param data - Requisition data
 * @param transaction - Optional database transaction
 * @returns Created purchase requisition
 *
 * @example
 * ```typescript
 * const requisition = await createPurchaseRequisition({
 *   requestorId: 'user-123',
 *   departmentId: 'dept-456',
 *   items: [{
 *     assetTypeId: 'laptop-dell',
 *     description: 'Dell XPS 15',
 *     quantity: 5,
 *     estimatedUnitCost: 1500,
 *     justification: 'New employee laptops'
 *   }],
 *   priority: PriorityLevel.HIGH,
 *   justification: 'Q1 hiring plan'
 * });
 * ```
 */
export declare function createPurchaseRequisition(data: PurchaseRequisitionData, transaction?: Transaction): Promise<PurchaseRequisition>;
/**
 * Submits requisition for approval
 *
 * @param requisitionId - Requisition identifier
 * @param transaction - Optional database transaction
 * @returns Updated requisition
 *
 * @example
 * ```typescript
 * await submitRequisitionForApproval('req-123');
 * ```
 */
export declare function submitRequisitionForApproval(requisitionId: string, transaction?: Transaction): Promise<PurchaseRequisition>;
/**
 * Approves a purchase requisition
 *
 * @param requisitionId - Requisition identifier
 * @param approverId - Approver user ID
 * @param comments - Optional approval comments
 * @param transaction - Optional database transaction
 * @returns Updated requisition
 *
 * @example
 * ```typescript
 * await approvePurchaseRequisition('req-123', 'manager-456', 'Approved for Q1 budget');
 * ```
 */
export declare function approvePurchaseRequisition(requisitionId: string, approverId: string, comments?: string, transaction?: Transaction): Promise<PurchaseRequisition>;
/**
 * Rejects a purchase requisition
 *
 * @param requisitionId - Requisition identifier
 * @param approverId - Approver user ID
 * @param reason - Rejection reason
 * @param transaction - Optional database transaction
 * @returns Updated requisition
 *
 * @example
 * ```typescript
 * await rejectPurchaseRequisition('req-123', 'manager-456', 'Budget not available');
 * ```
 */
export declare function rejectPurchaseRequisition(requisitionId: string, approverId: string, reason: string, transaction?: Transaction): Promise<PurchaseRequisition>;
/**
 * Gets purchase requisitions by status
 *
 * @param status - Requisition status
 * @param options - Query options
 * @returns Requisitions
 *
 * @example
 * ```typescript
 * const pending = await getRequisitionsByStatus(ApprovalStatus.PENDING);
 * ```
 */
export declare function getRequisitionsByStatus(status: ApprovalStatus, options?: FindOptions): Promise<PurchaseRequisition[]>;
/**
 * Gets requisitions by department
 *
 * @param departmentId - Department identifier
 * @param options - Query options
 * @returns Requisitions
 *
 * @example
 * ```typescript
 * const deptReqs = await getRequisitionsByDepartment('dept-123');
 * ```
 */
export declare function getRequisitionsByDepartment(departmentId: string, options?: FindOptions): Promise<PurchaseRequisition[]>;
/**
 * Updates purchase requisition
 *
 * @param requisitionId - Requisition identifier
 * @param updates - Fields to update
 * @param transaction - Optional database transaction
 * @returns Updated requisition
 *
 * @example
 * ```typescript
 * await updatePurchaseRequisition('req-123', {
 *   priority: PriorityLevel.CRITICAL,
 *   notes: 'Urgent requirement'
 * });
 * ```
 */
export declare function updatePurchaseRequisition(requisitionId: string, updates: Partial<PurchaseRequisition>, transaction?: Transaction): Promise<PurchaseRequisition>;
/**
 * Cancels a purchase requisition
 *
 * @param requisitionId - Requisition identifier
 * @param reason - Cancellation reason
 * @param transaction - Optional database transaction
 * @returns Updated requisition
 *
 * @example
 * ```typescript
 * await cancelPurchaseRequisition('req-123', 'Requirements changed');
 * ```
 */
export declare function cancelPurchaseRequisition(requisitionId: string, reason: string, transaction?: Transaction): Promise<PurchaseRequisition>;
/**
 * Creates a new RFQ
 *
 * @param data - RFQ data
 * @param transaction - Optional database transaction
 * @returns Created RFQ
 *
 * @example
 * ```typescript
 * const rfq = await createRFQ({
 *   title: 'Laptop Procurement RFQ',
 *   description: 'Request for quotes for 50 laptops',
 *   vendorIds: ['vendor-1', 'vendor-2'],
 *   items: [{
 *     assetTypeId: 'laptop-dell',
 *     description: 'Dell XPS 15 or equivalent',
 *     quantity: 50,
 *     specifications: { ram: '16GB', storage: '512GB SSD' }
 *   }],
 *   responseDeadline: new Date('2024-06-01')
 * });
 * ```
 */
export declare function createRFQ(data: RFQCreationData, transaction?: Transaction): Promise<RFQ>;
/**
 * Publishes an RFQ to vendors
 *
 * @param rfqId - RFQ identifier
 * @param transaction - Optional database transaction
 * @returns Updated RFQ
 *
 * @example
 * ```typescript
 * await publishRFQ('rfq-123');
 * ```
 */
export declare function publishRFQ(rfqId: string, transaction?: Transaction): Promise<RFQ>;
/**
 * Submits a vendor quote for an RFQ
 *
 * @param data - Quote data
 * @param transaction - Optional database transaction
 * @returns Created quote
 *
 * @example
 * ```typescript
 * const quote = await submitVendorQuote({
 *   rfqId: 'rfq-123',
 *   vendorId: 'vendor-456',
 *   items: [{
 *     rfqItemId: 'item-1',
 *     unitPrice: 1450,
 *     quantity: 50,
 *     leadTime: 14
 *   }],
 *   totalAmount: 72500,
 *   validUntil: new Date('2024-07-01'),
 *   paymentTerms: PaymentTerms.NET_30,
 *   deliveryTimeframe: '2 weeks from PO'
 * });
 * ```
 */
export declare function submitVendorQuote(data: VendorQuoteData, transaction?: Transaction): Promise<VendorQuote>;
/**
 * Evaluates vendor quotes
 *
 * @param rfqId - RFQ identifier
 * @param evaluationCriteria - Evaluation weights
 * @param transaction - Optional database transaction
 * @returns Evaluated quotes with scores
 *
 * @example
 * ```typescript
 * const evaluated = await evaluateVendorQuotes('rfq-123', {
 *   price: 0.5,
 *   quality: 0.3,
 *   delivery: 0.2
 * });
 * ```
 */
export declare function evaluateVendorQuotes(rfqId: string, evaluationCriteria: Record<string, number>, transaction?: Transaction): Promise<VendorQuote[]>;
/**
 * Awards RFQ to a vendor
 *
 * @param rfqId - RFQ identifier
 * @param quoteId - Selected quote identifier
 * @param transaction - Optional database transaction
 * @returns Updated RFQ and quote
 *
 * @example
 * ```typescript
 * await awardRFQ('rfq-123', 'quote-456');
 * ```
 */
export declare function awardRFQ(rfqId: string, quoteId: string, transaction?: Transaction): Promise<{
    rfq: RFQ;
    quote: VendorQuote;
}>;
/**
 * Gets quotes for an RFQ
 *
 * @param rfqId - RFQ identifier
 * @returns Vendor quotes
 *
 * @example
 * ```typescript
 * const quotes = await getQuotesForRFQ('rfq-123');
 * ```
 */
export declare function getQuotesForRFQ(rfqId: string): Promise<VendorQuote[]>;
/**
 * Creates a purchase order
 *
 * @param data - PO data
 * @param transaction - Optional database transaction
 * @returns Created purchase order
 *
 * @example
 * ```typescript
 * const po = await createPurchaseOrder({
 *   vendorId: 'vendor-123',
 *   quoteId: 'quote-456',
 *   items: [{
 *     assetTypeId: 'laptop-dell',
 *     description: 'Dell XPS 15',
 *     quantity: 50,
 *     unitPrice: 1450,
 *     taxRate: 8.5
 *   }],
 *   shippingAddress: '123 Main St, City, State 12345',
 *   billingAddress: '456 Office Blvd, City, State 12345',
 *   paymentTerms: PaymentTerms.NET_30,
 *   expectedDeliveryDate: new Date('2024-07-15')
 * });
 * ```
 */
export declare function createPurchaseOrder(data: PurchaseOrderData, transaction?: Transaction): Promise<PurchaseOrder>;
/**
 * Approves a purchase order
 *
 * @param poId - PO identifier
 * @param approverId - Approver user ID
 * @param transaction - Optional database transaction
 * @returns Updated PO
 *
 * @example
 * ```typescript
 * await approvePurchaseOrder('po-123', 'manager-456');
 * ```
 */
export declare function approvePurchaseOrder(poId: string, approverId: string, transaction?: Transaction): Promise<PurchaseOrder>;
/**
 * Issues a purchase order to vendor
 *
 * @param poId - PO identifier
 * @param transaction - Optional database transaction
 * @returns Updated PO
 *
 * @example
 * ```typescript
 * await issuePurchaseOrder('po-123');
 * ```
 */
export declare function issuePurchaseOrder(poId: string, transaction?: Transaction): Promise<PurchaseOrder>;
/**
 * Gets purchase orders by status
 *
 * @param status - PO status
 * @param options - Query options
 * @returns Purchase orders
 *
 * @example
 * ```typescript
 * const issued = await getPurchaseOrdersByStatus(PurchaseOrderStatus.ISSUED);
 * ```
 */
export declare function getPurchaseOrdersByStatus(status: PurchaseOrderStatus, options?: FindOptions): Promise<PurchaseOrder[]>;
/**
 * Gets purchase orders by vendor
 *
 * @param vendorId - Vendor identifier
 * @param options - Query options
 * @returns Purchase orders
 *
 * @example
 * ```typescript
 * const vendorPOs = await getPurchaseOrdersByVendor('vendor-123');
 * ```
 */
export declare function getPurchaseOrdersByVendor(vendorId: string, options?: FindOptions): Promise<PurchaseOrder[]>;
/**
 * Updates purchase order
 *
 * @param poId - PO identifier
 * @param updates - Fields to update
 * @param transaction - Optional database transaction
 * @returns Updated PO
 *
 * @example
 * ```typescript
 * await updatePurchaseOrder('po-123', {
 *   expectedDeliveryDate: new Date('2024-08-01')
 * });
 * ```
 */
export declare function updatePurchaseOrder(poId: string, updates: Partial<PurchaseOrder>, transaction?: Transaction): Promise<PurchaseOrder>;
/**
 * Cancels a purchase order
 *
 * @param poId - PO identifier
 * @param reason - Cancellation reason
 * @param transaction - Optional database transaction
 * @returns Updated PO
 *
 * @example
 * ```typescript
 * await cancelPurchaseOrder('po-123', 'Vendor unavailable');
 * ```
 */
export declare function cancelPurchaseOrder(poId: string, reason: string, transaction?: Transaction): Promise<PurchaseOrder>;
/**
 * Receives assets from a purchase order
 *
 * @param data - Receiving data
 * @param transaction - Optional database transaction
 * @returns Created receiving record
 *
 * @example
 * ```typescript
 * const receiving = await receiveAssets({
 *   purchaseOrderId: 'po-123',
 *   receivedBy: 'user-456',
 *   receivedDate: new Date(),
 *   items: [{
 *     poItemId: 'item-1',
 *     quantityReceived: 50,
 *     condition: 'good',
 *     serialNumbers: ['SN001', 'SN002', ...]
 *   }],
 *   packingSlipNumber: 'PS-12345'
 * });
 * ```
 */
export declare function receiveAssets(data: AssetReceivingData, transaction?: Transaction): Promise<AssetReceiving>;
/**
 * Inspects received assets
 *
 * @param data - Inspection data
 * @param transaction - Optional database transaction
 * @returns Created inspection record
 *
 * @example
 * ```typescript
 * const inspection = await inspectReceivedAssets({
 *   receivingId: 'rcv-123',
 *   inspectorId: 'user-789',
 *   inspectionDate: new Date(),
 *   items: [{
 *     receivedItemId: 'item-1',
 *     result: InspectionResult.PASSED,
 *     measurements: { weight: '2.5kg', dimensions: '35x25x2cm' }
 *   }],
 *   overallResult: InspectionResult.PASSED
 * });
 * ```
 */
export declare function inspectReceivedAssets(data: InspectionData, transaction?: Transaction): Promise<AssetInspection>;
/**
 * Gets receiving records for a purchase order
 *
 * @param poId - PO identifier
 * @returns Receiving records
 *
 * @example
 * ```typescript
 * const receivings = await getReceivingsForPO('po-123');
 * ```
 */
export declare function getReceivingsForPO(poId: string): Promise<AssetReceiving[]>;
/**
 * Gets inspection records for a receiving
 *
 * @param receivingId - Receiving identifier
 * @returns Inspection records
 *
 * @example
 * ```typescript
 * const inspections = await getInspectionsForReceiving('rcv-123');
 * ```
 */
export declare function getInspectionsForReceiving(receivingId: string): Promise<AssetInspection[]>;
/**
 * Creates a vendor contract
 *
 * @param data - Contract data
 * @param transaction - Optional database transaction
 * @returns Created contract
 *
 * @example
 * ```typescript
 * const contract = await createContract({
 *   vendorId: 'vendor-123',
 *   contractType: ContractType.BLANKET_ORDER,
 *   contractNumber: 'CON-2024-001',
 *   title: 'IT Equipment Blanket Order',
 *   description: 'Annual IT equipment procurement',
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-12-31'),
 *   value: 500000,
 *   paymentTerms: PaymentTerms.NET_30,
 *   termsAndConditions: 'Standard terms apply...'
 * });
 * ```
 */
export declare function createContract(data: ContractData, transaction?: Transaction): Promise<Contract>;
/**
 * Activates a contract
 *
 * @param contractId - Contract identifier
 * @param transaction - Optional database transaction
 * @returns Updated contract
 *
 * @example
 * ```typescript
 * await activateContract('contract-123');
 * ```
 */
export declare function activateContract(contractId: string, transaction?: Transaction): Promise<Contract>;
/**
 * Renews a contract
 *
 * @param contractId - Contract identifier
 * @param newEndDate - New end date
 * @param transaction - Optional database transaction
 * @returns Renewed contract
 *
 * @example
 * ```typescript
 * await renewContract('contract-123', new Date('2025-12-31'));
 * ```
 */
export declare function renewContract(contractId: string, newEndDate: Date, transaction?: Transaction): Promise<Contract>;
/**
 * Gets expiring contracts
 *
 * @param daysUntilExpiry - Days threshold
 * @returns Expiring contracts
 *
 * @example
 * ```typescript
 * const expiring = await getExpiringContracts(30);
 * ```
 */
export declare function getExpiringContracts(daysUntilExpiry?: number): Promise<Contract[]>;
/**
 * Gets contracts by vendor
 *
 * @param vendorId - Vendor identifier
 * @param activeOnly - Filter for active contracts only
 * @returns Vendor contracts
 *
 * @example
 * ```typescript
 * const contracts = await getContractsByVendor('vendor-123', true);
 * ```
 */
export declare function getContractsByVendor(vendorId: string, activeOnly?: boolean): Promise<Contract[]>;
/**
 * Creates a budget allocation
 *
 * @param data - Budget data
 * @param transaction - Optional database transaction
 * @returns Created budget
 *
 * @example
 * ```typescript
 * const budget = await createBudgetAllocation({
 *   budgetId: 'budget-123',
 *   departmentId: 'dept-456',
 *   fiscalYear: 2024,
 *   amount: 100000,
 *   categoryCode: 'IT-EQUIPMENT',
 *   approvedBy: 'cfo-789'
 * });
 * ```
 */
export declare function createBudgetAllocation(data: BudgetAllocationData, transaction?: Transaction): Promise<Budget>;
/**
 * Validates budget availability
 *
 * @param budgetId - Budget identifier
 * @param items - Items to validate against budget
 * @param transaction - Optional database transaction
 * @returns Validation result
 *
 * @example
 * ```typescript
 * await validateBudgetAvailability('budget-123', requisitionItems);
 * ```
 */
export declare function validateBudgetAvailability(budgetId: string, items: PurchaseRequisitionItem[], transaction?: Transaction): Promise<boolean>;
/**
 * Reserves budget for a requisition
 *
 * @param budgetId - Budget identifier
 * @param amount - Amount to reserve
 * @param transaction - Optional database transaction
 * @returns Updated budget
 *
 * @example
 * ```typescript
 * await reserveBudget('budget-123', 5000);
 * ```
 */
export declare function reserveBudget(budgetId: string, amount: number, transaction?: Transaction): Promise<Budget>;
/**
 * Commits budget for a purchase order
 *
 * @param budgetId - Budget identifier
 * @param amount - Amount to commit
 * @param transaction - Optional database transaction
 * @returns Updated budget
 *
 * @example
 * ```typescript
 * await commitBudget('budget-123', 5000);
 * ```
 */
export declare function commitBudget(budgetId: string, amount: number, transaction?: Transaction): Promise<Budget>;
/**
 * Records actual budget spend
 *
 * @param budgetId - Budget identifier
 * @param amount - Amount spent
 * @param transaction - Optional database transaction
 * @returns Updated budget
 *
 * @example
 * ```typescript
 * await recordBudgetSpend('budget-123', 5000);
 * ```
 */
export declare function recordBudgetSpend(budgetId: string, amount: number, transaction?: Transaction): Promise<Budget>;
/**
 * Gets budget status by department
 *
 * @param departmentId - Department identifier
 * @param fiscalYear - Fiscal year
 * @returns Department budgets
 *
 * @example
 * ```typescript
 * const budgets = await getBudgetsByDepartment('dept-123', 2024);
 * ```
 */
export declare function getBudgetsByDepartment(departmentId: string, fiscalYear: number): Promise<Budget[]>;
/**
 * Creates a new vendor
 *
 * @param data - Vendor data
 * @param transaction - Optional database transaction
 * @returns Created vendor
 *
 * @example
 * ```typescript
 * const vendor = await createVendor({
 *   vendorCode: 'DELL-001',
 *   name: 'Dell Technologies',
 *   email: 'procurement@dell.com',
 *   phone: '1-800-DELL',
 *   address: '1 Dell Way, Round Rock, TX',
 *   defaultPaymentTerms: PaymentTerms.NET_30
 * });
 * ```
 */
export declare function createVendor(data: Partial<Vendor>, transaction?: Transaction): Promise<Vendor>;
/**
 * Updates vendor rating
 *
 * @param vendorId - Vendor identifier
 * @param rating - New rating
 * @param transaction - Optional database transaction
 * @returns Updated vendor
 *
 * @example
 * ```typescript
 * await updateVendorRating('vendor-123', VendorRating.EXCELLENT);
 * ```
 */
export declare function updateVendorRating(vendorId: string, rating: VendorRating, transaction?: Transaction): Promise<Vendor>;
/**
 * Updates vendor performance metrics
 *
 * @param vendorId - Vendor identifier
 * @param metrics - Performance metrics
 * @param transaction - Optional database transaction
 * @returns Updated vendor
 *
 * @example
 * ```typescript
 * await updateVendorPerformance('vendor-123', {
 *   onTimeDelivery: 95,
 *   qualityScore: 98,
 *   responseTime: 24
 * });
 * ```
 */
export declare function updateVendorPerformance(vendorId: string, metrics: Record<string, any>, transaction?: Transaction): Promise<Vendor>;
/**
 * Gets preferred vendors
 *
 * @returns Preferred vendors
 *
 * @example
 * ```typescript
 * const preferred = await getPreferredVendors();
 * ```
 */
export declare function getPreferredVendors(): Promise<Vendor[]>;
/**
 * Gets vendors by rating
 *
 * @param minRating - Minimum rating
 * @returns Vendors
 *
 * @example
 * ```typescript
 * const topVendors = await getVendorsByRating(VendorRating.GOOD);
 * ```
 */
export declare function getVendorsByRating(minRating: VendorRating): Promise<Vendor[]>;
/**
 * Creates an approval workflow
 *
 * @param data - Workflow data
 * @param transaction - Optional database transaction
 * @returns Created workflow
 *
 * @example
 * ```typescript
 * await createApprovalWorkflow({
 *   documentType: 'purchase_requisition',
 *   documentId: 'req-123',
 *   approvers: [
 *     { userId: 'manager-1', level: 1, required: true },
 *     { userId: 'director-1', level: 2, required: true }
 *   ],
 *   sequenceRequired: true
 * });
 * ```
 */
export declare function createApprovalWorkflow(data: ApprovalWorkflowData, transaction?: Transaction): Promise<ApprovalWorkflow>;
/**
 * Processes approval action
 *
 * @param workflowId - Workflow identifier
 * @param userId - User performing action
 * @param action - Approval action
 * @param comments - Optional comments
 * @param transaction - Optional database transaction
 * @returns Updated workflow
 *
 * @example
 * ```typescript
 * await processApprovalAction('workflow-123', 'manager-456', 'approved', 'Looks good');
 * ```
 */
export declare function processApprovalAction(workflowId: string, userId: string, action: 'approved' | 'rejected', comments?: string, transaction?: Transaction): Promise<ApprovalWorkflow>;
/**
 * Gets pending approvals for a user
 *
 * @param userId - User identifier
 * @returns Pending workflows
 *
 * @example
 * ```typescript
 * const pending = await getPendingApprovalsForUser('manager-123');
 * ```
 */
export declare function getPendingApprovalsForUser(userId: string): Promise<ApprovalWorkflow[]>;
declare const _default: {
    Vendor: typeof Vendor;
    PurchaseRequisition: typeof PurchaseRequisition;
    RFQ: typeof RFQ;
    VendorQuote: typeof VendorQuote;
    PurchaseOrder: typeof PurchaseOrder;
    AssetReceiving: typeof AssetReceiving;
    AssetInspection: typeof AssetInspection;
    Contract: typeof Contract;
    Budget: typeof Budget;
    ApprovalWorkflow: typeof ApprovalWorkflow;
    createPurchaseRequisition: typeof createPurchaseRequisition;
    submitRequisitionForApproval: typeof submitRequisitionForApproval;
    approvePurchaseRequisition: typeof approvePurchaseRequisition;
    rejectPurchaseRequisition: typeof rejectPurchaseRequisition;
    getRequisitionsByStatus: typeof getRequisitionsByStatus;
    getRequisitionsByDepartment: typeof getRequisitionsByDepartment;
    updatePurchaseRequisition: typeof updatePurchaseRequisition;
    cancelPurchaseRequisition: typeof cancelPurchaseRequisition;
    createRFQ: typeof createRFQ;
    publishRFQ: typeof publishRFQ;
    submitVendorQuote: typeof submitVendorQuote;
    evaluateVendorQuotes: typeof evaluateVendorQuotes;
    awardRFQ: typeof awardRFQ;
    getQuotesForRFQ: typeof getQuotesForRFQ;
    createPurchaseOrder: typeof createPurchaseOrder;
    approvePurchaseOrder: typeof approvePurchaseOrder;
    issuePurchaseOrder: typeof issuePurchaseOrder;
    getPurchaseOrdersByStatus: typeof getPurchaseOrdersByStatus;
    getPurchaseOrdersByVendor: typeof getPurchaseOrdersByVendor;
    updatePurchaseOrder: typeof updatePurchaseOrder;
    cancelPurchaseOrder: typeof cancelPurchaseOrder;
    receiveAssets: typeof receiveAssets;
    inspectReceivedAssets: typeof inspectReceivedAssets;
    getReceivingsForPO: typeof getReceivingsForPO;
    getInspectionsForReceiving: typeof getInspectionsForReceiving;
    createContract: typeof createContract;
    activateContract: typeof activateContract;
    renewContract: typeof renewContract;
    getExpiringContracts: typeof getExpiringContracts;
    getContractsByVendor: typeof getContractsByVendor;
    createBudgetAllocation: typeof createBudgetAllocation;
    validateBudgetAvailability: typeof validateBudgetAvailability;
    reserveBudget: typeof reserveBudget;
    commitBudget: typeof commitBudget;
    recordBudgetSpend: typeof recordBudgetSpend;
    getBudgetsByDepartment: typeof getBudgetsByDepartment;
    createVendor: typeof createVendor;
    updateVendorRating: typeof updateVendorRating;
    updateVendorPerformance: typeof updateVendorPerformance;
    getPreferredVendors: typeof getPreferredVendors;
    getVendorsByRating: typeof getVendorsByRating;
    createApprovalWorkflow: typeof createApprovalWorkflow;
    processApprovalAction: typeof processApprovalAction;
    getPendingApprovalsForUser: typeof getPendingApprovalsForUser;
};
export default _default;
//# sourceMappingURL=asset-acquisition-commands.d.ts.map