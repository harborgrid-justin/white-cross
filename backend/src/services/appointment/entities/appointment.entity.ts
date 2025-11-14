/**
 * Appointment entity representing a scheduled healthcare appointment
 *
 * Relations:
 * - ManyToOne with Student (studentId)
 * - ManyToOne with User (nurseId)
 *
 * Indexes:
 * - nurseId (for availability queries)
 * - studentId (for patient history)
 * - scheduledDate (for date range queries)
 * - status (for filtering active appointments)
 * Re-export of Sequelize model for backward compatibility
 */

import { AppointmentStatus, AppointmentType } from '@/database/models';

// Re-export the Sequelize model and enums
export {
  Appointment,
  AppointmentType,
  AppointmentStatus,
} from '@/database/models';

/**
 * Represents an available time slot for appointment scheduling
 */
export interface AvailabilitySlot {
  /** Start time of the available slot */
  startTime: Date;

  /** End time of the available slot */
  endTime: Date;

  /** ID of the nurse/provider available during this slot */
  nurseId: string;

  /** Name of the nurse/provider */
  nurseName?: string;

  /** Whether this slot is currently available for booking */
  isAvailable: boolean;

  /** Duration of the slot in minutes */
  duration: number;

  /** Optional reason if slot is unavailable */
  unavailabilityReason?: string;
}

/**
 * Complete appointment entity with all relations and computed fields
 */
export interface AppointmentEntity {
  /** Unique identifier for the appointment */
  id: string;

  /** ID of the student/patient */
  studentId: string;

  /** ID of the assigned nurse */
  nurseId: string;

  /** Type of appointment */
  type: AppointmentType;

  /** Alias for type field (for DTO compatibility) */
  appointmentType?: AppointmentType;

  /** Scheduled date and time */
  scheduledAt: Date;

  /** Alias for scheduledAt field (for DTO compatibility) */
  appointmentDate?: Date;

  /** Duration in minutes */
  duration: number;

  /** Current status of the appointment */
  status: AppointmentStatus;

  /** Reason for the appointment */
  reason: string;

  /** Additional notes about the appointment */
  notes?: string;

  /** Group ID for recurring appointments */
  recurringGroupId?: string;

  /** Frequency of recurrence (DAILY, WEEKLY, MONTHLY, YEARLY) */
  recurringFrequency?: string;

  /** End date for recurring appointments */
  recurringEndDate?: Date;

  /** Related student information */
  student?: {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
    phoneNumber?: string;
  };

  /** Related nurse information */
  nurse?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };

  // /** Appointment reminders - commented out to avoid circular dependency in Swagger */
  // reminders?: Array<{
  //   id: string;
  //   scheduledFor: Date;
  //   sent: boolean;
  //   method: string;
  // }>;

  /** Creation timestamp */
  createdAt: Date;

  /** Last update timestamp */
  updatedAt: Date;
}

/**
 * Generic paginated response wrapper
 */
export interface PaginatedResponse<T> {
  /** Array of items for the current page */
  data: T[];

  /** Pagination metadata */
  pagination: {
    /** Current page number (1-indexed) */
    page: number;

    /** Number of items per page */
    limit: number;

    /** Total number of items across all pages */
    total: number;

    /** Total number of pages */
    totalPages: number;

    /** Whether there is a next page */
    hasNext: boolean;

    /** Whether there is a previous page */
    hasPrevious: boolean;
  };
}

/**
 * Type alias for paginated appointment response
 */
export type PaginatedAppointments = PaginatedResponse<AppointmentEntity>;
