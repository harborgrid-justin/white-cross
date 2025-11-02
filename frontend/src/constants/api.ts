/**
 * @fileoverview API Endpoints Constants
 * @module constants/api
 *
 * Centralized API endpoint definitions for the White Cross platform.
 * All backend routes are defined here to prevent hardcoded strings and improve maintainability.
 *
 * Backend Base: Direct routes (no /api/v1 prefix)
 *
 * @see /backend/src/routes/ for backend route definitions
 */


export const API_ENDPOINTS = {
  // ==========================================
  // AUTHENTICATION & AUTHORIZATION
  // ==========================================
  AUTH: {
    LOGIN: `/auth/login`,
    LOGOUT: `/auth/logout`,
    REFRESH: `/auth/refresh`,
    VERIFY: `/auth/verify`,
    REGISTER: `/auth/register`,
    PROFILE: `/auth/me`,
    CHANGE_PASSWORD: `/auth/change-password`,
    FORGOT_PASSWORD: `/auth/forgot-password`,
    RESET_PASSWORD: `/auth/reset-password`,
  },

  // ==========================================
  // USERS & ACCESS CONTROL
  // ==========================================
  USERS: {
    BASE: `/users`,
    BY_ID: (id: string) => `/users/${id}`,
    ME: `/users/me`,
    PROFILE: `/users/profile`,
    UPDATE_PROFILE: `/users/profile`,
  },

  RBAC: {
    ROLES: `/access-control/roles`,
    PERMISSIONS: `/access-control/permissions`,
    USER_ROLES: (userId: string) => `/access-control/users/${userId}/roles`,
    USER_PERMISSIONS: (userId: string) => `/access-control/users/${userId}/permissions`,
  },

  // ==========================================
  // STUDENTS
  // ==========================================
  STUDENTS: {
    BASE: `/students`,
    BY_ID: (id: string) => `/students/${id}`,
    DEACTIVATE: (id: string) => `/students/${id}/deactivate`,
    REACTIVATE: (id: string) => `/students/${id}/reactivate`,
    TRANSFER: (id: string) => `/students/${id}/transfer`,
    ASSIGN: (id: string) => `/students/${id}/assign`,
    ASSIGN_BULK: `/students/assign-bulk`,
    PHOTO: (id: string) => `/students/${id}/photo`,
    EXPORT: (id: string) => `/students/${id}/export`,
    REPORT_CARD: (id: string) => `/students/${id}/report-card`,
    VERIFY_ELIGIBILITY: (id: string) => `/students/${id}/verify-eligibility`,
    SEARCH: `/students/search`,
    SEARCH_BY_QUERY: (query: string) => `/students/search/${encodeURIComponent(query)}`,
    BY_GRADE: (grade: string) => `/students/grade/${grade}`,
    BY_NURSE: (nurseId: string) => `/students/nurse/${nurseId}`,
    ASSIGNED: `/students/assigned`,
    STATISTICS: (id: string) => `/students/${id}/statistics`,
    BULK_UPDATE: `/students/bulk-update`,
    PERMANENT_DELETE: (id: string) => `/students/${id}/permanent`,
    GRADES: `/students/grades`,
    HEALTH_RECORDS: (id: string) => `/students/${id}/health-records`,
    MENTAL_HEALTH_RECORDS: (id: string) => `/students/${id}/mental-health-records`,
    MEDICATIONS: (id: string) => `/students/${id}/medications`,
    IMMUNIZATIONS: (id: string) => `/students/${id}/immunizations`,
    ALLERGIES: (id: string) => `/students/${id}/allergies`,
    APPOINTMENTS: (id: string) => `/students/${id}/appointments`,
    INCIDENTS: (id: string) => `/students/${id}/incidents`,
    EMERGENCY_CONTACTS: (id: string) => `/students/${id}/emergency-contacts`,
  },

  // ==========================================
  // APPOINTMENTS
  // ==========================================
  APPOINTMENTS: {
    BASE: `/appointments`,
    BY_ID: (id: string) => `/appointments/${id}`,
    RESCHEDULE: (id: string) => `/appointments/${id}/reschedule`,
    CANCEL: (id: string) => `/appointments/${id}/cancel`,
    COMPLETE: (id: string) => `/appointments/${id}/complete`,
    NO_SHOW: (id: string) => `/appointments/${id}/no-show`,
    CONFIRM: (id: string) => `/appointments/${id}/confirm`,
    SEND_REMINDER: (id: string) => `/appointments/${id}/send-reminder`,
    AVAILABILITY: `/appointments/availability`,
    CONFLICTS: `/appointments/conflicts`,
    REMINDERS: `/appointments/reminders`,
    BY_STUDENT: (studentId: string) => `/appointments/student/${studentId}`,
    BY_DATE: `/appointments/by-date`,
    UPCOMING: `/appointments/upcoming`,
    REPORTS: `/appointments/reports`,
  },

  // ==========================================
  // HEALTH RECORDS
  // ==========================================
  HEALTH_RECORDS: {
    BASE: `/health-records`,
    BY_ID: (id: string) => `/health-records/${id}`,
    BY_STUDENT: (studentId: string) => `/students/${studentId}/health-records`,
    BY_TYPE: (type: string) => `/health-records/type/${type}`,
    SEARCH: `/health-records/search`,
    EXPORT: (id: string) => `/health-records/${id}/export`,
  },

  // ==========================================
  // IMMUNIZATIONS / VACCINATIONS
  // ==========================================
  IMMUNIZATIONS: {
    BASE: `/vaccinations`,
    BY_ID: (id: string) => `/vaccinations/${id}`,
    SCHEDULE: `/vaccinations/schedule`,
    BY_STUDENT: (studentId: string) => `/students/${studentId}/immunizations`,
    DUE: `/vaccinations/due`,
    OVERDUE: `/vaccinations/overdue`,
    COMPLIANCE: `/vaccinations/compliance`,
    EXEMPTIONS: `/vaccinations/exemptions`,
  },

  // ==========================================
  // ALLERGIES
  // ==========================================
  ALLERGIES: {
    BASE: `/allergies`,
    BY_ID: (id: string) => `/allergies/${id}`,
    BY_STUDENT: (studentId: string) => `/students/${studentId}/allergies`,
    CRITICAL: `/allergies/critical`,
    ACTIVE: `/allergies/active`,
  },

  // ==========================================
  // VITAL SIGNS
  // ==========================================
  VITAL_SIGNS: {
    BASE: `/vital-signs`,
    BY_ID: (id: string) => `/vital-signs/${id}`,
    BY_STUDENT: (studentId: string) => `/students/${studentId}/vital-signs`,
    BY_HEALTH_RECORD: (healthRecordId: string) => `/health-records/${healthRecordId}/vital-signs`,
    LATEST: (studentId: string) => `/students/${studentId}/vital-signs/latest`,
    TRENDS: (studentId: string) => `/students/${studentId}/vital-signs/trends`,
  },

  // ==========================================
  // CHRONIC CONDITIONS
  // ==========================================
  CHRONIC_CONDITIONS: {
    BASE: `/chronic-conditions`,
    BY_ID: (id: string) => `/chronic-conditions/${id}`,
    BY_STUDENT: (studentId: string) => `/students/${studentId}/chronic-conditions`,
    ACTIVE: `/chronic-conditions/active`,
    REVIEW_DUE: `/chronic-conditions/review-due`,
  },

  // ==========================================
  // MEDICATIONS
  // ==========================================
  MEDICATIONS: {
    BASE: `/medications`,
    BY_ID: (id: string) => `/medications/${id}`,
    DETAIL: (id: string) => `/medications/${id}`,
    ADMINISTER: (id: string) => `/medications/${id}/administer`,
    DISCONTINUE: (id: string) => `/medications/${id}/discontinue`,
    REFILL: (id: string) => `/medications/${id}/refill`,
    MISSED_DOSE: (id: string) => `/medications/${id}/missed-dose`,
    ADVERSE_REACTION: (id: string) => `/medications/${id}/adverse-reaction`,
    ADJUST_INVENTORY: (id: string) => `/medications/${id}/adjust-inventory`,
    REMINDER: (id: string) => `/medications/${id}/reminder`,
    SCHEDULE: (id: string) => `/medications/${id}/schedule`,
    INTERACTIONS: (id: string) => `/medications/${id}/interactions`,
    CALENDAR: `/medications/calendar`,
    DUE: `/medications/due`,
    OVERDUE: `/medications/overdue`,
    MISSED: `/medications/missed`,
    COMPLETED: `/medications/completed`,
    AS_NEEDED: `/medications/as-needed`,
    EMERGENCY: `/medications/emergency`,
    CONTROLLED: `/medications/controlled-substances`,
    OTC: `/medications/over-the-counter`,
    CATEGORIES: `/medications/categories`,
    RULES: `/medications/administration-rules`,
    CHECK_INTERACTIONS: `/medications/check-interactions`,
    FORMULARY: `/medications/formulary`,
    BY_STUDENT: (studentId: string) => `/students/${studentId}/medications`,
  },

  // ==========================================
  // PRESCRIPTIONS
  // ==========================================
  PRESCRIPTIONS: {
    BASE: `/prescriptions`,
    BY_ID: (id: string) => `/prescriptions/${id}`,
    DETAIL: (id: string) => `/prescriptions/${id}`,
    REFILL: (id: string) => `/prescriptions/${id}/refill`,
    ACTIVE: `/prescriptions/active`,
    EXPIRING: `/prescriptions/expiring`,
  },

  // ==========================================
  // INVENTORY
  // ==========================================
  INVENTORY: {
    BASE: `/inventory`,
    BY_ID: (id: string) => `/inventory/${id}`,
    DETAIL: (id: string) => `/inventory/${id}`,
    ADJUST: (id: string) => `/inventory/${id}/adjust`,
    LOW_STOCK: `/inventory/low-stock`,
    EXPIRING: `/inventory/expiring`,
    REORDER: `/inventory/reorder`,
    AUDIT: `/inventory/audit`,
    ITEMS: `/inventory/items`,
    ALERTS: `/inventory/alerts`,
    ANALYTICS: `/inventory/analytics`,
    DASHBOARD: `/inventory/dashboard`,
    REPORTS: `/inventory/reports`,
  },

  // ==========================================
  // ADMINISTRATION LOG
  // ==========================================
  ADMINISTRATION_LOG: {
    BASE: `/administration-log`,
    BY_ID: (id: string) => `/administration-log/${id}`,
    DETAIL: (id: string) => `/administration-log/${id}`,
    BY_MEDICATION: (medicationId: string) => `/medications/${medicationId}/administration-log`,
    BY_STUDENT: (studentId: string) => `/students/${studentId}/administration-log`,
    TODAY: `/administration-log/today`,
    MISSED: `/administration-log/missed`,
  },

  // ==========================================
  // EMERGENCY CONTACTS
  // ==========================================
  EMERGENCY_CONTACTS: {
    BASE: `/emergency-contacts`,
    BY_ID: (id: string) => `/emergency-contacts/${id}`,
    BY_STUDENT: (studentId: string) => `/students/${studentId}/emergency-contacts`,
    PRIMARY: (studentId: string) => `/students/${studentId}/emergency-contacts/primary`,
    VERIFY: (id: string) => `/emergency-contacts/${id}/verify`,
    NOTIFY: (id: string) => `/emergency-contacts/${id}/notify`,
  },

  // ==========================================
  // INCIDENTS
  // ==========================================
  INCIDENTS: {
    BASE: `/incident-report`,
    BY_ID: (id: string) => `/incident-report/${id}`,
    WITNESSES: (incidentId: string) => `/incident-report/${incidentId}/witnesses`,
    WITNESS_STATEMENT: (incidentId: string, witnessId: string) =>
      `/incident-report/${incidentId}/witnesses/${witnessId}/statement`,
    VERIFY_STATEMENT: (statementId: string) => `/incident-report/statements/${statementId}/verify`,
    FOLLOW_UP: (incidentId: string) => `/incident-report/${incidentId}/follow-up`,
    FOLLOW_UP_PROGRESS: (followUpId: string) => `/incident-report/follow-up/${followUpId}/progress`,
    FOLLOW_UP_COMPLETE: (followUpId: string) => `/incident-report/follow-up/${followUpId}/complete`,
    ANALYTICS: `/incident-report/analytics`,
    TRENDING: `/incident-report/trending`,
    BY_STUDENT: (studentId: string) => `/students/${studentId}/incidents`,
    BY_TYPE: (type: string) => `/incident-report/type/${type}`,
    BY_SEVERITY: (severity: string) => `/incident-report/severity/${severity}`,
  },

  // ==========================================
  // DOCUMENTS
  // ==========================================
  DOCUMENTS: {
    BASE: `/documents`,
    BY_ID: (id: string) => `/documents/${id}`,
    UPLOAD: `/documents/upload`,
    DOWNLOAD: (id: string) => `/documents/${id}/download`,
    PREVIEW: (id: string) => `/documents/${id}/preview`,
    SIGN: (id: string) => `/documents/${id}/sign`,
    VERIFY_SIGNATURE: (id: string) => `/documents/${id}/verify-signature`,
    BY_STUDENT: (studentId: string) => `/students/${studentId}/documents`,
    BY_TYPE: (type: string) => `/documents/type/${type}`,
    TEMPLATES: `/documents/templates`,
  },

  // ==========================================
  // COMPLIANCE & AUDIT
  // ==========================================
  COMPLIANCE: {
    REPORTS: `/compliance/reports`,
    AUDIT_LOGS: `/compliance/audit-logs`,
    PHI_DISCLOSURES: `/compliance/phi-disclosures`,
    ACCESS_LOG: `/compliance/access-log`,
    DATA_RETENTION: `/compliance/data-retention`,
    EXPORT: `/compliance/export`,
  },

  AUDIT: {
    LOGS: `/audit-logs`,
    BY_ID: (id: string) => `/audit-logs/${id}`,
    BY_USER: (userId: string) => `/audit-logs/user/${userId}`,
    BY_RESOURCE: (resourceType: string, resourceId: string) =>
      `/audit-logs/resource/${resourceType}/${resourceId}`,
    BY_ACTION: (action: string) => `/audit-logs/action/${action}`,
    PHI_ACCESS: `/audit-logs/phi-access`,
    PHI_ACCESS_LOG: `/audit/phi-access`,
    EXPORT: `/audit-logs/export`,
  },

  // ==========================================
  // COMMUNICATIONS
  // ==========================================
  MESSAGES: {
    BASE: `/messages`,
    BY_ID: (id: string) => `/messages/${id}`,
    SEND: `/messages/send`,
    INBOX: `/messages/inbox`,
    SENT: `/messages/sent`,
    UNREAD: `/messages/unread`,
    MARK_READ: (id: string) => `/messages/${id}/mark-read`,
  },

  BROADCASTS: {
    BASE: `/broadcasts`,
    BY_ID: (id: string) => `/broadcasts/${id}`,
    SEND: `/broadcasts/send`,
    SCHEDULE: `/broadcasts/schedule`,
    RECIPIENTS: (id: string) => `/broadcasts/${id}/recipients`,
  },

  ALERTS: {
    BASE: `/alerts`,
    BY_ID: (id: string) => `/alerts/${id}`,
    ACTIVE: `/alerts/active`,
    ACKNOWLEDGE: (id: string) => `/alerts/${id}/acknowledge`,
    DISMISS: (id: string) => `/alerts/${id}/dismiss`,
    MEDICATION_REMINDERS: `/alerts/medication-reminders`,
    APPOINTMENT_REMINDERS: `/alerts/appointment-reminders`,
  },

  // ==========================================
  // DASHBOARD
  // ==========================================
  DASHBOARD: {
    STATS: `/dashboard/stats`,
    RECENT_ACTIVITIES: `/dashboard/recent-activities`,
    UPCOMING_APPOINTMENTS: `/dashboard/upcoming-appointments`,
    CHART_DATA: `/dashboard/chart-data`,
    WIDGETS: (dashboardId: string) => `/dashboard/${dashboardId}/widgets`,
    REFRESH: `/dashboard/refresh-cache`,
  },

  // ==========================================
  // ANALYTICS & REPORTING
  // ==========================================
  ANALYTICS: {
    METRICS: `/analytics/metrics`,
    DASHBOARD: `/analytics/dashboard`,
    DASHBOARD_WIDGETS: (dashboardId: string) => `/analytics/dashboard/${dashboardId}/widgets`,
    REPORTS: `/analytics/reports`,
    CHART_DATA: `/analytics/chart-data`,
    HEALTH_METRICS: `/analytics/health-metrics`,
    MEDICATION_COMPLIANCE: `/analytics/medication-compliance`,
    APPOINTMENT_METRICS: `/analytics/appointment-metrics`,
    INCIDENT_ANALYTICS: `/analytics/incident-analytics`,
    CUSTOM_REPORT: `/analytics/custom-report`,
  },

  REPORTS: {
    MEDICATIONS: {
      ADMINISTRATION: `/reports/medications/administration`,
      COMPLIANCE: `/reports/medications/compliance`,
      EXPIRATION: `/reports/medications/expiration`,
      INVENTORY: `/reports/medications/inventory`,
      REFILLS: `/reports/medications/refills`,
    },
    IMMUNIZATIONS: {
      COMPLIANCE: `/reports/immunizations/compliance`,
      DUE: `/reports/immunizations/due`,
      OVERDUE: `/reports/immunizations/overdue`,
      EXEMPTIONS: `/reports/immunizations/exemptions`,
    },
    APPOINTMENTS: {
      ATTENDANCE: `/reports/appointments/attendance`,
      NO_SHOWS: `/reports/appointments/no-shows`,
      CANCELLATIONS: `/reports/appointments/cancellations`,
    },
    INCIDENTS: {
      SUMMARY: `/reports/incidents/summary`,
      BY_TYPE: `/reports/incidents/by-type`,
      TRENDS: `/reports/incidents/trends`,
    },
    STUDENTS: {
      ENROLLMENT: `/reports/students/enrollment`,
      HEALTH_SUMMARY: `/reports/students/health-summary`,
      DEMOGRAPHICS: `/reports/students/demographics`,
    },
  },

  // ==========================================
  // SYSTEM & ADMINISTRATION
  // ==========================================
  SYSTEM: {
    HEALTH: `/health`,
    STATUS: `/system/status`,
    CONFIGURATION: `/system/configuration`,
    SETTINGS: `/system/settings`,
    BACKUP: `/system/backup`,
    RESTORE: `/system/restore`,
  },

  // ==========================================
  // ADMIN - District, School, User Management
  // ==========================================
  ADMIN: {
    // System Settings
    SETTINGS: `/admin/settings`,

    // Users
    USERS: `/admin/users`,
    USER_BY_ID: (id: string) => `/admin/users/${id}`,

    // Districts
    DISTRICTS: `/admin/districts`,
    DISTRICT_BY_ID: (id: string) => `/admin/districts/${id}`,

    // Schools
    SCHOOLS: `/admin/schools`,
    SCHOOL_BY_ID: (id: string) => `/admin/schools/${id}`,

    // System Health
    SYSTEM_HEALTH: `/admin/system/health`,

    // Backups
    BACKUPS: `/admin/backups`,
    BACKUP_BY_ID: (id: string) => `/admin/backups/${id}`,

    // Licenses
    LICENSES: `/admin/licenses`,
    LICENSE_BY_ID: (id: string) => `/admin/licenses/${id}`,
    LICENSE_DEACTIVATE: (id: string) => `/admin/licenses/${id}/deactivate`,

    // Configurations
    CONFIGURATIONS: `/admin/configurations`,
    CONFIGURATION_BY_KEY: (key: string) => `/admin/configurations/${key}`,

    // Performance Metrics
    METRICS: `/admin/metrics`,
    METRIC_BY_ID: (id: string) => `/admin/metrics/${id}`,

    // Training
    TRAINING: `/admin/training`,
    TRAINING_BY_ID: (id: string) => `/admin/training/${id}`,
    TRAINING_COMPLETE: (id: string) => `/admin/training/${id}/complete`,
    TRAINING_PROGRESS: (userId: string) => `/admin/training/progress/${userId}`,

    // Audit Logs
    AUDIT_LOGS: `/admin/audit-logs`,
    AUDIT_LOG_BY_ID: (id: string) => `/admin/audit-logs/${id}`,
  },

  INTEGRATIONS: {
    BASE: `/integrations`,
    BY_ID: (id: string) => `/integrations/${id}`,
    CONFIGURE: (id: string) => `/integrations/${id}/configure`,
    TEST: (id: string) => `/integrations/${id}/test`,
    SYNC: (id: string) => `/integrations/${id}/sync`,
  },

  // ==========================================
  // FORMS
  // ==========================================
  FORMS: {
    BASE: `/forms`,
    BY_ID: (id: string) => `/forms/${id}`,
    TEMPLATES: `/forms/templates`,
    SUBMIT: `/forms/submit`,
    RESPONSES: (formId: string) => `/forms/${formId}/responses`,
  },

  // ==========================================
  // BILLING & FINANCIAL MANAGEMENT
  // ==========================================
  BILLING: {
    // Invoices
    INVOICES: `/billing/invoices`,
    INVOICE_BY_ID: (id: string) => `/billing/invoices/${id}`,
    INVOICE_PDF: (id: string) => `/billing/invoices/${id}/pdf`,
    INVOICE_SEND: (id: string) => `/billing/invoices/${id}/send`,
    INVOICE_VOID: (id: string) => `/billing/invoices/${id}/void`,
    
    // Payments
    PAYMENTS: `/billing/payments`,
    PAYMENT_BY_ID: (id: string) => `/billing/payments/${id}`,
    PAYMENT_REFUND: (id: string) => `/billing/payments/${id}/refund`,
    PAYMENT_VOID: (id: string) => `/billing/payments/${id}/void`,
    
    // Analytics
    ANALYTICS: `/billing/analytics`,
    REVENUE_TRENDS: `/billing/analytics/revenue-trends`,
    PAYMENT_ANALYTICS: `/billing/analytics/payments`,
    COLLECTION_METRICS: `/billing/analytics/collections`,
    
    // Reports
    REPORTS: `/billing/reports`,
    AGING_REPORT: `/billing/reports/aging`,
    REVENUE_REPORT: `/billing/reports/revenue`,
    PAYMENT_REPORT: `/billing/reports/payments`,
    TAX_REPORT: `/billing/reports/tax`,
    
    // Settings
    SETTINGS: `/billing/settings`,
    
    // Notifications
    NOTIFICATIONS: `/billing/notifications`,
    SEND_REMINDER: `/billing/notifications/reminder`,
    SEND_STATEMENT: `/billing/notifications/statement`,
  },

  // ==========================================
  // BUDGET MANAGEMENT
  // ==========================================
  BUDGET: {
    // Budget Categories
    CATEGORIES: `/budget/categories`,
    CATEGORY_BY_ID: (id: string) => `/budget/categories/${id}`,

    // Budget Summary
    SUMMARY: `/budget/summary`,

    // Budget Transactions
    TRANSACTIONS: `/budget/transactions`,
    TRANSACTION_BY_ID: (id: string) => `/budget/transactions/${id}`,

    // Analytics & Reporting
    TRENDS: `/budget/trends`,
    YEAR_COMPARISON: `/budget/year-comparison`,
    OVER_BUDGET: `/budget/over-budget`,
    RECOMMENDATIONS: `/budget/recommendations`,
    EXPORT: `/budget/export`,
  },

  // ==========================================
  // VENDORS
  // ==========================================
  VENDORS: {
    BASE: `/vendors`,
    BY_ID: (id: string) => `/vendors/${id}`,
    SEARCH: (query: string) => `/vendors/search/${encodeURIComponent(query)}`,
    COMPARE: (itemName: string) => `/vendors/compare/${encodeURIComponent(itemName)}`,
    TOP: `/vendors/top`,
    STATISTICS: `/vendors/statistics`,
    REACTIVATE: (id: string) => `/vendors/${id}/reactivate`,
    RATING: (id: string) => `/vendors/${id}/rating`,
    BULK_RATINGS: `/vendors/ratings/bulk`,
    BY_PAYMENT_TERMS: (terms: string) => `/vendors/payment-terms/${encodeURIComponent(terms)}`,
    METRICS: (id: string) => `/vendors/${id}/metrics`,
    PERMANENT_DELETE: (id: string) => `/vendors/${id}/permanent`,
  },

  // ==========================================
  // SETTINGS
  // ==========================================
  SETTINGS: {
    USER: `/settings/user`,
    SCHOOL: `/settings/school`,
    NOTIFICATIONS: `/settings/notifications`,
    PREFERENCES: `/settings/preferences`,
    PRIVACY: `/settings/privacy`,
    SECURITY: `/settings/security`,
  },
} as const;

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

export default API_ENDPOINTS;
