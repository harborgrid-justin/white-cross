/**
 * Appointments API - Validation Schemas (Re-export Module)
 *
 * Central module for all validation schemas and helpers.
 * This module re-exports validation schemas from specialized sub-modules
 * to maintain backward compatibility while keeping code organized.
 *
 * @module services/modules/appointmentsApi/validation
 */

// Appointment validation schemas
export {
  createAppointmentSchema,
  updateAppointmentSchema,
  appointmentFiltersSchema,
  appointmentFormSchema
} from './validation-appointments';

// Availability validation schemas
export {
  nurseAvailabilitySchema
} from './validation-availability';

// Waitlist validation schemas
export {
  waitlistEntrySchema,
  waitlistFiltersSchema
} from './validation-waitlist';

// Recurring appointments and reminder validation schemas
export {
  recurrenceConfigurationSchema,
  recurringAppointmentSchema,
  scheduleReminderSchema,
  cancelReminderSchema
} from './validation-recurring';

// Operations, conflict checking, and analytics validation schemas
export {
  conflictCheckSchema,
  bulkCancelSchema,
  statisticsFiltersSchema,
  trendsQuerySchema
} from './validation-operations';

// Common validation helpers and utilities
export {
  uuidSchema,
  dateRangeSchema,
  paginationSchema,
  getValidationErrors,
  validateAppointmentBusinessRules
} from './validation-helpers';
