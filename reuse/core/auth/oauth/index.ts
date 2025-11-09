/**
 * @fileoverview OAuth 2.0 Flow Utilities
 * @module core/auth/oauth
 *
 * OAuth 2.0 authentication flows with PKCE support.
 */

// Re-export OAuth-specific functions
export {
  generateOAuth2AuthUrl,
  validateOAuth2State,
  buildOAuth2TokenExchangeBody,
  generatePKCEVerifier,
  generatePKCEChallenge,
  validatePKCEVerifier,
} from '../authentication-kit';

// Re-export OAuth types
export type {
  OAuth2Config,
  OAuth2AuthResult,
  OAuth2TokenResponse,
} from '../authentication-kit';
