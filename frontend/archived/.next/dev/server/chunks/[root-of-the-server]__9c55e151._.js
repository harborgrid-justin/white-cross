module.exports = [
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/lib/incremental-cache/tags-manifest.external.js [external] (next/dist/server/lib/incremental-cache/tags-manifest.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/lib/incremental-cache/tags-manifest.external.js", () => require("next/dist/server/lib/incremental-cache/tags-manifest.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/src/identity-access/lib/config/cookies.ts [middleware] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/src/identity-access/lib/utils/token-utils.ts [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Centralized Token Utilities
 *
 * Single source of truth for token extraction, validation, and cookie management.
 * Consolidates all token-related operations across the application.
 *
 * @module lib/utils/token-utils
 * @since 2025-11-04
 */ __turbopack_context__.s([
    "TOKEN_CONFIG",
    ()=>TOKEN_CONFIG,
    "clearAccessToken",
    ()=>clearAccessToken,
    "clearAllTokens",
    ()=>clearAllTokens,
    "clearRefreshToken",
    ()=>clearRefreshToken,
    "decodeToken",
    ()=>decodeToken,
    "extractTokenFromRequest",
    ()=>extractTokenFromRequest,
    "extractTokenFromServer",
    ()=>extractTokenFromServer,
    "getRefreshTokenFromServer",
    ()=>getRefreshTokenFromServer,
    "getTimeRemaining",
    ()=>getTimeRemaining,
    "hasToken",
    ()=>hasToken,
    "isTokenExpired",
    ()=>isTokenExpired,
    "isTokenExpiringSoon",
    ()=>isTokenExpiringSoon,
    "isValidTokenStructure",
    ()=>isValidTokenStructure,
    "setAccessToken",
    ()=>setAccessToken,
    "setRefreshToken",
    ()=>setRefreshToken,
    "setTokens",
    ()=>setTokens
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$lib$2f$config$2f$cookies$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/identity-access/lib/config/cookies.ts [middleware] (ecmascript)");
;
;
const TOKEN_CONFIG = {
    // Cookie names - use centralized COOKIE_NAMES
    ACCESS_TOKEN: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$lib$2f$config$2f$cookies$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["COOKIE_NAMES"].ACCESS_TOKEN,
    REFRESH_TOKEN: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$lib$2f$config$2f$cookies$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["COOKIE_NAMES"].REFRESH_TOKEN,
    // Alternative cookie names to check (for backwards compatibility)
    ALT_ACCESS_NAMES: [
        'auth_token',
        'access_token',
        'token',
        'jwt',
        'authToken'
    ],
    ALT_REFRESH_NAMES: [
        'refresh_token',
        'refreshToken'
    ],
    // Cookie options
    OPTIONS: {
        httpOnly: true,
        secure: ("TURBOPACK compile-time value", "development") === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: {
            access: 24 * 60 * 60,
            refresh: 7 * 24 * 60 * 60
        }
    }
};
function extractTokenFromRequest(request) {
    // Try primary cookie name first
    let token = request.cookies.get(TOKEN_CONFIG.ACCESS_TOKEN)?.value;
    if (token) {
        return token;
    }
    // Try alternative cookie names for backwards compatibility
    for (const altName of TOKEN_CONFIG.ALT_ACCESS_NAMES){
        token = request.cookies.get(altName)?.value;
        if (token) {
            return token;
        }
    }
    // Try Authorization header
    const authHeader = request.headers.get('authorization');
    if (authHeader) {
        // Support both "Bearer <token>" and "<token>" formats
        return authHeader.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;
    }
    return null;
}
async function extractTokenFromServer() {
    try {
        const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["cookies"])();
        // Try primary cookie name first
        let token = cookieStore.get(TOKEN_CONFIG.ACCESS_TOKEN)?.value;
        if (token) {
            return token;
        }
        // Try alternative cookie names
        for (const altName of TOKEN_CONFIG.ALT_ACCESS_NAMES){
            token = cookieStore.get(altName)?.value;
            if (token) {
                return token;
            }
        }
        // Try Authorization header (for API clients)
        try {
            const headersList = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["headers"])();
            const authHeader = headersList.get('authorization');
            if (authHeader) {
                return authHeader.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;
            }
        } catch  {
        // headers() might throw in some contexts (e.g., static pages)
        // This is expected, continue with null token
        }
        return null;
    } catch (error) {
        console.error('[TokenUtils] Token extraction failed:', error);
        return null;
    }
}
async function getRefreshTokenFromServer() {
    try {
        const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["cookies"])();
        // Try primary refresh token name
        let token = cookieStore.get(TOKEN_CONFIG.REFRESH_TOKEN)?.value;
        if (token) {
            return token;
        }
        // Try alternative names
        for (const altName of TOKEN_CONFIG.ALT_REFRESH_NAMES){
            token = cookieStore.get(altName)?.value;
            if (token) {
                return token;
            }
        }
        return null;
    } catch (error) {
        console.error('[TokenUtils] Refresh token extraction failed:', error);
        return null;
    }
}
function decodeToken(token) {
    try {
        const base64Url = token.split('.')[1];
        if (!base64Url) return null;
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map((c)=>'%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('[TokenUtils] Token decode error:', error);
        return null;
    }
}
function isTokenExpired(payload, clockSkewSeconds = 30) {
    if (!payload.exp) {
        return true;
    }
    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now - clockSkewSeconds;
}
function isTokenExpiringSoon(payload, warningThresholdSeconds = 300) {
    if (!payload.exp) {
        return true;
    }
    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now + warningThresholdSeconds;
}
function getTimeRemaining(payload) {
    if (!payload.exp) {
        return 0;
    }
    const now = Math.floor(Date.now() / 1000);
    return Math.max(0, payload.exp - now);
}
async function setAccessToken(token, maxAge) {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["cookies"])();
    cookieStore.set(TOKEN_CONFIG.ACCESS_TOKEN, token, {
        ...TOKEN_CONFIG.OPTIONS,
        maxAge: maxAge || TOKEN_CONFIG.OPTIONS.maxAge.access
    });
}
async function setRefreshToken(token, maxAge) {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["cookies"])();
    cookieStore.set(TOKEN_CONFIG.REFRESH_TOKEN, token, {
        ...TOKEN_CONFIG.OPTIONS,
        maxAge: maxAge || TOKEN_CONFIG.OPTIONS.maxAge.refresh
    });
}
async function setTokens(accessToken, refreshToken) {
    await Promise.all([
        setAccessToken(accessToken),
        setRefreshToken(refreshToken)
    ]);
}
async function clearAccessToken() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["cookies"])();
    cookieStore.delete(TOKEN_CONFIG.ACCESS_TOKEN);
}
async function clearRefreshToken() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["cookies"])();
    cookieStore.delete(TOKEN_CONFIG.REFRESH_TOKEN);
}
async function clearAllTokens() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["cookies"])();
    // Clear primary tokens
    cookieStore.delete(TOKEN_CONFIG.ACCESS_TOKEN);
    cookieStore.delete(TOKEN_CONFIG.REFRESH_TOKEN);
    // Clear alternative token names for thorough cleanup
    for (const altName of TOKEN_CONFIG.ALT_ACCESS_NAMES){
        try {
            cookieStore.delete(altName);
        } catch  {
        // Ignore errors for non-existent cookies
        }
    }
    for (const altName of TOKEN_CONFIG.ALT_REFRESH_NAMES){
        try {
            cookieStore.delete(altName);
        } catch  {
        // Ignore errors for non-existent cookies
        }
    }
}
async function hasToken() {
    try {
        const token = await extractTokenFromServer();
        return token !== null;
    } catch  {
        return false;
    }
}
function isValidTokenStructure(token) {
    if (!token || typeof token !== 'string') {
        return false;
    }
    const parts = token.split('.');
    // JWT should have 3 parts: header.payload.signature
    if (parts.length !== 3) {
        return false;
    }
    // Check if parts are base64 encoded
    try {
        atob(parts[0].replace(/-/g, '+').replace(/_/g, '/'));
        atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
        return true;
    } catch  {
        return false;
    }
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
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[project]/src/identity-access/lib/config/roles.ts [middleware] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/src/lib/auth.ts [middleware] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jsonwebtoken/index.js [middleware] (ecmascript)");
/**
 * Role hierarchy for permission checking
 * @deprecated Import from @/identity-access/lib/config/roles instead
 *
 * This is maintained for backward compatibility only.
 * New code should use the centralized role configuration.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$lib$2f$config$2f$roles$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/identity-access/lib/config/roles.ts [middleware] (ecmascript)");
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
        const decoded = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["default"].verify(token, JWT_SECRET, {
            issuer: 'white-cross-healthcare',
            audience: 'white-cross-api'
        });
        // Verify token type
        if (decoded.type && decoded.type !== 'access') {
            throw new Error('Invalid token type');
        }
        return decoded;
    } catch (error) {
        if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["default"].JsonWebTokenError) {
            throw new Error('Invalid token');
        }
        if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["default"].TokenExpiredError) {
            throw new Error('Token has expired');
        }
        throw error;
    }
}
function verifyRefreshToken(token) {
    // Note: JWT_REFRESH_SECRET is validated at module load time, guaranteed to exist
    try {
        const decoded = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["default"].verify(token, JWT_REFRESH_SECRET, {
            issuer: 'white-cross-healthcare'
        });
        // Verify token type
        if (decoded.type && decoded.type !== 'refresh') {
            throw new Error('Invalid token type');
        }
        return decoded;
    } catch (error) {
        if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["default"].JsonWebTokenError) {
            throw new Error('Invalid refresh token');
        }
        if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["default"].TokenExpiredError) {
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
const ROLE_HIERARCHY = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$lib$2f$config$2f$roles$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["ROLE_HIERARCHY"];
function hasMinimumRole(user, minimumRole) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$lib$2f$config$2f$roles$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["hasMinimumRole"])(user.role, minimumRole);
}
const auth = authenticateRequest;
}),
"[project]/middleware.ts [middleware] (ecmascript)", ((__turbopack_context__) => {
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
    ()=>middleware,
    "runtime",
    ()=>runtime
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$lib$2f$utils$2f$token$2d$utils$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/identity-access/lib/utils/token-utils.ts [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/auth.ts [middleware] (ecmascript)");
;
;
;
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
    '/api/health'
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
    // Allow public routes
    if (PUBLIC_ROUTES.some((route)=>pathname.startsWith(route))) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].next();
    }
    // Rate limiting for API routes
    if (pathname.startsWith('/api/')) {
        const rateLimitResult = await checkRateLimit(request);
        if (!rateLimitResult.success) {
            return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"]('Too Many Requests', {
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
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].redirect(loginUrl);
    }
    // Redirect authenticated users from root to dashboard
    if (pathname === '/') {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL('/dashboard', request.url));
    }
    // Role-based access control for admin routes
    if (ADMIN_ROUTES.some((route)=>pathname.startsWith(route))) {
        if (![
            'ADMIN',
            'SYSTEM_ADMIN'
        ].includes(authResult.user?.role || '')) {
            return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"]('Forbidden', {
                status: 403
            });
        }
    }
    // PHI access audit logging
    if (PHI_ROUTES.some((route)=>pathname.startsWith(route))) {
        // Note: Actual audit logging should happen in Server Actions/API routes
        // Here we just add headers for downstream processing
        const response = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].next();
        response.headers.set('X-PHI-Access', 'true');
        response.headers.set('X-User-Id', authResult.user?.id || '');
        response.headers.set('X-User-Role', authResult.user?.role || '');
        return response;
    }
    // Add user context to request headers
    const response = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].next();
    if (authResult.user) {
        response.headers.set('X-User-Id', authResult.user.id);
        response.headers.set('X-User-Email', authResult.user.email);
        response.headers.set('X-User-Role', authResult.user.role);
    }
    return response;
}
/**
 * Authenticate request using JWT token from cookies
 */ async function authenticateRequest(request) {
    try {
        const token = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$lib$2f$utils$2f$token$2d$utils$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["extractTokenFromRequest"])(request);
        if (!token) {
            return {
                authenticated: false
            };
        }
        // Verify JWT token (server-side only)
        const payload = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["verifyAccessToken"])(token);
        return {
            authenticated: true,
            user: {
                id: payload.id,
                email: payload.email,
                role: payload.role
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
const runtime = 'nodejs';
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__9c55e151._.js.map