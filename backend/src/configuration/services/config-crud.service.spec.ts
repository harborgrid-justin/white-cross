import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Op } from 'sequelize';
import { ConfigCrudService } from './config-crud.service';
import { SystemConfig, ConfigCategory, ConfigScope, ConfigValueType } from '@/database/models';
import { CreateConfigurationDto, FilterConfigurationDto } from '../dto';

describe('ConfigCrudService', () => {
  let service: ConfigCrudService;
  let mockConfigModel: Record<string, jest.Mock>;

  const mockConfig: Partial<SystemConfig> = {
    id: 'test-id',
    key: 'test.key',
    value: 'test-value',
    valueType: ConfigValueType.STRING,
    category: ConfigCategory.SYSTEM,
    subCategory: null,
    description: 'Test description',
    defaultValue: 'default',
    validValues: null,
    minValue: null,
    maxValue: null,
    isPublic: false,
    isEditable: true,
    requiresRestart: false,
    scope: ConfigScope.SYSTEM,
    scopeId: null,
    tags: ['test'],
    sortOrder: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    destroy: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    mockConfigModel = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      count: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigCrudService,
        {
          provide: getModelToken(SystemConfig),
          useValue: mockConfigModel,
        },
      ],
    }).compile();

    service = module.get<ConfigCrudService>(ConfigCrudService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getConfigByKey', () => {
    it('should retrieve configuration by key', async () => {
      mockConfigModel.findAll.mockResolvedValue([mockConfig]);

      const result = await service.getConfigByKey('test.key');

      expect(mockConfigModel.findAll).toHaveBeenCalledWith({
        where: { key: 'test.key' },
        order: [['scope', 'DESC'], ['createdAt', 'DESC']],
      });
      expect(result).toEqual(mockConfig);
    });

    it('should filter by scopeId when provided', async () => {
      mockConfigModel.findAll.mockResolvedValue([mockConfig]);

      await service.getConfigByKey('test.key', 'scope-123');

      expect(mockConfigModel.findAll).toHaveBeenCalledWith({
        where: { key: 'test.key', scopeId: 'scope-123' },
        order: [['scope', 'DESC'], ['createdAt', 'DESC']],
      });
    });

    it('should throw NotFoundException when config not found', async () => {
      mockConfigModel.findAll.mockResolvedValue([]);

      await expect(service.getConfigByKey('nonexistent.key')).rejects.toThrow(
        NotFoundException
      );
      await expect(service.getConfigByKey('nonexistent.key')).rejects.toThrow(
        'Configuration not found: nonexistent.key'
      );
    });

    it('should return most recent config when multiple exist', async () => {
      const olderConfig = { ...mockConfig, createdAt: new Date('2023-01-01') };
      const newerConfig = { ...mockConfig, createdAt: new Date('2023-12-01') };
      mockConfigModel.findAll.mockResolvedValue([newerConfig, olderConfig]);

      const result = await service.getConfigByKey('test.key');

      expect(result).toEqual(newerConfig);
    });

    it('should handle database errors', async () => {
      mockConfigModel.findAll.mockRejectedValue(new Error('Database error'));

      await expect(service.getConfigByKey('test.key')).rejects.toThrow('Database error');
    });
  });

  describe('getConfigurations', () => {
    it('should retrieve all configurations without filter', async () => {
      mockConfigModel.findAll.mockResolvedValue([mockConfig]);

      const result = await service.getConfigurations({});

      expect(mockConfigModel.findAll).toHaveBeenCalledWith({
        where: {},
        order: [['sortOrder', 'ASC'], ['category', 'ASC'], ['subCategory', 'ASC'], ['key', 'ASC']],
      });
      expect(result).toEqual([mockConfig]);
    });

    it('should filter by category', async () => {
      const filter: FilterConfigurationDto = { category: ConfigCategory.SECURITY };
      mockConfigModel.findAll.mockResolvedValue([]);

      await service.getConfigurations(filter);

      expect(mockConfigModel.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { category: ConfigCategory.SECURITY },
        })
      );
    });

    it('should filter by subCategory', async () => {
      const filter: FilterConfigurationDto = { subCategory: 'auth' };
      mockConfigModel.findAll.mockResolvedValue([]);

      await service.getConfigurations(filter);

      expect(mockConfigModel.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { subCategory: 'auth' },
        })
      );
    });

    it('should filter by scope', async () => {
      const filter: FilterConfigurationDto = { scope: ConfigScope.ORGANIZATION };
      mockConfigModel.findAll.mockResolvedValue([]);

      await service.getConfigurations(filter);

      expect(mockConfigModel.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { scope: ConfigScope.ORGANIZATION },
        })
      );
    });

    it('should filter by scopeId', async () => {
      const filter: FilterConfigurationDto = { scopeId: 'org-123' };
      mockConfigModel.findAll.mockResolvedValue([]);

      await service.getConfigurations(filter);

      expect(mockConfigModel.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { scopeId: 'org-123' },
        })
      );
    });

    it('should filter by isPublic flag', async () => {
      const filter: FilterConfigurationDto = { isPublic: true };
      mockConfigModel.findAll.mockResolvedValue([]);

      await service.getConfigurations(filter);

      expect(mockConfigModel.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { isPublic: true },
        })
      );
    });

    it('should filter by isEditable flag', async () => {
      const filter: FilterConfigurationDto = { isEditable: false };
      mockConfigModel.findAll.mockResolvedValue([]);

      await service.getConfigurations(filter);

      expect(mockConfigModel.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { isEditable: false },
        })
      );
    });

    it('should filter by tags using array overlap', async () => {
      const filter: FilterConfigurationDto = { tags: ['important', 'security'] };
      mockConfigModel.findAll.mockResolvedValue([]);

      await service.getConfigurations(filter);

      expect(mockConfigModel.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { tags: { [Op.overlap]: ['important', 'security'] } },
        })
      );
    });

    it('should apply multiple filters simultaneously', async () => {
      const filter: FilterConfigurationDto = {
        category: ConfigCategory.SYSTEM,
        isPublic: true,
        isEditable: true,
      };
      mockConfigModel.findAll.mockResolvedValue([]);

      await service.getConfigurations(filter);

      expect(mockConfigModel.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            category: ConfigCategory.SYSTEM,
            isPublic: true,
            isEditable: true,
          },
        })
      );
    });

    it('should return empty array when no configurations found', async () => {
      mockConfigModel.findAll.mockResolvedValue([]);

      const result = await service.getConfigurations({});

      expect(result).toEqual([]);
    });

    it('should handle database errors', async () => {
      mockConfigModel.findAll.mockRejectedValue(new Error('Database error'));

      await expect(service.getConfigurations({})).rejects.toThrow('Database error');
    });
  });

  describe('getConfigsByCategory', () => {
    it('should retrieve configurations by category', async () => {
      mockConfigModel.findAll.mockResolvedValue([mockConfig]);

      const result = await service.getConfigsByCategory(ConfigCategory.SECURITY);

      expect(mockConfigModel.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockConfig]);
    });

    it('should include scopeId when provided', async () => {
      mockConfigModel.findAll.mockResolvedValue([mockConfig]);

      await service.getConfigsByCategory(ConfigCategory.SECURITY, 'scope-123');

      expect(mockConfigModel.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            category: ConfigCategory.SECURITY,
            scopeId: 'scope-123',
          }),
        })
      );
    });
  });

  describe('getPublicConfigurations', () => {
    it('should retrieve only public configurations', async () => {
      const publicConfig = { ...mockConfig, isPublic: true };
      mockConfigModel.findAll.mockResolvedValue([publicConfig]);

      const result = await service.getPublicConfigurations();

      expect(mockConfigModel.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ isPublic: true }),
        })
      );
      expect(result).toEqual([publicConfig]);
    });
  });

  describe('createConfiguration', () => {
    const createDto: CreateConfigurationDto = {
      key: 'new.config',
      value: 'new-value',
      valueType: ConfigValueType.STRING,
      category: ConfigCategory.SYSTEM,
      subCategory: 'general',
      description: 'New configuration',
      defaultValue: 'default',
      validValues: null,
      minValue: null,
      maxValue: null,
      isPublic: false,
      isEditable: true,
      requiresRestart: false,
      scope: ConfigScope.SYSTEM,
      scopeId: null,
      tags: ['new'],
      sortOrder: 0,
    };

    it('should create new configuration', async () => {
      mockConfigModel.findOne.mockResolvedValue(null);
      mockConfigModel.create.mockResolvedValue(mockConfig);

      const result = await service.createConfiguration(createDto);

      expect(mockConfigModel.findOne).toHaveBeenCalledWith({
        where: { key: 'new.config' },
      });
      expect(mockConfigModel.create).toHaveBeenCalled();
      expect(result).toEqual(mockConfig);
    });

    it('should throw BadRequestException if key already exists', async () => {
      mockConfigModel.findOne.mockResolvedValue(mockConfig);

      await expect(service.createConfiguration(createDto)).rejects.toThrow(
        BadRequestException
      );
      await expect(service.createConfiguration(createDto)).rejects.toThrow(
        "Configuration with key 'new.config' already exists"
      );
    });

    it('should set default values for optional fields', async () => {
      const minimalDto: CreateConfigurationDto = {
        key: 'minimal.config',
        value: 'value',
        valueType: ConfigValueType.STRING,
        category: ConfigCategory.SYSTEM,
      } as CreateConfigurationDto;

      mockConfigModel.findOne.mockResolvedValue(null);
      mockConfigModel.create.mockResolvedValue(mockConfig);

      await service.createConfiguration(minimalDto);

      expect(mockConfigModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          isPublic: false,
          isEditable: true,
          requiresRestart: false,
          scope: ConfigScope.SYSTEM,
          sortOrder: 0,
        })
      );
    });

    it('should handle database errors', async () => {
      mockConfigModel.findOne.mockResolvedValue(null);
      mockConfigModel.create.mockRejectedValue(new Error('Database error'));

      await expect(service.createConfiguration(createDto)).rejects.toThrow('Database error');
    });
  });

  describe('deleteConfiguration', () => {
    it('should delete configuration by key', async () => {
      const mockDestroy = jest.fn().mockResolvedValue(undefined);
      const configToDelete = { ...mockConfig, destroy: mockDestroy };
      mockConfigModel.findAll.mockResolvedValue([configToDelete]);

      await service.deleteConfiguration('test.key');

      expect(mockDestroy).toHaveBeenCalled();
    });

    it('should include scopeId when provided', async () => {
      const mockDestroy = jest.fn().mockResolvedValue(undefined);
      const configToDelete = { ...mockConfig, destroy: mockDestroy };
      mockConfigModel.findAll.mockResolvedValue([configToDelete]);

      await service.deleteConfiguration('test.key', 'scope-123');

      expect(mockConfigModel.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ scopeId: 'scope-123' }),
        })
      );
      expect(mockDestroy).toHaveBeenCalled();
    });

    it('should throw NotFoundException if config not found', async () => {
      mockConfigModel.findAll.mockResolvedValue([]);

      await expect(service.deleteConfiguration('nonexistent.key')).rejects.toThrow(
        NotFoundException
      );
    });

    it('should handle delete errors', async () => {
      const mockDestroy = jest.fn().mockRejectedValue(new Error('Delete error'));
      const configToDelete = { ...mockConfig, destroy: mockDestroy };
      mockConfigModel.findAll.mockResolvedValue([configToDelete]);

      await expect(service.deleteConfiguration('test.key')).rejects.toThrow('Delete error');
    });
  });

  describe('getConfigsRequiringRestart', () => {
    it('should retrieve configurations requiring restart', async () => {
      const restartConfig = { ...mockConfig, requiresRestart: true };
      mockConfigModel.findAll.mockResolvedValue([restartConfig]);

      const result = await service.getConfigsRequiringRestart();

      expect(mockConfigModel.findAll).toHaveBeenCalledWith({
        where: { requiresRestart: true },
        order: [['category', 'ASC'], ['key', 'ASC']],
      });
      expect(result).toEqual([restartConfig]);
    });

    it('should return empty array when no restart configs exist', async () => {
      mockConfigModel.findAll.mockResolvedValue([]);

      const result = await service.getConfigsRequiringRestart();

      expect(result).toEqual([]);
    });

    it('should handle database errors', async () => {
      mockConfigModel.findAll.mockRejectedValue(new Error('Database error'));

      await expect(service.getConfigsRequiringRestart()).rejects.toThrow('Database error');
    });
  });

  describe('updateConfigAttributes', () => {
    it('should update configuration attributes', async () => {
      const mockUpdate = jest.fn().mockResolvedValue(mockConfig);
      const configToUpdate = { ...mockConfig, update: mockUpdate } as unknown as SystemConfig;
      const updateData = { value: 'new-value', updatedAt: new Date() };

      const result = await service.updateConfigAttributes(configToUpdate, updateData);

      expect(mockUpdate).toHaveBeenCalledWith(updateData, { transaction: undefined });
      expect(result).toEqual(mockConfig);
    });

    it('should support transactions', async () => {
      const mockUpdate = jest.fn().mockResolvedValue(mockConfig);
      const configToUpdate = { ...mockConfig, update: mockUpdate } as unknown as SystemConfig;
      const updateData = { value: 'new-value', updatedAt: new Date() };
      const transaction = { id: 'transaction-123' };

      await service.updateConfigAttributes(configToUpdate, updateData, transaction);

      expect(mockUpdate).toHaveBeenCalledWith(updateData, { transaction });
    });
  });

  describe('findConfigById', () => {
    it('should find configuration by ID', async () => {
      mockConfigModel.findOne.mockResolvedValue(mockConfig);

      const result = await service.findConfigById('test-id');

      expect(mockConfigModel.findOne).toHaveBeenCalledWith({ where: { id: 'test-id' } });
      expect(result).toEqual(mockConfig);
    });

    it('should return null when config not found', async () => {
      mockConfigModel.findOne.mockResolvedValue(null);

      const result = await service.findConfigById('nonexistent-id');

      expect(result).toBeNull();
    });
  });

  describe('configKeyExists', () => {
    it('should return true when config key exists', async () => {
      mockConfigModel.count.mockResolvedValue(1);

      const result = await service.configKeyExists('test.key');

      expect(mockConfigModel.count).toHaveBeenCalledWith({ where: { key: 'test.key' } });
      expect(result).toBe(true);
    });

    it('should return false when config key does not exist', async () => {
      mockConfigModel.count.mockResolvedValue(0);

      const result = await service.configKeyExists('nonexistent.key');

      expect(result).toBe(false);
    });

    it('should return true when multiple configs with same key exist', async () => {
      mockConfigModel.count.mockResolvedValue(3);

      const result = await service.configKeyExists('duplicate.key');

      expect(result).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should handle null scopeId correctly', async () => {
      mockConfigModel.findAll.mockResolvedValue([mockConfig]);

      await service.getConfigByKey('test.key', undefined);

      expect(mockConfigModel.findAll).toHaveBeenCalledWith({
        where: { key: 'test.key' },
        order: [['scope', 'DESC'], ['createdAt', 'DESC']],
      });
    });

    it('should handle empty tags array', async () => {
      const filter: FilterConfigurationDto = { tags: [] };
      mockConfigModel.findAll.mockResolvedValue([]);

      const result = await service.getConfigurations(filter);

      expect(result).toEqual([]);
    });

    it('should handle undefined boolean filters', async () => {
      const filter: FilterConfigurationDto = {
        isPublic: undefined,
        isEditable: undefined,
      };
      mockConfigModel.findAll.mockResolvedValue([]);

      await service.getConfigurations(filter);

      expect(mockConfigModel.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {},
        })
      );
    });
  });
});
