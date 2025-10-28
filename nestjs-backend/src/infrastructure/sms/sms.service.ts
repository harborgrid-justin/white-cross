/**
 * @fileoverview SMS Service - NestJS Implementation
 * @module infrastructure/sms
 * @description Provides SMS sending capabilities for alerts, notifications, and emergency communications.
 * This is a stub implementation that logs SMS messages to console. In production, integrate with:
 * - Twilio
 * - AWS SNS
 * - Vonage (Nexmo)
 * - MessageBird
 *
 * @example
 * ```typescript
 * const smsService = new SmsService(configService);
 * await smsService.sendAlertSMS('+15551234567', {
 *   title: 'Critical Alert',
 *   message: 'Student requires immediate attention',
 *   severity: AlertSeverity.CRITICAL
 * });
 * ```
 */

import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AlertSmsDto, GenericSmsDto } from './dto';

/**
 * SMS Service class
 * Handles all SMS sending operations with proper dependency injection
 */
@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  private readonly isProduction: boolean;
  private maxLength: number = 160; // Standard SMS length

  constructor(private readonly configService: ConfigService) {
    this.isProduction = this.configService.get<string>('NODE_ENV') === 'production';
  }

  /**
   * Send alert notification SMS
   *
   * @param to - Recipient phone number (E.164 format recommended: +15551234567)
   * @param data - Alert SMS data including title, message, severity
   * @returns Promise that resolves when SMS is sent
   *
   * @throws BadRequestException if phone number is invalid
   * @throws Error if SMS delivery fails
   */
  async sendAlertSMS(to: string, data: AlertSmsDto): Promise<void> {
    this.logger.log(`Sending alert SMS to ${to} - [${data.severity}] ${data.title}`);

    const formattedMessage = this.formatAlertSMS(data);
    const truncatedMessage = this.truncateMessage(formattedMessage);

    if (!this.isValidPhoneNumber(to)) {
      throw new BadRequestException(`Invalid phone number format: ${to}`);
    }

    if (this.isProduction) {
      // TODO: Integrate with actual SMS provider (Twilio, AWS SNS, etc.)
      this.logger.warn('SMSService: Production SMS provider not configured');
      this.logger.log(`Would send SMS to ${to}: ${truncatedMessage}`);
    } else {
      this.logger.log('========== SMS ==========');
      this.logger.log(`To: ${to}`);
      this.logger.log(`Message: ${truncatedMessage}`);
      this.logger.log(`Length: ${truncatedMessage.length} chars`);
      this.logger.log('=========================');
    }

    // Simulate async operation
    await this.simulateDelay(100);
  }

  /**
   * Send generic SMS
   *
   * @param to - Recipient phone number (E.164 format recommended)
   * @param data - SMS data including message
   * @returns Promise that resolves when SMS is sent
   *
   * @throws BadRequestException if phone number is invalid
   * @throws Error if SMS delivery fails
   */
  async sendSMS(to: string, data: GenericSmsDto): Promise<void> {
    this.logger.log(`Sending SMS to ${to}`);

    const truncatedMessage = this.truncateMessage(data.message);

    if (!this.isValidPhoneNumber(to)) {
      throw new BadRequestException(`Invalid phone number format: ${to}`);
    }

    if (this.isProduction) {
      // TODO: Integrate with actual SMS provider
      this.logger.warn('SMSService: Production SMS provider not configured');
      this.logger.log(`Would send SMS to ${to}: ${truncatedMessage}`);
    } else {
      this.logger.log('========== SMS ==========');
      this.logger.log(`To: ${to}`);
      this.logger.log(`Message: ${truncatedMessage}`);
      this.logger.log(`Length: ${truncatedMessage.length} chars`);
      this.logger.log('=========================');
    }

    // Simulate async operation
    await this.simulateDelay(100);
  }

  /**
   * Send bulk SMS
   *
   * @param recipients - Array of recipient phone numbers
   * @param data - SMS data to send to all recipients
   * @returns Promise that resolves when all SMS are sent
   *
   * @throws BadRequestException if any phone number is invalid
   */
  async sendBulkSMS(recipients: string[], data: GenericSmsDto): Promise<void> {
    this.logger.log(`Sending bulk SMS to ${recipients.length} recipients`);

    const promises = recipients.map((to) => this.sendSMS(to, data));
    await Promise.all(promises);

    this.logger.log(`Bulk SMS sent successfully to ${recipients.length} recipients`);
  }

  /**
   * Test SMS configuration
   *
   * @param to - Test recipient phone number
   * @returns Promise that resolves with true if test is successful, false otherwise
   */
  async testConnection(to: string): Promise<boolean> {
    try {
      this.logger.log(`Testing SMS connection to ${to}`);

      await this.sendSMS(to, {
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
   * Format alert SMS message
   *
   * @param data - Alert data
   * @returns Formatted SMS message with severity prefix
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
   * Validate phone number format
   * Supports E.164 format and US format
   *
   * @param phoneNumber - Phone number to validate
   * @returns True if valid, false otherwise
   * @private
   */
  private isValidPhoneNumber(phoneNumber: string): boolean {
    // E.164 format: starts with + and contains 10-15 digits
    const e164Regex = /^\+[1-9]\d{1,14}$/;
    // US format: optional +1 followed by 10 digits
    const usFormatRegex = /^(\+1)?[2-9]\d{2}[2-9]\d{2}\d{4}$/;

    return e164Regex.test(phoneNumber) || usFormatRegex.test(phoneNumber);
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
