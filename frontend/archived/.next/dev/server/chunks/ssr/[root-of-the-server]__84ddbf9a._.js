module.exports = [
"[externals]/next/dist/server/lib/incremental-cache/tags-manifest.external.js [external] (next/dist/server/lib/incremental-cache/tags-manifest.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/lib/incremental-cache/tags-manifest.external.js", () => require("next/dist/server/lib/incremental-cache/tags-manifest.external.js"));

module.exports = mod;
}),
"[project]/src/lib/actions/health-records.stats.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @fileoverview Health Records Statistics and Dashboard Data
 * @module lib/actions/health-records.stats
 *
 * Server actions for retrieving health records statistics and dashboard metrics.
 * Enhanced with Next.js v16 'use cache' directive and cacheLife for optimal performance.
 * Provides aggregate data for dashboards and reporting interfaces.
 */ /* __next_internal_action_entry_do_not_use__ [{"8093e75c30f2ec267cdbb30999a628902b6e99bd5d":"$$RSC_SERVER_CACHE_1","80ee23f9a7343368400e766d1fb542985484d3741a":"$$RSC_SERVER_CACHE_0"},"",""] */ __turbopack_context__.s([
    "$$RSC_SERVER_CACHE_0",
    ()=>$$RSC_SERVER_CACHE_0,
    "$$RSC_SERVER_CACHE_1",
    ()=>$$RSC_SERVER_CACHE_1,
    "getHealthRecordsDashboardData",
    ()=>getHealthRecordsDashboardData,
    "getHealthRecordsStats",
    ()=>getHealthRecordsStats
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$cache$2d$wrapper$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/cache-wrapper.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/cache.js [app-rsc] (ecmascript)");
;
;
;
var $$RSC_SERVER_CACHE_0 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$cache$2d$wrapper$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cache"])("default", "80ee23f9a7343368400e766d1fb542985484d3741a", 0, async function getHealthRecordsStats() {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cacheLife"])('medium');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cacheTag"])('health-records-stats');
    try {
        console.log('[Health Records] Loading health records statistics');
        // In production, this would aggregate data from database
        const stats = {
            totalRecords: 2847,
            activeConditions: 156,
            criticalAllergies: 28,
            pendingImmunizations: 42,
            recentUpdates: 89,
            compliance: 94.2,
            urgentFollowUps: 12,
            recordTypes: {
                immunizations: 1250,
                allergies: 287,
                conditions: 456,
                vitalSigns: 534,
                medications: 320
            }
        };
        console.log('[Health Records] Health records statistics loaded successfully');
        return stats;
    } catch (error) {
        console.error('[Health Records] Failed to load health records statistics:', error);
        // Return safe defaults on error
        return {
            totalRecords: 0,
            activeConditions: 0,
            criticalAllergies: 0,
            pendingImmunizations: 0,
            recentUpdates: 0,
            compliance: 0,
            urgentFollowUps: 0,
            recordTypes: {
                immunizations: 0,
                allergies: 0,
                conditions: 0,
                vitalSigns: 0,
                medications: 0
            }
        };
    }
});
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])($$RSC_SERVER_CACHE_0, "80ee23f9a7343368400e766d1fb542985484d3741a", null);
Object["defineProperty"]($$RSC_SERVER_CACHE_0, "name", {
    value: "getHealthRecordsStats",
    writable: false
});
var getHealthRecordsStats = $$RSC_SERVER_CACHE_0;
var $$RSC_SERVER_CACHE_1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$cache$2d$wrapper$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cache"])("default", "8093e75c30f2ec267cdbb30999a628902b6e99bd5d", 0, async function getHealthRecordsDashboardData() {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cacheLife"])('medium');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cacheTag"])('health-records-dashboard');
    try {
        console.log('[Health Records] Loading dashboard data');
        const stats = await getHealthRecordsStats();
        console.log('[Health Records] Dashboard data loaded successfully');
        return {
            stats
        };
    } catch (error) {
        console.error('[Health Records] Failed to load dashboard data:', error);
        return {
            stats: await getHealthRecordsStats() // Will return safe defaults
        };
    }
});
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])($$RSC_SERVER_CACHE_1, "8093e75c30f2ec267cdbb30999a628902b6e99bd5d", null);
Object["defineProperty"]($$RSC_SERVER_CACHE_1, "name", {
    value: "getHealthRecordsDashboardData",
    writable: false
});
var getHealthRecordsDashboardData = $$RSC_SERVER_CACHE_1;
}),
"[project]/.next-internal/server/app/(dashboard)/health-records/[id]/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/lib/actions/health-records.stats.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$health$2d$records$2e$stats$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/actions/health-records.stats.ts [app-rsc] (ecmascript)");
;
}),
"[project]/.next-internal/server/app/(dashboard)/health-records/[id]/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/lib/actions/health-records.stats.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "804e89d6aec3dc95bec36ee8e5764906cfd6539ed7",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$health$2d$records$2e$stats$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getHealthRecordsStats"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f28$dashboard$292f$health$2d$records$2f5b$id$5d2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$actions$2f$health$2d$records$2e$stats$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/(dashboard)/health-records/[id]/page/actions.js { ACTIONS_MODULE0 => "[project]/src/lib/actions/health-records.stats.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$health$2d$records$2e$stats$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/actions/health-records.stats.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__84ddbf9a._.js.map