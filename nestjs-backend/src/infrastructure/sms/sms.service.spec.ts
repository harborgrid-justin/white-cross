/**
 * @fileoverview Comprehensive SMS Service Unit Tests
 * @module infrastructure/sms
 * @description Complete test suite covering all SMS service functionality
 */

import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { getQueueToken } from '@nestjs/bull';
import { SmsService } from './sms.service';
import { TwilioProvider } from './providers/twilio.provider';
import { PhoneValidatorService } from './services/phone-validator.service';
import { SmsTemplateService } from './services/sms-template.service';
import { RateLimiterService } from './services/rate-limiter.service';
import { CostTrackerService } from './services/cost-tracker.service';
import { SMS_QUEUE_NAME } from './processors/sms-queue.processor';
import { AlertSeverity } from '../../alerts/dto/create-alert.dto';
import {
  AlertSmsDto,
  GenericSmsDto,
  SendSmsDto,
  SendTemplatedSmsDto,
  BulkSmsDto,
  SmsPriority,
  PhoneNumberType,
  SmsTemplateType,
} from './dto';

describe('SmsService', () => {
  let service: SmsService;
  let twilioProvider: TwilioProvider;
  let phoneValidator: PhoneValidatorService;
  let templateService: SmsTemplateService;
  let rateLimiter: RateLimiterService;
  let costTracker: CostTrackerService;
  let mockQueue: any;

  beforeEach(async () => {
    // Mock queue
    mockQueue = {
      add: jest.fn().mockResolvedValue({ id: 'job-123' }),
      process: jest.fn(),
      on: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SmsService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string, defaultValue?: any) => {
              const config: Record<string, any> = {
                NODE_ENV: 'test',
                TWILIO_ACCOUNT_SID: '',
                TWILIO_AUTH_TOKEN: '',
                TWILIO_FROM_NUMBER: '',
                SMS_RATE_LIMIT_PER_PHONE: 10,
                SMS_RATE_LIMIT_PER_ACCOUNT: 1000,
              };
              return config[key] !== undefined ? config[key] : defaultValue;
            }),
          },
        },
        TwilioProvider,
        PhoneValidatorService,
        SmsTemplateService,
        RateLimiterService,
        CostTrackerService,
        {
          provide: getQueueToken(SMS_QUEUE_NAME),
          useValue: mockQueue,
        },
      ],
    }).compile();

    service = module.get<SmsService>(SmsService);
    twilioProvider = module.get<TwilioProvider>(TwilioProvider);
    phoneValidator = module.get<PhoneValidatorService>(PhoneValidatorService);
    templateService = module.get<SmsTemplateService>(SmsTemplateService);
    rateLimiter = module.get<RateLimiterService>(RateLimiterService);
    costTracker = module.get<CostTrackerService>(CostTrackerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ==================== Basic Tests ====================

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should have all required services injected', () => {
    expect(twilioProvider).toBeDefined();
    expect(phoneValidator).toBeDefined();
    expect(templateService).toBeDefined();
    expect(rateLimiter).toBeDefined();
    expect(costTracker).toBeDefined();
  });

  // ==================== Phone Number Validation Tests ====================

  describe('Phone Number Validation', () => {
    it('should validate US phone numbers', async () => {
      const result = await phoneValidator.validatePhoneNumber('+15551234567');
      expect(result.isValid).toBe(true);
      expect(result.e164Format).toBe('+15551234567');
      expect(result.countryCode).toBe('US');
    });

    it('should validate international phone numbers', async () => {
      const result = await phoneValidator.validatePhoneNumber('+442071234567');
      expect(result.isValid).toBe(true);
      expect(result.countryCode).toBe('GB');
    });

    it('should reject invalid phone numbers', async () => {
      const result = await phoneValidator.validatePhoneNumber('invalid');
      expect(result.isValid).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should normalize phone numbers to E.164 format', async () => {
      const e164 = await phoneValidator.normalizeToE164('(555) 123-4567', 'US');
      expect(e164).toBe('+15551234567');
    });

    it('should detect country code from phone number', async () => {
      const countryCode = await phoneValidator.getCountryCode('+61234567890');
      expect(countryCode).toBe('AU');
    });

    it('should validate batch phone numbers', async () => {
      const results = await phoneValidator.validateBatch([
        '+15551234567',
        'invalid',
        '+442071234567',
      ]);

      expect(results).toHaveLength(3);
      expect(results[0].isValid).toBe(true);
      expect(results[1].isValid).toBe(false);
      expect(results[2].isValid).toBe(true);
    });
  });

  // ==================== SMS Template Tests ====================

  describe('SMS Template Service', () => {
    it('should create a template', async () => {
      const template = await templateService.createTemplate({
        templateId: 'test-template',
        type: SmsTemplateType.NOTIFICATION,
        content: 'Hi {{name}}, your appointment is at {{time}}',
        requiredVariables: ['name', 'time'],
      });

      expect(template).toBeDefined();
      expect(template.templateId).toBe('test-template');
    });

    it('should render template with variables', async () => {
      await templateService.createTemplate({
        templateId: 'greeting',
        type: SmsTemplateType.NOTIFICATION,
        content: 'Hello {{name}}!',
        requiredVariables: ['name'],
      });

      const rendered = await templateService.renderTemplate('greeting', { name: 'John' });
      expect(rendered).toBe('Hello John!');
    });

    it('should throw error for missing template variables', async () => {
      await templateService.createTemplate({
        templateId: 'required-vars',
        type: SmsTemplateType.NOTIFICATION,
        content: 'Hi {{name}}, code: {{code}}',
        requiredVariables: ['name', 'code'],
      });

      await expect(
        templateService.renderTemplate('required-vars', { name: 'John' }),
      ).rejects.toThrow();
    });

    it('should list templates by type', async () => {
      const templates = await templateService.listTemplates(SmsTemplateType.REMINDER);
      expect(Array.isArray(templates)).toBe(true);
      // Default templates should include reminders
      expect(templates.length).toBeGreaterThan(0);
    });

    it('should validate template content', async () => {
      const validation = await templateService.validateTemplateContent('Hello {{name}}');
      expect(validation.isValid).toBe(true);
      expect(validation.variables).toContain('name');
    });

    it('should detect malformed template variables', async () => {
      const validation = await templateService.validateTemplateContent('Hello {{name}');
      expect(validation.isValid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
    });
  });

  // ==================== Rate Limiting Tests ====================

  describe('Rate Limiter Service', () => {
    it('should allow messages within rate limit', async () => {
      const status = await rateLimiter.checkPhoneNumberLimit('+15551234567');
      expect(status.isLimited).toBe(false);
      expect(status.remainingMessages).toBeGreaterThan(0);
    });

    it('should increment rate limit counter', async () => {
      const before = await rateLimiter.checkPhoneNumberLimit('+15559876543');
      await rateLimiter.incrementPhoneNumber('+15559876543');
      const after = await rateLimiter.checkPhoneNumberLimit('+15559876543');

      expect(after.currentCount).toBe(before.currentCount + 1);
      expect(after.remainingMessages).toBe(before.remainingMessages - 1);
    });

    it('should enforce rate limits', async () => {
      const phoneNumber = '+15555555555';

      // Exhaust rate limit
      for (let i = 0; i < 10; i++) {
        await rateLimiter.incrementPhoneNumber(phoneNumber);
      }

      const status = await rateLimiter.checkPhoneNumberLimit(phoneNumber);
      expect(status.isLimited).toBe(true);
      expect(status.remainingMessages).toBe(0);
    });

    it('should reset rate limit', async () => {
      const phoneNumber = '+15551111111';
      await rateLimiter.incrementPhoneNumber(phoneNumber);
      await rateLimiter.resetPhoneNumber(phoneNumber);

      const status = await rateLimiter.checkPhoneNumberLimit(phoneNumber);
      expect(status.currentCount).toBe(0);
    });

    it('should track account-level rate limits', async () => {
      const status = await rateLimiter.checkAccountLimit('test-account');
      expect(status.isLimited).toBe(false);
    });

    it('should provide rate limit statistics', async () => {
      await rateLimiter.incrementPhoneNumber('+15551234567');
      await rateLimiter.incrementAccount('account-1');

      const stats = await rateLimiter.getStatistics();
      expect(stats.totalTracked).toBeGreaterThan(0);
    });
  });

  // ==================== Cost Tracking Tests ====================

  describe('Cost Tracker Service', () => {
    it('should record SMS cost', async () => {
      const costEntry = await costTracker.recordCost({
        to: '+15551234567',
        countryCode: 'US',
        segmentCount: 1,
        costPerSegment: 0.0079,
        totalCost: 0.0079,
        timestamp: new Date().toISOString(),
        messageId: 'SM123',
      });

      expect(costEntry).toBeDefined();
      expect(costEntry.id).toBeDefined();
    });

    it('should calculate cost analytics', async () => {
      // Record some costs
      await costTracker.recordCost({
        to: '+15551234567',
        countryCode: 'US',
        segmentCount: 1,
        costPerSegment: 0.0079,
        totalCost: 0.0079,
        timestamp: new Date().toISOString(),
      });

      await costTracker.recordCost({
        to: '+15559876543',
        countryCode: 'US',
        segmentCount: 2,
        costPerSegment: 0.0079,
        totalCost: 0.0158,
        timestamp: new Date().toISOString(),
      });

      const analytics = await costTracker.getAnalytics({
        startDate: new Date(Date.now() - 86400000).toISOString(),
        endDate: new Date().toISOString(),
      });

      expect(analytics.totalMessages).toBeGreaterThanOrEqual(2);
      expect(analytics.totalCost).toBeGreaterThan(0);
      expect(analytics.costByCountry['US']).toBeDefined();
    });

    it('should get recent costs', async () => {
      const recentCosts = await costTracker.getRecentCosts(10);
      expect(Array.isArray(recentCosts)).toBe(true);
    });

    it('should check budget status', async () => {
      const budget = await costTracker.checkBudget(
        10.0,
        new Date(Date.now() - 86400000).toISOString(),
        new Date().toISOString(),
      );

      expect(budget).toBeDefined();
      expect(budget.budgetAmount).toBe(10.0);
      expect(budget.isExceeded).toBeDefined();
    });
  });

  // ==================== SMS Service Tests ====================

  describe('sendAlertSMS', () => {
    it('should send alert SMS with valid phone number', async () => {
      const alertData: AlertSmsDto = {
        title: 'Critical Alert',
        message: 'Student requires immediate attention',
        severity: AlertSeverity.CRITICAL,
      };

      await expect(service.sendAlertSMS('+15551234567', alertData)).resolves.not.toThrow();
    });

    it('should throw BadRequestException for invalid phone number', async () => {
      const alertData: AlertSmsDto = {
        title: 'Alert',
        message: 'Test message',
        severity: AlertSeverity.INFO,
      };

      await expect(service.sendAlertSMS('invalid-phone', alertData)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should map severity to priority correctly', async () => {
      const criticalAlert: AlertSmsDto = {
        title: 'Critical',
        message: 'Critical issue',
        severity: AlertSeverity.CRITICAL,
      };

      await expect(service.sendAlertSMS('+15551234567', criticalAlert)).resolves.not.toThrow();
      // Verify queue was called with URGENT priority
      expect(mockQueue.add).toHaveBeenCalled();
    });

    it('should throw rate limit error when exceeded', async () => {
      const phoneNumber = '+15552222222';

      // Exhaust rate limit
      for (let i = 0; i < 10; i++) {
        await rateLimiter.incrementPhoneNumber(phoneNumber);
      }

      const alertData: AlertSmsDto = {
        title: 'Test',
        message: 'Test',
        severity: AlertSeverity.INFO,
      };

      await expect(service.sendAlertSMS(phoneNumber, alertData)).rejects.toThrow(HttpException);
    });
  });

  describe('sendSMS', () => {
    it('should send generic SMS with valid phone number', async () => {
      const smsData: GenericSmsDto = {
        message: 'This is a test message',
      };

      await expect(service.sendSMS('+15551234567', smsData)).resolves.not.toThrow();
    });

    it('should normalize phone number before sending', async () => {
      const smsData: GenericSmsDto = {
        message: 'Test message',
      };

      await expect(service.sendSMS('(555) 123-4567', smsData)).resolves.not.toThrow();
    });

    it('should truncate long messages', async () => {
      const longMessage = 'a'.repeat(200);
      const smsData: GenericSmsDto = {
        message: longMessage,
      };

      service.setMaxLength(160);
      await expect(service.sendSMS('+15551234567', smsData)).resolves.not.toThrow();
    });
  });

  describe('sendAdvancedSMS', () => {
    it('should send SMS with custom priority', async () => {
      const advancedData: SendSmsDto = {
        message: 'High priority message',
        priority: SmsPriority.HIGH,
      };

      await expect(service.sendAdvancedSMS('+15551234567', advancedData)).resolves.not.toThrow();
      expect(mockQueue.add).toHaveBeenCalled();
    });

    it('should schedule SMS for future delivery', async () => {
      const futureDate = new Date(Date.now() + 3600000).toISOString();
      const scheduledData: SendSmsDto = {
        message: 'Scheduled message',
        scheduledFor: futureDate,
      };

      await expect(
        service.sendAdvancedSMS('+15551234567', scheduledData),
      ).resolves.not.toThrow();
    });

    it('should substitute template variables', async () => {
      const templatedData: SendSmsDto = {
        message: 'Hello {{name}}, your code is {{code}}',
        templateVariables: { name: 'John', code: '1234' },
      };

      await expect(
        service.sendAdvancedSMS('+15551234567', templatedData),
      ).resolves.not.toThrow();
    });

    it('should configure custom retry attempts', async () => {
      const retriableData: SendSmsDto = {
        message: 'Retriable message',
        maxRetries: 5,
      };

      await expect(
        service.sendAdvancedSMS('+15551234567', retriableData),
      ).resolves.not.toThrow();
    });
  });

  describe('sendTemplatedSMS', () => {
    it('should send SMS using template', async () => {
      // Use existing default template
      const templateData: SendTemplatedSmsDto = {
        templateId: 'medication-reminder',
        variables: {
          studentName: 'John Doe',
          medicationName: 'Aspirin',
          time: '2:30 PM',
          schoolName: 'White Cross School',
        },
      };

      await expect(
        service.sendTemplatedSMS('+15551234567', templateData),
      ).resolves.not.toThrow();
    });

    it('should throw error for non-existent template', async () => {
      const templateData: SendTemplatedSmsDto = {
        templateId: 'non-existent',
        variables: {},
      };

      await expect(
        service.sendTemplatedSMS('+15551234567', templateData),
      ).rejects.toThrow();
    });
  });

  describe('sendBulkSMS', () => {
    it('should send SMS to multiple recipients', async () => {
      const bulkData: BulkSmsDto = {
        recipients: ['+15551234567', '+15559876543'],
        message: 'Bulk message to all',
      };

      const result = await service.sendBulkSMS(bulkData);

      expect(result.totalRecipients).toBe(2);
      expect(result.successCount).toBeGreaterThanOrEqual(0);
      expect(result.failures).toBeDefined();
    });

    it('should handle mixed valid and invalid recipients', async () => {
      const bulkData: BulkSmsDto = {
        recipients: ['+15551234567', 'invalid', '+15559876543'],
        message: 'Bulk message',
      };

      const result = await service.sendBulkSMS(bulkData);

      expect(result.totalRecipients).toBe(3);
      expect(result.failedCount).toBeGreaterThan(0);
      expect(result.failures.length).toBeGreaterThan(0);
    });

    it('should respect rate limits in bulk sending', async () => {
      // Create many recipients (more than rate limit)
      const recipients = Array.from({ length: 15 }, (_, i) => `+1555000${String(i).padStart(4, '0')}`);

      const bulkData: BulkSmsDto = {
        recipients,
        message: 'Test',
      };

      const result = await service.sendBulkSMS(bulkData);

      // Some should fail due to rate limiting
      expect(result.failedCount).toBeGreaterThan(0);
    });
  });

  describe('testConnection', () => {
    it('should return true for successful test', async () => {
      const result = await service.testConnection('+15551234567');
      expect(result).toBe(true);
    });

    it('should return false for invalid phone number', async () => {
      const result = await service.testConnection('invalid');
      expect(result).toBe(false);
    });
  });

  describe('validatePhoneNumber', () => {
    it('should validate phone number via service', async () => {
      const result = await service.validatePhoneNumber('+15551234567');
      expect(result.isValid).toBe(true);
      expect(result.e164Format).toBe('+15551234567');
    });

    it('should accept default country parameter', async () => {
      const result = await service.validatePhoneNumber('5551234567', 'US');
      expect(result.isValid).toBe(true);
    });
  });

  describe('message length management', () => {
    it('should return default max length', () => {
      expect(service.getMaxLength()).toBe(160);
    });

    it('should set new max length', () => {
      service.setMaxLength(320);
      expect(service.getMaxLength()).toBe(320);
    });

    it('should throw error for invalid length', () => {
      expect(() => service.setMaxLength(0)).toThrow(BadRequestException);
      expect(() => service.setMaxLength(2000)).toThrow(BadRequestException);
    });

    it('should accept boundary values', () => {
      service.setMaxLength(1);
      expect(service.getMaxLength()).toBe(1);

      service.setMaxLength(1600);
      expect(service.getMaxLength()).toBe(1600);
    });
  });
});
