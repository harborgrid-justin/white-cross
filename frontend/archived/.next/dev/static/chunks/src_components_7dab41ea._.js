(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
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
const Button = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = ({ className, variant, size, asChild = false, loading = false, ...props }, ref)=>{
    const Comp = asChild ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Slot"] : "button";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Comp, {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(buttonVariants({
            variant,
            size,
            className
        })),
        ref: ref,
        disabled: loading || props.disabled,
        ...props,
        children: loading ? "Loading..." : props.children
    }, void 0, false, {
        fileName: "[project]/src/components/ui/button.tsx",
        lineNumber: 52,
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
"[project]/src/components/ui/input.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Input",
    ()=>Input,
    "SearchInput",
    ()=>SearchInput
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
const Input = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](({ className, type, ...props }, ref)=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
        type: type,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
        ref: ref,
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/input.tsx",
        lineNumber: 10,
        columnNumber: 7
    }, ("TURBOPACK compile-time value", void 0));
});
_c = Input;
Input.displayName = "Input";
// SearchInput component - a specialized Input with search functionality
const SearchInput = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c1 = ({ className, ...props }, ref)=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Input, {
        type: "search",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("pl-8", className),
        ref: ref,
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/input.tsx",
        lineNumber: 30,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
});
_c2 = SearchInput;
SearchInput.displayName = "SearchInput";
;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "Input");
__turbopack_context__.k.register(_c1, "SearchInput$React.forwardRef");
__turbopack_context__.k.register(_c2, "SearchInput");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/select.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Select",
    ()=>Select,
    "SelectContent",
    ()=>SelectContent,
    "SelectGroup",
    ()=>SelectGroup,
    "SelectItem",
    ()=>SelectItem,
    "SelectLabel",
    ()=>SelectLabel,
    "SelectScrollDownButton",
    ()=>SelectScrollDownButton,
    "SelectScrollUpButton",
    ()=>SelectScrollUpButton,
    "SelectSeparator",
    ()=>SelectSeparator,
    "SelectTrigger",
    ()=>SelectTrigger,
    "SelectValue",
    ()=>SelectValue
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-select/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUp$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-up.js [app-client] (ecmascript) <export default as ChevronUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
;
const Select = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"];
const SelectGroup = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"];
const SelectValue = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Value"];
const SelectTrigger = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = ({ className, children, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Trigger"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1", className),
        ...props,
        children: [
            children,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icon"], {
                asChild: true,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                    className: "h-4 w-4 opacity-50"
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/select.tsx",
                    lineNumber: 29,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/components/ui/select.tsx",
                lineNumber: 28,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/select.tsx",
        lineNumber: 19,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c1 = SelectTrigger;
SelectTrigger.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Trigger"].displayName;
const SelectScrollUpButton = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ScrollUpButton"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex cursor-default items-center justify-center py-1", className),
        ...props,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUp$3e$__["ChevronUp"], {
            className: "h-4 w-4"
        }, void 0, false, {
            fileName: "[project]/src/components/ui/select.tsx",
            lineNumber: 47,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/ui/select.tsx",
        lineNumber: 39,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c2 = SelectScrollUpButton;
SelectScrollUpButton.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ScrollUpButton"].displayName;
const SelectScrollDownButton = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ScrollDownButton"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex cursor-default items-center justify-center py-1", className),
        ...props,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
            className: "h-4 w-4"
        }, void 0, false, {
            fileName: "[project]/src/components/ui/select.tsx",
            lineNumber: 64,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/ui/select.tsx",
        lineNumber: 56,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c3 = SelectScrollDownButton;
SelectScrollDownButton.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ScrollDownButton"].displayName;
const SelectContent = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c4 = ({ className, children, position = "popper", ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Portal"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"], {
            ref: ref,
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("relative z-50 max-h-[--radix-select-content-available-height] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-select-content-transform-origin]", position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1", className),
            position: position,
            ...props,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SelectScrollUpButton, {}, void 0, false, {
                    fileName: "[project]/src/components/ui/select.tsx",
                    lineNumber: 86,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Viewport"], {
                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("p-1", position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"),
                    children: children
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/select.tsx",
                    lineNumber: 87,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SelectScrollDownButton, {}, void 0, false, {
                    fileName: "[project]/src/components/ui/select.tsx",
                    lineNumber: 96,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/ui/select.tsx",
            lineNumber: 75,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/ui/select.tsx",
        lineNumber: 74,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c5 = SelectContent;
SelectContent.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"].displayName;
const SelectLabel = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c6 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("px-2 py-1.5 text-sm font-semibold", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/select.tsx",
        lineNumber: 106,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c7 = SelectLabel;
SelectLabel.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"].displayName;
const SelectItem = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c8 = ({ className, children, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Item"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
        ...props,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "absolute right-2 flex h-3.5 w-3.5 items-center justify-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ItemIndicator"], {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                        className: "h-4 w-4"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/select.tsx",
                        lineNumber: 128,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/select.tsx",
                    lineNumber: 127,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/components/ui/select.tsx",
                lineNumber: 126,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ItemText"], {
                children: children
            }, void 0, false, {
                fileName: "[project]/src/components/ui/select.tsx",
                lineNumber: 131,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/select.tsx",
        lineNumber: 118,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c9 = SelectItem;
SelectItem.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Item"].displayName;
const SelectSeparator = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c10 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Separator"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("-mx-1 my-1 h-px bg-muted", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/select.tsx",
        lineNumber: 140,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c11 = SelectSeparator;
SelectSeparator.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Separator"].displayName;
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9, _c10, _c11;
__turbopack_context__.k.register(_c, "SelectTrigger$React.forwardRef");
__turbopack_context__.k.register(_c1, "SelectTrigger");
__turbopack_context__.k.register(_c2, "SelectScrollUpButton");
__turbopack_context__.k.register(_c3, "SelectScrollDownButton");
__turbopack_context__.k.register(_c4, "SelectContent$React.forwardRef");
__turbopack_context__.k.register(_c5, "SelectContent");
__turbopack_context__.k.register(_c6, "SelectLabel$React.forwardRef");
__turbopack_context__.k.register(_c7, "SelectLabel");
__turbopack_context__.k.register(_c8, "SelectItem$React.forwardRef");
__turbopack_context__.k.register(_c9, "SelectItem");
__turbopack_context__.k.register(_c10, "SelectSeparator$React.forwardRef");
__turbopack_context__.k.register(_c11, "SelectSeparator");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/textarea.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Textarea",
    ()=>Textarea
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
const Textarea = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = ({ className, ...props }, ref)=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
        ref: ref,
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/textarea.tsx",
        lineNumber: 12,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
});
_c1 = Textarea;
Textarea.displayName = "Textarea";
;
var _c, _c1;
__turbopack_context__.k.register(_c, "Textarea$React.forwardRef");
__turbopack_context__.k.register(_c1, "Textarea");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/checkbox.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Checkbox",
    ()=>Checkbox
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$checkbox$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-checkbox/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
;
const Checkbox = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$checkbox$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("grid place-content-center peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground", className),
        ...props,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$checkbox$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Indicator"], {
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("grid place-content-center text-current"),
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                className: "h-4 w-4"
            }, void 0, false, {
                fileName: "[project]/src/components/ui/checkbox.tsx",
                lineNumber: 24,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/src/components/ui/checkbox.tsx",
            lineNumber: 21,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/ui/checkbox.tsx",
        lineNumber: 13,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c1 = Checkbox;
Checkbox.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$checkbox$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"].displayName;
;
var _c, _c1;
__turbopack_context__.k.register(_c, "Checkbox$React.forwardRef");
__turbopack_context__.k.register(_c1, "Checkbox");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/medications/forms/MedicationForm.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MedicationForm",
    ()=>MedicationForm,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
/**
 * WF-MED-FORM-001 | MedicationForm.tsx - Medication Form Component
 * Purpose: Form for creating and editing medications
 * Upstream: Medication API | Dependencies: React, Form inputs
 * Downstream: Medication management | Called by: Add/Edit medication modals
 * Related: MedicationList, MedicationDetails
 * Exports: MedicationForm component | Key Features: Validation, submission
 * Last Updated: 2025-10-27 | File Type: .tsx
 * Critical Path: User input → Validation → API submission
 * LLM Context: Medication form component for White Cross healthcare platform
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/select.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$textarea$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/textarea.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$checkbox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/checkbox.tsx [app-client] (ecmascript)");
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
const MedicationForm = (t0)=>{
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(210);
    if ($[0] !== "35f206237033c796669196fc0e169125a384618c1ff949fab6c08e8c666509fc") {
        for(let $i = 0; $i < 210; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "35f206237033c796669196fc0e169125a384618c1ff949fab6c08e8c666509fc";
    }
    const { initialData: t1, onSubmit, onCancel, isLoading: t2, mode: t3 } = t0;
    let t4;
    if ($[1] !== t1) {
        t4 = t1 === undefined ? {} : t1;
        $[1] = t1;
        $[2] = t4;
    } else {
        t4 = $[2];
    }
    const initialData = t4;
    const isLoading = t2 === undefined ? false : t2;
    const mode = t3 === undefined ? "create" : t3;
    let t5;
    if ($[3] === Symbol.for("react.memo_cache_sentinel")) {
        t5 = new Date().toISOString().split("T");
        $[3] = t5;
    } else {
        t5 = $[3];
    }
    let t6;
    if ($[4] !== initialData) {
        t6 = {
            name: "",
            dosage: "",
            frequency: "",
            route: "oral",
            prescriber: "",
            startDate: t5[0],
            status: "active",
            isControlled: false,
            ...initialData
        };
        $[4] = initialData;
        $[5] = t6;
    } else {
        t6 = $[5];
    }
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(t6);
    let t7;
    if ($[6] === Symbol.for("react.memo_cache_sentinel")) {
        t7 = {};
        $[6] = t7;
    } else {
        t7 = $[6];
    }
    const [errors, setErrors] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(t7);
    let t8;
    if ($[7] !== formData.dosage || $[8] !== formData.frequency || $[9] !== formData.name || $[10] !== formData.prescriber || $[11] !== formData.startDate) {
        t8 = ()=>{
            const newErrors = {};
            if (!formData.name.trim()) {
                newErrors.name = "Medication name is required";
            }
            if (!formData.dosage.trim()) {
                newErrors.dosage = "Dosage is required";
            }
            if (!formData.frequency.trim()) {
                newErrors.frequency = "Frequency is required";
            }
            if (!formData.prescriber.trim()) {
                newErrors.prescriber = "Prescriber is required";
            }
            if (!formData.startDate) {
                newErrors.startDate = "Start date is required";
            }
            setErrors(newErrors);
            return Object.keys(newErrors).length === 0;
        };
        $[7] = formData.dosage;
        $[8] = formData.frequency;
        $[9] = formData.name;
        $[10] = formData.prescriber;
        $[11] = formData.startDate;
        $[12] = t8;
    } else {
        t8 = $[12];
    }
    const validate = t8;
    let t9;
    if ($[13] !== formData || $[14] !== onSubmit || $[15] !== validate) {
        t9 = async (e)=>{
            e.preventDefault();
            if (!validate()) {
                return;
            }
            ;
            try {
                await onSubmit(formData);
            } catch (t10) {
                const error = t10;
                console.error("Form submission error:", error);
            }
        };
        $[13] = formData;
        $[14] = onSubmit;
        $[15] = validate;
        $[16] = t9;
    } else {
        t9 = $[16];
    }
    const handleSubmit = t9;
    let t10;
    if ($[17] !== errors) {
        t10 = (field, value)=>{
            setFormData((prev)=>({
                    ...prev,
                    [field]: value
                }));
            if (errors[field]) {
                setErrors((prev_0)=>{
                    const newErrors_0 = {
                        ...prev_0
                    };
                    delete newErrors_0[field];
                    return newErrors_0;
                });
            }
        };
        $[17] = errors;
        $[18] = t10;
    } else {
        t10 = $[18];
    }
    const updateField = t10;
    let t11;
    if ($[19] === Symbol.for("react.memo_cache_sentinel")) {
        t11 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
            className: "text-lg font-medium text-gray-900",
            children: "Basic Information"
        }, void 0, false, {
            fileName: "[project]/src/components/medications/forms/MedicationForm.tsx",
            lineNumber: 215,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[19] = t11;
    } else {
        t11 = $[19];
    }
    let t12;
    if ($[20] === Symbol.for("react.memo_cache_sentinel")) {
        t12 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
            htmlFor: "name",
            className: "block text-sm font-medium text-gray-700 mb-1",
            children: "Medication Name *"
        }, void 0, false, {
            fileName: "[project]/src/components/medications/forms/MedicationForm.tsx",
            lineNumber: 222,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[20] = t12;
    } else {
        t12 = $[20];
    }
    let t13;
    if ($[21] !== updateField) {
        t13 = (e_0)=>updateField("name", e_0.target.value);
        $[21] = updateField;
        $[22] = t13;
    } else {
        t13 = $[22];
    }
    const t14 = !!errors.name;
    const t15 = errors.name ? "name-error" : undefined;
    let t16;
    if ($[23] !== formData.name || $[24] !== t13 || $[25] !== t14 || $[26] !== t15) {
        t16 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
            id: "name",
            value: formData.name,
            onChange: t13,
            placeholder: "Enter medication name",
            "aria-invalid": t14,
            "aria-describedby": t15
        }, void 0, false, {
            fileName: "[project]/src/components/medications/forms/MedicationForm.tsx",
            lineNumber: 239,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[23] = formData.name;
        $[24] = t13;
        $[25] = t14;
        $[26] = t15;
        $[27] = t16;
    } else {
        t16 = $[27];
    }
    let t17;
    if ($[28] !== errors.name) {
        t17 = errors.name && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            id: "name-error",
            className: "mt-1 text-sm text-red-600",
            children: errors.name
        }, void 0, false, {
            fileName: "[project]/src/components/medications/forms/MedicationForm.tsx",
            lineNumber: 250,
            columnNumber: 26
        }, ("TURBOPACK compile-time value", void 0));
        $[28] = errors.name;
        $[29] = t17;
    } else {
        t17 = $[29];
    }
    let t18;
    if ($[30] !== t16 || $[31] !== t17) {
        t18 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "col-span-2",
            children: [
                t12,
                t16,
                t17
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/medications/forms/MedicationForm.tsx",
            lineNumber: 258,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[30] = t16;
        $[31] = t17;
        $[32] = t18;
    } else {
        t18 = $[32];
    }
    let t19;
    if ($[33] === Symbol.for("react.memo_cache_sentinel")) {
        t19 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
            htmlFor: "genericName",
            className: "block text-sm font-medium text-gray-700 mb-1",
            children: "Generic Name"
        }, void 0, false, {
            fileName: "[project]/src/components/medications/forms/MedicationForm.tsx",
            lineNumber: 267,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[33] = t19;
    } else {
        t19 = $[33];
    }
    const t20 = formData.genericName || "";
    let t21;
    if ($[34] !== updateField) {
        t21 = (e_1)=>updateField("genericName", e_1.target.value);
        $[34] = updateField;
        $[35] = t21;
    } else {
        t21 = $[35];
    }
    let t22;
    if ($[36] !== t20 || $[37] !== t21) {
        t22 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                t19,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                    id: "genericName",
                    value: t20,
                    onChange: t21,
                    placeholder: "Generic name"
                }, void 0, false, {
                    fileName: "[project]/src/components/medications/forms/MedicationForm.tsx",
                    lineNumber: 283,
                    columnNumber: 21
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/medications/forms/MedicationForm.tsx",
            lineNumber: 283,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[36] = t20;
        $[37] = t21;
        $[38] = t22;
    } else {
        t22 = $[38];
    }
    let t23;
    if ($[39] === Symbol.for("react.memo_cache_sentinel")) {
        t23 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
            htmlFor: "brandName",
            className: "block text-sm font-medium text-gray-700 mb-1",
            children: "Brand Name"
        }, void 0, false, {
            fileName: "[project]/src/components/medications/forms/MedicationForm.tsx",
            lineNumber: 292,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[39] = t23;
    } else {
        t23 = $[39];
    }
    const t24 = formData.brandName || "";
    let t25;
    if ($[40] !== updateField) {
        t25 = (e_2)=>updateField("brandName", e_2.target.value);
        $[40] = updateField;
        $[41] = t25;
    } else {
        t25 = $[41];
    }
    let t26;
    if ($[42] !== t24 || $[43] !== t25) {
        t26 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                t23,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                    id: "brandName",
                    value: t24,
                    onChange: t25,
                    placeholder: "Brand name"
                }, void 0, false, {
                    fileName: "[project]/src/components/medications/forms/MedicationForm.tsx",
                    lineNumber: 308,
                    columnNumber: 21
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/medications/forms/MedicationForm.tsx",
            lineNumber: 308,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[42] = t24;
        $[43] = t25;
        $[44] = t26;
    } else {
        t26 = $[44];
    }
    let t27;
    if ($[45] === Symbol.for("react.memo_cache_sentinel")) {
        t27 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
            htmlFor: "dosage",
            className: "block text-sm font-medium text-gray-700 mb-1",
            children: "Dosage *"
        }, void 0, false, {
            fileName: "[project]/src/components/medications/forms/MedicationForm.tsx",
            lineNumber: 317,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[45] = t27;
    } else {
        t27 = $[45];
    }
    let t28;
    if ($[46] !== updateField) {
        t28 = (e_3)=>updateField("dosage", e_3.target.value);
        $[46] = updateField;
        $[47] = t28;
    } else {
        t28 = $[47];
    }
    const t29 = !!errors.dosage;
    const t30 = errors.dosage ? "dosage-error" : undefined;
    let t31;
    if ($[48] !== formData.dosage || $[49] !== t28 || $[50] !== t29 || $[51] !== t30) {
        t31 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
            id: "dosage",
            value: formData.dosage,
            onChange: t28,
            placeholder: "e.g., 500mg",
            "aria-invalid": t29,
            "aria-describedby": t30
        }, void 0, false, {
            fileName: "[project]/src/components/medications/forms/MedicationForm.tsx",
            lineNumber: 334,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[48] = formData.dosage;
        $[49] = t28;
        $[50] = t29;
        $[51] = t30;
        $[52] = t31;
    } else {
        t31 = $[52];
    }
    let t32;
    if ($[53] !== errors.dosage) {
        t32 = errors.dosage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            id: "dosage-error",
            className: "mt-1 text-sm text-red-600",
            children: errors.dosage
        }, void 0, false, {
            fileName: "[project]/src/components/medications/forms/MedicationForm.tsx",
            lineNumber: 345,
            columnNumber: 28
        }, ("TURBOPACK compile-time value", void 0));
        $[53] = errors.dosage;
        $[54] = t32;
    } else {
        t32 = $[54];
    }
    let t33;
    if ($[55] !== t31 || $[56] !== t32) {
        t33 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                t27,
                t31,
                t32
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/medications/forms/MedicationForm.tsx",
            lineNumber: 353,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[55] = t31;
        $[56] = t32;
        $[57] = t33;
    } else {
        t33 = $[57];
    }
    let t34;
    if ($[58] === Symbol.for("react.memo_cache_sentinel")) {
        t34 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
            htmlFor: "frequency",
            className: "block text-sm font-medium text-gray-700 mb-1",
            children: "Frequency *"
        }, void 0, false, {
            fileName: "[project]/src/components/medications/forms/MedicationForm.tsx",
            lineNumber: 362,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[58] = t34;
    } else {
        t34 = $[58];
    }
    let t35;
    if ($[59] !== updateField) {
        t35 = (e_4)=>updateField("frequency", e_4.target.value);
        $[59] = updateField;
        $[60] = t35;
    } else {
        t35 = $[60];
    }
    const t36 = !!errors.frequency;
    const t37 = errors.frequency ? "frequency-error" : undefined;
    let t38;
    if ($[61] !== formData.frequency || $[62] !== t35 || $[63] !== t36 || $[64] !== t37) {
        t38 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
            id: "frequency",
            value: formData.frequency,
            onChange: t35,
            placeholder: "e.g., Twice daily",
            "aria-invalid": t36,
            "aria-describedby": t37
        }, void 0, false, {
            fileName: "[project]/src/components/medications/forms/MedicationForm.tsx",
            lineNumber: 379,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[61] = formData.frequency;
        $[62] = t35;
        $[63] = t36;
        $[64] = t37;
        $[65] = t38;
    } else {
        t38 = $[65];
    }
    let t39;
    if ($[66] !== errors.frequency) {
        t39 = errors.frequency && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            id: "frequency-error",
            className: "mt-1 text-sm text-red-600",
            children: errors.frequency
        }, void 0, false, {
            fileName: "[project]/src/components/medications/forms/MedicationForm.tsx",
            lineNumber: 390,
            columnNumber: 31
        }, ("TURBOPACK compile-time value", void 0));
        $[66] = errors.frequency;
        $[67] = t39;
    } else {
        t39 = $[67];
    }
    let t40;
    if ($[68] !== t38 || $[69] !== t39) {
        t40 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                t34,
                t38,
                t39
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/medications/forms/MedicationForm.tsx",
            lineNumber: 398,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[68] = t38;
        $[69] = t39;
        $[70] = t40;
    } else {
        t40 = $[70];
    }
    let t41;
    if ($[71] === Symbol.for("react.memo_cache_sentinel")) {
        t41 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
            htmlFor: "route",
            className: "block text-sm font-medium text-gray-700 mb-1",
            children: "Route of Administration *"
        }, void 0, false, {
            fileName: "[project]/src/components/medications/forms/MedicationForm.tsx",
            lineNumber: 407,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[71] = t41;
    } else {
        t41 = $[71];
    }
    let t42;
    if ($[72] !== updateField) {
        t42 = (e_5)=>updateField("route", e_5.target.value);
        $[72] = updateField;
        $[73] = t42;
    } else {
        t42 = $[73];
    }
    let t43;
    let t44;
    let t45;
    let t46;
    let t47;
    let t48;
    let t49;
    let t50;
    if ($[74] === Symbol.for("react.memo_cache_sentinel")) {
        t43 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
            value: "oral",
            children: "Oral"
        }, void 0, false, {
            fileName: "[project]/src/components/medications/forms/MedicationForm.tsx",
            lineNumber: 429,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        t44 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
            value: "topical",
            children: "Topical"
        }, void 0, false, {
            fileName: "[project]/src/components/medications/forms/MedicationForm.tsx",
            lineNumber: 430,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        t45 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
            value: "inhaled",
            children: "Inhaled"
        }, void 0, false, {
            fileName: "[project]/src/components/medications/forms/MedicationForm.tsx",
            lineNumber: 431,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        t46 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
            value: "injection",
            children: "Injection"
        }, void 0, false, {
            fileName: "[project]/src/components/medications/forms/MedicationForm.tsx",
            lineNumber: 432,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        t47 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
            value: "sublingual",
            children: "Sublingual"
        }, void 0, false, {
            fileName: "[project]/src/components/medications/forms/MedicationForm.tsx",
            lineNumber: 433,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        t48 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
            value: "rectal",
            children: "Rectal"
        }, void 0, false, {
            fileName: "[project]/src/components/medications/forms/MedicationForm.tsx",
            lineNumber: 434,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        t49 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
            value: "transdermal",
            children: "Transdermal"
        }, void 0, false, {
            fileName: "[project]/src/components/medications/forms/MedicationForm.tsx",
            lineNumber: 435,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        t50 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
            value: "other",
            children: "Other"
        }, void 0, false, {
            fileName: "[project]/src/components/medications/forms/MedicationForm.tsx",
            lineNumber: 436,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[74] = t43;
        $[75] = t44;
        $[76] = t45;
        $[77] = t46;
        $[78] = t47;
        $[79] = t48;
        $[80] = t49;
        $[81] = t50;
    } else {
        t43 = $[74];
        t44 = $[75];
        t45 = $[76];
        t46 = $[77];
        t47 = $[78];
        t48 = $[79];
        t49 = $[80];
        t50 = $[81];
    }
    let t51;
    if ($[82] !== formData.route || $[83] !== t42) {
        t51 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                t41,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Select"], {
                    id: "route",
                    value: formData.route,
                    onChange: t42,
                    children: [
                        t43,
                        t44,
                        t45,
                        t46,
                        t47,
                        t48,
                        t49,
                        t50
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/medications/forms/MedicationForm.tsx",
                    lineNumber: 457,
                    columnNumber: 21
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/medications/forms/MedicationForm.tsx",
            lineNumber: 457,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[82] = formData.route;
        $[83] = t42;
        $[84] = t51;
    } else {
        t51 = $[84];
    }
    let t52;
    if ($[85] === Symbol.for("react.memo_cache_sentinel")) {
        t52 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
            htmlFor: "status",
            className: "block text-sm font-medium text-gray-700 mb-1",
            children: "Status"
        }, void 0, false, {
            fileName: "[project]/src/components/medications/forms/MedicationForm.tsx",
            lineNumber: 466,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[85] = t52;
    } else {
        t52 = $[85];
    }
    let t53;
    if ($[86] !== updateField) {
        t53 = (e_6)=>updateField("status", e_6.target.value);
        $[86] = updateField;
        $[87] = t53;
    } else {
        t53 = $[87];
    }
    let t54;
    let t55;
    let t56;
    let t57;
    if ($[88] === Symbol.for("react.memo_cache_sentinel")) {
        t54 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
            value: "active",
            children: "Active"
        }, void 0, false, {
            fileName: "[project]/src/components/medications/forms/MedicationForm.tsx",
            lineNumber: 484,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        t55 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
            value: "inactive",
            children: "Inactive"
        }, void 0, false, {
            fileName: "[project]/src/components/medications/forms/MedicationForm.tsx",
            lineNumber: 485,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        t56 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
            value: "discontinued",
            children: "Discontinued"
        }, void 0, false, {
            fileName: "[project]/src/components/medications/forms/MedicationForm.tsx",
            lineNumber: 486,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        t57 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
            value: "pending",
            children: "Pending"
        }, void 0, false, {
            fileName: "[project]/src/components/medications/forms/MedicationForm.tsx",
            lineNumber: 487,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[88] = t54;
        $[89] = t55;
        $[90] = t56;
        $[91] = t57;
    } else {
        t54 = $[88];
        t55 = $[89];
        t56 = $[90];
        t57 = $[91];
    }
    let t58;
    if ($[92] !== formData.status || $[93] !== t53) {
        t58 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                t52,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Select"], {
                    id: "status",
                    value: formData.status,
                    onChange: t53,
                    children: [
                        t54,
                        t55,
                        t56,
                        t57
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/medications/forms/MedicationForm.tsx",
                    lineNumber: 500,
                    columnNumber: 21
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/medications/forms/MedicationForm.tsx",
            lineNumber: 500,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[92] = formData.status;
        $[93] = t53;
        $[94] = t58;
    } else {
        t58 = $[94];
    }
    let t59;
    if ($[95] !== t18 || $[96] !== t22 || $[97] !== t26 || $[98] !== t33 || $[99] !== t40 || $[100] !== t51 || $[101] !== t58) {
        t59 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-4",
            children: [
                t11,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                    children: [
                        t18,
                        t22,
                        t26,
                        t33,
                        t40,
                        t51,
                        t58
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/medications/forms/MedicationForm.tsx",
                    lineNumber: 509,
                    columnNumber: 43
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/medications/forms/MedicationForm.tsx",
            lineNumber: 509,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[95] = t18;
        $[96] = t22;
        $[97] = t26;
        $[98] = t33;
        $[99] = t40;
        $[100] = t51;
        $[101] = t58;
        $[102] = t59;
    } else {
        t59 = $[102];
    }
    let t60;
    if ($[103] === Symbol.for("react.memo_cache_sentinel")) {
        t60 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
            className: "text-lg font-medium text-gray-900",
            children: "Prescriber Information"
        }, void 0, false, {
            fileName: "[project]/src/components/medications/forms/MedicationForm.tsx",
            lineNumber: 523,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[103] = t60;
    } else {
        t60 = $[103];
    }
    let t61;
    if ($[104] === Symbol.for("react.memo_cache_sentinel")) {
        t61 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
            htmlFor: "prescriber",
            className: "block text-sm font-medium text-gray-700 mb-1",
            children: "Prescriber Name *"
        }, void 0, false, {
            fileName: "[project]/src/components/medications/forms/MedicationForm.tsx",
            lineNumber: 530,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[104] = t61;
    } else {
        t61 = $[104];
    }
    let t62;
    if ($[105] !== updateField) {
        t62 = (e_7)=>updateField("prescriber", e_7.target.value);
        $[105] = updateField;
        $[106] = t62;
    } else {
        t62 = $[106];
    }
    const t63 = !!errors.prescriber;
    const t64 = errors.prescriber ? "prescriber-error" : undefined;
    let t65;
    if ($[107] !== formData.prescriber || $[108] !== t62 || $[109] !== t63 || $[110] !== t64) {
        t65 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
            id: "prescriber",
            value: formData.prescriber,
            onChange: t62,
            placeholder: "Dr. Smith",
            "aria-invalid": t63,
            "aria-describedby": t64
        }, void 0, false, {
            fileName: "[project]/src/components/medications/forms/MedicationForm.tsx",
            lineNumber: 547,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[107] = formData.prescriber;
        $[108] = t62;
        $[109] = t63;
        $[110] = t64;
        $[111] = t65;
    } else {
        t65 = $[111];
    }
    let t66;
    if ($[112] !== errors.prescriber) {
        t66 = errors.prescriber && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            id: "prescriber-error",
            className: "mt-1 text-sm text-red-600",
            children: errors.prescriber
        }, void 0, false, {
            fileName: "[project]/src/components/medications/forms/MedicationForm.tsx",
            lineNumber: 558,
            columnNumber: 32
        }, ("TURBOPACK compile-time value", void 0));
        $[112] = errors.prescriber;
        $[113] = t66;
    } else {
        t66 = $[113];
    }
    let t67;
    if ($[114] !== t65 || $[115] !== t66) {
        t67 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                t61,
                t65,
                t66
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/medications/forms/MedicationForm.tsx",
            lineNumber: 566,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[114] = t65;
        $[115] = t66;
        $[116] = t67;
    } else {
        t67 = $[116];
    }
    let t68;
    if ($[117] === Symbol.for("react.memo_cache_sentinel")) {
        t68 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
            htmlFor: "prescriberNPI",
            className: "block text-sm font-medium text-gray-700 mb-1",
            children: "Prescriber NPI"
        }, void 0, false, {
            fileName: "[project]/src/components/medications/forms/MedicationForm.tsx",
            lineNumber: 575,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[117] = t68;
    } else {
        t68 = $[117];
    }
    const t69 = formData.prescriberNPI || "";
    let t70;
    if ($[118] !== updateField) {
        t70 = (e_8)=>updateField("prescriberNPI", e_8.target.value);
        $[118] = updateField;
        $[119] = t70;
    } else {
        t70 = $[119];
    }
    let t71;
    if ($[120] !== t69 || $[121] !== t70) {
        t71 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                t68,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                    id: "prescriberNPI",
                    value: t69,
                    onChange: t70,
                    placeholder: "10-digit NPI"
                }, void 0, false, {
                    fileName: "[project]/src/components/medications/forms/MedicationForm.tsx",
                    lineNumber: 591,
                    columnNumber: 21
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/medications/forms/MedicationForm.tsx",
            lineNumber: 591,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[120] = t69;
        $[121] = t70;
        $[122] = t71;
    } else {
        t71 = $[122];
    }
    let t72;
    if ($[123] === Symbol.for("react.memo_cache_sentinel")) {
        t72 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
            htmlFor: "pharmacy",
            className: "block text-sm font-medium text-gray-700 mb-1",
            children: "Pharmacy"
        }, void 0, false, {
            fileName: "[project]/src/components/medications/forms/MedicationForm.tsx",
            lineNumber: 600,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[123] = t72;
    } else {
        t72 = $[123];
    }
    const t73 = formData.pharmacy || "";
    let t74;
    if ($[124] !== updateField) {
        t74 = (e_9)=>updateField("pharmacy", e_9.target.value);
        $[124] = updateField;
        $[125] = t74;
    } else {
        t74 = $[125];
    }
    let t75;
    if ($[126] !== t73 || $[127] !== t74) {
        t75 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                t72,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                    id: "pharmacy",
                    value: t73,
                    onChange: t74,
                    placeholder: "Pharmacy name"
                }, void 0, false, {
                    fileName: "[project]/src/components/medications/forms/MedicationForm.tsx",
                    lineNumber: 616,
                    columnNumber: 21
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/medications/forms/MedicationForm.tsx",
            lineNumber: 616,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[126] = t73;
        $[127] = t74;
        $[128] = t75;
    } else {
        t75 = $[128];
    }
    let t76;
    if ($[129] === Symbol.for("react.memo_cache_sentinel")) {
        t76 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
            htmlFor: "prescriptionNumber",
            className: "block text-sm font-medium text-gray-700 mb-1",
            children: "Prescription Number"
        }, void 0, false, {
            fileName: "[project]/src/components/medications/forms/MedicationForm.tsx",
            lineNumber: 625,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[129] = t76;
    } else {
        t76 = $[129];
    }
    const t77 = formData.prescriptionNumber || "";
    let t78;
    if ($[130] !== updateField) {
        t78 = (e_10)=>updateField("prescriptionNumber", e_10.target.value);
        $[130] = updateField;
        $[131] = t78;
    } else {
        t78 = $[131];
    }
    let t79;
    if ($[132] !== t77 || $[133] !== t78) {
        t79 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                t76,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                    id: "prescriptionNumber",
                    value: t77,
                    onChange: t78,
                    placeholder: "Rx number"
                }, void 0, false, {
                    fileName: "[project]/src/components/medications/forms/MedicationForm.tsx",
                    lineNumber: 641,
                    columnNumber: 21
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/medications/forms/MedicationForm.tsx",
            lineNumber: 641,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[132] = t77;
        $[133] = t78;
        $[134] = t79;
    } else {
        t79 = $[134];
    }
    let t80;
    if ($[135] !== t67 || $[136] !== t71 || $[137] !== t75 || $[138] !== t79) {
        t80 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-4",
            children: [
                t60,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                    children: [
                        t67,
                        t71,
                        t75,
                        t79
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/medications/forms/MedicationForm.tsx",
                    lineNumber: 650,
                    columnNumber: 43
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/medications/forms/MedicationForm.tsx",
            lineNumber: 650,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[135] = t67;
        $[136] = t71;
        $[137] = t75;
        $[138] = t79;
        $[139] = t80;
    } else {
        t80 = $[139];
    }
    let t81;
    if ($[140] === Symbol.for("react.memo_cache_sentinel")) {
        t81 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
            className: "text-lg font-medium text-gray-900",
            children: "Treatment Period"
        }, void 0, false, {
            fileName: "[project]/src/components/medications/forms/MedicationForm.tsx",
            lineNumber: 661,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[140] = t81;
    } else {
        t81 = $[140];
    }
    let t82;
    if ($[141] === Symbol.for("react.memo_cache_sentinel")) {
        t82 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
            htmlFor: "startDate",
            className: "block text-sm font-medium text-gray-700 mb-1",
            children: "Start Date *"
        }, void 0, false, {
            fileName: "[project]/src/components/medications/forms/MedicationForm.tsx",
            lineNumber: 668,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[141] = t82;
    } else {
        t82 = $[141];
    }
    let t83;
    if ($[142] !== updateField) {
        t83 = (e_11)=>updateField("startDate", e_11.target.value);
        $[142] = updateField;
        $[143] = t83;
    } else {
        t83 = $[143];
    }
    const t84 = !!errors.startDate;
    const t85 = errors.startDate ? "startDate-error" : undefined;
    let t86;
    if ($[144] !== formData.startDate || $[145] !== t83 || $[146] !== t84 || $[147] !== t85) {
        t86 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
            id: "startDate",
            type: "date",
            value: formData.startDate,
            onChange: t83,
            "aria-invalid": t84,
            "aria-describedby": t85
        }, void 0, false, {
            fileName: "[project]/src/components/medications/forms/MedicationForm.tsx",
            lineNumber: 685,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[144] = formData.startDate;
        $[145] = t83;
        $[146] = t84;
        $[147] = t85;
        $[148] = t86;
    } else {
        t86 = $[148];
    }
    let t87;
    if ($[149] !== errors.startDate) {
        t87 = errors.startDate && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            id: "startDate-error",
            className: "mt-1 text-sm text-red-600",
            children: errors.startDate
        }, void 0, false, {
            fileName: "[project]/src/components/medications/forms/MedicationForm.tsx",
            lineNumber: 696,
            columnNumber: 31
        }, ("TURBOPACK compile-time value", void 0));
        $[149] = errors.startDate;
        $[150] = t87;
    } else {
        t87 = $[150];
    }
    let t88;
    if ($[151] !== t86 || $[152] !== t87) {
        t88 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                t82,
                t86,
                t87
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/medications/forms/MedicationForm.tsx",
            lineNumber: 704,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[151] = t86;
        $[152] = t87;
        $[153] = t88;
    } else {
        t88 = $[153];
    }
    let t89;
    if ($[154] === Symbol.for("react.memo_cache_sentinel")) {
        t89 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
            htmlFor: "endDate",
            className: "block text-sm font-medium text-gray-700 mb-1",
            children: "End Date (Optional)"
        }, void 0, false, {
            fileName: "[project]/src/components/medications/forms/MedicationForm.tsx",
            lineNumber: 713,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[154] = t89;
    } else {
        t89 = $[154];
    }
    const t90 = formData.endDate || "";
    let t91;
    if ($[155] !== updateField) {
        t91 = (e_12)=>updateField("endDate", e_12.target.value);
        $[155] = updateField;
        $[156] = t91;
    } else {
        t91 = $[156];
    }
    let t92;
    if ($[157] !== t90 || $[158] !== t91) {
        t92 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                t89,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                    id: "endDate",
                    type: "date",
                    value: t90,
                    onChange: t91
                }, void 0, false, {
                    fileName: "[project]/src/components/medications/forms/MedicationForm.tsx",
                    lineNumber: 729,
                    columnNumber: 21
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/medications/forms/MedicationForm.tsx",
            lineNumber: 729,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[157] = t90;
        $[158] = t91;
        $[159] = t92;
    } else {
        t92 = $[159];
    }
    let t93;
    if ($[160] !== t88 || $[161] !== t92) {
        t93 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-4",
            children: [
                t81,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                    children: [
                        t88,
                        t92
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/medications/forms/MedicationForm.tsx",
                    lineNumber: 738,
                    columnNumber: 43
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/medications/forms/MedicationForm.tsx",
            lineNumber: 738,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[160] = t88;
        $[161] = t92;
        $[162] = t93;
    } else {
        t93 = $[162];
    }
    let t94;
    if ($[163] !== updateField) {
        t94 = (e_13)=>updateField("isControlled", e_13.target.checked);
        $[163] = updateField;
        $[164] = t94;
    } else {
        t94 = $[164];
    }
    let t95;
    if ($[165] !== formData.isControlled || $[166] !== t94) {
        t95 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$checkbox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Checkbox"], {
            id: "isControlled",
            checked: formData.isControlled,
            onChange: t94
        }, void 0, false, {
            fileName: "[project]/src/components/medications/forms/MedicationForm.tsx",
            lineNumber: 755,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[165] = formData.isControlled;
        $[166] = t94;
        $[167] = t95;
    } else {
        t95 = $[167];
    }
    let t96;
    if ($[168] === Symbol.for("react.memo_cache_sentinel")) {
        t96 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
            htmlFor: "isControlled",
            className: "text-sm font-medium text-gray-700",
            children: "Controlled Substance"
        }, void 0, false, {
            fileName: "[project]/src/components/medications/forms/MedicationForm.tsx",
            lineNumber: 764,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[168] = t96;
    } else {
        t96 = $[168];
    }
    let t97;
    if ($[169] !== t95) {
        t97 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center gap-2",
            children: [
                t95,
                t96
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/medications/forms/MedicationForm.tsx",
            lineNumber: 771,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[169] = t95;
        $[170] = t97;
    } else {
        t97 = $[170];
    }
    let t98;
    if ($[171] !== formData.controlledSubstanceSchedule || $[172] !== formData.isControlled || $[173] !== updateField) {
        t98 = formData.isControlled && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "ml-6",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                    htmlFor: "schedule",
                    className: "block text-sm font-medium text-gray-700 mb-1",
                    children: "DEA Schedule"
                }, void 0, false, {
                    fileName: "[project]/src/components/medications/forms/MedicationForm.tsx",
                    lineNumber: 779,
                    columnNumber: 58
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Select"], {
                    id: "schedule",
                    value: formData.controlledSubstanceSchedule || "",
                    onChange: (e_14)=>updateField("controlledSubstanceSchedule", e_14.target.value),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                            value: "",
                            children: "Select schedule"
                        }, void 0, false, {
                            fileName: "[project]/src/components/medications/forms/MedicationForm.tsx",
                            lineNumber: 779,
                            columnNumber: 315
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                            value: "I",
                            children: "Schedule I"
                        }, void 0, false, {
                            fileName: "[project]/src/components/medications/forms/MedicationForm.tsx",
                            lineNumber: 779,
                            columnNumber: 356
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                            value: "II",
                            children: "Schedule II"
                        }, void 0, false, {
                            fileName: "[project]/src/components/medications/forms/MedicationForm.tsx",
                            lineNumber: 779,
                            columnNumber: 393
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                            value: "III",
                            children: "Schedule III"
                        }, void 0, false, {
                            fileName: "[project]/src/components/medications/forms/MedicationForm.tsx",
                            lineNumber: 779,
                            columnNumber: 432
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                            value: "IV",
                            children: "Schedule IV"
                        }, void 0, false, {
                            fileName: "[project]/src/components/medications/forms/MedicationForm.tsx",
                            lineNumber: 779,
                            columnNumber: 473
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                            value: "V",
                            children: "Schedule V"
                        }, void 0, false, {
                            fileName: "[project]/src/components/medications/forms/MedicationForm.tsx",
                            lineNumber: 779,
                            columnNumber: 512
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/medications/forms/MedicationForm.tsx",
                    lineNumber: 779,
                    columnNumber: 161
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/medications/forms/MedicationForm.tsx",
            lineNumber: 779,
            columnNumber: 36
        }, ("TURBOPACK compile-time value", void 0));
        $[171] = formData.controlledSubstanceSchedule;
        $[172] = formData.isControlled;
        $[173] = updateField;
        $[174] = t98;
    } else {
        t98 = $[174];
    }
    let t99;
    if ($[175] !== t97 || $[176] !== t98) {
        t99 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-4",
            children: [
                t97,
                t98
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/medications/forms/MedicationForm.tsx",
            lineNumber: 789,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[175] = t97;
        $[176] = t98;
        $[177] = t99;
    } else {
        t99 = $[177];
    }
    let t100;
    if ($[178] === Symbol.for("react.memo_cache_sentinel")) {
        t100 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
            htmlFor: "instructions",
            className: "block text-sm font-medium text-gray-700 mb-1",
            children: "Administration Instructions"
        }, void 0, false, {
            fileName: "[project]/src/components/medications/forms/MedicationForm.tsx",
            lineNumber: 798,
            columnNumber: 12
        }, ("TURBOPACK compile-time value", void 0));
        $[178] = t100;
    } else {
        t100 = $[178];
    }
    const t101 = formData.instructions || "";
    let t102;
    if ($[179] !== updateField) {
        t102 = (e_15)=>updateField("instructions", e_15.target.value);
        $[179] = updateField;
        $[180] = t102;
    } else {
        t102 = $[180];
    }
    let t103;
    if ($[181] !== t101 || $[182] !== t102) {
        t103 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                t100,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$textarea$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Textarea"], {
                    id: "instructions",
                    value: t101,
                    onChange: t102,
                    placeholder: "Special instructions for administration...",
                    rows: 3
                }, void 0, false, {
                    fileName: "[project]/src/components/medications/forms/MedicationForm.tsx",
                    lineNumber: 814,
                    columnNumber: 23
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/medications/forms/MedicationForm.tsx",
            lineNumber: 814,
            columnNumber: 12
        }, ("TURBOPACK compile-time value", void 0));
        $[181] = t101;
        $[182] = t102;
        $[183] = t103;
    } else {
        t103 = $[183];
    }
    let t104;
    if ($[184] === Symbol.for("react.memo_cache_sentinel")) {
        t104 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
            htmlFor: "notes",
            className: "block text-sm font-medium text-gray-700 mb-1",
            children: "Notes"
        }, void 0, false, {
            fileName: "[project]/src/components/medications/forms/MedicationForm.tsx",
            lineNumber: 823,
            columnNumber: 12
        }, ("TURBOPACK compile-time value", void 0));
        $[184] = t104;
    } else {
        t104 = $[184];
    }
    const t105 = formData.notes || "";
    let t106;
    if ($[185] !== updateField) {
        t106 = (e_16)=>updateField("notes", e_16.target.value);
        $[185] = updateField;
        $[186] = t106;
    } else {
        t106 = $[186];
    }
    let t107;
    if ($[187] !== t105 || $[188] !== t106) {
        t107 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                t104,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$textarea$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Textarea"], {
                    id: "notes",
                    value: t105,
                    onChange: t106,
                    placeholder: "Additional notes...",
                    rows: 3
                }, void 0, false, {
                    fileName: "[project]/src/components/medications/forms/MedicationForm.tsx",
                    lineNumber: 839,
                    columnNumber: 23
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/medications/forms/MedicationForm.tsx",
            lineNumber: 839,
            columnNumber: 12
        }, ("TURBOPACK compile-time value", void 0));
        $[187] = t105;
        $[188] = t106;
        $[189] = t107;
    } else {
        t107 = $[189];
    }
    let t108;
    if ($[190] !== t103 || $[191] !== t107) {
        t108 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-4",
            children: [
                t103,
                t107
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/medications/forms/MedicationForm.tsx",
            lineNumber: 848,
            columnNumber: 12
        }, ("TURBOPACK compile-time value", void 0));
        $[190] = t103;
        $[191] = t107;
        $[192] = t108;
    } else {
        t108 = $[192];
    }
    let t109;
    if ($[193] !== isLoading || $[194] !== onCancel) {
        t109 = onCancel && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
            type: "button",
            variant: "outline",
            onClick: onCancel,
            disabled: isLoading,
            children: "Cancel"
        }, void 0, false, {
            fileName: "[project]/src/components/medications/forms/MedicationForm.tsx",
            lineNumber: 857,
            columnNumber: 24
        }, ("TURBOPACK compile-time value", void 0));
        $[193] = isLoading;
        $[194] = onCancel;
        $[195] = t109;
    } else {
        t109 = $[195];
    }
    const t110 = mode === "create" ? "Create Medication" : "Update Medication";
    let t111;
    if ($[196] !== isLoading || $[197] !== t110) {
        t111 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
            type: "submit",
            variant: "default",
            loading: isLoading,
            children: t110
        }, void 0, false, {
            fileName: "[project]/src/components/medications/forms/MedicationForm.tsx",
            lineNumber: 867,
            columnNumber: 12
        }, ("TURBOPACK compile-time value", void 0));
        $[196] = isLoading;
        $[197] = t110;
        $[198] = t111;
    } else {
        t111 = $[198];
    }
    let t112;
    if ($[199] !== t109 || $[200] !== t111) {
        t112 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-end gap-3 pt-4 border-t border-gray-200",
            children: [
                t109,
                t111
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/medications/forms/MedicationForm.tsx",
            lineNumber: 876,
            columnNumber: 12
        }, ("TURBOPACK compile-time value", void 0));
        $[199] = t109;
        $[200] = t111;
        $[201] = t112;
    } else {
        t112 = $[201];
    }
    let t113;
    if ($[202] !== handleSubmit || $[203] !== t108 || $[204] !== t112 || $[205] !== t59 || $[206] !== t80 || $[207] !== t93 || $[208] !== t99) {
        t113 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
            onSubmit: handleSubmit,
            className: "space-y-6",
            children: [
                t59,
                t80,
                t93,
                t99,
                t108,
                t112
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/medications/forms/MedicationForm.tsx",
            lineNumber: 885,
            columnNumber: 12
        }, ("TURBOPACK compile-time value", void 0));
        $[202] = handleSubmit;
        $[203] = t108;
        $[204] = t112;
        $[205] = t59;
        $[206] = t80;
        $[207] = t93;
        $[208] = t99;
        $[209] = t113;
    } else {
        t113 = $[209];
    }
    return t113;
};
_s(MedicationForm, "IluN32ij2OtwOAMr67ijToF9sTI=");
_c = MedicationForm;
MedicationForm.displayName = 'MedicationForm';
const __TURBOPACK__default__export__ = MedicationForm;
var _c;
__turbopack_context__.k.register(_c, "MedicationForm");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_components_7dab41ea._.js.map