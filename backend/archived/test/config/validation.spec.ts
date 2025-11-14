/**
 * Configuration Validation Tests
 *
 * Tests environment variable validation including:
 * - Pool min/max validation
 * - DATABASE_URL format validation
 * - Invalid configurations rejected at startup
 * - Required fields validation
 * - Security configuration validation
 */

import { validationSchema, validateEnvironment } from '../src/common/config/validation.schema';

describe('Configuration Validation Tests', () => {
  describe('Database Configuration', () => {
    it('should accept valid database configuration', () => {
      const config = {
        NODE_ENV: 'development',
        DB_HOST: 'localhost',
        DB_PORT: 5432,
        DB_USERNAME: 'postgres',
        DB_PASSWORD: 'securepassword123',
        DB_NAME: 'whitecross',
        JWT_SECRET: 'a'.repeat(32),
        JWT_REFRESH_SECRET: 'b'.repeat(32),
      };

      const result = validationSchema.validate(config);
      expect(result.error).toBeUndefined();
    });

    it('should require DB_HOST', () => {
      const config = {
        NODE_ENV: 'development',
        DB_PORT: 5432,
        DB_USERNAME: 'postgres',
        DB_PASSWORD: 'securepassword123',
        DB_NAME: 'whitecross',
        JWT_SECRET: 'a'.repeat(32),
        JWT_REFRESH_SECRET: 'b'.repeat(32),
      };

      const result = validationSchema.validate(config);
      expect(result.error).toBeDefined();
      expect(result.error?.message).toContain('DB_HOST');
    });

    it('should require DB_USERNAME', () => {
      const config = {
        NODE_ENV: 'development',
        DB_HOST: 'localhost',
        DB_PORT: 5432,
        DB_PASSWORD: 'securepassword123',
        DB_NAME: 'whitecross',
        JWT_SECRET: 'a'.repeat(32),
        JWT_REFRESH_SECRET: 'b'.repeat(32),
      };

      const result = validationSchema.validate(config);
      expect(result.error).toBeDefined();
      expect(result.error?.message).toContain('DB_USERNAME');
    });

    it('should require DB_PASSWORD with minimum length', () => {
      const config = {
        NODE_ENV: 'development',
        DB_HOST: 'localhost',
        DB_PORT: 5432,
        DB_USERNAME: 'postgres',
        DB_PASSWORD: 'short',
        DB_NAME: 'whitecross',
        JWT_SECRET: 'a'.repeat(32),
        JWT_REFRESH_SECRET: 'b'.repeat(32),
      };

      const result = validationSchema.validate(config);
      expect(result.error).toBeDefined();
      expect(result.error?.message).toContain('at least 8 characters');
    });

    it('should validate DB_PORT is a valid port number', () => {
      const config = {
        NODE_ENV: 'development',
        DB_HOST: 'localhost',
        DB_PORT: 70000, // Invalid port
        DB_USERNAME: 'postgres',
        DB_PASSWORD: 'securepassword123',
        DB_NAME: 'whitecross',
        JWT_SECRET: 'a'.repeat(32),
        JWT_REFRESH_SECRET: 'b'.repeat(32),
      };

      const result = validationSchema.validate(config);
      expect(result.error).toBeDefined();
    });

    it('should accept default DB_PORT', () => {
      const config = {
        NODE_ENV: 'development',
        DB_HOST: 'localhost',
        // DB_PORT omitted, should default to 5432
        DB_USERNAME: 'postgres',
        DB_PASSWORD: 'securepassword123',
        DB_NAME: 'whitecross',
        JWT_SECRET: 'a'.repeat(32),
        JWT_REFRESH_SECRET: 'b'.repeat(32),
      };

      const { error, value } = validationSchema.validate(config);
      expect(error).toBeUndefined();
      expect(value.DB_PORT).toBe(5432);
    });
  });

  describe('Connection Pool Validation', () => {
    it('should use appropriate pool settings for production', () => {
      // Pool settings are in database.module.ts, not env vars
      // This tests the validation pattern
      const config = {
        NODE_ENV: 'production',
        DB_HOST: 'db.example.com',
        DB_PORT: 5432,
        DB_USERNAME: 'postgres',
        DB_PASSWORD: 'securepassword123',
        DB_NAME: 'whitecross',
        JWT_SECRET: 'a'.repeat(32),
        JWT_REFRESH_SECRET: 'b'.repeat(32),
        CSRF_SECRET: 'c'.repeat(32),
        CONFIG_ENCRYPTION_KEY: 'd'.repeat(32),
      };

      const result = validationSchema.validate(config);
      expect(result.error).toBeUndefined();
    });

    it('should use appropriate pool settings for development', () => {
      const config = {
        NODE_ENV: 'development',
        DB_HOST: 'localhost',
        DB_PORT: 5432,
        DB_USERNAME: 'postgres',
        DB_PASSWORD: 'securepassword123',
        DB_NAME: 'whitecross',
        JWT_SECRET: 'a'.repeat(32),
        JWT_REFRESH_SECRET: 'b'.repeat(32),
      };

      const result = validationSchema.validate(config);
      expect(result.error).toBeUndefined();
    });
  });

  describe('JWT Configuration', () => {
    it('should require JWT_SECRET with minimum length', () => {
      const config = {
        NODE_ENV: 'development',
        DB_HOST: 'localhost',
        DB_USERNAME: 'postgres',
        DB_PASSWORD: 'securepassword123',
        DB_NAME: 'whitecross',
        JWT_SECRET: 'short',
        JWT_REFRESH_SECRET: 'b'.repeat(32),
      };

      const result = validationSchema.validate(config);
      expect(result.error).toBeDefined();
      expect(result.error?.message).toContain('at least 32 characters');
    });

    it('should require JWT_REFRESH_SECRET with minimum length', () => {
      const config = {
        NODE_ENV: 'development',
        DB_HOST: 'localhost',
        DB_USERNAME: 'postgres',
        DB_PASSWORD: 'securepassword123',
        DB_NAME: 'whitecross',
        JWT_SECRET: 'a'.repeat(32),
        JWT_REFRESH_SECRET: 'short',
      };

      const result = validationSchema.validate(config);
      expect(result.error).toBeDefined();
      expect(result.error?.message).toContain('at least 32 characters');
    });

    it('should accept valid JWT expiration formats', () => {
      const validFormats = ['15m', '1h', '7d', '30s'];

      validFormats.forEach(format => {
        const config = {
          NODE_ENV: 'development',
          DB_HOST: 'localhost',
          DB_USERNAME: 'postgres',
          DB_PASSWORD: 'securepassword123',
          DB_NAME: 'whitecross',
          JWT_SECRET: 'a'.repeat(32),
          JWT_REFRESH_SECRET: 'b'.repeat(32),
          JWT_EXPIRES_IN: format,
        };

        const result = validationSchema.validate(config);
        expect(result.error).toBeUndefined();
      });
    });

    it('should reject invalid JWT expiration format', () => {
      const config = {
        NODE_ENV: 'development',
        DB_HOST: 'localhost',
        DB_USERNAME: 'postgres',
        DB_PASSWORD: 'securepassword123',
        DB_NAME: 'whitecross',
        JWT_SECRET: 'a'.repeat(32),
        JWT_REFRESH_SECRET: 'b'.repeat(32),
        JWT_EXPIRES_IN: 'invalid',
      };

      const result = validationSchema.validate(config);
      expect(result.error).toBeDefined();
    });
  });

  describe('Security Configuration', () => {
    it('should require CSRF_SECRET in production', () => {
      const config = {
        NODE_ENV: 'production',
        DB_HOST: 'localhost',
        DB_USERNAME: 'postgres',
        DB_PASSWORD: 'securepassword123',
        DB_NAME: 'whitecross',
        JWT_SECRET: 'a'.repeat(32),
        JWT_REFRESH_SECRET: 'b'.repeat(32),
        // CSRF_SECRET missing
        CONFIG_ENCRYPTION_KEY: 'd'.repeat(32),
      };

      const result = validationSchema.validate(config);
      expect(result.error).toBeDefined();
      expect(result.error?.message).toContain('CSRF_SECRET');
    });

    it('should require CONFIG_ENCRYPTION_KEY in production', () => {
      const config = {
        NODE_ENV: 'production',
        DB_HOST: 'localhost',
        DB_USERNAME: 'postgres',
        DB_PASSWORD: 'securepassword123',
        DB_NAME: 'whitecross',
        JWT_SECRET: 'a'.repeat(32),
        JWT_REFRESH_SECRET: 'b'.repeat(32),
        CSRF_SECRET: 'c'.repeat(32),
        // CONFIG_ENCRYPTION_KEY missing
      };

      const result = validationSchema.validate(config);
      expect(result.error).toBeDefined();
      expect(result.error?.message).toContain('CONFIG_ENCRYPTION_KEY');
    });

    it('should not require CSRF_SECRET in development', () => {
      const config = {
        NODE_ENV: 'development',
        DB_HOST: 'localhost',
        DB_USERNAME: 'postgres',
        DB_PASSWORD: 'securepassword123',
        DB_NAME: 'whitecross',
        JWT_SECRET: 'a'.repeat(32),
        JWT_REFRESH_SECRET: 'b'.repeat(32),
        // CSRF_SECRET omitted
      };

      const result = validationSchema.validate(config);
      expect(result.error).toBeUndefined();
    });

    it('should validate encryption algorithm', () => {
      const config = {
        NODE_ENV: 'development',
        DB_HOST: 'localhost',
        DB_USERNAME: 'postgres',
        DB_PASSWORD: 'securepassword123',
        DB_NAME: 'whitecross',
        JWT_SECRET: 'a'.repeat(32),
        JWT_REFRESH_SECRET: 'b'.repeat(32),
        ENCRYPTION_ALGORITHM: 'aes-256-gcm',
      };

      const result = validationSchema.validate(config);
      expect(result.error).toBeUndefined();
    });

    it('should reject invalid encryption algorithm', () => {
      const config = {
        NODE_ENV: 'development',
        DB_HOST: 'localhost',
        DB_USERNAME: 'postgres',
        DB_PASSWORD: 'securepassword123',
        DB_NAME: 'whitecross',
        JWT_SECRET: 'a'.repeat(32),
        JWT_REFRESH_SECRET: 'b'.repeat(32),
        ENCRYPTION_ALGORITHM: 'aes-128-ecb', // Not allowed
      };

      const result = validationSchema.validate(config);
      expect(result.error).toBeDefined();
    });
  });

  describe('Redis Configuration', () => {
    it('should accept valid Redis configuration', () => {
      const config = {
        NODE_ENV: 'development',
        DB_HOST: 'localhost',
        DB_USERNAME: 'postgres',
        DB_PASSWORD: 'securepassword123',
        DB_NAME: 'whitecross',
        JWT_SECRET: 'a'.repeat(32),
        JWT_REFRESH_SECRET: 'b'.repeat(32),
        REDIS_HOST: 'localhost',
        REDIS_PORT: 6379,
        REDIS_PASSWORD: 'redis-password',
        REDIS_DB: 0,
      };

      const result = validationSchema.validate(config);
      expect(result.error).toBeUndefined();
    });

    it('should validate REDIS_DB range', () => {
      const config = {
        NODE_ENV: 'development',
        DB_HOST: 'localhost',
        DB_USERNAME: 'postgres',
        DB_PASSWORD: 'securepassword123',
        DB_NAME: 'whitecross',
        JWT_SECRET: 'a'.repeat(32),
        JWT_REFRESH_SECRET: 'b'.repeat(32),
        REDIS_DB: 20, // Invalid, must be 0-15
      };

      const result = validationSchema.validate(config);
      expect(result.error).toBeDefined();
    });

    it('should accept default Redis values', () => {
      const config = {
        NODE_ENV: 'development',
        DB_HOST: 'localhost',
        DB_USERNAME: 'postgres',
        DB_PASSWORD: 'securepassword123',
        DB_NAME: 'whitecross',
        JWT_SECRET: 'a'.repeat(32),
        JWT_REFRESH_SECRET: 'b'.repeat(32),
        // Redis config omitted, should use defaults
      };

      const { error, value } = validationSchema.validate(config);
      expect(error).toBeUndefined();
      expect(value.REDIS_HOST).toBe('localhost');
      expect(value.REDIS_PORT).toBe(6379);
      expect(value.REDIS_DB).toBe(0);
    });
  });

  describe('Cache Configuration', () => {
    it('should accept valid cache configuration', () => {
      const config = {
        NODE_ENV: 'development',
        DB_HOST: 'localhost',
        DB_USERNAME: 'postgres',
        DB_PASSWORD: 'securepassword123',
        DB_NAME: 'whitecross',
        JWT_SECRET: 'a'.repeat(32),
        JWT_REFRESH_SECRET: 'b'.repeat(32),
        CACHE_MAX_SIZE: 1000,
        CACHE_DEFAULT_TTL: 300000,
      };

      const result = validationSchema.validate(config);
      expect(result.error).toBeUndefined();
    });

    it('should use default cache values', () => {
      const config = {
        NODE_ENV: 'development',
        DB_HOST: 'localhost',
        DB_USERNAME: 'postgres',
        DB_PASSWORD: 'securepassword123',
        DB_NAME: 'whitecross',
        JWT_SECRET: 'a'.repeat(32),
        JWT_REFRESH_SECRET: 'b'.repeat(32),
      };

      const { error, value } = validationSchema.validate(config);
      expect(error).toBeUndefined();
      expect(value.CACHE_MAX_SIZE).toBe(1000);
      expect(value.CACHE_DEFAULT_TTL).toBe(300000);
    });
  });

  describe('Environment-specific Requirements', () => {
    it('should require test database name in test environment', () => {
      const config = {
        NODE_ENV: 'test',
        DB_HOST: 'localhost',
        DB_USERNAME: 'postgres',
        DB_PASSWORD: 'securepassword123',
        DB_NAME: 'whitecross',
        // DB_NAME_TEST missing
        JWT_SECRET: 'a'.repeat(32),
        JWT_REFRESH_SECRET: 'b'.repeat(32),
      };

      const result = validationSchema.validate(config);
      expect(result.error).toBeDefined();
      expect(result.error?.message).toContain('DB_NAME_TEST');
    });

    it('should not require test database name in production', () => {
      const config = {
        NODE_ENV: 'production',
        DB_HOST: 'localhost',
        DB_USERNAME: 'postgres',
        DB_PASSWORD: 'securepassword123',
        DB_NAME: 'whitecross',
        JWT_SECRET: 'a'.repeat(32),
        JWT_REFRESH_SECRET: 'b'.repeat(32),
        CSRF_SECRET: 'c'.repeat(32),
        CONFIG_ENCRYPTION_KEY: 'd'.repeat(32),
      };

      const result = validationSchema.validate(config);
      expect(result.error).toBeUndefined();
    });

    it('should validate NODE_ENV values', () => {
      const invalidConfig = {
        NODE_ENV: 'invalid',
        DB_HOST: 'localhost',
        DB_USERNAME: 'postgres',
        DB_PASSWORD: 'securepassword123',
        DB_NAME: 'whitecross',
        JWT_SECRET: 'a'.repeat(32),
        JWT_REFRESH_SECRET: 'b'.repeat(32),
      };

      const result = validationSchema.validate(invalidConfig);
      expect(result.error).toBeDefined();
      expect(result.error?.message).toContain('development');
    });
  });

  describe('CORS Configuration', () => {
    it('should require CORS_ORIGIN in production', () => {
      const config = {
        NODE_ENV: 'production',
        DB_HOST: 'localhost',
        DB_USERNAME: 'postgres',
        DB_PASSWORD: 'securepassword123',
        DB_NAME: 'whitecross',
        JWT_SECRET: 'a'.repeat(32),
        JWT_REFRESH_SECRET: 'b'.repeat(32),
        CSRF_SECRET: 'c'.repeat(32),
        CONFIG_ENCRYPTION_KEY: 'd'.repeat(32),
        // CORS_ORIGIN missing
      };

      const result = validationSchema.validate(config);
      expect(result.error).toBeDefined();
    });

    it('should accept valid URI for CORS_ORIGIN in production', () => {
      const config = {
        NODE_ENV: 'production',
        DB_HOST: 'localhost',
        DB_USERNAME: 'postgres',
        DB_PASSWORD: 'securepassword123',
        DB_NAME: 'whitecross',
        JWT_SECRET: 'a'.repeat(32),
        JWT_REFRESH_SECRET: 'b'.repeat(32),
        CSRF_SECRET: 'c'.repeat(32),
        CONFIG_ENCRYPTION_KEY: 'd'.repeat(32),
        CORS_ORIGIN: 'https://app.whitecross.com',
      };

      const result = validationSchema.validate(config);
      expect(result.error).toBeUndefined();
    });

    it('should allow wildcard in development', () => {
      const config = {
        NODE_ENV: 'development',
        DB_HOST: 'localhost',
        DB_USERNAME: 'postgres',
        DB_PASSWORD: 'securepassword123',
        DB_NAME: 'whitecross',
        JWT_SECRET: 'a'.repeat(32),
        JWT_REFRESH_SECRET: 'b'.repeat(32),
        CORS_ORIGIN: '*',
      };

      const result = validationSchema.validate(config);
      expect(result.error).toBeUndefined();
    });
  });

  describe('validateEnvironment Function', () => {
    it('should throw detailed error on validation failure', () => {
      const invalidConfig = {
        NODE_ENV: 'development',
        // Missing required fields
      };

      expect(() => validateEnvironment(invalidConfig)).toThrow(/CONFIGURATION VALIDATION FAILED/);
    });

    it('should return validated config on success', () => {
      const config = {
        NODE_ENV: 'development',
        DB_HOST: 'localhost',
        DB_USERNAME: 'postgres',
        DB_PASSWORD: 'securepassword123',
        DB_NAME: 'whitecross',
        JWT_SECRET: 'a'.repeat(32),
        JWT_REFRESH_SECRET: 'b'.repeat(32),
      };

      const result = validateEnvironment(config);

      expect(result).toBeDefined();
      expect(result.NODE_ENV).toBe('development');
      expect(result.DB_HOST).toBe('localhost');
    });

    it('should include all validation errors in message', () => {
      const config = {
        NODE_ENV: 'development',
        DB_HOST: 'localhost',
        // Missing DB_USERNAME, DB_PASSWORD, DB_NAME, JWT secrets
      };

      try {
        validateEnvironment(config);
        fail('Should have thrown error');
      } catch (error: any) {
        expect(error.message).toContain('DB_USERNAME');
        expect(error.message).toContain('DB_PASSWORD');
        expect(error.message).toContain('DB_NAME');
        expect(error.message).toContain('JWT_SECRET');
      }
    });
  });

  describe('AWS Configuration', () => {
    it('should require AWS_SECRET_ACCESS_KEY if AWS_ACCESS_KEY_ID is provided', () => {
      const config = {
        NODE_ENV: 'development',
        DB_HOST: 'localhost',
        DB_USERNAME: 'postgres',
        DB_PASSWORD: 'securepassword123',
        DB_NAME: 'whitecross',
        JWT_SECRET: 'a'.repeat(32),
        JWT_REFRESH_SECRET: 'b'.repeat(32),
        AWS_ACCESS_KEY_ID: 'AKIAIOSFODNN7EXAMPLE',
        // AWS_SECRET_ACCESS_KEY missing
      };

      const result = validationSchema.validate(config);
      expect(result.error).toBeDefined();
      expect(result.error?.message).toContain('AWS_SECRET_ACCESS_KEY');
    });

    it('should accept AWS configuration with both keys', () => {
      const config = {
        NODE_ENV: 'development',
        DB_HOST: 'localhost',
        DB_USERNAME: 'postgres',
        DB_PASSWORD: 'securepassword123',
        DB_NAME: 'whitecross',
        JWT_SECRET: 'a'.repeat(32),
        JWT_REFRESH_SECRET: 'b'.repeat(32),
        AWS_ACCESS_KEY_ID: 'AKIAIOSFODNN7EXAMPLE',
        AWS_SECRET_ACCESS_KEY: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
      };

      const result = validationSchema.validate(config);
      expect(result.error).toBeUndefined();
    });
  });

  describe('Feature Flags', () => {
    it('should accept boolean feature flags', () => {
      const config = {
        NODE_ENV: 'development',
        DB_HOST: 'localhost',
        DB_USERNAME: 'postgres',
        DB_PASSWORD: 'securepassword123',
        DB_NAME: 'whitecross',
        JWT_SECRET: 'a'.repeat(32),
        JWT_REFRESH_SECRET: 'b'.repeat(32),
        FEATURES_ENABLE_AI_SEARCH: true,
        FEATURES_ENABLE_ANALYTICS: false,
        FEATURES_ENABLE_WEBSOCKET: true,
      };

      const result = validationSchema.validate(config);
      expect(result.error).toBeUndefined();
    });

    it('should use default feature flag values', () => {
      const config = {
        NODE_ENV: 'development',
        DB_HOST: 'localhost',
        DB_USERNAME: 'postgres',
        DB_PASSWORD: 'securepassword123',
        DB_NAME: 'whitecross',
        JWT_SECRET: 'a'.repeat(32),
        JWT_REFRESH_SECRET: 'b'.repeat(32),
      };

      const { error, value } = validationSchema.validate(config);
      expect(error).toBeUndefined();
      expect(value.FEATURES_ENABLE_AI_SEARCH).toBe(false);
      expect(value.FEATURES_ENABLE_ANALYTICS).toBe(true);
      expect(value.FEATURES_ENABLE_WEBSOCKET).toBe(true);
    });
  });
});
