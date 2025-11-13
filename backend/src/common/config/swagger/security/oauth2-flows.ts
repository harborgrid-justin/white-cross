/**
 * OAuth2 Flow Configurators
 *
 * Functions for creating OAuth2 authentication flows including
 * authorization code, implicit, password, client credentials,
 * PKCE, device flows, and scope validation.
 *
 * @module swagger/security/oauth2-flows
 * @version 1.0.0
 */

import { applyDecorators } from '@nestjs/common';
import { ApiSecurity, ApiResponse, ApiExtension } from '@nestjs/swagger';

/**
 * Creates OAuth2 authorization code flow configuration.
 * The most common OAuth2 flow for web applications.
 *
 * @param authorizationUrl - Authorization endpoint URL
 * @param tokenUrl - Token endpoint URL
 * @param scopes - Available scopes with descriptions
 * @param refreshUrl - Optional refresh token URL
 * @returns OAuth2 authorization code flow configuration
 *
 * @example
 * ```typescript
 * @ApiSecurity('oauth2')
 * @createOAuth2AuthorizationCodeFlow(
 *   'https://auth.example.com/oauth/authorize',
 *   'https://auth.example.com/oauth/token',
 *   { 'read:users': 'Read user data', 'write:users': 'Modify user data' },
 *   'https://auth.example.com/oauth/refresh'
 * )
 * async protectedEndpoint() { }
 * ```
 */
export function createOAuth2AuthorizationCodeFlow(
  authorizationUrl: string,
  tokenUrl: string,
  scopes: Record<string, string>,
  refreshUrl?: string,
) {
  return applyDecorators(
    ApiExtension('x-oauth2-flow', {
      type: 'authorizationCode',
      authorizationUrl,
      tokenUrl,
      refreshUrl,
      scopes,
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - OAuth2 authentication required',
    }),
    ApiResponse({
      status: 403,
      description: 'Forbidden - Insufficient OAuth2 scopes',
    }),
  );
}

/**
 * Creates OAuth2 implicit flow configuration.
 * Simplified flow for browser-based applications.
 *
 * @param authorizationUrl - Authorization endpoint URL
 * @param scopes - Available scopes with descriptions
 * @returns OAuth2 implicit flow configuration
 *
 * @example
 * ```typescript
 * @createOAuth2ImplicitFlow(
 *   'https://auth.example.com/oauth/authorize',
 *   { 'read:data': 'Read access' }
 * )
 * async publicDataEndpoint() { }
 * ```
 */
export function createOAuth2ImplicitFlow(authorizationUrl: string, scopes: Record<string, string>) {
  return applyDecorators(
    ApiExtension('x-oauth2-flow', {
      type: 'implicit',
      authorizationUrl,
      scopes,
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - OAuth2 implicit flow authentication required',
    }),
  );
}

/**
 * Creates OAuth2 password credentials flow configuration.
 * Flow for trusted applications with username/password.
 *
 * @param tokenUrl - Token endpoint URL
 * @param scopes - Available scopes with descriptions
 * @param refreshUrl - Optional refresh token URL
 * @returns OAuth2 password flow configuration
 *
 * @example
 * ```typescript
 * @createOAuth2PasswordFlow(
 *   'https://auth.example.com/oauth/token',
 *   { 'api:access': 'Full API access' }
 * )
 * async trustedAppEndpoint() { }
 * ```
 */
export function createOAuth2PasswordFlow(
  tokenUrl: string,
  scopes: Record<string, string>,
  refreshUrl?: string,
) {
  return applyDecorators(
    ApiExtension('x-oauth2-flow', {
      type: 'password',
      tokenUrl,
      refreshUrl,
      scopes,
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Invalid username or password',
    }),
  );
}

/**
 * Creates OAuth2 client credentials flow configuration.
 * Flow for machine-to-machine authentication.
 *
 * @param tokenUrl - Token endpoint URL
 * @param scopes - Available scopes with descriptions
 * @returns OAuth2 client credentials flow configuration
 *
 * @example
 * ```typescript
 * @createOAuth2ClientCredentialsFlow(
 *   'https://auth.example.com/oauth/token',
 *   { 'service:read': 'Service read access', 'service:write': 'Service write access' }
 * )
 * async serviceToServiceEndpoint() { }
 * ```
 */
export function createOAuth2ClientCredentialsFlow(
  tokenUrl: string,
  scopes: Record<string, string>,
) {
  return applyDecorators(
    ApiExtension('x-oauth2-flow', {
      type: 'clientCredentials',
      tokenUrl,
      scopes,
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Invalid client credentials',
    }),
  );
}

/**
 * Creates multiple OAuth2 flows configuration.
 * Supports multiple OAuth2 flows simultaneously.
 *
 * @param flows - Multiple flow configurations
 * @param preferredFlow - Preferred flow for documentation
 * @returns Multiple OAuth2 flows configuration
 *
 * @example
 * ```typescript
 * @createOAuth2MultipleFlows({
 *   authorizationCode: {
 *     authorizationUrl: 'https://auth.example.com/authorize',
 *     tokenUrl: 'https://auth.example.com/token',
 *     scopes: { 'read': 'Read', 'write': 'Write' }
 *   },
 *   clientCredentials: {
 *     tokenUrl: 'https://auth.example.com/token',
 *     scopes: { 'api': 'API Access' }
 *   }
 * }, 'authorizationCode')
 * async flexibleAuthEndpoint() { }
 * ```
 */
export function createOAuth2MultipleFlows(
  flows: {
    implicit?: import('./types').OAuth2FlowConfig;
    password?: import('./types').OAuth2FlowConfig;
    clientCredentials?: import('./types').OAuth2FlowConfig;
    authorizationCode?: import('./types').OAuth2FlowConfig;
  },
  preferredFlow?: string,
) {
  const decorators: ReturnType<typeof applyDecorators>[] = [ApiExtension('x-oauth2-flows', flows)];

  if (preferredFlow) {
    decorators.push(ApiExtension('x-preferred-flow', preferredFlow));
  }

  decorators.push(
    ApiResponse({
      status: 401,
      description: 'Unauthorized - OAuth2 authentication required',
    }),
    ApiResponse({
      status: 403,
      description: 'Forbidden - Insufficient OAuth2 permissions',
    }),
  );

  return applyDecorators(...decorators);
}

/**
 * Creates OAuth2 PKCE flow configuration.
 * Authorization code flow with Proof Key for Code Exchange (enhanced security).
 *
 * @param authorizationUrl - Authorization endpoint URL
 * @param tokenUrl - Token endpoint URL
 * @param scopes - Available scopes with descriptions
 * @param codeChallengeMethod - PKCE challenge method (S256 or plain)
 * @returns OAuth2 PKCE flow configuration
 *
 * @example
 * ```typescript
 * @createOAuth2PkceFlow(
 *   'https://auth.example.com/oauth/authorize',
 *   'https://auth.example.com/oauth/token',
 *   { 'profile': 'User profile', 'email': 'Email address' },
 *   'S256'
 * )
 * async mobileAppEndpoint() { }
 * ```
 */
export function createOAuth2PkceFlow(
  authorizationUrl: string,
  tokenUrl: string,
  scopes: Record<string, string>,
  codeChallengeMethod: 'S256' | 'plain' = 'S256',
) {
  return applyDecorators(
    ApiExtension('x-oauth2-pkce-flow', {
      authorizationUrl,
      tokenUrl,
      scopes,
      codeChallengeMethod,
      description: 'OAuth2 with PKCE (Proof Key for Code Exchange)',
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Invalid PKCE flow',
    }),
  );
}

/**
 * Creates OAuth2 device authorization flow configuration.
 * Flow for devices with limited input capabilities (IoT, smart TVs).
 *
 * @param deviceAuthorizationUrl - Device authorization endpoint
 * @param tokenUrl - Token endpoint URL
 * @param scopes - Available scopes with descriptions
 * @returns OAuth2 device flow configuration
 *
 * @example
 * ```typescript
 * @createOAuth2DeviceFlow(
 *   'https://auth.example.com/oauth/device',
 *   'https://auth.example.com/oauth/token',
 *   { 'device:access': 'Device access' }
 * )
 * async iotDeviceEndpoint() { }
 * ```
 */
export function createOAuth2DeviceFlow(
  deviceAuthorizationUrl: string,
  tokenUrl: string,
  scopes: Record<string, string>,
) {
  return applyDecorators(
    ApiExtension('x-oauth2-device-flow', {
      deviceAuthorizationUrl,
      tokenUrl,
      scopes,
      description: 'OAuth2 device authorization flow for limited-input devices',
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Device authorization pending or denied',
    }),
    ApiResponse({
      status: 428,
      description: 'Precondition Required - User must authorize device',
    }),
  );
}

/**
 * Creates OAuth2 scope validation decorator.
 * Validates required OAuth2 scopes for endpoint access.
 *
 * @param requiredScopes - Array of required scope strings
 * @param requireAll - Whether all scopes are required (AND) or any (OR)
 * @returns OAuth2 scope validation configuration
 *
 * @example
 * ```typescript
 * @createOAuth2ScopeValidation(['read:users', 'write:users'], true)
 * async manageUsersEndpoint() { }
 * ```
 */
export function createOAuth2ScopeValidation(requiredScopes: string[], requireAll = false) {
  const scopeLogic = requireAll ? 'AND' : 'OR';

  return applyDecorators(
    ApiSecurity('oauth2', requiredScopes),
    ApiExtension('x-required-scopes', {
      scopes: requiredScopes,
      logic: scopeLogic,
      description: `Requires ${scopeLogic === 'AND' ? 'all' : 'any'} of: ${requiredScopes.join(', ')}`,
    }),
    ApiResponse({
      status: 403,
      description: `Forbidden - Missing required OAuth2 scopes (${scopeLogic}: ${requiredScopes.join(', ')})`,
    }),
  );
}
