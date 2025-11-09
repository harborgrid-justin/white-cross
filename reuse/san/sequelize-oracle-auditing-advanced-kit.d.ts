/**
 * LOC: A1U2D3I4T5
 * File: /reuse/san/sequelize-oracle-auditing-advanced-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (v6.x)
 *   - crypto (Node.js native)
 *   - stream (Node.js native)
 *   - zlib (Node.js native)
 *
 * DOWNSTREAM (imported by):
 *   - Audit trail implementations
 *   - Compliance reporting systems
 *   - Security monitoring services
 *   - Data retention policies
 */
/**
 * File: /reuse/san/sequelize-oracle-auditing-advanced-kit.ts
 * Locator: WC-UTL-SEQ-AUDIT-001
 * Purpose: Sequelize Oracle Auditing Advanced Kit - Enterprise-grade audit trail and compliance system
 *
 * Upstream: sequelize v6.x, Node.js crypto, stream, zlib modules
 * Downstream: All models requiring audit trails, compliance systems, security monitoring, HIPAA reporting
 * Dependencies: Sequelize v6.x, Node 18+, TypeScript 5.x, PostgreSQL 14+ or Oracle 19c+
 * Exports: 44 audit utilities for trail creation, fine-grained auditing, policy management, encryption, rotation, compliance, archival, and change tracking
 *
 * LLM Context: Production-grade Oracle Audit Vault-style auditing system for White Cross healthcare platform.
 * Provides comprehensive audit trail creation, fine-grained auditing with column-level tracking, audit policy
 * management, event filtering, data encryption at rest, log rotation with compression, compliance reporting
 * for HIPAA/GDPR/SOC2, audit data archival with retention policies, query utilities for forensics, change
 * tracking with versioning, user action tracking, and real-time alerting. Designed for healthcare PHI
 * protection with tamper-proof audit logs and complete accountability chain.
 */
import { Model, ModelStatic, Sequelize, ModelOptions, WhereOptions, Transaction } from 'sequelize';
/**
 * Audit trail entry structure
 */
export interface AuditTrailEntry {
    id?: string;
    tableName: string;
    recordId: string;
    operation: 'INSERT' | 'UPDATE' | 'DELETE' | 'SELECT';
    userId?: string;
    userName?: string;
    timestamp: Date;
    oldValues?: Record<string, any>;
    newValues?: Record<string, any>;
    changedFields?: string[];
    ipAddress?: string;
    userAgent?: string;
    sessionId?: string;
    transactionId?: string;
    applicationContext?: Record<string, any>;
    dataHash?: string;
    signature?: string;
}
/**
 * Fine-grained audit configuration
 */
export interface FineGrainedAuditConfig {
    tableName: string;
    columns?: string[];
    operations?: Array<'INSERT' | 'UPDATE' | 'DELETE' | 'SELECT'>;
    condition?: WhereOptions;
    captureOldValues?: boolean;
    captureNewValues?: boolean;
    auditSelect?: boolean;
    enabled?: boolean;
    priority?: number;
}
/**
 * Audit policy configuration
 */
export interface AuditPolicyConfig {
    name: string;
    description?: string;
    enabled: boolean;
    tables: string[];
    operations: Array<'INSERT' | 'UPDATE' | 'DELETE' | 'SELECT'>;
    columns?: Record<string, string[]>;
    users?: string[];
    excludeUsers?: string[];
    scheduleStart?: Date;
    scheduleEnd?: Date;
    condition?: string;
    captureQuery?: boolean;
    captureBindVariables?: boolean;
    auditLevel?: 'STATEMENT' | 'ROW' | 'COLUMN';
}
/**
 * Audit event filter configuration
 */
export interface AuditEventFilter {
    name: string;
    tableName?: string;
    operation?: 'INSERT' | 'UPDATE' | 'DELETE' | 'SELECT';
    userId?: string;
    startDate?: Date;
    endDate?: Date;
    changedField?: string;
    minimumChanges?: number;
    ipAddressPattern?: string;
    excludeSystem?: boolean;
}
/**
 * Audit encryption configuration
 */
export interface AuditEncryptionConfig {
    algorithm: 'aes-256-gcm' | 'aes-256-cbc' | 'chacha20-poly1305';
    keyDerivation: 'pbkdf2' | 'scrypt';
    encryptedFields: string[];
    keyRotationDays?: number;
    compressionEnabled?: boolean;
}
/**
 * Audit log rotation configuration
 */
export interface AuditLogRotationConfig {
    maxSizeBytes?: number;
    maxAgeDays?: number;
    maxFiles?: number;
    compressionEnabled?: boolean;
    archiveDirectory?: string;
    deleteAfterArchive?: boolean;
    partitionBy?: 'day' | 'week' | 'month' | 'year';
}
/**
 * Compliance report configuration
 */
export interface ComplianceReportConfig {
    reportType: 'HIPAA' | 'GDPR' | 'SOC2' | 'PCI-DSS' | 'CUSTOM';
    startDate: Date;
    endDate: Date;
    includeUsers?: string[];
    excludeUsers?: string[];
    includeTables?: string[];
    operations?: Array<'INSERT' | 'UPDATE' | 'DELETE' | 'SELECT'>;
    groupBy?: 'user' | 'table' | 'operation' | 'date';
    format?: 'json' | 'csv' | 'pdf' | 'html';
}
/**
 * Audit archival configuration
 */
export interface AuditArchivalConfig {
    retentionDays: number;
    archiveTableSuffix?: string;
    compressionEnabled?: boolean;
    encryptionEnabled?: boolean;
    verifyIntegrity?: boolean;
    deleteAfterArchive?: boolean;
    batchSize?: number;
}
/**
 * Audit query options
 */
export interface AuditQueryOptions {
    tableName?: string;
    recordId?: string;
    userId?: string;
    operation?: string;
    startDate?: Date;
    endDate?: Date;
    changedFields?: string[];
    limit?: number;
    offset?: number;
    orderBy?: string;
    orderDirection?: 'ASC' | 'DESC';
    includeSystemUsers?: boolean;
}
/**
 * Change tracking configuration
 */
export interface ChangeTrackingConfig {
    tableName: string;
    trackingFields: string[];
    versionField?: string;
    userField?: string;
    timestampField?: string;
    createHistoryTable?: boolean;
    captureContext?: boolean;
}
/**
 * User action tracking entry
 */
export interface UserActionEntry {
    userId: string;
    userName?: string;
    action: string;
    resource: string;
    resourceId?: string;
    timestamp: Date;
    success: boolean;
    errorMessage?: string;
    duration?: number;
    ipAddress?: string;
    metadata?: Record<string, any>;
}
/**
 * Audit alert configuration
 */
export interface AuditAlertConfig {
    name: string;
    enabled: boolean;
    condition: string;
    threshold?: number;
    windowMinutes?: number;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    notificationChannels: string[];
    throttleMinutes?: number;
    metadata?: Record<string, any>;
}
/**
 * Audit statistics
 */
export interface AuditStatistics {
    totalEntries: number;
    entriesByOperation: Record<string, number>;
    entriesByUser: Record<string, number>;
    entriesByTable: Record<string, number>;
    oldestEntry?: Date;
    newestEntry?: Date;
    averageEntriesPerDay: number;
    storageUsedBytes: number;
}
/**
 * Creates a comprehensive audit trail entry with full context.
 * Captures operation details, user information, and data changes.
 *
 * @param {ModelStatic<any>} auditModel - Audit model to store entry
 * @param {AuditTrailEntry} entry - Audit trail entry data
 * @param {Transaction} transaction - Optional transaction context
 * @returns {Promise<Model>} Created audit entry
 *
 * @example
 * ```typescript
 * const auditEntry = await createAuditTrailEntry(AuditLog, {
 *   tableName: 'patients',
 *   recordId: patient.id,
 *   operation: 'UPDATE',
 *   userId: currentUser.id,
 *   oldValues: { status: 'pending' },
 *   newValues: { status: 'active' },
 *   ipAddress: req.ip
 * }, transaction);
 * ```
 */
export declare function createAuditTrailEntry(auditModel: ModelStatic<any>, entry: AuditTrailEntry, transaction?: Transaction): Promise<Model>;
/**
 * Creates an audit model with comprehensive fields and configuration.
 * Provides standard audit trail table structure.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tableName - Audit table name
 * @param {Partial<ModelOptions>} options - Model options
 * @returns {ModelStatic<any>} Audit model
 *
 * @example
 * ```typescript
 * const AuditLog = createAuditModel(sequelize, 'audit_trails', {
 *   schema: 'audit',
 *   indexes: [
 *     { fields: ['tableName', 'recordId'] },
 *     { fields: ['userId'] },
 *     { fields: ['timestamp'] }
 *   ]
 * });
 * ```
 */
export declare function createAuditModel(sequelize: Sequelize, tableName?: string, options?: Partial<ModelOptions>): ModelStatic<any>;
/**
 * Adds automatic audit trail hooks to a model.
 * Intercepts INSERT, UPDATE, DELETE operations.
 *
 * @param {ModelStatic<any>} model - Model to add audit hooks to
 * @param {ModelStatic<any>} auditModel - Audit model for storing entries
 * @param {object} options - Hook configuration options
 * @returns {ModelStatic<any>} Model with audit hooks
 *
 * @example
 * ```typescript
 * addAuditHooks(Patient, AuditLog, {
 *   captureOldValues: true,
 *   captureNewValues: true,
 *   excludeFields: ['password', 'token']
 * });
 * ```
 */
export declare function addAuditHooks(model: ModelStatic<any>, auditModel: ModelStatic<any>, options?: {
    captureOldValues?: boolean;
    captureNewValues?: boolean;
    excludeFields?: string[];
    getUserContext?: () => any;
}): ModelStatic<any>;
/**
 * Bulk creates audit trail entries for performance.
 * Optimized for high-volume audit logging.
 *
 * @param {ModelStatic<any>} auditModel - Audit model
 * @param {AuditTrailEntry[]} entries - Batch of audit entries
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<Model[]>} Created audit entries
 *
 * @example
 * ```typescript
 * const entries = operations.map(op => ({
 *   tableName: 'orders',
 *   recordId: op.id,
 *   operation: 'UPDATE',
 *   userId: userId,
 *   timestamp: new Date()
 * }));
 * await bulkCreateAuditEntries(AuditLog, entries, transaction);
 * ```
 */
export declare function bulkCreateAuditEntries(auditModel: ModelStatic<any>, entries: AuditTrailEntry[], transaction?: Transaction): Promise<Model[]>;
/**
 * Verifies audit trail integrity by checking hashes and signatures.
 * Detects tampering or corruption in audit data.
 *
 * @param {ModelStatic<any>} auditModel - Audit model
 * @param {string[]} entryIds - Entry IDs to verify
 * @returns {Promise<{ valid: boolean; invalidIds: string[]; errors: string[] }>} Verification result
 *
 * @example
 * ```typescript
 * const result = await verifyAuditIntegrity(AuditLog, [
 *   'entry-id-1', 'entry-id-2', 'entry-id-3'
 * ]);
 * if (!result.valid) {
 *   console.error('Tampered entries:', result.invalidIds);
 * }
 * ```
 */
export declare function verifyAuditIntegrity(auditModel: ModelStatic<any>, entryIds?: string[]): Promise<{
    valid: boolean;
    invalidIds: string[];
    errors: string[];
}>;
/**
 * Creates an immutable audit chain with cryptographic linking.
 * Each entry references the previous entry's hash.
 *
 * @param {ModelStatic<any>} auditModel - Audit model
 * @param {string} tableName - Table to create chain for
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await createAuditChain(AuditLog, 'patients');
 * // Each audit entry now cryptographically links to the previous entry
 * ```
 */
export declare function createAuditChain(auditModel: ModelStatic<any>, tableName?: string): Promise<void>;
/**
 * Configures fine-grained auditing for specific columns.
 * Tracks access and changes to sensitive fields.
 *
 * @param {ModelStatic<any>} model - Model to configure
 * @param {ModelStatic<any>} auditModel - Audit model
 * @param {FineGrainedAuditConfig} config - Fine-grained audit configuration
 * @returns {ModelStatic<any>} Configured model
 *
 * @example
 * ```typescript
 * configureFineGrainedAudit(Patient, AuditLog, {
 *   tableName: 'patients',
 *   columns: ['ssn', 'medical_record_number', 'diagnosis'],
 *   operations: ['SELECT', 'UPDATE'],
 *   captureOldValues: true,
 *   auditSelect: true
 * });
 * ```
 */
export declare function configureFineGrainedAudit(model: ModelStatic<any>, auditModel: ModelStatic<any>, config: FineGrainedAuditConfig): ModelStatic<any>;
/**
 * Tracks column-level access patterns for security analysis.
 * Identifies unusual access to sensitive data.
 *
 * @param {ModelStatic<any>} auditModel - Audit model
 * @param {string} tableName - Table name
 * @param {string} columnName - Column name
 * @param {Date} startDate - Analysis start date
 * @param {Date} endDate - Analysis end date
 * @returns {Promise<{ userId: string; accessCount: number; lastAccess: Date }[]>} Access patterns
 *
 * @example
 * ```typescript
 * const patterns = await trackColumnAccess(AuditLog, 'patients', 'ssn',
 *   new Date('2024-01-01'), new Date('2024-01-31'));
 * console.log('SSN accessed by:', patterns);
 * ```
 */
export declare function trackColumnAccess(auditModel: ModelStatic<any>, tableName: string, columnName: string, startDate: Date, endDate: Date): Promise<Array<{
    userId: string;
    accessCount: number;
    lastAccess: Date;
}>>;
/**
 * Creates column-level audit policies with conditions.
 * Defines which columns to audit under specific conditions.
 *
 * @param {ModelStatic<any>} model - Model to configure
 * @param {string} columnName - Column to audit
 * @param {WhereOptions} condition - Audit condition
 * @param {ModelStatic<any>} auditModel - Audit model
 * @returns {ModelStatic<any>} Configured model
 *
 * @example
 * ```typescript
 * createColumnAuditPolicy(Patient, 'diagnosis', {
 *   severity: { [Op.in]: ['critical', 'high'] }
 * }, AuditLog);
 * ```
 */
export declare function createColumnAuditPolicy(model: ModelStatic<any>, columnName: string, condition: WhereOptions, auditModel: ModelStatic<any>): ModelStatic<any>;
/**
 * Audits data export and bulk read operations.
 * Tracks large-scale data access for compliance.
 *
 * @param {ModelStatic<any>} model - Model being queried
 * @param {ModelStatic<any>} auditModel - Audit model
 * @param {number} threshold - Minimum records to trigger audit
 * @returns {ModelStatic<any>} Model with export auditing
 *
 * @example
 * ```typescript
 * auditDataExport(Patient, AuditLog, 100);
 * // Any query returning 100+ records will be audited
 * ```
 */
export declare function auditDataExport(model: ModelStatic<any>, auditModel: ModelStatic<any>, threshold?: number): ModelStatic<any>;
/**
 * Implements field masking with audit trail.
 * Masks sensitive data while logging access.
 *
 * @param {ModelStatic<any>} model - Model to configure
 * @param {string} fieldName - Field to mask
 * @param {Function} maskFn - Masking function
 * @param {ModelStatic<any>} auditModel - Audit model
 * @returns {ModelStatic<any>} Model with masked field
 *
 * @example
 * ```typescript
 * implementFieldMasking(Patient, 'ssn',
 *   (value: string) => `***-**-${value.slice(-4)}`,
 *   AuditLog
 * );
 * ```
 */
export declare function implementFieldMasking(model: ModelStatic<any>, fieldName: string, maskFn: (value: any) => any, auditModel: ModelStatic<any>): ModelStatic<any>;
/**
 * Creates and stores an audit policy configuration.
 * Central management of audit rules.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {AuditPolicyConfig} policy - Policy configuration
 * @returns {Promise<Model>} Created policy record
 *
 * @example
 * ```typescript
 * const policy = await createAuditPolicy(sequelize, {
 *   name: 'PHI_ACCESS_POLICY',
 *   enabled: true,
 *   tables: ['patients', 'medical_records'],
 *   operations: ['SELECT', 'UPDATE', 'DELETE'],
 *   auditLevel: 'COLUMN',
 *   columns: {
 *     patients: ['ssn', 'diagnosis'],
 *     medical_records: ['notes', 'prescriptions']
 *   }
 * });
 * ```
 */
export declare function createAuditPolicy(sequelize: Sequelize, policy: AuditPolicyConfig): Promise<Model>;
/**
 * Creates the audit policy storage model.
 * Stores policy configurations in database.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<any>} Audit policy model
 *
 * @example
 * ```typescript
 * const AuditPolicy = createAuditPolicyModel(sequelize);
 * await AuditPolicy.sync();
 * ```
 */
export declare function createAuditPolicyModel(sequelize: Sequelize): ModelStatic<any>;
/**
 * Applies an audit policy to specified models.
 * Activates policy rules on target tables.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} policyName - Policy name to apply
 * @param {ModelStatic<any>} auditModel - Audit model
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await applyAuditPolicy(sequelize, 'PHI_ACCESS_POLICY', AuditLog);
 * ```
 */
export declare function applyAuditPolicy(sequelize: Sequelize, policyName: string, auditModel: ModelStatic<any>): Promise<void>;
/**
 * Updates an existing audit policy.
 * Modifies policy configuration and reapplies rules.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} policyName - Policy name
 * @param {Partial<AuditPolicyConfig>} updates - Policy updates
 * @returns {Promise<Model>} Updated policy
 *
 * @example
 * ```typescript
 * await updateAuditPolicy(sequelize, 'PHI_ACCESS_POLICY', {
 *   enabled: false,
 *   operations: ['UPDATE', 'DELETE']
 * });
 * ```
 */
export declare function updateAuditPolicy(sequelize: Sequelize, policyName: string, updates: Partial<AuditPolicyConfig>): Promise<Model>;
/**
 * Lists all active audit policies with statistics.
 * Provides overview of current audit configuration.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Array<{ name: string; enabled: boolean; tables: string[]; operations: string[] }>>} Policy list
 *
 * @example
 * ```typescript
 * const policies = await listAuditPolicies(sequelize);
 * console.log('Active policies:', policies);
 * ```
 */
export declare function listAuditPolicies(sequelize: Sequelize): Promise<Array<{
    name: string;
    enabled: boolean;
    tables: string[];
    operations: string[];
}>>;
/**
 * Filters audit entries based on complex criteria.
 * Advanced search across audit trail.
 *
 * @param {ModelStatic<any>} auditModel - Audit model
 * @param {AuditEventFilter} filter - Filter criteria
 * @returns {Promise<Model[]>} Filtered audit entries
 *
 * @example
 * ```typescript
 * const entries = await filterAuditEvents(AuditLog, {
 *   tableName: 'patients',
 *   operation: 'UPDATE',
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-01-31'),
 *   changedField: 'ssn'
 * });
 * ```
 */
export declare function filterAuditEvents(auditModel: ModelStatic<any>, filter: AuditEventFilter): Promise<Model[]>;
/**
 * Creates saved filter presets for common queries.
 * Quick access to frequently used audit searches.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} name - Filter preset name
 * @param {AuditEventFilter} filter - Filter configuration
 * @returns {Promise<Model>} Saved filter preset
 *
 * @example
 * ```typescript
 * await createFilterPreset(sequelize, 'PHI_MODIFICATIONS', {
 *   tableName: 'patients',
 *   operation: 'UPDATE',
 *   changedField: 'ssn'
 * });
 * ```
 */
export declare function createFilterPreset(sequelize: Sequelize, name: string, filter: AuditEventFilter): Promise<Model>;
/**
 * Creates model for storing filter presets.
 * Persistent storage for audit filter configurations.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<any>} Filter preset model
 *
 * @example
 * ```typescript
 * const FilterPreset = createFilterPresetModel(sequelize);
 * ```
 */
export declare function createFilterPresetModel(sequelize: Sequelize): ModelStatic<any>;
/**
 * Searches audit trail with full-text search.
 * Finds entries containing specific text in values.
 *
 * @param {ModelStatic<any>} auditModel - Audit model
 * @param {string} searchText - Text to search for
 * @param {string[]} fields - Fields to search in
 * @returns {Promise<Model[]>} Matching audit entries
 *
 * @example
 * ```typescript
 * const results = await searchAuditTrail(AuditLog, 'john@example.com',
 *   ['oldValues', 'newValues']);
 * ```
 */
export declare function searchAuditTrail(auditModel: ModelStatic<any>, searchText: string, fields?: string[]): Promise<Model[]>;
/**
 * Encrypts sensitive audit data at rest.
 * Protects audit trail from unauthorized access.
 *
 * @param {AuditEncryptionConfig} config - Encryption configuration
 * @returns {object} Encryption utilities
 *
 * @example
 * ```typescript
 * const encryption = configureAuditEncryption({
 *   algorithm: 'aes-256-gcm',
 *   keyDerivation: 'pbkdf2',
 *   encryptedFields: ['oldValues', 'newValues', 'applicationContext']
 * });
 * const encrypted = encryption.encrypt(data);
 * ```
 */
export declare function configureAuditEncryption(config: AuditEncryptionConfig): {
    encrypt: (data: any) => string;
    decrypt: (encrypted: string) => any;
    rotateKey: () => Buffer;
};
/**
 * Adds encryption hooks to audit model.
 * Automatically encrypts sensitive fields on write.
 *
 * @param {ModelStatic<any>} auditModel - Audit model
 * @param {AuditEncryptionConfig} config - Encryption configuration
 * @returns {ModelStatic<any>} Model with encryption hooks
 *
 * @example
 * ```typescript
 * addAuditEncryptionHooks(AuditLog, {
 *   algorithm: 'aes-256-gcm',
 *   keyDerivation: 'pbkdf2',
 *   encryptedFields: ['oldValues', 'newValues']
 * });
 * ```
 */
export declare function addAuditEncryptionHooks(auditModel: ModelStatic<any>, config: AuditEncryptionConfig): ModelStatic<any>;
/**
 * Re-encrypts audit data with new encryption key.
 * Supports key rotation for security compliance.
 *
 * @param {ModelStatic<any>} auditModel - Audit model
 * @param {Buffer} oldKey - Old encryption key
 * @param {Buffer} newKey - New encryption key
 * @param {string[]} fields - Fields to re-encrypt
 * @returns {Promise<number>} Number of records re-encrypted
 *
 * @example
 * ```typescript
 * const count = await reEncryptAuditData(AuditLog,
 *   oldKeyBuffer, newKeyBuffer,
 *   ['oldValues', 'newValues']
 * );
 * console.log(`Re-encrypted ${count} records`);
 * ```
 */
export declare function reEncryptAuditData(auditModel: ModelStatic<any>, oldKey: Buffer, newKey: Buffer, fields: string[]): Promise<number>;
/**
 * Validates encryption integrity for audit data.
 * Ensures all encrypted fields are properly encrypted.
 *
 * @param {ModelStatic<any>} auditModel - Audit model
 * @param {string[]} encryptedFields - Fields that should be encrypted
 * @returns {Promise<{ valid: boolean; errors: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const result = await validateAuditEncryption(AuditLog,
 *   ['oldValues', 'newValues']);
 * if (!result.valid) {
 *   console.error('Encryption issues:', result.errors);
 * }
 * ```
 */
export declare function validateAuditEncryption(auditModel: ModelStatic<any>, encryptedFields: string[]): Promise<{
    valid: boolean;
    errors: string[];
}>;
/**
 * Rotates audit logs based on size or age criteria.
 * Manages audit storage capacity.
 *
 * @param {ModelStatic<any>} auditModel - Audit model
 * @param {AuditLogRotationConfig} config - Rotation configuration
 * @returns {Promise<{ rotated: number; archived: number; deleted: number }>} Rotation results
 *
 * @example
 * ```typescript
 * const result = await rotateAuditLogs(AuditLog, {
 *   maxAgeDays: 90,
 *   compressionEnabled: true,
 *   archiveDirectory: '/var/audit/archive',
 *   partitionBy: 'month'
 * });
 * console.log(`Rotated ${result.rotated} entries`);
 * ```
 */
export declare function rotateAuditLogs(auditModel: ModelStatic<any>, config: AuditLogRotationConfig): Promise<{
    rotated: number;
    archived: number;
    deleted: number;
}>;
/**
 * Archives audit data to compressed files.
 * Exports audit entries for long-term storage.
 *
 * @param {Model[]} entries - Audit entries to archive
 * @param {string} directory - Archive directory path
 * @param {boolean} compress - Whether to compress archives
 * @returns {Promise<{ count: number; files: string[] }>} Archive result
 *
 * @example
 * ```typescript
 * const entries = await AuditLog.findAll({ where: { ... } });
 * const result = await archiveAuditDataToFile(entries,
 *   '/var/audit/archive', true);
 * ```
 */
export declare function archiveAuditDataToFile(entries: Model[], directory: string, compress?: boolean): Promise<{
    count: number;
    files: string[];
}>;
/**
 * Creates partitioned audit tables for time-based organization.
 * Improves query performance for time-range queries.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {ModelStatic<any>} auditModel - Base audit model
 * @param {string} partitionPeriod - Partition period (day, month, year)
 * @param {Date} date - Date for partition
 * @returns {Promise<string>} Partition table name
 *
 * @example
 * ```typescript
 * const tableName = await createAuditPartition(sequelize, AuditLog,
 *   'month', new Date('2024-01-15'));
 * // Creates: audit_trails_2024_01
 * ```
 */
export declare function createAuditPartition(sequelize: Sequelize, auditModel: ModelStatic<any>, partitionPeriod: 'day' | 'month' | 'year', date: Date): Promise<string>;
/**
 * Purges old audit data permanently.
 * Removes audit entries beyond retention period.
 *
 * @param {ModelStatic<any>} auditModel - Audit model
 * @param {number} retentionDays - Days to retain
 * @param {boolean} dryRun - If true, only report what would be deleted
 * @returns {Promise<number>} Number of entries purged
 *
 * @example
 * ```typescript
 * // Dry run first
 * const count = await purgeOldAuditData(AuditLog, 365, true);
 * console.log(`Would delete ${count} entries`);
 *
 * // Actually purge
 * await purgeOldAuditData(AuditLog, 365, false);
 * ```
 */
export declare function purgeOldAuditData(auditModel: ModelStatic<any>, retentionDays: number, dryRun?: boolean): Promise<number>;
/**
 * Generates comprehensive compliance report.
 * Produces audit summary for regulatory requirements.
 *
 * @param {ModelStatic<any>} auditModel - Audit model
 * @param {ComplianceReportConfig} config - Report configuration
 * @returns {Promise<object>} Compliance report data
 *
 * @example
 * ```typescript
 * const report = await generateComplianceReport(AuditLog, {
 *   reportType: 'HIPAA',
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-12-31'),
 *   includeTables: ['patients', 'medical_records'],
 *   groupBy: 'user'
 * });
 * ```
 */
export declare function generateComplianceReport(auditModel: ModelStatic<any>, config: ComplianceReportConfig): Promise<object>;
/**
 * Exports compliance report to various formats.
 * Generates formatted report files.
 *
 * @param {object} report - Report data
 * @param {string} format - Output format
 * @param {string} outputPath - Output file path
 * @returns {Promise<string>} Path to generated report
 *
 * @example
 * ```typescript
 * const report = await generateComplianceReport(AuditLog, config);
 * const path = await exportComplianceReport(report, 'pdf',
 *   '/reports/hipaa-2024.pdf');
 * ```
 */
export declare function exportComplianceReport(report: object, format: 'json' | 'csv' | 'pdf' | 'html', outputPath: string): Promise<string>;
/**
 * Archives old audit data to separate storage.
 * Moves historical audit entries to archive tables.
 *
 * @param {ModelStatic<any>} auditModel - Audit model
 * @param {AuditArchivalConfig} config - Archival configuration
 * @returns {Promise<{ archived: number; deleted: number }>} Archival result
 *
 * @example
 * ```typescript
 * const result = await archiveOldAuditData(AuditLog, {
 *   retentionDays: 180,
 *   archiveTableSuffix: '_archive',
 *   compressionEnabled: true,
 *   encryptionEnabled: true,
 *   deleteAfterArchive: true
 * });
 * ```
 */
export declare function archiveOldAuditData(auditModel: ModelStatic<any>, config: AuditArchivalConfig): Promise<{
    archived: number;
    deleted: number;
}>;
/**
 * Restores archived audit data back to main table.
 * Retrieves historical audit entries from archive.
 *
 * @param {ModelStatic<any>} auditModel - Audit model
 * @param {string} archiveTableName - Archive table name
 * @param {WhereOptions} filter - Restoration filter
 * @returns {Promise<number>} Number of entries restored
 *
 * @example
 * ```typescript
 * const count = await restoreArchivedAuditData(AuditLog,
 *   'audit_trails_archive', {
 *     tableName: 'patients',
 *     recordId: 'patient-123'
 *   });
 * ```
 */
export declare function restoreArchivedAuditData(auditModel: ModelStatic<any>, archiveTableName: string, filter: WhereOptions): Promise<number>;
/**
 * Compresses archived audit data for storage efficiency.
 * Reduces storage footprint of historical data.
 *
 * @param {string} archiveTableName - Archive table name
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<{ originalSize: number; compressedSize: number }>} Compression result
 *
 * @example
 * ```typescript
 * const result = await compressArchivedData('audit_trails_archive',
 *   sequelize);
 * console.log(`Saved ${result.originalSize - result.compressedSize} bytes`);
 * ```
 */
export declare function compressArchivedData(archiveTableName: string, sequelize: Sequelize): Promise<{
    originalSize: number;
    compressedSize: number;
}>;
/**
 * Manages audit data retention policies automatically.
 * Enforces data lifecycle management.
 *
 * @param {ModelStatic<any>} auditModel - Audit model
 * @param {AuditArchivalConfig[]} policies - Retention policies
 * @returns {Promise<{ policiesApplied: number; totalArchived: number }>} Result
 *
 * @example
 * ```typescript
 * await manageRetentionPolicies(AuditLog, [
 *   { retentionDays: 90, archiveTableSuffix: '_recent' },
 *   { retentionDays: 365, archiveTableSuffix: '_yearly' }
 * ]);
 * ```
 */
export declare function manageRetentionPolicies(auditModel: ModelStatic<any>, policies: AuditArchivalConfig[]): Promise<{
    policiesApplied: number;
    totalArchived: number;
}>;
/**
 * Queries audit trail with advanced filtering.
 * Flexible search across audit history.
 *
 * @param {ModelStatic<any>} auditModel - Audit model
 * @param {AuditQueryOptions} options - Query options
 * @returns {Promise<Model[]>} Audit entries
 *
 * @example
 * ```typescript
 * const entries = await queryAuditTrail(AuditLog, {
 *   tableName: 'patients',
 *   userId: 'user-123',
 *   startDate: new Date('2024-01-01'),
 *   operation: 'UPDATE',
 *   limit: 100
 * });
 * ```
 */
export declare function queryAuditTrail(auditModel: ModelStatic<any>, options: AuditQueryOptions): Promise<Model[]>;
/**
 * Retrieves complete history for a specific record.
 * Shows all changes to a record over time.
 *
 * @param {ModelStatic<any>} auditModel - Audit model
 * @param {string} tableName - Table name
 * @param {string} recordId - Record identifier
 * @returns {Promise<Model[]>} Record history
 *
 * @example
 * ```typescript
 * const history = await getRecordHistory(AuditLog, 'patients',
 *   'patient-123');
 * console.log('Patient was modified', history.length, 'times');
 * ```
 */
export declare function getRecordHistory(auditModel: ModelStatic<any>, tableName: string, recordId: string): Promise<Model[]>;
/**
 * Retrieves audit statistics for analysis.
 * Provides metrics about audit trail usage.
 *
 * @param {ModelStatic<any>} auditModel - Audit model
 * @param {Date} startDate - Start date for statistics
 * @param {Date} endDate - End date for statistics
 * @returns {Promise<AuditStatistics>} Audit statistics
 *
 * @example
 * ```typescript
 * const stats = await getAuditStatistics(AuditLog,
 *   new Date('2024-01-01'), new Date('2024-12-31'));
 * console.log('Total audit entries:', stats.totalEntries);
 * ```
 */
export declare function getAuditStatistics(auditModel: ModelStatic<any>, startDate?: Date, endDate?: Date): Promise<AuditStatistics>;
/**
 * Performs forensic analysis on audit trail.
 * Identifies suspicious patterns and anomalies.
 *
 * @param {ModelStatic<any>} auditModel - Audit model
 * @param {Date} startDate - Analysis start date
 * @param {Date} endDate - Analysis end date
 * @returns {Promise<{ anomalies: any[]; suspiciousUsers: string[] }>} Analysis result
 *
 * @example
 * ```typescript
 * const analysis = await performForensicAnalysis(AuditLog,
 *   new Date('2024-01-01'), new Date('2024-01-31'));
 * if (analysis.anomalies.length > 0) {
 *   console.warn('Suspicious activity detected:', analysis.anomalies);
 * }
 * ```
 */
export declare function performForensicAnalysis(auditModel: ModelStatic<any>, startDate: Date, endDate: Date): Promise<{
    anomalies: any[];
    suspiciousUsers: string[];
}>;
/**
 * Configures comprehensive change tracking for a model.
 * Tracks all modifications with version numbers.
 *
 * @param {ModelStatic<any>} model - Model to track
 * @param {ModelStatic<any>} auditModel - Audit model
 * @param {ChangeTrackingConfig} config - Tracking configuration
 * @returns {ModelStatic<any>} Model with change tracking
 *
 * @example
 * ```typescript
 * configureChangeTracking(Patient, AuditLog, {
 *   tableName: 'patients',
 *   trackingFields: ['diagnosis', 'treatment_plan', 'status'],
 *   versionField: 'version',
 *   createHistoryTable: true
 * });
 * ```
 */
export declare function configureChangeTracking(model: ModelStatic<any>, auditModel: ModelStatic<any>, config: ChangeTrackingConfig): ModelStatic<any>;
/**
 * Creates a version history table for a model.
 * Maintains complete version history separately.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {ModelStatic<any>} sourceModel - Source model
 * @param {string} historyTableName - History table name
 * @returns {ModelStatic<any>} Version history model
 *
 * @example
 * ```typescript
 * const PatientHistory = createVersionHistoryTable(sequelize, Patient,
 *   'patient_versions');
 * ```
 */
export declare function createVersionHistoryTable(sequelize: Sequelize, sourceModel: ModelStatic<any>, historyTableName?: string): ModelStatic<any>;
/**
 * Retrieves version history for a specific record.
 * Shows all historical versions with changes.
 *
 * @param {ModelStatic<any>} historyModel - Version history model
 * @param {string} recordId - Original record ID
 * @returns {Promise<Model[]>} Version history
 *
 * @example
 * ```typescript
 * const versions = await getVersionHistory(PatientHistory,
 *   'patient-123');
 * versions.forEach(v => console.log(`Version ${v.version} at ${v.validFrom}`));
 * ```
 */
export declare function getVersionHistory(historyModel: ModelStatic<any>, recordId: string): Promise<Model[]>;
/**
 * Compares two versions of a record.
 * Shows differences between specific versions.
 *
 * @param {ModelStatic<any>} historyModel - Version history model
 * @param {string} recordId - Record identifier
 * @param {number} version1 - First version number
 * @param {number} version2 - Second version number
 * @returns {Promise<{ added: Record<string, any>; removed: Record<string, any>; modified: Record<string, any> }>} Differences
 *
 * @example
 * ```typescript
 * const diff = await compareVersions(PatientHistory, 'patient-123', 1, 2);
 * console.log('Modified fields:', diff.modified);
 * ```
 */
export declare function compareVersions(historyModel: ModelStatic<any>, recordId: string, version1: number, version2: number): Promise<{
    added: Record<string, any>;
    removed: Record<string, any>;
    modified: Record<string, any>;
}>;
/**
 * Tracks user actions with detailed context.
 * Logs user operations beyond database changes.
 *
 * @param {ModelStatic<any>} actionModel - User action model
 * @param {UserActionEntry} action - Action details
 * @returns {Promise<Model>} Created action entry
 *
 * @example
 * ```typescript
 * await trackUserAction(UserActions, {
 *   userId: 'user-123',
 *   action: 'LOGIN',
 *   resource: 'authentication',
 *   success: true,
 *   timestamp: new Date(),
 *   ipAddress: '192.168.1.1'
 * });
 * ```
 */
export declare function trackUserAction(actionModel: ModelStatic<any>, action: UserActionEntry): Promise<Model>;
/**
 * Creates user action tracking model.
 * Stores non-database user actions.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<any>} User action model
 *
 * @example
 * ```typescript
 * const UserActions = createUserActionModel(sequelize);
 * await UserActions.sync();
 * ```
 */
export declare function createUserActionModel(sequelize: Sequelize): ModelStatic<any>;
/**
 * Retrieves user action history with filtering.
 * Queries user activity logs.
 *
 * @param {ModelStatic<any>} actionModel - User action model
 * @param {string} userId - User identifier
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<Model[]>} User actions
 *
 * @example
 * ```typescript
 * const actions = await getUserActionHistory(UserActions, 'user-123',
 *   new Date('2024-01-01'), new Date('2024-01-31'));
 * ```
 */
export declare function getUserActionHistory(actionModel: ModelStatic<any>, userId: string, startDate?: Date, endDate?: Date): Promise<Model[]>;
/**
 * Analyzes user behavior patterns for anomaly detection.
 * Identifies unusual user activity.
 *
 * @param {ModelStatic<any>} actionModel - User action model
 * @param {string} userId - User identifier
 * @param {number} days - Days to analyze
 * @returns {Promise<{ normalPattern: any; currentPattern: any; anomalies: string[] }>} Analysis result
 *
 * @example
 * ```typescript
 * const analysis = await analyzeUserBehavior(UserActions, 'user-123', 30);
 * if (analysis.anomalies.length > 0) {
 *   console.warn('Unusual behavior detected:', analysis.anomalies);
 * }
 * ```
 */
export declare function analyzeUserBehavior(actionModel: ModelStatic<any>, userId: string, days?: number): Promise<{
    normalPattern: any;
    currentPattern: any;
    anomalies: string[];
}>;
/**
 * Configures real-time audit alerts for suspicious activity.
 * Sets up automated monitoring and notifications.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {AuditAlertConfig} config - Alert configuration
 * @returns {Promise<Model>} Created alert configuration
 *
 * @example
 * ```typescript
 * await configureAuditAlert(sequelize, {
 *   name: 'PHI_BULK_ACCESS',
 *   enabled: true,
 *   condition: 'operation = "SELECT" AND record_count > 100',
 *   threshold: 5,
 *   windowMinutes: 60,
 *   severity: 'HIGH',
 *   notificationChannels: ['email', 'slack', 'pagerduty']
 * });
 * ```
 */
export declare function configureAuditAlert(sequelize: Sequelize, config: AuditAlertConfig): Promise<Model>;
/**
 * Creates audit alert configuration model.
 * Stores alert rules and settings.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<any>} Alert configuration model
 *
 * @example
 * ```typescript
 * const AlertConfig = createAuditAlertModel(sequelize);
 * ```
 */
export declare function createAuditAlertModel(sequelize: Sequelize): ModelStatic<any>;
/**
 * Evaluates audit alerts against recent activity.
 * Checks if alert conditions are met.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {ModelStatic<any>} auditModel - Audit model
 * @returns {Promise<Array<{ alert: string; triggered: boolean; details: any }>>} Alert evaluation results
 *
 * @example
 * ```typescript
 * const results = await evaluateAuditAlerts(sequelize, AuditLog);
 * results.forEach(r => {
 *   if (r.triggered) console.warn('Alert triggered:', r.alert);
 * });
 * ```
 */
export declare function evaluateAuditAlerts(sequelize: Sequelize, auditModel: ModelStatic<any>): Promise<Array<{
    alert: string;
    triggered: boolean;
    details: any;
}>>;
declare const _default: {
    createAuditTrailEntry: typeof createAuditTrailEntry;
    createAuditModel: typeof createAuditModel;
    addAuditHooks: typeof addAuditHooks;
    bulkCreateAuditEntries: typeof bulkCreateAuditEntries;
    verifyAuditIntegrity: typeof verifyAuditIntegrity;
    createAuditChain: typeof createAuditChain;
    configureFineGrainedAudit: typeof configureFineGrainedAudit;
    trackColumnAccess: typeof trackColumnAccess;
    createColumnAuditPolicy: typeof createColumnAuditPolicy;
    auditDataExport: typeof auditDataExport;
    implementFieldMasking: typeof implementFieldMasking;
    createAuditPolicy: typeof createAuditPolicy;
    createAuditPolicyModel: typeof createAuditPolicyModel;
    applyAuditPolicy: typeof applyAuditPolicy;
    updateAuditPolicy: typeof updateAuditPolicy;
    listAuditPolicies: typeof listAuditPolicies;
    filterAuditEvents: typeof filterAuditEvents;
    createFilterPreset: typeof createFilterPreset;
    createFilterPresetModel: typeof createFilterPresetModel;
    searchAuditTrail: typeof searchAuditTrail;
    configureAuditEncryption: typeof configureAuditEncryption;
    addAuditEncryptionHooks: typeof addAuditEncryptionHooks;
    reEncryptAuditData: typeof reEncryptAuditData;
    validateAuditEncryption: typeof validateAuditEncryption;
    rotateAuditLogs: typeof rotateAuditLogs;
    archiveAuditDataToFile: typeof archiveAuditDataToFile;
    createAuditPartition: typeof createAuditPartition;
    purgeOldAuditData: typeof purgeOldAuditData;
    generateComplianceReport: typeof generateComplianceReport;
    exportComplianceReport: typeof exportComplianceReport;
    archiveOldAuditData: typeof archiveOldAuditData;
    restoreArchivedAuditData: typeof restoreArchivedAuditData;
    compressArchivedData: typeof compressArchivedData;
    manageRetentionPolicies: typeof manageRetentionPolicies;
    queryAuditTrail: typeof queryAuditTrail;
    getRecordHistory: typeof getRecordHistory;
    getAuditStatistics: typeof getAuditStatistics;
    performForensicAnalysis: typeof performForensicAnalysis;
    configureChangeTracking: typeof configureChangeTracking;
    createVersionHistoryTable: typeof createVersionHistoryTable;
    getVersionHistory: typeof getVersionHistory;
    compareVersions: typeof compareVersions;
    trackUserAction: typeof trackUserAction;
    createUserActionModel: typeof createUserActionModel;
    getUserActionHistory: typeof getUserActionHistory;
    analyzeUserBehavior: typeof analyzeUserBehavior;
    configureAuditAlert: typeof configureAuditAlert;
    createAuditAlertModel: typeof createAuditAlertModel;
    evaluateAuditAlerts: typeof evaluateAuditAlerts;
};
export default _default;
//# sourceMappingURL=sequelize-oracle-auditing-advanced-kit.d.ts.map