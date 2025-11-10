"use strict";
/**
 * @fileoverview Configuration Management Barrel Export
 * @module core/config
 *
 * Comprehensive configuration management utilities including environment variable
 * parsing, file loading, validation, secrets management, and feature flags.
 *
 * @example Environment variable parsing
 * ```typescript
 * import { parseEnvArray, parseEnvDuration, parseEnvURL } from '@reuse/core/config';
 *
 * const hosts = parseEnvArray('DATABASE_HOSTS', ',');
 * const timeout = parseEnvDuration('SESSION_TIMEOUT');
 * const apiUrl = parseEnvURL('API_URL');
 * ```
 *
 * @example Configuration hierarchy
 * ```typescript
 * import { createConfigHierarchy } from '@reuse/core/config';
 *
 * const config = createConfigHierarchy(
 *   ['default', 'production', 'local'],
 *   { baseDir: './config', extension: '.json' }
 * );
 * ```
 *
 * @example Feature flags
 * ```typescript
 * import { createFeatureFlagService } from '@reuse/core/config';
 *
 * const flags = createFeatureFlagService({
 *   newUI: { enabled: true, rollout: 50 },
 *   betaFeatures: { enabled: true, segments: ['beta-testers'] }
 * });
 *
 * if (flags.isEnabled('newUI', { userId: user.id })) {
 *   // Show new UI
 * }
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
exports.EnvironmentKit = exports.ConfigManagementKit = void 0;
// ============================================================================
// PARSERS
// ============================================================================
__exportStar(require("./parsers"), exports);
// ============================================================================
// VALIDATION
// ============================================================================
__exportStar(require("./validation"), exports);
// ============================================================================
// SECRETS MANAGEMENT
// ============================================================================
__exportStar(require("./secrets"), exports);
// ============================================================================
// FEATURE FLAGS
// ============================================================================
__exportStar(require("./feature-flags"), exports);
// ============================================================================
// MAIN EXPORTS
// ============================================================================
__exportStar(require("./management-kit"), exports);
__exportStar(require("./environment-kit"), exports);
// ============================================================================
// DEFAULT EXPORTS
// ============================================================================
var management_kit_1 = require("./management-kit");
Object.defineProperty(exports, "ConfigManagementKit", { enumerable: true, get: function () { return __importDefault(management_kit_1).default; } });
var environment_kit_1 = require("./environment-kit");
Object.defineProperty(exports, "EnvironmentKit", { enumerable: true, get: function () { return __importDefault(environment_kit_1).default; } });
//# sourceMappingURL=index.js.map