/**
 * Environment Variable Validation Schema
 * White Cross School Health Platform
 *
 * This schema validates all environment variables on application startup.
 * The application will fail fast with clear error messages if configuration is invalid.
 *
 * SECURITY NOTE: No defaults are provided for sensitive values.
 * All critical configuration must be explicitly set.
 */

import * as Joi from 'joi';

export const validationSchema = Joi.object({
  // ===================
  // APPLICATION CONFIG
  // ===================
  NODE_ENV: Joi.string()
    .valid('development', 'staging', 'production', 'test')
    .required()
    .description('Application environment'),

  PORT: Joi.number()
    .port()
    .default(3001)
    .description('HTTP server port (safe default: 3001)'),

  // ===================
  // DATABASE CONFIG
  // ===================
  DB_HOST: Joi.string()
    .required()
    .description('Database host (REQUIRED - no default)'),

  DB_PORT: Joi.number()
    .port()
    .default(5432)
    .description('Database port (safe default: 5432)'),

  DB_USERNAME: Joi.string()
    .required()
    .description('Database username (REQUIRED - no default)'),

  DB_PASSWORD: Joi.string()
    .required()
    .min(8)
    .description('Database password (REQUIRED - minimum 8 characters)'),

  DB_NAME: Joi.string()
    .required()
    .description('Database name (REQUIRED - no default)'),

  DB_NAME_TEST: Joi.string()
    .when('NODE_ENV', {
      is: 'test',
      then: Joi.required(),
      otherwise: Joi.optional(),
    })
    .description('Test database name (required in test environment)'),

  DB_SSL: Joi.boolean()
    .default(false)
    .description('Enable database SSL (safe default: false for local dev)'),

  DB_SYNC: Joi.boolean()
    .default(false)
    .description('Auto-sync database schema (safe default: false to prevent data loss)'),

  DB_LOGGING: Joi.boolean()
    .default(false)
    .description('Enable database query logging (safe default: false)'),

  // ===================
  // JWT & AUTHENTICATION
  // ===================
  JWT_SECRET: Joi.string()
    .required()
    .min(32)
    .description('JWT signing secret (REQUIRED - minimum 32 characters, NO DEFAULT)'),

  JWT_REFRESH_SECRET: Joi.string()
    .required()
    .min(32)
    .description('JWT refresh token secret (REQUIRED - minimum 32 characters, NO DEFAULT)'),

  JWT_EXPIRES_IN: Joi.string()
    .default('15m')
    .pattern(/^\d+[smhd]$/)
    .description('JWT access token expiration (safe default: 15m)'),

  JWT_REFRESH_EXPIRES_IN: Joi.string()
    .default('7d')
    .pattern(/^\d+[smhd]$/)
    .description('JWT refresh token expiration (safe default: 7d)'),

  // ===================
  // SECURITY CONFIG
  // ===================
  CSRF_SECRET: Joi.string()
    .when('NODE_ENV', {
      is: 'production',
      then: Joi.string().required().min(32),
      otherwise: Joi.string().optional(),
    })
    .description('CSRF token secret (REQUIRED in production, minimum 32 characters)'),

  CONFIG_ENCRYPTION_KEY: Joi.string()
    .when('NODE_ENV', {
      is: 'production',
      then: Joi.string().required().min(32),
      otherwise: Joi.string().optional(),
    })
    .description('Configuration encryption key (REQUIRED in production)'),

  ENCRYPTION_ALGORITHM: Joi.string()
    .valid('aes-256-gcm', 'aes-256-cbc')
    .default('aes-256-gcm')
    .description('Encryption algorithm (safe default: aes-256-gcm)'),

  ENCRYPTION_KEY_SIZE: Joi.number()
    .valid(16, 24, 32)
    .default(32)
    .description('Encryption key size in bytes (safe default: 32)'),

  ENCRYPTION_IV_SIZE: Joi.number()
    .valid(12, 16)
    .default(16)
    .description('Encryption IV size in bytes (safe default: 16)'),

  RSA_KEY_SIZE: Joi.number()
    .valid(2048, 4096)
    .default(4096)
    .description('RSA key size in bits (safe default: 4096)'),

  KEY_ROTATION_ENABLED: Joi.boolean()
    .default(true)
    .description('Enable automatic key rotation (safe default: true)'),

  KEY_ROTATION_INTERVAL_DAYS: Joi.number()
    .positive()
    .default(90)
    .description('Key rotation interval in days (safe default: 90)'),

  // ===================
  // REDIS CONFIG
  // ===================
  REDIS_HOST: Joi.string()
    .default('localhost')
    .description('Redis host (safe default: localhost)'),

  REDIS_PORT: Joi.number()
    .port()
    .default(6379)
    .description('Redis port (safe default: 6379)'),

  REDIS_PASSWORD: Joi.string()
    .optional()
    .allow('')
    .description('Redis password (optional for local dev)'),

  REDIS_USERNAME: Joi.string()
    .optional()
    .allow('')
    .description('Redis username (optional)'),

  REDIS_DB: Joi.number()
    .min(0)
    .max(15)
    .default(0)
    .description('Redis database number (safe default: 0)'),

  REDIS_QUEUE_DB: Joi.number()
    .min(0)
    .max(15)
    .default(1)
    .description('Redis queue database number (safe default: 1)'),

  REDIS_TTL_DEFAULT: Joi.number()
    .positive()
    .default(300)
    .description('Default Redis TTL in seconds (safe default: 300)'),

  REDIS_CONNECTION_TIMEOUT: Joi.number()
    .positive()
    .default(5000)
    .description('Redis connection timeout in ms (safe default: 5000)'),

  REDIS_MAX_RETRIES: Joi.number()
    .min(0)
    .max(10)
    .default(3)
    .description('Maximum Redis connection retry attempts (safe default: 3)'),

  REDIS_RETRY_DELAY: Joi.number()
    .positive()
    .default(1000)
    .description('Redis retry delay in ms (safe default: 1000)'),

  // ===================
  // CACHE CONFIG
  // ===================
  CACHE_KEY_PREFIX: Joi.string()
    .default('cache')
    .description('Cache key prefix for namespacing (safe default: cache)'),

  CACHE_ENABLE_COMPRESSION: Joi.boolean()
    .default(false)
    .description('Enable cache compression (safe default: false)'),

  CACHE_COMPRESSION_THRESHOLD: Joi.number()
    .positive()
    .default(1024)
    .description('Cache compression threshold in bytes (safe default: 1024)'),

  CACHE_ENABLE_L1: Joi.boolean()
    .default(true)
    .description('Enable L1 in-memory cache (safe default: true)'),

  CACHE_L1_MAX_SIZE: Joi.number()
    .positive()
    .default(1000)
    .description('L1 cache maximum size (safe default: 1000)'),

  CACHE_L1_TTL: Joi.number()
    .positive()
    .default(60)
    .description('L1 cache TTL in seconds (safe default: 60)'),

  CACHE_ENABLE_LOGGING: Joi.boolean()
    .default(false)
    .description('Enable cache operation logging (safe default: false)'),

  CACHE_WARMING_ENABLED: Joi.boolean()
    .default(false)
    .description('Enable cache warming on startup (safe default: false)'),

  CACHE_MAX_SIZE: Joi.number()
    .positive()
    .default(1000)
    .description('Maximum cache size (safe default: 1000)'),

  CACHE_DEFAULT_TTL: Joi.number()
    .positive()
    .default(300000)
    .description('Default cache TTL in ms (safe default: 300000 = 5 minutes)'),

  // ===================
  // QUEUE CONFIG
  // ===================
  QUEUE_CONCURRENCY_DELIVERY: Joi.number()
    .positive()
    .default(10)
    .description('Message delivery queue concurrency (safe default: 10)'),

  QUEUE_CONCURRENCY_NOTIFICATION: Joi.number()
    .positive()
    .default(15)
    .description('Notification queue concurrency (safe default: 15)'),

  QUEUE_CONCURRENCY_ENCRYPTION: Joi.number()
    .positive()
    .default(5)
    .description('Encryption queue concurrency (safe default: 5)'),

  QUEUE_CONCURRENCY_INDEXING: Joi.number()
    .positive()
    .default(3)
    .description('Indexing queue concurrency (safe default: 3)'),

  QUEUE_CONCURRENCY_BATCH: Joi.number()
    .positive()
    .default(2)
    .description('Batch processing queue concurrency (safe default: 2)'),

  QUEUE_CONCURRENCY_CLEANUP: Joi.number()
    .positive()
    .default(1)
    .description('Cleanup queue concurrency (safe default: 1)'),

  // ===================
  // CORS & NETWORKING
  // ===================
  CORS_ORIGIN: Joi.alternatives()
    .try(
      Joi.string().uri(),
      Joi.string().valid('*'),
    )
    .when('NODE_ENV', {
      is: 'production',
      then: Joi.string().uri().required(),
      otherwise: Joi.string().default('http://localhost:3000'),
    })
    .description('CORS allowed origin (REQUIRED in production, safe default: http://localhost:3000 for dev)'),

  // ===================
  // WEBSOCKET CONFIG
  // ===================
  WS_PORT: Joi.number()
    .port()
    .default(3002)
    .description('WebSocket server port (safe default: 3002)'),

  WS_PATH: Joi.string()
    .default('/socket.io')
    .description('WebSocket path (safe default: /socket.io)'),

  WS_CORS_ORIGIN: Joi.string()
    .default('http://localhost:3000')
    .description('WebSocket CORS origin (safe default: http://localhost:3000)'),

  WS_PING_TIMEOUT: Joi.number()
    .positive()
    .default(60000)
    .description('WebSocket ping timeout in ms (safe default: 60000)'),

  WS_PING_INTERVAL: Joi.number()
    .positive()
    .default(25000)
    .description('WebSocket ping interval in ms (safe default: 25000)'),

  // ===================
  // LOGGING & MONITORING
  // ===================
  LOG_LEVEL: Joi.string()
    .valid('error', 'warn', 'info', 'debug', 'verbose')
    .default('info')
    .description('Application log level (safe default: info)'),

  SENTRY_DSN: Joi.string()
    .uri()
    .optional()
    .description('Sentry DSN for error tracking (optional)'),

  REQUEST_TIMEOUT: Joi.number()
    .positive()
    .default(30000)
    .description('HTTP request timeout in ms (safe default: 30000)'),

  // ===================
  // AWS CONFIG (Optional)
  // ===================
  AWS_REGION: Joi.string()
    .optional()
    .default('us-east-1')
    .description('AWS region (safe default: us-east-1)'),

  AWS_ACCESS_KEY_ID: Joi.string()
    .when('NODE_ENV', {
      is: 'production',
      then: Joi.optional(), // May use IAM roles instead
      otherwise: Joi.optional(),
    })
    .description('AWS access key ID (optional, prefer IAM roles)'),

  AWS_SECRET_ACCESS_KEY: Joi.string()
    .when('AWS_ACCESS_KEY_ID', {
      is: Joi.exist(),
      then: Joi.required(),
      otherwise: Joi.optional(),
    })
    .description('AWS secret access key (required if access key provided)'),

  AWS_S3_BUCKET: Joi.string()
    .optional()
    .description('AWS S3 bucket name (optional)'),

  AWS_SECRET_NAME: Joi.string()
    .optional()
    .description('AWS Secrets Manager secret name (optional)'),

  // ===================
  // FEATURE FLAGS
  // ===================
  FEATURES_ENABLE_AI_SEARCH: Joi.boolean()
    .default(false)
    .description('Enable AI search features (safe default: false)'),

  FEATURES_ENABLE_ANALYTICS: Joi.boolean()
    .default(true)
    .description('Enable analytics features (safe default: true)'),

  FEATURES_ENABLE_WEBSOCKET: Joi.boolean()
    .default(true)
    .description('Enable WebSocket features (safe default: true)'),
}).options({
  // Abort early on first error for faster feedback
  abortEarly: false,

  // Don't allow unknown environment variables to prevent typos
  allowUnknown: true, // Set to false in strict mode

  // Strip unknown keys
  stripUnknown: false,
});

/**
 * Validate environment variables
 * This function is called during application bootstrap
 *
 * @param config - Raw environment variables from process.env
 * @returns Validated and typed configuration object
 * @throws Error if validation fails with detailed error messages
 */
export function validateEnvironment(config: Record<string, unknown>) {
  const { error, value } = validationSchema.validate(config, {
    abortEarly: false,
  });

  if (error) {
    const errorMessages = error.details.map((detail) => {
      return `  - ${detail.path.join('.')}: ${detail.message}`;
    });

    throw new Error(
      `\n${'='.repeat(80)}\n` +
      `CONFIGURATION VALIDATION FAILED\n` +
      `${'='.repeat(80)}\n\n` +
      `The following environment variables are invalid or missing:\n\n` +
      `${errorMessages.join('\n')}\n\n` +
      `${'='.repeat(80)}\n` +
      `CRITICAL: Application cannot start with invalid configuration.\n` +
      `Please check your .env file and ensure all required variables are set.\n` +
      `See .env.example for a complete list of required variables.\n` +
      `${'='.repeat(80)}\n`,
    );
  }

  return value;
}
