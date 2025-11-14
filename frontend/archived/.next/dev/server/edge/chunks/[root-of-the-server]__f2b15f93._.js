(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/[root-of-the-server]__f2b15f93._.js",
"[externals]/node:buffer [external] (node:buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[project]/middleware.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Next.js Middleware - Authentication, Security & Rate Limiting
 *
 * CRITICAL SECURITY: This middleware enforces authentication and HIPAA compliance.
 * All PHI routes require valid authentication tokens and role-based access.
 *
 * @module middleware
 * @since 2025-11-05
 */ __turbopack_context__.s([
    "config",
    ()=>config,
    "default",
    ()=>middleware
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/api/server.js [middleware-edge] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/server/web/exports/index.js [middleware-edge] (ecmascript)");
;
// Cookie configuration
const COOKIE_NAMES = {
    ACCESS_TOKEN: ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 'auth.token'
};
// Stub for rate limiter - will be implemented later
function getRateLimiter() {
    return {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        check: async (_identifier, _limit, _window)=>({
                success: true,
                retryAfter: null
            })
    };
}
/**
 * Public routes that don't require authentication
 */ const PUBLIC_ROUTES = [
    '/login',
    '/session-expired',
    '/forgot-password',
    '/reset-password',
    '/_next',
    '/favicon.ico',
    '/api/health',
    '/api/auth/login',
    '/api/auth/refresh',
    '/api/auth/logout'
];
/**
 * PHI routes requiring enhanced security and audit logging
 */ const PHI_ROUTES = [
    '/students',
    '/health-records',
    '/medications',
    '/incidents',
    '/communications',
    '/api/v1/students',
    '/api/v1/health-records',
    '/api/v1/medications'
];
/**
 * Admin routes requiring ADMIN or SYSTEM_ADMIN role
 */ const ADMIN_ROUTES = [
    '/admin',
    '/api/v1/admin'
];
async function middleware(request) {
    const { pathname } = request.nextUrl;
    // Fix for GitHub Codespaces Server Actions
    // Server Actions validate origin against x-forwarded-host
    const isCodespaces = process.env.CODESPACES === 'true' || request.headers.get('x-forwarded-host')?.includes('.app.github.dev');
    if (isCodespaces) {
        const response = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
        const forwardedHost = request.headers.get('x-forwarded-host');
        // Override origin to match forwarded host for Server Actions
        if (forwardedHost) {
            response.headers.set('x-forwarded-host', forwardedHost);
            response.headers.set('x-forwarded-proto', 'https');
        }
        // For Server Actions POST requests, we need to rewrite headers
        if (request.method === 'POST' && request.headers.get('content-type')?.includes('multipart/form-data')) {
            return response;
        }
    }
    // Allow public routes
    if (PUBLIC_ROUTES.some((route)=>pathname.startsWith(route))) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
    }
    // Rate limiting for API routes
    if (pathname.startsWith('/api/')) {
        const rateLimitResult = await checkRateLimit(request);
        if (!rateLimitResult.success) {
            return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"]('Too Many Requests', {
                status: 429,
                headers: {
                    'Retry-After': rateLimitResult.retryAfter || '60'
                }
            });
        }
    }
    // Authentication check
    const authResult = await authenticateRequest(request);
    if (!authResult.authenticated) {
        // Redirect to login with return URL
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('returnUrl', pathname);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(loginUrl);
    }
    // Role-based access control for admin routes
    if (ADMIN_ROUTES.some((route)=>pathname.startsWith(route))) {
        if (![
            'ADMIN',
            'SYSTEM_ADMIN'
        ].includes(authResult.user?.role || '')) {
            return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"]('Forbidden', {
                status: 403
            });
        }
    }
    // PHI access audit logging
    if (PHI_ROUTES.some((route)=>pathname.startsWith(route))) {
        // Note: Actual audit logging should happen in Server Actions/API routes
        // Here we just add headers for downstream processing
        const response = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
        response.headers.set('X-PHI-Access', 'true');
        response.headers.set('X-User-Id', authResult.user?.id || '');
        response.headers.set('X-User-Role', authResult.user?.role || '');
        return response;
    }
    // Add user context to request headers
    const response = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
    if (authResult.user) {
        response.headers.set('X-User-Id', authResult.user.id);
        response.headers.set('X-User-Email', authResult.user.email);
        response.headers.set('X-User-Role', authResult.user.role);
    }
    return response;
}
/**
 * Authenticate request using JWT token from cookies
 * Note: This is a lightweight check in middleware. Full JWT verification
 * happens in API routes and server actions.
 */ async function authenticateRequest(request) {
    try {
        const token = request.cookies.get(COOKIE_NAMES.ACCESS_TOKEN)?.value;
        if (!token || token.length < 20) {
            return {
                authenticated: false
            };
        }
        // Basic token format validation (JWT has 3 parts separated by dots)
        const parts = token.split('.');
        if (parts.length !== 3) {
            return {
                authenticated: false
            };
        }
        // For middleware, we assume the token is valid if it exists and has proper format
        // Full verification happens in API routes
        return {
            authenticated: true,
            user: {
                id: 'middleware-user',
                email: 'middleware@example.com',
                role: 'USER'
            }
        };
    } catch (error) {
        console.error('[Middleware] Authentication failed:', error);
        return {
            authenticated: false
        };
    }
}
/**
 * Rate limiting check
 */ async function checkRateLimit(request) {
    const { pathname } = request.nextUrl;
    const limiter = getRateLimiter();
    // Different limits for different routes
    const limits = {
        '/api/v1/health-records': {
            limit: 100,
            window: '15m'
        },
        '/api/v1/students': {
            limit: 100,
            window: '15m'
        },
        '/api/v1/medications': {
            limit: 100,
            window: '15m'
        },
        '/api/v1': {
            limit: 500,
            window: '15m'
        },
        default: {
            limit: 1000,
            window: '15m'
        }
    };
    const identifier = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    // Find matching limit
    let limit = limits.default;
    for (const [route, routeLimit] of Object.entries(limits)){
        if (route !== 'default' && pathname.startsWith(route)) {
            limit = routeLimit;
            break;
        }
    }
    return await limiter.check(identifier, limit.limit, limit.window);
}
const config = {
    matcher: [
        /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon file)
     */ '/((?!_next/static|_next/image|favicon.ico).*)'
    ]
};
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__f2b15f93._.js.map