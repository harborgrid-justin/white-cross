/**
 * @fileoverview Message Notification Processor
 * @description Handles push, email, SMS, and in-app notifications
 * @module infrastructure/queue
 */

import { OnQueueActive, OnQueueCompleted, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import type { Job } from 'bull';
import type { JobProgress, JobResult } from './interfaces';
import { QueueName } from './enums';
import { NotificationJobDto, NotificationType } from './dtos';

/**
 * Message Notification Queue Processor
 * Handles push notifications, emails, SMS, and in-app notifications
 */
@Processor(QueueName.MESSAGE_NOTIFICATION)
export class MessageNotificationProcessor {
  private readonly logger = new Logger(MessageNotificationProcessor.name);

  /**
   * Process notification job
   * Sends push notifications, emails, or SMS based on type
   */
  @Process('send-notification')
  async processNotification(job: Job<NotificationJobDto>): Promise<JobResult> {
    const startTime = Date.now();
    this.logger.log(
      `Processing ${job.data.type} notification for recipient ${job.data.recipientId}`,
    );

    try {
      await job.progress({
        percentage: 20,
        step: 'Preparing notification',
      } as JobProgress);

      // Route to appropriate notification handler
      switch (job.data.type) {
        case NotificationType.PUSH:
          await this.sendPushNotification(job);
          break;
        case NotificationType.EMAIL:
          await this.sendEmailNotification(job);
          break;
        case NotificationType.SMS:
          await this.sendSmsNotification(job);
          break;
        case NotificationType.IN_APP:
          await this.sendInAppNotification(job);
          break;
        default:
          throw new Error(`Unsupported notification type: ${String(job.data.type)}`);
      }

      await job.progress({
        percentage: 100,
        step: 'Notification sent',
      } as JobProgress);

      const processingTime = Date.now() - startTime;
      this.logger.log(
        `Notification sent successfully: ${job.data.type} to ${job.data.recipientId} (${processingTime}ms)`,
      );

      return {
        success: true,
        data: {
          notificationId: job.data.notificationId,
          type: job.data.type,
          sentAt: new Date(),
        },
        metadata: {
          processingTime,
          attempts: job.attemptsMade,
          completedAt: new Date(),
        },
      };
    } catch (error) {
      const processingTime = Date.now() - startTime;
      const err = error as Error;
      this.logger.error(`Failed to send notification: ${err.message}`, err.stack);

      return {
        success: false,
        error: {
          message: err.message,
          stack: err.stack,
        },
        metadata: {
          processingTime,
          attempts: job.attemptsMade,
          completedAt: new Date(),
        },
      };
    }
  }

  private async sendPushNotification(job: Job<NotificationJobDto>): Promise<void> {
    // TODO: Integrate with Firebase Cloud Messaging or APNs
    // For now, log the notification
    await job.progress({
      percentage: 50,
      step: 'Sending push notification',
    } as JobProgress);

    this.logger.log(`[PUSH NOTIFICATION] To: ${job.data.recipientId}`);
    this.logger.log(`[PUSH NOTIFICATION] Title: ${job.data.title}`);
    this.logger.log(`[PUSH NOTIFICATION] Message: ${job.data.message}`);

    // Simulate network delay
    await this.delay(100);
  }

  private async sendEmailNotification(job: Job<NotificationJobDto>): Promise<void> {
    // TODO: Integrate with email service (NodeMailer/SendGrid)
    // For now, log the notification
    await job.progress({
      percentage: 50,
      step: 'Sending email notification',
    } as JobProgress);

    this.logger.log(`[EMAIL NOTIFICATION] To: ${job.data.recipientId}`);
    this.logger.log(`[EMAIL NOTIFICATION] Subject: ${job.data.title}`);
    this.logger.log(`[EMAIL NOTIFICATION] Body: ${job.data.message}`);

    // Simulate email sending
    await this.delay(150);
  }

  private async sendSmsNotification(job: Job<NotificationJobDto>): Promise<void> {
    // TODO: Integrate with SMS service (Twilio)
    // For now, log the notification
    await job.progress({
      percentage: 50,
      step: 'Sending SMS notification',
    } as JobProgress);

    this.logger.log(`[SMS NOTIFICATION] To: ${job.data.recipientId}`);
    this.logger.log(`[SMS NOTIFICATION] Message: ${job.data.message}`);

    // Simulate SMS sending
    await this.delay(120);
  }

  private async sendInAppNotification(job: Job<NotificationJobDto>): Promise<void> {
    // Store notification in database for in-app display
    await job.progress({
      percentage: 50,
      step: 'Storing in-app notification',
    } as JobProgress);

    // TODO: Create Notification model and store in database
    this.logger.log(`[IN-APP NOTIFICATION] To: ${job.data.recipientId}`);
    this.logger.log(`[IN-APP NOTIFICATION] ${job.data.title}: ${job.data.message}`);

    await this.delay(50);
  }

  @OnQueueActive()
  onActive(job: Job) {
    this.logger.debug(`Processing notification job ${job.id}`);
  }

  @OnQueueCompleted()
  onCompleted(job: Job) {
    this.logger.log(`Notification job ${job.id} completed`);
  }

  @OnQueueFailed()
  onFailed(job: Job, error: Error) {
    this.logger.error(`Notification job ${job.id} failed: ${error.message}`);
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}