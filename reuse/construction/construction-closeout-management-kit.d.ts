/**
 * Construction Closeout Management Reusable Function Kit
 *
 * Provides comprehensive construction closeout management capabilities including:
 * - Punch list management with assignment and tracking
 * - Completion tracking and milestone monitoring
 * - Final inspection coordination and scheduling
 * - Certificate of occupancy management
 * - As-built documentation compilation and delivery
 * - Owner training coordination and tracking
 * - O&M manual delivery and acknowledgment
 * - Warranty documentation and registration
 * - Final payment processing and retainage release
 * - Lien release tracking and verification
 * - Closeout checklist management
 * - Lessons learned documentation and analysis
 *
 * Features rich Sequelize associations for complex relationship management.
 *
 * @module ConstructionCloseoutManagementKit
 */
import { Model } from 'sequelize-typescript';
import { Optional, Transaction } from 'sequelize';
import { CloseoutStatus, PunchListItemStatus, PunchListItemPriority, PunchListItemCategory, CloseoutDocumentType, DocumentStatus, InspectionResult, PaymentStatus } from './types/closeout.types';
import { CreateConstructionCloseoutDto } from './dto/create-construction-closeout.dto';
import { CreatePunchListItemDto } from './dto/create-punch-list-item.dto';
import { UpdatePunchListItemDto } from './dto/update-punch-list-item.dto';
import { CreateCloseoutDocumentDto } from './dto/create-closeout-document.dto';
/**
 * Construction Closeout Model
 *
 * Represents a construction project closeout process.
 * Rich associations:
 * - hasMany PunchListItem
 * - hasMany CloseoutDocument
 * - belongsToMany User (stakeholders)
 */
export interface ConstructionCloseoutAttributes {
    id: string;
    projectId: string;
    projectName: string;
    contractorId: string;
    contractorName: string;
    status: CloseoutStatus;
    contractValue: number;
    retainageAmount: number;
    retainagePercentage: number;
    substantialCompletionDate?: Date;
    finalCompletionDate?: Date;
    certificateOfOccupancyDate?: Date;
    warrantyStartDate?: Date;
    warrantyEndDate?: Date;
    warrantyPeriodMonths: number;
    completionPercentage: number;
    totalPunchListItems: number;
    openPunchListItems: number;
    criticalPunchListItems: number;
    requiredDocumentsCount: number;
    submittedDocumentsCount: number;
    approvedDocumentsCount: number;
    finalInspectionScheduled: boolean;
    finalInspectionDate?: Date;
    finalInspectionResult?: InspectionResult;
    ownerTrainingRequired: boolean;
    ownerTrainingCompleted: boolean;
    ownerTrainingDate?: Date;
    lienReleasesRequired: number;
    lienReleasesReceived: number;
    finalPaymentAmount: number;
    finalPaymentStatus: PaymentStatus;
    finalPaymentDate?: Date;
    lessonsLearnedCompleted: boolean;
    notes?: string;
    metadata?: Record<string, any>;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}
export interface ConstructionCloseoutCreationAttributes extends Optional<ConstructionCloseoutAttributes, 'id' | 'status' | 'retainagePercentage' | 'completionPercentage' | 'totalPunchListItems' | 'openPunchListItems' | 'criticalPunchListItems' | 'requiredDocumentsCount' | 'submittedDocumentsCount' | 'approvedDocumentsCount' | 'finalInspectionScheduled' | 'ownerTrainingRequired' | 'ownerTrainingCompleted' | 'lienReleasesRequired' | 'lienReleasesReceived' | 'finalPaymentStatus' | 'lessonsLearnedCompleted' | 'substantialCompletionDate' | 'finalCompletionDate' | 'certificateOfOccupancyDate' | 'warrantyStartDate' | 'warrantyEndDate' | 'finalInspectionDate' | 'finalInspectionResult' | 'ownerTrainingDate' | 'finalPaymentDate' | 'notes' | 'metadata' | 'createdAt' | 'updatedAt' | 'deletedAt'> {
}
export declare class ConstructionCloseout extends Model<ConstructionCloseoutAttributes, ConstructionCloseoutCreationAttributes> implements ConstructionCloseoutAttributes {
    id: string;
    projectId: string;
    projectName: string;
    contractorId: string;
    contractorName: string;
    status: CloseoutStatus;
    contractValue: number;
    retainageAmount: number;
    retainagePercentage: number;
    substantialCompletionDate?: Date;
    finalCompletionDate?: Date;
    certificateOfOccupancyDate?: Date;
    warrantyStartDate?: Date;
    warrantyEndDate?: Date;
    warrantyPeriodMonths: number;
    completionPercentage: number;
    totalPunchListItems: number;
    openPunchListItems: number;
    criticalPunchListItems: number;
    requiredDocumentsCount: number;
    submittedDocumentsCount: number;
    approvedDocumentsCount: number;
    finalInspectionScheduled: boolean;
    finalInspectionDate?: Date;
    finalInspectionResult?: InspectionResult;
    ownerTrainingRequired: boolean;
    ownerTrainingCompleted: boolean;
    ownerTrainingDate?: Date;
    lienReleasesRequired: number;
    lienReleasesReceived: number;
    finalPaymentAmount: number;
    finalPaymentStatus: PaymentStatus;
    finalPaymentDate?: Date;
    lessonsLearnedCompleted: boolean;
    notes?: string;
    metadata?: Record<string, any>;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
    punchListItems?: PunchListItem[];
    documents?: CloseoutDocument[];
}
/**
 * Punch List Item Model
 *
 * Represents individual items on a construction punch list.
 * Associations:
 * - belongsTo ConstructionCloseout
 */
export interface PunchListItemAttributes {
    id: string;
    closeoutId: string;
    itemNumber: string;
    title: string;
    description: string;
    location: string;
    category: PunchListItemCategory;
    priority: PunchListItemPriority;
    status: PunchListItemStatus;
    assignedToId?: string;
    assignedToName?: string;
    assignedDate?: Date;
    dueDate?: Date;
    estimatedHours?: number;
    actualHours?: number;
    estimatedCost?: number;
    actualCost?: number;
    reportedById: string;
    reportedByName: string;
    reportedDate: Date;
    reviewedById?: string;
    reviewedByName?: string;
    reviewedDate?: Date;
    approvedById?: string;
    approvedByName?: string;
    approvedDate?: Date;
    completedDate?: Date;
    closedDate?: Date;
    photoUrls?: string[];
    attachmentUrls?: string[];
    rejectionReason?: string;
    resolutionNotes?: string;
    requiresReinspection: boolean;
    reinspectionDate?: Date;
    contractorResponsible: string;
    tags?: string[];
    metadata?: Record<string, any>;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}
export interface PunchListItemCreationAttributes extends Optional<PunchListItemAttributes, 'id' | 'status' | 'requiresReinspection' | 'assignedToId' | 'assignedToName' | 'assignedDate' | 'dueDate' | 'estimatedHours' | 'actualHours' | 'estimatedCost' | 'actualCost' | 'reviewedById' | 'reviewedByName' | 'reviewedDate' | 'approvedById' | 'approvedByName' | 'approvedDate' | 'completedDate' | 'closedDate' | 'photoUrls' | 'attachmentUrls' | 'rejectionReason' | 'resolutionNotes' | 'reinspectionDate' | 'tags' | 'metadata' | 'createdAt' | 'updatedAt' | 'deletedAt'> {
}
export declare class PunchListItem extends Model<PunchListItemAttributes, PunchListItemCreationAttributes> implements PunchListItemAttributes {
    id: string;
    closeoutId: string;
    itemNumber: string;
    title: string;
    description: string;
    location: string;
    category: PunchListItemCategory;
    priority: PunchListItemPriority;
    status: PunchListItemStatus;
    assignedToId?: string;
    assignedToName?: string;
    assignedDate?: Date;
    dueDate?: Date;
    estimatedHours?: number;
    actualHours?: number;
    estimatedCost?: number;
    actualCost?: number;
    reportedById: string;
    reportedByName: string;
    reportedDate: Date;
    reviewedById?: string;
    reviewedByName?: string;
    reviewedDate?: Date;
    approvedById?: string;
    approvedByName?: string;
    approvedDate?: Date;
    completedDate?: Date;
    closedDate?: Date;
    photoUrls?: string[];
    attachmentUrls?: string[];
    rejectionReason?: string;
    resolutionNotes?: string;
    requiresReinspection: boolean;
    reinspectionDate?: Date;
    contractorResponsible: string;
    tags?: string[];
    metadata?: Record<string, any>;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
    closeout?: ConstructionCloseout;
}
/**
 * Closeout Document Model
 *
 * Represents documents required for construction closeout.
 * Associations:
 * - belongsTo ConstructionCloseout
 */
export interface CloseoutDocumentAttributes {
    id: string;
    closeoutId: string;
    documentType: CloseoutDocumentType;
    title: string;
    description?: string;
    documentNumber?: string;
    version: string;
    status: DocumentStatus;
    required: boolean;
    fileUrl?: string;
    fileName?: string;
    fileSize?: number;
    mimeType?: string;
    uploadedById?: string;
    uploadedByName?: string;
    uploadedDate?: Date;
    submittedById?: string;
    submittedByName?: string;
    submittedDate?: Date;
    reviewedById?: string;
    reviewedByName?: string;
    reviewedDate?: Date;
    approvedById?: string;
    approvedByName?: string;
    approvedDate?: Date;
    deliveredDate?: Date;
    acknowledgedById?: string;
    acknowledgedByName?: string;
    acknowledgedDate?: Date;
    expirationDate?: Date;
    rejectionReason?: string;
    reviewComments?: string;
    relatedEquipment?: string;
    relatedSystem?: string;
    manufacturer?: string;
    modelNumber?: string;
    serialNumber?: string;
    warrantyStartDate?: Date;
    warrantyEndDate?: Date;
    trainingTopic?: string;
    trainingDuration?: number;
    tags?: string[];
    metadata?: Record<string, any>;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}
export interface CloseoutDocumentCreationAttributes extends Optional<CloseoutDocumentAttributes, 'id' | 'status' | 'required' | 'version' | 'description' | 'documentNumber' | 'fileUrl' | 'fileName' | 'fileSize' | 'mimeType' | 'uploadedById' | 'uploadedByName' | 'uploadedDate' | 'submittedById' | 'submittedByName' | 'submittedDate' | 'reviewedById' | 'reviewedByName' | 'reviewedDate' | 'approvedById' | 'approvedByName' | 'approvedDate' | 'deliveredDate' | 'acknowledgedById' | 'acknowledgedByName' | 'acknowledgedDate' | 'expirationDate' | 'rejectionReason' | 'reviewComments' | 'relatedEquipment' | 'relatedSystem' | 'manufacturer' | 'modelNumber' | 'serialNumber' | 'warrantyStartDate' | 'warrantyEndDate' | 'trainingTopic' | 'trainingDuration' | 'tags' | 'metadata' | 'createdAt' | 'updatedAt' | 'deletedAt'> {
}
export declare class CloseoutDocument extends Model<CloseoutDocumentAttributes, CloseoutDocumentCreationAttributes> implements CloseoutDocumentAttributes {
    id: string;
    closeoutId: string;
    documentType: CloseoutDocumentType;
    title: string;
    description?: string;
    documentNumber?: string;
    version: string;
    status: DocumentStatus;
    required: boolean;
    fileUrl?: string;
    fileName?: string;
    fileSize?: number;
    mimeType?: string;
    uploadedById?: string;
    uploadedByName?: string;
    uploadedDate?: Date;
    submittedById?: string;
    submittedByName?: string;
    submittedDate?: Date;
    reviewedById?: string;
    reviewedByName?: string;
    reviewedDate?: Date;
    approvedById?: string;
    approvedByName?: string;
    approvedDate?: Date;
    deliveredDate?: Date;
    acknowledgedById?: string;
    acknowledgedByName?: string;
    acknowledgedDate?: Date;
    expirationDate?: Date;
    rejectionReason?: string;
    reviewComments?: string;
    relatedEquipment?: string;
    relatedSystem?: string;
    manufacturer?: string;
    modelNumber?: string;
    serialNumber?: string;
    warrantyStartDate?: Date;
    warrantyEndDate?: Date;
    trainingTopic?: string;
    trainingDuration?: number;
    tags?: string[];
    metadata?: Record<string, any>;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
    closeout?: ConstructionCloseout;
}
export declare class CreateConstructionCloseoutDto implements Partial<ConstructionCloseoutCreationAttributes> {
    projectId: string;
    projectName: string;
    contractorId: string;
    contractorName: string;
    contractValue: number;
    retainageAmount: number;
    retainagePercentage?: number;
    warrantyPeriodMonths: number;
    finalPaymentAmount: number;
    notes?: string;
    metadata?: Record<string, any>;
}
export declare class UpdateConstructionCloseoutDto implements Partial<ConstructionCloseoutAttributes> {
    status?: CloseoutStatus;
    substantialCompletionDate?: Date;
    finalCompletionDate?: Date;
    certificateOfOccupancyDate?: Date;
    finalInspectionScheduled?: boolean;
    finalInspectionDate?: Date;
    finalInspectionResult?: InspectionResult;
    ownerTrainingRequired?: boolean;
    ownerTrainingCompleted?: boolean;
    ownerTrainingDate?: Date;
    finalPaymentStatus?: PaymentStatus;
    finalPaymentDate?: Date;
    lessonsLearnedCompleted?: boolean;
    notes?: string;
    metadata?: Record<string, any>;
}
export declare class CreatePunchListItemDto implements Partial<PunchListItemCreationAttributes> {
    closeoutId: string;
    itemNumber: string;
    title: string;
    description: string;
    location: string;
    category: PunchListItemCategory;
    priority: PunchListItemPriority;
    reportedById: string;
    reportedByName: string;
    contractorResponsible: string;
    assignedToId?: string;
    assignedToName?: string;
    dueDate?: Date;
    estimatedHours?: number;
    estimatedCost?: number;
    tags?: string[];
    metadata?: Record<string, any>;
}
export declare class UpdatePunchListItemDto implements Partial<PunchListItemAttributes> {
    status?: PunchListItemStatus;
    assignedToId?: string;
    assignedToName?: string;
    dueDate?: Date;
    actualHours?: number;
    actualCost?: number;
    resolutionNotes?: string;
    rejectionReason?: string;
    requiresReinspection?: boolean;
    photoUrls?: string[];
    attachmentUrls?: string[];
    metadata?: Record<string, any>;
}
export declare class CreateCloseoutDocumentDto implements Partial<CloseoutDocumentCreationAttributes> {
    closeoutId: string;
    documentType: CloseoutDocumentType;
    title: string;
    description?: string;
    documentNumber?: string;
    required?: boolean;
    relatedEquipment?: string;
    relatedSystem?: string;
    manufacturer?: string;
    modelNumber?: string;
    trainingTopic?: string;
    trainingDuration?: number;
    tags?: string[];
    metadata?: Record<string, any>;
}
export declare class UpdateCloseoutDocumentDto implements Partial<CloseoutDocumentAttributes> {
    status?: DocumentStatus;
    fileUrl?: string;
    fileName?: string;
    fileSize?: number;
    version?: string;
    reviewComments?: string;
    rejectionReason?: string;
    expirationDate?: Date;
    warrantyStartDate?: Date;
    warrantyEndDate?: Date;
    metadata?: Record<string, any>;
}
/**
 * 1. CREATE CONSTRUCTION CLOSEOUT
 * Creates a new construction closeout record
 */
export declare function createConstructionCloseout(data: CreateConstructionCloseoutDto, transaction?: Transaction): Promise<ConstructionCloseout>;
/**
 * 2. GET CLOSEOUT BY ID WITH ASSOCIATIONS
 * Retrieves a closeout record with all associated data using eager loading
 */
export declare function getCloseoutByIdWithAssociations(id: string, options?: {
    includePunchList?: boolean;
    includeDocuments?: boolean;
    punchListStatus?: PunchListItemStatus[];
    documentTypes?: CloseoutDocumentType[];
}): Promise<ConstructionCloseout | null>;
/**
 * 3. UPDATE CLOSEOUT STATUS
 * Updates the closeout status with validation
 */
export declare function updateCloseoutStatus(id: string, status: CloseoutStatus, transaction?: Transaction): Promise<ConstructionCloseout>;
/**
 * 4. CREATE PUNCH LIST ITEM
 * Creates a new punch list item and updates closeout counters
 */
export declare function createPunchListItem(data: CreatePunchListItemDto, transaction?: Transaction): Promise<PunchListItem>;
/**
 * 5. GET PUNCH LIST ITEMS FOR CLOSEOUT
 * Retrieves punch list items with filtering and pagination
 */
export declare function getPunchListItemsForCloseout(closeoutId: string, options?: {
    status?: PunchListItemStatus[];
    priority?: PunchListItemPriority[];
    category?: PunchListItemCategory[];
    assignedToId?: string;
    limit?: number;
    offset?: number;
    orderBy?: string;
    orderDirection?: 'ASC' | 'DESC';
}): Promise<{
    items: PunchListItem[];
    total: number;
}>;
/**
 * 6. UPDATE PUNCH LIST ITEM STATUS
 * Updates punch list item status with workflow validation
 */
export declare function updatePunchListItemStatus(id: string, status: PunchListItemStatus, userId: string, userName: string, notes?: string, transaction?: Transaction): Promise<PunchListItem>;
/**
 * 7. ASSIGN PUNCH LIST ITEM
 * Assigns a punch list item to a user
 */
export declare function assignPunchListItem(id: string, assignedToId: string, assignedToName: string, dueDate?: Date, transaction?: Transaction): Promise<PunchListItem>;
/**
 * 8. GET CRITICAL PUNCH LIST ITEMS
 * Retrieves all critical punch list items across closeouts
 */
export declare function getCriticalPunchListItems(projectId?: string, status?: PunchListItemStatus[]): Promise<PunchListItem[]>;
/**
 * 9. GET OVERDUE PUNCH LIST ITEMS
 * Retrieves overdue punch list items
 */
export declare function getOverduePunchListItems(closeoutId?: string): Promise<PunchListItem[]>;
/**
 * 10. BULK UPDATE PUNCH LIST ITEMS
 * Updates multiple punch list items at once
 */
export declare function bulkUpdatePunchListItems(itemIds: string[], updates: UpdatePunchListItemDto, transaction?: Transaction): Promise<number>;
/**
 * 11. CREATE CLOSEOUT DOCUMENT
 * Creates a new closeout document record
 */
export declare function createCloseoutDocument(data: CreateCloseoutDocumentDto, transaction?: Transaction): Promise<CloseoutDocument>;
/**
 * 12. UPLOAD CLOSEOUT DOCUMENT
 * Uploads a document file and updates the record
 */
export declare function uploadCloseoutDocument(id: string, fileUrl: string, fileName: string, fileSize: number, mimeType: string, uploadedById: string, uploadedByName: string, transaction?: Transaction): Promise<CloseoutDocument>;
/**
 * 13. SUBMIT CLOSEOUT DOCUMENT FOR REVIEW
 * Submits a document for review
 */
export declare function submitCloseoutDocument(id: string, submittedById: string, submittedByName: string, transaction?: Transaction): Promise<CloseoutDocument>;
/**
 * 14. APPROVE CLOSEOUT DOCUMENT
 * Approves a submitted document
 */
export declare function approveCloseoutDocument(id: string, approvedById: string, approvedByName: string, reviewComments?: string, transaction?: Transaction): Promise<CloseoutDocument>;
/**
 * 15. REJECT CLOSEOUT DOCUMENT
 * Rejects a submitted document
 */
export declare function rejectCloseoutDocument(id: string, reviewedById: string, reviewedByName: string, rejectionReason: string, transaction?: Transaction): Promise<CloseoutDocument>;
/**
 * 16. GET DOCUMENTS BY TYPE
 * Retrieves closeout documents by type
 */
export declare function getDocumentsByType(closeoutId: string, documentTypes: CloseoutDocumentType[], status?: DocumentStatus[]): Promise<CloseoutDocument[]>;
/**
 * 17. GET PENDING DOCUMENTS
 * Retrieves all pending required documents
 */
export declare function getPendingDocuments(closeoutId: string): Promise<CloseoutDocument[]>;
/**
 * 18. GET AS-BUILT DOCUMENTS
 * Retrieves all as-built drawings and documentation
 */
export declare function getAsBuiltDocuments(closeoutId: string): Promise<CloseoutDocument[]>;
/**
 * 19. GET WARRANTY DOCUMENTS
 * Retrieves all warranty-related documents
 */
export declare function getWarrantyDocuments(closeoutId: string, includeExpired?: boolean): Promise<CloseoutDocument[]>;
/**
 * 20. GET O&M MANUALS
 * Retrieves O&M manual documents
 */
export declare function getOMManuals(closeoutId: string): Promise<CloseoutDocument[]>;
/**
 * 21. GET TRAINING MATERIALS
 * Retrieves training-related documents
 */
export declare function getTrainingMaterials(closeoutId: string): Promise<CloseoutDocument[]>;
/**
 * 22. SCHEDULE FINAL INSPECTION
 * Schedules the final inspection for a closeout
 */
export declare function scheduleFinalInspection(closeoutId: string, inspectionDate: Date, transaction?: Transaction): Promise<ConstructionCloseout>;
/**
 * 23. RECORD FINAL INSPECTION RESULT
 * Records the result of a final inspection
 */
export declare function recordFinalInspectionResult(closeoutId: string, result: InspectionResult, inspectionDocumentId?: string, transaction?: Transaction): Promise<ConstructionCloseout>;
/**
 * 24. RECORD CERTIFICATE OF OCCUPANCY
 * Records the certificate of occupancy
 */
export declare function recordCertificateOfOccupancy(closeoutId: string, coDate: Date, documentId?: string, transaction?: Transaction): Promise<ConstructionCloseout>;
/**
 * 25. SCHEDULE OWNER TRAINING
 * Schedules owner training session
 */
export declare function scheduleOwnerTraining(closeoutId: string, trainingDate: Date, transaction?: Transaction): Promise<ConstructionCloseout>;
/**
 * 26. COMPLETE OWNER TRAINING
 * Marks owner training as completed
 */
export declare function completeOwnerTraining(closeoutId: string, completionDate: Date, certificateDocumentId?: string, transaction?: Transaction): Promise<ConstructionCloseout>;
/**
 * 27. REGISTER WARRANTY
 * Registers a warranty for equipment or materials
 */
export declare function registerWarranty(closeoutId: string, warrantyData: {
    title: string;
    documentType: CloseoutDocumentType;
    manufacturer: string;
    modelNumber?: string;
    serialNumber?: string;
    warrantyStartDate: Date;
    warrantyEndDate: Date;
    relatedEquipment?: string;
    relatedSystem?: string;
}, transaction?: Transaction): Promise<CloseoutDocument>;
/**
 * 28. GET EXPIRING WARRANTIES
 * Retrieves warranties expiring within a specified period
 */
export declare function getExpiringWarranties(daysUntilExpiration: number, projectId?: string): Promise<CloseoutDocument[]>;
/**
 * 29. PROCESS FINAL PAYMENT
 * Processes the final payment for a closeout
 */
export declare function processFinalPayment(closeoutId: string, paymentStatus: PaymentStatus, paymentDate?: Date, transaction?: Transaction): Promise<ConstructionCloseout>;
/**
 * 30. RECORD LIEN RELEASE
 * Records receipt of a lien release
 */
export declare function recordLienRelease(closeoutId: string, lienReleaseData: {
    title: string;
    contractorName: string;
    fileUrl?: string;
    fileName?: string;
}, transaction?: Transaction): Promise<CloseoutDocument>;
/**
 * 31. GET LIEN RELEASE STATUS
 * Gets the lien release status for a closeout
 */
export declare function getLienReleaseStatus(closeoutId: string): Promise<{
    required: number;
    received: number;
    pending: number;
    documents: CloseoutDocument[];
}>;
/**
 * 32. CREATE CLOSEOUT CHECKLIST
 * Creates a closeout checklist document
 */
export declare function createCloseoutChecklist(closeoutId: string, checklistItems: Array<{
    item: string;
    required: boolean;
    completed: boolean;
    notes?: string;
}>, transaction?: Transaction): Promise<CloseoutDocument>;
/**
 * 33. UPDATE CLOSEOUT CHECKLIST
 * Updates the closeout checklist
 */
export declare function updateCloseoutChecklist(documentId: string, checklistItems: Array<{
    item: string;
    required: boolean;
    completed: boolean;
    notes?: string;
}>, transaction?: Transaction): Promise<CloseoutDocument>;
/**
 * 34. GET CLOSEOUT CHECKLIST STATUS
 * Gets the status of the closeout checklist
 */
export declare function getCloseoutChecklistStatus(closeoutId: string): Promise<{
    totalItems: number;
    completedItems: number;
    requiredItems: number;
    completedRequiredItems: number;
    percentComplete: number;
    checklist?: CloseoutDocument;
}>;
/**
 * 35. CREATE LESSONS LEARNED DOCUMENT
 * Creates a lessons learned document
 */
export declare function createLessonsLearnedDocument(closeoutId: string, lessonsData: {
    successes: string[];
    challenges: string[];
    improvements: string[];
    recommendations: string[];
}, transaction?: Transaction): Promise<CloseoutDocument>;
/**
 * 36. GET CLOSEOUT COMPLETION STATUS
 * Gets detailed completion status for a closeout
 */
export declare function getCloseoutCompletionStatus(closeoutId: string): Promise<{
    closeout: ConstructionCloseout;
    punchListStatus: {
        total: number;
        open: number;
        closed: number;
        percentComplete: number;
    };
    documentStatus: {
        required: number;
        submitted: number;
        approved: number;
        percentComplete: number;
    };
    inspectionStatus: {
        scheduled: boolean;
        completed: boolean;
        passed: boolean;
    };
    trainingStatus: {
        required: boolean;
        completed: boolean;
    };
    paymentStatus: {
        status: PaymentStatus;
        paid: boolean;
    };
    lienReleaseStatus: {
        required: number;
        received: number;
        percentComplete: number;
    };
    overallCompletion: number;
}>;
/**
 * 37. MARK SUBSTANTIAL COMPLETION
 * Marks a project as substantially complete
 */
export declare function markSubstantialCompletion(closeoutId: string, completionDate: Date, transaction?: Transaction): Promise<ConstructionCloseout>;
/**
 * 38. MARK FINAL COMPLETION
 * Marks a project as fully complete
 */
export declare function markFinalCompletion(closeoutId: string, completionDate: Date, transaction?: Transaction): Promise<ConstructionCloseout>;
/**
 * 39. GET CLOSEOUTS BY STATUS
 * Retrieves closeouts filtered by status
 */
export declare function getCloseoutsByStatus(status: CloseoutStatus[], options?: {
    projectId?: string;
    contractorId?: string;
    limit?: number;
    offset?: number;
}): Promise<{
    closeouts: ConstructionCloseout[];
    total: number;
}>;
/**
 * 40. GET ACTIVE CLOSEOUTS
 * Retrieves all active (non-complete) closeouts
 */
export declare function getActiveCloseouts(projectId?: string): Promise<ConstructionCloseout[]>;
/**
 * 41. GET CLOSEOUT SUMMARY REPORT
 * Generates a comprehensive summary report for a closeout
 */
export declare function getCloseoutSummaryReport(closeoutId: string): Promise<{
    closeout: ConstructionCloseout;
    completionStatus: any;
    punchListSummary: {
        byStatus: Record<string, number>;
        byPriority: Record<string, number>;
        byCategory: Record<string, number>;
    };
    documentSummary: {
        byType: Record<string, number>;
        byStatus: Record<string, number>;
    };
    timeline: {
        created: Date;
        substantialCompletion?: Date;
        finalInspection?: Date;
        ownerTraining?: Date;
        finalCompletion?: Date;
    };
}>;
/**
 * 42. SEARCH CLOSEOUTS
 * Searches closeouts with multiple criteria
 */
export declare function searchCloseouts(criteria: {
    projectName?: string;
    contractorName?: string;
    status?: CloseoutStatus[];
    minCompletionPercentage?: number;
    maxCompletionPercentage?: number;
    dateFrom?: Date;
    dateTo?: Date;
}, options?: {
    limit?: number;
    offset?: number;
    orderBy?: string;
    orderDirection?: 'ASC' | 'DESC';
}): Promise<{
    closeouts: ConstructionCloseout[];
    total: number;
}>;
/**
 * 43. GET CLOSEOUTS PENDING FINAL PAYMENT
 * Retrieves closeouts awaiting final payment
 */
export declare function getCloseoutsPendingFinalPayment(): Promise<ConstructionCloseout[]>;
/**
 * 44. DELETE CLOSEOUT
 * Soft deletes a closeout and all associated records
 */
export declare function deleteCloseout(id: string, transaction?: Transaction): Promise<boolean>;
/**
 * 45. EXPORT CLOSEOUT DATA
 * Exports complete closeout data with all associations
 */
export declare function exportCloseoutData(closeoutId: string): Promise<{
    closeout: ConstructionCloseout;
    punchListItems: PunchListItem[];
    documents: CloseoutDocument[];
    summary: any;
}>;
declare const _default: {
    ConstructionCloseout: typeof ConstructionCloseout;
    PunchListItem: typeof PunchListItem;
    CloseoutDocument: typeof CloseoutDocument;
    CloseoutStatus: typeof CloseoutStatus;
    PunchListItemStatus: typeof PunchListItemStatus;
    PunchListItemPriority: typeof PunchListItemPriority;
    PunchListItemCategory: typeof PunchListItemCategory;
    CloseoutDocumentType: typeof CloseoutDocumentType;
    DocumentStatus: typeof DocumentStatus;
    InspectionResult: typeof InspectionResult;
    TrainingStatus: any;
    PaymentStatus: typeof PaymentStatus;
    CreateConstructionCloseoutDto: typeof import("./construction-closeout-management-kit").CreateConstructionCloseoutDto;
    UpdateConstructionCloseoutDto: typeof import("./construction-closeout-management-kit").UpdateConstructionCloseoutDto;
    CreatePunchListItemDto: typeof import("./construction-closeout-management-kit").CreatePunchListItemDto;
    UpdatePunchListItemDto: typeof import("./construction-closeout-management-kit").UpdatePunchListItemDto;
    CreateCloseoutDocumentDto: typeof import("./construction-closeout-management-kit").CreateCloseoutDocumentDto;
    UpdateCloseoutDocumentDto: typeof import("./construction-closeout-management-kit").UpdateCloseoutDocumentDto;
    createConstructionCloseout: typeof createConstructionCloseout;
    getCloseoutByIdWithAssociations: typeof getCloseoutByIdWithAssociations;
    updateCloseoutStatus: typeof updateCloseoutStatus;
    createPunchListItem: typeof createPunchListItem;
    getPunchListItemsForCloseout: typeof getPunchListItemsForCloseout;
    updatePunchListItemStatus: typeof updatePunchListItemStatus;
    assignPunchListItem: typeof assignPunchListItem;
    getCriticalPunchListItems: typeof getCriticalPunchListItems;
    getOverduePunchListItems: typeof getOverduePunchListItems;
    bulkUpdatePunchListItems: typeof bulkUpdatePunchListItems;
    createCloseoutDocument: typeof createCloseoutDocument;
    uploadCloseoutDocument: typeof uploadCloseoutDocument;
    submitCloseoutDocument: typeof submitCloseoutDocument;
    approveCloseoutDocument: typeof approveCloseoutDocument;
    rejectCloseoutDocument: typeof rejectCloseoutDocument;
    getDocumentsByType: typeof getDocumentsByType;
    getPendingDocuments: typeof getPendingDocuments;
    getAsBuiltDocuments: typeof getAsBuiltDocuments;
    getWarrantyDocuments: typeof getWarrantyDocuments;
    getOMManuals: typeof getOMManuals;
    getTrainingMaterials: typeof getTrainingMaterials;
    scheduleFinalInspection: typeof scheduleFinalInspection;
    recordFinalInspectionResult: typeof recordFinalInspectionResult;
    recordCertificateOfOccupancy: typeof recordCertificateOfOccupancy;
    scheduleOwnerTraining: typeof scheduleOwnerTraining;
    completeOwnerTraining: typeof completeOwnerTraining;
    registerWarranty: typeof registerWarranty;
    getExpiringWarranties: typeof getExpiringWarranties;
    processFinalPayment: typeof processFinalPayment;
    recordLienRelease: typeof recordLienRelease;
    getLienReleaseStatus: typeof getLienReleaseStatus;
    createCloseoutChecklist: typeof createCloseoutChecklist;
    updateCloseoutChecklist: typeof updateCloseoutChecklist;
    getCloseoutChecklistStatus: typeof getCloseoutChecklistStatus;
    createLessonsLearnedDocument: typeof createLessonsLearnedDocument;
    getCloseoutCompletionStatus: typeof getCloseoutCompletionStatus;
    markSubstantialCompletion: typeof markSubstantialCompletion;
    markFinalCompletion: typeof markFinalCompletion;
    getCloseoutsByStatus: typeof getCloseoutsByStatus;
    getActiveCloseouts: typeof getActiveCloseouts;
    getCloseoutSummaryReport: typeof getCloseoutSummaryReport;
    searchCloseouts: typeof searchCloseouts;
    getCloseoutsPendingFinalPayment: typeof getCloseoutsPendingFinalPayment;
    deleteCloseout: typeof deleteCloseout;
    exportCloseoutData: typeof exportCloseoutData;
};
export default _default;
//# sourceMappingURL=construction-closeout-management-kit.d.ts.map