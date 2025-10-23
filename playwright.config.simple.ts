import { defineConfig, devices } from '@playwright/test';

/**
 * Simple Playwright Configuration for Parallel Execution Testing
 * Tests parallel execution without requiring backend server
 */
export default defineConfig({
  testDir: './tests/api-integration',
  testMatch: 'verify-parallel-execution.spec.ts',
  
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
    ['html', { outputFolder: 'playwright-report/simple' }],
  ],
  
  // Shared test configuration
  use: {
    // Collect trace on first retry
    trace: 'on-first-retry',
    
    // API request timeout
    actionTimeout: 10000,
  },

  // Single project for simple parallel testing
  projects: [
    {
      name: 'parallel-verification',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
