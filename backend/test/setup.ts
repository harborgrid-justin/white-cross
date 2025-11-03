/**
 * Jest E2E Test Setup
 *
 * Global setup and teardown for end-to-end tests.
 * Configures test database, environment, and utilities.
 */

beforeAll(() => {
  console.log('🧪 Setting up E2E test environment...');

  // Set test environment variables
  process.env.NODE_ENV = 'test';
  process.env.DATABASE_URL = 'sqlite::memory:';
  process.env.JWT_SECRET = 'test-secret-key-for-e2e-tests';
  process.env.JWT_EXPIRATION = '1h';

  console.log('✅ E2E test environment configured');
});

afterAll(async () => {
  console.log('🧹 Cleaning up E2E test environment...');

  // Cleanup resources
  await new Promise(resolve => setTimeout(resolve, 1000));

  console.log('✅ E2E test cleanup complete');
});

// Increase timeout for E2E tests
jest.setTimeout(30000);

// Global error handler for unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection in E2E tests:', reason);
});
