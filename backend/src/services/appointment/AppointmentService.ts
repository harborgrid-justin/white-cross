/**
 * LOC: 49AC6FBA67
 * WC-SVC-APT-016 | appointmentService.ts - Appointment Management Service Facade
 *
 * UPSTREAM (imports from):
 *   - crudOperations.ts (services/appointment/crudOperations.ts)
 *   - AppointmentAvailabilityService.ts (services/appointment/AppointmentAvailabilityService.ts)
 *   - AppointmentReminderService.ts (services/appointment/AppointmentReminderService.ts)
 *   - AppointmentWaitlistService.ts (services/appointment/AppointmentWaitlistService.ts)
 *   - AppointmentRecurringService.ts (services/appointment/AppointmentRecurringService.ts)
 *   - ... and 5 more
 *
 * DOWNSTREAM (imported by):
 *   - appointments.ts (routes/appointments.ts)
 */

/**
 * WC-SVC-APT-016 | appointmentService.ts - Appointment Management Service Facade
 * Purpose: Unified appointment management interface with scheduling, availability, reminders, waitlist, and recurring patterns
 * Upstream: ./appointment/* modules, ../types/appointment, ../shared/time/businessHours | Dependencies: Modular appointment services
 * Downstream: routes/appointments.ts, dashboardService, reportService | Called by: Appointment routes, nurse dashboard
 * Related: nurseService, studentService, healthRecordService, communicationService, auditService
 * Exports: AppointmentService facade, appointment types | Key Services: Facade pattern for modular appointment system
 * Last Updated: 2025-10-18 | File Type: .ts | HIPAA: Contains student appointment data and nurse schedules
 * Critical Path: Appointment request → Availability check → Validation → Scheduling → Reminder setup
 * LLM Context: Main orchestration layer for appointment management - delegates to specialized modules in ./appointment/
 */

/**
 * AppointmentService - Main orchestration layer for appointment management
 *
 * This service has been refactored into a modular architecture with the following components:
 *
 * CORE MODULES (located in ./appointment/):
 * - validation.ts: Business rule validation logic
 * - statusTransitions.ts: Finite state machine for appointment lifecycle
 * - crudOperations.ts: Basic CRUD operations for appointments
 * - AppointmentAvailabilityService.ts: Availability and conflict checking
 * - AppointmentReminderService.ts: Reminder scheduling and sending
 * - AppointmentWaitlistService.ts: Waitlist management and slot filling
 * - AppointmentRecurringService.ts: Recurring appointment patterns
 * - AppointmentStatisticsService.ts: Reporting and analytics
 * - AppointmentCalendarService.ts: Calendar export functionality
 * - NurseAvailabilityService.ts: Nurse schedule management
 *
 * This file now serves as a facade pattern implementation, providing a unified interface
 * while delegating to specialized modules for actual implementation.
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
 * Main AppointmentService class - Facade pattern implementation
 * Provides backward compatibility while delegating to modular components
 */
export class AppointmentService {
  // =====================
  // CONFIGURATION CONSTANTS (Delegated to validation module)
  // =====================

  static get MIN_DURATION_MINUTES() { return 15; }
  static get MAX_DURATION_MINUTES() { return 120; }
  static get DEFAULT_DURATION_MINUTES() { return AppointmentValidation.getDefaultDuration(); }
  static get BUFFER_TIME_MINUTES() { return AppointmentValidation.getBufferTimeMinutes(); }
  static get MIN_CANCELLATION_HOURS() { return 2; }
  static get MAX_APPOINTMENTS_PER_DAY() { return 16; }
  static get BUSINESS_HOURS() { return AppointmentValidation.getBusinessHours(); }

  // =====================
  // CRUD OPERATIONS (Delegated to crudOperations module)
  // =====================

  /**
   * Get appointments with pagination and filters
   */
  static async getAppointments(
    page: number = 1,
    limit: number = 20,
    filters: AppointmentFilters = {}
  ) {
    return AppointmentCrudOperations.getAppointments(page, limit, filters);
  }

  /**
   * Get a single appointment by ID
   */
  static async getAppointmentById(id: string) {
    return AppointmentCrudOperations.getAppointmentById(id);
  }

  /**
   * Create new appointment
   */
  static async createAppointment(data: CreateAppointmentData) {
    return AppointmentCrudOperations.createAppointment(data);
  }

  /**
   * Update appointment
   */
  static async updateAppointment(id: string, data: UpdateAppointmentData) {
    return AppointmentCrudOperations.updateAppointment(id, data);
  }

  /**
   * Cancel appointment
   */
  static async cancelAppointment(id: string, reason?: string) {
    return AppointmentCrudOperations.cancelAppointment(id, reason);
  }

  /**
   * Mark appointment as no-show
   */
  static async markNoShow(id: string) {
    return AppointmentCrudOperations.markNoShow(id);
  }

  /**
   * Start appointment (transition to IN_PROGRESS status)
   */
  static async startAppointment(id: string) {
    return AppointmentCrudOperations.startAppointment(id);
  }

  /**
   * Complete appointment (transition to COMPLETED status)
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
   * Get upcoming appointments for a nurse
   */
  static async getUpcomingAppointments(nurseId: string, limit: number = 10) {
    return AppointmentCrudOperations.getUpcomingAppointments(nurseId, limit);
  }

  // =====================
  // AVAILABILITY OPERATIONS (Delegated to AppointmentAvailabilityService)
  // =====================

  /**
   * Check nurse availability for a given time slot
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
   * Get available time slots for a nurse on a given date
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
   * Schedule automatic reminders for an appointment
   */
  static async scheduleReminders(appointmentId: string) {
    return AppointmentReminderService.scheduleReminders(appointmentId);
  }

  /**
   * Send appointment reminders through multiple channels
   */
  static async sendReminder(reminderId: string) {
    return AppointmentReminderService.sendReminder(reminderId);
  }

  /**
   * Process pending reminders
   */
  static async processPendingReminders() {
    return AppointmentReminderService.processPendingReminders();
  }

  // =====================
  // RECURRING APPOINTMENTS (Delegated to AppointmentRecurringService)
  // =====================

  /**
   * Create recurring appointments
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
   * Get appointment statistics
   */
  static async getAppointmentStatistics(nurseId?: string, dateFrom?: Date, dateTo?: Date) {
    return AppointmentStatisticsService.getAppointmentStatistics(nurseId, dateFrom, dateTo);
  }

  // =====================
  // CALENDAR OPERATIONS (Delegated to AppointmentCalendarService)
  // =====================

  /**
   * Generate calendar export (iCal format) for appointments
   */
  static async generateCalendarExport(nurseId: string, dateFrom?: Date, dateTo?: Date): Promise<string> {
    return AppointmentCalendarService.generateCalendarExport(nurseId, dateFrom, dateTo);
  }

  // =====================
  // NURSE AVAILABILITY (Delegated to NurseAvailabilityService)
  // =====================

  /**
   * Set nurse availability schedule
   */
  static async setNurseAvailability(data: NurseAvailabilityData) {
    return NurseAvailabilityService.setNurseAvailability(data);
  }

  /**
   * Get nurse availability schedule
   */
  static async getNurseAvailability(nurseId: string, date?: Date) {
    return NurseAvailabilityService.getNurseAvailability(nurseId, date);
  }

  /**
   * Update nurse availability
   */
  static async updateNurseAvailability(id: string, data: Partial<NurseAvailabilityData>) {
    return NurseAvailabilityService.updateNurseAvailability(id, data);
  }

  /**
   * Delete nurse availability
   */
  static async deleteNurseAvailability(id: string) {
    return NurseAvailabilityService.deleteNurseAvailability(id);
  }

  // =====================
  // WAITLIST OPERATIONS (Delegated to AppointmentWaitlistService)
  // =====================

  /**
   * Add to waitlist
   */
  static async addToWaitlist(data: WaitlistEntry) {
    return AppointmentWaitlistService.addToWaitlist(data);
  }

  /**
   * Get waitlist entries
   */
  static async getWaitlist(filters?: { nurseId?: string; status?: string; priority?: string }) {
    return AppointmentWaitlistService.getWaitlist(filters);
  }

  /**
   * Remove from waitlist
   */
  static async removeFromWaitlist(id: string, reason?: string) {
    return AppointmentWaitlistService.removeFromWaitlist(id, reason);
  }

  /**
   * Automatically fill slots from waitlist when appointment is cancelled
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
   * Validate appointment date/time is in the future
   */
  static validateFutureDateTime(scheduledAt: Date): void {
    return AppointmentValidation.validateFutureDateTime(scheduledAt);
  }

  /**
   * Validate appointment duration
   */
  static validateDuration(duration: number): void {
    return AppointmentValidation.validateDuration(duration);
  }

  /**
   * Validate status transition is allowed
   */
  static validateStatusTransition(currentStatus: any, newStatus: any): void {
    return AppointmentStatusTransitions.validateStatusTransition(currentStatus as any, newStatus as any);
  }

  /**
   * Check if status transition is allowed
   */
  static canTransitionTo(currentStatus: any, newStatus: any): boolean {
    return AppointmentStatusTransitions.canTransitionTo(currentStatus as any, newStatus as any);
  }

  /**
   * Get all allowed transitions for a given status
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
