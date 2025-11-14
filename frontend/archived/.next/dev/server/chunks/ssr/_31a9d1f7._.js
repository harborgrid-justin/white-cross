module.exports = [
"[project]/src/identity-access/lib/config/cookies.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @fileoverview Centralized Cookie Configuration
 * @module lib/config/cookies
 *
 * Single source of truth for all authentication cookie settings.
 * Implements security best practices including:
 * - __Host- prefix for maximum security
 * - Consistent naming across the application
 * - Secure defaults for production environments
 * - HIPAA-compliant session management
 *
 * Security Features:
 * - __Host- prefix prevents subdomain and path manipulation
 * - httpOnly prevents XSS attacks
 * - secure ensures HTTPS-only transmission
 * - sameSite prevents CSRF attacks
 * - Appropriate maxAge for healthcare security requirements
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie
 * @see https://web.dev/first-party-cookie-recipes/
 */ __turbopack_context__.s([
    "COOKIE_MAX_AGE",
    ()=>COOKIE_MAX_AGE,
    "COOKIE_NAMES",
    ()=>COOKIE_NAMES,
    "LEGACY_COOKIE_NAMES",
    ()=>LEGACY_COOKIE_NAMES,
    "clearAuthCookies",
    ()=>clearAuthCookies,
    "getAccessTokenCookieOptions",
    ()=>getAccessTokenCookieOptions,
    "getAccessTokenFromCookies",
    ()=>getAccessTokenFromCookies,
    "getRefreshTokenCookieOptions",
    ()=>getRefreshTokenCookieOptions,
    "getRefreshTokenFromCookies",
    ()=>getRefreshTokenFromCookies,
    "getSessionCookieOptions",
    ()=>getSessionCookieOptions
]);
const COOKIE_NAMES = {
    /** Access token for API authentication */ ACCESS_TOKEN: ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 'auth.token',
    /** Refresh token for obtaining new access tokens */ REFRESH_TOKEN: ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 'auth.refresh',
    /** Session identifier (if using session-based auth alongside JWT) */ SESSION_ID: ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 'auth.session'
};
const COOKIE_MAX_AGE = {
    /** Access token: 1 hour (short-lived for security) */ ACCESS_TOKEN: 60 * 60,
    /** Refresh token: 7 days (allows persistent login) */ REFRESH_TOKEN: 7 * 24 * 60 * 60,
    /** Session: 24 hours (daily re-authentication for HIPAA compliance) */ SESSION: 24 * 60 * 60
};
/**
 * Base cookie options for all authentication cookies
 * These settings ensure maximum security
 */ const BASE_COOKIE_OPTIONS = {
    /** Path where cookie is valid */ path: '/',
    /** Prevent JavaScript access (XSS protection) */ httpOnly: true,
    /** Strict CSRF protection - cookie only sent to same-site requests */ sameSite: 'strict',
    /** Only send over HTTPS in production */ secure: ("TURBOPACK compile-time value", "development") === 'production'
};
function getAccessTokenCookieOptions(overrides) {
    return {
        ...BASE_COOKIE_OPTIONS,
        maxAge: COOKIE_MAX_AGE.ACCESS_TOKEN,
        ...overrides
    };
}
function getRefreshTokenCookieOptions(overrides) {
    return {
        ...BASE_COOKIE_OPTIONS,
        maxAge: COOKIE_MAX_AGE.REFRESH_TOKEN,
        ...overrides
    };
}
function getSessionCookieOptions(overrides) {
    return {
        ...BASE_COOKIE_OPTIONS,
        maxAge: COOKIE_MAX_AGE.SESSION,
        ...overrides
    };
}
const LEGACY_COOKIE_NAMES = {
    auth_token: 'auth_token',
    refresh_token: 'refresh_token',
    authToken: 'authToken',
    refreshToken: 'refreshToken'
};
async function clearAuthCookies(cookieStore) {
    // Clear current cookies
    cookieStore.delete(COOKIE_NAMES.ACCESS_TOKEN);
    cookieStore.delete(COOKIE_NAMES.REFRESH_TOKEN);
    cookieStore.delete(COOKIE_NAMES.SESSION_ID);
    // Clear legacy cookies for migration
    Object.values(LEGACY_COOKIE_NAMES).forEach((name)=>{
        cookieStore.delete(name);
    });
}
function getAccessTokenFromCookies(cookieStore) {
    // Try new secure cookie name first
    let token = cookieStore.get(COOKIE_NAMES.ACCESS_TOKEN)?.value;
    if (token) {
        return token;
    }
    // Fall back to legacy names for migration
    for (const legacyName of Object.values(LEGACY_COOKIE_NAMES)){
        token = cookieStore.get(legacyName)?.value;
        if (token) {
            console.warn(`[Cookie Migration] Found token in legacy cookie '${legacyName}'. ` + `Please migrate to '${COOKIE_NAMES.ACCESS_TOKEN}' for improved security.`);
            return token;
        }
    }
    return null;
}
function getRefreshTokenFromCookies(cookieStore) {
    // Try new secure cookie name first
    const token = cookieStore.get(COOKIE_NAMES.REFRESH_TOKEN)?.value;
    if (token) {
        return token;
    }
    // Fall back to legacy refresh_token
    const legacyToken = cookieStore.get(LEGACY_COOKIE_NAMES.refresh_token)?.value || cookieStore.get(LEGACY_COOKIE_NAMES.refreshToken)?.value;
    if (legacyToken) {
        console.warn('[Cookie Migration] Found refresh token in legacy cookie. ' + `Please migrate to '${COOKIE_NAMES.REFRESH_TOKEN}' for improved security.`);
    }
    return legacyToken || null;
}
}),
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
 * Get authentication token from cookies (server-side only)
 */ async function getAuthToken() {
    try {
        const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
        // Use centralized cookie name configuration (environment-aware)
        return cookieStore.get(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$lib$2f$config$2f$cookies$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["COOKIE_NAMES"].ACCESS_TOKEN)?.value || null;
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
        SETTINGS: `/admin/settings`,
        // Users
        USERS: `/admin/users`,
        USER_BY_ID: (id)=>`/admin/users/${id}`,
        // Districts
        DISTRICTS: `/admin/districts`,
        DISTRICT_BY_ID: (id)=>`/admin/districts/${id}`,
        // Schools
        SCHOOLS: `/admin/schools`,
        SCHOOL_BY_ID: (id)=>`/admin/schools/${id}`,
        // System Health
        SYSTEM_HEALTH: `/admin/system/health`,
        // Backups
        BACKUPS: `/admin/backups`,
        BACKUP_BY_ID: (id)=>`/admin/backups/${id}`,
        // Licenses
        LICENSES: `/admin/licenses`,
        LICENSE_BY_ID: (id)=>`/admin/licenses/${id}`,
        LICENSE_DEACTIVATE: (id)=>`/admin/licenses/${id}/deactivate`,
        // Configurations
        CONFIGURATIONS: `/admin/configurations`,
        CONFIGURATION_BY_KEY: (key)=>`/admin/configurations/${key}`,
        // Performance Metrics
        METRICS: `/admin/metrics`,
        METRIC_BY_ID: (id)=>`/admin/metrics/${id}`,
        // Training
        TRAINING: `/admin/training`,
        TRAINING_BY_ID: (id)=>`/admin/training/${id}`,
        TRAINING_COMPLETE: (id)=>`/admin/training/${id}/complete`,
        TRAINING_PROGRESS: (userId)=>`/admin/training/progress/${userId}`,
        // Audit Logs
        AUDIT_LOGS: `/admin/audit-logs`,
        AUDIT_LOG_BY_ID: (id)=>`/admin/audit-logs/${id}`
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
"[project]/src/utils/validation/userValidation.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @fileoverview User validation utilities
 * @module utils/validation/userValidation
 */ /**
 * Validate email address
 */ __turbopack_context__.s([
    "validateDateOfBirth",
    ()=>validateDateOfBirth,
    "validateEmail",
    ()=>validateEmail,
    "validateEmergencyContact",
    ()=>validateEmergencyContact,
    "validateName",
    ()=>validateName,
    "validatePassword",
    ()=>validatePassword,
    "validatePhone",
    ()=>validatePhone,
    "validateRequired",
    ()=>validateRequired,
    "validateSSN",
    ()=>validateSSN,
    "validateZipCode",
    ()=>validateZipCode
]);
function validateEmail(email) {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
function validatePhone(phone) {
    if (!phone) return false;
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    // Check for valid US phone number (10 or 11 digits)
    return cleaned.length === 10 || cleaned.length === 11 && cleaned.startsWith('1');
}
function validateRequired(value) {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim().length > 0;
    if (typeof value === 'number') return !isNaN(value);
    if (typeof value === 'boolean') return true;
    return false;
}
function validatePassword(password) {
    const errors = [];
    if (!password) {
        errors.push('Password is required');
        return {
            isValid: false,
            errors
        };
    }
    if (password.length < 8) {
        errors.push('Password must be at least 8 characters long');
    }
    if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
    }
    if (!/\d/.test(password)) {
        errors.push('Password must contain at least one number');
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        errors.push('Password must contain at least one special character');
    }
    return {
        isValid: errors.length === 0,
        errors
    };
}
function validateName(name) {
    if (!name) return false;
    // Allow letters, spaces, hyphens, and apostrophes
    const nameRegex = /^[a-zA-Z\s\-']+$/;
    return nameRegex.test(name.trim()) && name.trim().length >= 2;
}
function validateDateOfBirth(dob) {
    if (!dob) {
        return {
            isValid: false,
            error: 'Date of birth is required'
        };
    }
    const date = new Date(dob);
    const now = new Date();
    if (isNaN(date.getTime())) {
        return {
            isValid: false,
            error: 'Invalid date format'
        };
    }
    if (date > now) {
        return {
            isValid: false,
            error: 'Date of birth cannot be in the future'
        };
    }
    // Check if age is reasonable (not older than 150 years)
    const age = now.getFullYear() - date.getFullYear();
    if (age > 150) {
        return {
            isValid: false,
            error: 'Date of birth is too far in the past'
        };
    }
    return {
        isValid: true
    };
}
function validateZipCode(zipCode) {
    if (!zipCode) return false;
    // US ZIP code format: 12345 or 12345-6789
    const zipRegex = /^\d{5}(-\d{4})?$/;
    return zipRegex.test(zipCode.trim());
}
function validateSSN(ssn) {
    if (!ssn) return false;
    // Remove all non-digit characters
    const cleaned = ssn.replace(/\D/g, '');
    // Must be exactly 9 digits
    if (cleaned.length !== 9) return false;
    // Cannot be all zeros or certain invalid patterns
    if (cleaned === '000000000' || cleaned === '123456789') return false;
    return true;
}
function validateEmergencyContact(contact) {
    const errors = {};
    if (!contact.name || !validateName(contact.name)) {
        errors.name = 'Valid contact name is required';
    }
    if (!contact.phone || !validatePhone(contact.phone)) {
        errors.phone = 'Valid phone number is required';
    }
    if (!contact.relationship || contact.relationship.trim().length < 2) {
        errors.relationship = 'Relationship is required';
    }
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}
}),
"[project]/src/utils/formatters.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @fileoverview Utility functions for formatting data
 * @module utils/formatters
 */ /**
 * Format a date string to a readable format
 */ __turbopack_context__.s([
    "formatCurrency",
    ()=>formatCurrency,
    "formatDate",
    ()=>formatDate,
    "formatFileSize",
    ()=>formatFileSize,
    "formatName",
    ()=>formatName,
    "formatPercentage",
    ()=>formatPercentage,
    "formatPhone",
    ()=>formatPhone
]);
function formatDate(date, format = 'short') {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) {
        return '';
    }
    switch(format){
        case 'short':
            return dateObj.toLocaleDateString();
        case 'long':
            return dateObj.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        case 'full':
            return dateObj.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        default:
            return dateObj.toLocaleDateString();
    }
}
function formatName(firstName, lastName, format = 'full') {
    if (!firstName && !lastName) return '';
    switch(format){
        case 'full':
            return `${firstName || ''} ${lastName || ''}`.trim();
        case 'lastFirst':
            return `${lastName || ''}, ${firstName || ''}`.trim().replace(/^,\s*/, '').replace(/,\s*$/, '');
        case 'firstInitial':
            const initial = firstName ? firstName.charAt(0).toUpperCase() + '.' : '';
            return `${initial} ${lastName || ''}`.trim();
        default:
            return `${firstName || ''} ${lastName || ''}`.trim();
    }
}
function formatPhone(phone) {
    if (!phone) return '';
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    // Format as (XXX) XXX-XXXX
    if (cleaned.length === 10) {
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    // Format as +X (XXX) XXX-XXXX for international
    if (cleaned.length === 11 && cleaned.startsWith('1')) {
        return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    }
    // Return original if can't format
    return phone;
}
function formatCurrency(amount, currency = 'USD') {
    if (typeof amount !== 'number') return '$0.00';
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency
    }).format(amount);
}
function formatPercentage(value, decimals = 1) {
    if (typeof value !== 'number') return '0%';
    return `${(value * 100).toFixed(decimals)}%`;
}
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = [
        'Bytes',
        'KB',
        'MB',
        'GB',
        'TB'
    ];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
}),
"[project]/src/lib/actions/admin.users.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @fileoverview Admin User Management Operations
 * @module lib/actions/admin.users
 *
 * HIPAA-compliant server actions for admin user management.
 * Includes caching, audit logging, and comprehensive error handling.
 */ /* __next_internal_action_entry_do_not_use__ [{"404c323a2c82d9772a14281d00851a94a53053c97a":"createAdminUserFromForm","40a521c0889536c5ec0f0840bb1df44e324452a90e":"deleteAdminUserAction","40b23f3f83386c74f50dd0bf1ce1c4dceed3eba9e9":"createAdminUserAction","604a5be9706687f48517dfa2c26893dba3f84c0e5d":"updateAdminUserFromForm","60a1b38f250c9a1418ed4c3f8d6d22aafb1c402486":"updateAdminUserAction"},"",""] */ __turbopack_context__.s([
    "createAdminUserAction",
    ()=>createAdminUserAction,
    "createAdminUserFromForm",
    ()=>createAdminUserFromForm,
    "deleteAdminUserAction",
    ()=>deleteAdminUserAction,
    "updateAdminUserAction",
    ()=>updateAdminUserAction,
    "updateAdminUserFromForm",
    ()=>updateAdminUserFromForm
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$nextjs$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/api/nextjs-client.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/constants/api.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$audit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/audit.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cache$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/cache/constants.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$validation$2f$userValidation$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/validation/userValidation.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$formatters$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/formatters.ts [app-rsc] (ecmascript)");
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
async function createAdminUserAction(data) {
    try {
        // Validate required fields
        if (!data.email || !data.firstName || !data.lastName || !data.role || !data.password) {
            return {
                success: false,
                error: 'Missing required fields: email, firstName, lastName, role, password'
            };
        }
        // Validate email format
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$validation$2f$userValidation$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["validateEmail"])(data.email)) {
            return {
                success: false,
                error: 'Invalid email format'
            };
        }
        const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$nextjs$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["serverPost"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].ADMIN.USERS, data, {
            cache: 'no-store',
            next: {
                tags: [
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cache$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CACHE_TAGS"].ADMIN_USERS
                ]
            }
        });
        if (!response.success || !response.data) {
            throw new Error(response.message || 'Failed to create admin user');
        }
        // AUDIT LOG - Admin user creation
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$audit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["auditLog"])({
            action: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$audit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["AUDIT_ACTIONS"].CREATE_USER,
            resource: 'AdminUser',
            resourceId: response.data.id,
            details: `Created admin user: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$formatters$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatName"])(data.firstName, data.lastName)} (${data.email})`,
            success: true
        });
        // Cache invalidation
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidateTag"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cache$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CACHE_TAGS"].ADMIN_USERS, 'default');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidateTag"])('admin-user-list', 'default');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/admin/users', 'page');
        return {
            success: true,
            data: response.data,
            message: 'Admin user created successfully'
        };
    } catch (error) {
        const errorMessage = error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$nextjs$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["NextApiClientError"] ? error.message : error instanceof Error ? error.message : 'Failed to create admin user';
        // AUDIT LOG - Log failed attempt
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$audit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["auditLog"])({
            action: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$audit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["AUDIT_ACTIONS"].CREATE_USER,
            resource: 'AdminUser',
            details: `Failed to create admin user: ${errorMessage}`,
            success: false,
            errorMessage
        });
        return {
            success: false,
            error: errorMessage
        };
    }
}
async function updateAdminUserAction(userId, data) {
    try {
        if (!userId) {
            return {
                success: false,
                error: 'User ID is required'
            };
        }
        // Validate email if provided
        if (data.email && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$validation$2f$userValidation$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["validateEmail"])(data.email)) {
            return {
                success: false,
                error: 'Invalid email format'
            };
        }
        const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$nextjs$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["serverPut"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].ADMIN.USER_BY_ID(userId), data, {
            cache: 'no-store',
            next: {
                tags: [
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cache$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CACHE_TAGS"].ADMIN_USERS,
                    `admin-user-${userId}`
                ]
            }
        });
        if (!response.success || !response.data) {
            throw new Error(response.message || 'Failed to update admin user');
        }
        // AUDIT LOG - Admin user update
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$audit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["auditLog"])({
            action: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$audit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["AUDIT_ACTIONS"].UPDATE_USER,
            resource: 'AdminUser',
            resourceId: userId,
            details: 'Updated admin user information',
            changes: data,
            success: true
        });
        // Cache invalidation
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidateTag"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cache$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CACHE_TAGS"].ADMIN_USERS, 'default');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidateTag"])(`admin-user-${userId}`, 'default');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidateTag"])('admin-user-list', 'default');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/admin/users', 'page');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/admin/users/${userId}`, 'page');
        return {
            success: true,
            data: response.data,
            message: 'Admin user updated successfully'
        };
    } catch (error) {
        const errorMessage = error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$nextjs$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["NextApiClientError"] ? error.message : error instanceof Error ? error.message : 'Failed to update admin user';
        // AUDIT LOG - Log failed attempt
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$audit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["auditLog"])({
            action: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$audit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["AUDIT_ACTIONS"].UPDATE_USER,
            resource: 'AdminUser',
            resourceId: userId,
            details: `Failed to update admin user: ${errorMessage}`,
            success: false,
            errorMessage
        });
        return {
            success: false,
            error: errorMessage
        };
    }
}
async function deleteAdminUserAction(userId) {
    try {
        if (!userId) {
            return {
                success: false,
                error: 'User ID is required'
            };
        }
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$nextjs$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["serverDelete"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].ADMIN.USER_BY_ID(userId), {
            cache: 'no-store',
            next: {
                tags: [
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cache$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CACHE_TAGS"].ADMIN_USERS,
                    `admin-user-${userId}`
                ]
            }
        });
        // AUDIT LOG - Admin user deletion
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$audit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["auditLog"])({
            action: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$audit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["AUDIT_ACTIONS"].DELETE_USER,
            resource: 'AdminUser',
            resourceId: userId,
            details: 'Deleted admin user (soft delete)',
            success: true
        });
        // Cache invalidation
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidateTag"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cache$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CACHE_TAGS"].ADMIN_USERS, 'default');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidateTag"])(`admin-user-${userId}`, 'default');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidateTag"])('admin-user-list', 'default');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/admin/users', 'page');
        return {
            success: true,
            message: 'Admin user deleted successfully'
        };
    } catch (error) {
        const errorMessage = error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$nextjs$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["NextApiClientError"] ? error.message : error instanceof Error ? error.message : 'Failed to delete admin user';
        // AUDIT LOG - Log failed attempt
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$audit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["auditLog"])({
            action: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$audit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["AUDIT_ACTIONS"].DELETE_USER,
            resource: 'AdminUser',
            resourceId: userId,
            details: `Failed to delete admin user: ${errorMessage}`,
            success: false,
            errorMessage
        });
        return {
            success: false,
            error: errorMessage
        };
    }
}
async function createAdminUserFromForm(formData) {
    const userData = {
        email: formData.get('email'),
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        role: formData.get('role'),
        password: formData.get('password'),
        isActive: formData.get('isActive') === 'true'
    };
    const result = await createAdminUserAction(userData);
    if (result.success && result.data) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])(`/admin/users/${result.data.id}`);
    }
    return result;
}
async function updateAdminUserFromForm(userId, formData) {
    const updateData = {
        email: formData.get('email') || undefined,
        firstName: formData.get('firstName') || undefined,
        lastName: formData.get('lastName') || undefined,
        role: formData.get('role') || undefined,
        isActive: formData.has('isActive') ? formData.get('isActive') === 'true' : undefined
    };
    // Filter out undefined values
    const filteredData = Object.entries(updateData).reduce((acc, [key, value])=>{
        if (value !== undefined) {
            acc[key] = value;
        }
        return acc;
    }, {});
    const result = await updateAdminUserAction(userId, filteredData);
    if (result.success && result.data) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])(`/admin/users/${result.data.id}`);
    }
    return result;
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    createAdminUserAction,
    updateAdminUserAction,
    deleteAdminUserAction,
    createAdminUserFromForm,
    updateAdminUserFromForm
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createAdminUserAction, "40b23f3f83386c74f50dd0bf1ce1c4dceed3eba9e9", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateAdminUserAction, "60a1b38f250c9a1418ed4c3f8d6d22aafb1c402486", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(deleteAdminUserAction, "40a521c0889536c5ec0f0840bb1df44e324452a90e", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createAdminUserFromForm, "404c323a2c82d9772a14281d00851a94a53053c97a", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateAdminUserFromForm, "604a5be9706687f48517dfa2c26893dba3f84c0e5d", null);
}),
"[project]/.next-internal/server/app/(dashboard)/admin/settings/users/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/app/(dashboard)/admin/settings/users/page.tsx [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/src/lib/actions/admin.users.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$dashboard$292f$admin$2f$settings$2f$users$2f$page$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/(dashboard)/admin/settings/users/page.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$admin$2e$users$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/actions/admin.users.ts [app-rsc] (ecmascript)");
;
;
;
;
}),
"[project]/.next-internal/server/app/(dashboard)/admin/settings/users/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/app/(dashboard)/admin/settings/users/page.tsx [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/src/lib/actions/admin.users.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "40a521c0889536c5ec0f0840bb1df44e324452a90e",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$admin$2e$users$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["deleteAdminUserAction"],
    "c0c1f56de92bbbe41a8a6ba5a1b456ecfaaf11ebcc",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$dashboard$292f$admin$2f$settings$2f$users$2f$page$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["$$RSC_SERVER_CACHE_0"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f28$dashboard$292f$admin$2f$settings$2f$users$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f28$dashboard$292f$admin$2f$settings$2f$users$2f$page$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$actions$2f$admin$2e$users$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/(dashboard)/admin/settings/users/page/actions.js { ACTIONS_MODULE0 => "[project]/src/app/(dashboard)/admin/settings/users/page.tsx [app-rsc] (ecmascript)", ACTIONS_MODULE1 => "[project]/src/lib/actions/admin.users.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$dashboard$292f$admin$2f$settings$2f$users$2f$page$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/(dashboard)/admin/settings/users/page.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$admin$2e$users$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/actions/admin.users.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=_31a9d1f7._.js.map