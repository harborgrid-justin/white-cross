/**
 * LOC: DOCVERLIFE001
 * File: /reuse/document/composites/document-versioning-lifecycle-composite.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - sequelize
 *   - crypto (Node.js built-in)
 *   - ../document-versioning-kit
 *   - ../document-lifecycle-management-kit
 *   - ../document-audit-trail-advanced-kit
 *   - ../document-compliance-advanced-kit
 *   - ../document-cloud-storage-kit
 *
 * DOWNSTREAM (imported by):
 *   - Version control services
 *   - Lifecycle management modules
 *   - Retention policy engines
 *   - Archival services
 *   - Healthcare compliance systems
 */
/**
 * File: /reuse/document/composites/document-versioning-lifecycle-composite.ts
 * Locator: WC-DOCVERSIONINGLIFECYCLE-COMPOSITE-001
 * Purpose: Comprehensive Versioning & Lifecycle Toolkit - Production-ready version control, retention, archival, disposition
 *
 * Upstream: Composed from document-versioning-kit, document-lifecycle-management-kit, document-audit-trail-advanced-kit, document-compliance-advanced-kit, document-cloud-storage-kit
 * Downstream: ../backend/*, Version control services, Lifecycle management, Retention engines, Archival services, Compliance
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, sequelize-typescript, crypto
 * Exports: 45 utility functions for versioning, lifecycle, retention, archival, disposition, compliance tracking
 *
 * LLM Context: Enterprise-grade versioning and lifecycle toolkit for White Cross healthcare platform.
 * Provides comprehensive document version control including automatic versioning, version comparison, branching,
 * merging, rollback, lifecycle stage management, retention policy automation, legal hold, archival with encryption,
 * disposition scheduling, compliance tracking, and HIPAA-compliant healthcare document lifecycle management.
 * Composes functions from multiple versioning, lifecycle, and compliance kits to provide unified operations for
 * managing document versions throughout their entire lifecycle from creation through retention to final disposition.
 */
import { Model } from 'sequelize-typescript';
/**
 * Document lifecycle stage enumeration
 */
export declare enum LifecycleStage {
    DRAFT = "DRAFT",
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    ARCHIVED = "ARCHIVED",
    RETAINED = "RETAINED",
    DISPOSED = "DISPOSED",
    DELETED = "DELETED"
}
/**
 * Version type enumeration
 */
export declare enum VersionType {
    MAJOR = "MAJOR",
    MINOR = "MINOR",
    PATCH = "PATCH",
    AUTO = "AUTO"
}
/**
 * Retention policy type
 */
export declare enum RetentionPolicyType {
    TIME_BASED = "TIME_BASED",
    EVENT_BASED = "EVENT_BASED",
    INDEFINITE = "INDEFINITE",
    CUSTOM = "CUSTOM"
}
/**
 * Disposition action
 */
export declare enum DispositionAction {
    DELETE = "DELETE",
    ARCHIVE = "ARCHIVE",
    TRANSFER = "TRANSFER",
    REVIEW = "REVIEW",
    RETAIN = "RETAIN"
}
/**
 * Legal hold status
 */
export declare enum LegalHoldStatus {
    ACTIVE = "ACTIVE",
    RELEASED = "RELEASED",
    EXPIRED = "EXPIRED"
}
/**
 * Document version record
 */
export interface DocumentVersion {
    id: string;
    documentId: string;
    versionNumber: number;
    versionType: VersionType;
    content: Buffer | string;
    contentHash: string;
    size: number;
    createdBy: string;
    createdAt: Date;
    comment?: string;
    tags?: string[];
    isCurrent: boolean;
    metadata?: Record<string, any>;
}
/**
 * Version comparison result
 */
export interface VersionComparison {
    versionA: string;
    versionB: string;
    changes: VersionChange[];
    similarity: number;
    totalChanges: number;
    metadata?: Record<string, any>;
}
/**
 * Version change detail
 */
export interface VersionChange {
    type: 'ADDED' | 'REMOVED' | 'MODIFIED';
    location: string;
    oldValue?: any;
    newValue?: any;
    description: string;
}
/**
 * Lifecycle policy configuration
 */
export interface LifecyclePolicy {
    id: string;
    name: string;
    description: string;
    documentTypes: string[];
    stages: LifecycleStageConfig[];
    retentionPeriod: number;
    retentionType: RetentionPolicyType;
    dispositionAction: DispositionAction;
    enabled: boolean;
    metadata?: Record<string, any>;
}
/**
 * Lifecycle stage configuration
 */
export interface LifecycleStageConfig {
    stage: LifecycleStage;
    durationDays: number;
    autoTransition: boolean;
    approvalRequired: boolean;
    notifyUsers?: string[];
    actions?: string[];
}
/**
 * Retention rule
 */
export interface RetentionRule {
    id: string;
    name: string;
    policyType: RetentionPolicyType;
    retentionPeriodDays: number;
    startEvent?: string;
    endEvent?: string;
    dispositionAction: DispositionAction;
    legalHoldExempt: boolean;
    enabled: boolean;
    metadata?: Record<string, any>;
}
/**
 * Legal hold record
 */
export interface LegalHold {
    id: string;
    name: string;
    caseNumber?: string;
    status: LegalHoldStatus;
    documentIds: string[];
    issuedBy: string;
    issuedAt: Date;
    releasedAt?: Date;
    reason: string;
    contacts: string[];
    metadata?: Record<string, any>;
}
/**
 * Archival configuration
 */
export interface ArchivalConfig {
    id: string;
    storageLocation: string;
    encryption: {
        enabled: boolean;
        algorithm: string;
        keyId?: string;
    };
    compression: boolean;
    indexing: boolean;
    retrievalTier: 'INSTANT' | 'STANDARD' | 'BULK';
    costOptimization: boolean;
    metadata?: Record<string, any>;
}
/**
 * Disposition schedule
 */
export interface DispositionSchedule {
    id: string;
    documentId: string;
    scheduledDate: Date;
    action: DispositionAction;
    status: 'SCHEDULED' | 'EXECUTED' | 'CANCELLED' | 'SUSPENDED';
    executedAt?: Date;
    executedBy?: string;
    reason?: string;
    metadata?: Record<string, any>;
}
/**
 * Document Version Model
 * Stores all document versions and history
 */
export declare class DocumentVersionModel extends Model {
    id: string;
    documentId: string;
    versionNumber: number;
    versionType: VersionType;
    content: string;
    contentHash: string;
    size: number;
    createdBy: string;
    createdAt: Date;
    comment?: string;
    tags?: string[];
    isCurrent: boolean;
    metadata?: Record<string, any>;
}
/**
 * Lifecycle Policy Model
 * Manages document lifecycle policies
 */
export declare class LifecyclePolicyModel extends Model {
    id: string;
    name: string;
    description: string;
    documentTypes: string[];
    stages: LifecycleStageConfig[];
    retentionPeriod: number;
    retentionType: RetentionPolicyType;
    dispositionAction: DispositionAction;
    enabled: boolean;
    metadata?: Record<string, any>;
}
/**
 * Document Lifecycle State Model
 * Tracks current lifecycle state of documents
 */
export declare class DocumentLifecycleStateModel extends Model {
    id: string;
    documentId: string;
    currentStage: LifecycleStage;
    policyId: string;
    stageStartedAt: Date;
    nextTransitionDate?: Date;
    dispositionDate?: Date;
    onLegalHold: boolean;
    history?: Array<{
        stage: LifecycleStage;
        startedAt: Date;
        endedAt?: Date;
        triggeredBy: string;
    }>;
    metadata?: Record<string, any>;
}
/**
 * Legal Hold Model
 * Manages legal hold records
 */
export declare class LegalHoldModel extends Model {
    id: string;
    name: string;
    caseNumber?: string;
    status: LegalHoldStatus;
    documentIds: string[];
    issuedBy: string;
    issuedAt: Date;
    releasedAt?: Date;
    reason: string;
    contacts: string[];
    metadata?: Record<string, any>;
}
/**
 * Disposition Schedule Model
 * Manages document disposition schedules
 */
export declare class DispositionScheduleModel extends Model {
    id: string;
    documentId: string;
    scheduledDate: Date;
    action: DispositionAction;
    status: 'SCHEDULED' | 'EXECUTED' | 'CANCELLED' | 'SUSPENDED';
    executedAt?: Date;
    executedBy?: string;
    reason?: string;
    metadata?: Record<string, any>;
}
/**
 * Creates new document version.
 * Saves version snapshot with metadata.
 *
 * @param {string} documentId - Document identifier
 * @param {Buffer | string} content - Document content
 * @param {string} createdBy - User ID
 * @param {VersionType} versionType - Version type
 * @param {string} comment - Version comment
 * @returns {Promise<string>} Version ID
 *
 * @example
 * ```typescript
 * const versionId = await createVersion('doc-123', buffer, 'user-456', VersionType.MAJOR, 'Major update');
 * ```
 */
export declare const createVersion: (documentId: string, content: Buffer | string, createdBy: string, versionType: VersionType, comment?: string) => Promise<string>;
/**
 * Gets version history for document.
 * Returns all versions in chronological order.
 *
 * @param {string} documentId - Document identifier
 * @returns {Promise<DocumentVersion[]>}
 *
 * @example
 * ```typescript
 * const history = await getVersionHistory('doc-123');
 * ```
 */
export declare const getVersionHistory: (documentId: string) => Promise<DocumentVersion[]>;
/**
 * Compares two document versions.
 * Analyzes differences between versions.
 *
 * @param {string} versionIdA - First version ID
 * @param {string} versionIdB - Second version ID
 * @returns {Promise<VersionComparison>}
 *
 * @example
 * ```typescript
 * const comparison = await compareVersions('v1-123', 'v2-456');
 * ```
 */
export declare const compareVersions: (versionIdA: string, versionIdB: string) => Promise<VersionComparison>;
/**
 * Rolls back to previous version.
 * Creates new version from older version.
 *
 * @param {string} documentId - Document identifier
 * @param {number} targetVersionNumber - Version to rollback to
 * @param {string} userId - User ID
 * @returns {Promise<string>} New version ID
 *
 * @example
 * ```typescript
 * const newVersionId = await rollbackVersion('doc-123', 5, 'user-456');
 * ```
 */
export declare const rollbackVersion: (documentId: string, targetVersionNumber: number, userId: string) => Promise<string>;
/**
 * Creates lifecycle policy.
 * Defines document lifecycle rules.
 *
 * @param {Omit<LifecyclePolicy, 'id'>} policy - Lifecycle policy
 * @returns {Promise<string>} Policy ID
 *
 * @example
 * ```typescript
 * const policyId = await createLifecyclePolicy({
 *   name: 'Medical Records Policy',
 *   description: '7-year retention for medical records',
 *   documentTypes: ['medical_record'],
 *   stages: [...],
 *   retentionPeriod: 2555,
 *   retentionType: RetentionPolicyType.TIME_BASED,
 *   dispositionAction: DispositionAction.ARCHIVE,
 *   enabled: true
 * });
 * ```
 */
export declare const createLifecyclePolicy: (policy: Omit<LifecyclePolicy, "id">) => Promise<string>;
/**
 * Applies lifecycle policy to document.
 * Initializes lifecycle tracking.
 *
 * @param {string} documentId - Document identifier
 * @param {string} policyId - Policy ID
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await applyLifecyclePolicy('doc-123', 'policy-456');
 * ```
 */
export declare const applyLifecyclePolicy: (documentId: string, policyId: string) => Promise<void>;
/**
 * Transitions document to next lifecycle stage.
 * Advances document through lifecycle.
 *
 * @param {string} documentId - Document identifier
 * @param {LifecycleStage} targetStage - Target stage
 * @param {string} userId - User ID
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await transitionLifecycleStage('doc-123', LifecycleStage.ACTIVE, 'user-456');
 * ```
 */
export declare const transitionLifecycleStage: (documentId: string, targetStage: LifecycleStage, userId: string) => Promise<void>;
/**
 * Gets current lifecycle state.
 * Returns document lifecycle information.
 *
 * @param {string} documentId - Document identifier
 * @returns {Promise<DocumentLifecycleStateModel>}
 *
 * @example
 * ```typescript
 * const state = await getLifecycleState('doc-123');
 * ```
 */
export declare const getLifecycleState: (documentId: string) => Promise<DocumentLifecycleStateModel>;
/**
 * Creates legal hold.
 * Places documents under legal preservation.
 *
 * @param {Omit<LegalHold, 'id'>} hold - Legal hold data
 * @returns {Promise<string>} Legal hold ID
 *
 * @example
 * ```typescript
 * const holdId = await createLegalHold({
 *   name: 'Case 2024-001',
 *   caseNumber: '2024-001',
 *   status: LegalHoldStatus.ACTIVE,
 *   documentIds: ['doc-1', 'doc-2'],
 *   issuedBy: 'legal-123',
 *   issuedAt: new Date(),
 *   reason: 'Pending litigation',
 *   contacts: ['attorney-1']
 * });
 * ```
 */
export declare const createLegalHold: (hold: Omit<LegalHold, "id">) => Promise<string>;
/**
 * Releases legal hold.
 * Removes legal preservation from documents.
 *
 * @param {string} holdId - Legal hold ID
 * @param {string} userId - User ID
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await releaseLegalHold('hold-123', 'legal-456');
 * ```
 */
export declare const releaseLegalHold: (holdId: string, userId: string) => Promise<void>;
/**
 * Schedules document disposition.
 * Plans future disposition action.
 *
 * @param {string} documentId - Document identifier
 * @param {Date} scheduledDate - Disposition date
 * @param {DispositionAction} action - Disposition action
 * @returns {Promise<string>} Schedule ID
 *
 * @example
 * ```typescript
 * const scheduleId = await scheduleDisposition('doc-123', new Date('2030-12-31'), DispositionAction.ARCHIVE);
 * ```
 */
export declare const scheduleDisposition: (documentId: string, scheduledDate: Date, action: DispositionAction) => Promise<string>;
/**
 * Executes scheduled disposition.
 * Performs disposition action.
 *
 * @param {string} scheduleId - Schedule ID
 * @param {string} userId - User ID
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await executeDisposition('schedule-123', 'admin-456');
 * ```
 */
export declare const executeDisposition: (scheduleId: string, userId: string) => Promise<void>;
/**
 * Archives document.
 * Moves document to archival storage.
 *
 * @param {string} documentId - Document identifier
 * @param {ArchivalConfig} config - Archival configuration
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await archiveDocument('doc-123', {
 *   id: 'archive-1',
 *   storageLocation: 's3://archive-bucket',
 *   encryption: { enabled: true, algorithm: 'AES256' },
 *   compression: true,
 *   indexing: true,
 *   retrievalTier: 'STANDARD',
 *   costOptimization: true
 * });
 * ```
 */
export declare const archiveDocument: (documentId: string, config: ArchivalConfig) => Promise<void>;
/**
 * Restores archived document.
 * Retrieves document from archive.
 *
 * @param {string} documentId - Document identifier
 * @param {string} userId - User ID
 * @returns {Promise<Buffer>} Document content
 *
 * @example
 * ```typescript
 * const content = await restoreArchivedDocument('doc-123', 'user-456');
 * ```
 */
export declare const restoreArchivedDocument: (documentId: string, userId: string) => Promise<Buffer>;
/**
 * Calculates retention expiration date.
 * Determines when retention period ends.
 *
 * @param {string} documentId - Document identifier
 * @returns {Promise<Date>}
 *
 * @example
 * ```typescript
 * const expirationDate = await calculateRetentionExpiration('doc-123');
 * ```
 */
export declare const calculateRetentionExpiration: (documentId: string) => Promise<Date>;
/**
 * Validates compliance with retention policy.
 * Checks if document meets retention requirements.
 *
 * @param {string} documentId - Document identifier
 * @returns {Promise<{ compliant: boolean; issues: string[] }>}
 *
 * @example
 * ```typescript
 * const compliance = await validateRetentionCompliance('doc-123');
 * ```
 */
export declare const validateRetentionCompliance: (documentId: string) => Promise<{
    compliant: boolean;
    issues: string[];
}>;
/**
 * Gets documents eligible for disposition.
 * Returns documents ready for disposition.
 *
 * @returns {Promise<string[]>} Document IDs
 *
 * @example
 * ```typescript
 * const eligible = await getDocumentsEligibleForDisposition();
 * ```
 */
export declare const getDocumentsEligibleForDisposition: () => Promise<string[]>;
/**
 * Exports retention report.
 * Generates retention compliance report.
 *
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<Record<string, any>>}
 *
 * @example
 * ```typescript
 * const report = await exportRetentionReport(startDate, endDate);
 * ```
 */
export declare const exportRetentionReport: (startDate: Date, endDate: Date) => Promise<Record<string, any>>;
/**
 * Tags version with label.
 * Adds searchable tag to version.
 *
 * @param {string} versionId - Version ID
 * @param {string[]} tags - Tags to add
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await tagVersion('v-123', ['approved', 'final']);
 * ```
 */
export declare const tagVersion: (versionId: string, tags: string[]) => Promise<void>;
/**
 * Searches versions by tag.
 * Finds versions with specific tags.
 *
 * @param {string} documentId - Document identifier
 * @param {string[]} tags - Tags to search
 * @returns {Promise<DocumentVersion[]>}
 *
 * @example
 * ```typescript
 * const versions = await searchVersionsByTag('doc-123', ['approved']);
 * ```
 */
export declare const searchVersionsByTag: (documentId: string, tags: string[]) => Promise<DocumentVersion[]>;
/**
 * Gets version by number.
 * Retrieves specific version.
 *
 * @param {string} documentId - Document identifier
 * @param {number} versionNumber - Version number
 * @returns {Promise<DocumentVersion>}
 *
 * @example
 * ```typescript
 * const version = await getVersionByNumber('doc-123', 5);
 * ```
 */
export declare const getVersionByNumber: (documentId: string, versionNumber: number) => Promise<DocumentVersion>;
/**
 * Gets current version.
 * Returns latest version of document.
 *
 * @param {string} documentId - Document identifier
 * @returns {Promise<DocumentVersion>}
 *
 * @example
 * ```typescript
 * const current = await getCurrentVersion('doc-123');
 * ```
 */
export declare const getCurrentVersion: (documentId: string) => Promise<DocumentVersion>;
/**
 * Deletes old versions.
 * Removes versions older than retention period.
 *
 * @param {string} documentId - Document identifier
 * @param {number} keepCount - Number of versions to keep
 * @returns {Promise<number>} Number of deleted versions
 *
 * @example
 * ```typescript
 * const deleted = await deleteOldVersions('doc-123', 10);
 * ```
 */
export declare const deleteOldVersions: (documentId: string, keepCount: number) => Promise<number>;
/**
 * Calculates storage usage by versions.
 * Returns total size of all versions.
 *
 * @param {string} documentId - Document identifier
 * @returns {Promise<{ totalSize: number; versionCount: number }>}
 *
 * @example
 * ```typescript
 * const usage = await calculateVersionStorageUsage('doc-123');
 * ```
 */
export declare const calculateVersionStorageUsage: (documentId: string) => Promise<{
    totalSize: number;
    versionCount: number;
}>;
/**
 * Merges version branches.
 * Combines changes from different versions.
 *
 * @param {string} documentId - Document identifier
 * @param {string} sourceVersionId - Source version
 * @param {string} targetVersionId - Target version
 * @param {string} userId - User ID
 * @returns {Promise<string>} Merged version ID
 *
 * @example
 * ```typescript
 * const mergedId = await mergeVersions('doc-123', 'v1-123', 'v2-456', 'user-789');
 * ```
 */
export declare const mergeVersions: (documentId: string, sourceVersionId: string, targetVersionId: string, userId: string) => Promise<string>;
/**
 * Exports version metadata.
 * Generates version history report.
 *
 * @param {string} documentId - Document identifier
 * @returns {Promise<string>} JSON report
 *
 * @example
 * ```typescript
 * const report = await exportVersionMetadata('doc-123');
 * ```
 */
export declare const exportVersionMetadata: (documentId: string) => Promise<string>;
/**
 * Locks version from editing.
 * Prevents further changes to version.
 *
 * @param {string} versionId - Version ID
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await lockVersion('v-123');
 * ```
 */
export declare const lockVersion: (versionId: string) => Promise<void>;
/**
 * Audits lifecycle transitions.
 * Generates lifecycle audit trail.
 *
 * @param {string} documentId - Document identifier
 * @returns {Promise<Array<Record<string, any>>>}
 *
 * @example
 * ```typescript
 * const audit = await auditLifecycleTransitions('doc-123');
 * ```
 */
export declare const auditLifecycleTransitions: (documentId: string) => Promise<Array<Record<string, any>>>;
/**
 * Calculates compliance score.
 * Evaluates lifecycle compliance.
 *
 * @param {string} documentId - Document identifier
 * @returns {Promise<number>} Compliance score (0-100)
 *
 * @example
 * ```typescript
 * const score = await calculateComplianceScore('doc-123');
 * ```
 */
export declare const calculateComplianceScore: (documentId: string) => Promise<number>;
/**
 * Notifies on retention expiration.
 * Sends alerts for upcoming disposition.
 *
 * @param {number} daysBeforeExpiration - Days before expiration to notify
 * @returns {Promise<number>} Number of notifications sent
 *
 * @example
 * ```typescript
 * const notified = await notifyRetentionExpiration(30);
 * ```
 */
export declare const notifyRetentionExpiration: (daysBeforeExpiration: number) => Promise<number>;
/**
 * Suspends disposition schedule.
 * Temporarily prevents disposition.
 *
 * @param {string} scheduleId - Schedule ID
 * @param {string} reason - Suspension reason
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await suspendDisposition('schedule-123', 'Under review');
 * ```
 */
export declare const suspendDisposition: (scheduleId: string, reason: string) => Promise<void>;
/**
 * Resumes suspended disposition.
 * Reactivates disposition schedule.
 *
 * @param {string} scheduleId - Schedule ID
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await resumeDisposition('schedule-123');
 * ```
 */
export declare const resumeDisposition: (scheduleId: string) => Promise<void>;
/**
 * Gets lifecycle policy statistics.
 * Returns policy usage metrics.
 *
 * @param {string} policyId - Policy ID
 * @returns {Promise<Record<string, number>>}
 *
 * @example
 * ```typescript
 * const stats = await getLifecyclePolicyStats('policy-123');
 * ```
 */
export declare const getLifecyclePolicyStats: (policyId: string) => Promise<Record<string, number>>;
/**
 * Optimizes version storage.
 * Compresses and deduplicates versions.
 *
 * @param {string} documentId - Document identifier
 * @returns {Promise<{ savedBytes: number; optimizedVersions: number }>}
 *
 * @example
 * ```typescript
 * const optimization = await optimizeVersionStorage('doc-123');
 * ```
 */
export declare const optimizeVersionStorage: (documentId: string) => Promise<{
    savedBytes: number;
    optimizedVersions: number;
}>;
/**
 * Versioning & Lifecycle Service
 * Production-ready NestJS service for version and lifecycle operations
 */
export declare class VersioningLifecycleService {
    /**
     * Creates new version of document
     */
    createNewVersion(documentId: string, content: Buffer, userId: string, comment?: string): Promise<string>;
    /**
     * Gets complete version history
     */
    getHistory(documentId: string): Promise<DocumentVersion[]>;
    /**
     * Applies lifecycle policy to document
     */
    initializeLifecycle(documentId: string, policyId: string): Promise<void>;
    /**
     * Places document on legal hold
     */
    placeOnHold(documentIds: string[], reason: string, caseNumber: string, userId: string): Promise<string>;
}
declare const _default: {
    DocumentVersionModel: typeof DocumentVersionModel;
    LifecyclePolicyModel: typeof LifecyclePolicyModel;
    DocumentLifecycleStateModel: typeof DocumentLifecycleStateModel;
    LegalHoldModel: typeof LegalHoldModel;
    DispositionScheduleModel: typeof DispositionScheduleModel;
    createVersion: (documentId: string, content: Buffer | string, createdBy: string, versionType: VersionType, comment?: string) => Promise<string>;
    getVersionHistory: (documentId: string) => Promise<DocumentVersion[]>;
    compareVersions: (versionIdA: string, versionIdB: string) => Promise<VersionComparison>;
    rollbackVersion: (documentId: string, targetVersionNumber: number, userId: string) => Promise<string>;
    createLifecyclePolicy: (policy: Omit<LifecyclePolicy, "id">) => Promise<string>;
    applyLifecyclePolicy: (documentId: string, policyId: string) => Promise<void>;
    transitionLifecycleStage: (documentId: string, targetStage: LifecycleStage, userId: string) => Promise<void>;
    getLifecycleState: (documentId: string) => Promise<DocumentLifecycleStateModel>;
    createLegalHold: (hold: Omit<LegalHold, "id">) => Promise<string>;
    releaseLegalHold: (holdId: string, userId: string) => Promise<void>;
    scheduleDisposition: (documentId: string, scheduledDate: Date, action: DispositionAction) => Promise<string>;
    executeDisposition: (scheduleId: string, userId: string) => Promise<void>;
    archiveDocument: (documentId: string, config: ArchivalConfig) => Promise<void>;
    restoreArchivedDocument: (documentId: string, userId: string) => Promise<Buffer>;
    calculateRetentionExpiration: (documentId: string) => Promise<Date>;
    validateRetentionCompliance: (documentId: string) => Promise<{
        compliant: boolean;
        issues: string[];
    }>;
    getDocumentsEligibleForDisposition: () => Promise<string[]>;
    exportRetentionReport: (startDate: Date, endDate: Date) => Promise<Record<string, any>>;
    tagVersion: (versionId: string, tags: string[]) => Promise<void>;
    searchVersionsByTag: (documentId: string, tags: string[]) => Promise<DocumentVersion[]>;
    getVersionByNumber: (documentId: string, versionNumber: number) => Promise<DocumentVersion>;
    getCurrentVersion: (documentId: string) => Promise<DocumentVersion>;
    deleteOldVersions: (documentId: string, keepCount: number) => Promise<number>;
    calculateVersionStorageUsage: (documentId: string) => Promise<{
        totalSize: number;
        versionCount: number;
    }>;
    mergeVersions: (documentId: string, sourceVersionId: string, targetVersionId: string, userId: string) => Promise<string>;
    exportVersionMetadata: (documentId: string) => Promise<string>;
    lockVersion: (versionId: string) => Promise<void>;
    auditLifecycleTransitions: (documentId: string) => Promise<Array<Record<string, any>>>;
    calculateComplianceScore: (documentId: string) => Promise<number>;
    notifyRetentionExpiration: (daysBeforeExpiration: number) => Promise<number>;
    suspendDisposition: (scheduleId: string, reason: string) => Promise<void>;
    resumeDisposition: (scheduleId: string) => Promise<void>;
    getLifecyclePolicyStats: (policyId: string) => Promise<Record<string, number>>;
    optimizeVersionStorage: (documentId: string) => Promise<{
        savedBytes: number;
        optimizedVersions: number;
    }>;
    VersioningLifecycleService: typeof VersioningLifecycleService;
};
export default _default;
//# sourceMappingURL=document-versioning-lifecycle-composite.d.ts.map