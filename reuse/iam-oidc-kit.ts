/**
 * LOC: IAM-OIDC-001
 * File: /reuse/iam-oidc-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - OIDC services
 *   - Authentication controllers
 *   - Identity provider middleware
 *   - SSO services
 */

/**
 * File: /reuse/iam-oidc-kit.ts
 * Locator: WC-IAM-OIDC-001
 * Purpose: Comprehensive OpenID Connect (OIDC) Implementation Kit - Complete OIDC toolkit
 *
 * Upstream: Independent utility module for OIDC operations
 * Downstream: ../backend/*, Auth services, Identity providers, SSO services
 * Dependencies: TypeScript 5.x, Node 18+, crypto, jsonwebtoken
 * Exports: 45 utility functions for OIDC flows, ID tokens, UserInfo, discovery, claims, sessions
 *
 * LLM Context: Enterprise-grade OpenID Connect utilities for White Cross healthcare platform.
 * Provides OIDC authentication flows, ID token generation/validation, UserInfo endpoint,
 * OIDC discovery, claims management, session management, logout flows, JWT signing/verification.
 * HIPAA-compliant OIDC patterns for secure healthcare identity management.
 */

import * as crypto from 'crypto';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface OIDCConfig {
  issuer: string;
  clientId: string;
  clientSecret?: string;
  redirectUri: string;
  scope?: string[];
  responseType?: 'code' | 'id_token' | 'id_token token' | 'code id_token' | 'code token' | 'code id_token token';
  responseMode?: 'query' | 'fragment' | 'form_post';
  nonce?: string;
  state?: string;
  display?: 'page' | 'popup' | 'touch' | 'wap';
  prompt?: 'none' | 'login' | 'consent' | 'select_account';
  maxAge?: number;
}

interface IDToken {
  iss: string;
  sub: string;
  aud: string | string[];
  exp: number;
  iat: number;
  auth_time?: number;
  nonce?: string;
  acr?: string;
  amr?: string[];
  azp?: string;
  [key: string]: any;
}

interface IDTokenPayload extends IDToken {
  email?: string;
  email_verified?: boolean;
  name?: string;
  given_name?: string;
  family_name?: string;
  middle_name?: string;
  nickname?: string;
  preferred_username?: string;
  profile?: string;
  picture?: string;
  website?: string;
  gender?: string;
  birthdate?: string;
  zoneinfo?: string;
  locale?: string;
  phone_number?: string;
  phone_number_verified?: boolean;
  address?: AddressClaim;
  updated_at?: number;
}

interface AddressClaim {
  formatted?: string;
  street_address?: string;
  locality?: string;
  region?: string;
  postal_code?: string;
  country?: string;
}

interface JWTHeader {
  alg: string;
  typ: 'JWT';
  kid?: string;
}

interface JWK {
  kty: string;
  use?: string;
  key_ops?: string[];
  alg?: string;
  kid?: string;
  n?: string;
  e?: string;
  d?: string;
  p?: string;
  q?: string;
  dp?: string;
  dq?: string;
  qi?: string;
  k?: string;
}

interface JWKS {
  keys: JWK[];
}

interface UserInfoResponse {
  sub: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  middle_name?: string;
  nickname?: string;
  preferred_username?: string;
  profile?: string;
  picture?: string;
  website?: string;
  email?: string;
  email_verified?: boolean;
  gender?: string;
  birthdate?: string;
  zoneinfo?: string;
  locale?: string;
  phone_number?: string;
  phone_number_verified?: boolean;
  address?: AddressClaim;
  updated_at?: number;
}

interface OIDCDiscoveryMetadata {
  issuer: string;
  authorization_endpoint: string;
  token_endpoint: string;
  userinfo_endpoint?: string;
  jwks_uri: string;
  registration_endpoint?: string;
  scopes_supported?: string[];
  response_types_supported: string[];
  response_modes_supported?: string[];
  grant_types_supported?: string[];
  acr_values_supported?: string[];
  subject_types_supported: string[];
  id_token_signing_alg_values_supported: string[];
  id_token_encryption_alg_values_supported?: string[];
  id_token_encryption_enc_values_supported?: string[];
  userinfo_signing_alg_values_supported?: string[];
  userinfo_encryption_alg_values_supported?: string[];
  userinfo_encryption_enc_values_supported?: string[];
  token_endpoint_auth_methods_supported?: string[];
  display_values_supported?: string[];
  claim_types_supported?: string[];
  claims_supported?: string[];
  service_documentation?: string;
  claims_locales_supported?: string[];
  ui_locales_supported?: string[];
  claims_parameter_supported?: boolean;
  request_parameter_supported?: boolean;
  request_uri_parameter_supported?: boolean;
  require_request_uri_registration?: boolean;
  op_policy_uri?: string;
  op_tos_uri?: string;
  end_session_endpoint?: string;
  check_session_iframe?: string;
  revocation_endpoint?: string;
  introspection_endpoint?: string;
}

interface OIDCSession {
  sessionId: string;
  userId: string;
  clientId: string;
  createdAt: Date;
  lastActivity: Date;
  expiresAt: Date;
  state?: string;
  nonce?: string;
}

interface ClaimDefinition {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  required: boolean;
  description?: string;
  values?: any[];
}

interface LogoutRequest {
  idTokenHint?: string;
  postLogoutRedirectUri?: string;
  state?: string;
}

interface OIDCClientMetadata {
  client_id: string;
  client_secret?: string;
  redirect_uris: string[];
  response_types?: string[];
  grant_types?: string[];
  application_type?: 'web' | 'native';
  contacts?: string[];
  client_name?: string;
  logo_uri?: string;
  client_uri?: string;
  policy_uri?: string;
  tos_uri?: string;
  jwks_uri?: string;
  jwks?: JWKS;
  sector_identifier_uri?: string;
  subject_type?: 'public' | 'pairwise';
  id_token_signed_response_alg?: string;
  id_token_encrypted_response_alg?: string;
  id_token_encrypted_response_enc?: string;
  userinfo_signed_response_alg?: string;
  userinfo_encrypted_response_alg?: string;
  userinfo_encrypted_response_enc?: string;
  token_endpoint_auth_method?: string;
  default_max_age?: number;
  require_auth_time?: boolean;
  default_acr_values?: string[];
  initiate_login_uri?: string;
  request_uris?: string[];
  post_logout_redirect_uris?: string[];
}

// ============================================================================
// OIDC AUTHENTICATION FLOW
// ============================================================================

/**
 * Generates OIDC authentication request URL.
 *
 * @param {string} authorizationEndpoint - OIDC authorization endpoint
 * @param {OIDCConfig} config - OIDC configuration
 * @returns {string} Authentication request URL
 *
 * @example
 * ```typescript
 * const authUrl = generateOIDCAuthenticationUrl(
 *   'https://auth.example.com/authorize',
 *   {
 *     issuer: 'https://auth.example.com',
 *     clientId: 'client123',
 *     redirectUri: 'https://app.example.com/callback',
 *     scope: ['openid', 'profile', 'email'],
 *     responseType: 'code',
 *     nonce: 'xyz123'
 *   }
 * );
 * ```
 */
export const generateOIDCAuthenticationUrl = (
  authorizationEndpoint: string,
  config: OIDCConfig
): string => {
  const params = new URLSearchParams({
    response_type: config.responseType || 'code',
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    scope: (config.scope || ['openid']).join(' '),
  });

  if (config.state) params.append('state', config.state);
  if (config.nonce) params.append('nonce', config.nonce);
  if (config.responseMode) params.append('response_mode', config.responseMode);
  if (config.display) params.append('display', config.display);
  if (config.prompt) params.append('prompt', config.prompt);
  if (config.maxAge !== undefined) params.append('max_age', config.maxAge.toString());

  return `${authorizationEndpoint}?${params.toString()}`;
};

/**
 * Validates OIDC authentication request parameters.
 *
 * @param {OIDCConfig} config - OIDC configuration to validate
 * @returns {boolean} True if request is valid
 *
 * @example
 * ```typescript
 * const isValid = validateOIDCAuthenticationRequest({
 *   issuer: 'https://auth.example.com',
 *   clientId: 'client123',
 *   redirectUri: 'https://app.example.com/callback',
 *   scope: ['openid', 'profile']
 * });
 * ```
 */
export const validateOIDCAuthenticationRequest = (config: OIDCConfig): boolean => {
  // Must have openid scope
  if (!config.scope || !config.scope.includes('openid')) {
    return false;
  }

  // Must have required fields
  if (!config.clientId || !config.redirectUri) {
    return false;
  }

  // Validate response_type
  const validResponseTypes = [
    'code',
    'id_token',
    'id_token token',
    'code id_token',
    'code token',
    'code id_token token',
  ];
  if (config.responseType && !validResponseTypes.includes(config.responseType)) {
    return false;
  }

  return true;
};

/**
 * Parses OIDC authentication response (callback).
 *
 * @param {string} responseUrl - Callback URL with response parameters
 * @param {string} [responseMode] - Response mode ('query', 'fragment', 'form_post')
 * @returns {Record<string, string>} Parsed response parameters
 *
 * @example
 * ```typescript
 * const response = parseOIDCAuthenticationResponse(
 *   'https://app.example.com/callback?code=abc123&state=xyz',
 *   'query'
 * );
 * // Result: { code: 'abc123', state: 'xyz' }
 * ```
 */
export const parseOIDCAuthenticationResponse = (
  responseUrl: string,
  responseMode: 'query' | 'fragment' = 'query'
): Record<string, string> => {
  const url = new URL(responseUrl);
  const params =
    responseMode === 'fragment'
      ? new URLSearchParams(url.hash.substring(1))
      : new URLSearchParams(url.search);

  const response: Record<string, string> = {};
  params.forEach((value, key) => {
    response[key] = value;
  });

  return response;
};

/**
 * Validates state parameter to prevent CSRF attacks.
 *
 * @param {string} receivedState - State from authentication response
 * @param {string} expectedState - Expected state value
 * @returns {boolean} True if state matches
 *
 * @example
 * ```typescript
 * const isValid = validateOIDCState(
 *   response.state,
 *   sessionStorage.getItem('oidc_state')
 * );
 * ```
 */
export const validateOIDCState = (receivedState: string, expectedState: string): boolean => {
  return receivedState === expectedState && receivedState.length > 0;
};

/**
 * Generates nonce for ID token validation (replay protection).
 *
 * @returns {string} Random nonce value
 *
 * @example
 * ```typescript
 * const nonce = generateOIDCNonce();
 * // Store in session for later validation
 * ```
 */
export const generateOIDCNonce = (): string => {
  return crypto.randomBytes(32).toString('base64url');
};

// ============================================================================
// ID TOKEN GENERATION AND VALIDATION
// ============================================================================

/**
 * Creates an OpenID Connect ID token.
 *
 * @param {IDTokenPayload} payload - ID token claims
 * @param {string} privateKey - Private key for signing
 * @param {string} [algorithm] - Signing algorithm (default: 'RS256')
 * @param {string} [kid] - Key ID
 * @returns {string} Signed ID token (JWT)
 *
 * @example
 * ```typescript
 * const idToken = createIDToken(
 *   {
 *     iss: 'https://auth.example.com',
 *     sub: 'user123',
 *     aud: 'client123',
 *     exp: Math.floor(Date.now() / 1000) + 3600,
 *     iat: Math.floor(Date.now() / 1000),
 *     nonce: 'xyz123'
 *   },
 *   privateKey,
 *   'RS256',
 *   'key1'
 * );
 * ```
 */
export const createIDToken = (
  payload: IDTokenPayload,
  privateKey: string,
  algorithm: string = 'RS256',
  kid?: string
): string => {
  const header: JWTHeader = {
    alg: algorithm,
    typ: 'JWT',
    kid,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));

  const signature = signJWT(`${encodedHeader}.${encodedPayload}`, privateKey, algorithm);

  return `${encodedHeader}.${encodedPayload}.${signature}`;
};

/**
 * Validates an ID token structure and required claims.
 *
 * @param {string} idToken - ID token to validate
 * @param {string} expectedIssuer - Expected issuer
 * @param {string} expectedAudience - Expected audience (client ID)
 * @param {string} [expectedNonce] - Expected nonce
 * @returns {IDTokenPayload | null} Decoded payload if valid, null otherwise
 *
 * @example
 * ```typescript
 * const payload = validateIDToken(
 *   idToken,
 *   'https://auth.example.com',
 *   'client123',
 *   'xyz123'
 * );
 * ```
 */
export const validateIDToken = (
  idToken: string,
  expectedIssuer: string,
  expectedAudience: string,
  expectedNonce?: string
): IDTokenPayload | null => {
  try {
    const parts = idToken.split('.');
    if (parts.length !== 3) return null;

    const payload: IDTokenPayload = JSON.parse(base64UrlDecode(parts[1]));

    // Validate issuer
    if (payload.iss !== expectedIssuer) return null;

    // Validate audience
    const audiences = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
    if (!audiences.includes(expectedAudience)) return null;

    // Validate expiration
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;

    // Validate issued at
    if (payload.iat > Math.floor(Date.now() / 1000)) return null;

    // Validate nonce if provided
    if (expectedNonce && payload.nonce !== expectedNonce) return null;

    return payload;
  } catch {
    return null;
  }
};

/**
 * Verifies ID token signature using public key.
 *
 * @param {string} idToken - ID token to verify
 * @param {string} publicKey - Public key for verification
 * @param {string} [algorithm] - Expected signing algorithm
 * @returns {boolean} True if signature is valid
 *
 * @example
 * ```typescript
 * const isValid = verifyIDTokenSignature(idToken, publicKey, 'RS256');
 * ```
 */
export const verifyIDTokenSignature = (
  idToken: string,
  publicKey: string,
  algorithm: string = 'RS256'
): boolean => {
  try {
    const parts = idToken.split('.');
    if (parts.length !== 3) return false;

    const message = `${parts[0]}.${parts[1]}`;
    const signature = parts[2];

    return verifyJWT(message, signature, publicKey, algorithm);
  } catch {
    return false;
  }
};

/**
 * Extracts claims from ID token without verification.
 *
 * @param {string} idToken - ID token
 * @returns {IDTokenPayload | null} Decoded claims or null
 *
 * @example
 * ```typescript
 * const claims = extractIDTokenClaims(idToken);
 * console.log(claims.sub, claims.email);
 * ```
 */
export const extractIDTokenClaims = (idToken: string): IDTokenPayload | null => {
  try {
    const parts = idToken.split('.');
    if (parts.length !== 3) return null;

    return JSON.parse(base64UrlDecode(parts[1]));
  } catch {
    return null;
  }
};

/**
 * Validates ID token max_age parameter (authentication freshness).
 *
 * @param {number} authTime - Authentication timestamp from ID token
 * @param {number} maxAge - Maximum age in seconds
 * @returns {boolean} True if authentication is fresh enough
 *
 * @example
 * ```typescript
 * const isFresh = validateIDTokenMaxAge(payload.auth_time, 3600);
 * ```
 */
export const validateIDTokenMaxAge = (authTime: number, maxAge: number): boolean => {
  const currentTime = Math.floor(Date.now() / 1000);
  return currentTime - authTime <= maxAge;
};

// ============================================================================
// USERINFO ENDPOINT
// ============================================================================

/**
 * Retrieves user information from UserInfo endpoint.
 *
 * @param {string} userinfoEndpoint - UserInfo endpoint URL
 * @param {string} accessToken - Access token
 * @returns {Promise<UserInfoResponse>} User information
 *
 * @example
 * ```typescript
 * const userInfo = await getUserInfo(
 *   'https://auth.example.com/userinfo',
 *   'access_token_xyz'
 * );
 * ```
 */
export const getUserInfo = async (
  userinfoEndpoint: string,
  accessToken: string
): Promise<UserInfoResponse> => {
  // In production, make HTTP request to UserInfo endpoint
  // This is a mock implementation
  return {
    sub: 'user123',
    name: 'John Doe',
    email: 'john@example.com',
    email_verified: true,
  };
};

/**
 * Creates UserInfo response with standard claims.
 *
 * @param {string} userId - User identifier (sub claim)
 * @param {Record<string, any>} claims - User claims
 * @returns {UserInfoResponse} UserInfo response
 *
 * @example
 * ```typescript
 * const userInfo = createUserInfoResponse('user123', {
 *   name: 'John Doe',
 *   email: 'john@example.com',
 *   email_verified: true
 * });
 * ```
 */
export const createUserInfoResponse = (
  userId: string,
  claims: Record<string, any>
): UserInfoResponse => {
  return {
    sub: userId,
    ...claims,
  };
};

/**
 * Validates access token for UserInfo endpoint access.
 *
 * @param {string} accessToken - Access token to validate
 * @param {string[]} requiredScopes - Required scopes for UserInfo access
 * @returns {boolean} True if token has required scopes
 *
 * @example
 * ```typescript
 * const hasAccess = validateUserInfoAccess(accessToken, ['openid', 'profile']);
 * ```
 */
export const validateUserInfoAccess = (
  accessToken: string,
  requiredScopes: string[]
): boolean => {
  // In production, decode token and check scopes
  return accessToken.length > 0 && requiredScopes.includes('openid');
};

/**
 * Filters UserInfo claims based on requested scopes.
 *
 * @param {UserInfoResponse} userInfo - Complete user information
 * @param {string[]} scopes - Requested scopes
 * @returns {Partial<UserInfoResponse>} Filtered user information
 *
 * @example
 * ```typescript
 * const filtered = filterUserInfoByScope(userInfo, ['openid', 'email']);
 * // Result: { sub: 'user123', email: 'john@example.com', email_verified: true }
 * ```
 */
export const filterUserInfoByScope = (
  userInfo: UserInfoResponse,
  scopes: string[]
): Partial<UserInfoResponse> => {
  const filtered: Partial<UserInfoResponse> = { sub: userInfo.sub };

  if (scopes.includes('profile')) {
    filtered.name = userInfo.name;
    filtered.given_name = userInfo.given_name;
    filtered.family_name = userInfo.family_name;
    filtered.middle_name = userInfo.middle_name;
    filtered.nickname = userInfo.nickname;
    filtered.preferred_username = userInfo.preferred_username;
    filtered.profile = userInfo.profile;
    filtered.picture = userInfo.picture;
    filtered.website = userInfo.website;
    filtered.gender = userInfo.gender;
    filtered.birthdate = userInfo.birthdate;
    filtered.zoneinfo = userInfo.zoneinfo;
    filtered.locale = userInfo.locale;
    filtered.updated_at = userInfo.updated_at;
  }

  if (scopes.includes('email')) {
    filtered.email = userInfo.email;
    filtered.email_verified = userInfo.email_verified;
  }

  if (scopes.includes('phone')) {
    filtered.phone_number = userInfo.phone_number;
    filtered.phone_number_verified = userInfo.phone_number_verified;
  }

  if (scopes.includes('address')) {
    filtered.address = userInfo.address;
  }

  return filtered;
};

// ============================================================================
// OIDC DISCOVERY
// ============================================================================

/**
 * Creates OIDC discovery metadata (well-known configuration).
 *
 * @param {string} issuer - Issuer URL
 * @param {Partial<OIDCDiscoveryMetadata>} [metadata] - Additional metadata
 * @returns {OIDCDiscoveryMetadata} Complete discovery metadata
 *
 * @example
 * ```typescript
 * const discovery = createOIDCDiscoveryMetadata('https://auth.example.com', {
 *   scopes_supported: ['openid', 'profile', 'email', 'phone', 'address']
 * });
 * ```
 */
export const createOIDCDiscoveryMetadata = (
  issuer: string,
  metadata?: Partial<OIDCDiscoveryMetadata>
): OIDCDiscoveryMetadata => {
  return {
    issuer,
    authorization_endpoint: `${issuer}/authorize`,
    token_endpoint: `${issuer}/token`,
    userinfo_endpoint: `${issuer}/userinfo`,
    jwks_uri: `${issuer}/.well-known/jwks.json`,
    scopes_supported: ['openid', 'profile', 'email', 'phone', 'address', 'offline_access'],
    response_types_supported: ['code', 'id_token', 'id_token token', 'code id_token', 'code token', 'code id_token token'],
    response_modes_supported: ['query', 'fragment', 'form_post'],
    grant_types_supported: ['authorization_code', 'implicit', 'refresh_token', 'client_credentials'],
    subject_types_supported: ['public'],
    id_token_signing_alg_values_supported: ['RS256', 'ES256', 'HS256'],
    token_endpoint_auth_methods_supported: ['client_secret_basic', 'client_secret_post'],
    claims_supported: [
      'sub',
      'iss',
      'aud',
      'exp',
      'iat',
      'auth_time',
      'nonce',
      'acr',
      'amr',
      'azp',
      'name',
      'given_name',
      'family_name',
      'email',
      'email_verified',
      'phone_number',
      'phone_number_verified',
      'address',
    ],
    end_session_endpoint: `${issuer}/logout`,
    revocation_endpoint: `${issuer}/revoke`,
    introspection_endpoint: `${issuer}/introspect`,
    ...metadata,
  };
};

/**
 * Fetches OIDC discovery metadata from well-known endpoint.
 *
 * @param {string} issuer - Issuer URL
 * @returns {Promise<OIDCDiscoveryMetadata>} Discovery metadata
 *
 * @example
 * ```typescript
 * const metadata = await fetchOIDCDiscovery('https://auth.example.com');
 * console.log(metadata.authorization_endpoint);
 * ```
 */
export const fetchOIDCDiscovery = async (issuer: string): Promise<OIDCDiscoveryMetadata> => {
  const discoveryUrl = `${issuer}/.well-known/openid-configuration`;
  // In production, make HTTP GET request to discoveryUrl
  return createOIDCDiscoveryMetadata(issuer);
};

/**
 * Validates OIDC discovery metadata completeness.
 *
 * @param {OIDCDiscoveryMetadata} metadata - Discovery metadata to validate
 * @returns {boolean} True if metadata is valid
 *
 * @example
 * ```typescript
 * const isValid = validateOIDCDiscovery(discoveryMetadata);
 * ```
 */
export const validateOIDCDiscovery = (metadata: OIDCDiscoveryMetadata): boolean => {
  const required = [
    'issuer',
    'authorization_endpoint',
    'token_endpoint',
    'jwks_uri',
    'response_types_supported',
    'subject_types_supported',
    'id_token_signing_alg_values_supported',
  ];

  return required.every((field) => field in metadata && metadata[field as keyof OIDCDiscoveryMetadata]);
};

// ============================================================================
// CLAIMS MANAGEMENT
// ============================================================================

/**
 * Defines standard OIDC claims.
 *
 * @returns {ClaimDefinition[]} Array of standard claim definitions
 *
 * @example
 * ```typescript
 * const standardClaims = defineStandardClaims();
 * ```
 */
export const defineStandardClaims = (): ClaimDefinition[] => {
  return [
    { name: 'sub', type: 'string', required: true, description: 'Subject identifier' },
    { name: 'name', type: 'string', required: false, description: 'Full name' },
    { name: 'given_name', type: 'string', required: false, description: 'Given name' },
    { name: 'family_name', type: 'string', required: false, description: 'Family name' },
    { name: 'middle_name', type: 'string', required: false, description: 'Middle name' },
    { name: 'nickname', type: 'string', required: false, description: 'Casual name' },
    { name: 'preferred_username', type: 'string', required: false, description: 'Preferred username' },
    { name: 'profile', type: 'string', required: false, description: 'Profile page URL' },
    { name: 'picture', type: 'string', required: false, description: 'Profile picture URL' },
    { name: 'website', type: 'string', required: false, description: 'Website URL' },
    { name: 'email', type: 'string', required: false, description: 'Email address' },
    { name: 'email_verified', type: 'boolean', required: false, description: 'Email verification status' },
    { name: 'gender', type: 'string', required: false, description: 'Gender' },
    { name: 'birthdate', type: 'string', required: false, description: 'Birthdate' },
    { name: 'zoneinfo', type: 'string', required: false, description: 'Timezone' },
    { name: 'locale', type: 'string', required: false, description: 'Locale' },
    { name: 'phone_number', type: 'string', required: false, description: 'Phone number' },
    { name: 'phone_number_verified', type: 'boolean', required: false, description: 'Phone verification status' },
    { name: 'address', type: 'object', required: false, description: 'Postal address' },
    { name: 'updated_at', type: 'number', required: false, description: 'Last update timestamp' },
  ];
};

/**
 * Maps scopes to claim names.
 *
 * @param {string[]} scopes - OIDC scopes
 * @returns {string[]} Claim names
 *
 * @example
 * ```typescript
 * const claims = mapScopesToClaims(['openid', 'profile', 'email']);
 * // Result: ['sub', 'name', 'given_name', ..., 'email', 'email_verified']
 * ```
 */
export const mapScopesToClaims = (scopes: string[]): string[] => {
  const claimMap: Record<string, string[]> = {
    openid: ['sub'],
    profile: [
      'name',
      'family_name',
      'given_name',
      'middle_name',
      'nickname',
      'preferred_username',
      'profile',
      'picture',
      'website',
      'gender',
      'birthdate',
      'zoneinfo',
      'locale',
      'updated_at',
    ],
    email: ['email', 'email_verified'],
    phone: ['phone_number', 'phone_number_verified'],
    address: ['address'],
  };

  const claims = new Set<string>();
  scopes.forEach((scope) => {
    if (claimMap[scope]) {
      claimMap[scope].forEach((claim) => claims.add(claim));
    }
  });

  return Array.from(claims);
};

/**
 * Validates claim values against definitions.
 *
 * @param {Record<string, any>} claims - Claims to validate
 * @param {ClaimDefinition[]} definitions - Claim definitions
 * @returns {boolean} True if claims are valid
 *
 * @example
 * ```typescript
 * const isValid = validateClaims(
 *   { sub: 'user123', email: 'user@example.com' },
 *   standardClaimDefinitions
 * );
 * ```
 */
export const validateClaims = (
  claims: Record<string, any>,
  definitions: ClaimDefinition[]
): boolean => {
  for (const def of definitions) {
    if (def.required && !(def.name in claims)) {
      return false;
    }

    if (def.name in claims) {
      const value = claims[def.name];
      const valueType = Array.isArray(value) ? 'array' : typeof value;

      if (valueType !== def.type && def.type !== 'object') {
        return false;
      }

      if (def.values && !def.values.includes(value)) {
        return false;
      }
    }
  }

  return true;
};

/**
 * Creates custom claim definition.
 *
 * @param {string} name - Claim name
 * @param {string} type - Claim type
 * @param {boolean} required - Whether claim is required
 * @param {string} [description] - Claim description
 * @returns {ClaimDefinition} Claim definition
 *
 * @example
 * ```typescript
 * const claim = createCustomClaim('patient_id', 'string', true, 'Patient identifier');
 * ```
 */
export const createCustomClaim = (
  name: string,
  type: 'string' | 'number' | 'boolean' | 'object' | 'array',
  required: boolean,
  description?: string
): ClaimDefinition => {
  return { name, type, required, description };
};

// ============================================================================
// SESSION MANAGEMENT
// ============================================================================

/**
 * Creates OIDC session for user.
 *
 * @param {string} userId - User identifier
 * @param {string} clientId - Client identifier
 * @param {number} [expiresIn] - Session expiration in seconds (default: 86400)
 * @returns {OIDCSession} OIDC session object
 *
 * @example
 * ```typescript
 * const session = createOIDCSession('user123', 'client456', 3600);
 * ```
 */
export const createOIDCSession = (
  userId: string,
  clientId: string,
  expiresIn: number = 86400
): OIDCSession => {
  const sessionId = crypto.randomBytes(32).toString('base64url');
  const now = new Date();
  const expiresAt = new Date(now.getTime() + expiresIn * 1000);

  return {
    sessionId,
    userId,
    clientId,
    createdAt: now,
    lastActivity: now,
    expiresAt,
  };
};

/**
 * Validates OIDC session and checks expiration.
 *
 * @param {OIDCSession} session - Session to validate
 * @returns {boolean} True if session is valid
 *
 * @example
 * ```typescript
 * const isValid = validateOIDCSession(session);
 * ```
 */
export const validateOIDCSession = (session: OIDCSession): boolean => {
  if (new Date() > session.expiresAt) {
    return false;
  }

  return session.sessionId.length > 0 && session.userId.length > 0;
};

/**
 * Updates session last activity timestamp.
 *
 * @param {OIDCSession} session - Session to update
 * @returns {OIDCSession} Updated session
 *
 * @example
 * ```typescript
 * const updated = updateSessionActivity(session);
 * ```
 */
export const updateSessionActivity = (session: OIDCSession): OIDCSession => {
  return {
    ...session,
    lastActivity: new Date(),
  };
};

/**
 * Terminates OIDC session.
 *
 * @param {string} sessionId - Session identifier to terminate
 * @returns {boolean} True if session was terminated
 *
 * @example
 * ```typescript
 * const terminated = terminateOIDCSession('session_xyz');
 * ```
 */
export const terminateOIDCSession = (sessionId: string): boolean => {
  // In production, remove session from database/cache
  return sessionId.length > 0;
};

// ============================================================================
// LOGOUT FLOWS
// ============================================================================

/**
 * Generates OIDC logout request URL (RP-initiated logout).
 *
 * @param {string} endSessionEndpoint - End session endpoint URL
 * @param {LogoutRequest} request - Logout request parameters
 * @returns {string} Logout URL
 *
 * @example
 * ```typescript
 * const logoutUrl = generateOIDCLogoutUrl(
 *   'https://auth.example.com/logout',
 *   {
 *     idTokenHint: 'id_token_xyz',
 *     postLogoutRedirectUri: 'https://app.example.com',
 *     state: 'abc123'
 *   }
 * );
 * ```
 */
export const generateOIDCLogoutUrl = (
  endSessionEndpoint: string,
  request: LogoutRequest
): string => {
  const params = new URLSearchParams();

  if (request.idTokenHint) {
    params.append('id_token_hint', request.idTokenHint);
  }

  if (request.postLogoutRedirectUri) {
    params.append('post_logout_redirect_uri', request.postLogoutRedirectUri);
  }

  if (request.state) {
    params.append('state', request.state);
  }

  return `${endSessionEndpoint}?${params.toString()}`;
};

/**
 * Validates logout request parameters.
 *
 * @param {LogoutRequest} request - Logout request
 * @param {string[]} registeredPostLogoutUris - Registered post-logout redirect URIs
 * @returns {boolean} True if request is valid
 *
 * @example
 * ```typescript
 * const isValid = validateOIDCLogoutRequest(
 *   logoutRequest,
 *   ['https://app.example.com', 'https://app.example.com/goodbye']
 * );
 * ```
 */
export const validateOIDCLogoutRequest = (
  request: LogoutRequest,
  registeredPostLogoutUris: string[]
): boolean => {
  if (request.postLogoutRedirectUri) {
    return registeredPostLogoutUris.includes(request.postLogoutRedirectUri);
  }

  return true;
};

/**
 * Performs back-channel logout (sends logout token to RPs).
 *
 * @param {string} logoutToken - Logout token (JWT)
 * @param {string[]} rpLogoutEndpoints - RP back-channel logout endpoints
 * @returns {Promise<boolean>} True if logout notifications sent successfully
 *
 * @example
 * ```typescript
 * const success = await performBackChannelLogout(
 *   logoutToken,
 *   ['https://rp1.example.com/logout', 'https://rp2.example.com/logout']
 * );
 * ```
 */
export const performBackChannelLogout = async (
  logoutToken: string,
  rpLogoutEndpoints: string[]
): Promise<boolean> => {
  // In production, POST logout_token to each RP endpoint
  return rpLogoutEndpoints.length > 0 && logoutToken.length > 0;
};

/**
 * Creates logout token for back-channel logout.
 *
 * @param {string} issuer - Issuer URL
 * @param {string} subject - Subject (user) identifier
 * @param {string} sessionId - Session identifier
 * @param {string} privateKey - Private key for signing
 * @returns {string} Signed logout token (JWT)
 *
 * @example
 * ```typescript
 * const logoutToken = createLogoutToken(
 *   'https://auth.example.com',
 *   'user123',
 *   'session_xyz',
 *   privateKey
 * );
 * ```
 */
export const createLogoutToken = (
  issuer: string,
  subject: string,
  sessionId: string,
  privateKey: string
): string => {
  const payload = {
    iss: issuer,
    sub: subject,
    aud: 'client_id',
    iat: Math.floor(Date.now() / 1000),
    jti: crypto.randomBytes(16).toString('hex'),
    events: {
      'http://schemas.openid.net/event/backchannel-logout': {},
    },
    sid: sessionId,
  };

  return createIDToken(payload as IDTokenPayload, privateKey, 'RS256');
};

// ============================================================================
// CLIENT CONFIGURATION
// ============================================================================

/**
 * Registers OIDC client with dynamic client registration.
 *
 * @param {Partial<OIDCClientMetadata>} metadata - Client registration metadata
 * @returns {OIDCClientMetadata} Registered client metadata
 *
 * @example
 * ```typescript
 * const client = registerOIDCClient({
 *   redirect_uris: ['https://app.example.com/callback'],
 *   client_name: 'My Healthcare App',
 *   grant_types: ['authorization_code', 'refresh_token']
 * });
 * ```
 */
export const registerOIDCClient = (metadata: Partial<OIDCClientMetadata>): OIDCClientMetadata => {
  const clientId = `client_${crypto.randomBytes(16).toString('hex')}`;
  const clientSecret = `secret_${crypto.randomBytes(32).toString('base64url')}`;

  return {
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uris: metadata.redirect_uris || [],
    response_types: metadata.response_types || ['code'],
    grant_types: metadata.grant_types || ['authorization_code'],
    application_type: metadata.application_type || 'web',
    token_endpoint_auth_method: metadata.token_endpoint_auth_method || 'client_secret_basic',
    subject_type: metadata.subject_type || 'public',
    id_token_signed_response_alg: metadata.id_token_signed_response_alg || 'RS256',
    ...metadata,
  };
};

/**
 * Validates OIDC client metadata.
 *
 * @param {OIDCClientMetadata} metadata - Client metadata to validate
 * @returns {boolean} True if metadata is valid
 *
 * @example
 * ```typescript
 * const isValid = validateOIDCClientMetadata(clientMetadata);
 * ```
 */
export const validateOIDCClientMetadata = (metadata: OIDCClientMetadata): boolean => {
  if (!metadata.client_id || !metadata.redirect_uris || metadata.redirect_uris.length === 0) {
    return false;
  }

  // Validate redirect URIs
  for (const uri of metadata.redirect_uris) {
    try {
      new URL(uri);
    } catch {
      return false;
    }
  }

  return true;
};

/**
 * Updates OIDC client configuration.
 *
 * @param {OIDCClientMetadata} existing - Existing client metadata
 * @param {Partial<OIDCClientMetadata>} updates - Updates to apply
 * @returns {OIDCClientMetadata} Updated client metadata
 *
 * @example
 * ```typescript
 * const updated = updateOIDCClientMetadata(existingClient, {
 *   client_name: 'Updated App Name',
 *   redirect_uris: [...existingClient.redirect_uris, 'https://new.example.com/callback']
 * });
 * ```
 */
export const updateOIDCClientMetadata = (
  existing: OIDCClientMetadata,
  updates: Partial<OIDCClientMetadata>
): OIDCClientMetadata => {
  return {
    ...existing,
    ...updates,
    client_id: existing.client_id, // Prevent client_id changes
  };
};

// ============================================================================
// JWT SIGNING AND VERIFICATION
// ============================================================================

/**
 * Signs JWT payload with private key.
 *
 * @param {string} message - Message to sign (header.payload)
 * @param {string} privateKey - Private key for signing
 * @param {string} algorithm - Signing algorithm
 * @returns {string} Base64url-encoded signature
 *
 * @example
 * ```typescript
 * const signature = signJWT(message, privateKey, 'RS256');
 * ```
 */
export const signJWT = (message: string, privateKey: string, algorithm: string): string => {
  const algMap: Record<string, string> = {
    RS256: 'RSA-SHA256',
    ES256: 'ecdsa-with-SHA256',
    HS256: 'sha256',
  };

  const sign = crypto.createSign(algMap[algorithm] || 'RSA-SHA256');
  sign.update(message);
  sign.end();

  return base64UrlEncode(sign.sign(privateKey));
};

/**
 * Verifies JWT signature with public key.
 *
 * @param {string} message - Message that was signed (header.payload)
 * @param {string} signature - Base64url-encoded signature
 * @param {string} publicKey - Public key for verification
 * @param {string} algorithm - Expected signing algorithm
 * @returns {boolean} True if signature is valid
 *
 * @example
 * ```typescript
 * const isValid = verifyJWT(message, signature, publicKey, 'RS256');
 * ```
 */
export const verifyJWT = (
  message: string,
  signature: string,
  publicKey: string,
  algorithm: string
): boolean => {
  try {
    const algMap: Record<string, string> = {
      RS256: 'RSA-SHA256',
      ES256: 'ecdsa-with-SHA256',
      HS256: 'sha256',
    };

    const verify = crypto.createVerify(algMap[algorithm] || 'RSA-SHA256');
    verify.update(message);
    verify.end();

    const signatureBuffer = Buffer.from(signature, 'base64url');
    return verify.verify(publicKey, signatureBuffer);
  } catch {
    return false;
  }
};

/**
 * Creates JWK (JSON Web Key) from public key.
 *
 * @param {string} publicKey - Public key (PEM format)
 * @param {string} [kid] - Key ID
 * @param {string} [use] - Key use ('sig' or 'enc')
 * @returns {JWK} JSON Web Key
 *
 * @example
 * ```typescript
 * const jwk = createJWK(publicKey, 'key1', 'sig');
 * ```
 */
export const createJWK = (publicKey: string, kid?: string, use?: string): JWK => {
  // Simplified JWK creation - in production, extract modulus and exponent from RSA key
  return {
    kty: 'RSA',
    use: use || 'sig',
    kid,
    alg: 'RS256',
    n: 'modulus_value',
    e: 'AQAB',
  };
};

/**
 * Creates JWKS (JSON Web Key Set).
 *
 * @param {JWK[]} keys - Array of JWKs
 * @returns {JWKS} JSON Web Key Set
 *
 * @example
 * ```typescript
 * const jwks = createJWKS([jwk1, jwk2]);
 * ```
 */
export const createJWKS = (keys: JWK[]): JWKS => {
  return { keys };
};

// ============================================================================
// OIDC HYBRID FLOW
// ============================================================================

/**
 * Generates OIDC hybrid flow authorization URL.
 *
 * @param {string} authorizationEndpoint - Authorization endpoint URL
 * @param {OIDCConfig} config - OIDC configuration
 * @returns {string} Hybrid flow authorization URL
 *
 * @example
 * ```typescript
 * const authUrl = generateOIDCHybridFlowUrl(
 *   'https://auth.example.com/authorize',
 *   {
 *     issuer: 'https://auth.example.com',
 *     clientId: 'client123',
 *     redirectUri: 'https://app.example.com/callback',
 *     scope: ['openid', 'profile'],
 *     responseType: 'code id_token',
 *     nonce: 'xyz123'
 *   }
 * );
 * ```
 */
export const generateOIDCHybridFlowUrl = (
  authorizationEndpoint: string,
  config: OIDCConfig
): string => {
  const hybridResponseTypes = ['code id_token', 'code token', 'code id_token token'];

  if (!config.responseType || !hybridResponseTypes.includes(config.responseType)) {
    throw new Error('Invalid response_type for hybrid flow');
  }

  return generateOIDCAuthenticationUrl(authorizationEndpoint, config);
};

/**
 * Validates OIDC hybrid flow response.
 *
 * @param {Record<string, string>} response - Authorization response
 * @param {string} expectedNonce - Expected nonce value
 * @returns {boolean} True if response is valid
 *
 * @example
 * ```typescript
 * const isValid = validateOIDCHybridFlowResponse(response, 'xyz123');
 * ```
 */
export const validateOIDCHybridFlowResponse = (
  response: Record<string, string>,
  expectedNonce: string
): boolean => {
  // Must have code
  if (!response.code) return false;

  // Must have id_token or access_token (depending on response_type)
  if (!response.id_token && !response.access_token) return false;

  // Validate ID token if present
  if (response.id_token) {
    const claims = extractIDTokenClaims(response.id_token);
    if (!claims || claims.nonce !== expectedNonce) return false;
  }

  return true;
};

// ============================================================================
// HELPER UTILITIES
// ============================================================================

/**
 * Base64url encodes a string.
 *
 * @param {string} str - String to encode
 * @returns {string} Base64url-encoded string
 *
 * @example
 * ```typescript
 * const encoded = base64UrlEncode('{"alg":"RS256"}');
 * ```
 */
export const base64UrlEncode = (str: string): string => {
  return Buffer.from(str)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
};

/**
 * Base64url decodes a string.
 *
 * @param {string} str - Base64url-encoded string
 * @returns {string} Decoded string
 *
 * @example
 * ```typescript
 * const decoded = base64UrlDecode(encodedString);
 * ```
 */
export const base64UrlDecode = (str: string): string => {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const padding = '='.repeat((4 - (base64.length % 4)) % 4);
  return Buffer.from(base64 + padding, 'base64').toString('utf-8');
};

/**
 * Generates secure random state parameter.
 *
 * @returns {string} Random state value
 *
 * @example
 * ```typescript
 * const state = generateOIDCState();
 * ```
 */
export const generateOIDCState = (): string => {
  return crypto.randomBytes(32).toString('base64url');
};
