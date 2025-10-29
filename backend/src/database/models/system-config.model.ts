/**
 * SystemConfig Model
 *
 * Sequelize model for system-wide and scoped configuration settings
 */

import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  HasMany,
  Index,
  AllowNull,
} from 'sequelize-typescript';
import { ConfigurationHistory } from './configuration-history.model';

/**
 * Configuration categories
 */
export enum ConfigCategory {
  GENERAL = 'GENERAL',
  SECURITY = 'SECURITY',
  NOTIFICATION = 'NOTIFICATION',
  INTEGRATION = 'INTEGRATION',
  BACKUP = 'BACKUP',
  PERFORMANCE = 'PERFORMANCE',
  HEALTHCARE = 'HEALTHCARE',
  MEDICATION = 'MEDICATION',
  APPOINTMENTS = 'APPOINTMENTS',
  UI = 'UI',
  QUERY = 'QUERY',
  FILE_UPLOAD = 'FILE_UPLOAD',
  RATE_LIMITING = 'RATE_LIMITING',
  SESSION = 'SESSION',
  EMAIL = 'EMAIL',
}

/**
 * Configuration value types
 */
export enum ConfigValueType {
  STRING = 'STRING',
  NUMBER = 'NUMBER',
  BOOLEAN = 'BOOLEAN',
  JSON = 'JSON',
  ARRAY = 'ARRAY',
  DATE = 'DATE',
  TIME = 'TIME',
  DATETIME = 'DATETIME',
  EMAIL = 'EMAIL',
  URL = 'URL',
  COLOR = 'COLOR',
  ENUM = 'ENUM',
}

/**
 * Configuration scopes
 */
export enum ConfigScope {
  SYSTEM = 'SYSTEM',
  DISTRICT = 'DISTRICT',
  SCHOOL = 'SCHOOL',
  USER = 'USER',
}

/**
 * SystemConfig attributes interface
 */
export interface SystemConfigAttributes {
  id?: string;
  key: string;
  value: string;
  category: ConfigCategory;
  valueType: ConfigValueType;
  subCategory?: string;
  description?: string;
  defaultValue?: string;
  validValues?: string[];
  minValue?: number;
  maxValue?: number;
  isPublic?: boolean;
  isEditable?: boolean;
  requiresRestart?: boolean;
  scope: ConfigScope;
  scopeId?: string;
  tags?: string[];
  sortOrder?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * SystemConfig creation attributes interface
 */
export interface CreateSystemConfigAttributes {
  key: string;
  value: string;
  category?: ConfigCategory;
  valueType?: ConfigValueType;
  subCategory?: string;
  description?: string;
  defaultValue?: string;
  validValues?: string[];
  minValue?: number;
  maxValue?: number;
  isPublic?: boolean;
  isEditable?: boolean;
  requiresRestart?: boolean;
  scope?: ConfigScope;
  scopeId?: string;
  tags?: string[];
  sortOrder?: number;
}

/**
 * SystemConfig Model
 *
 * Stores system-wide and scoped configuration settings
 */
@Table({
  tableName: 'system_configurations',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['key'], unique: true },
    { fields: ['category'] },
    { fields: ['scope'] },
  ],
})
export class SystemConfig extends Model<SystemConfigAttributes, CreateSystemConfigAttributes> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id?: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    unique: true,
    comment: 'Unique configuration key',
  })
  @Index
  key: string;

  @AllowNull(false)
  @Column({
    type: DataType.TEXT,
    allowNull: false,
    comment: 'Configuration value as string',
  })
  value: string;

  @Default(ConfigCategory.GENERAL)
  @Column({
    type: DataType.ENUM(...(Object.values(ConfigCategory) as string[])),
    allowNull: false,
    defaultValue: ConfigCategory.GENERAL,
    comment: 'Configuration category',
  })
  @Index
  category: ConfigCategory;

  @Default(ConfigValueType.STRING)
  @Column({
    type: DataType.ENUM(...(Object.values(ConfigValueType) as string[])),
    allowNull: false,
    defaultValue: ConfigValueType.STRING,
    comment: 'Data type of the configuration value',
  })
  valueType: ConfigValueType;

  @AllowNull(true)
  @Column({
    type: DataType.STRING(100),
    allowNull: true,
    comment: 'Sub-category for further organization',
  })
  subCategory?: string;

  @AllowNull(true)
  @Column({
    type: DataType.TEXT,
    allowNull: true,
    comment: 'Human-readable description of the configuration',
  })
  description?: string;

  @AllowNull(true)
  @Column({
    type: DataType.TEXT,
    allowNull: true,
    comment: 'Default value for the configuration',
  })
  defaultValue?: string;

  @AllowNull(true)
  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: true,
    comment: 'Array of valid values for enum-type configurations',
  })
  validValues?: string[];

  @AllowNull(true)
  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: true,
    comment: 'Minimum allowed value for numeric configurations',
  })
  minValue?: number;

  @AllowNull(true)
  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: true,
    comment: 'Maximum allowed value for numeric configurations',
  })
  maxValue?: number;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'Whether this configuration is publicly accessible',
  })
  isPublic?: boolean;

  @Default(true)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    comment: 'Whether this configuration can be edited',
  })
  isEditable?: boolean;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'Whether changing this configuration requires a system restart',
  })
  requiresRestart?: boolean;

  @Default(ConfigScope.SYSTEM)
  @Column({
    type: DataType.ENUM(...(Object.values(ConfigScope) as string[])),
    allowNull: false,
    defaultValue: ConfigScope.SYSTEM,
    comment: 'Scope of the configuration (system, district, school, user)',
  })
  @Index
  scope: ConfigScope;

  @AllowNull(true)
  @Column({
    type: DataType.UUID,
    allowNull: true,
    comment: 'ID of the scope entity (district, school, or user)',
  })
  scopeId?: string;

  @AllowNull(true)
  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: true,
    comment: 'Tags for categorization and filtering',
  })
  tags?: string[];

  @Default(0)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'Sort order for display purposes',
  })
  sortOrder?: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    comment: 'Timestamp when the configuration was created',
  })
  declare createdAt?: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    comment: 'Timestamp when the configuration was last updated',
  })
  declare updatedAt?: Date;

  // Relationships
  @HasMany(() => ConfigurationHistory, {
    foreignKey: 'configurationId',
    as: 'history',
  })
  history?: ConfigurationHistory[];
}
