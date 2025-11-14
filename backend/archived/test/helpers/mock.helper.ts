/**
 * Mock Helper
 *
 * Utilities for creating common mocks used across tests.
 */

export class MockHelper {
  /**
   * Create a mock Sequelize model
   */
  static createMockModel() {
    return {
      findAll: jest.fn(),
      findOne: jest.fn(),
      findByPk: jest.fn(),
      findAndCountAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      destroy: jest.fn(),
      count: jest.fn(),
      bulkCreate: jest.fn(),
      sum: jest.fn(),
      max: jest.fn(),
      min: jest.fn(),
    };
  }

  /**
   * Create a mock ConfigService
   */
  static createMockConfigService(config: Record<string, any> = {}) {
    const defaultConfig = {
      NODE_ENV: 'test',
      DATABASE_URL: 'sqlite::memory:',
      JWT_SECRET: 'test-secret',
      JWT_EXPIRATION: '1h',
      JWT_REFRESH_SECRET: 'test-refresh-secret',
      ...config,
    };

    return {
      get: jest.fn((key: string, defaultValue?: any) => {
        return defaultConfig[key] !== undefined ? defaultConfig[key] : defaultValue;
      }),
      getOrThrow: jest.fn((key: string) => {
        const value = defaultConfig[key];
        if (value === undefined) {
          throw new Error(`Configuration key "${key}" not found`);
        }
        return value;
      }),
    };
  }

  /**
   * Create a mock JwtService
   */
  static createMockJwtService() {
    return {
      sign: jest.fn().mockReturnValue('mock-jwt-token'),
      verify: jest.fn().mockReturnValue({ sub: 'user-id', email: 'test@example.com' }),
      decode: jest.fn(),
    };
  }

  /**
   * Create a mock Logger
   */
  static createMockLogger() {
    return {
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
      verbose: jest.fn(),
    };
  }

  /**
   * Create a mock Sequelize instance
   */
  static createMockSequelize() {
    return {
      query: jest.fn(),
      transaction: jest.fn(),
      authenticate: jest.fn(),
      close: jest.fn(),
      sync: jest.fn(),
      models: {},
    };
  }

  /**
   * Clear all mocks
   */
  static clearAllMocks() {
    jest.clearAllMocks();
  }

  /**
   * Reset all mocks
   */
  static resetAllMocks() {
    jest.resetAllMocks();
  }
}
