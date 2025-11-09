"use strict";
/**
 * @fileoverview Error Handling & Monitoring Barrel Export
 * @module core/errors
 *
 * Comprehensive error handling, monitoring, and logging utilities including
 * error handlers, recovery strategies, monitoring, and structured logging.
 *
 * @example Error handling
 * ```typescript
 * import { createErrorHandler, ErrorTypes } from '@reuse/core/errors';
 *
 * const errorHandler = createErrorHandler({
 *   logErrors: true,
 *   formatResponse: true,
 *   captureStackTrace: true
 * });
 *
 * app.use(errorHandler);
 * ```
 *
 * @example Structured logging
 * ```typescript
 * import { createLogger } from '@reuse/core/errors';
 *
 * const logger = createLogger({
 *   level: 'info',
 *   format: 'json',
 *   destination: 'combined.log'
 * });
 *
 * logger.info('User logged in', { userId: '123' });
 * logger.error('Failed to process request', { error, requestId });
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
exports.ErrorHandlingKit = void 0;
// ============================================================================
// ERROR HANDLERS
// ============================================================================
__exportStar(require("./handlers"), exports);
// ============================================================================
// MONITORING
// ============================================================================
__exportStar(require("./monitoring"), exports);
// ============================================================================
// LOGGING
// ============================================================================
__exportStar(require("./logging"), exports);
// ============================================================================
// MAIN EXPORTS
// ============================================================================
__exportStar(require("./handling-kit"), exports);
// ============================================================================
// DEFAULT EXPORTS
// ============================================================================
var handling_kit_1 = require("./handling-kit");
Object.defineProperty(exports, "ErrorHandlingKit", { enumerable: true, get: function () { return __importDefault(handling_kit_1).default; } });
//# sourceMappingURL=index.js.map