import { Test, TestingModule } from '@nestjs/testing';
import { AuditUtilsService, AUDIT_CONSTANTS } from './audit-utils.service';
import { AuditAction } from '../enums/audit-action.enum';
import { PHIAccessType } from '../enums/phi-access-type.enum';
import { PHIDataCategory } from '../enums/phi-data-category.enum';
import { IAuditLogEntry } from '../interfaces/audit-log-entry.interface';
import { IPHIAccessLog } from '../interfaces/phi-access-log.interface';
import { AuditRequest } from '../types/audit.types';

describe('AuditUtilsService', () => {
  let service: AuditUtilsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuditUtilsService],
    }).compile();

    service = module.get<AuditUtilsService>(AuditUtilsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('initialization', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });
  });

  describe('validateAuditEntry', () => {
    it('should validate valid audit entry', () => {
      const entry: Partial<IAuditLogEntry> = {
        action: AuditAction.CREATE,
        entityType: 'Student',
        ipAddress: '192.168.1.1',
      };

      const result = service.validateAuditEntry(entry);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return error when action is missing', () => {
      const entry: Partial<IAuditLogEntry> = {
        entityType: 'Student',
      };

      const result = service.validateAuditEntry(entry);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Action is required');
    });

    it('should return error when entity type is missing', () => {
      const entry: Partial<IAuditLogEntry> = {
        action: AuditAction.READ,
      };

      const result = service.validateAuditEntry(entry);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Entity type is required');
    });

    it('should return error for invalid IP address', () => {
      const entry: Partial<IAuditLogEntry> = {
        action: AuditAction.UPDATE,
        entityType: 'Student',
        ipAddress: 'invalid-ip',
      };

      const result = service.validateAuditEntry(entry);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid IP address format');
    });

    it('should return multiple errors when multiple fields are invalid', () => {
      const entry: Partial<IAuditLogEntry> = {
        ipAddress: 'invalid-ip',
      };

      const result = service.validateAuditEntry(entry);

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
    });
  });

  describe('validatePHIEntry', () => {
    it('should validate valid PHI entry', () => {
      const entry: Partial<IPHIAccessLog> = {
        action: AuditAction.READ,
        entityType: 'HealthRecord',
        studentId: 'student-123',
        accessType: PHIAccessType.READ,
        dataCategory: PHIDataCategory.MEDICAL_HISTORY,
      };

      const result = service.validatePHIEntry(entry);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return error when student ID is missing', () => {
      const entry: Partial<IPHIAccessLog> = {
        action: AuditAction.READ,
        entityType: 'HealthRecord',
        accessType: PHIAccessType.READ,
        dataCategory: PHIDataCategory.MEDICAL_HISTORY,
      };

      const result = service.validatePHIEntry(entry);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Student ID is required for PHI access');
    });

    it('should return error when access type is missing', () => {
      const entry: Partial<IPHIAccessLog> = {
        action: AuditAction.READ,
        entityType: 'HealthRecord',
        studentId: 'student-123',
        dataCategory: PHIDataCategory.MEDICAL_HISTORY,
      };

      const result = service.validatePHIEntry(entry);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Access type is required for PHI access');
    });

    it('should return error when data category is missing', () => {
      const entry: Partial<IPHIAccessLog> = {
        action: AuditAction.READ,
        entityType: 'HealthRecord',
        studentId: 'student-123',
        accessType: PHIAccessType.READ,
      };

      const result = service.validatePHIEntry(entry);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Data category is required for PHI access');
    });

    it('should return error for invalid access type', () => {
      const entry: Partial<IPHIAccessLog> = {
        action: AuditAction.READ,
        entityType: 'HealthRecord',
        studentId: 'student-123',
        accessType: 'INVALID_TYPE' as PHIAccessType,
        dataCategory: PHIDataCategory.MEDICAL_HISTORY,
      };

      const result = service.validatePHIEntry(entry);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid PHI access type');
    });

    it('should return error for invalid data category', () => {
      const entry: Partial<IPHIAccessLog> = {
        action: AuditAction.READ,
        entityType: 'HealthRecord',
        studentId: 'student-123',
        accessType: PHIAccessType.READ,
        dataCategory: 'INVALID_CATEGORY' as PHIDataCategory,
      };

      const result = service.validatePHIEntry(entry);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid PHI data category');
    });
  });

  describe('isValidIPAddress', () => {
    it('should validate IPv4 addresses', () => {
      expect(service.isValidIPAddress('192.168.1.1')).toBe(true);
      expect(service.isValidIPAddress('255.255.255.255')).toBe(true);
      expect(service.isValidIPAddress('0.0.0.0')).toBe(true);
      expect(service.isValidIPAddress('127.0.0.1')).toBe(true);
    });

    it('should validate IPv6 addresses', () => {
      expect(service.isValidIPAddress('2001:0db8:85a3:0000:0000:8a2e:0370:7334')).toBe(true);
      expect(service.isValidIPAddress('fe80:0000:0000:0000:0204:61ff:fe9d:f156')).toBe(true);
    });

    it('should reject invalid IP addresses', () => {
      expect(service.isValidIPAddress('256.1.1.1')).toBe(false);
      expect(service.isValidIPAddress('192.168.1')).toBe(false);
      expect(service.isValidIPAddress('invalid-ip')).toBe(false);
      expect(service.isValidIPAddress('192.168.1.1.1')).toBe(false);
    });
  });

  describe('extractIPAddress', () => {
    it('should extract IP from string', () => {
      const result = service.extractIPAddress('192.168.1.1');
      expect(result).toBe('192.168.1.1');
    });

    it('should extract IP from request object with ip property', () => {
      const req: AuditRequest = {
        ip: '192.168.1.1',
        headers: {},
      };

      const result = service.extractIPAddress(req);
      expect(result).toBe('192.168.1.1');
    });

    it('should extract IP from x-forwarded-for header', () => {
      const req: AuditRequest = {
        headers: {
          'x-forwarded-for': '192.168.1.1, 10.0.0.1',
        },
      };

      const result = service.extractIPAddress(req);
      expect(result).toBe('192.168.1.1');
    });

    it('should extract IP from x-real-ip header', () => {
      const req: AuditRequest = {
        headers: {
          'x-real-ip': '192.168.1.1',
        },
      };

      const result = service.extractIPAddress(req);
      expect(result).toBe('192.168.1.1');
    });

    it('should extract IP from connection.remoteAddress', () => {
      const req: AuditRequest = {
        connection: {
          remoteAddress: '192.168.1.1',
        },
        headers: {},
      };

      const result = service.extractIPAddress(req);
      expect(result).toBe('192.168.1.1');
    });

    it('should return undefined when no IP is found', () => {
      const req: AuditRequest = {
        headers: {},
      };

      const result = service.extractIPAddress(req);
      expect(result).toBeUndefined();
    });
  });

  describe('extractUserAgent', () => {
    it('should extract user agent from string', () => {
      const result = service.extractUserAgent('Mozilla/5.0');
      expect(result).toBe('Mozilla/5.0');
    });

    it('should extract user agent from request headers', () => {
      const req: AuditRequest = {
        headers: {
          'user-agent': 'Mozilla/5.0',
        },
      };

      const result = service.extractUserAgent(req);
      expect(result).toBe('Mozilla/5.0');
    });

    it('should extract user agent from userAgent property', () => {
      const req: AuditRequest = {
        userAgent: 'Mozilla/5.0',
        headers: {},
      };

      const result = service.extractUserAgent(req);
      expect(result).toBe('Mozilla/5.0');
    });

    it('should return undefined when no user agent is found', () => {
      const req: AuditRequest = {
        headers: {},
      };

      const result = service.extractUserAgent(req);
      expect(result).toBeUndefined();
    });
  });

  describe('sanitizeAuditData', () => {
    it('should remove password field', () => {
      const data = {
        username: 'john',
        password: 'secret123',
        email: 'john@example.com',
      };

      const result = service.sanitizeAuditData(data);

      expect(result.username).toBe('john');
      expect(result.email).toBe('john@example.com');
      expect(result.password).toBeUndefined();
    });

    it('should redact token field', () => {
      const data = {
        userId: '123',
        token: 'abc123xyz',
      };

      const result = service.sanitizeAuditData(data);

      expect(result.userId).toBe('123');
      expect(result.token).toBe('***REDACTED***');
    });

    it('should redact apiKey field', () => {
      const data = {
        userId: '123',
        apiKey: 'sk-abc123xyz',
      };

      const result = service.sanitizeAuditData(data);

      expect(result.userId).toBe('123');
      expect(result.apiKey).toBe('***REDACTED***');
    });

    it('should truncate long strings', () => {
      const longString = 'a'.repeat(1500);
      const data = {
        description: longString,
      };

      const result = service.sanitizeAuditData(data);

      expect(result.description).toContain('[TRUNCATED]');
      expect((result.description as string).length).toBeLessThan(longString.length);
    });

    it('should handle nested objects', () => {
      const data = {
        user: {
          username: 'john',
          password: 'secret',
        },
      };

      const result = service.sanitizeAuditData(data);

      expect(result.user).toBeDefined();
    });

    it('should not modify original data', () => {
      const data = {
        username: 'john',
        password: 'secret',
      };

      const result = service.sanitizeAuditData(data);

      expect(data.password).toBe('secret');
      expect(result.password).toBeUndefined();
    });
  });

  describe('AUDIT_CONSTANTS', () => {
    it('should define max query limit', () => {
      expect(AUDIT_CONSTANTS.MAX_QUERY_LIMIT).toBe(1000);
    });

    it('should define default page limit', () => {
      expect(AUDIT_CONSTANTS.DEFAULT_PAGE_LIMIT).toBe(50);
    });

    it('should define retention periods', () => {
      expect(AUDIT_CONSTANTS.RETENTION_PERIODS.AUDIT_LOGS).toBe(2555);
      expect(AUDIT_CONSTANTS.RETENTION_PERIODS.PHI_ACCESS_LOGS).toBe(2555);
    });

    it('should define business hours', () => {
      expect(AUDIT_CONSTANTS.BUSINESS_HOURS.START).toBe(6);
      expect(AUDIT_CONSTANTS.BUSINESS_HOURS.END).toBe(20);
    });

    it('should include PHI access types', () => {
      expect(Array.isArray(AUDIT_CONSTANTS.PHI_ACCESS_TYPES)).toBe(true);
    });

    it('should include PHI data categories', () => {
      expect(Array.isArray(AUDIT_CONSTANTS.PHI_DATA_CATEGORIES)).toBe(true);
    });
  });
});
