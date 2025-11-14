/**
 * Security Scheme Types
 *
 * TypeScript interfaces and types for OpenAPI security configuration,
 * including OAuth2 flows, JWT options, API keys, and authentication schemes.
 *
 * @module swagger/security/types
 * @version 1.0.0
 */

/**
 * OAuth2 flow configuration
 */
export interface OAuth2FlowConfig {
  /** Authorization URL (required for authorizationCode and implicit flows) */
  authorizationUrl?: string;
  /** Token URL (required for authorizationCode, password, clientCredentials) */
  tokenUrl?: string;
  /** Refresh token URL */
  refreshUrl?: string;
  /** Available OAuth2 scopes */
  scopes: Record<string, string>;
}

/**
 * Security scheme configuration
 */
export interface SecuritySchemeConfig {
  /** Security scheme name */
  name: string;
  /** Security scheme type */
  type: 'apiKey' | 'http' | 'oauth2' | 'openIdConnect';
  /** Scheme description */
  description?: string;
  /** API key location (for apiKey type) */
  in?: 'query' | 'header' | 'cookie';
  /** HTTP scheme (for http type) */
  scheme?: string;
  /** Bearer format (for http bearer) */
  bearerFormat?: string;
  /** OAuth2 flows (for oauth2 type) */
  flows?: {
    implicit?: OAuth2FlowConfig;
    password?: OAuth2FlowConfig;
    clientCredentials?: OAuth2FlowConfig;
    authorizationCode?: OAuth2FlowConfig;
  };
  /** OpenID Connect URL (for openIdConnect type) */
  openIdConnectUrl?: string;
}

/**
 * JWT security options
 */
export interface JwtSecurityOptions {
  /** Required scopes */
  scopes?: string[];
  /** JWT issuer */
  issuer?: string;
  /** JWT audience */
  audience?: string[];
  /** Token expiration time */
  expiresIn?: string;
  /** Custom claims required */
  requiredClaims?: string[];
}

/**
 * API key options
 */
export interface ApiKeyOptions {
  /** API key parameter name */
  keyName?: string;
  /** API key location */
  location?: 'header' | 'query' | 'cookie';
  /** Key format description */
  format?: string;
  /** Rate limit info */
  rateLimit?: { limit: number; window: string };
}

/**
 * HMAC authentication options
 */
export interface HmacOptions {
  /** HMAC algorithm */
  algorithm?: 'sha256' | 'sha384' | 'sha512';
  /** Header containing HMAC signature */
  signatureHeader?: string;
  /** Header containing timestamp */
  timestampHeader?: string;
  /** Clock skew tolerance in seconds */
  clockSkewTolerance?: number;
}

/**
 * Mutual TLS options
 */
export interface MutualTlsOptions {
  /** Certificate validation level */
  validationLevel?: 'none' | 'basic' | 'strict';
  /** Trusted certificate authorities */
  trustedCAs?: string[];
  /** Client certificate required */
  clientCertRequired?: boolean;
}

/**
 * Device-based security options
 */
export interface DeviceSecurityOptions {
  /** Require trusted device */
  requireTrustedDevice?: boolean;
  /** Header containing device identifier */
  deviceIdHeader?: string;
  /** Device fingerprinting enabled */
  enableFingerprinting?: boolean;
}

/**
 * Conditional security conditions
 */
export interface ConditionalSecurityConditions {
  /** Security schemes required */
  schemes?: string[];
  /** Required roles */
  roles?: string[];
  /** Required permissions */
  permissions?: string[];
}
