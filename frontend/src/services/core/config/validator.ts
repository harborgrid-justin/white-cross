/**
 * @fileoverview Configuration Validation Functions
 * @module services/core/config/validator
 * @category Configuration
 *
 * Provides validation functions for configuration values to ensure
 * they meet security, type, and business requirements.
 *
 * @see {@link module:services/core/config/types}
 */

import type { AppConfiguration } from './types';

/**
 * Validate and enforce HTTPS in production environments
 *
 * Security requirement: All healthcare data must be transmitted over HTTPS
 * to maintain HIPAA compliance. This function enforces that requirement
 * while allowing HTTP for local development.
 *
 * @param url - API base URL to validate
 * @returns Validated URL
 * @throws {Error} If HTTP is used in production environment
 *
 * @example
 * ```typescript
 * // Production - throws error
 * validateApiUrl('http://api.example.com', true);
 * // Error: HTTP is not allowed in production
 *
 * // Development localhost - allowed
 * validateApiUrl('http://localhost:3001', false);
 * // Returns: 'http://localhost:3001'
 *
 * // Production HTTPS - allowed
 * validateApiUrl('https://api.example.com', true);
 * // Returns: 'https://api.example.com'
 * ```
 */
export function validateApiUrl(url: string): string {
  const isProduction = process.env.NODE_ENV === 'production';
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isLocalhost = url.includes('localhost') || url.includes('127.0.0.1');

  // Allow HTTP only for localhost in development
  if (url.startsWith('http://') && !isLocalhost && isProduction) {
    throw new Error(
      '[SECURITY ERROR] HTTP is not allowed in production. HIPAA compliance requires HTTPS for all PHI transmission. ' +
      'Please configure NEXT_PUBLIC_API_BASE_URL with https:// protocol.'
    );
  }

  // Warn if using HTTP in development (but allow it for localhost)
  if (url.startsWith('http://') && !isLocalhost && isDevelopment) {
    console.warn(
      '[SECURITY WARNING] Using HTTP in development environment. ' +
      'Ensure HTTPS is configured before deploying to production.'
    );
  }

  return url;
}

/**
 * Parse number from environment variable string
 *
 * Safely converts string environment variables to numbers,
 * returning undefined for invalid or missing values.
 *
 * @param value - String value to parse
 * @returns Parsed number or undefined if invalid/missing
 *
 * @example
 * ```typescript
 * parseNumber('30000');        // 30000
 * parseNumber('not-a-number'); // undefined
 * parseNumber(undefined);      // undefined
 * parseNumber('');             // undefined
 * ```
 */
export function parseNumber(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const parsed = Number(value);
  return isNaN(parsed) ? undefined : parsed;
}

/**
 * Validate complete application configuration
 *
 * Performs comprehensive validation of all configuration sections
 * to ensure required values are present and valid before application
 * initialization.
 *
 * Validation checks:
 * - API base URL is present
 * - Timeouts are positive values
 * - Size/capacity limits are positive
 * - Environment is valid enum value
 *
 * @param config - Application configuration to validate
 * @throws {Error} If any configuration value is invalid or missing
 *
 * @example
 * ```typescript
 * const config: AppConfiguration = loadConfiguration();
 * validateConfiguration(config);
 * // Throws if invalid, returns void if valid
 * ```
 */
export function validateConfiguration(config: AppConfiguration): void {
  // Validate API configuration
  if (!config.api.baseUrl) {
    throw new Error('[ConfigurationService] API base URL is required');
  }

  if (config.api.timeout <= 0) {
    throw new Error('[ConfigurationService] API timeout must be positive');
  }

  // Validate security configuration
  if (config.security.sessionTimeout <= 0) {
    throw new Error('[ConfigurationService] Session timeout must be positive');
  }

  // Validate cache configuration
  if (config.cache.maxSize <= 0) {
    throw new Error('[ConfigurationService] Cache max size must be positive');
  }

  // Validate environment
  const validEnvironments = ['development', 'staging', 'production', 'test'];
  if (!validEnvironments.includes(config.environment)) {
    throw new Error(
      `[ConfigurationService] Invalid environment: ${config.environment}. ` +
      `Must be one of: ${validEnvironments.join(', ')}`
    );
  }
}
