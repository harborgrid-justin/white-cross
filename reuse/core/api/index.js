"use strict";
/**
 * @fileoverview API Management Barrel Export
 * @module core/api
 *
 * Comprehensive API management utilities including gateway patterns, versioning,
 * documentation generation, rate limiting, and GraphQL support.
 *
 * @example API Gateway with rate limiting
 * ```typescript
 * import { createRateLimiter, apiKeyAuthMiddleware } from '@reuse/core/api';
 *
 * const limiter = createRateLimiter({
 *   windowMs: 60000,
 *   maxRequests: 100,
 *   strategy: 'sliding'
 * });
 *
 * app.use('/api/v1', limiter, apiKeyAuthMiddleware(ApiKeyModel));
 * ```
 *
 * @example API Versioning
 * ```typescript
 * import { createVersionRouter, extractApiVersion } from '@reuse/core/api';
 *
 * const router = createVersionRouter({
 *   v1: handleV1Request,
 *   v2: handleV2Request
 * });
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
exports.HttpKit = exports.ApiGatewayKit = exports.ApiDesignKit = void 0;
// ============================================================================
// GATEWAY UTILITIES
// ============================================================================
__exportStar(require("./gateway"), exports);
// ============================================================================
// VERSIONING UTILITIES
// ============================================================================
__exportStar(require("./versioning"), exports);
// ============================================================================
// DOCUMENTATION UTILITIES
// ============================================================================
__exportStar(require("./documentation"), exports);
// ============================================================================
// GRAPHQL UTILITIES
// ============================================================================
__exportStar(require("./graphql"), exports);
// ============================================================================
// MAIN EXPORTS
// ============================================================================
__exportStar(require("./design-kit"), exports);
__exportStar(require("./gateway-kit"), exports);
__exportStar(require("./http-kit"), exports);
// ============================================================================
// DEFAULT EXPORTS
// ============================================================================
var design_kit_1 = require("./design-kit");
Object.defineProperty(exports, "ApiDesignKit", { enumerable: true, get: function () { return __importDefault(design_kit_1).default; } });
var gateway_kit_1 = require("./gateway-kit");
Object.defineProperty(exports, "ApiGatewayKit", { enumerable: true, get: function () { return __importDefault(gateway_kit_1).default; } });
var http_kit_1 = require("./http-kit");
Object.defineProperty(exports, "HttpKit", { enumerable: true, get: function () { return __importDefault(http_kit_1).default; } });
//# sourceMappingURL=index.js.map