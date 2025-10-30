/**
 * District Model
 *
 * Sequelize model for school districts
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
;
;

/**
 * District attributes interface
 */
export interface DistrictAttributes {
  id?: string;
  name: string;
  code: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phone?: string;
  email?: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * District creation attributes interface
 */
export interface CreateDistrictAttributes {
  name: string;
  code: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phone?: string;
  email?: string;
  isActive?: boolean;
}

/**
 * District Model
 *
 * Represents a school district in the system
 */
@Table({
  tableName: 'districts',
  timestamps: true,
  underscored: false,
  indexes: [
    { fields: ['code'], unique: true },
    { fields: ['isActive'] },
  ],
})
export class District extends Model<DistrictAttributes, CreateDistrictAttributes> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id?: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(200),
    allowNull: false,
    comment: 'Name of the district',
  })
  name: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    unique: true
  })
  @Index
  code: string;

  @AllowNull(true)
  @Column({
    type: DataType.TEXT,
    allowNull: true,
    comment: 'Physical address of the district',
  })
  address?: string;

  @AllowNull(true)
  @Column({
    type: DataType.STRING(100),
    allowNull: true,
    comment: 'City where the district is located',
  })
  city?: string;

  @AllowNull(true)
  @Column({
    type: DataType.STRING(2),
    allowNull: true,
    comment: 'State code (2-letter abbreviation)',
  })
  state?: string;

  @AllowNull(true)
  @Column({
    type: DataType.STRING(10),
    allowNull: true,
    comment: 'ZIP code of the district',
  })
  zipCode?: string;

  @AllowNull(true)
  @Column({
    type: DataType.STRING(20),
    allowNull: true,
    comment: 'Primary phone number for the district',
  })
  phone?: string;

  @AllowNull(true)
  @Column({
    type: DataType.STRING(255),
    allowNull: true,
    comment: 'Primary email address for the district',
  })
  email?: string;

  @Default(true)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    comment: 'Whether the district is active',
  })
  isActive?: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    comment: 'Timestamp when the district was created',
  })
  declare createdAt?: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    comment: 'Timestamp when the district was last updated',
  })
  declare updatedAt?: Date;

  // Relationships
  @HasMany(() => require('./school.model').School, {
    foreignKey: 'districtId',
    as: 'schools',
  })
  declare schools?: any[];

  @HasMany(() => require('./license.model').License, {
    foreignKey: 'districtId',
    as: 'licenses',
  })
  declare licenses?: any[];
}