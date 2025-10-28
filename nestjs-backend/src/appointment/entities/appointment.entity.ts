import { AppointmentType } from '../dto/create-appointment.dto';
import { AppointmentStatus } from '../dto/update-appointment.dto';

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
 */
export interface AppointmentEntity {
  id: string;
  studentId: string;
  nurseId: string;
  appointmentType: AppointmentType;
  scheduledDate: Date;
  duration: number; // minutes
  reason?: string;
  notes?: string;
  status: AppointmentStatus;
  createdAt: Date;
  updatedAt: Date;

  // Relations (populated when needed)
  student?: any; // Student entity
  nurse?: any; // User entity
}

/**
 * Availability slot representation
 */
export interface AvailabilitySlot {
  start: Date;
  end: Date;
  available: boolean;
  conflictingAppointment?: {
    id: string;
    student: string;
    reason: string;
  };
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
