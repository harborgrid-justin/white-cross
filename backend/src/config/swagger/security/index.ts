/**
 * Swagger Security Module
 *
 * Centralized exports for all security scheme builders and types.
 * Provides a clean API for configuring authentication and authorization
 * in OpenAPI/Swagger documentation.
 *
 * @module swagger/security
 * @version 1.0.0
 */

// Type definitions
export type {
  SecuritySchemeConfig,
  OAuth2FlowConfig,
  JwtSecurityOptions,
  ApiKeyOptions,
  HmacOptions,
  MutualTlsOptions,
  DeviceSecurityOptions,
  ConditionalSecurityConditions,
} from './types';

// OAuth2 flow builders
export {
  createOAuth2AuthorizationCodeFlow,
  createOAuth2ImplicitFlow,
  createOAuth2PasswordFlow,
  createOAuth2ClientCredentialsFlow,
  createOAuth2RefreshTokenFlow,
  createOAuth2DeviceCodeFlow,
  createOAuth2HybridFlow,
  createOAuth2CustomFlow,
} from './oauth2-flows';

// JWT authentication builders
export {
  createJwtAuthentication,
  createJwtClaimsValidation,
  createJwtAudienceValidation,
  createJwtIssuerValidation,
  createJwtSignatureValidation,
  createJwtExpirationValidation,
  createJwtCustomValidation,
} from './jwt-auth';

// API key builders
export { createApiKeyHeader, createApiKeyQuery, createApiKeyCookie } from './api-keys';

// Advanced authentication builders
export {
  createHmacAuthentication,
  createMutualTlsAuthentication,
  createApiKeyWithIpWhitelist,
  createRotatingApiKey,
  createBasicAuthentication,
  createDigestAuthentication,
  createOpenIdConnect,
  createSamlAuthentication,
  createCustomTokenAuth,
  createSessionCookieAuth,
  createAwsSignatureV4,
  createTotpAuthentication,
  createDeviceBasedSecurity,
  createConditionalSecurity,
} from './advanced-auth';
