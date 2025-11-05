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
  development: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  production: process.env.NEXT_PUBLIC_API_URL || '/api',
  test: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
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
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REGISTER: '/auth/register',
    VERIFY: '/auth/verify',
    REFRESH: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    CHANGE_PASSWORD: '/auth/change-password',
    PROFILE: '/auth/profile',
  },
  USERS: {
    BASE: '/users',
    ME: '/users/me',
    BY_ID: (id: string) => `/users/${id}`,
    PERMISSIONS: (id: string) => `/users/${id}/permissions`,
  },
  STUDENTS: {
    BASE: '/students',
    BY_ID: (id: string) => `/students/${id}`,
    HEALTH_RECORDS: (id: string) => `/students/${id}/health-records`,
  },
  MEDICATIONS: {
    BASE: '/medications',
    BY_ID: (id: string) => `/medications/${id}`,
    ADMINISTER: (id: string) => `/medications/${id}/administer`,
  },
  HEALTH_RECORDS: {
    BASE: '/health-records',
    BY_ID: (id: string) => `/health-records/${id}`,
  },
  INCIDENTS: {
    BASE: '/incidents',
    BY_ID: (id: string) => `/incidents/${id}`,
  },
  APPOINTMENTS: {
    BASE: '/appointments',
    BY_ID: (id: string) => `/appointments/${id}`,
    AVAILABILITY: '/appointments/availability',
    REMINDERS: '/appointments/reminders',
  },
  FORMS: {
    BASE: '/forms',
    BY_ID: (id: string) => `/forms/${id}`,
  },
  DOCUMENTS: {
    BASE: '/documents',
    BY_ID: (id: string) => `/documents/${id}`,
  },
  COMPLIANCE: {
    BASE: '/compliance',
    AUDIT_LOGS: '/compliance/audit-logs',
    REPORTS: '/compliance/reports',
  },
  ANALYTICS: {
    BASE: '/analytics',
    METRICS: '/analytics/metrics',
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
