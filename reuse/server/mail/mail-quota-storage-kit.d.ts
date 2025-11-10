/**
 * LOC: MAILQUOTA001
 * File: /reuse/server/mail/mail-quota-storage-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - @nestjs/schedule
 *   - sequelize (v6.x)
 *   - node-cron
 *   - compression
 *   - archiver
 *   - @aws-sdk/client-s3
 *   - @azure/storage-blob
 *
 * DOWNSTREAM (imported by):
 *   - Mail services
 *   - Email storage controllers
 *   - Mailbox management modules
 *   - Storage analytics services
 *   - Healthcare compliance modules
 */
/**
 * File: /reuse/server/mail/mail-quota-storage-kit.ts
 * Locator: WC-UTL-MAILQUOTA-001
 * Purpose: Enterprise Mail Quota and Storage Management Kit for NestJS - Exchange Server Compatible
 *
 * Upstream: @nestjs/common, sequelize, node-cron, compression, archiver, AWS SDK v3, Azure Storage
 * Downstream: ../backend/*, Mail services, Storage controllers, Analytics services
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, node-cron 3.x
 * Exports: 40 utility functions for quota enforcement, storage calculation, archiving, deduplication, analytics
 *
 * LLM Context: Enterprise-grade mail quota and storage management utilities for White Cross healthcare platform.
 * Provides comprehensive storage quota enforcement (Exchange Server-compatible), per-user/organization quotas,
 * mailbox size calculation, folder size tracking, attachment storage limits, archive/retention policies,
 * storage cleanup/optimization, quota warnings/notifications, storage migration, compression/deduplication,
 * storage analytics/reporting, HIPAA-compliant retention, NestJS scheduled tasks, and Swagger documentation.
 */
import { Model, Sequelize, ModelAttributes, ModelOptions, Transaction } from 'sequelize';
/**
 * Mail storage quota configuration (Exchange Server compatible)
 */
export interface MailQuotaConfig {
    id: string;
    userId?: string;
    organizationId?: string;
    quotaType: 'user' | 'organization' | 'mailbox' | 'shared';
    issueWarningQuota: number;
    prohibitSendQuota: number;
    prohibitSendReceiveQuota: number;
    maxMailboxSize: number;
    maxMessageSize: number;
    maxAttachmentSize: number;
    maxTotalAttachments: number;
    maxFolderSize?: number;
    maxSentItemsSize?: number;
    maxDeletedItemsSize?: number;
    currentSize: number;
    messageCount: number;
    attachmentCount: number;
    status: 'normal' | 'warning' | 'send-blocked' | 'send-receive-blocked';
    lastWarningDate?: Date;
    lastEnforcementDate?: Date;
    enableAutoArchive: boolean;
    autoArchiveAfterDays: number;
    enableCompression: boolean;
    enableDeduplication: boolean;
    retentionPolicyId?: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Mailbox storage statistics
 */
export interface MailboxStorageStats {
    userId: string;
    mailboxId: string;
    totalSize: number;
    messageSize: number;
    attachmentSize: number;
    messageCount: number;
    attachmentCount: number;
    folderStats: Array<{
        folderId: string;
        folderName: string;
        folderType: 'inbox' | 'sent' | 'drafts' | 'trash' | 'archive' | 'custom';
        size: number;
        messageCount: number;
        oldestMessageDate?: Date;
        newestMessageDate?: Date;
    }>;
    storageByMonth: Array<{
        year: number;
        month: number;
        size: number;
        messageCount: number;
    }>;
    quotaConfig: MailQuotaConfig;
    quotaUsagePercent: number;
    quotaStatus: 'normal' | 'warning' | 'send-blocked' | 'send-receive-blocked';
    calculatedAt: Date;
}
/**
 * Storage cleanup configuration
 */
export interface StorageCleanupConfig {
    userId?: string;
    organizationId?: string;
    deleteTrashOlderThanDays: number;
    archiveSentOlderThanDays: number;
    compressAttachmentsOlderThanDays: number;
    deduplicateAttachments: boolean;
    maxTrashSize?: number;
    maxSentItemsSize?: number;
    targetQuotaPercent?: number;
    excludeFolderIds?: string[];
    excludeMessageTypes?: string[];
    protectStarredMessages: boolean;
    protectUnreadMessages: boolean;
    dryRun: boolean;
}
/**
 * Storage cleanup result
 */
export interface StorageCleanupResult {
    startTime: Date;
    endTime: Date;
    durationMs: number;
    dryRun: boolean;
    messagesDeleted: number;
    messagesArchived: number;
    attachmentsCompressed: number;
    attachmentsDeduplicated: number;
    spaceFreedBytes: number;
    spaceFreedMB: number;
    errors: Array<{
        operation: string;
        messageId?: string;
        error: string;
    }>;
    summary: {
        beforeSize: number;
        afterSize: number;
        reductionPercent: number;
    };
}
/**
 * Archive policy configuration
 */
export interface ArchivePolicyConfig {
    id: string;
    name: string;
    description?: string;
    archiveAfterDays: number;
    archiveWhenQuotaPercent?: number;
    archiveFolderTypes: Array<'inbox' | 'sent' | 'drafts' | 'trash' | 'custom'>;
    archiveReadMessagesOnly: boolean;
    archiveUnstarredOnly: boolean;
    minMessageAge: number;
    archiveStorageType: 'local' | 's3' | 'azure' | 'glacier';
    archiveStorageConfig?: any;
    archiveCompress: boolean;
    archiveEncrypt: boolean;
    deleteAfterArchiveDays?: number;
    enabled: boolean;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Retention policy configuration (HIPAA-compliant)
 */
export interface RetentionPolicyConfig {
    id: string;
    name: string;
    description?: string;
    retainInboxDays: number;
    retainSentDays: number;
    retainDraftsDays: number;
    retainTrashDays: number;
    retainArchivedDays: number;
    legalHoldEnabled: boolean;
    legalHoldUntilDate?: Date;
    minimumRetentionDays: number;
    autoDeleteAfterRetention: boolean;
    auditDeletions: boolean;
    neverDeleteTags?: string[];
    enabled: boolean;
    organizationId?: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Quota warning notification
 */
export interface QuotaWarningNotification {
    id: string;
    userId: string;
    quotaConfigId: string;
    warningType: 'approaching' | 'warning-threshold' | 'send-blocked' | 'send-receive-blocked';
    warningLevel: 'info' | 'warning' | 'critical';
    currentSize: number;
    quotaSize: number;
    usagePercent: number;
    message: string;
    actionRequired: string;
    notificationSent: boolean;
    notificationDate?: Date;
    notificationMethod?: 'email' | 'sms' | 'push' | 'in-app';
    acknowledged: boolean;
    acknowledgedDate?: Date;
    createdAt: Date;
}
/**
 * Storage deduplication result
 */
export interface DeduplicationResult {
    totalAttachmentsScanned: number;
    duplicatesFound: number;
    duplicateGroups: Array<{
        checksum: string;
        count: number;
        size: number;
        totalSize: number;
        savedSize: number;
        attachmentIds: string[];
    }>;
    totalSpaceSaved: number;
    executionTimeMs: number;
}
/**
 * Storage compression result
 */
export interface CompressionResult {
    totalFiles: number;
    filesCompressed: number;
    filesFailed: number;
    originalSize: number;
    compressedSize: number;
    spaceSaved: number;
    compressionRatio: number;
    executionTimeMs: number;
    errors: Array<{
        fileId: string;
        error: string;
    }>;
}
/**
 * Storage migration plan
 */
export interface StorageMigrationPlan {
    id: string;
    name: string;
    description?: string;
    sourceStorageType: 'local' | 's3' | 'azure' | 'database';
    targetStorageType: 'local' | 's3' | 'azure' | 'glacier';
    migrateMessagesBefore?: Date;
    migrateAttachmentsLargerThan?: number;
    migrateFolderTypes?: string[];
    migrateUnreadMessages?: boolean;
    batchSize: number;
    concurrency: number;
    throttleMs?: number;
    verifyAfterMigration: boolean;
    keepSourceAfterMigration: boolean;
    deleteSourceAfterDays?: number;
    status: 'pending' | 'running' | 'paused' | 'completed' | 'failed';
    progress: {
        totalItems: number;
        migratedItems: number;
        failedItems: number;
        percentComplete: number;
    };
    startedAt?: Date;
    completedAt?: Date;
    estimatedCompletionAt?: Date;
}
/**
 * Storage analytics report
 */
export interface StorageAnalyticsReport {
    reportId: string;
    generatedAt: Date;
    periodStart: Date;
    periodEnd: Date;
    totalUsers: number;
    totalMailboxes: number;
    totalStorageUsed: number;
    totalMessages: number;
    totalAttachments: number;
    quotaStatistics: {
        averageQuotaUsage: number;
        usersOverQuota: number;
        usersNearQuota: number;
        usersBlocked: number;
    };
    topUsersByStorage: Array<{
        userId: string;
        userName: string;
        storageUsed: number;
        quotaUsage: number;
    }>;
    topMailboxesBySize: Array<{
        mailboxId: string;
        userId: string;
        size: number;
        messageCount: number;
    }>;
    storageGrowth: Array<{
        date: Date;
        totalStorage: number;
        growthRate: number;
    }>;
    storageByType: {
        messages: number;
        attachments: number;
        archived: number;
        deleted: number;
    };
    recommendations: Array<{
        type: 'quota-increase' | 'cleanup' | 'archive' | 'compression' | 'deduplication';
        priority: 'low' | 'medium' | 'high';
        description: string;
        estimatedSavings?: number;
    }>;
}
/**
 * Quota enforcement action
 */
export interface QuotaEnforcementAction {
    id: string;
    userId: string;
    quotaConfigId: string;
    actionType: 'warning-sent' | 'send-blocked' | 'send-receive-blocked' | 'force-cleanup' | 'auto-archive';
    actionReason: string;
    previousStatus: string;
    newStatus: string;
    actionTaken: boolean;
    actionDate: Date;
    actionDetails?: Record<string, any>;
    reversible: boolean;
    reversedAt?: Date;
    reversedBy?: string;
    notificationSent: boolean;
    auditLogId?: string;
}
/**
 * Sequelize model attributes for mail_quota_configs table
 */
export declare const MailQuotaConfigAttributes: ModelAttributes;
/**
 * Sequelize model options for mail_quota_configs table
 */
export declare const MailQuotaConfigOptions: ModelOptions;
/**
 * Sequelize model attributes for retention_policies table
 */
export declare const RetentionPolicyAttributes: ModelAttributes;
/**
 * Sequelize model options for retention_policies table
 */
export declare const RetentionPolicyOptions: ModelOptions;
/**
 * Sequelize model attributes for quota_warning_notifications table
 */
export declare const QuotaWarningNotificationAttributes: ModelAttributes;
/**
 * Sequelize model options for quota_warning_notifications table
 */
export declare const QuotaWarningNotificationOptions: ModelOptions;
/**
 * Creates and initializes the MailQuotaConfig Sequelize model
 * @param sequelize - Sequelize instance
 * @returns Initialized MailQuotaConfig model
 * @example
 * const MailQuotaConfig = defineMailQuotaConfigModel(sequelize);
 */
export declare function defineMailQuotaConfigModel(sequelize: Sequelize): typeof Model;
/**
 * Creates and initializes the RetentionPolicy Sequelize model
 * @param sequelize - Sequelize instance
 * @returns Initialized RetentionPolicy model
 * @example
 * const RetentionPolicy = defineRetentionPolicyModel(sequelize);
 */
export declare function defineRetentionPolicyModel(sequelize: Sequelize): typeof Model;
/**
 * Creates and initializes the QuotaWarningNotification Sequelize model
 * @param sequelize - Sequelize instance
 * @returns Initialized QuotaWarningNotification model
 * @example
 * const QuotaWarningNotification = defineQuotaWarningNotificationModel(sequelize);
 */
export declare function defineQuotaWarningNotificationModel(sequelize: Sequelize): typeof Model;
/**
 * Creates a new quota configuration for a user or organization
 * @param config - Quota configuration parameters
 * @param sequelize - Sequelize instance
 * @param transaction - Optional transaction
 * @returns Created quota configuration
 * @example
 * const quota = await createQuotaConfig({
 *   userId: 'user-123',
 *   quotaType: 'user',
 *   issueWarningQuota: 1932735283,
 *   prohibitSendQuota: 2147483648,
 *   prohibitSendReceiveQuota: 2469606195
 * }, sequelize);
 */
export declare function createQuotaConfig(config: Partial<MailQuotaConfig>, sequelize: Sequelize, transaction?: Transaction): Promise<MailQuotaConfig>;
/**
 * Retrieves quota configuration for a user
 * @param userId - User ID
 * @param sequelize - Sequelize instance
 * @returns Quota configuration or null
 * @example
 * const quota = await getQuotaConfigByUserId('user-123', sequelize);
 */
export declare function getQuotaConfigByUserId(userId: string, sequelize: Sequelize): Promise<MailQuotaConfig | null>;
/**
 * Updates quota configuration
 * @param quotaConfigId - Quota configuration ID
 * @param updates - Fields to update
 * @param sequelize - Sequelize instance
 * @param transaction - Optional transaction
 * @returns Updated quota configuration
 * @example
 * const updated = await updateQuotaConfig('quota-123', {
 *   currentSize: 1500000000,
 *   status: 'warning'
 * }, sequelize);
 */
export declare function updateQuotaConfig(quotaConfigId: string, updates: Partial<MailQuotaConfig>, sequelize: Sequelize, transaction?: Transaction): Promise<MailQuotaConfig | null>;
/**
 * Checks if a user can send emails based on quota status
 * @param userId - User ID
 * @param sequelize - Sequelize instance
 * @returns Can send status and reason
 * @example
 * const result = await canSendEmail('user-123', sequelize);
 * if (!result.canSend) {
 *   console.log(result.reason);
 * }
 */
export declare function canSendEmail(userId: string, sequelize: Sequelize): Promise<{
    canSend: boolean;
    reason?: string;
    quotaStatus: string;
}>;
/**
 * Checks if a user can receive emails based on quota status
 * @param userId - User ID
 * @param sequelize - Sequelize instance
 * @returns Can receive status and reason
 * @example
 * const result = await canReceiveEmail('user-123', sequelize);
 */
export declare function canReceiveEmail(userId: string, sequelize: Sequelize): Promise<{
    canReceive: boolean;
    reason?: string;
    quotaStatus: string;
}>;
/**
 * Enforces quota limits based on current usage (Exchange Server logic)
 * @param userId - User ID
 * @param sequelize - Sequelize instance
 * @param transaction - Optional transaction
 * @returns Enforcement action taken
 * @example
 * const action = await enforceQuotaLimits('user-123', sequelize);
 * console.log(`Action taken: ${action.actionType}`);
 */
export declare function enforceQuotaLimits(userId: string, sequelize: Sequelize, transaction?: Transaction): Promise<QuotaEnforcementAction>;
/**
 * Calculates total mailbox size for a user
 * @param userId - User ID
 * @param sequelize - Sequelize instance
 * @returns Total mailbox size in bytes
 * @example
 * const size = await calculateMailboxSize('user-123', sequelize);
 * console.log(`Mailbox size: ${formatBytes(size)}`);
 */
export declare function calculateMailboxSize(userId: string, sequelize: Sequelize): Promise<number>;
/**
 * Calculates folder size for a specific folder
 * @param folderId - Folder ID
 * @param sequelize - Sequelize instance
 * @returns Folder size in bytes and message count
 * @example
 * const stats = await calculateFolderSize('folder-123', sequelize);
 */
export declare function calculateFolderSize(folderId: string, sequelize: Sequelize): Promise<{
    size: number;
    messageCount: number;
}>;
/**
 * Calculates detailed mailbox storage statistics
 * @param userId - User ID
 * @param sequelize - Sequelize instance
 * @returns Comprehensive storage statistics
 * @example
 * const stats = await calculateMailboxStorageStats('user-123', sequelize);
 * console.log(`Total: ${formatBytes(stats.totalSize)}`);
 */
export declare function calculateMailboxStorageStats(userId: string, sequelize: Sequelize): Promise<MailboxStorageStats>;
/**
 * Calculates attachment storage for a user
 * @param userId - User ID
 * @param sequelize - Sequelize instance
 * @returns Attachment storage statistics
 * @example
 * const stats = await calculateAttachmentStorage('user-123', sequelize);
 */
export declare function calculateAttachmentStorage(userId: string, sequelize: Sequelize): Promise<{
    totalSize: number;
    count: number;
    averageSize: number;
}>;
/**
 * Updates quota usage after message/attachment operations
 * @param userId - User ID
 * @param sizeChange - Size change in bytes (positive for add, negative for remove)
 * @param messageCountChange - Message count change
 * @param attachmentCountChange - Attachment count change
 * @param sequelize - Sequelize instance
 * @param transaction - Optional transaction
 * @returns Updated quota configuration
 * @example
 * await updateQuotaUsage('user-123', 1024000, 1, 2, sequelize);
 */
export declare function updateQuotaUsage(userId: string, sizeChange: number, messageCountChange: number, attachmentCountChange: number, sequelize: Sequelize, transaction?: Transaction): Promise<MailQuotaConfig | null>;
/**
 * Performs storage cleanup based on configuration
 * @param config - Cleanup configuration
 * @param sequelize - Sequelize instance
 * @returns Cleanup result
 * @example
 * const result = await performStorageCleanup({
 *   userId: 'user-123',
 *   deleteTrashOlderThanDays: 30,
 *   archiveSentOlderThanDays: 180,
 *   dryRun: false
 * }, sequelize);
 */
export declare function performStorageCleanup(config: StorageCleanupConfig, sequelize: Sequelize): Promise<StorageCleanupResult>;
/**
 * Deduplicates attachment storage by identifying duplicate files
 * @param userId - Optional user ID to scope deduplication
 * @param sequelize - Sequelize instance
 * @param transaction - Optional transaction
 * @returns Deduplication result
 * @example
 * const result = await deduplicateAttachmentStorage('user-123', sequelize);
 * console.log(`Saved ${formatBytes(result.totalSpaceSaved)}`);
 */
export declare function deduplicateAttachmentStorage(userId: string | undefined, sequelize: Sequelize, transaction?: Transaction): Promise<DeduplicationResult>;
/**
 * Compresses attachments to save storage space
 * @param attachmentIds - Array of attachment IDs to compress
 * @param compressionLevel - Compression level (1-9)
 * @param sequelize - Sequelize instance
 * @returns Compression result
 * @example
 * const result = await compressAttachments(['att-1', 'att-2'], 6, sequelize);
 */
export declare function compressAttachments(attachmentIds: string[], compressionLevel: number, sequelize: Sequelize): Promise<CompressionResult>;
/**
 * Creates a quota warning notification
 * @param userId - User ID
 * @param quotaConfig - Quota configuration
 * @param warningType - Warning type
 * @param sequelize - Sequelize instance
 * @param transaction - Optional transaction
 * @returns Created notification
 * @example
 * const notification = await createQuotaWarning('user-123', quotaConfig, 'warning-threshold', sequelize);
 */
export declare function createQuotaWarning(userId: string, quotaConfig: MailQuotaConfig, warningType: QuotaWarningNotification['warningType'], sequelize: Sequelize, transaction?: Transaction): Promise<QuotaWarningNotification>;
/**
 * Checks quota status and sends warnings if needed
 * @param userId - User ID
 * @param sequelize - Sequelize instance
 * @returns Array of warnings created
 * @example
 * const warnings = await checkAndSendQuotaWarnings('user-123', sequelize);
 */
export declare function checkAndSendQuotaWarnings(userId: string, sequelize: Sequelize): Promise<QuotaWarningNotification[]>;
/**
 * Retrieves quota warnings for a user
 * @param userId - User ID
 * @param limit - Maximum number of warnings to retrieve
 * @param sequelize - Sequelize instance
 * @returns Array of quota warnings
 * @example
 * const warnings = await getQuotaWarnings('user-123', 10, sequelize);
 */
export declare function getQuotaWarnings(userId: string, limit: number, sequelize: Sequelize): Promise<QuotaWarningNotification[]>;
/**
 * Acknowledges a quota warning notification
 * @param notificationId - Notification ID
 * @param sequelize - Sequelize instance
 * @returns Updated notification
 * @example
 * await acknowledgeQuotaWarning('notif-123', sequelize);
 */
export declare function acknowledgeQuotaWarning(notificationId: string, sequelize: Sequelize): Promise<QuotaWarningNotification | null>;
/**
 * Creates a retention policy
 * @param policy - Retention policy configuration
 * @param sequelize - Sequelize instance
 * @param transaction - Optional transaction
 * @returns Created retention policy
 * @example
 * const policy = await createRetentionPolicy({
 *   name: 'HIPAA Compliance Policy',
 *   retainInboxDays: 365,
 *   minimumRetentionDays: 2555
 * }, sequelize);
 */
export declare function createRetentionPolicy(policy: Partial<RetentionPolicyConfig>, sequelize: Sequelize, transaction?: Transaction): Promise<RetentionPolicyConfig>;
/**
 * Applies retention policy to messages
 * @param policyId - Retention policy ID
 * @param userId - Optional user ID to scope application
 * @param sequelize - Sequelize instance
 * @param dryRun - If true, returns what would be deleted without deleting
 * @returns Count of messages affected
 * @example
 * const count = await applyRetentionPolicy('policy-123', 'user-123', sequelize, false);
 */
export declare function applyRetentionPolicy(policyId: string, userId: string | undefined, sequelize: Sequelize, dryRun: boolean): Promise<{
    messagesDeleted: number;
    messagesArchived: number;
}>;
/**
 * Archives messages based on archive policy
 * @param policyConfig - Archive policy configuration
 * @param sequelize - Sequelize instance
 * @returns Archive result
 * @example
 * const result = await archiveMessages({
 *   archiveAfterDays: 180,
 *   archiveFolderTypes: ['inbox', 'sent']
 * }, sequelize);
 */
export declare function archiveMessages(policyConfig: Partial<ArchivePolicyConfig>, sequelize: Sequelize): Promise<{
    messagesArchived: number;
    spaceArchived: number;
}>;
/**
 * Generates comprehensive storage analytics report
 * @param organizationId - Optional organization ID to scope report
 * @param periodDays - Number of days to include in report
 * @param sequelize - Sequelize instance
 * @returns Storage analytics report
 * @example
 * const report = await generateStorageAnalyticsReport('org-123', 30, sequelize);
 */
export declare function generateStorageAnalyticsReport(organizationId: string | undefined, periodDays: number, sequelize: Sequelize): Promise<StorageAnalyticsReport>;
/**
 * Gets storage growth trend over time
 * @param userId - Optional user ID to scope trend
 * @param days - Number of days to analyze
 * @param sequelize - Sequelize instance
 * @returns Array of daily storage data points
 * @example
 * const trend = await getStorageGrowthTrend('user-123', 30, sequelize);
 */
export declare function getStorageGrowthTrend(userId: string | undefined, days: number, sequelize: Sequelize): Promise<Array<{
    date: Date;
    totalStorage: number;
    growthRate: number;
}>>;
/**
 * Formats bytes to human-readable string
 * @param bytes - Number of bytes
 * @param decimals - Number of decimal places
 * @returns Formatted string (e.g., "1.5 GB")
 * @example
 * console.log(formatBytes(1536000000)); // "1.43 GB"
 */
export declare function formatBytes(bytes: number, decimals?: number): string;
/**
 * Converts human-readable size to bytes
 * @param sizeString - Size string (e.g., "2.5GB", "100MB")
 * @returns Size in bytes
 * @example
 * const bytes = parseSizeString('2.5GB'); // 2684354560
 */
export declare function parseSizeString(sizeString: string): number;
/**
 * Calculates quota usage percentage
 * @param currentSize - Current storage size in bytes
 * @param quotaSize - Quota limit in bytes
 * @returns Usage percentage
 * @example
 * const percent = calculateQuotaPercentage(1500000000, 2147483648); // 69.8%
 */
export declare function calculateQuotaPercentage(currentSize: number, quotaSize: number): number;
/**
 * Determines quota status based on current size and thresholds
 * @param currentSize - Current storage size
 * @param config - Quota configuration
 * @returns Quota status
 * @example
 * const status = determineQuotaStatus(2000000000, quotaConfig);
 */
export declare function determineQuotaStatus(currentSize: number, config: MailQuotaConfig): MailQuotaConfig['status'];
/**
 * NestJS decorator for Swagger quota status documentation
 * @returns Swagger decorator
 * @example
 * @Get('quota/status')
 * @ApiQuotaStatus()
 * async getQuotaStatus() {}
 */
export declare function ApiQuotaStatus(): MethodDecorator;
/**
 * NestJS decorator for Swagger storage analytics documentation
 * @returns Swagger decorator
 * @example
 * @Get('analytics/storage')
 * @ApiStorageAnalytics()
 * async getStorageAnalytics() {}
 */
export declare function ApiStorageAnalytics(): MethodDecorator;
/**
 * Creates NestJS cron job for quota enforcement
 * @param sequelize - Sequelize instance
 * @param cronExpression - Cron expression (default: every hour)
 * @returns Cron job function
 * @example
 * const job = createQuotaEnforcementCronJob(sequelize, '0 * * * *');
 */
export declare function createQuotaEnforcementCronJob(sequelize: Sequelize, cronExpression?: string): () => Promise<void>;
/**
 * Creates NestJS cron job for automatic cleanup
 * @param sequelize - Sequelize instance
 * @param cronExpression - Cron expression (default: daily at 2 AM)
 * @returns Cron job function
 * @example
 * const job = createStorageCleanupCronJob(sequelize, '0 2 * * *');
 */
export declare function createStorageCleanupCronJob(sequelize: Sequelize, cronExpression?: string): () => Promise<void>;
//# sourceMappingURL=mail-quota-storage-kit.d.ts.map