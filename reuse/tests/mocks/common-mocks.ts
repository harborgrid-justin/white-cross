/**
 * Common Mock Factories
 * Production-grade reusable mocks for testing NestJS applications
 *
 * @module CommonMocks
 * @description Provides comprehensive mock factories for common services and utilities
 */

import { ExecutionContext } from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * Configuration defaults for mock services
 */
interface ConfigDefaults {
  JWT_SECRET: string;
  JWT_EXPIRATION: string;
  DATABASE_URL: string;
  PORT: number;
  NODE_ENV: string;
  [key: string]: any;
}

/**
 * Creates a mock NestJS ConfigService with configurable defaults
 *
 * @param overrides - Optional configuration overrides
 * @returns Mock ConfigService instance with get and getOrThrow methods
 *
 * @example
 * ```typescript
 * const configService = createMockConfigService({ PORT: 4000 });
 * expect(configService.get('PORT')).toBe(4000);
 * ```
 */
export const createMockConfigService = (overrides: Record<string, any> = {}) => {
  const defaults: ConfigDefaults = {
    JWT_SECRET: 'test-secret-key-do-not-use-in-production',
    JWT_EXPIRATION: '1h',
    JWT_REFRESH_EXPIRATION: '7d',
    DATABASE_URL: 'sqlite::memory:',
    PORT: 3000,
    NODE_ENV: 'test',
    API_VERSION: 'v1',
    CORS_ORIGIN: '*',
    RATE_LIMIT_TTL: 60,
    RATE_LIMIT_MAX: 100,
    ...overrides,
  };

  return {
    get: jest.fn(<T = any>(key: string, defaultValue?: T): T | undefined => {
      return defaults[key] !== undefined ? defaults[key] : defaultValue;
    }),
    getOrThrow: jest.fn(<T = any>(key: string): T => {
      const value = defaults[key];
      if (value === undefined) {
        throw new Error(`Configuration key "${key}" not found`);
      }
      return value;
    }),
  };
};

/**
 * Creates a mock NestJS Logger service
 *
 * @returns Mock Logger instance with all standard logging methods
 *
 * @example
 * ```typescript
 * const logger = createMockLogger();
 * logger.log('Test message');
 * expect(logger.log).toHaveBeenCalledWith('Test message');
 * ```
 */
export const createMockLogger = () => ({
  log: jest.fn((message: string, ...optionalParams: any[]) => undefined),
  error: jest.fn((message: string, trace?: string, ...optionalParams: any[]) => undefined),
  warn: jest.fn((message: string, ...optionalParams: any[]) => undefined),
  debug: jest.fn((message: string, ...optionalParams: any[]) => undefined),
  verbose: jest.fn((message: string, ...optionalParams: any[]) => undefined),
  setContext: jest.fn((context: string) => undefined),
  setLogLevels: jest.fn((levels: string[]) => undefined),
});

/**
 * Creates a mock TypeORM Repository with full method coverage
 *
 * @template T - Entity type
 * @returns Mock Repository instance with all standard TypeORM methods
 *
 * @example
 * ```typescript
 * const repository = createMockRepository<User>();
 * repository.findOne.mockResolvedValue({ id: '1', email: 'test@example.com' });
 * const user = await repository.findOne({ where: { id: '1' } });
 * ```
 */
export const createMockRepository = <T = any>() => ({
  find: jest.fn<Promise<T[]>, any[]>(() => Promise.resolve([])),
  findOne: jest.fn<Promise<T | null>, any[]>(() => Promise.resolve(null)),
  findById: jest.fn<Promise<T | null>, any[]>(() => Promise.resolve(null)),
  findAndCount: jest.fn<Promise<[T[], number]>, any[]>(() => Promise.resolve([[], 0])),
  findOneBy: jest.fn<Promise<T | null>, any[]>(() => Promise.resolve(null)),
  findBy: jest.fn<Promise<T[]>, any[]>(() => Promise.resolve([])),
  create: jest.fn<T, any[]>((entityLike?: Partial<T>) => entityLike as T),
  save: jest.fn<Promise<T>, any[]>((entity: T) => Promise.resolve(entity)),
  update: jest.fn<Promise<any>, any[]>(() => Promise.resolve({ affected: 1 })),
  delete: jest.fn<Promise<any>, any[]>(() => Promise.resolve({ affected: 1 })),
  remove: jest.fn<Promise<T>, any[]>((entity: T) => Promise.resolve(entity)),
  count: jest.fn<Promise<number>, any[]>(() => Promise.resolve(0)),
  increment: jest.fn<Promise<any>, any[]>(() => Promise.resolve(undefined)),
  decrement: jest.fn<Promise<any>, any[]>(() => Promise.resolve(undefined)),
  softDelete: jest.fn<Promise<any>, any[]>(() => Promise.resolve({ affected: 1 })),
  restore: jest.fn<Promise<any>, any[]>(() => Promise.resolve({ affected: 1 })),
  exist: jest.fn<Promise<boolean>, any[]>(() => Promise.resolve(false)),
  createQueryBuilder: jest.fn((alias?: string) => ({
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    addOrderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    offset: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    innerJoinAndSelect: jest.fn().mockReturnThis(),
    leftJoin: jest.fn().mockReturnThis(),
    innerJoin: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    addSelect: jest.fn().mockReturnThis(),
    getMany: jest.fn<Promise<T[]>, any[]>(() => Promise.resolve([])),
    getOne: jest.fn<Promise<T | null>, any[]>(() => Promise.resolve(null)),
    getManyAndCount: jest.fn<Promise<[T[], number]>, any[]>(() => Promise.resolve([[], 0])),
    getRawMany: jest.fn(() => Promise.resolve([])),
    getRawOne: jest.fn(() => Promise.resolve(null)),
    execute: jest.fn(() => Promise.resolve({ affected: 0 })),
    delete: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
  })),
});

/**
 * Creates a mock Cache Manager (compatible with @nestjs/cache-manager)
 *
 * @returns Mock Cache Manager instance
 *
 * @example
 * ```typescript
 * const cacheManager = createMockCacheManager();
 * cacheManager.set.mockResolvedValue(undefined);
 * await cacheManager.set('key', 'value', 3600);
 * ```
 */
export const createMockCacheManager = () => ({
  get: jest.fn<Promise<any>, [string]>((key: string) => Promise.resolve(undefined)),
  set: jest.fn<Promise<void>, [string, any, number?]>(() => Promise.resolve()),
  del: jest.fn<Promise<void>, [string]>(() => Promise.resolve()),
  reset: jest.fn<Promise<void>, []>(() => Promise.resolve()),
  wrap: jest.fn<Promise<any>, [string, () => Promise<any>, number?]>(
    (key: string, fn: () => Promise<any>) => fn()
  ),
  store: {
    keys: jest.fn<Promise<string[]>, []>(() => Promise.resolve([])),
    ttl: jest.fn<Promise<number>, [string]>(() => Promise.resolve(0)),
  },
});

/**
 * Creates a mock EventEmitter (Node.js EventEmitter or @nestjs/event-emitter)
 *
 * @returns Mock EventEmitter instance
 *
 * @example
 * ```typescript
 * const eventEmitter = createMockEventEmitter();
 * eventEmitter.emit('user.created', { id: '1' });
 * expect(eventEmitter.emit).toHaveBeenCalledWith('user.created', { id: '1' });
 * ```
 */
export const createMockEventEmitter = () => ({
  emit: jest.fn<boolean, [string | symbol, ...any[]]>(() => true),
  on: jest.fn<any, [string | symbol, (...args: any[]) => void]>().mockReturnThis(),
  once: jest.fn<any, [string | symbol, (...args: any[]) => void]>().mockReturnThis(),
  off: jest.fn<any, [string | symbol, (...args: any[]) => void]>().mockReturnThis(),
  removeListener: jest.fn<any, [string | symbol, (...args: any[]) => void]>().mockReturnThis(),
  removeAllListeners: jest.fn<any, [string | symbol?]>().mockReturnThis(),
  addListener: jest.fn<any, [string | symbol, (...args: any[]) => void]>().mockReturnThis(),
  listenerCount: jest.fn<number, [string | symbol]>(() => 0),
  listeners: jest.fn<Function[], [string | symbol]>(() => []),
});

/**
 * Creates a mock Bull Queue instance
 *
 * @returns Mock Queue instance
 *
 * @example
 * ```typescript
 * const queue = createMockQueue();
 * queue.add.mockResolvedValue({ id: 'job-1', data: {} } as any);
 * await queue.add('email', { to: 'test@example.com' });
 * ```
 */
export const createMockQueue = () => ({
  add: jest.fn<Promise<any>, [string, any, any?]>(() =>
    Promise.resolve({ id: 'job-id', data: {} })
  ),
  process: jest.fn<void, [string | Function, Function?]>(),
  on: jest.fn<any, [string, Function]>().mockReturnThis(),
  close: jest.fn<Promise<void>, []>(() => Promise.resolve()),
  pause: jest.fn<Promise<void>, [boolean?]>(() => Promise.resolve()),
  resume: jest.fn<Promise<void>, [boolean?]>(() => Promise.resolve()),
  count: jest.fn<Promise<number>, []>(() => Promise.resolve(0)),
  empty: jest.fn<Promise<void>, []>(() => Promise.resolve()),
  clean: jest.fn<Promise<any[]>, [number, string]>(() => Promise.resolve([])),
  getJob: jest.fn<Promise<any>, [string]>(() => Promise.resolve(null)),
  getJobs: jest.fn<Promise<any[]>, [string[]]>(() => Promise.resolve([])),
  removeJobs: jest.fn<Promise<void>, [string]>(() => Promise.resolve()),
});

/**
 * Creates a mock Express Request object
 *
 * @param overrides - Partial Request properties to override defaults
 * @returns Mock Request object
 *
 * @example
 * ```typescript
 * const request = createMockRequest({
 *   user: { id: '1', email: 'test@example.com' },
 *   params: { id: '123' }
 * });
 * ```
 */
export const createMockRequest = (overrides: Partial<Request> = {}): Partial<Request> => ({
  body: {},
  query: {},
  params: {},
  headers: {},
  user: undefined,
  method: 'GET',
  url: '/',
  path: '/',
  ip: '127.0.0.1',
  protocol: 'http',
  secure: false,
  hostname: 'localhost',
  get: jest.fn((header: string) => undefined),
  header: jest.fn((header: string) => undefined),
  accepts: jest.fn(() => false),
  is: jest.fn(() => false),
  ...overrides,
});

/**
 * Creates a mock Express Response object
 *
 * @returns Mock Response object with chainable methods
 *
 * @example
 * ```typescript
 * const response = createMockResponse();
 * response.status(200).json({ success: true });
 * expect(response.status).toHaveBeenCalledWith(200);
 * ```
 */
export const createMockResponse = (): Partial<Response> => {
  const res: any = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
    sendStatus: jest.fn().mockReturnThis(),
    setHeader: jest.fn().mockReturnThis(),
    getHeader: jest.fn((name: string) => undefined),
    cookie: jest.fn().mockReturnThis(),
    clearCookie: jest.fn().mockReturnThis(),
    redirect: jest.fn().mockReturnThis(),
    render: jest.fn().mockReturnThis(),
    type: jest.fn().mockReturnThis(),
    end: jest.fn().mockReturnThis(),
    statusCode: 200,
    headersSent: false,
  };
  return res;
};

/**
 * Creates a mock NestJS ExecutionContext
 *
 * @param request - Partial Request object to include in context
 * @param response - Optional partial Response object
 * @returns Mock ExecutionContext
 *
 * @example
 * ```typescript
 * const context = createMockExecutionContext({
 *   user: { id: '1', role: 'admin' }
 * });
 * const request = context.switchToHttp().getRequest();
 * ```
 */
export const createMockExecutionContext = (
  request: Partial<Request> = {},
  response?: Partial<Response>,
): ExecutionContext => {
  const mockRequest = createMockRequest(request);
  const mockResponse = response || createMockResponse();

  return {
    switchToHttp: jest.fn().mockReturnValue({
      getRequest: () => mockRequest,
      getResponse: () => mockResponse,
      getNext: () => jest.fn(),
    }),
    getClass: jest.fn(() => class MockClass {}),
    getHandler: jest.fn(() => function mockHandler() {}),
    getArgs: jest.fn(() => [mockRequest, mockResponse, jest.fn()]),
    getArgByIndex: jest.fn((index: number) => [mockRequest, mockResponse, jest.fn()][index]),
    switchToRpc: jest.fn().mockReturnValue({
      getData: () => ({}),
      getContext: () => ({}),
    }),
    switchToWs: jest.fn().mockReturnValue({
      getData: () => ({}),
      getClient: () => ({}),
    }),
    getType: jest.fn(() => 'http'),
  } as any;
};

/**
 * Creates a mock @nestjs/jwt JwtService
 *
 * @param defaultPayload - Default payload to return from verify/decode
 * @returns Mock JwtService instance
 *
 * @example
 * ```typescript
 * const jwtService = createMockJwtService();
 * const token = jwtService.sign({ userId: '1' });
 * expect(token).toBe('mock-jwt-token');
 * ```
 */
export const createMockJwtService = (defaultPayload?: any) => {
  const payload = defaultPayload || { userId: '1', email: 'test@example.com', iat: Date.now() };

  return {
    sign: jest.fn<string, [any, any?]>(() => 'mock-jwt-token'),
    signAsync: jest.fn<Promise<string>, [any, any?]>(() => Promise.resolve('mock-jwt-token')),
    verify: jest.fn<any, [string, any?]>(() => payload),
    verifyAsync: jest.fn<Promise<any>, [string, any?]>(() => Promise.resolve(payload)),
    decode: jest.fn<any, [string, any?]>(() => payload),
  };
};

/**
 * Creates a mock Email Service
 *
 * @returns Mock Email Service instance
 *
 * @example
 * ```typescript
 * const emailService = createMockEmailService();
 * await emailService.sendEmail({ to: 'user@example.com', subject: 'Test' });
 * expect(emailService.sendEmail).toHaveBeenCalled();
 * ```
 */
export const createMockEmailService = () => ({
  sendEmail: jest.fn<Promise<boolean>, [any]>(() => Promise.resolve(true)),
  sendWelcomeEmail: jest.fn<Promise<boolean>, [string, any?]>(() => Promise.resolve(true)),
  sendPasswordReset: jest.fn<Promise<boolean>, [string, string]>(() => Promise.resolve(true)),
  sendVerificationEmail: jest.fn<Promise<boolean>, [string, string]>(() => Promise.resolve(true)),
  sendTemplateEmail: jest.fn<Promise<boolean>, [string, string, any]>(() => Promise.resolve(true)),
});

/**
 * Creates a mock File Upload/Storage Service
 *
 * @returns Mock File Upload Service instance
 *
 * @example
 * ```typescript
 * const uploadService = createMockFileUploadService();
 * const result = await uploadService.upload(mockFile);
 * expect(result.url).toBeDefined();
 * ```
 */
export const createMockFileUploadService = () => ({
  upload: jest.fn<
    Promise<{ url: string; key: string; size?: number }>,
    [any, string?]
  >(() =>
    Promise.resolve({
      url: 'https://cdn.example.com/files/test-file.pdf',
      key: 'files/test-file-123.pdf',
      size: 1024,
    })
  ),
  delete: jest.fn<Promise<boolean>, [string]>(() => Promise.resolve(true)),
  getSignedUrl: jest.fn<Promise<string>, [string, number?]>(() =>
    Promise.resolve('https://cdn.example.com/signed-url?token=abc123')
  ),
  exists: jest.fn<Promise<boolean>, [string]>(() => Promise.resolve(true)),
  getMetadata: jest.fn<Promise<any>, [string]>(() =>
    Promise.resolve({
      size: 1024,
      contentType: 'application/pdf',
      lastModified: new Date(),
    })
  ),
});

/**
 * Creates a mock Notification Service
 *
 * @returns Mock Notification Service instance
 *
 * @example
 * ```typescript
 * const notificationService = createMockNotificationService();
 * await notificationService.send('user-id', { title: 'Hello' });
 * ```
 */
export const createMockNotificationService = () => ({
  send: jest.fn<Promise<boolean>, [string, any]>(() => Promise.resolve(true)),
  sendBulk: jest.fn<Promise<{ sent: number; failed: number }>, [string[], any]>(() =>
    Promise.resolve({ sent: 10, failed: 0 })
  ),
  subscribe: jest.fn<Promise<boolean>, [string, string]>(() => Promise.resolve(true)),
  unsubscribe: jest.fn<Promise<boolean>, [string, string]>(() => Promise.resolve(true)),
  markAsRead: jest.fn<Promise<boolean>, [string]>(() => Promise.resolve(true)),
  getUnreadCount: jest.fn<Promise<number>, [string]>(() => Promise.resolve(0)),
});

/**
 * Creates mock pagination options
 *
 * @param overrides - Optional overrides for pagination options
 * @returns Pagination options object
 *
 * @example
 * ```typescript
 * const options = createMockPaginationOptions({ page: 2, limit: 20 });
 * ```
 */
export const createMockPaginationOptions = (overrides: Record<string, any> = {}) => ({
  page: 1,
  limit: 10,
  sort: 'createdAt',
  order: 'DESC' as const,
  search: '',
  filters: {},
  ...overrides,
});

/**
 * Creates a mock paginated response
 *
 * @template T - Type of items in the response
 * @param items - Array of items
 * @param total - Total count (defaults to items.length)
 * @param page - Current page number
 * @param limit - Items per page
 * @returns Paginated response object
 *
 * @example
 * ```typescript
 * const response = createMockPaginatedResponse([{ id: '1' }], 100, 1, 10);
 * expect(response.totalPages).toBe(10);
 * ```
 */
export const createMockPaginatedResponse = <T>(
  items: T[],
  total: number = items.length,
  page: number = 1,
  limit: number = items.length || 10,
) => ({
  items,
  total,
  page,
  limit,
  totalPages: Math.ceil(total / limit),
  hasNextPage: page < Math.ceil(total / limit),
  hasPreviousPage: page > 1,
  nextPage: page < Math.ceil(total / limit) ? page + 1 : null,
  previousPage: page > 1 ? page - 1 : null,
});

/**
 * Creates a mock User entity
 *
 * @param overrides - Optional property overrides
 * @returns Mock User object
 *
 * @example
 * ```typescript
 * const user = createMockUser({ email: 'custom@example.com', role: 'admin' });
 * ```
 */
export const createMockUser = (overrides: Record<string, any> = {}) => ({
  id: '1',
  email: 'test@example.com',
  username: 'testuser',
  firstName: 'Test',
  lastName: 'User',
  fullName: 'Test User',
  role: 'user',
  isActive: true,
  isEmailVerified: true,
  createdAt: new Date('2024-01-01T00:00:00.000Z'),
  updatedAt: new Date('2024-01-01T00:00:00.000Z'),
  lastLoginAt: new Date('2024-01-01T00:00:00.000Z'),
  ...overrides,
});

/**
 * Creates a mock database transaction/entity manager
 *
 * @returns Mock Transaction object
 *
 * @example
 * ```typescript
 * const transaction = createMockTransaction();
 * await transaction.save(entity);
 * await transaction.commit();
 * ```
 */
export const createMockTransaction = () => ({
  commit: jest.fn<Promise<void>, []>(() => Promise.resolve()),
  rollback: jest.fn<Promise<void>, []>(() => Promise.resolve()),
  save: jest.fn<Promise<any>, [any]>((entity) => Promise.resolve(entity)),
  update: jest.fn<Promise<any>, [any, any]>(() => Promise.resolve({ affected: 1 })),
  delete: jest.fn<Promise<any>, [any, any]>(() => Promise.resolve({ affected: 1 })),
  release: jest.fn<Promise<void>, []>(() => Promise.resolve()),
  query: jest.fn<Promise<any>, [string, any[]?]>(() => Promise.resolve([])),
  manager: {
    save: jest.fn((entity: any) => Promise.resolve(entity)),
    remove: jest.fn((entity: any) => Promise.resolve(entity)),
  },
});

/**
 * Creates a mock HTTP client (like axios)
 *
 * @returns Mock HTTP client
 *
 * @example
 * ```typescript
 * const httpClient = createMockHttpClient();
 * httpClient.get.mockResolvedValue({ data: { success: true } });
 * ```
 */
export const createMockHttpClient = () => ({
  get: jest.fn<Promise<any>, [string, any?]>(() =>
    Promise.resolve({ data: {}, status: 200, statusText: 'OK' })
  ),
  post: jest.fn<Promise<any>, [string, any?, any?]>(() =>
    Promise.resolve({ data: {}, status: 201, statusText: 'Created' })
  ),
  put: jest.fn<Promise<any>, [string, any?, any?]>(() =>
    Promise.resolve({ data: {}, status: 200, statusText: 'OK' })
  ),
  patch: jest.fn<Promise<any>, [string, any?, any?]>(() =>
    Promise.resolve({ data: {}, status: 200, statusText: 'OK' })
  ),
  delete: jest.fn<Promise<any>, [string, any?]>(() =>
    Promise.resolve({ data: {}, status: 204, statusText: 'No Content' })
  ),
  request: jest.fn<Promise<any>, [any]>(() =>
    Promise.resolve({ data: {}, status: 200, statusText: 'OK' })
  ),
});

/**
 * Creates a mock WebSocket client/server
 *
 * @returns Mock WebSocket instance
 *
 * @example
 * ```typescript
 * const ws = createMockWebSocket();
 * ws.emit('message', { data: 'test' });
 * ```
 */
export const createMockWebSocket = () => ({
  send: jest.fn<void, [any]>(),
  emit: jest.fn<boolean, [string, any]>(() => true),
  on: jest.fn<any, [string, Function]>().mockReturnThis(),
  once: jest.fn<any, [string, Function]>().mockReturnThis(),
  off: jest.fn<any, [string, Function?]>().mockReturnThis(),
  close: jest.fn<void, [number?, string?]>(),
  terminate: jest.fn<void, []>(),
  readyState: 1, // OPEN
  connected: true,
});
