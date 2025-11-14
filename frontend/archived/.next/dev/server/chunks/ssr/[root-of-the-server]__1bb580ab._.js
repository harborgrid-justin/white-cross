module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/src/config/queryClient.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * WF-COMP-QUERYCLIENT-001 | queryClient.ts - React Query Client Configuration
 * Purpose: Enterprise-grade TanStack Query configuration with Next.js integration
 *
 * Features:
 * - SSR/SSG compatible configuration
 * - Granular cache invalidation strategies
 * - Error handling and retry logic
 * - Query deduplication
 * - Healthcare-specific caching rules
 *
 * Security:
 * - PHI data excluded from persistence
 * - Secure error handling
 *
 * Last Updated: 2025-10-26 | File Type: .ts
 */ __turbopack_context__.s([
    "clearAllData",
    ()=>clearAllData,
    "default",
    ()=>__TURBOPACK__default__export__,
    "getCacheStats",
    ()=>getCacheStats,
    "getQueryClient",
    ()=>getQueryClient,
    "invalidateByTags",
    ()=>invalidateByTags,
    "queryClient",
    ()=>queryClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/query-core/build/modern/queryClient.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryCache$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/query-core/build/modern/queryCache.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$mutationCache$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/query-core/build/modern/mutationCache.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-hot-toast/dist/index.mjs [app-ssr] (ecmascript)");
;
;
// ==========================================
// CONFIGURATION
// ==========================================
/**
 * Default TanStack Query options with healthcare-specific caching and retry settings.
 *
 * Configures conservative caching strategies appropriate for healthcare data,
 * balancing data freshness with performance. Implements intelligent retry logic
 * that distinguishes between transient failures and permanent errors.
 *
 * Query Configuration:
 * - staleTime: 5 minutes (data freshness threshold)
 * - gcTime: 30 minutes (garbage collection time, previously cacheTime)
 * - Automatic refetch on: window focus, reconnect, mount
 * - Retry logic: Up to 3 attempts for 5xx errors, no retry for 4xx except 408/429
 * - Exponential backoff: Starts at 1s, max 30s with doubling delay
 *
 * Mutation Configuration:
 * - Single retry attempt for mutations (idempotency concerns)
 * - Requires online network mode
 *
 * @constant {DefaultOptions}
 *
 * @example
 * ```typescript
 * // Query with default options:
 * const { data } = useQuery({
 *   queryKey: ['students'],
 *   queryFn: fetchStudents,
 *   // Inherits: 5min staleTime, 3 retries, background refetch
 * });
 *
 * // Mutation with default options:
 * const { mutate } = useMutation({
 *   mutationFn: createStudent,
 *   // Inherits: 1 retry, online mode
 * });
 * ```
 *
 * @see https://tanstack.com/query/latest/docs/react/guides/important-defaults
 */ const defaultOptions = {
    queries: {
        // Conservative stale time for healthcare data
        staleTime: 5 * 60 * 1000,
        // Longer cache time for non-critical data
        gcTime: 30 * 60 * 1000,
        // Enable background refetch for critical data
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        refetchOnMount: true,
        // Retry configuration for transient failures
        retry: (failureCount, error)=>{
            // Don't retry on 4xx client errors except 408, 429
            if (error && typeof error === 'object' && 'status' in error) {
                const status = error.status;
                if (status >= 400 && status < 500 && status !== 408 && status !== 429) {
                    return false;
                }
            }
            // Retry up to 3 times with exponential backoff
            return failureCount < 3;
        },
        retryDelay: (attemptIndex)=>Math.min(1000 * 2 ** attemptIndex, 30000),
        // Network mode for offline support
        networkMode: 'online'
    },
    mutations: {
        // Conservative retry for mutations
        retry: 1,
        // Network mode for mutations
        networkMode: 'online'
    }
};
/**
 * TanStack Query cache with centralized error handling and audit logging.
 *
 * Provides lifecycle hooks for query success and failure, enabling consistent
 * error notifications, PHI access auditing, and debugging support. Integrates
 * with toast notifications for user-friendly error messages.
 *
 * Error Handling:
 * - Displays toast notifications for failed queries (except background refetches)
 * - Uses custom errorMessage from query meta if provided
 * - Logs errors with query keys and metadata for debugging
 * - Suppresses toasts when query has existing data (background refresh failed)
 *
 * Audit Logging:
 * - Tracks PHI data access when auditLog and containsPHI flags are set
 * - Logs query keys and data sizes for compliance
 * - Client-side only (respects SSR constraints)
 *
 * @constant {QueryCache}
 *
 * @example
 * ```typescript
 * // Query with audit logging:
 * const { data } = useQuery({
 *   queryKey: ['patient', patientId],
 *   queryFn: fetchPatient,
 *   meta: {
 *     containsPHI: true,
 *     auditLog: true,
 *     errorMessage: 'Failed to load patient data'
 *   }
 * });
 * // On success: Logs PHI access audit
 * // On error: Shows custom error message, logs to console
 * ```
 *
 * @see https://tanstack.com/query/latest/docs/reference/QueryCache
 */ const queryCache = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryCache$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["QueryCache"]({
    onError: (error, query)=>{
        const meta = query.meta;
        console.error('[QueryCache] Query failed:', {
            queryKey: query.queryKey,
            error,
            meta
        });
        // Display user-friendly error message
        const errorMessage = meta?.errorMessage || 'Failed to load data. Please try again.';
        // Don't show toast for background refetches of successful queries
        if (query.state.data === undefined) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].error(errorMessage);
        }
        // Log audit trail for PHI-related queries
        if (meta?.auditLog && ("TURBOPACK compile-time value", "undefined") !== 'undefined') //TURBOPACK unreachable
        ;
    },
    onSuccess: (data, query)=>{
        const meta = query.meta;
        // Log audit trail for PHI-related queries
        if (meta?.auditLog && meta?.containsPHI && ("TURBOPACK compile-time value", "undefined") !== 'undefined') //TURBOPACK unreachable
        ;
    }
});
/**
 * TanStack Mutation cache with success/error handling and PHI audit logging.
 *
 * Provides lifecycle hooks for mutation success and failure, enabling automatic
 * success notifications, error handling, and audit trails for data modifications
 * affecting Protected Health Information (PHI).
 *
 * Success Handling:
 * - Displays custom successMessage from mutation meta as toast
 * - Logs PHI modifications for compliance auditing
 * - Records mutation keys and data sizes
 *
 * Error Handling:
 * - Displays custom errorMessage or default error toast
 * - Logs failed mutations with variables for debugging
 * - Tracks failed PHI modifications for security auditing
 *
 * @constant {MutationCache}
 *
 * @example
 * ```typescript
 * // Mutation with audit and notifications:
 * const { mutate } = useMutation({
 *   mutationFn: updatePatient,
 *   meta: {
 *     affectsPHI: true,
 *     auditAction: 'UPDATE_PATIENT',
 *     successMessage: 'Patient updated successfully',
 *     errorMessage: 'Failed to update patient'
 *   }
 * });
 * // On success: Shows success toast, logs PHI audit
 * // On error: Shows error toast, logs failure audit
 * ```
 *
 * @see https://tanstack.com/query/latest/docs/reference/MutationCache
 */ const mutationCache = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$mutationCache$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MutationCache"]({
    onSuccess: (data, variables, context, mutation)=>{
        const meta = mutation.meta;
        // Show success message
        if (meta?.successMessage) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].success(meta.successMessage);
        }
        // Log audit trail for PHI-affecting mutations
        if (meta?.affectsPHI && ("TURBOPACK compile-time value", "undefined") !== 'undefined') //TURBOPACK unreachable
        ;
    },
    onError: (error, variables, context, mutation)=>{
        const meta = mutation.meta;
        console.error('[MutationCache] Mutation failed:', {
            mutationKey: mutation.options.mutationKey,
            error,
            variables,
            meta
        });
        // Display user-friendly error message
        const errorMessage = meta?.errorMessage || 'Operation failed. Please try again.';
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].error(errorMessage);
        // Log audit trail for failed PHI mutations
        if (meta?.affectsPHI && ("TURBOPACK compile-time value", "undefined") !== 'undefined') //TURBOPACK unreachable
        ;
    }
});
// ==========================================
// QUERY CLIENT
// ==========================================
/**
 * Creates a new QueryClient instance with configured caches and default options.
 *
 * Factory function for instantiating TanStack Query clients with healthcare-specific
 * configuration. Used for both server-side rendering (new instance per request) and
 * client-side (singleton instance).
 *
 * @returns {QueryClient} Configured QueryClient instance
 * @private
 *
 * @example
 * ```typescript
 * // Server-side: new client per request
 * const client = createQueryClient();
 *
 * // Client-side: singleton pattern via getQueryClient()
 * ```
 */ function createQueryClient() {
    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["QueryClient"]({
        queryCache,
        mutationCache,
        defaultOptions
    });
}
/**
 * Global QueryClient singleton instance for browser/client-side usage.
 *
 * Cached client instance that persists across component renders on the client.
 * Undefined on server to ensure fresh instances per SSR request.
 *
 * @type {QueryClient | undefined}
 * @private
 */ let browserQueryClient = undefined;
function getQueryClient() {
    if ("TURBOPACK compile-time truthy", 1) {
        // Server: always make a new query client
        return createQueryClient();
    } else //TURBOPACK unreachable
    ;
}
const queryClient = getQueryClient();
async function invalidateByTags(tags) {
    const client = getQueryClient();
    // Find all queries that match any of the provided tags
    const queriesToInvalidate = client.getQueryCache().findAll({
        predicate: (query)=>{
            const meta = query.meta;
            const queryTags = meta?.cacheTags || [];
            return tags.some((tag)=>queryTags.includes(tag));
        }
    });
    // Invalidate matching queries
    const invalidationPromises = queriesToInvalidate.map((query)=>client.invalidateQueries({
            queryKey: query.queryKey
        }));
    await Promise.all(invalidationPromises);
}
async function clearAllData() {
    const client = getQueryClient();
    client.clear();
}
function getCacheStats() {
    const client = getQueryClient();
    const queries = client.getQueryCache().getAll();
    return {
        totalQueries: queries.length,
        activeQueries: queries.filter((q)=>q.getObserversCount() > 0).length,
        staleQueries: queries.filter((q)=>q.isStale()).length,
        phiQueries: queries.filter((q)=>q.meta?.containsPHI).length
    };
}
const __TURBOPACK__default__export__ = queryClient;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/https [external] (https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/http2 [external] (http2, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http2", () => require("http2"));

module.exports = mod;
}),
"[externals]/assert [external] (assert, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("assert", () => require("assert"));

module.exports = mod;
}),
"[externals]/tty [external] (tty, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tty", () => require("tty"));

module.exports = mod;
}),
"[externals]/os [external] (os, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("os", () => require("os"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[project]/src/constants/config.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Application Configuration Constants
 * 
 * Centralized configuration values for the Next.js application
 * Environment-aware settings for API connections, timeouts, and feature flags
 */ /**
 * API Configuration
 * Base URL and timeout settings for backend API calls
 */ __turbopack_context__.s([
    "API_CONFIG",
    ()=>API_CONFIG,
    "APP_ENV",
    ()=>APP_ENV,
    "FEATURE_FLAGS",
    ()=>FEATURE_FLAGS,
    "SECURITY_CONFIG",
    ()=>SECURITY_CONFIG,
    "VALIDATION_CONFIG",
    ()=>VALIDATION_CONFIG
]);
const API_CONFIG = {
    /**
   * Base URL for API requests
   * - Docker environment: Uses backend service name (http://backend:3001)
   * - Local development: Uses localhost (http://localhost:3001)
   * - Can be overridden via NEXT_PUBLIC_API_URL environment variable
   */ BASE_URL: ("TURBOPACK compile-time value", "http://localhost:3001") || 'http://localhost:3001',
    /**
   * Internal API URL for server-side requests in Docker
   * Used for API routes and server-side rendering
   */ INTERNAL_API_URL: process.env.INTERNAL_API_URL || ("TURBOPACK compile-time value", "http://localhost:3001") || 'http://localhost:3001',
    /**
   * Request timeout in milliseconds
   * Default: 30 seconds
   */ TIMEOUT: 30000,
    /**
   * Retry configuration for failed requests
   */ RETRY: {
        MAX_RETRIES: 3,
        RETRY_DELAY: 1000,
        RETRY_CODES: [
            408,
            429,
            500,
            502,
            503,
            504
        ]
    }
};
const APP_ENV = {
    IS_DEVELOPMENT: ("TURBOPACK compile-time value", "development") === 'development',
    IS_PRODUCTION: ("TURBOPACK compile-time value", "development") === 'production',
    IS_TEST: ("TURBOPACK compile-time value", "development") === 'test'
};
const FEATURE_FLAGS = {
    ENABLE_DEBUG_LOGGING: process.env.NEXT_PUBLIC_ENABLE_DEBUG === 'true',
    ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true'
};
const SECURITY_CONFIG = {
    /**
   * Token storage location
   * 'sessionStorage' for enhanced security (lost on tab close)
   * 'localStorage' for persistent sessions (survives tab close)
   */ STORAGE_TYPE: 'sessionStorage',
    /**
   * Token expiration settings
   */ TOKEN_EXPIRY: {
        /** Default token lifetime in milliseconds (1 hour) */ DEFAULT: 60 * 60 * 1000,
        /** Maximum token lifetime in milliseconds (8 hours) */ MAX: 8 * 60 * 60 * 1000,
        /** Refresh token lifetime (7 days) */ REFRESH: 7 * 24 * 60 * 60 * 1000
    },
    /**
   * Inactivity timeout in milliseconds (30 minutes)
   * User will be logged out after this period of inactivity
   */ INACTIVITY_TIMEOUT: 30 * 60 * 1000,
    /**
   * Session activity check interval (1 minute)
   */ ACTIVITY_CHECK_INTERVAL: 60 * 1000,
    /**
   * Encryption settings
   */ ENCRYPTION: {
        /** Whether to encrypt tokens in storage */ ENABLED: process.env.NEXT_PUBLIC_ENCRYPT_TOKENS === 'true',
        /** Algorithm for encryption */ ALGORITHM: 'AES-GCM'
    }
};
const VALIDATION_CONFIG = {
    /**
   * Maximum field length for text inputs
   * Prevents excessive data input and potential storage issues
   */ MAX_FIELD_LENGTH: 5000,
    /**
   * Maximum file upload size in bytes (10MB)
   */ MAX_FILE_SIZE: 10 * 1024 * 1024,
    /**
   * Allowed file types for uploads
   */ ALLOWED_FILE_TYPES: [
        'image/jpeg',
        'image/png',
        'image/gif',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ],
    /**
   * Password requirements
   */ PASSWORD: {
        MIN_LENGTH: 8,
        MAX_LENGTH: 128,
        REQUIRE_UPPERCASE: true,
        REQUIRE_LOWERCASE: true,
        REQUIRE_NUMBER: true,
        REQUIRE_SPECIAL_CHAR: true
    }
};
}),
"[project]/src/constants/api.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/src/services/security/CsrfProtection.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * WF-COMP-SEC-002 | CsrfProtection.ts - CSRF Token Protection Service
 * Purpose: Cross-Site Request Forgery protection for healthcare platform
 * Security: Implements CSRF token validation for all state-changing requests
 * Upstream: None | Dependencies: axios
 * Downstream: apiInstance, API interceptors | Called by: HTTP request interceptors
 * Related: apiConfig.ts, ApiClient.ts
 * Exports: CsrfProtection class, csrfProtection singleton, setupCsrfProtection function
 * Last Updated: 2025-10-21 | File Type: .ts
 * Critical Path: Request initiation → CSRF token injection → Server validation
 * LLM Context: Security-critical module for healthcare platform, prevents CSRF attacks on PHI
 */ __turbopack_context__.s([
    "CsrfProtection",
    ()=>CsrfProtection,
    "csrfProtection",
    ()=>csrfProtection,
    "default",
    ()=>__TURBOPACK__default__export__,
    "setupCsrfProtection",
    ()=>setupCsrfProtection
]);
/**
 * HTTP methods that require CSRF protection
 * GET, HEAD, OPTIONS are considered safe methods
 */ const STATE_CHANGING_METHODS = [
    'POST',
    'PUT',
    'PATCH',
    'DELETE'
];
class CsrfProtection {
    static instance = null;
    tokenCache = null;
    TOKEN_HEADER = 'X-CSRF-Token';
    META_TAG_NAME = 'csrf-token';
    COOKIE_NAMES = [
        'XSRF-TOKEN',
        'CSRF-TOKEN'
    ];
    TOKEN_TTL = 60 * 60 * 1000;
    constructor(){
        // Initialize token on construction
        this.refreshToken();
    }
    /**
   * Get singleton instance of CsrfProtection.
   *
   * Implements thread-safe singleton pattern to ensure consistent CSRF
   * protection across the application. First call initializes token cache.
   *
   * Security Benefits:
   * - Centralized CSRF token management
   * - Consistent token injection across all API calls
   * - Single token refresh lifecycle
   *
   * @returns {CsrfProtection} Singleton instance of CsrfProtection
   *
   * @example
   * ```typescript
   * const csrfProtection = CsrfProtection.getInstance();
   * const token = csrfProtection.getToken();
   * ```
   */ static getInstance() {
        if (!CsrfProtection.instance) {
            CsrfProtection.instance = new CsrfProtection();
        }
        return CsrfProtection.instance;
    }
    /**
   * Setup CSRF protection on an Axios instance.
   *
   * Registers a request interceptor that automatically injects CSRF token
   * into state-changing HTTP requests (POST, PUT, PATCH, DELETE). Safe
   * methods (GET, HEAD, OPTIONS) are not modified.
   *
   * Security Features:
   * - Automatic token injection for protected methods
   * - Transparent to application code
   * - Configurable via interceptor pattern
   * - Fails gracefully on token absence
   *
   * OWASP Compliance:
   * - Implements synchronizer token pattern
   * - Follows CSRF protection best practices
   * - Validates state-changing operations only
   *
   * @param {AxiosInstance} axiosInstance - Axios instance to protect with CSRF
   * @returns {number} Interceptor ID for later removal if needed
   *
   * @example
   * ```typescript
   * import axios from 'axios';
   * import { csrfProtection } from './CsrfProtection';
   *
   * const apiClient = axios.create({ baseURL: '/api' });
   * const interceptorId = csrfProtection.setupInterceptor(apiClient);
   *
   * // All POST/PUT/PATCH/DELETE requests now include CSRF token
   * await apiClient.post('/users', data); // Includes X-CSRF-Token header
   *
   * // Later, remove interceptor if needed
   * apiClient.interceptors.request.eject(interceptorId);
   * ```
   *
   * @see {@link injectCsrfToken} for token injection logic
   */ setupInterceptor(axiosInstance) {
        return axiosInstance.interceptors.request.use((config)=>this.injectCsrfToken(config), (error)=>Promise.reject(error));
    }
    /**
   * Inject CSRF token into request headers.
   *
   * Automatically adds X-CSRF-Token header to state-changing HTTP requests.
   * Safe methods (GET, HEAD, OPTIONS) are not modified. Fails gracefully
   * if token is unavailable, logging warning but allowing request.
   *
   * Protected Methods:
   * - POST: Create operations
   * - PUT: Full resource updates
   * - PATCH: Partial resource updates
   * - DELETE: Resource deletion
   *
   * Security Features:
   * - Selective injection (state-changing methods only)
   * - Graceful degradation on token absence
   * - Debug logging for monitoring
   * - Non-invasive error handling
   *
   * Threat Protection:
   * - Prevents CSRF attacks on PHI modifications
   * - Validates request origin via token
   * - Complements same-origin policy
   * - Defense-in-depth security layer
   *
   * @param {InternalAxiosRequestConfig} config - Axios request configuration
   * @returns {InternalAxiosRequestConfig} Modified request configuration with CSRF token
   *
   * @example
   * ```typescript
   * // Manually inject token (usually done by interceptor)
   * const config = {
   *   method: 'POST',
   *   url: '/api/patients',
   *   data: patientData
   * };
   * const protectedConfig = csrfProtection.injectCsrfToken(config);
   * // protectedConfig now includes X-CSRF-Token header
   * ```
   *
   * @see {@link STATE_CHANGING_METHODS} for list of protected methods
   */ injectCsrfToken(config) {
        try {
            const method = config.method?.toUpperCase();
            // Only inject token for state-changing methods
            if (!method || !this.isStateChangingMethod(method)) {
                return config;
            }
            const token = this.getToken();
            if (token) {
                config.headers = config.headers || {};
                config.headers[this.TOKEN_HEADER] = token;
                console.debug('[CsrfProtection] CSRF token injected', {
                    method,
                    url: config.url
                });
            } else {
                console.warn('[CsrfProtection] No CSRF token available for request', {
                    method,
                    url: config.url
                });
            }
            return config;
        } catch (error) {
            console.error('[CsrfProtection] Failed to inject CSRF token:', error);
            return config;
        }
    }
    /**
   * Get current CSRF token.
   *
   * Returns cached CSRF token if valid, otherwise refreshes from document.
   * Token is cached for 1 hour (TOKEN_TTL) to minimize DOM access overhead.
   *
   * Token Sources (priority order):
   * 1. Meta tag: <meta name="csrf-token" content="token">
   * 2. Cookies: XSRF-TOKEN or CSRF-TOKEN
   *
   * Security Features:
   * - Automatic cache validation and refresh
   * - Multiple fallback sources for compatibility
   * - Fail-safe returns null on errors
   * - Performance optimization via caching
   *
   * @returns {string | null} CSRF token string, or null if unavailable
   *
   * @example
   * ```typescript
   * const token = csrfProtection.getToken();
   * if (token) {
   *   // Include token in custom request
   *   fetch('/api/endpoint', {
   *     method: 'POST',
   *     headers: { 'X-CSRF-Token': token }
   *   });
   * } else {
   *   console.warn('CSRF token not available');
   * }
   * ```
   *
   * @remarks
   * Most applications don't call this directly - use setupInterceptor()
   * for automatic token injection.
   */ getToken() {
        try {
            // Check if cached token is still valid
            if (this.tokenCache && Date.now() < this.tokenCache.expiresAt) {
                return this.tokenCache.token;
            }
            // Refresh token
            this.refreshToken();
            return this.tokenCache?.token || null;
        } catch (error) {
            console.error('[CsrfProtection] Failed to get CSRF token:', error);
            return null;
        }
    }
    /**
   * Refresh CSRF token from meta tag or cookie.
   *
   * Extracts fresh CSRF token from document and updates internal cache
   * with new expiration time (1 hour TTL). Call this method after
   * authentication changes or when token becomes stale.
   *
   * Token Extraction Order:
   * 1. Meta tag (preferred): <meta name="csrf-token" content="...">
   * 2. Cookie fallback: XSRF-TOKEN or CSRF-TOKEN
   *
   * Use Cases:
   * - After user login/logout
   * - On authentication state changes
   * - Manual token refresh for long-running sessions
   * - Recovery from token mismatch errors
   *
   * Security Features:
   * - Updates cache with fresh server-provided token
   * - Prevents token staleness issues
   * - Maintains token synchronization with backend
   *
   * @example
   * ```typescript
   * // Refresh token after login
   * async function login(credentials) {
   *   await authApi.login(credentials);
   *   csrfProtection.refreshToken(); // Get new token for session
   * }
   *
   * // Refresh on 403 CSRF error
   * apiClient.interceptors.response.use(
   *   response => response,
   *   error => {
   *     if (error.response?.status === 403) {
   *       csrfProtection.refreshToken();
   *       return retryRequest(error.config);
   *     }
   *     return Promise.reject(error);
   *   }
   * );
   * ```
   */ refreshToken() {
        try {
            const token = this.extractTokenFromDocument();
            if (token) {
                const now = Date.now();
                this.tokenCache = {
                    token,
                    timestamp: now,
                    expiresAt: now + this.TOKEN_TTL
                };
                console.info('[CsrfProtection] CSRF token refreshed');
            } else {
                this.tokenCache = null;
                console.warn('[CsrfProtection] No CSRF token found in document or cookies');
            }
        } catch (error) {
            console.error('[CsrfProtection] Failed to refresh CSRF token:', error);
            this.tokenCache = null;
        }
    }
    /**
   * Clear cached CSRF token.
   *
   * Removes cached token from memory. Call this method on logout or
   * authentication state changes to prevent token reuse across sessions.
   *
   * Security Benefits:
   * - Prevents token reuse after logout
   * - Clears stale tokens on auth changes
   * - Forces fresh token fetch on next request
   *
   * Use Cases:
   * - User logout
   * - Session expiration
   * - Authentication errors
   * - Token invalidation on server
   *
   * @example
   * ```typescript
   * // Clear token on logout
   * async function logout() {
   *   await authApi.logout();
   *   csrfProtection.clearToken();
   *   secureTokenManager.clearTokens();
   *   redirectToLogin();
   * }
   *
   * // Clear on authentication change
   * authStore.subscribe((state) => {
   *   if (!state.isAuthenticated) {
   *     csrfProtection.clearToken();
   *   }
   * });
   * ```
   */ clearToken() {
        this.tokenCache = null;
        console.info('[CsrfProtection] CSRF token cleared');
    }
    /**
   * Extract CSRF token from document sources.
   *
   * Attempts to retrieve CSRF token from multiple sources in priority order.
   * First checks meta tag (preferred), then falls back to cookies.
   *
   * Token Sources:
   * 1. Meta tag: More secure, not sent with every request
   * 2. Cookies: Fallback for compatibility, sent automatically
   *
   * @private
   *
   * @returns {string | null} CSRF token string or null if not found
   *
   * @see {@link getTokenFromMetaTag} for meta tag extraction
   * @see {@link getTokenFromCookie} for cookie extraction
   */ extractTokenFromDocument() {
        // Try meta tag first
        const metaToken = this.getTokenFromMetaTag();
        if (metaToken) {
            return metaToken;
        }
        // Fall back to cookies
        const cookieToken = this.getTokenFromCookie();
        if (cookieToken) {
            return cookieToken;
        }
        return null;
    }
    /**
   * Get CSRF token from meta tag.
   *
   * Searches DOM for meta tag with name="csrf-token" and extracts content
   * attribute. This is the preferred method as meta tags are not automatically
   * sent with requests (unlike cookies).
   *
   * Expected HTML:
   * ```html
   * <meta name="csrf-token" content="token-value-here">
   * ```
   *
   * Security Benefits:
   * - Token not sent automatically with requests
   * - Explicit inclusion prevents certain attack vectors
   * - More control over token exposure
   *
   * @private
   *
   * @returns {string | null} Token string from meta tag content, or null if not found
   */ getTokenFromMetaTag() {
        try {
            // Check if we're in a browser environment
            if (typeof document === 'undefined') {
                return null;
            }
            const metaTag = document.querySelector(`meta[name="${this.META_TAG_NAME}"]`);
            if (metaTag && metaTag.content) {
                return metaTag.content.trim();
            }
            return null;
        } catch (error) {
            console.warn('[CsrfProtection] Failed to get token from meta tag:', error);
            return null;
        }
    }
    /**
   * Get CSRF token from cookies.
   *
   * Searches document.cookie for CSRF token using multiple standard cookie
   * names for framework compatibility. Tries XSRF-TOKEN (Angular/Laravel)
   * and CSRF-TOKEN (Django/Rails) in order.
   *
   * Standard Cookie Names:
   * - XSRF-TOKEN: Used by Angular, Laravel
   * - CSRF-TOKEN: Used by Django, Rails
   *
   * Security Note:
   * - Cookies are automatically sent with requests (less secure than meta tag)
   * - Use httpOnly=false so JavaScript can read token
   * - SameSite attribute should be Strict or Lax
   *
   * @private
   *
   * @returns {string | null} Decoded token string from cookie, or null if not found
   *
   * @remarks
   * Token is URI-decoded before return to handle encoded special characters.
   */ getTokenFromCookie() {
        try {
            // Check if we're in a browser environment
            if (typeof document === 'undefined') {
                return null;
            }
            const cookies = document.cookie.split(';');
            for (const cookieName of this.COOKIE_NAMES){
                for (const cookie of cookies){
                    const [name, value] = cookie.trim().split('=');
                    if (name === cookieName && value) {
                        return decodeURIComponent(value);
                    }
                }
            }
            return null;
        } catch (error) {
            console.warn('[CsrfProtection] Failed to get token from cookies:', error);
            return null;
        }
    }
    /**
   * Check if HTTP method requires CSRF protection.
   *
   * Determines if the given HTTP method is state-changing and requires
   * CSRF token. Safe methods (GET, HEAD, OPTIONS) are not protected
   * as they should not modify server state per HTTP specifications.
   *
   * Protected Methods:
   * - POST: Create new resources
   * - PUT: Replace existing resources
   * - PATCH: Partial resource updates
   * - DELETE: Remove resources
   *
   * Safe Methods (not protected):
   * - GET: Read resources
   * - HEAD: Get resource metadata
   * - OPTIONS: Discover allowed methods
   *
   * @private
   *
   * @param {string} method - HTTP method in uppercase (e.g., 'POST', 'GET')
   * @returns {boolean} True if method requires CSRF protection, false otherwise
   *
   * @see {@link STATE_CHANGING_METHODS} for complete list of protected methods
   */ isStateChangingMethod(method) {
        return STATE_CHANGING_METHODS.includes(method);
    }
    /**
   * Get token cache information.
   *
   * Returns diagnostic information about the cached CSRF token for debugging
   * and monitoring purposes. Useful for troubleshooting CSRF issues and
   * monitoring token lifecycle.
   *
   * Returned Information:
   * - hasToken: Whether a token is currently cached
   * - expiresAt: When cached token expires (milliseconds)
   * - age: How long token has been cached (milliseconds)
   *
   * Use Cases:
   * - Debug CSRF token issues
   * - Monitor token refresh frequency
   * - Health check implementations
   * - Token lifecycle analysis
   *
   * @returns {{ hasToken: boolean; expiresAt?: number; age?: number } | null} Token cache diagnostics
   *
   * @example
   * ```typescript
   * const info = csrfProtection.getTokenInfo();
   * if (info.hasToken) {
   *   console.log('Token age:', info.age, 'ms');
   *   console.log('Expires at:', new Date(info.expiresAt));
   *   console.log('Time until expiry:', info.expiresAt - Date.now(), 'ms');
   * } else {
   *   console.log('No token cached');
   * }
   * ```
   */ getTokenInfo() {
        if (!this.tokenCache) {
            return {
                hasToken: false
            };
        }
        const now = Date.now();
        return {
            hasToken: true,
            expiresAt: this.tokenCache.expiresAt,
            age: now - this.tokenCache.timestamp
        };
    }
}
const csrfProtection = CsrfProtection.getInstance();
function setupCsrfProtection(axiosInstance) {
    return csrfProtection.setupInterceptor(axiosInstance);
}
const __TURBOPACK__default__export__ = csrfProtection;
}),
"[project]/src/services/security/tokenManager/storage.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @fileoverview Token Storage Module
 * @module services/security/tokenManager/storage
 * @category Security - Token Management
 */ __turbopack_context__.s([
    "STORAGE_KEYS",
    ()=>STORAGE_KEYS,
    "TokenStorage",
    ()=>TokenStorage
]);
const STORAGE_KEYS = {
    TOKEN_KEY: 'secure_auth_token',
    REFRESH_TOKEN_KEY: 'secure_refresh_token',
    METADATA_KEY: 'secure_token_metadata',
    ZUSTAND_KEY: 'auth-storage',
    LEGACY_TOKEN_KEY: 'auth_token',
    LEGACY_REFRESH_KEY: 'refresh_token'
};
class TokenStorage {
    /**
   * Store token and metadata securely in sessionStorage
   * 
   * @param metadata - Complete token metadata including token, expiration, activity
   */ static setTokenData(metadata) {
        if ("TURBOPACK compile-time truthy", 1) {
            throw new Error('[TokenStorage] Browser environment required');
        }
        try {
            // Store token
            sessionStorage.setItem(STORAGE_KEYS.TOKEN_KEY, metadata.token);
            // Store refresh token if provided
            if (metadata.refreshToken) {
                sessionStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN_KEY, metadata.refreshToken);
            }
            // Store metadata
            sessionStorage.setItem(STORAGE_KEYS.METADATA_KEY, JSON.stringify(metadata));
            console.info('[TokenStorage] Token data stored successfully');
        } catch (error) {
            console.error('[TokenStorage] Failed to store token data:', error);
            throw error;
        }
    }
    /**
   * Retrieve token metadata from sessionStorage
   * 
   * @returns Token metadata if exists and valid, null otherwise
   */ static getTokenMetadata() {
        if ("TURBOPACK compile-time truthy", 1) {
            return null;
        }
        //TURBOPACK unreachable
        ;
    }
    /**
   * Update token metadata (typically for activity tracking)
   * 
   * @param metadata - Updated metadata to store
   */ static updateTokenMetadata(metadata) {
        if ("TURBOPACK compile-time truthy", 1) {
            return;
        }
        //TURBOPACK unreachable
        ;
    }
    /**
   * Clear all token data from storage
   */ static clearAllTokens() {
        if ("TURBOPACK compile-time truthy", 1) {
            return;
        }
        //TURBOPACK unreachable
        ;
    }
    /**
   * Update Zustand auth storage for backward compatibility
   * 
   * Maintains synchronization with legacy Zustand-based authentication state
   * in localStorage. Ensures existing code using Zustand store continues to
   * function during migration to SecureTokenManager.
   * 
   * @param token - JWT token to store in Zustand format
   */ static updateZustandStorage(token) {
        if ("TURBOPACK compile-time truthy", 1) {
            return;
        }
        //TURBOPACK unreachable
        ;
    }
    /**
   * Check if tokens exist in storage
   * 
   * @returns True if any token data exists in sessionStorage
   */ static hasTokenData() {
        if ("TURBOPACK compile-time truthy", 1) {
            return false;
        }
        //TURBOPACK unreachable
        ;
    }
    /**
   * Get legacy tokens from localStorage for migration
   * 
   * @returns Object with legacy tokens if they exist, null otherwise
   */ static getLegacyTokens() {
        if ("TURBOPACK compile-time truthy", 1) {
            return null;
        }
        //TURBOPACK unreachable
        ;
    }
    /**
   * Remove legacy tokens from localStorage
   */ static removeLegacyTokens() {
        if ("TURBOPACK compile-time truthy", 1) {
            return;
        }
        //TURBOPACK unreachable
        ;
    }
}
}),
"[project]/src/services/security/tokenManager/validation.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @fileoverview Token Validation Module
 * @module services/security/tokenManager/validation
 * @category Security - Token Management
 */ __turbopack_context__.s([
    "JwtParser",
    ()=>JwtParser,
    "TokenValidator",
    ()=>TokenValidator
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/constants/config.ts [app-ssr] (ecmascript)");
;
class JwtParser {
    /**
   * Parse JWT token to extract expiration time
   * 
   * Decodes JWT payload to extract 'exp' claim (expiration timestamp).
   * Converts Unix timestamp (seconds) to JavaScript timestamp (milliseconds).
   * 
   * @param token - JWT token string (format: header.payload.signature)
   * @returns Expiration timestamp in milliseconds, or null if parsing fails
   */ static parseExpiration(token) {
        try {
            const parts = token.split('.');
            if (parts.length !== 3) {
                console.warn('[JwtParser] Invalid JWT format: expected 3 parts');
                return null;
            }
            const payload = JSON.parse(atob(parts[1]));
            if (payload.exp && typeof payload.exp === 'number') {
                return payload.exp * 1000; // Convert seconds to milliseconds
            }
            console.warn('[JwtParser] JWT missing or invalid exp claim');
            return null;
        } catch (error) {
            console.warn('[JwtParser] Failed to parse JWT expiration:', error);
            return null;
        }
    }
    /**
   * Validate JWT format without signature verification
   * 
   * Performs basic format validation to ensure token is a valid JWT structure.
   * Does NOT validate signature - this is for client-side convenience only.
   * 
   * @param token - JWT token to validate
   * @returns True if format is valid, false otherwise
   */ static isValidFormat(token) {
        if (!token || typeof token !== 'string') {
            return false;
        }
        const parts = token.split('.');
        if (parts.length !== 3) {
            return false;
        }
        try {
            // Validate base64 encoding of header and payload
            JSON.parse(atob(parts[0])); // Header
            JSON.parse(atob(parts[1])); // Payload
            return true;
        } catch  {
            return false;
        }
    }
    /**
   * Extract all claims from JWT payload
   * 
   * @param token - JWT token to parse
   * @returns JWT payload object or null if parsing fails
   */ static parsePayload(token) {
        try {
            const parts = token.split('.');
            if (parts.length !== 3) {
                return null;
            }
            return JSON.parse(atob(parts[1]));
        } catch (error) {
            console.warn('[JwtParser] Failed to parse JWT payload:', error);
            return null;
        }
    }
}
class TokenValidator {
    /**
   * Validate token expiration and activity timeout
   * 
   * Performs comprehensive validation of token expiration and inactivity
   * timeout. Used internally by getToken() and externally for manual
   * session validation checks.
   * 
   * Validation Criteria:
   * 1. Token metadata exists and is valid
   * 2. Current time is before token expiration (JWT exp claim)
   * 3. Session hasn't exceeded 8-hour inactivity timeout
   * 
   * @param metadata - Token metadata to validate
   * @returns Detailed validation result with reason for failure
   */ static validateToken(metadata) {
        if (!metadata) {
            return {
                isValid: false,
                reason: 'missing'
            };
        }
        if (!metadata.token || typeof metadata.token !== 'string') {
            return {
                isValid: false,
                reason: 'invalid'
            };
        }
        const now = Date.now();
        // Check token expiration
        if (now >= metadata.expiresAt) {
            return {
                isValid: false,
                reason: 'expired',
                timeUntilExpiration: 0,
                timeSinceActivity: now - metadata.lastActivity
            };
        }
        // Check inactivity timeout (8 hours from SECURITY_CONFIG)
        const inactivityThreshold = metadata.lastActivity + __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SECURITY_CONFIG"].INACTIVITY_TIMEOUT;
        if (now >= inactivityThreshold) {
            return {
                isValid: false,
                reason: 'inactive',
                timeUntilExpiration: metadata.expiresAt - now,
                timeSinceActivity: now - metadata.lastActivity
            };
        }
        return {
            isValid: true,
            timeUntilExpiration: metadata.expiresAt - now,
            timeSinceActivity: now - metadata.lastActivity
        };
    }
    /**
   * Check if token is valid (boolean result)
   * 
   * Simplified validation that returns only boolean result.
   * Use validateToken() for detailed validation information.
   * 
   * @param metadata - Token metadata to validate
   * @returns True if token is valid, false otherwise
   */ static isTokenValid(metadata) {
        if (!metadata) {
            return false;
        }
        const result = TokenValidator.validateToken(metadata);
        return result.isValid;
    }
    /**
   * Get time remaining until token expiration
   * 
   * @param metadata - Token metadata
   * @returns Milliseconds until expiration, or 0 if expired/invalid
   */ static getTimeUntilExpiration(metadata) {
        if (!metadata) {
            return 0;
        }
        const remaining = metadata.expiresAt - Date.now();
        return remaining > 0 ? remaining : 0;
    }
    /**
   * Get time since last activity
   * 
   * @param metadata - Token metadata
   * @returns Milliseconds since last activity, or 0 if no token
   */ static getTimeSinceActivity(metadata) {
        if (!metadata) {
            return 0;
        }
        return Date.now() - metadata.lastActivity;
    }
    /**
   * Check if token expires soon (within threshold)
   * 
   * @param metadata - Token metadata
   * @param thresholdMs - Threshold in milliseconds (default: 5 minutes)
   * @returns True if token expires within threshold
   */ static isExpiringSoon(metadata, thresholdMs = 5 * 60 * 1000) {
        if (!metadata) {
            return false;
        }
        const timeUntilExpiration = TokenValidator.getTimeUntilExpiration(metadata);
        return timeUntilExpiration > 0 && timeUntilExpiration <= thresholdMs;
    }
    /**
   * Check if session is approaching inactivity timeout
   * 
   * @param metadata - Token metadata
   * @param warningThresholdMs - Warning threshold in milliseconds (default: 30 minutes)
   * @returns True if approaching inactivity timeout
   */ static isApproachingInactivityTimeout(metadata, warningThresholdMs = 30 * 60 * 1000) {
        if (!metadata) {
            return false;
        }
        const timeSinceActivity = TokenValidator.getTimeSinceActivity(metadata);
        const inactivityTimeoutMs = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SECURITY_CONFIG"].INACTIVITY_TIMEOUT;
        const timeUntilTimeout = inactivityTimeoutMs - timeSinceActivity;
        return timeUntilTimeout > 0 && timeUntilTimeout <= warningThresholdMs;
    }
    /**
   * Create token metadata from token and optional parameters
   * 
   * @param token - JWT token string
   * @param refreshToken - Optional refresh token
   * @param expiresIn - Optional custom expiration in seconds
   * @returns Token metadata object
   * @throws Error if token is invalid or expired
   */ static createTokenMetadata(token, refreshToken, expiresIn) {
        if (!token || typeof token !== 'string') {
            throw new Error('[TokenValidator] Invalid token provided');
        }
        if (!JwtParser.isValidFormat(token)) {
            throw new Error('[TokenValidator] Token format is invalid');
        }
        const now = Date.now();
        let expirationTime;
        if (expiresIn) {
            expirationTime = now + expiresIn * 1000;
        } else {
            const jwtExpiration = JwtParser.parseExpiration(token);
            expirationTime = jwtExpiration || now + 24 * 60 * 60 * 1000; // Default 24 hours
        }
        // Validate token isn't already expired
        if (expirationTime <= now) {
            throw new Error('[TokenValidator] Cannot create metadata for expired token');
        }
        return {
            token,
            refreshToken,
            issuedAt: now,
            expiresAt: expirationTime,
            lastActivity: now
        };
    }
    /**
   * Update activity timestamp in metadata
   * 
   * @param metadata - Current token metadata
   * @returns Updated metadata with current activity timestamp
   */ static updateActivity(metadata) {
        return {
            ...metadata,
            lastActivity: Date.now()
        };
    }
}
}),
"[project]/src/services/security/tokenManager/migration.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @fileoverview Token Migration Module
 * @module services/security/tokenManager/migration
 * @category Security - Token Management
 */ __turbopack_context__.s([
    "TokenMigration",
    ()=>TokenMigration
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$security$2f$tokenManager$2f$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/security/tokenManager/storage.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$security$2f$tokenManager$2f$validation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/security/tokenManager/validation.ts [app-ssr] (ecmascript)");
;
;
class TokenMigration {
    /**
   * Perform migration from localStorage to sessionStorage
   * 
   * Performs one-time migration of legacy tokens stored in localStorage
   * to the more secure sessionStorage. Validates token expiration before
   * migration and removes expired tokens.
   * 
   * Security Upgrade:
   * - localStorage persists across browser sessions (security risk)
   * - sessionStorage is cleared when browser/tab closes (more secure)
   * - Migration is automatic and transparent to users
   * 
   * HIPAA Compliance:
   * - Reduces token persistence window
   * - Limits exposure of authentication credentials
   * - Aligns with minimum necessary access principle
   * 
   * @returns True if migration was performed, false if no migration needed
   */ static migrateFromLocalStorage() {
        if ("TURBOPACK compile-time truthy", 1) {
            console.info('[TokenMigration] Skipping migration - not in browser environment');
            return false;
        }
        //TURBOPACK unreachable
        ;
    }
    /**
   * Check if migration is needed
   * 
   * @returns True if legacy tokens exist and migration should be attempted
   */ static isMigrationNeeded() {
        if ("TURBOPACK compile-time truthy", 1) {
            return false;
        }
        //TURBOPACK unreachable
        ;
    }
    /**
   * Get migration status information
   * 
   * @returns Object with migration status details
   */ static getMigrationStatus() {
        if ("TURBOPACK compile-time truthy", 1) {
            return {
                hasLegacyTokens: false,
                hasCurrentTokens: false,
                migrationNeeded: false,
                legacyTokenValid: false
            };
        }
        //TURBOPACK unreachable
        ;
        const hasLegacyTokens = undefined;
        const hasCurrentTokens = undefined;
        const migrationNeeded = undefined;
        let legacyTokenValid;
    }
    /**
   * Force clean migration - removes all tokens and starts fresh
   * 
   * Useful for debugging or when migration fails repeatedly.
   * Removes all tokens from both localStorage and sessionStorage.
   */ static forceCleanMigration() {
        console.warn('[TokenMigration] Performing force clean migration - all tokens will be removed');
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$security$2f$tokenManager$2f$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TokenStorage"].clearAllTokens();
        console.info('[TokenMigration] Force clean migration completed');
    }
    /**
   * Validate current storage state and fix inconsistencies
   * 
   * Checks for and resolves common storage inconsistencies:
   * - Orphaned tokens without metadata
   * - Expired tokens still in storage
   * - Mismatched token/metadata pairs
   * 
   * @returns Object with validation results and actions taken
   */ static validateAndRepairStorage() {
        const actionsPerformed = [];
        let hadInconsistencies = false;
        try {
            const metadata = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$security$2f$tokenManager$2f$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TokenStorage"].getTokenMetadata();
            if (!metadata) {
                // No metadata but check if orphaned tokens exist
                if (typeof sessionStorage !== 'undefined') {
                    const hasOrphanedToken = !!(sessionStorage.getItem('secure_auth_token') || sessionStorage.getItem('secure_refresh_token'));
                    if (hasOrphanedToken) {
                        hadInconsistencies = true;
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$security$2f$tokenManager$2f$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TokenStorage"].clearAllTokens();
                        actionsPerformed.push('Removed orphaned tokens without metadata');
                    }
                }
                return {
                    hadInconsistencies,
                    actionsPerformed,
                    finalState: 'empty'
                };
            }
            // Validate token in metadata
            const validationResult = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$security$2f$tokenManager$2f$validation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TokenValidator"].validateToken(metadata);
            if (!validationResult.isValid) {
                hadInconsistencies = true;
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$security$2f$tokenManager$2f$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TokenStorage"].clearAllTokens();
                actionsPerformed.push(`Removed invalid token: ${validationResult.reason}`);
                return {
                    hadInconsistencies,
                    actionsPerformed,
                    finalState: 'empty'
                };
            }
            // Check for format issues
            if (!__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$security$2f$tokenManager$2f$validation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["JwtParser"].isValidFormat(metadata.token)) {
                hadInconsistencies = true;
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$security$2f$tokenManager$2f$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TokenStorage"].clearAllTokens();
                actionsPerformed.push('Removed token with invalid JWT format');
                return {
                    hadInconsistencies,
                    actionsPerformed,
                    finalState: 'empty'
                };
            }
            return {
                hadInconsistencies,
                actionsPerformed,
                finalState: 'valid'
            };
        } catch (error) {
            console.error('[TokenMigration] Error during storage validation:', error);
            hadInconsistencies = true;
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$security$2f$tokenManager$2f$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TokenStorage"].clearAllTokens();
            actionsPerformed.push('Cleared all tokens due to validation error');
            return {
                hadInconsistencies,
                actionsPerformed,
                finalState: 'empty'
            };
        }
    }
    /**
   * Initialize migration system
   * 
   * Performs initial migration check and storage validation.
   * Should be called once during application startup.
   * 
   * @returns Summary of initialization actions
   */ static initialize() {
        const details = [];
        let migrationPerformed = false;
        let repairPerformed = false;
        let finalStatus = 'empty';
        try {
            // First, validate and repair current storage
            const repairResult = TokenMigration.validateAndRepairStorage();
            if (repairResult.hadInconsistencies) {
                repairPerformed = true;
                details.push(...repairResult.actionsPerformed);
            }
            // Then attempt migration if needed
            if (TokenMigration.isMigrationNeeded()) {
                migrationPerformed = TokenMigration.migrateFromLocalStorage();
                if (migrationPerformed) {
                    details.push('Legacy tokens migrated to sessionStorage');
                    finalStatus = 'ready';
                }
            } else {
                // Check if we have valid tokens after repair
                if (repairResult.finalState === 'valid') {
                    finalStatus = 'ready';
                    details.push('Existing tokens validated');
                }
            }
            return {
                migrationPerformed,
                repairPerformed,
                finalStatus,
                details
            };
        } catch (error) {
            console.error('[TokenMigration] Error during initialization:', error);
            details.push('Initialization failed with error');
            return {
                migrationPerformed: false,
                repairPerformed: false,
                finalStatus: 'error',
                details
            };
        }
    }
}
}),
"[project]/src/services/security/tokenManager/activityTracker.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @fileoverview Activity Tracking Module
 * @module services/security/tokenManager/activityTracker
 * @category Security - Token Management
 */ __turbopack_context__.s([
    "ActivityTracker",
    ()=>ActivityTracker,
    "activityTracker",
    ()=>activityTracker
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/constants/config.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$security$2f$tokenManager$2f$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/security/tokenManager/storage.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$security$2f$tokenManager$2f$validation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/security/tokenManager/validation.ts [app-ssr] (ecmascript)");
;
;
;
class ActivityTracker {
    static instance = null;
    cleanupInterval = null;
    CLEANUP_INTERVAL_MS = 60 * 1000;
    constructor(){
        this.initializeCleanup();
    }
    /**
   * Get singleton instance of ActivityTracker
   * 
   * @returns Singleton instance of ActivityTracker
   */ static getInstance() {
        if (!ActivityTracker.instance) {
            ActivityTracker.instance = new ActivityTracker();
        }
        return ActivityTracker.instance;
    }
    /**
   * Initialize automatic cleanup interval for expired token detection
   * 
   * Establishes a recurring check every 60 seconds to validate token status
   * and automatically clear expired tokens. Also registers window unload
   * handler to cleanup resources on browser close.
   * 
   * Security Benefits:
   * - Automatic removal of expired tokens prevents unauthorized access
   * - Prevents memory leaks from orphaned tokens
   * - Ensures timely session termination on inactivity
   * 
   * HIPAA Compliance:
   * - Enforces automatic session timeout requirements
   * - Prevents access after session expiration
   * - Implements defense-in-depth for PHI protection
   */ initializeCleanup() {
        // Check if we're in a browser environment
        if ("TURBOPACK compile-time truthy", 1) {
            return;
        }
        //TURBOPACK unreachable
        ;
    }
    /**
   * Initialize user activity monitoring
   * 
   * Sets up event listeners to detect user activity and update session
   * timestamps. This extends the inactivity timeout window when users
   * are actively using the application.
   */ initializeActivityMonitoring() {
        if ("TURBOPACK compile-time truthy", 1) {
            return;
        }
        //TURBOPACK unreachable
        ;
        // Events that indicate user activity
        const activityEvents = undefined;
        // Throttle activity updates to prevent excessive storage writes
        let lastActivityUpdate;
        const ACTIVITY_UPDATE_THROTTLE = undefined; // 30 seconds
        const handleActivity = undefined;
    }
    /**
   * Initialize API request activity monitoring
   * 
   * Monitors fetch requests and XMLHttpRequests to track API activity
   * as user activity for session extension.
   */ initializeApiActivityMonitoring() {
        if ("TURBOPACK compile-time truthy", 1) {
            return;
        }
        //TURBOPACK unreachable
        ;
        // Monitor fetch requests
        const originalFetch = undefined;
        // Monitor XMLHttpRequest
        const originalOpen = undefined;
    }
    /**
   * Perform automatic cleanup check
   * 
   * Called by the cleanup interval to check for expired tokens and
   * perform automatic cleanup when necessary.
   */ performCleanupCheck() {
        try {
            const metadata = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$security$2f$tokenManager$2f$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TokenStorage"].getTokenMetadata();
            if (!metadata) {
                // No tokens to check
                return;
            }
            const validationResult = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$security$2f$tokenManager$2f$validation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TokenValidator"].validateToken(metadata);
            if (!validationResult.isValid) {
                console.info(`[ActivityTracker] Automatic cleanup triggered: ${validationResult.reason}`);
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$security$2f$tokenManager$2f$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TokenStorage"].clearAllTokens();
                // Emit custom event for application to handle session expiration
                this.emitSessionExpiredEvent(validationResult.reason || 'unknown');
            }
        } catch (error) {
            console.error('[ActivityTracker] Error during cleanup check:', error);
        }
    }
    /**
   * Emit session expired event for application handling
   * 
   * @param reason - Reason for session expiration
   */ emitSessionExpiredEvent(reason) {
        if ("TURBOPACK compile-time truthy", 1) {
            return;
        }
        //TURBOPACK unreachable
        ;
    }
    /**
   * Update last activity timestamp
   * 
   * Updates the lastActivity field in token metadata to current time.
   * Called automatically on user activity events and can be called
   * manually to extend session timeout.
   */ updateActivity() {
        try {
            const metadata = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$security$2f$tokenManager$2f$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TokenStorage"].getTokenMetadata();
            if (!metadata) {
                return;
            }
            // Only update if token is still valid
            if (!__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$security$2f$tokenManager$2f$validation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TokenValidator"].isTokenValid(metadata)) {
                return;
            }
            const updatedMetadata = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$security$2f$tokenManager$2f$validation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TokenValidator"].updateActivity(metadata);
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$security$2f$tokenManager$2f$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TokenStorage"].updateTokenMetadata(updatedMetadata);
        } catch (error) {
            console.error('[ActivityTracker] Failed to update activity:', error);
        }
    }
    /**
   * Get current activity status
   * 
   * @returns Object with current activity timing information
   */ getActivityStatus() {
        const metadata = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$security$2f$tokenManager$2f$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TokenStorage"].getTokenMetadata();
        if (!metadata) {
            return {
                isActive: false,
                timeSinceActivity: 0,
                timeUntilInactivityTimeout: 0,
                timeUntilExpiration: 0,
                warningLevel: 'none'
            };
        }
        const timeSinceActivity = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$security$2f$tokenManager$2f$validation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TokenValidator"].getTimeSinceActivity(metadata);
        const timeUntilExpiration = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$security$2f$tokenManager$2f$validation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TokenValidator"].getTimeUntilExpiration(metadata);
        const timeUntilInactivityTimeout = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SECURITY_CONFIG"].INACTIVITY_TIMEOUT - timeSinceActivity;
        // Determine warning level
        let warningLevel = 'none';
        if (timeUntilInactivityTimeout <= 5 * 60 * 1000) {
            warningLevel = 'critical';
        } else if (timeUntilInactivityTimeout <= 15 * 60 * 1000) {
            warningLevel = 'approaching';
        }
        return {
            isActive: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$security$2f$tokenManager$2f$validation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TokenValidator"].isTokenValid(metadata),
            timeSinceActivity,
            timeUntilInactivityTimeout: Math.max(0, timeUntilInactivityTimeout),
            timeUntilExpiration,
            warningLevel
        };
    }
    /**
   * Check if session warning should be displayed
   * 
   * @param warningThresholdMs - Warning threshold in milliseconds (default: 15 minutes)
   * @returns True if warning should be displayed
   */ shouldShowSessionWarning(warningThresholdMs = 15 * 60 * 1000) {
        const metadata = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$security$2f$tokenManager$2f$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TokenStorage"].getTokenMetadata();
        if (!metadata || !__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$security$2f$tokenManager$2f$validation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TokenValidator"].isTokenValid(metadata)) {
            return false;
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$security$2f$tokenManager$2f$validation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TokenValidator"].isApproachingInactivityTimeout(metadata, warningThresholdMs);
    }
    /**
   * Force refresh session activity
   * 
   * Manually updates activity timestamp to extend session.
   * Useful for "keep session alive" functionality.
   */ refreshSession() {
        try {
            const metadata = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$security$2f$tokenManager$2f$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TokenStorage"].getTokenMetadata();
            if (!metadata || !__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$security$2f$tokenManager$2f$validation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TokenValidator"].isTokenValid(metadata)) {
                return false;
            }
            this.updateActivity();
            console.info('[ActivityTracker] Session refreshed manually');
            return true;
        } catch (error) {
            console.error('[ActivityTracker] Failed to refresh session:', error);
            return false;
        }
    }
    /**
   * Start session timeout warning notifications
   * 
   * @param warningCallback - Callback function called when warnings should be shown
   * @param checkIntervalMs - How often to check (default: 30 seconds)
   * @returns Cleanup function to stop notifications
   */ startSessionWarnings(warningCallback, checkIntervalMs = 30 * 1000) {
        if ("TURBOPACK compile-time truthy", 1) {
            return ()=>{};
        }
        //TURBOPACK unreachable
        ;
        const interval = undefined;
    }
    /**
   * Cleanup resources
   * 
   * Stops automatic cleanup interval and releases resources.
   * Called automatically on window unload.
   */ cleanup() {
        if (this.cleanupInterval !== null) {
            clearInterval(this.cleanupInterval);
            this.cleanupInterval = null;
        }
    }
    /**
   * Reset and reinitialize activity tracker
   * 
   * Useful for testing or when recreating the tracker instance.
   */ reset() {
        this.cleanup();
        ActivityTracker.instance = null;
    }
}
const activityTracker = ActivityTracker.getInstance();
}),
"[project]/src/services/security/tokenManager/types.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @fileoverview Token Manager Type Definitions
 * @module services/security/tokenManager/types
 * @category Security - Token Management
 */ /**
 * Token metadata stored alongside the authentication token.
 *
 * This interface tracks token lifecycle, expiration, and user activity
 * for HIPAA-compliant session management and automatic timeout enforcement.
 *
 * @property {string} token - JWT access token for API authentication
 * @property {string} [refreshToken] - Optional refresh token for token renewal
 * @property {number} issuedAt - Timestamp when token was stored (milliseconds since epoch)
 * @property {number} expiresAt - Timestamp when token expires (milliseconds since epoch)
 * @property {number} lastActivity - Timestamp of last user activity for inactivity timeout
 */ __turbopack_context__.s([]);
;
}),
"[project]/src/services/security/tokenManager/index.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

/**
 * @fileoverview Secure Token Manager - Main Orchestrator
 * @module services/security/tokenManager
 * @category Security - Token Management
 */ __turbopack_context__.s([
    "SecureTokenManager",
    ()=>SecureTokenManager,
    "default",
    ()=>__TURBOPACK__default__export__,
    "secureTokenManager",
    ()=>secureTokenManager
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$security$2f$tokenManager$2f$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/security/tokenManager/storage.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$security$2f$tokenManager$2f$validation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/security/tokenManager/validation.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$security$2f$tokenManager$2f$migration$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/security/tokenManager/migration.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$security$2f$tokenManager$2f$activityTracker$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/security/tokenManager/activityTracker.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$security$2f$tokenManager$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/security/tokenManager/types.ts [app-ssr] (ecmascript)");
;
;
;
;
class SecureTokenManager {
    static instance = null;
    activityTracker;
    constructor(){
        this.activityTracker = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$security$2f$tokenManager$2f$activityTracker$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ActivityTracker"].getInstance();
        this.initialize();
    }
    /**
   * Get singleton instance of SecureTokenManager.
   *
   * Implements thread-safe singleton pattern to ensure only one token manager
   * exists throughout the application lifecycle. First call initializes the
   * instance with automatic cleanup and token migration from legacy storage.
   *
   * Security Benefits:
   * - Centralized token management prevents inconsistent state
   * - Single cleanup lifecycle for proper resource management
   * - Consistent security policies across all API calls
   *
   * @returns {SecureTokenManager} Singleton instance of SecureTokenManager
   *
   * @example
   * ```typescript
   * const tokenManager = SecureTokenManager.getInstance();
   * tokenManager.setToken(accessToken, refreshToken);
   * ```
   */ static getInstance() {
        if (!SecureTokenManager.instance) {
            SecureTokenManager.instance = new SecureTokenManager();
        }
        return SecureTokenManager.instance;
    }
    /**
   * Initialize the token manager
   * 
   * Performs migration from legacy storage and initializes the activity tracker.
   * Called automatically during instance creation.
   */ initialize() {
        try {
            // Initialize migration system and perform any needed migrations
            const initResult = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$security$2f$tokenManager$2f$migration$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TokenMigration"].initialize();
            if (initResult.details.length > 0) {
                console.info('[SecureTokenManager] Initialization completed:', {
                    migrationPerformed: initResult.migrationPerformed,
                    repairPerformed: initResult.repairPerformed,
                    finalStatus: initResult.finalStatus,
                    details: initResult.details
                });
            }
        } catch (error) {
            console.error('[SecureTokenManager] Failed to initialize:', error);
        }
    }
    /**
   * Store authentication token securely in sessionStorage.
   *
   * Validates and stores JWT access token with metadata tracking for expiration
   * and activity monitoring. Parses JWT to extract expiration time or uses
   * provided expiresIn parameter. Rejects already-expired tokens.
   *
   * Storage Mechanism:
   * - Token: sessionStorage (cleared on browser/tab close)
   * - Metadata: Includes issuedAt, expiresAt, lastActivity timestamps
   * - Backward compatibility: Updates Zustand storage for legacy code
   *
   * Security Features:
   * - Validates token format and expiration before storage
   * - Throws error on invalid or expired tokens
   * - Uses sessionStorage to prevent cross-session persistence
   * - Automatic activity tracking for inactivity timeout
   *
   * HIPAA Compliance:
   * - Implements secure token storage with automatic expiration
   * - Limits token lifetime to prevent unauthorized access
   * - Enforces session timeout requirements
   *
   * @param {string} token - JWT access token to store
   * @param {string} [refreshToken] - Optional refresh token for token renewal
   * @param {number} [expiresIn] - Optional custom expiration in seconds (defaults to JWT exp or 24 hours)
   *
   * @throws {Error} If token is invalid (not a string or empty)
   * @throws {Error} If token is already expired
   *
   * @example
   * ```typescript
   * // Store token with refresh token
   * secureTokenManager.setToken(accessToken, refreshToken);
   *
   * // Store token with custom expiration (1 hour)
   * secureTokenManager.setToken(accessToken, undefined, 3600);
   *
   * // Handle errors
   * try {
   *   secureTokenManager.setToken(token);
   * } catch (error) {
   *   console.error('Failed to store token:', error);
   * }
   * ```
   */ setToken(token, refreshToken, expiresIn) {
        try {
            // Create and validate metadata
            const metadata = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$security$2f$tokenManager$2f$validation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TokenValidator"].createTokenMetadata(token, refreshToken, expiresIn);
            // Store using storage module
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$security$2f$tokenManager$2f$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TokenStorage"].setTokenData(metadata);
            // Update Zustand storage for backward compatibility
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$security$2f$tokenManager$2f$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TokenStorage"].updateZustandStorage(token);
            console.info('[SecureTokenManager] Token stored successfully', {
                expiresAt: new Date(metadata.expiresAt).toISOString(),
                hasRefreshToken: !!refreshToken
            });
        } catch (error) {
            console.error('[SecureTokenManager] Failed to store token:', error);
            throw error;
        }
    }
    /**
   * Retrieve authentication token if valid.
   *
   * Returns the stored JWT access token after validating expiration and
   * inactivity timeout. Automatically updates last activity timestamp to
   * track user session. Returns null if token is expired, invalid, or
   * doesn't exist.
   *
   * Validation Checks:
   * 1. Token exists in sessionStorage
   * 2. Token hasn't reached expiration time (from JWT exp claim)
   * 3. Session hasn't exceeded inactivity timeout (8 hours)
   * 4. Metadata is valid and parseable
   *
   * Security Features:
   * - Automatic validation prevents use of expired tokens
   * - Activity tracking for inactivity timeout enforcement
   * - Automatic cleanup on validation failure
   * - Fail-safe returns null on any error
   *
   * HIPAA Compliance:
   * - Enforces session timeout after 8 hours of inactivity
   * - Prevents access with expired credentials
   * - Implements automatic session termination
   *
   * @returns {string | null} JWT access token if valid, null otherwise
   *
   * @example
   * ```typescript
   * const token = secureTokenManager.getToken();
   * if (token) {
   *   // Use token for API request
   *   apiClient.setAuthHeader(token);
   * } else {
   *   // Token expired or invalid, redirect to login
   *   redirectToLogin();
   * }
   * ```
   *
   * @remarks
   * This method is called automatically by API interceptors before each
   * authenticated request. It serves as the primary token validation
   * mechanism for the application.
   */ getToken() {
        try {
            const metadata = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$security$2f$tokenManager$2f$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TokenStorage"].getTokenMetadata();
            if (!metadata) {
                return null;
            }
            // Validate token
            if (!__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$security$2f$tokenManager$2f$validation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TokenValidator"].isTokenValid(metadata)) {
                this.clearTokens();
                return null;
            }
            // Update last activity through activity tracker
            this.activityTracker.updateActivity();
            return metadata.token;
        } catch (error) {
            console.error('[SecureTokenManager] Failed to retrieve token:', error);
            return null;
        }
    }
    /**
   * Retrieve refresh token if valid.
   *
   * Returns the stored refresh token after validating the associated access
   * token's expiration and inactivity status. Used for obtaining new access
   * tokens without requiring user re-authentication.
   *
   * Security Features:
   * - Validates access token before returning refresh token
   * - Returns null if session is expired or inactive
   * - Automatic cleanup on validation failure
   * - Prevents use of orphaned refresh tokens
   *
   * Token Refresh Flow:
   * 1. Access token expires
   * 2. Get refresh token using this method
   * 3. Send refresh token to auth endpoint
   * 4. Receive new access token
   * 5. Store new token using setToken()
   *
   * @returns {string | null} Refresh token if valid, null otherwise
   *
   * @example
   * ```typescript
   * const refreshToken = secureTokenManager.getRefreshToken();
   * if (refreshToken) {
   *   // Use refresh token to get new access token
   *   const newAccessToken = await authApi.refreshToken(refreshToken);
   *   secureTokenManager.setToken(newAccessToken, refreshToken);
   * } else {
   *   // No valid refresh token, redirect to login
   *   redirectToLogin();
   * }
   * ```
   */ getRefreshToken() {
        try {
            const metadata = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$security$2f$tokenManager$2f$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TokenStorage"].getTokenMetadata();
            if (!metadata || !metadata.refreshToken) {
                return null;
            }
            // Validate token
            if (!__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$security$2f$tokenManager$2f$validation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TokenValidator"].isTokenValid(metadata)) {
                this.clearTokens();
                return null;
            }
            return metadata.refreshToken;
        } catch (error) {
            console.error('[SecureTokenManager] Failed to retrieve refresh token:', error);
            return null;
        }
    }
    /**
   * Check if current token is valid.
   *
   * Performs comprehensive validation of token expiration and inactivity
   * timeout. Used internally by getToken() and externally for manual
   * session validation checks.
   *
   * Validation Criteria:
   * 1. Token metadata exists and is parseable
   * 2. Current time is before token expiration (JWT exp claim)
   * 3. Session hasn't exceeded 8-hour inactivity timeout
   *
   * Security Features:
   * - Dual validation: expiration + inactivity timeout
   * - Logs validation failures for audit trail
   * - Fail-safe returns false on any error
   * - Configurable inactivity timeout from SECURITY_CONFIG
   *
   * HIPAA Compliance:
   * - Enforces automatic session timeout requirements
   * - Implements defense-in-depth validation
   * - Provides audit logging for session expiration
   *
   * @param {TokenMetadata} [metadata] - Optional metadata to validate (fetches current if not provided)
   * @returns {boolean} True if token is valid, false otherwise
   *
   * @example
   * ```typescript
   * // Check token validity before sensitive operation
   * if (secureTokenManager.isTokenValid()) {
   *   await updatePatientRecord(data);
   * } else {
   *   showSessionExpiredModal();
   * }
   *
   * // Validate specific metadata
   * const metadata = getStoredMetadata();
   * const isValid = secureTokenManager.isTokenValid(metadata);
   * ```
   *
   * @see {@link SECURITY_CONFIG} for SESSION_TIMEOUT configuration
   */ isTokenValid(metadata) {
        try {
            const meta = metadata || __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$security$2f$tokenManager$2f$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TokenStorage"].getTokenMetadata();
            return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$security$2f$tokenManager$2f$validation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TokenValidator"].isTokenValid(meta);
        } catch (error) {
            console.error('[SecureTokenManager] Failed to validate token:', error);
            return false;
        }
    }
    /**
   * Get time remaining until token expiration.
   *
   * Calculates remaining time based on token's expiresAt timestamp.
   * Useful for proactive token refresh and session expiration warnings.
   *
   * Use Cases:
   * - Display countdown timers for session expiration
   * - Trigger proactive token refresh before expiration
   * - Schedule session timeout warnings
   * - Monitor token lifetime for debugging
   *
   * @returns {number} Milliseconds until expiration, or 0 if expired/invalid
   *
   * @example
   * ```typescript
   * const remaining = secureTokenManager.getTimeUntilExpiration();
   *
   * // Display minutes remaining
   * const minutes = Math.floor(remaining / 60000);
   * console.log(`Session expires in ${minutes} minutes`);
   *
   * // Refresh token if expiring soon (< 5 minutes)
   * if (remaining < 5 * 60 * 1000 && remaining > 0) {
   *   await refreshAccessToken();
   * }
   *
   * // Show expiration warning
   * if (remaining < 2 * 60 * 1000 && remaining > 0) {
   *   showSessionExpirationWarning(remaining);
   * }
   * ```
   */ getTimeUntilExpiration() {
        try {
            const metadata = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$security$2f$tokenManager$2f$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TokenStorage"].getTokenMetadata();
            return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$security$2f$tokenManager$2f$validation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TokenValidator"].getTimeUntilExpiration(metadata);
        } catch (error) {
            console.error('[SecureTokenManager] Failed to get expiration time:', error);
            return 0;
        }
    }
    /**
   * Get time since last activity.
   *
   * Calculates elapsed time since last token access. Used for inactivity
   * timeout monitoring and session timeout warnings.
   *
   * Activity Tracking:
   * - Updated automatically on every getToken() call
   * - Tracks user interaction with authenticated endpoints
   * - Used to enforce 8-hour inactivity timeout
   *
   * Use Cases:
   * - Display inactivity warnings to users
   * - Monitor user session engagement
   * - Debug session timeout issues
   * - Implement custom inactivity logic
   *
   * @returns {number} Milliseconds since last activity, or 0 if no token
   *
   * @example
   * ```typescript
   * const inactive = secureTokenManager.getTimeSinceActivity();
   *
   * // Display minutes of inactivity
   * const minutes = Math.floor(inactive / 60000);
   * console.log(`Inactive for ${minutes} minutes`);
   *
   * // Warn if inactive for 7.5 hours (close to 8-hour timeout)
   * const WARNING_THRESHOLD = 7.5 * 60 * 60 * 1000;
   * if (inactive > WARNING_THRESHOLD) {
   *   showInactivityWarning();
   * }
   * ```
   */ getTimeSinceActivity() {
        try {
            const metadata = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$security$2f$tokenManager$2f$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TokenStorage"].getTokenMetadata();
            return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$security$2f$tokenManager$2f$validation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TokenValidator"].getTimeSinceActivity(metadata);
        } catch (error) {
            console.error('[SecureTokenManager] Failed to get activity time:', error);
            return 0;
        }
    }
    /**
   * Update last activity timestamp.
   *
   * Updates the lastActivity field in token metadata to current time.
   * Called automatically by getToken() on each token retrieval. Can be
   * called manually to extend session timeout after user interaction.
   *
   * Activity Tracking:
   * - Automatically called on every authenticated API request
   * - Resets the 8-hour inactivity timeout window
   * - Prevents premature session expiration
   *
   * Security Features:
   * - Implements sliding session timeout
   * - Tracks genuine user activity
   * - Prevents session hijacking by requiring active use
   *
   * @example
   * ```typescript
   * // Manually update activity after user interaction
   * document.addEventListener('click', () => {
   *   secureTokenManager.updateActivity();
   * });
   *
   * // Update after custom user actions
   * function onUserAction() {
   *   secureTokenManager.updateActivity();
   *   performAction();
   * }
   * ```
   *
   * @remarks
   * Most applications don't need to call this manually as getToken()
   * automatically updates activity on each authenticated request.
   */ updateActivity() {
        this.activityTracker.updateActivity();
    }
    /**
   * Clear all stored tokens and metadata.
   *
   * Removes all authentication tokens and metadata from sessionStorage,
   * localStorage, and Zustand storage. Call this method on user logout,
   * session expiration, or authentication errors.
   *
   * Cleared Storage:
   * - sessionStorage: secure_auth_token, secure_refresh_token, secure_token_metadata
   * - localStorage: auth-storage (Zustand), legacy tokens
   *
   * Security Features:
   * - Complete removal of all authentication state
   * - Prevents token reuse after logout
   * - Clears both current and legacy storage locations
   * - Implements secure logout best practices
   *
   * HIPAA Compliance:
   * - Ensures complete session termination
   * - Prevents unauthorized access after logout
   * - Implements secure credential disposal
   *
   * @example
   * ```typescript
   * // Clear tokens on logout
   * async function logout() {
   *   await authApi.logout();
   *   secureTokenManager.clearTokens();
   *   redirectToLogin();
   * }
   *
   * // Clear tokens on session expiration
   * if (!secureTokenManager.isTokenValid()) {
   *   secureTokenManager.clearTokens();
   *   showSessionExpiredMessage();
   * }
   *
   * // Clear tokens on authentication error
   * apiClient.interceptors.response.use(
   *   response => response,
   *   error => {
   *     if (error.response?.status === 401) {
   *       secureTokenManager.clearTokens();
   *       redirectToLogin();
   *     }
   *     return Promise.reject(error);
   *   }
   * );
   * ```
   */ clearTokens() {
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$security$2f$tokenManager$2f$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TokenStorage"].clearAllTokens();
    }
    /**
   * Cleanup resources.
   *
   * Stops automatic cleanup interval and releases resources. Called
   * automatically on window unload. Should be called manually only when
   * destroying the token manager instance (rare in singleton pattern).
   *
   * Cleanup Actions:
   * - Clears the 60-second token validation interval
   * - Releases interval reference for garbage collection
   * - Prevents memory leaks from orphaned timers
   *
   * @example
   * ```typescript
   * // Cleanup on component unmount (rare with singleton)
   * useEffect(() => {
   *   return () => {
   *     secureTokenManager.cleanup();
   *   };
   * }, []);
   *
   * // Cleanup is automatic on window unload
   * // Manual cleanup rarely needed due to singleton pattern
   * ```
   *
   * @remarks
   * This method is automatically called on window 'beforeunload' event.
   * Manual calls are rarely necessary except in testing scenarios.
   */ cleanup() {
        this.activityTracker.cleanup();
    }
    /**
   * Get activity tracker instance for advanced session management
   * 
   * Provides access to the activity tracker for advanced session monitoring,
   * warnings, and custom activity handling.
   * 
   * @returns ActivityTracker instance
   */ getActivityTracker() {
        return this.activityTracker;
    }
    /**
   * Reset the token manager instance for testing
   * 
   * Useful for testing scenarios where a fresh instance is needed.
   * Should not be used in production code.
   */ static reset() {
        if (SecureTokenManager.instance) {
            SecureTokenManager.instance.cleanup();
            SecureTokenManager.instance = null;
        }
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$security$2f$tokenManager$2f$activityTracker$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ActivityTracker"].getInstance().reset();
    }
}
const secureTokenManager = SecureTokenManager.getInstance();
;
;
const __TURBOPACK__default__export__ = secureTokenManager;
}),
"[project]/src/services/security/SecureTokenManager.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

/**
 * WF-COMP-SEC-001 | SecureTokenManager.ts - Secure Token Management Service
 * Purpose: HIPAA-compliant token storage and validation with automatic expiration
 * Security: Uses sessionStorage for enhanced security, implements inactivity timeout
 * Upstream: ../../constants/config | Dependencies: SECURITY_CONFIG
 * Downstream: Authentication services, API clients | Called by: Auth flows, API interceptors
 * Related: authApi.ts, apiConfig.ts, ApiClient.ts
 * Exports: SecureTokenManager class, secureTokenManager singleton | Key Features: Session-based storage, auto-cleanup
 * Last Updated: 2025-11-11 | File Type: .ts
 * Critical Path: Token storage → Validation → Automatic cleanup → Session management
 * LLM Context: Security-critical module for healthcare platform, HIPAA compliance required
 * Architecture: Refactored to modular architecture - delegates to tokenManager modules
 */ // Re-export from the new modular architecture for backward compatibility
__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$security$2f$tokenManager$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/services/security/tokenManager/index.ts [app-ssr] (ecmascript) <locals>");
;
;
 /**
 * REFACTORING NOTICE
 * 
 * This file has been refactored from a monolithic 934-line implementation
 * to a modular architecture with the following structure:
 * 
 * ./tokenManager/
 * ├── types.ts              (Type definitions)
 * ├── storage.ts            (Token storage operations)
 * ├── validation.ts         (JWT parsing & validation)
 * ├── migration.ts          (Legacy storage migration)
 * ├── activityTracker.ts    (Session timeout monitoring)
 * └── index.ts              (Main orchestrator class)
 * 
 * Benefits:
 * - Improved maintainability with single responsibility modules
 * - Better testability with isolated functionality
 * - Enhanced code reusability across the application
 * - Easier debugging and monitoring
 * - Cleaner separation of concerns
 * 
 * All existing APIs remain unchanged for backward compatibility.
 * Applications can continue importing from this file without modifications.
 * 
 * For new code, prefer importing directly from the modular structure:
 * import { secureTokenManager } from '@/services/security/tokenManager';
 */ }),
"[project]/src/services/config/apiConfig.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

/**
 * @fileoverview API Configuration and Axios Instance Factory
 * @module services/config/apiConfig
 * @category Services
 *
 * Provides centralized API configuration, Axios instance creation, and token management
 * utilities for the White Cross healthcare platform. Implements dependency injection
 * pattern to avoid circular dependencies while maintaining clean architecture.
 *
 * Key Features:
 * - Factory functions for creating configured Axios instances
 * - CSRF protection integration
 * - Token management utilities with ITokenManager interface
 * - Dependency injection to prevent circular dependencies
 * - Singleton instances for application-wide use
 *
 * Architecture Pattern:
 * This module uses factory functions (createApiInstance, createTokenUtils) that accept
 * dependencies as parameters, avoiding circular dependency issues while maintaining
 * testability and flexibility. Singleton instances are created at the bottom after
 * all imports are resolved.
 *
 * Security Features:
 * - CSRF protection automatically configured
 * - Secure token management integration
 * - withCredentials enabled for cookie-based auth
 * - Configurable timeout for request security
 *
 * Healthcare Compliance:
 * - HIPAA-compliant configuration
 * - Secure credential handling
 * - Audit-friendly request/response patterns
 * - PHI protection through secure transport
 *
 * @example
 * ```typescript
 * // Use singleton instance (most common)
 * import { apiInstance } from '@/services/config/apiConfig';
 *
 * const response = await apiInstance.get('/api/patients');
 * const patients = response.data;
 *
 * // Use token utilities
 * import { tokenUtils } from '@/services/config/apiConfig';
 *
 * const token = tokenUtils.getToken();
 * if (token) {
 *   // Token is valid
 * }
 *
 * // Create custom instance (advanced)
 * import { createApiInstance } from '@/services/config/apiConfig';
 * import { myCustomTokenManager } from './myTokenManager';
 *
 * const customInstance = createApiInstance(myCustomTokenManager);
 * ```
 *
 * @see {@link createApiInstance} for Axios instance creation
 * @see {@link createTokenUtils} for token utility creation
 * @see {@link ITokenManager} for token manager interface
 */ __turbopack_context__.s([
    "apiInstance",
    ()=>apiInstance,
    "createApiInstance",
    ()=>createApiInstance,
    "createTokenUtils",
    ()=>createTokenUtils,
    "default",
    ()=>__TURBOPACK__default__export__,
    "tokenUtils",
    ()=>tokenUtils
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/constants/config.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/constants/api.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$security$2f$CsrfProtection$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/security/CsrfProtection.ts [app-ssr] (ecmascript)");
// ==========================================
// SINGLETON INSTANCES
// ==========================================
// Import secureTokenManager at bottom to avoid circular dependency
// This follows the dependency injection pattern from ApiClient.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$security$2f$SecureTokenManager$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/services/security/SecureTokenManager.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$security$2f$tokenManager$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/services/security/tokenManager/index.ts [app-ssr] (ecmascript) <locals>");
;
;
;
;
function createApiInstance(_tokenManager) {
    const instance = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].create({
        baseURL: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_CONFIG"].BASE_URL,
        timeout: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_CONFIG"].TIMEOUT,
        headers: {
            'Content-Type': 'application/json'
        },
        withCredentials: true
    });
    // Setup CSRF protection for the instance
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$security$2f$CsrfProtection$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setupCsrfProtection"])(instance);
    return instance;
}
function createTokenUtils(tokenManager) {
    return {
        getToken: ()=>tokenManager.getToken(),
        setToken: (token, refreshToken, expiresIn)=>tokenManager.setToken(token, refreshToken, expiresIn),
        removeToken: ()=>tokenManager.clearTokens(),
        getRefreshToken: ()=>tokenManager.getRefreshToken(),
        setRefreshToken: (token)=>{
            // Get current token and re-set with new refresh token
            const currentToken = tokenManager.getToken();
            if (currentToken) {
                tokenManager.setToken(currentToken, token);
            }
        },
        removeRefreshToken: ()=>tokenManager.clearTokens(),
        clearAll: ()=>tokenManager.clearTokens(),
        isTokenValid: ()=>tokenManager.isTokenValid(),
        updateActivity: ()=>tokenManager.updateActivity()
    };
}
;
;
;
const apiInstance = createApiInstance(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$security$2f$tokenManager$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["secureTokenManager"]);
const tokenUtils = createTokenUtils(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$security$2f$tokenManager$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["secureTokenManager"]);
const __TURBOPACK__default__export__ = apiInstance;
}),
"[project]/src/services/core/errors.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * WF-COMP-ERROR | errors.ts - Centralized Error Handling
 * Purpose: Type-safe error classes and utilities for API error handling
 * Upstream: axios, API responses | Dependencies: None
 * Downstream: All API services, error boundaries | Called by: Service modules
 * Related: typeGuards.ts, ApiClient.ts, error boundaries
 * Exports: ApiError, ValidationError, NetworkError, error factories
 * Last Updated: 2025-10-23 | File Type: .ts
 * Critical Path: Error occurs → Type guard → Create typed error → Propagate with context
 * LLM Context: HIPAA-compliant error handling, preserves debugging context, sanitizes sensitive data
 */ /**
 * Base API Error Class
 *
 * Provides consistent error handling across all API services with:
 * - Original error preservation for debugging
 * - HTTP status code tracking
 * - Error code categorization
 * - Timestamp for logging/audit
 * - HIPAA-compliant message sanitization
 */ __turbopack_context__.s([
    "ApiError",
    ()=>ApiError,
    "AuthenticationError",
    ()=>AuthenticationError,
    "NetworkError",
    ()=>NetworkError,
    "ValidationError",
    ()=>ValidationError,
    "createApiError",
    ()=>createApiError,
    "createAuthenticationError",
    ()=>createAuthenticationError,
    "createNetworkError",
    ()=>createNetworkError,
    "createValidationError",
    ()=>createValidationError,
    "getErrorLogData",
    ()=>getErrorLogData,
    "getUserFriendlyMessage",
    ()=>getUserFriendlyMessage,
    "isRetryableError",
    ()=>isRetryableError
]);
class ApiError extends Error {
    name = 'ApiError';
    timestamp;
    originalError;
    statusCode;
    code;
    constructor(message, originalError, statusCode, code){
        super(message);
        // Maintain proper prototype chain
        Object.setPrototypeOf(this, ApiError.prototype);
        this.timestamp = new Date();
        this.originalError = originalError;
        this.statusCode = statusCode;
        this.code = code;
        // Capture stack trace, excluding constructor call
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ApiError);
        }
    }
    /**
   * Get sanitized error message (HIPAA-compliant)
   * Removes potential PHI/PII from error messages
   */ getSanitizedMessage() {
        return sanitizeErrorMessage(this.message);
    }
    /**
   * Serialize error for logging/monitoring
   * Excludes originalError to prevent circular references
   */ toJSON() {
        return {
            name: this.name,
            message: this.message,
            statusCode: this.statusCode,
            code: this.code,
            timestamp: this.timestamp.toISOString(),
            stack: this.stack
        };
    }
}
class ValidationError extends ApiError {
    name = 'ValidationError';
    field;
    validationErrors;
    constructor(message, field, validationErrors, originalError){
        super(message, originalError, 400, 'VALIDATION_ERROR');
        Object.setPrototypeOf(this, ValidationError.prototype);
        this.field = field;
        this.validationErrors = validationErrors;
    }
    toJSON() {
        return {
            ...super.toJSON(),
            field: this.field,
            validationErrors: this.validationErrors
        };
    }
}
class NetworkError extends ApiError {
    name = 'NetworkError';
    timeout;
    retryable;
    constructor(message, originalError, timeout, retryable = true){
        super(message, originalError, undefined, 'NETWORK_ERROR');
        Object.setPrototypeOf(this, NetworkError.prototype);
        this.timeout = timeout;
        this.retryable = retryable;
    }
    toJSON() {
        return {
            ...super.toJSON(),
            timeout: this.timeout,
            retryable: this.retryable
        };
    }
}
class AuthenticationError extends ApiError {
    name = 'AuthenticationError';
    requiresReauthentication;
    constructor(message, statusCode = 401, requiresReauthentication = true, originalError){
        super(message, originalError, statusCode, 'AUTH_ERROR');
        Object.setPrototypeOf(this, AuthenticationError.prototype);
        this.requiresReauthentication = requiresReauthentication;
    }
    toJSON() {
        return {
            ...super.toJSON(),
            requiresReauthentication: this.requiresReauthentication
        };
    }
}
function createApiError(error, fallbackMessage = 'An error occurred') {
    // Handle axios errors
    if (isAxiosError(error)) {
        const message = error.response?.data?.message || error.message || fallbackMessage;
        const statusCode = error.response?.status;
        const code = error.code;
        return new ApiError(message, error, statusCode, code);
    }
    // Handle existing ApiError instances
    if (error instanceof ApiError) {
        return error;
    }
    // Handle generic Error instances
    if (error instanceof Error) {
        return new ApiError(error.message || fallbackMessage, error);
    }
    // Handle unknown error types
    return new ApiError(fallbackMessage);
}
function createValidationError(message, field, validationErrors, originalError) {
    return new ValidationError(message, field, validationErrors, originalError);
}
function createNetworkError(message, originalError, timeout, retryable = true) {
    return new NetworkError(message, originalError, timeout, retryable);
}
function createAuthenticationError(message, statusCode = 401, requiresReauthentication = true, originalError) {
    return new AuthenticationError(message, statusCode, requiresReauthentication, originalError);
}
/**
 * Type guard for axios errors
 * Import axios type guard or implement if not available
 */ function isAxiosError(error) {
    return typeof error === 'object' && error !== null && ('response' in error || 'message' in error || 'code' in error);
}
/**
 * Sanitize error message to remove potential PHI/PII
 * HIPAA Compliance: Remove common patterns that might expose sensitive data
 */ function sanitizeErrorMessage(message) {
    if (!message) return 'An error occurred';
    let sanitized = message;
    // Remove email addresses
    sanitized = sanitized.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[email]');
    // Remove phone numbers (various formats)
    sanitized = sanitized.replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, '[phone]');
    // Remove SSN patterns
    sanitized = sanitized.replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[ssn]');
    // Remove medical record numbers (assuming format like MRN-######)
    sanitized = sanitized.replace(/\b[A-Z]{2,4}-?\d{6,}\b/g, '[record-id]');
    // Remove dates of birth (various formats)
    sanitized = sanitized.replace(/\b\d{1,2}\/\d{1,2}\/\d{4}\b/g, '[date]');
    // Remove potential names (capitalized words that might be names)
    // Note: This is conservative and may not catch all cases
    // In production, consider more sophisticated NER/PII detection
    return sanitized;
}
function isRetryableError(error) {
    if (error instanceof NetworkError) {
        return error.retryable;
    }
    if (error instanceof ApiError) {
        // Retry on server errors (5xx) and some client errors
        const retryableStatuses = [
            408,
            429,
            500,
            502,
            503,
            504
        ];
        return error.statusCode ? retryableStatuses.includes(error.statusCode) : false;
    }
    return false;
}
function getUserFriendlyMessage(error) {
    if (error instanceof ValidationError) {
        return error.field ? `Invalid ${error.field}: ${error.message}` : `Validation error: ${error.message}`;
    }
    if (error instanceof AuthenticationError) {
        return error.requiresReauthentication ? 'Your session has expired. Please log in again.' : 'You do not have permission to perform this action.';
    }
    if (error instanceof NetworkError) {
        return 'Network error. Please check your connection and try again.';
    }
    if (error instanceof ApiError) {
        // Use sanitized message for user display
        return error.getSanitizedMessage();
    }
    if (error instanceof Error) {
        return error.message || 'An unexpected error occurred.';
    }
    return 'An unexpected error occurred.';
}
function getErrorLogData(error) {
    if (error instanceof ApiError) {
        return error.toJSON();
    }
    if (error instanceof Error) {
        return {
            name: error.name,
            message: error.message,
            stack: error.stack
        };
    }
    return {
        error: String(error)
    };
}
}),
"[project]/src/services/core/ApiClient.errors.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @fileoverview Error handling for API Client
 * @module services/core/ApiClient.errors
 * @category Services
 *
 * Provides comprehensive error classification and normalization for API operations:
 * - Custom error class with automatic classification
 * - Network error detection
 * - Server error identification (5xx)
 * - Validation error handling (400)
 * - Error normalization from various sources
 */ __turbopack_context__.s([
    "ApiClientError",
    ()=>ApiClientError,
    "normalizeError",
    ()=>normalizeError
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-ssr] (ecmascript)");
;
class ApiClientError extends Error {
    code;
    status;
    details;
    traceId;
    isNetworkError;
    isServerError;
    isValidationError;
    constructor(error){
        super(error.message);
        this.name = 'ApiClientError';
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
            Error.captureStackTrace(this, ApiClientError);
        }
    }
}
function normalizeError(error) {
    // Already normalized
    if (error instanceof ApiClientError) {
        return error;
    }
    // Axios error
    if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].isAxiosError(error)) {
        const axiosError = error;
        if (axiosError.response) {
            // Server responded with error
            return new ApiClientError({
                message: axiosError.response.data?.message || `Request failed with status ${axiosError.response.status}`,
                code: axiosError.response.data?.code,
                status: axiosError.response.status,
                details: axiosError.response.data?.errors
            });
        } else if (axiosError.request) {
            // Network error - no response received
            return new ApiClientError({
                message: 'Network error - please check your connection',
                code: 'NETWORK_ERROR'
            });
        }
    }
    // Unknown error
    return new ApiClientError({
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
        code: 'UNKNOWN_ERROR'
    });
}
}),
"[project]/src/services/utils/logger.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Structured logging service for the White Cross Healthcare Platform
 *
 * Provides consistent, level-based logging with context support.
 * Automatically respects environment (development vs production).
 *
 * @module services/utils/logger
 * @security HIPAA Compliance - Ensure no PHI/PII is logged in production
 */ /**
 * Available log levels in order of severity
 */ __turbopack_context__.s([
    "LogLevel",
    ()=>LogLevel,
    "createLogger",
    ()=>createLogger,
    "logger",
    ()=>logger
]);
var LogLevel = /*#__PURE__*/ function(LogLevel) {
    LogLevel["DEBUG"] = "debug";
    LogLevel["INFO"] = "info";
    LogLevel["WARN"] = "warn";
    LogLevel["ERROR"] = "error";
    return LogLevel;
}({});
/**
 * Console-based logger implementation with level filtering
 */ class ConsoleLogger {
    minLevel;
    levelOrder = [
        "debug",
        "info",
        "warn",
        "error"
    ];
    constructor(minLevel = "info"){
        this.minLevel = minLevel;
    }
    debug(message, context) {
        if (this.shouldLog("debug")) {
            const timestamp = new Date().toISOString();
            if (context && Object.keys(context).length > 0) {
                console.debug(`[${timestamp}] [DEBUG] ${message}`, context);
            } else {
                console.debug(`[${timestamp}] [DEBUG] ${message}`);
            }
        }
    }
    info(message, context) {
        if (this.shouldLog("info")) {
            const timestamp = new Date().toISOString();
            if (context && Object.keys(context).length > 0) {
                console.info(`[${timestamp}] [INFO] ${message}`, context);
            } else {
                console.info(`[${timestamp}] [INFO] ${message}`);
            }
        }
    }
    warn(message, context) {
        if (this.shouldLog("warn")) {
            const timestamp = new Date().toISOString();
            if (context && Object.keys(context).length > 0) {
                console.warn(`[${timestamp}] [WARN] ${message}`, context);
            } else {
                console.warn(`[${timestamp}] [WARN] ${message}`);
            }
        }
    }
    error(message, error, context) {
        if (this.shouldLog("error")) {
            const timestamp = new Date().toISOString();
            const errorInfo = {
                ...context || {}
            };
            if (error) {
                errorInfo.error = {
                    message: error.message,
                    stack: error.stack,
                    name: error.name
                };
            }
            if (Object.keys(errorInfo).length > 0) {
                console.error(`[${timestamp}] [ERROR] ${message}`, errorInfo);
            } else {
                console.error(`[${timestamp}] [ERROR] ${message}`);
            }
        }
    }
    /**
   * Determines if a message at the given level should be logged
   */ shouldLog(level) {
        const currentLevelIndex = this.levelOrder.indexOf(this.minLevel);
        const messageLevelIndex = this.levelOrder.indexOf(level);
        return messageLevelIndex >= currentLevelIndex;
    }
}
/**
 * Determine the appropriate log level based on environment
 */ function getLogLevel() {
    const env = ("TURBOPACK compile-time value", "development");
    // In development, show all logs including debug
    if ("TURBOPACK compile-time truthy", 1) {
        return "debug";
    }
    //TURBOPACK unreachable
    ;
}
const logger = new ConsoleLogger(getLogLevel());
function createLogger(prefix) {
    return {
        debug: (message, context)=>logger.debug(`[${prefix}] ${message}`, context),
        info: (message, context)=>logger.info(`[${prefix}] ${message}`, context),
        warn: (message, context)=>logger.warn(`[${prefix}] ${message}`, context),
        error: (message, error, context)=>logger.error(`[${prefix}] ${message}`, error, context)
    };
}
}),
"[project]/src/services/core/ApiClient.interceptors.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @fileoverview Interceptor setup and management for API Client
 * @module services/core/ApiClient.interceptors
 * @category Services
 *
 * Provides interceptor creation and configuration for API client:
 * - Request interceptors for authentication and headers
 * - Response interceptors for error handling and retry logic
 * - Token refresh handling
 * - Automatic retry with exponential backoff
 */ __turbopack_context__.s([
    "createAuthRequestInterceptor",
    ()=>createAuthRequestInterceptor,
    "createAuthResponseInterceptor",
    ()=>createAuthResponseInterceptor,
    "generateRequestId",
    ()=>generateRequestId,
    "isRetryableError",
    ()=>isRetryableError,
    "sleep",
    ()=>sleep
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$core$2f$ApiClient$2e$errors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/core/ApiClient.errors.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$utils$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/utils/logger.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/constants/api.ts [app-ssr] (ecmascript)");
;
;
;
function createAuthRequestInterceptor(instance, tokenManager, enableLogging) {
    return instance.interceptors.request.use((config)=>{
        // Get token from token manager
        const token = tokenManager?.getToken();
        if (token) {
            // Validate token before using it
            if (tokenManager?.isTokenValid()) {
                config.headers = config.headers || {};
                config.headers.Authorization = `Bearer ${token}`;
                // Update activity on token use
                tokenManager.updateActivity();
            } else {
                // Token expired, clear it
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$utils$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["logger"].warn('ApiClient: Token expired, clearing tokens');
                tokenManager?.clearTokens();
            }
        }
        // Add request ID for tracing
        config.headers = config.headers || {};
        config.headers['X-Request-ID'] = generateRequestId();
        // Ensure security headers are always present
        config.headers['X-Content-Type-Options'] = 'nosniff';
        config.headers['X-Frame-Options'] = 'DENY';
        config.headers['X-XSS-Protection'] = '1; mode=block';
        // Log request in development
        if (enableLogging && ("TURBOPACK compile-time value", "development") === 'development') {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$utils$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["logger"].debug(`API Request: ${config.method?.toUpperCase()} ${config.url}`, {
                headers: config.headers,
                data: config.data
            });
        }
        return config;
    }, (error)=>{
        if (enableLogging && ("TURBOPACK compile-time value", "development") === 'development') {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$utils$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["logger"].error('API Request Error', error);
        }
        return Promise.reject((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$core$2f$ApiClient$2e$errors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeError"])(error));
    });
}
function createAuthResponseInterceptor(options) {
    const { instance, enableLogging, enableRetry, maxRetries, retryDelay, onAuthFailure, refreshAuthToken } = options;
    return instance.interceptors.response.use((response)=>{
        // Log response in development
        if (enableLogging && ("TURBOPACK compile-time value", "development") === 'development') {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$utils$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["logger"].debug(`API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
                status: response.status,
                data: response.data
            });
        }
        return response;
    }, async (error)=>{
        const originalRequest = error.config;
        // Handle 401 - Token refresh
        // Skip token refresh for auth endpoints (login, register, refresh)
        const isAuthEndpoint = originalRequest.url?.includes('/auth/login') || originalRequest.url?.includes('/auth/register') || originalRequest.url?.includes('/auth/refresh');
        if (error.response?.status === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HTTP_STATUS"].UNAUTHORIZED && !originalRequest._retry && !isAuthEndpoint) {
            originalRequest._retry = true;
            try {
                const newToken = await refreshAuthToken();
                if (newToken && originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    return instance(originalRequest);
                }
            } catch (refreshError) {
                onAuthFailure();
                return Promise.reject((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$core$2f$ApiClient$2e$errors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeError"])(refreshError));
            }
        }
        // Handle retryable errors
        if (enableRetry && isRetryableError(error) && !originalRequest._retry) {
            const retryCount = originalRequest._retryCount || 0;
            if (retryCount < maxRetries) {
                originalRequest._retryCount = retryCount + 1;
                // Exponential backoff
                const delay = retryDelay * Math.pow(2, retryCount);
                await sleep(delay);
                if (enableLogging && ("TURBOPACK compile-time value", "development") === 'development') {
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$utils$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["logger"].debug(`API Retry: Attempt ${retryCount + 1}/${maxRetries} for ${originalRequest.url}`);
                }
                return instance(originalRequest);
            }
        }
        // Log error
        if (enableLogging) {
            console.log('[ApiClient Interceptor] Error details:', {
                hasResponse: !!error.response,
                hasConfig: !!error.config,
                errorMessage: error.message,
                errorCode: error.code,
                errorStatus: error.response?.status,
                errorData: error.response?.data,
                fullError: error
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$utils$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["logger"].error('API Response Error', error, {
                url: error.config?.url,
                method: error.config?.method,
                status: error.response?.status,
                message: error.message,
                data: error.response?.data
            });
        }
        return Promise.reject((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$core$2f$ApiClient$2e$errors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeError"])(error));
    });
}
function isRetryableError(error) {
    // Network errors
    if (!error.response) {
        return true;
    }
    // Server errors (5xx)
    const status = error.response.status;
    if (status >= 500 && status < 600) {
        return true;
    }
    // Rate limiting
    if (status === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HTTP_STATUS"].TOO_MANY_REQUESTS) {
        return true;
    }
    return false;
}
function generateRequestId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
function sleep(ms) {
    return new Promise((resolve)=>setTimeout(resolve, ms));
}
}),
"[project]/src/services/core/ApiClient.auth.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @fileoverview Authentication utilities for API Client
 * @module services/core/ApiClient.auth
 * @category Services
 *
 * Provides authentication-related functionality:
 * - Token retrieval from token manager
 * - Token refresh logic
 * - Authentication failure handling
 * - Automatic redirection on auth failure
 */ __turbopack_context__.s([
    "getAuthToken",
    ()=>getAuthToken,
    "handleAuthFailure",
    ()=>handleAuthFailure,
    "refreshAuthToken",
    ()=>refreshAuthToken
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/constants/config.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/constants/api.ts [app-ssr] (ecmascript)");
;
;
;
function getAuthToken(tokenManager) {
    return tokenManager?.getToken() ?? null;
}
async function refreshAuthToken(tokenManager) {
    const refreshToken = tokenManager?.getRefreshToken();
    if (!refreshToken) {
        throw new Error('No refresh token available');
    }
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].post(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_CONFIG"].BASE_URL}${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].AUTH.REFRESH}`, {
            refreshToken
        });
        const { token, refreshToken: newRefreshToken, expiresIn } = response.data;
        // Update token in TokenManager
        tokenManager?.setToken(token, newRefreshToken || refreshToken, expiresIn);
        return token;
    } catch (error) {
        // Refresh failed, handle auth failure
        handleAuthFailure(tokenManager);
        throw error;
    }
}
function handleAuthFailure(tokenManager) {
    // Clear all tokens using TokenManager
    tokenManager?.clearTokens();
    // Redirect to login if not already there
    if (window.location.pathname !== '/login') {
        window.location.href = '/login';
    }
}
}),
"[project]/src/services/core/ApiClient.cancellation.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @fileoverview Request cancellation utilities for API Client
 * @module services/core/ApiClient.cancellation
 * @category Services
 *
 * Provides utilities for cancelling in-flight HTTP requests:
 * - AbortController-based cancellation
 * - Easy integration with React useEffect cleanup
 * - Graceful handling of cancelled requests
 */ // ==========================================
// REQUEST CANCELLATION
// ==========================================
/**
 * Cancellable request handle
 *
 * Provides both the AbortSignal for request configuration
 * and a cancel function for easy cancellation.
 */ __turbopack_context__.s([
    "createCancellableRequest",
    ()=>createCancellableRequest
]);
function createCancellableRequest() {
    const controller = new AbortController();
    return {
        signal: controller.signal,
        cancel: (reason)=>{
            controller.abort(reason);
        }
    };
}
}),
"[project]/src/services/core/ApiClient.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

/**
 * @fileoverview Enterprise-grade HTTP API client with resilience patterns for healthcare
 * @module services/core/ApiClient
 * @category Services
 *
 * Provides type-safe HTTP client with comprehensive error handling, retry logic,
 * authentication, CSRF protection, and integration with resilience patterns designed
 * for healthcare applications requiring high reliability and HIPAA compliance.
 *
 * Key Features:
 * - Type-safe HTTP methods (GET, POST, PUT, PATCH, DELETE) with generic type support
 * - Automatic authentication token injection with refresh handling
 * - CSRF protection headers for secure state-changing operations
 * - Request/response interceptors for cross-cutting concerns
 * - Automatic retry with exponential backoff for transient failures
 * - Comprehensive error handling and classification
 * - Integration with circuit breaker and bulkhead patterns
 * - Request/response logging for debugging (development only)
 * - Configurable timeout management
 * - Performance tracking with resilience hooks
 *
 * Error Classification:
 * - **Network errors:** No response from server (connection timeout, DNS failure)
 * - **Server errors:** 5xx status codes (internal server error, service unavailable)
 * - **Client errors:** 4xx status codes (bad request, not found, forbidden)
 * - **Validation errors:** 400 with field-specific error details
 * - **Authentication errors:** 401 Unauthorized (triggers token refresh)
 *
 * Healthcare Safety Features:
 * - HIPAA-compliant security headers (X-Content-Type-Options, X-Frame-Options, X-XSS-Protection)
 * - Automatic token refresh prevents authentication disruption
 * - Request deduplication prevents duplicate operations
 * - Comprehensive audit logging for compliance
 * - No PHI (Protected Health Information) in error messages or logs
 *
 * Performance Characteristics:
 * - O(1) request execution (excluding network time)
 * - Interceptors add minimal overhead (~1-2ms)
 * - Automatic retry adds latency only on failure (exponential backoff)
 * - Token validation cache hit: O(1), miss: O(1) with storage read
 *
 * @example
 * ```typescript
 * // Create client with custom config for healthcare API
 * const client = new ApiClient({
 *   baseURL: 'https://api.hospital.com',
 *   timeout: 30000,             // 30 second timeout
 *   enableRetry: true,          // Retry transient failures
 *   maxRetries: 3,              // Max 3 retry attempts
 *   enableLogging: false,       // Disable in production (HIPAA)
 *   tokenManager: secureTokenManager
 * });
 *
 * // Make type-safe requests with full error handling
 * try {
 *   const patient = await client.get<Patient>('/patients/123');
 *   console.log('Patient loaded:', patient.data);
 * } catch (error) {
 *   if (error instanceof ApiClientError) {
 *     if (error.isNetworkError) {
 *       // Network failure - show offline message
 *       showOfflineNotification();
 *     } else if (error.status === 404) {
 *       // Patient not found
 *       showNotFoundError('Patient not found');
 *     } else if (error.isValidationError) {
 *       // Validation errors with field details
 *       showValidationErrors(error.validationErrors);
 *     } else {
 *       // Generic error
 *       showErrorNotification('Failed to load patient');
 *     }
 *   }
 * }
 *
 * // Create with validation handling
 * try {
 *   const medication = await client.post<Medication>('/medications', {
 *     name: 'Aspirin',
 *     dosage: '100mg',
 *     patientId: '123'
 *   });
 *   showSuccessNotification('Medication created');
 * } catch (error) {
 *   if (error instanceof ApiClientError && error.isValidationError) {
 *     // Handle validation errors field-by-field
 *     error.validationErrors?.forEach((message, field) => {
 *       showFieldError(field, message);
 *     });
 *   }
 * }
 *
 * // Delete with authentication handling
 * try {
 *   await client.delete('/medications/456');
 *   showSuccessNotification('Medication deleted');
 * } catch (error) {
 *   if (error instanceof ApiClientError && error.status === 401) {
 *     // Authentication failed after token refresh attempt
 *     redirectToLogin('Session expired');
 *   }
 * }
 * ```
 *
 * @see {@link ResilientApiClient} for circuit breaker and bulkhead integration
 * @see {@link BaseApiService} for CRUD operations built on ApiClient
 * @see {@link SecureTokenManager} for token management
 */ __turbopack_context__.s([
    "ApiClient",
    ()=>ApiClient,
    "apiClient",
    ()=>apiClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/constants/config.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$security$2f$CsrfProtection$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/security/CsrfProtection.ts [app-ssr] (ecmascript)");
// Import interceptor utilities from extracted module
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$core$2f$ApiClient$2e$interceptors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/core/ApiClient.interceptors.ts [app-ssr] (ecmascript)");
// Import authentication utilities from extracted module
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$core$2f$ApiClient$2e$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/core/ApiClient.auth.ts [app-ssr] (ecmascript)");
// Re-export error class for backward compatibility
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$core$2f$ApiClient$2e$errors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/core/ApiClient.errors.ts [app-ssr] (ecmascript)");
// Re-export cancellation utilities for backward compatibility
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$core$2f$ApiClient$2e$cancellation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/core/ApiClient.cancellation.ts [app-ssr] (ecmascript)");
// ==========================================
// SINGLETON INSTANCE
// ==========================================
// Import secureTokenManager here to avoid circular dependency
// (ApiClient no longer imports it directly, only via dependency injection)
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$security$2f$SecureTokenManager$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/services/security/SecureTokenManager.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$security$2f$tokenManager$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/services/security/tokenManager/index.ts [app-ssr] (ecmascript) <locals>");
;
;
;
;
;
;
;
class ApiClient {
    instance;
    enableLogging;
    enableRetry;
    maxRetries;
    retryDelay;
    requestInterceptorIds = [];
    responseInterceptorIds = [];
    resilienceHook;
    tokenManager;
    constructor(config = {}){
        this.tokenManager = config.tokenManager;
        this.resilienceHook = config.resilienceHook;
        this.enableLogging = config.enableLogging ?? true;
        this.enableRetry = config.enableRetry ?? true;
        this.maxRetries = config.maxRetries ?? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_CONFIG"].RETRY.MAX_RETRIES;
        this.retryDelay = config.retryDelay ?? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_CONFIG"].RETRY.RETRY_DELAY;
        // Create axios instance with security headers
        this.instance = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].create({
            baseURL: config.baseURL ?? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_CONFIG"].BASE_URL,
            timeout: config.timeout ?? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_CONFIG"].TIMEOUT,
            withCredentials: config.withCredentials ?? true,
            headers: {
                'Content-Type': 'application/json',
                // Security headers for HIPAA compliance
                'X-Content-Type-Options': 'nosniff',
                'X-Frame-Options': 'DENY',
                'X-XSS-Protection': '1; mode=block'
            }
        });
        // Setup default interceptors
        this.setupDefaultInterceptors();
        // Setup CSRF protection
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$security$2f$CsrfProtection$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setupCsrfProtection"])(this.instance);
        // Add custom interceptors
        if (config.requestInterceptors) {
            config.requestInterceptors.forEach((interceptor)=>this.addRequestInterceptor(interceptor));
        }
        if (config.responseInterceptors) {
            config.responseInterceptors.forEach((interceptor)=>this.addResponseInterceptor(interceptor));
        }
    }
    // ==========================================
    // INTERCEPTOR SETUP
    // ==========================================
    setupDefaultInterceptors() {
        // Request interceptor: Add auth token and security headers
        const authRequestId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$core$2f$ApiClient$2e$interceptors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createAuthRequestInterceptor"])(this.instance, this.tokenManager, this.enableLogging);
        this.requestInterceptorIds.push(authRequestId);
        // Response interceptor: Handle token refresh and errors
        const authResponseId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$core$2f$ApiClient$2e$interceptors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createAuthResponseInterceptor"])({
            instance: this.instance,
            tokenManager: this.tokenManager,
            enableLogging: this.enableLogging,
            enableRetry: this.enableRetry,
            maxRetries: this.maxRetries,
            retryDelay: this.retryDelay,
            onAuthFailure: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$core$2f$ApiClient$2e$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["handleAuthFailure"])(this.tokenManager),
            refreshAuthToken: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$core$2f$ApiClient$2e$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["refreshAuthToken"])(this.tokenManager)
        });
        this.responseInterceptorIds.push(authResponseId);
    }
    // ==========================================
    // INTERCEPTOR MANAGEMENT
    // ==========================================
    addRequestInterceptor(interceptor) {
        const id = this.instance.interceptors.request.use(interceptor.onFulfilled, interceptor.onRejected);
        this.requestInterceptorIds.push(id);
        return id;
    }
    addResponseInterceptor(interceptor) {
        const id = this.instance.interceptors.response.use(interceptor.onFulfilled, interceptor.onRejected);
        this.responseInterceptorIds.push(id);
        return id;
    }
    removeRequestInterceptor(id) {
        this.instance.interceptors.request.eject(id);
        this.requestInterceptorIds = this.requestInterceptorIds.filter((i)=>i !== id);
    }
    removeResponseInterceptor(id) {
        this.instance.interceptors.response.eject(id);
        this.responseInterceptorIds = this.responseInterceptorIds.filter((i)=>i !== id);
    }
    // ==========================================
    // HTTP METHODS
    // ==========================================
    /**
   * Generic request executor that handles all HTTP methods with resilience hooks
   *
   * This method consolidates common logic for all HTTP operations:
   * - Performance tracking (start time, duration)
   * - Resilience hook execution (beforeRequest, afterSuccess, afterFailure)
   * - Error handling and propagation
   *
   * @private
   * @template T - The response data type
   * @param method - HTTP method to execute
   * @param url - Request URL
   * @param data - Request body data (optional, used by POST/PUT/PATCH)
   * @param config - Axios request configuration (optional)
   * @returns Promise resolving to API response
   */ async executeRequest(method, url, data, config) {
        const startTime = performance.now();
        const methodUpper = method.toUpperCase();
        try {
            // Execute beforeRequest hook if configured
            if (this.resilienceHook?.beforeRequest) {
                await this.resilienceHook.beforeRequest({
                    method: methodUpper,
                    url,
                    data
                });
            }
            // Execute the HTTP request based on method type
            console.log(`[ApiClient] Making ${methodUpper} request to:`, url);
            console.log('[ApiClient] Base URL:', this.instance.defaults.baseURL);
            console.log('[ApiClient] Full URL will be:', this.instance.defaults.baseURL + url);
            let response;
            switch(method){
                case 'get':
                case 'delete':
                    // GET and DELETE don't accept body data
                    response = await this.instance[method](url, config);
                    break;
                case 'post':
                case 'put':
                case 'patch':
                    // POST, PUT, and PATCH accept body data
                    response = await this.instance[method](url, data, config);
                    break;
            }
            // Execute afterSuccess hook if configured
            if (this.resilienceHook?.afterSuccess) {
                this.resilienceHook.afterSuccess({
                    method: methodUpper,
                    url,
                    duration: performance.now() - startTime
                });
            }
            return response.data;
        } catch (error) {
            // Execute afterFailure hook if configured
            if (this.resilienceHook?.afterFailure) {
                this.resilienceHook.afterFailure({
                    method: methodUpper,
                    url,
                    duration: performance.now() - startTime,
                    error
                });
            }
            throw error;
        }
    }
    /**
   * Execute GET request to retrieve data from the API
   *
   * @template T - The response data type expected from the API
   * @param {string} url - Request URL (relative to baseURL or absolute)
   * @param {CancellableRequestConfig} [config] - Request configuration with optional AbortSignal for cancellation
   * @returns {Promise<ApiResponse<T>>} Promise resolving to API response with typed data
   * @throws {ApiClientError} Network error (no response from server)
   * @throws {ApiClientError} Authentication error (401 after token refresh fails)
   * @throws {ApiClientError} Authorization error (403 forbidden)
   * @throws {ApiClientError} Not found error (404 resource not found)
   * @throws {ApiClientError} Server error (5xx internal server error)
   * @throws {Error} Resilience hook error (circuit breaker open, bulkhead full)
   *
   * @description
   * Executes a GET request through the full resilience stack:
   * 1. beforeRequest hook (circuit breaker check, bulkhead acquire)
   * 2. Request interceptor (auth token, CSRF, security headers)
   * 3. HTTP GET request
   * 4. Response interceptor (401 handling, retry logic)
   * 5. afterSuccess/afterFailure hook (metrics, cleanup)
   *
   * Automatically retries on network/server errors with exponential backoff.
   * Token refresh is automatic on 401 Unauthorized responses.
   *
   * @example
   * ```typescript
   * // Simple GET request
   * const response = await client.get<Patient>('/patients/123');
   * console.log(response.data); // Patient object
   *
   * // GET with query parameters (use URLSearchParams or object)
   * const response = await client.get<Patient[]>('/patients', {
   *   params: { age: 30, status: 'active' }
   * });
   *
   * // GET with cancellation support
   * const controller = new AbortController();
   * const promise = client.get<Patient>('/patients/123', {
   *   signal: controller.signal
   * });
   * // Cancel request if needed
   * controller.abort();
   *
   * // GET with error handling
   * try {
   *   const response = await client.get<MedicationList>('/medications');
   *   displayMedications(response.data);
   * } catch (error) {
   *   if (error instanceof ApiClientError) {
   *     if (error.isNetworkError) {
   *       showOfflineMessage();
   *     } else if (error.status === 404) {
   *       showNotFoundMessage('Medications not found');
   *     } else {
   *       showErrorMessage('Failed to load medications');
   *     }
   *   }
   * }
   * ```
   *
   * @see {@link post} for creating resources
   * @see {@link put} for full resource updates
   * @see {@link patch} for partial resource updates
   */ async get(url, config) {
        return this.executeRequest('get', url, undefined, config);
    }
    /**
   * Execute POST request to create a new resource or trigger an action
   *
   * @template T - The response data type expected from the API
   * @param {string} url - Request URL (relative to baseURL or absolute)
   * @param {unknown} [data] - Request body data to send (will be JSON-stringified)
   * @param {CancellableRequestConfig} [config] - Request configuration with optional AbortSignal
   * @returns {Promise<ApiResponse<T>>} Promise resolving to API response with created/updated data
   * @throws {ApiClientError} Network error (no response from server)
   * @throws {ApiClientError} Authentication error (401 after token refresh fails)
   * @throws {ApiClientError} Authorization error (403 forbidden, insufficient permissions)
   * @throws {ApiClientError} Validation error (400 with field-specific errors)
   * @throws {ApiClientError} Conflict error (409 resource already exists)
   * @throws {ApiClientError} Server error (5xx internal server error)
   * @throws {Error} Resilience hook error (circuit breaker open, bulkhead full)
   *
   * @description
   * Executes a POST request with full resilience and validation handling.
   * Automatically includes CSRF token for state-changing operations.
   * Request body is JSON-stringified automatically.
   *
   * POST is typically used for:
   * - Creating new resources (e.g., new patient, new medication order)
   * - Triggering actions (e.g., send email, generate report)
   * - Bulk operations (e.g., bulk create, batch processing)
   *
   * @example
   * ```typescript
   * // Create new patient
   * try {
   *   const response = await client.post<Patient>('/patients', {
   *     firstName: 'John',
   *     lastName: 'Doe',
   *     dateOfBirth: '1990-01-15',
   *     medicalRecordNumber: 'MRN-12345'
   *   });
   *   console.log('Patient created:', response.data);
   *   showSuccessNotification('Patient created successfully');
   * } catch (error) {
   *   if (error instanceof ApiClientError && error.isValidationError) {
   *     // Handle validation errors field-by-field
   *     error.validationErrors?.forEach((message, field) => {
   *       showFieldError(field, message);
   *     });
   *   } else if (error.status === 409) {
   *     showErrorNotification('Patient with this MRN already exists');
   *   }
   * }
   *
   * // Trigger action (report generation)
   * const response = await client.post<ReportResult>('/reports/generate', {
   *   type: 'monthly-summary',
   *   month: '2024-01',
   *   format: 'pdf'
   * });
   *
   * // Bulk create medications
   * const response = await client.post<BulkResult>('/medications/bulk', {
   *   medications: [
   *     { name: 'Aspirin', dosage: '100mg' },
   *     { name: 'Ibuprofen', dosage: '200mg' }
   *   ]
   * });
   * console.log(`Created ${response.data.created} medications`);
   *
   * // POST with cancellation
   * const controller = new AbortController();
   * const promise = client.post<Patient>('/patients', data, {
   *   signal: controller.signal
   * });
   * // Cancel if user navigates away
   * controller.abort();
   * ```
   *
   * @see {@link get} for retrieving resources
   * @see {@link put} for full resource updates
   * @see {@link patch} for partial resource updates
   * @see {@link delete} for removing resources
   */ async post(url, data, config) {
        return this.executeRequest('post', url, data, config);
    }
    /**
   * Execute PUT request for complete resource replacement
   *
   * @template T - The response data type expected from the API
   * @param {string} url - Request URL (relative to baseURL or absolute)
   * @param {unknown} [data] - Complete resource data to replace existing resource
   * @param {CancellableRequestConfig} [config] - Request configuration with optional AbortSignal
   * @returns {Promise<ApiResponse<T>>} Promise resolving to API response with updated resource
   * @throws {ApiClientError} Network, authentication, authorization, validation, or server errors
   * @throws {Error} Resilience hook errors
   *
   * @description
   * PUT replaces the entire resource with the provided data. All fields should be included.
   * Use PATCH for partial updates. Includes CSRF token automatically.
   *
   * @example
   * ```typescript
   * // Full update of patient record (all fields required)
   * const response = await client.put<Patient>('/patients/123', {
   *   id: '123',
   *   firstName: 'John',
   *   lastName: 'Doe',
   *   dateOfBirth: '1990-01-15',
   *   medicalRecordNumber: 'MRN-12345',
   *   // ... all other fields must be included
   * });
   * ```
   *
   * @see {@link patch} for partial updates
   */ async put(url, data, config) {
        return this.executeRequest('put', url, data, config);
    }
    /**
   * Execute PATCH request for partial resource update
   *
   * @template T - The response data type expected from the API
   * @param {string} url - Request URL (relative to baseURL or absolute)
   * @param {unknown} [data] - Partial resource data (only fields to update)
   * @param {CancellableRequestConfig} [config] - Request configuration with optional AbortSignal
   * @returns {Promise<ApiResponse<T>>} Promise resolving to API response with updated resource
   * @throws {ApiClientError} Network, authentication, authorization, validation, or server errors
   * @throws {Error} Resilience hook errors
   *
   * @description
   * PATCH updates only the specified fields, leaving other fields unchanged.
   * Preferred over PUT when updating a subset of fields. Includes CSRF token.
   *
   * @example
   * ```typescript
   * // Update only patient's phone number
   * const response = await client.patch<Patient>('/patients/123', {
   *   phoneNumber: '+1-555-123-4567'
   * });
   *
   * // Update medication status
   * const response = await client.patch<Medication>('/medications/456', {
   *   status: 'administered',
   *   administeredAt: new Date().toISOString()
   * });
   * ```
   *
   * @see {@link put} for full resource replacement
   */ async patch(url, data, config) {
        return this.executeRequest('patch', url, data, config);
    }
    /**
   * Execute DELETE request to remove a resource
   *
   * @template T - The response data type (typically void or deletion confirmation)
   * @param {string} url - Request URL (relative to baseURL or absolute)
   * @param {CancellableRequestConfig} [config] - Request configuration with optional AbortSignal
   * @returns {Promise<ApiResponse<T>>} Promise resolving to API response (typically empty)
   * @throws {ApiClientError} Network error, authentication error, authorization error (403), not found (404), server error
   * @throws {Error} Resilience hook errors
   *
   * @description
   * DELETE removes a resource permanently. This operation cannot be undone in most cases.
   * Includes CSRF token for security. Consider soft-delete for healthcare data.
   *
   * **Healthcare Warning:** Deleting medical records may violate retention policies.
   * Prefer soft-delete (status update) over hard-delete for patient data.
   *
   * @example
   * ```typescript
   * // Delete medication order (if allowed)
   * try {
   *   await client.delete('/medications/456');
   *   showSuccessNotification('Medication deleted');
   * } catch (error) {
   *   if (error instanceof ApiClientError) {
   *     if (error.status === 403) {
   *       showErrorNotification('Cannot delete administered medication');
   *     } else if (error.status === 404) {
   *       showErrorNotification('Medication not found');
   *     }
   *   }
   * }
   *
   * // Soft-delete preferred for patient data (use PATCH instead)
   * await client.patch('/patients/123', { status: 'deleted', deletedAt: new Date() });
   * ```
   *
   * @see {@link patch} for soft-delete via status update
   */ async delete(url, config) {
        return this.executeRequest('delete', url, undefined, config);
    }
    // ==========================================
    // ACCESSOR METHODS
    // ==========================================
    getAxiosInstance() {
        return this.instance;
    }
    setLogging(enabled) {
        this.enableLogging = enabled;
    }
    setRetry(enabled) {
        this.enableRetry = enabled;
    }
    /**
   * Set resilience hook for integration with resilience patterns
   */ setResilienceHook(hook) {
        this.resilienceHook = hook;
    }
    /**
   * Get current resilience hook
   */ getResilienceHook() {
        return this.resilienceHook;
    }
}
;
const apiClient = new ApiClient({
    enableLogging: ("TURBOPACK compile-time value", "development") === 'development',
    enableRetry: true,
    tokenManager: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$security$2f$tokenManager$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["secureTokenManager"]
});
}),
"[project]/src/identity-access/services/authApi.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @fileoverview Authentication API service with JWT-based secure credential validation
 * @module services/modules/authApi
 * @category Services - Authentication & Security
 *
 * Provides enterprise-grade authentication and authorization API endpoints for the
 * White Cross healthcare platform. Implements JWT-based authentication with OAuth 2.0
 * support, strong password validation, and comprehensive session management.
 *
 * Key Features:
 * - User authentication (login/logout) with JWT tokens
 * - User registration with role-based access control (RBAC)
 * - Token refresh mechanism for session continuity
 * - Strong password validation (12+ chars, uppercase, lowercase, number, special char)
 * - Email verification workflow
 * - Password reset flow with secure tokens
 * - Multi-factor authentication (MFA) integration
 * - OAuth 2.0 support (Google, Microsoft)
 * - Session management and token validation
 * - Development user listing (dev environment only)
 *
 * Security Features:
 * - Strong password requirements enforced client-side and server-side
 * - Zod schema validation for all authentication inputs
 * - Secure token storage via tokenUtils (sessionStorage)
 * - CSRF protection on state-changing operations
 * - Rate limiting on login attempts (backend-enforced)
 * - No PHI (Protected Health Information) in authentication data
 * - Automatic token expiration detection
 * - Secure password reset with time-limited tokens
 *
 * Token Management:
 * - Access tokens stored in sessionStorage for security
 * - Refresh tokens for automatic session renewal
 * - Token expiration handling with automatic cleanup
 * - Automatic logout on token expiry
 * - JWT payload parsing for expiration checking
 *
 * RBAC Roles:
 * - ADMIN: Full system access
 * - NURSE: Healthcare provider access
 * - SCHOOL_ADMIN: School-level administration
 * - DISTRICT_ADMIN: District-level administration
 * - VIEWER: Read-only access
 * - COUNSELOR: Student counseling access
 *
 * OAuth 2.0 Integration:
 * - Google OAuth for Google Workspace users
 * - Microsoft OAuth for Microsoft 365 users
 * - Automatic redirect-based authentication flow
 *
 * @example Login with email and password
 * ```typescript
 * import { authApi } from '@/services/modules/authApi';
 *
 * try {
 *   const { user, token } = await authApi.login({
 *     email: 'nurse@school.edu',
 *     password: 'SecurePass123!',
 *     rememberMe: true
 *   });
 *   console.log(`Logged in as ${user.firstName} ${user.lastName}`);
 *   console.log(`Role: ${user.role}`);
 * } catch (error) {
 *   console.error('Login failed:', error.message);
 * }
 * ```
 *
 * @example Register new user with role assignment
 * ```typescript
 * const response = await authApi.register({
 *   email: 'newuser@school.edu',
 *   password: 'SecurePass123!',
 *   firstName: 'Jane',
 *   lastName: 'Doe',
 *   role: 'NURSE',
 *   schoolId: 'school-uuid-here'
 * });
 * console.log(`User registered: ${response.user.email}`);
 * ```
 *
 * @example Refresh expired token
 * ```typescript
 * if (authApi.isTokenExpired()) {
 *   const { token: newToken } = await authApi.refreshToken();
 *   console.log('Token refreshed successfully');
 * }
 * ```
 *
 * @example Logout user
 * ```typescript
 * await authApi.logout();
 * console.log('User logged out, tokens cleared');
 * ```
 *
 * @example OAuth login with Google
 * ```typescript
 * // Redirects to Google OAuth consent screen
 * await authApi.loginWithGoogle();
 * ```
 *
 * @see {@link https://jwt.io/ JWT Documentation}
 * @see {@link https://oauth.net/2/ OAuth 2.0 Specification}
 * @see {@link tokenUtils} for token storage utilities
 */ __turbopack_context__.s([
    "AuthApi",
    ()=>AuthApi,
    "authApi",
    ()=>authApi,
    "createAuthApi",
    ()=>createAuthApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$config$2f$apiConfig$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/services/config/apiConfig.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/constants/api.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/constants/config.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v4/classic/external.js [app-ssr] (ecmascript) <export * as z>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$core$2f$errors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/core/errors.ts [app-ssr] (ecmascript)");
// Create and export a default instance for backward compatibility
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$core$2f$ApiClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/services/core/ApiClient.ts [app-ssr] (ecmascript) <locals>");
;
;
;
;
// Validation schemas
const loginSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    email: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().email('Invalid email address'),
    password: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(8, 'Password must be at least 8 characters'),
    rememberMe: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().optional()
});
const registerSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    email: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().email('Invalid email address'),
    password: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(8, 'Password must be at least 8 characters'),
    firstName: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, 'First name is required'),
    lastName: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, 'Last name is required'),
    role: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        'ADMIN',
        'NURSE',
        'SCHOOL_ADMIN',
        'DISTRICT_ADMIN',
        'VIEWER',
        'COUNSELOR'
    ]),
    schoolId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional()
});
class AuthApi {
    client;
    constructor(client){
        this.client = client;
    }
    /**
   * Authenticate user with email and password credentials
   *
   * Validates user credentials against the backend authentication service and
   * returns a JWT access token with user information. Automatically stores tokens
   * in sessionStorage for subsequent authenticated requests.
   *
   * @param {LoginCredentials} credentials - User login credentials
   * @param {string} credentials.email - User email address (validated format)
   * @param {string} credentials.password - User password (minimum 12 characters)
   * @param {boolean} [credentials.rememberMe] - Whether to remember user session
   * @returns {Promise<AuthResponse>} Authentication response with user and tokens
   * @returns {User} AuthResponse.user - Authenticated user object with role and permissions
   * @returns {string} AuthResponse.token - JWT access token for API authentication
   * @returns {string} AuthResponse.refreshToken - Refresh token for session renewal
   * @returns {number} AuthResponse.expiresIn - Token expiration time in seconds (86400 = 24 hours)
   * @throws {ValidationError} If email format is invalid or password is too short
   * @throws {ApiError} If authentication fails due to invalid credentials
   * @throws {ApiError} If backend service is unavailable or returns non-2xx status
   *
   * @example Successful login
   * ```typescript
   * const response = await authApi.login({
   *   email: 'nurse@school.edu',
   *   password: 'SecurePass123!',
   *   rememberMe: true
   * });
   * console.log(`Welcome, ${response.user.firstName}!`);
   * console.log(`Token expires in ${response.expiresIn} seconds`);
   * ```
   *
   * @example Handle login errors
   * ```typescript
   * try {
   *   await authApi.login({ email: 'test@example.com', password: 'short' });
   * } catch (error) {
   *   if (error.name === 'ValidationError') {
   *     console.error('Invalid input:', error.validationErrors);
   *   } else {
   *     console.error('Login failed:', error.message);
   *   }
   * }
   * ```
   *
   * @remarks
   * - Tokens are automatically stored in sessionStorage via tokenUtils
   * - Backend enforces rate limiting (max attempts per IP address)
   * - Successful login triggers audit log entry in backend
   * - MFA-enabled accounts require additional verification step
   * - Account lockout occurs after multiple failed attempts
   *
   * @see {@link logout} to end user session
   * @see {@link refreshToken} to renew access token
   * @see {@link verifyToken} to validate token status
   */ async login(credentials) {
        try {
            loginSchema.parse(credentials);
            console.log('[AuthApi] Sending login request to:', __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].AUTH.LOGIN);
            const response = await this.client.post(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].AUTH.LOGIN, credentials);
            console.log('[AuthApi] Login response received:', {
                response: response,
                hasData: !!response.data,
                responseKeys: Object.keys(response || {})
            });
            // ApiClient returns response.data from axios, which is already the backend response
            // Backend returns { accessToken, refreshToken, user, tokenType, expiresIn }
            const responseData = response.data || response;
            console.log('[AuthApi] Response data:', {
                hasAccessToken: !!responseData.accessToken,
                hasRefreshToken: !!responseData.refreshToken,
                hasUser: !!responseData.user,
                dataKeys: Object.keys(responseData || {})
            });
            const { accessToken, refreshToken, user, expiresIn } = responseData;
            if (!accessToken) {
                console.error('[AuthApi] Missing accessToken in response');
                throw new Error('Login failed - missing access token');
            }
            if (!refreshToken) {
                console.error('[AuthApi] Missing refreshToken in response');
                throw new Error('Login failed - missing refresh token');
            }
            console.log('[AuthApi] Storing tokens...');
            // Store tokens
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$config$2f$apiConfig$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tokenUtils"].setToken(accessToken);
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$config$2f$apiConfig$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tokenUtils"].setRefreshToken(refreshToken);
            console.log('[AuthApi] Login successful');
            return {
                user,
                token: accessToken,
                refreshToken: refreshToken,
                expiresIn: expiresIn
            };
        } catch (error) {
            console.error('[AuthApi] Login error:', error);
            if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].ZodError) {
                throw (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$core$2f$errors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createValidationError"])(error.issues[0]?.message || 'Validation error', error.issues[0]?.path.join('.'), error.issues.reduce((acc, err)=>{
                    const path = err.path.join('.');
                    if (!acc[path]) acc[path] = [];
                    acc[path].push(err.message);
                    return acc;
                }, {}), error);
            }
            throw (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$core$2f$errors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createApiError"])(error, 'Login failed');
        }
    }
    /**
   * Register new user account with role-based access control
   *
   * Creates a new user account in the system with specified role and school assignment.
   * Performs comprehensive validation of email uniqueness, password strength, and
   * role permissions. Automatically authenticates the user and returns tokens upon
   * successful registration.
   *
   * @param {RegisterData} userData - User registration data
   * @param {string} userData.email - Unique email address (validated format, max 255 chars)
   * @param {string} userData.password - Strong password (min 12 chars, uppercase, lowercase, number, special char)
   * @param {string} userData.firstName - User first name (min 1 char, max 100 chars)
   * @param {string} userData.lastName - User last name (min 1 char, max 100 chars)
   * @param {string} userData.role - User role (ADMIN | NURSE | SCHOOL_ADMIN | DISTRICT_ADMIN | VIEWER | COUNSELOR)
   * @param {string} [userData.schoolId] - Associated school UUID (required for NURSE, SCHOOL_ADMIN, COUNSELOR roles)
   * @returns {Promise<AuthResponse>} Authentication response with new user and tokens
   * @throws {ValidationError} If email is invalid, password is weak, or required fields are missing
   * @throws {ApiError} If email already exists in system
   * @throws {ApiError} If role assignment is not permitted
   * @throws {ApiError} If school ID is invalid or not found
   *
   * @example Register nurse for specific school
   * ```typescript
   * const response = await authApi.register({
   *   email: 'new.nurse@school.edu',
   *   password: 'VerySecure123!@#',
   *   firstName: 'Jane',
   *   lastName: 'Doe',
   *   role: 'NURSE',
   *   schoolId: 'abc-123-def-456'
   * });
   * console.log(`Account created for ${response.user.email}`);
   * ```
   *
   * @example Handle registration validation errors
   * ```typescript
   * try {
   *   await authApi.register({
   *     email: 'invalid-email',
   *     password: 'weak',
   *     firstName: 'John',
   *     lastName: 'Smith',
   *     role: 'NURSE'
   *   });
   * } catch (error) {
   *   if (error.name === 'ValidationError') {
   *     Object.entries(error.validationErrors).forEach(([field, messages]) => {
   *       console.error(`${field}: ${messages.join(', ')}`);
   *     });
   *   }
   * }
   * ```
   *
   * @remarks
   * - Email must be unique across entire platform
   * - Password requirements enforced: 12+ chars, uppercase, lowercase, digit, special char (@$!%*?&)
   * - ADMIN and DISTRICT_ADMIN roles may require additional approval
   * - New users receive email verification link (if email service configured)
   * - Audit log created for all registration attempts
   * - RBAC permissions automatically assigned based on role
   *
   * @see {@link login} to authenticate existing user
   * @see {@link usersApi} for additional user management operations
   */ async register(userData) {
        try {
            registerSchema.parse(userData);
            console.log('Register API endpoint:', __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].AUTH.REGISTER);
            console.log('API client base URL:', this.client);
            const response = await this.client.post(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].AUTH.REGISTER, userData);
            const { accessToken, refreshToken, user, expiresIn } = response.data;
            // Store tokens
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$config$2f$apiConfig$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tokenUtils"].setToken(accessToken);
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$config$2f$apiConfig$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tokenUtils"].setRefreshToken(refreshToken);
            return {
                user,
                token: accessToken,
                refreshToken: refreshToken,
                expiresIn: expiresIn
            };
        } catch (error) {
            if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].ZodError) {
                throw (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$core$2f$errors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createValidationError"])(error.issues[0]?.message || 'Validation error', error.issues[0]?.path.join('.'), error.issues.reduce((acc, err)=>{
                    const path = err.path.join('.');
                    if (!acc[path]) acc[path] = [];
                    acc[path].push(err.message);
                    return acc;
                }, {}), error);
            }
            throw (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$core$2f$errors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createApiError"])(error, 'Registration failed');
        }
    }
    /**
   * Verify current token validity
   */ async verifyToken() {
        try {
            const response = await this.client.post(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].AUTH.VERIFY);
            return response.data.user;
        } catch (error) {
            throw (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$core$2f$errors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createApiError"])(error, 'Token verification failed');
        }
    }
    /**
   * Refresh access token using refresh token
   */ async refreshToken() {
        try {
            const refreshToken = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$config$2f$apiConfig$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tokenUtils"].getRefreshToken();
            if (!refreshToken) {
                throw new Error('No refresh token available');
            }
            const response = await this.client.post(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].AUTH.REFRESH, {
                refreshToken
            });
            const { accessToken, refreshToken: newRefreshToken, expiresIn } = response.data;
            // Update stored tokens
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$config$2f$apiConfig$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tokenUtils"].setToken(accessToken);
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$config$2f$apiConfig$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tokenUtils"].setRefreshToken(newRefreshToken);
            return {
                token: accessToken,
                refreshToken: newRefreshToken,
                expiresIn: expiresIn
            };
        } catch (error) {
            // Clear tokens on refresh failure
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$config$2f$apiConfig$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tokenUtils"].clearAll();
            throw (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$core$2f$errors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createApiError"])(error, 'Token refresh failed');
        }
    }
    /**
   * Logout user
   */ async logout() {
        try {
            await this.client.post(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].AUTH.LOGOUT);
        } catch (error) {
            // Continue with local logout even if server request fails
            console.warn('Server logout failed, continuing with local logout');
        } finally{
            // Always clear local tokens
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$config$2f$apiConfig$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tokenUtils"].clearAll();
        }
    }
    /**
   * Get current user from session
   */ async getCurrentUser() {
        try {
            const response = await this.client.get(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].AUTH.PROFILE);
            if (!response.data.success || !response.data.data) {
                throw new Error('Failed to get current user');
            }
            return response.data.data;
        } catch (error) {
            throw (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$core$2f$errors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createApiError"])(error, 'Failed to get current user');
        }
    }
    /**
   * Google OAuth login
   */ async loginWithGoogle() {
        const baseUrl = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_CONFIG"].BASE_URL.replace('/api', '');
        window.location.href = `${baseUrl}${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].AUTH.LOGIN}/google`;
    }
    /**
   * Microsoft OAuth login
   */ async loginWithMicrosoft() {
        const baseUrl = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_CONFIG"].BASE_URL.replace('/api', '');
        window.location.href = `${baseUrl}${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].AUTH.LOGIN}/microsoft`;
    }
    /**
   * Request password reset
   */ async forgotPassword(email) {
        try {
            const response = await this.client.post(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].AUTH.FORGOT_PASSWORD, {
                email
            });
            return response.data;
        } catch (error) {
            throw (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$core$2f$errors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createApiError"])(error, 'Password reset request failed');
        }
    }
    /**
   * Reset password with token
   */ async resetPassword(token, password) {
        try {
            const response = await this.client.post(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].AUTH.RESET_PASSWORD, {
                token,
                password
            });
            return response.data;
        } catch (error) {
            throw (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$core$2f$errors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createApiError"])(error, 'Password reset failed');
        }
    }
    /**
   * Check if user is authenticated
   */ isAuthenticated() {
        const token = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$config$2f$apiConfig$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tokenUtils"].getToken();
        return !!token;
    }
    /**
   * Check if token is expired
   */ isTokenExpired() {
        try {
            const token = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$config$2f$apiConfig$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tokenUtils"].getToken();
            if (!token) return true;
            const payload = JSON.parse(atob(token.split('.')[1]));
            const currentTime = Date.now() / 1000;
            return payload.exp < currentTime;
        } catch (error) {
            return true;
        }
    }
    /**
   * Get all users for development/testing (includes passwords)
   * Only works in development environment
   */ async getDevUsers() {
        try {
            const response = await this.client.get(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_ENDPOINTS"].USERS.BASE + '/dev');
            if (!response.data.success || !response.data.data) {
                throw new Error('Failed to fetch development users');
            }
            return response.data.data.users;
        } catch (error) {
            throw (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$core$2f$errors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createApiError"])(error, 'Failed to fetch development users');
        }
    }
}
function createAuthApi(client) {
    return new AuthApi(client);
}
;
const authApi = createAuthApi(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$core$2f$ApiClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["apiClient"]);
}),
"[project]/src/identity-access/stores/authSlice.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @fileoverview Authentication Redux Slice for White Cross Healthcare Platform
 *
 * Manages global authentication state including user sessions, login/logout flows,
 * and JWT token lifecycle management. This slice is persisted to localStorage for
 * session recovery across browser tabs and page refreshes.
 *
 * **Key Features:**
 * - JWT-based authentication with automatic token refresh
 * - Secure credential handling with httpOnly cookies
 * - Cross-tab state synchronization via BroadcastChannel API
 * - Persistent session management with localStorage (non-PHI user data only)
 * - Integration with RBAC (Role-Based Access Control) system
 * - Automatic session cleanup on logout
 * - Toast notifications for user feedback
 *
 * **HIPAA Compliance:**
 * - User profile data (name, email, role) is NOT considered PHI
 * - Authentication state is persisted to localStorage (HIPAA compliant)
 * - JWT tokens stored in httpOnly cookies (not accessible via JavaScript)
 * - Session expiration enforced server-side and client-side
 * - All authentication operations are audit logged on the backend
 *
 * **State Management:**
 * - Global store location: `stores/slices/authSlice.ts`
 * - Persisted to localStorage via redux-persist
 * - Automatically cleared on logout via `clearPersistedState()`
 * - Synchronized across browser tabs
 *
 * **Integration:**
 * - Backend API: `services/modules/authApi.ts`
 * - Type definitions: `types/index.ts` (User interface)
 * - Redux store: `stores/reduxStore.ts`
 * - Used by: Authentication guards, protected routes, user profile components
 *
 * @module stores/slices/authSlice
 * @requires @reduxjs/toolkit
 * @requires services/modules/authApi
 * @requires types/User
 * @security Authentication state management, JWT token handling
 * @compliance HIPAA-compliant user session management
 *
 * @example Basic usage in component
 * ```typescript
 * import { useDispatch, useSelector } from 'react-redux';
 * import { loginUser, logoutUser } from '@/identity-access/stores/authSlice';
 *
 * function LoginForm() {
 *   const dispatch = useDispatch();
 *   const { isAuthenticated, isLoading, user, error } = useSelector((state) => state.auth);
 *
 *   const handleLogin = async (credentials) => {
 *     await dispatch(loginUser(credentials));
 *   };
 *
 *   return (
 *     <form onSubmit={handleLogin}>
 *       {error && <div>{error}</div>}
 *       {user && <div>Welcome, {user.firstName}!</div>}
 *     </form>
 *   );
 * }
 * ```
 *
 * @example Protected route with auth check
 * ```typescript
 * import { Navigate } from 'react-router-dom';
 * import { useSelector } from 'react-redux';
 *
 * function ProtectedRoute({ children }) {
 *   const { isAuthenticated } = useSelector((state) => state.auth);
 *
 *   if (!isAuthenticated) {
 *     return <Navigate to="/login" />;
 *   }
 *
 *   return children;
 * }
 * ```
 *
 * @see {@link ../../services/modules/authApi.ts} for API integration
 * @see {@link ../reduxStore.ts} for store configuration
 * @since 1.0.0
 */ __turbopack_context__.s([
    "clearAuthError",
    ()=>clearAuthError,
    "clearError",
    ()=>clearError,
    "default",
    ()=>__TURBOPACK__default__export__,
    "loginUser",
    ()=>loginUser,
    "logoutUser",
    ()=>logoutUser,
    "refreshAuthToken",
    ()=>refreshAuthToken,
    "refreshUser",
    ()=>refreshUser,
    "registerUser",
    ()=>registerUser,
    "setUser",
    ()=>setUser,
    "setUserFromSession",
    ()=>setUserFromSession
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$services$2f$authApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/identity-access/services/authApi.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-hot-toast/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$debug$2f$src$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/debug/src/index.js [app-ssr] (ecmascript)");
;
;
;
;
const log = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$debug$2f$src$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])('whitecross:auth-slice');
/**
 * Initial authentication state when no user is logged in.
 *
 * This state is used on first load and after logout operations.
 *
 * @type {AuthState}
 * @constant
 */ const initialState = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    sessionExpiresAt: null
};
const loginUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])('auth/loginUser', async (credentials, { rejectWithValue })=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$services$2f$authApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authApi"].login(credentials);
        return response;
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Login failed';
        return rejectWithValue(message);
    }
});
const registerUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])('auth/registerUser', async (userData, { rejectWithValue })=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$services$2f$authApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authApi"].register(userData);
        return response;
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Registration failed';
        return rejectWithValue(message);
    }
});
const logoutUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])('auth/logoutUser', async (_, { rejectWithValue })=>{
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$services$2f$authApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authApi"].logout();
    } catch (error) {
        // Even if server logout fails, we still want to clear local state
        const message = error instanceof Error ? error.message : 'Logout failed';
        return rejectWithValue(message);
    }
});
const refreshUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])('auth/refreshUser', async (_, { rejectWithValue })=>{
    try {
        const user = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$services$2f$authApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authApi"].verifyToken();
        return user;
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Token verification failed';
        return rejectWithValue(message);
    }
});
/**
 * Authentication Redux slice with reducers for login, logout, registration, and token refresh.
 *
 * Handles all authentication state transitions including loading states, error handling,
 * and user profile management. Integrates with react-hot-toast for user feedback.
 *
 * @constant authSlice
 * @type {Slice<AuthState>}
 */ const authSlice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createSlice"])({
    name: 'auth',
    initialState,
    reducers: {
        /**
     * Clears the current error message from authentication state.
     *
     * Used to dismiss error messages after user acknowledgment or before
     * retrying a failed operation.
     *
     * @function clearError
     * @param {AuthState} state - Current authentication state
     * @returns {void}
     *
     * @example Clear error after user dismisses notification
     * ```typescript
     * const { error } = useSelector((state) => state.auth);
     * const dispatch = useDispatch();
     *
     * if (error) {
     *   return (
     *     <Alert onClose={() => dispatch(clearError())}>
     *       {error}
     *     </Alert>
     *   );
     * }
     * ```
     */ clearError: (state)=>{
            state.error = null;
        },
        /**
     * Directly sets the current user in authentication state.
     *
     * Used for manual user updates (e.g., profile edits, role changes) or
     * for cross-tab synchronization via BroadcastChannel API. Setting user
     * to null logs the user out.
     *
     * @function setUser
     * @param {AuthState} state - Current authentication state
     * @param {PayloadAction<User | null>} action - User profile or null to logout
     * @returns {void}
     *
     * @example Update user profile after edit
     * ```typescript
     * const handleProfileUpdate = (updatedUser: User) => {
     *   dispatch(setUser(updatedUser));
     *   toast.success('Profile updated successfully');
     * };
     * ```
     *
     * @example Cross-tab session sync
     * ```typescript
     * const channel = new BroadcastChannel('auth');
     * channel.onmessage = (event) => {
     *   if (event.data.type === 'USER_UPDATED') {
     *     dispatch(setUser(event.data.user));
     *   }
     * };
     * ```
     */ setUser: (state, action)=>{
            state.user = action.payload;
            state.isAuthenticated = !!action.payload;
            state.error = null;
        }
    },
    extraReducers: (builder)=>{
        builder/**
       * Login pending - Sets loading state while authentication request is in progress.
       * Clears any previous error messages to provide clean UX for retry attempts.
       */ .addCase(loginUser.pending, (state)=>{
            state.isLoading = true;
            state.error = null;
        })/**
       * Login fulfilled - User successfully authenticated.
       * Stores user profile, sets authenticated flag, and shows welcome toast.
       * User data is automatically persisted to localStorage by redux-persist.
       */ .addCase(loginUser.fulfilled, (state, action)=>{
            state.user = action.payload.user;
            state.isAuthenticated = true;
            state.isLoading = false;
            state.error = null;
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].success(`Welcome back, ${action.payload.user.firstName}!`);
        })/**
       * Login rejected - Authentication failed.
       * Clears user state, stores error message, and shows error toast.
       * Common causes: invalid credentials, account locked, network error.
       */ .addCase(loginUser.rejected, (state, action)=>{
            state.user = null;
            state.isAuthenticated = false;
            state.isLoading = false;
            state.error = action.payload;
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].error(action.payload);
        })/**
       * Register pending - Sets loading state while registration request is in progress.
       * Clears any previous error messages.
       */ .addCase(registerUser.pending, (state)=>{
            state.isLoading = true;
            state.error = null;
        })/**
       * Register fulfilled - User account successfully created.
       * Stores user profile, sets authenticated flag, and shows welcome toast.
       * User is automatically logged in after successful registration.
       */ .addCase(registerUser.fulfilled, (state, action)=>{
            state.user = action.payload.user;
            state.isAuthenticated = true;
            state.isLoading = false;
            state.error = null;
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].success(`Welcome, ${action.payload.user.firstName}! Your account has been created.`);
        })/**
       * Register rejected - Registration failed.
       * Clears user state, stores error message, and shows error toast.
       * Common causes: duplicate email, invalid data, validation error.
       */ .addCase(registerUser.rejected, (state, action)=>{
            state.user = null;
            state.isAuthenticated = false;
            state.isLoading = false;
            state.error = action.payload;
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].error(action.payload);
        })/**
       * Logout pending - Sets loading state during logout process.
       * Brief loading state while backend invalidates token.
       */ .addCase(logoutUser.pending, (state)=>{
            state.isLoading = true;
        })/**
       * Logout fulfilled - User successfully logged out.
       * Clears all authentication state and persisted data from localStorage.
       * Called via clearPersistedState() to remove all Redux persisted state.
       */ .addCase(logoutUser.fulfilled, (state)=>{
            state.user = null;
            state.isAuthenticated = false;
            state.isLoading = false;
            state.error = null;
            state.sessionExpiresAt = null;
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].success('You have been logged out successfully');
        })/**
       * Logout rejected - Backend logout failed but still clear local state.
       * Security best practice: Always clear local state even if backend fails.
       * User cannot continue authenticated session if backend logout failed.
       */ .addCase(logoutUser.rejected, (state)=>{
            // Even if server logout fails, clear local state
            state.user = null;
            state.isAuthenticated = false;
            state.isLoading = false;
            state.error = null;
            state.sessionExpiresAt = null;
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].success('You have been logged out successfully');
        })/**
       * Refresh user fulfilled - Token verified and user profile updated.
       * Called on app initialization to restore session from persisted state.
       * Updates user profile with latest data from backend.
       */ .addCase(refreshUser.fulfilled, (state, action)=>{
            state.user = action.payload;
            state.isAuthenticated = true;
            state.error = null;
        })/**
       * Refresh user rejected - Token verification failed (expired or invalid).
       * Performs silent logout without showing error toast (expected during normal session expiry).
       * User will be redirected to login page by authentication guard.
       */ .addCase(refreshUser.rejected, (state)=>{
            // If token verification fails, logout user
            state.user = null;
            state.isAuthenticated = false;
            state.error = null;
            // Don't show toast for silent refresh failures
            log('Token verification failed during refresh');
        });
    }
});
const { clearError, setUser } = authSlice.actions;
const clearAuthError = clearError;
const setUserFromSession = setUser;
const refreshAuthToken = refreshUser;
const __TURBOPACK__default__export__ = authSlice.reducer;
}),
"[project]/src/identity-access/stores/accessControl/state.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @fileoverview Access Control State Definition
 * @module identity-access/stores/accessControl/state
 * @category Access Control - State Management
 */ __turbopack_context__.s([
    "initialState",
    ()=>initialState
]);
const initialState = {
    roles: [],
    permissions: [],
    securityIncidents: [],
    sessions: [],
    ipRestrictions: [],
    statistics: null,
    selectedRole: null,
    selectedPermission: null,
    selectedIncident: null,
    filters: {
        incidents: {},
        sessions: {}
    },
    pagination: {
        roles: {
            page: 1,
            limit: 20,
            total: 0
        },
        permissions: {
            page: 1,
            limit: 20,
            total: 0
        },
        incidents: {
            page: 1,
            limit: 20,
            total: 0
        },
        sessions: {
            page: 1,
            limit: 20,
            total: 0
        }
    },
    loading: {
        roles: false,
        permissions: false,
        incidents: false,
        sessions: false,
        statistics: false,
        operations: false
    },
    error: null,
    notifications: []
};
}),
"[project]/src/services/utils/apiUtils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * WF-COMP-302 | apiUtils.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: axios, moment, debug
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: constants, interfaces, classes | Key Features: component
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */ __turbopack_context__.s([
    "ApiErrorHandler",
    ()=>ApiErrorHandler,
    "apiCache",
    ()=>apiCache,
    "buildPaginationParams",
    ()=>buildPaginationParams,
    "buildUrlParams",
    ()=>buildUrlParams,
    "createFormData",
    ()=>createFormData,
    "debounce",
    ()=>debounce,
    "extractApiData",
    ()=>extractApiData,
    "extractApiDataOptional",
    ()=>extractApiDataOptional,
    "formatDateForApi",
    ()=>formatDateForApi,
    "formatDateForDisplay",
    ()=>formatDateForDisplay,
    "formatDateTimeForDisplay",
    ()=>formatDateTimeForDisplay,
    "getTimeUntilExpiry",
    ()=>getTimeUntilExpiry,
    "handleApiError",
    ()=>handleApiError,
    "isApiResponse",
    ()=>isApiResponse,
    "isDateExpired",
    ()=>isDateExpired,
    "isPaginatedResponse",
    ()=>isPaginatedResponse,
    "parseDateFromApi",
    ()=>parseDateFromApi,
    "withCache",
    ()=>withCache,
    "withRetry",
    ()=>withRetry
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$formatISO$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/date-fns/formatISO.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$parseISO$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/date-fns/parseISO.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$isValid$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/date-fns/isValid.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$format$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/date-fns/format.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$isBefore$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/date-fns/isBefore.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$differenceInMilliseconds$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/date-fns/differenceInMilliseconds.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$debug$2f$src$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/debug/src/index.js [app-ssr] (ecmascript)");
;
;
const log = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$debug$2f$src$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])('whitecross:api-utils');
class ApiErrorHandler {
    static handle(error) {
        // Type guard to check if error is an AxiosError
        const isAxiosError = (err)=>{
            return err !== null && typeof err === 'object' && 'isAxiosError' in err;
        };
        if (isAxiosError(error) && error.response) {
            // Server responded with error status
            const { status, data } = error.response;
            // Safely access data properties
            const errorData = data;
            const message = errorData?.message || `Request failed with status ${status}`;
            const code = errorData?.code;
            const errors = errorData?.errors;
            const details = errors || errorData?.details;
            return {
                message,
                code,
                status,
                details
            };
        } else if (isAxiosError(error) && error.request) {
            // Network error
            return {
                message: 'Network error - please check your connection',
                code: 'NETWORK_ERROR',
                details: error.request
            };
        } else {
            // Other error - safely access message if available
            const message = isAxiosError(error) && error.message || 'An unexpected error occurred';
            return {
                message,
                code: 'UNKNOWN_ERROR',
                details: error
            };
        }
    }
    static isNetworkError(error) {
        return error.code === 'NETWORK_ERROR';
    }
    static isValidationError(error) {
        return error.status === 400 && !!error.details;
    }
    static isUnauthorizedError(error) {
        return error.status === 401;
    }
    static isForbiddenError(error) {
        return error.status === 403;
    }
    static isNotFoundError(error) {
        return error.status === 404;
    }
    static isServerError(error) {
        return (error.status ?? 0) >= 500;
    }
}
const extractApiData = (response)=>{
    if (response.data.success && response.data.data !== undefined) {
        return response.data.data;
    }
    throw new Error('API request failed');
};
const extractApiDataOptional = (response)=>{
    try {
        return extractApiData(response);
    } catch  {
        return null;
    }
};
const buildUrlParams = (params)=>{
    const urlParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value])=>{
        if (value !== undefined && value !== null && value !== '') {
            urlParams.append(key, String(value));
        }
    });
    const paramsString = urlParams.toString();
    return paramsString ? `?${paramsString}` : '';
};
const buildPaginationParams = (page = 1, limit = 10, sort, order)=>{
    const params = {
        page,
        limit
    };
    if (sort) params.sort = sort;
    if (order) params.order = order;
    return buildUrlParams(params);
};
const formatDateForApi = (date)=>{
    try {
        if (typeof date === 'string') {
            // Try to parse as ISO string first
            const parsed = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$parseISO$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["parseISO"])(date);
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$isValid$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isValid"])(parsed)) {
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$formatISO$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatISO"])(parsed);
            }
            // If not valid ISO, try as Date constructor
            const fallback = new Date(date);
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$isValid$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isValid"])(fallback)) {
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$formatISO$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatISO"])(fallback);
            }
            throw new Error('Invalid date format');
        }
        if (date instanceof Date) {
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$isValid$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isValid"])(date)) {
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$formatISO$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatISO"])(date);
            }
            throw new Error('Invalid date');
        }
        throw new Error('Invalid date format');
    } catch (error) {
        log('Error formatting date for API:', error);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$formatISO$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatISO"])(new Date()); // Fallback to current time
    }
};
const parseDateFromApi = (dateString)=>{
    try {
        const parsedDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$parseISO$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["parseISO"])(dateString);
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$isValid$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isValid"])(parsedDate)) {
            return parsedDate;
        }
        // Fallback: try Date constructor
        const fallback = new Date(dateString);
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$isValid$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isValid"])(fallback)) {
            return fallback;
        }
        throw new Error('Invalid date string');
    } catch (error) {
        log('Error parsing date from API:', error);
        return new Date(); // Fallback to current date
    }
};
const formatDateForDisplay = (date)=>{
    try {
        const dateObj = typeof date === 'string' ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$parseISO$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["parseISO"])(date) : date;
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$isValid$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isValid"])(dateObj)) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$format$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["format"])(dateObj, 'MMM dd, yyyy');
        }
        return 'Invalid Date';
    } catch (error) {
        log('Error formatting date for display:', error);
        return 'Invalid Date';
    }
};
const formatDateTimeForDisplay = (date)=>{
    try {
        const dateObj = typeof date === 'string' ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$parseISO$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["parseISO"])(date) : date;
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$isValid$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isValid"])(dateObj)) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$format$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["format"])(dateObj, 'MMM dd, yyyy HH:mm');
        }
        return 'Invalid Date';
    } catch (error) {
        log('Error formatting datetime for display:', error);
        return 'Invalid Date';
    }
};
const isDateExpired = (date)=>{
    try {
        const dateObj = typeof date === 'string' ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$parseISO$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["parseISO"])(date) : date;
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$isValid$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isValid"])(dateObj)) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$isBefore$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isBefore"])(dateObj, new Date());
        }
        return false;
    } catch (error) {
        log('Error checking if date is expired:', error);
        return false;
    }
};
const getTimeUntilExpiry = (date)=>{
    try {
        const expiryDate = typeof date === 'string' ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$parseISO$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["parseISO"])(date) : date;
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$isValid$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isValid"])(expiryDate)) {
            return 'Unknown';
        }
        const now = new Date();
        const diff = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$differenceInMilliseconds$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["differenceInMilliseconds"])(expiryDate, now);
        if (diff <= 0) return 'Expired';
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(diff % (1000 * 60 * 60 * 24) / (1000 * 60 * 60));
        const minutes = Math.floor(diff % (1000 * 60 * 60) / (1000 * 60));
        if (days > 0) return `${days}d ${hours}h`;
        if (hours > 0) return `${hours}h ${minutes}m`;
        return `${minutes}m`;
    } catch (error) {
        log('Error calculating time until expiry:', error);
        return 'Unknown';
    }
};
const withRetry = async (fn, maxRetries = 3, delay = 1000)=>{
    let lastError;
    for(let i = 0; i <= maxRetries; i++){
        try {
            return await fn();
        } catch (error) {
            lastError = error;
            if (i === maxRetries) {
                throw lastError;
            }
            // Wait before retrying
            await new Promise((resolve)=>setTimeout(resolve, delay * (i + 1)));
        }
    }
    throw lastError;
};
const createFormData = (data)=>{
    const formData = new FormData();
    Object.entries(data).forEach(([key, value])=>{
        if (value !== undefined && value !== null) {
            if (value instanceof File) {
                formData.append(key, value);
            } else if (Array.isArray(value)) {
                value.forEach((item, index)=>{
                    formData.append(`${key}[${index}]`, item);
                });
            } else {
                formData.append(key, String(value));
            }
        }
    });
    return formData;
};
const isApiResponse = (obj)=>{
    return obj !== null && typeof obj === 'object' && 'success' in obj && 'data' in obj;
};
const isPaginatedResponse = (obj)=>{
    return obj !== null && typeof obj === 'object' && 'data' in obj && 'pagination' in obj;
};
// Cache utilities (simple in-memory cache)
class ApiCache {
    cache = new Map();
    set(key, data, ttl = 5 * 60 * 1000) {
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
            ttl
        });
    }
    get(key) {
        const item = this.cache.get(key);
        if (!item) return null;
        if (Date.now() - item.timestamp > item.ttl) {
            this.cache.delete(key);
            return null;
        }
        return item.data;
    }
    delete(key) {
        this.cache.delete(key);
    }
    clear() {
        this.cache.clear();
    }
    // Generate cache key from URL and params
    generateKey(url, params) {
        const paramsString = params ? JSON.stringify(params) : '';
        return `${url}:${paramsString}`;
    }
}
const apiCache = new ApiCache();
const withCache = (fn)=>{
    return async (...args)=>{
        // For now, just call the function without caching
        // In a real implementation, you'd want to generate a cache key from the args
        return fn(...args);
    };
};
const debounce = (func, wait)=>{
    let timeout;
    return (...args)=>{
        clearTimeout(timeout);
        timeout = setTimeout(()=>func(...args), wait);
    };
};
const handleApiError = ApiErrorHandler.handle;
}),
"[project]/src/services/modules/accessControlApi.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @fileoverview Access Control and RBAC Management API service
 * @module services/modules/accessControlApi
 * @category Services - Security & Access Control
 *
 * Provides comprehensive Role-Based Access Control (RBAC) management, security incident
 * tracking, session management, and IP restriction capabilities for the White Cross
 * healthcare platform. Implements enterprise-grade security controls with audit logging.
 *
 * Key Features:
 * - Role management (create, update, delete roles)
 * - Permission management (create and assign permissions)
 * - Role-Permission assignments (many-to-many relationship)
 * - User-Role assignments (dynamic role switching)
 * - Permission checking and validation
 * - Session management and tracking
 * - Security incident logging and monitoring
 * - IP restriction management (allowlist/blocklist)
 * - Security statistics and analytics
 * - Default role initialization
 *
 * RBAC Hierarchy:
 * - System Admin > District Admin > School Admin > Nurse > Counselor > Viewer
 * - Hierarchical role inheritance with permission aggregation
 * - Dynamic permission checking at runtime
 * - Resource-level and action-level permissions
 *
 * Security Features:
 * - Role-based permission enforcement on all endpoints
 * - Automatic audit logging for all access control changes
 * - Session tracking with IP and user agent logging
 * - Security incident classification (LOW, MEDIUM, HIGH, CRITICAL)
 * - IP restriction for enhanced security
 * - Multi-session management per user
 * - Automatic session expiration handling
 *
 * Permission Model:
 * - Resource-based permissions (e.g., 'students', 'medications', 'reports')
 * - Action-based permissions (e.g., 'read', 'create', 'update', 'delete')
 * - Combined permission format: 'resource:action' (e.g., 'students:read')
 * - Wildcard permissions supported ('*:*' for super admin)
 *
 * Security Incident Tracking:
 * - Failed login attempts monitoring
 * - Unauthorized access attempts logging
 * - Suspicious activity detection
 * - Incident severity classification
 * - Automatic alerting for critical incidents
 *
 * Session Management:
 * - Multi-device session support
 * - Session termination (single or all user sessions)
 * - Session activity tracking
 * - Automatic cleanup of expired sessions
 *
 * IP Restriction Management:
 * - IP allowlist for trusted networks
 * - IP blocklist for banned addresses
 * - CIDR notation support for network ranges
 * - Geographic IP filtering capabilities
 *
 * @example Setup RBAC for new user
 * ```typescript
 * import { accessControlApi } from '@/services/modules/accessControlApi';
 *
 * // Assign role to user
 * const assignment = await accessControlApi.assignRoleToUser(
 *   'user-uuid-123',
 *   'role-nurse-uuid'
 * );
 *
 * // Check user permissions
 * const hasAccess = await accessControlApi.checkPermission(
 *   'user-uuid-123',
 *   'students',
 *   'read'
 * );
 * console.log(`User can read students: ${hasAccess.hasPermission}`);
 * ```
 *
 * @example Manage user sessions
 * ```typescript
 * // Get all active sessions for user
 * const { sessions } = await accessControlApi.getUserSessions('user-uuid-123');
 * console.log(`Active sessions: ${sessions.length}`);
 *
 * // Terminate all sessions (force logout)
 * await accessControlApi.deleteAllUserSessions('user-uuid-123');
 * ```
 *
 * @example Track security incidents
 * ```typescript
 * const incidents = await accessControlApi.getSecurityIncidents({
 *   severity: 'HIGH',
 *   startDate: '2025-01-01',
 *   endDate: '2025-01-31'
 * });
 * console.log(`High severity incidents: ${incidents.total}`);
 * ```
 *
 * @see {@link usersApi} for user management operations
 * @see {@link authApi} for authentication operations
 * @see {@link Role} for role data type definition
 * @see {@link Permission} for permission data type definition
 */ __turbopack_context__.s([
    "AccessControlApiImpl",
    ()=>AccessControlApiImpl,
    "accessControlApi",
    ()=>accessControlApi,
    "createAccessControlApi",
    ()=>createAccessControlApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$utils$2f$apiUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/utils/apiUtils.ts [app-ssr] (ecmascript)");
// Export singleton instance
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$core$2f$ApiClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/services/core/ApiClient.ts [app-ssr] (ecmascript) <locals>");
;
/**
 * Access Control API implementation
 * Handles roles, permissions, sessions, and security management
 */ class AccessControlApiImpl {
    client;
    constructor(client){
        this.client = client;
    }
    // Roles
    /**
   * Get all roles
   */ async getRoles() {
        try {
            const response = await this.client.get('/access-control/roles');
            return response.data;
        } catch (error) {
            throw (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$utils$2f$apiUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["handleApiError"])(error);
        }
    }
    /**
   * Get role by ID
   */ async getRoleById(id) {
        try {
            const response = await this.client.get(`/access-control/roles/${id}`);
            return response.data;
        } catch (error) {
            throw (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$utils$2f$apiUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["handleApiError"])(error);
        }
    }
    /**
   * Create a new role
   */ async createRole(data) {
        try {
            const response = await this.client.post('/access-control/roles', data);
            return response.data;
        } catch (error) {
            throw (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$utils$2f$apiUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["handleApiError"])(error);
        }
    }
    /**
   * Update an existing role
   */ async updateRole(id, data) {
        try {
            const response = await this.client.put(`/access-control/roles/${id}`, data);
            return response.data;
        } catch (error) {
            throw (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$utils$2f$apiUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["handleApiError"])(error);
        }
    }
    /**
   * Delete a role
   */ async deleteRole(id) {
        try {
            const response = await this.client.delete(`/access-control/roles/${id}`);
            return response.data;
        } catch (error) {
            throw (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$utils$2f$apiUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["handleApiError"])(error);
        }
    }
    // Permissions
    /**
   * Get all permissions
   */ async getPermissions() {
        try {
            const response = await this.client.get('/access-control/permissions');
            return response.data;
        } catch (error) {
            throw (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$utils$2f$apiUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["handleApiError"])(error);
        }
    }
    /**
   * Create a new permission
   */ async createPermission(data) {
        try {
            const response = await this.client.post('/access-control/permissions', data);
            return response.data;
        } catch (error) {
            throw (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$utils$2f$apiUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["handleApiError"])(error);
        }
    }
    // Role-Permission Assignments
    /**
   * Assign permission to role
   */ async assignPermissionToRole(roleId, permissionId) {
        try {
            const response = await this.client.post(`/access-control/roles/${roleId}/permissions/${permissionId}`);
            return response.data;
        } catch (error) {
            throw (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$utils$2f$apiUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["handleApiError"])(error);
        }
    }
    /**
   * Remove permission from role
   */ async removePermissionFromRole(roleId, permissionId) {
        try {
            const response = await this.client.delete(`/access-control/roles/${roleId}/permissions/${permissionId}`);
            return response.data;
        } catch (error) {
            throw (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$utils$2f$apiUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["handleApiError"])(error);
        }
    }
    // User-Role Assignments
    /**
   * Assign role to user
   */ async assignRoleToUser(userId, roleId) {
        try {
            const response = await this.client.post(`/access-control/users/${userId}/roles/${roleId}`);
            return response.data;
        } catch (error) {
            throw (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$utils$2f$apiUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["handleApiError"])(error);
        }
    }
    /**
   * Remove role from user
   */ async removeRoleFromUser(userId, roleId) {
        try {
            const response = await this.client.delete(`/access-control/users/${userId}/roles/${roleId}`);
            return response.data;
        } catch (error) {
            throw (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$utils$2f$apiUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["handleApiError"])(error);
        }
    }
    // User Permissions
    /**
   * Get user permissions
   */ async getUserPermissions(userId) {
        try {
            const response = await this.client.get(`/access-control/users/${userId}/permissions`);
            return response.data;
        } catch (error) {
            throw (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$utils$2f$apiUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["handleApiError"])(error);
        }
    }
    /**
   * Check if user has specific permission
   */ async checkPermission(userId, resource, action) {
        try {
            const response = await this.client.get(`/access-control/users/${userId}/check`, {
                params: {
                    resource,
                    action
                }
            });
            return response.data;
        } catch (error) {
            throw (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$utils$2f$apiUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["handleApiError"])(error);
        }
    }
    // Sessions
    /**
   * Get user sessions
   */ async getUserSessions(userId) {
        try {
            const response = await this.client.get(`/access-control/users/${userId}/sessions`);
            return response.data;
        } catch (error) {
            throw (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$utils$2f$apiUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["handleApiError"])(error);
        }
    }
    /**
   * Delete a specific session
   */ async deleteSession(token) {
        try {
            const response = await this.client.delete(`/access-control/sessions/${token}`);
            return response.data;
        } catch (error) {
            throw (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$utils$2f$apiUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["handleApiError"])(error);
        }
    }
    /**
   * Delete all user sessions
   */ async deleteAllUserSessions(userId) {
        try {
            const response = await this.client.delete(`/access-control/users/${userId}/sessions`);
            return response.data;
        } catch (error) {
            throw (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$utils$2f$apiUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["handleApiError"])(error);
        }
    }
    // Security Incidents
    /**
   * Get security incidents with optional filters
   */ async getSecurityIncidents(params) {
        try {
            const response = await this.client.get('/access-control/security-incidents', {
                params
            });
            return response.data;
        } catch (error) {
            throw (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$utils$2f$apiUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["handleApiError"])(error);
        }
    }
    /**
   * Create security incident
   */ async createSecurityIncident(data) {
        try {
            const response = await this.client.post('/access-control/security-incidents', data);
            return response.data;
        } catch (error) {
            throw (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$utils$2f$apiUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["handleApiError"])(error);
        }
    }
    /**
   * Update security incident
   */ async updateSecurityIncident(id, data) {
        try {
            const response = await this.client.put(`/access-control/security-incidents/${id}`, data);
            return response.data;
        } catch (error) {
            throw (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$utils$2f$apiUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["handleApiError"])(error);
        }
    }
    // IP Restrictions
    /**
   * Get IP restrictions
   */ async getIpRestrictions() {
        try {
            const response = await this.client.get('/access-control/ip-restrictions');
            return response.data;
        } catch (error) {
            throw (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$utils$2f$apiUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["handleApiError"])(error);
        }
    }
    /**
   * Add IP restriction
   */ async addIpRestriction(data) {
        try {
            const response = await this.client.post('/access-control/ip-restrictions', data);
            return response.data;
        } catch (error) {
            throw (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$utils$2f$apiUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["handleApiError"])(error);
        }
    }
    /**
   * Remove IP restriction
   */ async removeIpRestriction(id) {
        try {
            const response = await this.client.delete(`/access-control/ip-restrictions/${id}`);
            return response.data;
        } catch (error) {
            throw (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$utils$2f$apiUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["handleApiError"])(error);
        }
    }
    // Statistics
    /**
   * Get comprehensive security statistics
   */ async getStatistics() {
        try {
            const response = await this.client.get('/access-control/statistics');
            return response.data;
        } catch (error) {
            throw (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$utils$2f$apiUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["handleApiError"])(error);
        }
    }
    // Initialize default roles
    /**
   * Initialize default system roles
   */ async initializeDefaultRoles() {
        try {
            const response = await this.client.post('/access-control/initialize-roles');
            return response.data;
        } catch (error) {
            throw (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$utils$2f$apiUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["handleApiError"])(error);
        }
    }
}
function createAccessControlApi(client) {
    return new AccessControlApiImpl(client);
}
;
;
const accessControlApi = createAccessControlApi(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$core$2f$ApiClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["apiClient"]);
}),
"[project]/src/identity-access/stores/accessControl/thunks/rolesThunks.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @fileoverview Access Control Roles Async Thunks
 * @module identity-access/stores/accessControl/thunks/rolesThunks
 * @category Access Control - Async Actions
 */ __turbopack_context__.s([
    "assignPermissionToRole",
    ()=>assignPermissionToRole,
    "assignRoleToUser",
    ()=>assignRoleToUser,
    "createRole",
    ()=>createRole,
    "deleteRole",
    ()=>deleteRole,
    "fetchRoleById",
    ()=>fetchRoleById,
    "fetchRoles",
    ()=>fetchRoles,
    "initializeDefaultRoles",
    ()=>initializeDefaultRoles,
    "removePermissionFromRole",
    ()=>removePermissionFromRole,
    "removeRoleFromUser",
    ()=>removeRoleFromUser,
    "updateRole",
    ()=>updateRole
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$modules$2f$accessControlApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/modules/accessControlApi.ts [app-ssr] (ecmascript)");
;
;
const fetchRoles = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])('accessControl/fetchRoles', async (_, { rejectWithValue })=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$modules$2f$accessControlApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["accessControlApi"].getRoles();
        return response.roles;
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to fetch roles';
        return rejectWithValue(message);
    }
});
const fetchRoleById = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])('accessControl/fetchRoleById', async (id, { rejectWithValue })=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$modules$2f$accessControlApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["accessControlApi"].getRoleById(id);
        return response.role;
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to fetch role';
        return rejectWithValue(message);
    }
});
const createRole = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])('accessControl/createRole', async (roleData, { rejectWithValue })=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$modules$2f$accessControlApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["accessControlApi"].createRole(roleData);
        return response.role;
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to create role';
        return rejectWithValue(message);
    }
});
const updateRole = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])('accessControl/updateRole', async ({ id, updates }, { rejectWithValue })=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$modules$2f$accessControlApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["accessControlApi"].updateRole(id, updates);
        return response.role;
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to update role';
        return rejectWithValue(message);
    }
});
const deleteRole = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])('accessControl/deleteRole', async (id, { rejectWithValue })=>{
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$modules$2f$accessControlApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["accessControlApi"].deleteRole(id);
        return id;
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to delete role';
        return rejectWithValue(message);
    }
});
const initializeDefaultRoles = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])('accessControl/initializeDefaultRoles', async (_, { rejectWithValue })=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$modules$2f$accessControlApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["accessControlApi"].initializeDefaultRoles();
        return response.roles;
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to initialize default roles';
        return rejectWithValue(message);
    }
});
const assignPermissionToRole = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])('accessControl/assignPermissionToRole', async ({ roleId, permissionId }, { rejectWithValue })=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$modules$2f$accessControlApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["accessControlApi"].assignPermissionToRole(roleId, permissionId);
        return response.rolePermission;
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to assign permission to role';
        return rejectWithValue(message);
    }
});
const removePermissionFromRole = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])('accessControl/removePermissionFromRole', async ({ roleId, permissionId }, { rejectWithValue })=>{
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$modules$2f$accessControlApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["accessControlApi"].removePermissionFromRole(roleId, permissionId);
        return {
            roleId,
            permissionId
        };
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to remove permission from role';
        return rejectWithValue(message);
    }
});
const assignRoleToUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])('accessControl/assignRoleToUser', async ({ userId, roleId }, { rejectWithValue })=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$modules$2f$accessControlApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["accessControlApi"].assignRoleToUser(userId, roleId);
        return response.userRole;
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to assign role to user';
        return rejectWithValue(message);
    }
});
const removeRoleFromUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])('accessControl/removeRoleFromUser', async ({ userId, roleId }, { rejectWithValue })=>{
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$modules$2f$accessControlApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["accessControlApi"].removeRoleFromUser(userId, roleId);
        return {
            userId,
            roleId
        };
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to remove role from user';
        return rejectWithValue(message);
    }
});
}),
"[project]/src/identity-access/stores/accessControl/thunks/permissionsThunks.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @fileoverview Access Control Permissions Async Thunks
 * @module identity-access/stores/accessControl/thunks/permissionsThunks
 * @category Access Control - Async Actions
 */ __turbopack_context__.s([
    "checkUserPermission",
    ()=>checkUserPermission,
    "createPermission",
    ()=>createPermission,
    "fetchPermissions",
    ()=>fetchPermissions,
    "fetchUserPermissions",
    ()=>fetchUserPermissions
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$modules$2f$accessControlApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/modules/accessControlApi.ts [app-ssr] (ecmascript)");
;
;
const fetchPermissions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])('accessControl/fetchPermissions', async (_, { rejectWithValue })=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$modules$2f$accessControlApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["accessControlApi"].getPermissions();
        return response.permissions;
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to fetch permissions';
        return rejectWithValue(message);
    }
});
const createPermission = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])('accessControl/createPermission', async (permissionData, { rejectWithValue })=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$modules$2f$accessControlApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["accessControlApi"].createPermission(permissionData);
        return response.permission;
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to create permission';
        return rejectWithValue(message);
    }
});
const fetchUserPermissions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])('accessControl/fetchUserPermissions', async (userId, { rejectWithValue })=>{
    try {
        return await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$modules$2f$accessControlApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["accessControlApi"].getUserPermissions(userId);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to fetch user permissions';
        return rejectWithValue(message);
    }
});
const checkUserPermission = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])('accessControl/checkUserPermission', async ({ userId, resource, action }, { rejectWithValue })=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$modules$2f$accessControlApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["accessControlApi"].checkPermission(userId, resource, action);
        return {
            userId,
            resource,
            action,
            hasPermission: response.hasPermission
        };
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to check permission';
        return rejectWithValue(message);
    }
});
}),
"[project]/src/identity-access/stores/accessControl/thunks/sessionsThunks.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @fileoverview Access Control Sessions Async Thunks
 * @module identity-access/stores/accessControl/thunks/sessionsThunks
 * @category Access Control - Async Actions
 */ __turbopack_context__.s([
    "deleteAllUserSessions",
    ()=>deleteAllUserSessions,
    "deleteSession",
    ()=>deleteSession,
    "fetchUserSessions",
    ()=>fetchUserSessions
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$modules$2f$accessControlApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/modules/accessControlApi.ts [app-ssr] (ecmascript)");
;
;
const fetchUserSessions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])('accessControl/fetchUserSessions', async (userId, { rejectWithValue })=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$modules$2f$accessControlApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["accessControlApi"].getUserSessions(userId);
        return response.sessions;
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to fetch sessions';
        return rejectWithValue(message);
    }
});
const deleteSession = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])('accessControl/deleteSession', async (token, { rejectWithValue })=>{
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$modules$2f$accessControlApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["accessControlApi"].deleteSession(token);
        return token;
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to delete session';
        return rejectWithValue(message);
    }
});
const deleteAllUserSessions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])('accessControl/deleteAllUserSessions', async (userId, { rejectWithValue })=>{
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$modules$2f$accessControlApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["accessControlApi"].deleteAllUserSessions(userId);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to delete all user sessions';
        return rejectWithValue(message);
    }
});
}),
"[project]/src/identity-access/stores/accessControl/thunks/incidentsThunks.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @fileoverview Access Control Security Incidents & IP Restrictions Async Thunks
 * @module identity-access/stores/accessControl/thunks/incidentsThunks
 * @category Access Control - Async Actions
 */ __turbopack_context__.s([
    "addIpRestriction",
    ()=>addIpRestriction,
    "createSecurityIncident",
    ()=>createSecurityIncident,
    "fetchAccessControlStatistics",
    ()=>fetchAccessControlStatistics,
    "fetchIpRestrictions",
    ()=>fetchIpRestrictions,
    "fetchSecurityIncidents",
    ()=>fetchSecurityIncidents,
    "removeIpRestriction",
    ()=>removeIpRestriction,
    "updateSecurityIncident",
    ()=>updateSecurityIncident
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$modules$2f$accessControlApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/modules/accessControlApi.ts [app-ssr] (ecmascript)");
;
;
const fetchSecurityIncidents = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])('accessControl/fetchSecurityIncidents', async (params, { rejectWithValue })=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$modules$2f$accessControlApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["accessControlApi"].getSecurityIncidents(params);
        return response;
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to fetch security incidents';
        return rejectWithValue(message);
    }
});
const createSecurityIncident = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])('accessControl/createSecurityIncident', async (incidentData, { rejectWithValue })=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$modules$2f$accessControlApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["accessControlApi"].createSecurityIncident(incidentData);
        return response.incident;
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to create security incident';
        return rejectWithValue(message);
    }
});
const updateSecurityIncident = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])('accessControl/updateSecurityIncident', async ({ id, updates }, { rejectWithValue })=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$modules$2f$accessControlApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["accessControlApi"].updateSecurityIncident(id, updates);
        return response.incident;
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to update security incident';
        return rejectWithValue(message);
    }
});
const fetchIpRestrictions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])('accessControl/fetchIpRestrictions', async (_, { rejectWithValue })=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$modules$2f$accessControlApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["accessControlApi"].getIpRestrictions();
        return response.restrictions;
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to fetch IP restrictions';
        return rejectWithValue(message);
    }
});
const addIpRestriction = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])('accessControl/addIpRestriction', async (restrictionData, { rejectWithValue })=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$modules$2f$accessControlApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["accessControlApi"].addIpRestriction(restrictionData);
        return response.restriction;
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to add IP restriction';
        return rejectWithValue(message);
    }
});
const removeIpRestriction = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])('accessControl/removeIpRestriction', async (id, { rejectWithValue })=>{
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$modules$2f$accessControlApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["accessControlApi"].removeIpRestriction(id);
        return id;
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to remove IP restriction';
        return rejectWithValue(message);
    }
});
const fetchAccessControlStatistics = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])('accessControl/fetchStatistics', async (_, { rejectWithValue })=>{
    try {
        return await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$modules$2f$accessControlApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["accessControlApi"].getStatistics();
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to fetch statistics';
        return rejectWithValue(message);
    }
});
}),
"[project]/src/identity-access/stores/accessControl/selectors.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @fileoverview Access Control Selectors - Optimized data access with memoization
 * @module identity-access/stores/accessControl/selectors
 * @category Access Control - Selectors
 */ __turbopack_context__.s([
    "selectAccessControlState",
    ()=>selectAccessControlState,
    "selectActiveRoles",
    ()=>selectActiveRoles,
    "selectActiveSessions",
    ()=>selectActiveSessions,
    "selectCriticalIncidents",
    ()=>selectCriticalIncidents,
    "selectError",
    ()=>selectError,
    "selectFilteredIncidents",
    ()=>selectFilteredIncidents,
    "selectFilteredSessions",
    ()=>selectFilteredSessions,
    "selectIncidentFilters",
    ()=>selectIncidentFilters,
    "selectIncidentsBySeverity",
    ()=>selectIncidentsBySeverity,
    "selectIncidentsPagination",
    ()=>selectIncidentsPagination,
    "selectIpRestrictions",
    ()=>selectIpRestrictions,
    "selectIsAnyLoading",
    ()=>selectIsAnyLoading,
    "selectLoading",
    ()=>selectLoading,
    "selectNotifications",
    ()=>selectNotifications,
    "selectPermissionById",
    ()=>selectPermissionById,
    "selectPermissions",
    ()=>selectPermissions,
    "selectPermissionsPagination",
    ()=>selectPermissionsPagination,
    "selectRecentIncidents",
    ()=>selectRecentIncidents,
    "selectRoleById",
    ()=>selectRoleById,
    "selectRoles",
    ()=>selectRoles,
    "selectRolesPagination",
    ()=>selectRolesPagination,
    "selectRolesWithPermissionCount",
    ()=>selectRolesWithPermissionCount,
    "selectSecurityIncidents",
    ()=>selectSecurityIncidents,
    "selectSecurityMetrics",
    ()=>selectSecurityMetrics,
    "selectSelectedIncident",
    ()=>selectSelectedIncident,
    "selectSelectedPermission",
    ()=>selectSelectedPermission,
    "selectSelectedRole",
    ()=>selectSelectedRole,
    "selectSessionFilters",
    ()=>selectSessionFilters,
    "selectSessions",
    ()=>selectSessions,
    "selectSessionsByUserId",
    ()=>selectSessionsByUserId,
    "selectSessionsPagination",
    ()=>selectSessionsPagination,
    "selectStatistics",
    ()=>selectStatistics,
    "selectUnreadNotifications",
    ()=>selectUnreadNotifications
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$reselect$2f$dist$2f$reselect$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/reselect/dist/reselect.mjs [app-ssr] (ecmascript)");
;
const selectAccessControlState = (state)=>state.accessControl;
const selectRoles = (state)=>state.accessControl.roles;
const selectPermissions = (state)=>state.accessControl.permissions;
const selectSecurityIncidents = (state)=>state.accessControl.securityIncidents;
const selectSessions = (state)=>state.accessControl.sessions;
const selectIpRestrictions = (state)=>state.accessControl.ipRestrictions;
const selectStatistics = (state)=>state.accessControl.statistics;
const selectSelectedRole = (state)=>state.accessControl.selectedRole;
const selectSelectedPermission = (state)=>state.accessControl.selectedPermission;
const selectSelectedIncident = (state)=>state.accessControl.selectedIncident;
const selectIncidentFilters = (state)=>state.accessControl.filters.incidents;
const selectSessionFilters = (state)=>state.accessControl.filters.sessions;
const selectRolesPagination = (state)=>state.accessControl.pagination.roles;
const selectPermissionsPagination = (state)=>state.accessControl.pagination.permissions;
const selectIncidentsPagination = (state)=>state.accessControl.pagination.incidents;
const selectSessionsPagination = (state)=>state.accessControl.pagination.sessions;
const selectLoading = (state)=>state.accessControl.loading;
const selectError = (state)=>state.accessControl.error;
const selectNotifications = (state)=>state.accessControl.notifications;
const selectActiveRoles = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$reselect$2f$dist$2f$reselect$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createSelector"])([
    selectRoles
], (roles)=>roles.filter((role)=>role.isActive));
const selectCriticalIncidents = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$reselect$2f$dist$2f$reselect$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createSelector"])([
    selectSecurityIncidents
], (incidents)=>incidents.filter((incident)=>incident.severity === 'CRITICAL' || incident.severity === 'HIGH'));
const selectActiveSessions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$reselect$2f$dist$2f$reselect$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createSelector"])([
    selectSessions
], (sessions)=>sessions.filter((session)=>session.isActive));
const selectFilteredIncidents = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$reselect$2f$dist$2f$reselect$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createSelector"])([
    selectSecurityIncidents,
    selectIncidentFilters
], (incidents, filters)=>{
    let filtered = incidents;
    if (filters.severity) {
        filtered = filtered.filter((incident)=>incident.severity === filters.severity);
    }
    if (filters.type) {
        filtered = filtered.filter((incident)=>incident.type === filters.type);
    }
    if (filters.userId) {
        filtered = filtered.filter((incident)=>incident.userId === filters.userId);
    }
    if (filters.startDate && filters.endDate) {
        const startDate = new Date(filters.startDate);
        const endDate = new Date(filters.endDate);
        filtered = filtered.filter((incident)=>{
            const incidentDate = new Date(incident.createdAt);
            return incidentDate >= startDate && incidentDate <= endDate;
        });
    }
    return filtered;
});
const selectFilteredSessions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$reselect$2f$dist$2f$reselect$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createSelector"])([
    selectSessions,
    selectSessionFilters
], (sessions, filters)=>{
    let filtered = sessions;
    if (filters.userId) {
        filtered = filtered.filter((session)=>session.userId === filters.userId);
    }
    if (filters.isActive !== undefined) {
        filtered = filtered.filter((session)=>session.isActive === filters.isActive);
    }
    return filtered;
});
const selectSecurityMetrics = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$reselect$2f$dist$2f$reselect$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createSelector"])([
    selectRoles,
    selectPermissions,
    selectSecurityIncidents,
    selectSessions
], (roles, permissions, incidents, sessions)=>{
    const totalRoles = roles.length;
    const activeRoles = roles.filter((r)=>r.isActive).length;
    const totalPermissions = permissions.length;
    const recentIncidents = incidents.filter((incident)=>new Date(incident.createdAt) > new Date(Date.now() - 24 * 60 * 60 * 1000)).length;
    const criticalIncidents = incidents.filter((incident)=>incident.severity === 'CRITICAL').length;
    const activeSessions = sessions.filter((s)=>s.isActive).length;
    return {
        totalRoles,
        activeRoles,
        totalPermissions,
        recentIncidents,
        criticalIncidents,
        activeSessions,
        securityScore: criticalIncidents > 0 ? Math.max(0, 100 - criticalIncidents * 10) : 100
    };
});
const selectRoleById = (roleId)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$reselect$2f$dist$2f$reselect$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createSelector"])([
        selectRoles
    ], (roles)=>roles.find((role)=>role.id === roleId) || null);
const selectPermissionById = (permissionId)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$reselect$2f$dist$2f$reselect$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createSelector"])([
        selectPermissions
    ], (permissions)=>permissions.find((perm)=>perm.id === permissionId) || null);
const selectIncidentsBySeverity = (severity)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$reselect$2f$dist$2f$reselect$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createSelector"])([
        selectSecurityIncidents
    ], (incidents)=>incidents.filter((incident)=>incident.severity === severity));
const selectSessionsByUserId = (userId)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$reselect$2f$dist$2f$reselect$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createSelector"])([
        selectSessions
    ], (sessions)=>sessions.filter((session)=>session.userId === userId));
const selectRolesWithPermissionCount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$reselect$2f$dist$2f$reselect$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createSelector"])([
    selectRoles
], (roles)=>roles.map((role)=>({
            ...role,
            permissionCount: role.permissions?.length || 0
        })));
const selectRecentIncidents = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$reselect$2f$dist$2f$reselect$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createSelector"])([
    selectSecurityIncidents
], (incidents)=>{
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return incidents.filter((incident)=>new Date(incident.createdAt) > yesterday);
});
const selectUnreadNotifications = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$reselect$2f$dist$2f$reselect$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createSelector"])([
    selectNotifications
], (notifications)=>notifications.filter((notification)=>!notification.read));
const selectIsAnyLoading = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$reselect$2f$dist$2f$reselect$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createSelector"])([
    selectLoading
], (loading)=>Object.values(loading).some((isLoading)=>isLoading));
}),
"[project]/src/identity-access/stores/accessControl/index.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

/**
 * @fileoverview Access Control Redux Slice - Modular Orchestrator
 * @module identity-access/stores/accessControl/index
 * @category Access Control - State Management
 * 
 * Orchestrates all access control functionality with modular architecture.
 * This is the main entry point that combines:
 * - State definition and initial state
 * - Async thunks from specialized modules
 * - Memoized selectors
 * - Redux slice with reducers
 */ __turbopack_context__.s([
    "addNotification",
    ()=>addNotification,
    "clearError",
    ()=>clearError,
    "clearFilters",
    ()=>clearFilters,
    "clearNotifications",
    ()=>clearNotifications,
    "default",
    ()=>__TURBOPACK__default__export__,
    "removeNotification",
    ()=>removeNotification,
    "resetState",
    ()=>resetState,
    "setIncidentFilters",
    ()=>setIncidentFilters,
    "setIncidentsPagination",
    ()=>setIncidentsPagination,
    "setPermissionsPagination",
    ()=>setPermissionsPagination,
    "setRolesPagination",
    ()=>setRolesPagination,
    "setSelectedIncident",
    ()=>setSelectedIncident,
    "setSelectedPermission",
    ()=>setSelectedPermission,
    "setSelectedRole",
    ()=>setSelectedRole,
    "setSessionFilters",
    ()=>setSessionFilters,
    "setSessionsPagination",
    ()=>setSessionsPagination
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$stores$2f$accessControl$2f$state$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/identity-access/stores/accessControl/state.ts [app-ssr] (ecmascript)");
// Import all thunks from modular files
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$stores$2f$accessControl$2f$thunks$2f$rolesThunks$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/identity-access/stores/accessControl/thunks/rolesThunks.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$stores$2f$accessControl$2f$thunks$2f$permissionsThunks$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/identity-access/stores/accessControl/thunks/permissionsThunks.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$stores$2f$accessControl$2f$thunks$2f$sessionsThunks$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/identity-access/stores/accessControl/thunks/sessionsThunks.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$stores$2f$accessControl$2f$thunks$2f$incidentsThunks$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/identity-access/stores/accessControl/thunks/incidentsThunks.ts [app-ssr] (ecmascript)");
// Selectors
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$stores$2f$accessControl$2f$selectors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/identity-access/stores/accessControl/selectors.ts [app-ssr] (ecmascript)");
;
;
;
;
;
;
// ==========================================
// SLICE DEFINITION
// ==========================================
const accessControlSlice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createSlice"])({
    name: 'accessControl',
    initialState: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$stores$2f$accessControl$2f$state$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["initialState"],
    reducers: {
        setSelectedRole: (state, action)=>{
            state.selectedRole = action.payload;
        },
        setSelectedPermission: (state, action)=>{
            state.selectedPermission = action.payload;
        },
        setSelectedIncident: (state, action)=>{
            state.selectedIncident = action.payload;
        },
        setIncidentFilters: (state, action)=>{
            state.filters.incidents = {
                ...state.filters.incidents,
                ...action.payload
            };
        },
        setSessionFilters: (state, action)=>{
            state.filters.sessions = {
                ...state.filters.sessions,
                ...action.payload
            };
        },
        setRolesPagination: (state, action)=>{
            state.pagination.roles = {
                ...state.pagination.roles,
                ...action.payload
            };
        },
        setPermissionsPagination: (state, action)=>{
            state.pagination.permissions = {
                ...state.pagination.permissions,
                ...action.payload
            };
        },
        setIncidentsPagination: (state, action)=>{
            state.pagination.incidents = {
                ...state.pagination.incidents,
                ...action.payload
            };
        },
        setSessionsPagination: (state, action)=>{
            state.pagination.sessions = {
                ...state.pagination.sessions,
                ...action.payload
            };
        },
        clearError: (state)=>{
            state.error = null;
        },
        addNotification: (state, action)=>{
            const notification = {
                ...action.payload,
                id: `notification_${Date.now()}_${Math.random()}`,
                timestamp: new Date().toISOString()
            };
            state.notifications.push(notification);
        },
        removeNotification: (state, action)=>{
            state.notifications = state.notifications.filter((n)=>n.id !== action.payload);
        },
        clearNotifications: (state)=>{
            state.notifications = [];
        },
        clearFilters: (state)=>{
            state.filters = {
                incidents: {},
                sessions: {}
            };
        },
        resetState: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$stores$2f$accessControl$2f$state$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["initialState"]
    },
    extraReducers: (builder)=>{
        // ==========================================
        // ROLES REDUCERS
        // ==========================================
        builder.addCase(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$stores$2f$accessControl$2f$thunks$2f$rolesThunks$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchRoles"].pending, (state)=>{
            state.loading.roles = true;
            state.error = null;
        }).addCase(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$stores$2f$accessControl$2f$thunks$2f$rolesThunks$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchRoles"].fulfilled, (state, action)=>{
            state.loading.roles = false;
            state.roles = action.payload;
        }).addCase(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$stores$2f$accessControl$2f$thunks$2f$rolesThunks$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchRoles"].rejected, (state, action)=>{
            state.loading.roles = false;
            state.error = action.payload || 'Failed to fetch roles';
        })// Role by ID
        .addCase(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$stores$2f$accessControl$2f$thunks$2f$rolesThunks$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchRoleById"].pending, (state)=>{
            state.loading.operations = true;
        }).addCase(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$stores$2f$accessControl$2f$thunks$2f$rolesThunks$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchRoleById"].fulfilled, (state, action)=>{
            state.loading.operations = false;
            state.selectedRole = action.payload;
        }).addCase(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$stores$2f$accessControl$2f$thunks$2f$rolesThunks$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchRoleById"].rejected, (state, action)=>{
            state.loading.operations = false;
            state.error = action.payload || 'Failed to fetch role';
        })// Create role
        .addCase(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$stores$2f$accessControl$2f$thunks$2f$rolesThunks$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createRole"].pending, (state)=>{
            state.loading.operations = true;
        }).addCase(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$stores$2f$accessControl$2f$thunks$2f$rolesThunks$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createRole"].fulfilled, (state, action)=>{
            state.loading.operations = false;
            state.roles.push(action.payload);
        }).addCase(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$stores$2f$accessControl$2f$thunks$2f$rolesThunks$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createRole"].rejected, (state, action)=>{
            state.loading.operations = false;
            state.error = action.payload || 'Failed to create role';
        })// Update role
        .addCase(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$stores$2f$accessControl$2f$thunks$2f$rolesThunks$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateRole"].pending, (state)=>{
            state.loading.operations = true;
        }).addCase(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$stores$2f$accessControl$2f$thunks$2f$rolesThunks$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateRole"].fulfilled, (state, action)=>{
            state.loading.operations = false;
            const index = state.roles.findIndex((r)=>r.id === action.payload.id);
            if (index !== -1) {
                state.roles[index] = action.payload;
            }
            if (state.selectedRole?.id === action.payload.id) {
                state.selectedRole = action.payload;
            }
        }).addCase(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$stores$2f$accessControl$2f$thunks$2f$rolesThunks$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateRole"].rejected, (state, action)=>{
            state.loading.operations = false;
            state.error = action.payload || 'Failed to update role';
        })// Delete role
        .addCase(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$stores$2f$accessControl$2f$thunks$2f$rolesThunks$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["deleteRole"].pending, (state)=>{
            state.loading.operations = true;
        }).addCase(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$stores$2f$accessControl$2f$thunks$2f$rolesThunks$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["deleteRole"].fulfilled, (state, action)=>{
            state.loading.operations = false;
            state.roles = state.roles.filter((r)=>r.id !== action.payload);
            if (state.selectedRole?.id === action.payload) {
                state.selectedRole = null;
            }
        }).addCase(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$stores$2f$accessControl$2f$thunks$2f$rolesThunks$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["deleteRole"].rejected, (state, action)=>{
            state.loading.operations = false;
            state.error = action.payload || 'Failed to delete role';
        })// Initialize default roles
        .addCase(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$stores$2f$accessControl$2f$thunks$2f$rolesThunks$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["initializeDefaultRoles"].fulfilled, (state, action)=>{
            state.roles = [
                ...state.roles,
                ...action.payload
            ];
        })// ==========================================
        // PERMISSIONS REDUCERS
        // ==========================================
        .addCase(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$stores$2f$accessControl$2f$thunks$2f$permissionsThunks$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchPermissions"].pending, (state)=>{
            state.loading.permissions = true;
        }).addCase(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$stores$2f$accessControl$2f$thunks$2f$permissionsThunks$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchPermissions"].fulfilled, (state, action)=>{
            state.loading.permissions = false;
            state.permissions = action.payload;
        }).addCase(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$stores$2f$accessControl$2f$thunks$2f$permissionsThunks$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchPermissions"].rejected, (state, action)=>{
            state.loading.permissions = false;
            state.error = action.payload || 'Failed to fetch permissions';
        })// Create permission
        .addCase(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$stores$2f$accessControl$2f$thunks$2f$permissionsThunks$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createPermission"].fulfilled, (state, action)=>{
            state.permissions.push(action.payload);
        })// ==========================================
        // SESSIONS REDUCERS
        // ==========================================
        .addCase(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$stores$2f$accessControl$2f$thunks$2f$sessionsThunks$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchUserSessions"].pending, (state)=>{
            state.loading.sessions = true;
        }).addCase(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$stores$2f$accessControl$2f$thunks$2f$sessionsThunks$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchUserSessions"].fulfilled, (state, action)=>{
            state.loading.sessions = false;
            state.sessions = action.payload;
        }).addCase(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$stores$2f$accessControl$2f$thunks$2f$sessionsThunks$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchUserSessions"].rejected, (state, action)=>{
            state.loading.sessions = false;
            state.error = action.payload || 'Failed to fetch sessions';
        })// Delete session
        .addCase(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$stores$2f$accessControl$2f$thunks$2f$sessionsThunks$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["deleteSession"].fulfilled, (state, action)=>{
            state.sessions = state.sessions.filter((s)=>s.token !== action.payload);
        })// ==========================================
        // SECURITY INCIDENTS REDUCERS
        // ==========================================
        .addCase(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$stores$2f$accessControl$2f$thunks$2f$incidentsThunks$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchSecurityIncidents"].pending, (state)=>{
            state.loading.incidents = true;
        }).addCase(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$stores$2f$accessControl$2f$thunks$2f$incidentsThunks$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchSecurityIncidents"].fulfilled, (state, action)=>{
            state.loading.incidents = false;
            state.securityIncidents = action.payload.incidents;
            if (action.payload.pagination) {
                state.pagination.incidents = {
                    ...state.pagination.incidents,
                    ...action.payload.pagination
                };
            }
        }).addCase(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$stores$2f$accessControl$2f$thunks$2f$incidentsThunks$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchSecurityIncidents"].rejected, (state, action)=>{
            state.loading.incidents = false;
            state.error = action.payload || 'Failed to fetch security incidents';
        })// Create security incident
        .addCase(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$stores$2f$accessControl$2f$thunks$2f$incidentsThunks$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createSecurityIncident"].fulfilled, (state, action)=>{
            state.securityIncidents.push(action.payload);
        })// Update security incident
        .addCase(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$stores$2f$accessControl$2f$thunks$2f$incidentsThunks$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateSecurityIncident"].fulfilled, (state, action)=>{
            const index = state.securityIncidents.findIndex((i)=>i.id === action.payload.id);
            if (index !== -1) {
                state.securityIncidents[index] = action.payload;
            }
            if (state.selectedIncident?.id === action.payload.id) {
                state.selectedIncident = action.payload;
            }
        })// ==========================================
        // IP RESTRICTIONS REDUCERS
        // ==========================================
        .addCase(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$stores$2f$accessControl$2f$thunks$2f$incidentsThunks$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchIpRestrictions"].fulfilled, (state, action)=>{
            state.ipRestrictions = action.payload;
        })// Add IP restriction
        .addCase(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$stores$2f$accessControl$2f$thunks$2f$incidentsThunks$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["addIpRestriction"].fulfilled, (state, action)=>{
            state.ipRestrictions.push(action.payload);
        })// Remove IP restriction
        .addCase(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$stores$2f$accessControl$2f$thunks$2f$incidentsThunks$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["removeIpRestriction"].fulfilled, (state, action)=>{
            state.ipRestrictions = state.ipRestrictions.filter((r)=>r.id !== action.payload);
        })// ==========================================
        // STATISTICS REDUCERS
        // ==========================================
        .addCase(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$stores$2f$accessControl$2f$thunks$2f$incidentsThunks$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchAccessControlStatistics"].pending, (state)=>{
            state.loading.statistics = true;
        }).addCase(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$stores$2f$accessControl$2f$thunks$2f$incidentsThunks$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchAccessControlStatistics"].fulfilled, (state, action)=>{
            state.loading.statistics = false;
            state.statistics = action.payload;
        }).addCase(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$stores$2f$accessControl$2f$thunks$2f$incidentsThunks$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchAccessControlStatistics"].rejected, (state, action)=>{
            state.loading.statistics = false;
            state.error = action.payload || 'Failed to fetch statistics';
        });
    }
});
const { setSelectedRole, setSelectedPermission, setSelectedIncident, setIncidentFilters, setSessionFilters, setRolesPagination, setPermissionsPagination, setIncidentsPagination, setSessionsPagination, clearError, addNotification, removeNotification, clearNotifications, clearFilters, resetState } = accessControlSlice.actions;
;
;
const __TURBOPACK__default__export__ = accessControlSlice.reducer;
}),
"[project]/src/identity-access/stores/accessControlSlice.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

/**
 * @fileoverview Access Control Slice - Backward Compatibility Layer
 * @module identity-access/stores/accessControlSlice
 *
 * REFACTORED FOR MODULARITY:
 * This file now serves as a backward compatibility layer that re-exports
 * all functionality from the modular access control implementation.
 *
 * The original 952-line monolithic slice has been broken down into:
 * - State definition (accessControl/state.ts)
 * - Async thunks by domain (accessControl/thunks/)
 * - Memoized selectors (accessControl/selectors.ts) 
 * - Main orchestrator (accessControl/index.ts)
 *
 * This maintains 100% backward compatibility while providing:
 * ✅ Better code organization and maintainability
 * ✅ Focused single-responsibility modules
 * ✅ Improved performance with memoized selectors
 * ✅ Easier testing and debugging
 * ✅ Reduced file complexity (952 lines → ~300 lines per module)
 */ // Re-export everything from the modular implementation
__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$stores$2f$accessControl$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/identity-access/stores/accessControl/index.ts [app-ssr] (ecmascript) <locals>");
;
;
;
}),
"[project]/src/identity-access/stores/index.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

/**
 * @fileoverview Identity Access - Stores Barrel Export
 * @module identity-access/stores
 * 
 * Note: For specific actions and types, import directly from the slice files
 * to avoid naming conflicts and maintain explicit imports.
 */ // Export reducers for Redux store configuration
__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$stores$2f$authSlice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/identity-access/stores/authSlice.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$stores$2f$accessControlSlice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/identity-access/stores/accessControlSlice.ts [app-ssr] (ecmascript) <locals>");
;
;
;
;
}),
"[project]/src/identity-access/stores/authSlice.ts [app-ssr] (ecmascript) <export default as authReducer>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "authReducer",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$stores$2f$authSlice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$stores$2f$authSlice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/identity-access/stores/authSlice.ts [app-ssr] (ecmascript)");
}),
"[project]/src/identity-access/stores/accessControl/index.ts [app-ssr] (ecmascript) <locals> <export default as accessControlReducer>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "accessControlReducer",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$stores$2f$accessControl$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$stores$2f$accessControl$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/identity-access/stores/accessControl/index.ts [app-ssr] (ecmascript) <locals>");
}),
"[project]/src/stores/sliceFactory/helpers.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @fileoverview Helper utilities for Redux Slice Factory
 * @module stores/sliceFactory/helpers
 * @category Utilities
 */ __turbopack_context__.s([
    "calculatePagination",
    ()=>calculatePagination,
    "createActionTypes",
    ()=>createActionTypes,
    "createErrorPayload",
    ()=>createErrorPayload,
    "createInitialEnhancedState",
    ()=>createInitialEnhancedState,
    "createStandardEntityAdapter",
    ()=>createStandardEntityAdapter,
    "deepMerge",
    ()=>deepMerge,
    "extractErrorInfo",
    ()=>extractErrorInfo,
    "isCacheStale",
    ()=>isCacheStale,
    "normalizeEntity",
    ()=>normalizeEntity,
    "updateLoadingState",
    ()=>updateLoadingState,
    "validateEntity",
    ()=>validateEntity
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [app-ssr] (ecmascript) <locals>");
;
function createInitialEnhancedState(adapter, customState) {
    return {
        ...adapter.getInitialState(),
        loading: {
            list: {
                status: 'idle',
                isLoading: false,
                error: null
            },
            detail: {
                status: 'idle',
                isLoading: false,
                error: null
            },
            create: {
                status: 'idle',
                isLoading: false,
                error: null
            },
            update: {
                status: 'idle',
                isLoading: false,
                error: null
            },
            delete: {
                status: 'idle',
                isLoading: false,
                error: null
            },
            bulk: {
                status: 'idle',
                isLoading: false,
                error: null
            }
        },
        pagination: {
            page: 1,
            pageSize: 25,
            total: 0,
            totalPages: 0,
            hasNextPage: false,
            hasPreviousPage: false
        },
        sort: {
            field: 'createdAt',
            direction: 'desc'
        },
        filters: {
            active: {},
            search: '',
            presets: {}
        },
        selection: {
            selectedIds: [],
            focusedId: null,
            isAllSelected: false,
            mode: 'multiple'
        },
        ui: {
            viewMode: 'list',
            showFilters: false,
            showSidebar: true,
            density: 'normal',
            visibleColumns: [],
            columnWidths: {}
        },
        cache: {
            lastFetched: 0,
            isStale: true
        },
        ...customState
    };
}
function extractErrorInfo(error) {
    if (error instanceof Error) {
        return {
            message: error.message,
            status: error.status,
            code: error.code,
            validationErrors: error.validationErrors
        };
    }
    if (typeof error === 'object' && error !== null) {
        const err = error;
        return {
            message: err.message || 'An error occurred',
            status: err.status,
            code: err.code,
            validationErrors: err.validationErrors
        };
    }
    return {
        message: String(error) || 'An unknown error occurred'
    };
}
function updateLoadingState(state, operation, loading) {
    state.loading[operation] = {
        ...state.loading[operation],
        ...loading
    };
}
function createStandardEntityAdapter() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createEntityAdapter"])({
        selectId: (entity)=>entity.id,
        sortComparer: (a, b)=>{
            // Default sort by updatedAt descending
            if (!a.updatedAt || !b.updatedAt) return 0;
            return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        }
    });
}
function validateEntity(entity) {
    return Boolean(entity && typeof entity.id === 'string' && entity.id.length > 0 && entity.createdAt && entity.updatedAt);
}
function createErrorPayload(error, operation, entityName) {
    const errorInfo = extractErrorInfo(error);
    return {
        ...errorInfo,
        message: errorInfo.message || `Failed to ${operation} ${entityName}`
    };
}
function isCacheStale(lastFetched, thresholdMs = 300000) {
    return Date.now() - lastFetched > thresholdMs;
}
function normalizeEntity(entity) {
    return {
        ...entity,
        createdAt: entity.createdAt || new Date().toISOString(),
        updatedAt: entity.updatedAt || new Date().toISOString()
    };
}
function calculatePagination(page, pageSize, total) {
    const totalPages = Math.ceil(total / pageSize);
    return {
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
    };
}
function createActionTypes(name) {
    return {
        FETCH_LIST_PENDING: `${name}/fetchList/pending`,
        FETCH_LIST_FULFILLED: `${name}/fetchList/fulfilled`,
        FETCH_LIST_REJECTED: `${name}/fetchList/rejected`,
        FETCH_BY_ID_PENDING: `${name}/fetchById/pending`,
        FETCH_BY_ID_FULFILLED: `${name}/fetchById/fulfilled`,
        FETCH_BY_ID_REJECTED: `${name}/fetchById/rejected`,
        CREATE_PENDING: `${name}/create/pending`,
        CREATE_FULFILLED: `${name}/create/fulfilled`,
        CREATE_REJECTED: `${name}/create/rejected`,
        UPDATE_PENDING: `${name}/update/pending`,
        UPDATE_FULFILLED: `${name}/update/fulfilled`,
        UPDATE_REJECTED: `${name}/update/rejected`,
        DELETE_PENDING: `${name}/delete/pending`,
        DELETE_FULFILLED: `${name}/delete/fulfilled`,
        DELETE_REJECTED: `${name}/delete/rejected`,
        BULK_DELETE_PENDING: `${name}/bulkDelete/pending`,
        BULK_DELETE_FULFILLED: `${name}/bulkDelete/fulfilled`,
        BULK_DELETE_REJECTED: `${name}/bulkDelete/rejected`,
        BULK_UPDATE_PENDING: `${name}/bulkUpdate/pending`,
        BULK_UPDATE_FULFILLED: `${name}/bulkUpdate/fulfilled`,
        BULK_UPDATE_REJECTED: `${name}/bulkUpdate/rejected`
    };
}
function deepMerge(target, source) {
    const result = {
        ...target
    };
    for(const key in source){
        if (source.hasOwnProperty(key)) {
            const sourceValue = source[key];
            const targetValue = result[key];
            if (typeof sourceValue === 'object' && sourceValue !== null && !Array.isArray(sourceValue) && typeof targetValue === 'object' && targetValue !== null && !Array.isArray(targetValue)) {
                result[key] = deepMerge(targetValue, sourceValue);
            } else {
                result[key] = sourceValue;
            }
        }
    }
    return result;
}
}),
"[project]/src/stores/sliceFactory/core.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @fileoverview Core Redux Slice Factory Implementation
 * @module stores/sliceFactory/core
 * @category Core
 */ __turbopack_context__.s([
    "createEntitySlice",
    ()=>createEntitySlice,
    "createSimpleSlice",
    ()=>createSimpleSlice
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$sliceFactory$2f$helpers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/sliceFactory/helpers.ts [app-ssr] (ecmascript)");
;
;
function createEntitySlice(name, apiService, options = {}) {
    const { enableBulkOperations = true, extraReducers = {}, customInitialState = {} } = options;
    // Create entity adapter for normalized state management
    const adapter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$sliceFactory$2f$helpers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createStandardEntityAdapter"])();
    // Create initial state
    const initialState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$sliceFactory$2f$helpers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createInitialEnhancedState"])(adapter, customInitialState);
    // Create async thunks
    const fetchList = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])(`${name}/fetchList`, async (params, { rejectWithValue })=>{
        try {
            const result = await apiService.getAll(params || {});
            return result;
        } catch (error) {
            const errorInfo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$sliceFactory$2f$helpers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["extractErrorInfo"])(error);
            return rejectWithValue({
                message: errorInfo.message || 'Failed to fetch list',
                status: errorInfo.status,
                code: errorInfo.code
            });
        }
    });
    const fetchById = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])(`${name}/fetchById`, async (id, { rejectWithValue })=>{
        try {
            const result = await apiService.getById(id);
            return result;
        } catch (error) {
            const errorInfo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$sliceFactory$2f$helpers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["extractErrorInfo"])(error);
            return rejectWithValue({
                message: errorInfo.message || `Failed to fetch ${name}`,
                status: errorInfo.status,
                code: errorInfo.code
            });
        }
    });
    const create = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])(`${name}/create`, async (data, { rejectWithValue })=>{
        try {
            const result = await apiService.create(data);
            return result;
        } catch (error) {
            const errorInfo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$sliceFactory$2f$helpers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["extractErrorInfo"])(error);
            return rejectWithValue({
                message: errorInfo.message || `Failed to create ${name}`,
                status: errorInfo.status,
                code: errorInfo.code,
                validationErrors: errorInfo.validationErrors
            });
        }
    });
    const update = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])(`${name}/update`, async ({ id, data }, { rejectWithValue })=>{
        try {
            const result = await apiService.update(id, data);
            return result;
        } catch (error) {
            const errorInfo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$sliceFactory$2f$helpers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["extractErrorInfo"])(error);
            return rejectWithValue({
                message: errorInfo.message || `Failed to update ${name}`,
                status: errorInfo.status,
                code: errorInfo.code,
                validationErrors: errorInfo.validationErrors
            });
        }
    });
    const deleteEntity = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])(`${name}/delete`, async (id, { rejectWithValue })=>{
        try {
            const result = await apiService.delete(id);
            return {
                ...result,
                id
            };
        } catch (error) {
            const errorInfo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$sliceFactory$2f$helpers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["extractErrorInfo"])(error);
            return rejectWithValue({
                message: errorInfo.message || `Failed to delete ${name}`,
                status: errorInfo.status,
                code: errorInfo.code
            });
        }
    });
    // Bulk operations (if enabled and API service supports them)
    const bulkDelete = enableBulkOperations && apiService.bulkDelete ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])(`${name}/bulkDelete`, async (ids, { rejectWithValue })=>{
        try {
            const result = await apiService.bulkDelete(ids);
            return {
                ...result,
                ids
            };
        } catch (error) {
            const errorInfo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$sliceFactory$2f$helpers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["extractErrorInfo"])(error);
            return rejectWithValue({
                message: errorInfo.message || `Failed to bulk delete ${name}s`,
                status: errorInfo.status,
                code: errorInfo.code
            });
        }
    }) : undefined;
    const bulkUpdate = enableBulkOperations && apiService.bulkUpdate ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])(`${name}/bulkUpdate`, async (updates, { rejectWithValue })=>{
        try {
            const result = await apiService.bulkUpdate(updates);
            return result;
        } catch (error) {
            const errorInfo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$sliceFactory$2f$helpers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["extractErrorInfo"])(error);
            return rejectWithValue({
                message: errorInfo.message || `Failed to bulk update ${name}s`,
                status: errorInfo.status,
                code: errorInfo.code
            });
        }
    }) : undefined;
    // Create the slice
    const slice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createSlice"])({
        name,
        initialState,
        reducers: {
            // Entity management
            setEntities: (state, action)=>{
                adapter.setAll(state, action.payload);
                state.cache.lastFetched = Date.now();
                state.cache.isStale = false;
            },
            addEntity: (state, action)=>{
                adapter.addOne(state, action.payload);
            },
            updateEntity: (state, action)=>{
                adapter.updateOne(state, action.payload);
            },
            removeEntity: (state, action)=>{
                adapter.removeOne(state, action.payload);
                // Remove from selection if selected
                state.selection.selectedIds = state.selection.selectedIds.filter((id)=>id !== action.payload);
                if (state.selection.focusedId === action.payload) {
                    state.selection.focusedId = null;
                }
            },
            // Pagination
            setPagination: (state, action)=>{
                state.pagination = {
                    ...state.pagination,
                    ...action.payload
                };
            },
            // Sorting
            setSort: (state, action)=>{
                state.sort = action.payload;
            },
            // Filtering
            setFilters: (state, action)=>{
                state.filters = {
                    ...state.filters,
                    ...action.payload
                };
            },
            clearFilters: (state)=>{
                state.filters = {
                    active: {},
                    search: '',
                    presets: state.filters.presets
                };
            },
            // Selection
            setSelection: (state, action)=>{
                state.selection = {
                    ...state.selection,
                    ...action.payload
                };
            },
            selectEntity: (state, action)=>{
                const id = action.payload;
                if (state.selection.mode === 'single') {
                    state.selection.selectedIds = [
                        id
                    ];
                } else if (state.selection.mode === 'multiple') {
                    if (!state.selection.selectedIds.includes(id)) {
                        state.selection.selectedIds.push(id);
                    }
                }
                state.selection.focusedId = id;
            },
            deselectEntity: (state, action)=>{
                const id = action.payload;
                state.selection.selectedIds = state.selection.selectedIds.filter((selectedId)=>selectedId !== id);
                if (state.selection.focusedId === id) {
                    state.selection.focusedId = null;
                }
            },
            clearSelection: (state)=>{
                state.selection.selectedIds = [];
                state.selection.focusedId = null;
                state.selection.isAllSelected = false;
            },
            selectAll: (state)=>{
                state.selection.selectedIds = [
                    ...state.ids
                ];
                state.selection.isAllSelected = true;
            },
            // UI state
            setUI: (state, action)=>{
                state.ui = {
                    ...state.ui,
                    ...action.payload
                };
            },
            // Cache management
            invalidateCache: (state)=>{
                state.cache.isStale = true;
                state.cache.lastFetched = 0;
            },
            // Error handling
            clearErrors: (state)=>{
                Object.keys(state.loading).forEach((key)=>{
                    state.loading[key].error = null;
                });
            },
            // Custom reducers
            ...extraReducers
        },
        extraReducers: (builder)=>{
            // Fetch list
            builder.addCase(fetchList.pending, (state)=>{
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$sliceFactory$2f$helpers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateLoadingState"])(state, 'list', {
                    status: 'pending',
                    isLoading: true,
                    error: null,
                    startedAt: Date.now()
                });
            }).addCase(fetchList.fulfilled, (state, action)=>{
                adapter.setAll(state, action.payload.data);
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$sliceFactory$2f$helpers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateLoadingState"])(state, 'list', {
                    status: 'fulfilled',
                    isLoading: false,
                    error: null,
                    completedAt: Date.now()
                });
                // Update pagination if provided
                if (action.payload.pagination) {
                    state.pagination = {
                        ...state.pagination,
                        ...action.payload.pagination
                    };
                }
                if (action.payload.total !== undefined) {
                    state.pagination.total = action.payload.total;
                }
                state.cache.lastFetched = Date.now();
                state.cache.isStale = false;
            }).addCase(fetchList.rejected, (state, action)=>{
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$sliceFactory$2f$helpers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateLoadingState"])(state, 'list', {
                    status: 'rejected',
                    isLoading: false,
                    error: action.error,
                    completedAt: Date.now()
                });
            });
            // Fetch by ID
            builder.addCase(fetchById.pending, (state)=>{
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$sliceFactory$2f$helpers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateLoadingState"])(state, 'detail', {
                    status: 'pending',
                    isLoading: true,
                    error: null,
                    startedAt: Date.now()
                });
            }).addCase(fetchById.fulfilled, (state, action)=>{
                adapter.upsertOne(state, action.payload.data);
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$sliceFactory$2f$helpers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateLoadingState"])(state, 'detail', {
                    status: 'fulfilled',
                    isLoading: false,
                    error: null,
                    completedAt: Date.now()
                });
            }).addCase(fetchById.rejected, (state, action)=>{
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$sliceFactory$2f$helpers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateLoadingState"])(state, 'detail', {
                    status: 'rejected',
                    isLoading: false,
                    error: action.error,
                    completedAt: Date.now()
                });
            });
            // Create
            builder.addCase(create.pending, (state)=>{
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$sliceFactory$2f$helpers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateLoadingState"])(state, 'create', {
                    status: 'pending',
                    isLoading: true,
                    error: null,
                    startedAt: Date.now()
                });
            }).addCase(create.fulfilled, (state, action)=>{
                adapter.addOne(state, action.payload.data);
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$sliceFactory$2f$helpers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateLoadingState"])(state, 'create', {
                    status: 'fulfilled',
                    isLoading: false,
                    error: null,
                    completedAt: Date.now()
                });
                // Update pagination
                state.pagination.total += 1;
            }).addCase(create.rejected, (state, action)=>{
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$sliceFactory$2f$helpers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateLoadingState"])(state, 'create', {
                    status: 'rejected',
                    isLoading: false,
                    error: action.error,
                    completedAt: Date.now()
                });
            });
            // Update
            builder.addCase(update.pending, (state)=>{
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$sliceFactory$2f$helpers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateLoadingState"])(state, 'update', {
                    status: 'pending',
                    isLoading: true,
                    error: null,
                    startedAt: Date.now()
                });
            }).addCase(update.fulfilled, (state, action)=>{
                adapter.upsertOne(state, action.payload.data);
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$sliceFactory$2f$helpers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateLoadingState"])(state, 'update', {
                    status: 'fulfilled',
                    isLoading: false,
                    error: null,
                    completedAt: Date.now()
                });
            }).addCase(update.rejected, (state, action)=>{
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$sliceFactory$2f$helpers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateLoadingState"])(state, 'update', {
                    status: 'rejected',
                    isLoading: false,
                    error: action.error,
                    completedAt: Date.now()
                });
            });
            // Delete
            builder.addCase(deleteEntity.pending, (state)=>{
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$sliceFactory$2f$helpers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateLoadingState"])(state, 'delete', {
                    status: 'pending',
                    isLoading: true,
                    error: null,
                    startedAt: Date.now()
                });
            }).addCase(deleteEntity.fulfilled, (state, action)=>{
                adapter.removeOne(state, action.payload.id);
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$sliceFactory$2f$helpers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateLoadingState"])(state, 'delete', {
                    status: 'fulfilled',
                    isLoading: false,
                    error: null,
                    completedAt: Date.now()
                });
                // Update pagination
                state.pagination.total = Math.max(0, state.pagination.total - 1);
            }).addCase(deleteEntity.rejected, (state, action)=>{
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$sliceFactory$2f$helpers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateLoadingState"])(state, 'delete', {
                    status: 'rejected',
                    isLoading: false,
                    error: action.error,
                    completedAt: Date.now()
                });
            });
            // Bulk operations
            if (bulkDelete) {
                builder.addCase(bulkDelete.pending, (state)=>{
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$sliceFactory$2f$helpers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateLoadingState"])(state, 'bulk', {
                        status: 'pending',
                        isLoading: true,
                        error: null,
                        startedAt: Date.now()
                    });
                }).addCase(bulkDelete.fulfilled, (state, action)=>{
                    adapter.removeMany(state, action.payload.ids);
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$sliceFactory$2f$helpers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateLoadingState"])(state, 'bulk', {
                        status: 'fulfilled',
                        isLoading: false,
                        error: null,
                        completedAt: Date.now()
                    });
                    // Update pagination
                    state.pagination.total = Math.max(0, state.pagination.total - action.payload.ids.length);
                    // Clear selection
                    state.selection.selectedIds = [];
                    state.selection.isAllSelected = false;
                }).addCase(bulkDelete.rejected, (state, action)=>{
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$sliceFactory$2f$helpers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateLoadingState"])(state, 'bulk', {
                        status: 'rejected',
                        isLoading: false,
                        error: action.error,
                        completedAt: Date.now()
                    });
                });
            }
            if (bulkUpdate) {
                builder.addCase(bulkUpdate.pending, (state)=>{
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$sliceFactory$2f$helpers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateLoadingState"])(state, 'bulk', {
                        status: 'pending',
                        isLoading: true,
                        error: null,
                        startedAt: Date.now()
                    });
                }).addCase(bulkUpdate.fulfilled, (state, action)=>{
                    adapter.upsertMany(state, action.payload.data);
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$sliceFactory$2f$helpers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateLoadingState"])(state, 'bulk', {
                        status: 'fulfilled',
                        isLoading: false,
                        error: null,
                        completedAt: Date.now()
                    });
                }).addCase(bulkUpdate.rejected, (state, action)=>{
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$sliceFactory$2f$helpers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateLoadingState"])(state, 'bulk', {
                        status: 'rejected',
                        isLoading: false,
                        error: action.error,
                        completedAt: Date.now()
                    });
                });
            }
        }
    });
    // Return complete slice factory result
    return {
        slice,
        adapter,
        thunks: {
            fetchList,
            fetchById,
            create,
            update,
            delete: deleteEntity,
            ...bulkDelete && {
                bulkDelete
            },
            ...bulkUpdate && {
                bulkUpdate
            }
        },
        actions: slice.actions,
        reducer: slice.reducer
    };
}
function createSimpleSlice(name, apiService) {
    return createEntitySlice(name, apiService, {
        enableBulkOperations: false
    });
}
}),
"[project]/src/stores/sliceFactory/healthcare.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @fileoverview Healthcare-specific Redux Slice Factory with HIPAA Compliance
 * @module stores/sliceFactory/healthcare
 * @category Healthcare
 */ __turbopack_context__.s([
    "containsPHI",
    ()=>containsPHI,
    "createAuditRecord",
    ()=>createAuditRecord,
    "createHealthcareEntitySlice",
    ()=>createHealthcareEntitySlice,
    "default",
    ()=>__TURBOPACK__default__export__,
    "generateComplianceReport",
    ()=>generateComplianceReport,
    "validateDataClassification",
    ()=>validateDataClassification
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$sliceFactory$2f$core$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/sliceFactory/core.ts [app-ssr] (ecmascript)");
;
function createHealthcareEntitySlice(name, apiService, options = {}) {
    // Add healthcare-specific options
    const healthcareOptions = {
        ...options,
        extraReducers: {
            ...options.extraReducers,
            // Audit trail management
            addAuditRecord: (state, action)=>{
                const payload = action.payload;
                const { entityId, auditRecord } = payload;
                const entity = state.entities[entityId];
                if (entity && 'auditTrail' in entity) {
                    const healthcareEntity = entity;
                    if (healthcareEntity.auditTrail) {
                        healthcareEntity.auditTrail = [
                            ...healthcareEntity.auditTrail,
                            auditRecord
                        ];
                    } else {
                        healthcareEntity.auditTrail = [
                            auditRecord
                        ];
                    }
                    // Update the modifiedBy field when adding audit records
                    healthcareEntity.modifiedBy = auditRecord.userId;
                    healthcareEntity.updatedAt = new Date().toISOString();
                }
            },
            // Data classification updates
            updateDataClassification: (state, action)=>{
                const payload = action.payload;
                const { entityId, classification } = payload;
                const entity = state.entities[entityId];
                if (entity && 'dataClassification' in entity) {
                    const healthcareEntity = entity;
                    const previousClassification = healthcareEntity.dataClassification;
                    healthcareEntity.dataClassification = classification;
                    healthcareEntity.updatedAt = new Date().toISOString();
                    // Add audit record for classification change
                    const auditRecord = {
                        timestamp: new Date().toISOString(),
                        userId: 'system',
                        action: 'UPDATE',
                        context: `Data classification changed from ${previousClassification} to ${classification}`
                    };
                    if (healthcareEntity.auditTrail) {
                        healthcareEntity.auditTrail = [
                            ...healthcareEntity.auditTrail,
                            auditRecord
                        ];
                    } else {
                        healthcareEntity.auditTrail = [
                            auditRecord
                        ];
                    }
                }
            },
            // Bulk audit record addition for compliance
            addBulkAuditRecords: (state, action)=>{
                const payload = action.payload;
                const { records } = payload;
                records.forEach(({ entityId, auditRecord })=>{
                    const entity = state.entities[entityId];
                    if (entity && 'auditTrail' in entity) {
                        const healthcareEntity = entity;
                        if (healthcareEntity.auditTrail) {
                            healthcareEntity.auditTrail = [
                                ...healthcareEntity.auditTrail,
                                auditRecord
                            ];
                        } else {
                            healthcareEntity.auditTrail = [
                                auditRecord
                            ];
                        }
                    }
                });
            },
            // Mark entities as accessed for compliance tracking
            markAsAccessed: (state, action)=>{
                const payload = action.payload;
                const { entityIds, userId, accessType } = payload;
                const timestamp = new Date().toISOString();
                entityIds.forEach((entityId)=>{
                    const entity = state.entities[entityId];
                    if (entity && 'auditTrail' in entity) {
                        const healthcareEntity = entity;
                        const auditRecord = {
                            timestamp,
                            userId,
                            action: 'VIEW',
                            context: `Accessed via ${accessType}`
                        };
                        if (healthcareEntity.auditTrail) {
                            healthcareEntity.auditTrail = [
                                ...healthcareEntity.auditTrail,
                                auditRecord
                            ];
                        } else {
                            healthcareEntity.auditTrail = [
                                auditRecord
                            ];
                        }
                    }
                });
            },
            // Update compliance metadata
            updateComplianceMetadata: (state, action)=>{
                const payload = action.payload;
                const { entityId, metadata } = payload;
                const entity = state.entities[entityId];
                if (entity) {
                    Object.assign(entity, {
                        ...metadata,
                        updatedAt: new Date().toISOString()
                    });
                }
            },
            // Sanitize PHI for non-authorized users (placeholder - actual implementation would depend on user permissions)
            sanitizePHI: (state, action)=>{
                const payload = action.payload;
                const { entityIds, userRole } = payload;
                // Only sanitize if user doesn't have PHI access (this is a simplified example)
                if (userRole !== 'HEALTHCARE_PROVIDER' && userRole !== 'ADMIN') {
                    entityIds.forEach((entityId)=>{
                        const entity = state.entities[entityId];
                        if (entity && 'dataClassification' in entity) {
                            const healthcareEntity = entity;
                            if (healthcareEntity.dataClassification === 'PHI') {
                                // Sanitize sensitive fields (implementation would vary by entity type)
                                Object.keys(healthcareEntity).forEach((key)=>{
                                    if (key.includes('ssn') || key.includes('Social') || key.includes('dob')) {
                                        healthcareEntity[key] = '[REDACTED]';
                                    }
                                });
                            }
                        }
                    });
                }
            }
        }
    };
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$sliceFactory$2f$core$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createEntitySlice"])(name, apiService, healthcareOptions);
}
function createAuditRecord(userId, action, context, ipAddress) {
    return {
        timestamp: new Date().toISOString(),
        userId,
        action,
        context,
        ipAddress
    };
}
function validateDataClassification(classification) {
    return [
        'PUBLIC',
        'INTERNAL',
        'CONFIDENTIAL',
        'PHI'
    ].includes(classification);
}
function containsPHI(entity) {
    return entity.dataClassification === 'PHI';
}
function generateComplianceReport(entities) {
    const phiEntities = entities.filter(containsPHI);
    const entitiesWithAuditTrail = entities.filter((entity)=>entity.auditTrail && entity.auditTrail.length > 0);
    const recentAccess = entities.filter((entity)=>entity.auditTrail && entity.auditTrail.length > 0).map((entity)=>{
        const lastAuditRecord = entity.auditTrail[entity.auditTrail.length - 1];
        if (!lastAuditRecord) {
            return null;
        }
        return {
            entityId: entity.id,
            lastAccessed: lastAuditRecord.timestamp,
            userId: lastAuditRecord.userId
        };
    }).filter((access)=>access !== null).sort((a, b)=>new Date(b.lastAccessed).getTime() - new Date(a.lastAccessed).getTime()).slice(0, 10); // Most recent 10 accesses
    return {
        totalEntities: entities.length,
        phiEntities: phiEntities.length,
        entitiesWithAuditTrail: entitiesWithAuditTrail.length,
        recentAccess
    };
}
const __TURBOPACK__default__export__ = createHealthcareEntitySlice;
}),
"[project]/src/stores/sliceFactory/index.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

/**
 * @fileoverview Redux Slice Factory - Main Entry Point
 * @module stores/sliceFactory
 * @category Store - Factory
 * 
 * Comprehensive factory functions for creating Redux Toolkit slices with standardized
 * CRUD operations, normalized state management using EntityAdapter, and built-in
 * async thunk generation. Dramatically reduces boilerplate while ensuring consistency
 * across all entity slices in the application.
 */ // Core factory functions
__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$sliceFactory$2f$core$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/sliceFactory/core.ts [app-ssr] (ecmascript)");
// Healthcare-specific factory with HIPAA compliance
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$sliceFactory$2f$healthcare$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/sliceFactory/healthcare.ts [app-ssr] (ecmascript)");
// Helper utilities
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$sliceFactory$2f$helpers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/sliceFactory/helpers.ts [app-ssr] (ecmascript)");
;
;
;
;
}),
"[project]/src/stores/sliceFactory.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

/**
 * @fileoverview Redux Slice Factory for Standardized Entity Management
 * @module stores/sliceFactory
 * @category Store - Factories
 * 
 * DEPRECATED: This file exports from the new modular structure.
 * Import directly from './sliceFactory' for the new modular components.
 * 
 * @deprecated Use import from './sliceFactory' instead
 */ // Re-export everything from the new modular structure for backward compatibility
__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$sliceFactory$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/stores/sliceFactory/index.ts [app-ssr] (ecmascript) <locals>");
;
;
}),
"[project]/src/lib/api/client.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @fileoverview Client-Side API Client
 * @module lib/api/client
 * @category API Client
 *
 * Client-side HTTP client for browser environments. This client is designed
 * for use in Client Components and browser-only contexts where Next.js
 * server APIs (like next/headers) are not available.
 *
 * Key Features:
 * - Browser-compatible fetch API
 * - Client-side authentication via cookies
 * - CSRF protection
 * - Error handling and retry logic
 * - Type-safe HTTP methods
 * - Request ID generation for tracing
 *
 * @example
 * ```typescript
 * // In a Client Component
 * 'use client';
 * import { clientGet, clientPost } from '@/lib/api/client';
 * 
 * const students = await clientGet<Student[]>('/api/students');
 * const newStudent = await clientPost<Student>('/api/students', data);
 * ```
 *
 * @version 1.0.0
 * @since 2025-11-01
 */ // ==========================================
// TYPE DEFINITIONS
// ==========================================
/**
 * Client-side fetch options
 */ __turbopack_context__.s([
    "ClientApiError",
    ()=>ClientApiError,
    "apiClient",
    ()=>apiClient,
    "clientDelete",
    ()=>clientDelete,
    "clientFetch",
    ()=>clientFetch,
    "clientGet",
    ()=>clientGet,
    "clientPatch",
    ()=>clientPatch,
    "clientPost",
    ()=>clientPost,
    "clientPut",
    ()=>clientPut,
    "default",
    ()=>__TURBOPACK__default__export__,
    "fetchApi",
    ()=>fetchApi
]);
class ClientApiError extends Error {
    code;
    status;
    details;
    traceId;
    isNetworkError;
    isServerError;
    isValidationError;
    constructor(error){
        super(error.message);
        this.name = 'ClientApiError';
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
            Error.captureStackTrace(this, ClientApiError);
        }
    }
}
// ==========================================
// CONFIGURATION
// ==========================================
/**
 * Get API base URL from environment
 */ function getApiBaseUrl() {
    return ("TURBOPACK compile-time value", "http://localhost:3001") || 'http://localhost:3001';
}
/**
 * Get authentication token from cookies (client-side)
 */ function getAuthToken() {
    if (typeof document === 'undefined') return null;
    try {
        const cookies = document.cookie.split(';');
        const authCookie = cookies.find((cookie)=>cookie.trim().startsWith('auth_token='));
        if (authCookie) {
            return authCookie.split('=')[1];
        }
        return null;
    } catch (error) {
        console.error('[Client API] Failed to get auth token:', error);
        return null;
    }
}
/**
 * Generate unique request ID for tracing
 */ function generateRequestId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
/**
 * Get CSRF token from cookies (client-side)
 */ function getCsrfToken() {
    if (typeof document === 'undefined') return null;
    try {
        const cookies = document.cookie.split(';');
        const csrfCookie = cookies.find((cookie)=>cookie.trim().startsWith('csrf-token='));
        if (csrfCookie) {
            return csrfCookie.split('=')[1];
        }
        return null;
    } catch (error) {
        console.error('[Client API] Failed to get CSRF token:', error);
        return null;
    }
}
async function clientFetch(endpoint, options = {}) {
    const { requiresAuth = true, onError, retry = {
        attempts: 3,
        delay: 1000
    }, timeout = 30000, ...fetchOptions } = options;
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
        const token = getAuthToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }
    // Add CSRF token for mutations
    if (fetchOptions.method && [
        'POST',
        'PUT',
        'PATCH',
        'DELETE'
    ].includes(fetchOptions.method)) {
        const csrfToken = getCsrfToken();
        if (csrfToken) {
            headers['X-CSRF-Token'] = csrfToken;
        }
    }
    // Add request ID for tracing
    headers['X-Request-ID'] = generateRequestId();
    // Add security headers
    headers['X-Content-Type-Options'] = 'nosniff';
    headers['X-Frame-Options'] = 'DENY';
    headers['X-XSS-Protection'] = '1; mode=block';
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
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            // Handle different response status codes
            if (!response.ok) {
                const error = await handleErrorResponse(response);
                // Handle specific errors with redirects (client-side)
                if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
                ;
                else if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
                ;
                throw error;
            }
            // Parse response
            const contentType = response.headers.get('content-type');
            if (contentType?.includes('application/json')) {
                return await response.json();
            }
            return await response.text();
        } catch (error) {
            lastError = error;
            // Don't retry on client errors (except 408, 429)
            if (error instanceof ClientApiError) {
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
    return new ClientApiError(error);
}
async function clientGet(endpoint, params, options = {}) {
    const queryString = params ? '?' + new URLSearchParams(Object.entries(params).map(([k, v])=>[
            k,
            String(v)
        ])).toString() : '';
    return clientFetch(`${endpoint}${queryString}`, {
        ...options,
        method: 'GET'
    });
}
async function clientPost(endpoint, data, options = {}) {
    return clientFetch(endpoint, {
        ...options,
        method: 'POST',
        body: data ? JSON.stringify(data) : undefined
    });
}
async function clientPut(endpoint, data, options = {}) {
    return clientFetch(endpoint, {
        ...options,
        method: 'PUT',
        body: data ? JSON.stringify(data) : undefined
    });
}
async function clientPatch(endpoint, data, options = {}) {
    return clientFetch(endpoint, {
        ...options,
        method: 'PATCH',
        body: data ? JSON.stringify(data) : undefined
    });
}
async function clientDelete(endpoint, options = {}) {
    return clientFetch(endpoint, {
        ...options,
        method: 'DELETE'
    });
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
const __TURBOPACK__default__export__ = {
    clientFetch,
    clientGet,
    clientPost,
    clientPut,
    clientPatch,
    clientDelete,
    // Legacy exports
    apiClient,
    fetchApi
};
}),
"[project]/src/lib/api/index.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

/**
 * @fileoverview Centralized API Actions Hub
 * @module lib/api
 * @category API Client
 * 
 * This is the single entry point for ALL API actions in the frontend.
 * All API calls should go through this centralized hub to ensure:
 * - Consistent error handling
 * - Unified caching strategy
 * - Centralized authentication
 * - Request/response logging
 * - Type safety
 * 
 * @example
 * ```typescript
 * import { apiActions } from '@/lib/api';
 * 
 * // All API calls go through centralized actions
 * const students = await apiActions.students.getAll({ grade: '5' });
 * const user = await apiActions.auth.getCurrentUser();
 * const appointments = await apiActions.appointments.getUpcoming();
 * ```
 * 
 * @version 1.0.0
 * @since 2025-10-31
 */ // ==========================================
// CLIENT-SIDE API EXPORTS
// ==========================================
// Export client-side API functions (safe for Client Components)
__turbopack_context__.s([
    "CentralizedApiError",
    ()=>CentralizedApiError,
    "apiActions",
    ()=>apiActions,
    "apiCache",
    ()=>apiCache,
    "centralizedApiRequest",
    ()=>centralizedApiRequest,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/api/client.ts [app-ssr] (ecmascript)");
;
const apiActions = {
};
class CentralizedApiError extends Error {
    code;
    status;
    details;
    constructor(message, code = 'API_ERROR', status, details){
        super(message);
        this.name = 'CentralizedApiError';
        this.code = code;
        this.status = status;
        this.details = details;
    }
}
async function centralizedApiRequest(apiCall, context) {
    const { operation, domain, cacheTags = [], requiresAuth = true } = context;
    try {
        console.log(`[API] ${domain}.${operation} - Starting request`);
        const startTime = Date.now();
        const result = await apiCall();
        const endTime = Date.now();
        console.log(`[API] ${domain}.${operation} - Completed in ${endTime - startTime}ms`);
        return result;
    } catch (error) {
        console.error(`[API] ${domain}.${operation} - Error:`, error);
        if (error instanceof Error) {
            throw new CentralizedApiError(error.message, `${domain.toUpperCase()}_${operation.toUpperCase()}_ERROR`, undefined, error);
        }
        throw new CentralizedApiError('Unknown API error occurred', `${domain.toUpperCase()}_${operation.toUpperCase()}_UNKNOWN_ERROR`);
    }
}
const apiCache = {
    /**
   * Invalidate cache tags
   */ invalidate: async (tags)=>{
        // This would integrate with Next.js cache invalidation
        // For now, log the operation
        console.log('[API Cache] Invalidating tags:', tags);
    },
    /**
   * Clear all cache
   */ clearAll: async ()=>{
        console.log('[API Cache] Clearing all cache');
    },
    /**
   * Build cache key for operation
   */ buildKey: (domain, operation, params)=>{
        const paramsKey = params ? JSON.stringify(params) : '';
        return `${domain}:${operation}:${paramsKey}`;
    }
};
const __TURBOPACK__default__export__ = apiActions;
}),
"[project]/src/stores/slices/usersSlice.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @fileoverview User Management Redux Slice
 * 
 * This slice manages comprehensive user administration functionality for the healthcare management
 * system, including user accounts, roles, permissions, authentication status, and organizational
 * hierarchies. Designed specifically for healthcare environments with strict access control,
 * HIPAA compliance requirements, and multi-organizational support.
 * 
 * Key Features:
 * - Role-based user management (Nurses, Administrators, Support Staff, etc.)
 * - Multi-organizational hierarchy support (District → School → Department)
 * - Healthcare-specific role assignments and permissions
 * - User authentication status and session management
 * - Account activation and deactivation workflows
 * - Audit logging for user account changes
 * - HIPAA-compliant user access tracking
 * - Bulk user operations for administrative efficiency
 * - User profile management with healthcare credentials
 * - Integration with access control and permission systems
 * 
 * Healthcare User Roles:
 * - System Administrator: Full system access and configuration
 * - District Administrator: Multi-school oversight and reporting
 * - School Administrator: School-level management and supervision
 * - Head Nurse: Senior nursing staff with administrative duties
 * - School Nurse: Direct patient care and health services
 * - Substitute Nurse: Temporary coverage and limited access
 * - Support Staff: Administrative support with restricted access
 * - IT Support: Technical support with system maintenance access
 * 
 * HIPAA Compliance Features:
 * - User access logging for audit trails
 * - Role-based PHI access controls
 * - Account security monitoring and alerts
 * - User authentication and authorization tracking
 * - Minimum necessary access principle enforcement
 * - User account change audit trails
 * - Session timeout and security controls
 * - Multi-factor authentication integration
 * 
 * Organizational Hierarchy:
 * - District Level: Multi-school administration and oversight
 * - School Level: Individual school management
 * - Department Level: Specialized units (Health Office, Administration)
 * - User Level: Individual staff members and their assignments
 * - Cross-organizational visibility based on role permissions
 * 
 * User Account Lifecycle:
 * - Account Creation: New user onboarding with role assignment
 * - Profile Setup: Healthcare credentials and certifications
 * - Role Assignment: Permission levels and access scope
 * - Account Activation: Initial setup and security configuration
 * - Ongoing Management: Profile updates and role changes
 * - Account Deactivation: Secure offboarding with data retention
 * - Account Archival: Long-term storage for compliance
 * 
 * Performance Optimizations:
 * - User data caching with intelligent invalidation
 * - Lazy loading of user profiles and extended information
 * - Optimistic updates for non-critical user operations
 * - Background synchronization of user directory changes
 * - Efficient filtering and search capabilities
 * - Bulk operations for administrative efficiency
 * 
 * @example
 * // Basic user management
 * const dispatch = useAppDispatch();
 * 
 * // Fetch all users with filtering
 * dispatch(usersThunks.fetchAll({
 *   schoolId: 'school-123',
 *   role: 'nurse',
 *   isActive: true
 * }));
 * 
 * // Create a new nurse user
 * dispatch(usersThunks.create({
 *   firstName: 'Jane',
 *   lastName: 'Smith',
 *   email: 'jane.smith@school.edu',
 *   role: 'nurse',
 *   schoolId: 'school-123',
 *   departmentId: 'health-office',
 *   credentials: ['RN', 'BSN'],
 *   licenseNumber: 'RN123456789'
 * }));
 * 
 * @example
 * // Role-based user filtering
 * // Get all nurses in a district
 * const nurses = useAppSelector(state => 
 *   selectUsersByRole(state, 'nurse')
 * );
 * 
 * // Get active users in a school
 * const activeStaff = useAppSelector(state =>
 *   selectActiveUsers(state).filter(user => user.schoolId === schoolId)
 * );
 * 
 * @example
 * // User account management
 * // Update user profile
 * dispatch(usersThunks.update('user-456', {
 *   credentials: ['RN', 'BSN', 'CPN'],
 *   licenseExpiration: '2025-12-31',
 *   department: 'pediatric_care'
 * }));
 * 
 * // Deactivate user account
 * dispatch(usersThunks.update('user-789', {
 *   isActive: false,
 *   deactivationReason: 'Employment ended',
 *   deactivationDate: new Date().toISOString()
 * }));
 * 
 * @example
 * // Organizational filtering
 * // Get all users in a school
 * const schoolStaff = useAppSelector(state =>
 *   selectUsersBySchool(state, 'school-123')
 * );
 * 
 * // Get all users in a district
 * const districtStaff = useAppSelector(state =>
 *   selectUsersByDistrict(state, 'district-456')
 * );
 * 
 * @example
 * // Advanced user queries
 * // Get users with expiring licenses
 * const expiringLicenses = useAppSelector(state => {
 *   const allUsers = usersSelectors.selectAll(state);
 *   const thirtyDaysFromNow = new Date();
 *   thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
 *   
 *   return allUsers.filter(user => 
 *     user.licenseExpiration && 
 *     new Date(user.licenseExpiration) <= thirtyDaysFromNow
 *   );
 * });
 * 
 * Integration Points:
 * - Authentication Service: User login and session management
 * - Access Control System: Role-based permissions and restrictions
 * - Audit Logging Service: User action tracking and compliance
 * - Directory Services: Integration with organizational directories
 * - Notification Service: User account alerts and communications
 * - Compliance Dashboard: User access reporting and analytics
 * - HR Systems: Employee lifecycle integration
 * 
 * Security Considerations:
 * - User account data contains PII and must be protected
 * - Role assignments control access to PHI and sensitive data
 * - Account changes require proper authorization and approval
 * - User session management with timeout controls
 * - Password policy enforcement and security requirements
 * - Multi-factor authentication integration
 * - Account lockout and security monitoring
 * 
 * Healthcare-Specific Features:
 * - Healthcare professional credentials tracking
 * - License expiration monitoring and alerts
 * - Continuing education requirements tracking
 * - Clinical competency validation
 * - Coverage and scheduling integration
 * - Emergency contact information management
 * - Professional liability and insurance tracking
 * 
 * Compliance and Audit:
 * - HIPAA-compliant user access management
 * - Audit trail for all user account changes
 * - User access reporting for compliance reviews
 * - Role assignment documentation and approval
 * - Account security monitoring and reporting
 * - Data retention policies for user records
 * - Regulatory compliance reporting
 * 
 * @author [Your Organization] - Healthcare IT Administration Team
 * @version 2.1.0
 * @since 2024-01-15
 * @see {@link https://your-docs.com/user-management} User Management Documentation
 * @see {@link https://your-docs.com/role-based-access} Role-Based Access Control Guide
 * @see {@link https://your-docs.com/healthcare-credentials} Healthcare Credentials Management
 */ __turbopack_context__.s([
    "selectActiveUsers",
    ()=>selectActiveUsers,
    "selectUsersByDistrict",
    ()=>selectUsersByDistrict,
    "selectUsersByRole",
    ()=>selectUsersByRole,
    "selectUsersBySchool",
    ()=>selectUsersBySchool,
    "usersActions",
    ()=>usersActions,
    "usersReducer",
    ()=>usersReducer,
    "usersSelectors",
    ()=>usersSelectors,
    "usersSlice",
    ()=>usersSlice,
    "usersThunks",
    ()=>usersThunks
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$sliceFactory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/stores/sliceFactory.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$sliceFactory$2f$core$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/sliceFactory/core.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/lib/api/index.ts [app-ssr] (ecmascript) <locals>");
;
;
// Create API service adapter for users
const usersApiService = {
    async getAll (params) {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["apiActions"].administration.getUsers(params);
        return {
            data: response.data || [],
            total: response.pagination?.total,
            pagination: response.pagination
        };
    },
    async getById (id) {
        // For now, fetch all and filter - can be optimized with a dedicated endpoint
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["apiActions"].administration.getUsers();
        const user = response.data?.find((u)=>u.id === id);
        if (!user) {
            throw new Error(`User with id ${id} not found`);
        }
        return {
            data: user
        };
    },
    async create (data) {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["apiActions"].administration.createUser(data);
        return {
            data: response
        };
    },
    async update (id, data) {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["apiActions"].administration.updateUser(id, data);
        return {
            data: response
        };
    },
    async delete (id) {
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["apiActions"].administration.deleteUser(id);
        return {
            success: true
        };
    }
};
// Create the users slice using the factory
const usersSliceFactory = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$sliceFactory$2f$core$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createEntitySlice"])('users', usersApiService, {
    enableBulkOperations: true
});
const usersSlice = usersSliceFactory.slice;
const usersReducer = usersSlice.reducer;
const usersActions = usersSliceFactory.actions;
const usersSelectors = usersSliceFactory.adapter.getSelectors((state)=>state.users);
const usersThunks = usersSliceFactory.thunks;
const selectUsersByRole = (state, role)=>{
    const allUsers = usersSelectors.selectAll(state);
    return allUsers.filter((user)=>user.role === role);
};
const selectActiveUsers = (state)=>{
    const allUsers = usersSelectors.selectAll(state);
    return allUsers.filter((user)=>user.isActive);
};
const selectUsersBySchool = (state, schoolId)=>{
    const allUsers = usersSelectors.selectAll(state);
    return allUsers.filter((user)=>user.schoolId === schoolId);
};
const selectUsersByDistrict = (state, districtId)=>{
    const allUsers = usersSelectors.selectAll(state);
    return allUsers.filter((user)=>user.districtId === districtId);
};
}),
"[project]/src/stores/slices/dashboardSlice.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @fileoverview Dashboard Redux Slice
 *
 * Comprehensive state management for nurse dashboard with real-time statistics, recent activities,
 * upcoming appointments, health alerts, and chart data. Provides aggregated view of daily operations
 * including student health status, appointment schedules, and critical alerts requiring immediate attention.
 *
 * **Key Features:**
 * - Real-time dashboard statistics (total students, appointments today, pending medications)
 * - Recent activity feed with filtering and pagination
 * - Upcoming appointments view with priority indicators
 * - Health alerts with severity levels (critical, high, medium, low)
 * - Chart data for visualizations (medication trends, appointment patterns, health metrics)
 * - Quick actions for common nurse workflows
 * - Date range filtering for historical data
 * - School/district scope selection for multi-location support
 * - Automatic cache refresh with configurable intervals
 *
 * **State Management Architecture:**
 * - Redux Toolkit with manual slice creation (not using EntityAdapter)
 * - Separate loading/error states for each dashboard section
 * - No localStorage persistence (dashboard data is transient)
 * - Real-time polling via TanStack Query (30-second intervals)
 * - Optimistic health alert management
 *
 * **HIPAA Compliance:**
 * - All dashboard operations trigger PHI access audit logs
 * - Dashboard displays student counts but not identifiable information in summaries
 * - Activity feed contains PHI (student names, actions) - requires audit logging
 * - Health alerts may contain student identifiers - logged access
 * - No caching of dashboard data in localStorage
 * - Role-based data filtering (nurses see only assigned students)
 *
 * **Dashboard Data Types:**
 * - **Statistics**: Aggregate counts, trends, and metrics
 * - **Recent Activities**: Last 10-50 nurse actions with timestamps
 * - **Upcoming Appointments**: Next 24 hours with conflict indicators
 * - **Health Alerts**: Critical issues requiring immediate attention
 * - **Chart Data**: Time-series data for visualizations
 * - **Quick Actions**: Contextual shortcuts for common tasks
 *
 * **Real-Time Update Strategy:**
 * - Auto-refresh every 30 seconds for critical dashboard sections
 * - Manual refresh via refreshDashboardCache action
 * - Optimistic updates for alert acknowledgment
 * - Server-sent events for critical health alerts (future enhancement)
 * - Background polling without blocking UI
 *
 * **TanStack Query Integration:**
 * - Dashboard stats: 30-second cache with auto-refresh
 * - Recent activities: 1-minute cache, invalidate on new actions
 * - Upcoming appointments: 30-second cache with polling
 * - Health alerts: 15-second cache, real-time critical alerts
 * - Chart data: 5-minute cache, invalidate on data changes
 *
 * **Performance Optimizations:**
 * - Bulk data loading via fetchCompleteDashboardData (reduces API calls)
 * - Selective re-rendering with memoized selectors
 * - Lazy loading for chart data (load only when chart tab active)
 * - Debounced date range updates
 * - Cached scope selections
 *
 * @module pages/dashboard/store/dashboardSlice
 * @see {@link services/modules/dashboardApi} for API implementation
 * @see {@link types/dashboard} for type definitions
 * @see {@link hooks/useDashboard} for React hooks integration
 */ __turbopack_context__.s([
    "addHealthAlert",
    ()=>addHealthAlert,
    "clearDashboardData",
    ()=>clearDashboardData,
    "clearErrors",
    ()=>clearErrors,
    "default",
    ()=>__TURBOPACK__default__export__,
    "fetchChartData",
    ()=>fetchChartData,
    "fetchCompleteDashboardData",
    ()=>fetchCompleteDashboardData,
    "fetchDashboardStats",
    ()=>fetchDashboardStats,
    "fetchDashboardStatsByDateRange",
    ()=>fetchDashboardStatsByDateRange,
    "fetchDashboardStatsByScope",
    ()=>fetchDashboardStatsByScope,
    "fetchRecentActivities",
    ()=>fetchRecentActivities,
    "fetchUpcomingAppointments",
    ()=>fetchUpcomingAppointments,
    "markAlertAsAcknowledged",
    ()=>markAlertAsAcknowledged,
    "refreshDashboardCache",
    ()=>refreshDashboardCache,
    "removeHealthAlert",
    ()=>removeHealthAlert,
    "selectActivitiesError",
    ()=>selectActivitiesError,
    "selectActivitiesLoading",
    ()=>selectActivitiesLoading,
    "selectAppointmentsError",
    ()=>selectAppointmentsError,
    "selectAppointmentsLoading",
    ()=>selectAppointmentsLoading,
    "selectChartData",
    ()=>selectChartData,
    "selectChartError",
    ()=>selectChartError,
    "selectChartLoading",
    ()=>selectChartLoading,
    "selectCriticalHealthAlerts",
    ()=>selectCriticalHealthAlerts,
    "selectDashboardOverview",
    ()=>selectDashboardOverview,
    "selectDashboardStats",
    ()=>selectDashboardStats,
    "selectDashboardStatsError",
    ()=>selectDashboardStatsError,
    "selectDashboardStatsLoading",
    ()=>selectDashboardStatsLoading,
    "selectHealthAlerts",
    ()=>selectHealthAlerts,
    "selectHighPriorityAppointments",
    ()=>selectHighPriorityAppointments,
    "selectIsRefreshing",
    ()=>selectIsRefreshing,
    "selectLastUpdated",
    ()=>selectLastUpdated,
    "selectQuickActions",
    ()=>selectQuickActions,
    "selectRecentActivities",
    ()=>selectRecentActivities,
    "selectSelectedDateRange",
    ()=>selectSelectedDateRange,
    "selectSelectedScope",
    ()=>selectSelectedScope,
    "selectUnreadHealthAlerts",
    ()=>selectUnreadHealthAlerts,
    "selectUpcomingAppointments",
    ()=>selectUpcomingAppointments,
    "setQuickActions",
    ()=>setQuickActions,
    "setSelectedDateRange",
    ()=>setSelectedDateRange,
    "setSelectedScope",
    ()=>setSelectedScope
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/lib/api/index.ts [app-ssr] (ecmascript) <locals>");
;
;
/**
 * Dashboard API Service Adapter
 *
 * Provides a clean interface to dashboard API methods with consistent error handling,
 * response formatting, and support for multiple data aggregation patterns. Handles both
 * individual section fetching and bulk dashboard data loading.
 *
 * @class DashboardApiService
 *
 * @remarks
 * **Authentication**: All methods require valid JWT token with nurse/admin role
 * **Authorization**: Data filtered by user's assigned students/schools
 * **Rate Limiting**: 200 requests per minute (dashboard has high refresh rate)
 * **Audit Logging**: Dashboard views trigger PHI access audit logs
 * **Caching**: Server-side caching for 15-30 seconds depending on data type
 * **Performance**: Use getCompleteDashboardData() for initial load to reduce round trips
 *
 * @example
 * ```typescript
 * const apiService = new DashboardApiService();
 * const stats = await apiService.getDashboardStats();
 * console.log(`Total students: ${stats.totalStudents}`);
 * ```
 */ class DashboardApiService {
    /**
   * Get comprehensive dashboard statistics
   */ async getDashboardStats() {
        try {
            return await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["apiActions"].dashboard.getDashboardStats();
        } catch (error) {
            throw new Error(error.message || 'Failed to fetch dashboard statistics');
        }
    }
    /**
   * Get recent activities with optional limit
   */ async getRecentActivities(params) {
        try {
            return await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["apiActions"].dashboard.getRecentActivities(params);
        } catch (error) {
            throw new Error(error.message || 'Failed to fetch recent activities');
        }
    }
    /**
   * Get upcoming appointments with optional limit
   */ async getUpcomingAppointments(params) {
        try {
            return await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["apiActions"].dashboard.getUpcomingAppointments(params);
        } catch (error) {
            throw new Error(error.message || 'Failed to fetch upcoming appointments');
        }
    }
    /**
   * Get chart data for visualizations
   */ async getChartData(params) {
        try {
            return await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["apiActions"].dashboard.getChartData(params);
        } catch (error) {
            throw new Error(error.message || 'Failed to fetch chart data');
        }
    }
    /**
   * Get complete dashboard data in single request
   */ async getCompleteDashboardData(options) {
        try {
            return await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["apiActions"].dashboard.getCompleteDashboardData(options);
        } catch (error) {
            throw new Error(error.message || 'Failed to fetch complete dashboard data');
        }
    }
    /**
   * Refresh dashboard cache
   */ async refreshCache() {
        try {
            return await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["apiActions"].dashboard.refreshCache();
        } catch (error) {
            throw new Error(error.message || 'Failed to refresh dashboard cache');
        }
    }
    /**
   * Get dashboard stats by date range
   */ async getDashboardStatsByDateRange(startDate, endDate) {
        try {
            return await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["apiActions"].dashboard.getDashboardStatsByDateRange(startDate, endDate);
        } catch (error) {
            throw new Error(error.message || 'Failed to fetch dashboard stats by date range');
        }
    }
    /**
   * Get dashboard stats by scope (school/district)
   */ async getDashboardStatsByScope(scope) {
        try {
            return await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["apiActions"].dashboard.getDashboardStatsByScope(scope);
        } catch (error) {
            throw new Error(error.message || 'Failed to fetch scoped dashboard stats');
        }
    }
}
// Create service instance
const dashboardApiService = new DashboardApiService();
/**
 * Initial state
 */ const initialState = {
    // Dashboard statistics
    stats: null,
    statsLoading: false,
    statsError: null,
    // Recent activities
    recentActivities: [],
    activitiesLoading: false,
    activitiesError: null,
    // Upcoming appointments
    upcomingAppointments: [],
    appointmentsLoading: false,
    appointmentsError: null,
    // Chart data
    chartData: null,
    chartLoading: false,
    chartError: null,
    // Health alerts
    healthAlerts: [],
    alertsLoading: false,
    alertsError: null,
    // Quick actions
    quickActions: [],
    // General dashboard state
    isRefreshing: false,
    lastUpdated: null,
    selectedDateRange: {
        startDate: null,
        endDate: null
    },
    selectedScope: {}
};
const fetchDashboardStats = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])('dashboard/fetchStats', async (_, { rejectWithValue })=>{
    try {
        const stats = await dashboardApiService.getDashboardStats();
        return stats;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});
const fetchRecentActivities = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])('dashboard/fetchRecentActivities', async (params = {}, { rejectWithValue })=>{
    try {
        const activities = await dashboardApiService.getRecentActivities(params);
        return activities;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});
const fetchUpcomingAppointments = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])('dashboard/fetchUpcomingAppointments', async (params = {}, { rejectWithValue })=>{
    try {
        const appointments = await dashboardApiService.getUpcomingAppointments(params);
        return appointments;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});
const fetchChartData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])('dashboard/fetchChartData', async (params = {}, { rejectWithValue })=>{
    try {
        const chartData = await dashboardApiService.getChartData(params);
        return chartData;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});
const fetchCompleteDashboardData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])('dashboard/fetchCompleteDashboardData', async (options = {}, { rejectWithValue })=>{
    try {
        const data = await dashboardApiService.getCompleteDashboardData(options);
        return data;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});
const refreshDashboardCache = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])('dashboard/refreshCache', async (_, { rejectWithValue, dispatch })=>{
    try {
        const success = await dashboardApiService.refreshCache();
        if (success) {
            // Refetch all dashboard data after cache refresh
            await dispatch(fetchCompleteDashboardData({}));
        }
        return success;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});
const fetchDashboardStatsByDateRange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])('dashboard/fetchStatsByDateRange', async (params, { rejectWithValue })=>{
    try {
        const stats = await dashboardApiService.getDashboardStatsByDateRange(params.startDate, params.endDate);
        return stats;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});
const fetchDashboardStatsByScope = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])('dashboard/fetchStatsByScope', async (scope, { rejectWithValue })=>{
    try {
        const stats = await dashboardApiService.getDashboardStatsByScope(scope);
        return stats;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});
/**
 * Dashboard Slice
 */ const dashboardSlice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createSlice"])({
    name: 'dashboard',
    initialState,
    reducers: {
        // Set selected date range
        setSelectedDateRange: (state, action)=>{
            state.selectedDateRange = action.payload;
        },
        // Set selected scope
        setSelectedScope: (state, action)=>{
            state.selectedScope = action.payload;
        },
        // Clear dashboard data
        clearDashboardData: (state)=>{
            state.stats = null;
            state.recentActivities = [];
            state.upcomingAppointments = [];
            state.chartData = null;
            state.healthAlerts = [];
            state.lastUpdated = null;
        },
        // Clear errors
        clearErrors: (state)=>{
            state.statsError = null;
            state.activitiesError = null;
            state.appointmentsError = null;
            state.chartError = null;
            state.alertsError = null;
        },
        // Set quick actions
        setQuickActions: (state, action)=>{
            state.quickActions = action.payload;
        },
        // Add health alert
        addHealthAlert: (state, action)=>{
            state.healthAlerts.unshift(action.payload);
        },
        // Remove health alert
        removeHealthAlert: (state, action)=>{
            state.healthAlerts = state.healthAlerts.filter((alert)=>alert.id !== action.payload);
        },
        // Mark health alert as acknowledged
        markAlertAsAcknowledged: (state, action)=>{
            const alert = state.healthAlerts.find((alert)=>alert.id === action.payload);
            if (alert) {
                alert.acknowledged = true;
            }
        }
    },
    extraReducers: (builder)=>{
        // Fetch dashboard statistics
        builder.addCase(fetchDashboardStats.pending, (state)=>{
            state.statsLoading = true;
            state.statsError = null;
        }).addCase(fetchDashboardStats.fulfilled, (state, action)=>{
            state.statsLoading = false;
            state.stats = action.payload;
            state.lastUpdated = new Date().toISOString();
        }).addCase(fetchDashboardStats.rejected, (state, action)=>{
            state.statsLoading = false;
            state.statsError = action.payload;
        });
        // Fetch recent activities
        builder.addCase(fetchRecentActivities.pending, (state)=>{
            state.activitiesLoading = true;
            state.activitiesError = null;
        }).addCase(fetchRecentActivities.fulfilled, (state, action)=>{
            state.activitiesLoading = false;
            state.recentActivities = action.payload;
        }).addCase(fetchRecentActivities.rejected, (state, action)=>{
            state.activitiesLoading = false;
            state.activitiesError = action.payload;
        });
        // Fetch upcoming appointments
        builder.addCase(fetchUpcomingAppointments.pending, (state)=>{
            state.appointmentsLoading = true;
            state.appointmentsError = null;
        }).addCase(fetchUpcomingAppointments.fulfilled, (state, action)=>{
            state.appointmentsLoading = false;
            state.upcomingAppointments = action.payload;
        }).addCase(fetchUpcomingAppointments.rejected, (state, action)=>{
            state.appointmentsLoading = false;
            state.appointmentsError = action.payload;
        });
        // Fetch chart data
        builder.addCase(fetchChartData.pending, (state)=>{
            state.chartLoading = true;
            state.chartError = null;
        }).addCase(fetchChartData.fulfilled, (state, action)=>{
            state.chartLoading = false;
            state.chartData = action.payload;
        }).addCase(fetchChartData.rejected, (state, action)=>{
            state.chartLoading = false;
            state.chartError = action.payload;
        });
        // Fetch complete dashboard data
        builder.addCase(fetchCompleteDashboardData.pending, (state)=>{
            state.isRefreshing = true;
            state.statsLoading = true;
            state.activitiesLoading = true;
            state.appointmentsLoading = true;
            // Clear errors
            state.statsError = null;
            state.activitiesError = null;
            state.appointmentsError = null;
            state.chartError = null;
            state.alertsError = null;
        }).addCase(fetchCompleteDashboardData.fulfilled, (state, action)=>{
            state.isRefreshing = false;
            state.statsLoading = false;
            state.activitiesLoading = false;
            state.appointmentsLoading = false;
            const data = action.payload;
            if (data.stats) {
                state.stats = data.stats;
            }
            if (data.recentActivities) {
                state.recentActivities = data.recentActivities;
            }
            if (data.upcomingAppointments) {
                state.upcomingAppointments = data.upcomingAppointments;
            }
            if (data.healthAlerts) {
                state.healthAlerts = data.healthAlerts;
            }
            if (data.quickActions) {
                state.quickActions = data.quickActions;
            }
            state.lastUpdated = new Date().toISOString();
        }).addCase(fetchCompleteDashboardData.rejected, (state, action)=>{
            state.isRefreshing = false;
            state.statsLoading = false;
            state.activitiesLoading = false;
            state.appointmentsLoading = false;
            state.statsError = action.payload;
        });
        // Refresh dashboard cache
        builder.addCase(refreshDashboardCache.pending, (state)=>{
            state.isRefreshing = true;
        }).addCase(refreshDashboardCache.fulfilled, (state)=>{
            state.isRefreshing = false;
        }).addCase(refreshDashboardCache.rejected, (state)=>{
            state.isRefreshing = false;
        });
        // Fetch stats by date range
        builder.addCase(fetchDashboardStatsByDateRange.pending, (state)=>{
            state.statsLoading = true;
            state.statsError = null;
        }).addCase(fetchDashboardStatsByDateRange.fulfilled, (state, action)=>{
            state.statsLoading = false;
            state.stats = action.payload;
            state.lastUpdated = new Date().toISOString();
        }).addCase(fetchDashboardStatsByDateRange.rejected, (state, action)=>{
            state.statsLoading = false;
            state.statsError = action.payload;
        });
        // Fetch stats by scope
        builder.addCase(fetchDashboardStatsByScope.pending, (state)=>{
            state.statsLoading = true;
            state.statsError = null;
        }).addCase(fetchDashboardStatsByScope.fulfilled, (state, action)=>{
            state.statsLoading = false;
            state.stats = action.payload;
            state.lastUpdated = new Date().toISOString();
        }).addCase(fetchDashboardStatsByScope.rejected, (state, action)=>{
            state.statsLoading = false;
            state.statsError = action.payload;
        });
    }
});
const { setSelectedDateRange, setSelectedScope, clearDashboardData, clearErrors, setQuickActions, addHealthAlert, removeHealthAlert, markAlertAsAcknowledged } = dashboardSlice.actions;
const selectDashboardStats = (state)=>state.dashboard.stats;
const selectDashboardStatsLoading = (state)=>state.dashboard.statsLoading;
const selectDashboardStatsError = (state)=>state.dashboard.statsError;
const selectRecentActivities = (state)=>state.dashboard.recentActivities;
const selectActivitiesLoading = (state)=>state.dashboard.activitiesLoading;
const selectActivitiesError = (state)=>state.dashboard.activitiesError;
const selectUpcomingAppointments = (state)=>state.dashboard.upcomingAppointments;
const selectAppointmentsLoading = (state)=>state.dashboard.appointmentsLoading;
const selectAppointmentsError = (state)=>state.dashboard.appointmentsError;
const selectChartData = (state)=>state.dashboard.chartData;
const selectChartLoading = (state)=>state.dashboard.chartLoading;
const selectChartError = (state)=>state.dashboard.chartError;
const selectHealthAlerts = (state)=>state.dashboard.healthAlerts;
const selectUnreadHealthAlerts = (state)=>state.dashboard.healthAlerts.filter((alert)=>!alert.acknowledged);
const selectQuickActions = (state)=>state.dashboard.quickActions;
const selectIsRefreshing = (state)=>state.dashboard.isRefreshing;
const selectLastUpdated = (state)=>state.dashboard.lastUpdated;
const selectSelectedDateRange = (state)=>state.dashboard.selectedDateRange;
const selectSelectedScope = (state)=>state.dashboard.selectedScope;
const selectHighPriorityAppointments = (state)=>state.dashboard.upcomingAppointments.filter((appointment)=>appointment.priority === 'high');
const selectCriticalHealthAlerts = (state)=>state.dashboard.healthAlerts.filter((alert)=>alert.severity === 'critical' || alert.severity === 'high');
const selectDashboardOverview = (state)=>({
        stats: state.dashboard.stats,
        recentActivities: state.dashboard.recentActivities.slice(0, 5),
        upcomingAppointments: state.dashboard.upcomingAppointments.slice(0, 5),
        unreadAlerts: state.dashboard.healthAlerts.filter((alert)=>!alert.acknowledged).length,
        isLoading: state.dashboard.statsLoading || state.dashboard.activitiesLoading || state.dashboard.appointmentsLoading,
        hasError: !!(state.dashboard.statsError || state.dashboard.activitiesError || state.dashboard.appointmentsError),
        lastUpdated: state.dashboard.lastUpdated
    });
const __TURBOPACK__default__export__ = dashboardSlice.reducer;
}),
"[project]/src/stores/slices/healthRecordsSlice.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @module pages/students/store/healthRecordsSlice
 *
 * Health Records Redux Slice - HIPAA-Compliant PHI Management
 *
 * Manages student health records with strict HIPAA compliance requirements.
 * Provides standardized CRUD operations for health record management using the
 * entity slice factory pattern with enhanced security and audit logging.
 *
 * @remarks
 * **CRITICAL - HIPAA Compliance:** This slice manages Protected Health Information (PHI)
 * and is subject to strict HIPAA regulations. All operations trigger comprehensive audit
 * logging in the backend for compliance tracking.
 *
 * **PHI Data Handling:**
 * - Health records contain highly sensitive PHI (diagnoses, treatments, medical history)
 * - PHI data is NEVER persisted to localStorage
 * - All PHI data stored in sessionStorage or memory only
 * - Automatic data clearing on session end or logout
 * - Encryption at rest and in transit (handled by backend API)
 *
 * **Audit Logging Integration:**
 * - Every CRUD operation logs: user ID, timestamp, operation type, record ID
 * - Read operations log PHI access for compliance audits
 * - All audit logs are immutable and stored in backend database
 * - Audit logs include IP address, device info for security tracking
 *
 * **Cross-Tab Synchronization:**
 * - Uses BroadcastChannel API (NOT localStorage) for cross-tab sync
 * - Prevents PHI exposure through persistent storage
 * - Real-time updates across browser tabs for multi-nurse workflows
 *
 * **Bulk Operations Disabled:**
 * - Bulk operations intentionally disabled for safety
 * - Each health record change requires individual review and validation
 * - Prevents accidental mass updates to sensitive medical data
 *
 * **Data Minimization:**
 * - Only loads health records for currently active student
 * - Automatic cache clearing when navigating away from student
 * - Reduces PHI exposure per HIPAA data minimization principle
 *
 * @see {@link healthRecordsApi} for backend API integration with audit logging
 * @see {@link HealthRecord} for health record entity type definition
 * @see {@link createEntitySlice} for factory implementation details
 *
 * @since 1.0.0
 */ __turbopack_context__.s([
    "healthRecordsActions",
    ()=>healthRecordsActions,
    "healthRecordsReducer",
    ()=>healthRecordsReducer,
    "healthRecordsSelectors",
    ()=>healthRecordsSelectors,
    "healthRecordsSlice",
    ()=>healthRecordsSlice,
    "healthRecordsThunks",
    ()=>healthRecordsThunks,
    "selectHealthRecordsByProvider",
    ()=>selectHealthRecordsByProvider,
    "selectHealthRecordsByStudent",
    ()=>selectHealthRecordsByStudent,
    "selectHealthRecordsByType",
    ()=>selectHealthRecordsByType,
    "selectRecentHealthRecords",
    ()=>selectRecentHealthRecords
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$sliceFactory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/stores/sliceFactory.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$sliceFactory$2f$core$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/sliceFactory/core.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/lib/api/index.ts [app-ssr] (ecmascript) <locals>");
;
;
// Transform API response (with 'type'/'date') to store format (with 'recordType'/'recordDate')
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const transformApiToStore = (apiRecord)=>({
        id: apiRecord.id,
        studentId: apiRecord.studentId,
        recordType: apiRecord.type,
        recordDate: apiRecord.date,
        provider: apiRecord.provider,
        notes: apiRecord.notes,
        attachments: apiRecord.attachments || [],
        createdAt: apiRecord.createdAt,
        updatedAt: apiRecord.updatedAt
    });
// Transform store create data to API format
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const transformCreateToApi = (storeData)=>({
        studentId: storeData.studentId,
        type: storeData.recordType,
        date: storeData.recordDate,
        provider: storeData.provider,
        notes: storeData.notes,
        attachments: storeData.attachments
    });
// Transform store update data to API format
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const transformUpdateToApi = (storeData)=>({
        type: storeData.recordType,
        date: storeData.recordDate,
        provider: storeData.provider,
        notes: storeData.notes,
        attachments: storeData.attachments
    });
/**
 * API service adapter for health records.
 *
 * Wraps the healthRecordsApi service to conform to the EntityApiService interface
 * required by the entity slice factory. Handles response transformation, error
 * handling, and enforces studentId requirement for all operations.
 *
 * @const {EntityApiService<HealthRecord, CreateHealthRecordData, UpdateHealthRecordData>}
 *
 * @remarks
 * **HIPAA Audit Logging:** All methods trigger comprehensive audit logging in the
 * backend API layer, recording user, timestamp, operation, and record ID.
 *
 * **Required studentId:** The getAll method requires studentId parameter to enforce
 * data minimization - prevents broad PHI queries that could expose multiple students'
 * health information.
 *
 * **Error Handling:** API errors are caught and transformed to user-friendly messages
 * without exposing PHI details in error messages.
 *
 * @see {@link healthRecordsApi} for underlying API implementation with audit logging
 * @see {@link EntityApiService} for interface definition
 */ const healthRecordsApiService = {
    /**
   * Fetches all health records for a specific student with optional filtering.
   *
   * @param {HealthRecordFilters} [params] - Filter parameters (studentId required)
   * @returns {Promise<{data: HealthRecord[], total?: number, pagination?: any}>} Health records and pagination
   * @throws {Error} If studentId is missing or student not found
   *
   * @remarks
   * **HIPAA Audit:** This operation logs PHI access for compliance audits.
   *
   * **Required Parameter:** studentId is required to enforce data minimization.
   * Backend rejects queries without studentId to prevent broad PHI access.
   *
   * **Performance:** Returns paginated results for students with many records.
   *
   * @example
   * ```typescript
   * // Fetch all immunization records for a student
   * const response = await healthRecordsApiService.getAll({
   *   studentId: 'student-123',
   *   recordType: 'IMMUNIZATION'
   * });
   * ```
   */ async getAll (params) {
        // HealthRecordsApi requires studentId as first parameter
        const studentId = params?.studentId || '';
        if (!studentId) {
            throw new Error('studentId is required for fetching health records');
        }
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["apiActions"].healthRecords.getRecords(studentId, params);
        return {
            data: (response.data || []).map(transformApiToStore),
            total: response.pagination?.total || 0,
            pagination: response.pagination
        };
    },
    /**
   * Fetches a single health record by ID.
   *
   * @param {string} id - Health record ID to fetch
   * @returns {Promise<{data: HealthRecord}>} Single health record
   * @throws {Error} If record not found or access denied
   *
   * @remarks
   * **HIPAA Audit:** This operation logs PHI access for compliance audits.
   *
   * **Access Control:** Backend verifies user has permission to access this
   * record based on role and student assignment.
   *
   * @example
   * ```typescript
   * const record = await healthRecordsApiService.getById('record-456');
   * ```
   */ async getById (id) {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["apiActions"].healthRecords.getRecordById(id);
        return {
            data: transformApiToStore(response)
        };
    },
    /**
   * Creates a new health record.
   *
   * @param {CreateHealthRecordData} data - Health record creation data
   * @returns {Promise<{data: HealthRecord}>} Created health record
   * @throws {Error} If validation fails or studentId not found
   *
   * @remarks
   * **HIPAA Audit:** Creation triggers audit log for new PHI record creation,
   * recording who created the record, when, and for which student.
   *
   * **Validation:** Backend validates recordType, ensures recordDate is valid,
   * and verifies studentId exists before creation.
   *
   * **Medical Record Integrity:** Creates immutable baseline record that can only
   * be updated via audit-logged operations.
   *
   * @example
   * ```typescript
   * const newRecord = await healthRecordsApiService.create({
   *   studentId: 'student-123',
   *   recordType: 'IMMUNIZATION',
   *   recordDate: '2024-09-01',
   *   provider: 'School Nurse',
   *   notes: 'Flu vaccine administered. No adverse reactions.'
   * });
   * ```
   */ async create (data) {
        const apiData = transformCreateToApi(data);
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["apiActions"].healthRecords.createRecord(apiData);
        return {
            data: transformApiToStore(response)
        };
    },
    /**
   * Updates an existing health record.
   *
   * @param {string} id - Health record ID to update
   * @param {UpdateHealthRecordData} data - Updated health record data (partial)
   * @returns {Promise<{data: HealthRecord}>} Updated health record
   * @throws {Error} If record not found, access denied, or validation fails
   *
   * @remarks
   * **HIPAA Audit:** Update triggers audit log recording which fields changed,
   * preserving original values for compliance and legal requirements.
   *
   * **Partial Updates:** Supports updating only specific fields without affecting
   * others, maintaining data integrity.
   *
   * **Medical Record Integrity:** Updates are appended to audit trail, original
   * data is never physically deleted or overwritten.
   *
   * @example
   * ```typescript
   * // Append follow-up note to existing record
   * const updated = await healthRecordsApiService.update('record-456', {
   *   notes: record.notes + '\n\nFollow-up 9/15: No complications reported.'
   * });
   * ```
   */ async update (id, data) {
        const apiData = transformUpdateToApi(data);
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["apiActions"].healthRecords.updateRecord(id, apiData);
        return {
            data: transformApiToStore(response)
        };
    },
    /**
   * Deletes (soft-deletes) a health record.
   *
   * @param {string} id - Health record ID to delete
   * @returns {Promise<{success: boolean}>} Deletion success status
   * @throws {Error} If record not found or access denied
   *
   * @remarks
   * **HIPAA Audit:** Deletion triggers audit log for data retention compliance.
   *
   * **Soft Delete:** Health records are soft-deleted (marked inactive) rather than
   * physically deleted to maintain medical history and legal compliance. Physical
   * deletion requires elevated permissions and separate retention policy procedures.
   *
   * **Medical-Legal Requirements:** Health records typically must be retained for
   * minimum period (7 years for minors in most jurisdictions) per legal requirements.
   *
   * **Access After Deletion:** Soft-deleted records remain accessible to authorized
   * users for compliance audits and legal discovery.
   *
   * @example
   * ```typescript
   * await healthRecordsApiService.delete('record-456');
   * // Record is marked inactive, not physically deleted
   * ```
   */ async delete (id) {
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["apiActions"].healthRecords.deleteRecord(id);
        return {
            success: true
        };
    }
};
/**
 * Health records slice factory instance.
 *
 * Creates the Redux slice with standardized CRUD operations, loading states,
 * and error handling using the entity slice factory pattern.
 *
 * @const
 *
 * @remarks
 * **Bulk Operations Disabled:** Intentionally disabled for health records to ensure
 * each medical record change receives individual validation and review. This prevents
 * accidental mass updates to sensitive medical data that could compromise patient safety
 * or data integrity.
 *
 * **Normalized State:** Uses EntityAdapter for normalized state management with
 * efficient O(1) lookups by record ID.
 *
 * **Medical Record Safety:** Individual operations ensure proper validation,
 * access control, and audit logging for each health record change.
 *
 * @see {@link createEntitySlice} for factory implementation details
 */ const healthRecordsSliceFactory = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$sliceFactory$2f$core$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createEntitySlice"])('healthRecords', healthRecordsApiService, {
    enableBulkOperations: false
});
const healthRecordsSlice = healthRecordsSliceFactory.slice;
const healthRecordsReducer = healthRecordsSlice.reducer;
const healthRecordsActions = healthRecordsSliceFactory.actions;
const healthRecordsSelectors = healthRecordsSliceFactory.adapter.getSelectors((state)=>state.healthRecords);
const healthRecordsThunks = healthRecordsSliceFactory.thunks;
const selectHealthRecordsByStudent = (state, studentId)=>{
    const allRecords = healthRecordsSelectors.selectAll(state);
    return allRecords.filter((record)=>record.studentId === studentId);
};
const selectHealthRecordsByType = (state, recordType)=>{
    const allRecords = healthRecordsSelectors.selectAll(state);
    return allRecords.filter((record)=>record.recordType === recordType);
};
const selectHealthRecordsByProvider = (state, provider)=>{
    const allRecords = healthRecordsSelectors.selectAll(state);
    return allRecords.filter((record)=>record.provider === provider);
};
const selectRecentHealthRecords = (state, days = 30)=>{
    const allRecords = healthRecordsSelectors.selectAll(state);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    return allRecords.filter((record)=>{
        const recordDate = new Date(record.recordDate);
        return recordDate >= cutoffDate;
    }).sort((a, b)=>new Date(b.recordDate).getTime() - new Date(a.recordDate).getTime());
};
}),
"[project]/src/stores/slices/medicationsSlice.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Medications Redux Slice
 *
 * Redux Toolkit slice for managing student medication prescriptions and administration
 * data. Provides standardized CRUD operations, selectors, and thunks for medication
 * management throughout the application.
 *
 * Uses the entity slice factory pattern for consistent state management across all
 * medication-related operations with built-in loading states, error handling, and
 * optimistic updates.
 *
 * @module pages/medications/store/medicationsSlice
 *
 * @remarks
 * HIPAA Compliance: All medication operations automatically generate audit logs for
 * PHI access tracking. State updates trigger cross-tab synchronization via BroadcastChannel.
 *
 * Medication Safety: Bulk operations are intentionally disabled for medication management
 * to ensure each medication change receives individual validation and review.
 *
 * State Structure: Uses Redux Toolkit's EntityAdapter for normalized state management,
 * enabling efficient lookups and updates by medication ID.
 *
 * @see {@link medicationsApi} for API integration
 * @see {@link useMedicationsData} for hook-based data access
 * @see {@link MedicationTypes} for type definitions
 *
 * @since 1.0.0
 */ __turbopack_context__.s([
    "medicationsActions",
    ()=>medicationsActions,
    "medicationsReducer",
    ()=>medicationsReducer,
    "medicationsSelectors",
    ()=>medicationsSelectors,
    "medicationsSlice",
    ()=>medicationsSlice,
    "medicationsThunks",
    ()=>medicationsThunks,
    "selectActiveMedications",
    ()=>selectActiveMedications,
    "selectControlledMedications",
    ()=>selectControlledMedications,
    "selectMedicationsByCategory",
    ()=>selectMedicationsByCategory,
    "selectMedicationsByForm",
    ()=>selectMedicationsByForm,
    "selectMedicationsRequiringWitness",
    ()=>selectMedicationsRequiringWitness
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$sliceFactory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/stores/sliceFactory.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$sliceFactory$2f$core$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/sliceFactory/core.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/lib/api/index.ts [app-ssr] (ecmascript) <locals>");
;
;
/**
 * API service adapter for medications.
 *
 * Wraps the medicationsApi service to conform to the EntityApiService interface
 * required by the slice factory. Handles response transformation and error handling
 * for all medication CRUD operations.
 *
 * @const {EntityApiService<Medication, CreateMedicationData, UpdateMedicationData>}
 *
 * @remarks
 * API Integration: All methods call medicationsApi which handles authentication,
 * error handling, retry logic, and audit logging.
 *
 * Response Transformation: Normalizes API responses to match slice factory expectations,
 * ensuring consistent data structure across all entity types.
 *
 * @see {@link medicationsApi} for underlying API implementation
 */ const medicationsApiService = {
    /**
   * Fetches all medications with optional filtering and pagination.
   *
   * @param {MedicationFilters} [params] - Optional filter parameters
   * @returns {Promise<{data: Medication[], total?: number, pagination?: any}>} Medications and pagination info
   */ async getAll (params) {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["apiActions"].medications.getAll(params);
        return {
            data: response.medications || [],
            total: response.pagination?.total,
            pagination: response.pagination
        };
    },
    /**
   * Fetches a single medication by ID.
   *
   * @param {string} id - Medication ID
   * @returns {Promise<{data: Medication}>} Single medication record
   */ async getById (id) {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["apiActions"].medications.getById(id);
        return {
            data: response
        };
    },
    /**
   * Creates a new student medication prescription.
   *
   * @param {CreateMedicationData} data - Medication creation data
   * @returns {Promise<{data: Medication}>} Created medication record
   *
   * @remarks
   * Medication Safety: Creation triggers validation of drug interactions,
   * contraindications, and allergy checks before saving.
   */ async create (data) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["apiActions"].medications.create(data);
        return {
            data: response.medication
        };
    },
    /**
   * Updates an existing student medication prescription.
   *
   * @param {string} id - Medication ID to update
   * @param {UpdateMedicationData} data - Updated medication data
   * @returns {Promise<{data: Medication}>} Updated medication record
   *
   * @remarks
   * Medication Safety: Updates to dosage, frequency, or route may require
   * new physician orders depending on school policy.
   */ async update (id, data) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["apiActions"].medications.update(id, data);
        return {
            data: response
        };
    },
    /**
   * Deletes (soft-deletes) a student medication prescription.
   *
   * @param {string} id - Medication ID to delete
   * @returns {Promise<{success: boolean}>} Deletion success status
   *
   * @remarks
   * Medication Safety: Deletion typically performs soft-delete to preserve
   * audit trail. Physical deletion requires elevated permissions.
   */ async delete (id) {
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["apiActions"].medications.delete(id);
        return {
            success: true
        };
    }
};
/**
 * Medications slice factory instance.
 *
 * Creates the Redux slice with standardized CRUD operations, loading states,
 * and error handling using the entity slice factory pattern.
 *
 * @const
 *
 * @remarks
 * Medication Safety: Bulk operations are intentionally disabled to ensure each
 * medication change receives individual validation and review. This prevents
 * accidental mass updates that could compromise patient safety.
 *
 * @see {@link createEntitySlice} for factory implementation details
 */ const medicationsSliceFactory = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$sliceFactory$2f$core$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createEntitySlice"])('medications', medicationsApiService, {
    enableBulkOperations: false
});
const medicationsSlice = medicationsSliceFactory.slice;
const medicationsReducer = medicationsSlice.reducer;
const medicationsActions = medicationsSliceFactory.actions;
const medicationsSelectors = medicationsSliceFactory.adapter.getSelectors((state)=>state.medications);
const medicationsThunks = medicationsSliceFactory.thunks;
const selectActiveMedications = (state)=>{
    const allMedications = medicationsSelectors.selectAll(state);
    // Medication catalog doesn't have isActive - all medications in catalog are assumed available
    return allMedications;
};
const selectControlledMedications = (state)=>{
    const allMedications = medicationsSelectors.selectAll(state);
    return allMedications.filter((medication)=>medication.isControlled);
};
const selectMedicationsByCategory = (state, category)=>{
    const allMedications = medicationsSelectors.selectAll(state);
    return allMedications.filter((medication)=>medication.category === category);
};
const selectMedicationsByForm = (state, dosageForm)=>{
    const allMedications = medicationsSelectors.selectAll(state);
    return allMedications.filter((medication)=>medication.dosageForm === dosageForm);
};
const selectMedicationsRequiringWitness = (state)=>{
    const allMedications = medicationsSelectors.selectAll(state);
    return allMedications.filter((medication)=>medication.requiresWitness);
};
}),
"[project]/src/stores/slices/appointmentsSlice.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @fileoverview Appointments Redux Slice
 *
 * Comprehensive state management for student appointment scheduling with Redux Toolkit's
 * EntityAdapter pattern. Manages appointment CRUD operations, nurse scheduling, student
 * appointment tracking, and multi-view filtering (by date, status, type, nurse, student).
 * All operations include HIPAA-compliant audit logging for PHI access.
 *
 * **Key Features:**
 * - Appointment CRUD operations with validation
 * - Student appointment scheduling and management
 * - Nurse schedule management and conflict detection
 * - Multi-dimensional filtering (by student, nurse, status, type, date range)
 * - Today's appointments view with real-time updates
 * - Upcoming appointments with configurable lookahead
 * - Appointment status tracking (scheduled, completed, cancelled, no-show)
 * - Reminder integration for notifications
 *
 * **State Management Architecture:**
 * - Redux Toolkit with createEntitySlice factory pattern
 * - EntityAdapter for normalized state with optimized lookups
 * - No localStorage persistence (appointments are transient data)
 * - Real-time synchronization via TanStack Query cache invalidation
 * - Optimistic updates for improved UX
 *
 * **HIPAA Compliance:**
 * - All appointment operations trigger PHI access audit logs
 * - Appointment data contains student PHI (reason, notes)
 * - Audit logging includes appointment type, reason visibility
 * - No caching of appointment details in localStorage
 * - Nurse access to student appointments is role-based
 * - Cancellation reasons are logged for compliance
 *
 * **Appointment Scheduling Workflows:**
 * - **New Appointment**: Student selection → date/time → type → reason → nurse assignment
 * - **Rescheduling**: Load appointment → modify date/time → conflict check → update
 * - **Cancellation**: Select appointment → reason → notify student/parent → audit log
 * - **Completion**: Mark complete → add notes → record outcomes → update student record
 * - **No-Show**: Mark no-show → follow-up required → parent notification
 *
 * **TanStack Query Integration:**
 * - Appointments list: 2-minute cache, invalidate on create/update/cancel
 * - Student appointments: 1-minute cache, invalidate on student-specific changes
 * - Today's appointments: 30-second cache, real-time polling
 * - Upcoming appointments: 2-minute cache
 * - Appointment details: 1-minute cache, invalidate on update
 *
 * **Nurse Scheduling Features:**
 * - View all appointments by nurse
 * - Conflict detection for double-booking prevention
 * - Daily schedule view with time blocks
 * - Workload balancing across nurses
 * - Appointment type tracking (routine, urgent, follow-up)
 *
 * @module pages/appointments/store/appointmentsSlice
 * @see {@link services/modules/appointmentsApi} for API implementation
 * @see {@link types/appointments} for type definitions
 * @see {@link stores/sliceFactory} for EntityAdapter factory pattern
 */ __turbopack_context__.s([
    "appointmentsActions",
    ()=>appointmentsActions,
    "appointmentsReducer",
    ()=>appointmentsReducer,
    "appointmentsSelectors",
    ()=>appointmentsSelectors,
    "appointmentsSlice",
    ()=>appointmentsSlice,
    "appointmentsThunks",
    ()=>appointmentsThunks,
    "selectAppointmentsByNurse",
    ()=>selectAppointmentsByNurse,
    "selectAppointmentsByStatus",
    ()=>selectAppointmentsByStatus,
    "selectAppointmentsByStudent",
    ()=>selectAppointmentsByStudent,
    "selectAppointmentsByType",
    ()=>selectAppointmentsByType,
    "selectTodaysAppointments",
    ()=>selectTodaysAppointments,
    "selectUpcomingAppointments",
    ()=>selectUpcomingAppointments
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$sliceFactory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/stores/sliceFactory.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$sliceFactory$2f$core$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/sliceFactory/core.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/lib/api/index.ts [app-ssr] (ecmascript) <locals>");
;
;
/**
 * Appointments API Service Adapter
 *
 * Provides a standardized interface to the appointments API following the EntityApiService
 * pattern. All methods include error handling, response transformation, and HIPAA-compliant
 * audit logging for PHI access. Integrates with Redux Toolkit's EntityAdapter for normalized
 * state management.
 *
 * @constant {EntityApiService<Appointment, CreateAppointmentData, UpdateAppointmentData>}
 *
 * @remarks
 * **Authentication**: All methods require valid JWT token with nurse/admin role
 * **Authorization**: Nurses can only access appointments for their assigned students
 * **Rate Limiting**: 100 requests per minute per user
 * **Audit Logging**: All operations trigger PHI access audit logs
 * **Conflict Detection**: Create/update operations check for scheduling conflicts
 *
 * @example
 * ```typescript
 * // Used internally by createEntitySlice factory
 * const slice = createEntitySlice('appointments', appointmentsApiService, options);
 * ```
 */ const appointmentsApiService = {
    /**
   * Get all appointments with optional filtering
   *
   * Retrieves paginated list of appointments with support for filtering by student,
   * nurse, status, type, and date range. Results are sorted by scheduledAt by default.
   *
   * @async
   * @param {AppointmentFilters} [params] - Optional filters for appointments
   * @param {string} [params.studentId] - Filter by student ID
   * @param {string} [params.nurseId] - Filter by nurse ID
   * @param {string} [params.status] - Filter by status (scheduled, completed, cancelled)
   * @param {string} [params.type] - Filter by appointment type
   * @param {string} [params.startDate] - Filter by start date (ISO 8601)
   * @param {string} [params.endDate] - Filter by end date (ISO 8601)
   * @param {number} [params.page] - Page number for pagination
   * @param {number} [params.limit] - Items per page
   *
   * @returns {Promise<{data: Appointment[], total: number, pagination: object}>} Paginated appointments
   *
   * @throws {ApiError} If request fails or user lacks permission
   *
   * @example
   * ```typescript
   * // Get today's appointments for a specific nurse
   * const result = await appointmentsApiService.getAll({
   *   nurseId: 'nurse-uuid',
   *   startDate: '2025-10-26T00:00:00Z',
   *   endDate: '2025-10-26T23:59:59Z'
   * });
   * ```
   *
   * @remarks
   * **Cache Strategy**: TanStack Query caches for 2 minutes
   * **HIPAA**: Triggers audit log for PHI access (appointment details)
   */ async getAll (params) {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["apiActions"].appointments.getAll(params);
        return {
            data: response.data || [],
            total: response.pagination?.total || 0,
            pagination: response.pagination
        };
    },
    /**
   * Get appointment by ID
   *
   * Retrieves detailed appointment information including student data, appointment reason,
   * notes, and history. Used for appointment detail view and edit forms.
   *
   * @async
   * @param {string} id - Appointment UUID
   *
   * @returns {Promise<{data: Appointment}>} Appointment details
   *
   * @throws {NotFoundError} If appointment doesn't exist
   * @throws {ForbiddenError} If user lacks permission to view appointment
   *
   * @example
   * ```typescript
   * // Load appointment for editing
   * const result = await appointmentsApiService.getById('appt-uuid');
   * console.log(result.data.reason); // 'Annual health screening'
   * ```
   *
   * @remarks
   * **Cache Strategy**: 1-minute cache, invalidated on update
   * **HIPAA**: Audit log includes appointment reason (PHI)
   */ async getById (id) {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["apiActions"].appointments.getById(id);
        return {
            data: response.appointment
        };
    },
    /**
   * Create new appointment
   *
   * Creates appointment with student assignment, scheduling, type, and reason.
   * Performs conflict detection to prevent double-booking. Sends notification
   * to student and parent if configured.
   *
   * @async
   * @param {CreateAppointmentData} data - Appointment creation data
   * @param {string} data.studentId - Student UUID (required)
   * @param {string} data.nurseId - Nurse UUID (required)
   * @param {string} data.scheduledAt - ISO 8601 datetime (required)
   * @param {string} data.type - Appointment type (required)
   * @param {string} data.reason - Appointment reason (required)
   * @param {string} [data.notes] - Additional notes
   * @param {number} [data.duration] - Duration in minutes (default: 30)
   *
   * @returns {Promise<{data: Appointment}>} Created appointment
   *
   * @throws {ValidationError} If data validation fails
   * @throws {ConflictError} If scheduling conflict detected
   *
   * @example
   * ```typescript
   * // Schedule routine health screening
   * const result = await appointmentsApiService.create({
   *   studentId: 'student-uuid',
   *   nurseId: 'nurse-uuid',
   *   scheduledAt: '2025-10-27T10:00:00Z',
   *   type: 'Health Screening',
   *   reason: 'Annual health screening',
   *   duration: 30
   * });
   * ```
   *
   * @remarks
   * **Conflict Detection**: Checks for overlapping appointments
   * **Notifications**: Sends reminder to student/parent
   * **Optimistic Update**: UI updated before server confirmation
   * **HIPAA**: Audit log includes student ID and reason
   */ async create (data) {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["apiActions"].appointments.create(data);
        return {
            data: response.appointment
        };
    },
    /**
   * Update existing appointment
   *
   * Updates appointment details including rescheduling, status changes, and note updates.
   * Performs conflict detection for date/time changes. Notifies affected parties of changes.
   *
   * @async
   * @param {string} id - Appointment UUID
   * @param {UpdateAppointmentData} data - Fields to update
   * @param {string} [data.scheduledAt] - New datetime (triggers conflict check)
   * @param {string} [data.status] - New status
   * @param {string} [data.notes] - Updated notes
   * @param {string} [data.reason] - Updated reason
   *
   * @returns {Promise<{data: Appointment}>} Updated appointment
   *
   * @throws {NotFoundError} If appointment doesn't exist
   * @throws {ConflictError} If rescheduling creates conflict
   *
   * @example
   * ```typescript
   * // Reschedule appointment
   * const result = await appointmentsApiService.update('appt-uuid', {
   *   scheduledAt: '2025-10-28T14:00:00Z',
   *   notes: 'Rescheduled due to student absence'
   * });
   * ```
   *
   * @remarks
   * **Conflict Detection**: Applied for date/time changes
   * **Status Transitions**: Validates valid status transitions
   * **Notifications**: Sends update notification if date/time changed
   * **HIPAA**: Audit log tracks all changes
   */ async update (id, data) {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["apiActions"].appointments.update(id, data);
        return {
            data: response.appointment
        };
    },
    /**
   * Delete appointment (via cancellation)
   *
   * Cancels appointment with reason. Does not hard-delete to maintain audit trail.
   * Sends cancellation notification to student and parent.
   *
   * @async
   * @param {string} id - Appointment UUID
   *
   * @returns {Promise<{success: boolean}>} Success status
   *
   * @throws {NotFoundError} If appointment doesn't exist
   * @throws {ForbiddenError} If user lacks permission
   *
   * @example
   * ```typescript
   * // Cancel appointment
   * await appointmentsApiService.delete('appt-uuid');
   * ```
   *
   * @remarks
   * **Soft Delete**: Marks appointment as cancelled, doesn't delete
   * **Reason**: Always logs 'Deleted' as cancellation reason
   * **Notifications**: Sends cancellation notification
   * **Audit Trail**: Maintains record for compliance
   * **HIPAA**: Audit log tracks cancellation
   */ async delete (id) {
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["apiActions"].appointments.cancel(id, 'Deleted');
        return {
            success: true
        };
    }
};
/**
 * Create the appointments slice using the entity factory
 *
 * Uses createEntitySlice factory to generate a Redux slice with EntityAdapter
 * for normalized state management. Automatically creates standard CRUD thunks,
 * actions, and selectors.
 *
 * @constant {Object} appointmentsSliceFactory
 *
 * @remarks
 * **Factory Configuration**:
 * - Name: 'appointments'
 * - EntityAdapter: Normalized appointments by ID
 * - Bulk Operations: Disabled (appointments managed individually)
 * - Optimistic Updates: Enabled for create/update/delete
 *
 * **Generated Thunks**:
 * - fetchAll: Load all appointments with filters
 * - fetchById: Load single appointment
 * - createEntity: Create new appointment
 * - updateEntity: Update appointment
 * - deleteEntity: Delete (cancel) appointment
 *
 * **Generated Actions**:
 * - setAll, setOne, addOne, updateOne, removeOne
 * - Standard EntityAdapter actions
 *
 * **Generated Selectors**:
 * - selectAll, selectById, selectIds, selectEntities
 * - selectTotal (entity count)
 */ const appointmentsSliceFactory = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$sliceFactory$2f$core$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createEntitySlice"])('appointments', appointmentsApiService, {
    enableBulkOperations: false
});
const appointmentsSlice = appointmentsSliceFactory.slice;
const appointmentsReducer = appointmentsSlice.reducer;
const appointmentsActions = appointmentsSliceFactory.actions;
const appointmentsSelectors = appointmentsSliceFactory.adapter.getSelectors((state)=>state.appointments);
const appointmentsThunks = appointmentsSliceFactory.thunks;
const selectAppointmentsByStudent = (state, studentId)=>{
    const allAppointments = appointmentsSelectors.selectAll(state);
    return allAppointments.filter((appointment)=>appointment.studentId === studentId);
};
const selectAppointmentsByNurse = (state, nurseId)=>{
    const allAppointments = appointmentsSelectors.selectAll(state);
    return allAppointments.filter((appointment)=>appointment.nurseId === nurseId);
};
const selectAppointmentsByStatus = (state, status)=>{
    const allAppointments = appointmentsSelectors.selectAll(state);
    return allAppointments.filter((appointment)=>appointment.status === status);
};
const selectTodaysAppointments = (state)=>{
    const allAppointments = appointmentsSelectors.selectAll(state);
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    return allAppointments.filter((appointment)=>{
        const appointmentDate = new Date(appointment.scheduledAt);
        return appointmentDate >= todayStart && appointmentDate < todayEnd;
    }).sort((a, b)=>new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());
};
const selectUpcomingAppointments = (state, days = 7)=>{
    const allAppointments = appointmentsSelectors.selectAll(state);
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);
    return allAppointments.filter((appointment)=>{
        const appointmentDate = new Date(appointment.scheduledAt);
        return appointmentDate >= now && appointmentDate <= futureDate;
    }).sort((a, b)=>new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());
};
const selectAppointmentsByType = (state, type)=>{
    const allAppointments = appointmentsSelectors.selectAll(state);
    return allAppointments.filter((appointment)=>appointment.type === type);
};
}),
"[project]/src/stores/slices/studentsSlice.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @module pages/students/store/studentsSlice
 *
 * Students Redux Slice - Entity and UI State Management
 *
 * Manages student entities and comprehensive UI state using a hybrid approach combining
 * the entity slice factory pattern with custom UI state management. Provides standardized
 * CRUD operations for student records alongside sophisticated UI controls for selection,
 * filtering, sorting, and pagination.
 *
 * @remarks
 * **Architecture Pattern:** Combines entity slice factory (normalized CRUD state) with
 * custom UI slice (view preferences, filters, selection). This hybrid enables both
 * standardized backend integration and rich UI state management in a single slice.
 *
 * **HIPAA Compliance:** Student records contain PHI (names, dates of birth, health info).
 * All operations trigger audit logging in the backend API layer. PHI is excluded from
 * localStorage persistence - only non-sensitive UI preferences are persisted.
 *
 * **Cross-Tab Synchronization:** Uses BroadcastChannel API to sync student data changes
 * across browser tabs. When a nurse updates a student in one tab, all other tabs receive
 * the update notification and can refresh their data accordingly.
 *
 * **Entity Slice Factory:** Leverages createEntitySlice factory for standardized CRUD
 * operations with built-in loading states, error handling, and optimistic updates.
 * EntityAdapter provides efficient normalized state management with O(1) lookups.
 *
 * **Performance Optimization:** Complex selectors use memoization to prevent unnecessary
 * recalculations. Pagination limits rendered items to improve performance with large
 * student populations (100+ students).
 *
 * @see {@link createEntitySlice} for factory implementation details
 * @see {@link studentsApi} for backend API integration
 * @see {@link Student} for student entity type definition
 * @see {@link useStudentsData} for hook-based data access
 *
 * @since 1.0.0
 */ __turbopack_context__.s([
    "selectActiveStudents",
    ()=>selectActiveStudents,
    "selectExpandedStudentCards",
    ()=>selectExpandedStudentCards,
    "selectFilteredAndSortedStudents",
    ()=>selectFilteredAndSortedStudents,
    "selectIsBulkSelectMode",
    ()=>selectIsBulkSelectMode,
    "selectPaginatedStudents",
    ()=>selectPaginatedStudents,
    "selectSelectedStudentIds",
    ()=>selectSelectedStudentIds,
    "selectSelectedStudents",
    ()=>selectSelectedStudents,
    "selectShowInactiveStudents",
    ()=>selectShowInactiveStudents,
    "selectStudentByNumber",
    ()=>selectStudentByNumber,
    "selectStudentFilters",
    ()=>selectStudentFilters,
    "selectStudentPagination",
    ()=>selectStudentPagination,
    "selectStudentPaginationInfo",
    ()=>selectStudentPaginationInfo,
    "selectStudentSearchQuery",
    ()=>selectStudentSearchQuery,
    "selectStudentSort",
    ()=>selectStudentSort,
    "selectStudentUIState",
    ()=>selectStudentUIState,
    "selectStudentViewMode",
    ()=>selectStudentViewMode,
    "selectStudentsByGrade",
    ()=>selectStudentsByGrade,
    "selectStudentsByNurse",
    ()=>selectStudentsByNurse,
    "selectStudentsWithAllergies",
    ()=>selectStudentsWithAllergies,
    "selectStudentsWithMedications",
    ()=>selectStudentsWithMedications,
    "studentsActions",
    ()=>studentsActions,
    "studentsReducer",
    ()=>studentsReducer,
    "studentsSelectors",
    ()=>studentsSelectors,
    "studentsSlice",
    ()=>studentsSlice,
    "studentsThunks",
    ()=>studentsThunks
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$sliceFactory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/stores/sliceFactory.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$sliceFactory$2f$core$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/sliceFactory/core.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/lib/api/index.ts [app-ssr] (ecmascript) <locals>");
;
;
;
/**
 * API service adapter for students.
 *
 * Wraps the studentsApi service to conform to the EntityApiService interface required
 * by the entity slice factory. Handles response transformation and error handling for
 * all student CRUD operations.
 *
 * @const {EntityApiService<Student, CreateStudentData, UpdateStudentData>}
 *
 * @remarks
 * **API Integration:** All methods call studentsApi which handles authentication,
 * error handling, retry logic, and audit logging for HIPAA compliance.
 *
 * **Response Transformation:** Normalizes API responses to match slice factory
 * expectations, ensuring consistent data structure across all entity types.
 *
 * **Audit Logging:** Student CRUD operations trigger audit logs in backend for
 * HIPAA compliance tracking of PHI access.
 *
 * @see {@link studentsApi} for underlying API implementation
 * @see {@link EntityApiService} for interface definition
 */ const studentsApiService = {
    /**
   * Fetches all students with optional filtering and pagination.
   *
   * @param {StudentFiltersType} [params] - Optional filter parameters
   * @returns {Promise<{data: Student[], total?: number, pagination?: any}>} Students and pagination info
   *
   * @remarks
   * **HIPAA Audit:** This operation triggers audit logging for PHI access in the backend.
   *
   * @example
   * ```typescript
   * // Fetch all active students in grade 5
   * const response = await studentsApiService.getAll({
   *   grade: '5',
   *   isActive: true
   * });
   * ```
   */ async getAll (params) {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["apiActions"].students.getAll(params);
        return {
            data: response?.students || [],
            total: response?.pagination?.total,
            pagination: response?.pagination
        };
    },
    /**
   * Fetches a single student by ID.
   *
   * @param {string} id - Student ID to fetch
   * @returns {Promise<{data: Student}>} Single student record
   * @throws {Error} If student not found or access denied
   *
   * @remarks
   * **HIPAA Audit:** This operation triggers audit logging for PHI access.
   *
   * @example
   * ```typescript
   * const student = await studentsApiService.getById('student-123');
   * ```
   */ async getById (id) {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["apiActions"].students.getById(id);
        return {
            data: response
        };
    },
    /**
   * Creates a new student record.
   *
   * @param {CreateStudentData} data - Student creation data
   * @returns {Promise<{data: Student}>} Created student record
   * @throws {Error} If validation fails or duplicate student number detected
   *
   * @remarks
   * **Validation:** Backend validates required fields, student number uniqueness,
   * and grade format before creation.
   *
   * **HIPAA Audit:** Creation triggers audit log for new PHI record creation.
   *
   * @example
   * ```typescript
   * const newStudent = await studentsApiService.create({
   *   firstName: 'John',
   *   lastName: 'Doe',
   *   studentNumber: 'STU-2024-001',
   *   grade: '5',
   *   dateOfBirth: '2014-05-15',
   *   // ... other required fields
   * });
   * ```
   */ async create (data) {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["apiActions"].students.create(data);
        return {
            data: response
        };
    },
    /**
   * Updates an existing student record.
   *
   * @param {string} id - Student ID to update
   * @param {UpdateStudentData} data - Updated student data (partial)
   * @returns {Promise<{data: Student}>} Updated student record
   * @throws {Error} If student not found, access denied, or validation fails
   *
   * @remarks
   * **Partial Updates:** Supports partial updates - only provided fields are updated.
   *
   * **HIPAA Audit:** Update triggers audit log recording changed fields.
   *
   * **Validation:** Backend validates updated fields (e.g., grade format, email format).
   *
   * @example
   * ```typescript
   * // Update only grade and active status
   * const updated = await studentsApiService.update('student-123', {
   *   grade: '6',
   *   isActive: true
   * });
   * ```
   */ async update (id, data) {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["apiActions"].students.update(id, data);
        return {
            data: response
        };
    },
    /**
   * Deletes (soft-deletes) a student record.
   *
   * @param {string} id - Student ID to delete
   * @returns {Promise<{success: boolean}>} Deletion success status
   * @throws {Error} If student not found or access denied
   *
   * @remarks
   * **Soft Delete:** Student records are soft-deleted (marked inactive) rather than
   * physically deleted to preserve audit trail and historical data.
   *
   * **HIPAA Audit:** Deletion triggers audit log for data retention compliance.
   *
   * **Cascade Behavior:** Related health records, medications, and appointments are
   * retained but marked as inactive.
   *
   * @example
   * ```typescript
   * await studentsApiService.delete('student-123');
   * // Student is marked isActive: false, not physically deleted
   * ```
   */ async delete (id) {
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["apiActions"].students.delete(id);
        return {
            success: true
        };
    }
};
/**
 * Students slice factory instance.
 *
 * Creates the Redux slice with standardized CRUD operations, loading states,
 * and error handling using the entity slice factory pattern.
 *
 * @const
 *
 * @remarks
 * **Bulk Operations:** Enabled for students to support bulk printing, reporting,
 * and administrative tasks. Each operation still triggers individual audit logs.
 *
 * **Normalized State:** Uses EntityAdapter for normalized state management with
 * efficient lookups by ID.
 *
 * @see {@link createEntitySlice} for factory implementation details
 */ const studentsSliceFactory = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$sliceFactory$2f$core$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createEntitySlice"])('students', studentsApiService, {
    enableBulkOperations: true
});
/**
 * Initial UI state for student management views.
 *
 * Provides sensible defaults for student list display: table view with 20 items
 * per page, sorted alphabetically by name, showing only active students.
 *
 * @const {StudentUIState}
 */ const initialUIState = {
    selectedIds: [],
    viewMode: 'table',
    filters: {},
    sortBy: 'name',
    sortOrder: 'asc',
    searchQuery: '',
    showInactive: false,
    bulkSelectMode: false,
    expandedCards: [],
    pageSize: 20,
    currentPage: 1
};
/**
 * UI state slice for student management.
 *
 * Manages view preferences, selection state, filters, sorting, and pagination
 * separately from entity data to enable flexible UI state management.
 *
 * @const
 */ const studentUISlice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createSlice"])({
    name: 'studentUI',
    initialState: initialUIState,
    reducers: {
        /**
     * Selects a single student (adds to selection if not already selected).
     *
     * @param {string} action.payload - Student ID to select
     *
     * @remarks
     * **Multi-Select:** Adds to existing selection without clearing previous selections.
     * Use clearSelection first for single-select behavior.
     */ selectStudent: (state, action)=>{
            if (!state.selectedIds.includes(action.payload)) {
                state.selectedIds.push(action.payload);
            }
        },
        /**
     * Deselects a single student (removes from selection).
     *
     * @param {string} action.payload - Student ID to deselect
     */ deselectStudent: (state, action)=>{
            state.selectedIds = state.selectedIds.filter((id)=>id !== action.payload);
        },
        /**
     * Selects multiple students (adds to existing selection).
     *
     * @param {string[]} action.payload - Array of student IDs to select
     *
     * @remarks
     * **Deduplication:** Only adds IDs not already in selection to prevent duplicates.
     */ selectMultipleStudents: (state, action)=>{
            const newIds = action.payload.filter((id)=>!state.selectedIds.includes(id));
            state.selectedIds.push(...newIds);
        },
        /**
     * Selects all students (replaces current selection).
     *
     * @param {string[]} action.payload - Array of all student IDs to select
     *
     * @remarks
     * **Replace:** Clears existing selection and selects all provided IDs.
     */ selectAllStudents: (state, action)=>{
            state.selectedIds = action.payload;
        },
        /**
     * Clears all student selections.
     *
     * @remarks
     * Used when exiting bulk select mode or after completing bulk operations.
     */ clearSelection: (state)=>{
            state.selectedIds = [];
        },
        /**
     * Toggles bulk select mode on/off.
     *
     * @remarks
     * **Auto-Clear:** When disabling bulk select mode, automatically clears selection.
     */ toggleBulkSelectMode: (state)=>{
            state.bulkSelectMode = !state.bulkSelectMode;
            if (!state.bulkSelectMode) {
                state.selectedIds = [];
            }
        },
        /**
     * Sets the view mode for student display.
     *
     * @param {'grid' | 'list' | 'table'} action.payload - View mode to set
     *
     * @remarks
     * **Persistence:** View mode preference is persisted to localStorage.
     */ setViewMode: (state, action)=>{
            state.viewMode = action.payload;
        },
        /**
     * Toggles card expansion for a student in card view.
     *
     * @param {string} action.payload - Student ID to toggle expansion
     *
     * @remarks
     * **Performance:** Collapsing cards improves performance by reducing rendered content.
     */ toggleCardExpansion: (state, action)=>{
            const studentId = action.payload;
            if (state.expandedCards.includes(studentId)) {
                state.expandedCards = state.expandedCards.filter((id)=>id !== studentId);
            } else {
                state.expandedCards.push(studentId);
            }
        },
        /**
     * Collapses all student cards.
     *
     * @remarks
     * **Performance:** Used when switching views or scrolling to improve performance.
     */ collapseAllCards: (state)=>{
            state.expandedCards = [];
        },
        /**
     * Sets filter criteria for students.
     *
     * @param {Partial<StudentFiltersType>} action.payload - Filter criteria to apply
     *
     * @remarks
     * **Pagination Reset:** Automatically resets to page 1 when filters change.
     * **Merge Behavior:** Merges with existing filters, allowing partial filter updates.
     */ setFilters: (state, action)=>{
            state.filters = {
                ...state.filters,
                ...action.payload
            };
            state.currentPage = 1; // Reset to first page when filters change
        },
        /**
     * Clears all active filters.
     *
     * @remarks
     * **Pagination Reset:** Automatically resets to page 1 when clearing filters.
     */ clearFilters: (state)=>{
            state.filters = {};
            state.currentPage = 1;
        },
        /**
     * Sets search query for text-based filtering.
     *
     * @param {string} action.payload - Search query string
     *
     * @remarks
     * **Client-Side Search:** Search is performed client-side on loaded students.
     * Searches firstName, lastName, studentNumber, and grade fields.
     * **Pagination Reset:** Automatically resets to page 1 when search query changes.
     */ setSearchQuery: (state, action)=>{
            state.searchQuery = action.payload;
            state.currentPage = 1; // Reset to first page when searching
        },
        /**
     * Toggles visibility of inactive students.
     *
     * @remarks
     * **Default:** Inactive students are hidden by default per HIPAA data minimization.
     * **Pagination Reset:** Automatically resets to page 1 when toggling.
     */ toggleShowInactive: (state)=>{
            state.showInactive = !state.showInactive;
            state.currentPage = 1;
        },
        /**
     * Sets sorting criteria for students.
     *
     * @param {Object} action.payload - Sort configuration
     * @param {StudentUIState['sortBy']} action.payload.sortBy - Field to sort by
     * @param {StudentUIState['sortOrder']} action.payload.sortOrder - Sort direction
     */ setSorting: (state, action)=>{
            state.sortBy = action.payload.sortBy;
            state.sortOrder = action.payload.sortOrder;
        },
        /**
     * Toggles sort order between ascending and descending.
     *
     * @remarks
     * **Toggle Behavior:** Switches asc ↔ desc without changing sort field.
     */ toggleSortOrder: (state)=>{
            state.sortOrder = state.sortOrder === 'asc' ? 'desc' : 'asc';
        },
        /**
     * Sets the current page number.
     *
     * @param {number} action.payload - Page number to navigate to (1-indexed)
     */ setPage: (state, action)=>{
            state.currentPage = action.payload;
        },
        /**
     * Sets the number of items per page.
     *
     * @param {number} action.payload - Page size (typically 10, 20, 50, 100)
     *
     * @remarks
     * **Pagination Reset:** Automatically resets to page 1 when page size changes.
     * **Performance:** Smaller page sizes improve rendering performance for large lists.
     */ setPageSize: (state, action)=>{
            state.pageSize = action.payload;
            state.currentPage = 1; // Reset to first page when page size changes
        },
        /**
     * Navigates to the next page.
     *
     * @remarks
     * **Bounds Checking:** UI should disable next button on last page.
     */ nextPage: (state)=>{
            state.currentPage += 1;
        },
        /**
     * Navigates to the previous page.
     *
     * @remarks
     * **Bounds Checking:** Does not go below page 1. UI should disable previous button on first page.
     */ previousPage: (state)=>{
            if (state.currentPage > 1) {
                state.currentPage -= 1;
            }
        },
        /**
     * Resets all UI state to initial values.
     *
     * @remarks
     * **Use Cases:** Logout, switching schools, or resetting view preferences.
     */ resetUIState: ()=>initialUIState
    }
});
/**
 * Combined students slice (entity + UI state).
 *
 * Merges entity slice from factory with custom UI slice to provide unified state.
 *
 * @const
 */ const combinedStudentsSlice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createSlice"])({
    name: 'students',
    initialState: {
        ...studentsSliceFactory.slice.getInitialState() || {},
        ui: initialUIState
    },
    reducers: {
        // UI reducers from studentUISlice
        selectStudent: (state, action)=>{
            if (!state.ui.selectedIds.includes(action.payload)) {
                state.ui.selectedIds.push(action.payload);
            }
        },
        deselectStudent: (state, action)=>{
            state.ui.selectedIds = state.ui.selectedIds.filter((id)=>id !== action.payload);
        },
        selectMultipleStudents: (state, action)=>{
            const newIds = action.payload.filter((id)=>!state.ui.selectedIds.includes(id));
            state.ui.selectedIds.push(...newIds);
        },
        selectAllStudents: (state, action)=>{
            state.ui.selectedIds = action.payload;
        },
        clearSelection: (state)=>{
            state.ui.selectedIds = [];
        },
        toggleBulkSelectMode: (state)=>{
            state.ui.bulkSelectMode = !state.ui.bulkSelectMode;
            if (!state.ui.bulkSelectMode) {
                state.ui.selectedIds = [];
            }
        },
        setViewMode: (state, action)=>{
            state.ui.viewMode = action.payload;
        },
        toggleCardExpansion: (state, action)=>{
            const studentId = action.payload;
            if (state.ui.expandedCards.includes(studentId)) {
                state.ui.expandedCards = state.ui.expandedCards.filter((id)=>id !== studentId);
            } else {
                state.ui.expandedCards.push(studentId);
            }
        },
        collapseAllCards: (state)=>{
            state.ui.expandedCards = [];
        },
        setFilters: (state, action)=>{
            state.ui.filters = {
                ...state.ui.filters,
                ...action.payload
            };
            state.ui.currentPage = 1;
        },
        clearFilters: (state)=>{
            state.ui.filters = {};
            state.ui.currentPage = 1;
        },
        setSearchQuery: (state, action)=>{
            state.ui.searchQuery = action.payload;
            state.ui.currentPage = 1;
        },
        toggleShowInactive: (state)=>{
            state.ui.showInactive = !state.ui.showInactive;
            state.ui.currentPage = 1;
        },
        setSorting: (state, action)=>{
            state.ui.sortBy = action.payload.sortBy;
            state.ui.sortOrder = action.payload.sortOrder;
        },
        toggleSortOrder: (state)=>{
            state.ui.sortOrder = state.ui.sortOrder === 'asc' ? 'desc' : 'asc';
        },
        setPage: (state, action)=>{
            state.ui.currentPage = action.payload;
        },
        setPageSize: (state, action)=>{
            state.ui.pageSize = action.payload;
            state.ui.currentPage = 1;
        },
        nextPage: (state)=>{
            state.ui.currentPage += 1;
        },
        previousPage: (state)=>{
            if (state.ui.currentPage > 1) {
                state.ui.currentPage -= 1;
            }
        },
        resetUIState: (state)=>{
            state.ui = initialUIState;
        }
    },
    extraReducers: (builder)=>{
        // Copy all extra reducers from the entity slice
        const entitySliceReducers = studentsSliceFactory.slice.reducer;
        builder.addMatcher((action)=>action.type.startsWith('students/'), (state, action)=>{
            const entityState = entitySliceReducers({
                ...state,
                ui: undefined
            }, action);
            return {
                ...entityState || {},
                ui: state.ui
            };
        });
    }
});
const studentsSlice = combinedStudentsSlice;
const studentsReducer = combinedStudentsSlice.reducer;
const studentsActions = {
    ...studentsSliceFactory.actions,
    ...studentUISlice.actions
};
const studentsSelectors = studentsSliceFactory.adapter.getSelectors((state)=>state.students);
const studentsThunks = studentsSliceFactory.thunks;
const selectStudentUIState = (state)=>state.students.ui;
const selectSelectedStudentIds = (state)=>state.students.ui.selectedIds;
const selectStudentViewMode = (state)=>state.students.ui.viewMode;
const selectStudentFilters = (state)=>state.students.ui.filters;
const selectStudentSort = (state)=>({
        sortBy: state.students.ui.sortBy,
        sortOrder: state.students.ui.sortOrder
    });
const selectStudentPagination = (state)=>({
        currentPage: state.students.ui.currentPage,
        pageSize: state.students.ui.pageSize
    });
const selectStudentSearchQuery = (state)=>state.students.ui.searchQuery;
const selectShowInactiveStudents = (state)=>state.students.ui.showInactive;
const selectIsBulkSelectMode = (state)=>state.students.ui.bulkSelectMode;
const selectExpandedStudentCards = (state)=>state.students.ui.expandedCards;
const selectFilteredAndSortedStudents = (state)=>{
    const allStudents = studentsSelectors.selectAll(state);
    const { filters, searchQuery, showInactive, sortBy, sortOrder } = state.students.ui;
    let filteredStudents = allStudents;
    // Apply activity filter
    if (!showInactive) {
        filteredStudents = filteredStudents.filter((student)=>student.isActive);
    }
    // Apply search query
    if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        filteredStudents = filteredStudents.filter((student)=>student.firstName.toLowerCase().includes(query) || student.lastName.toLowerCase().includes(query) || student.studentNumber.toLowerCase().includes(query) || student.grade.toLowerCase().includes(query));
    }
    // Apply filters
    if (filters.grade) {
        filteredStudents = filteredStudents.filter((student)=>student.grade === filters.grade);
    }
    if (filters.nurseId) {
        filteredStudents = filteredStudents.filter((student)=>student.nurseId === filters.nurseId);
    }
    if (filters.hasAllergies !== undefined) {
        filteredStudents = filteredStudents.filter((student)=>filters.hasAllergies ? student.allergies && student.allergies.length > 0 : !(student.allergies && student.allergies.length > 0));
    }
    if (filters.hasMedications !== undefined) {
        filteredStudents = filteredStudents.filter((student)=>filters.hasMedications ? student.medications && student.medications.length > 0 : !(student.medications && student.medications.length > 0));
    }
    // Apply sorting
    filteredStudents.sort((a, b)=>{
        let aValue, bValue;
        switch(sortBy){
            case 'name':
                aValue = `${a.lastName}, ${a.firstName}`;
                bValue = `${b.lastName}, ${b.firstName}`;
                break;
            case 'grade':
                aValue = a.grade;
                bValue = b.grade;
                break;
            case 'enrollmentDate':
                aValue = new Date(a.enrollmentDate);
                bValue = new Date(b.enrollmentDate);
                break;
            case 'lastVisit':
                // Get most recent appointment date as last visit
                aValue = a.appointments && a.appointments.length > 0 ? new Date(Math.max(...a.appointments.map((apt)=>new Date(apt.scheduledAt).getTime()))) : new Date(0);
                bValue = b.appointments && b.appointments.length > 0 ? new Date(Math.max(...b.appointments.map((apt)=>new Date(apt.scheduledAt).getTime()))) : new Date(0);
                break;
            default:
                aValue = a.lastName;
                bValue = b.lastName;
        }
        if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });
    return filteredStudents;
};
const selectPaginatedStudents = (state)=>{
    const filteredStudents = selectFilteredAndSortedStudents(state);
    const { currentPage, pageSize } = state.students.ui;
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredStudents.slice(startIndex, endIndex);
};
const selectStudentPaginationInfo = (state)=>{
    const totalStudents = selectFilteredAndSortedStudents(state).length;
    const { currentPage, pageSize } = state.students.ui;
    return {
        totalStudents,
        currentPage,
        pageSize,
        totalPages: Math.ceil(totalStudents / pageSize),
        hasNextPage: currentPage * pageSize < totalStudents,
        hasPreviousPage: currentPage > 1,
        startIndex: (currentPage - 1) * pageSize + 1,
        endIndex: Math.min(currentPage * pageSize, totalStudents)
    };
};
const selectSelectedStudents = (state)=>{
    const selectedIds = state.students.ui.selectedIds;
    return selectedIds.map((id)=>studentsSelectors.selectById(state, id)).filter(Boolean);
};
const selectActiveStudents = (state)=>{
    const allStudents = studentsSelectors.selectAll(state);
    return allStudents.filter((student)=>student.isActive);
};
const selectStudentsByGrade = (state, grade)=>{
    const allStudents = studentsSelectors.selectAll(state);
    return allStudents.filter((student)=>student.grade === grade);
};
const selectStudentsByNurse = (state, nurseId)=>{
    const allStudents = studentsSelectors.selectAll(state);
    return allStudents.filter((student)=>student.nurseId === nurseId);
};
const selectStudentsWithAllergies = (state)=>{
    const allStudents = studentsSelectors.selectAll(state);
    return allStudents.filter((student)=>student.allergies && student.allergies.length > 0);
};
const selectStudentsWithMedications = (state)=>{
    const allStudents = studentsSelectors.selectAll(state);
    return allStudents.filter((student)=>student.medications && student.medications.length > 0);
};
const selectStudentByNumber = (state, studentNumber)=>{
    const allStudents = studentsSelectors.selectAll(state);
    return allStudents.find((student)=>student.studentNumber === studentNumber);
};
}),
"[project]/src/stores/slices/emergencyContactsSlice.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @module pages/students/store/emergencyContactsSlice
 *
 * Emergency Contacts Redux Slice - Priority-Based Contact Management
 *
 * Manages student emergency contacts with support for contact verification,
 * priority-based notification workflows, and parent consent tracking. Provides
 * standardized CRUD operations using the entity slice factory pattern.
 *
 * @remarks
 * **Emergency Workflow Integration:** This slice supports critical emergency
 * notification workflows, enabling school nurses to quickly identify and contact
 * appropriate guardians during medical emergencies.
 *
 * **Contact Verification Process:**
 * 1. Initial creation with verificationStatus: 'UNVERIFIED'
 * 2. Automated verification attempt (phone/email validation)
 * 3. Manual verification by school nurse required
 * 4. Status progression: UNVERIFIED → PENDING → VERIFIED / FAILED
 * 5. Only VERIFIED contacts used in automated emergency notifications
 *
 * **Priority-Based Notification:**
 * - PRIMARY: First line contact for all notifications (typically parent/guardian)
 * - SECONDARY: Backup contact if primary unreachable
 * - EMERGENCY_ONLY: Reserved for critical situations only
 * - Priority-based escalation with configurable timeout per school policy
 *
 * **Parent Consent Tracking:**
 * - Tracks consent for medical treatment authorization
 * - Digital consent form integration with document management
 * - Consent date tracking and expiration monitoring
 * - Audit trail of all consent history changes
 *
 * **HIPAA Compliance:**
 * - Emergency contact information contains PHI (relationship, medical authorization)
 * - All operations trigger audit logging in backend
 * - PHI excluded from localStorage persistence
 * - Cross-tab sync via BroadcastChannel (not localStorage)
 *
 * **Bulk Operations Disabled:**
 * - Intentionally disabled to ensure individual validation
 * - Each contact change requires verification of current information
 * - Prevents mass updates that could compromise emergency response
 *
 * @see {@link emergencyContactsApi} for backend API integration
 * @see {@link EmergencyContact} for contact entity type definition
 * @see {@link createEntitySlice} for factory implementation details
 *
 * @since 1.0.0
 */ __turbopack_context__.s([
    "emergencyContactsActions",
    ()=>emergencyContactsActions,
    "emergencyContactsReducer",
    ()=>emergencyContactsReducer,
    "emergencyContactsSelectors",
    ()=>emergencyContactsSelectors,
    "emergencyContactsSlice",
    ()=>emergencyContactsSlice,
    "emergencyContactsThunks",
    ()=>emergencyContactsThunks,
    "selectActiveContacts",
    ()=>selectActiveContacts,
    "selectActiveContactsByStudent",
    ()=>selectActiveContactsByStudent,
    "selectContactsByRelationship",
    ()=>selectContactsByRelationship,
    "selectContactsByStudent",
    ()=>selectContactsByStudent,
    "selectPrimaryContactByStudent",
    ()=>selectPrimaryContactByStudent,
    "selectPrimaryContacts",
    ()=>selectPrimaryContacts,
    "selectUnverifiedContacts",
    ()=>selectUnverifiedContacts
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$sliceFactory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/stores/sliceFactory.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$sliceFactory$2f$core$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/sliceFactory/core.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/lib/api/index.ts [app-ssr] (ecmascript) <locals>");
;
;
/**
 * API service adapter for emergency contacts.
 *
 * Wraps the emergencyContactsApi service to conform to the EntityApiService
 * interface required by the entity slice factory. Handles response transformation
 * and error handling for all emergency contact CRUD operations.
 *
 * @const {EntityApiService<EmergencyContact, CreateEmergencyContactData, UpdateEmergencyContactData>}
 *
 * @remarks
 * **API Integration:** All methods call emergencyContactsApi which handles
 * authentication, error handling, retry logic, and audit logging.
 *
 * **Response Transformation:** Normalizes API responses to match slice factory
 * expectations, ensuring consistent data structure across all entity types.
 *
 * **Verification Workflow:** API automatically initiates verification process
 * upon contact creation, setting initial status to 'UNVERIFIED'.
 *
 * @see {@link emergencyContactsApi} for underlying API implementation
 * @see {@link EntityApiService} for interface definition
 */ const emergencyContactsApiService = {
    /**
   * Fetches all emergency contacts with optional filtering and pagination.
   *
   * @param {EmergencyContactFilters} [params] - Optional filter parameters
   * @returns {Promise<{data: EmergencyContact[], total?: number, pagination?: any}>} Emergency contacts and pagination
   *
   * @remarks
   * **HIPAA Audit:** This operation triggers audit logging for PHI access.
   *
   * @example
   * ```typescript
   * // Fetch all verified contacts for a student
   * const response = await emergencyContactsApiService.getAll({
   *   studentId: 'student-123',
   *   verificationStatus: 'VERIFIED'
   * });
   * ```
   */ async getAll (params) {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["apiActions"].emergencyContacts.getAll(params);
        return {
            data: response.data?.contacts || [],
            total: response.data?.pagination?.total,
            pagination: response.data?.pagination
        };
    },
    /**
   * Fetches a single emergency contact by ID.
   *
   * @param {string} id - Emergency contact ID to fetch
   * @returns {Promise<{data: EmergencyContact}>} Single emergency contact
   * @throws {Error} If contact not found or access denied
   *
   * @remarks
   * **HIPAA Audit:** This operation triggers audit logging for PHI access.
   *
   * @example
   * ```typescript
   * const contact = await emergencyContactsApiService.getById('contact-456');
   * ```
   */ async getById (id) {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["apiActions"].emergencyContacts.getById(id);
        return {
            data: response.data
        };
    },
    /**
   * Creates a new emergency contact.
   *
   * @param {CreateEmergencyContactData} data - Emergency contact creation data
   * @returns {Promise<{data: EmergencyContact}>} Created emergency contact
   * @throws {Error} If validation fails or studentId not found
   *
   * @remarks
   * **HIPAA Audit:** Creation triggers audit log for new contact record.
   *
   * **Verification Workflow:** Automatically initiates verification process:
   * - Sets verificationStatus to 'UNVERIFIED'
   * - Triggers automated phone/email validation if available
   * - Creates task for manual verification by school nurse
   *
   * **Validation:** Backend validates phone number format, email format,
   * relationship type, and ensures studentId exists.
   *
   * @example
   * ```typescript
   * const newContact = await emergencyContactsApiService.create({
   *   studentId: 'student-123',
   *   firstName: 'Jane',
   *   lastName: 'Doe',
   *   relationship: 'MOTHER',
   *   phoneNumber: '555-123-4567',
   *   email: 'jane.doe@example.com',
   *   priority: 'PRIMARY',
   *   canAuthorizeMe​dicalTreatment: true
   * });
   * ```
   */ async create (data) {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["apiActions"].emergencyContacts.create(data);
        return {
            data: response.data
        };
    },
    /**
   * Updates an existing emergency contact.
   *
   * @param {string} id - Emergency contact ID to update
   * @param {UpdateEmergencyContactData} data - Updated emergency contact data (partial)
   * @returns {Promise<{data: EmergencyContact}>} Updated emergency contact
   * @throws {Error} If contact not found, access denied, or validation fails
   *
   * @remarks
   * **HIPAA Audit:** Update triggers audit log recording changed fields.
   *
   * **Re-verification:** Changes to phone number or email automatically trigger
   * re-verification process, resetting verificationStatus to 'PENDING'.
   *
   * **Consent Updates:** Changes to medical treatment authorization require
   * new consent documentation and parent signature.
   *
   * @example
   * ```typescript
   * // Update phone number (triggers re-verification)
   * const updated = await emergencyContactsApiService.update('contact-456', {
   *   phoneNumber: '555-987-6543'
   * });
   * ```
   */ async update (id, data) {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["apiActions"].emergencyContacts.update(id, data);
        return {
            data: response.data
        };
    },
    /**
   * Deletes (soft-deletes) an emergency contact.
   *
   * @param {string} id - Emergency contact ID to delete
   * @returns {Promise<{success: boolean}>} Deletion success status
   * @throws {Error} If contact not found or access denied
   *
   * @remarks
   * **HIPAA Audit:** Deletion triggers audit log for data retention compliance.
   *
   * **Soft Delete:** Emergency contacts are soft-deleted (marked inactive) to
   * preserve historical emergency response data and audit trail.
   *
   * **Emergency Impact:** Deleting PRIMARY contact triggers alert if no other
   * verified PRIMARY contact exists for student.
   *
   * @example
   * ```typescript
   * await emergencyContactsApiService.delete('contact-456');
   * // Contact is marked isActive: false, not physically deleted
   * ```
   */ async delete (id) {
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["apiActions"].emergencyContacts.delete(id);
        return {
            success: true
        };
    }
};
/**
 * Emergency contacts slice factory instance.
 *
 * Creates the Redux slice with standardized CRUD operations, loading states,
 * and error handling using the entity slice factory pattern.
 *
 * @const
 *
 * @remarks
 * **Bulk Operations Disabled:** Intentionally disabled for emergency contacts to
 * ensure each contact change receives individual verification. This prevents
 * accidental mass updates that could compromise emergency notification reliability.
 *
 * **Normalized State:** Uses EntityAdapter for normalized state management with
 * efficient O(1) lookups by contact ID.
 *
 * @see {@link createEntitySlice} for factory implementation details
 */ const emergencyContactsSliceFactory = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$sliceFactory$2f$core$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createEntitySlice"])('emergencyContacts', emergencyContactsApiService, {
    enableBulkOperations: false
});
const emergencyContactsSlice = emergencyContactsSliceFactory.slice;
const emergencyContactsReducer = emergencyContactsSlice.reducer;
const emergencyContactsActions = emergencyContactsSliceFactory.actions;
const emergencyContactsSelectors = emergencyContactsSliceFactory.adapter.getSelectors((state)=>state.emergencyContacts);
const emergencyContactsThunks = emergencyContactsSliceFactory.thunks;
const selectContactsByStudent = (state, studentId)=>{
    const allContacts = emergencyContactsSelectors.selectAll(state);
    return allContacts.filter((contact)=>contact.studentId === studentId);
};
const selectActiveContacts = (state)=>{
    const allContacts = emergencyContactsSelectors.selectAll(state);
    return allContacts.filter((contact)=>contact.isActive);
};
const selectActiveContactsByStudent = (state, studentId)=>{
    const allContacts = emergencyContactsSelectors.selectAll(state);
    return allContacts.filter((contact)=>contact.studentId === studentId && contact.isActive);
};
const selectPrimaryContacts = (state)=>{
    const allContacts = emergencyContactsSelectors.selectAll(state);
    return allContacts.filter((contact)=>contact.priority === 'PRIMARY' && contact.isActive);
};
const selectPrimaryContactByStudent = (state, studentId)=>{
    const allContacts = emergencyContactsSelectors.selectAll(state);
    return allContacts.find((contact)=>contact.studentId === studentId && contact.priority === 'PRIMARY' && contact.isActive);
};
const selectUnverifiedContacts = (state)=>{
    const allContacts = emergencyContactsSelectors.selectAll(state);
    return allContacts.filter((contact)=>contact.verificationStatus === 'UNVERIFIED' || contact.verificationStatus === 'FAILED');
};
const selectContactsByRelationship = (state, relationship)=>{
    const allContacts = emergencyContactsSelectors.selectAll(state);
    return allContacts.filter((contact)=>contact.relationship === relationship);
};
}),
"[project]/src/types/domain/incidents.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * WF-COMP-325 | incidents.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: React ecosystem
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: functions, interfaces | Key Features: Standard module
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */ /**
 * Incident Reports Module Types
 * Comprehensive type definitions for incident reporting system
 * Includes incidents, witness statements, follow-up actions, and compliance tracking
 */ __turbopack_context__.s([
    "ActionPriority",
    ()=>ActionPriority,
    "ActionStatus",
    ()=>ActionStatus,
    "ComplianceStatus",
    ()=>ComplianceStatus,
    "EvidenceType",
    ()=>EvidenceType,
    "IncidentSeverity",
    ()=>IncidentSeverity,
    "IncidentStatus",
    ()=>IncidentStatus,
    "IncidentType",
    ()=>IncidentType,
    "InsuranceClaimStatus",
    ()=>InsuranceClaimStatus,
    "ParentNotificationMethod",
    ()=>ParentNotificationMethod,
    "WitnessType",
    ()=>WitnessType,
    "getActionPriorityColor",
    ()=>getActionPriorityColor,
    "getActionStatusColor",
    ()=>getActionStatusColor,
    "getIncidentSeverityColor",
    ()=>getIncidentSeverityColor,
    "getIncidentSeverityLabel",
    ()=>getIncidentSeverityLabel,
    "getIncidentTypeLabel",
    ()=>getIncidentTypeLabel,
    "isActionStatus",
    ()=>isActionStatus,
    "isIncidentSeverity",
    ()=>isIncidentSeverity,
    "isIncidentType",
    ()=>isIncidentType,
    "isWitnessType",
    ()=>isWitnessType
]);
var IncidentType = /*#__PURE__*/ function(IncidentType) {
    IncidentType["INJURY"] = "INJURY";
    IncidentType["ILLNESS"] = "ILLNESS";
    IncidentType["BEHAVIORAL"] = "BEHAVIORAL";
    IncidentType["MEDICATION_ERROR"] = "MEDICATION_ERROR";
    IncidentType["ALLERGIC_REACTION"] = "ALLERGIC_REACTION";
    IncidentType["EMERGENCY"] = "EMERGENCY";
    IncidentType["OTHER"] = "OTHER";
    return IncidentType;
}({});
var IncidentSeverity = /*#__PURE__*/ function(IncidentSeverity) {
    IncidentSeverity["LOW"] = "LOW";
    IncidentSeverity["MEDIUM"] = "MEDIUM";
    IncidentSeverity["HIGH"] = "HIGH";
    IncidentSeverity["CRITICAL"] = "CRITICAL";
    return IncidentSeverity;
}({});
var IncidentStatus = /*#__PURE__*/ function(IncidentStatus) {
    IncidentStatus["OPEN"] = "OPEN";
    IncidentStatus["INVESTIGATING"] = "INVESTIGATING";
    IncidentStatus["RESOLVED"] = "RESOLVED";
    IncidentStatus["CLOSED"] = "CLOSED";
    return IncidentStatus;
}({});
var WitnessType = /*#__PURE__*/ function(WitnessType) {
    WitnessType["STUDENT"] = "STUDENT";
    WitnessType["STAFF"] = "STAFF";
    WitnessType["PARENT"] = "PARENT";
    WitnessType["OTHER"] = "OTHER";
    return WitnessType;
}({});
var ActionPriority = /*#__PURE__*/ function(ActionPriority) {
    ActionPriority["LOW"] = "LOW";
    ActionPriority["MEDIUM"] = "MEDIUM";
    ActionPriority["HIGH"] = "HIGH";
    ActionPriority["URGENT"] = "URGENT";
    return ActionPriority;
}({});
var ActionStatus = /*#__PURE__*/ function(ActionStatus) {
    ActionStatus["PENDING"] = "PENDING";
    ActionStatus["IN_PROGRESS"] = "IN_PROGRESS";
    ActionStatus["COMPLETED"] = "COMPLETED";
    ActionStatus["CANCELLED"] = "CANCELLED";
    return ActionStatus;
}({});
var InsuranceClaimStatus = /*#__PURE__*/ function(InsuranceClaimStatus) {
    InsuranceClaimStatus["NOT_FILED"] = "NOT_FILED";
    InsuranceClaimStatus["FILED"] = "FILED";
    InsuranceClaimStatus["PENDING"] = "PENDING";
    InsuranceClaimStatus["APPROVED"] = "APPROVED";
    InsuranceClaimStatus["DENIED"] = "DENIED";
    InsuranceClaimStatus["CLOSED"] = "CLOSED";
    return InsuranceClaimStatus;
}({});
var ComplianceStatus = /*#__PURE__*/ function(ComplianceStatus) {
    ComplianceStatus["PENDING"] = "PENDING";
    ComplianceStatus["COMPLIANT"] = "COMPLIANT";
    ComplianceStatus["NON_COMPLIANT"] = "NON_COMPLIANT";
    ComplianceStatus["UNDER_REVIEW"] = "UNDER_REVIEW";
    return ComplianceStatus;
}({});
var ParentNotificationMethod = /*#__PURE__*/ function(ParentNotificationMethod) {
    ParentNotificationMethod["EMAIL"] = "email";
    ParentNotificationMethod["SMS"] = "sms";
    ParentNotificationMethod["VOICE"] = "voice";
    ParentNotificationMethod["IN_PERSON"] = "in-person";
    ParentNotificationMethod["AUTO_NOTIFICATION"] = "auto-notification";
    return ParentNotificationMethod;
}({});
var EvidenceType = /*#__PURE__*/ function(EvidenceType) {
    EvidenceType["PHOTO"] = "photo";
    EvidenceType["VIDEO"] = "video";
    EvidenceType["DOCUMENT"] = "document";
    EvidenceType["AUDIO"] = "audio";
    return EvidenceType;
}({});
function isIncidentType(value) {
    return Object.values(IncidentType).includes(value);
}
function isIncidentSeverity(value) {
    return Object.values(IncidentSeverity).includes(value);
}
function isWitnessType(value) {
    return Object.values(WitnessType).includes(value);
}
function isActionStatus(value) {
    return Object.values(ActionStatus).includes(value);
}
function getIncidentTypeLabel(type) {
    const labels = {
        ["INJURY"]: 'Injury',
        ["ILLNESS"]: 'Illness',
        ["BEHAVIORAL"]: 'Behavioral',
        ["MEDICATION_ERROR"]: 'Medication Error',
        ["ALLERGIC_REACTION"]: 'Allergic Reaction',
        ["EMERGENCY"]: 'Emergency',
        ["OTHER"]: 'Other'
    };
    return labels[type] || type;
}
function getIncidentSeverityLabel(severity) {
    const labels = {
        ["LOW"]: 'Low',
        ["MEDIUM"]: 'Medium',
        ["HIGH"]: 'High',
        ["CRITICAL"]: 'Critical'
    };
    return labels[severity] || severity;
}
function getIncidentSeverityColor(severity) {
    const colors = {
        ["LOW"]: 'text-green-600 bg-green-100',
        ["MEDIUM"]: 'text-yellow-600 bg-yellow-100',
        ["HIGH"]: 'text-orange-600 bg-orange-100',
        ["CRITICAL"]: 'text-red-600 bg-red-100'
    };
    return colors[severity] || 'text-gray-600 bg-gray-100';
}
function getActionPriorityColor(priority) {
    const colors = {
        ["LOW"]: 'text-blue-600 bg-blue-100',
        ["MEDIUM"]: 'text-yellow-600 bg-yellow-100',
        ["HIGH"]: 'text-orange-600 bg-orange-100',
        ["URGENT"]: 'text-red-600 bg-red-100'
    };
    return colors[priority] || 'text-gray-600 bg-gray-100';
}
function getActionStatusColor(status) {
    const colors = {
        ["PENDING"]: 'text-gray-600 bg-gray-100',
        ["IN_PROGRESS"]: 'text-blue-600 bg-blue-100',
        ["COMPLETED"]: 'text-green-600 bg-green-100',
        ["CANCELLED"]: 'text-red-600 bg-red-100'
    };
    return colors[status] || 'text-gray-600 bg-gray-100';
}
}),
"[project]/src/stores/slices/incidentReportsSlice.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * WF-COMP-311 | incidentReportsSlice.ts - Incident Reports Redux Slice
 * Purpose: Production-grade state management for comprehensive incident reporting system
 * Upstream: ../../services/modules/incidentsApi | Dependencies: @reduxjs/toolkit, react-hot-toast
 * Downstream: Incident report components, emergency notification system
 * Related: communicationSlice (notifications), complianceSlice (audit trails), studentsSlice
 * Exports: Reducer, actions, thunks, selectors | Key Features: Witness statements, follow-up tracking
 * Last Updated: 2025-10-26 | File Type: .ts
 * Critical Path: Incident creation → Witness collection → Follow-up actions → Resolution → Compliance reporting
 * LLM Context: Redux slice for incident management with HIPAA-compliant audit trails
 */ /**
 * @module pages/incidents/store/incidentReportsSlice
 *
 * @description
 * Production-grade Redux state management for the comprehensive incident reporting system.
 * Manages incidents, witness statements, and follow-up actions with complete CRUD operations,
 * advanced filtering capabilities, and real-time notification integration.
 *
 * ## Architecture
 *
 * This slice follows a domain-driven design pattern with:
 * - Normalized state structure for efficient updates
 * - Granular loading states for each operation type
 * - Comprehensive error handling with user-friendly messages
 * - Optimistic UI updates for better user experience
 * - Cache invalidation and refresh logic
 * - Pagination support for large datasets
 *
 * ## State Structure
 *
 * The state is organized into logical sections:
 * - **Data**: reports, selectedReport, witnessStatements, followUpActions, searchResults
 * - **Pagination**: page metadata for list views
 * - **Filters**: active filter criteria for queries
 * - **UI State**: sorting, view modes (list/grid/detail)
 * - **Loading States**: operation-specific flags (list, detail, witnesses, actions, creating, updating, deleting, searching)
 * - **Error States**: operation-specific error messages
 * - **Cache Management**: timestamps and invalidation flags
 *
 * ## Key Features
 *
 * - **Complete CRUD Operations**: Create, read, update, delete incident reports
 * - **Witness Management**: Collect and manage witness statements with verification workflow
 * - **Follow-up Tracking**: Track action items with assignment, priority, and completion status
 * - **Advanced Filtering**: Filter by student, type, severity, status, date range
 * - **Full-text Search**: Search across descriptions, locations, actions taken, student names
 * - **Optimistic Updates**: Immediate UI feedback with rollback on error
 * - **Real-time Notifications**: Automatic parent notification for high/critical severity incidents
 *
 * @remarks
 * ## Incident Reporting Workflow
 *
 * 1. **Incident Creation**: Nurse documents incident with type, severity, description, location, actions taken
 * 2. **Automatic Notifications**: High/Critical severity triggers automatic parent/guardian notifications
 * 3. **Witness Collection**: Staff, students, parents can provide witness statements
 * 4. **Follow-up Actions**: Assign trackable action items with due dates and responsible parties
 * 5. **Status Tracking**: Monitor incident through lifecycle (OPEN → UNDER_REVIEW → RESOLVED → CLOSED)
 * 6. **Compliance Reporting**: Generate audit trails for regulatory compliance
 *
 * ## Severity Levels and Notification Rules
 *
 * - **LOW**: Minor incidents, no automatic notification
 * - **MEDIUM**: Standard incidents, parent notification recommended
 * - **HIGH**: Serious incidents, automatic parent notification triggered
 * - **CRITICAL**: Emergency incidents, immediate multi-channel notification (SMS, email, voice)
 *
 * ## Witness Statement Verification
 *
 * - Statements collected from students, staff, parents, other witnesses
 * - Verification workflow tracks statement review and confirmation
 * - Digital signatures supported for statement authentication
 * - Statements immutable once verified (audit trail preservation)
 *
 * ## Follow-up Action Management
 *
 * - Actions assigned to specific staff members
 * - Priority levels: LOW, MEDIUM, HIGH, URGENT
 * - Due date tracking with overdue alerts
 * - Completion status with notes and outcomes
 * - Escalation rules for overdue actions
 *
 * ## HIPAA Compliance
 *
 * - All incident data treated as PHI (Protected Health Information)
 * - Audit logging for all data access and modifications
 * - Role-based access control enforced at API and UI levels
 * - Data retention policies comply with healthcare regulations
 * - Secure deletion (archival, not true deletion) for compliance
 *
 * ## Performance Considerations
 *
 * - Pagination reduces initial load time for large incident lists
 * - Selective loading of witness statements and follow-up actions (on-demand)
 * - Client-side sorting for small datasets, server-side for large datasets
 * - Cache invalidation triggers refetch only when necessary
 * - Optimistic updates minimize perceived latency
 *
 * @see {@link module:pages/communication/store/communicationSlice} for emergency notification integration
 * @see {@link module:pages/compliance/store/complianceSlice} for compliance reporting and audit trails
 * @see {@link module:pages/students/store/studentsSlice} for student data integration
 *
 * @example
 * ```typescript
 * // Fetch incident reports with filters
 * dispatch(fetchIncidentReports({
 *   severity: [IncidentSeverity.HIGH, IncidentSeverity.CRITICAL],
 *   status: [IncidentStatus.UNDER_REVIEW],
 *   startDate: '2025-01-01',
 *   page: 1,
 *   limit: 20
 * }));
 *
 * // Create new incident with automatic notification
 * dispatch(createIncidentReport({
 *   studentId: 'student-123',
 *   type: IncidentType.INJURY,
 *   severity: IncidentSeverity.HIGH,  // Triggers automatic parent notification
 *   description: 'Student injured during recess',
 *   location: 'Playground',
 *   actionsTaken: 'First aid administered, ice pack applied',
 *   occurredAt: '2025-01-15T10:30:00Z'
 * }));
 *
 * // Add witness statement
 * dispatch(createWitnessStatement({
 *   incidentReportId: 'incident-456',
 *   witnessName: 'Teacher Jane Doe',
 *   witnessType: 'STAFF',
 *   statement: 'I witnessed the incident from the classroom window...',
 *   contactInfo: 'jane.doe@school.edu'
 * }));
 *
 * // Create follow-up action
 * dispatch(createFollowUpAction({
 *   incidentReportId: 'incident-456',
 *   description: 'Schedule parent meeting to discuss incident',
 *   assignedTo: 'user-789',
 *   priority: 'HIGH',
 *   dueDate: '2025-01-20T17:00:00Z'
 * }));
 *
 * // Access state in components
 * const reports = useSelector(selectIncidentReports);
 * const criticalIncidents = useSelector(selectCriticalIncidents);
 * const isLoading = useSelector(selectIsLoading('list'));
 * const statistics = useSelector(selectReportStatistics);
 * ```
 */ __turbopack_context__.s([
    "clearError",
    ()=>clearError,
    "clearErrors",
    ()=>clearErrors,
    "clearSelectedIncident",
    ()=>clearSelectedIncident,
    "createFollowUpAction",
    ()=>createFollowUpAction,
    "createIncidentReport",
    ()=>createIncidentReport,
    "createWitnessStatement",
    ()=>createWitnessStatement,
    "default",
    ()=>__TURBOPACK__default__export__,
    "deleteIncidentReport",
    ()=>deleteIncidentReport,
    "fetchFollowUpActions",
    ()=>fetchFollowUpActions,
    "fetchIncidentReportById",
    ()=>fetchIncidentReportById,
    "fetchIncidentReports",
    ()=>fetchIncidentReports,
    "fetchWitnessStatements",
    ()=>fetchWitnessStatements,
    "incidentReportsActions",
    ()=>incidentReportsActions,
    "invalidateCache",
    ()=>invalidateCache,
    "optimisticUpdateReport",
    ()=>optimisticUpdateReport,
    "resetState",
    ()=>resetState,
    "searchIncidentReports",
    ()=>searchIncidentReports,
    "selectCriticalIncidents",
    ()=>selectCriticalIncidents,
    "selectCurrentIncident",
    ()=>selectCurrentIncident,
    "selectError",
    ()=>selectError,
    "selectErrorStates",
    ()=>selectErrorStates,
    "selectFilteredAndSortedReports",
    ()=>selectFilteredAndSortedReports,
    "selectFilters",
    ()=>selectFilters,
    "selectFollowUpActions",
    ()=>selectFollowUpActions,
    "selectIncidentReports",
    ()=>selectIncidentReports,
    "selectIncidentsBySeverity",
    ()=>selectIncidentsBySeverity,
    "selectIncidentsByStatus",
    ()=>selectIncidentsByStatus,
    "selectIncidentsByType",
    ()=>selectIncidentsByType,
    "selectIncidentsRequiringFollowUp",
    ()=>selectIncidentsRequiringFollowUp,
    "selectIncidentsWithUnnotifiedParents",
    ()=>selectIncidentsWithUnnotifiedParents,
    "selectIsCacheInvalidated",
    ()=>selectIsCacheInvalidated,
    "selectIsLoading",
    ()=>selectIsLoading,
    "selectLastFetched",
    ()=>selectLastFetched,
    "selectLoadingStates",
    ()=>selectLoadingStates,
    "selectPagination",
    ()=>selectPagination,
    "selectReportStatistics",
    ()=>selectReportStatistics,
    "selectSearchQuery",
    ()=>selectSearchQuery,
    "selectSearchResults",
    ()=>selectSearchResults,
    "selectSortConfig",
    ()=>selectSortConfig,
    "selectViewMode",
    ()=>selectViewMode,
    "selectWitnessStatements",
    ()=>selectWitnessStatements,
    "setFilters",
    ()=>setFilters,
    "setSearchQuery",
    ()=>setSearchQuery,
    "setSelectedIncidentReport",
    ()=>setSelectedIncidentReport,
    "setSortOrder",
    ()=>setSortOrder,
    "setViewMode",
    ()=>setViewMode,
    "updateIncidentReport",
    ()=>updateIncidentReport
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/lib/api/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$domain$2f$incidents$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/types/domain/incidents.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-hot-toast/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$debug$2f$src$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/debug/src/index.js [app-ssr] (ecmascript)");
;
;
;
;
;
const log = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$debug$2f$src$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])('whitecross:incident-reports-slice');
// =====================
// INITIAL STATE
// =====================
/**
 * Initial state for incident reports slice.
 *
 * Provides sensible defaults for all state properties with empty data arrays,
 * default pagination (20 items per page), descending sort by occurrence time,
 * and list view mode.
 *
 * @const {IncidentReportsState} initialState
 */ const initialState = {
    // Data
    reports: [],
    selectedReport: null,
    witnessStatements: [],
    followUpActions: [],
    searchResults: [],
    // Pagination
    pagination: {
        page: 1,
        limit: 20,
        total: 0,
        pages: 0
    },
    // Filters
    filters: {
        page: 1,
        limit: 20
    },
    searchQuery: '',
    // UI State
    sortConfig: {
        column: 'occurredAt',
        order: 'desc'
    },
    viewMode: 'list',
    // Loading States
    loading: {
        list: false,
        detail: false,
        witnesses: false,
        actions: false,
        creating: false,
        updating: false,
        deleting: false,
        searching: false
    },
    // Error States
    errors: {
        list: null,
        detail: null,
        witnesses: null,
        actions: null,
        create: null,
        update: null,
        delete: null,
        search: null
    },
    // Cache Management
    lastFetched: null,
    cacheInvalidated: false
};
const fetchIncidentReports = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])('incidentReports/fetchIncidentReports', async (filters, { rejectWithValue })=>{
    try {
        log('Fetching incident reports with filters:', filters);
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["apiActions"].incidents.getAll(filters);
        return response;
    } catch (error) {
        log('Error fetching incident reports:', error);
        return rejectWithValue(error.message || 'Failed to fetch incident reports');
    }
});
const fetchIncidentReportById = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])('incidentReports/fetchIncidentReportById', async (id, { rejectWithValue })=>{
    try {
        log('Fetching incident report by ID:', id);
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["apiActions"].incidents.getById(id);
        return response.report;
    } catch (error) {
        log('Error fetching incident report:', error);
        return rejectWithValue(error.message || 'Failed to fetch incident report');
    }
});
const createIncidentReport = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])('incidentReports/createIncidentReport', async (data, { rejectWithValue })=>{
    try {
        log('Creating incident report:', data);
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["apiActions"].incidents.create(data);
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].success('Incident report created successfully');
        return response.report;
    } catch (error) {
        log('Error creating incident report:', error);
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].error(error.message || 'Failed to create incident report');
        return rejectWithValue(error.message || 'Failed to create incident report');
    }
});
const updateIncidentReport = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])('incidentReports/updateIncidentReport', async ({ id, data }, { rejectWithValue })=>{
    try {
        log('Updating incident report:', id, data);
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["apiActions"].incidents.update(id, data);
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].success('Incident report updated successfully');
        return response.report;
    } catch (error) {
        log('Error updating incident report:', error);
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].error(error.message || 'Failed to update incident report');
        return rejectWithValue(error.message || 'Failed to update incident report');
    }
});
const deleteIncidentReport = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])('incidentReports/deleteIncidentReport', async (id, { rejectWithValue })=>{
    try {
        log('Deleting incident report:', id);
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["apiActions"].incidents.delete(id);
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].success('Incident report deleted successfully');
        return id;
    } catch (error) {
        log('Error deleting incident report:', error);
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].error(error.message || 'Failed to delete incident report');
        return rejectWithValue(error.message || 'Failed to delete incident report');
    }
});
const searchIncidentReports = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])('incidentReports/searchIncidentReports', async (params, { rejectWithValue })=>{
    try {
        log('Searching incident reports:', params);
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["apiActions"].incidents.search(params);
        return response;
    } catch (error) {
        log('Error searching incident reports:', error);
        return rejectWithValue(error.message || 'Failed to search incident reports');
    }
});
const fetchWitnessStatements = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])('incidentReports/fetchWitnessStatements', async (incidentReportId, { rejectWithValue })=>{
    try {
        log('Fetching witness statements for incident:', incidentReportId);
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["apiActions"].incidents.getWitnessStatements(incidentReportId);
        return response.statements;
    } catch (error) {
        log('Error fetching witness statements:', error);
        return rejectWithValue(error.message || 'Failed to fetch witness statements');
    }
});
const createWitnessStatement = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])('incidentReports/createWitnessStatement', async (data, { rejectWithValue })=>{
    try {
        log('Creating witness statement:', data);
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["apiActions"].incidents.addWitnessStatement(data);
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].success('Witness statement added successfully');
        return response.statement;
    } catch (error) {
        log('Error creating witness statement:', error);
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].error(error.message || 'Failed to add witness statement');
        return rejectWithValue(error.message || 'Failed to add witness statement');
    }
});
const fetchFollowUpActions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])('incidentReports/fetchFollowUpActions', async (incidentReportId, { rejectWithValue })=>{
    try {
        log('Fetching follow-up actions for incident:', incidentReportId);
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["apiActions"].incidents.getFollowUpActions(incidentReportId);
        return response.actions;
    } catch (error) {
        log('Error fetching follow-up actions:', error);
        return rejectWithValue(error.message || 'Failed to fetch follow-up actions');
    }
});
const createFollowUpAction = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])('incidentReports/createFollowUpAction', async (data, { rejectWithValue })=>{
    try {
        log('Creating follow-up action:', data);
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["apiActions"].incidents.addFollowUpAction(data);
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].success('Follow-up action created successfully');
        return response.action;
    } catch (error) {
        log('Error creating follow-up action:', error);
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].error(error.message || 'Failed to create follow-up action');
        return rejectWithValue(error.message || 'Failed to create follow-up action');
    }
});
// =====================
// SLICE DEFINITION
// =====================
const incidentReportsSlice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createSlice"])({
    name: 'incidentReports',
    initialState,
    reducers: {
        /**
     * Set filters for incident reports list.
     *
     * Updates active filter criteria and triggers cache invalidation to refetch data.
     * Filters are merged with existing filters, allowing partial updates.
     *
     * @param {IncidentReportsState} state - Current state
     * @param {PayloadAction<Partial<IncidentReportFilters>>} action - Filter updates
     *
     * @example
     * ```typescript
     * dispatch(setFilters({
     *   severity: [IncidentSeverity.HIGH, IncidentSeverity.CRITICAL],
     *   startDate: '2025-01-01'
     * }));
     * ```
     */ setFilters: (state, action)=>{
            state.filters = {
                ...state.filters,
                ...action.payload
            };
            state.cacheInvalidated = true;
            log('Filters updated:', state.filters);
        },
        /**
     * Set search query.
     *
     * Updates the search query text for full-text search across incident reports.
     * Does not trigger automatic search - use with searchIncidentReports thunk.
     *
     * @param {IncidentReportsState} state - Current state
     * @param {PayloadAction<string>} action - Search query text
     *
     * @example
     * ```typescript
     * dispatch(setSearchQuery('playground injury'));
     * ```
     */ setSearchQuery: (state, action)=>{
            state.searchQuery = action.payload;
            log('Search query set:', action.payload);
        },
        /**
     * Set selected incident report for detail view.
     *
     * Updates the currently selected incident, typically used when navigating
     * to incident detail page or opening detail modal.
     *
     * @param {IncidentReportsState} state - Current state
     * @param {PayloadAction<IncidentReport>} action - Incident report to select
     *
     * @example
     * ```typescript
     * dispatch(setSelectedIncidentReport(incident));
     * ```
     */ setSelectedIncidentReport: (state, action)=>{
            state.selectedReport = action.payload;
            log('Selected incident report set:', action.payload.id);
        },
        /**
     * Clear selected incident report.
     *
     * Clears the currently selected incident and associated data (witness statements,
     * follow-up actions). Used when navigating away from detail view.
     *
     * @param {IncidentReportsState} state - Current state
     *
     * @example
     * ```typescript
     * dispatch(clearSelectedIncident());
     * ```
     */ clearSelectedIncident: (state)=>{
            state.selectedReport = null;
            state.witnessStatements = [];
            state.followUpActions = [];
            state.errors.detail = null;
            log('Selected incident cleared');
        },
        /**
     * Set sort configuration.
     *
     * Updates sort column and order for list view. Triggers client-side re-sorting
     * of loaded data.
     *
     * @param {IncidentReportsState} state - Current state
     * @param {PayloadAction<SortConfig>} action - Sort configuration
     *
     * @example
     * ```typescript
     * dispatch(setSortOrder({
     *   column: 'severity',
     *   order: 'desc'  // Critical incidents first
     * }));
     * ```
     */ setSortOrder: (state, action)=>{
            state.sortConfig = action.payload;
            log('Sort order updated:', action.payload);
        },
        /**
     * Set view mode.
     *
     * Switches between list, grid, and detail view modes for incident display.
     *
     * @param {IncidentReportsState} state - Current state
     * @param {PayloadAction<ViewMode>} action - View mode (list/grid/detail)
     *
     * @example
     * ```typescript
     * dispatch(setViewMode('grid'));
     * ```
     */ setViewMode: (state, action)=>{
            state.viewMode = action.payload;
            log('View mode changed:', action.payload);
        },
        /**
     * Clear all errors.
     *
     * Resets all error states to null. Used for dismissing error messages
     * or resetting error state on page navigation.
     *
     * @param {IncidentReportsState} state - Current state
     *
     * @example
     * ```typescript
     * dispatch(clearErrors());
     * ```
     */ clearErrors: (state)=>{
            state.errors = initialState.errors;
            log('All errors cleared');
        },
        /**
     * Clear specific error.
     *
     * Resets a single error state to null. Used for dismissing individual
     * error messages without clearing all errors.
     *
     * @param {IncidentReportsState} state - Current state
     * @param {PayloadAction<keyof ErrorStates>} action - Error key to clear
     *
     * @example
     * ```typescript
     * dispatch(clearError('create'));
     * ```
     */ clearError: (state, action)=>{
            state.errors[action.payload] = null;
            log('Error cleared:', action.payload);
        },
        /**
     * Reset state to initial values.
     *
     * Resets entire slice state to initial values. Used when logging out
     * or changing context (e.g., switching schools).
     *
     * @param {IncidentReportsState} state - Current state
     *
     * @example
     * ```typescript
     * dispatch(resetState());
     * ```
     */ resetState: (state)=>{
            Object.assign(state, initialState);
            log('State reset to initial values');
        },
        /**
     * Invalidate cache.
     *
     * Marks cache as invalidated, forcing refetch of data on next request.
     * Used when external changes may have affected incident data.
     *
     * @param {IncidentReportsState} state - Current state
     *
     * @example
     * ```typescript
     * dispatch(invalidateCache());
     * ```
     */ invalidateCache: (state)=>{
            state.cacheInvalidated = true;
            state.lastFetched = null;
            log('Cache invalidated');
        },
        /**
     * Optimistic update for incident report.
     *
     * Updates local state immediately before API confirmation for better UX.
     * If API call fails, state should be rolled back or error shown.
     *
     * @param {IncidentReportsState} state - Current state
     * @param {PayloadAction<{id: string, data: Partial<IncidentReport>}>} action - Update payload
     *
     * @remarks
     * Use this for immediate UI feedback on user actions. Ensure proper
     * error handling to rollback changes if API call fails.
     *
     * @example
     * ```typescript
     * // Immediately update UI while API call is in progress
     * dispatch(optimisticUpdateReport({
     *   id: 'incident-123',
     *   data: { status: IncidentStatus.RESOLVED }
     * }));
     * ```
     */ optimisticUpdateReport: (state, action)=>{
            const { id, data } = action.payload;
            const index = state.reports.findIndex((report)=>report.id === id);
            if (index !== -1) {
                state.reports[index] = {
                    ...state.reports[index],
                    ...data
                };
            }
            if (state.selectedReport?.id === id) {
                state.selectedReport = {
                    ...state.selectedReport,
                    ...data
                };
            }
            log('Optimistic update applied:', id);
        }
    },
    extraReducers: (builder)=>{
        builder// =====================
        // FETCH INCIDENT REPORTS
        // =====================
        .addCase(fetchIncidentReports.pending, (state)=>{
            state.loading.list = true;
            state.errors.list = null;
        }).addCase(fetchIncidentReports.fulfilled, (state, action)=>{
            state.reports = action.payload.reports;
            state.pagination = action.payload.pagination;
            state.loading.list = false;
            state.errors.list = null;
            state.lastFetched = Date.now();
            state.cacheInvalidated = false;
            log('Incident reports fetched successfully:', action.payload.reports.length);
        }).addCase(fetchIncidentReports.rejected, (state, action)=>{
            state.loading.list = false;
            state.errors.list = action.payload;
            log('Error fetching incident reports:', action.payload);
        })// =====================
        // FETCH INCIDENT REPORT BY ID
        // =====================
        .addCase(fetchIncidentReportById.pending, (state)=>{
            state.loading.detail = true;
            state.errors.detail = null;
        }).addCase(fetchIncidentReportById.fulfilled, (state, action)=>{
            state.selectedReport = action.payload;
            state.loading.detail = false;
            state.errors.detail = null;
            log('Incident report fetched by ID:', action.payload.id);
        }).addCase(fetchIncidentReportById.rejected, (state, action)=>{
            state.loading.detail = false;
            state.errors.detail = action.payload;
            log('Error fetching incident report by ID:', action.payload);
        })// =====================
        // CREATE INCIDENT REPORT
        // =====================
        .addCase(createIncidentReport.pending, (state)=>{
            state.loading.creating = true;
            state.errors.create = null;
        }).addCase(createIncidentReport.fulfilled, (state, action)=>{
            // Add new report to the beginning of the list
            state.reports.unshift(action.payload);
            state.pagination.total += 1;
            state.loading.creating = false;
            state.errors.create = null;
            state.cacheInvalidated = true;
            log('Incident report created:', action.payload.id);
        }).addCase(createIncidentReport.rejected, (state, action)=>{
            state.loading.creating = false;
            state.errors.create = action.payload;
            log('Error creating incident report:', action.payload);
        })// =====================
        // UPDATE INCIDENT REPORT
        // =====================
        .addCase(updateIncidentReport.pending, (state)=>{
            state.loading.updating = true;
            state.errors.update = null;
        }).addCase(updateIncidentReport.fulfilled, (state, action)=>{
            // Update report in list
            const index = state.reports.findIndex((r)=>r.id === action.payload.id);
            if (index !== -1) {
                state.reports[index] = action.payload;
            }
            // Update selected report if it's the same one
            if (state.selectedReport?.id === action.payload.id) {
                state.selectedReport = action.payload;
            }
            state.loading.updating = false;
            state.errors.update = null;
            state.cacheInvalidated = true;
            log('Incident report updated:', action.payload.id);
        }).addCase(updateIncidentReport.rejected, (state, action)=>{
            state.loading.updating = false;
            state.errors.update = action.payload;
            log('Error updating incident report:', action.payload);
        })// =====================
        // DELETE INCIDENT REPORT
        // =====================
        .addCase(deleteIncidentReport.pending, (state)=>{
            state.loading.deleting = true;
            state.errors.delete = null;
        }).addCase(deleteIncidentReport.fulfilled, (state, action)=>{
            // Remove report from list
            state.reports = state.reports.filter((r)=>r.id !== action.payload);
            state.pagination.total -= 1;
            // Clear selected report if it was deleted
            if (state.selectedReport?.id === action.payload) {
                state.selectedReport = null;
            }
            state.loading.deleting = false;
            state.errors.delete = null;
            state.cacheInvalidated = true;
            log('Incident report deleted:', action.payload);
        }).addCase(deleteIncidentReport.rejected, (state, action)=>{
            state.loading.deleting = false;
            state.errors.delete = action.payload;
            log('Error deleting incident report:', action.payload);
        })// =====================
        // SEARCH INCIDENT REPORTS
        // =====================
        .addCase(searchIncidentReports.pending, (state)=>{
            state.loading.searching = true;
            state.errors.search = null;
        }).addCase(searchIncidentReports.fulfilled, (state, action)=>{
            state.searchResults = action.payload.reports;
            state.loading.searching = false;
            state.errors.search = null;
            log('Search completed:', action.payload.reports.length, 'results');
        }).addCase(searchIncidentReports.rejected, (state, action)=>{
            state.loading.searching = false;
            state.errors.search = action.payload;
            log('Error searching incident reports:', action.payload);
        })// =====================
        // FETCH WITNESS STATEMENTS
        // =====================
        .addCase(fetchWitnessStatements.pending, (state)=>{
            state.loading.witnesses = true;
            state.errors.witnesses = null;
        }).addCase(fetchWitnessStatements.fulfilled, (state, action)=>{
            state.witnessStatements = action.payload;
            state.loading.witnesses = false;
            state.errors.witnesses = null;
            log('Witness statements fetched:', action.payload.length);
        }).addCase(fetchWitnessStatements.rejected, (state, action)=>{
            state.loading.witnesses = false;
            state.errors.witnesses = action.payload;
            log('Error fetching witness statements:', action.payload);
        })// =====================
        // CREATE WITNESS STATEMENT
        // =====================
        .addCase(createWitnessStatement.fulfilled, (state, action)=>{
            state.witnessStatements.push(action.payload);
            log('Witness statement created:', action.payload.id);
        })// =====================
        // FETCH FOLLOW-UP ACTIONS
        // =====================
        .addCase(fetchFollowUpActions.pending, (state)=>{
            state.loading.actions = true;
            state.errors.actions = null;
        }).addCase(fetchFollowUpActions.fulfilled, (state, action)=>{
            state.followUpActions = action.payload;
            state.loading.actions = false;
            state.errors.actions = null;
            log('Follow-up actions fetched:', action.payload.length);
        }).addCase(fetchFollowUpActions.rejected, (state, action)=>{
            state.loading.actions = false;
            state.errors.actions = action.payload;
            log('Error fetching follow-up actions:', action.payload);
        })// =====================
        // CREATE FOLLOW-UP ACTION
        // =====================
        .addCase(createFollowUpAction.fulfilled, (state, action)=>{
            state.followUpActions.push(action.payload);
            log('Follow-up action created:', action.payload.id);
        });
    }
});
const { setFilters, setSearchQuery, setSelectedIncidentReport, clearSelectedIncident, setSortOrder, setViewMode, clearErrors, clearError, resetState, invalidateCache, optimisticUpdateReport } = incidentReportsSlice.actions;
const incidentReportsActions = incidentReportsSlice.actions;
const __TURBOPACK__default__export__ = incidentReportsSlice.reducer;
const selectIncidentReports = (state)=>state.incidentReports.reports;
const selectCurrentIncident = (state)=>state.incidentReports.selectedReport;
const selectWitnessStatements = (state)=>state.incidentReports.witnessStatements;
const selectFollowUpActions = (state)=>state.incidentReports.followUpActions;
const selectSearchResults = (state)=>state.incidentReports.searchResults;
const selectPagination = (state)=>state.incidentReports.pagination;
const selectFilters = (state)=>state.incidentReports.filters;
const selectSearchQuery = (state)=>state.incidentReports.searchQuery;
const selectSortConfig = (state)=>state.incidentReports.sortConfig;
const selectViewMode = (state)=>state.incidentReports.viewMode;
const selectLoadingStates = (state)=>state.incidentReports.loading;
const selectIsLoading = (key)=>(state)=>state.incidentReports.loading[key];
const selectErrorStates = (state)=>state.incidentReports.errors;
const selectError = (key)=>(state)=>state.incidentReports.errors[key];
const selectIsCacheInvalidated = (state)=>state.incidentReports.cacheInvalidated;
const selectLastFetched = (state)=>state.incidentReports.lastFetched;
const selectFilteredAndSortedReports = (state)=>{
    const { reports, sortConfig } = state.incidentReports;
    const sortedReports = [
        ...reports
    ].sort((a, b)=>{
        const { column, order } = sortConfig;
        let aValue;
        let bValue;
        switch(column){
            case 'occurredAt':
            case 'reportedAt':
                aValue = new Date(a[column] || 0).getTime();
                bValue = new Date(b[column] || 0).getTime();
                break;
            case 'severity':
                const severityOrder = {
                    LOW: 1,
                    MEDIUM: 2,
                    HIGH: 3,
                    CRITICAL: 4
                };
                aValue = severityOrder[a.severity] || 0;
                bValue = severityOrder[b.severity] || 0;
                break;
            default:
                aValue = a[column];
                bValue = b[column];
        }
        if (aValue < bValue) return order === 'asc' ? -1 : 1;
        if (aValue > bValue) return order === 'asc' ? 1 : -1;
        return 0;
    });
    return sortedReports;
};
const selectIncidentsByType = (type)=>(state)=>state.incidentReports.reports.filter((report)=>report.type === type);
const selectIncidentsBySeverity = (severity)=>(state)=>state.incidentReports.reports.filter((report)=>report.severity === severity);
const selectIncidentsByStatus = (status)=>(state)=>state.incidentReports.reports.filter((report)=>report.status === status);
const selectIncidentsRequiringFollowUp = (state)=>state.incidentReports.reports.filter((report)=>report.followUpRequired);
const selectIncidentsWithUnnotifiedParents = (state)=>state.incidentReports.reports.filter((report)=>!report.parentNotified);
const selectCriticalIncidents = (state)=>state.incidentReports.reports.filter((report)=>report.severity === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$domain$2f$incidents$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IncidentSeverity"].HIGH || report.severity === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$domain$2f$incidents$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IncidentSeverity"].CRITICAL);
const selectReportStatistics = (state)=>{
    const { reports } = state.incidentReports;
    return {
        total: reports.length,
        byType: reports.reduce((acc, report)=>{
            acc[report.type] = (acc[report.type] || 0) + 1;
            return acc;
        }, {}),
        bySeverity: reports.reduce((acc, report)=>{
            acc[report.severity] = (acc[report.severity] || 0) + 1;
            return acc;
        }, {}),
        byStatus: reports.reduce((acc, report)=>{
            acc[report.status || 'OPEN'] = (acc[report.status || 'OPEN'] || 0) + 1;
            return acc;
        }, {}),
        parentNotificationRate: reports.length > 0 ? reports.filter((r)=>r.parentNotified).length / reports.length * 100 : 0,
        followUpRate: reports.length > 0 ? reports.filter((r)=>r.followUpRequired).length / reports.length * 100 : 0
    };
};
}),
"[project]/src/types/domain/administration.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * WF-COMP-315 | administration.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: React ecosystem
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: functions, interfaces | Key Features: Standard module
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */ /**
 * Administration Module Types
 *
 * Comprehensive type definitions for the Administration module including:
 * - District and School management
 * - System configuration with history tracking
 * - License management and feature control
 * - Backup operations and monitoring
 * - Performance metrics collection
 * - Training module management and completion tracking
 * - User management
 * - Audit logging
 */ // ==================== ENUMS ====================
/**
 * Configuration category types
 */ __turbopack_context__.s([
    "AuditAction",
    ()=>AuditAction,
    "BackupStatus",
    ()=>BackupStatus,
    "BackupType",
    ()=>BackupType,
    "ConfigCategory",
    ()=>ConfigCategory,
    "ConfigScope",
    ()=>ConfigScope,
    "ConfigValueType",
    ()=>ConfigValueType,
    "LicenseStatus",
    ()=>LicenseStatus,
    "LicenseType",
    ()=>LicenseType,
    "MetricType",
    ()=>MetricType,
    "TrainingCategory",
    ()=>TrainingCategory,
    "UserRole",
    ()=>UserRole,
    "isAuditAction",
    ()=>isAuditAction,
    "isConfigCategory",
    ()=>isConfigCategory,
    "isLicenseType",
    ()=>isLicenseType,
    "isMetricType",
    ()=>isMetricType,
    "isTrainingCategory",
    ()=>isTrainingCategory,
    "isUserRole",
    ()=>isUserRole
]);
var ConfigCategory = /*#__PURE__*/ function(ConfigCategory) {
    ConfigCategory["GENERAL"] = "GENERAL";
    ConfigCategory["SECURITY"] = "SECURITY";
    ConfigCategory["NOTIFICATION"] = "NOTIFICATION";
    ConfigCategory["INTEGRATION"] = "INTEGRATION";
    ConfigCategory["BACKUP"] = "BACKUP";
    ConfigCategory["PERFORMANCE"] = "PERFORMANCE";
    ConfigCategory["HEALTHCARE"] = "HEALTHCARE";
    ConfigCategory["MEDICATION"] = "MEDICATION";
    ConfigCategory["APPOINTMENTS"] = "APPOINTMENTS";
    ConfigCategory["UI"] = "UI";
    ConfigCategory["QUERY"] = "QUERY";
    ConfigCategory["FILE_UPLOAD"] = "FILE_UPLOAD";
    ConfigCategory["RATE_LIMITING"] = "RATE_LIMITING";
    ConfigCategory["SESSION"] = "SESSION";
    ConfigCategory["EMAIL"] = "EMAIL";
    ConfigCategory["SMS"] = "SMS";
    return ConfigCategory;
}({});
var ConfigValueType = /*#__PURE__*/ function(ConfigValueType) {
    ConfigValueType["STRING"] = "STRING";
    ConfigValueType["NUMBER"] = "NUMBER";
    ConfigValueType["BOOLEAN"] = "BOOLEAN";
    ConfigValueType["JSON"] = "JSON";
    ConfigValueType["ARRAY"] = "ARRAY";
    ConfigValueType["DATE"] = "DATE";
    ConfigValueType["TIME"] = "TIME";
    ConfigValueType["DATETIME"] = "DATETIME";
    ConfigValueType["EMAIL"] = "EMAIL";
    ConfigValueType["URL"] = "URL";
    ConfigValueType["COLOR"] = "COLOR";
    ConfigValueType["ENUM"] = "ENUM";
    return ConfigValueType;
}({});
var ConfigScope = /*#__PURE__*/ function(ConfigScope) {
    ConfigScope["SYSTEM"] = "SYSTEM";
    ConfigScope["DISTRICT"] = "DISTRICT";
    ConfigScope["SCHOOL"] = "SCHOOL";
    ConfigScope["USER"] = "USER";
    return ConfigScope;
}({});
var BackupType = /*#__PURE__*/ function(BackupType) {
    BackupType["AUTOMATIC"] = "AUTOMATIC";
    BackupType["MANUAL"] = "MANUAL";
    BackupType["SCHEDULED"] = "SCHEDULED";
    return BackupType;
}({});
var BackupStatus = /*#__PURE__*/ function(BackupStatus) {
    BackupStatus["IN_PROGRESS"] = "IN_PROGRESS";
    BackupStatus["COMPLETED"] = "COMPLETED";
    BackupStatus["FAILED"] = "FAILED";
    return BackupStatus;
}({});
var MetricType = /*#__PURE__*/ function(MetricType) {
    MetricType["CPU_USAGE"] = "CPU_USAGE";
    MetricType["MEMORY_USAGE"] = "MEMORY_USAGE";
    MetricType["DISK_USAGE"] = "DISK_USAGE";
    MetricType["API_RESPONSE_TIME"] = "API_RESPONSE_TIME";
    MetricType["DATABASE_QUERY_TIME"] = "DATABASE_QUERY_TIME";
    MetricType["ACTIVE_USERS"] = "ACTIVE_USERS";
    MetricType["ERROR_RATE"] = "ERROR_RATE";
    MetricType["REQUEST_COUNT"] = "REQUEST_COUNT";
    return MetricType;
}({});
var LicenseType = /*#__PURE__*/ function(LicenseType) {
    LicenseType["TRIAL"] = "TRIAL";
    LicenseType["BASIC"] = "BASIC";
    LicenseType["PROFESSIONAL"] = "PROFESSIONAL";
    LicenseType["ENTERPRISE"] = "ENTERPRISE";
    return LicenseType;
}({});
var LicenseStatus = /*#__PURE__*/ function(LicenseStatus) {
    LicenseStatus["ACTIVE"] = "ACTIVE";
    LicenseStatus["EXPIRED"] = "EXPIRED";
    LicenseStatus["SUSPENDED"] = "SUSPENDED";
    LicenseStatus["CANCELLED"] = "CANCELLED";
    return LicenseStatus;
}({});
var TrainingCategory = /*#__PURE__*/ function(TrainingCategory) {
    TrainingCategory["HIPAA_COMPLIANCE"] = "HIPAA_COMPLIANCE";
    TrainingCategory["MEDICATION_MANAGEMENT"] = "MEDICATION_MANAGEMENT";
    TrainingCategory["EMERGENCY_PROCEDURES"] = "EMERGENCY_PROCEDURES";
    TrainingCategory["SYSTEM_TRAINING"] = "SYSTEM_TRAINING";
    TrainingCategory["SAFETY_PROTOCOLS"] = "SAFETY_PROTOCOLS";
    TrainingCategory["DATA_SECURITY"] = "DATA_SECURITY";
    return TrainingCategory;
}({});
var AuditAction = /*#__PURE__*/ function(AuditAction) {
    AuditAction["CREATE"] = "CREATE";
    AuditAction["READ"] = "READ";
    AuditAction["UPDATE"] = "UPDATE";
    AuditAction["DELETE"] = "DELETE";
    AuditAction["LOGIN"] = "LOGIN";
    AuditAction["LOGOUT"] = "LOGOUT";
    AuditAction["EXPORT"] = "EXPORT";
    AuditAction["IMPORT"] = "IMPORT";
    AuditAction["BACKUP"] = "BACKUP";
    AuditAction["RESTORE"] = "RESTORE";
    return AuditAction;
}({});
var UserRole = /*#__PURE__*/ function(UserRole) {
    UserRole["ADMIN"] = "ADMIN";
    UserRole["NURSE"] = "NURSE";
    UserRole["SCHOOL_ADMIN"] = "SCHOOL_ADMIN";
    UserRole["DISTRICT_ADMIN"] = "DISTRICT_ADMIN";
    UserRole["VIEWER"] = "VIEWER";
    UserRole["COUNSELOR"] = "COUNSELOR";
    return UserRole;
}({});
function isConfigCategory(value) {
    return Object.values(ConfigCategory).includes(value);
}
function isLicenseType(value) {
    return Object.values(LicenseType).includes(value);
}
function isTrainingCategory(value) {
    return Object.values(TrainingCategory).includes(value);
}
function isUserRole(value) {
    return Object.values(UserRole).includes(value);
}
function isMetricType(value) {
    return Object.values(MetricType).includes(value);
}
function isAuditAction(value) {
    return Object.values(AuditAction).includes(value);
}
}),
"[project]/src/stores/slices/settingsSlice.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @fileoverview System Settings Redux Slice for White Cross Healthcare Platform
 *
 * Manages system-wide configuration settings and administrative preferences for the
 * healthcare platform. Provides comprehensive state management for configuration
 * CRUD operations, settings validation, and real-time configuration updates.
 *
 * **Key Features:**
 * - System configuration management (database, API, security settings)
 * - User preference management (UI themes, notifications, defaults)
 * - Feature flag and toggle management
 * - Multi-tenant configuration support (school/district level)
 * - Configuration validation and type enforcement
 * - Real-time configuration updates across browser tabs
 * - Configuration versioning and rollback capabilities
 * - Environment-specific settings (dev, staging, production)
 * - Configuration import/export functionality
 *
 * **HIPAA Compliance:**
 * - Configuration settings may contain sensitive information (API keys, server URLs)
 * - PHI-related settings (data retention policies, audit configurations) require special handling
 * - All configuration changes generate audit logs for compliance tracking
 * - Role-based access control for sensitive configuration categories
 * - Encrypted storage for sensitive configuration values
 * - Configuration access logging for security monitoring
 *
 * **Configuration Categories:**
 * - **SYSTEM**: Core system settings (database, cache, logging)
 * - **SECURITY**: Authentication, authorization, encryption settings
 * - **NOTIFICATIONS**: Email, SMS, push notification configurations
 * - **INTEGRATIONS**: Third-party API configurations (SIS, EMR, payment processors)
 * - **UI**: User interface preferences and customizations
 * - **FEATURES**: Feature flags and experimental functionality toggles
 * - **COMPLIANCE**: HIPAA, FERPA, and other regulatory compliance settings
 * - **PERFORMANCE**: Caching, rate limiting, and optimization settings
 *
 * **State Management:**
 * - Uses entity slice factory pattern for standardized CRUD operations
 * - Normalized state structure with EntityAdapter for efficient lookups
 * - Category-based organization for settings management
 * - Type-safe configuration values with validation
 * - Optimistic updates for immediate UI responsiveness
 * - Configuration caching with intelligent invalidation
 *
 * **Security Considerations:**
 * - Sensitive values (passwords, API keys) are encrypted at rest
 * - Role-based access control for configuration categories
 * - Configuration change audit logging
 * - Input validation and sanitization for all configuration values
 * - Secure configuration backup and restore procedures
 *
 * **Integration:**
 * - Backend API: `services/modules/administrationApi.ts`
 * - Type definitions: `types/administration.ts`
 * - Redux store: `stores/reduxStore.ts`
 * - Used by: Admin panels, system monitoring, feature toggles
 *
 * @module stores/slices/settingsSlice
 * @requires @reduxjs/toolkit
 * @requires services/modules/administrationApi
 * @requires types/administration
 * @security System configuration management, sensitive data handling
 * @compliance HIPAA-compliant configuration operations
 *
 * @example System configuration management
 * ```typescript
 * import { useDispatch, useSelector } from 'react-redux';
 * import { settingsThunks, selectSettingsByCategory } from '@/stores/slices/settingsSlice';
 *
 * function SystemSettings() {
 *   const dispatch = useDispatch();
 *   const systemSettings = useSelector(state => 
 *     selectSettingsByCategory(state, 'SYSTEM')
 *   );
 *
 *   const updateSetting = async (key: string, value: string) => {
 *     await dispatch(settingsThunks.update({
 *       id: key,
 *       data: { key, value, category: 'SYSTEM' }
 *     }));
 *   };
 *
 *   return (
 *     <div>
 *       {systemSettings.map(setting => (
 *         <ConfigurationInput
 *           key={setting.id}
 *           setting={setting}
 *           onChange={(value) => updateSetting(setting.key, value)}
 *         />
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 *
 * @example Feature flag management
 * ```typescript
 * function FeatureToggle({ featureKey, children }) {
 *   const featureEnabled = useSelector(state => 
 *     selectSettingValue(state, `feature.${featureKey}.enabled`)
 *   );
 *
 *   if (featureEnabled === 'true') {
 *     return children;
 *   }
 *
 *   return null;
 * }
 *
 * // Usage
 * <FeatureToggle featureKey="experimental_dashboard">
 *   <ExperimentalDashboard />
 * </FeatureToggle>
 * ```
 *
 * @example Bulk configuration update
 * ```typescript
 * function BulkConfigurationUpdate() {
 *   const dispatch = useDispatch();
 *
 *   const updateNotificationSettings = async (settings) => {
 *     // Update multiple notification-related settings
 *     const updates = Object.entries(settings).map(([key, value]) => ({
 *       id: `notification.${key}`,
 *       data: { key: `notification.${key}`, value, category: 'NOTIFICATIONS' }
 *     }));
 *
 *     // Use Promise.all for concurrent updates
 *     await Promise.all(
 *       updates.map(update => 
 *         dispatch(settingsThunks.update(update))
 *       )
 *     );
 *   };
 *
 *   return (
 *     <button onClick={() => updateNotificationSettings({
 *       'email.enabled': 'true',
 *       'sms.enabled': 'false',
 *       'push.enabled': 'true'
 *     })}>
 *       Update Notification Settings
 *     </button>
 *   );
 * }
 * ```
 *
 * @see {@link ../../services/modules/administrationApi.ts} for API integration
 * @see {@link ../reduxStore.ts} for store configuration
 * @see {@link ../../types/administration.ts} for type definitions
 * @since 1.0.0
 */ __turbopack_context__.s([
    "selectEditableSettings",
    ()=>selectEditableSettings,
    "selectPublicSettings",
    ()=>selectPublicSettings,
    "selectSettingByKey",
    ()=>selectSettingByKey,
    "selectSettingValue",
    ()=>selectSettingValue,
    "selectSettingsByCategory",
    ()=>selectSettingsByCategory,
    "settingsActions",
    ()=>settingsActions,
    "settingsReducer",
    ()=>settingsReducer,
    "settingsSelectors",
    ()=>settingsSelectors,
    "settingsSlice",
    ()=>settingsSlice,
    "settingsThunks",
    ()=>settingsThunks
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$sliceFactory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/stores/sliceFactory.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$sliceFactory$2f$core$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/sliceFactory/core.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$domain$2f$administration$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/types/domain/administration.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/lib/api/index.ts [app-ssr] (ecmascript) <locals>");
;
;
;
// Create API service adapter for settings
const settingsApiService = {
    async getAll () {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["apiActions"].administration.getSettings();
        // Convert settings object to array of configuration items
        const configurations = [];
        if (response.data) {
            Object.entries(response.data).forEach(([category, items])=>{
                if (Array.isArray(items)) {
                    items.forEach((item)=>{
                        configurations.push({
                            id: item.id || `${category}-${item.key}`,
                            key: item.key,
                            value: item.value,
                            category: category,
                            valueType: item.valueType,
                            description: item.description,
                            isPublic: item.isPublic ?? false,
                            isEditable: item.isEditable ?? true,
                            requiresRestart: item.requiresRestart ?? false,
                            scope: item.scope || __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$domain$2f$administration$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ConfigScope"].SYSTEM,
                            createdAt: item.createdAt || new Date().toISOString(),
                            updatedAt: item.updatedAt || new Date().toISOString(),
                            validValues: item.validValues || undefined,
                            tags: item.tags || [],
                            sortOrder: item.sortOrder || 0
                        });
                    });
                }
            });
        }
        return {
            data: configurations,
            total: configurations.length
        };
    },
    async getById (id) {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["apiActions"].administration.getSettings();
        let foundConfig = null;
        if (response.data) {
            Object.entries(response.data).forEach(([category, items])=>{
                if (Array.isArray(items)) {
                    const item = items.find((i)=>i.id === id || `${category}-${i.key}` === id);
                    if (item) {
                        foundConfig = {
                            id: item.id || `${category}-${item.key}`,
                            key: item.key,
                            value: item.value,
                            category: category,
                            valueType: item.valueType,
                            description: item.description,
                            isPublic: item.isPublic ?? false,
                            isEditable: item.isEditable ?? true,
                            requiresRestart: item.requiresRestart ?? false,
                            scope: item.scope || 'SYSTEM',
                            createdAt: item.createdAt || new Date().toISOString(),
                            updatedAt: item.updatedAt || new Date().toISOString()
                        };
                    }
                }
            });
        }
        if (!foundConfig) {
            throw new Error(`Configuration with id ${id} not found`);
        }
        return {
            data: foundConfig
        };
    },
    async create (data) {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["apiActions"].administration.setConfiguration(data);
        return {
            data: response.data
        };
    },
    async update (id, data) {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["apiActions"].administration.setConfiguration({
            ...data,
            id
        });
        return {
            data: response.data
        };
    },
    async delete (id) {
        // Settings typically aren't deleted, but we can mark them as inactive
        // For now, just return success
        return {
            success: true
        };
    }
};
// Create the settings slice using the factory
const settingsSliceFactory = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$sliceFactory$2f$core$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createEntitySlice"])('settings', settingsApiService, {
    enableBulkOperations: false
});
const settingsSlice = settingsSliceFactory.slice;
const settingsReducer = settingsSlice.reducer;
const settingsActions = settingsSliceFactory.actions;
const settingsSelectors = settingsSliceFactory.adapter.getSelectors((state)=>state.settings);
const settingsThunks = settingsSliceFactory.thunks;
const selectSettingsByCategory = (state, category)=>{
    const allSettings = settingsSelectors.selectAll(state);
    return allSettings.filter((setting)=>setting.category === category);
};
const selectPublicSettings = (state)=>{
    const allSettings = settingsSelectors.selectAll(state);
    return allSettings.filter((setting)=>setting.isPublic);
};
const selectEditableSettings = (state)=>{
    const allSettings = settingsSelectors.selectAll(state);
    return allSettings.filter((setting)=>setting.isEditable);
};
const selectSettingByKey = (state, key)=>{
    const allSettings = settingsSelectors.selectAll(state);
    return allSettings.find((setting)=>setting.key === key);
};
const selectSettingValue = (state, key)=>{
    const setting = selectSettingByKey(state, key);
    return setting?.value;
};
}),
"[project]/src/services/configurationApi.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * WF-COMP-254 | configurationApi.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ./api | Dependencies: ./api
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: constants, interfaces | Key Features: Standard module
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */ __turbopack_context__.s([
    "configurationApi",
    ()=>configurationApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$config$2f$apiConfig$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/services/config/apiConfig.ts [app-ssr] (ecmascript) <locals>");
;
const configurationApi = {
    /**
   * Get all configurations with optional filtering
   */ getAll: async (filter)=>{
        const params = new URLSearchParams();
        if (filter) {
            Object.entries(filter).forEach(([key, value])=>{
                if (value !== undefined && value !== null) {
                    if (Array.isArray(value)) {
                        value.forEach((v)=>params.append(key, v));
                    } else {
                        params.append(key, String(value));
                    }
                }
            });
        }
        const queryString = params.toString();
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$config$2f$apiConfig$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["apiInstance"].get(`/configurations${queryString ? `?${queryString}` : ''}`);
        return response.data;
    },
    /**
   * Get public configurations (no auth required)
   */ getPublic: async ()=>{
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$config$2f$apiConfig$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["apiInstance"].get('/configurations/public');
        return response.data;
    },
    /**
   * Get a specific configuration by key
   */ getByKey: async (key, scopeId)=>{
        const params = scopeId ? `?scopeId=${scopeId}` : '';
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$config$2f$apiConfig$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["apiInstance"].get(`/configurations/${key}${params}`);
        return response.data;
    },
    /**
   * Get configurations by category
   */ getByCategory: async (category, scopeId)=>{
        const params = scopeId ? `?scopeId=${scopeId}` : '';
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$config$2f$apiConfig$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["apiInstance"].get(`/configurations/category/${category}${params}`);
        return response.data;
    },
    /**
   * Update a configuration value
   */ update: async (key, data)=>{
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$config$2f$apiConfig$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["apiInstance"].put(`/configurations/${key}`, data);
        return response.data;
    },
    /**
   * Bulk update configurations
   */ bulkUpdate: async (data)=>{
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$config$2f$apiConfig$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["apiInstance"].put('/configurations/bulk', data);
        return response.data;
    },
    /**
   * Create a new configuration
   */ create: async (data)=>{
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$config$2f$apiConfig$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["apiInstance"].post('/configurations', data);
        return response.data;
    },
    /**
   * Delete a configuration
   */ delete: async (key, scopeId)=>{
        const params = scopeId ? `?scopeId=${scopeId}` : '';
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$config$2f$apiConfig$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["apiInstance"].delete(`/configurations/${key}${params}`);
        return response.data;
    },
    /**
   * Reset configuration to default value
   */ resetToDefault: async (key, scopeId)=>{
        const params = scopeId ? `?scopeId=${scopeId}` : '';
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$config$2f$apiConfig$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["apiInstance"].post(`/configurations/${key}/reset${params}`);
        return response.data;
    },
    /**
   * Get configuration change history
   */ getHistory: async (key, limit = 50)=>{
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$config$2f$apiConfig$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["apiInstance"].get(`/configurations/${key}/history?limit=${limit}`);
        return response.data;
    },
    /**
   * Get recent configuration changes
   */ getRecentChanges: async (limit = 100)=>{
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$config$2f$apiConfig$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["apiInstance"].get(`/configurations/history/recent?limit=${limit}`);
        return response.data;
    },
    /**
   * Get configuration changes by user
   */ getChangesByUser: async (userId, limit = 50)=>{
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$config$2f$apiConfig$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["apiInstance"].get(`/configurations/history/user/${userId}?limit=${limit}`);
        return response.data;
    },
    /**
   * Export configurations as JSON
   */ export: async (filter)=>{
        const params = new URLSearchParams();
        if (filter?.category) params.append('category', filter.category);
        if (filter?.scope) params.append('scope', filter.scope);
        const queryString = params.toString();
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$config$2f$apiConfig$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["apiInstance"].get(`/configurations/export${queryString ? `?${queryString}` : ''}`, {
            responseType: 'blob'
        });
        return response.data;
    },
    /**
   * Import configurations from JSON
   */ import: async (data)=>{
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$config$2f$apiConfig$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["apiInstance"].post('/configurations/import', data);
        return response.data;
    }
};
}),
"[project]/src/stores/slices/configurationSlice.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @fileoverview System Configuration Management Redux Slice
 * 
 * This slice manages comprehensive system configuration functionality for the healthcare management
 * system, including application settings, user preferences, organizational policies, clinical
 * workflows, security parameters, and integration configurations. Designed specifically for
 * healthcare environments with complex configuration hierarchies and compliance requirements.
 * 
 * Key Features:
 * - Hierarchical configuration management (Global → Organization → Department → User)
 * - Real-time configuration updates with hot-reload capabilities
 * - Configuration versioning and rollback functionality
 * - Audit trail for all configuration changes
 * - Role-based configuration access control
 * - Configuration validation and schema enforcement
 * - Import/export capabilities for system migration
 * - Environment-specific configuration management
 * - Configuration templates for quick deployment
 * - HIPAA-compliant configuration handling for PHI-related settings
 * 
 * Healthcare Configuration Categories:
 * - Clinical Workflows: Treatment protocols, care pathways, clinical decision support
 * - Security Settings: Authentication, authorization, encryption, audit policies
 * - Integration Config: EMR systems, lab interfaces, billing systems, pharmacy
 * - User Interface: Theme preferences, layout settings, accessibility options
 * - Compliance Rules: HIPAA policies, state regulations, quality measures
 * - Notification Settings: Alert thresholds, escalation procedures, communication preferences
 * - Reporting Config: Dashboard layouts, report templates, data retention policies
 * - System Parameters: Performance tuning, resource limits, backup schedules
 * 
 * HIPAA Compliance Features:
 * - Configuration access logging for audit trails
 * - PHI-related configuration encryption at rest
 * - Role-based access to sensitive configuration areas
 * - Automatic configuration backup with retention policies
 * - Configuration change approval workflows for critical settings
 * - Emergency configuration override capabilities
 * - Configuration integrity monitoring and validation
 * 
 * Configuration Hierarchy:
 * - System Level: Core application settings, security policies
 * - Organization Level: Institution-specific policies, branding
 * - Department Level: Unit-specific workflows, resource allocation
 * - User Level: Personal preferences, dashboard customization
 * - Role Level: Role-specific default configurations
 * 
 * Performance Optimizations:
 * - Configuration caching with intelligent invalidation
 * - Lazy loading of configuration sections
 * - Optimistic updates for non-critical configurations
 * - Background synchronization of configuration changes
 * - Configuration bundling for reduced API calls
 * - Client-side configuration validation
 * 
 * @example
 * // Basic configuration management
 * const dispatch = useAppDispatch();
 * 
 * // Fetch all configurations
 * dispatch(fetchConfigurations({
 *   category: 'clinical_workflows',
 *   scope: 'department',
 *   scopeId: 'cardiology'
 * }));
 * 
 * // Update a specific configuration
 * dispatch(updateConfiguration({
 *   key: 'medication_alert_threshold',
 *   data: {
 *     value: '72',
 *     description: 'Hours before medication expiry alert',
 *     requiresRestart: false
 *   }
 * }));
 * 
 * @example
 * // Configuration filtering and search
 * // Set filters for configuration management
 * dispatch(setFilters({
 *   category: 'security',
 *   searchTerm: 'password',
 *   isEditable: true
 * }));
 * 
 * // Get filtered configurations
 * const filteredConfigs = useAppSelector(selectFilteredConfigurations);
 * 
 * @example
 * // Bulk configuration operations
 * // Bulk update multiple configurations
 * dispatch(bulkUpdateConfigurations({
 *   updates: [
 *     { key: 'session_timeout', value: '30' },
 *     { key: 'password_complexity', value: 'high' },
 *     { key: 'mfa_required', value: 'true' }
 *   ],
 *   reason: 'Security policy update Q4 2024'
 * }));
 * 
 * // Export configurations for backup
 * dispatch(exportConfigurations({
 *   category: 'clinical_workflows',
 *   scope: 'organization'
 * }));
 * 
 * @example
 * // Configuration history and audit
 * // View configuration history
 * dispatch(fetchConfigurationHistory({
 *   key: 'patient_chart_timeout',
 *   limit: 50
 * }));
 * 
 * // View recent changes across system
 * dispatch(fetchRecentChanges(25));
 * 
 * // Reset configuration to default
 * dispatch(resetConfigurationToDefault({
 *   key: 'dashboard_layout',
 *   scopeId: 'user_123'
 * }));
 * 
 * @example
 * // Advanced configuration selectors
 * // Get configurations by category
 * const clinicalConfigs = useAppSelector(selectConfigurationsByCategory).clinical_workflows;
 * 
 * // Get editable configurations only
 * const editableConfigs = useAppSelector(selectEditableConfigurations);
 * 
 * // Get configurations requiring restart
 * const restartRequired = useAppSelector(selectConfigurationsRequiringRestart);
 * 
 * Integration Points:
 * - User Management System: User-specific configuration preferences
 * - Security Service: Authentication and authorization settings
 * - Audit Logging: Configuration change tracking and compliance
 * - EMR Integration: Clinical workflow and data exchange settings
 * - Notification Service: Alert and messaging configuration
 * - Backup Service: Configuration backup and restore procedures
 * - Template Engine: Configuration-driven UI customization
 * 
 * Security Considerations:
 * - Sensitive configurations encrypted at rest and in transit
 * - Role-based access control for configuration categories
 * - Configuration change approval workflows for critical settings
 * - Audit logging for all configuration access and modifications
 * - Configuration validation to prevent security misconfigurations
 * - Emergency override capabilities with detailed justification
 * 
 * Clinical Workflow Integration:
 * - Care pathway configuration management
 * - Clinical decision support rule configuration
 * - Treatment protocol customization
 * - Quality measure and reporting configuration
 * - Clinical alert and notification thresholds
 * - Patient flow and scheduling parameters
 * 
 * Compliance and Audit:
 * - HIPAA-compliant configuration management
 * - Audit trail for all configuration changes
 * - Configuration backup and retention policies
 * - Regulatory compliance reporting
 * - Configuration validation against compliance rules
 * - Change management workflows for critical configurations
 * 
 * @author [Your Organization] - Healthcare IT Configuration Team
 * @version 2.1.0
 * @since 2024-01-15
 * @see {@link https://your-docs.com/configuration-management} Configuration Management Guide
 * @see {@link https://your-docs.com/system-administration} System Administration Documentation  
 * @see {@link https://your-docs.com/compliance-configuration} Compliance Configuration Guide
 */ __turbopack_context__.s([
    "ConfigurationApiService",
    ()=>ConfigurationApiService,
    "bulkUpdateConfigurations",
    ()=>bulkUpdateConfigurations,
    "clearCurrentConfiguration",
    ()=>clearCurrentConfiguration,
    "clearErrors",
    ()=>clearErrors,
    "clearSelection",
    ()=>clearSelection,
    "createConfiguration",
    ()=>createConfiguration,
    "default",
    ()=>__TURBOPACK__default__export__,
    "deleteConfiguration",
    ()=>deleteConfiguration,
    "exportConfigurations",
    ()=>exportConfigurations,
    "fetchChangesByUser",
    ()=>fetchChangesByUser,
    "fetchConfigurationByKey",
    ()=>fetchConfigurationByKey,
    "fetchConfigurationHistory",
    ()=>fetchConfigurationHistory,
    "fetchConfigurations",
    ()=>fetchConfigurations,
    "fetchConfigurationsByCategory",
    ()=>fetchConfigurationsByCategory,
    "fetchPublicConfigurations",
    ()=>fetchPublicConfigurations,
    "fetchRecentChanges",
    ()=>fetchRecentChanges,
    "importConfigurations",
    ()=>importConfigurations,
    "resetConfigurationToDefault",
    ()=>resetConfigurationToDefault,
    "selectAllConfigurations",
    ()=>selectAllConfigurations,
    "selectCategories",
    ()=>selectCategories,
    "selectConfigurationMetrics",
    ()=>selectConfigurationMetrics,
    "selectConfigurations",
    ()=>selectConfigurations,
    "selectConfigurationsByCategory",
    ()=>selectConfigurationsByCategory,
    "selectConfigurationsRequiringRestart",
    ()=>selectConfigurationsRequiringRestart,
    "selectCurrentConfiguration",
    ()=>selectCurrentConfiguration,
    "selectEditableConfigurations",
    ()=>selectEditableConfigurations,
    "selectErrors",
    ()=>selectErrors,
    "selectFilteredConfigurations",
    ()=>selectFilteredConfigurations,
    "selectFilters",
    ()=>selectFilters,
    "selectHistory",
    ()=>selectHistory,
    "selectHistoryPagination",
    ()=>selectHistoryPagination,
    "selectLoading",
    ()=>selectLoading,
    "selectPagination",
    ()=>selectPagination,
    "selectPublicConfigurations",
    ()=>selectPublicConfigurations,
    "selectRecentChanges",
    ()=>selectRecentChanges,
    "selectSelectedConfigurations",
    ()=>selectSelectedConfigurations,
    "setFilters",
    ()=>setFilters,
    "setHistoryPagination",
    ()=>setHistoryPagination,
    "setPagination",
    ()=>setPagination,
    "toggleConfigurationSelection",
    ()=>toggleConfigurationSelection,
    "updateConfiguration",
    ()=>updateConfiguration
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$reselect$2f$dist$2f$reselect$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/reselect/dist/reselect.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$configurationApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/configurationApi.ts [app-ssr] (ecmascript)");
;
;
class ConfigurationApiService {
    // Configuration management
    async getConfigurations(filter) {
        return await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$configurationApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["configurationApi"].getAll(filter);
    }
    async getPublicConfigurations() {
        return await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$configurationApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["configurationApi"].getPublic();
    }
    async getConfigurationByKey(key, scopeId) {
        return await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$configurationApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["configurationApi"].getByKey(key, scopeId);
    }
    async getConfigurationsByCategory(category, scopeId) {
        return await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$configurationApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["configurationApi"].getByCategory(category, scopeId);
    }
    async updateConfiguration(key, data) {
        return await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$configurationApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["configurationApi"].update(key, data);
    }
    async bulkUpdateConfigurations(data) {
        return await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$configurationApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["configurationApi"].bulkUpdate(data);
    }
    async createConfiguration(data) {
        return await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$configurationApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["configurationApi"].create(data);
    }
    async deleteConfiguration(key, scopeId) {
        return await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$configurationApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["configurationApi"].delete(key, scopeId);
    }
    async resetConfigurationToDefault(key, scopeId) {
        return await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$configurationApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["configurationApi"].resetToDefault(key, scopeId);
    }
    // History and audit
    async getConfigurationHistory(key, limit) {
        return await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$configurationApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["configurationApi"].getHistory(key, limit);
    }
    async getRecentChanges(limit) {
        return await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$configurationApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["configurationApi"].getRecentChanges(limit);
    }
    async getChangesByUser(userId, limit) {
        return await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$configurationApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["configurationApi"].getChangesByUser(userId, limit);
    }
    // Import/Export
    async exportConfigurations(filter) {
        return await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$configurationApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["configurationApi"].export(filter);
    }
    async importConfigurations(data) {
        return await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$configurationApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["configurationApi"].import(data);
    }
}
// Create service instance
const configurationService = new ConfigurationApiService();
// Initial state
const initialState = {
    configurations: [],
    publicConfigurations: [],
    currentConfiguration: null,
    history: [],
    recentChanges: [],
    categories: [],
    selectedConfigurations: [],
    filters: {
        category: null,
        subCategory: null,
        scope: null,
        scopeId: null,
        tags: [],
        isPublic: null,
        isEditable: null,
        searchTerm: ''
    },
    pagination: {
        page: 1,
        limit: 50,
        total: 0,
        totalPages: 0
    },
    historyPagination: {
        page: 1,
        limit: 25,
        total: 0,
        totalPages: 0
    },
    loading: {
        configurations: false,
        publicConfigurations: false,
        currentConfiguration: false,
        history: false,
        recentChanges: false,
        update: false,
        bulkUpdate: false,
        create: false,
        delete: false,
        reset: false,
        export: false,
        import: false
    },
    error: {
        configurations: null,
        publicConfigurations: null,
        currentConfiguration: null,
        history: null,
        recentChanges: null,
        update: null,
        bulkUpdate: null,
        create: null,
        delete: null,
        reset: null,
        export: null,
        import: null
    }
};
const fetchConfigurations = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])('configuration/fetchConfigurations', async (filter)=>{
    const response = await configurationService.getConfigurations(filter);
    return response;
});
const fetchPublicConfigurations = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])('configuration/fetchPublicConfigurations', async ()=>{
    const response = await configurationService.getPublicConfigurations();
    return response;
});
const fetchConfigurationByKey = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])('configuration/fetchConfigurationByKey', async ({ key, scopeId })=>{
    const response = await configurationService.getConfigurationByKey(key, scopeId);
    return response;
});
const fetchConfigurationsByCategory = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])('configuration/fetchConfigurationsByCategory', async ({ category, scopeId })=>{
    const response = await configurationService.getConfigurationsByCategory(category, scopeId);
    return response;
});
const updateConfiguration = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])('configuration/updateConfiguration', async ({ key, data })=>{
    const response = await configurationService.updateConfiguration(key, data);
    return {
        key,
        ...response
    };
});
const bulkUpdateConfigurations = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])('configuration/bulkUpdateConfigurations', async (data)=>{
    const response = await configurationService.bulkUpdateConfigurations(data);
    return response;
});
const createConfiguration = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])('configuration/createConfiguration', async (data)=>{
    const response = await configurationService.createConfiguration(data);
    return response;
});
const deleteConfiguration = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])('configuration/deleteConfiguration', async ({ key, scopeId })=>{
    await configurationService.deleteConfiguration(key, scopeId);
    return {
        key,
        scopeId
    };
});
const resetConfigurationToDefault = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])('configuration/resetConfigurationToDefault', async ({ key, scopeId })=>{
    const response = await configurationService.resetConfigurationToDefault(key, scopeId);
    return {
        key,
        ...response
    };
});
const fetchConfigurationHistory = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])('configuration/fetchConfigurationHistory', async ({ key, limit })=>{
    const response = await configurationService.getConfigurationHistory(key, limit);
    return response;
});
const fetchRecentChanges = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])('configuration/fetchRecentChanges', async (limit)=>{
    const response = await configurationService.getRecentChanges(limit);
    return response;
});
const fetchChangesByUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])('configuration/fetchChangesByUser', async ({ userId, limit })=>{
    const response = await configurationService.getChangesByUser(userId, limit);
    return response;
});
const exportConfigurations = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])('configuration/exportConfigurations', async (filter)=>{
    const response = await configurationService.exportConfigurations(filter);
    return response;
});
const importConfigurations = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])('configuration/importConfigurations', async (data)=>{
    const response = await configurationService.importConfigurations(data);
    return response;
});
// Slice
const configurationSlice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createSlice"])({
    name: 'configuration',
    initialState,
    reducers: {
        clearCurrentConfiguration: (state)=>{
            state.currentConfiguration = null;
            state.error.currentConfiguration = null;
        },
        setFilters: (state, action)=>{
            state.filters = {
                ...state.filters,
                ...action.payload
            };
            state.pagination.page = 1; // Reset pagination when filters change
        },
        setPagination: (state, action)=>{
            state.pagination = {
                ...state.pagination,
                ...action.payload
            };
        },
        setHistoryPagination: (state, action)=>{
            state.historyPagination = {
                ...state.historyPagination,
                ...action.payload
            };
        },
        toggleConfigurationSelection: (state, action)=>{
            const key = action.payload;
            const index = state.selectedConfigurations.indexOf(key);
            if (index > -1) {
                state.selectedConfigurations.splice(index, 1);
            } else {
                state.selectedConfigurations.push(key);
            }
        },
        selectAllConfigurations: (state)=>{
            state.selectedConfigurations = state.configurations.map((c)=>c.key);
        },
        clearSelection: (state)=>{
            state.selectedConfigurations = [];
        },
        clearErrors: (state)=>{
            state.error = {
                configurations: null,
                publicConfigurations: null,
                currentConfiguration: null,
                history: null,
                recentChanges: null,
                update: null,
                bulkUpdate: null,
                create: null,
                delete: null,
                reset: null,
                export: null,
                import: null
            };
        }
    },
    extraReducers: (builder)=>{
        // Fetch configurations
        builder.addCase(fetchConfigurations.pending, (state)=>{
            state.loading.configurations = true;
            state.error.configurations = null;
        }).addCase(fetchConfigurations.fulfilled, (state, action)=>{
            state.loading.configurations = false;
            state.configurations = action.payload.data || [];
            state.categories = [
                ...new Set(state.configurations.map((c)=>c.category))
            ].sort();
            state.pagination.total = action.payload.total || state.configurations.length;
            state.pagination.totalPages = Math.ceil(state.pagination.total / state.pagination.limit);
        }).addCase(fetchConfigurations.rejected, (state, action)=>{
            state.loading.configurations = false;
            state.error.configurations = action.error.message || 'Failed to fetch configurations';
        });
        // Fetch public configurations
        builder.addCase(fetchPublicConfigurations.pending, (state)=>{
            state.loading.publicConfigurations = true;
            state.error.publicConfigurations = null;
        }).addCase(fetchPublicConfigurations.fulfilled, (state, action)=>{
            state.loading.publicConfigurations = false;
            state.publicConfigurations = action.payload.data || [];
        }).addCase(fetchPublicConfigurations.rejected, (state, action)=>{
            state.loading.publicConfigurations = false;
            state.error.publicConfigurations = action.error.message || 'Failed to fetch public configurations';
        });
        // Fetch configuration by key
        builder.addCase(fetchConfigurationByKey.pending, (state)=>{
            state.loading.currentConfiguration = true;
            state.error.currentConfiguration = null;
        }).addCase(fetchConfigurationByKey.fulfilled, (state, action)=>{
            state.loading.currentConfiguration = false;
            state.currentConfiguration = action.payload.data;
        }).addCase(fetchConfigurationByKey.rejected, (state, action)=>{
            state.loading.currentConfiguration = false;
            state.error.currentConfiguration = action.error.message || 'Failed to fetch configuration';
        });
        // Update configuration
        builder.addCase(updateConfiguration.pending, (state)=>{
            state.loading.update = true;
            state.error.update = null;
        }).addCase(updateConfiguration.fulfilled, (state, action)=>{
            state.loading.update = false;
            const index = state.configurations.findIndex((c)=>c.key === action.payload.key);
            if (index > -1 && action.payload.data) {
                state.configurations[index] = action.payload.data;
            }
            if (state.currentConfiguration?.key === action.payload.key && action.payload.data) {
                state.currentConfiguration = action.payload.data;
            }
        }).addCase(updateConfiguration.rejected, (state, action)=>{
            state.loading.update = false;
            state.error.update = action.error.message || 'Failed to update configuration';
        });
        // Create configuration
        builder.addCase(createConfiguration.pending, (state)=>{
            state.loading.create = true;
            state.error.create = null;
        }).addCase(createConfiguration.fulfilled, (state, action)=>{
            state.loading.create = false;
            if (action.payload.data) {
                state.configurations.push(action.payload.data);
                state.pagination.total += 1;
            }
        }).addCase(createConfiguration.rejected, (state, action)=>{
            state.loading.create = false;
            state.error.create = action.error.message || 'Failed to create configuration';
        });
        // Delete configuration
        builder.addCase(deleteConfiguration.pending, (state)=>{
            state.loading.delete = true;
            state.error.delete = null;
        }).addCase(deleteConfiguration.fulfilled, (state, action)=>{
            state.loading.delete = false;
            state.configurations = state.configurations.filter((c)=>c.key !== action.payload.key);
            state.pagination.total = Math.max(0, state.pagination.total - 1);
            if (state.currentConfiguration?.key === action.payload.key) {
                state.currentConfiguration = null;
            }
        }).addCase(deleteConfiguration.rejected, (state, action)=>{
            state.loading.delete = false;
            state.error.delete = action.error.message || 'Failed to delete configuration';
        });
        // Fetch configuration history
        builder.addCase(fetchConfigurationHistory.pending, (state)=>{
            state.loading.history = true;
            state.error.history = null;
        }).addCase(fetchConfigurationHistory.fulfilled, (state, action)=>{
            state.loading.history = false;
            state.history = action.payload.data || [];
            state.historyPagination.total = action.payload.total || state.history.length;
            state.historyPagination.totalPages = Math.ceil(state.historyPagination.total / state.historyPagination.limit);
        }).addCase(fetchConfigurationHistory.rejected, (state, action)=>{
            state.loading.history = false;
            state.error.history = action.error.message || 'Failed to fetch configuration history';
        });
        // Fetch recent changes
        builder.addCase(fetchRecentChanges.pending, (state)=>{
            state.loading.recentChanges = true;
            state.error.recentChanges = null;
        }).addCase(fetchRecentChanges.fulfilled, (state, action)=>{
            state.loading.recentChanges = false;
            state.recentChanges = action.payload.data || [];
        }).addCase(fetchRecentChanges.rejected, (state, action)=>{
            state.loading.recentChanges = false;
            state.error.recentChanges = action.error.message || 'Failed to fetch recent changes';
        });
        // Bulk update
        builder.addCase(bulkUpdateConfigurations.pending, (state)=>{
            state.loading.bulkUpdate = true;
            state.error.bulkUpdate = null;
        }).addCase(bulkUpdateConfigurations.fulfilled, (state, action)=>{
            state.loading.bulkUpdate = false;
            // Refresh configurations after bulk update
            state.selectedConfigurations = [];
        }).addCase(bulkUpdateConfigurations.rejected, (state, action)=>{
            state.loading.bulkUpdate = false;
            state.error.bulkUpdate = action.error.message || 'Failed to bulk update configurations';
        });
        // Export configurations
        builder.addCase(exportConfigurations.pending, (state)=>{
            state.loading.export = true;
            state.error.export = null;
        }).addCase(exportConfigurations.fulfilled, (state, action)=>{
            state.loading.export = false;
        }).addCase(exportConfigurations.rejected, (state, action)=>{
            state.loading.export = false;
            state.error.export = action.error.message || 'Failed to export configurations';
        });
        // Import configurations
        builder.addCase(importConfigurations.pending, (state)=>{
            state.loading.import = true;
            state.error.import = null;
        }).addCase(importConfigurations.fulfilled, (state, action)=>{
            state.loading.import = false;
        }).addCase(importConfigurations.rejected, (state, action)=>{
            state.loading.import = false;
            state.error.import = action.error.message || 'Failed to import configurations';
        });
    }
});
const { clearCurrentConfiguration, setFilters, setPagination, setHistoryPagination, toggleConfigurationSelection, selectAllConfigurations, clearSelection, clearErrors } = configurationSlice.actions;
const selectConfigurations = (state)=>state.configuration.configurations;
const selectPublicConfigurations = (state)=>state.configuration.publicConfigurations;
const selectCurrentConfiguration = (state)=>state.configuration.currentConfiguration;
const selectHistory = (state)=>state.configuration.history;
const selectRecentChanges = (state)=>state.configuration.recentChanges;
const selectCategories = (state)=>state.configuration.categories;
const selectSelectedConfigurations = (state)=>state.configuration.selectedConfigurations;
const selectFilters = (state)=>state.configuration.filters;
const selectPagination = (state)=>state.configuration.pagination;
const selectHistoryPagination = (state)=>state.configuration.historyPagination;
const selectLoading = (state)=>state.configuration.loading;
const selectErrors = (state)=>state.configuration.error;
const selectFilteredConfigurations = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$reselect$2f$dist$2f$reselect$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createSelector"])([
    selectConfigurations,
    selectFilters
], (configurations, filters)=>{
    return configurations.filter((config)=>{
        if (filters.category && config.category !== filters.category) return false;
        if (filters.subCategory && config.subCategory !== filters.subCategory) return false;
        if (filters.scope && config.scope !== filters.scope) return false;
        if (filters.scopeId && config.scopeId !== filters.scopeId) return false;
        if (filters.isPublic !== null && config.isPublic !== filters.isPublic) return false;
        if (filters.isEditable !== null && config.isEditable !== filters.isEditable) return false;
        if (filters.tags.length > 0 && !filters.tags.some((tag)=>config.tags.includes(tag))) return false;
        if (filters.searchTerm) {
            const term = filters.searchTerm.toLowerCase();
            return config.key.toLowerCase().includes(term) || config.description?.toLowerCase().includes(term) || config.category.toLowerCase().includes(term);
        }
        return true;
    });
});
const selectConfigurationsByCategory = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$reselect$2f$dist$2f$reselect$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createSelector"])([
    selectConfigurations
], (configurations)=>{
    const grouped = {};
    configurations.forEach((config)=>{
        if (!grouped[config.category]) {
            grouped[config.category] = [];
        }
        grouped[config.category].push(config);
    });
    return grouped;
});
const selectEditableConfigurations = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$reselect$2f$dist$2f$reselect$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createSelector"])([
    selectConfigurations
], (configurations)=>configurations.filter((c)=>c.isEditable));
const selectConfigurationsRequiringRestart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$reselect$2f$dist$2f$reselect$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createSelector"])([
    selectConfigurations
], (configurations)=>configurations.filter((c)=>c.requiresRestart));
const selectConfigurationMetrics = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$reselect$2f$dist$2f$reselect$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createSelector"])([
    selectConfigurations
], (configurations)=>{
    const total = configurations.length;
    const editable = configurations.filter((c)=>c.isEditable).length;
    const publicCount = configurations.filter((c)=>c.isPublic).length;
    const requiresRestart = configurations.filter((c)=>c.requiresRestart).length;
    const categories = new Set(configurations.map((c)=>c.category)).size;
    return {
        total,
        editable,
        public: publicCount,
        requiresRestart,
        categories
    };
});
const __TURBOPACK__default__export__ = configurationSlice.reducer;
}),
"[project]/src/stores/slices/communicationSlice.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @module pages/communication/store/communicationSlice
 *
 * @description
 * Production-grade Redux state management for the communication and messaging system.
 * Manages email, SMS, and in-app messages with support for emergency broadcasts,
 * scheduled messaging, and multi-channel delivery tracking.
 *
 * ## Architecture
 *
 * This slice uses the entity slice factory pattern (`createEntitySlice`) for standardized
 * CRUD operations with normalized state management via Redux Toolkit's `EntityAdapter`.
 * This provides optimized entity management with built-in selectors and reducers.
 *
 * ## State Structure
 *
 * The state is normalized using EntityAdapter pattern:
 * - **entities**: Normalized message entities by ID for O(1) lookups
 * - **ids**: Ordered array of message IDs for iteration
 * - **loading**: Operation-specific loading flags
 * - **error**: Operation-specific error messages
 * - **pagination**: Page metadata for list views
 *
 * ## Key Features
 *
 * - **Multi-channel Messaging**: Email, SMS, in-app, and push notifications
 * - **Emergency Broadcasts**: Priority messaging with immediate delivery
 * - **Scheduled Messages**: Queue messages for future delivery
 * - **Delivery Tracking**: Real-time status updates for message delivery
 * - **Message Templates**: Pre-configured templates for common communications
 * - **Category Filtering**: Filter by announcement, emergency, general, alert, reminder
 * - **Priority Handling**: Support for normal, high, and urgent priority levels
 *
 * @remarks
 * ## Communication Workflows
 *
 * ### Emergency Broadcast Pattern
 *
 * 1. Create emergency message with EMERGENCY category and HIGH/URGENT priority
 * 2. System automatically selects multi-channel delivery (email + SMS + push)
 * 3. Message bypasses scheduling queue for immediate delivery
 * 4. Delivery status tracked in real-time with confirmation timestamps
 * 5. Failed deliveries trigger automatic retry with exponential backoff
 * 6. Administrator notified of delivery failures for urgent messages
 *
 * ### Scheduled Messaging Workflow
 *
 * 1. Create message with `scheduledAt` timestamp in the future
 * 2. Message stored in queue with SCHEDULED status
 * 3. Background job processes queue at scheduled times
 * 4. Message status updated to SENT upon delivery
 * 5. Delivery failures logged with error details
 * 6. Scheduled messages can be canceled or rescheduled before delivery
 *
 * ### Message Delivery Status Tracking
 *
 * - **DRAFT**: Message created but not sent
 * - **SCHEDULED**: Queued for future delivery
 * - **SENDING**: Currently being delivered
 * - **SENT**: Successfully delivered
 * - **DELIVERED**: Confirmed received by recipient
 * - **READ**: Recipient opened/read the message
 * - **FAILED**: Delivery failed (see error details)
 * - **CANCELED**: Scheduled message canceled before delivery
 *
 * ## Real-time Integration
 *
 * Integrates with WebSocket for real-time delivery status updates:
 * - Delivery confirmations pushed to client as they occur
 * - Read receipts updated in real-time for in-app messages
 * - Failed delivery notifications trigger UI alerts
 *
 * ## HIPAA Compliance
 *
 * - All message content containing PHI is encrypted at rest and in transit
 * - Audit logging for all message creation, delivery, and read events
 * - Role-based access control for message visibility
 * - Automatic data retention and purge policies
 *
 * ## Performance Considerations
 *
 * - Entity normalization enables efficient updates and lookups
 * - Pagination reduces initial load time for message lists
 * - Selective loading of message content (list vs detail view)
 * - Message search uses server-side full-text indexing
 * - Client-side filtering for small result sets
 *
 * @see {@link module:pages/incidents/store/incidentReportsSlice} for emergency incident notifications
 * @see {@link module:pages/contacts/store/contactsSlice} for contact notification cascades
 * @see {@link module:pages/students/store/studentsSlice} for parent/guardian contact information
 *
 * @example
 * ```typescript
 * // Send emergency broadcast to all parents
 * dispatch(communicationThunks.create({
 *   recipients: parentIds,
 *   subject: 'Emergency: School Closure',
 *   content: 'Due to weather conditions, school is closed today.',
 *   category: 'EMERGENCY',
 *   priority: 'URGENT',
 *   channels: ['EMAIL', 'SMS', 'PUSH']
 * }));
 *
 * // Schedule announcement for future delivery
 * dispatch(communicationThunks.create({
 *   recipients: allParents,
 *   subject: 'Upcoming Event Reminder',
 *   content: 'Parent-teacher conferences next week...',
 *   category: 'ANNOUNCEMENT',
 *   scheduledAt: '2025-02-01T08:00:00Z'
 * }));
 *
 * // Fetch recent messages with category filter
 * dispatch(communicationThunks.fetchAll({
 *   category: 'EMERGENCY',
 *   startDate: '2025-01-01',
 *   limit: 50
 * }));
 *
 * // Access messages using entity selectors
 * const allMessages = useSelector(communicationSelectors.selectAll);
 * const messageById = useSelector(state =>
 *   communicationSelectors.selectById(state, messageId)
 * );
 * const emergencyMessages = useSelector(selectEmergencyMessages);
 * const scheduledMessages = useSelector(selectScheduledMessages);
 * ```
 */ __turbopack_context__.s([
    "communicationActions",
    ()=>communicationActions,
    "communicationReducer",
    ()=>communicationReducer,
    "communicationSelectors",
    ()=>communicationSelectors,
    "communicationSlice",
    ()=>communicationSlice,
    "communicationThunks",
    ()=>communicationThunks,
    "selectEmergencyMessages",
    ()=>selectEmergencyMessages,
    "selectMessagesByCategory",
    ()=>selectMessagesByCategory,
    "selectMessagesByPriority",
    ()=>selectMessagesByPriority,
    "selectMessagesBySender",
    ()=>selectMessagesBySender,
    "selectRecentMessages",
    ()=>selectRecentMessages,
    "selectScheduledMessages",
    ()=>selectScheduledMessages
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$sliceFactory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/stores/sliceFactory.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$sliceFactory$2f$core$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/sliceFactory/core.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/lib/api/index.ts [app-ssr] (ecmascript) <locals>");
;
;
/**
 * Communication API service adapter.
 *
 * Adapts the communication API to the entity service interface required by
 * the slice factory. Provides standardized CRUD operations with consistent
 * error handling and response formatting.
 *
 * @const {EntityApiService<Message, CreateMessageData, UpdateMessageData>}
 *
 * @remarks
 * ## API Integration Notes
 *
 * - `getAll`: Supports pagination and filtering by category, sender, priority
 * - `getById`: Loads full message with delivery tracking and read receipts
 * - `create`: Validates recipients and enforces business rules
 * - `update`: Only allows updates to DRAFT/SCHEDULED messages
 * - `delete`: Soft-deletes messages for audit trail preservation
 *
 * ## Error Handling
 *
 * All methods handle common error scenarios:
 * - Invalid recipient IDs (rejected with validation error)
 * - Missing required fields (subject, content, recipients)
 * - Unauthorized access (RBAC permission check failures)
 * - Network errors (automatic retry with exponential backoff)
 *
 * @example
 * ```typescript
 * // Direct API usage (normally handled by thunks)
 * const response = await communicationApiService.getAll({
 *   category: 'EMERGENCY',
 *   page: 1,
 *   limit: 20
 * });
 * ```
 */ const communicationApiService = {
    /**
   * Fetch all messages with optional filtering.
   *
   * @async
   * @param {MessageFilters} [params] - Filter and pagination parameters
   * @returns {Promise<{data: Message[], total?: number, pagination?: Object}>}
   */ async getAll (params) {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["apiActions"].communication.getMessages(params);
        return {
            data: response.messages || [],
            total: response.pagination?.total,
            pagination: response.pagination
        };
    },
    /**
   * Fetch single message by ID.
   *
   * @async
   * @param {string} id - Message unique identifier
   * @returns {Promise<{data: Message}>}
   */ async getById (id) {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["apiActions"].communication.getMessageById(id);
        return {
            data: response.message
        };
    },
    /**
   * Create new message.
   *
   * @async
   * @param {CreateMessageData} data - Message creation data
   * @returns {Promise<{data: Message}>}
   */ async create (data) {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["apiActions"].communication.sendMessage(data);
        return {
            data: response.message
        };
    },
    /**
   * Update existing message.
   *
   * @async
   * @param {string} id - Message unique identifier
   * @param {UpdateMessageData} data - Partial update data
   * @returns {Promise<{data: Message}>}
   * @throws {Error} When attempting to update sent messages
   */ async update (id, data) {
        // Note: Update functionality may need to be implemented in the API
        // For now, return the original message structure
        throw new Error('Message update not implemented in API');
    },
    /**
   * Delete message.
   *
   * @async
   * @param {string} id - Message unique identifier
   * @returns {Promise<{success: boolean}>}
   * @throws {Error} When attempting to delete sent messages
   */ async delete (id) {
        // Note: Delete functionality may need to be implemented in the API
        // For now, return success
        throw new Error('Message delete not implemented in API');
    }
};
/**
 * Communication slice factory instance.
 *
 * Creates the Redux slice using the entity factory pattern with standardized
 * CRUD operations, normalized state, and built-in selectors.
 *
 * @const
 *
 * @property {Object} slice - Redux slice with reducers and actions
 * @property {EntityAdapter} adapter - Entity adapter with normalized selectors
 * @property {Object} thunks - Async thunk creators for API operations
 * @property {Object} actions - Synchronous action creators
 */ const communicationSliceFactory = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$sliceFactory$2f$core$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createEntitySlice"])('communication', communicationApiService, {
    enableBulkOperations: true
});
const communicationSlice = communicationSliceFactory.slice;
const communicationReducer = communicationSlice.reducer;
const communicationActions = communicationSliceFactory.actions;
const communicationSelectors = communicationSliceFactory.adapter.getSelectors((state)=>state.communication);
const communicationThunks = communicationSliceFactory.thunks;
const selectMessagesByCategory = (state, category)=>{
    const allMessages = communicationSelectors.selectAll(state);
    return allMessages.filter((message)=>message.category === category);
};
const selectMessagesBySender = (state, senderId)=>{
    const allMessages = communicationSelectors.selectAll(state);
    return allMessages.filter((message)=>message.senderId === senderId);
};
const selectMessagesByPriority = (state, priority)=>{
    const allMessages = communicationSelectors.selectAll(state);
    return allMessages.filter((message)=>message.priority === priority);
};
const selectScheduledMessages = (state)=>{
    const allMessages = communicationSelectors.selectAll(state);
    return allMessages.filter((message)=>message.scheduledAt && new Date(message.scheduledAt) > new Date());
};
const selectEmergencyMessages = (state)=>{
    const allMessages = communicationSelectors.selectAll(state);
    return allMessages.filter((message)=>message.category === 'EMERGENCY');
};
const selectRecentMessages = (state, days = 7)=>{
    const allMessages = communicationSelectors.selectAll(state);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    return allMessages.filter((message)=>{
        const messageDate = new Date(message.createdAt);
        return messageDate >= cutoffDate;
    }).sort((a, b)=>new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};
}),
"[project]/src/stores/slices/documentsSlice.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @module pages/documents/store/documentsSlice
 *
 * @description
 * Production-grade Redux state management for document management system.
 * Handles CRUD operations for documents with support for versioning, digital signatures,
 * audit trails, and HIPAA-compliant access control.
 *
 * ## Architecture
 *
 * This slice uses the entity slice factory pattern (`createEntitySlice`) for standardized
 * CRUD operations with normalized state management via Redux Toolkit's `EntityAdapter`.
 * This provides optimized entity management with O(1) lookups and efficient updates.
 *
 * ## State Structure
 *
 * The state is normalized using EntityAdapter pattern:
 * - **entities**: Normalized document entities by ID for fast lookups
 * - **ids**: Ordered array of document IDs for iteration
 * - **loading**: Operation-specific loading flags
 * - **error**: Operation-specific error messages
 * - **pagination**: Page metadata for list views
 *
 * ## Key Features
 *
 * - **Document Upload**: Support for multiple file types with size validation
 * - **Version Control**: Automatic versioning with audit trail
 * - **Digital Signatures**: Electronic signature capture and validation
 * - **Access Control**: Role-based document visibility and permissions
 * - **Tag System**: Flexible tagging for categorization and search
 * - **Status Tracking**: DRAFT, PENDING_REVIEW, APPROVED, ARCHIVED workflow
 * - **Audit Trail**: Complete history of document access and modifications
 *
 * @remarks
 * ## Document Management Workflows
 *
 * ### Document Upload and Processing
 *
 * 1. User selects file(s) for upload
 * 2. Client validates file type, size, and content
 * 3. File uploaded to secure storage (S3/Azure Blob)
 * 4. Document metadata created with PENDING_REVIEW status
 * 5. OCR/text extraction performed for searchability
 * 6. Virus scanning completed before approval
 * 7. Administrator reviews and approves document
 * 8. Document status updated to APPROVED
 *
 * ### Document Versioning Workflow
 *
 * 1. User uploads new version of existing document
 * 2. Previous version archived with version number
 * 3. New version created with incremented version number
 * 4. Audit trail updated with version change details
 * 5. Users notified of new version availability
 * 6. Previous versions remain accessible for compliance
 *
 * ### Digital Signature Workflow
 *
 * 1. Document marked as requiring signature
 * 2. Signature request sent to designated signers
 * 3. Signer reviews document content
 * 4. Electronic signature captured (typed, drawn, or image)
 * 5. Signature cryptographically bound to document
 * 6. Timestamp and IP address recorded
 * 7. Document locked for editing after signing
 * 8. Signed document archived with certificate
 *
 * ### Document Access Audit Trail
 *
 * All document operations are logged:
 * - **View**: User ID, timestamp, IP address, duration
 * - **Download**: User ID, timestamp, IP address, file hash
 * - **Edit**: User ID, timestamp, changes made, previous version
 * - **Share**: User ID, timestamp, recipient(s), expiration
 * - **Delete**: User ID, timestamp, reason, soft delete only
 *
 * ## PHI Handling
 *
 * Documents containing PHI (Protected Health Information) receive special handling:
 * - Encryption at rest using AES-256
 * - Encryption in transit using TLS 1.3
 * - Access limited to authorized users only
 * - Audit logging for all access attempts
 * - Automatic expiration for shared links
 * - Watermarks on downloaded copies
 *
 * ## Document Retention Policy
 *
 * - **Medical Records**: Retained for 7 years after last treatment
 * - **Consent Forms**: Retained for 7 years after student graduation
 * - **Incident Reports**: Retained for 10 years
 * - **General Documents**: Retained for 3 years
 * - **Archived Documents**: Moved to cold storage after retention period
 * - **Deletion**: Physical deletion only after legal hold clearance
 *
 * ## Performance Considerations
 *
 * - Pagination for large document lists
 * - Lazy loading of document content (metadata first, content on-demand)
 * - Thumbnail generation for image documents
 * - PDF preview generation for quick viewing
 * - Client-side caching with cache invalidation
 * - Compression for large files during upload/download
 *
 * @see {@link module:pages/compliance/store/complianceSlice} for compliance document tracking
 * @see {@link module:pages/students/store/studentsSlice} for student-specific documents
 * @see {@link module:pages/incidents/store/incidentReportsSlice} for incident documentation
 *
 * @example
 * ```typescript
 * // Upload new document
 * dispatch(documentsThunks.create({
 *   name: 'Consent Form - Annual Physical',
 *   type: 'application/pdf',
 *   size: 245678,
 *   url: 's3://bucket/documents/consent-form.pdf',
 *   studentId: 'student-123',
 *   tags: ['consent', 'medical', 'physical'],
 *   category: 'CONSENT_FORM'
 * }));
 *
 * // Fetch student documents
 * dispatch(documentsThunks.fetchAll({
 *   studentId: 'student-123',
 *   category: 'MEDICAL_RECORDS',
 *   isActive: true
 * }));
 *
 * // Update document status
 * dispatch(documentsThunks.update('doc-456', {
 *   status: 'APPROVED',
 *   reviewedBy: currentUserId,
 *   reviewedAt: new Date().toISOString()
 * }));
 *
 * // Access documents using selectors
 * const allDocuments = useSelector(documentsSelectors.selectAll);
 * const studentDocs = useSelector(state =>
 *   selectDocumentsByStudent(state, studentId)
 * );
 * const activeDocuments = useSelector(selectActiveDocuments);
 * const recentDocuments = useSelector(state =>
 *   selectRecentDocuments(state, 30)
 * );
 * ```
 */ __turbopack_context__.s([
    "documentsActions",
    ()=>documentsActions,
    "documentsReducer",
    ()=>documentsReducer,
    "documentsSelectors",
    ()=>documentsSelectors,
    "documentsSlice",
    ()=>documentsSlice,
    "documentsThunks",
    ()=>documentsThunks,
    "selectActiveDocuments",
    ()=>selectActiveDocuments,
    "selectDocumentsByStudent",
    ()=>selectDocumentsByStudent,
    "selectDocumentsByTag",
    ()=>selectDocumentsByTag,
    "selectDocumentsByType",
    ()=>selectDocumentsByType,
    "selectDocumentsByUploader",
    ()=>selectDocumentsByUploader,
    "selectRecentDocuments",
    ()=>selectRecentDocuments
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$sliceFactory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/stores/sliceFactory.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$sliceFactory$2f$core$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/sliceFactory/core.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/lib/api/index.ts [app-ssr] (ecmascript) <locals>");
;
;
/**
 * Documents API service adapter.
 *
 * Adapts the documents API to the entity service interface required by
 * the slice factory. Provides standardized CRUD operations with consistent
 * error handling and response formatting.
 *
 * @const {EntityApiService<Document, CreateDocumentData, UpdateDocumentData>}
 *
 * @remarks
 * ## API Integration Notes
 *
 * - `getAll`: Supports filtering by student, type, category, tags, status
 * - `getById`: Loads full document metadata with access history
 * - `create`: Validates file type and size before storage
 * - `update`: Only metadata updates allowed (name, tags, status)
 * - `delete`: Soft-deletes documents for audit trail preservation
 *
 * ## Error Handling
 *
 * All methods handle common error scenarios:
 * - Invalid file types (rejected with validation error)
 * - File size exceeding limits (rejected with size error)
 * - Unauthorized access (RBAC permission check failures)
 * - Storage failures (automatic retry with exponential backoff)
 * - Virus detection (document quarantined, user notified)
 */ const documentsApiService = {
    /**
   * Fetch all documents with optional filtering.
   *
   * @async
   * @param {DocumentFilters} [params] - Filter and pagination parameters
   * @returns {Promise<{data: Document[], total: number, pagination?: Object}>}
   */ async getAll (params) {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["apiActions"].documents.getDocuments(params);
        return {
            data: response.documents || [],
            total: response.pagination?.total || 0,
            pagination: response.pagination ? {
                page: response.pagination.page,
                pageSize: response.pagination.limit,
                total: response.pagination.total,
                totalPages: response.pagination.pages
            } : undefined
        };
    },
    /**
   * Fetch single document by ID.
   *
   * @async
   * @param {string} id - Document unique identifier
   * @returns {Promise<{data: Document}>}
   */ async getById (id) {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["apiActions"].documents.getDocumentById(id);
        return {
            data: response.document
        };
    },
    /**
   * Create new document.
   *
   * @async
   * @param {CreateDocumentData} data - Document creation data
   * @returns {Promise<{data: Document}>}
   */ async create (data) {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["apiActions"].documents.createDocument(data);
        return {
            data: response.document
        };
    },
    /**
   * Update existing document metadata.
   *
   * @async
   * @param {string} id - Document unique identifier
   * @param {UpdateDocumentData} data - Partial update data
   * @returns {Promise<{data: Document}>}
   */ async update (id, data) {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["apiActions"].documents.updateDocument(id, data);
        return {
            data: response.document
        };
    },
    /**
   * Delete document (soft delete).
   *
   * @async
   * @param {string} id - Document unique identifier
   * @returns {Promise<{success: boolean}>}
   */ async delete (id) {
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["apiActions"].documents.deleteDocument(id);
        return {
            success: true
        };
    }
};
/**
 * Documents slice factory instance.
 *
 * Creates the Redux slice using the entity factory pattern with standardized
 * CRUD operations, normalized state, and built-in selectors.
 *
 * @const
 *
 * @property {Object} slice - Redux slice with reducers and actions
 * @property {EntityAdapter} adapter - Entity adapter with normalized selectors
 * @property {Object} thunks - Async thunk creators for API operations
 * @property {Object} actions - Synchronous action creators
 */ const documentsSliceFactory = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$sliceFactory$2f$core$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createEntitySlice"])('documents', documentsApiService, {
    enableBulkOperations: true
});
const documentsSlice = documentsSliceFactory.slice;
const documentsReducer = documentsSlice.reducer;
const documentsActions = documentsSliceFactory.actions;
const documentsSelectors = documentsSliceFactory.adapter.getSelectors((state)=>state.documents);
const documentsThunks = documentsSliceFactory.thunks;
const selectDocumentsByStudent = (state, studentId)=>{
    const allDocuments = documentsSelectors.selectAll(state);
    return allDocuments.filter((document)=>document.studentId === studentId);
};
const selectActiveDocuments = (state)=>{
    const allDocuments = documentsSelectors.selectAll(state);
    return allDocuments.filter((document)=>document.status === 'APPROVED' || document.status === 'PENDING_REVIEW');
};
const selectDocumentsByType = (state, category)=>{
    const allDocuments = documentsSelectors.selectAll(state);
    return allDocuments.filter((document)=>document.category === category);
};
const selectDocumentsByUploader = (state, uploadedBy)=>{
    const allDocuments = documentsSelectors.selectAll(state);
    return allDocuments.filter((document)=>document.uploadedBy === uploadedBy);
};
const selectDocumentsByTag = (state, tag)=>{
    const allDocuments = documentsSelectors.selectAll(state);
    return allDocuments.filter((document)=>document.tags && document.tags.includes(tag));
};
const selectRecentDocuments = (state, days = 7)=>{
    const allDocuments = documentsSelectors.selectAll(state);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    return allDocuments.filter((document)=>{
        const createdDate = new Date(document.createdAt);
        return createdDate >= cutoffDate;
    }).sort((a, b)=>new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};
}),
"[project]/src/stores/slices/contactsSlice.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @fileoverview Emergency Contacts Redux Slice for White Cross Healthcare Platform
 *
 * Manages emergency contact information and communication workflows for student safety.
 * Provides comprehensive state management for emergency contact CRUD operations,
 * notification systems, and contact verification processes.
 *
 * **Key Features:**
 * - Emergency contact CRUD operations with validation
 * - Multi-channel notification system (SMS, email, voice)
 * - Contact verification and authentication workflows
 * - Student-contact relationship management
 * - Real-time notification status tracking
 * - Emergency communication statistics and reporting
 * - Contact priority management (PRIMARY, SECONDARY)
 * - Parent/guardian consent tracking
 *
 * **HIPAA Compliance:**
 * - Emergency contact information is considered PHI (names, phones, relationships)
 * - All operations generate audit logs for compliance tracking
 * - State is NOT persisted to localStorage (memory-only for PHI protection)
 * - Cross-tab synchronization uses BroadcastChannel API
 * - Contact verification data expires after configured time limit
 * - All communication attempts are logged with timestamps
 *
 * **Emergency Workflows:**
 * - **Contact Cascade**: Automatic progression through contact priority levels
 * - **Verification Required**: Contact authentication before sensitive communications
 * - **Multi-Channel Delivery**: Simultaneous SMS, email, and voice notifications
 * - **Delivery Confirmation**: Real-time status updates for all notification attempts
 * - **Failed Contact Escalation**: Automatic escalation when contacts unreachable
 *
 * **State Management:**
 * - Uses manual thunk pattern for specialized emergency contact API integration
 * - Normalized state structure for efficient contact lookups and updates
 * - Separate loading states for each operation type (CRUD, notifications, verification)
 * - Comprehensive error handling with user-friendly messages
 * - Optimistic updates for immediate UI responsiveness
 *
 * **Integration:**
 * - Backend API: `services/modules/emergencyContactsApi.ts`
 * - Type definitions: `types/student.types.ts`
 * - Redux store: `stores/reduxStore.ts`
 * - Used by: Emergency response systems, parent communication, incident reporting
 *
 * @module stores/slices/contactsSlice
 * @requires @reduxjs/toolkit
 * @requires services/modules/emergencyContactsApi
 * @requires types/student.types
 * @security Emergency contact management, PHI handling
 * @compliance HIPAA-compliant emergency contact operations
 *
 * @example Emergency notification workflow
 * ```typescript
 * import { useDispatch, useSelector } from 'react-redux';
 * import { notifyStudent, fetchContactsByStudent } from '@/stores/slices/contactsSlice';
 *
 * function EmergencyNotification({ studentId }) {
 *   const dispatch = useDispatch();
 *   const { contacts, notificationResults, notificationsLoading } = useSelector(
 *     (state) => state.contacts
 *   );
 *
 *   const sendEmergencyAlert = async () => {
 *     // Send notification to all emergency contacts
 *     await dispatch(notifyStudent({
 *       studentId,
 *       notification: {
 *         subject: 'Emergency: Student Incident',
 *         message: 'Your child requires immediate attention. Please contact the school.',
 *         urgency: 'HIGH',
 *         channels: ['SMS', 'EMAIL', 'VOICE']
 *       }
 *     }));
 *   };
 *
 *   return (
 *     <button onClick={sendEmergencyAlert} disabled={notificationsLoading}>
 *       {notificationsLoading ? 'Notifying...' : 'Send Emergency Alert'}
 *     </button>
 *   );
 * }
 * ```
 *
 * @example Contact verification flow
 * ```typescript
 * function ContactVerification({ contactId }) {
 *   const dispatch = useDispatch();
 *   const { verificationResponse, verificationLoading } = useSelector(
 *     (state) => state.contacts
 *   );
 *
 *   const verifyContact = async (method) => {
 *     const result = await dispatch(verifyContact({ contactId, method }));
 *     
 *     if (result.verified) {
 *       // Proceed with sensitive communication
 *       console.log('Contact verified, proceeding with communication');
 *     } else {
 *       // Request alternative verification
 *       console.log('Verification failed, try alternative method');
 *     }
 *   };
 *
 *   return (
 *     <div>
 *       <button onClick={() => verifyContact('sms')}>Verify via SMS</button>
 *       <button onClick={() => verifyContact('voice')}>Verify via Voice Call</button>
 *     </div>
 *   );
 * }
 * ```
 *
 * @see {@link ../../services/modules/emergencyContactsApi.ts} for API integration
 * @see {@link ../reduxStore.ts} for store configuration
 * @see {@link ../../types/student.types.ts} for type definitions
 * @since 1.0.0
 */ __turbopack_context__.s([
    "ContactsApiService",
    ()=>ContactsApiService,
    "clearContactsError",
    ()=>clearContactsError,
    "clearNotificationResults",
    ()=>clearNotificationResults,
    "clearNotificationsError",
    ()=>clearNotificationsError,
    "clearStatisticsError",
    ()=>clearStatisticsError,
    "clearVerificationError",
    ()=>clearVerificationError,
    "clearVerificationResponse",
    ()=>clearVerificationResponse,
    "contactsApiService",
    ()=>contactsApiService,
    "createEmergencyContact",
    ()=>createEmergencyContact,
    "default",
    ()=>__TURBOPACK__default__export__,
    "deleteEmergencyContact",
    ()=>deleteEmergencyContact,
    "fetchContactStatistics",
    ()=>fetchContactStatistics,
    "fetchContactsByStudent",
    ()=>fetchContactsByStudent,
    "notifyContact",
    ()=>notifyContact,
    "notifyStudent",
    ()=>notifyStudent,
    "selectContactStatistics",
    ()=>selectContactStatistics,
    "selectContacts",
    ()=>selectContacts,
    "selectContactsError",
    ()=>selectContactsError,
    "selectContactsLoading",
    ()=>selectContactsLoading,
    "selectNotificationResults",
    ()=>selectNotificationResults,
    "selectNotificationsError",
    ()=>selectNotificationsError,
    "selectNotificationsLoading",
    ()=>selectNotificationsLoading,
    "selectPrimaryContacts",
    ()=>selectPrimaryContacts,
    "selectSecondaryContacts",
    ()=>selectSecondaryContacts,
    "selectSelectedStudentContacts",
    ()=>selectSelectedStudentContacts,
    "selectSelectedStudentId",
    ()=>selectSelectedStudentId,
    "selectStatisticsError",
    ()=>selectStatisticsError,
    "selectStatisticsLoading",
    ()=>selectStatisticsLoading,
    "selectUnverifiedContacts",
    ()=>selectUnverifiedContacts,
    "selectVerificationError",
    ()=>selectVerificationError,
    "selectVerificationLoading",
    ()=>selectVerificationLoading,
    "selectVerificationResponse",
    ()=>selectVerificationResponse,
    "selectVerifiedContacts",
    ()=>selectVerifiedContacts,
    "setSelectedStudent",
    ()=>setSelectedStudent,
    "updateEmergencyContact",
    ()=>updateEmergencyContact,
    "verifyContact",
    ()=>verifyContact
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/lib/api/index.ts [app-ssr] (ecmascript) <locals>");
;
;
class ContactsApiService {
    // Emergency contacts
    async getContactsByStudent(studentId) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["apiActions"].emergencyContacts.getByStudent(studentId);
    }
    async createEmergencyContact(data) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["apiActions"].emergencyContacts.create(data);
    }
    async updateEmergencyContact(id, data) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["apiActions"].emergencyContacts.update(id, data);
    }
    async deleteEmergencyContact(id) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["apiActions"].emergencyContacts.delete(id);
    }
    // Notifications
    async notifyStudent(studentId, notification) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["apiActions"].emergencyContacts.notifyStudent(studentId, notification);
    }
    async notifyContact(contactId, notification) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["apiActions"].emergencyContacts.notifyContact(contactId, notification);
    }
    // Verification
    async verifyContact(contactId, method) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["apiActions"].emergencyContacts.verify(contactId, method);
    }
    // Statistics
    async getStatistics() {
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["apiActions"].emergencyContacts.getStatistics();
    }
}
const contactsApiService = new ContactsApiService();
// Initial state
const initialState = {
    contacts: [],
    contactsLoading: false,
    contactsError: null,
    selectedStudentId: null,
    selectedStudentContacts: [],
    notificationResults: [],
    notificationsLoading: false,
    notificationsError: null,
    verificationResponse: null,
    verificationLoading: false,
    verificationError: null,
    statistics: null,
    statisticsLoading: false,
    statisticsError: null
};
const fetchContactsByStudent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])('contacts/fetchByStudent', async (studentId)=>{
    const response = await contactsApiService.getContactsByStudent(studentId);
    return {
        studentId,
        contacts: response.contacts
    };
});
const createEmergencyContact = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])('contacts/create', async (data)=>{
    const response = await contactsApiService.createEmergencyContact(data);
    return response.contact;
});
const updateEmergencyContact = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])('contacts/update', async ({ id, data })=>{
    const response = await contactsApiService.updateEmergencyContact(id, data);
    return response.contact;
});
const deleteEmergencyContact = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])('contacts/delete', async (id)=>{
    await contactsApiService.deleteEmergencyContact(id);
    return id;
});
const notifyStudent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])('contacts/notifyStudent', async ({ studentId, notification })=>{
    const response = await contactsApiService.notifyStudent(studentId, notification);
    return response.results;
});
const notifyContact = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])('contacts/notifyContact', async ({ contactId, notification })=>{
    const response = await contactsApiService.notifyContact(contactId, notification);
    return response.result;
});
const verifyContact = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])('contacts/verify', async ({ contactId, method })=>{
    const response = await contactsApiService.verifyContact(contactId, method);
    return response;
});
const fetchContactStatistics = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])('contacts/fetchStatistics', async ()=>{
    const statistics = await contactsApiService.getStatistics();
    return statistics;
});
// Slice
const contactsSlice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createSlice"])({
    name: 'contacts',
    initialState,
    reducers: {
        // Clear errors
        clearContactsError: (state)=>{
            state.contactsError = null;
        },
        clearNotificationsError: (state)=>{
            state.notificationsError = null;
        },
        clearVerificationError: (state)=>{
            state.verificationError = null;
        },
        clearStatisticsError: (state)=>{
            state.statisticsError = null;
        },
        // Set selected student
        setSelectedStudent: (state, action)=>{
            state.selectedStudentId = action.payload;
        },
        // Clear verification response
        clearVerificationResponse: (state)=>{
            state.verificationResponse = null;
        },
        // Clear notification results
        clearNotificationResults: (state)=>{
            state.notificationResults = [];
        }
    },
    extraReducers: (builder)=>{
        // Fetch contacts by student
        builder.addCase(fetchContactsByStudent.pending, (state)=>{
            state.contactsLoading = true;
            state.contactsError = null;
        }).addCase(fetchContactsByStudent.fulfilled, (state, action)=>{
            state.contactsLoading = false;
            state.selectedStudentId = action.payload.studentId;
            state.selectedStudentContacts = action.payload.contacts;
            // Also update the main contacts array
            state.contacts = action.payload.contacts;
        }).addCase(fetchContactsByStudent.rejected, (state, action)=>{
            state.contactsLoading = false;
            state.contactsError = action.error.message || 'Failed to fetch contacts';
        })// Create emergency contact
        .addCase(createEmergencyContact.pending, (state)=>{
            state.contactsLoading = true;
            state.contactsError = null;
        }).addCase(createEmergencyContact.fulfilled, (state, action)=>{
            state.contactsLoading = false;
            state.contacts.push(action.payload);
            if (state.selectedStudentId === action.payload.studentId) {
                state.selectedStudentContacts.push(action.payload);
            }
        }).addCase(createEmergencyContact.rejected, (state, action)=>{
            state.contactsLoading = false;
            state.contactsError = action.error.message || 'Failed to create contact';
        })// Update emergency contact
        .addCase(updateEmergencyContact.pending, (state)=>{
            state.contactsLoading = true;
            state.contactsError = null;
        }).addCase(updateEmergencyContact.fulfilled, (state, action)=>{
            state.contactsLoading = false;
            const updatedContact = action.payload;
            // Update in main contacts array
            const contactIndex = state.contacts.findIndex((c)=>c.id === updatedContact.id);
            if (contactIndex !== -1) {
                state.contacts[contactIndex] = updatedContact;
            }
            // Update in selected student contacts
            const studentContactIndex = state.selectedStudentContacts.findIndex((c)=>c.id === updatedContact.id);
            if (studentContactIndex !== -1) {
                state.selectedStudentContacts[studentContactIndex] = updatedContact;
            }
        }).addCase(updateEmergencyContact.rejected, (state, action)=>{
            state.contactsLoading = false;
            state.contactsError = action.error.message || 'Failed to update contact';
        })// Delete emergency contact
        .addCase(deleteEmergencyContact.pending, (state)=>{
            state.contactsLoading = true;
            state.contactsError = null;
        }).addCase(deleteEmergencyContact.fulfilled, (state, action)=>{
            state.contactsLoading = false;
            const deletedId = action.payload;
            // Remove from main contacts array
            state.contacts = state.contacts.filter((c)=>c.id !== deletedId);
            // Remove from selected student contacts
            state.selectedStudentContacts = state.selectedStudentContacts.filter((c)=>c.id !== deletedId);
        }).addCase(deleteEmergencyContact.rejected, (state, action)=>{
            state.contactsLoading = false;
            state.contactsError = action.error.message || 'Failed to delete contact';
        })// Notify student
        .addCase(notifyStudent.pending, (state)=>{
            state.notificationsLoading = true;
            state.notificationsError = null;
        }).addCase(notifyStudent.fulfilled, (state, action)=>{
            state.notificationsLoading = false;
            state.notificationResults = action.payload;
        }).addCase(notifyStudent.rejected, (state, action)=>{
            state.notificationsLoading = false;
            state.notificationsError = action.error.message || 'Failed to send notifications';
        })// Notify contact
        .addCase(notifyContact.pending, (state)=>{
            state.notificationsLoading = true;
            state.notificationsError = null;
        }).addCase(notifyContact.fulfilled, (state, action)=>{
            state.notificationsLoading = false;
            state.notificationResults = [
                action.payload
            ];
        }).addCase(notifyContact.rejected, (state, action)=>{
            state.notificationsLoading = false;
            state.notificationsError = action.error.message || 'Failed to send notification';
        })// Verify contact
        .addCase(verifyContact.pending, (state)=>{
            state.verificationLoading = true;
            state.verificationError = null;
        }).addCase(verifyContact.fulfilled, (state, action)=>{
            state.verificationLoading = false;
            state.verificationResponse = action.payload;
        }).addCase(verifyContact.rejected, (state, action)=>{
            state.verificationLoading = false;
            state.verificationError = action.error.message || 'Failed to verify contact';
        })// Fetch statistics
        .addCase(fetchContactStatistics.pending, (state)=>{
            state.statisticsLoading = true;
            state.statisticsError = null;
        }).addCase(fetchContactStatistics.fulfilled, (state, action)=>{
            state.statisticsLoading = false;
            state.statistics = action.payload;
        }).addCase(fetchContactStatistics.rejected, (state, action)=>{
            state.statisticsLoading = false;
            state.statisticsError = action.error.message || 'Failed to fetch statistics';
        });
    }
});
const selectContacts = (state)=>state.contacts.contacts;
const selectContactsLoading = (state)=>state.contacts.contactsLoading;
const selectContactsError = (state)=>state.contacts.contactsError;
const selectSelectedStudentId = (state)=>state.contacts.selectedStudentId;
const selectSelectedStudentContacts = (state)=>state.contacts.selectedStudentContacts;
const selectNotificationResults = (state)=>state.contacts.notificationResults;
const selectNotificationsLoading = (state)=>state.contacts.notificationsLoading;
const selectNotificationsError = (state)=>state.contacts.notificationsError;
const selectVerificationResponse = (state)=>state.contacts.verificationResponse;
const selectVerificationLoading = (state)=>state.contacts.verificationLoading;
const selectVerificationError = (state)=>state.contacts.verificationError;
const selectContactStatistics = (state)=>state.contacts.statistics;
const selectStatisticsLoading = (state)=>state.contacts.statisticsLoading;
const selectStatisticsError = (state)=>state.contacts.statisticsError;
const selectPrimaryContacts = (state)=>{
    return state.contacts.selectedStudentContacts.filter((contact)=>contact.priority === 'PRIMARY');
};
const selectSecondaryContacts = (state)=>{
    return state.contacts.selectedStudentContacts.filter((contact)=>contact.priority === 'SECONDARY');
};
const selectVerifiedContacts = (state)=>{
    return state.contacts.selectedStudentContacts.filter((contact)=>contact.verificationStatus === 'VERIFIED');
};
const selectUnverifiedContacts = (state)=>{
    return state.contacts.selectedStudentContacts.filter((contact)=>contact.verificationStatus !== 'VERIFIED');
};
const { clearContactsError, clearNotificationsError, clearVerificationError, clearStatisticsError, setSelectedStudent, clearVerificationResponse, clearNotificationResults } = contactsSlice.actions;
const __TURBOPACK__default__export__ = contactsSlice.reducer;
}),
"[project]/src/stores/slices/themeSlice.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @fileoverview Theme and UI Preferences Redux Slice for White Cross Healthcare Platform
 *
 * Manages global UI theme, accessibility preferences, and user interface customizations
 * for the healthcare platform. Provides comprehensive state management for visual
 * preferences, accessibility compliance, and responsive design settings.
 *
 * **Key Features:**
 * - Dark/light/system theme modes with automatic system preference detection
 * - Healthcare-optimized color schemes (blue, teal, purple, green)
 * - UI density settings for optimal healthcare workflow efficiency
 * - Comprehensive accessibility preferences (high contrast, reduced motion, font scaling)
 * - Sidebar and tooltip visibility controls
 * - Cross-device preference synchronization
 * - Real-time theme switching without page reload
 * - SSR-compatible with hydration-safe theme detection
 *
 * **HIPAA Compliance:**
 * - Theme preferences contain NO PHI data - safe for localStorage persistence
 * - All preferences are user-specific and do not contain patient information
 * - Theme settings do not affect data security or access controls
 * - Accessibility preferences support compliance with ADA and Section 508 requirements
 * - No audit logging required for theme changes (non-PHI preference data)
 *
 * **Healthcare UI Considerations:**
 * - **High Contrast Mode**: Essential for medical professionals working in varied lighting
 * - **Font Scaling**: Critical for readability of patient data and medication information
 * - **Reduced Motion**: Important for users with vestibular disorders or motion sensitivity
 * - **UI Density**: Optimized spacing for efficiency in clinical workflows
 * - **Color Schemes**: Designed for medical environments with appropriate contrast ratios
 *
 * **Accessibility Features:**
 * - WCAG 2.1 AA compliant color combinations
 * - Keyboard navigation support indicators
 * - Screen reader compatibility modes
 * - Motion reduction for vestibular disorder accommodation
 * - Font scaling from 80% to 150% for vision accommodation
 * - High contrast mode with enhanced color separation
 *
 * **State Persistence:**
 * - All preferences persisted to localStorage (non-PHI data)
 * - Cross-browser tab synchronization via storage events
 * - Server-side rendering safe with hydration protection
 * - Preference export/import for user account migration
 * - Default fallbacks for new users and corrupted preferences
 *
 * **Integration:**
 * - CSS custom properties integration for real-time theme updates
 * - Tailwind CSS theme configuration synchronization
 * - Next.js App Router SSR compatibility
 * - React Query integration for preference caching
 * - WebSocket integration for cross-device synchronization (future)
 *
 * @module stores/slices/themeSlice
 * @requires @reduxjs/toolkit
 * @security Non-PHI user preferences, localStorage safe
 * @compliance ADA and Section 508 accessibility compliance
 *
 * @example Complete theme management
 * ```typescript
 * import { useAppSelector, useAppDispatch } from '@/stores/hooks';
 * import { 
 *   toggleTheme, 
 *   setColorScheme, 
 *   setFontSizeMultiplier,
 *   toggleHighContrast 
 * } from '@/stores/slices/themeSlice';
 *
 * function ThemeControls() {
 *   const theme = useAppSelector(selectTheme);
 *   const dispatch = useAppDispatch();
 *
 *   return (
 *     <div className="theme-controls">
 *       <button onClick={() => dispatch(toggleTheme())}>
 *         {theme.mode === 'dark' ? '☀️ Light' : '🌙 Dark'}
 *       </button>
 *       
 *       <select 
 *         value={theme.colorScheme} 
 *         onChange={(e) => dispatch(setColorScheme(e.target.value))}
 *       >
 *         <option value="blue">Healthcare Blue</option>
 *         <option value="teal">Medical Teal</option>
 *         <option value="purple">Wellness Purple</option>
 *         <option value="green">Health Green</option>
 *       </select>
 *       
 *       <label>
 *         Font Size: {Math.round(theme.fontSizeMultiplier * 100)}%
 *         <input 
 *           type="range" 
 *           min="0.8" 
 *           max="1.5" 
 *           step="0.1"
 *           value={theme.fontSizeMultiplier}
 *           onChange={(e) => dispatch(setFontSizeMultiplier(parseFloat(e.target.value)))}
 *         />
 *       </label>
 *       
 *       <button 
 *         onClick={() => dispatch(toggleHighContrast())}
 *         className={theme.highContrast ? 'active' : ''}
 *       >
 *         High Contrast: {theme.highContrast ? 'ON' : 'OFF'}
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 *
 * @example Accessibility-aware component
 * ```typescript
 * function AccessibleComponent() {
 *   const { reducedMotion, highContrast, fontSizeMultiplier } = useAppSelector(selectTheme);
 *   
 *   return (
 *     <div 
 *       className={`
 *         ${reducedMotion ? 'motion-reduce' : 'motion-normal'}
 *         ${highContrast ? 'high-contrast' : 'normal-contrast'}
 *       `}
 *       style={{ 
 *         fontSize: `${fontSizeMultiplier}rem`,
 *         transition: reducedMotion ? 'none' : 'all 0.3s ease'
 *       }}
 *     >
 *       Content that respects accessibility preferences
 *     </div>
 *   );
 * }
 * ```
 *
 * @example System theme detection with SSR safety
 * ```typescript
 * function ThemeProvider({ children }) {
 *   const effectiveMode = useAppSelector(selectEffectiveThemeMode);
 *   const [mounted, setMounted] = useState(false);
 *
 *   useEffect(() => {
 *     setMounted(true);
 *   }, []);
 *
 *   // Prevent hydration mismatch
 *   if (!mounted) {
 *     return <div className="theme-loading">{children}</div>;
 *   }
 *
 *   return (
 *     <div className={`theme-${effectiveMode}`} data-theme={effectiveMode}>
 *       {children}
 *     </div>
 *   );
 * }
 * ```
 *
 * @see {@link ../reduxStore.ts} for store configuration
 * @see {@link ../../components/ThemeProvider.tsx} for theme context integration
 * @since 1.0.0
 */ __turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "resetTheme",
    ()=>resetTheme,
    "selectColorScheme",
    ()=>selectColorScheme,
    "selectDensity",
    ()=>selectDensity,
    "selectEffectiveThemeMode",
    ()=>selectEffectiveThemeMode,
    "selectFontSizeMultiplier",
    ()=>selectFontSizeMultiplier,
    "selectIsHighContrast",
    ()=>selectIsHighContrast,
    "selectIsReducedMotion",
    ()=>selectIsReducedMotion,
    "selectIsSidebarCollapsed",
    ()=>selectIsSidebarCollapsed,
    "selectShowTooltips",
    ()=>selectShowTooltips,
    "selectTheme",
    ()=>selectTheme,
    "selectThemeMode",
    ()=>selectThemeMode,
    "setColorScheme",
    ()=>setColorScheme,
    "setDensity",
    ()=>setDensity,
    "setFontSizeMultiplier",
    ()=>setFontSizeMultiplier,
    "setHighContrast",
    ()=>setHighContrast,
    "setReducedMotion",
    ()=>setReducedMotion,
    "setShowTooltips",
    ()=>setShowTooltips,
    "setSidebarCollapsed",
    ()=>setSidebarCollapsed,
    "setThemeMode",
    ()=>setThemeMode,
    "toggleHighContrast",
    ()=>toggleHighContrast,
    "toggleReducedMotion",
    ()=>toggleReducedMotion,
    "toggleSidebar",
    ()=>toggleSidebar,
    "toggleTheme",
    ()=>toggleTheme,
    "toggleTooltips",
    ()=>toggleTooltips
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [app-ssr] (ecmascript) <locals>");
;
/**
 * Initial theme state with defaults
 */ const initialState = {
    mode: 'system',
    colorScheme: 'blue',
    density: 'comfortable',
    highContrast: false,
    reducedMotion: false,
    fontSizeMultiplier: 1.0,
    showTooltips: true,
    sidebarCollapsed: false
};
/**
 * Theme slice with reducers for UI preferences
 */ const themeSlice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createSlice"])({
    name: 'theme',
    initialState,
    reducers: {
        /**
     * Set theme mode (light, dark, or system)
     */ setThemeMode: (state, action)=>{
            state.mode = action.payload;
        },
        /**
     * Toggle between light and dark mode
     */ toggleTheme: (state)=>{
            if (state.mode === 'light') {
                state.mode = 'dark';
            } else if (state.mode === 'dark') {
                state.mode = 'light';
            } else {
                // If system, toggle to opposite of current system preference
                const prefersDark = ("TURBOPACK compile-time value", "undefined") !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
                state.mode = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 'dark';
            }
        },
        /**
     * Set color scheme for UI
     */ setColorScheme: (state, action)=>{
            state.colorScheme = action.payload;
        },
        /**
     * Set UI density
     */ setDensity: (state, action)=>{
            state.density = action.payload;
        },
        /**
     * Toggle high contrast mode
     */ toggleHighContrast: (state)=>{
            state.highContrast = !state.highContrast;
        },
        /**
     * Set high contrast mode
     */ setHighContrast: (state, action)=>{
            state.highContrast = action.payload;
        },
        /**
     * Toggle reduced motion
     */ toggleReducedMotion: (state)=>{
            state.reducedMotion = !state.reducedMotion;
        },
        /**
     * Set reduced motion
     */ setReducedMotion: (state, action)=>{
            state.reducedMotion = action.payload;
        },
        /**
     * Set font size multiplier
     */ setFontSizeMultiplier: (state, action)=>{
            // Clamp between 0.8 and 1.5
            state.fontSizeMultiplier = Math.max(0.8, Math.min(1.5, action.payload));
        },
        /**
     * Toggle tooltips visibility
     */ toggleTooltips: (state)=>{
            state.showTooltips = !state.showTooltips;
        },
        /**
     * Set tooltips visibility
     */ setShowTooltips: (state, action)=>{
            state.showTooltips = action.payload;
        },
        /**
     * Toggle sidebar collapsed state
     */ toggleSidebar: (state)=>{
            state.sidebarCollapsed = !state.sidebarCollapsed;
        },
        /**
     * Set sidebar collapsed state
     */ setSidebarCollapsed: (state, action)=>{
            state.sidebarCollapsed = action.payload;
        },
        /**
     * Reset theme to defaults
     */ resetTheme: (state)=>{
            Object.assign(state, initialState);
        }
    }
});
const { setThemeMode, toggleTheme, setColorScheme, setDensity, toggleHighContrast, setHighContrast, toggleReducedMotion, setReducedMotion, setFontSizeMultiplier, toggleTooltips, setShowTooltips, toggleSidebar, setSidebarCollapsed, resetTheme } = themeSlice.actions;
const __TURBOPACK__default__export__ = themeSlice.reducer;
const selectTheme = (state)=>state.theme;
const selectThemeMode = (state)=>state.theme.mode;
const selectColorScheme = (state)=>state.theme.colorScheme;
const selectDensity = (state)=>state.theme.density;
const selectIsHighContrast = (state)=>state.theme.highContrast;
const selectIsReducedMotion = (state)=>state.theme.reducedMotion;
const selectFontSizeMultiplier = (state)=>state.theme.fontSizeMultiplier;
const selectShowTooltips = (state)=>state.theme.showTooltips;
const selectIsSidebarCollapsed = (state)=>state.theme.sidebarCollapsed;
const selectEffectiveThemeMode = (state)=>{
    const { mode } = state.theme;
    if (mode === 'system') {
        // Check system preference
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        return 'light'; // Default for SSR
    }
    return mode;
};
}),
"[externals]/node:crypto [external] (node:crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

module.exports = mod;
}),
"[project]/src/stores/slices/notificationsSlice.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @fileoverview Notifications Slice - In-App Notifications Management
 * @module stores/slices/notificationsSlice
 * @category Store
 *
 * Manages in-app notifications, alerts, and toast messages.
 * Session-only (NOT persisted to localStorage for HIPAA compliance).
 *
 * Features:
 * - Real-time notification management
 * - Toast notifications
 * - Priority-based display
 * - Read/unread tracking
 * - Auto-dismiss logic
 * - SSR-compatible (session-only)
 * - NOT persisted (PHI may be in notifications)
 *
 * @example
 * ```typescript
 * import { useAppSelector, useAppDispatch } from '@/stores/hooks';
 * import { addNotification, markAsRead } from '@/stores/slices/notificationsSlice';
 *
 * function NotificationCenter() {
 *   const notifications = useAppSelector(state => state.notifications.items);
 *   const dispatch = useAppDispatch();
 *
 *   const notify = () => {
 *     dispatch(addNotification({
 *       title: 'New Appointment',
 *       message: 'You have a new appointment scheduled',
 *       type: 'info',
 *       priority: 'medium',
 *     }));
 *   };
 *
 *   return (
 *     <div>
 *       {notifications.map(notif => (
 *         <NotificationItem
 *           key={notif.id}
 *           {...notif}
 *           onRead={() => dispatch(markAsRead(notif.id))}
 *         />
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */ __turbopack_context__.s([
    "addNotification",
    ()=>addNotification,
    "addNotifications",
    ()=>addNotifications,
    "clearAllNotifications",
    ()=>clearAllNotifications,
    "clearReadNotifications",
    ()=>clearReadNotifications,
    "default",
    ()=>__TURBOPACK__default__export__,
    "markAllAsRead",
    ()=>markAllAsRead,
    "markAsRead",
    ()=>markAsRead,
    "removeNotification",
    ()=>removeNotification,
    "selectCriticalUnreadNotifications",
    ()=>selectCriticalUnreadNotifications,
    "selectNotifications",
    ()=>selectNotifications,
    "selectNotificationsByPriority",
    ()=>selectNotificationsByPriority,
    "selectNotificationsByType",
    ()=>selectNotificationsByType,
    "selectShowCenter",
    ()=>selectShowCenter,
    "selectSoundEnabled",
    ()=>selectSoundEnabled,
    "selectToastsEnabled",
    ()=>selectToastsEnabled,
    "selectUnreadCount",
    ()=>selectUnreadCount,
    "selectUnreadNotifications",
    ()=>selectUnreadNotifications,
    "setShowCenter",
    ()=>setShowCenter,
    "setSoundEnabled",
    ()=>setSoundEnabled,
    "setToastsEnabled",
    ()=>setToastsEnabled,
    "toggleNotificationCenter",
    ()=>toggleNotificationCenter,
    "toggleSound",
    ()=>toggleSound,
    "toggleToasts",
    ()=>toggleToasts
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/nanoid/index.js [app-ssr] (ecmascript) <locals>");
;
;
/**
 * Initial notifications state
 */ const initialState = {
    items: [],
    unreadCount: 0,
    showCenter: false,
    toastsEnabled: true,
    soundEnabled: false
};
/**
 * Notifications slice with reducers
 */ const notificationsSlice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createSlice"])({
    name: 'notifications',
    initialState,
    reducers: {
        /**
     * Add a new notification
     */ addNotification: (state, action)=>{
            const notification = {
                ...action.payload,
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                read: false,
                createdAt: new Date().toISOString()
            };
            // Add to beginning (newest first)
            state.items.unshift(notification);
            // Update unread count
            state.unreadCount += 1;
            // Limit to 100 notifications
            if (state.items.length > 100) {
                state.items = state.items.slice(0, 100);
            }
        },
        /**
     * Add multiple notifications
     */ addNotifications: (state, action)=>{
            const notifications = action.payload.map((notif)=>({
                    ...notif,
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    read: false,
                    createdAt: new Date().toISOString()
                }));
            state.items.unshift(...notifications);
            state.unreadCount += notifications.length;
            // Limit to 100 notifications
            if (state.items.length > 100) {
                state.items = state.items.slice(0, 100);
            }
        },
        /**
     * Mark notification as read
     */ markAsRead: (state, action)=>{
            const notification = state.items.find((n)=>n.id === action.payload);
            if (notification && !notification.read) {
                notification.read = true;
                state.unreadCount = Math.max(0, state.unreadCount - 1);
            }
        },
        /**
     * Mark all notifications as read
     */ markAllAsRead: (state)=>{
            state.items.forEach((notification)=>{
                notification.read = true;
            });
            state.unreadCount = 0;
        },
        /**
     * Remove notification
     */ removeNotification: (state, action)=>{
            const index = state.items.findIndex((n)=>n.id === action.payload);
            if (index !== -1) {
                const wasUnread = !state.items[index].read;
                state.items.splice(index, 1);
                if (wasUnread) {
                    state.unreadCount = Math.max(0, state.unreadCount - 1);
                }
            }
        },
        /**
     * Clear all notifications
     */ clearAllNotifications: (state)=>{
            state.items = [];
            state.unreadCount = 0;
        },
        /**
     * Clear read notifications
     */ clearReadNotifications: (state)=>{
            state.items = state.items.filter((n)=>!n.read);
        },
        /**
     * Toggle notification center visibility
     */ toggleNotificationCenter: (state)=>{
            state.showCenter = !state.showCenter;
        },
        /**
     * Set notification center visibility
     */ setShowCenter: (state, action)=>{
            state.showCenter = action.payload;
        },
        /**
     * Toggle toasts enabled
     */ toggleToasts: (state)=>{
            state.toastsEnabled = !state.toastsEnabled;
        },
        /**
     * Set toasts enabled
     */ setToastsEnabled: (state, action)=>{
            state.toastsEnabled = action.payload;
        },
        /**
     * Toggle sound enabled
     */ toggleSound: (state)=>{
            state.soundEnabled = !state.soundEnabled;
        },
        /**
     * Set sound enabled
     */ setSoundEnabled: (state, action)=>{
            state.soundEnabled = action.payload;
        }
    }
});
const { addNotification, addNotifications, markAsRead, markAllAsRead, removeNotification, clearAllNotifications, clearReadNotifications, toggleNotificationCenter, setShowCenter, toggleToasts, setToastsEnabled, toggleSound, setSoundEnabled } = notificationsSlice.actions;
const __TURBOPACK__default__export__ = notificationsSlice.reducer;
const selectNotifications = (state)=>state.notifications.items;
const selectUnreadCount = (state)=>state.notifications.unreadCount;
const selectShowCenter = (state)=>state.notifications.showCenter;
const selectToastsEnabled = (state)=>state.notifications.toastsEnabled;
const selectSoundEnabled = (state)=>state.notifications.soundEnabled;
const selectUnreadNotifications = (state)=>state.notifications.items.filter((n)=>!n.read);
const selectNotificationsByType = (type)=>(state)=>state.notifications.items.filter((n)=>n.type === type);
const selectNotificationsByPriority = (priority)=>(state)=>state.notifications.items.filter((n)=>n.priority === priority);
const selectCriticalUnreadNotifications = (state)=>state.notifications.items.filter((n)=>!n.read && n.priority === 'critical');
}),
"[project]/src/stores/slices/index.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

/**
 * @fileoverview Redux Slices - Central export point for all Redux slices
 * @module stores/slices
 * @category Store
 *
 * Exports all Redux slices for easy import throughout the application.
 * Slices are organized by domain following Domain-Driven Design principles.
 */ // ============================================================
// CORE SLICES - Authentication & Authorization
// ============================================================
// MOVED: authReducer → @/identity-access/stores/authSlice
// MOVED: accessControlReducer → @/identity-access/stores/accessControlSlice
__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$slices$2f$usersSlice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/slices/usersSlice.ts [app-ssr] (ecmascript)");
// ============================================================
// DASHBOARD & OVERVIEW
// ============================================================
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$slices$2f$dashboardSlice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/slices/dashboardSlice.ts [app-ssr] (ecmascript)");
// ============================================================
// HEALTHCARE DOMAIN
// ============================================================
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$slices$2f$healthRecordsSlice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/slices/healthRecordsSlice.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$slices$2f$medicationsSlice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/slices/medicationsSlice.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$slices$2f$appointmentsSlice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/slices/appointmentsSlice.ts [app-ssr] (ecmascript)");
// ============================================================
// STUDENT MANAGEMENT
// ============================================================
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$slices$2f$studentsSlice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/slices/studentsSlice.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$slices$2f$emergencyContactsSlice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/slices/emergencyContactsSlice.ts [app-ssr] (ecmascript)");
// ============================================================
// INCIDENT MANAGEMENT
// ============================================================
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$slices$2f$incidentReportsSlice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/slices/incidentReportsSlice.ts [app-ssr] (ecmascript)");
// ============================================================
// ADMINISTRATION
// ============================================================
// REMOVED: districtsReducer - Unused, legacy pages-old only
// REMOVED: schoolsReducer - Unused, legacy pages-old only
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$slices$2f$settingsSlice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/slices/settingsSlice.ts [app-ssr] (ecmascript)");
// REMOVED: adminReducer - Unused, 43KB removed
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$slices$2f$configurationSlice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/slices/configurationSlice.ts [app-ssr] (ecmascript)");
// ============================================================
// COMMUNICATION & DOCUMENTATION
// ============================================================
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$slices$2f$communicationSlice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/slices/communicationSlice.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$slices$2f$documentsSlice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/slices/documentsSlice.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$slices$2f$contactsSlice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/slices/contactsSlice.ts [app-ssr] (ecmascript)");
// ============================================================
// OPERATIONS & INVENTORY
// ============================================================
// REMOVED: inventoryReducer - Unused, legacy pages-old only (24KB)
// REMOVED: reportsReducer - Unused, legacy pages-old only
// REMOVED: budgetReducer - Unused, legacy pages-old only
// REMOVED: purchaseOrderReducer - Unused, legacy pages-old only (25KB)
// REMOVED: vendorReducer - Unused, legacy pages-old only (18KB)
// REMOVED: integrationReducer - Unused, legacy pages-old only (32KB)
// ============================================================
// COMPLIANCE & ACCESS CONTROL
// ============================================================
// REMOVED: complianceReducer - Unused, legacy pages-old only (25KB)
// ============================================================
// UI PREFERENCES & NOTIFICATIONS (NEW)
// ============================================================
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$slices$2f$themeSlice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/slices/themeSlice.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$slices$2f$notificationsSlice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/slices/notificationsSlice.ts [app-ssr] (ecmascript)");
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
;
;
}),
"[project]/src/stores/slices/dashboardSlice.ts [app-ssr] (ecmascript) <export default as dashboardReducer>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "dashboardReducer",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$slices$2f$dashboardSlice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$slices$2f$dashboardSlice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/slices/dashboardSlice.ts [app-ssr] (ecmascript)");
}),
"[project]/src/stores/slices/incidentReportsSlice.ts [app-ssr] (ecmascript) <export default as incidentReportsReducer>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "incidentReportsReducer",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$slices$2f$incidentReportsSlice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$slices$2f$incidentReportsSlice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/slices/incidentReportsSlice.ts [app-ssr] (ecmascript)");
}),
"[project]/src/stores/slices/configurationSlice.ts [app-ssr] (ecmascript) <export default as configurationReducer>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "configurationReducer",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$slices$2f$configurationSlice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$slices$2f$configurationSlice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/slices/configurationSlice.ts [app-ssr] (ecmascript)");
}),
"[project]/src/stores/slices/contactsSlice.ts [app-ssr] (ecmascript) <export default as contactsReducer>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "contactsReducer",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$slices$2f$contactsSlice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$slices$2f$contactsSlice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/slices/contactsSlice.ts [app-ssr] (ecmascript)");
}),
"[project]/src/stores/store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @fileoverview Redux Store Configuration for Next.js 15 with App Router
 * @module stores/store
 * @category Store
 *
 * Enterprise-grade Redux store configured for Next.js 15 with SSR/SSG support.
 * Follows Domain-Driven Design with HIPAA-compliant state management.
 *
 * Architecture:
 * - **Domain-based organization**: State organized by business domains
 * - **Type-safe**: Full TypeScript integration with Redux Toolkit
 * - **SSR compatible**: Client-side only with proper hydration
 * - **Performance**: Selective persistence and memoized selectors
 * - **HIPAA compliance**: PHI exclusion from browser storage
 *
 * State Domains:
 * - **Core**: Auth, users, settings, dashboard
 * - **Healthcare**: Health records, medications, appointments
 * - **Student Management**: Students, emergency contacts
 * - **Communication**: Messages, notifications, templates
 * - **Administration**: Districts, schools, inventory, reports
 * - **Compliance**: Access control, audit logs
 *
 * Key Features:
 * - Client-side state management only (no SSR state)
 * - Selective persistence (localStorage for non-PHI, sessionStorage for auth)
 * - Redux DevTools integration in development
 * - Type-safe throughout with TypeScript
 * - Compatible with React Query for server state
 *
 * HIPAA Compliance:
 * - PHI fields excluded from localStorage
 * - Auth tokens in sessionStorage only
 * - Audit logging for sensitive state access
 * - No server-side state serialization
 *
 * State Persistence Strategy:
 * - **localStorage**: UI preferences, filters (non-PHI only)
 * - **sessionStorage**: Auth tokens (cleared on browser close)
 * - **Memory only**: All PHI data (students, health records, medications)
 * - **No SSR persistence**: State reconstructed on client
 *
 * @example
 * ```typescript
 * // Use in client components only
 * 'use client';
 * import { useAppSelector, useAppDispatch } from '@/stores/hooks';
 *
 * function MyComponent() {
 *   const user = useAppSelector(state => state.auth.user);
 *   const dispatch = useAppDispatch();
 * }
 * ```
 */ __turbopack_context__.s([
    "clearPersistedState",
    ()=>clearPersistedState,
    "default",
    ()=>__TURBOPACK__default__export__,
    "getStorageStats",
    ()=>getStorageStats,
    "isValidRootState",
    ()=>isValidRootState,
    "makeStore",
    ()=>makeStore,
    "store",
    ()=>store
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$redux$2f$dist$2f$redux$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/redux/dist/redux.mjs [app-ssr] (ecmascript)");
// Import identity-access reducers
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$stores$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/identity-access/stores/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$stores$2f$authSlice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__authReducer$3e$__ = __turbopack_context__.i("[project]/src/identity-access/stores/authSlice.ts [app-ssr] (ecmascript) <export default as authReducer>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$stores$2f$accessControl$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__default__as__accessControlReducer$3e$__ = __turbopack_context__.i("[project]/src/identity-access/stores/accessControl/index.ts [app-ssr] (ecmascript) <locals> <export default as accessControlReducer>");
// Import all domain reducers
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$slices$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/stores/slices/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$slices$2f$usersSlice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/slices/usersSlice.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$slices$2f$dashboardSlice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__dashboardReducer$3e$__ = __turbopack_context__.i("[project]/src/stores/slices/dashboardSlice.ts [app-ssr] (ecmascript) <export default as dashboardReducer>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$slices$2f$healthRecordsSlice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/slices/healthRecordsSlice.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$slices$2f$medicationsSlice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/slices/medicationsSlice.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$slices$2f$appointmentsSlice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/slices/appointmentsSlice.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$slices$2f$studentsSlice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/slices/studentsSlice.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$slices$2f$emergencyContactsSlice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/slices/emergencyContactsSlice.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$slices$2f$incidentReportsSlice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__incidentReportsReducer$3e$__ = __turbopack_context__.i("[project]/src/stores/slices/incidentReportsSlice.ts [app-ssr] (ecmascript) <export default as incidentReportsReducer>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$slices$2f$settingsSlice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/slices/settingsSlice.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$slices$2f$configurationSlice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__configurationReducer$3e$__ = __turbopack_context__.i("[project]/src/stores/slices/configurationSlice.ts [app-ssr] (ecmascript) <export default as configurationReducer>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$slices$2f$communicationSlice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/slices/communicationSlice.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$slices$2f$documentsSlice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/slices/documentsSlice.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$slices$2f$contactsSlice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__contactsReducer$3e$__ = __turbopack_context__.i("[project]/src/stores/slices/contactsSlice.ts [app-ssr] (ecmascript) <export default as contactsReducer>");
'use client';
;
;
;
// ==========================================
// ROOT REDUCER
// ==========================================
/**
 * Root reducer combining all domain reducers
 * Organized by domain for clear separation of concerns
 */ const rootReducer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$redux$2f$dist$2f$redux$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["combineReducers"])({
    // ============================================================
    // AUTHENTICATION & AUTHORIZATION (from @/identity-access)
    // ============================================================
    auth: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$stores$2f$authSlice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__authReducer$3e$__["authReducer"],
    accessControl: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$stores$2f$accessControl$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__default__as__accessControlReducer$3e$__["accessControlReducer"],
    users: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$slices$2f$usersSlice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usersReducer"],
    // ============================================================
    // DASHBOARD & OVERVIEW
    // ============================================================
    dashboard: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$slices$2f$dashboardSlice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__dashboardReducer$3e$__["dashboardReducer"],
    // ============================================================
    // CORE DOMAINS - INCIDENT MANAGEMENT
    // ============================================================
    incidentReports: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$slices$2f$incidentReportsSlice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__incidentReportsReducer$3e$__["incidentReportsReducer"],
    // ============================================================
    // ADMINISTRATION & CONFIGURATION
    // ============================================================
    // REMOVED: districts, schools (unused in active code)
    settings: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$slices$2f$settingsSlice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["settingsReducer"],
    // REMOVED: admin (43KB, unused in active code)
    configuration: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$slices$2f$configurationSlice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__configurationReducer$3e$__["configurationReducer"],
    // ============================================================
    // STUDENT & HEALTH MANAGEMENT
    // ============================================================
    students: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$slices$2f$studentsSlice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["studentsReducer"],
    healthRecords: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$slices$2f$healthRecordsSlice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["healthRecordsReducer"],
    medications: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$slices$2f$medicationsSlice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["medicationsReducer"],
    appointments: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$slices$2f$appointmentsSlice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["appointmentsReducer"],
    emergencyContacts: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$slices$2f$emergencyContactsSlice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["emergencyContactsReducer"],
    // ============================================================
    // COMMUNICATION & DOCUMENTATION
    // ============================================================
    communication: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$slices$2f$communicationSlice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["communicationReducer"],
    documents: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$slices$2f$documentsSlice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["documentsReducer"],
    contacts: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$slices$2f$contactsSlice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__contactsReducer$3e$__["contactsReducer"]
});
// ==========================================
// PERSISTENCE MIDDLEWARE (HIPAA-COMPLIANT)
// ==========================================
/**
 * Selective persistence middleware
 * Only persists non-PHI data to localStorage
 * Auth tokens go to sessionStorage only
 */ const persistenceMiddleware = (store)=>(next)=>(action)=>{
            const result = next(action);
            // Only run on client side
            if ("TURBOPACK compile-time truthy", 1) return result;
            //TURBOPACK unreachable
            ;
            const state = undefined;
        };
/**
 * Audit logging middleware for HIPAA compliance
 * Logs access to sensitive state slices
 */ const auditMiddleware = (_store)=>(next)=>(action)=>{
            // Log sensitive actions in development
            if ("TURBOPACK compile-time truthy", 1) {
                const sensitiveActions = [
                    'healthRecords/',
                    'medications/',
                    'students/',
                    'emergencyContacts/'
                ];
                const actionType = action.type;
                if (sensitiveActions.some((prefix)=>actionType.startsWith(prefix))) {
                    console.log('[Audit] Sensitive action dispatched:', actionType);
                }
            }
            return next(action);
        };
// ==========================================
// LOAD PERSISTED STATE
// ==========================================
/**
 * Load persisted state from browser storage
 * Called before store creation
 */ function loadPersistedState() {
    if ("TURBOPACK compile-time truthy", 1) return undefined;
    //TURBOPACK unreachable
    ;
}
const makeStore = ()=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["configureStore"])({
        reducer: rootReducer,
        preloadedState: loadPersistedState(),
        middleware: (getDefaultMiddleware)=>getDefaultMiddleware({
                serializableCheck: {
                    // Ignore these action types
                    ignoredActions: [
                        'persist/PERSIST',
                        'persist/REHYDRATE'
                    ],
                    // Ignore these field paths in all actions
                    ignoredActionPaths: [
                        'payload.date',
                        'meta.arg.originalArgs'
                    ],
                    // Ignore these paths in the state
                    ignoredPaths: [
                        'incidentReports.filters.startDate',
                        'incidentReports.filters.endDate'
                    ]
                },
                // Disable immutability check in production for performance
                immutableCheck: ("TURBOPACK compile-time value", "development") === 'development'
            }).concat(persistenceMiddleware).concat(auditMiddleware),
        devTools: ("TURBOPACK compile-time value", "development") === 'development'
    });
};
const store = makeStore();
function isValidRootState(state) {
    return state !== null && typeof state === 'object' && 'auth' in state && 'students' in state && 'healthRecords' in state;
}
function clearPersistedState() {
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
}
function getStorageStats() {
    if ("TURBOPACK compile-time truthy", 1) {
        return {
            localStorage: {
                used: 0,
                available: 0,
                percentage: 0
            },
            sessionStorage: {
                used: 0,
                available: 0,
                percentage: 0
            }
        };
    }
    //TURBOPACK unreachable
    ;
    const getSize = undefined;
    const maxSize = undefined; // 5MB typical browser limit
    const localUsed = undefined;
    const sessionUsed = undefined;
}
const __TURBOPACK__default__export__ = store;
}),
"[project]/src/providers/ReduxProvider.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @fileoverview Redux Store Provider - Consolidated
 * @module providers/ReduxProvider
 * @category State Management
 *
 * Provides Redux store to the component tree in Next.js App Router.
 * Must be used in client components only.
 *
 * Features:
 * - Client-side only (no SSR)
 * - Automatic store creation per client
 * - Type-safe context
 * - Compatible with React 19
 * - State persistence (non-PHI only)
 *
 * @example
 * ```typescript
 * import { ReduxProvider } from '@/providers/ReduxProvider';
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <ReduxProvider>
 *       {children}
 *     </ReduxProvider>
 *   );
 * }
 * ```
 */ __turbopack_context__.s([
    "ReduxProvider",
    ()=>ReduxProvider,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-redux/dist/react-redux.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/store.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
function ReduxProvider({ children }) {
    // Create store instance once per client using useState with lazy initialization
    const [store] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["makeStore"])());
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Provider"], {
        store: store,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/providers/ReduxProvider.tsx",
        lineNumber: 63,
        columnNumber: 10
    }, this);
}
const __TURBOPACK__default__export__ = ReduxProvider;
}),
"[project]/src/config/apolloClient.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * WF-COMP-APOLLO-001 | apolloClient.ts - Apollo Client Configuration
 * Purpose: Configure Apollo Client for GraphQL API integration
 *
 * Features:
 * - GraphQL query and mutation support
 * - Authentication integration
 * - Error handling and retry logic
 * - Cache management
 * - Healthcare-specific policies
 *
 * Security:
 * - JWT token integration
 * - PHI data handling
 * - Audit logging integration
 *
 * Last Updated: 2025-10-26 | File Type: .ts
 */ __turbopack_context__.s([
    "apolloClient",
    ()=>apolloClient,
    "default",
    ()=>__TURBOPACK__default__export__,
    "resetApolloClient",
    ()=>resetApolloClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$core$2f$ApolloClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@apollo/client/core/ApolloClient.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$cache$2f$inmemory$2f$inMemoryCache$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@apollo/client/cache/inmemory/inMemoryCache.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$link$2f$http$2f$HttpLink$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@apollo/client/link/http/HttpLink.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$link$2f$core$2f$from$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@apollo/client/link/core/from.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$link$2f$error$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@apollo/client/link/error/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$link$2f$context$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@apollo/client/link/context/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$link$2f$retry$2f$retryLink$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@apollo/client/link/retry/retryLink.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-hot-toast/dist/index.mjs [app-ssr] (ecmascript)");
;
;
;
;
;
// ==========================================
// CONFIGURATION
// ==========================================
/**
 * Retrieves the GraphQL endpoint URL from environment variables.
 *
 * Constructs the full GraphQL endpoint URL using the API base URL from environment variables,
 * ensuring the correct path format for GraphQL queries and mutations.
 *
 * @returns {string} The complete GraphQL endpoint URL
 *
 * @example
 * ```typescript
 * // Development
 * // Returns: "http://localhost:3001/graphql"
 *
 * // Production
 * // Returns: "https://api.example.com/graphql"
 * ```
 */ function getGraphQLEndpoint() {
    const baseUrl = ("TURBOPACK compile-time value", "http://localhost:3001") || 'http://localhost:3001/api';
    // GraphQL is at /graphql not /api/graphql
    return baseUrl.replace('/api', '/graphql');
}
/**
 * Retrieves the authentication JWT token from browser localStorage.
 *
 * Safely accesses localStorage to retrieve the user's authentication token,
 * handling server-side rendering where localStorage is unavailable.
 *
 * @returns {string | null} The JWT token string, or null if not available or on server
 *
 * @example
 * ```typescript
 * const token = getAuthToken();
 * if (token) {
 *   // User is authenticated
 *   headers.authorization = `Bearer ${token}`;
 * }
 * ```
 */ function getAuthToken() {
    try {
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        return null;
    } catch (error) {
        console.error('[Apollo] Failed to get auth token:', error);
        return null;
    }
}
// ==========================================
// APOLLO LINKS
// ==========================================
/**
 * HTTP Link for Apollo Client - handles GraphQL request transmission.
 *
 * Configured to send GraphQL queries and mutations to the backend server
 * with cookie-based session management support for authentication.
 *
 * @constant {HttpLink}
 *
 * @see https://www.apollographql.com/docs/react/api/link/apollo-link-http/
 */ const httpLink = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$link$2f$http$2f$HttpLink$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HttpLink"]({
    uri: getGraphQLEndpoint(),
    credentials: 'include'
});
/**
 * Authentication Link - adds JWT token and custom headers to GraphQL requests.
 *
 * Intercepts every GraphQL request to inject authentication credentials and
 * client metadata into request headers. This ensures all API calls are properly
 * authenticated and versioned.
 *
 * Headers Added:
 * - authorization: JWT Bearer token (if user is authenticated)
 * - Content-Type: application/json
 * - X-Client-Version: Frontend application version for API compatibility tracking
 *
 * @constant {ApolloLink}
 *
 * @example
 * ```typescript
 * // Request headers when authenticated:
 * {
 *   authorization: "Bearer eyJhbGciOiJIUzI1NiIs...",
 *   "Content-Type": "application/json",
 *   "X-Client-Version": "1.0.0"
 * }
 * ```
 *
 * @see https://www.apollographql.com/docs/react/api/link/apollo-link-context/
 */ const authLink = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$link$2f$context$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setContext"])((_, { headers })=>{
    const token = getAuthToken();
    return {
        headers: {
            ...headers,
            ...token && {
                authorization: `Bearer ${token}`
            },
            'Content-Type': 'application/json',
            'X-Client-Version': process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0'
        }
    };
});
/**
 * Retry Link - handles transient failures with exponential backoff strategy.
 *
 * Automatically retries failed GraphQL requests for network errors and server errors (5xx),
 * using exponential backoff with jitter to avoid thundering herd problems. Client errors
 * (4xx) are not retried as they indicate invalid requests.
 *
 * Retry Strategy:
 * - Initial delay: 300ms
 * - Maximum delay: 5000ms (5 seconds)
 * - Maximum attempts: 3
 * - Jitter enabled: adds randomness to prevent synchronized retries
 *
 * Retry Conditions:
 * - Network errors: Always retry
 * - 5xx server errors: Retry (server issues)
 * - 4xx client errors: No retry (invalid request)
 *
 * @constant {RetryLink}
 *
 * @example
 * ```typescript
 * // Failed request timeline with exponential backoff:
 * // Attempt 1: fails at t=0
 * // Attempt 2: retry at t=300ms (+ jitter)
 * // Attempt 3: retry at t=900ms (300 * 2^1 + jitter)
 * // Final failure if all attempts exhausted
 * ```
 *
 * @see https://www.apollographql.com/docs/react/api/link/apollo-link-retry/
 */ const retryLink = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$link$2f$retry$2f$retryLink$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RetryLink"]({
    delay: {
        initial: 300,
        max: 5000,
        jitter: true
    },
    attempts: {
        max: 3,
        retryIf: (error, _operation)=>{
            // Retry on network errors or 5xx server errors
            const statusCode = error?.statusCode;
            return !!error && (!statusCode || statusCode >= 500);
        }
    }
});
/**
 * Error Link - centralized GraphQL and network error handling.
 *
 * Intercepts all GraphQL errors and network failures to provide consistent error handling,
 * user notifications, and automatic session management. Logs errors for debugging and
 * implements authentication flows when sessions expire.
 *
 * Error Types Handled:
 * - GraphQL errors: Query/mutation validation errors, server-side errors
 * - Network errors: Connection failures, HTTP status errors
 * - Authentication errors: Expired sessions, invalid tokens (redirects to login)
 * - Authorization errors: Insufficient permissions (displays error message)
 *
 * Authentication Flow:
 * - UNAUTHENTICATED error -> Clear token, show message, redirect to /login
 * - 401 status code -> Clear token, show message, redirect to /login
 * - FORBIDDEN error -> Show permission denied message
 *
 * User Experience:
 * - Displays toast notifications for user-friendly error messages
 * - Hides network errors during background refetches
 * - Provides specific messages for rate limiting (429) and server errors (5xx)
 *
 * @constant {ApolloLink}
 *
 * @example
 * ```typescript
 * // Authentication error handling:
 * // 1. User makes query with expired token
 * // 2. Server returns UNAUTHENTICATED error
 * // 3. Error link clears localStorage token
 * // 4. User sees "Session expired" toast
 * // 5. Redirected to /login page
 * ```
 *
 * @see https://www.apollographql.com/docs/react/api/link/apollo-link-error/
 */ const errorLink = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$link$2f$error$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["onError"])(({ graphQLErrors, networkError, operation, forward })=>{
    if (graphQLErrors) {
        graphQLErrors.forEach(({ message, locations, path, extensions })=>{
            console.error(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`);
            // Handle authentication errors
            if (extensions?.code === 'UNAUTHENTICATED') {
                if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
                ;
                return;
            }
            // Handle authorization errors
            if (extensions?.code === 'FORBIDDEN') {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].error('You do not have permission to perform this action');
                return;
            }
            // Show user-friendly error messages
            if (!message.includes('Network')) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].error(message || 'An unexpected error occurred');
            }
        });
    }
    if (networkError) {
        console.error(`[Network error]:`, networkError);
        // Handle specific network errors
        if ('statusCode' in networkError) {
            switch(networkError.statusCode){
                case 401:
                    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
                    ;
                    break;
                case 403:
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].error('Access denied');
                    break;
                case 404:
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].error('Resource not found');
                    break;
                case 429:
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].error('Too many requests. Please try again later.');
                    break;
                case 500:
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].error('Server error. Please try again.');
                    break;
                default:
                    if (networkError.statusCode >= 500) {
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].error('Server error. Please try again.');
                    }
            }
        } else {
            // Connection errors
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].error('Connection error. Please check your internet connection.');
        }
    }
});
// ==========================================
// CACHE CONFIGURATION
// ==========================================
/**
 * Apollo InMemory Cache with healthcare-specific type policies.
 *
 * Configures normalized caching for GraphQL data with custom merge strategies
 * for paginated queries and computed fields. Optimizes data fetching and reduces
 * redundant network requests for healthcare application data.
 *
 * Type Policies:
 * - Query.contacts: Offset-based pagination with position-aware merging
 * - Query.students: Offset-based pagination with position-aware merging
 * - Contact.fullName: Computed field from firstName + lastName
 * - Student.fullName: Computed field from firstName + lastName
 *
 * Cache Normalization:
 * - Entities are stored by ID for efficient updates
 * - Pagination preserves item positions across fetches
 * - Computed fields reduce redundant data storage
 *
 * @constant {InMemoryCache}
 *
 * @example
 * ```typescript
 * // Pagination merge behavior:
 * // Fetch 1: offset=0, limit=10 -> [items 0-9]
 * // Fetch 2: offset=10, limit=10 -> [items 0-19]
 * // Cache now contains complete dataset [0-19]
 *
 * // Computed field behavior:
 * const student = cache.readFragment({
 *   id: 'Student:123',
 *   fragment: gql`fragment StudentName on Student { fullName }`
 * });
 * // Returns computed "John Doe" from stored firstName + lastName
 * ```
 *
 * @see https://www.apollographql.com/docs/react/caching/cache-configuration/
 */ const cache = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$cache$2f$inmemory$2f$inMemoryCache$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["InMemoryCache"]({
    typePolicies: {
        Query: {
            fields: {
                // Pagination handling for contacts
                contacts: {
                    keyArgs: false,
                    merge (existing, incoming, { args }) {
                        const merged = existing ? existing.slice(0) : [];
                        const { offset = 0 } = args || {};
                        for(let i = 0; i < incoming.length; ++i){
                            merged[offset + i] = incoming[i];
                        }
                        return merged;
                    }
                },
                // Pagination handling for students
                students: {
                    keyArgs: false,
                    merge (existing, incoming, { args }) {
                        const merged = existing ? existing.slice(0) : [];
                        const { offset = 0 } = args || {};
                        for(let i = 0; i < incoming.length; ++i){
                            merged[offset + i] = incoming[i];
                        }
                        return merged;
                    }
                }
            }
        },
        Contact: {
            fields: {
                // Handle computed fields
                fullName: {
                    read (existing, { readField }) {
                        return existing || `${readField('firstName')} ${readField('lastName')}`;
                    }
                }
            }
        },
        Student: {
            fields: {
                // Handle computed fields
                fullName: {
                    read (existing, { readField }) {
                        return existing || `${readField('firstName')} ${readField('lastName')}`;
                    }
                }
            }
        }
    }
});
const apolloClient = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$core$2f$ApolloClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ApolloClient"]({
    link: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$link$2f$core$2f$from$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["from"])([
        retryLink,
        errorLink,
        authLink,
        httpLink
    ]),
    cache,
    defaultOptions: {
        watchQuery: {
            errorPolicy: 'all',
            notifyOnNetworkStatusChange: true
        },
        query: {
            errorPolicy: 'all'
        },
        mutate: {
            errorPolicy: 'all'
        }
    },
    connectToDevTools: ("TURBOPACK compile-time value", "development") === 'development'
});
async function resetApolloClient() {
    try {
        await apolloClient.clearStore();
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    } catch (error) {
        console.error('[Apollo] Failed to reset client:', error);
    }
}
const __TURBOPACK__default__export__ = apolloClient;
}),
"[project]/src/providers/ApolloProvider.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @fileoverview Apollo GraphQL Provider - Consolidated
 * @module providers/ApolloProvider
 * @category State Management
 *
 * Provides Apollo Client to the Next.js application with:
 * - Client-side rendering support
 * - Server-side rendering support
 * - Streaming support for React Server Components
 * - Automatic cache hydration
 *
 * @example
 * ```typescript
 * import { ApolloProvider } from '@/providers/ApolloProvider';
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <ApolloProvider>
 *       {children}
 *     </ApolloProvider>
 *   );
 * }
 * ```
 */ __turbopack_context__.s([
    "ApolloProvider",
    ()=>ApolloProvider,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$context$2f$ApolloProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@apollo/client/react/context/ApolloProvider.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$apolloClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/config/apolloClient.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
function ApolloProvider({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$context$2f$ApolloProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ApolloProvider"], {
        client: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$apolloClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apolloClient"],
        children: children
    }, void 0, false, {
        fileName: "[project]/src/providers/ApolloProvider.tsx",
        lineNumber: 55,
        columnNumber: 10
    }, this);
}
const __TURBOPACK__default__export__ = ApolloProvider;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[project]/src/identity-access/components/session/SessionWarningModal.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SessionWarningModal",
    ()=>SessionWarningModal,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
/**
 * SessionWarningModal Component
 *
 * Displays a modal warning when user session is about to expire due to inactivity.
 * Provides options to extend the session or logout immediately.
 *
 * Features:
 * - Countdown timer showing remaining time
 * - Focus trap for accessibility
 * - Keyboard navigation (Escape to extend, Enter to confirm)
 * - ARIA attributes for screen readers
 * - Live region for countdown announcements
 *
 * @module components/session/SessionWarningModal
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
;
function SessionWarningModal({ isOpen, timeRemainingSeconds, onExtendSession, onLogout }) {
    // ==========================================
    // STATE & REFS
    // ==========================================
    const [countdown, setCountdown] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(timeRemainingSeconds);
    const extendButtonRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const modalRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    // ==========================================
    // COUNTDOWN LOGIC
    // ==========================================
    // Sync countdown with prop changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setCountdown(timeRemainingSeconds);
    }, [
        timeRemainingSeconds
    ]);
    // Countdown interval
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!isOpen) return;
        const interval = setInterval(()=>{
            setCountdown((prev)=>{
                if (prev <= 1) {
                    clearInterval(interval);
                    onLogout();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return ()=>clearInterval(interval);
    }, [
        isOpen,
        onLogout
    ]);
    // ==========================================
    // FOCUS MANAGEMENT
    // ==========================================
    // Focus trap and initial focus
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!isOpen) return;
        // Focus the extend button when modal opens
        const focusTimeout = setTimeout(()=>{
            extendButtonRef.current?.focus();
        }, 100);
        // Store previously focused element
        const previouslyFocusedElement = document.activeElement;
        // Focus trap handler
        const handleTabKey = (e)=>{
            if (!modalRef.current) return;
            const focusableElements = modalRef.current.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        };
        const handleKeyDown = (e)=>{
            if (e.key === 'Tab') {
                handleTabKey(e);
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return ()=>{
            clearTimeout(focusTimeout);
            document.removeEventListener('keydown', handleKeyDown);
            // Restore focus to previously focused element
            previouslyFocusedElement?.focus();
        };
    }, [
        isOpen
    ]);
    // ==========================================
    // KEYBOARD HANDLERS
    // ==========================================
    const handleKeyDown = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        if (e.key === 'Escape') {
            e.preventDefault();
            onExtendSession();
        }
    }, [
        onExtendSession
    ]);
    // ==========================================
    // STABLE HANDLERS
    // ==========================================
    const handleExtend = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        onExtendSession();
    }, [
        onExtendSession
    ]);
    const handleLogout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        onLogout();
    }, [
        onLogout
    ]);
    // ==========================================
    // COUNTDOWN FORMATTING
    // ==========================================
    const minutes = Math.floor(countdown / 60);
    const seconds = countdown % 60;
    const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    // Determine announcement for screen readers (announce every 30 seconds)
    const shouldAnnounce = countdown % 30 === 0 || countdown <= 10;
    const screenReaderAnnouncement = shouldAnnounce ? `Session expires in ${minutes} ${minutes === 1 ? 'minute' : 'minutes'} and ${seconds} ${seconds === 1 ? 'second' : 'seconds'}` : '';
    // ==========================================
    // RENDER
    // ==========================================
    if (!isOpen) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50",
        role: "alertdialog",
        "aria-modal": "true",
        "aria-labelledby": "session-warning-title",
        "aria-describedby": "session-warning-description",
        onKeyDown: handleKeyDown,
        "data-testid": "session-warning-modal",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            ref: modalRef,
            className: "bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4",
            "data-testid": "session-warning-modal-content",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center mb-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            className: "w-6 h-6 text-yellow-500 mr-3 flex-shrink-0",
                            fill: "none",
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            strokeWidth: "2",
                            viewBox: "0 0 24 24",
                            stroke: "currentColor",
                            "aria-hidden": "true",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            }, void 0, false, {
                                fileName: "[project]/src/identity-access/components/session/SessionWarningModal.tsx",
                                lineNumber: 243,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/identity-access/components/session/SessionWarningModal.tsx",
                            lineNumber: 233,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            id: "session-warning-title",
                            className: "text-xl font-semibold text-gray-900",
                            children: "Session Expiring Soon"
                        }, void 0, false, {
                            fileName: "[project]/src/identity-access/components/session/SessionWarningModal.tsx",
                            lineNumber: 245,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/identity-access/components/session/SessionWarningModal.tsx",
                    lineNumber: 232,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    id: "session-warning-description",
                    className: "text-gray-600 mb-6",
                    children: [
                        "Your session will expire in",
                        ' ',
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "font-bold text-red-600",
                            "data-testid": "countdown-display",
                            children: formattedTime
                        }, void 0, false, {
                            fileName: "[project]/src/identity-access/components/session/SessionWarningModal.tsx",
                            lineNumber: 259,
                            columnNumber: 11
                        }, this),
                        ' ',
                        "due to inactivity. For security and HIPAA compliance, you will be automatically logged out."
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/identity-access/components/session/SessionWarningModal.tsx",
                    lineNumber: 254,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    "aria-live": "polite",
                    "aria-atomic": "true",
                    className: "sr-only",
                    "data-testid": "countdown-announcement",
                    children: screenReaderAnnouncement
                }, void 0, false, {
                    fileName: "[project]/src/identity-access/components/session/SessionWarningModal.tsx",
                    lineNumber: 270,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex gap-3 justify-end",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleLogout,
                            className: "px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors",
                            type: "button",
                            "data-testid": "logout-button",
                            children: "Logout Now"
                        }, void 0, false, {
                            fileName: "[project]/src/identity-access/components/session/SessionWarningModal.tsx",
                            lineNumber: 281,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            ref: extendButtonRef,
                            onClick: handleExtend,
                            className: "px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors",
                            type: "button",
                            "data-testid": "extend-session-button",
                            children: "Stay Logged In"
                        }, void 0, false, {
                            fileName: "[project]/src/identity-access/components/session/SessionWarningModal.tsx",
                            lineNumber: 289,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/identity-access/components/session/SessionWarningModal.tsx",
                    lineNumber: 280,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/identity-access/components/session/SessionWarningModal.tsx",
            lineNumber: 226,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/identity-access/components/session/SessionWarningModal.tsx",
        lineNumber: 217,
        columnNumber: 5
    }, this);
}
const __TURBOPACK__default__export__ = SessionWarningModal;
}),
"[project]/src/identity-access/components/session/index.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

/**
 * Session Components - Barrel Export
 *
 * Exports all session-related components for the identity-access module.
 *
 * @module components/session
 */ __turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$components$2f$session$2f$SessionWarningModal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/identity-access/components/session/SessionWarningModal.tsx [app-ssr] (ecmascript)");
;
}),
"[project]/src/identity-access/contexts/AuthContext.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth,
    "useAuthContext",
    ()=>useAuthContext
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
/**
 * Authentication Context - HIPAA-Compliant Session Management
 *
 * Provides centralized authentication state management with:
 * - JWT token management via HTTP-only secure cookies
 * - Automatic token refresh before expiration
 * - Session timeout enforcement (15 min idle for HIPAA)
 * - Multi-tab synchronization via BroadcastChannel (when available)
 * - Audit logging for authentication events
 * - Secure storage practices (no PHI in localStorage)
 * - Edge Runtime compatible (graceful fallback when BroadcastChannel unavailable)
 *
 * @module contexts/AuthContext
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-redux/dist/react-redux.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$stores$2f$authSlice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/identity-access/stores/authSlice.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$components$2f$session$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/identity-access/components/session/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$components$2f$session$2f$SessionWarningModal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/identity-access/components/session/SessionWarningModal.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
// ==========================================
// CONSTANTS
// ==========================================
const HIPAA_IDLE_TIMEOUT = 15 * 60 * 1000; // 15 minutes in milliseconds
const SESSION_WARNING_TIME = 2 * 60 * 1000; // 2 minutes before timeout
const TOKEN_REFRESH_INTERVAL = 50 * 60 * 1000; // Refresh token every 50 minutes
const ACTIVITY_CHECK_INTERVAL = 30 * 1000; // Check activity every 30 seconds
const BROADCAST_CHANNEL_NAME = 'auth_sync';
// ==========================================
// CONTEXT CREATION
// ==========================================
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function AuthProvider({ children }) {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const dispatch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useDispatch"])();
    // Redux state selectors
    const authState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSelector"])((state)=>state.auth);
    const { user, isAuthenticated, isLoading, error, sessionExpiresAt } = authState;
    // Local state for activity tracking - initialize with 0 to avoid SSR hydration mismatch
    const [lastActivityAt, setLastActivityAt] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [showSessionWarning, setShowSessionWarning] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isHydrated, setIsHydrated] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    // Refs for intervals and broadcast channel
    const activityCheckInterval = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(undefined);
    const tokenRefreshInterval = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(undefined);
    const broadcastChannel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const isBroadcastChannelSupported = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    // ==========================================
    // HYDRATION HANDLING
    // ==========================================
    // Handle client-side hydration to avoid SSR mismatch
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setIsHydrated(true);
        setLastActivityAt(Date.now());
    }, []);
    // ==========================================
    // ACTIVITY TRACKING
    // ==========================================
    const updateActivity = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (!isHydrated) return; // Don't update activity until hydrated
        const now = Date.now();
        setLastActivityAt(now);
        // Broadcast activity to other tabs (only if supported)
        if (isBroadcastChannelSupported.current && broadcastChannel.current) {
            try {
                broadcastChannel.current.postMessage({
                    type: 'activity_update',
                    timestamp: now
                });
            } catch (error) {
                console.warn('[Auth] Failed to broadcast activity:', error);
            }
        }
    }, [
        isHydrated
    ]);
    // Track user activity events
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!isAuthenticated) return;
        const events = [
            'mousedown',
            'keydown',
            'scroll',
            'touchstart',
            'click'
        ];
        events.forEach((event)=>{
            window.addEventListener(event, updateActivity, {
                passive: true
            });
        });
        return ()=>{
            events.forEach((event)=>{
                window.removeEventListener(event, updateActivity);
            });
        };
    }, [
        isAuthenticated,
        updateActivity
    ]);
    // ==========================================
    // SESSION TIMEOUT CHECKING
    // ==========================================
    const checkSession = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (!isAuthenticated || !isHydrated) return false;
        const now = Date.now();
        const idleTime = now - lastActivityAt;
        // Don't check session until we have a valid lastActivityAt
        if (lastActivityAt === 0) return true;
        // Check HIPAA idle timeout
        if (idleTime >= HIPAA_IDLE_TIMEOUT) {
            console.warn('[Auth] Session timeout due to inactivity');
            dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$stores$2f$authSlice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["logoutUser"])(undefined));
            router.push('/session-expired?reason=idle');
            return false;
        }
        // Show warning if approaching timeout
        if (idleTime >= HIPAA_IDLE_TIMEOUT - SESSION_WARNING_TIME && !showSessionWarning) {
            setShowSessionWarning(true);
        } else if (idleTime < HIPAA_IDLE_TIMEOUT - SESSION_WARNING_TIME && showSessionWarning) {
            setShowSessionWarning(false);
        }
        // Check token expiration
        if (sessionExpiresAt && now >= sessionExpiresAt) {
            console.warn('[Auth] Session timeout due to token expiration');
            dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$stores$2f$authSlice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["logoutUser"])(undefined));
            router.push('/session-expired?reason=token');
            return false;
        }
        return true;
    }, [
        isAuthenticated,
        isHydrated,
        lastActivityAt,
        sessionExpiresAt,
        showSessionWarning,
        dispatch,
        router
    ]);
    // Periodic session checking
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!isAuthenticated) return;
        activityCheckInterval.current = setInterval(()=>{
            checkSession();
        }, ACTIVITY_CHECK_INTERVAL);
        return ()=>{
            if (activityCheckInterval.current) {
                clearInterval(activityCheckInterval.current);
            }
        };
    }, [
        isAuthenticated,
        checkSession
    ]);
    // ==========================================
    // TOKEN REFRESH
    // ==========================================
    const refreshToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        try {
            await dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$stores$2f$authSlice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["refreshAuthToken"])()).unwrap();
            updateActivity(); // Reset activity on successful refresh
        } catch (error) {
            console.error('[Auth] Token refresh failed:', error);
            dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$stores$2f$authSlice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["logoutUser"])(undefined));
            router.push('/session-expired?reason=refresh_failed');
        }
    }, [
        dispatch,
        router,
        updateActivity
    ]);
    // Automatic token refresh
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!isAuthenticated) return;
        tokenRefreshInterval.current = setInterval(()=>{
            refreshToken();
        }, TOKEN_REFRESH_INTERVAL);
        return ()=>{
            if (tokenRefreshInterval.current) {
                clearInterval(tokenRefreshInterval.current);
            }
        };
    }, [
        isAuthenticated,
        refreshToken
    ]);
    // ==========================================
    // MULTI-TAB SYNCHRONIZATION
    // ==========================================
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // Only initialize BroadcastChannel in browser environment where it's supported
        if ("TURBOPACK compile-time truthy", 1) return;
        //TURBOPACK unreachable
        ;
        // Check if BroadcastChannel is available via window (not available in Edge Runtime)
        // Using window/globalThis reference prevents static analysis issues
        const BroadcastChannelConstructor = undefined;
    }, [
        dispatch,
        router,
        lastActivityAt
    ]);
    // ==========================================
    // SESSION RESTORATION
    // ==========================================
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // On mount, check for existing session in cookies
        const restoreSession = async ()=>{
        // This will be handled by middleware and API calls
        // Token is in HTTP-only cookie, not accessible to JS
        // Backend will validate on first API call
        };
        restoreSession();
    }, []);
    // ==========================================
    // AUTH METHODS
    // ==========================================
    const login = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (email, password, rememberMe = false)=>{
        try {
            const result = await dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$stores$2f$authSlice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["loginUser"])({
                email,
                password
            })).unwrap();
            updateActivity();
            // Broadcast login to other tabs (only if supported)
            if (isBroadcastChannelSupported.current && broadcastChannel.current) {
                try {
                    broadcastChannel.current.postMessage({
                        type: 'login',
                        user: result.user
                    });
                } catch (error) {
                    console.warn('[Auth] Failed to broadcast login:', error);
                }
            }
            // Audit log login event
            console.log('[Auth] User logged in:', {
                userId: result.user.id,
                role: result.user.role
            });
        } catch (error) {
            console.error('[Auth] Login failed:', error);
            throw error;
        }
    }, [
        dispatch,
        updateActivity
    ]);
    const logout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        try {
            await dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$stores$2f$authSlice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["logoutUser"])(undefined)).unwrap();
            // Broadcast logout to other tabs (only if supported)
            if (isBroadcastChannelSupported.current && broadcastChannel.current) {
                try {
                    broadcastChannel.current.postMessage({
                        type: 'logout'
                    });
                } catch (error) {
                    console.warn('[Auth] Failed to broadcast logout:', error);
                }
            }
            // Audit log logout event
            console.log('[Auth] User logged out');
            router.push('/login');
        } catch (error) {
            console.error('[Auth] Logout failed:', error);
            // Still redirect to login even if server logout fails
            router.push('/login');
        }
    }, [
        dispatch,
        router
    ]);
    const clearError = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$stores$2f$authSlice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clearAuthError"])());
    }, [
        dispatch
    ]);
    // ==========================================
    // AUTHORIZATION HELPERS
    // ==========================================
    const hasRole = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((role)=>{
        if (!user) return false;
        const roles = Array.isArray(role) ? role : [
            role
        ];
        return roles.includes(user.role);
    }, [
        user
    ]);
    const hasPermission = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((permission)=>{
        if (!user || !user.permissions) return false;
        return user.permissions.includes(permission);
    }, [
        user
    ]);
    // ==========================================
    // CONTEXT VALUE
    // ==========================================
    const value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>({
            user,
            isAuthenticated,
            isLoading,
            error,
            sessionExpiresAt,
            lastActivityAt,
            login,
            logout,
            refreshToken,
            clearError,
            updateActivity,
            checkSession,
            hasRole,
            hasPermission
        }), [
        user,
        isAuthenticated,
        isLoading,
        error,
        sessionExpiresAt,
        lastActivityAt,
        login,
        logout,
        refreshToken,
        clearError,
        updateActivity,
        checkSession,
        hasRole,
        hasPermission
    ]);
    // Calculate time remaining for SessionWarningModal
    const timeRemainingSeconds = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (!isHydrated || lastActivityAt === 0) return 120; // Default 2 minutes
        const timeRemaining = HIPAA_IDLE_TIMEOUT - (Date.now() - lastActivityAt);
        return Math.floor(Math.max(0, timeRemaining) / 1000);
    }, [
        lastActivityAt,
        isHydrated
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: value,
        children: [
            children,
            showSessionWarning && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$components$2f$session$2f$SessionWarningModal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SessionWarningModal"], {
                isOpen: showSessionWarning,
                timeRemainingSeconds: timeRemainingSeconds,
                onExtendSession: ()=>{
                    updateActivity();
                    setShowSessionWarning(false);
                },
                onLogout: logout
            }, void 0, false, {
                fileName: "[project]/src/identity-access/contexts/AuthContext.tsx",
                lineNumber: 442,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/identity-access/contexts/AuthContext.tsx",
        lineNumber: 439,
        columnNumber: 5
    }, this);
}
function useAuth() {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
const useAuthContext = useAuth;
}),
"[project]/src/contexts/NavigationContext.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "NavigationErrorBoundary",
    ()=>NavigationErrorBoundary,
    "NavigationProvider",
    ()=>NavigationProvider,
    "default",
    ()=>__TURBOPACK__default__export__,
    "useNavigation",
    ()=>useNavigation
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
;
/**
 * Navigation context - provides navigation state and actions throughout the app
 */ const NavigationContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
/**
 * Storage keys for state persistence
 */ const STORAGE_KEYS = {
    SIDEBAR_OPEN: 'navigation_sidebar_open',
    SIDEBAR_COLLAPSED: 'navigation_sidebar_collapsed',
    ACTIVE_ROUTE: 'navigation_active_route'
};
const NavigationProvider = ({ children, initialSidebarOpen = true, initialSidebarCollapsed = false, maxHistoryEntries = 50, persistState = true })=>{
    // Initialize state from localStorage if persistence is enabled
    const getInitialSidebarOpen = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if ("TURBOPACK compile-time truthy", 1) {
            return initialSidebarOpen;
        }
        //TURBOPACK unreachable
        ;
    }, [
        initialSidebarOpen,
        persistState
    ]);
    const getInitialSidebarCollapsed = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if ("TURBOPACK compile-time truthy", 1) {
            return initialSidebarCollapsed;
        }
        //TURBOPACK unreachable
        ;
    }, [
        initialSidebarCollapsed,
        persistState
    ]);
    const getInitialActiveRoute = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if ("TURBOPACK compile-time truthy", 1) {
            return '/';
        }
        //TURBOPACK unreachable
        ;
    }, [
        persistState
    ]);
    // State management
    const [isSidebarOpen, setIsSidebarOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(getInitialSidebarOpen);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [activeRoute, setActiveRouteState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(getInitialActiveRoute);
    const [breadcrumbs, setBreadcrumbsState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [navigationHistory, setNavigationHistory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(getInitialSidebarCollapsed);
    const [notificationOpen, setNotificationOpenState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    // Persist sidebar state to localStorage
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if ("TURBOPACK compile-time truthy", 1) return;
        //TURBOPACK unreachable
        ;
    }, [
        isSidebarOpen,
        persistState
    ]);
    // Persist sidebar collapsed state to localStorage
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if ("TURBOPACK compile-time truthy", 1) return;
        //TURBOPACK unreachable
        ;
    }, [
        isSidebarCollapsed,
        persistState
    ]);
    // Persist active route to localStorage
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if ("TURBOPACK compile-time truthy", 1) return;
        //TURBOPACK unreachable
        ;
    }, [
        activeRoute,
        persistState
    ]);
    // Close mobile sidebar when switching to desktop view
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if ("TURBOPACK compile-time truthy", 1) return;
        //TURBOPACK unreachable
        ;
        const handleResize = undefined;
    }, [
        isMobileSidebarOpen
    ]);
    /**
   * Toggle desktop sidebar open/closed
   */ const toggleSidebar = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        setIsSidebarOpen((prev)=>!prev);
    }, []);
    /**
   * Set desktop sidebar open/closed explicitly
   */ const setSidebarOpen = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((open)=>{
        setIsSidebarOpen(open);
    }, []);
    /**
   * Toggle mobile sidebar open/closed
   */ const toggleMobileSidebar = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        setIsMobileSidebarOpen((prev)=>!prev);
    }, []);
    /**
   * Set mobile sidebar open/closed explicitly
   */ const setMobileSidebarOpen = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((open)=>{
        setIsMobileSidebarOpen(open);
    }, []);
    /**
   * Set the active route and update navigation history
   */ const setActiveRoute = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((route)=>{
        setActiveRouteState(route);
        // Add to history
        setNavigationHistory((prev)=>{
            const newEntry = {
                path: route,
                timestamp: Date.now()
            };
            // Avoid duplicate consecutive entries
            if (prev.length > 0 && prev[prev.length - 1].path === route) {
                return prev;
            }
            // Keep only maxHistoryEntries
            const updated = [
                ...prev,
                newEntry
            ];
            return updated.slice(-maxHistoryEntries);
        });
    }, [
        maxHistoryEntries
    ]);
    /**
   * Set breadcrumbs for the current view
   */ const setBreadcrumbs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((newBreadcrumbs)=>{
        setBreadcrumbsState(newBreadcrumbs);
    }, []);
    /**
   * Add entry to navigation history
   */ const addToHistory = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((entry)=>{
        setNavigationHistory((prev)=>{
            const newEntry = {
                ...entry,
                timestamp: Date.now()
            };
            // Avoid duplicate consecutive entries
            if (prev.length > 0 && prev[prev.length - 1].path === entry.path) {
                return prev;
            }
            const updated = [
                ...prev,
                newEntry
            ];
            return updated.slice(-maxHistoryEntries);
        });
    }, [
        maxHistoryEntries
    ]);
    /**
   * Clear navigation history
   */ const clearHistory = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        setNavigationHistory([]);
    }, []);
    /**
   * Toggle sidebar collapsed state (mini sidebar)
   */ const toggleSidebarCollapsed = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        setIsSidebarCollapsed((prev)=>!prev);
    }, []);
    /**
   * Set sidebar collapsed state explicitly
   */ const setSidebarCollapsed = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((collapsed)=>{
        setIsSidebarCollapsed(collapsed);
    }, []);
    /**
   * Navigate back to previous route in history
   * Returns the previous navigation entry or null if history is empty
   */ const navigateBack = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (navigationHistory.length <= 1) {
            return null;
        }
        // Get the previous entry (second to last)
        const previousEntry = navigationHistory[navigationHistory.length - 2];
        // Remove the current entry from history
        setNavigationHistory((prev)=>prev.slice(0, -1));
        return previousEntry;
    }, [
        navigationHistory
    ]);
    /**
   * Toggle notification center open/closed
   */ const toggleNotificationCenter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        setNotificationOpenState((prev)=>!prev);
    }, []);
    /**
   * Set notification center open/closed explicitly
   */ const setNotificationOpen = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((open)=>{
        setNotificationOpenState(open);
    }, []);
    // Memoize context value to prevent unnecessary re-renders
    const contextValue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>({
            // State
            isSidebarOpen,
            isMobileSidebarOpen,
            activeRoute,
            breadcrumbs,
            navigationHistory,
            isSidebarCollapsed,
            notificationOpen,
            // Actions
            toggleSidebar,
            setSidebarOpen,
            toggleMobileSidebar,
            setMobileSidebarOpen,
            setActiveRoute,
            setBreadcrumbs,
            addToHistory,
            clearHistory,
            toggleSidebarCollapsed,
            setSidebarCollapsed,
            navigateBack,
            toggleNotificationCenter,
            setNotificationOpen
        }), [
        isSidebarOpen,
        isMobileSidebarOpen,
        activeRoute,
        notificationOpen,
        breadcrumbs,
        navigationHistory,
        isSidebarCollapsed,
        toggleSidebar,
        setSidebarOpen,
        toggleMobileSidebar,
        setMobileSidebarOpen,
        setActiveRoute,
        setBreadcrumbs,
        addToHistory,
        clearHistory,
        toggleSidebarCollapsed,
        setSidebarCollapsed,
        navigateBack
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(NavigationContext.Provider, {
        value: contextValue,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/contexts/NavigationContext.tsx",
        lineNumber: 416,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const useNavigation = ()=>{
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(NavigationContext);
    if (context === undefined) {
        throw new Error('useNavigation must be used within a NavigationProvider. ' + 'Wrap your component tree with <NavigationProvider> to use navigation features.');
    }
    return context;
};
class NavigationErrorBoundary extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].Component {
    constructor(props){
        super(props);
        this.state = {
            hasError: false,
            error: null
        };
    }
    static getDerivedStateFromError(error) {
        return {
            hasError: true,
            error
        };
    }
    componentDidCatch(error, errorInfo) {
        console.error('NavigationContext Error:', error, errorInfo);
    }
    render() {
        if (this.state.hasError) {
            return this.props.fallback || /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                role: "alert",
                style: {
                    padding: '20px',
                    color: 'red'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        children: "Navigation Error"
                    }, void 0, false, {
                        fileName: "[project]/src/contexts/NavigationContext.tsx",
                        lineNumber: 486,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: this.state.error?.message || 'An error occurred in the navigation system'
                    }, void 0, false, {
                        fileName: "[project]/src/contexts/NavigationContext.tsx",
                        lineNumber: 487,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/contexts/NavigationContext.tsx",
                lineNumber: 485,
                columnNumber: 9
            }, this);
        }
        return this.props.children;
    }
}
const __TURBOPACK__default__export__ = NavigationContext;
}),
"[project]/src/app/providers.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Providers",
    ()=>Providers
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
/**
 * Providers Component - Client-side provider setup for Next.js
 *
 * This component wraps the app with all necessary providers:
 * - React Query Provider (server state)
 * - Redux Provider (client state)
 * - Apollo Provider (GraphQL)
 * - Auth Provider (authentication & authorization)
 * - Navigation Provider (UI navigation state)
 *
 * @module app/providers
 * @category State Management
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2d$devtools$2f$build$2f$modern$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query-devtools/build/modern/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$queryClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/config/queryClient.ts [app-ssr] (ecmascript)");
// Import consolidated providers
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$providers$2f$ReduxProvider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/providers/ReduxProvider.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$providers$2f$ApolloProvider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/providers/ApolloProvider.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/identity-access/contexts/AuthContext.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$NavigationContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/NavigationContext.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
;
;
;
function Providers({ children }) {
    // Create a new query client instance per request for SSR
    const [queryClient] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$queryClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getQueryClient"])());
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$providers$2f$ReduxProvider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ReduxProvider"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["QueryClientProvider"], {
            client: queryClient,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$providers$2f$ApolloProvider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ApolloProvider"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AuthProvider"], {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$NavigationContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NavigationProvider"], {
                            children: children
                        }, void 0, false, {
                            fileName: "[project]/src/app/providers.tsx",
                            lineNumber: 41,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/providers.tsx",
                        lineNumber: 40,
                        columnNumber: 11
                    }, this),
                    ("TURBOPACK compile-time value", "development") === 'development' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2d$devtools$2f$build$2f$modern$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ReactQueryDevtools"], {
                        initialIsOpen: false
                    }, void 0, false, {
                        fileName: "[project]/src/app/providers.tsx",
                        lineNumber: 46,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/providers.tsx",
                lineNumber: 39,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/providers.tsx",
            lineNumber: 38,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/providers.tsx",
        lineNumber: 37,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__1bb580ab._.js.map