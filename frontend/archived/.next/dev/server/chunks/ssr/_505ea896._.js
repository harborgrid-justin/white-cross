module.exports = [
"[project]/src/lib/api/nextjs-client.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @fileoverview Next.js Fetch-Based API Client
 * @module lib/api/nextjs-client
 * @category API Client
 *
 * Enterprise-grade HTTP client built on Next.js native fetch API with comprehensive
 * caching, revalidation, and error handling capabilities.
 *
 * Key Features:
 * - Native Next.js fetch with automatic request deduplication
 * - Cache configuration (cache, revalidate, tags)
 * - cacheLife support for Next.js 15+
 * - Type-safe HTTP methods (GET, POST, PUT, PATCH, DELETE)
 * - Automatic authentication token injection
 * - CSRF protection headers
 * - Comprehensive error handling and retry logic
 * - Request ID generation for tracing
 * - HIPAA-compliant audit logging integration
 *
 * This client is designed to replace axios-based clients in Server Components
 * and Server Actions, enabling full integration with Next.js caching system.
 *
 * @example
 * ```typescript
 * // In a Server Component
 * const students = await serverGet<Student[]>('/api/students', {
 *   cache: 'force-cache',
 *   next: {
 *     revalidate: CACHE_TTL.PHI_STANDARD,
 *     tags: [CACHE_TAGS.STUDENTS, CACHE_TAGS.PHI]
 *   }
 * });
 *
 * // In a Server Action
 * const result = await serverPost<Student>('/api/students', data, {
 *   cache: 'no-store',
 *   next: { tags: [CACHE_TAGS.STUDENTS] }
 * });
 * ```
 *
 * @version 1.0.0
 * @since 2025-10-31
 */ __turbopack_context__.s([
    "NextApiClientError",
    ()=>NextApiClientError,
    "apiClient",
    ()=>apiClient,
    "buildCacheTags",
    ()=>buildCacheTags,
    "buildResourceTag",
    ()=>buildResourceTag,
    "default",
    ()=>__TURBOPACK__default__export__,
    "fetchApi",
    ()=>fetchApi,
    "nextFetch",
    ()=>nextFetch,
    "serverDelete",
    ()=>serverDelete,
    "serverGet",
    ()=>serverGet,
    "serverPatch",
    ()=>serverPatch,
    "serverPost",
    ()=>serverPost,
    "serverPut",
    ()=>serverPut
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$lib$2f$config$2f$cookies$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/identity-access/lib/config/cookies.ts [app-rsc] (ecmascript)");
;
;
;
class NextApiClientError extends Error {
    code;
    status;
    details;
    traceId;
    isNetworkError;
    isServerError;
    isValidationError;
    constructor(error){
        super(error.message);
        this.name = 'NextApiClientError';
        this.code = error.code;
        this.status = error.status;
        this.details = error.details;
        this.traceId = error.traceId;
        // Classify error types
        this.isNetworkError = error.code === 'NETWORK_ERROR';
        this.isServerError = (error.status ?? 0) >= 500;
        this.isValidationError = error.status === 400;
        // Maintain proper stack trace
        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, NextApiClientError);
        }
    }
}
// ==========================================
// CONFIGURATION
// ==========================================
/**
 * Get API base URL from environment
 */ function getApiBaseUrl() {
    return process.env.API_BASE_URL || ("TURBOPACK compile-time value", "http://localhost:3001") || 'http://localhost:3001';
}
/**
 * Get authentication token from production-ready httpOnly cookies
 * Uses the existing JWT-based authentication system
 */ async function getAuthToken() {
    try {
        const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
        // Try multiple cookie names that might be used for the auth token
        const token = cookieStore.get(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$lib$2f$config$2f$cookies$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["COOKIE_NAMES"].ACCESS_TOKEN)?.value || cookieStore.get('auth.token')?.value || cookieStore.get('auth_token')?.value || cookieStore.get('accessToken')?.value;
        return token || null;
    } catch (error) {
        console.error('[Next API Client] Failed to get auth token:', error);
        return null;
    }
}
/**
 * Generate unique request ID for tracing
 * Made dynamic to avoid prerendering issues
 */ function generateRequestId() {
    // Access headers first to make this function dynamic during prerendering
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["headers"])();
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
/**
 * Get CSRF token from cookies
 */ async function getCsrfToken() {
    try {
        const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
        return cookieStore.get('csrf-token')?.value || null;
    } catch (error) {
        console.error('[Next API Client] Failed to get CSRF token:', error);
        return null;
    }
}
async function nextFetch(endpoint, options = {}) {
    const { requiresAuth = true, onError, retry = {
        attempts: 3,
        delay: 1000
    }, timeout = 30000, cache = 'force-cache', next, cacheLife, ...fetchOptions } = options;
    // Build full URL
    const url = endpoint.startsWith('http') ? endpoint : `${getApiBaseUrl()}${endpoint}`;
    // Prepare headers
    const headers = {
        'Content-Type': 'application/json'
    };
    // Merge additional headers
    if (fetchOptions.headers) {
        Object.entries(fetchOptions.headers).forEach(([key, value])=>{
            if (typeof value === 'string') {
                headers[key] = value;
            }
        });
    }
    // Add authentication if required
    if (requiresAuth) {
        const token = await getAuthToken();
        // Don't redirect during login/auth endpoints
        const isAuthEndpoint = endpoint.includes('/auth/') || endpoint.includes('/login') || endpoint.includes('/register') || endpoint.includes('/forgot-password') || endpoint.includes('/reset-password');
        console.log('[Next API Client] Auth check:', {
            endpoint,
            hasToken: !!token,
            tokenStart: token?.substring(0, 20),
            isAuthEndpoint,
            requiresAuth
        });
        if (!token && !isAuthEndpoint) {
            // Redirect to login if no token (but not during auth operations)
            console.error('[Next API Client] No auth token found for protected endpoint:', endpoint);
            // Note: redirect() in server components/actions can cause issues
            // Consider using middleware for auth protection instead
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])('/login');
        }
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
            console.log('[Next API Client] Added Authorization header:', {
                authHeaderStart: headers['Authorization'].substring(0, 30),
                fullAuthHeaderLength: headers['Authorization'].length
            });
        }
    }
    // Add CSRF token for mutations
    if (fetchOptions.method && [
        'POST',
        'PUT',
        'PATCH',
        'DELETE'
    ].includes(fetchOptions.method)) {
        const csrfToken = await getCsrfToken();
        if (csrfToken) {
            headers['X-CSRF-Token'] = csrfToken;
        }
    }
    // Add request ID for tracing
    headers['X-Request-ID'] = generateRequestId();
    // Add security headers for HIPAA compliance
    headers['X-Content-Type-Options'] = 'nosniff';
    headers['X-Frame-Options'] = 'DENY';
    headers['X-XSS-Protection'] = '1; mode=block';
    // Build Next.js cache configuration
    const nextConfig = {};
    if (next?.revalidate !== undefined) {
        nextConfig.revalidate = next.revalidate;
    }
    if (next?.tags && next.tags.length > 0) {
        nextConfig.tags = next.tags;
    }
    // Execute fetch with retry logic
    let lastError = null;
    for(let attempt = 0; attempt < retry.attempts; attempt++){
        try {
            // Create abort controller for timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(()=>controller.abort(), timeout);
            const response = await fetch(url, {
                ...fetchOptions,
                headers,
                cache,
                next: Object.keys(nextConfig).length > 0 ? nextConfig : undefined,
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            // Handle different response status codes
            if (!response.ok) {
                // Log 401 errors for debugging before consuming the response
                if (response.status === 401) {
                    console.error('[Next API Client] 401 Unauthorized:', {
                        endpoint,
                        status: response.status,
                        statusText: response.statusText,
                        hasAuthHeader: !!headers['Authorization'],
                        authHeaderStart: headers['Authorization']?.substring(0, 30)
                    });
                }
                const error = await handleErrorResponse(response);
                // Handle specific errors with redirects
                // Don't redirect on login/auth endpoints to avoid redirect loops
                const isAuthEndpoint = endpoint.includes('/auth/login') || endpoint.includes('/auth/register');
                // Note: Redirects in Server Components/Actions can be tricky
                // These will throw NEXT_REDIRECT which Next.js catches
                // Consider using middleware for auth protection instead
                if (response.status === 401 && !isAuthEndpoint) {
                    console.error('[Next API Client] 401 error - authentication required');
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])('/login');
                } else if (response.status === 403) {
                    console.error('[Next API Client] 403 error - access denied');
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])('/access-denied');
                }
                throw error;
            }
            // Parse response
            const contentType = response.headers.get('content-type');
            if (contentType?.includes('application/json')) {
                return await response.json();
            }
            return await response.text();
        } catch (error) {
            // Re-throw Next.js redirect errors immediately - they should not be caught
            if (error && typeof error === 'object' && 'digest' in error) {
                const errorWithDigest = error;
                if (typeof errorWithDigest.digest === 'string' && errorWithDigest.digest.startsWith('NEXT_REDIRECT')) {
                    throw error;
                }
            }
            lastError = error;
            // Don't retry on client errors (except 408, 429)
            if (error instanceof NextApiClientError) {
                const status = error.status;
                if (status && status >= 400 && status < 500 && status !== 408 && status !== 429) {
                    break;
                }
            }
            // Wait before retry (exponential backoff)
            if (attempt < retry.attempts - 1) {
                await new Promise((resolve)=>setTimeout(resolve, retry.delay * Math.pow(2, attempt)));
            }
        }
    }
    // All retries failed
    const finalError = lastError || new Error('Unknown error');
    if (onError) {
        onError(finalError);
    }
    throw finalError;
}
/**
 * Handle error responses and create normalized error objects
 */ async function handleErrorResponse(response) {
    let details;
    try {
        const contentType = response.headers.get('content-type');
        if (contentType?.includes('application/json')) {
            details = await response.json();
        } else {
            details = await response.text();
        }
    } catch  {
        details = null;
    }
    const error = {
        message: typeof details === 'object' && details !== null && 'message' in details ? details.message : response.statusText || 'Request failed',
        status: response.status,
        code: typeof details === 'object' && details !== null && 'code' in details ? details.code : undefined,
        details,
        traceId: response.headers.get('x-trace-id') || undefined
    };
    return new NextApiClientError(error);
}
async function serverGet(endpoint, params, options = {}) {
    const queryString = params ? '?' + new URLSearchParams(Object.entries(params).map(([k, v])=>[
            k,
            String(v)
        ])).toString() : '';
    return nextFetch(`${endpoint}${queryString}`, {
        ...options,
        method: 'GET'
    });
}
async function serverPost(endpoint, data, options = {}) {
    return nextFetch(endpoint, {
        ...options,
        method: 'POST',
        body: data ? JSON.stringify(data) : undefined,
        cache: options.cache ?? 'no-store'
    });
}
async function serverPut(endpoint, data, options = {}) {
    return nextFetch(endpoint, {
        ...options,
        method: 'PUT',
        body: data ? JSON.stringify(data) : undefined,
        cache: options.cache ?? 'no-store'
    });
}
async function serverPatch(endpoint, data, options = {}) {
    return nextFetch(endpoint, {
        ...options,
        method: 'PATCH',
        body: data ? JSON.stringify(data) : undefined,
        cache: options.cache ?? 'no-store'
    });
}
async function serverDelete(endpoint, options = {}) {
    return nextFetch(endpoint, {
        ...options,
        method: 'DELETE',
        cache: options.cache ?? 'no-store'
    });
}
function buildCacheTags(resourceType, isPHI = true, additionalTags = []) {
    const tags = [
        resourceType
    ];
    if (isPHI) {
        tags.push('phi-data');
    }
    return [
        ...tags,
        ...additionalTags
    ];
}
function buildResourceTag(resourceType, resourceId) {
    return `${resourceType}-${resourceId}`;
}
async function apiClient(endpoint, options = {}) {
    const { method = 'GET', body, headers = {} } = options;
    const config = {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...headers
        }
    };
    if (body) {
        config.body = JSON.stringify(body);
    }
    const url = endpoint.startsWith('http') ? endpoint : `${getApiBaseUrl()}${endpoint}`;
    const response = await fetch(url, config);
    if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
    }
    return response.json();
}
const fetchApi = apiClient;
// ==========================================
// EXPORTS
// ==========================================
const nextjsClient = {
    nextFetch,
    serverGet,
    serverPost,
    serverPut,
    serverPatch,
    serverDelete,
    buildCacheTags,
    buildResourceTag,
    // Legacy exports
    apiClient,
    fetchApi
};
const __TURBOPACK__default__export__ = nextjsClient;
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
 * - Backend Base: Direct routes (no /api/v1 prefix)
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
        LOGIN: `/auth/login`,
        LOGOUT: `/auth/logout`,
        REFRESH: `/auth/refresh`,
        VERIFY: `/auth/verify`,
        REGISTER: `/auth/register`,
        PROFILE: `/auth/me`,
        CHANGE_PASSWORD: `/auth/change-password`,
        FORGOT_PASSWORD: `/auth/forgot-password`,
        RESET_PASSWORD: `/auth/reset-password`
    },
    // ==========================================
    // USERS & ACCESS CONTROL
    // ==========================================
    USERS: {
        BASE: `/users`,
        BY_ID: (id)=>`/users/${id}`,
        ME: `/users/me`,
        PROFILE: `/users/profile`,
        UPDATE_PROFILE: `/users/profile`
    },
    RBAC: {
        ROLES: `/access-control/roles`,
        PERMISSIONS: `/access-control/permissions`,
        USER_ROLES: (userId)=>`/access-control/users/${userId}/roles`,
        USER_PERMISSIONS: (userId)=>`/access-control/users/${userId}/permissions`
    },
    // ==========================================
    // STUDENTS
    // ==========================================
    STUDENTS: {
        BASE: `/students`,
        BY_ID: (id)=>`/students/${id}`,
        DEACTIVATE: (id)=>`/students/${id}/deactivate`,
        REACTIVATE: (id)=>`/students/${id}/reactivate`,
        TRANSFER: (id)=>`/students/${id}/transfer`,
        ASSIGN: (id)=>`/students/${id}/assign`,
        ASSIGN_BULK: `/students/assign-bulk`,
        PHOTO: (id)=>`/students/${id}/photo`,
        EXPORT: (id)=>`/students/${id}/export`,
        REPORT_CARD: (id)=>`/students/${id}/report-card`,
        VERIFY_ELIGIBILITY: (id)=>`/students/${id}/verify-eligibility`,
        SEARCH: `/students/search`,
        SEARCH_BY_QUERY: (query)=>`/students/search/${encodeURIComponent(query)}`,
        BY_GRADE: (grade)=>`/students/grade/${grade}`,
        BY_NURSE: (nurseId)=>`/students/nurse/${nurseId}`,
        ASSIGNED: `/students/assigned`,
        STATISTICS: (id)=>`/students/${id}/statistics`,
        BULK_UPDATE: `/students/bulk-update`,
        PERMANENT_DELETE: (id)=>`/students/${id}/permanent`,
        GRADES: `/students/grades`,
        HEALTH_RECORDS: (id)=>`/students/${id}/health-records`,
        MENTAL_HEALTH_RECORDS: (id)=>`/students/${id}/mental-health-records`,
        MEDICATIONS: (id)=>`/students/${id}/medications`,
        IMMUNIZATIONS: (id)=>`/students/${id}/immunizations`,
        ALLERGIES: (id)=>`/students/${id}/allergies`,
        APPOINTMENTS: (id)=>`/students/${id}/appointments`,
        INCIDENTS: (id)=>`/students/${id}/incidents`,
        EMERGENCY_CONTACTS: (id)=>`/students/${id}/emergency-contacts`
    },
    // ==========================================
    // APPOINTMENTS
    // ==========================================
    APPOINTMENTS: {
        BASE: `/appointments`,
        BY_ID: (id)=>`/appointments/${id}`,
        RESCHEDULE: (id)=>`/appointments/${id}/reschedule`,
        CANCEL: (id)=>`/appointments/${id}/cancel`,
        COMPLETE: (id)=>`/appointments/${id}/complete`,
        NO_SHOW: (id)=>`/appointments/${id}/no-show`,
        CONFIRM: (id)=>`/appointments/${id}/confirm`,
        START: (id)=>`/appointments/${id}/start`,
        SEND_REMINDER: (id)=>`/appointments/${id}/send-reminder`,
        AVAILABILITY: `/appointments/availability`,
        CONFLICTS: `/appointments/conflicts`,
        CHECK_CONFLICTS: `/appointments/check-conflicts`,
        REMINDERS: `/appointments/reminders`,
        PROCESS_REMINDERS: `/appointments/process-reminders`,
        BY_STUDENT: (studentId)=>`/appointments/student/${studentId}`,
        BY_NURSE: (nurseId)=>`/appointments/nurse/${nurseId}`,
        BY_DATE: `/appointments/by-date`,
        UPCOMING: `/appointments/upcoming`,
        STATISTICS: `/appointments/statistics`,
        RECURRING: `/appointments/recurring`,
        CREATE_RECURRING: `/appointments/recurring/create`,
        EXPORT_CALENDAR: `/appointments/export/calendar`,
        REPORTS: `/appointments/reports`
    },
    // ==========================================
    // HEALTH RECORDS
    // ==========================================
    HEALTH_RECORDS: {
        BASE: `/health-records`,
        BY_ID: (id)=>`/health-records/${id}`,
        BY_STUDENT: (studentId)=>`/students/${studentId}/health-records`,
        BY_TYPE: (type)=>`/health-records/type/${type}`,
        SEARCH: `/health-records/search`,
        EXPORT: (id)=>`/health-records/${id}/export`
    },
    // ==========================================
    // IMMUNIZATIONS / VACCINATIONS
    // ==========================================
    IMMUNIZATIONS: {
        BASE: `/vaccinations`,
        BY_ID: (id)=>`/vaccinations/${id}`,
        SCHEDULE: `/vaccinations/schedule`,
        BY_STUDENT: (studentId)=>`/students/${studentId}/immunizations`,
        DUE: `/vaccinations/due`,
        OVERDUE: `/vaccinations/overdue`,
        COMPLIANCE: `/vaccinations/compliance`,
        EXEMPTIONS: `/vaccinations/exemptions`,
        VERIFY: (id)=>`/vaccinations/${id}/verify`,
        EXPORT: (studentId)=>`/vaccinations/export/${studentId}`
    },
    // ==========================================
    // HEALTH SCREENINGS
    // ==========================================
    SCREENINGS: {
        BASE: `/screenings`,
        BY_ID: (id)=>`/screenings/${id}`,
        BY_STUDENT: (studentId)=>`/students/${studentId}/screenings`,
        BY_TYPE: (type)=>`/screenings/type/${type}`,
        DUE: `/screenings/due`,
        SCHEDULE: `/screenings/schedule`,
        RESULTS: (id)=>`/screenings/${id}/results`
    },
    // ==========================================
    // GROWTH MEASUREMENTS
    // ==========================================
    GROWTH_MEASUREMENTS: {
        BASE: `/growth-measurements`,
        BY_ID: (id)=>`/growth-measurements/${id}`,
        BY_STUDENT: (studentId)=>`/students/${studentId}/growth-measurements`,
        TRENDS: (studentId)=>`/students/${studentId}/growth-measurements/trends`,
        BMI: (studentId)=>`/students/${studentId}/bmi`
    },
    // ==========================================
    // ALLERGIES
    // ==========================================
    ALLERGIES: {
        BASE: `/allergies`,
        BY_ID: (id)=>`/allergies/${id}`,
        BY_STUDENT: (studentId)=>`/students/${studentId}/allergies`,
        CRITICAL: `/allergies/critical`,
        ACTIVE: `/allergies/active`
    },
    // ==========================================
    // VITAL SIGNS
    // ==========================================
    VITAL_SIGNS: {
        BASE: `/vital-signs`,
        BY_ID: (id)=>`/vital-signs/${id}`,
        BY_STUDENT: (studentId)=>`/students/${studentId}/vital-signs`,
        BY_HEALTH_RECORD: (healthRecordId)=>`/health-records/${healthRecordId}/vital-signs`,
        LATEST: (studentId)=>`/students/${studentId}/vital-signs/latest`,
        TRENDS: (studentId)=>`/students/${studentId}/vital-signs/trends`
    },
    // ==========================================
    // CHRONIC CONDITIONS
    // ==========================================
    CHRONIC_CONDITIONS: {
        BASE: `/chronic-conditions`,
        BY_ID: (id)=>`/chronic-conditions/${id}`,
        BY_STUDENT: (studentId)=>`/students/${studentId}/chronic-conditions`,
        ACTIVE: `/chronic-conditions/active`,
        REVIEW_DUE: `/chronic-conditions/review-due`
    },
    // ==========================================
    // MEDICATIONS
    // ==========================================
    MEDICATIONS: {
        BASE: `/medications`,
        BY_ID: (id)=>`/medications/${id}`,
        DETAIL: (id)=>`/medications/${id}`,
        ADMINISTER: (id)=>`/medications/${id}/administer`,
        DISCONTINUE: (id)=>`/medications/${id}/discontinue`,
        REFILL: (id)=>`/medications/${id}/refill`,
        MISSED_DOSE: (id)=>`/medications/${id}/missed-dose`,
        ADVERSE_REACTION: (id)=>`/medications/${id}/adverse-reaction`,
        ADJUST_INVENTORY: (id)=>`/medications/${id}/adjust-inventory`,
        REMINDER: (id)=>`/medications/${id}/reminder`,
        SCHEDULE: (id)=>`/medications/${id}/schedule`,
        INTERACTIONS: (id)=>`/medications/${id}/interactions`,
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
        BY_STUDENT: (studentId)=>`/students/${studentId}/medications`
    },
    // ==========================================
    // PRESCRIPTIONS
    // ==========================================
    PRESCRIPTIONS: {
        BASE: `/prescriptions`,
        BY_ID: (id)=>`/prescriptions/${id}`,
        DETAIL: (id)=>`/prescriptions/${id}`,
        REFILL: (id)=>`/prescriptions/${id}/refill`,
        ACTIVE: `/prescriptions/active`,
        EXPIRING: `/prescriptions/expiring`
    },
    // ==========================================
    // INVENTORY
    // ==========================================
    INVENTORY: {
        BASE: `/inventory`,
        BY_ID: (id)=>`/inventory/${id}`,
        DETAIL: (id)=>`/inventory/${id}`,
        ADJUST: (id)=>`/inventory/${id}/adjust`,
        LOW_STOCK: `/inventory/low-stock`,
        EXPIRING: `/inventory/expiring`,
        REORDER: `/inventory/reorder`,
        AUDIT: `/inventory/audit`,
        ITEMS: `/inventory/items`,
        ALERTS: `/inventory/alerts`,
        ANALYTICS: `/inventory/analytics`,
        DASHBOARD: `/inventory/dashboard`,
        REPORTS: `/inventory/reports`
    },
    // ==========================================
    // ADMINISTRATION LOG
    // ==========================================
    ADMINISTRATION_LOG: {
        BASE: `/administration-log`,
        BY_ID: (id)=>`/administration-log/${id}`,
        DETAIL: (id)=>`/administration-log/${id}`,
        BY_MEDICATION: (medicationId)=>`/medications/${medicationId}/administration-log`,
        BY_STUDENT: (studentId)=>`/students/${studentId}/administration-log`,
        TODAY: `/administration-log/today`,
        MISSED: `/administration-log/missed`
    },
    // ==========================================
    // EMERGENCY CONTACTS
    // ==========================================
    EMERGENCY_CONTACTS: {
        BASE: `/emergency-contacts`,
        BY_ID: (id)=>`/emergency-contacts/${id}`,
        BY_STUDENT: (studentId)=>`/students/${studentId}/emergency-contacts`,
        PRIMARY: (studentId)=>`/students/${studentId}/emergency-contacts/primary`,
        VERIFY: (id)=>`/emergency-contacts/${id}/verify`,
        NOTIFY: (id)=>`/emergency-contacts/${id}/notify`
    },
    // ==========================================
    // INCIDENTS
    // ==========================================
    INCIDENTS: {
        BASE: `/incident-report`,
        BY_ID: (id)=>`/incident-report/${id}`,
        WITNESSES: (incidentId)=>`/incident-report/${incidentId}/witnesses`,
        WITNESS_STATEMENT: (incidentId, witnessId)=>`/incident-report/${incidentId}/witnesses/${witnessId}/statement`,
        VERIFY_STATEMENT: (statementId)=>`/incident-report/statements/${statementId}/verify`,
        FOLLOW_UP: (incidentId)=>`/incident-report/${incidentId}/follow-up`,
        FOLLOW_UP_PROGRESS: (followUpId)=>`/incident-report/follow-up/${followUpId}/progress`,
        FOLLOW_UP_COMPLETE: (followUpId)=>`/incident-report/follow-up/${followUpId}/complete`,
        ANALYTICS: `/incident-report/analytics`,
        TRENDING: `/incident-report/trending`,
        BY_STUDENT: (studentId)=>`/students/${studentId}/incidents`,
        BY_TYPE: (type)=>`/incident-report/type/${type}`,
        BY_SEVERITY: (severity)=>`/incident-report/severity/${severity}`
    },
    // ==========================================
    // DOCUMENTS
    // ==========================================
    DOCUMENTS: {
        BASE: `/documents`,
        BY_ID: (id)=>`/documents/${id}`,
        UPLOAD: `/documents/upload`,
        DOWNLOAD: (id)=>`/documents/${id}/download`,
        PREVIEW: (id)=>`/documents/${id}/preview`,
        SIGN: (id)=>`/documents/${id}/sign`,
        VERIFY_SIGNATURE: (id)=>`/documents/${id}/verify-signature`,
        BY_STUDENT: (studentId)=>`/students/${studentId}/documents`,
        BY_TYPE: (type)=>`/documents/type/${type}`,
        TEMPLATES: `/documents/templates`
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
        EXPORT: `/compliance/export`
    },
    AUDIT: {
        LOGS: `/audit-logs`,
        BY_ID: (id)=>`/audit-logs/${id}`,
        BY_USER: (userId)=>`/audit-logs/user/${userId}`,
        BY_RESOURCE: (resourceType, resourceId)=>`/audit-logs/resource/${resourceType}/${resourceId}`,
        BY_ACTION: (action)=>`/audit-logs/action/${action}`,
        PHI_ACCESS: `/audit-logs/phi-access`,
        PHI_ACCESS_LOG: `/audit/phi-access`,
        EXPORT: `/audit-logs/export`
    },
    // ==========================================
    // COMMUNICATIONS
    // ==========================================
    MESSAGES: {
        BASE: `/messages`,
        BY_ID: (id)=>`/messages/${id}`,
        SEND: `/messages/send`,
        INBOX: `/messages/inbox`,
        SENT: `/messages/sent`,
        UNREAD: `/messages/unread`,
        MARK_READ: (id)=>`/messages/${id}/mark-read`,
        MARK_UNREAD: (id)=>`/messages/${id}/mark-unread`,
        DELETE: (id)=>`/messages/${id}`,
        THREAD: (id)=>`/messages/thread/${id}`,
        ATTACHMENTS: (id)=>`/messages/${id}/attachments`
    },
    BROADCASTS: {
        BASE: `/broadcasts`,
        BY_ID: (id)=>`/broadcasts/${id}`,
        SEND: `/broadcasts/send`,
        SCHEDULE: `/broadcasts/schedule`,
        RECIPIENTS: (id)=>`/broadcasts/${id}/recipients`,
        CANCEL: (id)=>`/broadcasts/${id}/cancel`,
        DUPLICATE: (id)=>`/broadcasts/${id}/duplicate`,
        DELIVERY_STATUS: (id)=>`/broadcasts/${id}/delivery-status`,
        DRAFTS: `/broadcasts/drafts`,
        SCHEDULED: `/broadcasts/scheduled`
    },
    ALERTS: {
        BASE: `/alerts`,
        BY_ID: (id)=>`/alerts/${id}`,
        ACTIVE: `/alerts/active`,
        ACKNOWLEDGE: (id)=>`/alerts/${id}/acknowledge`,
        DISMISS: (id)=>`/alerts/${id}/dismiss`,
        MEDICATION_REMINDERS: `/alerts/medication-reminders`,
        APPOINTMENT_REMINDERS: `/alerts/appointment-reminders`,
        EMERGENCY: `/alerts/emergency`,
        BY_TYPE: (type)=>`/alerts/type/${type}`
    },
    NOTIFICATIONS: {
        BASE: `/notifications`,
        BY_ID: (id)=>`/notifications/${id}`,
        UNREAD: `/notifications/unread`,
        MARK_READ: (id)=>`/notifications/${id}/mark-read`,
        MARK_ALL_READ: `/notifications/mark-all-read`,
        PREFERENCES: `/notifications/preferences`,
        TEST_PUSH: `/notifications/test-push`,
        PUSH_SUBSCRIBE: `/notifications/push-subscribe`,
        PUSH_UNSUBSCRIBE: `/notifications/push-unsubscribe`,
        PUSH_SUBSCRIPTION: `/notifications/push-subscription`
    },
    CONVERSATIONS: {
        BASE: `/conversations`,
        BY_ID: (id)=>`/conversations/${id}`,
        BY_USER: (userId)=>`/conversations/user/${userId}`,
        MESSAGES: (conversationId)=>`/conversations/${conversationId}/messages`,
        PARTICIPANTS: (conversationId)=>`/conversations/${conversationId}/participants`,
        ADD_PARTICIPANT: (conversationId)=>`/conversations/${conversationId}/participants`,
        REMOVE_PARTICIPANT: (conversationId, userId)=>`/conversations/${conversationId}/participants/${userId}`,
        ARCHIVE: (id)=>`/conversations/${id}/archive`,
        UNARCHIVE: (id)=>`/conversations/${id}/unarchive`
    },
    TEMPLATES: {
        BASE: `/templates`,
        BY_ID: (id)=>`/templates/${id}`,
        BY_CATEGORY: (category)=>`/templates/category/${category}`,
        RENDER: (id)=>`/templates/${id}/render`,
        CATEGORIES: `/templates/categories`
    },
    // ==========================================
    // DASHBOARD
    // ==========================================
    DASHBOARD: {
        STATS: `/dashboard/stats`,
        RECENT_ACTIVITIES: `/dashboard/recent-activities`,
        UPCOMING_APPOINTMENTS: `/dashboard/upcoming-appointments`,
        CHART_DATA: `/dashboard/chart-data`,
        WIDGETS: (dashboardId)=>`/dashboard/${dashboardId}/widgets`,
        REFRESH: `/dashboard/refresh-cache`
    },
    // ==========================================
    // ANALYTICS & REPORTING
    // ==========================================
    ANALYTICS: {
        METRICS: `/analytics/metrics`,
        DASHBOARD: `/analytics/dashboard`,
        DASHBOARD_WIDGETS: (dashboardId)=>`/analytics/dashboard/${dashboardId}/widgets`,
        REPORTS: `/analytics/reports`,
        CHART_DATA: `/analytics/chart-data`,
        HEALTH_METRICS: `/analytics/health-metrics`,
        MEDICATION_COMPLIANCE: `/analytics/medication-compliance`,
        APPOINTMENT_METRICS: `/analytics/appointment-metrics`,
        INCIDENT_ANALYTICS: `/analytics/incident-analytics`,
        CUSTOM_REPORT: `/analytics/custom-report`
    },
    REPORTS: {
        // Base Reports
        BASE: `/reports`,
        CUSTOM: `/reports/custom`,
        TEMPLATES: `/reports/templates`,
        SCHEDULED: `/reports/scheduled`,
        SCHEDULE: `/reports/schedule`,
        EXPORT: `/reports/export`,
        HISTORY: `/reports/history`,
        SHARE: (reportId)=>`/reports/${reportId}/share`,
        // Health Trend Analysis
        HEALTH_TRENDS: `/reports/health-trends`,
        HEALTH_TRENDS_BY_CATEGORY: (category)=>`/reports/health-trends/${category}`,
        // Medication Reports
        MEDICATIONS: {
            ADMINISTRATION: `/reports/medications/administration`,
            COMPLIANCE: `/reports/medications/compliance`,
            EXPIRATION: `/reports/medications/expiration`,
            INVENTORY: `/reports/medications/inventory`,
            REFILLS: `/reports/medications/refills`,
            USAGE: `/reports/medication-usage`,
            EFFECTIVENESS: `/reports/medication-effectiveness`
        },
        // Immunization Reports
        IMMUNIZATIONS: {
            COMPLIANCE: `/reports/immunizations/compliance`,
            DUE: `/reports/immunizations/due`,
            OVERDUE: `/reports/immunizations/overdue`,
            EXEMPTIONS: `/reports/immunizations/exemptions`
        },
        // Appointment Reports
        APPOINTMENTS: {
            ATTENDANCE: `/reports/appointments/attendance`,
            NO_SHOWS: `/reports/appointments/no-shows`,
            CANCELLATIONS: `/reports/appointments/cancellations`
        },
        // Incident Reports
        INCIDENTS: {
            SUMMARY: `/reports/incidents/summary`,
            BY_TYPE: `/reports/incidents/by-type`,
            TRENDS: `/reports/incidents/trends`,
            STATISTICS: `/reports/incident-statistics`,
            BY_LOCATION: `/reports/incidents-by-location`
        },
        // Student Reports
        STUDENTS: {
            ENROLLMENT: `/reports/students/enrollment`,
            HEALTH_SUMMARY: `/reports/students/health-summary`,
            DEMOGRAPHICS: `/reports/students/demographics`
        },
        // Attendance & Absenteeism
        ATTENDANCE_CORRELATION: `/reports/attendance-correlation`,
        ABSENTEEISM_PATTERNS: `/reports/absenteeism-patterns`,
        // Performance & Analytics
        PERFORMANCE_METRICS: `/reports/performance-metrics`,
        NURSE_PERFORMANCE: `/reports/nurse-performance`,
        SYSTEM_USAGE: `/reports/system-usage`,
        USAGE_ANALYTICS: `/reports/analytics/usage`,
        POPULARITY: `/reports/analytics/popularity`,
        INSIGHTS: `/reports/analytics/insights`,
        // Dashboard Reports
        DASHBOARD: `/reports/dashboard`,
        DASHBOARD_WIDGETS: `/reports/dashboard/widgets`,
        DASHBOARD_LAYOUT: `/reports/dashboard/layout`,
        // Compliance Reports
        COMPLIANCE: `/reports/compliance`,
        COMPLIANCE_HISTORY: `/reports/compliance/history`,
        COMPLIANCE_AUDIT: `/reports/compliance/audit`
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
        RESTORE: `/system/restore`
    },
    // ==========================================
    // ADMIN - District, School, User Management
    // ==========================================
    ADMIN: {
        // System Settings
        SETTINGS: `/administration/settings`,
        // Users
        USERS: `/users`,
        USER_BY_ID: (id)=>`/users/${id}`,
        // Districts
        DISTRICTS: `/administration/districts`,
        DISTRICT_BY_ID: (id)=>`/administration/districts/${id}`,
        // Schools
        SCHOOLS: `/administration/schools`,
        SCHOOL_BY_ID: (id)=>`/administration/schools/${id}`,
        // System Health
        SYSTEM_HEALTH: `/admin/system/health`,
        // Backups
        BACKUPS: `/administration/backups`,
        BACKUP_BY_ID: (id)=>`/administration/backups/${id}`,
        // Licenses
        LICENSES: `/administration/licenses`,
        LICENSE_BY_ID: (id)=>`/administration/licenses/${id}`,
        LICENSE_DEACTIVATE: (id)=>`/administration/licenses/${id}/deactivate`,
        // Configurations
        CONFIGURATIONS: `/administration/config`,
        CONFIGURATION_BY_KEY: (key)=>`/administration/config/${key}`,
        // Performance Metrics
        METRICS: `/admin/metrics`,
        METRIC_BY_ID: (id)=>`/admin/metrics/${id}`,
        // Training
        TRAINING: `/admin/training`,
        TRAINING_BY_ID: (id)=>`/admin/training/${id}`,
        TRAINING_COMPLETE: (id)=>`/admin/training/${id}/complete`,
        TRAINING_PROGRESS: (userId)=>`/admin/training/progress/${userId}`,
        // Audit Logs
        AUDIT_LOGS: `/administration/audit-logs`,
        AUDIT_LOG_BY_ID: (id)=>`/administration/audit-logs/${id}`
    },
    INTEGRATIONS: {
        BASE: `/integrations`,
        BY_ID: (id)=>`/integrations/${id}`,
        CONFIGURE: (id)=>`/integrations/${id}/configure`,
        TEST: (id)=>`/integrations/${id}/test`,
        SYNC: (id)=>`/integrations/${id}/sync`,
        ENABLE: (id)=>`/integrations/${id}/enable`,
        DISABLE: (id)=>`/integrations/${id}/disable`,
        LOGS: (id)=>`/integrations/${id}/logs`
    },
    // ==========================================
    // MULTI-FACTOR AUTHENTICATION (MFA)
    // ==========================================
    MFA: {
        SETUP: `/mfa/setup`,
        VERIFY: `/mfa/verify`,
        ENABLE: `/mfa/enable`,
        DISABLE: `/mfa/disable`,
        BACKUP_CODES: `/mfa/backup-codes`,
        REGENERATE_CODES: `/mfa/backup-codes/regenerate`,
        VERIFY_BACKUP_CODE: `/mfa/verify-backup-code`,
        QR_CODE: `/mfa/qr-code`,
        STATUS: `/mfa/status`
    },
    // ==========================================
    // APPOINTMENT WAITLIST
    // ==========================================
    WAITLIST: {
        BASE: `/waitlist`,
        BY_ID: (id)=>`/waitlist/${id}`,
        ADD: `/waitlist/add`,
        REMOVE: (id)=>`/waitlist/${id}/remove`,
        POSITION: (id)=>`/waitlist/${id}/position`,
        NOTIFY: (id)=>`/waitlist/${id}/notify`,
        UPDATE_PRIORITY: (id)=>`/waitlist/${id}/priority`,
        BY_STUDENT: (studentId)=>`/waitlist/student/${studentId}`,
        BY_NURSE: (nurseId)=>`/waitlist/nurse/${nurseId}`
    },
    // ==========================================
    // NURSE AVAILABILITY & SCHEDULING
    // ==========================================
    NURSE_AVAILABILITY: {
        BASE: `/nurse-availability`,
        BY_ID: (id)=>`/nurse-availability/${id}`,
        BY_NURSE: (nurseId)=>`/nurse-availability/nurse/${nurseId}`,
        SLOTS: `/nurse-availability/slots`,
        SET: `/nurse-availability/set`,
        UPDATE: (id)=>`/nurse-availability/${id}`,
        DELETE: (id)=>`/nurse-availability/${id}`,
        BY_DATE: (date)=>`/nurse-availability/date/${date}`,
        CHECK_CONFLICTS: `/nurse-availability/check-conflicts`
    },
    // ==========================================
    // FORMS
    // ==========================================
    FORMS: {
        BASE: `/forms`,
        BY_ID: (id)=>`/forms/${id}`,
        TEMPLATES: `/forms/templates`,
        SUBMIT: `/forms/submit`,
        RESPONSES: (formId)=>`/forms/${formId}/responses`,
        SUBMISSIONS: (formId)=>`/forms/${formId}/submissions`,
        EXPORT: (formId)=>`/forms/${formId}/export`
    },
    // ==========================================
    // PURCHASE ORDERS & PROCUREMENT
    // ==========================================
    PURCHASE_ORDERS: {
        BASE: `/purchase-orders`,
        BY_ID: (id)=>`/purchase-orders/${id}`,
        APPROVE: (id)=>`/purchase-orders/${id}/approve`,
        REJECT: (id)=>`/purchase-orders/${id}/reject`,
        RECEIVE: (id)=>`/purchase-orders/${id}/receive`,
        RECEIVE_ITEMS: (id)=>`/purchase-orders/${id}/receive-items`,
        CANCEL: (id)=>`/purchase-orders/${id}/cancel`,
        STATISTICS: `/purchase-orders/statistics`,
        PENDING: `/purchase-orders/pending`,
        APPROVED: `/purchase-orders/approved`,
        RECEIVED: `/purchase-orders/received`,
        BY_VENDOR: (vendorId)=>`/purchase-orders/vendor/${vendorId}`,
        REORDER_ITEMS: `/purchase-orders/reorder-items`,
        VENDOR_HISTORY: (vendorId)=>`/purchase-orders/vendor/${vendorId}/history`
    },
    // ==========================================
    // BILLING & FINANCIAL MANAGEMENT
    // ==========================================
    BILLING: {
        // Invoices
        INVOICES: `/billing/invoices`,
        INVOICE_BY_ID: (id)=>`/billing/invoices/${id}`,
        INVOICE_PDF: (id)=>`/billing/invoices/${id}/pdf`,
        INVOICE_SEND: (id)=>`/billing/invoices/${id}/send`,
        INVOICE_VOID: (id)=>`/billing/invoices/${id}/void`,
        // Payments
        PAYMENTS: `/billing/payments`,
        PAYMENT_BY_ID: (id)=>`/billing/payments/${id}`,
        PAYMENT_REFUND: (id)=>`/billing/payments/${id}/refund`,
        PAYMENT_VOID: (id)=>`/billing/payments/${id}/void`,
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
        SEND_STATEMENT: `/billing/notifications/statement`
    },
    // ==========================================
    // BUDGET MANAGEMENT
    // ==========================================
    BUDGET: {
        // Budget Categories
        CATEGORIES: `/budget/categories`,
        CATEGORY_BY_ID: (id)=>`/budget/categories/${id}`,
        // Budget Summary
        SUMMARY: `/budget/summary`,
        // Budget Transactions
        TRANSACTIONS: `/budget/transactions`,
        TRANSACTION_BY_ID: (id)=>`/budget/transactions/${id}`,
        // Analytics & Reporting
        TRENDS: `/budget/trends`,
        YEAR_COMPARISON: `/budget/year-comparison`,
        OVER_BUDGET: `/budget/over-budget`,
        RECOMMENDATIONS: `/budget/recommendations`,
        EXPORT: `/budget/export`
    },
    // ==========================================
    // VENDORS
    // ==========================================
    VENDORS: {
        BASE: `/vendors`,
        BY_ID: (id)=>`/vendors/${id}`,
        SEARCH: (query)=>`/vendors/search/${encodeURIComponent(query)}`,
        COMPARE: (itemName)=>`/vendors/compare/${encodeURIComponent(itemName)}`,
        TOP: `/vendors/top`,
        STATISTICS: `/vendors/statistics`,
        REACTIVATE: (id)=>`/vendors/${id}/reactivate`,
        RATING: (id)=>`/vendors/${id}/rating`,
        BULK_RATINGS: `/vendors/ratings/bulk`,
        BY_PAYMENT_TERMS: (terms)=>`/vendors/payment-terms/${encodeURIComponent(terms)}`,
        METRICS: (id)=>`/vendors/${id}/metrics`,
        PERMANENT_DELETE: (id)=>`/vendors/${id}/permanent`
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
        SECURITY: `/settings/security`
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
        await fetch(`${BACKEND_URL}/audit/log`, {
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
"[project]/src/identity-access/lib/helpers/rate-limit.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @fileoverview Rate Limiting Implementation
 * @module lib/helpers/rate-limit
 *
 * Provides in-memory rate limiting for server actions to prevent
 * brute force attacks and abuse. Uses a sliding window algorithm
 * with automatic cleanup.
 *
 * IMPORTANT: This is an in-memory implementation suitable for single-instance
 * deployments. For multi-instance/distributed systems, use Redis or similar.
 */ __turbopack_context__.s([
    "RATE_LIMITS",
    ()=>RATE_LIMITS,
    "checkRateLimit",
    ()=>checkRateLimit,
    "cleanupRateLimits",
    ()=>cleanupRateLimits,
    "getRateLimitStats",
    ()=>getRateLimitStats,
    "resetRateLimit",
    ()=>resetRateLimit
]);
/**
 * Rate limit store
 * Maps: "scope:identifier" -> RateLimitEntry
 */ const rateLimitStore = new Map();
/**
 * Cleanup interval (5 minutes)
 */ const CLEANUP_INTERVAL = 5 * 60 * 1000;
const RATE_LIMITS = {
    /** Login attempts by IP: 5 per 15 minutes */ LOGIN_IP: {
        maxRequests: 5,
        windowSeconds: 15 * 60
    },
    /** Login attempts by email: 3 per 15 minutes */ LOGIN_EMAIL: {
        maxRequests: 3,
        windowSeconds: 15 * 60
    },
    /** Password reset requests: 3 per hour */ PASSWORD_RESET: {
        maxRequests: 3,
        windowSeconds: 60 * 60
    },
    /** Password change attempts: 5 per hour */ PASSWORD_CHANGE: {
        maxRequests: 5,
        windowSeconds: 60 * 60
    }
};
function checkRateLimit(scope, identifier, config) {
    const key = `${scope}:${identifier}`;
    const now = Date.now();
    const windowMs = config.windowSeconds * 1000;
    const cutoff = now - windowMs;
    // Get or create entry
    let entry = rateLimitStore.get(key);
    if (!entry) {
        entry = {
            requests: [],
            expiresAt: now + windowMs
        };
        rateLimitStore.set(key, entry);
    }
    // Remove requests outside the window
    entry.requests = entry.requests.filter((timestamp)=>timestamp > cutoff);
    // Check if limit exceeded
    if (entry.requests.length >= config.maxRequests) {
        // Calculate reset time
        const oldestRequest = entry.requests[0];
        const resetIn = Math.ceil((oldestRequest + windowMs - now) / 1000);
        return {
            limited: true,
            remaining: 0,
            resetIn,
            key
        };
    }
    // Record this request
    entry.requests.push(now);
    entry.expiresAt = now + windowMs;
    return {
        limited: false,
        remaining: config.maxRequests - entry.requests.length,
        resetIn: config.windowSeconds,
        key
    };
}
function resetRateLimit(scope, identifier) {
    const key = `${scope}:${identifier}`;
    rateLimitStore.delete(key);
}
function cleanupRateLimits() {
    const now = Date.now();
    const expiredKeys = [];
    for (const [key, entry] of rateLimitStore.entries()){
        if (entry.expiresAt < now) {
            expiredKeys.push(key);
        }
    }
    for (const key of expiredKeys){
        rateLimitStore.delete(key);
    }
}
function getRateLimitStats() {
    return {
        totalKeys: rateLimitStore.size,
        scopes: Array.from(rateLimitStore.keys()).reduce((acc, key)=>{
            const scope = key.split(':')[0];
            acc[scope] = (acc[scope] || 0) + 1;
            return acc;
        }, {})
    };
}
// Start cleanup interval
if (typeof globalThis !== 'undefined' && !globalThis.__rateLimitCleanupStarted) {
    setInterval(cleanupRateLimits, CLEANUP_INTERVAL);
    globalThis.__rateLimitCleanupStarted = true;
}
}),
"[project]/src/identity-access/lib/helpers/input-sanitization.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @fileoverview Input Sanitization Utilities
 * @module lib/helpers/input-sanitization
 *
 * Provides utilities for sanitizing and normalizing user inputs
 * to prevent XSS attacks and ensure data consistency.
 */ /**
 * Sanitize and normalize email address
 *
 * - Trims whitespace
 * - Converts to lowercase
 * - Removes dangerous characters
 *
 * @param email - Raw email input
 * @returns Sanitized email
 *
 * @example
 * sanitizeEmail('  User@Example.COM  ') // Returns: 'user@example.com'
 */ __turbopack_context__.s([
    "encodeHtmlEntities",
    ()=>encodeHtmlEntities,
    "safeFormDataEmail",
    ()=>safeFormDataEmail,
    "safeFormDataPassword",
    ()=>safeFormDataPassword,
    "safeFormDataString",
    ()=>safeFormDataString,
    "sanitizeEmail",
    ()=>sanitizeEmail,
    "sanitizePassword",
    ()=>sanitizePassword,
    "sanitizeString",
    ()=>sanitizeString
]);
function sanitizeEmail(email) {
    return email.trim().toLowerCase().replace(/[<>'"]/g, ''); // Remove potential XSS characters
}
function sanitizeString(input, encodeHtml = false) {
    let sanitized = input.trim().replace(/\0/g, ''); // Remove null bytes
    if (encodeHtml) {
        sanitized = encodeHtmlEntities(sanitized);
    }
    return sanitized;
}
function encodeHtmlEntities(input) {
    const entities = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '/': '&#x2F;'
    };
    return input.replace(/[&<>"'/]/g, (char)=>entities[char] || char);
}
function safeFormDataString(formData, key, defaultValue = '', encodeHtml = false) {
    const value = formData.get(key);
    if (value === null || value === undefined) {
        return defaultValue;
    }
    if (typeof value !== 'string') {
        return defaultValue;
    }
    return sanitizeString(value, encodeHtml);
}
function safeFormDataEmail(formData, key, defaultValue = '') {
    const value = formData.get(key);
    if (value === null || value === undefined) {
        return defaultValue;
    }
    if (typeof value !== 'string') {
        return defaultValue;
    }
    return sanitizeEmail(value);
}
function sanitizePassword(password) {
    return password.replace(/\0/g, ''); // Remove null bytes but preserve other characters
}
function safeFormDataPassword(formData, key, defaultValue = '') {
    const value = formData.get(key);
    if (value === null || value === undefined) {
        return defaultValue;
    }
    if (typeof value !== 'string') {
        return defaultValue;
    }
    return sanitizePassword(value);
}
}),
"[project]/src/identity-access/lib/helpers/action-result.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @fileoverview Server Action Result Builder Helpers
 * @module lib/helpers/action-result
 *
 * Provides builder functions for creating standardized server action results.
 * Ensures consistent response format across all server actions.
 */ __turbopack_context__.s([
    "actionCsrfError",
    ()=>actionCsrfError,
    "actionError",
    ()=>actionError,
    "actionRateLimitError",
    ()=>actionRateLimitError,
    "actionSuccess",
    ()=>actionSuccess,
    "actionUnauthorized",
    ()=>actionUnauthorized,
    "actionValidationError",
    ()=>actionValidationError,
    "toChangePasswordFormState",
    ()=>toChangePasswordFormState,
    "toLoginFormState",
    ()=>toLoginFormState
]);
function actionSuccess(data, message) {
    return {
        success: true,
        data,
        message,
        timestamp: new Date().toISOString()
    };
}
function actionError(formErrors, fieldErrors) {
    return {
        success: false,
        formErrors,
        fieldErrors,
        timestamp: new Date().toISOString()
    };
}
function actionValidationError(fieldErrors, formErrors) {
    return {
        success: false,
        fieldErrors,
        formErrors,
        timestamp: new Date().toISOString()
    };
}
function actionRateLimitError(resetIn) {
    const minutes = Math.ceil(resetIn / 60);
    return {
        success: false,
        formErrors: [
            `Too many attempts. Please try again in ${minutes} minute${minutes !== 1 ? 's' : ''}.`
        ],
        timestamp: new Date().toISOString()
    };
}
function actionUnauthorized(message) {
    return {
        success: false,
        formErrors: [
            message || 'You must be logged in to perform this action'
        ],
        timestamp: new Date().toISOString()
    };
}
function actionCsrfError() {
    return {
        success: false,
        formErrors: [
            'Invalid or missing security token. Please refresh the page and try again.'
        ],
        timestamp: new Date().toISOString()
    };
}
function toLoginFormState(result) {
    if (result.success) {
        return {
            success: true
        };
    }
    const errors = {};
    if (result.fieldErrors) {
        Object.assign(errors, result.fieldErrors);
    }
    if (result.formErrors) {
        errors._form = result.formErrors;
    }
    return {
        errors
    };
}
function toChangePasswordFormState(result) {
    if (result.success) {
        return {
            success: true,
            message: result.message
        };
    }
    const errors = {};
    if (result.fieldErrors) {
        Object.assign(errors, result.fieldErrors);
    }
    if (result.formErrors) {
        errors._form = result.formErrors;
    }
    return {
        errors
    };
}
}),
"[project]/src/identity-access/lib/helpers/zod-errors.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @fileoverview Zod Error Formatting Utilities
 * @module lib/helpers/zod-errors
 *
 * Provides utilities for formatting Zod validation errors into
 * consistent error structures for server actions.
 */ __turbopack_context__.s([
    "extractFormErrors",
    ()=>extractFormErrors,
    "formatZodErrors",
    ()=>formatZodErrors,
    "hasFieldErrors",
    ()=>hasFieldErrors
]);
function formatZodErrors(error) {
    const flattened = error.flatten();
    return flattened.fieldErrors;
}
function extractFormErrors(error) {
    const flattened = error.flatten();
    return flattened.formErrors || [];
}
function hasFieldErrors(error) {
    const formatted = formatZodErrors(error);
    return Object.keys(formatted).length > 0;
}
}),
"[project]/src/identity-access/actions/auth.constants.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @fileoverview Authentication Constants and Validation Schemas
 * @module lib/actions/auth.constants
 *
 * Shared constants and validation schemas for authentication operations.
 * This file does NOT use "use server" so constants and schemas can be safely
 * imported in both client and server components.
 */ __turbopack_context__.s([
    "AUTH_CACHE_TAGS",
    ()=>AUTH_CACHE_TAGS,
    "changePasswordSchema",
    ()=>changePasswordSchema,
    "loginSchema",
    ()=>loginSchema,
    "passwordValidation",
    ()=>passwordValidation,
    "registerSchema",
    ()=>registerSchema,
    "resetPasswordSchema",
    ()=>resetPasswordSchema
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v4/classic/external.js [app-rsc] (ecmascript) <export * as z>");
;
const AUTH_CACHE_TAGS = {
    AUTH: 'auth-data'
};
// ==========================================
// VALIDATION SCHEMAS
// ==========================================
/**
 * Password validation requirements for security compliance
 *
 * Requirements:
 * - Minimum 12 characters (industry best practice, stronger than 8)
 * - At least one uppercase letter (A-Z)
 * - At least one lowercase letter (a-z)
 * - At least one number (0-9)
 * - At least one special character (!@#$%^&*()_+-=[]{}|;:,.<>?)
 *
 * These requirements meet NIST SP 800-63B guidelines and healthcare
 * security standards for protecting sensitive patient information.
 */ const PASSWORD_MIN_LENGTH = 12;
const PASSWORD_REGEX = {
    uppercase: /[A-Z]/,
    lowercase: /[a-z]/,
    number: /[0-9]/,
    special: /[!@#$%^&*()_+\-=[\]{}|;:,.<>?]/
};
const passwordValidation = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} characters`).regex(PASSWORD_REGEX.uppercase, 'Password must contain at least one uppercase letter').regex(PASSWORD_REGEX.lowercase, 'Password must contain at least one lowercase letter').regex(PASSWORD_REGEX.number, 'Password must contain at least one number').regex(PASSWORD_REGEX.special, 'Password must contain at least one special character (!@#$%^&*()_+-=[]{}|;:,.<>?)');
const loginSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    email: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().email('Invalid email address'),
    password: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, 'Password is required')
});
const registerSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    email: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().email('Invalid email address'),
    password: passwordValidation,
    confirmPassword: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, 'Password confirmation is required')
}).refine((data)=>data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: [
        'confirmPassword'
    ]
});
const changePasswordSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    currentPassword: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, 'Current password is required'),
    newPassword: passwordValidation,
    confirmPassword: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, 'Password confirmation is required')
}).refine((data)=>data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: [
        'confirmPassword'
    ]
}).refine((data)=>data.newPassword !== data.currentPassword, {
    message: "New password must be different from current password",
    path: [
        'newPassword'
    ]
});
const resetPasswordSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    password: passwordValidation,
    confirmPassword: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, 'Password confirmation is required')
}).refine((data)=>data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: [
        'confirmPassword'
    ]
});
}),
"[project]/src/identity-access/actions/auth.login.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @fileoverview Authentication Login Operations
 * @module lib/actions/auth.login
 *
 * Server actions for login and authentication operations.
 *
 * Features:
 * - Login form validation and processing
 * - Session creation and cookie management
 * - HIPAA audit logging for login events
 * - Rate limiting (IP and email based)
 * - Input sanitization and CSRF protection
 * - Standardized error handling
 */ /* __next_internal_action_entry_do_not_use__ [{"00e5178c953396b5876853110b8de30f92927fe248":"clearLoginForm","60a76c9a9b4ad7c70ac5696a449c9886d3c1f7e0b7":"handleLoginSubmission","60d28a293bf6fda9551b4c92a8f77081e29e580fbb":"loginAction"},"",""] */ __turbopack_context__.s([
    "clearLoginForm",
    ()=>clearLoginForm,
    "handleLoginSubmission",
    ()=>handleLoginSubmission,
    "loginAction",
    ()=>loginAction
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
// API integration
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$nextjs$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/api/nextjs-client.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/constants/api.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$audit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/audit.ts [app-rsc] (ecmascript)");
// Security helpers
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$lib$2f$helpers$2f$rate$2d$limit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/identity-access/lib/helpers/rate-limit.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$lib$2f$helpers$2f$input$2d$sanitization$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/identity-access/lib/helpers/input-sanitization.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$lib$2f$helpers$2f$action$2d$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/identity-access/lib/helpers/action-result.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$lib$2f$helpers$2f$zod$2d$errors$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/identity-access/lib/helpers/zod-errors.ts [app-rsc] (ecmascript)");
// Cookie configuration
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$lib$2f$config$2f$cookies$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/identity-access/lib/config/cookies.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$actions$2f$auth$2e$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/identity-access/actions/auth.constants.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
;
;
;
async function loginAction(_prevState, formData) {
    // Extract IP address for rate limiting
    const headersList = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["headers"])();
    const mockRequest = {
        headers: {
            get: (name)=>headersList.get(name)
        }
    };
    const ipAddress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$audit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["extractIPAddress"])(mockRequest);
    // Sanitize inputs before validation
    const email = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$lib$2f$helpers$2f$input$2d$sanitization$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["safeFormDataEmail"])(formData, 'email');
    const password = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$lib$2f$helpers$2f$input$2d$sanitization$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["safeFormDataPassword"])(formData, 'password');
    // Rate limiting: IP-based (prevents brute force from single IP)
    const ipRateLimit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$lib$2f$helpers$2f$rate$2d$limit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["checkRateLimit"])('login-ip', ipAddress, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$lib$2f$helpers$2f$rate$2d$limit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["RATE_LIMITS"].LOGIN_IP);
    if (ipRateLimit.limited) {
        // Audit rate limit violation
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$audit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["auditLog"])({
            userId: email || 'unknown',
            action: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$audit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["AUDIT_ACTIONS"].LOGIN_FAILED,
            resource: 'Authentication',
            details: `Rate limit exceeded from IP ${ipAddress}`,
            ipAddress,
            userAgent: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$audit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["extractUserAgent"])(mockRequest),
            success: false,
            errorMessage: 'Rate limit exceeded'
        });
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$lib$2f$helpers$2f$action$2d$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toLoginFormState"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$lib$2f$helpers$2f$action$2d$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["actionRateLimitError"])(ipRateLimit.resetIn));
    }
    // Rate limiting: Email-based (prevents targeted attacks on specific accounts)
    if (email) {
        const emailRateLimit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$lib$2f$helpers$2f$rate$2d$limit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["checkRateLimit"])('login-email', email, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$lib$2f$helpers$2f$rate$2d$limit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["RATE_LIMITS"].LOGIN_EMAIL);
        if (emailRateLimit.limited) {
            // Audit rate limit violation
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$audit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["auditLog"])({
                userId: email,
                action: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$audit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["AUDIT_ACTIONS"].LOGIN_FAILED,
                resource: 'Authentication',
                details: `Rate limit exceeded for email ${email}`,
                ipAddress,
                userAgent: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$audit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["extractUserAgent"])(mockRequest),
                success: false,
                errorMessage: 'Rate limit exceeded'
            });
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$lib$2f$helpers$2f$action$2d$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toLoginFormState"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$lib$2f$helpers$2f$action$2d$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["actionRateLimitError"])(emailRateLimit.resetIn));
        }
    }
    // Validate form data with Zod
    const validatedFields = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$actions$2f$auth$2e$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["loginSchema"].safeParse({
        email,
        password
    });
    if (!validatedFields.success) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$lib$2f$helpers$2f$action$2d$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toLoginFormState"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$lib$2f$helpers$2f$action$2d$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["actionValidationError"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$lib$2f$helpers$2f$zod$2d$errors$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatZodErrors"])(validatedFields.error)));
    }
    try {
        const { email: validatedEmail, password: validatedPassword } = validatedFields.data;
        // Call backend authentication endpoint
        const wrappedResponse = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$nextjs$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["serverPost"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].AUTH.LOGIN, {
            email: validatedEmail,
            password: validatedPassword
        }, {
            cache: 'no-store',
            requiresAuth: false,
            next: {
                tags: [
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$actions$2f$auth$2e$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["AUTH_CACHE_TAGS"].AUTH
                ]
            }
        });
        console.log('[Login Action] Response received:', {
            hasResponse: !!wrappedResponse,
            hasData: !!wrappedResponse?.data,
            responseKeys: wrappedResponse ? Object.keys(wrappedResponse) : []
        });
        // Backend wraps response in ApiResponse format - extract data
        const response = wrappedResponse?.data || wrappedResponse;
        console.log('[Login Action] Extracted auth data:', {
            hasAccessToken: !!response?.accessToken,
            hasRefreshToken: !!response?.refreshToken,
            hasUser: !!response?.user
        });
        // Check if we have valid authentication data
        if (!response || !response.accessToken) {
            // Audit failed login attempt
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$audit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["auditLog"])({
                userId: validatedEmail,
                action: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$audit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["AUDIT_ACTIONS"].LOGIN_FAILED,
                resource: 'Authentication',
                details: `Failed login attempt for ${validatedEmail}`,
                ipAddress,
                userAgent: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$audit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["extractUserAgent"])(mockRequest),
                success: false,
                errorMessage: 'Invalid credentials'
            });
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$lib$2f$helpers$2f$action$2d$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toLoginFormState"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$lib$2f$helpers$2f$action$2d$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["actionError"])([
                'Invalid credentials'
            ]));
        }
        // Extract data from successful response
        const { accessToken: token, refreshToken, user } = response;
        // Set HTTP-only cookies using centralized configuration
        const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
        console.log('[Login Action] Setting auth token:', {
            tokenLength: token?.length,
            tokenStart: token?.substring(0, 20),
            cookieName: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$lib$2f$config$2f$cookies$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["COOKIE_NAMES"].ACCESS_TOKEN
        });
        // Use centralized cookie configuration for consistent, secure settings
        cookieStore.set(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$lib$2f$config$2f$cookies$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["COOKIE_NAMES"].ACCESS_TOKEN, token, (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$lib$2f$config$2f$cookies$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAccessTokenCookieOptions"])());
        console.log('[Login Action] Auth token cookie set, verifying:', {
            cookieExists: !!cookieStore.get(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$lib$2f$config$2f$cookies$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["COOKIE_NAMES"].ACCESS_TOKEN),
            cookieValue: cookieStore.get(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$lib$2f$config$2f$cookies$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["COOKIE_NAMES"].ACCESS_TOKEN)?.value?.substring(0, 20)
        });
        if (refreshToken) {
            cookieStore.set(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$lib$2f$config$2f$cookies$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["COOKIE_NAMES"].REFRESH_TOKEN, refreshToken, (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$lib$2f$config$2f$cookies$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getRefreshTokenCookieOptions"])());
        }
        // Audit successful login
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$audit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["auditLog"])({
            userId: user.id,
            action: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$audit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["AUDIT_ACTIONS"].LOGIN,
            resource: 'Authentication',
            details: `User ${validatedEmail} logged in successfully`,
            ipAddress,
            userAgent: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$audit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["extractUserAgent"])(mockRequest),
            success: true
        });
        return {
            success: true
        };
    } catch (error) {
        console.error('[Login Action] Error:', error);
        // Handle NextApiClientError with more specific messaging
        if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$nextjs$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["NextApiClientError"]) {
            const errorMessage = error.message || 'Authentication failed. Please check your credentials.';
            // Audit API error
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$audit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["auditLog"])({
                userId: email || 'unknown',
                action: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$audit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["AUDIT_ACTIONS"].LOGIN_FAILED,
                resource: 'Authentication',
                details: `Login error: ${errorMessage}`,
                ipAddress,
                userAgent: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$audit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["extractUserAgent"])(mockRequest),
                success: false,
                errorMessage
            });
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$lib$2f$helpers$2f$action$2d$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toLoginFormState"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$lib$2f$helpers$2f$action$2d$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["actionError"])([
                errorMessage
            ]));
        }
        // Audit unexpected error
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$audit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["auditLog"])({
            userId: email || 'unknown',
            action: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$audit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["AUDIT_ACTIONS"].LOGIN_FAILED,
            resource: 'Authentication',
            details: 'Unexpected error during login',
            ipAddress,
            userAgent: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$audit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["extractUserAgent"])(mockRequest),
            success: false,
            errorMessage: error instanceof Error ? error.message : 'Unknown error'
        });
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$lib$2f$helpers$2f$action$2d$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toLoginFormState"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$lib$2f$helpers$2f$action$2d$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["actionError"])([
            'An unexpected error occurred. Please try again.'
        ]));
    }
}
async function handleLoginSubmission(prevState, formData) {
    const result = await loginAction(prevState, formData);
    if (result.success) {
        // Successful login - revalidate and redirect to dashboard
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/dashboard', 'page');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])('/dashboard');
    }
    return result;
}
async function clearLoginForm() {
    return {
        success: false,
        errors: undefined
    };
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    loginAction,
    handleLoginSubmission,
    clearLoginForm
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(loginAction, "60d28a293bf6fda9551b4c92a8f77081e29e580fbb", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(handleLoginSubmission, "60a76c9a9b4ad7c70ac5696a449c9886d3c1f7e0b7", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(clearLoginForm, "00e5178c953396b5876853110b8de30f92927fe248", null);
}),
"[project]/.next-internal/server/app/login/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/identity-access/actions/auth.login.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$actions$2f$auth$2e$login$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/identity-access/actions/auth.login.ts [app-rsc] (ecmascript)");
;
}),
"[project]/.next-internal/server/app/login/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/identity-access/actions/auth.login.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "60a76c9a9b4ad7c70ac5696a449c9886d3c1f7e0b7",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$actions$2f$auth$2e$login$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["handleLoginSubmission"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$login$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$identity$2d$access$2f$actions$2f$auth$2e$login$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/login/page/actions.js { ACTIONS_MODULE0 => "[project]/src/identity-access/actions/auth.login.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$actions$2f$auth$2e$login$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/identity-access/actions/auth.login.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=_505ea896._.js.map