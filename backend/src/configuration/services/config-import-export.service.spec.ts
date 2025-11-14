import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { ConfigImportExportService } from './config-import-export.service';
import { ConfigCrudService } from './config-crud.service';
import { ConfigValidationService } from './config-validation.service';
import { FilterConfigurationDto, ImportConfigurationsDto } from '../dto';
import { SystemConfig } from '@/database/models';

describe('ConfigImportExportService', () => {
  let service: ConfigImportExportService;
  let configCrudService: jest.Mocked<ConfigCrudService>;
  let configValidationService: jest.Mocked<ConfigValidationService>;

  const mockConfig: Partial<SystemConfig> = {
    id: 'test-id',
    key: 'test.key',
    value: 'test-value',
    valueType: 'STRING' as any,
    category: 'system' as any,
    subCategory: 'general',
    description: 'Test config',
    defaultValue: 'default',
    validValues: ['value1', 'value2'],
    minValue: null,
    maxValue: null,
    isPublic: true,
    isEditable: true,
    requiresRestart: false,
    scope: 'SYSTEM' as any,
    scopeId: null,
    tags: ['test'],
    sortOrder: 0,
  };

  beforeEach(async () => {
    const mockCrudService = {
      getConfigurations: jest.fn(),
      configKeyExists: jest.fn(),
      getConfigByKey: jest.fn(),
      updateConfigAttributes: jest.fn(),
      createConfiguration: jest.fn(),
    };

    const mockValidationService = {
      validateConfigurationData: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigImportExportService,
        {
          provide: ConfigCrudService,
          useValue: mockCrudService,
        },
        {
          provide: ConfigValidationService,
          useValue: mockValidationService,
        },
      ],
    }).compile();

    service = module.get<ConfigImportExportService>(ConfigImportExportService);
    configCrudService = module.get(ConfigCrudService);
    configValidationService = module.get(ConfigValidationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('exportConfigurations', () => {
    it('should export configurations as JSON string', async () => {
      const configs = [mockConfig as SystemConfig];
      configCrudService.getConfigurations.mockResolvedValue(configs);

      const result = await service.exportConfigurations({});

      expect(configCrudService.getConfigurations).toHaveBeenCalledWith({});
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');

      const parsed = JSON.parse(result);
      expect(parsed).toHaveLength(1);
      expect(parsed[0].key).toBe('test.key');
      expect(parsed[0]).not.toHaveProperty('id');
    });

    it('should filter configurations based on provided filter', async () => {
      const filter: FilterConfigurationDto = { category: 'system' as any };
      configCrudService.getConfigurations.mockResolvedValue([]);

      await service.exportConfigurations(filter);

      expect(configCrudService.getConfigurations).toHaveBeenCalledWith(filter);
    });

    it('should exclude internal fields from export', async () => {
      const configs = [mockConfig as SystemConfig];
      configCrudService.getConfigurations.mockResolvedValue(configs);

      const result = await service.exportConfigurations({});
      const parsed = JSON.parse(result);

      expect(parsed[0]).not.toHaveProperty('id');
      expect(parsed[0]).not.toHaveProperty('createdAt');
      expect(parsed[0]).not.toHaveProperty('updatedAt');
    });

    it('should handle export errors', async () => {
      configCrudService.getConfigurations.mockRejectedValue(
        new Error('Database error')
      );

      await expect(service.exportConfigurations({})).rejects.toThrow('Database error');
    });

    it('should export empty array when no configurations found', async () => {
      configCrudService.getConfigurations.mockResolvedValue([]);

      const result = await service.exportConfigurations({});
      const parsed = JSON.parse(result);

      expect(parsed).toEqual([]);
    });
  });

  describe('importConfigurations', () => {
    const validImportData: ImportConfigurationsDto = {
      configsJson: JSON.stringify([
        {
          key: 'import.test',
          value: 'test-value',
          valueType: 'STRING',
          category: 'system',
        },
      ]),
      overwrite: false,
      changedBy: 'test-user',
    };

    it('should import new configurations successfully', async () => {
      configValidationService.validateConfigurationData.mockReturnValue({
        isValid: true,
      });
      configCrudService.configKeyExists.mockResolvedValue(false);
      configCrudService.createConfiguration.mockResolvedValue(mockConfig as SystemConfig);

      const result = await service.importConfigurations(validImportData);

      expect(result.created).toBe(1);
      expect(result.updated).toBe(0);
      expect(result.errors).toHaveLength(0);
      expect(configCrudService.createConfiguration).toHaveBeenCalled();
    });

    it('should update existing configurations when overwrite is true', async () => {
      const importData: ImportConfigurationsDto = {
        ...validImportData,
        overwrite: true,
      };

      configValidationService.validateConfigurationData.mockReturnValue({
        isValid: true,
      });
      configCrudService.configKeyExists.mockResolvedValue(true);
      configCrudService.getConfigByKey.mockResolvedValue(mockConfig as SystemConfig);
      configCrudService.updateConfigAttributes.mockResolvedValue(mockConfig as SystemConfig);

      const result = await service.importConfigurations(importData);

      expect(result.updated).toBe(1);
      expect(result.created).toBe(0);
      expect(configCrudService.updateConfigAttributes).toHaveBeenCalled();
    });

    it('should skip existing configurations when overwrite is false', async () => {
      configValidationService.validateConfigurationData.mockReturnValue({
        isValid: true,
      });
      configCrudService.configKeyExists.mockResolvedValue(true);

      const result = await service.importConfigurations(validImportData);

      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toContain('already exists');
      expect(result.created).toBe(0);
      expect(result.updated).toBe(0);
    });

    it('should reject invalid JSON format', async () => {
      const invalidData: ImportConfigurationsDto = {
        configsJson: 'invalid json',
        overwrite: false,
        changedBy: 'test-user',
      };

      await expect(service.importConfigurations(invalidData)).rejects.toThrow();
    });

    it('should reject non-array JSON', async () => {
      const invalidData: ImportConfigurationsDto = {
        configsJson: JSON.stringify({ key: 'value' }),
        overwrite: false,
        changedBy: 'test-user',
      };

      await expect(service.importConfigurations(invalidData)).rejects.toThrow(
        BadRequestException
      );
    });

    it('should skip configurations without key', async () => {
      const noKeyData: ImportConfigurationsDto = {
        configsJson: JSON.stringify([{ value: 'test' }]),
        overwrite: false,
        changedBy: 'test-user',
      };

      const result = await service.importConfigurations(noKeyData);

      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toContain('missing required field: key');
    });

    it('should handle validation errors', async () => {
      configValidationService.validateConfigurationData.mockReturnValue({
        isValid: false,
        error: 'Invalid value type',
      });

      const result = await service.importConfigurations(validImportData);

      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toContain('Invalid value type');
    });

    it('should continue processing after individual errors', async () => {
      const multipleConfigs: ImportConfigurationsDto = {
        configsJson: JSON.stringify([
          { key: 'config1', value: 'value1', valueType: 'STRING', category: 'system' },
          { key: 'config2', value: 'value2', valueType: 'STRING', category: 'system' },
        ]),
        overwrite: false,
        changedBy: 'test-user',
      };

      configValidationService.validateConfigurationData
        .mockReturnValueOnce({ isValid: false, error: 'Error in config1' })
        .mockReturnValueOnce({ isValid: true });
      configCrudService.configKeyExists.mockResolvedValue(false);
      configCrudService.createConfiguration.mockResolvedValue(mockConfig as SystemConfig);

      const result = await service.importConfigurations(multipleConfigs);

      expect(result.created).toBe(1);
      expect(result.errors).toHaveLength(1);
    });
  });

  describe('exportConfigurationsToCSV', () => {
    it('should export configurations as CSV string', async () => {
      const configs = [mockConfig as SystemConfig];
      configCrudService.getConfigurations.mockResolvedValue(configs);

      const result = await service.exportConfigurationsToCSV({});

      expect(result).toContain('key,value,valueType');
      expect(result).toContain('test.key,test-value,STRING');
    });

    it('should escape CSV special characters', async () => {
      const configWithComma = {
        ...mockConfig,
        value: 'value,with,commas',
        description: 'description with "quotes"',
      };
      configCrudService.getConfigurations.mockResolvedValue([configWithComma as SystemConfig]);

      const result = await service.exportConfigurationsToCSV({});

      expect(result).toContain('"value,with,commas"');
      expect(result).toContain('"description with ""quotes"""');
    });

    it('should handle empty configurations', async () => {
      configCrudService.getConfigurations.mockResolvedValue([]);

      const result = await service.exportConfigurationsToCSV({});
      const lines = result.split('\n');

      expect(lines[0]).toContain('key,value,valueType');
      expect(lines).toHaveLength(1);
    });

    it('should handle export errors', async () => {
      configCrudService.getConfigurations.mockRejectedValue(new Error('Export error'));

      await expect(service.exportConfigurationsToCSV({})).rejects.toThrow('Export error');
    });
  });

  describe('createBackup', () => {
    it('should create backup with metadata', async () => {
      const configs = [mockConfig as SystemConfig];
      configCrudService.getConfigurations.mockResolvedValue(configs);

      const result = await service.createBackup({});

      expect(result.timestamp).toBeDefined();
      expect(result.count).toBe(1);
      expect(result.data).toBeDefined();
      expect(result.metadata).toBeDefined();
      expect(result.metadata.version).toBe('1.0.0');
      expect(result.metadata.filter).toEqual({});
    });

    it('should include filter in backup metadata', async () => {
      const filter: FilterConfigurationDto = { category: 'security' as any };
      configCrudService.getConfigurations.mockResolvedValue([]);

      const result = await service.createBackup(filter);

      expect(result.metadata.filter).toEqual(filter);
    });

    it('should handle backup creation errors', async () => {
      configCrudService.getConfigurations.mockRejectedValue(new Error('Backup error'));

      await expect(service.createBackup({})).rejects.toThrow('Backup error');
    });
  });

  describe('restoreFromBackup', () => {
    it('should restore configurations from valid backup', async () => {
      const backupData = JSON.stringify({
        data: JSON.stringify([
          { key: 'restored.key', value: 'value', valueType: 'STRING', category: 'system' },
        ]),
      });

      configValidationService.validateConfigurationData.mockReturnValue({ isValid: true });
      configCrudService.configKeyExists.mockResolvedValue(false);
      configCrudService.createConfiguration.mockResolvedValue(mockConfig as SystemConfig);

      const result = await service.restoreFromBackup(backupData, false);

      expect(result.created).toBe(1);
      expect(result.updated).toBe(0);
    });

    it('should reject backup without data field', async () => {
      const invalidBackup = JSON.stringify({ timestamp: 'test' });

      await expect(service.restoreFromBackup(invalidBackup, false)).rejects.toThrow(
        BadRequestException
      );
    });

    it('should handle restore errors', async () => {
      const backupData = JSON.stringify({
        data: 'invalid json',
      });

      await expect(service.restoreFromBackup(backupData, false)).rejects.toThrow();
    });
  });

  describe('validateImportData', () => {
    it('should validate correct import data', () => {
      const validData = JSON.stringify([
        { key: 'test.key', value: 'value' },
      ]);

      const result = service.validateImportData(validData);

      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject invalid JSON', () => {
      const result = service.validateImportData('invalid json');

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Invalid JSON format');
    });

    it('should reject non-array data', () => {
      const result = service.validateImportData(JSON.stringify({ key: 'value' }));

      expect(result.isValid).toBe(false);
      expect(result.error).toContain('must be an array');
    });

    it('should reject configurations without key', () => {
      const data = JSON.stringify([{ value: 'value' }]);

      const result = service.validateImportData(data);

      expect(result.isValid).toBe(false);
      expect(result.error).toContain('must have a key field');
    });

    it('should reject configurations without value', () => {
      const data = JSON.stringify([{ key: 'test.key' }]);

      const result = service.validateImportData(data);

      expect(result.isValid).toBe(false);
      expect(result.error).toContain('must have a value field');
    });
  });

  describe('escapeCsvValue', () => {
    it('should escape values with commas', () => {
      const service = new ConfigImportExportService(
        configCrudService,
        configValidationService
      );
      const testValue = 'value,with,commas';

      // Access private method through any
      const result = (service as any).escapeCsvValue(testValue);

      expect(result).toBe('"value,with,commas"');
    });

    it('should escape values with quotes', () => {
      const service = new ConfigImportExportService(
        configCrudService,
        configValidationService
      );
      const testValue = 'value with "quotes"';

      const result = (service as any).escapeCsvValue(testValue);

      expect(result).toBe('"value with ""quotes"""');
    });

    it('should not escape simple values', () => {
      const service = new ConfigImportExportService(
        configCrudService,
        configValidationService
      );
      const testValue = 'simplevalue';

      const result = (service as any).escapeCsvValue(testValue);

      expect(result).toBe('simplevalue');
    });

    it('should handle empty strings', () => {
      const service = new ConfigImportExportService(
        configCrudService,
        configValidationService
      );

      const result = (service as any).escapeCsvValue('');

      expect(result).toBe('');
    });

    it('should handle null values', () => {
      const service = new ConfigImportExportService(
        configCrudService,
        configValidationService
      );

      const result = (service as any).escapeCsvValue(null);

      expect(result).toBe('');
    });
  });
});
