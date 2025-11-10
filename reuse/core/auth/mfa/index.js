"use strict";
/**
 * @fileoverview Multi-Factor Authentication Utilities
 * @module core/auth/mfa
 *
 * TOTP, backup codes, and MFA challenge management.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMFAChallenge = exports.verifyBackupCode = exports.hashBackupCode = exports.generateBackupCodes = exports.verifyTOTPCode = exports.generateTOTPCode = exports.generateTOTPSetup = void 0;
// Re-export MFA-specific functions
var authentication_kit_1 = require("../../../authentication-kit");
Object.defineProperty(exports, "generateTOTPSetup", { enumerable: true, get: function () { return authentication_kit_1.generateTOTPSetup; } });
Object.defineProperty(exports, "generateTOTPCode", { enumerable: true, get: function () { return authentication_kit_1.generateTOTPCode; } });
Object.defineProperty(exports, "verifyTOTPCode", { enumerable: true, get: function () { return authentication_kit_1.verifyTOTPCode; } });
Object.defineProperty(exports, "generateBackupCodes", { enumerable: true, get: function () { return authentication_kit_1.generateBackupCodes; } });
Object.defineProperty(exports, "hashBackupCode", { enumerable: true, get: function () { return authentication_kit_1.hashBackupCode; } });
Object.defineProperty(exports, "verifyBackupCode", { enumerable: true, get: function () { return authentication_kit_1.verifyBackupCode; } });
Object.defineProperty(exports, "generateMFAChallenge", { enumerable: true, get: function () { return authentication_kit_1.generateMFAChallenge; } });
//# sourceMappingURL=index.js.map