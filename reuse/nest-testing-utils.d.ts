/**
 * NESTJS TESTING UTILITIES
 *
 * Comprehensive testing utility library for NestJS applications.
 * Provides 45+ helper functions covering:
 * - Test module builders
 * - Mock provider factories
 * - Spy utilities
 * - Request mocking helpers
 * - Response assertion utilities
 * - Database testing helpers
 * - E2E test utilities
 * - Unit test helpers
 * - Integration test utilities
 * - Test data factories
 * - Fixture management
 * - Test cleanup utilities
 * - Mock guard/interceptor/pipe factories
 * - WebSocket testing helpers
 * - GraphQL testing utilities
 * - Performance testing helpers
 * - Snapshot testing utilities
 * - Test coverage helpers
 * - CI/CD test utilities
 * - Test reporting helpers
 *
 * @module NestTestingUtils
 * @version 1.0.0
 * @requires @nestjs/testing ^11.1.8
 * @requires @nestjs/common ^11.1.8
 * @requires jest ^30.2.0
 * @requires supertest ^7.1.4
 * @requires Node.js 18+
 * @requires TypeScript 5.x
 *
 * @security HIPAA compliant - no real PHI in test data
 * @example
 * ```typescript
 * import { createMockRepository, createTestModule } from './nest-testing-utils';
 *
 * describe('UserService', () => {
 *   let service: UserService;
 *   let userRepo: MockRepository<User>;
 *
 *   beforeEach(async () => {
 *     userRepo = createMockRepository<User>();
 *     const module = await createTestModule({
 *       providers: [UserService],
 *       mockProviders: [
 *         { token: getRepositoryToken(User), value: userRepo }
 *       ]
 *     });
 *     service = module.get<UserService>(UserService);
 *   });
 * });
 * ```
 */
import { TestingModule } from '@nestjs/testing';
import { INestApplication, Type, Provider, ExecutionContext, CanActivate, NestInterceptor, PipeTransform, ArgumentMetadata } from '@nestjs/common';
import { Repository } from 'typeorm';
import * as request from 'supertest';
/**
 * Type for mocked repository methods
 */
export type MockRepository<T = any> = {
    find: jest.Mock;
    findOne: jest.Mock;
    findAndCount: jest.Mock;
    findByPk: jest.Mock;
    findAndCountAll: jest.Mock;
    findAll: jest.Mock;
    create: jest.Mock;
    save: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
    destroy: jest.Mock;
    remove: jest.Mock;
    count: jest.Mock;
    restore: jest.Mock;
    increment: jest.Mock;
    decrement: jest.Mock;
    [key: string]: jest.Mock;
};
/**
 * Configuration options for test module creation
 */
export interface TestModuleConfig {
    /** Providers to include in the module */
    providers?: Provider[];
    /** Controllers to include */
    controllers?: Type<any>[];
    /** Imports to include */
    imports?: any[];
    /** Mock providers (auto-mocked) */
    mockProviders?: Array<{
        token: string | symbol | Type<any>;
        value?: any;
    }>;
    /** Enable testing logger */
    enableLogger?: boolean;
}
/**
 * Options for E2E test setup
 */
export interface E2ETestOptions {
    /** Modules to import */
    imports: any[];
    /** Enable global pipes */
    enableValidation?: boolean;
    /** Enable global interceptors */
    enableInterceptors?: boolean;
    /** Database connection for cleanup */
    database?: any;
    /** Authentication token for requests */
    authToken?: string;
}
/**
 * Mock authentication user
 */
export interface MockAuthUser {
    id: string;
    email: string;
    role: string;
    permissions?: string[];
}
/**
 * Test fixture structure
 */
export interface TestFixture<T = any> {
    name: string;
    data: T;
    dependencies?: string[];
}
/**
 * Performance test result
 */
export interface PerformanceResult {
    operation: string;
    executionTime: number;
    memoryUsed: number;
    successful: boolean;
    error?: Error;
}
/**
 * Creates a comprehensive test module with automatic mock setup
 *
 * @param config - Configuration for the test module
 * @returns Compiled testing module
 *
 * @example
 * ```typescript
 * const module = await createTestModule({
 *   providers: [UserService],
 *   mockProviders: [
 *     { token: getRepositoryToken(User), value: createMockRepository() }
 *   ]
 * });
 * ```
 */
export declare function createTestModule(config: TestModuleConfig): Promise<TestingModule>;
/**
 * Creates a test module with all common mocks pre-configured
 *
 * @param providers - Service providers to test
 * @param repositories - Repository tokens to mock
 * @returns Compiled testing module
 *
 * @example
 * ```typescript
 * const module = await createTestModuleWithCommonMocks(
 *   [UserService, AuthService],
 *   [User, RefreshToken]
 * );
 * ```
 */
export declare function createTestModuleWithCommonMocks(providers: Type<any>[], repositories?: Type<any>[]): Promise<TestingModule>;
/**
 * Creates a minimal test module for isolated unit testing
 *
 * @param serviceClass - Service class to test
 * @param dependencies - Dependencies to mock
 * @returns Compiled testing module
 *
 * @example
 * ```typescript
 * const module = await createMinimalTestModule(UserService, [
 *   { provide: UserRepository, useValue: mockUserRepo }
 * ]);
 * ```
 */
export declare function createMinimalTestModule(serviceClass: Type<any>, dependencies?: Provider[]): Promise<TestingModule>;
/**
 * Creates a test module with overrideable providers for testing
 *
 * @param config - Module configuration
 * @param overrides - Provider overrides
 * @returns Compiled testing module
 *
 * @example
 * ```typescript
 * const module = await createOverridableTestModule(
 *   { providers: [UserService] },
 *   { ConfigService: mockConfigService }
 * );
 * ```
 */
export declare function createOverridableTestModule(config: TestModuleConfig, overrides?: Record<string, any>): Promise<TestingModule>;
/**
 * Creates a fully mocked repository with all common methods
 *
 * @template T - Entity type
 * @returns Mock repository instance
 *
 * @example
 * ```typescript
 * const userRepo = createMockRepository<User>();
 * userRepo.findOne.mockResolvedValue(mockUser);
 * ```
 */
export declare function createMockRepository<T = any>(): MockRepository<T>;
/**
 * Creates a mock service with all methods auto-mocked
 *
 * @param serviceClass - Service class to mock
 * @returns Mocked service instance
 *
 * @example
 * ```typescript
 * const mockEmailService = createMockService(EmailService);
 * mockEmailService.sendEmail.mockResolvedValue(true);
 * ```
 */
export declare function createMockService<T = any>(serviceClass: Type<T>): jest.Mocked<T>;
/**
 * Creates a mock ConfigService with preset values
 *
 * @param config - Configuration key-value pairs
 * @returns Mock ConfigService
 *
 * @example
 * ```typescript
 * const mockConfig = createMockConfigService({
 *   JWT_SECRET: 'test-secret',
 *   DATABASE_URL: 'sqlite::memory:'
 * });
 * ```
 */
export declare function createMockConfigService(config?: Record<string, any>): {
    get: any;
    getOrThrow: any;
};
/**
 * Creates a mock logger that suppresses output during tests
 *
 * @returns Mock logger instance
 *
 * @example
 * ```typescript
 * const logger = createMockLogger();
 * logger.log('test'); // No output
 * expect(logger.log).toHaveBeenCalledWith('test');
 * ```
 */
export declare function createMockLogger(): {
    log: any;
    error: any;
    warn: any;
    debug: any;
    verbose: any;
};
/**
 * Creates a spy on a service method with automatic restore
 *
 * @param service - Service instance
 * @param methodName - Method to spy on
 * @returns Jest spy instance
 *
 * @example
 * ```typescript
 * const spy = createServiceSpy(userService, 'findById');
 * spy.mockResolvedValue(mockUser);
 * ```
 */
export declare function createServiceSpy<T>(service: T, methodName: keyof T): jest.SpyInstance;
/**
 * Creates multiple spies on a service with preset return values
 *
 * @param service - Service instance
 * @param methods - Method configurations
 * @returns Map of method names to spies
 *
 * @example
 * ```typescript
 * const spies = createMultipleSpies(userService, {
 *   findById: mockUser,
 *   findAll: [mockUser]
 * });
 * ```
 */
export declare function createMultipleSpies<T>(service: T, methods: Partial<Record<keyof T, any>>): Map<keyof T, jest.SpyInstance>;
/**
 * Restores all spies created in a test
 *
 * @param spies - Array or Map of spies to restore
 *
 * @example
 * ```typescript
 * afterEach(() => {
 *   restoreAllSpies([spy1, spy2, spy3]);
 * });
 * ```
 */
export declare function restoreAllSpies(spies: jest.SpyInstance[] | Map<any, jest.SpyInstance>): void;
/**
 * Creates a mock Express request object
 *
 * @param overrides - Properties to override
 * @returns Mock request object
 *
 * @example
 * ```typescript
 * const req = createMockRequest({
 *   user: { id: '123', role: 'admin' },
 *   params: { id: 'user-123' }
 * });
 * ```
 */
export declare function createMockRequest(overrides?: Partial<any>): any;
/**
 * Creates a mock Express response object
 *
 * @returns Mock response object with chainable methods
 *
 * @example
 * ```typescript
 * const res = createMockResponse();
 * res.status(200).json({ message: 'Success' });
 * expect(res.status).toHaveBeenCalledWith(200);
 * ```
 */
export declare function createMockResponse(): any;
/**
 * Creates a mock execution context for guards/interceptors
 *
 * @param request - Request object
 * @param handler - Handler metadata
 * @returns Mock execution context
 *
 * @example
 * ```typescript
 * const context = createMockExecutionContext(
 *   createMockRequest({ user: mockUser }),
 *   { class: UserController, handler: findAll }
 * );
 * ```
 */
export declare function createMockExecutionContext(request?: any, handler?: any): ExecutionContext;
/**
 * Creates a mock authenticated request with user
 *
 * @param user - User object
 * @param overrides - Additional request properties
 * @returns Mock authenticated request
 *
 * @example
 * ```typescript
 * const req = createAuthenticatedRequest({
 *   id: 'user-123',
 *   role: 'nurse',
 *   email: 'nurse@example.com'
 * });
 * ```
 */
export declare function createAuthenticatedRequest(user: MockAuthUser, overrides?: Partial<any>): any;
/**
 * Asserts that a response has expected status and structure
 *
 * @param response - Supertest response
 * @param expectedStatus - Expected HTTP status code
 * @param expectedShape - Expected response body shape
 *
 * @example
 * ```typescript
 * await assertResponse(response, 200, {
 *   id: expect.any(String),
 *   email: 'user@example.com'
 * });
 * ```
 */
export declare function assertResponse(response: request.Response, expectedStatus: number, expectedShape?: any): void;
/**
 * Asserts successful response with data
 *
 * @param response - Supertest response
 * @param dataValidator - Function to validate response data
 *
 * @example
 * ```typescript
 * assertSuccessResponse(response, (data) => {
 *   expect(data).toHaveProperty('id');
 *   expect(data.email).toBe('test@example.com');
 * });
 * ```
 */
export declare function assertSuccessResponse(response: request.Response, dataValidator?: (data: any) => void): void;
/**
 * Asserts error response with expected message
 *
 * @param response - Supertest response
 * @param expectedStatus - Expected error status
 * @param expectedMessage - Expected error message (partial match)
 *
 * @example
 * ```typescript
 * assertErrorResponse(response, 404, 'User not found');
 * ```
 */
export declare function assertErrorResponse(response: request.Response, expectedStatus: number, expectedMessage?: string): void;
/**
 * Asserts pagination response structure
 *
 * @param response - Supertest response
 * @param expectedTotal - Expected total count
 *
 * @example
 * ```typescript
 * assertPaginationResponse(response, 100);
 * expect(response.body.items).toHaveLength(20);
 * ```
 */
export declare function assertPaginationResponse(response: request.Response, expectedTotal?: number): void;
/**
 * Creates an in-memory SQLite database for testing
 *
 * @returns Database configuration object
 *
 * @example
 * ```typescript
 * const dbConfig = createInMemoryDatabase();
 * TypeOrmModule.forRoot(dbConfig)
 * ```
 */
export declare function createInMemoryDatabase(): {
    type: "sqlite";
    database: string;
    synchronize: boolean;
    logging: boolean;
    dropSchema: boolean;
};
/**
 * Clears all data from specified repositories
 *
 * @param repositories - Repositories to clear
 *
 * @example
 * ```typescript
 * beforeEach(async () => {
 *   await clearRepositories([userRepo, postRepo]);
 * });
 * ```
 */
export declare function clearRepositories(repositories: Repository<any>[]): Promise<void>;
/**
 * Seeds database with test data
 *
 * @param repository - Repository to seed
 * @param data - Array of entities to create
 * @returns Created entities
 *
 * @example
 * ```typescript
 * const users = await seedDatabase(userRepo, [
 *   { email: 'user1@test.com' },
 *   { email: 'user2@test.com' }
 * ]);
 * ```
 */
export declare function seedDatabase<T>(repository: Repository<T>, data: Partial<T>[]): Promise<T[]>;
/**
 * Creates a database transaction wrapper for tests
 *
 * @param callback - Test function to run in transaction
 * @param repositories - Repositories involved
 *
 * @example
 * ```typescript
 * await withTransaction(async () => {
 *   await userService.create(createDto);
 *   await expect(userRepo.count()).resolves.toBe(1);
 * }, [userRepo]);
 * ```
 */
export declare function withTransaction<T>(callback: () => Promise<T>, repositories: Repository<any>[]): Promise<T>;
/**
 * Sets up E2E testing environment with app instance
 *
 * @param options - E2E test configuration
 * @returns Initialized NestJS application
 *
 * @example
 * ```typescript
 * let app: INestApplication;
 * beforeAll(async () => {
 *   app = await setupE2ETest({ imports: [AppModule] });
 * });
 * ```
 */
export declare function setupE2ETest(options: E2ETestOptions): Promise<INestApplication>;
/**
 * Creates authenticated E2E request
 *
 * @param app - NestJS application
 * @param method - HTTP method
 * @param path - Request path
 * @param token - Auth token
 * @returns Supertest request
 *
 * @example
 * ```typescript
 * const response = await createAuthenticatedE2ERequest(
 *   app, 'GET', '/users', authToken
 * );
 * ```
 */
export declare function createAuthenticatedE2ERequest(app: INestApplication, method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE', path: string, token: string): request.Test;
/**
 * Performs E2E login and returns auth token
 *
 * @param app - NestJS application
 * @param credentials - Login credentials
 * @returns Authentication token
 *
 * @example
 * ```typescript
 * const token = await performE2ELogin(app, {
 *   email: 'test@example.com',
 *   password: 'password123'
 * });
 * ```
 */
export declare function performE2ELogin(app: INestApplication, credentials: {
    email: string;
    password: string;
}): Promise<string>;
/**
 * Cleans up E2E test environment
 *
 * @param app - NestJS application to close
 * @param database - Database connection to close
 *
 * @example
 * ```typescript
 * afterAll(async () => {
 *   await cleanupE2ETest(app, dataSource);
 * });
 * ```
 */
export declare function cleanupE2ETest(app: INestApplication, database?: any): Promise<void>;
/**
 * Creates a test suite wrapper with common setup/teardown
 *
 * @param suiteName - Test suite name
 * @param tests - Test definitions
 *
 * @example
 * ```typescript
 * createTestSuite('UserService', (getService) => {
 *   it('should create user', async () => {
 *     const service = getService();
 *     await service.create(createDto);
 *   });
 * });
 * ```
 */
export declare function createTestSuite<T>(suiteName: string, tests: (getService: () => T) => void): void;
/**
 * Creates parameterized test cases
 *
 * @param testName - Test name template
 * @param cases - Array of test cases
 * @param testFn - Test function
 *
 * @example
 * ```typescript
 * createParameterizedTest('should validate %s', [
 *   ['email', 'invalid-email', false],
 *   ['email', 'valid@email.com', true]
 * ], async (field, value, expected) => {
 *   const result = await validator.validate(field, value);
 *   expect(result).toBe(expected);
 * });
 * ```
 */
export declare function createParameterizedTest<T extends any[]>(testName: string, cases: T[], testFn: (...args: T) => void | Promise<void>): void;
/**
 * Waits for async operations to complete
 *
 * @param ms - Milliseconds to wait
 *
 * @example
 * ```typescript
 * await waitForAsync(100);
 * expect(eventHandler).toHaveBeenCalled();
 * ```
 */
export declare function waitForAsync(ms?: number): Promise<void>;
/**
 * Creates integration test module with real database
 *
 * @param imports - Modules to import
 * @param entities - Database entities
 * @returns Testing module
 *
 * @example
 * ```typescript
 * const module = await createIntegrationTestModule(
 *   [UserModule],
 *   [User, Post]
 * );
 * ```
 */
export declare function createIntegrationTestModule(imports: any[], entities?: any[]): Promise<TestingModule>;
/**
 * Tests module integration with dependencies
 *
 * @param moduleClass - Module to test
 * @param dependencies - Required dependencies
 * @returns Testing module
 *
 * @example
 * ```typescript
 * const module = await testModuleIntegration(UserModule, [
 *   DatabaseModule, AuthModule
 * ]);
 * ```
 */
export declare function testModuleIntegration(moduleClass: Type<any>, dependencies: Type<any>[]): Promise<TestingModule>;
/**
 * Creates a factory function for generating test entities
 *
 * @param defaults - Default entity properties
 * @returns Factory function
 *
 * @example
 * ```typescript
 * const createUser = createEntityFactory<User>({
 *   email: () => faker.internet.email(),
 *   role: 'user'
 * });
 * const user = createUser({ email: 'custom@example.com' });
 * ```
 */
export declare function createEntityFactory<T>(defaults: Partial<T> | (() => Partial<T>)): (overrides?: Partial<T>) => T;
/**
 * Generates random test user data
 *
 * @param overrides - Properties to override
 * @returns User test data
 *
 * @example
 * ```typescript
 * const user = generateTestUser({ role: 'admin' });
 * ```
 */
export declare function generateTestUser(overrides?: any): any;
/**
 * Generates multiple test entities
 *
 * @param count - Number of entities
 * @param factory - Factory function
 * @param overrides - Overrides for all entities
 * @returns Array of entities
 *
 * @example
 * ```typescript
 * const users = generateMultiple(10, generateTestUser, { role: 'nurse' });
 * ```
 */
export declare function generateMultiple<T>(count: number, factory: (overrides?: any) => T, overrides?: any): T[];
/**
 * Generates HIPAA-compliant test PHI data (de-identified)
 *
 * @param overrides - Properties to override
 * @returns De-identified health record
 *
 * @example
 * ```typescript
 * const record = generateTestHealthRecord();
 * // All data is fake and HIPAA-compliant for testing
 * ```
 */
export declare function generateTestHealthRecord(overrides?: any): any;
/**
 * Loads test fixtures from objects
 *
 * @param fixtures - Fixture definitions
 * @returns Map of fixtures
 *
 * @example
 * ```typescript
 * const fixtures = loadFixtures({
 *   adminUser: { name: 'admin', data: adminUserData },
 *   regularUser: { name: 'user', data: userData }
 * });
 * ```
 */
export declare function loadFixtures<T = any>(fixtures: Record<string, TestFixture<T>>): Map<string, T>;
/**
 * Applies fixtures to database repositories
 *
 * @param fixtures - Fixtures to apply
 * @param repositories - Target repositories
 *
 * @example
 * ```typescript
 * await applyFixturesToDatabase(
 *   { users: [user1, user2] },
 *   { users: userRepository }
 * );
 * ```
 */
export declare function applyFixturesToDatabase(fixtures: Record<string, any[]>, repositories: Record<string, Repository<any>>): Promise<void>;
/**
 * Resets all mocks and clears state
 *
 * @example
 * ```typescript
 * afterEach(() => {
 *   resetAllMocks();
 * });
 * ```
 */
export declare function resetAllMocks(): void;
/**
 * Cleans up test resources (database, cache, files)
 *
 * @param resources - Resources to clean
 *
 * @example
 * ```typescript
 * afterAll(async () => {
 *   await cleanupTestResources({
 *     repositories: [userRepo],
 *     cache: cacheManager
 *   });
 * });
 * ```
 */
export declare function cleanupTestResources(resources: {
    repositories?: Repository<any>[];
    cache?: any;
    files?: string[];
}): Promise<void>;
/**
 * Creates a mock guard that always allows access
 *
 * @param shouldAllow - Whether to allow access
 * @returns Mock guard
 *
 * @example
 * ```typescript
 * const mockGuard = createMockGuard(true);
 * moduleRef.overrideGuard(AuthGuard).useValue(mockGuard);
 * ```
 */
export declare function createMockGuard(shouldAllow?: boolean): CanActivate;
/**
 * Creates a mock interceptor for testing
 *
 * @param transform - Transform function
 * @returns Mock interceptor
 *
 * @example
 * ```typescript
 * const mockInterceptor = createMockInterceptor((data) => ({
 *   ...data,
 *   timestamp: Date.now()
 * }));
 * ```
 */
export declare function createMockInterceptor(transform?: (data: any) => any): NestInterceptor;
/**
 * Creates a mock pipe for validation testing
 *
 * @param transformFn - Transform function
 * @returns Mock pipe
 *
 * @example
 * ```typescript
 * const mockPipe = createMockPipe((value) => value.toLowerCase());
 * ```
 */
export declare function createMockPipe(transformFn?: (value: any, metadata: ArgumentMetadata) => any): PipeTransform;
/**
 * Creates a mock JWT strategy for authentication testing
 *
 * @param user - User to return
 * @returns Mock strategy
 *
 * @example
 * ```typescript
 * const strategy = createMockJwtStrategy(mockUser);
 * ```
 */
export declare function createMockJwtStrategy(user: any): {
    validate: any;
};
/**
 * Creates a mock WebSocket client
 *
 * @param events - Event handlers
 * @returns Mock socket client
 *
 * @example
 * ```typescript
 * const client = createMockWebSocketClient({
 *   onMessage: (data) => console.log(data)
 * });
 * ```
 */
export declare function createMockWebSocketClient(events?: any): any;
/**
 * Simulates WebSocket event emission
 *
 * @param gateway - Gateway instance
 * @param event - Event name
 * @param data - Event data
 *
 * @example
 * ```typescript
 * await emitWebSocketEvent(gateway, 'message', { text: 'Hello' });
 * ```
 */
export declare function emitWebSocketEvent(gateway: any, event: string, data: any): Promise<void>;
/**
 * Creates a GraphQL test client
 *
 * @param app - NestJS application
 * @returns GraphQL test client
 *
 * @example
 * ```typescript
 * const gqlClient = createGraphQLTestClient(app);
 * const result = await gqlClient.query('{ users { id } }');
 * ```
 */
export declare function createGraphQLTestClient(app: INestApplication): {
    query: (query: string, variables?: any) => any;
    mutate: (mutation: string, variables?: any) => any;
};
/**
 * Asserts GraphQL response structure
 *
 * @param response - GraphQL response
 * @param expectations - Expected data shape
 *
 * @example
 * ```typescript
 * assertGraphQLResponse(response, {
 *   data: { users: expect.any(Array) }
 * });
 * ```
 */
export declare function assertGraphQLResponse(response: any, expectations: any): void;
/**
 * Measures execution time of async operations
 *
 * @param operation - Operation to measure
 * @param iterations - Number of iterations
 * @returns Performance results
 *
 * @example
 * ```typescript
 * const result = await measurePerformance(
 *   () => userService.findAll(),
 *   100
 * );
 * expect(result.averageTime).toBeLessThan(100);
 * ```
 */
export declare function measurePerformance(operation: () => Promise<any>, iterations?: number): Promise<{
    averageTime: number;
    totalTime: number;
    minTime: number;
    maxTime: number;
}>;
/**
 * Checks memory usage during operation
 *
 * @param operation - Operation to monitor
 * @returns Memory usage stats
 *
 * @example
 * ```typescript
 * const stats = await checkMemoryUsage(
 *   () => service.processLargeDataset(data)
 * );
 * expect(stats.heapIncrease).toBeLessThan(100 * 1024 * 1024);
 * ```
 */
export declare function checkMemoryUsage(operation: () => Promise<any>): Promise<{
    heapBefore: number;
    heapAfter: number;
    heapIncrease: number;
}>;
/**
 * Creates sanitized snapshot (removes timestamps, IDs)
 *
 * @param data - Data to snapshot
 * @param keysToRemove - Keys to remove before snapshot
 * @returns Sanitized data
 *
 * @example
 * ```typescript
 * expect(createSanitizedSnapshot(user, ['createdAt', 'id']))
 *   .toMatchSnapshot();
 * ```
 */
export declare function createSanitizedSnapshot(data: any, keysToRemove?: string[]): any;
/**
 * Compares object structure without exact values
 *
 * @param actual - Actual object
 * @param expected - Expected structure
 *
 * @example
 * ```typescript
 * assertStructureMatch(response.body, {
 *   id: expect.any(String),
 *   email: expect.any(String)
 * });
 * ```
 */
export declare function assertStructureMatch(actual: any, expected: any): void;
/**
 * Ensures all service methods are tested
 *
 * @param serviceClass - Service class
 * @param testedMethods - Methods that have tests
 * @returns Untested methods
 *
 * @example
 * ```typescript
 * const untested = ensureFullCoverage(UserService, [
 *   'findAll', 'findById', 'create'
 * ]);
 * expect(untested).toHaveLength(0);
 * ```
 */
export declare function ensureFullCoverage(serviceClass: Type<any>, testedMethods: string[]): string[];
/**
 * Generates coverage report summary
 *
 * @param coverageData - Jest coverage data
 * @returns Coverage summary
 *
 * @example
 * ```typescript
 * const summary = generateCoverageSummary(global.__coverage__);
 * console.log(`Coverage: ${summary.percentage}%`);
 * ```
 */
export declare function generateCoverageSummary(coverageData: any): {
    total: number;
    covered: number;
    percentage: number;
};
/**
 * Checks if running in CI environment
 *
 * @returns True if in CI
 *
 * @example
 * ```typescript
 * if (isRunningInCI()) {
 *   // Skip local-only tests
 * }
 * ```
 */
export declare function isRunningInCI(): boolean;
/**
 * Skips tests in CI environment
 *
 * @param testName - Test description
 * @param testFn - Test function
 *
 * @example
 * ```typescript
 * skipInCI('should connect to external API', async () => {
 *   // This test only runs locally
 * });
 * ```
 */
export declare function skipInCI(testName: string, testFn: () => void | Promise<void>): void;
/**
 * Logs test execution details
 *
 * @param testName - Test name
 * @param result - Test result
 *
 * @example
 * ```typescript
 * afterEach(() => {
 *   logTestExecution(expect.getState().currentTestName, 'passed');
 * });
 * ```
 */
export declare function logTestExecution(testName: string, result: 'passed' | 'failed'): void;
/**
 * Creates custom test reporter output
 *
 * @param results - Test results
 * @returns Formatted report
 *
 * @example
 * ```typescript
 * const report = createTestReport({
 *   total: 100,
 *   passed: 95,
 *   failed: 5,
 *   duration: 5000
 * });
 * ```
 */
export declare function createTestReport(results: {
    total: number;
    passed: number;
    failed: number;
    duration: number;
}): string;
declare const _default: {
    createTestModule: typeof createTestModule;
    createTestModuleWithCommonMocks: typeof createTestModuleWithCommonMocks;
    createMinimalTestModule: typeof createMinimalTestModule;
    createOverridableTestModule: typeof createOverridableTestModule;
    createMockRepository: typeof createMockRepository;
    createMockService: typeof createMockService;
    createMockConfigService: typeof createMockConfigService;
    createMockLogger: typeof createMockLogger;
    createServiceSpy: typeof createServiceSpy;
    createMultipleSpies: typeof createMultipleSpies;
    restoreAllSpies: typeof restoreAllSpies;
    createMockRequest: typeof createMockRequest;
    createMockResponse: typeof createMockResponse;
    createMockExecutionContext: typeof createMockExecutionContext;
    createAuthenticatedRequest: typeof createAuthenticatedRequest;
    assertResponse: typeof assertResponse;
    assertSuccessResponse: typeof assertSuccessResponse;
    assertErrorResponse: typeof assertErrorResponse;
    assertPaginationResponse: typeof assertPaginationResponse;
    createInMemoryDatabase: typeof createInMemoryDatabase;
    clearRepositories: typeof clearRepositories;
    seedDatabase: typeof seedDatabase;
    withTransaction: typeof withTransaction;
    setupE2ETest: typeof setupE2ETest;
    createAuthenticatedE2ERequest: typeof createAuthenticatedE2ERequest;
    performE2ELogin: typeof performE2ELogin;
    cleanupE2ETest: typeof cleanupE2ETest;
    createTestSuite: typeof createTestSuite;
    createParameterizedTest: typeof createParameterizedTest;
    waitForAsync: typeof waitForAsync;
    createIntegrationTestModule: typeof createIntegrationTestModule;
    testModuleIntegration: typeof testModuleIntegration;
    createEntityFactory: typeof createEntityFactory;
    generateTestUser: typeof generateTestUser;
    generateMultiple: typeof generateMultiple;
    generateTestHealthRecord: typeof generateTestHealthRecord;
    loadFixtures: typeof loadFixtures;
    applyFixturesToDatabase: typeof applyFixturesToDatabase;
    resetAllMocks: typeof resetAllMocks;
    cleanupTestResources: typeof cleanupTestResources;
    createMockGuard: typeof createMockGuard;
    createMockInterceptor: typeof createMockInterceptor;
    createMockPipe: typeof createMockPipe;
    createMockJwtStrategy: typeof createMockJwtStrategy;
    createMockWebSocketClient: typeof createMockWebSocketClient;
    emitWebSocketEvent: typeof emitWebSocketEvent;
    createGraphQLTestClient: typeof createGraphQLTestClient;
    assertGraphQLResponse: typeof assertGraphQLResponse;
    measurePerformance: typeof measurePerformance;
    checkMemoryUsage: typeof checkMemoryUsage;
    createSanitizedSnapshot: typeof createSanitizedSnapshot;
    assertStructureMatch: typeof assertStructureMatch;
    ensureFullCoverage: typeof ensureFullCoverage;
    generateCoverageSummary: typeof generateCoverageSummary;
    isRunningInCI: typeof isRunningInCI;
    skipInCI: typeof skipInCI;
    logTestExecution: typeof logTestExecution;
    createTestReport: typeof createTestReport;
};
export default _default;
//# sourceMappingURL=nest-testing-utils.d.ts.map