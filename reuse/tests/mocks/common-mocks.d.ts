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
export declare const createMockConfigService: (overrides?: Record<string, any>) => {
    get: any;
    getOrThrow: any;
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
export declare const createMockLogger: () => {
    log: any;
    error: any;
    warn: any;
    debug: any;
    verbose: any;
    setContext: any;
    setLogLevels: any;
};
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
export declare const createMockRepository: <T = any>() => {
    find: any;
    findOne: any;
    findById: any;
    findAndCount: any;
    findOneBy: any;
    findBy: any;
    create: any;
    save: any;
    update: any;
    delete: any;
    remove: any;
    count: any;
    increment: any;
    decrement: any;
    softDelete: any;
    restore: any;
    exist: any;
    createQueryBuilder: any;
};
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
export declare const createMockCacheManager: () => {
    get: any;
    set: any;
    del: any;
    reset: any;
    wrap: any;
    store: {
        keys: any;
        ttl: any;
    };
};
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
export declare const createMockEventEmitter: () => {
    emit: any;
    on: any;
    once: any;
    off: any;
    removeListener: any;
    removeAllListeners: any;
    addListener: any;
    listenerCount: any;
    listeners: any;
};
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
export declare const createMockQueue: () => {
    add: any;
    process: any;
    on: any;
    close: any;
    pause: any;
    resume: any;
    count: any;
    empty: any;
    clean: any;
    getJob: any;
    getJobs: any;
    removeJobs: any;
};
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
export declare const createMockRequest: (overrides?: Partial<Request>) => Partial<Request>;
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
export declare const createMockResponse: () => Partial<Response>;
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
export declare const createMockExecutionContext: (request?: Partial<Request>, response?: Partial<Response>) => ExecutionContext;
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
export declare const createMockJwtService: (defaultPayload?: any) => {
    sign: any;
    signAsync: any;
    verify: any;
    verifyAsync: any;
    decode: any;
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
export declare const createMockEmailService: () => {
    sendEmail: any;
    sendWelcomeEmail: any;
    sendPasswordReset: any;
    sendVerificationEmail: any;
    sendTemplateEmail: any;
};
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
export declare const createMockFileUploadService: () => {
    upload: any;
    delete: any;
    getSignedUrl: any;
    exists: any;
    getMetadata: any;
};
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
export declare const createMockNotificationService: () => {
    send: any;
    sendBulk: any;
    subscribe: any;
    unsubscribe: any;
    markAsRead: any;
    getUnreadCount: any;
};
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
export declare const createMockPaginationOptions: (overrides?: Record<string, any>) => {
    page: number;
    limit: number;
    sort: string;
    order: "DESC";
    search: string;
    filters: {};
};
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
export declare const createMockPaginatedResponse: <T>(items: T[], total?: number, page?: number, limit?: number) => {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    nextPage: number | null;
    previousPage: number | null;
};
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
export declare const createMockUser: (overrides?: Record<string, any>) => {
    id: string;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    fullName: string;
    role: string;
    isActive: boolean;
    isEmailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
    lastLoginAt: Date;
};
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
export declare const createMockTransaction: () => {
    commit: any;
    rollback: any;
    save: any;
    update: any;
    delete: any;
    release: any;
    query: any;
    manager: {
        save: any;
        remove: any;
    };
};
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
export declare const createMockHttpClient: () => {
    get: any;
    post: any;
    put: any;
    patch: any;
    delete: any;
    request: any;
};
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
export declare const createMockWebSocket: () => {
    send: any;
    emit: any;
    on: any;
    once: any;
    off: any;
    close: any;
    terminate: any;
    readyState: number;
    connected: boolean;
};
//# sourceMappingURL=common-mocks.d.ts.map