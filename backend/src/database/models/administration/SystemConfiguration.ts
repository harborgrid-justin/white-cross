import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';
import { ConfigValueType, ConfigCategory, ConfigScope } from '../../types/enums';

/**
 * SystemConfiguration Model
 * Manages system-wide, district-level, and school-level configuration settings
 * Supports various data types and validation rules
 */

interface SystemConfigurationAttributes {
  id: string;
  key: string;
  value: string;
  valueType: ConfigValueType;
  category: ConfigCategory;
  subCategory?: string;
  description?: string;
  defaultValue?: string;
  validValues: string[];
  minValue?: number;
  maxValue?: number;
  isPublic: boolean;
  isEditable: boolean;
  requiresRestart: boolean;
  scope: ConfigScope;
  scopeId?: string;
  tags: string[];
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

interface SystemConfigurationCreationAttributes
  extends Optional<
    SystemConfigurationAttributes,
    | 'id'
    | 'valueType'
    | 'subCategory'
    | 'description'
    | 'defaultValue'
    | 'validValues'
    | 'minValue'
    | 'maxValue'
    | 'isPublic'
    | 'isEditable'
    | 'requiresRestart'
    | 'scope'
    | 'scopeId'
    | 'tags'
    | 'sortOrder'
    | 'createdAt'
    | 'updatedAt'
  > {}

export class SystemConfiguration
  extends Model<SystemConfigurationAttributes, SystemConfigurationCreationAttributes>
  implements SystemConfigurationAttributes
{
  public id!: string;
  public key!: string;
  public value!: string;
  public valueType!: ConfigValueType;
  public category!: ConfigCategory;
  public subCategory?: string;
  public description?: string;
  public defaultValue?: string;
  public validValues!: string[];
  public minValue?: number;
  public maxValue?: number;
  public isPublic!: boolean;
  public isEditable!: boolean;
  public requiresRestart!: boolean;
  public scope!: ConfigScope;
  public scopeId?: string;
  public tags!: string[];
  public sortOrder!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

SystemConfiguration.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    key: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    value: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    valueType: {
      type: DataTypes.ENUM(...Object.values(ConfigValueType)),
      allowNull: false,
      defaultValue: ConfigValueType.STRING,
    },
    category: {
      type: DataTypes.ENUM(...Object.values(ConfigCategory)),
      allowNull: false,
    },
    subCategory: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    defaultValue: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    validValues: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
    },
    minValue: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    maxValue: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    isPublic: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    isEditable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    requiresRestart: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    scope: {
      type: DataTypes.ENUM(...Object.values(ConfigScope)),
      allowNull: false,
      defaultValue: ConfigScope.SYSTEM,
    },
    scopeId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'system_configurations',
    timestamps: true,
    indexes: [
      { unique: true, fields: ['key'] },
      { fields: ['category', 'subCategory'] },
      { fields: ['scope', 'scopeId'] },
      { fields: ['tags'] },
    ],
  }
);
