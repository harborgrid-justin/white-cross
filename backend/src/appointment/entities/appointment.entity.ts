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

// Re-export the Sequelize model
export {
  Appointment
} from '../../database/models/appointment.model';

// Export interfaces
export type { AvailabilitySlot, AppointmentEntity, PaginatedResponse };
