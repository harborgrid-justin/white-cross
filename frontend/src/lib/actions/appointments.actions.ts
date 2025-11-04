/**
 * Appointments Actions
 * Barrel export for appointment management actions
 *
 * This file maintains backward compatibility by re-exporting all
 * appointment-related functions and types from their respective modules.
 *
 * Architecture:
 * - appointments.types.ts - Type definitions
 * - appointments.cache.ts - Cached GET operations with React cache()
 * - appointments.crud.ts - Create, update, delete operations
 * - appointments.utils.ts - Convenience functions and aliases
 */

// Type exports
export type {
  Appointment,
  AppointmentFilters,
  CreateAppointmentData,
  UpdateAppointmentData,
} from './appointments.types';

// Cached GET operations
export { getAppointments, getAppointment } from './appointments.cache';

// CRUD operations
export { createAppointment, updateAppointment, deleteAppointment } from './appointments.crud';

// Utility functions and aliases
export { scheduleAppointment, rescheduleAppointment } from './appointments.utils';
