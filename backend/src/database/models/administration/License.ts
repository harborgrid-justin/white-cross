import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';
import { LicenseType, LicenseStatus } from '../../types/enums';

/**
 * License Model
 * Manages software licensing for districts and schools
 * Tracks features, user limits, and expiration dates
 */

interface LicenseAttributes {
  id: string;
  licenseKey: string;
  type: LicenseType;
  status: LicenseStatus;
  maxUsers?: number;
  maxSchools?: number;
  features: string[];
  issuedTo?: string;
  issuedAt: Date;
  expiresAt?: Date;
  activatedAt?: Date;
  deactivatedAt?: Date;
  notes?: string;
  districtId?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface LicenseCreationAttributes
  extends Optional<
    LicenseAttributes,
    | 'id'
    | 'status'
    | 'maxUsers'
    | 'maxSchools'
    | 'features'
    | 'issuedTo'
    | 'issuedAt'
    | 'expiresAt'
    | 'activatedAt'
    | 'deactivatedAt'
    | 'notes'
    | 'districtId'
    | 'createdAt'
    | 'updatedAt'
  > {}

export class License extends Model<LicenseAttributes, LicenseCreationAttributes> implements LicenseAttributes {
  public id!: string;
  public licenseKey!: string;
  public type!: LicenseType;
  public status!: LicenseStatus;
  public maxUsers?: number;
  public maxSchools?: number;
  public features!: string[];
  public issuedTo?: string;
  public issuedAt!: Date;
  public expiresAt?: Date;
  public activatedAt?: Date;
  public deactivatedAt?: Date;
  public notes?: string;
  public districtId?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

License.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    licenseKey: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: 'License key cannot be empty'
        },
        len: {
          args: [10, 100],
          msg: 'License key must be between 10 and 100 characters'
        },
        is: {
          args: /^[A-Z0-9-]+$/,
          msg: 'License key can only contain uppercase letters, numbers, and hyphens'
        }
      }
    },
    type: {
      type: DataTypes.ENUM(...Object.values(LicenseType)),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'License type is required'
        }
      }
    },
    status: {
      type: DataTypes.ENUM(...Object.values(LicenseStatus)),
      allowNull: false,
      defaultValue: LicenseStatus.ACTIVE,
    },
    maxUsers: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: {
          args: [1],
          msg: 'Maximum users must be at least 1'
        },
        max: {
          args: [100000],
          msg: 'Maximum users cannot exceed 100,000'
        }
      }
    },
    maxSchools: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: {
          args: [1],
          msg: 'Maximum schools must be at least 1'
        },
        max: {
          args: [10000],
          msg: 'Maximum schools cannot exceed 10,000'
        }
      }
    },
    features: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
      validate: {
        notEmpty: {
          msg: 'At least one feature must be specified'
        }
      }
    },
    issuedTo: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: {
          args: [0, 200],
          msg: 'Issued to field cannot exceed 200 characters'
        }
      }
    },
    issuedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        // Validate expiration date is in the future for new licenses
        isValidExpiration(value: Date | null) {
          if (value && value < new Date() && this.isNewRecord) {
            throw new Error('Expiration date must be in the future');
          }
        }
      }
    },
    activatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    deactivatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: {
          args: [0, 2000],
          msg: 'Notes cannot exceed 2000 characters'
        }
      }
    },
    districtId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'licenses',
    timestamps: true,
    indexes: [
      { unique: true, fields: ['licenseKey'] },
      { fields: ['districtId'] },
      { fields: ['type'] },
      { fields: ['status'] },
      { fields: ['expiresAt'] },
    ],
    validate: {
      // Validate date consistency
      dateConsistency() {
        if (this.expiresAt && this.issuedAt && this.expiresAt <= this.issuedAt) {
          throw new Error('Expiration date must be after issued date');
        }
        if (this.activatedAt && this.issuedAt && this.activatedAt < this.issuedAt) {
          throw new Error('Activation date cannot be before issued date');
        }
        if (this.deactivatedAt && this.activatedAt && this.deactivatedAt < this.activatedAt) {
          throw new Error('Deactivation date cannot be before activation date');
        }
      },
      // Validate license limits based on type
      validateLimitsForType() {
        switch (this.type) {
          case LicenseType.TRIAL:
            if (!this.maxUsers || this.maxUsers > 10) {
              throw new Error('Trial license cannot have more than 10 users');
            }
            if (!this.maxSchools || this.maxSchools > 2) {
              throw new Error('Trial license cannot have more than 2 schools');
            }
            if (!this.expiresAt) {
              throw new Error('Trial license must have an expiration date');
            }
            break;
          case LicenseType.BASIC:
            if (this.maxUsers && this.maxUsers > 50) {
              throw new Error('Basic license cannot have more than 50 users');
            }
            if (this.maxSchools && this.maxSchools > 5) {
              throw new Error('Basic license cannot have more than 5 schools');
            }
            break;
          case LicenseType.PROFESSIONAL:
            if (this.maxUsers && this.maxUsers > 500) {
              throw new Error('Professional license cannot have more than 500 users');
            }
            if (this.maxSchools && this.maxSchools > 50) {
              throw new Error('Professional license cannot have more than 50 schools');
            }
            break;
          // ENTERPRISE has no limits
        }
      }
    }
  }
);
