import { Model } from 'sequelize-typescript';
import {
  createModelAuditHook,
  deleteModelAuditHook,
  bulkOperationAuditHook,
  setAuditLogger,
} from './model-audit-hooks.service';

describe('Model Audit Hooks Service', () => {
  let mockModel: jest.Mocked<Model>;
  let mockAuditLogger: {
    logCreate: jest.Mock;
    logUpdate: jest.Mock;
    logDelete: jest.Mock;
    logBulkOperation: jest.Mock;
  };
  let mockTransaction: unknown;

  beforeEach(() => {
    // Mock model instance
    mockModel = {
      get: jest.fn().mockReturnValue({ id: 'test-id', name: 'Test', email: 'test@example.com' }),
      isNewRecord: true,
      changed: jest.fn().mockReturnValue(['name', 'email']),
      previous: jest.fn((field: string) => {
        if (field === 'name') return 'OldName';
        if (field === 'email') return 'old@example.com';
        return null;
      }),
    } as unknown as jest.Mocked<Model>;

    // Mock audit logger
    mockAuditLogger = {
      logCreate: jest.fn().mockResolvedValue(undefined),
      logUpdate: jest.fn().mockResolvedValue(undefined),
      logDelete: jest.fn().mockResolvedValue(undefined),
      logBulkOperation: jest.fn().mockResolvedValue(undefined),
    };

    mockTransaction = {};

    // Set audit logger
    setAuditLogger(mockAuditLogger);
  });

  describe('createModelAuditHook', () => {
    it('should log create operation for new record', async () => {
      mockModel.isNewRecord = true;

      await createModelAuditHook('User', mockModel, mockTransaction);

      expect(mockAuditLogger.logCreate).toHaveBeenCalledWith(
        'User',
        'test-id',
        expect.objectContaining({ userId: expect.any(String) }),
        expect.objectContaining({ id: 'test-id', name: 'Test' }),
        mockTransaction
      );
    });

    it('should log update operation for existing record', async () => {
      mockModel.isNewRecord = false;

      await createModelAuditHook('User', mockModel, mockTransaction);

      expect(mockAuditLogger.logUpdate).toHaveBeenCalledWith(
        'User',
        'test-id',
        expect.objectContaining({ userId: expect.any(String) }),
        expect.objectContaining({
          name: expect.objectContaining({ before: 'OldName', after: 'Test' }),
        }),
        mockTransaction
      );
    });

    it('should not log if no fields changed', async () => {
      mockModel.isNewRecord = false;
      mockModel.changed = jest.fn().mockReturnValue(false);

      await createModelAuditHook('User', mockModel);

      expect(mockAuditLogger.logUpdate).not.toHaveBeenCalled();
    });

    it('should sanitize sensitive fields', async () => {
      mockModel.get = jest.fn().mockReturnValue({
        id: 'test-id',
        password: 'secret123',
        apiKey: 'key123',
      });
      mockModel.isNewRecord = true;

      await createModelAuditHook('User', mockModel);

      const callArgs = mockAuditLogger.logCreate.mock.calls[0][3];
      expect(callArgs.password).toBe('[REDACTED]');
      expect(callArgs.apiKey).toBe('[REDACTED]');
    });

    it('should handle errors gracefully', async () => {
      mockAuditLogger.logCreate.mockRejectedValueOnce(new Error('Audit failed'));
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      await createModelAuditHook('User', mockModel);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[AUDIT ERROR]'),
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });

    it('should use system context when no user context available', async () => {
      await createModelAuditHook('User', mockModel);

      expect(mockAuditLogger.logCreate).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        expect.objectContaining({
          userId: 'system',
          ipAddress: '127.0.0.1',
        }),
        expect.any(Object),
        undefined
      );
    });
  });

  describe('deleteModelAuditHook', () => {
    it('should log delete operation', async () => {
      await deleteModelAuditHook('User', mockModel, mockTransaction);

      expect(mockAuditLogger.logDelete).toHaveBeenCalledWith(
        'User',
        'test-id',
        expect.objectContaining({ userId: expect.any(String) }),
        expect.objectContaining({ id: 'test-id' }),
        mockTransaction
      );
    });

    it('should sanitize sensitive data before deletion', async () => {
      mockModel.get = jest.fn().mockReturnValue({
        id: 'test-id',
        password: 'secret123',
        token: 'token123',
      });

      await deleteModelAuditHook('User', mockModel);

      const callArgs = mockAuditLogger.logDelete.mock.calls[0][3];
      expect(callArgs.password).toBe('[REDACTED]');
      expect(callArgs.token).toBe('[REDACTED]');
    });

    it('should handle missing id gracefully', async () => {
      mockModel.get = jest.fn().mockReturnValue({ name: 'Test' });

      await deleteModelAuditHook('User', mockModel);

      expect(mockAuditLogger.logDelete).toHaveBeenCalledWith(
        'User',
        'unknown',
        expect.any(Object),
        expect.any(Object),
        undefined
      );
    });

    it('should handle errors without throwing', async () => {
      mockAuditLogger.logDelete.mockRejectedValueOnce(new Error('Audit failed'));
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      await expect(deleteModelAuditHook('User', mockModel)).resolves.not.toThrow();

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('bulkOperationAuditHook', () => {
    it('should log bulk operations', async () => {
      const metadata = {
        affectedCount: 50,
        criteria: { schoolId: 'school-123' },
      };

      await bulkOperationAuditHook('User', 'BULK_UPDATE', metadata, mockTransaction);

      expect(mockAuditLogger.logBulkOperation).toHaveBeenCalledWith(
        'BULK_UPDATE',
        'User',
        expect.objectContaining({ userId: expect.any(String) }),
        expect.objectContaining({ affectedCount: 50 }),
        mockTransaction
      );
    });

    it('should sanitize bulk operation metadata', async () => {
      const metadata = {
        password: 'secret',
        apiKey: 'key123',
        criteria: { id: 'test' },
      };

      await bulkOperationAuditHook('User', 'BULK_UPDATE', metadata);

      const callArgs = mockAuditLogger.logBulkOperation.mock.calls[0][3];
      expect(callArgs.password).toBe('[REDACTED]');
      expect(callArgs.apiKey).toBe('[REDACTED]');
    });

    it('should handle nested sensitive data', async () => {
      const metadata = {
        user: {
          password: 'secret',
          profile: {
            ssn: '123-45-6789',
          },
        },
      };

      await bulkOperationAuditHook('User', 'BULK_UPDATE', metadata);

      const callArgs = mockAuditLogger.logBulkOperation.mock.calls[0][3];
      expect(callArgs.user.password).toBe('[REDACTED]');
      expect(callArgs.user.profile.ssn).toBe('[REDACTED]');
    });

    it('should not throw on logger error', async () => {
      mockAuditLogger.logBulkOperation.mockRejectedValueOnce(new Error('Audit failed'));
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      await expect(
        bulkOperationAuditHook('User', 'BULK_DELETE', {})
      ).resolves.not.toThrow();

      consoleSpy.mockRestore();
    });
  });

  describe('setAuditLogger', () => {
    it('should set custom audit logger', async () => {
      const customLogger = {
        logCreate: jest.fn().mockResolvedValue(undefined),
        logUpdate: jest.fn().mockResolvedValue(undefined),
        logDelete: jest.fn().mockResolvedValue(undefined),
        logBulkOperation: jest.fn().mockResolvedValue(undefined),
      };

      setAuditLogger(customLogger);

      mockModel.isNewRecord = true;
      await createModelAuditHook('User', mockModel);

      expect(customLogger.logCreate).toHaveBeenCalled();
    });
  });

  describe('sensitive field detection', () => {
    it('should redact password fields', async () => {
      mockModel.get = jest.fn().mockReturnValue({
        id: 'test',
        password: 'secret',
        passwordHash: 'hash',
        userPassword: 'pass',
      });
      mockModel.isNewRecord = true;

      await createModelAuditHook('User', mockModel);

      const callArgs = mockAuditLogger.logCreate.mock.calls[0][3];
      expect(callArgs.password).toBe('[REDACTED]');
      expect(callArgs.passwordHash).toBe('[REDACTED]');
      expect(callArgs.userPassword).toBe('[REDACTED]');
    });

    it('should redact token fields', async () => {
      mockModel.get = jest.fn().mockReturnValue({
        id: 'test',
        token: 'token123',
        accessToken: 'access',
        refreshToken: 'refresh',
      });
      mockModel.isNewRecord = true;

      await createModelAuditHook('User', mockModel);

      const callArgs = mockAuditLogger.logCreate.mock.calls[0][3];
      expect(callArgs.token).toBe('[REDACTED]');
      expect(callArgs.accessToken).toBe('[REDACTED]');
      expect(callArgs.refreshToken).toBe('[REDACTED]');
    });

    it('should redact PII fields', async () => {
      mockModel.get = jest.fn().mockReturnValue({
        id: 'test',
        ssn: '123-45-6789',
        creditCard: '4111111111111111',
        apiKey: 'key123',
      });
      mockModel.isNewRecord = true;

      await createModelAuditHook('User', mockModel);

      const callArgs = mockAuditLogger.logCreate.mock.calls[0][3];
      expect(callArgs.ssn).toBe('[REDACTED]');
      expect(callArgs.creditCard).toBe('[REDACTED]');
      expect(callArgs.apiKey).toBe('[REDACTED]');
    });

    it('should preserve non-sensitive fields', async () => {
      mockModel.get = jest.fn().mockReturnValue({
        id: 'test',
        name: 'John Doe',
        email: 'john@example.com',
        age: 30,
      });
      mockModel.isNewRecord = true;

      await createModelAuditHook('User', mockModel);

      const callArgs = mockAuditLogger.logCreate.mock.calls[0][3];
      expect(callArgs.name).toBe('John Doe');
      expect(callArgs.email).toBe('john@example.com');
      expect(callArgs.age).toBe(30);
    });
  });
});
