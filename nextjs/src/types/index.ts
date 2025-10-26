/**
 * WF-IDX-326 | index.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: React ecosystem
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: interfaces | Key Features: Standard module
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

// Central types export file for the White Cross healthcare platform
// Re-exports all types from unified type system

// IMPORTANT: Export common and api types first. Domain-specific files should NOT
// re-export common types to avoid TS2308 "already exported" errors.
// If you need types from common, import them directly from './common' or use this index.

// Re-export common base types
export * from './common'

// Re-export API types
export * from './api'

// Re-export domain-specific types
// NOTE: Wildcard exports commented out to resolve TS2308 duplicate export errors
// These domain files re-export types already in common/api, causing conflicts
// Consumers should import from './common', './api', or specific domain files directly
// TODO: Refactor domain files to not re-export common/api types
// export * from './appointments'
// export * from './administration'
// export * from './communication'
// export * from './incidents'
// export * from './compliance'
// export * from './reports'
// export * from './dashboard'
// export * from './integrations'
// export * from './vendors'
// export * from './purchaseOrders'
// export * from './inventory'

// Export appointment-specific types (avoiding enum conflicts with common.ts)
export type {
  Appointment,
  AppointmentReminder,
  AppointmentWaitlist,
  NurseAvailability,
  AvailabilitySlot,
  CreateAppointmentData,
  UpdateAppointmentData,
  AppointmentFilters,
  NurseAvailabilityData,
  WaitlistEntryData,
  WaitlistFilters,
  ReminderData,
  RecurrencePattern,
  RecurringAppointmentData,
  AppointmentStatistics,
  ReminderProcessingResult,
  ConflictCheckResult,
  CalendarExportOptions,
  AppointmentFormData,
  WaitlistFormData,
  AvailabilityFormData,
  PopulatedAppointment,
  PopulatedWaitlistEntry,
  AppointmentCalendarEvent,
  AppointmentTimeSlot,
  AppointmentNotification,
} from './appointments'

// Re-export appointment enums (these take precedence over common.ts type aliases)
export {
  AppointmentType,
  AppointmentStatus,
  WaitlistPriority,
  WaitlistStatus,
  ReminderStatus,
  MessageType,
  RecurrenceFrequency,
  APPOINTMENT_VALIDATION,
  APPOINTMENT_STATUS_TRANSITIONS,
} from './appointments'

// Safe exports (no conflicts with common/api)
export * from './analytics'
export * from './accessControl'
// export * from './budget' // Conflicts: BudgetCategory
export * from './state'
export * from './navigation'
export * from './cache'
// export * from './healthRecords' // Conflicts: MedicationAdherence, Allergy, ChronicCondition, etc.
export * from './documents'
// export * from './student.types' // Conflicts: Student, EmergencyContact, Gender, etc.

// Re-export medication-specific types (avoiding duplicates with api.ts)
export type {
  MedicationTab,
  DosageForm,
  AdministrationRoute,
  SeverityLevel,
  AdverseReactionSeverity,
  MedicationLogStatus,
  MedicationLog,
  MedicationAdministrationData,
  AdverseReactionData,
  PrescriptionData,
  InventoryFormData,
  FormErrors,
  MedicationFormErrors,
  StudentMedicationFormErrors,
  AdverseReactionFormErrors,
  MedicationsResponse,
  StudentMedicationsResponse,
  InventoryResponse,
  RemindersResponse,
  AdverseReactionsResponse,
  MedicationScheduleResponse,
  MedicationAlertsResponse,
  MedicationFormOptions,
  MedicationTabConfig,
  MedicationStats,
  MedicationSearchFilters,
  InventoryFilters,
  MedicationEventHandlers,
  InventoryEventHandlers,
  ReminderEventHandlers,
  AdverseReactionEventHandlers,
  TabContentProps,
  ModalProps,
  MedicationModalProps,
  AdverseReactionModalProps,
  FiveRightsValidation,
  UseMedicationsDataReturn,
  UseFormValidationReturn,
  UseToastReturn
} from './medications'

// Legacy ApiResponse interface for backward compatibility
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    message: string
  }
  errors?: Array<{
    field: string
    message: string
  }>
}

// Legacy types that may still be used in older components
// These should gradually be migrated to use the unified types above

export interface LegacyMedicationWithCount {
  id: string
  name: string
  genericName?: string
  dosageForm: string
  strength: string
  manufacturer?: string
  isControlled: boolean
  _count?: {
    studentMedications: number
  }
  createdAt: string
  updatedAt: string
}
