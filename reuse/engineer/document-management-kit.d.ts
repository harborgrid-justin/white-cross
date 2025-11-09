/**
 * LOC: DOC_MGMT_KIT_001
 * File: /reuse/engineer/document-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/config
 *   - @nestjs/typeorm
 *   - typeorm
 *   - @nestjs/swagger
 *   - @aws-sdk/client-s3
 *   - @azure/storage-blob
 *   - multer
 *   - sharp
 *   - pdf-lib
 *   - mammoth
 *   - zod
 *   - crypto
 *
 * DOWNSTREAM (imported by):
 *   - Document management modules
 *   - File upload controllers
 *   - Document workflow services
 *   - Search and indexing services
 *   - Document retention services
 */
import { DynamicModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
/**
 * Document storage provider types
 */
export declare enum StorageProvider {
    LOCAL = "local",
    S3 = "s3",
    AZURE_BLOB = "azure_blob",
    GCS = "gcs",
    CLOUDINARY = "cloudinary"
}
/**
 * Document status types
 */
export declare enum DocumentStatus {
    DRAFT = "draft",
    PENDING_REVIEW = "pending_review",
    APPROVED = "approved",
    REJECTED = "rejected",
    ARCHIVED = "archived",
    DELETED = "deleted"
}
/**
 * Document access level types
 */
export declare enum DocumentAccessLevel {
    PRIVATE = "private",
    SHARED = "shared",
    PUBLIC = "public",
    RESTRICTED = "restricted"
}
/**
 * Document version action types
 */
export declare enum VersionAction {
    CREATED = "created",
    UPDATED = "updated",
    RESTORED = "restored",
    DELETED = "deleted"
}
/**
 * Document workflow status
 */
export declare enum WorkflowStatus {
    PENDING = "pending",
    IN_REVIEW = "in_review",
    APPROVED = "approved",
    REJECTED = "rejected",
    CANCELLED = "cancelled"
}
/**
 * Document retention policy types
 */
export declare enum RetentionPolicy {
    IMMEDIATE = "immediate",// Delete immediately
    SHORT_TERM = "short_term",// 30 days
    MEDIUM_TERM = "medium_term",// 1 year
    LONG_TERM = "long_term",// 7 years
    PERMANENT = "permanent",// Never delete
    HIPAA_COMPLIANT = "hipaa"
}
/**
 * Base document entity interface
 */
export interface Document {
    id: string;
    name: string;
    originalName: string;
    description?: string;
    mimeType: string;
    extension: string;
    size: number;
    storageProvider: StorageProvider;
    storagePath: string;
    storageKey: string;
    url?: string;
    status: DocumentStatus;
    accessLevel: DocumentAccessLevel;
    category?: string;
    tags: string[];
    metadata: DocumentMetadata;
    version: number;
    parentDocumentId?: string;
    tenantId?: string;
    createdBy: string;
    updatedBy?: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    expiresAt?: Date;
}
/**
 * Document metadata
 */
export interface DocumentMetadata {
    width?: number;
    height?: number;
    pageCount?: number;
    duration?: number;
    author?: string;
    title?: string;
    subject?: string;
    keywords?: string[];
    createdDate?: Date;
    modifiedDate?: Date;
    checksum: string;
    encrypted: boolean;
    compressed: boolean;
    indexed: boolean;
    customFields: Record<string, any>;
}
/**
 * Document version history entry
 */
export interface DocumentVersion {
    id: string;
    documentId: string;
    version: number;
    action: VersionAction;
    size: number;
    storagePath: string;
    checksum: string;
    changes?: string;
    createdBy: string;
    createdAt: Date;
    metadata: Record<string, any>;
}
/**
 * Document upload options
 */
export interface DocumentUploadOptions {
    category?: string;
    tags?: string[];
    accessLevel?: DocumentAccessLevel;
    metadata?: Record<string, any>;
    encrypt?: boolean;
    compress?: boolean;
    generatePreview?: boolean;
    virusScan?: boolean;
    extractText?: boolean;
    tenantId?: string;
}
/**
 * Document search filters
 */
export interface DocumentSearchFilters {
    query?: string;
    categories?: string[];
    tags?: string[];
    mimeTypes?: string[];
    status?: DocumentStatus[];
    accessLevel?: DocumentAccessLevel[];
    createdBy?: string;
    dateFrom?: Date;
    dateTo?: Date;
    minSize?: number;
    maxSize?: number;
    tenantId?: string;
}
/**
 * Document access permission
 */
export interface DocumentPermission {
    documentId: string;
    userId?: string;
    roleId?: string;
    teamId?: string;
    canView: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canShare: boolean;
    expiresAt?: Date;
}
/**
 * Document workflow
 */
export interface DocumentWorkflow {
    id: string;
    documentId: string;
    name: string;
    status: WorkflowStatus;
    steps: WorkflowStep[];
    currentStep: number;
    createdBy: string;
    createdAt: Date;
    completedAt?: Date;
}
/**
 * Workflow step
 */
export interface WorkflowStep {
    id: string;
    order: number;
    name: string;
    assignedTo: string[];
    status: WorkflowStatus;
    dueDate?: Date;
    completedAt?: Date;
    completedBy?: string;
    comments?: string;
}
/**
 * Document template
 */
export interface DocumentTemplate {
    id: string;
    name: string;
    description?: string;
    category: string;
    mimeType: string;
    templatePath: string;
    variables: TemplateVariable[];
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Template variable definition
 */
export interface TemplateVariable {
    name: string;
    type: 'string' | 'number' | 'date' | 'boolean';
    required: boolean;
    defaultValue?: any;
    description?: string;
}
/**
 * Document retention configuration
 */
export interface DocumentRetentionConfig {
    policy: RetentionPolicy;
    retentionDays?: number;
    archiveBeforeDelete: boolean;
    archivePath?: string;
    notifyBeforeDelete: boolean;
    notifyDaysBefore?: number;
}
/**
 * Storage provider configuration
 */
export interface StorageProviderConfig {
    provider: StorageProvider;
    config: S3Config | AzureBlobConfig | GCSConfig | LocalConfig;
}
/**
 * AWS S3 configuration
 */
export interface S3Config {
    region: string;
    bucket: string;
    accessKeyId?: string;
    secretAccessKey?: string;
    endpoint?: string;
    forcePathStyle?: boolean;
}
/**
 * Azure Blob Storage configuration
 */
export interface AzureBlobConfig {
    connectionString: string;
    containerName: string;
}
/**
 * Google Cloud Storage configuration
 */
export interface GCSConfig {
    projectId: string;
    bucket: string;
    keyFilename?: string;
}
/**
 * Local storage configuration
 */
export interface LocalConfig {
    uploadPath: string;
    maxFileSize: number;
    allowedMimeTypes?: string[];
}
/**
 * Document upload schema
 */
export declare const DocumentUploadSchema: any;
/**
 * Document metadata schema
 */
export declare const DocumentMetadataSchema: any;
/**
 * S3 configuration schema
 */
export declare const S3ConfigSchema: any;
/**
 * Azure Blob configuration schema
 */
export declare const AzureBlobConfigSchema: any;
/**
 * Document retention configuration schema
 */
export declare const DocumentRetentionSchema: any;
/**
 * Register document management configuration namespace
 *
 * @returns Configuration factory for NestJS
 *
 * @example
 * ```typescript
 * ConfigModule.forRoot({
 *   load: [registerDocumentConfig()],
 * })
 * ```
 */
export declare function registerDocumentConfig(): any;
/**
 * Create document management configuration module
 *
 * @returns DynamicModule for document config
 *
 * @example
 * ```typescript
 * @Module({
 *   imports: [createDocumentConfigModule()],
 * })
 * export class DocumentModule {}
 * ```
 */
export declare function createDocumentConfigModule(): DynamicModule;
/**
 * Validate storage provider configuration
 *
 * @param provider - Storage provider type
 * @param config - Provider configuration
 * @returns Validated configuration
 *
 * @example
 * ```typescript
 * const validated = validateStorageConfig(StorageProvider.S3, s3Config);
 * ```
 */
export declare function validateStorageConfig(provider: StorageProvider, config: any): S3Config | AzureBlobConfig | GCSConfig | LocalConfig;
/**
 * Get storage provider from configuration
 *
 * @param configService - NestJS ConfigService
 * @returns Storage provider configuration
 *
 * @example
 * ```typescript
 * const providerConfig = getStorageProvider(configService);
 * ```
 */
export declare function getStorageProvider(configService: ConfigService): StorageProviderConfig;
/**
 * Upload document to configured storage provider
 *
 * @param file - File buffer or stream
 * @param fileName - Original file name
 * @param options - Upload options
 * @param configService - NestJS ConfigService
 * @returns Uploaded document entity
 *
 * @example
 * ```typescript
 * const document = await uploadDocument(
 *   fileBuffer,
 *   'medical-record.pdf',
 *   { category: 'medical-records', encrypt: true },
 *   configService
 * );
 * ```
 */
export declare function uploadDocument(file: Buffer, fileName: string, options: DocumentUploadOptions, configService: ConfigService): Promise<Document>;
/**
 * Validate document file before upload
 *
 * @param file - File buffer
 * @param fileName - File name
 * @param configService - Configuration service
 * @throws BadRequestException if validation fails
 *
 * @example
 * ```typescript
 * await validateDocumentFile(buffer, 'document.pdf', configService);
 * ```
 */
export declare function validateDocumentFile(file: Buffer, fileName: string, configService: ConfigService): Promise<void>;
/**
 * Generate unique document identifier
 *
 * @returns Document ID
 *
 * @example
 * ```typescript
 * const docId = generateDocumentId(); // 'doc_a1b2c3d4e5f6'
 * ```
 */
export declare function generateDocumentId(): string;
/**
 * Generate storage key for document
 *
 * @param documentId - Document ID
 * @param fileName - Original file name
 * @returns Storage key path
 *
 * @example
 * ```typescript
 * const key = generateStorageKey('doc_123', 'file.pdf');
 * // 'documents/2025/01/doc_123/file.pdf'
 * ```
 */
export declare function generateStorageKey(documentId: string, fileName: string): string;
/**
 * Upload file to storage provider
 *
 * @param provider - Storage provider type
 * @param config - Provider configuration
 * @param key - Storage key
 * @param file - File buffer
 * @returns Storage path and URL
 *
 * @example
 * ```typescript
 * const { storagePath, url } = await uploadToProvider(
 *   StorageProvider.S3,
 *   s3Config,
 *   'path/to/file.pdf',
 *   fileBuffer
 * );
 * ```
 */
export declare function uploadToProvider(provider: StorageProvider, config: any, key: string, file: Buffer): Promise<{
    storagePath: string;
    url?: string;
}>;
/**
 * Download document from storage provider
 *
 * @param document - Document entity
 * @param configService - Configuration service
 * @returns File buffer
 *
 * @example
 * ```typescript
 * const buffer = await downloadDocument(document, configService);
 * ```
 */
export declare function downloadDocument(document: Document, configService: ConfigService): Promise<Buffer>;
/**
 * Delete document from storage
 *
 * @param document - Document entity
 * @param configService - Configuration service
 *
 * @example
 * ```typescript
 * await deleteDocumentFromStorage(document, configService);
 * ```
 */
export declare function deleteDocumentFromStorage(document: Document, configService: ConfigService): Promise<void>;
/**
 * Create new version of existing document
 *
 * @param documentId - Original document ID
 * @param file - New file buffer
 * @param changes - Change description
 * @param userId - User making changes
 * @returns New document version
 *
 * @example
 * ```typescript
 * const version = await createDocumentVersion(
 *   'doc_123',
 *   updatedBuffer,
 *   'Updated treatment plan',
 *   'user_456'
 * );
 * ```
 */
export declare function createDocumentVersion(documentId: string, file: Buffer, changes: string, userId: string): Promise<DocumentVersion>;
/**
 * Get version history for document
 *
 * @param documentId - Document ID
 * @param repository - DocumentVersion repository
 * @returns Array of document versions
 *
 * @example
 * ```typescript
 * const history = await getDocumentVersionHistory('doc_123', versionRepo);
 * ```
 */
export declare function getDocumentVersionHistory(documentId: string, repository: Repository<any>): Promise<DocumentVersion[]>;
/**
 * Restore document to specific version
 *
 * @param documentId - Document ID
 * @param version - Version number to restore
 * @param userId - User performing restoration
 *
 * @example
 * ```typescript
 * await restoreDocumentVersion('doc_123', 3, 'user_456');
 * ```
 */
export declare function restoreDocumentVersion(documentId: string, version: number, userId: string): Promise<void>;
/**
 * Extract metadata from document file
 *
 * @param file - File buffer
 * @param fileName - File name
 * @returns Extracted metadata
 *
 * @example
 * ```typescript
 * const metadata = await extractDocumentMetadata(buffer, 'document.pdf');
 * ```
 */
export declare function extractDocumentMetadata(file: Buffer, fileName: string): Promise<DocumentMetadata>;
/**
 * Update document tags
 *
 * @param documentId - Document ID
 * @param tags - New tags to add
 * @param repository - Document repository
 *
 * @example
 * ```typescript
 * await updateDocumentTags('doc_123', ['urgent', 'reviewed'], docRepo);
 * ```
 */
export declare function updateDocumentTags(documentId: string, tags: string[], repository: Repository<any>): Promise<void>;
/**
 * Categorize document automatically based on content
 *
 * @param document - Document entity
 * @param content - Document text content
 * @returns Suggested category
 *
 * @example
 * ```typescript
 * const category = categorizeDocument(document, extractedText);
 * ```
 */
export declare function categorizeDocument(document: Document, content: string): string;
/**
 * Search documents with full-text and metadata filters
 *
 * @param filters - Search filters
 * @param repository - Document repository
 * @returns Matching documents
 *
 * @example
 * ```typescript
 * const results = await searchDocuments({
 *   query: 'patient consent',
 *   categories: ['consent-forms'],
 *   dateFrom: new Date('2025-01-01'),
 * }, docRepo);
 * ```
 */
export declare function searchDocuments(filters: DocumentSearchFilters, repository: Repository<any>): Promise<Document[]>;
/**
 * Extract text content from document for indexing
 *
 * @param document - Document entity
 * @param file - File buffer
 * @returns Extracted text content
 *
 * @example
 * ```typescript
 * const text = await extractDocumentText(document, buffer);
 * ```
 */
export declare function extractDocumentText(document: Document, file: Buffer): Promise<string>;
/**
 * Index document for full-text search
 *
 * @param document - Document entity
 * @param textContent - Extracted text content
 *
 * @example
 * ```typescript
 * await indexDocument(document, extractedText);
 * ```
 */
export declare function indexDocument(document: Document, textContent: string): Promise<void>;
/**
 * Grant document access permission to user/role
 *
 * @param permission - Permission configuration
 * @param repository - Permission repository
 *
 * @example
 * ```typescript
 * await grantDocumentAccess({
 *   documentId: 'doc_123',
 *   userId: 'user_456',
 *   canView: true,
 *   canEdit: false,
 * }, permRepo);
 * ```
 */
export declare function grantDocumentAccess(permission: DocumentPermission, repository: Repository<any>): Promise<void>;
/**
 * Revoke document access permission
 *
 * @param documentId - Document ID
 * @param userId - User ID
 * @param repository - Permission repository
 *
 * @example
 * ```typescript
 * await revokeDocumentAccess('doc_123', 'user_456', permRepo);
 * ```
 */
export declare function revokeDocumentAccess(documentId: string, userId: string, repository: Repository<any>): Promise<void>;
/**
 * Check if user has specific permission on document
 *
 * @param documentId - Document ID
 * @param userId - User ID
 * @param permission - Permission type to check
 * @param repository - Permission repository
 * @returns Whether user has permission
 *
 * @example
 * ```typescript
 * const canEdit = await checkDocumentPermission(
 *   'doc_123',
 *   'user_456',
 *   'canEdit',
 *   permRepo
 * );
 * ```
 */
export declare function checkDocumentPermission(documentId: string, userId: string, permission: keyof Pick<DocumentPermission, 'canView' | 'canEdit' | 'canDelete' | 'canShare'>, repository: Repository<any>): Promise<boolean>;
/**
 * Create document approval workflow
 *
 * @param documentId - Document ID
 * @param workflowName - Workflow name
 * @param steps - Workflow steps
 * @param createdBy - Creator user ID
 * @returns Created workflow
 *
 * @example
 * ```typescript
 * const workflow = await createDocumentWorkflow(
 *   'doc_123',
 *   'Medical Record Review',
 *   [
 *     { order: 1, name: 'Physician Review', assignedTo: ['user_doctor'] },
 *     { order: 2, name: 'Admin Approval', assignedTo: ['user_admin'] },
 *   ],
 *   'user_submitter'
 * );
 * ```
 */
export declare function createDocumentWorkflow(documentId: string, workflowName: string, steps: Omit<WorkflowStep, 'id' | 'status'>[], createdBy: string): Promise<DocumentWorkflow>;
/**
 * Approve workflow step
 *
 * @param workflowId - Workflow ID
 * @param stepId - Step ID
 * @param userId - Approver user ID
 * @param comments - Approval comments
 *
 * @example
 * ```typescript
 * await approveWorkflowStep('wf_123', 'step_1', 'user_doctor', 'Looks good');
 * ```
 */
export declare function approveWorkflowStep(workflowId: string, stepId: string, userId: string, comments?: string): Promise<void>;
/**
 * Reject workflow step
 *
 * @param workflowId - Workflow ID
 * @param stepId - Step ID
 * @param userId - Rejector user ID
 * @param reason - Rejection reason
 *
 * @example
 * ```typescript
 * await rejectWorkflowStep('wf_123', 'step_1', 'user_doctor', 'Missing signature');
 * ```
 */
export declare function rejectWorkflowStep(workflowId: string, stepId: string, userId: string, reason: string): Promise<void>;
/**
 * Generate document from template
 *
 * @param templateId - Template ID
 * @param variables - Template variable values
 * @param configService - Configuration service
 * @returns Generated document
 *
 * @example
 * ```typescript
 * const document = await generateDocumentFromTemplate(
 *   'tmpl_consent',
 *   {
 *     patientName: 'John Doe',
 *     date: new Date(),
 *     procedureName: 'MRI Scan',
 *   },
 *   configService
 * );
 * ```
 */
export declare function generateDocumentFromTemplate(templateId: string, variables: Record<string, any>, configService: ConfigService): Promise<Document>;
/**
 * Apply retention policy to document
 *
 * @param documentId - Document ID
 * @param policy - Retention policy configuration
 * @param repository - Document repository
 *
 * @example
 * ```typescript
 * await applyRetentionPolicy('doc_123', {
 *   policy: RetentionPolicy.HIPAA_COMPLIANT,
 *   archiveBeforeDelete: true,
 * }, docRepo);
 * ```
 */
export declare function applyRetentionPolicy(documentId: string, policy: DocumentRetentionConfig, repository: Repository<any>): Promise<void>;
/**
 * Archive expired documents
 *
 * @param repository - Document repository
 * @param configService - Configuration service
 * @returns Number of archived documents
 *
 * @example
 * ```typescript
 * const count = await archiveExpiredDocuments(docRepo, configService);
 * ```
 */
export declare function archiveExpiredDocuments(repository: Repository<any>, configService: ConfigService): Promise<number>;
/**
 * Generate preview/thumbnail for document
 *
 * @param document - Document entity
 * @param file - File buffer
 * @param configService - Configuration service
 * @returns Preview URL
 *
 * @example
 * ```typescript
 * const previewUrl = await generateDocumentPreview(document, buffer, configService);
 * ```
 */
export declare function generateDocumentPreview(document: Document, file: Buffer, configService: ConfigService): Promise<string | undefined>;
declare const _default: {
    registerDocumentConfig: typeof registerDocumentConfig;
    createDocumentConfigModule: typeof createDocumentConfigModule;
    validateStorageConfig: typeof validateStorageConfig;
    getStorageProvider: typeof getStorageProvider;
    uploadDocument: typeof uploadDocument;
    validateDocumentFile: typeof validateDocumentFile;
    generateDocumentId: typeof generateDocumentId;
    generateStorageKey: typeof generateStorageKey;
    uploadToProvider: typeof uploadToProvider;
    downloadDocument: typeof downloadDocument;
    deleteDocumentFromStorage: typeof deleteDocumentFromStorage;
    createDocumentVersion: typeof createDocumentVersion;
    getDocumentVersionHistory: typeof getDocumentVersionHistory;
    restoreDocumentVersion: typeof restoreDocumentVersion;
    extractDocumentMetadata: typeof extractDocumentMetadata;
    updateDocumentTags: typeof updateDocumentTags;
    categorizeDocument: typeof categorizeDocument;
    searchDocuments: typeof searchDocuments;
    extractDocumentText: typeof extractDocumentText;
    indexDocument: typeof indexDocument;
    grantDocumentAccess: typeof grantDocumentAccess;
    revokeDocumentAccess: typeof revokeDocumentAccess;
    checkDocumentPermission: typeof checkDocumentPermission;
    createDocumentWorkflow: typeof createDocumentWorkflow;
    approveWorkflowStep: typeof approveWorkflowStep;
    rejectWorkflowStep: typeof rejectWorkflowStep;
    generateDocumentFromTemplate: typeof generateDocumentFromTemplate;
    applyRetentionPolicy: typeof applyRetentionPolicy;
    archiveExpiredDocuments: typeof archiveExpiredDocuments;
    generateDocumentPreview: typeof generateDocumentPreview;
};
export default _default;
//# sourceMappingURL=document-management-kit.d.ts.map