import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Logger } from '@nestjs/common';

/**
 * Test Utilities for NestJS Applications
 * 
 * Provides standardized patterns for testing controllers, services, and other components
 * to reduce code duplication and ensure consistency across test suites.
 */

/**
 * Standard mock implementations
 */
export const createMockRepository = <T = any>(): Partial<Repository<T>> => ({
  find: jest.fn(),
  findOne: jest.fn(),
  findOneBy: jest.fn(),
  findAndCount: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  softDelete: jest.fn(),
  restore: jest.fn(),
  createQueryBuilder: jest.fn(() => ({
    select: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    offset: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    leftJoin: jest.fn().mockReturnThis(),
    innerJoin: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    innerJoinAndSelect: jest.fn().mockReturnThis(),
    getOne: jest.fn(),
    getMany: jest.fn(),
    getManyAndCount: jest.fn(),
    getRawOne: jest.fn(),
    getRawMany: jest.fn(),
    execute: jest.fn(),
  })),
  manager: {
    transaction: jest.fn(),
  },
});

export const createMockConfigService = (): Partial<ConfigService> => ({
  get: jest.fn((key: string) => {
    const config = {
      'database.host': 'localhost',
      'database.port': 5432,
      'jwt.secret': 'test-secret',
      'cache.ttl': 300,
      'email.host': 'smtp.test.com',
      'sms.provider': 'twilio',
    };
    return config[key];
  }),
});

export const createMockEventEmitter = (): Partial<EventEmitter2> => ({
  emit: jest.fn(),
  on: jest.fn(),
  once: jest.fn(),
  removeListener: jest.fn(),
  removeAllListeners: jest.fn(),
});

export const createMockLogger = (): Partial<Logger> => ({
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
  verbose: jest.fn(),
});

export const createMockCacheManager = () => ({
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
  reset: jest.fn(),
  store: {
    keys: jest.fn(),
    ttl: jest.fn(),
  },
});

/**
 * Standard test data factories
 */
export const createMockUser = (overrides: Partial<any> = {}) => ({
  id: 'user-123',
  email: 'test@example.com',
  firstName: 'John',
  lastName: 'Doe',
  role: 'NURSE',
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

export const createMockStudent = (overrides: Partial<any> = {}) => ({
  id: 'student-123',
  firstName: 'Jane',
  lastName: 'Smith',
  studentNumber: 'STU001',
  dateOfBirth: new Date('2010-01-01'),
  grade: '5',
  isActive: true,
  schoolId: 'school-123',
  districtId: 'district-123',
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

export const createMockHealthRecord = (overrides: Partial<any> = {}) => ({
  id: 'health-record-123',
  studentId: 'student-123',
  recordType: 'EXAMINATION',
  date: new Date(),
  description: 'Annual health examination',
  findings: 'Normal examination',
  providerId: 'provider-123',
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

export const createMockMedication = (overrides: Partial<any> = {}) => ({
  id: 'medication-123',
  studentId: 'student-123',
  medicationName: 'Aspirin',
  dosage: '81mg',
  frequency: 'Once daily',
  route: 'ORAL',
  startDate: new Date(),
  prescribedBy: 'Dr. Smith',
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

export const createMockAppointment = (overrides: Partial<any> = {}) => ({
  id: 'appointment-123',
  studentId: 'student-123',
  providerId: 'provider-123',
  appointmentType: 'CHECKUP',
  scheduledDate: new Date(),
  status: 'SCHEDULED',
  notes: 'Annual checkup',
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

/**
 * Standard pagination response factory
 */
export const createMockPaginationResult = <T>(
  data: T[],
  total: number = data.length,
  page: number = 1,
  limit: number = 10
) => ({
  data,
  total,
  page,
  limit,
  totalPages: Math.ceil(total / limit),
  hasNext: page * limit < total,
  hasPrev: page > 1,
});

/**
 * Standard statistics response factory
 */
export const createMockStatistics = (overrides: Partial<any> = {}) => ({
  totalStudents: 100,
  activeStudents: 95,
  totalHealthRecords: 500,
  recentHealthRecords: 25,
  upcomingAppointments: 15,
  medicationsActive: 45,
  ...overrides,
});

/**
 * Standard error response factory
 */
export const createMockError = (message: string = 'Test error', code: string = 'TEST_ERROR') => {
  const error = new Error(message);
  (error as any).code = code;
  return error;
};

/**
 * Standard HTTP request/response mocks
 */
export const createMockRequest = (overrides: Partial<any> = {}) => ({
  user: createMockUser(),
  ip: '127.0.0.1',
  headers: {
    'user-agent': 'test-agent',
    'x-forwarded-for': '127.0.0.1',
  },
  url: '/api/test',
  method: 'GET',
  params: {},
  query: {},
  body: {},
  ...overrides,
});

export const createMockResponse = () => {
  const mockResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
    end: jest.fn().mockReturnThis(),
    header: jest.fn().mockReturnThis(),
    cookie: jest.fn().mockReturnThis(),
    clearCookie: jest.fn().mockReturnThis(),
  };
  return mockResponse;
};

export const createMockExecutionContext = (overrides: Partial<any> = {}) => ({
  switchToHttp: jest.fn(() => ({
    getRequest: jest.fn(() => createMockRequest(overrides.request)),
    getResponse: jest.fn(() => createMockResponse()),
  })),
  getHandler: jest.fn(),
  getClass: jest.fn(),
  getArgByIndex: jest.fn(),
  getArgs: jest.fn(),
  getType: jest.fn(),
  switchToRpc: jest.fn(),
  switchToWs: jest.fn(),
});

/**
 * Standard test module builders
 */
export interface ServiceTestModuleOptions<T> {
  serviceClass: new (...args: any[]) => T;
  repositories?: Array<{ entity: any; mock?: Partial<Repository<any>> }>;
  providers?: any[];
  imports?: any[];
}

export async function createServiceTestModule<T>(
  options: ServiceTestModuleOptions<T>
): Promise<{ module: TestingModule; service: T }> {
  const { serviceClass, repositories = [], providers = [], imports = [] } = options;

  const repositoryProviders = repositories.map(({ entity, mock }) => ({
    provide: getRepositoryToken(entity),
    useValue: mock || createMockRepository(),
  }));

  const moduleBuilder = Test.createTestingModule({
    imports: [
      CacheModule.register({
        ttl: 300,
        max: 100,
      }),
      ...imports,
    ],
    providers: [
      serviceClass,
      ...repositoryProviders,
      {
        provide: ConfigService,
        useValue: createMockConfigService(),
      },
      {
        provide: EventEmitter2,
        useValue: createMockEventEmitter(),
      },
      {
        provide: Logger,
        useValue: createMockLogger(),
      },
      ...providers,
    ],
  });

  const module = await moduleBuilder.compile();
  const service = module.get<T>(serviceClass);

  return { module, service };
}

export interface ControllerTestModuleOptions<T> {
  controllerClass: new (...args: any[]) => T;
  services?: Array<{ provide: any; useValue: any }>;
  providers?: any[];
  imports?: any[];
}

export async function createControllerTestModule<T>(
  options: ControllerTestModuleOptions<T>
): Promise<{ module: TestingModule; controller: T }> {
  const { controllerClass, services = [], providers = [], imports = [] } = options;

  const moduleBuilder = Test.createTestingModule({
    imports: [
      CacheModule.register({
        ttl: 300,
        max: 100,
      }),
      ...imports,
    ],
    controllers: [controllerClass],
    providers: [
      ...services,
      {
        provide: ConfigService,
        useValue: createMockConfigService(),
      },
      {
        provide: Logger,
        useValue: createMockLogger(),
      },
      ...providers,
    ],
  });

  const module = await moduleBuilder.compile();
  const controller = module.get<T>(controllerClass);

  return { module, controller };
}

/**
 * Standard test execution patterns
 */
export const expectSuccessResponse = (result: any, expectedData?: any) => {
  expect(result).toBeDefined();
  if (expectedData) {
    expect(result).toEqual(expectedData);
  }
};

export const expectPaginatedResponse = (result: any, expectedLength?: number) => {
  expect(result).toHaveProperty('data');
  expect(result).toHaveProperty('total');
  expect(result).toHaveProperty('page');
  expect(result).toHaveProperty('limit');
  expect(result).toHaveProperty('totalPages');
  expect(result).toHaveProperty('hasNext');
  expect(result).toHaveProperty('hasPrev');
  expect(Array.isArray(result.data)).toBe(true);
  
  if (expectedLength !== undefined) {
    expect(result.data).toHaveLength(expectedLength);
  }
};

export const expectErrorResponse = async (promise: Promise<any>, expectedError?: string | RegExp) => {
  await expect(promise).rejects.toThrow(expectedError);
};

export const expectRepositoryCall = (mockRepo: any, method: string, times: number = 1) => {
  expect(mockRepo[method]).toHaveBeenCalledTimes(times);
};

export const expectAuditLog = (mockLogger: any, message: string | RegExp) => {
  expect(mockLogger.log).toHaveBeenCalledWith(expect.stringMatching(message));
};

/**
 * Performance testing utilities
 */
export const measureExecutionTime = async <T>(fn: () => Promise<T>): Promise<{ result: T; duration: number }> => {
  const start = Date.now();
  const result = await fn();
  const duration = Date.now() - start;
  return { result, duration };
};

export const expectPerformance = async <T>(
  fn: () => Promise<T>,
  maxDuration: number,
  description: string = 'operation'
): Promise<T> => {
  const { result, duration } = await measureExecutionTime(fn);
  expect(duration).toBeLessThan(maxDuration);
  return result;
};

/**
 * HIPAA compliance testing utilities
 */
export const expectNoPhiInResponse = (response: any) => {
  const responseStr = JSON.stringify(response);
  
  // Check for common PHI patterns
  expect(responseStr).not.toMatch(/\d{3}-\d{2}-\d{4}/); // SSN
  expect(responseStr).not.toMatch(/\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}/); // Credit cards
  expect(responseStr).not.toMatch(/password/i);
  expect(responseStr).not.toMatch(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/); // IP addresses
};

export const expectAuditTrail = (mockAuditService: any, action: string, resourceType: string) => {
  expect(mockAuditService.logAccess).toHaveBeenCalledWith(
    expect.objectContaining({
      action,
      resourceType,
      userId: expect.any(String),
      timestamp: expect.any(Date),
    })
  );
};

/**
 * Security testing utilities
 */
export const expectSanitization = (input: string, output: string) => {
  expect(output).not.toContain('<script');
  expect(output).not.toContain('javascript:');
  expect(output).not.toContain('onload=');
  expect(output).not.toContain('onerror=');
};

export const expectRateLimiting = async (fn: () => Promise<any>, maxCalls: number) => {
  const calls = Array(maxCalls + 1).fill(0).map(() => fn());
  const results = await Promise.allSettled(calls);
  
  // First maxCalls should succeed
  results.slice(0, maxCalls).forEach((result, index) => {
    expect(result.status).toBe('fulfilled');
  });
  
  // Additional calls should fail
  results.slice(maxCalls).forEach((result, index) => {
    expect(result.status).toBe('rejected');
  });
};

/**
 * Common describe block patterns
 */
export const describeControllerDefinition = (controllerName: string, controller: any) => {
  describe('Controller Definition', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });

    it(`should be instance of ${controllerName}`, () => {
      expect(controller.constructor.name).toBe(controllerName);
    });
  });
};

export const describeServiceDefinition = (serviceName: string, service: any) => {
  describe('Service Definition', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it(`should be instance of ${serviceName}`, () => {
      expect(service.constructor.name).toBe(serviceName);
    });
  });
};

export const describeStandardCrudOperations = (service: any, mockRepo: any, entityName: string) => {
  describe(`${entityName} CRUD Operations`, () => {
    describe('create', () => {
      it(`should create ${entityName.toLowerCase()} successfully`, async () => {
        const createDto = {};
        const mockEntity = { id: 'test-id', ...createDto };
        
        mockRepo.create.mockReturnValue(mockEntity);
        mockRepo.save.mockResolvedValue(mockEntity);

        const result = await service.create(createDto);
        
        expect(result).toEqual(mockEntity);
        expect(mockRepo.create).toHaveBeenCalledWith(createDto);
        expect(mockRepo.save).toHaveBeenCalledWith(mockEntity);
      });
    });

    describe('findAll', () => {
      it(`should return paginated ${entityName.toLowerCase()} list`, async () => {
        const mockEntities = [{ id: '1' }, { id: '2' }];
        const mockPagination = createMockPaginationResult(mockEntities);
        
        mockRepo.findAndCount.mockResolvedValue([mockEntities, mockEntities.length]);

        const result = await service.findAll({ page: 1, limit: 10 });
        
        expectPaginatedResponse(result, mockEntities.length);
      });
    });

    describe('findOne', () => {
      it(`should return ${entityName.toLowerCase()} by ID`, async () => {
        const mockEntity = { id: 'test-id' };
        mockRepo.findOneBy.mockResolvedValue(mockEntity);

        const result = await service.findOne('test-id');
        
        expect(result).toEqual(mockEntity);
        expect(mockRepo.findOneBy).toHaveBeenCalledWith({ id: 'test-id' });
      });
    });

    describe('update', () => {
      it(`should update ${entityName.toLowerCase()} successfully`, async () => {
        const updateDto = { name: 'Updated Name' };
        const mockEntity = { id: 'test-id', ...updateDto };
        
        mockRepo.save.mockResolvedValue(mockEntity);

        const result = await service.update('test-id', updateDto);
        
        expect(result).toEqual(mockEntity);
        expect(mockRepo.save).toHaveBeenCalled();
      });
    });

    describe('remove', () => {
      it(`should soft delete ${entityName.toLowerCase()}`, async () => {
        mockRepo.softDelete.mockResolvedValue({ affected: 1 });

        await service.remove('test-id');
        
        expect(mockRepo.softDelete).toHaveBeenCalledWith('test-id');
      });
    });
  });
};

export const describeErrorHandling = (service: any, mockRepo: any) => {
  describe('Error Handling', () => {
    it('should handle database connection errors', async () => {
      mockRepo.find.mockRejectedValue(new Error('Database connection failed'));

      await expectErrorResponse(
        service.findAll({}),
        'Database connection failed'
      );
    });

    it('should handle not found errors', async () => {
      mockRepo.findOneBy.mockResolvedValue(null);

      await expectErrorResponse(
        service.findOne('non-existent-id'),
        /not found/i
      );
    });
  });
};
