/**
 * Jest Testing Configuration - White Cross Healthcare Platform
 *
 * Comprehensive Jest configuration for unit and integration testing of React components,
 * healthcare business logic, and Next.js application features. Configured with Next.js
 * integration for seamless testing of Server Components, API routes, and Client Components.
 *
 * Key Features:
 * - Next.js integration via next/jest for automatic config loading
 * - SWC transpilation for fast TypeScript/JSX compilation
 * - JSDOM test environment for React component testing
 * - Path alias support (@/ imports)
 * - Healthcare-specific coverage thresholds (95%/90%)
 * - Custom test matchers for improved assertions
 * - Parallel execution with 50% worker utilization
 *
 * Healthcare Testing Context:
 * - High coverage requirements for patient-critical functionality
 * - HIPAA compliance validation through test coverage
 * - Synthetic test data only (no real PHI)
 * - Audit logging verification in tests
 *
 * Testing Strategy:
 * - Unit tests: Components, utilities, business logic
 * - Integration tests: API interactions, state management
 * - Snapshot tests: UI consistency verification
 * - Mock-based isolation: External dependencies mocked
 *
 * Performance Optimization:
 * - SWC for 70% faster transpilation vs Babel
 * - Parallel execution across 50% of CPU cores
 * - Smart test file discovery with ignore patterns
 *
 * @module jest.config
 * @see https://jestjs.io/docs/configuration
 * @see https://nextjs.org/docs/testing/jest
 * @version 1.0.0
 * @since 2025-10-26
 */

import type { Config } from 'jest';
import nextJest from 'next/jest';

/**
 * Creates a Jest configuration with Next.js integration.
 *
 * This function wraps the base Jest config with Next.js-specific settings,
 * enabling automatic loading of next.config.js and .env files during tests.
 *
 * @param {object} options - Next.js configuration options
 * @param {string} options.dir - Path to Next.js app root (loads next.config.js)
 * @returns {function} Function that creates Jest config with Next.js integration
 */
const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

/**
 * Base Jest configuration object.
 *
 * Defines test environment, coverage thresholds, module resolution, and other
 * Jest settings specific to the White Cross healthcare platform.
 *
 * @type {Config}
 */
const config: Config = {
  // V8 coverage provider (faster and more accurate than legacy Istanbul)
  coverageProvider: 'v8',

  // JSDOM test environment for React component testing (simulates browser DOM)
  testEnvironment: 'jsdom',

  // Test environment options for JSDOM
  testEnvironmentOptions: {
    // Custom export conditions for module resolution
    customExportConditions: [''],
  },

  // Setup files executed after test environment initialization
  // Configures global mocks, polyfills, and custom matchers
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

  // Module path aliases (matches tsconfig.json paths)
  // Allows imports like: import { Component } from '@/components/Component'
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@tests/(.*)$': '<rootDir>/tests/$1',
  },

  // Test file discovery patterns
  // Matches files in __tests__ directories or with .test/.spec extensions
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],

  // Directories and files to exclude from test discovery
  // Improves performance by skipping build artifacts and dependencies
  testPathIgnorePatterns: [
    '/node_modules/',
    '/.next/',
    '/out/',
    '/coverage/',
  ],

  // Coverage collection configuration
  // Specifies which files to include in coverage reports
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',                          // Exclude TypeScript declarations
    '!src/**/*.stories.{js,jsx,ts,tsx}',      // Exclude Storybook stories
    '!src/**/__tests__/**',                    // Exclude test files themselves
    '!src/**/__mocks__/**',                    // Exclude mock implementations
    '!src/app/layout.tsx',                     // Exclude Next.js root layout
    '!src/app/page.tsx',                       // Exclude Next.js root page
    '!src/app/providers.tsx',                  // Exclude provider setup
  ],

  // Coverage thresholds for healthcare compliance
  // High thresholds ensure thorough testing of patient-critical functionality
  // Builds fail if coverage drops below these percentages
  coverageThreshold: {
    global: {
      branches: 90,     // 90% of conditional branches covered
      functions: 95,    // 95% of functions covered
      lines: 95,        // 95% of executable lines covered
      statements: 95,   // 95% of statements covered
    },
  },

  // Transform configuration using SWC for fast TypeScript/JSX compilation
  // SWC is 70% faster than Babel for transpilation
  transform: {
    '^.+\\.(ts|tsx)$': ['@swc/jest', {
      jsc: {
        parser: {
          syntax: 'typescript',      // Parse TypeScript syntax
          tsx: true,                 // Enable JSX/TSX support
        },
        transform: {
          react: {
            runtime: 'automatic',    // Use React 17+ automatic JSX runtime
          },
        },
      },
    }],
  },

  // Module file extensions Jest will recognize
  // Priority order: ts, tsx, js, jsx, json, node
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

  // Verbose output for detailed test results
  // Shows individual test names and execution times
  verbose: true,

  // Max workers for parallel test execution
  // Uses 50% of available CPU cores for balanced performance
  // Improves test suite execution time for large healthcare test suites
  maxWorkers: '50%',

  // Mock management between tests
  // Ensures test isolation and prevents mock state leakage
  clearMocks: true,      // Clears mock call history between tests
  resetMocks: true,      // Resets mock implementations between tests
  restoreMocks: true,    // Restores original implementations after tests
};

/**
 * Export Jest configuration wrapped with Next.js integration.
 *
 * The createJestConfig wrapper is async to load Next.js configuration,
 * environment variables, and webpack aliases during test initialization.
 */
export default createJestConfig(config);

