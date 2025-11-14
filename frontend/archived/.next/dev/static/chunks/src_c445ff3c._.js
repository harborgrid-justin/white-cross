(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/hooks/useReducedMotion.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function useReducedMotion() {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(3);
    if ($[0] !== "970d1c4ccbd1bed503deeb461c6b71557e9685cc7c4a8db78492231b1eb25572") {
        for(let $i = 0; $i < 3; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "970d1c4ccbd1bed503deeb461c6b71557e9685cc7c4a8db78492231b1eb25572";
    }
    const [prefersReducedMotion, setPrefersReducedMotion] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    let t0;
    let t1;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t0 = ({
            "useReducedMotion[useEffect()]": ()=>{
                if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
                ;
                const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
                setPrefersReducedMotion(mediaQuery.matches);
                const handleChange = {
                    "useReducedMotion[useEffect() > handleChange]": (event)=>{
                        setPrefersReducedMotion(event.matches);
                    }
                }["useReducedMotion[useEffect() > handleChange]"];
                if (mediaQuery.addEventListener) {
                    mediaQuery.addEventListener("change", handleChange);
                } else {
                    mediaQuery.addListener(handleChange);
                }
                return ()=>{
                    if (mediaQuery.removeEventListener) {
                        mediaQuery.removeEventListener("change", handleChange);
                    } else {
                        mediaQuery.removeListener(handleChange);
                    }
                };
            }
        })["useReducedMotion[useEffect()]"];
        t1 = [];
        $[1] = t0;
        $[2] = t1;
    } else {
        t0 = $[1];
        t1 = $[2];
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(t0, t1);
    return prefersReducedMotion;
}
_s(useReducedMotion, "c2o+PeDo1dLruq/wbnW+Z6a6rIY=");
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/template.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useReducedMotion$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useReducedMotion.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
/**
 * Inner template component that uses pathname
 */ function TemplateInner(t0) {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(16);
    if ($[0] !== "2678d793668416a4684ba32da0af6691579832bc0ef68e851e6efe33e3a4688d") {
        for(let $i = 0; $i < 16; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "2678d793668416a4684ba32da0af6691579832bc0ef68e851e6efe33e3a4688d";
    }
    const { children } = t0;
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const shouldReduceMotion = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useReducedMotion$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReducedMotion"])();
    const t1 = shouldReduceMotion ? 1 : 0;
    const t2 = shouldReduceMotion ? 0 : 10;
    let t3;
    if ($[1] !== t1 || $[2] !== t2) {
        t3 = {
            opacity: t1,
            y: t2
        };
        $[1] = t1;
        $[2] = t2;
        $[3] = t3;
    } else {
        t3 = $[3];
    }
    let t4;
    if ($[4] === Symbol.for("react.memo_cache_sentinel")) {
        t4 = {
            opacity: 1,
            y: 0
        };
        $[4] = t4;
    } else {
        t4 = $[4];
    }
    const t5 = shouldReduceMotion ? 1 : 0;
    const t6 = shouldReduceMotion ? 0 : -10;
    let t7;
    if ($[5] !== t5 || $[6] !== t6) {
        t7 = {
            opacity: t5,
            y: t6
        };
        $[5] = t5;
        $[6] = t6;
        $[7] = t7;
    } else {
        t7 = $[7];
    }
    let t8;
    if ($[8] !== shouldReduceMotion) {
        t8 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useReducedMotion$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getTransition"])(shouldReduceMotion, 0.2);
        $[8] = shouldReduceMotion;
        $[9] = t8;
    } else {
        t8 = $[9];
    }
    let t9;
    if ($[10] !== children || $[11] !== pathname || $[12] !== t3 || $[13] !== t7 || $[14] !== t8) {
        t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
            mode: "wait",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                initial: t3,
                animate: t4,
                exit: t7,
                transition: t8,
                children: children
            }, pathname, false, {
                fileName: "[project]/src/app/template.tsx",
                lineNumber: 87,
                columnNumber: 39
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/template.tsx",
            lineNumber: 87,
            columnNumber: 10
        }, this);
        $[10] = children;
        $[11] = pathname;
        $[12] = t3;
        $[13] = t7;
        $[14] = t8;
        $[15] = t9;
    } else {
        t9 = $[15];
    }
    return t9;
}
_s(TemplateInner, "CjTF6TI5zg1NsLpwqZNEd2CjDuI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useReducedMotion$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReducedMotion"]
    ];
});
_c = TemplateInner;
function Template(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(4);
    if ($[0] !== "2678d793668416a4684ba32da0af6691579832bc0ef68e851e6efe33e3a4688d") {
        for(let $i = 0; $i < 4; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "2678d793668416a4684ba32da0af6691579832bc0ef68e851e6efe33e3a4688d";
    }
    const { children } = t0;
    let t1;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "animate-pulse min-h-screen bg-gray-50"
        }, void 0, false, {
            fileName: "[project]/src/app/template.tsx",
            lineNumber: 117,
            columnNumber: 10
        }, this);
        $[1] = t1;
    } else {
        t1 = $[1];
    }
    let t2;
    if ($[2] !== children) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Suspense"], {
            fallback: t1,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TemplateInner, {
                children: children
            }, void 0, false, {
                fileName: "[project]/src/app/template.tsx",
                lineNumber: 124,
                columnNumber: 34
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/template.tsx",
            lineNumber: 124,
            columnNumber: 10
        }, this);
        $[2] = children;
        $[3] = t2;
    } else {
        t2 = $[3];
    }
    return t2;
}
_c1 = Template;
var _c, _c1;
__turbopack_context__.k.register(_c, "TemplateInner");
__turbopack_context__.k.register(_c1, "Template");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_c445ff3c._.js.map