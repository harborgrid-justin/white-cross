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
"[project]/src/lib/actions/admin.districts.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @fileoverview Admin Districts Management Server Actions
 * @module lib/actions/admin.districts
 * @category Admin - Server Actions
 */ /* __next_internal_action_entry_do_not_use__ [{"0018872ad5d456a505fdf08b70ef1f44e4d171c220":"revalidateDistrictsCache","401b780634ff25f1a8b3dec22b12dcd686d7117d89":"getAdminDistricts","40a4903b9e2b0fe165598adca72db362ce04e082be":"getAdminDistrictById"},"",""] */ __turbopack_context__.s([
    "getAdminDistrictById",
    ()=>getAdminDistrictById,
    "getAdminDistricts",
    ()=>getAdminDistricts,
    "revalidateDistrictsCache",
    ()=>revalidateDistrictsCache
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$nextjs$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/api/nextjs-client.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/constants/api.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cache$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/cache/constants.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
;
/**
 * Fetch districts data with server-side caching
 */ async function fetchDistrictsData(searchParams = {}) {
    const params = new URLSearchParams();
    if (searchParams.search) params.append('search', searchParams.search);
    if (searchParams.status && searchParams.status !== 'all') {
        params.append('status', searchParams.status);
    }
    if (searchParams.page) params.append('page', searchParams.page.toString());
    if (searchParams.limit) params.append('limit', searchParams.limit.toString());
    const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$nextjs$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["serverGet"])(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].ADMIN.DISTRICTS}?${params.toString()}`);
    return response;
}
async function getAdminDistricts(searchParams = {}) {
    try {
        const data = await fetchDistrictsData(searchParams);
        return {
            success: true,
            data
        };
    } catch (error) {
        console.error('Error fetching admin districts:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to fetch districts',
            data: {
                districts: [],
                total: 0,
                page: 1,
                totalPages: 0
            }
        };
    }
}
/**
 * Get single district by ID
 */ async function fetchDistrictById(id) {
    const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$nextjs$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["serverGet"])(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].ADMIN.DISTRICTS}/${id}`);
    return response;
}
async function getAdminDistrictById(id) {
    try {
        const data = await fetchDistrictById(id);
        return {
            success: true,
            data
        };
    } catch (error) {
        console.error('Error fetching district:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to fetch district',
            data: null
        };
    }
}
async function revalidateDistrictsCache() {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidateTag"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cache$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CACHE_TAGS"].ADMIN_DISTRICTS, 'default');
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getAdminDistricts,
    getAdminDistrictById,
    revalidateDistrictsCache
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getAdminDistricts, "401b780634ff25f1a8b3dec22b12dcd686d7117d89", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getAdminDistrictById, "40a4903b9e2b0fe165598adca72db362ce04e082be", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(revalidateDistrictsCache, "0018872ad5d456a505fdf08b70ef1f44e4d171c220", null);
}),
"[project]/src/components/ui/badge.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "Badge",
    ()=>Badge,
    "badgeVariants",
    ()=>badgeVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const Badge = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call Badge() from the server but Badge is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/components/ui/badge.tsx <module evaluation>", "Badge");
const badgeVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call badgeVariants() from the server but badgeVariants is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/components/ui/badge.tsx <module evaluation>", "badgeVariants");
}),
"[project]/src/components/ui/badge.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "Badge",
    ()=>Badge,
    "badgeVariants",
    ()=>badgeVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const Badge = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call Badge() from the server but Badge is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/components/ui/badge.tsx", "Badge");
const badgeVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call badgeVariants() from the server but badgeVariants is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/components/ui/badge.tsx", "badgeVariants");
}),
"[project]/src/components/ui/badge.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/src/components/ui/badge.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/src/components/ui/badge.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/src/app/(dashboard)/admin/_components/AdminPageHeader.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @fileoverview Reusable Admin Page Header Component
 * @module app/(dashboard)/admin/_components/AdminPageHeader
 * @category Admin - Components
 */ __turbopack_context__.s([
    "AdminPageHeader",
    ()=>AdminPageHeader
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/badge.tsx [app-rsc] (ecmascript)");
;
;
function AdminPageHeader({ title, description, count, countLabel = 'items', actions, status }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "min-w-0 flex-1",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: "text-2xl font-bold text-gray-900",
                                    children: title
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(dashboard)/admin/_components/AdminPageHeader.tsx",
                                    lineNumber: 50,
                                    columnNumber: 13
                                }, this),
                                description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-gray-600 mt-1",
                                    children: description
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(dashboard)/admin/_components/AdminPageHeader.tsx",
                                    lineNumber: 52,
                                    columnNumber: 15
                                }, this),
                                typeof count === 'number' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-gray-500 mt-1",
                                    children: [
                                        count,
                                        " ",
                                        countLabel
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/(dashboard)/admin/_components/AdminPageHeader.tsx",
                                    lineNumber: 55,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(dashboard)/admin/_components/AdminPageHeader.tsx",
                            lineNumber: 49,
                            columnNumber: 11
                        }, this),
                        status && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Badge"], {
                            variant: status.variant,
                            className: "flex items-center gap-1",
                            children: [
                                status.icon,
                                status.label
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(dashboard)/admin/_components/AdminPageHeader.tsx",
                            lineNumber: 61,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(dashboard)/admin/_components/AdminPageHeader.tsx",
                    lineNumber: 48,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/(dashboard)/admin/_components/AdminPageHeader.tsx",
                lineNumber: 47,
                columnNumber: 7
            }, this),
            actions && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2 flex-shrink-0",
                children: actions
            }, void 0, false, {
                fileName: "[project]/src/app/(dashboard)/admin/_components/AdminPageHeader.tsx",
                lineNumber: 73,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/(dashboard)/admin/_components/AdminPageHeader.tsx",
        lineNumber: 46,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/app/(dashboard)/admin/settings/districts/_components/DistrictsManagementContent.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "DistrictsManagementContent",
    ()=>DistrictsManagementContent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const DistrictsManagementContent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call DistrictsManagementContent() from the server but DistrictsManagementContent is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/app/(dashboard)/admin/settings/districts/_components/DistrictsManagementContent.tsx <module evaluation>", "DistrictsManagementContent");
}),
"[project]/src/app/(dashboard)/admin/settings/districts/_components/DistrictsManagementContent.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "DistrictsManagementContent",
    ()=>DistrictsManagementContent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const DistrictsManagementContent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call DistrictsManagementContent() from the server but DistrictsManagementContent is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/app/(dashboard)/admin/settings/districts/_components/DistrictsManagementContent.tsx", "DistrictsManagementContent");
}),
"[project]/src/app/(dashboard)/admin/settings/districts/_components/DistrictsManagementContent.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$dashboard$292f$admin$2f$settings$2f$districts$2f$_components$2f$DistrictsManagementContent$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/src/app/(dashboard)/admin/settings/districts/_components/DistrictsManagementContent.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$dashboard$292f$admin$2f$settings$2f$districts$2f$_components$2f$DistrictsManagementContent$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/src/app/(dashboard)/admin/settings/districts/_components/DistrictsManagementContent.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$dashboard$292f$admin$2f$settings$2f$districts$2f$_components$2f$DistrictsManagementContent$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/src/app/(dashboard)/admin/settings/districts/_components/DistrictsManagementSkeleton.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @fileoverview Districts Management Skeleton Component
 * @module app/(dashboard)/admin/settings/districts/_components/DistrictsManagementSkeleton
 * @category Admin - Components
 */ __turbopack_context__.s([
    "DistrictsManagementSkeleton",
    ()=>DistrictsManagementSkeleton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$dashboard$292f$admin$2f$_components$2f$AdminPageHeader$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/(dashboard)/admin/_components/AdminPageHeader.tsx [app-rsc] (ecmascript)");
;
;
function DistrictsManagementSkeleton() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$dashboard$292f$admin$2f$_components$2f$AdminPageHeader$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["AdminPageHeader"], {
                title: "Districts Management",
                description: "Manage school districts and their information",
                actions: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex gap-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-9 w-20 bg-gray-200 rounded animate-pulse"
                        }, void 0, false, {
                            fileName: "[project]/src/app/(dashboard)/admin/settings/districts/_components/DistrictsManagementSkeleton.tsx",
                            lineNumber: 22,
                            columnNumber: 13
                        }, void 0),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-9 w-28 bg-gray-200 rounded animate-pulse"
                        }, void 0, false, {
                            fileName: "[project]/src/app/(dashboard)/admin/settings/districts/_components/DistrictsManagementSkeleton.tsx",
                            lineNumber: 23,
                            columnNumber: 13
                        }, void 0)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(dashboard)/admin/settings/districts/_components/DistrictsManagementSkeleton.tsx",
                    lineNumber: 21,
                    columnNumber: 11
                }, void 0)
            }, void 0, false, {
                fileName: "[project]/src/app/(dashboard)/admin/settings/districts/_components/DistrictsManagementSkeleton.tsx",
                lineNumber: 17,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-end gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-9 w-20 bg-gray-200 rounded animate-pulse"
                    }, void 0, false, {
                        fileName: "[project]/src/app/(dashboard)/admin/settings/districts/_components/DistrictsManagementSkeleton.tsx",
                        lineNumber: 30,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-9 w-28 bg-gray-200 rounded animate-pulse"
                    }, void 0, false, {
                        fileName: "[project]/src/app/(dashboard)/admin/settings/districts/_components/DistrictsManagementSkeleton.tsx",
                        lineNumber: 31,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/(dashboard)/admin/settings/districts/_components/DistrictsManagementSkeleton.tsx",
                lineNumber: 29,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white rounded-lg shadow p-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col lg:flex-row gap-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex-1 h-10 bg-gray-200 rounded animate-pulse"
                        }, void 0, false, {
                            fileName: "[project]/src/app/(dashboard)/admin/settings/districts/_components/DistrictsManagementSkeleton.tsx",
                            lineNumber: 37,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-full lg:w-48 h-10 bg-gray-200 rounded animate-pulse"
                        }, void 0, false, {
                            fileName: "[project]/src/app/(dashboard)/admin/settings/districts/_components/DistrictsManagementSkeleton.tsx",
                            lineNumber: 38,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-20 h-10 bg-gray-200 rounded animate-pulse"
                        }, void 0, false, {
                            fileName: "[project]/src/app/(dashboard)/admin/settings/districts/_components/DistrictsManagementSkeleton.tsx",
                            lineNumber: 39,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(dashboard)/admin/settings/districts/_components/DistrictsManagementSkeleton.tsx",
                    lineNumber: 36,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/(dashboard)/admin/settings/districts/_components/DistrictsManagementSkeleton.tsx",
                lineNumber: 35,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white rounded-lg shadow overflow-hidden",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-gray-50 border-b border-gray-200",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "px-6 py-3 flex-1",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "h-4 w-16 bg-gray-200 rounded animate-pulse"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(dashboard)/admin/settings/districts/_components/DistrictsManagementSkeleton.tsx",
                                        lineNumber: 49,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(dashboard)/admin/settings/districts/_components/DistrictsManagementSkeleton.tsx",
                                    lineNumber: 48,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "px-6 py-3 flex-1",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "h-4 w-20 bg-gray-200 rounded animate-pulse"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(dashboard)/admin/settings/districts/_components/DistrictsManagementSkeleton.tsx",
                                        lineNumber: 52,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(dashboard)/admin/settings/districts/_components/DistrictsManagementSkeleton.tsx",
                                    lineNumber: 51,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "px-6 py-3 flex-1",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "h-4 w-16 bg-gray-200 rounded animate-pulse"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(dashboard)/admin/settings/districts/_components/DistrictsManagementSkeleton.tsx",
                                        lineNumber: 55,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(dashboard)/admin/settings/districts/_components/DistrictsManagementSkeleton.tsx",
                                    lineNumber: 54,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "px-6 py-3 w-24",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "h-4 w-12 bg-gray-200 rounded animate-pulse"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(dashboard)/admin/settings/districts/_components/DistrictsManagementSkeleton.tsx",
                                        lineNumber: 58,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(dashboard)/admin/settings/districts/_components/DistrictsManagementSkeleton.tsx",
                                    lineNumber: 57,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "px-6 py-3 w-24",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "h-4 w-12 bg-gray-200 rounded animate-pulse"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(dashboard)/admin/settings/districts/_components/DistrictsManagementSkeleton.tsx",
                                        lineNumber: 61,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(dashboard)/admin/settings/districts/_components/DistrictsManagementSkeleton.tsx",
                                    lineNumber: 60,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(dashboard)/admin/settings/districts/_components/DistrictsManagementSkeleton.tsx",
                            lineNumber: 47,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/(dashboard)/admin/settings/districts/_components/DistrictsManagementSkeleton.tsx",
                        lineNumber: 46,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "divide-y divide-gray-200",
                        children: [
                            ...Array(8)
                        ].map((_, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "px-6 py-4 flex-1",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "w-9 h-9 bg-gray-200 rounded-lg animate-pulse"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(dashboard)/admin/settings/districts/_components/DistrictsManagementSkeleton.tsx",
                                                    lineNumber: 72,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "h-4 w-32 bg-gray-200 rounded animate-pulse"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/(dashboard)/admin/settings/districts/_components/DistrictsManagementSkeleton.tsx",
                                                            lineNumber: 74,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "h-3 w-20 bg-gray-200 rounded animate-pulse"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/(dashboard)/admin/settings/districts/_components/DistrictsManagementSkeleton.tsx",
                                                            lineNumber: 75,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/(dashboard)/admin/settings/districts/_components/DistrictsManagementSkeleton.tsx",
                                                    lineNumber: 73,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/(dashboard)/admin/settings/districts/_components/DistrictsManagementSkeleton.tsx",
                                            lineNumber: 71,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(dashboard)/admin/settings/districts/_components/DistrictsManagementSkeleton.tsx",
                                        lineNumber: 70,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "px-6 py-4 flex-1",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "h-4 w-48 bg-gray-200 rounded animate-pulse"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(dashboard)/admin/settings/districts/_components/DistrictsManagementSkeleton.tsx",
                                            lineNumber: 80,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(dashboard)/admin/settings/districts/_components/DistrictsManagementSkeleton.tsx",
                                        lineNumber: 79,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "px-6 py-4 flex-1",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "h-4 w-28 bg-gray-200 rounded animate-pulse"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(dashboard)/admin/settings/districts/_components/DistrictsManagementSkeleton.tsx",
                                                    lineNumber: 84,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "h-3 w-36 bg-gray-200 rounded animate-pulse"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(dashboard)/admin/settings/districts/_components/DistrictsManagementSkeleton.tsx",
                                                    lineNumber: 85,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/(dashboard)/admin/settings/districts/_components/DistrictsManagementSkeleton.tsx",
                                            lineNumber: 83,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(dashboard)/admin/settings/districts/_components/DistrictsManagementSkeleton.tsx",
                                        lineNumber: 82,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "px-6 py-4 w-24",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "h-4 w-8 bg-gray-200 rounded animate-pulse"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(dashboard)/admin/settings/districts/_components/DistrictsManagementSkeleton.tsx",
                                            lineNumber: 89,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(dashboard)/admin/settings/districts/_components/DistrictsManagementSkeleton.tsx",
                                        lineNumber: 88,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "px-6 py-4 w-24",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "h-6 w-16 bg-gray-200 rounded-full animate-pulse"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(dashboard)/admin/settings/districts/_components/DistrictsManagementSkeleton.tsx",
                                            lineNumber: 92,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(dashboard)/admin/settings/districts/_components/DistrictsManagementSkeleton.tsx",
                                        lineNumber: 91,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, index, true, {
                                fileName: "[project]/src/app/(dashboard)/admin/settings/districts/_components/DistrictsManagementSkeleton.tsx",
                                lineNumber: 69,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/app/(dashboard)/admin/settings/districts/_components/DistrictsManagementSkeleton.tsx",
                        lineNumber: 67,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/(dashboard)/admin/settings/districts/_components/DistrictsManagementSkeleton.tsx",
                lineNumber: 44,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "h-4 w-40 bg-gray-200 rounded animate-pulse mx-auto"
                }, void 0, false, {
                    fileName: "[project]/src/app/(dashboard)/admin/settings/districts/_components/DistrictsManagementSkeleton.tsx",
                    lineNumber: 101,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/(dashboard)/admin/settings/districts/_components/DistrictsManagementSkeleton.tsx",
                lineNumber: 100,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/(dashboard)/admin/settings/districts/_components/DistrictsManagementSkeleton.tsx",
        lineNumber: 15,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/app/(dashboard)/admin/settings/districts/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @fileoverview Districts Management Page - Enhanced with Next.js v16 features
 * @module app/(dashboard)/admin/settings/districts/page
 * @category Admin - Settings Pages
 */ __turbopack_context__.s([
    "default",
    ()=>DistrictsPage,
    "metadata",
    ()=>metadata
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$admin$2e$districts$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/actions/admin.districts.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$dashboard$292f$admin$2f$_components$2f$AdminPageHeader$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/(dashboard)/admin/_components/AdminPageHeader.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$dashboard$292f$admin$2f$settings$2f$districts$2f$_components$2f$DistrictsManagementContent$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/(dashboard)/admin/settings/districts/_components/DistrictsManagementContent.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$dashboard$292f$admin$2f$settings$2f$districts$2f$_components$2f$DistrictsManagementSkeleton$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/(dashboard)/admin/settings/districts/_components/DistrictsManagementSkeleton.tsx [app-rsc] (ecmascript)");
;
;
;
;
;
;
const metadata = {
    title: 'Districts Management',
    description: 'Manage school districts, addresses, and contact information',
    robots: {
        index: false,
        follow: false
    }
};
/**
 * Server component for districts data fetching with caching
 */ async function DistrictsContent({ searchParams }) {
    // Parse search parameters for server-side data fetching
    const params = {
        search: typeof searchParams.search === 'string' ? searchParams.search : undefined,
        status: typeof searchParams.status === 'string' ? searchParams.status : 'all',
        page: typeof searchParams.page === 'string' ? parseInt(searchParams.page) : 1,
        limit: typeof searchParams.limit === 'string' ? parseInt(searchParams.limit) : 20
    };
    // Server-side data fetching with 'use cache' directive
    const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$admin$2e$districts$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAdminDistricts"])(params);
    if (!result.success) {
        throw new Error(result.error || 'Failed to load districts');
    }
    const { districts, total } = result.data;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$dashboard$292f$admin$2f$_components$2f$AdminPageHeader$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["AdminPageHeader"], {
                title: "Districts Management",
                description: "Manage school districts and their information",
                count: total,
                countLabel: "districts"
            }, void 0, false, {
                fileName: "[project]/src/app/(dashboard)/admin/settings/districts/page.tsx",
                lineNumber: 48,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$dashboard$292f$admin$2f$settings$2f$districts$2f$_components$2f$DistrictsManagementContent$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DistrictsManagementContent"], {
                initialDistricts: districts,
                totalCount: total,
                searchParams: params
            }, void 0, false, {
                fileName: "[project]/src/app/(dashboard)/admin/settings/districts/page.tsx",
                lineNumber: 55,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/(dashboard)/admin/settings/districts/page.tsx",
        lineNumber: 47,
        columnNumber: 5
    }, this);
}
function DistrictsPage({ searchParams }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Suspense"], {
        fallback: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$dashboard$292f$admin$2f$settings$2f$districts$2f$_components$2f$DistrictsManagementSkeleton$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DistrictsManagementSkeleton"], {}, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/admin/settings/districts/page.tsx",
            lineNumber: 78,
            columnNumber: 25
        }, void 0),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(DistrictsContent, {
            searchParams: searchParams
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/admin/settings/districts/page.tsx",
            lineNumber: 79,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/(dashboard)/admin/settings/districts/page.tsx",
        lineNumber: 78,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=src_a46b3737._.js.map