/**
 * ASSET DOCUMENTATION COMMAND FUNCTIONS
 *
 * Enterprise-grade asset documentation management system providing comprehensive
 * functionality for document management, manuals, procedures, SDS sheets, technical
 * drawings, version control, search, linking, and document lifecycle management.
 * Competes with SharePoint and Documentum solutions.
 *
 * Features:
 * - Technical documentation management
 * - Operating manuals and procedures
 * - Safety Data Sheets (SDS) management
 * - Engineering drawings and CAD files
 * - Version control and revision history
 * - Document approval workflows
 * - Full-text search and indexing
 * - Document linking and relationships
 * - Expiration and renewal tracking
 * - Compliance and regulatory documentation
 *
 * @module AssetDocumentationCommands
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
 *   createDocument,
 *   createDocumentVersion,
 *   linkDocumentToAsset,
 *   searchDocuments,
 *   DocumentType,
 *   DocumentStatus
 * } from './asset-documentation-commands';
 *
 * // Create technical document
 * const doc = await createDocument({
 *   assetId: 'asset-123',
 *   documentType: DocumentType.OPERATING_MANUAL,
 *   title: 'CNC Machine Operating Manual',
 *   description: 'Complete operating procedures',
 *   fileUrl: 's3://docs/manual-v1.pdf',
 *   version: '1.0',
 *   createdBy: 'user-456'
 * });
 *
 * // Search documents
 * const results = await searchDocuments('safety procedures', {
 *   documentTypes: [DocumentType.SOP, DocumentType.SDS]
 * });
 * ```
 */
import { Model } from 'sequelize-typescript';
import { Transaction } from 'sequelize';
/**
 * Document Type
 */
export declare enum DocumentType {
    OPERATING_MANUAL = "operating_manual",
    MAINTENANCE_MANUAL = "maintenance_manual",
    SERVICE_MANUAL = "service_manual",
    PARTS_CATALOG = "parts_catalog",
    SOP = "sop",
    WORK_INSTRUCTION = "work_instruction",
    SDS = "sds",
    TECHNICAL_DRAWING = "technical_drawing",
    CAD_FILE = "cad_file",
    SPECIFICATION = "specification",
    CERTIFICATE = "certificate",
    WARRANTY = "warranty",
    COMPLIANCE_DOC = "compliance_doc",
    INSPECTION_REPORT = "inspection_report",
    TEST_REPORT = "test_report",
    TRAINING_MATERIAL = "training_material",
    POLICY = "policy",
    PROCEDURE = "procedure",
    OTHER = "other"
}
/**
 * Document Status
 */
export declare enum DocumentStatus {
    DRAFT = "draft",
    IN_REVIEW = "in_review",
    APPROVED = "approved",
    PUBLISHED = "published",
    ARCHIVED = "archived",
    OBSOLETE = "obsolete",
    EXPIRED = "expired"
}
/**
 * Review Status
 */
export declare enum ReviewStatus {
    PENDING = "pending",
    IN_PROGRESS = "in_progress",
    APPROVED = "approved",
    REJECTED = "rejected",
    CHANGES_REQUESTED = "changes_requested"
}
/**
 * Document Access Level
 */
export declare enum AccessLevel {
    PUBLIC = "public",
    INTERNAL = "internal",
    CONFIDENTIAL = "confidential",
    RESTRICTED = "restricted",
    CLASSIFIED = "classified"
}
/**
 * File Format
 */
export declare enum FileFormat {
    PDF = "pdf",
    DOCX = "docx",
    XLSX = "xlsx",
    PPTX = "pptx",
    DWG = "dwg",
    DXF = "dxf",
    STEP = "step",
    IGES = "iges",
    JPG = "jpg",
    PNG = "png",
    MP4 = "mp4",
    HTML = "html",
    XML = "xml",
    JSON = "json"
}
/**
 * Document Data
 */
export interface DocumentData {
    assetId?: string;
    documentType: DocumentType;
    title: string;
    description?: string;
    fileUrl: string;
    fileName: string;
    fileFormat: FileFormat;
    fileSize?: number;
    version: string;
    createdBy: string;
    accessLevel?: AccessLevel;
    tags?: string[];
    metadata?: Record<string, any>;
    expirationDate?: Date;
    reviewDate?: Date;
    language?: string;
}
/**
 * Document Version Data
 */
export interface DocumentVersionData {
    documentId: string;
    version: string;
    fileUrl: string;
    fileName: string;
    changes: string;
    createdBy: string;
    releaseNotes?: string;
}
/**
 * Document Link Data
 */
export interface DocumentLinkData {
    documentId: string;
    linkedDocumentId: string;
    linkType: string;
    description?: string;
}
/**
 * Review Data
 */
export interface ReviewData {
    documentId: string;
    reviewerId: string;
    dueDate: Date;
    instructions?: string;
}
/**
 * SDS Data
 */
export interface SDSData {
    documentId: string;
    chemicalName: string;
    casNumber?: string;
    manufacturer: string;
    hazards: string[];
    handlingInstructions: string;
    storageRequirements: string;
    disposalRequirements: string;
    emergencyProcedures: string;
    exposureLimits?: Record<string, any>;
}
/**
 * Drawing Data
 */
export interface DrawingData {
    documentId: string;
    drawingNumber: string;
    revision: string;
    sheetNumber?: string;
    scale?: string;
    dimensions?: Record<string, any>;
    materials?: string[];
    tolerances?: string;
}
/**
 * Search Options
 */
export interface SearchOptions {
    query?: string;
    documentTypes?: DocumentType[];
    status?: DocumentStatus[];
    assetId?: string;
    tags?: string[];
    dateFrom?: Date;
    dateTo?: Date;
    accessLevel?: AccessLevel[];
    limit?: number;
    offset?: number;
}
/**
 * Document Model
 */
export declare class Document extends Model {
    id: string;
    documentNumber: string;
    assetId?: string;
    documentType: DocumentType;
    title: string;
    description?: string;
    status: DocumentStatus;
    fileUrl: string;
    fileName: string;
    fileFormat: FileFormat;
    fileSize?: number;
    version: string;
    createdBy: string;
    lastModifiedBy?: string;
    approvedBy?: string;
    approvalDate?: Date;
    publishedDate?: Date;
    accessLevel: AccessLevel;
    tags?: string[];
    metadata?: Record<string, any>;
    expirationDate?: Date;
    reviewDate?: Date;
    lastReviewedDate?: Date;
    language?: string;
    downloadCount: number;
    viewCount: number;
    fullTextContent?: string;
    checksum?: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    versions?: DocumentVersion[];
    reviews?: DocumentReview[];
    outgoingLinks?: DocumentLink[];
    incomingLinks?: DocumentLink[];
    static generateDocumentNumber(instance: Document): Promise<void>;
}
/**
 * Document Version Model
 */
export declare class DocumentVersion extends Model {
    id: string;
    documentId: string;
    version: string;
    previousVersion?: string;
    fileUrl: string;
    fileName: string;
    fileSize?: number;
    changes: string;
    releaseNotes?: string;
    createdBy: string;
    checksum?: string;
    createdAt: Date;
    updatedAt: Date;
    document?: Document;
}
/**
 * Document Link Model
 */
export declare class DocumentLink extends Model {
    id: string;
    documentId: string;
    linkedDocumentId: string;
    linkType: string;
    description?: string;
    createdBy?: string;
    createdAt: Date;
    updatedAt: Date;
    sourceDocument?: Document;
    targetDocument?: Document;
}
/**
 * Document Review Model
 */
export declare class DocumentReview extends Model {
    id: string;
    documentId: string;
    reviewerId: string;
    status: ReviewStatus;
    dueDate: Date;
    startedDate?: Date;
    completedDate?: Date;
    instructions?: string;
    comments?: string;
    changesRequested?: string;
    approved?: boolean;
    createdAt: Date;
    updatedAt: Date;
    document?: Document;
}
/**
 * SDS (Safety Data Sheet) Model
 */
export declare class SafetyDataSheet extends Model {
    id: string;
    documentId: string;
    chemicalName: string;
    casNumber?: string;
    manufacturer: string;
    hazards: string[];
    handlingInstructions: string;
    storageRequirements: string;
    disposalRequirements: string;
    emergencyProcedures: string;
    exposureLimits?: Record<string, any>;
    ppeRequirements?: string[];
    firstAidMeasures?: string;
    fireFightingMeasures?: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    document?: Document;
}
/**
 * Technical Drawing Model
 */
export declare class TechnicalDrawing extends Model {
    id: string;
    documentId: string;
    drawingNumber: string;
    revision: string;
    sheetNumber?: string;
    scale?: string;
    dimensions?: Record<string, any>;
    materials?: string[];
    tolerances?: string;
    drawingType?: string;
    cadSoftware?: string;
    designedBy?: string;
    checkedBy?: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    document?: Document;
}
/**
 * Document Access Log Model
 */
export declare class DocumentAccessLog extends Model {
    id: string;
    documentId: string;
    userId: string;
    action: string;
    accessedAt: Date;
    ipAddress?: string;
    userAgent?: string;
    createdAt: Date;
    updatedAt: Date;
    document?: Document;
}
/**
 * Creates a document
 *
 * @param data - Document data
 * @param transaction - Optional database transaction
 * @returns Created document
 *
 * @example
 * ```typescript
 * const doc = await createDocument({
 *   assetId: 'asset-123',
 *   documentType: DocumentType.OPERATING_MANUAL,
 *   title: 'Machine Operating Manual',
 *   fileUrl: 's3://docs/manual.pdf',
 *   fileName: 'manual.pdf',
 *   fileFormat: FileFormat.PDF,
 *   version: '1.0',
 *   createdBy: 'user-456',
 *   tags: ['manual', 'operations']
 * });
 * ```
 */
export declare function createDocument(data: DocumentData, transaction?: Transaction): Promise<Document>;
/**
 * Updates document
 *
 * @param documentId - Document ID
 * @param updates - Fields to update
 * @param userId - User making update
 * @param transaction - Optional database transaction
 * @returns Updated document
 *
 * @example
 * ```typescript
 * await updateDocument('doc-123', {
 *   title: 'Updated Manual Title',
 *   tags: ['manual', 'operations', 'safety']
 * }, 'user-456');
 * ```
 */
export declare function updateDocument(documentId: string, updates: Partial<Document>, userId: string, transaction?: Transaction): Promise<Document>;
/**
 * Gets document by ID
 *
 * @param documentId - Document ID
 * @param includeVersions - Include version history
 * @returns Document
 *
 * @example
 * ```typescript
 * const doc = await getDocument('doc-123', true);
 * ```
 */
export declare function getDocument(documentId: string, includeVersions?: boolean): Promise<Document>;
/**
 * Gets documents by asset
 *
 * @param assetId - Asset ID
 * @param documentType - Optional document type filter
 * @returns Documents
 *
 * @example
 * ```typescript
 * const docs = await getDocumentsByAsset('asset-123', DocumentType.SDS);
 * ```
 */
export declare function getDocumentsByAsset(assetId: string, documentType?: DocumentType): Promise<Document[]>;
/**
 * Publishes document
 *
 * @param documentId - Document ID
 * @param userId - User publishing
 * @param transaction - Optional database transaction
 * @returns Updated document
 *
 * @example
 * ```typescript
 * await publishDocument('doc-123', 'user-456');
 * ```
 */
export declare function publishDocument(documentId: string, userId: string, transaction?: Transaction): Promise<Document>;
/**
 * Archives document
 *
 * @param documentId - Document ID
 * @param userId - User archiving
 * @param transaction - Optional database transaction
 * @returns Updated document
 *
 * @example
 * ```typescript
 * await archiveDocument('doc-123', 'user-456');
 * ```
 */
export declare function archiveDocument(documentId: string, userId: string, transaction?: Transaction): Promise<Document>;
/**
 * Deletes document (soft delete)
 *
 * @param documentId - Document ID
 * @param userId - User deleting
 * @param transaction - Optional database transaction
 * @returns Deleted document
 *
 * @example
 * ```typescript
 * await deleteDocument('doc-123', 'user-456');
 * ```
 */
export declare function deleteDocument(documentId: string, userId: string, transaction?: Transaction): Promise<Document>;
/**
 * Creates document version
 *
 * @param data - Version data
 * @param transaction - Optional database transaction
 * @returns Created version
 *
 * @example
 * ```typescript
 * const version = await createDocumentVersion({
 *   documentId: 'doc-123',
 *   version: '2.0',
 *   fileUrl: 's3://docs/manual-v2.pdf',
 *   fileName: 'manual-v2.pdf',
 *   changes: 'Updated safety procedures',
 *   createdBy: 'user-456',
 *   releaseNotes: 'Major update with new safety guidelines'
 * });
 * ```
 */
export declare function createDocumentVersion(data: DocumentVersionData, transaction?: Transaction): Promise<DocumentVersion>;
/**
 * Gets version history
 *
 * @param documentId - Document ID
 * @returns Version history
 *
 * @example
 * ```typescript
 * const history = await getVersionHistory('doc-123');
 * ```
 */
export declare function getVersionHistory(documentId: string): Promise<DocumentVersion[]>;
/**
 * Reverts to previous version
 *
 * @param documentId - Document ID
 * @param versionId - Version to revert to
 * @param userId - User performing revert
 * @param transaction - Optional database transaction
 * @returns Updated document
 *
 * @example
 * ```typescript
 * await revertToVersion('doc-123', 'version-456', 'user-789');
 * ```
 */
export declare function revertToVersion(documentId: string, versionId: string, userId: string, transaction?: Transaction): Promise<Document>;
/**
 * Compares two versions
 *
 * @param documentId - Document ID
 * @param version1 - First version
 * @param version2 - Second version
 * @returns Comparison data
 *
 * @example
 * ```typescript
 * const diff = await compareVersions('doc-123', '1.0', '2.0');
 * ```
 */
export declare function compareVersions(documentId: string, version1: string, version2: string): Promise<{
    version1: DocumentVersion;
    version2: DocumentVersion;
    timeDiff: number;
    sizeDiff: number;
}>;
/**
 * Links documents
 *
 * @param data - Link data
 * @param transaction - Optional database transaction
 * @returns Created link
 *
 * @example
 * ```typescript
 * await linkDocuments({
 *   documentId: 'doc-123',
 *   linkedDocumentId: 'doc-456',
 *   linkType: 'references',
 *   description: 'Operating manual references SDS'
 * });
 * ```
 */
export declare function linkDocuments(data: DocumentLinkData, transaction?: Transaction): Promise<DocumentLink>;
/**
 * Unlinks documents
 *
 * @param linkId - Link ID
 * @param transaction - Optional database transaction
 * @returns Deleted link
 *
 * @example
 * ```typescript
 * await unlinkDocuments('link-123');
 * ```
 */
export declare function unlinkDocuments(linkId: string, transaction?: Transaction): Promise<DocumentLink>;
/**
 * Gets linked documents
 *
 * @param documentId - Document ID
 * @param direction - 'outgoing', 'incoming', or 'both'
 * @returns Linked documents
 *
 * @example
 * ```typescript
 * const links = await getLinkedDocuments('doc-123', 'both');
 * ```
 */
export declare function getLinkedDocuments(documentId: string, direction?: 'outgoing' | 'incoming' | 'both'): Promise<DocumentLink[]>;
/**
 * Links document to asset
 *
 * @param documentId - Document ID
 * @param assetId - Asset ID
 * @param userId - User creating link
 * @param transaction - Optional database transaction
 * @returns Updated document
 *
 * @example
 * ```typescript
 * await linkDocumentToAsset('doc-123', 'asset-456', 'user-789');
 * ```
 */
export declare function linkDocumentToAsset(documentId: string, assetId: string, userId: string, transaction?: Transaction): Promise<Document>;
/**
 * Creates document review
 *
 * @param data - Review data
 * @param transaction - Optional database transaction
 * @returns Created review
 *
 * @example
 * ```typescript
 * const review = await createDocumentReview({
 *   documentId: 'doc-123',
 *   reviewerId: 'reviewer-456',
 *   dueDate: new Date('2024-12-31'),
 *   instructions: 'Please review for technical accuracy'
 * });
 * ```
 */
export declare function createDocumentReview(data: ReviewData, transaction?: Transaction): Promise<DocumentReview>;
/**
 * Starts review
 *
 * @param reviewId - Review ID
 * @param transaction - Optional database transaction
 * @returns Updated review
 *
 * @example
 * ```typescript
 * await startReview('review-123');
 * ```
 */
export declare function startReview(reviewId: string, transaction?: Transaction): Promise<DocumentReview>;
/**
 * Approves document in review
 *
 * @param reviewId - Review ID
 * @param comments - Approval comments
 * @param transaction - Optional database transaction
 * @returns Updated review
 *
 * @example
 * ```typescript
 * await approveDocumentReview('review-123', 'Approved - looks good');
 * ```
 */
export declare function approveDocumentReview(reviewId: string, comments?: string, transaction?: Transaction): Promise<DocumentReview>;
/**
 * Rejects document in review
 *
 * @param reviewId - Review ID
 * @param reason - Rejection reason
 * @param changesRequested - Changes requested
 * @param transaction - Optional database transaction
 * @returns Updated review
 *
 * @example
 * ```typescript
 * await rejectDocumentReview('review-123', 'Technical inaccuracies found', 'Update section 3.2');
 * ```
 */
export declare function rejectDocumentReview(reviewId: string, reason: string, changesRequested?: string, transaction?: Transaction): Promise<DocumentReview>;
/**
 * Gets pending reviews
 *
 * @param reviewerId - Optional reviewer filter
 * @returns Pending reviews
 *
 * @example
 * ```typescript
 * const myReviews = await getPendingReviews('reviewer-123');
 * ```
 */
export declare function getPendingReviews(reviewerId?: string): Promise<DocumentReview[]>;
/**
 * Searches documents
 *
 * @param query - Search query
 * @param options - Search options
 * @returns Search results
 *
 * @example
 * ```typescript
 * const results = await searchDocuments('safety procedures', {
 *   documentTypes: [DocumentType.SOP, DocumentType.SDS],
 *   tags: ['safety'],
 *   dateFrom: new Date('2024-01-01')
 * });
 * ```
 */
export declare function searchDocuments(query: string, options?: SearchOptions): Promise<Document[]>;
/**
 * Searches by tags
 *
 * @param tags - Tags to search
 * @returns Documents
 *
 * @example
 * ```typescript
 * const docs = await searchByTags(['manual', 'operations']);
 * ```
 */
export declare function searchByTags(tags: string[]): Promise<Document[]>;
/**
 * Gets expiring documents
 *
 * @param daysAhead - Days to look ahead
 * @returns Expiring documents
 *
 * @example
 * ```typescript
 * const expiring = await getExpiringDocuments(30); // Next 30 days
 * ```
 */
export declare function getExpiringDocuments(daysAhead?: number): Promise<Document[]>;
/**
 * Gets documents due for review
 *
 * @param daysAhead - Days to look ahead
 * @returns Documents due for review
 *
 * @example
 * ```typescript
 * const dueForReview = await getDocumentsDueForReview(14);
 * ```
 */
export declare function getDocumentsDueForReview(daysAhead?: number): Promise<Document[]>;
/**
 * Creates Safety Data Sheet
 *
 * @param data - SDS data
 * @param transaction - Optional database transaction
 * @returns Created SDS
 *
 * @example
 * ```typescript
 * const sds = await createSDS({
 *   documentId: 'doc-123',
 *   chemicalName: 'Acetone',
 *   casNumber: '67-64-1',
 *   manufacturer: 'Chemical Co',
 *   hazards: ['Flammable', 'Irritant'],
 *   handlingInstructions: 'Use in well-ventilated area',
 *   storageRequirements: 'Store in cool, dry place',
 *   disposalRequirements: 'Dispose as hazardous waste',
 *   emergencyProcedures: 'In case of spill, evacuate area'
 * });
 * ```
 */
export declare function createSDS(data: SDSData, transaction?: Transaction): Promise<SafetyDataSheet>;
/**
 * Gets SDS by chemical name
 *
 * @param chemicalName - Chemical name
 * @returns SDS records
 *
 * @example
 * ```typescript
 * const sds = await getSDSByChemical('Acetone');
 * ```
 */
export declare function getSDSByChemical(chemicalName: string): Promise<SafetyDataSheet[]>;
/**
 * Gets SDS by CAS number
 *
 * @param casNumber - CAS number
 * @returns SDS record
 *
 * @example
 * ```typescript
 * const sds = await getSDSByCAS('67-64-1');
 * ```
 */
export declare function getSDSByCAS(casNumber: string): Promise<SafetyDataSheet | null>;
/**
 * Creates technical drawing
 *
 * @param data - Drawing data
 * @param transaction - Optional database transaction
 * @returns Created drawing
 *
 * @example
 * ```typescript
 * const drawing = await createTechnicalDrawing({
 *   documentId: 'doc-123',
 *   drawingNumber: 'DWG-2024-001',
 *   revision: 'A',
 *   scale: '1:10',
 *   materials: ['Steel', 'Aluminum']
 * });
 * ```
 */
export declare function createTechnicalDrawing(data: DrawingData, transaction?: Transaction): Promise<TechnicalDrawing>;
/**
 * Gets drawing by number
 *
 * @param drawingNumber - Drawing number
 * @returns Drawing record
 *
 * @example
 * ```typescript
 * const drawing = await getDrawingByNumber('DWG-2024-001');
 * ```
 */
export declare function getDrawingByNumber(drawingNumber: string): Promise<TechnicalDrawing | null>;
/**
 * Gets drawings by revision
 *
 * @param drawingNumber - Drawing number
 * @returns Drawing revisions
 *
 * @example
 * ```typescript
 * const revisions = await getDrawingRevisions('DWG-2024-001');
 * ```
 */
export declare function getDrawingRevisions(drawingNumber: string): Promise<TechnicalDrawing[]>;
/**
 * Logs document access
 *
 * @param documentId - Document ID
 * @param userId - User ID
 * @param action - Action performed
 * @param metadata - Additional metadata
 * @param transaction - Optional database transaction
 * @returns Access log entry
 *
 * @example
 * ```typescript
 * await logDocumentAccess('doc-123', 'user-456', 'view', { ipAddress: '192.168.1.1' });
 * ```
 */
export declare function logDocumentAccess(documentId: string, userId: string, action: string, metadata?: {
    ipAddress?: string;
    userAgent?: string;
}, transaction?: Transaction): Promise<DocumentAccessLog>;
/**
 * Gets access logs for document
 *
 * @param documentId - Document ID
 * @param limit - Maximum logs to return
 * @returns Access logs
 *
 * @example
 * ```typescript
 * const logs = await getDocumentAccessLogs('doc-123', 50);
 * ```
 */
export declare function getDocumentAccessLogs(documentId: string, limit?: number): Promise<DocumentAccessLog[]>;
/**
 * Gets user access history
 *
 * @param userId - User ID
 * @param limit - Maximum logs to return
 * @returns Access logs
 *
 * @example
 * ```typescript
 * const history = await getUserAccessHistory('user-123', 20);
 * ```
 */
export declare function getUserAccessHistory(userId: string, limit?: number): Promise<DocumentAccessLog[]>;
/**
 * Bulk updates document status
 *
 * @param documentIds - Document IDs
 * @param status - New status
 * @param userId - User making update
 * @param transaction - Optional database transaction
 * @returns Number of updated documents
 *
 * @example
 * ```typescript
 * await bulkUpdateStatus(['doc-1', 'doc-2'], DocumentStatus.PUBLISHED, 'user-123');
 * ```
 */
export declare function bulkUpdateStatus(documentIds: string[], status: DocumentStatus, userId: string, transaction?: Transaction): Promise<number>;
/**
 * Bulk adds tags
 *
 * @param documentIds - Document IDs
 * @param tags - Tags to add
 * @param userId - User adding tags
 * @param transaction - Optional database transaction
 * @returns Updated documents
 *
 * @example
 * ```typescript
 * await bulkAddTags(['doc-1', 'doc-2'], ['safety', 'critical'], 'user-123');
 * ```
 */
export declare function bulkAddTags(documentIds: string[], tags: string[], userId: string, transaction?: Transaction): Promise<Document[]>;
/**
 * Bulk exports documents
 *
 * @param documentIds - Document IDs
 * @returns Export manifest
 *
 * @example
 * ```typescript
 * const manifest = await bulkExportDocuments(['doc-1', 'doc-2', 'doc-3']);
 * ```
 */
export declare function bulkExportDocuments(documentIds: string[]): Promise<{
    documents: Document[];
    totalSize: number;
}>;
declare const _default: {
    Document: typeof Document;
    DocumentVersion: typeof DocumentVersion;
    DocumentLink: typeof DocumentLink;
    DocumentReview: typeof DocumentReview;
    SafetyDataSheet: typeof SafetyDataSheet;
    TechnicalDrawing: typeof TechnicalDrawing;
    DocumentAccessLog: typeof DocumentAccessLog;
    createDocument: typeof createDocument;
    updateDocument: typeof updateDocument;
    getDocument: typeof getDocument;
    getDocumentsByAsset: typeof getDocumentsByAsset;
    publishDocument: typeof publishDocument;
    archiveDocument: typeof archiveDocument;
    deleteDocument: typeof deleteDocument;
    createDocumentVersion: typeof createDocumentVersion;
    getVersionHistory: typeof getVersionHistory;
    revertToVersion: typeof revertToVersion;
    compareVersions: typeof compareVersions;
    linkDocuments: typeof linkDocuments;
    unlinkDocuments: typeof unlinkDocuments;
    getLinkedDocuments: typeof getLinkedDocuments;
    linkDocumentToAsset: typeof linkDocumentToAsset;
    createDocumentReview: typeof createDocumentReview;
    startReview: typeof startReview;
    approveDocumentReview: typeof approveDocumentReview;
    rejectDocumentReview: typeof rejectDocumentReview;
    getPendingReviews: typeof getPendingReviews;
    searchDocuments: typeof searchDocuments;
    searchByTags: typeof searchByTags;
    getExpiringDocuments: typeof getExpiringDocuments;
    getDocumentsDueForReview: typeof getDocumentsDueForReview;
    createSDS: typeof createSDS;
    getSDSByChemical: typeof getSDSByChemical;
    getSDSByCAS: typeof getSDSByCAS;
    createTechnicalDrawing: typeof createTechnicalDrawing;
    getDrawingByNumber: typeof getDrawingByNumber;
    getDrawingRevisions: typeof getDrawingRevisions;
    logDocumentAccess: typeof logDocumentAccess;
    getDocumentAccessLogs: typeof getDocumentAccessLogs;
    getUserAccessHistory: typeof getUserAccessHistory;
    bulkUpdateStatus: typeof bulkUpdateStatus;
    bulkAddTags: typeof bulkAddTags;
    bulkExportDocuments: typeof bulkExportDocuments;
};
export default _default;
//# sourceMappingURL=asset-documentation-commands.d.ts.map