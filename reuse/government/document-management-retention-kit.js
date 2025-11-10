"use strict";
/**
 * LOC: DOCUMENT_MANAGEMENT_RETENTION_KIT_001
 * File: /reuse/government/document-management-retention-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - crypto (Node.js built-in)
 *   - class-validator
 *
 * DOWNSTREAM (imported by):
 *   - Government records management services
 *   - Document lifecycle systems
 *   - Electronic records management platforms
 *   - Compliance and audit systems
 *   - Legal hold management services
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.RetentionPolicyReportResponse = exports.CreateLegalHoldDto = exports.CreateRetentionScheduleDto = exports.CreateDocumentRecordDto = exports.DocumentManagementServiceExample = exports.LegalHoldModel = exports.DocumentLifecycleModel = exports.RetentionScheduleModel = exports.DocumentRecordModel = exports.DisposalStatus = exports.ComplianceStatus = exports.VersionAction = exports.LegalHoldStatus = exports.LifecycleStage = exports.DisposalMethod = exports.RetentionScheduleType = exports.DocumentType = exports.DocumentStatus = exports.DocumentClassification = void 0;
exports.createDocumentRecord = createDocumentRecord;
exports.generateDocumentNumber = generateDocumentNumber;
exports.classifyDocument = classifyDocument;
exports.updateDocumentClassification = updateDocumentClassification;
exports.validateClassificationLevel = validateClassificationLevel;
exports.createRetentionSchedule = createRetentionSchedule;
exports.calculateDisposalDate = calculateDisposalDate;
exports.getSchedulesRequiringReview = getSchedulesRequiringReview;
exports.updateRetentionSchedule = updateRetentionSchedule;
exports.applyRetentionSchedule = applyRetentionSchedule;
exports.createDocumentLifecycle = createDocumentLifecycle;
exports.advanceLifecycleStage = advanceLifecycleStage;
exports.getLifecycleDuration = getLifecycleDuration;
exports.getDocumentsEligibleForArchival = getDocumentsEligibleForArchival;
exports.trackLifecycleEvent = trackLifecycleEvent;
exports.createRetentionCompliance = createRetentionCompliance;
exports.auditRetentionCompliance = auditRetentionCompliance;
exports.addComplianceViolation = addComplianceViolation;
exports.createCorrectionAction = createCorrectionAction;
exports.verifyComplianceRemediation = verifyComplianceRemediation;
exports.createDisposalWorkflow = createDisposalWorkflow;
exports.approveDisposalWorkflow = approveDisposalWorkflow;
exports.scheduleDisposal = scheduleDisposal;
exports.executeDisposal = executeDisposal;
exports.generateCertificateOfDestruction = generateCertificateOfDestruction;
exports.validateDisposalEligibility = validateDisposalEligibility;
exports.createLegalHold = createLegalHold;
exports.applyLegalHold = applyLegalHold;
exports.releaseLegalHold = releaseLegalHold;
exports.addDocumentsToLegalHold = addDocumentsToLegalHold;
exports.getActiveLegalHolds = getActiveLegalHolds;
exports.createDocumentVersion = createDocumentVersion;
exports.calculateChecksum = calculateChecksum;
exports.getVersionHistory = getVersionHistory;
exports.restorePreviousVersion = restorePreviousVersion;
exports.compareVersions = compareVersions;
exports.updateDocumentMetadata = updateDocumentMetadata;
exports.addCustomMetadataField = addCustomMetadataField;
exports.validateMetadataCompleteness = validateMetadataCompleteness;
exports.extractMetadataFromFile = extractMetadataFromFile;
exports.searchDocuments = searchDocuments;
exports.retrieveDocumentByNumber = retrieveDocumentByNumber;
exports.getRelatedDocuments = getRelatedDocuments;
exports.buildSearchIndex = buildSearchIndex;
exports.createERMPolicy = createERMPolicy;
exports.validateAgainstERMPolicy = validateAgainstERMPolicy;
exports.calculateERMComplianceRate = calculateERMComplianceRate;
exports.createDocumentArchive = createDocumentArchive;
exports.archiveDocuments = archiveDocuments;
exports.retrieveArchivedDocuments = retrieveArchivedDocuments;
exports.enforceRetentionPolicy = enforceRetentionPolicy;
exports.generateRetentionPolicyReport = generateRetentionPolicyReport;
/**
 * File: /reuse/government/document-management-retention-kit.ts
 * Locator: WC-GOV-DOC-MGMT-RETENTION-001
 * Purpose: Comprehensive Document Management and Retention Toolkit for Government Operations
 *
 * Upstream: @nestjs/common, @nestjs/swagger, sequelize-typescript, crypto, class-validator
 * Downstream: Government records management, Document lifecycle, Legal hold systems
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10+, Sequelize 6+
 * Exports: 50+ government document management and retention functions
 *
 * LLM Context: Enterprise-grade document management and retention for government agencies.
 * Provides comprehensive document classification, retention schedule management, document lifecycle
 * tracking, records retention compliance, document disposal workflows, legal hold management,
 * document versioning, metadata management, document search and retrieval, electronic records
 * management, document archival, and retention policy enforcement with full Sequelize/NestJS/Swagger integration.
 */
const crypto = __importStar(require("crypto"));
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * Document classification levels
 */
var DocumentClassification;
(function (DocumentClassification) {
    DocumentClassification["UNCLASSIFIED"] = "UNCLASSIFIED";
    DocumentClassification["CONFIDENTIAL"] = "CONFIDENTIAL";
    DocumentClassification["SECRET"] = "SECRET";
    DocumentClassification["TOP_SECRET"] = "TOP_SECRET";
    DocumentClassification["SENSITIVE_BUT_UNCLASSIFIED"] = "SENSITIVE_BUT_UNCLASSIFIED";
    DocumentClassification["FOR_OFFICIAL_USE_ONLY"] = "FOR_OFFICIAL_USE_ONLY";
    DocumentClassification["LAW_ENFORCEMENT_SENSITIVE"] = "LAW_ENFORCEMENT_SENSITIVE";
    DocumentClassification["CONTROLLED_UNCLASSIFIED"] = "CONTROLLED_UNCLASSIFIED";
})(DocumentClassification || (exports.DocumentClassification = DocumentClassification = {}));
/**
 * Document status
 */
var DocumentStatus;
(function (DocumentStatus) {
    DocumentStatus["DRAFT"] = "DRAFT";
    DocumentStatus["ACTIVE"] = "ACTIVE";
    DocumentStatus["INACTIVE"] = "INACTIVE";
    DocumentStatus["ARCHIVED"] = "ARCHIVED";
    DocumentStatus["PENDING_DISPOSAL"] = "PENDING_DISPOSAL";
    DocumentStatus["DISPOSED"] = "DISPOSED";
    DocumentStatus["LEGAL_HOLD"] = "LEGAL_HOLD";
    DocumentStatus["UNDER_REVIEW"] = "UNDER_REVIEW";
})(DocumentStatus || (exports.DocumentStatus = DocumentStatus = {}));
/**
 * Document type categories
 */
var DocumentType;
(function (DocumentType) {
    DocumentType["POLICY"] = "POLICY";
    DocumentType["PROCEDURE"] = "PROCEDURE";
    DocumentType["REGULATION"] = "REGULATION";
    DocumentType["CONTRACT"] = "CONTRACT";
    DocumentType["CORRESPONDENCE"] = "CORRESPONDENCE";
    DocumentType["REPORT"] = "REPORT";
    DocumentType["FORM"] = "FORM";
    DocumentType["MEMO"] = "MEMO";
    DocumentType["MEETING_MINUTES"] = "MEETING_MINUTES";
    DocumentType["FINANCIAL_RECORD"] = "FINANCIAL_RECORD";
    DocumentType["PERSONNEL_FILE"] = "PERSONNEL_FILE";
    DocumentType["LEGAL_DOCUMENT"] = "LEGAL_DOCUMENT";
    DocumentType["TECHNICAL_DOCUMENT"] = "TECHNICAL_DOCUMENT";
})(DocumentType || (exports.DocumentType = DocumentType = {}));
/**
 * Retention schedule type
 */
var RetentionScheduleType;
(function (RetentionScheduleType) {
    RetentionScheduleType["PERMANENT"] = "PERMANENT";
    RetentionScheduleType["YEARS"] = "YEARS";
    RetentionScheduleType["EVENT_BASED"] = "EVENT_BASED";
    RetentionScheduleType["SUPERSEDED"] = "SUPERSEDED";
    RetentionScheduleType["UNTIL_OBSOLETE"] = "UNTIL_OBSOLETE";
})(RetentionScheduleType || (exports.RetentionScheduleType = RetentionScheduleType = {}));
/**
 * Disposal method
 */
var DisposalMethod;
(function (DisposalMethod) {
    DisposalMethod["SECURE_SHREDDING"] = "SECURE_SHREDDING";
    DisposalMethod["ELECTRONIC_DELETION"] = "ELECTRONIC_DELETION";
    DisposalMethod["DEGAUSSING"] = "DEGAUSSING";
    DisposalMethod["INCINERATION"] = "INCINERATION";
    DisposalMethod["TRANSFER_TO_ARCHIVES"] = "TRANSFER_TO_ARCHIVES";
    DisposalMethod["TRANSFER_TO_NARA"] = "TRANSFER_TO_NARA";
    DisposalMethod["RECYCLING"] = "RECYCLING";
})(DisposalMethod || (exports.DisposalMethod = DisposalMethod = {}));
/**
 * Document lifecycle stage
 */
var LifecycleStage;
(function (LifecycleStage) {
    LifecycleStage["CREATION"] = "CREATION";
    LifecycleStage["ACTIVE_USE"] = "ACTIVE_USE";
    LifecycleStage["INACTIVE_STORAGE"] = "INACTIVE_STORAGE";
    LifecycleStage["RETENTION_HOLD"] = "RETENTION_HOLD";
    LifecycleStage["ARCHIVAL"] = "ARCHIVAL";
    LifecycleStage["DISPOSAL"] = "DISPOSAL";
})(LifecycleStage || (exports.LifecycleStage = LifecycleStage = {}));
/**
 * Legal hold status
 */
var LegalHoldStatus;
(function (LegalHoldStatus) {
    LegalHoldStatus["ACTIVE"] = "ACTIVE";
    LegalHoldStatus["RELEASED"] = "RELEASED";
    LegalHoldStatus["PARTIAL_RELEASE"] = "PARTIAL_RELEASE";
    LegalHoldStatus["PENDING_REVIEW"] = "PENDING_REVIEW";
})(LegalHoldStatus || (exports.LegalHoldStatus = LegalHoldStatus = {}));
/**
 * Version control action
 */
var VersionAction;
(function (VersionAction) {
    VersionAction["CREATED"] = "CREATED";
    VersionAction["MODIFIED"] = "MODIFIED";
    VersionAction["APPROVED"] = "APPROVED";
    VersionAction["REJECTED"] = "REJECTED";
    VersionAction["ARCHIVED"] = "ARCHIVED";
    VersionAction["RESTORED"] = "RESTORED";
})(VersionAction || (exports.VersionAction = VersionAction = {}));
/**
 * Compliance status
 */
var ComplianceStatus;
(function (ComplianceStatus) {
    ComplianceStatus["COMPLIANT"] = "COMPLIANT";
    ComplianceStatus["NON_COMPLIANT"] = "NON_COMPLIANT";
    ComplianceStatus["UNDER_REVIEW"] = "UNDER_REVIEW";
    ComplianceStatus["REMEDIATION_IN_PROGRESS"] = "REMEDIATION_IN_PROGRESS";
    ComplianceStatus["WAIVED"] = "WAIVED";
})(ComplianceStatus || (exports.ComplianceStatus = ComplianceStatus = {}));
/**
 * Disposal status
 */
var DisposalStatus;
(function (DisposalStatus) {
    DisposalStatus["PENDING_REVIEW"] = "PENDING_REVIEW";
    DisposalStatus["PENDING_APPROVAL"] = "PENDING_APPROVAL";
    DisposalStatus["APPROVED"] = "APPROVED";
    DisposalStatus["REJECTED"] = "REJECTED";
    DisposalStatus["SCHEDULED"] = "SCHEDULED";
    DisposalStatus["IN_PROGRESS"] = "IN_PROGRESS";
    DisposalStatus["COMPLETED"] = "COMPLETED";
    DisposalStatus["CANCELLED"] = "CANCELLED";
})(DisposalStatus || (exports.DisposalStatus = DisposalStatus = {}));
// ============================================================================
// DOCUMENT CLASSIFICATION
// ============================================================================
/**
 * Creates a new document record
 */
function createDocumentRecord(params) {
    const documentNumber = generateDocumentNumber();
    return {
        id: crypto.randomUUID(),
        documentNumber,
        title: params.title,
        description: params.description,
        documentType: params.documentType,
        classification: params.classification,
        status: DocumentStatus.DRAFT,
        lifecycleStage: LifecycleStage.CREATION,
        createdBy: params.createdBy,
        createdDate: new Date(),
        departmentId: params.departmentId,
        agencyId: params.agencyId,
        retentionScheduleId: params.retentionScheduleId,
        metadata: params.metadata || {},
        tags: [],
        relatedDocuments: [],
    };
}
/**
 * Generates a unique document number
 */
function generateDocumentNumber() {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = crypto.randomBytes(3).toString('hex').toUpperCase();
    return `DOC-${timestamp}-${random}`;
}
/**
 * Classifies a document based on content analysis
 */
function classifyDocument(documentContent, keywords) {
    const contentLower = documentContent.toLowerCase();
    for (const [classification, classKeywords] of Object.entries(keywords)) {
        if (classKeywords.some(keyword => contentLower.includes(keyword.toLowerCase()))) {
            return classification;
        }
    }
    return DocumentClassification.UNCLASSIFIED;
}
/**
 * Updates document classification
 */
function updateDocumentClassification(document, newClassification, modifiedBy) {
    return {
        ...document,
        classification: newClassification,
        modifiedBy,
        modifiedDate: new Date(),
    };
}
/**
 * Validates document classification level
 */
function validateClassificationLevel(classification, userClearanceLevel) {
    const classificationHierarchy = [
        DocumentClassification.UNCLASSIFIED,
        DocumentClassification.FOR_OFFICIAL_USE_ONLY,
        DocumentClassification.SENSITIVE_BUT_UNCLASSIFIED,
        DocumentClassification.CONFIDENTIAL,
        DocumentClassification.SECRET,
        DocumentClassification.TOP_SECRET,
    ];
    const docLevel = classificationHierarchy.indexOf(classification);
    const userLevel = classificationHierarchy.indexOf(userClearanceLevel);
    return userLevel >= docLevel;
}
// ============================================================================
// RETENTION SCHEDULE MANAGEMENT
// ============================================================================
/**
 * Creates a retention schedule
 */
function createRetentionSchedule(params) {
    const reviewDate = new Date();
    reviewDate.setFullYear(reviewDate.getFullYear() + 3);
    return {
        id: crypto.randomUUID(),
        scheduleCode: params.scheduleCode,
        recordSeries: params.recordSeries,
        description: params.description,
        retentionType: params.retentionType,
        retentionPeriodYears: params.retentionPeriodYears,
        eventTrigger: params.eventTrigger,
        disposalMethod: params.disposalMethod,
        legalAuthority: params.legalAuthority,
        applicableDocumentTypes: params.applicableDocumentTypes,
        active: true,
        approvedBy: params.approvedBy,
        approvalDate: new Date(),
        reviewDate,
    };
}
/**
 * Calculates disposal eligibility date
 */
function calculateDisposalDate(schedule, documentCreationDate, eventDate) {
    if (schedule.retentionType === RetentionScheduleType.PERMANENT) {
        return null;
    }
    if (schedule.retentionType === RetentionScheduleType.YEARS && schedule.retentionPeriodYears) {
        const disposalDate = new Date(documentCreationDate);
        disposalDate.setFullYear(disposalDate.getFullYear() + schedule.retentionPeriodYears);
        return disposalDate;
    }
    if (schedule.retentionType === RetentionScheduleType.EVENT_BASED && eventDate && schedule.retentionPeriodYears) {
        const disposalDate = new Date(eventDate);
        disposalDate.setFullYear(disposalDate.getFullYear() + schedule.retentionPeriodYears);
        return disposalDate;
    }
    return null;
}
/**
 * Gets schedules requiring review
 */
function getSchedulesRequiringReview(schedules, currentDate = new Date()) {
    return schedules.filter(schedule => schedule.reviewDate <= currentDate && schedule.active);
}
/**
 * Updates retention schedule
 */
function updateRetentionSchedule(schedule, updates) {
    return {
        ...schedule,
        ...updates,
    };
}
/**
 * Applies retention schedule to document
 */
function applyRetentionSchedule(document, schedule) {
    if (!schedule.applicableDocumentTypes.includes(document.documentType)) {
        throw new Error('Schedule not applicable to document type');
    }
    return {
        ...document,
        retentionScheduleId: schedule.id,
    };
}
// ============================================================================
// DOCUMENT LIFECYCLE TRACKING
// ============================================================================
/**
 * Creates document lifecycle record
 */
function createDocumentLifecycle(documentId, retentionStartDate) {
    return {
        id: crypto.randomUUID(),
        documentId,
        currentStage: LifecycleStage.CREATION,
        stageHistory: [],
        retentionStartDate,
        legalHoldApplied: false,
    };
}
/**
 * Advances document to next lifecycle stage
 */
function advanceLifecycleStage(lifecycle, newStage, performedBy, reason) {
    const event = {
        eventId: crypto.randomUUID(),
        stage: newStage,
        eventDate: new Date(),
        performedBy,
        reason,
    };
    return {
        ...lifecycle,
        currentStage: newStage,
        stageHistory: [...lifecycle.stageHistory, event],
    };
}
/**
 * Gets lifecycle duration in days
 */
function getLifecycleDuration(lifecycle) {
    const now = new Date();
    const diff = now.getTime() - lifecycle.retentionStartDate.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
}
/**
 * Gets documents eligible for archival
 */
function getDocumentsEligibleForArchival(lifecycles, inactiveDaysThreshold = 365) {
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() - inactiveDaysThreshold);
    return lifecycles.filter(lc => lc.currentStage === LifecycleStage.INACTIVE_STORAGE &&
        !lc.legalHoldApplied &&
        lc.lastReviewDate &&
        lc.lastReviewDate < thresholdDate);
}
/**
 * Tracks lifecycle event
 */
function trackLifecycleEvent(lifecycle, event) {
    return {
        ...lifecycle,
        stageHistory: [...lifecycle.stageHistory, event],
    };
}
// ============================================================================
// RECORDS RETENTION COMPLIANCE
// ============================================================================
/**
 * Creates retention compliance record
 */
function createRetentionCompliance(documentId, scheduleId) {
    const nextAuditDate = new Date();
    nextAuditDate.setFullYear(nextAuditDate.getFullYear() + 1);
    return {
        id: crypto.randomUUID(),
        documentId,
        scheduleId,
        complianceStatus: ComplianceStatus.COMPLIANT,
        nextAuditDate,
        violations: [],
        correctionActions: [],
    };
}
/**
 * Audits document retention compliance
 */
function auditRetentionCompliance(document, schedule, lifecycle) {
    if (!schedule.applicableDocumentTypes.includes(document.documentType)) {
        return ComplianceStatus.NON_COMPLIANT;
    }
    if (lifecycle.legalHoldApplied && document.status === DocumentStatus.DISPOSED) {
        return ComplianceStatus.NON_COMPLIANT;
    }
    if (lifecycle.disposalEligibilityDate) {
        const now = new Date();
        const overdue = now.getTime() - lifecycle.disposalEligibilityDate.getTime();
        const daysOverdue = Math.floor(overdue / (1000 * 60 * 60 * 24));
        if (daysOverdue > 365 && document.status !== DocumentStatus.DISPOSED) {
            return ComplianceStatus.NON_COMPLIANT;
        }
    }
    return ComplianceStatus.COMPLIANT;
}
/**
 * Adds compliance violation
 */
function addComplianceViolation(compliance, violation) {
    return {
        ...compliance,
        complianceStatus: ComplianceStatus.NON_COMPLIANT,
        violations: [...compliance.violations, violation],
    };
}
/**
 * Creates correction action
 */
function createCorrectionAction(compliance, action) {
    return {
        ...compliance,
        complianceStatus: ComplianceStatus.REMEDIATION_IN_PROGRESS,
        correctionActions: [...compliance.correctionActions, action],
    };
}
/**
 * Verifies compliance remediation
 */
function verifyComplianceRemediation(compliance, verifiedBy) {
    const allActionsCompleted = compliance.correctionActions.every(action => action.status === 'completed');
    return {
        ...compliance,
        complianceStatus: allActionsCompleted ? ComplianceStatus.COMPLIANT : ComplianceStatus.REMEDIATION_IN_PROGRESS,
        verifiedBy,
        verificationDate: new Date(),
    };
}
// ============================================================================
// DOCUMENT DISPOSAL WORKFLOWS
// ============================================================================
/**
 * Creates a disposal workflow
 */
function createDisposalWorkflow(params) {
    return {
        id: crypto.randomUUID(),
        documentIds: params.documentIds,
        requestedBy: params.requestedBy,
        requestDate: new Date(),
        disposalMethod: params.disposalMethod,
        approvalRequired: params.approvalRequired ?? true,
        status: params.approvalRequired ? DisposalStatus.PENDING_APPROVAL : DisposalStatus.APPROVED,
    };
}
/**
 * Approves disposal workflow
 */
function approveDisposalWorkflow(workflow, approvedBy) {
    return {
        ...workflow,
        approvedBy,
        approvalDate: new Date(),
        status: DisposalStatus.APPROVED,
    };
}
/**
 * Schedules disposal execution
 */
function scheduleDisposal(workflow, scheduledDate) {
    return {
        ...workflow,
        scheduledDate,
        status: DisposalStatus.SCHEDULED,
    };
}
/**
 * Executes disposal
 */
function executeDisposal(workflow, executedBy, witnessedBy) {
    const certificateNumber = generateCertificateOfDestruction();
    return {
        ...workflow,
        executedBy,
        executionDate: new Date(),
        witnessedBy,
        certificateOfDestruction: certificateNumber,
        status: DisposalStatus.COMPLETED,
    };
}
/**
 * Generates certificate of destruction number
 */
function generateCertificateOfDestruction() {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = crypto.randomBytes(4).toString('hex').toUpperCase();
    return `COD-${timestamp}-${random}`;
}
/**
 * Validates disposal eligibility
 */
function validateDisposalEligibility(document, lifecycle) {
    if (lifecycle.legalHoldApplied) {
        return { eligible: false, reason: 'Document is under legal hold' };
    }
    if (!lifecycle.disposalEligibilityDate) {
        return { eligible: false, reason: 'Disposal date not calculated' };
    }
    if (lifecycle.disposalEligibilityDate > new Date()) {
        return { eligible: false, reason: 'Retention period not yet expired' };
    }
    return { eligible: true };
}
// ============================================================================
// LEGAL HOLD MANAGEMENT
// ============================================================================
/**
 * Creates a legal hold
 */
function createLegalHold(params) {
    return {
        id: crypto.randomUUID(),
        holdName: params.holdName,
        caseNumber: params.caseNumber,
        description: params.description,
        issuedBy: params.issuedBy,
        issuedDate: new Date(),
        status: LegalHoldStatus.ACTIVE,
        affectedDocuments: params.affectedDocuments,
        custodians: params.custodians,
        preservationInstructions: params.preservationInstructions,
    };
}
/**
 * Applies legal hold to documents
 */
function applyLegalHold(lifecycle, legalHoldId) {
    return {
        ...lifecycle,
        legalHoldApplied: true,
        metadata: {
            ...lifecycle.metadata,
            legalHoldId,
        },
    };
}
/**
 * Releases legal hold
 */
function releaseLegalHold(hold, releasedBy) {
    return {
        ...hold,
        status: LegalHoldStatus.RELEASED,
        releaseDate: new Date(),
        releasedBy,
    };
}
/**
 * Adds documents to legal hold
 */
function addDocumentsToLegalHold(hold, documentIds) {
    return {
        ...hold,
        affectedDocuments: [...new Set([...hold.affectedDocuments, ...documentIds])],
    };
}
/**
 * Gets active legal holds for document
 */
function getActiveLegalHolds(documentId, allHolds) {
    return allHolds.filter(hold => hold.status === LegalHoldStatus.ACTIVE &&
        hold.affectedDocuments.includes(documentId));
}
// ============================================================================
// DOCUMENT VERSIONING
// ============================================================================
/**
 * Creates a new document version
 */
function createDocumentVersion(params) {
    const checksum = calculateChecksum(params.filePath);
    return {
        versionId: crypto.randomUUID(),
        documentId: params.documentId,
        versionNumber: params.versionNumber,
        action: params.action,
        createdBy: params.createdBy,
        createdDate: new Date(),
        changeDescription: params.changeDescription,
        filePath: params.filePath,
        fileSize: params.fileSize,
        checksum,
        previousVersionId: params.previousVersionId,
        isCurrent: true,
    };
}
/**
 * Calculates file checksum (SHA-256)
 */
function calculateChecksum(filePath) {
    // In production, this would read the actual file
    // For now, return a mock checksum
    const hash = crypto.createHash('sha256');
    hash.update(filePath + Date.now());
    return hash.digest('hex');
}
/**
 * Gets version history
 */
function getVersionHistory(versions, documentId) {
    return versions
        .filter(v => v.documentId === documentId)
        .sort((a, b) => b.createdDate.getTime() - a.createdDate.getTime());
}
/**
 * Restores previous version
 */
function restorePreviousVersion(currentVersion, restoredBy) {
    return {
        ...currentVersion,
        action: VersionAction.RESTORED,
        createdBy: restoredBy,
        createdDate: new Date(),
        isCurrent: true,
    };
}
/**
 * Compares two versions
 */
function compareVersions(version1, version2) {
    return {
        checksumMatch: version1.checksum === version2.checksum,
        sizeChange: version2.fileSize - version1.fileSize,
    };
}
// ============================================================================
// METADATA MANAGEMENT
// ============================================================================
/**
 * Updates document metadata
 */
function updateDocumentMetadata(document, metadata) {
    return {
        ...document,
        metadata: {
            ...document.metadata,
            ...metadata,
        },
        modifiedDate: new Date(),
    };
}
/**
 * Adds custom metadata field
 */
function addCustomMetadataField(metadata, fieldName, fieldValue) {
    return {
        ...metadata,
        customFields: {
            ...metadata.customFields,
            [fieldName]: fieldValue,
        },
    };
}
/**
 * Validates metadata completeness
 */
function validateMetadataCompleteness(metadata, requiredFields) {
    const missingFields = requiredFields.filter(field => !metadata[field]);
    return {
        complete: missingFields.length === 0,
        missingFields,
    };
}
/**
 * Extracts metadata from file
 */
function extractMetadataFromFile(filePath) {
    // In production, this would use actual file parsing libraries
    return {
        keywords: [],
        customFields: {
            extractedDate: new Date().toISOString(),
        },
    };
}
// ============================================================================
// DOCUMENT SEARCH AND RETRIEVAL
// ============================================================================
/**
 * Searches documents by criteria
 */
function searchDocuments(documents, criteria) {
    return documents.filter(doc => {
        if (criteria.keywords && !doc.title.toLowerCase().includes(criteria.keywords.toLowerCase()) &&
            !doc.description.toLowerCase().includes(criteria.keywords.toLowerCase())) {
            return false;
        }
        if (criteria.documentType && doc.documentType !== criteria.documentType) {
            return false;
        }
        if (criteria.classification && doc.classification !== criteria.classification) {
            return false;
        }
        if (criteria.status && doc.status !== criteria.status) {
            return false;
        }
        if (criteria.departmentId && doc.departmentId !== criteria.departmentId) {
            return false;
        }
        if (criteria.agencyId && doc.agencyId !== criteria.agencyId) {
            return false;
        }
        if (criteria.createdDateFrom && doc.createdDate < criteria.createdDateFrom) {
            return false;
        }
        if (criteria.createdDateTo && doc.createdDate > criteria.createdDateTo) {
            return false;
        }
        if (criteria.tags && criteria.tags.length > 0 &&
            !criteria.tags.some(tag => doc.tags.includes(tag))) {
            return false;
        }
        return true;
    });
}
/**
 * Retrieves document by number
 */
function retrieveDocumentByNumber(documents, documentNumber) {
    return documents.find(doc => doc.documentNumber === documentNumber);
}
/**
 * Gets related documents
 */
function getRelatedDocuments(document, allDocuments) {
    return allDocuments.filter(doc => document.relatedDocuments.includes(doc.id));
}
/**
 * Builds search index
 */
function buildSearchIndex(documents) {
    const index = {};
    documents.forEach(doc => {
        const keywords = [
            doc.title,
            doc.description,
            doc.documentNumber,
            ...doc.tags,
        ].join(' ').toLowerCase().split(/\s+/);
        keywords.forEach(keyword => {
            if (!index[keyword]) {
                index[keyword] = [];
            }
            if (!index[keyword].includes(doc.id)) {
                index[keyword].push(doc.id);
            }
        });
    });
    return index;
}
// ============================================================================
// ELECTRONIC RECORDS MANAGEMENT
// ============================================================================
/**
 * Creates ERM policy
 */
function createERMPolicy(params) {
    const nextReviewDate = new Date(params.effectiveDate);
    nextReviewDate.setMonth(nextReviewDate.getMonth() + params.reviewFrequencyMonths);
    return {
        id: crypto.randomUUID(),
        policyName: params.policyName,
        policyNumber: params.policyNumber,
        description: params.description,
        effectiveDate: params.effectiveDate,
        requirements: params.requirements,
        applicableAgencies: params.applicableAgencies,
        approvedBy: params.approvedBy,
        approvalDate: new Date(),
        reviewFrequencyMonths: params.reviewFrequencyMonths,
        nextReviewDate,
    };
}
/**
 * Validates document against ERM policy
 */
function validateAgainstERMPolicy(document, policy) {
    const violations = [];
    policy.requirements.forEach(req => {
        if (req.mandatory) {
            // Check policy-specific validation rules
            if (req.validationRules) {
                req.validationRules.forEach(rule => {
                    // In production, implement actual rule validation
                    if (!document.metadata) {
                        violations.push(`Missing metadata required by: ${req.title}`);
                    }
                });
            }
        }
    });
    return {
        compliant: violations.length === 0,
        violations,
    };
}
/**
 * Gets ERM policy compliance rate
 */
function calculateERMComplianceRate(documents, policy) {
    if (documents.length === 0)
        return 100;
    const compliantDocs = documents.filter(doc => {
        const result = validateAgainstERMPolicy(doc, policy);
        return result.compliant;
    });
    return (compliantDocs.length / documents.length) * 100;
}
// ============================================================================
// DOCUMENT ARCHIVAL
// ============================================================================
/**
 * Creates document archive
 */
function createDocumentArchive(params) {
    return {
        id: crypto.randomUUID(),
        archiveName: params.archiveName,
        description: params.description,
        documentIds: params.documentIds,
        archiveDate: new Date(),
        archivedBy: params.archivedBy,
        storageLocation: params.storageLocation,
        archiveType: params.archiveType,
        retrievalInstructions: params.retrievalInstructions,
    };
}
/**
 * Archives documents
 */
function archiveDocuments(documents, archive) {
    return documents.map(doc => {
        if (archive.documentIds.includes(doc.id)) {
            return {
                ...doc,
                status: DocumentStatus.ARCHIVED,
                modifiedDate: new Date(),
            };
        }
        return doc;
    });
}
/**
 * Retrieves archived documents
 */
function retrieveArchivedDocuments(archive, allDocuments) {
    return allDocuments.filter(doc => archive.documentIds.includes(doc.id));
}
// ============================================================================
// RETENTION POLICY ENFORCEMENT
// ============================================================================
/**
 * Enforces retention policy across documents
 */
function enforceRetentionPolicy(documents, schedules, lifecycles) {
    const eligible = [];
    const notEligible = [];
    const onHold = [];
    documents.forEach(doc => {
        const lifecycle = lifecycles.find(lc => lc.documentId === doc.id);
        if (!lifecycle) {
            notEligible.push(doc.id);
            return;
        }
        if (lifecycle.legalHoldApplied) {
            onHold.push(doc.id);
            return;
        }
        const eligibility = validateDisposalEligibility(doc, lifecycle);
        if (eligibility.eligible) {
            eligible.push(doc.id);
        }
        else {
            notEligible.push(doc.id);
        }
    });
    return { eligible, notEligible, onHold };
}
/**
 * Generates retention policy report
 */
function generateRetentionPolicyReport(params) {
    const enforcement = enforceRetentionPolicy(params.documents, params.schedules, params.lifecycles);
    const compliantDocs = params.compliance.filter(c => c.complianceStatus === ComplianceStatus.COMPLIANT).length;
    return {
        totalDocuments: params.documents.length,
        compliantDocuments: compliantDocs,
        nonCompliantDocuments: params.documents.length - compliantDocs,
        documentsOnHold: enforcement.onHold.length,
        eligibleForDisposal: enforcement.eligible.length,
        complianceRate: params.documents.length > 0
            ? (compliantDocs / params.documents.length) * 100
            : 100,
    };
}
// ============================================================================
// SEQUELIZE MODEL DEFINITIONS
// ============================================================================
/**
 * Sequelize model for DocumentRecord
 */
exports.DocumentRecordModel = {
    tableName: 'document_records',
    columns: {
        id: { type: 'UUID', primaryKey: true, defaultValue: 'UUIDV4' },
        documentNumber: { type: 'STRING', allowNull: false, unique: true },
        title: { type: 'STRING', allowNull: false },
        description: { type: 'TEXT', allowNull: false },
        documentType: { type: 'ENUM', values: Object.values(DocumentType) },
        classification: { type: 'ENUM', values: Object.values(DocumentClassification) },
        status: { type: 'ENUM', values: Object.values(DocumentStatus) },
        lifecycleStage: { type: 'ENUM', values: Object.values(LifecycleStage) },
        createdBy: { type: 'STRING', allowNull: false },
        createdDate: { type: 'DATE', allowNull: false },
        modifiedBy: { type: 'STRING', allowNull: true },
        modifiedDate: { type: 'DATE', allowNull: true },
        departmentId: { type: 'UUID', allowNull: false },
        agencyId: { type: 'UUID', allowNull: false },
        retentionScheduleId: { type: 'UUID', allowNull: false },
        disposalDate: { type: 'DATE', allowNull: true },
        filePath: { type: 'STRING', allowNull: true },
        fileSize: { type: 'INTEGER', allowNull: true },
        mimeType: { type: 'STRING', allowNull: true },
        metadata: { type: 'JSON', defaultValue: {} },
        tags: { type: 'JSON', defaultValue: [] },
        relatedDocuments: { type: 'JSON', defaultValue: [] },
    },
    indexes: [
        { fields: ['documentNumber'] },
        { fields: ['documentType'] },
        { fields: ['classification'] },
        { fields: ['status'] },
        { fields: ['departmentId'] },
        { fields: ['agencyId'] },
        { fields: ['createdDate'] },
    ],
};
/**
 * Sequelize model for RetentionSchedule
 */
exports.RetentionScheduleModel = {
    tableName: 'retention_schedules',
    columns: {
        id: { type: 'UUID', primaryKey: true, defaultValue: 'UUIDV4' },
        scheduleCode: { type: 'STRING', allowNull: false, unique: true },
        recordSeries: { type: 'STRING', allowNull: false },
        description: { type: 'TEXT', allowNull: false },
        retentionType: { type: 'ENUM', values: Object.values(RetentionScheduleType) },
        retentionPeriodYears: { type: 'INTEGER', allowNull: true },
        eventTrigger: { type: 'STRING', allowNull: true },
        disposalMethod: { type: 'ENUM', values: Object.values(DisposalMethod) },
        legalAuthority: { type: 'STRING', allowNull: false },
        applicableDocumentTypes: { type: 'JSON', defaultValue: [] },
        active: { type: 'BOOLEAN', defaultValue: true },
        approvedBy: { type: 'STRING', allowNull: false },
        approvalDate: { type: 'DATE', allowNull: false },
        reviewDate: { type: 'DATE', allowNull: false },
        notes: { type: 'TEXT', allowNull: true },
        metadata: { type: 'JSON', defaultValue: {} },
    },
    indexes: [
        { fields: ['scheduleCode'] },
        { fields: ['recordSeries'] },
        { fields: ['active'] },
        { fields: ['reviewDate'] },
    ],
};
/**
 * Sequelize model for DocumentLifecycle
 */
exports.DocumentLifecycleModel = {
    tableName: 'document_lifecycles',
    columns: {
        id: { type: 'UUID', primaryKey: true, defaultValue: 'UUIDV4' },
        documentId: { type: 'UUID', allowNull: false },
        currentStage: { type: 'ENUM', values: Object.values(LifecycleStage) },
        stageHistory: { type: 'JSON', defaultValue: [] },
        retentionStartDate: { type: 'DATE', allowNull: false },
        retentionEndDate: { type: 'DATE', allowNull: true },
        disposalEligibilityDate: { type: 'DATE', allowNull: true },
        legalHoldApplied: { type: 'BOOLEAN', defaultValue: false },
        lastReviewDate: { type: 'DATE', allowNull: true },
        nextReviewDate: { type: 'DATE', allowNull: true },
        archivalDate: { type: 'DATE', allowNull: true },
        metadata: { type: 'JSON', defaultValue: {} },
    },
    indexes: [
        { fields: ['documentId'] },
        { fields: ['currentStage'] },
        { fields: ['disposalEligibilityDate'] },
        { fields: ['legalHoldApplied'] },
    ],
};
/**
 * Sequelize model for LegalHold
 */
exports.LegalHoldModel = {
    tableName: 'legal_holds',
    columns: {
        id: { type: 'UUID', primaryKey: true, defaultValue: 'UUIDV4' },
        holdName: { type: 'STRING', allowNull: false },
        caseNumber: { type: 'STRING', allowNull: true },
        description: { type: 'TEXT', allowNull: false },
        issuedBy: { type: 'STRING', allowNull: false },
        issuedDate: { type: 'DATE', allowNull: false },
        status: { type: 'ENUM', values: Object.values(LegalHoldStatus) },
        affectedDocuments: { type: 'JSON', defaultValue: [] },
        custodians: { type: 'JSON', defaultValue: [] },
        releaseDate: { type: 'DATE', allowNull: true },
        releasedBy: { type: 'STRING', allowNull: true },
        expirationDate: { type: 'DATE', allowNull: true },
        preservationInstructions: { type: 'TEXT', allowNull: false },
        metadata: { type: 'JSON', defaultValue: {} },
    },
    indexes: [
        { fields: ['holdName'] },
        { fields: ['caseNumber'] },
        { fields: ['status'] },
        { fields: ['issuedDate'] },
    ],
};
// ============================================================================
// NESTJS SERVICE CLASS EXAMPLE
// ============================================================================
/**
 * Example NestJS service for document management
 *
 * @example
 * ```typescript
 * @Injectable()
 * export class DocumentManagementService {
 *   constructor(
 *     @InjectModel(DocumentRecordModel)
 *     private documentRepo: Repository<DocumentRecord>,
 *   ) {}
 *
 *   async createDocument(dto: CreateDocumentDto): Promise<DocumentRecord> {
 *     const document = createDocumentRecord(dto);
 *     return this.documentRepo.save(document);
 *   }
 *
 *   async searchDocuments(criteria: DocumentSearchCriteria): Promise<DocumentRecord[]> {
 *     const allDocuments = await this.documentRepo.find();
 *     return searchDocuments(allDocuments, criteria);
 *   }
 * }
 * ```
 */
exports.DocumentManagementServiceExample = `
@Injectable()
export class DocumentManagementService {
  constructor(
    @InjectModel(DocumentRecordModel)
    private documentRepo: Repository<DocumentRecord>,
    @InjectModel(RetentionScheduleModel)
    private scheduleRepo: Repository<RetentionSchedule>,
    @InjectModel(DocumentLifecycleModel)
    private lifecycleRepo: Repository<DocumentLifecycle>,
    @InjectModel(LegalHoldModel)
    private legalHoldRepo: Repository<LegalHold>,
  ) {}

  async createDocument(dto: CreateDocumentDto): Promise<DocumentRecord> {
    const document = createDocumentRecord(dto);
    const lifecycle = createDocumentLifecycle(document.id, new Date());

    await this.documentRepo.save(document);
    await this.lifecycleRepo.save(lifecycle);

    return document;
  }

  async enforceRetentionPolicies(): Promise<void> {
    const documents = await this.documentRepo.find();
    const schedules = await this.scheduleRepo.find({ where: { active: true } });
    const lifecycles = await this.lifecycleRepo.find();

    const enforcement = enforceRetentionPolicy(documents, schedules, lifecycles);

    // Process eligible documents for disposal
    for (const docId of enforcement.eligible) {
      const workflow = createDisposalWorkflow({
        documentIds: [docId],
        requestedBy: 'system',
        disposalMethod: DisposalMethod.SECURE_SHREDDING,
      });
      // Save workflow for approval
    }
  }
}
`;
// ============================================================================
// SWAGGER API SCHEMA DEFINITIONS
// ============================================================================
/**
 * Swagger DTO for creating document record
 */
exports.CreateDocumentRecordDto = {
    schema: {
        type: 'object',
        required: [
            'title',
            'description',
            'documentType',
            'classification',
            'createdBy',
            'departmentId',
            'agencyId',
            'retentionScheduleId',
        ],
        properties: {
            title: { type: 'string', example: 'Annual Budget Report FY2024' },
            description: { type: 'string', example: 'Comprehensive budget analysis for fiscal year 2024' },
            documentType: { type: 'string', enum: Object.values(DocumentType) },
            classification: { type: 'string', enum: Object.values(DocumentClassification) },
            createdBy: { type: 'string', example: 'user-123' },
            departmentId: { type: 'string', format: 'uuid' },
            agencyId: { type: 'string', format: 'uuid' },
            retentionScheduleId: { type: 'string', format: 'uuid' },
            metadata: {
                type: 'object',
                properties: {
                    author: { type: 'string' },
                    subject: { type: 'string' },
                    keywords: { type: 'array', items: { type: 'string' } },
                    fiscalYear: { type: 'number' },
                },
            },
        },
    },
};
/**
 * Swagger DTO for retention schedule
 */
exports.CreateRetentionScheduleDto = {
    schema: {
        type: 'object',
        required: [
            'scheduleCode',
            'recordSeries',
            'description',
            'retentionType',
            'disposalMethod',
            'legalAuthority',
            'applicableDocumentTypes',
            'approvedBy',
        ],
        properties: {
            scheduleCode: { type: 'string', example: 'GRS-6.1' },
            recordSeries: { type: 'string', example: 'Financial Records' },
            description: { type: 'string', example: 'Financial transaction records' },
            retentionType: { type: 'string', enum: Object.values(RetentionScheduleType) },
            retentionPeriodYears: { type: 'number', example: 7 },
            eventTrigger: { type: 'string', example: 'End of fiscal year' },
            disposalMethod: { type: 'string', enum: Object.values(DisposalMethod) },
            legalAuthority: { type: 'string', example: '36 CFR 1229' },
            applicableDocumentTypes: {
                type: 'array',
                items: { type: 'string', enum: Object.values(DocumentType) },
            },
            approvedBy: { type: 'string', example: 'records-manager-001' },
        },
    },
};
/**
 * Swagger DTO for legal hold
 */
exports.CreateLegalHoldDto = {
    schema: {
        type: 'object',
        required: [
            'holdName',
            'description',
            'issuedBy',
            'affectedDocuments',
            'custodians',
            'preservationInstructions',
        ],
        properties: {
            holdName: { type: 'string', example: 'Civil Case #2024-001 Hold' },
            caseNumber: { type: 'string', example: '2024-001' },
            description: { type: 'string', example: 'Legal hold for pending litigation' },
            issuedBy: { type: 'string', example: 'legal-dept-head' },
            affectedDocuments: { type: 'array', items: { type: 'string', format: 'uuid' } },
            custodians: { type: 'array', items: { type: 'string' } },
            preservationInstructions: {
                type: 'string',
                example: 'Preserve all documents related to contract negotiations',
            },
        },
    },
};
/**
 * Swagger response schema for retention policy report
 */
exports.RetentionPolicyReportResponse = {
    schema: {
        type: 'object',
        properties: {
            totalDocuments: { type: 'number', example: 15000 },
            compliantDocuments: { type: 'number', example: 14250 },
            nonCompliantDocuments: { type: 'number', example: 750 },
            documentsOnHold: { type: 'number', example: 120 },
            eligibleForDisposal: { type: 'number', example: 450 },
            complianceRate: { type: 'number', example: 95.0 },
        },
    },
};
//# sourceMappingURL=document-management-retention-kit.js.map