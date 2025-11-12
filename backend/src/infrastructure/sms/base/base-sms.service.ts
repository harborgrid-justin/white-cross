/**
 * @fileoverview Base SMS Service
 * @module infrastructure/sms/base
 * @description Base class for SMS services with common functionality
 */

import { BadRequestException, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bullmq';
import { SmsPriority, SmsQueueJobDto } from '../dto';
import { SMS_QUEUE_NAME, SmsJobType } from '../processors/sms-queue.processor';

/**
 * Base SMS service with common functionality
 */
export abstract class BaseSmsService {
  protected readonly logger: Logger;
  protected readonly isProduction: boolean;
  protected maxLength: number = 160; // Standard SMS length

  constructor(
    protected readonly configService: ConfigService,
    @InjectQueue(SMS_QUEUE_NAME) protected readonly smsQueue: Queue,
  ) {
    this.isProduction = this.configService.get<string>('NODE_ENV') === 'production';
  }

  /**
   * Validate phone number format
   */
  protected validatePhoneNumberFormat(phoneNumber: string): void {
    if (!phoneNumber || typeof phoneNumber !== 'string') {
      throw new BadRequestException('Phone number is required');
    }

    // Basic E.164 format validation
    const e164Regex = /^\+[1-9]\d{1,14}$/;
    if (!e164Regex.test(phoneNumber)) {
      throw new BadRequestException('Phone number must be in E.164 format (e.g., +15551234567)');
    }
  }

  /**
   * Truncate message to SMS length limit
   */
  protected truncateMessage(message: string): string {
    if (message.length <= this.maxLength) {
      return message;
    }
    return message.substring(0, this.maxLength - 3) + '...';
  }

  /**
   * Map SMS priority to Bull queue priority number
   */
  protected mapPriorityToNumber(priority: SmsPriority): number {
    switch (priority) {
      case SmsPriority.URGENT:
        return 1;
      case SmsPriority.HIGH:
        return 2;
      case SmsPriority.NORMAL:
        return 3;
      case SmsPriority.LOW:
        return 4;
      default:
        return 3;
    }
  }

  /**
   * Queue SMS for reliable delivery via BullMQ
   */
  protected async queueSms(
    to: string,
    message: string,
    priority: SmsPriority,
    metadata?: Record<string, unknown>,
    maxRetries = 3,
    delay?: number,
  ): Promise<void> {
    const jobData: SmsQueueJobDto = {
      to,
      message,
      priority,
      attemptNumber: 1,
      maxRetries,
      metadata,
    };

    // Map priority to Bull priority (lower number = higher priority)
    const bullPriority = this.mapPriorityToNumber(priority);

    const jobOptions = {
      priority: bullPriority,
      attempts: maxRetries,
      backoff: {
        type: 'exponential' as const,
        delay: 2000,
      },
      removeOnComplete: 100,
      removeOnFail: 1000,
    };

    if (delay) {
      jobOptions.delay = delay;
    }

    await this.smsQueue.add(SmsJobType.SEND_SMS, jobData, jobOptions);

    this.logger.debug(`SMS job queued for ${to} with priority ${priority}`);
  }

  /**
   * Log SMS to console (development mode)
   */
  protected async logSmsToConsole(to: string, message: string): Promise<void> {
    this.logger.log('========== SMS ==========');
    this.logger.log(`To: ${to}`);
    this.logger.log(`Message: ${message}`);
    this.logger.log(`Length: ${message.length} chars`);
    this.logger.log('=========================');

    // Simulate async operation
    await this.simulateDelay(100);
  }

  /**
   * Simulate network delay for testing
   */
  protected simulateDelay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Create rate limit exception
   */
  protected createRateLimitException(
    message: string,
    resetInSeconds: number,
  ): HttpException {
    return new HttpException(
      {
        statusCode: HttpStatus.TOO_MANY_REQUESTS,
        message,
        details: { resetInSeconds },
      },
      HttpStatus.TOO_MANY_REQUESTS,
    );
  }
}
