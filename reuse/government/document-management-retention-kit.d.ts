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
/**
 * Document classification levels
 */
export declare enum DocumentClassification {
    UNCLASSIFIED = "UNCLASSIFIED",
    CONFIDENTIAL = "CONFIDENTIAL",
    SECRET = "SECRET",
    TOP_SECRET = "TOP_SECRET",
    SENSITIVE_BUT_UNCLASSIFIED = "SENSITIVE_BUT_UNCLASSIFIED",
    FOR_OFFICIAL_USE_ONLY = "FOR_OFFICIAL_USE_ONLY",
    LAW_ENFORCEMENT_SENSITIVE = "LAW_ENFORCEMENT_SENSITIVE",
    CONTROLLED_UNCLASSIFIED = "CONTROLLED_UNCLASSIFIED"
}
/**
 * Document status
 */
export declare enum DocumentStatus {
    DRAFT = "DRAFT",
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    ARCHIVED = "ARCHIVED",
    PENDING_DISPOSAL = "PENDING_DISPOSAL",
    DISPOSED = "DISPOSED",
    LEGAL_HOLD = "LEGAL_HOLD",
    UNDER_REVIEW = "UNDER_REVIEW"
}
/**
 * Document type categories
 */
export declare enum DocumentType {
    POLICY = "POLICY",
    PROCEDURE = "PROCEDURE",
    REGULATION = "REGULATION",
    CONTRACT = "CONTRACT",
    CORRESPONDENCE = "CORRESPONDENCE",
    REPORT = "REPORT",
    FORM = "FORM",
    MEMO = "MEMO",
    MEETING_MINUTES = "MEETING_MINUTES",
    FINANCIAL_RECORD = "FINANCIAL_RECORD",
    PERSONNEL_FILE = "PERSONNEL_FILE",
    LEGAL_DOCUMENT = "LEGAL_DOCUMENT",
    TECHNICAL_DOCUMENT = "TECHNICAL_DOCUMENT"
}
/**
 * Retention schedule type
 */
export declare enum RetentionScheduleType {
    PERMANENT = "PERMANENT",
    YEARS = "YEARS",
    EVENT_BASED = "EVENT_BASED",
    SUPERSEDED = "SUPERSEDED",
    UNTIL_OBSOLETE = "UNTIL_OBSOLETE"
}
/**
 * Disposal method
 */
export declare enum DisposalMethod {
    SECURE_SHREDDING = "SECURE_SHREDDING",
    ELECTRONIC_DELETION = "ELECTRONIC_DELETION",
    DEGAUSSING = "DEGAUSSING",
    INCINERATION = "INCINERATION",
    TRANSFER_TO_ARCHIVES = "TRANSFER_TO_ARCHIVES",
    TRANSFER_TO_NARA = "TRANSFER_TO_NARA",
    RECYCLING = "RECYCLING"
}
/**
 * Document lifecycle stage
 */
export declare enum LifecycleStage {
    CREATION = "CREATION",
    ACTIVE_USE = "ACTIVE_USE",
    INACTIVE_STORAGE = "INACTIVE_STORAGE",
    RETENTION_HOLD = "RETENTION_HOLD",
    ARCHIVAL = "ARCHIVAL",
    DISPOSAL = "DISPOSAL"
}
/**
 * Legal hold status
 */
export declare enum LegalHoldStatus {
    ACTIVE = "ACTIVE",
    RELEASED = "RELEASED",
    PARTIAL_RELEASE = "PARTIAL_RELEASE",
    PENDING_REVIEW = "PENDING_REVIEW"
}
/**
 * Version control action
 */
export declare enum VersionAction {
    CREATED = "CREATED",
    MODIFIED = "MODIFIED",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    ARCHIVED = "ARCHIVED",
    RESTORED = "RESTORED"
}
/**
 * Document record structure
 */
export interface DocumentRecord {
    id: string;
    documentNumber: string;
    title: string;
    description: string;
    documentType: DocumentType;
    classification: DocumentClassification;
    status: DocumentStatus;
    lifecycleStage: LifecycleStage;
    createdBy: string;
    createdDate: Date;
    modifiedBy?: string;
    modifiedDate?: Date;
    departmentId: string;
    agencyId: string;
    retentionScheduleId: string;
    disposalDate?: Date;
    filePath?: string;
    fileSize?: number;
    mimeType?: string;
    metadata: DocumentMetadata;
    tags: string[];
    relatedDocuments: string[];
}
/**
 * Document metadata structure
 */
export interface DocumentMetadata {
    author?: string;
    subject?: string;
    keywords?: string[];
    projectNumber?: string;
    contractNumber?: string;
    fiscalYear?: number;
    grantNumber?: string;
    caseNumber?: string;
    recordSeries?: string;
    customFields?: Record<string, any>;
}
/**
 * Retention schedule structure
 */
export interface RetentionSchedule {
    id: string;
    scheduleCode: string;
    recordSeries: string;
    description: string;
    retentionType: RetentionScheduleType;
    retentionPeriodYears?: number;
    eventTrigger?: string;
    disposalMethod: DisposalMethod;
    legalAuthority: string;
    applicableDocumentTypes: DocumentType[];
    active: boolean;
    approvedBy: string;
    approvalDate: Date;
    reviewDate: Date;
    notes?: string;
    metadata?: Record<string, any>;
}
/**
 * Document lifecycle tracking
 */
export interface DocumentLifecycle {
    id: string;
    documentId: string;
    currentStage: LifecycleStage;
    stageHistory: LifecycleEvent[];
    retentionStartDate: Date;
    retentionEndDate?: Date;
    disposalEligibilityDate?: Date;
    legalHoldApplied: boolean;
    lastReviewDate?: Date;
    nextReviewDate?: Date;
    archivalDate?: Date;
    metadata?: Record<string, any>;
}
/**
 * Lifecycle event
 */
export interface LifecycleEvent {
    eventId: string;
    stage: LifecycleStage;
    eventDate: Date;
    performedBy: string;
    reason?: string;
    notes?: string;
}
/**
 * Retention compliance record
 */
export interface RetentionCompliance {
    id: string;
    documentId: string;
    scheduleId: string;
    complianceStatus: ComplianceStatus;
    lastAuditDate?: Date;
    nextAuditDate?: Date;
    violations: ComplianceViolation[];
    correctionActions: CorrectionAction[];
    verifiedBy?: string;
    verificationDate?: Date;
    metadata?: Record<string, any>;
}
/**
 * Compliance status
 */
export declare enum ComplianceStatus {
    COMPLIANT = "COMPLIANT",
    NON_COMPLIANT = "NON_COMPLIANT",
    UNDER_REVIEW = "UNDER_REVIEW",
    REMEDIATION_IN_PROGRESS = "REMEDIATION_IN_PROGRESS",
    WAIVED = "WAIVED"
}
/**
 * Compliance violation
 */
export interface ComplianceViolation {
    violationId: string;
    violationType: string;
    description: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    discoveredDate: Date;
    discoveredBy: string;
}
/**
 * Correction action
 */
export interface CorrectionAction {
    actionId: string;
    description: string;
    assignedTo: string;
    dueDate: Date;
    completedDate?: Date;
    status: 'pending' | 'in_progress' | 'completed';
}
/**
 * Document disposal workflow
 */
export interface DisposalWorkflow {
    id: string;
    documentIds: string[];
    requestedBy: string;
    requestDate: Date;
    disposalMethod: DisposalMethod;
    scheduledDate?: Date;
    approvalRequired: boolean;
    approvedBy?: string;
    approvalDate?: Date;
    executedBy?: string;
    executionDate?: Date;
    status: DisposalStatus;
    certificateOfDestruction?: string;
    witnessedBy?: string[];
    metadata?: Record<string, any>;
}
/**
 * Disposal status
 */
export declare enum DisposalStatus {
    PENDING_REVIEW = "PENDING_REVIEW",
    PENDING_APPROVAL = "PENDING_APPROVAL",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    SCHEDULED = "SCHEDULED",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED"
}
/**
 * Legal hold record
 */
export interface LegalHold {
    id: string;
    holdName: string;
    caseNumber?: string;
    description: string;
    issuedBy: string;
    issuedDate: Date;
    status: LegalHoldStatus;
    affectedDocuments: string[];
    custodians: string[];
    releaseDate?: Date;
    releasedBy?: string;
    expirationDate?: Date;
    preservationInstructions: string;
    metadata?: Record<string, any>;
}
/**
 * Document version
 */
export interface DocumentVersion {
    versionId: string;
    documentId: string;
    versionNumber: string;
    action: VersionAction;
    createdBy: string;
    createdDate: Date;
    changeDescription: string;
    filePath: string;
    fileSize: number;
    checksum: string;
    previousVersionId?: string;
    isCurrent: boolean;
    metadata?: Record<string, any>;
}
/**
 * Document search criteria
 */
export interface DocumentSearchCriteria {
    keywords?: string;
    documentType?: DocumentType;
    classification?: DocumentClassification;
    status?: DocumentStatus;
    departmentId?: string;
    agencyId?: string;
    createdDateFrom?: Date;
    createdDateTo?: Date;
    author?: string;
    tags?: string[];
    recordSeries?: string;
    metadata?: Record<string, any>;
}
/**
 * Electronic records management policy
 */
export interface ERMPolicy {
    id: string;
    policyName: string;
    policyNumber: string;
    description: string;
    effectiveDate: Date;
    expirationDate?: Date;
    requirements: PolicyRequirement[];
    applicableAgencies: string[];
    approvedBy: string;
    approvalDate: Date;
    reviewFrequencyMonths: number;
    lastReviewDate?: Date;
    nextReviewDate: Date;
    metadata?: Record<string, any>;
}
/**
 * Policy requirement
 */
export interface PolicyRequirement {
    requirementId: string;
    title: string;
    description: string;
    mandatory: boolean;
    validationRules?: string[];
}
/**
 * Document archive record
 */
export interface DocumentArchive {
    id: string;
    archiveName: string;
    description: string;
    documentIds: string[];
    archiveDate: Date;
    archivedBy: string;
    storageLocation: string;
    archiveType: 'physical' | 'electronic' | 'hybrid';
    retrievalInstructions?: string;
    accessRestrictions?: string[];
    expirationDate?: Date;
    metadata?: Record<string, any>;
}
/**
 * Creates a new document record
 */
export declare function createDocumentRecord(params: {
    title: string;
    description: string;
    documentType: DocumentType;
    classification: DocumentClassification;
    createdBy: string;
    departmentId: string;
    agencyId: string;
    retentionScheduleId: string;
    metadata?: DocumentMetadata;
}): DocumentRecord;
/**
 * Generates a unique document number
 */
export declare function generateDocumentNumber(): string;
/**
 * Classifies a document based on content analysis
 */
export declare function classifyDocument(documentContent: string, keywords: Record<DocumentClassification, string[]>): DocumentClassification;
/**
 * Updates document classification
 */
export declare function updateDocumentClassification(document: DocumentRecord, newClassification: DocumentClassification, modifiedBy: string): DocumentRecord;
/**
 * Validates document classification level
 */
export declare function validateClassificationLevel(classification: DocumentClassification, userClearanceLevel: DocumentClassification): boolean;
/**
 * Creates a retention schedule
 */
export declare function createRetentionSchedule(params: {
    scheduleCode: string;
    recordSeries: string;
    description: string;
    retentionType: RetentionScheduleType;
    retentionPeriodYears?: number;
    eventTrigger?: string;
    disposalMethod: DisposalMethod;
    legalAuthority: string;
    applicableDocumentTypes: DocumentType[];
    approvedBy: string;
}): RetentionSchedule;
/**
 * Calculates disposal eligibility date
 */
export declare function calculateDisposalDate(schedule: RetentionSchedule, documentCreationDate: Date, eventDate?: Date): Date | null;
/**
 * Gets schedules requiring review
 */
export declare function getSchedulesRequiringReview(schedules: RetentionSchedule[], currentDate?: Date): RetentionSchedule[];
/**
 * Updates retention schedule
 */
export declare function updateRetentionSchedule(schedule: RetentionSchedule, updates: Partial<RetentionSchedule>): RetentionSchedule;
/**
 * Applies retention schedule to document
 */
export declare function applyRetentionSchedule(document: DocumentRecord, schedule: RetentionSchedule): DocumentRecord;
/**
 * Creates document lifecycle record
 */
export declare function createDocumentLifecycle(documentId: string, retentionStartDate: Date): DocumentLifecycle;
/**
 * Advances document to next lifecycle stage
 */
export declare function advanceLifecycleStage(lifecycle: DocumentLifecycle, newStage: LifecycleStage, performedBy: string, reason?: string): DocumentLifecycle;
/**
 * Gets lifecycle duration in days
 */
export declare function getLifecycleDuration(lifecycle: DocumentLifecycle): number;
/**
 * Gets documents eligible for archival
 */
export declare function getDocumentsEligibleForArchival(lifecycles: DocumentLifecycle[], inactiveDaysThreshold?: number): DocumentLifecycle[];
/**
 * Tracks lifecycle event
 */
export declare function trackLifecycleEvent(lifecycle: DocumentLifecycle, event: LifecycleEvent): DocumentLifecycle;
/**
 * Creates retention compliance record
 */
export declare function createRetentionCompliance(documentId: string, scheduleId: string): RetentionCompliance;
/**
 * Audits document retention compliance
 */
export declare function auditRetentionCompliance(document: DocumentRecord, schedule: RetentionSchedule, lifecycle: DocumentLifecycle): ComplianceStatus;
/**
 * Adds compliance violation
 */
export declare function addComplianceViolation(compliance: RetentionCompliance, violation: ComplianceViolation): RetentionCompliance;
/**
 * Creates correction action
 */
export declare function createCorrectionAction(compliance: RetentionCompliance, action: CorrectionAction): RetentionCompliance;
/**
 * Verifies compliance remediation
 */
export declare function verifyComplianceRemediation(compliance: RetentionCompliance, verifiedBy: string): RetentionCompliance;
/**
 * Creates a disposal workflow
 */
export declare function createDisposalWorkflow(params: {
    documentIds: string[];
    requestedBy: string;
    disposalMethod: DisposalMethod;
    approvalRequired?: boolean;
}): DisposalWorkflow;
/**
 * Approves disposal workflow
 */
export declare function approveDisposalWorkflow(workflow: DisposalWorkflow, approvedBy: string): DisposalWorkflow;
/**
 * Schedules disposal execution
 */
export declare function scheduleDisposal(workflow: DisposalWorkflow, scheduledDate: Date): DisposalWorkflow;
/**
 * Executes disposal
 */
export declare function executeDisposal(workflow: DisposalWorkflow, executedBy: string, witnessedBy: string[]): DisposalWorkflow;
/**
 * Generates certificate of destruction number
 */
export declare function generateCertificateOfDestruction(): string;
/**
 * Validates disposal eligibility
 */
export declare function validateDisposalEligibility(document: DocumentRecord, lifecycle: DocumentLifecycle): {
    eligible: boolean;
    reason?: string;
};
/**
 * Creates a legal hold
 */
export declare function createLegalHold(params: {
    holdName: string;
    caseNumber?: string;
    description: string;
    issuedBy: string;
    affectedDocuments: string[];
    custodians: string[];
    preservationInstructions: string;
}): LegalHold;
/**
 * Applies legal hold to documents
 */
export declare function applyLegalHold(lifecycle: DocumentLifecycle, legalHoldId: string): DocumentLifecycle;
/**
 * Releases legal hold
 */
export declare function releaseLegalHold(hold: LegalHold, releasedBy: string): LegalHold;
/**
 * Adds documents to legal hold
 */
export declare function addDocumentsToLegalHold(hold: LegalHold, documentIds: string[]): LegalHold;
/**
 * Gets active legal holds for document
 */
export declare function getActiveLegalHolds(documentId: string, allHolds: LegalHold[]): LegalHold[];
/**
 * Creates a new document version
 */
export declare function createDocumentVersion(params: {
    documentId: string;
    versionNumber: string;
    action: VersionAction;
    createdBy: string;
    changeDescription: string;
    filePath: string;
    fileSize: number;
    previousVersionId?: string;
}): DocumentVersion;
/**
 * Calculates file checksum (SHA-256)
 */
export declare function calculateChecksum(filePath: string): string;
/**
 * Gets version history
 */
export declare function getVersionHistory(versions: DocumentVersion[], documentId: string): DocumentVersion[];
/**
 * Restores previous version
 */
export declare function restorePreviousVersion(currentVersion: DocumentVersion, restoredBy: string): DocumentVersion;
/**
 * Compares two versions
 */
export declare function compareVersions(version1: DocumentVersion, version2: DocumentVersion): {
    checksumMatch: boolean;
    sizeChange: number;
};
/**
 * Updates document metadata
 */
export declare function updateDocumentMetadata(document: DocumentRecord, metadata: Partial<DocumentMetadata>): DocumentRecord;
/**
 * Adds custom metadata field
 */
export declare function addCustomMetadataField(metadata: DocumentMetadata, fieldName: string, fieldValue: any): DocumentMetadata;
/**
 * Validates metadata completeness
 */
export declare function validateMetadataCompleteness(metadata: DocumentMetadata, requiredFields: string[]): {
    complete: boolean;
    missingFields: string[];
};
/**
 * Extracts metadata from file
 */
export declare function extractMetadataFromFile(filePath: string): Partial<DocumentMetadata>;
/**
 * Searches documents by criteria
 */
export declare function searchDocuments(documents: DocumentRecord[], criteria: DocumentSearchCriteria): DocumentRecord[];
/**
 * Retrieves document by number
 */
export declare function retrieveDocumentByNumber(documents: DocumentRecord[], documentNumber: string): DocumentRecord | undefined;
/**
 * Gets related documents
 */
export declare function getRelatedDocuments(document: DocumentRecord, allDocuments: DocumentRecord[]): DocumentRecord[];
/**
 * Builds search index
 */
export declare function buildSearchIndex(documents: DocumentRecord[]): Record<string, string[]>;
/**
 * Creates ERM policy
 */
export declare function createERMPolicy(params: {
    policyName: string;
    policyNumber: string;
    description: string;
    effectiveDate: Date;
    requirements: PolicyRequirement[];
    applicableAgencies: string[];
    approvedBy: string;
    reviewFrequencyMonths: number;
}): ERMPolicy;
/**
 * Validates document against ERM policy
 */
export declare function validateAgainstERMPolicy(document: DocumentRecord, policy: ERMPolicy): {
    compliant: boolean;
    violations: string[];
};
/**
 * Gets ERM policy compliance rate
 */
export declare function calculateERMComplianceRate(documents: DocumentRecord[], policy: ERMPolicy): number;
/**
 * Creates document archive
 */
export declare function createDocumentArchive(params: {
    archiveName: string;
    description: string;
    documentIds: string[];
    archivedBy: string;
    storageLocation: string;
    archiveType: 'physical' | 'electronic' | 'hybrid';
    retrievalInstructions?: string;
}): DocumentArchive;
/**
 * Archives documents
 */
export declare function archiveDocuments(documents: DocumentRecord[], archive: DocumentArchive): DocumentRecord[];
/**
 * Retrieves archived documents
 */
export declare function retrieveArchivedDocuments(archive: DocumentArchive, allDocuments: DocumentRecord[]): DocumentRecord[];
/**
 * Enforces retention policy across documents
 */
export declare function enforceRetentionPolicy(documents: DocumentRecord[], schedules: RetentionSchedule[], lifecycles: DocumentLifecycle[]): {
    eligible: string[];
    notEligible: string[];
    onHold: string[];
};
/**
 * Generates retention policy report
 */
export declare function generateRetentionPolicyReport(params: {
    documents: DocumentRecord[];
    schedules: RetentionSchedule[];
    lifecycles: DocumentLifecycle[];
    compliance: RetentionCompliance[];
}): {
    totalDocuments: number;
    compliantDocuments: number;
    nonCompliantDocuments: number;
    documentsOnHold: number;
    eligibleForDisposal: number;
    complianceRate: number;
};
/**
 * Sequelize model for DocumentRecord
 */
export declare const DocumentRecordModel: {
    tableName: string;
    columns: {
        id: {
            type: string;
            primaryKey: boolean;
            defaultValue: string;
        };
        documentNumber: {
            type: string;
            allowNull: boolean;
            unique: boolean;
        };
        title: {
            type: string;
            allowNull: boolean;
        };
        description: {
            type: string;
            allowNull: boolean;
        };
        documentType: {
            type: string;
            values: DocumentType[];
        };
        classification: {
            type: string;
            values: DocumentClassification[];
        };
        status: {
            type: string;
            values: DocumentStatus[];
        };
        lifecycleStage: {
            type: string;
            values: LifecycleStage[];
        };
        createdBy: {
            type: string;
            allowNull: boolean;
        };
        createdDate: {
            type: string;
            allowNull: boolean;
        };
        modifiedBy: {
            type: string;
            allowNull: boolean;
        };
        modifiedDate: {
            type: string;
            allowNull: boolean;
        };
        departmentId: {
            type: string;
            allowNull: boolean;
        };
        agencyId: {
            type: string;
            allowNull: boolean;
        };
        retentionScheduleId: {
            type: string;
            allowNull: boolean;
        };
        disposalDate: {
            type: string;
            allowNull: boolean;
        };
        filePath: {
            type: string;
            allowNull: boolean;
        };
        fileSize: {
            type: string;
            allowNull: boolean;
        };
        mimeType: {
            type: string;
            allowNull: boolean;
        };
        metadata: {
            type: string;
            defaultValue: {};
        };
        tags: {
            type: string;
            defaultValue: never[];
        };
        relatedDocuments: {
            type: string;
            defaultValue: never[];
        };
    };
    indexes: {
        fields: string[];
    }[];
};
/**
 * Sequelize model for RetentionSchedule
 */
export declare const RetentionScheduleModel: {
    tableName: string;
    columns: {
        id: {
            type: string;
            primaryKey: boolean;
            defaultValue: string;
        };
        scheduleCode: {
            type: string;
            allowNull: boolean;
            unique: boolean;
        };
        recordSeries: {
            type: string;
            allowNull: boolean;
        };
        description: {
            type: string;
            allowNull: boolean;
        };
        retentionType: {
            type: string;
            values: RetentionScheduleType[];
        };
        retentionPeriodYears: {
            type: string;
            allowNull: boolean;
        };
        eventTrigger: {
            type: string;
            allowNull: boolean;
        };
        disposalMethod: {
            type: string;
            values: DisposalMethod[];
        };
        legalAuthority: {
            type: string;
            allowNull: boolean;
        };
        applicableDocumentTypes: {
            type: string;
            defaultValue: never[];
        };
        active: {
            type: string;
            defaultValue: boolean;
        };
        approvedBy: {
            type: string;
            allowNull: boolean;
        };
        approvalDate: {
            type: string;
            allowNull: boolean;
        };
        reviewDate: {
            type: string;
            allowNull: boolean;
        };
        notes: {
            type: string;
            allowNull: boolean;
        };
        metadata: {
            type: string;
            defaultValue: {};
        };
    };
    indexes: {
        fields: string[];
    }[];
};
/**
 * Sequelize model for DocumentLifecycle
 */
export declare const DocumentLifecycleModel: {
    tableName: string;
    columns: {
        id: {
            type: string;
            primaryKey: boolean;
            defaultValue: string;
        };
        documentId: {
            type: string;
            allowNull: boolean;
        };
        currentStage: {
            type: string;
            values: LifecycleStage[];
        };
        stageHistory: {
            type: string;
            defaultValue: never[];
        };
        retentionStartDate: {
            type: string;
            allowNull: boolean;
        };
        retentionEndDate: {
            type: string;
            allowNull: boolean;
        };
        disposalEligibilityDate: {
            type: string;
            allowNull: boolean;
        };
        legalHoldApplied: {
            type: string;
            defaultValue: boolean;
        };
        lastReviewDate: {
            type: string;
            allowNull: boolean;
        };
        nextReviewDate: {
            type: string;
            allowNull: boolean;
        };
        archivalDate: {
            type: string;
            allowNull: boolean;
        };
        metadata: {
            type: string;
            defaultValue: {};
        };
    };
    indexes: {
        fields: string[];
    }[];
};
/**
 * Sequelize model for LegalHold
 */
export declare const LegalHoldModel: {
    tableName: string;
    columns: {
        id: {
            type: string;
            primaryKey: boolean;
            defaultValue: string;
        };
        holdName: {
            type: string;
            allowNull: boolean;
        };
        caseNumber: {
            type: string;
            allowNull: boolean;
        };
        description: {
            type: string;
            allowNull: boolean;
        };
        issuedBy: {
            type: string;
            allowNull: boolean;
        };
        issuedDate: {
            type: string;
            allowNull: boolean;
        };
        status: {
            type: string;
            values: LegalHoldStatus[];
        };
        affectedDocuments: {
            type: string;
            defaultValue: never[];
        };
        custodians: {
            type: string;
            defaultValue: never[];
        };
        releaseDate: {
            type: string;
            allowNull: boolean;
        };
        releasedBy: {
            type: string;
            allowNull: boolean;
        };
        expirationDate: {
            type: string;
            allowNull: boolean;
        };
        preservationInstructions: {
            type: string;
            allowNull: boolean;
        };
        metadata: {
            type: string;
            defaultValue: {};
        };
    };
    indexes: {
        fields: string[];
    }[];
};
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
export declare const DocumentManagementServiceExample = "\n@Injectable()\nexport class DocumentManagementService {\n  constructor(\n    @InjectModel(DocumentRecordModel)\n    private documentRepo: Repository<DocumentRecord>,\n    @InjectModel(RetentionScheduleModel)\n    private scheduleRepo: Repository<RetentionSchedule>,\n    @InjectModel(DocumentLifecycleModel)\n    private lifecycleRepo: Repository<DocumentLifecycle>,\n    @InjectModel(LegalHoldModel)\n    private legalHoldRepo: Repository<LegalHold>,\n  ) {}\n\n  async createDocument(dto: CreateDocumentDto): Promise<DocumentRecord> {\n    const document = createDocumentRecord(dto);\n    const lifecycle = createDocumentLifecycle(document.id, new Date());\n\n    await this.documentRepo.save(document);\n    await this.lifecycleRepo.save(lifecycle);\n\n    return document;\n  }\n\n  async enforceRetentionPolicies(): Promise<void> {\n    const documents = await this.documentRepo.find();\n    const schedules = await this.scheduleRepo.find({ where: { active: true } });\n    const lifecycles = await this.lifecycleRepo.find();\n\n    const enforcement = enforceRetentionPolicy(documents, schedules, lifecycles);\n\n    // Process eligible documents for disposal\n    for (const docId of enforcement.eligible) {\n      const workflow = createDisposalWorkflow({\n        documentIds: [docId],\n        requestedBy: 'system',\n        disposalMethod: DisposalMethod.SECURE_SHREDDING,\n      });\n      // Save workflow for approval\n    }\n  }\n}\n";
/**
 * Swagger DTO for creating document record
 */
export declare const CreateDocumentRecordDto: {
    schema: {
        type: string;
        required: string[];
        properties: {
            title: {
                type: string;
                example: string;
            };
            description: {
                type: string;
                example: string;
            };
            documentType: {
                type: string;
                enum: DocumentType[];
            };
            classification: {
                type: string;
                enum: DocumentClassification[];
            };
            createdBy: {
                type: string;
                example: string;
            };
            departmentId: {
                type: string;
                format: string;
            };
            agencyId: {
                type: string;
                format: string;
            };
            retentionScheduleId: {
                type: string;
                format: string;
            };
            metadata: {
                type: string;
                properties: {
                    author: {
                        type: string;
                    };
                    subject: {
                        type: string;
                    };
                    keywords: {
                        type: string;
                        items: {
                            type: string;
                        };
                    };
                    fiscalYear: {
                        type: string;
                    };
                };
            };
        };
    };
};
/**
 * Swagger DTO for retention schedule
 */
export declare const CreateRetentionScheduleDto: {
    schema: {
        type: string;
        required: string[];
        properties: {
            scheduleCode: {
                type: string;
                example: string;
            };
            recordSeries: {
                type: string;
                example: string;
            };
            description: {
                type: string;
                example: string;
            };
            retentionType: {
                type: string;
                enum: RetentionScheduleType[];
            };
            retentionPeriodYears: {
                type: string;
                example: number;
            };
            eventTrigger: {
                type: string;
                example: string;
            };
            disposalMethod: {
                type: string;
                enum: DisposalMethod[];
            };
            legalAuthority: {
                type: string;
                example: string;
            };
            applicableDocumentTypes: {
                type: string;
                items: {
                    type: string;
                    enum: DocumentType[];
                };
            };
            approvedBy: {
                type: string;
                example: string;
            };
        };
    };
};
/**
 * Swagger DTO for legal hold
 */
export declare const CreateLegalHoldDto: {
    schema: {
        type: string;
        required: string[];
        properties: {
            holdName: {
                type: string;
                example: string;
            };
            caseNumber: {
                type: string;
                example: string;
            };
            description: {
                type: string;
                example: string;
            };
            issuedBy: {
                type: string;
                example: string;
            };
            affectedDocuments: {
                type: string;
                items: {
                    type: string;
                    format: string;
                };
            };
            custodians: {
                type: string;
                items: {
                    type: string;
                };
            };
            preservationInstructions: {
                type: string;
                example: string;
            };
        };
    };
};
/**
 * Swagger response schema for retention policy report
 */
export declare const RetentionPolicyReportResponse: {
    schema: {
        type: string;
        properties: {
            totalDocuments: {
                type: string;
                example: number;
            };
            compliantDocuments: {
                type: string;
                example: number;
            };
            nonCompliantDocuments: {
                type: string;
                example: number;
            };
            documentsOnHold: {
                type: string;
                example: number;
            };
            eligibleForDisposal: {
                type: string;
                example: number;
            };
            complianceRate: {
                type: string;
                example: number;
            };
        };
    };
};
//# sourceMappingURL=document-management-retention-kit.d.ts.map