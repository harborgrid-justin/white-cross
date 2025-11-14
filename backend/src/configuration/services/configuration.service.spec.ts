import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ConfigurationService } from './configuration.service';
import { ConfigCrudService } from './config-crud.service';
import { ConfigValidationService } from './config-validation.service';
import { ConfigHistoryService } from './config-history.service';
import { ConfigImportExportService } from './config-import-export.service';
import { ConfigStatisticsService } from './config-statistics.service';
import { SystemConfig, ConfigCategory, ConfigValueType } from '@/database/models';
import { UpdateConfigurationDto, ConfigurationBulkUpdateDto } from '../dto';

describe('ConfigurationService', () => {
  let service: ConfigurationService;
  let configCrudService: jest.Mocked<ConfigCrudService>;
  let configValidationService: jest.Mocked<ConfigValidationService>;
  let configHistoryService: jest.Mocked<ConfigHistoryService>;
  let configImportExportService: jest.Mocked<ConfigImportExportService>;
  let configStatisticsService: jest.Mocked<ConfigStatisticsService>;

  const mockConfig: Partial<SystemConfig> = {
    id: 'config-123',
    key: 'test.key',
    value: 'test-value',
    valueType: ConfigValueType.STRING,
    category: ConfigCategory.SYSTEM,
    isEditable: true,
  };

  const mockTransaction = {
    commit: jest.fn(),
    rollback: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigurationService,
        {
          provide: ConfigCrudService,
          useValue: {
            getConfigByKey: jest.fn(),
            getConfigurations: jest.fn(),
            getConfigsByCategory: jest.fn(),
            getPublicConfigurations: jest.fn(),
            createConfiguration: jest.fn(),
            deleteConfiguration: jest.fn(),
            updateConfigAttributes: jest.fn(),
            findConfigById: jest.fn(),
            getConfigsRequiringRestart: jest.fn(),
          },
        },
        {
          provide: ConfigValidationService,
          useValue: {
            validateConfigValue: jest.fn(),
          },
        },
        {
          provide: ConfigHistoryService,
          useValue: {
            createTransaction: jest.fn(),
            commitTransaction: jest.fn(),
            rollbackTransaction: jest.fn(),
            createHistoryRecord: jest.fn(),
            getConfigHistory: jest.fn(),
            getConfigChangesByUser: jest.fn(),
            getRecentChanges: jest.fn(),
          },
        },
        {
          provide: ConfigImportExportService,
          useValue: {
            exportConfigurations: jest.fn(),
            importConfigurations: jest.fn(),
            exportConfigurationsToCSV: jest.fn(),
            createBackup: jest.fn(),
            restoreFromBackup: jest.fn(),
          },
        },
        {
          provide: ConfigStatisticsService,
          useValue: {
            getConfigurationStatistics: jest.fn(),
            getHealthMetrics: jest.fn(),
            generateSummaryReport: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ConfigurationService>(ConfigurationService);
    configCrudService = module.get(ConfigCrudService);
    configValidationService = module.get(ConfigValidationService);
    configHistoryService = module.get(ConfigHistoryService);
    configImportExportService = module.get(ConfigImportExportService);
    configStatisticsService = module.get(ConfigStatisticsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('delegation methods', () => {
    it('should delegate getConfigByKey to CRUD service', async () => {
      configCrudService.getConfigByKey.mockResolvedValue(mockConfig as SystemConfig);

      const result = await service.getConfigByKey('test.key');

      expect(configCrudService.getConfigByKey).toHaveBeenCalledWith('test.key', undefined);
      expect(result).toEqual(mockConfig);
    });

    it('should delegate getConfigurations to CRUD service', async () => {
      configCrudService.getConfigurations.mockResolvedValue([mockConfig as SystemConfig]);

      const result = await service.getConfigurations({});

      expect(configCrudService.getConfigurations).toHaveBeenCalledWith({});
      expect(result).toEqual([mockConfig]);
    });

    it('should delegate getConfigsByCategory to CRUD service', async () => {
      configCrudService.getConfigsByCategory.mockResolvedValue([mockConfig as SystemConfig]);

      const result = await service.getConfigsByCategory(ConfigCategory.SYSTEM);

      expect(configCrudService.getConfigsByCategory).toHaveBeenCalledWith(
        ConfigCategory.SYSTEM,
        undefined
      );
      expect(result).toEqual([mockConfig]);
    });

    it('should delegate getPublicConfigurations to CRUD service', async () => {
      configCrudService.getPublicConfigurations.mockResolvedValue([mockConfig as SystemConfig]);

      const result = await service.getPublicConfigurations();

      expect(configCrudService.getPublicConfigurations).toHaveBeenCalled();
      expect(result).toEqual([mockConfig]);
    });

    it('should delegate createConfiguration to CRUD service', async () => {
      const createDto = { key: 'new.key', value: 'value' } as any;
      configCrudService.createConfiguration.mockResolvedValue(mockConfig as SystemConfig);

      const result = await service.createConfiguration(createDto);

      expect(configCrudService.createConfiguration).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(mockConfig);
    });

    it('should delegate deleteConfiguration to CRUD service', async () => {
      configCrudService.deleteConfiguration.mockResolvedValue(undefined);

      await service.deleteConfiguration('test.key');

      expect(configCrudService.deleteConfiguration).toHaveBeenCalledWith('test.key', undefined);
    });
  });

  describe('updateConfiguration', () => {
    const updateDto: UpdateConfigurationDto = {
      value: 'new-value',
      changedBy: 'user-123',
    };

    it('should update configuration with full audit trail', async () => {
      configHistoryService.createTransaction.mockResolvedValue(mockTransaction);
      configCrudService.getConfigByKey.mockResolvedValue(mockConfig as SystemConfig);
      configValidationService.validateConfigValue.mockReturnValue({ isValid: true });
      configCrudService.updateConfigAttributes.mockResolvedValue(mockConfig as SystemConfig);
      configCrudService.findConfigById.mockResolvedValue(mockConfig as SystemConfig);

      const result = await service.updateConfiguration('test.key', updateDto);

      expect(configHistoryService.createTransaction).toHaveBeenCalled();
      expect(configCrudService.getConfigByKey).toHaveBeenCalledWith('test.key', undefined);
      expect(configValidationService.validateConfigValue).toHaveBeenCalledWith(
        mockConfig,
        'new-value'
      );
      expect(configCrudService.updateConfigAttributes).toHaveBeenCalled();
      expect(configHistoryService.createHistoryRecord).toHaveBeenCalled();
      expect(configHistoryService.commitTransaction).toHaveBeenCalledWith(mockTransaction);
      expect(result).toEqual(mockConfig);
    });

    it('should throw BadRequestException on validation failure', async () => {
      configHistoryService.createTransaction.mockResolvedValue(mockTransaction);
      configCrudService.getConfigByKey.mockResolvedValue(mockConfig as SystemConfig);
      configValidationService.validateConfigValue.mockReturnValue({
        isValid: false,
        error: 'Invalid value',
      });

      await expect(service.updateConfiguration('test.key', updateDto)).rejects.toThrow(
        BadRequestException
      );
      expect(configHistoryService.rollbackTransaction).toHaveBeenCalledWith(mockTransaction);
    });

    it('should rollback transaction on error', async () => {
      configHistoryService.createTransaction.mockResolvedValue(mockTransaction);
      configCrudService.getConfigByKey.mockRejectedValue(new Error('Database error'));

      await expect(service.updateConfiguration('test.key', updateDto)).rejects.toThrow(
        'Database error'
      );
      expect(configHistoryService.rollbackTransaction).toHaveBeenCalledWith(mockTransaction);
    });

    it('should throw NotFoundException if config not found after update', async () => {
      configHistoryService.createTransaction.mockResolvedValue(mockTransaction);
      configCrudService.getConfigByKey.mockResolvedValue(mockConfig as SystemConfig);
      configValidationService.validateConfigValue.mockReturnValue({ isValid: true });
      configCrudService.updateConfigAttributes.mockResolvedValue(mockConfig as SystemConfig);
      configCrudService.findConfigById.mockResolvedValue(null);

      await expect(service.updateConfiguration('test.key', updateDto)).rejects.toThrow(
        NotFoundException
      );
      expect(configHistoryService.rollbackTransaction).toHaveBeenCalledWith(mockTransaction);
    });

    it('should support scopeId parameter', async () => {
      configHistoryService.createTransaction.mockResolvedValue(mockTransaction);
      configCrudService.getConfigByKey.mockResolvedValue(mockConfig as SystemConfig);
      configValidationService.validateConfigValue.mockReturnValue({ isValid: true });
      configCrudService.updateConfigAttributes.mockResolvedValue(mockConfig as SystemConfig);
      configCrudService.findConfigById.mockResolvedValue(mockConfig as SystemConfig);

      await service.updateConfiguration('test.key', updateDto, 'scope-123');

      expect(configCrudService.getConfigByKey).toHaveBeenCalledWith('test.key', 'scope-123');
    });
  });

  describe('bulkUpdateConfigurations', () => {
    it('should update multiple configurations successfully', async () => {
      const bulkUpdate: ConfigurationBulkUpdateDto = {
        updates: [
          { key: 'config1', value: 'value1' },
          { key: 'config2', value: 'value2' },
        ],
        changedBy: 'user-123',
      };

      configHistoryService.createTransaction.mockResolvedValue(mockTransaction);
      configCrudService.getConfigByKey.mockResolvedValue(mockConfig as SystemConfig);
      configValidationService.validateConfigValue.mockReturnValue({ isValid: true });
      configCrudService.updateConfigAttributes.mockResolvedValue(mockConfig as SystemConfig);
      configCrudService.findConfigById.mockResolvedValue(mockConfig as SystemConfig);

      const results = await service.bulkUpdateConfigurations(bulkUpdate);

      expect(results).toHaveLength(2);
      expect(results.every((r) => 'key' in r || 'id' in r)).toBe(true);
    });

    it('should handle partial failures in bulk update', async () => {
      const bulkUpdate: ConfigurationBulkUpdateDto = {
        updates: [
          { key: 'config1', value: 'value1' },
          { key: 'config2', value: 'value2' },
        ],
        changedBy: 'user-123',
      };

      configHistoryService.createTransaction
        .mockResolvedValueOnce(mockTransaction)
        .mockResolvedValueOnce(mockTransaction);
      configCrudService.getConfigByKey
        .mockResolvedValueOnce(mockConfig as SystemConfig)
        .mockRejectedValueOnce(new Error('Config not found'));

      const results = await service.bulkUpdateConfigurations(bulkUpdate);

      expect(results).toHaveLength(2);
      expect(results[1]).toHaveProperty('error');
    });
  });

  describe('resetToDefault', () => {
    it('should reset configuration to default value', async () => {
      const configWithDefault = { ...mockConfig, defaultValue: 'default-value' };
      configCrudService.getConfigByKey.mockResolvedValue(configWithDefault as SystemConfig);
      configHistoryService.createTransaction.mockResolvedValue(mockTransaction);
      configValidationService.validateConfigValue.mockReturnValue({ isValid: true });
      configCrudService.updateConfigAttributes.mockResolvedValue(configWithDefault as SystemConfig);
      configCrudService.findConfigById.mockResolvedValue(configWithDefault as SystemConfig);

      const result = await service.resetToDefault('test.key', 'user-123');

      expect(configCrudService.getConfigByKey).toHaveBeenCalledWith('test.key', undefined);
      expect(result).toEqual(configWithDefault);
    });

    it('should throw BadRequestException if no default value exists', async () => {
      const configWithoutDefault = { ...mockConfig, defaultValue: null };
      configCrudService.getConfigByKey.mockResolvedValue(configWithoutDefault as SystemConfig);

      await expect(service.resetToDefault('test.key', 'user-123')).rejects.toThrow(
        BadRequestException
      );
    });

    it('should support scopeId parameter', async () => {
      const configWithDefault = { ...mockConfig, defaultValue: 'default-value' };
      configCrudService.getConfigByKey.mockResolvedValue(configWithDefault as SystemConfig);
      configHistoryService.createTransaction.mockResolvedValue(mockTransaction);
      configValidationService.validateConfigValue.mockReturnValue({ isValid: true });
      configCrudService.updateConfigAttributes.mockResolvedValue(configWithDefault as SystemConfig);
      configCrudService.findConfigById.mockResolvedValue(configWithDefault as SystemConfig);

      await service.resetToDefault('test.key', 'user-123', 'scope-123');

      expect(configCrudService.getConfigByKey).toHaveBeenCalledWith('test.key', 'scope-123');
    });
  });

  describe('history and statistics delegation', () => {
    it('should delegate getConfigHistory to history service', async () => {
      configHistoryService.getConfigHistory.mockResolvedValue([]);

      const result = await service.getConfigHistory('test.key', 50);

      expect(configHistoryService.getConfigHistory).toHaveBeenCalledWith('test.key', 50);
      expect(result).toEqual([]);
    });

    it('should delegate getConfigChangesByUser to history service', async () => {
      configHistoryService.getConfigChangesByUser.mockResolvedValue([]);

      const result = await service.getConfigChangesByUser('user-123', 50);

      expect(configHistoryService.getConfigChangesByUser).toHaveBeenCalledWith('user-123', 50);
      expect(result).toEqual([]);
    });

    it('should delegate getRecentChanges to history service', async () => {
      configHistoryService.getRecentChanges.mockResolvedValue([]);

      const result = await service.getRecentChanges(100);

      expect(configHistoryService.getRecentChanges).toHaveBeenCalledWith(100);
      expect(result).toEqual([]);
    });

    it('should delegate getConfigsRequiringRestart to CRUD service', async () => {
      configCrudService.getConfigsRequiringRestart.mockResolvedValue([]);

      const result = await service.getConfigsRequiringRestart();

      expect(configCrudService.getConfigsRequiringRestart).toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    it('should delegate exportConfigurations to import/export service', async () => {
      configImportExportService.exportConfigurations.mockResolvedValue('{}');

      const result = await service.exportConfigurations({});

      expect(configImportExportService.exportConfigurations).toHaveBeenCalledWith({});
      expect(result).toBe('{}');
    });

    it('should delegate importConfigurations to import/export service', async () => {
      const importData = { configsJson: '[]', overwrite: false, changedBy: 'user' };
      configImportExportService.importConfigurations.mockResolvedValue({
        created: 0,
        updated: 0,
        errors: [],
      });

      const result = await service.importConfigurations(importData);

      expect(configImportExportService.importConfigurations).toHaveBeenCalledWith(importData);
      expect(result).toEqual({ created: 0, updated: 0, errors: [] });
    });

    it('should delegate getConfigurationStatistics to statistics service', async () => {
      configStatisticsService.getConfigurationStatistics.mockResolvedValue({} as any);

      const result = await service.getConfigurationStatistics();

      expect(configStatisticsService.getConfigurationStatistics).toHaveBeenCalled();
      expect(result).toEqual({});
    });

    it('should delegate getHealthMetrics to statistics service', async () => {
      configStatisticsService.getHealthMetrics.mockResolvedValue({} as any);

      const result = await service.getHealthMetrics();

      expect(configStatisticsService.getHealthMetrics).toHaveBeenCalled();
      expect(result).toEqual({});
    });

    it('should delegate generateSummaryReport to statistics service', async () => {
      configStatisticsService.generateSummaryReport.mockResolvedValue({} as any);

      const result = await service.generateSummaryReport();

      expect(configStatisticsService.generateSummaryReport).toHaveBeenCalled();
      expect(result).toEqual({});
    });
  });

  describe('validateConfigValue', () => {
    it('should delegate validation to validation service', () => {
      configValidationService.validateConfigValue.mockReturnValue({ isValid: true });

      const result = service.validateConfigValue(mockConfig as SystemConfig, 'new-value');

      expect(configValidationService.validateConfigValue).toHaveBeenCalledWith(
        mockConfig,
        'new-value'
      );
      expect(result).toEqual({ isValid: true });
    });
  });

  describe('edge cases', () => {
    it('should handle empty bulk updates', async () => {
      const bulkUpdate: ConfigurationBulkUpdateDto = {
        updates: [],
        changedBy: 'user-123',
      };

      const results = await service.bulkUpdateConfigurations(bulkUpdate);

      expect(results).toEqual([]);
    });

    it('should preserve scopeId through bulk updates', async () => {
      const bulkUpdate: ConfigurationBulkUpdateDto = {
        updates: [{ key: 'config1', value: 'value1', scopeId: 'scope-123' }],
        changedBy: 'user-123',
      };

      configHistoryService.createTransaction.mockResolvedValue(mockTransaction);
      configCrudService.getConfigByKey.mockResolvedValue(mockConfig as SystemConfig);
      configValidationService.validateConfigValue.mockReturnValue({ isValid: true });
      configCrudService.updateConfigAttributes.mockResolvedValue(mockConfig as SystemConfig);
      configCrudService.findConfigById.mockResolvedValue(mockConfig as SystemConfig);

      await service.bulkUpdateConfigurations(bulkUpdate);

      expect(configCrudService.getConfigByKey).toHaveBeenCalledWith('config1', 'scope-123');
    });
  });
});
