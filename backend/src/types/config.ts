/**
 * Configuration Type Definitions
 *
 * Type definitions for application configuration objects.
 * Ensures type safety for all configuration settings.
 *
 * @module types/config
 */

import { LogLevel, NodeEnvironment } from './environment';
import { DatabaseConfig } from './database';

/**
 * Application configuration
 */
export interface AppConfig {
  /**
   * Node environment
   */
  env: NodeEnvironment;

  /**
   * Application name
   */
  name: string;

  /**
   * Application version
   */
  version: string;

  /**
   * Server port
   */
  port: number;

  /**
   * Server host
   */
  host: string;

  /**
   * Base URL for the application
   */
  baseUrl: string;

  /**
   * API path prefix
   */
  apiPrefix: string;
}

/**
 * JWT configuration
 */
export interface JwtConfig {
  /**
   * JWT secret key
   */
  secret: string;

  /**
   * Access token expiration time
   */
  expiresIn: string;

  /**
   * Refresh token secret key
   */
  refreshSecret: string;

  /**
   * Refresh token expiration time
   */
  refreshExpiresIn: string;

  /**
   * JWT issuer
   */
  issuer?: string;

  /**
   * JWT audience
   */
  audience?: string;
}

/**
 * Redis configuration
 */
export interface RedisConfig {
  /**
   * Redis host
   */
  host: string;

  /**
   * Redis port
   */
  port: number;

  /**
   * Redis password
   */
  password?: string;

  /**
   * Redis database index
   */
  db: number;

  /**
   * Enable TLS
   */
  tls: boolean;

  /**
   * Connection retry strategy
   */
  retryStrategy?: (times: number) => number | void;
}

/**
 * CORS configuration
 */
export interface CorsConfig {
  /**
   * Allowed origins
   */
  origin: string | string[] | RegExp | RegExp[];

  /**
   * Allow credentials
   */
  credentials: boolean;

  /**
   * Allowed methods
   */
  methods?: string[];

  /**
   * Allowed headers
   */
  allowedHeaders?: string[];

  /**
   * Exposed headers
   */
  exposedHeaders?: string[];

  /**
   * Max age for preflight requests
   */
  maxAge?: number;
}

/**
 * Rate limiting configuration
 */
export interface RateLimitConfig {
  /**
   * Time window in milliseconds
   */
  ttl: number;

  /**
   * Maximum number of requests per window
   */
  max: number;

  /**
   * Skip rate limiting for certain IPs
   */
  skipIf?: (request: any) => boolean;
}

/**
 * Email configuration
 */
export interface EmailConfig {
  /**
   * SMTP host
   */
  host: string;

  /**
   * SMTP port
   */
  port: number;

  /**
   * SMTP username
   */
  user: string;

  /**
   * SMTP password
   */
  password: string;

  /**
   * From email address
   */
  from: string;

  /**
   * Enable secure connection
   */
  secure: boolean;
}

/**
 * SMS configuration
 */
export interface SmsConfig {
  /**
   * Twilio account SID
   */
  accountSid: string;

  /**
   * Twilio auth token
   */
  authToken: string;

  /**
   * Twilio phone number
   */
  phoneNumber: string;
}

/**
 * Logging configuration
 */
export interface LogConfig {
  /**
   * Log level
   */
  level: LogLevel;

  /**
   * Enable file logging
   */
  fileLogging: boolean;

  /**
   * Log file path
   */
  logDir?: string;

  /**
   * Enable console logging
   */
  consoleLogging: boolean;

  /**
   * Enable JSON formatting
   */
  jsonFormat: boolean;
}

/**
 * Monitoring configuration
 */
export interface MonitoringConfig {
  /**
   * Sentry DSN
   */
  sentryDsn?: string;

  /**
   * Sentry environment
   */
  sentryEnvironment?: string;

  /**
   * DataDog API key
   */
  datadogApiKey?: string;

  /**
   * DataDog app key
   */
  datadogAppKey?: string;

  /**
   * Enable performance monitoring
   */
  performanceMonitoring: boolean;
}

/**
 * GraphQL configuration
 */
export interface GraphQLConfig {
  /**
   * Enable GraphQL playground
   */
  playground: boolean;

  /**
   * Enable introspection
   */
  introspection: boolean;

  /**
   * Enable debug mode
   */
  debug: boolean;

  /**
   * GraphQL path
   */
  path: string;

  /**
   * Enable subscriptions
   */
  subscriptions: boolean;

  /**
   * Maximum query depth
   */
  maxDepth?: number;

  /**
   * Maximum query complexity
   */
  maxComplexity?: number;
}

/**
 * WebSocket configuration
 */
export interface WebSocketConfig {
  /**
   * WebSocket port
   */
  port?: number;

  /**
   * WebSocket path
   */
  path: string;

  /**
   * Enable CORS
   */
  cors: boolean;

  /**
   * Ping interval in milliseconds
   */
  pingInterval?: number;

  /**
   * Ping timeout in milliseconds
   */
  pingTimeout?: number;
}

/**
 * File upload configuration
 */
export interface FileUploadConfig {
  /**
   * Maximum file size in bytes
   */
  maxSize: number;

  /**
   * Allowed MIME types
   */
  allowedMimeTypes: string[];

  /**
   * Upload destination
   */
  destination: string;

  /**
   * Use S3 for storage
   */
  useS3: boolean;

  /**
   * S3 bucket name
   */
  s3Bucket?: string;
}

/**
 * HIPAA compliance configuration
 */
export interface HipaaConfig {
  /**
   * Enable audit logging
   */
  auditEnabled: boolean;

  /**
   * Enable PHI encryption at rest
   */
  encryptionEnabled: boolean;

  /**
   * PHI access log retention period in days
   */
  accessLogRetention: number;

  /**
   * Enable automatic PHI redaction in logs
   */
  autoRedaction: boolean;
}

/**
 * Feature flags configuration
 */
export interface FeatureFlagsConfig {
  /**
   * Enable multi-factor authentication
   */
  mfaEnabled: boolean;

  /**
   * Enable OAuth authentication
   */
  oauthEnabled: boolean;

  /**
   * Enable GraphQL API
   */
  graphqlEnabled: boolean;

  /**
   * Enable WebSocket connections
   */
  websocketEnabled: boolean;

  /**
   * Enable AI-powered features
   */
  aiEnabled: boolean;
}

/**
 * Complete application configuration
 */
export interface Configuration {
  app: AppConfig;
  database: DatabaseConfig;
  jwt: JwtConfig;
  redis: RedisConfig;
  cors: CorsConfig;
  rateLimit: RateLimitConfig;
  email: EmailConfig;
  sms?: SmsConfig;
  logging: LogConfig;
  monitoring: MonitoringConfig;
  graphql: GraphQLConfig;
  websocket: WebSocketConfig;
  fileUpload: FileUploadConfig;
  hipaa: HipaaConfig;
  featureFlags: FeatureFlagsConfig;
}
