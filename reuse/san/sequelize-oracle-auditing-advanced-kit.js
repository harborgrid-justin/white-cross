"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAuditTrailEntry = createAuditTrailEntry;
exports.createAuditModel = createAuditModel;
exports.addAuditHooks = addAuditHooks;
exports.bulkCreateAuditEntries = bulkCreateAuditEntries;
exports.verifyAuditIntegrity = verifyAuditIntegrity;
exports.createAuditChain = createAuditChain;
exports.configureFineGrainedAudit = configureFineGrainedAudit;
exports.trackColumnAccess = trackColumnAccess;
exports.createColumnAuditPolicy = createColumnAuditPolicy;
exports.auditDataExport = auditDataExport;
exports.implementFieldMasking = implementFieldMasking;
exports.createAuditPolicy = createAuditPolicy;
exports.createAuditPolicyModel = createAuditPolicyModel;
exports.applyAuditPolicy = applyAuditPolicy;
exports.updateAuditPolicy = updateAuditPolicy;
exports.listAuditPolicies = listAuditPolicies;
exports.filterAuditEvents = filterAuditEvents;
exports.createFilterPreset = createFilterPreset;
exports.createFilterPresetModel = createFilterPresetModel;
exports.searchAuditTrail = searchAuditTrail;
exports.configureAuditEncryption = configureAuditEncryption;
exports.addAuditEncryptionHooks = addAuditEncryptionHooks;
exports.reEncryptAuditData = reEncryptAuditData;
exports.validateAuditEncryption = validateAuditEncryption;
exports.rotateAuditLogs = rotateAuditLogs;
exports.archiveAuditDataToFile = archiveAuditDataToFile;
exports.createAuditPartition = createAuditPartition;
exports.purgeOldAuditData = purgeOldAuditData;
exports.generateComplianceReport = generateComplianceReport;
exports.exportComplianceReport = exportComplianceReport;
exports.archiveOldAuditData = archiveOldAuditData;
exports.restoreArchivedAuditData = restoreArchivedAuditData;
exports.compressArchivedData = compressArchivedData;
exports.manageRetentionPolicies = manageRetentionPolicies;
exports.queryAuditTrail = queryAuditTrail;
exports.getRecordHistory = getRecordHistory;
exports.getAuditStatistics = getAuditStatistics;
exports.performForensicAnalysis = performForensicAnalysis;
exports.configureChangeTracking = configureChangeTracking;
exports.createVersionHistoryTable = createVersionHistoryTable;
exports.getVersionHistory = getVersionHistory;
exports.compareVersions = compareVersions;
exports.trackUserAction = trackUserAction;
exports.createUserActionModel = createUserActionModel;
exports.getUserActionHistory = getUserActionHistory;
exports.analyzeUserBehavior = analyzeUserBehavior;
exports.configureAuditAlert = configureAuditAlert;
exports.createAuditAlertModel = createAuditAlertModel;
exports.evaluateAuditAlerts = evaluateAuditAlerts;
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
const sequelize_1 = require("sequelize");
const crypto_1 = require("crypto");
const fs_1 = require("fs");
const zlib_1 = require("zlib");
const path_1 = require("path");
// ============================================================================
// AUDIT TRAIL CREATION
// ============================================================================
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
async function createAuditTrailEntry(auditModel, entry, transaction) {
    // Generate data hash for integrity verification
    const dataToHash = JSON.stringify({
        tableName: entry.tableName,
        recordId: entry.recordId,
        operation: entry.operation,
        oldValues: entry.oldValues,
        newValues: entry.newValues,
        timestamp: entry.timestamp,
    });
    const dataHash = (0, crypto_1.createHash)('sha256').update(dataToHash).digest('hex');
    // Create HMAC signature if secret key is available
    let signature;
    if (process.env.AUDIT_SIGNING_KEY) {
        const hmac = (0, crypto_1.createHash)('sha512');
        hmac.update(dataToHash + process.env.AUDIT_SIGNING_KEY);
        signature = hmac.digest('hex');
    }
    return auditModel.create({
        ...entry,
        dataHash,
        signature,
        timestamp: entry.timestamp || new Date(),
    }, { transaction });
}
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
function createAuditModel(sequelize, tableName = 'audit_trails', options = {}) {
    const attributes = {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        tableName: {
            type: sequelize_1.DataTypes.STRING(128),
            allowNull: false,
            comment: 'Target table name',
        },
        recordId: {
            type: sequelize_1.DataTypes.STRING(128),
            allowNull: false,
            comment: 'Target record identifier',
        },
        operation: {
            type: sequelize_1.DataTypes.ENUM('INSERT', 'UPDATE', 'DELETE', 'SELECT'),
            allowNull: false,
            comment: 'Database operation type',
        },
        userId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            comment: 'User who performed the action',
        },
        userName: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: true,
            comment: 'User name for display',
        },
        timestamp: {
            type: sequelize_1.DataTypes.DATE(6),
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            comment: 'Operation timestamp with microseconds',
        },
        oldValues: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            comment: 'Previous values before change',
        },
        newValues: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            comment: 'New values after change',
        },
        changedFields: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            allowNull: true,
            comment: 'List of changed field names',
        },
        ipAddress: {
            type: sequelize_1.DataTypes.INET,
            allowNull: true,
            comment: 'Client IP address',
        },
        userAgent: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Client user agent string',
        },
        sessionId: {
            type: sequelize_1.DataTypes.STRING(128),
            allowNull: true,
            comment: 'Session identifier',
        },
        transactionId: {
            type: sequelize_1.DataTypes.STRING(128),
            allowNull: true,
            comment: 'Database transaction ID',
        },
        applicationContext: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            comment: 'Additional application context',
        },
        dataHash: {
            type: sequelize_1.DataTypes.STRING(64),
            allowNull: false,
            comment: 'SHA-256 hash of audit data',
        },
        signature: {
            type: sequelize_1.DataTypes.STRING(128),
            allowNull: true,
            comment: 'HMAC signature for tamper detection',
        },
    };
    class AuditModel extends sequelize_1.Model {
    }
    return AuditModel.init(attributes, {
        sequelize,
        tableName,
        timestamps: false,
        paranoid: false,
        indexes: [
            { fields: ['tableName', 'recordId'] },
            { fields: ['userId'] },
            { fields: ['timestamp'] },
            { fields: ['operation'] },
            { fields: ['sessionId'] },
            { fields: ['transactionId'] },
        ],
        ...options,
    });
}
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
function addAuditHooks(model, auditModel, options = {}) {
    const { captureOldValues = true, captureNewValues = true, excludeFields = [], getUserContext, } = options;
    // After create hook
    model.addHook('afterCreate', async (instance, opts) => {
        const userContext = getUserContext ? getUserContext() : {};
        const newValues = { ...instance.dataValues };
        // Remove excluded fields
        excludeFields.forEach(field => delete newValues[field]);
        await createAuditTrailEntry(auditModel, {
            tableName: model.tableName,
            recordId: instance.id,
            operation: 'INSERT',
            newValues: captureNewValues ? newValues : undefined,
            timestamp: new Date(),
            ...userContext,
            transactionId: opts.transaction?.id,
        }, opts.transaction);
    });
    // After update hook
    model.addHook('afterUpdate', async (instance, opts) => {
        const userContext = getUserContext ? getUserContext() : {};
        const changed = instance.changed();
        if (!changed || changed.length === 0)
            return;
        const oldValues = {};
        const newValues = {};
        changed.forEach((field) => {
            if (!excludeFields.includes(field)) {
                if (captureOldValues) {
                    oldValues[field] = instance._previousDataValues[field];
                }
                if (captureNewValues) {
                    newValues[field] = instance.dataValues[field];
                }
            }
        });
        await createAuditTrailEntry(auditModel, {
            tableName: model.tableName,
            recordId: instance.id,
            operation: 'UPDATE',
            oldValues: captureOldValues ? oldValues : undefined,
            newValues: captureNewValues ? newValues : undefined,
            changedFields: changed.filter(f => !excludeFields.includes(f)),
            timestamp: new Date(),
            ...userContext,
            transactionId: opts.transaction?.id,
        }, opts.transaction);
    });
    // After destroy hook
    model.addHook('afterDestroy', async (instance, opts) => {
        const userContext = getUserContext ? getUserContext() : {};
        const oldValues = { ...instance.dataValues };
        excludeFields.forEach(field => delete oldValues[field]);
        await createAuditTrailEntry(auditModel, {
            tableName: model.tableName,
            recordId: instance.id,
            operation: 'DELETE',
            oldValues: captureOldValues ? oldValues : undefined,
            timestamp: new Date(),
            ...userContext,
            transactionId: opts.transaction?.id,
        }, opts.transaction);
    });
    return model;
}
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
async function bulkCreateAuditEntries(auditModel, entries, transaction) {
    const processedEntries = entries.map(entry => {
        const dataToHash = JSON.stringify({
            tableName: entry.tableName,
            recordId: entry.recordId,
            operation: entry.operation,
            timestamp: entry.timestamp,
        });
        const dataHash = (0, crypto_1.createHash)('sha256').update(dataToHash).digest('hex');
        return {
            ...entry,
            dataHash,
            timestamp: entry.timestamp || new Date(),
        };
    });
    return auditModel.bulkCreate(processedEntries, {
        transaction,
        returning: true,
    });
}
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
async function verifyAuditIntegrity(auditModel, entryIds) {
    const where = entryIds ? { id: { [sequelize_1.Op.in]: entryIds } } : {};
    const entries = await auditModel.findAll({ where });
    const invalidIds = [];
    const errors = [];
    for (const entry of entries) {
        const dataToHash = JSON.stringify({
            tableName: entry.tableName,
            recordId: entry.recordId,
            operation: entry.operation,
            oldValues: entry.oldValues,
            newValues: entry.newValues,
            timestamp: entry.timestamp,
        });
        const computedHash = (0, crypto_1.createHash)('sha256').update(dataToHash).digest('hex');
        if (computedHash !== entry.dataHash) {
            invalidIds.push(entry.id);
            errors.push(`Hash mismatch for entry ${entry.id}`);
        }
        // Verify signature if present
        if (entry.signature && process.env.AUDIT_SIGNING_KEY) {
            const hmac = (0, crypto_1.createHash)('sha512');
            hmac.update(dataToHash + process.env.AUDIT_SIGNING_KEY);
            const computedSignature = hmac.digest('hex');
            if (computedSignature !== entry.signature) {
                if (!invalidIds.includes(entry.id)) {
                    invalidIds.push(entry.id);
                }
                errors.push(`Signature mismatch for entry ${entry.id}`);
            }
        }
    }
    return {
        valid: invalidIds.length === 0,
        invalidIds,
        errors,
    };
}
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
async function createAuditChain(auditModel, tableName) {
    const where = tableName ? { tableName } : {};
    const entries = await auditModel.findAll({
        where,
        order: [['timestamp', 'ASC']],
    });
    let previousHash = '0000000000000000000000000000000000000000000000000000000000000000';
    for (const entry of entries) {
        const chainData = previousHash + entry.dataHash;
        const chainHash = (0, crypto_1.createHash)('sha256').update(chainData).digest('hex');
        await entry.update({
            applicationContext: {
                ...entry.applicationContext,
                previousHash,
                chainHash,
            },
        });
        previousHash = chainHash;
    }
}
// ============================================================================
// FINE-GRAINED AUDITING
// ============================================================================
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
function configureFineGrainedAudit(model, auditModel, config) {
    const { columns = [], operations = ['SELECT', 'UPDATE', 'DELETE'], captureOldValues = true, captureNewValues = true, auditSelect = false, } = config;
    // Add getter hooks for SELECT auditing
    if (auditSelect && operations.includes('SELECT')) {
        columns.forEach(column => {
            const attribute = model.rawAttributes[column];
            if (!attribute)
                return;
            const originalGet = attribute.get;
            attribute.get = function () {
                const value = originalGet ? originalGet.call(this) : this.getDataValue(column);
                // Log column access (async, non-blocking)
                setImmediate(() => {
                    createAuditTrailEntry(auditModel, {
                        tableName: config.tableName,
                        recordId: this.getDataValue('id'),
                        operation: 'SELECT',
                        changedFields: [column],
                        timestamp: new Date(),
                        applicationContext: { accessedColumn: column },
                    }).catch(err => console.error('Audit logging error:', err));
                });
                return value;
            };
        });
        model.refreshAttributes();
    }
    // Add update hooks for specific columns
    if (operations.includes('UPDATE')) {
        model.addHook('afterUpdate', async (instance, opts) => {
            const changed = instance.changed();
            const auditedChanges = changed.filter(f => columns.includes(f));
            if (auditedChanges.length === 0)
                return;
            const oldValues = {};
            const newValues = {};
            auditedChanges.forEach(field => {
                if (captureOldValues) {
                    oldValues[field] = instance._previousDataValues[field];
                }
                if (captureNewValues) {
                    newValues[field] = instance.dataValues[field];
                }
            });
            await createAuditTrailEntry(auditModel, {
                tableName: config.tableName,
                recordId: instance.id,
                operation: 'UPDATE',
                oldValues,
                newValues,
                changedFields: auditedChanges,
                timestamp: new Date(),
                applicationContext: { fineGrainedAudit: true },
            }, opts.transaction);
        });
    }
    return model;
}
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
async function trackColumnAccess(auditModel, tableName, columnName, startDate, endDate) {
    const results = await auditModel.findAll({
        attributes: [
            'userId',
            [(0, sequelize_1.fn)('COUNT', (0, sequelize_1.col)('id')), 'accessCount'],
            [(0, sequelize_1.fn)('MAX', (0, sequelize_1.col)('timestamp')), 'lastAccess'],
        ],
        where: {
            tableName,
            changedFields: { [sequelize_1.Op.contains]: [columnName] },
            timestamp: { [sequelize_1.Op.between]: [startDate, endDate] },
        },
        group: ['userId'],
        raw: true,
    });
    return results;
}
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
function createColumnAuditPolicy(model, columnName, condition, auditModel) {
    model.addHook('afterUpdate', async (instance, opts) => {
        const changed = instance.changed();
        if (!changed || !changed.includes(columnName))
            return;
        // Check if condition matches
        const matches = Object.entries(condition).every(([key, value]) => {
            const instanceValue = instance.getDataValue(key);
            if (typeof value === 'object' && value !== null && sequelize_1.Op.in in value) {
                return value[sequelize_1.Op.in].includes(instanceValue);
            }
            return instanceValue === value;
        });
        if (!matches)
            return;
        await createAuditTrailEntry(auditModel, {
            tableName: model.tableName,
            recordId: instance.id,
            operation: 'UPDATE',
            oldValues: { [columnName]: instance._previousDataValues[columnName] },
            newValues: { [columnName]: instance.dataValues[columnName] },
            changedFields: [columnName],
            timestamp: new Date(),
            applicationContext: { conditionalAudit: true, condition },
        }, opts.transaction);
    });
    return model;
}
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
function auditDataExport(model, auditModel, threshold = 100) {
    model.addHook('afterFind', async (instances, opts) => {
        if (!instances || !Array.isArray(instances))
            return;
        if (instances.length < threshold)
            return;
        await createAuditTrailEntry(auditModel, {
            tableName: model.tableName,
            recordId: 'BULK_EXPORT',
            operation: 'SELECT',
            timestamp: new Date(),
            applicationContext: {
                exportType: 'bulk',
                recordCount: instances.length,
                queryOptions: JSON.stringify(opts),
            },
        }, opts.transaction);
    });
    return model;
}
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
function implementFieldMasking(model, fieldName, maskFn, auditModel) {
    const attribute = model.rawAttributes[fieldName];
    if (!attribute)
        return model;
    const originalGet = attribute.get;
    attribute.get = function () {
        const value = originalGet ? originalGet.call(this) : this.getDataValue(fieldName);
        // Log masked field access
        setImmediate(() => {
            createAuditTrailEntry(auditModel, {
                tableName: model.tableName,
                recordId: this.getDataValue('id'),
                operation: 'SELECT',
                changedFields: [fieldName],
                timestamp: new Date(),
                applicationContext: { maskedField: true },
            }).catch(err => console.error('Audit logging error:', err));
        });
        return value ? maskFn(value) : value;
    };
    model.refreshAttributes();
    return model;
}
// ============================================================================
// AUDIT POLICY MANAGEMENT
// ============================================================================
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
async function createAuditPolicy(sequelize, policy) {
    const AuditPolicy = sequelize.models.AuditPolicy || createAuditPolicyModel(sequelize);
    return AuditPolicy.create({
        name: policy.name,
        description: policy.description,
        enabled: policy.enabled,
        configuration: policy,
        createdAt: new Date(),
    });
}
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
function createAuditPolicyModel(sequelize) {
    const attributes = {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            unique: true,
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        enabled: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        configuration: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
    };
    class AuditPolicyModel extends sequelize_1.Model {
    }
    return AuditPolicyModel.init(attributes, {
        sequelize,
        tableName: 'audit_policies',
        timestamps: true,
    });
}
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
async function applyAuditPolicy(sequelize, policyName, auditModel) {
    const AuditPolicy = sequelize.models.AuditPolicy;
    if (!AuditPolicy) {
        throw new Error('AuditPolicy model not found. Create it first with createAuditPolicyModel.');
    }
    const policy = await AuditPolicy.findOne({ where: { name: policyName, enabled: true } });
    if (!policy) {
        throw new Error(`Audit policy "${policyName}" not found or disabled`);
    }
    const config = policy.getDataValue('configuration');
    // Apply policy to each table
    for (const tableName of config.tables) {
        const model = sequelize.models[tableName];
        if (!model)
            continue;
        const columns = config.columns?.[tableName];
        if (config.auditLevel === 'COLUMN' && columns) {
            configureFineGrainedAudit(model, auditModel, {
                tableName,
                columns,
                operations: config.operations,
                captureOldValues: true,
                captureNewValues: true,
            });
        }
        else {
            addAuditHooks(model, auditModel, {
                captureOldValues: true,
                captureNewValues: true,
            });
        }
    }
}
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
async function updateAuditPolicy(sequelize, policyName, updates) {
    const AuditPolicy = sequelize.models.AuditPolicy;
    if (!AuditPolicy) {
        throw new Error('AuditPolicy model not found');
    }
    const policy = await AuditPolicy.findOne({ where: { name: policyName } });
    if (!policy) {
        throw new Error(`Audit policy "${policyName}" not found`);
    }
    const currentConfig = policy.getDataValue('configuration');
    const newConfig = { ...currentConfig, ...updates };
    await policy.update({
        configuration: newConfig,
        enabled: updates.enabled !== undefined ? updates.enabled : policy.getDataValue('enabled'),
    });
    return policy;
}
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
async function listAuditPolicies(sequelize) {
    const AuditPolicy = sequelize.models.AuditPolicy;
    if (!AuditPolicy) {
        return [];
    }
    const policies = await AuditPolicy.findAll();
    return policies.map(policy => {
        const config = policy.getDataValue('configuration');
        return {
            name: policy.getDataValue('name'),
            enabled: policy.getDataValue('enabled'),
            tables: config.tables,
            operations: config.operations,
        };
    });
}
// ============================================================================
// AUDIT EVENT FILTERING
// ============================================================================
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
async function filterAuditEvents(auditModel, filter) {
    const where = {};
    if (filter.tableName) {
        where.tableName = filter.tableName;
    }
    if (filter.operation) {
        where.operation = filter.operation;
    }
    if (filter.userId) {
        where.userId = filter.userId;
    }
    if (filter.startDate || filter.endDate) {
        where.timestamp = {};
        if (filter.startDate) {
            where.timestamp[sequelize_1.Op.gte] = filter.startDate;
        }
        if (filter.endDate) {
            where.timestamp[sequelize_1.Op.lte] = filter.endDate;
        }
    }
    if (filter.changedField) {
        where.changedFields = { [sequelize_1.Op.contains]: [filter.changedField] };
    }
    if (filter.ipAddressPattern) {
        where.ipAddress = { [sequelize_1.Op.like]: filter.ipAddressPattern };
    }
    if (filter.excludeSystem) {
        where.userId = { [sequelize_1.Op.ne]: null };
    }
    const entries = await auditModel.findAll({ where, order: [['timestamp', 'DESC']] });
    // Apply post-query filters
    if (filter.minimumChanges) {
        return entries.filter(entry => {
            const changedFields = entry.getDataValue('changedFields');
            return changedFields && changedFields.length >= filter.minimumChanges;
        });
    }
    return entries;
}
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
async function createFilterPreset(sequelize, name, filter) {
    const FilterPreset = sequelize.models.AuditFilterPreset || createFilterPresetModel(sequelize);
    return FilterPreset.create({
        name,
        filter,
        createdAt: new Date(),
    });
}
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
function createFilterPresetModel(sequelize) {
    const attributes = {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            unique: true,
        },
        filter: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
    };
    class FilterPresetModel extends sequelize_1.Model {
    }
    return FilterPresetModel.init(attributes, {
        sequelize,
        tableName: 'audit_filter_presets',
        timestamps: false,
    });
}
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
async function searchAuditTrail(auditModel, searchText, fields = ['oldValues', 'newValues']) {
    const orConditions = fields.map(field => ({
        [field]: {
            [sequelize_1.Op.contains]: sequelize.literal(`'${searchText}'`),
        },
    }));
    return auditModel.findAll({
        where: { [sequelize_1.Op.or]: orConditions },
        order: [['timestamp', 'DESC']],
    });
}
// ============================================================================
// AUDIT DATA ENCRYPTION
// ============================================================================
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
function configureAuditEncryption(config) {
    const { algorithm, keyDerivation, encryptedFields } = config;
    const getKey = () => {
        const masterKey = process.env.AUDIT_ENCRYPTION_KEY || 'default-insecure-key';
        const salt = process.env.AUDIT_ENCRYPTION_SALT || 'default-salt';
        if (keyDerivation === 'pbkdf2') {
            return (0, crypto_1.pbkdf2Sync)(masterKey, salt, 100000, 32, 'sha256');
        }
        else {
            // scrypt
            const crypto = require('crypto');
            return crypto.scryptSync(masterKey, salt, 32);
        }
    };
    const encrypt = (data) => {
        const key = getKey();
        const iv = (0, crypto_1.randomBytes)(16);
        const cipher = (0, crypto_1.createCipheriv)(algorithm, key, iv);
        let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
        encrypted += cipher.final('hex');
        const authTag = cipher.getAuthTag?.()?.toString('hex') || '';
        return `${iv.toString('hex')}:${authTag}:${encrypted}`;
    };
    const decrypt = (encrypted) => {
        const parts = encrypted.split(':');
        const iv = Buffer.from(parts[0], 'hex');
        const authTag = parts[1] ? Buffer.from(parts[1], 'hex') : undefined;
        const encryptedData = parts[2] || parts[1];
        const key = getKey();
        const decipher = (0, crypto_1.createDecipheriv)(algorithm, key, iv);
        if (authTag) {
            decipher.setAuthTag(authTag);
        }
        let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return JSON.parse(decrypted);
    };
    const rotateKey = () => {
        const newKey = (0, crypto_1.randomBytes)(32);
        console.log('New encryption key (store securely):', newKey.toString('hex'));
        return newKey;
    };
    return { encrypt, decrypt, rotateKey };
}
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
function addAuditEncryptionHooks(auditModel, config) {
    const { encrypt, decrypt } = configureAuditEncryption(config);
    auditModel.addHook('beforeCreate', (instance) => {
        config.encryptedFields.forEach(field => {
            const value = instance.getDataValue(field);
            if (value) {
                instance.setDataValue(field, encrypt(value));
            }
        });
    });
    auditModel.addHook('beforeUpdate', (instance) => {
        config.encryptedFields.forEach(field => {
            if (instance.changed(field)) {
                const value = instance.getDataValue(field);
                if (value) {
                    instance.setDataValue(field, encrypt(value));
                }
            }
        });
    });
    auditModel.addHook('afterFind', (instances) => {
        const processInstance = (instance) => {
            config.encryptedFields.forEach(field => {
                const value = instance.getDataValue(field);
                if (value && typeof value === 'string' && value.includes(':')) {
                    try {
                        instance.setDataValue(field, decrypt(value), { raw: true });
                    }
                    catch (err) {
                        console.error(`Failed to decrypt field ${field}:`, err);
                    }
                }
            });
        };
        if (Array.isArray(instances)) {
            instances.forEach(processInstance);
        }
        else if (instances) {
            processInstance(instances);
        }
    });
    return auditModel;
}
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
async function reEncryptAuditData(auditModel, oldKey, newKey, fields) {
    const batchSize = 100;
    let processed = 0;
    let offset = 0;
    while (true) {
        const entries = await auditModel.findAll({
            limit: batchSize,
            offset,
        });
        if (entries.length === 0)
            break;
        for (const entry of entries) {
            for (const field of fields) {
                const encrypted = entry.getDataValue(field);
                if (!encrypted)
                    continue;
                try {
                    // Decrypt with old key
                    const parts = encrypted.split(':');
                    const iv = Buffer.from(parts[0], 'hex');
                    const authTag = Buffer.from(parts[1], 'hex');
                    const encryptedData = parts[2];
                    const decipher = (0, crypto_1.createDecipheriv)('aes-256-gcm', oldKey, iv);
                    decipher.setAuthTag(authTag);
                    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
                    decrypted += decipher.final('utf8');
                    // Encrypt with new key
                    const newIv = (0, crypto_1.randomBytes)(16);
                    const cipher = (0, crypto_1.createCipheriv)('aes-256-gcm', newKey, newIv);
                    let newEncrypted = cipher.update(decrypted, 'utf8', 'hex');
                    newEncrypted += cipher.final('hex');
                    const newAuthTag = cipher.getAuthTag();
                    const reEncrypted = `${newIv.toString('hex')}:${newAuthTag.toString('hex')}:${newEncrypted}`;
                    await entry.update({ [field]: reEncrypted });
                    processed++;
                }
                catch (err) {
                    console.error(`Failed to re-encrypt entry ${entry.id}:`, err);
                }
            }
        }
        offset += batchSize;
    }
    return processed;
}
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
async function validateAuditEncryption(auditModel, encryptedFields) {
    const errors = [];
    const entries = await auditModel.findAll({ limit: 1000 });
    for (const entry of entries) {
        for (const field of encryptedFields) {
            const value = entry.getDataValue(field);
            if (value && typeof value !== 'string') {
                errors.push(`Entry ${entry.id}: Field ${field} is not encrypted (not a string)`);
            }
            if (value && typeof value === 'string' && !value.includes(':')) {
                errors.push(`Entry ${entry.id}: Field ${field} has invalid encryption format`);
            }
        }
    }
    return {
        valid: errors.length === 0,
        errors,
    };
}
// ============================================================================
// AUDIT LOG ROTATION
// ============================================================================
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
async function rotateAuditLogs(auditModel, config) {
    const { maxAgeDays, compressionEnabled = true, archiveDirectory, deleteAfterArchive = false, partitionBy = 'month', } = config;
    let rotated = 0;
    let archived = 0;
    let deleted = 0;
    if (maxAgeDays) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - maxAgeDays);
        const oldEntries = await auditModel.findAll({
            where: {
                timestamp: { [sequelize_1.Op.lt]: cutoffDate },
            },
        });
        if (oldEntries.length > 0) {
            if (archiveDirectory) {
                // Archive to files
                const archiveResult = await archiveAuditDataToFile(oldEntries, archiveDirectory, compressionEnabled);
                archived = archiveResult.count;
            }
            if (deleteAfterArchive || !archiveDirectory) {
                await auditModel.destroy({
                    where: {
                        timestamp: { [sequelize_1.Op.lt]: cutoffDate },
                    },
                });
                deleted = oldEntries.length;
            }
            rotated = oldEntries.length;
        }
    }
    return { rotated, archived, deleted };
}
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
async function archiveAuditDataToFile(entries, directory, compress = true) {
    const files = [];
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `audit-archive-${timestamp}.json${compress ? '.gz' : ''}`;
    const filepath = (0, path_1.join)(directory, filename);
    // Ensure directory exists
    await fs_1.promises.mkdir(directory, { recursive: true });
    const data = entries.map(entry => entry.toJSON());
    const jsonData = JSON.stringify(data, null, 2);
    if (compress) {
        const input = Buffer.from(jsonData, 'utf8');
        const compressed = await new Promise((resolve, reject) => {
            const gzip = (0, zlib_1.createGzip)();
            const chunks = [];
            gzip.on('data', chunk => chunks.push(chunk));
            gzip.on('end', () => resolve(Buffer.concat(chunks)));
            gzip.on('error', reject);
            gzip.write(input);
            gzip.end();
        });
        await fs_1.promises.writeFile(filepath, compressed);
    }
    else {
        await fs_1.promises.writeFile(filepath, jsonData, 'utf8');
    }
    files.push(filepath);
    return {
        count: entries.length,
        files,
    };
}
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
async function createAuditPartition(sequelize, auditModel, partitionPeriod, date) {
    const baseTableName = auditModel.tableName;
    let suffix;
    switch (partitionPeriod) {
        case 'day':
            suffix = date.toISOString().slice(0, 10).replace(/-/g, '_');
            break;
        case 'month':
            suffix = date.toISOString().slice(0, 7).replace(/-/g, '_');
            break;
        case 'year':
            suffix = date.getFullYear().toString();
            break;
    }
    const partitionTableName = `${baseTableName}_${suffix}`;
    // Create partition table (PostgreSQL-specific)
    await sequelize.query(`
    CREATE TABLE IF NOT EXISTS ${partitionTableName} (
      LIKE ${baseTableName} INCLUDING ALL
    );
  `);
    return partitionTableName;
}
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
async function purgeOldAuditData(auditModel, retentionDays, dryRun = false) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);
    const count = await auditModel.count({
        where: {
            timestamp: { [sequelize_1.Op.lt]: cutoffDate },
        },
    });
    if (!dryRun && count > 0) {
        await auditModel.destroy({
            where: {
                timestamp: { [sequelize_1.Op.lt]: cutoffDate },
            },
            force: true,
        });
    }
    return count;
}
// ============================================================================
// AUDIT COMPLIANCE REPORTING
// ============================================================================
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
async function generateComplianceReport(auditModel, config) {
    const where = {
        timestamp: {
            [sequelize_1.Op.between]: [config.startDate, config.endDate],
        },
    };
    if (config.includeUsers) {
        where.userId = { [sequelize_1.Op.in]: config.includeUsers };
    }
    if (config.excludeUsers) {
        where.userId = { [sequelize_1.Op.notIn]: config.excludeUsers };
    }
    if (config.includeTables) {
        where.tableName = { [sequelize_1.Op.in]: config.includeTables };
    }
    if (config.operations) {
        where.operation = { [sequelize_1.Op.in]: config.operations };
    }
    const entries = await auditModel.findAll({ where });
    const report = {
        reportType: config.reportType,
        period: {
            start: config.startDate,
            end: config.endDate,
        },
        summary: {
            totalEvents: entries.length,
            uniqueUsers: new Set(entries.map(e => e.userId).filter(Boolean)).size,
            uniqueTables: new Set(entries.map(e => e.tableName)).size,
        },
        details: {},
    };
    // Group data based on configuration
    if (config.groupBy === 'user') {
        report.details = groupByUser(entries);
    }
    else if (config.groupBy === 'table') {
        report.details = groupByTable(entries);
    }
    else if (config.groupBy === 'operation') {
        report.details = groupByOperation(entries);
    }
    else if (config.groupBy === 'date') {
        report.details = groupByDate(entries);
    }
    // Add compliance-specific sections
    if (config.reportType === 'HIPAA') {
        report.hipaaCompliance = generateHIPAASection(entries);
    }
    else if (config.reportType === 'GDPR') {
        report.gdprCompliance = generateGDPRSection(entries);
    }
    return report;
}
/**
 * Groups audit entries by user for analysis.
 * Internal helper for compliance reporting.
 */
function groupByUser(entries) {
    const grouped = {};
    entries.forEach(entry => {
        const userId = entry.getDataValue('userId') || 'anonymous';
        if (!grouped[userId]) {
            grouped[userId] = {
                totalActions: 0,
                operations: {},
                tables: new Set(),
            };
        }
        grouped[userId].totalActions++;
        const operation = entry.getDataValue('operation');
        grouped[userId].operations[operation] = (grouped[userId].operations[operation] || 0) + 1;
        grouped[userId].tables.add(entry.getDataValue('tableName'));
    });
    // Convert sets to arrays
    Object.values(grouped).forEach((g) => {
        g.tables = Array.from(g.tables);
    });
    return grouped;
}
/**
 * Groups audit entries by table.
 * Internal helper for compliance reporting.
 */
function groupByTable(entries) {
    const grouped = {};
    entries.forEach(entry => {
        const tableName = entry.getDataValue('tableName');
        if (!grouped[tableName]) {
            grouped[tableName] = {
                totalActions: 0,
                operations: {},
                uniqueUsers: new Set(),
            };
        }
        grouped[tableName].totalActions++;
        const operation = entry.getDataValue('operation');
        grouped[tableName].operations[operation] = (grouped[tableName].operations[operation] || 0) + 1;
        grouped[tableName].uniqueUsers.add(entry.getDataValue('userId'));
    });
    // Convert sets to arrays
    Object.values(grouped).forEach((g) => {
        g.uniqueUsers = Array.from(g.uniqueUsers);
    });
    return grouped;
}
/**
 * Groups audit entries by operation type.
 * Internal helper for compliance reporting.
 */
function groupByOperation(entries) {
    const grouped = {};
    entries.forEach(entry => {
        const operation = entry.getDataValue('operation');
        if (!grouped[operation]) {
            grouped[operation] = {
                count: 0,
                tables: {},
                users: new Set(),
            };
        }
        grouped[operation].count++;
        const tableName = entry.getDataValue('tableName');
        grouped[operation].tables[tableName] = (grouped[operation].tables[tableName] || 0) + 1;
        grouped[operation].users.add(entry.getDataValue('userId'));
    });
    Object.values(grouped).forEach((g) => {
        g.users = Array.from(g.users);
    });
    return grouped;
}
/**
 * Groups audit entries by date.
 * Internal helper for compliance reporting.
 */
function groupByDate(entries) {
    const grouped = {};
    entries.forEach(entry => {
        const date = entry.getDataValue('timestamp').toISOString().slice(0, 10);
        if (!grouped[date]) {
            grouped[date] = {
                count: 0,
                operations: {},
            };
        }
        grouped[date].count++;
        const operation = entry.getDataValue('operation');
        grouped[date].operations[operation] = (grouped[date].operations[operation] || 0) + 1;
    });
    return grouped;
}
/**
 * Generates HIPAA-specific compliance section.
 * Internal helper for HIPAA reporting.
 */
function generateHIPAASection(entries) {
    const phiAccess = entries.filter(e => {
        const tables = ['patients', 'medical_records', 'prescriptions'];
        return tables.includes(e.getDataValue('tableName'));
    });
    return {
        totalPHIAccess: phiAccess.length,
        unauthorizedAttempts: 0, // Would need additional logic
        accessByRole: {},
        emergencyAccess: phiAccess.filter(e => {
            const context = e.getDataValue('applicationContext');
            return context?.emergency === true;
        }).length,
    };
}
/**
 * Generates GDPR-specific compliance section.
 * Internal helper for GDPR reporting.
 */
function generateGDPRSection(entries) {
    const dataSubjectRequests = entries.filter(e => {
        const context = e.getDataValue('applicationContext');
        return context?.gdprRequest === true;
    });
    return {
        totalDataSubjectRequests: dataSubjectRequests.length,
        rightToAccess: dataSubjectRequests.filter(e => e.getDataValue('operation') === 'SELECT').length,
        rightToErasure: dataSubjectRequests.filter(e => e.getDataValue('operation') === 'DELETE').length,
        rightToRectification: dataSubjectRequests.filter(e => e.getDataValue('operation') === 'UPDATE').length,
    };
}
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
async function exportComplianceReport(report, format, outputPath) {
    if (format === 'json') {
        await fs_1.promises.writeFile(outputPath, JSON.stringify(report, null, 2), 'utf8');
    }
    else if (format === 'csv') {
        // Convert to CSV format
        const csv = convertReportToCSV(report);
        await fs_1.promises.writeFile(outputPath, csv, 'utf8');
    }
    else if (format === 'html') {
        const html = convertReportToHTML(report);
        await fs_1.promises.writeFile(outputPath, html, 'utf8');
    }
    else {
        throw new Error(`Format ${format} not yet implemented`);
    }
    return outputPath;
}
/**
 * Converts report to CSV format.
 * Internal helper for CSV export.
 */
function convertReportToCSV(report) {
    const lines = [];
    lines.push('Report Type,Start Date,End Date,Total Events');
    lines.push(`${report.reportType},${report.period.start},${report.period.end},${report.summary.totalEvents}`);
    lines.push('');
    // Add detailed sections
    if (report.details) {
        Object.entries(report.details).forEach(([key, value]) => {
            lines.push(`${key},${JSON.stringify(value)}`);
        });
    }
    return lines.join('\n');
}
/**
 * Converts report to HTML format.
 * Internal helper for HTML export.
 */
function convertReportToHTML(report) {
    return `
<!DOCTYPE html>
<html>
<head>
  <title>Compliance Report - ${report.reportType}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    h1 { color: #333; }
    table { border-collapse: collapse; width: 100%; margin-top: 20px; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background-color: #4CAF50; color: white; }
  </style>
</head>
<body>
  <h1>Compliance Report: ${report.reportType}</h1>
  <p><strong>Period:</strong> ${report.period.start} to ${report.period.end}</p>
  <p><strong>Total Events:</strong> ${report.summary.totalEvents}</p>
  <pre>${JSON.stringify(report, null, 2)}</pre>
</body>
</html>
  `.trim();
}
// ============================================================================
// AUDIT DATA ARCHIVAL
// ============================================================================
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
async function archiveOldAuditData(auditModel, config) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - config.retentionDays);
    const batchSize = config.batchSize || 1000;
    let archived = 0;
    let deleted = 0;
    const archiveTableName = `${auditModel.tableName}${config.archiveTableSuffix || '_archive'}`;
    // Ensure archive table exists
    await auditModel.sequelize.query(`
    CREATE TABLE IF NOT EXISTS ${archiveTableName} (
      LIKE ${auditModel.tableName} INCLUDING ALL
    );
  `);
    while (true) {
        const entries = await auditModel.findAll({
            where: {
                timestamp: { [sequelize_1.Op.lt]: cutoffDate },
            },
            limit: batchSize,
        });
        if (entries.length === 0)
            break;
        // Insert into archive table
        const values = entries.map(e => e.toJSON());
        await auditModel.sequelize.query(`INSERT INTO ${archiveTableName} SELECT * FROM ${auditModel.tableName} WHERE id IN (:ids)`, {
            replacements: { ids: entries.map(e => e.getDataValue('id')) },
        });
        archived += entries.length;
        // Verify integrity if requested
        if (config.verifyIntegrity) {
            const verification = await verifyAuditIntegrity(auditModel, entries.map(e => e.getDataValue('id')));
            if (!verification.valid) {
                throw new Error(`Integrity check failed: ${verification.errors.join(', ')}`);
            }
        }
        // Delete from main table if requested
        if (config.deleteAfterArchive) {
            await auditModel.destroy({
                where: {
                    id: { [sequelize_1.Op.in]: entries.map(e => e.getDataValue('id')) },
                },
                force: true,
            });
            deleted += entries.length;
        }
    }
    return { archived, deleted };
}
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
async function restoreArchivedAuditData(auditModel, archiveTableName, filter) {
    const whereClause = Object.entries(filter)
        .map(([key, value]) => `${key} = '${value}'`)
        .join(' AND ');
    const result = await auditModel.sequelize.query(`INSERT INTO ${auditModel.tableName}
     SELECT * FROM ${archiveTableName}
     WHERE ${whereClause}
     ON CONFLICT DO NOTHING`, { type: sequelize_1.QueryTypes.INSERT });
    return Array.isArray(result) ? result.length : 0;
}
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
async function compressArchivedData(archiveTableName, sequelize) {
    // Get table size before compression
    const beforeSize = await sequelize.query(`SELECT pg_total_relation_size('${archiveTableName}') as size`, { type: sequelize_1.QueryTypes.SELECT });
    // Apply PostgreSQL compression
    await sequelize.query(`ALTER TABLE ${archiveTableName} SET (toast_tuple_target = 128)`);
    await sequelize.query(`VACUUM FULL ${archiveTableName}`);
    // Get table size after compression
    const afterSize = await sequelize.query(`SELECT pg_total_relation_size('${archiveTableName}') as size`, { type: sequelize_1.QueryTypes.SELECT });
    return {
        originalSize: beforeSize[0].size,
        compressedSize: afterSize[0].size,
    };
}
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
async function manageRetentionPolicies(auditModel, policies) {
    let totalArchived = 0;
    let policiesApplied = 0;
    // Sort policies by retention days (shortest first)
    const sortedPolicies = [...policies].sort((a, b) => a.retentionDays - b.retentionDays);
    for (const policy of sortedPolicies) {
        const result = await archiveOldAuditData(auditModel, policy);
        totalArchived += result.archived;
        policiesApplied++;
    }
    return { policiesApplied, totalArchived };
}
// ============================================================================
// AUDIT QUERY UTILITIES
// ============================================================================
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
async function queryAuditTrail(auditModel, options) {
    const where = {};
    if (options.tableName)
        where.tableName = options.tableName;
    if (options.recordId)
        where.recordId = options.recordId;
    if (options.userId)
        where.userId = options.userId;
    if (options.operation)
        where.operation = options.operation;
    if (options.startDate || options.endDate) {
        where.timestamp = {};
        if (options.startDate)
            where.timestamp[sequelize_1.Op.gte] = options.startDate;
        if (options.endDate)
            where.timestamp[sequelize_1.Op.lte] = options.endDate;
    }
    if (options.changedFields) {
        where.changedFields = { [sequelize_1.Op.overlap]: options.changedFields };
    }
    if (!options.includeSystemUsers) {
        where.userId = { [sequelize_1.Op.ne]: null };
    }
    return auditModel.findAll({
        where,
        limit: options.limit || 100,
        offset: options.offset || 0,
        order: [[options.orderBy || 'timestamp', options.orderDirection || 'DESC']],
    });
}
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
async function getRecordHistory(auditModel, tableName, recordId) {
    return auditModel.findAll({
        where: { tableName, recordId },
        order: [['timestamp', 'ASC']],
    });
}
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
async function getAuditStatistics(auditModel, startDate, endDate) {
    const where = {};
    if (startDate || endDate) {
        where.timestamp = {};
        if (startDate)
            where.timestamp[sequelize_1.Op.gte] = startDate;
        if (endDate)
            where.timestamp[sequelize_1.Op.lte] = endDate;
    }
    const [totalEntries, operationStats, userStats, tableStats, dateRange] = await Promise.all([
        auditModel.count({ where }),
        auditModel.findAll({
            attributes: ['operation', [(0, sequelize_1.fn)('COUNT', (0, sequelize_1.col)('id')), 'count']],
            where,
            group: ['operation'],
            raw: true,
        }),
        auditModel.findAll({
            attributes: ['userId', [(0, sequelize_1.fn)('COUNT', (0, sequelize_1.col)('id')), 'count']],
            where,
            group: ['userId'],
            raw: true,
        }),
        auditModel.findAll({
            attributes: ['tableName', [(0, sequelize_1.fn)('COUNT', (0, sequelize_1.col)('id')), 'count']],
            where,
            group: ['tableName'],
            raw: true,
        }),
        auditModel.findAll({
            attributes: [
                [(0, sequelize_1.fn)('MIN', (0, sequelize_1.col)('timestamp')), 'oldest'],
                [(0, sequelize_1.fn)('MAX', (0, sequelize_1.col)('timestamp')), 'newest'],
            ],
            where,
            raw: true,
        }),
    ]);
    const entriesByOperation = {};
    operationStats.forEach((stat) => {
        entriesByOperation[stat.operation] = parseInt(stat.count);
    });
    const entriesByUser = {};
    userStats.forEach((stat) => {
        entriesByUser[stat.userId || 'anonymous'] = parseInt(stat.count);
    });
    const entriesByTable = {};
    tableStats.forEach((stat) => {
        entriesByTable[stat.tableName] = parseInt(stat.count);
    });
    const oldest = dateRange[0]?.oldest;
    const newest = dateRange[0]?.newest;
    const daysDiff = oldest && newest ?
        Math.ceil((newest.getTime() - oldest.getTime()) / (1000 * 60 * 60 * 24)) : 1;
    return {
        totalEntries,
        entriesByOperation,
        entriesByUser,
        entriesByTable,
        oldestEntry: oldest,
        newestEntry: newest,
        averageEntriesPerDay: totalEntries / daysDiff,
        storageUsedBytes: 0, // Would need database-specific query
    };
}
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
async function performForensicAnalysis(auditModel, startDate, endDate) {
    const entries = await auditModel.findAll({
        where: {
            timestamp: { [sequelize_1.Op.between]: [startDate, endDate] },
        },
    });
    const anomalies = [];
    const userActivity = {};
    // Analyze patterns
    entries.forEach(entry => {
        const userId = entry.getDataValue('userId') || 'anonymous';
        if (!userActivity[userId]) {
            userActivity[userId] = { count: 0, operations: [] };
        }
        userActivity[userId].count++;
        userActivity[userId].operations.push(entry.getDataValue('operation'));
        // Check for integrity issues
        if (!entry.getDataValue('dataHash')) {
            anomalies.push({
                type: 'MISSING_HASH',
                entryId: entry.getDataValue('id'),
                severity: 'HIGH',
            });
        }
        // Check for suspicious bulk operations
        if (entry.getDataValue('recordId') === 'BULK_EXPORT') {
            const context = entry.getDataValue('applicationContext');
            if (context?.recordCount > 1000) {
                anomalies.push({
                    type: 'LARGE_EXPORT',
                    userId,
                    recordCount: context.recordCount,
                    severity: 'MEDIUM',
                });
            }
        }
    });
    // Identify suspicious users (unusually high activity)
    const avgActivity = Object.values(userActivity).reduce((sum, u) => sum + u.count, 0) /
        Object.keys(userActivity).length;
    const suspiciousUsers = Object.entries(userActivity)
        .filter(([_, activity]) => activity.count > avgActivity * 3)
        .map(([userId, _]) => userId);
    return { anomalies, suspiciousUsers };
}
// ============================================================================
// CHANGE TRACKING AND VERSIONING
// ============================================================================
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
function configureChangeTracking(model, auditModel, config) {
    // Add version field if specified
    if (config.versionField && !model.rawAttributes[config.versionField]) {
        model.rawAttributes[config.versionField] = {
            type: sequelize_1.DataTypes.INTEGER,
            defaultValue: 1,
            allowNull: false,
        };
        model.refreshAttributes();
    }
    // Track changes
    model.addHook('beforeUpdate', (instance) => {
        const changed = instance.changed();
        const trackedChanges = changed.filter(f => config.trackingFields.includes(f));
        if (trackedChanges.length > 0 && config.versionField) {
            const currentVersion = instance.getDataValue(config.versionField) || 1;
            instance.setDataValue(config.versionField, currentVersion + 1);
        }
    });
    // Create audit entries for tracked changes
    addAuditHooks(model, auditModel, {
        captureOldValues: true,
        captureNewValues: true,
    });
    return model;
}
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
function createVersionHistoryTable(sequelize, sourceModel, historyTableName) {
    const attributes = { ...sourceModel.rawAttributes };
    // Add versioning fields
    const versionAttributes = {
        ...attributes,
        historyId: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        originalId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: sourceModel.tableName,
                key: 'id',
            },
        },
        version: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        validFrom: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        validTo: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        changedBy: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
        },
    };
    class VersionHistoryModel extends sequelize_1.Model {
    }
    return VersionHistoryModel.init(versionAttributes, {
        sequelize,
        tableName: historyTableName || `${sourceModel.tableName}_history`,
        timestamps: false,
    });
}
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
async function getVersionHistory(historyModel, recordId) {
    return historyModel.findAll({
        where: { originalId: recordId },
        order: [['version', 'ASC']],
    });
}
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
async function compareVersions(historyModel, recordId, version1, version2) {
    const [v1, v2] = await Promise.all([
        historyModel.findOne({ where: { originalId: recordId, version: version1 } }),
        historyModel.findOne({ where: { originalId: recordId, version: version2 } }),
    ]);
    if (!v1 || !v2) {
        throw new Error('Version not found');
    }
    const data1 = v1.toJSON();
    const data2 = v2.toJSON();
    const added = {};
    const removed = {};
    const modified = {};
    // Compare fields
    const allKeys = new Set([...Object.keys(data1), ...Object.keys(data2)]);
    allKeys.forEach(key => {
        if (['historyId', 'version', 'validFrom', 'validTo', 'changedBy'].includes(key))
            return;
        if (!(key in data1)) {
            added[key] = data2[key];
        }
        else if (!(key in data2)) {
            removed[key] = data1[key];
        }
        else if (JSON.stringify(data1[key]) !== JSON.stringify(data2[key])) {
            modified[key] = { from: data1[key], to: data2[key] };
        }
    });
    return { added, removed, modified };
}
// ============================================================================
// USER ACTION TRACKING
// ============================================================================
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
async function trackUserAction(actionModel, action) {
    return actionModel.create({
        ...action,
        timestamp: action.timestamp || new Date(),
    });
}
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
function createUserActionModel(sequelize) {
    const attributes = {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        userId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
        },
        userName: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: true,
        },
        action: {
            type: sequelize_1.DataTypes.STRING(128),
            allowNull: false,
        },
        resource: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
        },
        resourceId: {
            type: sequelize_1.DataTypes.STRING(128),
            allowNull: true,
        },
        timestamp: {
            type: sequelize_1.DataTypes.DATE(6),
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        success: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        errorMessage: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        duration: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            comment: 'Action duration in milliseconds',
        },
        ipAddress: {
            type: sequelize_1.DataTypes.INET,
            allowNull: true,
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
        },
    };
    class UserActionModel extends sequelize_1.Model {
    }
    return UserActionModel.init(attributes, {
        sequelize,
        tableName: 'user_actions',
        timestamps: false,
        indexes: [
            { fields: ['userId'] },
            { fields: ['action'] },
            { fields: ['timestamp'] },
            { fields: ['resource'] },
        ],
    });
}
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
async function getUserActionHistory(actionModel, userId, startDate, endDate) {
    const where = { userId };
    if (startDate || endDate) {
        where.timestamp = {};
        if (startDate)
            where.timestamp[sequelize_1.Op.gte] = startDate;
        if (endDate)
            where.timestamp[sequelize_1.Op.lte] = endDate;
    }
    return actionModel.findAll({
        where,
        order: [['timestamp', 'DESC']],
    });
}
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
async function analyzeUserBehavior(actionModel, userId, days = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    const actions = await actionModel.findAll({
        where: {
            userId,
            timestamp: { [sequelize_1.Op.gte]: cutoffDate },
        },
        order: [['timestamp', 'ASC']],
    });
    // Calculate normal patterns
    const hourCounts = {};
    const actionCounts = {};
    let totalActions = actions.length;
    actions.forEach(action => {
        const hour = action.getDataValue('timestamp').getHours();
        hourCounts[hour] = (hourCounts[hour] || 0) + 1;
        const actionType = action.getDataValue('action');
        actionCounts[actionType] = (actionCounts[actionType] || 0) + 1;
    });
    // Detect anomalies
    const anomalies = [];
    // Check for unusual time activity
    Object.entries(hourCounts).forEach(([hour, count]) => {
        const avgPerHour = totalActions / 24;
        if (count > avgPerHour * 3) {
            anomalies.push(`Unusual activity at hour ${hour}: ${count} actions`);
        }
    });
    // Check for failed actions spike
    const failedActions = actions.filter(a => !a.getDataValue('success'));
    if (failedActions.length > totalActions * 0.3) {
        anomalies.push(`High failure rate: ${failedActions.length}/${totalActions}`);
    }
    return {
        normalPattern: { hourCounts, actionCounts, avgPerDay: totalActions / days },
        currentPattern: { totalActions, failedActions: failedActions.length },
        anomalies,
    };
}
// ============================================================================
// AUDIT ALERT CONFIGURATION
// ============================================================================
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
async function configureAuditAlert(sequelize, config) {
    const AlertConfig = sequelize.models.AuditAlertConfig || createAuditAlertModel(sequelize);
    return AlertConfig.create({
        name: config.name,
        enabled: config.enabled,
        configuration: config,
        createdAt: new Date(),
    });
}
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
function createAuditAlertModel(sequelize) {
    const attributes = {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            unique: true,
        },
        enabled: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        configuration: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
        },
        lastTriggered: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        triggerCount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
    };
    class AuditAlertConfigModel extends sequelize_1.Model {
    }
    return AuditAlertConfigModel.init(attributes, {
        sequelize,
        tableName: 'audit_alert_configs',
        timestamps: false,
    });
}
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
async function evaluateAuditAlerts(sequelize, auditModel) {
    const AlertConfig = sequelize.models.AuditAlertConfig;
    if (!AlertConfig)
        return [];
    const alerts = await AlertConfig.findAll({ where: { enabled: true } });
    const results = [];
    for (const alert of alerts) {
        const config = alert.getDataValue('configuration');
        const windowStart = new Date();
        windowStart.setMinutes(windowStart.getMinutes() - (config.windowMinutes || 60));
        // Check throttle
        const lastTriggered = alert.getDataValue('lastTriggered');
        if (lastTriggered && config.throttleMinutes) {
            const minutesSinceLastTrigger = (Date.now() - lastTriggered.getTime()) / (1000 * 60);
            if (minutesSinceLastTrigger < config.throttleMinutes) {
                continue; // Skip this alert, still in throttle period
            }
        }
        // Evaluate condition (simplified - in production use proper SQL parsing)
        const recentEntries = await auditModel.findAll({
            where: {
                timestamp: { [sequelize_1.Op.gte]: windowStart },
            },
        });
        const matchingEntries = recentEntries.filter(entry => {
            // Simplified condition evaluation
            return true; // Would need proper condition parsing
        });
        const triggered = matchingEntries.length >= (config.threshold || 1);
        if (triggered) {
            await alert.update({
                lastTriggered: new Date(),
                triggerCount: alert.getDataValue('triggerCount') + 1,
            });
        }
        results.push({
            alert: config.name,
            triggered,
            details: {
                matchingEntries: matchingEntries.length,
                threshold: config.threshold,
                severity: config.severity,
            },
        });
    }
    return results;
}
// ============================================================================
// EXPORT DEFAULT
// ============================================================================
exports.default = {
    // Audit Trail Creation
    createAuditTrailEntry,
    createAuditModel,
    addAuditHooks,
    bulkCreateAuditEntries,
    verifyAuditIntegrity,
    createAuditChain,
    // Fine-Grained Auditing
    configureFineGrainedAudit,
    trackColumnAccess,
    createColumnAuditPolicy,
    auditDataExport,
    implementFieldMasking,
    // Audit Policy Management
    createAuditPolicy,
    createAuditPolicyModel,
    applyAuditPolicy,
    updateAuditPolicy,
    listAuditPolicies,
    // Audit Event Filtering
    filterAuditEvents,
    createFilterPreset,
    createFilterPresetModel,
    searchAuditTrail,
    // Audit Data Encryption
    configureAuditEncryption,
    addAuditEncryptionHooks,
    reEncryptAuditData,
    validateAuditEncryption,
    // Audit Log Rotation
    rotateAuditLogs,
    archiveAuditDataToFile,
    createAuditPartition,
    purgeOldAuditData,
    // Audit Compliance Reporting
    generateComplianceReport,
    exportComplianceReport,
    // Audit Data Archival
    archiveOldAuditData,
    restoreArchivedAuditData,
    compressArchivedData,
    manageRetentionPolicies,
    // Audit Query Utilities
    queryAuditTrail,
    getRecordHistory,
    getAuditStatistics,
    performForensicAnalysis,
    // Change Tracking and Versioning
    configureChangeTracking,
    createVersionHistoryTable,
    getVersionHistory,
    compareVersions,
    // User Action Tracking
    trackUserAction,
    createUserActionModel,
    getUserActionHistory,
    analyzeUserBehavior,
    // Audit Alert Configuration
    configureAuditAlert,
    createAuditAlertModel,
    evaluateAuditAlerts,
};
//# sourceMappingURL=sequelize-oracle-auditing-advanced-kit.js.map