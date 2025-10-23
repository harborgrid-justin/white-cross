/**
 * Jest Test Setup and Configuration
 * Global test environment setup, mocks, and utilities
 */

import { Sequelize } from 'sequelize';

// ============================================================================
// DATABASE MOCKING
// ============================================================================

/**
 * Mock Sequelize database connection
 * Note: SQLite is optional. Tests use mocked repositories instead.
 */
export const mockSequelize: any = null; // Disabled - using mock repositories instead

/**
 * Initialize test database
 * Called before all tests
 */
export async function initializeTestDatabase(): Promise<void> {
  try {
    await mockSequelize.authenticate();
    await mockSequelize.sync({ force: true });
  } catch (error) {
    console.error('Unable to initialize test database:', error);
    throw error;
  }
}

/**
 * Clean up test database
 * Called after all tests
 */
export async function cleanupTestDatabase(): Promise<void> {
  try {
    await mockSequelize.close();
  } catch (error) {
    console.error('Unable to cleanup test database:', error);
  }
}

/**
 * Reset test database between tests
 * Truncates all tables
 */
export async function resetTestDatabase(): Promise<void> {
  try {
    await mockSequelize.truncate({ cascade: true, restartIdentity: true });
  } catch (error) {
    console.error('Unable to reset test database:', error);
    throw error;
  }
}

// ============================================================================
// GLOBAL MOCKS
// ============================================================================

/**
 * Mock logger to prevent console noise during tests
 */
jest.mock('../utils/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  },
}));

/**
 * Mock Winston logger (used by shared/logging/logger)
 */
jest.mock('../shared/logging/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  },
}));

// ============================================================================
// TEST UTILITIES
// ============================================================================

/**
 * Generate mock UUID for testing
 */
export function generateMockUUID(): string {
  return '123e4567-e89b-12d3-a456-426614174000';
}

/**
 * Generate unique mock UUID with counter
 */
let uuidCounter = 0;
export function generateUniqueUUID(): string {
  uuidCounter++;
  const hex = uuidCounter.toString(16).padStart(12, '0');
  return `123e4567-e89b-12d3-a456-${hex}`;
}

/**
 * Reset UUID counter between tests
 */
export function resetUUIDCounter(): void {
  uuidCounter = 0;
}

/**
 * Create mock user for testing
 */
export function createMockUser(overrides?: any) {
  return {
    id: generateUniqueUUID(),
    email: `test${uuidCounter}@example.com`,
    firstName: 'Test',
    lastName: 'User',
    role: 'NURSE',
    isActive: true,
    ...overrides,
  };
}

/**
 * Create mock student for testing
 */
export function createMockStudent(overrides?: any) {
  return {
    id: generateUniqueUUID(),
    firstName: 'Student',
    lastName: 'Test',
    studentNumber: `STU${1000 + uuidCounter}`,
    gradeLevel: '9',
    dateOfBirth: new Date('2010-01-01'),
    gender: 'M',
    isActive: true,
    ...overrides,
  };
}

/**
 * Create mock medication for testing
 */
export function createMockMedication(overrides?: any) {
  return {
    id: generateUniqueUUID(),
    name: 'Amoxicillin',
    genericName: 'Amoxicillin',
    dosageForm: 'Capsule',
    strength: '500mg',
    manufacturer: 'Generic Pharma',
    ndc: '12345-1234-12',
    isControlled: false,
    isActive: true,
    ...overrides,
  };
}

/**
 * Create mock audit log entry for testing
 */
export function createMockAuditEntry(overrides?: any) {
  return {
    id: generateUniqueUUID(),
    userId: generateMockUUID(),
    action: 'READ',
    entityType: 'Student',
    entityId: generateMockUUID(),
    changes: {},
    ipAddress: '127.0.0.1',
    userAgent: 'Jest Test',
    createdAt: new Date(),
    ...overrides,
  };
}

/**
 * Create mock health record for testing
 */
export function createMockHealthRecord(overrides?: any) {
  return {
    id: generateUniqueUUID(),
    studentId: generateMockUUID(),
    recordType: 'VITAL_SIGNS',
    recordDate: new Date(),
    providerId: generateMockUUID(),
    diagnosis: 'Test diagnosis',
    treatment: 'Test treatment',
    followUpRequired: false,
    isActive: true,
    ...overrides,
  };
}

// ============================================================================
// MOCK REPOSITORIES
// ============================================================================

/**
 * Create mock repository with common CRUD operations
 */
export function createMockRepository<T>() {
  const store: T[] = [];

  return {
    store,
    findAll: jest.fn().mockResolvedValue(store),
    findByPk: jest.fn((id: string) =>
      Promise.resolve(store.find((item: any) => item.id === id) || null)
    ),
    findOne: jest.fn((options: any) => {
      const result = store.find((item: any) => {
        if (options.where) {
          return Object.keys(options.where).every(
            key => (item as any)[key] === options.where[key]
          );
        }
        return false;
      });
      return Promise.resolve(result || null);
    }),
    findAndCountAll: jest.fn((options: any) => {
      const { limit = 20, offset = 0 } = options;
      const rows = store.slice(offset, offset + limit);
      return Promise.resolve({ rows, count: store.length });
    }),
    create: jest.fn((data: Partial<T>) => {
      const newItem = { ...data, id: generateUniqueUUID() } as T;
      store.push(newItem);
      return Promise.resolve(newItem);
    }),
    update: jest.fn((data: Partial<T>, options: any) => {
      const item = store.find((i: any) => i.id === options.where.id);
      if (item) {
        Object.assign(item, data);
        return Promise.resolve([1, [item]]);
      }
      return Promise.resolve([0, []]);
    }),
    destroy: jest.fn((options: any) => {
      const index = store.findIndex((item: any) => item.id === options.where.id);
      if (index >= 0) {
        store.splice(index, 1);
        return Promise.resolve(1);
      }
      return Promise.resolve(0);
    }),
    count: jest.fn(() => Promise.resolve(store.length)),
    bulkCreate: jest.fn((items: Partial<T>[]) => {
      const newItems = items.map(item => ({ ...item, id: generateUniqueUUID() } as T));
      store.push(...newItems);
      return Promise.resolve(newItems);
    }),
    _reset: () => {
      store.length = 0;
    },
  };
}

// ============================================================================
// JEST HOOKS
// ============================================================================

/**
 * Global setup before all tests
 */
beforeAll(async () => {
  // Initialize test database if needed
  // await initializeTestDatabase();
});

/**
 * Global cleanup after all tests
 */
afterAll(async () => {
  // Cleanup test database if needed
  // await cleanupTestDatabase();
});

/**
 * Reset between each test
 */
beforeEach(() => {
  // Clear all mocks
  jest.clearAllMocks();

  // Reset UUID counter
  resetUUIDCounter();
});

/**
 * Cleanup after each test
 */
afterEach(async () => {
  // Reset database if needed
  // await resetTestDatabase();
});

// ============================================================================
// TEST ENVIRONMENT CONFIGURATION
// ============================================================================

/**
 * Set test environment variables
 */
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key';
process.env.LOG_LEVEL = 'error'; // Reduce log noise

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  mockSequelize,
  initializeTestDatabase,
  cleanupTestDatabase,
  resetTestDatabase,
  generateMockUUID,
  generateUniqueUUID,
  createMockUser,
  createMockStudent,
  createMockMedication,
  createMockAuditEntry,
  createMockHealthRecord,
  createMockRepository,
};
