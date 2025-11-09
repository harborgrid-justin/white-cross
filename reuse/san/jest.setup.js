"use strict";
/**
 * Jest Setup for SAN Testing
 *
 * This file runs after the test framework is initialized but before tests run.
 * Use it to configure global test settings, polyfills, and custom matchers.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.teardownTestEnvironment = exports.setupTestEnvironment = void 0;
// Extend Jest matchers with custom assertions
expect.extend({
    /**
     * Custom matcher to check if a value is a valid SAN volume ID
     */
    toBeValidSANVolumeId(received) {
        const pass = /^vol-[a-z0-9]+$/.test(received);
        return {
            pass,
            message: () => pass
                ? `expected ${received} not to be a valid SAN volume ID`
                : `expected ${received} to be a valid SAN volume ID (format: vol-xxxxx)`,
        };
    },
    /**
     * Custom matcher to check if a value is a valid LUN number
     */
    toBeValidLUNNumber(received) {
        const pass = Number.isInteger(received) && received >= 0 && received <= 255;
        return {
            pass,
            message: () => pass
                ? `expected ${received} not to be a valid LUN number`
                : `expected ${received} to be a valid LUN number (0-255)`,
        };
    },
    /**
     * Custom matcher to check if a value is a valid WWN
     */
    toBeValidWWN(received) {
        const pass = /^[0-9a-f]{2}(:[0-9a-f]{2}){7}$/.test(received);
        return {
            pass,
            message: () => pass
                ? `expected ${received} not to be a valid WWN`
                : `expected ${received} to be a valid WWN (format: xx:xx:xx:xx:xx:xx:xx:xx)`,
        };
    },
    /**
     * Custom matcher to check if a value is a valid IQN
     */
    toBeValidIQN(received) {
        const pass = /^iqn\.\d{4}-\d{2}\.[a-z0-9.-]+:[a-z0-9-]+$/.test(received);
        return {
            pass,
            message: () => pass
                ? `expected ${received} not to be a valid IQN`
                : `expected ${received} to be a valid IQN (format: iqn.YYYY-MM.domain:identifier)`,
        };
    },
    /**
     * Custom matcher to check if a value is within performance threshold
     */
    toBeWithinPerformanceThreshold(received, expected, tolerance = 0.1) {
        const lowerBound = expected * (1 - tolerance);
        const upperBound = expected * (1 + tolerance);
        const pass = received >= lowerBound && received <= upperBound;
        return {
            pass,
            message: () => pass
                ? `expected ${received} not to be within ${tolerance * 100}% of ${expected}`
                : `expected ${received} to be within ${tolerance * 100}% of ${expected} (${lowerBound}-${upperBound})`,
        };
    },
    /**
     * Custom matcher to check if an object has required SAN volume properties
     */
    toHaveRequiredVolumeProperties(received) {
        const requiredProps = ['id', 'name', 'capacity', 'capacityUnit', 'type', 'status'];
        const missingProps = requiredProps.filter((prop) => !(prop in received));
        const pass = missingProps.length === 0;
        return {
            pass,
            message: () => pass
                ? `expected object not to have all required volume properties`
                : `expected object to have required volume properties. Missing: ${missingProps.join(', ')}`,
        };
    },
});
// Set global test timeout
jest.setTimeout(10000);
// Mock console methods in tests (uncomment if needed)
// global.console = {
//   ...console,
//   log: jest.fn(),
//   debug: jest.fn(),
//   info: jest.fn(),
//   warn: jest.fn(),
//   error: jest.fn(),
// };
// Global test utilities
global.testHelpers = {
    /**
     * Wait for a specified amount of time
     */
    wait: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
    /**
     * Generate a random string for testing
     */
    randomString: (length = 8) => {
        return Math.random().toString(36).substring(2, 2 + length);
    },
    /**
     * Create a mock Date that returns a fixed timestamp
     */
    mockDate: (isoString) => {
        const mockDate = new Date(isoString);
        jest.spyOn(global, 'Date').mockImplementation(() => mockDate);
    },
    /**
     * Restore the real Date implementation
     */
    restoreDate: () => {
        global.Date.mockRestore?.();
    },
};
// Setup before all tests
beforeAll(() => {
    // Set environment variables for testing
    process.env.NODE_ENV = 'test';
    process.env.LOG_LEVEL = 'error'; // Reduce logging noise in tests
    // Initialize any global test fixtures
    console.log('🚀 Starting SAN test suite...');
});
// Cleanup after all tests
afterAll(() => {
    console.log('✅ SAN test suite completed');
});
// Setup before each test
beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
});
// Cleanup after each test
afterEach(() => {
    // Restore all mocks after each test
    jest.restoreAllMocks();
});
// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection in test:', reason);
    // You can choose to fail the test here
    // throw reason;
});
// Export setup utilities
const setupTestEnvironment = () => {
    // Any additional setup can go here
};
exports.setupTestEnvironment = setupTestEnvironment;
const teardownTestEnvironment = () => {
    // Any additional teardown can go here
};
exports.teardownTestEnvironment = teardownTestEnvironment;
//# sourceMappingURL=jest.setup.js.map