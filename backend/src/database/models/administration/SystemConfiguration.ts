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
      validate: {
        notEmpty: {
          msg: 'Configuration key cannot be empty'
        },
        len: {
          args: [2, 255],
          msg: 'Configuration key must be between 2 and 255 characters'
        },
        is: {
          args: /^[a-zA-Z][a-zA-Z0-9._-]*$/,
          msg: 'Configuration key must start with a letter and contain only letters, numbers, dots, hyphens, and underscores'
        }
      }
    },
    value: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Configuration value is required'
        }
      }
    },
    valueType: {
      type: DataTypes.ENUM(...Object.values(ConfigValueType)),
      allowNull: false,
      defaultValue: ConfigValueType.STRING,
    },
    category: {
      type: DataTypes.ENUM(...Object.values(ConfigCategory)),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Configuration category is required'
        }
      }
    },
    subCategory: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: {
          args: [0, 100],
          msg: 'Sub-category cannot exceed 100 characters'
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: {
          args: [0, 1000],
          msg: 'Description cannot exceed 1000 characters'
        }
      }
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
      validate: {
        isFloat: {
          msg: 'Min value must be a number'
        }
      }
    },
    maxValue: {
      type: DataTypes.FLOAT,
      allowNull: true,
      validate: {
        isFloat: {
          msg: 'Max value must be a number'
        }
      }
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
      validate: {
        // Validate scopeId format if provided
        isValidUUID(value: string | null) {
          if (value && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)) {
            throw new Error('Scope ID must be a valid UUID');
          }
        }
      }
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
      validate: {
        min: {
          args: [0],
          msg: 'Sort order cannot be negative'
        }
      }
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
    validate: {
      // Validate min/max value consistency
      minMaxConsistency() {
        if (typeof this.minValue === 'number' && typeof this.maxValue === 'number' && this.minValue > this.maxValue) {
          throw new Error('Minimum value cannot be greater than maximum value');
        }
      },
      // Validate value against valueType
      valueTypeConsistency() {
        const value = this.value as string;
        const valueType = this.valueType;

        switch (valueType) {
          case ConfigValueType.NUMBER:
            if (isNaN(Number(value))) {
              throw new Error('Value must be a valid number for NUMBER type');
            }
            const numValue = Number(value);
            if (typeof this.minValue === 'number' && numValue < this.minValue) {
              throw new Error(`Value ${numValue} is below minimum allowed value ${this.minValue}`);
            }
            if (typeof this.maxValue === 'number' && numValue > this.maxValue) {
              throw new Error(`Value ${numValue} exceeds maximum allowed value ${this.maxValue}`);
            }
            break;

          case ConfigValueType.BOOLEAN:
            if (value !== 'true' && value !== 'false') {
              throw new Error('Value must be "true" or "false" for BOOLEAN type');
            }
            break;

          case ConfigValueType.EMAIL:
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value as string)) {
              throw new Error('Value must be a valid email address for EMAIL type');
            }
            break;

          case ConfigValueType.URL:
            try {
              new URL(value as string);
            } catch {
              throw new Error('Value must be a valid URL for URL type');
            }
            break;

          case ConfigValueType.JSON:
            try {
              JSON.parse(value as string);
            } catch {
              throw new Error('Value must be valid JSON for JSON type');
            }
            break;

          case ConfigValueType.ARRAY:
            try {
              const parsed = JSON.parse(value as string);
              if (!Array.isArray(parsed)) {
                throw new Error('Value must be a JSON array for ARRAY type');
              }
            } catch {
              throw new Error('Value must be a valid JSON array for ARRAY type');
            }
            break;

          case ConfigValueType.COLOR:
            const colorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
            if (!colorRegex.test(value as string)) {
              throw new Error('Value must be a valid hex color code (e.g., #FF0000) for COLOR type');
            }
            break;

          case ConfigValueType.ENUM:
            const validValues = this.validValues as string[];
            if (validValues.length > 0 && !validValues.includes(value)) {
              throw new Error(`Value must be one of: ${validValues.join(', ')}`);
            }
            break;
        }
      },
      // Validate scope and scopeId consistency
      scopeConsistency() {
        if (this.scope !== ConfigScope.SYSTEM && !this.scopeId) {
          throw new Error(`Scope ID is required when scope is ${this.scope}`);
        }
        if (this.scope === ConfigScope.SYSTEM && this.scopeId) {
          throw new Error('Scope ID should not be set when scope is SYSTEM');
        }
      },
      // Validate validValues for ENUM type
      enumValidValues() {
        const validValues = this.validValues as string[];
        if (this.valueType === ConfigValueType.ENUM && validValues.length === 0) {
          throw new Error('Valid values must be provided for ENUM type');
        }
      }
    }
  }
);
