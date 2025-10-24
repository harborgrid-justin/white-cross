import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration for White Cross Healthcare Management System
 * Migrated from Cypress configuration with enterprise-grade settings
 *
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // Test directory
  testDir: './tests/e2e',

  // Test file pattern
  testMatch: '**/*.spec.ts',

  // Run tests in files in parallel
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // Retry configuration for flaky test resilience (matching Cypress)
  retries: process.env.CI ? 2 : 0,

  // Opt out of parallel tests on CI for more predictable results
  workers: process.env.CI ? 1 : undefined,

  // Reporter configuration - multiple reporters for different purposes
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'playwright-report/results.json' }],
    ['junit', { outputFile: 'playwright-report/results.xml' }],
    ['list']
  ],

  // Global timeout settings (matching Cypress timeouts)
  timeout: 60000, // 60s - matches Cypress pageLoadTimeout
  expect: {
    timeout: 10000 // 10s - matches Cypress defaultCommandTimeout
  },

  // Shared settings for all projects
  use: {
    // Base URL to use in actions like `await page.goto('/')`
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:5173',

    // Collect trace when retrying the failed test
    trace: 'on-first-retry',

    // Record video only on failure (matching Cypress behavior)
    video: 'retain-on-failure',

    // Screenshots on failure (matching Cypress)
    screenshot: 'only-on-failure',

    // Navigation timeout (matching Cypress)
    navigationTimeout: 60000,

    // Action timeout (matching Cypress defaultCommandTimeout)
    actionTimeout: 10000,

    // Viewport settings for healthcare applications (matching Cypress)
    viewport: { width: 1440, height: 900 },

    // Ignore HTTPS errors (matching Cypress chromeWebSecurity: false)
    ignoreHTTPSErrors: true,

    // Extra HTTP headers
    extraHTTPHeaders: {
      'Accept-Language': 'en-US,en;q=0.9'
    },

    // Locale and timezone
    locale: 'en-US',
    timezoneId: 'America/New_York',

    // Context options for better test reliability
    contextOptions: {
      strictSelectors: true
    }
  },

  // Configure projects for major browsers
  projects: [
    // Desktop Browsers
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 }
      }
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        viewport: { width: 1440, height: 900 }
      }
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        viewport: { width: 1440, height: 900 }
      }
    },

    // Mobile browsers (optional - uncomment if needed for healthcare mobile testing)
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    // Tablet browsers (optional - useful for healthcare applications)
    // {
    //   name: 'iPad',
    //   use: { ...devices['iPad Pro'] },
    // }
  ],

  // Global setup and teardown
  globalSetup: undefined, // Can add global setup file if needed
  globalTeardown: undefined, // Can add global teardown file if needed

  // Output folder for test artifacts
  outputDir: 'test-results/',

  // Folder for screenshots and videos
  snapshotDir: 'tests/snapshots',

  // Whether to preserve output between runs
  preserveOutput: 'always',

  // Maximum number of failures before stopping all tests
  maxFailures: process.env.CI ? 10 : undefined,

  // Web server configuration - start dev server before tests
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120000, // 2 minutes to start server
    stdout: 'ignore',
    stderr: 'pipe'
  },

  // Grep configuration for filtering tests
  grep: process.env.TEST_GREP ? new RegExp(process.env.TEST_GREP) : undefined,
  grepInvert: process.env.TEST_GREP_INVERT ? new RegExp(process.env.TEST_GREP_INVERT) : undefined
});
