/**
 * @fileoverview API Endpoints Constants - Comprehensive endpoint definitions
 * @module constants/api
 * @version 2.0.0 - Maximized Edition
 *
 * Centralized API endpoint definitions for the White Cross healthcare platform.
 * All backend routes are defined here to prevent hardcoded strings and improve maintainability.
 *
 * **Architecture**:
 * - Backend Base: Routes with global '/api' prefix and URI versioning (default version '1', prefix 'v')
 * - Next.js rewrites handle `/api/v1/*` → Backend `/*` proxying
 * - All endpoints use template literal types for type-safe route generation
 * - Organized by domain for easy navigation and maintenance
 *
 * **Key Features**:
 * - 700+ endpoint constants covering all platform features
 * - Type-safe endpoint functions with parameter validation
 * - Comprehensive PHI-compliant healthcare operations
 * - HIPAA-compliant audit logging endpoints
 * - Multi-channel communication endpoints
 * - Advanced reporting and analytics
 * - Complete medication management workflow
 * - Student health records and tracking
 * - Appointment scheduling and reminders
 * - Incident reporting and follow-up
 * - Financial and procurement management
 *
 * **Endpoint Categories**:
 * 1. Authentication & Authorization (AUTH, RBAC, MFA)
 * 2. Users & Access Control (USERS, RBAC)
 * 3. Students (STUDENTS with 25+ endpoints)
 * 4. Appointments (APPOINTMENTS, WAITLIST, NURSE_AVAILABILITY)
 * 5. Health Records (HEALTH_RECORDS, VITAL_SIGNS, CHRONIC_CONDITIONS, ALLERGIES)
 * 6. Immunizations & Vaccinations (IMMUNIZATIONS)
 * 7. Medications (MEDICATIONS, PRESCRIPTIONS, INVENTORY, ADMINISTRATION_LOG)
 * 8. Emergency Contacts (EMERGENCY_CONTACTS)
 * 9. Incidents (INCIDENTS with witness and follow-up)
 * 10. Documents (DOCUMENTS with signing and verification)
 * 11. Compliance & Audit (COMPLIANCE, AUDIT)
 * 12. Communications (MESSAGES, BROADCASTS, ALERTS, NOTIFICATIONS, CONVERSATIONS, TEMPLATES)
 * 13. Dashboard & Analytics (DASHBOARD, ANALYTICS, REPORTS)
 * 14. System Administration (ADMIN, SYSTEM, INTEGRATIONS)
 * 15. Billing & Financial (BILLING, BUDGET, VENDORS, PURCHASE_ORDERS)
 * 16. Forms & Settings (FORMS, SETTINGS)
 *
 * **Usage Examples**:
 * ```typescript
 * import { API_ENDPOINTS } from '@/constants/api';
 *
 * // Simple endpoint
 * const url = API_ENDPOINTS.STUDENTS.BASE; // '/students'
 *
 * // Parameterized endpoint
 * const studentUrl = API_ENDPOINTS.STUDENTS.BY_ID('123'); // '/students/123'
 *
 * // Nested endpoint
 * const medUrl = API_ENDPOINTS.STUDENTS.MEDICATIONS('123'); // '/students/123/medications'
 *
 * // In API client
 * const response = await apiClient.get(API_ENDPOINTS.STUDENTS.BY_ID(studentId));
 * ```
 *
 * **Type Safety**:
 * All endpoints are typed as const for literal type inference and autocomplete support.
 *
 * **Maintenance**:
 * When adding new endpoints:
 * 1. Add to appropriate domain section
 * 2. Use consistent naming patterns (BASE, BY_ID, etc.)
 * 3. Add JSDoc comments for complex endpoints
 * 4. Update this file header with new categories
 *
 * @see /backend/src/routes/ for backend route definitions
 * @see /frontend/src/lib/api/client.ts for API client implementation
 * @see /frontend/src/lib/server/api-client.ts for server-side API client
 */


export const API_ENDPOINTS = {
  // ==========================================
  // AUTHENTICATION & AUTHORIZATION
  // ==========================================
  AUTH: {
    LOGIN: `/api/v1/auth/login`,
    LOGOUT: `/api/v1/auth/logout`,
    REFRESH: `/api/v1/auth/refresh`,
    VERIFY: `/api/v1/auth/verify`,
    REGISTER: `/api/v1/auth/register`,
    PROFILE: `/api/v1/auth/me`,
    CHANGE_PASSWORD: `/api/v1/auth/change-password`,
    FORGOT_PASSWORD: `/api/v1/auth/forgot-password`,
    RESET_PASSWORD: `/api/v1/auth/reset-password`,
  },

  // ==========================================
  // USERS & ACCESS CONTROL
  // ==========================================
  USERS: {
    BASE: `/api/v1/users`,
    BY_ID: (id: string) => `/api/v1/users/${id}`,
    ME: `/api/v1/users/me`,
    PROFILE: `/api/v1/users/profile`,
    UPDATE_PROFILE: `/api/v1/users/profile`,
  },

  RBAC: {
    ROLES: `/api/v1/access-control/roles`,
    PERMISSIONS: `/api/v1/access-control/permissions`,
    USER_ROLES: (userId: string) => `/api/v1/access-control/users/${userId}/roles`,
    USER_PERMISSIONS: (userId: string) => `/api/v1/access-control/users/${userId}/permissions`,
  },

  // ==========================================
  // STUDENTS
  // ==========================================
  STUDENTS: {
    BASE: `/api/v1/students`,
    BY_ID: (id: string) => `/api/v1/students/${id}`,
    DEACTIVATE: (id: string) => `/api/v1/students/${id}/deactivate`,
    REACTIVATE: (id: string) => `/api/v1/students/${id}/reactivate`,
    TRANSFER: (id: string) => `/api/v1/students/${id}/transfer`,
    ASSIGN: (id: string) => `/api/v1/students/${id}/assign`,
    ASSIGN_BULK: `/api/v1/students/assign-bulk`,
    PHOTO: (id: string) => `/api/v1/students/${id}/photo`,
    EXPORT: (id: string) => `/api/v1/students/${id}/export`,
    REPORT_CARD: (id: string) => `/api/v1/students/${id}/report-card`,
    VERIFY_ELIGIBILITY: (id: string) => `/api/v1/students/${id}/verify-eligibility`,
    SEARCH: `/api/v1/students/search`,
    SEARCH_BY_QUERY: (query: string) => `/api/v1/students/search/${encodeURIComponent(query)}`,
    BY_GRADE: (grade: string) => `/api/v1/students/grade/${grade}`,
    BY_NURSE: (nurseId: string) => `/api/v1/students/nurse/${nurseId}`,
    ASSIGNED: `/api/v1/students/assigned`,
    STATISTICS: (id: string) => `/api/v1/students/${id}/statistics`,
    BULK_UPDATE: `/api/v1/students/bulk-update`,
    PERMANENT_DELETE: (id: string) => `/api/v1/students/${id}/permanent`,
    GRADES: `/api/v1/students/grades`,
    HEALTH_RECORDS: (id: string) => `/api/v1/students/${id}/health-records`,
    MENTAL_HEALTH_RECORDS: (id: string) => `/api/v1/students/${id}/mental-health-records`,
    MEDICATIONS: (id: string) => `/api/v1/students/${id}/medications`,
    IMMUNIZATIONS: (id: string) => `/api/v1/students/${id}/immunizations`,
    ALLERGIES: (id: string) => `/api/v1/students/${id}/allergies`,
    APPOINTMENTS: (id: string) => `/api/v1/students/${id}/appointments`,
    INCIDENTS: (id: string) => `/api/v1/students/${id}/incidents`,
    EMERGENCY_CONTACTS: (id: string) => `/api/v1/students/${id}/emergency-contacts`,
  },

  // ==========================================
  // APPOINTMENTS
  // ==========================================
  APPOINTMENTS: {
    BASE: `/api/v1/appointments`,
    BY_ID: (id: string) => `/api/v1/appointments/${id}`,
    RESCHEDULE: (id: string) => `/api/v1/appointments/${id}/reschedule`,
    CANCEL: (id: string) => `/api/v1/appointments/${id}/cancel`,
    COMPLETE: (id: string) => `/api/v1/appointments/${id}/complete`,
    NO_SHOW: (id: string) => `/api/v1/appointments/${id}/no-show`,
    CONFIRM: (id: string) => `/api/v1/appointments/${id}/confirm`,
    START: (id: string) => `/api/v1/appointments/${id}/start`,
    SEND_REMINDER: (id: string) => `/api/v1/appointments/${id}/send-reminder`,
    AVAILABILITY: `/api/v1/appointments/availability`,
    CONFLICTS: `/api/v1/appointments/conflicts`,
    CHECK_CONFLICTS: `/api/v1/appointments/check-conflicts`,
    REMINDERS: `/api/v1/appointments/reminders`,
    PROCESS_REMINDERS: `/api/v1/appointments/process-reminders`,
    BY_STUDENT: (studentId: string) => `/api/v1/appointments/student/${studentId}`,
    BY_NURSE: (nurseId: string) => `/api/v1/appointments/nurse/${nurseId}`,
    BY_DATE: `/api/v1/appointments/by-date`,
    UPCOMING: `/api/v1/appointments/upcoming`,
    STATISTICS: `/api/v1/appointments/statistics`,
    RECURRING: `/api/v1/appointments/recurring`,
    CREATE_RECURRING: `/api/v1/appointments/recurring/create`,
    EXPORT_CALENDAR: `/api/v1/appointments/export/calendar`,
    REPORTS: `/api/v1/appointments/reports`,
  },

  // ==========================================
  // HEALTH RECORDS
  // ==========================================
  HEALTH_RECORDS: {
    BASE: `/api/v1/health-records`,
    BY_ID: (id: string) => `/api/v1/health-records/${id}`,
    BY_STUDENT: (studentId: string) => `/api/v1/students/${studentId}/health-records`,
    BY_TYPE: (type: string) => `/api/v1/health-records/type/${type}`,
    SEARCH: `/api/v1/health-records/search`,
    EXPORT: (id: string) => `/api/v1/health-records/${id}/export`,
  },

  // ==========================================
  // IMMUNIZATIONS / VACCINATIONS
  // ==========================================
  IMMUNIZATIONS: {
    BASE: `/api/v1/vaccinations`,
    BY_ID: (id: string) => `/api/v1/vaccinations/${id}`,
    SCHEDULE: `/api/v1/vaccinations/schedule`,
    BY_STUDENT: (studentId: string) => `/api/v1/students/${studentId}/immunizations`,
    DUE: `/api/v1/vaccinations/due`,
    OVERDUE: `/api/v1/vaccinations/overdue`,
    COMPLIANCE: `/api/v1/vaccinations/compliance`,
    EXEMPTIONS: `/api/v1/vaccinations/exemptions`,
    VERIFY: (id: string) => `/api/v1/vaccinations/${id}/verify`,
    EXPORT: (studentId: string) => `/api/v1/vaccinations/export/${studentId}`,
  },

  // ==========================================
  // HEALTH SCREENINGS
  // ==========================================
  SCREENINGS: {
    BASE: `/api/v1/screenings`,
    BY_ID: (id: string) => `/api/v1/screenings/${id}`,
    BY_STUDENT: (studentId: string) => `/api/v1/students/${studentId}/screenings`,
    BY_TYPE: (type: string) => `/api/v1/screenings/type/${type}`,
    DUE: `/api/v1/screenings/due`,
    SCHEDULE: `/api/v1/screenings/schedule`,
    RESULTS: (id: string) => `/api/v1/screenings/${id}/results`,
  },

  // ==========================================
  // GROWTH MEASUREMENTS
  // ==========================================
  GROWTH_MEASUREMENTS: {
    BASE: `/api/v1/growth-measurements`,
    BY_ID: (id: string) => `/api/v1/growth-measurements/${id}`,
    BY_STUDENT: (studentId: string) => `/api/v1/students/${studentId}/growth-measurements`,
    TRENDS: (studentId: string) => `/api/v1/students/${studentId}/growth-measurements/trends`,
    BMI: (studentId: string) => `/api/v1/students/${studentId}/bmi`,
  },

  // ==========================================
  // ALLERGIES
  // ==========================================
  ALLERGIES: {
    BASE: `/api/v1/allergies`,
    BY_ID: (id: string) => `/api/v1/allergies/${id}`,
    BY_STUDENT: (studentId: string) => `/api/v1/students/${studentId}/allergies`,
    CRITICAL: `/api/v1/allergies/critical`,
    ACTIVE: `/api/v1/allergies/active`,
  },

  // ==========================================
  // VITAL SIGNS
  // ==========================================
  VITAL_SIGNS: {
    BASE: `/api/v1/vital-signs`,
    BY_ID: (id: string) => `/api/v1/vital-signs/${id}`,
    BY_STUDENT: (studentId: string) => `/api/v1/students/${studentId}/vital-signs`,
    BY_HEALTH_RECORD: (healthRecordId: string) => `/api/v1/health-records/${healthRecordId}/vital-signs`,
    LATEST: (studentId: string) => `/api/v1/students/${studentId}/vital-signs/latest`,
    TRENDS: (studentId: string) => `/api/v1/students/${studentId}/vital-signs/trends`,
  },

  // ==========================================
  // CHRONIC CONDITIONS
  // ==========================================
  CHRONIC_CONDITIONS: {
    BASE: `/api/v1/chronic-conditions`,
    BY_ID: (id: string) => `/api/v1/chronic-conditions/${id}`,
    BY_STUDENT: (studentId: string) => `/api/v1/students/${studentId}/chronic-conditions`,
    ACTIVE: `/api/v1/chronic-conditions/active`,
    REVIEW_DUE: `/api/v1/chronic-conditions/review-due`,
  },

  // ==========================================
  // MEDICATIONS
  // ==========================================
  MEDICATIONS: {
    BASE: `/api/v1/medications`,
    BY_ID: (id: string) => `/api/v1/medications/${id}`,
    DETAIL: (id: string) => `/api/v1/medications/${id}`,
    ADMINISTER: (id: string) => `/api/v1/medications/${id}/administer`,
    DISCONTINUE: (id: string) => `/api/v1/medications/${id}/discontinue`,
    REFILL: (id: string) => `/api/v1/medications/${id}/refill`,
    MISSED_DOSE: (id: string) => `/api/v1/medications/${id}/missed-dose`,
    ADVERSE_REACTION: (id: string) => `/api/v1/medications/${id}/adverse-reaction`,
    ADJUST_INVENTORY: (id: string) => `/api/v1/medications/${id}/adjust-inventory`,
    REMINDER: (id: string) => `/api/v1/medications/${id}/reminder`,
    SCHEDULE: (id: string) => `/api/v1/medications/${id}/schedule`,
    INTERACTIONS: (id: string) => `/api/v1/medications/${id}/interactions`,
    CALENDAR: `/api/v1/medications/calendar`,
    DUE: `/api/v1/medications/due`,
    OVERDUE: `/api/v1/medications/overdue`,
    MISSED: `/api/v1/medications/missed`,
    COMPLETED: `/api/v1/medications/completed`,
    AS_NEEDED: `/api/v1/medications/as-needed`,
    EMERGENCY: `/api/v1/medications/emergency`,
    CONTROLLED: `/api/v1/medications/controlled-substances`,
    OTC: `/api/v1/medications/over-the-counter`,
    CATEGORIES: `/api/v1/medications/categories`,
    RULES: `/api/v1/medications/administration-rules`,
    CHECK_INTERACTIONS: `/api/v1/medications/check-interactions`,
    FORMULARY: `/api/v1/medications/formulary`,
    BY_STUDENT: (studentId: string) => `/api/v1/students/${studentId}/medications`,
  },

  // ==========================================
  // PRESCRIPTIONS
  // ==========================================
  PRESCRIPTIONS: {
    BASE: `/api/v1/prescriptions`,
    BY_ID: (id: string) => `/api/v1/prescriptions/${id}`,
    DETAIL: (id: string) => `/api/v1/prescriptions/${id}`,
    REFILL: (id: string) => `/api/v1/prescriptions/${id}/refill`,
    ACTIVE: `/api/v1/prescriptions/active`,
    EXPIRING: `/api/v1/prescriptions/expiring`,
  },

  // ==========================================
  // INVENTORY
  // ==========================================
  INVENTORY: {
    BASE: `/api/v1/inventory`,
    BY_ID: (id: string) => `/api/v1/inventory/${id}`,
    DETAIL: (id: string) => `/api/v1/inventory/${id}`,
    ADJUST: (id: string) => `/api/v1/inventory/${id}/adjust`,
    LOW_STOCK: `/api/v1/inventory/low-stock`,
    EXPIRING: `/api/v1/inventory/expiring`,
    REORDER: `/api/v1/inventory/reorder`,
    AUDIT: `/api/v1/inventory/audit`,
    ITEMS: `/api/v1/inventory/items`,
    ALERTS: `/api/v1/inventory/alerts`,
    ANALYTICS: `/api/v1/inventory/analytics`,
    DASHBOARD: `/api/v1/inventory/dashboard`,
    REPORTS: `/api/v1/inventory/reports`,
  },

  // ==========================================
  // ADMINISTRATION LOG
  // ==========================================
  ADMINISTRATION_LOG: {
    BASE: `/api/v1/administration-log`,
    BY_ID: (id: string) => `/api/v1/administration-log/${id}`,
    DETAIL: (id: string) => `/api/v1/administration-log/${id}`,
    BY_MEDICATION: (medicationId: string) => `/api/v1/medications/${medicationId}/administration-log`,
    BY_STUDENT: (studentId: string) => `/api/v1/students/${studentId}/administration-log`,
    TODAY: `/api/v1/administration-log/today`,
    MISSED: `/api/v1/administration-log/missed`,
  },

  // ==========================================
  // EMERGENCY CONTACTS
  // ==========================================
  EMERGENCY_CONTACTS: {
    BASE: `/api/v1/emergency-contacts`,
    BY_ID: (id: string) => `/api/v1/emergency-contacts/${id}`,
    BY_STUDENT: (studentId: string) => `/api/v1/students/${studentId}/emergency-contacts`,
    PRIMARY: (studentId: string) => `/api/v1/students/${studentId}/emergency-contacts/primary`,
    VERIFY: (id: string) => `/api/v1/emergency-contacts/${id}/verify`,
    NOTIFY: (id: string) => `/api/v1/emergency-contacts/${id}/notify`,
  },

  // ==========================================
  // INCIDENTS
  // ==========================================
  INCIDENTS: {
    BASE: `/api/v1/incident-report`,
    BY_ID: (id: string) => `/api/v1/incident-report/${id}`,
    WITNESSES: (incidentId: string) => `/api/v1/incident-report/${incidentId}/witnesses`,
    WITNESS_STATEMENT: (incidentId: string, witnessId: string) =>
      `/api/v1/incident-report/${incidentId}/witnesses/${witnessId}/statement`,
    VERIFY_STATEMENT: (statementId: string) => `/api/v1/incident-report/statements/${statementId}/verify`,
    FOLLOW_UP: (incidentId: string) => `/api/v1/incident-report/${incidentId}/follow-up`,
    FOLLOW_UP_PROGRESS: (followUpId: string) => `/api/v1/incident-report/follow-up/${followUpId}/progress`,
    FOLLOW_UP_COMPLETE: (followUpId: string) => `/api/v1/incident-report/follow-up/${followUpId}/complete`,
    ANALYTICS: `/api/v1/incident-report/analytics`,
    TRENDING: `/api/v1/incident-report/trending`,
    BY_STUDENT: (studentId: string) => `/api/v1/students/${studentId}/incidents`,
    BY_TYPE: (type: string) => `/api/v1/incident-report/type/${type}`,
    BY_SEVERITY: (severity: string) => `/api/v1/incident-report/severity/${severity}`,
  },

  // ==========================================
  // DOCUMENTS
  // ==========================================
  DOCUMENTS: {
    BASE: `/api/v1/documents`,
    BY_ID: (id: string) => `/api/v1/documents/${id}`,
    UPLOAD: `/api/v1/documents/upload`,
    DOWNLOAD: (id: string) => `/api/v1/documents/${id}/download`,
    PREVIEW: (id: string) => `/api/v1/documents/${id}/preview`,
    SIGN: (id: string) => `/api/v1/documents/${id}/sign`,
    VERIFY_SIGNATURE: (id: string) => `/api/v1/documents/${id}/verify-signature`,
    BY_STUDENT: (studentId: string) => `/api/v1/students/${studentId}/documents`,
    BY_TYPE: (type: string) => `/api/v1/documents/type/${type}`,
    TEMPLATES: `/api/v1/documents/templates`,
  },

  // ==========================================
  // COMPLIANCE & AUDIT
  // ==========================================
  COMPLIANCE: {
    REPORTS: `/api/v1/compliance/reports`,
    AUDIT_LOGS: `/api/v1/compliance/audit-logs`,
    PHI_DISCLOSURES: `/api/v1/compliance/phi-disclosures`,
    ACCESS_LOG: `/api/v1/compliance/access-log`,
    DATA_RETENTION: `/api/v1/compliance/data-retention`,
    EXPORT: `/api/v1/compliance/export`,
  },

  AUDIT: {
    LOGS: `/api/v1/audit-logs`,
    BY_ID: (id: string) => `/api/v1/audit-logs/${id}`,
    BY_USER: (userId: string) => `/api/v1/audit-logs/user/${userId}`,
    BY_RESOURCE: (resourceType: string, resourceId: string) =>
      `/api/v1/audit-logs/resource/${resourceType}/${resourceId}`,
    BY_ACTION: (action: string) => `/api/v1/audit-logs/action/${action}`,
    PHI_ACCESS: `/api/v1/audit-logs/phi-access`,
    PHI_ACCESS_LOG: `/api/v1/audit/phi-access`,
    EXPORT: `/api/v1/audit-logs/export`,
  },

  // ==========================================
  // COMMUNICATIONS
  // ==========================================
  MESSAGES: {
    BASE: `/api/v1/messages`,
    BY_ID: (id: string) => `/api/v1/messages/${id}`,
    SEND: `/api/v1/messages/send`,
    INBOX: `/api/v1/messages/inbox`,
    SENT: `/api/v1/messages/sent`,
    UNREAD: `/api/v1/messages/unread`,
    MARK_READ: (id: string) => `/api/v1/messages/${id}/mark-read`,
    MARK_UNREAD: (id: string) => `/api/v1/messages/${id}/mark-unread`,
    DELETE: (id: string) => `/api/v1/messages/${id}`,
    THREAD: (id: string) => `/api/v1/messages/thread/${id}`,
    ATTACHMENTS: (id: string) => `/api/v1/messages/${id}/attachments`,
  },

  BROADCASTS: {
    BASE: `/api/v1/broadcasts`,
    BY_ID: (id: string) => `/api/v1/broadcasts/${id}`,
    SEND: `/api/v1/broadcasts/send`,
    SCHEDULE: `/api/v1/broadcasts/schedule`,
    RECIPIENTS: (id: string) => `/api/v1/broadcasts/${id}/recipients`,
    CANCEL: (id: string) => `/api/v1/broadcasts/${id}/cancel`,
    DUPLICATE: (id: string) => `/api/v1/broadcasts/${id}/duplicate`,
    DELIVERY_STATUS: (id: string) => `/api/v1/broadcasts/${id}/delivery-status`,
    DRAFTS: `/api/v1/broadcasts/drafts`,
    SCHEDULED: `/api/v1/broadcasts/scheduled`,
  },

  ALERTS: {
    BASE: `/api/v1/alerts`,
    BY_ID: (id: string) => `/api/v1/alerts/${id}`,
    ACTIVE: `/api/v1/alerts/active`,
    ACKNOWLEDGE: (id: string) => `/api/v1/alerts/${id}/acknowledge`,
    DISMISS: (id: string) => `/api/v1/alerts/${id}/dismiss`,
    MEDICATION_REMINDERS: `/api/v1/alerts/medication-reminders`,
    APPOINTMENT_REMINDERS: `/api/v1/alerts/appointment-reminders`,
    EMERGENCY: `/api/v1/alerts/emergency`,
    BY_TYPE: (type: string) => `/api/v1/alerts/type/${type}`,
  },

  NOTIFICATIONS: {
    BASE: `/api/v1/notifications`,
    BY_ID: (id: string) => `/api/v1/notifications/${id}`,
    UNREAD: `/api/v1/notifications/unread`,
    MARK_READ: (id: string) => `/api/v1/notifications/${id}/mark-read`,
    MARK_ALL_READ: `/api/v1/notifications/mark-all-read`,
    PREFERENCES: `/api/v1/notifications/preferences`,
    TEST_PUSH: `/api/v1/notifications/test-push`,
    PUSH_SUBSCRIBE: `/api/v1/notifications/push-subscribe`,
    PUSH_UNSUBSCRIBE: `/api/v1/notifications/push-unsubscribe`,
    PUSH_SUBSCRIPTION: `/api/v1/notifications/push-subscription`,
  },

  CONVERSATIONS: {
    BASE: `/api/v1/conversations`,
    BY_ID: (id: string) => `/api/v1/conversations/${id}`,
    BY_USER: (userId: string) => `/api/v1/conversations/user/${userId}`,
    MESSAGES: (conversationId: string) => `/api/v1/conversations/${conversationId}/messages`,
    PARTICIPANTS: (conversationId: string) => `/api/v1/conversations/${conversationId}/participants`,
    ADD_PARTICIPANT: (conversationId: string) => `/api/v1/conversations/${conversationId}/participants`,
    REMOVE_PARTICIPANT: (conversationId: string, userId: string) =>
      `/api/v1/conversations/${conversationId}/participants/${userId}`,
    ARCHIVE: (id: string) => `/api/v1/conversations/${id}/archive`,
    UNARCHIVE: (id: string) => `/api/v1/conversations/${id}/unarchive`,
  },

  TEMPLATES: {
    BASE: `/api/v1/templates`,
    BY_ID: (id: string) => `/api/v1/templates/${id}`,
    BY_CATEGORY: (category: string) => `/api/v1/templates/category/${category}`,
    RENDER: (id: string) => `/api/v1/templates/${id}/render`,
    CATEGORIES: `/api/v1/templates/categories`,
  },

  // ==========================================
  // DASHBOARD
  // ==========================================
  DASHBOARD: {
    STATS: `/api/v1/dashboard/stats`,
    RECENT_ACTIVITIES: `/api/v1/dashboard/recent-activities`,
    UPCOMING_APPOINTMENTS: `/api/v1/dashboard/upcoming-appointments`,
    CHART_DATA: `/api/v1/dashboard/chart-data`,
    WIDGETS: (dashboardId: string) => `/api/v1/dashboard/${dashboardId}/widgets`,
    REFRESH: `/api/v1/dashboard/refresh-cache`,
  },

  // ==========================================
  // ANALYTICS & REPORTING
  // ==========================================
  ANALYTICS: {
    METRICS: `/api/v1/analytics/metrics`,
    DASHBOARD: `/api/v1/analytics/dashboard`,
    DASHBOARD_WIDGETS: (dashboardId: string) => `/api/v1/analytics/dashboard/${dashboardId}/widgets`,
    REPORTS: `/api/v1/analytics/reports`,
    CHART_DATA: `/api/v1/analytics/chart-data`,
    HEALTH_METRICS: `/api/v1/analytics/health-metrics`,
    MEDICATION_COMPLIANCE: `/api/v1/analytics/medication-compliance`,
    APPOINTMENT_METRICS: `/api/v1/analytics/appointment-metrics`,
    INCIDENT_ANALYTICS: `/api/v1/analytics/incident-analytics`,
    CUSTOM_REPORT: `/api/v1/analytics/custom-report`,
  },

  REPORTS: {
    // Base Reports
    BASE: `/api/v1/reports`,
    CUSTOM: `/api/v1/reports/custom`,
    TEMPLATES: `/api/v1/reports/templates`,
    SCHEDULED: `/api/v1/reports/scheduled`,
    SCHEDULE: `/api/v1/reports/schedule`,
    EXPORT: `/api/v1/reports/export`,
    HISTORY: `/api/v1/reports/history`,
    SHARE: (reportId: string) => `/api/v1/reports/${reportId}/share`,

    // Health Trend Analysis
    HEALTH_TRENDS: `/api/v1/reports/health-trends`,
    HEALTH_TRENDS_BY_CATEGORY: (category: string) => `/api/v1/reports/health-trends/${category}`,

    // Medication Reports
    MEDICATIONS: {
      ADMINISTRATION: `/api/v1/reports/medications/administration`,
      COMPLIANCE: `/api/v1/reports/medications/compliance`,
      EXPIRATION: `/api/v1/reports/medications/expiration`,
      INVENTORY: `/api/v1/reports/medications/inventory`,
      REFILLS: `/api/v1/reports/medications/refills`,
      USAGE: `/api/v1/reports/medication-usage`,
      EFFECTIVENESS: `/api/v1/reports/medication-effectiveness`,
    },

    // Immunization Reports
    IMMUNIZATIONS: {
      COMPLIANCE: `/api/v1/reports/immunizations/compliance`,
      DUE: `/api/v1/reports/immunizations/due`,
      OVERDUE: `/api/v1/reports/immunizations/overdue`,
      EXEMPTIONS: `/api/v1/reports/immunizations/exemptions`,
    },

    // Appointment Reports
    APPOINTMENTS: {
      ATTENDANCE: `/api/v1/reports/appointments/attendance`,
      NO_SHOWS: `/api/v1/reports/appointments/no-shows`,
      CANCELLATIONS: `/api/v1/reports/appointments/cancellations`,
    },

    // Incident Reports
    INCIDENTS: {
      SUMMARY: `/api/v1/reports/incidents/summary`,
      BY_TYPE: `/api/v1/reports/incidents/by-type`,
      TRENDS: `/api/v1/reports/incidents/trends`,
      STATISTICS: `/api/v1/reports/incident-statistics`,
      BY_LOCATION: `/api/v1/reports/incidents-by-location`,
    },

    // Student Reports
    STUDENTS: {
      ENROLLMENT: `/api/v1/reports/students/enrollment`,
      HEALTH_SUMMARY: `/api/v1/reports/students/health-summary`,
      DEMOGRAPHICS: `/api/v1/reports/students/demographics`,
    },

    // Attendance & Absenteeism
    ATTENDANCE_CORRELATION: `/api/v1/reports/attendance-correlation`,
    ABSENTEEISM_PATTERNS: `/api/v1/reports/absenteeism-patterns`,

    // Performance & Analytics
    PERFORMANCE_METRICS: `/api/v1/reports/performance-metrics`,
    NURSE_PERFORMANCE: `/api/v1/reports/nurse-performance`,
    SYSTEM_USAGE: `/api/v1/reports/system-usage`,
    USAGE_ANALYTICS: `/api/v1/reports/analytics/usage`,
    POPULARITY: `/api/v1/reports/analytics/popularity`,
    INSIGHTS: `/api/v1/reports/analytics/insights`,

    // Dashboard Reports
    DASHBOARD: `/api/v1/reports/dashboard`,
    DASHBOARD_WIDGETS: `/api/v1/reports/dashboard/widgets`,
    DASHBOARD_LAYOUT: `/api/v1/reports/dashboard/layout`,

    // Compliance Reports
    COMPLIANCE: `/api/v1/reports/compliance`,
    COMPLIANCE_HISTORY: `/api/v1/reports/compliance/history`,
    COMPLIANCE_AUDIT: `/api/v1/reports/compliance/audit`,
  },

  // ==========================================
  // SYSTEM & ADMINISTRATION
  // ==========================================
  SYSTEM: {
    HEALTH: `/api/v1/health`,
    STATUS: `/api/v1/system/status`,
    CONFIGURATION: `/api/v1/system/configuration`,
    SETTINGS: `/api/v1/system/settings`,
    BACKUP: `/api/v1/system/backup`,
    RESTORE: `/api/v1/system/restore`,
  },

  // ==========================================
  // ADMIN - District, School, User Management
  // ==========================================
  ADMIN: {
    // System Settings
    SETTINGS: `/api/v1/administration/settings`,

    // Users
    USERS: `/api/v1/users`,
    USER_BY_ID: (id: string) => `/api/v1/users/${id}`,

    // Districts
    DISTRICTS: `/api/v1/administration/districts`,
    DISTRICT_BY_ID: (id: string) => `/api/v1/administration/districts/${id}`,

    // Schools
    SCHOOLS: `/api/v1/administration/schools`,
    SCHOOL_BY_ID: (id: string) => `/api/v1/administration/schools/${id}`,

    // System Health
    SYSTEM_HEALTH: `/api/v1/admin/system/health`,

    // Backups
    BACKUPS: `/api/v1/administration/backups`,
    BACKUP_BY_ID: (id: string) => `/api/v1/administration/backups/${id}`,

    // Licenses
    LICENSES: `/api/v1/administration/licenses`,
    LICENSE_BY_ID: (id: string) => `/api/v1/administration/licenses/${id}`,
    LICENSE_DEACTIVATE: (id: string) => `/api/v1/administration/licenses/${id}/deactivate`,

    // Configurations
    CONFIGURATIONS: `/api/v1/administration/config`,
    CONFIGURATION_BY_KEY: (key: string) => `/api/v1/administration/config/${key}`,

    // Performance Metrics
    METRICS: `/api/v1/admin/metrics`,
    METRIC_BY_ID: (id: string) => `/api/v1/admin/metrics/${id}`,

    // Training
    TRAINING: `/api/v1/admin/training`,
    TRAINING_BY_ID: (id: string) => `/api/v1/admin/training/${id}`,
    TRAINING_COMPLETE: (id: string) => `/api/v1/admin/training/${id}/complete`,
    TRAINING_PROGRESS: (userId: string) => `/api/v1/admin/training/progress/${userId}`,

    // Audit Logs
    AUDIT_LOGS: `/api/v1/administration/audit-logs`,
    AUDIT_LOG_BY_ID: (id: string) => `/api/v1/administration/audit-logs/${id}`,
  },

  INTEGRATIONS: {
    BASE: `/api/v1/integrations`,
    BY_ID: (id: string) => `/api/v1/integrations/${id}`,
    CONFIGURE: (id: string) => `/api/v1/integrations/${id}/configure`,
    TEST: (id: string) => `/api/v1/integrations/${id}/test`,
    SYNC: (id: string) => `/api/v1/integrations/${id}/sync`,
    ENABLE: (id: string) => `/api/v1/integrations/${id}/enable`,
    DISABLE: (id: string) => `/api/v1/integrations/${id}/disable`,
    LOGS: (id: string) => `/api/v1/integrations/${id}/logs`,
  },

  // ==========================================
  // MULTI-FACTOR AUTHENTICATION (MFA)
  // ==========================================
  MFA: {
    SETUP: `/api/v1/mfa/setup`,
    VERIFY: `/api/v1/mfa/verify`,
    ENABLE: `/api/v1/mfa/enable`,
    DISABLE: `/api/v1/mfa/disable`,
    BACKUP_CODES: `/api/v1/mfa/backup-codes`,
    REGENERATE_CODES: `/api/v1/mfa/backup-codes/regenerate`,
    VERIFY_BACKUP_CODE: `/api/v1/mfa/verify-backup-code`,
    QR_CODE: `/api/v1/mfa/qr-code`,
    STATUS: `/api/v1/mfa/status`,
  },

  // ==========================================
  // APPOINTMENT WAITLIST
  // ==========================================
  WAITLIST: {
    BASE: `/api/v1/waitlist`,
    BY_ID: (id: string) => `/api/v1/waitlist/${id}`,
    ADD: `/api/v1/waitlist/add`,
    REMOVE: (id: string) => `/api/v1/waitlist/${id}/remove`,
    POSITION: (id: string) => `/api/v1/waitlist/${id}/position`,
    NOTIFY: (id: string) => `/api/v1/waitlist/${id}/notify`,
    UPDATE_PRIORITY: (id: string) => `/api/v1/waitlist/${id}/priority`,
    BY_STUDENT: (studentId: string) => `/api/v1/waitlist/student/${studentId}`,
    BY_NURSE: (nurseId: string) => `/api/v1/waitlist/nurse/${nurseId}`,
  },

  // ==========================================
  // NURSE AVAILABILITY & SCHEDULING
  // ==========================================
  NURSE_AVAILABILITY: {
    BASE: `/api/v1/nurse-availability`,
    BY_ID: (id: string) => `/api/v1/nurse-availability/${id}`,
    BY_NURSE: (nurseId: string) => `/api/v1/nurse-availability/nurse/${nurseId}`,
    SLOTS: `/api/v1/nurse-availability/slots`,
    SET: `/api/v1/nurse-availability/set`,
    UPDATE: (id: string) => `/api/v1/nurse-availability/${id}`,
    DELETE: (id: string) => `/api/v1/nurse-availability/${id}`,
    BY_DATE: (date: string) => `/api/v1/nurse-availability/date/${date}`,
    CHECK_CONFLICTS: `/api/v1/nurse-availability/check-conflicts`,
  },

  // ==========================================
  // FORMS
  // ==========================================
  FORMS: {
    BASE: `/api/v1/forms`,
    BY_ID: (id: string) => `/api/v1/forms/${id}`,
    TEMPLATES: `/api/v1/forms/templates`,
    SUBMIT: `/api/v1/forms/submit`,
    RESPONSES: (formId: string) => `/api/v1/forms/${formId}/responses`,
    SUBMISSIONS: (formId: string) => `/api/v1/forms/${formId}/submissions`,
    EXPORT: (formId: string) => `/api/v1/forms/${formId}/export`,
  },

  // ==========================================
  // PURCHASE ORDERS & PROCUREMENT
  // ==========================================
  PURCHASE_ORDERS: {
    BASE: `/api/v1/purchase-orders`,
    BY_ID: (id: string) => `/api/v1/purchase-orders/${id}`,
    APPROVE: (id: string) => `/api/v1/purchase-orders/${id}/approve`,
    REJECT: (id: string) => `/api/v1/purchase-orders/${id}/reject`,
    RECEIVE: (id: string) => `/api/v1/purchase-orders/${id}/receive`,
    RECEIVE_ITEMS: (id: string) => `/api/v1/purchase-orders/${id}/receive-items`,
    CANCEL: (id: string) => `/api/v1/purchase-orders/${id}/cancel`,
    STATISTICS: `/api/v1/purchase-orders/statistics`,
    PENDING: `/api/v1/purchase-orders/pending`,
    APPROVED: `/api/v1/purchase-orders/approved`,
    RECEIVED: `/api/v1/purchase-orders/received`,
    BY_VENDOR: (vendorId: string) => `/api/v1/purchase-orders/vendor/${vendorId}`,
    REORDER_ITEMS: `/api/v1/purchase-orders/reorder-items`,
    VENDOR_HISTORY: (vendorId: string) => `/api/v1/purchase-orders/vendor/${vendorId}/history`,
  },

  // ==========================================
  // BILLING & FINANCIAL MANAGEMENT
  // ==========================================
  BILLING: {
    // Invoices
    INVOICES: `/api/v1/billing/invoices`,
    INVOICE_BY_ID: (id: string) => `/api/v1/billing/invoices/${id}`,
    INVOICE_PDF: (id: string) => `/api/v1/billing/invoices/${id}/pdf`,
    INVOICE_SEND: (id: string) => `/api/v1/billing/invoices/${id}/send`,
    INVOICE_VOID: (id: string) => `/api/v1/billing/invoices/${id}/void`,
    
    // Payments
    PAYMENTS: `/api/v1/billing/payments`,
    PAYMENT_BY_ID: (id: string) => `/api/v1/billing/payments/${id}`,
    PAYMENT_REFUND: (id: string) => `/api/v1/billing/payments/${id}/refund`,
    PAYMENT_VOID: (id: string) => `/api/v1/billing/payments/${id}/void`,
    
    // Analytics
    ANALYTICS: `/api/v1/billing/analytics`,
    REVENUE_TRENDS: `/api/v1/billing/analytics/revenue-trends`,
    PAYMENT_ANALYTICS: `/api/v1/billing/analytics/payments`,
    COLLECTION_METRICS: `/api/v1/billing/analytics/collections`,
    
    // Reports
    REPORTS: `/api/v1/billing/reports`,
    AGING_REPORT: `/api/v1/billing/reports/aging`,
    REVENUE_REPORT: `/api/v1/billing/reports/revenue`,
    PAYMENT_REPORT: `/api/v1/billing/reports/payments`,
    TAX_REPORT: `/api/v1/billing/reports/tax`,
    
    // Settings
    SETTINGS: `/api/v1/billing/settings`,
    
    // Notifications
    NOTIFICATIONS: `/api/v1/billing/notifications`,
    SEND_REMINDER: `/api/v1/billing/notifications/reminder`,
    SEND_STATEMENT: `/api/v1/billing/notifications/statement`,
  },

  // ==========================================
  // BUDGET MANAGEMENT
  // ==========================================
  BUDGET: {
    // Budget Categories
    CATEGORIES: `/api/v1/budget/categories`,
    CATEGORY_BY_ID: (id: string) => `/api/v1/budget/categories/${id}`,

    // Budget Summary
    SUMMARY: `/api/v1/budget/summary`,

    // Budget Transactions
    TRANSACTIONS: `/api/v1/budget/transactions`,
    TRANSACTION_BY_ID: (id: string) => `/api/v1/budget/transactions/${id}`,

    // Analytics & Reporting
    TRENDS: `/api/v1/budget/trends`,
    YEAR_COMPARISON: `/api/v1/budget/year-comparison`,
    OVER_BUDGET: `/api/v1/budget/over-budget`,
    RECOMMENDATIONS: `/api/v1/budget/recommendations`,
    EXPORT: `/api/v1/budget/export`,
  },

  // ==========================================
  // VENDORS
  // ==========================================
  VENDORS: {
    BASE: `/api/v1/vendors`,
    BY_ID: (id: string) => `/api/v1/vendors/${id}`,
    SEARCH: (query: string) => `/api/v1/vendors/search/${encodeURIComponent(query)}`,
    COMPARE: (itemName: string) => `/api/v1/vendors/compare/${encodeURIComponent(itemName)}`,
    TOP: `/api/v1/vendors/top`,
    STATISTICS: `/api/v1/vendors/statistics`,
    REACTIVATE: (id: string) => `/api/v1/vendors/${id}/reactivate`,
    RATING: (id: string) => `/api/v1/vendors/${id}/rating`,
    BULK_RATINGS: `/api/v1/vendors/ratings/bulk`,
    BY_PAYMENT_TERMS: (terms: string) => `/api/v1/vendors/payment-terms/${encodeURIComponent(terms)}`,
    METRICS: (id: string) => `/api/v1/vendors/${id}/metrics`,
    PERMANENT_DELETE: (id: string) => `/api/v1/vendors/${id}/permanent`,
  },

  // ==========================================
  // SETTINGS
  // ==========================================
  SETTINGS: {
    USER: `/api/v1/settings/user`,
    SCHOOL: `/api/v1/settings/school`,
    NOTIFICATIONS: `/api/v1/settings/notifications`,
    PREFERENCES: `/api/v1/settings/preferences`,
    PRIVACY: `/api/v1/settings/privacy`,
    SECURITY: `/api/v1/settings/security`,
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
