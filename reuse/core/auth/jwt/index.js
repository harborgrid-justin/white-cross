"use strict";
/**
 * @fileoverview JWT Token Management Utilities
 * @module core/auth/jwt
 *
 * JWT token generation, validation, and management utilities.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidJWTStructure = exports.getJWTInfo = exports.isJWTExpiringWithin = exports.getJWTTimeToExpiry = exports.isJWTExpired = exports.extractJWTPayload = exports.validateJWTToken = exports.generateJWTToken = void 0;
// Re-export JWT-specific functions from main authentication kit
var authentication_kit_1 = require("../../../authentication-kit");
Object.defineProperty(exports, "generateJWTToken", { enumerable: true, get: function () { return authentication_kit_1.generateJWTToken; } });
Object.defineProperty(exports, "validateJWTToken", { enumerable: true, get: function () { return authentication_kit_1.validateJWTToken; } });
Object.defineProperty(exports, "extractJWTPayload", { enumerable: true, get: function () { return authentication_kit_1.extractJWTPayload; } });
Object.defineProperty(exports, "isJWTExpired", { enumerable: true, get: function () { return authentication_kit_1.isJWTExpired; } });
Object.defineProperty(exports, "getJWTTimeToExpiry", { enumerable: true, get: function () { return authentication_kit_1.getJWTTimeToExpiry; } });
Object.defineProperty(exports, "isJWTExpiringWithin", { enumerable: true, get: function () { return authentication_kit_1.isJWTExpiringWithin; } });
Object.defineProperty(exports, "getJWTInfo", { enumerable: true, get: function () { return authentication_kit_1.getJWTInfo; } });
Object.defineProperty(exports, "isValidJWTStructure", { enumerable: true, get: function () { return authentication_kit_1.isValidJWTStructure; } });
//# sourceMappingURL=index.js.map