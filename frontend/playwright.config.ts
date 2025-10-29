/**
 * Playwright End-to-End Testing Configuration - White Cross Healthcare Platform
 *
 * Comprehensive E2E testing configuration for healthcare workflows, user journeys,
 * and critical patient care operations. Tests run across multiple browsers and
 * devices to ensure consistent healthcare user experience.
 *
 * Key Features:
 * - Multi-browser testing (Chromium, Firefox, WebKit)
 * - Mobile device testing (iPhone, Android)
 * - Parallel test execution for faster CI/CD
 * - Automatic screenshot/video capture on failure
 * - Trace collection for debugging failed tests
 * - Integrated dev server management
 *
 * Healthcare Testing Scope:
 * - Authentication and authorization flows
 * - Student health record management
 * - Medication administration workflows
 * - Emergency contact updates
 * - Appointment scheduling
 * - Incident reporting
 * - HIPAA compliance verification
 *
 * CI/CD Integration:
 * - Automatic retry on failure (2 retries in CI)
 * - Serial execution in CI for stability
 * - HTML, JSON, and list reporters
 * - Artifact retention for debugging
 *
 * Performance Considerations:
 * - Parallel execution in local development
 * - 2-minute server startup timeout
 * - Trace collection only on retry (reduces overhead)
 *
 * @module playwright.config
 * @see https://playwright.dev/docs/test-configuration
 * @see https://playwright.dev/docs/test-sharding
 * @version 1.0.0
 * @since 2025-10-26
 */

import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * Uncomment to load .env file for E2E test configuration.
 * @see https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * Playwright test configuration for White Cross healthcare platform.
 *
 * @type {import('@playwright/test').PlaywrightTestConfig}
 */
export default defineConfig({
  // E2E test directory location
  testDir: './tests/e2e',

  // Run tests within each file in parallel for faster execution
  fullyParallel: true,

  // Prevent accidental test.only commits in CI builds
  // Ensures all tests run in production pipelines
  forbidOnly: !!process.env.CI,

  // Retry failed tests in CI only (2 retries)
  // Helps handle flaky tests in automated pipelines
  // No retries in local development for faster feedback
  retries: process.env.CI ? 2 : 0,

  // Workers configuration for parallel execution
  // CI: 1 worker (serial) for stability and resource constraints
  // Local: Undefined (uses CPU core count) for speed
  workers: process.env.CI ? 1 : undefined,

  // Test reporters for different output formats
  // - HTML: Interactive report with screenshots/videos (playwright-report/)
  // - JSON: Machine-readable results for CI/CD integration
  // - List: Console output with test names and status
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['list'],
  ],

  // Shared settings applied to all browser projects
  use: {
    // Base URL for all navigation (page.goto('/') -> http://localhost:3000/)
    // Configure via PLAYWRIGHT_BASE_URL env var for different environments
    baseURL: 'http://localhost:3000',

    // Trace collection strategy (on-first-retry)
    // Collects detailed trace only when test retries
    // Reduces storage overhead while enabling debugging
    trace: 'on-first-retry',

    // Screenshot capture strategy (only-on-failure)
    // Captures visual state when healthcare workflows fail
    // Aids in debugging authentication, form submissions, etc.
    screenshot: 'only-on-failure',

    // Video recording strategy (retain-on-failure)
    // Records full test execution video only for failed tests
    // Critical for debugging complex healthcare workflows
    video: 'retain-on-failure',
  },

  // Browser and device configurations for cross-platform testing
  // Tests healthcare workflows across desktop and mobile devices
  projects: [
    // Desktop Chrome (Chromium)
    // Most common browser for school nurses accessing White Cross
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    // Desktop Firefox
    // Alternative browser for school district IT restrictions
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    // Desktop Safari (WebKit)
    // Primary browser for Mac-based school environments
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    // Mobile Chrome (Android)
    // School nurses accessing system from mobile devices
    // Tests responsive healthcare dashboards on Android
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },

    // Mobile Safari (iOS)
    // School nurses accessing system from iPads/iPhones
    // Tests responsive healthcare dashboards on iOS
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  // Development server configuration
  // Automatically starts Next.js dev server before running tests
  webServer: {
    // Command to start the development server
    command: 'npm run dev',

    // URL to wait for before starting tests
    // Ensures healthcare application is fully loaded
    url: 'http://localhost:3000',

    // Reuse existing server in local development (faster iteration)
    // Always start fresh server in CI for consistency
    reuseExistingServer: !process.env.CI,

    // Server startup timeout (2 minutes)
    // Allows time for Next.js compilation and healthcare data initialization
    timeout: 120000,
  },
});

