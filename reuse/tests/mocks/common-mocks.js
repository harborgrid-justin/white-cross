"use strict";
/**
 * Common Mock Factories
 * Production-grade reusable mocks for testing NestJS applications
 *
 * @module CommonMocks
 * @description Provides comprehensive mock factories for common services and utilities
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMockWebSocket = exports.createMockHttpClient = exports.createMockTransaction = exports.createMockUser = exports.createMockPaginatedResponse = exports.createMockPaginationOptions = exports.createMockNotificationService = exports.createMockFileUploadService = exports.createMockEmailService = exports.createMockJwtService = exports.createMockExecutionContext = exports.createMockResponse = exports.createMockRequest = exports.createMockQueue = exports.createMockEventEmitter = exports.createMockCacheManager = exports.createMockRepository = exports.createMockLogger = exports.createMockConfigService = void 0;
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
const createMockConfigService = (overrides = {}) => {
    const defaults = {
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
        get: jest.fn((key, defaultValue) => {
            return defaults[key] !== undefined ? defaults[key] : defaultValue;
        }),
        getOrThrow: jest.fn((key) => {
            const value = defaults[key];
            if (value === undefined) {
                throw new Error(`Configuration key "${key}" not found`);
            }
            return value;
        }),
    };
};
exports.createMockConfigService = createMockConfigService;
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
const createMockLogger = () => ({
    log: jest.fn((message, ...optionalParams) => undefined),
    error: jest.fn((message, trace, ...optionalParams) => undefined),
    warn: jest.fn((message, ...optionalParams) => undefined),
    debug: jest.fn((message, ...optionalParams) => undefined),
    verbose: jest.fn((message, ...optionalParams) => undefined),
    setContext: jest.fn((context) => undefined),
    setLogLevels: jest.fn((levels) => undefined),
});
exports.createMockLogger = createMockLogger;
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
const createMockRepository = () => ({
    find: jest.fn(() => Promise.resolve([])),
    findOne: jest.fn(() => Promise.resolve(null)),
    findById: jest.fn(() => Promise.resolve(null)),
    findAndCount: jest.fn(() => Promise.resolve([[], 0])),
    findOneBy: jest.fn(() => Promise.resolve(null)),
    findBy: jest.fn(() => Promise.resolve([])),
    create: jest.fn((entityLike) => entityLike),
    save: jest.fn((entity) => Promise.resolve(entity)),
    update: jest.fn(() => Promise.resolve({ affected: 1 })),
    delete: jest.fn(() => Promise.resolve({ affected: 1 })),
    remove: jest.fn((entity) => Promise.resolve(entity)),
    count: jest.fn(() => Promise.resolve(0)),
    increment: jest.fn(() => Promise.resolve(undefined)),
    decrement: jest.fn(() => Promise.resolve(undefined)),
    softDelete: jest.fn(() => Promise.resolve({ affected: 1 })),
    restore: jest.fn(() => Promise.resolve({ affected: 1 })),
    exist: jest.fn(() => Promise.resolve(false)),
    createQueryBuilder: jest.fn((alias) => ({
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
        getMany: jest.fn(() => Promise.resolve([])),
        getOne: jest.fn(() => Promise.resolve(null)),
        getManyAndCount: jest.fn(() => Promise.resolve([[], 0])),
        getRawMany: jest.fn(() => Promise.resolve([])),
        getRawOne: jest.fn(() => Promise.resolve(null)),
        execute: jest.fn(() => Promise.resolve({ affected: 0 })),
        delete: jest.fn().mockReturnThis(),
        update: jest.fn().mockReturnThis(),
        set: jest.fn().mockReturnThis(),
    })),
});
exports.createMockRepository = createMockRepository;
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
const createMockCacheManager = () => ({
    get: jest.fn((key) => Promise.resolve(undefined)),
    set: jest.fn(() => Promise.resolve()),
    del: jest.fn(() => Promise.resolve()),
    reset: jest.fn(() => Promise.resolve()),
    wrap: jest.fn((key, fn) => fn()),
    store: {
        keys: jest.fn(() => Promise.resolve([])),
        ttl: jest.fn(() => Promise.resolve(0)),
    },
});
exports.createMockCacheManager = createMockCacheManager;
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
const createMockEventEmitter = () => ({
    emit: jest.fn(() => true),
    on: jest.fn().mockReturnThis(),
    once: jest.fn().mockReturnThis(),
    off: jest.fn().mockReturnThis(),
    removeListener: jest.fn().mockReturnThis(),
    removeAllListeners: jest.fn().mockReturnThis(),
    addListener: jest.fn().mockReturnThis(),
    listenerCount: jest.fn(() => 0),
    listeners: jest.fn(() => []),
});
exports.createMockEventEmitter = createMockEventEmitter;
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
const createMockQueue = () => ({
    add: jest.fn(() => Promise.resolve({ id: 'job-id', data: {} })),
    process: jest.fn(),
    on: jest.fn().mockReturnThis(),
    close: jest.fn(() => Promise.resolve()),
    pause: jest.fn(() => Promise.resolve()),
    resume: jest.fn(() => Promise.resolve()),
    count: jest.fn(() => Promise.resolve(0)),
    empty: jest.fn(() => Promise.resolve()),
    clean: jest.fn(() => Promise.resolve([])),
    getJob: jest.fn(() => Promise.resolve(null)),
    getJobs: jest.fn(() => Promise.resolve([])),
    removeJobs: jest.fn(() => Promise.resolve()),
});
exports.createMockQueue = createMockQueue;
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
const createMockRequest = (overrides = {}) => ({
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
    get: jest.fn((header) => undefined),
    header: jest.fn((header) => undefined),
    accepts: jest.fn(() => false),
    is: jest.fn(() => false),
    ...overrides,
});
exports.createMockRequest = createMockRequest;
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
const createMockResponse = () => {
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis(),
        sendStatus: jest.fn().mockReturnThis(),
        setHeader: jest.fn().mockReturnThis(),
        getHeader: jest.fn((name) => undefined),
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
exports.createMockResponse = createMockResponse;
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
const createMockExecutionContext = (request = {}, response) => {
    const mockRequest = (0, exports.createMockRequest)(request);
    const mockResponse = response || (0, exports.createMockResponse)();
    return {
        switchToHttp: jest.fn().mockReturnValue({
            getRequest: () => mockRequest,
            getResponse: () => mockResponse,
            getNext: () => jest.fn(),
        }),
        getClass: jest.fn(() => class MockClass {
        }),
        getHandler: jest.fn(() => function mockHandler() { }),
        getArgs: jest.fn(() => [mockRequest, mockResponse, jest.fn()]),
        getArgByIndex: jest.fn((index) => [mockRequest, mockResponse, jest.fn()][index]),
        switchToRpc: jest.fn().mockReturnValue({
            getData: () => ({}),
            getContext: () => ({}),
        }),
        switchToWs: jest.fn().mockReturnValue({
            getData: () => ({}),
            getClient: () => ({}),
        }),
        getType: jest.fn(() => 'http'),
    };
};
exports.createMockExecutionContext = createMockExecutionContext;
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
const createMockJwtService = (defaultPayload) => {
    const payload = defaultPayload || { userId: '1', email: 'test@example.com', iat: Date.now() };
    return {
        sign: jest.fn(() => 'mock-jwt-token'),
        signAsync: jest.fn(() => Promise.resolve('mock-jwt-token')),
        verify: jest.fn(() => payload),
        verifyAsync: jest.fn(() => Promise.resolve(payload)),
        decode: jest.fn(() => payload),
    };
};
exports.createMockJwtService = createMockJwtService;
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
const createMockEmailService = () => ({
    sendEmail: jest.fn(() => Promise.resolve(true)),
    sendWelcomeEmail: jest.fn(() => Promise.resolve(true)),
    sendPasswordReset: jest.fn(() => Promise.resolve(true)),
    sendVerificationEmail: jest.fn(() => Promise.resolve(true)),
    sendTemplateEmail: jest.fn(() => Promise.resolve(true)),
});
exports.createMockEmailService = createMockEmailService;
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
const createMockFileUploadService = () => ({
    upload: jest.fn(() => Promise.resolve({
        url: 'https://cdn.example.com/files/test-file.pdf',
        key: 'files/test-file-123.pdf',
        size: 1024,
    })),
    delete: jest.fn(() => Promise.resolve(true)),
    getSignedUrl: jest.fn(() => Promise.resolve('https://cdn.example.com/signed-url?token=abc123')),
    exists: jest.fn(() => Promise.resolve(true)),
    getMetadata: jest.fn(() => Promise.resolve({
        size: 1024,
        contentType: 'application/pdf',
        lastModified: new Date(),
    })),
});
exports.createMockFileUploadService = createMockFileUploadService;
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
const createMockNotificationService = () => ({
    send: jest.fn(() => Promise.resolve(true)),
    sendBulk: jest.fn(() => Promise.resolve({ sent: 10, failed: 0 })),
    subscribe: jest.fn(() => Promise.resolve(true)),
    unsubscribe: jest.fn(() => Promise.resolve(true)),
    markAsRead: jest.fn(() => Promise.resolve(true)),
    getUnreadCount: jest.fn(() => Promise.resolve(0)),
});
exports.createMockNotificationService = createMockNotificationService;
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
const createMockPaginationOptions = (overrides = {}) => ({
    page: 1,
    limit: 10,
    sort: 'createdAt',
    order: 'DESC',
    search: '',
    filters: {},
    ...overrides,
});
exports.createMockPaginationOptions = createMockPaginationOptions;
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
const createMockPaginatedResponse = (items, total = items.length, page = 1, limit = items.length || 10) => ({
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
exports.createMockPaginatedResponse = createMockPaginatedResponse;
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
const createMockUser = (overrides = {}) => ({
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
exports.createMockUser = createMockUser;
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
const createMockTransaction = () => ({
    commit: jest.fn(() => Promise.resolve()),
    rollback: jest.fn(() => Promise.resolve()),
    save: jest.fn((entity) => Promise.resolve(entity)),
    update: jest.fn(() => Promise.resolve({ affected: 1 })),
    delete: jest.fn(() => Promise.resolve({ affected: 1 })),
    release: jest.fn(() => Promise.resolve()),
    query: jest.fn(() => Promise.resolve([])),
    manager: {
        save: jest.fn((entity) => Promise.resolve(entity)),
        remove: jest.fn((entity) => Promise.resolve(entity)),
    },
});
exports.createMockTransaction = createMockTransaction;
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
const createMockHttpClient = () => ({
    get: jest.fn(() => Promise.resolve({ data: {}, status: 200, statusText: 'OK' })),
    post: jest.fn(() => Promise.resolve({ data: {}, status: 201, statusText: 'Created' })),
    put: jest.fn(() => Promise.resolve({ data: {}, status: 200, statusText: 'OK' })),
    patch: jest.fn(() => Promise.resolve({ data: {}, status: 200, statusText: 'OK' })),
    delete: jest.fn(() => Promise.resolve({ data: {}, status: 204, statusText: 'No Content' })),
    request: jest.fn(() => Promise.resolve({ data: {}, status: 200, statusText: 'OK' })),
});
exports.createMockHttpClient = createMockHttpClient;
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
const createMockWebSocket = () => ({
    send: jest.fn(),
    emit: jest.fn(() => true),
    on: jest.fn().mockReturnThis(),
    once: jest.fn().mockReturnThis(),
    off: jest.fn().mockReturnThis(),
    close: jest.fn(),
    terminate: jest.fn(),
    readyState: 1, // OPEN
    connected: true,
});
exports.createMockWebSocket = createMockWebSocket;
//# sourceMappingURL=common-mocks.js.map