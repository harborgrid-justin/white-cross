module.exports = [
"[project]/src/app/loading.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @fileoverview Root Loading State Component
 *
 * Global loading UI that displays while pages are loading during navigation or data fetching.
 * Next.js automatically shows this component inside a Suspense boundary when pages are
 * streaming. Provides a consistent loading experience across the entire application.
 *
 * @module app/loading
 * @category Loading States
 * @subcategory Global
 *
 * **Loading Hierarchy:**
 * ```
 * loading.tsx (this file - shown for all routes without specific loading states)
 * ├── (dashboard)/medications/loading.tsx (medications-specific skeleton)
 * ├── (dashboard)/students/loading.tsx (students-specific skeleton)
 * └── [Other feature loading states...]
 * ```
 *
 * **When This Displays:**
 * - Navigation to a new route
 * - Initial page load with async data
 * - Streaming SSR content
 * - Any Suspense boundary without a closer loading.tsx file
 *
 * **Next.js Streaming:**
 * - Automatically wrapped in React Suspense boundary
 * - Shows while page component is rendering
 * - Replaced by actual page content once ready
 * - Enables streaming Server Side Rendering (SSR)
 *
 * **Accessibility:**
 * - Spinning animation indicates loading state
 * - Text label announces loading to screen readers
 * - High contrast for visibility
 * - Centered for focus
 *
 * @see {@link https://nextjs.org/docs/app/api-reference/file-conventions/loading | Next.js Loading UI}
 * @see {@link https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming | Loading and Streaming}
 *
 * @example
 * ```tsx
 * // Next.js automatically uses this loading state:
 * // When user navigates to a route:
 * router.push('/medications');
 * // Displays: <Loading /> until MedicationsPage is ready
 * ```
 *
 * @returns {JSX.Element} Centered loading spinner with text
 *
 * @since 1.0.0
 */ /**
 * Root Loading Component
 *
 * Displays a centered loading spinner with descriptive text. Uses Tailwind CSS
 * animations for smooth spinner rotation. This is a Server Component that renders
 * synchronously with no client-side JavaScript required.
 *
 * **Visual Design:**
 * - Full-screen light gray background
 * - Centered content (flexbox)
 * - Animated spinner (4px border, 64px size)
 * - Primary brand color (border-t-primary-600)
 * - Smooth spin animation (CSS)
 * - Loading text below spinner
 * - Descriptive subtext
 *
 * **Performance:**
 * - Lightweight, no JS required
 * - CSS-only animation
 * - Fast render time
 * - Minimal layout shift
 *
 * @returns {JSX.Element} Full-screen loading UI
 *
 * @example
 * ```tsx
 * // The rendered structure:
 * <div className="min-h-screen">
 *   <div className="text-center">
 *     <div className="spinner" />
 *     <h2>Loading...</h2>
 *     <p>Please wait while we load your content</p>
 *   </div>
 * </div>
 * ```
 */ __turbopack_context__.s([
    "default",
    ()=>Loading
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
;
function Loading() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-gray-50 flex items-center justify-center",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "text-center",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "inline-block animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-primary-600 mb-4"
                }, void 0, false, {
                    fileName: "[project]/src/app/loading.tsx",
                    lineNumber: 95,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    className: "text-lg font-semibold text-gray-900 mb-2",
                    children: "Loading..."
                }, void 0, false, {
                    fileName: "[project]/src/app/loading.tsx",
                    lineNumber: 98,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-sm text-gray-600",
                    children: "Please wait while we load your content"
                }, void 0, false, {
                    fileName: "[project]/src/app/loading.tsx",
                    lineNumber: 101,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/loading.tsx",
            lineNumber: 93,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/loading.tsx",
        lineNumber: 92,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=src_app_loading_tsx_7fa31b7f._.js.map