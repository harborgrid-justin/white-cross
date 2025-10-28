import { Model, DataTypes, Sequelize } from 'sequelize';

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

export interface AlertDefinitionAttributes {
  id: string;
  name: string;
  description?: string;
  category: AlertCategory;
  severity: AlertSeverity;
  conditions: Record<string, any>;
  enabled: boolean;
  autoEscalate: boolean;
  escalationThresholdMinutes?: number;
  requiresAcknowledgment: boolean;
  expiresAfterMinutes?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AlertDefinitionCreationAttributes extends Omit<AlertDefinitionAttributes, 'id' | 'createdAt' | 'updatedAt'> {
  id?: string;
}

/**
 * AlertDefinition Model
 * Defines alert rules and configuration for automated alert generation
 */
class AlertDefinition extends Model<AlertDefinitionAttributes, AlertDefinitionCreationAttributes> implements AlertDefinitionAttributes {
  public id!: string;
  public name!: string;
  public description?: string;
  public category!: AlertCategory;
  public severity!: AlertSeverity;
  public conditions!: Record<string, any>;
  public enabled!: boolean;
  public autoEscalate!: boolean;
  public escalationThresholdMinutes?: number;
  public requiresAcknowledgment!: boolean;
  public expiresAfterMinutes?: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static initialize(sequelize: Sequelize): typeof AlertDefinition {
    AlertDefinition.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING(255),
          allowNull: false,
          field: 'name',
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
          field: 'description',
        },
        category: {
          type: DataTypes.ENUM(...Object.values(AlertCategory)),
          allowNull: false,
          field: 'category',
        },
        severity: {
          type: DataTypes.ENUM(...Object.values(AlertSeverity)),
          allowNull: false,
          field: 'severity',
        },
        conditions: {
          type: DataTypes.JSONB,
          allowNull: false,
          field: 'conditions',
        },
        enabled: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
          field: 'enabled',
        },
        autoEscalate: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
          field: 'auto_escalate',
        },
        escalationThresholdMinutes: {
          type: DataTypes.INTEGER,
          allowNull: true,
          field: 'escalation_threshold_minutes',
        },
        requiresAcknowledgment: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
          field: 'requires_acknowledgment',
        },
        expiresAfterMinutes: {
          type: DataTypes.INTEGER,
          allowNull: true,
          field: 'expires_after_minutes',
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
        tableName: 'alert_definitions',
        modelName: 'AlertDefinition',
        timestamps: true,
        underscored: true,
      }
    );
    return AlertDefinition;
  }

  public static associate(models: any): void {
    // AlertDefinition.hasMany(models.AlertInstance, { foreignKey: 'definitionId', as: 'instances' });
  }
}

export default AlertDefinition;
