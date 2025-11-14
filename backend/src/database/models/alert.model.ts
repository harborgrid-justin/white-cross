import {
  BeforeCreate,
  BeforeUpdate,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  Index,
  Model,
  PrimaryKey,
  Scopes,
  Table,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { Op } from 'sequelize';
import { createModelAuditHook } from '../services/model-audit-hooks.service';

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
@Scopes(() => ({
  active: {
    where: {
      status: AlertStatus.ACTIVE,
    },
    order: [
      ['severity', 'DESC'],
      ['createdAt', 'DESC'],
    ],
  },
  critical: {
    where: {
      severity: {
        [Op.in]: [AlertSeverity.CRITICAL, AlertSeverity.EMERGENCY],
      },
      status: {
        [Op.in]: [AlertStatus.ACTIVE, AlertStatus.ACKNOWLEDGED],
      },
    },
    order: [['createdAt', 'DESC']],
  },
  byPriority: (severity: AlertSeverity) => ({
    where: { severity },
    order: [['createdAt', 'DESC']],
  }),
  bySeverity: (severity: AlertSeverity) => ({
    where: { severity },
    order: [['createdAt', 'DESC']],
  }),
  byCategory: (category: AlertCategory) => ({
    where: { category },
    order: [['createdAt', 'DESC']],
  }),
  byStudent: (studentId: string) => ({
    where: { studentId },
    order: [['createdAt', 'DESC']],
  }),
  byUser: (userId: string) => ({
    where: { userId },
    order: [['createdAt', 'DESC']],
  }),
  bySchool: (schoolId: string) => ({
    where: { schoolId },
    order: [['createdAt', 'DESC']],
  }),
  unacknowledged: {
    where: {
      status: AlertStatus.ACTIVE,
      requiresAcknowledgment: true,
      acknowledgedAt: null,
    },
    order: [
      ['severity', 'DESC'],
      ['createdAt', 'ASC'],
    ],
  },
  needsEscalation: {
    where: {
      status: AlertStatus.ACTIVE,
      autoEscalateAfter: {
        [Op.ne]: null,
      },
      acknowledgedAt: null,
    },
  },
  recent: {
    where: {
      createdAt: {
        [Op.gte]: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
    },
    order: [['createdAt', 'DESC']],
  },
}))
@Table({
  tableName: 'alerts',
  timestamps: true,
  underscored: false,
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
      fields: ['userId'],
      name: 'alerts_user_id_idx',
    },
    {
      fields: ['studentId'],
      name: 'alerts_student_id_idx',
    },
    {
      fields: ['schoolId'],
      name: 'alerts_school_id_idx',
    },
    {
      fields: ['createdAt'],
      name: 'alerts_created_at_idx',
    },
    {
      fields: ['status', 'severity', 'createdAt'],
      name: 'alerts_status_severity_created_idx',
    },
    {
      fields: ['createdAt'],
      name: 'idx_alert_created_at',
    },
    {
      fields: ['updatedAt'],
      name: 'idx_alert_updated_at',
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
  })
  definitionId?: string;

  @BelongsTo(() => require('./alert-rule.model').AlertRule, {
    foreignKey: 'definitionId',
    as: 'definition',
  })
  declare definition?: any;

  /**
   * Alert severity level
   */
  @Index
  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(AlertSeverity)],
    },
    allowNull: false,
  })
  severity: AlertSeverity;

  /**
   * Alert category
   */
  @Index
  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(AlertCategory)],
    },
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
  })
  studentId?: string;

  @BelongsTo(() => require('./student.model').Student, {
    foreignKey: 'studentId',
    as: 'student',
  })
  declare student?: any;

  /**
   * User associated with this alert
   */
  @Index
  @ForeignKey(() => require('./user.model').User)
  @Column({
    type: DataType.UUID,
  })
  userId?: string;

  @BelongsTo(() => require('./user.model').User, {
    foreignKey: 'userId',
    as: 'user',
  })
  declare user?: any;

  /**
   * School associated with this alert
   */
  @Index
  @ForeignKey(() => require('./school.model').School)
  @Column({
    type: DataType.UUID,
  })
  schoolId?: string;

  @BelongsTo(() => require('./school.model').School, {
    foreignKey: 'schoolId',
    as: 'school',
  })
  declare school?: any;

  /**
   * Current alert status
   */
  @Index
  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(AlertStatus)],
    },
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
  })
  createdBy: string;

  @BelongsTo(() => require('./user.model').User, {
    foreignKey: 'createdBy',
    as: 'creator',
  })
  declare creator?: any;

  /**
   * When alert was acknowledged
   */
  @Column({
    type: DataType.DATE,
  })
  acknowledgedAt?: Date;

  /**
   * User who acknowledged the alert
   */
  @ForeignKey(() => require('./user.model').User)
  @Column({
    type: DataType.UUID,
  })
  acknowledgedBy?: string;

  @BelongsTo(() => require('./user.model').User, {
    foreignKey: 'acknowledgedBy',
    as: 'acknowledger',
  })
  declare acknowledger?: any;

  /**
   * When alert was resolved
   */
  @Column({
    type: DataType.DATE,
  })
  resolvedAt?: Date;

  /**
   * User who resolved the alert
   */
  @ForeignKey(() => require('./user.model').User)
  @Column({
    type: DataType.UUID,
  })
  resolvedBy?: string;

  @BelongsTo(() => require('./user.model').User, {
    foreignKey: 'resolvedBy',
    as: 'resolver',
  })
  declare resolver?: any;

  /**
   * When alert expires
   */
  @Column({
    type: DataType.DATE,
  })
  expiresAt?: Date;

  /**
   * Auto-escalate after this many minutes
   */
  @Column({
    type: DataType.INTEGER,
  })
  autoEscalateAfter?: number;

  /**
   * Current escalation level
   */
  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  escalationLevel?: number;

  /**
   * Whether acknowledgment is required
   */
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  requiresAcknowledgment: boolean;

  @Index
  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  declare createdAt?: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
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
    if (
      !this.autoEscalateAfter ||
      this.status !== AlertStatus.ACTIVE ||
      this.acknowledgedAt
    ) {
      return false;
    }

    const minutesSinceCreation =
      (Date.now() - this.createdAt!.getTime()) / (1000 * 60);
    return minutesSinceCreation >= this.autoEscalateAfter;
  }

  // Hooks for HIPAA compliance
  @BeforeCreate
  @BeforeUpdate
  static async auditPHIAccess(instance: Alert) {
    await createModelAuditHook('Alert', instance);
  }
}

// Default export for Sequelize-TypeScript
export default Alert;
