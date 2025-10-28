/**
 * @fileoverview SMS Service Unit Tests
 * @module infrastructure/sms
 */

import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';
import { SmsService } from './sms.service';
import { AlertSeverity } from '../../alerts/dto/create-alert.dto';
import { AlertSmsDto, GenericSmsDto } from './dto';

describe('SmsService', () => {
  let service: SmsService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SmsService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'NODE_ENV') return 'test';
              return null;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<SmsService>(SmsService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

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
        BadRequestException
      );
    });

    it('should format alert message correctly', async () => {
      const alertData: AlertSmsDto = {
        title: 'Test Alert',
        message: 'This is a test',
        severity: AlertSeverity.WARNING,
      };

      await expect(service.sendAlertSMS('+15551234567', alertData)).resolves.not.toThrow();
    });
  });

  describe('sendSMS', () => {
    it('should send generic SMS with valid phone number', async () => {
      const smsData: GenericSmsDto = {
        message: 'This is a test message',
      };

      await expect(service.sendSMS('+15551234567', smsData)).resolves.not.toThrow();
    });

    it('should throw BadRequestException for invalid phone number', async () => {
      const smsData: GenericSmsDto = {
        message: 'Test message',
      };

      await expect(service.sendSMS('123', smsData)).rejects.toThrow(BadRequestException);
    });

    it('should accept US format phone number without +1', async () => {
      const smsData: GenericSmsDto = {
        message: 'Test message',
      };

      await expect(service.sendSMS('5551234567', smsData)).resolves.not.toThrow();
    });
  });

  describe('sendBulkSMS', () => {
    it('should send SMS to multiple recipients', async () => {
      const recipients = ['+15551234567', '+15559876543', '+15555555555'];
      const smsData: GenericSmsDto = {
        message: 'Bulk message to all',
      };

      await expect(service.sendBulkSMS(recipients, smsData)).resolves.not.toThrow();
    });

    it('should throw error if any recipient has invalid phone number', async () => {
      const recipients = ['+15551234567', 'invalid', '+15555555555'];
      const smsData: GenericSmsDto = {
        message: 'Bulk message',
      };

      await expect(service.sendBulkSMS(recipients, smsData)).rejects.toThrow();
    });
  });

  describe('testConnection', () => {
    it('should return true for successful test', async () => {
      const result = await service.testConnection('+15551234567');
      expect(result).toBe(true);
    });

    it('should return false for failed test', async () => {
      const result = await service.testConnection('invalid');
      expect(result).toBe(false);
    });
  });

  describe('getMaxLength', () => {
    it('should return default max length of 160', () => {
      expect(service.getMaxLength()).toBe(160);
    });
  });

  describe('setMaxLength', () => {
    it('should set new max length', () => {
      service.setMaxLength(320);
      expect(service.getMaxLength()).toBe(320);
    });

    it('should throw BadRequestException for invalid length', () => {
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

  describe('message truncation', () => {
    it('should truncate long messages to max length', async () => {
      const longMessage = 'a'.repeat(200);
      const smsData: GenericSmsDto = {
        message: longMessage,
      };

      service.setMaxLength(160);
      await expect(service.sendSMS('+15551234567', smsData)).resolves.not.toThrow();
    });

    it('should not truncate messages within limit', async () => {
      const shortMessage = 'Short message';
      const smsData: GenericSmsDto = {
        message: shortMessage,
      };

      await expect(service.sendSMS('+15551234567', smsData)).resolves.not.toThrow();
    });
  });

  describe('phone number validation', () => {
    const validNumbers = [
      '+15551234567',
      '+442071234567',
      '+61234567890',
      '5551234567', // US format without +1
      '+15559876543',
    ];

    const invalidNumbers = [
      'invalid',
      '123',
      '+1',
      '555-123-4567', // Dashes not supported
      '(555) 123-4567', // Parentheses not supported
      '',
    ];

    validNumbers.forEach((phone) => {
      it(`should accept valid phone number: ${phone}`, async () => {
        const smsData: GenericSmsDto = { message: 'Test' };
        await expect(service.sendSMS(phone, smsData)).resolves.not.toThrow();
      });
    });

    invalidNumbers.forEach((phone) => {
      it(`should reject invalid phone number: ${phone}`, async () => {
        const smsData: GenericSmsDto = { message: 'Test' };
        await expect(service.sendSMS(phone, smsData)).rejects.toThrow(BadRequestException);
      });
    });
  });
});
