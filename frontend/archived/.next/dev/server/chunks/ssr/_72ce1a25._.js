module.exports = [
"[project]/src/lib/actions/health-records.stats.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @fileoverview Health Records Statistics and Dashboard Data
 * @module lib/actions/health-records.stats
 *
 * Server actions for retrieving health records statistics and dashboard metrics.
 * Enhanced with Next.js v16 'use cache' directive and cacheLife for optimal performance.
 * Provides aggregate data for dashboards and reporting interfaces.
 */ /* __next_internal_action_entry_do_not_use__ [{"004e89d6aec3dc95bec36ee8e5764906cfd6539ed7":"getHealthRecordsStats","00b4b9e56569e7f810f3bb4ac72dc59b66119068d4":"getHealthRecordsDashboardData"},"",""] */ __turbopack_context__.s([
    "getHealthRecordsDashboardData",
    ()=>getHealthRecordsDashboardData,
    "getHealthRecordsStats",
    ()=>getHealthRecordsStats
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
async function getHealthRecordsStats() {
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
}
async function getHealthRecordsDashboardData() {
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
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getHealthRecordsStats,
    getHealthRecordsDashboardData
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getHealthRecordsStats, "004e89d6aec3dc95bec36ee8e5764906cfd6539ed7", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getHealthRecordsDashboardData, "00b4b9e56569e7f810f3bb4ac72dc59b66119068d4", null);
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
    "004e89d6aec3dc95bec36ee8e5764906cfd6539ed7",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$health$2d$records$2e$stats$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getHealthRecordsStats"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f28$dashboard$292f$health$2d$records$2f5b$id$5d2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$actions$2f$health$2d$records$2e$stats$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/(dashboard)/health-records/[id]/page/actions.js { ACTIONS_MODULE0 => "[project]/src/lib/actions/health-records.stats.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$health$2d$records$2e$stats$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/actions/health-records.stats.ts [app-rsc] (ecmascript)");
}),
"[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/* eslint-disable import/no-extraneous-dependencies */ Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "registerServerReference", {
    enumerable: true,
    get: function() {
        return _server.registerServerReference;
    }
});
const _server = __turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)"); //# sourceMappingURL=server-reference.js.map
}),
"[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// This function ensures that all the exported values are valid server actions,
// during the runtime. By definition all actions are required to be async
// functions, but here we can only check that they are functions.
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ensureServerEntryExports", {
    enumerable: true,
    get: function() {
        return ensureServerEntryExports;
    }
});
function ensureServerEntryExports(actions) {
    for(let i = 0; i < actions.length; i++){
        const action = actions[i];
        if (typeof action !== 'function') {
            throw Object.defineProperty(new Error(`A "use server" file can only export async functions, found ${typeof action}.\nRead more: https://nextjs.org/docs/messages/invalid-use-server-value`), "__NEXT_ERROR_CODE", {
                value: "E352",
                enumerable: false,
                configurable: true
            });
        }
    }
} //# sourceMappingURL=action-validate.js.map
}),
];

//# sourceMappingURL=_72ce1a25._.js.map