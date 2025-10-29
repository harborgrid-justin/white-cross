import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  ForeignKey,
  BelongsTo,
  HasMany,
  Index,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
;
;
;
;

/**
 * Alert Severity Levels
 */
export enum AlertSeverity {
  INFO = 'INFO',
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
  EMERGENCY = 'EMERGENCY',
}

/**
 * Alert Categories
 */
export enum AlertCategory {
  HEALTH = 'HEALTH',
  SAFETY = 'SAFETY',
  COMPLIANCE = 'COMPLIANCE',
  SYSTEM = 'SYSTEM',
  MEDICATION = 'MEDICATION',
  APPOINTMENT = 'APPOINTMENT',
}

/**
 * Alert Status
 */
export enum AlertStatus {
  ACTIVE = 'ACTIVE',
  ACKNOWLEDGED = 'ACKNOWLEDGED',
  RESOLVED = 'RESOLVED',
  EXPIRED = 'EXPIRED',
  DISMISSED = 'DISMISSED',
}

/**
 * Alert Attributes Interface
 */
export interface AlertAttributes {
  id?: string;
  definitionId?: string;
  severity: AlertSeverity;
  category: AlertCategory;
  title: string;
  message: string;
  studentId?: string;
  userId?: string;
  schoolId?: string;
  status: AlertStatus;
  metadata?: Record<string, any>;
  createdBy: string;
  acknowledgedAt?: Date;
  acknowledgedBy?: string;
  resolvedAt?: Date;
  resolvedBy?: string;
  expiresAt?: Date;
  autoEscalateAfter?: number;
  escalationLevel?: number;
  requiresAcknowledgment: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Alert Model
 *
 * Represents a real-time alert in the White Cross system.
 * Supports multi-channel delivery and lifecycle management.
 *
 * Features:
 * - Multiple severity levels
 * - Status lifecycle (ACTIVE -> ACKNOWLEDGED -> RESOLVED)
 * - Auto-escalation support
 * - Expiration handling
 * - Rich metadata storage
 *
 * Indexes:
 * - severity for priority queries
 * - status for filtering active alerts
 * - userId, studentId, schoolId for scope queries
 * - createdAt for chronological ordering
 */
@Table({
  tableName: 'alerts',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['severity'],
      name: 'alerts_severity_idx',
    },
    {
      fields: ['status'],
      name: 'alerts_status_idx',
    },
    {
      fields: ['category'],
      name: 'alerts_category_idx',
    },
    {
      fields: ['user_id'],
      name: 'alerts_user_id_idx',
    },
    {
      fields: ['student_id'],
      name: 'alerts_student_id_idx',
    },
    {
      fields: ['school_id'],
      name: 'alerts_school_id_idx',
    },
    {
      fields: ['created_at'],
      name: 'alerts_created_at_idx',
    },
    {
      fields: ['status', 'severity', 'created_at'],
      name: 'alerts_status_severity_created_idx',
    },
  ],
})
export class Alert extends Model<AlertAttributes> implements AlertAttributes {
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id: string;

  /**
   * Optional reference to alert definition/rule
   */
  @ForeignKey(() => require('./alert-rule.model').AlertRule)
  @Column({
    type: DataType.UUID,
    field: 'definition_id',
  })
  definitionId?: string;

  @BelongsTo(() => require('./alert-rule.model').AlertRule, { foreignKey: 'definitionId', as: 'definition' })
  declare definition?: any;

  /**
   * Alert severity level
   */
  @Index
  @Column({
    type: DataType.ENUM(...(Object.values(AlertSeverity) as string[])),
    allowNull: false,
  })
  severity: AlertSeverity;

  /**
   * Alert category
   */
  @Index
  @Column({
    type: DataType.ENUM(...(Object.values(AlertCategory) as string[])),
    allowNull: false,
  })
  category: AlertCategory;

  /**
   * Alert title/headline
   */
  @Column({
    type: DataType.STRING(500),
    allowNull: false,
  })
  title: string;

  /**
   * Alert message/body
   */
  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  message: string;

  /**
   * Student associated with this alert
   */
  @Index
  @ForeignKey(() => require('./student.model').Student)
  @Column({
    type: DataType.UUID,
    field: 'student_id',
  })
  studentId?: string;

  @BelongsTo(() => require('./student.model').Student, { foreignKey: 'studentId', as: 'student' })
  declare student?: any;

  /**
   * User associated with this alert
   */
  @Index
  @ForeignKey(() => require('./user.model').User)
  @Column({
    type: DataType.UUID,
    field: 'user_id',
  })
  userId?: string;

  @BelongsTo(() => require('./user.model').User, { foreignKey: 'userId', as: 'user' })
  declare user?: any;

  /**
   * School associated with this alert
   */
  @Index
  @ForeignKey(() => require('./school.model').School)
  @Column({
    type: DataType.UUID,
    field: 'school_id',
  })
  schoolId?: string;

  @BelongsTo(() => require('./school.model').School, { foreignKey: 'schoolId', as: 'school' })
  declare school?: any;

  /**
   * Current alert status
   */
  @Index
  @Column({
    type: DataType.ENUM(...(Object.values(AlertStatus) as string[])),
    allowNull: false,
    defaultValue: AlertStatus.ACTIVE,
  })
  status: AlertStatus;

  /**
   * Additional metadata
   */
  @Column(DataType.JSONB)
  metadata?: Record<string, any>;

  /**
   * User who created this alert
   */
  @ForeignKey(() => require('./user.model').User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'created_by',
  })
  createdBy: string;

  @BelongsTo(() => require('./user.model').User, { foreignKey: 'createdBy', as: 'creator' })
  declare creator?: any;

  /**
   * When alert was acknowledged
   */
  @Column({
    type: DataType.DATE,
    field: 'acknowledged_at',
  })
  acknowledgedAt?: Date;

  /**
   * User who acknowledged the alert
   */
  @ForeignKey(() => require('./user.model').User)
  @Column({
    type: DataType.UUID,
    field: 'acknowledged_by',
  })
  acknowledgedBy?: string;

  @BelongsTo(() => require('./user.model').User, { foreignKey: 'acknowledgedBy', as: 'acknowledger' })
  declare acknowledger?: any;

  /**
   * When alert was resolved
   */
  @Column({
    type: DataType.DATE,
    field: 'resolved_at',
  })
  resolvedAt?: Date;

  /**
   * User who resolved the alert
   */
  @ForeignKey(() => require('./user.model').User)
  @Column({
    type: DataType.UUID,
    field: 'resolved_by',
  })
  resolvedBy?: string;

  @BelongsTo(() => require('./user.model').User, { foreignKey: 'resolvedBy', as: 'resolver' })
  declare resolver?: any;

  /**
   * When alert expires
   */
  @Column({
    type: DataType.DATE,
    field: 'expires_at',
  })
  expiresAt?: Date;

  /**
   * Auto-escalate after this many minutes
   */
  @Column({
    type: DataType.INTEGER,
    field: 'auto_escalate_after',
  })
  autoEscalateAfter?: number;

  /**
   * Current escalation level
   */
  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
    field: 'escalation_level',
  })
  escalationLevel?: number;

  /**
   * Whether acknowledgment is required
   */
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'requires_acknowledgment',
  })
  requiresAcknowledgment: boolean;

  @Index
  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    field: 'created_at',
  })
  declare createdAt?: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    field: 'updated_at',
  })
  declare updatedAt?: Date;

  /**
   * Check if alert is expired
   */
  isExpired(): boolean {
    if (!this.expiresAt) {
      return false;
    }
    return new Date() > this.expiresAt;
  }

  /**
   * Check if alert needs escalation
   */
  needsEscalation(): boolean {
    if (!this.autoEscalateAfter || this.status !== AlertStatus.ACTIVE || this.acknowledgedAt) {
      return false;
    }

    const minutesSinceCreation = (Date.now() - this.createdAt!.getTime()) / (1000 * 60);
    return minutesSinceCreation >= this.autoEscalateAfter;
  }
}
