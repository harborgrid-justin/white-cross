import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { EmailService } from './email.service';
import { LoggerService } from '@/common/logging/logger.service';
import { EmailValidatorService } from './services/email-validator.service';
import { EmailSenderService } from './services/email-sender.service';
import { EmailStatisticsService } from './services/email-statistics.service';
import { EmailQueueService } from './email-queue.service';
import { EmailRateLimiterService } from './email-rate-limiter.service';
import {
  AlertEmailData,
  EmailDeliveryResult,
  EmailValidationResult,
  GenericEmailData,
} from './types/email.types';

describe('EmailService', () => {
  let service: EmailService;
  let mockLogger: jest.Mocked<LoggerService>;
  let mockConfig: jest.Mocked<ConfigService>;
  let mockValidator: jest.Mocked<EmailValidatorService>;
  let mockSender: jest.Mocked<EmailSenderService>;
  let mockStatistics: jest.Mocked<EmailStatisticsService>;
  let mockQueue: jest.Mocked<EmailQueueService>;
  let mockRateLimiter: jest.Mocked<EmailRateLimiterService>;

  const mockDeliveryResult: EmailDeliveryResult = {
    success: true,
    timestamp: new Date(),
    recipients: ['test@example.com'],
  };

  beforeEach(async () => {
    mockLogger = {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
    } as unknown as jest.Mocked<LoggerService>;

    mockConfig = {
      get: jest.fn((key: string, defaultValue?: unknown) => {
        if (key === 'NODE_ENV') return 'test';
        if (key === 'EMAIL_QUEUE_ENABLED') return true;
        return defaultValue;
      }),
    } as unknown as jest.Mocked<ConfigService>;

    mockValidator = {
      validateEmail: jest.fn().mockReturnValue({ valid: true }),
      getValidationSummary: jest.fn().mockReturnValue({
        valid: 10,
        invalid: 0,
        validEmails: Array.from({ length: 10 }, (_, i) => `user${i}@example.com`),
      }),
    } as unknown as jest.Mocked<EmailValidatorService>;

    mockSender = {
      sendAlertEmail: jest.fn().mockResolvedValue(mockDeliveryResult),
      sendGenericEmail: jest.fn().mockResolvedValue(mockDeliveryResult),
      sendTemplatedEmail: jest.fn().mockResolvedValue(mockDeliveryResult),
      testConnection: jest.fn().mockResolvedValue(true),
      close: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<EmailSenderService>;

    mockStatistics = {
      getStatistics: jest.fn().mockReturnValue({
        sent: 100,
        failed: 5,
        pending: 2,
      }),
    } as unknown as jest.Mocked<EmailStatisticsService>;

    mockQueue = {} as jest.Mocked<EmailQueueService>;
    mockRateLimiter = {} as jest.Mocked<EmailRateLimiterService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        { provide: LoggerService, useValue: mockLogger },
        { provide: ConfigService, useValue: mockConfig },
        { provide: EmailValidatorService, useValue: mockValidator },
        { provide: EmailSenderService, useValue: mockSender },
        { provide: EmailStatisticsService, useValue: mockStatistics },
        { provide: EmailQueueService, useValue: mockQueue },
        { provide: EmailRateLimiterService, useValue: mockRateLimiter },
      ],
    }).compile();

    service = module.get<EmailService>(EmailService);
  });

  describe('sendAlertEmail', () => {
    const alertData: AlertEmailData = {
      severity: 'high',
      category: 'security',
      alertId: 'alert-123',
      timestamp: new Date(),
      title: 'Security Alert',
      message: 'Suspicious activity detected',
    };

    it('should send alert email successfully', async () => {
      const result = await service.sendAlertEmail('admin@example.com', alertData);

      expect(result.success).toBe(true);
      expect(mockSender.sendAlertEmail).toHaveBeenCalledWith(
        ['admin@example.com'],
        expect.stringContaining('Security Alert'),
        expect.objectContaining({
          severity: 'high',
          title: 'Security Alert',
        })
      );
    });

    it('should validate email before sending', async () => {
      await service.sendAlertEmail('admin@example.com', alertData);

      expect(mockValidator.validateEmail).toHaveBeenCalledWith('admin@example.com');
    });

    it('should throw error for invalid email', async () => {
      mockValidator.validateEmail = jest
        .fn()
        .mockReturnValue({ valid: false, reason: 'Invalid format' });

      await expect(
        service.sendAlertEmail('invalid-email', alertData)
      ).rejects.toThrow('Invalid email address');
    });
  });

  describe('sendEmail', () => {
    const emailData: GenericEmailData = {
      subject: 'Test Subject',
      body: 'Test body',
      html: '<p>Test body</p>',
    };

    it('should send generic email', async () => {
      const result = await service.sendEmail('user@example.com', emailData);

      expect(result.success).toBe(true);
      expect(mockSender.sendGenericEmail).toHaveBeenCalledWith(
        ['user@example.com'],
        'Test Subject',
        'Test body',
        '<p>Test body</p>'
      );
    });
  });

  describe('sendBulkEmail', () => {
    const emailData: GenericEmailData = {
      subject: 'Bulk Email',
      body: 'Test body',
    };

    it('should send bulk emails to multiple recipients', async () => {
      const recipients = ['user1@example.com', 'user2@example.com', 'user3@example.com'];

      const results = await service.sendBulkEmail(recipients, emailData);

      expect(results).toHaveLength(3);
      expect(mockValidator.getValidationSummary).toHaveBeenCalledWith(recipients);
    });

    it('should filter out invalid emails', async () => {
      mockValidator.getValidationSummary = jest.fn().mockReturnValue({
        valid: 2,
        invalid: 1,
        validEmails: ['user1@example.com', 'user2@example.com'],
      });

      const recipients = [
        'user1@example.com',
        'invalid-email',
        'user2@example.com',
      ];

      const results = await service.sendBulkEmail(recipients, emailData);

      expect(results).toHaveLength(2);
      expect(mockLogger.warn).toHaveBeenCalledWith(
        expect.stringContaining('1 invalid emails')
      );
    });

    it('should split into batches', async () => {
      const recipients = Array.from({ length: 150 }, (_, i) => `user${i}@example.com`);

      mockValidator.getValidationSummary = jest.fn().mockReturnValue({
        valid: 150,
        invalid: 0,
        validEmails: recipients,
      });

      await service.sendBulkEmail(recipients, emailData);

      // Should be called 150 times (once per recipient)
      expect(mockSender.sendGenericEmail).toHaveBeenCalledTimes(150);
    });

    it('should handle send failures gracefully', async () => {
      mockSender.sendGenericEmail = jest
        .fn()
        .mockRejectedValueOnce(new Error('Send failed'))
        .mockResolvedValue(mockDeliveryResult);

      const recipients = ['user1@example.com', 'user2@example.com'];

      mockValidator.getValidationSummary = jest.fn().mockReturnValue({
        valid: 2,
        invalid: 0,
        validEmails: recipients,
      });

      const results = await service.sendBulkEmail(recipients, emailData);

      expect(results).toHaveLength(2);
      expect(results[0].success).toBe(false);
      expect(results[1].success).toBe(true);
    });
  });

  describe('sendBatchEmails', () => {
    it('should send personalized emails', async () => {
      const emails = [
        { to: 'user1@example.com', data: { subject: 'Hello User 1', body: 'Body 1' } },
        { to: 'user2@example.com', data: { subject: 'Hello User 2', body: 'Body 2' } },
      ];

      const results = await service.sendBatchEmails(emails);

      expect(results).toHaveLength(2);
      expect(mockSender.sendGenericEmail).toHaveBeenCalledTimes(2);
    });

    it('should handle individual failures', async () => {
      mockSender.sendGenericEmail = jest
        .fn()
        .mockRejectedValueOnce(new Error('Failed'))
        .mockResolvedValue(mockDeliveryResult);

      const emails = [
        { to: 'user1@example.com', data: { subject: 'Test 1', body: 'Body 1' } },
        { to: 'user2@example.com', data: { subject: 'Test 2', body: 'Body 2' } },
      ];

      const results = await service.sendBatchEmails(emails);

      expect(results[0].success).toBe(false);
      expect(results[1].success).toBe(true);
    });
  });

  describe('testConnection', () => {
    it('should test email connection', async () => {
      const result = await service.testConnection('test@example.com');

      expect(result).toBe(true);
      expect(mockSender.testConnection).toHaveBeenCalledWith('test@example.com');
    });

    it('should return false on connection failure', async () => {
      mockSender.testConnection = jest.fn().mockResolvedValue(false);

      const result = await service.testConnection('test@example.com');

      expect(result).toBe(false);
    });
  });

  describe('validateEmail', () => {
    it('should validate email address', () => {
      const result = service.validateEmail('test@example.com');

      expect(result.valid).toBe(true);
      expect(mockValidator.validateEmail).toHaveBeenCalledWith('test@example.com');
    });
  });

  describe('getStatistics', () => {
    it('should return email statistics', () => {
      const stats = service.getStatistics();

      expect(stats).toBeDefined();
      expect(stats.sent).toBe(100);
      expect(mockStatistics.getStatistics).toHaveBeenCalled();
    });
  });

  describe('close', () => {
    it('should close email service', async () => {
      await service.close();

      expect(mockSender.close).toHaveBeenCalled();
    });
  });

  describe('configuration', () => {
    it('should initialize with queue enabled', () => {
      expect(mockConfig.get).toHaveBeenCalledWith('EMAIL_QUEUE_ENABLED', true);
    });

    it('should detect production environment', async () => {
      mockConfig.get = jest.fn((key: string) => {
        if (key === 'NODE_ENV') return 'production';
        if (key === 'EMAIL_QUEUE_ENABLED') return true;
        return undefined;
      });

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          EmailService,
          { provide: LoggerService, useValue: mockLogger },
          { provide: ConfigService, useValue: mockConfig },
          { provide: EmailValidatorService, useValue: mockValidator },
          { provide: EmailSenderService, useValue: mockSender },
          { provide: EmailStatisticsService, useValue: mockStatistics },
          { provide: EmailQueueService, useValue: mockQueue },
          { provide: EmailRateLimiterService, useValue: mockRateLimiter },
        ],
      }).compile();

      const prodService = module.get<EmailService>(EmailService);
      expect(prodService).toBeDefined();
    });
  });
});
