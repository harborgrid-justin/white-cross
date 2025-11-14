"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.describeErrorHandling = exports.describeStandardCrudOperations = exports.describeServiceDefinition = exports.describeControllerDefinition = exports.expectRateLimiting = exports.expectSanitization = exports.expectAuditTrail = exports.expectNoPhiInResponse = exports.expectPerformance = exports.measureExecutionTime = exports.expectAuditLog = exports.expectRepositoryCall = exports.expectErrorResponse = exports.expectPaginatedResponse = exports.expectSuccessResponse = exports.createMockExecutionContext = exports.createMockResponse = exports.createMockRequest = exports.createMockError = exports.createMockStatistics = exports.createMockPaginationResult = exports.createMockAppointment = exports.createMockMedication = exports.createMockHealthRecord = exports.createMockStudent = exports.createMockUser = exports.createMockCacheManager = exports.createMockLogger = exports.createMockEventEmitter = exports.createMockConfigService = exports.createMockRepository = void 0;
exports.createServiceTestModule = createServiceTestModule;
exports.createControllerTestModule = createControllerTestModule;
const testing_1 = require("@nestjs/testing");
const cache_manager_1 = require("@nestjs/cache-manager");
const config_1 = require("@nestjs/config");
const event_emitter_1 = require("@nestjs/event-emitter");
const common_1 = require("@nestjs/common");
const createMockRepository = () => ({
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
exports.createMockRepository = createMockRepository;
const createMockConfigService = () => ({
    get: jest.fn((key) => {
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
exports.createMockConfigService = createMockConfigService;
const createMockEventEmitter = () => ({
    emit: jest.fn(),
    on: jest.fn(),
    once: jest.fn(),
    removeListener: jest.fn(),
    removeAllListeners: jest.fn(),
});
exports.createMockEventEmitter = createMockEventEmitter;
const createMockLogger = () => ({
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    verbose: jest.fn(),
});
exports.createMockLogger = createMockLogger;
const createMockCacheManager = () => ({
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    reset: jest.fn(),
    store: {
        keys: jest.fn(),
        ttl: jest.fn(),
    },
});
exports.createMockCacheManager = createMockCacheManager;
const createMockUser = (overrides = {}) => ({
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
exports.createMockUser = createMockUser;
const createMockStudent = (overrides = {}) => ({
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
exports.createMockStudent = createMockStudent;
const createMockHealthRecord = (overrides = {}) => ({
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
exports.createMockHealthRecord = createMockHealthRecord;
const createMockMedication = (overrides = {}) => ({
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
exports.createMockMedication = createMockMedication;
const createMockAppointment = (overrides = {}) => ({
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
exports.createMockAppointment = createMockAppointment;
const createMockPaginationResult = (data, total = data.length, page = 1, limit = 10) => ({
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    hasNext: page * limit < total,
    hasPrev: page > 1,
});
exports.createMockPaginationResult = createMockPaginationResult;
const createMockStatistics = (overrides = {}) => ({
    totalStudents: 100,
    activeStudents: 95,
    totalHealthRecords: 500,
    recentHealthRecords: 25,
    upcomingAppointments: 15,
    medicationsActive: 45,
    ...overrides,
});
exports.createMockStatistics = createMockStatistics;
const createMockError = (message = 'Test error', code = 'TEST_ERROR') => {
    const error = new Error(message);
    error.code = code;
    return error;
};
exports.createMockError = createMockError;
const createMockRequest = (overrides = {}) => ({
    user: (0, exports.createMockUser)(),
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
exports.createMockRequest = createMockRequest;
const createMockResponse = () => {
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
exports.createMockResponse = createMockResponse;
const createMockExecutionContext = (overrides = {}) => ({
    switchToHttp: jest.fn(() => ({
        getRequest: jest.fn(() => (0, exports.createMockRequest)(overrides.request)),
        getResponse: jest.fn(() => (0, exports.createMockResponse)()),
    })),
    getHandler: jest.fn(),
    getClass: jest.fn(),
    getArgByIndex: jest.fn(),
    getArgs: jest.fn(),
    getType: jest.fn(),
    switchToRpc: jest.fn(),
    switchToWs: jest.fn(),
});
exports.createMockExecutionContext = createMockExecutionContext;
async function createServiceTestModule(options) {
    const { serviceClass, repositories = [], providers = [], imports = [] } = options;
    const repositoryProviders = repositories.map(({ entity, token, mock }) => ({
        provide: token || (typeof entity === 'string' ? entity : entity.name),
        useValue: mock || (0, exports.createMockRepository)(),
    }));
    const moduleBuilder = testing_1.Test.createTestingModule({
        imports: [
            cache_manager_1.CacheModule.register({
                ttl: 300,
                max: 100,
            }),
            ...imports,
        ],
        providers: [
            serviceClass,
            ...repositoryProviders,
            {
                provide: config_1.ConfigService,
                useValue: (0, exports.createMockConfigService)(),
            },
            {
                provide: event_emitter_1.EventEmitter2,
                useValue: (0, exports.createMockEventEmitter)(),
            },
            {
                provide: common_1.Logger,
                useValue: (0, exports.createMockLogger)(),
            },
            ...providers,
        ],
    });
    const module = await moduleBuilder.compile();
    const service = module.get(serviceClass);
    return { module, service };
}
async function createControllerTestModule(options) {
    const { controllerClass, services = [], providers = [], imports = [] } = options;
    const moduleBuilder = testing_1.Test.createTestingModule({
        imports: [
            cache_manager_1.CacheModule.register({
                ttl: 300,
                max: 100,
            }),
            ...imports,
        ],
        controllers: [controllerClass],
        providers: [
            ...services,
            {
                provide: config_1.ConfigService,
                useValue: (0, exports.createMockConfigService)(),
            },
            {
                provide: common_1.Logger,
                useValue: (0, exports.createMockLogger)(),
            },
            ...providers,
        ],
    });
    const module = await moduleBuilder.compile();
    const controller = module.get(controllerClass);
    return { module, controller };
}
const expectSuccessResponse = (result, expectedData) => {
    expect(result).toBeDefined();
    if (expectedData) {
        expect(result).toEqual(expectedData);
    }
};
exports.expectSuccessResponse = expectSuccessResponse;
const expectPaginatedResponse = (result, expectedLength) => {
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
exports.expectPaginatedResponse = expectPaginatedResponse;
const expectErrorResponse = async (promise, expectedError) => {
    await expect(promise).rejects.toThrow(expectedError);
};
exports.expectErrorResponse = expectErrorResponse;
const expectRepositoryCall = (mockRepo, method, times = 1) => {
    expect(mockRepo[method]).toHaveBeenCalledTimes(times);
};
exports.expectRepositoryCall = expectRepositoryCall;
const expectAuditLog = (mockLogger, message) => {
    expect(mockLogger.log).toHaveBeenCalledWith(expect.stringMatching(message));
};
exports.expectAuditLog = expectAuditLog;
const measureExecutionTime = async (fn) => {
    const start = Date.now();
    const result = await fn();
    const duration = Date.now() - start;
    return { result, duration };
};
exports.measureExecutionTime = measureExecutionTime;
const expectPerformance = async (fn, maxDuration, description = 'operation') => {
    const { result, duration } = await (0, exports.measureExecutionTime)(fn);
    expect(duration).toBeLessThan(maxDuration);
    return result;
};
exports.expectPerformance = expectPerformance;
const expectNoPhiInResponse = (response) => {
    const responseStr = JSON.stringify(response);
    expect(responseStr).not.toMatch(/\d{3}-\d{2}-\d{4}/);
    expect(responseStr).not.toMatch(/\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}/);
    expect(responseStr).not.toMatch(/password/i);
    expect(responseStr).not.toMatch(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/);
};
exports.expectNoPhiInResponse = expectNoPhiInResponse;
const expectAuditTrail = (mockAuditService, action, resourceType) => {
    expect(mockAuditService.logAccess).toHaveBeenCalledWith(expect.objectContaining({
        action,
        resourceType,
        userId: expect.any(String),
        timestamp: expect.any(Date),
    }));
};
exports.expectAuditTrail = expectAuditTrail;
const expectSanitization = (input, output) => {
    expect(output).not.toContain('<script');
    expect(output).not.toContain('javascript:');
    expect(output).not.toContain('onload=');
    expect(output).not.toContain('onerror=');
};
exports.expectSanitization = expectSanitization;
const expectRateLimiting = async (fn, maxCalls) => {
    const calls = Array(maxCalls + 1).fill(0).map(() => fn());
    const results = await Promise.allSettled(calls);
    results.slice(0, maxCalls).forEach((result, index) => {
        expect(result.status).toBe('fulfilled');
    });
    results.slice(maxCalls).forEach((result, index) => {
        expect(result.status).toBe('rejected');
    });
};
exports.expectRateLimiting = expectRateLimiting;
const describeControllerDefinition = (controllerName, controller) => {
    describe('Controller Definition', () => {
        it('should be defined', () => {
            expect(controller).toBeDefined();
        });
        it(`should be instance of ${controllerName}`, () => {
            expect(controller.constructor.name).toBe(controllerName);
        });
    });
};
exports.describeControllerDefinition = describeControllerDefinition;
const describeServiceDefinition = (serviceName, service) => {
    describe('Service Definition', () => {
        it('should be defined', () => {
            expect(service).toBeDefined();
        });
        it(`should be instance of ${serviceName}`, () => {
            expect(service.constructor.name).toBe(serviceName);
        });
    });
};
exports.describeServiceDefinition = describeServiceDefinition;
const describeStandardCrudOperations = (service, mockRepo, entityName) => {
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
                const mockPagination = (0, exports.createMockPaginationResult)(mockEntities);
                mockRepo.findAndCount.mockResolvedValue([mockEntities, mockEntities.length]);
                const result = await service.findAll({ page: 1, limit: 10 });
                (0, exports.expectPaginatedResponse)(result, mockEntities.length);
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
exports.describeStandardCrudOperations = describeStandardCrudOperations;
const describeErrorHandling = (service, mockRepo) => {
    describe('Error Handling', () => {
        it('should handle database connection errors', async () => {
            mockRepo.find.mockRejectedValue(new Error('Database connection failed'));
            await (0, exports.expectErrorResponse)(service.findAll({}), 'Database connection failed');
        });
        it('should handle not found errors', async () => {
            mockRepo.findOneBy.mockResolvedValue(null);
            await (0, exports.expectErrorResponse)(service.findOne('non-existent-id'), /not found/i);
        });
    });
};
exports.describeErrorHandling = describeErrorHandling;
//# sourceMappingURL=test-utilities.js.map