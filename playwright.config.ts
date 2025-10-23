import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration for API Integration Testing
 * Configures 8 parallel workers to test frontend-backend communication
 */
export default defineConfig({
  testDir: './tests/api-integration',
  
  // Run tests in parallel with 8 workers
  fullyParallel: true,
  workers: 8,
  
  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,
  
  // Retry on CI only
  retries: process.env.CI ? 2 : 0,
  
  // Reporter to use
  reporter: [
    ['list'],
    ['html', { outputFolder: 'test-results/html' }],
    ['json', { outputFile: 'test-results/results.json' }]
  ],
  
  // Shared test configuration
  use: {
    // Base URL for API requests
    baseURL: process.env.API_BASE_URL || 'http://localhost:3001',
    
    // Collect trace on first retry
    trace: 'on-first-retry',
    
    // API request timeout
    actionTimeout: 30000,
    navigationTimeout: 30000,
  },

  // Configure projects for different test suites
  projects: [
    {
      name: 'authentication-apis',
      testMatch: '**/01-auth-apis.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'students-apis',
      testMatch: '**/02-students-apis.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'health-records-apis',
      testMatch: '**/03-health-records-apis.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'medications-apis',
      testMatch: '**/04-medications-apis.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'documents-apis',
      testMatch: '**/05-documents-apis.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'appointments-apis',
      testMatch: '**/06-appointments-apis.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'communications-apis',
      testMatch: '**/07-communications-apis.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'compliance-analytics-apis',
      testMatch: '**/08-compliance-analytics-apis.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Run local dev server before starting tests
  webServer: process.env.SKIP_SERVER_START ? undefined : {
    command: 'npm run dev:backend',
    url: 'http://localhost:3001/health',
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  },
});
