(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/admin/AdminDataTable.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AdminDataTable",
    ()=>AdminDataTable
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
/**
 * AdminDataTable Component
 *
 * Advanced data table component for admin interfaces with filtering,
 * sorting, pagination, and export capabilities.
 * Now with dark mode support and semantic design tokens.
 *
 * @module components/admin/AdminDataTable
 * @since 2025-10-26
 * @updated 2025-11-04 - Added dark mode support
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/download.js [app-client] (ecmascript) <export default as Download>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUp$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-up.js [app-client] (ecmascript) <export default as ChevronUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevrons$2d$up$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronsUpDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevrons-up-down.js [app-client] (ecmascript) <export default as ChevronsUpDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
const AdminDataTableComponent = function AdminDataTable(t0) {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(58);
    if ($[0] !== "304124a1312e6cf53e206d034e950bc5c2d19cbe1c8508479c1f2bd769d53a2e") {
        for(let $i = 0; $i < 58; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "304124a1312e6cf53e206d034e950bc5c2d19cbe1c8508479c1f2bd769d53a2e";
    }
    const { data, columns, searchable: t1, searchPlaceholder: t2, exportable: t3, onExport, pagination, loading: t4, emptyMessage: t5, onRowClick, className: t6 } = t0;
    const searchable = t1 === undefined ? true : t1;
    const searchPlaceholder = t2 === undefined ? "Search..." : t2;
    const exportable = t3 === undefined ? true : t3;
    const loading = t4 === undefined ? false : t4;
    const emptyMessage = t5 === undefined ? "No data available" : t5;
    const className = t6 === undefined ? "" : t6;
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [sortColumn, setSortColumn] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [sortDirection, setSortDirection] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("asc");
    const [showExportMenu, setShowExportMenu] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    let t7;
    bb0: {
        if (!searchQuery) {
            t7 = data;
            break bb0;
        }
        let t8;
        if ($[1] !== data || $[2] !== searchQuery) {
            let t9;
            if ($[4] !== searchQuery) {
                t9 = ({
                    "AdminDataTable[data.filter()]": (row)=>Object.values(row).some({
                            "AdminDataTable[data.filter() > (anonymous)()]": (value)=>String(value).toLowerCase().includes(searchQuery.toLowerCase())
                        }["AdminDataTable[data.filter() > (anonymous)()]"])
                })["AdminDataTable[data.filter()]"];
                $[4] = searchQuery;
                $[5] = t9;
            } else {
                t9 = $[5];
            }
            t8 = data.filter(t9);
            $[1] = data;
            $[2] = searchQuery;
            $[3] = t8;
        } else {
            t8 = $[3];
        }
        t7 = t8;
    }
    const filteredData = t7;
    let t8;
    bb1: {
        if (!sortColumn) {
            t8 = filteredData;
            break bb1;
        }
        let t9;
        if ($[6] !== filteredData || $[7] !== sortColumn || $[8] !== sortDirection) {
            let t10;
            if ($[10] !== sortColumn || $[11] !== sortDirection) {
                t10 = ({
                    "AdminDataTable[(anonymous)()]": (a, b)=>{
                        const aValue = a[sortColumn];
                        const bValue = b[sortColumn];
                        if (aValue === bValue) {
                            return 0;
                        }
                        const comparison = aValue > bValue ? 1 : -1;
                        return sortDirection === "asc" ? comparison : -comparison;
                    }
                })["AdminDataTable[(anonymous)()]"];
                $[10] = sortColumn;
                $[11] = sortDirection;
                $[12] = t10;
            } else {
                t10 = $[12];
            }
            t9 = [
                ...filteredData
            ].sort(t10);
            $[6] = filteredData;
            $[7] = sortColumn;
            $[8] = sortDirection;
            $[9] = t9;
        } else {
            t9 = $[9];
        }
        t8 = t9;
    }
    const sortedData = t8;
    let t9;
    if ($[13] !== sortColumn || $[14] !== sortDirection) {
        t9 = ({
            "AdminDataTable[handleSort]": (column)=>{
                if (!column.sortable) {
                    return;
                }
                if (sortColumn === column.key) {
                    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
                } else {
                    setSortColumn(column.key);
                    setSortDirection("asc");
                }
            }
        })["AdminDataTable[handleSort]"];
        $[13] = sortColumn;
        $[14] = sortDirection;
        $[15] = t9;
    } else {
        t9 = $[15];
    }
    const handleSort = t9;
    let t10;
    if ($[16] !== onExport) {
        t10 = ({
            "AdminDataTable[handleExport]": (format)=>{
                setShowExportMenu(false);
                onExport?.(format);
            }
        })["AdminDataTable[handleExport]"];
        $[16] = onExport;
        $[17] = t10;
    } else {
        t10 = $[17];
    }
    const handleExport = t10;
    let t11;
    if ($[18] !== sortColumn || $[19] !== sortDirection) {
        t11 = ({
            "AdminDataTable[getSortIcon]": (column_0)=>{
                if (!column_0.sortable) {
                    return null;
                }
                if (sortColumn !== column_0.key) {
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevrons$2d$up$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronsUpDown$3e$__["ChevronsUpDown"], {
                        className: "h-4 w-4 text-muted-foreground dark:text-muted-foreground"
                    }, void 0, false, {
                        fileName: "[project]/src/components/admin/AdminDataTable.tsx",
                        lineNumber: 188,
                        columnNumber: 18
                    }, this);
                }
                return sortDirection === "asc" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUp$3e$__["ChevronUp"], {
                    className: "h-4 w-4 text-primary dark:text-primary"
                }, void 0, false, {
                    fileName: "[project]/src/components/admin/AdminDataTable.tsx",
                    lineNumber: 190,
                    columnNumber: 42
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                    className: "h-4 w-4 text-primary dark:text-primary"
                }, void 0, false, {
                    fileName: "[project]/src/components/admin/AdminDataTable.tsx",
                    lineNumber: 190,
                    columnNumber: 109
                }, this);
            }
        })["AdminDataTable[getSortIcon]"];
        $[18] = sortColumn;
        $[19] = sortDirection;
        $[20] = t11;
    } else {
        t11 = $[20];
    }
    const getSortIcon = t11;
    let t12;
    if ($[21] !== className) {
        t12 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("bg-card dark:bg-card rounded-lg shadow-card dark:shadow-none border border-border dark:border-border/50", className);
        $[21] = className;
        $[22] = t12;
    } else {
        t12 = $[22];
    }
    let t13;
    if ($[23] !== exportable || $[24] !== handleExport || $[25] !== onExport || $[26] !== searchPlaceholder || $[27] !== searchQuery || $[28] !== searchable || $[29] !== showExportMenu) {
        t13 = (searchable || exportable) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "p-4 border-b border-border dark:border-border/50 flex items-center justify-between gap-4",
            children: [
                searchable && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "relative flex-1 max-w-md",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                            className: "absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground dark:text-muted-foreground"
                        }, void 0, false, {
                            fileName: "[project]/src/components/admin/AdminDataTable.tsx",
                            lineNumber: 210,
                            columnNumber: 204
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            type: "text",
                            placeholder: searchPlaceholder,
                            value: searchQuery,
                            onChange: {
                                "AdminDataTable[<input>.onChange]": (e)=>setSearchQuery(e.target.value)
                            }["AdminDataTable[<input>.onChange]"],
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("w-full pl-10 pr-4 py-2 rounded-lg transition-colors", "bg-background dark:bg-background", "border border-input dark:border-input", "text-foreground dark:text-foreground", "placeholder:text-muted-foreground dark:placeholder:text-muted-foreground", "focus:ring-2 focus:ring-ring focus:border-transparent", "focus-visible:outline-none")
                        }, void 0, false, {
                            fileName: "[project]/src/components/admin/AdminDataTable.tsx",
                            lineNumber: 210,
                            columnNumber: 324
                        }, this),
                        searchQuery && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: {
                                "AdminDataTable[<button>.onClick]": ()=>setSearchQuery("")
                            }["AdminDataTable[<button>.onClick]"],
                            className: "absolute right-3 top-1/2 -translate-y-1/2",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                className: "h-5 w-5 text-muted-foreground hover:text-foreground dark:hover:text-foreground transition-colors"
                            }, void 0, false, {
                                fileName: "[project]/src/components/admin/AdminDataTable.tsx",
                                lineNumber: 214,
                                columnNumber: 102
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/admin/AdminDataTable.tsx",
                            lineNumber: 212,
                            columnNumber: 416
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/admin/AdminDataTable.tsx",
                    lineNumber: 210,
                    columnNumber: 162
                }, this),
                exportable && onExport && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "relative",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: {
                                "AdminDataTable[<button>.onClick]": ()=>setShowExportMenu(!showExportMenu)
                            }["AdminDataTable[<button>.onClick]"],
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex items-center gap-2 px-4 py-2 rounded-lg transition-colors", "bg-primary text-primary-foreground", "hover:bg-primary/90", "dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90"),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                    className: "h-5 w-5"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/admin/AdminDataTable.tsx",
                                    lineNumber: 216,
                                    columnNumber: 263
                                }, this),
                                "Export"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/admin/AdminDataTable.tsx",
                            lineNumber: 214,
                            columnNumber: 286
                        }, this),
                        showExportMenu && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("absolute right-0 mt-2 w-48 rounded-lg shadow-lg z-10", "bg-popover dark:bg-popover", "border border-border dark:border-border"),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: {
                                        "AdminDataTable[<button>.onClick]": ()=>handleExport("csv")
                                    }["AdminDataTable[<button>.onClick]"],
                                    className: "w-full px-4 py-2 text-left text-foreground dark:text-foreground hover:bg-accent dark:hover:bg-accent first:rounded-t-lg transition-colors",
                                    children: "Export as CSV"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/admin/AdminDataTable.tsx",
                                    lineNumber: 216,
                                    columnNumber: 478
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: {
                                        "AdminDataTable[<button>.onClick]": ()=>handleExport("json")
                                    }["AdminDataTable[<button>.onClick]"],
                                    className: "w-full px-4 py-2 text-left text-foreground dark:text-foreground hover:bg-accent dark:hover:bg-accent transition-colors",
                                    children: "Export as JSON"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/admin/AdminDataTable.tsx",
                                    lineNumber: 218,
                                    columnNumber: 222
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: {
                                        "AdminDataTable[<button>.onClick]": ()=>handleExport("excel")
                                    }["AdminDataTable[<button>.onClick]"],
                                    className: "w-full px-4 py-2 text-left text-foreground dark:text-foreground hover:bg-accent dark:hover:bg-accent last:rounded-b-lg transition-colors",
                                    children: "Export as Excel"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/admin/AdminDataTable.tsx",
                                    lineNumber: 220,
                                    columnNumber: 204
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/admin/AdminDataTable.tsx",
                            lineNumber: 216,
                            columnNumber: 329
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/admin/AdminDataTable.tsx",
                    lineNumber: 214,
                    columnNumber: 260
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/admin/AdminDataTable.tsx",
            lineNumber: 210,
            columnNumber: 41
        }, this);
        $[23] = exportable;
        $[24] = handleExport;
        $[25] = onExport;
        $[26] = searchPlaceholder;
        $[27] = searchQuery;
        $[28] = searchable;
        $[29] = showExportMenu;
        $[30] = t13;
    } else {
        t13 = $[30];
    }
    let t14;
    if ($[31] !== columns || $[32] !== getSortIcon || $[33] !== handleSort) {
        let t15;
        if ($[35] !== getSortIcon || $[36] !== handleSort) {
            t15 = ({
                "AdminDataTable[columns.map()]": (column_1)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("px-6 py-3 text-left text-xs font-medium uppercase tracking-wider", "text-muted-foreground dark:text-muted-foreground", column_1.sortable && "cursor-pointer hover:bg-muted dark:hover:bg-muted/50 transition-colors"),
                        style: {
                            width: column_1.width
                        },
                        onClick: {
                            "AdminDataTable[columns.map() > <th>.onClick]": ()=>handleSort(column_1)
                        }["AdminDataTable[columns.map() > <th>.onClick]"],
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-2",
                            children: [
                                column_1.header,
                                getSortIcon(column_1)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/admin/AdminDataTable.tsx",
                            lineNumber: 243,
                            columnNumber: 60
                        }, this)
                    }, String(column_1.key), false, {
                        fileName: "[project]/src/components/admin/AdminDataTable.tsx",
                        lineNumber: 239,
                        columnNumber: 54
                    }, this)
            })["AdminDataTable[columns.map()]"];
            $[35] = getSortIcon;
            $[36] = handleSort;
            $[37] = t15;
        } else {
            t15 = $[37];
        }
        t14 = columns.map(t15);
        $[31] = columns;
        $[32] = getSortIcon;
        $[33] = handleSort;
        $[34] = t14;
    } else {
        t14 = $[34];
    }
    let t15;
    if ($[38] !== t14) {
        t15 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
            className: "bg-muted/50 dark:bg-muted/30 border-b border-border dark:border-border/50",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                children: t14
            }, void 0, false, {
                fileName: "[project]/src/components/admin/AdminDataTable.tsx",
                lineNumber: 261,
                columnNumber: 104
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/admin/AdminDataTable.tsx",
            lineNumber: 261,
            columnNumber: 11
        }, this);
        $[38] = t14;
        $[39] = t15;
    } else {
        t15 = $[39];
    }
    let t16;
    if ($[40] !== columns || $[41] !== emptyMessage || $[42] !== loading || $[43] !== onRowClick || $[44] !== sortedData) {
        t16 = loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                colSpan: columns.length,
                className: "px-6 py-12 text-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-center",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "animate-spin rounded-full h-8 w-8 border-b-2 border-primary dark:border-primary"
                    }, void 0, false, {
                        fileName: "[project]/src/components/admin/AdminDataTable.tsx",
                        lineNumber: 269,
                        columnNumber: 139
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/admin/AdminDataTable.tsx",
                    lineNumber: 269,
                    columnNumber: 89
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/admin/AdminDataTable.tsx",
                lineNumber: 269,
                columnNumber: 25
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/admin/AdminDataTable.tsx",
            lineNumber: 269,
            columnNumber: 21
        }, this) : sortedData.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                colSpan: columns.length,
                className: "px-6 py-12 text-center text-muted-foreground dark:text-muted-foreground",
                children: emptyMessage
            }, void 0, false, {
                fileName: "[project]/src/components/admin/AdminDataTable.tsx",
                lineNumber: 269,
                columnNumber: 287
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/admin/AdminDataTable.tsx",
            lineNumber: 269,
            columnNumber: 283
        }, this) : sortedData.map({
            "AdminDataTable[sortedData.map()]": (row_0, rowIndex)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                    onClick: {
                        "AdminDataTable[sortedData.map() > <tr>.onClick]": ()=>onRowClick?.(row_0)
                    }["AdminDataTable[sortedData.map() > <tr>.onClick]"],
                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("transition-colors", onRowClick && "cursor-pointer hover:bg-muted/50 dark:hover:bg-muted/30"),
                    children: columns.map({
                        "AdminDataTable[sortedData.map() > columns.map()]": (column_2)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                className: "px-6 py-4 whitespace-nowrap text-sm text-foreground dark:text-foreground",
                                children: column_2.render ? column_2.render(row_0[column_2.key], row_0) : String(row_0[column_2.key] ?? "")
                            }, String(column_2.key), false, {
                                fileName: "[project]/src/components/admin/AdminDataTable.tsx",
                                lineNumber: 273,
                                columnNumber: 75
                            }, this)
                    }["AdminDataTable[sortedData.map() > columns.map()]"])
                }, rowIndex, false, {
                    fileName: "[project]/src/components/admin/AdminDataTable.tsx",
                    lineNumber: 270,
                    columnNumber: 64
                }, this)
        }["AdminDataTable[sortedData.map()]"]);
        $[40] = columns;
        $[41] = emptyMessage;
        $[42] = loading;
        $[43] = onRowClick;
        $[44] = sortedData;
        $[45] = t16;
    } else {
        t16 = $[45];
    }
    let t17;
    if ($[46] !== t16) {
        t17 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
            className: "divide-y divide-border dark:divide-border/50",
            children: t16
        }, void 0, false, {
            fileName: "[project]/src/components/admin/AdminDataTable.tsx",
            lineNumber: 287,
            columnNumber: 11
        }, this);
        $[46] = t16;
        $[47] = t17;
    } else {
        t17 = $[47];
    }
    let t18;
    if ($[48] !== t15 || $[49] !== t17) {
        t18 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "overflow-x-auto",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                className: "w-full",
                children: [
                    t15,
                    t17
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/admin/AdminDataTable.tsx",
                lineNumber: 295,
                columnNumber: 44
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/admin/AdminDataTable.tsx",
            lineNumber: 295,
            columnNumber: 11
        }, this);
        $[48] = t15;
        $[49] = t17;
        $[50] = t18;
    } else {
        t18 = $[50];
    }
    let t19;
    if ($[51] !== pagination) {
        t19 = pagination && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "px-6 py-4 border-t border-border dark:border-border/50 flex items-center justify-between",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-sm text-foreground dark:text-foreground",
                            children: "Rows per page:"
                        }, void 0, false, {
                            fileName: "[project]/src/components/admin/AdminDataTable.tsx",
                            lineNumber: 304,
                            columnNumber: 172
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                            value: pagination.pageSize,
                            onChange: {
                                "AdminDataTable[<select>.onChange]": (e_0)=>pagination.onPageSizeChange(Number(e_0.target.value))
                            }["AdminDataTable[<select>.onChange]"],
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("border rounded px-2 py-1 text-sm transition-colors", "bg-background dark:bg-background", "border-input dark:border-input", "text-foreground dark:text-foreground"),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: 10,
                                    children: "10"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/admin/AdminDataTable.tsx",
                                    lineNumber: 306,
                                    columnNumber: 228
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: 25,
                                    children: "25"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/admin/AdminDataTable.tsx",
                                    lineNumber: 306,
                                    columnNumber: 258
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: 50,
                                    children: "50"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/admin/AdminDataTable.tsx",
                                    lineNumber: 306,
                                    columnNumber: 288
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: 100,
                                    children: "100"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/admin/AdminDataTable.tsx",
                                    lineNumber: 306,
                                    columnNumber: 318
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/admin/AdminDataTable.tsx",
                            lineNumber: 304,
                            columnNumber: 256
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/admin/AdminDataTable.tsx",
                    lineNumber: 304,
                    columnNumber: 131
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-sm text-foreground dark:text-foreground",
                            children: [
                                "Page ",
                                pagination.page,
                                " of",
                                " ",
                                Math.ceil(pagination.total / pagination.pageSize)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/admin/AdminDataTable.tsx",
                            lineNumber: 306,
                            columnNumber: 406
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex gap-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: {
                                        "AdminDataTable[<button>.onClick]": ()=>pagination.onPageChange(pagination.page - 1)
                                    }["AdminDataTable[<button>.onClick]"],
                                    disabled: pagination.page === 1,
                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("px-3 py-1 rounded text-sm transition-colors", "border border-input dark:border-input", "bg-background dark:bg-background", "text-foreground dark:text-foreground", "hover:bg-accent dark:hover:bg-accent", "disabled:opacity-50 disabled:cursor-not-allowed"),
                                    children: "Previous"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/admin/AdminDataTable.tsx",
                                    lineNumber: 306,
                                    columnNumber: 585
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: {
                                        "AdminDataTable[<button>.onClick]": ()=>pagination.onPageChange(pagination.page + 1)
                                    }["AdminDataTable[<button>.onClick]"],
                                    disabled: pagination.page >= Math.ceil(pagination.total / pagination.pageSize),
                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("px-3 py-1 rounded text-sm transition-colors", "border border-input dark:border-input", "bg-background dark:bg-background", "text-foreground dark:text-foreground", "hover:bg-accent dark:hover:bg-accent", "disabled:opacity-50 disabled:cursor-not-allowed"),
                                    children: "Next"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/admin/AdminDataTable.tsx",
                                    lineNumber: 308,
                                    columnNumber: 370
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/admin/AdminDataTable.tsx",
                            lineNumber: 306,
                            columnNumber: 557
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/admin/AdminDataTable.tsx",
                    lineNumber: 306,
                    columnNumber: 365
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/admin/AdminDataTable.tsx",
            lineNumber: 304,
            columnNumber: 25
        }, this);
        $[51] = pagination;
        $[52] = t19;
    } else {
        t19 = $[52];
    }
    let t20;
    if ($[53] !== t12 || $[54] !== t13 || $[55] !== t18 || $[56] !== t19) {
        t20 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: t12,
            children: [
                t13,
                t18,
                t19
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/admin/AdminDataTable.tsx",
            lineNumber: 318,
            columnNumber: 11
        }, this);
        $[53] = t12;
        $[54] = t13;
        $[55] = t18;
        $[56] = t19;
        $[57] = t20;
    } else {
        t20 = $[57];
    }
    return t20;
};
_s(AdminDataTableComponent, "iLL8OnARWU6jz3eCDZNwVmVP3e0=");
_c = AdminDataTableComponent;
const AdminDataTable = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].memo(AdminDataTableComponent);
_c1 = AdminDataTable;
var _c, _c1;
__turbopack_context__.k.register(_c, "AdminDataTableComponent");
__turbopack_context__.k.register(_c1, "AdminDataTable");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/admin/AdminMetricCard.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AdminMetricCard",
    ()=>AdminMetricCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
/**
 * AdminMetricCard Component
 *
 * Displays key metrics and statistics in the admin dashboard.
 * Now with dark mode support and semantic design tokens.
 *
 * @module components/admin/AdminMetricCard
 * @since 2025-10-26
 * @updated 2025-11-04 - Added dark mode support
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trending-up.js [app-client] (ecmascript) <export default as TrendingUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trending-down.js [app-client] (ecmascript) <export default as TrendingDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
'use client';
;
;
;
;
/**
 * Color classes using semantic tokens for consistent light/dark mode support
 */ const colorClasses = {
    primary: {
        bg: 'bg-primary/10 dark:bg-primary/20',
        text: 'text-primary dark:text-primary',
        border: 'border-primary/20 dark:border-primary/30'
    },
    success: {
        bg: 'bg-success/10 dark:bg-success/20',
        text: 'text-success dark:text-success',
        border: 'border-success/20 dark:border-success/30'
    },
    warning: {
        bg: 'bg-warning/10 dark:bg-warning/20',
        text: 'text-warning dark:text-warning',
        border: 'border-warning/20 dark:border-warning/30'
    },
    error: {
        bg: 'bg-error/10 dark:bg-error/20',
        text: 'text-error dark:text-error',
        border: 'border-error/20 dark:border-error/30'
    },
    info: {
        bg: 'bg-info/10 dark:bg-info/20',
        text: 'text-info dark:text-info',
        border: 'border-info/20 dark:border-info/30'
    },
    secondary: {
        bg: 'bg-secondary/10 dark:bg-secondary/20',
        text: 'text-secondary dark:text-secondary',
        border: 'border-secondary/20 dark:border-secondary/30'
    }
};
function AdminMetricCard(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(34);
    if ($[0] !== "79ed5be482979b0d5760c1139468c966832a73e6041a03654409e4e5668ef446") {
        for(let $i = 0; $i < 34; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "79ed5be482979b0d5760c1139468c966832a73e6041a03654409e4e5668ef446";
    }
    const { title, value, subtitle, icon: Icon, trend, color: t1, onClick, className: t2 } = t0;
    const color = t1 === undefined ? "primary" : t1;
    const className = t2 === undefined ? "" : t2;
    const colors = colorClasses[color];
    const t3 = onClick && "cursor-pointer hover:shadow-card-hover dark:hover:border-border";
    let t4;
    if ($[1] !== className || $[2] !== t3) {
        t4 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("bg-card dark:bg-card text-card-foreground rounded-lg shadow-card dark:shadow-none", "border border-border dark:border-border/50", "p-6 transition-all duration-200", t3, className);
        $[1] = className;
        $[2] = t3;
        $[3] = t4;
    } else {
        t4 = $[3];
    }
    let t5;
    if ($[4] !== title) {
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "text-sm font-medium text-secondary dark:text-muted-foreground mb-2",
            children: title
        }, void 0, false, {
            fileName: "[project]/src/components/admin/AdminMetricCard.tsx",
            lineNumber: 99,
            columnNumber: 10
        }, this);
        $[4] = title;
        $[5] = t5;
    } else {
        t5 = $[5];
    }
    let t6;
    if ($[6] !== value) {
        t6 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "text-3xl font-bold text-foreground dark:text-foreground",
            children: value
        }, void 0, false, {
            fileName: "[project]/src/components/admin/AdminMetricCard.tsx",
            lineNumber: 107,
            columnNumber: 10
        }, this);
        $[6] = value;
        $[7] = t6;
    } else {
        t6 = $[7];
    }
    let t7;
    if ($[8] !== subtitle) {
        t7 = subtitle && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "text-sm text-tertiary dark:text-muted-foreground mt-1",
            children: subtitle
        }, void 0, false, {
            fileName: "[project]/src/components/admin/AdminMetricCard.tsx",
            lineNumber: 115,
            columnNumber: 22
        }, this);
        $[8] = subtitle;
        $[9] = t7;
    } else {
        t7 = $[9];
    }
    let t8;
    if ($[10] !== trend) {
        t8 = trend && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex items-center gap-1 mt-2 text-sm font-medium", trend.positive !== undefined ? trend.positive ? "text-success dark:text-success" : "text-error dark:text-error" : trend.direction === "up" ? "text-success dark:text-success" : "text-error dark:text-error"),
            children: [
                trend.direction === "up" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__["TrendingUp"], {
                    className: "h-4 w-4"
                }, void 0, false, {
                    fileName: "[project]/src/components/admin/AdminMetricCard.tsx",
                    lineNumber: 123,
                    columnNumber: 325
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingDown$3e$__["TrendingDown"], {
                    className: "h-4 w-4"
                }, void 0, false, {
                    fileName: "[project]/src/components/admin/AdminMetricCard.tsx",
                    lineNumber: 123,
                    columnNumber: 362
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    children: trend.value
                }, void 0, false, {
                    fileName: "[project]/src/components/admin/AdminMetricCard.tsx",
                    lineNumber: 123,
                    columnNumber: 399
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/admin/AdminMetricCard.tsx",
            lineNumber: 123,
            columnNumber: 19
        }, this);
        $[10] = trend;
        $[11] = t8;
    } else {
        t8 = $[11];
    }
    let t9;
    if ($[12] !== t5 || $[13] !== t6 || $[14] !== t7 || $[15] !== t8) {
        t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex-1",
            children: [
                t5,
                t6,
                t7,
                t8
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/admin/AdminMetricCard.tsx",
            lineNumber: 131,
            columnNumber: 10
        }, this);
        $[12] = t5;
        $[13] = t6;
        $[14] = t7;
        $[15] = t8;
        $[16] = t9;
    } else {
        t9 = $[16];
    }
    let t10;
    if ($[17] !== colors.bg) {
        t10 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("p-3 rounded-lg", colors.bg);
        $[17] = colors.bg;
        $[18] = t10;
    } else {
        t10 = $[18];
    }
    let t11;
    if ($[19] !== colors.text) {
        t11 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("h-6 w-6", colors.text);
        $[19] = colors.text;
        $[20] = t11;
    } else {
        t11 = $[20];
    }
    let t12;
    if ($[21] !== Icon || $[22] !== t11) {
        t12 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
            className: t11
        }, void 0, false, {
            fileName: "[project]/src/components/admin/AdminMetricCard.tsx",
            lineNumber: 158,
            columnNumber: 11
        }, this);
        $[21] = Icon;
        $[22] = t11;
        $[23] = t12;
    } else {
        t12 = $[23];
    }
    let t13;
    if ($[24] !== t10 || $[25] !== t12) {
        t13 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: t10,
            children: t12
        }, void 0, false, {
            fileName: "[project]/src/components/admin/AdminMetricCard.tsx",
            lineNumber: 167,
            columnNumber: 11
        }, this);
        $[24] = t10;
        $[25] = t12;
        $[26] = t13;
    } else {
        t13 = $[26];
    }
    let t14;
    if ($[27] !== t13 || $[28] !== t9) {
        t14 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-between",
            children: [
                t9,
                t13
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/admin/AdminMetricCard.tsx",
            lineNumber: 176,
            columnNumber: 11
        }, this);
        $[27] = t13;
        $[28] = t9;
        $[29] = t14;
    } else {
        t14 = $[29];
    }
    let t15;
    if ($[30] !== onClick || $[31] !== t14 || $[32] !== t4) {
        t15 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: t4,
            onClick: onClick,
            children: t14
        }, void 0, false, {
            fileName: "[project]/src/components/admin/AdminMetricCard.tsx",
            lineNumber: 185,
            columnNumber: 11
        }, this);
        $[30] = onClick;
        $[31] = t14;
        $[32] = t4;
        $[33] = t15;
    } else {
        t15 = $[33];
    }
    return t15;
}
_c = AdminMetricCard;
var _c;
__turbopack_context__.k.register(_c, "AdminMetricCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/admin/AdminChart.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * AdminChart Component
 *
 * Recharts wrapper for admin dashboard visualizations.
 *
 * @module components/admin/AdminChart
 * @since 2025-10-26
 */ __turbopack_context__.s([
    "AdminChart",
    ()=>AdminChart
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$LineChart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/chart/LineChart.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Line$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/Line.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$BarChart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/chart/BarChart.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Bar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/Bar.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$AreaChart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/chart/AreaChart.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Area$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/Area.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$PieChart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/chart/PieChart.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$polar$2f$Pie$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/polar/Pie.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Cell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/component/Cell.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$XAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/XAxis.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$YAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/YAxis.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$CartesianGrid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/CartesianGrid.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/component/Tooltip.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Legend$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/component/Legend.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ResponsiveContainer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/component/ResponsiveContainer.js [app-client] (ecmascript)");
'use client';
;
;
;
const DEFAULT_COLORS = [
    '#3B82F6',
    // blue
    '#10B981',
    // green
    '#8B5CF6',
    // purple
    '#F59E0B',
    // orange
    '#EF4444',
    // red
    '#6B7280' // gray
];
function AdminChart(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(20);
    if ($[0] !== "0bd0b5fefdbd8834caa518ecd9454d68e6b534ffcabffff7dee8757e120bb3ef") {
        for(let $i = 0; $i < 20; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "0bd0b5fefdbd8834caa518ecd9454d68e6b534ffcabffff7dee8757e120bb3ef";
    }
    const { type, data, dataKey, xAxisKey: t1, height: t2, colors: t3, title, showLegend: t4, showGrid: t5, className: t6 } = t0;
    const xAxisKey = t1 === undefined ? "name" : t1;
    const height = t2 === undefined ? 300 : t2;
    const colors = t3 === undefined ? DEFAULT_COLORS : t3;
    const showLegend = t4 === undefined ? true : t4;
    const showGrid = t5 === undefined ? true : t5;
    const className = t6 === undefined ? "" : t6;
    let t7;
    if ($[1] !== colors || $[2] !== data || $[3] !== dataKey || $[4] !== showGrid || $[5] !== showLegend || $[6] !== type || $[7] !== xAxisKey) {
        t7 = ({
            "AdminChart[renderChart]": ()=>{
                switch(type){
                    case "line":
                        {
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$LineChart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LineChart"], {
                                data: data,
                                children: [
                                    showGrid && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$CartesianGrid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CartesianGrid"], {
                                        strokeDasharray: "3 3"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/admin/AdminChart.tsx",
                                        lineNumber: 71,
                                        columnNumber: 58
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$XAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["XAxis"], {
                                        dataKey: xAxisKey
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/admin/AdminChart.tsx",
                                        lineNumber: 71,
                                        columnNumber: 98
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$YAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["YAxis"], {}, void 0, false, {
                                        fileName: "[project]/src/components/admin/AdminChart.tsx",
                                        lineNumber: 71,
                                        columnNumber: 126
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tooltip"], {}, void 0, false, {
                                        fileName: "[project]/src/components/admin/AdminChart.tsx",
                                        lineNumber: 71,
                                        columnNumber: 135
                                    }, this),
                                    showLegend && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Legend$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Legend"], {}, void 0, false, {
                                        fileName: "[project]/src/components/admin/AdminChart.tsx",
                                        lineNumber: 71,
                                        columnNumber: 161
                                    }, this),
                                    Array.isArray(dataKey) ? dataKey.map({
                                        "AdminChart[renderChart > dataKey.map()]": (key_1, index_2)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Line$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Line"], {
                                                type: "monotone",
                                                dataKey: key_1,
                                                stroke: colors[index_2 % colors.length],
                                                strokeWidth: 2
                                            }, key_1, false, {
                                                fileName: "[project]/src/components/admin/AdminChart.tsx",
                                                lineNumber: 72,
                                                columnNumber: 82
                                            }, this)
                                    }["AdminChart[renderChart > dataKey.map()]"]) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Line$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Line"], {
                                        type: "monotone",
                                        dataKey: dataKey,
                                        stroke: colors[0],
                                        strokeWidth: 2
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/admin/AdminChart.tsx",
                                        lineNumber: 73,
                                        columnNumber: 65
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/admin/AdminChart.tsx",
                                lineNumber: 71,
                                columnNumber: 22
                            }, this);
                        }
                    case "bar":
                        {
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$BarChart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BarChart"], {
                                data: data,
                                children: [
                                    showGrid && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$CartesianGrid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CartesianGrid"], {
                                        strokeDasharray: "3 3"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/admin/AdminChart.tsx",
                                        lineNumber: 77,
                                        columnNumber: 57
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$XAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["XAxis"], {
                                        dataKey: xAxisKey
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/admin/AdminChart.tsx",
                                        lineNumber: 77,
                                        columnNumber: 97
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$YAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["YAxis"], {}, void 0, false, {
                                        fileName: "[project]/src/components/admin/AdminChart.tsx",
                                        lineNumber: 77,
                                        columnNumber: 125
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tooltip"], {}, void 0, false, {
                                        fileName: "[project]/src/components/admin/AdminChart.tsx",
                                        lineNumber: 77,
                                        columnNumber: 134
                                    }, this),
                                    showLegend && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Legend$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Legend"], {}, void 0, false, {
                                        fileName: "[project]/src/components/admin/AdminChart.tsx",
                                        lineNumber: 77,
                                        columnNumber: 160
                                    }, this),
                                    Array.isArray(dataKey) ? dataKey.map({
                                        "AdminChart[renderChart > dataKey.map()]": (key_0, index_1)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Bar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Bar"], {
                                                dataKey: key_0,
                                                fill: colors[index_1 % colors.length]
                                            }, key_0, false, {
                                                fileName: "[project]/src/components/admin/AdminChart.tsx",
                                                lineNumber: 78,
                                                columnNumber: 82
                                            }, this)
                                    }["AdminChart[renderChart > dataKey.map()]"]) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Bar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Bar"], {
                                        dataKey: dataKey,
                                        fill: colors[0]
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/admin/AdminChart.tsx",
                                        lineNumber: 79,
                                        columnNumber: 65
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/admin/AdminChart.tsx",
                                lineNumber: 77,
                                columnNumber: 22
                            }, this);
                        }
                    case "area":
                        {
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$AreaChart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AreaChart"], {
                                data: data,
                                children: [
                                    showGrid && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$CartesianGrid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CartesianGrid"], {
                                        strokeDasharray: "3 3"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/admin/AdminChart.tsx",
                                        lineNumber: 83,
                                        columnNumber: 58
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$XAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["XAxis"], {
                                        dataKey: xAxisKey
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/admin/AdminChart.tsx",
                                        lineNumber: 83,
                                        columnNumber: 98
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$YAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["YAxis"], {}, void 0, false, {
                                        fileName: "[project]/src/components/admin/AdminChart.tsx",
                                        lineNumber: 83,
                                        columnNumber: 126
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tooltip"], {}, void 0, false, {
                                        fileName: "[project]/src/components/admin/AdminChart.tsx",
                                        lineNumber: 83,
                                        columnNumber: 135
                                    }, this),
                                    showLegend && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Legend$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Legend"], {}, void 0, false, {
                                        fileName: "[project]/src/components/admin/AdminChart.tsx",
                                        lineNumber: 83,
                                        columnNumber: 161
                                    }, this),
                                    Array.isArray(dataKey) ? dataKey.map({
                                        "AdminChart[renderChart > dataKey.map()]": (key, index_0)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Area$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Area"], {
                                                type: "monotone",
                                                dataKey: key,
                                                stroke: colors[index_0 % colors.length],
                                                fill: colors[index_0 % colors.length],
                                                fillOpacity: 0.6
                                            }, key, false, {
                                                fileName: "[project]/src/components/admin/AdminChart.tsx",
                                                lineNumber: 84,
                                                columnNumber: 80
                                            }, this)
                                    }["AdminChart[renderChart > dataKey.map()]"]) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Area$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Area"], {
                                        type: "monotone",
                                        dataKey: dataKey,
                                        stroke: colors[0],
                                        fill: colors[0],
                                        fillOpacity: 0.6
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/admin/AdminChart.tsx",
                                        lineNumber: 85,
                                        columnNumber: 65
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/admin/AdminChart.tsx",
                                lineNumber: 83,
                                columnNumber: 22
                            }, this);
                        }
                    case "pie":
                        {
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$PieChart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PieChart"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$polar$2f$Pie$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Pie"], {
                                        data: data,
                                        dataKey: Array.isArray(dataKey) ? dataKey[0] : dataKey,
                                        nameKey: xAxisKey,
                                        cx: "50%",
                                        cy: "50%",
                                        outerRadius: 100,
                                        label: true,
                                        children: data.map({
                                            "AdminChart[renderChart > data.map()]": (entry, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Cell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Cell"], {
                                                    fill: colors[index % colors.length]
                                                }, `cell-${index}`, false, {
                                                    fileName: "[project]/src/components/admin/AdminChart.tsx",
                                                    lineNumber: 90,
                                                    columnNumber: 79
                                                }, this)
                                        }["AdminChart[renderChart > data.map()]"])
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/admin/AdminChart.tsx",
                                        lineNumber: 89,
                                        columnNumber: 32
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tooltip"], {}, void 0, false, {
                                        fileName: "[project]/src/components/admin/AdminChart.tsx",
                                        lineNumber: 91,
                                        columnNumber: 68
                                    }, this),
                                    showLegend && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Legend$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Legend"], {}, void 0, false, {
                                        fileName: "[project]/src/components/admin/AdminChart.tsx",
                                        lineNumber: 91,
                                        columnNumber: 94
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/admin/AdminChart.tsx",
                                lineNumber: 89,
                                columnNumber: 22
                            }, this);
                        }
                    default:
                        {
                            return null;
                        }
                }
            }
        })["AdminChart[renderChart]"];
        $[1] = colors;
        $[2] = data;
        $[3] = dataKey;
        $[4] = showGrid;
        $[5] = showLegend;
        $[6] = type;
        $[7] = xAxisKey;
        $[8] = t7;
    } else {
        t7 = $[8];
    }
    const renderChart = t7;
    const t8 = `bg-white rounded-lg shadow p-6 ${className}`;
    let t9;
    if ($[9] !== title) {
        t9 = title && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
            className: "text-lg font-semibold text-gray-900 mb-4",
            children: title
        }, void 0, false, {
            fileName: "[project]/src/components/admin/AdminChart.tsx",
            lineNumber: 115,
            columnNumber: 19
        }, this);
        $[9] = title;
        $[10] = t9;
    } else {
        t9 = $[10];
    }
    let t10;
    if ($[11] !== renderChart) {
        t10 = renderChart();
        $[11] = renderChart;
        $[12] = t10;
    } else {
        t10 = $[12];
    }
    let t11;
    if ($[13] !== height || $[14] !== t10) {
        t11 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ResponsiveContainer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ResponsiveContainer"], {
            width: "100%",
            height: height,
            children: t10
        }, void 0, false, {
            fileName: "[project]/src/components/admin/AdminChart.tsx",
            lineNumber: 131,
            columnNumber: 11
        }, this);
        $[13] = height;
        $[14] = t10;
        $[15] = t11;
    } else {
        t11 = $[15];
    }
    let t12;
    if ($[16] !== t11 || $[17] !== t8 || $[18] !== t9) {
        t12 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: t8,
            children: [
                t9,
                t11
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/admin/AdminChart.tsx",
            lineNumber: 140,
            columnNumber: 11
        }, this);
        $[16] = t11;
        $[17] = t8;
        $[18] = t9;
        $[19] = t12;
    } else {
        t12 = $[19];
    }
    return t12;
}
_c = AdminChart;
var _c;
__turbopack_context__.k.register(_c, "AdminChart");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/admin/AdminStatusIndicator.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * AdminStatusIndicator Component
 *
 * Visual indicator for system and service status.
 *
 * @module components/admin/AdminStatusIndicator
 * @since 2025-10-26
 */ __turbopack_context__.s([
    "AdminStatusIndicator",
    ()=>AdminStatusIndicator
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check-big.js [app-client] (ecmascript) <export default as CheckCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-client] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-x.js [app-client] (ecmascript) <export default as XCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clock.js [app-client] (ecmascript) <export default as Clock>");
'use client';
;
;
;
const statusConfig = {
    operational: {
        color: 'green',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        borderColor: 'border-green-200',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"],
        label: 'Operational'
    },
    degraded: {
        color: 'yellow',
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-800',
        borderColor: 'border-yellow-200',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"],
        label: 'Degraded'
    },
    down: {
        color: 'red',
        bgColor: 'bg-red-100',
        textColor: 'text-red-800',
        borderColor: 'border-red-200',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__["XCircle"],
        label: 'Down'
    },
    pending: {
        color: 'gray',
        bgColor: 'bg-gray-100',
        textColor: 'text-gray-800',
        borderColor: 'border-gray-200',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"],
        label: 'Pending'
    }
};
const sizeClasses = {
    sm: {
        text: 'text-xs',
        padding: 'px-2 py-1',
        icon: 'h-3 w-3',
        dot: 'h-2 w-2'
    },
    md: {
        text: 'text-sm',
        padding: 'px-3 py-1.5',
        icon: 'h-4 w-4',
        dot: 'h-2.5 w-2.5'
    },
    lg: {
        text: 'text-base',
        padding: 'px-4 py-2',
        icon: 'h-5 w-5',
        dot: 'h-3 w-3'
    }
};
function AdminStatusIndicator(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(12);
    if ($[0] !== "1ef25d13be4b9cd3d0163031c064d823151602202655c761c1bfa8f5a9de8ec3") {
        for(let $i = 0; $i < 12; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "1ef25d13be4b9cd3d0163031c064d823151602202655c761c1bfa8f5a9de8ec3";
    }
    const { status, label, showIcon: t1, size: t2, className: t3 } = t0;
    const showIcon = t1 === undefined ? true : t1;
    const size = t2 === undefined ? "md" : t2;
    const className = t3 === undefined ? "" : t3;
    const config = statusConfig[status];
    const sizes = sizeClasses[size];
    const Icon = config.icon;
    const t4 = `inline-flex items-center gap-1.5 ${sizes.padding} ${config.bgColor} ${config.textColor} ${config.borderColor} border rounded-full font-medium ${sizes.text} ${className}`;
    let t5;
    if ($[1] !== Icon || $[2] !== showIcon || $[3] !== sizes.dot || $[4] !== sizes.icon) {
        t5 = showIcon ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
            className: sizes.icon
        }, void 0, false, {
            fileName: "[project]/src/components/admin/AdminStatusIndicator.tsx",
            lineNumber: 99,
            columnNumber: 21
        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: `${sizes.dot} rounded-full bg-current`
        }, void 0, false, {
            fileName: "[project]/src/components/admin/AdminStatusIndicator.tsx",
            lineNumber: 99,
            columnNumber: 55
        }, this);
        $[1] = Icon;
        $[2] = showIcon;
        $[3] = sizes.dot;
        $[4] = sizes.icon;
        $[5] = t5;
    } else {
        t5 = $[5];
    }
    const t6 = label || config.label;
    let t7;
    if ($[6] !== t6) {
        t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            children: t6
        }, void 0, false, {
            fileName: "[project]/src/components/admin/AdminStatusIndicator.tsx",
            lineNumber: 111,
            columnNumber: 10
        }, this);
        $[6] = t6;
        $[7] = t7;
    } else {
        t7 = $[7];
    }
    let t8;
    if ($[8] !== t4 || $[9] !== t5 || $[10] !== t7) {
        t8 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: t4,
            children: [
                t5,
                t7
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/admin/AdminStatusIndicator.tsx",
            lineNumber: 119,
            columnNumber: 10
        }, this);
        $[8] = t4;
        $[9] = t5;
        $[10] = t7;
        $[11] = t8;
    } else {
        t8 = $[11];
    }
    return t8;
}
_c = AdminStatusIndicator;
var _c;
__turbopack_context__.k.register(_c, "AdminStatusIndicator");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/admin/AdminBulkActionBar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AdminBulkActionBar",
    ()=>AdminBulkActionBar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
'use client';
/**
 * AdminBulkActionBar Component
 *
 * Toolbar for performing bulk actions on selected items.
 *
 * @module components/admin/AdminBulkActionBar
 * @since 2025-10-26
 */ 'use client';
;
;
;
function AdminBulkActionBar(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(20);
    if ($[0] !== "d922d3f1a2248deff21c60b7709b2eb41866f3daa21afa76b1a12cdc097db3e9") {
        for(let $i = 0; $i < 20; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "d922d3f1a2248deff21c60b7709b2eb41866f3daa21afa76b1a12cdc097db3e9";
    }
    const { selectedCount, totalCount, actions, onClearSelection, className: t1 } = t0;
    const className = t1 === undefined ? "" : t1;
    if (selectedCount === 0) {
        return null;
    }
    const t2 = `fixed bottom-0 left-0 right-0 bg-blue-600 text-white shadow-lg border-t border-blue-700 z-50 ${className}`;
    let t3;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
            className: "h-5 w-5"
        }, void 0, false, {
            fileName: "[project]/src/components/admin/AdminBulkActionBar.tsx",
            lineNumber: 54,
            columnNumber: 10
        }, this);
        $[1] = t3;
    } else {
        t3 = $[1];
    }
    let t4;
    if ($[2] !== onClearSelection) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            onClick: onClearSelection,
            className: "p-2 hover:bg-blue-700 rounded-lg transition-colors",
            "aria-label": "Clear selection",
            children: t3
        }, void 0, false, {
            fileName: "[project]/src/components/admin/AdminBulkActionBar.tsx",
            lineNumber: 61,
            columnNumber: 10
        }, this);
        $[2] = onClearSelection;
        $[3] = t4;
    } else {
        t4 = $[3];
    }
    let t5;
    if ($[4] !== selectedCount || $[5] !== totalCount) {
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-sm font-medium",
                children: [
                    selectedCount,
                    " of ",
                    totalCount,
                    " selected"
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/admin/AdminBulkActionBar.tsx",
                lineNumber: 69,
                columnNumber: 15
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/admin/AdminBulkActionBar.tsx",
            lineNumber: 69,
            columnNumber: 10
        }, this);
        $[4] = selectedCount;
        $[5] = totalCount;
        $[6] = t5;
    } else {
        t5 = $[6];
    }
    let t6;
    if ($[7] !== t4 || $[8] !== t5) {
        t6 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center gap-4",
            children: [
                t4,
                t5
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/admin/AdminBulkActionBar.tsx",
            lineNumber: 78,
            columnNumber: 10
        }, this);
        $[7] = t4;
        $[8] = t5;
        $[9] = t6;
    } else {
        t6 = $[9];
    }
    let t7;
    if ($[10] !== actions) {
        t7 = actions.map(_AdminBulkActionBarActionsMap);
        $[10] = actions;
        $[11] = t7;
    } else {
        t7 = $[11];
    }
    let t8;
    if ($[12] !== t7) {
        t8 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center gap-2",
            children: t7
        }, void 0, false, {
            fileName: "[project]/src/components/admin/AdminBulkActionBar.tsx",
            lineNumber: 95,
            columnNumber: 10
        }, this);
        $[12] = t7;
        $[13] = t8;
    } else {
        t8 = $[13];
    }
    let t9;
    if ($[14] !== t6 || $[15] !== t8) {
        t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between",
                children: [
                    t6,
                    t8
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/admin/AdminBulkActionBar.tsx",
                lineNumber: 103,
                columnNumber: 71
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/admin/AdminBulkActionBar.tsx",
            lineNumber: 103,
            columnNumber: 10
        }, this);
        $[14] = t6;
        $[15] = t8;
        $[16] = t9;
    } else {
        t9 = $[16];
    }
    let t10;
    if ($[17] !== t2 || $[18] !== t9) {
        t10 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: t2,
            children: t9
        }, void 0, false, {
            fileName: "[project]/src/components/admin/AdminBulkActionBar.tsx",
            lineNumber: 112,
            columnNumber: 11
        }, this);
        $[17] = t2;
        $[18] = t9;
        $[19] = t10;
    } else {
        t10 = $[19];
    }
    return t10;
}
_c = AdminBulkActionBar;
function _AdminBulkActionBarActionsMap(action) {
    const Icon = action.icon;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        onClick: action.onClick,
        className: `flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${action.variant === "danger" ? "bg-red-600 hover:bg-red-700 text-white" : "bg-white hover:bg-gray-100 text-gray-900"}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                className: "h-5 w-5"
            }, void 0, false, {
                fileName: "[project]/src/components/admin/AdminBulkActionBar.tsx",
                lineNumber: 123,
                columnNumber: 267
            }, this),
            action.label
        ]
    }, action.id, true, {
        fileName: "[project]/src/components/admin/AdminBulkActionBar.tsx",
        lineNumber: 123,
        columnNumber: 10
    }, this);
}
var _c;
__turbopack_context__.k.register(_c, "AdminBulkActionBar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/admin/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

/**
 * Admin Components Index
 *
 * Central export for all admin-specific components.
 *
 * @module components/admin
 * @since 2025-10-26
 */ __turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$AdminDataTable$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/admin/AdminDataTable.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$AdminMetricCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/admin/AdminMetricCard.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$AdminChart$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/admin/AdminChart.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$AdminStatusIndicator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/admin/AdminStatusIndicator.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$AdminBulkActionBar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/admin/AdminBulkActionBar.tsx [app-client] (ecmascript)");
;
;
;
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/(dashboard)/admin/monitoring/health/_components/SystemHealthDisplay.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SystemHealthDisplay",
    ()=>SystemHealthDisplay
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/admin/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$AdminMetricCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/admin/AdminMetricCard.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$AdminStatusIndicator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/admin/AdminStatusIndicator.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cpu$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Cpu$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/cpu.js [app-client] (ecmascript) <export default as Cpu>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$hard$2d$drive$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__HardDrive$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/hard-drive.js [app-client] (ecmascript) <export default as HardDrive>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$network$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Network$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/network.js [app-client] (ecmascript) <export default as Network>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$server$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Server$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/server.js [app-client] (ecmascript) <export default as Server>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-alert.js [app-client] (ecmascript) <export default as AlertCircle>");
'use client';
;
;
;
;
/**
 * Formats byte values into human-readable gigabyte representation.
 */ function formatBytes(bytes) {
    const gb = bytes / 1073741824;
    return `${gb.toFixed(1)} GB`;
}
/**
 * Formats uptime seconds into human-readable days and hours format.
 */ function formatUptime(seconds) {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor(seconds % 86400 / 3600);
    return `${days}d ${hours}h`;
}
function SystemHealthDisplay(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(72);
    if ($[0] !== "e9483629392073e8bfb81638ee93738e5e172c239d54ba3d004aff1a3649da83") {
        for(let $i = 0; $i < 72; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "e9483629392073e8bfb81638ee93738e5e172c239d54ba3d004aff1a3649da83";
    }
    const { health } = t0;
    let t1;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
            className: "text-xl font-semibold text-gray-900",
            children: "Overall System Status"
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/admin/monitoring/health/_components/SystemHealthDisplay.tsx",
            lineNumber: 41,
            columnNumber: 10
        }, this);
        $[1] = t1;
    } else {
        t1 = $[1];
    }
    const t2 = health.status === "healthy" ? "operational" : health.status === "degraded" ? "degraded" : "down";
    let t3;
    if ($[2] !== t2) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-between mb-6",
            children: [
                t1,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$AdminStatusIndicator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AdminStatusIndicator"], {
                    status: t2,
                    size: "lg"
                }, void 0, false, {
                    fileName: "[project]/src/app/(dashboard)/admin/monitoring/health/_components/SystemHealthDisplay.tsx",
                    lineNumber: 49,
                    columnNumber: 70
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/admin/monitoring/health/_components/SystemHealthDisplay.tsx",
            lineNumber: 49,
            columnNumber: 10
        }, this);
        $[2] = t2;
        $[3] = t3;
    } else {
        t3 = $[3];
    }
    let t4;
    if ($[4] === Symbol.for("react.memo_cache_sentinel")) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "text-sm text-gray-600 mb-1",
            children: "Uptime"
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/admin/monitoring/health/_components/SystemHealthDisplay.tsx",
            lineNumber: 57,
            columnNumber: 10
        }, this);
        $[4] = t4;
    } else {
        t4 = $[4];
    }
    let t5;
    if ($[5] !== health.overall.uptime) {
        t5 = formatUptime(health.overall.uptime);
        $[5] = health.overall.uptime;
        $[6] = t5;
    } else {
        t5 = $[6];
    }
    let t6;
    if ($[7] !== t5) {
        t6 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "p-4 bg-gray-50 rounded-lg",
            children: [
                t4,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-2xl font-bold text-gray-900",
                    children: t5
                }, void 0, false, {
                    fileName: "[project]/src/app/(dashboard)/admin/monitoring/health/_components/SystemHealthDisplay.tsx",
                    lineNumber: 72,
                    columnNumber: 57
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/admin/monitoring/health/_components/SystemHealthDisplay.tsx",
            lineNumber: 72,
            columnNumber: 10
        }, this);
        $[7] = t5;
        $[8] = t6;
    } else {
        t6 = $[8];
    }
    let t7;
    if ($[9] === Symbol.for("react.memo_cache_sentinel")) {
        t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "text-sm text-gray-600 mb-1",
            children: "Last Restart"
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/admin/monitoring/health/_components/SystemHealthDisplay.tsx",
            lineNumber: 80,
            columnNumber: 10
        }, this);
        $[9] = t7;
    } else {
        t7 = $[9];
    }
    let t8;
    if ($[10] !== health.overall.lastRestart) {
        t8 = new Date(health.overall.lastRestart).toLocaleDateString();
        $[10] = health.overall.lastRestart;
        $[11] = t8;
    } else {
        t8 = $[11];
    }
    let t9;
    if ($[12] !== t8) {
        t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "p-4 bg-gray-50 rounded-lg",
            children: [
                t7,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-2xl font-bold text-gray-900",
                    children: t8
                }, void 0, false, {
                    fileName: "[project]/src/app/(dashboard)/admin/monitoring/health/_components/SystemHealthDisplay.tsx",
                    lineNumber: 95,
                    columnNumber: 57
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/admin/monitoring/health/_components/SystemHealthDisplay.tsx",
            lineNumber: 95,
            columnNumber: 10
        }, this);
        $[12] = t8;
        $[13] = t9;
    } else {
        t9 = $[13];
    }
    let t10;
    if ($[14] === Symbol.for("react.memo_cache_sentinel")) {
        t10 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "text-sm text-gray-600 mb-1",
            children: "Version"
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/admin/monitoring/health/_components/SystemHealthDisplay.tsx",
            lineNumber: 103,
            columnNumber: 11
        }, this);
        $[14] = t10;
    } else {
        t10 = $[14];
    }
    let t11;
    if ($[15] !== health.overall.version) {
        t11 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "p-4 bg-gray-50 rounded-lg",
            children: [
                t10,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-2xl font-bold text-gray-900",
                    children: health.overall.version
                }, void 0, false, {
                    fileName: "[project]/src/app/(dashboard)/admin/monitoring/health/_components/SystemHealthDisplay.tsx",
                    lineNumber: 110,
                    columnNumber: 59
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/admin/monitoring/health/_components/SystemHealthDisplay.tsx",
            lineNumber: 110,
            columnNumber: 11
        }, this);
        $[15] = health.overall.version;
        $[16] = t11;
    } else {
        t11 = $[16];
    }
    let t12;
    if ($[17] !== t11 || $[18] !== t6 || $[19] !== t9) {
        t12 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "grid grid-cols-1 md:grid-cols-3 gap-4",
            children: [
                t6,
                t9,
                t11
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/admin/monitoring/health/_components/SystemHealthDisplay.tsx",
            lineNumber: 118,
            columnNumber: 11
        }, this);
        $[17] = t11;
        $[18] = t6;
        $[19] = t9;
        $[20] = t12;
    } else {
        t12 = $[20];
    }
    let t13;
    if ($[21] !== t12 || $[22] !== t3) {
        t13 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-white rounded-lg shadow p-6",
            children: [
                t3,
                t12
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/admin/monitoring/health/_components/SystemHealthDisplay.tsx",
            lineNumber: 128,
            columnNumber: 11
        }, this);
        $[21] = t12;
        $[22] = t3;
        $[23] = t13;
    } else {
        t13 = $[23];
    }
    let t14;
    if ($[24] !== health.metrics.cpu.usage) {
        t14 = health.metrics.cpu.usage.toFixed(1);
        $[24] = health.metrics.cpu.usage;
        $[25] = t14;
    } else {
        t14 = $[25];
    }
    const t15 = `${t14}%`;
    const t16 = `${health.metrics.cpu.cores} cores`;
    const t17 = health.metrics.cpu.usage > 80 ? "red" : "blue";
    let t18;
    if ($[26] !== t15 || $[27] !== t16 || $[28] !== t17) {
        t18 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$AdminMetricCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AdminMetricCard"], {
            title: "CPU Usage",
            value: t15,
            subtitle: t16,
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cpu$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Cpu$3e$__["Cpu"],
            color: t17
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/admin/monitoring/health/_components/SystemHealthDisplay.tsx",
            lineNumber: 148,
            columnNumber: 11
        }, this);
        $[26] = t15;
        $[27] = t16;
        $[28] = t17;
        $[29] = t18;
    } else {
        t18 = $[29];
    }
    let t19;
    if ($[30] !== health.metrics.memory.used) {
        t19 = formatBytes(health.metrics.memory.used);
        $[30] = health.metrics.memory.used;
        $[31] = t19;
    } else {
        t19 = $[31];
    }
    let t20;
    if ($[32] !== health.metrics.memory.total) {
        t20 = formatBytes(health.metrics.memory.total);
        $[32] = health.metrics.memory.total;
        $[33] = t20;
    } else {
        t20 = $[33];
    }
    const t21 = `of ${t20}`;
    const t22 = health.metrics.memory.percentage > 80 ? "red" : "green";
    let t23;
    if ($[34] !== health.metrics.memory.percentage) {
        t23 = health.metrics.memory.percentage.toFixed(1);
        $[34] = health.metrics.memory.percentage;
        $[35] = t23;
    } else {
        t23 = $[35];
    }
    const t24 = `${t23}%`;
    let t25;
    if ($[36] !== t24) {
        t25 = {
            value: t24,
            direction: "up",
            positive: false
        };
        $[36] = t24;
        $[37] = t25;
    } else {
        t25 = $[37];
    }
    let t26;
    if ($[38] !== t19 || $[39] !== t21 || $[40] !== t22 || $[41] !== t25) {
        t26 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$AdminMetricCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AdminMetricCard"], {
            title: "Memory",
            value: t19,
            subtitle: t21,
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$server$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Server$3e$__["Server"],
            color: t22,
            trend: t25
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/admin/monitoring/health/_components/SystemHealthDisplay.tsx",
            lineNumber: 197,
            columnNumber: 11
        }, this);
        $[38] = t19;
        $[39] = t21;
        $[40] = t22;
        $[41] = t25;
        $[42] = t26;
    } else {
        t26 = $[42];
    }
    let t27;
    if ($[43] !== health.metrics.disk.used) {
        t27 = formatBytes(health.metrics.disk.used);
        $[43] = health.metrics.disk.used;
        $[44] = t27;
    } else {
        t27 = $[44];
    }
    let t28;
    if ($[45] !== health.metrics.disk.total) {
        t28 = formatBytes(health.metrics.disk.total);
        $[45] = health.metrics.disk.total;
        $[46] = t28;
    } else {
        t28 = $[46];
    }
    const t29 = `of ${t28}`;
    const t30 = health.metrics.disk.percentage > 80 ? "orange" : "purple";
    let t31;
    if ($[47] !== t27 || $[48] !== t29 || $[49] !== t30) {
        t31 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$AdminMetricCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AdminMetricCard"], {
            title: "Disk Space",
            value: t27,
            subtitle: t29,
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$hard$2d$drive$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__HardDrive$3e$__["HardDrive"],
            color: t30
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/admin/monitoring/health/_components/SystemHealthDisplay.tsx",
            lineNumber: 226,
            columnNumber: 11
        }, this);
        $[47] = t27;
        $[48] = t29;
        $[49] = t30;
        $[50] = t31;
    } else {
        t31 = $[50];
    }
    const t32 = health.metrics.network.incoming / 1048576;
    let t33;
    if ($[51] !== t32) {
        t33 = t32.toFixed(1);
        $[51] = t32;
        $[52] = t33;
    } else {
        t33 = $[52];
    }
    const t34 = `${t33} MB/s`;
    let t35;
    if ($[53] !== t34) {
        t35 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$AdminMetricCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AdminMetricCard"], {
            title: "Network",
            value: t34,
            subtitle: "Incoming",
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$network$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Network$3e$__["Network"],
            color: "blue"
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/admin/monitoring/health/_components/SystemHealthDisplay.tsx",
            lineNumber: 246,
            columnNumber: 11
        }, this);
        $[53] = t34;
        $[54] = t35;
    } else {
        t35 = $[54];
    }
    let t36;
    if ($[55] !== t18 || $[56] !== t26 || $[57] !== t31 || $[58] !== t35) {
        t36 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6",
            children: [
                t18,
                t26,
                t31,
                t35
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/admin/monitoring/health/_components/SystemHealthDisplay.tsx",
            lineNumber: 254,
            columnNumber: 11
        }, this);
        $[55] = t18;
        $[56] = t26;
        $[57] = t31;
        $[58] = t35;
        $[59] = t36;
    } else {
        t36 = $[59];
    }
    let t37;
    if ($[60] === Symbol.for("react.memo_cache_sentinel")) {
        t37 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
            className: "text-xl font-semibold text-gray-900 mb-6",
            children: "Service Health"
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/admin/monitoring/health/_components/SystemHealthDisplay.tsx",
            lineNumber: 265,
            columnNumber: 11
        }, this);
        $[60] = t37;
    } else {
        t37 = $[60];
    }
    let t38;
    if ($[61] !== health.services) {
        t38 = health.services.map(_SystemHealthDisplayHealthServicesMap);
        $[61] = health.services;
        $[62] = t38;
    } else {
        t38 = $[62];
    }
    let t39;
    if ($[63] !== t38) {
        t39 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-white rounded-lg shadow p-6",
            children: [
                t37,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-4",
                    children: t38
                }, void 0, false, {
                    fileName: "[project]/src/app/(dashboard)/admin/monitoring/health/_components/SystemHealthDisplay.tsx",
                    lineNumber: 280,
                    columnNumber: 64
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/admin/monitoring/health/_components/SystemHealthDisplay.tsx",
            lineNumber: 280,
            columnNumber: 11
        }, this);
        $[63] = t38;
        $[64] = t39;
    } else {
        t39 = $[64];
    }
    let t40;
    if ($[65] !== health.alerts) {
        t40 = health.alerts.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-white rounded-lg shadow p-6",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    className: "text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                            className: "h-6 w-6 text-orange-600"
                        }, void 0, false, {
                            fileName: "[project]/src/app/(dashboard)/admin/monitoring/health/_components/SystemHealthDisplay.tsx",
                            lineNumber: 288,
                            columnNumber: 168
                        }, this),
                        "Active Alerts (",
                        health.alerts.length,
                        ")"
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(dashboard)/admin/monitoring/health/_components/SystemHealthDisplay.tsx",
                    lineNumber: 288,
                    columnNumber: 87
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-3",
                    children: health.alerts.map(_SystemHealthDisplayHealthAlertsMap)
                }, void 0, false, {
                    fileName: "[project]/src/app/(dashboard)/admin/monitoring/health/_components/SystemHealthDisplay.tsx",
                    lineNumber: 288,
                    columnNumber: 262
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/admin/monitoring/health/_components/SystemHealthDisplay.tsx",
            lineNumber: 288,
            columnNumber: 39
        }, this);
        $[65] = health.alerts;
        $[66] = t40;
    } else {
        t40 = $[66];
    }
    let t41;
    if ($[67] !== t13 || $[68] !== t36 || $[69] !== t39 || $[70] !== t40) {
        t41 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-6",
            children: [
                t13,
                t36,
                t39,
                t40
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/admin/monitoring/health/_components/SystemHealthDisplay.tsx",
            lineNumber: 296,
            columnNumber: 11
        }, this);
        $[67] = t13;
        $[68] = t36;
        $[69] = t39;
        $[70] = t40;
        $[71] = t41;
    } else {
        t41 = $[71];
    }
    return t41;
}
_c = SystemHealthDisplay;
function _SystemHealthDisplayHealthAlertsMap(alert) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `p-4 rounded-lg border-l-4 ${alert.severity === "critical" ? "bg-red-50 border-red-500" : alert.severity === "error" ? "bg-orange-50 border-orange-500" : alert.severity === "warning" ? "bg-yellow-50 border-yellow-500" : "bg-blue-50 border-blue-500"}`,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-start justify-between",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex-1",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-2 mb-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "font-medium text-gray-900",
                                    children: alert.service
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(dashboard)/admin/monitoring/health/_components/SystemHealthDisplay.tsx",
                                    lineNumber: 308,
                                    columnNumber: 413
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: `text-xs px-2 py-0.5 rounded-full ${alert.severity === "critical" ? "bg-red-200 text-red-800" : alert.severity === "error" ? "bg-orange-200 text-orange-800" : alert.severity === "warning" ? "bg-yellow-200 text-yellow-800" : "bg-blue-200 text-blue-800"}`,
                                    children: alert.severity
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(dashboard)/admin/monitoring/health/_components/SystemHealthDisplay.tsx",
                                    lineNumber: 308,
                                    columnNumber: 479
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(dashboard)/admin/monitoring/health/_components/SystemHealthDisplay.tsx",
                            lineNumber: 308,
                            columnNumber: 367
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm text-gray-700",
                            children: alert.message
                        }, void 0, false, {
                            fileName: "[project]/src/app/(dashboard)/admin/monitoring/health/_components/SystemHealthDisplay.tsx",
                            lineNumber: 308,
                            columnNumber: 780
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-xs text-gray-500 mt-1",
                            children: new Date(alert.timestamp).toLocaleString()
                        }, void 0, false, {
                            fileName: "[project]/src/app/(dashboard)/admin/monitoring/health/_components/SystemHealthDisplay.tsx",
                            lineNumber: 308,
                            columnNumber: 836
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(dashboard)/admin/monitoring/health/_components/SystemHealthDisplay.tsx",
                    lineNumber: 308,
                    columnNumber: 343
                }, this),
                !alert.acknowledged && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    className: "ml-4 px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50",
                    children: "Acknowledge"
                }, void 0, false, {
                    fileName: "[project]/src/app/(dashboard)/admin/monitoring/health/_components/SystemHealthDisplay.tsx",
                    lineNumber: 308,
                    columnNumber: 956
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/admin/monitoring/health/_components/SystemHealthDisplay.tsx",
            lineNumber: 308,
            columnNumber: 293
        }, this)
    }, alert.id, false, {
        fileName: "[project]/src/app/(dashboard)/admin/monitoring/health/_components/SystemHealthDisplay.tsx",
        lineNumber: 308,
        columnNumber: 10
    }, this);
}
function _SystemHealthDisplayHealthServicesMap(service) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center justify-between p-4 border border-gray-200 rounded-lg",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex-1",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-3 mb-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "text-lg font-medium text-gray-900",
                            children: service.name
                        }, void 0, false, {
                            fileName: "[project]/src/app/(dashboard)/admin/monitoring/health/_components/SystemHealthDisplay.tsx",
                            lineNumber: 311,
                            columnNumber: 188
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$AdminStatusIndicator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AdminStatusIndicator"], {
                            status: service.status,
                            size: "sm"
                        }, void 0, false, {
                            fileName: "[project]/src/app/(dashboard)/admin/monitoring/health/_components/SystemHealthDisplay.tsx",
                            lineNumber: 311,
                            columnNumber: 257
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(dashboard)/admin/monitoring/health/_components/SystemHealthDisplay.tsx",
                    lineNumber: 311,
                    columnNumber: 142
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-3 gap-4 text-sm",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-gray-600",
                                    children: "Response Time:"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(dashboard)/admin/monitoring/health/_components/SystemHealthDisplay.tsx",
                                    lineNumber: 311,
                                    columnNumber: 374
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "ml-2 font-medium text-gray-900",
                                    children: [
                                        service.responseTime,
                                        "ms"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/(dashboard)/admin/monitoring/health/_components/SystemHealthDisplay.tsx",
                                    lineNumber: 311,
                                    columnNumber: 427
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(dashboard)/admin/monitoring/health/_components/SystemHealthDisplay.tsx",
                            lineNumber: 311,
                            columnNumber: 369
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-gray-600",
                                    children: "Uptime:"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(dashboard)/admin/monitoring/health/_components/SystemHealthDisplay.tsx",
                                    lineNumber: 311,
                                    columnNumber: 518
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "ml-2 font-medium text-gray-900",
                                    children: [
                                        service.uptime,
                                        "%"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/(dashboard)/admin/monitoring/health/_components/SystemHealthDisplay.tsx",
                                    lineNumber: 311,
                                    columnNumber: 564
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(dashboard)/admin/monitoring/health/_components/SystemHealthDisplay.tsx",
                            lineNumber: 311,
                            columnNumber: 513
                        }, this),
                        service.errorRate && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-gray-600",
                                    children: "Error Rate:"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(dashboard)/admin/monitoring/health/_components/SystemHealthDisplay.tsx",
                                    lineNumber: 311,
                                    columnNumber: 670
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "ml-2 font-medium text-red-600",
                                    children: [
                                        service.errorRate,
                                        "%"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/(dashboard)/admin/monitoring/health/_components/SystemHealthDisplay.tsx",
                                    lineNumber: 311,
                                    columnNumber: 720
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(dashboard)/admin/monitoring/health/_components/SystemHealthDisplay.tsx",
                            lineNumber: 311,
                            columnNumber: 665
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(dashboard)/admin/monitoring/health/_components/SystemHealthDisplay.tsx",
                    lineNumber: 311,
                    columnNumber: 321
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/admin/monitoring/health/_components/SystemHealthDisplay.tsx",
            lineNumber: 311,
            columnNumber: 118
        }, this)
    }, service.name, false, {
        fileName: "[project]/src/app/(dashboard)/admin/monitoring/health/_components/SystemHealthDisplay.tsx",
        lineNumber: 311,
        columnNumber: 10
    }, this);
}
var _c;
__turbopack_context__.k.register(_c, "SystemHealthDisplay");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_5291487c._.js.map