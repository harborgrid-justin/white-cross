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
import { TestingModule, TestingModuleBuilder } from '@nestjs/testing';
import { INestApplication, Type } from '@nestjs/common';
import { Sequelize, Transaction } from 'sequelize';
import * as request from 'supertest';
/**
 * @enum TestType
 * @description Types of tests for categorization
 */
export declare enum TestType {
    UNIT = "UNIT",
    INTEGRATION = "INTEGRATION",
    E2E = "E2E",
    PERFORMANCE = "PERFORMANCE",
    SECURITY = "SECURITY"
}
/**
 * @enum MockStrategy
 * @description Strategies for mocking dependencies
 */
export declare enum MockStrategy {
    FULL = "FULL",// Mock all methods
    PARTIAL = "PARTIAL",// Mock only specified methods
    SPY = "SPY",// Use spies on real implementation
    NONE = "NONE"
}
/**
 * @interface TestModuleConfig
 * @description Configuration for test module creation
 */
export interface TestModuleConfig {
    imports?: any[];
    providers?: any[];
    controllers?: any[];
    mockStrategy?: MockStrategy;
    databaseType?: 'sqlite' | 'postgres' | 'mysql';
    enableLogging?: boolean;
}
/**
 * @interface MockRepositoryOptions
 * @description Options for creating mock repositories
 */
export interface MockRepositoryOptions {
    findOne?: jest.Mock;
    find?: jest.Mock;
    save?: jest.Mock;
    create?: jest.Mock;
    update?: jest.Mock;
    delete?: jest.Mock;
    remove?: jest.Mock;
    count?: jest.Mock;
    customMethods?: Record<string, jest.Mock>;
}
/**
 * @interface TestDataOptions
 * @description Options for generating test data
 */
export interface TestDataOptions {
    count?: number;
    overrides?: Record<string, any>;
    locale?: string;
    seed?: number;
    hipaaCompliant?: boolean;
}
/**
 * @interface E2ETestConfig
 * @description Configuration for E2E tests
 */
export interface E2ETestConfig {
    moduleFixture?: TestingModule;
    enableValidation?: boolean;
    enableCors?: boolean;
    globalPrefix?: string;
    customSetup?: (app: INestApplication) => Promise<void>;
}
/**
 * @interface AuthTokenPayload
 * @description Payload for authentication tokens in tests
 */
export interface AuthTokenPayload {
    userId: string;
    email: string;
    role?: string;
    permissions?: string[];
}
/**
 * @interface DatabaseSeedData
 * @description Structure for database seeding
 */
export interface DatabaseSeedData {
    [entityName: string]: any[];
}
/**
 * @interface TestFixture
 * @description Generic test fixture structure
 */
export interface TestFixture<T = any> {
    name: string;
    data: T;
    metadata?: Record<string, any>;
    teardown?: () => Promise<void>;
}
/**
 * @interface SnapshotOptions
 * @description Options for snapshot testing
 */
export interface SnapshotOptions {
    sanitize?: boolean;
    excludeFields?: string[];
    sortArrays?: boolean;
    customSerializer?: (data: any) => any;
}
/**
 * @interface MockRequestOptions
 * @description Options for creating mock HTTP requests
 */
export interface MockRequestOptions {
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    path: string;
    body?: any;
    query?: Record<string, any>;
    headers?: Record<string, string>;
    params?: Record<string, string>;
    user?: any;
}
/**
 * @interface AssertionHelpers
 * @description Custom assertion helpers for tests
 */
export interface AssertionHelpers {
    toBeValidUUID: (value: any) => boolean;
    toBeValidEmail: (value: any) => boolean;
    toBeValidPhoneNumber: (value: any) => boolean;
    toMatchDateFormat: (value: any, format: string) => boolean;
    toHaveProperty: (obj: any, path: string) => boolean;
}
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
export declare const createTestingModuleBuilder: (config?: TestModuleConfig) => TestingModuleBuilder;
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
export declare const createTestModuleWithDatabase: (entities: Type<any>[], providers?: any[], dbType?: "sqlite" | "postgres" | "mysql") => Promise<TestingModule>;
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
export declare const createIsolatedTestModule: (serviceClass: Type<any>, mockDependencies?: any[]) => Promise<TestingModule>;
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
export declare const addMockRepository: (builder: TestingModuleBuilder, entity: Type<any>, methods?: Partial<MockRepositoryOptions>) => TestingModuleBuilder;
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
export declare const createTestModuleWithProviders: (providers: any[], overrides?: any[]) => Promise<TestingModule>;
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
export declare const mockRepository: (methods?: Partial<MockRepositoryOptions>) => any;
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
export declare const mockSequelizeModel: (mockData?: any) => any;
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
export declare const mockService: (methods?: string[]) => any;
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
export declare const mockHttpService: (defaultResponse?: any) => any;
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
export declare const mockConfigService: (config?: Record<string, any>) => any;
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
export declare const mockJwtService: (secret?: string) => any;
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
export declare const mockEventEmitter: () => any;
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
export declare const mockLogger: () => any;
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
export declare const seedDatabase: (sequelize: Sequelize, seedData: DatabaseSeedData, truncate?: boolean) => Promise<void>;
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
export declare const cleanupDatabase: (sequelize: Sequelize, tableNames?: string[]) => Promise<void>;
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
export declare const createDatabaseSnapshot: (sequelize: Sequelize, tableNames?: string[]) => Promise<DatabaseSeedData>;
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
export declare const restoreDatabaseSnapshot: (sequelize: Sequelize, snapshot: DatabaseSeedData) => Promise<void>;
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
export declare const resetDatabase: (sequelize: Sequelize) => Promise<void>;
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
export declare const generateMockUser: (overrides?: Partial<any>, hipaaCompliant?: boolean) => any;
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
export declare const generateMockPatient: (overrides?: Partial<any>) => any;
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
export declare const generateMockAppointment: (overrides?: Partial<any>) => any;
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
export declare const generateMockMedication: (overrides?: Partial<any>) => any;
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
export declare const generateMockArray: (generator: (overrides?: Partial<any>) => any, options?: TestDataOptions) => any[];
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
export declare const generateTestEmail: (domain?: string) => string;
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
export declare const generateTestPhone: (format?: string) => string;
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
export declare const mockRequest: (options: MockRequestOptions) => any;
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
export declare const mockResponse: () => any;
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
export declare const mockNext: () => jest.Mock;
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
export declare const mockAuthenticatedRequest: (user: AuthTokenPayload, options?: Partial<MockRequestOptions>) => any;
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
export declare const createE2ETestApp: (AppModule: any, config?: E2ETestConfig) => Promise<INestApplication>;
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
export declare const authenticateUser: (app: INestApplication, credentials: Partial<any>) => Promise<string>;
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
export declare const authenticatedRequest: (app: INestApplication, method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE", path: string, token: string, body?: any) => request.Test;
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
export declare const cleanupE2E: (app: INestApplication) => Promise<void>;
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
export declare const seedE2EDatabase: (app: INestApplication, seedData: DatabaseSeedData) => Promise<void>;
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
export declare const assertResponse: (response: any, expectedStatus: number, requiredFields?: string[]) => void;
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
export declare const assertPaginatedResponse: (response: any, expectedStatus?: number) => void;
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
export declare const assertErrorResponse: (response: any, expectedStatus: number, expectedMessage?: string) => void;
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
export declare const assertValidationError: (response: any, expectedFields?: string[]) => void;
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
export declare const assertArrayResponse: (response: any, expectedLength?: number, itemFields?: string[]) => void;
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
export declare const loadFixture: <T = any>(name: string, data: T) => TestFixture<T>;
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
export declare const createFixtureWithTeardown: (name: string, data: any, teardown: () => Promise<void>) => TestFixture;
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
export declare const createFixtureManager: () => {
    add: (name: string, data: any, teardown?: () => Promise<void>) => void;
    get: <T = any>(name: string) => T | undefined;
    has: (name: string) => boolean;
    remove: (name: string) => Promise<void>;
    teardownAll: () => Promise<void>;
    clear: () => void;
    list: () => string[];
};
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
export declare const sanitizeSnapshot: (data: any, options?: SnapshotOptions) => any;
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
export declare const matchSnapshot: (received: any, expected: any, options?: SnapshotOptions) => boolean;
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
export declare const createSpy: (object: any, method: string) => jest.SpyInstance;
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
export declare const createSpies: (object: any, methods: string[]) => Record<string, jest.SpyInstance>;
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
export declare const createStub: (defaultReturn?: any) => jest.Mock;
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
export declare const restoreSpies: (spies: Record<string, jest.SpyInstance>) => void;
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
export declare const generateCoverageSummary: (coverageMap: any) => any;
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
export declare const validateCoverageThresholds: (coverage: any, thresholds: any) => boolean;
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
export declare const createAfterEachCleanup: () => (() => void);
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
export declare const createTestTeardown: (resources: any[]) => (() => Promise<void>);
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
export declare const waitForAsync: (ms?: number) => Promise<void>;
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
export declare const flushPromises: () => Promise<void>;
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
export declare const mockWebSocketClient: () => any;
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
export declare const mockWebSocketServer: () => any;
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
export declare const simulateWebSocketConnection: (server: any, clientData?: any) => any;
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
export declare const waitForWebSocketEvent: (socket: any, event: string, timeout?: number) => Promise<any>;
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
export declare const assertWebSocketEventEmitted: (socket: any, event: string, expectedData?: any) => void;
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
export declare const createGraphQLQuery: (query: string, variables?: Record<string, any>) => {
    query: string;
    variables?: Record<string, any>;
};
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
export declare const createGraphQLMutation: (mutation: string, variables?: Record<string, any>) => {
    query: string;
    variables?: Record<string, any>;
};
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
export declare const executeGraphQLQuery: (app: INestApplication, query: {
    query: string;
    variables?: Record<string, any>;
}, token?: string) => Promise<any>;
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
export declare const assertGraphQLResponse: (response: any, expectedFields?: string[]) => void;
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
export declare const assertGraphQLError: (response: any, expectedMessage?: string) => void;
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
export declare const mockGraphQLResolver: (returnValue?: any) => jest.Mock;
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
export declare const measureExecutionTime: (fn: () => Promise<any>) => Promise<{
    result: any;
    duration: number;
}>;
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
export declare const benchmarkFunction: (fn: () => Promise<any>, iterations?: number) => Promise<{
    min: number;
    max: number;
    avg: number;
    median: number;
    p95: number;
    p99: number;
}>;
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
export declare const assertPerformanceThreshold: (fn: () => Promise<any>, maxDuration: number) => Promise<void>;
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
export declare const measureMemoryUsage: (fn: () => Promise<any>) => Promise<{
    result: any;
    heapUsed: number;
}>;
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
export declare const profileAsyncOperation: (label: string, fn: () => Promise<any>) => Promise<any>;
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
export declare const simulateConcurrentRequests: (fn: () => Promise<any>, concurrency: number) => Promise<any[]>;
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
export declare const loadTestWithRamping: (fn: () => Promise<any>, config: {
    startUsers: number;
    endUsers: number;
    rampDuration: number;
    holdDuration: number;
}) => Promise<{
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    avgResponseTime: number;
    requestsPerSecond: number;
}>;
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
export declare const stressTestUntilFailure: (fn: () => Promise<any>, maxUsers?: number, step?: number) => Promise<number>;
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
export declare const measureThroughput: (fn: () => Promise<any>, duration?: number) => Promise<number>;
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
export declare const assertValidUUID: (value: any) => boolean;
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
export declare const assertValidEmail: (value: any) => boolean;
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
export declare const assertValidPhoneNumber: (value: any) => boolean;
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
export declare const assertDateFormat: (value: any, format?: string) => boolean;
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
export declare const assertNestedProperty: (obj: any, path: string) => boolean;
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
export declare const assertAsyncThrows: (fn: () => Promise<any>, errorType?: any) => Promise<void>;
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
export declare const assertArrayContainsObject: (array: any[], criteria: Record<string, any>) => void;
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
export declare const configureTestEnvironment: (envVars: Record<string, string>) => (() => void);
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
export declare const setupTestTimeout: (timeout: number) => void;
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
export declare const createIsolatedTestContext: (setup: () => Promise<void>, teardown: () => Promise<void>) => {
    setup: () => Promise<void>;
    teardown: () => Promise<void>;
    reset: () => Promise<void>;
};
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
export declare const mockSystemTime: (date: Date | string | number) => (() => void);
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
export declare const createTestTransaction: (sequelize: Sequelize) => {
    start: () => Promise<Transaction>;
    commit: () => Promise<void>;
    rollback: () => Promise<void>;
    current: Transaction | null;
};
//# sourceMappingURL=testing-utilities-kit.d.ts.map