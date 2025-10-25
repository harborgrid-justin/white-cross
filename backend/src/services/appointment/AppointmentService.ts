/**
 * @fileoverview Appointment Management Service Facade - Unified interface for comprehensive appointment operations
 *
 * LOC: 49AC6FBA67
 * WC-SVC-APT-016 | appointmentService.ts - Appointment Management Service Facade
 *
 * This service implements the Facade design pattern, providing a clean, unified API for all appointment-related
 * operations while delegating to specialized modular services. It serves as the primary integration point
 * for appointment functionality across the White Cross healthcare platform.
 *
 * ARCHITECTURE:
 * - Facade Pattern: Single entry point for appointment operations
 * - Modular Design: Delegates to 10+ specialized services
 * - Healthcare-Focused: Implements HIPAA-compliant appointment management
 * - Enterprise-Grade: Comprehensive validation, conflict detection, and audit logging
 *
 * CORE MODULES (located in ./appointment/):
 * - validation.ts: Business rule validation logic
 * - statusTransitions.ts: Finite state machine for appointment lifecycle
 * - crudOperations.ts: CRUD operations for appointments
 * - AppointmentAvailabilityService.ts: Availability and conflict checking
 * - AppointmentReminderService.ts: Reminder scheduling and sending
 * - AppointmentWaitlistService.ts: Waitlist management and slot filling
 * - AppointmentRecurringService.ts: Recurring appointment patterns
 * - AppointmentStatisticsService.ts: Reporting and analytics
 * - AppointmentCalendarService.ts: Calendar export functionality
 * - NurseAvailabilityService.ts: Nurse schedule management
 *
 * UPSTREAM DEPENDENCIES:
 * - crudOperations.ts (services/appointment/crudOperations.ts)
 * - AppointmentAvailabilityService.ts (services/appointment/AppointmentAvailabilityService.ts)
 * - AppointmentReminderService.ts (services/appointment/AppointmentReminderService.ts)
 * - AppointmentWaitlistService.ts (services/appointment/AppointmentWaitlistService.ts)
 * - AppointmentRecurringService.ts (services/appointment/AppointmentRecurringService.ts)
 * - AppointmentStatisticsService.ts, AppointmentCalendarService.ts, NurseAvailabilityService.ts
 * - validation.ts, statusTransitions.ts
 * - businessHours utilities (../shared/time/businessHours)
 *
 * DOWNSTREAM CONSUMERS:
 * - appointments.ts (routes/v1/operations/appointments.ts) - REST API endpoints
 * - dashboardService.ts - Nurse dashboard appointment views
 * - reportService.ts - Appointment analytics and compliance reports
 *
 * RELATED SERVICES:
 * - nurseService: Nurse scheduling and availability
 * - studentService: Student health record integration
 * - communicationService: Appointment reminders and notifications
 * - auditService: HIPAA-compliant audit logging
 *
 * CRITICAL PATH:
 * 1. Appointment request received
 * 2. Availability check (conflicts, business hours)
 * 3. Validation (data integrity, business rules)
 * 4. Scheduling (create/update appointment)
 * 5. Reminder setup (automatic notifications)
 * 6. Audit logging (HIPAA compliance)
 *
 * HIPAA COMPLIANCE:
 * - Contains student PHI (appointment details, health context)
 * - Nurse schedules and assignments
 * - All operations logged for audit trails
 * - Access controlled via RBAC middleware
 *
 * @module services/appointment/AppointmentService
 * @requires services/appointment/crudOperations
 * @requires services/appointment/AppointmentAvailabilityService
 * @requires services/appointment/AppointmentReminderService
 * @requires services/appointment/AppointmentWaitlistService
 * @requires services/appointment/AppointmentRecurringService
 * @requires services/appointment/AppointmentStatisticsService
 * @requires services/appointment/AppointmentCalendarService
 * @requires services/appointment/NurseAvailabilityService
 * @requires services/appointment/validation
 * @requires services/appointment/statusTransitions
 * @requires shared/time/businessHours
 *
 * @example
 * ```typescript
 * // Create a new appointment with availability checking
 * const appointment = await AppointmentService.createAppointment({
 *   studentId: 'student-123',
 *   nurseId: 'nurse-456',
 *   scheduledAt: new Date('2025-10-26T10:00:00Z'),
 *   duration: 30,
 *   type: AppointmentType.CHECKUP,
 *   notes: 'Annual physical examination'
 * });
 *
 * // Check nurse availability for a time slot
 * const slots = await AppointmentService.getAvailableSlots(
 *   'nurse-456',
 *   new Date('2025-10-26'),
 *   30
 * );
 *
 * // Create recurring weekly appointments
 * const recurring = await AppointmentService.createRecurringAppointments(
 *   baseAppointmentData,
 *   { frequency: 'weekly', count: 12 }
 * );
 * ```
 *
 * @since 1.0.0
 * @lastUpdated 2025-10-25
 */

import {
  CreateAppointmentData,
  UpdateAppointmentData,
  AppointmentFilters,
  AvailabilitySlot,
  ReminderData,
  NurseAvailabilityData,
  WaitlistEntry,
  RecurrencePattern
} from '../../types/appointment';

// Import all modular services
import { AppointmentCrudOperations } from './crudOperations';
import { AppointmentAvailabilityService } from './AppointmentAvailabilityService';
import { AppointmentReminderService } from './AppointmentReminderService';
import { AppointmentWaitlistService } from './AppointmentWaitlistService';
import { AppointmentRecurringService } from './AppointmentRecurringService';
import { AppointmentStatisticsService } from './AppointmentStatisticsService';
import { AppointmentCalendarService } from './AppointmentCalendarService';
import { NurseAvailabilityService } from './NurseAvailabilityService';
import { AppointmentValidation } from './validation';
import { AppointmentStatusTransitions } from './statusTransitions';

// Import shared time utilities
import { 
  isWithinBusinessHours, 
  calculateTimeSlots, 
  getNextBusinessDay, 
  formatAppointmentTime 
} from '../shared/time/businessHours';

/**
 * AppointmentService - Facade for comprehensive appointment management
 *
 * This class serves as the primary entry point for all appointment-related operations in the
 * White Cross healthcare platform. It implements the Facade design pattern by providing a
 * simplified, unified interface while delegating actual work to specialized modular services.
 *
 * KEY FEATURES:
 * - CRUD Operations: Create, read, update, delete appointments
 * - Availability Management: Check conflicts, find available time slots
 * - Scheduling Intelligence: Smart conflict detection and resolution
 * - Reminder Automation: Automatic appointment reminders via multiple channels
 * - Recurring Appointments: Support for recurring appointment patterns
 * - Waitlist Management: Automatic slot filling from waitlist
 * - Calendar Integration: iCal export for external calendars
 * - Nurse Scheduling: Manage nurse availability and schedules
 * - Statistics & Reporting: Analytics for appointment trends
 * - Status Transitions: Finite state machine for appointment lifecycle
 *
 * DESIGN PATTERN:
 * This facade maintains backward compatibility while providing a clean API that delegates
 * to specialized services for implementation. This promotes separation of concerns and
 * makes the codebase more maintainable and testable.
 *
 * HIPAA COMPLIANCE:
 * All appointment operations handle student PHI and are logged for audit compliance.
 * Access control is enforced via RBAC middleware at the route level.
 *
 * @class AppointmentService
 * @since 1.0.0
 *
 * @example
 * ```typescript
 * // Get available slots for a nurse
 * const slots = await AppointmentService.getAvailableSlots(
 *   'nurse-123',
 *   new Date('2025-10-26'),
 *   30 // 30-minute slots
 * );
 *
 * // Create appointment with automatic conflict checking
 * const appointment = await AppointmentService.createAppointment({
 *   studentId: 'student-456',
 *   nurseId: 'nurse-123',
 *   scheduledAt: slots[0].start,
 *   duration: 30,
 *   type: AppointmentType.CHECKUP
 * });
 *
 * // Reminders are automatically scheduled on creation
 * ```
 */
export class AppointmentService {
  // =====================
  // CONFIGURATION CONSTANTS (Delegated to validation module)
  // =====================

  /**
   * Minimum appointment duration in minutes
   * @type {number}
   * @readonly
   * @static
   */
  static get MIN_DURATION_MINUTES() { return 15; }

  /**
   * Maximum appointment duration in minutes
   * @type {number}
   * @readonly
   * @static
   */
  static get MAX_DURATION_MINUTES() { return 120; }

  /**
   * Default appointment duration in minutes when not specified
   * @type {number}
   * @readonly
   * @static
   */
  static get DEFAULT_DURATION_MINUTES() { return AppointmentValidation.getDefaultDuration(); }

  /**
   * Buffer time between appointments in minutes to allow for cleanup and preparation
   * @type {number}
   * @readonly
   * @static
   */
  static get BUFFER_TIME_MINUTES() { return AppointmentValidation.getBufferTimeMinutes(); }

  /**
   * Minimum hours notice required for appointment cancellation
   * @type {number}
   * @readonly
   * @static
   */
  static get MIN_CANCELLATION_HOURS() { return 2; }

  /**
   * Maximum number of appointments a nurse can have per day
   * @type {number}
   * @readonly
   * @static
   */
  static get MAX_APPOINTMENTS_PER_DAY() { return 16; }

  /**
   * Business hours configuration for appointment scheduling
   * @type {Object}
   * @property {string} start - Start time (e.g., "08:00")
   * @property {string} end - End time (e.g., "17:00")
   * @readonly
   * @static
   */
  static get BUSINESS_HOURS() { return AppointmentValidation.getBusinessHours(); }

  // =====================
  // CRUD OPERATIONS (Delegated to crudOperations module)
  // =====================

  /**
   * Retrieves appointments with pagination and advanced filtering capabilities
   *
   * Supports comprehensive filtering by nurse, student, status, type, and date ranges.
   * Returns paginated results with associated student and nurse information.
   *
   * @param {number} [page=1] - Page number for pagination (1-indexed)
   * @param {number} [limit=20] - Number of appointments per page (max 100)
   * @param {AppointmentFilters} [filters={}] - Filter criteria
   * @param {string} [filters.nurseId] - Filter by nurse ID
   * @param {string} [filters.studentId] - Filter by student ID
   * @param {AppointmentStatus} [filters.status] - Filter by appointment status
   * @param {AppointmentType} [filters.type] - Filter by appointment type
   * @param {Date} [filters.dateFrom] - Filter appointments from this date (inclusive)
   * @param {Date} [filters.dateTo] - Filter appointments to this date (inclusive)
   *
   * @returns {Promise<{appointments: Appointment[], pagination: {page: number, limit: number, total: number, pages: number}}>}
   *   Paginated appointment results with metadata
   *
   * @throws {Error} If database query fails
   *
   * @example
   * ```typescript
   * // Get all scheduled appointments for a nurse
   * const result = await AppointmentService.getAppointments(1, 20, {
   *   nurseId: 'nurse-123',
   *   status: AppointmentStatus.SCHEDULED,
   *   dateFrom: new Date('2025-10-26'),
   *   dateTo: new Date('2025-10-31')
   * });
   * console.log(`Total: ${result.pagination.total} appointments`);
   * ```
   */
  static async getAppointments(
    page: number = 1,
    limit: number = 20,
    filters: AppointmentFilters = {}
  ) {
    return AppointmentCrudOperations.getAppointments(page, limit, filters);
  }

  /**
   * Retrieves a single appointment by ID with full details
   *
   * Includes associated student and nurse information. Used for detailed views
   * and when editing existing appointments.
   *
   * @param {string} id - Appointment UUID
   *
   * @returns {Promise<Appointment>} Appointment with student and nurse details
   *
   * @throws {Error} If appointment not found or database error occurs
   *
   * @example
   * ```typescript
   * const appointment = await AppointmentService.getAppointmentById('appt-123');
   * console.log(`${appointment.student.firstName} with ${appointment.nurse.firstName}`);
   * ```
   */
  static async getAppointmentById(id: string) {
    return AppointmentCrudOperations.getAppointmentById(id);
  }

  /**
   * Creates a new appointment with comprehensive validation and conflict checking
   *
   * This method performs:
   * - Data validation (duration, date, business rules)
   * - Student and nurse existence verification
   * - Availability conflict checking with buffer time
   * - Automatic reminder scheduling
   * - Audit logging for HIPAA compliance
   *
   * @param {CreateAppointmentData} data - Appointment creation data
   * @param {string} data.studentId - Student UUID
   * @param {string} data.nurseId - Nurse (User) UUID
   * @param {Date} data.scheduledAt - Appointment date and time
   * @param {number} [data.duration] - Duration in minutes (defaults to 30)
   * @param {AppointmentType} data.type - Type of appointment
   * @param {string} [data.notes] - Optional notes or reason for appointment
   *
   * @returns {Promise<Appointment>} Created appointment with associations
   *
   * @throws {Error} If validation fails, conflicts detected, or student/nurse not found
   *
   * @example
   * ```typescript
   * const appointment = await AppointmentService.createAppointment({
   *   studentId: 'student-456',
   *   nurseId: 'nurse-123',
   *   scheduledAt: new Date('2025-10-26T10:00:00Z'),
   *   duration: 30,
   *   type: AppointmentType.MEDICATION_ADMINISTRATION,
   *   notes: 'Daily insulin administration'
   * });
   * // Reminders automatically scheduled
   * ```
   */
  static async createAppointment(data: CreateAppointmentData) {
    return AppointmentCrudOperations.createAppointment(data);
  }

  /**
   * Updates an existing appointment with validation and conflict checking
   *
   * Validates status transitions, checks for scheduling conflicts when rescheduling,
   * and prevents modification of finalized appointments (completed, cancelled, no-show).
   *
   * @param {string} id - Appointment UUID
   * @param {UpdateAppointmentData} data - Partial appointment data to update
   * @param {Date} [data.scheduledAt] - New scheduled time (triggers conflict check)
   * @param {number} [data.duration] - New duration in minutes
   * @param {AppointmentStatus} [data.status] - New status (validates transitions)
   * @param {string} [data.notes] - Updated notes
   *
   * @returns {Promise<Appointment>} Updated appointment with associations
   *
   * @throws {Error} If appointment not found, invalid transition, or conflicts detected
   *
   * @example
   * ```typescript
   * // Reschedule an appointment
   * const updated = await AppointmentService.updateAppointment('appt-123', {
   *   scheduledAt: new Date('2025-10-26T14:00:00Z'),
   *   notes: 'Rescheduled per parent request'
   * });
   * ```
   */
  static async updateAppointment(id: string, data: UpdateAppointmentData) {
    return AppointmentCrudOperations.updateAppointment(id, data);
  }

  /**
   * Cancels an appointment with validation and waitlist processing
   *
   * Validates cancellation notice period (minimum 2 hours), updates status,
   * and attempts to fill the slot from the waitlist automatically.
   *
   * @param {string} id - Appointment UUID
   * @param {string} [reason] - Optional cancellation reason
   *
   * @returns {Promise<Appointment>} Cancelled appointment
   *
   * @throws {Error} If appointment not found, already finalized, or insufficient notice
   *
   * @example
   * ```typescript
   * const cancelled = await AppointmentService.cancelAppointment(
   *   'appt-123',
   *   'Student home sick today'
   * );
   * // Waitlist automatically processed to fill slot
   * ```
   */
  static async cancelAppointment(id: string, reason?: string) {
    return AppointmentCrudOperations.cancelAppointment(id, reason);
  }

  /**
   * Marks an appointment as no-show when student doesn't arrive
   *
   * Validates that appointment time has passed and current status allows
   * transition to NO_SHOW. Helps track attendance patterns.
   *
   * @param {string} id - Appointment UUID
   *
   * @returns {Promise<Appointment>} Appointment marked as no-show
   *
   * @throws {Error} If appointment not found, time hasn't passed, or invalid status
   *
   * @example
   * ```typescript
   * // Mark no-show after 15 minutes past scheduled time
   * const noShow = await AppointmentService.markNoShow('appt-123');
   * ```
   */
  static async markNoShow(id: string) {
    return AppointmentCrudOperations.markNoShow(id);
  }

  /**
   * Starts an appointment by transitioning to IN_PROGRESS status
   *
   * Validates appointment time is within reasonable range (not too early/late)
   * and current status allows transition. Typically called when student arrives.
   *
   * @param {string} id - Appointment UUID
   *
   * @returns {Promise<Appointment>} Appointment with IN_PROGRESS status
   *
   * @throws {Error} If appointment not found, timing invalid, or status transition not allowed
   *
   * @example
   * ```typescript
   * // Student arrives, start appointment
   * const started = await AppointmentService.startAppointment('appt-123');
   * ```
   */
  static async startAppointment(id: string) {
    return AppointmentCrudOperations.startAppointment(id);
  }

  /**
   * Completes an appointment by transitioning to COMPLETED status
   *
   * Allows optional completion data including notes, outcomes, and follow-up requirements.
   * Only appointments in SCHEDULED or IN_PROGRESS status can be completed.
   *
   * @param {string} id - Appointment UUID
   * @param {Object} [completionData] - Optional completion details
   * @param {string} [completionData.notes] - Completion notes or summary
   * @param {string} [completionData.outcomes] - Health outcomes or observations
   * @param {boolean} [completionData.followUpRequired] - Whether follow-up is needed
   * @param {Date} [completionData.followUpDate] - Suggested follow-up date
   *
   * @returns {Promise<Appointment>} Completed appointment
   *
   * @throws {Error} If appointment not found or status transition not allowed
   *
   * @example
   * ```typescript
   * const completed = await AppointmentService.completeAppointment('appt-123', {
   *   notes: 'Medication administered successfully',
   *   outcomes: 'No adverse reactions observed',
   *   followUpRequired: true,
   *   followUpDate: new Date('2025-11-02')
   * });
   * ```
   */
  static async completeAppointment(id: string, completionData?: {
    notes?: string;
    outcomes?: string;
    followUpRequired?: boolean;
    followUpDate?: Date;
  }) {
    return AppointmentCrudOperations.completeAppointment(id, completionData);
  }

  /**
   * Retrieves upcoming appointments for a specific nurse
   *
   * Returns scheduled or in-progress appointments ordered by scheduled time.
   * Useful for nurse dashboard and daily schedule views.
   *
   * @param {string} nurseId - Nurse (User) UUID
   * @param {number} [limit=10] - Maximum number of appointments to return
   *
   * @returns {Promise<Appointment[]>} Array of upcoming appointments with student details
   *
   * @throws {Error} If database query fails
   *
   * @example
   * ```typescript
   * const upcoming = await AppointmentService.getUpcomingAppointments('nurse-123', 5);
   * upcoming.forEach(apt => {
   *   console.log(`${apt.scheduledAt}: ${apt.student.firstName} - ${apt.type}`);
   * });
   * ```
   */
  static async getUpcomingAppointments(nurseId: string, limit: number = 10) {
    return AppointmentCrudOperations.getUpcomingAppointments(nurseId, limit);
  }

  // =====================
  // AVAILABILITY OPERATIONS (Delegated to AppointmentAvailabilityService)
  // =====================

  /**
   * Checks nurse availability for a specific time slot with conflict detection
   *
   * Performs comprehensive availability check including:
   * - Existing appointment conflicts
   * - Buffer time between appointments
   * - Business hours validation
   * - Optional exclusion of specific appointment (for rescheduling)
   *
   * @param {string} nurseId - Nurse (User) UUID
   * @param {Date} startTime - Proposed appointment start time
   * @param {number} duration - Appointment duration in minutes
   * @param {string} [excludeAppointmentId] - Optional appointment ID to exclude from conflict check (for updates)
   *
   * @returns {Promise<Appointment[]>} Array of conflicting appointments (empty if available)
   *
   * @throws {Error} If database query fails
   *
   * @example
   * ```typescript
   * const conflicts = await AppointmentService.checkAvailability(
   *   'nurse-123',
   *   new Date('2025-10-26T10:00:00Z'),
   *   30
   * );
   * if (conflicts.length === 0) {
   *   console.log('Time slot is available');
   * } else {
   *   console.log(`Conflicts with ${conflicts.length} appointments`);
   * }
   * ```
   */
  static async checkAvailability(
    nurseId: string,
    startTime: Date,
    duration: number,
    excludeAppointmentId?: string
  ) {
    return AppointmentAvailabilityService.checkAvailability(
      nurseId,
      startTime,
      duration,
      excludeAppointmentId
    );
  }

  /**
   * Retrieves all available time slots for a nurse on a given date
   *
   * Generates time slots within business hours, excluding existing appointments
   * and accounting for buffer time. Returns slots sorted chronologically.
   *
   * @param {string} nurseId - Nurse (User) UUID
   * @param {Date} date - Target date for availability check
   * @param {number} [slotDuration=30] - Duration of each slot in minutes
   *
   * @returns {Promise<AvailabilitySlot[]>} Array of available time slots with start/end times
   *
   * @throws {Error} If database query fails
   *
   * @example
   * ```typescript
   * const slots = await AppointmentService.getAvailableSlots(
   *   'nurse-123',
   *   new Date('2025-10-26'),
   *   30
   * );
   * console.log(`${slots.length} available 30-minute slots found`);
   * slots.forEach(slot => {
   *   console.log(`${slot.start.toLocaleTimeString()} - ${slot.end.toLocaleTimeString()}`);
   * });
   * ```
   */
  static async getAvailableSlots(
    nurseId: string,
    date: Date,
    slotDuration: number = 30
  ): Promise<AvailabilitySlot[]> {
    return AppointmentAvailabilityService.getAvailableSlots(nurseId, date, slotDuration);
  }

  // =====================
  // REMINDER OPERATIONS (Delegated to AppointmentReminderService)
  // =====================

  /**
   * Schedules automatic reminders for an appointment
   *
   * Creates reminder records at configured intervals (e.g., 24 hours, 1 hour before).
   * Reminders are sent via email, SMS, or push notifications based on preferences.
   * Automatically called when appointments are created.
   *
   * @param {string} appointmentId - Appointment UUID
   *
   * @returns {Promise<void>}
   *
   * @throws {Error} If appointment not found or reminder creation fails
   *
   * @example
   * ```typescript
   * // Manually schedule reminders (usually automatic on create)
   * await AppointmentService.scheduleReminders('appt-123');
   * // Creates reminders at 24h, 1h before appointment
   * ```
   */
  static async scheduleReminders(appointmentId: string) {
    return AppointmentReminderService.scheduleReminders(appointmentId);
  }

  /**
   * Sends a specific appointment reminder through configured channels
   *
   * Dispatches reminder via email, SMS, or push notification based on user preferences.
   * Typically called by scheduled jobs, but can be triggered manually for testing.
   *
   * @param {string} reminderId - Reminder UUID
   *
   * @returns {Promise<void>}
   *
   * @throws {Error} If reminder not found or delivery fails
   *
   * @example
   * ```typescript
   * // Manually send a reminder (usually handled by cron job)
   * await AppointmentService.sendReminder('reminder-789');
   * ```
   */
  static async sendReminder(reminderId: string) {
    return AppointmentReminderService.sendReminder(reminderId);
  }

  /**
   * Processes all pending reminders that are due to be sent
   *
   * Batch processes reminders whose scheduled time has arrived. Typically called
   * by a cron job or scheduled task every 5-15 minutes.
   *
   * @returns {Promise<{sent: number, failed: number}>} Count of sent and failed reminders
   *
   * @throws {Error} If batch processing fails critically
   *
   * @example
   * ```typescript
   * // Called by cron job every 15 minutes
   * const result = await AppointmentService.processPendingReminders();
   * console.log(`Sent: ${result.sent}, Failed: ${result.failed}`);
   * ```
   */
  static async processPendingReminders() {
    return AppointmentReminderService.processPendingReminders();
  }

  // =====================
  // RECURRING APPOINTMENTS (Delegated to AppointmentRecurringService)
  // =====================

  /**
   * Creates multiple appointments based on a recurrence pattern
   *
   * Generates a series of appointments (e.g., weekly medication administration)
   * with automatic conflict checking for each occurrence. Validates that all
   * slots are available before creating any appointments.
   *
   * @param {CreateAppointmentData} baseData - Base appointment data template
   * @param {RecurrencePattern} recurrencePattern - Recurrence configuration
   * @param {string} recurrencePattern.frequency - 'daily' | 'weekly' | 'monthly'
   * @param {number} [recurrencePattern.count] - Number of occurrences
   * @param {Date} [recurrencePattern.until] - End date for recurrence
   * @param {number} [recurrencePattern.interval] - Interval between occurrences
   *
   * @returns {Promise<Appointment[]>} Array of created recurring appointments
   *
   * @throws {Error} If any slot has conflicts or validation fails
   *
   * @example
   * ```typescript
   * // Create 12 weekly medication appointments
   * const recurring = await AppointmentService.createRecurringAppointments(
   *   {
   *     studentId: 'student-456',
   *     nurseId: 'nurse-123',
   *     scheduledAt: new Date('2025-10-27T09:00:00Z'),
   *     duration: 15,
   *     type: AppointmentType.MEDICATION_ADMINISTRATION,
   *     notes: 'Weekly allergy shot'
   *   },
   *   {
   *     frequency: 'weekly',
   *     count: 12
   *   }
   * );
   * console.log(`Created ${recurring.length} recurring appointments`);
   * ```
   */
  static async createRecurringAppointments(
    baseData: CreateAppointmentData,
    recurrencePattern: RecurrencePattern
  ) {
    return AppointmentRecurringService.createRecurringAppointments(baseData, recurrencePattern);
  }

  // =====================
  // STATISTICS & REPORTING (Delegated to AppointmentStatisticsService)
  // =====================

  /**
   * Retrieves comprehensive appointment statistics and analytics
   *
   * Generates metrics including appointment counts by status/type, completion rates,
   * no-show rates, average duration, and utilization trends. Supports filtering
   * by nurse and date range.
   *
   * @param {string} [nurseId] - Optional nurse filter for nurse-specific stats
   * @param {Date} [dateFrom] - Optional start date for date range filter
   * @param {Date} [dateTo] - Optional end date for date range filter
   *
   * @returns {Promise<Object>} Statistics object with metrics and trends
   * @returns {Promise<Object.totalAppointments>} Total appointment count
   * @returns {Promise<Object.byStatus>} Counts grouped by appointment status
   * @returns {Promise<Object.byType>} Counts grouped by appointment type
   * @returns {Promise<Object.completionRate>} Percentage of completed appointments
   * @returns {Promise<Object.noShowRate>} Percentage of no-show appointments
   *
   * @throws {Error} If database query fails
   *
   * @example
   * ```typescript
   * // Get monthly statistics for a nurse
   * const stats = await AppointmentService.getAppointmentStatistics(
   *   'nurse-123',
   *   new Date('2025-10-01'),
   *   new Date('2025-10-31')
   * );
   * console.log(`Completion rate: ${stats.completionRate}%`);
   * console.log(`No-show rate: ${stats.noShowRate}%`);
   * ```
   */
  static async getAppointmentStatistics(nurseId?: string, dateFrom?: Date, dateTo?: Date) {
    return AppointmentStatisticsService.getAppointmentStatistics(nurseId, dateFrom, dateTo);
  }

  // =====================
  // CALENDAR OPERATIONS (Delegated to AppointmentCalendarService)
  // =====================

  /**
   * Generates iCalendar (ICS) export for appointments
   *
   * Creates an ICS file format compatible with Google Calendar, Apple Calendar,
   * Outlook, and other calendar applications. Includes appointment details,
   * student information, and location data.
   *
   * @param {string} nurseId - Nurse (User) UUID
   * @param {Date} [dateFrom] - Optional start date for export range
   * @param {Date} [dateTo] - Optional end date for export range
   *
   * @returns {Promise<string>} ICS format calendar data
   *
   * @throws {Error} If calendar generation fails
   *
   * @example
   * ```typescript
   * // Export next month's appointments
   * const icsData = await AppointmentService.generateCalendarExport(
   *   'nurse-123',
   *   new Date('2025-11-01'),
   *   new Date('2025-11-30')
   * );
   * // Send as download or email attachment
   * res.setHeader('Content-Type', 'text/calendar');
   * res.send(icsData);
   * ```
   */
  static async generateCalendarExport(nurseId: string, dateFrom?: Date, dateTo?: Date): Promise<string> {
    return AppointmentCalendarService.generateCalendarExport(nurseId, dateFrom, dateTo);
  }

  // =====================
  // NURSE AVAILABILITY (Delegated to NurseAvailabilityService)
  // =====================

  /**
   * Sets or creates nurse availability schedule
   *
   * Defines working hours, break times, and unavailable periods for a nurse.
   * Used for availability calculation and conflict prevention.
   *
   * @param {NurseAvailabilityData} data - Nurse availability configuration
   * @param {string} data.nurseId - Nurse (User) UUID
   * @param {Date} data.date - Date for availability schedule
   * @param {string} data.startTime - Work start time (HH:mm format)
   * @param {string} data.endTime - Work end time (HH:mm format)
   * @param {boolean} [data.isAvailable] - Whether nurse is available (default true)
   *
   * @returns {Promise<NurseAvailability>} Created availability record
   *
   * @throws {Error} If validation fails or creation fails
   *
   * @example
   * ```typescript
   * await AppointmentService.setNurseAvailability({
   *   nurseId: 'nurse-123',
   *   date: new Date('2025-10-26'),
   *   startTime: '08:00',
   *   endTime: '16:00',
   *   isAvailable: true
   * });
   * ```
   */
  static async setNurseAvailability(data: NurseAvailabilityData) {
    return NurseAvailabilityService.setNurseAvailability(data);
  }

  /**
   * Retrieves nurse availability schedule for a date or date range
   *
   * @param {string} nurseId - Nurse (User) UUID
   * @param {Date} [date] - Optional specific date (defaults to all future availability)
   *
   * @returns {Promise<NurseAvailability[]>} Array of availability records
   *
   * @throws {Error} If database query fails
   *
   * @example
   * ```typescript
   * const availability = await AppointmentService.getNurseAvailability(
   *   'nurse-123',
   *   new Date('2025-10-26')
   * );
   * ```
   */
  static async getNurseAvailability(nurseId: string, date?: Date) {
    return NurseAvailabilityService.getNurseAvailability(nurseId, date);
  }

  /**
   * Updates existing nurse availability record
   *
   * @param {string} id - Availability record UUID
   * @param {Partial<NurseAvailabilityData>} data - Partial availability data to update
   *
   * @returns {Promise<NurseAvailability>} Updated availability record
   *
   * @throws {Error} If record not found or update fails
   *
   * @example
   * ```typescript
   * await AppointmentService.updateNurseAvailability('avail-123', {
   *   endTime: '17:00' // Extend work hours
   * });
   * ```
   */
  static async updateNurseAvailability(id: string, data: Partial<NurseAvailabilityData>) {
    return NurseAvailabilityService.updateNurseAvailability(id, data);
  }

  /**
   * Deletes nurse availability record
   *
   * @param {string} id - Availability record UUID
   *
   * @returns {Promise<void>}
   *
   * @throws {Error} If record not found or deletion fails
   *
   * @example
   * ```typescript
   * await AppointmentService.deleteNurseAvailability('avail-123');
   * ```
   */
  static async deleteNurseAvailability(id: string) {
    return NurseAvailabilityService.deleteNurseAvailability(id);
  }

  // =====================
  // WAITLIST OPERATIONS (Delegated to AppointmentWaitlistService)
  // =====================

  /**
   * Adds a student to the appointment waitlist
   *
   * When preferred slots are unavailable, students can be added to a waitlist.
   * They'll be automatically notified and scheduled when slots become available.
   *
   * @param {WaitlistEntry} data - Waitlist entry data
   * @param {string} data.studentId - Student UUID
   * @param {string} data.nurseId - Preferred nurse UUID
   * @param {AppointmentType} data.type - Desired appointment type
   * @param {string} [data.priority] - Priority level ('low' | 'normal' | 'high' | 'urgent')
   * @param {Date} [data.preferredDate] - Preferred date for appointment
   *
   * @returns {Promise<WaitlistEntry>} Created waitlist entry
   *
   * @throws {Error} If validation fails or creation fails
   *
   * @example
   * ```typescript
   * const waitlistEntry = await AppointmentService.addToWaitlist({
   *   studentId: 'student-456',
   *   nurseId: 'nurse-123',
   *   type: AppointmentType.CHECKUP,
   *   priority: 'high',
   *   preferredDate: new Date('2025-10-28')
   * });
   * ```
   */
  static async addToWaitlist(data: WaitlistEntry) {
    return AppointmentWaitlistService.addToWaitlist(data);
  }

  /**
   * Retrieves waitlist entries with optional filtering
   *
   * @param {Object} [filters] - Optional filters
   * @param {string} [filters.nurseId] - Filter by nurse
   * @param {string} [filters.status] - Filter by waitlist status
   * @param {string} [filters.priority] - Filter by priority level
   *
   * @returns {Promise<WaitlistEntry[]>} Array of waitlist entries ordered by priority
   *
   * @throws {Error} If database query fails
   *
   * @example
   * ```typescript
   * const urgentWaitlist = await AppointmentService.getWaitlist({
   *   nurseId: 'nurse-123',
   *   priority: 'urgent'
   * });
   * ```
   */
  static async getWaitlist(filters?: { nurseId?: string; status?: string; priority?: string }) {
    return AppointmentWaitlistService.getWaitlist(filters);
  }

  /**
   * Removes a student from the waitlist
   *
   * @param {string} id - Waitlist entry UUID
   * @param {string} [reason] - Optional reason for removal
   *
   * @returns {Promise<WaitlistEntry>} Removed waitlist entry
   *
   * @throws {Error} If entry not found or removal fails
   *
   * @example
   * ```typescript
   * await AppointmentService.removeFromWaitlist(
   *   'waitlist-789',
   *   'Appointment scheduled'
   * );
   * ```
   */
  static async removeFromWaitlist(id: string, reason?: string) {
    return AppointmentWaitlistService.removeFromWaitlist(id, reason);
  }

  /**
   * Automatically fills a cancelled appointment slot from the waitlist
   *
   * Searches waitlist for matching entries (same nurse, compatible time) and
   * creates appointments for highest-priority waitlist entries. Sends
   * notifications to affected students.
   *
   * @param {Object} cancelledAppointment - Cancelled appointment details
   * @param {Date} cancelledAppointment.scheduledAt - Original appointment time
   * @param {number} cancelledAppointment.duration - Appointment duration
   * @param {string} cancelledAppointment.nurseId - Nurse ID
   * @param {any} cancelledAppointment.type - Appointment type
   *
   * @returns {Promise<Appointment | null>} New appointment if slot filled, null otherwise
   *
   * @throws {Error} If appointment creation fails
   *
   * @example
   * ```typescript
   * // Automatically called after cancellation
   * const filled = await AppointmentService.fillSlotFromWaitlist({
   *   scheduledAt: new Date('2025-10-26T10:00:00Z'),
   *   duration: 30,
   *   nurseId: 'nurse-123',
   *   type: AppointmentType.CHECKUP
   * });
   * if (filled) {
   *   console.log('Slot filled from waitlist');
   * }
   * ```
   */
  static async fillSlotFromWaitlist(cancelledAppointment: {
    scheduledAt: Date;
    duration: number;
    nurseId: string;
    type: any;
  }) {
    return AppointmentWaitlistService.fillSlotFromWaitlist(cancelledAppointment);
  }

  // =====================
  // VALIDATION UTILITIES (Delegated to validation module)
  // =====================

  /**
   * Validates appointment date/time is in the future
   *
   * @param {Date} scheduledAt - Proposed appointment date/time
   *
   * @returns {void}
   *
   * @throws {Error} If date is in the past
   *
   * @example
   * ```typescript
   * AppointmentService.validateFutureDateTime(new Date('2025-10-26T10:00:00Z'));
   * ```
   */
  static validateFutureDateTime(scheduledAt: Date): void {
    return AppointmentValidation.validateFutureDateTime(scheduledAt);
  }

  /**
   * Validates appointment duration is within acceptable range
   *
   * @param {number} duration - Duration in minutes
   *
   * @returns {void}
   *
   * @throws {Error} If duration is invalid (< 15 or > 120 minutes)
   *
   * @example
   * ```typescript
   * AppointmentService.validateDuration(30); // Valid
   * AppointmentService.validateDuration(150); // Throws error
   * ```
   */
  static validateDuration(duration: number): void {
    return AppointmentValidation.validateDuration(duration);
  }

  /**
   * Validates an appointment status transition is allowed
   *
   * @param {AppointmentStatus} currentStatus - Current appointment status
   * @param {AppointmentStatus} newStatus - Proposed new status
   *
   * @returns {void}
   *
   * @throws {Error} If transition is not allowed by state machine
   *
   * @example
   * ```typescript
   * AppointmentService.validateStatusTransition(
   *   AppointmentStatus.SCHEDULED,
   *   AppointmentStatus.IN_PROGRESS
   * ); // Valid
   *
   * AppointmentService.validateStatusTransition(
   *   AppointmentStatus.COMPLETED,
   *   AppointmentStatus.SCHEDULED
   * ); // Throws error - cannot revert
   * ```
   */
  static validateStatusTransition(currentStatus: any, newStatus: any): void {
    return AppointmentStatusTransitions.validateStatusTransition(currentStatus as any, newStatus as any);
  }

  /**
   * Checks if a status transition is allowed without throwing
   *
   * @param {AppointmentStatus} currentStatus - Current appointment status
   * @param {AppointmentStatus} newStatus - Proposed new status
   *
   * @returns {boolean} True if transition is allowed, false otherwise
   *
   * @example
   * ```typescript
   * if (AppointmentService.canTransitionTo(currentStatus, newStatus)) {
   *   // Proceed with update
   * }
   * ```
   */
  static canTransitionTo(currentStatus: any, newStatus: any): boolean {
    return AppointmentStatusTransitions.canTransitionTo(currentStatus as any, newStatus as any);
  }

  /**
   * Retrieves all valid status transitions from a given status
   *
   * @param {AppointmentStatus} currentStatus - Current appointment status
   *
   * @returns {AppointmentStatus[]} Array of allowed target statuses
   *
   * @example
   * ```typescript
   * const allowed = AppointmentService.getAllowedTransitions(
   *   AppointmentStatus.SCHEDULED
   * );
   * // Returns: [IN_PROGRESS, CANCELLED, NO_SHOW]
   * ```
   */
  static getAllowedTransitions(currentStatus: any) {
    return AppointmentStatusTransitions.getAllowedTransitions(currentStatus as any);
  }
}

// Export types for convenience
export {
  CreateAppointmentData,
  UpdateAppointmentData,
  AppointmentFilters,
  AvailabilitySlot,
  ReminderData,
  NurseAvailabilityData,
  WaitlistEntry,
  RecurrencePattern
};
