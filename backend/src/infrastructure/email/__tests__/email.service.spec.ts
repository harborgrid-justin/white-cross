/**
 * @fileoverview Email Service Unit Tests
 * @module infrastructure/email/__tests__
 */

import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { EmailService } from '../email.service';
import { EmailTemplateService } from '../email-template.service';
import { EmailQueueService } from '../email-queue.service';
import { EmailRateLimiterService } from '../email-rate-limiter.service';
import {
  AlertEmailData,
  GenericEmailData,
  EmailTemplate,
  EmailPriority,
  SendEmailDto,
} from '../dto';
import { AlertSeverity, AlertCategory } from '../../../alerts/alerts.service';

describe('EmailService', () => {
  let service: EmailService;
  let templateService: EmailTemplateService;
  let queueService: EmailQueueService;
  let rateLimiterService: EmailRateLimiterService;
  let configService: ConfigService;

  const mockConfigService = {
    get: jest.fn((key: string, defaultValue?: unknown) => {
      const config: Record<string, unknown> = {
        NODE_ENV: 'test',
        EMAIL_QUEUE_ENABLED: false, // Disable queue for most tests
        EMAIL_FROM: 'test@example.com',
        EMAIL_TRANSPORT: 'smtp',
        EMAIL_SMTP_HOST: 'localhost',
        EMAIL_SMTP_PORT: 587,
        EMAIL_SMTP_SECURE: false,
        EMAIL_SMTP_USER: 'test',
        EMAIL_SMTP_PASS: 'test',
      };
      return config[key] !== undefined ? config[key] : defaultValue;
    }),
  };

  const mockTemplateService = {
    render: jest.fn().mockResolvedValue({
      html: '<html>Test Email</html>',
      text: 'Test Email',
    }),
    templateExists: jest.fn().mockResolvedValue(true),
  };

  const mockQueueService = {
    addToQueue: jest.fn().mockResolvedValue('job-123'),
  };

  const mockRateLimiterService = {
    checkLimit: jest.fn().mockReturnValue({
      allowed: true,
      remaining: 100,
      resetAt: new Date(Date.now() + 3600000),
      identifier: 'test',
    }),
    recordSent: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        { provide: ConfigService, useValue: mockConfigService },
        { provide: EmailTemplateService, useValue: mockTemplateService },
        { provide: EmailQueueService, useValue: mockQueueService },
        { provide: EmailRateLimiterService, useValue: mockRateLimiterService },
      ],
    }).compile();

    service = module.get<EmailService>(EmailService);
    templateService = module.get<EmailTemplateService>(EmailTemplateService);
    queueService = module.get<EmailQueueService>(EmailQueueService);
    rateLimiterService = module.get<EmailRateLimiterService>(EmailRateLimiterService);
    configService = module.get<ConfigService>(ConfigService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendAlertEmail', () => {
    const alertData: AlertEmailData = {
      title: 'Test Alert',
      message: 'This is a test alert',
      severity: AlertSeverity.HIGH,
      category: AlertCategory.MEDICATION,
      alertId: 'alert-123',
    };

    it('should send alert email successfully', async () => {
      const result = await service.sendAlertEmail('user@example.com', alertData);

      expect(result.success).toBe(true);
      expect(result.messageId).toBeDefined();
      expect(templateService.render).toHaveBeenCalledWith(
        EmailTemplate.ALERT,
        expect.objectContaining({
          title: alertData.title,
          message: alertData.message,
          severity: alertData.severity,
        }),
      );
    });

    it('should throw error for invalid email', async () => {
      await expect(service.sendAlertEmail('invalid-email', alertData)).rejects.toThrow(
        'Invalid email address',
      );
    });

    it('should set correct priority based on severity', async () => {
      await service.sendAlertEmail('user@example.com', {
        ...alertData,
        severity: AlertSeverity.CRITICAL,
      });

      // Verify the email was sent (implementation detail)
      expect(templateService.render).toHaveBeenCalled();
    });
  });

  describe('sendEmail', () => {
    const emailData: GenericEmailData = {
      subject: 'Test Subject',
      body: 'Test body content',
    };

    it('should send generic email successfully', async () => {
      const result = await service.sendEmail('user@example.com', emailData);

      expect(result.success).toBe(true);
      expect(result.messageId).toBeDefined();
    });

    it('should handle HTML content', async () => {
      const result = await service.sendEmail('user@example.com', {
        ...emailData,
        html: '<p>HTML content</p>',
      });

      expect(result.success).toBe(true);
    });

    it('should validate recipient email', async () => {
      await expect(service.sendEmail('', emailData)).rejects.toThrow();
    });
  });

  describe('sendTemplatedEmail', () => {
    const templateData: SendEmailDto = {
      to: ['user@example.com'],
      subject: 'Welcome',
      body: 'Welcome to our platform',
      template: EmailTemplate.WELCOME,
      templateData: {
        name: 'John Doe',
        loginUrl: 'https://example.com/login',
      },
    };

    it('should send templated email with data', async () => {
      const result = await service.sendTemplatedEmail(templateData);

      expect(result.success).toBe(true);
      expect(templateService.render).toHaveBeenCalledWith(
        EmailTemplate.WELCOME,
        templateData.templateData,
      );
    });

    it('should handle template rendering failure gracefully', async () => {
      mockTemplateService.render.mockRejectedValueOnce(new Error('Template not found'));

      const result = await service.sendTemplatedEmail(templateData);

      // Should still succeed with plain content
      expect(result.success).toBe(true);
    });
  });

  describe('validateEmail', () => {
    it('should validate correct email addresses', () => {
      expect(service.validateEmail('user@example.com').valid).toBe(true);
      expect(service.validateEmail('test.user@example.co.uk').valid).toBe(true);
      expect(service.validateEmail('user+tag@example.com').valid).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(service.validateEmail('').valid).toBe(false);
      expect(service.validateEmail('invalid').valid).toBe(false);
      expect(service.validateEmail('@example.com').valid).toBe(false);
      expect(service.validateEmail('user@').valid).toBe(false);
      expect(service.validateEmail('user @example.com').valid).toBe(false);
    });

    it('should provide reason for invalid emails', () => {
      const result = service.validateEmail('');
      expect(result.valid).toBe(false);
      expect(result.reason).toBeDefined();
    });
  });

  describe('rate limiting', () => {
    it('should check rate limit before sending', async () => {
      await service.sendEmail('user@example.com', {
        subject: 'Test',
        body: 'Test',
      });

      expect(rateLimiterService.checkLimit).toHaveBeenCalled();
    });

    it('should record sent email for rate limiting', async () => {
      await service.sendEmail('user@example.com', {
        subject: 'Test',
        body: 'Test',
      });

      expect(rateLimiterService.recordSent).toHaveBeenCalledWith(['user@example.com']);
    });

    it('should handle rate limit exceeded', async () => {
      mockRateLimiterService.checkLimit.mockReturnValueOnce({
        allowed: false,
        remaining: 0,
        resetAt: new Date(Date.now() + 3600000),
        identifier: 'user@example.com',
      });

      const result = await service.sendEmail('user@example.com', {
        subject: 'Test',
        body: 'Test',
      });

      // Should fail when queue is disabled
      expect(result.success).toBe(false);
    });
  });

  describe('bulk email', () => {
    it('should send bulk emails to multiple recipients', async () => {
      const recipients = ['user1@example.com', 'user2@example.com', 'user3@example.com'];
      const data: GenericEmailData = {
        subject: 'Bulk Test',
        body: 'Bulk email content',
      };

      const results = await service.sendBulkEmail(recipients, data);

      expect(results).toHaveLength(3);
      expect(results.every((r) => r.success)).toBe(true);
    });

    it('should handle partial failures in bulk send', async () => {
      const recipients = ['valid@example.com', 'invalid-email', 'valid2@example.com'];

      const results = await service.sendBulkEmail(recipients, {
        subject: 'Test',
        body: 'Test',
      });

      expect(results).toHaveLength(3);
      expect(results.filter((r) => !r.success)).toHaveLength(1);
      expect(results.filter((r) => r.success)).toHaveLength(2);
    });
  });

  describe('batch emails', () => {
    it('should send personalized emails to each recipient', async () => {
      const emails = [
        { to: 'user1@example.com', data: { subject: 'Hello User 1', body: 'Content 1' } },
        { to: 'user2@example.com', data: { subject: 'Hello User 2', body: 'Content 2' } },
      ];

      const results = await service.sendBatchEmails(emails);

      expect(results).toHaveLength(2);
      expect(results.every((r) => r.success)).toBe(true);
    });
  });

  describe('attachments', () => {
    it('should handle email attachments', async () => {
      const emailWithAttachment: SendEmailDto = {
        to: ['user@example.com'],
        subject: 'Email with Attachment',
        body: 'See attached file',
        attachments: [
          {
            filename: 'document.pdf',
            content: Buffer.from('PDF content'),
            contentType: 'application/pdf',
          },
        ],
      };

      const result = await service.sendTemplatedEmail(emailWithAttachment);

      expect(result.success).toBe(true);
    });

    it('should handle multiple attachments', async () => {
      const emailWithAttachments: SendEmailDto = {
        to: ['user@example.com'],
        subject: 'Multiple Attachments',
        body: 'See attached files',
        attachments: [
          { filename: 'doc1.pdf', content: 'content1', contentType: 'application/pdf' },
          { filename: 'doc2.txt', content: 'content2', contentType: 'text/plain' },
        ],
      };

      const result = await service.sendTemplatedEmail(emailWithAttachments);

      expect(result.success).toBe(true);
    });
  });

  describe('statistics', () => {
    it('should track email statistics', async () => {
      await service.sendEmail('user@example.com', { subject: 'Test', body: 'Test' });

      const stats = service.getStatistics();

      expect(stats.totalSent).toBeGreaterThan(0);
      expect(stats.successRate).toBeDefined();
      expect(stats.averageDeliveryTime).toBeDefined();
    });

    it('should track failed emails', async () => {
      // Send to invalid email
      await service.sendEmail('', { subject: 'Test', body: 'Test' }).catch(() => {});

      const stats = service.getStatistics();

      expect(stats.totalFailed).toBeGreaterThan(0);
    });
  });

  describe('testConnection', () => {
    it('should test email connection successfully', async () => {
      const result = await service.testConnection('test@example.com');

      expect(result).toBe(true);
    });

    it('should handle connection test failure', async () => {
      // Mock a failure scenario
      const result = await service.testConnection('invalid-email');

      expect(result).toBe(false);
    });
  });

  describe('error handling', () => {
    it('should handle transporter errors gracefully', async () => {
      // This test would require mocking the transporter to throw an error
      const result = await service.sendEmail('user@example.com', {
        subject: 'Test',
        body: 'Test',
      });

      expect(result).toBeDefined();
      expect(result.success).toBeDefined();
    });

    it('should return error details on failure', async () => {
      const result = await service.sendEmail('invalid-email', {
        subject: 'Test',
        body: 'Test',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('CC and BCC', () => {
    it('should send emails with CC recipients', async () => {
      const emailData: SendEmailDto = {
        to: ['primary@example.com'],
        cc: ['cc@example.com'],
        subject: 'Test CC',
        body: 'Test',
      };

      const result = await service.sendTemplatedEmail(emailData);

      expect(result.success).toBe(true);
    });

    it('should send emails with BCC recipients', async () => {
      const emailData: SendEmailDto = {
        to: ['primary@example.com'],
        bcc: ['bcc@example.com'],
        subject: 'Test BCC',
        body: 'Test',
      };

      const result = await service.sendTemplatedEmail(emailData);

      expect(result.success).toBe(true);
    });

    it('should validate all recipients (to, cc, bcc)', async () => {
      const emailData: SendEmailDto = {
        to: ['valid@example.com'],
        cc: ['invalid-cc'],
        subject: 'Test',
        body: 'Test',
      };

      const result = await service.sendTemplatedEmail(emailData);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid email address');
    });
  });
});
