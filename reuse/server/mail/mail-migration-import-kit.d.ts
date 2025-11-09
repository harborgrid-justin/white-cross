/**
 * LOC: M1G2R3A4T5
 * File: /reuse/server/mail/mail-migration-import-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (v6.x)
 *   - pst-extractor (v2.x)
 *   - node-mbox (v1.x)
 *   - mailparser (v3.x)
 *   - imap (v0.8.x)
 *   - googleapis (v128.x)
 *
 * DOWNSTREAM (imported by):
 *   - Mail migration services
 *   - Data import modules
 *   - Mailbox synchronization services
 *   - Migration management dashboards
 */
/**
 * File: /reuse/server/mail/mail-migration-import-kit.ts
 * Locator: WC-UTL-MAIL-MIGRATION-001
 * Purpose: Mail Migration and Import Kit - Complete mailbox migration and import utilities
 *
 * Upstream: sequelize v6.x, pst-extractor v2.x, node-mbox v1.x, mailparser v3.x, imap v0.8.x, googleapis v128.x
 * Downstream: Mail migration services, data import modules, mailbox sync, admin dashboards
 * Dependencies: Node 20+, TypeScript 5.x, Sequelize 6.x, PST/MBOX/EML parsers
 * Exports: 45 migration utilities for PST/MBOX/EML import, Exchange/IMAP/Gmail/O365 migration, progress tracking, validation, rollback
 *
 * LLM Context: Production-grade mail migration toolkit for White Cross healthcare platform.
 * Provides comprehensive mailbox migration capabilities including PST file import (Outlook),
 * MBOX file import, EML file import, Exchange Server migration, IMAP migration, Gmail/G Suite
 * migration, Office 365 migration, bulk user migration, incremental migration strategies,
 * migration validation and verification, real-time progress tracking, error handling with
 * automatic rollback, detailed migration reporting, and complete Swagger documentation.
 * HIPAA-compliant with audit trails and secure data handling throughout migration process.
 */
import { Model, Sequelize, ModelStatic, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
/**
 * Migration source type enumeration
 */
export declare enum MigrationSourceType {
    PST = "pst",
    MBOX = "mbox",
    EML = "eml",
    ExchangeServer = "exchange_server",
    IMAP = "imap",
    Gmail = "gmail",
    GSuite = "gsuite",
    Office365 = "office365",
    POP3 = "pop3",
    Thunderbird = "thunderbird",
    AppleMail = "apple_mail"
}
/**
 * Migration status enumeration
 */
export declare enum MigrationStatus {
    Pending = "pending",
    InProgress = "in_progress",
    Paused = "paused",
    Completed = "completed",
    Failed = "failed",
    Cancelled = "cancelled",
    PartialSuccess = "partial_success",
    ValidationFailed = "validation_failed",
    RollingBack = "rolling_back",
    RolledBack = "rolled_back"
}
/**
 * Migration item type enumeration
 */
export declare enum MigrationItemType {
    Email = "email",
    Contact = "contact",
    Calendar = "calendar",
    Task = "task",
    Note = "note",
    Folder = "folder",
    Attachment = "attachment",
    Rule = "rule"
}
/**
 * Migration strategy enumeration
 */
export declare enum MigrationStrategy {
    FullMigration = "full_migration",
    IncrementalSync = "incremental_sync",
    DeltaSync = "delta_sync",
    SnapshotCopy = "snapshot_copy",
    CutoverMigration = "cutover_migration",
    StagedMigration = "staged_migration",
    HybridMigration = "hybrid_migration"
}
/**
 * Migration configuration
 */
export interface MigrationConfig {
    sourceType: MigrationSourceType;
    strategy: MigrationStrategy;
    batchSize: number;
    maxConcurrent: number;
    retryAttempts: number;
    retryDelay: number;
    preserveFolderStructure: boolean;
    preserveTimestamps: boolean;
    validateAfterImport: boolean;
    skipDuplicates: boolean;
    duplicateDetectionField: 'messageId' | 'subject' | 'hash';
    includeArchiveMailbox: boolean;
    includeDeletedItems: boolean;
    dateRangeStart?: Date;
    dateRangeEnd?: Date;
    folderFilter?: string[];
    excludeSystemFolders?: boolean;
    maxItemSize?: number;
    timeoutMs?: number;
}
/**
 * PST file import configuration
 */
export interface PSTImportConfig {
    filePath: string;
    userId: number;
    targetFolderId?: number;
    includeSubfolders: boolean;
    includeAttachments: boolean;
    maxAttachmentSize?: number;
    skipCorruptedItems: boolean;
    passwordProtected?: boolean;
    password?: string;
    migrationConfig: MigrationConfig;
}
/**
 * MBOX import configuration
 */
export interface MBoxImportConfig {
    filePath: string;
    userId: number;
    targetFolderId?: number;
    format: 'mboxrd' | 'mboxo' | 'mboxcl' | 'mboxcl2';
    encoding?: string;
    preserveLabels: boolean;
    migrationConfig: MigrationConfig;
}
/**
 * EML import configuration
 */
export interface EMLImportConfig {
    directoryPath: string;
    userId: number;
    targetFolderId?: number;
    recursive: boolean;
    filePattern?: RegExp;
    migrationConfig: MigrationConfig;
}
/**
 * Exchange Server migration configuration
 */
export interface ExchangeMigrationConfig {
    serverUrl: string;
    domain?: string;
    username: string;
    password?: string;
    accessToken?: string;
    authType: 'basic' | 'ntlm' | 'oauth2';
    version: string;
    sourceMailbox: string;
    targetUserId: number;
    impersonation?: boolean;
    useAutoDiscover: boolean;
    migrationConfig: MigrationConfig;
}
/**
 * IMAP migration configuration
 */
export interface IMAPMigrationConfig {
    host: string;
    port: number;
    secure: boolean;
    username: string;
    password: string;
    authTimeout?: number;
    targetUserId: number;
    folderMapping?: Record<string, string>;
    markAsRead?: boolean;
    migrationConfig: MigrationConfig;
}
/**
 * Gmail/G Suite migration configuration
 */
export interface GmailMigrationConfig {
    serviceAccountKey?: string;
    clientId?: string;
    clientSecret?: string;
    refreshToken?: string;
    accessToken?: string;
    userEmail: string;
    adminEmail?: string;
    delegatedUser?: string;
    targetUserId: number;
    includeSpam: boolean;
    includeTrash: boolean;
    labelMapping?: Record<string, number>;
    migrationConfig: MigrationConfig;
}
/**
 * Office 365 migration configuration
 */
export interface Office365MigrationConfig {
    tenantId: string;
    clientId: string;
    clientSecret: string;
    sourceMailbox: string;
    targetUserId: number;
    useModernAuth: boolean;
    applicationPermissions: boolean;
    includeSharedMailboxes: boolean;
    includeArchive: boolean;
    migrationConfig: MigrationConfig;
}
/**
 * Bulk migration user mapping
 */
export interface BulkMigrationUser {
    sourceIdentifier: string;
    targetUserId: number;
    customConfig?: Partial<MigrationConfig>;
    priority?: number;
}
/**
 * Bulk migration configuration
 */
export interface BulkMigrationConfig {
    sourceType: MigrationSourceType;
    users: BulkMigrationUser[];
    parallelMigrations: number;
    failureThreshold: number;
    pauseOnError: boolean;
    generateReport: boolean;
    notificationEmail?: string;
    baseMigrationConfig: MigrationConfig;
}
/**
 * Migration progress information
 */
export interface MigrationProgress {
    migrationId: string;
    status: MigrationStatus;
    totalItems: number;
    processedItems: number;
    successfulItems: number;
    failedItems: number;
    skippedItems: number;
    currentItem?: string;
    currentFolder?: string;
    startedAt: Date;
    estimatedCompletion?: Date;
    lastError?: string;
    percentComplete: number;
    itemsPerSecond: number;
    bytesMigrated: number;
    bytesTotal: number;
    itemTypeBreakdown: Record<MigrationItemType, number>;
}
/**
 * Migration validation result
 */
export interface ValidationResult {
    isValid: boolean;
    totalSourceItems: number;
    totalTargetItems: number;
    matchingItems: number;
    missingItems: number;
    corruptedItems: number;
    duplicateItems: number;
    sizeDiscrepancy: number;
    missingItemDetails: MigrationItemReference[];
    validationErrors: ValidationError[];
    validatedAt: Date;
    validationDurationMs: number;
}
/**
 * Migration item reference
 */
export interface MigrationItemReference {
    itemType: MigrationItemType;
    sourceId: string;
    targetId?: number;
    subject?: string;
    date?: Date;
    size?: number;
    folderPath?: string;
}
/**
 * Validation error
 */
export interface ValidationError {
    itemReference: MigrationItemReference;
    errorType: 'missing' | 'corrupted' | 'size_mismatch' | 'metadata_mismatch' | 'attachment_missing';
    errorMessage: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
}
/**
 * Migration error details
 */
export interface MigrationError {
    timestamp: Date;
    itemReference?: MigrationItemReference;
    errorCode: string;
    errorMessage: string;
    stackTrace?: string;
    retryable: boolean;
    retryCount: number;
    context?: Record<string, any>;
}
/**
 * Migration rollback plan
 */
export interface RollbackPlan {
    migrationId: string;
    createdAt: Date;
    itemsToDelete: number[];
    foldersToDelete: number[];
    originalState: Record<string, any>;
    checkpoints: RollbackCheckpoint[];
}
/**
 * Rollback checkpoint
 */
export interface RollbackCheckpoint {
    checkpointId: string;
    timestamp: Date;
    itemsProcessed: number;
    canRollbackTo: boolean;
    state: Record<string, any>;
}
/**
 * Migration report
 */
export interface MigrationReport {
    migrationId: string;
    sourceType: MigrationSourceType;
    strategy: MigrationStrategy;
    status: MigrationStatus;
    startedAt: Date;
    completedAt?: Date;
    durationMs: number;
    totalItems: number;
    successfulItems: number;
    failedItems: number;
    skippedItems: number;
    itemTypeBreakdown: Record<MigrationItemType, number>;
    foldersMigrated: number;
    totalSizeMB: number;
    averageItemSizeKB: number;
    itemsPerSecond: number;
    errors: MigrationError[];
    validationResult?: ValidationResult;
    performanceMetrics: PerformanceMetrics;
    recommendations: string[];
}
/**
 * Performance metrics
 */
export interface PerformanceMetrics {
    peakMemoryUsageMB: number;
    averageMemoryUsageMB: number;
    peakCpuPercent: number;
    averageCpuPercent: number;
    networkBytesReceived: number;
    networkBytesSent: number;
    databaseOperations: number;
    cacheHitRate: number;
    bottlenecks: string[];
}
/**
 * Incremental sync state
 */
export interface IncrementalSyncState {
    migrationId: string;
    lastSyncTimestamp: Date;
    syncToken?: string;
    highWaterMark?: string;
    processedItemIds: Set<string>;
    folderSyncStates: Record<string, FolderSyncState>;
}
/**
 * Folder sync state
 */
export interface FolderSyncState {
    folderId: string;
    folderPath: string;
    lastSyncTimestamp: Date;
    syncToken?: string;
    itemCount: number;
    lastModifiedItem?: Date;
}
/**
 * Duplicate detection result
 */
export interface DuplicateDetectionResult {
    isDuplicate: boolean;
    existingItemId?: number;
    matchConfidence: number;
    matchedFields: string[];
    detectionMethod: 'messageId' | 'subject' | 'hash' | 'fuzzy';
}
/**
 * PST folder structure
 */
export interface PSTFolderNode {
    name: string;
    path: string;
    itemCount: number;
    subfolders: PSTFolderNode[];
    folderType: string;
}
/**
 * Parsed email message
 */
export interface ParsedEmailMessage {
    messageId?: string;
    from?: string;
    to?: string[];
    cc?: string[];
    bcc?: string[];
    subject?: string;
    date?: Date;
    bodyText?: string;
    bodyHtml?: string;
    headers?: Record<string, string>;
    attachments?: ParsedAttachment[];
    inReplyTo?: string;
    references?: string[];
    priority?: 'low' | 'normal' | 'high';
    size: number;
    rawContent?: Buffer;
}
/**
 * Parsed attachment
 */
export interface ParsedAttachment {
    filename: string;
    contentType: string;
    size: number;
    content: Buffer;
    contentId?: string;
    isInline: boolean;
    checksum?: string;
}
/**
 * Migration job model attributes
 */
export declare class MigrationJob extends Model<InferAttributes<MigrationJob>, InferCreationAttributes<MigrationJob>> {
    id: CreationOptional<number>;
    userId: number;
    sourceType: MigrationSourceType;
    strategy: MigrationStrategy;
    status: MigrationStatus;
    config: object;
    totalItems: number;
    processedItems: number;
    successfulItems: number;
    failedItems: number;
    skippedItems: number;
    startedAt: CreationOptional<Date>;
    completedAt: Date | null;
    lastError: string | null;
    progressData: object | null;
    validationData: object | null;
    rollbackData: object | null;
    reportData: object | null;
    createdAt: CreationOptional<Date>;
    updatedAt: CreationOptional<Date>;
}
/**
 * Migrated item tracking model
 */
export declare class MigratedItem extends Model<InferAttributes<MigratedItem>, InferCreationAttributes<MigratedItem>> {
    id: CreationOptional<number>;
    migrationJobId: number;
    itemType: MigrationItemType;
    sourceIdentifier: string;
    targetItemId: number | null;
    targetFolderId: number | null;
    sourceFolder: string | null;
    subject: string | null;
    dateSource: Date | null;
    size: number;
    checksum: string | null;
    status: 'success' | 'failed' | 'skipped';
    errorMessage: string | null;
    metadata: object | null;
    migratedAt: CreationOptional<Date>;
    createdAt: CreationOptional<Date>;
    updatedAt: CreationOptional<Date>;
}
/**
 * Migration sync state model
 */
export declare class MigrationSyncState extends Model<InferAttributes<MigrationSyncState>, InferCreationAttributes<MigrationSyncState>> {
    id: CreationOptional<number>;
    migrationJobId: number;
    syncKey: string;
    syncValue: string;
    lastSyncAt: Date;
    metadata: object | null;
    createdAt: CreationOptional<Date>;
    updatedAt: CreationOptional<Date>;
}
/**
 * Defines MigrationJob model schema
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<MigrationJob>} MigrationJob model
 *
 * @example
 * ```typescript
 * const MigrationJobModel = defineMigrationJobModel(sequelize);
 * await MigrationJobModel.sync();
 * ```
 *
 * @swagger
 * components:
 *   schemas:
 *     MigrationJob:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         userId:
 *           type: integer
 *         sourceType:
 *           type: string
 *           enum: [pst, mbox, eml, exchange_server, imap, gmail, gsuite, office365]
 *         strategy:
 *           type: string
 *           enum: [full_migration, incremental_sync, delta_sync, snapshot_copy]
 *         status:
 *           type: string
 *           enum: [pending, in_progress, paused, completed, failed, cancelled]
 */
export declare function defineMigrationJobModel(sequelize: Sequelize): ModelStatic<MigrationJob>;
/**
 * Defines MigratedItem model schema
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<MigratedItem>} MigratedItem model
 *
 * @example
 * ```typescript
 * const MigratedItemModel = defineMigratedItemModel(sequelize);
 * await MigratedItemModel.sync();
 * ```
 *
 * @swagger
 * components:
 *   schemas:
 *     MigratedItem:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         migrationJobId:
 *           type: integer
 *         itemType:
 *           type: string
 *           enum: [email, contact, calendar, task, note, folder, attachment]
 */
export declare function defineMigratedItemModel(sequelize: Sequelize): ModelStatic<MigratedItem>;
/**
 * Defines MigrationSyncState model schema
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<MigrationSyncState>} MigrationSyncState model
 *
 * @example
 * ```typescript
 * const SyncStateModel = defineMigrationSyncStateModel(sequelize);
 * await SyncStateModel.sync();
 * ```
 */
export declare function defineMigrationSyncStateModel(sequelize: Sequelize): ModelStatic<MigrationSyncState>;
/**
 * Analyzes PST file structure and returns folder hierarchy.
 * Scans PST file without importing to estimate migration scope.
 *
 * @param {string} pstFilePath - Path to PST file
 * @returns {Promise<PSTFolderNode>} Folder structure tree
 *
 * @example
 * ```typescript
 * const structure = await analyzePSTFileStructure('/path/to/mailbox.pst');
 * console.log(`Total folders: ${countFolders(structure)}`);
 * console.log(`Total items: ${structure.itemCount}`);
 * ```
 *
 * @swagger
 * /api/migration/pst/analyze:
 *   post:
 *     summary: Analyze PST file structure
 *     tags: [Migration]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pstFilePath:
 *                 type: string
 *     responses:
 *       200:
 *         description: PST structure analysis
 */
export declare function analyzePSTFileStructure(pstFilePath: string): Promise<PSTFolderNode>;
/**
 * Imports emails from PST file into target mailbox.
 * Supports password-protected PST files and preserves folder structure.
 *
 * @param {PSTImportConfig} config - PST import configuration
 * @param {(progress: MigrationProgress) => void} onProgress - Progress callback
 * @returns {Promise<MigrationReport>} Import results and statistics
 *
 * @example
 * ```typescript
 * const report = await importFromPSTFile({
 *   filePath: '/uploads/mailbox.pst',
 *   userId: 123,
 *   includeSubfolders: true,
 *   includeAttachments: true,
 *   skipCorruptedItems: true,
 *   migrationConfig: { sourceType: MigrationSourceType.PST, strategy: MigrationStrategy.FullMigration, batchSize: 100, ... }
 * }, (progress) => {
 *   console.log(`Progress: ${progress.percentComplete}%`);
 * });
 * ```
 *
 * @swagger
 * /api/migration/pst/import:
 *   post:
 *     summary: Import PST file
 *     tags: [Migration]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PSTImportConfig'
 */
export declare function importFromPSTFile(config: PSTImportConfig, onProgress?: (progress: MigrationProgress) => void): Promise<MigrationReport>;
/**
 * Extracts single message from PST file by identifier.
 * Useful for selective migration or troubleshooting.
 *
 * @param {string} pstFilePath - Path to PST file
 * @param {string} messageIdentifier - Message ID or path
 * @returns {Promise<ParsedEmailMessage>} Parsed email message
 *
 * @example
 * ```typescript
 * const message = await extractPSTMessage('/path/to/file.pst', 'msg_12345');
 * console.log(message.subject);
 * ```
 */
export declare function extractPSTMessage(pstFilePath: string, messageIdentifier: string): Promise<ParsedEmailMessage>;
/**
 * Validates PST file integrity before migration.
 * Checks for corruption, password protection, and compatibility.
 *
 * @param {string} pstFilePath - Path to PST file
 * @param {string} password - Optional password for encrypted PST
 * @returns {Promise<{ valid: boolean; errors: string[]; warnings: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validatePSTFile('/path/to/mailbox.pst');
 * if (!validation.valid) {
 *   console.error('PST validation failed:', validation.errors);
 * }
 * ```
 */
export declare function validatePSTFile(pstFilePath: string, password?: string): Promise<{
    valid: boolean;
    errors: string[];
    warnings: string[];
}>;
/**
 * Imports emails from MBOX file into target mailbox.
 * Supports various MBOX formats (mboxrd, mboxo, mboxcl).
 *
 * @param {MBoxImportConfig} config - MBOX import configuration
 * @param {(progress: MigrationProgress) => void} onProgress - Progress callback
 * @returns {Promise<MigrationReport>} Import results
 *
 * @example
 * ```typescript
 * const report = await importFromMBoxFile({
 *   filePath: '/path/to/mailbox.mbox',
 *   userId: 123,
 *   format: 'mboxrd',
 *   preserveLabels: true,
 *   migrationConfig: { ... }
 * });
 * ```
 *
 * @swagger
 * /api/migration/mbox/import:
 *   post:
 *     summary: Import MBOX file
 *     tags: [Migration]
 */
export declare function importFromMBoxFile(config: MBoxImportConfig, onProgress?: (progress: MigrationProgress) => void): Promise<MigrationReport>;
/**
 * Counts messages in MBOX file without importing.
 * Fast scan to estimate migration scope.
 *
 * @param {string} mboxFilePath - Path to MBOX file
 * @returns {Promise<number>} Total message count
 *
 * @example
 * ```typescript
 * const count = await countMBoxMessages('/path/to/mailbox.mbox');
 * console.log(`MBOX contains ${count} messages`);
 * ```
 */
export declare function countMBoxMessages(mboxFilePath: string): Promise<number>;
/**
 * Imports emails from EML files in directory.
 * Recursively scans directory and imports all .eml files.
 *
 * @param {EMLImportConfig} config - EML import configuration
 * @param {(progress: MigrationProgress) => void} onProgress - Progress callback
 * @returns {Promise<MigrationReport>} Import results
 *
 * @example
 * ```typescript
 * const report = await importFromEMLFiles({
 *   directoryPath: '/path/to/eml/files',
 *   userId: 123,
 *   recursive: true,
 *   filePattern: /\.eml$/i,
 *   migrationConfig: { ... }
 * });
 * ```
 *
 * @swagger
 * /api/migration/eml/import:
 *   post:
 *     summary: Import EML files from directory
 *     tags: [Migration]
 */
export declare function importFromEMLFiles(config: EMLImportConfig, onProgress?: (progress: MigrationProgress) => void): Promise<MigrationReport>;
/**
 * Parses single EML file into structured message.
 * Uses mailparser to extract headers, body, and attachments.
 *
 * @param {string} emlFilePath - Path to EML file
 * @returns {Promise<ParsedEmailMessage>} Parsed message
 *
 * @example
 * ```typescript
 * const message = await parseEMLFile('/path/to/message.eml');
 * console.log(`From: ${message.from}, Subject: ${message.subject}`);
 * ```
 */
export declare function parseEMLFile(emlFilePath: string): Promise<ParsedEmailMessage>;
/**
 * Migrates mailbox from Exchange Server to White Cross platform.
 * Uses EWS protocol to connect and extract mailbox data.
 *
 * @param {ExchangeMigrationConfig} config - Exchange migration configuration
 * @param {(progress: MigrationProgress) => void} onProgress - Progress callback
 * @returns {Promise<MigrationReport>} Migration results
 *
 * @example
 * ```typescript
 * const report = await migrateFromExchangeServer({
 *   serverUrl: 'https://exchange.company.com/EWS/Exchange.asmx',
 *   username: 'user@company.com',
 *   password: 'password',
 *   authType: 'basic',
 *   version: 'Exchange2016',
 *   sourceMailbox: 'user@company.com',
 *   targetUserId: 123,
 *   useAutoDiscover: true,
 *   migrationConfig: { ... }
 * });
 * ```
 *
 * @swagger
 * /api/migration/exchange/migrate:
 *   post:
 *     summary: Migrate from Exchange Server
 *     tags: [Migration]
 */
export declare function migrateFromExchangeServer(config: ExchangeMigrationConfig, onProgress?: (progress: MigrationProgress) => void): Promise<MigrationReport>;
/**
 * Tests Exchange Server connection and permissions.
 * Validates credentials and required access rights.
 *
 * @param {ExchangeMigrationConfig} config - Exchange configuration
 * @returns {Promise<{ success: boolean; message: string; folders?: string[] }>} Test result
 *
 * @example
 * ```typescript
 * const test = await testExchangeConnection(config);
 * if (test.success) {
 *   console.log('Connection successful, folders:', test.folders);
 * }
 * ```
 */
export declare function testExchangeConnection(config: ExchangeMigrationConfig): Promise<{
    success: boolean;
    message: string;
    folders?: string[];
}>;
/**
 * Migrates mailbox via IMAP protocol.
 * Connects to IMAP server and retrieves all messages.
 *
 * @param {IMAPMigrationConfig} config - IMAP migration configuration
 * @param {(progress: MigrationProgress) => void} onProgress - Progress callback
 * @returns {Promise<MigrationReport>} Migration results
 *
 * @example
 * ```typescript
 * const report = await migrateViaIMAP({
 *   host: 'imap.gmail.com',
 *   port: 993,
 *   secure: true,
 *   username: 'user@gmail.com',
 *   password: 'app-password',
 *   targetUserId: 123,
 *   migrationConfig: { ... }
 * });
 * ```
 *
 * @swagger
 * /api/migration/imap/migrate:
 *   post:
 *     summary: Migrate via IMAP
 *     tags: [Migration]
 */
export declare function migrateViaIMAP(config: IMAPMigrationConfig, onProgress?: (progress: MigrationProgress) => void): Promise<MigrationReport>;
/**
 * Lists IMAP folders from server.
 * Retrieves folder hierarchy without migrating.
 *
 * @param {IMAPMigrationConfig} config - IMAP configuration
 * @returns {Promise<string[]>} List of folder paths
 *
 * @example
 * ```typescript
 * const folders = await listIMAPFolders(config);
 * console.log('Available folders:', folders);
 * ```
 */
export declare function listIMAPFolders(config: IMAPMigrationConfig): Promise<string[]>;
/**
 * Migrates mailbox from Gmail/G Suite via API.
 * Uses Gmail API with service account or OAuth2.
 *
 * @param {GmailMigrationConfig} config - Gmail migration configuration
 * @param {(progress: MigrationProgress) => void} onProgress - Progress callback
 * @returns {Promise<MigrationReport>} Migration results
 *
 * @example
 * ```typescript
 * const report = await migrateFromGmail({
 *   serviceAccountKey: '/path/to/service-account.json',
 *   userEmail: 'user@company.com',
 *   targetUserId: 123,
 *   includeSpam: false,
 *   includeTrash: false,
 *   migrationConfig: { ... }
 * });
 * ```
 *
 * @swagger
 * /api/migration/gmail/migrate:
 *   post:
 *     summary: Migrate from Gmail/G Suite
 *     tags: [Migration]
 */
export declare function migrateFromGmail(config: GmailMigrationConfig, onProgress?: (progress: MigrationProgress) => void): Promise<MigrationReport>;
/**
 * Retrieves Gmail labels for mapping.
 * Lists all labels to create folder mapping.
 *
 * @param {GmailMigrationConfig} config - Gmail configuration
 * @returns {Promise<Array<{ id: string; name: string }>>} Gmail labels
 *
 * @example
 * ```typescript
 * const labels = await getGmailLabels(config);
 * labels.forEach(label => console.log(`${label.name}: ${label.id}`));
 * ```
 */
export declare function getGmailLabels(config: GmailMigrationConfig): Promise<Array<{
    id: string;
    name: string;
}>>;
/**
 * Migrates mailbox from Office 365 via Microsoft Graph API.
 * Uses modern authentication with Microsoft Graph.
 *
 * @param {Office365MigrationConfig} config - Office 365 migration configuration
 * @param {(progress: MigrationProgress) => void} onProgress - Progress callback
 * @returns {Promise<MigrationReport>} Migration results
 *
 * @example
 * ```typescript
 * const report = await migrateFromOffice365({
 *   tenantId: 'tenant-id',
 *   clientId: 'client-id',
 *   clientSecret: 'secret',
 *   sourceMailbox: 'user@company.onmicrosoft.com',
 *   targetUserId: 123,
 *   useModernAuth: true,
 *   migrationConfig: { ... }
 * });
 * ```
 *
 * @swagger
 * /api/migration/office365/migrate:
 *   post:
 *     summary: Migrate from Office 365
 *     tags: [Migration]
 */
export declare function migrateFromOffice365(config: Office365MigrationConfig, onProgress?: (progress: MigrationProgress) => void): Promise<MigrationReport>;
/**
 * Executes bulk migration for multiple users.
 * Manages parallel migrations with queue and error handling.
 *
 * @param {BulkMigrationConfig} config - Bulk migration configuration
 * @param {(userId: number, progress: MigrationProgress) => void} onUserProgress - Per-user progress callback
 * @returns {Promise<MigrationReport[]>} Array of migration reports
 *
 * @example
 * ```typescript
 * const reports = await executeBulkMigration({
 *   sourceType: MigrationSourceType.IMAP,
 *   users: [
 *     { sourceIdentifier: 'user1@old.com', targetUserId: 101 },
 *     { sourceIdentifier: 'user2@old.com', targetUserId: 102 }
 *   ],
 *   parallelMigrations: 3,
 *   baseMigrationConfig: { ... }
 * });
 * ```
 *
 * @swagger
 * /api/migration/bulk/execute:
 *   post:
 *     summary: Execute bulk user migration
 *     tags: [Migration]
 */
export declare function executeBulkMigration(config: BulkMigrationConfig, onUserProgress?: (userId: number, progress: MigrationProgress) => void): Promise<MigrationReport[]>;
/**
 * Estimates bulk migration duration and requirements.
 * Analyzes all users and calculates time and resource needs.
 *
 * @param {BulkMigrationConfig} config - Bulk migration configuration
 * @returns {Promise<{ estimatedDurationHours: number; estimatedSizeGB: number; recommendedParallelism: number }>} Estimates
 *
 * @example
 * ```typescript
 * const estimate = await estimateBulkMigration(config);
 * console.log(`Estimated duration: ${estimate.estimatedDurationHours} hours`);
 * ```
 */
export declare function estimateBulkMigration(config: BulkMigrationConfig): Promise<{
    estimatedDurationHours: number;
    estimatedSizeGB: number;
    recommendedParallelism: number;
}>;
/**
 * Performs incremental sync of mailbox changes.
 * Only migrates new/modified items since last sync.
 *
 * @param {number} migrationJobId - Original migration job ID
 * @param {(progress: MigrationProgress) => void} onProgress - Progress callback
 * @returns {Promise<MigrationReport>} Incremental sync results
 *
 * @example
 * ```typescript
 * const report = await performIncrementalSync(456, (progress) => {
 *   console.log(`Syncing: ${progress.processedItems} new items`);
 * });
 * ```
 *
 * @swagger
 * /api/migration/{id}/incremental-sync:
 *   post:
 *     summary: Perform incremental sync
 *     tags: [Migration]
 */
export declare function performIncrementalSync(migrationJobId: number, onProgress?: (progress: MigrationProgress) => void): Promise<MigrationReport>;
/**
 * Retrieves incremental sync state for migration job.
 * Gets last sync timestamp and processed items.
 *
 * @param {number} migrationJobId - Migration job ID
 * @returns {Promise<IncrementalSyncState>} Current sync state
 *
 * @example
 * ```typescript
 * const syncState = await getIncrementalSyncState(456);
 * console.log(`Last sync: ${syncState.lastSyncTimestamp}`);
 * ```
 */
export declare function getIncrementalSyncState(migrationJobId: number): Promise<IncrementalSyncState>;
/**
 * Validates migration completeness and accuracy.
 * Compares source and target to verify all items migrated correctly.
 *
 * @param {number} migrationJobId - Migration job ID to validate
 * @param {boolean} deepValidation - Perform deep content comparison
 * @returns {Promise<ValidationResult>} Validation results
 *
 * @example
 * ```typescript
 * const validation = await validateMigration(789, true);
 * if (!validation.isValid) {
 *   console.error(`Missing ${validation.missingItems} items`);
 * }
 * ```
 *
 * @swagger
 * /api/migration/{id}/validate:
 *   post:
 *     summary: Validate migration
 *     tags: [Migration]
 */
export declare function validateMigration(migrationJobId: number, deepValidation?: boolean): Promise<ValidationResult>;
/**
 * Verifies individual migrated item integrity.
 * Compares checksum and metadata between source and target.
 *
 * @param {number} migratedItemId - Migrated item ID
 * @returns {Promise<{ valid: boolean; errors: string[] }>} Item validation result
 *
 * @example
 * ```typescript
 * const itemValid = await verifyMigratedItem(12345);
 * if (!itemValid.valid) {
 *   console.error('Item validation errors:', itemValid.errors);
 * }
 * ```
 */
export declare function verifyMigratedItem(migratedItemId: number): Promise<{
    valid: boolean;
    errors: string[];
}>;
/**
 * Retrieves current migration progress.
 * Gets real-time status of ongoing migration.
 *
 * @param {number} migrationJobId - Migration job ID
 * @returns {Promise<MigrationProgress>} Current progress
 *
 * @example
 * ```typescript
 * const progress = await getMigrationProgress(456);
 * console.log(`${progress.percentComplete}% complete`);
 * console.log(`${progress.successfulItems}/${progress.totalItems} items migrated`);
 * ```
 *
 * @swagger
 * /api/migration/{id}/progress:
 *   get:
 *     summary: Get migration progress
 *     tags: [Migration]
 *     responses:
 *       200:
 *         description: Migration progress
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MigrationProgress'
 */
export declare function getMigrationProgress(migrationJobId: number): Promise<MigrationProgress>;
/**
 * Updates migration progress in database.
 * Called periodically during migration to persist progress.
 *
 * @param {number} migrationJobId - Migration job ID
 * @param {Partial<MigrationProgress>} progress - Progress update
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await updateMigrationProgress(456, {
 *   processedItems: 750,
 *   successfulItems: 740,
 *   percentComplete: 75
 * });
 * ```
 */
export declare function updateMigrationProgress(migrationJobId: number, progress: Partial<MigrationProgress>): Promise<void>;
/**
 * Handles migration error and determines retry strategy.
 * Logs error, increments retry count, and decides on retry or fail.
 *
 * @param {number} migrationJobId - Migration job ID
 * @param {MigrationError} error - Error details
 * @returns {Promise<{ shouldRetry: boolean; delayMs: number }>} Retry decision
 *
 * @example
 * ```typescript
 * const decision = await handleMigrationError(456, {
 *   timestamp: new Date(),
 *   errorCode: 'NETWORK_TIMEOUT',
 *   errorMessage: 'Connection timed out',
 *   retryable: true,
 *   retryCount: 2
 * });
 * ```
 */
export declare function handleMigrationError(migrationJobId: number, error: MigrationError): Promise<{
    shouldRetry: boolean;
    delayMs: number;
}>;
/**
 * Creates rollback plan for migration.
 * Records all changes for potential rollback.
 *
 * @param {number} migrationJobId - Migration job ID
 * @returns {Promise<RollbackPlan>} Rollback plan
 *
 * @example
 * ```typescript
 * const plan = await createRollbackPlan(456);
 * console.log(`Can rollback ${plan.itemsToDelete.length} items`);
 * ```
 */
export declare function createRollbackPlan(migrationJobId: number): Promise<RollbackPlan>;
/**
 * Executes migration rollback.
 * Removes migrated items and restores original state.
 *
 * @param {number} migrationJobId - Migration job ID
 * @param {string} checkpointId - Optional checkpoint to rollback to
 * @returns {Promise<{ success: boolean; itemsRemoved: number; errors: string[] }>} Rollback result
 *
 * @example
 * ```typescript
 * const result = await rollbackMigration(456);
 * if (result.success) {
 *   console.log(`Rolled back ${result.itemsRemoved} items`);
 * }
 * ```
 *
 * @swagger
 * /api/migration/{id}/rollback:
 *   post:
 *     summary: Rollback migration
 *     tags: [Migration]
 */
export declare function rollbackMigration(migrationJobId: number, checkpointId?: string): Promise<{
    success: boolean;
    itemsRemoved: number;
    errors: string[];
}>;
/**
 * Generates comprehensive migration report.
 * Creates detailed report with statistics, errors, and recommendations.
 *
 * @param {number} migrationJobId - Migration job ID
 * @returns {Promise<MigrationReport>} Complete migration report
 *
 * @example
 * ```typescript
 * const report = await generateMigrationReport(456);
 * console.log(`Migration completed in ${report.durationMs}ms`);
 * console.log(`Success rate: ${report.successfulItems / report.totalItems * 100}%`);
 * ```
 *
 * @swagger
 * /api/migration/{id}/report:
 *   get:
 *     summary: Get migration report
 *     tags: [Migration]
 *     responses:
 *       200:
 *         description: Migration report
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MigrationReport'
 */
export declare function generateMigrationReport(migrationJobId: number): Promise<MigrationReport>;
/**
 * Exports migration report to various formats.
 * Generates PDF, CSV, or JSON report.
 *
 * @param {MigrationReport} report - Migration report
 * @param {string} format - Output format (pdf, csv, json)
 * @returns {Promise<Buffer>} Report file content
 *
 * @example
 * ```typescript
 * const report = await generateMigrationReport(456);
 * const pdfBuffer = await exportMigrationReport(report, 'pdf');
 * fs.writeFileSync('migration-report.pdf', pdfBuffer);
 * ```
 */
export declare function exportMigrationReport(report: MigrationReport, format: 'pdf' | 'csv' | 'json'): Promise<Buffer>;
/**
 * Detects if message is duplicate of existing item.
 * Uses configurable detection method (messageId, subject, hash).
 *
 * @param {ParsedEmailMessage} message - Message to check
 * @param {number} userId - Target user ID
 * @param {string} method - Detection method
 * @returns {Promise<DuplicateDetectionResult>} Duplicate detection result
 *
 * @example
 * ```typescript
 * const result = await detectDuplicateMessage(parsedMessage, 123, 'messageId');
 * if (result.isDuplicate) {
 *   console.log(`Duplicate found: ${result.existingItemId}`);
 * }
 * ```
 */
export declare function detectDuplicateMessage(message: ParsedEmailMessage, userId: number, method: 'messageId' | 'subject' | 'hash' | 'fuzzy'): Promise<DuplicateDetectionResult>;
/**
 * Calculates message hash for duplicate detection.
 * Generates stable hash from message content.
 *
 * @param {ParsedEmailMessage} message - Message to hash
 * @returns {string} Message hash
 *
 * @example
 * ```typescript
 * const hash = calculateMessageHash(message);
 * // Use hash for duplicate detection
 * ```
 */
export declare function calculateMessageHash(message: ParsedEmailMessage): string;
/**
 * Generates unique migration job identifier.
 * Creates UUID for migration tracking.
 *
 * @returns {string} Unique migration ID
 *
 * @example
 * ```typescript
 * const migrationId = generateMigrationId();
 * console.log(`Starting migration ${migrationId}`);
 * ```
 */
export declare function generateMigrationId(): string;
/**
 * Pauses ongoing migration.
 * Gracefully stops migration after current batch.
 *
 * @param {number} migrationJobId - Migration job ID
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await pauseMigration(456);
 * console.log('Migration paused');
 * ```
 *
 * @swagger
 * /api/migration/{id}/pause:
 *   post:
 *     summary: Pause migration
 *     tags: [Migration]
 */
export declare function pauseMigration(migrationJobId: number): Promise<void>;
/**
 * Resumes paused migration.
 * Continues migration from last checkpoint.
 *
 * @param {number} migrationJobId - Migration job ID
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await resumeMigration(456);
 * console.log('Migration resumed');
 * ```
 *
 * @swagger
 * /api/migration/{id}/resume:
 *   post:
 *     summary: Resume migration
 *     tags: [Migration]
 */
export declare function resumeMigration(migrationJobId: number): Promise<void>;
/**
 * Cancels migration and cleans up partial results.
 * Stops migration and optionally removes migrated items.
 *
 * @param {number} migrationJobId - Migration job ID
 * @param {boolean} removePartialResults - Whether to remove migrated items
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await cancelMigration(456, true);
 * console.log('Migration cancelled and cleaned up');
 * ```
 *
 * @swagger
 * /api/migration/{id}/cancel:
 *   post:
 *     summary: Cancel migration
 *     tags: [Migration]
 */
export declare function cancelMigration(migrationJobId: number, removePartialResults?: boolean): Promise<void>;
/**
 * Estimates migration duration based on item count and size.
 * Predicts completion time using historical performance data.
 *
 * @param {number} itemCount - Total items to migrate
 * @param {number} totalSizeBytes - Total data size in bytes
 * @param {MigrationSourceType} sourceType - Source type
 * @returns {number} Estimated duration in milliseconds
 *
 * @example
 * ```typescript
 * const estimatedMs = estimateMigrationDuration(1000, 100000000, MigrationSourceType.IMAP);
 * console.log(`Estimated time: ${estimatedMs / 1000 / 60} minutes`);
 * ```
 */
export declare function estimateMigrationDuration(itemCount: number, totalSizeBytes: number, sourceType: MigrationSourceType): number;
/**
 * Sanitizes folder name for compatibility.
 * Removes invalid characters and enforces naming rules.
 *
 * @param {string} folderName - Original folder name
 * @returns {string} Sanitized folder name
 *
 * @example
 * ```typescript
 * const safe = sanitizeFolderName('My/Folder: Test');
 * // Returns: 'My_Folder_ Test'
 * ```
 */
export declare function sanitizeFolderName(folderName: string): string;
/**
 * Maps source folder path to target folder structure.
 * Applies folder mapping rules and creates hierarchy.
 *
 * @param {string} sourcePath - Source folder path
 * @param {Record<string, string>} mapping - Folder mapping rules
 * @returns {string} Target folder path
 *
 * @example
 * ```typescript
 * const targetPath = mapFolderPath('INBOX/Archive', { 'INBOX': 'Inbox' });
 * // Returns: 'Inbox/Archive'
 * ```
 */
export declare function mapFolderPath(sourcePath: string, mapping?: Record<string, string>): string;
/**
 * Validates migration configuration for completeness.
 * Checks required fields and validates settings.
 *
 * @param {MigrationConfig} config - Migration configuration
 * @returns {{ valid: boolean; errors: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateMigrationConfig(config);
 * if (!validation.valid) {
 *   console.error('Config errors:', validation.errors);
 * }
 * ```
 */
export declare function validateMigrationConfig(config: MigrationConfig): {
    valid: boolean;
    errors: string[];
};
//# sourceMappingURL=mail-migration-import-kit.d.ts.map