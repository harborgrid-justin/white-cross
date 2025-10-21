/**
 * LOC: 0595B3338A
 * WC-GEN-063 | AppointmentWaitlist.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - sequelize.ts (database/config/sequelize.ts)
 *   - enums.ts (database/types/enums.ts)
 *   - Student.ts (database/models/core/Student.ts)
 *   - User.ts (database/models/core/User.ts)
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (database/models/index.ts)
 */

/**
 * WC-GEN-063 | AppointmentWaitlist.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../../config/sequelize, ../../types/enums, ../core/Student | Dependencies: sequelize, ../../config/sequelize, ../../types/enums
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: classes | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';
import { AppointmentType, WaitlistPriority, WaitlistStatus } from '../../types/enums';
import { Student } from '../core/Student';
import { User } from '../core/User';

/**
 * AppointmentWaitlist Model
 * Manages student appointment waitlist when preferred time slots are unavailable.
 */

interface AppointmentWaitlistAttributes {
  id: string;
  studentId: string;
  nurseId?: string;
  type: AppointmentType;
  preferredDate?: Date;
  duration: number;
  priority: WaitlistPriority;
  reason: string;
  notes?: string;
  status: WaitlistStatus;
  notifiedAt?: Date;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface AppointmentWaitlistCreationAttributes
  extends Optional<
    AppointmentWaitlistAttributes,
    | 'id'
    | 'createdAt'
    | 'updatedAt'
    | 'nurseId'
    | 'preferredDate'
    | 'duration'
    | 'priority'
    | 'notes'
    | 'status'
    | 'notifiedAt'
    | 'expiresAt'
  > {}

export class AppointmentWaitlist
  extends Model<AppointmentWaitlistAttributes, AppointmentWaitlistCreationAttributes>
  implements AppointmentWaitlistAttributes
{
  public id!: string;
  public studentId!: string;
  public nurseId?: string;
  public type!: AppointmentType;
  public preferredDate?: Date;
  public duration!: number;
  public priority!: WaitlistPriority;
  public reason!: string;
  public notes?: string;
  public status!: WaitlistStatus;
  public notifiedAt?: Date;
  public expiresAt?: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

AppointmentWaitlist.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    studentId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nurseId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM(...Object.values(AppointmentType)),
      allowNull: false,
    },
    preferredDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 30,
      comment: 'Duration in minutes',
    },
    priority: {
      type: DataTypes.ENUM(...Object.values(WaitlistPriority)),
      allowNull: false,
      defaultValue: WaitlistPriority.NORMAL,
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(WaitlistStatus)),
      allowNull: false,
      defaultValue: WaitlistStatus.WAITING,
    },
    notifiedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'appointment_waitlist',
    timestamps: true,
    indexes: [
      { fields: ['studentId', 'status'] },
      { fields: ['nurseId', 'status'] },
      { fields: ['priority', 'status'] },
      { fields: ['expiresAt'] },
    ],
  }
);

// Associations
AppointmentWaitlist.belongsTo(Student, {
  foreignKey: 'studentId',
  as: 'student',
});

AppointmentWaitlist.belongsTo(User, {
  foreignKey: 'nurseId',
  as: 'nurse',
});
