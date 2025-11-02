/**
 * Constants Module - Centralized Export
 *
 * This barrel file exports all constants for convenient importing.
 * You can import from specific files or from this index file.
 *
 * @example
 * // Import from specific file (recommended for tree-shaking)
 * import { API_ENDPOINTS } from '@/constants/api';
 *
 * @example
 * // Import from index file (convenient for multiple imports)
 * import { API_ENDPOINTS, ERROR_CODES, PUBLIC_ROUTES } from '@/constants';
 */

// API Endpoints
export {
  API_ENDPOINTS,
  HTTP_STATUS,
  type ApiSuccessResponse,
  type ApiErrorResponse,
  type ApiResponse,
  type PaginationParams,
  type PaginatedResponse,
} from './api';

// Application Configuration
export {
  API_CONFIG,
  APP_ENV,
  FEATURE_FLAGS,
  SECURITY_CONFIG,
  VALIDATION_CONFIG,
} from './config';

// Error Messages
export {
  ERROR_MESSAGES,
  getApiErrorMessage,
} from './errorMessages';

// Error Codes and Utilities
export {
  ERROR_CODES,
  type ErrorCode,
  getUserMessage,
  getErrorTitle,
  isRetryableError,
  requiresReauth,
  getErrorSeverity,
} from './errors';

// Health Records Constants
export {
  HEALTH_RECORD_TYPES,
  type HealthRecordType,
  HEALTH_RECORD_STATUS,
  type HealthRecordStatus,
  VITAL_TYPES,
  type VitalType,
  ALLERGY_TYPES,
  type AllergyType,
  ALLERGY_TYPE_OPTIONS,
  ALLERGY_SEVERITY,
  type AllergySeverity,
  SEVERITY_LEVELS, // Note: For allergy severity levels. Medication severity is MEDICATION_SEVERITY_LEVELS
  IMMUNIZATION_STATUS,
  type ImmunizationStatus,
  COMMON_VACCINES,
  GROWTH_PERCENTILES,
  SCREENING_TYPES,
  type ScreeningType,
  CONDITION_STATUS_OPTIONS,
  VaccinationComplianceStatus,
} from './healthRecords';

// Medication Constants
export {
  DATE_FORMATS,
  type DateFormat,
  EXPIRATION_WARNINGS,
  STOCK_THRESHOLDS,
  SEVERITY_LEVELS as MEDICATION_SEVERITY_LEVELS, // Renamed to avoid conflict with healthRecords
  type SeverityLevel,
  MEDICATION_STATUSES,
  type MedicationStatus,
  INVENTORY_STATUSES,
  type InventoryStatus,
  DOSAGE_FORMS,
  type DosageForm,
  MEDICATION_ROUTES,
  type MedicationRoute,
} from './medications';

// Routes
export {
  PUBLIC_ROUTES,
  PROTECTED_ROUTES,
  ADMIN_ROUTES,
  API_ROUTES,
  EXTERNAL_ROUTES,
  RouteBuilders,
  type RouteMetadata,
  getAllProtectedRoutes,
  getAllAdminRoutes,
  getAllPublicRoutes,
  isPublicRoute,
  isProtectedRoute,
  isAdminRoute,
} from './routes';
