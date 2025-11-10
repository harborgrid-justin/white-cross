/**
 * Environment Variable Type Definitions
 *
 * Type-safe environment variable definitions for the backend application.
 * Ensures all environment variables are properly typed and documented.
 *
 * @module types/environment
 */

/**
 * Node environment types
 */
export type NodeEnvironment = 'development' | 'test' | 'production';

/**
 * Log level types
 */
export type LogLevel = 'error' | 'warn' | 'info' | 'http' | 'verbose' | 'debug' | 'silly';

/**
 * Database dialect types
 */
export type DatabaseDialect = 'postgres' | 'mysql' | 'sqlite' | 'mariadb' | 'mssql';

/**
 * Environment variable interface
 * Extends NodeJS.ProcessEnv with application-specific variables
 */
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // Application
      NODE_ENV: NodeEnvironment;
      PORT?: string;
      HOST?: string;
      APP_NAME?: string;
      APP_VERSION?: string;

      // Database
      DB_HOST: string;
      DB_PORT?: string;
      DB_USERNAME: string;
      DB_PASSWORD: string;
      DB_NAME: string;
      DB_NAME_TEST?: string;
      DB_DIALECT?: DatabaseDialect;
      DB_LOGGING?: string;
      DB_POOL_MAX?: string;
      DB_POOL_MIN?: string;

      // Redis
      REDIS_HOST?: string;
      REDIS_PORT?: string;
      REDIS_PASSWORD?: string;
      REDIS_DB?: string;
      REDIS_TLS?: string;

      // Authentication & Security
      JWT_SECRET: string;
      JWT_EXPIRES_IN?: string;
      JWT_REFRESH_SECRET?: string;
      JWT_REFRESH_EXPIRES_IN?: string;
      SESSION_SECRET?: string;
      ENCRYPTION_KEY?: string;
      BCRYPT_ROUNDS?: string;

      // OAuth
      GOOGLE_CLIENT_ID?: string;
      GOOGLE_CLIENT_SECRET?: string;
      GOOGLE_CALLBACK_URL?: string;
      MICROSOFT_CLIENT_ID?: string;
      MICROSOFT_CLIENT_SECRET?: string;
      MICROSOFT_CALLBACK_URL?: string;

      // Email
      SMTP_HOST?: string;
      SMTP_PORT?: string;
      SMTP_USER?: string;
      SMTP_PASSWORD?: string;
      SMTP_FROM?: string;
      SMTP_SECURE?: string;

      // SMS (Twilio)
      TWILIO_ACCOUNT_SID?: string;
      TWILIO_AUTH_TOKEN?: string;
      TWILIO_PHONE_NUMBER?: string;

      // Push Notifications
      FCM_SERVER_KEY?: string;
      FCM_PROJECT_ID?: string;
      APN_KEY_ID?: string;
      APN_TEAM_ID?: string;
      APN_BUNDLE_ID?: string;
      VAPID_PUBLIC_KEY?: string;
      VAPID_PRIVATE_KEY?: string;

      // Monitoring & Logging
      SENTRY_DSN?: string;
      SENTRY_ENVIRONMENT?: string;
      DATADOG_API_KEY?: string;
      DATADOG_APP_KEY?: string;
      LOG_LEVEL?: LogLevel;

      // File Storage
      AWS_ACCESS_KEY_ID?: string;
      AWS_SECRET_ACCESS_KEY?: string;
      AWS_REGION?: string;
      AWS_S3_BUCKET?: string;

      // OpenAI
      OPENAI_API_KEY?: string;
      OPENAI_ORGANIZATION?: string;

      // Rate Limiting
      RATE_LIMIT_TTL?: string;
      RATE_LIMIT_MAX?: string;

      // CORS
      CORS_ORIGIN?: string;
      CORS_CREDENTIALS?: string;

      // GraphQL
      GRAPHQL_PLAYGROUND?: string;
      GRAPHQL_INTROSPECTION?: string;
      GRAPHQL_DEBUG?: string;

      // WebSocket
      WS_PORT?: string;
      WS_PATH?: string;

      // HIPAA Compliance
      HIPAA_AUDIT_ENABLED?: string;
      HIPAA_ENCRYPTION_ENABLED?: string;
      PHI_ACCESS_LOG_RETENTION?: string;

      // Feature Flags
      FEATURE_MFA_ENABLED?: string;
      FEATURE_OAUTH_ENABLED?: string;
      FEATURE_GRAPHQL_ENABLED?: string;
      FEATURE_WEBSOCKET_ENABLED?: string;

      // Testing
      TEST_DATABASE_URL?: string;
      CI?: string;
    }
  }
}

/**
 * Required environment variables
 */
export const REQUIRED_ENV_VARS = [
  'NODE_ENV',
  'DB_HOST',
  'DB_USERNAME',
  'DB_PASSWORD',
  'DB_NAME',
  'JWT_SECRET',
] as const;

/**
 * Type for required environment variable keys
 */
export type RequiredEnvVar = (typeof REQUIRED_ENV_VARS)[number];

/**
 * Environment configuration interface
 */
export interface EnvironmentConfig {
  nodeEnv: NodeEnvironment;
  port: number;
  host: string;
  isDevelopment: boolean;
  isProduction: boolean;
  isTest: boolean;
}

/**
 * Parse environment variable as integer
 */
export function parseEnvInt(value: string | undefined, defaultValue: number): number {
  if (!value) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Parse environment variable as boolean
 */
export function parseEnvBoolean(
  value: string | undefined,
  defaultValue: boolean,
): boolean {
  if (!value) return defaultValue;
  return value.toLowerCase() === 'true' || value === '1';
}

/**
 * Parse environment variable as array
 */
export function parseEnvArray(
  value: string | undefined,
  separator = ',',
): string[] {
  if (!value) return [];
  return value.split(separator).map((item) => item.trim());
}

/**
 * Validate required environment variables
 */
export function validateRequiredEnvVars(): void {
  const missing = REQUIRED_ENV_VARS.filter((varName) => !process.env[varName]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`,
    );
  }
}

export {};
