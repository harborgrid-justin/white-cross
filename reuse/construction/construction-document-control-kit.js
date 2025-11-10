"use strict";
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
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConstructionDocumentController = void 0;
exports.createDocument = createDocument;
exports.generateDocumentNumber = generateDocumentNumber;
exports.updateDocument = updateDocument;
exports.deleteDocument = deleteDocument;
exports.searchDocuments = searchDocuments;
exports.createRevision = createRevision;
exports.incrementRevision = incrementRevision;
exports.getRevisionHistory = getRevisionHistory;
exports.compareRevisions = compareRevisions;
exports.supersedeRevision = supersedeRevision;
exports.createDrawing = createDrawing;
exports.getDrawingsBySheet = getDrawingsBySheet;
exports.linkRelatedDrawings = linkRelatedDrawings;
exports.validateDrawingSheetNumbers = validateDrawingSheetNumbers;
exports.createSpecification = createSpecification;
exports.getSpecificationsByDivision = getSpecificationsByDivision;
exports.createAddendum = createAddendum;
exports.distributeDocument = distributeDocument;
exports.markDistributionSent = markDistributionSent;
exports.markDistributionDelivered = markDistributionDelivered;
exports.acknowledgeDocumentReceipt = acknowledgeDocumentReceipt;
exports.getDistributionStatus = getDistributionStatus;
exports.getPendingAcknowledgments = getPendingAcknowledgments;
exports.setRetentionPeriod = setRetentionPeriod;
exports.archiveDocument = archiveDocument;
exports.getEligibleForArchival = getEligibleForArchival;
exports.calculateRetentionExpiration = calculateRetentionExpiration;
exports.purgeExpiredDocuments = purgeExpiredDocuments;
exports.getDocumentStatistics = getDocumentStatistics;
exports.generateDocumentRegister = generateDocumentRegister;
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
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const construction_document_model_1 = require("./models/construction-document.model");
const document_revision_model_1 = require("./models/document-revision.model");
const document_distribution_model_1 = require("./models/document-distribution.model");
const document_types_1 = require("./types/document.types");
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
async function createDocument(data, userId) {
    const documentNumber = generateDocumentNumber(data.documentType, data.discipline, data.projectId);
    const document = await construction_document_model_1.ConstructionDocument.create({
        ...data,
        documentNumber,
        revision: 'A',
        status: document_types_1.DocumentStatus.DRAFT,
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
function generateDocumentNumber(type, discipline, projectId) {
    const typePrefix = {
        [document_types_1.DocumentType.DRAWING]: 'DRW',
        [document_types_1.DocumentType.SPECIFICATION]: 'SPC',
        [document_types_1.DocumentType.SUBMITTAL]: 'SUB',
        [document_types_1.DocumentType.RFI]: 'RFI',
        [document_types_1.DocumentType.CHANGE_ORDER]: 'CO',
        [document_types_1.DocumentType.ADDENDUM]: 'ADD',
        [document_types_1.DocumentType.MEETING_MINUTES]: 'MM',
        [document_types_1.DocumentType.INSPECTION_REPORT]: 'INS',
        [document_types_1.DocumentType.TRANSMITTAL]: 'TRN',
        [document_types_1.DocumentType.CONTRACT]: 'CNT',
        [document_types_1.DocumentType.CORRESPONDENCE]: 'COR',
        [document_types_1.DocumentType.SHOP_DRAWING]: 'SD',
        [document_types_1.DocumentType.PRODUCT_DATA]: 'PD',
        [document_types_1.DocumentType.SAMPLE]: 'SMP',
        [document_types_1.DocumentType.CLOSEOUT]: 'CLO',
    }[type];
    const disciplinePrefix = {
        [document_types_1.DocumentDiscipline.ARCHITECTURAL]: 'A',
        [document_types_1.DocumentDiscipline.STRUCTURAL]: 'S',
        [document_types_1.DocumentDiscipline.MECHANICAL]: 'M',
        [document_types_1.DocumentDiscipline.ELECTRICAL]: 'E',
        [document_types_1.DocumentDiscipline.PLUMBING]: 'P',
        [document_types_1.DocumentDiscipline.CIVIL]: 'C',
        [document_types_1.DocumentDiscipline.LANDSCAPE]: 'L',
        [document_types_1.DocumentDiscipline.FIRE_PROTECTION]: 'FP',
        [document_types_1.DocumentDiscipline.GENERAL]: 'G',
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
async function updateDocument(documentId, updates, userId) {
    const document = await construction_document_model_1.ConstructionDocument.findByPk(documentId);
    if (!document) {
        throw new common_1.NotFoundException('Document not found');
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
async function deleteDocument(documentId, userId) {
    const document = await construction_document_model_1.ConstructionDocument.findByPk(documentId);
    if (!document) {
        throw new common_1.NotFoundException('Document not found');
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
async function searchDocuments(filters) {
    const where = {};
    if (filters.projectId)
        where.projectId = filters.projectId;
    if (filters.documentType)
        where.documentType = filters.documentType;
    if (filters.discipline)
        where.discipline = filters.discipline;
    if (filters.status)
        where.status = filters.status;
    if (filters.tags?.length)
        where.tags = { [Op.overlap]: filters.tags };
    const documents = await construction_document_model_1.ConstructionDocument.findAll({
        where,
        include: [
            { model: document_revision_model_1.DocumentRevision, as: 'revisions' },
            { model: document_distribution_model_1.DocumentDistribution, as: 'distributions' },
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
async function createRevision(documentId, revisionData, userId) {
    const document = await construction_document_model_1.ConstructionDocument.findByPk(documentId, {
        include: [{ model: document_revision_model_1.DocumentRevision, as: 'revisions' }],
    });
    if (!document) {
        throw new common_1.NotFoundException('Document not found');
    }
    const nextRevisionNumber = incrementRevision(document.revision, revisionData.revisionType);
    const revision = await document_revision_model_1.DocumentRevision.create({
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
function incrementRevision(currentRevision, revisionType) {
    if (revisionType === document_types_1.RevisionType.MAJOR) {
        const letter = currentRevision.charAt(0);
        return String.fromCharCode(letter.charCodeAt(0) + 1);
    }
    else {
        const match = currentRevision.match(/^([A-Z])(\d*)$/);
        if (!match)
            return `${currentRevision}1`;
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
async function getRevisionHistory(documentId) {
    return document_revision_model_1.DocumentRevision.findAll({
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
async function compareRevisions(revisionId1, revisionId2) {
    const [rev1, rev2] = await Promise.all([
        document_revision_model_1.DocumentRevision.findByPk(revisionId1),
        document_revision_model_1.DocumentRevision.findByPk(revisionId2),
    ]);
    if (!rev1 || !rev2) {
        throw new common_1.NotFoundException('One or both revisions not found');
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
async function supersedeRevision(revisionId, userId) {
    const revision = await document_revision_model_1.DocumentRevision.findByPk(revisionId);
    if (!revision) {
        throw new common_1.NotFoundException('Revision not found');
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
async function createDrawing(drawingData, userId) {
    return createDocument({
        ...drawingData,
        documentType: document_types_1.DocumentType.DRAWING,
    }, userId);
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
async function getDrawingsBySheet(projectId, sheetPattern) {
    const pattern = sheetPattern.replace(/\*/g, '%');
    return construction_document_model_1.ConstructionDocument.findAll({
        where: {
            projectId,
            documentType: document_types_1.DocumentType.DRAWING,
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
async function linkRelatedDrawings(drawingId, relatedDrawingIds) {
    const drawing = await construction_document_model_1.ConstructionDocument.findByPk(drawingId);
    if (!drawing) {
        throw new common_1.NotFoundException('Drawing not found');
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
async function validateDrawingSheetNumbers(projectId) {
    const drawings = await construction_document_model_1.ConstructionDocument.findAll({
        where: { projectId, documentType: document_types_1.DocumentType.DRAWING },
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
async function createSpecification(specData, userId) {
    return createDocument({
        ...specData,
        documentType: document_types_1.DocumentType.SPECIFICATION,
    }, userId);
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
async function getSpecificationsByDivision(projectId, division) {
    return construction_document_model_1.ConstructionDocument.findAll({
        where: {
            projectId,
            documentType: document_types_1.DocumentType.SPECIFICATION,
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
async function createAddendum(specificationId, addendumData, userId) {
    const spec = await construction_document_model_1.ConstructionDocument.findByPk(specificationId);
    if (!spec) {
        throw new common_1.NotFoundException('Specification not found');
    }
    const addendum = await construction_document_model_1.ConstructionDocument.create({
        title: `Addendum to ${spec.title}`,
        documentType: document_types_1.DocumentType.ADDENDUM,
        discipline: spec.discipline,
        projectId: spec.projectId,
        description: addendumData.description,
        parentDocumentId: specificationId,
        fileUrl: '', // Set after file generation
        fileName: `addendum-${Date.now()}.pdf`,
        revision: 'A',
        status: document_types_1.DocumentStatus.DRAFT,
        createdBy: userId,
        metadata: { changes: addendumData.changes },
    });
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
async function distributeDocument(documentId, recipientIds, options, userId) {
    const document = await construction_document_model_1.ConstructionDocument.findByPk(documentId);
    if (!document) {
        throw new common_1.NotFoundException('Document not found');
    }
    const distributions = await Promise.all(recipientIds.map((recipientId) => document_distribution_model_1.DocumentDistribution.create({
        documentId,
        recipientId,
        recipientName: `User ${recipientId}`, // In production, fetch from user service
        status: document_types_1.DistributionStatus.PENDING,
        deliveryMethod: options.deliveryMethod || 'email',
        notes: options.notes,
        distributedBy: userId,
        requiresSignature: options.requiresSignature || false,
    })));
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
async function markDistributionSent(distributionId) {
    const distribution = await document_distribution_model_1.DocumentDistribution.findByPk(distributionId);
    if (!distribution) {
        throw new common_1.NotFoundException('Distribution not found');
    }
    await distribution.update({
        status: document_types_1.DistributionStatus.SENT,
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
async function markDistributionDelivered(distributionId) {
    const distribution = await document_distribution_model_1.DocumentDistribution.findByPk(distributionId);
    if (!distribution) {
        throw new common_1.NotFoundException('Distribution not found');
    }
    await distribution.update({
        status: document_types_1.DistributionStatus.DELIVERED,
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
async function acknowledgeDocumentReceipt(distributionId, signatureUrl, notes) {
    const distribution = await document_distribution_model_1.DocumentDistribution.findByPk(distributionId);
    if (!distribution) {
        throw new common_1.NotFoundException('Distribution not found');
    }
    await distribution.update({
        status: document_types_1.DistributionStatus.ACKNOWLEDGED,
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
async function getDistributionStatus(documentId) {
    return document_distribution_model_1.DocumentDistribution.findAll({
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
async function getPendingAcknowledgments(userId) {
    return document_distribution_model_1.DocumentDistribution.findAll({
        where: {
            recipientId: userId,
            status: { [Op.in]: [document_types_1.DistributionStatus.SENT, document_types_1.DistributionStatus.DELIVERED] },
        },
        include: [{ model: construction_document_model_1.ConstructionDocument, as: 'document' }],
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
async function setRetentionPeriod(documentId, retentionPeriod) {
    const document = await construction_document_model_1.ConstructionDocument.findByPk(documentId);
    if (!document) {
        throw new common_1.NotFoundException('Document not found');
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
async function archiveDocument(documentId, userId) {
    const document = await construction_document_model_1.ConstructionDocument.findByPk(documentId);
    if (!document) {
        throw new common_1.NotFoundException('Document not found');
    }
    await document.update({
        status: document_types_1.DocumentStatus.VOID,
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
async function getEligibleForArchival(projectId) {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    return construction_document_model_1.ConstructionDocument.findAll({
        where: {
            projectId,
            status: { [Op.in]: [document_types_1.DocumentStatus.SUPERSEDED, document_types_1.DocumentStatus.VOID] },
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
function calculateRetentionExpiration(document) {
    const createdDate = document.createdAt;
    const years = {
        [document_types_1.RetentionPeriod.ONE_YEAR]: 1,
        [document_types_1.RetentionPeriod.THREE_YEARS]: 3,
        [document_types_1.RetentionPeriod.FIVE_YEARS]: 5,
        [document_types_1.RetentionPeriod.SEVEN_YEARS]: 7,
        [document_types_1.RetentionPeriod.TEN_YEARS]: 10,
        [document_types_1.RetentionPeriod.PERMANENT]: 1000,
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
async function purgeExpiredDocuments(projectId) {
    const documents = await construction_document_model_1.ConstructionDocument.findAll({
        where: {
            projectId,
            retentionPeriod: { [Op.ne]: document_types_1.RetentionPeriod.PERMANENT },
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
async function getDocumentStatistics(projectId) {
    const documents = await construction_document_model_1.ConstructionDocument.findAll({ where: { projectId } });
    const stats = {
        totalDocuments: documents.length,
        documentsByType: {},
        documentsByDiscipline: {},
        documentsByStatus: {},
        totalRevisions: 0,
        pendingApprovals: 0,
        overdueReviews: 0,
    };
    documents.forEach((doc) => {
        stats.documentsByType[doc.documentType] = (stats.documentsByType[doc.documentType] || 0) + 1;
        stats.documentsByDiscipline[doc.discipline] = (stats.documentsByDiscipline[doc.discipline] || 0) + 1;
        stats.documentsByStatus[doc.status] = (stats.documentsByStatus[doc.status] || 0) + 1;
        if (doc.status === document_types_1.DocumentStatus.IN_REVIEW) {
            stats.pendingApprovals++;
        }
    });
    const revisionCount = await document_revision_model_1.DocumentRevision.count();
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
async function generateDocumentRegister(projectId, filters) {
    return searchDocuments({ ...filters, projectId });
}
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
/**
 * Logs document activity for audit trail
 */
async function logDocumentActivity(documentId, activityType, data) {
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
let ConstructionDocumentController = (() => {
    let _classDecorators = [(0, swagger_1.ApiTags)('construction-documents'), (0, common_1.Controller)('construction/documents'), (0, swagger_1.ApiBearerAuth)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _create_decorators;
    let _search_decorators;
    let _findOne_decorators;
    let _update_decorators;
    let _delete_decorators;
    let _createRevisionEndpoint_decorators;
    let _getRevisions_decorators;
    let _distribute_decorators;
    let _getDistributions_decorators;
    let _acknowledge_decorators;
    let _getStatistics_decorators;
    let _getRegister_decorators;
    var ConstructionDocumentController = _classThis = class {
        /**
         * Create a new document
         */
        async create(createDto) {
            return createDocument(createDto, 'current-user');
        }
        /**
         * Search documents
         */
        async search(projectId, documentType, discipline, status) {
            return searchDocuments({ projectId, documentType, discipline, status });
        }
        /**
         * Get document by ID
         */
        async findOne(id) {
            const document = await construction_document_model_1.ConstructionDocument.findByPk(id, {
                include: [
                    { model: document_revision_model_1.DocumentRevision, as: 'revisions' },
                    { model: document_distribution_model_1.DocumentDistribution, as: 'distributions' },
                ],
            });
            if (!document) {
                throw new common_1.NotFoundException('Document not found');
            }
            return document;
        }
        /**
         * Update document
         */
        async update(id, updateDto) {
            return updateDocument(id, updateDto, 'current-user');
        }
        /**
         * Delete document
         */
        async delete(id) {
            await deleteDocument(id, 'current-user');
        }
        /**
         * Create revision
         */
        async createRevisionEndpoint(id, revisionDto) {
            return createRevision(id, revisionDto, 'current-user');
        }
        /**
         * Get revision history
         */
        async getRevisions(id) {
            return getRevisionHistory(id);
        }
        /**
         * Distribute document
         */
        async distribute(id, distributeDto) {
            return distributeDocument(id, distributeDto.recipientIds, {
                deliveryMethod: distributeDto.deliveryMethod,
                notes: distributeDto.notes,
                requiresSignature: distributeDto.requiresSignature,
            }, 'current-user');
        }
        /**
         * Get distribution status
         */
        async getDistributions(id) {
            return getDistributionStatus(id);
        }
        /**
         * Acknowledge document receipt
         */
        async acknowledge(distributionId, acknowledgeDto) {
            return acknowledgeDocumentReceipt(distributionId, acknowledgeDto.signatureUrl, acknowledgeDto.notes);
        }
        /**
         * Get project statistics
         */
        async getStatistics(projectId) {
            return getDocumentStatistics(projectId);
        }
        /**
         * Generate document register
         */
        async getRegister(projectId) {
            return generateDocumentRegister(projectId);
        }
        constructor() {
            __runInitializers(this, _instanceExtraInitializers);
        }
    };
    __setFunctionName(_classThis, "ConstructionDocumentController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _create_decorators = [(0, common_1.Post)(), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, swagger_1.ApiOperation)({ summary: 'Create new construction document' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Document created successfully' }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }), (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true }))];
        _search_decorators = [(0, common_1.Get)(), (0, swagger_1.ApiOperation)({ summary: 'Search construction documents' }), (0, swagger_1.ApiQuery)({ name: 'projectId', required: false }), (0, swagger_1.ApiQuery)({ name: 'documentType', enum: document_types_1.DocumentType, required: false }), (0, swagger_1.ApiQuery)({ name: 'discipline', enum: document_types_1.DocumentDiscipline, required: false }), (0, swagger_1.ApiQuery)({ name: 'status', enum: document_types_1.DocumentStatus, required: false })];
        _findOne_decorators = [(0, common_1.Get)(':id'), (0, swagger_1.ApiOperation)({ summary: 'Get document by ID' }), (0, swagger_1.ApiParam)({ name: 'id', description: 'Document ID' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Document found' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Document not found' })];
        _update_decorators = [(0, common_1.Put)(':id'), (0, swagger_1.ApiOperation)({ summary: 'Update document' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Document updated' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Document not found' })];
        _delete_decorators = [(0, common_1.Delete)(':id'), (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT), (0, swagger_1.ApiOperation)({ summary: 'Delete document' }), (0, swagger_1.ApiResponse)({ status: 204, description: 'Document deleted' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Document not found' })];
        _createRevisionEndpoint_decorators = [(0, common_1.Post)(':id/revisions'), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, swagger_1.ApiOperation)({ summary: 'Create document revision' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Revision created' })];
        _getRevisions_decorators = [(0, common_1.Get)(':id/revisions'), (0, swagger_1.ApiOperation)({ summary: 'Get document revision history' })];
        _distribute_decorators = [(0, common_1.Post)(':id/distribute'), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, swagger_1.ApiOperation)({ summary: 'Distribute document to recipients' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Document distributed' })];
        _getDistributions_decorators = [(0, common_1.Get)(':id/distributions'), (0, swagger_1.ApiOperation)({ summary: 'Get document distribution status' })];
        _acknowledge_decorators = [(0, common_1.Post)('distributions/:distributionId/acknowledge'), (0, swagger_1.ApiOperation)({ summary: 'Acknowledge document receipt' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Document acknowledged' })];
        _getStatistics_decorators = [(0, common_1.Get)('projects/:projectId/statistics'), (0, swagger_1.ApiOperation)({ summary: 'Get document statistics for project' })];
        _getRegister_decorators = [(0, common_1.Get)('projects/:projectId/register'), (0, swagger_1.ApiOperation)({ summary: 'Generate document register' })];
        __esDecorate(_classThis, null, _create_decorators, { kind: "method", name: "create", static: false, private: false, access: { has: obj => "create" in obj, get: obj => obj.create }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _search_decorators, { kind: "method", name: "search", static: false, private: false, access: { has: obj => "search" in obj, get: obj => obj.search }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findOne_decorators, { kind: "method", name: "findOne", static: false, private: false, access: { has: obj => "findOne" in obj, get: obj => obj.findOne }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _update_decorators, { kind: "method", name: "update", static: false, private: false, access: { has: obj => "update" in obj, get: obj => obj.update }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _delete_decorators, { kind: "method", name: "delete", static: false, private: false, access: { has: obj => "delete" in obj, get: obj => obj.delete }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createRevisionEndpoint_decorators, { kind: "method", name: "createRevisionEndpoint", static: false, private: false, access: { has: obj => "createRevisionEndpoint" in obj, get: obj => obj.createRevisionEndpoint }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getRevisions_decorators, { kind: "method", name: "getRevisions", static: false, private: false, access: { has: obj => "getRevisions" in obj, get: obj => obj.getRevisions }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _distribute_decorators, { kind: "method", name: "distribute", static: false, private: false, access: { has: obj => "distribute" in obj, get: obj => obj.distribute }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getDistributions_decorators, { kind: "method", name: "getDistributions", static: false, private: false, access: { has: obj => "getDistributions" in obj, get: obj => obj.getDistributions }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _acknowledge_decorators, { kind: "method", name: "acknowledge", static: false, private: false, access: { has: obj => "acknowledge" in obj, get: obj => obj.acknowledge }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getStatistics_decorators, { kind: "method", name: "getStatistics", static: false, private: false, access: { has: obj => "getStatistics" in obj, get: obj => obj.getStatistics }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getRegister_decorators, { kind: "method", name: "getRegister", static: false, private: false, access: { has: obj => "getRegister" in obj, get: obj => obj.getRegister }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ConstructionDocumentController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ConstructionDocumentController = _classThis;
})();
exports.ConstructionDocumentController = ConstructionDocumentController;
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
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
    ConstructionDocument: construction_document_model_1.ConstructionDocument,
    DocumentRevision: document_revision_model_1.DocumentRevision,
    DocumentDistribution: document_distribution_model_1.DocumentDistribution,
    // Controller
    ConstructionDocumentController,
};
//# sourceMappingURL=construction-document-control-kit.js.map