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
    },
    type: {
      type: DataTypes.ENUM(...Object.values(LicenseType)),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(LicenseStatus)),
      allowNull: false,
      defaultValue: LicenseStatus.ACTIVE,
    },
    maxUsers: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    maxSchools: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    features: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
    },
    issuedTo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    issuedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
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
  }
);
