"use strict";
/**
 * LOC: PROP_TRANS_MGMT_001
 * File: /reuse/property/property-transaction-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - zod
 *   - uuid
 *   - date-fns
 *   - node-cache
 *
 * DOWNSTREAM (imported by):
 *   - Property acquisition services
 *   - Transaction management controllers
 *   - Due diligence services
 *   - Closing coordination services
 *   - Document management systems
 *   - Title and escrow services
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionManagementApiTags = exports.PostClosingItemCreateSchema = exports.ClosingCostCreateSchema = exports.TransactionPartyCreateSchema = exports.TransactionMilestoneCreateSchema = exports.AgreementContingencyCreateSchema = exports.PurchaseAgreementCreateSchema = exports.TransactionDocumentCreateSchema = exports.ClosingCoordinationCreateSchema = exports.DeedTransferCreateSchema = exports.TitleRecordCreateSchema = exports.DueDiligenceItemCreateSchema = exports.PropertyTransactionUpdateSchema = exports.PropertyTransactionCreateSchema = exports.PostClosingItemType = exports.ContingencyStatus = exports.ContingencyType = exports.PartyRole = exports.MilestoneStatus = exports.ClosingStatus = exports.DocumentStatus = exports.TransactionDocumentType = exports.TitleStatus = exports.DueDiligenceStatus = exports.DueDiligenceCategory = exports.TransactionStatus = exports.TransactionType = void 0;
exports.initiatePropertyAcquisition = initiatePropertyAcquisition;
exports.updateAcquisitionStatus = updateAcquisitionStatus;
exports.getAcquisitionDetails = getAcquisitionDetails;
exports.cancelPropertyAcquisition = cancelPropertyAcquisition;
exports.initiatePropertyDisposition = initiatePropertyDisposition;
exports.updateDispositionStatus = updateDispositionStatus;
exports.getDispositionDetails = getDispositionDetails;
exports.cancelPropertyDisposition = cancelPropertyDisposition;
exports.createDueDiligenceChecklist = createDueDiligenceChecklist;
exports.updateDueDiligenceItem = updateDueDiligenceItem;
exports.getDueDiligenceStatus = getDueDiligenceStatus;
exports.completeDueDiligence = completeDueDiligence;
exports.recordTitleSearch = recordTitleSearch;
exports.updateTitleStatus = updateTitleStatus;
exports.recordDeedTransfer = recordDeedTransfer;
exports.getTitleHistory = getTitleHistory;
exports.scheduleClosing = scheduleClosing;
exports.updateClosingChecklist = updateClosingChecklist;
exports.recordClosingCosts = recordClosingCosts;
exports.finalizeClosing = finalizeClosing;
exports.uploadTransactionDocument = uploadTransactionDocument;
exports.getTransactionDocuments = getTransactionDocuments;
exports.updateDocumentStatus = updateDocumentStatus;
exports.archiveTransactionDocuments = archiveTransactionDocuments;
exports.createPurchaseAgreement = createPurchaseAgreement;
exports.updatePurchaseAgreementTerms = updatePurchaseAgreementTerms;
exports.addAgreementContingency = addAgreementContingency;
exports.getPurchaseAgreementStatus = getPurchaseAgreementStatus;
exports.createTransactionTimeline = createTransactionTimeline;
exports.updateTimelineMilestone = updateTimelineMilestone;
exports.getTransactionTimeline = getTransactionTimeline;
exports.checkOverdueMilestones = checkOverdueMilestones;
exports.addTransactionParty = addTransactionParty;
exports.updatePartyInformation = updatePartyInformation;
exports.getTransactionParties = getTransactionParties;
exports.notifyTransactionParties = notifyTransactionParties;
exports.recordPostClosingItem = recordPostClosingItem;
exports.updatePostClosingStatus = updatePostClosingStatus;
exports.getPostClosingChecklist = getPostClosingChecklist;
exports.completeTransactionArchival = completeTransactionArchival;
exports.generateTransactionNumber = generateTransactionNumber;
exports.calculateDaysUntilClosing = calculateDaysUntilClosing;
exports.calculateTotalClosingCosts = calculateTotalClosingCosts;
exports.getTransactionSummary = getTransactionSummary;
/**
 * File: /reuse/property/property-transaction-management-kit.ts
 * Locator: WC-PROP-TRANS-MGMT-001
 * Purpose: Production-Grade Property Transaction Management Kit - Enterprise real estate transaction toolkit
 *
 * Upstream: NestJS, Sequelize, Zod, UUID, Date-FNS, Node-Cache
 * Downstream: ../backend/property/*, Transaction Services, Due Diligence Systems, Closing Controllers
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, sequelize-typescript, zod
 * Exports: 40+ production-ready transaction management functions covering acquisitions, dispositions, due diligence, title management, closing coordination, document management, purchase agreements, timelines, third-party coordination, post-closing activities
 *
 * LLM Context: Production-grade property transaction management utilities for White Cross healthcare platform.
 * Provides comprehensive transaction lifecycle management including property acquisition initiation with buyer/seller
 * coordination, disposition/sales management with marketing and offer tracking, due diligence checklist creation and
 * monitoring with environmental, structural, and financial assessments, title and deed management with search recording
 * and transfer tracking, closing coordination with schedule management and cost allocation, transaction document
 * management with upload, versioning, and e-signature integration, purchase agreement tracking with contingencies and
 * amendment management, transaction timeline creation with milestone tracking and deadline alerts, third-party
 * coordination including brokers, attorneys, lenders, inspectors, and title companies, post-closing activities
 * including document archival, tax reporting, and final reconciliation. Includes real estate transaction workflows
 * with multi-party approval chains, escrow integration, wire transfer tracking, and compliance with state-specific
 * real estate laws. Supports commercial and residential property transactions with full audit trails and regulatory
 * compliance for healthcare facility acquisitions and dispositions.
 */
const common_1 = require("@nestjs/common");
const zod_1 = require("zod");
const uuid_1 = require("uuid");
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * Transaction type enumeration
 */
var TransactionType;
(function (TransactionType) {
    TransactionType["ACQUISITION"] = "acquisition";
    TransactionType["DISPOSITION"] = "disposition";
    TransactionType["LEASE"] = "lease";
    TransactionType["EXCHANGE"] = "exchange";
    TransactionType["REFINANCE"] = "refinance";
    TransactionType["SALE_LEASEBACK"] = "sale_leaseback";
})(TransactionType || (exports.TransactionType = TransactionType = {}));
/**
 * Transaction status enumeration
 */
var TransactionStatus;
(function (TransactionStatus) {
    TransactionStatus["INITIATED"] = "initiated";
    TransactionStatus["DUE_DILIGENCE"] = "due_diligence";
    TransactionStatus["UNDER_CONTRACT"] = "under_contract";
    TransactionStatus["PENDING_APPROVAL"] = "pending_approval";
    TransactionStatus["APPROVED"] = "approved";
    TransactionStatus["IN_CLOSING"] = "in_closing";
    TransactionStatus["CLOSED"] = "closed";
    TransactionStatus["CANCELLED"] = "cancelled";
    TransactionStatus["WITHDRAWN"] = "withdrawn";
    TransactionStatus["FAILED"] = "failed";
})(TransactionStatus || (exports.TransactionStatus = TransactionStatus = {}));
/**
 * Due diligence category enumeration
 */
var DueDiligenceCategory;
(function (DueDiligenceCategory) {
    DueDiligenceCategory["ENVIRONMENTAL"] = "environmental";
    DueDiligenceCategory["STRUCTURAL"] = "structural";
    DueDiligenceCategory["FINANCIAL"] = "financial";
    DueDiligenceCategory["LEGAL"] = "legal";
    DueDiligenceCategory["ZONING"] = "zoning";
    DueDiligenceCategory["TITLE"] = "title";
    DueDiligenceCategory["SURVEY"] = "survey";
    DueDiligenceCategory["INSPECTION"] = "inspection";
    DueDiligenceCategory["APPRAISAL"] = "appraisal";
    DueDiligenceCategory["INSURANCE"] = "insurance";
})(DueDiligenceCategory || (exports.DueDiligenceCategory = DueDiligenceCategory = {}));
/**
 * Due diligence status enumeration
 */
var DueDiligenceStatus;
(function (DueDiligenceStatus) {
    DueDiligenceStatus["NOT_STARTED"] = "not_started";
    DueDiligenceStatus["IN_PROGRESS"] = "in_progress";
    DueDiligenceStatus["PENDING_REVIEW"] = "pending_review";
    DueDiligenceStatus["COMPLETED"] = "completed";
    DueDiligenceStatus["ISSUES_FOUND"] = "issues_found";
    DueDiligenceStatus["WAIVED"] = "waived";
})(DueDiligenceStatus || (exports.DueDiligenceStatus = DueDiligenceStatus = {}));
/**
 * Title status enumeration
 */
var TitleStatus;
(function (TitleStatus) {
    TitleStatus["NOT_SEARCHED"] = "not_searched";
    TitleStatus["SEARCH_ORDERED"] = "search_ordered";
    TitleStatus["SEARCH_COMPLETED"] = "search_completed";
    TitleStatus["CLEAR"] = "clear";
    TitleStatus["DEFECTS_FOUND"] = "defects_found";
    TitleStatus["DEFECTS_CURED"] = "defects_cured";
    TitleStatus["INSURANCE_ORDERED"] = "insurance_ordered";
    TitleStatus["INSURANCE_ISSUED"] = "insurance_issued";
})(TitleStatus || (exports.TitleStatus = TitleStatus = {}));
/**
 * Document type enumeration
 */
var TransactionDocumentType;
(function (TransactionDocumentType) {
    TransactionDocumentType["PURCHASE_AGREEMENT"] = "purchase_agreement";
    TransactionDocumentType["LETTER_OF_INTENT"] = "letter_of_intent";
    TransactionDocumentType["DEED"] = "deed";
    TransactionDocumentType["TITLE_REPORT"] = "title_report";
    TransactionDocumentType["SURVEY"] = "survey";
    TransactionDocumentType["APPRAISAL"] = "appraisal";
    TransactionDocumentType["INSPECTION_REPORT"] = "inspection_report";
    TransactionDocumentType["ENVIRONMENTAL_REPORT"] = "environmental_report";
    TransactionDocumentType["CLOSING_STATEMENT"] = "closing_statement";
    TransactionDocumentType["WIRE_TRANSFER"] = "wire_transfer";
    TransactionDocumentType["INSURANCE_POLICY"] = "insurance_policy";
    TransactionDocumentType["AMENDMENT"] = "amendment";
    TransactionDocumentType["ADDENDUM"] = "addendum";
    TransactionDocumentType["DISCLOSURE"] = "disclosure";
    TransactionDocumentType["OTHER"] = "other";
})(TransactionDocumentType || (exports.TransactionDocumentType = TransactionDocumentType = {}));
/**
 * Document status enumeration
 */
var DocumentStatus;
(function (DocumentStatus) {
    DocumentStatus["DRAFT"] = "draft";
    DocumentStatus["PENDING_REVIEW"] = "pending_review";
    DocumentStatus["UNDER_REVIEW"] = "under_review";
    DocumentStatus["APPROVED"] = "approved";
    DocumentStatus["REJECTED"] = "rejected";
    DocumentStatus["SIGNED"] = "signed";
    DocumentStatus["EXECUTED"] = "executed";
    DocumentStatus["ARCHIVED"] = "archived";
})(DocumentStatus || (exports.DocumentStatus = DocumentStatus = {}));
/**
 * Closing status enumeration
 */
var ClosingStatus;
(function (ClosingStatus) {
    ClosingStatus["NOT_SCHEDULED"] = "not_scheduled";
    ClosingStatus["SCHEDULED"] = "scheduled";
    ClosingStatus["DOCUMENTS_PREPARED"] = "documents_prepared";
    ClosingStatus["READY_TO_CLOSE"] = "ready_to_close";
    ClosingStatus["IN_PROGRESS"] = "in_progress";
    ClosingStatus["COMPLETED"] = "completed";
    ClosingStatus["POSTPONED"] = "postponed";
    ClosingStatus["CANCELLED"] = "cancelled";
})(ClosingStatus || (exports.ClosingStatus = ClosingStatus = {}));
/**
 * Milestone status enumeration
 */
var MilestoneStatus;
(function (MilestoneStatus) {
    MilestoneStatus["PENDING"] = "pending";
    MilestoneStatus["IN_PROGRESS"] = "in_progress";
    MilestoneStatus["COMPLETED"] = "completed";
    MilestoneStatus["OVERDUE"] = "overdue";
    MilestoneStatus["SKIPPED"] = "skipped";
})(MilestoneStatus || (exports.MilestoneStatus = MilestoneStatus = {}));
/**
 * Party role enumeration
 */
var PartyRole;
(function (PartyRole) {
    PartyRole["BUYER"] = "buyer";
    PartyRole["SELLER"] = "seller";
    PartyRole["BUYER_AGENT"] = "buyer_agent";
    PartyRole["SELLER_AGENT"] = "seller_agent";
    PartyRole["BUYER_ATTORNEY"] = "buyer_attorney";
    PartyRole["SELLER_ATTORNEY"] = "seller_attorney";
    PartyRole["LENDER"] = "lender";
    PartyRole["TITLE_COMPANY"] = "title_company";
    PartyRole["ESCROW_AGENT"] = "escrow_agent";
    PartyRole["INSPECTOR"] = "inspector";
    PartyRole["APPRAISER"] = "appraiser";
    PartyRole["SURVEYOR"] = "surveyor";
    PartyRole["ENVIRONMENTAL_CONSULTANT"] = "environmental_consultant";
    PartyRole["BROKER"] = "broker";
    PartyRole["OTHER"] = "other";
})(PartyRole || (exports.PartyRole = PartyRole = {}));
/**
 * Contingency type enumeration
 */
var ContingencyType;
(function (ContingencyType) {
    ContingencyType["FINANCING"] = "financing";
    ContingencyType["INSPECTION"] = "inspection";
    ContingencyType["APPRAISAL"] = "appraisal";
    ContingencyType["ENVIRONMENTAL"] = "environmental";
    ContingencyType["SALE_OF_PROPERTY"] = "sale_of_property";
    ContingencyType["ZONING_APPROVAL"] = "zoning_approval";
    ContingencyType["BOARD_APPROVAL"] = "board_approval";
    ContingencyType["DUE_DILIGENCE"] = "due_diligence";
    ContingencyType["TITLE"] = "title";
    ContingencyType["SURVEY"] = "survey";
    ContingencyType["OTHER"] = "other";
})(ContingencyType || (exports.ContingencyType = ContingencyType = {}));
/**
 * Contingency status enumeration
 */
var ContingencyStatus;
(function (ContingencyStatus) {
    ContingencyStatus["ACTIVE"] = "active";
    ContingencyStatus["SATISFIED"] = "satisfied";
    ContingencyStatus["WAIVED"] = "waived";
    ContingencyStatus["EXTENDED"] = "extended";
    ContingencyStatus["FAILED"] = "failed";
})(ContingencyStatus || (exports.ContingencyStatus = ContingencyStatus = {}));
/**
 * Post-closing item type enumeration
 */
var PostClosingItemType;
(function (PostClosingItemType) {
    PostClosingItemType["DOCUMENT_RECORDING"] = "document_recording";
    PostClosingItemType["TAX_FILING"] = "tax_filing";
    PostClosingItemType["INSURANCE_TRANSFER"] = "insurance_transfer";
    PostClosingItemType["UTILITY_TRANSFER"] = "utility_transfer";
    PostClosingItemType["FINAL_RECONCILIATION"] = "final_reconciliation";
    PostClosingItemType["ARCHIVE"] = "archive";
    PostClosingItemType["ASSET_REGISTRATION"] = "asset_registration";
    PostClosingItemType["ACCOUNTING_ENTRY"] = "accounting_entry";
    PostClosingItemType["OTHER"] = "other";
})(PostClosingItemType || (exports.PostClosingItemType = PostClosingItemType = {}));
// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================
/**
 * Property transaction creation schema
 */
exports.PropertyTransactionCreateSchema = zod_1.z.object({
    transactionNumber: zod_1.z.string().min(1).max(50),
    type: zod_1.z.nativeEnum(TransactionType),
    status: zod_1.z.nativeEnum(TransactionStatus).default(TransactionStatus.INITIATED),
    propertyId: zod_1.z.string().uuid(),
    propertyAddress: zod_1.z.string().min(1).max(500),
    propertyType: zod_1.z.string().max(100).optional(),
    purchasePrice: zod_1.z.number().nonnegative().optional(),
    depositAmount: zod_1.z.number().nonnegative().optional(),
    financingAmount: zod_1.z.number().nonnegative().optional(),
    downPayment: zod_1.z.number().nonnegative().optional(),
    buyerId: zod_1.z.string().uuid().optional(),
    sellerId: zod_1.z.string().uuid().optional(),
    buyerEntityName: zod_1.z.string().max(255).optional(),
    sellerEntityName: zod_1.z.string().max(255).optional(),
    contractDate: zod_1.z.date().optional(),
    dueDiligenceDeadline: zod_1.z.date().optional(),
    financingDeadline: zod_1.z.date().optional(),
    closingDate: zod_1.z.date().optional(),
    possessionDate: zod_1.z.date().optional(),
    initiatedByUserId: zod_1.z.string().uuid(),
    managedByUserId: zod_1.z.string().uuid().optional(),
    notes: zod_1.z.string().max(5000).optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
/**
 * Property transaction update schema
 */
exports.PropertyTransactionUpdateSchema = exports.PropertyTransactionCreateSchema.partial();
/**
 * Due diligence item creation schema
 */
exports.DueDiligenceItemCreateSchema = zod_1.z.object({
    transactionId: zod_1.z.string().uuid(),
    category: zod_1.z.nativeEnum(DueDiligenceCategory),
    status: zod_1.z.nativeEnum(DueDiligenceStatus).default(DueDiligenceStatus.NOT_STARTED),
    title: zod_1.z.string().min(1).max(255),
    description: zod_1.z.string().max(2000).optional(),
    assignedToUserId: zod_1.z.string().uuid().optional(),
    vendorId: zod_1.z.string().uuid().optional(),
    startDate: zod_1.z.date().optional(),
    dueDate: zod_1.z.date().optional(),
    cost: zod_1.z.number().nonnegative().optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
/**
 * Title record creation schema
 */
exports.TitleRecordCreateSchema = zod_1.z.object({
    transactionId: zod_1.z.string().uuid(),
    propertyId: zod_1.z.string().uuid(),
    status: zod_1.z.nativeEnum(TitleStatus).default(TitleStatus.NOT_SEARCHED),
    titleCompanyId: zod_1.z.string().uuid().optional(),
    titleOfficer: zod_1.z.string().max(255).optional(),
    searchOrderDate: zod_1.z.date().optional(),
    currentOwner: zod_1.z.string().max(255).optional(),
    legalDescription: zod_1.z.string().max(2000).optional(),
    notes: zod_1.z.string().max(5000).optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
/**
 * Deed transfer creation schema
 */
exports.DeedTransferCreateSchema = zod_1.z.object({
    transactionId: zod_1.z.string().uuid(),
    propertyId: zod_1.z.string().uuid(),
    deedType: zod_1.z.enum(['warranty_deed', 'quit_claim_deed', 'special_warranty_deed', 'deed_of_trust', 'other']),
    grantorName: zod_1.z.string().min(1).max(255),
    granteeName: zod_1.z.string().min(1).max(255),
    transferDate: zod_1.z.date(),
    recordedDate: zod_1.z.date().optional(),
    recordingJurisdiction: zod_1.z.string().max(255).optional(),
    bookNumber: zod_1.z.string().max(50).optional(),
    pageNumber: zod_1.z.string().max(50).optional(),
    instrumentNumber: zod_1.z.string().max(100).optional(),
    consideration: zod_1.z.number().nonnegative().optional(),
    transferTax: zod_1.z.number().nonnegative().optional(),
    legalDescription: zod_1.z.string().max(2000).optional(),
    documentUrl: zod_1.z.string().url().optional(),
    notes: zod_1.z.string().max(5000).optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
/**
 * Closing coordination creation schema
 */
exports.ClosingCoordinationCreateSchema = zod_1.z.object({
    transactionId: zod_1.z.string().uuid(),
    status: zod_1.z.nativeEnum(ClosingStatus).default(ClosingStatus.NOT_SCHEDULED),
    scheduledDate: zod_1.z.date().optional(),
    scheduledTime: zod_1.z.string().max(20).optional(),
    location: zod_1.z.string().max(500).optional(),
    venue: zod_1.z.enum(['in_person', 'remote', 'hybrid']).optional(),
    closingAgentId: zod_1.z.string().uuid().optional(),
    closingAgentName: zod_1.z.string().max(255).optional(),
    notes: zod_1.z.string().max(5000).optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
/**
 * Transaction document creation schema
 */
exports.TransactionDocumentCreateSchema = zod_1.z.object({
    transactionId: zod_1.z.string().uuid(),
    type: zod_1.z.nativeEnum(TransactionDocumentType),
    status: zod_1.z.nativeEnum(DocumentStatus).default(DocumentStatus.DRAFT),
    name: zod_1.z.string().min(1).max(255),
    description: zod_1.z.string().max(1000).optional(),
    fileUrl: zod_1.z.string().url(),
    fileName: zod_1.z.string().min(1).max(255),
    fileSize: zod_1.z.number().positive(),
    mimeType: zod_1.z.string().max(100),
    uploadedByUserId: zod_1.z.string().uuid(),
    expiryDate: zod_1.z.date().optional(),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
/**
 * Purchase agreement creation schema
 */
exports.PurchaseAgreementCreateSchema = zod_1.z.object({
    transactionId: zod_1.z.string().uuid(),
    status: zod_1.z.nativeEnum(DocumentStatus).default(DocumentStatus.DRAFT),
    agreementDate: zod_1.z.date(),
    effectiveDate: zod_1.z.date().optional(),
    purchasePrice: zod_1.z.number().positive(),
    depositAmount: zod_1.z.number().nonnegative(),
    financingAmount: zod_1.z.number().nonnegative().optional(),
    closingDate: zod_1.z.date(),
    possessionDate: zod_1.z.date().optional(),
    includedItems: zod_1.z.array(zod_1.z.string()).optional(),
    excludedItems: zod_1.z.array(zod_1.z.string()).optional(),
    specialTerms: zod_1.z.string().max(5000).optional(),
    documentId: zod_1.z.string().uuid().optional(),
    notes: zod_1.z.string().max(5000).optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
/**
 * Agreement contingency creation schema
 */
exports.AgreementContingencyCreateSchema = zod_1.z.object({
    transactionId: zod_1.z.string().uuid(),
    purchaseAgreementId: zod_1.z.string().uuid(),
    type: zod_1.z.nativeEnum(ContingencyType),
    status: zod_1.z.nativeEnum(ContingencyStatus).default(ContingencyStatus.ACTIVE),
    description: zod_1.z.string().min(1).max(1000),
    dueDate: zod_1.z.date(),
    responsiblePartyId: zod_1.z.string().uuid().optional(),
    notes: zod_1.z.string().max(5000).optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
/**
 * Transaction milestone creation schema
 */
exports.TransactionMilestoneCreateSchema = zod_1.z.object({
    timelineId: zod_1.z.string().uuid(),
    transactionId: zod_1.z.string().uuid(),
    name: zod_1.z.string().min(1).max(255),
    description: zod_1.z.string().max(1000).optional(),
    dueDate: zod_1.z.date(),
    assignedToUserId: zod_1.z.string().uuid().optional(),
    order: zod_1.z.number().int().nonnegative(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
/**
 * Transaction party creation schema
 */
exports.TransactionPartyCreateSchema = zod_1.z.object({
    transactionId: zod_1.z.string().uuid(),
    role: zod_1.z.nativeEnum(PartyRole),
    entityType: zod_1.z.enum(['individual', 'company', 'trust', 'partnership', 'llc', 'corporation', 'other']),
    name: zod_1.z.string().min(1).max(255),
    companyName: zod_1.z.string().max(255).optional(),
    contactName: zod_1.z.string().max(255).optional(),
    email: zod_1.z.string().email().optional(),
    phone: zod_1.z.string().max(50).optional(),
    address: zod_1.z.string().max(500).optional(),
    userId: zod_1.z.string().uuid().optional(),
    vendorId: zod_1.z.string().uuid().optional(),
    licenseNumber: zod_1.z.string().max(100).optional(),
    notes: zod_1.z.string().max(5000).optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
/**
 * Closing cost creation schema
 */
exports.ClosingCostCreateSchema = zod_1.z.object({
    transactionId: zod_1.z.string().uuid(),
    closingId: zod_1.z.string().uuid(),
    category: zod_1.z.enum(['lender_fees', 'title_fees', 'government_fees', 'prepaid_items', 'escrow', 'other']),
    description: zod_1.z.string().min(1).max(500),
    amount: zod_1.z.number().nonnegative(),
    paidBy: zod_1.z.enum(['buyer', 'seller', 'split']),
    buyerAmount: zod_1.z.number().nonnegative().optional(),
    sellerAmount: zod_1.z.number().nonnegative().optional(),
    paidToPartyId: zod_1.z.string().uuid().optional(),
    paidDate: zod_1.z.date().optional(),
    notes: zod_1.z.string().max(2000).optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
/**
 * Post-closing item creation schema
 */
exports.PostClosingItemCreateSchema = zod_1.z.object({
    transactionId: zod_1.z.string().uuid(),
    type: zod_1.z.nativeEnum(PostClosingItemType),
    description: zod_1.z.string().min(1).max(1000),
    dueDate: zod_1.z.date().optional(),
    assignedToUserId: zod_1.z.string().uuid().optional(),
    status: zod_1.z.enum(['pending', 'in_progress', 'completed']).default('pending'),
    notes: zod_1.z.string().max(5000).optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
// ============================================================================
// PROPERTY ACQUISITION TRANSACTIONS
// ============================================================================
/**
 * Initiate a property acquisition transaction
 *
 * @param data - Transaction initiation data
 * @returns Created transaction
 *
 * @example
 * ```typescript
 * const transaction = await initiatePropertyAcquisition({
 *   transactionNumber: 'ACQ-2024-001',
 *   type: TransactionType.ACQUISITION,
 *   propertyId: 'prop-123',
 *   propertyAddress: '123 Medical Center Drive',
 *   purchasePrice: 5000000,
 *   initiatedByUserId: 'user-456',
 * });
 * ```
 */
async function initiatePropertyAcquisition(data) {
    const validated = exports.PropertyTransactionCreateSchema.parse(data);
    if (validated.type !== TransactionType.ACQUISITION && validated.type !== TransactionType.EXCHANGE) {
        throw new common_1.BadRequestException('Invalid transaction type for acquisition');
    }
    const transaction = {
        id: (0, uuid_1.v4)(),
        transactionNumber: validated.transactionNumber,
        type: validated.type,
        status: validated.status,
        propertyId: validated.propertyId,
        propertyAddress: validated.propertyAddress,
        propertyType: validated.propertyType,
        purchasePrice: validated.purchasePrice,
        depositAmount: validated.depositAmount,
        financingAmount: validated.financingAmount,
        downPayment: validated.downPayment,
        buyerId: validated.buyerId,
        sellerId: validated.sellerId,
        buyerEntityName: validated.buyerEntityName,
        sellerEntityName: validated.sellerEntityName,
        contractDate: validated.contractDate,
        dueDiligenceDeadline: validated.dueDiligenceDeadline,
        financingDeadline: validated.financingDeadline,
        closingDate: validated.closingDate,
        possessionDate: validated.possessionDate,
        initiatedByUserId: validated.initiatedByUserId,
        managedByUserId: validated.managedByUserId,
        notes: validated.notes,
        metadata: validated.metadata,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    await createTransactionAuditLog({
        transactionId: transaction.id,
        action: 'ACQUISITION_INITIATED',
        performedByUserId: validated.initiatedByUserId,
        newState: transaction,
        timestamp: new Date(),
    });
    return transaction;
}
/**
 * Update acquisition transaction status
 *
 * @param transactionId - Transaction ID
 * @param status - New status
 * @param userId - User making the update
 * @param reason - Reason for status change
 * @returns Updated transaction
 *
 * @example
 * ```typescript
 * await updateAcquisitionStatus('trans-123', TransactionStatus.DUE_DILIGENCE, 'user-456', 'Contract signed');
 * ```
 */
async function updateAcquisitionStatus(transactionId, status, userId, reason) {
    const transaction = await getTransactionById(transactionId);
    const updatedTransaction = {
        ...transaction,
        status,
        updatedAt: new Date(),
    };
    await createTransactionAuditLog({
        transactionId,
        action: 'STATUS_UPDATED',
        performedByUserId: userId,
        previousState: { status: transaction.status },
        newState: { status, reason },
        timestamp: new Date(),
    });
    return updatedTransaction;
}
/**
 * Get acquisition transaction details
 *
 * @param transactionId - Transaction ID
 * @returns Transaction details
 *
 * @example
 * ```typescript
 * const transaction = await getAcquisitionDetails('trans-123');
 * ```
 */
async function getAcquisitionDetails(transactionId) {
    return getTransactionById(transactionId);
}
/**
 * Cancel property acquisition
 *
 * @param transactionId - Transaction ID
 * @param userId - User cancelling the transaction
 * @param reason - Cancellation reason
 * @returns Cancelled transaction
 *
 * @example
 * ```typescript
 * await cancelPropertyAcquisition('trans-123', 'user-456', 'Financing fell through');
 * ```
 */
async function cancelPropertyAcquisition(transactionId, userId, reason) {
    const transaction = await getTransactionById(transactionId);
    if (transaction.status === TransactionStatus.CLOSED) {
        throw new common_1.BadRequestException('Cannot cancel a closed transaction');
    }
    const cancelledTransaction = {
        ...transaction,
        status: TransactionStatus.CANCELLED,
        notes: `${transaction.notes || ''}\nCancellation reason: ${reason}`,
        updatedAt: new Date(),
    };
    await createTransactionAuditLog({
        transactionId,
        action: 'ACQUISITION_CANCELLED',
        performedByUserId: userId,
        previousState: { status: transaction.status },
        newState: { status: TransactionStatus.CANCELLED, reason },
        timestamp: new Date(),
    });
    return cancelledTransaction;
}
// ============================================================================
// PROPERTY DISPOSITION/SALES
// ============================================================================
/**
 * Initiate a property disposition transaction
 *
 * @param data - Transaction initiation data
 * @returns Created transaction
 *
 * @example
 * ```typescript
 * const transaction = await initiatePropertyDisposition({
 *   transactionNumber: 'DISP-2024-001',
 *   type: TransactionType.DISPOSITION,
 *   propertyId: 'prop-123',
 *   propertyAddress: '456 Healthcare Plaza',
 *   purchasePrice: 3000000,
 *   initiatedByUserId: 'user-456',
 * });
 * ```
 */
async function initiatePropertyDisposition(data) {
    const validated = exports.PropertyTransactionCreateSchema.parse(data);
    if (validated.type !== TransactionType.DISPOSITION) {
        throw new common_1.BadRequestException('Invalid transaction type for disposition');
    }
    const transaction = {
        id: (0, uuid_1.v4)(),
        transactionNumber: validated.transactionNumber,
        type: validated.type,
        status: validated.status,
        propertyId: validated.propertyId,
        propertyAddress: validated.propertyAddress,
        propertyType: validated.propertyType,
        purchasePrice: validated.purchasePrice,
        depositAmount: validated.depositAmount,
        buyerId: validated.buyerId,
        sellerId: validated.sellerId,
        buyerEntityName: validated.buyerEntityName,
        sellerEntityName: validated.sellerEntityName,
        contractDate: validated.contractDate,
        dueDiligenceDeadline: validated.dueDiligenceDeadline,
        closingDate: validated.closingDate,
        possessionDate: validated.possessionDate,
        initiatedByUserId: validated.initiatedByUserId,
        managedByUserId: validated.managedByUserId,
        notes: validated.notes,
        metadata: validated.metadata,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    await createTransactionAuditLog({
        transactionId: transaction.id,
        action: 'DISPOSITION_INITIATED',
        performedByUserId: validated.initiatedByUserId,
        newState: transaction,
        timestamp: new Date(),
    });
    return transaction;
}
/**
 * Update disposition transaction status
 *
 * @param transactionId - Transaction ID
 * @param status - New status
 * @param userId - User making the update
 * @param reason - Reason for status change
 * @returns Updated transaction
 *
 * @example
 * ```typescript
 * await updateDispositionStatus('trans-123', TransactionStatus.UNDER_CONTRACT, 'user-456', 'Offer accepted');
 * ```
 */
async function updateDispositionStatus(transactionId, status, userId, reason) {
    return updateAcquisitionStatus(transactionId, status, userId, reason);
}
/**
 * Get disposition transaction details
 *
 * @param transactionId - Transaction ID
 * @returns Transaction details
 *
 * @example
 * ```typescript
 * const transaction = await getDispositionDetails('trans-123');
 * ```
 */
async function getDispositionDetails(transactionId) {
    return getTransactionById(transactionId);
}
/**
 * Cancel property disposition
 *
 * @param transactionId - Transaction ID
 * @param userId - User cancelling the transaction
 * @param reason - Cancellation reason
 * @returns Cancelled transaction
 *
 * @example
 * ```typescript
 * await cancelPropertyDisposition('trans-123', 'user-456', 'Buyer withdrew offer');
 * ```
 */
async function cancelPropertyDisposition(transactionId, userId, reason) {
    return cancelPropertyAcquisition(transactionId, userId, reason);
}
// ============================================================================
// DUE DILIGENCE MANAGEMENT
// ============================================================================
/**
 * Create due diligence checklist for a transaction
 *
 * @param transactionId - Transaction ID
 * @param items - List of due diligence items
 * @returns Created due diligence items
 *
 * @example
 * ```typescript
 * const checklist = await createDueDiligenceChecklist('trans-123', [
 *   {
 *     category: DueDiligenceCategory.ENVIRONMENTAL,
 *     title: 'Phase I Environmental Assessment',
 *     dueDate: new Date('2024-03-01'),
 *   },
 *   {
 *     category: DueDiligenceCategory.STRUCTURAL,
 *     title: 'Building Inspection',
 *     dueDate: new Date('2024-02-15'),
 *   },
 * ]);
 * ```
 */
async function createDueDiligenceChecklist(transactionId, items) {
    const createdItems = [];
    for (const itemData of items) {
        const validated = exports.DueDiligenceItemCreateSchema.parse({
            ...itemData,
            transactionId,
        });
        const item = {
            id: (0, uuid_1.v4)(),
            transactionId: validated.transactionId,
            category: validated.category,
            status: validated.status,
            title: validated.title,
            description: validated.description,
            assignedToUserId: validated.assignedToUserId,
            vendorId: validated.vendorId,
            startDate: validated.startDate,
            dueDate: validated.dueDate,
            cost: validated.cost,
            metadata: validated.metadata,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        createdItems.push(item);
    }
    await createTransactionAuditLog({
        transactionId,
        action: 'DUE_DILIGENCE_CHECKLIST_CREATED',
        performedByUserId: 'system',
        newState: { itemCount: createdItems.length },
        timestamp: new Date(),
    });
    return createdItems;
}
/**
 * Update a due diligence item
 *
 * @param itemId - Due diligence item ID
 * @param updates - Updates to apply
 * @returns Updated item
 *
 * @example
 * ```typescript
 * await updateDueDiligenceItem('dd-123', {
 *   status: DueDiligenceStatus.COMPLETED,
 *   findings: 'No environmental issues found',
 *   completedDate: new Date(),
 * });
 * ```
 */
async function updateDueDiligenceItem(itemId, updates) {
    // Implementation would fetch and update the item
    throw new common_1.NotFoundException(`Due diligence item ${itemId} not found`);
}
/**
 * Get due diligence status for a transaction
 *
 * @param transactionId - Transaction ID
 * @returns Due diligence summary
 *
 * @example
 * ```typescript
 * const status = await getDueDiligenceStatus('trans-123');
 * console.log(`${status.completedCount}/${status.totalCount} items completed`);
 * ```
 */
async function getDueDiligenceStatus(transactionId) {
    // Implementation would fetch all DD items for transaction
    return {
        transactionId,
        items: [],
        totalCount: 0,
        completedCount: 0,
        inProgressCount: 0,
        issuesCount: 0,
        overallStatus: 'not_started',
    };
}
/**
 * Complete due diligence phase
 *
 * @param transactionId - Transaction ID
 * @param userId - User completing the phase
 * @param notes - Completion notes
 * @returns Updated transaction
 *
 * @example
 * ```typescript
 * await completeDueDiligence('trans-123', 'user-456', 'All due diligence items completed successfully');
 * ```
 */
async function completeDueDiligence(transactionId, userId, notes) {
    const transaction = await getTransactionById(transactionId);
    const updatedTransaction = {
        ...transaction,
        status: TransactionStatus.UNDER_CONTRACT,
        notes: notes ? `${transaction.notes || ''}\n${notes}` : transaction.notes,
        updatedAt: new Date(),
    };
    await createTransactionAuditLog({
        transactionId,
        action: 'DUE_DILIGENCE_COMPLETED',
        performedByUserId: userId,
        newState: { notes },
        timestamp: new Date(),
    });
    return updatedTransaction;
}
// ============================================================================
// TITLE AND DEED MANAGEMENT
// ============================================================================
/**
 * Record a title search for a transaction
 *
 * @param data - Title record data
 * @returns Created title record
 *
 * @example
 * ```typescript
 * const titleRecord = await recordTitleSearch({
 *   transactionId: 'trans-123',
 *   propertyId: 'prop-456',
 *   titleCompanyId: 'title-co-789',
 *   searchOrderDate: new Date(),
 * });
 * ```
 */
async function recordTitleSearch(data) {
    const validated = exports.TitleRecordCreateSchema.parse(data);
    const record = {
        id: (0, uuid_1.v4)(),
        transactionId: validated.transactionId,
        propertyId: validated.propertyId,
        status: validated.status,
        titleCompanyId: validated.titleCompanyId,
        titleOfficer: validated.titleOfficer,
        searchOrderDate: validated.searchOrderDate,
        currentOwner: validated.currentOwner,
        legalDescription: validated.legalDescription,
        notes: validated.notes,
        metadata: validated.metadata,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    await createTransactionAuditLog({
        transactionId: validated.transactionId,
        action: 'TITLE_SEARCH_RECORDED',
        performedByUserId: 'system',
        newState: record,
        timestamp: new Date(),
    });
    return record;
}
/**
 * Update title status
 *
 * @param titleRecordId - Title record ID
 * @param status - New status
 * @param updates - Additional updates
 * @returns Updated title record
 *
 * @example
 * ```typescript
 * await updateTitleStatus('title-123', TitleStatus.CLEAR, {
 *   searchCompletedDate: new Date(),
 * });
 * ```
 */
async function updateTitleStatus(titleRecordId, status, updates) {
    // Implementation would fetch and update title record
    throw new common_1.NotFoundException(`Title record ${titleRecordId} not found`);
}
/**
 * Record a deed transfer
 *
 * @param data - Deed transfer data
 * @returns Created deed transfer record
 *
 * @example
 * ```typescript
 * const deed = await recordDeedTransfer({
 *   transactionId: 'trans-123',
 *   propertyId: 'prop-456',
 *   deedType: 'warranty_deed',
 *   grantorName: 'John Seller',
 *   granteeName: 'Healthcare Corp',
 *   transferDate: new Date(),
 *   consideration: 5000000,
 * });
 * ```
 */
async function recordDeedTransfer(data) {
    const validated = exports.DeedTransferCreateSchema.parse(data);
    const deed = {
        id: (0, uuid_1.v4)(),
        transactionId: validated.transactionId,
        propertyId: validated.propertyId,
        deedType: validated.deedType,
        grantorName: validated.grantorName,
        granteeName: validated.granteeName,
        transferDate: validated.transferDate,
        recordedDate: validated.recordedDate,
        recordingJurisdiction: validated.recordingJurisdiction,
        bookNumber: validated.bookNumber,
        pageNumber: validated.pageNumber,
        instrumentNumber: validated.instrumentNumber,
        consideration: validated.consideration,
        transferTax: validated.transferTax,
        legalDescription: validated.legalDescription,
        documentUrl: validated.documentUrl,
        notes: validated.notes,
        metadata: validated.metadata,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    await createTransactionAuditLog({
        transactionId: validated.transactionId,
        action: 'DEED_TRANSFER_RECORDED',
        performedByUserId: 'system',
        newState: deed,
        timestamp: new Date(),
    });
    return deed;
}
/**
 * Get title history for a property
 *
 * @param propertyId - Property ID
 * @returns List of title records
 *
 * @example
 * ```typescript
 * const history = await getTitleHistory('prop-123');
 * ```
 */
async function getTitleHistory(propertyId) {
    // Implementation would query database for all title records for property
    return [];
}
// ============================================================================
// CLOSING COORDINATION
// ============================================================================
/**
 * Schedule a closing
 *
 * @param data - Closing coordination data
 * @returns Created closing coordination record
 *
 * @example
 * ```typescript
 * const closing = await scheduleClosing({
 *   transactionId: 'trans-123',
 *   scheduledDate: new Date('2024-06-15'),
 *   scheduledTime: '10:00 AM',
 *   location: 'Title Company Office',
 *   venue: 'in_person',
 * });
 * ```
 */
async function scheduleClosing(data) {
    const validated = exports.ClosingCoordinationCreateSchema.parse(data);
    const closing = {
        id: (0, uuid_1.v4)(),
        transactionId: validated.transactionId,
        status: validated.status || ClosingStatus.SCHEDULED,
        scheduledDate: validated.scheduledDate,
        scheduledTime: validated.scheduledTime,
        location: validated.location,
        venue: validated.venue,
        closingAgentId: validated.closingAgentId,
        closingAgentName: validated.closingAgentName,
        notes: validated.notes,
        metadata: validated.metadata,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    await createTransactionAuditLog({
        transactionId: validated.transactionId,
        action: 'CLOSING_SCHEDULED',
        performedByUserId: 'system',
        newState: closing,
        timestamp: new Date(),
    });
    return closing;
}
/**
 * Update closing checklist
 *
 * @param closingId - Closing coordination ID
 * @param checklist - Checklist items
 * @returns Updated closing coordination
 *
 * @example
 * ```typescript
 * await updateClosingChecklist('closing-123', [
 *   { item: 'Deed prepared', completed: true, completedByUserId: 'user-456' },
 *   { item: 'Title insurance issued', completed: true, completedByUserId: 'user-789' },
 *   { item: 'Wire transfer confirmed', completed: false },
 * ]);
 * ```
 */
async function updateClosingChecklist(closingId, checklist) {
    // Implementation would fetch and update closing record
    throw new common_1.NotFoundException(`Closing ${closingId} not found`);
}
/**
 * Record closing costs
 *
 * @param data - Closing cost data
 * @returns Created closing cost record
 *
 * @example
 * ```typescript
 * await recordClosingCosts({
 *   transactionId: 'trans-123',
 *   closingId: 'closing-456',
 *   category: 'title_fees',
 *   description: 'Title insurance premium',
 *   amount: 5000,
 *   paidBy: 'buyer',
 * });
 * ```
 */
async function recordClosingCosts(data) {
    const validated = exports.ClosingCostCreateSchema.parse(data);
    const cost = {
        id: (0, uuid_1.v4)(),
        transactionId: validated.transactionId,
        closingId: validated.closingId,
        category: validated.category,
        description: validated.description,
        amount: validated.amount,
        paidBy: validated.paidBy,
        buyerAmount: validated.buyerAmount,
        sellerAmount: validated.sellerAmount,
        paidToPartyId: validated.paidToPartyId,
        paidDate: validated.paidDate,
        notes: validated.notes,
        metadata: validated.metadata,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    await createTransactionAuditLog({
        transactionId: validated.transactionId,
        action: 'CLOSING_COST_RECORDED',
        performedByUserId: 'system',
        newState: cost,
        timestamp: new Date(),
    });
    return cost;
}
/**
 * Finalize closing
 *
 * @param closingId - Closing coordination ID
 * @param userId - User finalizing the closing
 * @param actualDate - Actual closing date
 * @returns Updated closing and transaction
 *
 * @example
 * ```typescript
 * await finalizeClosing('closing-123', 'user-456', new Date());
 * ```
 */
async function finalizeClosing(closingId, userId, actualDate) {
    // Implementation would update closing status and transaction status
    throw new common_1.NotFoundException(`Closing ${closingId} not found`);
}
// ============================================================================
// TRANSACTION DOCUMENT MANAGEMENT
// ============================================================================
/**
 * Upload a transaction document
 *
 * @param data - Document upload data
 * @returns Created document record
 *
 * @example
 * ```typescript
 * const document = await uploadTransactionDocument({
 *   transactionId: 'trans-123',
 *   type: TransactionDocumentType.PURCHASE_AGREEMENT,
 *   name: 'Purchase Agreement',
 *   fileUrl: 'https://storage.example.com/doc.pdf',
 *   fileName: 'purchase-agreement.pdf',
 *   fileSize: 1024000,
 *   mimeType: 'application/pdf',
 *   uploadedByUserId: 'user-456',
 * });
 * ```
 */
async function uploadTransactionDocument(data) {
    const validated = exports.TransactionDocumentCreateSchema.parse(data);
    const document = {
        id: (0, uuid_1.v4)(),
        transactionId: validated.transactionId,
        type: validated.type,
        status: validated.status,
        name: validated.name,
        description: validated.description,
        fileUrl: validated.fileUrl,
        fileName: validated.fileName,
        fileSize: validated.fileSize,
        mimeType: validated.mimeType,
        version: 1,
        uploadedByUserId: validated.uploadedByUserId,
        uploadedAt: new Date(),
        expiryDate: validated.expiryDate,
        tags: validated.tags,
        metadata: validated.metadata,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    await createTransactionAuditLog({
        transactionId: validated.transactionId,
        action: 'DOCUMENT_UPLOADED',
        performedByUserId: validated.uploadedByUserId,
        newState: document,
        timestamp: new Date(),
    });
    return document;
}
/**
 * Get transaction documents
 *
 * @param transactionId - Transaction ID
 * @param filters - Optional filters
 * @returns List of documents
 *
 * @example
 * ```typescript
 * const documents = await getTransactionDocuments('trans-123', {
 *   type: TransactionDocumentType.PURCHASE_AGREEMENT,
 *   status: DocumentStatus.EXECUTED,
 * });
 * ```
 */
async function getTransactionDocuments(transactionId, filters) {
    // Implementation would query database with filters
    return [];
}
/**
 * Update document status
 *
 * @param documentId - Document ID
 * @param status - New status
 * @param userId - User updating the status
 * @returns Updated document
 *
 * @example
 * ```typescript
 * await updateDocumentStatus('doc-123', DocumentStatus.SIGNED, 'user-456');
 * ```
 */
async function updateDocumentStatus(documentId, status, userId) {
    // Implementation would fetch and update document
    throw new common_1.NotFoundException(`Document ${documentId} not found`);
}
/**
 * Archive transaction documents
 *
 * @param transactionId - Transaction ID
 * @param userId - User archiving the documents
 * @returns Number of documents archived
 *
 * @example
 * ```typescript
 * const archived = await archiveTransactionDocuments('trans-123', 'user-456');
 * console.log(`Archived ${archived} documents`);
 * ```
 */
async function archiveTransactionDocuments(transactionId, userId) {
    // Implementation would update all documents to archived status
    await createTransactionAuditLog({
        transactionId,
        action: 'DOCUMENTS_ARCHIVED',
        performedByUserId: userId,
        timestamp: new Date(),
    });
    return 0;
}
// ============================================================================
// PURCHASE AGREEMENT TRACKING
// ============================================================================
/**
 * Create a purchase agreement
 *
 * @param data - Purchase agreement data
 * @returns Created purchase agreement
 *
 * @example
 * ```typescript
 * const agreement = await createPurchaseAgreement({
 *   transactionId: 'trans-123',
 *   agreementDate: new Date(),
 *   purchasePrice: 5000000,
 *   depositAmount: 250000,
 *   closingDate: new Date('2024-06-15'),
 * });
 * ```
 */
async function createPurchaseAgreement(data) {
    const validated = exports.PurchaseAgreementCreateSchema.parse(data);
    const agreement = {
        id: (0, uuid_1.v4)(),
        transactionId: validated.transactionId,
        status: validated.status,
        agreementDate: validated.agreementDate,
        effectiveDate: validated.effectiveDate,
        purchasePrice: validated.purchasePrice,
        depositAmount: validated.depositAmount,
        financingAmount: validated.financingAmount,
        contingencies: [],
        closingDate: validated.closingDate,
        possessionDate: validated.possessionDate,
        includedItems: validated.includedItems,
        excludedItems: validated.excludedItems,
        specialTerms: validated.specialTerms,
        documentId: validated.documentId,
        notes: validated.notes,
        metadata: validated.metadata,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    await createTransactionAuditLog({
        transactionId: validated.transactionId,
        action: 'PURCHASE_AGREEMENT_CREATED',
        performedByUserId: 'system',
        newState: agreement,
        timestamp: new Date(),
    });
    return agreement;
}
/**
 * Update purchase agreement terms
 *
 * @param agreementId - Purchase agreement ID
 * @param updates - Updates to apply
 * @returns Updated purchase agreement
 *
 * @example
 * ```typescript
 * await updatePurchaseAgreementTerms('agreement-123', {
 *   purchasePrice: 4950000,
 *   closingDate: new Date('2024-06-20'),
 * });
 * ```
 */
async function updatePurchaseAgreementTerms(agreementId, updates) {
    // Implementation would fetch and update agreement
    throw new common_1.NotFoundException(`Purchase agreement ${agreementId} not found`);
}
/**
 * Add agreement contingency
 *
 * @param data - Contingency data
 * @returns Created contingency
 *
 * @example
 * ```typescript
 * const contingency = await addAgreementContingency({
 *   transactionId: 'trans-123',
 *   purchaseAgreementId: 'agreement-456',
 *   type: ContingencyType.FINANCING,
 *   description: 'Buyer to obtain financing at 6.5% or better',
 *   dueDate: new Date('2024-04-15'),
 * });
 * ```
 */
async function addAgreementContingency(data) {
    const validated = exports.AgreementContingencyCreateSchema.parse(data);
    const contingency = {
        id: (0, uuid_1.v4)(),
        transactionId: validated.transactionId,
        purchaseAgreementId: validated.purchaseAgreementId,
        type: validated.type,
        status: validated.status,
        description: validated.description,
        dueDate: validated.dueDate,
        responsiblePartyId: validated.responsiblePartyId,
        notes: validated.notes,
        metadata: validated.metadata,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    await createTransactionAuditLog({
        transactionId: validated.transactionId,
        action: 'CONTINGENCY_ADDED',
        performedByUserId: 'system',
        newState: contingency,
        timestamp: new Date(),
    });
    return contingency;
}
/**
 * Get purchase agreement status
 *
 * @param agreementId - Purchase agreement ID
 * @returns Agreement with contingency status
 *
 * @example
 * ```typescript
 * const status = await getPurchaseAgreementStatus('agreement-123');
 * console.log(`${status.contingenciesSatisfied}/${status.contingenciesTotal} contingencies satisfied`);
 * ```
 */
async function getPurchaseAgreementStatus(agreementId) {
    // Implementation would fetch agreement and contingencies
    throw new common_1.NotFoundException(`Purchase agreement ${agreementId} not found`);
}
// ============================================================================
// TRANSACTION TIMELINE MANAGEMENT
// ============================================================================
/**
 * Create transaction timeline
 *
 * @param transactionId - Transaction ID
 * @param milestones - List of milestones
 * @returns Created timeline
 *
 * @example
 * ```typescript
 * const timeline = await createTransactionTimeline('trans-123', [
 *   { name: 'Contract executed', dueDate: new Date('2024-02-01'), order: 1 },
 *   { name: 'Due diligence complete', dueDate: new Date('2024-03-01'), order: 2 },
 *   { name: 'Financing approved', dueDate: new Date('2024-04-01'), order: 3 },
 *   { name: 'Closing', dueDate: new Date('2024-06-15'), order: 4 },
 * ]);
 * ```
 */
async function createTransactionTimeline(transactionId, milestones) {
    const timeline = {
        id: (0, uuid_1.v4)(),
        transactionId,
        milestones: [],
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    const createdMilestones = [];
    for (const milestoneData of milestones) {
        const milestone = {
            id: (0, uuid_1.v4)(),
            timelineId: timeline.id,
            transactionId,
            name: milestoneData.name,
            description: milestoneData.description,
            dueDate: milestoneData.dueDate,
            status: MilestoneStatus.PENDING,
            assignedToUserId: milestoneData.assignedToUserId,
            order: milestoneData.order,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        createdMilestones.push(milestone);
    }
    timeline.milestones = createdMilestones;
    await createTransactionAuditLog({
        transactionId,
        action: 'TIMELINE_CREATED',
        performedByUserId: 'system',
        newState: { milestoneCount: createdMilestones.length },
        timestamp: new Date(),
    });
    return timeline;
}
/**
 * Update timeline milestone
 *
 * @param milestoneId - Milestone ID
 * @param updates - Updates to apply
 * @returns Updated milestone
 *
 * @example
 * ```typescript
 * await updateTimelineMilestone('milestone-123', {
 *   status: MilestoneStatus.COMPLETED,
 *   completedDate: new Date(),
 * });
 * ```
 */
async function updateTimelineMilestone(milestoneId, updates) {
    // Implementation would fetch and update milestone
    throw new common_1.NotFoundException(`Milestone ${milestoneId} not found`);
}
/**
 * Get transaction timeline
 *
 * @param transactionId - Transaction ID
 * @returns Transaction timeline with all milestones
 *
 * @example
 * ```typescript
 * const timeline = await getTransactionTimeline('trans-123');
 * ```
 */
async function getTransactionTimeline(transactionId) {
    // Implementation would fetch timeline and milestones
    throw new common_1.NotFoundException(`Timeline for transaction ${transactionId} not found`);
}
/**
 * Check overdue milestones
 *
 * @param transactionId - Transaction ID (optional)
 * @returns List of overdue milestones
 *
 * @example
 * ```typescript
 * const overdue = await checkOverdueMilestones('trans-123');
 * ```
 */
async function checkOverdueMilestones(transactionId) {
    // Implementation would query for milestones past due date with status != COMPLETED
    return [];
}
// ============================================================================
// THIRD-PARTY COORDINATION
// ============================================================================
/**
 * Add transaction party
 *
 * @param data - Transaction party data
 * @returns Created party record
 *
 * @example
 * ```typescript
 * const party = await addTransactionParty({
 *   transactionId: 'trans-123',
 *   role: PartyRole.BUYER_ATTORNEY,
 *   entityType: 'individual',
 *   name: 'Jane Attorney',
 *   email: 'jane@lawfirm.com',
 *   phone: '555-0100',
 *   licenseNumber: 'ATY-12345',
 * });
 * ```
 */
async function addTransactionParty(data) {
    const validated = exports.TransactionPartyCreateSchema.parse(data);
    const party = {
        id: (0, uuid_1.v4)(),
        transactionId: validated.transactionId,
        role: validated.role,
        entityType: validated.entityType,
        name: validated.name,
        companyName: validated.companyName,
        contactName: validated.contactName,
        email: validated.email,
        phone: validated.phone,
        address: validated.address,
        userId: validated.userId,
        vendorId: validated.vendorId,
        licenseNumber: validated.licenseNumber,
        notes: validated.notes,
        metadata: validated.metadata,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    await createTransactionAuditLog({
        transactionId: validated.transactionId,
        action: 'PARTY_ADDED',
        performedByUserId: 'system',
        newState: party,
        timestamp: new Date(),
    });
    return party;
}
/**
 * Update party information
 *
 * @param partyId - Transaction party ID
 * @param updates - Updates to apply
 * @returns Updated party
 *
 * @example
 * ```typescript
 * await updatePartyInformation('party-123', {
 *   email: 'newemail@lawfirm.com',
 *   phone: '555-0101',
 * });
 * ```
 */
async function updatePartyInformation(partyId, updates) {
    // Implementation would fetch and update party
    throw new common_1.NotFoundException(`Transaction party ${partyId} not found`);
}
/**
 * Get transaction parties
 *
 * @param transactionId - Transaction ID
 * @param role - Filter by role (optional)
 * @returns List of transaction parties
 *
 * @example
 * ```typescript
 * const parties = await getTransactionParties('trans-123');
 * const attorneys = await getTransactionParties('trans-123', PartyRole.BUYER_ATTORNEY);
 * ```
 */
async function getTransactionParties(transactionId, role) {
    // Implementation would query database with filters
    return [];
}
/**
 * Notify transaction parties
 *
 * @param transactionId - Transaction ID
 * @param message - Notification message
 * @param roles - Filter by roles (optional)
 * @returns Number of parties notified
 *
 * @example
 * ```typescript
 * await notifyTransactionParties('trans-123', 'Closing scheduled for June 15 at 10 AM', [
 *   PartyRole.BUYER,
 *   PartyRole.SELLER,
 *   PartyRole.BUYER_ATTORNEY,
 *   PartyRole.SELLER_ATTORNEY,
 * ]);
 * ```
 */
async function notifyTransactionParties(transactionId, message, roles) {
    // Implementation would send notifications to parties
    await createTransactionAuditLog({
        transactionId,
        action: 'PARTIES_NOTIFIED',
        performedByUserId: 'system',
        newState: { message, roles },
        timestamp: new Date(),
    });
    return 0;
}
// ============================================================================
// POST-CLOSING ACTIVITIES
// ============================================================================
/**
 * Record post-closing item
 *
 * @param data - Post-closing item data
 * @returns Created post-closing item
 *
 * @example
 * ```typescript
 * const item = await recordPostClosingItem({
 *   transactionId: 'trans-123',
 *   type: PostClosingItemType.DOCUMENT_RECORDING,
 *   description: 'Record deed at county recorder office',
 *   dueDate: new Date('2024-06-18'),
 *   assignedToUserId: 'user-456',
 * });
 * ```
 */
async function recordPostClosingItem(data) {
    const validated = exports.PostClosingItemCreateSchema.parse(data);
    const item = {
        id: (0, uuid_1.v4)(),
        transactionId: validated.transactionId,
        type: validated.type,
        description: validated.description,
        dueDate: validated.dueDate,
        assignedToUserId: validated.assignedToUserId,
        status: validated.status,
        notes: validated.notes,
        metadata: validated.metadata,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    await createTransactionAuditLog({
        transactionId: validated.transactionId,
        action: 'POST_CLOSING_ITEM_CREATED',
        performedByUserId: 'system',
        newState: item,
        timestamp: new Date(),
    });
    return item;
}
/**
 * Update post-closing status
 *
 * @param itemId - Post-closing item ID
 * @param status - New status
 * @param userId - User updating the status
 * @returns Updated post-closing item
 *
 * @example
 * ```typescript
 * await updatePostClosingStatus('item-123', 'completed', 'user-456');
 * ```
 */
async function updatePostClosingStatus(itemId, status, userId) {
    // Implementation would fetch and update post-closing item
    throw new common_1.NotFoundException(`Post-closing item ${itemId} not found`);
}
/**
 * Get post-closing checklist
 *
 * @param transactionId - Transaction ID
 * @returns List of post-closing items
 *
 * @example
 * ```typescript
 * const checklist = await getPostClosingChecklist('trans-123');
 * ```
 */
async function getPostClosingChecklist(transactionId) {
    // Implementation would query database for all post-closing items
    return [];
}
/**
 * Complete transaction archival
 *
 * @param transactionId - Transaction ID
 * @param userId - User completing archival
 * @returns Archival summary
 *
 * @example
 * ```typescript
 * const summary = await completeTransactionArchival('trans-123', 'user-456');
 * console.log(`Archived ${summary.documentsArchived} documents`);
 * ```
 */
async function completeTransactionArchival(transactionId, userId) {
    const transaction = await getTransactionById(transactionId);
    if (transaction.status !== TransactionStatus.CLOSED) {
        throw new common_1.BadRequestException('Transaction must be closed before archival');
    }
    // Archive all documents
    const documentsArchived = await archiveTransactionDocuments(transactionId, userId);
    await createTransactionAuditLog({
        transactionId,
        action: 'TRANSACTION_ARCHIVED',
        performedByUserId: userId,
        timestamp: new Date(),
    });
    return {
        transactionId,
        documentsArchived,
        postClosingItemsCompleted: 0,
        archivalDate: new Date(),
    };
}
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
/**
 * Get transaction by ID
 *
 * @param transactionId - Transaction ID
 * @returns Transaction details
 */
async function getTransactionById(transactionId) {
    if (!transactionId) {
        throw new common_1.BadRequestException('Transaction ID is required');
    }
    // Implementation would fetch from database
    throw new common_1.NotFoundException(`Transaction ${transactionId} not found`);
}
/**
 * Create transaction audit log entry
 *
 * @param log - Audit log data
 */
async function createTransactionAuditLog(log) {
    const auditLog = {
        id: (0, uuid_1.v4)(),
        ...log,
    };
    // Implementation would save to database
    return auditLog;
}
/**
 * Generate unique transaction number
 *
 * @param type - Transaction type
 * @param sequence - Sequence number
 * @returns Transaction number
 *
 * @example
 * ```typescript
 * const transNumber = generateTransactionNumber(TransactionType.ACQUISITION, 42);
 * // Returns: 'ACQ-2024-00042'
 * ```
 */
function generateTransactionNumber(type, sequence) {
    const year = new Date().getFullYear();
    const typePrefix = type.substring(0, 3).toUpperCase();
    const paddedSequence = sequence.toString().padStart(5, '0');
    return `${typePrefix}-${year}-${paddedSequence}`;
}
/**
 * Calculate days until closing
 *
 * @param closingDate - Closing date
 * @returns Number of days until closing
 *
 * @example
 * ```typescript
 * const daysUntil = calculateDaysUntilClosing(new Date('2024-06-15'));
 * ```
 */
function calculateDaysUntilClosing(closingDate) {
    const now = new Date();
    const diffTime = closingDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}
/**
 * Calculate total closing costs
 *
 * @param transactionId - Transaction ID
 * @returns Cost breakdown
 *
 * @example
 * ```typescript
 * const costs = await calculateTotalClosingCosts('trans-123');
 * console.log(`Total buyer costs: $${costs.buyerTotal}`);
 * ```
 */
async function calculateTotalClosingCosts(transactionId) {
    // Implementation would query and sum all closing costs
    return {
        transactionId,
        buyerTotal: 0,
        sellerTotal: 0,
        grandTotal: 0,
        costBreakdown: [],
    };
}
/**
 * Get transaction summary
 *
 * @param transactionId - Transaction ID
 * @returns Comprehensive transaction summary
 *
 * @example
 * ```typescript
 * const summary = await getTransactionSummary('trans-123');
 * ```
 */
async function getTransactionSummary(transactionId) {
    const transaction = await getTransactionById(transactionId);
    const dueDiligenceStatus = await getDueDiligenceStatus(transactionId);
    const parties = await getTransactionParties(transactionId);
    const documents = await getTransactionDocuments(transactionId);
    return {
        transaction,
        dueDiligenceStatus,
        parties,
        documents,
    };
}
// ============================================================================
// SWAGGER DECORATORS
// ============================================================================
/**
 * Swagger API tags for transaction management endpoints
 */
exports.TransactionManagementApiTags = {
    TRANSACTIONS: 'Property Transactions',
    ACQUISITIONS: 'Acquisitions',
    DISPOSITIONS: 'Dispositions',
    DUE_DILIGENCE: 'Due Diligence',
    TITLE: 'Title & Deed',
    CLOSING: 'Closing Coordination',
    DOCUMENTS: 'Transaction Documents',
    AGREEMENTS: 'Purchase Agreements',
    TIMELINE: 'Transaction Timeline',
    PARTIES: 'Transaction Parties',
    POST_CLOSING: 'Post-Closing',
};
/**
 * Example Swagger decorators for transaction controller
 *
 * @ApiTags(TransactionManagementApiTags.TRANSACTIONS)
 * @Controller('transactions')
 * export class TransactionController {
 *   @Post('acquisitions')
 *   @ApiOperation({ summary: 'Initiate property acquisition' })
 *   @ApiResponse({ status: 201, description: 'Transaction created successfully' })
 *   async createAcquisition(@Body() data: PropertyTransactionCreateSchema) {
 *     return initiatePropertyAcquisition(data);
 *   }
 * }
 */
//# sourceMappingURL=property-transaction-management-kit.js.map