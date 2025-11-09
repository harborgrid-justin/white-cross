/**
 * LOC: DOC-LCM-001
 * File: /reuse/document/document-lifecycle-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - sequelize (v6.x)
 *   - crypto (Node.js)
 *   - node-schedule
 *   - archiver
 *
 * DOWNSTREAM (imported by):
 *   - Document lifecycle controllers
 *   - Records management services
 *   - Compliance automation modules
 *   - Storage optimization services
 */
/**
 * File: /reuse/document/document-lifecycle-management-kit.ts
 * Locator: WC-UTL-DOCLCM-001
 * Purpose: Document Lifecycle Management Kit - Retention policies, archival, disposal automation, legal hold
 *
 * Upstream: @nestjs/common, sequelize, crypto, node-schedule, archiver
 * Downstream: Lifecycle controllers, records management, compliance services, archival handlers
 * Dependencies: NestJS 10.x, Sequelize 6.x, TypeScript 5.x, node-schedule 2.x, archiver 6.x
 * Exports: 45 utility functions for retention policies, archival workflows, disposal automation, compliance tracking, legal hold, storage optimization, lifecycle reporting
 *
 * LLM Context: Production-grade document lifecycle management utilities for White Cross healthcare platform.
 * Competes with OpenText Content Suite and M-Files intelligent information management systems.
 * Provides automated retention policy enforcement, archival workflows, secure disposal, compliance tracking,
 * legal hold management, storage optimization, and comprehensive lifecycle reporting. Essential for healthcare
 * records management, regulatory compliance (HIPAA, 21 CFR Part 11), audit trails, and long-term document
 * preservation. Supports tiered storage, automated purging, archival verification, and chain of custody.
 */
import { Sequelize, Transaction, WhereOptions, FindOptions } from 'sequelize';
/**
 * Retention policy trigger types
 */
export type RetentionTrigger = 'creation' | 'modification' | 'closure' | 'patient_discharge' | 'custom_event';
/**
 * Retention action types
 */
export type RetentionAction = 'archive' | 'delete' | 'review' | 'transfer' | 'encrypt' | 'downgrade';
/**
 * Archival storage tiers
 */
export type StorageTier = 'hot' | 'warm' | 'cold' | 'glacier' | 'deep_archive';
/**
 * Disposal methods
 */
export type DisposalMethod = 'secure_delete' | 'shred' | 'degauss' | 'incinerate' | 'certified_destruction';
/**
 * Legal hold status
 */
export type LegalHoldStatus = 'active' | 'released' | 'partial' | 'pending_review';
/**
 * Lifecycle stage
 */
export type LifecycleStage = 'active' | 'inactive' | 'archived' | 'scheduled_disposal' | 'disposed' | 'legal_hold';
/**
 * Retention policy configuration
 */
export interface RetentionPolicyConfig {
    name: string;
    description?: string;
    retentionPeriodYears: number;
    retentionPeriodMonths?: number;
    retentionPeriodDays?: number;
    trigger: RetentionTrigger;
    action: RetentionAction;
    documentTypes?: string[];
    categories?: string[];
    departments?: string[];
    priority?: number;
    autoApply?: boolean;
    requiresApproval?: boolean;
    notifyBeforeDays?: number;
}
/**
 * Archival request configuration
 */
export interface ArchivalRequest {
    documentIds: string[];
    archivalDate?: Date;
    storageTier: StorageTier;
    compressionEnabled?: boolean;
    encryptionEnabled?: boolean;
    verificationRequired?: boolean;
    metadata?: Record<string, any>;
    notifyUsers?: string[];
    scheduledDate?: Date;
}
/**
 * Disposal request configuration
 */
export interface DisposalRequest {
    documentIds: string[];
    disposalMethod: DisposalMethod;
    reason: string;
    approvedBy: string;
    scheduledDate?: Date;
    requiresCertificate?: boolean;
    witnessRequired?: boolean;
    metadata?: Record<string, any>;
}
/**
 * Legal hold configuration
 */
export interface LegalHoldConfig {
    caseIdentifier: string;
    description: string;
    documentIds?: string[];
    criteria?: WhereOptions;
    startDate: Date;
    expectedEndDate?: Date;
    responsible: string;
    department?: string;
    legalCounsel?: string;
    notifyUsers?: string[];
}
/**
 * Storage optimization configuration
 */
export interface StorageOptimizationConfig {
    targetTier?: StorageTier;
    compressionThreshold?: number;
    deduplicationEnabled?: boolean;
    archivalAge?: number;
    minAccessCount?: number;
    estimateOnly?: boolean;
}
/**
 * Lifecycle event
 */
export interface LifecycleEvent {
    documentId: string;
    eventType: string;
    stage: LifecycleStage;
    timestamp: Date;
    performedBy?: string;
    metadata?: Record<string, any>;
    previousStage?: LifecycleStage;
}
/**
 * Retention schedule
 */
export interface RetentionSchedule {
    documentId: string;
    policyId: string;
    retentionStart: Date;
    retentionEnd: Date;
    action: RetentionAction;
    status: 'pending' | 'active' | 'completed' | 'suspended';
    nextReviewDate?: Date;
}
/**
 * Archival verification result
 */
export interface ArchivalVerification {
    archiveId: string;
    verified: boolean;
    checksumMatch: boolean;
    metadataIntact: boolean;
    accessibilityConfirmed: boolean;
    issues?: string[];
    verifiedAt: Date;
    verifiedBy?: string;
}
/**
 * Disposal certificate
 */
export interface DisposalCertificate {
    certificateId: string;
    documentIds: string[];
    disposalMethod: DisposalMethod;
    disposalDate: Date;
    performedBy: string;
    witnessedBy?: string;
    location?: string;
    certificateHash: string;
    digitalSignature?: string;
}
/**
 * Storage metrics
 */
export interface StorageMetrics {
    totalDocuments: number;
    totalSizeBytes: number;
    byTier: Record<StorageTier, {
        count: number;
        sizeBytes: number;
    }>;
    byStage: Record<LifecycleStage, {
        count: number;
        sizeBytes: number;
    }>;
    compressionRatio?: number;
    deduplicationSavings?: number;
}
/**
 * Compliance audit report
 */
export interface ComplianceAuditReport {
    reportId: string;
    reportDate: Date;
    periodStart: Date;
    periodEnd: Date;
    totalDocuments: number;
    compliantDocuments: number;
    violations: Array<{
        documentId: string;
        policyId: string;
        violationType: string;
        severity: 'low' | 'medium' | 'high' | 'critical';
        description: string;
    }>;
    recommendations?: string[];
    generatedBy?: string;
}
/**
 * Chain of custody entry
 */
export interface ChainOfCustodyEntry {
    documentId: string;
    timestamp: Date;
    action: string;
    performedBy: string;
    location?: string;
    previousHash?: string;
    currentHash: string;
    metadata?: Record<string, any>;
}
/**
 * Retention policy model attributes
 */
export interface RetentionPolicyAttributes {
    id: string;
    name: string;
    description?: string;
    retentionPeriodYears: number;
    retentionPeriodMonths: number;
    retentionPeriodDays: number;
    trigger: string;
    action: string;
    documentTypes?: string[];
    categories?: string[];
    departments?: string[];
    priority: number;
    autoApply: boolean;
    requiresApproval: boolean;
    notifyBeforeDays: number;
    isActive: boolean;
    version: number;
    effectiveDate?: Date;
    expirationDate?: Date;
    createdBy?: string;
    lastModifiedBy?: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Archived document model attributes
 */
export interface ArchivedDocumentAttributes {
    id: string;
    originalDocumentId: string;
    documentName: string;
    documentType?: string;
    originalPath?: string;
    archivalPath: string;
    storageTier: string;
    archivalDate: Date;
    originalSize: number;
    compressedSize?: number;
    compressionRatio?: number;
    checksum: string;
    checksumAlgorithm: string;
    encryptionEnabled: boolean;
    encryptionAlgorithm?: string;
    retentionPolicyId?: string;
    retentionEnd?: Date;
    lastVerified?: Date;
    verificationStatus?: string;
    accessCount: number;
    lastAccessed?: Date;
    metadata?: Record<string, any>;
    isDeleted: boolean;
    createdBy?: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Disposal record model attributes
 */
export interface DisposalRecordAttributes {
    id: string;
    documentId: string;
    documentName?: string;
    documentType?: string;
    disposalMethod: string;
    disposalDate: Date;
    scheduledDate?: Date;
    reason: string;
    approvedBy: string;
    approvedAt: Date;
    performedBy?: string;
    witnessedBy?: string;
    location?: string;
    certificateId?: string;
    certificateHash?: string;
    digitalSignature?: string;
    retentionPolicyId?: string;
    metadata?: Record<string, any>;
    chainOfCustody?: Record<string, any>[];
    complianceVerified: boolean;
    verificationDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Creates RetentionPolicy model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<RetentionPolicyAttributes>>} RetentionPolicy model
 *
 * @example
 * ```typescript
 * const PolicyModel = createRetentionPolicyModel(sequelize);
 * const policy = await PolicyModel.create({
 *   name: 'Medical Records Retention',
 *   retentionPeriodYears: 7,
 *   trigger: 'patient_discharge',
 *   action: 'archive',
 *   documentTypes: ['medical_record', 'lab_result']
 * });
 * ```
 */
export declare const createRetentionPolicyModel: (sequelize: Sequelize) => any;
/**
 * Creates ArchivedDocument model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<ArchivedDocumentAttributes>>} ArchivedDocument model
 *
 * @example
 * ```typescript
 * const ArchiveModel = createArchivedDocumentModel(sequelize);
 * const archived = await ArchiveModel.create({
 *   originalDocumentId: 'doc-uuid',
 *   documentName: 'patient-record-12345.pdf',
 *   archivalPath: '/archive/2025/11/doc-uuid.zip',
 *   storageTier: 'cold',
 *   archivalDate: new Date(),
 *   originalSize: 1024000,
 *   checksum: 'sha256-hash'
 * });
 * ```
 */
export declare const createArchivedDocumentModel: (sequelize: Sequelize) => any;
/**
 * Creates DisposalRecord model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<DisposalRecordAttributes>>} DisposalRecord model
 *
 * @example
 * ```typescript
 * const DisposalModel = createDisposalRecordModel(sequelize);
 * const disposal = await DisposalModel.create({
 *   documentId: 'doc-uuid',
 *   disposalMethod: 'secure_delete',
 *   disposalDate: new Date(),
 *   reason: 'Retention period expired',
 *   approvedBy: 'admin-uuid',
 *   approvedAt: new Date()
 * });
 * ```
 */
export declare const createDisposalRecordModel: (sequelize: Sequelize) => any;
/**
 * 1. Creates a new retention policy.
 *
 * @param {RetentionPolicyConfig} config - Retention policy configuration
 * @param {string} [userId] - User creating the policy
 * @returns {Promise<RetentionPolicyAttributes>} Created policy
 *
 * @example
 * ```typescript
 * const policy = await createRetentionPolicy({
 *   name: 'Medical Records - 7 Year Retention',
 *   retentionPeriodYears: 7,
 *   trigger: 'patient_discharge',
 *   action: 'archive',
 *   documentTypes: ['medical_record', 'lab_result'],
 *   autoApply: true
 * }, 'admin-uuid');
 * ```
 */
export declare const createRetentionPolicy: (config: RetentionPolicyConfig, userId?: string) => Promise<any>;
/**
 * 2. Applies retention policy to documents.
 *
 * @param {string} policyId - Retention policy ID
 * @param {string[]} documentIds - Document IDs to apply policy to
 * @param {Transaction} [transaction] - Database transaction
 * @returns {Promise<RetentionSchedule[]>} Created retention schedules
 *
 * @example
 * ```typescript
 * const schedules = await applyRetentionPolicy(
 *   'policy-uuid',
 *   ['doc1-uuid', 'doc2-uuid', 'doc3-uuid']
 * );
 * console.log(`Applied policy to ${schedules.length} documents`);
 * ```
 */
export declare const applyRetentionPolicy: (policyId: string, documentIds: string[], transaction?: Transaction) => Promise<RetentionSchedule[]>;
/**
 * 3. Evaluates which policies apply to a document.
 *
 * @param {string} documentId - Document ID
 * @param {Record<string, any>} documentMetadata - Document metadata
 * @returns {Promise<RetentionPolicyAttributes[]>} Applicable policies
 *
 * @example
 * ```typescript
 * const policies = await evaluatePoliciesForDocument('doc-uuid', {
 *   documentType: 'medical_record',
 *   category: 'patient_care',
 *   department: 'cardiology'
 * });
 * console.log(`${policies.length} policies apply to this document`);
 * ```
 */
export declare const evaluatePoliciesForDocument: (documentId: string, documentMetadata: Record<string, any>) => Promise<any[]>;
/**
 * 4. Calculates retention end date for document.
 *
 * @param {Date} triggerDate - Date when retention period starts
 * @param {RetentionPolicyAttributes} policy - Retention policy
 * @returns {Date} Retention end date
 *
 * @example
 * ```typescript
 * const endDate = calculateRetentionEndDate(
 *   new Date('2025-01-01'),
 *   { retentionPeriodYears: 7, retentionPeriodMonths: 6, retentionPeriodDays: 15 }
 * );
 * console.log('Retention ends:', endDate);
 * ```
 */
export declare const calculateRetentionEndDate: (triggerDate: Date, policy: Partial<RetentionPolicyAttributes>) => Date;
/**
 * 5. Updates retention policy with version control.
 *
 * @param {string} policyId - Policy ID to update
 * @param {Partial<RetentionPolicyConfig>} updates - Policy updates
 * @param {string} [userId] - User making the update
 * @returns {Promise<RetentionPolicyAttributes>} Updated policy
 *
 * @example
 * ```typescript
 * const updated = await updateRetentionPolicy('policy-uuid', {
 *   retentionPeriodYears: 10,
 *   notifyBeforeDays: 60
 * }, 'admin-uuid');
 * console.log('Policy version:', updated.version);
 * ```
 */
export declare const updateRetentionPolicy: (policyId: string, updates: Partial<RetentionPolicyConfig>, userId?: string) => Promise<any>;
/**
 * 6. Deactivates retention policy.
 *
 * @param {string} policyId - Policy ID to deactivate
 * @param {string} [reason] - Reason for deactivation
 * @param {string} [userId] - User deactivating policy
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await deactivateRetentionPolicy(
 *   'policy-uuid',
 *   'Replaced by updated policy',
 *   'admin-uuid'
 * );
 * ```
 */
export declare const deactivateRetentionPolicy: (policyId: string, reason?: string, userId?: string) => Promise<void>;
/**
 * 7. Finds documents matching retention criteria.
 *
 * @param {WhereOptions} criteria - Search criteria
 * @param {FindOptions} [options] - Additional query options
 * @returns {Promise<Array<{ documentId: string; metadata: Record<string, any> }>>} Matching documents
 *
 * @example
 * ```typescript
 * const documents = await findDocumentsByCriteria({
 *   documentType: 'medical_record',
 *   createdAt: { [Op.lte]: new Date('2018-01-01') }
 * }, { limit: 100 });
 * ```
 */
export declare const findDocumentsByCriteria: (criteria: WhereOptions, options?: FindOptions) => Promise<Array<{
    documentId: string;
    metadata: Record<string, any>;
}>>;
/**
 * 8. Archives documents to specified storage tier.
 *
 * @param {ArchivalRequest} request - Archival request
 * @param {string} [userId] - User performing archival
 * @returns {Promise<ArchivedDocumentAttributes[]>} Archived documents
 *
 * @example
 * ```typescript
 * const archived = await archiveDocuments({
 *   documentIds: ['doc1', 'doc2', 'doc3'],
 *   storageTier: 'cold',
 *   compressionEnabled: true,
 *   encryptionEnabled: true,
 *   verificationRequired: true
 * }, 'admin-uuid');
 * ```
 */
export declare const archiveDocuments: (request: ArchivalRequest, userId?: string) => Promise<any[]>;
/**
 * 9. Restores archived documents from storage.
 *
 * @param {string[]} archiveIds - Archive IDs to restore
 * @param {string} [targetPath] - Target path for restoration
 * @returns {Promise<Array<{ archiveId: string; restored: boolean; path?: string }>>} Restoration results
 *
 * @example
 * ```typescript
 * const results = await restoreArchivedDocuments(
 *   ['archive1', 'archive2'],
 *   '/restored/documents'
 * );
 * console.log(`${results.filter(r => r.restored).length} documents restored`);
 * ```
 */
export declare const restoreArchivedDocuments: (archiveIds: string[], targetPath?: string) => Promise<Array<{
    archiveId: string;
    restored: boolean;
    path?: string;
}>>;
/**
 * 10. Migrates documents between storage tiers.
 *
 * @param {string[]} archiveIds - Archive IDs to migrate
 * @param {StorageTier} targetTier - Target storage tier
 * @returns {Promise<Array<{ archiveId: string; migrated: boolean; tier: StorageTier }>>} Migration results
 *
 * @example
 * ```typescript
 * const results = await migrateStorageTier(
 *   ['archive1', 'archive2'],
 *   'glacier'
 * );
 * ```
 */
export declare const migrateStorageTier: (archiveIds: string[], targetTier: StorageTier) => Promise<Array<{
    archiveId: string;
    migrated: boolean;
    tier: StorageTier;
}>>;
/**
 * 11. Verifies integrity of archived documents.
 *
 * @param {string[]} archiveIds - Archive IDs to verify
 * @returns {Promise<ArchivalVerification[]>} Verification results
 *
 * @example
 * ```typescript
 * const verifications = await verifyArchivedDocuments(['archive1', 'archive2']);
 * const allValid = verifications.every(v => v.verified);
 * ```
 */
export declare const verifyArchivedDocuments: (archiveIds: string[]) => Promise<ArchivalVerification[]>;
/**
 * 12. Compresses archived documents.
 *
 * @param {string[]} archiveIds - Archive IDs to compress
 * @param {string} [algorithm] - Compression algorithm (gzip, bzip2, lzma)
 * @returns {Promise<Array<{ archiveId: string; originalSize: number; compressedSize: number; ratio: number }>>} Compression results
 *
 * @example
 * ```typescript
 * const results = await compressArchivedDocuments(
 *   ['archive1', 'archive2'],
 *   'gzip'
 * );
 * console.log('Average compression:', results.reduce((a, r) => a + r.ratio, 0) / results.length);
 * ```
 */
export declare const compressArchivedDocuments: (archiveIds: string[], algorithm?: string) => Promise<Array<{
    archiveId: string;
    originalSize: number;
    compressedSize: number;
    ratio: number;
}>>;
/**
 * 13. Creates archival package with metadata.
 *
 * @param {string[]} documentIds - Document IDs to package
 * @param {Record<string, any>} metadata - Package metadata
 * @returns {Promise<{ packageId: string; documentCount: number; totalSize: number; packagePath: string }>} Package information
 *
 * @example
 * ```typescript
 * const package = await createArchivalPackage(
 *   ['doc1', 'doc2', 'doc3'],
 *   { project: 'Patient Records Q4 2025', retentionYears: 7 }
 * );
 * ```
 */
export declare const createArchivalPackage: (documentIds: string[], metadata: Record<string, any>) => Promise<{
    packageId: string;
    documentCount: number;
    totalSize: number;
    packagePath: string;
}>;
/**
 * 14. Schedules batch archival workflow.
 *
 * @param {ArchivalRequest} request - Archival request
 * @param {Date} scheduledDate - When to execute archival
 * @returns {Promise<{ jobId: string; scheduledDate: Date; documentCount: number }>} Scheduled job information
 *
 * @example
 * ```typescript
 * const job = await scheduleBatchArchival({
 *   documentIds: ['doc1', 'doc2'],
 *   storageTier: 'glacier',
 *   compressionEnabled: true
 * }, new Date('2025-12-01'));
 * ```
 */
export declare const scheduleBatchArchival: (request: ArchivalRequest, scheduledDate: Date) => Promise<{
    jobId: string;
    scheduledDate: Date;
    documentCount: number;
}>;
/**
 * 15. Creates disposal request for documents.
 *
 * @param {DisposalRequest} request - Disposal request
 * @returns {Promise<DisposalRecordAttributes>} Disposal record
 *
 * @example
 * ```typescript
 * const disposal = await createDisposalRequest({
 *   documentIds: ['doc1', 'doc2'],
 *   disposalMethod: 'secure_delete',
 *   reason: 'Retention period expired per policy RET-001',
 *   approvedBy: 'admin-uuid',
 *   requiresCertificate: true
 * });
 * ```
 */
export declare const createDisposalRequest: (request: DisposalRequest) => Promise<any>;
/**
 * 16. Executes secure document disposal.
 *
 * @param {string} disposalId - Disposal record ID
 * @param {string} performedBy - User performing disposal
 * @returns {Promise<{ disposalId: string; executed: boolean; certificateId?: string }>} Disposal execution result
 *
 * @example
 * ```typescript
 * const result = await executeDocumentDisposal('disposal-uuid', 'admin-uuid');
 * console.log('Certificate:', result.certificateId);
 * ```
 */
export declare const executeDocumentDisposal: (disposalId: string, performedBy: string) => Promise<{
    disposalId: string;
    executed: boolean;
    certificateId?: string;
}>;
/**
 * 17. Generates disposal certificate.
 *
 * @param {DisposalRecordAttributes} disposalRecord - Disposal record
 * @returns {Promise<DisposalCertificate>} Disposal certificate
 *
 * @example
 * ```typescript
 * const certificate = await generateDisposalCertificate(disposalRecord);
 * console.log('Certificate hash:', certificate.certificateHash);
 * ```
 */
export declare const generateDisposalCertificate: (disposalRecord: Partial<DisposalRecordAttributes>) => Promise<DisposalCertificate>;
/**
 * 18. Validates disposal compliance.
 *
 * @param {string} disposalId - Disposal record ID
 * @returns {Promise<{ compliant: boolean; issues?: string[]; verifiedAt: Date }>} Compliance validation result
 *
 * @example
 * ```typescript
 * const validation = await validateDisposalCompliance('disposal-uuid');
 * if (!validation.compliant) {
 *   console.error('Compliance issues:', validation.issues);
 * }
 * ```
 */
export declare const validateDisposalCompliance: (disposalId: string) => Promise<{
    compliant: boolean;
    issues?: string[];
    verifiedAt: Date;
}>;
/**
 * 19. Schedules automatic disposal for expired documents.
 *
 * @param {Date} cutoffDate - Disposal cutoff date
 * @param {RetentionAction} action - Action to perform
 * @returns {Promise<Array<{ documentId: string; scheduledDate: Date; action: string }>>} Scheduled disposals
 *
 * @example
 * ```typescript
 * const scheduled = await scheduleAutomaticDisposal(
 *   new Date('2025-12-31'),
 *   'delete'
 * );
 * console.log(`${scheduled.length} documents scheduled for disposal`);
 * ```
 */
export declare const scheduleAutomaticDisposal: (cutoffDate: Date, action: RetentionAction) => Promise<Array<{
    documentId: string;
    scheduledDate: Date;
    action: string;
}>>;
/**
 * 20. Creates chain of custody for disposal.
 *
 * @param {string} documentId - Document ID
 * @param {ChainOfCustodyEntry[]} entries - Chain of custody entries
 * @returns {Promise<{ documentId: string; entryCount: number; verified: boolean }>} Chain of custody record
 *
 * @example
 * ```typescript
 * const chain = await createChainOfCustody('doc-uuid', [
 *   { timestamp: new Date(), action: 'archived', performedBy: 'user1', currentHash: 'hash1' },
 *   { timestamp: new Date(), action: 'approved_disposal', performedBy: 'user2', currentHash: 'hash2' }
 * ]);
 * ```
 */
export declare const createChainOfCustody: (documentId: string, entries: ChainOfCustodyEntry[]) => Promise<{
    documentId: string;
    entryCount: number;
    verified: boolean;
}>;
/**
 * 21. Bulk deletes documents with audit trail.
 *
 * @param {string[]} documentIds - Document IDs to delete
 * @param {string} reason - Deletion reason
 * @param {string} approvedBy - Approver user ID
 * @returns {Promise<{ deleted: number; failed: number; auditTrailId: string }>} Deletion results
 *
 * @example
 * ```typescript
 * const result = await bulkDeleteWithAudit(
 *   ['doc1', 'doc2', 'doc3'],
 *   'Retention period expired',
 *   'admin-uuid'
 * );
 * console.log(`Deleted: ${result.deleted}, Failed: ${result.failed}`);
 * ```
 */
export declare const bulkDeleteWithAudit: (documentIds: string[], reason: string, approvedBy: string) => Promise<{
    deleted: number;
    failed: number;
    auditTrailId: string;
}>;
/**
 * 22. Generates compliance audit report.
 *
 * @param {Date} periodStart - Report period start
 * @param {Date} periodEnd - Report period end
 * @param {string} [generatedBy] - User generating report
 * @returns {Promise<ComplianceAuditReport>} Compliance audit report
 *
 * @example
 * ```typescript
 * const report = await generateComplianceAuditReport(
 *   new Date('2025-01-01'),
 *   new Date('2025-12-31'),
 *   'auditor-uuid'
 * );
 * console.log(`Compliance rate: ${(report.compliantDocuments / report.totalDocuments * 100).toFixed(2)}%`);
 * ```
 */
export declare const generateComplianceAuditReport: (periodStart: Date, periodEnd: Date, generatedBy?: string) => Promise<ComplianceAuditReport>;
/**
 * 23. Tracks retention policy compliance by department.
 *
 * @param {string} [department] - Department to track
 * @returns {Promise<Array<{ department: string; totalDocs: number; compliant: number; rate: number }>>} Compliance by department
 *
 * @example
 * ```typescript
 * const compliance = await trackComplianceByDepartment('cardiology');
 * console.log(`Cardiology compliance rate: ${compliance[0].rate}%`);
 * ```
 */
export declare const trackComplianceByDepartment: (department?: string) => Promise<Array<{
    department: string;
    totalDocs: number;
    compliant: number;
    rate: number;
}>>;
/**
 * 24. Identifies documents with expired retention periods.
 *
 * @param {number} [gracePeriodDays] - Grace period in days
 * @returns {Promise<Array<{ documentId: string; retentionEnd: Date; daysOverdue: number; action: string }>>} Expired documents
 *
 * @example
 * ```typescript
 * const expired = await identifyExpiredRetentionDocuments(30);
 * console.log(`${expired.length} documents past retention period`);
 * ```
 */
export declare const identifyExpiredRetentionDocuments: (gracePeriodDays?: number) => Promise<Array<{
    documentId: string;
    retentionEnd: Date;
    daysOverdue: number;
    action: string;
}>>;
/**
 * 25. Validates document lifecycle state transitions.
 *
 * @param {LifecycleEvent[]} events - Lifecycle events to validate
 * @returns {Promise<{ valid: boolean; invalidTransitions?: Array<{ from: string; to: string; reason: string }> }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateLifecycleTransitions([
 *   { documentId: 'doc1', eventType: 'archived', stage: 'archived', timestamp: new Date() },
 *   { documentId: 'doc1', eventType: 'disposed', stage: 'disposed', timestamp: new Date() }
 * ]);
 * ```
 */
export declare const validateLifecycleTransitions: (events: LifecycleEvent[]) => Promise<{
    valid: boolean;
    invalidTransitions?: Array<{
        from: string;
        to: string;
        reason: string;
    }>;
}>;
/**
 * 26. Generates retention compliance scorecard.
 *
 * @param {string} [department] - Department to score
 * @returns {Promise<{ score: number; metrics: Record<string, number>; grade: string }>} Compliance scorecard
 *
 * @example
 * ```typescript
 * const scorecard = await generateRetentionScorecard('cardiology');
 * console.log(`Score: ${scorecard.score}/100, Grade: ${scorecard.grade}`);
 * ```
 */
export declare const generateRetentionScorecard: (department?: string) => Promise<{
    score: number;
    metrics: Record<string, number>;
    grade: string;
}>;
/**
 * 27. Audits disposal records for compliance.
 *
 * @param {Date} startDate - Audit period start
 * @param {Date} endDate - Audit period end
 * @returns {Promise<{ totalDisposals: number; compliant: number; issues: Array<{ disposalId: string; issue: string }> }>} Disposal audit results
 *
 * @example
 * ```typescript
 * const audit = await auditDisposalRecords(
 *   new Date('2025-01-01'),
 *   new Date('2025-12-31')
 * );
 * console.log(`${audit.compliant}/${audit.totalDisposals} compliant disposals`);
 * ```
 */
export declare const auditDisposalRecords: (startDate: Date, endDate: Date) => Promise<{
    totalDisposals: number;
    compliant: number;
    issues: Array<{
        disposalId: string;
        issue: string;
    }>;
}>;
/**
 * 28. Monitors HIPAA retention compliance.
 *
 * @param {string} [documentType] - Document type to monitor
 * @returns {Promise<{ compliant: boolean; totalDocuments: number; violations: number; details?: string[] }>} HIPAA compliance status
 *
 * @example
 * ```typescript
 * const hipaa = await monitorHIPAARetentionCompliance('medical_record');
 * if (!hipaa.compliant) {
 *   console.error('HIPAA violations:', hipaa.details);
 * }
 * ```
 */
export declare const monitorHIPAARetentionCompliance: (documentType?: string) => Promise<{
    compliant: boolean;
    totalDocuments: number;
    violations: number;
    details?: string[];
}>;
/**
 * 29. Places documents on legal hold.
 *
 * @param {LegalHoldConfig} config - Legal hold configuration
 * @returns {Promise<{ holdId: string; documentCount: number; effectiveDate: Date }>} Legal hold information
 *
 * @example
 * ```typescript
 * const hold = await placeLegalHold({
 *   caseIdentifier: 'CASE-2025-001',
 *   description: 'Medical malpractice investigation',
 *   documentIds: ['doc1', 'doc2', 'doc3'],
 *   startDate: new Date(),
 *   responsible: 'legal-team-uuid'
 * });
 * ```
 */
export declare const placeLegalHold: (config: LegalHoldConfig) => Promise<{
    holdId: string;
    documentCount: number;
    effectiveDate: Date;
}>;
/**
 * 30. Releases documents from legal hold.
 *
 * @param {string} holdId - Legal hold ID
 * @param {string} releasedBy - User releasing hold
 * @param {string} [reason] - Release reason
 * @returns {Promise<{ holdId: string; releasedCount: number; releaseDate: Date }>} Release information
 *
 * @example
 * ```typescript
 * const release = await releaseLegalHold(
 *   'hold-uuid',
 *   'legal-counsel-uuid',
 *   'Case settled and closed'
 * );
 * ```
 */
export declare const releaseLegalHold: (holdId: string, releasedBy: string, reason?: string) => Promise<{
    holdId: string;
    releasedCount: number;
    releaseDate: Date;
}>;
/**
 * 31. Identifies documents matching legal hold criteria.
 *
 * @param {WhereOptions} criteria - Search criteria
 * @returns {Promise<Array<{ documentId: string; relevanceScore: number; metadata: Record<string, any> }>>} Matching documents
 *
 * @example
 * ```typescript
 * const documents = await identifyLegalHoldDocuments({
 *   patientId: 'patient-123',
 *   dateRange: { start: new Date('2024-01-01'), end: new Date('2024-12-31') },
 *   documentTypes: ['medical_record', 'lab_result']
 * });
 * ```
 */
export declare const identifyLegalHoldDocuments: (criteria: WhereOptions) => Promise<Array<{
    documentId: string;
    relevanceScore: number;
    metadata: Record<string, any>;
}>>;
/**
 * 32. Tracks legal hold status across documents.
 *
 * @param {string} [caseIdentifier] - Case identifier to track
 * @returns {Promise<Array<{ holdId: string; caseId: string; documentCount: number; status: LegalHoldStatus; startDate: Date }>>} Legal hold tracking
 *
 * @example
 * ```typescript
 * const holds = await trackLegalHoldStatus('CASE-2025-001');
 * console.log(`${holds.length} active legal holds`);
 * ```
 */
export declare const trackLegalHoldStatus: (caseIdentifier?: string) => Promise<Array<{
    holdId: string;
    caseId: string;
    documentCount: number;
    status: LegalHoldStatus;
    startDate: Date;
}>>;
/**
 * 33. Notifies stakeholders of legal hold.
 *
 * @param {string} holdId - Legal hold ID
 * @param {string[]} recipients - Recipient user IDs
 * @param {string} [message] - Custom message
 * @returns {Promise<{ notified: number; failed: number }>} Notification results
 *
 * @example
 * ```typescript
 * const result = await notifyLegalHoldStakeholders(
 *   'hold-uuid',
 *   ['user1', 'user2', 'user3'],
 *   'Legal hold placed - do not modify or delete these documents'
 * );
 * ```
 */
export declare const notifyLegalHoldStakeholders: (holdId: string, recipients: string[], message?: string) => Promise<{
    notified: number;
    failed: number;
}>;
/**
 * 34. Audits legal hold compliance.
 *
 * @param {string} holdId - Legal hold ID
 * @returns {Promise<{ compliant: boolean; documentsPreserved: number; violations?: string[] }>} Compliance audit result
 *
 * @example
 * ```typescript
 * const audit = await auditLegalHoldCompliance('hold-uuid');
 * if (!audit.compliant) {
 *   console.error('Violations:', audit.violations);
 * }
 * ```
 */
export declare const auditLegalHoldCompliance: (holdId: string) => Promise<{
    compliant: boolean;
    documentsPreserved: number;
    violations?: string[];
}>;
/**
 * 35. Extends legal hold period.
 *
 * @param {string} holdId - Legal hold ID
 * @param {Date} newEndDate - New expected end date
 * @param {string} reason - Extension reason
 * @returns {Promise<{ holdId: string; extended: boolean; newEndDate: Date }>} Extension result
 *
 * @example
 * ```typescript
 * const result = await extendLegalHoldPeriod(
 *   'hold-uuid',
 *   new Date('2026-12-31'),
 *   'Additional discovery required'
 * );
 * ```
 */
export declare const extendLegalHoldPeriod: (holdId: string, newEndDate: Date, reason: string) => Promise<{
    holdId: string;
    extended: boolean;
    newEndDate: Date;
}>;
/**
 * 36. Analyzes storage usage and provides optimization recommendations.
 *
 * @returns {Promise<{ totalSize: number; recommendations: Array<{ type: string; savingsPotential: number; action: string }> }>} Storage analysis
 *
 * @example
 * ```typescript
 * const analysis = await analyzeStorageUsage();
 * console.log('Total storage:', analysis.totalSize / (1024 ** 3), 'GB');
 * analysis.recommendations.forEach(r => console.log(r.action));
 * ```
 */
export declare const analyzeStorageUsage: () => Promise<{
    totalSize: number;
    recommendations: Array<{
        type: string;
        savingsPotential: number;
        action: string;
    }>;
}>;
/**
 * 37. Identifies candidates for storage tier migration.
 *
 * @param {StorageOptimizationConfig} config - Optimization configuration
 * @returns {Promise<Array<{ archiveId: string; currentTier: StorageTier; recommendedTier: StorageTier; savings: number }>>} Migration candidates
 *
 * @example
 * ```typescript
 * const candidates = await identifyTierMigrationCandidates({
 *   archivalAge: 365,
 *   minAccessCount: 5,
 *   targetTier: 'cold'
 * });
 * ```
 */
export declare const identifyTierMigrationCandidates: (config: StorageOptimizationConfig) => Promise<Array<{
    archiveId: string;
    currentTier: StorageTier;
    recommendedTier: StorageTier;
    savings: number;
}>>;
/**
 * 38. Performs deduplication on archived documents.
 *
 * @param {string[]} archiveIds - Archive IDs to deduplicate
 * @returns {Promise<{ processed: number; duplicatesFound: number; spaceReclaimed: number }>} Deduplication results
 *
 * @example
 * ```typescript
 * const result = await deduplicateArchivedDocuments(['archive1', 'archive2', 'archive3']);
 * console.log(`Reclaimed ${result.spaceReclaimed / (1024 ** 2)} MB`);
 * ```
 */
export declare const deduplicateArchivedDocuments: (archiveIds: string[]) => Promise<{
    processed: number;
    duplicatesFound: number;
    spaceReclaimed: number;
}>;
/**
 * 39. Optimizes archival storage layout.
 *
 * @param {StorageTier} tier - Storage tier to optimize
 * @returns {Promise<{ optimized: number; spaceReclaimed: number; performance: number }>} Optimization results
 *
 * @example
 * ```typescript
 * const result = await optimizeArchivalStorage('cold');
 * console.log(`Performance improvement: ${result.performance}%`);
 * ```
 */
export declare const optimizeArchivalStorage: (tier: StorageTier) => Promise<{
    optimized: number;
    spaceReclaimed: number;
    performance: number;
}>;
/**
 * 40. Calculates storage metrics by tier and lifecycle stage.
 *
 * @returns {Promise<StorageMetrics>} Storage metrics
 *
 * @example
 * ```typescript
 * const metrics = await calculateStorageMetrics();
 * console.log('Hot storage:', metrics.byTier.hot.sizeBytes / (1024 ** 3), 'GB');
 * console.log('Archived documents:', metrics.byStage.archived.count);
 * ```
 */
export declare const calculateStorageMetrics: () => Promise<StorageMetrics>;
/**
 * 41. Predicts future storage requirements.
 *
 * @param {number} months - Months to predict
 * @returns {Promise<Array<{ month: string; predictedSize: number; confidence: number }>>} Storage predictions
 *
 * @example
 * ```typescript
 * const predictions = await predictStorageGrowth(12);
 * predictions.forEach(p => {
 *   console.log(`${p.month}: ${p.predictedSize / (1024 ** 3)} GB (${p.confidence}% confidence)`);
 * });
 * ```
 */
export declare const predictStorageGrowth: (months: number) => Promise<Array<{
    month: string;
    predictedSize: number;
    confidence: number;
}>>;
/**
 * 42. Generates comprehensive lifecycle report for documents.
 *
 * @param {string} documentId - Document ID
 * @returns {Promise<{ documentId: string; stages: LifecycleEvent[]; currentStage: LifecycleStage; duration: number }>} Lifecycle report
 *
 * @example
 * ```typescript
 * const report = await generateDocumentLifecycleReport('doc-uuid');
 * console.log('Current stage:', report.currentStage);
 * console.log('Total lifecycle events:', report.stages.length);
 * ```
 */
export declare const generateDocumentLifecycleReport: (documentId: string) => Promise<{
    documentId: string;
    stages: LifecycleEvent[];
    currentStage: LifecycleStage;
    duration: number;
}>;
/**
 * 43. Creates retention dashboard metrics.
 *
 * @param {Date} [asOfDate] - Date to generate metrics for
 * @returns {Promise<{ totalDocuments: number; byStage: Record<LifecycleStage, number>; upcomingActions: number; overdueActions: number }>} Dashboard metrics
 *
 * @example
 * ```typescript
 * const dashboard = await createRetentionDashboard(new Date());
 * console.log('Total documents:', dashboard.totalDocuments);
 * console.log('Overdue actions:', dashboard.overdueActions);
 * ```
 */
export declare const createRetentionDashboard: (asOfDate?: Date) => Promise<{
    totalDocuments: number;
    byStage: Record<LifecycleStage, number>;
    upcomingActions: number;
    overdueActions: number;
}>;
/**
 * 44. Exports lifecycle events to audit format.
 *
 * @param {string} documentId - Document ID
 * @param {string} [format] - Export format (json, csv, xml)
 * @returns {Promise<string>} Exported audit trail
 *
 * @example
 * ```typescript
 * const auditTrail = await exportLifecycleAuditTrail('doc-uuid', 'json');
 * await fs.writeFile('audit-trail.json', auditTrail);
 * ```
 */
export declare const exportLifecycleAuditTrail: (documentId: string, format?: string) => Promise<string>;
/**
 * 45. Generates retention trends analysis.
 *
 * @param {number} periodMonths - Analysis period in months
 * @returns {Promise<{ trends: Array<{ month: string; archived: number; disposed: number; legalHolds: number }>; summary: Record<string, any> }>} Trends analysis
 *
 * @example
 * ```typescript
 * const trends = await generateRetentionTrendsReport(12);
 * console.log('12-month trends:', trends.summary);
 * trends.trends.forEach(t => {
 *   console.log(`${t.month}: ${t.archived} archived, ${t.disposed} disposed`);
 * });
 * ```
 */
export declare const generateRetentionTrendsReport: (periodMonths: number) => Promise<{
    trends: Array<{
        month: string;
        archived: number;
        disposed: number;
        legalHolds: number;
    }>;
    summary: Record<string, any>;
}>;
declare const _default: {
    createRetentionPolicyModel: (sequelize: Sequelize) => any;
    createArchivedDocumentModel: (sequelize: Sequelize) => any;
    createDisposalRecordModel: (sequelize: Sequelize) => any;
    createRetentionPolicy: (config: RetentionPolicyConfig, userId?: string) => Promise<any>;
    applyRetentionPolicy: (policyId: string, documentIds: string[], transaction?: Transaction) => Promise<RetentionSchedule[]>;
    evaluatePoliciesForDocument: (documentId: string, documentMetadata: Record<string, any>) => Promise<any[]>;
    calculateRetentionEndDate: (triggerDate: Date, policy: Partial<RetentionPolicyAttributes>) => Date;
    updateRetentionPolicy: (policyId: string, updates: Partial<RetentionPolicyConfig>, userId?: string) => Promise<any>;
    deactivateRetentionPolicy: (policyId: string, reason?: string, userId?: string) => Promise<void>;
    findDocumentsByCriteria: (criteria: WhereOptions, options?: FindOptions) => Promise<Array<{
        documentId: string;
        metadata: Record<string, any>;
    }>>;
    archiveDocuments: (request: ArchivalRequest, userId?: string) => Promise<any[]>;
    restoreArchivedDocuments: (archiveIds: string[], targetPath?: string) => Promise<Array<{
        archiveId: string;
        restored: boolean;
        path?: string;
    }>>;
    migrateStorageTier: (archiveIds: string[], targetTier: StorageTier) => Promise<Array<{
        archiveId: string;
        migrated: boolean;
        tier: StorageTier;
    }>>;
    verifyArchivedDocuments: (archiveIds: string[]) => Promise<ArchivalVerification[]>;
    compressArchivedDocuments: (archiveIds: string[], algorithm?: string) => Promise<Array<{
        archiveId: string;
        originalSize: number;
        compressedSize: number;
        ratio: number;
    }>>;
    createArchivalPackage: (documentIds: string[], metadata: Record<string, any>) => Promise<{
        packageId: string;
        documentCount: number;
        totalSize: number;
        packagePath: string;
    }>;
    scheduleBatchArchival: (request: ArchivalRequest, scheduledDate: Date) => Promise<{
        jobId: string;
        scheduledDate: Date;
        documentCount: number;
    }>;
    createDisposalRequest: (request: DisposalRequest) => Promise<any>;
    executeDocumentDisposal: (disposalId: string, performedBy: string) => Promise<{
        disposalId: string;
        executed: boolean;
        certificateId?: string;
    }>;
    generateDisposalCertificate: (disposalRecord: Partial<DisposalRecordAttributes>) => Promise<DisposalCertificate>;
    validateDisposalCompliance: (disposalId: string) => Promise<{
        compliant: boolean;
        issues?: string[];
        verifiedAt: Date;
    }>;
    scheduleAutomaticDisposal: (cutoffDate: Date, action: RetentionAction) => Promise<Array<{
        documentId: string;
        scheduledDate: Date;
        action: string;
    }>>;
    createChainOfCustody: (documentId: string, entries: ChainOfCustodyEntry[]) => Promise<{
        documentId: string;
        entryCount: number;
        verified: boolean;
    }>;
    bulkDeleteWithAudit: (documentIds: string[], reason: string, approvedBy: string) => Promise<{
        deleted: number;
        failed: number;
        auditTrailId: string;
    }>;
    generateComplianceAuditReport: (periodStart: Date, periodEnd: Date, generatedBy?: string) => Promise<ComplianceAuditReport>;
    trackComplianceByDepartment: (department?: string) => Promise<Array<{
        department: string;
        totalDocs: number;
        compliant: number;
        rate: number;
    }>>;
    identifyExpiredRetentionDocuments: (gracePeriodDays?: number) => Promise<Array<{
        documentId: string;
        retentionEnd: Date;
        daysOverdue: number;
        action: string;
    }>>;
    validateLifecycleTransitions: (events: LifecycleEvent[]) => Promise<{
        valid: boolean;
        invalidTransitions?: Array<{
            from: string;
            to: string;
            reason: string;
        }>;
    }>;
    generateRetentionScorecard: (department?: string) => Promise<{
        score: number;
        metrics: Record<string, number>;
        grade: string;
    }>;
    auditDisposalRecords: (startDate: Date, endDate: Date) => Promise<{
        totalDisposals: number;
        compliant: number;
        issues: Array<{
            disposalId: string;
            issue: string;
        }>;
    }>;
    monitorHIPAARetentionCompliance: (documentType?: string) => Promise<{
        compliant: boolean;
        totalDocuments: number;
        violations: number;
        details?: string[];
    }>;
    placeLegalHold: (config: LegalHoldConfig) => Promise<{
        holdId: string;
        documentCount: number;
        effectiveDate: Date;
    }>;
    releaseLegalHold: (holdId: string, releasedBy: string, reason?: string) => Promise<{
        holdId: string;
        releasedCount: number;
        releaseDate: Date;
    }>;
    identifyLegalHoldDocuments: (criteria: WhereOptions) => Promise<Array<{
        documentId: string;
        relevanceScore: number;
        metadata: Record<string, any>;
    }>>;
    trackLegalHoldStatus: (caseIdentifier?: string) => Promise<Array<{
        holdId: string;
        caseId: string;
        documentCount: number;
        status: LegalHoldStatus;
        startDate: Date;
    }>>;
    notifyLegalHoldStakeholders: (holdId: string, recipients: string[], message?: string) => Promise<{
        notified: number;
        failed: number;
    }>;
    auditLegalHoldCompliance: (holdId: string) => Promise<{
        compliant: boolean;
        documentsPreserved: number;
        violations?: string[];
    }>;
    extendLegalHoldPeriod: (holdId: string, newEndDate: Date, reason: string) => Promise<{
        holdId: string;
        extended: boolean;
        newEndDate: Date;
    }>;
    analyzeStorageUsage: () => Promise<{
        totalSize: number;
        recommendations: Array<{
            type: string;
            savingsPotential: number;
            action: string;
        }>;
    }>;
    identifyTierMigrationCandidates: (config: StorageOptimizationConfig) => Promise<Array<{
        archiveId: string;
        currentTier: StorageTier;
        recommendedTier: StorageTier;
        savings: number;
    }>>;
    deduplicateArchivedDocuments: (archiveIds: string[]) => Promise<{
        processed: number;
        duplicatesFound: number;
        spaceReclaimed: number;
    }>;
    optimizeArchivalStorage: (tier: StorageTier) => Promise<{
        optimized: number;
        spaceReclaimed: number;
        performance: number;
    }>;
    calculateStorageMetrics: () => Promise<StorageMetrics>;
    predictStorageGrowth: (months: number) => Promise<Array<{
        month: string;
        predictedSize: number;
        confidence: number;
    }>>;
    generateDocumentLifecycleReport: (documentId: string) => Promise<{
        documentId: string;
        stages: LifecycleEvent[];
        currentStage: LifecycleStage;
        duration: number;
    }>;
    createRetentionDashboard: (asOfDate?: Date) => Promise<{
        totalDocuments: number;
        byStage: Record<LifecycleStage, number>;
        upcomingActions: number;
        overdueActions: number;
    }>;
    exportLifecycleAuditTrail: (documentId: string, format?: string) => Promise<string>;
    generateRetentionTrendsReport: (periodMonths: number) => Promise<{
        trends: Array<{
            month: string;
            archived: number;
            disposed: number;
            legalHolds: number;
        }>;
        summary: Record<string, any>;
    }>;
};
export default _default;
//# sourceMappingURL=document-lifecycle-management-kit.d.ts.map