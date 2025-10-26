/**
 * @fileoverview API Endpoints Constants
 * @module constants/api
 *
 * Centralized API endpoint definitions for the White Cross platform.
 * All backend routes are defined here to prevent hardcoded strings and improve maintainability.
 *
 * Backend Base: /api/v1
 *
 * @see /backend/src/routes/v1/ for backend route definitions
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export const API_ENDPOINTS = {
  // ==========================================
  // AUTHENTICATION & AUTHORIZATION
  // ==========================================
  AUTH: {
    LOGIN: `/auth/login`,
    LOGOUT: `/auth/logout`,
    REFRESH: `/auth/refresh`,
    VERIFY: `/auth/verify`,
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
    BY_GRADE: (grade: string) => `/students/grade/${grade}`,
    BY_NURSE: (nurseId: string) => `/students/nurse/${nurseId}`,
    HEALTH_RECORDS: (id: string) => `/students/${id}/health-records`,
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
    BASE: `/incidents`,
    BY_ID: (id: string) => `/incidents/${id}`,
    WITNESSES: (incidentId: string) => `/incidents/${incidentId}/witnesses`,
    WITNESS_STATEMENT: (incidentId: string, witnessId: string) =>
      `/incidents/${incidentId}/witnesses/${witnessId}/statement`,
    VERIFY_STATEMENT: (statementId: string) => `/incidents/statements/${statementId}/verify`,
    FOLLOW_UP: (incidentId: string) => `/incidents/${incidentId}/follow-up`,
    FOLLOW_UP_PROGRESS: (followUpId: string) => `/incidents/follow-up/${followUpId}/progress`,
    FOLLOW_UP_COMPLETE: (followUpId: string) => `/incidents/follow-up/${followUpId}/complete`,
    ANALYTICS: `/incidents/analytics`,
    TRENDING: `/incidents/trending`,
    BY_STUDENT: (studentId: string) => `/students/${studentId}/incidents`,
    BY_TYPE: (type: string) => `/incidents/type/${type}`,
    BY_SEVERITY: (severity: string) => `/incidents/severity/${severity}`,
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
  // ANALYTICS & REPORTING
  // ==========================================
  ANALYTICS: {
    METRICS: `/analytics/metrics`,
    DASHBOARD: `/analytics/dashboard`,
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
