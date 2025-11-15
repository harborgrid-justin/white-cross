/**
 * @fileoverview Audit Interceptor Unit Tests
 * @module middleware/monitoring/__tests__/audit
 * @description Tests for audit logging interceptor
 */

import { Test, TestingModule } from '@nestjs/testing';
import { AuditInterceptor } from '../audit.interceptor';
import { AuditMiddleware } from '../audit.middleware';

describe('AuditInterceptor', () => {
  let interceptor: AuditInterceptor;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditInterceptor,
        {
          provide: AuditMiddleware,
          useValue: {
            logPHIAccess: jest.fn(),
            logEvent: jest.fn(),
          },
        },
      ],
    }).compile();

    interceptor = module.get<AuditInterceptor>(AuditInterceptor);
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should detect PHI operations', () => {
    expect(interceptor['isPHIOperation']('HealthRecordController', 'getHealthRecord')).toBe(true);
    expect(interceptor['isPHIOperation']('MedicationController', 'getMedications')).toBe(true);
    expect(interceptor['isPHIOperation']('DashboardController', 'getStats')).toBe(false);
  });

  it('should extract operation type from HTTP method', () => {
    expect(interceptor['getOperationType']('GET')).toBe('VIEW');
    expect(interceptor['getOperationType']('POST')).toBe('CREATE');
    expect(interceptor['getOperationType']('PUT')).toBe('EDIT');
    expect(interceptor['getOperationType']('DELETE')).toBe('DELETE');
  });

  it('should extract IP address', () => {
    const request = {
      headers: { 'x-forwarded-for': '203.0.113.1, 198.51.100.1' },
      ip: '192.168.1.100',
    };
    expect(interceptor['getClientIP'](request)).toBe('203.0.113.1');

    const request2 = {
      headers: { 'x-real-ip': '203.0.113.50' },
      ip: '192.168.1.100',
    };
    expect(interceptor['getClientIP'](request2)).toBe('203.0.113.50');

    const request3 = {
      headers: {},
      ip: '192.168.1.100',
    };
    expect(interceptor['getClientIP'](request3)).toBe('192.168.1.100');
  });
});
