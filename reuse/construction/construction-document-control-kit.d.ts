/**
 * LOC: CONST-DC-001
 * File: /reuse/construction/construction-document-control-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - class-validator
 *   - class-transformer
 *
 * DOWNSTREAM (imported by):
 *   - Construction project management systems
 *   - Document management services
 *   - Drawing and specification tracking modules
 */
import { ConstructionDocument } from './models/construction-document.model';
import { DocumentRevision } from './models/document-revision.model';
import { DocumentDistribution } from './models/document-distribution.model';
import { DocumentType, DocumentDiscipline, DocumentStatus, RevisionType, RetentionPeriod } from './types/document.types';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { CreateRevisionDto } from './dto/create-revision.dto';
import { DistributeDocumentDto } from './dto/distribute-document.dto';
import { AcknowledgeDocumentDto } from './dto/acknowledge-document.dto';
/**
 * Creates a new construction document with auto-generated document number
 *
 * @param data - Document creation data
 * @param userId - User creating the document
 * @returns Created construction document
 *
 * @example
 * ```typescript
 * const document = await createDocument({
 *   title: 'Foundation Plan - Level B1',
 *   documentType: DocumentType.DRAWING,
 *   discipline: DocumentDiscipline.STRUCTURAL,
 *   projectId: 'project-123',
 *   fileUrl: 'https://storage.example.com/drawings/S-101.pdf'
 * }, 'user-456');
 * ```
 */
export declare function createDocument(data: Omit<ConstructionDocument, 'id' | 'documentNumber' | 'status' | 'revision' | 'createdAt' | 'updatedAt'>, userId: string): Promise<ConstructionDocument>;
/**
 * Generates a unique document number based on type, discipline, and project
 *
 * @param type - Document type
 * @param discipline - Document discipline
 * @param projectId - Project identifier
 * @returns Formatted document number
 *
 * @example
 * ```typescript
 * const docNumber = generateDocumentNumber(
 *   DocumentType.DRAWING,
 *   DocumentDiscipline.STRUCTURAL,
 *   'PRJ-001'
 * );
 * // Returns: "PRJ001-S-DRW-001"
 * ```
 */
export declare function generateDocumentNumber(type: DocumentType, discipline: DocumentDiscipline, projectId: string): string;
/**
 * Updates document metadata and properties
 *
 * @param documentId - Document identifier
 * @param updates - Update data
 * @param userId - User making the update
 * @returns Updated document
 *
 * @example
 * ```typescript
 * await updateDocument('doc-123', {
 *   status: DocumentStatus.APPROVED,
 *   tags: ['foundation', 'basement']
 * }, 'user-456');
 * ```
 */
export declare function updateDocument(documentId: string, updates: Partial<ConstructionDocument>, userId: string): Promise<ConstructionDocument>;
/**
 * Deletes a document (soft delete)
 *
 * @param documentId - Document identifier
 * @param userId - User deleting the document
 *
 * @example
 * ```typescript
 * await deleteDocument('doc-123', 'user-456');
 * ```
 */
export declare function deleteDocument(documentId: string, userId: string): Promise<void>;
/**
 * Searches documents with filters
 *
 * @param filters - Search filters
 * @returns Filtered documents
 *
 * @example
 * ```typescript
 * const documents = await searchDocuments({
 *   projectId: 'project-123',
 *   documentType: DocumentType.DRAWING,
 *   status: DocumentStatus.APPROVED
 * });
 * ```
 */
export declare function searchDocuments(filters: DocumentFilter): Promise<ConstructionDocument[]>;
/**
 * Creates a new document revision
 *
 * @param documentId - Original document ID
 * @param revisionData - Revision data
 * @param userId - User creating revision
 * @returns Created revision
 *
 * @example
 * ```typescript
 * const revision = await createRevision('doc-123', {
 *   revisionType: RevisionType.MAJOR,
 *   description: 'Updated foundation design per structural review',
 *   fileUrl: 'https://storage.example.com/drawings/S-101-rev-B.pdf',
 *   changes: [
 *     { section: 'Grid A-C', description: 'Increased footing size', reason: 'Soil bearing capacity' }
 *   ]
 * }, 'user-456');
 * ```
 */
export declare function createRevision(documentId: string, revisionData: Omit<DocumentRevision, 'id' | 'createdAt' | 'updatedAt' | 'revisionNumber'>, userId: string): Promise<DocumentRevision>;
/**
 * Increments revision number based on revision type
 *
 * @param currentRevision - Current revision (e.g., 'A', 'B', 'C1')
 * @param revisionType - Type of revision
 * @returns Next revision number
 *
 * @example
 * ```typescript
 * incrementRevision('A', RevisionType.MAJOR); // Returns: 'B'
 * incrementRevision('B', RevisionType.MINOR); // Returns: 'B1'
 * incrementRevision('B1', RevisionType.MINOR); // Returns: 'B2'
 * ```
 */
export declare function incrementRevision(currentRevision: string, revisionType: RevisionType): string;
/**
 * Gets revision history for a document
 *
 * @param documentId - Document identifier
 * @returns Array of revisions
 *
 * @example
 * ```typescript
 * const history = await getRevisionHistory('doc-123');
 * ```
 */
export declare function getRevisionHistory(documentId: string): Promise<DocumentRevision[]>;
/**
 * Compares two document revisions
 *
 * @param revisionId1 - First revision ID
 * @param revisionId2 - Second revision ID
 * @returns Comparison result
 *
 * @example
 * ```typescript
 * const comparison = await compareRevisions('rev-1', 'rev-2');
 * ```
 */
export declare function compareRevisions(revisionId1: string, revisionId2: string): Promise<{
    revision1: DocumentRevision;
    revision2: DocumentRevision;
    differences: RevisionChange[];
}>;
/**
 * Supersedes an old revision
 *
 * @param revisionId - Revision to supersede
 * @param userId - User superseding the revision
 *
 * @example
 * ```typescript
 * await supersedeRevision('rev-old', 'user-456');
 * ```
 */
export declare function supersedeRevision(revisionId: string, userId: string): Promise<void>;
/**
 * Creates a drawing with sheet-specific metadata
 *
 * @param drawingData - Drawing creation data
 * @param userId - User creating drawing
 * @returns Created drawing document
 *
 * @example
 * ```typescript
 * const drawing = await createDrawing({
 *   title: 'Floor Plan - Level 1',
 *   discipline: DocumentDiscipline.ARCHITECTURAL,
 *   projectId: 'project-123',
 *   fileUrl: 'https://storage.example.com/drawings/A-101.pdf',
 *   metadata: {
 *     sheetNumber: 'A-101',
 *     sheetSize: '24x36',
 *     scale: '1/4" = 1\'-0"',
 *     phase: 'Construction Documents'
 *   }
 * }, 'user-456');
 * ```
 */
export declare function createDrawing(drawingData: Omit<ConstructionDocument, 'id' | 'documentNumber' | 'documentType' | 'status' | 'revision'>, userId: string): Promise<ConstructionDocument>;
/**
 * Gets drawings by sheet number pattern
 *
 * @param projectId - Project identifier
 * @param sheetPattern - Sheet number pattern (e.g., 'A-1*')
 * @returns Matching drawings
 *
 * @example
 * ```typescript
 * const archDrawings = await getDrawingsBySheet('project-123', 'A-*');
 * ```
 */
export declare function getDrawingsBySheet(projectId: string, sheetPattern: string): Promise<ConstructionDocument[]>;
/**
 * Links related drawings (e.g., plans, sections, details)
 *
 * @param drawingId - Primary drawing ID
 * @param relatedDrawingIds - Related drawing IDs
 *
 * @example
 * ```typescript
 * await linkRelatedDrawings('drawing-plan', ['drawing-section-1', 'drawing-detail-1']);
 * ```
 */
export declare function linkRelatedDrawings(drawingId: string, relatedDrawingIds: string[]): Promise<void>;
/**
 * Validates drawing sheet numbers for consistency
 *
 * @param projectId - Project identifier
 * @returns Validation results
 *
 * @example
 * ```typescript
 * const validation = await validateDrawingSheetNumbers('project-123');
 * ```
 */
export declare function validateDrawingSheetNumbers(projectId: string): Promise<{
    valid: boolean;
    duplicates: string[];
    gaps: string[];
}>;
/**
 * Creates a specification document
 *
 * @param specData - Specification data
 * @param userId - User creating specification
 * @returns Created specification
 *
 * @example
 * ```typescript
 * const spec = await createSpecification({
 *   title: 'Division 03 - Concrete',
 *   discipline: DocumentDiscipline.STRUCTURAL,
 *   projectId: 'project-123',
 *   fileUrl: 'https://storage.example.com/specs/03-3000.pdf',
 *   metadata: { division: '03', section: '03 3000' }
 * }, 'user-456');
 * ```
 */
export declare function createSpecification(specData: Omit<ConstructionDocument, 'id' | 'documentNumber' | 'documentType' | 'status' | 'revision'>, userId: string): Promise<ConstructionDocument>;
/**
 * Gets specifications by division
 *
 * @param projectId - Project identifier
 * @param division - CSI division number
 * @returns Specifications in division
 *
 * @example
 * ```typescript
 * const concreteSpecs = await getSpecificationsByDivision('project-123', '03');
 * ```
 */
export declare function getSpecificationsByDivision(projectId: string, division: string): Promise<ConstructionDocument[]>;
/**
 * Creates an addendum to specifications
 *
 * @param specificationId - Specification ID
 * @param addendumData - Addendum data
 * @param userId - User creating addendum
 * @returns Created addendum
 *
 * @example
 * ```typescript
 * const addendum = await createAddendum('spec-123', {
 *   description: 'Clarification on concrete mix design',
 *   changes: [{ section: '03 3000', description: 'Updated mix requirements', reason: 'Code update' }]
 * }, 'user-456');
 * ```
 */
export declare function createAddendum(specificationId: string, addendumData: {
    description: string;
    changes: RevisionChange[];
}, userId: string): Promise<ConstructionDocument>;
/**
 * Distributes document to recipients
 *
 * @param documentId - Document to distribute
 * @param recipientIds - Recipient user IDs
 * @param options - Distribution options
 * @param userId - User distributing document
 * @returns Distribution records
 *
 * @example
 * ```typescript
 * await distributeDocument('doc-123', ['user-1', 'user-2'], {
 *   requiresSignature: true,
 *   deliveryMethod: 'email'
 * }, 'user-admin');
 * ```
 */
export declare function distributeDocument(documentId: string, recipientIds: string[], options: {
    requiresSignature?: boolean;
    deliveryMethod?: string;
    notes?: string;
}, userId: string): Promise<DocumentDistribution[]>;
/**
 * Marks distribution as sent
 *
 * @param distributionId - Distribution ID
 * @returns Updated distribution
 *
 * @example
 * ```typescript
 * await markDistributionSent('dist-123');
 * ```
 */
export declare function markDistributionSent(distributionId: string): Promise<DocumentDistribution>;
/**
 * Marks distribution as delivered
 *
 * @param distributionId - Distribution ID
 * @returns Updated distribution
 *
 * @example
 * ```typescript
 * await markDistributionDelivered('dist-123');
 * ```
 */
export declare function markDistributionDelivered(distributionId: string): Promise<DocumentDistribution>;
/**
 * Acknowledges document receipt
 *
 * @param distributionId - Distribution ID
 * @param signatureUrl - Optional signature URL
 * @param notes - Acknowledgment notes
 * @returns Updated distribution
 *
 * @example
 * ```typescript
 * await acknowledgeDocumentReceipt('dist-123', 'https://storage/signature.png', 'Reviewed and approved');
 * ```
 */
export declare function acknowledgeDocumentReceipt(distributionId: string, signatureUrl?: string, notes?: string): Promise<DocumentDistribution>;
/**
 * Gets distribution status for document
 *
 * @param documentId - Document ID
 * @returns Distribution records with status
 *
 * @example
 * ```typescript
 * const status = await getDistributionStatus('doc-123');
 * ```
 */
export declare function getDistributionStatus(documentId: string): Promise<DocumentDistribution[]>;
/**
 * Gets pending acknowledgments for user
 *
 * @param userId - User ID
 * @returns Pending distributions requiring acknowledgment
 *
 * @example
 * ```typescript
 * const pending = await getPendingAcknowledgments('user-123');
 * ```
 */
export declare function getPendingAcknowledgments(userId: string): Promise<DocumentDistribution[]>;
/**
 * Sets retention period for document
 *
 * @param documentId - Document ID
 * @param retentionPeriod - Retention period
 * @returns Updated document
 *
 * @example
 * ```typescript
 * await setRetentionPeriod('doc-123', RetentionPeriod.SEVEN_YEARS);
 * ```
 */
export declare function setRetentionPeriod(documentId: string, retentionPeriod: RetentionPeriod): Promise<ConstructionDocument>;
/**
 * Archives document
 *
 * @param documentId - Document ID
 * @param userId - User archiving document
 *
 * @example
 * ```typescript
 * await archiveDocument('doc-123', 'user-admin');
 * ```
 */
export declare function archiveDocument(documentId: string, userId: string): Promise<void>;
/**
 * Gets documents eligible for archival
 *
 * @param projectId - Project ID
 * @returns Documents eligible for archival
 *
 * @example
 * ```typescript
 * const eligible = await getEligibleForArchival('project-123');
 * ```
 */
export declare function getEligibleForArchival(projectId: string): Promise<ConstructionDocument[]>;
/**
 * Calculates document retention expiration date
 *
 * @param document - Construction document
 * @returns Expiration date
 *
 * @example
 * ```typescript
 * const expirationDate = calculateRetentionExpiration(document);
 * ```
 */
export declare function calculateRetentionExpiration(document: ConstructionDocument): Date;
/**
 * Purges expired documents
 *
 * @param projectId - Project ID
 * @returns Count of purged documents
 *
 * @example
 * ```typescript
 * const purged = await purgeExpiredDocuments('project-123');
 * ```
 */
export declare function purgeExpiredDocuments(projectId: string): Promise<number>;
/**
 * Gets document statistics for project
 *
 * @param projectId - Project ID
 * @returns Document statistics
 *
 * @example
 * ```typescript
 * const stats = await getDocumentStatistics('project-123');
 * ```
 */
export declare function getDocumentStatistics(projectId: string): Promise<DocumentStatistics>;
/**
 * Generates document register report
 *
 * @param projectId - Project ID
 * @param filters - Optional filters
 * @returns Document register
 *
 * @example
 * ```typescript
 * const register = await generateDocumentRegister('project-123', {
 *   documentType: DocumentType.DRAWING
 * });
 * ```
 */
export declare function generateDocumentRegister(projectId: string, filters?: Partial<DocumentFilter>): Promise<ConstructionDocument[]>;
/**
 * Construction Document Control Controller
 * Provides RESTful API endpoints for document management operations
 */
export declare class ConstructionDocumentController {
    /**
     * Create a new document
     */
    create(createDto: CreateDocumentDto): Promise<ConstructionDocument>;
    /**
     * Search documents
     */
    search(projectId?: string, documentType?: DocumentType, discipline?: DocumentDiscipline, status?: DocumentStatus): Promise<ConstructionDocument[]>;
    /**
     * Get document by ID
     */
    findOne(id: string): Promise<any>;
    /**
     * Update document
     */
    update(id: string, updateDto: UpdateDocumentDto): Promise<ConstructionDocument>;
    /**
     * Delete document
     */
    delete(id: string): Promise<void>;
    /**
     * Create revision
     */
    createRevisionEndpoint(id: string, revisionDto: CreateRevisionDto): Promise<DocumentRevision>;
    /**
     * Get revision history
     */
    getRevisions(id: string): Promise<DocumentRevision[]>;
    /**
     * Distribute document
     */
    distribute(id: string, distributeDto: DistributeDocumentDto): Promise<DocumentDistribution[]>;
    /**
     * Get distribution status
     */
    getDistributions(id: string): Promise<DocumentDistribution[]>;
    /**
     * Acknowledge document receipt
     */
    acknowledge(distributionId: string, acknowledgeDto: AcknowledgeDocumentDto): Promise<DocumentDistribution>;
    /**
     * Get project statistics
     */
    getStatistics(projectId: string): Promise<DocumentStatistics>;
    /**
     * Generate document register
     */
    getRegister(projectId: string): Promise<ConstructionDocument[]>;
}
declare const _default: {
    createDocument: typeof createDocument;
    generateDocumentNumber: typeof generateDocumentNumber;
    updateDocument: typeof updateDocument;
    deleteDocument: typeof deleteDocument;
    searchDocuments: typeof searchDocuments;
    createRevision: typeof createRevision;
    incrementRevision: typeof incrementRevision;
    getRevisionHistory: typeof getRevisionHistory;
    compareRevisions: typeof compareRevisions;
    supersedeRevision: typeof supersedeRevision;
    createDrawing: typeof createDrawing;
    getDrawingsBySheet: typeof getDrawingsBySheet;
    linkRelatedDrawings: typeof linkRelatedDrawings;
    validateDrawingSheetNumbers: typeof validateDrawingSheetNumbers;
    createSpecification: typeof createSpecification;
    getSpecificationsByDivision: typeof getSpecificationsByDivision;
    createAddendum: typeof createAddendum;
    distributeDocument: typeof distributeDocument;
    markDistributionSent: typeof markDistributionSent;
    markDistributionDelivered: typeof markDistributionDelivered;
    acknowledgeDocumentReceipt: typeof acknowledgeDocumentReceipt;
    getDistributionStatus: typeof getDistributionStatus;
    getPendingAcknowledgments: typeof getPendingAcknowledgments;
    setRetentionPeriod: typeof setRetentionPeriod;
    archiveDocument: typeof archiveDocument;
    getEligibleForArchival: typeof getEligibleForArchival;
    calculateRetentionExpiration: typeof calculateRetentionExpiration;
    purgeExpiredDocuments: typeof purgeExpiredDocuments;
    getDocumentStatistics: typeof getDocumentStatistics;
    generateDocumentRegister: typeof generateDocumentRegister;
    ConstructionDocument: typeof ConstructionDocument;
    DocumentRevision: typeof DocumentRevision;
    DocumentDistribution: typeof DocumentDistribution;
    ConstructionDocumentController: typeof ConstructionDocumentController;
};
export default _default;
//# sourceMappingURL=construction-document-control-kit.d.ts.map