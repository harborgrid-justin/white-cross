/**
 * @fileoverview API Endpoints Constants - Modular Index
 * @module constants/api
 * @version 2.0.0 - Modular Edition
 *
 * Centralized API endpoint definitions for the White Cross healthcare platform.
 * This file re-exports all endpoints from modular components for backward compatibility.
 *
 * **Modular Architecture**:
 * - Auth & Security: Authentication, MFA, RBAC endpoints
 * - Students: Student management, appointments, scheduling endpoints  
 * - Health: Medical records, medications, immunizations endpoints
 * - Communications: Messages, alerts, notifications endpoints
 * - Admin: System administration, analytics, reporting endpoints
 *
 * **Benefits of New Structure**:
 * ✅ Each module under 500 lines (was 901 lines total)
 * ✅ Better separation of concerns by domain
 * ✅ Improved maintainability and navigation
 * ✅ Easier to find related endpoints
 * ✅ Backward compatibility maintained
 *
 * **Usage Examples**:
 * ```typescript
 * import { API_ENDPOINTS } from '@/constants/api';
 * import { STUDENTS_ENDPOINTS } from '@/constants/api/students';
 * import { AUTH_ENDPOINTS } from '@/constants/api/auth';
 *
 * // Use the unified API_ENDPOINTS object (backward compatible)
 * const url = API_ENDPOINTS.STUDENTS.BY_ID('123');
 *
 * // Or use specific domain endpoints directly
 * const authUrl = AUTH_ENDPOINTS.LOGIN;
 * const studentUrl = STUDENTS_ENDPOINTS.BY_ID('123');
 * ```
 */

// ==================== MODULAR IMPORTS ====================
export * from './auth';
export * from './students';
export * from './health';
export * from './communications';
export * from './admin';

// Import all endpoint groups for unified API_ENDPOINTS object
import { 
  AUTH_ENDPOINTS, 
  USERS_ENDPOINTS, 
  RBAC_ENDPOINTS, 
  MFA_ENDPOINTS 
} from './auth';

import { 
  STUDENTS_ENDPOINTS,
  APPOINTMENTS_ENDPOINTS,
  WAITLIST_ENDPOINTS,
  NURSE_AVAILABILITY_ENDPOINTS,
  EMERGENCY_CONTACTS_ENDPOINTS
} from './students';

import {
  HEALTH_RECORDS_ENDPOINTS,
  IMMUNIZATIONS_ENDPOINTS,
  SCREENINGS_ENDPOINTS,
  GROWTH_MEASUREMENTS_ENDPOINTS,
  ALLERGIES_ENDPOINTS,
  VITAL_SIGNS_ENDPOINTS,
  CHRONIC_CONDITIONS_ENDPOINTS,
  MEDICATIONS_ENDPOINTS,
  PRESCRIPTIONS_ENDPOINTS,
  INVENTORY_ENDPOINTS,
  ADMINISTRATION_LOG_ENDPOINTS,
  INCIDENTS_ENDPOINTS
} from './health';

import {
  MESSAGES_ENDPOINTS,
  BROADCASTS_ENDPOINTS,
  ALERTS_ENDPOINTS,
  NOTIFICATIONS_ENDPOINTS,
  CONVERSATIONS_ENDPOINTS,
  TEMPLATES_ENDPOINTS,
  DOCUMENTS_ENDPOINTS
} from './communications';

import {
  DASHBOARD_ENDPOINTS,
  ANALYTICS_ENDPOINTS,
  REPORTS_ENDPOINTS,
  SYSTEM_ENDPOINTS,
  ADMIN_ENDPOINTS,
  INTEGRATIONS_ENDPOINTS,
  COMPLIANCE_ENDPOINTS,
  AUDIT_ENDPOINTS,
  BILLING_ENDPOINTS,
  BUDGET_ENDPOINTS,
  PURCHASE_ORDERS_ENDPOINTS,
  VENDORS_ENDPOINTS,
  FORMS_ENDPOINTS,
  SETTINGS_ENDPOINTS
} from './admin';

// ==================== UNIFIED API_ENDPOINTS OBJECT ====================

/**
 * Unified API_ENDPOINTS object for backward compatibility
 * Maintains the same structure as the original monolithic file
 */
export const API_ENDPOINTS = {
  // Authentication & Authorization
  AUTH: AUTH_ENDPOINTS,
  USERS: USERS_ENDPOINTS,
  RBAC: RBAC_ENDPOINTS,
  MFA: MFA_ENDPOINTS,

  // Students & Appointments
  STUDENTS: STUDENTS_ENDPOINTS,
  APPOINTMENTS: APPOINTMENTS_ENDPOINTS,
  WAITLIST: WAITLIST_ENDPOINTS,
  NURSE_AVAILABILITY: NURSE_AVAILABILITY_ENDPOINTS,
  EMERGENCY_CONTACTS: EMERGENCY_CONTACTS_ENDPOINTS,

  // Health & Medical
  HEALTH_RECORDS: HEALTH_RECORDS_ENDPOINTS,
  IMMUNIZATIONS: IMMUNIZATIONS_ENDPOINTS,
  SCREENINGS: SCREENINGS_ENDPOINTS,
  GROWTH_MEASUREMENTS: GROWTH_MEASUREMENTS_ENDPOINTS,
  ALLERGIES: ALLERGIES_ENDPOINTS,
  VITAL_SIGNS: VITAL_SIGNS_ENDPOINTS,
  CHRONIC_CONDITIONS: CHRONIC_CONDITIONS_ENDPOINTS,
  MEDICATIONS: MEDICATIONS_ENDPOINTS,
  PRESCRIPTIONS: PRESCRIPTIONS_ENDPOINTS,
  INVENTORY: INVENTORY_ENDPOINTS,
  ADMINISTRATION_LOG: ADMINISTRATION_LOG_ENDPOINTS,
  INCIDENTS: INCIDENTS_ENDPOINTS,

  // Communications
  MESSAGES: MESSAGES_ENDPOINTS,
  BROADCASTS: BROADCASTS_ENDPOINTS,
  ALERTS: ALERTS_ENDPOINTS,
  NOTIFICATIONS: NOTIFICATIONS_ENDPOINTS,
  CONVERSATIONS: CONVERSATIONS_ENDPOINTS,
  TEMPLATES: TEMPLATES_ENDPOINTS,
  DOCUMENTS: DOCUMENTS_ENDPOINTS,

  // Analytics & Administration
  DASHBOARD: DASHBOARD_ENDPOINTS,
  ANALYTICS: ANALYTICS_ENDPOINTS,
  REPORTS: REPORTS_ENDPOINTS,
  SYSTEM: SYSTEM_ENDPOINTS,
  ADMIN: ADMIN_ENDPOINTS,
  INTEGRATIONS: INTEGRATIONS_ENDPOINTS,
  COMPLIANCE: COMPLIANCE_ENDPOINTS,
  AUDIT: AUDIT_ENDPOINTS,

  // Financial & Procurement
  BILLING: BILLING_ENDPOINTS,
  BUDGET: BUDGET_ENDPOINTS,
  PURCHASE_ORDERS: PURCHASE_ORDERS_ENDPOINTS,
  VENDORS: VENDORS_ENDPOINTS,

  // Forms & Settings
  FORMS: FORMS_ENDPOINTS,
  SETTINGS: SETTINGS_ENDPOINTS,
} as const;

// ==================== HTTP STATUS CODES ====================

/**
 * HTTP Status Codes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
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

// ==================== API RESPONSE TYPES ====================

/**
 * API Response Types
 */
export type ApiSuccessResponse<T = unknown> = {
  success: true;
  data: T;
  message?: string;
};

export type ApiErrorResponse = {
  success: false;
  error: string;
  code?: string;
  details?: Record<string, unknown>;
  traceId?: string;
};

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Pagination Types
 */
export type PaginationParams = {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
};

export type PaginatedResponse<T> = {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
};

// ==================== LEGACY COMPATIBILITY ====================

/**
 * Default export for backward compatibility
 */
export default API_ENDPOINTS;

// ==================== MODULE METADATA ====================

/**
 * Module version for tracking changes
 */
export const API_CONSTANTS_VERSION = '2.0.0-modular';

/**
 * Legacy file version for reference
 */
export const LEGACY_VERSION = '2.0.0';

/**
 * Original file size for reference
 */
export const ORIGINAL_LINE_COUNT = 901;

/**
 * New modular structure line counts
 */
export const MODULAR_STRUCTURE = {
  'auth.ts': '~100 lines',
  'students.ts': '~200 lines',
  'health.ts': '~300 lines', 
  'communications.ts': '~150 lines',
  'admin.ts': '~400 lines',
  'index.ts': 'Re-exports'
} as const;

/**
 * Migration completion marker
 */
export const REFACTORING_COMPLETED = true;
