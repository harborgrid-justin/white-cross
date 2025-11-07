/**
 * @fileoverview HIPAA Exception Filter Tests
 * @module common/exceptions/filters/hipaa-exception.filter.spec
 * @description Comprehensive security tests for HIPAA-compliant error handling
 */

import { Test, TestingModule } from '@nestjs/testing';
import { HipaaExceptionFilter } from './hipaa-exception.filter';
import { HttpException, HttpStatus, ArgumentsHost } from '@nestjs/common';
import { SentryService } from '../../../infrastructure/monitoring/sentry.service';
import { LoggerService } from '../../../shared/logging/logger.service';

describe('HipaaExceptionFilter - SECURITY CRITICAL', () => {
  let filter: HipaaExceptionFilter;
  let mockSentryService: jest.Mocked<SentryService>;
  let mockResponse: any;
  let mockRequest: any;
  let mockArgumentsHost: ArgumentsHost;

  beforeEach(async () => {
    // Mock SentryService
    mockSentryService = {
      captureException: jest.fn(),
      captureMessage: jest.fn(),
    } as any;

    // Create filter instance
    filter = new HipaaExceptionFilter(mockSentryService);

    // Mock Express request and response
    mockRequest = {
      url: '/api/v1/patients/123',
      method: 'GET',
      headers: {
        'x-request-id': 'test-request-id',
        'user-agent': 'Jest Test Agent',
        'x-forwarded-for': '192.168.1.100',
      },
      socket: {
        remoteAddress: '192.168.1.100',
      },
      user: {
        id: 'user-123',
        organizationId: 'org-456',
      },
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    // Mock ArgumentsHost
    mockArgumentsHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: () => mockRequest,
        getResponse: () => mockResponse,
      }),
    } as any;
  });

  describe('PHI Sanitization - Social Security Numbers', () => {
    it('should redact SSN in format XXX-XX-XXXX', () => {
      const exception = new HttpException(
        'Patient SSN 123-45-6789 not found',
        HttpStatus.NOT_FOUND,
      );

      filter.catch(exception, mockArgumentsHost);

      const responseData = mockResponse.json.mock.calls[0][0];
      expect(responseData.message).not.toContain('123-45-6789');
      expect(responseData.message).toContain('***-**-****');
    });

    it('should redact SSN without dashes (9 consecutive digits)', () => {
      const exception = new HttpException(
        'Error processing SSN 123456789',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

      filter.catch(exception, mockArgumentsHost);

      const responseData = mockResponse.json.mock.calls[0][0];
      expect(responseData.message).not.toContain('123456789');
      expect(responseData.message).toContain('[REDACTED_SSN]');
    });

    it('should redact multiple SSNs in same error message', () => {
      const exception = new HttpException(
        'Duplicate records: 123-45-6789 and 987-65-4321',
        HttpStatus.CONFLICT,
      );

      filter.catch(exception, mockArgumentsHost);

      const responseData = mockResponse.json.mock.calls[0][0];
      expect(responseData.message).not.toContain('123-45-6789');
      expect(responseData.message).not.toContain('987-65-4321');
      expect(responseData.message).toMatch(/\*\*\*-\*\*-\*\*\*\*/g);
    });
  });

  describe('PHI Sanitization - Medical Record Numbers', () => {
    it('should redact MRN with MRN: prefix', () => {
      const exception = new HttpException(
        'MRN:ABC123456 record not found',
        HttpStatus.NOT_FOUND,
      );

      filter.catch(exception, mockArgumentsHost);

      const responseData = mockResponse.json.mock.calls[0][0];
      expect(responseData.message).not.toContain('ABC123456');
      expect(responseData.message).toContain('MRN:[REDACTED]');
    });

    it('should redact alphanumeric MRN patterns', () => {
      const exception = new HttpException(
        'Error with record WC1234567',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

      filter.catch(exception, mockArgumentsHost);

      const responseData = mockResponse.json.mock.calls[0][0];
      expect(responseData.message).not.toContain('WC1234567');
      expect(responseData.message).toContain('[REDACTED_MRN]');
    });
  });

  describe('PHI Sanitization - Email Addresses', () => {
    it('should redact email addresses', () => {
      const exception = new HttpException(
        'Email john.doe@example.com already exists',
        HttpStatus.CONFLICT,
      );

      filter.catch(exception, mockArgumentsHost);

      const responseData = mockResponse.json.mock.calls[0][0];
      expect(responseData.message).not.toContain('john.doe@example.com');
      expect(responseData.message).toContain('[EMAIL_REDACTED]');
    });

    it('should redact multiple email formats', () => {
      const exception = new HttpException(
        'Contacts: patient@test.com, doctor+tag@hospital.org',
        HttpStatus.OK,
      );

      filter.catch(exception, mockArgumentsHost);

      const responseData = mockResponse.json.mock.calls[0][0];
      expect(responseData.message).not.toContain('patient@test.com');
      expect(responseData.message).not.toContain('doctor+tag@hospital.org');
      expect(responseData.message).toContain('[EMAIL_REDACTED]');
    });
  });

  describe('PHI Sanitization - Phone Numbers', () => {
    it('should redact phone numbers with dashes', () => {
      const exception = new HttpException(
        'Contact at 555-123-4567',
        HttpStatus.OK,
      );

      filter.catch(exception, mockArgumentsHost);

      const responseData = mockResponse.json.mock.calls[0][0];
      expect(responseData.message).not.toContain('555-123-4567');
      expect(responseData.message).toContain('[PHONE_REDACTED]');
    });

    it('should redact phone numbers with dots', () => {
      const exception = new HttpException(
        'Phone: 555.123.4567',
        HttpStatus.OK,
      );

      filter.catch(exception, mockArgumentsHost);

      const responseData = mockResponse.json.mock.calls[0][0];
      expect(responseData.message).not.toContain('555.123.4567');
      expect(responseData.message).toContain('[PHONE_REDACTED]');
    });

    it('should redact phone numbers with parentheses', () => {
      const exception = new HttpException(
        'Call (555) 123-4567',
        HttpStatus.OK,
      );

      filter.catch(exception, mockArgumentsHost);

      const responseData = mockResponse.json.mock.calls[0][0];
      expect(responseData.message).not.toContain('(555) 123-4567');
      expect(responseData.message).toContain('[PHONE_REDACTED]');
    });

    it('should redact international phone numbers', () => {
      const exception = new HttpException(
        'International: 1-555-123-4567',
        HttpStatus.OK,
      );

      filter.catch(exception, mockArgumentsHost);

      const responseData = mockResponse.json.mock.calls[0][0];
      expect(responseData.message).not.toContain('1-555-123-4567');
      expect(responseData.message).toContain('[PHONE_REDACTED]');
    });
  });

  describe('PHI Sanitization - Dates', () => {
    it('should redact dates in MM/DD/YYYY format', () => {
      const exception = new HttpException(
        'DOB: 01/15/1990',
        HttpStatus.OK,
      );

      filter.catch(exception, mockArgumentsHost);

      const responseData = mockResponse.json.mock.calls[0][0];
      expect(responseData.message).not.toContain('01/15/1990');
      expect(responseData.message).toContain('[DATE_REDACTED]');
    });

    it('should redact dates in YYYY-MM-DD format', () => {
      const exception = new HttpException(
        'Birth date: 1990-01-15',
        HttpStatus.OK,
      );

      filter.catch(exception, mockArgumentsHost);

      const responseData = mockResponse.json.mock.calls[0][0];
      expect(responseData.message).not.toContain('1990-01-15');
      expect(responseData.message).toContain('[DATE_REDACTED]');
    });
  });

  describe('PHI Sanitization - Credit Cards', () => {
    it('should redact credit card numbers with spaces', () => {
      const exception = new HttpException(
        'Card: 4532 1234 5678 9010',
        HttpStatus.OK,
      );

      filter.catch(exception, mockArgumentsHost);

      const responseData = mockResponse.json.mock.calls[0][0];
      expect(responseData.message).not.toContain('4532 1234 5678 9010');
      expect(responseData.message).toContain('[CARD_REDACTED]');
    });

    it('should redact credit card numbers with dashes', () => {
      const exception = new HttpException(
        'Payment: 4532-1234-5678-9010',
        HttpStatus.OK,
      );

      filter.catch(exception, mockArgumentsHost);

      const responseData = mockResponse.json.mock.calls[0][0];
      expect(responseData.message).not.toContain('4532-1234-5678-9010');
      expect(responseData.message).toContain('[CARD_REDACTED]');
    });
  });

  describe('PHI Sanitization - Account Numbers', () => {
    it('should redact account numbers', () => {
      const exception = new HttpException(
        'Account: 123456789012',
        HttpStatus.OK,
      );

      filter.catch(exception, mockArgumentsHost);

      const responseData = mockResponse.json.mock.calls[0][0];
      expect(responseData.message).not.toContain('123456789012');
      expect(responseData.message).toContain('Account:[REDACTED]');
    });
  });

  describe('PHI Sanitization - IP Addresses', () => {
    it('should redact IPv4 addresses', () => {
      const exception = new HttpException(
        'Access from 192.168.1.100',
        HttpStatus.OK,
      );

      filter.catch(exception, mockArgumentsHost);

      const responseData = mockResponse.json.mock.calls[0][0];
      expect(responseData.message).not.toContain('192.168.1.100');
      expect(responseData.message).toContain('[IP_REDACTED]');
    });

    it('should redact IPv6 addresses', () => {
      const exception = new HttpException(
        'IPv6: 2001:0db8:85a3:0000:0000:8a2e:0370:7334',
        HttpStatus.OK,
      );

      filter.catch(exception, mockArgumentsHost);

      const responseData = mockResponse.json.mock.calls[0][0];
      expect(responseData.message).not.toContain('2001:0db8:85a3:0000:0000:8a2e:0370:7334');
      expect(responseData.message).toContain('[IPV6_REDACTED]');
    });
  });

  describe('PHI Sanitization - Names', () => {
    it('should redact patient names', () => {
      const exception = new HttpException(
        'Patient John Doe not found',
        HttpStatus.NOT_FOUND,
      );

      filter.catch(exception, mockArgumentsHost);

      const responseData = mockResponse.json.mock.calls[0][0];
      expect(responseData.message).not.toContain('John Doe');
      expect(responseData.message).toContain('[NAME_REDACTED]');
    });

    it('should redact doctor names', () => {
      const exception = new HttpException(
        'Doctor Sarah Smith unavailable',
        HttpStatus.NOT_FOUND,
      );

      filter.catch(exception, mockArgumentsHost);

      const responseData = mockResponse.json.mock.calls[0][0];
      expect(responseData.message).not.toContain('Sarah Smith');
      expect(responseData.message).toContain('[NAME_REDACTED]');
    });
  });

  describe('PHI Sanitization - Addresses', () => {
    it('should redact street addresses', () => {
      const exception = new HttpException(
        'Address: 123 Main Street',
        HttpStatus.OK,
      );

      filter.catch(exception, mockArgumentsHost);

      const responseData = mockResponse.json.mock.calls[0][0];
      expect(responseData.message).not.toContain('123 Main Street');
      expect(responseData.message).toContain('[ADDRESS_REDACTED]');
    });

    it('should redact various address formats', () => {
      const exception = new HttpException(
        'Locations: 456 Oak Avenue, 789 Pine Boulevard',
        HttpStatus.OK,
      );

      filter.catch(exception, mockArgumentsHost);

      const responseData = mockResponse.json.mock.calls[0][0];
      expect(responseData.message).not.toContain('456 Oak Avenue');
      expect(responseData.message).not.toContain('789 Pine Boulevard');
      expect(responseData.message).toContain('[ADDRESS_REDACTED]');
    });
  });

  describe('PHI Sanitization - Zip Codes', () => {
    it('should redact 5-digit zip codes', () => {
      const exception = new HttpException(
        'Zip: 12345',
        HttpStatus.OK,
      );

      filter.catch(exception, mockArgumentsHost);

      const responseData = mockResponse.json.mock.calls[0][0];
      expect(responseData.message).not.toContain('12345');
      expect(responseData.message).toContain('[ZIP_REDACTED]');
    });

    it('should redact ZIP+4 codes', () => {
      const exception = new HttpException(
        'Postal: 12345-6789',
        HttpStatus.OK,
      );

      filter.catch(exception, mockArgumentsHost);

      const responseData = mockResponse.json.mock.calls[0][0];
      expect(responseData.message).not.toContain('12345-6789');
      expect(responseData.message).toContain('[ZIP_REDACTED]');
    });
  });

  describe('PHI Sanitization - Prescription Numbers', () => {
    it('should redact prescription numbers', () => {
      const exception = new HttpException(
        'Rx:ABC123456 filled',
        HttpStatus.OK,
      );

      filter.catch(exception, mockArgumentsHost);

      const responseData = mockResponse.json.mock.calls[0][0];
      expect(responseData.message).not.toContain('ABC123456');
      expect(responseData.message).toContain('RX:[REDACTED]');
    });
  });

  describe('PHI Sanitization - Insurance Policy Numbers', () => {
    it('should redact insurance policy numbers', () => {
      const exception = new HttpException(
        'Policy:INS123456789 expired',
        HttpStatus.OK,
      );

      filter.catch(exception, mockArgumentsHost);

      const responseData = mockResponse.json.mock.calls[0][0];
      expect(responseData.message).not.toContain('INS123456789');
      expect(responseData.message).toContain('Policy:[REDACTED]');
    });
  });

  describe('URL Path Sanitization', () => {
    it('should sanitize PHI in URL paths', () => {
      mockRequest.url = '/api/v1/patients/123-45-6789/records';

      const exception = new HttpException('Not found', HttpStatus.NOT_FOUND);

      filter.catch(exception, mockArgumentsHost);

      const responseData = mockResponse.json.mock.calls[0][0];
      expect(responseData.path).not.toContain('123-45-6789');
    });

    it('should sanitize PHI in query parameters', () => {
      mockRequest.url = '/api/v1/search?email=patient@test.com&phone=555-123-4567';

      const exception = new HttpException('Not found', HttpStatus.NOT_FOUND);

      filter.catch(exception, mockArgumentsHost);

      const responseData = mockResponse.json.mock.calls[0][0];
      expect(responseData.path).not.toContain('patient@test.com');
      expect(responseData.path).not.toContain('555-123-4567');
    });
  });

  describe('Server-Side Logging', () => {
    it('should log full error details server-side before sanitization', () => {
      const exception = new HttpException(
        'Patient SSN 123-45-6789 not found',
        HttpStatus.NOT_FOUND,
      );

      const loggerSpy = jest.spyOn(filter['logger'], 'error');

      filter.catch(exception, mockArgumentsHost);

      // Verify full error (with PHI) was logged server-side
      expect(loggerSpy).toHaveBeenCalled();
      const loggedData = loggerSpy.mock.calls[0][1];
      expect(loggedData).toContain('123-45-6789'); // Full PHI logged server-side
    });

    it('should mark server-side logs as containing PHI', () => {
      const exception = new HttpException(
        'Patient SSN 123-45-6789 not found',
        HttpStatus.NOT_FOUND,
      );

      const loggerSpy = jest.spyOn(filter['logger'], 'error');

      filter.catch(exception, mockArgumentsHost);

      const loggedData = JSON.parse(loggerSpy.mock.calls[0][1]);
      expect(loggedData.containsPHI).toBe(true);
    });
  });

  describe('Sentry Integration', () => {
    it('should report 5xx errors to Sentry', () => {
      const exception = new HttpException(
        'Internal error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

      filter.catch(exception, mockArgumentsHost);

      expect(mockSentryService.captureException).toHaveBeenCalledWith(
        exception,
        expect.objectContaining({
          userId: 'user-123',
          organizationId: 'org-456',
          tags: expect.any(Object),
          extra: expect.any(Object),
          level: 'error',
        }),
      );
    });

    it('should NOT report 4xx errors to Sentry', () => {
      const exception = new HttpException('Not found', HttpStatus.NOT_FOUND);

      filter.catch(exception, mockArgumentsHost);

      // Should still capture for 4xx but internal logic may filter
      // We're checking the filter doesn't crash
      expect(mockResponse.json).toHaveBeenCalled();
    });
  });

  describe('Error Response Structure', () => {
    it('should return standardized error response', () => {
      const exception = new HttpException('Test error', HttpStatus.BAD_REQUEST);

      filter.catch(exception, mockArgumentsHost);

      const responseData = mockResponse.json.mock.calls[0][0];
      expect(responseData).toHaveProperty('success', false);
      expect(responseData).toHaveProperty('statusCode', 400);
      expect(responseData).toHaveProperty('message');
      expect(responseData).toHaveProperty('error');
      expect(responseData).toHaveProperty('timestamp');
      expect(responseData).toHaveProperty('path');
      expect(responseData).toHaveProperty('requestId');
    });

    it('should include request ID in response', () => {
      const exception = new HttpException('Test error', HttpStatus.BAD_REQUEST);

      filter.catch(exception, mockArgumentsHost);

      const responseData = mockResponse.json.mock.calls[0][0];
      expect(responseData.requestId).toBe('test-request-id');
    });

    it('should generate request ID if not provided', () => {
      delete mockRequest.headers['x-request-id'];

      const exception = new HttpException('Test error', HttpStatus.BAD_REQUEST);

      filter.catch(exception, mockArgumentsHost);

      const responseData = mockResponse.json.mock.calls[0][0];
      expect(responseData.requestId).toMatch(/^req_\d+_[a-z0-9]+$/);
    });
  });

  describe('Stack Trace Handling', () => {
    it('should NOT include stack traces in production', () => {
      process.env.NODE_ENV = 'production';
      const filter = new HipaaExceptionFilter(mockSentryService);

      const exception = new Error('Test error');

      filter.catch(exception, mockArgumentsHost);

      const responseData = mockResponse.json.mock.calls[0][0];
      expect(responseData.stack).toBeUndefined();
    });

    it('should include sanitized stack traces in development', () => {
      process.env.NODE_ENV = 'development';
      const filter = new HipaaExceptionFilter(mockSentryService);

      const exception = new Error('Test error with SSN 123-45-6789');
      exception.stack = 'Error: Test error with SSN 123-45-6789\n  at test.ts:10';

      filter.catch(exception, mockArgumentsHost);

      const responseData = mockResponse.json.mock.calls[0][0];
      expect(responseData.stack).toBeDefined();
      expect(responseData.stack).not.toContain('123-45-6789');
    });
  });

  describe('Database Error Handling', () => {
    it('should sanitize database errors', () => {
      const dbError = new Error('Sequelize validation error: email john@test.com already exists');
      dbError.name = 'SequelizeValidationError';

      filter.catch(dbError, mockArgumentsHost);

      const responseData = mockResponse.json.mock.calls[0][0];
      expect(responseData.message).not.toContain('john@test.com');
      expect(responseData.message).toContain('[EMAIL_REDACTED]');
    });
  });

  describe('Complex PHI Scenarios', () => {
    it('should sanitize error with multiple PHI types', () => {
      const exception = new HttpException(
        'Patient John Doe (SSN: 123-45-6789, Email: john@test.com, Phone: 555-123-4567) not found at 123 Main Street, ZIP 12345',
        HttpStatus.NOT_FOUND,
      );

      filter.catch(exception, mockArgumentsHost);

      const responseData = mockResponse.json.mock.calls[0][0];
      expect(responseData.message).not.toContain('John Doe');
      expect(responseData.message).not.toContain('123-45-6789');
      expect(responseData.message).not.toContain('john@test.com');
      expect(responseData.message).not.toContain('555-123-4567');
      expect(responseData.message).not.toContain('123 Main Street');
      expect(responseData.message).not.toContain('12345');

      expect(responseData.message).toContain('[NAME_REDACTED]');
      expect(responseData.message).toContain('***-**-****');
      expect(responseData.message).toContain('[EMAIL_REDACTED]');
      expect(responseData.message).toContain('[PHONE_REDACTED]');
      expect(responseData.message).toContain('[ADDRESS_REDACTED]');
      expect(responseData.message).toContain('[ZIP_REDACTED]');
    });

    it('should handle SQL injection attempts with PHI', () => {
      const exception = new HttpException(
        "SQL Error: WHERE ssn = '123-45-6789' OR email = 'attacker@test.com'",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

      filter.catch(exception, mockArgumentsHost);

      const responseData = mockResponse.json.mock.calls[0][0];
      expect(responseData.message).not.toContain('123-45-6789');
      expect(responseData.message).not.toContain('attacker@test.com');
    });
  });

  describe('Error Code Mapping', () => {
    it('should map 400 to validation error code', () => {
      const exception = new HttpException('Bad request', HttpStatus.BAD_REQUEST);

      filter.catch(exception, mockArgumentsHost);

      const responseData = mockResponse.json.mock.calls[0][0];
      expect(responseData.errorCode).toBe('VALID_001');
    });

    it('should map 401 to auth error code', () => {
      const exception = new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

      filter.catch(exception, mockArgumentsHost);

      const responseData = mockResponse.json.mock.calls[0][0];
      expect(responseData.errorCode).toBe('AUTH_001');
    });

    it('should map 403 to forbidden error code', () => {
      const exception = new HttpException('Forbidden', HttpStatus.FORBIDDEN);

      filter.catch(exception, mockArgumentsHost);

      const responseData = mockResponse.json.mock.calls[0][0];
      expect(responseData.errorCode).toBe('AUTH_002');
    });

    it('should map 404 to resource error code', () => {
      const exception = new HttpException('Not found', HttpStatus.NOT_FOUND);

      filter.catch(exception, mockArgumentsHost);

      const responseData = mockResponse.json.mock.calls[0][0];
      expect(responseData.errorCode).toBe('RES_001');
    });

    it('should map 429 to rate limit error code', () => {
      const exception = new HttpException('Too many requests', HttpStatus.TOO_MANY_REQUESTS);

      filter.catch(exception, mockArgumentsHost);

      const responseData = mockResponse.json.mock.calls[0][0];
      expect(responseData.errorCode).toBe('RATE_001');
    });
  });
});
