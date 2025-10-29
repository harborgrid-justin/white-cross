/**
 * Application Configuration Constants
 * 
 * Centralized configuration values for the Next.js application
 * Environment-aware settings for API connections, timeouts, and feature flags
 */

/**
 * API Configuration
 * Base URL and timeout settings for backend API calls
 */
export const API_CONFIG = {
  /**
   * Base URL for API requests
   * - Docker environment: Uses backend service name (http://backend:3001/api/v1)
   * - Local development: Uses localhost (http://localhost:3001/api/v1)
   * - Can be overridden via NEXT_PUBLIC_API_URL environment variable
   */
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1',
  
  /**
   * Internal API URL for server-side requests in Docker
   * Used for API routes and server-side rendering
   */
  INTERNAL_API_URL: process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1',
  
  /**
   * Request timeout in milliseconds
   * Default: 30 seconds
   */
  TIMEOUT: 30000,
  
  /**
   * Retry configuration for failed requests
   */
  RETRY: {
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000, // ms
    RETRY_CODES: [408, 429, 500, 502, 503, 504],
  },
} as const;

/**
 * Application Environment
 */
export const APP_ENV = {
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_TEST: process.env.NODE_ENV === 'test',
} as const;

/**
 * Feature Flags
 * Toggle features on/off based on environment or configuration
 */
export const FEATURE_FLAGS = {
  ENABLE_DEBUG_LOGGING: process.env.NEXT_PUBLIC_ENABLE_DEBUG === 'true',
  ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
} as const;

/**
 * Security Configuration
 * HIPAA-compliant security settings for token management and session handling
 */
export const SECURITY_CONFIG = {
  /**
   * Token storage location
   * 'sessionStorage' for enhanced security (lost on tab close)
   * 'localStorage' for persistent sessions (survives tab close)
   */
  STORAGE_TYPE: 'sessionStorage' as 'localStorage' | 'sessionStorage',
  
  /**
   * Token expiration settings
   */
  TOKEN_EXPIRY: {
    /** Default token lifetime in milliseconds (1 hour) */
    DEFAULT: 60 * 60 * 1000,
    /** Maximum token lifetime in milliseconds (8 hours) */
    MAX: 8 * 60 * 60 * 1000,
    /** Refresh token lifetime (7 days) */
    REFRESH: 7 * 24 * 60 * 60 * 1000,
  },
  
  /**
   * Inactivity timeout in milliseconds (30 minutes)
   * User will be logged out after this period of inactivity
   */
  INACTIVITY_TIMEOUT: 30 * 60 * 1000,
  
  /**
   * Session activity check interval (1 minute)
   */
  ACTIVITY_CHECK_INTERVAL: 60 * 1000,
  
  /**
   * Encryption settings
   */
  ENCRYPTION: {
    /** Whether to encrypt tokens in storage */
    ENABLED: process.env.NEXT_PUBLIC_ENCRYPT_TOKENS === 'true',
    /** Algorithm for encryption */
    ALGORITHM: 'AES-GCM',
  },
} as const;
