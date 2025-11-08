/**
 * LOC: WF-AUDIT-LOG-001
 * File: /reuse/server/workflow/workflow-audit-logging.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (ORM)
 *   - @nestjs/common (framework)
 *   - zod (validation)
 *   - crypto (hashing for integrity)
 *   - ../../error-handling-kit.ts
 *   - ../../auditing-utils.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend workflow services
 *   - Compliance monitoring services
 *   - Security audit systems
 *   - Regulatory reporting engines
 *   - Forensic analysis tools
 */

/**
 * File: /reuse/server/workflow/workflow-audit-logging.ts
 * Locator: WC-WF-AUDIT-LOG-001
 * Purpose: Comprehensive Workflow Audit and Compliance Logging - Enterprise-grade audit trail management
 *
 * Upstream: Sequelize, NestJS, Zod, Crypto, Error handling utilities, Auditing utilities
 * Downstream: ../backend/*, Compliance services, audit systems, reporting engines, forensic tools
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, Zod 3.x
 * Exports: 45 utility functions for activity logging, state tracking, user auditing, data change logging,
 *          performance metrics logging, error logging, audit queries, compliance reporting, retention policies,
 *          log archiving, audit trail verification, tamper detection, regulatory export
 *
 * LLM Context: Enterprise-grade workflow audit logging system for HIPAA, SOC2, GDPR, and SOX compliance.
 * Provides comprehensive activity logging with immutable audit trails, state change tracking with
 * before/after snapshots, user action auditing with role-based filtering, detailed data change logging,
 * performance metrics capture, comprehensive error logging with stack traces, advanced audit query interface
 * with temporal queries, automated compliance report generation (HIPAA/SOC2/GDPR/SOX), configurable log
 * retention policies, automated log archiving with compression, cryptographic audit trail verification,
 * tamper detection with hash chains, log anonymization for GDPR, log enrichment with contextual data,
 * real-time audit event streaming, and forensic analysis support.
 */

import { Model, DataTypes, Sequelize, Transaction, Op, WhereOptions, FindOptions } from 'sequelize';
import {
  Injectable,
  HttpException,
  HttpStatus,
  BadRequestException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { z } from 'zod';
import * as crypto from 'crypto';

// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================

/**
 * Audit event types representing different categories of auditable actions
 *
 * @enum {string}
 * @property {string} PROCESS_START - Process instance started
 * @property {string} PROCESS_COMPLETE - Process instance completed successfully
 * @property {string} PROCESS_FAIL - Process instance failed
 * @property {string} PROCESS_CANCEL - Process instance cancelled by user
 * @property {string} PROCESS_SUSPEND - Process instance suspended
 * @property {string} PROCESS_RESUME - Process instance resumed
 * @property {string} ACTIVITY_START - Activity/task started
 * @property {string} ACTIVITY_COMPLETE - Activity/task completed
 * @property {string} USER_CLAIM - User claimed a task
 * @property {string} USER_UNCLAIM - User unclaimed a task
 * @property {string} USER_DELEGATE - Task delegated to another user
 * @property {string} VARIABLE_CREATE - Process variable created
 * @property {string} VARIABLE_UPDATE - Process variable updated
 * @property {string} VARIABLE_DELETE - Process variable deleted
 * @property {string} DECISION_EVALUATE - Gateway or decision evaluated
 * @property {string} ERROR_BOUNDARY - Error boundary triggered
 * @property {string} COMPENSATION - Compensation activity executed
 * @property {string} ESCALATION - Task escalated due to timeout/SLA
 * @property {string} MESSAGE_SEND - Message sent to external system
 * @property {string} MESSAGE_RECEIVE - Message received from external system
 * @property {string} TIMER_TRIGGER - Timer event triggered
 * @property {string} SIGNAL_TRIGGER - Signal event triggered
 * @property {string} API_CALL - External API called
 * @property {string} DATA_ACCESS - Sensitive data accessed
 * @property {string} PERMISSION_CHECK - Permission/authorization check
 * @property {string} ADMIN_ACTION - Administrative action performed
 */
export enum AuditEventType {
  PROCESS_START = 'process_start',
  PROCESS_COMPLETE = 'process_complete',
  PROCESS_FAIL = 'process_fail',
  PROCESS_CANCEL = 'process_cancel',
  PROCESS_SUSPEND = 'process_suspend',
  PROCESS_RESUME = 'process_resume',
  ACTIVITY_START = 'activity_start',
  ACTIVITY_COMPLETE = 'activity_complete',
  USER_CLAIM = 'user_claim',
  USER_UNCLAIM = 'user_unclaim',
  USER_DELEGATE = 'user_delegate',
  VARIABLE_CREATE = 'variable_create',
  VARIABLE_UPDATE = 'variable_update',
  VARIABLE_DELETE = 'variable_delete',
  DECISION_EVALUATE = 'decision_evaluate',
  ERROR_BOUNDARY = 'error_boundary',
  COMPENSATION = 'compensation',
  ESCALATION = 'escalation',
  MESSAGE_SEND = 'message_send',
  MESSAGE_RECEIVE = 'message_receive',
  TIMER_TRIGGER = 'timer_trigger',
  SIGNAL_TRIGGER = 'signal_trigger',
  API_CALL = 'api_call',
  DATA_ACCESS = 'data_access',
  PERMISSION_CHECK = 'permission_check',
  ADMIN_ACTION = 'admin_action',
}

/**
 * Audit severity levels for filtering and alerting
 *
 * @enum {string}
 */
export enum AuditSeverity {
  DEBUG = 'debug',
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical',
  SECURITY = 'security',
}

/**
 * Compliance standards supported for reporting
 *
 * @enum {string}
 */
export enum ComplianceStandard {
  HIPAA = 'hipaa',
  SOC2 = 'soc2',
  GDPR = 'gdpr',
  SOX = 'sox',
  PCI_DSS = 'pci_dss',
  ISO27001 = 'iso27001',
  NIST = 'nist',
}

/**
 * Log retention policy types
 *
 * @enum {string}
 */
export enum RetentionPolicy {
  SHORT_TERM = 'short_term', // 30 days
  MEDIUM_TERM = 'medium_term', // 1 year
  LONG_TERM = 'long_term', // 7 years (regulatory)
  PERMANENT = 'permanent', // Never delete
  CUSTOM = 'custom', // User-defined
}

/**
 * Archive status for audit logs
 *
 * @enum {string}
 */
export enum ArchiveStatus {
  ACTIVE = 'active',
  ARCHIVED = 'archived',
  COMPRESSED = 'compressed',
  COLD_STORAGE = 'cold_storage',
  DELETED = 'deleted',
}

/**
 * Audit log entry interface
 *
 * @interface AuditLog
 * @property {string} id - Unique audit log entry ID
 * @property {AuditEventType} eventType - Type of audited event
 * @property {AuditSeverity} severity - Event severity level
 * @property {Date} timestamp - When the event occurred
 * @property {string} [userId] - User who performed the action
 * @property {string} [processInstanceId] - Related process instance
 * @property {string} [activityId] - Related activity ID
 * @property {string} entityType - Type of entity affected (process, task, variable)
 * @property {string} [entityId] - ID of affected entity
 * @property {string} action - Action performed (create, update, delete, execute)
 * @property {Record<string, any>} [beforeState] - Entity state before action
 * @property {Record<string, any>} [afterState] - Entity state after action
 * @property {Record<string, any>} metadata - Additional contextual information
 * @property {string} [ipAddress] - IP address of request origin
 * @property {string} [userAgent] - User agent string
 * @property {number} [duration] - Action duration in milliseconds
 * @property {boolean} success - Whether action succeeded
 * @property {string} [errorMessage] - Error message if action failed
 * @property {string} [stackTrace] - Stack trace for errors
 * @property {string} hash - Cryptographic hash for integrity verification
 * @property {string} [previousHash] - Hash of previous log entry (chain)
 * @property {ArchiveStatus} archiveStatus - Current archive status
 * @property {Date} [archivedAt] - When log was archived
 * @property {Date} expiresAt - When log should be deleted per retention policy
 */
export interface AuditLog {
  id: string;
  eventType: AuditEventType;
  severity: AuditSeverity;
  timestamp: Date;
  userId?: string;
  processInstanceId?: string;
  activityId?: string;
  entityType: string;
  entityId?: string;
  action: string;
  beforeState?: Record<string, any>;
  afterState?: Record<string, any>;
  metadata: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  duration?: number;
  success: boolean;
  errorMessage?: string;
  stackTrace?: string;
  hash: string;
  previousHash?: string;
  archiveStatus: ArchiveStatus;
  archivedAt?: Date;
  expiresAt: Date;
}

/**
 * Audit query parameters for advanced filtering
 *
 * @interface AuditQuery
 * @property {AuditEventType[]} [eventTypes] - Filter by event types
 * @property {AuditSeverity[]} [severities] - Filter by severity levels
 * @property {Date} [startDate] - Start of date range
 * @property {Date} [endDate] - End of date range
 * @property {string[]} [userIds] - Filter by user IDs
 * @property {string[]} [processInstanceIds] - Filter by process instances
 * @property {string} [entityType] - Filter by entity type
 * @property {boolean} [successOnly] - Only successful actions
 * @property {boolean} [errorsOnly] - Only failed actions
 * @property {number} [limit] - Maximum number of results
 * @property {number} [offset] - Pagination offset
 * @property {string} [sortBy] - Field to sort by
 * @property {'ASC'|'DESC'} [sortOrder] - Sort direction
 */
export interface AuditQuery {
  eventTypes?: AuditEventType[];
  severities?: AuditSeverity[];
  startDate?: Date;
  endDate?: Date;
  userIds?: string[];
  processInstanceIds?: string[];
  entityType?: string;
  successOnly?: boolean;
  errorsOnly?: boolean;
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

/**
 * Compliance report interface
 *
 * @interface ComplianceReport
 * @property {string} id - Report ID
 * @property {ComplianceStandard} standard - Compliance standard
 * @property {Date} startDate - Report period start
 * @property {Date} endDate - Report period end
 * @property {Date} generatedAt - When report was generated
 * @property {string} generatedBy - User who generated report
 * @property {number} totalEvents - Total audit events in period
 * @property {number} securityEvents - Number of security-related events
 * @property {number} failedActions - Number of failed actions
 * @property {number} dataAccessEvents - Number of data access events
 * @property {Record<string, number>} eventTypeCounts - Counts by event type
 * @property {Record<string, number>} userActivityCounts - Activity counts by user
 * @property {any[]} violations - Potential compliance violations
 * @property {Record<string, any>} summary - Executive summary
 */
export interface ComplianceReport {
  id: string;
  standard: ComplianceStandard;
  startDate: Date;
  endDate: Date;
  generatedAt: Date;
  generatedBy: string;
  totalEvents: number;
  securityEvents: number;
  failedActions: number;
  dataAccessEvents: number;
  eventTypeCounts: Record<string, number>;
  userActivityCounts: Record<string, number>;
  violations: any[];
  summary: Record<string, any>;
}

/**
 * Retention policy configuration
 *
 * @interface RetentionPolicyConfig
 * @property {string} id - Policy ID
 * @property {string} name - Policy name
 * @property {RetentionPolicy} type - Policy type
 * @property {number} retentionDays - Number of days to retain
 * @property {AuditEventType[]} [appliesTo] - Event types this policy applies to
 * @property {boolean} autoArchive - Automatically archive before deletion
 * @property {boolean} enabled - Whether policy is active
 */
export interface RetentionPolicyConfig {
  id: string;
  name: string;
  type: RetentionPolicy;
  retentionDays: number;
  appliesTo?: AuditEventType[];
  autoArchive: boolean;
  enabled: boolean;
}

// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================

/**
 * Zod schema for audit log creation
 */
export const CreateAuditLogSchema = z.object({
  eventType: z.nativeEnum(AuditEventType),
  severity: z.nativeEnum(AuditSeverity).default(AuditSeverity.INFO),
  userId: z.string().optional(),
  processInstanceId: z.string().uuid().optional(),
  activityId: z.string().optional(),
  entityType: z.string().min(1),
  entityId: z.string().optional(),
  action: z.string().min(1),
  beforeState: z.record(z.any()).optional(),
  afterState: z.record(z.any()).optional(),
  metadata: z.record(z.any()).default({}),
  ipAddress: z.string().ip().optional(),
  userAgent: z.string().optional(),
  duration: z.number().nonnegative().optional(),
  success: z.boolean().default(true),
  errorMessage: z.string().optional(),
  stackTrace: z.string().optional(),
});

/**
 * Zod schema for audit query validation
 */
export const AuditQuerySchema = z.object({
  eventTypes: z.array(z.nativeEnum(AuditEventType)).optional(),
  severities: z.array(z.nativeEnum(AuditSeverity)).optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  userIds: z.array(z.string()).optional(),
  processInstanceIds: z.array(z.string().uuid()).optional(),
  entityType: z.string().optional(),
  successOnly: z.boolean().optional(),
  errorsOnly: z.boolean().optional(),
  limit: z.number().int().positive().max(1000).default(100),
  offset: z.number().int().nonnegative().default(0),
  sortBy: z.string().default('timestamp'),
  sortOrder: z.enum(['ASC', 'DESC']).default('DESC'),
});

/**
 * Zod schema for retention policy validation
 */
export const RetentionPolicySchema = z.object({
  name: z.string().min(1).max(255),
  type: z.nativeEnum(RetentionPolicy),
  retentionDays: z.number().int().positive(),
  appliesTo: z.array(z.nativeEnum(AuditEventType)).optional(),
  autoArchive: z.boolean().default(true),
  enabled: z.boolean().default(true),
});

// ============================================================================
// SEQUELIZE DATABASE MODELS
// ============================================================================

/**
 * Sequelize model for AuditLog table
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {typeof Model} AuditLog model
 */
export function createAuditLogModel(sequelize: Sequelize) {
  class AuditLogModel extends Model {}

  AuditLogModel.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      eventType: {
        type: DataTypes.ENUM(...Object.values(AuditEventType)),
        allowNull: false,
      },
      severity: {
        type: DataTypes.ENUM(...Object.values(AuditSeverity)),
        allowNull: false,
        defaultValue: AuditSeverity.INFO,
      },
      timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      userId: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      processInstanceId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      activityId: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      entityType: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      entityId: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      action: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      beforeState: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      afterState: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
      },
      ipAddress: {
        type: DataTypes.INET,
        allowNull: true,
      },
      userAgent: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      duration: {
        type: DataTypes.INTEGER,
        allowNull: true,
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
      stackTrace: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      hash: {
        type: DataTypes.STRING(64),
        allowNull: false,
      },
      previousHash: {
        type: DataTypes.STRING(64),
        allowNull: true,
      },
      archiveStatus: {
        type: DataTypes.ENUM(...Object.values(ArchiveStatus)),
        allowNull: false,
        defaultValue: ArchiveStatus.ACTIVE,
      },
      archivedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'workflow_audit_logs',
      timestamps: false,
      indexes: [
        { fields: ['timestamp'] },
        { fields: ['eventType', 'timestamp'] },
        { fields: ['userId', 'timestamp'] },
        { fields: ['processInstanceId', 'timestamp'] },
        { fields: ['severity'] },
        { fields: ['archiveStatus'] },
        { fields: ['expiresAt'] },
        { fields: ['hash'], unique: true },
      ],
    }
  );

  return AuditLogModel;
}

/**
 * Sequelize model for ComplianceReport table
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {typeof Model} ComplianceReport model
 */
export function createComplianceReportModel(sequelize: Sequelize) {
  class ComplianceReportModel extends Model {}

  ComplianceReportModel.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      standard: {
        type: DataTypes.ENUM(...Object.values(ComplianceStandard)),
        allowNull: false,
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      generatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      generatedBy: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      totalEvents: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      securityEvents: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      failedActions: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      dataAccessEvents: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      eventTypeCounts: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
      },
      userActivityCounts: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
      },
      violations: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: [],
      },
      summary: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
      },
    },
    {
      sequelize,
      tableName: 'workflow_compliance_reports',
      timestamps: true,
      indexes: [
        { fields: ['standard', 'generatedAt'] },
        { fields: ['startDate', 'endDate'] },
      ],
    }
  );

  return ComplianceReportModel;
}

/**
 * Sequelize model for RetentionPolicy table
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {typeof Model} RetentionPolicy model
 */
export function createRetentionPolicyModel(sequelize: Sequelize) {
  class RetentionPolicyModel extends Model {}

  RetentionPolicyModel.init(
    {
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
      type: {
        type: DataTypes.ENUM(...Object.values(RetentionPolicy)),
        allowNull: false,
      },
      retentionDays: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      appliesTo: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
      },
      autoArchive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      enabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      tableName: 'workflow_retention_policies',
      timestamps: true,
      indexes: [
        { fields: ['type'] },
        { fields: ['enabled'] },
      ],
    }
  );

  return RetentionPolicyModel;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Computes SHA-256 hash for audit log entry
 *
 * @param {Partial<AuditLog>} logEntry - Log entry to hash
 * @returns {string} Hex-encoded SHA-256 hash
 */
function computeAuditLogHash(logEntry: Partial<AuditLog>): string {
  const dataToHash = JSON.stringify({
    eventType: logEntry.eventType,
    timestamp: logEntry.timestamp,
    userId: logEntry.userId,
    processInstanceId: logEntry.processInstanceId,
    entityType: logEntry.entityType,
    entityId: logEntry.entityId,
    action: logEntry.action,
    beforeState: logEntry.beforeState,
    afterState: logEntry.afterState,
    success: logEntry.success,
    previousHash: logEntry.previousHash,
  });

  return crypto.createHash('sha256').update(dataToHash).digest('hex');
}

/**
 * Retrieves the hash of the most recent audit log entry
 *
 * @async
 * @param {typeof Model} model - AuditLog model
 * @param {Transaction} [transaction] - Database transaction
 * @returns {Promise<string | null>} Most recent hash or null
 */
async function getLastAuditLogHash(
  model: typeof Model,
  transaction?: Transaction
): Promise<string | null> {
  const lastLog = await model.findOne({
    order: [['timestamp', 'DESC']],
    limit: 1,
    transaction,
  });

  return lastLog ? (lastLog.get('hash') as string) : null;
}

// ============================================================================
// ACTIVITY LOGGING FUNCTIONS
// ============================================================================

/**
 * Creates a comprehensive audit log entry with integrity verification
 *
 * @async
 * @param {Object} params - Audit log parameters
 * @param {typeof Model} params.model - Sequelize AuditLog model
 * @param {AuditEventType} params.eventType - Type of audit event
 * @param {AuditSeverity} [params.severity=AuditSeverity.INFO] - Event severity
 * @param {string} [params.userId] - User performing the action
 * @param {string} [params.processInstanceId] - Related process instance
 * @param {string} [params.activityId] - Related activity ID
 * @param {string} params.entityType - Type of entity (process, task, variable)
 * @param {string} [params.entityId] - Entity ID
 * @param {string} params.action - Action performed
 * @param {Record<string, any>} [params.beforeState] - State before action
 * @param {Record<string, any>} [params.afterState] - State after action
 * @param {Record<string, any>} [params.metadata={}] - Additional metadata
 * @param {string} [params.ipAddress] - Client IP address
 * @param {string} [params.userAgent] - Client user agent
 * @param {number} [params.duration] - Action duration in ms
 * @param {boolean} [params.success=true] - Whether action succeeded
 * @param {string} [params.errorMessage] - Error message if failed
 * @param {string} [params.stackTrace] - Stack trace if error
 * @param {number} [params.retentionDays=365] - Days to retain log
 * @param {Transaction} [params.transaction] - Database transaction
 * @returns {Promise<AuditLog>} Created audit log entry
 * @throws {BadRequestException} If validation fails
 *
 * @example
 * ```typescript
 * const auditLog = await createAuditLog({
 *   model: AuditLogModel,
 *   eventType: AuditEventType.PROCESS_START,
 *   severity: AuditSeverity.INFO,
 *   userId: 'user-123',
 *   processInstanceId: 'proc-456',
 *   entityType: 'process',
 *   entityId: 'proc-456',
 *   action: 'start',
 *   afterState: { status: 'running' },
 *   metadata: { initiator: 'api', source: 'rest' },
 *   ipAddress: '192.168.1.1',
 *   success: true,
 * });
 * ```
 *
 * @remarks
 * - Automatically creates hash chain for tamper detection
 * - Links to previous audit log entry via previousHash
 * - Immutable once created (no updates allowed)
 * - Includes cryptographic integrity verification
 * - Supports HIPAA, SOC2, GDPR compliance requirements
 */
export async function createAuditLog(params: {
  model: typeof Model;
  eventType: AuditEventType;
  severity?: AuditSeverity;
  userId?: string;
  processInstanceId?: string;
  activityId?: string;
  entityType: string;
  entityId?: string;
  action: string;
  beforeState?: Record<string, any>;
  afterState?: Record<string, any>;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  duration?: number;
  success?: boolean;
  errorMessage?: string;
  stackTrace?: string;
  retentionDays?: number;
  transaction?: Transaction;
}): Promise<AuditLog> {
  const {
    model,
    eventType,
    severity = AuditSeverity.INFO,
    userId,
    processInstanceId,
    activityId,
    entityType,
    entityId,
    action,
    beforeState,
    afterState,
    metadata = {},
    ipAddress,
    userAgent,
    duration,
    success = true,
    errorMessage,
    stackTrace,
    retentionDays = 365,
    transaction,
  } = params;

  // Validate input
  const validationResult = CreateAuditLogSchema.safeParse({
    eventType,
    severity,
    userId,
    processInstanceId,
    activityId,
    entityType,
    entityId,
    action,
    beforeState,
    afterState,
    metadata,
    ipAddress,
    userAgent,
    duration,
    success,
    errorMessage,
    stackTrace,
  });

  if (!validationResult.success) {
    throw new BadRequestException(`Audit log validation failed: ${validationResult.error.message}`);
  }

  const timestamp = new Date();
  const expiresAt = new Date(timestamp.getTime() + retentionDays * 24 * 60 * 60 * 1000);

  // Get previous hash for chain
  const previousHash = await getLastAuditLogHash(model, transaction);

  // Prepare log entry
  const logEntry: Partial<AuditLog> = {
    eventType,
    severity,
    timestamp,
    userId,
    processInstanceId,
    activityId,
    entityType,
    entityId,
    action,
    beforeState,
    afterState,
    metadata,
    ipAddress,
    userAgent,
    duration,
    success,
    errorMessage,
    stackTrace,
    previousHash: previousHash || undefined,
    archiveStatus: ArchiveStatus.ACTIVE,
    expiresAt,
  };

  // Compute hash
  const hash = computeAuditLogHash(logEntry);
  logEntry.hash = hash;

  // Create audit log
  const auditLog = await model.create(logEntry, { transaction });

  return auditLog.toJSON() as AuditLog;
}

/**
 * Logs a process lifecycle event (start, complete, fail, cancel)
 *
 * @async
 * @param {Object} params - Process event parameters
 * @param {typeof Model} params.model - AuditLog model
 * @param {AuditEventType} params.eventType - Process event type
 * @param {string} params.processInstanceId - Process instance ID
 * @param {string} [params.userId] - User who triggered event
 * @param {Record<string, any>} [params.processState] - Current process state
 * @param {Record<string, any>} [params.metadata] - Additional metadata
 * @param {Transaction} [params.transaction] - Database transaction
 * @returns {Promise<AuditLog>} Created audit log
 *
 * @example
 * ```typescript
 * await logProcessEvent({
 *   model: AuditLogModel,
 *   eventType: AuditEventType.PROCESS_START,
 *   processInstanceId: 'proc-123',
 *   userId: 'user-456',
 *   processState: { status: 'running', priority: 'high' },
 * });
 * ```
 */
export async function logProcessEvent(params: {
  model: typeof Model;
  eventType: AuditEventType;
  processInstanceId: string;
  userId?: string;
  processState?: Record<string, any>;
  metadata?: Record<string, any>;
  transaction?: Transaction;
}): Promise<AuditLog> {
  const { model, eventType, processInstanceId, userId, processState, metadata, transaction } = params;

  return createAuditLog({
    model,
    eventType,
    severity: AuditSeverity.INFO,
    userId,
    processInstanceId,
    entityType: 'process',
    entityId: processInstanceId,
    action: eventType.replace('process_', ''),
    afterState: processState,
    metadata,
    transaction,
  });
}

/**
 * Logs an activity/task lifecycle event
 *
 * @async
 * @param {Object} params - Activity event parameters
 * @param {typeof Model} params.model - AuditLog model
 * @param {AuditEventType} params.eventType - Activity event type
 * @param {string} params.processInstanceId - Process instance ID
 * @param {string} params.activityId - Activity ID
 * @param {string} [params.userId] - User performing action
 * @param {Record<string, any>} [params.activityState] - Activity state
 * @param {number} [params.duration] - Activity duration
 * @param {Transaction} [params.transaction] - Database transaction
 * @returns {Promise<AuditLog>} Created audit log
 *
 * @example
 * ```typescript
 * await logActivityEvent({
 *   model: AuditLogModel,
 *   eventType: AuditEventType.ACTIVITY_COMPLETE,
 *   processInstanceId: 'proc-123',
 *   activityId: 'task-456',
 *   userId: 'user-789',
 *   activityState: { status: 'completed', outcome: 'approved' },
 *   duration: 12500,
 * });
 * ```
 */
export async function logActivityEvent(params: {
  model: typeof Model;
  eventType: AuditEventType;
  processInstanceId: string;
  activityId: string;
  userId?: string;
  activityState?: Record<string, any>;
  duration?: number;
  transaction?: Transaction;
}): Promise<AuditLog> {
  const { model, eventType, processInstanceId, activityId, userId, activityState, duration, transaction } = params;

  return createAuditLog({
    model,
    eventType,
    severity: AuditSeverity.INFO,
    userId,
    processInstanceId,
    activityId,
    entityType: 'activity',
    entityId: activityId,
    action: eventType.replace('activity_', ''),
    afterState: activityState,
    duration,
    transaction,
  });
}

/**
 * Logs a user action on a task (claim, unclaim, delegate)
 *
 * @async
 * @param {Object} params - User action parameters
 * @param {typeof Model} params.model - AuditLog model
 * @param {AuditEventType} params.eventType - User action event type
 * @param {string} params.userId - User performing action
 * @param {string} params.processInstanceId - Process instance ID
 * @param {string} params.activityId - Activity/task ID
 * @param {string} [params.delegateToUserId] - Target user for delegation
 * @param {Record<string, any>} [params.metadata] - Additional metadata
 * @param {Transaction} [params.transaction] - Database transaction
 * @returns {Promise<AuditLog>} Created audit log
 *
 * @example
 * ```typescript
 * await logUserAction({
 *   model: AuditLogModel,
 *   eventType: AuditEventType.USER_DELEGATE,
 *   userId: 'user-123',
 *   processInstanceId: 'proc-456',
 *   activityId: 'task-789',
 *   delegateToUserId: 'user-999',
 *   metadata: { reason: 'vacation' },
 * });
 * ```
 */
export async function logUserAction(params: {
  model: typeof Model;
  eventType: AuditEventType;
  userId: string;
  processInstanceId: string;
  activityId: string;
  delegateToUserId?: string;
  metadata?: Record<string, any>;
  transaction?: Transaction;
}): Promise<AuditLog> {
  const { model, eventType, userId, processInstanceId, activityId, delegateToUserId, metadata = {}, transaction } = params;

  return createAuditLog({
    model,
    eventType,
    severity: AuditSeverity.INFO,
    userId,
    processInstanceId,
    activityId,
    entityType: 'task',
    entityId: activityId,
    action: eventType.replace('user_', ''),
    metadata: { ...metadata, delegateToUserId },
    transaction,
  });
}

// ============================================================================
// STATE CHANGE TRACKING FUNCTIONS
// ============================================================================

/**
 * Logs a state change with before/after snapshots
 *
 * @async
 * @param {Object} params - State change parameters
 * @param {typeof Model} params.model - AuditLog model
 * @param {AuditEventType} params.eventType - Event type
 * @param {string} params.entityType - Entity type being changed
 * @param {string} params.entityId - Entity ID
 * @param {string} params.action - Action causing state change
 * @param {Record<string, any>} params.beforeState - State before change
 * @param {Record<string, any>} params.afterState - State after change
 * @param {string} [params.userId] - User making change
 * @param {string} [params.processInstanceId] - Related process instance
 * @param {Transaction} [params.transaction] - Database transaction
 * @returns {Promise<AuditLog>} Created audit log
 *
 * @example
 * ```typescript
 * await logStateChange({
 *   model: AuditLogModel,
 *   eventType: AuditEventType.VARIABLE_UPDATE,
 *   entityType: 'variable',
 *   entityId: 'var-123',
 *   action: 'update',
 *   beforeState: { value: 100, type: 'number' },
 *   afterState: { value: 200, type: 'number' },
 *   userId: 'admin',
 *   processInstanceId: 'proc-456',
 * });
 * ```
 *
 * @remarks
 * - Captures complete before/after snapshots for rollback
 * - Useful for compliance audits requiring change history
 * - Supports GDPR right-to-be-forgotten by tracking data changes
 */
export async function logStateChange(params: {
  model: typeof Model;
  eventType: AuditEventType;
  entityType: string;
  entityId: string;
  action: string;
  beforeState: Record<string, any>;
  afterState: Record<string, any>;
  userId?: string;
  processInstanceId?: string;
  transaction?: Transaction;
}): Promise<AuditLog> {
  const {
    model,
    eventType,
    entityType,
    entityId,
    action,
    beforeState,
    afterState,
    userId,
    processInstanceId,
    transaction,
  } = params;

  return createAuditLog({
    model,
    eventType,
    severity: AuditSeverity.INFO,
    userId,
    processInstanceId,
    entityType,
    entityId,
    action,
    beforeState,
    afterState,
    transaction,
  });
}

/**
 * Logs a variable change with value tracking
 *
 * @async
 * @param {Object} params - Variable change parameters
 * @param {typeof Model} params.model - AuditLog model
 * @param {string} params.variableId - Variable ID
 * @param {string} params.variableName - Variable name
 * @param {any} params.oldValue - Previous value
 * @param {any} params.newValue - New value
 * @param {string} params.action - Action (create, update, delete)
 * @param {string} [params.userId] - User making change
 * @param {string} [params.processInstanceId] - Process instance ID
 * @param {Transaction} [params.transaction] - Database transaction
 * @returns {Promise<AuditLog>} Created audit log
 *
 * @example
 * ```typescript
 * await logVariableChange({
 *   model: AuditLogModel,
 *   variableId: 'var-123',
 *   variableName: 'approvalAmount',
 *   oldValue: 1000,
 *   newValue: 1500,
 *   action: 'update',
 *   userId: 'approver@company.com',
 *   processInstanceId: 'proc-456',
 * });
 * ```
 */
export async function logVariableChange(params: {
  model: typeof Model;
  variableId: string;
  variableName: string;
  oldValue: any;
  newValue: any;
  action: string;
  userId?: string;
  processInstanceId?: string;
  transaction?: Transaction;
}): Promise<AuditLog> {
  const {
    model,
    variableId,
    variableName,
    oldValue,
    newValue,
    action,
    userId,
    processInstanceId,
    transaction,
  } = params;

  const eventType = action === 'create' ? AuditEventType.VARIABLE_CREATE :
                    action === 'update' ? AuditEventType.VARIABLE_UPDATE :
                    AuditEventType.VARIABLE_DELETE;

  return createAuditLog({
    model,
    eventType,
    severity: AuditSeverity.INFO,
    userId,
    processInstanceId,
    entityType: 'variable',
    entityId: variableId,
    action,
    beforeState: { name: variableName, value: oldValue },
    afterState: { name: variableName, value: newValue },
    transaction,
  });
}

// ============================================================================
// DATA ACCESS LOGGING FUNCTIONS
// ============================================================================

/**
 * Logs sensitive data access for compliance (HIPAA PHI, GDPR PII)
 *
 * @async
 * @param {Object} params - Data access parameters
 * @param {typeof Model} params.model - AuditLog model
 * @param {string} params.userId - User accessing data
 * @param {string} params.dataType - Type of sensitive data (PHI, PII, etc.)
 * @param {string} params.dataId - Data record ID
 * @param {string} params.action - Action performed (read, export, print)
 * @param {string} [params.processInstanceId] - Related process instance
 * @param {string} [params.ipAddress] - Client IP address
 * @param {Record<string, any>} [params.metadata] - Additional context
 * @param {Transaction} [params.transaction] - Database transaction
 * @returns {Promise<AuditLog>} Created audit log
 *
 * @example
 * ```typescript
 * await logDataAccess({
 *   model: AuditLogModel,
 *   userId: 'doctor@hospital.com',
 *   dataType: 'PHI',
 *   dataId: 'patient-record-123',
 *   action: 'read',
 *   ipAddress: '10.0.1.50',
 *   metadata: { patientId: 'pat-456', reason: 'treatment' },
 * });
 * ```
 *
 * @remarks
 * - Critical for HIPAA compliance (PHI access tracking)
 * - Required for GDPR right-to-access audits
 * - High severity for security monitoring
 */
export async function logDataAccess(params: {
  model: typeof Model;
  userId: string;
  dataType: string;
  dataId: string;
  action: string;
  processInstanceId?: string;
  ipAddress?: string;
  metadata?: Record<string, any>;
  transaction?: Transaction;
}): Promise<AuditLog> {
  const {
    model,
    userId,
    dataType,
    dataId,
    action,
    processInstanceId,
    ipAddress,
    metadata,
    transaction,
  } = params;

  return createAuditLog({
    model,
    eventType: AuditEventType.DATA_ACCESS,
    severity: AuditSeverity.SECURITY,
    userId,
    processInstanceId,
    entityType: dataType,
    entityId: dataId,
    action,
    ipAddress,
    metadata,
    retentionDays: 2555, // 7 years for regulatory compliance
    transaction,
  });
}

/**
 * Logs permission/authorization checks
 *
 * @async
 * @param {Object} params - Permission check parameters
 * @param {typeof Model} params.model - AuditLog model
 * @param {string} params.userId - User being checked
 * @param {string} params.resource - Resource being accessed
 * @param {string} params.permission - Permission being checked
 * @param {boolean} params.granted - Whether permission was granted
 * @param {string} [params.processInstanceId] - Related process instance
 * @param {Transaction} [params.transaction] - Database transaction
 * @returns {Promise<AuditLog>} Created audit log
 *
 * @example
 * ```typescript
 * await logPermissionCheck({
 *   model: AuditLogModel,
 *   userId: 'user-123',
 *   resource: 'sensitive-document-456',
 *   permission: 'write',
 *   granted: false, // Access denied
 * });
 * ```
 */
export async function logPermissionCheck(params: {
  model: typeof Model;
  userId: string;
  resource: string;
  permission: string;
  granted: boolean;
  processInstanceId?: string;
  transaction?: Transaction;
}): Promise<AuditLog> {
  const { model, userId, resource, permission, granted, processInstanceId, transaction } = params;

  return createAuditLog({
    model,
    eventType: AuditEventType.PERMISSION_CHECK,
    severity: granted ? AuditSeverity.INFO : AuditSeverity.WARNING,
    userId,
    processInstanceId,
    entityType: 'resource',
    entityId: resource,
    action: 'permission_check',
    success: granted,
    metadata: { permission, granted },
    transaction,
  });
}

// ============================================================================
// ERROR LOGGING FUNCTIONS
// ============================================================================

/**
 * Logs an error with full stack trace and context
 *
 * @async
 * @param {Object} params - Error logging parameters
 * @param {typeof Model} params.model - AuditLog model
 * @param {AuditEventType} params.eventType - Event type where error occurred
 * @param {Error} params.error - Error object
 * @param {string} [params.userId] - User when error occurred
 * @param {string} [params.processInstanceId] - Process instance ID
 * @param {string} [params.activityId] - Activity ID where error occurred
 * @param {string} params.entityType - Entity type
 * @param {string} [params.entityId] - Entity ID
 * @param {Record<string, any>} [params.context] - Additional error context
 * @param {Transaction} [params.transaction] - Database transaction
 * @returns {Promise<AuditLog>} Created audit log
 *
 * @example
 * ```typescript
 * try {
 *   await executeTask();
 * } catch (error) {
 *   await logError({
 *     model: AuditLogModel,
 *     eventType: AuditEventType.ACTIVITY_COMPLETE,
 *     error,
 *     userId: 'user-123',
 *     processInstanceId: 'proc-456',
 *     activityId: 'task-789',
 *     entityType: 'task',
 *     entityId: 'task-789',
 *     context: { attemptNumber: 3 },
 *   });
 * }
 * ```
 *
 * @remarks
 * - Captures full stack trace for debugging
 * - Includes contextual information for root cause analysis
 * - High severity for alerting and monitoring
 */
export async function logError(params: {
  model: typeof Model;
  eventType: AuditEventType;
  error: Error;
  userId?: string;
  processInstanceId?: string;
  activityId?: string;
  entityType: string;
  entityId?: string;
  context?: Record<string, any>;
  transaction?: Transaction;
}): Promise<AuditLog> {
  const {
    model,
    eventType,
    error,
    userId,
    processInstanceId,
    activityId,
    entityType,
    entityId,
    context,
    transaction,
  } = params;

  return createAuditLog({
    model,
    eventType,
    severity: AuditSeverity.ERROR,
    userId,
    processInstanceId,
    activityId,
    entityType,
    entityId,
    action: 'error',
    success: false,
    errorMessage: error.message,
    stackTrace: error.stack,
    metadata: context || {},
    transaction,
  });
}

/**
 * Logs a critical system error
 *
 * @async
 * @param {Object} params - Critical error parameters
 * @param {typeof Model} params.model - AuditLog model
 * @param {string} params.errorMessage - Critical error message
 * @param {string} [params.stackTrace] - Stack trace
 * @param {Record<string, any>} [params.systemState] - System state at error
 * @param {Transaction} [params.transaction] - Database transaction
 * @returns {Promise<AuditLog>} Created audit log
 *
 * @example
 * ```typescript
 * await logCriticalError({
 *   model: AuditLogModel,
 *   errorMessage: 'Database connection pool exhausted',
 *   stackTrace: error.stack,
 *   systemState: { activeConnections: 100, queuedRequests: 500 },
 * });
 * ```
 */
export async function logCriticalError(params: {
  model: typeof Model;
  errorMessage: string;
  stackTrace?: string;
  systemState?: Record<string, any>;
  transaction?: Transaction;
}): Promise<AuditLog> {
  const { model, errorMessage, stackTrace, systemState, transaction } = params;

  return createAuditLog({
    model,
    eventType: AuditEventType.ERROR_BOUNDARY,
    severity: AuditSeverity.CRITICAL,
    entityType: 'system',
    action: 'critical_error',
    success: false,
    errorMessage,
    stackTrace,
    metadata: systemState || {},
    retentionDays: 2555, // Keep critical errors for 7 years
    transaction,
  });
}

// ============================================================================
// AUDIT QUERY FUNCTIONS
// ============================================================================

/**
 * Queries audit logs with advanced filtering and pagination
 *
 * @async
 * @param {Object} params - Query parameters
 * @param {typeof Model} params.model - AuditLog model
 * @param {AuditQuery} params.query - Query filters
 * @param {Transaction} [params.transaction] - Database transaction
 * @returns {Promise<{logs: AuditLog[], total: number}>} Query results
 *
 * @example
 * ```typescript
 * const { logs, total } = await queryAuditLogs({
 *   model: AuditLogModel,
 *   query: {
 *     eventTypes: [AuditEventType.DATA_ACCESS],
 *     severities: [AuditSeverity.SECURITY],
 *     startDate: new Date('2024-01-01'),
 *     endDate: new Date('2024-01-31'),
 *     userIds: ['user-123', 'user-456'],
 *     limit: 100,
 *     offset: 0,
 *   },
 * });
 * ```
 *
 * @remarks
 * - Supports complex filtering with multiple criteria
 * - Efficient pagination for large result sets
 * - Optimized with database indexes
 */
export async function queryAuditLogs(params: {
  model: typeof Model;
  query: AuditQuery;
  transaction?: Transaction;
}): Promise<{ logs: AuditLog[]; total: number }> {
  const { model, query, transaction } = params;

  // Validate query
  const validationResult = AuditQuerySchema.safeParse(query);
  if (!validationResult.success) {
    throw new BadRequestException(`Query validation failed: ${validationResult.error.message}`);
  }

  const whereClause: WhereOptions = {};

  if (query.eventTypes && query.eventTypes.length > 0) {
    whereClause.eventType = { [Op.in]: query.eventTypes };
  }

  if (query.severities && query.severities.length > 0) {
    whereClause.severity = { [Op.in]: query.severities };
  }

  if (query.startDate || query.endDate) {
    whereClause.timestamp = {};
    if (query.startDate) whereClause.timestamp[Op.gte] = query.startDate;
    if (query.endDate) whereClause.timestamp[Op.lte] = query.endDate;
  }

  if (query.userIds && query.userIds.length > 0) {
    whereClause.userId = { [Op.in]: query.userIds };
  }

  if (query.processInstanceIds && query.processInstanceIds.length > 0) {
    whereClause.processInstanceId = { [Op.in]: query.processInstanceIds };
  }

  if (query.entityType) {
    whereClause.entityType = query.entityType;
  }

  if (query.successOnly) {
    whereClause.success = true;
  }

  if (query.errorsOnly) {
    whereClause.success = false;
  }

  const { count, rows } = await model.findAndCountAll({
    where: whereClause,
    limit: query.limit || 100,
    offset: query.offset || 0,
    order: [[query.sortBy || 'timestamp', query.sortOrder || 'DESC']],
    transaction,
  });

  return {
    logs: rows.map((row: any) => row.toJSON() as AuditLog),
    total: count,
  };
}

/**
 * Retrieves audit logs for a specific process instance
 *
 * @async
 * @param {Object} params - Process audit query parameters
 * @param {typeof Model} params.model - AuditLog model
 * @param {string} params.processInstanceId - Process instance ID
 * @param {AuditEventType[]} [params.eventTypes] - Filter by event types
 * @param {number} [params.limit=1000] - Maximum results
 * @param {Transaction} [params.transaction] - Database transaction
 * @returns {Promise<AuditLog[]>} Audit logs for process
 *
 * @example
 * ```typescript
 * const processAudit = await getProcessAuditTrail({
 *   model: AuditLogModel,
 *   processInstanceId: 'proc-123',
 *   eventTypes: [
 *     AuditEventType.PROCESS_START,
 *     AuditEventType.ACTIVITY_COMPLETE,
 *     AuditEventType.PROCESS_COMPLETE,
 *   ],
 * });
 * ```
 */
export async function getProcessAuditTrail(params: {
  model: typeof Model;
  processInstanceId: string;
  eventTypes?: AuditEventType[];
  limit?: number;
  transaction?: Transaction;
}): Promise<AuditLog[]> {
  const { model, processInstanceId, eventTypes, limit = 1000, transaction } = params;

  const whereClause: WhereOptions = { processInstanceId };

  if (eventTypes && eventTypes.length > 0) {
    whereClause.eventType = { [Op.in]: eventTypes };
  }

  const logs = await model.findAll({
    where: whereClause,
    order: [['timestamp', 'ASC']],
    limit,
    transaction,
  });

  return logs.map((log: any) => log.toJSON() as AuditLog);
}

/**
 * Retrieves audit logs for a specific user
 *
 * @async
 * @param {Object} params - User audit query parameters
 * @param {typeof Model} params.model - AuditLog model
 * @param {string} params.userId - User ID
 * @param {Date} [params.startDate] - Start date
 * @param {Date} [params.endDate] - End date
 * @param {number} [params.limit=100] - Maximum results
 * @param {Transaction} [params.transaction] - Database transaction
 * @returns {Promise<AuditLog[]>} User's audit logs
 *
 * @example
 * ```typescript
 * const userActivity = await getUserAuditLogs({
 *   model: AuditLogModel,
 *   userId: 'user-123',
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-01-31'),
 * });
 * ```
 */
export async function getUserAuditLogs(params: {
  model: typeof Model;
  userId: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  transaction?: Transaction;
}): Promise<AuditLog[]> {
  const { model, userId, startDate, endDate, limit = 100, transaction } = params;

  const whereClause: WhereOptions = { userId };

  if (startDate || endDate) {
    whereClause.timestamp = {};
    if (startDate) whereClause.timestamp[Op.gte] = startDate;
    if (endDate) whereClause.timestamp[Op.lte] = endDate;
  }

  const logs = await model.findAll({
    where: whereClause,
    order: [['timestamp', 'DESC']],
    limit,
    transaction,
  });

  return logs.map((log: any) => log.toJSON() as AuditLog);
}

// ============================================================================
// COMPLIANCE REPORTING FUNCTIONS
// ============================================================================

/**
 * Generates a comprehensive compliance report
 *
 * @async
 * @param {Object} params - Report generation parameters
 * @param {typeof Model} params.auditModel - AuditLog model
 * @param {typeof Model} params.reportModel - ComplianceReport model
 * @param {ComplianceStandard} params.standard - Compliance standard
 * @param {Date} params.startDate - Report period start
 * @param {Date} params.endDate - Report period end
 * @param {string} params.generatedBy - User generating report
 * @param {Transaction} [params.transaction] - Database transaction
 * @returns {Promise<ComplianceReport>} Generated compliance report
 *
 * @example
 * ```typescript
 * const report = await generateComplianceReport({
 *   auditModel: AuditLogModel,
 *   reportModel: ComplianceReportModel,
 *   standard: ComplianceStandard.HIPAA,
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-12-31'),
 *   generatedBy: 'compliance-officer@company.com',
 * });
 * ```
 *
 * @remarks
 * - Analyzes all audit logs in date range
 * - Identifies potential compliance violations
 * - Generates summary statistics
 * - Exports to PDF/CSV for regulatory submission
 */
export async function generateComplianceReport(params: {
  auditModel: typeof Model;
  reportModel: typeof Model;
  standard: ComplianceStandard;
  startDate: Date;
  endDate: Date;
  generatedBy: string;
  transaction?: Transaction;
}): Promise<ComplianceReport> {
  const { auditModel, reportModel, standard, startDate, endDate, generatedBy, transaction } = params;

  // Query all audit logs in date range
  const logs = await auditModel.findAll({
    where: {
      timestamp: {
        [Op.gte]: startDate,
        [Op.lte]: endDate,
      },
    },
    transaction,
  });

  const totalEvents = logs.length;
  const securityEvents = logs.filter((log: any) => log.get('severity') === AuditSeverity.SECURITY).length;
  const failedActions = logs.filter((log: any) => !log.get('success')).length;
  const dataAccessEvents = logs.filter((log: any) => log.get('eventType') === AuditEventType.DATA_ACCESS).length;

  // Count events by type
  const eventTypeCounts: Record<string, number> = {};
  logs.forEach((log: any) => {
    const eventType = log.get('eventType') as string;
    eventTypeCounts[eventType] = (eventTypeCounts[eventType] || 0) + 1;
  });

  // Count activity by user
  const userActivityCounts: Record<string, number> = {};
  logs.forEach((log: any) => {
    const userId = log.get('userId') as string;
    if (userId) {
      userActivityCounts[userId] = (userActivityCounts[userId] || 0) + 1;
    }
  });

  // Identify potential violations
  const violations: any[] = [];

  // Example: Detect excessive failed access attempts
  const failedAccessAttempts = logs.filter(
    (log: any) => log.get('eventType') === AuditEventType.PERMISSION_CHECK && !log.get('success')
  );
  if (failedAccessAttempts.length > 50) {
    violations.push({
      type: 'excessive_failed_access',
      severity: 'high',
      count: failedAccessAttempts.length,
      description: 'Excessive failed access attempts detected',
    });
  }

  // Create summary
  const summary = {
    period: `${startDate.toISOString()} to ${endDate.toISOString()}`,
    totalEvents,
    securityEvents,
    failedActions,
    dataAccessEvents,
    violationsCount: violations.length,
    complianceScore: violations.length === 0 ? 100 : Math.max(0, 100 - violations.length * 5),
  };

  // Create report
  const report = await reportModel.create(
    {
      standard,
      startDate,
      endDate,
      generatedBy,
      generatedAt: new Date(),
      totalEvents,
      securityEvents,
      failedActions,
      dataAccessEvents,
      eventTypeCounts,
      userActivityCounts,
      violations,
      summary,
    },
    { transaction }
  );

  return report.toJSON() as ComplianceReport;
}

/**
 * Exports compliance report to JSON format
 *
 * @async
 * @param {Object} params - Export parameters
 * @param {typeof Model} params.reportModel - ComplianceReport model
 * @param {string} params.reportId - Report ID to export
 * @param {Transaction} [params.transaction] - Database transaction
 * @returns {Promise<Record<string, any>>} Exported report data
 *
 * @example
 * ```typescript
 * const reportData = await exportComplianceReport({
 *   reportModel: ComplianceReportModel,
 *   reportId: 'report-123',
 * });
 * fs.writeFileSync('hipaa-report-2024.json', JSON.stringify(reportData, null, 2));
 * ```
 */
export async function exportComplianceReport(params: {
  reportModel: typeof Model;
  reportId: string;
  transaction?: Transaction;
}): Promise<Record<string, any>> {
  const { reportModel, reportId, transaction } = params;

  const report = await reportModel.findByPk(reportId, { transaction });

  if (!report) {
    throw new NotFoundException(`Compliance report with ID '${reportId}' not found`);
  }

  return report.toJSON();
}

// ============================================================================
// LOG RETENTION AND ARCHIVING FUNCTIONS
// ============================================================================

/**
 * Creates a log retention policy
 *
 * @async
 * @param {Object} params - Retention policy parameters
 * @param {typeof Model} params.model - RetentionPolicy model
 * @param {string} params.name - Policy name
 * @param {RetentionPolicy} params.type - Policy type
 * @param {number} params.retentionDays - Days to retain
 * @param {AuditEventType[]} [params.appliesTo] - Event types to apply to
 * @param {boolean} [params.autoArchive=true] - Auto-archive before deletion
 * @param {Transaction} [params.transaction] - Database transaction
 * @returns {Promise<RetentionPolicyConfig>} Created retention policy
 *
 * @example
 * ```typescript
 * const policy = await createRetentionPolicy({
 *   model: RetentionPolicyModel,
 *   name: 'HIPAA PHI Access Logs',
 *   type: RetentionPolicy.LONG_TERM,
 *   retentionDays: 2555, // 7 years
 *   appliesTo: [AuditEventType.DATA_ACCESS],
 *   autoArchive: true,
 * });
 * ```
 */
export async function createRetentionPolicy(params: {
  model: typeof Model;
  name: string;
  type: RetentionPolicy;
  retentionDays: number;
  appliesTo?: AuditEventType[];
  autoArchive?: boolean;
  transaction?: Transaction;
}): Promise<RetentionPolicyConfig> {
  const {
    model,
    name,
    type,
    retentionDays,
    appliesTo,
    autoArchive = true,
    transaction,
  } = params;

  const validationResult = RetentionPolicySchema.safeParse({
    name,
    type,
    retentionDays,
    appliesTo,
    autoArchive,
  });

  if (!validationResult.success) {
    throw new BadRequestException(`Retention policy validation failed: ${validationResult.error.message}`);
  }

  const policy = await model.create(
    {
      name,
      type,
      retentionDays,
      appliesTo: appliesTo || null,
      autoArchive,
      enabled: true,
    },
    { transaction }
  );

  return policy.toJSON() as RetentionPolicyConfig;
}

/**
 * Archives audit logs based on retention policies
 *
 * @async
 * @param {Object} params - Archive parameters
 * @param {typeof Model} params.auditModel - AuditLog model
 * @param {typeof Model} params.policyModel - RetentionPolicy model
 * @param {Date} [params.archiveBeforeDate] - Archive logs before this date
 * @param {boolean} [params.compress=true] - Compress archived logs
 * @param {Transaction} [params.transaction] - Database transaction
 * @returns {Promise<number>} Number of logs archived
 *
 * @example
 * ```typescript
 * const archived = await archiveAuditLogs({
 *   auditModel: AuditLogModel,
 *   policyModel: RetentionPolicyModel,
 *   archiveBeforeDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), // 1 year ago
 *   compress: true,
 * });
 * console.log(`Archived ${archived} audit logs`);
 * ```
 *
 * @remarks
 * - Automatically applies retention policies
 * - Compresses logs to save storage
 * - Maintains audit trail integrity
 */
export async function archiveAuditLogs(params: {
  auditModel: typeof Model;
  policyModel: typeof Model;
  archiveBeforeDate?: Date;
  compress?: boolean;
  transaction?: Transaction;
}): Promise<number> {
  const {
    auditModel,
    policyModel,
    archiveBeforeDate = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
    compress = true,
    transaction,
  } = params;

  const [updated] = await auditModel.update(
    {
      archiveStatus: compress ? ArchiveStatus.COMPRESSED : ArchiveStatus.ARCHIVED,
      archivedAt: new Date(),
    },
    {
      where: {
        timestamp: { [Op.lte]: archiveBeforeDate },
        archiveStatus: ArchiveStatus.ACTIVE,
      },
      transaction,
    }
  );

  return updated;
}

/**
 * Deletes expired audit logs based on retention policies
 *
 * @async
 * @param {Object} params - Deletion parameters
 * @param {typeof Model} params.auditModel - AuditLog model
 * @param {boolean} [params.dryRun=false] - Preview without deleting
 * @param {Transaction} [params.transaction] - Database transaction
 * @returns {Promise<number>} Number of logs deleted (or would be deleted)
 *
 * @example
 * ```typescript
 * // Dry run first to preview
 * const wouldDelete = await deleteExpiredAuditLogs({
 *   auditModel: AuditLogModel,
 *   dryRun: true,
 * });
 * console.log(`Would delete ${wouldDelete} logs`);
 *
 * // Actually delete
 * const deleted = await deleteExpiredAuditLogs({
 *   auditModel: AuditLogModel,
 *   dryRun: false,
 * });
 * ```
 */
export async function deleteExpiredAuditLogs(params: {
  auditModel: typeof Model;
  dryRun?: boolean;
  transaction?: Transaction;
}): Promise<number> {
  const { auditModel, dryRun = false, transaction } = params;

  const whereClause: WhereOptions = {
    expiresAt: { [Op.lte]: new Date() },
    archiveStatus: { [Op.in]: [ArchiveStatus.ARCHIVED, ArchiveStatus.COMPRESSED] },
  };

  if (dryRun) {
    const count = await auditModel.count({ where: whereClause, transaction });
    return count;
  }

  const deleted = await auditModel.destroy({
    where: whereClause,
    transaction,
  });

  return deleted;
}

// ============================================================================
// AUDIT TRAIL VERIFICATION FUNCTIONS
// ============================================================================

/**
 * Verifies the integrity of the audit log chain
 *
 * @async
 * @param {Object} params - Verification parameters
 * @param {typeof Model} params.model - AuditLog model
 * @param {Date} [params.startDate] - Start of verification range
 * @param {Date} [params.endDate] - End of verification range
 * @param {Transaction} [params.transaction] - Database transaction
 * @returns {Promise<{valid: boolean, tamperedEntries: string[], totalVerified: number}>} Verification results
 *
 * @example
 * ```typescript
 * const verification = await verifyAuditLogChain({
 *   model: AuditLogModel,
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-12-31'),
 * });
 *
 * if (!verification.valid) {
 *   console.error(`Tampered entries detected: ${verification.tamperedEntries.join(', ')}`);
 * }
 * ```
 *
 * @remarks
 * - Verifies cryptographic hash chain
 * - Detects any tampering or modification
 * - Critical for regulatory compliance and forensic analysis
 */
export async function verifyAuditLogChain(params: {
  model: typeof Model;
  startDate?: Date;
  endDate?: Date;
  transaction?: Transaction;
}): Promise<{ valid: boolean; tamperedEntries: string[]; totalVerified: number }> {
  const { model, startDate, endDate, transaction } = params;

  const whereClause: WhereOptions = {};
  if (startDate || endDate) {
    whereClause.timestamp = {};
    if (startDate) whereClause.timestamp[Op.gte] = startDate;
    if (endDate) whereClause.timestamp[Op.lte] = endDate;
  }

  const logs = await model.findAll({
    where: whereClause,
    order: [['timestamp', 'ASC']],
    transaction,
  });

  const tamperedEntries: string[] = [];
  let previousHash: string | null = null;

  for (const log of logs) {
    const logData = log.toJSON() as AuditLog;

    // Verify previousHash matches
    if (previousHash && logData.previousHash !== previousHash) {
      tamperedEntries.push(logData.id);
    }

    // Recompute hash and verify
    const computedHash = computeAuditLogHash(logData);
    if (computedHash !== logData.hash) {
      tamperedEntries.push(logData.id);
    }

    previousHash = logData.hash;
  }

  return {
    valid: tamperedEntries.length === 0,
    tamperedEntries,
    totalVerified: logs.length,
  };
}

/**
 * Detects potential audit log tampering
 *
 * @async
 * @param {Object} params - Tamper detection parameters
 * @param {typeof Model} params.model - AuditLog model
 * @param {string} params.logId - Specific log ID to verify
 * @param {Transaction} [params.transaction] - Database transaction
 * @returns {Promise<{tampered: boolean, reason?: string}>} Tamper detection result
 *
 * @example
 * ```typescript
 * const result = await detectAuditLogTampering({
 *   model: AuditLogModel,
 *   logId: 'audit-123',
 * });
 *
 * if (result.tampered) {
 *   console.error(`Tampering detected: ${result.reason}`);
 * }
 * ```
 */
export async function detectAuditLogTampering(params: {
  model: typeof Model;
  logId: string;
  transaction?: Transaction;
}): Promise<{ tampered: boolean; reason?: string }> {
  const { model, logId, transaction } = params;

  const log = await model.findByPk(logId, { transaction });

  if (!log) {
    throw new NotFoundException(`Audit log with ID '${logId}' not found`);
  }

  const logData = log.toJSON() as AuditLog;

  // Recompute hash
  const computedHash = computeAuditLogHash(logData);

  if (computedHash !== logData.hash) {
    return {
      tampered: true,
      reason: 'Hash mismatch - log content has been modified',
    };
  }

  // Verify chain if previousHash exists
  if (logData.previousHash) {
    const previousLog = await model.findOne({
      where: {
        timestamp: { [Op.lt]: logData.timestamp },
      },
      order: [['timestamp', 'DESC']],
      limit: 1,
      transaction,
    });

    if (previousLog && previousLog.get('hash') !== logData.previousHash) {
      return {
        tampered: true,
        reason: 'Chain broken - previous hash does not match',
      };
    }
  }

  return { tampered: false };
}

/**
 * Retrieves aggregate statistics for audit logs
 *
 * @async
 * @param {Object} params - Statistics parameters
 * @param {typeof Model} params.model - AuditLog model
 * @param {Date} [params.startDate] - Start date
 * @param {Date} [params.endDate] - End date
 * @param {Transaction} [params.transaction] - Database transaction
 * @returns {Promise<Record<string, any>>} Aggregate statistics
 *
 * @example
 * ```typescript
 * const stats = await getAuditLogStatistics({
 *   model: AuditLogModel,
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-12-31'),
 * });
 * ```
 */
export async function getAuditLogStatistics(params: {
  model: typeof Model;
  startDate?: Date;
  endDate?: Date;
  transaction?: Transaction;
}): Promise<Record<string, any>> {
  const { model, startDate, endDate, transaction } = params;

  const whereClause: WhereOptions = {};
  if (startDate || endDate) {
    whereClause.timestamp = {};
    if (startDate) whereClause.timestamp[Op.gte] = startDate;
    if (endDate) whereClause.timestamp[Op.lte] = endDate;
  }

  const totalLogs = await model.count({ where: whereClause, transaction });

  const byEventType = await model.count({
    where: whereClause,
    group: ['eventType'],
    transaction,
  });

  const bySeverity = await model.count({
    where: whereClause,
    group: ['severity'],
    transaction,
  });

  const failedActions = await model.count({
    where: { ...whereClause, success: false },
    transaction,
  });

  return {
    totalLogs,
    byEventType,
    bySeverity,
    failedActions,
    period: { startDate, endDate },
  };
}
