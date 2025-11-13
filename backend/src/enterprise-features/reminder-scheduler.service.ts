// Reminder Scheduler Service
// Handles appointment reminder automation and scheduling

import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { BaseService } from '@/common/base';
import {
  ReminderSchedule,
  ReminderPreferences,
  ReminderTiming,
  CommunicationChannel,
} from './enterprise-features-interfaces';

@Injectable()
export class ReminderSchedulerService extends BaseService {
  private reminderSchedules: ReminderSchedule[] = []; // In production, this would be a database
  private reminderPreferences: Map<string, ReminderPreferences> = new Map(); // studentId -> preferences

  constructor(private eventEmitter: EventEmitter2) {}

  /**
   * Schedule reminders for an appointment
   */
  scheduleReminders(appointmentId: string): Promise<ReminderSchedule> {
    try {
      const schedule: ReminderSchedule = {
        appointmentId,
        reminders: [
          { timing: ReminderTiming.HOURS_24, channel: CommunicationChannel.EMAIL, sent: false },
          { timing: ReminderTiming.HOURS_1, channel: CommunicationChannel.SMS, sent: false },
          { timing: ReminderTiming.MINUTES_15, channel: CommunicationChannel.PUSH, sent: false },
        ],
      };

      this.reminderSchedules.push(schedule);

      this.logInfo('Reminders scheduled for appointment', {
        appointmentId,
        reminderCount: schedule.reminders.length,
      });

      // Emit event for audit logging
      this.eventEmitter.emit('reminders.scheduled', {
        appointmentId,
        schedule,
        timestamp: new Date(),
      });

      return Promise.resolve(schedule);
    } catch (error) {
      this.logError('Error scheduling reminders', {
        error: error instanceof Error ? error.message : String(error),
        appointmentId,
      });
      throw error;
    }
  }

  /**
   * Send due reminders and return count of sent reminders
   */
  sendDueReminders(): Promise<number> {
    try {
      let sentCount = 0;
      const now = new Date();

      // In production, this would query for appointments with due reminders
      // For now, simulate checking and sending reminders
      for (const schedule of this.reminderSchedules) {
        for (const reminder of schedule.reminders) {
          if (!reminder.sent) {
            // Simulate sending reminder
            reminder.sent = true;
            reminder.sentAt = now;
            sentCount++;

            this.logInfo('Reminder sent', {
              appointmentId: schedule.appointmentId,
              timing: reminder.timing,
              channel: reminder.channel,
            });
          }
        }
      }

      this.logInfo('Due reminders sent', { sentCount });

      // Emit event for audit logging
      this.eventEmitter.emit('reminders.sent', {
        sentCount,
        timestamp: new Date(),
      });

      return Promise.resolve(sentCount);
    } catch (error) {
      this.logError('Error sending due reminders', {
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  /**
   * Customize reminder preferences for a student
   */
  customizeReminderPreferences(
    studentId: string,
    preferences: ReminderPreferences,
  ): Promise<boolean> {
    try {
      // Validate preferences
      this.validateReminderPreferences(preferences);

      this.reminderPreferences.set(studentId, preferences);

      this.logInfo('Reminder preferences updated', {
        studentId,
        preferences: {
          emailEnabled: preferences.emailEnabled,
          smsEnabled: preferences.smsEnabled,
          pushEnabled: preferences.pushEnabled,
          advanceNotice: preferences.advanceNotice,
        },
      });

      // Emit event for audit logging
      this.eventEmitter.emit('reminder-preferences.updated', {
        studentId,
        preferences,
        timestamp: new Date(),
      });

      return Promise.resolve(true);
    } catch (error) {
      this.logError('Error customizing reminder preferences', {
        error: error instanceof Error ? error.message : String(error),
        studentId,
      });
      throw error;
    }
  }

  /**
   * Get reminder preferences for a student
   */
  getReminderPreferences(studentId: string): ReminderPreferences | null {
    try {
      const preferences = this.reminderPreferences.get(studentId);

      if (preferences) {
        this.logInfo('Reminder preferences retrieved', { studentId });
      } else {
        this.logInfo('No reminder preferences found for student', { studentId });
      }

      return preferences || null;
    } catch (error) {
      this.logError('Error getting reminder preferences', {
        error: error instanceof Error ? error.message : String(error),
        studentId,
      });
      throw error;
    }
  }

  /**
   * Get reminder schedule for an appointment
   */
  getReminderSchedule(appointmentId: string): ReminderSchedule | null {
    try {
      const schedule = this.reminderSchedules.find((s) => s.appointmentId === appointmentId);

      if (schedule) {
        this.logInfo('Reminder schedule retrieved', { appointmentId });
      } else {
        this.logInfo('No reminder schedule found for appointment', { appointmentId });
      }

      return schedule || null;
    } catch (error) {
      this.logError('Error getting reminder schedule', {
        error: error instanceof Error ? error.message : String(error),
        appointmentId,
      });
      throw error;
    }
  }

  /**
   * Get reminder statistics
   */
  getReminderStatistics(): {
    totalSchedules: number;
    totalReminders: number;
    sentReminders: number;
    pendingReminders: number;
    preferencesSet: number;
  } {
    try {
      const stats = {
        totalSchedules: this.reminderSchedules.length,
        totalReminders: this.reminderSchedules.reduce(
          (sum, schedule) => sum + schedule.reminders.length,
          0,
        ),
        sentReminders: this.reminderSchedules.reduce(
          (sum, schedule) => sum + schedule.reminders.filter((r) => r.sent).length,
          0,
        ),
        pendingReminders: this.reminderSchedules.reduce(
          (sum, schedule) => sum + schedule.reminders.filter((r) => !r.sent).length,
          0,
        ),
        preferencesSet: this.reminderPreferences.size,
      };

      this.logInfo('Reminder statistics retrieved', stats);
      return stats;
    } catch (error) {
      this.logError('Error getting reminder statistics', {
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  /**
   * Validate reminder preferences
   */
  private validateReminderPreferences(preferences: ReminderPreferences): void {
    if (preferences.quietHours) {
      const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(preferences.quietHours.start)) {
        throw new Error('Invalid quiet hours start time format. Use HH:MM format.');
      }
      if (!timeRegex.test(preferences.quietHours.end)) {
        throw new Error('Invalid quiet hours end time format. Use HH:MM format.');
      }
    }
  }
}
