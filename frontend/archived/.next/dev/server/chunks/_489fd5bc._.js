module.exports = [
"[project]/src/lib/monitoring/sentry.ts [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Sentry Error Tracking and Performance Monitoring (Lazy Loaded)
 *
 * Provides comprehensive error tracking, performance monitoring,
 * and session replay for production environments.
 *
 * PERFORMANCE OPTIMIZATION: Lazy loads Sentry SDK to reduce initial bundle size by ~150KB (gzipped)
 */ __turbopack_context__.s([
    "addBreadcrumb",
    ()=>addBreadcrumb,
    "captureException",
    ()=>captureException,
    "captureMessage",
    ()=>captureMessage,
    "clearUserContext",
    ()=>clearUserContext,
    "initSentry",
    ()=>initSentry,
    "setUserContext",
    ()=>setUserContext,
    "startTransaction",
    ()=>startTransaction,
    "withSentry",
    ()=>withSentry
]);
// Track initialization state
let sentryInitialized = false;
let sentryInitPromise = null;
/**
 * Lazy load Sentry SDK
 * Only loads in production to minimize bundle size
 */ async function loadSentry() {
    // Skip in development to save bundle size
    if ("TURBOPACK compile-time truthy", 1) {
        return null;
    }
    //TURBOPACK unreachable
    ;
}
async function initSentry() {
    if (sentryInitialized) {
        return;
    }
    const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN;
    const environment = process.env.NEXT_PUBLIC_ENVIRONMENT || ("TURBOPACK compile-time value", "development");
    if (!SENTRY_DSN) {
        console.warn('Sentry DSN not configured, error tracking disabled');
        return;
    }
    // Lazy load Sentry
    const Sentry = await loadSentry();
    if (!Sentry) {
        return;
    }
    Sentry.init({
        dsn: SENTRY_DSN,
        environment,
        // Performance Monitoring
        tracesSampleRate: environment === 'production' ? 0.1 : 1.0,
        profilesSampleRate: environment === 'production' ? 0.1 : 1.0,
        // Session Replay
        replaysSessionSampleRate: environment === 'production' ? 0.1 : 1.0,
        replaysOnErrorSampleRate: 1.0,
        // Error filtering
        beforeSend (event, hint) {
            // Filter out non-critical errors in production
            if (environment === 'production') {
                // Don't send browser extension errors
                if (event.exception?.values?.[0]?.value?.includes('extension://')) {
                    return null;
                }
                // Don't send canceled requests
                if (event.exception?.values?.[0]?.type === 'AbortError') {
                    return null;
                }
            }
            // Sanitize PHI from error messages (HIPAA compliance)
            if (event.message) {
                event.message = sanitizePHI(event.message);
            }
            if (event.exception?.values) {
                event.exception.values = event.exception.values.map((exception)=>({
                        ...exception,
                        value: sanitizePHI(exception.value || '')
                    }));
            }
            return event;
        },
        // Additional configuration
        integrations: [
            Sentry.browserTracingIntegration({
                tracePropagationTargets: [
                    'localhost',
                    /^https:\/\/.*\.whitecross\.com/
                ]
            }),
            Sentry.replayIntegration({
                maskAllText: true,
                blockAllMedia: true
            })
        ],
        // Ignore common errors
        ignoreErrors: [
            'ResizeObserver loop limit exceeded',
            'Non-Error promise rejection captured',
            'Network request failed',
            'Failed to fetch',
            'Load failed',
            'NetworkError'
        ],
        // Release tracking
        release: process.env.NEXT_PUBLIC_SENTRY_RELEASE || process.env.VERCEL_GIT_COMMIT_SHA
    });
    sentryInitialized = true;
}
/**
 * Sanitize PHI from error messages
 * Removes patient names, SSNs, DOBs, and other identifiable information
 */ function sanitizePHI(text) {
    if (!text) return text;
    return text// Remove SSN patterns (XXX-XX-XXXX)
    .replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[SSN-REDACTED]')// Remove email addresses
    .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL-REDACTED]')// Remove phone numbers
    .replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, '[PHONE-REDACTED]')// Remove dates that might be DOB (MM/DD/YYYY, MM-DD-YYYY)
    .replace(/\b\d{1,2}[/-]\d{1,2}[/-]\d{4}\b/g, '[DATE-REDACTED]')// Remove potential medical record numbers (MRN)
    .replace(/\bMRN[:\s]*\d+\b/gi, '[MRN-REDACTED]')// Remove potential patient IDs
    .replace(/\bpatient[_\s]?id[:\s]*\d+\b/gi, '[PATIENT-ID-REDACTED]');
}
async function captureException(error, context) {
    const Sentry = await loadSentry();
    if (!Sentry) return;
    if (context?.tags) {
        Sentry.setTags(context.tags);
    }
    if (context?.extra) {
        Sentry.setExtras(context.extra);
    }
    Sentry.captureException(error, {
        level: context?.level || 'error'
    });
}
async function captureMessage(message, context) {
    const Sentry = await loadSentry();
    if (!Sentry) return;
    const sanitizedMessage = sanitizePHI(message);
    if (context?.tags) {
        Sentry.setTags(context.tags);
    }
    if (context?.extra) {
        Sentry.setExtras(context.extra);
    }
    Sentry.captureMessage(sanitizedMessage, context?.level || 'info');
}
async function setUserContext(user) {
    const Sentry = await loadSentry();
    if (!Sentry) return;
    Sentry.setUser({
        id: user.id,
        // DO NOT include name, email, or other PHI
        role: user.role,
        organizationId: user.organizationId
    });
}
async function clearUserContext() {
    const Sentry = await loadSentry();
    if (!Sentry) return;
    Sentry.setUser(null);
}
async function startTransaction(name, operation, data) {
    const Sentry = await loadSentry();
    if (!Sentry) return undefined;
    return Sentry.startTransaction({
        name,
        op: operation,
        data
    });
}
async function addBreadcrumb(message, category, level, data) {
    const Sentry = await loadSentry();
    if (!Sentry) return;
    const sanitizedMessage = sanitizePHI(message);
    Sentry.addBreadcrumb({
        message: sanitizedMessage,
        category: category || 'custom',
        level: level || 'info',
        data,
        timestamp: Date.now() / 1000
    });
}
function withSentry(fn, functionName) {
    return async (...args)=>{
        try {
            return await fn(...args);
        } catch (error) {
            await captureException(error, {
                tags: {
                    function: functionName || fn.name
                }
            });
            throw error;
        }
    };
}
}),
"[project]/instrumentation.ts [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Next.js Server Instrumentation - White Cross Healthcare Platform
 *
 * This file implements Next.js instrumentation API for monitoring, error tracking,
 * and observability initialization. It runs once during server startup in both
 * Node.js and Edge runtime environments.
 *
 * Key Responsibilities:
 * - Initialize error tracking and monitoring (Sentry)
 * - Set up distributed tracing for healthcare workflows
 * - Configure performance monitoring for patient-critical operations
 * - Establish request-level error handling
 *
 * Healthcare Context:
 * - Error tracking is HIPAA-compliant (no PHI in error reports)
 * - Monitoring helps identify issues affecting patient care workflows
 * - Performance tracking ensures responsive healthcare operations
 * - Request error logging aids in security auditing
 *
 * Runtime Support:
 * - Node.js runtime: Full server-side instrumentation
 * - Edge runtime: Lightweight instrumentation for edge functions
 *
 * @module instrumentation
 * @see https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 * @see https://docs.sentry.io/platforms/javascript/guides/nextjs/
 * @version 1.0.0
 * @since 2025-10-26
 */ __turbopack_context__.s([
    "onRequestError",
    ()=>onRequestError,
    "register",
    ()=>register
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$monitoring$2f$sentry$2e$ts__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/monitoring/sentry.ts [instrumentation] (ecmascript)");
;
function register() {
    if ("TURBOPACK compile-time truthy", 1) {
        // Initialize Sentry for error tracking in Node.js runtime
        // Handles errors in Server Components, API routes, and middleware
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$monitoring$2f$sentry$2e$ts__$5b$instrumentation$5d$__$28$ecmascript$29$__["initSentry"])();
        console.log('Server instrumentation initialized');
    }
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
}
async function onRequestError(error, request) {
    // Log error details for debugging and monitoring
    // Note: Ensure no PHI is included in error messages
    console.error('Request error:', {
        error: error.message,
        path: request.path,
        method: request.method
    });
// Additional error handling can be added here:
// - Send to external monitoring (DataDog, Sentry - already auto-captured)
// - Trigger alerts for critical healthcare operations
// - Record in audit log for compliance tracking
// - Custom retry logic for transient failures
}
}),
];

//# sourceMappingURL=_489fd5bc._.js.map