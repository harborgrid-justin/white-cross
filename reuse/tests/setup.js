"use strict";
/**
 * Jest Test Setup
 * Global test configuration and setup
 */
// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret';
process.env.DATABASE_URL = 'sqlite::memory:';
// Global test timeout
jest.setTimeout(30000);
// Mock console methods to reduce noise in tests
global.console = {
    ...console,
    error: jest.fn(),
    warn: jest.fn(),
    log: jest.fn(),
    info: jest.fn(),
    debug: jest.fn(),
};
// Clean up after each test
afterEach(() => {
    jest.clearAllMocks();
});
global.testUtils = {
    /**
     * Wait for specified milliseconds
     * @param ms - Milliseconds to wait
     */
    wait: (ms) => {
        return new Promise((resolve) => setTimeout(resolve, ms));
    },
    /**
     * Mock the current date
     * @param date - Date to mock
     */
    mockDate: (date) => {
        jest.spyOn(global.Date, 'now').mockReturnValue(date.getTime());
    },
    /**
     * Restore the original date
     */
    restoreDate: () => {
        jest.restoreAllMocks();
    },
};
//# sourceMappingURL=setup.js.map