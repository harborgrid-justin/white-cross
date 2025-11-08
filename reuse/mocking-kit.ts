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

/**
 * File: /reuse/mocking-kit.ts
 * Locator: WC-UTL-MOCK-001
 * Purpose: Comprehensive Mocking Utilities - Mock builders, spies, stubs, fakes, HTTP/DB/service mocks
 *
 * Upstream: Independent utility module for mocking infrastructure
 * Downstream: ../backend/**/*.spec.ts, ../test/**, unit and integration tests
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
// TYPE DEFINITIONS
// ============================================================================

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

interface FakeDataOptions {
  locale?: string;
  seed?: number;
  count?: number;
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
export const createMockFunction = (options: MockFunctionOptions = {}): jest.Mock => {
  const mock = jest.fn();

  if (options.mockName) {
    mock.mockName(options.mockName);
  }

  if (options.implementation) {
    mock.mockImplementation(options.implementation);
  } else if (options.returnValues) {
    options.returnValues.forEach((value) => mock.mockReturnValueOnce(value));
  } else if (options.returnValue !== undefined) {
    mock.mockReturnValue(options.returnValue);
  }

  if (options.throwError) {
    mock.mockImplementation(() => {
      throw options.throwError;
    });
  }

  return mock;
};

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
export const createAsyncMock = (resolvedValue?: any, delay: number = 0): jest.Mock => {
  return jest.fn().mockImplementation(
    () =>
      new Promise((resolve) => {
        setTimeout(() => resolve(resolvedValue), delay);
      }),
  );
};

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
export const createRejectingMock = (error: Error | string, delay: number = 0): jest.Mock => {
  const errorObj = typeof error === 'string' ? new Error(error) : error;
  return jest.fn().mockImplementation(
    () =>
      new Promise((_, reject) => {
        setTimeout(() => reject(errorObj), delay);
      }),
  );
};

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
export const createSequentialMock = (values: any[]): jest.Mock => {
  const mock = jest.fn();
  values.forEach((value) => mock.mockReturnValueOnce(value));
  return mock;
};

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
export const createAlternatingMock = (successValue: any, failureError: Error): jest.Mock => {
  let callCount = 0;
  return jest.fn().mockImplementation(() => {
    callCount++;
    if (callCount % 2 === 1) return successValue;
    throw failureError;
  });
};

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
export const createConditionalMock = (condition: (args: any[]) => any): jest.Mock => {
  return jest.fn().mockImplementation((...args) => condition(args));
};

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
export const createSpy = (object: any, method: string, options: SpyOptions = {}): jest.SpyInstance => {
  const spy = jest.spyOn(object, method);

  if (options.mockImplementation) {
    spy.mockImplementation(options.mockImplementation);
  } else if (!options.callThrough) {
    spy.mockImplementation(() => undefined);
  }

  return spy;
};

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
export const createMultipleSpies = (object: any, methods: string[]): Record<string, jest.SpyInstance> => {
  const spies: Record<string, jest.SpyInstance> = {};
  methods.forEach((method) => {
    spies[method] = jest.spyOn(object, method);
  });
  return spies;
};

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
export const createOrderTrackingSpy = (
  object: any,
  methods: string[],
): { spies: Record<string, jest.SpyInstance>; getCallOrder: () => string[] } => {
  const callOrder: string[] = [];
  const spies: Record<string, jest.SpyInstance> = {};

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
export const restoreSpies = (spies: Record<string, jest.SpyInstance>): void => {
  Object.values(spies).forEach((spy) => spy.mockRestore());
};

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
export const createStub = (options: StubOptions): jest.Mock => {
  const stub = jest.fn();

  if (options.returnOnce) {
    options.returnOnce.forEach((value) => stub.mockReturnValueOnce(value));
  }

  if (options.alwaysReturn !== undefined) {
    stub.mockReturnValue(options.alwaysReturn);
  }

  if (options.throwOnCall !== undefined) {
    const throwOnCall = options.throwOnCall;
    stub.mockImplementation(function (this: any) {
      if (stub.mock.calls.length === throwOnCall) {
        throw new Error('Stub error');
      }
      return options.alwaysReturn;
    });
  }

  return stub;
};

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
export const createPropertyStub = (object: any, property: string, value: any): jest.SpyInstance[] => {
  let currentValue = value;
  const getter = jest.spyOn(object, property, 'get').mockImplementation(() => currentValue);
  const setter = jest.spyOn(object, property, 'set').mockImplementation((val) => {
    currentValue = val;
  });
  return [getter, setter];
};

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
export const createCountingStub = (
  implementation?: (...args: any[]) => any,
): { stub: jest.Mock; getCount: () => number; reset: () => void } => {
  const stub = jest.fn(implementation);
  return {
    stub,
    getCount: () => stub.mock.calls.length,
    reset: () => stub.mockClear(),
  };
};

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
export const generateFakeEmail = (prefix: string = 'user'): string => {
  const timestamp = Date.now();
  return `${prefix}.${timestamp}@example.com`;
};

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
export const generateFakeUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

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
export const generateFakeDate = (start?: Date, end?: Date): Date => {
  const startTime = start?.getTime() || Date.now() - 365 * 24 * 60 * 60 * 1000;
  const endTime = end?.getTime() || Date.now();
  return new Date(startTime + Math.random() * (endTime - startTime));
};

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
export const generateFakePhone = (format: string = '###-###-####'): string => {
  return format.replace(/#/g, () => Math.floor(Math.random() * 10).toString());
};

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
export const generateFakeAddress = (): any => {
  return {
    street: `${Math.floor(Math.random() * 9999)} Main St`,
    city: 'Test City',
    state: 'TS',
    zipCode: generateFakePhone('#####'),
    country: 'USA',
  };
};

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
export const generateFakeCreditCard = (type: string = 'visa'): string => {
  const cards = {
    visa: '4111111111111111',
    mastercard: '5555555555554444',
    amex: '378282246310005',
  };
  return cards[type as keyof typeof cards] || cards.visa;
};

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
export const generateFakeJWT = (payload: any): string => {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64');
  const body = Buffer.from(JSON.stringify(payload)).toString('base64');
  const signature = 'fake-signature';
  return `${header}.${body}.${signature}`;
};

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
export const createMockHttpClient = (
  responses: Record<string, any> = {},
  options: MockHttpOptions = {},
): any => {
  return {
    get: jest.fn((url: string) => Promise.resolve({ data: responses[url] || null })),
    post: jest.fn((url: string, data: any) => Promise.resolve({ data, status: 201 })),
    put: jest.fn((url: string, data: any) => Promise.resolve({ data, status: 200 })),
    patch: jest.fn((url: string, data: any) => Promise.resolve({ data, status: 200 })),
    delete: jest.fn(() => Promise.resolve({ status: 204 })),
    request: jest.fn(() => Promise.resolve({ data: null })),
  };
};

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
export const createMockAxios = (responses: Record<string, any> = {}): any => {
  const instance = createMockHttpClient(responses);
  instance.defaults = { headers: {} };
  instance.interceptors = {
    request: { use: jest.fn(), eject: jest.fn() },
    response: { use: jest.fn(), eject: jest.fn() },
  };
  return instance;
};

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
export const createMockFetch = (responses: Record<string, any> = {}): jest.Mock => {
  return jest.fn((url: string) => {
    const response = responses[url] || { ok: true, json: async () => ({}) };
    return Promise.resolve(response);
  });
};

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
export const createMockGraphQLClient = (queryResponses: Record<string, any> = {}): any => {
  return {
    query: jest.fn(({ query }) => {
      const queryName = query?.definitions?.[0]?.name?.value || 'unknown';
      return Promise.resolve({ data: queryResponses[queryName] || {} });
    }),
    mutate: jest.fn(() => Promise.resolve({ data: {} })),
  };
};

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
export const createMockTypeORMRepository = <T>(
  initialData: T[] = [],
  options: MockDatabaseOptions = {},
): any => {
  let data = [...initialData];
  let idCounter = initialData.length;

  return {
    find: jest.fn(async () => [...data]),
    findOne: jest.fn(async ({ where }: any) => {
      return data.find((item: any) => {
        return Object.keys(where).every((key) => item[key] === where[key]);
      });
    }),
    findOneBy: jest.fn(async (where: any) => {
      return data.find((item: any) => {
        return Object.keys(where).every((key) => item[key] === where[key]);
      });
    }),
    create: jest.fn((entity: Partial<T>) => ({ id: ++idCounter, ...entity })),
    save: jest.fn(async (entity: any) => {
      const existing = data.find((item: any) => item.id === entity.id);
      if (existing) {
        Object.assign(existing, entity);
        return existing;
      }
      const newEntity = { id: entity.id || ++idCounter, ...entity };
      data.push(newEntity as T);
      return newEntity;
    }),
    update: jest.fn(async (criteria: any, entity: any) => {
      const updated = data.filter((item: any) => item.id === criteria);
      updated.forEach((item) => Object.assign(item, entity));
      return { affected: updated.length };
    }),
    delete: jest.fn(async (criteria: any) => {
      const initialLength = data.length;
      data = data.filter((item: any) => item.id !== criteria);
      return { affected: initialLength - data.length };
    }),
    count: jest.fn(async () => data.length),
    clear: jest.fn(async () => {
      data = [];
    }),
  };
};

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
export const createMockSequelizeModel = <T>(initialData: T[] = []): any => {
  let data = [...initialData];

  return {
    findAll: jest.fn(async () => [...data]),
    findOne: jest.fn(async ({ where }: any) => {
      return data.find((item: any) => {
        return Object.keys(where).every((key) => item[key] === where[key]);
      });
    }),
    findByPk: jest.fn(async (id: any) => data.find((item: any) => item.id === id)),
    create: jest.fn(async (values: any) => {
      const newItem = { id: data.length + 1, ...values };
      data.push(newItem as T);
      return newItem;
    }),
    update: jest.fn(async (values: any, { where }: any) => {
      let affected = 0;
      data.forEach((item: any) => {
        if (Object.keys(where).every((key) => item[key] === where[key])) {
          Object.assign(item, values);
          affected++;
        }
      });
      return [affected];
    }),
    destroy: jest.fn(async ({ where }: any) => {
      const initialLength = data.length;
      data = data.filter((item: any) => {
        return !Object.keys(where).every((key) => item[key] === where[key]);
      });
      return initialLength - data.length;
    }),
  };
};

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
export const createMockMongoCollection = <T>(initialData: T[] = []): any => {
  let data = [...initialData];

  return {
    find: jest.fn(() => ({
      toArray: async () => [...data],
      limit: jest.fn(() => ({ toArray: async () => [...data] })),
      skip: jest.fn(() => ({ toArray: async () => [...data] })),
    })),
    findOne: jest.fn(async (query: any) => {
      return data.find((item: any) => {
        return Object.keys(query).every((key) => item[key] === query[key]);
      });
    }),
    insertOne: jest.fn(async (doc: any) => {
      const newDoc = { _id: generateFakeUUID(), ...doc };
      data.push(newDoc as T);
      return { insertedId: newDoc._id };
    }),
    updateOne: jest.fn(async (filter: any, update: any) => {
      const item = data.find((item: any) => {
        return Object.keys(filter).every((key) => item[key] === filter[key]);
      });
      if (item) {
        Object.assign(item, update.$set || {});
        return { modifiedCount: 1 };
      }
      return { modifiedCount: 0 };
    }),
    deleteOne: jest.fn(async (filter: any) => {
      const initialLength = data.length;
      data = data.filter((item: any) => {
        return !Object.keys(filter).every((key) => item[key] === filter[key]);
      });
      return { deletedCount: initialLength - data.length };
    }),
  };
};

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
export const createMockEmailService = (): any => {
  return {
    send: jest.fn().mockResolvedValue({ messageId: 'mock-id' }),
    sendBulk: jest.fn().mockResolvedValue({ sent: 0, failed: 0 }),
    verifyEmail: jest.fn().mockResolvedValue(true),
  };
};

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
export const createMockSMSService = (): any => {
  return {
    sendSMS: jest.fn().mockResolvedValue({ sid: 'mock-sid', status: 'sent' }),
    verifyPhone: jest.fn().mockResolvedValue(true),
  };
};

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
export const createMockPaymentService = (): any => {
  return {
    charge: jest.fn().mockResolvedValue({ id: 'ch_mock', status: 'succeeded' }),
    refund: jest.fn().mockResolvedValue({ id: 'ref_mock', status: 'succeeded' }),
    createCustomer: jest.fn().mockResolvedValue({ id: 'cus_mock' }),
  };
};

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
export const createMockStorageService = (): any => {
  const files = new Map<string, any>();

  return {
    upload: jest.fn(async (bucket: string, key: string, data: any) => {
      files.set(`${bucket}/${key}`, data);
      return { location: `https://mock-s3.com/${bucket}/${key}` };
    }),
    download: jest.fn(async (bucket: string, key: string) => {
      return files.get(`${bucket}/${key}`);
    }),
    delete: jest.fn(async (bucket: string, key: string) => {
      files.delete(`${bucket}/${key}`);
    }),
  };
};

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
export const createMockAuthService = (options: MockAuthOptions = {}): any => {
  return {
    generateToken: jest.fn().mockResolvedValue(
      generateFakeJWT({
        userId: options.userId || '123',
        roles: options.roles || ['user'],
      }),
    ),
    verifyToken: jest.fn().mockResolvedValue({
      userId: options.userId || '123',
      roles: options.roles || ['user'],
      permissions: options.permissions || [],
    }),
    hashPassword: jest.fn().mockResolvedValue('$2b$10$mock.hashed.password'),
    comparePassword: jest.fn().mockResolvedValue(true),
  };
};

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
export const createMockJWTService = (): any => {
  return {
    sign: jest.fn((payload: any) => generateFakeJWT(payload)),
    verify: jest.fn((token: string) => {
      const parts = token.split('.');
      if (parts.length !== 3) throw new Error('Invalid token');
      return JSON.parse(Buffer.from(parts[1], 'base64').toString());
    }),
    decode: jest.fn((token: string) => {
      const parts = token.split('.');
      return JSON.parse(Buffer.from(parts[1], 'base64').toString());
    }),
  };
};

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
export const createMockPassportStrategy = (user?: any): any => {
  return {
    authenticate: jest.fn((req: any, options: any) => {
      if (user) {
        return { success: user };
      }
      return { fail: 'Unauthorized' };
    }),
    validate: jest.fn().mockResolvedValue(user || null),
  };
};

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
export const createMockFileSystem = (options: MockFileSystemOptions = {}): any => {
  const files = new Map<string, string>(Object.entries(options.initialFiles || {}));

  return {
    readFile: jest.fn(async (path: string) => {
      if (!files.has(path)) throw new Error('File not found');
      return files.get(path);
    }),
    writeFile: jest.fn(async (path: string, content: string) => {
      if (options.readOnly) throw new Error('Read-only file system');
      files.set(path, content);
    }),
    unlink: jest.fn(async (path: string) => {
      if (options.readOnly) throw new Error('Read-only file system');
      files.delete(path);
    }),
    exists: jest.fn(async (path: string) => files.has(path)),
    readdir: jest.fn(async () => Array.from(files.keys())),
  };
};

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
export const createMockMulterUpload = (): any => {
  return {
    single: jest.fn((fieldName: string) => {
      return (req: any, res: any, next: any) => {
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
    array: jest.fn(() => (req: any, res: any, next: any) => {
      req.files = [];
      next();
    }),
  };
};

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
export const createMockTimer = (
  options: MockTimeOptions = {},
): { now: () => Date; advance: (ms: number) => void; reset: () => void } => {
  let currentTime = options.startTime?.getTime() || Date.now();

  return {
    now: () => new Date(currentTime),
    advance: (ms: number) => {
      currentTime += ms;
    },
    reset: () => {
      currentTime = options.startTime?.getTime() || Date.now();
    },
  };
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
export const freezeTime = (date: Date): (() => void) => {
  const originalDate = Date;
  const frozenTime = date.getTime();

  (global as any).Date = class extends Date {
    constructor(...args: any[]) {
      if (args.length === 0) {
        super(frozenTime);
      } else {
        super(...args);
      }
    }

    static now() {
      return frozenTime;
    }
  };

  return () => {
    (global as any).Date = originalDate;
  };
};

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
export const createMockWebSocketServer = (options: MockWebSocketOptions = {}): any => {
  const clients = new Set<any>();

  return {
    on: jest.fn(),
    emit: jest.fn((event: string, data: any) => {
      clients.forEach((client) => client.emit(event, data));
    }),
    close: jest.fn(() => {
      clients.clear();
    }),
    clients,
  };
};

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
export const createMockWebSocketClient = (): any => {
  const listeners = new Map<string, Function[]>();

  return {
    send: jest.fn(),
    on: jest.fn((event: string, handler: Function) => {
      if (!listeners.has(event)) listeners.set(event, []);
      listeners.get(event)?.push(handler);
    }),
    emit: jest.fn((event: string, data: any) => {
      listeners.get(event)?.forEach((handler) => handler(data));
    }),
    close: jest.fn(),
  };
};

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
export const createMockMicroserviceClient = (patterns: Record<string, any> = {}): any => {
  return {
    send: jest.fn((pattern: string, data: any) => {
      return Promise.resolve(patterns[pattern] || null);
    }),
    emit: jest.fn(() => Promise.resolve()),
  };
};

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
export const createMockMessageQueue = (): any => {
  const messages: any[] = [];

  return {
    publish: jest.fn(async (pattern: string, data: any) => {
      messages.push({ pattern, data, timestamp: Date.now() });
    }),
    subscribe: jest.fn((pattern: string, handler: Function) => {
      return jest.fn();
    }),
    getMessages: () => [...messages],
    clear: () => {
      messages.length = 0;
    },
  };
};

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
export const createMockEventEmitter = (options: MockEventOptions = {}): any => {
  const listeners = new Map<string, Function[]>();

  return {
    on: jest.fn((event: string, handler: Function) => {
      if (!listeners.has(event)) listeners.set(event, []);
      listeners.get(event)?.push(handler);
    }),
    emit: jest.fn((event: string, ...args: any[]) => {
      const handlers = listeners.get(event) || [];
      if (options.async) {
        handlers.forEach((handler) => setTimeout(() => handler(...args), 0));
      } else {
        handlers.forEach((handler) => handler(...args));
      }
      return handlers.length > 0;
    }),
    removeListener: jest.fn((event: string, handler: Function) => {
      const handlers = listeners.get(event) || [];
      const index = handlers.indexOf(handler);
      if (index > -1) handlers.splice(index, 1);
    }),
    removeAllListeners: jest.fn((event?: string) => {
      if (event) {
        listeners.delete(event);
      } else {
        listeners.clear();
      }
    }),
  };
};

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
export const createMockRequest = (overrides: Partial<any> = {}): any => {
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
export const createMockResponse = (): any => {
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
};

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Mock function builders
  createMockFunction,
  createAsyncMock,
  createRejectingMock,
  createSequentialMock,
  createAlternatingMock,
  createConditionalMock,

  // Spy utilities
  createSpy,
  createMultipleSpies,
  createOrderTrackingSpy,
  restoreSpies,

  // Stub generators
  createStub,
  createPropertyStub,
  createCountingStub,

  // Fake data factories
  generateFakeEmail,
  generateFakeUUID,
  generateFakeDate,
  generateFakePhone,
  generateFakeAddress,
  generateFakeCreditCard,
  generateFakeJWT,

  // Mock HTTP clients
  createMockHttpClient,
  createMockAxios,
  createMockFetch,
  createMockGraphQLClient,

  // Mock database repositories
  createMockTypeORMRepository,
  createMockSequelizeModel,
  createMockMongoCollection,

  // Mock external services
  createMockEmailService,
  createMockSMSService,
  createMockPaymentService,
  createMockStorageService,

  // Mock authentication
  createMockAuthService,
  createMockJWTService,
  createMockPassportStrategy,

  // Mock file systems
  createMockFileSystem,
  createMockMulterUpload,

  // Mock time/date utilities
  createMockTimer,
  freezeTime,

  // Mock WebSocket connections
  createMockWebSocketServer,
  createMockWebSocketClient,

  // Mock microservice clients
  createMockMicroserviceClient,
  createMockMessageQueue,

  // Mock event emitters
  createMockEventEmitter,

  // Request/response mocks
  createMockRequest,
  createMockResponse,
};
