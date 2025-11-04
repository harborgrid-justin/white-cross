import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  ForeignKey,
  BelongsTo,
  Index
  } ,
  Scopes,
  BeforeCreate,
  BeforeUpdate
  } from 'sequelize-typescript';
import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

/**
 * Alert Severity Levels
 */
export enum AlertSeverity {
  INFO = 'INFO',
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
  EMERGENCY = 'EMERGENCY'
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
  APPOINTMENT = 'APPOINTMENT'
  }

/**
 * Trigger Condition Interface
 */
export interface TriggerCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'regex';
  value: any;
  dataType?: 'string' | 'number' | 'boolean' | 'date';
}

/**
 * Notification Channel Interface
 */
export interface NotificationChannel {
  type: 'websocket' | 'email' | 'sms' | 'push';
  enabled: boolean;
  config?: Record<string, any>;
}

/**
 * Alert Rule Attributes
 */
export interface AlertRuleAttributes {
  id: string;
  name: string;
  description?: string;
  category: AlertCategory;
  severity: AlertSeverity;
  isActive: boolean;
  priority: number;
  triggerConditions: TriggerCondition[];
  notificationChannels: NotificationChannel[];
  targetRoles?: string[];
  targetUsers?: string[];
  schoolId?: string;
  districtId?: string;
  autoEscalateAfter?: number; // minutes
  cooldownPeriod?: number; // minutes
  requiresAcknowledgment: boolean;
  expiresAfter?: number; // minutes
  metadata?: Record<string, any>;
  createdBy?: string;
  updatedBy?: string;
  lastTriggered?: Date;
  triggerCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Alert Rule Model
 *
 * Defines rules for generating and routing alerts in the White Cross system.
 * Supports complex trigger conditions and multi-channel delivery.
 *
 * Features:
 * - Complex trigger condition evaluation
 * - Multi-channel notification routing
 * - Role and user-based targeting
 * - Auto-escalation support
 * - Cooldown period to prevent alert spam
 * - Priority-based alert ordering
 *
 * Use Cases:
 * - Medication administration alerts
 * - Critical health condition notifications
 * - Appointment reminders
 * - Compliance violation alerts
 * - System health monitoring
 *
 * Indexes:
 * - category for filtering by alert type
 * - severity for priority sorting
 * - isActive for active rule queries
 * - priority for rule evaluation order
 */
@Scopes(() => ({
  active: {
    where: {
      deletedAt: null
    },
    order: [['createdAt', 'DESC']]
  }
}))
@Table({
  tableName: 'alert_rules',
  timestamps: true,
  underscored: false,
  indexes: [
    {
      fields: ['category'],
      name: 'alert_rules_category_idx'
  },
    {
      fields: ['severity'],
      name: 'alert_rules_severity_idx'
  },
    {
      fields: ['isActive'],
      name: 'alert_rules_is_active_idx'
  },
    {
      fields: ['priority'],
      name: 'alert_rules_priority_idx'
  },
    {
      fields: ['schoolId'],
      name: 'alert_rules_school_id_idx'
  },
    {
      fields: ['districtId'],
      name: 'alert_rules_district_id_idx'
  },
    {
      fields: ['category', 'isActive', 'priority'],
      name: 'alert_rules_active_category_priority_idx'
  },,
    {
      fields: ['createdAt'],
      name: 'idx_alert_rule_created_at'
    },
    {
      fields: ['updatedAt'],
      name: 'idx_alert_rule_updated_at'
    }
  ]
  })
export class AlertRule extends Model<AlertRuleAttributes> implements AlertRuleAttributes {
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id: string;

  /**
   * Rule name (must be unique and descriptive)
   */
  @Column({
    type: DataType.STRING(200),
    allowNull: false,
    unique: true
  })
  name: string;

  /**
   * Detailed description of the rule
   */
  @Column(DataType.TEXT)
  description?: string;

  /**
   * Alert category
   */
  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(AlertCategory)]
    },
    allowNull: false
  })
  category: AlertCategory;

  /**
   * Alert severity level
   */
  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(AlertSeverity)]
    },
    allowNull: false
  })
  severity: AlertSeverity;

  /**
   * Whether this rule is currently active
   */
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true
  })
  isActive: boolean;

  /**
   * Rule priority (higher = more important, evaluated first)
   */
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0
  })
  priority: number;

  /**
   * Conditions that trigger this alert
   */
  @Column({
    type: DataType.JSONB,
    allowNull: false
  })
  triggerConditions: TriggerCondition[];

  /**
   * Notification channels to use for this alert
   */
  @Column({
    type: DataType.JSONB,
    allowNull: false,
    defaultValue: []
  })
  notificationChannels: NotificationChannel[];

  /**
   * Roles that should receive this alert
   */
  @Column({
    type: DataType.ARRAY(DataType.STRING(255))
  })
  targetRoles?: string[];

  /**
   * Specific users that should receive this alert
   */
  @Column({
    type: DataType.ARRAY(DataType.UUID)
  })
  targetUsers?: string[];

  /**
   * School this rule applies to (null = all schools)
   */
  @Column({
    type: DataType.UUID
  })
  schoolId?: string;

  /**
   * District this rule applies to (null = all districts)
   */
  @Column({
    type: DataType.UUID
  })
  districtId?: string;

  /**
   * Auto-escalate if not acknowledged within this many minutes
   */
  @Column({
    type: DataType.INTEGER
  })
  autoEscalateAfter?: number;

  /**
   * Cooldown period in minutes before triggering again
   */
  @Column({
    type: DataType.INTEGER
  })
  cooldownPeriod?: number;

  /**
   * Whether this alert requires acknowledgment
   */
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false
  })
  requiresAcknowledgment: boolean;

  /**
   * Alert expires after this many minutes
   */
  @Column({
    type: DataType.INTEGER
  })
  expiresAfter?: number;

  /**
   * Additional metadata
   */
  @Column(DataType.JSONB)
  metadata?: Record<string, any>;

  /**
   * User who created this rule
   */
  @Column({
    type: DataType.UUID
  })
  createdBy?: string;

  /**
   * User who last updated this rule
   */
  @Column({
    type: DataType.UUID
  })
  updatedBy?: string;

  /**
   * Last time this rule was triggered
   */
  @Column({
    type: DataType.DATE
  })
  lastTriggered?: Date;

  /**
   * Total number of times this rule has been triggered
   */
  @Column({
    type: DataType.INTEGER,
    defaultValue: 0
  })
  triggerCount?: number;

  @Column({
    type: DataType.DATE
  })
  declare createdAt?: Date;

  @Column({
    type: DataType.DATE
  })
  declare updatedAt?: Date;

  /**
   * Check if rule is in cooldown period
   */
  isInCooldown(): boolean {
    if (!this.cooldownPeriod || !this.lastTriggered) {
      return false;
    }

    const cooldownMs = this.cooldownPeriod * 60 * 1000;
    const timeSinceLastTrigger = Date.now() - this.lastTriggered.getTime();

    return timeSinceLastTrigger < cooldownMs;
  }

  /**
   * Evaluate if conditions are met
   */
  evaluateConditions(data: Record<string, any>): boolean {
    // All conditions must be met (AND logic)
    return this.triggerConditions.every(condition => {
      const fieldValue = data[condition.field];

      switch (condition.operator) {
        case 'equals':
          return fieldValue === condition.value;
        case 'not_equals':
          return fieldValue !== condition.value;
        case 'greater_than':
          return fieldValue > condition.value;
        case 'less_than':
          return fieldValue < condition.value;
        case 'contains':
          return String(fieldValue).includes(String(condition.value));
        case 'regex':
          return new RegExp(condition.value).test(String(fieldValue));
        default:
          return false;
      }
    });
  }

  /**
   * Get enabled notification channels
   */
  getEnabledChannels(): NotificationChannel[] {
    return this.notificationChannels.filter(channel => channel.enabled);
  }

  /**
   * Record that this rule was triggered
   */
  async recordTrigger(): Promise<void> {
    this.lastTriggered = new Date();
    this.triggerCount = (this.triggerCount || 0) + 1;
    await this.save();
  }


  // Hooks for HIPAA compliance
  @BeforeCreate
  @BeforeUpdate
  static async auditPHIAccess(instance: AlertRule) {
    if (instance.changed()) {
      const changedFields = instance.changed() as string[];
      console.log(`[AUDIT] AlertRule ${instance.id} modified at ${new Date().toISOString()}`);
      console.log(`[AUDIT] Changed fields: ${changedFields.join(', ')}`);
      // TODO: Integrate with AuditLog service for persistent audit trail
    }
  }
}
