"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CACHE_EVENTS = exports.CACHE_CONSTANTS = void 0;
exports.CACHE_CONSTANTS = {
    L1_MAX_SIZE: 1000,
    L1_MAX_MEMORY: 50 * 1024 * 1024,
    DEFAULT_TTL: {
        PUBLIC: 300,
        INTERNAL: 600,
        SENSITIVE: 1800,
        PHI: 900,
        SENSITIVE_PHI: 600,
    },
    KEY_PREFIXES: {
        L2_PUBLIC: 'hr:',
        L2_PHI: 'phi:',
        L3_PUBLIC: 'l3:hr:',
        L3_PHI: 'l3:phi:',
    },
    SIZE_THRESHOLDS: {
        SMALL_DATA: 10 * 1024,
        MEDIUM_DATA: 100 * 1024,
        LARGE_DATA: 1024 * 1024,
    },
    ACCESS_PATTERN: {
        MAX_PATTERNS: 1000,
        CLEANUP_THRESHOLD: 500,
        PREDICTION_WINDOW: 60000,
    },
    WARMING: {
        TOP_PATTERNS_LIMIT: 20,
        INITIAL_DELAY: 30000,
        CRON_INTERVAL: '0 */5 * * * *',
    },
    PREFETCH: {
        BATCH_SIZE: 10,
        CRON_INTERVAL: '0 */2 * * * *',
        MAX_QUEUE_SIZE: 100,
    },
    OPTIMIZATION: {
        CRON_INTERVAL: '0 0 * * * *',
        EXPIRY_CLEANUP_BATCH: 100,
    },
    METRICS: {
        MAX_AGE: 24 * 60 * 60 * 1000,
    },
};
exports.CACHE_EVENTS = {
    INVALIDATED: 'cache.invalidated',
    WARMED: 'cache.warmed',
    PREFETCHED: 'cache.prefetched',
    OPTIMIZED: 'cache.optimized',
};
//# sourceMappingURL=cache-constants.js.map