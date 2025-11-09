"use strict";
/**
 * @fileoverview OAuth 2.0 Flow Utilities
 * @module core/auth/oauth
 *
 * OAuth 2.0 authentication flows with PKCE support.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePKCEVerifier = exports.generatePKCEChallenge = exports.generatePKCEVerifier = exports.buildOAuth2TokenExchangeBody = exports.validateOAuth2State = exports.generateOAuth2AuthUrl = void 0;
// Re-export OAuth-specific functions
var authentication_kit_1 = require("../../../authentication-kit");
Object.defineProperty(exports, "generateOAuth2AuthUrl", { enumerable: true, get: function () { return authentication_kit_1.generateOAuth2AuthUrl; } });
Object.defineProperty(exports, "validateOAuth2State", { enumerable: true, get: function () { return authentication_kit_1.validateOAuth2State; } });
Object.defineProperty(exports, "buildOAuth2TokenExchangeBody", { enumerable: true, get: function () { return authentication_kit_1.buildOAuth2TokenExchangeBody; } });
Object.defineProperty(exports, "generatePKCEVerifier", { enumerable: true, get: function () { return authentication_kit_1.generatePKCEVerifier; } });
Object.defineProperty(exports, "generatePKCEChallenge", { enumerable: true, get: function () { return authentication_kit_1.generatePKCEChallenge; } });
Object.defineProperty(exports, "validatePKCEVerifier", { enumerable: true, get: function () { return authentication_kit_1.validatePKCEVerifier; } });
//# sourceMappingURL=index.js.map