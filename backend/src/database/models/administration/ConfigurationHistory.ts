/**
 * WC-GEN-034 | ConfigurationHistory.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../../config/sequelize | Dependencies: sequelize, ../../config/sequelize
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: classes | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';

/**
 * ConfigurationHistory Model
 * Maintains audit trail of all configuration changes
 * Tracks who changed what, when, and why
 */

interface ConfigurationHistoryAttributes {
  id: string;
  configKey: string;
  oldValue?: string;
  newValue: string;
  changedBy: string;
  changedByName?: string;
  changeReason?: string;
  ipAddress?: string;
  userAgent?: string;
  configurationId: string;
  createdAt: Date;
}

interface ConfigurationHistoryCreationAttributes
  extends Optional<
    ConfigurationHistoryAttributes,
    'id' | 'oldValue' | 'changedByName' | 'changeReason' | 'ipAddress' | 'userAgent' | 'createdAt'
  > {}

export class ConfigurationHistory
  extends Model<ConfigurationHistoryAttributes, ConfigurationHistoryCreationAttributes>
  implements ConfigurationHistoryAttributes
{
  public id!: string;
  public configKey!: string;
  public oldValue?: string;
  public newValue!: string;
  public changedBy!: string;
  public changedByName?: string;
  public changeReason?: string;
  public ipAddress?: string;
  public userAgent?: string;
  public configurationId!: string;
  public readonly createdAt!: Date;
}

ConfigurationHistory.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    configKey: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    oldValue: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    newValue: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    changedBy: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    changedByName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    changeReason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    ipAddress: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userAgent: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    configurationId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'configuration_history',
    timestamps: false,
    indexes: [
      { fields: ['configKey', 'createdAt'] },
      { fields: ['changedBy', 'createdAt'] },
      { fields: ['configurationId', 'createdAt'] },
    ],
  }
);
