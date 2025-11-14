(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/ui/skeleton.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Skeleton",
    ()=>Skeleton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
function Skeleton(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(9);
    if ($[0] !== "adfe62a1ba9c0395d8b5ce17cf46dd47738a58b6de7428082271c28ec6c6be3a") {
        for(let $i = 0; $i < 9; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "adfe62a1ba9c0395d8b5ce17cf46dd47738a58b6de7428082271c28ec6c6be3a";
    }
    let className;
    let props;
    if ($[1] !== t0) {
        ({ className, ...props } = t0);
        $[1] = t0;
        $[2] = className;
        $[3] = props;
    } else {
        className = $[2];
        props = $[3];
    }
    let t1;
    if ($[4] !== className) {
        t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("animate-pulse rounded-md bg-primary/10", className);
        $[4] = className;
        $[5] = t1;
    } else {
        t1 = $[5];
    }
    let t2;
    if ($[6] !== props || $[7] !== t1) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: t1,
            ...props
        }, void 0, false, {
            fileName: "[project]/src/components/ui/skeleton.tsx",
            lineNumber: 37,
            columnNumber: 10
        }, this);
        $[6] = props;
        $[7] = t1;
        $[8] = t2;
    } else {
        t2 = $[8];
    }
    return t2;
}
_c = Skeleton;
;
var _c;
__turbopack_context__.k.register(_c, "Skeleton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/card.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Card",
    ()=>Card,
    "CardContent",
    ()=>CardContent,
    "CardDescription",
    ()=>CardDescription,
    "CardFooter",
    ()=>CardFooter,
    "CardHeader",
    ()=>CardHeader,
    "CardTitle",
    ()=>CardTitle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
const Card = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("rounded-xl border bg-card text-card-foreground shadow", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/card.tsx",
        lineNumber: 11,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c1 = Card;
Card.displayName = "Card";
const CardHeader = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c2 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-col space-y-1.5 p-6", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/card.tsx",
        lineNumber: 26,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c3 = CardHeader;
CardHeader.displayName = "CardHeader";
const CardTitle = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c4 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("font-semibold leading-none tracking-tight", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/card.tsx",
        lineNumber: 38,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c5 = CardTitle;
CardTitle.displayName = "CardTitle";
const CardDescription = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c6 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-sm text-muted-foreground", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/card.tsx",
        lineNumber: 50,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c7 = CardDescription;
CardDescription.displayName = "CardDescription";
const CardContent = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c8 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("p-6 pt-0", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/card.tsx",
        lineNumber: 62,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c9 = CardContent;
CardContent.displayName = "CardContent";
const CardFooter = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c10 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex items-center p-6 pt-0", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/card.tsx",
        lineNumber: 70,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c11 = CardFooter;
CardFooter.displayName = "CardFooter";
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9, _c10, _c11;
__turbopack_context__.k.register(_c, "Card$React.forwardRef");
__turbopack_context__.k.register(_c1, "Card");
__turbopack_context__.k.register(_c2, "CardHeader$React.forwardRef");
__turbopack_context__.k.register(_c3, "CardHeader");
__turbopack_context__.k.register(_c4, "CardTitle$React.forwardRef");
__turbopack_context__.k.register(_c5, "CardTitle");
__turbopack_context__.k.register(_c6, "CardDescription$React.forwardRef");
__turbopack_context__.k.register(_c7, "CardDescription");
__turbopack_context__.k.register(_c8, "CardContent$React.forwardRef");
__turbopack_context__.k.register(_c9, "CardContent");
__turbopack_context__.k.register(_c10, "CardFooter$React.forwardRef");
__turbopack_context__.k.register(_c11, "CardFooter");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/button.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Button",
    ()=>Button,
    "buttonVariants",
    ()=>buttonVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-slot/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
;
const buttonVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
    variants: {
        variant: {
            default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
            destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
            outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
            secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
            ghost: "hover:bg-accent hover:text-accent-foreground",
            link: "text-primary underline-offset-4 hover:underline"
        },
        size: {
            default: "h-9 px-4 py-2",
            sm: "h-8 rounded-md px-3 text-xs",
            lg: "h-10 rounded-md px-8",
            icon: "h-9 w-9",
            "icon-sm": "size-8",
            "icon-lg": "size-10"
        }
    },
    defaultVariants: {
        variant: "default",
        size: "default"
    }
});
const Button = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = ({ className, variant, size, asChild = false, ...props }, ref)=>{
    const Comp = asChild ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Slot"] : "button";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Comp, {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(buttonVariants({
            variant,
            size,
            className
        })),
        ref: ref,
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/button.tsx",
        lineNumber: 51,
        columnNumber: 7
    }, ("TURBOPACK compile-time value", void 0));
});
_c1 = Button;
Button.displayName = "Button";
;
var _c, _c1;
__turbopack_context__.k.register(_c, "Button$React.forwardRef");
__turbopack_context__.k.register(_c1, "Button");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/badge.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Badge",
    ()=>Badge,
    "badgeVariants",
    ()=>badgeVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
const badgeVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])("inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", {
    variants: {
        variant: {
            default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
            secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
            destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
            outline: "text-foreground",
            success: "border-transparent bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-100",
            warning: "border-transparent bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-100",
            error: "border-transparent bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900 dark:text-red-100",
            info: "border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-100"
        }
    },
    defaultVariants: {
        variant: "default"
    }
});
function Badge(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(11);
    if ($[0] !== "6fd653eada5b85614b2f6b6a54ddf01b59d3ef48adc110d8d1e00d36693c37c2") {
        for(let $i = 0; $i < 11; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "6fd653eada5b85614b2f6b6a54ddf01b59d3ef48adc110d8d1e00d36693c37c2";
    }
    let className;
    let props;
    let variant;
    if ($[1] !== t0) {
        ({ className, variant, ...props } = t0);
        $[1] = t0;
        $[2] = className;
        $[3] = props;
        $[4] = variant;
    } else {
        className = $[2];
        props = $[3];
        variant = $[4];
    }
    let t1;
    if ($[5] !== className || $[6] !== variant) {
        t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(badgeVariants({
            variant
        }), className);
        $[5] = className;
        $[6] = variant;
        $[7] = t1;
    } else {
        t1 = $[7];
    }
    let t2;
    if ($[8] !== props || $[9] !== t1) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: t1,
            ...props
        }, void 0, false, {
            fileName: "[project]/src/components/ui/badge.tsx",
            lineNumber: 64,
            columnNumber: 10
        }, this);
        $[8] = props;
        $[9] = t1;
        $[10] = t2;
    } else {
        t2 = $[10];
    }
    return t2;
}
_c = Badge;
;
var _c;
__turbopack_context__.k.register(_c, "Badge");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/(dashboard)/admin/_components/sidebar/utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @fileoverview Admin Sidebar Utilities - Helper functions for sidebar components
 * @module app/(dashboard)/admin/_components/sidebar/utils
 * @category Admin - Utils
 */ /**
 * Get color class for status indicator
 */ __turbopack_context__.s([
    "getActivityBackgroundColor",
    ()=>getActivityBackgroundColor,
    "getActivityIconColor",
    ()=>getActivityIconColor,
    "getActivityTextColor",
    ()=>getActivityTextColor,
    "getAlertBackgroundColor",
    ()=>getAlertBackgroundColor,
    "getAlertIconColor",
    ()=>getAlertIconColor,
    "getAlertTextColor",
    ()=>getAlertTextColor,
    "getMetricStatusColor",
    ()=>getMetricStatusColor,
    "getStatusBadgeVariant",
    ()=>getStatusBadgeVariant,
    "getStatusColor",
    ()=>getStatusColor
]);
function getStatusColor(status) {
    switch(status){
        case 'success':
            return 'text-green-600';
        case 'warning':
            return 'text-yellow-600';
        case 'error':
            return 'text-red-600';
        case 'active':
            return 'text-blue-600';
        default:
            return 'text-gray-600';
    }
}
function getStatusBadgeVariant(status) {
    switch(status){
        case 'success':
            return 'success';
        case 'warning':
            return 'warning';
        case 'error':
            return 'danger';
        case 'active':
            return 'info';
        default:
            return 'secondary';
    }
}
function getMetricStatusColor(status) {
    switch(status){
        case 'normal':
            return 'text-green-600';
        case 'warning':
            return 'text-yellow-600';
        case 'critical':
            return 'text-red-600';
        default:
            return 'text-gray-600';
    }
}
function getAlertBackgroundColor(type) {
    switch(type){
        case 'error':
            return 'bg-red-50';
        case 'warning':
            return 'bg-yellow-50';
        case 'info':
            return 'bg-blue-50';
        default:
            return 'bg-gray-50';
    }
}
function getAlertTextColor(type) {
    switch(type){
        case 'error':
            return 'text-red-900';
        case 'warning':
            return 'text-yellow-900';
        case 'info':
            return 'text-blue-900';
        default:
            return 'text-gray-900';
    }
}
function getAlertIconColor(type) {
    switch(type){
        case 'error':
            return 'text-red-600';
        case 'warning':
            return 'text-yellow-600';
        case 'info':
            return 'text-blue-600';
        default:
            return 'text-gray-600';
    }
}
function getActivityBackgroundColor(type) {
    switch(type){
        case 'success':
            return 'bg-green-50';
        case 'info':
            return 'bg-blue-50';
        case 'warning':
            return 'bg-purple-50';
        default:
            return 'bg-gray-50';
    }
}
function getActivityTextColor(type) {
    switch(type){
        case 'success':
            return 'text-green-900';
        case 'info':
            return 'text-blue-900';
        case 'warning':
            return 'text-purple-900';
        default:
            return 'text-gray-900';
    }
}
function getActivityIconColor(type) {
    switch(type){
        case 'success':
            return 'text-green-600';
        case 'info':
            return 'text-blue-600';
        case 'warning':
            return 'text-purple-600';
        default:
            return 'text-gray-600';
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/(dashboard)/admin/_components/sidebar/AdminNavigationMenu.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @fileoverview Admin Navigation Menu - Primary navigation for admin modules
 * @module app/(dashboard)/admin/_components/sidebar/AdminNavigationMenu
 * @category Admin - Components
 */ __turbopack_context__.s([
    "AdminNavigationMenu",
    ()=>AdminNavigationMenu
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/badge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shield.js [app-client] (ecmascript) <export default as Shield>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$dashboard$292f$admin$2f$_components$2f$sidebar$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/(dashboard)/admin/_components/sidebar/utils.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
function AdminNavigationMenu(t0) {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(19);
    if ($[0] !== "81b7bae2a8c05e589e40eaa3f245fc97413e7628013bf0ae429b83cacac30452") {
        for(let $i = 0; $i < 19; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "81b7bae2a8c05e589e40eaa3f245fc97413e7628013bf0ae429b83cacac30452";
    }
    const { modules, isExpanded, onToggle, onNavigate, className: t1 } = t0;
    const className = t1 === undefined ? "" : t1;
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    let t2;
    if ($[1] !== onNavigate) {
        t2 = ({
            "AdminNavigationMenu[handleModuleClick]": (module)=>{
                if (onNavigate) {
                    onNavigate(module.href);
                } else {
                    console.log("Navigate to:", module.href);
                }
            }
        })["AdminNavigationMenu[handleModuleClick]"];
        $[1] = onNavigate;
        $[2] = t2;
    } else {
        t2 = $[2];
    }
    const handleModuleClick = t2;
    let t3;
    if ($[3] === Symbol.for("react.memo_cache_sentinel")) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
            className: "text-sm font-semibold text-gray-900 flex items-center",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__["Shield"], {
                    className: "h-4 w-4 mr-2 text-blue-600"
                }, void 0, false, {
                    fileName: "[project]/src/app/(dashboard)/admin/_components/sidebar/AdminNavigationMenu.tsx",
                    lineNumber: 75,
                    columnNumber: 80
                }, this),
                "Admin Modules"
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/admin/_components/sidebar/AdminNavigationMenu.tsx",
            lineNumber: 75,
            columnNumber: 10
        }, this);
        $[3] = t3;
    } else {
        t3 = $[3];
    }
    const t4 = isExpanded ? "Collapse" : "Expand";
    const t5 = isExpanded ? "\u2212" : "+";
    let t6;
    if ($[4] !== t4 || $[5] !== t5) {
        t6 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
            variant: "ghost",
            size: "sm",
            "aria-label": t4,
            children: t5
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/admin/_components/sidebar/AdminNavigationMenu.tsx",
            lineNumber: 84,
            columnNumber: 10
        }, this);
        $[4] = t4;
        $[5] = t5;
        $[6] = t6;
    } else {
        t6 = $[6];
    }
    let t7;
    if ($[7] !== onToggle || $[8] !== t6) {
        t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "px-4 py-3 border-b border-gray-200 cursor-pointer flex items-center justify-between",
            onClick: onToggle,
            children: [
                t3,
                t6
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/admin/_components/sidebar/AdminNavigationMenu.tsx",
            lineNumber: 93,
            columnNumber: 10
        }, this);
        $[7] = onToggle;
        $[8] = t6;
        $[9] = t7;
    } else {
        t7 = $[9];
    }
    let t8;
    if ($[10] !== handleModuleClick || $[11] !== isExpanded || $[12] !== modules || $[13] !== pathname) {
        t8 = isExpanded && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "p-4",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-2",
                children: modules.map({
                    "AdminNavigationMenu[modules.map()]": (module_0)=>{
                        const Icon = module_0.icon;
                        const isActive = pathname === module_0.href || pathname.startsWith(`${module_0.href}/`);
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            onClick: {
                                "AdminNavigationMenu[modules.map() > <div>.onClick]": ()=>handleModuleClick(module_0)
                            }["AdminNavigationMenu[modules.map() > <div>.onClick]"],
                            className: `
                    flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all
                    ${isActive ? "bg-blue-50 border border-blue-200" : "hover:bg-gray-50 border border-transparent"}
                  `,
                            role: "button",
                            tabIndex: 0,
                            onKeyDown: {
                                "AdminNavigationMenu[modules.map() > <div>.onKeyDown]": (e)=>{
                                    if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        handleModuleClick(module_0);
                                    }
                                }
                            }["AdminNavigationMenu[modules.map() > <div>.onKeyDown]"],
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                    className: `h-5 w-5 mt-0.5 ${isActive ? "text-blue-600" : (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$dashboard$292f$admin$2f$_components$2f$sidebar$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getStatusColor"])(module_0.status)}`,
                                    "aria-hidden": "true"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(dashboard)/admin/_components/sidebar/AdminNavigationMenu.tsx",
                                    lineNumber: 118,
                                    columnNumber: 72
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex-1 min-w-0",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center justify-between mb-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: `text-sm font-medium ${isActive ? "text-blue-900" : "text-gray-900"} truncate`,
                                                    children: module_0.name
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(dashboard)/admin/_components/sidebar/AdminNavigationMenu.tsx",
                                                    lineNumber: 118,
                                                    columnNumber: 280
                                                }, this),
                                                module_0.count !== undefined && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                    variant: isActive ? "info" : (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$dashboard$292f$admin$2f$_components$2f$sidebar$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getStatusBadgeVariant"])(module_0.status),
                                                    className: "text-xs ml-2",
                                                    children: module_0.count
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(dashboard)/admin/_components/sidebar/AdminNavigationMenu.tsx",
                                                    lineNumber: 118,
                                                    columnNumber: 426
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/(dashboard)/admin/_components/sidebar/AdminNavigationMenu.tsx",
                                            lineNumber: 118,
                                            columnNumber: 224
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: `text-xs ${isActive ? "text-blue-700" : "text-gray-600"}`,
                                            children: module_0.description
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(dashboard)/admin/_components/sidebar/AdminNavigationMenu.tsx",
                                            lineNumber: 118,
                                            columnNumber: 558
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/(dashboard)/admin/_components/sidebar/AdminNavigationMenu.tsx",
                                    lineNumber: 118,
                                    columnNumber: 192
                                }, this)
                            ]
                        }, module_0.id, true, {
                            fileName: "[project]/src/app/(dashboard)/admin/_components/sidebar/AdminNavigationMenu.tsx",
                            lineNumber: 106,
                            columnNumber: 20
                        }, this);
                    }
                }["AdminNavigationMenu[modules.map()]"])
            }, void 0, false, {
                fileName: "[project]/src/app/(dashboard)/admin/_components/sidebar/AdminNavigationMenu.tsx",
                lineNumber: 102,
                columnNumber: 45
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/admin/_components/sidebar/AdminNavigationMenu.tsx",
            lineNumber: 102,
            columnNumber: 24
        }, this);
        $[10] = handleModuleClick;
        $[11] = isExpanded;
        $[12] = modules;
        $[13] = pathname;
        $[14] = t8;
    } else {
        t8 = $[14];
    }
    let t9;
    if ($[15] !== className || $[16] !== t7 || $[17] !== t8) {
        t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
            className: className,
            children: [
                t7,
                t8
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/admin/_components/sidebar/AdminNavigationMenu.tsx",
            lineNumber: 131,
            columnNumber: 10
        }, this);
        $[15] = className;
        $[16] = t7;
        $[17] = t8;
        $[18] = t9;
    } else {
        t9 = $[18];
    }
    return t9;
}
_s(AdminNavigationMenu, "xbyQPtUVMO7MNj7WjJlpdWqRcTo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = AdminNavigationMenu;
var _c;
__turbopack_context__.k.register(_c, "AdminNavigationMenu");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/(dashboard)/admin/_components/sidebar/SystemStatusWidget.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @fileoverview System Status Widget - Real-time system metrics display
 * @module app/(dashboard)/admin/_components/sidebar/SystemStatusWidget
 * @category Admin - Components
 */ __turbopack_context__.s([
    "SystemStatusWidget",
    ()=>SystemStatusWidget
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/activity.js [app-client] (ecmascript) <export default as Activity>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/refresh-cw.js [app-client] (ecmascript) <export default as RefreshCw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$dashboard$292f$admin$2f$_components$2f$sidebar$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/(dashboard)/admin/_components/sidebar/utils.ts [app-client] (ecmascript)");
'use client';
;
;
;
;
;
;
function SystemStatusWidget(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(20);
    if ($[0] !== "53d16566d6939f627c8c3525586431905f2d91983ce8efc9792cf2bbdd0f5b15") {
        for(let $i = 0; $i < 20; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "53d16566d6939f627c8c3525586431905f2d91983ce8efc9792cf2bbdd0f5b15";
    }
    const { metrics, isExpanded, onToggle, onRefresh, isRefreshing: t1, className: t2 } = t0;
    const isRefreshing = t1 === undefined ? false : t1;
    const className = t2 === undefined ? "" : t2;
    let t3;
    if ($[1] !== isRefreshing || $[2] !== onRefresh) {
        t3 = ({
            "SystemStatusWidget[handleRefresh]": ()=>{
                if (onRefresh && !isRefreshing) {
                    onRefresh();
                }
            }
        })["SystemStatusWidget[handleRefresh]"];
        $[1] = isRefreshing;
        $[2] = onRefresh;
        $[3] = t3;
    } else {
        t3 = $[3];
    }
    const handleRefresh = t3;
    let t4;
    if ($[4] === Symbol.for("react.memo_cache_sentinel")) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
            className: "text-sm font-semibold text-gray-900 flex items-center",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__["Activity"], {
                    className: "h-4 w-4 mr-2 text-green-600"
                }, void 0, false, {
                    fileName: "[project]/src/app/(dashboard)/admin/_components/sidebar/SystemStatusWidget.tsx",
                    lineNumber: 80,
                    columnNumber: 80
                }, this),
                "System Metrics"
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/admin/_components/sidebar/SystemStatusWidget.tsx",
            lineNumber: 80,
            columnNumber: 10
        }, this);
        $[4] = t4;
    } else {
        t4 = $[4];
    }
    const t5 = isExpanded ? "Collapse" : "Expand";
    const t6 = isExpanded ? "\u2212" : "+";
    let t7;
    if ($[5] !== t5 || $[6] !== t6) {
        t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
            variant: "ghost",
            size: "sm",
            "aria-label": t5,
            children: t6
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/admin/_components/sidebar/SystemStatusWidget.tsx",
            lineNumber: 89,
            columnNumber: 10
        }, this);
        $[5] = t5;
        $[6] = t6;
        $[7] = t7;
    } else {
        t7 = $[7];
    }
    let t8;
    if ($[8] !== onToggle || $[9] !== t7) {
        t8 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "px-4 py-3 border-b border-gray-200 cursor-pointer flex items-center justify-between",
            onClick: onToggle,
            children: [
                t4,
                t7
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/admin/_components/sidebar/SystemStatusWidget.tsx",
            lineNumber: 98,
            columnNumber: 10
        }, this);
        $[8] = onToggle;
        $[9] = t7;
        $[10] = t8;
    } else {
        t8 = $[10];
    }
    let t9;
    if ($[11] !== handleRefresh || $[12] !== isExpanded || $[13] !== isRefreshing || $[14] !== metrics) {
        t9 = isExpanded && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "p-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-3",
                    children: metrics.map(_SystemStatusWidgetMetricsMap)
                }, void 0, false, {
                    fileName: "[project]/src/app/(dashboard)/admin/_components/sidebar/SystemStatusWidget.tsx",
                    lineNumber: 107,
                    columnNumber: 45
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-4 pt-4 border-t border-gray-200",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                        variant: "ghost",
                        size: "sm",
                        className: "w-full text-xs",
                        onClick: handleRefresh,
                        disabled: isRefreshing,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                                className: `h-3 w-3 mr-2 ${isRefreshing ? "animate-spin" : ""}`
                            }, void 0, false, {
                                fileName: "[project]/src/app/(dashboard)/admin/_components/sidebar/SystemStatusWidget.tsx",
                                lineNumber: 107,
                                columnNumber: 283
                            }, this),
                            isRefreshing ? "Refreshing..." : "Refresh Metrics"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/(dashboard)/admin/_components/sidebar/SystemStatusWidget.tsx",
                        lineNumber: 107,
                        columnNumber: 174
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/(dashboard)/admin/_components/sidebar/SystemStatusWidget.tsx",
                    lineNumber: 107,
                    columnNumber: 122
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/admin/_components/sidebar/SystemStatusWidget.tsx",
            lineNumber: 107,
            columnNumber: 24
        }, this);
        $[11] = handleRefresh;
        $[12] = isExpanded;
        $[13] = isRefreshing;
        $[14] = metrics;
        $[15] = t9;
    } else {
        t9 = $[15];
    }
    let t10;
    if ($[16] !== className || $[17] !== t8 || $[18] !== t9) {
        t10 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
            className: className,
            children: [
                t8,
                t9
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/admin/_components/sidebar/SystemStatusWidget.tsx",
            lineNumber: 118,
            columnNumber: 11
        }, this);
        $[16] = className;
        $[17] = t8;
        $[18] = t9;
        $[19] = t10;
    } else {
        t10 = $[19];
    }
    return t10;
}
_c = SystemStatusWidget;
function _SystemStatusWidgetMetricsMap(metric, index) {
    const Icon = metric.icon;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center justify-between p-2 bg-gray-50 rounded-lg",
        role: "status",
        "aria-label": `${metric.label}: ${metric.value}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                        className: `h-4 w-4 ${metric.color}`,
                        "aria-hidden": "true"
                    }, void 0, false, {
                        fileName: "[project]/src/app/(dashboard)/admin/_components/sidebar/SystemStatusWidget.tsx",
                        lineNumber: 130,
                        columnNumber: 202
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-xs font-medium text-gray-900",
                            children: metric.label
                        }, void 0, false, {
                            fileName: "[project]/src/app/(dashboard)/admin/_components/sidebar/SystemStatusWidget.tsx",
                            lineNumber: 130,
                            columnNumber: 272
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/(dashboard)/admin/_components/sidebar/SystemStatusWidget.tsx",
                        lineNumber: 130,
                        columnNumber: 267
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/(dashboard)/admin/_components/sidebar/SystemStatusWidget.tsx",
                lineNumber: 130,
                columnNumber: 161
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-right",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: `text-sm font-bold ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$dashboard$292f$admin$2f$_components$2f$sidebar$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getMetricStatusColor"])(metric.status)}`,
                    children: metric.value
                }, void 0, false, {
                    fileName: "[project]/src/app/(dashboard)/admin/_components/sidebar/SystemStatusWidget.tsx",
                    lineNumber: 130,
                    columnNumber: 379
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/(dashboard)/admin/_components/sidebar/SystemStatusWidget.tsx",
                lineNumber: 130,
                columnNumber: 351
            }, this)
        ]
    }, index, true, {
        fileName: "[project]/src/app/(dashboard)/admin/_components/sidebar/SystemStatusWidget.tsx",
        lineNumber: 130,
        columnNumber: 10
    }, this);
}
var _c;
__turbopack_context__.k.register(_c, "SystemStatusWidget");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/(dashboard)/admin/_components/sidebar/SystemAlertsPanel.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @fileoverview System Alerts Panel - Display system alerts and warnings
 * @module app/(dashboard)/admin/_components/sidebar/SystemAlertsPanel
 * @category Admin - Components
 */ __turbopack_context__.s([
    "SystemAlertsPanel",
    ()=>SystemAlertsPanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/badge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-client] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$dashboard$292f$admin$2f$_components$2f$sidebar$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/(dashboard)/admin/_components/sidebar/utils.ts [app-client] (ecmascript)");
'use client';
;
;
;
;
;
;
;
function SystemAlertsPanel(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(25);
    if ($[0] !== "9ae8e1699df6ddbe8f84fa649418b3c390302118a0b90eb184bb464c44b2990f") {
        for(let $i = 0; $i < 25; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "9ae8e1699df6ddbe8f84fa649418b3c390302118a0b90eb184bb464c44b2990f";
    }
    const { alerts, isExpanded, onToggle, onViewAll, className: t1 } = t0;
    const className = t1 === undefined ? "" : t1;
    const alertCount = alerts.length;
    let t2;
    if ($[1] !== alerts) {
        t2 = alerts.some(_SystemAlertsPanelAlertsSome);
        $[1] = alerts;
        $[2] = t2;
    } else {
        t2 = $[2];
    }
    const hasWarnings = t2;
    let t3;
    if ($[3] !== alerts) {
        t3 = alerts.some(_SystemAlertsPanelAlertsSome2);
        $[3] = alerts;
        $[4] = t3;
    } else {
        t3 = $[4];
    }
    const hasErrors = t3;
    let t4;
    if ($[5] !== hasErrors || $[6] !== hasWarnings) {
        t4 = ({
            "SystemAlertsPanel[getBadgeVariant]": ()=>{
                if (hasErrors) {
                    return "danger";
                }
                if (hasWarnings) {
                    return "warning";
                }
                return "info";
            }
        })["SystemAlertsPanel[getBadgeVariant]"];
        $[5] = hasErrors;
        $[6] = hasWarnings;
        $[7] = t4;
    } else {
        t4 = $[7];
    }
    const getBadgeVariant = t4;
    let t5;
    if ($[8] !== onViewAll) {
        t5 = ({
            "SystemAlertsPanel[handleViewAll]": ()=>{
                if (onViewAll) {
                    onViewAll();
                } else {
                    console.log("View all alerts");
                }
            }
        })["SystemAlertsPanel[handleViewAll]"];
        $[8] = onViewAll;
        $[9] = t5;
    } else {
        t5 = $[9];
    }
    const handleViewAll = t5;
    let t6;
    if ($[10] === Symbol.for("react.memo_cache_sentinel")) {
        t6 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
            className: "text-sm font-semibold text-gray-900 flex items-center",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                    className: "h-4 w-4 mr-2 text-yellow-600"
                }, void 0, false, {
                    fileName: "[project]/src/app/(dashboard)/admin/_components/sidebar/SystemAlertsPanel.tsx",
                    lineNumber: 117,
                    columnNumber: 80
                }, this),
                "System Alerts"
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/admin/_components/sidebar/SystemAlertsPanel.tsx",
            lineNumber: 117,
            columnNumber: 10
        }, this);
        $[10] = t6;
    } else {
        t6 = $[10];
    }
    let t7;
    if ($[11] !== alertCount || $[12] !== getBadgeVariant) {
        t7 = alertCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
            variant: getBadgeVariant(),
            className: "text-xs",
            children: alertCount
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/admin/_components/sidebar/SystemAlertsPanel.tsx",
            lineNumber: 124,
            columnNumber: 28
        }, this);
        $[11] = alertCount;
        $[12] = getBadgeVariant;
        $[13] = t7;
    } else {
        t7 = $[13];
    }
    let t8;
    if ($[14] !== onToggle || $[15] !== t7) {
        t8 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "px-4 py-3 border-b border-gray-200 cursor-pointer flex items-center justify-between",
            onClick: onToggle,
            children: [
                t6,
                t7
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/admin/_components/sidebar/SystemAlertsPanel.tsx",
            lineNumber: 133,
            columnNumber: 10
        }, this);
        $[14] = onToggle;
        $[15] = t7;
        $[16] = t8;
    } else {
        t8 = $[16];
    }
    let t9;
    if ($[17] !== alerts || $[18] !== handleViewAll || $[19] !== isExpanded) {
        t9 = isExpanded && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "p-4",
            children: alerts.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-3",
                        children: alerts.map(_SystemAlertsPanelAlertsMap)
                    }, void 0, false, {
                        fileName: "[project]/src/app/(dashboard)/admin/_components/sidebar/SystemAlertsPanel.tsx",
                        lineNumber: 142,
                        columnNumber: 68
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-4 pt-4 border-t border-gray-200",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                            variant: "ghost",
                            size: "sm",
                            className: "w-full text-xs",
                            onClick: handleViewAll,
                            children: "View All Alerts"
                        }, void 0, false, {
                            fileName: "[project]/src/app/(dashboard)/admin/_components/sidebar/SystemAlertsPanel.tsx",
                            lineNumber: 142,
                            columnNumber: 194
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/(dashboard)/admin/_components/sidebar/SystemAlertsPanel.tsx",
                        lineNumber: 142,
                        columnNumber: 142
                    }, this)
                ]
            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center py-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-xs text-gray-500",
                    children: "No active alerts"
                }, void 0, false, {
                    fileName: "[project]/src/app/(dashboard)/admin/_components/sidebar/SystemAlertsPanel.tsx",
                    lineNumber: 142,
                    columnNumber: 349
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/(dashboard)/admin/_components/sidebar/SystemAlertsPanel.tsx",
                lineNumber: 142,
                columnNumber: 315
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/admin/_components/sidebar/SystemAlertsPanel.tsx",
            lineNumber: 142,
            columnNumber: 24
        }, this);
        $[17] = alerts;
        $[18] = handleViewAll;
        $[19] = isExpanded;
        $[20] = t9;
    } else {
        t9 = $[20];
    }
    let t10;
    if ($[21] !== className || $[22] !== t8 || $[23] !== t9) {
        t10 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
            className: className,
            children: [
                t8,
                t9
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/admin/_components/sidebar/SystemAlertsPanel.tsx",
            lineNumber: 152,
            columnNumber: 11
        }, this);
        $[21] = className;
        $[22] = t8;
        $[23] = t9;
        $[24] = t10;
    } else {
        t10 = $[24];
    }
    return t10;
}
_c = SystemAlertsPanel;
function _SystemAlertsPanelAlertsMap(alert_1) {
    const Icon = alert_1.icon;
    const bgColor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$dashboard$292f$admin$2f$_components$2f$sidebar$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAlertBackgroundColor"])(alert_1.type);
    const textColor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$dashboard$292f$admin$2f$_components$2f$sidebar$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAlertTextColor"])(alert_1.type);
    const iconColor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$dashboard$292f$admin$2f$_components$2f$sidebar$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAlertIconColor"])(alert_1.type);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `flex items-center gap-3 p-2 ${bgColor} rounded-lg`,
        role: "alert",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                className: `h-4 w-4 ${iconColor}`,
                "aria-hidden": "true"
            }, void 0, false, {
                fileName: "[project]/src/app/(dashboard)/admin/_components/sidebar/SystemAlertsPanel.tsx",
                lineNumber: 167,
                columnNumber: 109
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 min-w-0",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: `text-xs font-medium ${textColor}`,
                        children: alert_1.title
                    }, void 0, false, {
                        fileName: "[project]/src/app/(dashboard)/admin/_components/sidebar/SystemAlertsPanel.tsx",
                        lineNumber: 167,
                        columnNumber: 203
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: `text-xs ${textColor.replace("-900", "-700")}`,
                        children: alert_1.description
                    }, void 0, false, {
                        fileName: "[project]/src/app/(dashboard)/admin/_components/sidebar/SystemAlertsPanel.tsx",
                        lineNumber: 167,
                        columnNumber: 272
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/(dashboard)/admin/_components/sidebar/SystemAlertsPanel.tsx",
                lineNumber: 167,
                columnNumber: 171
            }, this)
        ]
    }, alert_1.id, true, {
        fileName: "[project]/src/app/(dashboard)/admin/_components/sidebar/SystemAlertsPanel.tsx",
        lineNumber: 167,
        columnNumber: 10
    }, this);
}
function _SystemAlertsPanelAlertsSome2(alert_0) {
    return alert_0.type === "error";
}
function _SystemAlertsPanelAlertsSome(alert) {
    return alert.type === "warning";
}
var _c;
__turbopack_context__.k.register(_c, "SystemAlertsPanel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/(dashboard)/admin/_components/sidebar/AdminActivityLog.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @fileoverview Admin Activity Log - Recent admin actions display
 * @module app/(dashboard)/admin/_components/sidebar/AdminActivityLog
 * @category Admin - Components
 */ __turbopack_context__.s([
    "AdminActivityLog",
    ()=>AdminActivityLog
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clock.js [app-client] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$dashboard$292f$admin$2f$_components$2f$sidebar$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/(dashboard)/admin/_components/sidebar/utils.ts [app-client] (ecmascript)");
'use client';
;
;
;
;
;
;
function AdminActivityLog(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(10);
    if ($[0] !== "e8dedf86ffb4ec6d0bfafe29e4da03d0603cffdebec125f3b6ec7e356202dd66") {
        for(let $i = 0; $i < 10; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "e8dedf86ffb4ec6d0bfafe29e4da03d0603cffdebec125f3b6ec7e356202dd66";
    }
    const { activities, onViewAll, className: t1 } = t0;
    const className = t1 === undefined ? "" : t1;
    let t2;
    if ($[1] !== onViewAll) {
        t2 = ({
            "AdminActivityLog[handleViewAll]": ()=>{
                if (onViewAll) {
                    onViewAll();
                } else {
                    console.log("View activity log");
                }
            }
        })["AdminActivityLog[handleViewAll]"];
        $[1] = onViewAll;
        $[2] = t2;
    } else {
        t2 = $[2];
    }
    const handleViewAll = t2;
    let t3;
    if ($[3] === Symbol.for("react.memo_cache_sentinel")) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "px-4 py-3 border-b border-gray-200",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "text-sm font-semibold text-gray-900 flex items-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                        className: "h-4 w-4 mr-2 text-orange-600"
                    }, void 0, false, {
                        fileName: "[project]/src/app/(dashboard)/admin/_components/sidebar/AdminActivityLog.tsx",
                        lineNumber: 71,
                        columnNumber: 132
                    }, this),
                    "Recent Activity"
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/(dashboard)/admin/_components/sidebar/AdminActivityLog.tsx",
                lineNumber: 71,
                columnNumber: 62
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/admin/_components/sidebar/AdminActivityLog.tsx",
            lineNumber: 71,
            columnNumber: 10
        }, this);
        $[3] = t3;
    } else {
        t3 = $[3];
    }
    let t4;
    if ($[4] !== activities || $[5] !== handleViewAll) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "p-4",
            children: activities.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-3",
                        children: activities.map(_AdminActivityLogActivitiesMap)
                    }, void 0, false, {
                        fileName: "[project]/src/app/(dashboard)/admin/_components/sidebar/AdminActivityLog.tsx",
                        lineNumber: 78,
                        columnNumber: 58
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-4 pt-4 border-t border-gray-200",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                            variant: "ghost",
                            size: "sm",
                            className: "w-full text-xs",
                            onClick: handleViewAll,
                            children: "View Activity Log"
                        }, void 0, false, {
                            fileName: "[project]/src/app/(dashboard)/admin/_components/sidebar/AdminActivityLog.tsx",
                            lineNumber: 78,
                            columnNumber: 191
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/(dashboard)/admin/_components/sidebar/AdminActivityLog.tsx",
                        lineNumber: 78,
                        columnNumber: 139
                    }, this)
                ]
            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center py-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-xs text-gray-500",
                    children: "No recent activity"
                }, void 0, false, {
                    fileName: "[project]/src/app/(dashboard)/admin/_components/sidebar/AdminActivityLog.tsx",
                    lineNumber: 78,
                    columnNumber: 348
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/(dashboard)/admin/_components/sidebar/AdminActivityLog.tsx",
                lineNumber: 78,
                columnNumber: 314
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/admin/_components/sidebar/AdminActivityLog.tsx",
            lineNumber: 78,
            columnNumber: 10
        }, this);
        $[4] = activities;
        $[5] = handleViewAll;
        $[6] = t4;
    } else {
        t4 = $[6];
    }
    let t5;
    if ($[7] !== className || $[8] !== t4) {
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
            className: className,
            children: [
                t3,
                t4
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/admin/_components/sidebar/AdminActivityLog.tsx",
            lineNumber: 87,
            columnNumber: 10
        }, this);
        $[7] = className;
        $[8] = t4;
        $[9] = t5;
    } else {
        t5 = $[9];
    }
    return t5;
}
_c = AdminActivityLog;
function _AdminActivityLogActivitiesMap(activity) {
    const Icon = activity.icon;
    const bgColor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$dashboard$292f$admin$2f$_components$2f$sidebar$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getActivityBackgroundColor"])(activity.type);
    const textColor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$dashboard$292f$admin$2f$_components$2f$sidebar$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getActivityTextColor"])(activity.type);
    const iconColor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$dashboard$292f$admin$2f$_components$2f$sidebar$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getActivityIconColor"])(activity.type);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `flex items-center gap-3 p-2 ${bgColor} rounded-lg`,
        role: "log",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                className: `h-4 w-4 ${iconColor}`,
                "aria-hidden": "true"
            }, void 0, false, {
                fileName: "[project]/src/app/(dashboard)/admin/_components/sidebar/AdminActivityLog.tsx",
                lineNumber: 101,
                columnNumber: 108
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 min-w-0",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: `text-xs font-medium ${textColor}`,
                        children: activity.title
                    }, void 0, false, {
                        fileName: "[project]/src/app/(dashboard)/admin/_components/sidebar/AdminActivityLog.tsx",
                        lineNumber: 101,
                        columnNumber: 202
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: `text-xs ${textColor.replace("-900", "-700")}`,
                        children: activity.description
                    }, void 0, false, {
                        fileName: "[project]/src/app/(dashboard)/admin/_components/sidebar/AdminActivityLog.tsx",
                        lineNumber: 101,
                        columnNumber: 272
                    }, this),
                    activity.timestamp && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs text-gray-500 mt-1",
                        children: activity.timestamp
                    }, void 0, false, {
                        fileName: "[project]/src/app/(dashboard)/admin/_components/sidebar/AdminActivityLog.tsx",
                        lineNumber: 101,
                        columnNumber: 383
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/(dashboard)/admin/_components/sidebar/AdminActivityLog.tsx",
                lineNumber: 101,
                columnNumber: 170
            }, this)
        ]
    }, activity.id, true, {
        fileName: "[project]/src/app/(dashboard)/admin/_components/sidebar/AdminActivityLog.tsx",
        lineNumber: 101,
        columnNumber: 10
    }, this);
}
var _c;
__turbopack_context__.k.register(_c, "AdminActivityLog");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/(dashboard)/admin/_components/sidebar/QuickActionsPanel.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @fileoverview Quick Actions Panel - Fast access to common admin tasks
 * @module app/(dashboard)/admin/_components/sidebar/QuickActionsPanel
 * @category Admin - Components
 */ __turbopack_context__.s([
    "QuickActionsPanel",
    ()=>QuickActionsPanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/zap.js [app-client] (ecmascript) <export default as Zap>");
'use client';
;
;
;
;
;
function QuickActionsPanel(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(18);
    if ($[0] !== "c96f6fadd779c512ae7dcbf71c4bc394fda540540c74c6c50ae301f955ee2889") {
        for(let $i = 0; $i < 18; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "c96f6fadd779c512ae7dcbf71c4bc394fda540540c74c6c50ae301f955ee2889";
    }
    const { actions, isExpanded, onToggle, onActionClick, className: t1 } = t0;
    const className = t1 === undefined ? "" : t1;
    let t2;
    if ($[1] !== onActionClick) {
        t2 = ({
            "QuickActionsPanel[handleActionClick]": (action)=>{
                if (onActionClick) {
                    onActionClick(action);
                } else {
                    if (action.href) {
                        console.log("Navigating to:", action.href);
                    } else {
                        if (action.action) {
                            action.action();
                        }
                    }
                }
            }
        })["QuickActionsPanel[handleActionClick]"];
        $[1] = onActionClick;
        $[2] = t2;
    } else {
        t2 = $[2];
    }
    const handleActionClick = t2;
    let t3;
    if ($[3] === Symbol.for("react.memo_cache_sentinel")) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
            className: "text-sm font-semibold text-gray-900 flex items-center",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__["Zap"], {
                    className: "h-4 w-4 mr-2 text-purple-600"
                }, void 0, false, {
                    fileName: "[project]/src/app/(dashboard)/admin/_components/sidebar/QuickActionsPanel.tsx",
                    lineNumber: 83,
                    columnNumber: 80
                }, this),
                "Quick Actions"
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/admin/_components/sidebar/QuickActionsPanel.tsx",
            lineNumber: 83,
            columnNumber: 10
        }, this);
        $[3] = t3;
    } else {
        t3 = $[3];
    }
    const t4 = isExpanded ? "Collapse" : "Expand";
    const t5 = isExpanded ? "\u2212" : "+";
    let t6;
    if ($[4] !== t4 || $[5] !== t5) {
        t6 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
            variant: "ghost",
            size: "sm",
            "aria-label": t4,
            children: t5
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/admin/_components/sidebar/QuickActionsPanel.tsx",
            lineNumber: 92,
            columnNumber: 10
        }, this);
        $[4] = t4;
        $[5] = t5;
        $[6] = t6;
    } else {
        t6 = $[6];
    }
    let t7;
    if ($[7] !== onToggle || $[8] !== t6) {
        t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "px-4 py-3 border-b border-gray-200 cursor-pointer flex items-center justify-between",
            onClick: onToggle,
            children: [
                t3,
                t6
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/admin/_components/sidebar/QuickActionsPanel.tsx",
            lineNumber: 101,
            columnNumber: 10
        }, this);
        $[7] = onToggle;
        $[8] = t6;
        $[9] = t7;
    } else {
        t7 = $[9];
    }
    let t8;
    if ($[10] !== actions || $[11] !== handleActionClick || $[12] !== isExpanded) {
        t8 = isExpanded && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "p-4",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-2",
                children: actions.map({
                    "QuickActionsPanel[actions.map()]": (action_0)=>{
                        const Icon = action_0.icon;
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            onClick: {
                                "QuickActionsPanel[actions.map() > <div>.onClick]": ()=>handleActionClick(action_0)
                            }["QuickActionsPanel[actions.map() > <div>.onClick]"],
                            className: "flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors",
                            role: "button",
                            tabIndex: 0,
                            onKeyDown: {
                                "QuickActionsPanel[actions.map() > <div>.onKeyDown]": (e)=>{
                                    if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        handleActionClick(action_0);
                                    }
                                }
                            }["QuickActionsPanel[actions.map() > <div>.onKeyDown]"],
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                    className: "h-4 w-4 text-gray-600",
                                    "aria-hidden": "true"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(dashboard)/admin/_components/sidebar/QuickActionsPanel.tsx",
                                    lineNumber: 122,
                                    columnNumber: 70
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex-1 min-w-0",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm font-medium text-gray-900 truncate",
                                            children: action_0.label
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(dashboard)/admin/_components/sidebar/QuickActionsPanel.tsx",
                                            lineNumber: 122,
                                            columnNumber: 163
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-gray-600",
                                            children: action_0.description
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(dashboard)/admin/_components/sidebar/QuickActionsPanel.tsx",
                                            lineNumber: 122,
                                            columnNumber: 241
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/(dashboard)/admin/_components/sidebar/QuickActionsPanel.tsx",
                                    lineNumber: 122,
                                    columnNumber: 131
                                }, this)
                            ]
                        }, action_0.id, true, {
                            fileName: "[project]/src/app/(dashboard)/admin/_components/sidebar/QuickActionsPanel.tsx",
                            lineNumber: 113,
                            columnNumber: 20
                        }, this);
                    }
                }["QuickActionsPanel[actions.map()]"])
            }, void 0, false, {
                fileName: "[project]/src/app/(dashboard)/admin/_components/sidebar/QuickActionsPanel.tsx",
                lineNumber: 110,
                columnNumber: 45
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/admin/_components/sidebar/QuickActionsPanel.tsx",
            lineNumber: 110,
            columnNumber: 24
        }, this);
        $[10] = actions;
        $[11] = handleActionClick;
        $[12] = isExpanded;
        $[13] = t8;
    } else {
        t8 = $[13];
    }
    let t9;
    if ($[14] !== className || $[15] !== t7 || $[16] !== t8) {
        t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
            className: className,
            children: [
                t7,
                t8
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/admin/_components/sidebar/QuickActionsPanel.tsx",
            lineNumber: 134,
            columnNumber: 10
        }, this);
        $[14] = className;
        $[15] = t7;
        $[16] = t8;
        $[17] = t9;
    } else {
        t9 = $[17];
    }
    return t9;
}
_c = QuickActionsPanel;
var _c;
__turbopack_context__.k.register(_c, "QuickActionsPanel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/(dashboard)/admin/_components/sidebar/SystemToolsPanel.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @fileoverview System Tools Panel - Administrative utilities and tools
 * @module app/(dashboard)/admin/_components/sidebar/SystemToolsPanel
 * @category Admin - Components
 */ __turbopack_context__.s([
    "SystemToolsPanel",
    ()=>SystemToolsPanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$server$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Server$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/server.js [app-client] (ecmascript) <export default as Server>");
'use client';
;
;
;
;
;
function SystemToolsPanel(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(10);
    if ($[0] !== "b33493712fb8bd4742bce75c9522845390c5a3419c9957678128e222e97b8440") {
        for(let $i = 0; $i < 10; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "b33493712fb8bd4742bce75c9522845390c5a3419c9957678128e222e97b8440";
    }
    const { tools, className: t1 } = t0;
    const className = t1 === undefined ? "" : t1;
    const handleToolClick = _SystemToolsPanelHandleToolClick;
    let t2;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "px-4 py-3 border-b border-gray-200",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "text-sm font-semibold text-gray-900 flex items-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$server$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Server$3e$__["Server"], {
                        className: "h-4 w-4 mr-2 text-indigo-600"
                    }, void 0, false, {
                        fileName: "[project]/src/app/(dashboard)/admin/_components/sidebar/SystemToolsPanel.tsx",
                        lineNumber: 52,
                        columnNumber: 132
                    }, this),
                    "System Tools"
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/(dashboard)/admin/_components/sidebar/SystemToolsPanel.tsx",
                lineNumber: 52,
                columnNumber: 62
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/admin/_components/sidebar/SystemToolsPanel.tsx",
            lineNumber: 52,
            columnNumber: 10
        }, this);
        $[1] = t2;
    } else {
        t2 = $[1];
    }
    let t3;
    if ($[2] !== tools) {
        let t4;
        if ($[4] === Symbol.for("react.memo_cache_sentinel")) {
            t4 = ({
                "SystemToolsPanel[tools.map()]": (tool_0)=>{
                    const Icon = tool_0.icon;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                        variant: "outline",
                        size: "sm",
                        className: "w-full justify-start text-xs",
                        onClick: {
                            "SystemToolsPanel[tools.map() > <Button>.onClick]": ()=>handleToolClick(tool_0)
                        }["SystemToolsPanel[tools.map() > <Button>.onClick]"],
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                className: "h-3 w-3 mr-2"
                            }, void 0, false, {
                                fileName: "[project]/src/app/(dashboard)/admin/_components/sidebar/SystemToolsPanel.tsx",
                                lineNumber: 66,
                                columnNumber: 66
                            }, this),
                            tool_0.label
                        ]
                    }, tool_0.id, true, {
                        fileName: "[project]/src/app/(dashboard)/admin/_components/sidebar/SystemToolsPanel.tsx",
                        lineNumber: 64,
                        columnNumber: 18
                    }, this);
                }
            })["SystemToolsPanel[tools.map()]"];
            $[4] = t4;
        } else {
            t4 = $[4];
        }
        t3 = tools.map(t4);
        $[2] = tools;
        $[3] = t3;
    } else {
        t3 = $[3];
    }
    let t4;
    if ($[5] !== t3) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "p-4",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-2",
                children: t3
            }, void 0, false, {
                fileName: "[project]/src/app/(dashboard)/admin/_components/sidebar/SystemToolsPanel.tsx",
                lineNumber: 81,
                columnNumber: 31
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/admin/_components/sidebar/SystemToolsPanel.tsx",
            lineNumber: 81,
            columnNumber: 10
        }, this);
        $[5] = t3;
        $[6] = t4;
    } else {
        t4 = $[6];
    }
    let t5;
    if ($[7] !== className || $[8] !== t4) {
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
            className: className,
            children: [
                t2,
                t4
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/admin/_components/sidebar/SystemToolsPanel.tsx",
            lineNumber: 89,
            columnNumber: 10
        }, this);
        $[7] = className;
        $[8] = t4;
        $[9] = t5;
    } else {
        t5 = $[9];
    }
    return t5;
}
_c = SystemToolsPanel;
function _SystemToolsPanelHandleToolClick(tool) {
    tool.action();
}
var _c;
__turbopack_context__.k.register(_c, "SystemToolsPanel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/(dashboard)/admin/_components/sidebar/useAdminSidebar.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @fileoverview Custom hook for admin sidebar state management
 * @module app/(dashboard)/admin/_components/sidebar/useAdminSidebar
 * @category Admin - Hooks
 */ __turbopack_context__.s([
    "useAdminSidebar",
    ()=>useAdminSidebar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
;
const DEFAULT_EXPANDED_SECTIONS = [
    'modules',
    'actions',
    'metrics',
    'alerts'
];
function useAdminSidebar(t0) {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(13);
    if ($[0] !== "78ed7a55195fb6a7542440e026345f4d3ec340ad38496bb920a13291740232cb") {
        for(let $i = 0; $i < 13; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "78ed7a55195fb6a7542440e026345f4d3ec340ad38496bb920a13291740232cb";
    }
    const initialExpanded = t0 === undefined ? DEFAULT_EXPANDED_SECTIONS : t0;
    let t1;
    if ($[1] !== initialExpanded) {
        t1 = new Set(initialExpanded);
        $[1] = initialExpanded;
        $[2] = t1;
    } else {
        t1 = $[2];
    }
    const [expandedSections, setExpandedSections] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(t1);
    let t2;
    if ($[3] === Symbol.for("react.memo_cache_sentinel")) {
        t2 = ({
            "useAdminSidebar[toggleSection]": (sectionId)=>{
                setExpandedSections({
                    "useAdminSidebar[toggleSection > setExpandedSections()]": (prev)=>{
                        const next = new Set(prev);
                        if (next.has(sectionId)) {
                            next.delete(sectionId);
                        } else {
                            next.add(sectionId);
                        }
                        return next;
                    }
                }["useAdminSidebar[toggleSection > setExpandedSections()]"]);
            }
        })["useAdminSidebar[toggleSection]"];
        $[3] = t2;
    } else {
        t2 = $[3];
    }
    const toggleSection = t2;
    let t3;
    if ($[4] !== expandedSections) {
        t3 = ({
            "useAdminSidebar[isExpanded]": (sectionId_0)=>expandedSections.has(sectionId_0)
        })["useAdminSidebar[isExpanded]"];
        $[4] = expandedSections;
        $[5] = t3;
    } else {
        t3 = $[5];
    }
    const isExpanded = t3;
    let t4;
    if ($[6] === Symbol.for("react.memo_cache_sentinel")) {
        t4 = ({
            "useAdminSidebar[expandSection]": (sectionId_1)=>{
                setExpandedSections({
                    "useAdminSidebar[expandSection > setExpandedSections()]": (prev_0)=>{
                        const next_0 = new Set(prev_0);
                        next_0.add(sectionId_1);
                        return next_0;
                    }
                }["useAdminSidebar[expandSection > setExpandedSections()]"]);
            }
        })["useAdminSidebar[expandSection]"];
        $[6] = t4;
    } else {
        t4 = $[6];
    }
    const expandSection = t4;
    let t5;
    if ($[7] === Symbol.for("react.memo_cache_sentinel")) {
        t5 = ({
            "useAdminSidebar[collapseSection]": (sectionId_2)=>{
                setExpandedSections({
                    "useAdminSidebar[collapseSection > setExpandedSections()]": (prev_1)=>{
                        const next_1 = new Set(prev_1);
                        next_1.delete(sectionId_2);
                        return next_1;
                    }
                }["useAdminSidebar[collapseSection > setExpandedSections()]"]);
            }
        })["useAdminSidebar[collapseSection]"];
        $[7] = t5;
    } else {
        t5 = $[7];
    }
    const collapseSection = t5;
    let t6;
    if ($[8] === Symbol.for("react.memo_cache_sentinel")) {
        t6 = ({
            "useAdminSidebar[expandAll]": ()=>{
                setExpandedSections(new Set([
                    "modules",
                    "actions",
                    "metrics",
                    "alerts",
                    "activity",
                    "tools"
                ]));
            }
        })["useAdminSidebar[expandAll]"];
        $[8] = t6;
    } else {
        t6 = $[8];
    }
    const expandAll = t6;
    let t7;
    if ($[9] === Symbol.for("react.memo_cache_sentinel")) {
        t7 = ({
            "useAdminSidebar[collapseAll]": ()=>{
                setExpandedSections(new Set());
            }
        })["useAdminSidebar[collapseAll]"];
        $[9] = t7;
    } else {
        t7 = $[9];
    }
    const collapseAll = t7;
    let t8;
    if ($[10] !== expandedSections || $[11] !== isExpanded) {
        t8 = {
            expandedSections,
            toggleSection,
            isExpanded,
            expandSection,
            collapseSection,
            expandAll,
            collapseAll
        };
        $[10] = expandedSections;
        $[11] = isExpanded;
        $[12] = t8;
    } else {
        t8 = $[12];
    }
    return t8;
}
_s(useAdminSidebar, "w+f3Hpw6hoFuJNeBxlH8e28kZGs=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/(dashboard)/admin/_components/sidebar/data.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @fileoverview Admin Sidebar Data - Static data for sidebar components
 * @module app/(dashboard)/admin/_components/sidebar/data
 * @category Admin - Data
 */ __turbopack_context__.s([
    "adminModules",
    ()=>adminModules,
    "quickActions",
    ()=>quickActions,
    "recentActivity",
    ()=>recentActivity,
    "systemAlerts",
    ()=>systemAlerts,
    "systemMetrics",
    ()=>systemMetrics,
    "systemTools",
    ()=>systemTools
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shield.js [app-client] (ecmascript) <export default as Shield>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/users.js [app-client] (ecmascript) <export default as Users>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/settings.js [app-client] (ecmascript) <export default as Settings>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$monitor$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Monitor$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/monitor.js [app-client] (ecmascript) <export default as Monitor>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$database$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Database$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/database.js [app-client] (ecmascript) <export default as Database>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/lock.js [app-client] (ecmascript) <export default as Lock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UserCheck$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user-check.js [app-client] (ecmascript) <export default as UserCheck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-text.js [app-client] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chart-column.js [app-client] (ecmascript) <export default as BarChart3>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/download.js [app-client] (ecmascript) <export default as Download>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/upload.js [app-client] (ecmascript) <export default as Upload>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eye.js [app-client] (ecmascript) <export default as Eye>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/activity.js [app-client] (ecmascript) <export default as Activity>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bell.js [app-client] (ecmascript) <export default as Bell>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cpu$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Cpu$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/cpu.js [app-client] (ecmascript) <export default as Cpu>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$memory$2d$stick$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MemoryStick$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/memory-stick.js [app-client] (ecmascript) <export default as MemoryStick>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$hard$2d$drive$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__HardDrive$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/hard-drive.js [app-client] (ecmascript) <export default as HardDrive>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wifi$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Wifi$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/wifi.js [app-client] (ecmascript) <export default as Wifi>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-client] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clock.js [app-client] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check-big.js [app-client] (ecmascript) <export default as CheckCircle>");
;
const adminModules = [
    {
        id: 'dashboard',
        name: 'Admin Dashboard',
        description: 'System overview and health monitoring',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__["Shield"],
        count: 4,
        status: 'active',
        href: '/admin'
    },
    {
        id: 'users',
        name: 'User Management',
        description: 'Manage user accounts and permissions',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"],
        count: 2847,
        status: 'success',
        href: '/admin/users'
    },
    {
        id: 'settings',
        name: 'System Settings',
        description: 'Configure system preferences',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"],
        count: 12,
        status: 'active',
        href: '/admin/settings'
    },
    {
        id: 'monitoring',
        name: 'System Monitor',
        description: 'Real-time system performance',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$monitor$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Monitor$3e$__["Monitor"],
        count: 3,
        status: 'warning',
        href: '/admin/monitoring'
    },
    {
        id: 'security',
        name: 'Security Center',
        description: 'Security policies and audit logs',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lock$3e$__["Lock"],
        count: 8,
        status: 'success',
        href: '/admin/security'
    },
    {
        id: 'database',
        name: 'Database Admin',
        description: 'Database management and backups',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$database$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Database$3e$__["Database"],
        count: 5,
        status: 'active',
        href: '/admin/database'
    },
    {
        id: 'reports',
        name: 'System Reports',
        description: 'Administrative reporting and analytics',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__["BarChart3"],
        count: 23,
        status: 'success',
        href: '/admin/reports'
    },
    {
        id: 'logs',
        name: 'Audit Logs',
        description: 'System activity and compliance logs',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"],
        count: 156,
        status: 'active',
        href: '/admin/logs'
    }
];
const systemMetrics = [
    {
        label: 'CPU Usage',
        value: '34%',
        status: 'normal',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cpu$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Cpu$3e$__["Cpu"],
        color: 'text-green-600'
    },
    {
        label: 'Memory',
        value: '67%',
        status: 'warning',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$memory$2d$stick$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MemoryStick$3e$__["MemoryStick"],
        color: 'text-yellow-600'
    },
    {
        label: 'Storage',
        value: '89%',
        status: 'critical',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$hard$2d$drive$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__HardDrive$3e$__["HardDrive"],
        color: 'text-red-600'
    },
    {
        label: 'Network',
        value: 'Stable',
        status: 'normal',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wifi$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Wifi$3e$__["Wifi"],
        color: 'text-green-600'
    }
];
const quickActions = [
    {
        id: 'create-user',
        label: 'Create User',
        description: 'Add new user account',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UserCheck$3e$__["UserCheck"],
        href: '/admin/users/create'
    },
    {
        id: 'backup-system',
        label: 'System Backup',
        description: 'Create system backup',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"],
        action: ()=>console.log('Starting backup...')
    },
    {
        id: 'security-scan',
        label: 'Security Scan',
        description: 'Run security audit',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lock$3e$__["Lock"],
        action: ()=>console.log('Starting security scan...')
    },
    {
        id: 'system-health',
        label: 'Health Check',
        description: 'System health diagnostic',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__["Activity"],
        action: ()=>console.log('Running health check...')
    },
    {
        id: 'send-notification',
        label: 'Send Alert',
        description: 'System-wide notification',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__["Bell"],
        href: '/admin/notifications/create'
    }
];
const systemAlerts = [
    {
        id: 'storage-warning',
        type: 'error',
        title: 'High Storage Usage',
        description: '89% capacity reached',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"]
    },
    {
        id: 'backup-overdue',
        type: 'warning',
        title: 'Backup Overdue',
        description: 'Last backup: 25 hours ago',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"]
    },
    {
        id: 'system-update',
        type: 'info',
        title: 'System Update Available',
        description: 'Security patch ready',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__["Bell"]
    }
];
const recentActivity = [
    {
        id: 'user-created',
        type: 'success',
        title: 'User Created',
        description: 'New nurse account added',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"]
    },
    {
        id: 'settings-updated',
        type: 'info',
        title: 'Settings Updated',
        description: 'HIPAA compliance settings',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"]
    },
    {
        id: 'backup-completed',
        type: 'warning',
        title: 'Backup Completed',
        description: 'Daily automated backup',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$database$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Database$3e$__["Database"]
    }
];
const systemTools = [
    {
        id: 'export-data',
        label: 'Export Data',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"],
        action: ()=>console.log('Export data')
    },
    {
        id: 'import-data',
        label: 'Import Data',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__["Upload"],
        action: ()=>console.log('Import data')
    },
    {
        id: 'advanced-search',
        label: 'Advanced Search',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"],
        action: ()=>console.log('Advanced search')
    },
    {
        id: 'system-logs',
        label: 'System Logs',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"],
        action: ()=>console.log('System logs')
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/(dashboard)/admin/_components/sidebar/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

/**
 * @fileoverview Admin Sidebar Components - Barrel export file
 * @module app/(dashboard)/admin/_components/sidebar
 * @category Admin - Components
 */ __turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$dashboard$292f$admin$2f$_components$2f$sidebar$2f$AdminNavigationMenu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/(dashboard)/admin/_components/sidebar/AdminNavigationMenu.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$dashboard$292f$admin$2f$_components$2f$sidebar$2f$SystemStatusWidget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/(dashboard)/admin/_components/sidebar/SystemStatusWidget.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$dashboard$292f$admin$2f$_components$2f$sidebar$2f$SystemAlertsPanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/(dashboard)/admin/_components/sidebar/SystemAlertsPanel.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$dashboard$292f$admin$2f$_components$2f$sidebar$2f$AdminActivityLog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/(dashboard)/admin/_components/sidebar/AdminActivityLog.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$dashboard$292f$admin$2f$_components$2f$sidebar$2f$QuickActionsPanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/(dashboard)/admin/_components/sidebar/QuickActionsPanel.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$dashboard$292f$admin$2f$_components$2f$sidebar$2f$SystemToolsPanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/(dashboard)/admin/_components/sidebar/SystemToolsPanel.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$dashboard$292f$admin$2f$_components$2f$sidebar$2f$useAdminSidebar$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/(dashboard)/admin/_components/sidebar/useAdminSidebar.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$dashboard$292f$admin$2f$_components$2f$sidebar$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/(dashboard)/admin/_components/sidebar/data.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$dashboard$292f$admin$2f$_components$2f$sidebar$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/(dashboard)/admin/_components/sidebar/utils.ts [app-client] (ecmascript)");
;
;
;
;
;
;
;
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/(dashboard)/admin/_components/AdminSidebar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @fileoverview Admin Sidebar Component - Main layout wrapper for admin navigation
 * @module app/(dashboard)/admin/_components/AdminSidebar
 * @category Admin - Components
 *
 * @description
 * Refactored admin sidebar that composes smaller, focused components:
 * - AdminNavigationMenu: Primary navigation for admin modules
 * - QuickActionsPanel: Fast access to common tasks
 * - SystemStatusWidget: Real-time system metrics
 * - SystemAlertsPanel: Critical system alerts
 * - AdminActivityLog: Recent admin actions
 * - SystemToolsPanel: Administrative utilities
 *
 * @example
 * ```tsx
 * <AdminSidebar className="sticky top-0" />
 * ```
 */ __turbopack_context__.s([
    "AdminSidebar",
    ()=>AdminSidebar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$dashboard$292f$admin$2f$_components$2f$sidebar$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/app/(dashboard)/admin/_components/sidebar/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$dashboard$292f$admin$2f$_components$2f$sidebar$2f$AdminNavigationMenu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/(dashboard)/admin/_components/sidebar/AdminNavigationMenu.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$dashboard$292f$admin$2f$_components$2f$sidebar$2f$SystemStatusWidget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/(dashboard)/admin/_components/sidebar/SystemStatusWidget.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$dashboard$292f$admin$2f$_components$2f$sidebar$2f$SystemAlertsPanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/(dashboard)/admin/_components/sidebar/SystemAlertsPanel.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$dashboard$292f$admin$2f$_components$2f$sidebar$2f$AdminActivityLog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/(dashboard)/admin/_components/sidebar/AdminActivityLog.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$dashboard$292f$admin$2f$_components$2f$sidebar$2f$QuickActionsPanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/(dashboard)/admin/_components/sidebar/QuickActionsPanel.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$dashboard$292f$admin$2f$_components$2f$sidebar$2f$SystemToolsPanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/(dashboard)/admin/_components/sidebar/SystemToolsPanel.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$dashboard$292f$admin$2f$_components$2f$sidebar$2f$useAdminSidebar$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/(dashboard)/admin/_components/sidebar/useAdminSidebar.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$dashboard$292f$admin$2f$_components$2f$sidebar$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/(dashboard)/admin/_components/sidebar/data.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function AdminSidebar(t0) {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(52);
    if ($[0] !== "e32341f5127d60ceec557eb4a4b2ced59386278182069ea10ab090e847e0e0ca") {
        for(let $i = 0; $i < 52; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "e32341f5127d60ceec557eb4a4b2ced59386278182069ea10ab090e847e0e0ca";
    }
    const { className: t1 } = t0;
    const className = t1 === undefined ? "" : t1;
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { isExpanded, toggleSection } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$dashboard$292f$admin$2f$_components$2f$sidebar$2f$useAdminSidebar$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAdminSidebar"])();
    let t2;
    if ($[1] !== router) {
        t2 = ({
            "AdminSidebar[handleNavigation]": (href)=>{
                router.push(href);
            }
        })["AdminSidebar[handleNavigation]"];
        $[1] = router;
        $[2] = t2;
    } else {
        t2 = $[2];
    }
    const handleNavigation = t2;
    let t3;
    if ($[3] !== handleNavigation) {
        t3 = ({
            "AdminSidebar[handleQuickAction]": (action)=>{
                if (action.href) {
                    handleNavigation(action.href);
                } else {
                    if (action.action) {
                        action.action();
                    }
                }
            }
        })["AdminSidebar[handleQuickAction]"];
        $[3] = handleNavigation;
        $[4] = t3;
    } else {
        t3 = $[4];
    }
    const handleQuickAction = t3;
    const handleMetricsRefresh = _AdminSidebarHandleMetricsRefresh;
    let t4;
    if ($[5] !== handleNavigation) {
        t4 = ({
            "AdminSidebar[handleViewAllAlerts]": ()=>{
                handleNavigation("/admin/settings/configuration");
            }
        })["AdminSidebar[handleViewAllAlerts]"];
        $[5] = handleNavigation;
        $[6] = t4;
    } else {
        t4 = $[6];
    }
    const handleViewAllAlerts = t4;
    let t5;
    if ($[7] !== handleNavigation) {
        t5 = ({
            "AdminSidebar[handleViewActivityLog]": ()=>{
                handleNavigation("/admin/settings/audit-logs");
            }
        })["AdminSidebar[handleViewActivityLog]"];
        $[7] = handleNavigation;
        $[8] = t5;
    } else {
        t5 = $[8];
    }
    const handleViewActivityLog = t5;
    const t6 = `w-80 flex-shrink-0 ${className}`;
    let t7;
    if ($[9] !== isExpanded) {
        t7 = isExpanded("modules");
        $[9] = isExpanded;
        $[10] = t7;
    } else {
        t7 = $[10];
    }
    let t8;
    if ($[11] !== toggleSection) {
        t8 = ({
            "AdminSidebar[<AdminNavigationMenu>.onToggle]": ()=>toggleSection("modules")
        })["AdminSidebar[<AdminNavigationMenu>.onToggle]"];
        $[11] = toggleSection;
        $[12] = t8;
    } else {
        t8 = $[12];
    }
    let t9;
    if ($[13] !== handleNavigation || $[14] !== t7 || $[15] !== t8) {
        t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$dashboard$292f$admin$2f$_components$2f$sidebar$2f$AdminNavigationMenu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AdminNavigationMenu"], {
            modules: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$dashboard$292f$admin$2f$_components$2f$sidebar$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["adminModules"],
            isExpanded: t7,
            onToggle: t8,
            onNavigate: handleNavigation
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/admin/_components/AdminSidebar.tsx",
            lineNumber: 149,
            columnNumber: 10
        }, this);
        $[13] = handleNavigation;
        $[14] = t7;
        $[15] = t8;
        $[16] = t9;
    } else {
        t9 = $[16];
    }
    let t10;
    if ($[17] !== isExpanded) {
        t10 = isExpanded("actions");
        $[17] = isExpanded;
        $[18] = t10;
    } else {
        t10 = $[18];
    }
    let t11;
    if ($[19] !== toggleSection) {
        t11 = ({
            "AdminSidebar[<QuickActionsPanel>.onToggle]": ()=>toggleSection("actions")
        })["AdminSidebar[<QuickActionsPanel>.onToggle]"];
        $[19] = toggleSection;
        $[20] = t11;
    } else {
        t11 = $[20];
    }
    let t12;
    if ($[21] !== handleQuickAction || $[22] !== t10 || $[23] !== t11) {
        t12 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$dashboard$292f$admin$2f$_components$2f$sidebar$2f$QuickActionsPanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QuickActionsPanel"], {
            actions: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$dashboard$292f$admin$2f$_components$2f$sidebar$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["quickActions"],
            isExpanded: t10,
            onToggle: t11,
            onActionClick: handleQuickAction
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/admin/_components/AdminSidebar.tsx",
            lineNumber: 177,
            columnNumber: 11
        }, this);
        $[21] = handleQuickAction;
        $[22] = t10;
        $[23] = t11;
        $[24] = t12;
    } else {
        t12 = $[24];
    }
    let t13;
    if ($[25] !== isExpanded) {
        t13 = isExpanded("metrics");
        $[25] = isExpanded;
        $[26] = t13;
    } else {
        t13 = $[26];
    }
    let t14;
    if ($[27] !== toggleSection) {
        t14 = ({
            "AdminSidebar[<SystemStatusWidget>.onToggle]": ()=>toggleSection("metrics")
        })["AdminSidebar[<SystemStatusWidget>.onToggle]"];
        $[27] = toggleSection;
        $[28] = t14;
    } else {
        t14 = $[28];
    }
    let t15;
    if ($[29] !== t13 || $[30] !== t14) {
        t15 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$dashboard$292f$admin$2f$_components$2f$sidebar$2f$SystemStatusWidget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SystemStatusWidget"], {
            metrics: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$dashboard$292f$admin$2f$_components$2f$sidebar$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["systemMetrics"],
            isExpanded: t13,
            onToggle: t14,
            onRefresh: handleMetricsRefresh
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/admin/_components/AdminSidebar.tsx",
            lineNumber: 205,
            columnNumber: 11
        }, this);
        $[29] = t13;
        $[30] = t14;
        $[31] = t15;
    } else {
        t15 = $[31];
    }
    let t16;
    if ($[32] !== isExpanded) {
        t16 = isExpanded("alerts");
        $[32] = isExpanded;
        $[33] = t16;
    } else {
        t16 = $[33];
    }
    let t17;
    if ($[34] !== toggleSection) {
        t17 = ({
            "AdminSidebar[<SystemAlertsPanel>.onToggle]": ()=>toggleSection("alerts")
        })["AdminSidebar[<SystemAlertsPanel>.onToggle]"];
        $[34] = toggleSection;
        $[35] = t17;
    } else {
        t17 = $[35];
    }
    let t18;
    if ($[36] !== handleViewAllAlerts || $[37] !== t16 || $[38] !== t17) {
        t18 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$dashboard$292f$admin$2f$_components$2f$sidebar$2f$SystemAlertsPanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SystemAlertsPanel"], {
            alerts: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$dashboard$292f$admin$2f$_components$2f$sidebar$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["systemAlerts"],
            isExpanded: t16,
            onToggle: t17,
            onViewAll: handleViewAllAlerts
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/admin/_components/AdminSidebar.tsx",
            lineNumber: 232,
            columnNumber: 11
        }, this);
        $[36] = handleViewAllAlerts;
        $[37] = t16;
        $[38] = t17;
        $[39] = t18;
    } else {
        t18 = $[39];
    }
    let t19;
    if ($[40] !== handleViewActivityLog) {
        t19 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$dashboard$292f$admin$2f$_components$2f$sidebar$2f$AdminActivityLog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AdminActivityLog"], {
            activities: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$dashboard$292f$admin$2f$_components$2f$sidebar$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["recentActivity"],
            onViewAll: handleViewActivityLog
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/admin/_components/AdminSidebar.tsx",
            lineNumber: 242,
            columnNumber: 11
        }, this);
        $[40] = handleViewActivityLog;
        $[41] = t19;
    } else {
        t19 = $[41];
    }
    let t20;
    if ($[42] === Symbol.for("react.memo_cache_sentinel")) {
        t20 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$dashboard$292f$admin$2f$_components$2f$sidebar$2f$SystemToolsPanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SystemToolsPanel"], {
            tools: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$dashboard$292f$admin$2f$_components$2f$sidebar$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["systemTools"]
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/admin/_components/AdminSidebar.tsx",
            lineNumber: 250,
            columnNumber: 11
        }, this);
        $[42] = t20;
    } else {
        t20 = $[42];
    }
    let t21;
    if ($[43] !== t12 || $[44] !== t15 || $[45] !== t18 || $[46] !== t19 || $[47] !== t9) {
        t21 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-6",
            children: [
                t9,
                t12,
                t15,
                t18,
                t19,
                t20
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/admin/_components/AdminSidebar.tsx",
            lineNumber: 257,
            columnNumber: 11
        }, this);
        $[43] = t12;
        $[44] = t15;
        $[45] = t18;
        $[46] = t19;
        $[47] = t9;
        $[48] = t21;
    } else {
        t21 = $[48];
    }
    let t22;
    if ($[49] !== t21 || $[50] !== t6) {
        t22 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: t6,
            children: t21
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/admin/_components/AdminSidebar.tsx",
            lineNumber: 269,
            columnNumber: 11
        }, this);
        $[49] = t21;
        $[50] = t6;
        $[51] = t22;
    } else {
        t22 = $[51];
    }
    return t22;
}
_s(AdminSidebar, "gcomg34P/EtZ2WQBVfspf1eQMNc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$dashboard$292f$admin$2f$_components$2f$sidebar$2f$useAdminSidebar$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAdminSidebar"]
    ];
});
_c = AdminSidebar;
function _AdminSidebarHandleMetricsRefresh() {
    window.location.reload();
}
var _c;
__turbopack_context__.k.register(_c, "AdminSidebar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_5490df61._.js.map