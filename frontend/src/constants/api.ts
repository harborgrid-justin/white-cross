/**
 * Centralized API constants and endpoints for the healthcare platform
 * Provides consistent API endpoint definitions and HTTP configurations
 */

import { API_CONFIG } from './config';

// HTTP Methods
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
  HEAD: 'HEAD',
  OPTIONS: 'OPTIONS',
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
} as const;

// Content Types
export const CONTENT_TYPES = {
  JSON: 'application/json',
  FORM_DATA: 'multipart/form-data',
  FORM_URLENCODED: 'application/x-www-form-urlencoded',
  TEXT: 'text/plain',
  HTML: 'text/html',
  XML: 'application/xml',
  PDF: 'application/pdf',
  CSV: 'text/csv',
} as const;

// API Response Types
export const RESPONSE_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    VERIFY: '/auth/verify',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    CHANGE_PASSWORD: '/auth/change-password',
    PROFILE: '/auth/profile',
    PERMISSIONS: '/auth/permissions',
  },
  STUDENTS: {
    BASE: '/students',
    BY_ID: (id: string) => `/students/${id}`,
    ASSIGNED: '/students/assigned',
    SEARCH: '/students/search',
    BULK: '/students/bulk',
    IMPORT: '/students/import',
    EXPORT: '/students/export',
    STATS: '/students/stats',
  },
  HEALTH_RECORDS: {
    BASE: '/health-records',
    STUDENT: (studentId: string) => `/health-records/student/${studentId}`,
    ALLERGIES: (studentId: string) => `/health-records/student/${studentId}/allergies`,
    CHRONIC_CONDITIONS: (studentId: string) => `/health-records/student/${studentId}/chronic-conditions`,
    VACCINATIONS: (studentId: string) => `/health-records/student/${studentId}/vaccinations`,
    GROWTH_CHART: (studentId: string) => `/health-records/student/${studentId}/growth-chart`,
    VITALS: (studentId: string) => `/health-records/student/${studentId}/vitals`,
    SCREENINGS: (studentId: string) => `/health-records/student/${studentId}/screenings`,
    RECORDS: (studentId: string) => `/health-records/student/${studentId}/records`,
    SUMMARY: (studentId: string) => `/health-records/student/${studentId}/summary`,
  },
  MEDICATIONS: {
    BASE: '/medications',
    INVENTORY: '/medications/inventory',
    SCHEDULE: '/medications/schedule',
    REMINDERS: '/medications/reminders',
    STUDENT: (studentId: string) => `/medications/student/${studentId}`,
    ADMINISTER: (id: string) => `/medications/${id}/administer`,
    ADVERSE_REACTIONS: '/medications/adverse-reactions',
    INTERACTIONS: '/medications/interactions',
    SEARCH: '/medications/search',
    BULK: '/medications/bulk',
  },
  APPOINTMENTS: {
    BASE: '/appointments',
    UPCOMING: '/appointments/upcoming',
    TODAY: '/appointments/today',
    PAST: '/appointments/past',
    CANCEL: (id: string) => `/appointments/${id}/cancel`,
    RESCHEDULE: (id: string) => `/appointments/${id}/reschedule`,
    CHECK_IN: (id: string) => `/appointments/${id}/check-in`,
  },
  COMMUNICATION: {
    BASE: '/communication',
    MESSAGES: '/communication/messages',
    NOTIFICATIONS: '/communication/notifications',
    TEMPLATES: '/communication/templates',
    CHANNELS: '/communication/channels',
    SEND: '/communication/send',
    BULK: '/communication/bulk',
  },
  EMERGENCY_CONTACTS: {
    BASE: '/emergency-contacts',
    STUDENT: (studentId: string) => `/emergency-contacts/student/${studentId}`,
    NOTIFY: '/emergency-contacts/notify',
    TEST: '/emergency-contacts/test',
  },
  INCIDENT_REPORTS: {
    BASE: '/incident-reports',
    STUDENT: (studentId: string) => `/incident-reports/student/${studentId}`,
    TYPES: '/incident-reports/types',
    SEVERITY: '/incident-reports/severity',
    STATUS: '/incident-reports/status',
  },
  DOCUMENTS: {
    BASE: '/documents',
    UPLOAD: '/documents/upload',
    DOWNLOAD: (id: string) => `/documents/${id}/download`,
    DELETE: (id: string) => `/documents/${id}/delete`,
    SHARE: (id: string) => `/documents/${id}/share`,
    CATEGORIES: '/documents/categories',
    TAGS: '/documents/tags',
  },
  REPORTS: {
    BASE: '/reports',
    GENERATE: '/reports/generate',
    EXPORT: (id: string) => `/reports/${id}/export`,
    SCHEDULE: '/reports/schedule',
    TEMPLATES: '/reports/templates',
    DASHBOARD: '/reports/dashboard',
  },
  ADMIN: {
    BASE: '/admin',
    SETTINGS: '/admin/settings',
    USERS: '/admin/users',
    INTEGRATIONS: '/admin/integrations',
    SYSTEM: '/admin/system',
    BACKUP: '/admin/backup',
    AUDIT: '/admin/audit',
    LICENSES: '/admin/licenses',
  },
  SETTINGS: {
    BASE: '/settings',
    PROFILE: '/settings/profile',
    PREFERENCES: '/settings/preferences',
    NOTIFICATIONS: '/settings/notifications',
    SECURITY: '/settings/security',
  },
  INTEGRATIONS: {
    BASE: '/integrations',
    BY_ID: (id: string) => `/integrations/${id}`,
    TEST: (id: string) => `/integrations/${id}/test`,
    SYNC: (id: string) => `/integrations/${id}/sync`,
    LOGS: (id: string) => `/integrations/${id}/logs`,
    ALL_LOGS: '/integrations/logs/all',
    STATISTICS: '/integrations/statistics/overview',
    SIS: '/integrations/sis',
    EHR: '/integrations/ehr',
    PHARMACY: '/integrations/pharmacy',
    STATUS: '/integrations/status',
  },
  INVENTORY: {
    BASE: '/api/inventory',
    BY_ID: (id: string) => `/api/inventory/${id}`,
    TRANSACTIONS: '/api/inventory/transactions',
    ALERTS: '/api/inventory/alerts',
    MAINTENANCE: '/api/inventory/maintenance',
    MAINTENANCE_SCHEDULE: '/api/inventory/maintenance/schedule',
    PURCHASE_ORDER: '/api/inventory/purchase-order',
    VALUATION: '/api/inventory/valuation',
    USAGE_ANALYTICS: '/api/inventory/analytics/usage',
    SUPPLIER_PERFORMANCE: '/api/inventory/analytics/suppliers',
    SEARCH: (query: string) => `/api/inventory/search/${query}`,
    STOCK: (id: string) => `/api/inventory/${id}/stock`,
    ADJUST: (id: string) => `/api/inventory/${id}/adjust`,
    HISTORY: (id: string) => `/api/inventory/${id}/history`,
    STATS: '/api/inventory/stats',
    VENDORS: '/api/vendors',
    VENDOR_BY_ID: (id: string) => `/api/vendors/${id}`,
    PURCHASE_ORDERS: '/api/purchase-orders',
    PURCHASE_ORDER_BY_ID: (id: string) => `/api/purchase-orders/${id}`,
  },
  BUDGET: {
    BASE: '/api/budget',
    CATEGORIES: '/api/budget/categories',
    CATEGORY_BY_ID: (id: string) => `/api/budget/categories/${id}`,
    SUMMARY: '/api/budget/summary',
    TRANSACTIONS: '/api/budget/transactions',
    TRANSACTION_BY_ID: (id: string) => `/api/budget/transactions/${id}`,
    TRENDS: '/api/budget/trends',
    YEAR_COMPARISON: '/api/budget/year-comparison',
    OVER_BUDGET: '/api/budget/over-budget',
    RECOMMENDATIONS: '/api/budget/recommendations',
    EXPORT: '/api/budget/export',
  },
} as const;

// API Query Parameters
export const QUERY_PARAMS = {
  PAGE: 'page',
  LIMIT: 'limit',
  SORT: 'sort',
  ORDER: 'order',
  SEARCH: 'search',
  FILTER: 'filter',
  INCLUDE: 'include',
  EXCLUDE: 'exclude',
  START_DATE: 'startDate',
  END_DATE: 'endDate',
  STATUS: 'status',
  TYPE: 'type',
  CATEGORY: 'category',
} as const;

// Default Query Values
export const DEFAULT_QUERY_VALUES = {
  PAGE: 1,
  LIMIT: 10,
  SORT: 'createdAt',
  ORDER: 'desc',
} as const;

// API Headers
export const API_HEADERS = {
  AUTHORIZATION: 'Authorization',
  CONTENT_TYPE: 'Content-Type',
  ACCEPT: 'Accept',
  USER_AGENT: 'User-Agent',
  X_API_KEY: 'X-API-Key',
  X_CLIENT_VERSION: 'X-Client-Version',
  X_REQUEST_ID: 'X-Request-ID',
  IF_MATCH: 'If-Match',
  IF_NONE_MATCH: 'If-None-Match',
} as const;

// Rate Limiting Configuration
export const RATE_LIMITING = {
  REQUESTS_PER_MINUTE: 60,
  REQUESTS_PER_HOUR: 1000,
  REQUESTS_PER_DAY: 10000,
  BURST_LIMIT: 10,
} as const;

// Caching Configuration
export const CACHE_CONFIG = {
  DEFAULT_TTL: 5 * 60 * 1000, // 5 minutes
  MAX_TTL: 60 * 60 * 1000, // 1 hour
  MIN_TTL: 30 * 1000, // 30 seconds
  CACHE_KEY_PREFIX: 'wc_api_',
} as const;

// Request Configuration
export const REQUEST_CONFIG = {
  DEFAULT_TIMEOUT: API_CONFIG.TIMEOUT,
  RETRY_ATTEMPTS: API_CONFIG.RETRY_ATTEMPTS,
  RETRY_DELAY: API_CONFIG.RETRY_DELAY,
  MAX_REDIRECTS: 5,
  VALIDATE_STATUS: (status: number) => status >= 200 && status < 300,
} as const;

// Error Response Structure
export const ERROR_RESPONSE = {
  CODE: 'code',
  MESSAGE: 'message',
  DETAILS: 'details',
  FIELD: 'field',
  VALIDATION: 'validation',
  TRACE_ID: 'traceId',
  TIMESTAMP: 'timestamp',
} as const;

// Success Response Structure
export const SUCCESS_RESPONSE = {
  DATA: 'data',
  MESSAGE: 'message',
  META: 'meta',
  LINKS: 'links',
  INCLUDED: 'included',
} as const;

// Pagination Response Structure
export const PAGINATION_RESPONSE = {
  DATA: 'data',
  TOTAL: 'total',
  PAGE: 'page',
  LIMIT: 'limit',
  PAGES: 'pages',
  HAS_NEXT: 'hasNext',
  HAS_PREV: 'hasPrev',
  NEXT_PAGE: 'nextPage',
  PREV_PAGE: 'prevPage',
} as const;

// File Upload Configuration
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  CHUNK_SIZE: 1024 * 1024, // 1MB
  ALLOWED_TYPES: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/csv',
    'application/json',
  ],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif', '.pdf', '.doc', '.docx', '.csv', '.json'],
} as const;

// API Versioning
export const API_VERSION = {
  CURRENT: 'v1',
  HEADER: 'X-API-Version',
  ACCEPT_HEADER: 'application/vnd.whitecross.v1+json',
} as const;

// WebSocket Events
export const WS_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  ERROR: 'error',
  AUTHENTICATION: 'authentication',
  SUBSCRIBE: 'subscribe',
  UNSUBSCRIBE: 'unsubscribe',
  NOTIFICATION: 'notification',
  UPDATE: 'update',
  DELETE: 'delete',
  CREATE: 'create',
} as const;

// Real-time Update Channels
export const WS_CHANNELS = {
  MEDICATIONS: 'medications',
  APPOINTMENTS: 'appointments',
  EMERGENCY: 'emergency',
  COMMUNICATIONS: 'communications',
  SYSTEM: 'system',
} as const;

// Export comprehensive API constants
export const API_CONSTANTS = {
  METHODS: HTTP_METHODS,
  STATUS: HTTP_STATUS,
  CONTENT_TYPES,
  RESPONSE_TYPES,
  ENDPOINTS: API_ENDPOINTS,
  QUERY_PARAMS,
  DEFAULT_QUERY_VALUES,
  HEADERS: API_HEADERS,
  RATE_LIMITING,
  CACHE_CONFIG,
  REQUEST_CONFIG,
  ERROR_RESPONSE,
  SUCCESS_RESPONSE,
  PAGINATION_RESPONSE,
  UPLOAD_CONFIG,
  VERSION: API_VERSION,
  WS_EVENTS,
  WS_CHANNELS,
} as const;

export default API_CONSTANTS;
