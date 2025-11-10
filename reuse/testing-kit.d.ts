/**
 * LOC: TEST1234567
 * File: /reuse/testing-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Test files (*.spec.ts, *.test.ts)
 *   - E2E test suites
 *   - Integration test modules
 */
import { ModuleMetadata, Type } from '@nestjs/common';
import { TestingModule, TestingModuleBuilder } from '@nestjs/testing';
interface TestModuleConfig extends ModuleMetadata {
    useInMemoryDatabase?: boolean;
    useTestLogger?: boolean;
    enableDebug?: boolean;
}
interface MockProviderOptions {
    methods?: string[];
    properties?: Record<string, any>;
    returnValues?: Record<string, any>;
    implementation?: any;
}
interface IntegrationTestConfig {
    database?: {
        type: 'postgres' | 'mysql' | 'sqlite' | 'mongodb';
        url?: string;
        resetBetweenTests?: boolean;
    };
    cache?: {
        enabled: boolean;
        ttl?: number;
    };
    mocks?: string[];
}
interface E2ETestOptions {
    preserveDatabase?: boolean;
    disableAuth?: boolean;
    timeout?: number;
    retries?: number;
}
interface TestDataGeneratorOptions {
    count?: number;
    overrides?: Record<string, any>;
    faker?: boolean;
    locale?: string;
}
interface SnapshotOptions {
    updateAll?: boolean;
    name?: string;
    inline?: boolean;
}
interface TestCleanupConfig {
    database?: boolean;
    cache?: boolean;
    files?: boolean;
    mocks?: boolean;
}
interface AsyncTestOptions {
    timeout?: number;
    retries?: number;
    waitFor?: () => Promise<boolean>;
}
interface TestIsolationConfig {
    database?: boolean;
    environment?: boolean;
    globals?: boolean;
    randomize?: boolean;
}
interface TestContext {
    module?: TestingModule;
    app?: any;
    database?: any;
    cache?: any;
    metadata?: Record<string, any>;
}
/**
 * 1. Creates a NestJS testing module with common defaults.
 *
 * @param {TestModuleConfig} config - Test module configuration
 * @returns {Promise<TestingModuleBuilder>} Testing module builder
 *
 * @example
 * ```typescript
 * const moduleBuilder = await createTestModule({
 *   providers: [UserService],
 *   imports: [TypeOrmModule.forFeature([User])],
 *   useInMemoryDatabase: true
 * });
 * const module = await moduleBuilder.compile();
 * ```
 */
export declare const createTestModule: (config: TestModuleConfig) => Promise<TestingModuleBuilder>;
/**
 * 2. Creates a minimal testing module for unit tests.
 *
 * @param {Type<any>} target - Target class to test
 * @param {any[]} [dependencies] - Dependencies to inject
 * @returns {Promise<TestingModule>} Compiled testing module
 *
 * @example
 * ```typescript
 * const module = await createUnitTestModule(UserService, [
 *   { provide: getRepositoryToken(User), useValue: mockRepository }
 * ]);
 * ```
 */
export declare const createUnitTestModule: (target: Type<any>, dependencies?: any[]) => Promise<TestingModule>;
/**
 * 3. Creates a testing module with all dependencies mocked.
 *
 * @param {Type<any>} target - Target class to test
 * @param {string[]} [dependencyNames] - Names of dependencies to mock
 * @returns {Promise<TestingModule>} Module with mocked dependencies
 *
 * @example
 * ```typescript
 * const module = await createMockedModule(UserService, ['UserRepository', 'EmailService']);
 * const service = module.get(UserService);
 * ```
 */
export declare const createMockedModule: (target: Type<any>, dependencyNames?: string[]) => Promise<TestingModule>;
/**
 * 4. Creates a testing module with database integration.
 *
 * @param {TestModuleConfig} config - Module configuration
 * @param {string} [dbType] - Database type (default: 'sqlite')
 * @returns {Promise<TestingModule>} Module with database configured
 *
 * @example
 * ```typescript
 * const module = await createDatabaseTestModule({
 *   providers: [UserService],
 *   imports: [TypeOrmModule.forFeature([User])]
 * }, 'sqlite');
 * ```
 */
export declare const createDatabaseTestModule: (config: TestModuleConfig, dbType?: string) => Promise<TestingModule>;
/**
 * 5. Creates a testing module for GraphQL resolvers.
 *
 * @param {Type<any>} resolver - GraphQL resolver class
 * @param {any[]} [providers] - Additional providers
 * @returns {Promise<TestingModule>} Module configured for GraphQL testing
 *
 * @example
 * ```typescript
 * const module = await createGraphQLTestModule(UserResolver, [UserService]);
 * const resolver = module.get(UserResolver);
 * ```
 */
export declare const createGraphQLTestModule: (resolver: Type<any>, providers?: any[]) => Promise<TestingModule>;
/**
 * 6. Creates a testing module for WebSocket gateways.
 *
 * @param {Type<any>} gateway - WebSocket gateway class
 * @param {any[]} [providers] - Additional providers
 * @returns {Promise<TestingModule>} Module configured for WebSocket testing
 *
 * @example
 * ```typescript
 * const module = await createWebSocketTestModule(ChatGateway, [ChatService]);
 * const gateway = module.get(ChatGateway);
 * ```
 */
export declare const createWebSocketTestModule: (gateway: Type<any>, providers?: any[]) => Promise<TestingModule>;
/**
 * 7. Creates an automatic mock object with all methods mocked.
 *
 * @param {MockProviderOptions} [options] - Mock configuration options
 * @returns {any} Mock object with jest.fn() methods
 *
 * @example
 * ```typescript
 * const mockService = createAutoMock({
 *   methods: ['find', 'create', 'update'],
 *   returnValues: { find: [] }
 * });
 * ```
 */
export declare const createAutoMock: (options?: MockProviderOptions) => any;
/**
 * 8. Creates a mock repository with common database methods.
 *
 * @template T
 * @param {Partial<T>} [mockData] - Default mock data to return
 * @returns {any} Mock repository object
 *
 * @example
 * ```typescript
 * const mockRepo = createMockRepository<User>({ id: 1, name: 'John' });
 * mockRepo.findOne.mockResolvedValue({ id: 1, name: 'John' });
 * ```
 */
export declare const createMockRepository: <T>(mockData?: Partial<T>) => any;
/**
 * 9. Creates a mock service with configurable methods.
 *
 * @param {string[]} methods - Method names to mock
 * @param {Record<string, any>} [defaultReturns] - Default return values
 * @returns {any} Mock service object
 *
 * @example
 * ```typescript
 * const mockService = createMockService(
 *   ['getUser', 'createUser'],
 *   { getUser: { id: 1, name: 'John' } }
 * );
 * ```
 */
export declare const createMockService: (methods: string[], defaultReturns?: Record<string, any>) => any;
/**
 * 10. Creates a mock HTTP service for external API calls.
 *
 * @param {Record<string, any>} [responses] - Mock responses by endpoint
 * @returns {any} Mock HTTP service
 *
 * @example
 * ```typescript
 * const mockHttp = createMockHttpService({
 *   '/api/users': { data: [{ id: 1 }] }
 * });
 * ```
 */
export declare const createMockHttpService: (responses?: Record<string, any>) => any;
/**
 * 11. Creates a mock configuration service.
 *
 * @param {Record<string, any>} config - Configuration values
 * @returns {any} Mock config service
 *
 * @example
 * ```typescript
 * const mockConfig = createMockConfigService({
 *   JWT_SECRET: 'test-secret',
 *   DATABASE_URL: 'sqlite::memory:'
 * });
 * ```
 */
export declare const createMockConfigService: (config: Record<string, any>) => any;
/**
 * 12. Creates a mock logger service.
 *
 * @returns {any} Mock logger with all methods
 *
 * @example
 * ```typescript
 * const mockLogger = createMockLogger();
 * mockLogger.log.mockImplementation((msg) => console.log(msg));
 * ```
 */
export declare const createMockLogger: () => any;
/**
 * 13. Sets up integration test environment with database.
 *
 * @param {IntegrationTestConfig} config - Integration test configuration
 * @returns {Promise<TestContext>} Test context with resources
 *
 * @example
 * ```typescript
 * const context = await setupIntegrationTest({
 *   database: { type: 'postgres', resetBetweenTests: true },
 *   cache: { enabled: true }
 * });
 * ```
 */
export declare const setupIntegrationTest: (config: IntegrationTestConfig) => Promise<TestContext>;
/**
 * 14. Tears down integration test environment.
 *
 * @param {TestContext} context - Test context to tear down
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * afterAll(async () => {
 *   await teardownIntegrationTest(context);
 * });
 * ```
 */
export declare const teardownIntegrationTest: (context: TestContext) => Promise<void>;
/**
 * 15. Initializes test database with schema and migrations.
 *
 * @param {any} config - Database configuration
 * @returns {Promise<any>} Database connection
 *
 * @example
 * ```typescript
 * const db = await initializeTestDatabase({
 *   type: 'sqlite',
 *   database: ':memory:'
 * });
 * ```
 */
export declare const initializeTestDatabase: (config: any) => Promise<any>;
/**
 * 16. Resets database to clean state between tests.
 *
 * @param {any} database - Database connection
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * beforeEach(async () => {
 *   await resetTestDatabase(context.database);
 * });
 * ```
 */
export declare const resetTestDatabase: (database: any) => Promise<void>;
/**
 * 17. Initializes test cache instance.
 *
 * @param {any} config - Cache configuration
 * @returns {Promise<any>} Cache instance
 *
 * @example
 * ```typescript
 * const cache = await initializeTestCache({ ttl: 60 });
 * ```
 */
export declare const initializeTestCache: (config: any) => Promise<any>;
/**
 * 18. Clears all cached data in test cache.
 *
 * @param {any} cache - Cache instance
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await clearTestCache(context.cache);
 * ```
 */
export declare const clearTestCache: (cache: any) => Promise<void>;
/**
 * 19. Sets up E2E test application instance.
 *
 * @param {any} AppModule - Application module
 * @param {E2ETestOptions} [options] - E2E test options
 * @returns {Promise<any>} Initialized application instance
 *
 * @example
 * ```typescript
 * const app = await setupE2ETest(AppModule, { disableAuth: true });
 * ```
 */
export declare const setupE2ETest: (AppModule: any, options?: E2ETestOptions) => Promise<any>;
/**
 * 20. Creates E2E test request builder with authentication.
 *
 * @param {any} app - Application instance
 * @param {string} [token] - JWT token for authentication
 * @returns {any} Request builder
 *
 * @example
 * ```typescript
 * const request = createE2ERequest(app, authToken);
 * await request.get('/api/users').expect(200);
 * ```
 */
export declare const createE2ERequest: (app: any, token?: string) => any;
/**
 * 21. Creates authenticated E2E test session.
 *
 * @param {any} app - Application instance
 * @param {any} credentials - Login credentials
 * @returns {Promise<{ token: string; request: any }>} Authenticated session
 *
 * @example
 * ```typescript
 * const session = await createAuthenticatedSession(app, {
 *   email: 'test@example.com',
 *   password: 'password123'
 * });
 * ```
 */
export declare const createAuthenticatedSession: (app: any, credentials: any) => Promise<{
    token: string;
    request: any;
}>;
/**
 * 22. Validates E2E response against schema.
 *
 * @param {any} response - HTTP response
 * @param {any} schema - JSON schema or validator
 * @returns {boolean} True if response matches schema
 *
 * @example
 * ```typescript
 * const isValid = validateE2EResponse(response, {
 *   type: 'object',
 *   properties: { id: { type: 'number' } }
 * });
 * ```
 */
export declare const validateE2EResponse: (response: any, schema: any) => boolean;
/**
 * 23. Waits for E2E condition to be met.
 *
 * @param {() => Promise<boolean>} condition - Condition to wait for
 * @param {number} [timeout] - Timeout in milliseconds
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await waitForE2ECondition(
 *   async () => (await db.count()) > 0,
 *   5000
 * );
 * ```
 */
export declare const waitForE2ECondition: (condition: () => Promise<boolean>, timeout?: number) => Promise<void>;
/**
 * 24. Generates test user data.
 *
 * @param {TestDataGeneratorOptions} [options] - Generator options
 * @returns {any} Generated user data
 *
 * @example
 * ```typescript
 * const user = generateTestUser({ overrides: { email: 'custom@test.com' } });
 * ```
 */
export declare const generateTestUser: (options?: TestDataGeneratorOptions) => any;
/**
 * 25. Generates test patient data (HIPAA-compliant test data).
 *
 * @param {TestDataGeneratorOptions} [options] - Generator options
 * @returns {any} Generated patient data
 *
 * @example
 * ```typescript
 * const patient = generateTestPatient({ overrides: { mrn: 'MRN12345' } });
 * ```
 */
export declare const generateTestPatient: (options?: TestDataGeneratorOptions) => any;
/**
 * 26. Generates bulk test data.
 *
 * @template T
 * @param {() => T} generator - Generator function
 * @param {number} count - Number of items to generate
 * @returns {T[]} Array of generated items
 *
 * @example
 * ```typescript
 * const users = generateBulkTestData(generateTestUser, 50);
 * ```
 */
export declare const generateBulkTestData: <T>(generator: () => T, count: number) => T[];
/**
 * 27. Creates test data factory with templates.
 *
 * @template T
 * @param {Partial<T>} template - Data template
 * @returns {(overrides?: Partial<T>) => T} Factory function
 *
 * @example
 * ```typescript
 * const userFactory = createTestDataFactory({ role: 'user', isActive: true });
 * const user = userFactory({ email: 'test@example.com' });
 * ```
 */
export declare const createTestDataFactory: <T>(template: Partial<T>) => ((overrides?: Partial<T>) => T);
/**
 * 28. Seeds database with test data.
 *
 * @param {any} database - Database connection
 * @param {Record<string, any[]>} seedData - Data to seed
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await seedTestDatabase(db, {
 *   users: [user1, user2],
 *   patients: [patient1, patient2]
 * });
 * ```
 */
export declare const seedTestDatabase: (database: any, seedData: Record<string, any[]>) => Promise<void>;
/**
 * 29. Asserts that value matches partial object.
 *
 * @param {any} actual - Actual value
 * @param {any} expected - Expected partial object
 * @returns {void}
 *
 * @example
 * ```typescript
 * expectToMatchPartial(user, { email: 'test@example.com', isActive: true });
 * ```
 */
export declare const expectToMatchPartial: (actual: any, expected: any) => void;
/**
 * 30. Asserts array contains item matching partial object.
 *
 * @param {any[]} array - Array to search
 * @param {any} partial - Partial object to match
 * @returns {void}
 *
 * @example
 * ```typescript
 * expectArrayContainsPartial(users, { email: 'test@example.com' });
 * ```
 */
export declare const expectArrayContainsPartial: (array: any[], partial: any) => void;
/**
 * 31. Asserts that async function throws specific error.
 *
 * @param {() => Promise<any>} fn - Async function
 * @param {any} errorType - Expected error type or message
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await expectAsyncToThrow(() => service.invalid(), NotFoundException);
 * ```
 */
export declare const expectAsyncToThrow: (fn: () => Promise<any>, errorType: any) => Promise<void>;
/**
 * 32. Asserts date is within time range.
 *
 * @param {Date} actual - Actual date
 * @param {Date} expected - Expected date
 * @param {number} [deltaMs] - Allowed delta in milliseconds
 * @returns {void}
 *
 * @example
 * ```typescript
 * expectDateWithinRange(new Date(), expectedDate, 1000);
 * ```
 */
export declare const expectDateWithinRange: (actual: Date, expected: Date, deltaMs?: number) => void;
/**
 * 33. Asserts that mock was called with partial arguments.
 *
 * @param {jest.Mock} mock - Jest mock function
 * @param {any[]} partialArgs - Partial arguments to match
 * @returns {void}
 *
 * @example
 * ```typescript
 * expectMockCalledWithPartial(mockService.create, [{ email: 'test@example.com' }]);
 * ```
 */
export declare const expectMockCalledWithPartial: (mock: jest.Mock, partialArgs: any[]) => void;
/**
 * 34. Creates snapshot of object with sensitive fields redacted.
 *
 * @param {any} data - Data to snapshot
 * @param {string[]} [redactFields] - Fields to redact
 * @returns {any} Redacted data for snapshot
 *
 * @example
 * ```typescript
 * expect(createSanitizedSnapshot(user, ['password', 'ssn'])).toMatchSnapshot();
 * ```
 */
export declare const createSanitizedSnapshot: (data: any, redactFields?: string[]) => any;
/**
 * 35. Creates inline snapshot for quick testing.
 *
 * @param {any} data - Data to snapshot
 * @param {SnapshotOptions} [options] - Snapshot options
 * @returns {void}
 *
 * @example
 * ```typescript
 * expectInlineSnapshot({ id: 1, name: 'Test' });
 * ```
 */
export declare const expectInlineSnapshot: (data: any, options?: SnapshotOptions) => void;
/**
 * 36. Validates snapshot exists and is up to date.
 *
 * @param {string} snapshotName - Snapshot name
 * @returns {boolean} True if snapshot exists
 *
 * @example
 * ```typescript
 * const exists = validateSnapshot('user-api-response');
 * ```
 */
export declare const validateSnapshot: (snapshotName: string) => boolean;
/**
 * 37. Cleans up test resources based on configuration.
 *
 * @param {TestCleanupConfig} config - Cleanup configuration
 * @param {TestContext} context - Test context
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * afterEach(async () => {
 *   await cleanupTestResources({ database: true, cache: true }, context);
 * });
 * ```
 */
export declare const cleanupTestResources: (config: TestCleanupConfig, context: TestContext) => Promise<void>;
/**
 * 38. Resets all Jest mocks to clean state.
 *
 * @returns {void}
 *
 * @example
 * ```typescript
 * afterEach(() => {
 *   resetAllMocks();
 * });
 * ```
 */
export declare const resetAllMocks: () => void;
/**
 * 39. Clears test timers and intervals.
 *
 * @returns {void}
 *
 * @example
 * ```typescript
 * afterEach(() => {
 *   clearTestTimers();
 * });
 * ```
 */
export declare const clearTestTimers: () => void;
/**
 * 40. Waits for async operation with timeout.
 *
 * @template T
 * @param {() => Promise<T>} fn - Async function
 * @param {AsyncTestOptions} [options] - Async test options
 * @returns {Promise<T>} Result of async operation
 *
 * @example
 * ```typescript
 * const result = await waitForAsync(() => service.getData(), { timeout: 5000 });
 * ```
 */
export declare const waitForAsync: <T>(fn: () => Promise<T>, options?: AsyncTestOptions) => Promise<T>;
/**
 * 41. Polls for condition to be true.
 *
 * @param {() => Promise<boolean>} condition - Condition to check
 * @param {number} [interval] - Poll interval in ms
 * @param {number} [timeout] - Timeout in ms
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await pollUntil(() => service.isReady(), 100, 5000);
 * ```
 */
export declare const pollUntil: (condition: () => Promise<boolean>, interval?: number, timeout?: number) => Promise<void>;
/**
 * 42. Retries async operation on failure.
 *
 * @template T
 * @param {() => Promise<T>} fn - Async function
 * @param {number} [maxRetries] - Maximum retry attempts
 * @returns {Promise<T>} Result of successful attempt
 *
 * @example
 * ```typescript
 * const result = await retryAsync(() => unstableApiCall(), 3);
 * ```
 */
export declare const retryAsync: <T>(fn: () => Promise<T>, maxRetries?: number) => Promise<T>;
/**
 * 43. Measures execution time of test function.
 *
 * @template T
 * @param {() => T | Promise<T>} fn - Function to measure
 * @returns {Promise<{ result: T; duration: number }>} Result and duration
 *
 * @example
 * ```typescript
 * const { result, duration } = await measureExecutionTime(() => service.heavyOperation());
 * expect(duration).toBeLessThan(1000);
 * ```
 */
export declare const measureExecutionTime: <T>(fn: () => T | Promise<T>) => Promise<{
    result: T;
    duration: number;
}>;
/**
 * 44. Creates performance benchmark for test.
 *
 * @param {() => Promise<void>} fn - Function to benchmark
 * @param {number} iterations - Number of iterations
 * @returns {Promise<{ avg: number; min: number; max: number }>} Performance stats
 *
 * @example
 * ```typescript
 * const stats = await benchmarkTest(() => service.query(), 100);
 * expect(stats.avg).toBeLessThan(50);
 * ```
 */
export declare const benchmarkTest: (fn: () => Promise<void>, iterations: number) => Promise<{
    avg: number;
    min: number;
    max: number;
}>;
/**
 * 45. Isolates test environment for parallel execution.
 *
 * @param {TestIsolationConfig} config - Isolation configuration
 * @returns {Promise<() => Promise<void>>} Cleanup function
 *
 * @example
 * ```typescript
 * const cleanup = await isolateTestEnvironment({
 *   database: true,
 *   environment: true
 * });
 * // Run tests
 * await cleanup();
 * ```
 */
export declare const isolateTestEnvironment: (config: TestIsolationConfig) => Promise<() => Promise<void>>;
declare const _default: {
    createTestModule: (config: TestModuleConfig) => Promise<TestingModuleBuilder>;
    createUnitTestModule: (target: Type<any>, dependencies?: any[]) => Promise<TestingModule>;
    createMockedModule: (target: Type<any>, dependencyNames?: string[]) => Promise<TestingModule>;
    createDatabaseTestModule: (config: TestModuleConfig, dbType?: string) => Promise<TestingModule>;
    createGraphQLTestModule: (resolver: Type<any>, providers?: any[]) => Promise<TestingModule>;
    createWebSocketTestModule: (gateway: Type<any>, providers?: any[]) => Promise<TestingModule>;
    createAutoMock: (options?: MockProviderOptions) => any;
    createMockRepository: <T>(mockData?: Partial<T>) => any;
    createMockService: (methods: string[], defaultReturns?: Record<string, any>) => any;
    createMockHttpService: (responses?: Record<string, any>) => any;
    createMockConfigService: (config: Record<string, any>) => any;
    createMockLogger: () => any;
    setupIntegrationTest: (config: IntegrationTestConfig) => Promise<TestContext>;
    teardownIntegrationTest: (context: TestContext) => Promise<void>;
    initializeTestDatabase: (config: any) => Promise<any>;
    resetTestDatabase: (database: any) => Promise<void>;
    initializeTestCache: (config: any) => Promise<any>;
    clearTestCache: (cache: any) => Promise<void>;
    setupE2ETest: (AppModule: any, options?: E2ETestOptions) => Promise<any>;
    createE2ERequest: (app: any, token?: string) => any;
    createAuthenticatedSession: (app: any, credentials: any) => Promise<{
        token: string;
        request: any;
    }>;
    validateE2EResponse: (response: any, schema: any) => boolean;
    waitForE2ECondition: (condition: () => Promise<boolean>, timeout?: number) => Promise<void>;
    generateTestUser: (options?: TestDataGeneratorOptions) => any;
    generateTestPatient: (options?: TestDataGeneratorOptions) => any;
    generateBulkTestData: <T>(generator: () => T, count: number) => T[];
    createTestDataFactory: <T>(template: Partial<T>) => ((overrides?: Partial<T>) => T);
    seedTestDatabase: (database: any, seedData: Record<string, any[]>) => Promise<void>;
    expectToMatchPartial: (actual: any, expected: any) => void;
    expectArrayContainsPartial: (array: any[], partial: any) => void;
    expectAsyncToThrow: (fn: () => Promise<any>, errorType: any) => Promise<void>;
    expectDateWithinRange: (actual: Date, expected: Date, deltaMs?: number) => void;
    expectMockCalledWithPartial: (mock: jest.Mock, partialArgs: any[]) => void;
    createSanitizedSnapshot: (data: any, redactFields?: string[]) => any;
    expectInlineSnapshot: (data: any, options?: SnapshotOptions) => void;
    validateSnapshot: (snapshotName: string) => boolean;
    cleanupTestResources: (config: TestCleanupConfig, context: TestContext) => Promise<void>;
    resetAllMocks: () => void;
    clearTestTimers: () => void;
    waitForAsync: <T>(fn: () => Promise<T>, options?: AsyncTestOptions) => Promise<T>;
    pollUntil: (condition: () => Promise<boolean>, interval?: number, timeout?: number) => Promise<void>;
    retryAsync: <T>(fn: () => Promise<T>, maxRetries?: number) => Promise<T>;
    measureExecutionTime: <T>(fn: () => T | Promise<T>) => Promise<{
        result: T;
        duration: number;
    }>;
    benchmarkTest: (fn: () => Promise<void>, iterations: number) => Promise<{
        avg: number;
        min: number;
        max: number;
    }>;
    isolateTestEnvironment: (config: TestIsolationConfig) => Promise<() => Promise<void>>;
};
export default _default;
//# sourceMappingURL=testing-kit.d.ts.map