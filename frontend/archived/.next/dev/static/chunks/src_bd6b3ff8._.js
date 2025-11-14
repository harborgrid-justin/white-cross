(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/ui/input.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Input",
    ()=>Input
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
const Input = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = ({ className, type, ...props }, ref)=>{
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
_c1 = Input;
Input.displayName = "Input";
;
var _c, _c1;
__turbopack_context__.k.register(_c, "Input$React.forwardRef");
__turbopack_context__.k.register(_c1, "Input");
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
"[project]/src/components/ui/table.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Table",
    ()=>Table,
    "TableBody",
    ()=>TableBody,
    "TableCaption",
    ()=>TableCaption,
    "TableCell",
    ()=>TableCell,
    "TableEmptyState",
    ()=>TableEmptyState,
    "TableFooter",
    ()=>TableFooter,
    "TableHead",
    ()=>TableHead,
    "TableHeader",
    ()=>TableHeader,
    "TableLoadingState",
    ()=>TableLoadingState,
    "TableRow",
    ()=>TableRow
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
const Table = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative w-full overflow-auto",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
            ref: ref,
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("w-full caption-bottom text-sm", className),
            ...props
        }, void 0, false, {
            fileName: "[project]/src/components/ui/table.tsx",
            lineNumber: 12,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/ui/table.tsx",
        lineNumber: 11,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c1 = Table;
Table.displayName = "Table";
const TableHeader = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c2 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("[&_tr]:border-b", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/table.tsx",
        lineNumber: 25,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c3 = TableHeader;
TableHeader.displayName = "TableHeader";
const TableBody = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c4 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("[&_tr:last-child]:border-0", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/table.tsx",
        lineNumber: 33,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c5 = TableBody;
TableBody.displayName = "TableBody";
const TableFooter = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c6 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tfoot", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/table.tsx",
        lineNumber: 45,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c7 = TableFooter;
TableFooter.displayName = "TableFooter";
const TableRow = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/table.tsx",
        lineNumber: 60,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c8 = TableRow;
TableRow.displayName = "TableRow";
const TableHead = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c9 = ({ className, scope = "col", ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
        ref: ref,
        scope: scope,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/table.tsx",
        lineNumber: 75,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c10 = TableHead;
TableHead.displayName = "TableHead";
const TableCell = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/table.tsx",
        lineNumber: 91,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c11 = TableCell;
TableCell.displayName = "TableCell";
const TableCaption = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c12 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("caption", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("mt-4 text-sm text-muted-foreground", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/table.tsx",
        lineNumber: 106,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c13 = TableCaption;
TableCaption.displayName = "TableCaption";
const TableEmptyState = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c14 = ({ className, colSpan = 1, message = "No data available", ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TableRow, {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("hover:bg-transparent", className),
        ...props,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TableCell, {
            colSpan: colSpan,
            className: "h-24 text-center",
            children: message
        }, void 0, false, {
            fileName: "[project]/src/components/ui/table.tsx",
            lineNumber: 122,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/ui/table.tsx",
        lineNumber: 121,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c15 = TableEmptyState;
TableEmptyState.displayName = "TableEmptyState";
const TableLoadingState = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c16 = ({ className, colSpan = 1, message = "Loading...", ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TableRow, {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("hover:bg-transparent", className),
        ...props,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TableCell, {
            colSpan: colSpan,
            className: "h-24 text-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-center space-x-2",
                role: "status",
                "aria-live": "polite",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "animate-spin rounded-full h-4 w-4 border-b-2 border-primary",
                        "aria-hidden": "true"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/table.tsx",
                        lineNumber: 139,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: message
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/table.tsx",
                        lineNumber: 140,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/table.tsx",
                lineNumber: 138,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/src/components/ui/table.tsx",
            lineNumber: 137,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/ui/table.tsx",
        lineNumber: 136,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c17 = TableLoadingState;
TableLoadingState.displayName = "TableLoadingState";
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9, _c10, _c11, _c12, _c13, _c14, _c15, _c16, _c17;
__turbopack_context__.k.register(_c, "Table$React.forwardRef");
__turbopack_context__.k.register(_c1, "Table");
__turbopack_context__.k.register(_c2, "TableHeader$React.forwardRef");
__turbopack_context__.k.register(_c3, "TableHeader");
__turbopack_context__.k.register(_c4, "TableBody$React.forwardRef");
__turbopack_context__.k.register(_c5, "TableBody");
__turbopack_context__.k.register(_c6, "TableFooter$React.forwardRef");
__turbopack_context__.k.register(_c7, "TableFooter");
__turbopack_context__.k.register(_c8, "TableRow");
__turbopack_context__.k.register(_c9, "TableHead$React.forwardRef");
__turbopack_context__.k.register(_c10, "TableHead");
__turbopack_context__.k.register(_c11, "TableCell");
__turbopack_context__.k.register(_c12, "TableCaption$React.forwardRef");
__turbopack_context__.k.register(_c13, "TableCaption");
__turbopack_context__.k.register(_c14, "TableEmptyState$React.forwardRef");
__turbopack_context__.k.register(_c15, "TableEmptyState");
__turbopack_context__.k.register(_c16, "TableLoadingState$React.forwardRef");
__turbopack_context__.k.register(_c17, "TableLoadingState");
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
"[project]/src/lib/actions/data:16f8a7 [app-client] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"40a521c0889536c5ec0f0840bb1df44e324452a90e":"deleteAdminUserAction"},"src/lib/actions/admin.users.ts",""] */ __turbopack_context__.s([
    "deleteAdminUserAction",
    ()=>deleteAdminUserAction
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
"use turbopack no side effects";
;
var deleteAdminUserAction = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("40a521c0889536c5ec0f0840bb1df44e324452a90e", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "deleteAdminUserAction"); //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vYWRtaW4udXNlcnMudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIEBmaWxlb3ZlcnZpZXcgQWRtaW4gVXNlciBNYW5hZ2VtZW50IE9wZXJhdGlvbnNcclxuICogQG1vZHVsZSBsaWIvYWN0aW9ucy9hZG1pbi51c2Vyc1xyXG4gKlxyXG4gKiBISVBBQS1jb21wbGlhbnQgc2VydmVyIGFjdGlvbnMgZm9yIGFkbWluIHVzZXIgbWFuYWdlbWVudC5cclxuICogSW5jbHVkZXMgY2FjaGluZywgYXVkaXQgbG9nZ2luZywgYW5kIGNvbXByZWhlbnNpdmUgZXJyb3IgaGFuZGxpbmcuXHJcbiAqL1xyXG5cclxuJ3VzZSBzZXJ2ZXInO1xyXG5cclxuaW1wb3J0IHsgcmV2YWxpZGF0ZVRhZywgcmV2YWxpZGF0ZVBhdGggfSBmcm9tICduZXh0L2NhY2hlJztcclxuaW1wb3J0IHsgcmVkaXJlY3QgfSBmcm9tICduZXh0L25hdmlnYXRpb24nO1xyXG5pbXBvcnQgeyBzZXJ2ZXJQb3N0LCBzZXJ2ZXJQdXQsIHNlcnZlckRlbGV0ZSwgTmV4dEFwaUNsaWVudEVycm9yIH0gZnJvbSAnQC9saWIvYXBpL25leHRqcy1jbGllbnQnO1xyXG5pbXBvcnQgeyBBUElfRU5EUE9JTlRTIH0gZnJvbSAnQC9jb25zdGFudHMvYXBpJztcclxuaW1wb3J0IHsgYXVkaXRMb2csIEFVRElUX0FDVElPTlMgfSBmcm9tICdAL2xpYi9hdWRpdCc7XHJcbmltcG9ydCB7IENBQ0hFX1RBR1MgfSBmcm9tICdAL2xpYi9jYWNoZS9jb25zdGFudHMnO1xyXG5pbXBvcnQgeyB2YWxpZGF0ZUVtYWlsIH0gZnJvbSAnQC91dGlscy92YWxpZGF0aW9uL3VzZXJWYWxpZGF0aW9uJztcclxuaW1wb3J0IHsgZm9ybWF0TmFtZSB9IGZyb20gJ0AvdXRpbHMvZm9ybWF0dGVycyc7XHJcbmltcG9ydCB0eXBlIHtcclxuICBBY3Rpb25SZXN1bHQsXHJcbiAgQWRtaW5Vc2VyLFxyXG4gIENyZWF0ZUFkbWluVXNlckRhdGEsXHJcbiAgVXBkYXRlQWRtaW5Vc2VyRGF0YSxcclxuICBBcGlSZXNwb25zZSxcclxufSBmcm9tICcuL2FkbWluLnR5cGVzJztcclxuXHJcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4vLyBDUlVEIE9QRVJBVElPTlNcclxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4vKiogQ3JlYXRlIGFkbWluIHVzZXIgd2l0aCBhdWRpdCBsb2dnaW5nIGFuZCBjYWNoZSBpbnZhbGlkYXRpb24gKi9cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNyZWF0ZUFkbWluVXNlckFjdGlvbihkYXRhOiBDcmVhdGVBZG1pblVzZXJEYXRhKTogUHJvbWlzZTxBY3Rpb25SZXN1bHQ8QWRtaW5Vc2VyPj4ge1xyXG4gIHRyeSB7XHJcbiAgICAvLyBWYWxpZGF0ZSByZXF1aXJlZCBmaWVsZHNcclxuICAgIGlmICghZGF0YS5lbWFpbCB8fCAhZGF0YS5maXJzdE5hbWUgfHwgIWRhdGEubGFzdE5hbWUgfHwgIWRhdGEucm9sZSB8fCAhZGF0YS5wYXNzd29yZCkge1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxyXG4gICAgICAgIGVycm9yOiAnTWlzc2luZyByZXF1aXJlZCBmaWVsZHM6IGVtYWlsLCBmaXJzdE5hbWUsIGxhc3ROYW1lLCByb2xlLCBwYXNzd29yZCdcclxuICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBWYWxpZGF0ZSBlbWFpbCBmb3JtYXRcclxuICAgIGlmICghdmFsaWRhdGVFbWFpbChkYXRhLmVtYWlsKSkge1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxyXG4gICAgICAgIGVycm9yOiAnSW52YWxpZCBlbWFpbCBmb3JtYXQnXHJcbiAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBzZXJ2ZXJQb3N0PEFwaVJlc3BvbnNlPEFkbWluVXNlcj4+KFxyXG4gICAgICBBUElfRU5EUE9JTlRTLkFETUlOLlVTRVJTLFxyXG4gICAgICBkYXRhLFxyXG4gICAgICB7XHJcbiAgICAgICAgY2FjaGU6ICduby1zdG9yZScsXHJcbiAgICAgICAgbmV4dDogeyB0YWdzOiBbQ0FDSEVfVEFHUy5BRE1JTl9VU0VSU10gfVxyXG4gICAgICB9XHJcbiAgICApO1xyXG5cclxuICAgIGlmICghcmVzcG9uc2Uuc3VjY2VzcyB8fCAhcmVzcG9uc2UuZGF0YSkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IocmVzcG9uc2UubWVzc2FnZSB8fCAnRmFpbGVkIHRvIGNyZWF0ZSBhZG1pbiB1c2VyJyk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQVVESVQgTE9HIC0gQWRtaW4gdXNlciBjcmVhdGlvblxyXG4gICAgYXdhaXQgYXVkaXRMb2coe1xyXG4gICAgICBhY3Rpb246IEFVRElUX0FDVElPTlMuQ1JFQVRFX1VTRVIsXHJcbiAgICAgIHJlc291cmNlOiAnQWRtaW5Vc2VyJyxcclxuICAgICAgcmVzb3VyY2VJZDogcmVzcG9uc2UuZGF0YS5pZCxcclxuICAgICAgZGV0YWlsczogYENyZWF0ZWQgYWRtaW4gdXNlcjogJHtmb3JtYXROYW1lKGRhdGEuZmlyc3ROYW1lLCBkYXRhLmxhc3ROYW1lKX0gKCR7ZGF0YS5lbWFpbH0pYCxcclxuICAgICAgc3VjY2VzczogdHJ1ZVxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gQ2FjaGUgaW52YWxpZGF0aW9uXHJcbiAgICByZXZhbGlkYXRlVGFnKENBQ0hFX1RBR1MuQURNSU5fVVNFUlMsICdkZWZhdWx0Jyk7XHJcbiAgICByZXZhbGlkYXRlVGFnKCdhZG1pbi11c2VyLWxpc3QnLCAnZGVmYXVsdCcpO1xyXG4gICAgcmV2YWxpZGF0ZVBhdGgoJy9hZG1pbi91c2VycycsICdwYWdlJyk7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgc3VjY2VzczogdHJ1ZSxcclxuICAgICAgZGF0YTogcmVzcG9uc2UuZGF0YSxcclxuICAgICAgbWVzc2FnZTogJ0FkbWluIHVzZXIgY3JlYXRlZCBzdWNjZXNzZnVsbHknXHJcbiAgICB9O1xyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICBjb25zdCBlcnJvck1lc3NhZ2UgPSBlcnJvciBpbnN0YW5jZW9mIE5leHRBcGlDbGllbnRFcnJvclxyXG4gICAgICA/IGVycm9yLm1lc3NhZ2VcclxuICAgICAgOiBlcnJvciBpbnN0YW5jZW9mIEVycm9yXHJcbiAgICAgID8gZXJyb3IubWVzc2FnZVxyXG4gICAgICA6ICdGYWlsZWQgdG8gY3JlYXRlIGFkbWluIHVzZXInO1xyXG5cclxuICAgIC8vIEFVRElUIExPRyAtIExvZyBmYWlsZWQgYXR0ZW1wdFxyXG4gICAgYXdhaXQgYXVkaXRMb2coe1xyXG4gICAgICBhY3Rpb246IEFVRElUX0FDVElPTlMuQ1JFQVRFX1VTRVIsXHJcbiAgICAgIHJlc291cmNlOiAnQWRtaW5Vc2VyJyxcclxuICAgICAgZGV0YWlsczogYEZhaWxlZCB0byBjcmVhdGUgYWRtaW4gdXNlcjogJHtlcnJvck1lc3NhZ2V9YCxcclxuICAgICAgc3VjY2VzczogZmFsc2UsXHJcbiAgICAgIGVycm9yTWVzc2FnZVxyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgc3VjY2VzczogZmFsc2UsXHJcbiAgICAgIGVycm9yOiBlcnJvck1lc3NhZ2VcclxuICAgIH07XHJcbiAgfVxyXG59XHJcblxyXG4vKiogVXBkYXRlIGFkbWluIHVzZXIgd2l0aCBhdWRpdCBsb2dnaW5nIGFuZCBjYWNoZSBpbnZhbGlkYXRpb24gKi9cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVwZGF0ZUFkbWluVXNlckFjdGlvbihcclxuICB1c2VySWQ6IHN0cmluZyxcclxuICBkYXRhOiBVcGRhdGVBZG1pblVzZXJEYXRhXHJcbik6IFByb21pc2U8QWN0aW9uUmVzdWx0PEFkbWluVXNlcj4+IHtcclxuICB0cnkge1xyXG4gICAgaWYgKCF1c2VySWQpIHtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICBzdWNjZXNzOiBmYWxzZSxcclxuICAgICAgICBlcnJvcjogJ1VzZXIgSUQgaXMgcmVxdWlyZWQnXHJcbiAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgLy8gVmFsaWRhdGUgZW1haWwgaWYgcHJvdmlkZWRcclxuICAgIGlmIChkYXRhLmVtYWlsICYmICF2YWxpZGF0ZUVtYWlsKGRhdGEuZW1haWwpKSB7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgc3VjY2VzczogZmFsc2UsXHJcbiAgICAgICAgZXJyb3I6ICdJbnZhbGlkIGVtYWlsIGZvcm1hdCdcclxuICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHNlcnZlclB1dDxBcGlSZXNwb25zZTxBZG1pblVzZXI+PihcclxuICAgICAgQVBJX0VORFBPSU5UUy5BRE1JTi5VU0VSX0JZX0lEKHVzZXJJZCksXHJcbiAgICAgIGRhdGEsXHJcbiAgICAgIHtcclxuICAgICAgICBjYWNoZTogJ25vLXN0b3JlJyxcclxuICAgICAgICBuZXh0OiB7IHRhZ3M6IFtDQUNIRV9UQUdTLkFETUlOX1VTRVJTLCBgYWRtaW4tdXNlci0ke3VzZXJJZH1gXSB9XHJcbiAgICAgIH1cclxuICAgICk7XHJcblxyXG4gICAgaWYgKCFyZXNwb25zZS5zdWNjZXNzIHx8ICFyZXNwb25zZS5kYXRhKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihyZXNwb25zZS5tZXNzYWdlIHx8ICdGYWlsZWQgdG8gdXBkYXRlIGFkbWluIHVzZXInKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBBVURJVCBMT0cgLSBBZG1pbiB1c2VyIHVwZGF0ZVxyXG4gICAgYXdhaXQgYXVkaXRMb2coe1xyXG4gICAgICBhY3Rpb246IEFVRElUX0FDVElPTlMuVVBEQVRFX1VTRVIsXHJcbiAgICAgIHJlc291cmNlOiAnQWRtaW5Vc2VyJyxcclxuICAgICAgcmVzb3VyY2VJZDogdXNlcklkLFxyXG4gICAgICBkZXRhaWxzOiAnVXBkYXRlZCBhZG1pbiB1c2VyIGluZm9ybWF0aW9uJyxcclxuICAgICAgY2hhbmdlczogZGF0YSBhcyBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPixcclxuICAgICAgc3VjY2VzczogdHJ1ZVxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gQ2FjaGUgaW52YWxpZGF0aW9uXHJcbiAgICByZXZhbGlkYXRlVGFnKENBQ0hFX1RBR1MuQURNSU5fVVNFUlMsICdkZWZhdWx0Jyk7XHJcbiAgICByZXZhbGlkYXRlVGFnKGBhZG1pbi11c2VyLSR7dXNlcklkfWAsICdkZWZhdWx0Jyk7XHJcbiAgICByZXZhbGlkYXRlVGFnKCdhZG1pbi11c2VyLWxpc3QnLCAnZGVmYXVsdCcpO1xyXG4gICAgcmV2YWxpZGF0ZVBhdGgoJy9hZG1pbi91c2VycycsICdwYWdlJyk7XHJcbiAgICByZXZhbGlkYXRlUGF0aChgL2FkbWluL3VzZXJzLyR7dXNlcklkfWAsICdwYWdlJyk7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgc3VjY2VzczogdHJ1ZSxcclxuICAgICAgZGF0YTogcmVzcG9uc2UuZGF0YSxcclxuICAgICAgbWVzc2FnZTogJ0FkbWluIHVzZXIgdXBkYXRlZCBzdWNjZXNzZnVsbHknXHJcbiAgICB9O1xyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICBjb25zdCBlcnJvck1lc3NhZ2UgPSBlcnJvciBpbnN0YW5jZW9mIE5leHRBcGlDbGllbnRFcnJvclxyXG4gICAgICA/IGVycm9yLm1lc3NhZ2VcclxuICAgICAgOiBlcnJvciBpbnN0YW5jZW9mIEVycm9yXHJcbiAgICAgID8gZXJyb3IubWVzc2FnZVxyXG4gICAgICA6ICdGYWlsZWQgdG8gdXBkYXRlIGFkbWluIHVzZXInO1xyXG5cclxuICAgIC8vIEFVRElUIExPRyAtIExvZyBmYWlsZWQgYXR0ZW1wdFxyXG4gICAgYXdhaXQgYXVkaXRMb2coe1xyXG4gICAgICBhY3Rpb246IEFVRElUX0FDVElPTlMuVVBEQVRFX1VTRVIsXHJcbiAgICAgIHJlc291cmNlOiAnQWRtaW5Vc2VyJyxcclxuICAgICAgcmVzb3VyY2VJZDogdXNlcklkLFxyXG4gICAgICBkZXRhaWxzOiBgRmFpbGVkIHRvIHVwZGF0ZSBhZG1pbiB1c2VyOiAke2Vycm9yTWVzc2FnZX1gLFxyXG4gICAgICBzdWNjZXNzOiBmYWxzZSxcclxuICAgICAgZXJyb3JNZXNzYWdlXHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBzdWNjZXNzOiBmYWxzZSxcclxuICAgICAgZXJyb3I6IGVycm9yTWVzc2FnZVxyXG4gICAgfTtcclxuICB9XHJcbn1cclxuXHJcbi8qKiBEZWxldGUgYWRtaW4gdXNlciAoc29mdCBkZWxldGUpIHdpdGggYXVkaXQgbG9nZ2luZyAqL1xyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZGVsZXRlQWRtaW5Vc2VyQWN0aW9uKHVzZXJJZDogc3RyaW5nKTogUHJvbWlzZTxBY3Rpb25SZXN1bHQ8dm9pZD4+IHtcclxuICB0cnkge1xyXG4gICAgaWYgKCF1c2VySWQpIHtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICBzdWNjZXNzOiBmYWxzZSxcclxuICAgICAgICBlcnJvcjogJ1VzZXIgSUQgaXMgcmVxdWlyZWQnXHJcbiAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgYXdhaXQgc2VydmVyRGVsZXRlPEFwaVJlc3BvbnNlPHZvaWQ+PihcclxuICAgICAgQVBJX0VORFBPSU5UUy5BRE1JTi5VU0VSX0JZX0lEKHVzZXJJZCksXHJcbiAgICAgIHtcclxuICAgICAgICBjYWNoZTogJ25vLXN0b3JlJyxcclxuICAgICAgICBuZXh0OiB7IHRhZ3M6IFtDQUNIRV9UQUdTLkFETUlOX1VTRVJTLCBgYWRtaW4tdXNlci0ke3VzZXJJZH1gXSB9XHJcbiAgICAgIH1cclxuICAgICk7XHJcblxyXG4gICAgLy8gQVVESVQgTE9HIC0gQWRtaW4gdXNlciBkZWxldGlvblxyXG4gICAgYXdhaXQgYXVkaXRMb2coe1xyXG4gICAgICBhY3Rpb246IEFVRElUX0FDVElPTlMuREVMRVRFX1VTRVIsXHJcbiAgICAgIHJlc291cmNlOiAnQWRtaW5Vc2VyJyxcclxuICAgICAgcmVzb3VyY2VJZDogdXNlcklkLFxyXG4gICAgICBkZXRhaWxzOiAnRGVsZXRlZCBhZG1pbiB1c2VyIChzb2Z0IGRlbGV0ZSknLFxyXG4gICAgICBzdWNjZXNzOiB0cnVlXHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBDYWNoZSBpbnZhbGlkYXRpb25cclxuICAgIHJldmFsaWRhdGVUYWcoQ0FDSEVfVEFHUy5BRE1JTl9VU0VSUywgJ2RlZmF1bHQnKTtcclxuICAgIHJldmFsaWRhdGVUYWcoYGFkbWluLXVzZXItJHt1c2VySWR9YCwgJ2RlZmF1bHQnKTtcclxuICAgIHJldmFsaWRhdGVUYWcoJ2FkbWluLXVzZXItbGlzdCcsICdkZWZhdWx0Jyk7XHJcbiAgICByZXZhbGlkYXRlUGF0aCgnL2FkbWluL3VzZXJzJywgJ3BhZ2UnKTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBzdWNjZXNzOiB0cnVlLFxyXG4gICAgICBtZXNzYWdlOiAnQWRtaW4gdXNlciBkZWxldGVkIHN1Y2Nlc3NmdWxseSdcclxuICAgIH07XHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIGNvbnN0IGVycm9yTWVzc2FnZSA9IGVycm9yIGluc3RhbmNlb2YgTmV4dEFwaUNsaWVudEVycm9yXHJcbiAgICAgID8gZXJyb3IubWVzc2FnZVxyXG4gICAgICA6IGVycm9yIGluc3RhbmNlb2YgRXJyb3JcclxuICAgICAgPyBlcnJvci5tZXNzYWdlXHJcbiAgICAgIDogJ0ZhaWxlZCB0byBkZWxldGUgYWRtaW4gdXNlcic7XHJcblxyXG4gICAgLy8gQVVESVQgTE9HIC0gTG9nIGZhaWxlZCBhdHRlbXB0XHJcbiAgICBhd2FpdCBhdWRpdExvZyh7XHJcbiAgICAgIGFjdGlvbjogQVVESVRfQUNUSU9OUy5ERUxFVEVfVVNFUixcclxuICAgICAgcmVzb3VyY2U6ICdBZG1pblVzZXInLFxyXG4gICAgICByZXNvdXJjZUlkOiB1c2VySWQsXHJcbiAgICAgIGRldGFpbHM6IGBGYWlsZWQgdG8gZGVsZXRlIGFkbWluIHVzZXI6ICR7ZXJyb3JNZXNzYWdlfWAsXHJcbiAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxyXG4gICAgICBlcnJvck1lc3NhZ2VcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxyXG4gICAgICBlcnJvcjogZXJyb3JNZXNzYWdlXHJcbiAgICB9O1xyXG4gIH1cclxufVxyXG5cclxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbi8vIEZPUk0gSEFORExFUlNcclxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4vKiogQ3JlYXRlIGFkbWluIHVzZXIgZnJvbSBmb3JtIGRhdGEgKi9cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNyZWF0ZUFkbWluVXNlckZyb21Gb3JtKGZvcm1EYXRhOiBGb3JtRGF0YSk6IFByb21pc2U8QWN0aW9uUmVzdWx0PEFkbWluVXNlcj4+IHtcclxuICBjb25zdCB1c2VyRGF0YTogQ3JlYXRlQWRtaW5Vc2VyRGF0YSA9IHtcclxuICAgIGVtYWlsOiBmb3JtRGF0YS5nZXQoJ2VtYWlsJykgYXMgc3RyaW5nLFxyXG4gICAgZmlyc3ROYW1lOiBmb3JtRGF0YS5nZXQoJ2ZpcnN0TmFtZScpIGFzIHN0cmluZyxcclxuICAgIGxhc3ROYW1lOiBmb3JtRGF0YS5nZXQoJ2xhc3ROYW1lJykgYXMgc3RyaW5nLFxyXG4gICAgcm9sZTogZm9ybURhdGEuZ2V0KCdyb2xlJykgYXMgc3RyaW5nLFxyXG4gICAgcGFzc3dvcmQ6IGZvcm1EYXRhLmdldCgncGFzc3dvcmQnKSBhcyBzdHJpbmcsXHJcbiAgICBpc0FjdGl2ZTogZm9ybURhdGEuZ2V0KCdpc0FjdGl2ZScpID09PSAndHJ1ZScsXHJcbiAgfTtcclxuXHJcbiAgY29uc3QgcmVzdWx0ID0gYXdhaXQgY3JlYXRlQWRtaW5Vc2VyQWN0aW9uKHVzZXJEYXRhKTtcclxuXHJcbiAgaWYgKHJlc3VsdC5zdWNjZXNzICYmIHJlc3VsdC5kYXRhKSB7XHJcbiAgICByZWRpcmVjdChgL2FkbWluL3VzZXJzLyR7cmVzdWx0LmRhdGEuaWR9YCk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG4vKiogVXBkYXRlIGFkbWluIHVzZXIgZnJvbSBmb3JtIGRhdGEgKi9cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVwZGF0ZUFkbWluVXNlckZyb21Gb3JtKFxyXG4gIHVzZXJJZDogc3RyaW5nLFxyXG4gIGZvcm1EYXRhOiBGb3JtRGF0YVxyXG4pOiBQcm9taXNlPEFjdGlvblJlc3VsdDxBZG1pblVzZXI+PiB7XHJcbiAgY29uc3QgdXBkYXRlRGF0YTogVXBkYXRlQWRtaW5Vc2VyRGF0YSA9IHtcclxuICAgIGVtYWlsOiBmb3JtRGF0YS5nZXQoJ2VtYWlsJykgYXMgc3RyaW5nIHx8IHVuZGVmaW5lZCxcclxuICAgIGZpcnN0TmFtZTogZm9ybURhdGEuZ2V0KCdmaXJzdE5hbWUnKSBhcyBzdHJpbmcgfHwgdW5kZWZpbmVkLFxyXG4gICAgbGFzdE5hbWU6IGZvcm1EYXRhLmdldCgnbGFzdE5hbWUnKSBhcyBzdHJpbmcgfHwgdW5kZWZpbmVkLFxyXG4gICAgcm9sZTogZm9ybURhdGEuZ2V0KCdyb2xlJykgYXMgc3RyaW5nIHx8IHVuZGVmaW5lZCxcclxuICAgIGlzQWN0aXZlOiBmb3JtRGF0YS5oYXMoJ2lzQWN0aXZlJykgPyBmb3JtRGF0YS5nZXQoJ2lzQWN0aXZlJykgPT09ICd0cnVlJyA6IHVuZGVmaW5lZCxcclxuICB9O1xyXG5cclxuICAvLyBGaWx0ZXIgb3V0IHVuZGVmaW5lZCB2YWx1ZXNcclxuICBjb25zdCBmaWx0ZXJlZERhdGEgPSBPYmplY3QuZW50cmllcyh1cGRhdGVEYXRhKS5yZWR1Y2UoKGFjYywgW2tleSwgdmFsdWVdKSA9PiB7XHJcbiAgICBpZiAodmFsdWUgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICBhY2Nba2V5IGFzIGtleW9mIFVwZGF0ZUFkbWluVXNlckRhdGFdID0gdmFsdWU7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYWNjO1xyXG4gIH0sIHt9IGFzIFVwZGF0ZUFkbWluVXNlckRhdGEpO1xyXG5cclxuICBjb25zdCByZXN1bHQgPSBhd2FpdCB1cGRhdGVBZG1pblVzZXJBY3Rpb24odXNlcklkLCBmaWx0ZXJlZERhdGEpO1xyXG5cclxuICBpZiAocmVzdWx0LnN1Y2Nlc3MgJiYgcmVzdWx0LmRhdGEpIHtcclxuICAgIHJlZGlyZWN0KGAvYWRtaW4vdXNlcnMvJHtyZXN1bHQuZGF0YS5pZH1gKTtcclxuICB9XHJcblxyXG4gIHJldHVybiByZXN1bHQ7XHJcbn1cclxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI2U0F5THNCIn0=
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/admin-utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Admin Utilities - Helper functions for admin operations
 *
 * Provides utility functions for audit logging, data export, bulk operations,
 * and other admin-specific functionality.
 *
 * @module lib/admin-utils
 * @since 2025-10-26
 *
 * Features:
 * - Audit logging for compliance tracking
 * - CSV/PDF data export
 * - Bulk operation helpers
 * - Permission validation
 * - Data sanitization for PHI
 */ __turbopack_context__.s([
    "convertToCSV",
    ()=>convertToCSV,
    "debounce",
    ()=>debounce,
    "downloadCSV",
    ()=>downloadCSV,
    "downloadJSON",
    ()=>downloadJSON,
    "executeBulkOperation",
    ()=>executeBulkOperation,
    "exportData",
    ()=>exportData,
    "formatDate",
    ()=>formatDate,
    "formatDateTime",
    ()=>formatDateTime,
    "hasRole",
    ()=>hasRole,
    "isAdmin",
    ()=>isAdmin,
    "logAdminAction",
    ()=>logAdminAction,
    "maskSensitiveString",
    ()=>maskSensitiveString,
    "sanitizePHIData",
    ()=>sanitizePHIData
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
async function logAdminAction(entry) {
    const auditEntry = {
        ...entry,
        timestamp: new Date()
    };
    // In development, log to console
    if ("TURBOPACK compile-time truthy", 1) {
        console.log('[AUDIT LOG]', JSON.stringify(auditEntry, null, 2));
    }
    // In production, send to backend audit API
    try {
        await fetch('/api/audit-logs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`
            },
            body: JSON.stringify(auditEntry)
        });
    } catch (error) {
        console.error('Failed to log audit entry:', error);
    // Don't throw - audit logging failures shouldn't break the app
    }
}
/**
 * Get auth token from localStorage or cookies
 */ function getAuthToken() {
    if ("TURBOPACK compile-time truthy", 1) {
        return localStorage.getItem('auth_token') || '';
    }
    //TURBOPACK unreachable
    ;
}
function convertToCSV(data, headers) {
    if (!data || data.length === 0) {
        return '';
    }
    // Extract headers from first object if not provided
    const csvHeaders = headers || Object.keys(data[0]);
    // Create CSV content
    const csvRows = [
        csvHeaders.join(','),
        ...data.map((row)=>csvHeaders.map((header)=>{
                const value = row[header];
                // Escape quotes and wrap in quotes if contains comma
                const stringValue = value?.toString() || '';
                return stringValue.includes(',') || stringValue.includes('"') ? `"${stringValue.replace(/"/g, '""')}"` : stringValue;
            }).join(','))
    ];
    return csvRows.join('\n');
}
function downloadCSV(data, filename, headers) {
    const csv = convertToCSV(data, headers);
    const blob = new Blob([
        csv
    ], {
        type: 'text/csv;charset=utf-8;'
    });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
function downloadJSON(data, filename) {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([
        json
    ], {
        type: 'application/json'
    });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
async function exportData(data, options) {
    // Sanitize PHI if requested
    const sanitizedData = options.sanitizePHI ? sanitizePHIData(data) : data;
    // Log export action
    await logAdminAction({
        userId: getCurrentUserId(),
        userRole: getCurrentUserRole(),
        action: 'EXPORT_DATA',
        resource: options.filename,
        metadata: {
            format: options.format,
            recordCount: data.length,
            sanitized: options.sanitizePHI
        }
    });
    // Export based on format
    switch(options.format){
        case 'csv':
            downloadCSV(sanitizedData, options.filename);
            break;
        case 'json':
            downloadJSON(sanitizedData, options.filename);
            break;
        case 'pdf':
            // PDF export would require a library like jsPDF
            console.warn('PDF export not yet implemented');
            break;
        default:
            throw new Error(`Unsupported export format: ${options.format}`);
    }
}
async function executeBulkOperation(items, operation, options) {
    const batchSize = options?.batchSize || 10;
    const result = {
        success: 0,
        failed: 0,
        errors: []
    };
    // Process in batches
    for(let i = 0; i < items.length; i += batchSize){
        const batch = items.slice(i, i + batchSize);
        await Promise.allSettled(batch.map(async (item)=>{
            try {
                await operation(item);
                result.success++;
            } catch (error) {
                result.failed++;
                result.errors.push({
                    id: item.id || `item-${i}`,
                    error: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        }));
        // Report progress
        if (options?.onProgress) {
            options.onProgress(i + batch.length, items.length);
        }
    }
    return result;
}
function hasRole(requiredRoles) {
    const userRole = getCurrentUserRole();
    return requiredRoles.includes(userRole);
}
function isAdmin() {
    const role = getCurrentUserRole();
    return role === 'ADMIN' || role === 'DISTRICT_ADMIN';
}
/**
 * Get current user's role from token or session
 */ function getCurrentUserRole() {
    // This should decode the JWT token or read from session
    // For now, returning a default value
    if ("TURBOPACK compile-time truthy", 1) {
        const storedRole = localStorage.getItem('user_role');
        return storedRole || 'VIEWER';
    }
    //TURBOPACK unreachable
    ;
}
/**
 * Get current user's ID from token or session
 */ function getCurrentUserId() {
    if ("TURBOPACK compile-time truthy", 1) {
        return localStorage.getItem('user_id') || 'unknown';
    }
    //TURBOPACK unreachable
    ;
}
// ============================================================================
// Data Sanitization
// ============================================================================
/**
 * PHI fields that should be sanitized or redacted
 */ const PHI_FIELDS = [
    'ssn',
    'socialSecurityNumber',
    'medicalRecordNumber',
    'healthInsuranceNumber',
    'accountNumber',
    'certificateNumber',
    'licenseNumber',
    'vehicleIdentifier',
    'deviceIdentifier',
    'biometricIdentifier',
    'fullFacePhoto',
    'ipAddress'
];
function sanitizePHIData(data) {
    return data.map((item)=>{
        const sanitized = {
            ...item
        };
        PHI_FIELDS.forEach((field)=>{
            if (sanitized[field]) {
                // Redact sensitive data
                sanitized[field] = '[REDACTED]';
            }
        });
        return sanitized;
    });
}
function maskSensitiveString(value) {
    if (!value || value.length <= 4) {
        return '****';
    }
    const first = value.slice(0, 2);
    const last = value.slice(-2);
    const middle = '*'.repeat(Math.min(value.length - 4, 8));
    return `${first}${middle}${last}`;
}
function formatDate(date) {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}
function formatDateTime(date) {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}
function debounce(func, wait) {
    let timeout = null;
    return (...args)=>{
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(()=>func(...args), wait);
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/(dashboard)/admin/settings/users/_components/UserManagementContent.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * UserManagementContent Component - Client-side interactive user management
 *
 * Features:
 * - Interactive user table with filtering and sorting
 * - Server Actions integration for CRUD operations
 * - Optimistic updates for better UX
 * - Bulk operations support
 * - Real-time search and filtering
 *
 * @component UserManagementContent
 */ __turbopack_context__.s([
    "UserManagementContent",
    ()=>UserManagementContent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/users.js [app-client] (ecmascript) <export default as Users>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/download.js [app-client] (ecmascript) <export default as Download>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$key$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Key$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/key.js [app-client] (ecmascript) <export default as Key>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$pen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/square-pen.js [app-client] (ecmascript) <export default as Edit>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/refresh-cw.js [app-client] (ecmascript) <export default as RefreshCw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/badge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/select.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/table.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$checkbox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/checkbox.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$data$3a$16f8a7__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/src/lib/actions/data:16f8a7 [app-client] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$admin$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/admin-utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-hot-toast/dist/index.mjs [app-client] (ecmascript)");
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
;
;
;
;
;
;
;
function UserManagementContent(t0) {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(117);
    if ($[0] !== "35f0223a9cc84dfed18a45dd7d68843f6676565c126d451d3a113d3ffa233604") {
        for(let $i = 0; $i < 117; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "35f0223a9cc84dfed18a45dd7d68843f6676565c126d451d3a113d3ffa233604";
    }
    const { initialUsers, total, searchParams } = t0;
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [isPending, startTransition] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTransition"])();
    const [users, setUsers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialUsers);
    let t1;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t1 = [];
        $[1] = t1;
    } else {
        t1 = $[1];
    }
    const [selectedUsers, setSelectedUsers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(t1);
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(searchParams.search || "");
    const [roleFilter, setRoleFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(searchParams.role || "all");
    const [statusFilter, setStatusFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(searchParams.status || "all");
    let t2;
    if ($[2] !== roleFilter || $[3] !== searchQuery || $[4] !== statusFilter || $[5] !== users) {
        let t3;
        if ($[7] !== roleFilter || $[8] !== searchQuery || $[9] !== statusFilter) {
            t3 = ({
                "UserManagementContent[users.filter()]": (user)=>{
                    const matchesSearch = !searchQuery || `${user.firstName} ${user.lastName} ${user.email}`.toLowerCase().includes(searchQuery.toLowerCase());
                    const matchesRole = roleFilter === "all" || user.role === roleFilter;
                    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
                    return matchesSearch && matchesRole && matchesStatus;
                }
            })["UserManagementContent[users.filter()]"];
            $[7] = roleFilter;
            $[8] = searchQuery;
            $[9] = statusFilter;
            $[10] = t3;
        } else {
            t3 = $[10];
        }
        t2 = users.filter(t3);
        $[2] = roleFilter;
        $[3] = searchQuery;
        $[4] = statusFilter;
        $[5] = users;
        $[6] = t2;
    } else {
        t2 = $[6];
    }
    const filteredUsers = t2;
    let t3;
    if ($[11] !== router || $[12] !== searchParams) {
        t3 = ({
            "UserManagementContent[updateFilters]": (newFilters)=>{
                const params = new URLSearchParams();
                const filters = {
                    ...searchParams,
                    ...newFilters
                };
                Object.entries(filters).forEach({
                    "UserManagementContent[updateFilters > (anonymous)()]": (t4)=>{
                        const [key, value] = t4;
                        if (value && value !== "all") {
                            params.set(key, value);
                        }
                    }
                }["UserManagementContent[updateFilters > (anonymous)()]"]);
                startTransition({
                    "UserManagementContent[updateFilters > startTransition()]": ()=>{
                        router.push(`/admin/settings/users?${params.toString()}`);
                    }
                }["UserManagementContent[updateFilters > startTransition()]"]);
            }
        })["UserManagementContent[updateFilters]"];
        $[11] = router;
        $[12] = searchParams;
        $[13] = t3;
    } else {
        t3 = $[13];
    }
    const updateFilters = t3;
    let t4;
    if ($[14] !== updateFilters) {
        t4 = ({
            "UserManagementContent[handleSearchChange]": (value_0)=>{
                setSearchQuery(value_0);
                setTimeout({
                    "UserManagementContent[handleSearchChange > setTimeout()]": ()=>{
                        updateFilters({
                            search: value_0 || undefined
                        });
                    }
                }["UserManagementContent[handleSearchChange > setTimeout()]"], 500);
            }
        })["UserManagementContent[handleSearchChange]"];
        $[14] = updateFilters;
        $[15] = t4;
    } else {
        t4 = $[15];
    }
    const handleSearchChange = t4;
    let t5;
    if ($[16] === Symbol.for("react.memo_cache_sentinel")) {
        t5 = ({
            "UserManagementContent[toggleUserSelection]": (userId)=>{
                setSelectedUsers({
                    "UserManagementContent[toggleUserSelection > setSelectedUsers()]": (prev)=>prev.includes(userId) ? prev.filter({
                            "UserManagementContent[toggleUserSelection > setSelectedUsers() > prev.filter()]": (id)=>id !== userId
                        }["UserManagementContent[toggleUserSelection > setSelectedUsers() > prev.filter()]"]) : [
                            ...prev,
                            userId
                        ]
                }["UserManagementContent[toggleUserSelection > setSelectedUsers()]"]);
            }
        })["UserManagementContent[toggleUserSelection]"];
        $[16] = t5;
    } else {
        t5 = $[16];
    }
    const toggleUserSelection = t5;
    let t6;
    if ($[17] !== filteredUsers) {
        t6 = ({
            "UserManagementContent[toggleSelectAll]": ()=>{
                setSelectedUsers({
                    "UserManagementContent[toggleSelectAll > setSelectedUsers()]": (prev_0)=>prev_0.length === filteredUsers.length ? [] : filteredUsers.map(_UserManagementContentToggleSelectAllSetSelectedUsersFilteredUsersMap)
                }["UserManagementContent[toggleSelectAll > setSelectedUsers()]"]);
            }
        })["UserManagementContent[toggleSelectAll]"];
        $[17] = filteredUsers;
        $[18] = t6;
    } else {
        t6 = $[18];
    }
    const toggleSelectAll = t6;
    let t7;
    if ($[19] !== filteredUsers) {
        t7 = ({
            "UserManagementContent[handleExport]": async ()=>{
                ;
                try {
                    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$admin$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["exportData"])(filteredUsers, {
                        format: "csv",
                        filename: `users-export-${new Date().toISOString().split("T")[0]}`,
                        sanitizePHI: true
                    });
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].success("Users exported successfully");
                } catch (t8) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].error("Failed to export users");
                }
            }
        })["UserManagementContent[handleExport]"];
        $[19] = filteredUsers;
        $[20] = t7;
    } else {
        t7 = $[20];
    }
    const handleExport = t7;
    let t8;
    if ($[21] === Symbol.for("react.memo_cache_sentinel")) {
        t8 = ({
            "UserManagementContent[handleDeleteUser]": async (userId_0)=>{
                if (!confirm("Are you sure you want to delete this user?")) {
                    return;
                }
                startTransition({
                    "UserManagementContent[handleDeleteUser > startTransition()]": async ()=>{
                        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$data$3a$16f8a7__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["deleteAdminUserAction"])(userId_0);
                        if (result.success) {
                            setUsers({
                                "UserManagementContent[handleDeleteUser > startTransition() > setUsers()]": (prev_1)=>prev_1.filter({
                                        "UserManagementContent[handleDeleteUser > startTransition() > setUsers() > prev_1.filter()]": (u_0)=>u_0.id !== userId_0
                                    }["UserManagementContent[handleDeleteUser > startTransition() > setUsers() > prev_1.filter()]"])
                            }["UserManagementContent[handleDeleteUser > startTransition() > setUsers()]"]);
                            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].success(result.message || "User deleted successfully");
                        } else {
                            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].error(result.error || "Failed to delete user");
                        }
                    }
                }["UserManagementContent[handleDeleteUser > startTransition()]"]);
            }
        })["UserManagementContent[handleDeleteUser]"];
        $[21] = t8;
    } else {
        t8 = $[21];
    }
    const handleDeleteUser = t8;
    const handleResetPassword = _UserManagementContentHandleResetPassword;
    let t9;
    if ($[22] !== selectedUsers) {
        t9 = ({
            "UserManagementContent[handleBulkDelete]": async ()=>{
                if (selectedUsers.length === 0) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].error("No users selected");
                    return;
                }
                if (!confirm(`Delete ${selectedUsers.length} users?`)) {
                    return;
                }
                startTransition({
                    "UserManagementContent[handleBulkDelete > startTransition()]": async ()=>{
                        let successCount = 0;
                        let failureCount = 0;
                        for (const userId_2 of selectedUsers){
                            const result_0 = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$data$3a$16f8a7__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["deleteAdminUserAction"])(userId_2);
                            if (result_0.success) {
                                successCount++;
                            } else {
                                failureCount++;
                            }
                        }
                        setUsers({
                            "UserManagementContent[handleBulkDelete > startTransition() > setUsers()]": (prev_2)=>prev_2.filter({
                                    "UserManagementContent[handleBulkDelete > startTransition() > setUsers() > prev_2.filter()]": (u_1)=>!selectedUsers.includes(u_1.id)
                                }["UserManagementContent[handleBulkDelete > startTransition() > setUsers() > prev_2.filter()]"])
                        }["UserManagementContent[handleBulkDelete > startTransition() > setUsers()]"]);
                        setSelectedUsers([]);
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].success(`Deleted ${successCount} users. ${failureCount} failed.`);
                    }
                }["UserManagementContent[handleBulkDelete > startTransition()]"]);
            }
        })["UserManagementContent[handleBulkDelete]"];
        $[22] = selectedUsers;
        $[23] = t9;
    } else {
        t9 = $[23];
    }
    const handleBulkDelete = t9;
    const t10 = total === 1 ? "user" : "users";
    let t11;
    if ($[24] !== filteredUsers.length || $[25] !== t10 || $[26] !== total) {
        t11 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-sm text-gray-600 mt-1",
                children: [
                    filteredUsers.length,
                    " of ",
                    total,
                    " ",
                    t10
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/(dashboard)/admin/settings/users/_components/UserManagementContent.tsx",
                lineNumber: 295,
                columnNumber: 16
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/admin/settings/users/_components/UserManagementContent.tsx",
            lineNumber: 295,
            columnNumber: 11
        }, this);
        $[24] = filteredUsers.length;
        $[25] = t10;
        $[26] = total;
        $[27] = t11;
    } else {
        t11 = $[27];
    }
    let t12;
    if ($[28] === Symbol.for("react.memo_cache_sentinel")) {
        t12 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
            className: "h-4 w-4 mr-2"
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/admin/settings/users/_components/UserManagementContent.tsx",
            lineNumber: 305,
            columnNumber: 11
        }, this);
        $[28] = t12;
    } else {
        t12 = $[28];
    }
    let t13;
    if ($[29] !== handleExport || $[30] !== isPending) {
        t13 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
            variant: "outline",
            onClick: handleExport,
            disabled: isPending,
            children: [
                t12,
                "Export"
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/admin/settings/users/_components/UserManagementContent.tsx",
            lineNumber: 312,
            columnNumber: 11
        }, this);
        $[29] = handleExport;
        $[30] = isPending;
        $[31] = t13;
    } else {
        t13 = $[31];
    }
    let t14;
    if ($[32] !== router) {
        t14 = ({
            "UserManagementContent[<Button>.onClick]": ()=>router.push("/admin/settings/users/new")
        })["UserManagementContent[<Button>.onClick]"];
        $[32] = router;
        $[33] = t14;
    } else {
        t14 = $[33];
    }
    let t15;
    if ($[34] === Symbol.for("react.memo_cache_sentinel")) {
        t15 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
            className: "h-4 w-4 mr-2"
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/admin/settings/users/_components/UserManagementContent.tsx",
            lineNumber: 331,
            columnNumber: 11
        }, this);
        $[34] = t15;
    } else {
        t15 = $[34];
    }
    let t16;
    if ($[35] !== isPending || $[36] !== t14) {
        t16 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
            onClick: t14,
            disabled: isPending,
            children: [
                t15,
                "Add User"
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/admin/settings/users/_components/UserManagementContent.tsx",
            lineNumber: 338,
            columnNumber: 11
        }, this);
        $[35] = isPending;
        $[36] = t14;
        $[37] = t16;
    } else {
        t16 = $[37];
    }
    let t17;
    if ($[38] !== router) {
        t17 = ({
            "UserManagementContent[<Button>.onClick]": ()=>router.refresh()
        })["UserManagementContent[<Button>.onClick]"];
        $[38] = router;
        $[39] = t17;
    } else {
        t17 = $[39];
    }
    let t18;
    if ($[40] === Symbol.for("react.memo_cache_sentinel")) {
        t18 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
            className: "h-4 w-4 mr-2"
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/admin/settings/users/_components/UserManagementContent.tsx",
            lineNumber: 357,
            columnNumber: 11
        }, this);
        $[40] = t18;
    } else {
        t18 = $[40];
    }
    let t19;
    if ($[41] !== isPending || $[42] !== t17) {
        t19 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
            variant: "outline",
            size: "sm",
            onClick: t17,
            disabled: isPending,
            children: [
                t18,
                "Refresh"
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/admin/settings/users/_components/UserManagementContent.tsx",
            lineNumber: 364,
            columnNumber: 11
        }, this);
        $[41] = isPending;
        $[42] = t17;
        $[43] = t19;
    } else {
        t19 = $[43];
    }
    let t20;
    if ($[44] !== t13 || $[45] !== t16 || $[46] !== t19) {
        t20 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex gap-2",
            children: [
                t13,
                t16,
                t19
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/admin/settings/users/_components/UserManagementContent.tsx",
            lineNumber: 373,
            columnNumber: 11
        }, this);
        $[44] = t13;
        $[45] = t16;
        $[46] = t19;
        $[47] = t20;
    } else {
        t20 = $[47];
    }
    let t21;
    if ($[48] !== t11 || $[49] !== t20) {
        t21 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4",
            children: [
                t11,
                t20
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/admin/settings/users/_components/UserManagementContent.tsx",
            lineNumber: 383,
            columnNumber: 11
        }, this);
        $[48] = t11;
        $[49] = t20;
        $[50] = t21;
    } else {
        t21 = $[50];
    }
    let t22;
    if ($[51] === Symbol.for("react.memo_cache_sentinel")) {
        t22 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
            className: "absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/admin/settings/users/_components/UserManagementContent.tsx",
            lineNumber: 392,
            columnNumber: 11
        }, this);
        $[51] = t22;
    } else {
        t22 = $[51];
    }
    let t23;
    if ($[52] !== handleSearchChange) {
        t23 = ({
            "UserManagementContent[<Input>.onChange]": (e)=>handleSearchChange(e.target.value)
        })["UserManagementContent[<Input>.onChange]"];
        $[52] = handleSearchChange;
        $[53] = t23;
    } else {
        t23 = $[53];
    }
    let t24;
    if ($[54] !== searchQuery || $[55] !== t23) {
        t24 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "md:col-span-2",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative",
                children: [
                    t22,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                        type: "text",
                        placeholder: "Search users...",
                        value: searchQuery,
                        onChange: t23,
                        className: "pl-10"
                    }, void 0, false, {
                        fileName: "[project]/src/app/(dashboard)/admin/settings/users/_components/UserManagementContent.tsx",
                        lineNumber: 409,
                        columnNumber: 73
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/(dashboard)/admin/settings/users/_components/UserManagementContent.tsx",
                lineNumber: 409,
                columnNumber: 42
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/admin/settings/users/_components/UserManagementContent.tsx",
            lineNumber: 409,
            columnNumber: 11
        }, this);
        $[54] = searchQuery;
        $[55] = t23;
        $[56] = t24;
    } else {
        t24 = $[56];
    }
    let t25;
    if ($[57] !== updateFilters) {
        t25 = ({
            "UserManagementContent[<Select>.onValueChange]": (value_1)=>{
                setRoleFilter(value_1);
                updateFilters({
                    role: value_1 === "all" ? undefined : value_1
                });
            }
        })["UserManagementContent[<Select>.onValueChange]"];
        $[57] = updateFilters;
        $[58] = t25;
    } else {
        t25 = $[58];
    }
    let t26;
    if ($[59] === Symbol.for("react.memo_cache_sentinel")) {
        t26 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectTrigger"], {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectValue"], {
                placeholder: "All Roles"
            }, void 0, false, {
                fileName: "[project]/src/app/(dashboard)/admin/settings/users/_components/UserManagementContent.tsx",
                lineNumber: 433,
                columnNumber: 26
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/admin/settings/users/_components/UserManagementContent.tsx",
            lineNumber: 433,
            columnNumber: 11
        }, this);
        $[59] = t26;
    } else {
        t26 = $[59];
    }
    let t27;
    if ($[60] === Symbol.for("react.memo_cache_sentinel")) {
        t27 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectContent"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                    value: "all",
                    children: "All Roles"
                }, void 0, false, {
                    fileName: "[project]/src/app/(dashboard)/admin/settings/users/_components/UserManagementContent.tsx",
                    lineNumber: 440,
                    columnNumber: 26
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                    value: "ADMIN",
                    children: "Admin"
                }, void 0, false, {
                    fileName: "[project]/src/app/(dashboard)/admin/settings/users/_components/UserManagementContent.tsx",
                    lineNumber: 440,
                    columnNumber: 72
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                    value: "DISTRICT_ADMIN",
                    children: "District Admin"
                }, void 0, false, {
                    fileName: "[project]/src/app/(dashboard)/admin/settings/users/_components/UserManagementContent.tsx",
                    lineNumber: 440,
                    columnNumber: 116
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                    value: "SCHOOL_ADMIN",
                    children: "School Admin"
                }, void 0, false, {
                    fileName: "[project]/src/app/(dashboard)/admin/settings/users/_components/UserManagementContent.tsx",
                    lineNumber: 440,
                    columnNumber: 178
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                    value: "NURSE",
                    children: "Nurse"
                }, void 0, false, {
                    fileName: "[project]/src/app/(dashboard)/admin/settings/users/_components/UserManagementContent.tsx",
                    lineNumber: 440,
                    columnNumber: 236
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                    value: "VIEWER",
                    children: "Viewer"
                }, void 0, false, {
                    fileName: "[project]/src/app/(dashboard)/admin/settings/users/_components/UserManagementContent.tsx",
                    lineNumber: 440,
                    columnNumber: 280
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                    value: "COUNSELOR",
                    children: "Counselor"
                }, void 0, false, {
                    fileName: "[project]/src/app/(dashboard)/admin/settings/users/_components/UserManagementContent.tsx",
                    lineNumber: 440,
                    columnNumber: 326
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/admin/settings/users/_components/UserManagementContent.tsx",
            lineNumber: 440,
            columnNumber: 11
        }, this);
        $[60] = t27;
    } else {
        t27 = $[60];
    }
    let t28;
    if ($[61] !== roleFilter || $[62] !== t25) {
        t28 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Select"], {
                value: roleFilter,
                onValueChange: t25,
                children: [
                    t26,
                    t27
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/(dashboard)/admin/settings/users/_components/UserManagementContent.tsx",
                lineNumber: 447,
                columnNumber: 16
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/admin/settings/users/_components/UserManagementContent.tsx",
            lineNumber: 447,
            columnNumber: 11
        }, this);
        $[61] = roleFilter;
        $[62] = t25;
        $[63] = t28;
    } else {
        t28 = $[63];
    }
    let t29;
    if ($[64] !== updateFilters) {
        t29 = ({
            "UserManagementContent[<Select>.onValueChange]": (value_2)=>{
                setStatusFilter(value_2);
                updateFilters({
                    status: value_2 === "all" ? undefined : value_2
                });
            }
        })["UserManagementContent[<Select>.onValueChange]"];
        $[64] = updateFilters;
        $[65] = t29;
    } else {
        t29 = $[65];
    }
    let t30;
    if ($[66] === Symbol.for("react.memo_cache_sentinel")) {
        t30 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectTrigger"], {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectValue"], {
                placeholder: "All Status"
            }, void 0, false, {
                fileName: "[project]/src/app/(dashboard)/admin/settings/users/_components/UserManagementContent.tsx",
                lineNumber: 471,
                columnNumber: 26
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/admin/settings/users/_components/UserManagementContent.tsx",
            lineNumber: 471,
            columnNumber: 11
        }, this);
        $[66] = t30;
    } else {
        t30 = $[66];
    }
    let t31;
    if ($[67] === Symbol.for("react.memo_cache_sentinel")) {
        t31 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectContent"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                    value: "all",
                    children: "All Status"
                }, void 0, false, {
                    fileName: "[project]/src/app/(dashboard)/admin/settings/users/_components/UserManagementContent.tsx",
                    lineNumber: 478,
                    columnNumber: 26
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                    value: "active",
                    children: "Active"
                }, void 0, false, {
                    fileName: "[project]/src/app/(dashboard)/admin/settings/users/_components/UserManagementContent.tsx",
                    lineNumber: 478,
                    columnNumber: 73
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                    value: "inactive",
                    children: "Inactive"
                }, void 0, false, {
                    fileName: "[project]/src/app/(dashboard)/admin/settings/users/_components/UserManagementContent.tsx",
                    lineNumber: 478,
                    columnNumber: 119
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/admin/settings/users/_components/UserManagementContent.tsx",
            lineNumber: 478,
            columnNumber: 11
        }, this);
        $[67] = t31;
    } else {
        t31 = $[67];
    }
    let t32;
    if ($[68] !== statusFilter || $[69] !== t29) {
        t32 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Select"], {
                value: statusFilter,
                onValueChange: t29,
                children: [
                    t30,
                    t31
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/(dashboard)/admin/settings/users/_components/UserManagementContent.tsx",
                lineNumber: 485,
                columnNumber: 16
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/admin/settings/users/_components/UserManagementContent.tsx",
            lineNumber: 485,
            columnNumber: 11
        }, this);
        $[68] = statusFilter;
        $[69] = t29;
        $[70] = t32;
    } else {
        t32 = $[70];
    }
    let t33;
    if ($[71] !== t24 || $[72] !== t28 || $[73] !== t32) {
        t33 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                className: "p-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-1 md:grid-cols-4 gap-4",
                    children: [
                        t24,
                        t28,
                        t32
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(dashboard)/admin/settings/users/_components/UserManagementContent.tsx",
                    lineNumber: 494,
                    columnNumber: 46
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/(dashboard)/admin/settings/users/_components/UserManagementContent.tsx",
                lineNumber: 494,
                columnNumber: 17
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/admin/settings/users/_components/UserManagementContent.tsx",
            lineNumber: 494,
            columnNumber: 11
        }, this);
        $[71] = t24;
        $[72] = t28;
        $[73] = t32;
        $[74] = t33;
    } else {
        t33 = $[74];
    }
    let t34;
    if ($[75] !== handleBulkDelete || $[76] !== isPending || $[77] !== selectedUsers.length) {
        t34 = selectedUsers.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
            className: "border-blue-200 bg-blue-50",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                className: "p-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-sm font-medium text-blue-900",
                            children: [
                                selectedUsers.length,
                                " user",
                                selectedUsers.length !== 1 && "s",
                                " selected"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(dashboard)/admin/settings/users/_components/UserManagementContent.tsx",
                            lineNumber: 504,
                            columnNumber: 164
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex gap-2",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                variant: "destructive",
                                size: "sm",
                                onClick: handleBulkDelete,
                                disabled: isPending,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                        className: "h-4 w-4 mr-2"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(dashboard)/admin/settings/users/_components/UserManagementContent.tsx",
                                        lineNumber: 504,
                                        columnNumber: 410
                                    }, this),
                                    "Delete Selected"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/(dashboard)/admin/settings/users/_components/UserManagementContent.tsx",
                                lineNumber: 504,
                                columnNumber: 322
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/(dashboard)/admin/settings/users/_components/UserManagementContent.tsx",
                            lineNumber: 504,
                            columnNumber: 294
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(dashboard)/admin/settings/users/_components/UserManagementContent.tsx",
                    lineNumber: 504,
                    columnNumber: 113
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/(dashboard)/admin/settings/users/_components/UserManagementContent.tsx",
                lineNumber: 504,
                columnNumber: 84
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/admin/settings/users/_components/UserManagementContent.tsx",
            lineNumber: 504,
            columnNumber: 39
        }, this);
        $[75] = handleBulkDelete;
        $[76] = isPending;
        $[77] = selectedUsers.length;
        $[78] = t34;
    } else {
        t34 = $[78];
    }
    const t35 = selectedUsers.length === filteredUsers.length && filteredUsers.length > 0;
    let t36;
    if ($[79] !== t35 || $[80] !== toggleSelectAll) {
        t36 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
            className: "w-12",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$checkbox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Checkbox"], {
                checked: t35,
                onCheckedChange: toggleSelectAll
            }, void 0, false, {
                fileName: "[project]/src/app/(dashboard)/admin/settings/users/_components/UserManagementContent.tsx",
                lineNumber: 515,
                columnNumber: 39
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/admin/settings/users/_components/UserManagementContent.tsx",
            lineNumber: 515,
            columnNumber: 11
        }, this);
        $[79] = t35;
        $[80] = toggleSelectAll;
        $[81] = t36;
    } else {
        t36 = $[81];
    }
    let t37;
    let t38;
    let t39;
    let t40;
    let t41;
    if ($[82] === Symbol.for("react.memo_cache_sentinel")) {
        t37 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
            children: "User"
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/admin/settings/users/_components/UserManagementContent.tsx",
            lineNumber: 528,
            columnNumber: 11
        }, this);
        t38 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
            children: "Role"
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/admin/settings/users/_components/UserManagementContent.tsx",
            lineNumber: 529,
            columnNumber: 11
        }, this);
        t39 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
            children: "Status"
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/admin/settings/users/_components/UserManagementContent.tsx",
            lineNumber: 530,
            columnNumber: 11
        }, this);
        t40 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
            children: "Last Login"
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/admin/settings/users/_components/UserManagementContent.tsx",
            lineNumber: 531,
            columnNumber: 11
        }, this);
        t41 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
            className: "text-right",
            children: "Actions"
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/admin/settings/users/_components/UserManagementContent.tsx",
            lineNumber: 532,
            columnNumber: 11
        }, this);
        $[82] = t37;
        $[83] = t38;
        $[84] = t39;
        $[85] = t40;
        $[86] = t41;
    } else {
        t37 = $[82];
        t38 = $[83];
        t39 = $[84];
        t40 = $[85];
        t41 = $[86];
    }
    let t42;
    if ($[87] !== t36) {
        t42 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHeader"], {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableRow"], {
                children: [
                    t36,
                    t37,
                    t38,
                    t39,
                    t40,
                    t41
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/(dashboard)/admin/settings/users/_components/UserManagementContent.tsx",
                lineNumber: 547,
                columnNumber: 24
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/admin/settings/users/_components/UserManagementContent.tsx",
            lineNumber: 547,
            columnNumber: 11
        }, this);
        $[87] = t36;
        $[88] = t42;
    } else {
        t42 = $[88];
    }
    let t43;
    if ($[89] !== filteredUsers || $[90] !== isPending || $[91] !== router || $[92] !== selectedUsers) {
        let t44;
        if ($[94] !== isPending || $[95] !== router || $[96] !== selectedUsers) {
            t44 = ({
                "UserManagementContent[filteredUsers.map()]": (user_0)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableRow"], {
                        className: "hover:bg-gray-50",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$checkbox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Checkbox"], {
                                    checked: selectedUsers.includes(user_0.id),
                                    onCheckedChange: {
                                        "UserManagementContent[filteredUsers.map() > <Checkbox>.onCheckedChange]": ()=>toggleUserSelection(user_0.id)
                                    }["UserManagementContent[filteredUsers.map() > <Checkbox>.onCheckedChange]"]
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(dashboard)/admin/settings/users/_components/UserManagementContent.tsx",
                                    lineNumber: 558,
                                    columnNumber: 131
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/(dashboard)/admin/settings/users/_components/UserManagementContent.tsx",
                                lineNumber: 558,
                                columnNumber: 120
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "h-10 w-10 flex-shrink-0",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-blue-600 font-medium",
                                                    children: [
                                                        user_0.firstName[0],
                                                        user_0.lastName[0]
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/(dashboard)/admin/settings/users/_components/UserManagementContent.tsx",
                                                    lineNumber: 560,
                                                    columnNumber: 277
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(dashboard)/admin/settings/users/_components/UserManagementContent.tsx",
                                                lineNumber: 560,
                                                columnNumber: 192
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(dashboard)/admin/settings/users/_components/UserManagementContent.tsx",
                                            lineNumber: 560,
                                            columnNumber: 151
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "ml-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-sm font-medium text-gray-900",
                                                    children: [
                                                        user_0.firstName,
                                                        " ",
                                                        user_0.lastName
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/(dashboard)/admin/settings/users/_components/UserManagementContent.tsx",
                                                    lineNumber: 560,
                                                    columnNumber: 403
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-sm text-gray-500",
                                                    children: user_0.email
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(dashboard)/admin/settings/users/_components/UserManagementContent.tsx",
                                                    lineNumber: 560,
                                                    columnNumber: 496
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/(dashboard)/admin/settings/users/_components/UserManagementContent.tsx",
                                            lineNumber: 560,
                                            columnNumber: 381
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/(dashboard)/admin/settings/users/_components/UserManagementContent.tsx",
                                    lineNumber: 560,
                                    columnNumber: 116
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/(dashboard)/admin/settings/users/_components/UserManagementContent.tsx",
                                lineNumber: 560,
                                columnNumber: 105
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                    variant: "secondary",
                                    children: user_0.role
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(dashboard)/admin/settings/users/_components/UserManagementContent.tsx",
                                    lineNumber: 560,
                                    columnNumber: 590
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/(dashboard)/admin/settings/users/_components/UserManagementContent.tsx",
                                lineNumber: 560,
                                columnNumber: 579
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                    variant: user_0.status === "active" ? "success" : "secondary",
                                    children: user_0.status
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(dashboard)/admin/settings/users/_components/UserManagementContent.tsx",
                                    lineNumber: 560,
                                    columnNumber: 661
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/(dashboard)/admin/settings/users/_components/UserManagementContent.tsx",
                                lineNumber: 560,
                                columnNumber: 650
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                className: "text-sm text-gray-500",
                                children: user_0.lastLogin ? new Date(user_0.lastLogin).toLocaleDateString() : "Never"
                            }, void 0, false, {
                                fileName: "[project]/src/app/(dashboard)/admin/settings/users/_components/UserManagementContent.tsx",
                                lineNumber: 560,
                                columnNumber: 766
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-end gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                            variant: "ghost",
                                            size: "sm",
                                            onClick: {
                                                "UserManagementContent[filteredUsers.map() > <Button>.onClick]": ()=>handleResetPassword(user_0.id)
                                            }["UserManagementContent[filteredUsers.map() > <Button>.onClick]"],
                                            disabled: isPending,
                                            title: "Reset Password",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$key$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Key$3e$__["Key"], {
                                                className: "h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(dashboard)/admin/settings/users/_components/UserManagementContent.tsx",
                                                lineNumber: 562,
                                                columnNumber: 127
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(dashboard)/admin/settings/users/_components/UserManagementContent.tsx",
                                            lineNumber: 560,
                                            columnNumber: 965
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                            variant: "ghost",
                                            size: "sm",
                                            onClick: {
                                                "UserManagementContent[filteredUsers.map() > <Button>.onClick]": ()=>router.push(`/admin/settings/users/${user_0.id}/edit`)
                                            }["UserManagementContent[filteredUsers.map() > <Button>.onClick]"],
                                            disabled: isPending,
                                            title: "Edit User",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$pen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit$3e$__["Edit"], {
                                                className: "h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(dashboard)/admin/settings/users/_components/UserManagementContent.tsx",
                                                lineNumber: 564,
                                                columnNumber: 122
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(dashboard)/admin/settings/users/_components/UserManagementContent.tsx",
                                            lineNumber: 562,
                                            columnNumber: 163
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                            variant: "ghost",
                                            size: "sm",
                                            onClick: {
                                                "UserManagementContent[filteredUsers.map() > <Button>.onClick]": ()=>handleDeleteUser(user_0.id)
                                            }["UserManagementContent[filteredUsers.map() > <Button>.onClick]"],
                                            disabled: isPending,
                                            title: "Delete User",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                className: "h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(dashboard)/admin/settings/users/_components/UserManagementContent.tsx",
                                                lineNumber: 566,
                                                columnNumber: 124
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(dashboard)/admin/settings/users/_components/UserManagementContent.tsx",
                                            lineNumber: 564,
                                            columnNumber: 159
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/(dashboard)/admin/settings/users/_components/UserManagementContent.tsx",
                                    lineNumber: 560,
                                    columnNumber: 912
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/(dashboard)/admin/settings/users/_components/UserManagementContent.tsx",
                                lineNumber: 560,
                                columnNumber: 901
                            }, this)
                        ]
                    }, user_0.id, true, {
                        fileName: "[project]/src/app/(dashboard)/admin/settings/users/_components/UserManagementContent.tsx",
                        lineNumber: 558,
                        columnNumber: 65
                    }, this)
            })["UserManagementContent[filteredUsers.map()]"];
            $[94] = isPending;
            $[95] = router;
            $[96] = selectedUsers;
            $[97] = t44;
        } else {
            t44 = $[97];
        }
        t43 = filteredUsers.map(t44);
        $[89] = filteredUsers;
        $[90] = isPending;
        $[91] = router;
        $[92] = selectedUsers;
        $[93] = t43;
    } else {
        t43 = $[93];
    }
    let t44;
    if ($[98] !== t43) {
        t44 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableBody"], {
            children: t43
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/admin/settings/users/_components/UserManagementContent.tsx",
            lineNumber: 586,
            columnNumber: 11
        }, this);
        $[98] = t43;
        $[99] = t44;
    } else {
        t44 = $[99];
    }
    let t45;
    if ($[100] !== t42 || $[101] !== t44) {
        t45 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Table"], {
            children: [
                t42,
                t44
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/admin/settings/users/_components/UserManagementContent.tsx",
            lineNumber: 594,
            columnNumber: 11
        }, this);
        $[100] = t42;
        $[101] = t44;
        $[102] = t45;
    } else {
        t45 = $[102];
    }
    let t46;
    if ($[103] !== filteredUsers.length || $[104] !== roleFilter || $[105] !== router || $[106] !== searchQuery || $[107] !== statusFilter) {
        t46 = filteredUsers.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "text-center py-12",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"], {
                    className: "h-12 w-12 text-gray-400 mx-auto mb-4"
                }, void 0, false, {
                    fileName: "[project]/src/app/(dashboard)/admin/settings/users/_components/UserManagementContent.tsx",
                    lineNumber: 603,
                    columnNumber: 76
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                    className: "text-lg font-medium text-gray-900 mb-2",
                    children: "No users found"
                }, void 0, false, {
                    fileName: "[project]/src/app/(dashboard)/admin/settings/users/_components/UserManagementContent.tsx",
                    lineNumber: 603,
                    columnNumber: 134
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-gray-500 mb-4",
                    children: searchQuery || roleFilter !== "all" || statusFilter !== "all" ? "Try adjusting your search or filters" : "Get started by adding your first user"
                }, void 0, false, {
                    fileName: "[project]/src/app/(dashboard)/admin/settings/users/_components/UserManagementContent.tsx",
                    lineNumber: 603,
                    columnNumber: 208
                }, this),
                !searchQuery && roleFilter === "all" && statusFilter === "all" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                    onClick: {
                        "UserManagementContent[<Button>.onClick]": ()=>router.push("/admin/settings/users/new")
                    }["UserManagementContent[<Button>.onClick]"],
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                            className: "h-4 w-4 mr-2"
                        }, void 0, false, {
                            fileName: "[project]/src/app/(dashboard)/admin/settings/users/_components/UserManagementContent.tsx",
                            lineNumber: 605,
                            columnNumber: 53
                        }, this),
                        "Add User"
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(dashboard)/admin/settings/users/_components/UserManagementContent.tsx",
                    lineNumber: 603,
                    columnNumber: 459
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/admin/settings/users/_components/UserManagementContent.tsx",
            lineNumber: 603,
            columnNumber: 41
        }, this);
        $[103] = filteredUsers.length;
        $[104] = roleFilter;
        $[105] = router;
        $[106] = searchQuery;
        $[107] = statusFilter;
        $[108] = t46;
    } else {
        t46 = $[108];
    }
    let t47;
    if ($[109] !== t45 || $[110] !== t46) {
        t47 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                className: "p-0",
                children: [
                    t45,
                    t46
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/(dashboard)/admin/settings/users/_components/UserManagementContent.tsx",
                lineNumber: 617,
                columnNumber: 17
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/admin/settings/users/_components/UserManagementContent.tsx",
            lineNumber: 617,
            columnNumber: 11
        }, this);
        $[109] = t45;
        $[110] = t46;
        $[111] = t47;
    } else {
        t47 = $[111];
    }
    let t48;
    if ($[112] !== t21 || $[113] !== t33 || $[114] !== t34 || $[115] !== t47) {
        t48 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-6",
            children: [
                t21,
                t33,
                t34,
                t47
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/admin/settings/users/_components/UserManagementContent.tsx",
            lineNumber: 626,
            columnNumber: 11
        }, this);
        $[112] = t21;
        $[113] = t33;
        $[114] = t34;
        $[115] = t47;
        $[116] = t48;
    } else {
        t48 = $[116];
    }
    return t48;
}
_s(UserManagementContent, "I1VsyQQdTVxoepsQRhT7RJttSGM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTransition"]
    ];
});
_c = UserManagementContent;
async function _UserManagementContentHandleResetPassword(userId_1) {
    if (!confirm("Send password reset email to this user?")) {
        return;
    }
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].success("Password reset email sent");
}
function _UserManagementContentToggleSelectAllSetSelectedUsersFilteredUsersMap(u) {
    return u.id;
}
var _c;
__turbopack_context__.k.register(_c, "UserManagementContent");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_bd6b3ff8._.js.map