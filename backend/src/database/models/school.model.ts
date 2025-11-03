/**
 * School Model
 *
 * Sequelize model for schools within districts
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
  HasMany,
  Index,
  AllowNull,
} from 'sequelize-typescript';

/**
 * School attributes interface
 */
export interface SchoolAttributes {
  id?: string;
  name: string;
  code: string;
  districtId: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phone?: string;
  email?: string;
  principal?: string;
  totalEnrollment?: number;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * School creation attributes interface
 */
export interface CreateSchoolAttributes {
  name: string;
  code: string;
  districtId: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phone?: string;
  email?: string;
  principal?: string;
  totalEnrollment?: number;
  isActive?: boolean;
}

/**
 * School Model
 *
 * Represents a school within a district
 */
@Table({
  tableName: 'schools',
  timestamps: true,
  underscored: false,
  indexes: [
    { fields: ['code'], unique: true },
    { fields: ['districtId'] },
    { fields: ['isActive'] },
  ],
})
export class School extends Model<SchoolAttributes, CreateSchoolAttributes> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(200),
    allowNull: false,
    comment: 'Name of the school',
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

  @ForeignKey(() => require('./district.model').District)
  @AllowNull(false)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    comment: 'ID of the district this school belongs to',
  })
  @Index
  districtId: string;

  @AllowNull(true)
  @Column({
    type: DataType.TEXT,
    allowNull: true,
    comment: 'Physical address of the school',
  })
  address?: string;

  @AllowNull(true)
  @Column({
    type: DataType.STRING(100),
    allowNull: true,
    comment: 'City where the school is located',
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
    comment: 'ZIP code of the school',
  })
  zipCode?: string;

  @AllowNull(true)
  @Column({
    type: DataType.STRING(20),
    allowNull: true,
    comment: 'Primary phone number for the school',
  })
  phone?: string;

  @AllowNull(true)
  @Column({
    type: DataType.STRING(255),
    allowNull: true,
    comment: 'Primary email address for the school',
  })
  email?: string;

  @AllowNull(true)
  @Column({
    type: DataType.STRING(200),
    allowNull: true,
    comment: 'Name of the school principal',
  })
  principal?: string;

  @AllowNull(true)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    comment: 'Total number of enrolled students',
  })
  totalEnrollment?: number;

  @Default(true)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    comment: 'Whether the school is active',
  })
  isActive?: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    comment: 'Timestamp when the school was created',
  })
  declare createdAt?: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    comment: 'Timestamp when the school was last updated',
  })
  declare updatedAt?: Date;

  // Relationships
  @BelongsTo(() => require('./district.model').District, {
    foreignKey: 'districtId',
    as: 'district',
  })
  declare district?: any;

  @HasMany(() => require('./user.model').User, { foreignKey: 'schoolId', as: 'users' })
  declare users?: any[];

  @HasMany(() => require('./student.model').Student, { foreignKey: 'schoolId', as: 'students' })
  declare students?: any[];

  @HasMany(() => require('./alert.model').Alert, { foreignKey: 'schoolId', as: 'alerts' })
  declare alerts?: any[];

  @HasMany(() => require('./incident-report.model').IncidentReport, {
    foreignKey: 'schoolId',
    as: 'incidentReports',
    constraints: false
  })
  declare incidentReports?: any[];
}