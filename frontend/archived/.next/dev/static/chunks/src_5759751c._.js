(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/common/ErrorStates.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Comprehensive Error State Components
 *
 * Provides error UI components for different error scenarios
 * Used in error.tsx files across the application
 */ __turbopack_context__.s([
    "AccessDeniedError",
    ()=>AccessDeniedError,
    "DataNotFoundError",
    ()=>DataNotFoundError,
    "ErrorState",
    ()=>ErrorState,
    "NetworkError",
    ()=>NetworkError,
    "NotFoundError",
    ()=>NotFoundError
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function ErrorState(t0) {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(25);
    if ($[0] !== "56d2d6ecbc58a014fdfc8af4f7c4537796efd0ea2fae7fdfa05d48d02f3f4d7c") {
        for(let $i = 0; $i < 25; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "56d2d6ecbc58a014fdfc8af4f7c4537796efd0ea2fae7fdfa05d48d02f3f4d7c";
    }
    const { error, reset, title: t1, description: t2, showReset: t3, showHome: t4 } = t0;
    const title = t1 === undefined ? "Something went wrong" : t1;
    const description = t2 === undefined ? "An unexpected error occurred. Please try again." : t2;
    const showReset = t3 === undefined ? true : t3;
    const showHome = t4 === undefined ? true : t4;
    let t5;
    let t6;
    if ($[1] !== error) {
        t5 = ({
            "ErrorState[useEffect()]": ()=>{
                console.error("Error boundary caught:", {
                    message: error.message,
                    digest: error.digest,
                    timestamp: new Date().toISOString()
                });
                if (("TURBOPACK compile-time value", "object") !== "undefined" && window.Sentry) {
                    window.Sentry.captureException(error, {
                        tags: {
                            digest: error.digest,
                            component: "ErrorState"
                        }
                    });
                }
            }
        })["ErrorState[useEffect()]"];
        t6 = [
            error
        ];
        $[1] = error;
        $[2] = t5;
        $[3] = t6;
    } else {
        t5 = $[2];
        t6 = $[3];
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(t5, t6);
    let t7;
    if ($[4] === Symbol.for("react.memo_cache_sentinel")) {
        t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                className: "w-8 h-8 text-red-600",
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeWidth: 2,
                    d: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                }, void 0, false, {
                    fileName: "[project]/src/components/common/ErrorStates.tsx",
                    lineNumber: 77,
                    columnNumber: 199
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/common/ErrorStates.tsx",
                lineNumber: 77,
                columnNumber: 107
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/common/ErrorStates.tsx",
            lineNumber: 77,
            columnNumber: 10
        }, this);
        $[4] = t7;
    } else {
        t7 = $[4];
    }
    let t8;
    if ($[5] !== title) {
        t8 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
            className: "text-2xl font-bold text-gray-900 mb-2",
            children: title
        }, void 0, false, {
            fileName: "[project]/src/components/common/ErrorStates.tsx",
            lineNumber: 84,
            columnNumber: 10
        }, this);
        $[5] = title;
        $[6] = t8;
    } else {
        t8 = $[6];
    }
    let t9;
    if ($[7] !== description) {
        t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "text-gray-600 mb-6",
            children: description
        }, void 0, false, {
            fileName: "[project]/src/components/common/ErrorStates.tsx",
            lineNumber: 92,
            columnNumber: 10
        }, this);
        $[7] = description;
        $[8] = t9;
    } else {
        t9 = $[8];
    }
    let t10;
    if ($[9] !== error.digest || $[10] !== error.message) {
        t10 = ("TURBOPACK compile-time value", "development") === "development" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-red-50 border border-red-200 rounded p-3 mb-6 text-left",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-xs font-mono text-red-800 break-all",
                    children: error.message
                }, void 0, false, {
                    fileName: "[project]/src/components/common/ErrorStates.tsx",
                    lineNumber: 100,
                    columnNumber: 129
                }, this),
                error.digest && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-xs text-red-600 mt-1",
                    children: [
                        "ID: ",
                        error.digest
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/common/ErrorStates.tsx",
                    lineNumber: 100,
                    columnNumber: 221
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/common/ErrorStates.tsx",
            lineNumber: 100,
            columnNumber: 53
        }, this);
        $[9] = error.digest;
        $[10] = error.message;
        $[11] = t10;
    } else {
        t10 = $[11];
    }
    let t11;
    if ($[12] !== reset || $[13] !== showReset) {
        t11 = showReset && reset && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            onClick: reset,
            className: "px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors",
            children: "Try Again"
        }, void 0, false, {
            fileName: "[project]/src/components/common/ErrorStates.tsx",
            lineNumber: 109,
            columnNumber: 33
        }, this);
        $[12] = reset;
        $[13] = showReset;
        $[14] = t11;
    } else {
        t11 = $[14];
    }
    let t12;
    if ($[15] !== showHome) {
        t12 = showHome && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            onClick: _ErrorStateButtonOnClick,
            className: "px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors",
            children: "Go to Dashboard"
        }, void 0, false, {
            fileName: "[project]/src/components/common/ErrorStates.tsx",
            lineNumber: 118,
            columnNumber: 23
        }, this);
        $[15] = showHome;
        $[16] = t12;
    } else {
        t12 = $[16];
    }
    let t13;
    if ($[17] !== t11 || $[18] !== t12) {
        t13 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col sm:flex-row gap-3 justify-center",
            children: [
                t11,
                t12
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/common/ErrorStates.tsx",
            lineNumber: 126,
            columnNumber: 11
        }, this);
        $[17] = t11;
        $[18] = t12;
        $[19] = t13;
    } else {
        t13 = $[19];
    }
    let t14;
    if ($[20] !== t10 || $[21] !== t13 || $[22] !== t8 || $[23] !== t9) {
        t14 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-[400px] flex items-center justify-center p-4",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-md w-full",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white rounded-lg shadow-lg p-8 text-center",
                    children: [
                        t7,
                        t8,
                        t9,
                        t10,
                        t13
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/common/ErrorStates.tsx",
                    lineNumber: 135,
                    columnNumber: 112
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/common/ErrorStates.tsx",
                lineNumber: 135,
                columnNumber: 79
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/common/ErrorStates.tsx",
            lineNumber: 135,
            columnNumber: 11
        }, this);
        $[20] = t10;
        $[21] = t13;
        $[22] = t8;
        $[23] = t9;
        $[24] = t14;
    } else {
        t14 = $[24];
    }
    return t14;
}
_s(ErrorState, "OD7bBpZva5O2jO+Puf00hKivP7c=");
_c = ErrorState;
/**
 * 404 Not Found Error
 */ function _ErrorStateButtonOnClick() {
    return window.location.href = "/dashboard";
}
function NotFoundError() {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(6);
    if ($[0] !== "56d2d6ecbc58a014fdfc8af4f7c4537796efd0ea2fae7fdfa05d48d02f3f4d7c") {
        for(let $i = 0; $i < 6; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "56d2d6ecbc58a014fdfc8af4f7c4537796efd0ea2fae7fdfa05d48d02f3f4d7c";
    }
    let t0;
    let t1;
    let t2;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t0 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mb-8",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                    className: "text-9xl font-bold text-blue-600",
                    children: "404"
                }, void 0, false, {
                    fileName: "[project]/src/components/common/ErrorStates.tsx",
                    lineNumber: 165,
                    columnNumber: 32
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "h-1 w-32 bg-blue-600 mx-auto mt-4 rounded-full"
                }, void 0, false, {
                    fileName: "[project]/src/components/common/ErrorStates.tsx",
                    lineNumber: 165,
                    columnNumber: 89
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/common/ErrorStates.tsx",
            lineNumber: 165,
            columnNumber: 10
        }, this);
        t1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
            className: "text-3xl font-bold text-gray-900 mb-4",
            children: "Page Not Found"
        }, void 0, false, {
            fileName: "[project]/src/components/common/ErrorStates.tsx",
            lineNumber: 166,
            columnNumber: 10
        }, this);
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "text-lg text-gray-600 mb-8",
            children: "The page you're looking for doesn't exist or has been moved."
        }, void 0, false, {
            fileName: "[project]/src/components/common/ErrorStates.tsx",
            lineNumber: 167,
            columnNumber: 10
        }, this);
        $[1] = t0;
        $[2] = t1;
        $[3] = t2;
    } else {
        t0 = $[1];
        t1 = $[2];
        t2 = $[3];
    }
    let t3;
    if ($[4] === Symbol.for("react.memo_cache_sentinel")) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col sm:flex-row gap-4 justify-center",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: _NotFoundErrorButtonOnClick,
                    className: "px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-colors",
                    children: "← Go Back"
                }, void 0, false, {
                    fileName: "[project]/src/components/common/ErrorStates.tsx",
                    lineNumber: 178,
                    columnNumber: 74
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                    href: "/dashboard",
                    className: "px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors inline-block",
                    children: "Go to Dashboard"
                }, void 0, false, {
                    fileName: "[project]/src/components/common/ErrorStates.tsx",
                    lineNumber: 178,
                    columnNumber: 247
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/common/ErrorStates.tsx",
            lineNumber: 178,
            columnNumber: 10
        }, this);
        $[4] = t3;
    } else {
        t3 = $[4];
    }
    let t4;
    if ($[5] === Symbol.for("react.memo_cache_sentinel")) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen flex items-center justify-center bg-gray-50 p-4",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-2xl w-full text-center",
                children: [
                    t0,
                    t1,
                    t2,
                    t3,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-12",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            className: "w-64 h-64 mx-auto text-gray-300",
                            fill: "none",
                            stroke: "currentColor",
                            viewBox: "0 0 24 24",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                strokeWidth: 1,
                                d: "M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            }, void 0, false, {
                                fileName: "[project]/src/components/common/ErrorStates.tsx",
                                lineNumber: 185,
                                columnNumber: 276
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/common/ErrorStates.tsx",
                            lineNumber: 185,
                            columnNumber: 173
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/common/ErrorStates.tsx",
                        lineNumber: 185,
                        columnNumber: 150
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/common/ErrorStates.tsx",
                lineNumber: 185,
                columnNumber: 88
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/common/ErrorStates.tsx",
            lineNumber: 185,
            columnNumber: 10
        }, this);
        $[5] = t4;
    } else {
        t4 = $[5];
    }
    return t4;
}
_c1 = NotFoundError;
/**
 * 403 Access Denied Error
 */ function _NotFoundErrorButtonOnClick() {
    return window.history.back();
}
function AccessDeniedError() {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(2);
    if ($[0] !== "56d2d6ecbc58a014fdfc8af4f7c4537796efd0ea2fae7fdfa05d48d02f3f4d7c") {
        for(let $i = 0; $i < 2; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "56d2d6ecbc58a014fdfc8af4f7c4537796efd0ea2fae7fdfa05d48d02f3f4d7c";
    }
    let t0;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t0 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen flex items-center justify-center bg-gray-50 p-4",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-md w-full",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white rounded-lg shadow-lg p-8 text-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mx-auto w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mb-4",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                className: "w-10 h-10 text-yellow-600",
                                fill: "none",
                                stroke: "currentColor",
                                viewBox: "0 0 24 24",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    strokeLinecap: "round",
                                    strokeLinejoin: "round",
                                    strokeWidth: 2,
                                    d: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/common/ErrorStates.tsx",
                                    lineNumber: 209,
                                    columnNumber: 381
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/common/ErrorStates.tsx",
                                lineNumber: 209,
                                columnNumber: 284
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/common/ErrorStates.tsx",
                            lineNumber: 209,
                            columnNumber: 184
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-2xl font-bold text-gray-900 mb-2",
                            children: "Access Denied"
                        }, void 0, false, {
                            fileName: "[project]/src/components/common/ErrorStates.tsx",
                            lineNumber: 209,
                            columnNumber: 567
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-gray-600 mb-6",
                            children: "You don't have permission to access this resource. Please contact your administrator if you believe this is an error."
                        }, void 0, false, {
                            fileName: "[project]/src/components/common/ErrorStates.tsx",
                            lineNumber: 209,
                            columnNumber: 639
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: _AccessDeniedErrorButtonOnClick,
                            className: "w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors",
                            children: "Return to Dashboard"
                        }, void 0, false, {
                            fileName: "[project]/src/components/common/ErrorStates.tsx",
                            lineNumber: 209,
                            columnNumber: 794
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/common/ErrorStates.tsx",
                    lineNumber: 209,
                    columnNumber: 121
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/common/ErrorStates.tsx",
                lineNumber: 209,
                columnNumber: 88
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/common/ErrorStates.tsx",
            lineNumber: 209,
            columnNumber: 10
        }, this);
        $[1] = t0;
    } else {
        t0 = $[1];
    }
    return t0;
}
_c2 = AccessDeniedError;
/**
 * Network/API Error
 */ function _AccessDeniedErrorButtonOnClick() {
    return window.location.href = "/dashboard";
}
function NetworkError(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(8);
    if ($[0] !== "56d2d6ecbc58a014fdfc8af4f7c4537796efd0ea2fae7fdfa05d48d02f3f4d7c") {
        for(let $i = 0; $i < 8; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "56d2d6ecbc58a014fdfc8af4f7c4537796efd0ea2fae7fdfa05d48d02f3f4d7c";
    }
    const { reset } = t0;
    let t1;
    let t2;
    let t3;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                className: "w-8 h-8 text-orange-600",
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeWidth: 2,
                    d: "M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
                }, void 0, false, {
                    fileName: "[project]/src/components/common/ErrorStates.tsx",
                    lineNumber: 238,
                    columnNumber: 205
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/common/ErrorStates.tsx",
                lineNumber: 238,
                columnNumber: 110
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/common/ErrorStates.tsx",
            lineNumber: 238,
            columnNumber: 10
        }, this);
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
            className: "text-2xl font-bold text-gray-900 mb-2",
            children: "Connection Error"
        }, void 0, false, {
            fileName: "[project]/src/components/common/ErrorStates.tsx",
            lineNumber: 239,
            columnNumber: 10
        }, this);
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "text-gray-600 mb-6",
            children: "Unable to connect to the server. Please check your internet connection and try again."
        }, void 0, false, {
            fileName: "[project]/src/components/common/ErrorStates.tsx",
            lineNumber: 240,
            columnNumber: 10
        }, this);
        $[1] = t1;
        $[2] = t2;
        $[3] = t3;
    } else {
        t1 = $[1];
        t2 = $[2];
        t3 = $[3];
    }
    let t4;
    if ($[4] !== reset) {
        t4 = reset && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            onClick: reset,
            className: "w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors",
            children: "Try Again"
        }, void 0, false, {
            fileName: "[project]/src/components/common/ErrorStates.tsx",
            lineNumber: 251,
            columnNumber: 19
        }, this);
        $[4] = reset;
        $[5] = t4;
    } else {
        t4 = $[5];
    }
    let t5;
    if ($[6] !== t4) {
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-[400px] flex items-center justify-center p-4",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-md w-full text-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white rounded-lg shadow-lg p-8",
                    children: [
                        t1,
                        t2,
                        t3,
                        t4
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/common/ErrorStates.tsx",
                    lineNumber: 259,
                    columnNumber: 123
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/common/ErrorStates.tsx",
                lineNumber: 259,
                columnNumber: 78
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/common/ErrorStates.tsx",
            lineNumber: 259,
            columnNumber: 10
        }, this);
        $[6] = t4;
        $[7] = t5;
    } else {
        t5 = $[7];
    }
    return t5;
}
_c3 = NetworkError;
function DataNotFoundError(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(10);
    if ($[0] !== "56d2d6ecbc58a014fdfc8af4f7c4537796efd0ea2fae7fdfa05d48d02f3f4d7c") {
        for(let $i = 0; $i < 10; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "56d2d6ecbc58a014fdfc8af4f7c4537796efd0ea2fae7fdfa05d48d02f3f4d7c";
    }
    const { message: t1, actionLabel, onAction } = t0;
    const message = t1 === undefined ? "No data found" : t1;
    let t2;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                className: "w-8 h-8 text-gray-400",
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeWidth: 2,
                    d: "M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                }, void 0, false, {
                    fileName: "[project]/src/components/common/ErrorStates.tsx",
                    lineNumber: 287,
                    columnNumber: 201
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/common/ErrorStates.tsx",
                lineNumber: 287,
                columnNumber: 108
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/common/ErrorStates.tsx",
            lineNumber: 287,
            columnNumber: 10
        }, this);
        $[1] = t2;
    } else {
        t2 = $[1];
    }
    let t3;
    if ($[2] !== message) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "text-lg text-gray-600 mb-4",
            children: message
        }, void 0, false, {
            fileName: "[project]/src/components/common/ErrorStates.tsx",
            lineNumber: 294,
            columnNumber: 10
        }, this);
        $[2] = message;
        $[3] = t3;
    } else {
        t3 = $[3];
    }
    let t4;
    if ($[4] !== actionLabel || $[5] !== onAction) {
        t4 = actionLabel && onAction && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            onClick: onAction,
            className: "px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors",
            children: actionLabel
        }, void 0, false, {
            fileName: "[project]/src/components/common/ErrorStates.tsx",
            lineNumber: 302,
            columnNumber: 37
        }, this);
        $[4] = actionLabel;
        $[5] = onAction;
        $[6] = t4;
    } else {
        t4 = $[6];
    }
    let t5;
    if ($[7] !== t3 || $[8] !== t4) {
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-[300px] flex items-center justify-center p-4",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center",
                children: [
                    t2,
                    t3,
                    t4
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/common/ErrorStates.tsx",
                lineNumber: 311,
                columnNumber: 78
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/common/ErrorStates.tsx",
            lineNumber: 311,
            columnNumber: 10
        }, this);
        $[7] = t3;
        $[8] = t4;
        $[9] = t5;
    } else {
        t5 = $[9];
    }
    return t5;
}
_c4 = DataNotFoundError;
var _c, _c1, _c2, _c3, _c4;
__turbopack_context__.k.register(_c, "ErrorState");
__turbopack_context__.k.register(_c1, "NotFoundError");
__turbopack_context__.k.register(_c2, "AccessDeniedError");
__turbopack_context__.k.register(_c3, "NetworkError");
__turbopack_context__.k.register(_c4, "DataNotFoundError");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/(dashboard)/immunizations/compliance/error.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ComplianceDashboardError
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$ErrorStates$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/common/ErrorStates.tsx [app-client] (ecmascript)");
'use client';
;
;
;
function ComplianceDashboardError(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(4);
    if ($[0] !== "424ff2e4b0cc1bf26022e1289a839feff9704503d3e6024baf59efb90e44b629") {
        for(let $i = 0; $i < 4; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "424ff2e4b0cc1bf26022e1289a839feff9704503d3e6024baf59efb90e44b629";
    }
    const { error, reset } = t0;
    let t1;
    if ($[1] !== error || $[2] !== reset) {
        t1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$ErrorStates$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ErrorState"], {
            error: error,
            reset: reset,
            title: "Failed to Load Compliance Dashboard",
            description: "An error occurred while loading compliance data."
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/immunizations/compliance/error.tsx",
            lineNumber: 19,
            columnNumber: 10
        }, this);
        $[1] = error;
        $[2] = reset;
        $[3] = t1;
    } else {
        t1 = $[3];
    }
    return t1;
}
_c = ComplianceDashboardError;
var _c;
__turbopack_context__.k.register(_c, "ComplianceDashboardError");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_5759751c._.js.map