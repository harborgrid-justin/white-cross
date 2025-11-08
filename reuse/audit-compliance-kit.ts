/**
 * LOC: AUDCOMP1234567
 * File: /reuse/audit-compliance-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - NestJS audit services
 *   - Compliance reporting modules
 *   - GDPR compliance services
 *   - HIPAA audit logging
 *   - Activity tracking services
 */

/**
 * File: /reuse/audit-compliance-kit.ts
 * Locator: WC-UTL-AUDCOMP-001
 * Purpose: Comprehensive Audit & Compliance Kit - Complete audit logging and compliance toolkit for NestJS
 *
 * Upstream: Independent utility module for audit and compliance operations
 * Downstream: ../backend/*, Audit services, Compliance modules, Security services
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, Sequelize, crypto
 * Exports: 40+ utility functions for activity tracking, data retention, GDPR helpers, audit trails, compliance reports
 *
 * LLM Context: Enterprise-grade audit and compliance utilities for White Cross healthcare platform.
 * Provides comprehensive HIPAA-compliant audit logging, activity tracking, data retention policies,
 * GDPR compliance (right to access, erasure, portability), audit trail generation, compliance reports,
 * consent management, data anonymization, breach detection, access control logging, and regulatory reporting.
 */

import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Model, DataTypes, Sequelize } from 'sequelize';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as crypto from 'crypto';
import { z } from 'zod';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface AuditLogEntry {
  id?: string;
  userId?: string;
  action: string;
  resource: string;
  resourceId?: string;
  resourceType?: string;
  oldValue?: any;
  newValue?: any;
  ipAddress?: string;
  userAgent?: string;
  requestId?: string;
  sessionId?: string;
  outcome: 'success' | 'failure' | 'partial';
  errorMessage?: string;
  metadata?: Record<string, any>;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

interface ComplianceConfig {
  gdprEnabled: boolean;
  hipaaEnabled: boolean;
  dataRetentionDays: number;
  anonymizationDelay: number;
  auditLogRetentionDays: number;
  consentRequired: boolean;
}

interface DataRetentionPolicy {
  resourceType: string;
  retentionPeriodDays: number;
  archiveBeforeDelete: boolean;
  anonymizeBeforeDelete: boolean;
  legalHoldExempt: boolean;
}

interface GDPRRequest {
  type: 'access' | 'erasure' | 'portability' | 'rectification' | 'restriction';
  userId: string;
  requestedBy: string;
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  reason?: string;
  requestedAt: Date;
  completedAt?: Date;
}

interface ConsentRecord {
  userId: string;
  consentType: string;
  purpose: string;
  granted: boolean;
  grantedAt?: Date;
  revokedAt?: Date;
  version: string;
  metadata?: Record<string, any>;
}

interface AccessControlLog {
  userId: string;
  resource: string;
  action: string;
  granted: boolean;
  reason?: string;
  context?: Record<string, any>;
  timestamp: Date;
}

interface BreachDetectionRule {
  name: string;
  description: string;
  pattern: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  enabled: boolean;
  alertThreshold: number;
}

interface ComplianceReport {
  reportType: string;
  startDate: Date;
  endDate: Date;
  generatedAt: Date;
  generatedBy: string;
  data: Record<string, any>;
  format: 'json' | 'csv' | 'pdf';
}

interface AnonymizationConfig {
  strategy: 'hash' | 'pseudonymize' | 'generalize' | 'suppress';
  fields: string[];
  preserveFormat?: boolean;
  salt?: string;
}

interface LegalHold {
  resourceType: string;
  resourceId: string;
  reason: string;
  initiatedBy: string;
  initiatedAt: Date;
  releasedAt?: Date;
  status: 'active' | 'released';
}

// ============================================================================
// SEQUELIZE MODELS (1-3)
// ============================================================================

/**
 * Sequelize model for Audit Logs with comprehensive tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} AuditLog model
 *
 * @example
 * const AuditLog = defineAuditLogModel(sequelize);
 * await AuditLog.create({
 *   userId: 'user-123',
 *   action: 'UPDATE',
 *   resource: 'patient',
 *   resourceId: 'patient-456',
 *   outcome: 'success'
 * });
 */
export function defineAuditLogModel(sequelize: Sequelize): typeof Model {
  class AuditLog extends Model {
    public id!: string;
    public userId!: string;
    public userName!: string;
    public action!: string;
    public resource!: string;
    public resourceId!: string;
    public resourceType!: string;
    public oldValue!: Record<string, any>;
    public newValue!: Record<string, any>;
    public ipAddress!: string;
    public userAgent!: string;
    public requestId!: string;
    public sessionId!: string;
    public outcome!: 'success' | 'failure' | 'partial';
    public errorMessage!: string;
    public severity!: 'low' | 'medium' | 'high' | 'critical';
    public metadata!: Record<string, any>;
    public createdAt!: Date;
  }

  AuditLog.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'user_id',
      },
      userName: {
        type: DataTypes.STRING(200),
        allowNull: true,
        field: 'user_name',
      },
      action: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'CREATE, READ, UPDATE, DELETE, LOGIN, LOGOUT, etc.',
      },
      resource: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      resourceId: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: 'resource_id',
      },
      resourceType: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: 'resource_type',
      },
      oldValue: {
        type: DataTypes.JSONB,
        allowNull: true,
        field: 'old_value',
      },
      newValue: {
        type: DataTypes.JSONB,
        allowNull: true,
        field: 'new_value',
      },
      ipAddress: {
        type: DataTypes.STRING(45),
        allowNull: true,
        field: 'ip_address',
      },
      userAgent: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'user_agent',
      },
      requestId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'request_id',
      },
      sessionId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'session_id',
      },
      outcome: {
        type: DataTypes.ENUM('success', 'failure', 'partial'),
        allowNull: false,
        defaultValue: 'success',
      },
      errorMessage: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'error_message',
      },
      severity: {
        type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
        allowNull: false,
        defaultValue: 'low',
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'created_at',
      },
    },
    {
      sequelize,
      tableName: 'audit_logs',
      timestamps: false,
      indexes: [
        { fields: ['user_id'] },
        { fields: ['action'] },
        { fields: ['resource'] },
        { fields: ['resource_id'] },
        { fields: ['created_at'] },
        { fields: ['severity'] },
        { fields: ['outcome'] },
        { fields: ['session_id'] },
      ],
    }
  );

  return AuditLog;
}

/**
 * Sequelize model for GDPR Requests tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} GDPRRequest model
 *
 * @example
 * const GDPRRequest = defineGDPRRequestModel(sequelize);
 * await GDPRRequest.create({
 *   type: 'erasure',
 *   userId: 'user-123',
 *   requestedBy: 'user-123',
 *   status: 'pending'
 * });
 */
export function defineGDPRRequestModel(sequelize: Sequelize): typeof Model {
  class GDPRRequest extends Model {
    public id!: string;
    public type!: 'access' | 'erasure' | 'portability' | 'rectification' | 'restriction';
    public userId!: string;
    public requestedBy!: string;
    public status!: 'pending' | 'in_progress' | 'completed' | 'rejected';
    public reason!: string;
    public responseData!: Record<string, any>;
    public completedBy!: string;
    public requestedAt!: Date;
    public completedAt!: Date;
    public metadata!: Record<string, any>;
  }

  GDPRRequest.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      type: {
        type: DataTypes.ENUM('access', 'erasure', 'portability', 'rectification', 'restriction'),
        allowNull: false,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'user_id',
      },
      requestedBy: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'requested_by',
      },
      status: {
        type: DataTypes.ENUM('pending', 'in_progress', 'completed', 'rejected'),
        allowNull: false,
        defaultValue: 'pending',
      },
      reason: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      responseData: {
        type: DataTypes.JSONB,
        allowNull: true,
        field: 'response_data',
      },
      completedBy: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'completed_by',
      },
      requestedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'requested_at',
      },
      completedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'completed_at',
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
      },
    },
    {
      sequelize,
      tableName: 'gdpr_requests',
      timestamps: false,
      indexes: [
        { fields: ['user_id'] },
        { fields: ['type'] },
        { fields: ['status'] },
        { fields: ['requested_at'] },
      ],
    }
  );

  return GDPRRequest;
}

/**
 * Sequelize model for Consent Management.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ConsentRecord model
 *
 * @example
 * const ConsentRecord = defineConsentRecordModel(sequelize);
 * await ConsentRecord.create({
 *   userId: 'user-123',
 *   consentType: 'data_processing',
 *   purpose: 'Healthcare analytics',
 *   granted: true,
 *   version: '1.0'
 * });
 */
export function defineConsentRecordModel(sequelize: Sequelize): typeof Model {
  class ConsentRecord extends Model {
    public id!: string;
    public userId!: string;
    public consentType!: string;
    public purpose!: string;
    public granted!: boolean;
    public grantedAt!: Date;
    public revokedAt!: Date;
    public version!: string;
    public ipAddress!: string;
    public userAgent!: string;
    public metadata!: Record<string, any>;
    public createdAt!: Date;
    public updatedAt!: Date;
  }

  ConsentRecord.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'user_id',
      },
      consentType: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'consent_type',
      },
      purpose: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      granted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      grantedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'granted_at',
      },
      revokedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'revoked_at',
      },
      version: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      ipAddress: {
        type: DataTypes.STRING(45),
        allowNull: true,
        field: 'ip_address',
      },
      userAgent: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'user_agent',
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'created_at',
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'updated_at',
      },
    },
    {
      sequelize,
      tableName: 'consent_records',
      timestamps: true,
      indexes: [
        { fields: ['user_id'] },
        { fields: ['consent_type'] },
        { fields: ['granted'] },
        { fields: ['granted_at'] },
        { fields: ['revoked_at'] },
      ],
    }
  );

  return ConsentRecord;
}

// ============================================================================
// ZOD SCHEMAS (4-6)
// ============================================================================

/**
 * Zod schema for audit log entry validation.
 */
export const auditLogSchema = z.object({
  userId: z.string().uuid().optional(),
  action: z.string().min(1).max(100),
  resource: z.string().min(1).max(100),
  resourceId: z.string().max(100).optional(),
  outcome: z.enum(['success', 'failure', 'partial']),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  metadata: z.record(z.any()).optional(),
});

/**
 * Zod schema for GDPR request validation.
 */
export const gdprRequestSchema = z.object({
  type: z.enum(['access', 'erasure', 'portability', 'rectification', 'restriction']),
  userId: z.string().uuid(),
  requestedBy: z.string().uuid(),
  reason: z.string().optional(),
});

/**
 * Zod schema for consent record validation.
 */
export const consentRecordSchema = z.object({
  userId: z.string().uuid(),
  consentType: z.string().min(1).max(100),
  purpose: z.string().min(1),
  granted: z.boolean(),
  version: z.string().min(1).max(20),
});

/**
 * Zod schema for data retention policy validation.
 */
export const dataRetentionPolicySchema = z.object({
  resourceType: z.string().min(1).max(100),
  retentionPeriodDays: z.number().min(1).max(7300),
  archiveBeforeDelete: z.boolean(),
  anonymizeBeforeDelete: z.boolean(),
  legalHoldExempt: z.boolean(),
});

/**
 * Zod schema for compliance report configuration.
 */
export const complianceReportSchema = z.object({
  reportType: z.string().min(1).max(100),
  startDate: z.date(),
  endDate: z.date(),
  format: z.enum(['json', 'csv', 'pdf']),
});

// ============================================================================
// AUDIT LOGGING UTILITIES (7-12)
// ============================================================================

/**
 * Creates audit log entry with comprehensive tracking.
 *
 * @param {typeof Model} auditModel - Audit log model
 * @param {AuditLogEntry} entry - Audit log entry
 * @returns {Promise<any>} Created audit log
 *
 * @example
 * await createAuditLog(AuditLog, {
 *   userId: 'user-123',
 *   action: 'UPDATE',
 *   resource: 'patient',
 *   resourceId: 'patient-456',
 *   outcome: 'success',
 *   severity: 'medium',
 *   timestamp: new Date()
 * });
 */
export async function createAuditLog(
  auditModel: typeof Model,
  entry: AuditLogEntry
): Promise<any> {
  return await auditModel.create({
    userId: entry.userId,
    action: entry.action,
    resource: entry.resource,
    resourceId: entry.resourceId,
    resourceType: entry.resourceType,
    oldValue: entry.oldValue,
    newValue: entry.newValue,
    ipAddress: entry.ipAddress,
    userAgent: entry.userAgent,
    requestId: entry.requestId,
    sessionId: entry.sessionId,
    outcome: entry.outcome,
    errorMessage: entry.errorMessage,
    severity: entry.severity,
    metadata: entry.metadata || {},
  });
}

/**
 * Queries audit logs with filtering and pagination.
 *
 * @param {typeof Model} auditModel - Audit log model
 * @param {Record<string, any>} filters - Query filters
 * @param {number} limit - Result limit
 * @param {number} offset - Result offset
 * @returns {Promise<{rows: any[], count: number}>} Audit logs
 *
 * @example
 * const logs = await queryAuditLogs(AuditLog, {
 *   userId: 'user-123',
 *   action: 'UPDATE',
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-12-31')
 * }, 100, 0);
 */
export async function queryAuditLogs(
  auditModel: typeof Model,
  filters: Record<string, any>,
  limit: number = 100,
  offset: number = 0
): Promise<{ rows: any[]; count: number }> {
  const where: Record<string, any> = {};

  if (filters.userId) where.userId = filters.userId;
  if (filters.action) where.action = filters.action;
  if (filters.resource) where.resource = filters.resource;
  if (filters.resourceId) where.resourceId = filters.resourceId;
  if (filters.outcome) where.outcome = filters.outcome;
  if (filters.severity) where.severity = filters.severity;

  if (filters.startDate || filters.endDate) {
    where.createdAt = {};
    if (filters.startDate) where.createdAt[Sequelize.Op.gte] = filters.startDate;
    if (filters.endDate) where.createdAt[Sequelize.Op.lte] = filters.endDate;
  }

  return await auditModel.findAndCountAll({
    where,
    limit,
    offset,
    order: [['createdAt', 'DESC']],
  });
}

/**
 * Tracks data access for HIPAA compliance.
 *
 * @param {typeof Model} auditModel - Audit log model
 * @param {string} userId - User ID
 * @param {string} resourceType - Resource type (patient, medical_record)
 * @param {string} resourceId - Resource ID
 * @param {string} action - Action performed
 * @param {Record<string, any>} context - Additional context
 * @returns {Promise<any>} Audit log entry
 *
 * @example
 * await trackDataAccess(AuditLog, 'user-123', 'patient', 'patient-456', 'READ', {
 *   ipAddress: '192.168.1.1'
 * });
 */
export async function trackDataAccess(
  auditModel: typeof Model,
  userId: string,
  resourceType: string,
  resourceId: string,
  action: string,
  context: Record<string, any> = {}
): Promise<any> {
  return await createAuditLog(auditModel, {
    userId,
    action,
    resource: resourceType,
    resourceId,
    resourceType,
    outcome: 'success',
    severity: action === 'READ' ? 'low' : 'medium',
    ipAddress: context.ipAddress,
    userAgent: context.userAgent,
    requestId: context.requestId,
    sessionId: context.sessionId,
    metadata: context.metadata,
    timestamp: new Date(),
  });
}

/**
 * Logs security events (login, logout, failed attempts).
 *
 * @param {typeof Model} auditModel - Audit log model
 * @param {string} userId - User ID
 * @param {string} event - Security event type
 * @param {boolean} success - Whether event succeeded
 * @param {Record<string, any>} context - Additional context
 * @returns {Promise<any>} Audit log entry
 *
 * @example
 * await logSecurityEvent(AuditLog, 'user-123', 'LOGIN', true, {
 *   ipAddress: '192.168.1.1'
 * });
 */
export async function logSecurityEvent(
  auditModel: typeof Model,
  userId: string,
  event: string,
  success: boolean,
  context: Record<string, any> = {}
): Promise<any> {
  return await createAuditLog(auditModel, {
    userId,
    action: event,
    resource: 'authentication',
    outcome: success ? 'success' : 'failure',
    severity: success ? 'low' : 'high',
    errorMessage: context.errorMessage,
    ipAddress: context.ipAddress,
    userAgent: context.userAgent,
    metadata: context.metadata,
    timestamp: new Date(),
  });
}

/**
 * Generates audit trail for a specific resource.
 *
 * @param {typeof Model} auditModel - Audit log model
 * @param {string} resourceType - Resource type
 * @param {string} resourceId - Resource ID
 * @returns {Promise<any[]>} Audit trail
 *
 * @example
 * const trail = await generateAuditTrail(AuditLog, 'patient', 'patient-456');
 */
export async function generateAuditTrail(
  auditModel: typeof Model,
  resourceType: string,
  resourceId: string
): Promise<any[]> {
  return await auditModel.findAll({
    where: {
      resource: resourceType,
      resourceId,
    },
    order: [['createdAt', 'ASC']],
  });
}

/**
 * Exports audit logs to CSV format.
 *
 * @param {typeof Model} auditModel - Audit log model
 * @param {Record<string, any>} filters - Query filters
 * @returns {Promise<string>} CSV content
 *
 * @example
 * const csv = await exportAuditLogsToCSV(AuditLog, {
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-12-31')
 * });
 */
export async function exportAuditLogsToCSV(
  auditModel: typeof Model,
  filters: Record<string, any>
): Promise<string> {
  const { rows } = await queryAuditLogs(auditModel, filters, 10000, 0);

  const headers = [
    'ID',
    'User ID',
    'Action',
    'Resource',
    'Resource ID',
    'Outcome',
    'Severity',
    'IP Address',
    'Timestamp',
  ];

  const csvRows = [headers.join(',')];

  for (const log of rows) {
    const row = [
      log.get('id'),
      log.get('userId') || '',
      log.get('action'),
      log.get('resource'),
      log.get('resourceId') || '',
      log.get('outcome'),
      log.get('severity'),
      log.get('ipAddress') || '',
      log.get('createdAt'),
    ];
    csvRows.push(row.map(v => `"${v}"`).join(','));
  }

  return csvRows.join('\n');
}

// ============================================================================
// GDPR COMPLIANCE UTILITIES (13-18)
// ============================================================================

/**
 * Processes GDPR data access request (right to access).
 *
 * @param {typeof Model} gdprModel - GDPR request model
 * @param {string} userId - User ID
 * @param {string} requestedBy - Requester ID
 * @param {() => Promise<any>} dataCollector - Function to collect user data
 * @returns {Promise<any>} GDPR request record
 *
 * @example
 * const request = await processDataAccessRequest(GDPRRequest, 'user-123', 'user-123', async () => {
 *   return await collectAllUserData('user-123');
 * });
 */
export async function processDataAccessRequest(
  gdprModel: typeof Model,
  userId: string,
  requestedBy: string,
  dataCollector: () => Promise<any>
): Promise<any> {
  const request = await gdprModel.create({
    type: 'access',
    userId,
    requestedBy,
    status: 'in_progress',
  });

  try {
    const userData = await dataCollector();

    await request.update({
      status: 'completed',
      responseData: userData,
      completedAt: new Date(),
    });

    return request;
  } catch (error) {
    await request.update({
      status: 'rejected',
      reason: (error as Error).message,
    });
    throw error;
  }
}

/**
 * Processes GDPR data erasure request (right to be forgotten).
 *
 * @param {typeof Model} gdprModel - GDPR request model
 * @param {string} userId - User ID
 * @param {string} requestedBy - Requester ID
 * @param {() => Promise<void>} dataEraser - Function to erase user data
 * @returns {Promise<any>} GDPR request record
 *
 * @example
 * const request = await processDataErasureRequest(GDPRRequest, 'user-123', 'user-123', async () => {
 *   await eraseAllUserData('user-123');
 * });
 */
export async function processDataErasureRequest(
  gdprModel: typeof Model,
  userId: string,
  requestedBy: string,
  dataEraser: () => Promise<void>
): Promise<any> {
  const request = await gdprModel.create({
    type: 'erasure',
    userId,
    requestedBy,
    status: 'in_progress',
  });

  try {
    await dataEraser();

    await request.update({
      status: 'completed',
      completedAt: new Date(),
    });

    return request;
  } catch (error) {
    await request.update({
      status: 'rejected',
      reason: (error as Error).message,
    });
    throw error;
  }
}

/**
 * Processes GDPR data portability request.
 *
 * @param {typeof Model} gdprModel - GDPR request model
 * @param {string} userId - User ID
 * @param {string} requestedBy - Requester ID
 * @param {() => Promise<any>} dataExporter - Function to export user data
 * @param {string} format - Export format
 * @returns {Promise<any>} GDPR request record
 *
 * @example
 * const request = await processDataPortabilityRequest(GDPRRequest, 'user-123', 'user-123', async () => {
 *   return await exportUserData('user-123');
 * }, 'json');
 */
export async function processDataPortabilityRequest(
  gdprModel: typeof Model,
  userId: string,
  requestedBy: string,
  dataExporter: () => Promise<any>,
  format: string = 'json'
): Promise<any> {
  const request = await gdprModel.create({
    type: 'portability',
    userId,
    requestedBy,
    status: 'in_progress',
    metadata: { format },
  });

  try {
    const exportedData = await dataExporter();

    await request.update({
      status: 'completed',
      responseData: exportedData,
      completedAt: new Date(),
    });

    return request;
  } catch (error) {
    await request.update({
      status: 'rejected',
      reason: (error as Error).message,
    });
    throw error;
  }
}

/**
 * Anonymizes user data while preserving analytics capability.
 *
 * @param {Record<string, any>} userData - User data to anonymize
 * @param {AnonymizationConfig} config - Anonymization configuration
 * @returns {Record<string, any>} Anonymized data
 *
 * @example
 * const anonymized = anonymizeUserData(userData, {
 *   strategy: 'hash',
 *   fields: ['email', 'phone'],
 *   salt: 'random-salt'
 * });
 */
export function anonymizeUserData(
  userData: Record<string, any>,
  config: AnonymizationConfig
): Record<string, any> {
  const anonymized = { ...userData };

  for (const field of config.fields) {
    if (anonymized[field] === undefined) continue;

    switch (config.strategy) {
      case 'hash':
        const hash = crypto
          .createHash('sha256')
          .update(anonymized[field] + (config.salt || ''))
          .digest('hex');
        anonymized[field] = hash;
        break;

      case 'pseudonymize':
        anonymized[field] = `anonymous_${crypto.randomBytes(8).toString('hex')}`;
        break;

      case 'generalize':
        if (field === 'age') {
          anonymized[field] = Math.floor(anonymized[field] / 10) * 10;
        } else if (field === 'zipCode') {
          anonymized[field] = anonymized[field].substring(0, 3) + '00';
        }
        break;

      case 'suppress':
        anonymized[field] = '[REDACTED]';
        break;
    }
  }

  return anonymized;
}

/**
 * Checks if user has active consent for specific purpose.
 *
 * @param {typeof Model} consentModel - Consent record model
 * @param {string} userId - User ID
 * @param {string} consentType - Consent type
 * @returns {Promise<boolean>} Consent status
 *
 * @example
 * const hasConsent = await checkUserConsent(ConsentRecord, 'user-123', 'data_processing');
 */
export async function checkUserConsent(
  consentModel: typeof Model,
  userId: string,
  consentType: string
): Promise<boolean> {
  const consent = await consentModel.findOne({
    where: {
      userId,
      consentType,
      granted: true,
      revokedAt: null,
    },
    order: [['grantedAt', 'DESC']],
  });

  return !!consent;
}

/**
 * Records user consent with version tracking.
 *
 * @param {typeof Model} consentModel - Consent record model
 * @param {ConsentRecord} consent - Consent record
 * @returns {Promise<any>} Created consent record
 *
 * @example
 * await recordUserConsent(ConsentRecord, {
 *   userId: 'user-123',
 *   consentType: 'data_processing',
 *   purpose: 'Healthcare analytics',
 *   granted: true,
 *   version: '1.0'
 * });
 */
export async function recordUserConsent(
  consentModel: typeof Model,
  consent: ConsentRecord
): Promise<any> {
  return await consentModel.create({
    userId: consent.userId,
    consentType: consent.consentType,
    purpose: consent.purpose,
    granted: consent.granted,
    grantedAt: consent.granted ? new Date() : null,
    version: consent.version,
    metadata: consent.metadata || {},
  });
}

// ============================================================================
// DATA RETENTION UTILITIES (19-23)
// ============================================================================

/**
 * Applies data retention policy to resources.
 *
 * @param {typeof Model} resourceModel - Resource model
 * @param {DataRetentionPolicy} policy - Retention policy
 * @param {(resource: any) => Promise<void>} archiver - Archive function
 * @returns {Promise<number>} Number of processed resources
 *
 * @example
 * const processed = await applyRetentionPolicy(Document, {
 *   resourceType: 'document',
 *   retentionPeriodDays: 365,
 *   archiveBeforeDelete: true,
 *   anonymizeBeforeDelete: false,
 *   legalHoldExempt: false
 * }, archiveDocument);
 */
export async function applyRetentionPolicy(
  resourceModel: typeof Model,
  policy: DataRetentionPolicy,
  archiver?: (resource: any) => Promise<void>
): Promise<number> {
  const cutoffDate = new Date(Date.now() - policy.retentionPeriodDays * 86400000);

  const resources = await resourceModel.findAll({
    where: {
      createdAt: {
        [Sequelize.Op.lte]: cutoffDate,
      },
    },
  });

  let processedCount = 0;

  for (const resource of resources) {
    try {
      if (policy.archiveBeforeDelete && archiver) {
        await archiver(resource);
      }

      if (policy.anonymizeBeforeDelete) {
        const anonymized = anonymizeUserData(resource.toJSON(), {
          strategy: 'hash',
          fields: ['email', 'phone', 'ssn'],
        });
        await resource.update(anonymized);
      } else {
        await resource.destroy();
      }

      processedCount++;
    } catch (error) {
      console.error(`Failed to process resource ${resource.get('id')}:`, error);
    }
  }

  return processedCount;
}

/**
 * Creates legal hold on data to prevent deletion.
 *
 * @param {typeof Model} holdModel - Legal hold model
 * @param {string} resourceType - Resource type
 * @param {string} resourceId - Resource ID
 * @param {string} reason - Hold reason
 * @param {string} initiatedBy - User who initiated hold
 * @returns {Promise<any>} Legal hold record
 *
 * @example
 * await createLegalHold(LegalHold, 'patient', 'patient-123', 'Litigation', 'admin-456');
 */
export async function createLegalHold(
  holdModel: typeof Model,
  resourceType: string,
  resourceId: string,
  reason: string,
  initiatedBy: string
): Promise<any> {
  return await holdModel.create({
    resourceType,
    resourceId,
    reason,
    initiatedBy,
    status: 'active',
  });
}

/**
 * Checks if resource is under legal hold.
 *
 * @param {typeof Model} holdModel - Legal hold model
 * @param {string} resourceType - Resource type
 * @param {string} resourceId - Resource ID
 * @returns {Promise<boolean>} Hold status
 *
 * @example
 * const onHold = await isUnderLegalHold(LegalHold, 'patient', 'patient-123');
 */
export async function isUnderLegalHold(
  holdModel: typeof Model,
  resourceType: string,
  resourceId: string
): Promise<boolean> {
  const hold = await holdModel.findOne({
    where: {
      resourceType,
      resourceId,
      status: 'active',
    },
  });

  return !!hold;
}

/**
 * Archives old data to cold storage.
 *
 * @param {typeof Model} resourceModel - Resource model
 * @param {number} daysOld - Archive resources older than this
 * @param {(resource: any) => Promise<void>} archiver - Archive function
 * @returns {Promise<number>} Number of archived resources
 *
 * @example
 * const archived = await archiveOldData(Document, 365, async (doc) => {
 *   await uploadToGlacier(doc);
 * });
 */
export async function archiveOldData(
  resourceModel: typeof Model,
  daysOld: number,
  archiver: (resource: any) => Promise<void>
): Promise<number> {
  const cutoffDate = new Date(Date.now() - daysOld * 86400000);

  const resources = await resourceModel.findAll({
    where: {
      createdAt: {
        [Sequelize.Op.lte]: cutoffDate,
      },
      archived: false,
    },
  });

  let archivedCount = 0;

  for (const resource of resources) {
    try {
      await archiver(resource);
      await resource.update({ archived: true, archivedAt: new Date() });
      archivedCount++;
    } catch (error) {
      console.error(`Failed to archive resource ${resource.get('id')}:`, error);
    }
  }

  return archivedCount;
}

/**
 * Purges expired audit logs based on retention policy.
 *
 * @param {typeof Model} auditModel - Audit log model
 * @param {number} retentionDays - Retention period in days
 * @returns {Promise<number>} Number of purged logs
 *
 * @example
 * const purged = await purgeExpiredAuditLogs(AuditLog, 2555); // 7 years HIPAA
 */
export async function purgeExpiredAuditLogs(
  auditModel: typeof Model,
  retentionDays: number
): Promise<number> {
  const cutoffDate = new Date(Date.now() - retentionDays * 86400000);

  const result = await auditModel.destroy({
    where: {
      createdAt: {
        [Sequelize.Op.lte]: cutoffDate,
      },
    },
  });

  return result;
}

// ============================================================================
// COMPLIANCE REPORTING UTILITIES (24-28)
// ============================================================================

/**
 * Generates HIPAA compliance report.
 *
 * @param {typeof Model} auditModel - Audit log model
 * @param {Date} startDate - Report start date
 * @param {Date} endDate - Report end date
 * @returns {Promise<ComplianceReport>} Compliance report
 *
 * @example
 * const report = await generateHIPAAReport(AuditLog, new Date('2024-01-01'), new Date('2024-12-31'));
 */
export async function generateHIPAAReport(
  auditModel: typeof Model,
  startDate: Date,
  endDate: Date
): Promise<ComplianceReport> {
  const accessLogs = await auditModel.count({
    where: {
      action: 'READ',
      resource: 'patient',
      createdAt: {
        [Sequelize.Op.between]: [startDate, endDate],
      },
    },
  });

  const modifications = await auditModel.count({
    where: {
      action: {
        [Sequelize.Op.in]: ['CREATE', 'UPDATE', 'DELETE'],
      },
      resource: 'patient',
      createdAt: {
        [Sequelize.Op.between]: [startDate, endDate],
      },
    },
  });

  const securityEvents = await auditModel.count({
    where: {
      resource: 'authentication',
      outcome: 'failure',
      createdAt: {
        [Sequelize.Op.between]: [startDate, endDate],
      },
    },
  });

  return {
    reportType: 'HIPAA',
    startDate,
    endDate,
    generatedAt: new Date(),
    generatedBy: 'system',
    format: 'json',
    data: {
      totalAccessLogs: accessLogs,
      totalModifications: modifications,
      securityIncidents: securityEvents,
      period: `${startDate.toISOString()} to ${endDate.toISOString()}`,
    },
  };
}

/**
 * Generates GDPR compliance report.
 *
 * @param {typeof Model} gdprModel - GDPR request model
 * @param {typeof Model} consentModel - Consent record model
 * @param {Date} startDate - Report start date
 * @param {Date} endDate - Report end date
 * @returns {Promise<ComplianceReport>} Compliance report
 *
 * @example
 * const report = await generateGDPRReport(GDPRRequest, ConsentRecord, startDate, endDate);
 */
export async function generateGDPRReport(
  gdprModel: typeof Model,
  consentModel: typeof Model,
  startDate: Date,
  endDate: Date
): Promise<ComplianceReport> {
  const requests = await gdprModel.findAll({
    where: {
      requestedAt: {
        [Sequelize.Op.between]: [startDate, endDate],
      },
    },
  });

  const requestsByType = requests.reduce((acc, req) => {
    const type = req.get('type') as string;
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const consents = await consentModel.count({
    where: {
      createdAt: {
        [Sequelize.Op.between]: [startDate, endDate],
      },
      granted: true,
    },
  });

  return {
    reportType: 'GDPR',
    startDate,
    endDate,
    generatedAt: new Date(),
    generatedBy: 'system',
    format: 'json',
    data: {
      totalRequests: requests.length,
      requestsByType,
      consentsGranted: consents,
      period: `${startDate.toISOString()} to ${endDate.toISOString()}`,
    },
  };
}

/**
 * Generates user activity report.
 *
 * @param {typeof Model} auditModel - Audit log model
 * @param {string} userId - User ID
 * @param {Date} startDate - Report start date
 * @param {Date} endDate - Report end date
 * @returns {Promise<Record<string, any>>} Activity report
 *
 * @example
 * const report = await generateUserActivityReport(AuditLog, 'user-123', startDate, endDate);
 */
export async function generateUserActivityReport(
  auditModel: typeof Model,
  userId: string,
  startDate: Date,
  endDate: Date
): Promise<Record<string, any>> {
  const activities = await auditModel.findAll({
    where: {
      userId,
      createdAt: {
        [Sequelize.Op.between]: [startDate, endDate],
      },
    },
    order: [['createdAt', 'DESC']],
  });

  const actionCounts = activities.reduce((acc, activity) => {
    const action = activity.get('action') as string;
    acc[action] = (acc[action] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    userId,
    period: `${startDate.toISOString()} to ${endDate.toISOString()}`,
    totalActivities: activities.length,
    actionCounts,
    activities: activities.slice(0, 100),
  };
}

/**
 * Detects suspicious activity patterns.
 *
 * @param {typeof Model} auditModel - Audit log model
 * @param {string} userId - User ID
 * @param {number} hours - Hours to analyze
 * @returns {Promise<Array<{pattern: string, count: number, severity: string}>>} Detected patterns
 *
 * @example
 * const patterns = await detectSuspiciousActivity(AuditLog, 'user-123', 24);
 */
export async function detectSuspiciousActivity(
  auditModel: typeof Model,
  userId: string,
  hours: number = 24
): Promise<Array<{ pattern: string; count: number; severity: string }>> {
  const startDate = new Date(Date.now() - hours * 3600000);
  const patterns: Array<{ pattern: string; count: number; severity: string }> = [];

  // Failed login attempts
  const failedLogins = await auditModel.count({
    where: {
      userId,
      action: 'LOGIN',
      outcome: 'failure',
      createdAt: {
        [Sequelize.Op.gte]: startDate,
      },
    },
  });

  if (failedLogins > 5) {
    patterns.push({
      pattern: 'Multiple failed login attempts',
      count: failedLogins,
      severity: 'high',
    });
  }

  // Excessive data access
  const dataAccess = await auditModel.count({
    where: {
      userId,
      action: 'READ',
      createdAt: {
        [Sequelize.Op.gte]: startDate,
      },
    },
  });

  if (dataAccess > 1000) {
    patterns.push({
      pattern: 'Excessive data access',
      count: dataAccess,
      severity: 'medium',
    });
  }

  // After-hours access
  const afterHours = await auditModel.count({
    where: {
      userId,
      createdAt: {
        [Sequelize.Op.gte]: startDate,
      },
    },
  });

  const now = new Date();
  const hour = now.getHours();
  if ((hour < 6 || hour > 22) && afterHours > 10) {
    patterns.push({
      pattern: 'Unusual after-hours access',
      count: afterHours,
      severity: 'medium',
    });
  }

  return patterns;
}

/**
 * Generates data breach impact assessment.
 *
 * @param {typeof Model} auditModel - Audit log model
 * @param {string} resourceType - Affected resource type
 * @param {string[]} resourceIds - Affected resource IDs
 * @param {Date} breachDate - Breach date
 * @returns {Promise<Record<string, any>>} Impact assessment
 *
 * @example
 * const assessment = await generateBreachAssessment(AuditLog, 'patient', ['p1', 'p2'], new Date());
 */
export async function generateBreachAssessment(
  auditModel: typeof Model,
  resourceType: string,
  resourceIds: string[],
  breachDate: Date
): Promise<Record<string, any>> {
  const accessLogs = await auditModel.findAll({
    where: {
      resource: resourceType,
      resourceId: {
        [Sequelize.Op.in]: resourceIds,
      },
      createdAt: {
        [Sequelize.Op.gte]: breachDate,
      },
    },
  });

  const affectedUsers = new Set(accessLogs.map(log => log.get('userId')));

  return {
    resourceType,
    affectedResourceCount: resourceIds.length,
    affectedUserCount: affectedUsers.size,
    totalAccessAttempts: accessLogs.length,
    breachDate: breachDate.toISOString(),
    assessmentDate: new Date().toISOString(),
    severity: resourceIds.length > 100 ? 'critical' : 'high',
  };
}

// ============================================================================
// ACCESS CONTROL LOGGING (29-32)
// ============================================================================

/**
 * Logs access control decision.
 *
 * @param {typeof Model} auditModel - Audit log model
 * @param {AccessControlLog} accessLog - Access control log
 * @returns {Promise<any>} Audit log entry
 *
 * @example
 * await logAccessControl(AuditLog, {
 *   userId: 'user-123',
 *   resource: 'patient',
 *   action: 'READ',
 *   granted: true,
 *   timestamp: new Date()
 * });
 */
export async function logAccessControl(
  auditModel: typeof Model,
  accessLog: AccessControlLog
): Promise<any> {
  return await createAuditLog(auditModel, {
    userId: accessLog.userId,
    action: `ACCESS_${accessLog.action}`,
    resource: accessLog.resource,
    outcome: accessLog.granted ? 'success' : 'failure',
    severity: accessLog.granted ? 'low' : 'medium',
    errorMessage: accessLog.granted ? undefined : accessLog.reason,
    metadata: accessLog.context,
    timestamp: accessLog.timestamp,
  });
}

/**
 * Tracks permission changes.
 *
 * @param {typeof Model} auditModel - Audit log model
 * @param {string} userId - User whose permissions changed
 * @param {string} changedBy - User who made the change
 * @param {any} oldPermissions - Old permissions
 * @param {any} newPermissions - New permissions
 * @returns {Promise<any>} Audit log entry
 *
 * @example
 * await trackPermissionChange(AuditLog, 'user-123', 'admin-456', oldPerms, newPerms);
 */
export async function trackPermissionChange(
  auditModel: typeof Model,
  userId: string,
  changedBy: string,
  oldPermissions: any,
  newPermissions: any
): Promise<any> {
  return await createAuditLog(auditModel, {
    userId: changedBy,
    action: 'PERMISSION_CHANGE',
    resource: 'user_permissions',
    resourceId: userId,
    oldValue: oldPermissions,
    newValue: newPermissions,
    outcome: 'success',
    severity: 'high',
    timestamp: new Date(),
  });
}

/**
 * Logs role assignment changes.
 *
 * @param {typeof Model} auditModel - Audit log model
 * @param {string} userId - User whose role changed
 * @param {string} changedBy - User who made the change
 * @param {string[]} oldRoles - Old roles
 * @param {string[]} newRoles - New roles
 * @returns {Promise<any>} Audit log entry
 *
 * @example
 * await logRoleChange(AuditLog, 'user-123', 'admin-456', ['user'], ['user', 'admin']);
 */
export async function logRoleChange(
  auditModel: typeof Model,
  userId: string,
  changedBy: string,
  oldRoles: string[],
  newRoles: string[]
): Promise<any> {
  return await createAuditLog(auditModel, {
    userId: changedBy,
    action: 'ROLE_CHANGE',
    resource: 'user_roles',
    resourceId: userId,
    oldValue: { roles: oldRoles },
    newValue: { roles: newRoles },
    outcome: 'success',
    severity: 'high',
    timestamp: new Date(),
  });
}

/**
 * Generates access control report.
 *
 * @param {typeof Model} auditModel - Audit log model
 * @param {Date} startDate - Report start date
 * @param {Date} endDate - Report end date
 * @returns {Promise<Record<string, any>>} Access control report
 *
 * @example
 * const report = await generateAccessControlReport(AuditLog, startDate, endDate);
 */
export async function generateAccessControlReport(
  auditModel: typeof Model,
  startDate: Date,
  endDate: Date
): Promise<Record<string, any>> {
  const deniedAccess = await auditModel.count({
    where: {
      action: {
        [Sequelize.Op.like]: 'ACCESS_%',
      },
      outcome: 'failure',
      createdAt: {
        [Sequelize.Op.between]: [startDate, endDate],
      },
    },
  });

  const grantedAccess = await auditModel.count({
    where: {
      action: {
        [Sequelize.Op.like]: 'ACCESS_%',
      },
      outcome: 'success',
      createdAt: {
        [Sequelize.Op.between]: [startDate, endDate],
      },
    },
  });

  return {
    period: `${startDate.toISOString()} to ${endDate.toISOString()}`,
    grantedAccess,
    deniedAccess,
    totalAttempts: grantedAccess + deniedAccess,
    denialRate: deniedAccess / (grantedAccess + deniedAccess),
  };
}

// ============================================================================
// ADVANCED COMPLIANCE UTILITIES (33-40)
// ============================================================================

/**
 * Validates data minimization compliance.
 *
 * @param {Record<string, any>} data - Data to validate
 * @param {string[]} requiredFields - Required fields only
 * @returns {boolean} Validation result
 *
 * @example
 * const compliant = validateDataMinimization(userData, ['id', 'name', 'email']);
 */
export function validateDataMinimization(
  data: Record<string, any>,
  requiredFields: string[]
): boolean {
  const dataFields = Object.keys(data);
  const excessFields = dataFields.filter(field => !requiredFields.includes(field));

  if (excessFields.length > 0) {
    console.warn('Data minimization violation: excess fields', excessFields);
    return false;
  }

  return true;
}

/**
 * Tracks data processing activities (GDPR Article 30).
 *
 * @param {typeof Model} auditModel - Audit log model
 * @param {string} processingActivity - Activity description
 * @param {string} purpose - Processing purpose
 * @param {string} legalBasis - Legal basis
 * @param {string[]} dataCategories - Data categories
 * @param {string[]} recipients - Data recipients
 * @returns {Promise<any>} Processing record
 *
 * @example
 * await trackDataProcessing(AuditLog, 'Patient analytics', 'Healthcare improvement', 'Legitimate interest', ['health'], ['analysts']);
 */
export async function trackDataProcessing(
  auditModel: typeof Model,
  processingActivity: string,
  purpose: string,
  legalBasis: string,
  dataCategories: string[],
  recipients: string[]
): Promise<any> {
  return await createAuditLog(auditModel, {
    action: 'DATA_PROCESSING',
    resource: 'processing_activity',
    outcome: 'success',
    severity: 'low',
    metadata: {
      activity: processingActivity,
      purpose,
      legalBasis,
      dataCategories,
      recipients,
    },
    timestamp: new Date(),
  });
}

/**
 * Generates data protection impact assessment (DPIA).
 *
 * @param {string} processingActivity - Processing activity
 * @param {string[]} risks - Identified risks
 * @param {string[]} mitigations - Mitigation measures
 * @returns {Record<string, any>} DPIA report
 *
 * @example
 * const dpia = generateDPIA('AI analytics', ['bias'], ['regular audits']);
 */
export function generateDPIA(
  processingActivity: string,
  risks: string[],
  mitigations: string[]
): Record<string, any> {
  return {
    activity: processingActivity,
    assessmentDate: new Date().toISOString(),
    risks: risks.map(risk => ({
      description: risk,
      likelihood: 'medium',
      impact: 'high',
    })),
    mitigations: mitigations.map(mitigation => ({
      measure: mitigation,
      effectiveness: 'high',
    })),
    conclusion: risks.length <= mitigations.length ? 'acceptable' : 'requires_review',
  };
}

/**
 * Implements purpose limitation checks.
 *
 * @param {string} dataPurpose - Original data collection purpose
 * @param {string} usagePurpose - Current usage purpose
 * @returns {boolean} Compliance status
 *
 * @example
 * const compliant = checkPurposeLimitation('Treatment', 'Research');
 */
export function checkPurposeLimitation(dataPurpose: string, usagePurpose: string): boolean {
  const compatiblePurposes: Record<string, string[]> = {
    treatment: ['treatment', 'care_coordination'],
    research: ['research', 'analytics'],
    billing: ['billing', 'payment'],
  };

  const purpose = dataPurpose.toLowerCase();
  const usage = usagePurpose.toLowerCase();

  if (compatiblePurposes[purpose]?.includes(usage)) {
    return true;
  }

  console.warn(`Purpose limitation violation: ${dataPurpose} -> ${usagePurpose}`);
  return false;
}

/**
 * Tracks cross-border data transfers.
 *
 * @param {typeof Model} auditModel - Audit log model
 * @param {string} dataType - Type of data transferred
 * @param {string} sourceCountry - Source country
 * @param {string} destCountry - Destination country
 * @param {string} legalMechanism - Legal mechanism (adequacy, BCR, SCC)
 * @returns {Promise<any>} Transfer record
 *
 * @example
 * await trackCrossBorderTransfer(AuditLog, 'patient_data', 'US', 'EU', 'SCC');
 */
export async function trackCrossBorderTransfer(
  auditModel: typeof Model,
  dataType: string,
  sourceCountry: string,
  destCountry: string,
  legalMechanism: string
): Promise<any> {
  return await createAuditLog(auditModel, {
    action: 'CROSS_BORDER_TRANSFER',
    resource: 'data_transfer',
    outcome: 'success',
    severity: 'medium',
    metadata: {
      dataType,
      sourceCountry,
      destCountry,
      legalMechanism,
    },
    timestamp: new Date(),
  });
}

/**
 * Implements data accuracy verification.
 *
 * @param {Record<string, any>} data - Data to verify
 * @param {Date} lastUpdated - Last update date
 * @param {number} staleDays - Days before data is stale
 * @returns {boolean} Accuracy status
 *
 * @example
 * const accurate = verifyDataAccuracy(userData, lastUpdated, 90);
 */
export function verifyDataAccuracy(
  data: Record<string, any>,
  lastUpdated: Date,
  staleDays: number = 90
): boolean {
  const daysSinceUpdate = (Date.now() - lastUpdated.getTime()) / 86400000;

  if (daysSinceUpdate > staleDays) {
    console.warn(`Data may be stale: ${daysSinceUpdate} days old`);
    return false;
  }

  return true;
}

/**
 * Generates privacy notice template.
 *
 * @param {string} organization - Organization name
 * @param {string[]} purposes - Data processing purposes
 * @param {string[]} categories - Data categories
 * @returns {Record<string, any>} Privacy notice
 *
 * @example
 * const notice = generatePrivacyNotice('Hospital', ['Treatment'], ['Health data']);
 */
export function generatePrivacyNotice(
  organization: string,
  purposes: string[],
  categories: string[]
): Record<string, any> {
  return {
    organization,
    effectiveDate: new Date().toISOString(),
    purposes,
    dataCategories: categories,
    rights: [
      'Right to access',
      'Right to rectification',
      'Right to erasure',
      'Right to restrict processing',
      'Right to data portability',
      'Right to object',
    ],
    contact: `privacy@${organization.toLowerCase().replace(/\s/g, '')}.com`,
  };
}

/**
 * Implements storage limitation checks.
 *
 * @param {Date} dataCreatedAt - Data creation date
 * @param {number} retentionDays - Retention period
 * @returns {boolean} Should delete
 *
 * @example
 * const shouldDelete = checkStorageLimitation(createdAt, 365);
 */
export function checkStorageLimitation(dataCreatedAt: Date, retentionDays: number): boolean {
  const daysSinceCreation = (Date.now() - dataCreatedAt.getTime()) / 86400000;
  return daysSinceCreation > retentionDays;
}

// ============================================================================
// NESTJS INJECTABLE SERVICE & INTERCEPTOR
// ============================================================================

/**
 * NestJS Injectable Audit Service with comprehensive logging.
 *
 * @example
 * @Injectable()
 * export class UserService {
 *   constructor(private auditService: AuditService) {}
 *
 *   async updateUser(id: string, data: any) {
 *     await this.auditService.log('UPDATE', 'user', id, 'success');
 *     return this.userRepo.update(id, data);
 *   }
 * }
 */
@Injectable()
export class AuditService {
  constructor(
    @Inject('AUDIT_LOG_MODEL') private auditModel: typeof Model
  ) {}

  async log(
    action: string,
    resource: string,
    resourceId: string | undefined,
    outcome: 'success' | 'failure' | 'partial',
    metadata?: Record<string, any>
  ): Promise<any> {
    return createAuditLog(this.auditModel, {
      action,
      resource,
      resourceId,
      outcome,
      severity: 'low',
      metadata,
      timestamp: new Date(),
    });
  }

  async trackAccess(
    userId: string,
    resource: string,
    resourceId: string,
    context: Record<string, any>
  ): Promise<any> {
    return trackDataAccess(this.auditModel, userId, resource, resourceId, 'READ', context);
  }
}

/**
 * NestJS Audit Interceptor for automatic request logging.
 *
 * @example
 * @UseInterceptors(AuditInterceptor)
 * @Controller('patients')
 * export class PatientController {
 *   @Get(':id')
 *   getPatient(@Param('id') id: string) {
 *     return this.patientService.findOne(id);
 *   }
 * }
 */
@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private auditService: AuditService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, user, ip } = request;

    return next.handle().pipe(
      tap(async () => {
        await this.auditService.log(
          method,
          url,
          undefined,
          'success',
          { userId: user?.id, ipAddress: ip }
        );
      })
    );
  }
}
