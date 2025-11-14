/**
 * Centralized API Configuration
 *
 * Single source of truth for API client configuration, base URLs,
 * timeouts, retry logic, and request/response interceptors.
 *
 * @module lib/config/api
 * @since 2025-11-04
 */

/**
 * API base URLs for different environments
 */
export const API_BASE_URLS = {
  development: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  production: process.env.NEXT_PUBLIC_API_URL || '/api',
  test: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
} as const;

/**
 * Get current API base URL based on environment
 */
export function getApiBaseUrl(): string {
  const env = (process.env.NODE_ENV || 'development') as keyof typeof API_BASE_URLS;
  return API_BASE_URLS[env] || API_BASE_URLS.development;
}

/**
 * API timeout configurations (in milliseconds)
 */
export const API_TIMEOUTS = {
  default: 30000, // 30 seconds
  short: 10000, // 10 seconds
  long: 60000, // 60 seconds
  upload: 120000, // 2 minutes for file uploads
} as const;

/**
 * Retry configuration for failed requests
 */
export const RETRY_CONFIG = {
  maxRetries: 3,
  retryDelay: 1000, // Initial delay in ms
  retryDelayMultiplier: 2, // Exponential backoff multiplier
  retryableStatusCodes: [408, 429, 500, 502, 503, 504],
  retryableErrors: ['ECONNRESET', 'ETIMEDOUT', 'ENOTFOUND'],
} as const;

/**
 * API request headers configuration
 */
export const API_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'X-Client-Version': process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
} as const;

/**
 * API endpoint definitions
 * Centralized endpoint paths
 */
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/v1/auth/login',
    LOGOUT: '/api/v1/auth/logout',
    REGISTER: '/api/v1/auth/register',
    VERIFY: '/api/v1/auth/verify',
    REFRESH: '/api/v1/auth/refresh',
    FORGOT_PASSWORD: '/api/v1/auth/forgot-password',
    RESET_PASSWORD: '/api/v1/auth/reset-password',
    CHANGE_PASSWORD: '/api/v1/auth/change-password',
    PROFILE: '/api/v1/auth/profile',
  },
  USERS: {
    BASE: '/api/v1/users',
    ME: '/api/v1/users/me',
    BY_ID: (id: string) => `/api/v1/users/${id}`,
    PERMISSIONS: (id: string) => `/api/v1/users/${id}/permissions`,
  },
  STUDENTS: {
    BASE: '/api/v1/students',
    BY_ID: (id: string) => `/api/v1/students/${id}`,
    HEALTH_RECORDS: (id: string) => `/api/v1/students/${id}/health-records`,
  },
  MEDICATIONS: {
    BASE: '/api/v1/medications',
    BY_ID: (id: string) => `/api/v1/medications/${id}`,
    ADMINISTER: (id: string) => `/api/v1/medications/${id}/administer`,
  },
  HEALTH_RECORDS: {
    BASE: '/api/v1/health-records',
    BY_ID: (id: string) => `/api/v1/health-records/${id}`,
  },
  INCIDENTS: {
    BASE: '/api/v1/incidents',
    BY_ID: (id: string) => `/api/v1/incidents/${id}`,
  },
  APPOINTMENTS: {
    BASE: '/api/v1/appointments',
    BY_ID: (id: string) => `/api/v1/appointments/${id}`,
    AVAILABILITY: '/api/v1/appointments/availability',
    REMINDERS: '/api/v1/appointments/reminders',
  },
  FORMS: {
    BASE: '/api/v1/forms',
    BY_ID: (id: string) => `/api/v1/forms/${id}`,
  },
  DOCUMENTS: {
    BASE: '/api/v1/documents',
    BY_ID: (id: string) => `/api/v1/documents/${id}`,
  },
  COMPLIANCE: {
    BASE: '/api/v1/compliance',
    AUDIT_LOGS: '/api/v1/compliance/audit-logs',
    REPORTS: '/api/v1/compliance/reports',
  },
  ANALYTICS: {
    BASE: '/api/v1/analytics',
    METRICS: '/api/v1/analytics/metrics',
  },
} as const;

/**
 * Cache configuration for API responses
 */
export const CACHE_CONFIG = {
  // Cache time-to-live in seconds
  ttl: {
    short: 60, // 1 minute
    medium: 300, // 5 minutes
    long: 3600, // 1 hour
  },
  // Endpoints that should be cached
  cacheable: [
    '/users/me',
    '/auth/profile',
  ] as string[],
  // Endpoints that should never be cached
  noCacheEndpoints: [
    '/auth/login',
    '/auth/logout',
    '/auth/refresh',
  ] as string[],
} as const;

/**
 * Rate limiting configuration (client-side)
 */
export const RATE_LIMIT_CONFIG = {
  maxRequestsPerMinute: 60,
  maxRequestsPerHour: 1000,
} as const;

/**
 * Error handling configuration
 */
export const ERROR_CONFIG = {
  // Should we log errors to console in development
  logErrors: process.env.NODE_ENV === 'development',

  // Should we send errors to external service (Sentry, etc.)
  reportErrors: process.env.NODE_ENV === 'production',

  // Default error messages
  defaultMessages: {
    network: 'Network error. Please check your connection.',
    timeout: 'Request timeout. Please try again.',
    server: 'Server error. Please try again later.',
    unauthorized: 'Authentication required. Please log in.',
    forbidden: 'You do not have permission to perform this action.',
    notFound: 'The requested resource was not found.',
    validation: 'Invalid request data.',
    unknown: 'An unexpected error occurred.',
  },
} as const;

/**
 * Build full API URL from endpoint path
 *
 * @param endpoint - API endpoint path
 * @returns Full API URL
 */
export function buildApiUrl(endpoint: string): string {
  const baseUrl = getApiBaseUrl();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  return `${baseUrl}${cleanEndpoint}`;
}

/**
 * Get cache TTL for endpoint
 *
 * @param endpoint - API endpoint path
 * @returns Cache TTL in seconds, or null if not cacheable
 */
export function getCacheTTL(endpoint: string): number | null {
  if (CACHE_CONFIG.noCacheEndpoints.includes(endpoint)) {
    return null;
  }

  if (CACHE_CONFIG.cacheable.includes(endpoint)) {
    return CACHE_CONFIG.ttl.medium;
  }

  return null;
}

/**
 * Check if endpoint should be cached
 *
 * @param endpoint - API endpoint path
 * @returns true if endpoint should be cached
 */
export function shouldCacheEndpoint(endpoint: string): boolean {
  return getCacheTTL(endpoint) !== null;
}

/**
 * Get timeout for request type
 *
 * @param type - Request type
 * @returns Timeout in milliseconds
 */
export function getTimeout(type: keyof typeof API_TIMEOUTS = 'default'): number {
  return API_TIMEOUTS[type];
}

/**
 * Check if status code is retryable
 *
 * @param statusCode - HTTP status code
 * @returns true if request should be retried
 */
export function isRetryableStatus(statusCode: number): boolean {
  return RETRY_CONFIG.retryableStatusCodes.includes(statusCode);
}

/**
 * Calculate retry delay with exponential backoff
 *
 * @param attemptNumber - Current retry attempt (0-indexed)
 * @returns Delay in milliseconds
 */
export function getRetryDelay(attemptNumber: number): number {
  return RETRY_CONFIG.retryDelay * Math.pow(RETRY_CONFIG.retryDelayMultiplier, attemptNumber);
}

/**
 * Check if error is retryable
 *
 * @param error - Error object
 * @returns true if request should be retried
 */
export function isRetryableError(error: any): boolean {
  if (error.code && RETRY_CONFIG.retryableErrors.includes(error.code)) {
    return true;
  }

  if (error.response?.status && isRetryableStatus(error.response.status)) {
    return true;
  }

  return false;
}
