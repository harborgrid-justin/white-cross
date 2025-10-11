import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';
import { IntegrationType } from '../../types/enums';

/**
 * IntegrationLog Model
 * Tracks all integration operations, sync activities, and outcomes
 * Essential for monitoring integration health and troubleshooting
 */

interface IntegrationLogAttributes {
  id: string;
  integrationType: IntegrationType;
  action: string;
  status: string;
  recordsProcessed?: number;
  recordsSucceeded?: number;
  recordsFailed?: number;
  startedAt: Date;
  completedAt?: Date;
  duration?: number;
  errorMessage?: string;
  details?: any;
  integrationId?: string;
  createdAt: Date;
}

interface IntegrationLogCreationAttributes
  extends Optional<
    IntegrationLogAttributes,
    | 'id'
    | 'recordsProcessed'
    | 'recordsSucceeded'
    | 'recordsFailed'
    | 'completedAt'
    | 'duration'
    | 'errorMessage'
    | 'details'
    | 'integrationId'
    | 'createdAt'
  > {}

export class IntegrationLog
  extends Model<IntegrationLogAttributes, IntegrationLogCreationAttributes>
  implements IntegrationLogAttributes
{
  public id!: string;
  public integrationType!: IntegrationType;
  public action!: string;
  public status!: string;
  public recordsProcessed?: number;
  public recordsSucceeded?: number;
  public recordsFailed?: number;
  public startedAt!: Date;
  public completedAt?: Date;
  public duration?: number;
  public errorMessage?: string;
  public details?: any;
  public integrationId?: string;
  public readonly createdAt!: Date;
}

IntegrationLog.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    integrationType: {
      type: DataTypes.ENUM(...Object.values(IntegrationType)),
      allowNull: false,
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    recordsProcessed: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    recordsSucceeded: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    recordsFailed: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    startedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    errorMessage: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    details: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    integrationId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'integration_logs',
    timestamps: false,
    indexes: [
      { fields: ['integrationType', 'createdAt'] },
      { fields: ['integrationId', 'createdAt'] },
      { fields: ['status'] },
      { fields: ['startedAt'] },
    ],
  }
);
