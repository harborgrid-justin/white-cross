/**
 * AppointmentScheduler Re-export
 *
 * This file re-exports the refactored AppointmentScheduler from its subdirectory
 * to maintain backward compatibility with existing imports.
 */

export { default } from './AppointmentScheduler';
export { default as AppointmentScheduler } from './AppointmentScheduler';

// Re-export types for convenience
export type {
  TimeSlot,
  Provider,
  Patient,
  Room,
  AppointmentSchedulerProps,
  Appointment,
  AppointmentType,
  AppointmentPriority
} from './AppointmentScheduler/types';
