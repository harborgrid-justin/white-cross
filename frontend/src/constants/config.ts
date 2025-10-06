/**
 * Centralized configuration constants for the healthcare platform
 * Consolidates all configuration values for consistency and maintainability
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  },
} as const;

// Pagination Configuration
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 25, 50, 100],
  MAX_PAGE_SIZE: 100,
} as const;

// Search Configuration
export const SEARCH_CONFIG = {
  MIN_SEARCH_LENGTH: 2,
  SEARCH_DELAY: 300, // ms
  MAX_RESULTS: 100,
  DEBOUNCE_DELAY: 300,
} as const;

// Date and Time Configuration
export const DATE_CONFIG = {
  FORMATS: {
    DISPLAY: 'MMM dd, yyyy',
    INPUT: 'yyyy-MM-dd',
    DATETIME: 'MMM dd, yyyy HH:mm',
    TIME: 'HH:mm',
    API: 'yyyy-MM-dd\'T\'HH:mm:ss.SSSxxx',
  },
  TIMEZONES: {
    DEFAULT: 'America/New_York',
  },
} as const;

// File Upload Configuration
export const FILE_CONFIG = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif', '.pdf', '.doc', '.docx'],
} as const;

// Form Validation Configuration
export const VALIDATION_CONFIG = {
  DEBOUNCE_DELAY: 300,
  MAX_FIELD_LENGTH: 1000,
  MIN_PASSWORD_LENGTH: 8,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[+]?[1-9][\d]{0,15}$/,
} as const;

// UI Configuration
export const UI_CONFIG = {
  TOAST_DURATION: 5000,
  MODAL_ANIMATION_DURATION: 200,
  DRAWER_WIDTH: 400,
  MOBILE_BREAKPOINT: 768,
  TABLET_BREAKPOINT: 1024,
} as const;

// Healthcare-specific Configuration
export const HEALTHCARE_CONFIG = {
  AGE_GROUPS: [
    { value: 'infant', label: 'Infant (0-12 months)', minAge: 0, maxAge: 1 },
    { value: 'toddler', label: 'Toddler (1-3 years)', minAge: 1, maxAge: 3 },
    { value: 'preschool', label: 'Preschool (3-5 years)', minAge: 3, maxAge: 5 },
    { value: 'school-age', label: 'School Age (6-12 years)', minAge: 6, maxAge: 12 },
    { value: 'adolescent', label: 'Adolescent (13-18 years)', minAge: 13, maxAge: 18 },
    { value: 'adult', label: 'Adult (18+ years)', minAge: 18, maxAge: 999 },
  ],
  STOCK_THRESHOLDS: {
    CRITICAL: 5,
    LOW: 20,
    REORDER: 50,
  },
  EXPIRATION_WARNINGS: {
    CRITICAL: 7,    // Red alert - expires within 7 days
    WARNING: 30,    // Yellow alert - expires within 30 days
    NOTICE: 90,     // Blue notice - expires within 90 days
  },
} as const;

// Security Configuration
export const SECURITY_CONFIG = {
  CSP_NONCE_LENGTH: 16,
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
  SESSION_TIMEOUT: 8 * 60 * 60 * 1000, // 8 hours
} as const;

// Performance Configuration
export const PERFORMANCE_CONFIG = {
  VIRTUAL_SCROLL_THRESHOLD: 50,
  LAZY_LOAD_THRESHOLD: 100,
  CACHE_TTL: 5 * 60 * 1000, // 5 minutes
  DEBOUNCE_THRESHOLD: 100,
} as const;

// Export all configurations as a single object for easy importing
export const APP_CONFIG = {
  API: API_CONFIG,
  PAGINATION: PAGINATION_CONFIG,
  SEARCH: SEARCH_CONFIG,
  DATE: DATE_CONFIG,
  FILE: FILE_CONFIG,
  VALIDATION: VALIDATION_CONFIG,
  UI: UI_CONFIG,
  HEALTHCARE: HEALTHCARE_CONFIG,
  SECURITY: SECURITY_CONFIG,
  PERFORMANCE: PERFORMANCE_CONFIG,
} as const;

export default APP_CONFIG;
