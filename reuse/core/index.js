"use strict";
/**
 * @fileoverview Core Infrastructure Utilities - Main Barrel Export
 * @module core
 *
 * Enterprise-grade core infrastructure utilities for modern TypeScript/NestJS applications.
 * Organized into six main categories:
 *
 * - **Authentication & Authorization** - JWT, OAuth, RBAC, Session, MFA
 * - **API Management** - Gateway, Versioning, Documentation, GraphQL
 * - **Configuration** - Environment, Secrets, Feature Flags, Validation
 * - **Database** - Sequelize ORM, Models, Queries, Transactions, Migrations
 * - **Caching** - Strategies, Redis, Performance Optimization
 * - **Error Handling** - Handlers, Monitoring, Logging, Recovery
 *
 * @example Import specific utilities
 * ```typescript
 * import {
 *   generateJWTToken,
 *   createRateLimiter,
 *   parseEnvArray,
 *   createCacheManager,
 *   createErrorHandler
 * } from '@reuse/core';
 * ```
 *
 * @example Import from category
 * ```typescript
 * import { generateJWTToken, validateJWTToken } from '@reuse/core/auth';
 * import { createRateLimiter } from '@reuse/core/api';
 * import { parseEnvArray } from '@reuse/core/config';
 * ```
 *
 * @example Import from specialty
 * ```typescript
 * import { generateTOTPCode } from '@reuse/core/auth/mfa';
 * import { generatePKCEVerifier } from '@reuse/core/auth/oauth';
 * import { createCacheAside } from '@reuse/core/cache/strategies';
 * ```
 *
 * @version 1.0.0
 * @since 2025-11-08
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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFeatureFlagService = exports.createConfigHierarchy = exports.parseEnvDuration = exports.parseEnvObject = exports.parseEnvArray = exports.formatErrorResponse = exports.createVersionRouter = exports.createRateLimiter = exports.generateTOTPSetup = exports.createSession = exports.validateJWTToken = exports.generateJWTToken = exports.Errors = exports.Cache = exports.Database = exports.Config = exports.Api = exports.Auth = void 0;
// ============================================================================
// AUTHENTICATION & AUTHORIZATION
// ============================================================================
/**
 * Authentication and authorization utilities including JWT, OAuth, RBAC,
 * session management, and multi-factor authentication.
 */
exports.Auth = __importStar(require("./auth"));
// ============================================================================
// API MANAGEMENT
// ============================================================================
/**
 * API management utilities including gateway patterns, versioning,
 * documentation, rate limiting, and GraphQL support.
 */
exports.Api = __importStar(require("./api"));
// ============================================================================
// CONFIGURATION
// ============================================================================
/**
 * Configuration management utilities including environment variables,
 * secrets, feature flags, and validation.
 */
exports.Config = __importStar(require("./config"));
// ============================================================================
// DATABASE & ORM
// ============================================================================
/**
 * Database and ORM utilities including Sequelize models, queries,
 * associations, transactions, and migrations.
 */
exports.Database = __importStar(require("./database"));
// ============================================================================
// CACHING & PERFORMANCE
// ============================================================================
/**
 * Caching and performance utilities including strategies, Redis patterns,
 * and optimization tools.
 */
exports.Cache = __importStar(require("./cache"));
// ============================================================================
// ERROR HANDLING & MONITORING
// ============================================================================
/**
 * Error handling and monitoring utilities including handlers, logging,
 * and recovery strategies.
 */
exports.Errors = __importStar(require("./errors"));
// ============================================================================
// CONVENIENCE RE-EXPORTS
// ============================================================================
// Most commonly used utilities re-exported at top level for convenience
var auth_1 = require("./auth");
// Auth
Object.defineProperty(exports, "generateJWTToken", { enumerable: true, get: function () { return auth_1.generateJWTToken; } });
Object.defineProperty(exports, "validateJWTToken", { enumerable: true, get: function () { return auth_1.validateJWTToken; } });
Object.defineProperty(exports, "createSession", { enumerable: true, get: function () { return auth_1.createSession; } });
Object.defineProperty(exports, "generateTOTPSetup", { enumerable: true, get: function () { return auth_1.generateTOTPSetup; } });
var api_1 = require("./api");
// API
Object.defineProperty(exports, "createRateLimiter", { enumerable: true, get: function () { return api_1.createRateLimiter; } });
Object.defineProperty(exports, "createVersionRouter", { enumerable: true, get: function () { return api_1.createVersionRouter; } });
Object.defineProperty(exports, "formatErrorResponse", { enumerable: true, get: function () { return api_1.formatErrorResponse; } });
var config_1 = require("./config");
// Config
Object.defineProperty(exports, "parseEnvArray", { enumerable: true, get: function () { return config_1.parseEnvArray; } });
Object.defineProperty(exports, "parseEnvObject", { enumerable: true, get: function () { return config_1.parseEnvObject; } });
Object.defineProperty(exports, "parseEnvDuration", { enumerable: true, get: function () { return config_1.parseEnvDuration; } });
Object.defineProperty(exports, "createConfigHierarchy", { enumerable: true, get: function () { return config_1.createConfigHierarchy; } });
Object.defineProperty(exports, "createFeatureFlagService", { enumerable: true, get: function () { return config_1.createFeatureFlagService; } });
//# sourceMappingURL=index.js.map