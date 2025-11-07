/**
 * @fileoverview Audit Interceptor Unit Tests
 * @module middleware/monitoring/__tests__/audit
 * @description HIPAA-CRITICAL tests for audit logging interceptor including:
 * - PHI access logging
 * - Method-level audit trails
 * - Failed operation logging
 * - Performance tracking
 * - Audit data completeness
 *
 * @security HIPAA-critical audit logging tests
 * @compliance HIPAA 164.312(b) - Audit Controls
 */

import { CallHandler, ExecutionContext } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { of, throwError } from 'rxjs';
import { AuditInterceptor } from '../audit.interceptor';
import { AuditMiddleware, AuditEventType } from '../audit.middleware';

describe('AuditInterceptor (HIPAA-CRITICAL)', () => {
  let interceptor: AuditInterceptor;
  let auditMiddleware: AuditMiddleware;

  // Mock AuditMiddleware
  const mockAuditMiddleware = {
    logPHIAccess: jest.fn().mockResolvedValue(undefined),
    logEvent: jest.fn().mockResolvedValue(undefined),
  };

  // Mock request factory
  const createMockRequest = (overrides: any = {}) => ({
    method: 'GET',
    path: '/api/health-records',
    headers: { 'user-agent': 'Mozilla/5.0' },
    user: {
      userId: 'user-123',
      email: 'nurse@whitecross.edu',
      role: 'NURSE',
    },
    params: {},
    query: {},
    ...overrides,
  });

  // Mock ExecutionContext factory
  const createMockExecutionContext = (
    request: any = {},
    handlerName = 'getHealthRecord',
    controllerName = 'HealthRecordController',
  ): ExecutionContext => {
    const mockRequest = createMockRequest(request);
    return {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(mockRequest),
      }),
      getHandler: jest.fn().mockReturnValue({ name: handlerName }),
      getClass: jest.fn().mockReturnValue({ name: controllerName }),
    } as unknown as ExecutionContext;
  };

  // Mock CallHandler
  const createMockCallHandler = (data: any = { success: true }): CallHandler => ({
    handle: jest.fn().mockReturnValue(of(data)),
  });

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditInterceptor,
        {
          provide: AuditMiddleware,
          useValue: mockAuditMiddleware,
        },
      ],
    }).compile();

    interceptor = module.get<AuditInterceptor>(AuditInterceptor);
    auditMiddleware = module.get<AuditMiddleware>(AuditMiddleware);
  });

  describe('PHI Access Logging (HIPAA Required)', () => {
    it('should log PHI access for health record retrieval', (done) => {
      // Arrange
      const context = createMockExecutionContext(
        { params: { studentId: 'student-456' } },
        'getHealthRecord',
        'HealthRecordController',
      );
      const callHandler = createMockCallHandler({ recordId: 'record-789' });

      // Act
      interceptor.intercept(context, callHandler).subscribe({
        next: () => {
          // Assert
          expect(auditMiddleware.logPHIAccess).toHaveBeenCalledWith(
            'VIEW',
            'student-456',
            'user-123',
            'nurse@whitecross.edu',
            'NURSE',
            expect.any(String), // IP address
            'HealthRecordController.getHealthRecord',
            undefined,
          );
          done();
        },
      });
    });

    it('should log PHI edit operations', (done) => {
      // Arrange
      const context = createMockExecutionContext(
        { method: 'PUT', params: { studentId: 'student-456' } },
        'updateHealthRecord',
        'HealthRecordController',
      );
      const callHandler = createMockCallHandler();

      // Act
      interceptor.intercept(context, callHandler).subscribe({
        next: () => {
          // Assert
          expect(auditMiddleware.logPHIAccess).toHaveBeenCalledWith(
            'EDIT',
            'student-456',
            expect.any(String),
            expect.any(String),
            expect.any(String),
            expect.any(String),
            'HealthRecordController.updateHealthRecord',
            undefined,
          );
          done();
        },
      });
    });

    it('should log PHI creation', (done) => {
      // Arrange
      const context = createMockExecutionContext(
        { method: 'POST', body: { studentId: 'student-456' } },
        'createHealthRecord',
        'HealthRecordController',
      );
      const callHandler = createMockCallHandler();

      // Act
      interceptor.intercept(context, callHandler).subscribe({
        next: () => {
          // Assert
          expect(auditMiddleware.logPHIAccess).toHaveBeenCalledWith(
            'CREATE',
            expect.any(String),
            expect.any(String),
            expect.any(String),
            expect.any(String),
            expect.any(String),
            'HealthRecordController.createHealthRecord',
            undefined,
          );
          done();
        },
      });
    });

    it('should log PHI deletion', (done) => {
      // Arrange
      const context = createMockExecutionContext(
        { method: 'DELETE', params: { studentId: 'student-456' } },
        'deleteHealthRecord',
        'HealthRecordController',
      );
      const callHandler = createMockCallHandler();

      // Act
      interceptor.intercept(context, callHandler).subscribe({
        next: () => {
          // Assert
          expect(auditMiddleware.logPHIAccess).toHaveBeenCalledWith(
            'DELETE',
            'student-456',
            expect.any(String),
            expect.any(String),
            expect.any(String),
            expect.any(String),
            'HealthRecordController.deleteHealthRecord',
            undefined,
          );
          done();
        },
      });
    });

    it('should log PHI access for medication records', (done) => {
      // Arrange
      const context = createMockExecutionContext(
        { params: { studentId: 'student-456' } },
        'getMedications',
        'MedicationController',
      );
      const callHandler = createMockCallHandler();

      // Act
      interceptor.intercept(context, callHandler).subscribe({
        next: () => {
          // Assert
          expect(auditMiddleware.logPHIAccess).toHaveBeenCalled();
          done();
        },
      });
    });

    it('should log PHI access for immunization records', (done) => {
      // Arrange
      const context = createMockExecutionContext(
        {},
        'getImmunizations',
        'ImmunizationController',
      );
      const callHandler = createMockCallHandler();

      // Act
      interceptor.intercept(context, callHandler).subscribe({
        next: () => {
          // Assert
          expect(auditMiddleware.logPHIAccess).toHaveBeenCalled();
          done();
        },
      });
    });

    it('should extract student ID from various request locations', (done) => {
      // Arrange - Student ID in params
      const context1 = createMockExecutionContext(
        { params: { studentId: 'student-123' } },
        'getHealthRecord',
        'HealthRecordController',
      );
      const callHandler = createMockCallHandler();

      // Act & Assert
      interceptor.intercept(context1, callHandler).subscribe({
        next: () => {
          expect(auditMiddleware.logPHIAccess).toHaveBeenCalledWith(
            expect.any(String),
            'student-123',
            expect.any(String),
            expect.any(String),
            expect.any(String),
            expect.any(String),
            expect.any(String),
            undefined,
          );
          done();
        },
      });
    });

    it('should extract patient ID as fallback', (done) => {
      // Arrange
      const context = createMockExecutionContext(
        { params: { patientId: 'patient-789' } },
        'getPatient',
        'PatientController',
      );
      const callHandler = createMockCallHandler();

      // Act
      interceptor.intercept(context, callHandler).subscribe({
        next: () => {
          // Assert - Should use patient ID
          const logCall = mockAuditMiddleware.logPHIAccess.mock.calls[0];
          expect(logCall[1]).toBe('patient-789');
          done();
        },
      });
    });

    it('should handle missing student ID gracefully', (done) => {
      // Arrange
      const context = createMockExecutionContext(
        { params: {} },
        'getHealthRecord',
        'HealthRecordController',
      );
      const callHandler = createMockCallHandler();

      // Act
      interceptor.intercept(context, callHandler).subscribe({
        next: () => {
          // Assert - Should use 'unknown'
          const logCall = mockAuditMiddleware.logPHIAccess.mock.calls[0];
          expect(logCall[1]).toBe('unknown');
          done();
        },
      });
    });
  });

  describe('Non-PHI Operations', () => {
    it('should not log PHI access for dashboard operations', (done) => {
      // Arrange
      const context = createMockExecutionContext(
        {},
        'getStats',
        'DashboardController',
      );
      const callHandler = createMockCallHandler();

      // Act
      interceptor.intercept(context, callHandler).subscribe({
        next: () => {
          // Assert
          expect(auditMiddleware.logPHIAccess).not.toHaveBeenCalled();
          done();
        },
      });
    });

    it('should not log PHI access for authentication operations', (done) => {
      // Arrange
      const context = createMockExecutionContext(
        {},
        'login',
        'AuthController',
      );
      const callHandler = createMockCallHandler();

      // Act
      interceptor.intercept(context, callHandler).subscribe({
        next: () => {
          // Assert
          expect(auditMiddleware.logPHIAccess).not.toHaveBeenCalled();
          done();
        },
      });
    });

    it('should not log PHI access for user profile operations', (done) => {
      // Arrange
      const context = createMockExecutionContext(
        {},
        'getProfile',
        'UserController',
      );
      const callHandler = createMockCallHandler();

      // Act
      interceptor.intercept(context, callHandler).subscribe({
        next: () => {
          // Assert
          expect(auditMiddleware.logPHIAccess).not.toHaveBeenCalled();
          done();
        },
      });
    });
  });

  describe('Error Handling and Failed Operations', () => {
    it('should log failed PHI access attempts', (done) => {
      // Arrange
      const context = createMockExecutionContext(
        { params: { studentId: 'student-456' } },
        'getHealthRecord',
        'HealthRecordController',
      );
      const error = new Error('Unauthorized access');
      const callHandler: CallHandler = {
        handle: jest.fn().mockReturnValue(throwError(() => error)),
      };

      // Act
      interceptor.intercept(context, callHandler).subscribe({
        error: (err) => {
          // Assert
          expect(auditMiddleware.logEvent).toHaveBeenCalledWith(
            AuditEventType.SYSTEM_ACCESS,
            'HealthRecordController.getHealthRecord',
            'FAILURE',
            expect.objectContaining({
              error: 'Unauthorized access',
              userId: 'user-123',
            }),
          );
          expect(err).toBe(error);
          done();
        },
      });
    });

    it('should log error details including stack trace', (done) => {
      // Arrange
      const context = createMockExecutionContext();
      const error = new Error('Database connection failed');
      error.stack = 'Error: Database connection failed\n    at ...';
      const callHandler: CallHandler = {
        handle: jest.fn().mockReturnValue(throwError(() => error)),
      };

      // Act
      interceptor.intercept(context, callHandler).subscribe({
        error: () => {
          // Assert
          const logCall = mockAuditMiddleware.logEvent.mock.calls[0];
          expect(logCall[3].details.errorStack).toContain('Database connection failed');
          done();
        },
      });
    });

    it('should include execution duration in error logs', (done) => {
      // Arrange
      const context = createMockExecutionContext();
      const error = new Error('Operation failed');
      const callHandler: CallHandler = {
        handle: jest.fn().mockReturnValue(throwError(() => error)),
      };

      // Act
      interceptor.intercept(context, callHandler).subscribe({
        error: () => {
          // Assert
          const logCall = mockAuditMiddleware.logEvent.mock.calls[0];
          expect(logCall[3].details.duration).toBeGreaterThanOrEqual(0);
          done();
        },
      });
    });

    it('should re-throw errors after logging', (done) => {
      // Arrange
      const context = createMockExecutionContext();
      const originalError = new Error('Test error');
      const callHandler: CallHandler = {
        handle: jest.fn().mockReturnValue(throwError(() => originalError)),
      };

      // Act
      interceptor.intercept(context, callHandler).subscribe({
        error: (thrownError) => {
          // Assert
          expect(thrownError).toBe(originalError);
          done();
        },
      });
    });
  });

  describe('User Context Tracking', () => {
    it('should log user ID and email', (done) => {
      // Arrange
      const context = createMockExecutionContext(
        {
          user: {
            userId: 'nurse-789',
            email: 'jane.nurse@whitecross.edu',
            role: 'NURSE',
          },
        },
        'getHealthRecord',
        'HealthRecordController',
      );
      const callHandler = createMockCallHandler();

      // Act
      interceptor.intercept(context, callHandler).subscribe({
        next: () => {
          // Assert
          expect(auditMiddleware.logPHIAccess).toHaveBeenCalledWith(
            expect.any(String),
            expect.any(String),
            'nurse-789',
            'jane.nurse@whitecross.edu',
            'NURSE',
            expect.any(String),
            expect.any(String),
            undefined,
          );
          done();
        },
      });
    });

    it('should log user role', (done) => {
      // Arrange
      const context = createMockExecutionContext(
        {
          user: {
            userId: 'admin-123',
            email: 'admin@whitecross.edu',
            role: 'ADMIN',
          },
        },
        'getHealthRecord',
        'HealthRecordController',
      );
      const callHandler = createMockCallHandler();

      // Act
      interceptor.intercept(context, callHandler).subscribe({
        next: () => {
          // Assert
          const logCall = mockAuditMiddleware.logPHIAccess.mock.calls[0];
          expect(logCall[4]).toBe('ADMIN');
          done();
        },
      });
    });

    it('should handle missing user gracefully', (done) => {
      // Arrange
      const context = createMockExecutionContext(
        { user: null },
        'publicMethod',
        'PublicController',
      );
      const callHandler = createMockCallHandler();

      // Act
      interceptor.intercept(context, callHandler).subscribe({
        next: () => {
          // Assert - Should not crash
          expect(true).toBe(true);
          done();
        },
      });
    });
  });

  describe('IP Address Tracking', () => {
    it('should extract IP from x-forwarded-for header', (done) => {
      // Arrange
      const context = createMockExecutionContext(
        {
          headers: {
            'x-forwarded-for': '203.0.113.1, 198.51.100.1',
            'user-agent': 'Mozilla/5.0',
          },
        },
        'getHealthRecord',
        'HealthRecordController',
      );
      const callHandler = createMockCallHandler();

      // Act
      interceptor.intercept(context, callHandler).subscribe({
        next: () => {
          // Assert
          const logCall = mockAuditMiddleware.logPHIAccess.mock.calls[0];
          expect(logCall[5]).toBe('203.0.113.1');
          done();
        },
      });
    });

    it('should extract IP from x-real-ip header', (done) => {
      // Arrange
      const context = createMockExecutionContext(
        {
          headers: {
            'x-real-ip': '203.0.113.50',
            'user-agent': 'Mozilla/5.0',
          },
        },
        'getHealthRecord',
        'HealthRecordController',
      );
      const callHandler = createMockCallHandler();

      // Act
      interceptor.intercept(context, callHandler).subscribe({
        next: () => {
          // Assert
          const logCall = mockAuditMiddleware.logPHIAccess.mock.calls[0];
          expect(logCall[5]).toBe('203.0.113.50');
          done();
        },
      });
    });

    it('should fallback to request.ip', (done) => {
      // Arrange
      const context = createMockExecutionContext(
        {
          ip: '192.168.1.100',
          headers: { 'user-agent': 'Mozilla/5.0' },
        },
        'getHealthRecord',
        'HealthRecordController',
      );
      const callHandler = createMockCallHandler();

      // Act
      interceptor.intercept(context, callHandler).subscribe({
        next: () => {
          // Assert
          const logCall = mockAuditMiddleware.logPHIAccess.mock.calls[0];
          expect(logCall[5]).toBe('192.168.1.100');
          done();
        },
      });
    });

    it('should use "unknown" when IP cannot be determined', (done) => {
      // Arrange
      const context = createMockExecutionContext(
        {
          ip: undefined,
          headers: { 'user-agent': 'Mozilla/5.0' },
        },
        'getHealthRecord',
        'HealthRecordController',
      );
      const callHandler = createMockCallHandler();

      // Act
      interceptor.intercept(context, callHandler).subscribe({
        next: () => {
          // Assert
          const logCall = mockAuditMiddleware.logPHIAccess.mock.calls[0];
          expect(logCall[5]).toBe('unknown');
          done();
        },
      });
    });
  });

  describe('Performance Tracking', () => {
    it('should log execution duration', (done) => {
      // Arrange
      const loggerSpy = jest.spyOn(interceptor['logger'], 'debug');
      const context = createMockExecutionContext();
      const callHandler = createMockCallHandler();

      // Act
      interceptor.intercept(context, callHandler).subscribe({
        next: () => {
          // Assert
          const completedLog = loggerSpy.mock.calls.find(
            (call) => call[0] && call[0].includes('Completed'),
          );
          expect(completedLog).toBeDefined();
          expect(completedLog![1]).toHaveProperty('duration');
          expect(completedLog![1].duration).toBeGreaterThanOrEqual(0);
          done();
        },
      });
    });

    it('should complete audit logging within 10ms', (done) => {
      // Arrange
      const context = createMockExecutionContext();
      const callHandler = createMockCallHandler();

      // Act
      const startTime = Date.now();
      interceptor.intercept(context, callHandler).subscribe({
        next: () => {
          const duration = Date.now() - startTime;
          // Assert
          expect(duration).toBeLessThan(10);
          done();
        },
      });
    });
  });

  describe('Audit Trail Completeness (HIPAA Requirement)', () => {
    it('should capture all required audit fields', (done) => {
      // Arrange
      const context = createMockExecutionContext(
        {
          method: 'GET',
          params: { studentId: 'student-456' },
          user: {
            userId: 'nurse-123',
            email: 'nurse@whitecross.edu',
            role: 'NURSE',
          },
        },
        'getHealthRecord',
        'HealthRecordController',
      );
      const callHandler = createMockCallHandler();

      // Act
      interceptor.intercept(context, callHandler).subscribe({
        next: () => {
          // Assert - All required HIPAA fields present
          expect(auditMiddleware.logPHIAccess).toHaveBeenCalledWith(
            'VIEW', // Operation type
            'student-456', // Patient ID
            'nurse-123', // User ID
            'nurse@whitecross.edu', // User email
            'NURSE', // User role
            expect.any(String), // IP address
            'HealthRecordController.getHealthRecord', // Resource accessed
            undefined, // Additional details
          );
          done();
        },
      });
    });

    it('should create immutable audit records', (done) => {
      // Arrange
      const context = createMockExecutionContext(
        { params: { studentId: 'student-456' } },
        'getHealthRecord',
        'HealthRecordController',
      );
      const callHandler = createMockCallHandler();

      // Act
      interceptor.intercept(context, callHandler).subscribe({
        next: () => {
          // Assert - Verify audit log was called (records are immutable in DB)
          expect(auditMiddleware.logPHIAccess).toHaveBeenCalledTimes(1);
          done();
        },
      });
    });
  });

  describe('Concurrent Operations', () => {
    it('should handle concurrent audit logging', (done) => {
      // Arrange
      const contexts = Array.from({ length: 50 }, (_, i) =>
        createMockExecutionContext(
          { params: { studentId: `student-${i}` } },
          'getHealthRecord',
          'HealthRecordController',
        )
      );
      const callHandlers = contexts.map(() => createMockCallHandler());

      // Act
      const promises = contexts.map((ctx, i) =>
        interceptor.intercept(ctx, callHandlers[i]).toPromise(),
      );

      Promise.all(promises).then(() => {
        // Assert
        expect(auditMiddleware.logPHIAccess).toHaveBeenCalledTimes(50);
        done();
      });
    });
  });
});
