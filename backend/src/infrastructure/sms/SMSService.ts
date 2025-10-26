/**
 * SMS Service
 * Stub implementation for SMS delivery
 *
 * @description Provides SMS sending capabilities for alerts, notifications, and emergency communications.
 * This is a stub implementation that logs SMS messages to console. In production, integrate with:
 * - Twilio
 * - AWS SNS
 * - Vonage (Nexmo)
 * - MessageBird
 *
 * @example
 * ```typescript
 * const smsService = new SMSService();
 * await smsService.sendAlertSMS('+15551234567', {
 *   title: 'Critical Alert',
 *   message: 'Student requires immediate attention',
 *   severity: 'CRITICAL'
 * });
 * ```
 */

import { AlertSeverity } from '@/database/models/alerts/AlertInstance';

export interface AlertSMSData {
  title: string;
  message: string;
  severity: AlertSeverity;
}

export interface GenericSMSData {
  message: string;
}

/**
 * SMSService class
 * Handles all SMS sending operations
 */
export class SMSService {
  private isProduction: boolean;
  private maxLength: number = 160; // Standard SMS length

  constructor() {
    this.isProduction = process.env.NODE_ENV === 'production';
  }

  /**
   * Send alert notification SMS
   *
   * @param to - Recipient phone number (E.164 format recommended: +15551234567)
   * @param data - Alert SMS data including title, message, severity
   * @returns Promise that resolves when SMS is sent
   *
   * @throws Error if SMS delivery fails or phone number is invalid
   */
  async sendAlertSMS(to: string, data: AlertSMSData): Promise<void> {
    const formattedMessage = this.formatAlertSMS(data);
    const truncatedMessage = this.truncateMessage(formattedMessage);

    if (!this.isValidPhoneNumber(to)) {
      throw new Error(`Invalid phone number format: ${to}`);
    }

    if (this.isProduction) {
      // TODO: Integrate with actual SMS provider
      console.warn('SMSService: Production SMS provider not configured');
      console.log(`Would send SMS to ${to}: ${truncatedMessage}`);
    } else {
      console.log('========== SMS ==========');
      console.log(`To: ${to}`);
      console.log(`Message: ${truncatedMessage}`);
      console.log(`Length: ${truncatedMessage.length} chars`);
      console.log('=========================');
    }

    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  /**
   * Send generic SMS
   *
   * @param to - Recipient phone number (E.164 format recommended)
   * @param data - SMS data including message
   * @returns Promise that resolves when SMS is sent
   *
   * @throws Error if SMS delivery fails or phone number is invalid
   */
  async sendSMS(to: string, data: GenericSMSData): Promise<void> {
    const truncatedMessage = this.truncateMessage(data.message);

    if (!this.isValidPhoneNumber(to)) {
      throw new Error(`Invalid phone number format: ${to}`);
    }

    if (this.isProduction) {
      // TODO: Integrate with actual SMS provider
      console.warn('SMSService: Production SMS provider not configured');
      console.log(`Would send SMS to ${to}: ${truncatedMessage}`);
    } else {
      console.log('========== SMS ==========');
      console.log(`To: ${to}`);
      console.log(`Message: ${truncatedMessage}`);
      console.log(`Length: ${truncatedMessage.length} chars`);
      console.log('=========================');
    }

    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  /**
   * Format alert SMS message
   *
   * @param data - Alert data
   * @returns Formatted SMS message
   * @private
   */
  private formatAlertSMS(data: AlertSMSData): string {
    return `[${data.severity}] ${data.title}: ${data.message}`;
  }

  /**
   * Truncate message to SMS length limit
   *
   * @param message - Original message
   * @returns Truncated message
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
   *
   * @param phoneNumber - Phone number to validate
   * @returns True if valid, false otherwise
   * @private
   */
  private isValidPhoneNumber(phoneNumber: string): boolean {
    // Basic validation: starts with + and contains 10-15 digits
    const e164Regex = /^\+[1-9]\d{1,14}$/;
    // Also allow US format without +1
    const usFormatRegex = /^(\+1)?[2-9]\d{2}[2-9]\d{2}\d{4}$/;

    return e164Regex.test(phoneNumber) || usFormatRegex.test(phoneNumber);
  }

  /**
   * Send bulk SMS
   *
   * @param recipients - Array of recipient phone numbers
   * @param data - SMS data to send to all recipients
   * @returns Promise that resolves when all SMS are sent
   */
  async sendBulkSMS(recipients: string[], data: GenericSMSData): Promise<void> {
    const promises = recipients.map(to => this.sendSMS(to, data));
    await Promise.all(promises);
  }

  /**
   * Test SMS configuration
   *
   * @param to - Test recipient phone number
   * @returns Promise that resolves if test is successful
   */
  async testConnection(to: string): Promise<boolean> {
    try {
      await this.sendSMS(to, {
        message: 'White Cross SMS Service Test: This is a test message.',
      });
      return true;
    } catch (error) {
      console.error('SMS test failed:', error);
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
   * @param length - New maximum length
   */
  setMaxLength(length: number): void {
    if (length < 1 || length > 1600) {
      throw new Error('SMS length must be between 1 and 1600 characters');
    }
    this.maxLength = length;
  }
}

export default SMSService;
