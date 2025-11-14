/**
 * @fileoverview Medication Reminder Job Processor
 * @module infrastructure/jobs/processors
 * @description Processes medication reminder jobs using BullMQ with NestJS patterns
 */

import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bullmq';
import { JobType } from '../enums/job-type.enum';
import { MedicationReminderData } from '../interfaces/job-data.interface';
import { BaseJobProcessor } from '../base/base.processor';
import { ReminderGeneratorService } from '@/infrastructure/jobs/services/reminder-generator.service';
import { ReminderCacheService } from '@/infrastructure/jobs/services/reminder-cache.service';
import { ReminderNotificationService } from '@/infrastructure/jobs/services/reminder-notification.service';

/**
 * Medication Reminder Job Processor
 * Processes medication reminder jobs using BullMQ with NestJS patterns
 */
@Processor(JobType.MEDICATION_REMINDER)
export class MedicationReminderProcessor extends BaseJobProcessor {
  constructor(
    private readonly reminderGenerator: ReminderGeneratorService,
    private readonly reminderCache: ReminderCacheService,
    private readonly reminderNotification: ReminderNotificationService,
  ) {
    super(MedicationReminderProcessor.name);
  }

  @Process()
  async processMedicationReminder(job: Job<MedicationReminderData>): Promise<any> {
    const { organizationId, medicationId, studentId } = job.data;

    this.logger.log('Processing medication reminder job', {
      jobId: job.id,
      organizationId,
      medicationId,
      studentId,
    });

    try {
      this.logger.log('Starting medication reminder generation job');
      const startTime = Date.now();

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Generate reminders for today
      const reminders = await this.reminderGenerator.generateRemindersOptimized(
        today,
        organizationId,
        studentId,
        medicationId,
      );

      // Cache the results for fast retrieval
      this.reminderCache.cacheReminders(reminders, today, organizationId, studentId);

      // Send notifications for due reminders
      const notificationResults = await this.reminderNotification.sendReminderNotifications(
        reminders,
        job.id?.toString(),
      );

      const duration = Date.now() - startTime;
      this.logger.log(
        `Medication reminder job completed: ${reminders.length} reminders generated, ${notificationResults.sent} notifications sent in ${duration}ms`,
      );

      return {
        processed: reminders.length,
        reminders,
        notificationsSent: notificationResults.sent,
        notificationsFailed: notificationResults.failed,
        duration,
      };
    } catch (error) {
      this.logger.error('Error processing medication reminder job', error);
      throw error;
    }
  }

  /**
   * Generate reminders for specific student (used for on-demand requests)
   */
  async generateForStudent(studentId: string, date: Date) {
    return this.reminderGenerator.generateForStudent(studentId, date);
  }

  /**
   * Helper function to get reminders (checks cache first, falls back to generation)
   */
  async getMedicationReminders(
    date: Date = new Date(),
    organizationId?: string,
    studentId?: string,
  ) {
    // Try to get from cache first
    const cached = this.reminderCache.getCachedReminders(date, organizationId, studentId);
    if (cached) {
      return cached;
    }

    // Not cached - generate on demand
    this.logger.debug(`Cache miss, generating reminders`);
    const reminders = await this.reminderGenerator.generateRemindersOptimized(
      date,
      organizationId,
      studentId,
    );

    // Cache for future requests
    this.reminderCache.cacheReminders(reminders, date, organizationId, studentId);

    return reminders;
  }

  /**
   * Invalidate cached reminders for a student
   */
  async invalidateStudentReminders(studentId: string): Promise<void> {
    await this.reminderCache.invalidateStudentReminders(studentId);
  }

  /**
   * Invalidate cached reminders for an organization
   */
  async invalidateOrganizationReminders(organizationId: string): Promise<void> {
    await this.reminderCache.invalidateOrganizationReminders(organizationId);
  }

  /**
   * Retry failed reminder notifications
   */
  async retryFailedReminders(date: Date = new Date()): Promise<number> {
    this.logger.log('Retrying failed reminder notifications');

    try {
      // Find failed deliveries from today
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      // This would need to be implemented - simplified for now
      // const failedDeliveries = await MessageDelivery.findAll({...});

      // For now, regenerate and resend
      const reminders = await this.getMedicationReminders(date);
      const results = await this.reminderNotification.sendReminderNotifications(reminders);

      this.logger.log(`Retry complete: ${results.sent} notifications resent`);
      return results.sent;
    } catch (error) {
      this.logger.error('Failed to retry reminder notifications', error);
      throw error;
    }
  }
}
