import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken, getConnectionToken } from '@nestjs/sequelize';
import { QueryTypes, Sequelize } from 'sequelize';
import { ConfigStatisticsService } from './config-statistics.service';
import { SystemConfig, ConfigCategory, ConfigScope } from '@/database/models';

describe('ConfigStatisticsService', () => {
  let service: ConfigStatisticsService;
  let mockConfigModel: Record<string, jest.Mock>;
  let mockSequelize: Partial<Sequelize>;

  beforeEach(async () => {
    mockConfigModel = {
      count: jest.fn(),
    };

    mockSequelize = {
      query: jest.fn(),
      QueryTypes: {
        SELECT: 'SELECT',
      } as unknown as typeof QueryTypes,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigStatisticsService,
        {
          provide: getModelToken(SystemConfig),
          useValue: mockConfigModel,
        },
        {
          provide: getConnectionToken(),
          useValue: mockSequelize,
        },
      ],
    }).compile();

    service = module.get<ConfigStatisticsService>(ConfigStatisticsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getConfigurationStatistics', () => {
    it('should return comprehensive configuration statistics', async () => {
      mockConfigModel.count.mockResolvedValueOnce(100);
      (mockSequelize.query as jest.Mock)
        .mockResolvedValueOnce([
          [
            { category: ConfigCategory.SYSTEM, count: '50' },
            { category: ConfigCategory.SECURITY, count: '30' },
          ],
        ])
        .mockResolvedValueOnce([
          [
            { scope: ConfigScope.SYSTEM, count: '70' },
            { scope: ConfigScope.ORGANIZATION, count: '30' },
          ],
        ]);
      mockConfigModel.count.mockResolvedValueOnce(40);
      mockConfigModel.count.mockResolvedValueOnce(80);

      const result = await service.getConfigurationStatistics();

      expect(result).toEqual({
        totalCount: 100,
        publicCount: 40,
        privateCount: 60,
        editableCount: 80,
        lockedCount: 20,
        categoryBreakdown: {
          [ConfigCategory.SYSTEM]: 50,
          [ConfigCategory.SECURITY]: 30,
        },
        scopeBreakdown: {
          [ConfigScope.SYSTEM]: 70,
          [ConfigScope.ORGANIZATION]: 30,
        },
      });
    });

    it('should handle empty database', async () => {
      mockConfigModel.count.mockResolvedValue(0);
      (mockSequelize.query as jest.Mock).mockResolvedValue([[]]);

      const result = await service.getConfigurationStatistics();

      expect(result.totalCount).toBe(0);
      expect(result.publicCount).toBe(0);
      expect(result.privateCount).toBe(0);
    });

    it('should handle database errors', async () => {
      mockConfigModel.count.mockRejectedValue(new Error('Database error'));

      await expect(service.getConfigurationStatistics()).rejects.toThrow('Database error');
    });
  });

  describe('getValueTypeBreakdown', () => {
    it('should return breakdown by value type', async () => {
      (mockSequelize.query as jest.Mock).mockResolvedValue([
        [
          { valueType: 'STRING', count: '50' },
          { valueType: 'NUMBER', count: '30' },
          { valueType: 'BOOLEAN', count: '20' },
        ],
      ]);

      const result = await service.getValueTypeBreakdown();

      expect(result).toEqual({
        STRING: 50,
        NUMBER: 30,
        BOOLEAN: 20,
      });
    });

    it('should handle empty result', async () => {
      (mockSequelize.query as jest.Mock).mockResolvedValue([[]]);

      const result = await service.getValueTypeBreakdown();

      expect(result).toEqual({});
    });

    it('should handle database errors', async () => {
      (mockSequelize.query as jest.Mock).mockRejectedValue(new Error('Database error'));

      await expect(service.getValueTypeBreakdown()).rejects.toThrow('Database error');
    });
  });

  describe('getRestartRequiredCount', () => {
    it('should return count of configurations requiring restart', async () => {
      mockConfigModel.count.mockResolvedValue(15);

      const result = await service.getRestartRequiredCount();

      expect(mockConfigModel.count).toHaveBeenCalledWith({
        where: { requiresRestart: true },
      });
      expect(result).toBe(15);
    });

    it('should return 0 when no restart required configs', async () => {
      mockConfigModel.count.mockResolvedValue(0);

      const result = await service.getRestartRequiredCount();

      expect(result).toBe(0);
    });

    it('should handle database errors', async () => {
      mockConfigModel.count.mockRejectedValue(new Error('Database error'));

      await expect(service.getRestartRequiredCount()).rejects.toThrow('Database error');
    });
  });

  describe('getHealthMetrics', () => {
    it('should calculate health metrics', async () => {
      mockConfigModel.count
        .mockResolvedValueOnce(100) // total
        .mockResolvedValueOnce(80) // with defaults
        .mockResolvedValueOnce(70) // with validation
        .mockResolvedValueOnce(40) // public
        .mockResolvedValueOnce(90); // editable

      const result = await service.getHealthMetrics();

      expect(result).toEqual({
        totalConfigs: 100,
        configsWithDefaults: 80,
        configsWithValidation: 70,
        publicConfigs: 40,
        editableConfigs: 90,
        healthScore: expect.any(Number),
      });
      expect(result.healthScore).toBeGreaterThan(0);
      expect(result.healthScore).toBeLessThanOrEqual(100);
    });

    it('should return 0 health score for empty database', async () => {
      mockConfigModel.count.mockResolvedValue(0);

      const result = await service.getHealthMetrics();

      expect(result.healthScore).toBe(0);
    });

    it('should handle database errors', async () => {
      mockConfigModel.count.mockRejectedValue(new Error('Database error'));

      await expect(service.getHealthMetrics()).rejects.toThrow('Database error');
    });
  });

  describe('getConfigurationTrends', () => {
    it('should return configuration trends over time', async () => {
      (mockSequelize.query as jest.Mock).mockResolvedValue([
        [
          { date: '2024-01-01', created: 10, updated: 5 },
          { date: '2024-01-02', created: 8, updated: 12 },
        ],
      ]);

      const result = await service.getConfigurationTrends(30);

      expect(result).toEqual([
        { date: '2024-01-01', created: 10, updated: 5 },
        { date: '2024-01-02', created: 8, updated: 12 },
      ]);
    });

    it('should use default 30-day window', async () => {
      (mockSequelize.query as jest.Mock).mockResolvedValue([[]]);

      await service.getConfigurationTrends();

      expect(mockSequelize.query).toHaveBeenCalled();
    });

    it('should handle custom time window', async () => {
      (mockSequelize.query as jest.Mock).mockResolvedValue([[]]);

      await service.getConfigurationTrends(90);

      expect(mockSequelize.query).toHaveBeenCalled();
    });

    it('should handle database errors', async () => {
      (mockSequelize.query as jest.Mock).mockRejectedValue(new Error('Database error'));

      await expect(service.getConfigurationTrends()).rejects.toThrow('Database error');
    });
  });

  describe('getMostChangedConfigurations', () => {
    it('should return most frequently changed configurations', async () => {
      (mockSequelize.query as jest.Mock).mockResolvedValue([
        [
          {
            key: 'frequently.changed',
            category: 'system',
            changeCount: 50,
            lastChanged: new Date('2024-01-01'),
          },
          {
            key: 'another.config',
            category: 'security',
            changeCount: 30,
            lastChanged: new Date('2024-01-02'),
          },
        ],
      ]);

      const result = await service.getMostChangedConfigurations(10);

      expect(result).toHaveLength(2);
      expect(result[0].key).toBe('frequently.changed');
      expect(result[0].changeCount).toBe(50);
    });

    it('should respect custom limit', async () => {
      (mockSequelize.query as jest.Mock).mockResolvedValue([[]]);

      await service.getMostChangedConfigurations(5);

      expect(mockSequelize.query).toHaveBeenCalledWith(
        expect.stringContaining('LIMIT'),
        expect.objectContaining({
          replacements: { limit: 5 },
        })
      );
    });

    it('should return empty array when no changes exist', async () => {
      (mockSequelize.query as jest.Mock).mockResolvedValue([[]]);

      const result = await service.getMostChangedConfigurations();

      expect(result).toEqual([]);
    });

    it('should handle database errors', async () => {
      (mockSequelize.query as jest.Mock).mockRejectedValue(new Error('Database error'));

      await expect(service.getMostChangedConfigurations()).rejects.toThrow('Database error');
    });
  });

  describe('getCategoryStats', () => {
    it('should return statistics by category', async () => {
      (mockSequelize.query as jest.Mock).mockResolvedValue([
        [
          {
            category: 'system',
            totalConfigs: 50,
            publicConfigs: 20,
            editableConfigs: 40,
            configsWithDefaults: 45,
          },
          {
            category: 'security',
            totalConfigs: 30,
            publicConfigs: 10,
            editableConfigs: 25,
            configsWithDefaults: 28,
          },
        ],
      ]);

      const result = await service.getCategoryStats();

      expect(result).toHaveLength(2);
      expect(result[0].category).toBe('system');
      expect(result[0].totalConfigs).toBe(50);
    });

    it('should return empty array when no categories exist', async () => {
      (mockSequelize.query as jest.Mock).mockResolvedValue([[]]);

      const result = await service.getCategoryStats();

      expect(result).toEqual([]);
    });

    it('should handle database errors', async () => {
      (mockSequelize.query as jest.Mock).mockRejectedValue(new Error('Database error'));

      await expect(service.getCategoryStats()).rejects.toThrow('Database error');
    });
  });

  describe('generateSummaryReport', () => {
    it('should generate comprehensive summary report', async () => {
      // Mock for getConfigurationStatistics
      mockConfigModel.count.mockResolvedValueOnce(100);
      (mockSequelize.query as jest.Mock)
        .mockResolvedValueOnce([[]])
        .mockResolvedValueOnce([[]])
        .mockResolvedValueOnce([[]])
        .mockResolvedValueOnce([[]])
        .mockResolvedValueOnce([[]])
        .mockResolvedValueOnce([[]])
        .mockResolvedValueOnce([[]]);
      mockConfigModel.count
        .mockResolvedValueOnce(40)
        .mockResolvedValueOnce(80)
        .mockResolvedValueOnce(100)
        .mockResolvedValueOnce(80)
        .mockResolvedValueOnce(70)
        .mockResolvedValueOnce(40)
        .mockResolvedValueOnce(90);

      const result = await service.generateSummaryReport();

      expect(result).toHaveProperty('overview');
      expect(result).toHaveProperty('healthMetrics');
      expect(result).toHaveProperty('categoryStats');
      expect(result).toHaveProperty('mostChanged');
      expect(result).toHaveProperty('valueTypeBreakdown');
      expect(result).toHaveProperty('generatedAt');
      expect(result.generatedAt).toBeInstanceOf(Date);
    });

    it('should handle errors in component methods', async () => {
      mockConfigModel.count.mockRejectedValue(new Error('Database error'));

      await expect(service.generateSummaryReport()).rejects.toThrow('Database error');
    });
  });

  describe('edge cases', () => {
    it('should handle null counts gracefully', async () => {
      mockConfigModel.count.mockResolvedValue(null as any);
      (mockSequelize.query as jest.Mock).mockResolvedValue([[]]);

      const result = await service.getConfigurationStatistics();

      expect(result.totalCount).toBeNull();
    });

    it('should handle invalid SQL results', async () => {
      (mockSequelize.query as jest.Mock).mockResolvedValue(null);

      await expect(service.getValueTypeBreakdown()).rejects.toThrow();
    });

    it('should handle zero configurations', async () => {
      mockConfigModel.count.mockResolvedValue(0);
      (mockSequelize.query as jest.Mock).mockResolvedValue([[]]);

      const result = await service.getConfigurationStatistics();

      expect(result.totalCount).toBe(0);
      expect(result.publicCount).toBe(0);
      expect(result.privateCount).toBe(0);
    });

    it('should handle large numbers correctly', async () => {
      mockConfigModel.count.mockResolvedValue(999999);

      const result = await service.getRestartRequiredCount();

      expect(result).toBe(999999);
    });
  });
});
