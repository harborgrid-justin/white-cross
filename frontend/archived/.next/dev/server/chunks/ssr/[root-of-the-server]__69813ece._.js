module.exports = [
"[project]/src/lib/server/api-client.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Server-side API client for Next.js Server Actions
 * Provides resilient HTTP requests with retry logic and proper error handling
 *
 * @module lib/server/api-client
 * @version 1.0.0
 *
 * @deprecated This module provides a simple API client for Server Actions.
 * For most use cases, prefer using @/lib/api/nextjs-client which provides
 * comprehensive Next.js caching integration and better error handling.
 * This client is suitable for simple, non-cached API calls in Server Actions.
 */ /**
 * Fetch options for simple server actions
 */ __turbopack_context__.s([
    "getBackendUrl",
    ()=>getBackendUrl,
    "serverDelete",
    ()=>serverDelete,
    "serverFetch",
    ()=>serverFetch,
    "serverGet",
    ()=>serverGet,
    "serverPost",
    ()=>serverPost,
    "serverPut",
    ()=>serverPut
]);
async function serverFetch(url, options = {}) {
    const { maxRetries = 3, retryDelay = 1000, timeout = 10000, ...fetchOptions } = options;
    let lastError = null;
    for(let attempt = 0; attempt <= maxRetries; attempt++){
        try {
            // Add timeout to fetch
            const controller = new AbortController();
            const timeoutId = setTimeout(()=>controller.abort(), timeout);
            const response = await fetch(url, {
                ...fetchOptions,
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            // Parse response
            const contentType = response.headers.get('content-type');
            let data;
            if (contentType?.includes('application/json')) {
                data = await response.json();
            } else {
                data = await response.text();
            }
            // Handle HTTP errors
            if (!response.ok) {
                const errorMessage = typeof data === 'object' && data.message ? data.message : typeof data === 'string' ? data : `HTTP ${response.status}: ${response.statusText}`;
                // Don't retry 4xx errors (client errors)
                if (response.status >= 400 && response.status < 500) {
                    return {
                        success: false,
                        error: errorMessage
                    };
                }
                // Retry 5xx errors
                throw new Error(errorMessage);
            }
            // Success
            return {
                success: true,
                data: data
            };
        } catch (error) {
            lastError = error instanceof Error ? error : new Error(String(error));
            // Don't retry on timeout or abort errors after max retries
            if (attempt === maxRetries) {
                break;
            }
            // Check if error is retryable
            const isRetryable = error instanceof Error && (error.name === 'TypeError' || // Network error
            error.name === 'AbortError' || // Timeout
            error.message.includes('ECONNREFUSED') || // Connection refused
            error.message.includes('ETIMEDOUT')); // Timeout
            if (!isRetryable) {
                break;
            }
            // Wait before retry with exponential backoff
            await new Promise((resolve)=>setTimeout(resolve, retryDelay * (attempt + 1)));
        }
    }
    // All retries failed
    return {
        success: false,
        error: lastError?.message || 'Network request failed'
    };
}
function getBackendUrl() {
    return process.env.API_BASE_URL || ("TURBOPACK compile-time value", "http://localhost:3001") || 'http://localhost:3001';
}
async function serverGet(endpoint, options = {}) {
    const url = endpoint.startsWith('http') ? endpoint : `${getBackendUrl()}${endpoint}`;
    return serverFetch(url, {
        ...options,
        method: 'GET'
    });
}
async function serverPost(endpoint, body, options = {}) {
    const url = endpoint.startsWith('http') ? endpoint : `${getBackendUrl()}${endpoint}`;
    return serverFetch(url, {
        ...options,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
        body: body ? JSON.stringify(body) : undefined
    });
}
async function serverPut(endpoint, body, options = {}) {
    const url = endpoint.startsWith('http') ? endpoint : `${getBackendUrl()}${endpoint}`;
    return serverFetch(url, {
        ...options,
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
        body: body ? JSON.stringify(body) : undefined
    });
}
async function serverDelete(endpoint, options = {}) {
    const url = endpoint.startsWith('http') ? endpoint : `${getBackendUrl()}${endpoint}`;
    return serverFetch(url, {
        ...options,
        method: 'DELETE'
    });
}
}),
"[project]/src/constants/api.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

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
 */ __turbopack_context__.s([
    "API_ENDPOINTS",
    ()=>API_ENDPOINTS,
    "HTTP_STATUS",
    ()=>HTTP_STATUS,
    "default",
    ()=>__TURBOPACK__default__export__
]);
const API_ENDPOINTS = {
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
        RESET_PASSWORD: `/api/v1/auth/reset-password`
    },
    // ==========================================
    // USERS & ACCESS CONTROL
    // ==========================================
    USERS: {
        BASE: `/api/v1/users`,
        BY_ID: (id)=>`/api/v1/users/${id}`,
        ME: `/api/v1/users/me`,
        PROFILE: `/api/v1/users/profile`,
        UPDATE_PROFILE: `/api/v1/users/profile`
    },
    RBAC: {
        ROLES: `/api/v1/access-control/roles`,
        PERMISSIONS: `/api/v1/access-control/permissions`,
        USER_ROLES: (userId)=>`/api/v1/access-control/users/${userId}/roles`,
        USER_PERMISSIONS: (userId)=>`/api/v1/access-control/users/${userId}/permissions`
    },
    // ==========================================
    // STUDENTS
    // ==========================================
    STUDENTS: {
        BASE: `/api/v1/students`,
        BY_ID: (id)=>`/api/v1/students/${id}`,
        DEACTIVATE: (id)=>`/api/v1/students/${id}/deactivate`,
        REACTIVATE: (id)=>`/api/v1/students/${id}/reactivate`,
        TRANSFER: (id)=>`/api/v1/students/${id}/transfer`,
        ASSIGN: (id)=>`/api/v1/students/${id}/assign`,
        ASSIGN_BULK: `/api/v1/students/assign-bulk`,
        PHOTO: (id)=>`/api/v1/students/${id}/photo`,
        EXPORT: (id)=>`/api/v1/students/${id}/export`,
        REPORT_CARD: (id)=>`/api/v1/students/${id}/report-card`,
        VERIFY_ELIGIBILITY: (id)=>`/api/v1/students/${id}/verify-eligibility`,
        SEARCH: `/api/v1/students/search`,
        SEARCH_BY_QUERY: (query)=>`/api/v1/students/search/${encodeURIComponent(query)}`,
        BY_GRADE: (grade)=>`/api/v1/students/grade/${grade}`,
        BY_NURSE: (nurseId)=>`/api/v1/students/nurse/${nurseId}`,
        ASSIGNED: `/api/v1/students/assigned`,
        STATISTICS: (id)=>`/api/v1/students/${id}/statistics`,
        BULK_UPDATE: `/api/v1/students/bulk-update`,
        PERMANENT_DELETE: (id)=>`/api/v1/students/${id}/permanent`,
        GRADES: `/api/v1/students/grades`,
        HEALTH_RECORDS: (id)=>`/api/v1/students/${id}/health-records`,
        MENTAL_HEALTH_RECORDS: (id)=>`/api/v1/students/${id}/mental-health-records`,
        MEDICATIONS: (id)=>`/api/v1/students/${id}/medications`,
        IMMUNIZATIONS: (id)=>`/api/v1/students/${id}/immunizations`,
        ALLERGIES: (id)=>`/api/v1/students/${id}/allergies`,
        APPOINTMENTS: (id)=>`/api/v1/students/${id}/appointments`,
        INCIDENTS: (id)=>`/api/v1/students/${id}/incidents`,
        EMERGENCY_CONTACTS: (id)=>`/api/v1/students/${id}/emergency-contacts`
    },
    // ==========================================
    // APPOINTMENTS
    // ==========================================
    APPOINTMENTS: {
        BASE: `/api/v1/appointments`,
        BY_ID: (id)=>`/api/v1/appointments/${id}`,
        RESCHEDULE: (id)=>`/api/v1/appointments/${id}/reschedule`,
        CANCEL: (id)=>`/api/v1/appointments/${id}/cancel`,
        COMPLETE: (id)=>`/api/v1/appointments/${id}/complete`,
        NO_SHOW: (id)=>`/api/v1/appointments/${id}/no-show`,
        CONFIRM: (id)=>`/api/v1/appointments/${id}/confirm`,
        START: (id)=>`/api/v1/appointments/${id}/start`,
        SEND_REMINDER: (id)=>`/api/v1/appointments/${id}/send-reminder`,
        AVAILABILITY: `/api/v1/appointments/availability`,
        CONFLICTS: `/api/v1/appointments/conflicts`,
        CHECK_CONFLICTS: `/api/v1/appointments/check-conflicts`,
        REMINDERS: `/api/v1/appointments/reminders`,
        PROCESS_REMINDERS: `/api/v1/appointments/process-reminders`,
        BY_STUDENT: (studentId)=>`/api/v1/appointments/student/${studentId}`,
        BY_NURSE: (nurseId)=>`/api/v1/appointments/nurse/${nurseId}`,
        BY_DATE: `/api/v1/appointments/by-date`,
        UPCOMING: `/api/v1/appointments/upcoming`,
        STATISTICS: `/api/v1/appointments/statistics`,
        RECURRING: `/api/v1/appointments/recurring`,
        CREATE_RECURRING: `/api/v1/appointments/recurring/create`,
        EXPORT_CALENDAR: `/api/v1/appointments/export/calendar`,
        REPORTS: `/api/v1/appointments/reports`
    },
    // ==========================================
    // HEALTH RECORDS
    // ==========================================
    HEALTH_RECORDS: {
        BASE: `/api/v1/health-records`,
        BY_ID: (id)=>`/api/v1/health-records/${id}`,
        BY_STUDENT: (studentId)=>`/api/v1/students/${studentId}/health-records`,
        BY_TYPE: (type)=>`/api/v1/health-records/type/${type}`,
        SEARCH: `/api/v1/health-records/search`,
        EXPORT: (id)=>`/api/v1/health-records/${id}/export`
    },
    // ==========================================
    // IMMUNIZATIONS / VACCINATIONS
    // ==========================================
    IMMUNIZATIONS: {
        BASE: `/api/v1/vaccinations`,
        BY_ID: (id)=>`/api/v1/vaccinations/${id}`,
        SCHEDULE: `/api/v1/vaccinations/schedule`,
        BY_STUDENT: (studentId)=>`/api/v1/students/${studentId}/immunizations`,
        DUE: `/api/v1/vaccinations/due`,
        OVERDUE: `/api/v1/vaccinations/overdue`,
        COMPLIANCE: `/api/v1/vaccinations/compliance`,
        EXEMPTIONS: `/api/v1/vaccinations/exemptions`,
        VERIFY: (id)=>`/api/v1/vaccinations/${id}/verify`,
        EXPORT: (studentId)=>`/api/v1/vaccinations/export/${studentId}`
    },
    // ==========================================
    // HEALTH SCREENINGS
    // ==========================================
    SCREENINGS: {
        BASE: `/api/v1/screenings`,
        BY_ID: (id)=>`/api/v1/screenings/${id}`,
        BY_STUDENT: (studentId)=>`/api/v1/students/${studentId}/screenings`,
        BY_TYPE: (type)=>`/api/v1/screenings/type/${type}`,
        DUE: `/api/v1/screenings/due`,
        SCHEDULE: `/api/v1/screenings/schedule`,
        RESULTS: (id)=>`/api/v1/screenings/${id}/results`
    },
    // ==========================================
    // GROWTH MEASUREMENTS
    // ==========================================
    GROWTH_MEASUREMENTS: {
        BASE: `/api/v1/growth-measurements`,
        BY_ID: (id)=>`/api/v1/growth-measurements/${id}`,
        BY_STUDENT: (studentId)=>`/api/v1/students/${studentId}/growth-measurements`,
        TRENDS: (studentId)=>`/api/v1/students/${studentId}/growth-measurements/trends`,
        BMI: (studentId)=>`/api/v1/students/${studentId}/bmi`
    },
    // ==========================================
    // ALLERGIES
    // ==========================================
    ALLERGIES: {
        BASE: `/api/v1/allergies`,
        BY_ID: (id)=>`/api/v1/allergies/${id}`,
        BY_STUDENT: (studentId)=>`/api/v1/students/${studentId}/allergies`,
        CRITICAL: `/api/v1/allergies/critical`,
        ACTIVE: `/api/v1/allergies/active`
    },
    // ==========================================
    // VITAL SIGNS
    // ==========================================
    VITAL_SIGNS: {
        BASE: `/api/v1/vital-signs`,
        BY_ID: (id)=>`/api/v1/vital-signs/${id}`,
        BY_STUDENT: (studentId)=>`/api/v1/students/${studentId}/vital-signs`,
        BY_HEALTH_RECORD: (healthRecordId)=>`/api/v1/health-records/${healthRecordId}/vital-signs`,
        LATEST: (studentId)=>`/api/v1/students/${studentId}/vital-signs/latest`,
        TRENDS: (studentId)=>`/api/v1/students/${studentId}/vital-signs/trends`
    },
    // ==========================================
    // CHRONIC CONDITIONS
    // ==========================================
    CHRONIC_CONDITIONS: {
        BASE: `/api/v1/chronic-conditions`,
        BY_ID: (id)=>`/api/v1/chronic-conditions/${id}`,
        BY_STUDENT: (studentId)=>`/api/v1/students/${studentId}/chronic-conditions`,
        ACTIVE: `/api/v1/chronic-conditions/active`,
        REVIEW_DUE: `/api/v1/chronic-conditions/review-due`
    },
    // ==========================================
    // MEDICATIONS
    // ==========================================
    MEDICATIONS: {
        BASE: `/api/v1/medications`,
        BY_ID: (id)=>`/api/v1/medications/${id}`,
        DETAIL: (id)=>`/api/v1/medications/${id}`,
        ADMINISTER: (id)=>`/api/v1/medications/${id}/administer`,
        DISCONTINUE: (id)=>`/api/v1/medications/${id}/discontinue`,
        REFILL: (id)=>`/api/v1/medications/${id}/refill`,
        MISSED_DOSE: (id)=>`/api/v1/medications/${id}/missed-dose`,
        ADVERSE_REACTION: (id)=>`/api/v1/medications/${id}/adverse-reaction`,
        ADJUST_INVENTORY: (id)=>`/api/v1/medications/${id}/adjust-inventory`,
        REMINDER: (id)=>`/api/v1/medications/${id}/reminder`,
        SCHEDULE: (id)=>`/api/v1/medications/${id}/schedule`,
        INTERACTIONS: (id)=>`/api/v1/medications/${id}/interactions`,
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
        BY_STUDENT: (studentId)=>`/api/v1/students/${studentId}/medications`
    },
    // ==========================================
    // PRESCRIPTIONS
    // ==========================================
    PRESCRIPTIONS: {
        BASE: `/api/v1/prescriptions`,
        BY_ID: (id)=>`/api/v1/prescriptions/${id}`,
        DETAIL: (id)=>`/api/v1/prescriptions/${id}`,
        REFILL: (id)=>`/api/v1/prescriptions/${id}/refill`,
        ACTIVE: `/api/v1/prescriptions/active`,
        EXPIRING: `/api/v1/prescriptions/expiring`
    },
    // ==========================================
    // INVENTORY
    // ==========================================
    INVENTORY: {
        BASE: `/api/v1/inventory`,
        BY_ID: (id)=>`/api/v1/inventory/${id}`,
        DETAIL: (id)=>`/api/v1/inventory/${id}`,
        ADJUST: (id)=>`/api/v1/inventory/${id}/adjust`,
        LOW_STOCK: `/api/v1/inventory/low-stock`,
        EXPIRING: `/api/v1/inventory/expiring`,
        REORDER: `/api/v1/inventory/reorder`,
        AUDIT: `/api/v1/inventory/audit`,
        ITEMS: `/api/v1/inventory/items`,
        ALERTS: `/api/v1/inventory/alerts`,
        ANALYTICS: `/api/v1/inventory/analytics`,
        DASHBOARD: `/api/v1/inventory/dashboard`,
        REPORTS: `/api/v1/inventory/reports`
    },
    // ==========================================
    // ADMINISTRATION LOG
    // ==========================================
    ADMINISTRATION_LOG: {
        BASE: `/api/v1/administration-log`,
        BY_ID: (id)=>`/api/v1/administration-log/${id}`,
        DETAIL: (id)=>`/api/v1/administration-log/${id}`,
        BY_MEDICATION: (medicationId)=>`/api/v1/medications/${medicationId}/administration-log`,
        BY_STUDENT: (studentId)=>`/api/v1/students/${studentId}/administration-log`,
        TODAY: `/api/v1/administration-log/today`,
        MISSED: `/api/v1/administration-log/missed`
    },
    // ==========================================
    // EMERGENCY CONTACTS
    // ==========================================
    EMERGENCY_CONTACTS: {
        BASE: `/api/v1/emergency-contacts`,
        BY_ID: (id)=>`/api/v1/emergency-contacts/${id}`,
        BY_STUDENT: (studentId)=>`/api/v1/students/${studentId}/emergency-contacts`,
        PRIMARY: (studentId)=>`/api/v1/students/${studentId}/emergency-contacts/primary`,
        VERIFY: (id)=>`/api/v1/emergency-contacts/${id}/verify`,
        NOTIFY: (id)=>`/api/v1/emergency-contacts/${id}/notify`
    },
    // ==========================================
    // INCIDENTS
    // ==========================================
    INCIDENTS: {
        BASE: `/api/v1/incident-report`,
        BY_ID: (id)=>`/api/v1/incident-report/${id}`,
        WITNESSES: (incidentId)=>`/api/v1/incident-report/${incidentId}/witnesses`,
        WITNESS_STATEMENT: (incidentId, witnessId)=>`/api/v1/incident-report/${incidentId}/witnesses/${witnessId}/statement`,
        VERIFY_STATEMENT: (statementId)=>`/api/v1/incident-report/statements/${statementId}/verify`,
        FOLLOW_UP: (incidentId)=>`/api/v1/incident-report/${incidentId}/follow-up`,
        FOLLOW_UP_PROGRESS: (followUpId)=>`/api/v1/incident-report/follow-up/${followUpId}/progress`,
        FOLLOW_UP_COMPLETE: (followUpId)=>`/api/v1/incident-report/follow-up/${followUpId}/complete`,
        ANALYTICS: `/api/v1/incident-report/analytics`,
        TRENDING: `/api/v1/incident-report/trending`,
        BY_STUDENT: (studentId)=>`/api/v1/students/${studentId}/incidents`,
        BY_TYPE: (type)=>`/api/v1/incident-report/type/${type}`,
        BY_SEVERITY: (severity)=>`/api/v1/incident-report/severity/${severity}`
    },
    // ==========================================
    // DOCUMENTS
    // ==========================================
    DOCUMENTS: {
        BASE: `/api/v1/documents`,
        BY_ID: (id)=>`/api/v1/documents/${id}`,
        UPLOAD: `/api/v1/documents/upload`,
        DOWNLOAD: (id)=>`/api/v1/documents/${id}/download`,
        PREVIEW: (id)=>`/api/v1/documents/${id}/preview`,
        SIGN: (id)=>`/api/v1/documents/${id}/sign`,
        VERIFY_SIGNATURE: (id)=>`/api/v1/documents/${id}/verify-signature`,
        BY_STUDENT: (studentId)=>`/api/v1/students/${studentId}/documents`,
        BY_TYPE: (type)=>`/api/v1/documents/type/${type}`,
        TEMPLATES: `/api/v1/documents/templates`
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
        EXPORT: `/api/v1/compliance/export`
    },
    AUDIT: {
        LOGS: `/api/v1/audit-logs`,
        BY_ID: (id)=>`/api/v1/audit-logs/${id}`,
        BY_USER: (userId)=>`/api/v1/audit-logs/user/${userId}`,
        BY_RESOURCE: (resourceType, resourceId)=>`/api/v1/audit-logs/resource/${resourceType}/${resourceId}`,
        BY_ACTION: (action)=>`/api/v1/audit-logs/action/${action}`,
        PHI_ACCESS: `/api/v1/audit-logs/phi-access`,
        PHI_ACCESS_LOG: `/api/v1/audit/phi-access`,
        EXPORT: `/api/v1/audit-logs/export`
    },
    // ==========================================
    // COMMUNICATIONS
    // ==========================================
    MESSAGES: {
        BASE: `/api/v1/messages`,
        BY_ID: (id)=>`/api/v1/messages/${id}`,
        SEND: `/api/v1/messages/send`,
        INBOX: `/api/v1/messages/inbox`,
        SENT: `/api/v1/messages/sent`,
        UNREAD: `/api/v1/messages/unread`,
        MARK_READ: (id)=>`/api/v1/messages/${id}/mark-read`,
        MARK_UNREAD: (id)=>`/api/v1/messages/${id}/mark-unread`,
        DELETE: (id)=>`/api/v1/messages/${id}`,
        THREAD: (id)=>`/api/v1/messages/thread/${id}`,
        ATTACHMENTS: (id)=>`/api/v1/messages/${id}/attachments`
    },
    BROADCASTS: {
        BASE: `/api/v1/broadcasts`,
        BY_ID: (id)=>`/api/v1/broadcasts/${id}`,
        SEND: `/api/v1/broadcasts/send`,
        SCHEDULE: `/api/v1/broadcasts/schedule`,
        RECIPIENTS: (id)=>`/api/v1/broadcasts/${id}/recipients`,
        CANCEL: (id)=>`/api/v1/broadcasts/${id}/cancel`,
        DUPLICATE: (id)=>`/api/v1/broadcasts/${id}/duplicate`,
        DELIVERY_STATUS: (id)=>`/api/v1/broadcasts/${id}/delivery-status`,
        DRAFTS: `/api/v1/broadcasts/drafts`,
        SCHEDULED: `/api/v1/broadcasts/scheduled`
    },
    ALERTS: {
        BASE: `/api/v1/alerts`,
        BY_ID: (id)=>`/api/v1/alerts/${id}`,
        ACTIVE: `/api/v1/alerts/active`,
        ACKNOWLEDGE: (id)=>`/api/v1/alerts/${id}/acknowledge`,
        DISMISS: (id)=>`/api/v1/alerts/${id}/dismiss`,
        MEDICATION_REMINDERS: `/api/v1/alerts/medication-reminders`,
        APPOINTMENT_REMINDERS: `/api/v1/alerts/appointment-reminders`,
        EMERGENCY: `/api/v1/alerts/emergency`,
        BY_TYPE: (type)=>`/api/v1/alerts/type/${type}`
    },
    NOTIFICATIONS: {
        BASE: `/api/v1/notifications`,
        BY_ID: (id)=>`/api/v1/notifications/${id}`,
        UNREAD: `/api/v1/notifications/unread`,
        MARK_READ: (id)=>`/api/v1/notifications/${id}/mark-read`,
        MARK_ALL_READ: `/api/v1/notifications/mark-all-read`,
        PREFERENCES: `/api/v1/notifications/preferences`,
        TEST_PUSH: `/api/v1/notifications/test-push`,
        PUSH_SUBSCRIBE: `/api/v1/notifications/push-subscribe`,
        PUSH_UNSUBSCRIBE: `/api/v1/notifications/push-unsubscribe`,
        PUSH_SUBSCRIPTION: `/api/v1/notifications/push-subscription`
    },
    CONVERSATIONS: {
        BASE: `/api/v1/conversations`,
        BY_ID: (id)=>`/api/v1/conversations/${id}`,
        BY_USER: (userId)=>`/api/v1/conversations/user/${userId}`,
        MESSAGES: (conversationId)=>`/api/v1/conversations/${conversationId}/messages`,
        PARTICIPANTS: (conversationId)=>`/api/v1/conversations/${conversationId}/participants`,
        ADD_PARTICIPANT: (conversationId)=>`/api/v1/conversations/${conversationId}/participants`,
        REMOVE_PARTICIPANT: (conversationId, userId)=>`/api/v1/conversations/${conversationId}/participants/${userId}`,
        ARCHIVE: (id)=>`/api/v1/conversations/${id}/archive`,
        UNARCHIVE: (id)=>`/api/v1/conversations/${id}/unarchive`
    },
    TEMPLATES: {
        BASE: `/api/v1/templates`,
        BY_ID: (id)=>`/api/v1/templates/${id}`,
        BY_CATEGORY: (category)=>`/api/v1/templates/category/${category}`,
        RENDER: (id)=>`/api/v1/templates/${id}/render`,
        CATEGORIES: `/api/v1/templates/categories`
    },
    // ==========================================
    // DASHBOARD
    // ==========================================
    DASHBOARD: {
        STATS: `/api/v1/dashboard/stats`,
        RECENT_ACTIVITIES: `/api/v1/dashboard/recent-activities`,
        UPCOMING_APPOINTMENTS: `/api/v1/dashboard/upcoming-appointments`,
        CHART_DATA: `/api/v1/dashboard/chart-data`,
        WIDGETS: (dashboardId)=>`/api/v1/dashboard/${dashboardId}/widgets`,
        REFRESH: `/api/v1/dashboard/refresh-cache`
    },
    // ==========================================
    // ANALYTICS & REPORTING
    // ==========================================
    ANALYTICS: {
        METRICS: `/api/v1/analytics/metrics`,
        DASHBOARD: `/api/v1/analytics/dashboard`,
        DASHBOARD_WIDGETS: (dashboardId)=>`/api/v1/analytics/dashboard/${dashboardId}/widgets`,
        REPORTS: `/api/v1/analytics/reports`,
        CHART_DATA: `/api/v1/analytics/chart-data`,
        HEALTH_METRICS: `/api/v1/analytics/health-metrics`,
        MEDICATION_COMPLIANCE: `/api/v1/analytics/medication-compliance`,
        APPOINTMENT_METRICS: `/api/v1/analytics/appointment-metrics`,
        INCIDENT_ANALYTICS: `/api/v1/analytics/incident-analytics`,
        CUSTOM_REPORT: `/api/v1/analytics/custom-report`
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
        SHARE: (reportId)=>`/api/v1/reports/${reportId}/share`,
        // Health Trend Analysis
        HEALTH_TRENDS: `/api/v1/reports/health-trends`,
        HEALTH_TRENDS_BY_CATEGORY: (category)=>`/api/v1/reports/health-trends/${category}`,
        // Medication Reports
        MEDICATIONS: {
            ADMINISTRATION: `/api/v1/reports/medications/administration`,
            COMPLIANCE: `/api/v1/reports/medications/compliance`,
            EXPIRATION: `/api/v1/reports/medications/expiration`,
            INVENTORY: `/api/v1/reports/medications/inventory`,
            REFILLS: `/api/v1/reports/medications/refills`,
            USAGE: `/api/v1/reports/medication-usage`,
            EFFECTIVENESS: `/api/v1/reports/medication-effectiveness`
        },
        // Immunization Reports
        IMMUNIZATIONS: {
            COMPLIANCE: `/api/v1/reports/immunizations/compliance`,
            DUE: `/api/v1/reports/immunizations/due`,
            OVERDUE: `/api/v1/reports/immunizations/overdue`,
            EXEMPTIONS: `/api/v1/reports/immunizations/exemptions`
        },
        // Appointment Reports
        APPOINTMENTS: {
            ATTENDANCE: `/api/v1/reports/appointments/attendance`,
            NO_SHOWS: `/api/v1/reports/appointments/no-shows`,
            CANCELLATIONS: `/api/v1/reports/appointments/cancellations`
        },
        // Incident Reports
        INCIDENTS: {
            SUMMARY: `/api/v1/reports/incidents/summary`,
            BY_TYPE: `/api/v1/reports/incidents/by-type`,
            TRENDS: `/api/v1/reports/incidents/trends`,
            STATISTICS: `/api/v1/reports/incident-statistics`,
            BY_LOCATION: `/api/v1/reports/incidents-by-location`
        },
        // Student Reports
        STUDENTS: {
            ENROLLMENT: `/api/v1/reports/students/enrollment`,
            HEALTH_SUMMARY: `/api/v1/reports/students/health-summary`,
            DEMOGRAPHICS: `/api/v1/reports/students/demographics`
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
        COMPLIANCE_AUDIT: `/api/v1/reports/compliance/audit`
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
        RESTORE: `/api/v1/system/restore`
    },
    // ==========================================
    // ADMIN - District, School, User Management
    // ==========================================
    ADMIN: {
        // System Settings
        SETTINGS: `/api/v1/administration/settings`,
        // Users
        USERS: `/api/v1/users`,
        USER_BY_ID: (id)=>`/api/v1/users/${id}`,
        // Districts
        DISTRICTS: `/api/v1/administration/districts`,
        DISTRICT_BY_ID: (id)=>`/api/v1/administration/districts/${id}`,
        // Schools
        SCHOOLS: `/api/v1/administration/schools`,
        SCHOOL_BY_ID: (id)=>`/api/v1/administration/schools/${id}`,
        // System Health
        SYSTEM_HEALTH: `/api/v1/admin/system/health`,
        // Backups
        BACKUPS: `/api/v1/administration/backups`,
        BACKUP_BY_ID: (id)=>`/api/v1/administration/backups/${id}`,
        // Licenses
        LICENSES: `/api/v1/administration/licenses`,
        LICENSE_BY_ID: (id)=>`/api/v1/administration/licenses/${id}`,
        LICENSE_DEACTIVATE: (id)=>`/api/v1/administration/licenses/${id}/deactivate`,
        // Configurations
        CONFIGURATIONS: `/api/v1/administration/config`,
        CONFIGURATION_BY_KEY: (key)=>`/api/v1/administration/config/${key}`,
        // Performance Metrics
        METRICS: `/api/v1/admin/metrics`,
        METRIC_BY_ID: (id)=>`/api/v1/admin/metrics/${id}`,
        // Training
        TRAINING: `/api/v1/admin/training`,
        TRAINING_BY_ID: (id)=>`/api/v1/admin/training/${id}`,
        TRAINING_COMPLETE: (id)=>`/api/v1/admin/training/${id}/complete`,
        TRAINING_PROGRESS: (userId)=>`/api/v1/admin/training/progress/${userId}`,
        // Audit Logs
        AUDIT_LOGS: `/api/v1/administration/audit-logs`,
        AUDIT_LOG_BY_ID: (id)=>`/api/v1/administration/audit-logs/${id}`
    },
    INTEGRATIONS: {
        BASE: `/api/v1/integrations`,
        BY_ID: (id)=>`/api/v1/integrations/${id}`,
        CONFIGURE: (id)=>`/api/v1/integrations/${id}/configure`,
        TEST: (id)=>`/api/v1/integrations/${id}/test`,
        SYNC: (id)=>`/api/v1/integrations/${id}/sync`,
        ENABLE: (id)=>`/api/v1/integrations/${id}/enable`,
        DISABLE: (id)=>`/api/v1/integrations/${id}/disable`,
        LOGS: (id)=>`/api/v1/integrations/${id}/logs`
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
        STATUS: `/api/v1/mfa/status`
    },
    // ==========================================
    // APPOINTMENT WAITLIST
    // ==========================================
    WAITLIST: {
        BASE: `/api/v1/waitlist`,
        BY_ID: (id)=>`/api/v1/waitlist/${id}`,
        ADD: `/api/v1/waitlist/add`,
        REMOVE: (id)=>`/api/v1/waitlist/${id}/remove`,
        POSITION: (id)=>`/api/v1/waitlist/${id}/position`,
        NOTIFY: (id)=>`/api/v1/waitlist/${id}/notify`,
        UPDATE_PRIORITY: (id)=>`/api/v1/waitlist/${id}/priority`,
        BY_STUDENT: (studentId)=>`/api/v1/waitlist/student/${studentId}`,
        BY_NURSE: (nurseId)=>`/api/v1/waitlist/nurse/${nurseId}`
    },
    // ==========================================
    // NURSE AVAILABILITY & SCHEDULING
    // ==========================================
    NURSE_AVAILABILITY: {
        BASE: `/api/v1/nurse-availability`,
        BY_ID: (id)=>`/api/v1/nurse-availability/${id}`,
        BY_NURSE: (nurseId)=>`/api/v1/nurse-availability/nurse/${nurseId}`,
        SLOTS: `/api/v1/nurse-availability/slots`,
        SET: `/api/v1/nurse-availability/set`,
        UPDATE: (id)=>`/api/v1/nurse-availability/${id}`,
        DELETE: (id)=>`/api/v1/nurse-availability/${id}`,
        BY_DATE: (date)=>`/api/v1/nurse-availability/date/${date}`,
        CHECK_CONFLICTS: `/api/v1/nurse-availability/check-conflicts`
    },
    // ==========================================
    // FORMS
    // ==========================================
    FORMS: {
        BASE: `/api/v1/forms`,
        BY_ID: (id)=>`/api/v1/forms/${id}`,
        TEMPLATES: `/api/v1/forms/templates`,
        SUBMIT: `/api/v1/forms/submit`,
        RESPONSES: (formId)=>`/api/v1/forms/${formId}/responses`,
        SUBMISSIONS: (formId)=>`/api/v1/forms/${formId}/submissions`,
        EXPORT: (formId)=>`/api/v1/forms/${formId}/export`
    },
    // ==========================================
    // PURCHASE ORDERS & PROCUREMENT
    // ==========================================
    PURCHASE_ORDERS: {
        BASE: `/api/v1/purchase-orders`,
        BY_ID: (id)=>`/api/v1/purchase-orders/${id}`,
        APPROVE: (id)=>`/api/v1/purchase-orders/${id}/approve`,
        REJECT: (id)=>`/api/v1/purchase-orders/${id}/reject`,
        RECEIVE: (id)=>`/api/v1/purchase-orders/${id}/receive`,
        RECEIVE_ITEMS: (id)=>`/api/v1/purchase-orders/${id}/receive-items`,
        CANCEL: (id)=>`/api/v1/purchase-orders/${id}/cancel`,
        STATISTICS: `/api/v1/purchase-orders/statistics`,
        PENDING: `/api/v1/purchase-orders/pending`,
        APPROVED: `/api/v1/purchase-orders/approved`,
        RECEIVED: `/api/v1/purchase-orders/received`,
        BY_VENDOR: (vendorId)=>`/api/v1/purchase-orders/vendor/${vendorId}`,
        REORDER_ITEMS: `/api/v1/purchase-orders/reorder-items`,
        VENDOR_HISTORY: (vendorId)=>`/api/v1/purchase-orders/vendor/${vendorId}/history`
    },
    // ==========================================
    // BILLING & FINANCIAL MANAGEMENT
    // ==========================================
    BILLING: {
        // Invoices
        INVOICES: `/api/v1/billing/invoices`,
        INVOICE_BY_ID: (id)=>`/api/v1/billing/invoices/${id}`,
        INVOICE_PDF: (id)=>`/api/v1/billing/invoices/${id}/pdf`,
        INVOICE_SEND: (id)=>`/api/v1/billing/invoices/${id}/send`,
        INVOICE_VOID: (id)=>`/api/v1/billing/invoices/${id}/void`,
        // Payments
        PAYMENTS: `/api/v1/billing/payments`,
        PAYMENT_BY_ID: (id)=>`/api/v1/billing/payments/${id}`,
        PAYMENT_REFUND: (id)=>`/api/v1/billing/payments/${id}/refund`,
        PAYMENT_VOID: (id)=>`/api/v1/billing/payments/${id}/void`,
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
        SEND_STATEMENT: `/api/v1/billing/notifications/statement`
    },
    // ==========================================
    // BUDGET MANAGEMENT
    // ==========================================
    BUDGET: {
        // Budget Categories
        CATEGORIES: `/api/v1/budget/categories`,
        CATEGORY_BY_ID: (id)=>`/api/v1/budget/categories/${id}`,
        // Budget Summary
        SUMMARY: `/api/v1/budget/summary`,
        // Budget Transactions
        TRANSACTIONS: `/api/v1/budget/transactions`,
        TRANSACTION_BY_ID: (id)=>`/api/v1/budget/transactions/${id}`,
        // Analytics & Reporting
        TRENDS: `/api/v1/budget/trends`,
        YEAR_COMPARISON: `/api/v1/budget/year-comparison`,
        OVER_BUDGET: `/api/v1/budget/over-budget`,
        RECOMMENDATIONS: `/api/v1/budget/recommendations`,
        EXPORT: `/api/v1/budget/export`
    },
    // ==========================================
    // VENDORS
    // ==========================================
    VENDORS: {
        BASE: `/api/v1/vendors`,
        BY_ID: (id)=>`/api/v1/vendors/${id}`,
        SEARCH: (query)=>`/api/v1/vendors/search/${encodeURIComponent(query)}`,
        COMPARE: (itemName)=>`/api/v1/vendors/compare/${encodeURIComponent(itemName)}`,
        TOP: `/api/v1/vendors/top`,
        STATISTICS: `/api/v1/vendors/statistics`,
        REACTIVATE: (id)=>`/api/v1/vendors/${id}/reactivate`,
        RATING: (id)=>`/api/v1/vendors/${id}/rating`,
        BULK_RATINGS: `/api/v1/vendors/ratings/bulk`,
        BY_PAYMENT_TERMS: (terms)=>`/api/v1/vendors/payment-terms/${encodeURIComponent(terms)}`,
        METRICS: (id)=>`/api/v1/vendors/${id}/metrics`,
        PERMANENT_DELETE: (id)=>`/api/v1/vendors/${id}/permanent`
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
        SECURITY: `/api/v1/settings/security`
    }
};
const HTTP_STATUS = {
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
    GATEWAY_TIMEOUT: 504
};
const __TURBOPACK__default__export__ = API_ENDPOINTS;
}),
"[project]/src/lib/cache/constants.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @fileoverview Cache Configuration Constants
 * @module lib/cache/constants
 *
 * Standardized cache TTL (Time To Live) configuration for the application.
 * Implements a tiered caching strategy based on data sensitivity and freshness requirements.
 *
 * **HIPAA Compliance:**
 * - PHI data has shorter TTLs (30-60s) to minimize stale data exposure
 * - Static data can cache longer (300s) for performance
 * - All cache keys use IDs only, never PHI values
 *
 * **Performance Strategy:**
 * - Aggressive caching for static reference data
 * - Conservative caching for frequently changing data
 * - Minimal caching for real-time data
 *
 * @see DATABASE_INTEGRATION_AUDIT_REPORT.md for detailed caching strategy
 * @version 1.0.0
 * @since 2025-10-27
 */ // ==========================================
// CACHE TTL CONSTANTS (seconds)
// ==========================================
/**
 * Cache Time-To-Live Configuration
 *
 * All values in seconds. Aligned with Next.js `revalidate` API.
 *
 * **Tier Breakdown:**
 * - **STATIC**: Reference data that rarely changes (schools, districts, medication formulary)
 * - **STATS**: Aggregated statistics (non-PHI dashboard data)
 * - **PHI_FREQUENT**: Frequently accessed PHI (active medications, today's appointments)
 * - **PHI_STANDARD**: Standard PHI access (student lists, health records lists)
 * - **SESSION**: User session data (profile, preferences)
 * - **REALTIME**: Real-time data (notifications, unread messages)
 */ __turbopack_context__.s([
    "CACHE_TAGS",
    ()=>CACHE_TAGS,
    "CACHE_TTL",
    ()=>CACHE_TTL,
    "buildResourceTag",
    ()=>buildResourceTag,
    "default",
    ()=>__TURBOPACK__default__export__,
    "getCacheTTL",
    ()=>getCacheTTL,
    "getCacheTags",
    ()=>getCacheTags
]);
const CACHE_TTL = {
    /**
   * Static reference data - rarely changes
   * Examples: Schools, districts, medication formulary, form templates
   * TTL: 5 minutes (300 seconds)
   */ STATIC: 300,
    /**
   * Aggregated statistics - non-PHI
   * Examples: Dashboard stats, analytics, reports
   * TTL: 2 minutes (120 seconds)
   */ STATS: 120,
    /**
   * PHI data - frequently accessed
   * Examples: Active medications, today's appointments, recent health alerts
   * TTL: 30 seconds
   * Rationale: High-sensitivity data that changes frequently
   */ PHI_FREQUENT: 30,
    /**
   * PHI data - standard access
   * Examples: Student lists, health records lists, incident lists
   * TTL: 1 minute (60 seconds)
   * Rationale: Moderate sensitivity, reasonable freshness for list views
   */ PHI_STANDARD: 60,
    /**
   * User session data
   * Examples: Current user profile, user preferences, role permissions
   * TTL: 5 minutes (300 seconds)
   * Rationale: Rarely changes during session, safe to cache
   */ SESSION: 300,
    /**
   * Real-time data - minimal caching
   * Examples: Notifications, unread message counts, active alerts
   * TTL: 10 seconds
   * Rationale: Needs near real-time updates
   */ REALTIME: 10,
    /**
   * No caching - always fetch fresh
   * Use for critical operations or data that must always be fresh
   * TTL: 0 (forces revalidation)
   */ NO_CACHE: 0
};
const CACHE_TAGS = {
    // ==========================================
    // PHI TAGS (HIPAA-protected data)
    // ==========================================
    /**
   * General PHI data tag
   * Use to invalidate all PHI-related caches
   */ PHI: 'phi-data',
    /**
   * Student data (PHI)
   */ STUDENTS: 'students',
    /**
   * Medication data (PHI)
   */ MEDICATIONS: 'medications',
    /**
   * Health record data (PHI)
   */ HEALTH_RECORDS: 'health-records',
    /**
   * Appointment data (PHI)
   */ APPOINTMENTS: 'appointments',
    /**
   * Incident report data (PHI)
   */ INCIDENTS: 'incidents',
    /**
   * Immunization data (PHI)
   */ IMMUNIZATIONS: 'immunizations',
    /**
   * Allergy data (PHI)
   */ ALLERGIES: 'allergies',
    /**
   * Emergency contact data (PHI)
   */ EMERGENCY_CONTACTS: 'emergency-contacts',
    // ==========================================
    // NON-PHI TAGS
    // ==========================================
    /**
   * User account data (non-PHI)
   */ USERS: 'users',
    /**
   * School data (non-PHI)
   */ SCHOOLS: 'schools',
    /**
   * District data (non-PHI)
   */ DISTRICTS: 'districts',
    /**
   * Dashboard statistics (non-PHI aggregated)
   */ STATS: 'statistics',
    /**
   * Analytics data (non-PHI aggregated)
   */ ANALYTICS: 'analytics',
    /**
   * Notification data
   */ NOTIFICATIONS: 'notifications',
    /**
   * Document templates (non-PHI)
   */ TEMPLATES: 'templates',
    /**
   * Medication formulary (non-PHI)
   */ FORMULARY: 'medication-formulary',
    /**
   * Admin user data (non-PHI)
   */ ADMIN_USERS: 'admin-users',
    /**
   * Admin districts data (non-PHI)
   */ ADMIN_DISTRICTS: 'admin-districts',
    /**
   * Admin schools data (non-PHI)
   */ ADMIN_SCHOOLS: 'admin-schools',
    /**
   * Admin settings data (non-PHI)
   */ ADMIN_SETTINGS: 'admin-settings',
    /**
   * Admin licenses data (non-PHI)
   */ ADMIN_LICENSES: 'admin-licenses',
    /**
   * Admin backups data (non-PHI)
   */ ADMIN_BACKUPS: 'admin-backups',
    /**
   * Admin metrics data (non-PHI)
   */ ADMIN_METRICS: 'admin-metrics',
    /**
   * Admin training data (non-PHI)
   */ ADMIN_TRAINING: 'admin-training',
    /**
   * Admin audit logs data (non-PHI)
   */ ADMIN_AUDIT_LOGS: 'admin-audit-logs'
};
function getCacheTTL(resourceType, isPHI, isFrequentlyAccessed = false) {
    if (!isPHI) {
        // Non-PHI data
        if (resourceType === 'users' || resourceType === 'schools' || resourceType === 'districts') {
            return CACHE_TTL.STATIC;
        }
        if (resourceType === 'statistics' || resourceType === 'analytics') {
            return CACHE_TTL.STATS;
        }
        if (resourceType === 'notifications') {
            return CACHE_TTL.REALTIME;
        }
        return CACHE_TTL.SESSION; // Default for non-PHI
    }
    // PHI data
    if (isFrequentlyAccessed) {
        return CACHE_TTL.PHI_FREQUENT;
    }
    return CACHE_TTL.PHI_STANDARD;
}
function getCacheTags(resourceType, isPHI = true) {
    const tags = [];
    // Add resource-specific tag
    if (resourceType === 'students') {
        tags.push(CACHE_TAGS.STUDENTS);
    } else if (resourceType === 'medications') {
        tags.push(CACHE_TAGS.MEDICATIONS);
    } else if (resourceType === 'health-records') {
        tags.push(CACHE_TAGS.HEALTH_RECORDS);
    } else if (resourceType === 'appointments') {
        tags.push(CACHE_TAGS.APPOINTMENTS);
    } else if (resourceType === 'incidents') {
        tags.push(CACHE_TAGS.INCIDENTS);
    } else if (resourceType === 'users') {
        tags.push(CACHE_TAGS.USERS);
    } else if (resourceType === 'statistics') {
        tags.push(CACHE_TAGS.STATS);
    }
    // Add PHI tag if applicable
    if (isPHI) {
        tags.push(CACHE_TAGS.PHI);
    }
    return tags;
}
function buildResourceTag(resourceType, resourceId) {
    return `${resourceType}-${resourceId}`;
}
// ==========================================
// DOCUMENTATION
// ==========================================
/**
 * Cache Strategy Documentation
 *
 * **Decision Framework:**
 *
 * 1. **Is it PHI?**
 *    - YES → Use PHI_FREQUENT (30s) or PHI_STANDARD (60s)
 *    - NO → Continue to #2
 *
 * 2. **How often does it change?**
 *    - Rarely (reference data) → STATIC (300s)
 *    - Moderately (aggregated stats) → STATS (120s)
 *    - Frequently (real-time) → REALTIME (10s)
 *
 * 3. **Is it user-specific?**
 *    - YES → SESSION (300s)
 *    - NO → Use type-based TTL
 *
 * **HIPAA Compliance Notes:**
 * - All PHI cache entries MUST have tags for invalidation
 * - Cache keys MUST NOT contain PHI values (use IDs only)
 * - PHI caches MUST be cleared on user logout
 * - Audit logging required for PHI cache access
 *
 * **Performance Guidelines:**
 * - Prefer longer TTLs for static data (reduces backend load)
 * - Use shorter TTLs for PHI (compliance requirement)
 * - Always tag caches for granular invalidation
 * - Monitor cache hit rates and adjust TTLs accordingly
 *
 * **Examples:**
 *
 * ```typescript
 * // Example 1: Fetch student list (PHI, standard access)
 * const students = await fetch('/api/students', {
 *   next: {
 *     revalidate: CACHE_TTL.PHI_STANDARD, // 60s
 *     tags: [CACHE_TAGS.STUDENTS, CACHE_TAGS.PHI]
 *   }
 * });
 *
 * // Example 2: Fetch medication formulary (non-PHI, static)
 * const formulary = await fetch('/api/medications/formulary', {
 *   next: {
 *     revalidate: CACHE_TTL.STATIC, // 300s
 *     tags: [CACHE_TAGS.FORMULARY]
 *   }
 * });
 *
 * // Example 3: Fetch today's appointments (PHI, frequent)
 * const appointments = await fetch('/api/appointments/today', {
 *   next: {
 *     revalidate: CACHE_TTL.PHI_FREQUENT, // 30s
 *     tags: [CACHE_TAGS.APPOINTMENTS, CACHE_TAGS.PHI]
 *   }
 * });
 *
 * // Example 4: Fetch current user (non-PHI, session)
 * const user = await fetch('/api/auth/me', {
 *   next: {
 *     revalidate: CACHE_TTL.SESSION, // 300s
 *     tags: [CACHE_TAGS.USERS]
 *   }
 * });
 * ```
 */ // Export all constants and utilities
const cacheConstants = {
    CACHE_TTL,
    CACHE_TAGS,
    getCacheTTL,
    getCacheTags,
    buildResourceTag
};
const __TURBOPACK__default__export__ = cacheConstants;
}),
"[project]/src/lib/audit.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * HIPAA-compliant audit logging utilities
 * Tracks all PHI access and modifications for compliance
 */ __turbopack_context__.s([
    "AUDIT_ACTIONS",
    ()=>AUDIT_ACTIONS,
    "PHI_ACTIONS",
    ()=>PHI_ACTIONS,
    "auditLog",
    ()=>auditLog,
    "auditLogWithContext",
    ()=>auditLogWithContext,
    "createAuditContext",
    ()=>createAuditContext,
    "createAuditContextFromServer",
    ()=>createAuditContextFromServer,
    "extractIPAddress",
    ()=>extractIPAddress,
    "extractUserAgent",
    ()=>extractUserAgent,
    "getClientIP",
    ()=>getClientIP,
    "getUserAgent",
    ()=>getUserAgent,
    "logPHIAccess",
    ()=>logPHIAccess,
    "parseUserAgent",
    ()=>parseUserAgent
]);
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';
async function auditLog(entry) {
    try {
        // Send audit log to backend service
        await fetch(`${BACKEND_URL}/api/audit/log`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: entry.userId,
                action: entry.action,
                entityType: entry.resource,
                entityId: entry.resourceId,
                changes: entry.changes || {
                    details: entry.details,
                    success: entry.success !== undefined ? entry.success : true,
                    errorMessage: entry.errorMessage
                },
                ipAddress: entry.ipAddress,
                userAgent: entry.userAgent
            })
        });
    } catch (error) {
        // Audit logging should never break the main flow
        // Log to console for debugging but don't throw
        console.error('Audit log failed:', error);
    }
}
const PHI_ACTIONS = {
    VIEW: 'VIEW_PHI',
    CREATE: 'CREATE_PHI',
    UPDATE: 'UPDATE_PHI',
    DELETE: 'DELETE_PHI',
    EXPORT: 'EXPORT_PHI',
    PRINT: 'PRINT_PHI'
};
async function logPHIAccess(entry) {
    await auditLog({
        ...entry,
        action: PHI_ACTIONS[entry.action]
    });
}
const AUDIT_ACTIONS = {
    // Authentication
    LOGIN: 'USER_LOGIN',
    LOGOUT: 'USER_LOGOUT',
    LOGIN_FAILED: 'LOGIN_FAILED',
    TOKEN_REFRESH: 'TOKEN_REFRESH',
    PASSWORD_CHANGE: 'PASSWORD_CHANGE',
    // Students
    VIEW_STUDENT: 'VIEW_STUDENT',
    CREATE_STUDENT: 'CREATE_STUDENT',
    UPDATE_STUDENT: 'UPDATE_STUDENT',
    DELETE_STUDENT: 'DELETE_STUDENT',
    LIST_STUDENTS: 'LIST_STUDENTS',
    // Health Records
    VIEW_HEALTH_RECORD: 'VIEW_HEALTH_RECORD',
    CREATE_HEALTH_RECORD: 'CREATE_HEALTH_RECORD',
    UPDATE_HEALTH_RECORD: 'UPDATE_HEALTH_RECORD',
    DELETE_HEALTH_RECORD: 'DELETE_HEALTH_RECORD',
    // Medications
    VIEW_MEDICATION: 'VIEW_MEDICATION',
    CREATE_MEDICATION: 'CREATE_MEDICATION',
    UPDATE_MEDICATION: 'UPDATE_MEDICATION',
    DELETE_MEDICATION: 'DELETE_MEDICATION',
    ADMINISTER_MEDICATION: 'ADMINISTER_MEDICATION',
    // Appointments
    VIEW_APPOINTMENT: 'VIEW_APPOINTMENT',
    LIST_APPOINTMENTS: 'LIST_APPOINTMENTS',
    CREATE_APPOINTMENT: 'CREATE_APPOINTMENT',
    UPDATE_APPOINTMENT: 'UPDATE_APPOINTMENT',
    DELETE_APPOINTMENT: 'DELETE_APPOINTMENT',
    RESCHEDULE_APPOINTMENT: 'RESCHEDULE_APPOINTMENT',
    CANCEL_APPOINTMENT: 'CANCEL_APPOINTMENT',
    COMPLETE_APPOINTMENT: 'COMPLETE_APPOINTMENT',
    CONFIRM_APPOINTMENT: 'CONFIRM_APPOINTMENT',
    NO_SHOW_APPOINTMENT: 'NO_SHOW_APPOINTMENT',
    SEND_APPOINTMENT_REMINDER: 'SEND_APPOINTMENT_REMINDER',
    // Incidents
    VIEW_INCIDENT: 'VIEW_INCIDENT',
    CREATE_INCIDENT: 'CREATE_INCIDENT',
    UPDATE_INCIDENT: 'UPDATE_INCIDENT',
    DELETE_INCIDENT: 'DELETE_INCIDENT',
    // Documents
    VIEW_DOCUMENT: 'VIEW_DOCUMENT',
    UPLOAD_DOCUMENT: 'UPLOAD_DOCUMENT',
    DOWNLOAD_DOCUMENT: 'DOWNLOAD_DOCUMENT',
    DELETE_DOCUMENT: 'DELETE_DOCUMENT',
    CREATE_DOCUMENT: 'CREATE_DOCUMENT',
    UPDATE_DOCUMENT: 'UPDATE_DOCUMENT',
    SIGN_DOCUMENT: 'SIGN_DOCUMENT',
    SHARE_DOCUMENT: 'SHARE_DOCUMENT',
    // PHI Records
    CREATE_PHI_RECORD: 'CREATE_PHI_RECORD',
    ACCESS_PHI_RECORD: 'ACCESS_PHI_RECORD',
    // User Management
    CREATE_USER: 'CREATE_USER',
    UPDATE_USER: 'UPDATE_USER',
    DELETE_USER: 'DELETE_USER',
    // Organization Management
    CREATE_ORGANIZATION: 'CREATE_ORGANIZATION',
    UPDATE_ORGANIZATION: 'UPDATE_ORGANIZATION',
    // Configuration
    UPDATE_CONFIGURATION: 'UPDATE_CONFIGURATION',
    // Reports
    GENERATE_REPORT: 'GENERATE_REPORT',
    EXPORT_DATA: 'EXPORT_DATA'
};
function extractIPAddress(request) {
    // Check various headers for IP address
    const headersList = [
        'x-forwarded-for',
        'x-real-ip',
        'cf-connecting-ip'
    ];
    const headers = 'headers' in request ? request.headers : request;
    for (const header of headersList){
        const value = headers.get(header);
        if (value) {
            // x-forwarded-for can contain multiple IPs, take the first one
            return value.split(',')[0].trim();
        }
    }
    return undefined;
}
function extractUserAgent(request) {
    const headers = 'headers' in request ? request.headers : request;
    return headers.get('user-agent') || undefined;
}
function createAuditContext(request, userId) {
    return {
        userId,
        ipAddress: extractIPAddress(request),
        userAgent: extractUserAgent(request)
    };
}
async function getClientIP() {
    try {
        const { headers } = await __turbopack_context__.A("[project]/node_modules/next/headers.js [app-rsc] (ecmascript, async loader)");
        const headersList = await headers();
        // Check common headers for IP
        const ipHeaders = [
            'x-forwarded-for',
            'x-real-ip',
            'cf-connecting-ip',
            'x-client-ip',
            'x-cluster-client-ip'
        ];
        for (const header of ipHeaders){
            const value = headersList.get(header);
            if (value) {
                // x-forwarded-for can contain multiple IPs, take the first one
                return value.split(',')[0].trim();
            }
        }
        return undefined;
    } catch (error) {
        // headers() might not be available in all contexts
        return undefined;
    }
}
async function getUserAgent() {
    try {
        const { headers } = await __turbopack_context__.A("[project]/node_modules/next/headers.js [app-rsc] (ecmascript, async loader)");
        const headersList = await headers();
        return headersList.get('user-agent') || undefined;
    } catch (error) {
        // headers() might not be available in all contexts
        return undefined;
    }
}
async function createAuditContextFromServer(userId) {
    return {
        userId,
        ipAddress: await getClientIP(),
        userAgent: await getUserAgent()
    };
}
async function auditLogWithContext(entry) {
    const context = await createAuditContextFromServer(entry.userId);
    await auditLog({
        ...entry,
        ipAddress: context.ipAddress,
        userAgent: context.userAgent
    });
}
function parseUserAgent(userAgent) {
    const ua = userAgent.toLowerCase();
    // Detect browser
    let browser = 'Unknown';
    if (ua.includes('chrome')) browser = 'Chrome';
    else if (ua.includes('firefox')) browser = 'Firefox';
    else if (ua.includes('safari')) browser = 'Safari';
    else if (ua.includes('edge')) browser = 'Edge';
    else if (ua.includes('opera')) browser = 'Opera';
    // Detect OS
    let os = 'Unknown';
    if (ua.includes('windows')) os = 'Windows';
    else if (ua.includes('mac')) os = 'macOS';
    else if (ua.includes('linux')) os = 'Linux';
    else if (ua.includes('android')) os = 'Android';
    else if (ua.includes('ios') || ua.includes('iphone') || ua.includes('ipad')) os = 'iOS';
    // Detect device
    let device = 'Desktop';
    if (ua.includes('mobile') || ua.includes('android')) device = 'Mobile';
    else if (ua.includes('tablet') || ua.includes('ipad')) device = 'Tablet';
    return {
        browser,
        os,
        device
    };
}
}),
"[externals]/buffer [external] (buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[project]/src/identity-access/lib/config/roles.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Centralized Role Configuration
 *
 * Single source of truth for role hierarchy and role-related types.
 * Used across the application for consistent role handling.
 *
 * @module lib/config/roles
 * @since 2025-11-04
 */ /**
 * System roles enum
 * Represents all user roles in the system
 */ __turbopack_context__.s([
    "ROLE_HIERARCHY",
    ()=>ROLE_HIERARCHY,
    "UserRole",
    ()=>UserRole,
    "compareRoles",
    ()=>compareRoles,
    "formatRoleName",
    ()=>formatRoleName,
    "getRoleLevel",
    ()=>getRoleLevel,
    "getRolesAbove",
    ()=>getRolesAbove,
    "getRolesBelow",
    ()=>getRolesBelow,
    "hasMinimumRole",
    ()=>hasMinimumRole,
    "isValidRole",
    ()=>isValidRole
]);
var UserRole = /*#__PURE__*/ function(UserRole) {
    UserRole["SUPER_ADMIN"] = "SUPER_ADMIN";
    UserRole["ADMIN"] = "ADMIN";
    UserRole["DISTRICT_ADMIN"] = "DISTRICT_ADMIN";
    UserRole["SCHOOL_ADMIN"] = "SCHOOL_ADMIN";
    UserRole["SCHOOL_NURSE"] = "SCHOOL_NURSE";
    UserRole["NURSE"] = "NURSE";
    UserRole["OFFICE_STAFF"] = "OFFICE_STAFF";
    UserRole["STAFF"] = "STAFF";
    UserRole["COUNSELOR"] = "COUNSELOR";
    UserRole["VIEWER"] = "VIEWER";
    UserRole["PARENT"] = "PARENT";
    UserRole["STUDENT"] = "STUDENT";
    return UserRole;
}({});
const ROLE_HIERARCHY = {
    ["SUPER_ADMIN"]: 100,
    ["ADMIN"]: 90,
    ["DISTRICT_ADMIN"]: 80,
    ["SCHOOL_ADMIN"]: 70,
    ["SCHOOL_NURSE"]: 65,
    ["NURSE"]: 60,
    ["COUNSELOR"]: 50,
    ["OFFICE_STAFF"]: 45,
    ["STAFF"]: 40,
    ["VIEWER"]: 30,
    ["PARENT"]: 20,
    ["STUDENT"]: 10
};
function hasMinimumRole(userRole, minimumRole) {
    const userLevel = ROLE_HIERARCHY[userRole] || 0;
    const requiredLevel = ROLE_HIERARCHY[minimumRole] || 0;
    return userLevel >= requiredLevel;
}
function compareRoles(role1, role2) {
    const level1 = ROLE_HIERARCHY[role1] || 0;
    const level2 = ROLE_HIERARCHY[role2] || 0;
    return level1 - level2;
}
function getRoleLevel(role) {
    return ROLE_HIERARCHY[role] || 0;
}
function isValidRole(role) {
    return Object.values(UserRole).includes(role);
}
function getRolesAbove(minimumRole) {
    const minLevel = ROLE_HIERARCHY[minimumRole] || 0;
    return Object.entries(ROLE_HIERARCHY).filter(([_, level])=>level >= minLevel).map(([role])=>role);
}
function getRolesBelow(maximumRole) {
    const maxLevel = ROLE_HIERARCHY[maximumRole] || 0;
    return Object.entries(ROLE_HIERARCHY).filter(([_, level])=>level < maxLevel).map(([role])=>role);
}
function formatRoleName(role) {
    const roleMap = {
        ["SUPER_ADMIN"]: 'Super Administrator',
        ["ADMIN"]: 'Administrator',
        ["DISTRICT_ADMIN"]: 'District Administrator',
        ["SCHOOL_ADMIN"]: 'School Administrator',
        ["SCHOOL_NURSE"]: 'School Nurse',
        ["NURSE"]: 'Nurse',
        ["OFFICE_STAFF"]: 'Office Staff',
        ["STAFF"]: 'Staff',
        ["COUNSELOR"]: 'Counselor',
        ["VIEWER"]: 'Viewer',
        ["PARENT"]: 'Parent',
        ["STUDENT"]: 'Student'
    };
    return roleMap[role] || role;
}
}),
"[project]/src/lib/auth.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Authentication Utilities for Next.js API Routes
 *
 * Provides comprehensive JWT validation, token verification, and user authentication
 * for Next.js API routes and server components. Includes role-based access control
 * and security validation at module load time.
 *
 * **Security Features**:
 * - JWT token validation with issuer/audience verification
 * - Separate access and refresh token handling
 * - Role-based permission checking
 * - Module-level secret validation (fails fast on missing secrets)
 *
 * @module lib/auth
 */ __turbopack_context__.s([
    "auth",
    ()=>auth,
    "authenticateRequest",
    ()=>authenticateRequest,
    "extractToken",
    ()=>extractToken,
    "hasMinimumRole",
    ()=>hasMinimumRole,
    "hasRole",
    ()=>hasRole,
    "verifyAccessToken",
    ()=>verifyAccessToken,
    "verifyRefreshToken",
    ()=>verifyRefreshToken
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jsonwebtoken/index.js [app-rsc] (ecmascript)");
/**
 * Role hierarchy for permission checking
 * @deprecated Import from @/identity-access/lib/config/roles instead
 *
 * This is maintained for backward compatibility only.
 * New code should use the centralized role configuration.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$lib$2f$config$2f$roles$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/identity-access/lib/config/roles.ts [app-rsc] (ecmascript)");
;
// CRITICAL: Validate JWT secrets at module load time
// This prevents the application from starting with missing or empty secrets
if (!process.env.JWT_SECRET) {
    throw new Error('FATAL: JWT_SECRET environment variable is not set. ' + 'This is a critical security requirement. The application cannot start without it. ' + 'Please configure JWT_SECRET in your environment variables.');
}
if (!process.env.JWT_REFRESH_SECRET) {
    console.warn('WARNING: JWT_REFRESH_SECRET not set, falling back to JWT_SECRET. ' + 'For production environments, use separate secrets for access and refresh tokens.');
}
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;
function extractToken(request) {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
        return null;
    }
    // Support both "Bearer <token>" and "<token>" formats
    if (authHeader.startsWith('Bearer ')) {
        return authHeader.substring(7);
    }
    return authHeader;
}
function verifyAccessToken(token) {
    // Note: JWT_SECRET is validated at module load time, guaranteed to exist
    try {
        const decoded = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].verify(token, JWT_SECRET, {
            issuer: 'white-cross-healthcare',
            audience: 'white-cross-api'
        });
        // Verify token type
        if (decoded.type && decoded.type !== 'access') {
            throw new Error('Invalid token type');
        }
        return decoded;
    } catch (error) {
        if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].JsonWebTokenError) {
            throw new Error('Invalid token');
        }
        if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].TokenExpiredError) {
            throw new Error('Token has expired');
        }
        throw error;
    }
}
function verifyRefreshToken(token) {
    // Note: JWT_REFRESH_SECRET is validated at module load time, guaranteed to exist
    try {
        const decoded = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].verify(token, JWT_REFRESH_SECRET, {
            issuer: 'white-cross-healthcare'
        });
        // Verify token type
        if (decoded.type && decoded.type !== 'refresh') {
            throw new Error('Invalid token type');
        }
        return decoded;
    } catch (error) {
        if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].JsonWebTokenError) {
            throw new Error('Invalid refresh token');
        }
        if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].TokenExpiredError) {
            throw new Error('Refresh token has expired');
        }
        throw error;
    }
}
function authenticateRequest(request) {
    if (!request) {
        // Server component context - create mock authenticated user
        // In production, this should use next-auth or similar
        return null;
    }
    try {
        const token = extractToken(request);
        if (!token) {
            return null;
        }
        const payload = verifyAccessToken(token);
        const user = {
            id: payload.id,
            email: payload.email,
            role: payload.role
        };
        return {
            ...user,
            user
        };
    } catch (error) {
        console.error('Authentication failed:', error);
        return null;
    }
}
function hasRole(user, requiredRole) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [
        requiredRole
    ];
    return roles.includes(user.role);
}
;
const ROLE_HIERARCHY = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$lib$2f$config$2f$roles$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ROLE_HIERARCHY"];
function hasMinimumRole(user, minimumRole) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$lib$2f$config$2f$roles$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["hasMinimumRole"])(user.role, minimumRole);
}
const auth = authenticateRequest;
}),
"[project]/src/lib/actions/appointments.cache.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Appointments Cache Operations
 * Cached GET operations with React cache() for appointment data fetching
 *
 * Features:
 * - React cache() for request memoization
 * - Next.js cache integration with proper TTL
 * - PHI-compliant cache tags
 * - HIPAA audit logging for all PHI access
 * - Comprehensive error handling
 */ /* __next_internal_action_entry_do_not_use__ [{"7f5ac80c327a743917e30aaa1d80b6633b54df33eb":"getAppointment","7fa116af0736d6034e1d56926441256eda17534051":"getAppointments"},"",""] */ __turbopack_context__.s([
    "getAppointment",
    ()=>getAppointment,
    "getAppointments",
    ()=>getAppointments
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$server$2f$api$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/server/api-client.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/constants/api.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cache$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/cache/constants.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$audit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/audit.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/auth.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
;
const getAppointments = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cache"])(async (filters)=>{
    const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["auth"])();
    const headersList = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["headers"])();
    try {
        // Build query string from filters
        const queryString = filters ? '?' + new URLSearchParams(Object.entries(filters).map(([k, v])=>[
                k,
                String(v)
            ])).toString() : '';
        // serverGet returns ApiResponse<T>, so response itself is ApiResponse
        const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$server$2f$api$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["serverGet"])(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].APPOINTMENTS?.BASE || '/appointments'}${queryString}`, {
            cache: 'force-cache',
            next: {
                revalidate: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cache$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CACHE_TTL"]?.PHI_STANDARD || 300,
                tags: [
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cache$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CACHE_TAGS"]?.APPOINTMENTS || 'appointments',
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cache$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CACHE_TAGS"]?.PHI || 'phi'
                ]
            }
        });
        // HIPAA Audit Log: Track appointment list access
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$audit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["auditLog"])({
            userId: session?.user?.id,
            action: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$audit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["AUDIT_ACTIONS"].LIST_APPOINTMENTS,
            resource: 'appointments',
            details: filters ? `Filters: ${JSON.stringify(filters)}` : 'No filters',
            ipAddress: headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || undefined,
            userAgent: headersList.get('user-agent') || undefined,
            success: response?.success || false
        });
        // response.data has type { appointments: Appointment[]; total: number }
        const result = response?.data;
        return {
            appointments: result?.appointments || [],
            total: result?.total || 0
        };
    } catch (error) {
        // HIPAA Audit Log: Track failed access
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$audit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["auditLog"])({
            userId: session?.user?.id,
            action: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$audit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["AUDIT_ACTIONS"].LIST_APPOINTMENTS,
            resource: 'appointments',
            details: filters ? `Filters: ${JSON.stringify(filters)}` : 'No filters',
            ipAddress: headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || undefined,
            userAgent: headersList.get('user-agent') || undefined,
            success: false,
            errorMessage: error instanceof Error ? error.message : 'Unknown error'
        });
        console.error('Failed to fetch appointments:', error);
        return {
            appointments: [],
            total: 0
        };
    }
});
const getAppointment = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cache"])(async (id)=>{
    const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["auth"])();
    const headersList = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["headers"])();
    try {
        // serverGet returns ApiResponse<T>, so response itself is ApiResponse
        const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$server$2f$api$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["serverGet"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].APPOINTMENTS?.BY_ID?.(id) || `/appointments/${id}`, {
            cache: 'force-cache',
            next: {
                revalidate: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cache$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CACHE_TTL"]?.PHI_STANDARD || 300,
                tags: [
                    `appointment-${id}`,
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cache$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CACHE_TAGS"]?.APPOINTMENTS || 'appointments',
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cache$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CACHE_TAGS"]?.PHI || 'phi'
                ]
            }
        });
        // HIPAA Audit Log: Track appointment access
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$audit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["auditLog"])({
            userId: session?.user?.id,
            action: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$audit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["AUDIT_ACTIONS"].VIEW_APPOINTMENT,
            resource: 'appointment',
            resourceId: id,
            ipAddress: headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || undefined,
            userAgent: headersList.get('user-agent') || undefined,
            success: response?.success || false
        });
        // response.data has type Appointment
        if (!response?.success || !response?.data) {
            return null;
        }
        return response.data;
    } catch (error) {
        // HIPAA Audit Log: Track failed access
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$audit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["auditLog"])({
            userId: session?.user?.id,
            action: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$audit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["AUDIT_ACTIONS"].VIEW_APPOINTMENT,
            resource: 'appointment',
            resourceId: id,
            ipAddress: headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || undefined,
            userAgent: headersList.get('user-agent') || undefined,
            success: false,
            errorMessage: error instanceof Error ? error.message : 'Unknown error'
        });
        console.error(`Failed to fetch appointment ${id}:`, error);
        return null;
    }
});
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getAppointments,
    getAppointment
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getAppointments, "7fa116af0736d6034e1d56926441256eda17534051", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getAppointment, "7f5ac80c327a743917e30aaa1d80b6633b54df33eb", null);
}),
"[project]/src/lib/actions/appointments.crud.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Appointments CRUD Operations
 * Create, update, and delete operations with cache invalidation
 *
 * Features:
 * - Full CRUD operations for appointments
 * - HIPAA audit logging for all PHI modifications
 * - Automatic cache invalidation with revalidateTag/revalidatePath
 * - Comprehensive error handling
 * - Type-safe return values
 */ /* __next_internal_action_entry_do_not_use__ [{"4054d0ed2fc0691098fcc94d488e5746cb87a2b5ec":"deleteAppointment","4086ada91b9e389211c8d31ab69f8263cc59da773b":"createAppointment","60a50e679b23d544c309366d7e3f22d667ff0f84d3":"updateAppointment"},"",""] */ __turbopack_context__.s([
    "createAppointment",
    ()=>createAppointment,
    "deleteAppointment",
    ()=>deleteAppointment,
    "updateAppointment",
    ()=>updateAppointment
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$server$2f$api$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/server/api-client.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/constants/api.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cache$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/cache/constants.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$audit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/audit.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/auth.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
;
async function createAppointment(data) {
    const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["auth"])();
    const headersList = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["headers"])();
    try {
        // serverPost returns ApiResponse<T>, so response itself is ApiResponse
        const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$server$2f$api$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["serverPost"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].APPOINTMENTS?.BASE || '/appointments', data, {
            cache: 'no-store'
        });
        if (!response.success || !response.data) {
            throw new Error(response.message || 'Failed to create appointment');
        }
        // HIPAA Audit Log: Track appointment creation
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$audit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["auditLog"])({
            userId: session?.user?.id,
            action: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$audit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["AUDIT_ACTIONS"].CREATE_APPOINTMENT,
            resource: 'appointment',
            resourceId: response.data.id,
            details: `Created appointment for student ${data.studentId}`,
            ipAddress: headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || undefined,
            userAgent: headersList.get('user-agent') || undefined,
            success: true,
            changes: {
                created: data
            }
        });
        // Cache invalidation
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidateTag"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cache$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CACHE_TAGS"]?.APPOINTMENTS || 'appointments', 'default');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/appointments');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/dashboard');
        // response.data has type Appointment
        return {
            success: true,
            id: response.data.id
        };
    } catch (error) {
        // HIPAA Audit Log: Track failed creation
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$audit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["auditLog"])({
            userId: session?.user?.id,
            action: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$audit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["AUDIT_ACTIONS"].CREATE_APPOINTMENT,
            resource: 'appointment',
            details: `Failed to create appointment for student ${data.studentId}`,
            ipAddress: headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || undefined,
            userAgent: headersList.get('user-agent') || undefined,
            success: false,
            errorMessage: error instanceof Error ? error.message : 'Unknown error'
        });
        console.error('Failed to create appointment:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to create appointment'
        };
    }
}
async function updateAppointment(id, data) {
    const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["auth"])();
    const headersList = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["headers"])();
    try {
        // serverPut returns ApiResponse<T>, so response itself is ApiResponse
        const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$server$2f$api$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["serverPut"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].APPOINTMENTS?.BY_ID?.(id) || `/appointments/${id}`, data, {
            cache: 'no-store'
        });
        if (!response.success) {
            throw new Error(response.message || 'Failed to update appointment');
        }
        // HIPAA Audit Log: Track appointment update
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$audit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["auditLog"])({
            userId: session?.user?.id,
            action: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$audit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["AUDIT_ACTIONS"].UPDATE_APPOINTMENT,
            resource: 'appointment',
            resourceId: id,
            details: 'Updated appointment details',
            ipAddress: headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || undefined,
            userAgent: headersList.get('user-agent') || undefined,
            success: true,
            changes: {
                updated: data
            }
        });
        // Cache invalidation
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidateTag"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cache$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CACHE_TAGS"]?.APPOINTMENTS || 'appointments', 'default');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidateTag"])(`appointment-${id}`, 'default');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/appointments');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/appointments/${id}`);
        return {
            success: true
        };
    } catch (error) {
        // HIPAA Audit Log: Track failed update
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$audit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["auditLog"])({
            userId: session?.user?.id,
            action: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$audit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["AUDIT_ACTIONS"].UPDATE_APPOINTMENT,
            resource: 'appointment',
            resourceId: id,
            details: 'Failed to update appointment',
            ipAddress: headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || undefined,
            userAgent: headersList.get('user-agent') || undefined,
            success: false,
            errorMessage: error instanceof Error ? error.message : 'Unknown error'
        });
        console.error(`Failed to update appointment ${id}:`, error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to update appointment'
        };
    }
}
async function deleteAppointment(id) {
    const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["auth"])();
    const headersList = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["headers"])();
    try {
        // serverDelete returns ApiResponse<T>, so response itself is ApiResponse
        const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$server$2f$api$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["serverDelete"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].APPOINTMENTS?.BY_ID?.(id) || `/appointments/${id}`, {
            cache: 'no-store'
        });
        if (!response.success) {
            throw new Error(response.message || 'Failed to delete appointment');
        }
        // HIPAA Audit Log: Track appointment deletion
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$audit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["auditLog"])({
            userId: session?.user?.id,
            action: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$audit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["AUDIT_ACTIONS"].DELETE_APPOINTMENT,
            resource: 'appointment',
            resourceId: id,
            details: 'Deleted appointment',
            ipAddress: headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || undefined,
            userAgent: headersList.get('user-agent') || undefined,
            success: true
        });
        // Cache invalidation
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidateTag"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cache$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CACHE_TAGS"]?.APPOINTMENTS || 'appointments', 'default');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidateTag"])(`appointment-${id}`, 'default');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/appointments');
        return {
            success: true
        };
    } catch (error) {
        // HIPAA Audit Log: Track failed deletion
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$audit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["auditLog"])({
            userId: session?.user?.id,
            action: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$audit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["AUDIT_ACTIONS"].DELETE_APPOINTMENT,
            resource: 'appointment',
            resourceId: id,
            details: 'Failed to delete appointment',
            ipAddress: headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || undefined,
            userAgent: headersList.get('user-agent') || undefined,
            success: false,
            errorMessage: error instanceof Error ? error.message : 'Unknown error'
        });
        console.error(`Failed to delete appointment ${id}:`, error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to delete appointment'
        };
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    createAppointment,
    updateAppointment,
    deleteAppointment
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createAppointment, "4086ada91b9e389211c8d31ab69f8263cc59da773b", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateAppointment, "60a50e679b23d544c309366d7e3f22d667ff0f84d3", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(deleteAppointment, "4054d0ed2fc0691098fcc94d488e5746cb87a2b5ec", null);
}),
"[project]/.next-internal/server/app/(dashboard)/appointments/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/lib/actions/appointments.cache.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/src/lib/actions/appointments.crud.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$appointments$2e$cache$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/actions/appointments.cache.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$appointments$2e$crud$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/actions/appointments.crud.ts [app-rsc] (ecmascript)");
;
;
;
;
}),
"[project]/.next-internal/server/app/(dashboard)/appointments/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/lib/actions/appointments.cache.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/src/lib/actions/appointments.crud.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "4054d0ed2fc0691098fcc94d488e5746cb87a2b5ec",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$appointments$2e$crud$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["deleteAppointment"],
    "7fa116af0736d6034e1d56926441256eda17534051",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$appointments$2e$cache$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAppointments"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f28$dashboard$292f$appointments$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$actions$2f$appointments$2e$cache$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$actions$2f$appointments$2e$crud$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/(dashboard)/appointments/page/actions.js { ACTIONS_MODULE0 => "[project]/src/lib/actions/appointments.cache.ts [app-rsc] (ecmascript)", ACTIONS_MODULE1 => "[project]/src/lib/actions/appointments.crud.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$appointments$2e$cache$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/actions/appointments.cache.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$appointments$2e$crud$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/actions/appointments.crud.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__69813ece._.js.map