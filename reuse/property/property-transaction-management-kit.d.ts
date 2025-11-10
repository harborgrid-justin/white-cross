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
import { z } from 'zod';
/**
 * Transaction type enumeration
 */
export declare enum TransactionType {
    ACQUISITION = "acquisition",
    DISPOSITION = "disposition",
    LEASE = "lease",
    EXCHANGE = "exchange",
    REFINANCE = "refinance",
    SALE_LEASEBACK = "sale_leaseback"
}
/**
 * Transaction status enumeration
 */
export declare enum TransactionStatus {
    INITIATED = "initiated",
    DUE_DILIGENCE = "due_diligence",
    UNDER_CONTRACT = "under_contract",
    PENDING_APPROVAL = "pending_approval",
    APPROVED = "approved",
    IN_CLOSING = "in_closing",
    CLOSED = "closed",
    CANCELLED = "cancelled",
    WITHDRAWN = "withdrawn",
    FAILED = "failed"
}
/**
 * Due diligence category enumeration
 */
export declare enum DueDiligenceCategory {
    ENVIRONMENTAL = "environmental",
    STRUCTURAL = "structural",
    FINANCIAL = "financial",
    LEGAL = "legal",
    ZONING = "zoning",
    TITLE = "title",
    SURVEY = "survey",
    INSPECTION = "inspection",
    APPRAISAL = "appraisal",
    INSURANCE = "insurance"
}
/**
 * Due diligence status enumeration
 */
export declare enum DueDiligenceStatus {
    NOT_STARTED = "not_started",
    IN_PROGRESS = "in_progress",
    PENDING_REVIEW = "pending_review",
    COMPLETED = "completed",
    ISSUES_FOUND = "issues_found",
    WAIVED = "waived"
}
/**
 * Title status enumeration
 */
export declare enum TitleStatus {
    NOT_SEARCHED = "not_searched",
    SEARCH_ORDERED = "search_ordered",
    SEARCH_COMPLETED = "search_completed",
    CLEAR = "clear",
    DEFECTS_FOUND = "defects_found",
    DEFECTS_CURED = "defects_cured",
    INSURANCE_ORDERED = "insurance_ordered",
    INSURANCE_ISSUED = "insurance_issued"
}
/**
 * Document type enumeration
 */
export declare enum TransactionDocumentType {
    PURCHASE_AGREEMENT = "purchase_agreement",
    LETTER_OF_INTENT = "letter_of_intent",
    DEED = "deed",
    TITLE_REPORT = "title_report",
    SURVEY = "survey",
    APPRAISAL = "appraisal",
    INSPECTION_REPORT = "inspection_report",
    ENVIRONMENTAL_REPORT = "environmental_report",
    CLOSING_STATEMENT = "closing_statement",
    WIRE_TRANSFER = "wire_transfer",
    INSURANCE_POLICY = "insurance_policy",
    AMENDMENT = "amendment",
    ADDENDUM = "addendum",
    DISCLOSURE = "disclosure",
    OTHER = "other"
}
/**
 * Document status enumeration
 */
export declare enum DocumentStatus {
    DRAFT = "draft",
    PENDING_REVIEW = "pending_review",
    UNDER_REVIEW = "under_review",
    APPROVED = "approved",
    REJECTED = "rejected",
    SIGNED = "signed",
    EXECUTED = "executed",
    ARCHIVED = "archived"
}
/**
 * Closing status enumeration
 */
export declare enum ClosingStatus {
    NOT_SCHEDULED = "not_scheduled",
    SCHEDULED = "scheduled",
    DOCUMENTS_PREPARED = "documents_prepared",
    READY_TO_CLOSE = "ready_to_close",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    POSTPONED = "postponed",
    CANCELLED = "cancelled"
}
/**
 * Milestone status enumeration
 */
export declare enum MilestoneStatus {
    PENDING = "pending",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    OVERDUE = "overdue",
    SKIPPED = "skipped"
}
/**
 * Party role enumeration
 */
export declare enum PartyRole {
    BUYER = "buyer",
    SELLER = "seller",
    BUYER_AGENT = "buyer_agent",
    SELLER_AGENT = "seller_agent",
    BUYER_ATTORNEY = "buyer_attorney",
    SELLER_ATTORNEY = "seller_attorney",
    LENDER = "lender",
    TITLE_COMPANY = "title_company",
    ESCROW_AGENT = "escrow_agent",
    INSPECTOR = "inspector",
    APPRAISER = "appraiser",
    SURVEYOR = "surveyor",
    ENVIRONMENTAL_CONSULTANT = "environmental_consultant",
    BROKER = "broker",
    OTHER = "other"
}
/**
 * Contingency type enumeration
 */
export declare enum ContingencyType {
    FINANCING = "financing",
    INSPECTION = "inspection",
    APPRAISAL = "appraisal",
    ENVIRONMENTAL = "environmental",
    SALE_OF_PROPERTY = "sale_of_property",
    ZONING_APPROVAL = "zoning_approval",
    BOARD_APPROVAL = "board_approval",
    DUE_DILIGENCE = "due_diligence",
    TITLE = "title",
    SURVEY = "survey",
    OTHER = "other"
}
/**
 * Contingency status enumeration
 */
export declare enum ContingencyStatus {
    ACTIVE = "active",
    SATISFIED = "satisfied",
    WAIVED = "waived",
    EXTENDED = "extended",
    FAILED = "failed"
}
/**
 * Post-closing item type enumeration
 */
export declare enum PostClosingItemType {
    DOCUMENT_RECORDING = "document_recording",
    TAX_FILING = "tax_filing",
    INSURANCE_TRANSFER = "insurance_transfer",
    UTILITY_TRANSFER = "utility_transfer",
    FINAL_RECONCILIATION = "final_reconciliation",
    ARCHIVE = "archive",
    ASSET_REGISTRATION = "asset_registration",
    ACCOUNTING_ENTRY = "accounting_entry",
    OTHER = "other"
}
/**
 * Property transaction interface
 */
export interface PropertyTransaction {
    id: string;
    transactionNumber: string;
    type: TransactionType;
    status: TransactionStatus;
    propertyId: string;
    propertyAddress: string;
    propertyType?: string;
    purchasePrice?: number;
    depositAmount?: number;
    financingAmount?: number;
    downPayment?: number;
    closingCosts?: number;
    buyerId?: string;
    sellerId?: string;
    buyerEntityName?: string;
    sellerEntityName?: string;
    contractDate?: Date;
    dueDiligenceDeadline?: Date;
    financingDeadline?: Date;
    closingDate?: Date;
    actualClosingDate?: Date;
    possessionDate?: Date;
    initiatedByUserId: string;
    managedByUserId?: string;
    notes?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
/**
 * Due diligence item interface
 */
export interface DueDiligenceItem {
    id: string;
    transactionId: string;
    category: DueDiligenceCategory;
    status: DueDiligenceStatus;
    title: string;
    description?: string;
    assignedToUserId?: string;
    vendorId?: string;
    startDate?: Date;
    dueDate?: Date;
    completedDate?: Date;
    cost?: number;
    findings?: string;
    recommendations?: string;
    documents?: string[];
    issues?: Array<{
        severity: 'low' | 'medium' | 'high' | 'critical';
        description: string;
        resolution?: string;
        resolvedDate?: Date;
    }>;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Title record interface
 */
export interface TitleRecord {
    id: string;
    transactionId: string;
    propertyId: string;
    status: TitleStatus;
    titleCompanyId?: string;
    titleOfficer?: string;
    searchOrderDate?: Date;
    searchCompletedDate?: Date;
    currentOwner?: string;
    legalDescription?: string;
    encumbrances?: Array<{
        type: 'lien' | 'easement' | 'covenant' | 'restriction' | 'other';
        description: string;
        amount?: number;
        holder?: string;
        recordedDate?: Date;
        resolved?: boolean;
    }>;
    defects?: Array<{
        description: string;
        severity: 'minor' | 'major' | 'critical';
        cured?: boolean;
        cureDate?: Date;
    }>;
    insurancePolicyNumber?: string;
    insuranceAmount?: number;
    insuranceIssueDate?: Date;
    notes?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Deed transfer interface
 */
export interface DeedTransfer {
    id: string;
    transactionId: string;
    propertyId: string;
    deedType: 'warranty_deed' | 'quit_claim_deed' | 'special_warranty_deed' | 'deed_of_trust' | 'other';
    grantorName: string;
    granteeName: string;
    transferDate: Date;
    recordedDate?: Date;
    recordingJurisdiction?: string;
    bookNumber?: string;
    pageNumber?: string;
    instrumentNumber?: string;
    consideration?: number;
    transferTax?: number;
    legalDescription?: string;
    documentUrl?: string;
    notes?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Closing coordination interface
 */
export interface ClosingCoordination {
    id: string;
    transactionId: string;
    status: ClosingStatus;
    scheduledDate?: Date;
    scheduledTime?: string;
    actualDate?: Date;
    location?: string;
    venue?: 'in_person' | 'remote' | 'hybrid';
    closingAgentId?: string;
    closingAgentName?: string;
    checklist?: Array<{
        item: string;
        completed: boolean;
        completedDate?: Date;
        completedByUserId?: string;
    }>;
    attendees?: Array<{
        partyId: string;
        role: PartyRole;
        confirmed: boolean;
    }>;
    wireInstructions?: {
        bankName: string;
        routingNumber: string;
        accountNumber: string;
        amount: number;
        wireDate?: Date;
        confirmationNumber?: string;
    };
    notes?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Transaction document interface
 */
export interface TransactionDocument {
    id: string;
    transactionId: string;
    type: TransactionDocumentType;
    status: DocumentStatus;
    name: string;
    description?: string;
    fileUrl: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
    version: number;
    previousVersionId?: string;
    uploadedByUserId: string;
    uploadedAt: Date;
    reviewedByUserId?: string;
    reviewedAt?: Date;
    approvedByUserId?: string;
    approvedAt?: Date;
    signedByUserIds?: string[];
    signedAt?: Date;
    expiryDate?: Date;
    tags?: string[];
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Purchase agreement interface
 */
export interface PurchaseAgreement {
    id: string;
    transactionId: string;
    status: DocumentStatus;
    agreementDate: Date;
    effectiveDate?: Date;
    purchasePrice: number;
    depositAmount: number;
    financingAmount?: number;
    contingencies: string[];
    closingDate: Date;
    possessionDate?: Date;
    includedItems?: string[];
    excludedItems?: string[];
    specialTerms?: string;
    documentId?: string;
    amendments?: Array<{
        id: string;
        date: Date;
        description: string;
        documentId?: string;
    }>;
    notes?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Agreement contingency interface
 */
export interface AgreementContingency {
    id: string;
    transactionId: string;
    purchaseAgreementId: string;
    type: ContingencyType;
    status: ContingencyStatus;
    description: string;
    dueDate: Date;
    satisfiedDate?: Date;
    waivedDate?: Date;
    responsiblePartyId?: string;
    notes?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Transaction timeline interface
 */
export interface TransactionTimeline {
    id: string;
    transactionId: string;
    milestones: TransactionMilestone[];
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Transaction milestone interface
 */
export interface TransactionMilestone {
    id: string;
    timelineId: string;
    transactionId: string;
    name: string;
    description?: string;
    dueDate: Date;
    completedDate?: Date;
    status: MilestoneStatus;
    dependencies?: string[];
    assignedToUserId?: string;
    order: number;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Transaction party interface
 */
export interface TransactionParty {
    id: string;
    transactionId: string;
    role: PartyRole;
    entityType: 'individual' | 'company' | 'trust' | 'partnership' | 'llc' | 'corporation' | 'other';
    name: string;
    companyName?: string;
    contactName?: string;
    email?: string;
    phone?: string;
    address?: string;
    userId?: string;
    vendorId?: string;
    licenseNumber?: string;
    notes?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Closing cost interface
 */
export interface ClosingCost {
    id: string;
    transactionId: string;
    closingId: string;
    category: 'lender_fees' | 'title_fees' | 'government_fees' | 'prepaid_items' | 'escrow' | 'other';
    description: string;
    amount: number;
    paidBy: 'buyer' | 'seller' | 'split';
    buyerAmount?: number;
    sellerAmount?: number;
    paidToPartyId?: string;
    paidDate?: Date;
    notes?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Post-closing item interface
 */
export interface PostClosingItem {
    id: string;
    transactionId: string;
    type: PostClosingItemType;
    description: string;
    dueDate?: Date;
    completedDate?: Date;
    assignedToUserId?: string;
    status: 'pending' | 'in_progress' | 'completed';
    notes?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Transaction audit log interface
 */
export interface TransactionAuditLog {
    id: string;
    transactionId: string;
    action: string;
    performedByUserId: string;
    previousState?: Record<string, any>;
    newState?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
    timestamp: Date;
}
/**
 * Property transaction creation schema
 */
export declare const PropertyTransactionCreateSchema: any;
/**
 * Property transaction update schema
 */
export declare const PropertyTransactionUpdateSchema: any;
/**
 * Due diligence item creation schema
 */
export declare const DueDiligenceItemCreateSchema: any;
/**
 * Title record creation schema
 */
export declare const TitleRecordCreateSchema: any;
/**
 * Deed transfer creation schema
 */
export declare const DeedTransferCreateSchema: any;
/**
 * Closing coordination creation schema
 */
export declare const ClosingCoordinationCreateSchema: any;
/**
 * Transaction document creation schema
 */
export declare const TransactionDocumentCreateSchema: any;
/**
 * Purchase agreement creation schema
 */
export declare const PurchaseAgreementCreateSchema: any;
/**
 * Agreement contingency creation schema
 */
export declare const AgreementContingencyCreateSchema: any;
/**
 * Transaction milestone creation schema
 */
export declare const TransactionMilestoneCreateSchema: any;
/**
 * Transaction party creation schema
 */
export declare const TransactionPartyCreateSchema: any;
/**
 * Closing cost creation schema
 */
export declare const ClosingCostCreateSchema: any;
/**
 * Post-closing item creation schema
 */
export declare const PostClosingItemCreateSchema: any;
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
export declare function initiatePropertyAcquisition(data: z.infer<typeof PropertyTransactionCreateSchema>): Promise<PropertyTransaction>;
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
export declare function updateAcquisitionStatus(transactionId: string, status: TransactionStatus, userId: string, reason?: string): Promise<PropertyTransaction>;
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
export declare function getAcquisitionDetails(transactionId: string): Promise<PropertyTransaction>;
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
export declare function cancelPropertyAcquisition(transactionId: string, userId: string, reason: string): Promise<PropertyTransaction>;
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
export declare function initiatePropertyDisposition(data: z.infer<typeof PropertyTransactionCreateSchema>): Promise<PropertyTransaction>;
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
export declare function updateDispositionStatus(transactionId: string, status: TransactionStatus, userId: string, reason?: string): Promise<PropertyTransaction>;
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
export declare function getDispositionDetails(transactionId: string): Promise<PropertyTransaction>;
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
export declare function cancelPropertyDisposition(transactionId: string, userId: string, reason: string): Promise<PropertyTransaction>;
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
export declare function createDueDiligenceChecklist(transactionId: string, items: Array<Omit<z.infer<typeof DueDiligenceItemCreateSchema>, 'transactionId'>>): Promise<DueDiligenceItem[]>;
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
export declare function updateDueDiligenceItem(itemId: string, updates: {
    status?: DueDiligenceStatus;
    completedDate?: Date;
    findings?: string;
    recommendations?: string;
    cost?: number;
    issues?: Array<{
        severity: 'low' | 'medium' | 'high' | 'critical';
        description: string;
        resolution?: string;
    }>;
}): Promise<DueDiligenceItem>;
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
export declare function getDueDiligenceStatus(transactionId: string): Promise<{
    transactionId: string;
    items: DueDiligenceItem[];
    totalCount: number;
    completedCount: number;
    inProgressCount: number;
    issuesCount: number;
    overallStatus: 'not_started' | 'in_progress' | 'completed' | 'issues_found';
}>;
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
export declare function completeDueDiligence(transactionId: string, userId: string, notes?: string): Promise<PropertyTransaction>;
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
export declare function recordTitleSearch(data: z.infer<typeof TitleRecordCreateSchema>): Promise<TitleRecord>;
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
export declare function updateTitleStatus(titleRecordId: string, status: TitleStatus, updates?: {
    searchCompletedDate?: Date;
    encumbrances?: Array<{
        type: 'lien' | 'easement' | 'covenant' | 'restriction' | 'other';
        description: string;
        amount?: number;
        holder?: string;
    }>;
    defects?: Array<{
        description: string;
        severity: 'minor' | 'major' | 'critical';
    }>;
    insurancePolicyNumber?: string;
    insuranceAmount?: number;
}): Promise<TitleRecord>;
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
export declare function recordDeedTransfer(data: z.infer<typeof DeedTransferCreateSchema>): Promise<DeedTransfer>;
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
export declare function getTitleHistory(propertyId: string): Promise<TitleRecord[]>;
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
export declare function scheduleClosing(data: z.infer<typeof ClosingCoordinationCreateSchema>): Promise<ClosingCoordination>;
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
export declare function updateClosingChecklist(closingId: string, checklist: Array<{
    item: string;
    completed: boolean;
    completedDate?: Date;
    completedByUserId?: string;
}>): Promise<ClosingCoordination>;
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
export declare function recordClosingCosts(data: z.infer<typeof ClosingCostCreateSchema>): Promise<ClosingCost>;
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
export declare function finalizeClosing(closingId: string, userId: string, actualDate: Date): Promise<{
    closing: ClosingCoordination;
    transaction: PropertyTransaction;
}>;
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
export declare function uploadTransactionDocument(data: z.infer<typeof TransactionDocumentCreateSchema>): Promise<TransactionDocument>;
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
export declare function getTransactionDocuments(transactionId: string, filters?: {
    type?: TransactionDocumentType;
    status?: DocumentStatus;
}): Promise<TransactionDocument[]>;
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
export declare function updateDocumentStatus(documentId: string, status: DocumentStatus, userId: string): Promise<TransactionDocument>;
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
export declare function archiveTransactionDocuments(transactionId: string, userId: string): Promise<number>;
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
export declare function createPurchaseAgreement(data: z.infer<typeof PurchaseAgreementCreateSchema>): Promise<PurchaseAgreement>;
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
export declare function updatePurchaseAgreementTerms(agreementId: string, updates: {
    purchasePrice?: number;
    depositAmount?: number;
    closingDate?: Date;
    possessionDate?: Date;
    specialTerms?: string;
}): Promise<PurchaseAgreement>;
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
export declare function addAgreementContingency(data: z.infer<typeof AgreementContingencyCreateSchema>): Promise<AgreementContingency>;
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
export declare function getPurchaseAgreementStatus(agreementId: string): Promise<{
    agreement: PurchaseAgreement;
    contingencies: AgreementContingency[];
    contingenciesTotal: number;
    contingenciesSatisfied: number;
    contingenciesActive: number;
    allContingenciesSatisfied: boolean;
}>;
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
export declare function createTransactionTimeline(transactionId: string, milestones: Array<{
    name: string;
    description?: string;
    dueDate: Date;
    assignedToUserId?: string;
    order: number;
}>): Promise<TransactionTimeline>;
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
export declare function updateTimelineMilestone(milestoneId: string, updates: {
    status?: MilestoneStatus;
    completedDate?: Date;
    dueDate?: Date;
}): Promise<TransactionMilestone>;
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
export declare function getTransactionTimeline(transactionId: string): Promise<TransactionTimeline>;
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
export declare function checkOverdueMilestones(transactionId?: string): Promise<TransactionMilestone[]>;
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
export declare function addTransactionParty(data: z.infer<typeof TransactionPartyCreateSchema>): Promise<TransactionParty>;
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
export declare function updatePartyInformation(partyId: string, updates: {
    contactName?: string;
    email?: string;
    phone?: string;
    address?: string;
}): Promise<TransactionParty>;
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
export declare function getTransactionParties(transactionId: string, role?: PartyRole): Promise<TransactionParty[]>;
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
export declare function notifyTransactionParties(transactionId: string, message: string, roles?: PartyRole[]): Promise<number>;
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
export declare function recordPostClosingItem(data: z.infer<typeof PostClosingItemCreateSchema>): Promise<PostClosingItem>;
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
export declare function updatePostClosingStatus(itemId: string, status: 'pending' | 'in_progress' | 'completed', userId: string): Promise<PostClosingItem>;
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
export declare function getPostClosingChecklist(transactionId: string): Promise<PostClosingItem[]>;
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
export declare function completeTransactionArchival(transactionId: string, userId: string): Promise<{
    transactionId: string;
    documentsArchived: number;
    postClosingItemsCompleted: number;
    archivalDate: Date;
}>;
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
export declare function generateTransactionNumber(type: TransactionType, sequence: number): string;
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
export declare function calculateDaysUntilClosing(closingDate: Date): number;
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
export declare function calculateTotalClosingCosts(transactionId: string): Promise<{
    transactionId: string;
    buyerTotal: number;
    sellerTotal: number;
    grandTotal: number;
    costBreakdown: Array<{
        category: string;
        amount: number;
    }>;
}>;
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
export declare function getTransactionSummary(transactionId: string): Promise<{
    transaction: PropertyTransaction;
    dueDiligenceStatus: any;
    titleStatus?: TitleRecord;
    closingDetails?: ClosingCoordination;
    parties: TransactionParty[];
    documents: TransactionDocument[];
    timeline?: TransactionTimeline;
}>;
/**
 * Property transaction model interface for Sequelize
 */
export interface PropertyTransactionModel {
    id: string;
    transactionNumber: string;
    type: TransactionType;
    status: TransactionStatus;
    propertyId: string;
    propertyAddress: string;
    propertyType?: string;
    purchasePrice?: number;
    depositAmount?: number;
    financingAmount?: number;
    downPayment?: number;
    closingCosts?: number;
    buyerId?: string;
    sellerId?: string;
    buyerEntityName?: string;
    sellerEntityName?: string;
    contractDate?: Date;
    dueDiligenceDeadline?: Date;
    financingDeadline?: Date;
    closingDate?: Date;
    actualClosingDate?: Date;
    possessionDate?: Date;
    initiatedByUserId: string;
    managedByUserId?: string;
    notes?: string;
    metadata?: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
/**
 * Due diligence item model interface for Sequelize
 */
export interface DueDiligenceItemModel {
    id: string;
    transactionId: string;
    category: DueDiligenceCategory;
    status: DueDiligenceStatus;
    title: string;
    description?: string;
    assignedToUserId?: string;
    vendorId?: string;
    startDate?: Date;
    dueDate?: Date;
    completedDate?: Date;
    cost?: number;
    findings?: string;
    recommendations?: string;
    documents?: string;
    issues?: string;
    metadata?: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Title record model interface for Sequelize
 */
export interface TitleRecordModel {
    id: string;
    transactionId: string;
    propertyId: string;
    status: TitleStatus;
    titleCompanyId?: string;
    titleOfficer?: string;
    searchOrderDate?: Date;
    searchCompletedDate?: Date;
    currentOwner?: string;
    legalDescription?: string;
    encumbrances?: string;
    defects?: string;
    insurancePolicyNumber?: string;
    insuranceAmount?: number;
    insuranceIssueDate?: Date;
    notes?: string;
    metadata?: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Transaction document model interface for Sequelize
 */
export interface TransactionDocumentModel {
    id: string;
    transactionId: string;
    type: TransactionDocumentType;
    status: DocumentStatus;
    name: string;
    description?: string;
    fileUrl: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
    version: number;
    previousVersionId?: string;
    uploadedByUserId: string;
    uploadedAt: Date;
    reviewedByUserId?: string;
    reviewedAt?: Date;
    approvedByUserId?: string;
    approvedAt?: Date;
    signedByUserIds?: string;
    signedAt?: Date;
    expiryDate?: Date;
    tags?: string;
    metadata?: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Transaction party model interface for Sequelize
 */
export interface TransactionPartyModel {
    id: string;
    transactionId: string;
    role: PartyRole;
    entityType: string;
    name: string;
    companyName?: string;
    contactName?: string;
    email?: string;
    phone?: string;
    address?: string;
    userId?: string;
    vendorId?: string;
    licenseNumber?: string;
    notes?: string;
    metadata?: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Swagger API tags for transaction management endpoints
 */
export declare const TransactionManagementApiTags: {
    TRANSACTIONS: string;
    ACQUISITIONS: string;
    DISPOSITIONS: string;
    DUE_DILIGENCE: string;
    TITLE: string;
    CLOSING: string;
    DOCUMENTS: string;
    AGREEMENTS: string;
    TIMELINE: string;
    PARTIES: string;
    POST_CLOSING: string;
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
//# sourceMappingURL=property-transaction-management-kit.d.ts.map