import { Test, TestingModule } from '@nestjs/testing';
import { Sequelize } from 'sequelize-typescript';
import { Transaction } from 'sequelize';
import { SequelizeUnitOfWorkService } from './sequelize-unit-of-work.service';
import { ExecutionContext } from '../types';
import type { IAuditLogger } from '../interfaces/audit/audit-logger.interface';

describe('SequelizeUnitOfWorkService', () => {
  let service: SequelizeUnitOfWorkService;
  let mockSequelize: jest.Mocked<Sequelize>;
  let mockAuditLogger: jest.Mocked<IAuditLogger>;
  let mockTransaction: jest.Mocked<Transaction>;

  beforeEach(async () => {
    // Mock transaction
    mockTransaction = {
      commit: jest.fn().mockResolvedValue(undefined),
      rollback: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<Transaction>;

    // Mock Sequelize
    mockSequelize = {
      transaction: jest.fn().mockImplementation((options, callback) => {
        if (typeof options === 'function') {
          return Promise.resolve(options(mockTransaction));
        }
        return Promise.resolve(callback(mockTransaction));
      }),
    } as unknown as jest.Mocked<Sequelize>;

    // Mock audit logger
    mockAuditLogger = {
      logTransaction: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<IAuditLogger>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SequelizeUnitOfWorkService,
        {
          provide: Sequelize,
          useValue: mockSequelize,
        },
        {
          provide: 'IAuditLogger',
          useValue: mockAuditLogger,
        },
      ],
    }).compile();

    service = module.get<SequelizeUnitOfWorkService>(SequelizeUnitOfWorkService);
  });

  describe('initialization', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should not have transaction initially', () => {
      expect(service.isInTransaction()).toBe(false);
    });
  });

  describe('begin', () => {
    it('should start a new transaction', async () => {
      mockSequelize.transaction = jest.fn().mockResolvedValue(mockTransaction);

      await service.begin();

      expect(mockSequelize.transaction).toHaveBeenCalledWith({
        isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
      });
      expect(service.isInTransaction()).toBe(true);
    });

    it('should throw error if transaction already in progress', async () => {
      mockSequelize.transaction = jest.fn().mockResolvedValue(mockTransaction);

      await service.begin();

      await expect(service.begin()).rejects.toThrow('Transaction already in progress');
    });
  });

  describe('commit', () => {
    it('should commit active transaction', async () => {
      mockSequelize.transaction = jest.fn().mockResolvedValue(mockTransaction);

      await service.begin();
      await service.commit();

      expect(mockTransaction.commit).toHaveBeenCalled();
      expect(service.isInTransaction()).toBe(false);
    });

    it('should throw error if no transaction in progress', async () => {
      await expect(service.commit()).rejects.toThrow('No transaction in progress');
    });
  });

  describe('rollback', () => {
    it('should rollback active transaction', async () => {
      mockSequelize.transaction = jest.fn().mockResolvedValue(mockTransaction);

      await service.begin();
      await service.rollback();

      expect(mockTransaction.rollback).toHaveBeenCalled();
      expect(service.isInTransaction()).toBe(false);
    });

    it('should throw error if no transaction in progress', async () => {
      await expect(service.rollback()).rejects.toThrow('No transaction in progress');
    });
  });

  describe('executeInTransaction', () => {
    const mockContext: ExecutionContext = {
      userId: 'user-123',
      requestId: 'req-456',
      timestamp: new Date(),
    };

    it('should execute operation within transaction', async () => {
      const operation = jest.fn().mockResolvedValue('success');

      const result = await service.executeInTransaction(operation, mockContext);

      expect(result).toBe('success');
      expect(operation).toHaveBeenCalledWith(service);
      expect(mockSequelize.transaction).toHaveBeenCalled();
    });

    it('should commit transaction on success', async () => {
      const operation = jest.fn().mockResolvedValue('success');

      await service.executeInTransaction(operation, mockContext);

      expect(mockAuditLogger.logTransaction).toHaveBeenCalledWith(
        'TRANSACTION_COMMIT',
        mockContext,
        expect.objectContaining({
          success: true,
          duration: expect.any(Number),
        })
      );
    });

    it('should rollback transaction on error', async () => {
      const operation = jest.fn().mockRejectedValue(new Error('Operation failed'));

      await expect(
        service.executeInTransaction(operation, mockContext)
      ).rejects.toThrow('Operation failed');

      expect(mockAuditLogger.logTransaction).toHaveBeenCalledWith(
        'TRANSACTION_ROLLBACK',
        mockContext,
        expect.objectContaining({
          success: false,
          error: 'Operation failed',
        })
      );
    });

    it('should generate transaction ID if not provided', async () => {
      const operation = jest.fn().mockResolvedValue('success');
      const contextWithoutTxId = { ...mockContext, transactionId: undefined };

      await service.executeInTransaction(operation, contextWithoutTxId);

      expect(mockAuditLogger.logTransaction).toHaveBeenCalledWith(
        'TRANSACTION_COMMIT',
        expect.any(Object),
        expect.objectContaining({
          transactionId: expect.stringMatching(/^txn_/),
        })
      );
    });

    it('should use provided transaction ID', async () => {
      const operation = jest.fn().mockResolvedValue('success');
      const contextWithTxId = { ...mockContext, transactionId: 'custom-txn-123' };

      await service.executeInTransaction(operation, contextWithTxId);

      expect(mockAuditLogger.logTransaction).toHaveBeenCalledWith(
        'TRANSACTION_COMMIT',
        expect.any(Object),
        expect.objectContaining({
          transactionId: 'custom-txn-123',
        })
      );
    });

    it('should clean up transaction reference after completion', async () => {
      const operation = jest.fn().mockResolvedValue('success');

      await service.executeInTransaction(operation, mockContext);

      expect(service.isInTransaction()).toBe(false);
    });

    it('should clean up transaction reference after error', async () => {
      const operation = jest.fn().mockRejectedValue(new Error('Failed'));

      await expect(
        service.executeInTransaction(operation, mockContext)
      ).rejects.toThrow();

      expect(service.isInTransaction()).toBe(false);
    });

    it('should track transaction duration', async () => {
      const operation = jest.fn().mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve('success'), 100))
      );

      await service.executeInTransaction(operation, mockContext);

      const logCall = mockAuditLogger.logTransaction.mock.calls[0][2];
      expect(logCall.duration).toBeGreaterThan(0);
    });

    it('should handle nested operations', async () => {
      const nestedOperation = jest.fn().mockResolvedValue('nested-success');
      const mainOperation = jest.fn().mockImplementation(async (uow) => {
        return await nestedOperation(uow);
      });

      const result = await service.executeInTransaction(mainOperation, mockContext);

      expect(result).toBe('nested-success');
      expect(mainOperation).toHaveBeenCalled();
      expect(nestedOperation).toHaveBeenCalled();
    });
  });

  describe('isInTransaction', () => {
    it('should return false initially', () => {
      expect(service.isInTransaction()).toBe(false);
    });

    it('should return true during transaction', async () => {
      const operation = jest.fn().mockImplementation(async (uow) => {
        expect(uow.isInTransaction()).toBe(true);
        return 'success';
      });

      await service.executeInTransaction(operation, {
        userId: 'user-123',
        requestId: 'req-456',
        timestamp: new Date(),
      });
    });

    it('should return false after commit', async () => {
      mockSequelize.transaction = jest.fn().mockResolvedValue(mockTransaction);

      await service.begin();
      expect(service.isInTransaction()).toBe(true);

      await service.commit();
      expect(service.isInTransaction()).toBe(false);
    });

    it('should return false after rollback', async () => {
      mockSequelize.transaction = jest.fn().mockResolvedValue(mockTransaction);

      await service.begin();
      expect(service.isInTransaction()).toBe(true);

      await service.rollback();
      expect(service.isInTransaction()).toBe(false);
    });
  });

  describe('isolation levels', () => {
    it('should use READ_COMMITTED isolation level', async () => {
      mockSequelize.transaction = jest.fn().mockResolvedValue(mockTransaction);

      await service.begin();

      expect(mockSequelize.transaction).toHaveBeenCalledWith({
        isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
      });
    });

    it('should use READ_COMMITTED in executeInTransaction', async () => {
      const operation = jest.fn().mockResolvedValue('success');

      await service.executeInTransaction(operation, {
        userId: 'user-123',
        requestId: 'req-456',
        timestamp: new Date(),
      });

      expect(mockSequelize.transaction).toHaveBeenCalledWith(
        expect.objectContaining({
          isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
        }),
        expect.any(Function)
      );
    });
  });

  describe('error scenarios', () => {
    it('should handle sequelize transaction errors', async () => {
      mockSequelize.transaction = jest
        .fn()
        .mockRejectedValue(new Error('Database connection lost'));

      await expect(service.begin()).rejects.toThrow('Database connection lost');
      expect(service.isInTransaction()).toBe(false);
    });

    it('should handle commit errors', async () => {
      mockTransaction.commit = jest.fn().mockRejectedValue(new Error('Commit failed'));
      mockSequelize.transaction = jest.fn().mockResolvedValue(mockTransaction);

      await service.begin();

      await expect(service.commit()).rejects.toThrow('Commit failed');
    });

    it('should handle rollback errors', async () => {
      mockTransaction.rollback = jest.fn().mockRejectedValue(new Error('Rollback failed'));
      mockSequelize.transaction = jest.fn().mockResolvedValue(mockTransaction);

      await service.begin();

      await expect(service.rollback()).rejects.toThrow('Rollback failed');
    });

    it('should handle audit logging failures gracefully', async () => {
      mockAuditLogger.logTransaction = jest
        .fn()
        .mockRejectedValue(new Error('Audit failed'));

      const operation = jest.fn().mockResolvedValue('success');

      // Should still complete successfully even if audit fails
      const result = await service.executeInTransaction(operation, {
        userId: 'user-123',
        requestId: 'req-456',
        timestamp: new Date(),
      });

      expect(result).toBe('success');
    });
  });
});
