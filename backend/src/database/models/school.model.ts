/**
 * School Model
 *
 * Sequelize model for schools within districts
 */

import {
  AllowNull,
  BeforeCreate,
  BeforeUpdate,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  HasMany,
  Index,
  Model,
  PrimaryKey,
  Scopes,
  Table,
} from 'sequelize-typescript';
import type { District } from './district.model';
import type { User } from './user.model';
import type { Student } from './student.model';
import type { Alert } from './alert.model';
import type { IncidentReport } from './incident-report.model';

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
@Scopes(() => ({
  active: {
    where: {
      isActive: true,
      deletedAt: null,
    },
    order: [['name', 'ASC']],
  },
  byDistrict: (districtId: string) => ({
    where: { districtId, isActive: true },
    order: [['name', 'ASC']],
  }),
  byState: (state: string) => ({
    where: { state, isActive: true },
    order: [
      ['city', 'ASC'],
      ['name', 'ASC'],
    ],
  }),
  byCity: (city: string) => ({
    where: { city, isActive: true },
    order: [['name', 'ASC']],
  }),
  withStudents: {
    include: [
      {
        association: 'students',
        where: { isActive: true },
        required: false,
      },
    ],
    order: [['name', 'ASC']],
  },
}))
@Table({
  tableName: 'schools',
  timestamps: true,
  underscored: false,
  paranoid: true,
  indexes: [
    { fields: ['code'], unique: true },
    { fields: ['districtId'] },
    { fields: ['isActive'] },
    { fields: ['createdAt'], name: 'idx_schools_created_at' },
    { fields: ['updatedAt'], name: 'idx_schools_updated_at' },
    { fields: ['state', 'city'], name: 'idx_schools_state_city' },
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
    unique: true,
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

  // Hooks for audit compliance
  @BeforeCreate
  @BeforeUpdate
  static async auditAccess(instance: School) {
    if (instance.changed()) {
      const changedFields = instance.changed() as string[];
      console.log(
        `[AUDIT] School ${instance.id} modified at ${new Date().toISOString()}`,
      );
      console.log(`[AUDIT] Changed fields: ${changedFields.join(', ')}`);
      // TODO: Integrate with AuditLog service for persistent audit trail
    }
  }

  // Relationships
  @BelongsTo(() => require('./district.model').District, {
    foreignKey: 'districtId',
    as: 'district',
  })
  declare district?: District;

  @HasMany(() => require('./user.model').User, {
    foreignKey: 'schoolId',
    as: 'users',
  })
  declare users?: User[];

  @HasMany(() => require('./student.model').Student, {
    foreignKey: 'schoolId',
    as: 'students',
  })
  declare students?: Student[];

  @HasMany(() => require('./alert.model').Alert, {
    foreignKey: 'schoolId',
    as: 'alerts',
  })
  declare alerts?: Alert[];

  @HasMany(() => require('./incident-report.model').IncidentReport, {
    foreignKey: 'schoolId',
    as: 'incidentReports',
    constraints: false,
  })
  declare incidentReports?: IncidentReport[];
}
