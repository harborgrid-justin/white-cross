import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken, getConnectionToken } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize';
import { ConfigHistoryService } from './config-history.service';
import { SystemConfig, ConfigurationHistory } from '@/database/models';
import { UpdateConfigurationDto } from '../dto';

describe('ConfigHistoryService', () => {
  let service: ConfigHistoryService;
  let mockConfigModel: Record<string, jest.Mock>;
  let mockHistoryModel: Record<string, jest.Mock>;
  let mockSequelize: Partial<Sequelize>;

  const mockConfig: Partial<SystemConfig> = {
    id: 'config-123',
    key: 'test.key',
    value: 'current-value',
  };

  const mockHistoryRecord: Partial<ConfigurationHistory> = {
    id: 'history-123',
    configurationId: 'config-123',
    configKey: 'test.key',
    oldValue: 'old-value',
    newValue: 'new-value',
    changedBy: 'user-123',
    changedByName: 'Test User',
    changeReason: 'Configuration update',
    ipAddress: '192.168.1.1',
    userAgent: 'Test Agent',
    createdAt: new Date(),
  };

  beforeEach(async () => {
    mockConfigModel = {
      findAll: jest.fn(),
      findOne: jest.fn(),
    };

    mockHistoryModel = {
      create: jest.fn(),
      findAll: jest.fn(),
      count: jest.fn(),
    };

    mockSequelize = {
      transaction: jest.fn(),
      query: jest.fn(),
      QueryTypes: {
        SELECT: 'SELECT',
      } as any,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigHistoryService,
        {
          provide: getModelToken(SystemConfig),
          useValue: mockConfigModel,
        },
        {
          provide: getModelToken(ConfigurationHistory),
          useValue: mockHistoryModel,
        },
        {
          provide: getConnectionToken(),
          useValue: mockSequelize,
        },
      ],
    }).compile();

    service = module.get<ConfigHistoryService>(ConfigHistoryService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createHistoryRecord', () => {
    const updateDto: UpdateConfigurationDto = {
      value: 'new-value',
      changedBy: 'user-123',
      changedByName: 'Test User',
      changeReason: 'Configuration update',
      ipAddress: '192.168.1.1',
      userAgent: 'Test Agent',
    };

    it('should create history record successfully', async () => {
      mockHistoryModel.create.mockResolvedValue(mockHistoryRecord);

      const result = await service.createHistoryRecord(
        mockConfig as SystemConfig,
        'old-value',
        'new-value',
        updateDto
      );

      expect(mockHistoryModel.create).toHaveBeenCalledWith(
        {
          configurationId: 'config-123',
          configKey: 'test.key',
          oldValue: 'old-value',
          newValue: 'new-value',
          changedBy: 'user-123',
          changedByName: 'Test User',
          changeReason: 'Configuration update',
          ipAddress: '192.168.1.1',
          userAgent: 'Test Agent',
        },
        { transaction: undefined }
      );
      expect(result).toEqual(mockHistoryRecord);
    });

    it('should support transactions', async () => {
      const transaction = { id: 'transaction-123' };
      mockHistoryModel.create.mockResolvedValue(mockHistoryRecord);

      await service.createHistoryRecord(
        mockConfig as SystemConfig,
        'old-value',
        'new-value',
        updateDto,
        transaction
      );

      expect(mockHistoryModel.create).toHaveBeenCalledWith(
        expect.any(Object),
        { transaction }
      );
    });

    it('should handle missing optional fields', async () => {
      const minimalDto: UpdateConfigurationDto = {
        value: 'new-value',
        changedBy: 'user-123',
      };
      mockHistoryModel.create.mockResolvedValue(mockHistoryRecord);

      await service.createHistoryRecord(
        mockConfig as SystemConfig,
        'old-value',
        'new-value',
        minimalDto
      );

      expect(mockHistoryModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          changedBy: 'user-123',
          changedByName: undefined,
          changeReason: undefined,
          ipAddress: undefined,
          userAgent: undefined,
        }),
        expect.any(Object)
      );
    });
  });

  describe('getConfigHistory', () => {
    it('should retrieve history for a configuration key', async () => {
      mockHistoryModel.findAll.mockResolvedValue([mockHistoryRecord]);

      const result = await service.getConfigHistory('test.key');

      expect(mockHistoryModel.findAll).toHaveBeenCalledWith({
        where: { configKey: 'test.key' },
        include: [
          {
            model: mockConfigModel,
            as: 'configuration',
          },
        ],
        order: [['createdAt', 'DESC']],
        limit: 50,
      });
      expect(result).toEqual([mockHistoryRecord]);
    });

    it('should respect custom limit parameter', async () => {
      mockHistoryModel.findAll.mockResolvedValue([mockHistoryRecord]);

      await service.getConfigHistory('test.key', 100);

      expect(mockHistoryModel.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ limit: 100 })
      );
    });

    it('should return empty array when no history exists', async () => {
      mockHistoryModel.findAll.mockResolvedValue([]);

      const result = await service.getConfigHistory('test.key');

      expect(result).toEqual([]);
    });

    it('should handle database errors', async () => {
      mockHistoryModel.findAll.mockRejectedValue(new Error('Database error'));

      await expect(service.getConfigHistory('test.key')).rejects.toThrow('Database error');
    });
  });

  describe('getConfigChangesByUser', () => {
    it('should retrieve changes made by a specific user', async () => {
      mockHistoryModel.findAll.mockResolvedValue([mockHistoryRecord]);

      const result = await service.getConfigChangesByUser('user-123');

      expect(mockHistoryModel.findAll).toHaveBeenCalledWith({
        where: { changedBy: 'user-123' },
        include: [
          {
            model: mockConfigModel,
            as: 'configuration',
          },
        ],
        order: [['createdAt', 'DESC']],
        limit: 50,
      });
      expect(result).toEqual([mockHistoryRecord]);
    });

    it('should respect custom limit parameter', async () => {
      mockHistoryModel.findAll.mockResolvedValue([]);

      await service.getConfigChangesByUser('user-123', 25);

      expect(mockHistoryModel.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ limit: 25 })
      );
    });

    it('should handle database errors', async () => {
      mockHistoryModel.findAll.mockRejectedValue(new Error('Database error'));

      await expect(service.getConfigChangesByUser('user-123')).rejects.toThrow(
        'Database error'
      );
    });
  });

  describe('getRecentChanges', () => {
    it('should retrieve recent configuration changes', async () => {
      mockHistoryModel.findAll.mockResolvedValue([mockHistoryRecord]);

      const result = await service.getRecentChanges();

      expect(mockHistoryModel.findAll).toHaveBeenCalledWith({
        include: [
          {
            model: mockConfigModel,
            as: 'configuration',
          },
        ],
        order: [['createdAt', 'DESC']],
        limit: 100,
      });
      expect(result).toEqual([mockHistoryRecord]);
    });

    it('should respect custom limit parameter', async () => {
      mockHistoryModel.findAll.mockResolvedValue([]);

      await service.getRecentChanges(200);

      expect(mockHistoryModel.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ limit: 200 })
      );
    });

    it('should handle database errors', async () => {
      mockHistoryModel.findAll.mockRejectedValue(new Error('Database error'));

      await expect(service.getRecentChanges()).rejects.toThrow('Database error');
    });
  });

  describe('getConfigChangesByDateRange', () => {
    it('should retrieve changes within date range', async () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-12-31');
      mockHistoryModel.findAll.mockResolvedValue([mockHistoryRecord]);

      const result = await service.getConfigChangesByDateRange(startDate, endDate);

      expect(mockHistoryModel.findAll).toHaveBeenCalledWith({
        where: {
          createdAt: {
            $between: [startDate, endDate],
          },
        },
        include: [
          {
            model: mockConfigModel,
            as: 'configuration',
          },
        ],
        order: [['createdAt', 'DESC']],
        limit: 100,
      });
      expect(result).toEqual([mockHistoryRecord]);
    });

    it('should respect custom limit parameter', async () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-12-31');
      mockHistoryModel.findAll.mockResolvedValue([]);

      await service.getConfigChangesByDateRange(startDate, endDate, 50);

      expect(mockHistoryModel.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ limit: 50 })
      );
    });

    it('should handle database errors', async () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-12-31');
      mockHistoryModel.findAll.mockRejectedValue(new Error('Database error'));

      await expect(
        service.getConfigChangesByDateRange(startDate, endDate)
      ).rejects.toThrow('Database error');
    });
  });

  describe('getChangeStatistics', () => {
    it('should calculate change statistics', async () => {
      mockHistoryModel.count.mockResolvedValue(150);
      (mockSequelize.query as jest.Mock).mockResolvedValueOnce([
        [{ userId: 'user-1', count: '50' }, { userId: 'user-2', count: '30' }],
      ]);
      (mockSequelize.query as jest.Mock).mockResolvedValueOnce([
        [{ configKey: 'config-1', count: '25' }, { configKey: 'config-2', count: '20' }],
      ]);
      (mockSequelize.query as jest.Mock).mockResolvedValueOnce([
        [{ date: '2024-01-01', count: '10' }, { date: '2024-01-02', count: '15' }],
      ]);

      const result = await service.getChangeStatistics(30);

      expect(result).toEqual({
        totalChanges: 150,
        changesByUser: [
          { userId: 'user-1', count: '50' },
          { userId: 'user-2', count: '30' },
        ],
        changesByConfig: [
          { configKey: 'config-1', count: '25' },
          { configKey: 'config-2', count: '20' },
        ],
        changesOverTime: [
          { date: '2024-01-01', count: '10' },
          { date: '2024-01-02', count: '15' },
        ],
      });
    });

    it('should use default 30-day window', async () => {
      mockHistoryModel.count.mockResolvedValue(0);
      (mockSequelize.query as jest.Mock).mockResolvedValue([[]]);

      await service.getChangeStatistics();

      expect(mockHistoryModel.count).toHaveBeenCalled();
      const cutoffDate = (mockHistoryModel.count.mock.calls[0][0] as any).where.createdAt.$gte;
      const expectedDate = new Date();
      expectedDate.setDate(expectedDate.getDate() - 30);

      expect(cutoffDate.getTime()).toBeCloseTo(expectedDate.getTime(), -3);
    });

    it('should handle database errors', async () => {
      mockHistoryModel.count.mockRejectedValue(new Error('Database error'));

      await expect(service.getChangeStatistics()).rejects.toThrow('Database error');
    });
  });

  describe('transaction management', () => {
    it('should create transaction', async () => {
      const mockTransaction = { id: 'transaction-123' };
      (mockSequelize.transaction as jest.Mock).mockResolvedValue(mockTransaction);

      const result = await service.createTransaction();

      expect(mockSequelize.transaction).toHaveBeenCalled();
      expect(result).toEqual(mockTransaction);
    });

    it('should rollback transaction', async () => {
      const mockTransaction = {
        rollback: jest.fn().mockResolvedValue(undefined),
      };

      await service.rollbackTransaction(mockTransaction);

      expect(mockTransaction.rollback).toHaveBeenCalled();
    });

    it('should commit transaction', async () => {
      const mockTransaction = {
        commit: jest.fn().mockResolvedValue(undefined),
      };

      await service.commitTransaction(mockTransaction);

      expect(mockTransaction.commit).toHaveBeenCalled();
    });
  });

  describe('edge cases', () => {
    it('should handle empty change statistics', async () => {
      mockHistoryModel.count.mockResolvedValue(0);
      (mockSequelize.query as jest.Mock).mockResolvedValue([[]]);

      const result = await service.getChangeStatistics();

      expect(result.totalChanges).toBe(0);
      expect(result.changesByUser).toEqual([]);
      expect(result.changesByConfig).toEqual([]);
      expect(result.changesOverTime).toEqual([]);
    });

    it('should handle limit of 0', async () => {
      mockHistoryModel.findAll.mockResolvedValue([]);

      await service.getConfigHistory('test.key', 0);

      expect(mockHistoryModel.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ limit: 0 })
      );
    });

    it('should handle very large date ranges', async () => {
      const startDate = new Date('2000-01-01');
      const endDate = new Date('2099-12-31');
      mockHistoryModel.findAll.mockResolvedValue([]);

      const result = await service.getConfigChangesByDateRange(startDate, endDate);

      expect(result).toEqual([]);
    });

    it('should handle null change reason', async () => {
      const updateDto: UpdateConfigurationDto = {
        value: 'new-value',
        changedBy: 'user-123',
        changeReason: null as any,
      };
      mockHistoryModel.create.mockResolvedValue(mockHistoryRecord);

      await service.createHistoryRecord(
        mockConfig as SystemConfig,
        'old-value',
        'new-value',
        updateDto
      );

      expect(mockHistoryModel.create).toHaveBeenCalledWith(
        expect.objectContaining({ changeReason: null }),
        expect.any(Object)
      );
    });
  });
});
