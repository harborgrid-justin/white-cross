/**
 * @fileoverview Email Service
 * @module infrastructure/email
 * @description Main email service orchestrating all email functionality
 */

import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseService } from '@/common/base';
import { LoggerService } from '@/common/logging/logger.service';
import { EmailValidatorService } from '@/services/email-validator.service';
import { EmailSenderService } from '@/services/email-sender.service';
import { EmailStatisticsService } from '@/services/email-statistics.service';
import { EmailQueueService } from './email-queue.service';
import { EmailRateLimiterService } from './email-rate-limiter.service';
import {
  AlertEmailData,
  EmailDeliveryResult,
  EmailStatistics,
  EmailValidationResult,
  GenericEmailData,
  SendEmailDto,
  AlertData,
} from './types/email.types';

@Injectable()
export class EmailService extends BaseService {
  private readonly queueEnabled: boolean;
  private readonly isProduction: boolean;

  constructor(
    @Inject(LoggerService) logger: LoggerService,
    private readonly configService: ConfigService,
    private readonly validatorService: EmailValidatorService,
    private readonly senderService: EmailSenderService,
    private readonly statisticsService: EmailStatisticsService,
    private readonly queueService: EmailQueueService,
    private readonly rateLimiterService: EmailRateLimiterService,
  ) {
    super({
      serviceName: 'EmailService',
      logger,
      enableAuditLogging: true,
    });

    this.isProduction = this.configService.get<string>('NODE_ENV') === 'production';
    this.queueEnabled = this.configService.get<boolean>('EMAIL_QUEUE_ENABLED', true);

    this.logInfo('EmailService initialized');
  }

  /**
   * Send alert notification email
   */
  async sendAlertEmail(to: string, data: AlertEmailData): Promise<EmailDeliveryResult> {
    this.logInfo(`Sending alert email to ${to}: [${data.severity}] ${data.title}`);

    // Validate email
    const validation = this.validatorService.validateEmail(to);
    if (!validation.valid) {
      throw new Error(`Invalid email address: ${validation.reason}`);
    }

    // Prepare alert data
    const alertData: AlertData = {
      severity: data.severity,
      category: data.category,
      alertId: data.alertId,
      timestamp: data.timestamp || new Date(),
      title: data.title,
      message: data.message,
    };

    return this.senderService.sendAlertEmail([to], `[${data.severity}] ${data.title}`, alertData);
  }

  /**
   * Send generic email
   */
  async sendEmail(to: string, data: GenericEmailData): Promise<EmailDeliveryResult> {
    this.logInfo(`Sending email to ${to}: ${data.subject}`);

    return this.senderService.sendGenericEmail([to], data.subject, data.body, data.html);
  }

  /**
   * Send templated email
   */
  async sendTemplatedEmail(emailData: SendEmailDto): Promise<EmailDeliveryResult> {
    return this.senderService.sendTemplatedEmail(emailData);
  }

  /**
   * Send bulk emails to multiple recipients
   */
  async sendBulkEmail(
    recipients: string[],
    data: GenericEmailData,
  ): Promise<EmailDeliveryResult[]> {
    this.logInfo(`Sending bulk email to ${recipients.length} recipients`);

    // Validate all emails first
    const validationSummary = this.validatorService.getValidationSummary(recipients);
    if (validationSummary.invalid > 0) {
      this.logWarning(`${validationSummary.invalid} invalid emails found, filtering them out`);
    }

    const validRecipients = validationSummary.validEmails;

    // Split into batches to respect rate limits
    const batchSize = 50;
    const batches: string[][] = [];

    for (let i = 0; i < validRecipients.length; i += batchSize) {
      batches.push(validRecipients.slice(i, i + batchSize));
    }

    const results: EmailDeliveryResult[] = [];

    for (const batch of batches) {
      const batchResults = await Promise.all(
        batch.map((recipient) =>
          this.senderService.sendGenericEmail([recipient], data.subject, data.body, data.html)
            .catch((error) => ({
              success: false,
              error: error instanceof Error ? error.message : 'Unknown error',
              timestamp: new Date(),
              recipients: [recipient],
            })),
        ),
      );

      results.push(...batchResults);
    }

    return results;
  }

  /**
   * Send batch emails with individual data
   */
  async sendBatchEmails(
    emails: Array<{ to: string; data: GenericEmailData }>,
  ): Promise<EmailDeliveryResult[]> {
    this.logInfo(`Sending batch of ${emails.length} personalized emails`);

    const promises = emails.map(({ to, data }) =>
      this.sendEmail(to, data).catch((error) => ({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
        recipients: [to],
      })),
    );

    return Promise.all(promises);
  }

  /**
   * Test email configuration
   */
  async testConnection(to: string): Promise<boolean> {
    return this.senderService.testConnection(to);
  }

  /**
   * Validate email address
   */
  validateEmail(email: string): EmailValidationResult {
    return this.validatorService.validateEmail(email);
  }

  /**
   * Get email statistics
   */
  getStatistics(): EmailStatistics {
    return this.statisticsService.getStatistics();
  }

  /**
   * Close all services
   */
  async close(): Promise<void> {
    await this.senderService.close();
    this.logInfo('Email service closed');
  }
}
