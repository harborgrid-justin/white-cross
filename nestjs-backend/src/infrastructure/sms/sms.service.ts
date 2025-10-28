/**
 * @fileoverview SMS Service - NestJS Production Implementation
 * @module infrastructure/sms
 * @description Production-ready SMS service with Twilio integration, queuing, rate limiting,
 * cost tracking, phone validation, and template support
 *
 * @example
 * ```typescript
 * const smsService = new SmsService(
 *   configService,
 *   twilioProvider,
 *   phoneValidator,
 *   templateService,
 *   rateLimiter,
 *   costTracker,
 *   queueService
 * );
 * await smsService.sendAlertSMS('+15551234567', {
 *   title: 'Critical Alert',
 *   message: 'Student requires immediate attention',
 *   severity: AlertSeverity.CRITICAL
 * });
 * ```
 */

import { Injectable, Logger, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import {
  AlertSmsDto,
  GenericSmsDto,
  SendSmsDto,
  SendTemplatedSmsDto,
  BulkSmsDto,
  BulkSmsResultDto,
  SmsPriority,
  SmsQueueJobDto,
  PhoneNumberValidationResult,
} from './dto';
import { TwilioProvider } from './providers/twilio.provider';
import { PhoneValidatorService } from './services/phone-validator.service';
import { SmsTemplateService } from './services/sms-template.service';
import { RateLimiterService } from './services/rate-limiter.service';
import { CostTrackerService } from './services/cost-tracker.service';
import { SMS_QUEUE_NAME, SmsJobType } from './processors/sms-queue.processor';

/**
 * SMS Service class
 * Orchestrates all SMS operations with comprehensive error handling and monitoring
 */
@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  private readonly isProduction: boolean;
  private maxLength: number = 160; // Standard SMS length

  constructor(
    private readonly configService: ConfigService,
    private readonly twilioProvider: TwilioProvider,
    private readonly phoneValidator: PhoneValidatorService,
    private readonly templateService: SmsTemplateService,
    private readonly rateLimiter: RateLimiterService,
    private readonly costTracker: CostTrackerService,
    @InjectQueue(SMS_QUEUE_NAME) private readonly smsQueue: Queue,
  ) {
    this.isProduction = this.configService.get<string>('NODE_ENV') === 'production';

    this.logger.log(
      `SMS Service initialized - Environment: ${this.isProduction ? 'production' : 'development'}`,
    );

    // Log provider status
    if (this.twilioProvider.isReady()) {
      this.logger.log('Twilio provider is configured and ready');
    } else {
      this.logger.warn('Twilio provider is not configured - SMS will be logged only');
    }
  }

  /**
   * Send alert notification SMS with production implementation
   *
   * @param to - Recipient phone number (E.164 format recommended: +15551234567)
   * @param data - Alert SMS data including title, message, severity
   * @returns Promise that resolves when SMS is queued/sent
   *
   * @throws BadRequestException if phone number is invalid
   * @throws HttpException if rate limit exceeded or other errors
   *
   * @example
   * ```typescript
   * await smsService.sendAlertSMS('+15551234567', {
   *   title: 'Critical Alert',
   *   message: 'Student requires immediate attention',
   *   severity: AlertSeverity.CRITICAL
   * });
   * ```
   */
  async sendAlertSMS(to: string, data: AlertSmsDto): Promise<void> {
    this.logger.log(`Sending alert SMS to ${to} - [${data.severity}] ${data.title}`);

    try {
      // 1. Validate and normalize phone number
      const validation = await this.phoneValidator.validatePhoneNumber(to);
      if (!validation.isValid) {
        throw new BadRequestException(
          `Invalid phone number: ${validation.error}`,
        );
      }

      const normalizedPhone = validation.e164Format!;

      // 2. Check rate limits
      await this.checkRateLimits(normalizedPhone);

      // 3. Format alert message
      const formattedMessage = this.formatAlertSMS(data);
      const truncatedMessage = this.truncateMessage(formattedMessage);

      // 4. Determine priority based on severity
      const priority = this.mapSeverityToPriority(data.severity);

      // 5. Send via appropriate method
      if (this.twilioProvider.isReady() && this.isProduction) {
        // Production: Queue for reliable delivery
        await this.queueSms(normalizedPhone, truncatedMessage, priority, {
          alertTitle: data.title,
          alertSeverity: data.severity,
          type: 'alert',
        });
      } else {
        // Development: Log to console
        await this.logSmsToConsole(normalizedPhone, truncatedMessage);
      }

      // 6. Increment rate limit counters
      await this.rateLimiter.incrementPhoneNumber(normalizedPhone);
      await this.rateLimiter.incrementAccount('default'); // Use account ID in production

      this.logger.log(`Alert SMS queued successfully for ${normalizedPhone}`);
    } catch (error) {
      this.logger.error(`Failed to send alert SMS to ${to}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Send generic SMS with production implementation
   *
   * @param to - Recipient phone number (E.164 format recommended)
   * @param data - SMS data including message
   * @returns Promise that resolves when SMS is queued/sent
   *
   * @throws BadRequestException if phone number is invalid
   * @throws HttpException if rate limit exceeded
   */
  async sendSMS(to: string, data: GenericSmsDto): Promise<void> {
    this.logger.log(`Sending SMS to ${to}`);

    try {
      // 1. Validate and normalize phone number
      const validation = await this.phoneValidator.validatePhoneNumber(to);
      if (!validation.isValid) {
        throw new BadRequestException(
          `Invalid phone number: ${validation.error}`,
        );
      }

      const normalizedPhone = validation.e164Format!;

      // 2. Check rate limits
      await this.checkRateLimits(normalizedPhone);

      // 3. Prepare message
      const truncatedMessage = this.truncateMessage(data.message);

      // 4. Send via appropriate method
      if (this.twilioProvider.isReady() && this.isProduction) {
        await this.queueSms(normalizedPhone, truncatedMessage, SmsPriority.NORMAL, {
          type: 'generic',
        });
      } else {
        await this.logSmsToConsole(normalizedPhone, truncatedMessage);
      }

      // 5. Increment rate limit counters
      await this.rateLimiter.incrementPhoneNumber(normalizedPhone);
      await this.rateLimiter.incrementAccount('default');

      this.logger.log(`SMS queued successfully for ${normalizedPhone}`);
    } catch (error) {
      this.logger.error(`Failed to send SMS to ${to}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Send SMS with advanced options (priority, scheduling, retry config)
   *
   * @param to - Recipient phone number
   * @param data - Advanced SMS options
   * @returns Promise that resolves when SMS is queued
   */
  async sendAdvancedSMS(to: string, data: SendSmsDto): Promise<void> {
    this.logger.log(`Sending advanced SMS to ${to} with priority ${data.priority}`);

    try {
      // Validate phone number
      const validation = await this.phoneValidator.validatePhoneNumber(to);
      if (!validation.isValid) {
        throw new BadRequestException(`Invalid phone number: ${validation.error}`);
      }

      const normalizedPhone = validation.e164Format!;

      // Check rate limits
      await this.checkRateLimits(normalizedPhone);

      // Prepare message (with template variables if provided)
      let message = data.message;
      if (data.templateVariables) {
        // Simple variable substitution
        Object.entries(data.templateVariables).forEach(([key, value]) => {
          message = message.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
        });
      }

      const truncatedMessage = this.truncateMessage(message);

      // Queue with advanced options
      if (this.twilioProvider.isReady() && this.isProduction) {
        const delay = data.scheduledFor
          ? new Date(data.scheduledFor).getTime() - Date.now()
          : 0;

        await this.queueSms(
          normalizedPhone,
          truncatedMessage,
          data.priority || SmsPriority.NORMAL,
          data.metadata,
          data.maxRetries,
          delay > 0 ? delay : undefined,
        );
      } else {
        await this.logSmsToConsole(normalizedPhone, truncatedMessage);
      }

      // Increment rate limits
      await this.rateLimiter.incrementPhoneNumber(normalizedPhone);
      await this.rateLimiter.incrementAccount('default');

      this.logger.log(`Advanced SMS queued for ${normalizedPhone}`);
    } catch (error) {
      this.logger.error(`Failed to send advanced SMS to ${to}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Send SMS using template
   *
   * @param to - Recipient phone number
   * @param data - Template data with variables
   * @returns Promise that resolves when SMS is queued/sent
   */
  async sendTemplatedSMS(to: string, data: SendTemplatedSmsDto): Promise<void> {
    this.logger.log(`Sending templated SMS (${data.templateId}) to ${to}`);

    try {
      // Validate phone number
      const validation = await this.phoneValidator.validatePhoneNumber(to);
      if (!validation.isValid) {
        throw new BadRequestException(`Invalid phone number: ${validation.error}`);
      }

      const normalizedPhone = validation.e164Format!;

      // Check rate limits
      await this.checkRateLimits(normalizedPhone);

      // Render template
      const message = await this.templateService.renderTemplate(data.templateId, data.variables);
      const truncatedMessage = this.truncateMessage(message);

      // Send
      if (this.twilioProvider.isReady() && this.isProduction) {
        await this.queueSms(normalizedPhone, truncatedMessage, SmsPriority.NORMAL, {
          templateId: data.templateId,
          type: 'templated',
        });
      } else {
        await this.logSmsToConsole(normalizedPhone, truncatedMessage);
      }

      // Increment rate limits
      await this.rateLimiter.incrementPhoneNumber(normalizedPhone);
      await this.rateLimiter.incrementAccount('default');

      this.logger.log(`Templated SMS queued for ${normalizedPhone}`);
    } catch (error) {
      this.logger.error(`Failed to send templated SMS to ${to}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Send bulk SMS to multiple recipients
   *
   * @param data - Bulk SMS data with recipients and message
   * @returns Promise with result details
   */
  async sendBulkSMS(data: BulkSmsDto): Promise<BulkSmsResultDto> {
    this.logger.log(`Sending bulk SMS to ${data.recipients.length} recipients`);

    const results: Array<{ phoneNumber: string; error?: string }> = [];
    let successCount = 0;
    let estimatedCost = 0;

    for (const recipient of data.recipients) {
      try {
        // Validate phone number
        const validation = await this.phoneValidator.validatePhoneNumber(recipient);

        if (!validation.isValid) {
          results.push({ phoneNumber: recipient, error: validation.error });
          continue;
        }

        const normalizedPhone = validation.e164Format!;

        // Check rate limit (but don't throw, just skip)
        const rateLimitStatus = await this.rateLimiter.checkPhoneNumberLimit(normalizedPhone);
        if (rateLimitStatus.isLimited) {
          results.push({
            phoneNumber: recipient,
            error: `Rate limit exceeded. Resets in ${rateLimitStatus.resetInSeconds}s`,
          });
          continue;
        }

        // Queue SMS
        const truncatedMessage = this.truncateMessage(data.message);

        if (this.twilioProvider.isReady() && this.isProduction) {
          await this.queueSms(
            normalizedPhone,
            truncatedMessage,
            data.priority || SmsPriority.NORMAL,
            { ...data.metadata, bulkSend: true },
          );
        } else {
          await this.logSmsToConsole(normalizedPhone, truncatedMessage);
        }

        // Increment counters
        await this.rateLimiter.incrementPhoneNumber(normalizedPhone);
        await this.rateLimiter.incrementAccount('default');

        successCount++;
        estimatedCost += 0.0079; // Rough estimate
      } catch (error) {
        results.push({ phoneNumber: recipient, error: error.message });
      }
    }

    const failedCount = data.recipients.length - successCount;
    const failures = results.filter((r) => r.error).map((r) => ({ phoneNumber: r.phoneNumber, error: r.error! }));

    this.logger.log(
      `Bulk SMS completed - ${successCount} successful, ${failedCount} failed`,
    );

    return {
      totalRecipients: data.recipients.length,
      successCount,
      failedCount,
      failures,
      estimatedCost: parseFloat(estimatedCost.toFixed(4)),
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Validate phone number
   *
   * @param phoneNumber - Phone number to validate
   * @param defaultCountry - Optional default country code
   * @returns Validation result
   */
  async validatePhoneNumber(
    phoneNumber: string,
    defaultCountry?: string,
  ): Promise<PhoneNumberValidationResult> {
    return this.phoneValidator.validatePhoneNumber(phoneNumber, defaultCountry);
  }

  /**
   * Test SMS configuration and connectivity
   *
   * @param to - Test recipient phone number
   * @returns Promise that resolves with true if test is successful
   */
  async testConnection(to: string): Promise<boolean> {
    try {
      this.logger.log(`Testing SMS connection to ${to}`);

      // Validate phone number first
      const validation = await this.phoneValidator.validatePhoneNumber(to);
      if (!validation.isValid) {
        this.logger.error(`Test failed: Invalid phone number - ${validation.error}`);
        return false;
      }

      // Send test message
      await this.sendSMS(validation.e164Format!, {
        message: 'White Cross SMS Service Test: This is a test message.',
      });

      this.logger.log('SMS test successful');
      return true;
    } catch (error) {
      this.logger.error('SMS test failed:', error);
      return false;
    }
  }

  /**
   * Get SMS character limit
   *
   * @returns Maximum SMS length in characters
   */
  getMaxLength(): number {
    return this.maxLength;
  }

  /**
   * Set SMS character limit
   *
   * @param length - New maximum length (between 1 and 1600 characters)
   * @throws BadRequestException if length is invalid
   */
  setMaxLength(length: number): void {
    if (length < 1 || length > 1600) {
      throw new BadRequestException('SMS length must be between 1 and 1600 characters');
    }

    this.maxLength = length;
    this.logger.log(`SMS max length updated to ${length} characters`);
  }

  // ==================== Private Helper Methods ====================

  /**
   * Queue SMS for reliable delivery via BullMQ
   *
   * @param to - Recipient phone number (E.164 format)
   * @param message - SMS message content
   * @param priority - SMS priority
   * @param metadata - Optional metadata
   * @param maxRetries - Maximum retry attempts (default: 3)
   * @param delay - Delay in milliseconds before sending
   * @returns Promise that resolves when job is queued
   * @private
   */
  private async queueSms(
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

    const jobOptions: any = {
      priority: bullPriority,
      attempts: maxRetries,
      backoff: {
        type: 'exponential',
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
   * Check rate limits for phone number and account
   *
   * @param phoneNumber - Phone number to check
   * @throws HttpException if rate limit exceeded
   * @private
   */
  private async checkRateLimits(phoneNumber: string): Promise<void> {
    // Check per-phone rate limit
    const phoneLimit = await this.rateLimiter.checkPhoneNumberLimit(phoneNumber);
    if (phoneLimit.isLimited) {
      this.logger.warn(`Rate limit exceeded for ${phoneNumber}`);
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: `Rate limit exceeded for this phone number. Try again in ${phoneLimit.resetInSeconds} seconds.`,
          details: phoneLimit,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // Check per-account rate limit
    const accountLimit = await this.rateLimiter.checkAccountLimit('default');
    if (accountLimit.isLimited) {
      this.logger.warn('Account rate limit exceeded');
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: `Account SMS rate limit exceeded. Try again in ${accountLimit.resetInSeconds} seconds.`,
          details: accountLimit,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
  }

  /**
   * Log SMS to console (development mode)
   *
   * @param to - Recipient phone number
   * @param message - SMS message
   * @private
   */
  private async logSmsToConsole(to: string, message: string): Promise<void> {
    this.logger.log('========== SMS ==========');
    this.logger.log(`To: ${to}`);
    this.logger.log(`Message: ${message}`);
    this.logger.log(`Length: ${message.length} chars`);
    this.logger.log('=========================');

    // Simulate async operation
    await this.simulateDelay(100);
  }

  /**
   * Format alert SMS message with severity prefix
   *
   * @param data - Alert data
   * @returns Formatted SMS message
   * @private
   */
  private formatAlertSMS(data: AlertSmsDto): string {
    return `[${data.severity}] ${data.title}: ${data.message}`;
  }

  /**
   * Truncate message to SMS length limit
   *
   * @param message - Original message
   * @returns Truncated message with ellipsis if needed
   * @private
   */
  private truncateMessage(message: string): string {
    if (message.length <= this.maxLength) {
      return message;
    }
    return message.substring(0, this.maxLength - 3) + '...';
  }

  /**
   * Map alert severity to SMS priority
   *
   * @param severity - Alert severity
   * @returns SMS priority
   * @private
   */
  private mapSeverityToPriority(severity: string): SmsPriority {
    switch (severity.toLowerCase()) {
      case 'critical':
      case 'emergency':
        return SmsPriority.URGENT;
      case 'high':
        return SmsPriority.HIGH;
      case 'medium':
        return SmsPriority.NORMAL;
      case 'low':
        return SmsPriority.LOW;
      default:
        return SmsPriority.NORMAL;
    }
  }

  /**
   * Map SMS priority to Bull queue priority number
   *
   * @param priority - SMS priority
   * @returns Bull priority (1-4, lower = higher priority)
   * @private
   */
  private mapPriorityToNumber(priority: SmsPriority): number {
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
   * Simulate network delay for testing
   *
   * @param ms - Delay in milliseconds
   * @returns Promise that resolves after delay
   * @private
   */
  private simulateDelay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
