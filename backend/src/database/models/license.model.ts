/**
 * License Model
 *
 * Sequelize model for software licenses issued to districts
 */

import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  ForeignKey,
  BelongsTo,
  Index,
  AllowNull,
} ,
  Scopes,
  BeforeCreate,
  BeforeUpdate
  } from 'sequelize-typescript';
import { Op } from 'sequelize';

/**
 * License types
 */
export enum LicenseType {
  TRIAL = 'TRIAL',
  BASIC = 'BASIC',
  PROFESSIONAL = 'PROFESSIONAL',
  ENTERPRISE = 'ENTERPRISE',
}

/**
 * License status
 */
export enum LicenseStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  SUSPENDED = 'SUSPENDED',
  CANCELLED = 'CANCELLED',
}

/**
 * License attributes interface
 */
export interface LicenseAttributes {
  id?: string;
  licenseKey: string;
  type: LicenseType;
  status: LicenseStatus;
  maxUsers?: number;
  maxSchools?: number;
  features: string[];
  issuedTo?: string;
  districtId?: string;
  notes?: string;
  issuedAt: Date;
  activatedAt?: Date;
  expiresAt?: Date;
  deactivatedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * License creation attributes interface
 */
export interface CreateLicenseAttributes {
  licenseKey: string;
  type?: LicenseType;
  status?: LicenseStatus;
  maxUsers?: number;
  maxSchools?: number;
  features: string[];
  issuedTo?: string;
  districtId?: string;
  notes?: string;
  issuedAt: Date;
  activatedAt?: Date;
  expiresAt?: Date;
  deactivatedAt?: Date;
}

/**
 * License Model
 *
 * Represents a software license issued to a district
 */
@Scopes(() => ({
  active: {
    where: {
      deletedAt: null
    },
    order: [['createdAt', 'DESC']]
  }
}))
@Table({
  tableName: 'licenses',
  timestamps: true,
  underscored: false,
  indexes: [
    { fields: ['licenseKey'], unique: true },
    { fields: ['status'] },
    { fields: ['districtId'] },,
    {
      fields: ['createdAt'],
      name: 'idx_license_created_at'
    },
    {
      fields: ['updatedAt'],
      name: 'idx_license_updated_at'
    }
  ],
})
export class License extends Model<LicenseAttributes, CreateLicenseAttributes> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id?: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    unique: true,
    comment: 'Unique license key',
  })
  @Index
  licenseKey: string;

  @Default(LicenseType.TRIAL)
  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(LicenseType)]
    },
    allowNull: false,
    defaultValue: LicenseType.TRIAL,
    comment: 'Type of license',
  })
  type: LicenseType;

  @Default(LicenseStatus.ACTIVE)
  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(LicenseStatus)]
    },
    allowNull: false,
    defaultValue: LicenseStatus.ACTIVE,
    comment: 'Current status of the license',
  })
  @Index
  status: LicenseStatus;

  @AllowNull(true)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    comment: 'Maximum number of users allowed',
  })
  maxUsers?: number;

  @AllowNull(true)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    comment: 'Maximum number of schools allowed',
  })
  maxSchools?: number;

  @AllowNull(false)
  @Column({
    type: DataType.ARRAY(DataType.STRING(255)),
    allowNull: false,
    comment: 'Array of enabled features',
  })
  features: string[];

  @AllowNull(true)
  @Column({
    type: DataType.STRING(255),
    allowNull: true,
    comment: 'Name of the person/organization the license was issued to',
  })
  issuedTo?: string;

  @ForeignKey(() => require('./district.model').District)
  @AllowNull(true)
  @Column({
    type: DataType.UUID,
    allowNull: true,
    comment: 'ID of the district this license is assigned to',
  })
  @Index
  districtId?: string;

  @AllowNull(true)
  @Column({
    type: DataType.TEXT,
    allowNull: true,
    comment: 'Additional notes about the license',
  })
  notes?: string;

  @AllowNull(false)
  @Column({
    type: DataType.DATE,
    allowNull: false,
    comment: 'Date when the license was issued',
  })
  issuedAt: Date;

  @AllowNull(true)
  @Column({
    type: DataType.DATE,
    allowNull: true,
    comment: 'Date when the license was activated',
  })
  activatedAt?: Date;

  @AllowNull(true)
  @Column({
    type: DataType.DATE,
    allowNull: true,
    comment: 'Date when the license expires',
  })
  expiresAt?: Date;

  @AllowNull(true)
  @Column({
    type: DataType.DATE,
    allowNull: true,
    comment: 'Date when the license was deactivated',
  })
  deactivatedAt?: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    comment: 'Timestamp when the license was created',
  })
  declare createdAt?: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    comment: 'Timestamp when the license was last updated',
  })
  declare updatedAt?: Date;

  // Relationships
  @BelongsTo(() => require('./district.model').District, {
    foreignKey: 'districtId',
    as: 'district',
  })
  declare district?: any;


  // Hooks for HIPAA compliance
  @BeforeCreate
  @BeforeUpdate
  static async auditPHIAccess(instance: License) {
    if (instance.changed()) {
      const changedFields = instance.changed() as string[];
      console.log(`[AUDIT] License ${instance.id} modified at ${new Date().toISOString()}`);
      console.log(`[AUDIT] Changed fields: ${changedFields.join(', ')}`);
      // TODO: Integrate with AuditLog service for persistent audit trail
    }
  }
}