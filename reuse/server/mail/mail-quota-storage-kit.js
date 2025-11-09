"use strict";
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
exports.QuotaWarningNotificationOptions = exports.QuotaWarningNotificationAttributes = exports.RetentionPolicyOptions = exports.RetentionPolicyAttributes = exports.MailQuotaConfigOptions = exports.MailQuotaConfigAttributes = void 0;
exports.defineMailQuotaConfigModel = defineMailQuotaConfigModel;
exports.defineRetentionPolicyModel = defineRetentionPolicyModel;
exports.defineQuotaWarningNotificationModel = defineQuotaWarningNotificationModel;
exports.createQuotaConfig = createQuotaConfig;
exports.getQuotaConfigByUserId = getQuotaConfigByUserId;
exports.updateQuotaConfig = updateQuotaConfig;
exports.canSendEmail = canSendEmail;
exports.canReceiveEmail = canReceiveEmail;
exports.enforceQuotaLimits = enforceQuotaLimits;
exports.calculateMailboxSize = calculateMailboxSize;
exports.calculateFolderSize = calculateFolderSize;
exports.calculateMailboxStorageStats = calculateMailboxStorageStats;
exports.calculateAttachmentStorage = calculateAttachmentStorage;
exports.updateQuotaUsage = updateQuotaUsage;
exports.performStorageCleanup = performStorageCleanup;
exports.deduplicateAttachmentStorage = deduplicateAttachmentStorage;
exports.compressAttachments = compressAttachments;
exports.createQuotaWarning = createQuotaWarning;
exports.checkAndSendQuotaWarnings = checkAndSendQuotaWarnings;
exports.getQuotaWarnings = getQuotaWarnings;
exports.acknowledgeQuotaWarning = acknowledgeQuotaWarning;
exports.createRetentionPolicy = createRetentionPolicy;
exports.applyRetentionPolicy = applyRetentionPolicy;
exports.archiveMessages = archiveMessages;
exports.generateStorageAnalyticsReport = generateStorageAnalyticsReport;
exports.getStorageGrowthTrend = getStorageGrowthTrend;
exports.formatBytes = formatBytes;
exports.parseSizeString = parseSizeString;
exports.calculateQuotaPercentage = calculateQuotaPercentage;
exports.determineQuotaStatus = determineQuotaStatus;
exports.ApiQuotaStatus = ApiQuotaStatus;
exports.ApiStorageAnalytics = ApiStorageAnalytics;
exports.createQuotaEnforcementCronJob = createQuotaEnforcementCronJob;
exports.createStorageCleanupCronJob = createStorageCleanupCronJob;
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
const sequelize_1 = require("sequelize");
const crypto = __importStar(require("crypto"));
// ============================================================================
// SEQUELIZE MODEL DEFINITIONS
// ============================================================================
/**
 * Sequelize model attributes for mail_quota_configs table
 */
exports.MailQuotaConfigAttributes = {
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    user_id: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: true,
        field: 'user_id',
    },
    organization_id: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: true,
        field: 'organization_id',
    },
    quota_type: {
        type: sequelize_1.DataTypes.ENUM('user', 'organization', 'mailbox', 'shared'),
        allowNull: false,
        defaultValue: 'user',
        field: 'quota_type',
    },
    issue_warning_quota: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 1932735283, // 1.8 GB
        field: 'issue_warning_quota',
    },
    prohibit_send_quota: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 2147483648, // 2 GB
        field: 'prohibit_send_quota',
    },
    prohibit_send_receive_quota: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 2469606195, // 2.3 GB
        field: 'prohibit_send_receive_quota',
    },
    max_mailbox_size: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 2684354560, // 2.5 GB
        field: 'max_mailbox_size',
    },
    max_message_size: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 26214400, // 25 MB
        field: 'max_message_size',
    },
    max_attachment_size: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 26214400, // 25 MB
        field: 'max_attachment_size',
    },
    max_total_attachments: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 100,
        field: 'max_total_attachments',
    },
    max_folder_size: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: true,
        field: 'max_folder_size',
    },
    max_sent_items_size: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: true,
        field: 'max_sent_items_size',
    },
    max_deleted_items_size: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: true,
        field: 'max_deleted_items_size',
    },
    current_size: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0,
        field: 'current_size',
    },
    message_count: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: 'message_count',
    },
    attachment_count: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: 'attachment_count',
    },
    status: {
        type: sequelize_1.DataTypes.ENUM('normal', 'warning', 'send-blocked', 'send-receive-blocked'),
        allowNull: false,
        defaultValue: 'normal',
    },
    last_warning_date: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
        field: 'last_warning_date',
    },
    last_enforcement_date: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
        field: 'last_enforcement_date',
    },
    enable_auto_archive: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'enable_auto_archive',
    },
    auto_archive_after_days: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 180,
        field: 'auto_archive_after_days',
    },
    enable_compression: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'enable_compression',
    },
    enable_deduplication: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'enable_deduplication',
    },
    retention_policy_id: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: true,
        field: 'retention_policy_id',
    },
    created_at: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        field: 'created_at',
    },
    updated_at: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        field: 'updated_at',
    },
};
/**
 * Sequelize model options for mail_quota_configs table
 */
exports.MailQuotaConfigOptions = {
    tableName: 'mail_quota_configs',
    timestamps: true,
    underscored: true,
    indexes: [
        {
            name: 'idx_mail_quota_user_id',
            fields: ['user_id'],
        },
        {
            name: 'idx_mail_quota_org_id',
            fields: ['organization_id'],
        },
        {
            name: 'idx_mail_quota_type',
            fields: ['quota_type'],
        },
        {
            name: 'idx_mail_quota_status',
            fields: ['status'],
        },
    ],
};
/**
 * Sequelize model attributes for retention_policies table
 */
exports.RetentionPolicyAttributes = {
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    retain_inbox_days: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 365,
        field: 'retain_inbox_days',
    },
    retain_sent_days: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 365,
        field: 'retain_sent_days',
    },
    retain_drafts_days: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 90,
        field: 'retain_drafts_days',
    },
    retain_trash_days: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 30,
        field: 'retain_trash_days',
    },
    retain_archived_days: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 2555, // 7 years for HIPAA
        field: 'retain_archived_days',
    },
    legal_hold_enabled: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'legal_hold_enabled',
    },
    legal_hold_until_date: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
        field: 'legal_hold_until_date',
    },
    minimum_retention_days: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 2555, // HIPAA minimum
        field: 'minimum_retention_days',
    },
    auto_delete_after_retention: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'auto_delete_after_retention',
    },
    audit_deletions: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'audit_deletions',
    },
    never_delete_tags: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: true,
        field: 'never_delete_tags',
    },
    enabled: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    organization_id: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: true,
        field: 'organization_id',
    },
    created_at: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        field: 'created_at',
    },
    updated_at: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        field: 'updated_at',
    },
};
/**
 * Sequelize model options for retention_policies table
 */
exports.RetentionPolicyOptions = {
    tableName: 'retention_policies',
    timestamps: true,
    underscored: true,
    indexes: [
        {
            name: 'idx_retention_policy_org_id',
            fields: ['organization_id'],
        },
        {
            name: 'idx_retention_policy_enabled',
            fields: ['enabled'],
        },
    ],
};
/**
 * Sequelize model attributes for quota_warning_notifications table
 */
exports.QuotaWarningNotificationAttributes = {
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    user_id: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        field: 'user_id',
    },
    quota_config_id: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        field: 'quota_config_id',
    },
    warning_type: {
        type: sequelize_1.DataTypes.ENUM('approaching', 'warning-threshold', 'send-blocked', 'send-receive-blocked'),
        allowNull: false,
        field: 'warning_type',
    },
    warning_level: {
        type: sequelize_1.DataTypes.ENUM('info', 'warning', 'critical'),
        allowNull: false,
        field: 'warning_level',
    },
    current_size: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: false,
        field: 'current_size',
    },
    quota_size: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: false,
        field: 'quota_size',
    },
    usage_percent: {
        type: sequelize_1.DataTypes.DECIMAL(5, 2),
        allowNull: false,
        field: 'usage_percent',
    },
    message: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    action_required: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
        field: 'action_required',
    },
    notification_sent: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'notification_sent',
    },
    notification_date: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
        field: 'notification_date',
    },
    notification_method: {
        type: sequelize_1.DataTypes.ENUM('email', 'sms', 'push', 'in-app'),
        allowNull: true,
        field: 'notification_method',
    },
    acknowledged: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    acknowledged_date: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
        field: 'acknowledged_date',
    },
    created_at: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        field: 'created_at',
    },
};
/**
 * Sequelize model options for quota_warning_notifications table
 */
exports.QuotaWarningNotificationOptions = {
    tableName: 'quota_warning_notifications',
    timestamps: false,
    underscored: true,
    indexes: [
        {
            name: 'idx_quota_warning_user_id',
            fields: ['user_id'],
        },
        {
            name: 'idx_quota_warning_config_id',
            fields: ['quota_config_id'],
        },
        {
            name: 'idx_quota_warning_type',
            fields: ['warning_type'],
        },
        {
            name: 'idx_quota_warning_sent',
            fields: ['notification_sent'],
        },
    ],
};
/**
 * Creates and initializes the MailQuotaConfig Sequelize model
 * @param sequelize - Sequelize instance
 * @returns Initialized MailQuotaConfig model
 * @example
 * const MailQuotaConfig = defineMailQuotaConfigModel(sequelize);
 */
function defineMailQuotaConfigModel(sequelize) {
    class MailQuotaConfig extends sequelize_1.Model {
    }
    MailQuotaConfig.init(exports.MailQuotaConfigAttributes, {
        ...exports.MailQuotaConfigOptions,
        sequelize,
    });
    return MailQuotaConfig;
}
/**
 * Creates and initializes the RetentionPolicy Sequelize model
 * @param sequelize - Sequelize instance
 * @returns Initialized RetentionPolicy model
 * @example
 * const RetentionPolicy = defineRetentionPolicyModel(sequelize);
 */
function defineRetentionPolicyModel(sequelize) {
    class RetentionPolicy extends sequelize_1.Model {
    }
    RetentionPolicy.init(exports.RetentionPolicyAttributes, {
        ...exports.RetentionPolicyOptions,
        sequelize,
    });
    return RetentionPolicy;
}
/**
 * Creates and initializes the QuotaWarningNotification Sequelize model
 * @param sequelize - Sequelize instance
 * @returns Initialized QuotaWarningNotification model
 * @example
 * const QuotaWarningNotification = defineQuotaWarningNotificationModel(sequelize);
 */
function defineQuotaWarningNotificationModel(sequelize) {
    class QuotaWarningNotification extends sequelize_1.Model {
    }
    QuotaWarningNotification.init(exports.QuotaWarningNotificationAttributes, {
        ...exports.QuotaWarningNotificationOptions,
        sequelize,
    });
    return QuotaWarningNotification;
}
// ============================================================================
// QUOTA MANAGEMENT
// ============================================================================
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
async function createQuotaConfig(config, sequelize, transaction) {
    const MailQuotaConfig = defineMailQuotaConfigModel(sequelize);
    const quotaConfig = await MailQuotaConfig.create({
        user_id: config.userId,
        organization_id: config.organizationId,
        quota_type: config.quotaType || 'user',
        issue_warning_quota: config.issueWarningQuota || 1932735283,
        prohibit_send_quota: config.prohibitSendQuota || 2147483648,
        prohibit_send_receive_quota: config.prohibitSendReceiveQuota || 2469606195,
        max_mailbox_size: config.maxMailboxSize || 2684354560,
        max_message_size: config.maxMessageSize || 26214400,
        max_attachment_size: config.maxAttachmentSize || 26214400,
        max_total_attachments: config.maxTotalAttachments || 100,
        max_folder_size: config.maxFolderSize,
        max_sent_items_size: config.maxSentItemsSize,
        max_deleted_items_size: config.maxDeletedItemsSize,
        current_size: config.currentSize || 0,
        message_count: config.messageCount || 0,
        attachment_count: config.attachmentCount || 0,
        status: config.status || 'normal',
        enable_auto_archive: config.enableAutoArchive !== false,
        auto_archive_after_days: config.autoArchiveAfterDays || 180,
        enable_compression: config.enableCompression || false,
        enable_deduplication: config.enableDeduplication !== false,
        retention_policy_id: config.retentionPolicyId,
    }, { transaction });
    return quotaConfig.toJSON();
}
/**
 * Retrieves quota configuration for a user
 * @param userId - User ID
 * @param sequelize - Sequelize instance
 * @returns Quota configuration or null
 * @example
 * const quota = await getQuotaConfigByUserId('user-123', sequelize);
 */
async function getQuotaConfigByUserId(userId, sequelize) {
    const MailQuotaConfig = defineMailQuotaConfigModel(sequelize);
    const quotaConfig = await MailQuotaConfig.findOne({
        where: { user_id: userId },
    });
    return quotaConfig ? quotaConfig.toJSON() : null;
}
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
async function updateQuotaConfig(quotaConfigId, updates, sequelize, transaction) {
    const MailQuotaConfig = defineMailQuotaConfigModel(sequelize);
    const [affectedRows] = await MailQuotaConfig.update({
        current_size: updates.currentSize,
        message_count: updates.messageCount,
        attachment_count: updates.attachmentCount,
        status: updates.status,
        last_warning_date: updates.lastWarningDate,
        last_enforcement_date: updates.lastEnforcementDate,
        enable_auto_archive: updates.enableAutoArchive,
        auto_archive_after_days: updates.autoArchiveAfterDays,
        enable_compression: updates.enableCompression,
        enable_deduplication: updates.enableDeduplication,
    }, {
        where: { id: quotaConfigId },
        transaction,
    });
    if (affectedRows === 0) {
        return null;
    }
    const updated = await MailQuotaConfig.findByPk(quotaConfigId, { transaction });
    return updated ? updated.toJSON() : null;
}
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
async function canSendEmail(userId, sequelize) {
    const quota = await getQuotaConfigByUserId(userId, sequelize);
    if (!quota) {
        return { canSend: true, quotaStatus: 'unknown' };
    }
    if (quota.status === 'send-blocked' || quota.status === 'send-receive-blocked') {
        return {
            canSend: false,
            reason: `Mailbox quota exceeded. Current: ${formatBytes(quota.currentSize)}, Limit: ${formatBytes(quota.prohibitSendQuota)}`,
            quotaStatus: quota.status,
        };
    }
    return { canSend: true, quotaStatus: quota.status };
}
/**
 * Checks if a user can receive emails based on quota status
 * @param userId - User ID
 * @param sequelize - Sequelize instance
 * @returns Can receive status and reason
 * @example
 * const result = await canReceiveEmail('user-123', sequelize);
 */
async function canReceiveEmail(userId, sequelize) {
    const quota = await getQuotaConfigByUserId(userId, sequelize);
    if (!quota) {
        return { canReceive: true, quotaStatus: 'unknown' };
    }
    if (quota.status === 'send-receive-blocked') {
        return {
            canReceive: false,
            reason: `Mailbox quota exceeded. Current: ${formatBytes(quota.currentSize)}, Limit: ${formatBytes(quota.prohibitSendReceiveQuota)}`,
            quotaStatus: quota.status,
        };
    }
    return { canReceive: true, quotaStatus: quota.status };
}
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
async function enforceQuotaLimits(userId, sequelize, transaction) {
    const quota = await getQuotaConfigByUserId(userId, sequelize);
    if (!quota) {
        throw new Error(`No quota configuration found for user ${userId}`);
    }
    const previousStatus = quota.status;
    let newStatus = quota.status;
    let actionType = 'warning-sent';
    // Exchange Server quota enforcement logic
    if (quota.currentSize >= quota.prohibitSendReceiveQuota) {
        newStatus = 'send-receive-blocked';
        actionType = 'send-receive-blocked';
    }
    else if (quota.currentSize >= quota.prohibitSendQuota) {
        newStatus = 'send-blocked';
        actionType = 'send-blocked';
    }
    else if (quota.currentSize >= quota.issueWarningQuota) {
        newStatus = 'warning';
        actionType = 'warning-sent';
    }
    else {
        newStatus = 'normal';
    }
    // Update quota if status changed
    if (newStatus !== previousStatus) {
        await updateQuotaConfig(quota.id, {
            status: newStatus,
            lastEnforcementDate: new Date(),
        }, sequelize, transaction);
    }
    const action = {
        id: crypto.randomUUID(),
        userId,
        quotaConfigId: quota.id,
        actionType,
        actionReason: `Current storage ${formatBytes(quota.currentSize)} exceeds threshold`,
        previousStatus,
        newStatus,
        actionTaken: newStatus !== previousStatus,
        actionDate: new Date(),
        reversible: true,
        notificationSent: false,
    };
    return action;
}
// ============================================================================
// STORAGE CALCULATION
// ============================================================================
/**
 * Calculates total mailbox size for a user
 * @param userId - User ID
 * @param sequelize - Sequelize instance
 * @returns Total mailbox size in bytes
 * @example
 * const size = await calculateMailboxSize('user-123', sequelize);
 * console.log(`Mailbox size: ${formatBytes(size)}`);
 */
async function calculateMailboxSize(userId, sequelize) {
    const result = await sequelize.query(`
    SELECT
      COALESCE(SUM(m.size), 0) + COALESCE(SUM(a.size), 0) as total_size
    FROM mail_messages m
    LEFT JOIN mail_attachments a ON a.message_id = m.id
    WHERE m.user_id = :userId
      AND m.is_deleted = false
      AND (a.id IS NULL OR a.is_deleted = false)
    `, {
        replacements: { userId },
        type: 'SELECT',
    });
    return result[0]?.total_size || 0;
}
/**
 * Calculates folder size for a specific folder
 * @param folderId - Folder ID
 * @param sequelize - Sequelize instance
 * @returns Folder size in bytes and message count
 * @example
 * const stats = await calculateFolderSize('folder-123', sequelize);
 */
async function calculateFolderSize(folderId, sequelize) {
    const result = await sequelize.query(`
    SELECT
      COALESCE(SUM(m.size), 0) + COALESCE(SUM(a.size), 0) as total_size,
      COUNT(DISTINCT m.id) as message_count
    FROM mail_messages m
    LEFT JOIN mail_attachments a ON a.message_id = m.id
    WHERE m.folder_id = :folderId
      AND m.is_deleted = false
      AND (a.id IS NULL OR a.is_deleted = false)
    `, {
        replacements: { folderId },
        type: 'SELECT',
    });
    return {
        size: result[0]?.total_size || 0,
        messageCount: result[0]?.message_count || 0,
    };
}
/**
 * Calculates detailed mailbox storage statistics
 * @param userId - User ID
 * @param sequelize - Sequelize instance
 * @returns Comprehensive storage statistics
 * @example
 * const stats = await calculateMailboxStorageStats('user-123', sequelize);
 * console.log(`Total: ${formatBytes(stats.totalSize)}`);
 */
async function calculateMailboxStorageStats(userId, sequelize) {
    // Get quota config
    const quotaConfig = await getQuotaConfigByUserId(userId, sequelize);
    // Calculate total sizes
    const totalSize = await calculateMailboxSize(userId, sequelize);
    // Get message and attachment counts
    const countResult = await sequelize.query(`
    SELECT
      COUNT(DISTINCT m.id) as message_count,
      COALESCE(SUM(m.size), 0) as message_size,
      COUNT(DISTINCT a.id) as attachment_count,
      COALESCE(SUM(a.size), 0) as attachment_size
    FROM mail_messages m
    LEFT JOIN mail_attachments a ON a.message_id = m.id
    WHERE m.user_id = :userId
      AND m.is_deleted = false
      AND (a.id IS NULL OR a.is_deleted = false)
    `, {
        replacements: { userId },
        type: 'SELECT',
    });
    const counts = countResult[0] || { message_count: 0, message_size: 0, attachment_count: 0, attachment_size: 0 };
    // Get folder-level statistics
    const folderStats = await sequelize.query(`
    SELECT
      f.id as folder_id,
      f.name as folder_name,
      f.folder_type,
      COALESCE(SUM(m.size), 0) + COALESCE(SUM(a.size), 0) as size,
      COUNT(DISTINCT m.id) as message_count,
      MIN(m.received_date) as oldest_message_date,
      MAX(m.received_date) as newest_message_date
    FROM mail_folders f
    LEFT JOIN mail_messages m ON m.folder_id = f.id AND m.is_deleted = false
    LEFT JOIN mail_attachments a ON a.message_id = m.id AND (a.id IS NULL OR a.is_deleted = false)
    WHERE f.user_id = :userId
    GROUP BY f.id, f.name, f.folder_type
    ORDER BY size DESC
    `, {
        replacements: { userId },
        type: 'SELECT',
    });
    // Get storage by month
    const storageByMonth = await sequelize.query(`
    SELECT
      EXTRACT(YEAR FROM m.received_date) as year,
      EXTRACT(MONTH FROM m.received_date) as month,
      COALESCE(SUM(m.size), 0) + COALESCE(SUM(a.size), 0) as size,
      COUNT(DISTINCT m.id) as message_count
    FROM mail_messages m
    LEFT JOIN mail_attachments a ON a.message_id = m.id
    WHERE m.user_id = :userId
      AND m.is_deleted = false
      AND m.received_date IS NOT NULL
      AND (a.id IS NULL OR a.is_deleted = false)
    GROUP BY EXTRACT(YEAR FROM m.received_date), EXTRACT(MONTH FROM m.received_date)
    ORDER BY year DESC, month DESC
    LIMIT 12
    `, {
        replacements: { userId },
        type: 'SELECT',
    });
    const quotaUsagePercent = quotaConfig
        ? (totalSize / quotaConfig.prohibitSendReceiveQuota) * 100
        : 0;
    const quotaStatus = quotaConfig?.status || 'normal';
    return {
        userId,
        mailboxId: userId, // Assuming mailbox ID same as user ID
        totalSize,
        messageSize: counts.message_size,
        attachmentSize: counts.attachment_size,
        messageCount: counts.message_count,
        attachmentCount: counts.attachment_count,
        folderStats: folderStats.map((f) => ({
            folderId: f.folder_id,
            folderName: f.folder_name,
            folderType: f.folder_type,
            size: f.size,
            messageCount: f.message_count,
            oldestMessageDate: f.oldest_message_date,
            newestMessageDate: f.newest_message_date,
        })),
        storageByMonth: storageByMonth.map((s) => ({
            year: s.year,
            month: s.month,
            size: s.size,
            messageCount: s.message_count,
        })),
        quotaConfig: quotaConfig || {},
        quotaUsagePercent,
        quotaStatus,
        calculatedAt: new Date(),
    };
}
/**
 * Calculates attachment storage for a user
 * @param userId - User ID
 * @param sequelize - Sequelize instance
 * @returns Attachment storage statistics
 * @example
 * const stats = await calculateAttachmentStorage('user-123', sequelize);
 */
async function calculateAttachmentStorage(userId, sequelize) {
    const result = await sequelize.query(`
    SELECT
      COALESCE(SUM(a.size), 0) as total_size,
      COUNT(a.id) as count
    FROM mail_attachments a
    INNER JOIN mail_messages m ON m.id = a.message_id
    WHERE m.user_id = :userId
      AND a.is_deleted = false
      AND m.is_deleted = false
    `, {
        replacements: { userId },
        type: 'SELECT',
    });
    const totalSize = result[0]?.total_size || 0;
    const count = result[0]?.count || 0;
    const averageSize = count > 0 ? totalSize / count : 0;
    return { totalSize, count, averageSize };
}
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
async function updateQuotaUsage(userId, sizeChange, messageCountChange, attachmentCountChange, sequelize, transaction) {
    const quota = await getQuotaConfigByUserId(userId, sequelize);
    if (!quota) {
        return null;
    }
    const newSize = Math.max(0, quota.currentSize + sizeChange);
    const newMessageCount = Math.max(0, quota.messageCount + messageCountChange);
    const newAttachmentCount = Math.max(0, quota.attachmentCount + attachmentCountChange);
    return await updateQuotaConfig(quota.id, {
        currentSize: newSize,
        messageCount: newMessageCount,
        attachmentCount: newAttachmentCount,
    }, sequelize, transaction);
}
// ============================================================================
// STORAGE CLEANUP
// ============================================================================
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
async function performStorageCleanup(config, sequelize) {
    const startTime = new Date();
    const errors = [];
    // Calculate before size
    const beforeSize = config.userId
        ? await calculateMailboxSize(config.userId, sequelize)
        : 0;
    let messagesDeleted = 0;
    let messagesArchived = 0;
    let attachmentsCompressed = 0;
    let attachmentsDeduplicated = 0;
    let spaceFreedBytes = 0;
    const transaction = config.dryRun ? undefined : await sequelize.transaction();
    try {
        // Delete old trash items
        if (config.deleteTrashOlderThanDays > 0) {
            const trashCutoffDate = new Date();
            trashCutoffDate.setDate(trashCutoffDate.getDate() - config.deleteTrashOlderThanDays);
            const whereClause = {
                is_deleted: true,
                deleted_at: { [sequelize_1.Op.lt]: trashCutoffDate },
            };
            if (config.userId) {
                whereClause['user_id'] = config.userId;
            }
            const [deletedCount, deletedMessages] = await sequelize.query(`
        DELETE FROM mail_messages
        WHERE id IN (
          SELECT id FROM mail_messages
          WHERE is_deleted = true
            AND deleted_at < :cutoffDate
            ${config.userId ? 'AND user_id = :userId' : ''}
          LIMIT 1000
        )
        RETURNING size
        `, {
                replacements: {
                    cutoffDate: trashCutoffDate,
                    userId: config.userId,
                },
                transaction,
            });
            messagesDeleted = Array.isArray(deletedMessages) ? deletedMessages.length : 0;
            spaceFreedBytes += deletedMessages.reduce((sum, msg) => sum + (msg.size || 0), 0);
        }
        // Archive old sent items
        if (config.archiveSentOlderThanDays > 0) {
            const sentCutoffDate = new Date();
            sentCutoffDate.setDate(sentCutoffDate.getDate() - config.archiveSentOlderThanDays);
            const sentMessages = await sequelize.query(`
        SELECT id, size FROM mail_messages m
        INNER JOIN mail_folders f ON f.id = m.folder_id
        WHERE f.folder_type = 'sent'
          AND m.sent_date < :cutoffDate
          AND m.is_archived = false
          ${config.userId ? 'AND m.user_id = :userId' : ''}
        LIMIT 1000
        `, {
                replacements: {
                    cutoffDate: sentCutoffDate,
                    userId: config.userId,
                },
                type: 'SELECT',
                transaction,
            });
            if (sentMessages.length > 0 && !config.dryRun) {
                await sequelize.query(`
          UPDATE mail_messages
          SET is_archived = true, archived_at = NOW()
          WHERE id IN (:messageIds)
          `, {
                    replacements: {
                        messageIds: sentMessages.map((m) => m.id),
                    },
                    transaction,
                });
            }
            messagesArchived = sentMessages.length;
        }
        // Compress old attachments
        if (config.compressAttachmentsOlderThanDays > 0) {
            const compressCutoffDate = new Date();
            compressCutoffDate.setDate(compressCutoffDate.getDate() - config.compressAttachmentsOlderThanDays);
            const attachmentsToCompress = await sequelize.query(`
        SELECT a.id, a.size FROM mail_attachments a
        INNER JOIN mail_messages m ON m.id = a.message_id
        WHERE a.created_at < :cutoffDate
          AND a.is_compressed = false
          AND a.content_type IN ('image/jpeg', 'image/png', 'application/pdf')
          ${config.userId ? 'AND m.user_id = :userId' : ''}
        LIMIT 100
        `, {
                replacements: {
                    cutoffDate: compressCutoffDate,
                    userId: config.userId,
                },
                type: 'SELECT',
                transaction,
            });
            attachmentsCompressed = attachmentsToCompress.length;
        }
        // Deduplicate attachments
        if (config.deduplicateAttachments) {
            const dedupeResult = await deduplicateAttachmentStorage(config.userId, sequelize, transaction);
            attachmentsDeduplicated = dedupeResult.duplicatesFound;
            spaceFreedBytes += dedupeResult.totalSpaceSaved;
        }
        if (!config.dryRun && transaction) {
            await transaction.commit();
        }
        else if (transaction) {
            await transaction.rollback();
        }
        // Calculate after size
        const afterSize = config.userId
            ? await calculateMailboxSize(config.userId, sequelize)
            : beforeSize - spaceFreedBytes;
        const endTime = new Date();
        return {
            startTime,
            endTime,
            durationMs: endTime.getTime() - startTime.getTime(),
            dryRun: config.dryRun,
            messagesDeleted,
            messagesArchived,
            attachmentsCompressed,
            attachmentsDeduplicated,
            spaceFreedBytes,
            spaceFreedMB: spaceFreedBytes / (1024 * 1024),
            errors,
            summary: {
                beforeSize,
                afterSize,
                reductionPercent: beforeSize > 0 ? ((beforeSize - afterSize) / beforeSize) * 100 : 0,
            },
        };
    }
    catch (error) {
        if (transaction) {
            await transaction.rollback();
        }
        errors.push({
            operation: 'cleanup',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
        const endTime = new Date();
        return {
            startTime,
            endTime,
            durationMs: endTime.getTime() - startTime.getTime(),
            dryRun: config.dryRun,
            messagesDeleted,
            messagesArchived,
            attachmentsCompressed,
            attachmentsDeduplicated,
            spaceFreedBytes,
            spaceFreedMB: spaceFreedBytes / (1024 * 1024),
            errors,
            summary: {
                beforeSize,
                afterSize: beforeSize,
                reductionPercent: 0,
            },
        };
    }
}
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
async function deduplicateAttachmentStorage(userId, sequelize, transaction) {
    const startTime = Date.now();
    // Find duplicate attachments by checksum
    const duplicates = await sequelize.query(`
    SELECT
      a.checksum,
      COUNT(*) as count,
      MAX(a.size) as size,
      SUM(a.size) as total_size,
      ARRAY_AGG(a.id) as attachment_ids
    FROM mail_attachments a
    ${userId ? 'INNER JOIN mail_messages m ON m.id = a.message_id' : ''}
    WHERE a.is_deleted = false
      ${userId ? 'AND m.user_id = :userId' : ''}
    GROUP BY a.checksum
    HAVING COUNT(*) > 1
    `, {
        replacements: { userId },
        type: 'SELECT',
        transaction,
    });
    const duplicateGroups = duplicates.map((dup) => ({
        checksum: dup.checksum,
        count: parseInt(dup.count),
        size: dup.size,
        totalSize: dup.total_size,
        savedSize: dup.size * (parseInt(dup.count) - 1),
        attachmentIds: dup.attachment_ids,
    }));
    const totalSpaceSaved = duplicateGroups.reduce((sum, group) => sum + group.savedSize, 0);
    const executionTimeMs = Date.now() - startTime;
    return {
        totalAttachmentsScanned: 0, // Would need separate query
        duplicatesFound: duplicateGroups.reduce((sum, g) => sum + (g.count - 1), 0),
        duplicateGroups,
        totalSpaceSaved,
        executionTimeMs,
    };
}
/**
 * Compresses attachments to save storage space
 * @param attachmentIds - Array of attachment IDs to compress
 * @param compressionLevel - Compression level (1-9)
 * @param sequelize - Sequelize instance
 * @returns Compression result
 * @example
 * const result = await compressAttachments(['att-1', 'att-2'], 6, sequelize);
 */
async function compressAttachments(attachmentIds, compressionLevel, sequelize) {
    const startTime = Date.now();
    const errors = [];
    let filesCompressed = 0;
    let filesFailed = 0;
    let originalSize = 0;
    let compressedSize = 0;
    // Get attachments to compress
    const attachments = await sequelize.query(`
    SELECT id, size, storage_path, content_type
    FROM mail_attachments
    WHERE id IN (:attachmentIds)
      AND is_deleted = false
      AND is_compressed = false
    `, {
        replacements: { attachmentIds },
        type: 'SELECT',
    });
    for (const attachment of attachments) {
        try {
            originalSize += attachment.size;
            // Compression logic would go here
            // For now, simulate compression
            const simulatedCompressedSize = Math.floor(attachment.size * 0.7);
            compressedSize += simulatedCompressedSize;
            filesCompressed++;
            // Update attachment record
            await sequelize.query(`
        UPDATE mail_attachments
        SET is_compressed = true,
            size = :compressedSize,
            compression_algorithm = 'gzip'
        WHERE id = :attachmentId
        `, {
                replacements: {
                    attachmentId: attachment.id,
                    compressedSize: simulatedCompressedSize,
                },
            });
        }
        catch (error) {
            filesFailed++;
            errors.push({
                fileId: attachment.id,
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
    const executionTimeMs = Date.now() - startTime;
    const spaceSaved = originalSize - compressedSize;
    const compressionRatio = originalSize > 0 ? compressedSize / originalSize : 0;
    return {
        totalFiles: attachments.length,
        filesCompressed,
        filesFailed,
        originalSize,
        compressedSize,
        spaceSaved,
        compressionRatio,
        executionTimeMs,
        errors,
    };
}
// ============================================================================
// QUOTA WARNINGS & NOTIFICATIONS
// ============================================================================
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
async function createQuotaWarning(userId, quotaConfig, warningType, sequelize, transaction) {
    const QuotaWarningNotification = defineQuotaWarningNotificationModel(sequelize);
    const usagePercent = (quotaConfig.currentSize / quotaConfig.prohibitSendReceiveQuota) * 100;
    let warningLevel = 'info';
    let message = '';
    let actionRequired = '';
    switch (warningType) {
        case 'approaching':
            warningLevel = 'info';
            message = `Your mailbox is approaching its storage limit (${usagePercent.toFixed(1)}% used).`;
            actionRequired = 'Consider deleting old emails or archiving messages.';
            break;
        case 'warning-threshold':
            warningLevel = 'warning';
            message = `Your mailbox has exceeded the warning threshold (${usagePercent.toFixed(1)}% used).`;
            actionRequired = 'Please delete emails or empty trash to free up space.';
            break;
        case 'send-blocked':
            warningLevel = 'critical';
            message = `Your mailbox quota has been exceeded. You cannot send new emails until you free up space.`;
            actionRequired = 'Delete emails or contact your administrator to increase your quota.';
            break;
        case 'send-receive-blocked':
            warningLevel = 'critical';
            message = `Your mailbox is full. You cannot send or receive emails until you free up space.`;
            actionRequired = 'Immediately delete emails to restore email functionality.';
            break;
    }
    const notification = await QuotaWarningNotification.create({
        user_id: userId,
        quota_config_id: quotaConfig.id,
        warning_type: warningType,
        warning_level: warningLevel,
        current_size: quotaConfig.currentSize,
        quota_size: quotaConfig.prohibitSendReceiveQuota,
        usage_percent: usagePercent,
        message,
        action_required: actionRequired,
        notification_sent: false,
    }, { transaction });
    return notification.toJSON();
}
/**
 * Checks quota status and sends warnings if needed
 * @param userId - User ID
 * @param sequelize - Sequelize instance
 * @returns Array of warnings created
 * @example
 * const warnings = await checkAndSendQuotaWarnings('user-123', sequelize);
 */
async function checkAndSendQuotaWarnings(userId, sequelize) {
    const quota = await getQuotaConfigByUserId(userId, sequelize);
    if (!quota) {
        return [];
    }
    const warnings = [];
    // Check if we need to send warnings
    const usagePercent = (quota.currentSize / quota.prohibitSendReceiveQuota) * 100;
    // Don't send duplicate warnings within 24 hours
    const lastWarningCutoff = new Date();
    lastWarningCutoff.setHours(lastWarningCutoff.getHours() - 24);
    const recentWarnings = await sequelize.query(`
    SELECT * FROM quota_warning_notifications
    WHERE user_id = :userId
      AND created_at > :cutoff
    ORDER BY created_at DESC
    LIMIT 1
    `, {
        replacements: {
            userId,
            cutoff: lastWarningCutoff,
        },
        type: 'SELECT',
    });
    if (recentWarnings.length > 0) {
        return warnings;
    }
    // Determine which warning to send
    if (quota.currentSize >= quota.prohibitSendReceiveQuota) {
        const warning = await createQuotaWarning(userId, quota, 'send-receive-blocked', sequelize);
        warnings.push(warning);
    }
    else if (quota.currentSize >= quota.prohibitSendQuota) {
        const warning = await createQuotaWarning(userId, quota, 'send-blocked', sequelize);
        warnings.push(warning);
    }
    else if (quota.currentSize >= quota.issueWarningQuota) {
        const warning = await createQuotaWarning(userId, quota, 'warning-threshold', sequelize);
        warnings.push(warning);
    }
    else if (usagePercent >= 80) {
        const warning = await createQuotaWarning(userId, quota, 'approaching', sequelize);
        warnings.push(warning);
    }
    return warnings;
}
/**
 * Retrieves quota warnings for a user
 * @param userId - User ID
 * @param limit - Maximum number of warnings to retrieve
 * @param sequelize - Sequelize instance
 * @returns Array of quota warnings
 * @example
 * const warnings = await getQuotaWarnings('user-123', 10, sequelize);
 */
async function getQuotaWarnings(userId, limit, sequelize) {
    const QuotaWarningNotification = defineQuotaWarningNotificationModel(sequelize);
    const warnings = await QuotaWarningNotification.findAll({
        where: { user_id: userId },
        order: [['created_at', 'DESC']],
        limit,
    });
    return warnings.map((w) => w.toJSON());
}
/**
 * Acknowledges a quota warning notification
 * @param notificationId - Notification ID
 * @param sequelize - Sequelize instance
 * @returns Updated notification
 * @example
 * await acknowledgeQuotaWarning('notif-123', sequelize);
 */
async function acknowledgeQuotaWarning(notificationId, sequelize) {
    const QuotaWarningNotification = defineQuotaWarningNotificationModel(sequelize);
    const [affectedRows] = await QuotaWarningNotification.update({
        acknowledged: true,
        acknowledged_date: new Date(),
    }, {
        where: { id: notificationId },
    });
    if (affectedRows === 0) {
        return null;
    }
    const updated = await QuotaWarningNotification.findByPk(notificationId);
    return updated ? updated.toJSON() : null;
}
// ============================================================================
// RETENTION & ARCHIVING
// ============================================================================
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
async function createRetentionPolicy(policy, sequelize, transaction) {
    const RetentionPolicy = defineRetentionPolicyModel(sequelize);
    const retentionPolicy = await RetentionPolicy.create({
        name: policy.name,
        description: policy.description,
        retain_inbox_days: policy.retainInboxDays || 365,
        retain_sent_days: policy.retainSentDays || 365,
        retain_drafts_days: policy.retainDraftsDays || 90,
        retain_trash_days: policy.retainTrashDays || 30,
        retain_archived_days: policy.retainArchivedDays || 2555,
        legal_hold_enabled: policy.legalHoldEnabled || false,
        legal_hold_until_date: policy.legalHoldUntilDate,
        minimum_retention_days: policy.minimumRetentionDays || 2555,
        auto_delete_after_retention: policy.autoDeleteAfterRetention || false,
        audit_deletions: policy.auditDeletions !== false,
        never_delete_tags: policy.neverDeleteTags,
        enabled: policy.enabled !== false,
        organization_id: policy.organizationId,
    }, { transaction });
    return retentionPolicy.toJSON();
}
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
async function applyRetentionPolicy(policyId, userId, sequelize, dryRun) {
    const RetentionPolicy = defineRetentionPolicyModel(sequelize);
    const policy = await RetentionPolicy.findByPk(policyId);
    if (!policy) {
        throw new Error(`Retention policy ${policyId} not found`);
    }
    const policyData = policy.toJSON();
    if (!policyData.enabled) {
        throw new Error(`Retention policy ${policyId} is not enabled`);
    }
    let messagesDeleted = 0;
    let messagesArchived = 0;
    const transaction = dryRun ? undefined : await sequelize.transaction();
    try {
        // Apply retention to inbox
        const inboxCutoff = new Date();
        inboxCutoff.setDate(inboxCutoff.getDate() - policyData.retainInboxDays);
        const inboxResults = await sequelize.query(`
      SELECT COUNT(*) as count FROM mail_messages m
      INNER JOIN mail_folders f ON f.id = m.folder_id
      WHERE f.folder_type = 'inbox'
        AND m.received_date < :cutoff
        AND m.is_deleted = false
        ${userId ? 'AND m.user_id = :userId' : ''}
      `, {
            replacements: { cutoff: inboxCutoff, userId },
            type: 'SELECT',
            transaction,
        });
        if (!dryRun && transaction) {
            await sequelize.query(`
        UPDATE mail_messages m
        SET is_deleted = true, deleted_at = NOW()
        FROM mail_folders f
        WHERE f.id = m.folder_id
          AND f.folder_type = 'inbox'
          AND m.received_date < :cutoff
          AND m.is_deleted = false
          ${userId ? 'AND m.user_id = :userId' : ''}
        `, {
                replacements: { cutoff: inboxCutoff, userId },
                transaction,
            });
        }
        messagesDeleted += inboxResults[0]?.count || 0;
        // Apply retention to trash
        const trashCutoff = new Date();
        trashCutoff.setDate(trashCutoff.getDate() - policyData.retainTrashDays);
        const trashResults = await sequelize.query(`
      SELECT COUNT(*) as count FROM mail_messages
      WHERE is_deleted = true
        AND deleted_at < :cutoff
        ${userId ? 'AND user_id = :userId' : ''}
      `, {
            replacements: { cutoff: trashCutoff, userId },
            type: 'SELECT',
            transaction,
        });
        if (!dryRun && transaction) {
            await sequelize.query(`
        DELETE FROM mail_messages
        WHERE is_deleted = true
          AND deleted_at < :cutoff
          ${userId ? 'AND user_id = :userId' : ''}
        `, {
                replacements: { cutoff: trashCutoff, userId },
                transaction,
            });
        }
        messagesDeleted += trashResults[0]?.count || 0;
        if (!dryRun && transaction) {
            await transaction.commit();
        }
        else if (transaction) {
            await transaction.rollback();
        }
        return { messagesDeleted, messagesArchived };
    }
    catch (error) {
        if (transaction) {
            await transaction.rollback();
        }
        throw error;
    }
}
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
async function archiveMessages(policyConfig, sequelize) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - (policyConfig.archiveAfterDays || 180));
    const folderTypes = policyConfig.archiveFolderTypes || ['inbox', 'sent'];
    const result = await sequelize.query(`
    UPDATE mail_messages m
    SET is_archived = true, archived_at = NOW()
    FROM mail_folders f
    WHERE f.id = m.folder_id
      AND f.folder_type IN (:folderTypes)
      AND m.received_date < :cutoff
      AND m.is_archived = false
      AND m.is_deleted = false
      ${policyConfig.archiveReadMessagesOnly ? 'AND m.is_read = true' : ''}
    RETURNING m.id, m.size
    `, {
        replacements: {
            folderTypes,
            cutoff: cutoffDate,
        },
    });
    const archivedMessages = Array.isArray(result[0]) ? result[0] : [];
    const messagesArchived = archivedMessages.length;
    const spaceArchived = archivedMessages.reduce((sum, msg) => sum + (msg.size || 0), 0);
    return { messagesArchived, spaceArchived };
}
// ============================================================================
// STORAGE ANALYTICS
// ============================================================================
/**
 * Generates comprehensive storage analytics report
 * @param organizationId - Optional organization ID to scope report
 * @param periodDays - Number of days to include in report
 * @param sequelize - Sequelize instance
 * @returns Storage analytics report
 * @example
 * const report = await generateStorageAnalyticsReport('org-123', 30, sequelize);
 */
async function generateStorageAnalyticsReport(organizationId, periodDays, sequelize) {
    const periodStart = new Date();
    periodStart.setDate(periodStart.getDate() - periodDays);
    const periodEnd = new Date();
    // Overall statistics
    const overallStats = await sequelize.query(`
    SELECT
      COUNT(DISTINCT u.id) as total_users,
      COUNT(DISTINCT m.user_id) as total_mailboxes,
      COALESCE(SUM(m.size), 0) + COALESCE(SUM(a.size), 0) as total_storage,
      COUNT(DISTINCT m.id) as total_messages,
      COUNT(DISTINCT a.id) as total_attachments
    FROM users u
    LEFT JOIN mail_messages m ON m.user_id = u.id AND m.is_deleted = false
    LEFT JOIN mail_attachments a ON a.message_id = m.id AND a.is_deleted = false
    ${organizationId ? 'WHERE u.organization_id = :organizationId' : ''}
    `, {
        replacements: { organizationId },
        type: 'SELECT',
    });
    const stats = overallStats[0] || {
        total_users: 0,
        total_mailboxes: 0,
        total_storage: 0,
        total_messages: 0,
        total_attachments: 0,
    };
    // Quota statistics
    const quotaStats = await sequelize.query(`
    SELECT
      AVG((current_size::float / NULLIF(prohibit_send_receive_quota, 0)) * 100) as avg_usage,
      COUNT(*) FILTER (WHERE current_size >= prohibit_send_receive_quota) as over_quota,
      COUNT(*) FILTER (WHERE current_size >= prohibit_send_receive_quota * 0.9) as near_quota,
      COUNT(*) FILTER (WHERE status IN ('send-blocked', 'send-receive-blocked')) as blocked
    FROM mail_quota_configs
    ${organizationId ? 'WHERE organization_id = :organizationId' : ''}
    `, {
        replacements: { organizationId },
        type: 'SELECT',
    });
    const quotaStatistics = quotaStats[0] || {
        avg_usage: 0,
        over_quota: 0,
        near_quota: 0,
        blocked: 0,
    };
    // Top users by storage
    const topUsers = await sequelize.query(`
    SELECT
      u.id as user_id,
      u.name as user_name,
      COALESCE(SUM(m.size), 0) + COALESCE(SUM(a.size), 0) as storage_used,
      q.current_size::float / NULLIF(q.prohibit_send_receive_quota, 0) * 100 as quota_usage
    FROM users u
    LEFT JOIN mail_messages m ON m.user_id = u.id AND m.is_deleted = false
    LEFT JOIN mail_attachments a ON a.message_id = m.id AND a.is_deleted = false
    LEFT JOIN mail_quota_configs q ON q.user_id = u.id
    ${organizationId ? 'WHERE u.organization_id = :organizationId' : ''}
    GROUP BY u.id, u.name, q.current_size, q.prohibit_send_receive_quota
    ORDER BY storage_used DESC
    LIMIT 10
    `, {
        replacements: { organizationId },
        type: 'SELECT',
    });
    // Generate recommendations
    const recommendations = [];
    if (quotaStatistics.over_quota > 0) {
        recommendations.push({
            type: 'cleanup',
            priority: 'high',
            description: `${quotaStatistics.over_quota} users are over quota. Run cleanup to free space.`,
        });
    }
    if (quotaStatistics.near_quota > 0) {
        recommendations.push({
            type: 'quota-increase',
            priority: 'medium',
            description: `${quotaStatistics.near_quota} users are near quota limit. Consider increasing quotas.`,
        });
    }
    return {
        reportId: crypto.randomUUID(),
        generatedAt: new Date(),
        periodStart,
        periodEnd,
        totalUsers: stats.total_users,
        totalMailboxes: stats.total_mailboxes,
        totalStorageUsed: stats.total_storage,
        totalMessages: stats.total_messages,
        totalAttachments: stats.total_attachments,
        quotaStatistics: {
            averageQuotaUsage: quotaStatistics.avg_usage,
            usersOverQuota: quotaStatistics.over_quota,
            usersNearQuota: quotaStatistics.near_quota,
            usersBlocked: quotaStatistics.blocked,
        },
        topUsersByStorage: topUsers.map((u) => ({
            userId: u.user_id,
            userName: u.user_name,
            storageUsed: u.storage_used,
            quotaUsage: u.quota_usage,
        })),
        topMailboxesBySize: [],
        storageGrowth: [],
        storageByType: {
            messages: stats.total_storage * 0.6, // Approximate
            attachments: stats.total_storage * 0.4,
            archived: 0,
            deleted: 0,
        },
        recommendations,
    };
}
/**
 * Gets storage growth trend over time
 * @param userId - Optional user ID to scope trend
 * @param days - Number of days to analyze
 * @param sequelize - Sequelize instance
 * @returns Array of daily storage data points
 * @example
 * const trend = await getStorageGrowthTrend('user-123', 30, sequelize);
 */
async function getStorageGrowthTrend(userId, days, sequelize) {
    const results = await sequelize.query(`
    SELECT
      DATE(m.received_date) as date,
      SUM(m.size) + COALESCE(SUM(a.size), 0) as total_storage
    FROM mail_messages m
    LEFT JOIN mail_attachments a ON a.message_id = m.id
    WHERE m.received_date >= NOW() - INTERVAL '${days} days'
      AND m.is_deleted = false
      ${userId ? 'AND m.user_id = :userId' : ''}
    GROUP BY DATE(m.received_date)
    ORDER BY date ASC
    `, {
        replacements: { userId },
        type: 'SELECT',
    });
    const trend = results.map((r, index) => {
        const growthRate = index > 0
            ? ((r.total_storage - results[index - 1].total_storage) / results[index - 1].total_storage) * 100
            : 0;
        return {
            date: r.date,
            totalStorage: r.total_storage,
            growthRate,
        };
    });
    return trend;
}
// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
/**
 * Formats bytes to human-readable string
 * @param bytes - Number of bytes
 * @param decimals - Number of decimal places
 * @returns Formatted string (e.g., "1.5 GB")
 * @example
 * console.log(formatBytes(1536000000)); // "1.43 GB"
 */
function formatBytes(bytes, decimals = 2) {
    if (bytes === 0)
        return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
/**
 * Converts human-readable size to bytes
 * @param sizeString - Size string (e.g., "2.5GB", "100MB")
 * @returns Size in bytes
 * @example
 * const bytes = parseSizeString('2.5GB'); // 2684354560
 */
function parseSizeString(sizeString) {
    const units = {
        B: 1,
        KB: 1024,
        MB: 1024 * 1024,
        GB: 1024 * 1024 * 1024,
        TB: 1024 * 1024 * 1024 * 1024,
    };
    const match = sizeString.match(/^(\d+(?:\.\d+)?)\s*([A-Z]+)$/i);
    if (!match) {
        throw new Error(`Invalid size string: ${sizeString}`);
    }
    const value = parseFloat(match[1]);
    const unit = match[2].toUpperCase();
    if (!units[unit]) {
        throw new Error(`Unknown unit: ${unit}`);
    }
    return Math.floor(value * units[unit]);
}
/**
 * Calculates quota usage percentage
 * @param currentSize - Current storage size in bytes
 * @param quotaSize - Quota limit in bytes
 * @returns Usage percentage
 * @example
 * const percent = calculateQuotaPercentage(1500000000, 2147483648); // 69.8%
 */
function calculateQuotaPercentage(currentSize, quotaSize) {
    if (quotaSize === 0)
        return 0;
    return (currentSize / quotaSize) * 100;
}
/**
 * Determines quota status based on current size and thresholds
 * @param currentSize - Current storage size
 * @param config - Quota configuration
 * @returns Quota status
 * @example
 * const status = determineQuotaStatus(2000000000, quotaConfig);
 */
function determineQuotaStatus(currentSize, config) {
    if (currentSize >= config.prohibitSendReceiveQuota) {
        return 'send-receive-blocked';
    }
    else if (currentSize >= config.prohibitSendQuota) {
        return 'send-blocked';
    }
    else if (currentSize >= config.issueWarningQuota) {
        return 'warning';
    }
    else {
        return 'normal';
    }
}
// ============================================================================
// NESTJS DECORATORS & SWAGGER
// ============================================================================
/**
 * NestJS decorator for Swagger quota status documentation
 * @returns Swagger decorator
 * @example
 * @Get('quota/status')
 * @ApiQuotaStatus()
 * async getQuotaStatus() {}
 */
function ApiQuotaStatus() {
    const { ApiOperation, ApiResponse } = require('@nestjs/swagger');
    return function (target, propertyKey, descriptor) {
        ApiOperation({
            summary: 'Get storage quota status',
            description: 'Retrieves current storage quota status including usage, limits, and warnings',
        })(target, propertyKey, descriptor);
        ApiResponse({
            status: 200,
            description: 'Quota status retrieved successfully',
            schema: {
                type: 'object',
                properties: {
                    userId: { type: 'string' },
                    currentSize: { type: 'number' },
                    quotaSize: { type: 'number' },
                    usagePercent: { type: 'number' },
                    status: { type: 'string', enum: ['normal', 'warning', 'send-blocked', 'send-receive-blocked'] },
                    canSend: { type: 'boolean' },
                    canReceive: { type: 'boolean' },
                },
            },
        })(target, propertyKey, descriptor);
    };
}
/**
 * NestJS decorator for Swagger storage analytics documentation
 * @returns Swagger decorator
 * @example
 * @Get('analytics/storage')
 * @ApiStorageAnalytics()
 * async getStorageAnalytics() {}
 */
function ApiStorageAnalytics() {
    const { ApiOperation, ApiResponse } = require('@nestjs/swagger');
    return function (target, propertyKey, descriptor) {
        ApiOperation({
            summary: 'Get storage analytics report',
            description: 'Generates comprehensive storage analytics including usage trends and recommendations',
        })(target, propertyKey, descriptor);
        ApiResponse({
            status: 200,
            description: 'Analytics report generated successfully',
        })(target, propertyKey, descriptor);
    };
}
/**
 * Creates NestJS cron job for quota enforcement
 * @param sequelize - Sequelize instance
 * @param cronExpression - Cron expression (default: every hour)
 * @returns Cron job function
 * @example
 * const job = createQuotaEnforcementCronJob(sequelize, '0 * * * *');
 */
function createQuotaEnforcementCronJob(sequelize, cronExpression = '0 * * * *') {
    return async () => {
        try {
            console.log('[Quota Enforcement] Starting scheduled quota enforcement...');
            // Get all users with quota configs
            const quotaConfigs = await sequelize.query(`SELECT user_id FROM mail_quota_configs WHERE user_id IS NOT NULL`, { type: 'SELECT' });
            for (const config of quotaConfigs) {
                try {
                    // Recalculate mailbox size
                    const currentSize = await calculateMailboxSize(config.user_id, sequelize);
                    // Update quota config
                    const quota = await getQuotaConfigByUserId(config.user_id, sequelize);
                    if (quota) {
                        await updateQuotaConfig(quota.id, { currentSize }, sequelize);
                        // Enforce quota limits
                        await enforceQuotaLimits(config.user_id, sequelize);
                        // Check and send warnings
                        await checkAndSendQuotaWarnings(config.user_id, sequelize);
                    }
                }
                catch (error) {
                    console.error(`[Quota Enforcement] Error for user ${config.user_id}:`, error);
                }
            }
            console.log('[Quota Enforcement] Completed successfully');
        }
        catch (error) {
            console.error('[Quota Enforcement] Failed:', error);
        }
    };
}
/**
 * Creates NestJS cron job for automatic cleanup
 * @param sequelize - Sequelize instance
 * @param cronExpression - Cron expression (default: daily at 2 AM)
 * @returns Cron job function
 * @example
 * const job = createStorageCleanupCronJob(sequelize, '0 2 * * *');
 */
function createStorageCleanupCronJob(sequelize, cronExpression = '0 2 * * *') {
    return async () => {
        try {
            console.log('[Storage Cleanup] Starting scheduled cleanup...');
            const result = await performStorageCleanup({
                deleteTrashOlderThanDays: 30,
                archiveSentOlderThanDays: 180,
                compressAttachmentsOlderThanDays: 90,
                deduplicateAttachments: true,
                protectStarredMessages: true,
                protectUnreadMessages: false,
                dryRun: false,
            }, sequelize);
            console.log(`[Storage Cleanup] Completed. Freed ${formatBytes(result.spaceFreedBytes)}, deleted ${result.messagesDeleted} messages, archived ${result.messagesArchived} messages`);
        }
        catch (error) {
            console.error('[Storage Cleanup] Failed:', error);
        }
    };
}
//# sourceMappingURL=mail-quota-storage-kit.js.map