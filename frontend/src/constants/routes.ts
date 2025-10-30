/**
 * WF-CONST-002 | routes.ts - Application Route Constants
 * Purpose: Centralized route definitions for consistent navigation and access control
 * Dependencies: None (standalone constants module)
 * Exports: PUBLIC_ROUTES, PROTECTED_ROUTES, ADMIN_ROUTES, API_ROUTES, EXTERNAL_ROUTES
 * Features: Type-safe routes, role-based organization, parameterized route builders
 * Last Updated: 2025-10-27
 * Agent: Core Config/Constants Architect
 *
 * Route Categories:
 * - PUBLIC_ROUTES: Accessible without authentication (login, register, etc.)
 * - PROTECTED_ROUTES: Require authentication (dashboard, profile, etc.)
 * - ADMIN_ROUTES: Require admin/elevated privileges
 * - API_ROUTES: Backend API endpoints
 * - EXTERNAL_ROUTES: Third-party service links
 *
 * Route Organization:
 * - Authentication & Account Management
 * - Core Application (Dashboard, Profile)
 * - Clinical (Students, Health Records, Medications, Appointments)
 * - Operations (Billing, Inventory, Purchasing, Vendors)
 * - Communication (Messages, Documents, Notifications)
 * - Incidents & Safety
 * - Analytics & Reporting
 * - Compliance & Security
 * - System Administration
 *
 * Usage Pattern:
 * - Use constants instead of hardcoded strings
 * - Utilize route builders for parameterized routes
 * - Leverage type checking for route validation
 */

/**
 * Public routes accessible without authentication
 *
 * These routes are available to all users regardless of authentication status.
 * Typically used for login, registration, password reset, and public information.
 *
 * Access Control:
 * - No authentication required
 * - May redirect authenticated users to dashboard
 * - Include error pages and static content
 *
 * @example
 * ```tsx
 * // Redirect to login if not authenticated
 * if (!user) {
 *   navigate(PUBLIC_ROUTES.LOGIN);
 * }
 * ```
 */
export const PUBLIC_ROUTES = {
  /** Landing/home page */
  HOME: '/',

  /** User authentication */
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  VERIFY_EMAIL: '/verify-email',

  /** Multi-factor authentication */
  MFA_SETUP: '/mfa/setup',
  MFA_VERIFY: '/mfa/verify',

  /** Public information pages */
  ABOUT: '/about',
  CONTACT: '/contact',
  PRIVACY_POLICY: '/privacy',
  TERMS_OF_SERVICE: '/terms',
  ACCESSIBILITY: '/accessibility',

  /** Help and documentation */
  HELP: '/help',
  FAQ: '/faq',

  /** Error pages */
  ERROR_404: '/404',
  ERROR_500: '/500',
  ERROR_403: '/403',
  MAINTENANCE: '/maintenance',

  /** Public health resources (if applicable) */
  HEALTH_RESOURCES: '/resources',
} as const;

/**
 * Protected routes requiring authentication
 *
 * These routes require a valid authenticated session. Users without
 * authentication will be redirected to the login page.
 *
 * Access Control:
 * - Authentication required
 * - Role-based filtering applied at component level
 * - Permission checks enforced by middleware
 *
 * @example
 * ```tsx
 * // Navigate to dashboard after login
 * navigate(PROTECTED_ROUTES.DASHBOARD);
 * ```
 */
export const PROTECTED_ROUTES = {
  // ============================================================================
  // CORE APPLICATION
  // ============================================================================
  /** Main dashboard */
  DASHBOARD: '/dashboard',

  /** User profile and settings */
  PROFILE: '/profile',
  PROFILE_SETTINGS: '/profile/settings',
  PROFILE_SECURITY: '/profile/security',
  PROFILE_NOTIFICATIONS: '/profile/notifications',
  PROFILE_PREFERENCES: '/profile/preferences',

  /** Search */
  SEARCH: '/search',

  // ============================================================================
  // CLINICAL - STUDENTS
  // ============================================================================
  /** Student management */
  STUDENTS: '/students',
  STUDENTS_LIST: '/students',
  STUDENT_DETAIL: '/students/:id',
  STUDENT_CREATE: '/students/new',
  STUDENT_EDIT: '/students/:id/edit',
  STUDENT_IMPORT: '/students/import',
  STUDENT_EXPORT: '/students/export',

  /** Student health records */
  STUDENT_HEALTH_RECORDS: '/students/:id/health-records',
  STUDENT_MEDICATIONS: '/students/:id/medications',
  STUDENT_APPOINTMENTS: '/students/:id/appointments',
  STUDENT_IMMUNIZATIONS: '/students/:id/immunizations',
  STUDENT_INCIDENTS: '/students/:id/incidents',
  STUDENT_DOCUMENTS: '/students/:id/documents',

  // ============================================================================
  // CLINICAL - HEALTH RECORDS
  // ============================================================================
  /** Health records */
  HEALTH_RECORDS: '/health-records',
  HEALTH_RECORDS_LIST: '/health-records',
  HEALTH_RECORD_DETAIL: '/health-records/:id',
  HEALTH_RECORD_CREATE: '/health-records/new',
  HEALTH_RECORD_EDIT: '/health-records/:id/edit',
  HEALTH_RECORDS_PENDING: '/health-records/pending',

  // ============================================================================
  // CLINICAL - MEDICATIONS
  // ============================================================================
  /** Medication management */
  MEDICATIONS: '/medications',
  MEDICATIONS_LIST: '/medications',
  MEDICATION_DETAIL: '/medications/:id',
  MEDICATION_CREATE: '/medications/new',
  MEDICATION_EDIT: '/medications/:id/edit',
  MEDICATIONS_SCHEDULE: '/medications/schedule',
  MEDICATIONS_LOG: '/medications/log',
  MEDICATIONS_INVENTORY: '/medications/inventory',

  // ============================================================================
  // CLINICAL - APPOINTMENTS
  // ============================================================================
  /** Appointment scheduling */
  APPOINTMENTS: '/appointments',
  APPOINTMENTS_CALENDAR: '/appointments',
  APPOINTMENT_DETAIL: '/appointments/:id',
  APPOINTMENT_CREATE: '/appointments/new',
  APPOINTMENT_EDIT: '/appointments/:id/edit',
  APPOINTMENTS_TODAY: '/appointments/today',
  APPOINTMENTS_UPCOMING: '/appointments/upcoming',
  APPOINTMENTS_HISTORY: '/appointments/history',

  // ============================================================================
  // CLINICAL - IMMUNIZATIONS
  // ============================================================================
  /** Immunization tracking */
  IMMUNIZATIONS: '/immunizations',
  IMMUNIZATIONS_LIST: '/immunizations',
  IMMUNIZATION_DETAIL: '/immunizations/:id',
  IMMUNIZATION_CREATE: '/immunizations/new',
  IMMUNIZATION_EDIT: '/immunizations/:id/edit',
  IMMUNIZATIONS_DUE: '/immunizations/due',
  IMMUNIZATIONS_COMPLIANCE: '/immunizations/compliance',

  // ============================================================================
  // OPERATIONS - BILLING
  // ============================================================================
  /** Billing and invoicing */
  BILLING: '/billing',
  BILLING_INVOICES: '/billing/invoices',
  BILLING_INVOICE_DETAIL: '/billing/invoices/:id',
  BILLING_PAYMENTS: '/billing/payments',
  BILLING_PAYMENT_DETAIL: '/billing/payments/:id',
  BILLING_OUTSTANDING: '/billing/outstanding',
  BILLING_REPORTS: '/billing/reports',

  // ============================================================================
  // OPERATIONS - INVENTORY
  // ============================================================================
  /** Inventory management */
  INVENTORY: '/inventory',
  INVENTORY_LIST: '/inventory',
  INVENTORY_ITEM_DETAIL: '/inventory/:id',
  INVENTORY_ITEM_CREATE: '/inventory/new',
  INVENTORY_ITEM_EDIT: '/inventory/:id/edit',
  INVENTORY_LOW_STOCK: '/inventory/low-stock',
  INVENTORY_EXPIRING: '/inventory/expiring',
  INVENTORY_ALERTS: '/inventory/alerts',

  // ============================================================================
  // OPERATIONS - PURCHASING
  // ============================================================================
  /** Purchasing and procurement */
  PURCHASING: '/purchasing',
  PURCHASING_ORDERS: '/purchasing/orders',
  PURCHASE_ORDER_DETAIL: '/purchasing/orders/:id',
  PURCHASE_ORDER_CREATE: '/purchasing/orders/new',
  PURCHASING_PENDING: '/purchasing/pending',
  PURCHASING_APPROVED: '/purchasing/approved',

  // ============================================================================
  // OPERATIONS - VENDORS
  // ============================================================================
  /** Vendor management */
  VENDORS: '/vendors',
  VENDORS_LIST: '/vendors',
  VENDOR_DETAIL: '/vendors/:id',
  VENDOR_CREATE: '/vendors/new',
  VENDOR_EDIT: '/vendors/:id/edit',

  // ============================================================================
  // COMMUNICATION - MESSAGES
  // ============================================================================
  /** Messaging system */
  MESSAGES: '/messages',
  MESSAGES_INBOX: '/messages/inbox',
  MESSAGES_SENT: '/messages/sent',
  MESSAGES_DRAFTS: '/messages/drafts',
  MESSAGES_ARCHIVED: '/messages/archived',
  MESSAGE_DETAIL: '/messages/:id',
  MESSAGE_NEW: '/messages/new',

  // ============================================================================
  // COMMUNICATION - DOCUMENTS
  // ============================================================================
  /** Document management */
  DOCUMENTS: '/documents',
  DOCUMENTS_LIST: '/documents',
  DOCUMENT_DETAIL: '/documents/:id',
  DOCUMENT_UPLOAD: '/documents/upload',
  DOCUMENT_TEMPLATES: '/documents/templates',
  DOCUMENTS_PENDING_SIGNATURE: '/documents/pending',
  DOCUMENTS_SIGNED: '/documents/signed',

  // ============================================================================
  // COMMUNICATION - BROADCASTS
  // ============================================================================
  /** Broadcast notifications */
  BROADCASTS: '/broadcasts',
  BROADCASTS_LIST: '/broadcasts',
  BROADCAST_CREATE: '/broadcasts/new',
  BROADCAST_DETAIL: '/broadcasts/:id',

  // ============================================================================
  // INCIDENTS & SAFETY
  // ============================================================================
  /** Incident reporting */
  INCIDENTS: '/incidents',
  INCIDENTS_LIST: '/incidents',
  INCIDENT_DETAIL: '/incidents/:id',
  INCIDENT_CREATE: '/incidents/new',
  INCIDENT_EDIT: '/incidents/:id/edit',
  INCIDENTS_PENDING: '/incidents/pending',
  INCIDENTS_RESOLVED: '/incidents/resolved',

  /** Emergency contacts */
  EMERGENCY_CONTACTS: '/emergency-contacts',
  EMERGENCY_CONTACT_DETAIL: '/emergency-contacts/:id',
  EMERGENCY_CONTACT_CREATE: '/emergency-contacts/new',
  EMERGENCY_CONTACT_EDIT: '/emergency-contacts/:id/edit',

  // ============================================================================
  // ANALYTICS & REPORTING
  // ============================================================================
  /** Analytics dashboards */
  ANALYTICS: '/analytics',
  ANALYTICS_HEALTH: '/analytics/health',
  ANALYTICS_TRENDS: '/analytics/trends',
  ANALYTICS_DEMOGRAPHICS: '/analytics/demographics',

  /** Reports */
  REPORTS: '/reports',
  REPORTS_HEALTH: '/reports/health',
  REPORTS_COMPLIANCE: '/reports/compliance',
  REPORTS_FINANCIAL: '/reports/financial',
  REPORTS_CUSTOM: '/reports/custom',

  /** Health trends */
  TRENDS: '/trends',
  TRENDS_ILLNESS: '/trends/illness',
  TRENDS_MEDICATION: '/trends/medication',
  TRENDS_IMMUNIZATION: '/trends/immunization',

  // ============================================================================
  // SETTINGS
  // ============================================================================
  /** Application settings */
  SETTINGS: '/settings',
  SETTINGS_GENERAL: '/settings/general',
  SETTINGS_NOTIFICATIONS: '/settings/notifications',
  SETTINGS_INTEGRATIONS: '/settings/integrations',
  SETTINGS_SECURITY: '/settings/security',
  SETTINGS_BACKUP: '/settings/backup',

  // ============================================================================
  // NOTIFICATIONS
  // ============================================================================
  /** Notification center */
  NOTIFICATIONS: '/notifications',
  NOTIFICATIONS_ALL: '/notifications/all',
  NOTIFICATIONS_UNREAD: '/notifications/unread',
  NOTIFICATIONS_SETTINGS: '/notifications/settings',
} as const;

/**
 * Admin routes requiring elevated privileges
 *
 * These routes are restricted to users with administrative roles
 * (ADMIN, DISTRICT_ADMIN, etc.).
 *
 * Access Control:
 * - Authentication required
 * - Admin role required
 * - Permission checks enforced
 * - Audit logging enabled
 *
 * @example
 * ```tsx
 * // Check admin access before navigation
 * if (hasAdminRole(user)) {
 *   navigate(ADMIN_ROUTES.USERS);
 * }
 * ```
 */
export const ADMIN_ROUTES = {
  /** Admin dashboard */
  ADMIN_DASHBOARD: '/admin',

  /** User management */
  USERS: '/users',
  USERS_LIST: '/users',
  USER_DETAIL: '/users/:id',
  USER_CREATE: '/users/new',
  USER_EDIT: '/users/:id/edit',
  USER_PERMISSIONS: '/users/:id/permissions',

  /** Role management */
  ROLES: '/roles',
  ROLES_LIST: '/roles',
  ROLE_DETAIL: '/roles/:id',
  ROLE_CREATE: '/roles/new',
  ROLE_EDIT: '/roles/:id/edit',

  /** Permission management */
  PERMISSIONS: '/permissions',
  PERMISSIONS_LIST: '/permissions',
  PERMISSION_GROUPS: '/permissions/groups',

  /** Audit logs */
  AUDIT_LOGS: '/audit-logs',
  AUDIT_LOG_DETAIL: '/audit-logs/:id',
  AUDIT_LOGS_PHI_ACCESS: '/audit-logs/phi',
  AUDIT_LOGS_LOGIN: '/audit-logs/login',
  AUDIT_LOGS_CHANGES: '/audit-logs/changes',

  /** Compliance and policies */
  POLICIES: '/policies',
  POLICIES_LIST: '/policies',
  POLICY_DETAIL: '/policies/:id',
  POLICY_CREATE: '/policies/new',
  POLICY_EDIT: '/policies/:id/edit',

  /** System configuration */
  SYSTEM_CONFIG: '/system/config',
  SYSTEM_INTEGRATIONS: '/system/integrations',
  SYSTEM_BACKUPS: '/system/backups',
  SYSTEM_LOGS: '/system/logs',
  SYSTEM_MONITORING: '/system/monitoring',

  /** Organization management */
  ORGANIZATIONS: '/organizations',
  ORGANIZATION_DETAIL: '/organizations/:id',
  ORGANIZATION_CREATE: '/organizations/new',
  ORGANIZATION_EDIT: '/organizations/:id/edit',

  /** School management */
  SCHOOLS: '/schools',
  SCHOOL_DETAIL: '/schools/:id',
  SCHOOL_CREATE: '/schools/new',
  SCHOOL_EDIT: '/schools/:id/edit',
} as const;

/**
 * API endpoint routes
 *
 * Backend API endpoints for data fetching and mutations.
 * These should match the backend route definitions.
 *
 * @example
 * ```typescript
 * // Make API call
 * const response = await fetch(API_ROUTES.STUDENTS);
 * ```
 */
export const API_ROUTES = {
  /** Base API URL */
  BASE: '/api/v1',

  /** Authentication */
  AUTH_LOGIN: '/auth/login',
  AUTH_LOGOUT: '/auth/logout',
  AUTH_REGISTER: '/auth/register',
  AUTH_REFRESH: '/auth/refresh',
  AUTH_FORGOT_PASSWORD: '/auth/forgot-password',
  AUTH_RESET_PASSWORD: '/auth/reset-password',
  AUTH_VERIFY_EMAIL: '/auth/verify-email',
  AUTH_MFA_SETUP: '/auth/mfa/setup',
  AUTH_MFA_VERIFY: '/auth/mfa/verify',

  /** Users */
  USERS: '/users',
  USER_BY_ID: '/users/:id',
  USER_ME: '/users/me',

  /** Students */
  STUDENTS: '/students',
  STUDENT_BY_ID: '/students/:id',
  STUDENT_SEARCH: '/students/search',

  /** Health Records */
  HEALTH_RECORDS: '/health-records',
  HEALTH_RECORD_BY_ID: '/health-records/:id',

  /** Medications */
  MEDICATIONS: '/medications',
  MEDICATION_BY_ID: '/medications/:id',

  /** Appointments */
  APPOINTMENTS: '/appointments',
  APPOINTMENT_BY_ID: '/appointments/:id',

  /** GraphQL endpoint */
  GRAPHQL: '/graphql',

  /** Health check */
  HEALTH: '/health',
} as const;

/**
 * External service routes
 *
 * Links to external services and third-party integrations.
 *
 * @example
 * ```tsx
 * // Open help documentation
 * window.open(EXTERNAL_ROUTES.DOCUMENTATION, '_blank');
 * ```
 */
export const EXTERNAL_ROUTES = {
  /** Help and documentation */
  DOCUMENTATION: 'https://docs.whitecross.health',
  SUPPORT: 'https://support.whitecross.health',

  /** Status and monitoring */
  STATUS_PAGE: 'https://status.whitecross.health',

  /** Social media */
  TWITTER: 'https://twitter.com/whitecross',
  LINKEDIN: 'https://linkedin.com/company/whitecross',

  /** Legal */
  PRIVACY_POLICY_FULL: 'https://whitecross.health/privacy',
  TERMS_FULL: 'https://whitecross.health/terms',
} as const;

/**
 * Route parameter builders
 *
 * Helper functions to build parameterized routes with type safety.
 *
 * @example
 * ```typescript
 * // Build student detail route
 * const route = buildStudentDetailRoute('123');
 * // Returns: '/students/123'
 * ```
 */
export const RouteBuilders = {
  /** Build student detail route */
  studentDetail: (id: string) => `/students/${id}`,
  studentEdit: (id: string) => `/students/${id}/edit`,
  studentHealthRecords: (id: string) => `/students/${id}/health-records`,
  studentMedications: (id: string) => `/students/${id}/medications`,
  studentAppointments: (id: string) => `/students/${id}/appointments`,
  studentImmunizations: (id: string) => `/students/${id}/immunizations`,
  studentIncidents: (id: string) => `/students/${id}/incidents`,
  studentDocuments: (id: string) => `/students/${id}/documents`,

  /** Build health record routes */
  healthRecordDetail: (id: string) => `/health-records/${id}`,
  healthRecordEdit: (id: string) => `/health-records/${id}/edit`,

  /** Build medication routes */
  medicationDetail: (id: string) => `/medications/${id}`,
  medicationEdit: (id: string) => `/medications/${id}/edit`,

  /** Build appointment routes */
  appointmentDetail: (id: string) => `/appointments/${id}`,
  appointmentEdit: (id: string) => `/appointments/${id}/edit`,

  /** Build immunization routes */
  immunizationDetail: (id: string) => `/immunizations/${id}`,
  immunizationEdit: (id: string) => `/immunizations/${id}/edit`,

  /** Build incident routes */
  incidentDetail: (id: string) => `/incidents/${id}`,
  incidentEdit: (id: string) => `/incidents/${id}/edit`,

  /** Build document routes */
  documentDetail: (id: string) => `/documents/${id}`,

  /** Build message routes */
  messageDetail: (id: string) => `/messages/${id}`,

  /** Build user routes */
  userDetail: (id: string) => `/users/${id}`,
  userEdit: (id: string) => `/users/${id}/edit`,
  userPermissions: (id: string) => `/users/${id}/permissions`,

  /** Build API routes */
  apiStudentById: (id: string) => `/students/${id}`,
  apiUserById: (id: string) => `/users/${id}`,
  apiHealthRecordById: (id: string) => `/health-records/${id}`,
  apiMedicationById: (id: string) => `/medications/${id}`,
  apiAppointmentById: (id: string) => `/appointments/${id}`,
} as const;

/**
 * Route metadata for access control and navigation
 *
 * Provides metadata about routes for authorization and UI generation.
 */
export interface RouteMetadata {
  path: string;
  title: string;
  requiresAuth: boolean;
  allowedRoles?: string[];
  permissions?: string[];
  category?: 'clinical' | 'operations' | 'communication' | 'admin' | 'system';
}

/**
 * Get all protected route paths
 *
 * Returns an array of all protected route paths for route guard validation.
 *
 * @returns Array of protected route paths
 */
export function getAllProtectedRoutes(): string[] {
  return Object.values(PROTECTED_ROUTES);
}

/**
 * Get all admin route paths
 *
 * Returns an array of all admin route paths for role-based access control.
 *
 * @returns Array of admin route paths
 */
export function getAllAdminRoutes(): string[] {
  return Object.values(ADMIN_ROUTES);
}

/**
 * Get all public route paths
 *
 * Returns an array of all public route paths.
 *
 * @returns Array of public route paths
 */
export function getAllPublicRoutes(): string[] {
  return Object.values(PUBLIC_ROUTES);
}

/**
 * Check if route is public
 *
 * @param path - Route path to check
 * @returns True if route is public
 */
export function isPublicRoute(path: string): boolean {
  return getAllPublicRoutes().includes(path);
}

/**
 * Check if route is protected
 *
 * @param path - Route path to check
 * @returns True if route requires authentication
 */
export function isProtectedRoute(path: string): boolean {
  return getAllProtectedRoutes().includes(path) || getAllAdminRoutes().includes(path);
}

/**
 * Check if route requires admin privileges
 *
 * @param path - Route path to check
 * @returns True if route requires admin role
 */
export function isAdminRoute(path: string): boolean {
  return getAllAdminRoutes().includes(path);
}

export default {
  PUBLIC_ROUTES,
  PROTECTED_ROUTES,
  ADMIN_ROUTES,
  API_ROUTES,
  EXTERNAL_ROUTES,
  RouteBuilders,
  getAllProtectedRoutes,
  getAllAdminRoutes,
  getAllPublicRoutes,
  isPublicRoute,
  isProtectedRoute,
  isAdminRoute,
};
