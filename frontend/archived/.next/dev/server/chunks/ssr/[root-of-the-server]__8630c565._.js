module.exports = [
"[externals]/next/dist/server/lib/incremental-cache/tags-manifest.external.js [external] (next/dist/server/lib/incremental-cache/tags-manifest.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/lib/incremental-cache/tags-manifest.external.js", () => require("next/dist/server/lib/incremental-cache/tags-manifest.external.js"));

module.exports = mod;
}),
"[project]/src/lib/cache/constants.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @fileoverview Cache Configuration Constants
 * @module lib/cache/constants
 *
 * Standardized cache TTL (Time To Live) configuration for the application.
 * Implements a tiered caching strategy based on data sensitivity and freshness requirements.
 *
 * **HIPAA Compliance:**
 * - PHI data has shorter TTLs (30-60s) to minimize stale data exposure
 * - Static data can cache longer (300s) for performance
 * - All cache keys use IDs only, never PHI values
 *
 * **Performance Strategy:**
 * - Aggressive caching for static reference data
 * - Conservative caching for frequently changing data
 * - Minimal caching for real-time data
 *
 * @see DATABASE_INTEGRATION_AUDIT_REPORT.md for detailed caching strategy
 * @version 1.0.0
 * @since 2025-10-27
 */ // ==========================================
// CACHE TTL CONSTANTS (seconds)
// ==========================================
/**
 * Cache Time-To-Live Configuration
 *
 * All values in seconds. Aligned with Next.js `revalidate` API.
 *
 * **Tier Breakdown:**
 * - **STATIC**: Reference data that rarely changes (schools, districts, medication formulary)
 * - **STATS**: Aggregated statistics (non-PHI dashboard data)
 * - **PHI_FREQUENT**: Frequently accessed PHI (active medications, today's appointments)
 * - **PHI_STANDARD**: Standard PHI access (student lists, health records lists)
 * - **SESSION**: User session data (profile, preferences)
 * - **REALTIME**: Real-time data (notifications, unread messages)
 */ __turbopack_context__.s([
    "CACHE_TAGS",
    ()=>CACHE_TAGS,
    "CACHE_TTL",
    ()=>CACHE_TTL,
    "buildResourceTag",
    ()=>buildResourceTag,
    "default",
    ()=>__TURBOPACK__default__export__,
    "getCacheTTL",
    ()=>getCacheTTL,
    "getCacheTags",
    ()=>getCacheTags
]);
const CACHE_TTL = {
    /**
   * Static reference data - rarely changes
   * Examples: Schools, districts, medication formulary, form templates
   * TTL: 5 minutes (300 seconds)
   */ STATIC: 300,
    /**
   * Aggregated statistics - non-PHI
   * Examples: Dashboard stats, analytics, reports
   * TTL: 2 minutes (120 seconds)
   */ STATS: 120,
    /**
   * PHI data - frequently accessed
   * Examples: Active medications, today's appointments, recent health alerts
   * TTL: 30 seconds
   * Rationale: High-sensitivity data that changes frequently
   */ PHI_FREQUENT: 30,
    /**
   * PHI data - standard access
   * Examples: Student lists, health records lists, incident lists
   * TTL: 1 minute (60 seconds)
   * Rationale: Moderate sensitivity, reasonable freshness for list views
   */ PHI_STANDARD: 60,
    /**
   * User session data
   * Examples: Current user profile, user preferences, role permissions
   * TTL: 5 minutes (300 seconds)
   * Rationale: Rarely changes during session, safe to cache
   */ SESSION: 300,
    /**
   * Real-time data - minimal caching
   * Examples: Notifications, unread message counts, active alerts
   * TTL: 10 seconds
   * Rationale: Needs near real-time updates
   */ REALTIME: 10,
    /**
   * No caching - always fetch fresh
   * Use for critical operations or data that must always be fresh
   * TTL: 0 (forces revalidation)
   */ NO_CACHE: 0
};
const CACHE_TAGS = {
    // ==========================================
    // PHI TAGS (HIPAA-protected data)
    // ==========================================
    /**
   * General PHI data tag
   * Use to invalidate all PHI-related caches
   */ PHI: 'phi-data',
    /**
   * Student data (PHI)
   */ STUDENTS: 'students',
    /**
   * Medication data (PHI)
   */ MEDICATIONS: 'medications',
    /**
   * Health record data (PHI)
   */ HEALTH_RECORDS: 'health-records',
    /**
   * Appointment data (PHI)
   */ APPOINTMENTS: 'appointments',
    /**
   * Incident report data (PHI)
   */ INCIDENTS: 'incidents',
    /**
   * Immunization data (PHI)
   */ IMMUNIZATIONS: 'immunizations',
    /**
   * Allergy data (PHI)
   */ ALLERGIES: 'allergies',
    /**
   * Emergency contact data (PHI)
   */ EMERGENCY_CONTACTS: 'emergency-contacts',
    // ==========================================
    // NON-PHI TAGS
    // ==========================================
    /**
   * User account data (non-PHI)
   */ USERS: 'users',
    /**
   * School data (non-PHI)
   */ SCHOOLS: 'schools',
    /**
   * District data (non-PHI)
   */ DISTRICTS: 'districts',
    /**
   * Dashboard statistics (non-PHI aggregated)
   */ STATS: 'statistics',
    /**
   * Analytics data (non-PHI aggregated)
   */ ANALYTICS: 'analytics',
    /**
   * Notification data
   */ NOTIFICATIONS: 'notifications',
    /**
   * Document templates (non-PHI)
   */ TEMPLATES: 'templates',
    /**
   * Medication formulary (non-PHI)
   */ FORMULARY: 'medication-formulary',
    /**
   * Admin user data (non-PHI)
   */ ADMIN_USERS: 'admin-users',
    /**
   * Admin districts data (non-PHI)
   */ ADMIN_DISTRICTS: 'admin-districts',
    /**
   * Admin schools data (non-PHI)
   */ ADMIN_SCHOOLS: 'admin-schools',
    /**
   * Admin settings data (non-PHI)
   */ ADMIN_SETTINGS: 'admin-settings',
    /**
   * Admin licenses data (non-PHI)
   */ ADMIN_LICENSES: 'admin-licenses',
    /**
   * Admin backups data (non-PHI)
   */ ADMIN_BACKUPS: 'admin-backups',
    /**
   * Admin metrics data (non-PHI)
   */ ADMIN_METRICS: 'admin-metrics',
    /**
   * Admin training data (non-PHI)
   */ ADMIN_TRAINING: 'admin-training',
    /**
   * Admin audit logs data (non-PHI)
   */ ADMIN_AUDIT_LOGS: 'admin-audit-logs'
};
function getCacheTTL(resourceType, isPHI, isFrequentlyAccessed = false) {
    if (!isPHI) {
        // Non-PHI data
        if (resourceType === 'users' || resourceType === 'schools' || resourceType === 'districts') {
            return CACHE_TTL.STATIC;
        }
        if (resourceType === 'statistics' || resourceType === 'analytics') {
            return CACHE_TTL.STATS;
        }
        if (resourceType === 'notifications') {
            return CACHE_TTL.REALTIME;
        }
        return CACHE_TTL.SESSION; // Default for non-PHI
    }
    // PHI data
    if (isFrequentlyAccessed) {
        return CACHE_TTL.PHI_FREQUENT;
    }
    return CACHE_TTL.PHI_STANDARD;
}
function getCacheTags(resourceType, isPHI = true) {
    const tags = [];
    // Add resource-specific tag
    if (resourceType === 'students') {
        tags.push(CACHE_TAGS.STUDENTS);
    } else if (resourceType === 'medications') {
        tags.push(CACHE_TAGS.MEDICATIONS);
    } else if (resourceType === 'health-records') {
        tags.push(CACHE_TAGS.HEALTH_RECORDS);
    } else if (resourceType === 'appointments') {
        tags.push(CACHE_TAGS.APPOINTMENTS);
    } else if (resourceType === 'incidents') {
        tags.push(CACHE_TAGS.INCIDENTS);
    } else if (resourceType === 'users') {
        tags.push(CACHE_TAGS.USERS);
    } else if (resourceType === 'statistics') {
        tags.push(CACHE_TAGS.STATS);
    }
    // Add PHI tag if applicable
    if (isPHI) {
        tags.push(CACHE_TAGS.PHI);
    }
    return tags;
}
function buildResourceTag(resourceType, resourceId) {
    return `${resourceType}-${resourceId}`;
}
// ==========================================
// DOCUMENTATION
// ==========================================
/**
 * Cache Strategy Documentation
 *
 * **Decision Framework:**
 *
 * 1. **Is it PHI?**
 *    - YES → Use PHI_FREQUENT (30s) or PHI_STANDARD (60s)
 *    - NO → Continue to #2
 *
 * 2. **How often does it change?**
 *    - Rarely (reference data) → STATIC (300s)
 *    - Moderately (aggregated stats) → STATS (120s)
 *    - Frequently (real-time) → REALTIME (10s)
 *
 * 3. **Is it user-specific?**
 *    - YES → SESSION (300s)
 *    - NO → Use type-based TTL
 *
 * **HIPAA Compliance Notes:**
 * - All PHI cache entries MUST have tags for invalidation
 * - Cache keys MUST NOT contain PHI values (use IDs only)
 * - PHI caches MUST be cleared on user logout
 * - Audit logging required for PHI cache access
 *
 * **Performance Guidelines:**
 * - Prefer longer TTLs for static data (reduces backend load)
 * - Use shorter TTLs for PHI (compliance requirement)
 * - Always tag caches for granular invalidation
 * - Monitor cache hit rates and adjust TTLs accordingly
 *
 * **Examples:**
 *
 * ```typescript
 * // Example 1: Fetch student list (PHI, standard access)
 * const students = await fetch('/api/students', {
 *   next: {
 *     revalidate: CACHE_TTL.PHI_STANDARD, // 60s
 *     tags: [CACHE_TAGS.STUDENTS, CACHE_TAGS.PHI]
 *   }
 * });
 *
 * // Example 2: Fetch medication formulary (non-PHI, static)
 * const formulary = await fetch('/api/medications/formulary', {
 *   next: {
 *     revalidate: CACHE_TTL.STATIC, // 300s
 *     tags: [CACHE_TAGS.FORMULARY]
 *   }
 * });
 *
 * // Example 3: Fetch today's appointments (PHI, frequent)
 * const appointments = await fetch('/api/appointments/today', {
 *   next: {
 *     revalidate: CACHE_TTL.PHI_FREQUENT, // 30s
 *     tags: [CACHE_TAGS.APPOINTMENTS, CACHE_TAGS.PHI]
 *   }
 * });
 *
 * // Example 4: Fetch current user (non-PHI, session)
 * const user = await fetch('/api/auth/me', {
 *   next: {
 *     revalidate: CACHE_TTL.SESSION, // 300s
 *     tags: [CACHE_TAGS.USERS]
 *   }
 * });
 * ```
 */ // Export all constants and utilities
const cacheConstants = {
    CACHE_TTL,
    CACHE_TAGS,
    getCacheTTL,
    getCacheTags,
    buildResourceTag
};
const __TURBOPACK__default__export__ = cacheConstants;
}),
"[project]/src/lib/actions/admin.configuration.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Admin Configuration Server Actions - System settings management
 *
 * @module lib/actions/admin.configuration
 * @since 2025-11-05
 */ /* __next_internal_action_entry_do_not_use__ [{"0039f13be7a2372585d08c26af331c6a113c4a216b":"resetConfigurationToDefaults","402b8515ed8c2f2e22bbc4374c605b0f5e932dcc9a":"updateSystemConfiguration","8035311dfe2dc7996f1e216028699ebe44c76bcdb6":"$$RSC_SERVER_CACHE_0","809e5da0554a6ee3cd3b162ccc2dfd996b91cac806":"$$RSC_SERVER_CACHE_1"},"",""] */ __turbopack_context__.s([
    "$$RSC_SERVER_CACHE_0",
    ()=>$$RSC_SERVER_CACHE_0,
    "$$RSC_SERVER_CACHE_1",
    ()=>$$RSC_SERVER_CACHE_1,
    "getConfigurationAuditTrail",
    ()=>getConfigurationAuditTrail,
    "getSystemConfiguration",
    ()=>getSystemConfiguration,
    "resetConfigurationToDefaults",
    ()=>resetConfigurationToDefaults,
    "updateSystemConfiguration",
    ()=>updateSystemConfiguration
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$cache$2d$wrapper$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/cache-wrapper.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cache$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/cache/constants.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
'use cache';
;
;
var $$RSC_SERVER_CACHE_0 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$cache$2d$wrapper$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cache"])("default", "8035311dfe2dc7996f1e216028699ebe44c76bcdb6", 0, async function getSystemConfiguration() {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["unstable_cacheLife"])({
        revalidate: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cache$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CACHE_TTL"].STATIC
    }); // 300s for non-PHI admin data
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["unstable_cacheTag"])('admin-configuration');
    try {
        const response = await fetch(`${process.env.API_BASE_URL}/api/configuration`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.API_TOKEN}`
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.configuration;
    } catch (error) {
        console.error('Error fetching system configuration:', error);
        // Return default configuration if API fails
        return {
            id: 'default',
            sessionTimeout: 30,
            passwordMinLength: 8,
            passwordRequireSpecialChars: true,
            maxLoginAttempts: 5,
            backupFrequency: 'daily',
            enableAuditLogging: true,
            enableEmailNotifications: true,
            enableSMSNotifications: true,
            maintenanceMode: false,
            createdAt: new Date(),
            updatedAt: new Date()
        };
    }
});
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])($$RSC_SERVER_CACHE_0, "8035311dfe2dc7996f1e216028699ebe44c76bcdb6", null);
Object["defineProperty"]($$RSC_SERVER_CACHE_0, "name", {
    value: "getSystemConfiguration",
    writable: false
});
var getSystemConfiguration = $$RSC_SERVER_CACHE_0;
async function updateSystemConfiguration(updateData) {
    try {
        const response = await fetch(`${process.env.API_BASE_URL}/api/configuration`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.API_TOKEN}`
            },
            body: JSON.stringify(updateData)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // Revalidate cache
        await fetch(`${process.env.API_BASE_URL}/api/revalidate?tag=admin-configuration`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.API_TOKEN}`
            }
        });
        return {
            success: true,
            message: 'Configuration updated successfully',
            configuration: data.configuration
        };
    } catch (error) {
        console.error('Error updating system configuration:', error);
        return {
            success: false,
            message: 'Failed to update configuration'
        };
    }
}
var $$RSC_SERVER_CACHE_1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$cache$2d$wrapper$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cache"])("default", "809e5da0554a6ee3cd3b162ccc2dfd996b91cac806", 0, async function getConfigurationAuditTrail() {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["unstable_cacheLife"])({
        revalidate: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cache$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CACHE_TTL"].PHI_STANDARD
    }); // 60s for more frequently changing data
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["unstable_cacheTag"])('admin-configuration-audit');
    try {
        const response = await fetch(`${process.env.API_BASE_URL}/api/configuration/audit`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.API_TOKEN}`
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.auditTrail || [];
    } catch (error) {
        console.error('Error fetching configuration audit trail:', error);
        return [];
    }
});
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])($$RSC_SERVER_CACHE_1, "809e5da0554a6ee3cd3b162ccc2dfd996b91cac806", null);
Object["defineProperty"]($$RSC_SERVER_CACHE_1, "name", {
    value: "getConfigurationAuditTrail",
    writable: false
});
var getConfigurationAuditTrail = $$RSC_SERVER_CACHE_1;
async function resetConfigurationToDefaults() {
    try {
        const response = await fetch(`${process.env.API_BASE_URL}/api/configuration/reset`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.API_TOKEN}`
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        // Revalidate cache
        await fetch(`${process.env.API_BASE_URL}/api/revalidate?tag=admin-configuration`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.API_TOKEN}`
            }
        });
        return {
            success: true,
            message: 'Configuration reset to defaults successfully'
        };
    } catch (error) {
        console.error('Error resetting configuration:', error);
        return {
            success: false,
            message: 'Failed to reset configuration'
        };
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    updateSystemConfiguration,
    resetConfigurationToDefaults
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateSystemConfiguration, "402b8515ed8c2f2e22bbc4374c605b0f5e932dcc9a", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(resetConfigurationToDefaults, "0039f13be7a2372585d08c26af331c6a113c4a216b", null);
}),
"[project]/src/components/ui/badge.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "Badge",
    ()=>Badge,
    "badgeVariants",
    ()=>badgeVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const Badge = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call Badge() from the server but Badge is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/components/ui/badge.tsx <module evaluation>", "Badge");
const badgeVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call badgeVariants() from the server but badgeVariants is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/components/ui/badge.tsx <module evaluation>", "badgeVariants");
}),
"[project]/src/components/ui/badge.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "Badge",
    ()=>Badge,
    "badgeVariants",
    ()=>badgeVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const Badge = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call Badge() from the server but Badge is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/components/ui/badge.tsx", "Badge");
const badgeVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call badgeVariants() from the server but badgeVariants is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/components/ui/badge.tsx", "badgeVariants");
}),
"[project]/src/components/ui/badge.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/src/components/ui/badge.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/src/components/ui/badge.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/src/app/(dashboard)/admin/_components/AdminPageHeader.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @fileoverview Reusable Admin Page Header Component
 * @module app/(dashboard)/admin/_components/AdminPageHeader
 * @category Admin - Components
 */ __turbopack_context__.s([
    "AdminPageHeader",
    ()=>AdminPageHeader
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/badge.tsx [app-rsc] (ecmascript)");
;
;
function AdminPageHeader({ title, description, count, countLabel = 'items', actions, status }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "min-w-0 flex-1",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: "text-2xl font-bold text-gray-900",
                                    children: title
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(dashboard)/admin/_components/AdminPageHeader.tsx",
                                    lineNumber: 50,
                                    columnNumber: 13
                                }, this),
                                description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-gray-600 mt-1",
                                    children: description
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(dashboard)/admin/_components/AdminPageHeader.tsx",
                                    lineNumber: 52,
                                    columnNumber: 15
                                }, this),
                                typeof count === 'number' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-gray-500 mt-1",
                                    children: [
                                        count,
                                        " ",
                                        countLabel
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/(dashboard)/admin/_components/AdminPageHeader.tsx",
                                    lineNumber: 55,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(dashboard)/admin/_components/AdminPageHeader.tsx",
                            lineNumber: 49,
                            columnNumber: 11
                        }, this),
                        status && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Badge"], {
                            variant: status.variant,
                            className: "flex items-center gap-1",
                            children: [
                                status.icon,
                                status.label
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(dashboard)/admin/_components/AdminPageHeader.tsx",
                            lineNumber: 61,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(dashboard)/admin/_components/AdminPageHeader.tsx",
                    lineNumber: 48,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/(dashboard)/admin/_components/AdminPageHeader.tsx",
                lineNumber: 47,
                columnNumber: 7
            }, this),
            actions && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2 flex-shrink-0",
                children: actions
            }, void 0, false, {
                fileName: "[project]/src/app/(dashboard)/admin/_components/AdminPageHeader.tsx",
                lineNumber: 73,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/(dashboard)/admin/_components/AdminPageHeader.tsx",
        lineNumber: 46,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/app/(dashboard)/admin/settings/configuration/_components/ConfigurationManagementContent.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/src/app/(dashboard)/admin/settings/configuration/_components/ConfigurationManagementContent.tsx <module evaluation> from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/app/(dashboard)/admin/settings/configuration/_components/ConfigurationManagementContent.tsx <module evaluation>", "default");
}),
"[project]/src/app/(dashboard)/admin/settings/configuration/_components/ConfigurationManagementContent.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/src/app/(dashboard)/admin/settings/configuration/_components/ConfigurationManagementContent.tsx from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/app/(dashboard)/admin/settings/configuration/_components/ConfigurationManagementContent.tsx", "default");
}),
"[project]/src/app/(dashboard)/admin/settings/configuration/_components/ConfigurationManagementContent.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$dashboard$292f$admin$2f$settings$2f$configuration$2f$_components$2f$ConfigurationManagementContent$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/src/app/(dashboard)/admin/settings/configuration/_components/ConfigurationManagementContent.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$dashboard$292f$admin$2f$settings$2f$configuration$2f$_components$2f$ConfigurationManagementContent$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/src/app/(dashboard)/admin/settings/configuration/_components/ConfigurationManagementContent.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$dashboard$292f$admin$2f$settings$2f$configuration$2f$_components$2f$ConfigurationManagementContent$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/src/app/(dashboard)/admin/settings/configuration/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * System Configuration Page - Manage system settings and parameters
 * Enhanced with Next.js v16 Server Components, server-side data fetching, and caching
 *
 * @module app/admin/settings/configuration/page
 * @since 2025-11-05
 */ __turbopack_context__.s([
    "default",
    ()=>ConfigurationPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$admin$2e$configuration$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/actions/admin.configuration.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$dashboard$292f$admin$2f$_components$2f$AdminPageHeader$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/(dashboard)/admin/_components/AdminPageHeader.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$dashboard$292f$admin$2f$settings$2f$configuration$2f$_components$2f$ConfigurationManagementContent$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/(dashboard)/admin/settings/configuration/_components/ConfigurationManagementContent.tsx [app-rsc] (ecmascript)");
;
;
;
;
;
/**
 * Configuration Management Skeleton - Loading state
 */ function ConfigurationSkeleton() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-between items-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-6 w-48 bg-gray-200 rounded animate-pulse"
                            }, void 0, false, {
                                fileName: "[project]/src/app/(dashboard)/admin/settings/configuration/page.tsx",
                                lineNumber: 24,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-4 w-64 bg-gray-200 rounded animate-pulse"
                            }, void 0, false, {
                                fileName: "[project]/src/app/(dashboard)/admin/settings/configuration/page.tsx",
                                lineNumber: 25,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/(dashboard)/admin/settings/configuration/page.tsx",
                        lineNumber: 23,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-10 w-32 bg-gray-200 rounded animate-pulse"
                            }, void 0, false, {
                                fileName: "[project]/src/app/(dashboard)/admin/settings/configuration/page.tsx",
                                lineNumber: 28,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-10 w-28 bg-gray-200 rounded animate-pulse"
                            }, void 0, false, {
                                fileName: "[project]/src/app/(dashboard)/admin/settings/configuration/page.tsx",
                                lineNumber: 29,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/(dashboard)/admin/settings/configuration/page.tsx",
                        lineNumber: 27,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/(dashboard)/admin/settings/configuration/page.tsx",
                lineNumber: 22,
                columnNumber: 7
            }, this),
            Array.from({
                length: 3
            }).map((_, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white rounded-lg shadow p-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-6 w-32 bg-gray-200 rounded animate-pulse mb-4"
                        }, void 0, false, {
                            fileName: "[project]/src/app/(dashboard)/admin/settings/configuration/page.tsx",
                            lineNumber: 36,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-4",
                            children: Array.from({
                                length: 4
                            }).map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "h-4 w-24 bg-gray-200 rounded animate-pulse"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(dashboard)/admin/settings/configuration/page.tsx",
                                            lineNumber: 40,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "h-10 w-full bg-gray-200 rounded animate-pulse"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(dashboard)/admin/settings/configuration/page.tsx",
                                            lineNumber: 41,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, i, true, {
                                    fileName: "[project]/src/app/(dashboard)/admin/settings/configuration/page.tsx",
                                    lineNumber: 39,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/app/(dashboard)/admin/settings/configuration/page.tsx",
                            lineNumber: 37,
                            columnNumber: 11
                        }, this)
                    ]
                }, index, true, {
                    fileName: "[project]/src/app/(dashboard)/admin/settings/configuration/page.tsx",
                    lineNumber: 35,
                    columnNumber: 9
                }, this))
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/(dashboard)/admin/settings/configuration/page.tsx",
        lineNumber: 20,
        columnNumber: 5
    }, this);
}
/**
 * Configuration Page Content - Server Component with data fetching
 */ async function ConfigurationPageContent() {
    const configuration = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$admin$2e$configuration$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getSystemConfiguration"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$dashboard$292f$admin$2f$_components$2f$AdminPageHeader$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["AdminPageHeader"], {
                title: "System Configuration",
                description: "Manage system-wide settings and parameters"
            }, void 0, false, {
                fileName: "[project]/src/app/(dashboard)/admin/settings/configuration/page.tsx",
                lineNumber: 59,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$dashboard$292f$admin$2f$settings$2f$configuration$2f$_components$2f$ConfigurationManagementContent$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                initialConfiguration: configuration
            }, void 0, false, {
                fileName: "[project]/src/app/(dashboard)/admin/settings/configuration/page.tsx",
                lineNumber: 64,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/(dashboard)/admin/settings/configuration/page.tsx",
        lineNumber: 58,
        columnNumber: 5
    }, this);
}
function ConfigurationPage() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Suspense"], {
        fallback: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(ConfigurationSkeleton, {}, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/admin/settings/configuration/page.tsx",
            lineNumber: 74,
            columnNumber: 25
        }, void 0),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(ConfigurationPageContent, {}, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/admin/settings/configuration/page.tsx",
            lineNumber: 75,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/(dashboard)/admin/settings/configuration/page.tsx",
        lineNumber: 74,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__8630c565._.js.map