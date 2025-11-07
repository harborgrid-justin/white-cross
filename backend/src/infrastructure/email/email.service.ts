/**
 * @fileoverview Email Service - Production Implementation
 * @module infrastructure/email
 * @description Provides production-ready email sending capabilities with nodemailer integration,
 * templating, queuing, retry logic, rate limiting, and comprehensive error handling.
 *
 * Features:
 * - Nodemailer integration with SMTP/SendGrid/SES support
 * - HTML and text email templates with Handlebars
 * - Email queue with BullMQ for reliable delivery
 * - Exponential backoff retry logic
 * - Rate limiting (global and per-recipient)
 * - Attachment support
 * - Email tracking and logging
 * - Comprehensive error handling
 *
 * @example
 * ```typescript
 * constructor(private readonly emailService: EmailService) {}
 *
 * // Send alert email
 * await this.emailService.sendAlertEmail('user@example.com', {
 *   title: 'Critical Alert',
 *   message: 'Student requires immediate attention',
 *   severity: AlertSeverity.CRITICAL,
 *   category: AlertCategory.MEDICATION,
 *   alertId: 'uuid-here'
 * });
 *
 * // Send templated email with queue
 * await this.emailService.sendTemplatedEmail({
 *   to: ['user@example.com'],
 *   subject: 'Welcome',
 *   body: 'Welcome to our platform',
 *   template: EmailTemplate.WELCOME,
 *   templateData: { name: 'John', loginUrl: 'https://...' }
 * });
 * ```
 */

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import * as SMTPTransport from 'nodemailer/lib/smtp-transport';
import * as validator from 'email-validator';
import {
  AlertEmailData,
  GenericEmailData,
  EmailDeliveryResult,
  SendEmailDto,
  EmailTemplate,
  EmailPriority,
  EmailValidationResult,
  EmailStatistics,
  EmailTrackingData,
  BulkEmailDto,
} from './dto/email.dto';
import { EmailTemplateService } from './email-template.service';
import { EmailQueueService } from './email-queue.service';
import { EmailRateLimiterService } from './email-rate-limiter.service';

/**
 * EmailService class
 * Main service for handling all email operations
 */
@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly transporter: Transporter<SMTPTransport.SentMessageInfo>;
  private readonly defaultFrom: string;
  private readonly defaultReplyTo?: string;
  private readonly queueEnabled: boolean;
  private readonly isProduction: boolean;

  // Tracking
  private readonly emailStats = {
    sent: 0,
    failed: 0,
    queued: 0,
    totalDeliveryTime: 0,
  };

  constructor(
    private readonly configService: ConfigService,
    private readonly templateService: EmailTemplateService,
    private readonly queueService: EmailQueueService,
    private readonly rateLimiterService: EmailRateLimiterService,
  ) {
    this.isProduction =
      this.configService.get<string>('NODE_ENV') === 'production';
    this.queueEnabled = this.configService.get<boolean>(
      'EMAIL_QUEUE_ENABLED',
      true,
    );
    this.defaultFrom = this.configService.get<string>(
      'EMAIL_FROM',
      'noreply@whitecross.healthcare',
    );
    this.defaultReplyTo = this.configService.get<string>('EMAIL_REPLY_TO');

    // Initialize nodemailer transporter
    this.transporter = this.createTransporter();
    this.logger.log('EmailService initialized with nodemailer');

    // Verify transporter configuration
    if (this.isProduction) {
      this.verifyTransporter();
    }
  }

  /**
   * Create nodemailer transporter based on configuration
   * @returns Nodemailer transporter
   * @private
   */
  private createTransporter(): Transporter<SMTPTransport.SentMessageInfo> {
    const transportType = this.configService.get<string>(
      'EMAIL_TRANSPORT',
      'smtp',
    );

    if (transportType === 'smtp') {
      return nodemailer.createTransport({
        host: this.configService.get<string>('EMAIL_SMTP_HOST', 'localhost'),
        port: this.configService.get<number>('EMAIL_SMTP_PORT', 587),
        secure: this.configService.get<boolean>('EMAIL_SMTP_SECURE', false),
        auth: {
          user: this.configService.get<string>('EMAIL_SMTP_USER', ''),
          pass: this.configService.get<string>('EMAIL_SMTP_PASS', ''),
        },
        pool: true,
        maxConnections: this.configService.get<number>(
          'EMAIL_SMTP_MAX_CONNECTIONS',
          5,
        ),
        maxMessages: this.configService.get<number>(
          'EMAIL_SMTP_MAX_MESSAGES',
          100,
        ),
        rateDelta: this.configService.get<number>(
          'EMAIL_SMTP_RATE_DELTA',
          1000,
        ),
        rateLimit: this.configService.get<number>('EMAIL_SMTP_RATE_LIMIT', 5),
      } as SMTPTransport.Options);
    }

    // For testing/development, use ethereal or stream transport
    if (!this.isProduction) {
      this.logger.warn('Using development transport (logging only)');
      return nodemailer.createTransport({
        streamTransport: true,
        newline: 'unix',
      });
    }

    throw new Error(`Unsupported email transport type: ${transportType}`);
  }

  /**
   * Verify transporter configuration
   * @private
   *
   * @description Verifies SMTP connection and configuration. In production,
   * logs detailed error information to help with troubleshooting.
   */
  private async verifyTransporter(): Promise<void> {
    try {
      await this.transporter.verify();
      this.logger.log('Email transporter verified successfully', {
        transport: this.configService.get<string>('EMAIL_TRANSPORT', 'smtp'),
        host: this.configService.get<string>('EMAIL_SMTP_HOST', 'localhost'),
        port: this.configService.get<number>('EMAIL_SMTP_PORT', 587),
        secure: this.configService.get<boolean>('EMAIL_SMTP_SECURE', false),
      });
    } catch (error) {
      const transportConfig = {
        transport: this.configService.get<string>('EMAIL_TRANSPORT', 'smtp'),
        host: this.configService.get<string>('EMAIL_SMTP_HOST', 'localhost'),
        port: this.configService.get<number>('EMAIL_SMTP_PORT', 587),
        secure: this.configService.get<boolean>('EMAIL_SMTP_SECURE', false),
        user: this.configService.get<string>('EMAIL_SMTP_USER', '')
          ? 'configured'
          : 'not configured',
        password: this.configService.get<string>('EMAIL_SMTP_PASS', '')
          ? 'configured'
          : 'not configured',
      };

      this.logger.error(
        `Email transporter verification failed: ${error.message}`,
        {
          error: error.message,
          config: transportConfig,
          isProduction: this.isProduction,
          recommendation:
            'Verify SMTP credentials and ensure mail server is accessible',
        },
      );

      if (this.isProduction) {
        this.logger.error(
          'CRITICAL: Email functionality may not work correctly in production',
          {
            impact: 'Alert notifications and system emails will fail',
            action: 'Check SMTP configuration and credentials immediately',
          },
        );
      }
    }
  }

  /**
   * Send alert notification email
   *
   * @param to - Recipient email address
   * @param data - Alert email data including title, message, severity
   * @returns Promise that resolves with delivery result
   *
   * @throws Error if email validation fails or delivery fails
   */
  async sendAlertEmail(
    to: string,
    data: AlertEmailData,
  ): Promise<EmailDeliveryResult> {
    this.logger.log(
      `Sending alert email to ${to}: [${data.severity}] ${data.title}`,
    );

    // Validate email
    const validation = this.validateEmail(to);
    if (!validation.valid) {
      throw new Error(`Invalid email address: ${validation.reason}`);
    }

    // Prepare alert email data with timestamp
    const alertData = {
      ...data,
      timestamp: data.timestamp || new Date(),
    };

    // Use alert template
    const sendData: SendEmailDto = {
      to: [to],
      subject: `[${data.severity}] ${data.title}`,
      body: this.formatAlertEmailText(alertData),
      template: EmailTemplate.ALERT,
      templateData: alertData,
      priority: this.getSeverityPriority(data.severity),
      tags: ['alert', data.severity.toLowerCase(), data.category.toLowerCase()],
    };

    return this.send(sendData);
  }

  /**
   * Send generic email
   *
   * @param to - Recipient email address
   * @param data - Email data including subject and body
   * @returns Promise that resolves with delivery result
   *
   * @throws Error if email validation fails or delivery fails
   */
  async sendEmail(
    to: string,
    data: GenericEmailData,
  ): Promise<EmailDeliveryResult> {
    this.logger.log(`Sending email to ${to}: ${data.subject}`);

    const sendData: SendEmailDto = {
      to: [to],
      subject: data.subject,
      body: data.body,
      html: data.html,
    };

    return this.send(sendData);
  }

  /**
   * Send templated email (main send method)
   *
   * @param emailData - Complete email data with template information
   * @returns Promise that resolves with delivery result
   *
   * @throws Error if validation or sending fails
   */
  async sendTemplatedEmail(
    emailData: SendEmailDto,
  ): Promise<EmailDeliveryResult> {
    return this.send(emailData);
  }

  /**
   * Core send method with rate limiting, queuing, and error handling
   *
   * @param emailData - Email data to send
   * @returns Promise that resolves with delivery result
   * @private
   */
  private async send(emailData: SendEmailDto): Promise<EmailDeliveryResult> {
    const startTime = Date.now();

    try {
      // Validate all recipient emails
      const allRecipients = [
        ...emailData.to,
        ...(emailData.cc || []),
        ...(emailData.bcc || []),
      ];

      for (const recipient of allRecipients) {
        const validation = this.validateEmail(recipient);
        if (!validation.valid) {
          throw new Error(
            `Invalid email address ${recipient}: ${validation.reason}`,
          );
        }
      }

      // Check rate limits
      const rateLimitStatus = this.rateLimiterService.checkLimit(allRecipients);
      if (!rateLimitStatus.allowed) {
        const error = new Error(
          `Rate limit exceeded for ${rateLimitStatus.identifier}. ` +
            `Resets at ${rateLimitStatus.resetAt.toISOString()}`,
        );
        this.logger.warn(error.message);

        if (this.queueEnabled && emailData.queue !== false) {
          // Queue for later if rate limited
          const delay = rateLimitStatus.resetAt.getTime() - Date.now();
          return this.queueEmail(emailData, delay);
        }

        throw error;
      }

      // Queue if enabled and requested
      if (this.queueEnabled && emailData.queue !== false) {
        return this.queueEmail(emailData, emailData.delay);
      }

      // Send immediately
      const result = await this.sendImmediate(emailData);

      // Record rate limit
      this.rateLimiterService.recordSent(allRecipients);

      // Track statistics
      const deliveryTime = Date.now() - startTime;
      this.emailStats.sent++;
      this.emailStats.totalDeliveryTime += deliveryTime;

      this.logger.log(
        `Email sent successfully in ${deliveryTime}ms: ${result.messageId} to ${emailData.to.join(', ')}`,
      );

      return result;
    } catch (error) {
      this.emailStats.failed++;
      this.logger.error(`Email send failed: ${error.message}`, error.stack);

      return {
        success: false,
        error: error.message,
        timestamp: new Date(),
        recipients: emailData.to,
      };
    }
  }

  /**
   * Send email immediately without queuing
   *
   * @param emailData - Email data
   * @returns Promise that resolves with delivery result
   * @private
   */
  private async sendImmediate(
    emailData: SendEmailDto,
  ): Promise<EmailDeliveryResult> {
    let htmlContent = emailData.html;
    let textContent = emailData.body;

    // Render template if specified
    if (emailData.template && emailData.templateData) {
      try {
        const rendered = await this.templateService.render(
          emailData.template,
          emailData.templateData,
        );
        htmlContent = rendered.html;
        textContent = rendered.text;
      } catch (error) {
        this.logger.warn(
          `Template rendering failed, using plain content: ${error.message}`,
        );
      }
    }

    // Prepare mail options
    const mailOptions: nodemailer.SendMailOptions = {
      from: emailData.from || this.defaultFrom,
      to: emailData.to.join(', '),
      cc: emailData.cc?.join(', '),
      bcc: emailData.bcc?.join(', '),
      replyTo: emailData.replyTo || this.defaultReplyTo,
      subject: emailData.subject,
      text: textContent,
      html: htmlContent,
      priority: this.getNodemailerPriority(emailData.priority),
      headers: emailData.headers,
    };

    // Add attachments if present
    if (emailData.attachments && emailData.attachments.length > 0) {
      mailOptions.attachments = emailData.attachments.map((att) => ({
        filename: att.filename,
        content: att.content,
        contentType: att.contentType,
        contentDisposition: att.disposition,
        cid: att.cid,
      }));
    }

    // Send via nodemailer
    if (!this.isProduction) {
      // In development, log the email
      this.logger.debug('========== EMAIL ==========');
      this.logger.debug(`From: ${mailOptions.from}`);
      this.logger.debug(`To: ${mailOptions.to}`);
      if (mailOptions.cc) this.logger.debug(`CC: ${mailOptions.cc}`);
      if (mailOptions.bcc) this.logger.debug(`BCC: ${mailOptions.bcc}`);
      this.logger.debug(`Subject: ${mailOptions.subject}`);
      this.logger.debug(`Body:\n${textContent.substring(0, 500)}...`);
      if (mailOptions.attachments) {
        this.logger.debug(`Attachments: ${mailOptions.attachments.length}`);
      }
      this.logger.debug('===========================');
    }

    const info = await this.transporter.sendMail(mailOptions);

    return {
      success: true,
      messageId: info.messageId,
      timestamp: new Date(),
      recipients: emailData.to,
    };
  }

  /**
   * Queue email for later sending
   *
   * @param emailData - Email data
   * @param delay - Delay in milliseconds
   * @returns Promise that resolves with queued result
   * @private
   */
  private async queueEmail(
    emailData: SendEmailDto,
    delay?: number,
  ): Promise<EmailDeliveryResult> {
    try {
      const jobId = await this.queueService.addToQueue(emailData, {
        priority: emailData.priority,
        delay,
      });

      this.emailStats.queued++;
      this.logger.log(`Email queued: ${jobId} (delay: ${delay || 0}ms)`);

      return {
        success: true,
        messageId: jobId,
        timestamp: new Date(),
        recipients: emailData.to,
      };
    } catch (error) {
      this.logger.error(`Failed to queue email: ${error.message}`);
      throw error;
    }
  }

  /**
   * Send bulk emails to multiple recipients
   *
   * @param recipients - Array of recipient email addresses
   * @param data - Email data to send to all recipients
   * @returns Promise that resolves when all emails are sent
   */
  async sendBulkEmail(
    recipients: string[],
    data: GenericEmailData,
  ): Promise<EmailDeliveryResult[]> {
    this.logger.log(`Sending bulk email to ${recipients.length} recipients`);

    const sendData: SendEmailDto = {
      to: recipients,
      subject: data.subject,
      body: data.body,
      html: data.html,
    };

    // Split into batches to respect rate limits
    const batchSize = 50;
    const batches: string[][] = [];

    for (let i = 0; i < recipients.length; i += batchSize) {
      batches.push(recipients.slice(i, i + batchSize));
    }

    const results: EmailDeliveryResult[] = [];

    for (const batch of batches) {
      const batchResults = await Promise.all(
        batch.map((recipient) =>
          this.send({ ...sendData, to: [recipient] }).catch((error) => ({
            success: false,
            error: error.message,
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
   * Send email to multiple recipients with individual data
   *
   * @param emails - Array of recipient emails with corresponding data
   * @returns Promise that resolves when all emails are sent
   */
  async sendBatchEmails(
    emails: Array<{ to: string; data: GenericEmailData }>,
  ): Promise<EmailDeliveryResult[]> {
    this.logger.log(`Sending batch of ${emails.length} personalized emails`);

    const promises = emails.map(({ to, data }) =>
      this.sendEmail(to, data).catch((error) => ({
        success: false,
        error: error.message,
        timestamp: new Date(),
        recipients: [to],
      })),
    );

    return Promise.all(promises);
  }

  /**
   * Test email configuration
   *
   * @param to - Test recipient email address
   * @returns Promise that resolves if test is successful
   */
  async testConnection(to: string): Promise<boolean> {
    try {
      this.logger.log(`Testing email connection with recipient: ${to}`);

      await this.sendEmail(to, {
        subject: 'White Cross Email Service Test',
        body: 'This is a test email from White Cross Healthcare Platform. If you receive this, the email service is working correctly.',
      });

      this.logger.log('Email test successful');
      return true;
    } catch (error) {
      this.logger.error('Email test failed:', error);
      return false;
    }
  }

  /**
   * Validate email address
   *
   * @param email - Email address to validate
   * @returns Validation result
   */
  validateEmail(email: string): EmailValidationResult {
    if (!email) {
      return { valid: false, email, reason: 'Email is required' };
    }

    if (!validator.validate(email)) {
      return { valid: false, email, reason: 'Invalid email format' };
    }

    // Additional checks
    const parts = email.split('@');
    if (parts.length !== 2) {
      return { valid: false, email, reason: 'Invalid email format' };
    }

    const [localPart, domain] = parts;

    if (localPart.length === 0 || localPart.length > 64) {
      return { valid: false, email, reason: 'Invalid local part length' };
    }

    if (domain.length === 0 || domain.length > 255) {
      return { valid: false, email, reason: 'Invalid domain length' };
    }

    return { valid: true, email };
  }

  /**
   * Get email statistics
   *
   * @returns Email statistics
   */
  getStatistics(): EmailStatistics {
    const total = this.emailStats.sent + this.emailStats.failed;
    const successRate = total > 0 ? (this.emailStats.sent / total) * 100 : 0;
    const avgDeliveryTime =
      this.emailStats.sent > 0
        ? this.emailStats.totalDeliveryTime / this.emailStats.sent
        : 0;

    return {
      totalSent: this.emailStats.sent,
      totalFailed: this.emailStats.failed,
      totalQueued: this.emailStats.queued,
      averageDeliveryTime: avgDeliveryTime,
      successRate,
      period: {
        start: new Date(), // In production, track from service start
        end: new Date(),
      },
    };
  }

  /**
   * Format alert email as plain text
   *
   * @param data - Alert data
   * @returns Formatted email body
   * @private
   */
  private formatAlertEmailText(data: AlertEmailData): string {
    return `
White Cross Healthcare Alert
=============================

Severity: ${data.severity}
Category: ${data.category}
Alert ID: ${data.alertId}
${data.timestamp ? `Time: ${data.timestamp.toLocaleString()}` : ''}

${data.title}

${data.message}

---
This is an automated message from White Cross Healthcare Platform.
Do not reply to this email.
    `.trim();
  }

  /**
   * Get email priority from alert severity
   *
   * @param severity - Alert severity
   * @returns Email priority
   * @private
   */
  private getSeverityPriority(severity: string): EmailPriority {
    const severityMap: Record<string, EmailPriority> = {
      CRITICAL: EmailPriority.URGENT,
      HIGH: EmailPriority.HIGH,
      MEDIUM: EmailPriority.NORMAL,
      LOW: EmailPriority.LOW,
    };

    return severityMap[severity] || EmailPriority.NORMAL;
  }

  /**
   * Get nodemailer priority from email priority
   *
   * @param priority - Email priority
   * @returns Nodemailer priority
   * @private
   */
  private getNodemailerPriority(
    priority?: EmailPriority,
  ): 'high' | 'normal' | 'low' | undefined {
    if (!priority) return undefined;

    const priorityMap: Record<EmailPriority, 'high' | 'normal' | 'low'> = {
      [EmailPriority.URGENT]: 'high',
      [EmailPriority.HIGH]: 'high',
      [EmailPriority.NORMAL]: 'normal',
      [EmailPriority.LOW]: 'low',
    };

    return priorityMap[priority];
  }

  /**
   * Close transporter (cleanup)
   */
  async close(): Promise<void> {
    this.transporter.close();
    this.logger.log('Email transporter closed');
  }
}
