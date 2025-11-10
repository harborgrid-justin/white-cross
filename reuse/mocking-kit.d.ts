/**
 * LOC: MOCK1234567
 * File: /reuse/mocking-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Test files (*.spec.ts, *.test.ts)
 *   - Unit test suites
 *   - Integration test modules
 */
interface MockFunctionOptions {
    returnValue?: any;
    returnValues?: any[];
    implementation?: (...args: any[]) => any;
    throwError?: Error;
    mockName?: string;
}
interface SpyOptions {
    restore?: boolean;
    mockImplementation?: (...args: any[]) => any;
    callThrough?: boolean;
}
interface StubOptions {
    returnOnce?: any[];
    alwaysReturn?: any;
    throwOnCall?: number;
}
interface MockHttpOptions {
    baseURL?: string;
    headers?: Record<string, string>;
    timeout?: number;
    retries?: number;
}
interface MockDatabaseOptions {
    autoIncrement?: boolean;
    cascadeDelete?: boolean;
    strictMode?: boolean;
}
interface MockAuthOptions {
    userId?: string;
    roles?: string[];
    permissions?: string[];
    expiresIn?: string;
}
interface MockFileSystemOptions {
    initialFiles?: Record<string, string>;
    readOnly?: boolean;
}
interface MockTimeOptions {
    startTime?: Date;
    autoAdvance?: boolean;
    step?: number;
}
interface MockWebSocketOptions {
    autoConnect?: boolean;
    pingInterval?: number;
}
interface MockEventOptions {
    async?: boolean;
    maxListeners?: number;
}
/**
 * 1. Creates a mock function with configurable behavior.
 *
 * @param {MockFunctionOptions} [options] - Mock function options
 * @returns {jest.Mock} Configured mock function
 *
 * @example
 * ```typescript
 * const mockFn = createMockFunction({
 *   returnValue: { id: 1, name: 'Test' },
 *   mockName: 'getUserMock'
 * });
 * ```
 */
export declare const createMockFunction: (options?: MockFunctionOptions) => jest.Mock;
/**
 * 2. Creates async mock function with Promise resolution.
 *
 * @param {any} [resolvedValue] - Value to resolve
 * @param {number} [delay] - Delay before resolution in ms
 * @returns {jest.Mock} Async mock function
 *
 * @example
 * ```typescript
 * const asyncMock = createAsyncMock({ data: 'result' }, 100);
 * const result = await asyncMock();
 * ```
 */
export declare const createAsyncMock: (resolvedValue?: any, delay?: number) => jest.Mock;
/**
 * 3. Creates async mock that rejects with error.
 *
 * @param {Error | string} error - Error to reject with
 * @param {number} [delay] - Delay before rejection in ms
 * @returns {jest.Mock} Rejecting async mock
 *
 * @example
 * ```typescript
 * const rejectMock = createRejectingMock(new Error('API failed'), 50);
 * await expect(rejectMock()).rejects.toThrow('API failed');
 * ```
 */
export declare const createRejectingMock: (error: Error | string, delay?: number) => jest.Mock;
/**
 * 4. Creates mock with sequential return values.
 *
 * @param {any[]} values - Array of values to return in sequence
 * @returns {jest.Mock} Sequential mock function
 *
 * @example
 * ```typescript
 * const seqMock = createSequentialMock([1, 2, 3, 4]);
 * expect(seqMock()).toBe(1);
 * expect(seqMock()).toBe(2);
 * ```
 */
export declare const createSequentialMock: (values: any[]) => jest.Mock;
/**
 * 5. Creates mock that alternates between success and failure.
 *
 * @param {any} successValue - Value on success
 * @param {Error} failureError - Error on failure
 * @returns {jest.Mock} Alternating mock
 *
 * @example
 * ```typescript
 * const altMock = createAlternatingMock({ ok: true }, new Error('Failed'));
 * expect(altMock()).toEqual({ ok: true });
 * expect(() => altMock()).toThrow('Failed');
 * ```
 */
export declare const createAlternatingMock: (successValue: any, failureError: Error) => jest.Mock;
/**
 * 6. Creates conditional mock based on input.
 *
 * @param {(args: any[]) => any} condition - Condition function
 * @returns {jest.Mock} Conditional mock
 *
 * @example
 * ```typescript
 * const condMock = createConditionalMock((args) =>
 *   args[0] > 10 ? 'high' : 'low'
 * );
 * expect(condMock(15)).toBe('high');
 * ```
 */
export declare const createConditionalMock: (condition: (args: any[]) => any) => jest.Mock;
/**
 * 7. Creates spy on object method.
 *
 * @param {any} object - Object to spy on
 * @param {string} method - Method name
 * @param {SpyOptions} [options] - Spy options
 * @returns {jest.SpyInstance} Spy instance
 *
 * @example
 * ```typescript
 * const spy = createSpy(userService, 'findById', { callThrough: true });
 * await userService.findById('123');
 * expect(spy).toHaveBeenCalledWith('123');
 * ```
 */
export declare const createSpy: (object: any, method: string, options?: SpyOptions) => jest.SpyInstance;
/**
 * 8. Creates multiple spies on object.
 *
 * @param {any} object - Object to spy on
 * @param {string[]} methods - Method names
 * @returns {Record<string, jest.SpyInstance>} Map of spies
 *
 * @example
 * ```typescript
 * const spies = createMultipleSpies(userService, ['find', 'create', 'update']);
 * expect(spies.find).toBeDefined();
 * ```
 */
export declare const createMultipleSpies: (object: any, methods: string[]) => Record<string, jest.SpyInstance>;
/**
 * 9. Creates spy that tracks call order.
 *
 * @param {any} object - Object to spy on
 * @param {string[]} methods - Methods to track
 * @returns {{ spies: Record<string, jest.SpyInstance>; getCallOrder: () => string[] }} Spies and order tracker
 *
 * @example
 * ```typescript
 * const { spies, getCallOrder } = createOrderTrackingSpy(service, ['methodA', 'methodB']);
 * service.methodA();
 * service.methodB();
 * expect(getCallOrder()).toEqual(['methodA', 'methodB']);
 * ```
 */
export declare const createOrderTrackingSpy: (object: any, methods: string[]) => {
    spies: Record<string, jest.SpyInstance>;
    getCallOrder: () => string[];
};
/**
 * 10. Restores all spies on object.
 *
 * @param {Record<string, jest.SpyInstance>} spies - Spies to restore
 * @returns {void}
 *
 * @example
 * ```typescript
 * const spies = createMultipleSpies(service, ['method1', 'method2']);
 * // ... tests ...
 * restoreSpies(spies);
 * ```
 */
export declare const restoreSpies: (spies: Record<string, jest.SpyInstance>) => void;
/**
 * 11. Creates stub with predefined responses.
 *
 * @param {StubOptions} options - Stub configuration
 * @returns {jest.Mock} Stub function
 *
 * @example
 * ```typescript
 * const stub = createStub({
 *   returnOnce: [1, 2, 3],
 *   alwaysReturn: 0
 * });
 * ```
 */
export declare const createStub: (options: StubOptions) => jest.Mock;
/**
 * 12. Creates getter/setter stub for property.
 *
 * @param {any} object - Object to stub
 * @param {string} property - Property name
 * @param {any} value - Initial value
 * @returns {jest.SpyInstance[]} Getter and setter spies
 *
 * @example
 * ```typescript
 * const [getter, setter] = createPropertyStub(config, 'apiKey', 'test-key');
 * expect(config.apiKey).toBe('test-key');
 * ```
 */
export declare const createPropertyStub: (object: any, property: string, value: any) => jest.SpyInstance[];
/**
 * 13. Creates stub that counts invocations.
 *
 * @param {(...args: any[]) => any} [implementation] - Optional implementation
 * @returns {{ stub: jest.Mock; getCount: () => number; reset: () => void }} Counting stub
 *
 * @example
 * ```typescript
 * const { stub, getCount, reset } = createCountingStub((x) => x * 2);
 * stub(5);
 * stub(10);
 * expect(getCount()).toBe(2);
 * ```
 */
export declare const createCountingStub: (implementation?: (...args: any[]) => any) => {
    stub: jest.Mock;
    getCount: () => number;
    reset: () => void;
};
/**
 * 14. Generates fake email address.
 *
 * @param {string} [prefix] - Email prefix
 * @returns {string} Fake email
 *
 * @example
 * ```typescript
 * const email = generateFakeEmail('test');
 * // Result: 'test.1234567890@example.com'
 * ```
 */
export declare const generateFakeEmail: (prefix?: string) => string;
/**
 * 15. Generates fake UUID.
 *
 * @returns {string} Fake UUID
 *
 * @example
 * ```typescript
 * const id = generateFakeUUID();
 * // Result: 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
 * ```
 */
export declare const generateFakeUUID: () => string;
/**
 * 16. Generates fake date within range.
 *
 * @param {Date} [start] - Start date
 * @param {Date} [end] - End date
 * @returns {Date} Fake date
 *
 * @example
 * ```typescript
 * const date = generateFakeDate(new Date('2020-01-01'), new Date('2024-01-01'));
 * ```
 */
export declare const generateFakeDate: (start?: Date, end?: Date) => Date;
/**
 * 17. Generates fake phone number.
 *
 * @param {string} [format] - Phone format pattern
 * @returns {string} Fake phone number
 *
 * @example
 * ```typescript
 * const phone = generateFakePhone('###-###-####');
 * // Result: '555-123-4567'
 * ```
 */
export declare const generateFakePhone: (format?: string) => string;
/**
 * 18. Generates fake address object.
 *
 * @returns {any} Fake address
 *
 * @example
 * ```typescript
 * const address = generateFakeAddress();
 * // Result: { street: '123 Main St', city: 'Test City', ... }
 * ```
 */
export declare const generateFakeAddress: () => any;
/**
 * 19. Generates fake credit card (test numbers only).
 *
 * @param {string} [type] - Card type (visa, mastercard, amex)
 * @returns {string} Fake card number
 *
 * @example
 * ```typescript
 * const card = generateFakeCreditCard('visa');
 * // Result: '4111111111111111'
 * ```
 */
export declare const generateFakeCreditCard: (type?: string) => string;
/**
 * 20. Generates fake JWT token (non-cryptographic).
 *
 * @param {any} payload - Token payload
 * @returns {string} Fake JWT
 *
 * @example
 * ```typescript
 * const token = generateFakeJWT({ userId: '123', role: 'admin' });
 * ```
 */
export declare const generateFakeJWT: (payload: any) => string;
/**
 * 21. Creates mock HTTP client with configurable responses.
 *
 * @param {Record<string, any>} [responses] - Response map by URL
 * @param {MockHttpOptions} [options] - HTTP options
 * @returns {any} Mock HTTP client
 *
 * @example
 * ```typescript
 * const httpClient = createMockHttpClient({
 *   '/api/users': { data: [{ id: 1 }] },
 *   '/api/posts': { data: [] }
 * });
 * ```
 */
export declare const createMockHttpClient: (responses?: Record<string, any>, options?: MockHttpOptions) => any;
/**
 * 22. Creates mock Axios instance.
 *
 * @param {Record<string, any>} [responses] - Response configuration
 * @returns {any} Mock Axios instance
 *
 * @example
 * ```typescript
 * const axios = createMockAxios({
 *   '/users': { data: [], status: 200 }
 * });
 * ```
 */
export declare const createMockAxios: (responses?: Record<string, any>) => any;
/**
 * 23. Creates mock fetch function.
 *
 * @param {Record<string, any>} [responses] - Response map
 * @returns {jest.Mock} Mock fetch function
 *
 * @example
 * ```typescript
 * const mockFetch = createMockFetch({
 *   '/api/data': { ok: true, json: async () => ({ data: 'test' }) }
 * });
 * global.fetch = mockFetch;
 * ```
 */
export declare const createMockFetch: (responses?: Record<string, any>) => jest.Mock;
/**
 * 24. Creates mock GraphQL client.
 *
 * @param {Record<string, any>} [queryResponses] - Responses by query name
 * @returns {any} Mock GraphQL client
 *
 * @example
 * ```typescript
 * const gqlClient = createMockGraphQLClient({
 *   GetUser: { user: { id: 1, name: 'John' } }
 * });
 * ```
 */
export declare const createMockGraphQLClient: (queryResponses?: Record<string, any>) => any;
/**
 * 25. Creates mock TypeORM repository.
 *
 * @template T
 * @param {T[]} [initialData] - Initial data
 * @param {MockDatabaseOptions} [options] - Database options
 * @returns {any} Mock repository
 *
 * @example
 * ```typescript
 * const userRepo = createMockTypeORMRepository<User>([
 *   { id: 1, name: 'John' },
 *   { id: 2, name: 'Jane' }
 * ]);
 * ```
 */
export declare const createMockTypeORMRepository: <T>(initialData?: T[], options?: MockDatabaseOptions) => any;
/**
 * 26. Creates mock Sequelize model.
 *
 * @template T
 * @param {T[]} [initialData] - Initial data
 * @returns {any} Mock Sequelize model
 *
 * @example
 * ```typescript
 * const UserModel = createMockSequelizeModel<User>([
 *   { id: 1, email: 'test@example.com' }
 * ]);
 * ```
 */
export declare const createMockSequelizeModel: <T>(initialData?: T[]) => any;
/**
 * 27. Creates mock MongoDB collection.
 *
 * @template T
 * @param {T[]} [initialData] - Initial data
 * @returns {any} Mock MongoDB collection
 *
 * @example
 * ```typescript
 * const usersCollection = createMockMongoCollection<User>([
 *   { _id: '123', name: 'John' }
 * ]);
 * ```
 */
export declare const createMockMongoCollection: <T>(initialData?: T[]) => any;
/**
 * 28. Creates mock email service.
 *
 * @returns {any} Mock email service
 *
 * @example
 * ```typescript
 * const emailService = createMockEmailService();
 * await emailService.send({ to: 'test@example.com', subject: 'Test' });
 * expect(emailService.send).toHaveBeenCalled();
 * ```
 */
export declare const createMockEmailService: () => any;
/**
 * 29. Creates mock SMS service.
 *
 * @returns {any} Mock SMS service
 *
 * @example
 * ```typescript
 * const smsService = createMockSMSService();
 * await smsService.sendSMS('+1234567890', 'Test message');
 * ```
 */
export declare const createMockSMSService: () => any;
/**
 * 30. Creates mock payment service.
 *
 * @returns {any} Mock payment service
 *
 * @example
 * ```typescript
 * const paymentService = createMockPaymentService();
 * const charge = await paymentService.charge({ amount: 1000, currency: 'USD' });
 * ```
 */
export declare const createMockPaymentService: () => any;
/**
 * 31. Creates mock storage service (S3-like).
 *
 * @returns {any} Mock storage service
 *
 * @example
 * ```typescript
 * const storage = createMockStorageService();
 * await storage.upload('bucket', 'key', Buffer.from('data'));
 * ```
 */
export declare const createMockStorageService: () => any;
/**
 * 32. Creates mock authentication service.
 *
 * @param {MockAuthOptions} [options] - Auth options
 * @returns {any} Mock auth service
 *
 * @example
 * ```typescript
 * const authService = createMockAuthService({ userId: '123', roles: ['admin'] });
 * const token = await authService.generateToken('123');
 * ```
 */
export declare const createMockAuthService: (options?: MockAuthOptions) => any;
/**
 * 33. Creates mock JWT service.
 *
 * @returns {any} Mock JWT service
 *
 * @example
 * ```typescript
 * const jwtService = createMockJWTService();
 * const token = jwtService.sign({ userId: '123' });
 * ```
 */
export declare const createMockJWTService: () => any;
/**
 * 34. Creates mock passport strategy.
 *
 * @param {any} [user] - Mock user to return
 * @returns {any} Mock passport strategy
 *
 * @example
 * ```typescript
 * const strategy = createMockPassportStrategy({ id: '123', email: 'test@example.com' });
 * ```
 */
export declare const createMockPassportStrategy: (user?: any) => any;
/**
 * 35. Creates mock file system.
 *
 * @param {MockFileSystemOptions} [options] - File system options
 * @returns {any} Mock file system
 *
 * @example
 * ```typescript
 * const fs = createMockFileSystem({
 *   initialFiles: { '/test.txt': 'content' }
 * });
 * const content = await fs.readFile('/test.txt');
 * ```
 */
export declare const createMockFileSystem: (options?: MockFileSystemOptions) => any;
/**
 * 36. Creates mock multer upload middleware.
 *
 * @returns {any} Mock multer instance
 *
 * @example
 * ```typescript
 * const upload = createMockMulterUpload();
 * const middleware = upload.single('file');
 * ```
 */
export declare const createMockMulterUpload: () => any;
/**
 * 37. Creates mock timer utilities.
 *
 * @param {MockTimeOptions} [options] - Timer options
 * @returns {{ now: () => Date; advance: (ms: number) => void; reset: () => void }} Mock timer
 *
 * @example
 * ```typescript
 * const timer = createMockTimer({ startTime: new Date('2024-01-01') });
 * timer.advance(86400000); // Advance 1 day
 * expect(timer.now()).toEqual(new Date('2024-01-02'));
 * ```
 */
export declare const createMockTimer: (options?: MockTimeOptions) => {
    now: () => Date;
    advance: (ms: number) => void;
    reset: () => void;
};
/**
 * 38. Freezes time at specific date.
 *
 * @param {Date} date - Date to freeze at
 * @returns {() => void} Restore function
 *
 * @example
 * ```typescript
 * const restore = freezeTime(new Date('2024-01-01'));
 * expect(new Date()).toEqual(new Date('2024-01-01'));
 * restore();
 * ```
 */
export declare const freezeTime: (date: Date) => (() => void);
/**
 * 39. Creates mock WebSocket server.
 *
 * @param {MockWebSocketOptions} [options] - WebSocket options
 * @returns {any} Mock WebSocket server
 *
 * @example
 * ```typescript
 * const wsServer = createMockWebSocketServer({ autoConnect: true });
 * wsServer.emit('message', { data: 'test' });
 * ```
 */
export declare const createMockWebSocketServer: (options?: MockWebSocketOptions) => any;
/**
 * 40. Creates mock WebSocket client.
 *
 * @returns {any} Mock WebSocket client
 *
 * @example
 * ```typescript
 * const wsClient = createMockWebSocketClient();
 * wsClient.send('test message');
 * expect(wsClient.send).toHaveBeenCalled();
 * ```
 */
export declare const createMockWebSocketClient: () => any;
/**
 * 41. Creates mock microservice client.
 *
 * @param {Record<string, any>} [patterns] - Response patterns
 * @returns {any} Mock microservice client
 *
 * @example
 * ```typescript
 * const client = createMockMicroserviceClient({
 *   'user.get': { id: 1, name: 'John' }
 * });
 * ```
 */
export declare const createMockMicroserviceClient: (patterns?: Record<string, any>) => any;
/**
 * 42. Creates mock message queue.
 *
 * @returns {any} Mock message queue
 *
 * @example
 * ```typescript
 * const queue = createMockMessageQueue();
 * await queue.publish('user.created', { userId: '123' });
 * ```
 */
export declare const createMockMessageQueue: () => any;
/**
 * 43. Creates mock event emitter.
 *
 * @param {MockEventOptions} [options] - Event emitter options
 * @returns {any} Mock event emitter
 *
 * @example
 * ```typescript
 * const emitter = createMockEventEmitter({ async: true });
 * emitter.on('test', handler);
 * emitter.emit('test', data);
 * ```
 */
export declare const createMockEventEmitter: (options?: MockEventOptions) => any;
/**
 * 44. Creates mock Express request object.
 *
 * @param {Partial<any>} [overrides] - Request overrides
 * @returns {any} Mock request
 *
 * @example
 * ```typescript
 * const req = createMockRequest({
 *   params: { id: '123' },
 *   body: { name: 'John' },
 *   user: { id: '456' }
 * });
 * ```
 */
export declare const createMockRequest: (overrides?: Partial<any>) => any;
/**
 * 45. Creates mock Express response object.
 *
 * @returns {any} Mock response
 *
 * @example
 * ```typescript
 * const res = createMockResponse();
 * res.status(200).json({ data: 'test' });
 * expect(res.status).toHaveBeenCalledWith(200);
 * ```
 */
export declare const createMockResponse: () => any;
declare const _default: {
    createMockFunction: (options?: MockFunctionOptions) => jest.Mock;
    createAsyncMock: (resolvedValue?: any, delay?: number) => jest.Mock;
    createRejectingMock: (error: Error | string, delay?: number) => jest.Mock;
    createSequentialMock: (values: any[]) => jest.Mock;
    createAlternatingMock: (successValue: any, failureError: Error) => jest.Mock;
    createConditionalMock: (condition: (args: any[]) => any) => jest.Mock;
    createSpy: (object: any, method: string, options?: SpyOptions) => jest.SpyInstance;
    createMultipleSpies: (object: any, methods: string[]) => Record<string, jest.SpyInstance>;
    createOrderTrackingSpy: (object: any, methods: string[]) => {
        spies: Record<string, jest.SpyInstance>;
        getCallOrder: () => string[];
    };
    restoreSpies: (spies: Record<string, jest.SpyInstance>) => void;
    createStub: (options: StubOptions) => jest.Mock;
    createPropertyStub: (object: any, property: string, value: any) => jest.SpyInstance[];
    createCountingStub: (implementation?: (...args: any[]) => any) => {
        stub: jest.Mock;
        getCount: () => number;
        reset: () => void;
    };
    generateFakeEmail: (prefix?: string) => string;
    generateFakeUUID: () => string;
    generateFakeDate: (start?: Date, end?: Date) => Date;
    generateFakePhone: (format?: string) => string;
    generateFakeAddress: () => any;
    generateFakeCreditCard: (type?: string) => string;
    generateFakeJWT: (payload: any) => string;
    createMockHttpClient: (responses?: Record<string, any>, options?: MockHttpOptions) => any;
    createMockAxios: (responses?: Record<string, any>) => any;
    createMockFetch: (responses?: Record<string, any>) => jest.Mock;
    createMockGraphQLClient: (queryResponses?: Record<string, any>) => any;
    createMockTypeORMRepository: <T>(initialData?: T[], options?: MockDatabaseOptions) => any;
    createMockSequelizeModel: <T>(initialData?: T[]) => any;
    createMockMongoCollection: <T>(initialData?: T[]) => any;
    createMockEmailService: () => any;
    createMockSMSService: () => any;
    createMockPaymentService: () => any;
    createMockStorageService: () => any;
    createMockAuthService: (options?: MockAuthOptions) => any;
    createMockJWTService: () => any;
    createMockPassportStrategy: (user?: any) => any;
    createMockFileSystem: (options?: MockFileSystemOptions) => any;
    createMockMulterUpload: () => any;
    createMockTimer: (options?: MockTimeOptions) => {
        now: () => Date;
        advance: (ms: number) => void;
        reset: () => void;
    };
    freezeTime: (date: Date) => (() => void);
    createMockWebSocketServer: (options?: MockWebSocketOptions) => any;
    createMockWebSocketClient: () => any;
    createMockMicroserviceClient: (patterns?: Record<string, any>) => any;
    createMockMessageQueue: () => any;
    createMockEventEmitter: (options?: MockEventOptions) => any;
    createMockRequest: (overrides?: Partial<any>) => any;
    createMockResponse: () => any;
};
export default _default;
//# sourceMappingURL=mocking-kit.d.ts.map