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

import {
  Model,
  ModelStatic,
  Sequelize,
  DataTypes,
  ModelAttributes,
  ModelOptions,
  FindOptions,
  WhereOptions,
  Op,
  Transaction,
  QueryInterface,
  QueryTypes,
  literal,
  fn,
  col,
} from 'sequelize';
import { createHash, createCipheriv, createDecipheriv, randomBytes, pbkdf2Sync } from 'crypto';
import { createWriteStream, createReadStream, promises as fs } from 'fs';
import { createGzip, createGunzip } from 'zlib';
import { pipeline } from 'stream/promises';
import { join } from 'path';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

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
export async function createAuditTrailEntry(
  auditModel: ModelStatic<any>,
  entry: AuditTrailEntry,
  transaction?: Transaction,
): Promise<Model> {
  // Generate data hash for integrity verification
  const dataToHash = JSON.stringify({
    tableName: entry.tableName,
    recordId: entry.recordId,
    operation: entry.operation,
    oldValues: entry.oldValues,
    newValues: entry.newValues,
    timestamp: entry.timestamp,
  });

  const dataHash = createHash('sha256').update(dataToHash).digest('hex');

  // Create HMAC signature if secret key is available
  let signature: string | undefined;
  if (process.env.AUDIT_SIGNING_KEY) {
    const hmac = createHash('sha512');
    hmac.update(dataToHash + process.env.AUDIT_SIGNING_KEY);
    signature = hmac.digest('hex');
  }

  return auditModel.create(
    {
      ...entry,
      dataHash,
      signature,
      timestamp: entry.timestamp || new Date(),
    },
    { transaction },
  );
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
export function createAuditModel(
  sequelize: Sequelize,
  tableName: string = 'audit_trails',
  options: Partial<ModelOptions> = {},
): ModelStatic<any> {
  const attributes: ModelAttributes = {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    tableName: {
      type: DataTypes.STRING(128),
      allowNull: false,
      comment: 'Target table name',
    },
    recordId: {
      type: DataTypes.STRING(128),
      allowNull: false,
      comment: 'Target record identifier',
    },
    operation: {
      type: DataTypes.ENUM('INSERT', 'UPDATE', 'DELETE', 'SELECT'),
      allowNull: false,
      comment: 'Database operation type',
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'User who performed the action',
    },
    userName: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'User name for display',
    },
    timestamp: {
      type: DataTypes.DATE(6),
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: 'Operation timestamp with microseconds',
    },
    oldValues: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Previous values before change',
    },
    newValues: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'New values after change',
    },
    changedFields: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      comment: 'List of changed field names',
    },
    ipAddress: {
      type: DataTypes.INET,
      allowNull: true,
      comment: 'Client IP address',
    },
    userAgent: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Client user agent string',
    },
    sessionId: {
      type: DataTypes.STRING(128),
      allowNull: true,
      comment: 'Session identifier',
    },
    transactionId: {
      type: DataTypes.STRING(128),
      allowNull: true,
      comment: 'Database transaction ID',
    },
    applicationContext: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Additional application context',
    },
    dataHash: {
      type: DataTypes.STRING(64),
      allowNull: false,
      comment: 'SHA-256 hash of audit data',
    },
    signature: {
      type: DataTypes.STRING(128),
      allowNull: true,
      comment: 'HMAC signature for tamper detection',
    },
  };

  class AuditModel extends Model {}

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
export function addAuditHooks(
  model: ModelStatic<any>,
  auditModel: ModelStatic<any>,
  options: {
    captureOldValues?: boolean;
    captureNewValues?: boolean;
    excludeFields?: string[];
    getUserContext?: () => any;
  } = {},
): ModelStatic<any> {
  const {
    captureOldValues = true,
    captureNewValues = true,
    excludeFields = [],
    getUserContext,
  } = options;

  // After create hook
  model.addHook('afterCreate', async (instance: any, opts: any) => {
    const userContext = getUserContext ? getUserContext() : {};
    const newValues = { ...instance.dataValues };

    // Remove excluded fields
    excludeFields.forEach(field => delete newValues[field]);

    await createAuditTrailEntry(
      auditModel,
      {
        tableName: model.tableName as string,
        recordId: instance.id,
        operation: 'INSERT',
        newValues: captureNewValues ? newValues : undefined,
        timestamp: new Date(),
        ...userContext,
        transactionId: opts.transaction?.id,
      },
      opts.transaction,
    );
  });

  // After update hook
  model.addHook('afterUpdate', async (instance: any, opts: any) => {
    const userContext = getUserContext ? getUserContext() : {};
    const changed = instance.changed();

    if (!changed || changed.length === 0) return;

    const oldValues: any = {};
    const newValues: any = {};

    changed.forEach((field: string) => {
      if (!excludeFields.includes(field)) {
        if (captureOldValues) {
          oldValues[field] = instance._previousDataValues[field];
        }
        if (captureNewValues) {
          newValues[field] = instance.dataValues[field];
        }
      }
    });

    await createAuditTrailEntry(
      auditModel,
      {
        tableName: model.tableName as string,
        recordId: instance.id,
        operation: 'UPDATE',
        oldValues: captureOldValues ? oldValues : undefined,
        newValues: captureNewValues ? newValues : undefined,
        changedFields: changed.filter(f => !excludeFields.includes(f)),
        timestamp: new Date(),
        ...userContext,
        transactionId: opts.transaction?.id,
      },
      opts.transaction,
    );
  });

  // After destroy hook
  model.addHook('afterDestroy', async (instance: any, opts: any) => {
    const userContext = getUserContext ? getUserContext() : {};
    const oldValues = { ...instance.dataValues };

    excludeFields.forEach(field => delete oldValues[field]);

    await createAuditTrailEntry(
      auditModel,
      {
        tableName: model.tableName as string,
        recordId: instance.id,
        operation: 'DELETE',
        oldValues: captureOldValues ? oldValues : undefined,
        timestamp: new Date(),
        ...userContext,
        transactionId: opts.transaction?.id,
      },
      opts.transaction,
    );
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
export async function bulkCreateAuditEntries(
  auditModel: ModelStatic<any>,
  entries: AuditTrailEntry[],
  transaction?: Transaction,
): Promise<Model[]> {
  const processedEntries = entries.map(entry => {
    const dataToHash = JSON.stringify({
      tableName: entry.tableName,
      recordId: entry.recordId,
      operation: entry.operation,
      timestamp: entry.timestamp,
    });

    const dataHash = createHash('sha256').update(dataToHash).digest('hex');

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
export async function verifyAuditIntegrity(
  auditModel: ModelStatic<any>,
  entryIds?: string[],
): Promise<{ valid: boolean; invalidIds: string[]; errors: string[] }> {
  const where = entryIds ? { id: { [Op.in]: entryIds } } : {};
  const entries = await auditModel.findAll({ where });

  const invalidIds: string[] = [];
  const errors: string[] = [];

  for (const entry of entries) {
    const dataToHash = JSON.stringify({
      tableName: entry.tableName,
      recordId: entry.recordId,
      operation: entry.operation,
      oldValues: entry.oldValues,
      newValues: entry.newValues,
      timestamp: entry.timestamp,
    });

    const computedHash = createHash('sha256').update(dataToHash).digest('hex');

    if (computedHash !== entry.dataHash) {
      invalidIds.push(entry.id);
      errors.push(`Hash mismatch for entry ${entry.id}`);
    }

    // Verify signature if present
    if (entry.signature && process.env.AUDIT_SIGNING_KEY) {
      const hmac = createHash('sha512');
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
export async function createAuditChain(
  auditModel: ModelStatic<any>,
  tableName?: string,
): Promise<void> {
  const where = tableName ? { tableName } : {};
  const entries = await auditModel.findAll({
    where,
    order: [['timestamp', 'ASC']],
  });

  let previousHash = '0000000000000000000000000000000000000000000000000000000000000000';

  for (const entry of entries) {
    const chainData = previousHash + entry.dataHash;
    const chainHash = createHash('sha256').update(chainData).digest('hex');

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
export function configureFineGrainedAudit(
  model: ModelStatic<any>,
  auditModel: ModelStatic<any>,
  config: FineGrainedAuditConfig,
): ModelStatic<any> {
  const {
    columns = [],
    operations = ['SELECT', 'UPDATE', 'DELETE'],
    captureOldValues = true,
    captureNewValues = true,
    auditSelect = false,
  } = config;

  // Add getter hooks for SELECT auditing
  if (auditSelect && operations.includes('SELECT')) {
    columns.forEach(column => {
      const attribute = model.rawAttributes[column];
      if (!attribute) return;

      const originalGet = attribute.get;

      attribute.get = function (this: Model) {
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
    model.addHook('afterUpdate', async (instance: any, opts: any) => {
      const changed = instance.changed();
      const auditedChanges = changed.filter(f => columns.includes(f));

      if (auditedChanges.length === 0) return;

      const oldValues: any = {};
      const newValues: any = {};

      auditedChanges.forEach(field => {
        if (captureOldValues) {
          oldValues[field] = instance._previousDataValues[field];
        }
        if (captureNewValues) {
          newValues[field] = instance.dataValues[field];
        }
      });

      await createAuditTrailEntry(
        auditModel,
        {
          tableName: config.tableName,
          recordId: instance.id,
          operation: 'UPDATE',
          oldValues,
          newValues,
          changedFields: auditedChanges,
          timestamp: new Date(),
          applicationContext: { fineGrainedAudit: true },
        },
        opts.transaction,
      );
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
export async function trackColumnAccess(
  auditModel: ModelStatic<any>,
  tableName: string,
  columnName: string,
  startDate: Date,
  endDate: Date,
): Promise<Array<{ userId: string; accessCount: number; lastAccess: Date }>> {
  const results = await auditModel.findAll({
    attributes: [
      'userId',
      [fn('COUNT', col('id')), 'accessCount'],
      [fn('MAX', col('timestamp')), 'lastAccess'],
    ],
    where: {
      tableName,
      changedFields: { [Op.contains]: [columnName] },
      timestamp: { [Op.between]: [startDate, endDate] },
    },
    group: ['userId'],
    raw: true,
  });

  return results as any[];
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
export function createColumnAuditPolicy(
  model: ModelStatic<any>,
  columnName: string,
  condition: WhereOptions,
  auditModel: ModelStatic<any>,
): ModelStatic<any> {
  model.addHook('afterUpdate', async (instance: any, opts: any) => {
    const changed = instance.changed();

    if (!changed || !changed.includes(columnName)) return;

    // Check if condition matches
    const matches = Object.entries(condition).every(([key, value]) => {
      const instanceValue = instance.getDataValue(key);
      if (typeof value === 'object' && value !== null && Op.in in value) {
        return (value as any)[Op.in].includes(instanceValue);
      }
      return instanceValue === value;
    });

    if (!matches) return;

    await createAuditTrailEntry(
      auditModel,
      {
        tableName: model.tableName as string,
        recordId: instance.id,
        operation: 'UPDATE',
        oldValues: { [columnName]: instance._previousDataValues[columnName] },
        newValues: { [columnName]: instance.dataValues[columnName] },
        changedFields: [columnName],
        timestamp: new Date(),
        applicationContext: { conditionalAudit: true, condition },
      },
      opts.transaction,
    );
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
export function auditDataExport(
  model: ModelStatic<any>,
  auditModel: ModelStatic<any>,
  threshold: number = 100,
): ModelStatic<any> {
  model.addHook('afterFind', async (instances: any, opts: any) => {
    if (!instances || !Array.isArray(instances)) return;
    if (instances.length < threshold) return;

    await createAuditTrailEntry(
      auditModel,
      {
        tableName: model.tableName as string,
        recordId: 'BULK_EXPORT',
        operation: 'SELECT',
        timestamp: new Date(),
        applicationContext: {
          exportType: 'bulk',
          recordCount: instances.length,
          queryOptions: JSON.stringify(opts),
        },
      },
      opts.transaction,
    );
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
export function implementFieldMasking(
  model: ModelStatic<any>,
  fieldName: string,
  maskFn: (value: any) => any,
  auditModel: ModelStatic<any>,
): ModelStatic<any> {
  const attribute = model.rawAttributes[fieldName];
  if (!attribute) return model;

  const originalGet = attribute.get;

  attribute.get = function (this: Model) {
    const value = originalGet ? originalGet.call(this) : this.getDataValue(fieldName);

    // Log masked field access
    setImmediate(() => {
      createAuditTrailEntry(auditModel, {
        tableName: model.tableName as string,
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
export async function createAuditPolicy(
  sequelize: Sequelize,
  policy: AuditPolicyConfig,
): Promise<Model> {
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
export function createAuditPolicyModel(sequelize: Sequelize): ModelStatic<any> {
  const attributes: ModelAttributes = {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    configuration: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  };

  class AuditPolicyModel extends Model {}

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
export async function applyAuditPolicy(
  sequelize: Sequelize,
  policyName: string,
  auditModel: ModelStatic<any>,
): Promise<void> {
  const AuditPolicy = sequelize.models.AuditPolicy;
  if (!AuditPolicy) {
    throw new Error('AuditPolicy model not found. Create it first with createAuditPolicyModel.');
  }

  const policy = await AuditPolicy.findOne({ where: { name: policyName, enabled: true } });
  if (!policy) {
    throw new Error(`Audit policy "${policyName}" not found or disabled`);
  }

  const config: AuditPolicyConfig = policy.getDataValue('configuration');

  // Apply policy to each table
  for (const tableName of config.tables) {
    const model = sequelize.models[tableName];
    if (!model) continue;

    const columns = config.columns?.[tableName];

    if (config.auditLevel === 'COLUMN' && columns) {
      configureFineGrainedAudit(model, auditModel, {
        tableName,
        columns,
        operations: config.operations,
        captureOldValues: true,
        captureNewValues: true,
      });
    } else {
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
export async function updateAuditPolicy(
  sequelize: Sequelize,
  policyName: string,
  updates: Partial<AuditPolicyConfig>,
): Promise<Model> {
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
export async function listAuditPolicies(
  sequelize: Sequelize,
): Promise<Array<{ name: string; enabled: boolean; tables: string[]; operations: string[] }>> {
  const AuditPolicy = sequelize.models.AuditPolicy;
  if (!AuditPolicy) {
    return [];
  }

  const policies = await AuditPolicy.findAll();

  return policies.map(policy => {
    const config: AuditPolicyConfig = policy.getDataValue('configuration');
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
export async function filterAuditEvents(
  auditModel: ModelStatic<any>,
  filter: AuditEventFilter,
): Promise<Model[]> {
  const where: WhereOptions = {};

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
      where.timestamp[Op.gte] = filter.startDate;
    }
    if (filter.endDate) {
      where.timestamp[Op.lte] = filter.endDate;
    }
  }

  if (filter.changedField) {
    where.changedFields = { [Op.contains]: [filter.changedField] };
  }

  if (filter.ipAddressPattern) {
    where.ipAddress = { [Op.like]: filter.ipAddressPattern };
  }

  if (filter.excludeSystem) {
    where.userId = { [Op.ne]: null };
  }

  const entries = await auditModel.findAll({ where, order: [['timestamp', 'DESC']] });

  // Apply post-query filters
  if (filter.minimumChanges) {
    return entries.filter(entry => {
      const changedFields = entry.getDataValue('changedFields');
      return changedFields && changedFields.length >= filter.minimumChanges!;
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
export async function createFilterPreset(
  sequelize: Sequelize,
  name: string,
  filter: AuditEventFilter,
): Promise<Model> {
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
export function createFilterPresetModel(sequelize: Sequelize): ModelStatic<any> {
  const attributes: ModelAttributes = {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    filter: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  };

  class FilterPresetModel extends Model {}

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
export async function searchAuditTrail(
  auditModel: ModelStatic<any>,
  searchText: string,
  fields: string[] = ['oldValues', 'newValues'],
): Promise<Model[]> {
  const orConditions = fields.map(field => ({
    [field]: {
      [Op.contains]: sequelize.literal(`'${searchText}'`),
    },
  }));

  return auditModel.findAll({
    where: { [Op.or]: orConditions },
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
export function configureAuditEncryption(config: AuditEncryptionConfig): {
  encrypt: (data: any) => string;
  decrypt: (encrypted: string) => any;
  rotateKey: () => Buffer;
} {
  const { algorithm, keyDerivation, encryptedFields } = config;

  const getKey = (): Buffer => {
    const masterKey = process.env.AUDIT_ENCRYPTION_KEY || 'default-insecure-key';
    const salt = process.env.AUDIT_ENCRYPTION_SALT || 'default-salt';

    if (keyDerivation === 'pbkdf2') {
      return pbkdf2Sync(masterKey, salt, 100000, 32, 'sha256');
    } else {
      // scrypt
      const crypto = require('crypto');
      return crypto.scryptSync(masterKey, salt, 32);
    }
  };

  const encrypt = (data: any): string => {
    const key = getKey();
    const iv = randomBytes(16);
    const cipher = createCipheriv(algorithm, key, iv);

    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = (cipher as any).getAuthTag?.()?.toString('hex') || '';

    return `${iv.toString('hex')}:${authTag}:${encrypted}`;
  };

  const decrypt = (encrypted: string): any => {
    const parts = encrypted.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const authTag = parts[1] ? Buffer.from(parts[1], 'hex') : undefined;
    const encryptedData = parts[2] || parts[1];

    const key = getKey();
    const decipher = createDecipheriv(algorithm, key, iv);

    if (authTag) {
      (decipher as any).setAuthTag(authTag);
    }

    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return JSON.parse(decrypted);
  };

  const rotateKey = (): Buffer => {
    const newKey = randomBytes(32);
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
export function addAuditEncryptionHooks(
  auditModel: ModelStatic<any>,
  config: AuditEncryptionConfig,
): ModelStatic<any> {
  const { encrypt, decrypt } = configureAuditEncryption(config);

  auditModel.addHook('beforeCreate', (instance: any) => {
    config.encryptedFields.forEach(field => {
      const value = instance.getDataValue(field);
      if (value) {
        instance.setDataValue(field, encrypt(value));
      }
    });
  });

  auditModel.addHook('beforeUpdate', (instance: any) => {
    config.encryptedFields.forEach(field => {
      if (instance.changed(field)) {
        const value = instance.getDataValue(field);
        if (value) {
          instance.setDataValue(field, encrypt(value));
        }
      }
    });
  });

  auditModel.addHook('afterFind', (instances: any) => {
    const processInstance = (instance: any) => {
      config.encryptedFields.forEach(field => {
        const value = instance.getDataValue(field);
        if (value && typeof value === 'string' && value.includes(':')) {
          try {
            instance.setDataValue(field, decrypt(value), { raw: true });
          } catch (err) {
            console.error(`Failed to decrypt field ${field}:`, err);
          }
        }
      });
    };

    if (Array.isArray(instances)) {
      instances.forEach(processInstance);
    } else if (instances) {
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
export async function reEncryptAuditData(
  auditModel: ModelStatic<any>,
  oldKey: Buffer,
  newKey: Buffer,
  fields: string[],
): Promise<number> {
  const batchSize = 100;
  let processed = 0;
  let offset = 0;

  while (true) {
    const entries = await auditModel.findAll({
      limit: batchSize,
      offset,
    });

    if (entries.length === 0) break;

    for (const entry of entries) {
      for (const field of fields) {
        const encrypted = entry.getDataValue(field);
        if (!encrypted) continue;

        try {
          // Decrypt with old key
          const parts = encrypted.split(':');
          const iv = Buffer.from(parts[0], 'hex');
          const authTag = Buffer.from(parts[1], 'hex');
          const encryptedData = parts[2];

          const decipher = createDecipheriv('aes-256-gcm', oldKey, iv);
          decipher.setAuthTag(authTag);
          let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
          decrypted += decipher.final('utf8');

          // Encrypt with new key
          const newIv = randomBytes(16);
          const cipher = createCipheriv('aes-256-gcm', newKey, newIv);
          let newEncrypted = cipher.update(decrypted, 'utf8', 'hex');
          newEncrypted += cipher.final('hex');
          const newAuthTag = cipher.getAuthTag();

          const reEncrypted = `${newIv.toString('hex')}:${newAuthTag.toString('hex')}:${newEncrypted}`;
          await entry.update({ [field]: reEncrypted });

          processed++;
        } catch (err) {
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
export async function validateAuditEncryption(
  auditModel: ModelStatic<any>,
  encryptedFields: string[],
): Promise<{ valid: boolean; errors: string[] }> {
  const errors: string[] = [];
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
export async function rotateAuditLogs(
  auditModel: ModelStatic<any>,
  config: AuditLogRotationConfig,
): Promise<{ rotated: number; archived: number; deleted: number }> {
  const {
    maxAgeDays,
    compressionEnabled = true,
    archiveDirectory,
    deleteAfterArchive = false,
    partitionBy = 'month',
  } = config;

  let rotated = 0;
  let archived = 0;
  let deleted = 0;

  if (maxAgeDays) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - maxAgeDays);

    const oldEntries = await auditModel.findAll({
      where: {
        timestamp: { [Op.lt]: cutoffDate },
      },
    });

    if (oldEntries.length > 0) {
      if (archiveDirectory) {
        // Archive to files
        const archiveResult = await archiveAuditDataToFile(
          oldEntries,
          archiveDirectory,
          compressionEnabled,
        );
        archived = archiveResult.count;
      }

      if (deleteAfterArchive || !archiveDirectory) {
        await auditModel.destroy({
          where: {
            timestamp: { [Op.lt]: cutoffDate },
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
export async function archiveAuditDataToFile(
  entries: Model[],
  directory: string,
  compress: boolean = true,
): Promise<{ count: number; files: string[] }> {
  const files: string[] = [];
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `audit-archive-${timestamp}.json${compress ? '.gz' : ''}`;
  const filepath = join(directory, filename);

  // Ensure directory exists
  await fs.mkdir(directory, { recursive: true });

  const data = entries.map(entry => entry.toJSON());
  const jsonData = JSON.stringify(data, null, 2);

  if (compress) {
    const input = Buffer.from(jsonData, 'utf8');
    const compressed = await new Promise<Buffer>((resolve, reject) => {
      const gzip = createGzip();
      const chunks: Buffer[] = [];
      gzip.on('data', chunk => chunks.push(chunk));
      gzip.on('end', () => resolve(Buffer.concat(chunks)));
      gzip.on('error', reject);
      gzip.write(input);
      gzip.end();
    });
    await fs.writeFile(filepath, compressed);
  } else {
    await fs.writeFile(filepath, jsonData, 'utf8');
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
export async function createAuditPartition(
  sequelize: Sequelize,
  auditModel: ModelStatic<any>,
  partitionPeriod: 'day' | 'month' | 'year',
  date: Date,
): Promise<string> {
  const baseTableName = auditModel.tableName as string;
  let suffix: string;

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
export async function purgeOldAuditData(
  auditModel: ModelStatic<any>,
  retentionDays: number,
  dryRun: boolean = false,
): Promise<number> {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

  const count = await auditModel.count({
    where: {
      timestamp: { [Op.lt]: cutoffDate },
    },
  });

  if (!dryRun && count > 0) {
    await auditModel.destroy({
      where: {
        timestamp: { [Op.lt]: cutoffDate },
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
export async function generateComplianceReport(
  auditModel: ModelStatic<any>,
  config: ComplianceReportConfig,
): Promise<object> {
  const where: WhereOptions = {
    timestamp: {
      [Op.between]: [config.startDate, config.endDate],
    },
  };

  if (config.includeUsers) {
    where.userId = { [Op.in]: config.includeUsers };
  }

  if (config.excludeUsers) {
    where.userId = { [Op.notIn]: config.excludeUsers };
  }

  if (config.includeTables) {
    where.tableName = { [Op.in]: config.includeTables };
  }

  if (config.operations) {
    where.operation = { [Op.in]: config.operations };
  }

  const entries = await auditModel.findAll({ where });

  const report: any = {
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
  } else if (config.groupBy === 'table') {
    report.details = groupByTable(entries);
  } else if (config.groupBy === 'operation') {
    report.details = groupByOperation(entries);
  } else if (config.groupBy === 'date') {
    report.details = groupByDate(entries);
  }

  // Add compliance-specific sections
  if (config.reportType === 'HIPAA') {
    report.hipaaCompliance = generateHIPAASection(entries);
  } else if (config.reportType === 'GDPR') {
    report.gdprCompliance = generateGDPRSection(entries);
  }

  return report;
}

/**
 * Groups audit entries by user for analysis.
 * Internal helper for compliance reporting.
 */
function groupByUser(entries: Model[]): Record<string, any> {
  const grouped: Record<string, any> = {};

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
  Object.values(grouped).forEach((g: any) => {
    g.tables = Array.from(g.tables);
  });

  return grouped;
}

/**
 * Groups audit entries by table.
 * Internal helper for compliance reporting.
 */
function groupByTable(entries: Model[]): Record<string, any> {
  const grouped: Record<string, any> = {};

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
  Object.values(grouped).forEach((g: any) => {
    g.uniqueUsers = Array.from(g.uniqueUsers);
  });

  return grouped;
}

/**
 * Groups audit entries by operation type.
 * Internal helper for compliance reporting.
 */
function groupByOperation(entries: Model[]): Record<string, any> {
  const grouped: Record<string, any> = {};

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

  Object.values(grouped).forEach((g: any) => {
    g.users = Array.from(g.users);
  });

  return grouped;
}

/**
 * Groups audit entries by date.
 * Internal helper for compliance reporting.
 */
function groupByDate(entries: Model[]): Record<string, any> {
  const grouped: Record<string, any> = {};

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
function generateHIPAASection(entries: Model[]): object {
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
function generateGDPRSection(entries: Model[]): object {
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
export async function exportComplianceReport(
  report: object,
  format: 'json' | 'csv' | 'pdf' | 'html',
  outputPath: string,
): Promise<string> {
  if (format === 'json') {
    await fs.writeFile(outputPath, JSON.stringify(report, null, 2), 'utf8');
  } else if (format === 'csv') {
    // Convert to CSV format
    const csv = convertReportToCSV(report);
    await fs.writeFile(outputPath, csv, 'utf8');
  } else if (format === 'html') {
    const html = convertReportToHTML(report);
    await fs.writeFile(outputPath, html, 'utf8');
  } else {
    throw new Error(`Format ${format} not yet implemented`);
  }

  return outputPath;
}

/**
 * Converts report to CSV format.
 * Internal helper for CSV export.
 */
function convertReportToCSV(report: any): string {
  const lines: string[] = [];
  lines.push('Report Type,Start Date,End Date,Total Events');
  lines.push(`${report.reportType},${report.period.start},${report.period.end},${report.summary.totalEvents}`);
  lines.push('');

  // Add detailed sections
  if (report.details) {
    Object.entries(report.details).forEach(([key, value]: [string, any]) => {
      lines.push(`${key},${JSON.stringify(value)}`);
    });
  }

  return lines.join('\n');
}

/**
 * Converts report to HTML format.
 * Internal helper for HTML export.
 */
function convertReportToHTML(report: any): string {
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
export async function archiveOldAuditData(
  auditModel: ModelStatic<any>,
  config: AuditArchivalConfig,
): Promise<{ archived: number; deleted: number }> {
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
        timestamp: { [Op.lt]: cutoffDate },
      },
      limit: batchSize,
    });

    if (entries.length === 0) break;

    // Insert into archive table
    const values = entries.map(e => e.toJSON());
    await auditModel.sequelize.query(
      `INSERT INTO ${archiveTableName} SELECT * FROM ${auditModel.tableName} WHERE id IN (:ids)`,
      {
        replacements: { ids: entries.map(e => e.getDataValue('id')) },
      },
    );

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
          id: { [Op.in]: entries.map(e => e.getDataValue('id')) },
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
export async function restoreArchivedAuditData(
  auditModel: ModelStatic<any>,
  archiveTableName: string,
  filter: WhereOptions,
): Promise<number> {
  const whereClause = Object.entries(filter)
    .map(([key, value]) => `${key} = '${value}'`)
    .join(' AND ');

  const result = await auditModel.sequelize.query(
    `INSERT INTO ${auditModel.tableName}
     SELECT * FROM ${archiveTableName}
     WHERE ${whereClause}
     ON CONFLICT DO NOTHING`,
    { type: QueryTypes.INSERT },
  );

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
export async function compressArchivedData(
  archiveTableName: string,
  sequelize: Sequelize,
): Promise<{ originalSize: number; compressedSize: number }> {
  // Get table size before compression
  const beforeSize = await sequelize.query(
    `SELECT pg_total_relation_size('${archiveTableName}') as size`,
    { type: QueryTypes.SELECT },
  );

  // Apply PostgreSQL compression
  await sequelize.query(`ALTER TABLE ${archiveTableName} SET (toast_tuple_target = 128)`);
  await sequelize.query(`VACUUM FULL ${archiveTableName}`);

  // Get table size after compression
  const afterSize = await sequelize.query(
    `SELECT pg_total_relation_size('${archiveTableName}') as size`,
    { type: QueryTypes.SELECT },
  );

  return {
    originalSize: (beforeSize[0] as any).size,
    compressedSize: (afterSize[0] as any).size,
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
export async function manageRetentionPolicies(
  auditModel: ModelStatic<any>,
  policies: AuditArchivalConfig[],
): Promise<{ policiesApplied: number; totalArchived: number }> {
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
export async function queryAuditTrail(
  auditModel: ModelStatic<any>,
  options: AuditQueryOptions,
): Promise<Model[]> {
  const where: WhereOptions = {};

  if (options.tableName) where.tableName = options.tableName;
  if (options.recordId) where.recordId = options.recordId;
  if (options.userId) where.userId = options.userId;
  if (options.operation) where.operation = options.operation;

  if (options.startDate || options.endDate) {
    where.timestamp = {};
    if (options.startDate) where.timestamp[Op.gte] = options.startDate;
    if (options.endDate) where.timestamp[Op.lte] = options.endDate;
  }

  if (options.changedFields) {
    where.changedFields = { [Op.overlap]: options.changedFields };
  }

  if (!options.includeSystemUsers) {
    where.userId = { [Op.ne]: null };
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
export async function getRecordHistory(
  auditModel: ModelStatic<any>,
  tableName: string,
  recordId: string,
): Promise<Model[]> {
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
export async function getAuditStatistics(
  auditModel: ModelStatic<any>,
  startDate?: Date,
  endDate?: Date,
): Promise<AuditStatistics> {
  const where: WhereOptions = {};
  if (startDate || endDate) {
    where.timestamp = {};
    if (startDate) where.timestamp[Op.gte] = startDate;
    if (endDate) where.timestamp[Op.lte] = endDate;
  }

  const [totalEntries, operationStats, userStats, tableStats, dateRange] = await Promise.all([
    auditModel.count({ where }),
    auditModel.findAll({
      attributes: ['operation', [fn('COUNT', col('id')), 'count']],
      where,
      group: ['operation'],
      raw: true,
    }),
    auditModel.findAll({
      attributes: ['userId', [fn('COUNT', col('id')), 'count']],
      where,
      group: ['userId'],
      raw: true,
    }),
    auditModel.findAll({
      attributes: ['tableName', [fn('COUNT', col('id')), 'count']],
      where,
      group: ['tableName'],
      raw: true,
    }),
    auditModel.findAll({
      attributes: [
        [fn('MIN', col('timestamp')), 'oldest'],
        [fn('MAX', col('timestamp')), 'newest'],
      ],
      where,
      raw: true,
    }),
  ]);

  const entriesByOperation: Record<string, number> = {};
  operationStats.forEach((stat: any) => {
    entriesByOperation[stat.operation] = parseInt(stat.count);
  });

  const entriesByUser: Record<string, number> = {};
  userStats.forEach((stat: any) => {
    entriesByUser[stat.userId || 'anonymous'] = parseInt(stat.count);
  });

  const entriesByTable: Record<string, number> = {};
  tableStats.forEach((stat: any) => {
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
export async function performForensicAnalysis(
  auditModel: ModelStatic<any>,
  startDate: Date,
  endDate: Date,
): Promise<{ anomalies: any[]; suspiciousUsers: string[] }> {
  const entries = await auditModel.findAll({
    where: {
      timestamp: { [Op.between]: [startDate, endDate] },
    },
  });

  const anomalies: any[] = [];
  const userActivity: Record<string, { count: number; operations: string[] }> = {};

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
export function configureChangeTracking(
  model: ModelStatic<any>,
  auditModel: ModelStatic<any>,
  config: ChangeTrackingConfig,
): ModelStatic<any> {
  // Add version field if specified
  if (config.versionField && !model.rawAttributes[config.versionField]) {
    model.rawAttributes[config.versionField] = {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      allowNull: false,
    };
    model.refreshAttributes();
  }

  // Track changes
  model.addHook('beforeUpdate', (instance: any) => {
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
export function createVersionHistoryTable(
  sequelize: Sequelize,
  sourceModel: ModelStatic<any>,
  historyTableName?: string,
): ModelStatic<any> {
  const attributes = { ...sourceModel.rawAttributes };

  // Add versioning fields
  const versionAttributes = {
    ...attributes,
    historyId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    originalId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: sourceModel.tableName,
        key: 'id',
      },
    },
    version: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    validFrom: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    validTo: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    changedBy: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  };

  class VersionHistoryModel extends Model {}

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
export async function getVersionHistory(
  historyModel: ModelStatic<any>,
  recordId: string,
): Promise<Model[]> {
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
export async function compareVersions(
  historyModel: ModelStatic<any>,
  recordId: string,
  version1: number,
  version2: number,
): Promise<{ added: Record<string, any>; removed: Record<string, any>; modified: Record<string, any> }> {
  const [v1, v2] = await Promise.all([
    historyModel.findOne({ where: { originalId: recordId, version: version1 } }),
    historyModel.findOne({ where: { originalId: recordId, version: version2 } }),
  ]);

  if (!v1 || !v2) {
    throw new Error('Version not found');
  }

  const data1 = v1.toJSON();
  const data2 = v2.toJSON();

  const added: Record<string, any> = {};
  const removed: Record<string, any> = {};
  const modified: Record<string, any> = {};

  // Compare fields
  const allKeys = new Set([...Object.keys(data1), ...Object.keys(data2)]);

  allKeys.forEach(key => {
    if (['historyId', 'version', 'validFrom', 'validTo', 'changedBy'].includes(key)) return;

    if (!(key in data1)) {
      added[key] = data2[key];
    } else if (!(key in data2)) {
      removed[key] = data1[key];
    } else if (JSON.stringify(data1[key]) !== JSON.stringify(data2[key])) {
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
export async function trackUserAction(
  actionModel: ModelStatic<any>,
  action: UserActionEntry,
): Promise<Model> {
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
export function createUserActionModel(sequelize: Sequelize): ModelStatic<any> {
  const attributes: ModelAttributes = {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    userName: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    action: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    resource: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    resourceId: {
      type: DataTypes.STRING(128),
      allowNull: true,
    },
    timestamp: {
      type: DataTypes.DATE(6),
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    success: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    errorMessage: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Action duration in milliseconds',
    },
    ipAddress: {
      type: DataTypes.INET,
      allowNull: true,
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
  };

  class UserActionModel extends Model {}

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
export async function getUserActionHistory(
  actionModel: ModelStatic<any>,
  userId: string,
  startDate?: Date,
  endDate?: Date,
): Promise<Model[]> {
  const where: WhereOptions = { userId };

  if (startDate || endDate) {
    where.timestamp = {};
    if (startDate) where.timestamp[Op.gte] = startDate;
    if (endDate) where.timestamp[Op.lte] = endDate;
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
export async function analyzeUserBehavior(
  actionModel: ModelStatic<any>,
  userId: string,
  days: number = 30,
): Promise<{ normalPattern: any; currentPattern: any; anomalies: string[] }> {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const actions = await actionModel.findAll({
    where: {
      userId,
      timestamp: { [Op.gte]: cutoffDate },
    },
    order: [['timestamp', 'ASC']],
  });

  // Calculate normal patterns
  const hourCounts: Record<number, number> = {};
  const actionCounts: Record<string, number> = {};
  let totalActions = actions.length;

  actions.forEach(action => {
    const hour = action.getDataValue('timestamp').getHours();
    hourCounts[hour] = (hourCounts[hour] || 0) + 1;

    const actionType = action.getDataValue('action');
    actionCounts[actionType] = (actionCounts[actionType] || 0) + 1;
  });

  // Detect anomalies
  const anomalies: string[] = [];

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
export async function configureAuditAlert(
  sequelize: Sequelize,
  config: AuditAlertConfig,
): Promise<Model> {
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
export function createAuditAlertModel(sequelize: Sequelize): ModelStatic<any> {
  const attributes: ModelAttributes = {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    configuration: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    lastTriggered: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    triggerCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  };

  class AuditAlertConfigModel extends Model {}

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
export async function evaluateAuditAlerts(
  sequelize: Sequelize,
  auditModel: ModelStatic<any>,
): Promise<Array<{ alert: string; triggered: boolean; details: any }>> {
  const AlertConfig = sequelize.models.AuditAlertConfig;
  if (!AlertConfig) return [];

  const alerts = await AlertConfig.findAll({ where: { enabled: true } });
  const results: Array<{ alert: string; triggered: boolean; details: any }> = [];

  for (const alert of alerts) {
    const config: AuditAlertConfig = alert.getDataValue('configuration');
    const windowStart = new Date();
    windowStart.setMinutes(windowStart.getMinutes() - (config.windowMinutes || 60));

    // Check throttle
    const lastTriggered = alert.getDataValue('lastTriggered');
    if (lastTriggered && config.throttleMinutes) {
      const minutesSinceLastTrigger =
        (Date.now() - lastTriggered.getTime()) / (1000 * 60);
      if (minutesSinceLastTrigger < config.throttleMinutes) {
        continue; // Skip this alert, still in throttle period
      }
    }

    // Evaluate condition (simplified - in production use proper SQL parsing)
    const recentEntries = await auditModel.findAll({
      where: {
        timestamp: { [Op.gte]: windowStart },
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

export default {
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
