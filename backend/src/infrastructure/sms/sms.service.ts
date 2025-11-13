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

import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bullmq';
import {
  AlertSmsDto,
  BulkSmsDto,
  BulkSmsResultDto,
  GenericSmsDto,
  PhoneNumberValidationResult,
  SendSmsDto,
  SendTemplatedSmsDto,
} from './dto';
import { TwilioProvider } from './providers/twilio.provider';
import { PhoneValidatorService } from './services/phone-validator.service';
import { SmsTemplateService } from './services/sms-template.service';
import { RateLimiterService } from './services/rate-limiter.service';
import { CostTrackerService } from './services/cost-tracker.service';
import { SMS_QUEUE_NAME } from './processors/sms-queue.processor';
import { SmsSenderService } from './services/sms-sender.service';

import { BaseService } from '../../common/base';
/**
 * SMS Service class
 * Orchestrates all SMS operations with comprehensive error handling and monitoring
 */
@Injectable()
export class SmsService extends BaseService {
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
    private readonly smsSender: SmsSenderService,
  ) {
    this.isProduction = this.configService.get<string>('NODE_ENV') === 'production';

    this.logInfo(
      `SMS Service initialized - Environment: ${this.isProduction ? 'production' : 'development'}`,
    );

    // Log provider status
    if (this.twilioProvider.isReady()) {
      this.logInfo('Twilio provider is configured and ready');
    } else {
      this.logWarning('Twilio provider is not configured - SMS will be logged only');
    }
  }

  /**
   * Send alert notification SMS with production implementation
   */
  async sendAlertSMS(to: string, data: AlertSmsDto): Promise<void> {
    return this.smsSender.sendAlertSMS(to, data);
  }

  /**
   * Send generic SMS with production implementation
   */
  async sendSMS(to: string, data: GenericSmsDto): Promise<void> {
    return this.smsSender.sendSMS(to, data);
  }

  /**
   * Send SMS with advanced options (priority, scheduling, retry config)
   */
  async sendAdvancedSMS(to: string, data: SendSmsDto): Promise<void> {
    return this.smsSender.sendAdvancedSMS(to, data);
  }

  /**
   * Send SMS using template
   */
  async sendTemplatedSMS(to: string, data: SendTemplatedSmsDto): Promise<void> {
    return this.smsSender.sendTemplatedSMS(to, data);
  }

  /**
   * Send bulk SMS to multiple recipients
   */
  async sendBulkSMS(data: BulkSmsDto): Promise<BulkSmsResultDto> {
    return this.smsSender.sendBulkSMS(data);
  }

  /**
   * Validate phone number
   */
  async validatePhoneNumber(
    phoneNumber: string,
    defaultCountry?: string,
  ): Promise<PhoneNumberValidationResult> {
    return this.phoneValidator.validatePhoneNumber(phoneNumber, defaultCountry);
  }

  /**
   * Test SMS configuration and connectivity
   */
  async testConnection(to: string): Promise<boolean> {
    try {
      this.logInfo(`Testing SMS connection to ${to}`);

      // Validate phone number first
      const validation = await this.phoneValidator.validatePhoneNumber(to);
      if (!validation.isValid) {
        this.logError(`Test failed: Invalid phone number - ${validation.error}`);
        return false;
      }

      // Send test message
      await this.sendSMS(validation.e164Format!, {
        message: 'White Cross SMS Service Test: This is a test message.',
      });

      this.logInfo('SMS test successful');
      return true;
    } catch (error) {
      this.logError('SMS test failed:', error);
      return false;
    }
  }

  /**
   * Get SMS character limit
   */
  getMaxLength(): number {
    return this.maxLength;
  }

  /**
   * Set SMS character limit
   */
  setMaxLength(length: number): void {
    if (length < 1 || length > 1600) {
      throw new BadRequestException('SMS length must be between 1 and 1600 characters');
    }

    this.maxLength = length;
    this.logInfo(`SMS max length updated to ${length} characters`);
  }
}
