"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMockResponse = exports.createMockRequest = exports.createMockEventEmitter = exports.createMockMessageQueue = exports.createMockMicroserviceClient = exports.createMockWebSocketClient = exports.createMockWebSocketServer = exports.freezeTime = exports.createMockTimer = exports.createMockMulterUpload = exports.createMockFileSystem = exports.createMockPassportStrategy = exports.createMockJWTService = exports.createMockAuthService = exports.createMockStorageService = exports.createMockPaymentService = exports.createMockSMSService = exports.createMockEmailService = exports.createMockMongoCollection = exports.createMockSequelizeModel = exports.createMockTypeORMRepository = exports.createMockGraphQLClient = exports.createMockFetch = exports.createMockAxios = exports.createMockHttpClient = exports.generateFakeJWT = exports.generateFakeCreditCard = exports.generateFakeAddress = exports.generateFakePhone = exports.generateFakeDate = exports.generateFakeUUID = exports.generateFakeEmail = exports.createCountingStub = exports.createPropertyStub = exports.createStub = exports.restoreSpies = exports.createOrderTrackingSpy = exports.createMultipleSpies = exports.createSpy = exports.createConditionalMock = exports.createAlternatingMock = exports.createSequentialMock = exports.createRejectingMock = exports.createAsyncMock = exports.createMockFunction = void 0;
/**
 * File: /reuse/mocking-kit.ts
 * Locator: WC-UTL-MOCK-001
 * Purpose: Comprehensive Mocking Utilities - Mock builders, spies, stubs, fakes, HTTP/DB/service mocks
 *
 * Upstream: Independent utility module for mocking infrastructure
 * Downstream: ../backend/**/ 
    * .spec.ts, .. / test; /**, unit and integration tests
* Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Jest 29.x, @nestjs/testing
* Exports: 45 utility functions for mock functions, spies, stubs, fake data, HTTP/DB/service mocks, authentication
*
* LLM Context: Comprehensive mocking utilities for NestJS testing in White Cross healthcare platform.
* Provides mock function builders, spy utilities, stub generators, fake data factories, mock HTTP clients,
* mock database repositories, mock external services, mock authentication, mock file systems, mock time/date,
* mock WebSocket connections, mock microservice clients, mock event emitters, request/response mocks,
* and mock validation pipes. Essential for creating isolated, fast, and reliable unit tests.
*/
// ============================================================================
// MOCK FUNCTION BUILDERS
// ============================================================================
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
const createMockFunction = (options = {}) => {
    const mock = jest.fn();
    if (options.mockName) {
        mock.mockName(options.mockName);
    }
    if (options.implementation) {
        mock.mockImplementation(options.implementation);
    }
    else if (options.returnValues) {
        options.returnValues.forEach((value) => mock.mockReturnValueOnce(value));
    }
    else if (options.returnValue !== undefined) {
        mock.mockReturnValue(options.returnValue);
    }
    if (options.throwError) {
        mock.mockImplementation(() => {
            throw options.throwError;
        });
    }
    return mock;
};
exports.createMockFunction = createMockFunction;
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
const createAsyncMock = (resolvedValue, delay = 0) => {
    return jest.fn().mockImplementation(() => new Promise((resolve) => {
        setTimeout(() => resolve(resolvedValue), delay);
    }));
};
exports.createAsyncMock = createAsyncMock;
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
const createRejectingMock = (error, delay = 0) => {
    const errorObj = typeof error === 'string' ? new Error(error) : error;
    return jest.fn().mockImplementation(() => new Promise((_, reject) => {
        setTimeout(() => reject(errorObj), delay);
    }));
};
exports.createRejectingMock = createRejectingMock;
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
const createSequentialMock = (values) => {
    const mock = jest.fn();
    values.forEach((value) => mock.mockReturnValueOnce(value));
    return mock;
};
exports.createSequentialMock = createSequentialMock;
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
const createAlternatingMock = (successValue, failureError) => {
    let callCount = 0;
    return jest.fn().mockImplementation(() => {
        callCount++;
        if (callCount % 2 === 1)
            return successValue;
        throw failureError;
    });
};
exports.createAlternatingMock = createAlternatingMock;
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
const createConditionalMock = (condition) => {
    return jest.fn().mockImplementation((...args) => condition(args));
};
exports.createConditionalMock = createConditionalMock;
// ============================================================================
// SPY UTILITIES
// ============================================================================
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
const createSpy = (object, method, options = {}) => {
    const spy = jest.spyOn(object, method);
    if (options.mockImplementation) {
        spy.mockImplementation(options.mockImplementation);
    }
    else if (!options.callThrough) {
        spy.mockImplementation(() => undefined);
    }
    return spy;
};
exports.createSpy = createSpy;
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
const createMultipleSpies = (object, methods) => {
    const spies = {};
    methods.forEach((method) => {
        spies[method] = jest.spyOn(object, method);
    });
    return spies;
};
exports.createMultipleSpies = createMultipleSpies;
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
const createOrderTrackingSpy = (object, methods) => {
    const callOrder = [];
    const spies = {};
    methods.forEach((method) => {
        spies[method] = jest.spyOn(object, method).mockImplementation((...args) => {
            callOrder.push(method);
            return undefined;
        });
    });
    return {
        spies,
        getCallOrder: () => [...callOrder],
    };
};
exports.createOrderTrackingSpy = createOrderTrackingSpy;
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
const restoreSpies = (spies) => {
    Object.values(spies).forEach((spy) => spy.mockRestore());
};
exports.restoreSpies = restoreSpies;
// ============================================================================
// STUB GENERATORS
// ============================================================================
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
const createStub = (options) => {
    const stub = jest.fn();
    if (options.returnOnce) {
        options.returnOnce.forEach((value) => stub.mockReturnValueOnce(value));
    }
    if (options.alwaysReturn !== undefined) {
        stub.mockReturnValue(options.alwaysReturn);
    }
    if (options.throwOnCall !== undefined) {
        const throwOnCall = options.throwOnCall;
        stub.mockImplementation(function () {
            if (stub.mock.calls.length === throwOnCall) {
                throw new Error('Stub error');
            }
            return options.alwaysReturn;
        });
    }
    return stub;
};
exports.createStub = createStub;
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
const createPropertyStub = (object, property, value) => {
    let currentValue = value;
    const getter = jest.spyOn(object, property, 'get').mockImplementation(() => currentValue);
    const setter = jest.spyOn(object, property, 'set').mockImplementation((val) => {
        currentValue = val;
    });
    return [getter, setter];
};
exports.createPropertyStub = createPropertyStub;
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
const createCountingStub = (implementation) => {
    const stub = jest.fn(implementation);
    return {
        stub,
        getCount: () => stub.mock.calls.length,
        reset: () => stub.mockClear(),
    };
};
exports.createCountingStub = createCountingStub;
// ============================================================================
// FAKE DATA FACTORIES
// ============================================================================
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
const generateFakeEmail = (prefix = 'user') => {
    const timestamp = Date.now();
    return `${prefix}.${timestamp}@example.com`;
};
exports.generateFakeEmail = generateFakeEmail;
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
const generateFakeUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};
exports.generateFakeUUID = generateFakeUUID;
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
const generateFakeDate = (start, end) => {
    const startTime = start?.getTime() || Date.now() - 365 * 24 * 60 * 60 * 1000;
    const endTime = end?.getTime() || Date.now();
    return new Date(startTime + Math.random() * (endTime - startTime));
};
exports.generateFakeDate = generateFakeDate;
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
const generateFakePhone = (format = '###-###-####') => {
    return format.replace(/#/g, () => Math.floor(Math.random() * 10).toString());
};
exports.generateFakePhone = generateFakePhone;
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
const generateFakeAddress = () => {
    return {
        street: `${Math.floor(Math.random() * 9999)} Main St`,
        city: 'Test City',
        state: 'TS',
        zipCode: (0, exports.generateFakePhone)('#####'),
        country: 'USA',
    };
};
exports.generateFakeAddress = generateFakeAddress;
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
const generateFakeCreditCard = (type = 'visa') => {
    const cards = {
        visa: '4111111111111111',
        mastercard: '5555555555554444',
        amex: '378282246310005',
    };
    return cards[type] || cards.visa;
};
exports.generateFakeCreditCard = generateFakeCreditCard;
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
const generateFakeJWT = (payload) => {
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64');
    const body = Buffer.from(JSON.stringify(payload)).toString('base64');
    const signature = 'fake-signature';
    return `${header}.${body}.${signature}`;
};
exports.generateFakeJWT = generateFakeJWT;
// ============================================================================
// MOCK HTTP CLIENTS
// ============================================================================
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
const createMockHttpClient = (responses = {}, options = {}) => {
    return {
        get: jest.fn((url) => Promise.resolve({ data: responses[url] || null })),
        post: jest.fn((url, data) => Promise.resolve({ data, status: 201 })),
        put: jest.fn((url, data) => Promise.resolve({ data, status: 200 })),
        patch: jest.fn((url, data) => Promise.resolve({ data, status: 200 })),
        delete: jest.fn(() => Promise.resolve({ status: 204 })),
        request: jest.fn(() => Promise.resolve({ data: null })),
    };
};
exports.createMockHttpClient = createMockHttpClient;
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
const createMockAxios = (responses = {}) => {
    const instance = (0, exports.createMockHttpClient)(responses);
    instance.defaults = { headers: {} };
    instance.interceptors = {
        request: { use: jest.fn(), eject: jest.fn() },
        response: { use: jest.fn(), eject: jest.fn() },
    };
    return instance;
};
exports.createMockAxios = createMockAxios;
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
const createMockFetch = (responses = {}) => {
    return jest.fn((url) => {
        const response = responses[url] || { ok: true, json: async () => ({}) };
        return Promise.resolve(response);
    });
};
exports.createMockFetch = createMockFetch;
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
const createMockGraphQLClient = (queryResponses = {}) => {
    return {
        query: jest.fn(({ query }) => {
            const queryName = query?.definitions?.[0]?.name?.value || 'unknown';
            return Promise.resolve({ data: queryResponses[queryName] || {} });
        }),
        mutate: jest.fn(() => Promise.resolve({ data: {} })),
    };
};
exports.createMockGraphQLClient = createMockGraphQLClient;
// ============================================================================
// MOCK DATABASE REPOSITORIES
// ============================================================================
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
const createMockTypeORMRepository = (initialData = [], options = {}) => {
    let data = [...initialData];
    let idCounter = initialData.length;
    return {
        find: jest.fn(async () => [...data]),
        findOne: jest.fn(async ({ where }) => {
            return data.find((item) => {
                return Object.keys(where).every((key) => item[key] === where[key]);
            });
        }),
        findOneBy: jest.fn(async (where) => {
            return data.find((item) => {
                return Object.keys(where).every((key) => item[key] === where[key]);
            });
        }),
        create: jest.fn((entity) => ({ id: ++idCounter, ...entity })),
        save: jest.fn(async (entity) => {
            const existing = data.find((item) => item.id === entity.id);
            if (existing) {
                Object.assign(existing, entity);
                return existing;
            }
            const newEntity = { id: entity.id || ++idCounter, ...entity };
            data.push(newEntity);
            return newEntity;
        }),
        update: jest.fn(async (criteria, entity) => {
            const updated = data.filter((item) => item.id === criteria);
            updated.forEach((item) => Object.assign(item, entity));
            return { affected: updated.length };
        }),
        delete: jest.fn(async (criteria) => {
            const initialLength = data.length;
            data = data.filter((item) => item.id !== criteria);
            return { affected: initialLength - data.length };
        }),
        count: jest.fn(async () => data.length),
        clear: jest.fn(async () => {
            data = [];
        }),
    };
};
exports.createMockTypeORMRepository = createMockTypeORMRepository;
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
const createMockSequelizeModel = (initialData = []) => {
    let data = [...initialData];
    return {
        findAll: jest.fn(async () => [...data]),
        findOne: jest.fn(async ({ where }) => {
            return data.find((item) => {
                return Object.keys(where).every((key) => item[key] === where[key]);
            });
        }),
        findByPk: jest.fn(async (id) => data.find((item) => item.id === id)),
        create: jest.fn(async (values) => {
            const newItem = { id: data.length + 1, ...values };
            data.push(newItem);
            return newItem;
        }),
        update: jest.fn(async (values, { where }) => {
            let affected = 0;
            data.forEach((item) => {
                if (Object.keys(where).every((key) => item[key] === where[key])) {
                    Object.assign(item, values);
                    affected++;
                }
            });
            return [affected];
        }),
        destroy: jest.fn(async ({ where }) => {
            const initialLength = data.length;
            data = data.filter((item) => {
                return !Object.keys(where).every((key) => item[key] === where[key]);
            });
            return initialLength - data.length;
        }),
    };
};
exports.createMockSequelizeModel = createMockSequelizeModel;
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
const createMockMongoCollection = (initialData = []) => {
    let data = [...initialData];
    return {
        find: jest.fn(() => ({
            toArray: async () => [...data],
            limit: jest.fn(() => ({ toArray: async () => [...data] })),
            skip: jest.fn(() => ({ toArray: async () => [...data] })),
        })),
        findOne: jest.fn(async (query) => {
            return data.find((item) => {
                return Object.keys(query).every((key) => item[key] === query[key]);
            });
        }),
        insertOne: jest.fn(async (doc) => {
            const newDoc = { _id: (0, exports.generateFakeUUID)(), ...doc };
            data.push(newDoc);
            return { insertedId: newDoc._id };
        }),
        updateOne: jest.fn(async (filter, update) => {
            const item = data.find((item) => {
                return Object.keys(filter).every((key) => item[key] === filter[key]);
            });
            if (item) {
                Object.assign(item, update.$set || {});
                return { modifiedCount: 1 };
            }
            return { modifiedCount: 0 };
        }),
        deleteOne: jest.fn(async (filter) => {
            const initialLength = data.length;
            data = data.filter((item) => {
                return !Object.keys(filter).every((key) => item[key] === filter[key]);
            });
            return { deletedCount: initialLength - data.length };
        }),
    };
};
exports.createMockMongoCollection = createMockMongoCollection;
// ============================================================================
// MOCK EXTERNAL SERVICES
// ============================================================================
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
const createMockEmailService = () => {
    return {
        send: jest.fn().mockResolvedValue({ messageId: 'mock-id' }),
        sendBulk: jest.fn().mockResolvedValue({ sent: 0, failed: 0 }),
        verifyEmail: jest.fn().mockResolvedValue(true),
    };
};
exports.createMockEmailService = createMockEmailService;
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
const createMockSMSService = () => {
    return {
        sendSMS: jest.fn().mockResolvedValue({ sid: 'mock-sid', status: 'sent' }),
        verifyPhone: jest.fn().mockResolvedValue(true),
    };
};
exports.createMockSMSService = createMockSMSService;
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
const createMockPaymentService = () => {
    return {
        charge: jest.fn().mockResolvedValue({ id: 'ch_mock', status: 'succeeded' }),
        refund: jest.fn().mockResolvedValue({ id: 'ref_mock', status: 'succeeded' }),
        createCustomer: jest.fn().mockResolvedValue({ id: 'cus_mock' }),
    };
};
exports.createMockPaymentService = createMockPaymentService;
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
const createMockStorageService = () => {
    const files = new Map();
    return {
        upload: jest.fn(async (bucket, key, data) => {
            files.set(`${bucket}/${key}`, data);
            return { location: `https://mock-s3.com/${bucket}/${key}` };
        }),
        download: jest.fn(async (bucket, key) => {
            return files.get(`${bucket}/${key}`);
        }),
        delete: jest.fn(async (bucket, key) => {
            files.delete(`${bucket}/${key}`);
        }),
    };
};
exports.createMockStorageService = createMockStorageService;
// ============================================================================
// MOCK AUTHENTICATION
// ============================================================================
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
const createMockAuthService = (options = {}) => {
    return {
        generateToken: jest.fn().mockResolvedValue((0, exports.generateFakeJWT)({
            userId: options.userId || '123',
            roles: options.roles || ['user'],
        })),
        verifyToken: jest.fn().mockResolvedValue({
            userId: options.userId || '123',
            roles: options.roles || ['user'],
            permissions: options.permissions || [],
        }),
        hashPassword: jest.fn().mockResolvedValue('$2b$10$mock.hashed.password'),
        comparePassword: jest.fn().mockResolvedValue(true),
    };
};
exports.createMockAuthService = createMockAuthService;
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
const createMockJWTService = () => {
    return {
        sign: jest.fn((payload) => (0, exports.generateFakeJWT)(payload)),
        verify: jest.fn((token) => {
            const parts = token.split('.');
            if (parts.length !== 3)
                throw new Error('Invalid token');
            return JSON.parse(Buffer.from(parts[1], 'base64').toString());
        }),
        decode: jest.fn((token) => {
            const parts = token.split('.');
            return JSON.parse(Buffer.from(parts[1], 'base64').toString());
        }),
    };
};
exports.createMockJWTService = createMockJWTService;
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
const createMockPassportStrategy = (user) => {
    return {
        authenticate: jest.fn((req, options) => {
            if (user) {
                return { success: user };
            }
            return { fail: 'Unauthorized' };
        }),
        validate: jest.fn().mockResolvedValue(user || null),
    };
};
exports.createMockPassportStrategy = createMockPassportStrategy;
// ============================================================================
// MOCK FILE SYSTEMS
// ============================================================================
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
const createMockFileSystem = (options = {}) => {
    const files = new Map(Object.entries(options.initialFiles || {}));
    return {
        readFile: jest.fn(async (path) => {
            if (!files.has(path))
                throw new Error('File not found');
            return files.get(path);
        }),
        writeFile: jest.fn(async (path, content) => {
            if (options.readOnly)
                throw new Error('Read-only file system');
            files.set(path, content);
        }),
        unlink: jest.fn(async (path) => {
            if (options.readOnly)
                throw new Error('Read-only file system');
            files.delete(path);
        }),
        exists: jest.fn(async (path) => files.has(path)),
        readdir: jest.fn(async () => Array.from(files.keys())),
    };
};
exports.createMockFileSystem = createMockFileSystem;
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
const createMockMulterUpload = () => {
    return {
        single: jest.fn((fieldName) => {
            return (req, res, next) => {
                req.file = {
                    fieldname: fieldName,
                    originalname: 'test.txt',
                    encoding: '7bit',
                    mimetype: 'text/plain',
                    size: 1024,
                    buffer: Buffer.from('test content'),
                };
                next();
            };
        }),
        array: jest.fn(() => (req, res, next) => {
            req.files = [];
            next();
        }),
    };
};
exports.createMockMulterUpload = createMockMulterUpload;
// ============================================================================
// MOCK TIME/DATE UTILITIES
// ============================================================================
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
const createMockTimer = (options = {}) => {
    let currentTime = options.startTime?.getTime() || Date.now();
    return {
        now: () => new Date(currentTime),
        advance: (ms) => {
            currentTime += ms;
        },
        reset: () => {
            currentTime = options.startTime?.getTime() || Date.now();
        },
    };
};
exports.createMockTimer = createMockTimer;
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
const freezeTime = (date) => {
    const originalDate = Date;
    const frozenTime = date.getTime();
    global.Date = class extends Date {
        constructor(...args) {
            if (args.length === 0) {
                super(frozenTime);
            }
            else {
                super(...args);
            }
        }
        static now() {
            return frozenTime;
        }
    };
    return () => {
        global.Date = originalDate;
    };
};
exports.freezeTime = freezeTime;
// ============================================================================
// MOCK WEBSOCKET CONNECTIONS
// ============================================================================
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
const createMockWebSocketServer = (options = {}) => {
    const clients = new Set();
    return {
        on: jest.fn(),
        emit: jest.fn((event, data) => {
            clients.forEach((client) => client.emit(event, data));
        }),
        close: jest.fn(() => {
            clients.clear();
        }),
        clients,
    };
};
exports.createMockWebSocketServer = createMockWebSocketServer;
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
const createMockWebSocketClient = () => {
    const listeners = new Map();
    return {
        send: jest.fn(),
        on: jest.fn((event, handler) => {
            if (!listeners.has(event))
                listeners.set(event, []);
            listeners.get(event)?.push(handler);
        }),
        emit: jest.fn((event, data) => {
            listeners.get(event)?.forEach((handler) => handler(data));
        }),
        close: jest.fn(),
    };
};
exports.createMockWebSocketClient = createMockWebSocketClient;
// ============================================================================
// MOCK MICROSERVICE CLIENTS
// ============================================================================
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
const createMockMicroserviceClient = (patterns = {}) => {
    return {
        send: jest.fn((pattern, data) => {
            return Promise.resolve(patterns[pattern] || null);
        }),
        emit: jest.fn(() => Promise.resolve()),
    };
};
exports.createMockMicroserviceClient = createMockMicroserviceClient;
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
const createMockMessageQueue = () => {
    const messages = [];
    return {
        publish: jest.fn(async (pattern, data) => {
            messages.push({ pattern, data, timestamp: Date.now() });
        }),
        subscribe: jest.fn((pattern, handler) => {
            return jest.fn();
        }),
        getMessages: () => [...messages],
        clear: () => {
            messages.length = 0;
        },
    };
};
exports.createMockMessageQueue = createMockMessageQueue;
// ============================================================================
// MOCK EVENT EMITTERS
// ============================================================================
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
const createMockEventEmitter = (options = {}) => {
    const listeners = new Map();
    return {
        on: jest.fn((event, handler) => {
            if (!listeners.has(event))
                listeners.set(event, []);
            listeners.get(event)?.push(handler);
        }),
        emit: jest.fn((event, ...args) => {
            const handlers = listeners.get(event) || [];
            if (options.async) {
                handlers.forEach((handler) => setTimeout(() => handler(...args), 0));
            }
            else {
                handlers.forEach((handler) => handler(...args));
            }
            return handlers.length > 0;
        }),
        removeListener: jest.fn((event, handler) => {
            const handlers = listeners.get(event) || [];
            const index = handlers.indexOf(handler);
            if (index > -1)
                handlers.splice(index, 1);
        }),
        removeAllListeners: jest.fn((event) => {
            if (event) {
                listeners.delete(event);
            }
            else {
                listeners.clear();
            }
        }),
    };
};
exports.createMockEventEmitter = createMockEventEmitter;
// ============================================================================
// REQUEST/RESPONSE MOCKS
// ============================================================================
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
const createMockRequest = (overrides = {}) => {
    return {
        params: {},
        query: {},
        body: {},
        headers: {},
        cookies: {},
        method: 'GET',
        url: '/',
        path: '/',
        ...overrides,
    };
};
exports.createMockRequest = createMockRequest;
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
const createMockResponse = () => {
    const res = {
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
};
exports.createMockResponse = createMockResponse;
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Mock function builders
    createMockFunction: exports.createMockFunction,
    createAsyncMock: exports.createAsyncMock,
    createRejectingMock: exports.createRejectingMock,
    createSequentialMock: exports.createSequentialMock,
    createAlternatingMock: exports.createAlternatingMock,
    createConditionalMock: exports.createConditionalMock,
    // Spy utilities
    createSpy: exports.createSpy,
    createMultipleSpies: exports.createMultipleSpies,
    createOrderTrackingSpy: exports.createOrderTrackingSpy,
    restoreSpies: exports.restoreSpies,
    // Stub generators
    createStub: exports.createStub,
    createPropertyStub: exports.createPropertyStub,
    createCountingStub: exports.createCountingStub,
    // Fake data factories
    generateFakeEmail: exports.generateFakeEmail,
    generateFakeUUID: exports.generateFakeUUID,
    generateFakeDate: exports.generateFakeDate,
    generateFakePhone: exports.generateFakePhone,
    generateFakeAddress: exports.generateFakeAddress,
    generateFakeCreditCard: exports.generateFakeCreditCard,
    generateFakeJWT: exports.generateFakeJWT,
    // Mock HTTP clients
    createMockHttpClient: exports.createMockHttpClient,
    createMockAxios: exports.createMockAxios,
    createMockFetch: exports.createMockFetch,
    createMockGraphQLClient: exports.createMockGraphQLClient,
    // Mock database repositories
    createMockTypeORMRepository: exports.createMockTypeORMRepository,
    createMockSequelizeModel: exports.createMockSequelizeModel,
    createMockMongoCollection: exports.createMockMongoCollection,
    // Mock external services
    createMockEmailService: exports.createMockEmailService,
    createMockSMSService: exports.createMockSMSService,
    createMockPaymentService: exports.createMockPaymentService,
    createMockStorageService: exports.createMockStorageService,
    // Mock authentication
    createMockAuthService: exports.createMockAuthService,
    createMockJWTService: exports.createMockJWTService,
    createMockPassportStrategy: exports.createMockPassportStrategy,
    // Mock file systems
    createMockFileSystem: exports.createMockFileSystem,
    createMockMulterUpload: exports.createMockMulterUpload,
    // Mock time/date utilities
    createMockTimer: exports.createMockTimer,
    freezeTime: exports.freezeTime,
    // Mock WebSocket connections
    createMockWebSocketServer: exports.createMockWebSocketServer,
    createMockWebSocketClient: exports.createMockWebSocketClient,
    // Mock microservice clients
    createMockMicroserviceClient: exports.createMockMicroserviceClient,
    createMockMessageQueue: exports.createMockMessageQueue,
    // Mock event emitters
    createMockEventEmitter: exports.createMockEventEmitter,
    // Request/response mocks
    createMockRequest: exports.createMockRequest,
    createMockResponse: exports.createMockResponse,
};
//# sourceMappingURL=mocking-kit.js.map