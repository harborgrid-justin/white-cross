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
"[project]/src/schemas/health-record.schemas.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Health Record Zod schemas for form validation
 *
 * @module schemas/health-record
 * @description Zod schemas for health record management forms
 * HIPAA CRITICAL: All health records contain PHI
 */ __turbopack_context__.s([
    "healthRecordCreateSchema",
    ()=>healthRecordCreateSchema,
    "healthRecordSearchSchema",
    ()=>healthRecordSearchSchema,
    "healthRecordUpdateSchema",
    ()=>healthRecordUpdateSchema,
    "medicalConditionCreateSchema",
    ()=>medicalConditionCreateSchema,
    "medicalConditionUpdateSchema",
    ()=>medicalConditionUpdateSchema
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v4/classic/external.js [app-rsc] (ecmascript) <export * as z>");
;
const healthRecordCreateSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    studentId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid('Invalid student ID'),
    recordType: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, 'Record type is required'),
    title: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, 'Title is required').max(255, 'Title must be less than 255 characters'),
    description: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, 'Description is required').max(5000, 'Description must be less than 5000 characters'),
    recordDate: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().refine((date)=>{
        const d = new Date(date);
        return !isNaN(d.getTime());
    }, 'Invalid record date'),
    provider: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(255).optional(),
    providerNpi: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().regex(/^\d{10}$/, 'NPI must be exactly 10 digits').optional().or(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].literal('')),
    facility: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(255).optional(),
    facilityNpi: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().regex(/^\d{10}$/, 'Facility NPI must be exactly 10 digits').optional().or(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].literal('')),
    diagnosis: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(1000).optional(),
    diagnosisCode: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().regex(/^[A-Z]\d{2}(\.\d{1,4})?$/, 'Invalid ICD-10 code format (e.g., E11.65)').optional().or(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].literal('')),
    treatment: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(5000).optional(),
    followUpRequired: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().default(false),
    followUpDate: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().refine((date)=>{
        if (!date) return true;
        const d = new Date(date);
        return !isNaN(d.getTime());
    }, 'Invalid follow-up date'),
    followUpCompleted: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().default(false),
    isConfidential: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().default(false),
    notes: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(5000).optional(),
    attachments: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).default([])
}).refine((data)=>{
    if (data.followUpRequired && !data.followUpDate) {
        return false;
    }
    return true;
}, {
    message: 'Follow-up date is required when follow-up is needed',
    path: [
        'followUpDate'
    ]
});
const healthRecordUpdateSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    recordType: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    title: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, 'Title is required').max(255, 'Title must be less than 255 characters').optional(),
    description: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, 'Description is required').max(5000, 'Description must be less than 5000 characters').optional(),
    recordDate: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().refine((date)=>{
        if (!date) return true;
        const d = new Date(date);
        return !isNaN(d.getTime());
    }, 'Invalid record date'),
    provider: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(255).optional(),
    providerNpi: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().regex(/^\d{10}$/, 'NPI must be exactly 10 digits').optional().or(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].literal('')),
    facility: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(255).optional(),
    facilityNpi: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().regex(/^\d{10}$/, 'Facility NPI must be exactly 10 digits').optional().or(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].literal('')),
    diagnosis: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(1000).optional(),
    diagnosisCode: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().regex(/^[A-Z]\d{2}(\.\d{1,4})?$/, 'Invalid ICD-10 code format').optional().or(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].literal('')),
    treatment: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(5000).optional(),
    followUpRequired: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().optional(),
    followUpDate: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().refine((date)=>{
        if (!date) return true;
        const d = new Date(date);
        return !isNaN(d.getTime());
    }, 'Invalid follow-up date'),
    followUpCompleted: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().optional(),
    isConfidential: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().optional(),
    notes: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(5000).optional(),
    attachments: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).optional()
});
const medicalConditionCreateSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    studentId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid('Invalid student ID'),
    condition: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, 'Condition name is required').max(255, 'Condition name must be less than 255 characters'),
    icdCode: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().regex(/^[A-Z]\d{2}(\.\d{1,4})?$/, 'Invalid ICD-10 code format (e.g., E11.65)').optional().or(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].literal('')),
    diagnosisDate: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().refine((date)=>{
        const d = new Date(date);
        return !isNaN(d.getTime());
    }, 'Invalid diagnosis date'),
    diagnosedBy: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(255).optional(),
    severity: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        'MILD',
        'MODERATE',
        'SEVERE',
        'CRITICAL'
    ], {
        message: 'Invalid severity level'
    }),
    status: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        'ACTIVE',
        'MANAGED',
        'RESOLVED',
        'MONITORING',
        'INACTIVE'
    ], {
        message: 'Invalid status'
    }),
    treatments: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(2000).optional(),
    accommodationsRequired: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().default(false),
    accommodationDetails: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(2000).optional(),
    emergencyProtocol: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(2000).optional(),
    actionPlan: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(5000).optional(),
    nextReviewDate: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().refine((date)=>{
        if (!date) return true;
        const d = new Date(date);
        return !isNaN(d.getTime());
    }, 'Invalid review date'),
    reviewFrequency: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(100).optional(),
    triggers: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).default([]),
    notes: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(5000).optional(),
    carePlan: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(10000).optional()
}).refine((data)=>{
    if (data.accommodationsRequired && !data.accommodationDetails) {
        return false;
    }
    return true;
}, {
    message: 'Accommodation details are required when accommodations are needed',
    path: [
        'accommodationDetails'
    ]
});
const medicalConditionUpdateSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    condition: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, 'Condition name is required').max(255, 'Condition name must be less than 255 characters').optional(),
    icdCode: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().regex(/^[A-Z]\d{2}(\.\d{1,4})?$/, 'Invalid ICD-10 code format').optional().or(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].literal('')),
    diagnosisDate: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().refine((date)=>{
        if (!date) return true;
        const d = new Date(date);
        return !isNaN(d.getTime());
    }, 'Invalid diagnosis date'),
    diagnosedBy: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(255).optional(),
    severity: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        'MILD',
        'MODERATE',
        'SEVERE',
        'CRITICAL'
    ]).optional(),
    status: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        'ACTIVE',
        'MANAGED',
        'RESOLVED',
        'MONITORING',
        'INACTIVE'
    ]).optional(),
    treatments: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(2000).optional(),
    accommodationsRequired: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().optional(),
    accommodationDetails: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(2000).optional(),
    emergencyProtocol: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(2000).optional(),
    actionPlan: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(5000).optional(),
    nextReviewDate: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().refine((date)=>{
        if (!date) return true;
        const d = new Date(date);
        return !isNaN(d.getTime());
    }, 'Invalid review date'),
    reviewFrequency: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(100).optional(),
    triggers: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).optional(),
    notes: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(5000).optional(),
    carePlan: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(10000).optional(),
    lastReviewDate: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().refine((date)=>{
        if (!date) return true;
        const d = new Date(date);
        return !isNaN(d.getTime());
    }, 'Invalid last review date')
});
const healthRecordSearchSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    studentId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid().optional(),
    recordType: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).optional(),
    dateFrom: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().refine((date)=>{
        if (!date) return true;
        const d = new Date(date);
        return !isNaN(d.getTime());
    }, 'Invalid from date'),
    dateTo: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().refine((date)=>{
        if (!date) return true;
        const d = new Date(date);
        return !isNaN(d.getTime());
    }, 'Invalid to date'),
    provider: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    isConfidential: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().optional(),
    followUpRequired: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().optional(),
    page: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().positive().default(1),
    limit: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().positive().max(100).default(20),
    sortBy: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        'recordDate',
        'title',
        'provider',
        'recordType'
    ]).default('recordDate'),
    sortDirection: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        'asc',
        'desc'
    ]).default('desc')
});
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
"[project]/src/lib/actions/health-records.utils.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @fileoverview Utility Functions for Health Records Module
 * @module lib/actions/health-records.utils
 *
 * Shared utility functions for authentication, audit context creation,
 * and enhanced fetch operations with Next.js v16 caching capabilities.
 * HIPAA CRITICAL: These utilities support mandatory audit logging for PHI access.
 *
 * NOTE: This file does NOT use 'use server' because it exports constants
 * and utility functions that can be used in both server and client contexts.
 * Individual async functions can be imported and used in server actions.
 */ __turbopack_context__.s([
    "BACKEND_URL",
    ()=>BACKEND_URL,
    "createAuditContext",
    ()=>createAuditContext,
    "enhancedFetch",
    ()=>enhancedFetch,
    "getAuthToken",
    ()=>getAuthToken,
    "getCurrentUserId",
    ()=>getCurrentUserId
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$audit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/audit.ts [app-rsc] (ecmascript)");
;
;
;
const BACKEND_URL = process.env.API_BASE_URL || ("TURBOPACK compile-time value", "http://localhost:3001") || 'http://localhost:3001';
async function getAuthToken() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    return cookieStore.get('auth_token')?.value || null;
}
async function getCurrentUserId() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    return cookieStore.get('user_id')?.value || null;
}
async function createAuditContext() {
    const headersList = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["headers"])();
    const request = {
        headers: headersList
    };
    const userId = await getCurrentUserId();
    return {
        userId,
        ipAddress: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$audit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["extractIPAddress"])(request),
        userAgent: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$audit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["extractUserAgent"])(request)
    };
}
async function enhancedFetch(url, options = {}) {
    const token = await getAuthToken();
    return fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : '',
            ...options.headers
        },
        next: {
            revalidate: 300,
            tags: [
                'health-records',
                'phi-data'
            ]
        }
    });
}
}),
"[project]/src/lib/actions/health-records.crud.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @fileoverview CRUD Operations for Health Records
 * @module lib/actions/health-records.crud
 *
 * Core create, read, update, and delete operations for health records.
 * HIPAA CRITICAL: ALL operations include mandatory audit logging for PHI access.
 * Enhanced with Next.js v16 caching capabilities and revalidation patterns.
 */ /* __next_internal_action_entry_do_not_use__ [{"401c3b2e139b9cd667cfe6b8a267cbe4ed0bba7a2b":"deleteHealthRecordAction","601350e016c74379f9d38d00de45cbba64fcb8c3de":"createHealthRecordAction","602c56788cb4489bd68f5c78fbc0e1b8ea9933b502":"getHealthRecordsAction","70976e72785808b0c22fece96600204947582b83a5":"updateHealthRecordAction"},"",""] */ __turbopack_context__.s([
    "createHealthRecordAction",
    ()=>createHealthRecordAction,
    "deleteHealthRecordAction",
    ()=>deleteHealthRecordAction,
    "getHealthRecordsAction",
    ()=>getHealthRecordsAction,
    "updateHealthRecordAction",
    ()=>updateHealthRecordAction
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v4/classic/external.js [app-rsc] (ecmascript) <export * as z>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$nextjs$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/api/nextjs-client.ts [app-rsc] (ecmascript)");
// Import schemas
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$schemas$2f$health$2d$record$2e$schemas$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/schemas/health-record.schemas.ts [app-rsc] (ecmascript)");
// Import audit logging utilities
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$audit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/audit.ts [app-rsc] (ecmascript)");
// Import shared utilities and types
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$health$2d$records$2e$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/actions/health-records.utils.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
async function createHealthRecordAction(_prevState, formData) {
    const token = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$health$2d$records$2e$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAuthToken"])();
    const auditContext = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$health$2d$records$2e$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAuditContext"])();
    if (!token) {
        return {
            errors: {
                _form: [
                    'Authentication required'
                ]
            }
        };
    }
    try {
        // Parse and validate form data
        const rawData = {
            studentId: formData.get('studentId'),
            recordType: formData.get('recordType'),
            title: formData.get('title'),
            description: formData.get('description'),
            recordDate: formData.get('recordDate'),
            provider: formData.get('provider') || undefined,
            providerNpi: formData.get('providerNpi') || '',
            facility: formData.get('facility') || undefined,
            facilityNpi: formData.get('facilityNpi') || '',
            diagnosis: formData.get('diagnosis') || undefined,
            diagnosisCode: formData.get('diagnosisCode') || '',
            treatment: formData.get('treatment') || undefined,
            followUpRequired: formData.get('followUpRequired') === 'true',
            followUpDate: formData.get('followUpDate') || undefined,
            followUpCompleted: formData.get('followUpCompleted') === 'true',
            isConfidential: formData.get('isConfidential') === 'true',
            notes: formData.get('notes') || undefined,
            attachments: []
        };
        const validatedData = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$schemas$2f$health$2d$record$2e$schemas$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["healthRecordCreateSchema"].parse(rawData);
        // Create health record via backend API with enhanced fetch (backend uses /health-record singular)
        const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$health$2d$records$2e$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["enhancedFetch"])(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$health$2d$records$2e$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["BACKEND_URL"]}/health-record`, {
            method: 'POST',
            body: JSON.stringify(validatedData)
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create health record');
        }
        const result = await response.json();
        // HIPAA AUDIT LOG - Mandatory for PHI creation
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$audit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["auditLog"])({
            ...auditContext,
            action: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$audit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["AUDIT_ACTIONS"].CREATE_HEALTH_RECORD,
            resource: 'HealthRecord',
            resourceId: result.data.id,
            details: `Created ${validatedData.recordType} health record for student ${validatedData.studentId}`,
            success: true
        });
        // Enhanced cache invalidation with Next.js v16
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidateTag"])('health-records', 'default');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidateTag"])(`student-${validatedData.studentId}-health-records`, 'default');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidateTag"])('phi-data', 'default');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/students/${validatedData.studentId}/health-records`);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/health-records');
        return {
            success: true,
            data: result.data,
            message: 'Health record created successfully'
        };
    } catch (error) {
        if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].ZodError) {
            const fieldErrors = {};
            error.issues.forEach((err)=>{
                const path = err.path.join('.');
                if (!fieldErrors[path]) {
                    fieldErrors[path] = [];
                }
                fieldErrors[path].push(err.message);
            });
            return {
                errors: fieldErrors
            };
        }
        // HIPAA AUDIT LOG - Log failed attempt
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$audit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["auditLog"])({
            ...auditContext,
            action: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$audit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["AUDIT_ACTIONS"].CREATE_HEALTH_RECORD,
            resource: 'HealthRecord',
            details: 'Failed to create health record',
            success: false,
            errorMessage: error instanceof Error ? error.message : 'Unknown error'
        });
        return {
            errors: {
                _form: [
                    error instanceof Error ? error.message : 'Failed to create health record'
                ]
            }
        };
    }
}
async function getHealthRecordsAction(studentId, recordType) {
    try {
        // Build endpoint and params based on whether studentId is provided
        let endpoint;
        const params = {};
        if (studentId) {
            // Get records for a specific student
            endpoint = `/health-record/student/${studentId}`;
            if (recordType) {
                params.recordType = recordType;
            }
        } else {
            // Get all health records across all students
            endpoint = '/health-record';
            if (recordType) {
                params.type = recordType;
            }
        }
        console.log('[Health Records] Fetching from:', endpoint, params);
        const wrappedResponse = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$nextjs$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["serverGet"])(endpoint, params, {
            cache: 'no-store'
        });
        console.log('[Health Records] Response structure:', {
            hasData: !!wrappedResponse.data,
            dataType: typeof wrappedResponse.data,
            isArray: Array.isArray(wrappedResponse.data)
        });
        // HIPAA AUDIT LOG - PHI access
        const auditContext = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$health$2d$records$2e$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAuditContext"])();
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$audit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["auditLog"])({
            ...auditContext,
            action: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$audit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["AUDIT_ACTIONS"].VIEW_HEALTH_RECORD,
            resource: 'HealthRecord',
            details: `Accessed health records for student ${studentId}`,
            success: true
        });
        // Backend wraps response in ApiResponse format: { success, statusCode, data: {...} }
        // The actual health records might be in wrappedResponse.data.data or wrappedResponse.data
        let healthRecords = [];
        if (wrappedResponse.data) {
            // If wrappedResponse.data is an array, use it directly
            if (Array.isArray(wrappedResponse.data)) {
                healthRecords = wrappedResponse.data;
            } else if (typeof wrappedResponse.data === 'object' && 'data' in wrappedResponse.data) {
                const nested = wrappedResponse.data;
                if (nested.data && Array.isArray(nested.data)) {
                    healthRecords = nested.data;
                }
            } else if (typeof wrappedResponse.data === 'object' && 'records' in wrappedResponse.data) {
                const nested = wrappedResponse.data;
                if (nested.records && Array.isArray(nested.records)) {
                    healthRecords = nested.records;
                }
            }
        }
        console.log('[Health Records] Successfully fetched records:', healthRecords.length);
        return {
            success: true,
            data: healthRecords
        };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch health records';
        console.error('[Health Records] Error in getHealthRecordsAction:', errorMessage);
        // Check if it's a network/connection error
        if (error instanceof TypeError && error.message.includes('fetch')) {
            return {
                success: false,
                error: `Cannot connect to backend server at ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$health$2d$records$2e$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["BACKEND_URL"]}. Please ensure the backend is running.`
            };
        }
        return {
            success: false,
            error: errorMessage
        };
    }
}
async function updateHealthRecordAction(id, _prevState, formData) {
    const token = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$health$2d$records$2e$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAuthToken"])();
    const auditContext = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$health$2d$records$2e$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAuditContext"])();
    if (!token) {
        return {
            errors: {
                _form: [
                    'Authentication required'
                ]
            }
        };
    }
    try {
        const rawData = {
            recordType: formData.get('recordType') || undefined,
            title: formData.get('title') || undefined,
            description: formData.get('description') || undefined,
            recordDate: formData.get('recordDate') || undefined,
            provider: formData.get('provider') || undefined,
            providerNpi: formData.get('providerNpi') || '',
            facility: formData.get('facility') || undefined,
            facilityNpi: formData.get('facilityNpi') || '',
            diagnosis: formData.get('diagnosis') || undefined,
            diagnosisCode: formData.get('diagnosisCode') || '',
            treatment: formData.get('treatment') || undefined,
            followUpRequired: formData.get('followUpRequired') ? formData.get('followUpRequired') === 'true' : undefined,
            followUpDate: formData.get('followUpDate') || undefined,
            followUpCompleted: formData.get('followUpCompleted') ? formData.get('followUpCompleted') === 'true' : undefined,
            isConfidential: formData.get('isConfidential') ? formData.get('isConfidential') === 'true' : undefined,
            notes: formData.get('notes') || undefined
        };
        const validatedData = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$schemas$2f$health$2d$record$2e$schemas$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["healthRecordUpdateSchema"].parse(rawData);
        const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$health$2d$records$2e$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["enhancedFetch"])(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$health$2d$records$2e$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["BACKEND_URL"]}/health-record/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(validatedData)
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update health record');
        }
        const result = await response.json();
        // HIPAA AUDIT LOG - Mandatory for PHI modification
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$audit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["auditLog"])({
            ...auditContext,
            action: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$audit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["AUDIT_ACTIONS"].UPDATE_HEALTH_RECORD,
            resource: 'HealthRecord',
            resourceId: id,
            details: `Updated health record ${id}`,
            changes: validatedData,
            success: true
        });
        // Enhanced cache invalidation
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidateTag"])('health-records', 'default');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidateTag"])(`health-record-${id}`, 'default');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidateTag"])('phi-data', 'default');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/health-records/${id}`);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/health-records');
        return {
            success: true,
            data: result.data,
            message: 'Health record updated successfully'
        };
    } catch (error) {
        if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].ZodError) {
            const fieldErrors = {};
            error.issues.forEach((err)=>{
                const path = err.path.join('.');
                if (!fieldErrors[path]) {
                    fieldErrors[path] = [];
                }
                fieldErrors[path].push(err.message);
            });
            return {
                errors: fieldErrors
            };
        }
        // HIPAA AUDIT LOG - Log failed update attempt
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$audit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["auditLog"])({
            ...auditContext,
            action: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$audit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["AUDIT_ACTIONS"].UPDATE_HEALTH_RECORD,
            resource: 'HealthRecord',
            resourceId: id,
            details: `Failed to update health record ${id}`,
            success: false,
            errorMessage: error instanceof Error ? error.message : 'Unknown error'
        });
        return {
            errors: {
                _form: [
                    error instanceof Error ? error.message : 'Failed to update health record'
                ]
            }
        };
    }
}
async function deleteHealthRecordAction(id) {
    const token = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$health$2d$records$2e$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAuthToken"])();
    const auditContext = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$health$2d$records$2e$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAuditContext"])();
    if (!token) {
        return {
            errors: {
                _form: [
                    'Authentication required'
                ]
            }
        };
    }
    try {
        const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$health$2d$records$2e$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["enhancedFetch"])(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$health$2d$records$2e$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["BACKEND_URL"]}/health-record/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to delete health record');
        }
        // HIPAA AUDIT LOG - Mandatory for PHI deletion
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$audit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["auditLog"])({
            ...auditContext,
            action: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$audit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["AUDIT_ACTIONS"].DELETE_HEALTH_RECORD,
            resource: 'HealthRecord',
            resourceId: id,
            details: `Deleted health record ${id}`,
            success: true
        });
        // Enhanced cache invalidation
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidateTag"])('health-records', 'default');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidateTag"])(`health-record-${id}`, 'default');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidateTag"])('phi-data', 'default');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/health-records');
        return {
            success: true,
            message: 'Health record deleted successfully'
        };
    } catch (error) {
        // HIPAA AUDIT LOG - Log failed delete attempt
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$audit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["auditLog"])({
            ...auditContext,
            action: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$audit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["AUDIT_ACTIONS"].DELETE_HEALTH_RECORD,
            resource: 'HealthRecord',
            resourceId: id,
            details: `Failed to delete health record ${id}`,
            success: false,
            errorMessage: error instanceof Error ? error.message : 'Unknown error'
        });
        return {
            errors: {
                _form: [
                    error instanceof Error ? error.message : 'Failed to delete health record'
                ]
            }
        };
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    createHealthRecordAction,
    getHealthRecordsAction,
    updateHealthRecordAction,
    deleteHealthRecordAction
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createHealthRecordAction, "601350e016c74379f9d38d00de45cbba64fcb8c3de", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getHealthRecordsAction, "602c56788cb4489bd68f5c78fbc0e1b8ea9933b502", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateHealthRecordAction, "70976e72785808b0c22fece96600204947582b83a5", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(deleteHealthRecordAction, "401c3b2e139b9cd667cfe6b8a267cbe4ed0bba7a2b", null);
}),
"[project]/src/lib/actions/health-records.stats.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @fileoverview Health Records Statistics and Dashboard Data
 * @module lib/actions/health-records.stats
 *
 * Server actions for retrieving health records statistics and dashboard metrics.
 * Enhanced with Next.js v16 'use cache' directive and cacheLife for optimal performance.
 * Provides aggregate data for dashboards and reporting interfaces.
 */ /* __next_internal_action_entry_do_not_use__ [{"004e89d6aec3dc95bec36ee8e5764906cfd6539ed7":"getHealthRecordsStats","00b4b9e56569e7f810f3bb4ac72dc59b66119068d4":"getHealthRecordsDashboardData"},"",""] */ __turbopack_context__.s([
    "getHealthRecordsDashboardData",
    ()=>getHealthRecordsDashboardData,
    "getHealthRecordsStats",
    ()=>getHealthRecordsStats
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
async function getHealthRecordsStats() {
    try {
        console.log('[Health Records] Loading health records statistics');
        // In production, this would aggregate data from database
        const stats = {
            totalRecords: 2847,
            activeConditions: 156,
            criticalAllergies: 28,
            pendingImmunizations: 42,
            recentUpdates: 89,
            compliance: 94.2,
            urgentFollowUps: 12,
            recordTypes: {
                immunizations: 1250,
                allergies: 287,
                conditions: 456,
                vitalSigns: 534,
                medications: 320
            }
        };
        console.log('[Health Records] Health records statistics loaded successfully');
        return stats;
    } catch (error) {
        console.error('[Health Records] Failed to load health records statistics:', error);
        // Return safe defaults on error
        return {
            totalRecords: 0,
            activeConditions: 0,
            criticalAllergies: 0,
            pendingImmunizations: 0,
            recentUpdates: 0,
            compliance: 0,
            urgentFollowUps: 0,
            recordTypes: {
                immunizations: 0,
                allergies: 0,
                conditions: 0,
                vitalSigns: 0,
                medications: 0
            }
        };
    }
}
async function getHealthRecordsDashboardData() {
    try {
        console.log('[Health Records] Loading dashboard data');
        const stats = await getHealthRecordsStats();
        console.log('[Health Records] Dashboard data loaded successfully');
        return {
            stats
        };
    } catch (error) {
        console.error('[Health Records] Failed to load dashboard data:', error);
        return {
            stats: await getHealthRecordsStats() // Will return safe defaults
        };
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getHealthRecordsStats,
    getHealthRecordsDashboardData
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getHealthRecordsStats, "004e89d6aec3dc95bec36ee8e5764906cfd6539ed7", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getHealthRecordsDashboardData, "00b4b9e56569e7f810f3bb4ac72dc59b66119068d4", null);
}),
"[project]/.next-internal/server/app/(dashboard)/health-records/new/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/lib/actions/health-records.crud.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/src/lib/actions/health-records.stats.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$health$2d$records$2e$crud$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/actions/health-records.crud.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$health$2d$records$2e$stats$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/actions/health-records.stats.ts [app-rsc] (ecmascript)");
;
;
;
}),
"[project]/.next-internal/server/app/(dashboard)/health-records/new/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/lib/actions/health-records.crud.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/src/lib/actions/health-records.stats.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "004e89d6aec3dc95bec36ee8e5764906cfd6539ed7",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$health$2d$records$2e$stats$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getHealthRecordsStats"],
    "601350e016c74379f9d38d00de45cbba64fcb8c3de",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$health$2d$records$2e$crud$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createHealthRecordAction"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f28$dashboard$292f$health$2d$records$2f$new$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$actions$2f$health$2d$records$2e$crud$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$actions$2f$health$2d$records$2e$stats$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/(dashboard)/health-records/new/page/actions.js { ACTIONS_MODULE0 => "[project]/src/lib/actions/health-records.crud.ts [app-rsc] (ecmascript)", ACTIONS_MODULE1 => "[project]/src/lib/actions/health-records.stats.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$health$2d$records$2e$crud$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/actions/health-records.crud.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$health$2d$records$2e$stats$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/actions/health-records.stats.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=_f155274e._.js.map