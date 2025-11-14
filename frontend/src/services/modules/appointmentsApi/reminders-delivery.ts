/**
 * Appointments API - Reminder Delivery
 *
 * Handles reminder delivery, processing, and retry logic.
 * Manages the sending of reminders through various channels (email, SMS, push, in-app).
 *
 * @module services/modules/appointmentsApi/reminders-delivery
 */

import {
  AppointmentReminder,
  ReminderStatus,
  MessageType,
  ReminderProcessingResult
} from './types';
import { ReminderMetadata } from './reminders-types';
import {
  ReminderNotificationService,
  createReminderNotificationService
} from './reminders-notifications';

/**
 * Reminder Delivery Service Class
 *
 * Manages the delivery, processing, and retry logic for appointment reminders.
 * Handles multiple notification channels and tracks delivery status.
 */
export class ReminderDeliveryService {
  private readonly endpoint = '/api/reminders';
  private notificationService: ReminderNotificationService;

  constructor(notificationService?: ReminderNotificationService) {
    this.notificationService = notificationService || createReminderNotificationService();
  }

  /**
   * Process pending reminders that are due
   *
   * Retrieves and processes reminders that are scheduled to be sent.
   * Batches processing for efficiency and tracks results.
   *
   * @param batchSize - Number of reminders to process in one batch (1-100)
   * @returns Promise resolving to processing result with stats
   * @throws Error if batchSize is invalid or processing fails
   */
  async processPendingReminders(batchSize: number = 50): Promise<ReminderProcessingResult> {
    if (batchSize < 1 || batchSize > 100) {
      throw new Error('Batch size must be between 1 and 100');
    }

    try {
      // Get pending reminders that are due
      const pendingReminders = await this.getPendingReminders(batchSize);

      let processed = 0;
      let sent = 0;
      let failed = 0;
      const errors: ReminderProcessingResult['errors'] = [];
      const summary: ReminderProcessingResult['summary'] = {
        emailsSent: 0,
        smsSent: 0,
        pushNotificationsSent: 0,
        inAppNotificationsSent: 0
      };

      for (const reminder of pendingReminders) {
        processed++;

        try {
          await this.sendReminder(reminder);
          sent++;

          // Update summary based on reminder type
          switch (reminder.type) {
            case MessageType.EMAIL:
              summary.emailsSent++;
              break;
            case MessageType.SMS:
              summary.smsSent++;
              break;
            case MessageType.PUSH:
              summary.pushNotificationsSent++;
              break;
            case MessageType.IN_APP:
              summary.inAppNotificationsSent++;
              break;
          }
        } catch (error) {
          failed++;
          const errorMessage = error instanceof Error ? error.message : String(error);
          const metadata = reminder.metadata as ReminderMetadata | undefined;
          errors.push({
            reminderId: reminder.id,
            appointmentId: reminder.appointmentId,
            error: errorMessage,
            retryCount: metadata?.retryCount ?? 0
          });
        }
      }

      return {
        processed,
        sent,
        failed,
        errors,
        summary
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to process pending reminders: ${errorMessage}`);
    }
  }

  /**
   * Send a specific reminder
   *
   * Validates the reminder status and schedule, then sends via the appropriate channel.
   *
   * @param reminder - Reminder to send
   * @returns Promise resolving when reminder is sent
   * @throws Error if reminder cannot be sent
   */
  async sendReminder(reminder: AppointmentReminder): Promise<void> {
    try {
      // Validate reminder can be sent
      if (reminder.status !== ReminderStatus.PENDING) {
        throw new Error(`Reminder ${reminder.id} is not in PENDING status`);
      }

      // Check if it's time to send
      const scheduleTime = new Date(reminder.scheduledFor);
      const now = new Date();

      if (scheduleTime > now) {
        throw new Error(`Reminder ${reminder.id} is not yet due`);
      }

      // Send based on reminder type using notification service
      await this.notificationService.sendReminder(reminder);

      // Update reminder status to SENT
      await this.updateReminderStatus(reminder.id, ReminderStatus.SENT, {
        sentAt: new Date().toISOString()
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      // Update reminder status to FAILED
      await this.updateReminderStatus(reminder.id, ReminderStatus.FAILED, {
        failureReason: errorMessage,
        failedAt: new Date().toISOString()
      });
      throw error;
    }
  }

  /**
   * Mark a reminder as delivered
   *
   * Webhook endpoint handler for external services to confirm delivery.
   *
   * @param reminderId - Reminder ID
   * @param deliveryInfo - Optional delivery information from external service
   * @returns Promise resolving when status is updated
   * @throws Error if reminderId is invalid or update fails
   */
  async markAsDelivered(
    reminderId: string,
    deliveryInfo?: Record<string, unknown>
  ): Promise<void> {
    if (!reminderId?.trim()) {
      throw new Error('Reminder ID is required');
    }

    try {
      await this.updateReminderStatus(reminderId, ReminderStatus.DELIVERED, {
        deliveredAt: new Date().toISOString(),
        deliveryInfo
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to mark reminder as delivered: ${errorMessage}`);
    }
  }

  /**
   * Retry failed reminders
   *
   * Attempts to resend reminders that previously failed, up to a maximum retry count.
   *
   * @param maxRetries - Maximum retry attempts (default: 3)
   * @returns Promise resolving to retry results with stats
   * @throws Error if retry processing fails
   */
  async retryFailedReminders(maxRetries: number = 3): Promise<ReminderProcessingResult> {
    try {
      // Get failed reminders that haven't exceeded retry limit
      const failedReminders = await this.getFailedReminders(maxRetries);

      let processed = 0;
      let sent = 0;
      let failed = 0;
      const errors: ReminderProcessingResult['errors'] = [];
      const summary: ReminderProcessingResult['summary'] = {
        emailsSent: 0,
        smsSent: 0,
        pushNotificationsSent: 0,
        inAppNotificationsSent: 0
      };

      for (const reminder of failedReminders) {
        processed++;

        try {
          // Reset status to pending for retry
          await this.updateReminderStatus(reminder.id, ReminderStatus.PENDING);

          // Attempt to send again
          await this.sendReminder(reminder);
          sent++;

          // Update summary
          switch (reminder.type) {
            case MessageType.EMAIL:
              summary.emailsSent++;
              break;
            case MessageType.SMS:
              summary.smsSent++;
              break;
            case MessageType.PUSH:
              summary.pushNotificationsSent++;
              break;
            case MessageType.IN_APP:
              summary.inAppNotificationsSent++;
              break;
          }
        } catch (error) {
          failed++;
          const errorMessage = error instanceof Error ? error.message : String(error);
          const metadata = reminder.metadata as ReminderMetadata | undefined;
          const retryCount = metadata?.retryCount ?? 0;
          errors.push({
            reminderId: reminder.id,
            appointmentId: reminder.appointmentId,
            error: errorMessage,
            retryCount: retryCount + 1
          });
        }
      }

      return {
        processed,
        sent,
        failed,
        errors,
        summary
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to retry failed reminders: ${errorMessage}`);
    }
  }

  // ==========================================
  // HELPER METHODS
  // ==========================================

  /**
   * Get pending reminders that are due for processing
   *
   * @param limit - Maximum number of reminders to retrieve
   * @returns Promise resolving to array of pending reminders
   */
  private async getPendingReminders(limit: number): Promise<AppointmentReminder[]> {
    const now = new Date().toISOString();

    // This would typically make an API call to get pending reminders
    // For now, return mock data
    const mockPendingReminders: AppointmentReminder[] = [
      {
        id: 'reminder_pending_1',
        appointmentId: 'appointment_1',
        type: MessageType.EMAIL,
        status: ReminderStatus.PENDING,
        scheduledFor: new Date(Date.now() - 60000).toISOString(), // 1 minute ago (due)
        message: 'Your appointment is tomorrow',
        recipient: 'student@example.com',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    return mockPendingReminders.slice(0, limit);
  }

  /**
   * Get failed reminders for retry
   *
   * @param maxRetries - Maximum retry count to filter by
   * @returns Promise resolving to array of failed reminders
   */
  private async getFailedReminders(maxRetries: number): Promise<AppointmentReminder[]> {
    // This would typically make an API call to get failed reminders
    // For now, return mock data
    const mockFailedReminders: AppointmentReminder[] = [
      {
        id: 'reminder_failed_1',
        appointmentId: 'appointment_1',
        type: MessageType.SMS,
        status: ReminderStatus.FAILED,
        scheduledFor: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // 1 hour ago
        message: 'Your appointment is today',
        recipient: '+1234567890',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: { retryCount: 1, failureReason: 'Network timeout' }
      }
    ];

    return mockFailedReminders.filter(r => {
      const metadata = r.metadata as ReminderMetadata | undefined;
      const retryCount = metadata?.retryCount ?? 0;
      return retryCount < maxRetries;
    });
  }

  /**
   * Update reminder status
   *
   * @param reminderId - Reminder ID
   * @param status - New status
   * @param metadata - Optional metadata to update
   * @returns Promise resolving when status is updated
   */
  private async updateReminderStatus(
    reminderId: string,
    status: ReminderStatus,
    metadata?: Partial<ReminderMetadata>
  ): Promise<void> {
    // This would typically make an API call to update reminder status
    console.log(`Updating reminder ${reminderId} status to ${status}`, metadata);
  }
}

/**
 * Create Reminder Delivery Service instance
 *
 * @param notificationService - Optional notification service instance
 * @returns Configured reminder delivery service
 */
export function createReminderDeliveryService(
  notificationService?: ReminderNotificationService
): ReminderDeliveryService {
  return new ReminderDeliveryService(notificationService);
}
