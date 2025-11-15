/**
 * Appointments API - Reminder Management
 *
 * @deprecated This module is deprecated. Use server actions instead:
 * - Server: `@/lib/actions/appointments.actions`
 * - Client: Use React Query with server actions
 *
 * Will be removed in v2.0.0 (Q2 2025)
 *
 * Unified service for managing appointment reminders. Orchestrates
 * scheduling, delivery, and query operations through specialized sub-services.
 *
 * @module services/modules/appointmentsApi/reminders
 */

import { AppointmentReminder, ReminderData, ReminderProcessingResult } from './types';
import {
  ReminderQuery,
  ReminderStatistics,
  PaginatedRemindersResponse,
  BulkReminderResult,
  ReminderScheduleConfig
} from './reminders-types';
import {
  ReminderSchedulingService,
  createReminderSchedulingService
} from './reminders-scheduling';
import {
  ReminderDeliveryService,
  createReminderDeliveryService
} from './reminders-delivery';
import {
  ReminderQueryService,
  createReminderQueryService
} from './reminders-queries';
import {
  ReminderNotificationService,
  createReminderNotificationService,
  NotificationServiceConfig
} from './reminders-notifications';

// Re-export types for convenience
export type {
  ReminderQuery,
  ReminderStatistics,
  PaginatedRemindersResponse,
  BulkReminderResult,
  ReminderScheduleConfig,
  NotificationServiceConfig
} from './reminders-types';

/**
 * Reminder Service Configuration
 */
export interface ReminderServiceConfig {
  /** Notification service configuration */
  notificationConfig?: NotificationServiceConfig;
}

/**
 * Unified Reminder Service
 *
 * Orchestrates all reminder-related operations by composing specialized services.
 * Provides a single interface for scheduling, delivery, and querying reminders.
 */
export class ReminderService {
  private schedulingService: ReminderSchedulingService;
  private deliveryService: ReminderDeliveryService;
  private queryService: ReminderQueryService;
  private notificationService: ReminderNotificationService;

  constructor(config: ReminderServiceConfig = {}) {
    // Initialize sub-services
    this.notificationService = createReminderNotificationService(config.notificationConfig);
    this.schedulingService = createReminderSchedulingService();
    this.deliveryService = createReminderDeliveryService(this.notificationService);
    this.queryService = createReminderQueryService();
  }

  // ==========================================
  // SCHEDULING OPERATIONS
  // ==========================================

  /**
   * Schedule a reminder for an appointment
   *
   * @param data - Reminder data
   * @returns Promise resolving to created reminder
   */
  async scheduleReminder(data: ReminderData): Promise<AppointmentReminder> {
    return this.schedulingService.scheduleReminder(data);
  }

  /**
   * Schedule multiple reminders for an appointment
   *
   * @param appointmentId - Appointment ID
   * @param reminderTypes - Array of reminder configurations
   * @returns Promise resolving to bulk operation result
   */
  async scheduleMultipleReminders(
    appointmentId: string,
    reminderTypes: ReminderScheduleConfig[]
  ): Promise<BulkReminderResult> {
    return this.schedulingService.scheduleMultipleReminders(appointmentId, reminderTypes);
  }

  /**
   * Cancel a scheduled reminder
   *
   * @param reminderId - Reminder ID
   * @param reason - Optional cancellation reason
   * @returns Promise resolving to cancelled reminder
   */
  async cancelReminder(reminderId: string, reason?: string): Promise<AppointmentReminder> {
    return this.schedulingService.cancelReminder(reminderId, reason);
  }

  /**
   * Reschedule a reminder to a new time
   *
   * @param reminderId - Reminder ID
   * @param newScheduleTime - New schedule time (ISO 8601 format)
   * @returns Promise resolving to rescheduled reminder
   */
  async rescheduleReminder(
    reminderId: string,
    newScheduleTime: string
  ): Promise<AppointmentReminder> {
    return this.schedulingService.rescheduleReminder(reminderId, newScheduleTime);
  }

  // ==========================================
  // DELIVERY OPERATIONS
  // ==========================================

  /**
   * Process pending reminders that are due
   *
   * @param batchSize - Number of reminders to process (default: 50)
   * @returns Promise resolving to processing result
   */
  async processPendingReminders(batchSize?: number): Promise<ReminderProcessingResult> {
    return this.deliveryService.processPendingReminders(batchSize);
  }

  /**
   * Send a specific reminder
   *
   * @param reminder - Reminder to send
   * @returns Promise resolving when reminder is sent
   */
  async sendReminder(reminder: AppointmentReminder): Promise<void> {
    return this.deliveryService.sendReminder(reminder);
  }

  /**
   * Mark a reminder as delivered
   *
   * @param reminderId - Reminder ID
   * @param deliveryInfo - Optional delivery information
   * @returns Promise resolving when status is updated
   */
  async markAsDelivered(
    reminderId: string,
    deliveryInfo?: Record<string, unknown>
  ): Promise<void> {
    return this.deliveryService.markAsDelivered(reminderId, deliveryInfo);
  }

  /**
   * Retry failed reminders
   *
   * @param maxRetries - Maximum retry attempts (default: 3)
   * @returns Promise resolving to retry results
   */
  async retryFailedReminders(maxRetries?: number): Promise<ReminderProcessingResult> {
    return this.deliveryService.retryFailedReminders(maxRetries);
  }

  // ==========================================
  // QUERY OPERATIONS
  // ==========================================

  /**
   * Get reminders with filtering and pagination
   *
   * @param query - Query parameters
   * @returns Promise resolving to paginated reminders
   */
  async getReminders(query?: ReminderQuery): Promise<PaginatedRemindersResponse> {
    return this.queryService.getReminders(query);
  }

  /**
   * Get reminder by ID
   *
   * @param reminderId - Reminder ID
   * @returns Promise resolving to the reminder
   */
  async getReminderById(reminderId: string): Promise<AppointmentReminder> {
    return this.queryService.getReminderById(reminderId);
  }

  /**
   * Get reminders for a specific appointment
   *
   * @param appointmentId - Appointment ID
   * @returns Promise resolving to array of reminders
   */
  async getRemindersForAppointment(appointmentId: string): Promise<AppointmentReminder[]> {
    return this.queryService.getRemindersForAppointment(appointmentId);
  }

  /**
   * Get reminder statistics
   *
   * @param dateFrom - Optional start date
   * @param dateTo - Optional end date
   * @returns Promise resolving to reminder statistics
   */
  async getReminderStatistics(dateFrom?: string, dateTo?: string): Promise<ReminderStatistics> {
    return this.queryService.getReminderStatistics(dateFrom, dateTo);
  }

  /**
   * Delete old reminders
   *
   * @param olderThanDays - Delete reminders older than this many days (default: 90)
   * @returns Promise resolving to count of deleted reminders
   */
  async deleteOldReminders(olderThanDays?: number): Promise<number> {
    return this.queryService.deleteOldReminders(olderThanDays);
  }
}

/**
 * Create Reminder Service instance
 *
 * Factory function for creating a configured reminder service.
 *
 * @param config - Optional service configuration
 * @returns Configured reminder service instance
 */
export function createReminderService(config?: ReminderServiceConfig): ReminderService {
  return new ReminderService(config);
}

/**
 * Default reminder service instance
 *
 * Singleton instance for convenience. Use createReminderService() for
 * custom configurations or dependency injection.
 */
export const reminderService = createReminderService();
