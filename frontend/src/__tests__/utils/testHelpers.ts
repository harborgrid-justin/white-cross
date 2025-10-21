/**
 * Test utility helpers for healthcare platform testing
 * Provides common mocks, factories, and utilities
 */

import { vi } from 'vitest';

/**
 * Create a mock JWT token for testing
 * @param overrides - Optional payload overrides
 * @param expiresInSeconds - Token expiration in seconds (default: 3600)
 */
export function createMockJWT(
  overrides: Record<string, any> = {},
  expiresInSeconds = 3600
): string {
  const now = Math.floor(Date.now() / 1000);

  const header = {
    alg: 'HS256',
    typ: 'JWT',
  };

  const payload = {
    sub: '1234567890',
    name: 'Test User',
    iat: now,
    exp: now + expiresInSeconds,
    ...overrides,
  };

  const signature = 'mock-signature';

  return `${btoa(JSON.stringify(header))}.${btoa(JSON.stringify(payload))}.${signature}`;
}

/**
 * Create an expired JWT token for testing
 */
export function createExpiredJWT(): string {
  return createMockJWT({}, -3600); // Expired 1 hour ago
}

/**
 * Mock sessionStorage for testing
 */
export function mockSessionStorage() {
  const storage = new Map<string, string>();

  return {
    getItem: vi.fn((key: string) => storage.get(key) || null),
    setItem: vi.fn((key: string, value: string) => storage.set(key, value)),
    removeItem: vi.fn((key: string) => storage.delete(key)),
    clear: vi.fn(() => storage.clear()),
    get size() {
      return storage.size;
    },
    key: vi.fn((index: number) => {
      const keys = Array.from(storage.keys());
      return keys[index] || null;
    }),
    get length() {
      return storage.size;
    },
  };
}

/**
 * Mock localStorage for testing
 */
export function mockLocalStorage() {
  return mockSessionStorage(); // Same implementation
}

/**
 * Wait for a specified time
 * @param ms - Milliseconds to wait
 */
export function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Wait for next tick (microtask queue)
 */
export function waitForNextTick(): Promise<void> {
  return new Promise(resolve => queueMicrotask(resolve));
}

/**
 * Mock Axios request config
 */
export function createMockAxiosConfig(overrides: any = {}) {
  return {
    url: '/api/test',
    method: 'GET',
    headers: {},
    baseURL: 'http://localhost:3001',
    ...overrides,
  };
}

/**
 * Mock Axios response
 */
export function createMockAxiosResponse(data: any = {}, config: any = {}) {
  return {
    data,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: createMockAxiosConfig(config),
  };
}

/**
 * Mock Axios error
 */
export function createMockAxiosError(
  message = 'Network Error',
  code = 'ERR_NETWORK',
  status?: number
) {
  const error: any = new Error(message);
  error.isAxiosError = true;
  error.code = code;

  if (status) {
    error.response = {
      status,
      statusText: 'Error',
      data: { message },
      headers: {},
      config: createMockAxiosConfig(),
    };
  }

  return error;
}

/**
 * Create mock CSRF meta tag
 */
export function createMockCsrfMetaTag(token = 'mock-csrf-token') {
  const meta = document.createElement('meta');
  meta.name = 'csrf-token';
  meta.content = token;
  document.head.appendChild(meta);

  return () => {
    document.head.removeChild(meta);
  };
}

/**
 * Create mock CSRF cookie
 */
export function createMockCsrfCookie(token = 'mock-csrf-token', name = 'XSRF-TOKEN') {
  const originalCookie = document.cookie;
  Object.defineProperty(document, 'cookie', {
    writable: true,
    value: `${name}=${encodeURIComponent(token)}`,
  });

  return () => {
    Object.defineProperty(document, 'cookie', {
      writable: true,
      value: originalCookie,
    });
  };
}

/**
 * Advance timers and flush promises
 */
export async function advanceTimersAndFlush(ms: number) {
  vi.advanceTimersByTime(ms);
  await waitForNextTick();
  await waitForNextTick(); // Double tick to ensure all promises resolve
}

/**
 * Create mock audit event
 */
export function createMockAuditEvent(overrides: any = {}) {
  return {
    eventType: 'PHI_ACCESS',
    action: 'VIEW',
    resourceType: 'STUDENT_HEALTH_RECORD',
    resourceId: '123',
    userId: 'user-123',
    timestamp: Date.now(),
    metadata: {},
    ...overrides,
  };
}

/**
 * Create mock student data
 */
export function createMockStudent(overrides: any = {}) {
  return {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '2010-01-01',
    grade: '5',
    ...overrides,
  };
}

/**
 * Mock IndexedDB for cache persistence tests
 */
export function mockIndexedDB() {
  const databases = new Map();

  const mockIDB = {
    open: vi.fn((name: string, version?: number) => {
      return Promise.resolve({
        name,
        version: version || 1,
        objectStoreNames: [],
        createObjectStore: vi.fn(),
        transaction: vi.fn(() => ({
          objectStore: vi.fn(() => ({
            get: vi.fn(() => Promise.resolve(undefined)),
            put: vi.fn(() => Promise.resolve()),
            delete: vi.fn(() => Promise.resolve()),
            clear: vi.fn(() => Promise.resolve()),
          })),
        })),
        close: vi.fn(),
      });
    }),
    deleteDatabase: vi.fn(() => Promise.resolve()),
  };

  (global as any).indexedDB = mockIDB;

  return mockIDB;
}

/**
 * Assert that a promise rejects with a specific error
 */
export async function expectToReject(promise: Promise<any>, errorMatcher?: string | RegExp) {
  try {
    await promise;
    throw new Error('Expected promise to reject, but it resolved');
  } catch (error) {
    if (errorMatcher) {
      const message = error instanceof Error ? error.message : String(error);
      if (typeof errorMatcher === 'string') {
        if (!message.includes(errorMatcher)) {
          throw new Error(`Expected error message to include "${errorMatcher}", got "${message}"`);
        }
      } else {
        if (!errorMatcher.test(message)) {
          throw new Error(`Expected error message to match ${errorMatcher}, got "${message}"`);
        }
      }
    }
    return error;
  }
}

/**
 * Spy on console methods without polluting test output
 */
export function silenceConsole(methods: Array<'log' | 'warn' | 'error' | 'info' | 'debug'> = ['error', 'warn']) {
  const spies: Record<string, any> = {};

  methods.forEach(method => {
    spies[method] = vi.spyOn(console, method).mockImplementation(() => {});
  });

  return {
    restore: () => {
      Object.values(spies).forEach(spy => spy.mockRestore());
    },
    spies,
  };
}
