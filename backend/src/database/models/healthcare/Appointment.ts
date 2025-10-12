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
      validate: {
        notEmpty: {
          msg: 'Student ID is required'
        }
      }
    },
    nurseId: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Nurse ID is required'
        }
      }
    },
    type: {
      type: DataTypes.ENUM(...Object.values(AppointmentType)),
      allowNull: false,
      validate: {
        isIn: {
          args: [Object.values(AppointmentType)],
          msg: 'Invalid appointment type'
        }
      }
    },
    scheduledAt: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: {
          msg: 'Scheduled time must be a valid date',
          args: true,
        },
        isValidDateTime(value: Date) {
          if (!(value instanceof Date) || isNaN(value.getTime())) {
            throw new Error('Scheduled time must be a valid date');
          }
        }
      }
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 30,
      validate: {
        min: {
          args: [15],
          msg: 'Duration must be at least 15 minutes'
        },
        max: {
          args: [120],
          msg: 'Duration cannot exceed 120 minutes'
        },
        isMultipleOf15(value: number) {
          if (value % 15 !== 0) {
            throw new Error('Duration must be in 15-minute increments');
          }
        }
      }
    },
    status: {
      type: DataTypes.ENUM(...Object.values(AppointmentStatus)),
      allowNull: false,
      defaultValue: AppointmentStatus.SCHEDULED,
      validate: {
        isIn: {
          args: [Object.values(AppointmentStatus)],
          msg: 'Invalid appointment status'
        }
      }
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Appointment reason is required'
        },
        len: {
          args: [3, 500],
          msg: 'Reason must be between 3 and 500 characters'
        }
      }
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: {
          args: [0, 5000],
          msg: 'Notes cannot exceed 5000 characters'
        }
      }
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
    validate: {
      // Model-level validation
      scheduledAtInFuture(this: Appointment) {
        if (this.scheduledAt && new Date(this.scheduledAt) <= new Date()) {
          // Only validate for new records
          if (this.isNewRecord) {
            throw new Error('Appointment must be scheduled for a future date and time');
          }
        }
      },
      validBusinessHours(this: Appointment) {
        if (this.scheduledAt) {
          const hour = new Date(this.scheduledAt).getHours();
          if (hour < 8 || hour >= 17) {
            throw new Error('Appointments must be scheduled between 8:00 AM and 5:00 PM');
          }
        }
      },
      notOnWeekend(this: Appointment) {
        if (this.scheduledAt) {
          const dayOfWeek = new Date(this.scheduledAt).getDay();
          if (dayOfWeek === 0 || dayOfWeek === 6) {
            throw new Error('Appointments cannot be scheduled on weekends');
          }
        }
      }
    }
  }
);
