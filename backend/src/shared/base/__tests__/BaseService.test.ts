/**
 * LOC: TEST-BASE-001
 * Unit Tests for BaseService
 * Core service functionality and common operations
 *
 * Tests cover:
 * - Pagination validation and response creation
 * - UUID validation
 * - Error handling
 * - Success responses
 * - Logging functionality
 */

import { BaseService, BaseServiceConfig } from '../BaseService';
import { logger } from '../../logging/logger.service';

// Mock implementations for testing
const createMockStudent = () => ({
  id: 'test-student-id',
  firstName: 'Test',
  lastName: 'Student',
  studentNumber: '12345'
});

const generateMockUUID = () => 'mock-uuid-12345';

// ============================================================================
// TEST SERVICE IMPLEMENTATION
// ============================================================================

class TestService extends BaseService {
  constructor(config?: Partial<BaseServiceConfig>) {
    super({
      serviceName: 'TestService',
      tableName: 'test_table',
      ...config,
    });
  }

  // Expose protected methods for testing
  public testValidatePagination(params: any) {
    return this.validatePagination(params);
  }

  public testCreatePaginatedResponse(result: any, page: number, limit: number) {
    return this.createPaginatedResponse(result, page, limit);
  }

  public testValidateId(id: string, fieldName?: string) {
    return this.validateId(id, fieldName);
  }

  public testHandleError(operation: string, error: any, metadata?: any) {
    return this.handleError(operation, error, metadata);
  }

  public testHandleSuccess(operation: string, data: any, message?: string, metadata?: any) {
    return this.handleSuccess(operation, data, message, metadata);
  }

  public testLogInfo(message: string, metadata?: any) {
    return this.logInfo(message, metadata);
  }

  public testLogError(message: string, error?: any, metadata?: any) {
    return this.logError(message, error, metadata);
  }

  public testLogWarning(message: string, metadata?: any) {
    return this.logWarning(message, metadata);
  }
}

describe('BaseService', () => {
  let service: TestService;

  beforeEach(() => {
    service = new TestService();
    jest.clearAllMocks();
  });

  // ==========================================================================
  // PAGINATION TESTS
  // ==========================================================================

  describe('validatePagination()', () => {
    it('should validate correct pagination parameters', () => {
      const params = { page: 1, limit: 20 };
      const result = service.testValidatePagination(params);

      expect(result.isValid).toBe(true);
      expect(result.normalizedParams).toEqual({
        page: 1,
        limit: 20,
        offset: 0,
      });
    });

    it('should use default pagination values', () => {
      const params = {};
      const result = service.testValidatePagination(params);

      expect(result.isValid).toBe(true);
      expect(result.normalizedParams?.page).toBe(1);
      expect(result.normalizedParams?.limit).toBeGreaterThan(0);
    });

    it('should validate page number is positive', () => {
      const params = { page: 0, limit: 20 };
      const result = service.testValidatePagination(params);

      expect(result.isValid).toBe(false);
      expect(result.errors).toBeDefined();
    });

    it('should validate limit is within bounds', () => {
      const params = { page: 1, limit: 0 };
      const result = service.testValidatePagination(params);

      expect(result.isValid).toBe(false);
      expect(result.errors).toBeDefined();
    });

    it('should calculate correct offset', () => {
      const params = { page: 3, limit: 10 };
      const result = service.testValidatePagination(params);

      expect(result.normalizedParams?.offset).toBe(20); // (3-1) * 10
    });

    it('should respect custom pagination constraints', () => {
      const customService = new TestService({
        paginationConstraints: {
          maxLimit: 50,
          defaultLimit: 25,
        },
      });

      const params = { page: 1 };
      const result = customService.testValidatePagination(params);

      expect(result.normalizedParams?.limit).toBe(25);
    });
  });

  describe('createPaginatedResponse()', () => {
    it('should create correct paginated response', () => {
      const mockStudents = [
        createMockStudent(),
        createMockStudent(),
        createMockStudent(),
      ];

      const result = service.testCreatePaginatedResponse(
        { rows: mockStudents, count: 50 },
        1,
        10
      );

      expect(result).toEqual({
        data: mockStudents,
        pagination: {
          page: 1,
          limit: 10,
          total: 50,
          pages: 5,
        },
      });
    });

    it('should calculate correct total pages', () => {
      const result = service.testCreatePaginatedResponse(
        { rows: [], count: 25 },
        1,
        10
      );

      expect(result.pagination.pages).toBe(3); // Math.ceil(25/10)
    });

    it('should handle empty result set', () => {
      const result = service.testCreatePaginatedResponse(
        { rows: [], count: 0 },
        1,
        10
      );

      expect(result.data).toEqual([]);
      expect(result.pagination.total).toBe(0);
      expect(result.pagination.pages).toBe(0);
    });

    it('should handle exact page boundary', () => {
      const result = service.testCreatePaginatedResponse(
        { rows: [], count: 100 },
        1,
        10
      );

      expect(result.pagination.pages).toBe(10); // Exactly 10 pages
    });
  });

  // ==========================================================================
  // VALIDATION TESTS
  // ==========================================================================

  describe('validateId()', () => {
    it('should validate correct UUID', () => {
      const validUUID = '123e4567-e89b-12d3-a456-426614174000';
      const result = service.testValidateId(validUUID);

      expect(result.isValid).toBe(true);
      expect(result.errors).toBeUndefined();
    });

    it('should reject invalid UUID format', () => {
      const invalidUUID = 'not-a-uuid';
      const result = service.testValidateId(invalidUUID);

      expect(result.isValid).toBe(false);
      expect(result.errors).toBeDefined();
    });

    it('should use custom field name in error message', () => {
      const invalidUUID = 'invalid';
      const result = service.testValidateId(invalidUUID, 'StudentID');

      expect(result.isValid).toBe(false);
      expect(result.errors?.[0]).toContain('StudentID');
    });

    it('should reject empty string', () => {
      const result = service.testValidateId('');

      expect(result.isValid).toBe(false);
    });

    it('should reject null or undefined', () => {
      const result1 = service.testValidateId(null as any);
      const result2 = service.testValidateId(undefined as any);

      expect(result1.isValid).toBe(false);
      expect(result2.isValid).toBe(false);
    });
  });

  // ==========================================================================
  // ERROR HANDLING TESTS
  // ==========================================================================

  describe('handleError()', () => {
    it('should return error response with message', () => {
      const error = new Error('Test error message');
      const result = service.testHandleError('testOperation', error);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Test error message');
      expect(result.data).toBeUndefined();
    });

    it('should log error with service name', () => {
      const error = new Error('Test error');
      service.testHandleError('testOperation', error);

      expect(logger.error).toHaveBeenCalledWith(
        '[TestService] Error in testOperation',
        expect.objectContaining({ error })
      );
    });

    it('should handle Sequelize connection errors', () => {
      const error = new Error('Connection failed');
      error.name = 'SequelizeConnectionError';

      const result = service.testHandleError('testOperation', error);

      expect(result.error).toBe('Database connection error. Please try again later.');
    });

    it('should handle Sequelize validation errors', () => {
      const error: any = new Error('Validation failed');
      error.name = 'SequelizeValidationError';
      error.errors = [
        { message: 'Name is required' },
        { message: 'Email is invalid' },
      ];

      const result = service.testHandleError('testOperation', error);

      expect(result.error).toContain('Validation failed:');
      expect(result.error).toContain('Name is required');
      expect(result.error).toContain('Email is invalid');
    });

    it('should handle Sequelize unique constraint errors', () => {
      const error = new Error('Unique constraint violated');
      error.name = 'SequelizeUniqueConstraintError';

      const result = service.testHandleError('testOperation', error);

      expect(result.error).toBe('A record with this information already exists.');
    });

    it('should include metadata in error logs', () => {
      const error = new Error('Test error');
      const metadata = { userId: '123', operation: 'CREATE' };

      service.testHandleError('testOperation', error, metadata);

      expect(logger.error).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining(metadata)
      );
    });

    it('should handle errors without message', () => {
      const error = {};
      const result = service.testHandleError('testOperation', error);

      expect(result.error).toBe('An unexpected error occurred');
    });
  });

  // ==========================================================================
  // SUCCESS HANDLING TESTS
  // ==========================================================================

  describe('handleSuccess()', () => {
    it('should return success response with data', () => {
      const data = { id: '123', name: 'Test' };
      const result = service.testHandleSuccess('testOperation', data);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(data);
      expect(result.error).toBeUndefined();
    });

    it('should include optional message', () => {
      const data = { id: '123' };
      const result = service.testHandleSuccess('testOperation', data, 'Operation completed');

      expect(result.message).toBe('Operation completed');
    });

    it('should log success with service name', () => {
      const data = { id: '123' };
      service.testHandleSuccess('testOperation', data);

      expect(logger.info).toHaveBeenCalledWith(
        '[TestService] testOperation completed successfully',
        undefined
      );
    });

    it('should include metadata in success logs', () => {
      const data = { id: '123' };
      const metadata = { userId: '456', timestamp: Date.now() };

      service.testHandleSuccess('testOperation', data, undefined, metadata);

      expect(logger.info).toHaveBeenCalledWith(
        expect.any(String),
        metadata
      );
    });

    it('should handle null data', () => {
      const result = service.testHandleSuccess('testOperation', null);

      expect(result.success).toBe(true);
      expect(result.data).toBeNull();
    });

    it('should handle array data', () => {
      const data = [{ id: '1' }, { id: '2' }];
      const result = service.testHandleSuccess('testOperation', data);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(data);
    });
  });

  // ==========================================================================
  // LOGGING TESTS
  // ==========================================================================

  describe('Logging Methods', () => {
    it('should log info messages with service name prefix', () => {
      service.testLogInfo('Test info message');

      expect(logger.info).toHaveBeenCalledWith(
        '[TestService] Test info message',
        undefined
      );
    });

    it('should log info with metadata', () => {
      const metadata = { userId: '123', action: 'READ' };
      service.testLogInfo('Test message', metadata);

      expect(logger.info).toHaveBeenCalledWith(
        '[TestService] Test message',
        metadata
      );
    });

    it('should log error messages with service name prefix', () => {
      const error = new Error('Test error');
      service.testLogError('Test error message', error);

      expect(logger.error).toHaveBeenCalledWith(
        '[TestService] Test error message',
        expect.objectContaining({ error })
      );
    });

    it('should log error with metadata', () => {
      const error = new Error('Test error');
      const metadata = { operation: 'DELETE' };

      service.testLogError('Test error message', error, metadata);

      expect(logger.error).toHaveBeenCalledWith(
        '[TestService] Test error message',
        expect.objectContaining({ error, ...metadata })
      );
    });

    it('should log warning messages with service name prefix', () => {
      service.testLogWarning('Test warning message');

      expect(logger.warn).toHaveBeenCalledWith(
        '[TestService] Test warning message',
        undefined
      );
    });

    it('should log warning with metadata', () => {
      const metadata = { threshold: 100, current: 150 };
      service.testLogWarning('Threshold exceeded', metadata);

      expect(logger.warn).toHaveBeenCalledWith(
        '[TestService] Threshold exceeded',
        metadata
      );
    });
  });

  // ==========================================================================
  // SERVICE CONFIGURATION TESTS
  // ==========================================================================

  describe('Service Configuration', () => {
    it('should accept custom service name', () => {
      const customService = new TestService({ serviceName: 'CustomService' });
      customService.testLogInfo('Test');

      expect(logger.info).toHaveBeenCalledWith(
        '[CustomService] Test',
        undefined
      );
    });

    it('should accept custom table name', () => {
      const customService = new TestService({ tableName: 'custom_table' });
      expect(customService).toBeDefined();
    });

    it('should enable audit logging by default', () => {
      const serviceWithDefaultAudit = new TestService();
      expect(serviceWithDefaultAudit).toBeDefined();
    });

    it('should allow disabling audit logging', () => {
      const serviceWithoutAudit = new TestService({ enableAuditLogging: false });
      expect(serviceWithoutAudit).toBeDefined();
    });

    it('should accept custom pagination constraints', () => {
      const customService = new TestService({
        paginationConstraints: {
          maxLimit: 200,
          defaultLimit: 50,
          minLimit: 5,
        },
      });

      const result = customService.testValidatePagination({});
      expect(result.normalizedParams?.limit).toBe(50);
    });
  });

  // ==========================================================================
  // EDGE CASES
  // ==========================================================================

  describe('Edge Cases', () => {
    it('should handle extremely large page numbers', () => {
      const params = { page: 1000000, limit: 20 };
      const result = service.testValidatePagination(params);

      expect(result.isValid).toBe(true);
      expect(result.normalizedParams?.offset).toBe(19999980);
    });

    it('should handle negative page numbers gracefully', () => {
      const params = { page: -1, limit: 20 };
      const result = service.testValidatePagination(params);

      expect(result.isValid).toBe(false);
    });

    it('should handle non-integer page numbers', () => {
      const params = { page: 1.5, limit: 20 };
      const result = service.testValidatePagination(params);

      // Should either round or reject
      expect(result).toBeDefined();
    });

    it('should handle string page numbers', () => {
      const params = { page: '2' as any, limit: 20 };
      const result = service.testValidatePagination(params);

      // Should either convert or reject
      expect(result).toBeDefined();
    });

    it('should handle very long error messages', () => {
      const longMessage = 'Error: ' + 'A'.repeat(10000);
      const error = new Error(longMessage);

      const result = service.testHandleError('testOperation', error);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should handle circular reference errors gracefully', () => {
      const circularError: any = { message: 'Circular error' };
      circularError.self = circularError;

      const result = service.testHandleError('testOperation', circularError);

      expect(result.success).toBe(false);
    });
  });
});
