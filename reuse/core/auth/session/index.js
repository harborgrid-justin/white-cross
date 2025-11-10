"use strict";
/**
 * @fileoverview Session Management Utilities
 * @module core/auth/session
 *
 * Session creation, validation, and lifecycle management.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSessionExpired = exports.getSessionTimeRemaining = exports.generateSessionId = exports.updateSessionActivity = exports.validateSession = exports.createSession = void 0;
// Re-export session-specific functions
var authentication_kit_1 = require("../../../authentication-kit");
Object.defineProperty(exports, "createSession", { enumerable: true, get: function () { return authentication_kit_1.createSession; } });
Object.defineProperty(exports, "validateSession", { enumerable: true, get: function () { return authentication_kit_1.validateSession; } });
Object.defineProperty(exports, "updateSessionActivity", { enumerable: true, get: function () { return authentication_kit_1.updateSessionActivity; } });
Object.defineProperty(exports, "generateSessionId", { enumerable: true, get: function () { return authentication_kit_1.generateSessionId; } });
Object.defineProperty(exports, "getSessionTimeRemaining", { enumerable: true, get: function () { return authentication_kit_1.getSessionTimeRemaining; } });
Object.defineProperty(exports, "isSessionExpired", { enumerable: true, get: function () { return authentication_kit_1.isSessionExpired; } });
//# sourceMappingURL=index.js.map