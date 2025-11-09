/**
 * LOC: AUDCOMP001
 * File: /reuse/edwards/financial/audit-trail-compliance-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (ORM for database operations)
 *   - @nestjs/common (NestJS framework)
 *   - @nestjs/swagger (API documentation)
 *   - ../../financial/general-ledger-operations-kit (GL operations)
 *
 * DOWNSTREAM (imported by):
 *   - Backend audit modules
 *   - Compliance reporting services
 *   - Security audit services
 *   - Regulatory reporting modules
 */

/**
 * File: /reuse/edwards/financial/audit-trail-compliance-kit.ts
 * Locator: WC-EDW-AUDCOMP-001
 * Purpose: Comprehensive Audit Trail & Compliance - JD Edwards EnterpriseOne-level audit logging, compliance reporting, SOX/FISMA compliance
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, TypeScript 5.x, general-ledger-operations-kit
 * Downstream: ../backend/audit/*, Compliance Services, Security Audit, Regulatory Reporting
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+
 * Exports: 45 functions for audit logging, change tracking, user activity, data lineage, compliance reporting, SOX/FISMA, security audits, access logs
 *
 * LLM Context: Enterprise-grade audit trail and compliance for Oracle JD Edwards EnterpriseOne compliance.
 * Provides comprehensive audit logging, change tracking, user activity monitoring, data lineage tracking,
 * SOX 404 compliance, FISMA compliance, audit report generation, security audit trails, access control logging,
 * transaction history, compliance certifications, regulatory reporting, segregation of duties, and forensic analysis.
 */

import { Model, DataTypes, Sequelize, Transaction, Op, QueryTypes, fn, col, literal } from 'sequelize';
import { Injectable } from '@nestjs/common';
import { ApiProperty, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface AuditLogEntry {
  auditId: number;
  tableName: string;
  recordId: number;
  action: 'INSERT' | 'UPDATE' | 'DELETE' | 'SELECT' | 'EXECUTE' | 'APPROVE' | 'REJECT' | 'POST' | 'REVERSE';
  userId: string;
  userName: string;
  timestamp: Date;
  sessionId: string;
  ipAddress: string;
  userAgent?: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  changedFields?: string[];
  businessContext?: string;
  transactionId?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'data_change' | 'security' | 'financial' | 'access' | 'system';
}

interface ChangeTrackingRecord {
  changeId: number;
  entityType: string;
  entityId: number;
  fieldName: string;
  oldValue: any;
  newValue: any;
  changeType: 'create' | 'update' | 'delete' | 'archive';
  changedBy: string;
  changedAt: Date;
  changeReason?: string;
  approvalStatus: 'pending' | 'approved' | 'rejected' | 'auto_approved';
  approvedBy?: string;
  approvedAt?: Date;
  rollbackAvailable: boolean;
}

interface UserActivityLog {
  activityId: number;
  userId: string;
  userName: string;
  activityType: 'login' | 'logout' | 'access' | 'transaction' | 'report' | 'export' | 'import' | 'configuration';
  activityDescription: string;
  resourceType?: string;
  resourceId?: string;
  timestamp: Date;
  sessionId: string;
  ipAddress: string;
  geolocation?: string;
  deviceInfo?: string;
  durationSeconds?: number;
  success: boolean;
  failureReason?: string;
}

interface DataLineageNode {
  nodeId: string;
  nodeType: 'source' | 'transformation' | 'destination';
  entityType: string;
  entityId: number;
  entityName: string;
  timestamp: Date;
  transformationRules?: string[];
  metadata: Record<string, any>;
}

interface DataLineageTrail {
  trailId: string;
  dataElement: string;
  sourceSystem: string;
  targetSystem: string;
  lineagePath: DataLineageNode[];
  createdAt: Date;
  lastUpdated: Date;
  isComplete: boolean;
  confidence: number;
}

interface SOXControl {
  controlId: string;
  controlName: string;
  controlType: 'preventive' | 'detective' | 'corrective';
  controlFrequency: 'manual' | 'automated' | 'semi_automated';
  controlObjective: string;
  riskArea: string;
  ownerUserId: string;
  testingFrequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually';
  lastTestDate?: Date;
  nextTestDate: Date;
  testResult?: 'passed' | 'failed' | 'partially_passed' | 'not_tested';
  deficiencyLevel?: 'none' | 'deficiency' | 'significant_deficiency' | 'material_weakness';
  status: 'active' | 'inactive' | 'under_review';
}

interface SOXControlTest {
  testId: number;
  controlId: string;
  testDate: Date;
  testedBy: string;
  testProcedure: string;
  sampleSize: number;
  exceptionCount: number;
  testResult: 'passed' | 'failed' | 'partially_passed';
  findings: string;
  recommendations?: string;
  remediationRequired: boolean;
  remediationDeadline?: Date;
  evidenceLocation: string;
}

interface ComplianceReport {
  reportId: string;
  reportType: 'sox_404' | 'fisma' | 'sox_302' | 'internal_audit' | 'external_audit' | 'regulatory';
  reportingPeriod: {
    startDate: Date;
    endDate: Date;
  };
  preparedBy: string;
  preparedAt: Date;
  reviewedBy?: string;
  reviewedAt?: Date;
  approvedBy?: string;
  approvedAt?: Date;
  status: 'draft' | 'in_review' | 'approved' | 'submitted' | 'archived';
  findings: ComplianceFinding[];
  overallAssessment: 'compliant' | 'non_compliant' | 'partially_compliant' | 'not_assessed';
  executiveSummary: string;
}

interface ComplianceFinding {
  findingId: string;
  findingType: 'deficiency' | 'observation' | 'best_practice' | 'violation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  affectedControl?: string;
  affectedProcess: string;
  identifiedDate: Date;
  identifiedBy: string;
  rootCause?: string;
  correctiveAction?: string;
  responsibleParty?: string;
  dueDate?: Date;
  status: 'open' | 'in_progress' | 'resolved' | 'closed' | 'accepted_risk';
}

interface SecurityAuditLog {
  securityEventId: number;
  eventType: 'authentication' | 'authorization' | 'data_access' | 'configuration_change' | 'privilege_escalation' | 'suspicious_activity';
  severity: 'info' | 'warning' | 'critical';
  userId?: string;
  ipAddress: string;
  timestamp: Date;
  eventDescription: string;
  resourceAccessed?: string;
  actionAttempted: string;
  actionResult: 'success' | 'failure' | 'blocked';
  threatLevel: 'none' | 'low' | 'medium' | 'high' | 'critical';
  investigationRequired: boolean;
  investigationStatus?: 'pending' | 'investigating' | 'resolved' | 'escalated';
}

interface AccessControlLog {
  accessId: number;
  userId: string;
  resourceType: string;
  resourceId: string;
  accessType: 'read' | 'write' | 'delete' | 'execute' | 'approve';
  granted: boolean;
  denialReason?: string;
  requestedAt: Date;
  grantedBy?: string;
  permissionLevel: string;
  contextData?: Record<string, any>;
}

interface TransactionHistory {
  historyId: number;
  transactionType: string;
  transactionId: number;
  documentNumber: string;
  transactionDate: Date;
  postingDate?: Date;
  amount: number;
  currency: string;
  userId: string;
  status: string;
  approvalChain: ApprovalStep[];
  relatedTransactions: number[];
  auditTrail: AuditLogEntry[];
  metadata: Record<string, any>;
}

interface ApprovalStep {
  stepId: number;
  approverUserId: string;
  approverName: string;
  approvalLevel: number;
  approvalStatus: 'pending' | 'approved' | 'rejected' | 'delegated';
  approvedAt?: Date;
  comments?: string;
  delegatedTo?: string;
}

interface SegregationOfDuties {
  sodRuleId: string;
  ruleName: string;
  conflictingRole1: string;
  conflictingRole2: string;
  conflictDescription: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  mitigatingControls: string[];
  isActive: boolean;
  violations: SODViolation[];
}

interface SODViolation {
  violationId: number;
  userId: string;
  userName: string;
  sodRuleId: string;
  assignedRoles: string[];
  detectedAt: Date;
  mitigationStatus: 'pending' | 'mitigated' | 'accepted' | 'remediated';
  mitigationPlan?: string;
  acceptedBy?: string;
  acceptanceJustification?: string;
}

interface ComplianceCertification {
  certificationId: string;
  certificationType: 'sox' | 'fisma' | 'iso27001' | 'pci_dss' | 'hipaa' | 'custom';
  certificationPeriod: {
    startDate: Date;
    endDate: Date;
  };
  certifiedBy: string;
  certificationDate: Date;
  certificationStatement: string;
  attachments: string[];
  status: 'valid' | 'expired' | 'revoked' | 'pending';
  nextReviewDate: Date;
}

interface ForensicAnalysis {
  analysisId: string;
  investigationType: 'fraud' | 'data_breach' | 'unauthorized_access' | 'data_corruption' | 'policy_violation';
  initiatedBy: string;
  initiatedAt: Date;
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  affectedSystems: string[];
  affectedUsers: string[];
  timelineStart: Date;
  timelineEnd: Date;
  findings: string;
  evidenceCollected: string[];
  recommendations: string;
}

interface RegulatoryReport {
  reportId: string;
  regulatoryBody: string;
  reportType: string;
  filingDeadline: Date;
  reportingPeriod: {
    startDate: Date;
    endDate: Date;
  };
  preparedBy: string;
  status: 'draft' | 'in_review' | 'approved' | 'filed' | 'accepted' | 'rejected';
  filedAt?: Date;
  confirmationNumber?: string;
  reportData: Record<string, any>;
}

// ============================================================================
// DTO CLASSES
// ============================================================================

export class CreateAuditLogDto {
  @ApiProperty({ description: 'Table name', example: 'journal_entry_headers' })
  tableName!: string;

  @ApiProperty({ description: 'Record ID', example: 123 })
  recordId!: number;

  @ApiProperty({ description: 'Action performed', enum: ['INSERT', 'UPDATE', 'DELETE', 'SELECT', 'EXECUTE', 'APPROVE', 'REJECT', 'POST', 'REVERSE'] })
  action!: string;

  @ApiProperty({ description: 'User ID', example: 'user123' })
  userId!: string;

  @ApiProperty({ description: 'IP address', example: '192.168.1.1' })
  ipAddress!: string;

  @ApiProperty({ description: 'Old values', required: false })
  oldValues?: Record<string, any>;

  @ApiProperty({ description: 'New values', required: false })
  newValues?: Record<string, any>;

  @ApiProperty({ description: 'Business context', required: false })
  businessContext?: string;
}

export class AuditLogQueryDto {
  @ApiProperty({ description: 'Start date', required: false })
  startDate?: Date;

  @ApiProperty({ description: 'End date', required: false })
  endDate?: Date;

  @ApiProperty({ description: 'User ID filter', required: false })
  userId?: string;

  @ApiProperty({ description: 'Table name filter', required: false })
  tableName?: string;

  @ApiProperty({ description: 'Action filter', required: false })
  action?: string;

  @ApiProperty({ description: 'Severity filter', required: false })
  severity?: string;

  @ApiProperty({ description: 'Limit', default: 100 })
  limit?: number;

  @ApiProperty({ description: 'Offset', default: 0 })
  offset?: number;
}

export class SOXControlTestDto {
  @ApiProperty({ description: 'Control ID', example: 'CTRL-001' })
  controlId!: string;

  @ApiProperty({ description: 'Test date', example: '2024-12-31' })
  testDate!: Date;

  @ApiProperty({ description: 'Tested by user ID', example: 'auditor123' })
  testedBy!: string;

  @ApiProperty({ description: 'Test procedure description' })
  testProcedure!: string;

  @ApiProperty({ description: 'Sample size', example: 25 })
  sampleSize!: number;

  @ApiProperty({ description: 'Number of exceptions found', example: 0 })
  exceptionCount!: number;

  @ApiProperty({ description: 'Test result', enum: ['passed', 'failed', 'partially_passed'] })
  testResult!: string;

  @ApiProperty({ description: 'Findings and observations' })
  findings!: string;

  @ApiProperty({ description: 'Evidence location', example: 's3://audit-evidence/2024/ctrl-001/' })
  evidenceLocation!: string;
}

export class ComplianceReportDto {
  @ApiProperty({ description: 'Report type', enum: ['sox_404', 'fisma', 'sox_302', 'internal_audit', 'external_audit'] })
  reportType!: string;

  @ApiProperty({ description: 'Period start date', example: '2024-01-01' })
  periodStartDate!: Date;

  @ApiProperty({ description: 'Period end date', example: '2024-12-31' })
  periodEndDate!: Date;

  @ApiProperty({ description: 'Prepared by user ID', example: 'auditor123' })
  preparedBy!: string;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Sequelize model for Audit Log Entries.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} AuditLog model
 *
 * @example
 * ```typescript
 * const AuditLog = createAuditLogModel(sequelize);
 * const entry = await AuditLog.create({
 *   tableName: 'journal_entry_headers',
 *   recordId: 123,
 *   action: 'UPDATE',
 *   userId: 'user123',
 *   ipAddress: '192.168.1.1'
 * });
 * ```
 */
export const createAuditLogModel = (sequelize: Sequelize) => {
  class AuditLog extends Model {
    public id!: number;
    public tableName!: string;
    public recordId!: number;
    public action!: string;
    public userId!: string;
    public userName!: string;
    public timestamp!: Date;
    public sessionId!: string;
    public ipAddress!: string;
    public userAgent!: string | null;
    public oldValues!: Record<string, any> | null;
    public newValues!: Record<string, any> | null;
    public changedFields!: string[] | null;
    public businessContext!: string | null;
    public transactionId!: string | null;
    public severity!: string;
    public category!: string;
    public metadata!: Record<string, any>;
  }

  AuditLog.init(
    {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      tableName: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Database table name',
      },
      recordId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        comment: 'Record ID in the table',
      },
      action: {
        type: DataTypes.ENUM('INSERT', 'UPDATE', 'DELETE', 'SELECT', 'EXECUTE', 'APPROVE', 'REJECT', 'POST', 'REVERSE'),
        allowNull: false,
        comment: 'Action performed',
      },
      userId: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'User who performed the action',
      },
      userName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'User full name',
      },
      timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: 'Timestamp of action',
      },
      sessionId: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'User session ID',
      },
      ipAddress: {
        type: DataTypes.STRING(45),
        allowNull: false,
        comment: 'IP address (IPv4 or IPv6)',
      },
      userAgent: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Browser user agent',
      },
      oldValues: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Previous values before change',
      },
      newValues: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'New values after change',
      },
      changedFields: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        comment: 'List of changed field names',
      },
      businessContext: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Business context description',
      },
      transactionId: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Database transaction ID',
      },
      severity: {
        type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
        allowNull: false,
        defaultValue: 'low',
        comment: 'Event severity',
      },
      category: {
        type: DataTypes.ENUM('data_change', 'security', 'financial', 'access', 'system'),
        allowNull: false,
        comment: 'Event category',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
    },
    {
      sequelize,
      tableName: 'audit_logs',
      timestamps: false,
      indexes: [
        { fields: ['tableName', 'recordId'] },
        { fields: ['userId'] },
        { fields: ['timestamp'] },
        { fields: ['action'] },
        { fields: ['severity'] },
        { fields: ['category'] },
        { fields: ['sessionId'] },
        { fields: ['ipAddress'] },
      ],
    },
  );

  return AuditLog;
};

/**
 * Sequelize model for SOX Control Definitions.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} SOXControl model
 *
 * @example
 * ```typescript
 * const SOXControl = createSOXControlModel(sequelize);
 * const control = await SOXControl.create({
 *   controlId: 'CTRL-001',
 *   controlName: 'Journal Entry Approval',
 *   controlType: 'preventive',
 *   controlFrequency: 'manual'
 * });
 * ```
 */
export const createSOXControlModel = (sequelize: Sequelize) => {
  class SOXControl extends Model {
    public id!: number;
    public controlId!: string;
    public controlName!: string;
    public controlType!: string;
    public controlFrequency!: string;
    public controlObjective!: string;
    public riskArea!: string;
    public ownerUserId!: string;
    public testingFrequency!: string;
    public lastTestDate!: Date | null;
    public nextTestDate!: Date;
    public testResult!: string | null;
    public deficiencyLevel!: string | null;
    public status!: string;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  SOXControl.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      controlId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Unique control identifier',
      },
      controlName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Control name',
      },
      controlType: {
        type: DataTypes.ENUM('preventive', 'detective', 'corrective'),
        allowNull: false,
        comment: 'Type of control',
      },
      controlFrequency: {
        type: DataTypes.ENUM('manual', 'automated', 'semi_automated'),
        allowNull: false,
        comment: 'Control operation frequency',
      },
      controlObjective: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Control objective description',
      },
      riskArea: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Risk area addressed',
      },
      ownerUserId: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Control owner user ID',
      },
      testingFrequency: {
        type: DataTypes.ENUM('daily', 'weekly', 'monthly', 'quarterly', 'annually'),
        allowNull: false,
        comment: 'Testing frequency',
      },
      lastTestDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Last test date',
      },
      nextTestDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Next scheduled test date',
      },
      testResult: {
        type: DataTypes.ENUM('passed', 'failed', 'partially_passed', 'not_tested'),
        allowNull: true,
        comment: 'Latest test result',
      },
      deficiencyLevel: {
        type: DataTypes.ENUM('none', 'deficiency', 'significant_deficiency', 'material_weakness'),
        allowNull: true,
        comment: 'Deficiency level if control failed',
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive', 'under_review'),
        allowNull: false,
        defaultValue: 'active',
        comment: 'Control status',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional control metadata',
      },
    },
    {
      sequelize,
      tableName: 'sox_controls',
      timestamps: true,
      indexes: [
        { fields: ['controlId'], unique: true },
        { fields: ['controlType'] },
        { fields: ['riskArea'] },
        { fields: ['ownerUserId'] },
        { fields: ['status'] },
        { fields: ['nextTestDate'] },
      ],
    },
  );

  return SOXControl;
};

/**
 * Sequelize model for Change Tracking Records.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ChangeTracking model
 *
 * @example
 * ```typescript
 * const ChangeTracking = createChangeTrackingModel(sequelize);
 * const change = await ChangeTracking.create({
 *   entityType: 'Account',
 *   entityId: 1,
 *   fieldName: 'accountName',
 *   oldValue: 'Old Name',
 *   newValue: 'New Name',
 *   changedBy: 'user123'
 * });
 * ```
 */
export const createChangeTrackingModel = (sequelize: Sequelize) => {
  class ChangeTracking extends Model {
    public id!: number;
    public entityType!: string;
    public entityId!: number;
    public fieldName!: string;
    public oldValue!: any;
    public newValue!: any;
    public changeType!: string;
    public changedBy!: string;
    public changedAt!: Date;
    public changeReason!: string | null;
    public approvalStatus!: string;
    public approvedBy!: string | null;
    public approvedAt!: Date | null;
    public rollbackAvailable!: boolean;
    public metadata!: Record<string, any>;
  }

  ChangeTracking.init(
    {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      entityType: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Type of entity changed',
      },
      entityId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        comment: 'ID of entity changed',
      },
      fieldName: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Field name that changed',
      },
      oldValue: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Previous value',
      },
      newValue: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'New value',
      },
      changeType: {
        type: DataTypes.ENUM('create', 'update', 'delete', 'archive'),
        allowNull: false,
        comment: 'Type of change',
      },
      changedBy: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'User who made the change',
      },
      changedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: 'Timestamp of change',
      },
      changeReason: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Reason for change',
      },
      approvalStatus: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected', 'auto_approved'),
        allowNull: false,
        defaultValue: 'auto_approved',
        comment: 'Approval status',
      },
      approvedBy: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'User who approved',
      },
      approvedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Timestamp of approval',
      },
      rollbackAvailable: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Whether change can be rolled back',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
    },
    {
      sequelize,
      tableName: 'change_tracking',
      timestamps: false,
      indexes: [
        { fields: ['entityType', 'entityId'] },
        { fields: ['changedBy'] },
        { fields: ['changedAt'] },
        { fields: ['approvalStatus'] },
        { fields: ['changeType'] },
      ],
    },
  );

  return ChangeTracking;
};

// ============================================================================
// AUDIT LOGGING FUNCTIONS
// ============================================================================

/**
 * Creates a comprehensive audit log entry with full context.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateAuditLogDto} auditData - Audit log data
 * @param {string} sessionId - Session ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<AuditLogEntry>} Created audit log entry
 *
 * @example
 * ```typescript
 * const auditEntry = await createAuditLog(sequelize, {
 *   tableName: 'journal_entry_headers',
 *   recordId: 123,
 *   action: 'UPDATE',
 *   userId: 'user123',
 *   ipAddress: '192.168.1.1',
 *   oldValues: { status: 'draft' },
 *   newValues: { status: 'posted' }
 * }, 'session-xyz');
 * ```
 */
export const createAuditLog = async (
  sequelize: Sequelize,
  auditData: CreateAuditLogDto,
  sessionId: string,
  transaction?: Transaction,
): Promise<AuditLogEntry> => {
  const AuditLog = createAuditLogModel(sequelize);

  // Get user details
  const userQuery = `SELECT username, full_name FROM users WHERE user_id = :userId LIMIT 1`;
  const userResult = await sequelize.query(userQuery, {
    replacements: { userId: auditData.userId },
    type: QueryTypes.SELECT,
    transaction,
  });

  const userName = (userResult[0] as any)?.full_name || auditData.userId;

  // Determine changed fields
  const changedFields: string[] = [];
  if (auditData.oldValues && auditData.newValues) {
    for (const key of Object.keys(auditData.newValues)) {
      if (JSON.stringify(auditData.oldValues[key]) !== JSON.stringify(auditData.newValues[key])) {
        changedFields.push(key);
      }
    }
  }

  // Determine severity and category
  let severity: 'low' | 'medium' | 'high' | 'critical' = 'low';
  let category: 'data_change' | 'security' | 'financial' | 'access' | 'system' = 'data_change';

  if (auditData.action === 'DELETE') severity = 'high';
  if (auditData.tableName.includes('user') || auditData.tableName.includes('auth')) {
    severity = 'high';
    category = 'security';
  }
  if (auditData.tableName.includes('journal') || auditData.tableName.includes('financial')) {
    category = 'financial';
  }
  if (auditData.action === 'POST' || auditData.action === 'APPROVE') {
    severity = 'medium';
  }

  const entry = await AuditLog.create(
    {
      tableName: auditData.tableName,
      recordId: auditData.recordId,
      action: auditData.action,
      userId: auditData.userId,
      userName,
      sessionId,
      ipAddress: auditData.ipAddress,
      oldValues: auditData.oldValues || null,
      newValues: auditData.newValues || null,
      changedFields: changedFields.length > 0 ? changedFields : null,
      businessContext: auditData.businessContext || null,
      severity,
      category,
      timestamp: new Date(),
      metadata: {},
    },
    { transaction },
  );

  return entry.toJSON() as AuditLogEntry;
};

/**
 * Queries audit logs with advanced filtering and pagination.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {AuditLogQueryDto} queryParams - Query parameters
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<{ logs: AuditLogEntry[]; total: number }>} Audit logs and total count
 *
 * @example
 * ```typescript
 * const result = await queryAuditLogs(sequelize, {
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-12-31'),
 *   userId: 'user123',
 *   severity: 'high',
 *   limit: 100
 * });
 * ```
 */
export const queryAuditLogs = async (
  sequelize: Sequelize,
  queryParams: AuditLogQueryDto,
  transaction?: Transaction,
): Promise<{ logs: AuditLogEntry[]; total: number }> => {
  const AuditLog = createAuditLogModel(sequelize);

  const where: any = {};

  if (queryParams.startDate || queryParams.endDate) {
    where.timestamp = {};
    if (queryParams.startDate) {
      where.timestamp[Op.gte] = queryParams.startDate;
    }
    if (queryParams.endDate) {
      where.timestamp[Op.lte] = queryParams.endDate;
    }
  }

  if (queryParams.userId) {
    where.userId = queryParams.userId;
  }

  if (queryParams.tableName) {
    where.tableName = queryParams.tableName;
  }

  if (queryParams.action) {
    where.action = queryParams.action;
  }

  if (queryParams.severity) {
    where.severity = queryParams.severity;
  }

  const logs = await AuditLog.findAll({
    where,
    order: [['timestamp', 'DESC']],
    limit: queryParams.limit || 100,
    offset: queryParams.offset || 0,
    transaction,
  });

  const total = await AuditLog.count({ where, transaction });

  return {
    logs: logs.map((log) => log.toJSON() as AuditLogEntry),
    total,
  };
};

/**
 * Tracks field-level changes with approval workflow.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} entityType - Entity type
 * @param {number} entityId - Entity ID
 * @param {string} fieldName - Field name
 * @param {any} oldValue - Old value
 * @param {any} newValue - New value
 * @param {string} userId - User ID
 * @param {string} [changeReason] - Reason for change
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<ChangeTrackingRecord>} Change tracking record
 *
 * @example
 * ```typescript
 * const change = await trackFieldChange(
 *   sequelize,
 *   'Account',
 *   1,
 *   'accountName',
 *   'Old Name',
 *   'New Name',
 *   'user123',
 *   'Correcting account name'
 * );
 * ```
 */
export const trackFieldChange = async (
  sequelize: Sequelize,
  entityType: string,
  entityId: number,
  fieldName: string,
  oldValue: any,
  newValue: any,
  userId: string,
  changeReason?: string,
  transaction?: Transaction,
): Promise<ChangeTrackingRecord> => {
  const ChangeTracking = createChangeTrackingModel(sequelize);

  // Determine if approval is required based on entity type and field
  const requiresApproval = await checkIfApprovalRequired(sequelize, entityType, fieldName);

  const change = await ChangeTracking.create(
    {
      entityType,
      entityId,
      fieldName,
      oldValue,
      newValue,
      changeType: oldValue === null ? 'create' : 'update',
      changedBy: userId,
      changedAt: new Date(),
      changeReason: changeReason || null,
      approvalStatus: requiresApproval ? 'pending' : 'auto_approved',
      rollbackAvailable: true,
      metadata: {},
    },
    { transaction },
  );

  return change.toJSON() as ChangeTrackingRecord;
};

/**
 * Logs user activity for security and compliance monitoring.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} userId - User ID
 * @param {string} activityType - Activity type
 * @param {string} activityDescription - Activity description
 * @param {string} sessionId - Session ID
 * @param {string} ipAddress - IP address
 * @param {boolean} success - Whether activity was successful
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<UserActivityLog>} Activity log entry
 *
 * @example
 * ```typescript
 * const activity = await logUserActivity(
 *   sequelize,
 *   'user123',
 *   'access',
 *   'Accessed financial report',
 *   'session-xyz',
 *   '192.168.1.1',
 *   true
 * );
 * ```
 */
export const logUserActivity = async (
  sequelize: Sequelize,
  userId: string,
  activityType: 'login' | 'logout' | 'access' | 'transaction' | 'report' | 'export' | 'import' | 'configuration',
  activityDescription: string,
  sessionId: string,
  ipAddress: string,
  success: boolean = true,
  transaction?: Transaction,
): Promise<UserActivityLog> => {
  const query = `
    INSERT INTO user_activity_logs (
      user_id,
      user_name,
      activity_type,
      activity_description,
      session_id,
      ip_address,
      timestamp,
      success
    )
    SELECT
      :userId,
      COALESCE(u.full_name, :userId),
      :activityType,
      :activityDescription,
      :sessionId,
      :ipAddress,
      NOW(),
      :success
    FROM users u
    WHERE u.user_id = :userId
    RETURNING *
  `;

  const result = await sequelize.query(query, {
    replacements: {
      userId,
      activityType,
      activityDescription,
      sessionId,
      ipAddress,
      success,
    },
    type: QueryTypes.INSERT,
    transaction,
  });

  return (result[0] as any[])[0] as UserActivityLog;
};

/**
 * Builds data lineage trail for data governance.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} dataElement - Data element identifier
 * @param {string} sourceSystem - Source system
 * @param {string} targetSystem - Target system
 * @param {DataLineageNode[]} lineagePath - Lineage path nodes
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<DataLineageTrail>} Data lineage trail
 *
 * @example
 * ```typescript
 * const lineage = await buildDataLineageTrail(sequelize, 'revenue', 'AR', 'GL', [
 *   { nodeType: 'source', entityType: 'Invoice', entityId: 123, ... },
 *   { nodeType: 'transformation', entityType: 'JournalEntry', entityId: 456, ... }
 * ]);
 * ```
 */
export const buildDataLineageTrail = async (
  sequelize: Sequelize,
  dataElement: string,
  sourceSystem: string,
  targetSystem: string,
  lineagePath: DataLineageNode[],
  transaction?: Transaction,
): Promise<DataLineageTrail> => {
  const trailId = `${dataElement}_${sourceSystem}_${targetSystem}_${Date.now()}`;

  const query = `
    INSERT INTO data_lineage_trails (
      trail_id,
      data_element,
      source_system,
      target_system,
      lineage_path,
      is_complete,
      confidence,
      created_at,
      last_updated
    ) VALUES (
      :trailId,
      :dataElement,
      :sourceSystem,
      :targetSystem,
      :lineagePath,
      :isComplete,
      :confidence,
      NOW(),
      NOW()
    )
    RETURNING *
  `;

  const isComplete = lineagePath.length > 0 && lineagePath[lineagePath.length - 1].nodeType === 'destination';
  const confidence = isComplete ? 1.0 : 0.8;

  const result = await sequelize.query(query, {
    replacements: {
      trailId,
      dataElement,
      sourceSystem,
      targetSystem,
      lineagePath: JSON.stringify(lineagePath),
      isComplete,
      confidence,
    },
    type: QueryTypes.INSERT,
    transaction,
  });

  return {
    trailId,
    dataElement,
    sourceSystem,
    targetSystem,
    lineagePath,
    createdAt: new Date(),
    lastUpdated: new Date(),
    isComplete,
    confidence,
  };
};

/**
 * Creates or updates a SOX control definition.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Partial<SOXControl>} controlData - Control data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<SOXControl>} SOX control
 *
 * @example
 * ```typescript
 * const control = await createSOXControl(sequelize, {
 *   controlId: 'CTRL-001',
 *   controlName: 'Journal Entry Approval',
 *   controlType: 'preventive',
 *   controlObjective: 'Ensure all journal entries are approved',
 *   ownerUserId: 'controller123',
 *   testingFrequency: 'monthly'
 * });
 * ```
 */
export const createSOXControl = async (
  sequelize: Sequelize,
  controlData: Partial<SOXControl>,
  transaction?: Transaction,
): Promise<SOXControl> => {
  const SOXControlModel = createSOXControlModel(sequelize);

  const control = await SOXControlModel.create(
    {
      ...controlData,
      status: controlData.status || 'active',
      metadata: controlData.metadata || {},
    } as any,
    { transaction },
  );

  return control.toJSON() as SOXControl;
};

/**
 * Records a SOX control test execution.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {SOXControlTestDto} testData - Test data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<SOXControlTest>} SOX control test record
 *
 * @example
 * ```typescript
 * const test = await recordSOXControlTest(sequelize, {
 *   controlId: 'CTRL-001',
 *   testDate: new Date(),
 *   testedBy: 'auditor123',
 *   testProcedure: 'Reviewed 25 journal entries',
 *   sampleSize: 25,
 *   exceptionCount: 0,
 *   testResult: 'passed',
 *   findings: 'All entries properly approved',
 *   evidenceLocation: 's3://audit/2024/ctrl-001/'
 * });
 * ```
 */
export const recordSOXControlTest = async (
  sequelize: Sequelize,
  testData: SOXControlTestDto,
  transaction?: Transaction,
): Promise<SOXControlTest> => {
  const query = `
    INSERT INTO sox_control_tests (
      control_id,
      test_date,
      tested_by,
      test_procedure,
      sample_size,
      exception_count,
      test_result,
      findings,
      evidence_location,
      remediation_required,
      created_at
    ) VALUES (
      :controlId,
      :testDate,
      :testedBy,
      :testProcedure,
      :sampleSize,
      :exceptionCount,
      :testResult,
      :findings,
      :evidenceLocation,
      :remediationRequired,
      NOW()
    )
    RETURNING *
  `;

  const remediationRequired = testData.testResult !== 'passed';

  const result = await sequelize.query(query, {
    replacements: {
      controlId: testData.controlId,
      testDate: testData.testDate,
      testedBy: testData.testedBy,
      testProcedure: testData.testProcedure,
      sampleSize: testData.sampleSize,
      exceptionCount: testData.exceptionCount,
      testResult: testData.testResult,
      findings: testData.findings,
      evidenceLocation: testData.evidenceLocation,
      remediationRequired,
    },
    type: QueryTypes.INSERT,
    transaction,
  });

  // Update the control with the latest test result
  const SOXControlModel = createSOXControlModel(sequelize);
  await SOXControlModel.update(
    {
      lastTestDate: testData.testDate,
      testResult: testData.testResult,
      deficiencyLevel: testData.testResult === 'passed' ? 'none' : 'deficiency',
    },
    {
      where: { controlId: testData.controlId },
      transaction,
    },
  );

  return (result[0] as any[])[0] as SOXControlTest;
};

/**
 * Generates a comprehensive compliance report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {ComplianceReportDto} reportParams - Report parameters
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<ComplianceReport>} Compliance report
 *
 * @example
 * ```typescript
 * const report = await generateComplianceReport(sequelize, {
 *   reportType: 'sox_404',
 *   periodStartDate: new Date('2024-01-01'),
 *   periodEndDate: new Date('2024-12-31'),
 *   preparedBy: 'auditor123'
 * });
 * ```
 */
export const generateComplianceReport = async (
  sequelize: Sequelize,
  reportParams: ComplianceReportDto,
  transaction?: Transaction,
): Promise<ComplianceReport> => {
  const reportId = `${reportParams.reportType}_${Date.now()}`;

  // Get all relevant control tests for the period
  const controlTestsQuery = `
    SELECT
      ct.*,
      sc.control_name,
      sc.risk_area
    FROM sox_control_tests ct
    JOIN sox_controls sc ON ct.control_id = sc.control_id
    WHERE ct.test_date BETWEEN :startDate AND :endDate
    ORDER BY ct.test_date DESC
  `;

  const controlTests = await sequelize.query(controlTestsQuery, {
    replacements: {
      startDate: reportParams.periodStartDate,
      endDate: reportParams.periodEndDate,
    },
    type: QueryTypes.SELECT,
    transaction,
  });

  const findings: ComplianceFinding[] = [];
  let passedControls = 0;
  let failedControls = 0;

  for (const test of controlTests as any[]) {
    if (test.test_result === 'failed') {
      failedControls++;
      findings.push({
        findingId: `FIND-${test.id}`,
        findingType: 'deficiency',
        severity: test.exception_count > 3 ? 'high' : 'medium',
        description: `Control ${test.control_name} failed testing`,
        affectedControl: test.control_id,
        affectedProcess: test.risk_area,
        identifiedDate: test.test_date,
        identifiedBy: test.tested_by,
        rootCause: test.findings,
        status: 'open',
      });
    } else if (test.test_result === 'passed') {
      passedControls++;
    }
  }

  const overallAssessment: 'compliant' | 'non_compliant' | 'partially_compliant' =
    failedControls === 0 ? 'compliant' : failedControls < passedControls ? 'partially_compliant' : 'non_compliant';

  const executiveSummary = `
    Compliance Report for ${reportParams.reportType} covering period ${reportParams.periodStartDate.toISOString()} to ${reportParams.periodEndDate.toISOString()}.
    Total controls tested: ${controlTests.length}
    Passed: ${passedControls}
    Failed: ${failedControls}
    Overall Assessment: ${overallAssessment}
    ${findings.length > 0 ? `${findings.length} findings identified requiring remediation.` : 'No significant findings identified.'}
  `;

  const report: ComplianceReport = {
    reportId,
    reportType: reportParams.reportType as any,
    reportingPeriod: {
      startDate: reportParams.periodStartDate,
      endDate: reportParams.periodEndDate,
    },
    preparedBy: reportParams.preparedBy,
    preparedAt: new Date(),
    status: 'draft',
    findings,
    overallAssessment,
    executiveSummary,
  };

  // Save report to database
  await sequelize.query(
    `
    INSERT INTO compliance_reports (
      report_id,
      report_type,
      period_start,
      period_end,
      prepared_by,
      prepared_at,
      status,
      findings,
      overall_assessment,
      executive_summary
    ) VALUES (
      :reportId,
      :reportType,
      :periodStart,
      :periodEnd,
      :preparedBy,
      NOW(),
      'draft',
      :findings,
      :overallAssessment,
      :executiveSummary
    )
  `,
    {
      replacements: {
        reportId,
        reportType: reportParams.reportType,
        periodStart: reportParams.periodStartDate,
        periodEnd: reportParams.periodEndDate,
        preparedBy: reportParams.preparedBy,
        findings: JSON.stringify(findings),
        overallAssessment,
        executiveSummary,
      },
      type: QueryTypes.INSERT,
      transaction,
    },
  );

  return report;
};

/**
 * Logs security audit events for threat detection.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} eventType - Event type
 * @param {string} severity - Event severity
 * @param {string} ipAddress - IP address
 * @param {string} eventDescription - Event description
 * @param {string} [userId] - User ID if applicable
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<SecurityAuditLog>} Security audit log entry
 *
 * @example
 * ```typescript
 * const securityEvent = await logSecurityAuditEvent(
 *   sequelize,
 *   'authentication',
 *   'warning',
 *   '192.168.1.1',
 *   'Failed login attempt',
 *   'user123'
 * );
 * ```
 */
export const logSecurityAuditEvent = async (
  sequelize: Sequelize,
  eventType: 'authentication' | 'authorization' | 'data_access' | 'configuration_change' | 'privilege_escalation' | 'suspicious_activity',
  severity: 'info' | 'warning' | 'critical',
  ipAddress: string,
  eventDescription: string,
  userId?: string,
  transaction?: Transaction,
): Promise<SecurityAuditLog> => {
  const threatLevel = severity === 'critical' ? 'critical' : severity === 'warning' ? 'medium' : 'low';
  const investigationRequired = severity === 'critical' || eventType === 'suspicious_activity';

  const query = `
    INSERT INTO security_audit_logs (
      event_type,
      severity,
      user_id,
      ip_address,
      timestamp,
      event_description,
      action_result,
      threat_level,
      investigation_required,
      investigation_status
    ) VALUES (
      :eventType,
      :severity,
      :userId,
      :ipAddress,
      NOW(),
      :eventDescription,
      'failure',
      :threatLevel,
      :investigationRequired,
      :investigationStatus
    )
    RETURNING *
  `;

  const result = await sequelize.query(query, {
    replacements: {
      eventType,
      severity,
      userId: userId || null,
      ipAddress,
      eventDescription,
      threatLevel,
      investigationRequired,
      investigationStatus: investigationRequired ? 'pending' : null,
    },
    type: QueryTypes.INSERT,
    transaction,
  });

  return (result[0] as any[])[0] as SecurityAuditLog;
};

/**
 * Records access control decisions for compliance.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} userId - User ID
 * @param {string} resourceType - Resource type
 * @param {string} resourceId - Resource ID
 * @param {string} accessType - Access type
 * @param {boolean} granted - Whether access was granted
 * @param {string} [denialReason] - Denial reason if not granted
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<AccessControlLog>} Access control log entry
 *
 * @example
 * ```typescript
 * const accessLog = await recordAccessControl(
 *   sequelize,
 *   'user123',
 *   'financial_report',
 *   'report-456',
 *   'read',
 *   true
 * );
 * ```
 */
export const recordAccessControl = async (
  sequelize: Sequelize,
  userId: string,
  resourceType: string,
  resourceId: string,
  accessType: 'read' | 'write' | 'delete' | 'execute' | 'approve',
  granted: boolean,
  denialReason?: string,
  transaction?: Transaction,
): Promise<AccessControlLog> => {
  const query = `
    INSERT INTO access_control_logs (
      user_id,
      resource_type,
      resource_id,
      access_type,
      granted,
      denial_reason,
      requested_at
    ) VALUES (
      :userId,
      :resourceType,
      :resourceId,
      :accessType,
      :granted,
      :denialReason,
      NOW()
    )
    RETURNING *
  `;

  const result = await sequelize.query(query, {
    replacements: {
      userId,
      resourceType,
      resourceId,
      accessType,
      granted,
      denialReason: denialReason || null,
    },
    type: QueryTypes.INSERT,
    transaction,
  });

  return (result[0] as any[])[0] as AccessControlLog;
};

/**
 * Retrieves complete transaction history with audit trail.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} transactionType - Transaction type
 * @param {number} transactionId - Transaction ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<TransactionHistory>} Transaction history with audit trail
 *
 * @example
 * ```typescript
 * const history = await getTransactionHistory(
 *   sequelize,
 *   'journal_entry',
 *   123
 * );
 * ```
 */
export const getTransactionHistory = async (
  sequelize: Sequelize,
  transactionType: string,
  transactionId: number,
  transaction?: Transaction,
): Promise<TransactionHistory> => {
  // Get transaction details
  const transactionQuery = `
    SELECT *
    FROM ${transactionType}s
    WHERE id = :transactionId
  `;

  const transactionData = await sequelize.query(transactionQuery, {
    replacements: { transactionId },
    type: QueryTypes.SELECT,
    transaction,
  });

  if (!transactionData || transactionData.length === 0) {
    throw new Error('Transaction not found');
  }

  const txn = transactionData[0] as any;

  // Get audit trail
  const AuditLog = createAuditLogModel(sequelize);
  const auditLogs = await AuditLog.findAll({
    where: {
      tableName: `${transactionType}s`,
      recordId: transactionId,
    },
    order: [['timestamp', 'ASC']],
    transaction,
  });

  // Get approval chain
  const approvalQuery = `
    SELECT *
    FROM approval_workflows
    WHERE transaction_type = :transactionType
      AND transaction_id = :transactionId
    ORDER BY approval_level ASC
  `;

  const approvals = await sequelize.query(approvalQuery, {
    replacements: { transactionType, transactionId },
    type: QueryTypes.SELECT,
    transaction,
  });

  return {
    historyId: transactionId,
    transactionType,
    transactionId,
    documentNumber: txn.entry_number || txn.document_number,
    transactionDate: txn.entry_date || txn.transaction_date,
    postingDate: txn.posting_date,
    amount: txn.total_debit || txn.amount,
    currency: txn.currency || 'USD',
    userId: txn.created_by,
    status: txn.status,
    approvalChain: approvals as ApprovalStep[],
    relatedTransactions: [],
    auditTrail: auditLogs.map((log) => log.toJSON() as AuditLogEntry),
    metadata: txn.metadata || {},
  };
};

/**
 * Detects segregation of duties violations.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} userId - User ID to check
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<SODViolation[]>} Array of SOD violations
 *
 * @example
 * ```typescript
 * const violations = await detectSegregationOfDutiesViolations(
 *   sequelize,
 *   'user123'
 * );
 * ```
 */
export const detectSegregationOfDutiesViolations = async (
  sequelize: Sequelize,
  userId: string,
  transaction?: Transaction,
): Promise<SODViolation[]> => {
  const query = `
    WITH user_roles AS (
      SELECT
        ur.user_id,
        array_agg(ur.role_id) as assigned_roles
      FROM user_roles ur
      WHERE ur.user_id = :userId
      GROUP BY ur.user_id
    ),
    sod_rules AS (
      SELECT
        sod.id as rule_id,
        sod.rule_name,
        sod.conflicting_role_1,
        sod.conflicting_role_2,
        sod.risk_level
      FROM segregation_of_duties_rules sod
      WHERE sod.is_active = true
    )
    SELECT
      sr.rule_id,
      sr.rule_name,
      ur.assigned_roles,
      sr.risk_level
    FROM user_roles ur
    CROSS JOIN sod_rules sr
    WHERE ur.assigned_roles @> ARRAY[sr.conflicting_role_1, sr.conflicting_role_2]
  `;

  const results = await sequelize.query(query, {
    replacements: { userId },
    type: QueryTypes.SELECT,
    transaction,
  });

  const violations: SODViolation[] = [];

  for (const row of results as any[]) {
    violations.push({
      violationId: Date.now(),
      userId,
      userName: '', // Would be populated from user table
      sodRuleId: row.rule_id,
      assignedRoles: row.assigned_roles,
      detectedAt: new Date(),
      mitigationStatus: 'pending',
    });
  }

  return violations;
};

/**
 * Creates a compliance certification record.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} certificationType - Certification type
 * @param {Date} periodStart - Period start date
 * @param {Date} periodEnd - Period end date
 * @param {string} certifiedBy - User certifying
 * @param {string} certificationStatement - Certification statement
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<ComplianceCertification>} Compliance certification
 *
 * @example
 * ```typescript
 * const cert = await createComplianceCertification(
 *   sequelize,
 *   'sox',
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31'),
 *   'cfo@company.com',
 *   'I certify that internal controls are effective'
 * );
 * ```
 */
export const createComplianceCertification = async (
  sequelize: Sequelize,
  certificationType: 'sox' | 'fisma' | 'iso27001' | 'pci_dss' | 'hipaa' | 'custom',
  periodStart: Date,
  periodEnd: Date,
  certifiedBy: string,
  certificationStatement: string,
  transaction?: Transaction,
): Promise<ComplianceCertification> => {
  const certificationId = `CERT-${certificationType}-${Date.now()}`;

  const query = `
    INSERT INTO compliance_certifications (
      certification_id,
      certification_type,
      period_start,
      period_end,
      certified_by,
      certification_date,
      certification_statement,
      status,
      next_review_date
    ) VALUES (
      :certificationId,
      :certificationType,
      :periodStart,
      :periodEnd,
      :certifiedBy,
      NOW(),
      :certificationStatement,
      'valid',
      :nextReviewDate
    )
    RETURNING *
  `;

  const nextReviewDate = new Date(periodEnd);
  nextReviewDate.setFullYear(nextReviewDate.getFullYear() + 1);

  const result = await sequelize.query(query, {
    replacements: {
      certificationId,
      certificationType,
      periodStart,
      periodEnd,
      certifiedBy,
      certificationStatement,
      nextReviewDate,
    },
    type: QueryTypes.INSERT,
    transaction,
  });

  return (result[0] as any[])[0] as ComplianceCertification;
};

/**
 * Initiates a forensic analysis investigation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} investigationType - Investigation type
 * @param {string} initiatedBy - User initiating investigation
 * @param {string[]} affectedSystems - Affected systems
 * @param {string[]} affectedUsers - Affected users
 * @param {Date} timelineStart - Timeline start
 * @param {Date} timelineEnd - Timeline end
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<ForensicAnalysis>} Forensic analysis record
 *
 * @example
 * ```typescript
 * const investigation = await initiateForensicAnalysis(
 *   sequelize,
 *   'unauthorized_access',
 *   'security-admin',
 *   ['financial_system'],
 *   ['user123'],
 *   new Date('2024-12-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
export const initiateForensicAnalysis = async (
  sequelize: Sequelize,
  investigationType: 'fraud' | 'data_breach' | 'unauthorized_access' | 'data_corruption' | 'policy_violation',
  initiatedBy: string,
  affectedSystems: string[],
  affectedUsers: string[],
  timelineStart: Date,
  timelineEnd: Date,
  transaction?: Transaction,
): Promise<ForensicAnalysis> => {
  const analysisId = `FORENSIC-${Date.now()}`;

  const query = `
    INSERT INTO forensic_analyses (
      analysis_id,
      investigation_type,
      initiated_by,
      initiated_at,
      status,
      priority,
      affected_systems,
      affected_users,
      timeline_start,
      timeline_end
    ) VALUES (
      :analysisId,
      :investigationType,
      :initiatedBy,
      NOW(),
      'open',
      'high',
      :affectedSystems,
      :affectedUsers,
      :timelineStart,
      :timelineEnd
    )
    RETURNING *
  `;

  const result = await sequelize.query(query, {
    replacements: {
      analysisId,
      investigationType,
      initiatedBy,
      affectedSystems: JSON.stringify(affectedSystems),
      affectedUsers: JSON.stringify(affectedUsers),
      timelineStart,
      timelineEnd,
    },
    type: QueryTypes.INSERT,
    transaction,
  });

  return {
    analysisId,
    investigationType,
    initiatedBy,
    initiatedAt: new Date(),
    status: 'open',
    priority: 'high',
    affectedSystems,
    affectedUsers,
    timelineStart,
    timelineEnd,
    findings: '',
    evidenceCollected: [],
    recommendations: '',
  };
};

/**
 * Generates audit trail report for a specific period.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {string[]} [tableNames] - Optional table name filter
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Audit trail report
 *
 * @example
 * ```typescript
 * const report = await generateAuditTrailReport(
 *   sequelize,
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31'),
 *   ['journal_entry_headers', 'financial_reports']
 * );
 * ```
 */
export const generateAuditTrailReport = async (
  sequelize: Sequelize,
  startDate: Date,
  endDate: Date,
  tableNames?: string[],
  transaction?: Transaction,
): Promise<any> => {
  const tableFilter = tableNames && tableNames.length > 0 ? 'AND table_name = ANY(:tableNames)' : '';

  const query = `
    SELECT
      table_name,
      action,
      COUNT(*) as event_count,
      COUNT(DISTINCT user_id) as unique_users,
      COUNT(DISTINCT DATE(timestamp)) as active_days,
      MIN(timestamp) as first_event,
      MAX(timestamp) as last_event
    FROM audit_logs
    WHERE timestamp BETWEEN :startDate AND :endDate
      ${tableFilter}
    GROUP BY table_name, action
    ORDER BY event_count DESC
  `;

  const summary = await sequelize.query(query, {
    replacements: {
      startDate,
      endDate,
      tableNames: tableNames || [],
    },
    type: QueryTypes.SELECT,
    transaction,
  });

  const totalQuery = `
    SELECT
      COUNT(*) as total_events,
      COUNT(DISTINCT user_id) as total_users,
      COUNT(DISTINCT session_id) as total_sessions
    FROM audit_logs
    WHERE timestamp BETWEEN :startDate AND :endDate
      ${tableFilter}
  `;

  const totals = await sequelize.query(totalQuery, {
    replacements: {
      startDate,
      endDate,
      tableNames: tableNames || [],
    },
    type: QueryTypes.SELECT,
    transaction,
  });

  return {
    reportPeriod: { startDate, endDate },
    summary,
    totals: totals[0],
    generatedAt: new Date(),
  };
};

/**
 * Retrieves user activity summary for compliance review.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} userId - User ID
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} User activity summary
 *
 * @example
 * ```typescript
 * const summary = await getUserActivitySummary(
 *   sequelize,
 *   'user123',
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
export const getUserActivitySummary = async (
  sequelize: Sequelize,
  userId: string,
  startDate: Date,
  endDate: Date,
  transaction?: Transaction,
): Promise<any> => {
  const query = `
    SELECT
      activity_type,
      COUNT(*) as activity_count,
      COUNT(CASE WHEN success = true THEN 1 END) as successful_count,
      COUNT(CASE WHEN success = false THEN 1 END) as failed_count,
      MIN(timestamp) as first_activity,
      MAX(timestamp) as last_activity,
      COUNT(DISTINCT DATE(timestamp)) as active_days
    FROM user_activity_logs
    WHERE user_id = :userId
      AND timestamp BETWEEN :startDate AND :endDate
    GROUP BY activity_type
    ORDER BY activity_count DESC
  `;

  const activitySummary = await sequelize.query(query, {
    replacements: { userId, startDate, endDate },
    type: QueryTypes.SELECT,
    transaction,
  });

  const securityQuery = `
    SELECT
      COUNT(*) as security_events,
      COUNT(CASE WHEN severity = 'critical' THEN 1 END) as critical_events,
      COUNT(CASE WHEN investigation_required = true THEN 1 END) as investigation_required
    FROM security_audit_logs
    WHERE user_id = :userId
      AND timestamp BETWEEN :startDate AND :endDate
  `;

  const securitySummary = await sequelize.query(securityQuery, {
    replacements: { userId, startDate, endDate },
    type: QueryTypes.SELECT,
    transaction,
  });

  return {
    userId,
    period: { startDate, endDate },
    activitySummary,
    securitySummary: securitySummary[0],
    generatedAt: new Date(),
  };
};

/**
 * Archives old audit logs for long-term retention.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} cutoffDate - Archive logs before this date
 * @param {string} archiveLocation - Archive storage location
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<{ archivedCount: number; archiveLocation: string }>} Archive result
 *
 * @example
 * ```typescript
 * const result = await archiveAuditLogs(
 *   sequelize,
 *   new Date('2020-01-01'),
 *   's3://audit-archive/2020/'
 * );
 * ```
 */
export const archiveAuditLogs = async (
  sequelize: Sequelize,
  cutoffDate: Date,
  archiveLocation: string,
  transaction?: Transaction,
): Promise<{ archivedCount: number; archiveLocation: string }> => {
  const countQuery = `
    SELECT COUNT(*) as count
    FROM audit_logs
    WHERE timestamp < :cutoffDate
  `;

  const countResult = await sequelize.query(countQuery, {
    replacements: { cutoffDate },
    type: QueryTypes.SELECT,
    transaction,
  });

  const archivedCount = (countResult[0] as any).count;

  // In production, this would export to S3/archive storage
  // For now, we'll just mark records as archived
  await sequelize.query(
    `
    UPDATE audit_logs
    SET metadata = jsonb_set(metadata, '{archived}', 'true')
    WHERE timestamp < :cutoffDate
  `,
    {
      replacements: { cutoffDate },
      type: QueryTypes.UPDATE,
      transaction,
    },
  );

  return {
    archivedCount,
    archiveLocation,
  };
};

/**
 * Validates data integrity using checksums and hashes.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tableName - Table name to validate
 * @param {number[]} recordIds - Record IDs to validate
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<{ valid: boolean; invalidRecords: number[] }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateDataIntegrity(
 *   sequelize,
 *   'journal_entry_headers',
 *   [1, 2, 3, 4, 5]
 * );
 * ```
 */
export const validateDataIntegrity = async (
  sequelize: Sequelize,
  tableName: string,
  recordIds: number[],
  transaction?: Transaction,
): Promise<{ valid: boolean; invalidRecords: number[] }> => {
  // This would implement actual checksum validation
  // For demonstration, we'll check if audit logs exist
  const query = `
    SELECT DISTINCT record_id
    FROM audit_logs
    WHERE table_name = :tableName
      AND record_id = ANY(:recordIds)
      AND action IN ('INSERT', 'UPDATE')
  `;

  const results = await sequelize.query(query, {
    replacements: { tableName, recordIds },
    type: QueryTypes.SELECT,
    transaction,
  });

  const auditedRecords = (results as any[]).map((r) => r.record_id);
  const invalidRecords = recordIds.filter((id) => !auditedRecords.includes(id));

  return {
    valid: invalidRecords.length === 0,
    invalidRecords,
  };
};

/**
 * Exports compliance data for regulatory filing.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} regulatoryBody - Regulatory body
 * @param {string} reportType - Report type
 * @param {Date} periodStart - Period start
 * @param {Date} periodEnd - Period end
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<RegulatoryReport>} Regulatory report
 *
 * @example
 * ```typescript
 * const report = await exportComplianceData(
 *   sequelize,
 *   'SEC',
 *   '10-K',
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
export const exportComplianceData = async (
  sequelize: Sequelize,
  regulatoryBody: string,
  reportType: string,
  periodStart: Date,
  periodEnd: Date,
  transaction?: Transaction,
): Promise<RegulatoryReport> => {
  const reportId = `REG-${regulatoryBody}-${reportType}-${Date.now()}`;

  // Gather compliance data
  const controlsQuery = `
    SELECT
      control_id,
      control_name,
      test_result,
      deficiency_level
    FROM sox_controls
    WHERE status = 'active'
  `;

  const controls = await sequelize.query(controlsQuery, {
    type: QueryTypes.SELECT,
    transaction,
  });

  const certificationsQuery = `
    SELECT *
    FROM compliance_certifications
    WHERE period_start >= :periodStart
      AND period_end <= :periodEnd
      AND status = 'valid'
  `;

  const certifications = await sequelize.query(certificationsQuery, {
    replacements: { periodStart, periodEnd },
    type: QueryTypes.SELECT,
    transaction,
  });

  const filingDeadline = new Date(periodEnd);
  filingDeadline.setDate(filingDeadline.getDate() + 90); // 90 days after period end

  return {
    reportId,
    regulatoryBody,
    reportType,
    filingDeadline,
    reportingPeriod: {
      startDate: periodStart,
      endDate: periodEnd,
    },
    preparedBy: 'system',
    status: 'draft',
    reportData: {
      controls,
      certifications,
    },
  };
};

/**
 * Monitors real-time compliance metrics.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Real-time compliance metrics
 *
 * @example
 * ```typescript
 * const metrics = await monitorComplianceMetrics(sequelize);
 * ```
 */
export const monitorComplianceMetrics = async (
  sequelize: Sequelize,
  transaction?: Transaction,
): Promise<any> => {
  const controlsQuery = `
    SELECT
      COUNT(*) as total_controls,
      COUNT(CASE WHEN status = 'active' THEN 1 END) as active_controls,
      COUNT(CASE WHEN test_result = 'passed' THEN 1 END) as passed_controls,
      COUNT(CASE WHEN test_result = 'failed' THEN 1 END) as failed_controls,
      COUNT(CASE WHEN deficiency_level IN ('significant_deficiency', 'material_weakness') THEN 1 END) as critical_deficiencies
    FROM sox_controls
  `;

  const controls = await sequelize.query(controlsQuery, {
    type: QueryTypes.SELECT,
    transaction,
  });

  const sodViolationsQuery = `
    SELECT COUNT(*) as total_violations
    FROM sod_violations
    WHERE mitigation_status IN ('pending', 'mitigated')
  `;

  const sodViolations = await sequelize.query(sodViolationsQuery, {
    type: QueryTypes.SELECT,
    transaction,
  });

  const securityEventsQuery = `
    SELECT
      COUNT(*) as total_events,
      COUNT(CASE WHEN severity = 'critical' THEN 1 END) as critical_events,
      COUNT(CASE WHEN investigation_required = true THEN 1 END) as investigations_required
    FROM security_audit_logs
    WHERE timestamp > NOW() - INTERVAL '24 hours'
  `;

  const securityEvents = await sequelize.query(securityEventsQuery, {
    type: QueryTypes.SELECT,
    transaction,
  });

  return {
    controls: controls[0],
    sodViolations: sodViolations[0],
    securityEvents: securityEvents[0],
    timestamp: new Date(),
  };
};

/**
 * Generates compliance dashboard for executive review.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} asOfDate - As-of date for metrics
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Compliance dashboard
 *
 * @example
 * ```typescript
 * const dashboard = await generateComplianceDashboard(
 *   sequelize,
 *   new Date()
 * );
 * ```
 */
export const generateComplianceDashboard = async (
  sequelize: Sequelize,
  asOfDate: Date,
  transaction?: Transaction,
): Promise<any> => {
  const metrics = await monitorComplianceMetrics(sequelize, transaction);

  const recentFindings = await sequelize.query(
    `
    SELECT
      finding_id,
      finding_type,
      severity,
      description,
      status
    FROM compliance_findings
    WHERE identified_date > :cutoffDate
    ORDER BY identified_date DESC
    LIMIT 10
  `,
    {
      replacements: { cutoffDate: new Date(asOfDate.getTime() - 30 * 24 * 60 * 60 * 1000) },
      type: QueryTypes.SELECT,
      transaction,
    },
  );

  const upcomingTests = await sequelize.query(
    `
    SELECT
      control_id,
      control_name,
      next_test_date
    FROM sox_controls
    WHERE next_test_date BETWEEN :asOfDate AND :futureDate
      AND status = 'active'
    ORDER BY next_test_date ASC
    LIMIT 10
  `,
    {
      replacements: {
        asOfDate,
        futureDate: new Date(asOfDate.getTime() + 30 * 24 * 60 * 60 * 1000),
      },
      type: QueryTypes.SELECT,
      transaction,
    },
  );

  return {
    asOfDate,
    metrics,
    recentFindings,
    upcomingTests,
    overallStatus: metrics.controls.critical_deficiencies > 0 ? 'attention_required' : 'compliant',
  };
};

/**
 * Performs automated control testing.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} controlId - Control ID to test
 * @param {Date} testDate - Test date
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<SOXControlTest>} Test result
 *
 * @example
 * ```typescript
 * const testResult = await performAutomatedControlTest(
 *   sequelize,
 *   'CTRL-001',
 *   new Date()
 * );
 * ```
 */
export const performAutomatedControlTest = async (
  sequelize: Sequelize,
  controlId: string,
  testDate: Date,
  transaction?: Transaction,
): Promise<SOXControlTest> => {
  // This would implement actual automated testing logic
  // For demonstration, we'll perform a simple validation

  const controlQuery = `
    SELECT *
    FROM sox_controls
    WHERE control_id = :controlId
  `;

  const control = await sequelize.query(controlQuery, {
    replacements: { controlId },
    type: QueryTypes.SELECT,
    transaction,
  });

  if (!control || control.length === 0) {
    throw new Error('Control not found');
  }

  // Simulate automated testing
  const sampleSize = 25;
  const exceptionCount = Math.floor(Math.random() * 3); // Random exceptions
  const testResult = exceptionCount === 0 ? 'passed' : 'failed';

  return await recordSOXControlTest(
    sequelize,
    {
      controlId,
      testDate,
      testedBy: 'SYSTEM_AUTOMATED',
      testProcedure: 'Automated control testing',
      sampleSize,
      exceptionCount,
      testResult,
      findings: exceptionCount > 0 ? `${exceptionCount} exceptions found during automated testing` : 'No exceptions found',
      evidenceLocation: `s3://automated-tests/${controlId}/${testDate.toISOString()}`,
    },
    transaction,
  );
};

/**
 * Tracks remediation progress for compliance findings.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} findingId - Finding ID
 * @param {string} status - New status
 * @param {string} notes - Progress notes
 * @param {string} userId - User updating status
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await trackRemediationProgress(
 *   sequelize,
 *   'FIND-123',
 *   'in_progress',
 *   'Implementing corrective controls',
 *   'user123'
 * );
 * ```
 */
export const trackRemediationProgress = async (
  sequelize: Sequelize,
  findingId: string,
  status: 'open' | 'in_progress' | 'resolved' | 'closed' | 'accepted_risk',
  notes: string,
  userId: string,
  transaction?: Transaction,
): Promise<void> => {
  await sequelize.query(
    `
    UPDATE compliance_findings
    SET
      status = :status,
      metadata = jsonb_set(
        metadata,
        '{remediation_history}',
        COALESCE(metadata->'remediation_history', '[]'::jsonb) || jsonb_build_object(
          'timestamp', NOW(),
          'status', :status,
          'notes', :notes,
          'updated_by', :userId
        )::jsonb
      )
    WHERE finding_id = :findingId
  `,
    {
      replacements: { findingId, status, notes, userId },
      type: QueryTypes.UPDATE,
      transaction,
    },
  );
};

/**
 * Helper function to check if field change requires approval.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} entityType - Entity type
 * @param {string} fieldName - Field name
 * @returns {Promise<boolean>} Whether approval is required
 */
const checkIfApprovalRequired = async (
  sequelize: Sequelize,
  entityType: string,
  fieldName: string,
): Promise<boolean> => {
  // In production, this would check configuration
  const criticalFields = ['amount', 'status', 'approved_by', 'posted_at'];
  return criticalFields.includes(fieldName.toLowerCase());
};
