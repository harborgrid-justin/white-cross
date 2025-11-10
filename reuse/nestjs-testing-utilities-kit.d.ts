/**
 * NESTJS TESTING UTILITIES KIT
 *
 * Comprehensive testing utilities for NestJS applications covering general testing patterns.
 * Provides 45 specialized helper functions covering:
 * - Generic test module builders
 * - Mock provider factories
 * - Service and controller mocking
 * - Repository pattern mocking (TypeORM, Prisma, etc.)
 * - Spy and stub generators
 * - E2E testing helpers
 * - Supertest request utilities
 * - Authentication and authorization testing
 * - HTTP response assertions
 * - Validation testing helpers
 * - File upload testing
 * - WebSocket testing utilities
 * - GraphQL testing helpers
 * - Cache and queue testing
 * - Configuration testing
 * - Middleware testing utilities
 * - Guard and interceptor testing
 * - Pipe testing helpers
 * - Exception filter testing
 * - Logging and monitoring test utilities
 * - Test cleanup and teardown
 * - Coverage reporting helpers
 * - Performance testing utilities
 *
 * @module NestJSTestingUtilitiesKit
 * @version 1.0.0
 * @requires @nestjs/testing ^11.1.8
 * @requires @nestjs/common ^11.1.8
 * @requires jest ^30.2.0
 * @requires supertest ^7.1.4
 * @requires @faker-js/faker ^9.4.0
 * @requires Node.js 18+
 * @requires TypeScript 5.x
 *
 * @security HIPAA compliant - all test data is synthetic and de-identified
 * @example
 * ```typescript
 * import {
 *   createTestModuleBuilder,
 *   mockRepository,
 *   createE2ETestApp
 * } from './nestjs-testing-utilities-kit';
 *
 * describe('UserService', () => {
 *   let service: UserService;
 *   let userRepo: MockRepository;
 *
 *   beforeEach(async () => {
 *     userRepo = mockRepository();
 *     const module = await createTestModuleBuilder()
 *       .addService(UserService)
 *       .addProvider({ provide: 'UserRepository', useValue: userRepo })
 *       .compile();
 *
 *     service = module.get<UserService>(UserService);
 *   });
 * });
 * ```
 */
import { TestingModule } from '@nestjs/testing';
import { INestApplication, Type, Provider, CanActivate, ExecutionContext, NestInterceptor, CallHandler, PipeTransform, ExceptionFilter } from '@nestjs/common';
import * as request from 'supertest';
/**
 * Generic mock repository interface
 */
export interface MockRepository<T = any> {
    find: jest.Mock;
    findOne: jest.Mock;
    findById: jest.Mock;
    findAndCount: jest.Mock;
    save: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
    remove: jest.Mock;
    count: jest.Mock;
    [key: string]: any;
}
/**
 * Mock service with common methods
 */
export interface MockService<T = any> {
    findAll: jest.Mock;
    findOne: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
    remove: jest.Mock;
    [key: string]: any;
}
/**
 * E2E test application wrapper
 */
export interface E2ETestApp {
    app: INestApplication;
    request: (method: string, path: string) => request.Test;
    authRequest: (method: string, path: string, token: string) => request.Test;
    close: () => Promise<void>;
}
/**
 * Test module configuration
 */
export interface TestModuleConfig {
    imports?: any[];
    providers?: Provider[];
    controllers?: Type<any>[];
    exports?: Array<Type<any> | string | symbol>;
}
/**
 * HTTP test request options
 */
export interface HttpTestOptions {
    method: string;
    path: string;
    body?: any;
    headers?: Record<string, string>;
    query?: Record<string, string>;
    token?: string;
    expectedStatus?: number;
}
/**
 * Mock guard options
 */
export interface MockGuardOptions {
    canActivate?: boolean;
    user?: any;
    roles?: string[];
}
/**
 * Test data generator options
 */
export interface TestDataOptions<T> {
    count?: number;
    overrides?: Partial<T>;
    seed?: number;
}
/**
 * Performance test result
 */
export interface PerformanceTestResult {
    averageTime: number;
    minTime: number;
    maxTime: number;
    totalTime: number;
    iterations: number;
    throughput: number;
}
/**
 * 1. Creates a fluent test module builder with chaining support
 *
 * @returns Fluent test module builder
 *
 * @example
 * ```typescript
 * const module = await createTestModuleBuilder()
 *   .addService(UserService)
 *   .addController(UserController)
 *   .addProvider(mockProvider)
 *   .compile();
 * ```
 */
export declare function createTestModuleBuilder(): {
    addImport: (moduleToImport: any) => any;
    addProvider: (provider: Provider) => any;
    addService: (service: Type<any>) => any;
    addController: (controller: Type<any>) => any;
    addMockProvider: (token: string | Type<any>, mockValue: any) => any;
    compile: () => Promise<TestingModule>;
    overrideProvider: (token: string | Type<any>, value: any) => any;
};
/**
 * 2. Creates a minimal test module for unit testing a single service
 *
 * @param service - Service class to test
 * @param dependencies - Service dependencies
 * @returns Testing module
 *
 * @example
 * ```typescript
 * const module = await createUnitTestModule(UserService, [
 *   { provide: 'UserRepository', useValue: mockRepo }
 * ]);
 * ```
 */
export declare function createUnitTestModule(service: Type<any>, dependencies?: Provider[]): Promise<TestingModule>;
/**
 * 3. Creates a test module with overridable providers
 *
 * @param config - Module configuration
 * @param overrides - Provider overrides
 * @returns Testing module
 *
 * @example
 * ```typescript
 * const module = await createOverridableModule(
 *   { providers: [UserService, EmailService] },
 *   { EmailService: mockEmailService }
 * );
 * ```
 */
export declare function createOverridableModule(config: TestModuleConfig, overrides?: Record<string, any>): Promise<TestingModule>;
/**
 * 4. Creates a generic mock repository with all common methods
 *
 * @template T - Entity type
 * @returns Mock repository
 *
 * @example
 * ```typescript
 * const userRepo = mockRepository<User>();
 * userRepo.findOne.mockResolvedValue(mockUser);
 * ```
 */
export declare function mockRepository<T = any>(): MockRepository<T>;
/**
 * 5. Creates a mock service with CRUD methods
 *
 * @template T - Entity type
 * @returns Mock service
 *
 * @example
 * ```typescript
 * const userService = mockService<User>();
 * userService.findAll.mockResolvedValue([mockUser]);
 * ```
 */
export declare function mockService<T = any>(): MockService<T>;
/**
 * 6. Creates a mock HTTP service for external API calls
 *
 * @returns Mock HTTP service
 *
 * @example
 * ```typescript
 * const httpService = mockHttpService();
 * httpService.get.mockResolvedValue({ data: mockData });
 * ```
 */
export declare function mockHttpService(): {
    get: any;
    post: any;
    put: any;
    patch: any;
    delete: any;
    request: any;
    axiosRef: {
        get: any;
        post: any;
        put: any;
        patch: any;
        delete: any;
    };
};
/**
 * 7. Creates a mock configuration service
 *
 * @param config - Configuration values
 * @returns Mock config service
 *
 * @example
 * ```typescript
 * const configService = mockConfigService({
 *   'database.host': 'localhost',
 *   'jwt.secret': 'test-secret'
 * });
 * ```
 */
export declare function mockConfigService(config?: Record<string, any>): {
    get: any;
    getOrThrow: any;
    set: any;
};
/**
 * 8. Creates a mock logger service
 *
 * @returns Mock logger
 *
 * @example
 * ```typescript
 * const logger = mockLogger();
 * service.doSomething();
 * expect(logger.log).toHaveBeenCalledWith('Something happened');
 * ```
 */
export declare function mockLogger(): {
    log: any;
    error: any;
    warn: any;
    debug: any;
    verbose: any;
    setContext: any;
};
/**
 * 9. Creates a mock cache manager
 *
 * @returns Mock cache manager
 *
 * @example
 * ```typescript
 * const cache = mockCacheManager();
 * cache.get.mockResolvedValue(cachedData);
 * ```
 */
export declare function mockCacheManager(): {
    get: any;
    set: any;
    del: any;
    reset: any;
    store: Map<string, any>;
};
/**
 * 10. Creates a mock queue service
 *
 * @returns Mock queue service
 *
 * @example
 * ```typescript
 * const queue = mockQueueService();
 * await queue.add('job-name', jobData);
 * expect(queue.add).toHaveBeenCalled();
 * ```
 */
export declare function mockQueueService(): {
    add: any;
    process: any;
    on: any;
    pause: any;
    resume: any;
    empty: any;
    getJobs: any;
    getJob: any;
};
/**
 * 11. Creates a comprehensive spy on all service methods
 *
 * @param service - Service instance
 * @returns Map of method spies
 *
 * @example
 * ```typescript
 * const spies = spyOnService(userService);
 * await userService.findAll();
 * expect(spies.get('findAll')).toHaveBeenCalled();
 * ```
 */
export declare function spyOnService(service: any): Map<string, jest.SpyInstance>;
/**
 * 12. Creates a spy on a specific method with return value
 *
 * @param target - Target object
 * @param method - Method name
 * @param returnValue - Return value or implementation
 * @returns Jest spy instance
 *
 * @example
 * ```typescript
 * const spy = spyOnMethod(userService, 'findOne', mockUser);
 * ```
 */
export declare function spyOnMethod<T = any>(target: any, method: string, returnValue?: T | ((...args: any[]) => T)): jest.SpyInstance;
/**
 * 13. Restores all spies in a spy map
 *
 * @param spies - Map of spies to restore
 *
 * @example
 * ```typescript
 * afterEach(() => {
 *   restoreAllSpies(spies);
 * });
 * ```
 */
export declare function restoreAllSpies(spies: Map<string, jest.SpyInstance>): void;
/**
 * 14. Creates a mock authentication guard
 *
 * @param options - Guard options
 * @returns Mock guard
 *
 * @example
 * ```typescript
 * const authGuard = mockAuthGuard({ canActivate: true, user: mockUser });
 * ```
 */
export declare function mockAuthGuard(options?: MockGuardOptions): jest.Mocked<CanActivate>;
/**
 * 15. Creates a mock roles guard
 *
 * @param allowedRoles - Roles that are allowed
 * @returns Mock roles guard
 *
 * @example
 * ```typescript
 * const rolesGuard = mockRolesGuard(['admin', 'moderator']);
 * ```
 */
export declare function mockRolesGuard(allowedRoles?: string[]): jest.Mocked<CanActivate>;
/**
 * 16. Creates a mock interceptor for testing
 *
 * @param transformer - Response transformer function
 * @returns Mock interceptor
 *
 * @example
 * ```typescript
 * const interceptor = mockInterceptor((data) => ({ data, timestamp: Date.now() }));
 * ```
 */
export declare function mockInterceptor(transformer?: (data: any) => any): jest.Mocked<NestInterceptor>;
/**
 * 17. Creates a mock validation pipe
 *
 * @param shouldValidate - Whether validation should pass
 * @returns Mock pipe
 *
 * @example
 * ```typescript
 * const pipe = mockValidationPipe(true);
 * ```
 */
export declare function mockValidationPipe(shouldValidate?: boolean): jest.Mocked<PipeTransform>;
/**
 * 18. Creates a mock exception filter
 *
 * @returns Mock exception filter
 *
 * @example
 * ```typescript
 * const filter = mockExceptionFilter();
 * ```
 */
export declare function mockExceptionFilter(): jest.Mocked<ExceptionFilter>;
/**
 * 19. Creates a fully configured E2E test application
 *
 * @param moduleFixture - Testing module
 * @param options - Application options
 * @returns E2E test app wrapper
 *
 * @example
 * ```typescript
 * const e2eApp = await createE2ETestApp(moduleFixture);
 * const response = await e2eApp.request('GET', '/users');
 * ```
 */
export declare function createE2ETestApp(moduleFixture: TestingModule, options?: {
    globalPipes?: any[];
    globalGuards?: any[];
}): Promise<E2ETestApp>;
/**
 * 20. Makes an HTTP test request with common options
 *
 * @param app - NestJS application
 * @param options - Request options
 * @returns Supertest response
 *
 * @example
 * ```typescript
 * const response = await makeHttpRequest(app, {
 *   method: 'POST',
 *   path: '/users',
 *   body: userData,
 *   expectedStatus: 201
 * });
 * ```
 */
export declare function makeHttpRequest(app: INestApplication, options: HttpTestOptions): Promise<request.Response>;
/**
 * 21. Creates a test authentication token
 *
 * @param payload - Token payload
 * @param secret - JWT secret
 * @returns JWT token
 *
 * @example
 * ```typescript
 * const token = generateTestToken({ userId: '123', role: 'admin' });
 * ```
 */
export declare function generateTestToken(payload?: any, secret?: string): string;
/**
 * 22. Simulates file upload in tests
 *
 * @param app - NestJS application
 * @param path - Upload endpoint path
 * @param fieldName - Form field name
 * @param fileName - File name
 * @param fileContent - File content
 * @returns Supertest response
 *
 * @example
 * ```typescript
 * const response = await uploadTestFile(
 *   app,
 *   '/upload',
 *   'file',
 *   'test.txt',
 *   'file content'
 * );
 * ```
 */
export declare function uploadTestFile(app: INestApplication, path: string, fieldName: string, fileName: string, fileContent: string | Buffer): Promise<request.Response>;
/**
 * 23. Asserts HTTP response structure
 *
 * @param response - Supertest response
 * @param expectedStructure - Expected response structure
 *
 * @example
 * ```typescript
 * assertResponseStructure(response, {
 *   data: expect.any(Object),
 *   metadata: expect.any(Object)
 * });
 * ```
 */
export declare function assertResponseStructure(response: request.Response, expectedStructure: any): void;
/**
 * 24. Asserts paginated response format
 *
 * @param response - Supertest response
 *
 * @example
 * ```typescript
 * assertPaginatedResponse(response);
 * ```
 */
export declare function assertPaginatedResponse(response: request.Response): void;
/**
 * 25. Asserts error response format
 *
 * @param response - Supertest response
 * @param expectedStatus - Expected HTTP status
 * @param errorMessage - Expected error message (optional)
 *
 * @example
 * ```typescript
 * assertErrorResponse(response, 400, 'Validation failed');
 * ```
 */
export declare function assertErrorResponse(response: request.Response, expectedStatus: number, errorMessage?: string): void;
/**
 * 26. Asserts service method was called with specific arguments
 *
 * @param mockService - Mock service
 * @param methodName - Method name
 * @param expectedArgs - Expected arguments
 *
 * @example
 * ```typescript
 * assertServiceCalled(mockUserService, 'create', [userData]);
 * ```
 */
export declare function assertServiceCalled(mockService: any, methodName: string, expectedArgs?: any[]): void;
/**
 * 27. Asserts validation errors in response
 *
 * @param response - Supertest response
 * @param fields - Expected fields with errors
 *
 * @example
 * ```typescript
 * assertValidationErrors(response, ['email', 'password']);
 * ```
 */
export declare function assertValidationErrors(response: request.Response, fields: string[]): void;
/**
 * 28. Generates array of test entities
 *
 * @param factory - Entity factory function
 * @param options - Generation options
 * @returns Array of test entities
 *
 * @example
 * ```typescript
 * const users = generateTestEntities(() => ({
 *   name: faker.person.fullName(),
 *   email: faker.internet.email()
 * }), { count: 10 });
 * ```
 */
export declare function generateTestEntities<T>(factory: (index: number) => T, options?: TestDataOptions<T>): T[];
/**
 * 29. Generates test user data
 *
 * @param overrides - Property overrides
 * @returns Test user object
 *
 * @example
 * ```typescript
 * const user = generateTestUser({ role: 'admin' });
 * ```
 */
export declare function generateTestUser(overrides?: any): any;
/**
 * 30. Generates test address data
 *
 * @param overrides - Property overrides
 * @returns Test address object
 *
 * @example
 * ```typescript
 * const address = generateTestAddress({ country: 'USA' });
 * ```
 */
export declare function generateTestAddress(overrides?: any): any;
/**
 * 31. Generates test contact information
 *
 * @param overrides - Property overrides
 * @returns Test contact object
 *
 * @example
 * ```typescript
 * const contact = generateTestContact();
 * ```
 */
export declare function generateTestContact(overrides?: any): any;
/**
 * 32. Tests DTO validation with valid data
 *
 * @param DtoClass - DTO class
 * @param validData - Valid data to test
 * @returns Validation result
 *
 * @example
 * ```typescript
 * await testDtoValidation(CreateUserDto, validUserData);
 * ```
 */
export declare function testDtoValidation(DtoClass: any, validData: any): Promise<boolean>;
/**
 * 33. Tests DTO validation with invalid data
 *
 * @param DtoClass - DTO class
 * @param invalidData - Invalid data to test
 * @returns Expected validation errors
 *
 * @example
 * ```typescript
 * const errors = await testDtoValidationFailure(CreateUserDto, {});
 * expect(errors.length).toBeGreaterThan(0);
 * ```
 */
export declare function testDtoValidationFailure(DtoClass: any, invalidData: any): Promise<any[]>;
/**
 * 34. Creates a cleanup helper for test teardown
 *
 * @returns Cleanup helper
 *
 * @example
 * ```typescript
 * const cleanup = createCleanupHelper();
 * cleanup.add(() => userRepo.clear());
 * await cleanup.execute();
 * ```
 */
export declare function createCleanupHelper(): {
    add: (fn: () => Promise<void>) => void;
    execute: () => Promise<void>;
};
/**
 * 35. Waits for condition to be true in tests
 *
 * @param condition - Condition function
 * @param timeout - Maximum wait time in ms
 * @param interval - Check interval in ms
 * @returns True if condition met
 *
 * @example
 * ```typescript
 * await waitForCondition(() => mockService.findAll.mock.calls.length > 0, 5000);
 * ```
 */
export declare function waitForCondition(condition: () => boolean | Promise<boolean>, timeout?: number, interval?: number): Promise<boolean>;
/**
 * 36. Delays execution in tests
 *
 * @param ms - Milliseconds to delay
 *
 * @example
 * ```typescript
 * await delay(1000); // Wait 1 second
 * ```
 */
export declare function delay(ms: number): Promise<void>;
/**
 * 37. Measures function execution performance
 *
 * @param fn - Function to measure
 * @param iterations - Number of iterations
 * @returns Performance metrics
 *
 * @example
 * ```typescript
 * const perf = await measurePerformance(() => service.findAll(), 100);
 * expect(perf.averageTime).toBeLessThan(50);
 * ```
 */
export declare function measurePerformance(fn: () => Promise<any> | any, iterations?: number): Promise<PerformanceTestResult>;
/**
 * 38. Tests endpoint response time
 *
 * @param app - NestJS application
 * @param method - HTTP method
 * @param path - Endpoint path
 * @param maxTime - Maximum acceptable time in ms
 * @returns Response time
 *
 * @example
 * ```typescript
 * const time = await testEndpointResponseTime(app, 'GET', '/users', 100);
 * expect(time).toBeLessThan(100);
 * ```
 */
export declare function testEndpointResponseTime(app: INestApplication, method: string, path: string, maxTime?: number): Promise<number>;
/**
 * 39. Creates a mock execution context for testing guards/interceptors
 *
 * @param request - Mock request object
 * @param response - Mock response object
 * @returns Mock execution context
 *
 * @example
 * ```typescript
 * const context = createMockExecutionContext({
 *   user: mockUser,
 *   headers: { authorization: 'Bearer token' }
 * });
 * ```
 */
export declare function createMockExecutionContext(request?: any, response?: any): ExecutionContext;
/**
 * 40. Creates a mock call handler for interceptor testing
 *
 * @param returnValue - Value to return from handle()
 * @returns Mock call handler
 *
 * @example
 * ```typescript
 * const handler = createMockCallHandler({ data: 'test' });
 * const result = await interceptor.intercept(context, handler);
 * ```
 */
export declare function createMockCallHandler(returnValue: any): CallHandler;
/**
 * 41. Creates a mock WebSocket client for testing
 *
 * @returns Mock WebSocket client
 *
 * @example
 * ```typescript
 * const ws = mockWebSocketClient();
 * ws.emit('message', data);
 * expect(ws.on).toHaveBeenCalledWith('message', expect.any(Function));
 * ```
 */
export declare function mockWebSocketClient(): {
    emit: any;
    on: any;
    off: any;
    send: any;
    close: any;
    disconnect: any;
    connected: boolean;
};
/**
 * 42. Creates a mock GraphQL context
 *
 * @param req - Request object
 * @returns GraphQL context
 *
 * @example
 * ```typescript
 * const context = createGraphQLContext({ user: mockUser });
 * const result = await resolver.query(args, context);
 * ```
 */
export declare function createGraphQLContext(req?: any): {
    req: any;
};
/**
 * 43. Generates test coverage report summary
 *
 * @param coverageData - Jest coverage data
 * @returns Coverage summary
 *
 * @example
 * ```typescript
 * const summary = generateCoverageSummary(global.__coverage__);
 * expect(summary.lines.percentage).toBeGreaterThan(80);
 * ```
 */
export declare function generateCoverageSummary(coverageData: any): {
    lines: {
        percentage: number;
        covered: number;
        total: number;
    };
    statements: {
        percentage: number;
        covered: number;
        total: number;
    };
    functions: {
        percentage: number;
        covered: number;
        total: number;
    };
    branches: {
        percentage: number;
        covered: number;
        total: number;
    };
};
/**
 * 44. Asserts minimum code coverage thresholds
 *
 * @param coverageData - Coverage data
 * @param thresholds - Minimum thresholds
 *
 * @example
 * ```typescript
 * assertCoverageThresholds(coverage, {
 *   lines: 80,
 *   functions: 90,
 *   branches: 75
 * });
 * ```
 */
export declare function assertCoverageThresholds(coverageData: any, thresholds: {
    lines?: number;
    functions?: number;
    branches?: number;
    statements?: number;
}): void;
/**
 * 45. Creates a test environment configuration
 *
 * @param overrides - Configuration overrides
 * @returns Test environment config
 *
 * @example
 * ```typescript
 * const config = createTestEnvironment({
 *   NODE_ENV: 'test',
 *   DATABASE_URL: 'sqlite::memory:'
 * });
 * ```
 */
export declare function createTestEnvironment(overrides?: Record<string, string>): {
    apply: () => void;
    restore: () => void;
    get: (key: string) => any;
};
declare const _default: {
    createTestModuleBuilder: typeof createTestModuleBuilder;
    createUnitTestModule: typeof createUnitTestModule;
    createOverridableModule: typeof createOverridableModule;
    mockRepository: typeof mockRepository;
    mockService: typeof mockService;
    mockHttpService: typeof mockHttpService;
    mockConfigService: typeof mockConfigService;
    mockLogger: typeof mockLogger;
    mockCacheManager: typeof mockCacheManager;
    mockQueueService: typeof mockQueueService;
    spyOnService: typeof spyOnService;
    spyOnMethod: typeof spyOnMethod;
    restoreAllSpies: typeof restoreAllSpies;
    mockAuthGuard: typeof mockAuthGuard;
    mockRolesGuard: typeof mockRolesGuard;
    mockInterceptor: typeof mockInterceptor;
    mockValidationPipe: typeof mockValidationPipe;
    mockExceptionFilter: typeof mockExceptionFilter;
    createE2ETestApp: typeof createE2ETestApp;
    makeHttpRequest: typeof makeHttpRequest;
    generateTestToken: typeof generateTestToken;
    uploadTestFile: typeof uploadTestFile;
    assertResponseStructure: typeof assertResponseStructure;
    assertPaginatedResponse: typeof assertPaginatedResponse;
    assertErrorResponse: typeof assertErrorResponse;
    assertServiceCalled: typeof assertServiceCalled;
    assertValidationErrors: typeof assertValidationErrors;
    generateTestEntities: typeof generateTestEntities;
    generateTestUser: typeof generateTestUser;
    generateTestAddress: typeof generateTestAddress;
    generateTestContact: typeof generateTestContact;
    testDtoValidation: typeof testDtoValidation;
    testDtoValidationFailure: typeof testDtoValidationFailure;
    createCleanupHelper: typeof createCleanupHelper;
    waitForCondition: typeof waitForCondition;
    delay: typeof delay;
    measurePerformance: typeof measurePerformance;
    testEndpointResponseTime: typeof testEndpointResponseTime;
    createMockExecutionContext: typeof createMockExecutionContext;
    createMockCallHandler: typeof createMockCallHandler;
    mockWebSocketClient: typeof mockWebSocketClient;
    createGraphQLContext: typeof createGraphQLContext;
    generateCoverageSummary: typeof generateCoverageSummary;
    assertCoverageThresholds: typeof assertCoverageThresholds;
    createTestEnvironment: typeof createTestEnvironment;
};
export default _default;
//# sourceMappingURL=nestjs-testing-utilities-kit.d.ts.map