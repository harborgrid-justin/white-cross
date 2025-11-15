/**
 * Backend Jest Test Setup
 * -----------------------
 * Centralises backend-specific Jest configuration so every spec file
 * shares the same deterministic execution environment.
 */

// Ensure the runtime behaves like the production build where timezone matters
process.env.TZ = 'UTC';
process.env.NODE_ENV = 'test';

// Provide sensible defaults when running locally without explicit env vars
const ensureEnv = (key: string, fallback: string): void => {
  if (!process.env[key]) {
    process.env[key] = fallback;
  }
};

ensureEnv('DATABASE_URL', 'sqlite::memory:');
ensureEnv('JWT_SECRET', 'test-secret-key');
ensureEnv('JWT_EXPIRATION', '1h');
ensureEnv('CRYPTO_SECRET', 'local-test-crypto-secret');

// Increase the default timeout for slower integration-style unit tests
jest.setTimeout(30_000);

// Reduce noisy logging during test runs while still surfacing errors
const originalConsole = { ...console };

global.console = {
  ...console,
  log: jest.fn(originalConsole.log),
  info: jest.fn(originalConsole.info),
  debug: jest.fn(originalConsole.debug),
  warn: jest.fn(originalConsole.warn),
  error: jest.fn(originalConsole.error),
};

afterEach(() => {
  jest.clearAllMocks();
  jest.clearAllTimers();
});

afterAll(() => {
  // Restore console to avoid side effects for other tooling (e.g. coverage)
  global.console = originalConsole;
});

// Lightweight async helpers shared across specs
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {
      testUtils: {
        wait: (ms: number) => Promise<void>;
        advanceTimersBy: (ms: number) => void;
      };
    }
  }
}

global.testUtils = {
  wait: (ms: number): Promise<void> =>
    new Promise(resolve => setTimeout(resolve, ms)),
  advanceTimersBy: (ms: number): void => {
    jest.advanceTimersByTime(ms);
  },
};
