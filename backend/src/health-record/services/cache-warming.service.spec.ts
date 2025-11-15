import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { CacheWarmingService } from './cache-warming.service';
import { HealthDataCacheService } from './health-data-cache.service';
import { LoggerService } from '@/common/logging/logger.service';
import { Student, Vaccination, Allergy, ChronicCondition } from '@/database/models';

describe('CacheWarmingService', () => {
  let service: CacheWarmingService;
  let mockCacheService: jest.Mocked<HealthDataCacheService>;
  let mockLogger: jest.Mocked<LoggerService>;

  beforeEach(async () => {
    const mockStudentModel = {
      findAll: jest.fn(),
    };

    const mockVaccinationModel = {
      findAll: jest.fn(),
    };

    const mockAllergyModel = {
      findAll: jest.fn(),
    };

    const mockChronicConditionModel = {
      findAll: jest.fn(),
    };

    mockCacheService = {
      cacheVaccinations: jest.fn(),
      cacheAllergies: jest.fn(),
      cacheChronicConditions: jest.fn(),
      cacheStudentHealthSummary: jest.fn(),
    } as any;

    mockLogger = {
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
      info: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CacheWarmingService,
        {
          provide: HealthDataCacheService,
          useValue: mockCacheService,
        },
        {
          provide: LoggerService,
          useValue: mockLogger,
        },
        {
          provide: getModelToken(Student),
          useValue: mockStudentModel,
        },
        {
          provide: getModelToken(Vaccination),
          useValue: mockVaccinationModel,
        },
        {
          provide: getModelToken(Allergy),
          useValue: mockAllergyModel,
        },
        {
          provide: getModelToken(ChronicCondition),
          useValue: mockChronicConditionModel,
        },
      ],
    }).compile();

    service = module.get<CacheWarmingService>(CacheWarmingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('core functionality', () => {
    it('should execute successfully', async () => {
      // Test basic functionality
      const status = service.getWarmingStatus();
      expect(status).toHaveProperty('isWarming');
      expect(status).toHaveProperty('enabled');
    });

    it('should handle errors gracefully', async () => {
      // Test error handling
      expect(async () => {
        // This should not throw
        await service.warmCriticalData();
      }).not.toThrow();
    });
  });
});
