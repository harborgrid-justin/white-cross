import { Model, DataTypes, Optional, Sequelize } from 'sequelize';

export enum AlertSeverity {
  INFO = 'INFO',
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
  EMERGENCY = 'EMERGENCY',
}

export enum AlertCategory {
  MEDICATION = 'MEDICATION',
  ALLERGY = 'ALLERGY',
  CHRONIC_CONDITION = 'CHRONIC_CONDITION',
  EMERGENCY_ACTION = 'EMERGENCY_ACTION',
  OUTBREAK = 'OUTBREAK',
  DRUG_INTERACTION = 'DRUG_INTERACTION',
  COMPLIANCE = 'COMPLIANCE',
  SECURITY = 'SECURITY',
  SYSTEM = 'SYSTEM',
}

export enum AlertStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  ACKNOWLEDGED = 'ACKNOWLEDGED',
  RESOLVED = 'RESOLVED',
  ESCALATED = 'ESCALATED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
}

export interface AlertInstanceAttributes {
  id: string;
  definitionId?: string;
  title: string;
  message: string;
  severity: AlertSeverity;
  category: AlertCategory;
  status: AlertStatus;
  studentId?: string;
  relatedEntityType?: string;
  relatedEntityId?: string;
  metadata?: Record<string, any>;
  actionRequired?: string;
  actionUrl?: string;
  triggeredAt: Date;
  acknowledgedAt?: Date;
  acknowledgedBy?: string;
  resolvedAt?: Date;
  resolvedBy?: string;
  resolutionNotes?: string;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AlertInstanceCreationAttributes
  extends Optional<AlertInstanceAttributes, 'id' | 'status' | 'triggeredAt' | 'createdAt' | 'updatedAt'> {}

/**
 * AlertInstance Model
 * Real-time emergency and health alert management
 *
 * Supports WebSocket-based notifications for critical health events
 */
class AlertInstance extends Model<AlertInstanceAttributes, AlertInstanceCreationAttributes> implements AlertInstanceAttributes {
  public id!: string;
  public definitionId?: string;
  public title!: string;
  public message!: string;
  public severity!: AlertSeverity;
  public category!: AlertCategory;
  public status!: AlertStatus;
  public studentId?: string;
  public relatedEntityType?: string;
  public relatedEntityId?: string;
  public metadata?: Record<string, any>;
  public actionRequired?: string;
  public actionUrl?: string;
  public triggeredAt!: Date;
  public acknowledgedAt?: Date;
  public acknowledgedBy?: string;
  public resolvedAt?: Date;
  public resolvedBy?: string;
  public resolutionNotes?: string;
  public expiresAt?: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  /**
   * Check if alert is active and not expired
   */
  public isActive(): boolean {
    if (this.status !== AlertStatus.ACTIVE) {
      return false;
    }
    if (this.expiresAt && new Date() > this.expiresAt) {
      return false;
    }
    return true;
  }

  /**
   * Check if alert requires immediate attention
   */
  public requiresImmediateAttention(): boolean {
    return (
      this.severity === AlertSeverity.CRITICAL ||
      this.severity === AlertSeverity.EMERGENCY
    ) && this.isActive();
  }

  /**
   * Acknowledge the alert
   */
  public async acknowledge(userId: string): Promise<void> {
    this.status = AlertStatus.ACKNOWLEDGED;
    this.acknowledgedAt = new Date();
    this.acknowledgedBy = userId;
    await this.save();
  }

  /**
   * Resolve the alert
   */
  public async resolve(userId: string, notes?: string): Promise<void> {
    this.status = AlertStatus.RESOLVED;
    this.resolvedAt = new Date();
    this.resolvedBy = userId;
    this.resolutionNotes = notes;
    await this.save();
  }

  /**
   * Initialize the AlertInstance model
   */
  public static initialize(sequelize: Sequelize): typeof AlertInstance {
    AlertInstance.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        definitionId: {
          type: DataTypes.UUID,
          allowNull: true,
          field: 'definition_id',
        },
        title: {
          type: DataTypes.STRING(500),
          allowNull: false,
        },
        message: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        severity: {
          type: DataTypes.ENUM(...Object.values(AlertSeverity)),
          allowNull: false,
        },
        category: {
          type: DataTypes.ENUM(...Object.values(AlertCategory)),
          allowNull: false,
        },
        status: {
          type: DataTypes.ENUM(...Object.values(AlertStatus)),
          allowNull: false,
          defaultValue: AlertStatus.ACTIVE,
        },
        studentId: {
          type: DataTypes.UUID,
          allowNull: true,
          field: 'student_id',
        },
        relatedEntityType: {
          type: DataTypes.STRING(100),
          allowNull: true,
          field: 'related_entity_type',
        },
        relatedEntityId: {
          type: DataTypes.UUID,
          allowNull: true,
          field: 'related_entity_id',
        },
        metadata: {
          type: DataTypes.JSONB,
          allowNull: true,
        },
        actionRequired: {
          type: DataTypes.TEXT,
          allowNull: true,
          field: 'action_required',
        },
        actionUrl: {
          type: DataTypes.STRING(500),
          allowNull: true,
          field: 'action_url',
        },
        triggeredAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
          field: 'triggered_at',
        },
        acknowledgedAt: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'acknowledged_at',
        },
        acknowledgedBy: {
          type: DataTypes.UUID,
          allowNull: true,
          field: 'acknowledged_by',
        },
        resolvedAt: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'resolved_at',
        },
        resolvedBy: {
          type: DataTypes.UUID,
          allowNull: true,
          field: 'resolved_by',
        },
        resolutionNotes: {
          type: DataTypes.TEXT,
          allowNull: true,
          field: 'resolution_notes',
        },
        expiresAt: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'expires_at',
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
        tableName: 'alert_instances',
        modelName: 'AlertInstance',
        timestamps: true,
        underscored: true,
        indexes: [
          { fields: ['status'] },
          { fields: ['severity'] },
          { fields: ['student_id'] },
          { fields: ['category', 'status'] },
          { fields: ['triggered_at'] },
          {
            fields: ['status', 'severity'],
            where: { status: 'ACTIVE' },
          },
        ],
      }
    );

    return AlertInstance;
  }

  /**
   * Define associations
   */
  public static associate(models: any): void {
    AlertInstance.belongsTo(models.AlertDefinition, {
      foreignKey: 'definitionId',
      as: 'definition',
    });

    AlertInstance.belongsTo(models.Student, {
      foreignKey: 'studentId',
      as: 'student',
    });

    AlertInstance.belongsTo(models.User, {
      foreignKey: 'acknowledgedBy',
      as: 'acknowledger',
    });

    AlertInstance.belongsTo(models.User, {
      foreignKey: 'resolvedBy',
      as: 'resolver',
    });

    AlertInstance.hasMany(models.AlertDeliveryLog, {
      foreignKey: 'alertId',
      as: 'deliveryLogs',
    });
  }

  /**
   * Find active alerts for a student
   */
  public static async findActiveByStudent(studentId: string): Promise<AlertInstance[]> {
    return this.findAll({
      where: {
        studentId,
        status: AlertStatus.ACTIVE,
      },
      order: [
        ['severity', 'DESC'],
        ['triggeredAt', 'DESC'],
      ],
    });
  }

  /**
   * Find critical unacknowledged alerts
   */
  public static async findCriticalUnacknowledged(): Promise<AlertInstance[]> {
    return this.findAll({
      where: {
        status: AlertStatus.ACTIVE,
        severity: [AlertSeverity.CRITICAL, AlertSeverity.EMERGENCY],
        acknowledgedAt: null,
      },
      order: [['triggeredAt', 'ASC']],
    });
  }
}

export default AlertInstance;
