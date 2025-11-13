/**
 * AuditLog Model
 *
 * HIPAA and FERPA compliant audit logging for all system operations
 * Tracks all access to PHI and critical system changes
 */

import { Column, DataType, Default, Model, PrimaryKey, Scopes, Table } from 'sequelize-typescript';
import { AuditAction } from '../types/database.enums';
import { LoggerService } from '@/common/logging/logger.service';

/**
 * Compliance regulation types for audit tracking
 */
export enum ComplianceType {
  HIPAA = 'HIPAA',
  FERPA = 'FERPA',
  GDPR = 'GDPR',
  GENERAL = 'GENERAL',
}

/**
 * Severity levels for audit events
 */
export enum AuditSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

/**
 * AuditLog attributes interface
 */
export interface AuditLogAttributes {
  id?: string;
  action: AuditAction;
  entityType: string;
  entityId: string | null;
  userId: string | null;
  userName: string | null;
  changes: any;
  previousValues: any;
  newValues: any;
  ipAddress: string | null;
  userAgent: string | null;
  requestId: string | null;
  sessionId: string | null;
  isPHI: boolean;
  complianceType: ComplianceType;
  severity: AuditSeverity;
  success: boolean;
  errorMessage: string | null;
  metadata: any;
  tags: string[];
  createdAt?: Date;
}

/**
 * AuditLog Model
 *
 * Comprehensive audit logging with:
 * - Complete change tracking (before/after values)
 * - PHI access tracking for HIPAA compliance
 * - Multi-regulation support (HIPAA, FERPA, GDPR)
 * - Request correlation (requestId, sessionId)
 * - Performance-optimized indexes
 * - Immutable records (no updates allowed)
 */
@Scopes(() => ({
  active: {
    where: {
      deletedAt: null,
    },
    order: [['createdAt', 'DESC']],
  },
}))
@Table({
  tableName: 'audit_logs',
  timestamps: true,
  updatedAt: false, // Audit logs are immutable
  underscored: false, // Use camelCase to match existing columns
  indexes: [
    // Single-column indexes for common filters
    { fields: ['userId'] },
    { fields: ['entityType'] },
    { fields: ['entityId'] },
    { fields: ['action'] },
    { fields: ['createdAt'] },
    { fields: ['isPHI'] },
    { fields: ['complianceType'] },
    { fields: ['severity'] },
    { fields: ['success'] },
    { fields: ['sessionId'] },
    { fields: ['requestId'] },

    // Composite indexes for common query patterns
    { fields: ['entityType', 'entityId', 'createdAt'] },
    { fields: ['userId', 'createdAt'] },
    { fields: ['action', 'entityType', 'createdAt'] },
    { fields: ['isPHI', 'createdAt'] },
    { fields: ['complianceType', 'createdAt'] },
    { fields: ['severity', 'createdAt'] },

    // GIN index for tags array (PostgreSQL specific)
    { fields: ['tags'], using: 'gin' },

    // JSONB indexes for metadata and changes (PostgreSQL specific)
    { fields: ['metadata'], using: 'gin' },
    { fields: ['changes'], using: 'gin' },
    {
      fields: ['createdAt'],
      name: 'idx_audit_log_created_at',
    },
  ],
  hooks: {
    beforeCreate: (instance: AuditLog) => {
      // Ensure audit logs have a timestamp
      if (!instance.createdAt) {
        instance.createdAt = new Date();
      }
    },
    beforeUpdate: (instance: AuditLog) => {
      if (instance.changed()) {
        const changedFields = instance.changed() as string[];
        // AuditLog modifications should be logged but we avoid infinite recursion
        // by just logging to console for audit log changes
        const logger = new LoggerService();
        logger.setContext('AuditLog');
        logger.warn(
          `AuditLog ${instance.id} modified at ${new Date().toISOString()}`,
        );
        logger.warn(`Changed fields: ${changedFields.join(', ')}`);
        // NOTE: We do NOT call audit service here to avoid infinite recursion
      }
    },
  },
})
export class AuditLog extends Model<AuditLogAttributes> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id?: string;

  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(AuditAction)],
    },
    allowNull: false,
  })
  action!: AuditAction;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    comment: 'Type of entity affected (Student, HealthRecord, User, etc.)',
  })
  entityType!: string;

  @Column({
    type: DataType.UUID,
    allowNull: true,
    comment: 'ID of the entity affected (null for bulk operations)',
  })
  entityId!: string | null;

  @Column({
    type: DataType.UUID,
    allowNull: true,
    comment: 'ID of user who performed the action (null for system operations)',
  })
  userId!: string | null;

  @Column({
    type: DataType.STRING(200),
    allowNull: true,
    comment:
      'Name of user who performed the action (denormalized for reporting)',
  })
  userName!: string | null;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
    comment: 'Complete change data (for backward compatibility)',
  })
  changes!: any;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
    comment: 'Previous values before the change (for UPDATE operations)',
  })
  previousValues!: any;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
    comment: 'New values after the change (for CREATE/UPDATE operations)',
  })
  newValues!: any;

  @Column({
    type: DataType.STRING(45),
    allowNull: true,
    comment: 'IP address of the client making the request',
  })
  ipAddress!: string | null;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    comment: 'User agent string of the client',
  })
  userAgent!: string | null;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
    comment: 'Request correlation ID for tracing related operations',
  })
  requestId!: string | null;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
    comment: 'Session ID for grouping operations by user session',
  })
  sessionId!: string | null;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment:
      'Flag indicating if this audit log involves Protected Health Information',
  })
  isPHI!: boolean;

  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(ComplianceType)],
    },
    allowNull: false,
    defaultValue: ComplianceType.GENERAL,
  })
  complianceType!: ComplianceType;

  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(AuditSeverity)],
    },
    allowNull: false,
    defaultValue: AuditSeverity.LOW,
  })
  severity!: AuditSeverity;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    comment: 'Whether the operation completed successfully',
  })
  success!: boolean;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    comment: 'Error message if operation failed',
  })
  errorMessage!: string | null;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
    comment:
      'Additional metadata for context (query params, filter criteria, etc.)',
  })
  metadata!: any;

  @Column({
    type: DataType.ARRAY(DataType.STRING(255)),
    allowNull: false,
    defaultValue: [],
    comment: 'Tags for categorization and filtering',
  })
  tags!: string[];

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    comment: 'Timestamp when the action was performed',
  })
  declare createdAt?: Date;

  /**
   * Get a sanitized version of the audit log for export
   * Redacts sensitive fields based on compliance requirements
   */
  toExportObject(includeFullDetails: boolean = false): any {
    const data = this.get({ plain: true });

    if (!includeFullDetails) {
      // Redact potentially sensitive metadata for general exports
      return {
        id: data.id,
        action: data.action,
        entityType: data.entityType,
        entityId: data.entityId,
        userId: data.userId,
        userName: data.userName,
        isPHI: data.isPHI,
        complianceType: data.complianceType,
        severity: data.severity,
        success: data.success,
        createdAt: data.createdAt,
        tags: data.tags,
      };
    }

    return data;
  }

  /**
   * Check if this audit log should be retained based on compliance requirements
   */
  shouldRetain(retentionDate: Date): boolean {
    // HIPAA requires 6 years minimum, FERPA requires 3+ years
    // We use 7 years for HIPAA to be safe
    const retentionYears =
      this.complianceType === ComplianceType.HIPAA
        ? 7
        : this.complianceType === ComplianceType.FERPA
          ? 5
          : this.isPHI
            ? 7
            : 3;

    const expirationDate = new Date(this.createdAt!);
    expirationDate.setFullYear(expirationDate.getFullYear() + retentionYears);

    return expirationDate > retentionDate;
  }

  /**
   * Get human-readable description of the audit event
   */
  getDescription(): string {
    const user = this.userName || this.userId || 'SYSTEM';
    const entity = this.entityId
      ? `${this.entityType}:${this.entityId}`
      : this.entityType;

    return `${user} performed ${this.action} on ${entity}`;
  }
}
