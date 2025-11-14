(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/app/(dashboard)/admin/forbidden.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AdminForbidden,
    "metadata",
    ()=>metadata
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
/**
 * @fileoverview Admin 403 Forbidden Page
 *
 * Admin-specific forbidden page displayed when users attempt to access administrative
 * features without proper admin-level permissions. This page provides admin-context
 * aware messaging and emphasizes the high-security nature of admin resources.
 *
 * @module app/admin/forbidden
 * @category Error Pages
 * @subcategory 403 Forbidden
 *
 * **When This Displays:**
 * - Non-admin user attempts to access admin routes
 * - User has insufficient admin privileges
 * - Admin role verification fails
 * - Middleware redirects from protected admin routes
 *
 * **Admin Context:**
 * This forbidden page is specific to the admin section and provides:
 * - Admin-specific messaging
 * - Security-focused language
 * - Links to request admin access
 * - Emphasis on privilege requirements
 * - HIPAA compliance messaging
 *
 * **Forbidden Hierarchy:**
 * ```
 * /forbidden.tsx (root - general permission denial)
 * └── admin/forbidden.tsx (this file - admin-specific)
 * ```
 *
 * **Key Features:**
 * - Admin-specific permission messaging
 * - Request admin access flow
 * - Security and compliance emphasis
 * - HIPAA-compliant messaging
 * - Healthcare-themed styling
 * - Client component for navigation
 *
 * **Navigation Options:**
 * 1. Primary: Request Admin Access
 * 2. Secondary: Go to Dashboard (non-admin area)
 * 3. Tertiary: Contact Administrator
 *
 * **Security Considerations:**
 * - Does not expose admin feature structure
 * - Emphasizes security and compliance
 * - Generic messaging for security
 * - No indication of admin capabilities
 * - HIPAA-compliant error handling
 *
 * **Admin Features Protected:**
 * - System configuration
 * - User management
 * - Security settings
 * - Compliance monitoring
 * - Audit logs and reporting
 *
 * **Accessibility:**
 * - Semantic HTML structure
 * - Clear visual hierarchy
 * - Keyboard-accessible buttons
 * - Screen reader compatible
 * - High-contrast restriction colors
 *
 * @requires Client Component - Uses navigation and interactive elements
 *
 * @see {@link https://nextjs.org/docs/app/building-your-application/routing/error-handling | Next.js Error Handling}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/403 | HTTP 403 Status}
 *
 * @example
 * ```tsx
 * // Admin middleware check:
 * export function middleware(request: NextRequest) {
 *   if (request.nextUrl.pathname.startsWith('/admin')) {
 *     const user = await getUser();
 *     if (!user.isAdmin) {
 *       return NextResponse.redirect(new URL('/admin/forbidden', request.url));
 *     }
 *   }
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Admin layout permission check:
 * export default async function AdminLayout({ children }) {
 *   const user = await getUser();
 *   if (!user.hasRole('admin')) {
 *     redirect('/admin/forbidden');
 *   }
 *   return <>{children}</>;
 * }
 * ```
 *
 * @since 1.0.0
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
const metadata = {
    title: 'Admin Access Required | White Cross Healthcare',
    description: 'Administrative privileges required to access this resource.'
};
function AdminForbidden() {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(20);
    if ($[0] !== "ab207f1941da97a6ee146b40a32550d145b2e9a2731d69028b60e972989c7eb6") {
        for(let $i = 0; $i < 20; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "ab207f1941da97a6ee146b40a32550d145b2e9a2731d69028b60e972989c7eb6";
    }
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    let t0;
    if ($[1] !== router) {
        t0 = ({
            "AdminForbidden[handleRequestAdminAccess]": ()=>{
                router.push("/request-admin-access");
            }
        })["AdminForbidden[handleRequestAdminAccess]"];
        $[1] = router;
        $[2] = t0;
    } else {
        t0 = $[2];
    }
    const handleRequestAdminAccess = t0;
    let t1;
    if ($[3] === Symbol.for("react.memo_cache_sentinel")) {
        t1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mb-4",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        className: "w-4 h-4 mr-1",
                        fill: "currentColor",
                        viewBox: "0 0 20 20",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            fillRule: "evenodd",
                            d: "M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z",
                            clipRule: "evenodd"
                        }, void 0, false, {
                            fileName: "[project]/src/app/(dashboard)/admin/forbidden.tsx",
                            lineNumber: 200,
                            columnNumber: 212
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/(dashboard)/admin/forbidden.tsx",
                        lineNumber: 200,
                        columnNumber: 142
                    }, this),
                    "ADMIN ACCESS REQUIRED"
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/(dashboard)/admin/forbidden.tsx",
                lineNumber: 200,
                columnNumber: 32
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/admin/forbidden.tsx",
            lineNumber: 200,
            columnNumber: 10
        }, this);
        $[3] = t1;
    } else {
        t1 = $[3];
    }
    let t2;
    let t3;
    let t4;
    let t5;
    let t6;
    if ($[4] === Symbol.for("react.memo_cache_sentinel")) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                className: "h-8 w-8 text-red-600",
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeWidth: 2,
                    d: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                }, void 0, false, {
                    fileName: "[project]/src/app/(dashboard)/admin/forbidden.tsx",
                    lineNumber: 211,
                    columnNumber: 199
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/(dashboard)/admin/forbidden.tsx",
                lineNumber: 211,
                columnNumber: 107
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/admin/forbidden.tsx",
            lineNumber: 211,
            columnNumber: 10
        }, this);
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
            className: "text-6xl font-bold text-gray-900 mb-2",
            children: "403"
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/admin/forbidden.tsx",
            lineNumber: 212,
            columnNumber: 10
        }, this);
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
            className: "text-2xl font-semibold text-gray-700 mb-4",
            children: "Administrative Privileges Required"
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/admin/forbidden.tsx",
            lineNumber: 213,
            columnNumber: 10
        }, this);
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "text-gray-600 mb-4",
            children: "You need administrative privileges to access this section of White Cross Healthcare."
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/admin/forbidden.tsx",
            lineNumber: 214,
            columnNumber: 10
        }, this);
        t6 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "text-gray-500 text-sm mb-8",
            children: "Admin access includes system configuration, user management, security settings, and compliance monitoring."
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/admin/forbidden.tsx",
            lineNumber: 215,
            columnNumber: 10
        }, this);
        $[4] = t2;
        $[5] = t3;
        $[6] = t4;
        $[7] = t5;
        $[8] = t6;
    } else {
        t2 = $[4];
        t3 = $[5];
        t4 = $[6];
        t5 = $[7];
        t6 = $[8];
    }
    let t7;
    if ($[9] !== handleRequestAdminAccess) {
        t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            onClick: handleRequestAdminAccess,
            className: "w-full healthcare-button-primary",
            children: "Request Admin Access"
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/admin/forbidden.tsx",
            lineNumber: 230,
            columnNumber: 10
        }, this);
        $[9] = handleRequestAdminAccess;
        $[10] = t7;
    } else {
        t7 = $[10];
    }
    let t8;
    let t9;
    if ($[11] === Symbol.for("react.memo_cache_sentinel")) {
        t8 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            href: "/dashboard",
            className: "block w-full healthcare-button-secondary text-center",
            children: "Go to Dashboard"
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/admin/forbidden.tsx",
            lineNumber: 239,
            columnNumber: 10
        }, this);
        t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            href: "/support",
            className: "block w-full text-sm text-gray-600 hover:text-gray-900 transition-colors",
            children: "Contact Administrator"
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/admin/forbidden.tsx",
            lineNumber: 240,
            columnNumber: 10
        }, this);
        $[11] = t8;
        $[12] = t9;
    } else {
        t8 = $[11];
        t9 = $[12];
    }
    let t10;
    if ($[13] !== t7) {
        t10 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-3",
            children: [
                t7,
                t8,
                t9
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/admin/forbidden.tsx",
            lineNumber: 249,
            columnNumber: 11
        }, this);
        $[13] = t7;
        $[14] = t10;
    } else {
        t10 = $[14];
    }
    let t11;
    if ($[15] === Symbol.for("react.memo_cache_sentinel")) {
        t11 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mt-8 pt-6 border-t border-gray-200",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-xs text-gray-500 mb-2 font-semibold",
                    children: "Security & Compliance"
                }, void 0, false, {
                    fileName: "[project]/src/app/(dashboard)/admin/forbidden.tsx",
                    lineNumber: 257,
                    columnNumber: 63
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-xs text-gray-500",
                    children: "Administrative access is restricted to authorized personnel only. All admin actions are logged for HIPAA compliance and audit purposes."
                }, void 0, false, {
                    fileName: "[project]/src/app/(dashboard)/admin/forbidden.tsx",
                    lineNumber: 257,
                    columnNumber: 148
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/admin/forbidden.tsx",
            lineNumber: 257,
            columnNumber: 11
        }, this);
        $[15] = t11;
    } else {
        t11 = $[15];
    }
    let t12;
    if ($[16] === Symbol.for("react.memo_cache_sentinel")) {
        t12 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "text-xs text-gray-500 mb-2",
            children: "Admin privileges typically include:"
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/admin/forbidden.tsx",
            lineNumber: 264,
            columnNumber: 11
        }, this);
        $[16] = t12;
    } else {
        t12 = $[16];
    }
    let t13;
    if ($[17] === Symbol.for("react.memo_cache_sentinel")) {
        t13 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mt-4 pt-4 border-t border-gray-200",
            children: [
                t12,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                    className: "text-xs text-gray-500 space-y-1",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                            children: "• System configuration and settings"
                        }, void 0, false, {
                            fileName: "[project]/src/app/(dashboard)/admin/forbidden.tsx",
                            lineNumber: 271,
                            columnNumber: 116
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                            children: "• User and role management"
                        }, void 0, false, {
                            fileName: "[project]/src/app/(dashboard)/admin/forbidden.tsx",
                            lineNumber: 271,
                            columnNumber: 160
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                            children: "• Security and access controls"
                        }, void 0, false, {
                            fileName: "[project]/src/app/(dashboard)/admin/forbidden.tsx",
                            lineNumber: 271,
                            columnNumber: 195
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                            children: "• Compliance monitoring and reporting"
                        }, void 0, false, {
                            fileName: "[project]/src/app/(dashboard)/admin/forbidden.tsx",
                            lineNumber: 271,
                            columnNumber: 234
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                            children: "• Audit log access"
                        }, void 0, false, {
                            fileName: "[project]/src/app/(dashboard)/admin/forbidden.tsx",
                            lineNumber: 271,
                            columnNumber: 280
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(dashboard)/admin/forbidden.tsx",
                    lineNumber: 271,
                    columnNumber: 68
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/admin/forbidden.tsx",
            lineNumber: 271,
            columnNumber: 11
        }, this);
        $[17] = t13;
    } else {
        t13 = $[17];
    }
    let t14;
    if ($[18] !== t10) {
        t14 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-gray-50 flex items-center justify-center px-4",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-md w-full bg-white shadow-lg rounded-lg p-8",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-center",
                    children: [
                        t1,
                        t2,
                        t3,
                        t4,
                        t5,
                        t6,
                        t10,
                        t11,
                        t13
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(dashboard)/admin/forbidden.tsx",
                    lineNumber: 278,
                    columnNumber: 157
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/(dashboard)/admin/forbidden.tsx",
                lineNumber: 278,
                columnNumber: 90
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/admin/forbidden.tsx",
            lineNumber: 278,
            columnNumber: 11
        }, this);
        $[18] = t10;
        $[19] = t14;
    } else {
        t14 = $[19];
    }
    return t14;
}
_s(AdminForbidden, "fN7XvhJ+p5oE6+Xlo0NJmXpxjC8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = AdminForbidden;
var _c;
__turbopack_context__.k.register(_c, "AdminForbidden");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_app_%28dashboard%29_admin_forbidden_tsx_d47cf032._.js.map