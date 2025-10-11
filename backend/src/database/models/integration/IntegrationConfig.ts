import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';
import { IntegrationType, IntegrationStatus } from '../../types/enums';

/**
 * IntegrationConfig Model
 * Manages external system integration configurations including
 * SIS, EHR, pharmacy systems, and other healthcare integrations
 */

interface IntegrationConfigAttributes {
  id: string;
  name: string;
  type: IntegrationType;
  status: IntegrationStatus;
  endpoint?: string;
  apiKey?: string;
  username?: string;
  password?: string;
  settings?: any;
  isActive: boolean;
  lastSyncAt?: Date;
  lastSyncStatus?: string;
  syncFrequency?: number;
  createdAt: Date;
  updatedAt: Date;
}

interface IntegrationConfigCreationAttributes
  extends Optional<
    IntegrationConfigAttributes,
    | 'id'
    | 'status'
    | 'endpoint'
    | 'apiKey'
    | 'username'
    | 'password'
    | 'settings'
    | 'isActive'
    | 'lastSyncAt'
    | 'lastSyncStatus'
    | 'syncFrequency'
    | 'createdAt'
    | 'updatedAt'
  > {}

export class IntegrationConfig
  extends Model<IntegrationConfigAttributes, IntegrationConfigCreationAttributes>
  implements IntegrationConfigAttributes
{
  public id!: string;
  public name!: string;
  public type!: IntegrationType;
  public status!: IntegrationStatus;
  public endpoint?: string;
  public apiKey?: string;
  public username?: string;
  public password?: string;
  public settings?: any;
  public isActive!: boolean;
  public lastSyncAt?: Date;
  public lastSyncStatus?: string;
  public syncFrequency?: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

IntegrationConfig.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM(...Object.values(IntegrationType)),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(IntegrationStatus)),
      allowNull: false,
      defaultValue: IntegrationStatus.INACTIVE,
    },
    endpoint: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    apiKey: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    settings: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    lastSyncAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    lastSyncStatus: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    syncFrequency: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'integration_configs',
    timestamps: true,
    indexes: [
      { fields: ['type'] },
      { fields: ['status'] },
      { fields: ['isActive'] },
      { fields: ['lastSyncAt'] },
    ],
  }
);
