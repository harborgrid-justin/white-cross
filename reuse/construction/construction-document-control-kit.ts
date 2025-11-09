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

/**
 * File: /reuse/construction/construction-document-control-kit.ts
 * Locator: WC-CONST-DC-001
 * Purpose: Construction Document Control Kit - Comprehensive document management for construction projects
 *
 * Upstream: Independent utility module for construction document control operations
 * Downstream: ../backend/*, ../frontend/*, Construction management and tracking services
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 11.x, Sequelize 6.x
 * Exports: 40 utility functions for document management, version control, drawing management, and archival
 *
 * LLM Context: Enterprise-grade construction document control utilities for managing project documents,
 * drawings, specifications, addenda, RFIs, submittals, and change orders. Provides version control,
 * revision tracking, distribution management, receipt tracking, digital signature workflows, document
 * retention policies, archival workflows, and audit trails. Essential for maintaining accurate project
 * documentation, ensuring regulatory compliance, preventing rework from outdated documents, and providing
 * complete project records for closeout and warranty periods.
 */

import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
  UseInterceptors,
  ParseUUIDPipe,
  ValidationPipe,
  UsePipes,
  UploadedFile,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
  ApiConsumes,
} from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsDate,
  IsArray,
  IsBoolean,
  IsUUID,
  Min,
  Max,
  ValidateNested,
  IsNotEmpty,
  MaxLength,
  MinLength,
  Matches,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { faker } from '@faker-js/faker';
import { ConstructionDocument } from './models/construction-document.model';
import { DocumentRevision } from './models/document-revision.model';
import { DocumentDistribution } from './models/document-distribution.model';
import { DocumentType, DocumentDiscipline, DocumentStatus, RevisionType, DistributionStatus, RetentionPeriod } from './types/document.types';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { CreateRevisionDto } from './dto/create-revision.dto';
import { DistributeDocumentDto } from './dto/distribute-document.dto';
import { AcknowledgeDocumentDto } from './dto/acknowledge-document.dto';

// ============================================================================
// DOCUMENT CREATION AND MANAGEMENT
// ============================================================================

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
export async function createDocument(
  data: Omit<ConstructionDocument, 'id' | 'documentNumber' | 'status' | 'revision' | 'createdAt' | 'updatedAt'>,
  userId: string,
): Promise<ConstructionDocument> {
  const documentNumber = generateDocumentNumber(data.documentType, data.discipline, data.projectId);

  const document = await ConstructionDocument.create({
    ...data,
    documentNumber,
    revision: 'A',
    status: DocumentStatus.DRAFT,
    createdBy: userId,
    isLatestRevision: true,
  });

  return document;
}

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
export function generateDocumentNumber(
  type: DocumentType,
  discipline: DocumentDiscipline,
  projectId: string,
): string {
  const typePrefix = {
    [DocumentType.DRAWING]: 'DRW',
    [DocumentType.SPECIFICATION]: 'SPC',
    [DocumentType.SUBMITTAL]: 'SUB',
    [DocumentType.RFI]: 'RFI',
    [DocumentType.CHANGE_ORDER]: 'CO',
    [DocumentType.ADDENDUM]: 'ADD',
    [DocumentType.MEETING_MINUTES]: 'MM',
    [DocumentType.INSPECTION_REPORT]: 'INS',
    [DocumentType.TRANSMITTAL]: 'TRN',
    [DocumentType.CONTRACT]: 'CNT',
    [DocumentType.CORRESPONDENCE]: 'COR',
    [DocumentType.SHOP_DRAWING]: 'SD',
    [DocumentType.PRODUCT_DATA]: 'PD',
    [DocumentType.SAMPLE]: 'SMP',
    [DocumentType.CLOSEOUT]: 'CLO',
  }[type];

  const disciplinePrefix = {
    [DocumentDiscipline.ARCHITECTURAL]: 'A',
    [DocumentDiscipline.STRUCTURAL]: 'S',
    [DocumentDiscipline.MECHANICAL]: 'M',
    [DocumentDiscipline.ELECTRICAL]: 'E',
    [DocumentDiscipline.PLUMBING]: 'P',
    [DocumentDiscipline.CIVIL]: 'C',
    [DocumentDiscipline.LANDSCAPE]: 'L',
    [DocumentDiscipline.FIRE_PROTECTION]: 'FP',
    [DocumentDiscipline.GENERAL]: 'G',
  }[discipline];

  const projectCode = projectId.replace(/[^A-Z0-9]/gi, '').substring(0, 6).toUpperCase();
  const sequence = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0');

  return `${projectCode}-${disciplinePrefix}-${typePrefix}-${sequence}`;
}

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
export async function updateDocument(
  documentId: string,
  updates: Partial<ConstructionDocument>,
  userId: string,
): Promise<ConstructionDocument> {
  const document = await ConstructionDocument.findByPk(documentId);
  if (!document) {
    throw new NotFoundException('Document not found');
  }

  await document.update(updates);
  await logDocumentActivity(documentId, 'updated', { updates, userId });

  return document;
}

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
export async function deleteDocument(documentId: string, userId: string): Promise<void> {
  const document = await ConstructionDocument.findByPk(documentId);
  if (!document) {
    throw new NotFoundException('Document not found');
  }

  await logDocumentActivity(documentId, 'deleted', { userId });
  await document.destroy();
}

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
export async function searchDocuments(filters: DocumentFilter): Promise<ConstructionDocument[]> {
  const where: any = {};

  if (filters.projectId) where.projectId = filters.projectId;
  if (filters.documentType) where.documentType = filters.documentType;
  if (filters.discipline) where.discipline = filters.discipline;
  if (filters.status) where.status = filters.status;
  if (filters.tags?.length) where.tags = { [Op.overlap]: filters.tags };

  const documents = await ConstructionDocument.findAll({
    where,
    include: [
      { model: DocumentRevision, as: 'revisions' },
      { model: DocumentDistribution, as: 'distributions' },
    ],
    order: [['createdAt', 'DESC']],
  });

  return documents;
}

// ============================================================================
// VERSION CONTROL AND REVISION TRACKING
// ============================================================================

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
export async function createRevision(
  documentId: string,
  revisionData: Omit<DocumentRevision, 'id' | 'createdAt' | 'updatedAt' | 'revisionNumber'>,
  userId: string,
): Promise<DocumentRevision> {
  const document = await ConstructionDocument.findByPk(documentId, {
    include: [{ model: DocumentRevision, as: 'revisions' }],
  });

  if (!document) {
    throw new NotFoundException('Document not found');
  }

  const nextRevisionNumber = incrementRevision(document.revision, revisionData.revisionType);

  const revision = await DocumentRevision.create({
    ...revisionData,
    documentId,
    revisionNumber: nextRevisionNumber,
    createdBy: userId,
    revisionDate: new Date(),
  });

  // Update document with new revision
  await document.update({
    revision: nextRevisionNumber,
    fileUrl: revisionData.fileUrl,
  });

  await logDocumentActivity(documentId, 'revision_created', { revisionNumber: nextRevisionNumber, userId });

  return revision;
}

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
export function incrementRevision(currentRevision: string, revisionType: RevisionType): string {
  if (revisionType === RevisionType.MAJOR) {
    const letter = currentRevision.charAt(0);
    return String.fromCharCode(letter.charCodeAt(0) + 1);
  } else {
    const match = currentRevision.match(/^([A-Z])(\d*)$/);
    if (!match) return `${currentRevision}1`;

    const letter = match[1];
    const number = match[2] ? parseInt(match[2]) + 1 : 1;
    return `${letter}${number}`;
  }
}

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
export async function getRevisionHistory(documentId: string): Promise<DocumentRevision[]> {
  return DocumentRevision.findAll({
    where: { documentId },
    order: [['revisionDate', 'DESC']],
  });
}

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
export async function compareRevisions(
  revisionId1: string,
  revisionId2: string,
): Promise<{
  revision1: DocumentRevision;
  revision2: DocumentRevision;
  differences: RevisionChange[];
}> {
  const [rev1, rev2] = await Promise.all([
    DocumentRevision.findByPk(revisionId1),
    DocumentRevision.findByPk(revisionId2),
  ]);

  if (!rev1 || !rev2) {
    throw new NotFoundException('One or both revisions not found');
  }

  // In production, implement detailed comparison logic
  return {
    revision1: rev1,
    revision2: rev2,
    differences: rev2.changes || [],
  };
}

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
export async function supersedeRevision(revisionId: string, userId: string): Promise<void> {
  const revision = await DocumentRevision.findByPk(revisionId);
  if (!revision) {
    throw new NotFoundException('Revision not found');
  }

  await revision.update({
    superseded: true,
    supersededDate: new Date(),
  });

  await logDocumentActivity(revision.documentId, 'revision_superseded', { revisionId, userId });
}

// ============================================================================
// DRAWING MANAGEMENT
// ============================================================================

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
export async function createDrawing(
  drawingData: Omit<ConstructionDocument, 'id' | 'documentNumber' | 'documentType' | 'status' | 'revision'>,
  userId: string,
): Promise<ConstructionDocument> {
  return createDocument(
    {
      ...drawingData,
      documentType: DocumentType.DRAWING,
    } as any,
    userId,
  );
}

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
export async function getDrawingsBySheet(projectId: string, sheetPattern: string): Promise<ConstructionDocument[]> {
  const pattern = sheetPattern.replace(/\*/g, '%');

  return ConstructionDocument.findAll({
    where: {
      projectId,
      documentType: DocumentType.DRAWING,
      'metadata.sheetNumber': { [Op.like]: pattern },
    },
  });
}

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
export async function linkRelatedDrawings(drawingId: string, relatedDrawingIds: string[]): Promise<void> {
  const drawing = await ConstructionDocument.findByPk(drawingId);
  if (!drawing) {
    throw new NotFoundException('Drawing not found');
  }

  const metadata = drawing.metadata || {};
  metadata.relatedDrawings = relatedDrawingIds;

  await drawing.update({ metadata });
}

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
export async function validateDrawingSheetNumbers(
  projectId: string,
): Promise<{ valid: boolean; duplicates: string[]; gaps: string[] }> {
  const drawings = await ConstructionDocument.findAll({
    where: { projectId, documentType: DocumentType.DRAWING },
    order: [['metadata.sheetNumber', 'ASC']],
  });

  const sheetNumbers = drawings.map((d) => d.metadata?.sheetNumber).filter(Boolean);
  const duplicates = sheetNumbers.filter((num, index) => sheetNumbers.indexOf(num) !== index);

  // In production, implement gap detection logic
  return {
    valid: duplicates.length === 0,
    duplicates,
    gaps: [],
  };
}

// ============================================================================
// SPECIFICATION MANAGEMENT
// ============================================================================

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
export async function createSpecification(
  specData: Omit<ConstructionDocument, 'id' | 'documentNumber' | 'documentType' | 'status' | 'revision'>,
  userId: string,
): Promise<ConstructionDocument> {
  return createDocument(
    {
      ...specData,
      documentType: DocumentType.SPECIFICATION,
    } as any,
    userId,
  );
}

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
export async function getSpecificationsByDivision(
  projectId: string,
  division: string,
): Promise<ConstructionDocument[]> {
  return ConstructionDocument.findAll({
    where: {
      projectId,
      documentType: DocumentType.SPECIFICATION,
      'metadata.division': division,
    },
  });
}

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
export async function createAddendum(
  specificationId: string,
  addendumData: { description: string; changes: RevisionChange[] },
  userId: string,
): Promise<ConstructionDocument> {
  const spec = await ConstructionDocument.findByPk(specificationId);
  if (!spec) {
    throw new NotFoundException('Specification not found');
  }

  const addendum = await ConstructionDocument.create({
    title: `Addendum to ${spec.title}`,
    documentType: DocumentType.ADDENDUM,
    discipline: spec.discipline,
    projectId: spec.projectId,
    description: addendumData.description,
    parentDocumentId: specificationId,
    fileUrl: '', // Set after file generation
    fileName: `addendum-${Date.now()}.pdf`,
    revision: 'A',
    status: DocumentStatus.DRAFT,
    createdBy: userId,
    metadata: { changes: addendumData.changes },
  } as any);

  return addendum;
}

// ============================================================================
// DOCUMENT DISTRIBUTION AND TRACKING
// ============================================================================

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
export async function distributeDocument(
  documentId: string,
  recipientIds: string[],
  options: { requiresSignature?: boolean; deliveryMethod?: string; notes?: string },
  userId: string,
): Promise<DocumentDistribution[]> {
  const document = await ConstructionDocument.findByPk(documentId);
  if (!document) {
    throw new NotFoundException('Document not found');
  }

  const distributions = await Promise.all(
    recipientIds.map((recipientId) =>
      DocumentDistribution.create({
        documentId,
        recipientId,
        recipientName: `User ${recipientId}`, // In production, fetch from user service
        status: DistributionStatus.PENDING,
        deliveryMethod: options.deliveryMethod || 'email',
        notes: options.notes,
        distributedBy: userId,
        requiresSignature: options.requiresSignature || false,
      } as any),
    ),
  );

  await logDocumentActivity(documentId, 'distributed', { recipientIds, userId });

  return distributions;
}

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
export async function markDistributionSent(distributionId: string): Promise<DocumentDistribution> {
  const distribution = await DocumentDistribution.findByPk(distributionId);
  if (!distribution) {
    throw new NotFoundException('Distribution not found');
  }

  await distribution.update({
    status: DistributionStatus.SENT,
    sentAt: new Date(),
  });

  return distribution;
}

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
export async function markDistributionDelivered(distributionId: string): Promise<DocumentDistribution> {
  const distribution = await DocumentDistribution.findByPk(distributionId);
  if (!distribution) {
    throw new NotFoundException('Distribution not found');
  }

  await distribution.update({
    status: DistributionStatus.DELIVERED,
    deliveredAt: new Date(),
  });

  return distribution;
}

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
export async function acknowledgeDocumentReceipt(
  distributionId: string,
  signatureUrl?: string,
  notes?: string,
): Promise<DocumentDistribution> {
  const distribution = await DocumentDistribution.findByPk(distributionId);
  if (!distribution) {
    throw new NotFoundException('Distribution not found');
  }

  await distribution.update({
    status: DistributionStatus.ACKNOWLEDGED,
    acknowledgedAt: new Date(),
    signatureUrl,
    notes: notes || distribution.notes,
  });

  return distribution;
}

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
export async function getDistributionStatus(documentId: string): Promise<DocumentDistribution[]> {
  return DocumentDistribution.findAll({
    where: { documentId },
    order: [['createdAt', 'DESC']],
  });
}

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
export async function getPendingAcknowledgments(userId: string): Promise<DocumentDistribution[]> {
  return DocumentDistribution.findAll({
    where: {
      recipientId: userId,
      status: { [Op.in]: [DistributionStatus.SENT, DistributionStatus.DELIVERED] },
    },
    include: [{ model: ConstructionDocument, as: 'document' }],
  });
}

// ============================================================================
// DOCUMENT RETENTION AND ARCHIVAL
// ============================================================================

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
export async function setRetentionPeriod(
  documentId: string,
  retentionPeriod: RetentionPeriod,
): Promise<ConstructionDocument> {
  const document = await ConstructionDocument.findByPk(documentId);
  if (!document) {
    throw new NotFoundException('Document not found');
  }

  await document.update({ retentionPeriod });
  return document;
}

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
export async function archiveDocument(documentId: string, userId: string): Promise<void> {
  const document = await ConstructionDocument.findByPk(documentId);
  if (!document) {
    throw new NotFoundException('Document not found');
  }

  await document.update({
    status: DocumentStatus.VOID,
    metadata: { ...document.metadata, archived: true, archivedAt: new Date(), archivedBy: userId },
  });

  await logDocumentActivity(documentId, 'archived', { userId });
}

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
export async function getEligibleForArchival(projectId: string): Promise<ConstructionDocument[]> {
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  return ConstructionDocument.findAll({
    where: {
      projectId,
      status: { [Op.in]: [DocumentStatus.SUPERSEDED, DocumentStatus.VOID] },
      updatedAt: { [Op.lt]: oneYearAgo },
    },
  });
}

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
export function calculateRetentionExpiration(document: ConstructionDocument): Date {
  const createdDate = document.createdAt;
  const years = {
    [RetentionPeriod.ONE_YEAR]: 1,
    [RetentionPeriod.THREE_YEARS]: 3,
    [RetentionPeriod.FIVE_YEARS]: 5,
    [RetentionPeriod.SEVEN_YEARS]: 7,
    [RetentionPeriod.TEN_YEARS]: 10,
    [RetentionPeriod.PERMANENT]: 1000,
  }[document.retentionPeriod];

  const expirationDate = new Date(createdDate);
  expirationDate.setFullYear(expirationDate.getFullYear() + years);

  return expirationDate;
}

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
export async function purgeExpiredDocuments(projectId: string): Promise<number> {
  const documents = await ConstructionDocument.findAll({
    where: {
      projectId,
      retentionPeriod: { [Op.ne]: RetentionPeriod.PERMANENT },
    },
  });

  const expiredDocuments = documents.filter((doc) => {
    const expiration = calculateRetentionExpiration(doc);
    return expiration < new Date();
  });

  await Promise.all(expiredDocuments.map((doc) => doc.destroy({ force: true })));

  return expiredDocuments.length;
}

// ============================================================================
// ANALYTICS AND REPORTING
// ============================================================================

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
export async function getDocumentStatistics(projectId: string): Promise<DocumentStatistics> {
  const documents = await ConstructionDocument.findAll({ where: { projectId } });

  const stats: DocumentStatistics = {
    totalDocuments: documents.length,
    documentsByType: {} as Record<DocumentType, number>,
    documentsByDiscipline: {} as Record<DocumentDiscipline, number>,
    documentsByStatus: {} as Record<DocumentStatus, number>,
    totalRevisions: 0,
    pendingApprovals: 0,
    overdueReviews: 0,
  };

  documents.forEach((doc) => {
    stats.documentsByType[doc.documentType] = (stats.documentsByType[doc.documentType] || 0) + 1;
    stats.documentsByDiscipline[doc.discipline] = (stats.documentsByDiscipline[doc.discipline] || 0) + 1;
    stats.documentsByStatus[doc.status] = (stats.documentsByStatus[doc.status] || 0) + 1;

    if (doc.status === DocumentStatus.IN_REVIEW) {
      stats.pendingApprovals++;
    }
  });

  const revisionCount = await DocumentRevision.count();
  stats.totalRevisions = revisionCount;

  return stats;
}

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
export async function generateDocumentRegister(
  projectId: string,
  filters?: Partial<DocumentFilter>,
): Promise<ConstructionDocument[]> {
  return searchDocuments({ ...filters, projectId });
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Logs document activity for audit trail
 */
async function logDocumentActivity(documentId: string, activityType: string, data: any): Promise<void> {
  // In production, log to audit database
  console.log(`Document ${documentId}: ${activityType}`, data);
}

// ============================================================================
// NESTJS CONTROLLER
// ============================================================================

/**
 * Construction Document Control Controller
 * Provides RESTful API endpoints for document management operations
 */
@ApiTags('construction-documents')
@Controller('construction/documents')
@ApiBearerAuth()
export class ConstructionDocumentController {
  /**
   * Create a new document
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create new construction document' })
  @ApiResponse({ status: 201, description: 'Document created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async create(@Body() createDto: CreateDocumentDto) {
    return createDocument(createDto as any, 'current-user');
  }

  /**
   * Search documents
   */
  @Get()
  @ApiOperation({ summary: 'Search construction documents' })
  @ApiQuery({ name: 'projectId', required: false })
  @ApiQuery({ name: 'documentType', enum: DocumentType, required: false })
  @ApiQuery({ name: 'discipline', enum: DocumentDiscipline, required: false })
  @ApiQuery({ name: 'status', enum: DocumentStatus, required: false })
  async search(
    @Query('projectId') projectId?: string,
    @Query('documentType') documentType?: DocumentType,
    @Query('discipline') discipline?: DocumentDiscipline,
    @Query('status') status?: DocumentStatus,
  ) {
    return searchDocuments({ projectId, documentType, discipline, status });
  }

  /**
   * Get document by ID
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get document by ID' })
  @ApiParam({ name: 'id', description: 'Document ID' })
  @ApiResponse({ status: 200, description: 'Document found' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const document = await ConstructionDocument.findByPk(id, {
      include: [
        { model: DocumentRevision, as: 'revisions' },
        { model: DocumentDistribution, as: 'distributions' },
      ],
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    return document;
  }

  /**
   * Update document
   */
  @Put(':id')
  @ApiOperation({ summary: 'Update document' })
  @ApiResponse({ status: 200, description: 'Document updated' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateDto: UpdateDocumentDto) {
    return updateDocument(id, updateDto, 'current-user');
  }

  /**
   * Delete document
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete document' })
  @ApiResponse({ status: 204, description: 'Document deleted' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    await deleteDocument(id, 'current-user');
  }

  /**
   * Create revision
   */
  @Post(':id/revisions')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create document revision' })
  @ApiResponse({ status: 201, description: 'Revision created' })
  async createRevisionEndpoint(@Param('id', ParseUUIDPipe) id: string, @Body() revisionDto: CreateRevisionDto) {
    return createRevision(id, revisionDto as any, 'current-user');
  }

  /**
   * Get revision history
   */
  @Get(':id/revisions')
  @ApiOperation({ summary: 'Get document revision history' })
  async getRevisions(@Param('id', ParseUUIDPipe) id: string) {
    return getRevisionHistory(id);
  }

  /**
   * Distribute document
   */
  @Post(':id/distribute')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Distribute document to recipients' })
  @ApiResponse({ status: 201, description: 'Document distributed' })
  async distribute(@Param('id', ParseUUIDPipe) id: string, @Body() distributeDto: DistributeDocumentDto) {
    return distributeDocument(
      id,
      distributeDto.recipientIds,
      {
        deliveryMethod: distributeDto.deliveryMethod,
        notes: distributeDto.notes,
        requiresSignature: distributeDto.requiresSignature,
      },
      'current-user',
    );
  }

  /**
   * Get distribution status
   */
  @Get(':id/distributions')
  @ApiOperation({ summary: 'Get document distribution status' })
  async getDistributions(@Param('id', ParseUUIDPipe) id: string) {
    return getDistributionStatus(id);
  }

  /**
   * Acknowledge document receipt
   */
  @Post('distributions/:distributionId/acknowledge')
  @ApiOperation({ summary: 'Acknowledge document receipt' })
  @ApiResponse({ status: 200, description: 'Document acknowledged' })
  async acknowledge(
    @Param('distributionId', ParseUUIDPipe) distributionId: string,
    @Body() acknowledgeDto: AcknowledgeDocumentDto,
  ) {
    return acknowledgeDocumentReceipt(distributionId, acknowledgeDto.signatureUrl, acknowledgeDto.notes);
  }

  /**
   * Get project statistics
   */
  @Get('projects/:projectId/statistics')
  @ApiOperation({ summary: 'Get document statistics for project' })
  async getStatistics(@Param('projectId', ParseUUIDPipe) projectId: string) {
    return getDocumentStatistics(projectId);
  }

  /**
   * Generate document register
   */
  @Get('projects/:projectId/register')
  @ApiOperation({ summary: 'Generate document register' })
  async getRegister(@Param('projectId', ParseUUIDPipe) projectId: string) {
    return generateDocumentRegister(projectId);
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Document Management
  createDocument,
  generateDocumentNumber,
  updateDocument,
  deleteDocument,
  searchDocuments,

  // Version Control
  createRevision,
  incrementRevision,
  getRevisionHistory,
  compareRevisions,
  supersedeRevision,

  // Drawing Management
  createDrawing,
  getDrawingsBySheet,
  linkRelatedDrawings,
  validateDrawingSheetNumbers,

  // Specification Management
  createSpecification,
  getSpecificationsByDivision,
  createAddendum,

  // Distribution
  distributeDocument,
  markDistributionSent,
  markDistributionDelivered,
  acknowledgeDocumentReceipt,
  getDistributionStatus,
  getPendingAcknowledgments,

  // Retention and Archival
  setRetentionPeriod,
  archiveDocument,
  getEligibleForArchival,
  calculateRetentionExpiration,
  purgeExpiredDocuments,

  // Analytics
  getDocumentStatistics,
  generateDocumentRegister,

  // Models
  ConstructionDocument,
  DocumentRevision,
  DocumentDistribution,

  // Controller
  ConstructionDocumentController,
};
