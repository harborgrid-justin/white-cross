/**
 * LOC: MAILJARC1234567
 * File: /reuse/server/mail/mail-journaling-archival-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - NestJS compliance services
 *   - Archive management controllers
 *   - Legal hold services
 *   - eDiscovery services
 *   - Retention policy processors
 *   - Compliance reporting services
 *   - Sequelize models
 */
interface JournalEntry {
    id: string;
    tenantId?: string;
    messageId: string;
    userId: string;
    journalType: 'incoming' | 'outgoing' | 'internal' | 'external';
    journalRule?: string;
    originalMessageId: string;
    internetMessageId: string;
    subject: string;
    from: EmailAddress;
    to: EmailAddress[];
    cc?: EmailAddress[];
    bcc?: EmailAddress[];
    sentDateTime: Date;
    receivedDateTime: Date;
    size: number;
    bodyPreview?: string;
    headers: Record<string, string>;
    messageContent: Buffer;
    attachmentCount: number;
    journaledAt: Date;
    journalStatus: 'pending' | 'journaled' | 'archived' | 'failed';
    complianceReason?: string;
    retentionPolicyId?: string;
    legalHoldIds?: string[];
    metadata?: Record<string, any>;
    hash: string;
    previousHash?: string;
    blockchainVerified: boolean;
    encryptionInfo?: EncryptionInfo;
}
interface EmailAddress {
    name?: string;
    address: string;
}
interface EncryptionInfo {
    isEncrypted: boolean;
    algorithm: string;
    keyId: string;
    encryptedAt: Date;
    encryptedBy: string;
    iv?: string;
    authTag?: string;
}
interface MessageArchive {
    id: string;
    tenantId?: string;
    archiveName: string;
    archiveType: 'mailbox' | 'folder' | 'search' | 'date-range' | 'legal-hold' | 'compliance';
    userId?: string;
    folderId?: string;
    startDate?: Date;
    endDate?: Date;
    messageCount: number;
    totalSize: number;
    compressedSize: number;
    compressionRatio: number;
    format: 'pst' | 'mbox' | 'eml' | 'msg' | 'zip' | 'custom';
    storageLocation: string;
    storageProvider: 'local' | 's3' | 'azure' | 'gcs';
    status: 'creating' | 'completed' | 'failed' | 'deleted' | 'restoring';
    createdAt: Date;
    completedAt?: Date;
    expiresAt?: Date;
    accessCount: number;
    lastAccessedAt?: Date;
    retentionPolicyId?: string;
    legalHoldIds?: string[];
    isEncrypted: boolean;
    encryptionInfo?: EncryptionInfo;
    checksums: ArchiveChecksums;
    metadata?: Record<string, any>;
    tags?: string[];
}
interface ArchiveChecksums {
    md5: string;
    sha256: string;
    sha512: string;
}
interface LegalHold {
    id: string;
    tenantId?: string;
    holdName: string;
    caseNumber?: string;
    description?: string;
    holdType: 'litigation' | 'investigation' | 'regulatory' | 'audit';
    status: 'active' | 'released' | 'expired';
    priority: 'low' | 'normal' | 'high' | 'critical';
    createdBy: string;
    createdAt: Date;
    releasedAt?: Date;
    expiresAt?: Date;
    scope: LegalHoldScope;
    affectedUsers: string[];
    affectedMessageCount: number;
    custodians: HoldCustodian[];
    notificationStatus: 'pending' | 'notified' | 'acknowledged';
    metadata?: Record<string, any>;
    complianceNotes?: string;
    attachments?: string[];
}
interface LegalHoldScope {
    userIds?: string[];
    emailAddresses?: string[];
    folderIds?: string[];
    dateRange?: {
        start: Date;
        end: Date;
    };
    keywords?: string[];
    senderAddresses?: string[];
    recipientAddresses?: string[];
    subjects?: string[];
    hasAttachments?: boolean;
    attachmentTypes?: string[];
}
interface HoldCustodian {
    userId: string;
    emailAddress: string;
    name?: string;
    department?: string;
    notifiedAt?: Date;
    acknowledgedAt?: Date;
    status: 'pending' | 'notified' | 'acknowledged' | 'non-compliant';
}
interface RetentionPolicy {
    id: string;
    tenantId?: string;
    policyName: string;
    description?: string;
    policyType: 'time-based' | 'event-based' | 'legal-hold' | 'custom';
    isEnabled: boolean;
    priority: number;
    retentionPeriod: RetentionPeriod;
    action: 'archive' | 'delete' | 'move-to-archive' | 'apply-legal-hold' | 'notify';
    scope: RetentionScope;
    excludeConditions?: RetentionConditions;
    includeConditions?: RetentionConditions;
    createdBy: string;
    createdAt: Date;
    lastModifiedAt: Date;
    lastExecutedAt?: Date;
    nextExecutionAt?: Date;
    executionSchedule?: string;
    affectedMessageCount: number;
    metadata?: Record<string, any>;
}
interface RetentionPeriod {
    years?: number;
    months?: number;
    days?: number;
    indefinite?: boolean;
}
interface RetentionScope {
    applyToAll?: boolean;
    userIds?: string[];
    folderTypes?: string[];
    messageTypes?: string[];
    categories?: string[];
}
interface RetentionConditions {
    hasAttachments?: boolean;
    importance?: string[];
    sensitivity?: string[];
    size?: {
        min?: number;
        max?: number;
    };
    keywords?: string[];
    senders?: string[];
    recipients?: string[];
}
interface eDiscoveryRequest {
    id: string;
    tenantId?: string;
    requestName: string;
    caseNumber?: string;
    requestType: 'search' | 'export' | 'legal-hold' | 'review';
    status: 'pending' | 'processing' | 'completed' | 'failed';
    priority: 'low' | 'normal' | 'high' | 'urgent';
    requestedBy: string;
    requestedAt: Date;
    completedAt?: Date;
    searchCriteria: eDiscoverySearchCriteria;
    resultsCount: number;
    resultsSize: number;
    exportFormat?: 'pst' | 'mbox' | 'eml' | 'pdf' | 'csv';
    exportLocation?: string;
    legalHoldId?: string;
    reviewers?: string[];
    metadata?: Record<string, any>;
    auditTrail: eDiscoveryAuditEntry[];
}
interface eDiscoverySearchCriteria {
    keywords?: string[];
    keywordOperator?: 'AND' | 'OR';
    dateRange?: {
        start: Date;
        end: Date;
    };
    senders?: string[];
    recipients?: string[];
    subjects?: string[];
    hasAttachments?: boolean;
    attachmentNames?: string[];
    folderIds?: string[];
    userIds?: string[];
    importance?: string[];
    categories?: string[];
    messageTypes?: string[];
    bodyContains?: string[];
    headerContains?: Record<string, string>;
    size?: {
        min?: number;
        max?: number;
    };
}
interface eDiscoveryAuditEntry {
    timestamp: Date;
    action: string;
    userId: string;
    details: string;
    ipAddress?: string;
}
interface ArchiveExportOptions {
    format: 'pst' | 'mbox' | 'eml' | 'msg' | 'zip';
    includeAttachments: boolean;
    includeHeaders: boolean;
    compression?: 'none' | 'gzip' | 'bzip2' | 'zip';
    encryption?: {
        enabled: boolean;
        algorithm: string;
        password?: string;
        publicKey?: string;
    };
    splitSize?: number;
    preserveStructure?: boolean;
    metadata?: Record<string, any>;
}
interface ArchiveImportOptions {
    format: 'pst' | 'mbox' | 'eml' | 'msg' | 'zip';
    targetUserId?: string;
    targetFolderId?: string;
    preserveDates: boolean;
    preserveFlags: boolean;
    deduplication: boolean;
    applyRetentionPolicy?: string;
    journalImport?: boolean;
}
interface ComplianceReport {
    id: string;
    tenantId?: string;
    reportType: 'journaling' | 'archival' | 'legal-hold' | 'retention' | 'ediscovery' | 'audit';
    reportName: string;
    reportPeriod: {
        start: Date;
        end: Date;
    };
    generatedAt: Date;
    generatedBy: string;
    status: 'generating' | 'completed' | 'failed';
    format: 'pdf' | 'csv' | 'json' | 'html';
    data: ComplianceReportData;
    summary: string;
    fileLocation?: string;
    expiresAt?: Date;
}
interface ComplianceReportData {
    totalMessages?: number;
    journaledMessages?: number;
    archivedMessages?: number;
    legalHolds?: number;
    retentionPolicies?: number;
    eDiscoveryRequests?: number;
    storageUsed?: number;
    complianceViolations?: any[];
    statistics?: Record<string, any>;
}
interface ArchiveSearchQuery {
    archiveId?: string;
    tenantId?: string;
    keywords?: string[];
    dateRange?: {
        start: Date;
        end: Date;
    };
    senders?: string[];
    recipients?: string[];
    subjects?: string[];
    hasAttachments?: boolean;
    folderNames?: string[];
    messageTypes?: string[];
    limit?: number;
    offset?: number;
}
interface ArchiveSearchResult {
    id: string;
    archiveId: string;
    messageId: string;
    subject: string;
    from: EmailAddress;
    to: EmailAddress[];
    sentDate: Date;
    size: number;
    hasAttachments: boolean;
    folderPath?: string;
    snippet?: string;
    relevanceScore?: number;
    metadata?: Record<string, any>;
}
interface JournalRule {
    id: string;
    tenantId?: string;
    ruleName: string;
    description?: string;
    isEnabled: boolean;
    priority: number;
    scope: 'all' | 'internal' | 'external' | 'custom';
    conditions: JournalConditions;
    journalRecipient: string;
    retentionPolicyId?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
    lastModifiedAt: Date;
}
interface JournalConditions {
    senderAddresses?: string[];
    recipientAddresses?: string[];
    senderDomains?: string[];
    recipientDomains?: string[];
    userIds?: string[];
    distributionLists?: string[];
    excludeInternal?: boolean;
}
interface TamperProofMetadata {
    hash: string;
    previousHash?: string;
    timestamp: Date;
    nonce: string;
    difficulty?: number;
    blockNumber?: number;
    verified: boolean;
    verificationChain: string[];
}
interface MultiTenantArchiveConfig {
    tenantId: string;
    isolationLevel: 'database' | 'schema' | 'table' | 'row';
    storageQuota?: number;
    storageUsed: number;
    retentionDefault: number;
    encryptionRequired: boolean;
    complianceLevel: 'basic' | 'hipaa' | 'gdpr' | 'sox' | 'finra';
    allowedFormats: string[];
    maxArchiveSize?: number;
    customSettings?: Record<string, any>;
}
/**
 * Sequelize JournalEntry model attributes for journal_entries table.
 *
 * @example
 * ```typescript
 * class JournalEntry extends Model {}
 * JournalEntry.init(getJournalEntryModelAttributes(), {
 *   sequelize,
 *   tableName: 'mail_journal_entries',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['tenantId', 'userId'] },
 *     { fields: ['messageId'] },
 *     { fields: ['journaledAt'] },
 *     { fields: ['hash'], unique: true }
 *   ]
 * });
 * ```
 */
export declare const getJournalEntryModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    tenantId: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    messageId: {
        type: string;
        allowNull: boolean;
        references: {
            model: string;
            key: string;
        };
    };
    userId: {
        type: string;
        allowNull: boolean;
        references: {
            model: string;
            key: string;
        };
    };
    journalType: {
        type: string;
        values: string[];
        allowNull: boolean;
    };
    journalRule: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    originalMessageId: {
        type: string;
        allowNull: boolean;
    };
    internetMessageId: {
        type: string;
        allowNull: boolean;
    };
    subject: {
        type: string;
        allowNull: boolean;
    };
    from: {
        type: string;
        allowNull: boolean;
    };
    to: {
        type: string;
        allowNull: boolean;
    };
    cc: {
        type: string;
        allowNull: boolean;
    };
    bcc: {
        type: string;
        allowNull: boolean;
    };
    sentDateTime: {
        type: string;
        allowNull: boolean;
    };
    receivedDateTime: {
        type: string;
        allowNull: boolean;
    };
    size: {
        type: string;
        allowNull: boolean;
    };
    bodyPreview: {
        type: string;
        allowNull: boolean;
    };
    headers: {
        type: string;
        allowNull: boolean;
        defaultValue: {};
    };
    messageContent: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    attachmentCount: {
        type: string;
        defaultValue: number;
    };
    journaledAt: {
        type: string;
        allowNull: boolean;
        defaultValue: string;
    };
    journalStatus: {
        type: string;
        values: string[];
        defaultValue: string;
    };
    complianceReason: {
        type: string;
        allowNull: boolean;
    };
    retentionPolicyId: {
        type: string;
        allowNull: boolean;
        references: {
            model: string;
            key: string;
        };
    };
    legalHoldIds: {
        type: string;
        defaultValue: never[];
    };
    metadata: {
        type: string;
        defaultValue: {};
    };
    hash: {
        type: string;
        allowNull: boolean;
        unique: boolean;
        comment: string;
    };
    previousHash: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    blockchainVerified: {
        type: string;
        defaultValue: boolean;
    };
    encryptionInfo: {
        type: string;
        allowNull: boolean;
    };
    createdAt: {
        type: string;
        allowNull: boolean;
    };
    updatedAt: {
        type: string;
        allowNull: boolean;
    };
};
/**
 * Sequelize MessageArchive model attributes for message_archives table.
 *
 * @example
 * ```typescript
 * class MessageArchive extends Model {}
 * MessageArchive.init(getMessageArchiveModelAttributes(), {
 *   sequelize,
 *   tableName: 'mail_message_archives',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['tenantId'] },
 *     { fields: ['userId'] },
 *     { fields: ['status'] },
 *     { fields: ['createdAt'] }
 *   ]
 * });
 * ```
 */
export declare const getMessageArchiveModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    tenantId: {
        type: string;
        allowNull: boolean;
    };
    archiveName: {
        type: string;
        allowNull: boolean;
    };
    archiveType: {
        type: string;
        values: string[];
        allowNull: boolean;
    };
    userId: {
        type: string;
        allowNull: boolean;
        references: {
            model: string;
            key: string;
        };
    };
    folderId: {
        type: string;
        allowNull: boolean;
        references: {
            model: string;
            key: string;
        };
    };
    startDate: {
        type: string;
        allowNull: boolean;
    };
    endDate: {
        type: string;
        allowNull: boolean;
    };
    messageCount: {
        type: string;
        defaultValue: number;
    };
    totalSize: {
        type: string;
        allowNull: boolean;
    };
    compressedSize: {
        type: string;
        allowNull: boolean;
    };
    compressionRatio: {
        type: string;
        defaultValue: number;
    };
    format: {
        type: string;
        values: string[];
        allowNull: boolean;
    };
    storageLocation: {
        type: string;
        allowNull: boolean;
    };
    storageProvider: {
        type: string;
        values: string[];
        defaultValue: string;
    };
    status: {
        type: string;
        values: string[];
        defaultValue: string;
    };
    completedAt: {
        type: string;
        allowNull: boolean;
    };
    expiresAt: {
        type: string;
        allowNull: boolean;
    };
    accessCount: {
        type: string;
        defaultValue: number;
    };
    lastAccessedAt: {
        type: string;
        allowNull: boolean;
    };
    retentionPolicyId: {
        type: string;
        allowNull: boolean;
        references: {
            model: string;
            key: string;
        };
    };
    legalHoldIds: {
        type: string;
        defaultValue: never[];
    };
    isEncrypted: {
        type: string;
        defaultValue: boolean;
    };
    encryptionInfo: {
        type: string;
        allowNull: boolean;
    };
    checksums: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    metadata: {
        type: string;
        defaultValue: {};
    };
    tags: {
        type: string;
        defaultValue: never[];
    };
    createdAt: {
        type: string;
        allowNull: boolean;
    };
    updatedAt: {
        type: string;
        allowNull: boolean;
    };
};
/**
 * Sequelize LegalHold model attributes for legal_holds table.
 *
 * @example
 * ```typescript
 * class LegalHold extends Model {}
 * LegalHold.init(getLegalHoldModelAttributes(), {
 *   sequelize,
 *   tableName: 'mail_legal_holds',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['tenantId'] },
 *     { fields: ['status'] },
 *     { fields: ['caseNumber'] }
 *   ]
 * });
 * ```
 */
export declare const getLegalHoldModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    tenantId: {
        type: string;
        allowNull: boolean;
    };
    holdName: {
        type: string;
        allowNull: boolean;
    };
    caseNumber: {
        type: string;
        allowNull: boolean;
        unique: boolean;
    };
    description: {
        type: string;
        allowNull: boolean;
    };
    holdType: {
        type: string;
        values: string[];
        allowNull: boolean;
    };
    status: {
        type: string;
        values: string[];
        defaultValue: string;
    };
    priority: {
        type: string;
        values: string[];
        defaultValue: string;
    };
    createdBy: {
        type: string;
        allowNull: boolean;
        references: {
            model: string;
            key: string;
        };
    };
    releasedAt: {
        type: string;
        allowNull: boolean;
    };
    expiresAt: {
        type: string;
        allowNull: boolean;
    };
    scope: {
        type: string;
        allowNull: boolean;
    };
    affectedUsers: {
        type: string;
        defaultValue: never[];
    };
    affectedMessageCount: {
        type: string;
        defaultValue: number;
    };
    custodians: {
        type: string;
        defaultValue: never[];
    };
    notificationStatus: {
        type: string;
        values: string[];
        defaultValue: string;
    };
    metadata: {
        type: string;
        defaultValue: {};
    };
    complianceNotes: {
        type: string;
        allowNull: boolean;
    };
    attachments: {
        type: string;
        defaultValue: never[];
    };
    createdAt: {
        type: string;
        allowNull: boolean;
    };
    updatedAt: {
        type: string;
        allowNull: boolean;
    };
};
/**
 * Sequelize RetentionPolicy model attributes for retention_policies table.
 *
 * @example
 * ```typescript
 * class RetentionPolicy extends Model {}
 * RetentionPolicy.init(getRetentionPolicyModelAttributes(), {
 *   sequelize,
 *   tableName: 'mail_retention_policies',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['tenantId'] },
 *     { fields: ['isEnabled'] },
 *     { fields: ['nextExecutionAt'] }
 *   ]
 * });
 * ```
 */
export declare const getRetentionPolicyModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    tenantId: {
        type: string;
        allowNull: boolean;
    };
    policyName: {
        type: string;
        allowNull: boolean;
    };
    description: {
        type: string;
        allowNull: boolean;
    };
    policyType: {
        type: string;
        values: string[];
        allowNull: boolean;
    };
    isEnabled: {
        type: string;
        defaultValue: boolean;
    };
    priority: {
        type: string;
        defaultValue: number;
        comment: string;
    };
    retentionPeriod: {
        type: string;
        allowNull: boolean;
    };
    action: {
        type: string;
        values: string[];
        allowNull: boolean;
    };
    scope: {
        type: string;
        allowNull: boolean;
    };
    excludeConditions: {
        type: string;
        allowNull: boolean;
    };
    includeConditions: {
        type: string;
        allowNull: boolean;
    };
    createdBy: {
        type: string;
        allowNull: boolean;
        references: {
            model: string;
            key: string;
        };
    };
    lastModifiedAt: {
        type: string;
        allowNull: boolean;
    };
    lastExecutedAt: {
        type: string;
        allowNull: boolean;
    };
    nextExecutionAt: {
        type: string;
        allowNull: boolean;
    };
    executionSchedule: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    affectedMessageCount: {
        type: string;
        defaultValue: number;
    };
    metadata: {
        type: string;
        defaultValue: {};
    };
    createdAt: {
        type: string;
        allowNull: boolean;
    };
    updatedAt: {
        type: string;
        allowNull: boolean;
    };
};
/**
 * Sequelize eDiscoveryRequest model attributes for ediscovery_requests table.
 *
 * @example
 * ```typescript
 * class eDiscoveryRequest extends Model {}
 * eDiscoveryRequest.init(getEDiscoveryRequestModelAttributes(), {
 *   sequelize,
 *   tableName: 'mail_ediscovery_requests',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['tenantId'] },
 *     { fields: ['status'] },
 *     { fields: ['caseNumber'] }
 *   ]
 * });
 * ```
 */
export declare const getEDiscoveryRequestModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    tenantId: {
        type: string;
        allowNull: boolean;
    };
    requestName: {
        type: string;
        allowNull: boolean;
    };
    caseNumber: {
        type: string;
        allowNull: boolean;
    };
    requestType: {
        type: string;
        values: string[];
        allowNull: boolean;
    };
    status: {
        type: string;
        values: string[];
        defaultValue: string;
    };
    priority: {
        type: string;
        values: string[];
        defaultValue: string;
    };
    requestedBy: {
        type: string;
        allowNull: boolean;
        references: {
            model: string;
            key: string;
        };
    };
    requestedAt: {
        type: string;
        allowNull: boolean;
        defaultValue: string;
    };
    completedAt: {
        type: string;
        allowNull: boolean;
    };
    searchCriteria: {
        type: string;
        allowNull: boolean;
    };
    resultsCount: {
        type: string;
        defaultValue: number;
    };
    resultsSize: {
        type: string;
        defaultValue: number;
    };
    exportFormat: {
        type: string;
        values: string[];
        allowNull: boolean;
    };
    exportLocation: {
        type: string;
        allowNull: boolean;
    };
    legalHoldId: {
        type: string;
        allowNull: boolean;
        references: {
            model: string;
            key: string;
        };
    };
    reviewers: {
        type: string;
        defaultValue: never[];
    };
    metadata: {
        type: string;
        defaultValue: {};
    };
    auditTrail: {
        type: string;
        defaultValue: never[];
    };
    createdAt: {
        type: string;
        allowNull: boolean;
    };
    updatedAt: {
        type: string;
        allowNull: boolean;
    };
};
/**
 * Creates a journal entry for a message to ensure compliance and immutability.
 *
 * @param {MailMessage} message - Original message to journal
 * @param {string} journalType - Type of journal entry
 * @param {string} complianceReason - Reason for journaling
 * @returns {JournalEntry} Created journal entry
 *
 * @example
 * ```typescript
 * const journalEntry = await createJournalEntry(message, 'outgoing', 'HIPAA Compliance');
 * // Journal entry with tamper-proof hash created
 * ```
 */
export declare const createJournalEntry: (message: any, journalType: "incoming" | "outgoing" | "internal" | "external", complianceReason?: string, previousHash?: string) => JournalEntry;
/**
 * Verifies the integrity of a journal entry using its hash chain.
 *
 * @param {JournalEntry} entry - Journal entry to verify
 * @param {JournalEntry} previousEntry - Previous entry in the chain
 * @returns {boolean} True if entry is verified
 *
 * @example
 * ```typescript
 * const isValid = verifyJournalEntry(currentEntry, previousEntry);
 * if (!isValid) {
 *   console.error('Journal entry has been tampered with!');
 * }
 * ```
 */
export declare const verifyJournalEntry: (entry: JournalEntry, previousEntry?: JournalEntry) => boolean;
/**
 * Retrieves journal entries matching specified criteria with pagination.
 *
 * @param {Object} criteria - Search criteria for journal entries
 * @param {number} limit - Maximum results to return
 * @param {number} offset - Number of results to skip
 * @returns {JournalEntry[]} Array of matching journal entries
 *
 * @example
 * ```typescript
 * const entries = getJournalEntries({
 *   userId: 'user-123',
 *   journalType: 'outgoing',
 *   dateRange: { start: new Date('2024-01-01'), end: new Date('2024-12-31') }
 * }, 100, 0);
 * ```
 */
export declare const getJournalEntries: (criteria: {
    userId?: string;
    tenantId?: string;
    journalType?: string;
    dateRange?: {
        start: Date;
        end: Date;
    };
    complianceReason?: string;
    status?: string;
}, limit?: number, offset?: number) => Partial<JournalEntry>[];
/**
 * Applies a journal rule to determine if a message should be journaled.
 *
 * @param {any} message - Message to evaluate
 * @param {JournalRule} rule - Journal rule to apply
 * @returns {boolean} True if message matches rule conditions
 *
 * @example
 * ```typescript
 * const shouldJournal = applyJournalRule(message, {
 *   ruleName: 'External Communications',
 *   scope: 'external',
 *   conditions: { recipientDomains: ['external.com'] }
 * });
 * ```
 */
export declare const applyJournalRule: (message: any, rule: JournalRule) => boolean;
/**
 * Exports journal entries to a specified format for auditing or compliance.
 *
 * @param {string[]} journalIds - IDs of journal entries to export
 * @param {string} format - Export format
 * @returns {Buffer} Exported journal data
 *
 * @example
 * ```typescript
 * const exportData = await exportJournalEntries(['journal-1', 'journal-2'], 'json');
 * fs.writeFileSync('journal-export.json', exportData);
 * ```
 */
export declare const exportJournalEntries: (journalIds: string[], format?: "json" | "csv" | "xml") => Buffer;
/**
 * Rebuilds the journal hash chain to verify integrity of entire journal.
 *
 * @param {JournalEntry[]} entries - Journal entries in chronological order
 * @returns {Object} Verification result with any broken chains
 *
 * @example
 * ```typescript
 * const result = verifyJournalChain(allJournalEntries);
 * if (!result.isValid) {
 *   console.error('Broken chain at:', result.brokenChains);
 * }
 * ```
 */
export declare const verifyJournalChain: (entries: JournalEntry[]) => {
    isValid: boolean;
    brokenChains: number[];
    verifiedCount: number;
};
/**
 * Creates a new message archive with specified criteria and format.
 *
 * @param {Object} options - Archive creation options
 * @returns {MessageArchive} Created archive metadata
 *
 * @example
 * ```typescript
 * const archive = await createMessageArchive({
 *   archiveName: 'Q1 2024 Communications',
 *   archiveType: 'date-range',
 *   userId: 'user-123',
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-03-31'),
 *   format: 'pst',
 *   encryption: { enabled: true, algorithm: 'AES-256' }
 * });
 * ```
 */
export declare const createMessageArchive: (options: {
    archiveName: string;
    archiveType: MessageArchive["archiveType"];
    userId?: string;
    folderId?: string;
    startDate?: Date;
    endDate?: Date;
    format: "pst" | "mbox" | "eml" | "msg" | "zip";
    tenantId?: string;
    encryption?: {
        enabled: boolean;
        algorithm: string;
        keyId?: string;
    };
    retentionPolicyId?: string;
}) => MessageArchive;
/**
 * Extracts messages from an archive file into the mail system.
 *
 * @param {string} archiveId - Archive to extract
 * @param {ArchiveImportOptions} options - Import options
 * @returns {Object} Import result with statistics
 *
 * @example
 * ```typescript
 * const result = await extractArchive('archive-123', {
 *   format: 'pst',
 *   targetUserId: 'user-456',
 *   targetFolderId: 'folder-789',
 *   preserveDates: true,
 *   deduplication: true
 * });
 * console.log(`Imported ${result.importedCount} messages`);
 * ```
 */
export declare const extractArchive: (archiveId: string, options: ArchiveImportOptions) => {
    success: boolean;
    importedCount: number;
    skippedCount: number;
    errorCount: number;
    duration: number;
};
/**
 * Updates archive metadata and status.
 *
 * @param {string} archiveId - Archive to update
 * @param {Partial<MessageArchive>} updates - Fields to update
 * @returns {MessageArchive} Updated archive
 *
 * @example
 * ```typescript
 * const updated = updateArchive('archive-123', {
 *   status: 'completed',
 *   completedAt: new Date(),
 *   tags: ['Q1-2024', 'compliance']
 * });
 * ```
 */
export declare const updateArchive: (archiveId: string, updates: Partial<MessageArchive>) => MessageArchive;
/**
 * Deletes an archive and its associated files from storage.
 *
 * @param {string} archiveId - Archive to delete
 * @param {boolean} permanent - If true, permanently delete; otherwise soft delete
 * @returns {boolean} True if deletion successful
 *
 * @example
 * ```typescript
 * const deleted = await deleteArchive('archive-123', true);
 * if (deleted) {
 *   console.log('Archive permanently deleted');
 * }
 * ```
 */
export declare const deleteArchive: (archiveId: string, permanent?: boolean) => boolean;
/**
 * Verifies archive integrity using checksums.
 *
 * @param {MessageArchive} archive - Archive to verify
 * @returns {Object} Verification result
 *
 * @example
 * ```typescript
 * const result = await verifyArchiveIntegrity(archive);
 * if (!result.isValid) {
 *   console.error('Checksum mismatch:', result.errors);
 * }
 * ```
 */
export declare const verifyArchiveIntegrity: (archive: MessageArchive) => {
    isValid: boolean;
    checksumMatches: {
        md5: boolean;
        sha256: boolean;
        sha512: boolean;
    };
    errors: string[];
};
/**
 * Lists all archives matching specified criteria.
 *
 * @param {Object} criteria - Filter criteria
 * @param {number} limit - Maximum results
 * @param {number} offset - Results offset
 * @returns {MessageArchive[]} Matching archives
 *
 * @example
 * ```typescript
 * const archives = listArchives({
 *   tenantId: 'tenant-123',
 *   status: 'completed',
 *   startDate: new Date('2024-01-01')
 * }, 50, 0);
 * ```
 */
export declare const listArchives: (criteria: {
    tenantId?: string;
    userId?: string;
    status?: string;
    archiveType?: string;
    startDate?: Date;
    endDate?: Date;
}, limit?: number, offset?: number) => MessageArchive[];
/**
 * Creates a new legal hold to preserve messages for litigation or investigation.
 *
 * @param {Object} holdData - Legal hold configuration
 * @returns {LegalHold} Created legal hold
 *
 * @example
 * ```typescript
 * const hold = await createLegalHold({
 *   holdName: 'Smith v. Hospital Litigation',
 *   caseNumber: 'CASE-2024-001',
 *   holdType: 'litigation',
 *   scope: {
 *     userIds: ['user-123', 'user-456'],
 *     dateRange: { start: new Date('2023-01-01'), end: new Date('2024-12-31') }
 *   },
 *   custodians: [
 *     { userId: 'user-123', emailAddress: 'doctor@hospital.com', name: 'Dr. Smith' }
 *   ]
 * });
 * ```
 */
export declare const createLegalHold: (holdData: {
    holdName: string;
    caseNumber?: string;
    description?: string;
    holdType: LegalHold["holdType"];
    priority?: LegalHold["priority"];
    scope: LegalHoldScope;
    custodians?: HoldCustodian[];
    createdBy: string;
    tenantId?: string;
    expiresAt?: Date;
}) => LegalHold;
/**
 * Releases a legal hold, allowing normal retention policies to resume.
 *
 * @param {string} holdId - Legal hold to release
 * @param {string} releasedBy - User releasing the hold
 * @param {string} reason - Reason for release
 * @returns {LegalHold} Updated legal hold
 *
 * @example
 * ```typescript
 * const released = await releaseLegalHold('hold-123', 'admin-user', 'Case settled');
 * console.log(`Released hold affecting ${released.affectedMessageCount} messages`);
 * ```
 */
export declare const releaseLegalHold: (holdId: string, releasedBy: string, reason?: string) => LegalHold;
/**
 * Applies legal hold to messages matching the hold scope.
 *
 * @param {string} holdId - Legal hold to apply
 * @returns {Object} Application result
 *
 * @example
 * ```typescript
 * const result = await applyLegalHoldToMessages('hold-123');
 * console.log(`Applied hold to ${result.affectedCount} messages`);
 * ```
 */
export declare const applyLegalHoldToMessages: (holdId: string) => {
    success: boolean;
    affectedCount: number;
    errors: string[];
};
/**
 * Notifies custodians of a legal hold requirement.
 *
 * @param {string} holdId - Legal hold ID
 * @param {string[]} custodianIds - Custodian user IDs to notify
 * @returns {Object} Notification results
 *
 * @example
 * ```typescript
 * const result = await notifyLegalHoldCustodians('hold-123', ['user-1', 'user-2']);
 * console.log(`Notified ${result.notified} of ${result.total} custodians`);
 * ```
 */
export declare const notifyLegalHoldCustodians: (holdId: string, custodianIds: string[]) => {
    notified: number;
    failed: number;
    total: number;
};
/**
 * Lists all active legal holds matching criteria.
 *
 * @param {Object} criteria - Filter criteria
 * @returns {LegalHold[]} Matching legal holds
 *
 * @example
 * ```typescript
 * const holds = listLegalHolds({
 *   status: 'active',
 *   holdType: 'litigation',
 *   tenantId: 'tenant-123'
 * });
 * ```
 */
export declare const listLegalHolds: (criteria: {
    tenantId?: string;
    status?: string;
    holdType?: string;
    caseNumber?: string;
}) => LegalHold[];
/**
 * Creates an eDiscovery request for searching and exporting messages.
 *
 * @param {Object} requestData - eDiscovery request configuration
 * @returns {eDiscoveryRequest} Created request
 *
 * @example
 * ```typescript
 * const request = await createEDiscoveryRequest({
 *   requestName: 'Patient Records Discovery',
 *   requestType: 'search',
 *   searchCriteria: {
 *     keywords: ['patient', 'medical records'],
 *     dateRange: { start: new Date('2024-01-01'), end: new Date('2024-12-31') },
 *     senders: ['doctor@hospital.com']
 *   },
 *   exportFormat: 'pst',
 *   requestedBy: 'legal-team-user'
 * });
 * ```
 */
export declare const createEDiscoveryRequest: (requestData: {
    requestName: string;
    caseNumber?: string;
    requestType: eDiscoveryRequest["requestType"];
    priority?: eDiscoveryRequest["priority"];
    searchCriteria: eDiscoverySearchCriteria;
    exportFormat?: "pst" | "mbox" | "eml" | "pdf" | "csv";
    requestedBy: string;
    tenantId?: string;
    legalHoldId?: string;
    reviewers?: string[];
}) => eDiscoveryRequest;
/**
 * Executes an eDiscovery search based on the request criteria.
 *
 * @param {string} requestId - eDiscovery request ID
 * @returns {Object} Search results
 *
 * @example
 * ```typescript
 * const results = await executeEDiscoverySearch('request-123');
 * console.log(`Found ${results.resultsCount} matching messages`);
 * ```
 */
export declare const executeEDiscoverySearch: (requestId: string) => {
    requestId: string;
    resultsCount: number;
    resultsSize: number;
    results: ArchiveSearchResult[];
    executionTime: number;
};
/**
 * Exports eDiscovery search results to specified format.
 *
 * @param {string} requestId - eDiscovery request ID
 * @param {string} format - Export format
 * @returns {Object} Export result
 *
 * @example
 * ```typescript
 * const exportResult = await exportEDiscoveryResults('request-123', 'pst');
 * console.log(`Export location: ${exportResult.exportLocation}`);
 * ```
 */
export declare const exportEDiscoveryResults: (requestId: string, format: "pst" | "mbox" | "eml" | "pdf" | "csv") => {
    success: boolean;
    exportLocation: string;
    fileSize: number;
    messageCount: number;
};
/**
 * Adds an audit entry to an eDiscovery request for compliance tracking.
 *
 * @param {string} requestId - Request to audit
 * @param {string} action - Action performed
 * @param {string} userId - User who performed action
 * @param {string} details - Action details
 * @returns {eDiscoveryAuditEntry} Created audit entry
 *
 * @example
 * ```typescript
 * const entry = addEDiscoveryAuditEntry(
 *   'request-123',
 *   'RESULTS_EXPORTED',
 *   'user-456',
 *   'Exported 500 messages to PST format'
 * );
 * ```
 */
export declare const addEDiscoveryAuditEntry: (requestId: string, action: string, userId: string, details: string, ipAddress?: string) => eDiscoveryAuditEntry;
/**
 * Searches within archives for messages matching query criteria.
 *
 * @param {ArchiveSearchQuery} query - Search query
 * @returns {ArchiveSearchResult[]} Matching messages
 *
 * @example
 * ```typescript
 * const results = await searchArchive({
 *   archiveId: 'archive-123',
 *   keywords: ['patient', 'treatment'],
 *   dateRange: { start: new Date('2024-01-01'), end: new Date('2024-12-31') },
 *   senders: ['doctor@hospital.com'],
 *   limit: 100
 * });
 * ```
 */
export declare const searchArchive: (query: ArchiveSearchQuery) => ArchiveSearchResult[];
/**
 * Retrieves a specific message from an archive by ID.
 *
 * @param {string} archiveId - Archive containing the message
 * @param {string} messageId - Message to retrieve
 * @returns {Object} Retrieved message with metadata
 *
 * @example
 * ```typescript
 * const message = await retrieveArchivedMessage('archive-123', 'message-456');
 * console.log('Retrieved:', message.subject);
 * ```
 */
export declare const retrieveArchivedMessage: (archiveId: string, messageId: string) => {
    message: any;
    metadata: {
        archiveId: string;
        retrievedAt: Date;
        source: string;
    };
};
/**
 * Restores archived messages back to active mailboxes.
 *
 * @param {string} archiveId - Source archive
 * @param {string[]} messageIds - Messages to restore
 * @param {string} targetFolderId - Destination folder
 * @returns {Object} Restoration result
 *
 * @example
 * ```typescript
 * const result = await restoreArchivedMessages(
 *   'archive-123',
 *   ['msg-1', 'msg-2'],
 *   'folder-inbox'
 * );
 * console.log(`Restored ${result.restoredCount} messages`);
 * ```
 */
export declare const restoreArchivedMessages: (archiveId: string, messageIds: string[], targetFolderId: string) => {
    success: boolean;
    restoredCount: number;
    failedCount: number;
    errors: string[];
};
/**
 * Indexes archive content for faster searching.
 *
 * @param {string} archiveId - Archive to index
 * @returns {Object} Indexing result
 *
 * @example
 * ```typescript
 * const result = await indexArchiveContent('archive-123');
 * console.log(`Indexed ${result.messagesIndexed} messages in ${result.duration}ms`);
 * ```
 */
export declare const indexArchiveContent: (archiveId: string) => {
    success: boolean;
    messagesIndexed: number;
    indexSize: number;
    duration: number;
};
/**
 * Exports archive to PST (Personal Storage Table) format for Outlook.
 *
 * @param {string} archiveId - Archive to export
 * @param {ArchiveExportOptions} options - Export options
 * @returns {Object} Export result
 *
 * @example
 * ```typescript
 * const result = await exportArchiveToPST('archive-123', {
 *   format: 'pst',
 *   includeAttachments: true,
 *   includeHeaders: true,
 *   compression: 'zip',
 *   encryption: { enabled: true, algorithm: 'AES-256', password: 'secure123' }
 * });
 * ```
 */
export declare const exportArchiveToPST: (archiveId: string, options: ArchiveExportOptions) => {
    success: boolean;
    exportPath: string;
    fileSize: number;
    messageCount: number;
    duration: number;
};
/**
 * Exports archive to MBOX format (Unix mailbox format).
 *
 * @param {string} archiveId - Archive to export
 * @param {ArchiveExportOptions} options - Export options
 * @returns {Object} Export result
 *
 * @example
 * ```typescript
 * const result = await exportArchiveToMBOX('archive-123', {
 *   format: 'mbox',
 *   includeAttachments: true,
 *   compression: 'gzip'
 * });
 * ```
 */
export declare const exportArchiveToMBOX: (archiveId: string, options: ArchiveExportOptions) => {
    success: boolean;
    exportPath: string;
    fileSize: number;
    messageCount: number;
};
/**
 * Exports individual messages as EML files in a ZIP archive.
 *
 * @param {string} archiveId - Archive to export
 * @param {ArchiveExportOptions} options - Export options
 * @returns {Object} Export result
 *
 * @example
 * ```typescript
 * const result = await exportArchiveToEML('archive-123', {
 *   format: 'eml',
 *   includeAttachments: true,
 *   preserveStructure: true
 * });
 * ```
 */
export declare const exportArchiveToEML: (archiveId: string, options: ArchiveExportOptions) => {
    success: boolean;
    exportPath: string;
    fileCount: number;
    totalSize: number;
};
/**
 * Imports messages from PST file into archive system.
 *
 * @param {string} pstFilePath - Path to PST file
 * @param {ArchiveImportOptions} options - Import options
 * @returns {Object} Import result
 *
 * @example
 * ```typescript
 * const result = await importPSTToArchive('/imports/backup.pst', {
 *   format: 'pst',
 *   targetUserId: 'user-123',
 *   preserveDates: true,
 *   deduplication: true
 * });
 * ```
 */
export declare const importPSTToArchive: (pstFilePath: string, options: ArchiveImportOptions) => {
    success: boolean;
    archiveId: string;
    importedCount: number;
    skippedCount: number;
    errors: string[];
};
/**
 * Imports messages from MBOX file into archive system.
 *
 * @param {string} mboxFilePath - Path to MBOX file
 * @param {ArchiveImportOptions} options - Import options
 * @returns {Object} Import result
 *
 * @example
 * ```typescript
 * const result = await importMBOXToArchive('/imports/mailbox.mbox', {
 *   format: 'mbox',
 *   targetUserId: 'user-123',
 *   preserveDates: true
 * });
 * ```
 */
export declare const importMBOXToArchive: (mboxFilePath: string, options: ArchiveImportOptions) => {
    success: boolean;
    archiveId: string;
    importedCount: number;
    errors: string[];
};
/**
 * Converts archive between different formats.
 *
 * @param {string} archiveId - Archive to convert
 * @param {string} targetFormat - Desired format
 * @returns {Object} Conversion result
 *
 * @example
 * ```typescript
 * const result = await convertArchiveFormat('archive-123', 'mbox');
 * console.log(`Converted to ${result.targetFormat}: ${result.outputPath}`);
 * ```
 */
export declare const convertArchiveFormat: (archiveId: string, targetFormat: "pst" | "mbox" | "eml" | "zip") => {
    success: boolean;
    outputPath: string;
    targetFormat: string;
    conversionTime: number;
};
/**
 * Creates a new retention policy for automated message management.
 *
 * @param {Object} policyData - Retention policy configuration
 * @returns {RetentionPolicy} Created policy
 *
 * @example
 * ```typescript
 * const policy = await createRetentionPolicy({
 *   policyName: 'HIPAA 7-Year Retention',
 *   policyType: 'time-based',
 *   retentionPeriod: { years: 7 },
 *   action: 'archive',
 *   scope: { applyToAll: true },
 *   createdBy: 'admin-user'
 * });
 * ```
 */
export declare const createRetentionPolicy: (policyData: {
    policyName: string;
    description?: string;
    policyType: RetentionPolicy["policyType"];
    retentionPeriod: RetentionPeriod;
    action: RetentionPolicy["action"];
    scope: RetentionScope;
    includeConditions?: RetentionConditions;
    excludeConditions?: RetentionConditions;
    createdBy: string;
    tenantId?: string;
    priority?: number;
    executionSchedule?: string;
}) => RetentionPolicy;
/**
 * Applies retention policy to messages matching policy criteria.
 *
 * @param {string} policyId - Policy to apply
 * @returns {Object} Application result
 *
 * @example
 * ```typescript
 * const result = await applyRetentionPolicy('policy-123');
 * console.log(`Policy applied to ${result.affectedCount} messages`);
 * console.log(`Archived: ${result.archived}, Deleted: ${result.deleted}`);
 * ```
 */
export declare const applyRetentionPolicy: (policyId: string) => {
    success: boolean;
    affectedCount: number;
    archived: number;
    deleted: number;
    moved: number;
    errors: string[];
    executionTime: number;
};
/**
 * Evaluates if a message matches retention policy conditions.
 *
 * @param {any} message - Message to evaluate
 * @param {RetentionPolicy} policy - Policy to check
 * @returns {boolean} True if message matches policy
 *
 * @example
 * ```typescript
 * const matches = evaluateRetentionPolicy(message, policy);
 * if (matches) {
 *   console.log('Message will be affected by policy');
 * }
 * ```
 */
export declare const evaluateRetentionPolicy: (message: any, policy: RetentionPolicy) => boolean;
/**
 * Lists all retention policies with optional filtering.
 *
 * @param {Object} criteria - Filter criteria
 * @returns {RetentionPolicy[]} Matching policies
 *
 * @example
 * ```typescript
 * const policies = listRetentionPolicies({
 *   tenantId: 'tenant-123',
 *   isEnabled: true,
 *   policyType: 'time-based'
 * });
 * ```
 */
export declare const listRetentionPolicies: (criteria: {
    tenantId?: string;
    isEnabled?: boolean;
    policyType?: string;
}) => RetentionPolicy[];
/**
 * Updates an existing retention policy.
 *
 * @param {string} policyId - Policy to update
 * @param {Partial<RetentionPolicy>} updates - Fields to update
 * @returns {RetentionPolicy} Updated policy
 *
 * @example
 * ```typescript
 * const updated = await updateRetentionPolicy('policy-123', {
 *   isEnabled: false,
 *   description: 'Temporarily disabled for migration'
 * });
 * ```
 */
export declare const updateRetentionPolicy: (policyId: string, updates: Partial<RetentionPolicy>) => RetentionPolicy;
/**
 * Generates a comprehensive compliance report for journaling and archival.
 *
 * @param {Object} reportConfig - Report configuration
 * @returns {ComplianceReport} Generated report
 *
 * @example
 * ```typescript
 * const report = await generateComplianceReport({
 *   reportType: 'journaling',
 *   reportName: 'Q4 2024 Journaling Report',
 *   reportPeriod: {
 *     start: new Date('2024-10-01'),
 *     end: new Date('2024-12-31')
 *   },
 *   format: 'pdf',
 *   generatedBy: 'compliance-officer'
 * });
 * ```
 */
export declare const generateComplianceReport: (reportConfig: {
    reportType: ComplianceReport["reportType"];
    reportName: string;
    reportPeriod: {
        start: Date;
        end: Date;
    };
    format: "pdf" | "csv" | "json" | "html";
    generatedBy: string;
    tenantId?: string;
}) => ComplianceReport;
/**
 * Generates an audit trail report for compliance tracking.
 *
 * @param {Object} criteria - Audit trail criteria
 * @returns {Object} Audit trail report
 *
 * @example
 * ```typescript
 * const auditReport = await generateAuditTrailReport({
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-12-31'),
 *   actions: ['ARCHIVE_CREATED', 'LEGAL_HOLD_APPLIED'],
 *   userIds: ['user-123']
 * });
 * ```
 */
export declare const generateAuditTrailReport: (criteria: {
    startDate: Date;
    endDate: Date;
    actions?: string[];
    userIds?: string[];
    tenantId?: string;
}) => {
    reportId: string;
    totalActions: number;
    actions: any[];
    summary: Record<string, number>;
};
/**
 * Generates storage usage report for capacity planning.
 *
 * @param {string} tenantId - Tenant ID (optional)
 * @returns {Object} Storage usage report
 *
 * @example
 * ```typescript
 * const storageReport = await generateStorageUsageReport('tenant-123');
 * console.log(`Total storage used: ${storageReport.totalStorageBytes} bytes`);
 * ```
 */
export declare const generateStorageUsageReport: (tenantId?: string) => {
    totalStorageBytes: number;
    archiveStorageBytes: number;
    journalStorageBytes: number;
    archiveCount: number;
    journalEntryCount: number;
    averageArchiveSize: number;
    storageByType: Record<string, number>;
    storageByFormat: Record<string, number>;
    projectedGrowth: {
        thirtyDays: number;
        sixtyDays: number;
        ninetyDays: number;
    };
};
/**
 * Validates compliance with regulatory requirements (HIPAA, GDPR, etc.).
 *
 * @param {string} tenantId - Tenant to validate
 * @param {string} complianceStandard - Standard to validate against
 * @returns {Object} Compliance validation result
 *
 * @example
 * ```typescript
 * const validation = await validateComplianceRequirements('tenant-123', 'HIPAA');
 * if (!validation.isCompliant) {
 *   console.error('Compliance issues:', validation.violations);
 * }
 * ```
 */
export declare const validateComplianceRequirements: (tenantId: string, complianceStandard: "HIPAA" | "GDPR" | "SOX" | "FINRA") => {
    isCompliant: boolean;
    standard: string;
    violations: any[];
    warnings: any[];
    recommendations: string[];
    lastChecked: Date;
};
/**
 * Creates a tamper-proof archive with blockchain-style verification.
 *
 * @param {MessageArchive} archive - Archive to secure
 * @param {string} previousHash - Hash of previous archive in chain
 * @returns {TamperProofMetadata} Tamper-proof metadata
 *
 * @example
 * ```typescript
 * const metadata = await createTamperProofArchive(archive, previousArchiveHash);
 * console.log('Archive secured with hash:', metadata.hash);
 * ```
 */
export declare const createTamperProofArchive: (archive: MessageArchive, previousHash?: string) => TamperProofMetadata;
/**
 * Verifies the integrity of a tamper-proof archive.
 *
 * @param {MessageArchive} archive - Archive to verify
 * @param {TamperProofMetadata} metadata - Tamper-proof metadata
 * @returns {boolean} True if archive is unmodified
 *
 * @example
 * ```typescript
 * const isValid = verifyTamperProofArchive(archive, metadata);
 * if (!isValid) {
 *   console.error('Archive has been tampered with!');
 * }
 * ```
 */
export declare const verifyTamperProofArchive: (archive: MessageArchive, metadata: TamperProofMetadata) => boolean;
/**
 * Verifies the entire archive chain for tampering.
 *
 * @param {MessageArchive[]} archives - Archives in chronological order
 * @param {TamperProofMetadata[]} metadataList - Corresponding metadata
 * @returns {Object} Chain verification result
 *
 * @example
 * ```typescript
 * const result = verifyArchiveChain(archives, metadataList);
 * if (!result.isValid) {
 *   console.error('Broken chain at index:', result.brokenChainIndex);
 * }
 * ```
 */
export declare const verifyArchiveChain: (archives: MessageArchive[], metadataList: TamperProofMetadata[]) => {
    isValid: boolean;
    brokenChainIndex?: number;
    verifiedCount: number;
};
/**
 * Encrypts an archive with AES-256 encryption.
 *
 * @param {string} archiveId - Archive to encrypt
 * @param {Object} encryptionConfig - Encryption configuration
 * @returns {EncryptionInfo} Encryption metadata
 *
 * @example
 * ```typescript
 * const encInfo = await encryptArchive('archive-123', {
 *   algorithm: 'AES-256-GCM',
 *   keyId: 'key-456',
 *   encryptedBy: 'user-789'
 * });
 * ```
 */
export declare const encryptArchive: (archiveId: string, encryptionConfig: {
    algorithm: string;
    keyId: string;
    encryptedBy: string;
    password?: string;
}) => EncryptionInfo;
/**
 * Decrypts an encrypted archive.
 *
 * @param {string} archiveId - Archive to decrypt
 * @param {EncryptionInfo} encryptionInfo - Encryption metadata
 * @param {string} password - Decryption password or key
 * @returns {boolean} True if decryption successful
 *
 * @example
 * ```typescript
 * const success = await decryptArchive('archive-123', encryptionInfo, 'password123');
 * if (success) {
 *   console.log('Archive decrypted successfully');
 * }
 * ```
 */
export declare const decryptArchive: (archiveId: string, encryptionInfo: EncryptionInfo, password: string) => boolean;
/**
 * Re-encrypts an archive with a new key (key rotation).
 *
 * @param {string} archiveId - Archive to re-encrypt
 * @param {string} newKeyId - New encryption key ID
 * @returns {EncryptionInfo} Updated encryption info
 *
 * @example
 * ```typescript
 * const newEncInfo = await rotateArchiveEncryptionKey('archive-123', 'new-key-456');
 * console.log('Archive re-encrypted with new key');
 * ```
 */
export declare const rotateArchiveEncryptionKey: (archiveId: string, newKeyId: string) => EncryptionInfo;
/**
 * Creates a tenant-specific archive configuration.
 *
 * @param {MultiTenantArchiveConfig} config - Tenant configuration
 * @returns {MultiTenantArchiveConfig} Created configuration
 *
 * @example
 * ```typescript
 * const config = await createTenantArchiveConfig({
 *   tenantId: 'tenant-123',
 *   isolationLevel: 'schema',
 *   storageQuota: 1000000000000, // 1TB
 *   storageUsed: 0,
 *   retentionDefault: 7,
 *   encryptionRequired: true,
 *   complianceLevel: 'hipaa',
 *   allowedFormats: ['pst', 'mbox', 'eml']
 * });
 * ```
 */
export declare const createTenantArchiveConfig: (config: MultiTenantArchiveConfig) => MultiTenantArchiveConfig;
/**
 * Retrieves tenant-specific archive configuration.
 *
 * @param {string} tenantId - Tenant ID
 * @returns {MultiTenantArchiveConfig} Tenant configuration
 *
 * @example
 * ```typescript
 * const config = getTenantArchiveConfig('tenant-123');
 * console.log(`Storage used: ${config.storageUsed} of ${config.storageQuota}`);
 * ```
 */
export declare const getTenantArchiveConfig: (tenantId: string) => MultiTenantArchiveConfig;
/**
 * Validates tenant quota and permissions for archive operations.
 *
 * @param {string} tenantId - Tenant ID
 * @param {number} requiredStorage - Storage required in bytes
 * @returns {Object} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateTenantArchiveQuota('tenant-123', 5000000000);
 * if (!validation.allowed) {
 *   console.error('Quota exceeded:', validation.reason);
 * }
 * ```
 */
export declare const validateTenantArchiveQuota: (tenantId: string, requiredStorage: number) => {
    allowed: boolean;
    availableStorage: number;
    reason?: string;
};
/**
 * Generates Swagger/OpenAPI schema for journal entry.
 *
 * @returns {SwaggerMessageSchema} Swagger schema definition
 *
 * @example
 * ```typescript
 * const schema = getJournalEntrySwaggerSchema();
 * // Use in NestJS controller decorators
 * @ApiBody({ schema })
 * ```
 */
export declare const getJournalEntrySwaggerSchema: () => any;
/**
 * Generates Swagger/OpenAPI schema for message archive.
 *
 * @returns {SwaggerMessageSchema} Swagger schema definition
 *
 * @example
 * ```typescript
 * const schema = getMessageArchiveSwaggerSchema();
 * @ApiResponse({ schema })
 * ```
 */
export declare const getMessageArchiveSwaggerSchema: () => any;
/**
 * Generates Swagger/OpenAPI schema for legal hold.
 *
 * @returns {SwaggerMessageSchema} Swagger schema definition
 */
export declare const getLegalHoldSwaggerSchema: () => any;
export {};
//# sourceMappingURL=mail-journaling-archival-kit.d.ts.map