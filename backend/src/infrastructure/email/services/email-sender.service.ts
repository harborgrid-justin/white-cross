/**
 * @fileoverview Email Sender Service
 * @module infrastructure/email/services
 * @description Service for sending emails via nodemailer with template support
 */

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import * as SMTPTransport from 'nodemailer/lib/smtp-transport';
import { SendEmailDto, EmailDeliveryResult, EmailPriority, AlertData, EmailTemplate } from '../types/email.types';
import { EmailTemplateService } from '../email-template.service';
import { EmailStatisticsService } from './email-statistics.service';

@Injectable()
export class EmailSenderService {
  private readonly logger = new Logger(EmailSenderService.name);
  private readonly transporter: Transporter<SMTPTransport.SentMessageInfo>;
  private readonly defaultFrom: string;
  private readonly defaultReplyTo?: string;
  private readonly isProduction: boolean;

  constructor(
    private readonly configService: ConfigService,
    private readonly templateService: EmailTemplateService,
    private readonly statisticsService: EmailStatisticsService,
  ) {
    this.isProduction = this.configService.get<string>('NODE_ENV') === 'production';
    this.defaultFrom = this.configService.get<string>(
      'EMAIL_FROM',
      'noreply@whitecross.healthcare',
    );
    this.defaultReplyTo = this.configService.get<string>('EMAIL_REPLY_TO');

    this.transporter = this.createTransporter();
  }

  /**
   * Create nodemailer transporter
   */
  private createTransporter(): Transporter<SMTPTransport.SentMessageInfo> {
    const transportType = this.configService.get<string>('EMAIL_TRANSPORT', 'smtp');

    if (transportType === 'smtp') {
      return nodemailer.createTransporter({
        host: this.configService.get<string>('EMAIL_SMTP_HOST', 'localhost'),
        port: this.configService.get<number>('EMAIL_SMTP_PORT', 587),
        secure: this.configService.get<boolean>('EMAIL_SMTP_SECURE', false),
        auth: {
          user: this.configService.get<string>('EMAIL_SMTP_USER', ''),
          pass: this.configService.get<string>('EMAIL_SMTP_PASS', ''),
        },
        pool: true,
        maxConnections: this.configService.get<number>('EMAIL_SMTP_MAX_CONNECTIONS', 5),
        maxMessages: this.configService.get<number>('EMAIL_SMTP_MAX_MESSAGES', 100),
        rateDelta: this.configService.get<number>('EMAIL_SMTP_RATE_DELTA', 1000),
        rateLimit: this.configService.get<number>('EMAIL_SMTP_RATE_LIMIT', 5),
      } as SMTPTransport.Options);
    }

    // Development fallback
    if (!this.isProduction) {
      this.logger.warn('Using development transport (logging only)');
      return nodemailer.createTransporter({
        streamTransport: true,
        newline: 'unix',
      });
    }

    const error = new Error(`Unsupported email transport type: ${transportType}`);
    this.logger.error(error.message);
    throw error;
  }

  /**
   * Send email immediately
   */
  async sendImmediate(emailData: SendEmailDto): Promise<EmailDeliveryResult> {
    const startTime = Date.now();

    try {
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
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          this.logger.warn(`Template rendering failed, using plain content: ${errorMessage}`);
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

      // Log in development
      if (!this.isProduction) {
        this.logger.debug('========== EMAIL ==========');
        this.logger.debug(`From: ${String(mailOptions.from)}`);
        this.logger.debug(`To: ${String(mailOptions.to)}`);
        if (mailOptions.cc) this.logger.debug(`CC: ${String(mailOptions.cc)}`);
        if (mailOptions.bcc) this.logger.debug(`BCC: ${String(mailOptions.bcc)}`);
        this.logger.debug(`Subject: ${mailOptions.subject}`);
        this.logger.debug(`Body:\n${textContent?.substring(0, 500)}...`);
        if (mailOptions.attachments) {
          this.logger.debug(`Attachments: ${mailOptions.attachments.length}`);
        }
        this.logger.debug('===========================');
      }

      const info = await this.transporter.sendMail(mailOptions);
      const deliveryTime = Date.now() - startTime;

      // Record statistics
      this.statisticsService.recordSent(deliveryTime);

      return {
        success: true,
        messageId: info.messageId,
        timestamp: new Date(),
        recipients: emailData.to,
      };
    } catch (error) {
      this.statisticsService.recordFailed();
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(`Email send failed: ${errorMessage}`, errorStack);

      return {
        success: false,
        error: errorMessage,
        timestamp: new Date(),
        recipients: emailData.to,
      };
    }
  }

  /**
   * Send alert email with formatted text
   */
  async sendAlertEmail(
    to: string[],
    subject: string,
    alertData: AlertData,
  ): Promise<EmailDeliveryResult> {
    const emailData: SendEmailDto = {
      to,
      subject,
      body: this.formatAlertEmailText(alertData),
      template: EmailTemplate.ALERT,
      templateData: alertData,
      priority: EmailPriority.URGENT,
    };

    return this.sendImmediate(emailData);
  }

  /**
   * Send generic email
   */
  async sendGenericEmail(
    to: string[],
    subject: string,
    body: string,
    html?: string,
  ): Promise<EmailDeliveryResult> {
    const emailData: SendEmailDto = {
      to,
      subject,
      body,
      html,
    };

    return this.sendImmediate(emailData);
  }

  /**
   * Send templated email
   */
  async sendTemplatedEmail(emailData: SendEmailDto): Promise<EmailDeliveryResult> {
    return this.sendImmediate(emailData);
  }

  /**
   * Test email configuration
   */
  async testConnection(to: string): Promise<boolean> {
    try {
      this.logger.log(`Testing email connection with recipient: ${to}`);

      const result = await this.sendGenericEmail(
        [to],
        'White Cross Email Service Test',
        'This is a test email from White Cross Healthcare Platform. If you receive this, the email service is working correctly.',
      );

      this.logger.log('Email test successful');
      return result.success;
    } catch (error) {
      this.logger.error('Email test failed:', error);
      return false;
    }
  }

  /**
   * Format alert email as plain text
   */
  private formatAlertEmailText(data: any): string {
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
   * Get nodemailer priority from email priority
   */
  private getNodemailerPriority(priority?: EmailPriority): 'high' | 'normal' | 'low' | undefined {
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
   * Close transporter
   */
  async close(): Promise<void> {
    this.transporter.close();
    this.logger.log('Email transporter closed');
  }
}
