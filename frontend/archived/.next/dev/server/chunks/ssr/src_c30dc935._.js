module.exports = [
"[project]/src/hooks/useReducedMotion.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * useReducedMotion Hook
 *
 * Detects if the user has requested reduced motion via their OS settings.
 * Respects the prefers-reduced-motion media query for accessibility.
 *
 * @returns {boolean} True if reduced motion is preferred, false otherwise
 *
 * @example
 * ```tsx
 * const shouldReduceMotion = useReducedMotion();
 *
 * <motion.div
 *   animate={{ opacity: 1 }}
 *   transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
 * />
 * ```
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
 * @wcag WCAG 2.1 Level AAA - 2.3.3 Animation from Interactions
 */ __turbopack_context__.s([
    "getAnimationVariants",
    ()=>getAnimationVariants,
    "getTransition",
    ()=>getTransition,
    "useReducedMotion",
    ()=>useReducedMotion
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
function useReducedMotion() {
    const [prefersReducedMotion, setPrefersReducedMotion] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // Check if we're in a browser environment
        if ("TURBOPACK compile-time truthy", 1) {
            return;
        }
        //TURBOPACK unreachable
        ;
        // Create media query
        const mediaQuery = undefined;
        // Handler for when preference changes
        const handleChange = undefined;
    }, []);
    return prefersReducedMotion;
}
function getTransition(shouldReduceMotion, defaultDuration = 0.3) {
    return {
        duration: shouldReduceMotion ? 0.01 : defaultDuration,
        ease: shouldReduceMotion ? 'linear' : 'easeInOut'
    };
}
function getAnimationVariants(shouldReduceMotion) {
    const instant = shouldReduceMotion ? 0.01 : 0;
    return {
        fade: {
            initial: {
                opacity: shouldReduceMotion ? 1 : 0
            },
            animate: {
                opacity: 1
            },
            exit: {
                opacity: shouldReduceMotion ? 1 : 0
            }
        },
        slideUp: {
            initial: {
                opacity: shouldReduceMotion ? 1 : 0,
                y: shouldReduceMotion ? 0 : 10
            },
            animate: {
                opacity: 1,
                y: 0
            },
            exit: {
                opacity: shouldReduceMotion ? 1 : 0,
                y: shouldReduceMotion ? 0 : -10
            }
        },
        scale: {
            initial: {
                opacity: shouldReduceMotion ? 1 : 0,
                scale: shouldReduceMotion ? 1 : 0.95
            },
            animate: {
                opacity: 1,
                scale: 1
            },
            exit: {
                opacity: shouldReduceMotion ? 1 : 0,
                scale: shouldReduceMotion ? 1 : 0.95
            }
        }
    };
}
}),
"[project]/src/app/template.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Root Template Component
 *
 * Re-renders on every navigation (unlike layout.tsx which persists)
 * Use for animations, transitions, or resetting state on navigation
 *
 * Respects prefers-reduced-motion for accessibility (WCAG 2.1 AAA - 2.3.3)
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/template
 */ __turbopack_context__.s([
    "default",
    ()=>Template
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useReducedMotion$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useReducedMotion.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
/**
 * Inner template component that uses pathname
 */ function TemplateInner({ children }) {
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    const shouldReduceMotion = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useReducedMotion$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useReducedMotion"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AnimatePresence"], {
        mode: "wait",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
            initial: {
                opacity: shouldReduceMotion ? 1 : 0,
                y: shouldReduceMotion ? 0 : 10
            },
            animate: {
                opacity: 1,
                y: 0
            },
            exit: {
                opacity: shouldReduceMotion ? 1 : 0,
                y: shouldReduceMotion ? 0 : -10
            },
            transition: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useReducedMotion$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getTransition"])(shouldReduceMotion, 0.2),
            children: children
        }, pathname, false, {
            fileName: "[project]/src/app/template.tsx",
            lineNumber: 32,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/template.tsx",
        lineNumber: 31,
        columnNumber: 5
    }, this);
}
function Template({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Suspense"], {
        fallback: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "animate-pulse min-h-screen bg-gray-50"
        }, void 0, false, {
            fileName: "[project]/src/app/template.tsx",
            lineNumber: 51,
            columnNumber: 25
        }, void 0),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(TemplateInner, {
            children: children
        }, void 0, false, {
            fileName: "[project]/src/app/template.tsx",
            lineNumber: 52,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/template.tsx",
        lineNumber: 51,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=src_c30dc935._.js.map