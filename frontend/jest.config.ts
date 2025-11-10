/**
 * Jest Test Configuration for White Cross Healthcare Platform
 *
 * Comprehensive Jest configuration for testing Next.js 15+ application with:
 * - React Testing Library for component testing
 * - MSW (Mock Service Worker) for API mocking
 * - jest-axe for accessibility testing
 * - Test coverage thresholds
 * - TypeScript support
 * - Next.js environment simulation
 *
 * Test Types:
 * - Unit tests: Utility functions, hooks, pure components
 * - Integration tests: API flows, state management, navigation
 * - Component tests: User interactions, accessibility, validation
 * - Accessibility tests: WCAG 2.1 AA compliance
 *
 * @module jest.config
 * @version 1.0.0
 * @since 2025-11-04
 */

import type { Config } from 'jest';
import nextJest from 'next/jest';

/**
 * Create Jest config with Next.js preset
 * Automatically configures path aliases, TypeScript, and environment
 */
const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.ts and .env files in your test environment
  dir: './',
});

/**
 * Custom Jest configuration
 */
const customJestConfig: Config = {
  // Display name for this test suite
  displayName: 'white-cross-frontend',

  // Test environment: jsdom for browser-like environment
  testEnvironment: 'jest-environment-jsdom',

  // Setup files to run after environment is set up
  setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],

  // Module name mapper for path aliases and static assets
  moduleNameMapper: {
    // Path aliases (must match tsconfig.json)
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    '^@/lib/(.*)$': '<rootDir>/src/lib/$1',
    '^@/hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@/services/(.*)$': '<rootDir>/src/services/$1',
    '^@/stores/(.*)$': '<rootDir>/src/stores/$1',
    '^@/types/(.*)$': '<rootDir>/src/types/$1',
    '^@/utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@/features/(.*)$': '<rootDir>/src/features/$1',
    '^@/graphql/(.*)$': '<rootDir>/src/graphql/$1',
    '^@/test/(.*)$': '<rootDir>/tests/$1',

    // Mock static assets
    '^.+\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^.+\\.(jpg|jpeg|png|gif|webp|avif|svg)$': '<rootDir>/tests/mocks/fileMock.ts',
  },

  // Directories to search for modules
  moduleDirectories: ['node_modules', '<rootDir>/'],

  // Test match patterns
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],

  // Ignore patterns for test discovery
  testPathIgnorePatterns: [
    '/node_modules/',
    '/.next/',
    '/dist/',
    '/build/',
    '/coverage/',
    '/playwright-report/',
    '/test-results/',
  ],

  // Coverage collection configuration
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.tsx',
    '!src/**/*.test.{ts,tsx}',
    '!src/**/__tests__/**',
    '!src/**/*.examples.tsx',
    '!src/app/**', // Exclude App Router pages (tested in E2E)
    '!src/types/**', // Exclude type definitions
    '!src/**/index.ts', // Exclude barrel exports
    '!src/test/**', // Exclude test utilities
    '!src/graphql/generated/**', // Exclude generated GraphQL code
  ],

  // Coverage thresholds (80%+ for critical code)
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    // Higher threshold for critical utilities
    './src/lib/utils/**/*.ts': {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
    './src/lib/security/**/*.ts': {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95,
    },
    './src/hooks/**/*.tsx': {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85,
    },
  },

  // Coverage reporters
  coverageReporters: [
    'text',
    'text-summary',
    'html',
    'lcov',
    'json-summary',
  ],

  // Coverage output directory
  coverageDirectory: '<rootDir>/coverage',

  // Transform files with SWC (faster than Babel)
  transform: {
    '^.+\\.(ts|tsx)$': ['@swc/jest', {
      jsc: {
        parser: {
          syntax: 'typescript',
          tsx: true,
          decorators: false,
          dynamicImport: true,
        },
        transform: {
          react: {
            runtime: 'automatic',
          },
        },
      },
    }],
  },

  // Maximum worker threads (50% of CPU cores)
  maxWorkers: '50%',

  // Globals
  globals: {
    'ts-jest': {
      tsconfig: {
        jsx: 'react-jsx',
      },
    },
  },

  // Clear mocks between tests automatically
  clearMocks: true,

  // Restore mocks between tests
  restoreMocks: true,

  // Reset mocks between tests
  resetMocks: true,

  // Verbose output for debugging
  verbose: true,

  // Fail tests on any console error
  // Uncomment to enforce clean tests
  // errorOnDeprecated: true,

  // Test timeout (5 seconds)
  testTimeout: 5000,

  // Notify on test completion (optional)
  // notify: true,
  // notifyMode: 'failure-change',
};

/**
 * Export Jest configuration with Next.js preset
 */
export default createJestConfig(customJestConfig);
