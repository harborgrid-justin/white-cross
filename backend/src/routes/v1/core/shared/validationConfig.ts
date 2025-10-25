/**
 * Shared Validation Configuration
 * Standard validation options for Hapi.js routes
 * Ensures consistent validation behavior across all routes
 */

import { RouteOptionsValidate } from '@hapi/hapi';

/**
 * Standard validation options for all routes
 * - abortEarly: false - Returns all validation errors, not just the first one
 * - stripUnknown: true - Removes unknown keys from validated objects (security best practice)
 */
export const standardValidationOptions = {
  abortEarly: false,
  stripUnknown: true
};

/**
 * Standard fail action for validation errors
 * Throws the error to be handled by error middleware
 */
export const standardFailAction = async (request: any, h: any, err: any) => {
  throw err;
};

/**
 * Creates a validation config with standard options
 */
export function createValidation(config: Partial<RouteOptionsValidate>): RouteOptionsValidate {
  const validation: RouteOptionsValidate = {
    ...config,
    options: {
      ...standardValidationOptions,
      ...(config.options || {})
    },
    failAction: config.failAction || standardFailAction
  };

  return validation;
}

/**
 * Standard cache configuration for read-only GET endpoints
 */
export const standardCacheConfig = {
  expiresIn: 5 * 60 * 1000, // 5 minutes
  privacy: 'private' as const
};

/**
 * No cache configuration for dynamic/sensitive data
 */
export const noCacheConfig = {
  privacy: 'private' as const
};

/**
 * Rate limiting configuration for authentication endpoints
 */
export const authRateLimitConfig = {
  limit: {
    max: 5, // 5 requests
    duration: 60 * 1000, // per minute
    id: '{ip}' // Rate limit by IP address
  }
};

/**
 * Rate limiting configuration for sensitive mutation endpoints
 */
export const mutationRateLimitConfig = {
  limit: {
    max: 20, // 20 requests
    duration: 60 * 1000, // per minute
    id: '{userId}' // Rate limit by user ID
  }
};
