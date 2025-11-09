"use strict";
/**
 * @fileoverview Testing Utilities Kit - Comprehensive NestJS testing utilities
 * @module reuse/testing-utilities-kit
 * @description Complete testing toolkit for NestJS applications with utilities for
 * unit testing, integration testing, E2E testing, mocking, fixtures, and test data
 * generation. Provides reusable patterns for building robust, maintainable tests.
 *
 * Key Features:
 * - Test module builders and configuration
 * - Mock factory patterns for services and repositories
 * - Database seeding and cleanup utilities
 * - Request/response mocking helpers
 * - E2E test utilities with authentication
 * - Integration test helpers for multi-module scenarios
 * - Unit test patterns and best practices
 * - Spy and stub creators for dependencies
 * - Test data generators with Faker integration
 * - Fixture management and loading
 * - Test cleanup and teardown utilities
 * - Coverage helpers and reporting
 * - Snapshot testing utilities
 * - HIPAA-compliant test data generation
 * - Healthcare-specific test scenarios
 *
 * @target NestJS v10.x, Jest v29.x, Node 18+, TypeScript 5.x
 *
 * @security
 * - No real PHI in test data (HIPAA compliance)
 * - Encrypted test data patterns
 * - Secure mock credentials
 * - Test isolation and cleanup
 * - Safe database state management
 * - Audit log verification in tests
 *
 * @example Basic test module setup
 * ```typescript
 * import { createTestingModuleBuilder, mockRepository } from './testing-utilities-kit';
 *
 * describe('UserService', () => {
 *   let service: UserService;
 *   let repository: Repository<User>;
 *
 *   beforeEach(async () => {
 *     const module = await createTestingModuleBuilder()
 *       .addProvider(UserService)
 *       .addMockRepository(User)
 *       .compile();
 *
 *     service = module.get<UserService>(UserService);
 *     repository = module.get(getRepositoryToken(User));
 *   });
 * });
 * ```
 *
 * @example E2E testing with authentication
 * ```typescript
 * import { createE2ETestApp, authenticateUser, cleanupE2E } from './testing-utilities-kit';
 *
 * describe('Auth E2E', () => {
 *   let app: INestApplication;
 *   let authToken: string;
 *
 *   beforeAll(async () => {
 *     app = await createE2ETestApp();
 *     authToken = await authenticateUser(app, { email: 'test@example.com' });
 *   });
 *
 *   afterAll(() => cleanupE2E(app));
 * });
 * ```
 *
 * @example Mock data generation
 * ```typescript
 * import { generateMockUser, generateMockPatient, seedDatabase } from './testing-utilities-kit';
 *
 * const user = generateMockUser({ role: 'doctor' });
 * const patient = generateMockPatient({ hasInsurance: true });
 *
 * await seedDatabase(sequelize, {
 *   users: [user],
 *   patients: [patient]
 * });
 * ```
 *
 * LOC: TEST-UTIL-001
 * UPSTREAM: @nestjs/testing, jest, @faker-js/faker, supertest
 * DOWNSTREAM: test suites, spec files, E2E tests
 *
 * @version 1.0.0
 * @since 2025-11-08
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.restoreSpies = exports.createStub = exports.createSpies = exports.createSpy = exports.matchSnapshot = exports.sanitizeSnapshot = exports.createFixtureManager = exports.createFixtureWithTeardown = exports.loadFixture = exports.assertArrayResponse = exports.assertValidationError = exports.assertErrorResponse = exports.assertPaginatedResponse = exports.assertResponse = exports.seedE2EDatabase = exports.cleanupE2E = exports.authenticatedRequest = exports.authenticateUser = exports.createE2ETestApp = exports.mockAuthenticatedRequest = exports.mockNext = exports.mockResponse = exports.mockRequest = exports.generateTestPhone = exports.generateTestEmail = exports.generateMockArray = exports.generateMockMedication = exports.generateMockAppointment = exports.generateMockPatient = exports.generateMockUser = exports.resetDatabase = exports.restoreDatabaseSnapshot = exports.createDatabaseSnapshot = exports.cleanupDatabase = exports.seedDatabase = exports.mockLogger = exports.mockEventEmitter = exports.mockJwtService = exports.mockConfigService = exports.mockHttpService = exports.mockService = exports.mockSequelizeModel = exports.mockRepository = exports.createTestModuleWithProviders = exports.addMockRepository = exports.createIsolatedTestModule = exports.createTestModuleWithDatabase = exports.createTestingModuleBuilder = exports.MockStrategy = exports.TestType = void 0;
exports.createTestTransaction = exports.mockSystemTime = exports.createIsolatedTestContext = exports.setupTestTimeout = exports.configureTestEnvironment = exports.assertArrayContainsObject = exports.assertAsyncThrows = exports.assertNestedProperty = exports.assertDateFormat = exports.assertValidPhoneNumber = exports.assertValidEmail = exports.assertValidUUID = exports.measureThroughput = exports.stressTestUntilFailure = exports.loadTestWithRamping = exports.simulateConcurrentRequests = exports.profileAsyncOperation = exports.measureMemoryUsage = exports.assertPerformanceThreshold = exports.benchmarkFunction = exports.measureExecutionTime = exports.mockGraphQLResolver = exports.assertGraphQLError = exports.assertGraphQLResponse = exports.executeGraphQLQuery = exports.createGraphQLMutation = exports.createGraphQLQuery = exports.assertWebSocketEventEmitted = exports.waitForWebSocketEvent = exports.simulateWebSocketConnection = exports.mockWebSocketServer = exports.mockWebSocketClient = exports.flushPromises = exports.waitForAsync = exports.createTestTeardown = exports.createAfterEachCleanup = exports.validateCoverageThresholds = exports.generateCoverageSummary = void 0;
const testing_1 = require("@nestjs/testing");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const sequelize_1 = require("sequelize");
const faker_1 = require("@faker-js/faker");
const request = __importStar(require("supertest"));
const crypto = __importStar(require("crypto"));
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * @enum TestType
 * @description Types of tests for categorization
 */
var TestType;
(function (TestType) {
    TestType["UNIT"] = "UNIT";
    TestType["INTEGRATION"] = "INTEGRATION";
    TestType["E2E"] = "E2E";
    TestType["PERFORMANCE"] = "PERFORMANCE";
    TestType["SECURITY"] = "SECURITY";
})(TestType || (exports.TestType = TestType = {}));
/**
 * @enum MockStrategy
 * @description Strategies for mocking dependencies
 */
var MockStrategy;
(function (MockStrategy) {
    MockStrategy["FULL"] = "FULL";
    MockStrategy["PARTIAL"] = "PARTIAL";
    MockStrategy["SPY"] = "SPY";
    MockStrategy["NONE"] = "NONE";
})(MockStrategy || (exports.MockStrategy = MockStrategy = {}));
// ============================================================================
// TEST MODULE BUILDERS
// ============================================================================
/**
 * Creates a test module builder with common configuration
 *
 * @param {TestModuleConfig} [config] - Module configuration
 * @returns {TestingModuleBuilder} Configured module builder
 *
 * @example
 * ```typescript
 * const module = await createTestingModuleBuilder({
 *   providers: [UserService],
 *   mockStrategy: MockStrategy.FULL
 * }).compile();
 * ```
 */
const createTestingModuleBuilder = (config = {}) => {
    const builder = testing_1.Test.createTestingModule({
        imports: config.imports || [],
        controllers: config.controllers || [],
        providers: config.providers || [],
    });
    return builder;
};
exports.createTestingModuleBuilder = createTestingModuleBuilder;
/**
 * Creates a test module with in-memory database
 *
 * @param {Type<any>[]} entities - Database entities
 * @param {any[]} [providers] - Additional providers
 * @param {'sqlite' | 'postgres' | 'mysql'} [dbType='sqlite'] - Database type
 * @returns {Promise<TestingModule>} Compiled test module
 *
 * @example
 * ```typescript
 * const module = await createTestModuleWithDatabase(
 *   [User, Patient],
 *   [UserService, PatientService],
 *   'sqlite'
 * );
 * ```
 */
const createTestModuleWithDatabase = async (entities, providers = [], dbType = 'sqlite') => {
    const { TypeOrmModule } = require('@nestjs/typeorm');
    const databaseConfig = {
        sqlite: {
            type: 'sqlite',
            database: ':memory:',
            synchronize: true,
            logging: false,
            dropSchema: true,
        },
        postgres: {
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            database: 'test_db',
            synchronize: true,
            logging: false,
            dropSchema: true,
        },
        mysql: {
            type: 'mysql',
            host: 'localhost',
            port: 3306,
            database: 'test_db',
            synchronize: true,
            logging: false,
            dropSchema: true,
        },
    };
    return testing_1.Test.createTestingModule({
        imports: [
            TypeOrmModule.forRoot({
                ...databaseConfig[dbType],
                entities,
            }),
            TypeOrmModule.forFeature(entities),
        ],
        providers,
    }).compile();
};
exports.createTestModuleWithDatabase = createTestModuleWithDatabase;
/**
 * Creates isolated test module for unit testing
 *
 * @param {Type<any>} serviceClass - Service class to test
 * @param {any[]} [mockDependencies] - Mock dependencies
 * @returns {Promise<TestingModule>} Compiled test module
 *
 * @example
 * ```typescript
 * const module = await createIsolatedTestModule(UserService, [
 *   { provide: UserRepository, useValue: mockRepository() }
 * ]);
 * ```
 */
const createIsolatedTestModule = async (serviceClass, mockDependencies = []) => {
    return testing_1.Test.createTestingModule({
        providers: [serviceClass, ...mockDependencies],
    }).compile();
};
exports.createIsolatedTestModule = createIsolatedTestModule;
/**
 * Adds mock repository to module builder
 *
 * @param {TestingModuleBuilder} builder - Module builder
 * @param {Type<any>} entity - Entity class
 * @param {Partial<MockRepositoryOptions>} [methods] - Custom mock methods
 * @returns {TestingModuleBuilder} Updated builder
 *
 * @example
 * ```typescript
 * const builder = Test.createTestingModule({});
 * addMockRepository(builder, User, { findOne: jest.fn().mockResolvedValue(mockUser) });
 * ```
 */
const addMockRepository = (builder, entity, methods = {}) => {
    const mockRepo = (0, exports.mockRepository)(methods);
    return builder.overrideProvider((0, typeorm_1.getRepositoryToken)(entity)).useValue(mockRepo);
};
exports.addMockRepository = addMockRepository;
/**
 * Creates test module with custom providers
 *
 * @param {any[]} providers - Providers to include
 * @param {any[]} [overrides] - Provider overrides
 * @returns {Promise<TestingModule>} Compiled test module
 *
 * @example
 * ```typescript
 * const module = await createTestModuleWithProviders(
 *   [UserService, EmailService],
 *   [{ provide: EmailService, useValue: mockEmailService }]
 * );
 * ```
 */
const createTestModuleWithProviders = async (providers, overrides = []) => {
    let builder = testing_1.Test.createTestingModule({ providers });
    overrides.forEach((override) => {
        builder = builder.overrideProvider(override.provide).useValue(override.useValue);
    });
    return builder.compile();
};
exports.createTestModuleWithProviders = createTestModuleWithProviders;
// ============================================================================
// MOCK FACTORY PATTERNS
// ============================================================================
/**
 * Creates a mock TypeORM repository
 *
 * @param {Partial<MockRepositoryOptions>} [methods] - Custom mock methods
 * @returns {any} Mock repository
 *
 * @example
 * ```typescript
 * const repo = mockRepository({
 *   findOne: jest.fn().mockResolvedValue(user)
 * });
 * ```
 */
const mockRepository = (methods = {}) => {
    return {
        find: methods.find || jest.fn().mockResolvedValue([]),
        findOne: methods.findOne || jest.fn().mockResolvedValue(null),
        findOneBy: methods.findOne || jest.fn().mockResolvedValue(null),
        save: methods.save || jest.fn().mockImplementation((entity) => Promise.resolve(entity)),
        create: methods.create || jest.fn().mockImplementation((dto) => dto),
        update: methods.update || jest.fn().mockResolvedValue({ affected: 1 }),
        delete: methods.delete || jest.fn().mockResolvedValue({ affected: 1 }),
        remove: methods.remove || jest.fn().mockImplementation((entity) => Promise.resolve(entity)),
        count: methods.count || jest.fn().mockResolvedValue(0),
        findAndCount: jest.fn().mockResolvedValue([[], 0]),
        createQueryBuilder: jest.fn().mockReturnValue({
            where: jest.fn().mockReturnThis(),
            andWhere: jest.fn().mockReturnThis(),
            orWhere: jest.fn().mockReturnThis(),
            leftJoin: jest.fn().mockReturnThis(),
            leftJoinAndSelect: jest.fn().mockReturnThis(),
            orderBy: jest.fn().mockReturnThis(),
            skip: jest.fn().mockReturnThis(),
            take: jest.fn().mockReturnThis(),
            getOne: jest.fn().mockResolvedValue(null),
            getMany: jest.fn().mockResolvedValue([]),
            getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
            execute: jest.fn().mockResolvedValue(undefined),
        }),
        ...methods.customMethods,
    };
};
exports.mockRepository = mockRepository;
/**
 * Creates a mock Sequelize model
 *
 * @param {any} [mockData] - Default mock data
 * @returns {any} Mock Sequelize model
 *
 * @example
 * ```typescript
 * const UserModel = mockSequelizeModel({ id: 1, email: 'test@example.com' });
 * ```
 */
const mockSequelizeModel = (mockData = {}) => {
    return {
        findAll: jest.fn().mockResolvedValue([]),
        findOne: jest.fn().mockResolvedValue(mockData),
        findByPk: jest.fn().mockResolvedValue(mockData),
        create: jest.fn().mockResolvedValue(mockData),
        update: jest.fn().mockResolvedValue([1, [mockData]]),
        destroy: jest.fn().mockResolvedValue(1),
        bulkCreate: jest.fn().mockResolvedValue([mockData]),
        count: jest.fn().mockResolvedValue(0),
        findAndCountAll: jest.fn().mockResolvedValue({ rows: [], count: 0 }),
        build: jest.fn().mockReturnValue(mockData),
        upsert: jest.fn().mockResolvedValue([mockData, true]),
    };
};
exports.mockSequelizeModel = mockSequelizeModel;
/**
 * Creates mock service with common methods
 *
 * @param {string[]} [methods] - Method names to mock
 * @returns {any} Mock service
 *
 * @example
 * ```typescript
 * const mockEmailService = mockService(['sendEmail', 'sendWelcome']);
 * mockEmailService.sendEmail.mockResolvedValue(true);
 * ```
 */
const mockService = (methods = []) => {
    const mock = {};
    methods.forEach((method) => {
        mock[method] = jest.fn();
    });
    return mock;
};
exports.mockService = mockService;
/**
 * Creates mock HTTP service for external API calls
 *
 * @param {any} [defaultResponse] - Default response data
 * @returns {any} Mock HTTP service
 *
 * @example
 * ```typescript
 * const httpService = mockHttpService({ data: { success: true } });
 * ```
 */
const mockHttpService = (defaultResponse = {}) => {
    return {
        get: jest.fn().mockResolvedValue({ data: defaultResponse }),
        post: jest.fn().mockResolvedValue({ data: defaultResponse }),
        put: jest.fn().mockResolvedValue({ data: defaultResponse }),
        patch: jest.fn().mockResolvedValue({ data: defaultResponse }),
        delete: jest.fn().mockResolvedValue({ data: defaultResponse }),
        request: jest.fn().mockResolvedValue({ data: defaultResponse }),
    };
};
exports.mockHttpService = mockHttpService;
/**
 * Creates mock ConfigService
 *
 * @param {Record<string, any>} [config] - Configuration values
 * @returns {any} Mock ConfigService
 *
 * @example
 * ```typescript
 * const configService = mockConfigService({
 *   JWT_SECRET: 'test-secret',
 *   DATABASE_URL: 'sqlite::memory:'
 * });
 * ```
 */
const mockConfigService = (config = {}) => {
    return {
        get: jest.fn((key, defaultValue) => config[key] ?? defaultValue),
        getOrThrow: jest.fn((key) => {
            if (!(key in config))
                throw new Error(`Config key ${key} not found`);
            return config[key];
        }),
    };
};
exports.mockConfigService = mockConfigService;
/**
 * Creates mock JWT service
 *
 * @param {string} [secret='test-secret'] - JWT secret
 * @returns {any} Mock JwtService
 *
 * @example
 * ```typescript
 * const jwtService = mockJwtService('my-secret');
 * ```
 */
const mockJwtService = (secret = 'test-secret') => {
    return {
        sign: jest.fn((payload) => `mock-token-${JSON.stringify(payload)}`),
        verify: jest.fn((token) => JSON.parse(token.replace('mock-token-', ''))),
        decode: jest.fn((token) => JSON.parse(token.replace('mock-token-', ''))),
    };
};
exports.mockJwtService = mockJwtService;
/**
 * Creates mock event emitter
 *
 * @returns {any} Mock EventEmitter2
 *
 * @example
 * ```typescript
 * const eventEmitter = mockEventEmitter();
 * eventEmitter.emit.mockImplementation((event, payload) => { ... });
 * ```
 */
const mockEventEmitter = () => {
    return {
        emit: jest.fn().mockResolvedValue(undefined),
        emitAsync: jest.fn().mockResolvedValue([]),
        on: jest.fn(),
        once: jest.fn(),
        removeListener: jest.fn(),
        removeAllListeners: jest.fn(),
    };
};
exports.mockEventEmitter = mockEventEmitter;
/**
 * Creates mock logger
 *
 * @returns {any} Mock Logger
 *
 * @example
 * ```typescript
 * const logger = mockLogger();
 * expect(logger.log).toHaveBeenCalledWith('User created');
 * ```
 */
const mockLogger = () => {
    return {
        log: jest.fn(),
        error: jest.fn(),
        warn: jest.fn(),
        debug: jest.fn(),
        verbose: jest.fn(),
        setContext: jest.fn(),
    };
};
exports.mockLogger = mockLogger;
// ============================================================================
// DATABASE SEEDING AND CLEANUP
// ============================================================================
/**
 * Seeds database with test data
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {DatabaseSeedData} seedData - Seed data by entity
 * @param {boolean} [truncate=true] - Truncate before seeding
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await seedDatabase(sequelize, {
 *   users: [{ email: 'test@example.com', name: 'Test User' }],
 *   patients: [{ firstName: 'John', lastName: 'Doe' }]
 * });
 * ```
 */
const seedDatabase = async (sequelize, seedData, truncate = true) => {
    if (truncate) {
        await sequelize.truncate({ cascade: true, restartIdentity: true });
    }
    for (const [tableName, records] of Object.entries(seedData)) {
        if (records && records.length > 0) {
            const model = sequelize.model(tableName);
            await model.bulkCreate(records);
        }
    }
};
exports.seedDatabase = seedDatabase;
/**
 * Cleans up database after tests
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string[]} [tableNames] - Specific tables to clean (all if omitted)
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await cleanupDatabase(sequelize, ['users', 'sessions']);
 * ```
 */
const cleanupDatabase = async (sequelize, tableNames) => {
    if (tableNames) {
        for (const tableName of tableNames) {
            await sequelize.model(tableName).destroy({ where: {}, truncate: true });
        }
    }
    else {
        await sequelize.truncate({ cascade: true, restartIdentity: true });
    }
};
exports.cleanupDatabase = cleanupDatabase;
/**
 * Creates database snapshot for rollback
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string[]} [tableNames] - Tables to snapshot
 * @returns {Promise<DatabaseSeedData>} Snapshot data
 *
 * @example
 * ```typescript
 * const snapshot = await createDatabaseSnapshot(sequelize, ['users']);
 * // ... run tests ...
 * await restoreDatabaseSnapshot(sequelize, snapshot);
 * ```
 */
const createDatabaseSnapshot = async (sequelize, tableNames) => {
    const snapshot = {};
    const tables = tableNames || Object.keys(sequelize.models);
    for (const tableName of tables) {
        const model = sequelize.model(tableName);
        const records = await model.findAll({ raw: true });
        snapshot[tableName] = records;
    }
    return snapshot;
};
exports.createDatabaseSnapshot = createDatabaseSnapshot;
/**
 * Restores database from snapshot
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {DatabaseSeedData} snapshot - Snapshot data
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await restoreDatabaseSnapshot(sequelize, snapshot);
 * ```
 */
const restoreDatabaseSnapshot = async (sequelize, snapshot) => {
    await (0, exports.seedDatabase)(sequelize, snapshot, true);
};
exports.restoreDatabaseSnapshot = restoreDatabaseSnapshot;
/**
 * Resets database to clean state
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await resetDatabase(sequelize);
 * ```
 */
const resetDatabase = async (sequelize) => {
    await sequelize.drop();
    await sequelize.sync({ force: true });
};
exports.resetDatabase = resetDatabase;
// ============================================================================
// TEST DATA GENERATORS
// ============================================================================
/**
 * Generates mock user data
 *
 * @param {Partial<any>} [overrides] - Property overrides
 * @param {boolean} [hipaaCompliant=true] - Use HIPAA-compliant data
 * @returns {any} Mock user
 *
 * @example
 * ```typescript
 * const user = generateMockUser({ role: 'doctor', email: 'doctor@hospital.com' });
 * ```
 */
const generateMockUser = (overrides = {}, hipaaCompliant = true) => {
    return {
        id: crypto.randomUUID(),
        email: hipaaCompliant ? faker_1.faker.internet.email() : overrides.email || faker_1.faker.internet.email(),
        username: faker_1.faker.internet.userName(),
        firstName: faker_1.faker.person.firstName(),
        lastName: faker_1.faker.person.lastName(),
        role: 'user',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...overrides,
    };
};
exports.generateMockUser = generateMockUser;
/**
 * Generates mock patient data (HIPAA-compliant)
 *
 * @param {Partial<any>} [overrides] - Property overrides
 * @returns {any} Mock patient
 *
 * @example
 * ```typescript
 * const patient = generateMockPatient({ hasInsurance: true });
 * ```
 */
const generateMockPatient = (overrides = {}) => {
    const mrn = `MRN${faker_1.faker.string.numeric(8)}`;
    return {
        id: crypto.randomUUID(),
        mrn,
        firstName: faker_1.faker.person.firstName(),
        lastName: faker_1.faker.person.lastName(),
        dateOfBirth: faker_1.faker.date.past({ years: 50 }),
        gender: faker_1.faker.helpers.arrayElement(['Male', 'Female', 'Other']),
        phoneNumber: faker_1.faker.phone.number(),
        email: faker_1.faker.internet.email(),
        address: {
            street: faker_1.faker.location.streetAddress(),
            city: faker_1.faker.location.city(),
            state: faker_1.faker.location.state(),
            zipCode: faker_1.faker.location.zipCode(),
        },
        emergencyContact: {
            name: faker_1.faker.person.fullName(),
            relationship: faker_1.faker.helpers.arrayElement(['Spouse', 'Parent', 'Sibling', 'Friend']),
            phone: faker_1.faker.phone.number(),
        },
        hasInsurance: faker_1.faker.datatype.boolean(),
        createdAt: new Date(),
        updatedAt: new Date(),
        ...overrides,
    };
};
exports.generateMockPatient = generateMockPatient;
/**
 * Generates mock appointment data
 *
 * @param {Partial<any>} [overrides] - Property overrides
 * @returns {any} Mock appointment
 *
 * @example
 * ```typescript
 * const appointment = generateMockAppointment({
 *   patientId: 'patient-123',
 *   doctorId: 'doctor-456'
 * });
 * ```
 */
const generateMockAppointment = (overrides = {}) => {
    const startTime = faker_1.faker.date.future();
    const endTime = new Date(startTime.getTime() + 30 * 60000); // 30 minutes
    return {
        id: crypto.randomUUID(),
        patientId: crypto.randomUUID(),
        doctorId: crypto.randomUUID(),
        startTime,
        endTime,
        status: faker_1.faker.helpers.arrayElement(['scheduled', 'confirmed', 'completed', 'cancelled']),
        type: faker_1.faker.helpers.arrayElement(['consultation', 'follow-up', 'emergency', 'routine']),
        notes: faker_1.faker.lorem.sentence(),
        createdAt: new Date(),
        updatedAt: new Date(),
        ...overrides,
    };
};
exports.generateMockAppointment = generateMockAppointment;
/**
 * Generates mock medication data
 *
 * @param {Partial<any>} [overrides] - Property overrides
 * @returns {any} Mock medication
 *
 * @example
 * ```typescript
 * const medication = generateMockMedication({ name: 'Aspirin' });
 * ```
 */
const generateMockMedication = (overrides = {}) => {
    return {
        id: crypto.randomUUID(),
        name: faker_1.faker.helpers.arrayElement(['Aspirin', 'Ibuprofen', 'Acetaminophen', 'Metformin']),
        dosage: `${faker_1.faker.number.int({ min: 100, max: 1000 })}mg`,
        frequency: faker_1.faker.helpers.arrayElement(['Once daily', 'Twice daily', 'Three times daily', 'As needed']),
        prescribedBy: crypto.randomUUID(),
        patientId: crypto.randomUUID(),
        startDate: faker_1.faker.date.recent(),
        endDate: faker_1.faker.date.future(),
        instructions: faker_1.faker.lorem.sentence(),
        createdAt: new Date(),
        updatedAt: new Date(),
        ...overrides,
    };
};
exports.generateMockMedication = generateMockMedication;
/**
 * Generates array of mock data
 *
 * @param {(overrides?: Partial<any>) => any} generator - Generator function
 * @param {TestDataOptions} [options] - Generation options
 * @returns {any[]} Array of mock data
 *
 * @example
 * ```typescript
 * const users = generateMockArray(generateMockUser, { count: 10 });
 * ```
 */
const generateMockArray = (generator, options = {}) => {
    const count = options.count || 5;
    const items = [];
    if (options.seed) {
        faker_1.faker.seed(options.seed);
    }
    for (let i = 0; i < count; i++) {
        items.push(generator(options.overrides));
    }
    return items;
};
exports.generateMockArray = generateMockArray;
/**
 * Generates realistic test email
 *
 * @param {string} [domain='example.com'] - Email domain
 * @returns {string} Test email
 *
 * @example
 * ```typescript
 * const email = generateTestEmail('hospital.com'); // test.user.123@hospital.com
 * ```
 */
const generateTestEmail = (domain = 'example.com') => {
    const username = `test.${faker_1.faker.internet.userName().toLowerCase()}.${Date.now()}`;
    return `${username}@${domain}`;
};
exports.generateTestEmail = generateTestEmail;
/**
 * Generates test phone number
 *
 * @param {string} [format='US'] - Phone format
 * @returns {string} Test phone number
 *
 * @example
 * ```typescript
 * const phone = generateTestPhone(); // +1-555-123-4567
 * ```
 */
const generateTestPhone = (format = 'US') => {
    if (format === 'US') {
        return `+1-555-${faker_1.faker.string.numeric(3)}-${faker_1.faker.string.numeric(4)}`;
    }
    return faker_1.faker.phone.number();
};
exports.generateTestPhone = generateTestPhone;
// ============================================================================
// REQUEST MOCKING
// ============================================================================
/**
 * Creates mock HTTP request object
 *
 * @param {MockRequestOptions} options - Request options
 * @returns {any} Mock request
 *
 * @example
 * ```typescript
 * const req = mockRequest({
 *   method: 'POST',
 *   path: '/users',
 *   body: { email: 'test@example.com' },
 *   user: { id: '123' }
 * });
 * ```
 */
const mockRequest = (options) => {
    return {
        method: options.method || 'GET',
        path: options.path,
        url: options.path,
        body: options.body || {},
        query: options.query || {},
        params: options.params || {},
        headers: {
            'content-type': 'application/json',
            ...options.headers,
        },
        user: options.user,
        ip: '127.0.0.1',
        get: jest.fn((header) => options.headers?.[header.toLowerCase()]),
    };
};
exports.mockRequest = mockRequest;
/**
 * Creates mock HTTP response object
 *
 * @returns {any} Mock response
 *
 * @example
 * ```typescript
 * const res = mockResponse();
 * await controller.getUser(req, res);
 * expect(res.status).toHaveBeenCalledWith(200);
 * ```
 */
const mockResponse = () => {
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis(),
        sendStatus: jest.fn().mockReturnThis(),
        redirect: jest.fn().mockReturnThis(),
        render: jest.fn().mockReturnThis(),
        set: jest.fn().mockReturnThis(),
        header: jest.fn().mockReturnThis(),
        cookie: jest.fn().mockReturnThis(),
        clearCookie: jest.fn().mockReturnThis(),
        end: jest.fn(),
    };
    return res;
};
exports.mockResponse = mockResponse;
/**
 * Creates mock next function for middleware
 *
 * @returns {jest.Mock} Mock next function
 *
 * @example
 * ```typescript
 * const next = mockNext();
 * await middleware.use(req, res, next);
 * expect(next).toHaveBeenCalled();
 * ```
 */
const mockNext = () => {
    return jest.fn();
};
exports.mockNext = mockNext;
/**
 * Creates authenticated request mock
 *
 * @param {AuthTokenPayload} user - User payload
 * @param {Partial<MockRequestOptions>} [options] - Additional options
 * @returns {any} Authenticated mock request
 *
 * @example
 * ```typescript
 * const req = mockAuthenticatedRequest({
 *   userId: '123',
 *   email: 'user@example.com',
 *   role: 'admin'
 * });
 * ```
 */
const mockAuthenticatedRequest = (user, options = {}) => {
    return (0, exports.mockRequest)({
        ...options,
        path: options.path || '/',
        user,
        headers: {
            authorization: `Bearer mock-token-${user.userId}`,
            ...options.headers,
        },
    });
};
exports.mockAuthenticatedRequest = mockAuthenticatedRequest;
// ============================================================================
// E2E TEST UTILITIES
// ============================================================================
/**
 * Creates E2E test application
 *
 * @param {any} AppModule - Application module
 * @param {E2ETestConfig} [config] - E2E configuration
 * @returns {Promise<INestApplication>} Test application
 *
 * @example
 * ```typescript
 * const app = await createE2ETestApp(AppModule, {
 *   enableValidation: true,
 *   globalPrefix: 'api'
 * });
 * ```
 */
const createE2ETestApp = async (AppModule, config = {}) => {
    const moduleFixture = config.moduleFixture ||
        (await testing_1.Test.createTestingModule({
            imports: [AppModule],
        }).compile());
    const app = moduleFixture.createNestApplication();
    if (config.enableValidation !== false) {
        app.useGlobalPipes(new common_1.ValidationPipe({ transform: true, whitelist: true }));
    }
    if (config.globalPrefix) {
        app.setGlobalPrefix(config.globalPrefix);
    }
    if (config.customSetup) {
        await config.customSetup(app);
    }
    await app.init();
    return app;
};
exports.createE2ETestApp = createE2ETestApp;
/**
 * Authenticates user for E2E tests
 *
 * @param {INestApplication} app - Test application
 * @param {Partial<any>} credentials - Login credentials
 * @returns {Promise<string>} Auth token
 *
 * @example
 * ```typescript
 * const token = await authenticateUser(app, {
 *   email: 'test@example.com',
 *   password: 'password123'
 * });
 * ```
 */
const authenticateUser = async (app, credentials) => {
    const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(credentials)
        .expect(200);
    return response.body.accessToken || response.body.token;
};
exports.authenticateUser = authenticateUser;
/**
 * Performs authenticated E2E request
 *
 * @param {INestApplication} app - Test application
 * @param {'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'} method - HTTP method
 * @param {string} path - Request path
 * @param {string} token - Auth token
 * @param {any} [body] - Request body
 * @returns {request.Test} Supertest request
 *
 * @example
 * ```typescript
 * const response = await authenticatedRequest(app, 'GET', '/users', token);
 * expect(response.status).toBe(200);
 * ```
 */
const authenticatedRequest = (app, method, path, token, body) => {
    const req = request(app.getHttpServer())[method.toLowerCase()](path).set('Authorization', `Bearer ${token}`);
    if (body) {
        return req.send(body);
    }
    return req;
};
exports.authenticatedRequest = authenticatedRequest;
/**
 * Cleans up E2E test application
 *
 * @param {INestApplication} app - Test application
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * afterAll(async () => {
 *   await cleanupE2E(app);
 * });
 * ```
 */
const cleanupE2E = async (app) => {
    if (app) {
        await app.close();
    }
};
exports.cleanupE2E = cleanupE2E;
/**
 * Seeds database for E2E tests
 *
 * @param {INestApplication} app - Test application
 * @param {DatabaseSeedData} seedData - Seed data
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await seedE2EDatabase(app, {
 *   users: [generateMockUser()],
 *   patients: generateMockArray(generateMockPatient, { count: 5 })
 * });
 * ```
 */
const seedE2EDatabase = async (app, seedData) => {
    const sequelize = app.get(sequelize_1.Sequelize);
    await (0, exports.seedDatabase)(sequelize, seedData);
};
exports.seedE2EDatabase = seedE2EDatabase;
// ============================================================================
// RESPONSE ASSERTION HELPERS
// ============================================================================
/**
 * Asserts response status and structure
 *
 * @param {any} response - HTTP response
 * @param {number} expectedStatus - Expected status code
 * @param {string[]} [requiredFields] - Required response fields
 * @returns {void}
 *
 * @example
 * ```typescript
 * assertResponse(response, 200, ['id', 'email', 'createdAt']);
 * ```
 */
const assertResponse = (response, expectedStatus, requiredFields) => {
    expect(response.status).toBe(expectedStatus);
    if (requiredFields) {
        requiredFields.forEach((field) => {
            expect(response.body).toHaveProperty(field);
        });
    }
};
exports.assertResponse = assertResponse;
/**
 * Asserts paginated response structure
 *
 * @param {any} response - HTTP response
 * @param {number} [expectedStatus=200] - Expected status code
 * @returns {void}
 *
 * @example
 * ```typescript
 * assertPaginatedResponse(response);
 * expect(response.body.items).toHaveLength(10);
 * ```
 */
const assertPaginatedResponse = (response, expectedStatus = 200) => {
    expect(response.status).toBe(expectedStatus);
    expect(response.body).toHaveProperty('items');
    expect(response.body).toHaveProperty('total');
    expect(response.body).toHaveProperty('page');
    expect(response.body).toHaveProperty('limit');
    expect(Array.isArray(response.body.items)).toBe(true);
};
exports.assertPaginatedResponse = assertPaginatedResponse;
/**
 * Asserts error response structure
 *
 * @param {any} response - HTTP response
 * @param {number} expectedStatus - Expected error status
 * @param {string} [expectedMessage] - Expected error message
 * @returns {void}
 *
 * @example
 * ```typescript
 * assertErrorResponse(response, 404, 'User not found');
 * ```
 */
const assertErrorResponse = (response, expectedStatus, expectedMessage) => {
    expect(response.status).toBe(expectedStatus);
    expect(response.body).toHaveProperty('message');
    if (expectedMessage) {
        expect(response.body.message).toContain(expectedMessage);
    }
};
exports.assertErrorResponse = assertErrorResponse;
/**
 * Asserts validation error response
 *
 * @param {any} response - HTTP response
 * @param {string[]} [expectedFields] - Expected validation fields
 * @returns {void}
 *
 * @example
 * ```typescript
 * assertValidationError(response, ['email', 'password']);
 * ```
 */
const assertValidationError = (response, expectedFields) => {
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
    if (expectedFields) {
        expectedFields.forEach((field) => {
            expect(JSON.stringify(response.body.message)).toContain(field);
        });
    }
};
exports.assertValidationError = assertValidationError;
/**
 * Asserts array response
 *
 * @param {any} response - HTTP response
 * @param {number} [expectedLength] - Expected array length
 * @param {string[]} [itemFields] - Required fields in each item
 * @returns {void}
 *
 * @example
 * ```typescript
 * assertArrayResponse(response, 5, ['id', 'name']);
 * ```
 */
const assertArrayResponse = (response, expectedLength, itemFields) => {
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    if (expectedLength !== undefined) {
        expect(response.body).toHaveLength(expectedLength);
    }
    if (itemFields && response.body.length > 0) {
        itemFields.forEach((field) => {
            expect(response.body[0]).toHaveProperty(field);
        });
    }
};
exports.assertArrayResponse = assertArrayResponse;
// ============================================================================
// FIXTURE MANAGEMENT
// ============================================================================
/**
 * Loads test fixture from object
 *
 * @param {string} name - Fixture name
 * @param {any} data - Fixture data
 * @returns {TestFixture} Test fixture
 *
 * @example
 * ```typescript
 * const userFixture = loadFixture('testUser', {
 *   email: 'test@example.com',
 *   role: 'admin'
 * });
 * ```
 */
const loadFixture = (name, data) => {
    return {
        name,
        data,
        metadata: {
            loadedAt: new Date(),
        },
    };
};
exports.loadFixture = loadFixture;
/**
 * Creates fixture with teardown
 *
 * @param {string} name - Fixture name
 * @param {any} data - Fixture data
 * @param {() => Promise<void>} teardown - Teardown function
 * @returns {TestFixture} Test fixture with teardown
 *
 * @example
 * ```typescript
 * const fixture = createFixtureWithTeardown('user', user, async () => {
 *   await userRepository.delete(user.id);
 * });
 * ```
 */
const createFixtureWithTeardown = (name, data, teardown) => {
    return {
        name,
        data,
        teardown,
    };
};
exports.createFixtureWithTeardown = createFixtureWithTeardown;
/**
 * Manages multiple fixtures
 *
 * @returns {FixtureManager} Fixture manager
 *
 * @example
 * ```typescript
 * const manager = createFixtureManager();
 * manager.add('user', userData);
 * const user = manager.get('user');
 * await manager.teardownAll();
 * ```
 */
const createFixtureManager = () => {
    const fixtures = new Map();
    return {
        add: (name, data, teardown) => {
            fixtures.set(name, { name, data, teardown });
        },
        get: (name) => {
            return fixtures.get(name)?.data;
        },
        has: (name) => {
            return fixtures.has(name);
        },
        remove: async (name) => {
            const fixture = fixtures.get(name);
            if (fixture?.teardown) {
                await fixture.teardown();
            }
            fixtures.delete(name);
        },
        teardownAll: async () => {
            for (const [name, fixture] of fixtures.entries()) {
                if (fixture.teardown) {
                    await fixture.teardown();
                }
            }
            fixtures.clear();
        },
        clear: () => {
            fixtures.clear();
        },
        list: () => {
            return Array.from(fixtures.keys());
        },
    };
};
exports.createFixtureManager = createFixtureManager;
// ============================================================================
// SNAPSHOT TESTING
// ============================================================================
/**
 * Sanitizes data for snapshot testing
 *
 * @param {any} data - Data to sanitize
 * @param {SnapshotOptions} [options] - Sanitization options
 * @returns {any} Sanitized data
 *
 * @example
 * ```typescript
 * const sanitized = sanitizeSnapshot(response, {
 *   excludeFields: ['id', 'createdAt'],
 *   sortArrays: true
 * });
 * expect(sanitized).toMatchSnapshot();
 * ```
 */
const sanitizeSnapshot = (data, options = {}) => {
    if (options.customSerializer) {
        return options.customSerializer(data);
    }
    let result = JSON.parse(JSON.stringify(data));
    // Exclude fields
    if (options.excludeFields) {
        const exclude = (obj) => {
            if (Array.isArray(obj)) {
                return obj.map(exclude);
            }
            else if (obj && typeof obj === 'object') {
                const cleaned = {};
                for (const [key, value] of Object.entries(obj)) {
                    if (!options.excludeFields?.includes(key)) {
                        cleaned[key] = exclude(value);
                    }
                }
                return cleaned;
            }
            return obj;
        };
        result = exclude(result);
    }
    // Sort arrays
    if (options.sortArrays && Array.isArray(result)) {
        result.sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
    }
    return result;
};
exports.sanitizeSnapshot = sanitizeSnapshot;
/**
 * Creates inline snapshot matcher
 *
 * @param {any} received - Received value
 * @param {any} expected - Expected snapshot
 * @param {SnapshotOptions} [options] - Options
 * @returns {boolean} Match result
 *
 * @example
 * ```typescript
 * const match = matchSnapshot(response.body, expectedSnapshot, {
 *   excludeFields: ['timestamp']
 * });
 * expect(match).toBe(true);
 * ```
 */
const matchSnapshot = (received, expected, options = {}) => {
    const sanitizedReceived = (0, exports.sanitizeSnapshot)(received, options);
    const sanitizedExpected = (0, exports.sanitizeSnapshot)(expected, options);
    return JSON.stringify(sanitizedReceived) === JSON.stringify(sanitizedExpected);
};
exports.matchSnapshot = matchSnapshot;
// ============================================================================
// SPY AND STUB CREATORS
// ============================================================================
/**
 * Creates spy on object method
 *
 * @param {any} object - Object to spy on
 * @param {string} method - Method name
 * @returns {jest.SpyInstance} Jest spy
 *
 * @example
 * ```typescript
 * const spy = createSpy(userService, 'findById');
 * spy.mockResolvedValue(mockUser);
 * ```
 */
const createSpy = (object, method) => {
    return jest.spyOn(object, method);
};
exports.createSpy = createSpy;
/**
 * Creates multiple spies on object
 *
 * @param {any} object - Object to spy on
 * @param {string[]} methods - Method names
 * @returns {Record<string, jest.SpyInstance>} Spies by method name
 *
 * @example
 * ```typescript
 * const spies = createSpies(userService, ['findById', 'create', 'update']);
 * spies.findById.mockResolvedValue(mockUser);
 * ```
 */
const createSpies = (object, methods) => {
    const spies = {};
    methods.forEach((method) => {
        spies[method] = jest.spyOn(object, method);
    });
    return spies;
};
exports.createSpies = createSpies;
/**
 * Creates stub function with default implementation
 *
 * @param {any} [defaultReturn] - Default return value
 * @returns {jest.Mock} Mock function
 *
 * @example
 * ```typescript
 * const stub = createStub({ success: true });
 * await someFunction(stub);
 * expect(stub).toHaveBeenCalled();
 * ```
 */
const createStub = (defaultReturn) => {
    return jest.fn().mockResolvedValue(defaultReturn);
};
exports.createStub = createStub;
/**
 * Restores all spies
 *
 * @param {Record<string, jest.SpyInstance>} spies - Spies to restore
 * @returns {void}
 *
 * @example
 * ```typescript
 * afterEach(() => {
 *   restoreSpies(spies);
 * });
 * ```
 */
const restoreSpies = (spies) => {
    Object.values(spies).forEach((spy) => spy.mockRestore());
};
exports.restoreSpies = restoreSpies;
// ============================================================================
// COVERAGE HELPERS
// ============================================================================
/**
 * Generates coverage report summary
 *
 * @param {any} coverageMap - Jest coverage map
 * @returns {any} Coverage summary
 *
 * @example
 * ```typescript
 * const summary = generateCoverageSummary(global.__coverage__);
 * console.log(`Line coverage: ${summary.lines.pct}%`);
 * ```
 */
const generateCoverageSummary = (coverageMap) => {
    // Implementation would use istanbul or jest coverage APIs
    return {
        lines: { pct: 0, covered: 0, total: 0 },
        statements: { pct: 0, covered: 0, total: 0 },
        functions: { pct: 0, covered: 0, total: 0 },
        branches: { pct: 0, covered: 0, total: 0 },
    };
};
exports.generateCoverageSummary = generateCoverageSummary;
/**
 * Validates coverage thresholds
 *
 * @param {any} coverage - Coverage data
 * @param {any} thresholds - Threshold requirements
 * @returns {boolean} True if thresholds met
 *
 * @example
 * ```typescript
 * const passed = validateCoverageThresholds(coverage, {
 *   lines: 90,
 *   functions: 95,
 *   branches: 85
 * });
 * ```
 */
const validateCoverageThresholds = (coverage, thresholds) => {
    const checks = ['lines', 'statements', 'functions', 'branches'];
    return checks.every((check) => {
        if (thresholds[check] === undefined)
            return true;
        return coverage[check]?.pct >= thresholds[check];
    });
};
exports.validateCoverageThresholds = validateCoverageThresholds;
// ============================================================================
// TEST CLEANUP UTILITIES
// ============================================================================
/**
 * Creates cleanup function for afterEach
 *
 * @returns {() => void} Cleanup function
 *
 * @example
 * ```typescript
 * afterEach(createAfterEachCleanup());
 * ```
 */
const createAfterEachCleanup = () => {
    return () => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    };
};
exports.createAfterEachCleanup = createAfterEachCleanup;
/**
 * Creates comprehensive test teardown
 *
 * @param {any[]} resources - Resources to clean up
 * @returns {() => Promise<void>} Teardown function
 *
 * @example
 * ```typescript
 * afterAll(createTestTeardown([app, sequelize, redisClient]));
 * ```
 */
const createTestTeardown = (resources) => {
    return async () => {
        for (const resource of resources) {
            if (resource?.close)
                await resource.close();
            if (resource?.disconnect)
                await resource.disconnect();
            if (resource?.destroy)
                await resource.destroy();
        }
        jest.clearAllMocks();
    };
};
exports.createTestTeardown = createTestTeardown;
/**
 * Waits for async operations to complete
 *
 * @param {number} [ms=100] - Milliseconds to wait
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await eventEmitter.emit('user.created', user);
 * await waitForAsync(200);
 * expect(emailService.sendWelcome).toHaveBeenCalled();
 * ```
 */
const waitForAsync = (ms = 100) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};
exports.waitForAsync = waitForAsync;
/**
 * Flushes all pending promises
 *
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await triggerAsyncOperation();
 * await flushPromises();
 * expect(result).toBeDefined();
 * ```
 */
const flushPromises = () => {
    return new Promise((resolve) => setImmediate(resolve));
};
exports.flushPromises = flushPromises;
// ============================================================================
// WEBSOCKET TESTING HELPERS
// ============================================================================
/**
 * Creates mock WebSocket client
 *
 * @returns {any} Mock WebSocket client
 *
 * @example
 * ```typescript
 * const ws = mockWebSocketClient();
 * ws.emit.mockImplementation((event, data) => { ... });
 * ```
 */
const mockWebSocketClient = () => {
    return {
        emit: jest.fn(),
        on: jest.fn(),
        once: jest.fn(),
        off: jest.fn(),
        send: jest.fn(),
        close: jest.fn(),
        connect: jest.fn(),
        disconnect: jest.fn(),
        id: crypto.randomUUID(),
        connected: true,
        auth: {},
        handshake: {
            headers: {},
            query: {},
        },
        join: jest.fn(),
        leave: jest.fn(),
        to: jest.fn().mockReturnThis(),
        broadcast: {
            emit: jest.fn(),
            to: jest.fn().mockReturnThis(),
        },
    };
};
exports.mockWebSocketClient = mockWebSocketClient;
/**
 * Creates mock WebSocket server
 *
 * @returns {any} Mock WebSocket server
 *
 * @example
 * ```typescript
 * const wss = mockWebSocketServer();
 * wss.emit.mockImplementation((event, data) => { ... });
 * ```
 */
const mockWebSocketServer = () => {
    const sockets = new Map();
    return {
        emit: jest.fn(),
        to: jest.fn().mockReturnThis(),
        in: jest.fn().mockReturnThis(),
        sockets: {
            sockets: sockets,
            adapter: {
                rooms: new Map(),
            },
        },
        on: jest.fn(),
        off: jest.fn(),
        use: jest.fn(),
        close: jest.fn(),
    };
};
exports.mockWebSocketServer = mockWebSocketServer;
/**
 * Simulates WebSocket connection
 *
 * @param {any} server - WebSocket server
 * @param {any} [clientData] - Client data
 * @returns {any} Connected client
 *
 * @example
 * ```typescript
 * const client = simulateWebSocketConnection(wss, {
 *   userId: 'user-123',
 *   token: 'auth-token'
 * });
 * ```
 */
const simulateWebSocketConnection = (server, clientData) => {
    const client = (0, exports.mockWebSocketClient)();
    if (clientData) {
        client.auth = clientData;
    }
    server.sockets.sockets.set(client.id, client);
    return client;
};
exports.simulateWebSocketConnection = simulateWebSocketConnection;
/**
 * Waits for WebSocket event
 *
 * @param {any} socket - WebSocket client or server
 * @param {string} event - Event name
 * @param {number} [timeout=5000] - Timeout in milliseconds
 * @returns {Promise<any>} Event data
 *
 * @example
 * ```typescript
 * const data = await waitForWebSocketEvent(client, 'user:created', 3000);
 * expect(data.userId).toBeDefined();
 * ```
 */
const waitForWebSocketEvent = async (socket, event, timeout = 5000) => {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
            reject(new Error(`Timeout waiting for event: ${event}`));
        }, timeout);
        socket.once(event, (data) => {
            clearTimeout(timer);
            resolve(data);
        });
    });
};
exports.waitForWebSocketEvent = waitForWebSocketEvent;
/**
 * Asserts WebSocket event was emitted
 *
 * @param {any} socket - WebSocket client or server
 * @param {string} event - Event name
 * @param {any} [expectedData] - Expected event data
 * @returns {void}
 *
 * @example
 * ```typescript
 * assertWebSocketEventEmitted(client, 'message:sent', { text: 'Hello' });
 * ```
 */
const assertWebSocketEventEmitted = (socket, event, expectedData) => {
    expect(socket.emit).toHaveBeenCalled();
    const calls = socket.emit.mock.calls;
    const eventCall = calls.find((call) => call[0] === event);
    expect(eventCall).toBeDefined();
    if (expectedData) {
        expect(eventCall[1]).toMatchObject(expectedData);
    }
};
exports.assertWebSocketEventEmitted = assertWebSocketEventEmitted;
// ============================================================================
// GRAPHQL QUERY TEST UTILITIES
// ============================================================================
/**
 * Creates GraphQL test query
 *
 * @param {string} query - GraphQL query string
 * @param {Record<string, any>} [variables] - Query variables
 * @returns {object} GraphQL request
 *
 * @example
 * ```typescript
 * const query = createGraphQLQuery(`
 *   query GetUser($id: ID!) {
 *     user(id: $id) { id email name }
 *   }
 * `, { id: '123' });
 * ```
 */
const createGraphQLQuery = (query, variables) => {
    return {
        query: query.trim(),
        variables,
    };
};
exports.createGraphQLQuery = createGraphQLQuery;
/**
 * Creates GraphQL test mutation
 *
 * @param {string} mutation - GraphQL mutation string
 * @param {Record<string, any>} [variables] - Mutation variables
 * @returns {object} GraphQL request
 *
 * @example
 * ```typescript
 * const mutation = createGraphQLMutation(`
 *   mutation CreateUser($input: CreateUserInput!) {
 *     createUser(input: $input) { id email }
 *   }
 * `, { input: { email: 'test@example.com' } });
 * ```
 */
const createGraphQLMutation = (mutation, variables) => {
    return (0, exports.createGraphQLQuery)(mutation, variables);
};
exports.createGraphQLMutation = createGraphQLMutation;
/**
 * Executes GraphQL query in tests
 *
 * @param {INestApplication} app - Test application
 * @param {object} query - GraphQL query
 * @param {string} [token] - Auth token
 * @returns {Promise<any>} Query result
 *
 * @example
 * ```typescript
 * const result = await executeGraphQLQuery(app, query, authToken);
 * expect(result.data.user).toBeDefined();
 * ```
 */
const executeGraphQLQuery = async (app, query, token) => {
    const req = request(app.getHttpServer()).post('/graphql').send(query);
    if (token) {
        req.set('Authorization', `Bearer ${token}`);
    }
    const response = await req;
    return response.body;
};
exports.executeGraphQLQuery = executeGraphQLQuery;
/**
 * Asserts GraphQL response structure
 *
 * @param {any} response - GraphQL response
 * @param {string[]} [expectedFields] - Expected data fields
 * @returns {void}
 *
 * @example
 * ```typescript
 * assertGraphQLResponse(response, ['user.id', 'user.email']);
 * ```
 */
const assertGraphQLResponse = (response, expectedFields) => {
    expect(response).toHaveProperty('data');
    expect(response).not.toHaveProperty('errors');
    if (expectedFields) {
        expectedFields.forEach((field) => {
            const parts = field.split('.');
            let current = response.data;
            for (const part of parts) {
                expect(current).toHaveProperty(part);
                current = current[part];
            }
        });
    }
};
exports.assertGraphQLResponse = assertGraphQLResponse;
/**
 * Asserts GraphQL error response
 *
 * @param {any} response - GraphQL response
 * @param {string} [expectedMessage] - Expected error message
 * @returns {void}
 *
 * @example
 * ```typescript
 * assertGraphQLError(response, 'User not found');
 * ```
 */
const assertGraphQLError = (response, expectedMessage) => {
    expect(response).toHaveProperty('errors');
    expect(Array.isArray(response.errors)).toBe(true);
    expect(response.errors.length).toBeGreaterThan(0);
    if (expectedMessage) {
        const errorMessages = response.errors.map((e) => e.message).join(' ');
        expect(errorMessages).toContain(expectedMessage);
    }
};
exports.assertGraphQLError = assertGraphQLError;
/**
 * Mock GraphQL resolver
 *
 * @param {any} [returnValue] - Default return value
 * @returns {jest.Mock} Mock resolver function
 *
 * @example
 * ```typescript
 * const resolver = mockGraphQLResolver({ user: { id: '123' } });
 * ```
 */
const mockGraphQLResolver = (returnValue) => {
    return jest.fn().mockResolvedValue(returnValue);
};
exports.mockGraphQLResolver = mockGraphQLResolver;
// ============================================================================
// PERFORMANCE TEST HELPERS
// ============================================================================
/**
 * Measures function execution time
 *
 * @param {() => Promise<any>} fn - Function to measure
 * @returns {Promise<{ result: any; duration: number }>} Result and duration
 *
 * @example
 * ```typescript
 * const { result, duration } = await measureExecutionTime(async () => {
 *   return await service.heavyOperation();
 * });
 * expect(duration).toBeLessThan(1000);
 * ```
 */
const measureExecutionTime = async (fn) => {
    const start = performance.now();
    const result = await fn();
    const duration = performance.now() - start;
    return { result, duration };
};
exports.measureExecutionTime = measureExecutionTime;
/**
 * Benchmarks function with multiple iterations
 *
 * @param {() => Promise<any>} fn - Function to benchmark
 * @param {number} [iterations=100] - Number of iterations
 * @returns {Promise<object>} Benchmark statistics
 *
 * @example
 * ```typescript
 * const stats = await benchmarkFunction(async () => {
 *   return await service.processData();
 * }, 100);
 * expect(stats.avg).toBeLessThan(50);
 * ```
 */
const benchmarkFunction = async (fn, iterations = 100) => {
    const durations = [];
    for (let i = 0; i < iterations; i++) {
        const { duration } = await (0, exports.measureExecutionTime)(fn);
        durations.push(duration);
    }
    const sorted = durations.sort((a, b) => a - b);
    const sum = durations.reduce((a, b) => a + b, 0);
    return {
        min: sorted[0],
        max: sorted[sorted.length - 1],
        avg: sum / iterations,
        median: sorted[Math.floor(iterations / 2)],
        p95: sorted[Math.floor(iterations * 0.95)],
        p99: sorted[Math.floor(iterations * 0.99)],
    };
};
exports.benchmarkFunction = benchmarkFunction;
/**
 * Asserts performance threshold
 *
 * @param {() => Promise<any>} fn - Function to test
 * @param {number} maxDuration - Maximum allowed duration in ms
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await assertPerformanceThreshold(async () => {
 *   return await service.quickOperation();
 * }, 100);
 * ```
 */
const assertPerformanceThreshold = async (fn, maxDuration) => {
    const { duration } = await (0, exports.measureExecutionTime)(fn);
    expect(duration).toBeLessThan(maxDuration);
};
exports.assertPerformanceThreshold = assertPerformanceThreshold;
/**
 * Measures memory usage
 *
 * @param {() => Promise<any>} fn - Function to measure
 * @returns {Promise<{ result: any; heapUsed: number }>} Result and memory usage
 *
 * @example
 * ```typescript
 * const { result, heapUsed } = await measureMemoryUsage(async () => {
 *   return await service.loadLargeDataset();
 * });
 * ```
 */
const measureMemoryUsage = async (fn) => {
    if (global.gc) {
        global.gc();
    }
    const before = process.memoryUsage().heapUsed;
    const result = await fn();
    const after = process.memoryUsage().heapUsed;
    const heapUsed = after - before;
    return { result, heapUsed };
};
exports.measureMemoryUsage = measureMemoryUsage;
/**
 * Profiles async operations
 *
 * @param {string} label - Profile label
 * @param {() => Promise<any>} fn - Function to profile
 * @returns {Promise<any>} Function result
 *
 * @example
 * ```typescript
 * const result = await profileAsyncOperation('database-query', async () => {
 *   return await repository.find();
 * });
 * ```
 */
const profileAsyncOperation = async (label, fn) => {
    console.time(label);
    const result = await fn();
    console.timeEnd(label);
    return result;
};
exports.profileAsyncOperation = profileAsyncOperation;
// ============================================================================
// LOAD TESTING UTILITIES
// ============================================================================
/**
 * Simulates concurrent requests
 *
 * @param {() => Promise<any>} fn - Function to execute
 * @param {number} concurrency - Number of concurrent executions
 * @returns {Promise<any[]>} Results array
 *
 * @example
 * ```typescript
 * const results = await simulateConcurrentRequests(async () => {
 *   return await request(app.getHttpServer()).get('/users');
 * }, 50);
 * ```
 */
const simulateConcurrentRequests = async (fn, concurrency) => {
    const promises = Array.from({ length: concurrency }, () => fn());
    return Promise.all(promises);
};
exports.simulateConcurrentRequests = simulateConcurrentRequests;
/**
 * Load test with ramping users
 *
 * @param {() => Promise<any>} fn - Function to execute
 * @param {object} config - Load test configuration
 * @returns {Promise<object>} Load test results
 *
 * @example
 * ```typescript
 * const results = await loadTestWithRamping(async () => {
 *   return await service.handleRequest();
 * }, {
 *   startUsers: 10,
 *   endUsers: 100,
 *   rampDuration: 30000,
 *   holdDuration: 60000
 * });
 * ```
 */
const loadTestWithRamping = async (fn, config) => {
    const results = [];
    const startTime = Date.now();
    // Ramp up
    const rampStep = config.rampDuration / (config.endUsers - config.startUsers);
    for (let users = config.startUsers; users <= config.endUsers; users++) {
        await (0, exports.waitForAsync)(rampStep);
        const promises = Array.from({ length: users }, async () => {
            try {
                const { duration } = await (0, exports.measureExecutionTime)(fn);
                return { success: true, duration };
            }
            catch (error) {
                return { success: false, duration: 0 };
            }
        });
        const batchResults = await Promise.all(promises);
        results.push(...batchResults);
    }
    // Hold at peak
    const holdStart = Date.now();
    while (Date.now() - holdStart < config.holdDuration) {
        const promises = Array.from({ length: config.endUsers }, async () => {
            try {
                const { duration } = await (0, exports.measureExecutionTime)(fn);
                return { success: true, duration };
            }
            catch (error) {
                return { success: false, duration: 0 };
            }
        });
        const batchResults = await Promise.all(promises);
        results.push(...batchResults);
        await (0, exports.waitForAsync)(1000);
    }
    const totalDuration = (Date.now() - startTime) / 1000;
    const successfulResults = results.filter((r) => r.success);
    const avgDuration = successfulResults.reduce((sum, r) => sum + r.duration, 0) / successfulResults.length;
    return {
        totalRequests: results.length,
        successfulRequests: successfulResults.length,
        failedRequests: results.filter((r) => !r.success).length,
        avgResponseTime: avgDuration,
        requestsPerSecond: results.length / totalDuration,
    };
};
exports.loadTestWithRamping = loadTestWithRamping;
/**
 * Stress test until failure
 *
 * @param {() => Promise<any>} fn - Function to stress test
 * @param {number} [maxUsers=1000] - Maximum concurrent users
 * @param {number} [step=10] - User increment step
 * @returns {Promise<number>} Breaking point (number of users)
 *
 * @example
 * ```typescript
 * const breakingPoint = await stressTestUntilFailure(async () => {
 *   return await service.handleRequest();
 * }, 500, 20);
 * ```
 */
const stressTestUntilFailure = async (fn, maxUsers = 1000, step = 10) => {
    let users = step;
    let failures = 0;
    while (users <= maxUsers) {
        const results = await (0, exports.simulateConcurrentRequests)(async () => {
            try {
                await fn();
                return { success: true };
            }
            catch (error) {
                return { success: false };
            }
        }, users);
        failures = results.filter((r) => !r.success).length;
        const failureRate = failures / users;
        if (failureRate > 0.1) {
            // 10% failure rate threshold
            return users;
        }
        users += step;
    }
    return maxUsers;
};
exports.stressTestUntilFailure = stressTestUntilFailure;
/**
 * Measures throughput (requests per second)
 *
 * @param {() => Promise<any>} fn - Function to measure
 * @param {number} [duration=10000] - Duration in milliseconds
 * @returns {Promise<number>} Requests per second
 *
 * @example
 * ```typescript
 * const rps = await measureThroughput(async () => {
 *   return await service.handleRequest();
 * }, 5000);
 * expect(rps).toBeGreaterThan(100);
 * ```
 */
const measureThroughput = async (fn, duration = 10000) => {
    const startTime = Date.now();
    let requestCount = 0;
    while (Date.now() - startTime < duration) {
        await fn();
        requestCount++;
    }
    const actualDuration = (Date.now() - startTime) / 1000;
    return requestCount / actualDuration;
};
exports.measureThroughput = measureThroughput;
// ============================================================================
// ADVANCED ASSERTION UTILITIES
// ============================================================================
/**
 * Custom assertion: valid UUID
 *
 * @param {any} value - Value to check
 * @returns {boolean} True if valid UUID
 *
 * @example
 * ```typescript
 * expect(assertValidUUID(user.id)).toBe(true);
 * ```
 */
const assertValidUUID = (value) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const isValid = typeof value === 'string' && uuidRegex.test(value);
    expect(isValid).toBe(true);
    return isValid;
};
exports.assertValidUUID = assertValidUUID;
/**
 * Custom assertion: valid email
 *
 * @param {any} value - Value to check
 * @returns {boolean} True if valid email
 *
 * @example
 * ```typescript
 * expect(assertValidEmail(user.email)).toBe(true);
 * ```
 */
const assertValidEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = typeof value === 'string' && emailRegex.test(value);
    expect(isValid).toBe(true);
    return isValid;
};
exports.assertValidEmail = assertValidEmail;
/**
 * Custom assertion: valid phone number
 *
 * @param {any} value - Value to check
 * @returns {boolean} True if valid phone
 *
 * @example
 * ```typescript
 * expect(assertValidPhoneNumber(user.phone)).toBe(true);
 * ```
 */
const assertValidPhoneNumber = (value) => {
    const phoneRegex = /^\+?[\d\s\-()]+$/;
    const isValid = typeof value === 'string' && phoneRegex.test(value) && value.replace(/\D/g, '').length >= 10;
    expect(isValid).toBe(true);
    return isValid;
};
exports.assertValidPhoneNumber = assertValidPhoneNumber;
/**
 * Custom assertion: date format
 *
 * @param {any} value - Value to check
 * @param {string} [format='ISO'] - Expected format
 * @returns {boolean} True if matches format
 *
 * @example
 * ```typescript
 * expect(assertDateFormat(user.createdAt, 'ISO')).toBe(true);
 * ```
 */
const assertDateFormat = (value, format = 'ISO') => {
    if (format === 'ISO') {
        const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;
        const isValid = typeof value === 'string'
            ? isoRegex.test(value)
            : value instanceof Date && !isNaN(value.getTime());
        expect(isValid).toBe(true);
        return isValid;
    }
    return false;
};
exports.assertDateFormat = assertDateFormat;
/**
 * Custom assertion: nested property
 *
 * @param {any} obj - Object to check
 * @param {string} path - Property path (dot notation)
 * @returns {boolean} True if property exists
 *
 * @example
 * ```typescript
 * expect(assertNestedProperty(user, 'address.city')).toBe(true);
 * ```
 */
const assertNestedProperty = (obj, path) => {
    const parts = path.split('.');
    let current = obj;
    for (const part of parts) {
        if (!current || typeof current !== 'object' || !(part in current)) {
            expect(false).toBe(true);
            return false;
        }
        current = current[part];
    }
    expect(true).toBe(true);
    return true;
};
exports.assertNestedProperty = assertNestedProperty;
/**
 * Asserts async function throws
 *
 * @param {() => Promise<any>} fn - Async function
 * @param {any} [errorType] - Expected error type/message
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await assertAsyncThrows(async () => {
 *   await service.invalidOperation();
 * }, NotFoundException);
 * ```
 */
const assertAsyncThrows = async (fn, errorType) => {
    let error;
    try {
        await fn();
    }
    catch (e) {
        error = e;
    }
    expect(error).toBeDefined();
    if (errorType) {
        if (typeof errorType === 'string') {
            expect(error.message).toContain(errorType);
        }
        else {
            expect(error).toBeInstanceOf(errorType);
        }
    }
};
exports.assertAsyncThrows = assertAsyncThrows;
/**
 * Asserts array contains object matching criteria
 *
 * @param {any[]} array - Array to check
 * @param {Record<string, any>} criteria - Match criteria
 * @returns {void}
 *
 * @example
 * ```typescript
 * assertArrayContainsObject(users, { email: 'test@example.com' });
 * ```
 */
const assertArrayContainsObject = (array, criteria) => {
    const match = array.find((item) => Object.entries(criteria).every(([key, value]) => item[key] === value));
    expect(match).toBeDefined();
};
exports.assertArrayContainsObject = assertArrayContainsObject;
// ============================================================================
// TEST ENVIRONMENT CONFIGURATORS
// ============================================================================
/**
 * Configures test environment variables
 *
 * @param {Record<string, string>} envVars - Environment variables
 * @returns {() => void} Cleanup function
 *
 * @example
 * ```typescript
 * const cleanup = configureTestEnvironment({
 *   NODE_ENV: 'test',
 *   DATABASE_URL: 'sqlite::memory:'
 * });
 * // ... run tests ...
 * cleanup();
 * ```
 */
const configureTestEnvironment = (envVars) => {
    const originalEnv = { ...process.env };
    Object.entries(envVars).forEach(([key, value]) => {
        process.env[key] = value;
    });
    return () => {
        Object.keys(envVars).forEach((key) => {
            if (originalEnv[key] === undefined) {
                delete process.env[key];
            }
            else {
                process.env[key] = originalEnv[key];
            }
        });
    };
};
exports.configureTestEnvironment = configureTestEnvironment;
/**
 * Sets up test timeout
 *
 * @param {number} timeout - Timeout in milliseconds
 * @returns {void}
 *
 * @example
 * ```typescript
 * setupTestTimeout(30000); // 30 seconds
 * ```
 */
const setupTestTimeout = (timeout) => {
    jest.setTimeout(timeout);
};
exports.setupTestTimeout = setupTestTimeout;
/**
 * Creates isolated test context
 *
 * @param {() => Promise<void>} setup - Setup function
 * @param {() => Promise<void>} teardown - Teardown function
 * @returns {object} Test context manager
 *
 * @example
 * ```typescript
 * const context = createIsolatedTestContext(
 *   async () => { await setupDatabase(); },
 *   async () => { await cleanupDatabase(); }
 * );
 * beforeEach(context.setup);
 * afterEach(context.teardown);
 * ```
 */
const createIsolatedTestContext = (setup, teardown) => {
    return {
        setup,
        teardown,
        reset: async () => {
            await teardown();
            await setup();
        },
    };
};
exports.createIsolatedTestContext = createIsolatedTestContext;
/**
 * Mocks system time
 *
 * @param {Date | string | number} date - Mock date
 * @returns {() => void} Restore function
 *
 * @example
 * ```typescript
 * const restore = mockSystemTime('2024-01-01T00:00:00Z');
 * // ... tests with fixed time ...
 * restore();
 * ```
 */
const mockSystemTime = (date) => {
    const mockDate = new Date(date);
    jest.useFakeTimers();
    jest.setSystemTime(mockDate);
    return () => {
        jest.useRealTimers();
    };
};
exports.mockSystemTime = mockSystemTime;
/**
 * Creates test transaction wrapper
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {object} Transaction manager
 *
 * @example
 * ```typescript
 * const txManager = createTestTransaction(sequelize);
 * const tx = await txManager.start();
 * // ... run test operations ...
 * await txManager.rollback();
 * ```
 */
const createTestTransaction = (sequelize) => {
    let currentTransaction = null;
    return {
        start: async () => {
            currentTransaction = await sequelize.transaction();
            return currentTransaction;
        },
        commit: async () => {
            if (currentTransaction) {
                await currentTransaction.commit();
                currentTransaction = null;
            }
        },
        rollback: async () => {
            if (currentTransaction) {
                await currentTransaction.rollback();
                currentTransaction = null;
            }
        },
        current: currentTransaction,
    };
};
exports.createTestTransaction = createTestTransaction;
//# sourceMappingURL=testing-utilities-kit.js.map