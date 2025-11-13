/**
 * @fileoverview SMS Sender Service
 * @module infrastructure/sms/services
 * @description Service for sending different types of SMS messages
 */

import { Injectable, Logger } from '@nestjs/common';
import { TwilioProvider } from '../providers/twilio.provider';
import { PhoneValidatorService } from './phone-validator.service';
import { RateLimiterService } from './rate-limiter.service';
import { BaseSmsService } from '../base/base-sms.service';
import {
  AlertSmsDto,
  BulkSmsDto,
  BulkSmsResultDto,
  GenericSmsDto,
  SendSmsDto,
  SendTemplatedSmsDto,
  SmsPriority,
} from '../dto';
import { SmsTemplateService } from './sms-template.service';

import { BaseService } from '../../../common/base';
import { BaseService } from '../../../common/base';
import { LoggerService } from '../../shared/logging/logger.service';
import { Inject } from '@nestjs/common';
/**
 * Service for sending different types of SMS messages
 */
@Injectable()
export class SmsSenderService extends BaseSmsService {
  constructor(
    @Inject(LoggerService) logger: LoggerService,
    configService: any,
    smsQueue: any,
    private readonly twilioProvider: TwilioProvider,
    private readonly phoneValidator: PhoneValidatorService,
    private readonly rateLimiter: RateLimiterService,
    private readonly templateService: SmsTemplateService,
  ) {
    super({
      serviceName: 'SmsSenderService',
      logger,
      enableAuditLogging: true,
    });

    super(configService, smsQueue);
    this.logger = new Logger(SmsSenderService.name);
  }

  /**
   * Send alert notification SMS
   */
  async sendAlertSMS(to: string, data: AlertSmsDto): Promise<void> {
    this.logInfo(`Sending alert SMS to ${to} - [${data.severity}] ${data.title}`);

    try {
      // 1. Validate and normalize phone number
      const validation = await this.phoneValidator.validatePhoneNumber(to);
      if (!validation.isValid) {
        throw new Error(`Invalid phone number: ${validation.error}`);
      }

      const normalizedPhone = validation.e164Format;

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
      await this.rateLimiter.incrementAccount('default');

      this.logInfo(`Alert SMS queued successfully for ${normalizedPhone}`);
    } catch (error) {
      this.logError(`Failed to send alert SMS to ${to}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Send generic SMS
   */
  async sendSMS(to: string, data: GenericSmsDto): Promise<void> {
    this.logInfo(`Sending SMS to ${to}`);

    try {
      // 1. Validate and normalize phone number
      const validation = await this.phoneValidator.validatePhoneNumber(to);
      if (!validation.isValid) {
        throw new Error(`Invalid phone number: ${validation.error}`);
      }

      const normalizedPhone = validation.e164Format;

      // 2. Check rate limits
      await this.checkRateLimits(normalizedPhone);

      // 3. Prepare message
      const truncatedMessage = this.truncateMessage(data.message);

      // 4. Send via appropriate method
      if (this.twilioProvider.isReady() && this.isProduction) {
        await this.queueSms(
          normalizedPhone,
          truncatedMessage,
          SmsPriority.NORMAL,
          {
            type: 'generic',
          },
        );
      } else {
        await this.logSmsToConsole(normalizedPhone, truncatedMessage);
      }

      // 5. Increment rate limit counters
      await this.rateLimiter.incrementPhoneNumber(normalizedPhone);
      await this.rateLimiter.incrementAccount('default');

      this.logInfo(`SMS queued successfully for ${normalizedPhone}`);
    } catch (error) {
      this.logError(`Failed to send SMS to ${to}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Send SMS with advanced options
   */
  async sendAdvancedSMS(to: string, data: SendSmsDto): Promise<void> {
    this.logInfo(`Sending advanced SMS to ${to} with priority ${data.priority}`);

    try {
      // Validate phone number
      const validation = await this.phoneValidator.validatePhoneNumber(to);
      if (!validation.isValid) {
        throw new Error(`Invalid phone number: ${validation.error}`);
      }

      const normalizedPhone = validation.e164Format;

      // Check rate limits
      await this.checkRateLimits(normalizedPhone);

      // Prepare message (with template variables if provided)
      let message = data.message;
      if (data.templateVariables) {
        // Simple variable substitution
        Object.entries(data.templateVariables).forEach(([key, value]) => {
          message = message.replace(
            new RegExp(`{{${key}}}`, 'g'),
            String(value),
          );
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

      this.logInfo(`Advanced SMS queued for ${normalizedPhone}`);
    } catch (error) {
      this.logError(`Failed to send advanced SMS to ${to}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Send SMS using template
   */
  async sendTemplatedSMS(to: string, data: SendTemplatedSmsDto): Promise<void> {
    this.logInfo(`Sending templated SMS (${data.templateId}) to ${to}`);

    try {
      // Validate phone number
      const validation = await this.phoneValidator.validatePhoneNumber(to);
      if (!validation.isValid) {
        throw new Error(`Invalid phone number: ${validation.error}`);
      }

      const normalizedPhone = validation.e164Format;

      // Check rate limits
      await this.checkRateLimits(normalizedPhone);

      // Render template
      const message = await this.templateService.renderTemplate(
        data.templateId,
        data.variables,
      );
      const truncatedMessage = this.truncateMessage(message);

      // Send
      if (this.twilioProvider.isReady() && this.isProduction) {
        await this.queueSms(
          normalizedPhone,
          truncatedMessage,
          SmsPriority.NORMAL,
          {
            templateId: data.templateId,
            type: 'templated',
          },
        );
      } else {
        await this.logSmsToConsole(normalizedPhone, truncatedMessage);
      }

      // Increment rate limits
      await this.rateLimiter.incrementPhoneNumber(normalizedPhone);
      await this.rateLimiter.incrementAccount('default');

      this.logInfo(`Templated SMS queued for ${normalizedPhone}`);
    } catch (error) {
      this.logError(`Failed to send templated SMS to ${to}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Send bulk SMS to multiple recipients
   */
  async sendBulkSMS(data: BulkSmsDto): Promise<BulkSmsResultDto> {
    this.logInfo(`Sending bulk SMS to ${data.recipients.length} recipients`);

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

        const normalizedPhone = validation.e164Format;

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
    const failures = results
      .filter((r) => r.error)
      .map((r) => ({ phoneNumber: r.phoneNumber, error: r.error! }));

    this.logInfo(`Bulk SMS completed - ${successCount} successful, ${failedCount} failed`);

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
   * Check rate limits for phone number and account
   */
  private async checkRateLimits(phoneNumber: string): Promise<void> {
    // Check per-phone rate limit
    const phoneLimit = await this.rateLimiter.checkPhoneNumberLimit(phoneNumber);
    if (phoneLimit.isLimited) {
      this.logWarning(`Rate limit exceeded for ${phoneNumber}`);
      throw this.createRateLimitException(
        `Rate limit exceeded for this phone number. Try again in ${phoneLimit.resetInSeconds} seconds.`,
        phoneLimit.resetInSeconds,
      );
    }

    // Check per-account rate limit
    const accountLimit = await this.rateLimiter.checkAccountLimit('default');
    if (accountLimit.isLimited) {
      this.logWarning('Account rate limit exceeded');
      throw this.createRateLimitException(
        `Account SMS rate limit exceeded. Try again in ${accountLimit.resetInSeconds} seconds.`,
        accountLimit.resetInSeconds,
      );
    }
  }

  /**
   * Format alert SMS message with severity prefix
   */
  private formatAlertSMS(data: AlertSmsDto): string {
    return `[${data.severity}] ${data.title}: ${data.message}`;
  }

  /**
   * Map alert severity to SMS priority
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
}
