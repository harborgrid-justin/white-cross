/**
 * Authentication Configuration Types
 * Type definitions for integration authentication methods
 */

/**
 * Base authentication configuration
 */
export interface BaseAuthenticationConfig {
  /** Authentication type identifier */
  type: 'api_key' | 'basic' | 'oauth2' | 'bearer' | 'custom';
}

/**
 * API Key authentication
 */
export interface ApiKeyAuthConfig extends BaseAuthenticationConfig {
  type: 'api_key';
  /** API key value (encrypted in storage) */
  apiKey: string;
  /** Header name for API key (default: 'X-API-Key') */
  headerName?: string;
}

/**
 * Basic authentication (username/password)
 */
export interface BasicAuthConfig extends BaseAuthenticationConfig {
  type: 'basic';
  /** Username */
  username: string;
  /** Password (encrypted in storage) */
  password: string;
}

/**
 * OAuth2 authentication
 */
export interface OAuth2AuthConfig extends BaseAuthenticationConfig {
  type: 'oauth2';
  /** OAuth2 client ID */
  clientId: string;
  /** OAuth2 client secret (encrypted in storage) */
  clientSecret: string;
  /** Token endpoint URL */
  tokenEndpoint: string;
  /** OAuth2 scopes */
  scopes?: string[];
  /** Grant type */
  grantType?: 'client_credentials' | 'authorization_code' | 'refresh_token';
  /** Refresh token if available */
  refreshToken?: string;
}

/**
 * Bearer token authentication
 */
export interface BearerAuthConfig extends BaseAuthenticationConfig {
  type: 'bearer';
  /** Bearer token (encrypted in storage) */
  token: string;
  /** Token expiration timestamp */
  expiresAt?: Date;
}

/**
 * Custom authentication
 */
export interface CustomAuthConfig extends BaseAuthenticationConfig {
  type: 'custom';
  /** Custom authentication parameters */
  parameters: Record<string, string>;
  /** Custom headers */
  headers?: Record<string, string>;
}

/**
 * Union type for all authentication configurations
 */
export type AuthenticationConfig =
  | ApiKeyAuthConfig
  | BasicAuthConfig
  | OAuth2AuthConfig
  | BearerAuthConfig
  | CustomAuthConfig;
