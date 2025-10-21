/**
 * Appointments Domain Exports
 * 
 * Central export point for all appointment-related hooks and utilities.
 * 
 * @module hooks/domains/appointments
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 */

// Configuration
export * from './config';

// Query hooks
export {
  useAppointmentsList,
  useUpcomingAppointments,
  useAppointmentStatistics,
  useWaitlist,
  useAvailabilitySlots,
  useNurseAvailability,
  useAppointmentDetails,
  useAppointmentDashboard,
} from './queries/useAppointmentQueries';

// Mutation hooks
export {
  useAppointmentMutations,
  useCreateAppointment,
  useUpdateAppointment,
  useCancelAppointment,
} from './mutations/useAppointmentMutations';

// Legacy compatibility - re-export with original names
export {
  useAppointmentsList as useAppointments,
  useAvailabilitySlots as useAvailability,
} from './queries/useAppointmentQueries';

// Query keys for external use
export { appointmentQueryKeys as appointmentKeys } from './config';