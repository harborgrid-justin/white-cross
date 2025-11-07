/**
 * @fileoverview SMS Queue Processor
 * @module infrastructure/sms/processors/sms-queue.processor
 * @description BullMQ processor for reliable SMS delivery with retry logic
 */

import { Injectable, Logger } from '@nestjs/common';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bullmq';
import { TwilioProvider } from '../providers/twilio.provider';
import { SmsDeliveryResultDto, SmsDeliveryStatus, SmsQueueJobDto } from '../dto/sms-queue-job.dto';

/**
 * Queue name for SMS processing
 */
export const SMS_QUEUE_NAME = 'sms-delivery';

/**
 * SMS Queue job types
 */
export enum SmsJobType {
  SEND_SMS = 'send-sms',
  SEND_BULK = 'send-bulk',
  CHECK_STATUS = 'check-status',
}

/**
 * SMS Queue Processor
 * Handles background SMS delivery with automatic retry and dead letter queue
 */
@Processor(SMS_QUEUE_NAME)
@Injectable()
export class SmsQueueProcessor {
  private readonly logger = new Logger(SmsQueueProcessor.name);

  constructor(private readonly twilioProvider: TwilioProvider) {}

  /**
   * Process SMS sending job
   *
   * @param job - Bull queue job containing SMS data
   * @returns Delivery result
   *
   * @throws Error if SMS delivery fails after retries
   */
  @Process(SmsJobType.SEND_SMS)
  async handleSendSms(job: Job<SmsQueueJobDto>): Promise<SmsDeliveryResultDto> {
    const { to, message, attemptNumber, maxRetries, metadata } = job.data;

    this.logger.log(
      `Processing SMS job ${job.id} - Attempt ${attemptNumber}/${maxRetries} to ${to}`,
    );

    try {
      // Check if Twilio is configured
      if (!this.twilioProvider.isReady()) {
        throw new Error('Twilio provider is not configured');
      }

      // Send SMS via Twilio
      const result = await this.twilioProvider.sendSms(to, message, metadata);

      // Check if sending was successful
      if (
        result.status === SmsDeliveryStatus.FAILED &&
        attemptNumber < maxRetries
      ) {
        // Check if error is retryable
        const isRetryable = result.errorCode
          ? this.twilioProvider.isRetryableError(result.errorCode)
          : true;

        if (isRetryable) {
          // Calculate retry delay
          const retryDelay = result.errorCode
            ? this.twilioProvider.getRetryDelay(result.errorCode, attemptNumber)
            : this.getExponentialBackoff(attemptNumber);

          this.logger.warn(
            `SMS job ${job.id} failed (attempt ${attemptNumber}/${maxRetries}). Retrying in ${retryDelay}ms`,
          );

          // Throw error to trigger retry
          throw new Error(
            `SMS delivery failed: ${result.error}. Will retry in ${retryDelay}ms`,
          );
        } else {
          // Non-retryable error, fail permanently
          this.logger.error(
            `SMS job ${job.id} failed with non-retryable error: ${result.error} (${result.errorCode})`,
          );
          throw new Error(`Non-retryable error: ${result.error}`);
        }
      }

      // Success or final failure
      if (result.status === SmsDeliveryStatus.FAILED) {
        this.logger.error(
          `SMS job ${job.id} failed permanently after ${attemptNumber} attempts: ${result.error}`,
        );
      } else {
        this.logger.log(
          `SMS job ${job.id} completed successfully - Status: ${result.status}, Cost: $${result.cost}`,
        );
      }

      // Update job progress
      await (job as any).progress(100);

      return result;
    } catch (error) {
      this.logger.error(`SMS job ${job.id} error: ${error.message}`);

      // Update job progress
      const progressPercent = Math.floor((attemptNumber / maxRetries) * 100);
      await (job as any).progress(progressPercent);

      // Re-throw to trigger retry mechanism
      throw error;
    }
  }

  /**
   * Process bulk SMS sending job
   *
   * @param job - Bull queue job for bulk SMS
   * @returns Array of delivery results
   */
  @Process(SmsJobType.SEND_BULK)
  async handleSendBulk(
    job: Job<{
      recipients: string[];
      message: string;
      metadata?: Record<string, unknown>;
    }>,
  ): Promise<SmsDeliveryResultDto[]> {
    const { recipients, message, metadata } = job.data;

    this.logger.log(
      `Processing bulk SMS job ${job.id} - ${recipients.length} recipients`,
    );

    const results: SmsDeliveryResultDto[] = [];

    // Process each recipient
    for (let i = 0; i < recipients.length; i++) {
      const to = recipients[i];

      try {
        const result = await this.twilioProvider.sendSms(to, message, metadata);
        results.push(result);

        // Update progress
        const progress = Math.floor(((i + 1) / recipients.length) * 100);
        await (job as any).progress(progress);
      } catch (error) {
        this.logger.error(`Bulk SMS failed for ${to}: ${error.message}`);

        // Add failed result
        results.push({
          status: SmsDeliveryStatus.FAILED,
          to: to,
          segmentCount: 1,
          cost: 0,
          timestamp: new Date().toISOString(),
          error: error.message,
        });
      }
    }

    const successCount = results.filter(
      (r) => r.status !== SmsDeliveryStatus.FAILED,
    ).length;
    this.logger.log(
      `Bulk SMS job ${job.id} completed - ${successCount}/${recipients.length} successful`,
    );

    return results;
  }

  /**
   * Process message status check job
   *
   * @param job - Bull queue job for status check
   * @returns Updated delivery result
   */
  @Process(SmsJobType.CHECK_STATUS)
  async handleCheckStatus(
    job: Job<{ messageId: string }>,
  ): Promise<SmsDeliveryResultDto> {
    const { messageId } = job.data;

    this.logger.debug(`Checking SMS status for message ${messageId}`);

    try {
      const result = await this.twilioProvider.getMessageStatus(messageId);

      this.logger.debug(`Message ${messageId} status: ${result.status}`);

      return result;
    } catch (error) {
      this.logger.error(
        `Failed to check status for message ${messageId}: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Handle job completion
   *
   * @param job - Completed job
   * @param result - Job result
   */
  async onCompleted(job: Job, result: any): Promise<void> {
    this.logger.log(`SMS job ${job.id} completed successfully`);
  }

  /**
   * Handle job failure
   *
   * @param job - Failed job
   * @param error - Error that caused failure
   */
  async onFailed(job: Job, error: Error): Promise<void> {
    this.logger.error(`SMS job ${job.id} failed permanently: ${error.message}`);

    // In production, you might want to:
    // - Move to dead letter queue
    // - Send alert to monitoring system
    // - Log to error tracking service (Sentry, etc.)
  }

  /**
   * Handle job stalling
   *
   * @param job - Stalled job
   */
  async onStalled(job: Job): Promise<void> {
    this.logger.warn(`SMS job ${job.id} has stalled and will be retried`);
  }

  // ==================== Private Helper Methods ====================

  /**
   * Calculate exponential backoff delay
   *
   * @param attemptNumber - Current attempt number
   * @returns Delay in milliseconds
   * @private
   */
  private getExponentialBackoff(attemptNumber: number): number {
    // Base delay: 2 seconds
    // Exponential multiplier: 2^attempt
    // Maximum delay: 5 minutes
    const baseDelay = 2000;
    const maxDelay = 300000; // 5 minutes

    const delay = baseDelay * Math.pow(2, attemptNumber - 1);
    return Math.min(delay, maxDelay);
  }
}
