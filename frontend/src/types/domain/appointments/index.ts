/**
 * WF-COMP-317 | appointments/index.ts - Unified exports for appointment types
 * Purpose: Re-export all appointment-related types from modular structure
 * Upstream: React, external libs | Dependencies: React ecosystem
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: all appointment types, utilities, constants | Key Features: Modular type organization
 * Last Updated: 2025-11-11 | File Type: .ts
 * Critical Path: Type imports → Component development → State management → API integration
 * LLM Context: Index file for modular appointment types, maintains backward compatibility
 */

/**
 * Appointment Types Index
 * Unified exports for the White Cross appointment scheduling system types
 * 
 * **Modular Architecture**:
 * - Core: Essential entities, enums, and validation constants
 * - API: Request/response types and endpoint parameters
 * - Utils: Validation helpers, utilities, and type guards
 *
 * **Benefits of New Structure**:
 * ✅ Each module under 500 lines (was 896 lines total)
 * ✅ Better separation of concerns by domain
 * ✅ Improved maintainability and navigation
 * ✅ Easier to find related types and utilities
 * ✅ Backward compatibility maintained
 *
 * **Usage Examples**:
 * ```typescript
 * import { Appointment, AppointmentStatus } from '@/types/domain/appointments';
 * import { CreateAppointmentData } from '@/types/domain/appointments/api';
 * import { validateAppointmentData } from '@/types/domain/appointments/utils';
 * ```
 */

// =====================
// CORE TYPES AND ENUMS
// =====================

export * from './core';

// =====================
// API REQUEST/RESPONSE TYPES
// =====================

export * from './api';

// =====================
// UTILITIES AND VALIDATION
// =====================

export * from './utils';

// =====================
// LEGACY COMPATIBILITY
// =====================

/**
 * Module version for tracking changes
 */
export const APPOINTMENTS_TYPES_VERSION = '2.0.0-modular';

/**
 * Legacy file version for reference
 */
export const LEGACY_VERSION = '1.0.0';

/**
 * Original file size for reference
 */
export const ORIGINAL_LINE_COUNT = 896;

/**
 * New modular structure line counts
 */
export const MODULAR_STRUCTURE = {
  'core.ts': '~300 lines - Core entities, enums, validation constants',
  'api.ts': '~300 lines - API request/response types, endpoint parameters',
  'utils.ts': '~300 lines - Validation helpers, utilities, type guards',
  'index.ts': 'Re-exports and compatibility'
} as const;

/**
 * Migration completion marker
 */
export const REFACTORING_COMPLETED = true;

// =====================
// QUICK REFERENCE EXPORTS
// =====================

// Re-export commonly used types for convenience
export type {
  // Core entities
  Appointment,
  AppointmentReminder, 
  AppointmentWaitlist,
  NurseAvailability,
  AvailabilitySlot,
  RecurrencePattern,
  
  // Reference types
  StudentReference,
  UserReference,
  
  // Populated types
  PopulatedAppointment,
  PopulatedWaitlistEntry,
  
  // UI types
  AppointmentCalendarEvent,
  AppointmentTimeSlot,
  AppointmentNotification
} from './core';

export type {
  // API request types
  CreateAppointmentData,
  UpdateAppointmentData,
  AppointmentFilters,
  NurseAvailabilityData,
  WaitlistEntryData,
  WaitlistFilters,
  ReminderData,
  RecurringAppointmentData,
  
  // API response types
  AppointmentStatistics,
  ReminderProcessingResult,
  ConflictCheckResult,
  CalendarExportOptions,
  
  // Form data types
  AppointmentFormData,
  WaitlistFormData,
  AvailabilityFormData,
  
  // Query parameters
  GetAppointmentsParams,
  GetAvailabilityParams,
  GetWaitlistParams,
  GetStatisticsParams,
  
  // Bulk operations
  BulkCreateAppointmentsData,
  BulkUpdateAppointmentsData,
  BulkCancelAppointmentsData,
  BulkOperationResult,
  
  // Validation results
  AppointmentValidationResult,
  AvailabilityCheckResult,
  
  // Notification types
  NotificationPreferences,
  NotificationDeliveryStatus,
  
  // Search types
  AdvancedSearchCriteria,
  AppointmentSearchResults,

  // Analytics types
  TrendDataPoint,
  StudentNoShowStat,
  DailyUtilizationStat
} from './api';

// Re-export commonly used enums
export {
  AppointmentType,
  AppointmentStatus,
  WaitlistPriority,
  WaitlistStatus,
  ReminderStatus,
  MessageType,
  RecurrenceFrequency
} from './core';

// Re-export commonly used constants
export {
  APPOINTMENT_VALIDATION,
  APPOINTMENT_STATUS_TRANSITIONS
} from './core';

// Re-export commonly used utilities
export {
  // Type guards
  isUpcomingAppointment,
  isCancellable,
  isActiveWaitlistEntry,
  
  // Helper functions
  getAppointmentEndTime,
  formatAppointmentType,
  getAppointmentStatusColor,
  getWaitlistPriorityColor,
  
  // Validation helpers
  validateDuration,
  validateFutureDateTime,
  validateBusinessHours,
  validateNotWeekend,
  validateStatusTransition,
  validateCancellationNotice,
  validateAppointmentData,
  
  // Utility functions
  getAvailableDurations,
  canCancelAppointment,
  canStartAppointment,
  canCompleteAppointment,
  
  // Time utilities
  formatTime,
  formatDate,
  formatDateTime,
  getRelativeTime,
  appointmentsOverlap,
  formatDuration,
  calculateEndTime,
  isWithinBusinessHours,
  isWeekend,
  getNextBusinessDay,
  
  // Sorting utilities
  sortAppointmentsByDate,
  sortWaitlistByPriority,
  filterAppointmentsByStatus,
  filterAppointmentsByDateRange
} from './utils';
