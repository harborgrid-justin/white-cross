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

import { Test, TestingModule } from '@nestjs/testing';
import {
  INestApplication,
  Type,
  Provider,
  ExecutionContext,
  CanActivate,
  NestInterceptor,
  CallHandler,
  PipeTransform,
  ArgumentMetadata,
} from '@nestjs/common';
import { Repository, FindOptionsWhere } from 'typeorm';
import * as request from 'supertest';
import { Observable, of } from 'rxjs';
import { faker } from '@faker-js/faker';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

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
  mockProviders?: Array<{ token: string | symbol | Type<any>; value?: any }>;
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

// ============================================================================
// TEST MODULE BUILDERS
// ============================================================================

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
export async function createTestModule(
  config: TestModuleConfig,
): Promise<TestingModule> {
  const providers = [...(config.providers || [])];

  // Add mock providers
  if (config.mockProviders) {
    for (const mockProvider of config.mockProviders) {
      providers.push({
        provide: mockProvider.token,
        useValue: mockProvider.value || createMockRepository(),
      });
    }
  }

  const moduleBuilder = Test.createTestingModule({
    providers,
    controllers: config.controllers || [],
    imports: config.imports || [],
  });

  if (!config.enableLogger) {
    moduleBuilder.setLogger(false as any);
  }

  return moduleBuilder.compile();
}

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
export async function createTestModuleWithCommonMocks(
  providers: Type<any>[],
  repositories: Type<any>[] = [],
): Promise<TestingModule> {
  const mockProviders = repositories.map((repo) => ({
    token: `${repo.name}Repository`,
    value: createMockRepository(),
  }));

  return createTestModule({
    providers,
    mockProviders,
    enableLogger: false,
  });
}

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
export async function createMinimalTestModule(
  serviceClass: Type<any>,
  dependencies: Provider[] = [],
): Promise<TestingModule> {
  return Test.createTestingModule({
    providers: [serviceClass, ...dependencies],
  })
    .setLogger(false as any)
    .compile();
}

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
export async function createOverridableTestModule(
  config: TestModuleConfig,
  overrides: Record<string, any> = {},
): Promise<TestingModule> {
  const moduleBuilder = await Test.createTestingModule({
    providers: config.providers || [],
    controllers: config.controllers || [],
    imports: config.imports || [],
  });

  // Apply overrides
  Object.entries(overrides).forEach(([token, value]) => {
    moduleBuilder.overrideProvider(token).useValue(value);
  });

  return moduleBuilder.compile();
}

// ============================================================================
// MOCK PROVIDER FACTORIES
// ============================================================================

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
export function createMockRepository<T = any>(): MockRepository<T> {
  return {
    find: jest.fn(),
    findOne: jest.fn(),
    findAndCount: jest.fn(),
    findByPk: jest.fn(),
    findAndCountAll: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    destroy: jest.fn(),
    remove: jest.fn(),
    count: jest.fn(),
    restore: jest.fn(),
    increment: jest.fn(),
    decrement: jest.fn(),
  };
}

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
export function createMockService<T = any>(serviceClass: Type<T>): jest.Mocked<T> {
  const mock = {} as jest.Mocked<T>;
  const prototype = serviceClass.prototype;

  Object.getOwnPropertyNames(prototype).forEach((method) => {
    if (method !== 'constructor' && typeof prototype[method] === 'function') {
      mock[method as keyof T] = jest.fn() as any;
    }
  });

  return mock;
}

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
export function createMockConfigService(config: Record<string, any> = {}) {
  return {
    get: jest.fn((key: string) => config[key]),
    getOrThrow: jest.fn((key: string) => {
      if (!(key in config)) throw new Error(`Config key ${key} not found`);
      return config[key];
    }),
  };
}

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
export function createMockLogger() {
  return {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    verbose: jest.fn(),
  };
}

// ============================================================================
// SPY UTILITIES
// ============================================================================

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
export function createServiceSpy<T>(
  service: T,
  methodName: keyof T,
): jest.SpyInstance {
  return jest.spyOn(service, methodName as any);
}

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
export function createMultipleSpies<T>(
  service: T,
  methods: Partial<Record<keyof T, any>>,
): Map<keyof T, jest.SpyInstance> {
  const spies = new Map<keyof T, jest.SpyInstance>();

  Object.entries(methods).forEach(([method, returnValue]) => {
    const spy = jest.spyOn(service, method as keyof T);
    if (returnValue instanceof Promise || typeof returnValue?.then === 'function') {
      spy.mockResolvedValue(returnValue);
    } else {
      spy.mockReturnValue(returnValue);
    }
    spies.set(method as keyof T, spy);
  });

  return spies;
}

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
export function restoreAllSpies(
  spies: jest.SpyInstance[] | Map<any, jest.SpyInstance>,
): void {
  if (Array.isArray(spies)) {
    spies.forEach((spy) => spy.mockRestore());
  } else {
    spies.forEach((spy) => spy.mockRestore());
  }
}

// ============================================================================
// REQUEST MOCKING HELPERS
// ============================================================================

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
export function createMockRequest(overrides: Partial<any> = {}): any {
  return {
    body: {},
    params: {},
    query: {},
    headers: {},
    user: null,
    session: {},
    cookies: {},
    ip: '127.0.0.1',
    method: 'GET',
    url: '/',
    path: '/',
    ...overrides,
  };
}

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
export function createMockResponse(): any {
  const res: any = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
    sendStatus: jest.fn().mockReturnThis(),
    redirect: jest.fn().mockReturnThis(),
    render: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    cookie: jest.fn().mockReturnThis(),
    clearCookie: jest.fn().mockReturnThis(),
  };
  return res;
}

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
export function createMockExecutionContext(
  request: any = {},
  handler: any = {},
): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => request,
      getResponse: () => createMockResponse(),
      getNext: () => jest.fn(),
    }),
    getClass: () => handler.class || Object,
    getHandler: () => handler.handler || (() => {}),
    getArgs: () => [],
    getArgByIndex: () => null,
    switchToRpc: () => ({} as any),
    switchToWs: () => ({} as any),
    getType: () => 'http',
  } as ExecutionContext;
}

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
export function createAuthenticatedRequest(
  user: MockAuthUser,
  overrides: Partial<any> = {},
): any {
  return createMockRequest({
    user,
    headers: {
      authorization: `Bearer mock-jwt-token`,
      ...overrides.headers,
    },
    ...overrides,
  });
}

// ============================================================================
// RESPONSE ASSERTION UTILITIES
// ============================================================================

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
export function assertResponse(
  response: request.Response,
  expectedStatus: number,
  expectedShape?: any,
): void {
  expect(response.status).toBe(expectedStatus);
  if (expectedShape) {
    expect(response.body).toMatchObject(expectedShape);
  }
}

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
export function assertSuccessResponse(
  response: request.Response,
  dataValidator?: (data: any) => void,
): void {
  expect(response.status).toBeGreaterThanOrEqual(200);
  expect(response.status).toBeLessThan(300);
  if (dataValidator) {
    dataValidator(response.body);
  }
}

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
export function assertErrorResponse(
  response: request.Response,
  expectedStatus: number,
  expectedMessage?: string,
): void {
  expect(response.status).toBe(expectedStatus);
  expect(response.body).toHaveProperty('message');
  if (expectedMessage) {
    expect(response.body.message).toContain(expectedMessage);
  }
}

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
export function assertPaginationResponse(
  response: request.Response,
  expectedTotal?: number,
): void {
  expect(response.body).toHaveProperty('items');
  expect(response.body).toHaveProperty('total');
  expect(response.body).toHaveProperty('page');
  expect(response.body).toHaveProperty('limit');
  expect(Array.isArray(response.body.items)).toBe(true);
  if (expectedTotal !== undefined) {
    expect(response.body.total).toBe(expectedTotal);
  }
}

// ============================================================================
// DATABASE TESTING HELPERS
// ============================================================================

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
export function createInMemoryDatabase() {
  return {
    type: 'sqlite' as const,
    database: ':memory:',
    synchronize: true,
    logging: false,
    dropSchema: true,
  };
}

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
export async function clearRepositories(
  repositories: Repository<any>[],
): Promise<void> {
  await Promise.all(repositories.map((repo) => repo.clear()));
}

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
export async function seedDatabase<T>(
  repository: Repository<T>,
  data: Partial<T>[],
): Promise<T[]> {
  const entities = data.map((item) => repository.create(item));
  return repository.save(entities as any);
}

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
export async function withTransaction<T>(
  callback: () => Promise<T>,
  repositories: Repository<any>[],
): Promise<T> {
  try {
    const result = await callback();
    return result;
  } finally {
    await clearRepositories(repositories);
  }
}

// ============================================================================
// E2E TEST UTILITIES
// ============================================================================

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
export async function setupE2ETest(
  options: E2ETestOptions,
): Promise<INestApplication> {
  const moduleFixture = await Test.createTestingModule({
    imports: options.imports,
  }).compile();

  const app = moduleFixture.createNestApplication();

  if (options.enableValidation) {
    const { ValidationPipe } = await import('@nestjs/common');
    app.useGlobalPipes(new ValidationPipe());
  }

  await app.init();
  return app;
}

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
export function createAuthenticatedE2ERequest(
  app: INestApplication,
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  path: string,
  token: string,
): request.Test {
  return request(app.getHttpServer())
    [method.toLowerCase() as 'get'](path)
    .set('Authorization', `Bearer ${token}`);
}

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
export async function performE2ELogin(
  app: INestApplication,
  credentials: { email: string; password: string },
): Promise<string> {
  const response = await request(app.getHttpServer())
    .post('/auth/login')
    .send(credentials)
    .expect(200);

  return response.body.accessToken || response.body.token;
}

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
export async function cleanupE2ETest(
  app: INestApplication,
  database?: any,
): Promise<void> {
  if (database?.destroy) {
    await database.destroy();
  }
  if (app) {
    await app.close();
  }
}

// ============================================================================
// UNIT TEST HELPERS
// ============================================================================

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
export function createTestSuite<T>(
  suiteName: string,
  tests: (getService: () => T) => void,
): void {
  describe(suiteName, () => {
    let service: T;

    const getService = () => service;

    beforeEach(() => {
      jest.clearAllMocks();
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    tests(getService);
  });
}

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
export function createParameterizedTest<T extends any[]>(
  testName: string,
  cases: T[],
  testFn: (...args: T) => void | Promise<void>,
): void {
  cases.forEach((testCase) => {
    it(testName.replace('%s', String(testCase[0])), () => testFn(...testCase));
  });
}

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
export function waitForAsync(ms: number = 0): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ============================================================================
// INTEGRATION TEST UTILITIES
// ============================================================================

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
export async function createIntegrationTestModule(
  imports: any[],
  entities: any[] = [],
): Promise<TestingModule> {
  return Test.createTestingModule({
    imports: [
      ...imports,
      {
        ...createInMemoryDatabase(),
        entities,
      },
    ],
  }).compile();
}

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
export async function testModuleIntegration(
  moduleClass: Type<any>,
  dependencies: Type<any>[],
): Promise<TestingModule> {
  return Test.createTestingModule({
    imports: [moduleClass, ...dependencies],
  }).compile();
}

// ============================================================================
// TEST DATA FACTORIES
// ============================================================================

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
export function createEntityFactory<T>(
  defaults: Partial<T> | (() => Partial<T>),
): (overrides?: Partial<T>) => T {
  return (overrides = {}) => {
    const baseDefaults =
      typeof defaults === 'function' ? defaults() : defaults;
    return { ...baseDefaults, ...overrides } as T;
  };
}

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
export function generateTestUser(overrides: any = {}) {
  return {
    id: faker.string.uuid(),
    email: faker.internet.email(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    role: 'user',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

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
export function generateMultiple<T>(
  count: number,
  factory: (overrides?: any) => T,
  overrides: any = {},
): T[] {
  return Array.from({ length: count }, (_, i) =>
    factory({ ...overrides, index: i }),
  );
}

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
export function generateTestHealthRecord(overrides: any = {}) {
  return {
    id: faker.string.uuid(),
    patientId: `TEST-${faker.string.alphanumeric(8)}`,
    diagnosis: 'Test Diagnosis - Not Real Data',
    treatment: 'Test Treatment Plan',
    notes: 'Generated test data - HIPAA compliant',
    date: faker.date.recent(),
    provider: `Dr. ${faker.person.lastName()}`,
    ...overrides,
  };
}

// ============================================================================
// FIXTURE MANAGEMENT
// ============================================================================

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
export function loadFixtures<T = any>(
  fixtures: Record<string, TestFixture<T>>,
): Map<string, T> {
  const fixtureMap = new Map<string, T>();

  Object.entries(fixtures).forEach(([key, fixture]) => {
    fixtureMap.set(key, fixture.data);
  });

  return fixtureMap;
}

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
export async function applyFixturesToDatabase(
  fixtures: Record<string, any[]>,
  repositories: Record<string, Repository<any>>,
): Promise<void> {
  for (const [name, data] of Object.entries(fixtures)) {
    if (repositories[name]) {
      await seedDatabase(repositories[name], data);
    }
  }
}

// ============================================================================
// TEST CLEANUP UTILITIES
// ============================================================================

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
export function resetAllMocks(): void {
  jest.clearAllMocks();
  jest.resetAllMocks();
  jest.restoreAllMocks();
}

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
export async function cleanupTestResources(resources: {
  repositories?: Repository<any>[];
  cache?: any;
  files?: string[];
}): Promise<void> {
  if (resources.repositories) {
    await clearRepositories(resources.repositories);
  }

  if (resources.cache?.reset) {
    await resources.cache.reset();
  }

  if (resources.files) {
    const fs = await import('fs/promises');
    await Promise.all(
      resources.files.map((file) =>
        fs.unlink(file).catch(() => {
          /* ignore */
        }),
      ),
    );
  }
}

// ============================================================================
// MOCK GUARD/INTERCEPTOR/PIPE FACTORIES
// ============================================================================

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
export function createMockGuard(shouldAllow: boolean = true): CanActivate {
  return {
    canActivate: jest.fn().mockReturnValue(shouldAllow),
  };
}

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
export function createMockInterceptor(
  transform?: (data: any) => any,
): NestInterceptor {
  return {
    intercept: jest
      .fn()
      .mockImplementation((context: ExecutionContext, next: CallHandler) => {
        if (transform) {
          return next.handle().pipe((source: Observable<any>) =>
            source.pipe(
              /* map transform here */
            ),
          );
        }
        return next.handle();
      }),
  };
}

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
export function createMockPipe(
  transformFn?: (value: any, metadata: ArgumentMetadata) => any,
): PipeTransform {
  return {
    transform: jest.fn().mockImplementation(transformFn || ((val) => val)),
  };
}

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
export function createMockJwtStrategy(user: any) {
  return {
    validate: jest.fn().mockResolvedValue(user),
  };
}

// ============================================================================
// WEBSOCKET TESTING HELPERS
// ============================================================================

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
export function createMockWebSocketClient(events: any = {}) {
  return {
    emit: jest.fn(),
    on: jest.fn((event, callback) => {
      if (events[event]) events[event] = callback;
    }),
    disconnect: jest.fn(),
    connect: jest.fn(),
    id: faker.string.uuid(),
    ...events,
  };
}

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
export async function emitWebSocketEvent(
  gateway: any,
  event: string,
  data: any,
): Promise<void> {
  const handler = gateway[`handle${event.charAt(0).toUpperCase() + event.slice(1)}`];
  if (handler) {
    await handler.call(gateway, data);
  }
}

// ============================================================================
// GRAPHQL TESTING UTILITIES
// ============================================================================

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
export function createGraphQLTestClient(app: INestApplication) {
  return {
    query: (query: string, variables?: any) =>
      request(app.getHttpServer())
        .post('/graphql')
        .send({ query, variables }),
    mutate: (mutation: string, variables?: any) =>
      request(app.getHttpServer())
        .post('/graphql')
        .send({ query: mutation, variables }),
  };
}

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
export function assertGraphQLResponse(response: any, expectations: any): void {
  expect(response.body).toHaveProperty('data');
  if (expectations.data) {
    expect(response.body.data).toMatchObject(expectations.data);
  }
  if (expectations.errors === false) {
    expect(response.body.errors).toBeUndefined();
  }
}

// ============================================================================
// PERFORMANCE TESTING HELPERS
// ============================================================================

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
export async function measurePerformance(
  operation: () => Promise<any>,
  iterations: number = 1,
): Promise<{
  averageTime: number;
  totalTime: number;
  minTime: number;
  maxTime: number;
}> {
  const times: number[] = [];

  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    await operation();
    const end = performance.now();
    times.push(end - start);
  }

  return {
    averageTime: times.reduce((a, b) => a + b) / times.length,
    totalTime: times.reduce((a, b) => a + b),
    minTime: Math.min(...times),
    maxTime: Math.max(...times),
  };
}

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
export async function checkMemoryUsage(
  operation: () => Promise<any>,
): Promise<{
  heapBefore: number;
  heapAfter: number;
  heapIncrease: number;
}> {
  global.gc && global.gc();
  const heapBefore = process.memoryUsage().heapUsed;

  await operation();

  global.gc && global.gc();
  const heapAfter = process.memoryUsage().heapUsed;

  return {
    heapBefore,
    heapAfter,
    heapIncrease: heapAfter - heapBefore,
  };
}

// ============================================================================
// SNAPSHOT TESTING UTILITIES
// ============================================================================

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
export function createSanitizedSnapshot(data: any, keysToRemove: string[] = []) {
  const defaultKeysToRemove = [
    'id',
    'createdAt',
    'updatedAt',
    'timestamp',
    ...keysToRemove,
  ];

  const sanitize = (obj: any): any => {
    if (Array.isArray(obj)) {
      return obj.map(sanitize);
    }
    if (obj && typeof obj === 'object') {
      const sanitized: any = {};
      Object.entries(obj).forEach(([key, value]) => {
        if (!defaultKeysToRemove.includes(key)) {
          sanitized[key] = sanitize(value);
        }
      });
      return sanitized;
    }
    return obj;
  };

  return sanitize(data);
}

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
export function assertStructureMatch(actual: any, expected: any): void {
  expect(actual).toMatchObject(expected);
}

// ============================================================================
// TEST COVERAGE HELPERS
// ============================================================================

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
export function ensureFullCoverage(
  serviceClass: Type<any>,
  testedMethods: string[],
): string[] {
  const allMethods = Object.getOwnPropertyNames(serviceClass.prototype).filter(
    (method) => method !== 'constructor' && typeof serviceClass.prototype[method] === 'function',
  );

  return allMethods.filter((method) => !testedMethods.includes(method));
}

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
export function generateCoverageSummary(coverageData: any): {
  total: number;
  covered: number;
  percentage: number;
} {
  if (!coverageData) {
    return { total: 0, covered: 0, percentage: 0 };
  }

  let total = 0;
  let covered = 0;

  Object.values(coverageData).forEach((file: any) => {
    if (file.s) {
      total += Object.keys(file.s).length;
      covered += Object.values(file.s).filter((count: any) => count > 0).length;
    }
  });

  return {
    total,
    covered,
    percentage: total > 0 ? (covered / total) * 100 : 0,
  };
}

// ============================================================================
// CI/CD TEST UTILITIES
// ============================================================================

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
export function isRunningInCI(): boolean {
  return !!(
    process.env.CI ||
    process.env.CONTINUOUS_INTEGRATION ||
    process.env.GITHUB_ACTIONS ||
    process.env.GITLAB_CI
  );
}

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
export function skipInCI(testName: string, testFn: () => void | Promise<void>): void {
  if (isRunningInCI()) {
    it.skip(testName, testFn);
  } else {
    it(testName, testFn);
  }
}

// ============================================================================
// TEST REPORTING HELPERS
// ============================================================================

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
export function logTestExecution(testName: string, result: 'passed' | 'failed'): void {
  if (process.env.VERBOSE_TESTS) {
    console.log(`[${result.toUpperCase()}] ${testName}`);
  }
}

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
export function createTestReport(results: {
  total: number;
  passed: number;
  failed: number;
  duration: number;
}): string {
  return `
Test Execution Summary
======================
Total Tests: ${results.total}
Passed: ${results.passed} (${((results.passed / results.total) * 100).toFixed(1)}%)
Failed: ${results.failed} (${((results.failed / results.total) * 100).toFixed(1)}%)
Duration: ${(results.duration / 1000).toFixed(2)}s
  `.trim();
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Test Module Builders
  createTestModule,
  createTestModuleWithCommonMocks,
  createMinimalTestModule,
  createOverridableTestModule,

  // Mock Provider Factories
  createMockRepository,
  createMockService,
  createMockConfigService,
  createMockLogger,

  // Spy Utilities
  createServiceSpy,
  createMultipleSpies,
  restoreAllSpies,

  // Request Mocking Helpers
  createMockRequest,
  createMockResponse,
  createMockExecutionContext,
  createAuthenticatedRequest,

  // Response Assertion Utilities
  assertResponse,
  assertSuccessResponse,
  assertErrorResponse,
  assertPaginationResponse,

  // Database Testing Helpers
  createInMemoryDatabase,
  clearRepositories,
  seedDatabase,
  withTransaction,

  // E2E Test Utilities
  setupE2ETest,
  createAuthenticatedE2ERequest,
  performE2ELogin,
  cleanupE2ETest,

  // Unit Test Helpers
  createTestSuite,
  createParameterizedTest,
  waitForAsync,

  // Integration Test Utilities
  createIntegrationTestModule,
  testModuleIntegration,

  // Test Data Factories
  createEntityFactory,
  generateTestUser,
  generateMultiple,
  generateTestHealthRecord,

  // Fixture Management
  loadFixtures,
  applyFixturesToDatabase,

  // Test Cleanup Utilities
  resetAllMocks,
  cleanupTestResources,

  // Mock Guard/Interceptor/Pipe Factories
  createMockGuard,
  createMockInterceptor,
  createMockPipe,
  createMockJwtStrategy,

  // WebSocket Testing Helpers
  createMockWebSocketClient,
  emitWebSocketEvent,

  // GraphQL Testing Utilities
  createGraphQLTestClient,
  assertGraphQLResponse,

  // Performance Testing Helpers
  measurePerformance,
  checkMemoryUsage,

  // Snapshot Testing Utilities
  createSanitizedSnapshot,
  assertStructureMatch,

  // Test Coverage Helpers
  ensureFullCoverage,
  generateCoverageSummary,

  // CI/CD Test Utilities
  isRunningInCI,
  skipInCI,

  // Test Reporting Helpers
  logTestExecution,
  createTestReport,
};
