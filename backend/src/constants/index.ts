/**
 * Centralized constants for White Cross Healthcare Platform Backend
 * All static values, routes, URLs, and configuration should be defined here
 */

// ===== API ROUTES =====
export const API_ROUTES = {
  // Base paths
  BASE: '/api',

  // Authentication routes
  AUTH: {
    BASE: '/api/auth',
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
    REGISTER: '/api/auth/register',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    RESET_PASSWORD: '/api/auth/reset-password',
    VERIFY_EMAIL: '/api/auth/verify-email',
    CHANGE_PASSWORD: '/api/auth/change-password',
  },

  // User management routes
  USERS: {
    BASE: '/api/users',
    BY_ID: '/api/users/:id',
    PROFILE: '/api/users/profile',
    UPDATE_PROFILE: '/api/users/profile',
    CHANGE_PASSWORD: '/api/users/change-password',
    ASSIGNED_STUDENTS: '/api/users/assigned-students',
  },

  // Student routes
  STUDENTS: {
    BASE: '/api/students',
    BY_ID: '/api/students/:id',
    SEARCH: '/api/students/search',
    EXPORT: '/api/students/export',
    IMPORT: '/api/students/import',
    BULK_UPDATE: '/api/students/bulk-update',
    ASSIGNED: '/api/students/assigned',
  },

  // Medication routes
  MEDICATIONS: {
    BASE: '/api/medications',
    BY_ID: '/api/medications/:id',
    SEARCH: '/api/medications/search',
    STUDENT: '/api/medications/student/:studentId',
    SCHEDULE: '/api/medications/schedule',
    ADMINISTER: '/api/medications/:id/administer',
    HISTORY: '/api/medications/:id/history',
    INVENTORY: '/api/medications/inventory',
    ALERTS: '/api/medications/alerts',
  },

  // Health Records routes
  HEALTH_RECORDS: {
    BASE: '/api/health-records',
    BY_ID: '/api/health-records/:id',
    STUDENT: '/api/health-records/student/:studentId',
    TYPES: '/api/health-records/types',
    EXPORT: '/api/health-records/export',
    IMMUNIZATIONS: '/api/health-records/immunizations',
    ALLERGIES: '/api/health-records/allergies',
    CONDITIONS: '/api/health-records/conditions',
    VITALS: '/api/health-records/vitals',
  },

  // Appointment routes
  APPOINTMENTS: {
    BASE: '/api/appointments',
    BY_ID: '/api/appointments/:id',
    STUDENT: '/api/appointments/student/:studentId',
    SCHEDULE: '/api/appointments/schedule',
    AVAILABLE_SLOTS: '/api/appointments/available-slots',
    CANCEL: '/api/appointments/:id/cancel',
    RESCHEDULE: '/api/appointments/:id/reschedule',
    UPCOMING: '/api/appointments/upcoming',
    PAST: '/api/appointments/past',
  },

  // Incident Reports routes
  INCIDENT_REPORTS: {
    BASE: '/api/incident-reports',
    BY_ID: '/api/incident-reports/:id',
    STUDENT: '/api/incident-reports/student/:studentId',
    EXPORT: '/api/incident-reports/export',
    STATISTICS: '/api/incident-reports/statistics',
    TYPES: '/api/incident-reports/types',
  },

  // Emergency Contacts routes
  EMERGENCY_CONTACTS: {
    BASE: '/api/emergency-contacts',
    BY_ID: '/api/emergency-contacts/:id',
    STUDENT: '/api/emergency-contacts/student/:studentId',
    BULK_UPDATE: '/api/emergency-contacts/bulk-update',
    VERIFY: '/api/emergency-contacts/:id/verify',
  },

  // Communication routes
  COMMUNICATION: {
    BASE: '/api/communication',
    SEND: '/api/communication/send',
    TEMPLATES: '/api/communication/templates',
    TEMPLATE_BY_ID: '/api/communication/templates/:id',
    HISTORY: '/api/communication/history',
    STATISTICS: '/api/communication/statistics',
    PREFERENCES: '/api/communication/preferences',
  },

  // Inventory routes
  INVENTORY: {
    BASE: '/api/inventory',
    BY_ID: '/api/inventory/:id',
    ITEMS: '/api/inventory/items',
    ALERTS: '/api/inventory/alerts',
    TRANSACTIONS: '/api/inventory/transactions',
    CATEGORIES: '/api/inventory/categories',
    VENDORS: '/api/inventory/vendors',
    PURCHASE_ORDERS: '/api/inventory/purchase-orders',
    STOCK_LEVELS: '/api/inventory/stock-levels',
  },

  // Reports routes
  REPORTS: {
    BASE: '/api/reports',
    GENERATE: '/api/reports/generate',
    TYPES: '/api/reports/types',
    SCHEDULED: '/api/reports/scheduled',
    DOWNLOAD: '/api/reports/:id/download',
    STATISTICS: '/api/reports/statistics',
    DASHBOARD: '/api/reports/dashboard',
  },

  // Documents routes
  DOCUMENTS: {
    BASE: '/api/documents',
    BY_ID: '/api/documents/:id',
    UPLOAD: '/api/documents/upload',
    DOWNLOAD: '/api/documents/:id/download',
    DELETE: '/api/documents/:id',
    STUDENT: '/api/documents/student/:studentId',
    CATEGORIES: '/api/documents/categories',
  },

  // Administration routes
  ADMINISTRATION: {
    BASE: '/api/administration',
    SYSTEM_HEALTH: '/api/administration/system-health',
    SETTINGS: '/api/administration/settings',
    DISTRICTS: '/api/administration/districts',
    DISTRICT_BY_ID: '/api/administration/districts/:id',
    SCHOOLS: '/api/administration/schools',
    SCHOOL_BY_ID: '/api/administration/schools/:id',
    BACKUP: '/api/administration/backup',
    RESTORE: '/api/administration/restore',
    LOGS: '/api/administration/logs',
  },

  // Access Control routes
  ACCESS_CONTROL: {
    BASE: '/api/access-control',
    ROLES: '/api/access-control/roles',
    ROLE_BY_ID: '/api/access-control/roles/:id',
    PERMISSIONS: '/api/access-control/permissions',
    ASSIGN_ROLE: '/api/access-control/assign-role',
    REVOKE_ROLE: '/api/access-control/revoke-role',
  },

  // Audit routes
  AUDIT: {
    BASE: '/api/audit',
    LOGS: '/api/audit/logs',
    USER_ACTIVITY: '/api/audit/user-activity/:userId',
    EXPORT: '/api/audit/export',
    STATISTICS: '/api/audit/statistics',
  },

  // Compliance routes
  COMPLIANCE: {
    BASE: '/api/compliance',
    REPORTS: '/api/compliance/reports',
    REQUIREMENTS: '/api/compliance/requirements',
    VIOLATIONS: '/api/compliance/violations',
    AUDIT: '/api/compliance/audit',
  },

  // Integration routes
  INTEGRATION: {
    BASE: '/api/integration',
    WEBHOOKS: '/api/integration/webhooks',
    WEBHOOK_BY_ID: '/api/integration/webhooks/:id',
    API_KEYS: '/api/integration/api-keys',
    SYNC: '/api/integration/sync',
    STATUS: '/api/integration/status',
  },

  // Vendor routes
  VENDOR: {
    BASE: '/api/vendor',
    BY_ID: '/api/vendor/:id',
    SEARCH: '/api/vendor/search',
    PRODUCTS: '/api/vendor/:id/products',
  },

  // Budget routes
  BUDGET: {
    BASE: '/api/budget',
    BY_ID: '/api/budget/:id',
    ALLOCATIONS: '/api/budget/allocations',
    EXPENSES: '/api/budget/expenses',
    REPORTS: '/api/budget/reports',
  },

  // Purchase Order routes
  PURCHASE_ORDER: {
    BASE: '/api/purchase-order',
    BY_ID: '/api/purchase-order/:id',
    APPROVE: '/api/purchase-order/:id/approve',
    REJECT: '/api/purchase-order/:id/reject',
    RECEIVE: '/api/purchase-order/:id/receive',
  },
} as const;

// ===== HTTP STATUS CODES =====
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
} as const;

// ===== USER ROLES =====
export const USER_ROLES = {
  ADMIN: 'ADMIN',
  DISTRICT_ADMIN: 'DISTRICT_ADMIN',
  SCHOOL_ADMIN: 'SCHOOL_ADMIN',
  NURSE: 'NURSE',
  STAFF: 'STAFF',
  DOCTOR: 'DOCTOR',
  COUNSELOR: 'COUNSELOR',
  READ_ONLY: 'READ_ONLY',
} as const;

// ===== PERMISSIONS =====
export const PERMISSIONS = {
  // Student permissions
  STUDENTS_READ: 'students:read',
  STUDENTS_WRITE: 'students:write',
  STUDENTS_DELETE: 'students:delete',

  // Medication permissions
  MEDICATIONS_READ: 'medications:read',
  MEDICATIONS_WRITE: 'medications:write',
  MEDICATIONS_ADMINISTER: 'medications:administer',
  MEDICATIONS_DELETE: 'medications:delete',

  // Health records permissions
  HEALTH_RECORDS_READ: 'health_records:read',
  HEALTH_RECORDS_WRITE: 'health_records:write',
  HEALTH_RECORDS_DELETE: 'health_records:delete',

  // User management permissions
  USERS_READ: 'users:read',
  USERS_WRITE: 'users:write',
  USERS_DELETE: 'users:delete',

  // Admin permissions
  ADMIN_FULL: 'admin:full',
  SYSTEM_SETTINGS: 'system:settings',
  AUDIT_LOGS: 'audit:logs',

  // Reports permissions
  REPORTS_READ: 'reports:read',
  REPORTS_GENERATE: 'reports:generate',
  REPORTS_EXPORT: 'reports:export',
} as const;

// ===== DATABASE CONSTANTS =====
export const DB_CONSTRAINTS = {
  MAX_STRING_LENGTH: 255,
  MAX_TEXT_LENGTH: 5000,
  MAX_DESCRIPTION_LENGTH: 1000,
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 128,
  EMAIL_MAX_LENGTH: 255,
  PHONE_MAX_LENGTH: 20,
} as const;

// ===== PAGINATION =====
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
  PAGE_SIZE_OPTIONS: [5, 10, 25, 50, 100],
} as const;

// ===== DATE FORMATS =====
export const DATE_FORMATS = {
  ISO: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
  DATE_ONLY: 'YYYY-MM-DD',
  DISPLAY: 'MMM DD, YYYY',
  DISPLAY_WITH_TIME: 'MMM DD, YYYY HH:mm',
  TIME_ONLY: 'HH:mm',
} as const;

// ===== TOKEN CONFIGURATION =====
export const TOKEN_CONFIG = {
  JWT_SECRET: process.env.JWT_SECRET || 'default-secret-change-in-production',
  JWT_EXPIRES_IN: '8h',
  REFRESH_TOKEN_EXPIRES_IN: '7d',
  TOKEN_TYPE: 'Bearer',
} as const;

// ===== SESSION CONFIGURATION =====
export const SESSION_CONFIG = {
  SECRET: process.env.SESSION_SECRET || 'default-session-secret',
  MAX_AGE: 8 * 60 * 60 * 1000, // 8 hours
  COOKIE_NAME: 'white-cross-session',
  SECURE: process.env.NODE_ENV === 'production',
  HTTP_ONLY: true,
  SAME_SITE: 'strict' as const,
} as const;

// ===== RATE LIMITING =====
export const RATE_LIMIT = {
  WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  MAX_REQUESTS: 100,
  MAX_LOGIN_ATTEMPTS: 5,
  LOGIN_WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  LOCKOUT_DURATION_MS: 15 * 60 * 1000, // 15 minutes
} as const;

// ===== FILE UPLOAD =====
export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_MIME_TYPES: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif', '.pdf', '.doc', '.docx', '.xls', '.xlsx'],
  UPLOAD_DIR: process.env.UPLOAD_DIR || './uploads',
} as const;

// ===== MEDICATION CONSTANTS =====
export const MEDICATION_CONSTANTS = {
  DOSAGE_FORMS: ['Tablet', 'Capsule', 'Liquid', 'Injection', 'Inhaler', 'Topical', 'Suppository'],
  ROUTES: ['Oral', 'Intravenous', 'Intramuscular', 'Subcutaneous', 'Topical', 'Inhalation', 'Rectal'],
  FREQUENCIES: ['Once daily', 'Twice daily', 'Three times daily', 'Four times daily', 'As needed', 'Every 4 hours', 'Every 6 hours', 'Every 8 hours', 'Every 12 hours'],
  STOCK_ALERT_THRESHOLD: 20,
  CRITICAL_STOCK_THRESHOLD: 5,
  EXPIRATION_WARNING_DAYS: 30,
  EXPIRATION_CRITICAL_DAYS: 7,
} as const;

// ===== VALIDATION PATTERNS =====
export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[\d\s\-\+\(\)]+$/,
  PHONE_US: /^(\+1)?[\s\-]?\(?[2-9]\d{2}\)?[\s\-]?\d{3}[\s\-]?\d{4}$/,
  ZIP_CODE_US: /^\d{5}(-\d{4})?$/,
  SSN: /^\d{3}-\d{2}-\d{4}$/,
  STUDENT_NUMBER: /^[A-Z0-9]{6,10}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
} as const;

// ===== ERROR MESSAGES =====
export const ERROR_MESSAGES = {
  // General errors
  INTERNAL_SERVER_ERROR: 'An internal server error occurred',
  BAD_REQUEST: 'Invalid request',
  UNAUTHORIZED: 'Authentication required',
  FORBIDDEN: 'You do not have permission to perform this action',
  NOT_FOUND: 'Resource not found',
  CONFLICT: 'Resource already exists',
  VALIDATION_ERROR: 'Validation error',

  // Auth errors
  INVALID_CREDENTIALS: 'Invalid email or password',
  ACCOUNT_LOCKED: 'Account locked due to too many failed login attempts',
  TOKEN_EXPIRED: 'Session expired, please login again',
  INVALID_TOKEN: 'Invalid authentication token',

  // User errors
  USER_NOT_FOUND: 'User not found',
  USER_ALREADY_EXISTS: 'User with this email already exists',
  INVALID_PASSWORD: 'Password does not meet requirements',

  // Student errors
  STUDENT_NOT_FOUND: 'Student not found',
  STUDENT_ALREADY_EXISTS: 'Student with this student number already exists',

  // Medication errors
  MEDICATION_NOT_FOUND: 'Medication not found',
  INSUFFICIENT_STOCK: 'Insufficient medication stock',
  MEDICATION_EXPIRED: 'Medication has expired',

  // Database errors
  DB_CONNECTION_ERROR: 'Database connection error',
  DB_QUERY_ERROR: 'Database query error',
  DB_CONSTRAINT_VIOLATION: 'Database constraint violation',
} as const;

// ===== SUCCESS MESSAGES =====
export const SUCCESS_MESSAGES = {
  // General
  CREATED: 'Resource created successfully',
  UPDATED: 'Resource updated successfully',
  DELETED: 'Resource deleted successfully',

  // Auth
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
  PASSWORD_CHANGED: 'Password changed successfully',

  // User
  USER_CREATED: 'User created successfully',
  USER_UPDATED: 'User updated successfully',
  USER_DELETED: 'User deleted successfully',

  // Student
  STUDENT_CREATED: 'Student created successfully',
  STUDENT_UPDATED: 'Student updated successfully',
  STUDENT_DELETED: 'Student deleted successfully',

  // Medication
  MEDICATION_ADMINISTERED: 'Medication administered successfully',
  MEDICATION_CREATED: 'Medication created successfully',
  MEDICATION_UPDATED: 'Medication updated successfully',

  // Email/Communication
  EMAIL_SENT: 'Email sent successfully',
  NOTIFICATION_SENT: 'Notification sent successfully',
} as const;

// ===== CACHE KEYS =====
export const CACHE_KEYS = {
  USER_PREFIX: 'user:',
  STUDENT_PREFIX: 'student:',
  MEDICATION_PREFIX: 'medication:',
  SESSION_PREFIX: 'session:',
  RATE_LIMIT_PREFIX: 'rate_limit:',
} as const;

// ===== CACHE TTL (Time To Live in seconds) =====
export const CACHE_TTL = {
  SHORT: 60, // 1 minute
  MEDIUM: 300, // 5 minutes
  LONG: 3600, // 1 hour
  VERY_LONG: 86400, // 24 hours
} as const;

// ===== ENVIRONMENT =====
export const ENVIRONMENT = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3001', 10),
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  IS_TEST: process.env.NODE_ENV === 'test',
  JWT_SECRET: process.env.JWT_SECRET || 'default-secret-change-in-production',
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  MICROSOFT_CLIENT_ID: process.env.MICROSOFT_CLIENT_ID,
  MICROSOFT_CLIENT_SECRET: process.env.MICROSOFT_CLIENT_SECRET,
  BACKEND_URL: process.env.BACKEND_URL || 'http://localhost:3001',
} as const;

// ===== CORS CONFIGURATION =====
export const CORS_CONFIG = {
  ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
  CREDENTIALS: true,
  METHODS: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  ALLOWED_HEADERS: ['Content-Type', 'Authorization', 'X-Requested-With'],
} as const;

// ===== LOGGING =====
export const LOG_LEVELS = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  HTTP: 'http',
  DEBUG: 'debug',
} as const;

// Export all as a single object for convenience
export const CONSTANTS = {
  API_ROUTES,
  HTTP_STATUS,
  USER_ROLES,
  PERMISSIONS,
  DB_CONSTRAINTS,
  PAGINATION,
  DATE_FORMATS,
  TOKEN_CONFIG,
  SESSION_CONFIG,
  RATE_LIMIT,
  FILE_UPLOAD,
  MEDICATION_CONSTANTS,
  VALIDATION_PATTERNS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  CACHE_KEYS,
  CACHE_TTL,
  ENVIRONMENT,
  CORS_CONFIG,
  LOG_LEVELS,
} as const;

export default CONSTANTS;
