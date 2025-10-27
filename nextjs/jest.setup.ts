import '@testing-library/jest-dom';
import 'jest-canvas-mock';
import './tests/utils/custom-matchers';
import React from 'react';
import { TextEncoder, TextDecoder } from 'util';

// Make React available globally for tests
global.React = React;

// Mock Next.js Edge Runtime globals
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;

// Mock Request and Response for Next.js Edge Runtime
if (typeof global.Request === 'undefined') {
  global.Request = class Request {
    private _url: string;
    public init?: any;
    public headers: any;
    public method: string;
    public body: any;

    constructor(url: string, init?: any) {
      this._url = url;
      this.init = init;
      this.method = init?.method || 'GET';
      this.body = init?.body;

      // Convert headers object to Headers instance if needed
      if (init?.headers) {
        if (init.headers instanceof Headers) {
          this.headers = init.headers;
        } else {
          this.headers = new Headers(init.headers);
        }
      } else {
        this.headers = new Headers();
      }
    }

    get url() {
      return this._url;
    }
  } as any;
}

if (typeof global.Response === 'undefined') {
  global.Response = class Response {
    constructor(public body?: any, public init?: any) {}
    static json(data: any, init?: any) {
      return new Response(JSON.stringify(data), {
        ...init,
        headers: { 'Content-Type': 'application/json', ...init?.headers },
      });
    }
  } as any;
}

if (typeof global.Headers === 'undefined') {
  global.Headers = class Headers {
    private headers: Map<string, string> = new Map();

    constructor(init?: any) {
      if (init) {
        Object.entries(init).forEach(([key, value]) => {
          this.headers.set(key.toLowerCase(), value as string);
        });
      }
    }

    get(name: string) {
      return this.headers.get(name.toLowerCase()) || null;
    }

    set(name: string, value: string) {
      this.headers.set(name.toLowerCase(), value);
    }

    has(name: string) {
      return this.headers.has(name.toLowerCase());
    }

    delete(name: string) {
      this.headers.delete(name.toLowerCase());
    }

    forEach(callback: (value: string, key: string) => void) {
      this.headers.forEach((value, key) => callback(value, key));
    }
  } as any;
}

// Mock environment variables
process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3001/api/v1';
process.env.NEXT_PUBLIC_GRAPHQL_URL = 'http://localhost:3001/graphql';
process.env.NEXT_PUBLIC_WS_URL = 'ws://localhost:3001';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      pathname: '/',
      query: {},
    };
  },
  usePathname() {
    return '/';
  },
  useSearchParams() {
    return new URLSearchParams();
  },
  useParams() {
    return {};
  },
  notFound: jest.fn(),
  redirect: jest.fn(),
}));

// Mock fetch
global.fetch = jest.fn();

// Mock @faker-js/faker
jest.mock('@faker-js/faker', () => ({
  faker: {
    string: {
      uuid: () => '123e4567-e89b-12d3-a456-426614174000',
      alphanumeric: (length: number) => 'ABCD1234',
    },
    internet: {
      email: () => 'test@example.com',
      url: () => 'https://example.com',
      ip: () => '192.168.1.1',
      userAgent: () => 'Mozilla/5.0',
    },
    person: {
      firstName: () => 'John',
      lastName: () => 'Doe',
      fullName: () => 'John Doe',
    },
    date: {
      past: () => new Date('2023-01-15'),
      recent: () => new Date('2024-01-15'),
      future: () => new Date('2025-01-15'),
      birthdate: () => new Date('2010-05-15'),
    },
    location: {
      streetAddress: () => '123 Main St',
      city: () => 'Springfield',
      state: () => 'CA',
      zipCode: () => '12345',
    },
    phone: {
      number: () => '555-0123',
    },
    lorem: {
      sentence: () => 'Lorem ipsum dolor sit amet.',
      paragraph: () => 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      words: (count: number) => 'lorem ipsum dolor',
    },
    helpers: {
      arrayElement: (arr: any[]) => arr[0],
    },
    number: {
      int: (options: any) => options?.min || 50,
      float: (options: any) => options?.min || 50.0,
    },
    datatype: {
      boolean: () => true,
    },
  },
}));

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
} as any;

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
} as any;

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(),
};

global.localStorage = localStorageMock as Storage;

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(),
};

global.sessionStorage = sessionStorageMock as Storage;

// Suppress console errors in tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: ReactDOM.render') ||
        args[0].includes('Warning: useLayoutEffect') ||
        args[0].includes('Not implemented: HTMLFormElement.prototype.submit'))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

// Global test timeout
jest.setTimeout(10000);

