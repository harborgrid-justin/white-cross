/**
 * Jest Configuration for SAN Testing
 *
 * Optimized configuration for testing Storage Area Network (SAN) operations.
 * Use this configuration for running SAN-specific tests.
 *
 * Usage:
 *   npm test -- --config=reuse/san/jest.config.san-testing.js
 *   yarn test --config=reuse/san/jest.config.san-testing.js
 *
 * @type {import('@jest/types').Config.InitialOptions}
 */

module.exports = {
  // Use ts-jest for TypeScript support
  preset: 'ts-jest',

  // Test environment
  testEnvironment: 'node',

  // Module file extensions
  moduleFileExtensions: ['js', 'json', 'ts'],

  // Root directory for tests
  rootDir: '../..',

  // Test match patterns
  testMatch: [
    '**/san/**/*.spec.ts',
    '**/san/**/*.test.ts',
    '**/__tests__/san/**/*.ts',
  ],

  // Transform files with ts-jest
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },

  // Coverage collection patterns
  collectCoverageFrom: [
    'src/san/**/*.ts',
    'reuse/san/**/*.ts',
    '!src/san/**/*.spec.ts',
    '!src/san/**/*.test.ts',
    '!src/san/**/*.module.ts',
    '!src/san/**/*.interface.ts',
    '!src/san/**/*.dto.ts',
    '!src/san/**/*.entity.ts',
    '!reuse/san/**/san-testing-utilities-kit.ts', // Don't test test utilities
    '!reuse/san/**/san-testing-utilities-examples.spec.ts',
  ],

  // Coverage directory
  coverageDirectory: './coverage/san',

  // Coverage thresholds for SAN modules
  coverageThresholds: {
    global: {
      branches: 85,
      functions: 90,
      lines: 90,
      statements: 90,
    },
    // Stricter thresholds for critical SAN services
    './src/san/services/volume.service.ts': {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95,
    },
    './src/san/services/replication.service.ts': {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95,
    },
  },

  // Module name mapper for path aliases
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
    '^reuse/(.*)$': '<rootDir>/reuse/$1',
    '^@san/(.*)$': '<rootDir>/src/san/$1',
  },

  // Setup files to run after Jest is initialized
  setupFilesAfterEnv: [
    '<rootDir>/reuse/san/jest.setup.ts',
  ],

  // Global setup (runs once before all tests)
  globalSetup: '<rootDir>/reuse/san/jest.global-setup.ts',

  // Global teardown (runs once after all tests)
  globalTeardown: '<rootDir>/reuse/san/jest.global-teardown.ts',

  // Test timeout (10 seconds for SAN operations)
  testTimeout: 10000,

  // Verbose output
  verbose: true,

  // Detect open handles (useful for finding async issues)
  detectOpenHandles: true,

  // Force exit after tests complete
  forceExit: true,

  // Clear mocks between tests
  clearMocks: true,

  // Reset mocks between tests
  resetMocks: true,

  // Restore mocks between tests
  restoreMocks: true,

  // Coverage reporters
  coverageReporters: [
    'text',
    'text-summary',
    'html',
    'lcov',
    'json',
  ],

  // Reporters
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: './coverage/san',
        outputName: 'junit-san.xml',
        classNameTemplate: '{classname}',
        titleTemplate: '{title}',
        ancestorSeparator: ' › ',
        usePathForSuiteName: true,
      },
    ],
  ],

  // Max workers (use 50% of available CPU cores for SAN tests)
  maxWorkers: '50%',

  // Test sequence based on timing information
  testSequencer: '<rootDir>/reuse/san/jest.sequencer.js',

  // Globals for TypeScript
  globals: {
    'ts-jest': {
      tsconfig: {
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
        resolveJsonModule: true,
      },
    },
  },

  // Ignore patterns
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/coverage/',
  ],

  // Watch plugins (for watch mode)
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],

  // Collect coverage on all files
  collectCoverage: false, // Set to true in CI/CD

  // Bail after n failures (set to 0 to run all tests)
  bail: 0,

  // Cache directory
  cacheDirectory: '<rootDir>/node_modules/.cache/jest-san',

  // Display individual test results
  displayName: {
    name: 'SAN Tests',
    color: 'blue',
  },

  // Error on deprecated APIs
  errorOnDeprecated: true,

  // Notify on completion (useful in watch mode)
  notify: false,

  // Notify mode
  notifyMode: 'failure-change',

  // Projects configuration for different test types
  projects: undefined, // Can be used to separate unit/integration/e2e

  // Test result processor
  testResultsProcessor: undefined,

  // Custom test environment options
  testEnvironmentOptions: {
    NODE_ENV: 'test',
  },
};
