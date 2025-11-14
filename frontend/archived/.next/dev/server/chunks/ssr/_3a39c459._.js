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
"[project]/src/lib/actions/students.cache.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @fileoverview Student Cache Operations - Cached Read Actions
 * @module lib/actions/students.cache
 *
 * HIPAA-compliant cached read operations for student data with Next.js cache integration.
 *
 * Features:
 * - React cache() integration for automatic memoization
 * - Next.js cache tags and revalidation
 * - Paginated and filtered queries
 * - Search functionality
 */ /* __next_internal_action_entry_do_not_use__ [{"7f5bb8aeb4012ba7a270d2edcccd28edbbb643a105":"getStudents","7f5d153f7eb20e98768d597cc7b79b1ff8a6096fb7":"exportStudentData","7f8c59b71ab27d16dfa5cb767118267938a0786238":"getStudentStatistics","7f8f56025a572600cb01d7840061b1c2cc8f5edf37":"getStudentCount","7fb9acc46964dfadad07a51c298df77394b8473d27":"getStudent","7fcc6d3e127c406af2eb0f0e8b65b6b4ed5b76bf36":"searchStudents","7ffc188e8fc27838e9889cc5b6d7fa3a80483d1577":"getPaginatedStudents"},"",""] */ __turbopack_context__.s([
    "exportStudentData",
    ()=>exportStudentData,
    "getPaginatedStudents",
    ()=>getPaginatedStudents,
    "getStudent",
    ()=>getStudent,
    "getStudentCount",
    ()=>getStudentCount,
    "getStudentStatistics",
    ()=>getStudentStatistics,
    "getStudents",
    ()=>getStudents,
    "searchStudents",
    ()=>searchStudents
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$nextjs$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/api/nextjs-client.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/constants/api.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cache$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/cache/constants.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
;
const getStudent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cache"])(async (id)=>{
    try {
        // Backend wraps response in ApiResponse format
        const wrappedResponse = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$nextjs$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["serverGet"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].STUDENTS.BY_ID(id), undefined, {
            cache: 'force-cache',
            next: {
                revalidate: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cache$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CACHE_TTL"].PHI_STANDARD,
                tags: [
                    `student-${id}`,
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cache$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CACHE_TAGS"].STUDENTS,
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cache$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CACHE_TAGS"].PHI
                ]
            }
        });
        // Extract the student from wrappedResponse.data
        return wrappedResponse?.data || null;
    } catch (error) {
        console.error('Failed to get student:', error);
        return null;
    }
});
const getStudents = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cache"])(async (filters)=>{
    try {
        // Backend wraps response in ApiResponse format: { success, statusCode, message, data, meta }
        const wrappedResponse = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$nextjs$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["serverGet"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].STUDENTS.BASE, filters, {
            cache: 'force-cache',
            next: {
                revalidate: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cache$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CACHE_TTL"].PHI_STANDARD,
                tags: [
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cache$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CACHE_TAGS"].STUDENTS,
                    'student-list',
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cache$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CACHE_TAGS"].PHI
                ]
            }
        });
        // Extract the students array from wrappedResponse.data.data
        // Backend returns: { data: { data: Student[] } }
        const students = wrappedResponse?.data?.data || wrappedResponse?.data || [];
        return Array.isArray(students) ? students : [];
    } catch (error) {
        console.error('Failed to get students:', error);
        return [];
    }
});
const searchStudents = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cache"])(async (query, filters)=>{
    try {
        const searchParams = {
            q: query,
            ...filters
        };
        // Backend wraps response in ApiResponse format
        const wrappedResponse = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$nextjs$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["serverGet"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].STUDENTS.SEARCH, searchParams, {
            cache: 'force-cache',
            next: {
                revalidate: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cache$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CACHE_TTL"].PHI_FREQUENT,
                tags: [
                    'student-search',
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cache$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CACHE_TAGS"].STUDENTS,
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cache$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CACHE_TAGS"].PHI
                ]
            }
        });
        // Extract the students array from wrappedResponse.data.data
        const students = wrappedResponse?.data?.data || wrappedResponse?.data || [];
        return Array.isArray(students) ? students : [];
    } catch (error) {
        console.error('Failed to search students:', error);
        return [];
    }
});
const getPaginatedStudents = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cache"])(async (page = 1, limit = 20, filters)=>{
    try {
        const params = {
            page: page.toString(),
            limit: limit.toString(),
            ...filters
        };
        // Backend wraps response in ApiResponse format
        const wrappedResponse = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$nextjs$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["serverGet"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].STUDENTS.BASE, params, {
            cache: 'force-cache',
            next: {
                revalidate: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cache$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CACHE_TTL"].PHI_STANDARD,
                tags: [
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cache$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CACHE_TAGS"].STUDENTS,
                    'student-list',
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cache$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CACHE_TAGS"].PHI
                ]
            }
        });
        // Extract the pagination response from wrappedResponse.data
        return wrappedResponse?.data || null;
    } catch (error) {
        console.error('Failed to get paginated students:', error);
        return null;
    }
});
const getStudentCount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cache"])(async (filters)=>{
    try {
        const students = await getStudents(filters);
        return students.length;
    } catch  {
        return 0;
    }
});
const getStudentStatistics = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cache"])(async (studentId)=>{
    try {
        const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$nextjs$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["serverGet"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].STUDENTS.BY_ID(studentId) + '/statistics', undefined, {
            cache: 'force-cache',
            next: {
                revalidate: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cache$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CACHE_TTL"].PHI_STANDARD,
                tags: [
                    `student-${studentId}`,
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cache$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CACHE_TAGS"].STUDENTS,
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cache$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CACHE_TAGS"].PHI
                ]
            }
        });
        return response.data;
    } catch (error) {
        console.error('Failed to get student statistics:', error);
        return null;
    }
});
const exportStudentData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cache"])(async (studentId)=>{
    try {
        const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$nextjs$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["serverGet"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].STUDENTS.EXPORT(studentId), undefined, {
            cache: 'force-cache',
            next: {
                revalidate: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cache$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CACHE_TTL"].PHI_STANDARD,
                tags: [
                    `student-${studentId}`,
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cache$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CACHE_TAGS"].STUDENTS,
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cache$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CACHE_TAGS"].PHI
                ]
            }
        });
        return response.data;
    } catch (error) {
        console.error('Failed to export student data:', error);
        return null;
    }
});
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getStudent,
    getStudents,
    searchStudents,
    getPaginatedStudents,
    getStudentCount,
    getStudentStatistics,
    exportStudentData
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getStudent, "7fb9acc46964dfadad07a51c298df77394b8473d27", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getStudents, "7f5bb8aeb4012ba7a270d2edcccd28edbbb643a105", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(searchStudents, "7fcc6d3e127c406af2eb0f0e8b65b6b4ed5b76bf36", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getPaginatedStudents, "7ffc188e8fc27838e9889cc5b6d7fa3a80483d1577", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getStudentCount, "7f8f56025a572600cb01d7840061b1c2cc8f5edf37", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getStudentStatistics, "7f8c59b71ab27d16dfa5cb767118267938a0786238", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(exportStudentData, "7f5d153f7eb20e98768d597cc7b79b1ff8a6096fb7", null);
}),
"[project]/.next-internal/server/app/(dashboard)/students/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/lib/actions/students.cache.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$students$2e$cache$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/actions/students.cache.ts [app-rsc] (ecmascript)");
;
;
;
;
}),
"[project]/.next-internal/server/app/(dashboard)/students/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/lib/actions/students.cache.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "7f5bb8aeb4012ba7a270d2edcccd28edbbb643a105",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$students$2e$cache$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getStudents"],
    "7f8f56025a572600cb01d7840061b1c2cc8f5edf37",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$students$2e$cache$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getStudentCount"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f28$dashboard$292f$students$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$actions$2f$students$2e$cache$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/(dashboard)/students/page/actions.js { ACTIONS_MODULE0 => "[project]/src/lib/actions/students.cache.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$students$2e$cache$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/actions/students.cache.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=_3a39c459._.js.map