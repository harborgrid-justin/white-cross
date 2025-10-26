import { Model, DataTypes, Sequelize } from 'sequelize';
import { DeliveryChannel } from './AlertSubscription';

export interface AlertDeliveryLogAttributes {
  id: string;
  alertId: string;
  channel: DeliveryChannel;
  recipientId?: string;
  success: boolean;
  errorMessage?: string;
  deliveredAt?: Date;
  createdAt?: Date;
}

export interface AlertDeliveryLogCreationAttributes extends Omit<AlertDeliveryLogAttributes, 'id' | 'createdAt'> {
  id?: string;
}

/**
 * AlertDeliveryLog Model
 * Tracks delivery status of alerts across different channels
 */
class AlertDeliveryLog extends Model<AlertDeliveryLogAttributes, AlertDeliveryLogCreationAttributes> implements AlertDeliveryLogAttributes {
  public id!: string;
  public alertId!: string;
  public channel!: DeliveryChannel;
  public recipientId?: string;
  public success!: boolean;
  public errorMessage?: string;
  public deliveredAt?: Date;

  public readonly createdAt!: Date;

  public static initialize(sequelize: Sequelize): typeof AlertDeliveryLog {
    AlertDeliveryLog.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        alertId: {
          type: DataTypes.UUID,
          allowNull: false,
          field: 'alert_id',
        },
        channel: {
          type: DataTypes.ENUM(...Object.values(DeliveryChannel)),
          allowNull: false,
          field: 'channel',
        },
        recipientId: {
          type: DataTypes.UUID,
          allowNull: true,
          field: 'recipient_id',
        },
        success: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          field: 'success',
        },
        errorMessage: {
          type: DataTypes.TEXT,
          allowNull: true,
          field: 'error_message',
        },
        deliveredAt: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'delivered_at',
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
        tableName: 'alert_delivery_log',
        modelName: 'AlertDeliveryLog',
        timestamps: false,
        underscored: true,
      }
    );
    return AlertDeliveryLog;
  }

  public static associate(models: any): void {
    AlertDeliveryLog.belongsTo(models.AlertInstance, { foreignKey: 'alertId', as: 'alert' });
  }
}

export default AlertDeliveryLog;
