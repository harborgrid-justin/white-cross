/**
 * Centralized route paths for White Cross Healthcare Platform
 * All application routes are defined here for consistency
 */

// ===== PUBLIC ROUTES =====
export const PUBLIC_ROUTES = {
  LOGIN: '/login',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  VERIFY_EMAIL: '/verify-email',
} as const;

// ===== PROTECTED ROUTES =====
export const PROTECTED_ROUTES = {
  // Main dashboard
  DASHBOARD: '/dashboard',

  // Student management
  STUDENTS: '/students',
  STUDENTS_LIST: '/students',
  STUDENTS_DETAIL: '/students/:id',
  STUDENTS_CREATE: '/students/new',
  STUDENTS_EDIT: '/students/:id/edit',

  // Medications
  MEDICATIONS: '/medications',
  MEDICATIONS_LIST: '/medications',
  MEDICATIONS_DETAIL: '/medications/:id',
  MEDICATIONS_CREATE: '/medications/new',
  MEDICATIONS_EDIT: '/medications/:id/edit',
  MEDICATIONS_ADMINISTER: '/medications/:id/administer',
  MEDICATIONS_INVENTORY: '/medications/inventory',

  // Health Records
  HEALTH_RECORDS: '/health-records',
  HEALTH_RECORDS_LIST: '/health-records',
  HEALTH_RECORDS_DETAIL: '/health-records/:id',
  HEALTH_RECORDS_CREATE: '/health-records/new',
  HEALTH_RECORDS_STUDENT: '/health-records/student/:studentId',

  // Appointments
  APPOINTMENTS: '/appointments',
  APPOINTMENTS_LIST: '/appointments',
  APPOINTMENTS_DETAIL: '/appointments/:id',
  APPOINTMENTS_CREATE: '/appointments/new',
  APPOINTMENTS_EDIT: '/appointments/:id/edit',
  APPOINTMENTS_SCHEDULE: '/appointments/schedule',

  // Incident Reports
  INCIDENT_REPORTS: '/incident-reports',
  INCIDENT_REPORTS_LIST: '/incident-reports',
  INCIDENT_REPORTS_DETAIL: '/incident-reports/:id',
  INCIDENT_REPORTS_CREATE: '/incident-reports/new',
  INCIDENT_REPORTS_EDIT: '/incident-reports/:id/edit',
  INCIDENT_REPORTS_WITNESSES: '/incident-reports/:id/witnesses',
  INCIDENT_REPORTS_ACTIONS: '/incident-reports/:id/actions',
  INCIDENT_REPORTS_EVIDENCE: '/incident-reports/:id/evidence',
  INCIDENT_REPORTS_TIMELINE: '/incident-reports/:id/timeline',
  INCIDENT_REPORTS_EXPORT: '/incident-reports/:id/export',

  // Emergency Contacts
  EMERGENCY_CONTACTS: '/emergency-contacts',
  EMERGENCY_CONTACTS_LIST: '/emergency-contacts',
  EMERGENCY_CONTACTS_DETAIL: '/emergency-contacts/:id',
  EMERGENCY_CONTACTS_CREATE: '/emergency-contacts/new',
  EMERGENCY_CONTACTS_STUDENT: '/emergency-contacts/student/:studentId',

  // Communication
  COMMUNICATION: '/communication',
  COMMUNICATION_SEND: '/communication/send',
  COMMUNICATION_TEMPLATES: '/communication/templates',
  COMMUNICATION_HISTORY: '/communication/history',

  // Documents
  DOCUMENTS: '/documents',
  DOCUMENTS_LIST: '/documents',
  DOCUMENTS_DETAIL: '/documents/:id',
  DOCUMENTS_UPLOAD: '/documents/upload',
  DOCUMENTS_STUDENT: '/documents/student/:studentId',

  // Inventory
  INVENTORY: '/inventory',
  INVENTORY_ITEMS: '/inventory/items',
  INVENTORY_ALERTS: '/inventory/alerts',
  INVENTORY_TRANSACTIONS: '/inventory/transactions',
  INVENTORY_VENDORS: '/inventory/vendors',

  // Reports
  REPORTS: '/reports',
  REPORTS_GENERATE: '/reports/generate',
  REPORTS_SCHEDULED: '/reports/scheduled',
  REPORTS_VIEW: '/reports/:id',

  // Settings (Admin only)
  SETTINGS: '/settings',
  SETTINGS_OVERVIEW: '/settings/overview',
  SETTINGS_DISTRICTS: '/settings/districts',
  SETTINGS_SCHOOLS: '/settings/schools',
  SETTINGS_USERS: '/settings/users',
  SETTINGS_CONFIGURATION: '/settings/configuration',
  SETTINGS_INTEGRATIONS: '/settings/integrations',
  SETTINGS_BACKUPS: '/settings/backups',
  SETTINGS_MONITORING: '/settings/monitoring',
  SETTINGS_LICENSES: '/settings/licenses',
  SETTINGS_AUDIT: '/settings/audit',

  // Administration
  ADMIN: '/admin',
  ADMIN_PANEL: '/admin',
  ADMIN_USERS: '/admin/users',
  ADMIN_ROLES: '/admin/roles',
  ADMIN_PERMISSIONS: '/admin/permissions',
  ADMIN_AUDIT_LOGS: '/admin/audit-logs',
  ADMIN_SYSTEM_HEALTH: '/admin/system-health',

  // User Profile
  PROFILE: '/profile',
  PROFILE_EDIT: '/profile/edit',
  PROFILE_SETTINGS: '/profile/settings',
  PROFILE_SECURITY: '/profile/security',

  // Error pages
  ACCESS_DENIED: '/access-denied',
  NOT_FOUND: '/404',
  SERVER_ERROR: '/500',
} as const;

// ===== ROUTE HELPERS =====
/**
 * Build a route with parameters
 * @param route - Route template with :param placeholders
 * @param params - Object with parameter values
 * @returns Built route string
 */
export function buildRoute(route: string, params: Record<string, string | number>): string {
  let builtRoute = route;
  Object.entries(params).forEach(([key, value]) => {
    builtRoute = builtRoute.replace(`:${key}`, String(value));
  });
  return builtRoute;
}

/**
 * Build student detail route
 */
export const buildStudentRoute = (studentId: string | number) =>
  buildRoute(PROTECTED_ROUTES.STUDENTS_DETAIL, { id: studentId });

/**
 * Build student edit route
 */
export const buildStudentEditRoute = (studentId: string | number) =>
  buildRoute(PROTECTED_ROUTES.STUDENTS_EDIT, { id: studentId });

/**
 * Build medication detail route
 */
export const buildMedicationRoute = (medicationId: string | number) =>
  buildRoute(PROTECTED_ROUTES.MEDICATIONS_DETAIL, { id: medicationId });

/**
 * Build medication administer route
 */
export const buildMedicationAdministerRoute = (medicationId: string | number) =>
  buildRoute(PROTECTED_ROUTES.MEDICATIONS_ADMINISTER, { id: medicationId });

/**
 * Build health record detail route
 */
export const buildHealthRecordRoute = (recordId: string | number) =>
  buildRoute(PROTECTED_ROUTES.HEALTH_RECORDS_DETAIL, { id: recordId });

/**
 * Build health records for student route
 */
export const buildHealthRecordsStudentRoute = (studentId: string | number) =>
  buildRoute(PROTECTED_ROUTES.HEALTH_RECORDS_STUDENT, { studentId });

/**
 * Build appointment detail route
 */
export const buildAppointmentRoute = (appointmentId: string | number) =>
  buildRoute(PROTECTED_ROUTES.APPOINTMENTS_DETAIL, { id: appointmentId });

/**
 * Build incident report detail route
 */
export const buildIncidentReportRoute = (reportId: string | number) =>
  buildRoute(PROTECTED_ROUTES.INCIDENT_REPORTS_DETAIL, { id: reportId });

/**
 * Build incident report edit route
 */
export const buildIncidentReportEditRoute = (reportId: string | number) =>
  buildRoute(PROTECTED_ROUTES.INCIDENT_REPORTS_EDIT, { id: reportId });

/**
 * Build incident report witnesses route
 */
export const buildIncidentReportWitnessesRoute = (reportId: string | number) =>
  buildRoute(PROTECTED_ROUTES.INCIDENT_REPORTS_WITNESSES, { id: reportId });

/**
 * Build incident report actions route
 */
export const buildIncidentReportActionsRoute = (reportId: string | number) =>
  buildRoute(PROTECTED_ROUTES.INCIDENT_REPORTS_ACTIONS, { id: reportId });

/**
 * Build incident report evidence route
 */
export const buildIncidentReportEvidenceRoute = (reportId: string | number) =>
  buildRoute(PROTECTED_ROUTES.INCIDENT_REPORTS_EVIDENCE, { id: reportId });

/**
 * Build incident report timeline route
 */
export const buildIncidentReportTimelineRoute = (reportId: string | number) =>
  buildRoute(PROTECTED_ROUTES.INCIDENT_REPORTS_TIMELINE, { id: reportId });

/**
 * Build incident report export route
 */
export const buildIncidentReportExportRoute = (reportId: string | number) =>
  buildRoute(PROTECTED_ROUTES.INCIDENT_REPORTS_EXPORT, { id: reportId });

/**
 * Build emergency contacts for student route
 */
export const buildEmergencyContactsStudentRoute = (studentId: string | number) =>
  buildRoute(PROTECTED_ROUTES.EMERGENCY_CONTACTS_STUDENT, { studentId });

/**
 * Build document detail route
 */
export const buildDocumentRoute = (documentId: string | number) =>
  buildRoute(PROTECTED_ROUTES.DOCUMENTS_DETAIL, { id: documentId });

/**
 * Build documents for student route
 */
export const buildDocumentsStudentRoute = (studentId: string | number) =>
  buildRoute(PROTECTED_ROUTES.DOCUMENTS_STUDENT, { studentId });

// ===== ROUTE PERMISSIONS =====
export const ROUTE_PERMISSIONS = {
  [PROTECTED_ROUTES.DASHBOARD]: [],
  [PROTECTED_ROUTES.STUDENTS]: ['ADMIN', 'NURSE'],
  [PROTECTED_ROUTES.MEDICATIONS]: ['ADMIN', 'NURSE'],
  [PROTECTED_ROUTES.HEALTH_RECORDS]: ['ADMIN', 'NURSE', 'DOCTOR'],
  [PROTECTED_ROUTES.APPOINTMENTS]: ['ADMIN', 'NURSE'],
  [PROTECTED_ROUTES.INCIDENT_REPORTS]: ['ADMIN', 'NURSE'],
  [PROTECTED_ROUTES.EMERGENCY_CONTACTS]: ['ADMIN', 'NURSE'],
  [PROTECTED_ROUTES.COMMUNICATION]: ['ADMIN', 'NURSE', 'STAFF'],
  [PROTECTED_ROUTES.DOCUMENTS]: ['ADMIN', 'NURSE'],
  [PROTECTED_ROUTES.INVENTORY]: ['ADMIN', 'NURSE'],
  [PROTECTED_ROUTES.REPORTS]: ['ADMIN', 'NURSE'],
  [PROTECTED_ROUTES.SETTINGS]: ['ADMIN'],
  [PROTECTED_ROUTES.ADMIN]: ['ADMIN'],
} as const;

// ===== NAVIGATION ITEMS =====
export const NAVIGATION_ITEMS = [
  {
    name: 'Dashboard',
    path: PROTECTED_ROUTES.DASHBOARD,
    icon: 'Home',
    roles: ['ADMIN', 'NURSE', 'STAFF', 'DOCTOR', 'COUNSELOR'],
  },
  {
    name: 'Students',
    path: PROTECTED_ROUTES.STUDENTS,
    icon: 'Users',
    roles: ['ADMIN', 'NURSE'],
  },
  {
    name: 'Medications',
    path: PROTECTED_ROUTES.MEDICATIONS,
    icon: 'Pill',
    roles: ['ADMIN', 'NURSE'],
  },
  {
    name: 'Appointments',
    path: PROTECTED_ROUTES.APPOINTMENTS,
    icon: 'Calendar',
    roles: ['ADMIN', 'NURSE'],
  },
  {
    name: 'Health Records',
    path: PROTECTED_ROUTES.HEALTH_RECORDS,
    icon: 'FileText',
    roles: ['ADMIN', 'NURSE', 'DOCTOR'],
  },
  {
    name: 'Incident Reports',
    path: PROTECTED_ROUTES.INCIDENT_REPORTS,
    icon: 'AlertTriangle',
    roles: ['ADMIN', 'NURSE'],
  },
  {
    name: 'Emergency Contacts',
    path: PROTECTED_ROUTES.EMERGENCY_CONTACTS,
    icon: 'Phone',
    roles: ['ADMIN', 'NURSE'],
  },
  {
    name: 'Communication',
    path: PROTECTED_ROUTES.COMMUNICATION,
    icon: 'MessageSquare',
    roles: ['ADMIN', 'NURSE', 'STAFF'],
  },
  {
    name: 'Inventory',
    path: PROTECTED_ROUTES.INVENTORY,
    icon: 'Package',
    roles: ['ADMIN', 'NURSE'],
  },
  {
    name: 'Reports',
    path: PROTECTED_ROUTES.REPORTS,
    icon: 'BarChart3',
    roles: ['ADMIN', 'NURSE'],
  },
  {
    name: 'Administration',
    path: PROTECTED_ROUTES.ADMIN,
    icon: 'Settings',
    roles: ['ADMIN'],
  },
] as const;

// Export all routes
export const ROUTES = {
  PUBLIC: PUBLIC_ROUTES,
  PROTECTED: PROTECTED_ROUTES,
  PERMISSIONS: ROUTE_PERMISSIONS,
  NAVIGATION: NAVIGATION_ITEMS,
} as const;

export default ROUTES;
