/**
 * Mock Service Worker (MSW) Server Setup
 *
 * Configures MSW server for Node.js test environment.
 * Intercepts HTTP requests during tests and returns mock responses.
 *
 * @module tests/mocks/server
 */

import { setupServer } from 'msw/node';
import { handlers } from './handlers';

/**
 * Create MSW server instance with default handlers
 */
export const server = setupServer(...handlers);

/**
 * Start server before all tests
 */
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'warn' });
});

/**
 * Reset handlers after each test to ensure test isolation
 */
afterEach(() => {
  server.resetHandlers();
});

/**
 * Clean up after all tests complete
 */
afterAll(() => {
  server.close();
});

export { handlers };
