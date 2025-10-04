/**
 * Centralized constants index for the healthcare platform
 * Provides a single entry point for all constants and configurations
 */

// Export configuration constants
export {
  API_CONFIG,
  PAGINATION_CONFIG,
  SEARCH_CONFIG,
  DATE_CONFIG,
  FILE_CONFIG,
  VALIDATION_CONFIG,
  UI_CONFIG,
  HEALTHCARE_CONFIG,
  SECURITY_CONFIG,
  PERFORMANCE_CONFIG,
  APP_CONFIG
} from './config';

// Export error constants
export {
  ERROR_CODES,
  ERROR_MESSAGES,
  USER_MESSAGES,
  ERROR_TITLES,
  HTTP_STATUS_MAPPING,
  FIELD_VALIDATION_MESSAGES,
  HEALTHCARE_ERROR_MESSAGES,
  ERROR_SEVERITY,
  ERROR_CATEGORIES,
  getErrorMessage,
  getUserMessage,
  getErrorTitle,
  getErrorSeverity,
  getErrorCategory
} from './errors';

// Export validation constants
export {
  VALIDATION_PATTERNS,
  VALIDATION_RULES,
  FIELD_LIMITS,
  VALIDATION_MESSAGES,
  FORM_SCHEMAS,
  CUSTOM_VALIDATORS,
  validateField,
  validateForm
} from './validation';

// Export UI constants
export {
  COMPONENT_SIZES,
  BUTTON_VARIANTS,
  BUTTON_SIZES,
  FIELD_VARIANTS,
  HEALTHCARE_COLORS,
  TABLE_CONFIG,
  MODAL_SIZES,
  DRAWER_POSITIONS,
  ANIMATION_DURATIONS,
  Z_INDEX,
  FORM_LAYOUT,
  FIELD_WIDTHS,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
  TYPOGRAPHY,
  LOADING_STATES,
  SPINNER_SIZES,
  TOAST_POSITIONS,
  TOAST_TYPES,
  BADGE_VARIANTS,
  ICON_SIZES,
  HEALTHCARE_ICONS,
  FIELD_TYPES,
  FORM_GRID,
  BREAKPOINTS,
  A11Y,
  THEME,
  UI_CONSTANTS
} from './ui';

// Export API constants
export {
  HTTP_METHODS,
  HTTP_STATUS,
  CONTENT_TYPES,
  RESPONSE_TYPES,
  API_ENDPOINTS,
  QUERY_PARAMS,
  DEFAULT_QUERY_VALUES,
  API_HEADERS,
  RATE_LIMITING,
  CACHE_CONFIG,
  REQUEST_CONFIG,
  ERROR_RESPONSE,
  SUCCESS_RESPONSE,
  PAGINATION_RESPONSE,
  UPLOAD_CONFIG,
  API_VERSION,
  WS_EVENTS,
  WS_CHANNELS,
  API_CONSTANTS
} from './api';

// Re-export constants from other files for convenience
export {
  RECORD_TYPES,
  HEALTH_TABS,
  SEVERITY_LEVELS as HEALTH_RECORD_SEVERITY_LEVELS,
  CONDITION_STATUS_OPTIONS,
  VACCINATION_PRIORITIES,
  EXPORT_FORMATS,
  REPORT_TYPES,
  REMINDER_METHODS,
  GROWTH_CHART_TYPES
} from './healthRecords';

export {
  MEDICATION_TABS,
  DOSAGE_FORMS,
  ADMINISTRATION_ROUTES,
  SEVERITY_LEVELS as MEDICATION_SEVERITY_LEVELS,
  MEDICATION_STATUSES,
  INVENTORY_STATUSES,
  REMINDER_INTERVALS,
  MEDICATION_UNITS,
  PRIORITY_LEVELS,
  STORAGE_CONDITIONS,
  COMMON_ALLERGIES,
  AGE_GROUPS,
  PAGINATION_DEFAULTS,
  SEARCH_CONFIG as MEDICATION_SEARCH_CONFIG,
  DATE_FORMATS,
  STOCK_THRESHOLDS,
  EXPIRATION_WARNINGS
} from './medications';

// Create a comprehensive constants object for easy access
import { APP_CONFIG } from './config';
import { ERROR_CODES, ERROR_MESSAGES, USER_MESSAGES, ERROR_TITLES } from './errors';
import {
  VALIDATION_PATTERNS,
  VALIDATION_RULES,
  FIELD_LIMITS,
  VALIDATION_MESSAGES,
  FORM_SCHEMAS
} from './validation';

export const CONSTANTS = {
  // Application configuration
  CONFIG: APP_CONFIG,

  // Error handling
  ERRORS: {
    CODES: ERROR_CODES,
    MESSAGES: ERROR_MESSAGES,
    USER_MESSAGES,
    TITLES: ERROR_TITLES,
  },

  // Validation
  VALIDATION: {
    PATTERNS: VALIDATION_PATTERNS,
    RULES: VALIDATION_RULES,
    LIMITS: FIELD_LIMITS,
    MESSAGES: VALIDATION_MESSAGES,
    SCHEMAS: FORM_SCHEMAS,
  },

  // Healthcare specific constants (re-exported from other files)
  HEALTH_RECORDS: {
    RECORD_TYPES: [], // Will be populated when healthRecords constants are loaded
    HEALTH_TABS: [],
    SEVERITY_LEVELS: [],
    CONDITION_STATUS_OPTIONS: [],
    VACCINATION_PRIORITIES: [],
    EXPORT_FORMATS: [],
    REPORT_TYPES: [],
    REMINDER_METHODS: [],
    GROWTH_CHART_TYPES: [],
  },

  MEDICATIONS: {
    MEDICATION_TABS: [],
    DOSAGE_FORMS: [],
    ADMINISTRATION_ROUTES: [],
    SEVERITY_LEVELS: [],
    MEDICATION_STATUSES: [],
    INVENTORY_STATUSES: [],
    REMINDER_INTERVALS: [],
    MEDICATION_UNITS: [],
    PRIORITY_LEVELS: [],
    STORAGE_CONDITIONS: [],
    COMMON_ALLERGIES: [],
    AGE_GROUPS: [],
    PAGINATION_DEFAULTS: { pageSize: 10, pageSizeOptions: [5, 10, 25, 50, 100] },
    SEARCH_CONFIG: { minSearchLength: 2, searchDelay: 300, maxResults: 100 },
    DATE_FORMATS: { display: 'MMM dd, yyyy', input: 'yyyy-MM-dd', datetime: 'MMM dd, yyyy HH:mm', time: 'HH:mm' },
    STOCK_THRESHOLDS: { critical: 5, low: 20, reorder: 50 },
    EXPIRATION_WARNINGS: { critical: 7, warning: 30, notice: 90 },
  },
} as const;

export default CONSTANTS;
