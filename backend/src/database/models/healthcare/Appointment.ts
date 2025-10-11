import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';
import { AppointmentType, AppointmentStatus } from '../../types/enums';

interface AppointmentAttributes {
  id: string;
  studentId: string;
  nurseId: string;
  type: AppointmentType;
  scheduledAt: Date;
  duration: number;
  status: AppointmentStatus;
  reason: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface AppointmentCreationAttributes
  extends Optional<AppointmentAttributes, 'id' | 'createdAt' | 'updatedAt' | 'notes'> {}

export class Appointment extends Model<AppointmentAttributes, AppointmentCreationAttributes> implements AppointmentAttributes {
  public id!: string;
  public studentId!: string;
  public nurseId!: string;
  public type!: AppointmentType;
  public scheduledAt!: Date;
  public duration!: number;
  public status!: AppointmentStatus;
  public reason!: string;
  public notes?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Appointment.init(
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
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM(...Object.values(AppointmentType)),
      allowNull: false,
    },
    scheduledAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(AppointmentStatus)),
      allowNull: false,
      defaultValue: AppointmentStatus.SCHEDULED,
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'appointments',
    timestamps: true,
    indexes: [
      { fields: ['studentId'] },
      { fields: ['nurseId', 'scheduledAt'] },
      { fields: ['status', 'scheduledAt'] },
    ],
  }
);
