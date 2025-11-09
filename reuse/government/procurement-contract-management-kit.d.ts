/**
 * LOC: PROCUREMENT_CONTRACT_MANAGEMENT_KIT_001
 * File: /reuse/government/procurement-contract-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - crypto
 *
 * DOWNSTREAM (imported by):
 *   - Government procurement services
 *   - Contract management systems
 *   - Vendor management platforms
 *   - E-procurement integrations
 *   - Bid evaluation systems
 */
import { Model } from 'sequelize-typescript';
/**
 * Procurement request type
 */
export declare enum ProcurementType {
    RFP = "rfp",// Request for Proposal
    RFQ = "rfq",// Request for Quotation
    RFI = "rfi",// Request for Information
    ITB = "itb",// Invitation to Bid
    RFS = "rfs"
}
/**
 * Procurement method
 */
export declare enum ProcurementMethod {
    COMPETITIVE_BIDDING = "competitive_bidding",
    SOLE_SOURCE = "sole_source",
    EMERGENCY = "emergency",
    COOPERATIVE = "cooperative",
    SMALL_PURCHASE = "small_purchase",
    SEALED_BID = "sealed_bid",
    COMPETITIVE_NEGOTIATION = "competitive_negotiation"
}
/**
 * Procurement status
 */
export declare enum ProcurementStatus {
    DRAFT = "draft",
    PUBLISHED = "published",
    BID_OPEN = "bid_open",
    BID_CLOSED = "bid_closed",
    UNDER_EVALUATION = "under_evaluation",
    AWARDED = "awarded",
    CANCELLED = "cancelled",
    SUSPENDED = "suspended"
}
/**
 * Contract status
 */
export declare enum ContractStatus {
    DRAFT = "draft",
    PENDING_APPROVAL = "pending_approval",
    APPROVED = "approved",
    ACTIVE = "active",
    SUSPENDED = "suspended",
    EXPIRED = "expired",
    TERMINATED = "terminated",
    COMPLETED = "completed",
    RENEWED = "renewed"
}
/**
 * Contract type
 */
export declare enum ContractType {
    FIXED_PRICE = "fixed_price",
    TIME_AND_MATERIALS = "time_and_materials",
    COST_PLUS = "cost_plus",
    INDEFINITE_DELIVERY = "indefinite_delivery",
    BLANKET_PURCHASE = "blanket_purchase",
    TASK_ORDER = "task_order",
    MULTI_YEAR = "multi_year"
}
/**
 * Bid status
 */
export declare enum BidStatus {
    SUBMITTED = "submitted",
    UNDER_REVIEW = "under_review",
    SHORTLISTED = "shortlisted",
    REJECTED = "rejected",
    AWARDED = "awarded",
    WITHDRAWN = "withdrawn"
}
/**
 * Vendor qualification status
 */
export declare enum VendorQualificationStatus {
    PENDING = "pending",
    QUALIFIED = "qualified",
    DISQUALIFIED = "disqualified",
    SUSPENDED = "suspended",
    DEBARRED = "debarred"
}
/**
 * Purchase order status
 */
export declare enum PurchaseOrderStatus {
    DRAFT = "draft",
    PENDING_APPROVAL = "pending_approval",
    APPROVED = "approved",
    SENT_TO_VENDOR = "sent_to_vendor",
    PARTIALLY_RECEIVED = "partially_received",
    RECEIVED = "received",
    INVOICED = "invoiced",
    PAID = "paid",
    CANCELLED = "cancelled"
}
/**
 * Amendment type
 */
export declare enum AmendmentType {
    SCOPE_CHANGE = "scope_change",
    PRICE_ADJUSTMENT = "price_adjustment",
    TIME_EXTENSION = "time_extension",
    TERMINATION = "termination",
    ADMINISTRATIVE = "administrative",
    MODIFICATION = "modification"
}
/**
 * Procurement ID branded type
 */
export type ProcurementId = string & {
    __brand: 'ProcurementId';
};
/**
 * Contract ID branded type
 */
export type ContractId = string & {
    __brand: 'ContractId';
};
/**
 * Bid ID branded type
 */
export type BidId = string & {
    __brand: 'BidId';
};
/**
 * Vendor ID branded type
 */
export type VendorId = string & {
    __brand: 'VendorId';
};
/**
 * Purchase order ID branded type
 */
export type PurchaseOrderId = string & {
    __brand: 'PurchaseOrderId';
};
/**
 * Amendment ID branded type
 */
export type AmendmentId = string & {
    __brand: 'AmendmentId';
};
/**
 * User ID type
 */
export type UserId = string & {
    __brand: 'UserId';
};
/**
 * Procurement request
 */
export interface ProcurementRequest {
    readonly id: ProcurementId;
    readonly type: ProcurementType;
    readonly method: ProcurementMethod;
    readonly title: string;
    readonly description: string;
    readonly department: string;
    readonly projectNumber?: string;
    readonly estimatedValue: number;
    readonly status: ProcurementStatus;
    readonly publishedDate?: Date;
    readonly closeDate?: Date;
    readonly openDate?: Date;
    readonly createdBy: UserId;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly specifications: Record<string, unknown>;
    readonly evaluationCriteria: EvaluationCriteria[];
    readonly metadata: Record<string, unknown>;
}
/**
 * Evaluation criteria
 */
export interface EvaluationCriteria {
    readonly criteriaId: string;
    readonly name: string;
    readonly description: string;
    readonly weight: number;
    readonly maxScore: number;
    readonly type: 'price' | 'technical' | 'experience' | 'qualifications' | 'past_performance';
}
/**
 * Bid submission
 */
export interface Bid {
    readonly id: BidId;
    readonly procurementId: ProcurementId;
    readonly vendorId: VendorId;
    readonly bidAmount: number;
    readonly status: BidStatus;
    readonly submittedAt: Date;
    readonly documents: BidDocument[];
    readonly technicalScore?: number;
    readonly priceScore?: number;
    readonly totalScore?: number;
    readonly evaluationNotes?: string;
    readonly metadata: Record<string, unknown>;
}
/**
 * Bid document
 */
export interface BidDocument {
    readonly documentId: string;
    readonly name: string;
    readonly type: string;
    readonly url: string;
    readonly uploadedAt: Date;
    readonly size: number;
}
/**
 * Bid evaluation result
 */
export interface BidEvaluationResult {
    readonly bidId: BidId;
    readonly scores: CriteriaScore[];
    readonly totalScore: number;
    readonly rank: number;
    readonly recommendation: 'award' | 'shortlist' | 'reject';
    readonly evaluatedBy: UserId;
    readonly evaluatedAt: Date;
    readonly notes: string;
}
/**
 * Criteria score
 */
export interface CriteriaScore {
    readonly criteriaId: string;
    readonly score: number;
    readonly maxScore: number;
    readonly weight: number;
    readonly weightedScore: number;
    readonly comments: string;
}
/**
 * Contract
 */
export interface Contract {
    readonly id: ContractId;
    readonly procurementId?: ProcurementId;
    readonly contractNumber: string;
    readonly type: ContractType;
    readonly status: ContractStatus;
    readonly vendorId: VendorId;
    readonly title: string;
    readonly description: string;
    readonly startDate: Date;
    readonly endDate: Date;
    readonly value: number;
    readonly department: string;
    readonly createdBy: UserId;
    readonly approvedBy?: UserId;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly terms: ContractTerms;
    readonly deliverables: Deliverable[];
    readonly metadata: Record<string, unknown>;
}
/**
 * Contract terms
 */
export interface ContractTerms {
    readonly paymentTerms: string;
    readonly deliverySchedule: string;
    readonly warrantyPeriod?: number;
    readonly penaltyClause?: string;
    readonly terminationClause: string;
    readonly renewalOptions?: RenewalOption[];
    readonly insuranceRequirements?: string[];
    readonly performanceBond?: number;
}
/**
 * Renewal option
 */
export interface RenewalOption {
    readonly optionNumber: number;
    readonly duration: number;
    readonly priceAdjustment?: number;
    readonly conditions: string[];
}
/**
 * Deliverable
 */
export interface Deliverable {
    readonly deliverableId: string;
    readonly name: string;
    readonly description: string;
    readonly dueDate: Date;
    readonly status: 'pending' | 'in_progress' | 'completed' | 'delayed';
    readonly completedDate?: Date;
    readonly notes?: string;
}
/**
 * Vendor
 */
export interface Vendor {
    readonly id: VendorId;
    readonly name: string;
    readonly businessType: string;
    readonly taxId: string;
    readonly address: VendorAddress;
    readonly contact: VendorContact;
    readonly qualificationStatus: VendorQualificationStatus;
    readonly certifications: Certification[];
    readonly financialInfo: FinancialInfo;
    readonly performanceHistory: PerformanceRecord[];
    readonly registeredAt: Date;
    readonly metadata: Record<string, unknown>;
}
/**
 * Vendor address
 */
export interface VendorAddress {
    readonly street: string;
    readonly city: string;
    readonly state: string;
    readonly zipCode: string;
    readonly country: string;
}
/**
 * Vendor contact
 */
export interface VendorContact {
    readonly name: string;
    readonly title: string;
    readonly email: string;
    readonly phone: string;
    readonly alternatePhone?: string;
}
/**
 * Certification
 */
export interface Certification {
    readonly certificationId: string;
    readonly type: string;
    readonly issuedBy: string;
    readonly issuedDate: Date;
    readonly expiryDate: Date;
    readonly verified: boolean;
}
/**
 * Financial information
 */
export interface FinancialInfo {
    readonly annualRevenue?: number;
    readonly creditRating?: string;
    readonly bondingCapacity?: number;
    readonly insuranceCoverage: InsuranceCoverage[];
    readonly lastAuditDate?: Date;
}
/**
 * Insurance coverage
 */
export interface InsuranceCoverage {
    readonly type: string;
    readonly carrier: string;
    readonly policyNumber: string;
    readonly coverage: number;
    readonly expiryDate: Date;
}
/**
 * Performance record
 */
export interface PerformanceRecord {
    readonly contractId: string;
    readonly rating: number;
    readonly completedOnTime: boolean;
    readonly completedOnBudget: boolean;
    readonly qualityRating: number;
    readonly comments: string;
    readonly evaluatedAt: Date;
}
/**
 * Purchase order
 */
export interface PurchaseOrder {
    readonly id: PurchaseOrderId;
    readonly contractId?: ContractId;
    readonly poNumber: string;
    readonly vendorId: VendorId;
    readonly status: PurchaseOrderStatus;
    readonly orderDate: Date;
    readonly requiredDate: Date;
    readonly department: string;
    readonly lineItems: LineItem[];
    readonly subtotal: number;
    readonly tax: number;
    readonly total: number;
    readonly shippingAddress: VendorAddress;
    readonly billingAddress: VendorAddress;
    readonly createdBy: UserId;
    readonly approvedBy?: UserId;
    readonly metadata: Record<string, unknown>;
}
/**
 * Line item
 */
export interface LineItem {
    readonly lineNumber: number;
    readonly description: string;
    readonly quantity: number;
    readonly unitPrice: number;
    readonly total: number;
    readonly accountCode: string;
    readonly deliveryDate?: Date;
}
/**
 * Contract amendment
 */
export interface ContractAmendment {
    readonly id: AmendmentId;
    readonly contractId: ContractId;
    readonly amendmentNumber: number;
    readonly type: AmendmentType;
    readonly description: string;
    readonly changes: AmendmentChange[];
    readonly effectiveDate: Date;
    readonly createdBy: UserId;
    readonly approvedBy?: UserId;
    readonly createdAt: Date;
    readonly metadata: Record<string, unknown>;
}
/**
 * Amendment change
 */
export interface AmendmentChange {
    readonly field: string;
    readonly oldValue: unknown;
    readonly newValue: unknown;
    readonly reason: string;
}
/**
 * Sole source justification
 */
export interface SoleSourceJustification {
    readonly procurementId: ProcurementId;
    readonly vendorId: VendorId;
    readonly reason: string;
    readonly justification: string;
    readonly marketResearch: string;
    readonly alternativesConsidered: string[];
    readonly costAnalysis: string;
    readonly approvedBy?: UserId;
    readonly approvalDate?: Date;
}
/**
 * Compliance check
 */
export interface ComplianceCheck {
    readonly checkId: string;
    readonly contractId: ContractId;
    readonly checkDate: Date;
    readonly checkType: string;
    readonly compliant: boolean;
    readonly findings: ComplianceFinding[];
    readonly performedBy: UserId;
    readonly nextCheckDate?: Date;
}
/**
 * Compliance finding
 */
export interface ComplianceFinding {
    readonly findingId: string;
    readonly severity: 'low' | 'medium' | 'high' | 'critical';
    readonly description: string;
    readonly requirement: string;
    readonly remediation: string;
    readonly dueDate?: Date;
    readonly resolved: boolean;
}
/**
 * Approval workflow
 */
export interface ApprovalWorkflow {
    readonly workflowId: string;
    readonly entityType: 'procurement' | 'contract' | 'purchase_order' | 'amendment';
    readonly entityId: string;
    readonly steps: ApprovalStep[];
    readonly currentStep: number;
    readonly status: 'pending' | 'in_progress' | 'approved' | 'rejected';
    readonly createdAt: Date;
}
/**
 * Approval step
 */
export interface ApprovalStep {
    readonly stepNumber: number;
    readonly approverRole: string;
    readonly approverId?: UserId;
    readonly status: 'pending' | 'approved' | 'rejected' | 'skipped';
    readonly comments?: string;
    readonly actionDate?: Date;
    readonly required: boolean;
}
/**
 * Procurement model for Sequelize ORM
 */
export declare class ProcurementModel extends Model {
    id: string;
    type: ProcurementType;
    method: ProcurementMethod;
    title: string;
    description: string;
    department: string;
    projectNumber?: string;
    estimatedValue: number;
    status: ProcurementStatus;
    publishedDate?: Date;
    closeDate?: Date;
    openDate?: Date;
    createdBy: string;
    specifications: Record<string, unknown>;
    evaluationCriteria: EvaluationCriteria[];
    metadata: Record<string, unknown>;
    createdAt: Date;
    updatedAt: Date;
    bids: BidModel[];
}
/**
 * Bid model for Sequelize ORM
 */
export declare class BidModel extends Model {
    id: string;
    procurementId: string;
    vendorId: string;
    bidAmount: number;
    status: BidStatus;
    submittedAt: Date;
    documents: BidDocument[];
    technicalScore?: number;
    priceScore?: number;
    totalScore?: number;
    evaluationNotes?: string;
    metadata: Record<string, unknown>;
    procurement: ProcurementModel;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Contract model for Sequelize ORM
 */
export declare class ContractModel extends Model {
    id: string;
    procurementId?: string;
    contractNumber: string;
    type: ContractType;
    status: ContractStatus;
    vendorId: string;
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    value: number;
    department: string;
    createdBy: string;
    approvedBy?: string;
    terms: ContractTerms;
    deliverables: Deliverable[];
    metadata: Record<string, unknown>;
    createdAt: Date;
    updatedAt: Date;
    amendments: ContractAmendmentModel[];
    purchaseOrders: PurchaseOrderModel[];
}
/**
 * Vendor model for Sequelize ORM
 */
export declare class VendorModel extends Model {
    id: string;
    name: string;
    businessType: string;
    taxId: string;
    address: VendorAddress;
    contact: VendorContact;
    qualificationStatus: VendorQualificationStatus;
    certifications: Certification[];
    financialInfo: FinancialInfo;
    performanceHistory: PerformanceRecord[];
    registeredAt: Date;
    metadata: Record<string, unknown>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Purchase order model for Sequelize ORM
 */
export declare class PurchaseOrderModel extends Model {
    id: string;
    contractId?: string;
    poNumber: string;
    vendorId: string;
    status: PurchaseOrderStatus;
    orderDate: Date;
    requiredDate: Date;
    department: string;
    lineItems: LineItem[];
    subtotal: number;
    tax: number;
    total: number;
    shippingAddress: VendorAddress;
    billingAddress: VendorAddress;
    createdBy: string;
    approvedBy?: string;
    metadata: Record<string, unknown>;
    contract: ContractModel;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Contract amendment model for Sequelize ORM
 */
export declare class ContractAmendmentModel extends Model {
    id: string;
    contractId: string;
    amendmentNumber: number;
    type: AmendmentType;
    description: string;
    changes: AmendmentChange[];
    effectiveDate: Date;
    createdBy: string;
    approvedBy?: string;
    metadata: Record<string, unknown>;
    contract: ContractModel;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Procurement creation DTO for Swagger
 */
export declare class CreateProcurementDto {
    type: ProcurementType;
    method: ProcurementMethod;
    title: string;
    description: string;
    department: string;
    projectNumber?: string;
    estimatedValue: number;
    specifications: Record<string, unknown>;
    evaluationCriteria: EvaluationCriteria[];
}
/**
 * Bid submission DTO for Swagger
 */
export declare class CreateBidDto {
    procurementId: string;
    vendorId: string;
    bidAmount: number;
    documents: BidDocument[];
}
/**
 * Contract creation DTO for Swagger
 */
export declare class CreateContractDto {
    procurementId?: string;
    contractNumber: string;
    type: ContractType;
    vendorId: string;
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    value: number;
    department: string;
    terms: ContractTerms;
    deliverables: Deliverable[];
}
/**
 * Vendor registration DTO for Swagger
 */
export declare class RegisterVendorDto {
    name: string;
    businessType: string;
    taxId: string;
    address: VendorAddress;
    contact: VendorContact;
    certifications: Certification[];
    financialInfo: FinancialInfo;
}
/**
 * Purchase order creation DTO for Swagger
 */
export declare class CreatePurchaseOrderDto {
    contractId?: string;
    poNumber: string;
    vendorId: string;
    orderDate: Date;
    requiredDate: Date;
    department: string;
    lineItems: LineItem[];
    shippingAddress: VendorAddress;
    billingAddress: VendorAddress;
}
/**
 * @function createProcurementId
 * @description Generates a unique procurement ID
 * @returns {ProcurementId} Unique procurement ID
 *
 * @example
 * ```typescript
 * const procurementId = createProcurementId();
 * ```
 */
export declare const createProcurementId: () => ProcurementId;
/**
 * @function createContractId
 * @description Generates a unique contract ID
 * @returns {ContractId} Unique contract ID
 *
 * @example
 * ```typescript
 * const contractId = createContractId();
 * ```
 */
export declare const createContractId: () => ContractId;
/**
 * @function createBidId
 * @description Generates a unique bid ID
 * @returns {BidId} Unique bid ID
 *
 * @example
 * ```typescript
 * const bidId = createBidId();
 * ```
 */
export declare const createBidId: () => BidId;
/**
 * @function createVendorId
 * @description Generates a unique vendor ID
 * @returns {VendorId} Unique vendor ID
 *
 * @example
 * ```typescript
 * const vendorId = createVendorId();
 * ```
 */
export declare const createVendorId: () => VendorId;
/**
 * @function createPurchaseOrderId
 * @description Generates a unique purchase order ID
 * @returns {PurchaseOrderId} Unique purchase order ID
 *
 * @example
 * ```typescript
 * const poId = createPurchaseOrderId();
 * ```
 */
export declare const createPurchaseOrderId: () => PurchaseOrderId;
/**
 * @function createAmendmentId
 * @description Generates a unique amendment ID
 * @returns {AmendmentId} Unique amendment ID
 *
 * @example
 * ```typescript
 * const amendmentId = createAmendmentId();
 * ```
 */
export declare const createAmendmentId: () => AmendmentId;
/**
 * @function createProcurementRequest
 * @description Creates a new procurement request
 * @param {ProcurementType} type - Type of procurement
 * @param {ProcurementMethod} method - Procurement method
 * @param {string} title - Procurement title
 * @param {string} description - Procurement description
 * @param {string} department - Requesting department
 * @param {number} estimatedValue - Estimated value
 * @param {UserId} createdBy - Creator user ID
 * @returns {ProcurementRequest} Created procurement request
 *
 * @example
 * ```typescript
 * const rfp = createProcurementRequest(
 *   ProcurementType.RFP,
 *   ProcurementMethod.COMPETITIVE_BIDDING,
 *   'IT Infrastructure Upgrade',
 *   'Request for proposal to upgrade datacenter infrastructure',
 *   'IT Department',
 *   500000,
 *   userId
 * );
 * ```
 */
export declare const createProcurementRequest: (type: ProcurementType, method: ProcurementMethod, title: string, description: string, department: string, estimatedValue: number, createdBy: UserId) => ProcurementRequest;
/**
 * @function publishProcurement
 * @description Publishes a procurement request
 * @param {ProcurementRequest} procurement - Procurement to publish
 * @param {Date} closeDate - Bid close date
 * @param {Date} openDate - Bid open date
 * @returns {ProcurementRequest} Published procurement
 *
 * @example
 * ```typescript
 * const published = publishProcurement(
 *   procurement,
 *   new Date('2024-12-31'),
 *   new Date('2025-01-15')
 * );
 * ```
 */
export declare const publishProcurement: (procurement: ProcurementRequest, closeDate: Date, openDate: Date) => ProcurementRequest;
/**
 * @function addEvaluationCriteria
 * @description Adds evaluation criteria to procurement
 * @param {ProcurementRequest} procurement - Procurement request
 * @param {EvaluationCriteria} criteria - Evaluation criteria
 * @returns {ProcurementRequest} Updated procurement
 *
 * @example
 * ```typescript
 * const updated = addEvaluationCriteria(procurement, {
 *   criteriaId: 'tech-1',
 *   name: 'Technical Capability',
 *   description: 'Vendor technical expertise',
 *   weight: 40,
 *   maxScore: 100,
 *   type: 'technical'
 * });
 * ```
 */
export declare const addEvaluationCriteria: (procurement: ProcurementRequest, criteria: EvaluationCriteria) => ProcurementRequest;
/**
 * @function closeBidding
 * @description Closes bidding for procurement
 * @param {ProcurementRequest} procurement - Procurement to close
 * @returns {ProcurementRequest} Updated procurement
 *
 * @example
 * ```typescript
 * const closed = closeBidding(procurement);
 * ```
 */
export declare const closeBidding: (procurement: ProcurementRequest) => ProcurementRequest;
/**
 * @function cancelProcurement
 * @description Cancels a procurement request
 * @param {ProcurementRequest} procurement - Procurement to cancel
 * @param {string} reason - Cancellation reason
 * @returns {ProcurementRequest} Cancelled procurement
 *
 * @example
 * ```typescript
 * const cancelled = cancelProcurement(procurement, 'Requirements changed');
 * ```
 */
export declare const cancelProcurement: (procurement: ProcurementRequest, reason: string) => ProcurementRequest;
/**
 * @function createBid
 * @description Creates a new bid submission
 * @param {ProcurementId} procurementId - Procurement ID
 * @param {VendorId} vendorId - Vendor ID
 * @param {number} bidAmount - Bid amount
 * @returns {Bid} Created bid
 *
 * @example
 * ```typescript
 * const bid = createBid(procurementId, vendorId, 450000);
 * ```
 */
export declare const createBid: (procurementId: ProcurementId, vendorId: VendorId, bidAmount: number) => Bid;
/**
 * @function evaluateBid
 * @description Evaluates a bid against criteria
 * @param {Bid} bid - Bid to evaluate
 * @param {CriteriaScore[]} scores - Criteria scores
 * @param {UserId} evaluatedBy - Evaluator user ID
 * @returns {BidEvaluationResult} Evaluation result
 *
 * @example
 * ```typescript
 * const evaluation = evaluateBid(bid, scores, evaluatorId);
 * ```
 */
export declare const evaluateBid: (bid: Bid, scores: CriteriaScore[], evaluatedBy: UserId) => BidEvaluationResult;
/**
 * @function calculateTechnicalScore
 * @description Calculates technical score from criteria
 * @param {CriteriaScore[]} scores - Criteria scores
 * @returns {number} Technical score
 *
 * @example
 * ```typescript
 * const techScore = calculateTechnicalScore(scores);
 * ```
 */
export declare const calculateTechnicalScore: (scores: CriteriaScore[]) => number;
/**
 * @function calculatePriceScore
 * @description Calculates price score using low bid method
 * @param {number} bidAmount - Bid amount
 * @param {number} lowestBid - Lowest bid amount
 * @param {number} maxScore - Maximum score
 * @returns {number} Price score
 *
 * @example
 * ```typescript
 * const priceScore = calculatePriceScore(500000, 450000, 100);
 * ```
 */
export declare const calculatePriceScore: (bidAmount: number, lowestBid: number, maxScore: number) => number;
/**
 * @function rankBids
 * @description Ranks bids by total score
 * @param {BidEvaluationResult[]} evaluations - Bid evaluations
 * @returns {BidEvaluationResult[]} Ranked evaluations
 *
 * @example
 * ```typescript
 * const ranked = rankBids(evaluations);
 * ```
 */
export declare const rankBids: (evaluations: BidEvaluationResult[]) => BidEvaluationResult[];
/**
 * @function identifyLowestResponsiveBid
 * @description Identifies lowest responsive bid
 * @param {Bid[]} bids - All bids
 * @param {BidEvaluationResult[]} evaluations - Evaluations
 * @returns {Bid | null} Lowest responsive bid
 *
 * @example
 * ```typescript
 * const lowestBid = identifyLowestResponsiveBid(bids, evaluations);
 * ```
 */
export declare const identifyLowestResponsiveBid: (bids: Bid[], evaluations: BidEvaluationResult[]) => Bid | null;
/**
 * @function createContract
 * @description Creates a new contract
 * @param {string} contractNumber - Contract number
 * @param {ContractType} type - Contract type
 * @param {VendorId} vendorId - Vendor ID
 * @param {string} title - Contract title
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {number} value - Contract value
 * @param {string} department - Department
 * @param {UserId} createdBy - Creator user ID
 * @returns {Contract} Created contract
 *
 * @example
 * ```typescript
 * const contract = createContract(
 *   'CON-2024-001',
 *   ContractType.FIXED_PRICE,
 *   vendorId,
 *   'IT Infrastructure Upgrade',
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31'),
 *   500000,
 *   'IT Department',
 *   userId
 * );
 * ```
 */
export declare const createContract: (contractNumber: string, type: ContractType, vendorId: VendorId, title: string, startDate: Date, endDate: Date, value: number, department: string, createdBy: UserId) => Contract;
/**
 * @function activateContract
 * @description Activates an approved contract
 * @param {Contract} contract - Contract to activate
 * @param {UserId} approvedBy - Approver user ID
 * @returns {Contract} Activated contract
 *
 * @example
 * ```typescript
 * const active = activateContract(contract, approverId);
 * ```
 */
export declare const activateContract: (contract: Contract, approvedBy: UserId) => Contract;
/**
 * @function suspendContract
 * @description Suspends an active contract
 * @param {Contract} contract - Contract to suspend
 * @param {string} reason - Suspension reason
 * @returns {Contract} Suspended contract
 *
 * @example
 * ```typescript
 * const suspended = suspendContract(contract, 'Performance issues');
 * ```
 */
export declare const suspendContract: (contract: Contract, reason: string) => Contract;
/**
 * @function terminateContract
 * @description Terminates a contract
 * @param {Contract} contract - Contract to terminate
 * @param {string} reason - Termination reason
 * @returns {Contract} Terminated contract
 *
 * @example
 * ```typescript
 * const terminated = terminateContract(contract, 'Breach of contract');
 * ```
 */
export declare const terminateContract: (contract: Contract, reason: string) => Contract;
/**
 * @function renewContract
 * @description Renews a contract
 * @param {Contract} contract - Contract to renew
 * @param {Date} newEndDate - New end date
 * @param {number} newValue - New contract value
 * @returns {Contract} Renewed contract
 *
 * @example
 * ```typescript
 * const renewed = renewContract(contract, new Date('2025-12-31'), 550000);
 * ```
 */
export declare const renewContract: (contract: Contract, newEndDate: Date, newValue: number) => Contract;
/**
 * @function checkContractExpiration
 * @description Checks if contract is expiring soon
 * @param {Contract} contract - Contract to check
 * @param {number} daysThreshold - Days threshold
 * @returns {object} Expiration check result
 *
 * @example
 * ```typescript
 * const check = checkContractExpiration(contract, 30);
 * if (check.isExpiringSoon) {
 *   // Send renewal notification
 * }
 * ```
 */
export declare const checkContractExpiration: (contract: Contract, daysThreshold?: number) => {
    isExpiringSoon: boolean;
    daysRemaining: number;
    isExpired: boolean;
};
/**
 * @function createPurchaseOrder
 * @description Creates a new purchase order
 * @param {string} poNumber - PO number
 * @param {VendorId} vendorId - Vendor ID
 * @param {Date} orderDate - Order date
 * @param {Date} requiredDate - Required date
 * @param {string} department - Department
 * @param {LineItem[]} lineItems - Line items
 * @param {UserId} createdBy - Creator user ID
 * @returns {PurchaseOrder} Created purchase order
 *
 * @example
 * ```typescript
 * const po = createPurchaseOrder(
 *   'PO-2024-001',
 *   vendorId,
 *   new Date(),
 *   new Date('2024-03-01'),
 *   'IT Department',
 *   lineItems,
 *   userId
 * );
 * ```
 */
export declare const createPurchaseOrder: (poNumber: string, vendorId: VendorId, orderDate: Date, requiredDate: Date, department: string, lineItems: LineItem[], createdBy: UserId) => PurchaseOrder;
/**
 * @function approvePurchaseOrder
 * @description Approves a purchase order
 * @param {PurchaseOrder} po - Purchase order to approve
 * @param {UserId} approvedBy - Approver user ID
 * @returns {PurchaseOrder} Approved purchase order
 *
 * @example
 * ```typescript
 * const approved = approvePurchaseOrder(po, approverId);
 * ```
 */
export declare const approvePurchaseOrder: (po: PurchaseOrder, approvedBy: UserId) => PurchaseOrder;
/**
 * @function sendPurchaseOrderToVendor
 * @description Sends purchase order to vendor
 * @param {PurchaseOrder} po - Purchase order to send
 * @returns {PurchaseOrder} Updated purchase order
 *
 * @example
 * ```typescript
 * const sent = sendPurchaseOrderToVendor(po);
 * ```
 */
export declare const sendPurchaseOrderToVendor: (po: PurchaseOrder) => PurchaseOrder;
/**
 * @function receivePurchaseOrder
 * @description Marks purchase order as received
 * @param {PurchaseOrder} po - Purchase order to receive
 * @param {boolean} partial - Partial receipt flag
 * @returns {PurchaseOrder} Updated purchase order
 *
 * @example
 * ```typescript
 * const received = receivePurchaseOrder(po, false);
 * ```
 */
export declare const receivePurchaseOrder: (po: PurchaseOrder, partial?: boolean) => PurchaseOrder;
/**
 * @function calculatePOTotal
 * @description Calculates purchase order total with tax
 * @param {LineItem[]} lineItems - Line items
 * @param {number} taxRate - Tax rate (0-1)
 * @returns {object} Calculated totals
 *
 * @example
 * ```typescript
 * const totals = calculatePOTotal(lineItems, 0.08);
 * ```
 */
export declare const calculatePOTotal: (lineItems: LineItem[], taxRate: number) => {
    subtotal: number;
    tax: number;
    total: number;
};
/**
 * @function createVendor
 * @description Creates a new vendor record
 * @param {string} name - Vendor name
 * @param {string} businessType - Business type
 * @param {string} taxId - Tax ID
 * @param {VendorAddress} address - Vendor address
 * @param {VendorContact} contact - Contact information
 * @returns {Vendor} Created vendor
 *
 * @example
 * ```typescript
 * const vendor = createVendor(
 *   'Tech Solutions Inc',
 *   'Corporation',
 *   '12-3456789',
 *   address,
 *   contact
 * );
 * ```
 */
export declare const createVendor: (name: string, businessType: string, taxId: string, address: VendorAddress, contact: VendorContact) => Vendor;
/**
 * @function qualifyVendor
 * @description Qualifies a vendor
 * @param {Vendor} vendor - Vendor to qualify
 * @returns {Vendor} Qualified vendor
 *
 * @example
 * ```typescript
 * const qualified = qualifyVendor(vendor);
 * ```
 */
export declare const qualifyVendor: (vendor: Vendor) => Vendor;
/**
 * @function disqualifyVendor
 * @description Disqualifies a vendor
 * @param {Vendor} vendor - Vendor to disqualify
 * @param {string} reason - Disqualification reason
 * @returns {Vendor} Disqualified vendor
 *
 * @example
 * ```typescript
 * const disqualified = disqualifyVendor(vendor, 'Failed financial review');
 * ```
 */
export declare const disqualifyVendor: (vendor: Vendor, reason: string) => Vendor;
/**
 * @function addVendorCertification
 * @description Adds certification to vendor
 * @param {Vendor} vendor - Vendor
 * @param {Certification} certification - Certification to add
 * @returns {Vendor} Updated vendor
 *
 * @example
 * ```typescript
 * const updated = addVendorCertification(vendor, certification);
 * ```
 */
export declare const addVendorCertification: (vendor: Vendor, certification: Certification) => Vendor;
/**
 * @function checkCertificationExpiry
 * @description Checks if vendor certifications are expired
 * @param {Vendor} vendor - Vendor to check
 * @returns {Certification[]} Expired certifications
 *
 * @example
 * ```typescript
 * const expired = checkCertificationExpiry(vendor);
 * ```
 */
export declare const checkCertificationExpiry: (vendor: Vendor) => Certification[];
/**
 * @function createContractAmendment
 * @description Creates a contract amendment
 * @param {ContractId} contractId - Contract ID
 * @param {number} amendmentNumber - Amendment number
 * @param {AmendmentType} type - Amendment type
 * @param {string} description - Description
 * @param {AmendmentChange[]} changes - Changes
 * @param {Date} effectiveDate - Effective date
 * @param {UserId} createdBy - Creator user ID
 * @returns {ContractAmendment} Created amendment
 *
 * @example
 * ```typescript
 * const amendment = createContractAmendment(
 *   contractId,
 *   1,
 *   AmendmentType.PRICE_ADJUSTMENT,
 *   'Price increase due to inflation',
 *   changes,
 *   new Date('2024-04-01'),
 *   userId
 * );
 * ```
 */
export declare const createContractAmendment: (contractId: ContractId, amendmentNumber: number, type: AmendmentType, description: string, changes: AmendmentChange[], effectiveDate: Date, createdBy: UserId) => ContractAmendment;
/**
 * @function applyContractAmendment
 * @description Applies amendment to contract
 * @param {Contract} contract - Contract to amend
 * @param {ContractAmendment} amendment - Amendment to apply
 * @returns {Contract} Amended contract
 *
 * @example
 * ```typescript
 * const amended = applyContractAmendment(contract, amendment);
 * ```
 */
export declare const applyContractAmendment: (contract: Contract, amendment: ContractAmendment) => Contract;
/**
 * @function createSoleSourceJustification
 * @description Creates sole source justification
 * @param {ProcurementId} procurementId - Procurement ID
 * @param {VendorId} vendorId - Vendor ID
 * @param {string} reason - Reason for sole source
 * @param {string} justification - Detailed justification
 * @returns {SoleSourceJustification} Created justification
 *
 * @example
 * ```typescript
 * const justification = createSoleSourceJustification(
 *   procurementId,
 *   vendorId,
 *   'Only qualified vendor',
 *   'This vendor holds exclusive rights...'
 * );
 * ```
 */
export declare const createSoleSourceJustification: (procurementId: ProcurementId, vendorId: VendorId, reason: string, justification: string) => SoleSourceJustification;
/**
 * @function validateSoleSourceJustification
 * @description Validates sole source justification completeness
 * @param {SoleSourceJustification} justification - Justification to validate
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateSoleSourceJustification(justification);
 * if (!validation.isValid) {
 *   console.log(validation.errors);
 * }
 * ```
 */
export declare const validateSoleSourceJustification: (justification: SoleSourceJustification) => {
    isValid: boolean;
    errors: string[];
};
/**
 * @function createComplianceCheck
 * @description Creates a compliance check record
 * @param {ContractId} contractId - Contract ID
 * @param {string} checkType - Type of compliance check
 * @param {UserId} performedBy - User performing check
 * @returns {ComplianceCheck} Created compliance check
 *
 * @example
 * ```typescript
 * const check = createComplianceCheck(
 *   contractId,
 *   'Quarterly Review',
 *   userId
 * );
 * ```
 */
export declare const createComplianceCheck: (contractId: ContractId, checkType: string, performedBy: UserId) => ComplianceCheck;
/**
 * @function addComplianceFinding
 * @description Adds a compliance finding
 * @param {ComplianceCheck} check - Compliance check
 * @param {ComplianceFinding} finding - Finding to add
 * @returns {ComplianceCheck} Updated compliance check
 *
 * @example
 * ```typescript
 * const updated = addComplianceFinding(check, finding);
 * ```
 */
export declare const addComplianceFinding: (check: ComplianceCheck, finding: ComplianceFinding) => ComplianceCheck;
/**
 * @function trackContractCompliance
 * @description Tracks overall contract compliance
 * @param {Contract} contract - Contract to track
 * @param {ComplianceCheck[]} checks - All compliance checks
 * @returns {object} Compliance summary
 *
 * @example
 * ```typescript
 * const summary = trackContractCompliance(contract, checks);
 * ```
 */
export declare const trackContractCompliance: (contract: Contract, checks: ComplianceCheck[]) => {
    totalChecks: number;
    compliantChecks: number;
    openFindings: number;
    criticalFindings: number;
    complianceRate: number;
};
/**
 * @function createApprovalWorkflow
 * @description Creates an approval workflow
 * @param {string} entityType - Entity type
 * @param {string} entityId - Entity ID
 * @param {ApprovalStep[]} steps - Approval steps
 * @returns {ApprovalWorkflow} Created workflow
 *
 * @example
 * ```typescript
 * const workflow = createApprovalWorkflow('contract', contractId, steps);
 * ```
 */
export declare const createApprovalWorkflow: (entityType: "procurement" | "contract" | "purchase_order" | "amendment", entityId: string, steps: ApprovalStep[]) => ApprovalWorkflow;
/**
 * @function approveWorkflowStep
 * @description Approves a workflow step
 * @param {ApprovalWorkflow} workflow - Workflow
 * @param {number} stepNumber - Step number to approve
 * @param {UserId} approverId - Approver user ID
 * @param {string} comments - Approval comments
 * @returns {ApprovalWorkflow} Updated workflow
 *
 * @example
 * ```typescript
 * const updated = approveWorkflowStep(workflow, 1, userId, 'Approved');
 * ```
 */
export declare const approveWorkflowStep: (workflow: ApprovalWorkflow, stepNumber: number, approverId: UserId, comments?: string) => ApprovalWorkflow;
/**
 * @function rejectWorkflowStep
 * @description Rejects a workflow step
 * @param {ApprovalWorkflow} workflow - Workflow
 * @param {number} stepNumber - Step number to reject
 * @param {UserId} approverId - Approver user ID
 * @param {string} comments - Rejection comments
 * @returns {ApprovalWorkflow} Updated workflow
 *
 * @example
 * ```typescript
 * const rejected = rejectWorkflowStep(workflow, 1, userId, 'Needs revision');
 * ```
 */
export declare const rejectWorkflowStep: (workflow: ApprovalWorkflow, stepNumber: number, approverId: UserId, comments: string) => ApprovalWorkflow;
declare const _default: {
    createProcurementId: () => ProcurementId;
    createContractId: () => ContractId;
    createBidId: () => BidId;
    createVendorId: () => VendorId;
    createPurchaseOrderId: () => PurchaseOrderId;
    createAmendmentId: () => AmendmentId;
    createProcurementRequest: (type: ProcurementType, method: ProcurementMethod, title: string, description: string, department: string, estimatedValue: number, createdBy: UserId) => ProcurementRequest;
    publishProcurement: (procurement: ProcurementRequest, closeDate: Date, openDate: Date) => ProcurementRequest;
    addEvaluationCriteria: (procurement: ProcurementRequest, criteria: EvaluationCriteria) => ProcurementRequest;
    closeBidding: (procurement: ProcurementRequest) => ProcurementRequest;
    cancelProcurement: (procurement: ProcurementRequest, reason: string) => ProcurementRequest;
    createBid: (procurementId: ProcurementId, vendorId: VendorId, bidAmount: number) => Bid;
    evaluateBid: (bid: Bid, scores: CriteriaScore[], evaluatedBy: UserId) => BidEvaluationResult;
    calculateTechnicalScore: (scores: CriteriaScore[]) => number;
    calculatePriceScore: (bidAmount: number, lowestBid: number, maxScore: number) => number;
    rankBids: (evaluations: BidEvaluationResult[]) => BidEvaluationResult[];
    identifyLowestResponsiveBid: (bids: Bid[], evaluations: BidEvaluationResult[]) => Bid | null;
    createContract: (contractNumber: string, type: ContractType, vendorId: VendorId, title: string, startDate: Date, endDate: Date, value: number, department: string, createdBy: UserId) => Contract;
    activateContract: (contract: Contract, approvedBy: UserId) => Contract;
    suspendContract: (contract: Contract, reason: string) => Contract;
    terminateContract: (contract: Contract, reason: string) => Contract;
    renewContract: (contract: Contract, newEndDate: Date, newValue: number) => Contract;
    checkContractExpiration: (contract: Contract, daysThreshold?: number) => {
        isExpiringSoon: boolean;
        daysRemaining: number;
        isExpired: boolean;
    };
    createPurchaseOrder: (poNumber: string, vendorId: VendorId, orderDate: Date, requiredDate: Date, department: string, lineItems: LineItem[], createdBy: UserId) => PurchaseOrder;
    approvePurchaseOrder: (po: PurchaseOrder, approvedBy: UserId) => PurchaseOrder;
    sendPurchaseOrderToVendor: (po: PurchaseOrder) => PurchaseOrder;
    receivePurchaseOrder: (po: PurchaseOrder, partial?: boolean) => PurchaseOrder;
    calculatePOTotal: (lineItems: LineItem[], taxRate: number) => {
        subtotal: number;
        tax: number;
        total: number;
    };
    createVendor: (name: string, businessType: string, taxId: string, address: VendorAddress, contact: VendorContact) => Vendor;
    qualifyVendor: (vendor: Vendor) => Vendor;
    disqualifyVendor: (vendor: Vendor, reason: string) => Vendor;
    addVendorCertification: (vendor: Vendor, certification: Certification) => Vendor;
    checkCertificationExpiry: (vendor: Vendor) => Certification[];
    createContractAmendment: (contractId: ContractId, amendmentNumber: number, type: AmendmentType, description: string, changes: AmendmentChange[], effectiveDate: Date, createdBy: UserId) => ContractAmendment;
    applyContractAmendment: (contract: Contract, amendment: ContractAmendment) => Contract;
    createSoleSourceJustification: (procurementId: ProcurementId, vendorId: VendorId, reason: string, justification: string) => SoleSourceJustification;
    validateSoleSourceJustification: (justification: SoleSourceJustification) => {
        isValid: boolean;
        errors: string[];
    };
    createComplianceCheck: (contractId: ContractId, checkType: string, performedBy: UserId) => ComplianceCheck;
    addComplianceFinding: (check: ComplianceCheck, finding: ComplianceFinding) => ComplianceCheck;
    trackContractCompliance: (contract: Contract, checks: ComplianceCheck[]) => {
        totalChecks: number;
        compliantChecks: number;
        openFindings: number;
        criticalFindings: number;
        complianceRate: number;
    };
    createApprovalWorkflow: (entityType: "procurement" | "contract" | "purchase_order" | "amendment", entityId: string, steps: ApprovalStep[]) => ApprovalWorkflow;
    approveWorkflowStep: (workflow: ApprovalWorkflow, stepNumber: number, approverId: UserId, comments?: string) => ApprovalWorkflow;
    rejectWorkflowStep: (workflow: ApprovalWorkflow, stepNumber: number, approverId: UserId, comments: string) => ApprovalWorkflow;
};
export default _default;
//# sourceMappingURL=procurement-contract-management-kit.d.ts.map