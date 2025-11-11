/**
 * WF-COMP-317 | appointments/api.ts - API request and response types
 * Purpose: API data transfer objects and request/response types for appointments
 * Upstream: React, external libs | Dependencies: React ecosystem
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: request/response types, filter interfaces | Key Features: API type safety
 * Last Updated: 2025-11-11 | File Type: .ts
 * Critical Path: API calls → Data validation → State updates → UI rendering
 * LLM Context: API types module for appointment system, part of modular architecture
 */

/**
 * Appointment API Types Module
 * Request/response type definitions for appointment-related API endpoints
 * Ensures type safety for API interactions in the White Cross healthcare platform
 */

import type {
  AppointmentType,
  AppointmentStatus,
  WaitlistPriority,
  WaitlistStatus,
  MessageType,
  RecurrencePattern,
  Appointment,
  AppointmentReminder,
  AppointmentWaitlist,
  AvailabilitySlot
} from './core';

// =====================
// API REQUEST TYPES
// =====================

/**
 * Create Appointment Request Data
 * Data required to create a new appointment
 */
export interface CreateAppointmentData {
  studentId: string;
  nurseId: string;
  type: AppointmentType;
  scheduledAt: string; // ISO 8601 datetime
  duration?: number; // Minutes, defaults to 30
  reason: string;
  notes?: string;
}

/**
 * Update Appointment Request Data
 * Data that can be updated for an existing appointment
 */
export interface UpdateAppointmentData {
  type?: AppointmentType;
  scheduledAt?: string; // ISO 8601 datetime
  duration?: number; // Minutes
  reason?: string;
  notes?: string;
  status?: AppointmentStatus;
}

/**
 * Appointment Filter Criteria
 * Used for filtering and searching appointments
 */
export interface AppointmentFilters {
  nurseId?: string;
  studentId?: string;
  status?: AppointmentStatus;
  type?: AppointmentType;
  dateFrom?: string; // ISO 8601 date
  dateTo?: string; // ISO 8601 date
  page?: number;
  limit?: number;
}

/**
 * Nurse Availability Request Data
 * Data for creating or updating nurse availability
 */
export interface NurseAvailabilityData {
  nurseId: string;
  dayOfWeek?: number; // 0-6, where 0 is Sunday
  startTime: string; // Time in HH:mm format
  endTime: string; // Time in HH:mm format
  isRecurring?: boolean;
  specificDate?: string; // ISO 8601 date
  isAvailable?: boolean;
  reason?: string;
}

/**
 * Waitlist Entry Request Data
 * Data for adding a student to the appointment waitlist
 */
export interface WaitlistEntryData {
  studentId: string;
  nurseId?: string;
  type: AppointmentType;
  preferredDate?: string; // ISO 8601 date
  duration?: number; // Minutes
  priority?: WaitlistPriority;
  reason: string;
  notes?: string;
}

/**
 * Waitlist Filter Criteria
 * Used for filtering waitlist entries
 */
export interface WaitlistFilters {
  nurseId?: string;
  status?: WaitlistStatus;
  priority?: WaitlistPriority;
}

/**
 * Reminder Request Data
 * Data for scheduling appointment reminders
 */
export interface ReminderData {
  appointmentId: string;
  type: MessageType;
  scheduleTime: string; // ISO 8601 datetime - when to send the reminder
  message?: string;
}

/**
 * Recurring Appointment Request Data
 * Data for creating recurring appointments
 */
export interface RecurringAppointmentData {
  studentId: string;
  nurseId: string;
  type: AppointmentType;
  scheduledAt: string; // ISO 8601 datetime - first occurrence
  duration?: number; // Minutes
  reason: string;
  notes?: string;
  recurrence: RecurrencePattern;
}

// =====================
// API RESPONSE TYPES
// =====================

/**
 * Appointment Statistics Response
 * Aggregated statistics about appointments
 */
export interface AppointmentStatistics {
  total: number;
  byStatus: Record<AppointmentStatus, number>;
  byType: Record<AppointmentType, number>;
  noShowRate: number; // Percentage
  completionRate: number; // Percentage

  // Optional alternative property names for backward compatibility
  totalCount?: number;
  completed?: number;
  completedCount?: number;
  upcoming?: number;
  upcomingCount?: number;
  cancelled?: number;
  cancelledCount?: number;
  trend?: number;
  percentageChange?: number;
}

/**
 * Reminder Processing Result
 * Results from processing pending reminders
 */
export interface ReminderProcessingResult {
  total: number;
  sent: number;
  failed: number;
}

/**
 * Conflict Detection Result
 * Results from checking appointment conflicts
 */
export interface ConflictCheckResult {
  hasConflict: boolean;
  conflicts: Appointment[];
  availableSlots: AvailabilitySlot[];
}

/**
 * Calendar Export Configuration
 * Configuration for calendar export (iCal format)
 */
export interface CalendarExportOptions {
  nurseId: string;
  dateFrom?: string; // ISO 8601 date
  dateTo?: string; // ISO 8601 date
  format?: 'ical' | 'google' | 'outlook';
}

// =====================
// FORM DATA TYPES
// =====================

/**
 * Appointment Form Data
 * Type-safe form data for appointment creation/editing
 */
export interface AppointmentFormData {
  studentId: string;
  nurseId: string;
  type: AppointmentType;
  scheduledAt: Date;
  duration: number;
  reason: string;
  notes?: string;
}

/**
 * Waitlist Form Data
 * Type-safe form data for waitlist entry
 */
export interface WaitlistFormData {
  studentId: string;
  nurseId?: string;
  type: AppointmentType;
  preferredDate?: Date;
  duration: number;
  priority: WaitlistPriority;
  reason: string;
  notes?: string;
}

/**
 * Availability Form Data
 * Type-safe form data for nurse availability
 */
export interface AvailabilityFormData {
  nurseId: string;
  dayOfWeek?: number;
  startTime: string;
  endTime: string;
  isRecurring: boolean;
  specificDate?: Date;
  isAvailable: boolean;
  reason?: string;
}

// =====================
// API ENDPOINT PARAMETERS
// =====================

/**
 * Get Appointments Query Parameters
 * Parameters for the GET /appointments endpoint
 */
export interface GetAppointmentsParams {
  nurseId?: string;
  studentId?: string;
  status?: AppointmentStatus | AppointmentStatus[];
  type?: AppointmentType | AppointmentType[];
  dateFrom?: string; // ISO 8601 date
  dateTo?: string; // ISO 8601 date
  page?: number;
  limit?: number;
  sort?: 'scheduledAt' | 'createdAt' | 'status' | 'type';
  order?: 'asc' | 'desc';
}

/**
 * Get Availability Query Parameters
 * Parameters for the GET /availability endpoint
 */
export interface GetAvailabilityParams {
  nurseId?: string;
  date?: string; // ISO 8601 date
  dateFrom?: string; // ISO 8601 date
  dateTo?: string; // ISO 8601 date
  duration?: number; // Appointment duration to check availability for
}

/**
 * Get Waitlist Query Parameters
 * Parameters for the GET /waitlist endpoint
 */
export interface GetWaitlistParams {
  nurseId?: string;
  status?: WaitlistStatus | WaitlistStatus[];
  priority?: WaitlistPriority | WaitlistPriority[];
  type?: AppointmentType | AppointmentType[];
  page?: number;
  limit?: number;
  sort?: 'priority' | 'createdAt' | 'expiresAt';
  order?: 'asc' | 'desc';
}

/**
 * Get Statistics Query Parameters
 * Parameters for the GET /appointments/statistics endpoint
 */
export interface GetStatisticsParams {
  nurseId?: string;
  dateFrom?: string; // ISO 8601 date
  dateTo?: string; // ISO 8601 date
  groupBy?: 'day' | 'week' | 'month' | 'year';
}

// =====================
// BULK OPERATION TYPES
// =====================

/**
 * Bulk Appointment Creation Data
 * Data for creating multiple appointments at once
 */
export interface BulkCreateAppointmentsData {
  appointments: CreateAppointmentData[];
  validateConflicts?: boolean;
  sendReminders?: boolean;
}

/**
 * Bulk Appointment Update Data
 * Data for updating multiple appointments at once
 */
export interface BulkUpdateAppointmentsData {
  appointmentIds: string[];
  updates: UpdateAppointmentData;
}

/**
 * Bulk Appointment Cancellation Data
 * Data for cancelling multiple appointments at once
 */
export interface BulkCancelAppointmentsData {
  appointmentIds: string[];
  reason: string;
  notifyStudents?: boolean;
}

/**
 * Bulk Operation Result
 * Results from bulk operations on appointments
 */
export interface BulkOperationResult {
  total: number;
  successful: number;
  failed: number;
  errors: Array<{
    id: string;
    error: string;
  }>;
}

// =====================
// VALIDATION RESULT TYPES
// =====================

/**
 * Appointment Validation Result
 * Results from validating appointment data
 */
export interface AppointmentValidationResult {
  valid: boolean;
  errors: Array<{
    field: string;
    message: string;
    code?: string;
  }>;
  warnings: Array<{
    field: string;
    message: string;
    code?: string;
  }>;
}

/**
 * Availability Check Result
 * Results from checking nurse availability
 */
export interface AvailabilityCheckResult {
  available: boolean;
  conflicts: Array<{
    appointment: Appointment;
    overlapsMinutes: number;
  }>;
  suggestions: Array<{
    startTime: string; // ISO 8601 datetime
    endTime: string; // ISO 8601 datetime
    nurseId: string;
    nurseName: string;
  }>;
}

// =====================
// NOTIFICATION TYPES
// =====================

/**
 * Appointment Notification Preferences
 * User preferences for appointment notifications
 */
export interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
  reminderHours: number; // Hours before appointment
  confirmationRequired: boolean;
}

/**
 * Notification Delivery Status
 * Status of notification delivery attempts
 */
export interface NotificationDeliveryStatus {
  id: string;
  appointmentId: string;
  type: MessageType;
  status: 'pending' | 'sent' | 'delivered' | 'failed';
  sentAt?: string; // ISO 8601 datetime
  deliveredAt?: string; // ISO 8601 datetime
  failureReason?: string;
  retryCount: number;
  maxRetries: number;
}

// =====================
// SEARCH AND FILTERING
// =====================

/**
 * Advanced Search Criteria
 * Advanced search options for appointments
 */
export interface AdvancedSearchCriteria {
  query?: string; // Free text search
  filters: {
    dateRange?: {
      start: string; // ISO 8601 date
      end: string; // ISO 8601 date
    };
    timeRange?: {
      startTime: string; // HH:mm format
      endTime: string; // HH:mm format
    };
    status?: AppointmentStatus[];
    type?: AppointmentType[];
    nurseIds?: string[];
    studentIds?: string[];
    hasNotes?: boolean;
    followUpRequired?: boolean;
  };
  sort: {
    field: 'scheduledAt' | 'createdAt' | 'duration' | 'status' | 'type';
    order: 'asc' | 'desc';
  };
  pagination: {
    page: number;
    limit: number;
  };
}

/**
 * Search Results
 * Results from appointment search operations
 */
export interface AppointmentSearchResults {
  appointments: Appointment[];
  total: number;
  page: number;
  totalPages: number;
  facets: {
    status: Record<AppointmentStatus, number>;
    type: Record<AppointmentType, number>;
    nurses: Array<{
      id: string;
      name: string;
      count: number;
    }>;
  };
}
