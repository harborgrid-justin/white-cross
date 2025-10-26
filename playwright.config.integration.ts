import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration for Integration Testing
 * Comprehensive integration tests for White Cross platform
 */
export default defineConfig({
  testDir: './tests/integration',

  // Run tests in parallel with maximum workers
  fullyParallel: true,
  workers: process.env.CI ? 4 : 8,

  // Fail the build on CI if you accidentally left test.only
  forbidOnly: !!process.env.CI,

  // Retry on CI only
  retries: process.env.CI ? 2 : 0,

  // Reporter configuration
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report/integration', open: 'never' }],
    ['json', { outputFile: 'playwright-report/integration-results.json' }],
    ['junit', { outputFile: 'playwright-report/integration-junit.xml' }],
  ],

  // Global timeout
  timeout: 60000, // 60 seconds per test
  expect: {
    timeout: 10000, // 10 seconds for assertions
  },

  // Shared test configuration
  use: {
    // Base URL for API requests
    baseURL: process.env.API_BASE_URL || 'http://localhost:3001',

    // Collect trace on first retry
    trace: 'on-first-retry',

    // Screenshot on failure
    screenshot: 'only-on-failure',

    // Video on failure
    video: 'retain-on-failure',

    // API request timeout
    actionTimeout: 30000,
    navigationTimeout: 30000,
  },

  // Configure projects for different test suites
  projects: [
    // Module Tests
    {
      name: 'students-module',
      testMatch: '**/modules/students.integration.test.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'medications-module',
      testMatch: '**/modules/medications.integration.test.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'appointments-module',
      testMatch: '**/modules/appointments.integration.test.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'health-records-module',
      testMatch: '**/modules/health-records.integration.test.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'incidents-module',
      testMatch: '**/modules/incidents.integration.test.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'inventory-module',
      testMatch: '**/modules/inventory.integration.test.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'communications-module',
      testMatch: '**/modules/communications.integration.test.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'compliance-module',
      testMatch: '**/modules/compliance.integration.test.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'analytics-module',
      testMatch: '**/modules/analytics.integration.test.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'admin-module',
      testMatch: '**/modules/admin.integration.test.ts',
      use: { ...devices['Desktop Chrome'] },
    },

    // Workflow Tests
    {
      name: 'medication-workflow',
      testMatch: '**/workflows/medication-administration.test.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'appointment-workflow',
      testMatch: '**/workflows/appointment-scheduling.test.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'incident-workflow',
      testMatch: '**/workflows/incident-reporting.test.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'student-health-workflow',
      testMatch: '**/workflows/student-health-tracking.test.ts',
      use: { ...devices['Desktop Chrome'] },
    },

    // Auth Tests
    {
      name: 'auth-login',
      testMatch: '**/auth/login.test.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'auth-rbac',
      testMatch: '**/auth/rbac.test.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'auth-session',
      testMatch: '**/auth/session.test.ts',
      use: { ...devices['Desktop Chrome'] },
    },

    // HIPAA Compliance Tests
    {
      name: 'hipaa-audit-logging',
      testMatch: '**/hipaa/audit-logging.test.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'hipaa-phi-access',
      testMatch: '**/hipaa/phi-access.test.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'hipaa-data-encryption',
      testMatch: '**/hipaa/data-encryption.test.ts',
      use: { ...devices['Desktop Chrome'] },
    },

    // Performance Tests
    {
      name: 'performance-api',
      testMatch: '**/performance/api-response.test.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'performance-page-load',
      testMatch: '**/performance/page-load.test.ts',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Run local dev server before starting tests
  webServer: process.env.SKIP_SERVER_START ? undefined : {
    command: 'npm run dev:backend',
    url: 'http://localhost:3001/health',
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
    stdout: 'pipe',
    stderr: 'pipe',
  },
});
