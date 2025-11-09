"use strict";
/**
 * @fileoverview Caching & Performance Barrel Export
 * @module core/cache
 *
 * Comprehensive caching utilities including caching strategies, Redis patterns,
 * performance optimization, and cache management.
 *
 * @example Cache-aside pattern
 * ```typescript
 * import { createCacheManager } from '@reuse/core/cache';
 *
 * const cache = createCacheManager({ ttl: 3600000 });
 *
 * const data = await cache.get('key') || await cache.set('key', await fetchData());
 * ```
 *
 * @example Redis caching
 * ```typescript
 * import { RedisCache } from '@reuse/core/cache';
 *
 * const redis = new RedisCache({
 *   host: 'localhost',
 *   port: 6379
 * });
 *
 * await redis.set('user:123', userData, 3600);
 * ```
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheStrategiesKit = exports.CacheManagementKit = void 0;
// ============================================================================
// CACHING STRATEGIES
// ============================================================================
__exportStar(require("./strategies"), exports);
// ============================================================================
// REDIS UTILITIES
// ============================================================================
__exportStar(require("./redis"), exports);
// ============================================================================
// PERFORMANCE UTILITIES
// ============================================================================
__exportStar(require("./performance"), exports);
// ============================================================================
// MAIN EXPORTS
// ============================================================================
__exportStar(require("./management-kit"), exports);
__exportStar(require("./strategies-kit"), exports);
// ============================================================================
// DEFAULT EXPORTS
// ============================================================================
var management_kit_1 = require("./management-kit");
Object.defineProperty(exports, "CacheManagementKit", { enumerable: true, get: function () { return __importDefault(management_kit_1).default; } });
var strategies_kit_1 = require("./strategies-kit");
Object.defineProperty(exports, "CacheStrategiesKit", { enumerable: true, get: function () { return __importDefault(strategies_kit_1).default; } });
//# sourceMappingURL=index.js.map