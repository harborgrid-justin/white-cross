import { Model, DataTypes, Sequelize } from 'sequelize';
import { AlertSeverity, AlertCategory } from './AlertInstance';

export enum DeliveryChannel {
  WEBSOCKET = 'WEBSOCKET',
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  PUSH_NOTIFICATION = 'PUSH',
  IN_APP = 'IN_APP',
  PHONE_CALL = 'PHONE_CALL',
}

export interface AlertSubscriptionAttributes {
  id: string;
  userId: string;
  schoolId?: string;
  channels: DeliveryChannel[];
  severityFilter: AlertSeverity[];
  categoryFilter: AlertCategory[];
  quietHoursStart?: string;
  quietHoursEnd?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AlertSubscriptionCreationAttributes extends Omit<AlertSubscriptionAttributes, 'id' | 'createdAt' | 'updatedAt'> {
  id?: string;
}

/**
 * AlertSubscription Model
 * User notification preferences for real-time alerts
 */
class AlertSubscription extends Model<AlertSubscriptionAttributes, AlertSubscriptionCreationAttributes> implements AlertSubscriptionAttributes {
  public id!: string;
  public userId!: string;
  public schoolId?: string;
  public channels!: DeliveryChannel[];
  public severityFilter!: AlertSeverity[];
  public categoryFilter!: AlertCategory[];
  public quietHoursStart?: string;
  public quietHoursEnd?: string;
  public isActive!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associations
  public readonly user?: any;

  public static initialize(sequelize: Sequelize): typeof AlertSubscription {
    AlertSubscription.init(
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
        schoolId: {
          type: DataTypes.UUID,
          allowNull: true,
          field: 'school_id',
        },
        channels: {
          type: DataTypes.ARRAY(DataTypes.ENUM(...Object.values(DeliveryChannel))),
          allowNull: false,
          defaultValue: [DeliveryChannel.WEBSOCKET],
          field: 'channels',
        },
        severityFilter: {
          type: DataTypes.ARRAY(DataTypes.ENUM(...Object.values(AlertSeverity))),
          allowNull: false,
          defaultValue: Object.values(AlertSeverity),
          field: 'severity_filter',
        },
        categoryFilter: {
          type: DataTypes.ARRAY(DataTypes.ENUM(...Object.values(AlertCategory))),
          allowNull: false,
          defaultValue: Object.values(AlertCategory),
          field: 'category_filter',
        },
        quietHoursStart: {
          type: DataTypes.TIME,
          allowNull: true,
          field: 'quiet_hours_start',
        },
        quietHoursEnd: {
          type: DataTypes.TIME,
          allowNull: true,
          field: 'quiet_hours_end',
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
          field: 'is_active',
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
        tableName: 'alert_subscriptions',
        modelName: 'AlertSubscription',
        timestamps: true,
        underscored: true,
      }
    );
    return AlertSubscription;
  }

  public static associate(models: any): void {
    AlertSubscription.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  }
}

export default AlertSubscription;
