/**
 * Appointments API - Reminder Scheduling
 *
 * Handles reminder scheduling, cancellation, and rescheduling operations.
 * Provides methods for creating single or multiple reminders for appointments.
 *
 * @module services/modules/appointmentsApi/reminders-scheduling
 */

import {
  AppointmentReminder,
  ReminderData,
  ReminderStatus,
  MessageType,
  APPOINTMENT_VALIDATION
} from './types';
import {
  scheduleReminderSchema,
  cancelReminderSchema,
  getValidationErrors
} from './validation';
import {
  BulkReminderResult,
  ReminderScheduleConfig
} from './reminders-types';

/**
 * Default Message Templates by Type
 */
const DEFAULT_MESSAGE_TEMPLATES: Record<MessageType, string> = {
  [MessageType.EMAIL]: 'Hello! This is a reminder about your upcoming appointment at the school nurse office. Please make sure to arrive on time.',
  [MessageType.SMS]: 'Reminder: You have an appointment at the school nurse office tomorrow. Reply STOP to unsubscribe.',
  [MessageType.PUSH]: "Appointment reminder: Don't forget your scheduled visit to the nurse office.",
  [MessageType.IN_APP]: 'You have an upcoming appointment scheduled with the school nurse.'
};

/**
 * Reminder Scheduling Service Class
 *
 * Manages the scheduling, cancellation, and rescheduling of appointment reminders.
 */
export class ReminderSchedulingService {
  private readonly endpoint = '/api/reminders';

  /**
   * Generate default reminder message based on type
   *
   * @param type - Message type
   * @returns Default message template
   */
  private generateDefaultMessage(type: MessageType): string {
    return DEFAULT_MESSAGE_TEMPLATES[type] || 'You have an upcoming appointment.';
  }

  /**
   * Schedule a reminder for an appointment
   *
   * Validates the reminder data and creates a new scheduled reminder.
   *
   * @param data - Reminder data
   * @returns Promise resolving to created reminder
   * @throws Error if validation fails or scheduling fails
   */
  async scheduleReminder(data: ReminderData): Promise<AppointmentReminder> {
    // Validate input data
    const validationResult = scheduleReminderSchema.safeParse({
      appointmentId: data.appointmentId,
      type: data.type,
      scheduledFor: data.scheduledFor || new Date().toISOString(),
      message: data.message
    });

    if (!validationResult.success) {
      const errors = getValidationErrors(validationResult.error);
      throw new Error(`Validation failed: ${JSON.stringify(errors)}`);
    }

    try {
      // Calculate default schedule time if not provided
      let scheduledFor = data.scheduledFor;
      if (!scheduledFor) {
        // Default to 24 hours before appointment
        const appointmentTime = new Date(); // Would get from appointment data
        scheduledFor = new Date(
          appointmentTime.getTime() - APPOINTMENT_VALIDATION.REMINDER_ADVANCE * 60 * 60 * 1000
        ).toISOString();
      }

      const reminder: AppointmentReminder = {
        id: `reminder_${Date.now()}`,
        appointmentId: data.appointmentId,
        type: data.type,
        status: ReminderStatus.PENDING,
        scheduledFor,
        message: data.message || this.generateDefaultMessage(data.type),
        recipient: data.recipient || 'default@example.com', // Would get from appointment/student data
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // This would typically make an API call
      return reminder;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to schedule reminder: ${errorMessage}`);
    }
  }

  /**
   * Schedule multiple reminders for an appointment
   *
   * Creates multiple reminders with different types and schedules for a single appointment.
   * Useful for sending multi-channel reminder notifications.
   *
   * @param appointmentId - Appointment ID
   * @param reminderTypes - Array of reminder configurations
   * @returns Promise resolving to bulk operation result with successes and failures
   * @throws Error if appointmentId is invalid or reminderTypes is empty
   */
  async scheduleMultipleReminders(
    appointmentId: string,
    reminderTypes: ReminderScheduleConfig[]
  ): Promise<BulkReminderResult> {
    if (!appointmentId?.trim()) {
      throw new Error('Appointment ID is required');
    }

    if (!reminderTypes.length) {
      throw new Error('At least one reminder type must be specified');
    }

    const successful: AppointmentReminder[] = [];
    const failed: BulkReminderResult['failed'] = [];

    for (const reminderType of reminderTypes) {
      try {
        // Calculate schedule time based on appointment time and hours before
        const appointmentTime = new Date(); // Would get from appointment data
        const scheduledFor = new Date(
          appointmentTime.getTime() - reminderType.hoursBeforeAppointment * 60 * 60 * 1000
        ).toISOString();

        const reminderData: ReminderData = {
          appointmentId,
          type: reminderType.type,
          scheduledFor,
          message: reminderType.message,
          recipient: reminderType.recipient
        };

        const reminder = await this.scheduleReminder(reminderData);
        successful.push(reminder);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        failed.push({
          data: {
            appointmentId,
            type: reminderType.type,
            scheduledFor: new Date().toISOString(),
            message: reminderType.message,
            recipient: reminderType.recipient
          },
          error: errorMessage
        });
      }
    }

    return {
      successful,
      failed,
      summary: {
        total: reminderTypes.length,
        successful: successful.length,
        failed: failed.length
      }
    };
  }

  /**
   * Cancel a scheduled reminder
   *
   * Cancels a pending reminder and optionally records a cancellation reason.
   *
   * @param reminderId - Reminder ID
   * @param reason - Optional cancellation reason
   * @returns Promise resolving to cancelled reminder
   * @throws Error if validation fails or cancellation fails
   */
  async cancelReminder(reminderId: string, reason?: string): Promise<AppointmentReminder> {
    // Validate input
    const validationResult = cancelReminderSchema.safeParse({
      reminderId,
      reason
    });

    if (!validationResult.success) {
      const errors = getValidationErrors(validationResult.error);
      throw new Error(`Validation failed: ${JSON.stringify(errors)}`);
    }

    try {
      // This would typically make an API call
      const cancelledReminder: AppointmentReminder = {
        id: reminderId,
        appointmentId: 'appointment_1', // Would get from existing reminder
        type: MessageType.EMAIL,
        status: ReminderStatus.CANCELLED,
        scheduledFor: new Date().toISOString(),
        message: 'Reminder cancelled',
        recipient: 'user@example.com',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: { cancellationReason: reason }
      };

      return cancelledReminder;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to cancel reminder: ${errorMessage}`);
    }
  }

  /**
   * Reschedule a reminder to a new time
   *
   * Updates the scheduled time for a pending reminder.
   *
   * @param reminderId - Reminder ID
   * @param newScheduleTime - New schedule time (ISO 8601 format)
   * @returns Promise resolving to rescheduled reminder
   * @throws Error if validation fails or rescheduling fails
   */
  async rescheduleReminder(
    reminderId: string,
    newScheduleTime: string
  ): Promise<AppointmentReminder> {
    if (!reminderId?.trim()) {
      throw new Error('Reminder ID is required');
    }

    if (!newScheduleTime?.trim()) {
      throw new Error('New schedule time is required');
    }

    // Validate that new schedule time is in the future
    const scheduleDate = new Date(newScheduleTime);
    if (isNaN(scheduleDate.getTime())) {
      throw new Error('Invalid schedule time format');
    }

    if (scheduleDate <= new Date()) {
      throw new Error('New schedule time must be in the future');
    }

    try {
      // This would typically make an API call to update the reminder
      const rescheduledReminder: AppointmentReminder = {
        id: reminderId,
        appointmentId: 'appointment_1', // Would get from existing reminder
        type: MessageType.EMAIL,
        status: ReminderStatus.PENDING,
        scheduledFor: newScheduleTime,
        message: 'Rescheduled reminder',
        recipient: 'user@example.com',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: {
          rescheduled: true,
          originalScheduleTime: new Date().toISOString()
        }
      };

      return rescheduledReminder;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to reschedule reminder: ${errorMessage}`);
    }
  }
}

/**
 * Create Reminder Scheduling Service instance
 *
 * Factory function for creating a configured scheduling service.
 *
 * @returns Configured reminder scheduling service
 */
export function createReminderSchedulingService(): ReminderSchedulingService {
  return new ReminderSchedulingService();
}
