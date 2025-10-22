/**
 * @fileoverview Appointment Database Model
 * @module database/models/healthcare/Appointment
 * @description Sequelize model for managing school health appointments including routine checkups,
 * medication administration, injury assessments, and emergency visits with comprehensive scheduling
 * and workflow management.
 *
 * Key Features:
 * - Appointment type classification (routine, medication, injury, illness, etc.)
 * - Status workflow (SCHEDULED → IN_PROGRESS → COMPLETED/CANCELLED/NO_SHOW)
 * - Duration management in 15-minute increments
 * - Business hours validation (8 AM - 5 PM, weekdays only)
 * - Nurse and student assignment
 * - Reason and notes documentation
 * - Integration with reminders and waitlist systems
 *
 * Business Rules:
 * - Appointments must be scheduled during business hours (8 AM - 5 PM)
 * - No weekend appointments (Monday-Friday only)
 * - Duration must be 15-120 minutes in 15-minute increments
 * - Minimum duration: 15 minutes (quick checks)
 * - Maximum duration: 120 minutes (comprehensive exams)
 * - New appointments must be scheduled in the future
 * - Reason must be 3-500 characters
 *
 * Appointment Types & Typical Durations:
 * - ROUTINE_CHECKUP: 30-45 minutes (general health assessment)
 * - MEDICATION_ADMINISTRATION: 15-30 minutes (medication dispensing and monitoring)
 * - INJURY_ASSESSMENT: 15-45 minutes (injury evaluation and treatment)
 * - ILLNESS_EVALUATION: 30-60 minutes (illness assessment and care planning)
 * - FOLLOW_UP: 15-30 minutes (post-incident or post-treatment review)
 * - SCREENING: 15-30 minutes (vision, hearing, health screenings)
 * - EMERGENCY: Variable (immediate response, typically 30-60 minutes)
 *
 * @compliance HIPAA - Appointment details contain PHI
 * @compliance FERPA - Educational records if health affects academics
 * @compliance State regulations - Required documentation for medication administration
 *
 * @legal Retention requirement: 7 years from appointment date
 * @legal Documentation required for liability protection
 * @legal Medication administration appointments require dual verification
 *
 * @requires sequelize
 * @requires ../../config/sequelize
 * @requires ../../types/enums
 *
 * LOC: F175DC7C84
 * Last Updated: 2025-10-17
 */

import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';
import { AppointmentType, AppointmentStatus } from '../../types/enums';

/**
 * @interface AppointmentAttributes
 * @description Defines the complete structure of an appointment record
 *
 * @property {string} id - Unique identifier (UUID v4)
 * @property {string} studentId - Reference to student
 * @business Required for all appointments
 *
 * @property {string} nurseId - Reference to assigned nurse
 * @business Required at creation; ensures proper staffing
 * @business One nurse can have multiple concurrent appointments (waiting room)
 *
 * @property {AppointmentType} type - Type of appointment
 * @enum {AppointmentType} ['ROUTINE_CHECKUP', 'MEDICATION_ADMINISTRATION', 'INJURY_ASSESSMENT', 'ILLNESS_EVALUATION', 'FOLLOW_UP', 'SCREENING', 'EMERGENCY']
 * @business EMERGENCY type may bypass normal scheduling rules
 *
 * @property {Date} scheduledAt - When appointment is scheduled
 * @business Must be future date for new appointments
 * @business Must be during business hours (8 AM - 5 PM)
 * @business Must be weekday (Monday-Friday)
 *
 * @property {number} duration - Appointment duration in minutes (15-120)
 * @business Must be in 15-minute increments (15, 30, 45, 60, etc.)
 * @business Default: 30 minutes
 * @business Used for calendar blocking and scheduling optimization
 *
 * @property {AppointmentStatus} status - Current status
 * @enum {AppointmentStatus} ['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW']
 * @business Workflow: SCHEDULED → IN_PROGRESS → COMPLETED
 * @business Alternative paths: SCHEDULED → CANCELLED or SCHEDULED → NO_SHOW
 * @business Default: SCHEDULED
 *
 * @property {string} reason - Reason for appointment (3-500 characters)
 * @business Required for all appointments
 * @business Helps prioritize and prepare for appointment
 *
 * @property {string} [notes] - Additional notes (max 5000 characters)
 * @business Optional during scheduling
 * @business Typically filled during/after appointment
 * @business May contain clinical observations, treatments provided
 * @compliance Contains PHI - restricted access required
 *
 * @property {Date} createdAt - Record creation timestamp
 * @property {Date} updatedAt - Record last update timestamp
 */
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

/**
 * @interface AppointmentCreationAttributes
 * @description Defines optional fields when creating a new appointment
 * @extends AppointmentAttributes
 */
interface AppointmentCreationAttributes
  extends Optional<AppointmentAttributes, 'id' | 'createdAt' | 'updatedAt' | 'notes'> {}

/**
 * @class Appointment
 * @extends Model
 * @description Sequelize model class for appointment management
 *
 * Workflow Summary:
 * 1. Student needs health service → Appointment request created
 * 2. Nurse/staff schedules appointment → Validates business hours and availability
 * 3. System sends reminder → Via AppointmentReminder (24h, 1h before)
 * 4. Student arrives → Status changes to IN_PROGRESS
 * 5. Nurse provides care → Notes documented in notes field
 * 6. Appointment completes → Status changes to COMPLETED
 * 7. Follow-up scheduled if needed → New appointment or follow-up action created
 *
 * Status Transitions:
 * - SCHEDULED: Initial state, appointment booked
 * - IN_PROGRESS: Student checked in, receiving care
 * - COMPLETED: Care provided, documentation complete
 * - CANCELLED: Appointment cancelled (by staff or student)
 * - NO_SHOW: Student did not appear for scheduled appointment
 *
 * Scheduling Rules:
 * - Business hours: Monday-Friday, 8:00 AM - 5:00 PM
 * - Duration: 15-120 minutes in 15-minute increments
 * - No double-booking: One student per time slot per nurse
 * - Emergency appointments: Can override normal scheduling rules
 * - Buffer time: Consider 5-10 minutes between appointments for documentation
 *
 * Reminder System Integration:
 * - 24-hour reminder: Sent day before appointment
 * - 1-hour reminder: Sent hour before appointment
 * - Methods: Email, SMS, push notification (configurable)
 * - Automatic cancellation: If no-show pattern detected (3+ consecutive)
 *
 * Waitlist Integration:
 * - If no appointments available → Student added to waitlist
 * - Cancellation occurs → Waitlist notified in priority order
 * - Urgent priority: Immediate notification
 * - Normal priority: Next available slot notification
 *
 * Associations:
 * - belongsTo: Student (patient)
 * - belongsTo: User (nurse - healthcare provider)
 * - hasMany: AppointmentReminder (scheduled reminders)
 * - hasMany: AppointmentWaitlist (if rescheduled from waitlist)
 *
 * Model-level Validations:
 * - scheduledAtInFuture: New appointments must be in future
 * - validBusinessHours: Must be scheduled 8 AM - 5 PM
 * - notOnWeekend: No Saturday or Sunday appointments
 *
 * @example
 * // Schedule a routine checkup
 * const appointment = await Appointment.create({
 *   studentId: 'student-uuid',
 *   nurseId: 'nurse-uuid',
 *   type: AppointmentType.ROUTINE_CHECKUP,
 *   scheduledAt: new Date('2024-03-15T10:00:00'),
 *   duration: 30,
 *   reason: 'Annual health screening and growth measurement'
 * });
 *
 * @example
 * // Complete an appointment
 * await appointment.update({
 *   status: AppointmentStatus.COMPLETED,
 *   notes: 'Completed routine checkup. Height: 52in, Weight: 65lbs. Vision: 20/20. No concerns noted.'
 * });
 */
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
