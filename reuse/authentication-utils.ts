/**
 * LOC: AUTH1234567
 * File: /reuse/authentication-utils.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Authentication services
 *   - Auth controllers
 *   - Security middleware
 *   - Guard implementations
 */

/**
 * File: /reuse/authentication-utils.ts
 * Locator: WC-UTL-AUTH-001
 * Purpose: Comprehensive Authentication Utilities - Complete auth operations toolkit
 *
 * Upstream: Independent utility module for authentication operations
 * Downstream: ../backend/*, Auth services, Guards, Passport strategies
 * Dependencies: TypeScript 5.x, Node 18+, jsonwebtoken, passport
 * Exports: 40 utility functions for JWT, OAuth, sessions, MFA, API keys, tokens
 *
 * LLM Context: Enterprise-grade authentication utilities for White Cross healthcare platform.
 * Provides JWT management, OAuth 2.0 flows, session handling, multi-factor authentication,
 * password validation, biometric auth helpers, and SAML integration. HIPAA-compliant
 * authentication patterns for secure healthcare data access.
 */

import * as crypto from 'crypto';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface JWTPayload {
  sub: string;
  email?: string;
  role?: string;
  permissions?: string[];
  iat?: number;
  exp?: number;
  [key: string]: any;
}

interface JWTConfig {
  secret: string;
  expiresIn?: string | number;
  algorithm?: string;
  issuer?: string;
  audience?: string;
}

interface RefreshTokenConfig {
  userId: string;
  deviceId?: string;
  expiresIn?: string | number;
}

interface SessionData {
  userId: string;
  createdAt: Date;
  lastActivity: Date;
  expiresAt: Date;
  ipAddress?: string;
  userAgent?: string;
}

interface OAuth2Config {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scope?: string[];
  state?: string;
}

interface OAuth2TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope?: string;
}

interface ApiKeyConfig {
  prefix?: string;
  length?: number;
  expiresIn?: number;
}

interface MFAConfig {
  secret: string;
  window?: number;
  step?: number;
}

interface PasswordStrengthResult {
  score: number;
  isStrong: boolean;
  feedback: string[];
}

interface BiometricAuthData {
  userId: string;
  biometricType: 'fingerprint' | 'face' | 'voice';
  templateHash: string;
  enrolledAt: Date;
}

// ============================================================================
// JWT TOKEN CREATION AND VALIDATION
// ============================================================================

/**
 * Creates a JWT access token with standard claims.
 *
 * @param {JWTPayload} payload - Token payload
 * @param {JWTConfig} config - JWT configuration
 * @returns {string} Signed JWT token
 *
 * @example
 * ```typescript
 * const token = createJWTToken(
 *   { sub: 'user123', email: 'user@example.com', role: 'doctor' },
 *   { secret: 'secret-key', expiresIn: '15m', issuer: 'white-cross' }
 * );
 * ```
 */
export const createJWTToken = (payload: JWTPayload, config: JWTConfig): string => {
  const header = {
    alg: config.algorithm || 'HS256',
    typ: 'JWT',
  };

  const now = Math.floor(Date.now() / 1000);
  const exp = config.expiresIn
    ? now + (typeof config.expiresIn === 'string' ? parseTimeToSeconds(config.expiresIn) : config.expiresIn)
    : now + 900; // 15 minutes default

  const fullPayload = {
    ...payload,
    iat: now,
    exp,
    iss: config.issuer,
    aud: config.audience,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(fullPayload));
  const signature = signJWT(`${encodedHeader}.${encodedPayload}`, config.secret);

  return `${encodedHeader}.${encodedPayload}.${signature}`;
};

/**
 * Verifies and decodes a JWT token.
 *
 * @param {string} token - JWT token to verify
 * @param {string} secret - Secret key for verification
 * @param {object} [options] - Verification options
 * @returns {JWTPayload | null} Decoded payload or null if invalid
 *
 * @example
 * ```typescript
 * const payload = verifyJWTToken(token, 'secret-key', { issuer: 'white-cross' });
 * if (payload) {
 *   console.log('User ID:', payload.sub);
 * }
 * ```
 */
export const verifyJWTToken = (
  token: string,
  secret: string,
  options?: { issuer?: string; audience?: string }
): JWTPayload | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [encodedHeader, encodedPayload, signature] = parts;
    const expectedSignature = signJWT(`${encodedHeader}.${encodedPayload}`, secret);

    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      return null;
    }

    const payload: JWTPayload = JSON.parse(base64UrlDecode(encodedPayload));

    // Check expiration
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    // Check issuer
    if (options?.issuer && payload.iss !== options.issuer) {
      return null;
    }

    // Check audience
    if (options?.audience && payload.aud !== options.audience) {
      return null;
    }

    return payload;
  } catch (error) {
    return null;
  }
};

/**
 * Decodes JWT token without verification (unsafe - use for inspection only).
 *
 * @param {string} token - JWT token to decode
 * @returns {JWTPayload | null} Decoded payload or null if invalid format
 *
 * @example
 * ```typescript
 * const payload = decodeJWTToken(token);
 * console.log('Token expires at:', new Date(payload.exp * 1000));
 * ```
 */
export const decodeJWTToken = (token: string): JWTPayload | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    return JSON.parse(base64UrlDecode(parts[1]));
  } catch (error) {
    return null;
  }
};

/**
 * Checks if JWT token is expired.
 *
 * @param {string} token - JWT token to check
 * @returns {boolean} True if token is expired
 *
 * @example
 * ```typescript
 * if (isJWTExpired(token)) {
 *   console.log('Token expired, please refresh');
 * }
 * ```
 */
export const isJWTExpired = (token: string): boolean => {
  const payload = decodeJWTToken(token);
  if (!payload || !payload.exp) return true;
  return payload.exp < Math.floor(Date.now() / 1000);
};

/**
 * Gets remaining time until JWT expiration.
 *
 * @param {string} token - JWT token
 * @returns {number} Seconds until expiration (0 if expired)
 *
 * @example
 * ```typescript
 * const seconds = getJWTTimeToExpiry(token);
 * console.log(`Token expires in ${seconds} seconds`);
 * ```
 */
export const getJWTTimeToExpiry = (token: string): number => {
  const payload = decodeJWTToken(token);
  if (!payload || !payload.exp) return 0;
  const remaining = payload.exp - Math.floor(Date.now() / 1000);
  return Math.max(0, remaining);
};

// ============================================================================
// REFRESH TOKEN MANAGEMENT
// ============================================================================

/**
 * Creates a refresh token with extended expiration.
 *
 * @param {RefreshTokenConfig} config - Refresh token configuration
 * @param {string} secret - Secret key
 * @returns {string} Refresh token
 *
 * @example
 * ```typescript
 * const refreshToken = createRefreshToken(
 *   { userId: 'user123', deviceId: 'device456', expiresIn: '7d' },
 *   'refresh-secret'
 * );
 * ```
 */
export const createRefreshToken = (config: RefreshTokenConfig, secret: string): string => {
  const payload: JWTPayload = {
    sub: config.userId,
    deviceId: config.deviceId,
    type: 'refresh',
  };

  return createJWTToken(payload, {
    secret,
    expiresIn: config.expiresIn || '7d',
  });
};

/**
 * Generates refresh token family ID for rotation tracking.
 *
 * @returns {string} Unique family ID
 *
 * @example
 * ```typescript
 * const familyId = generateRefreshTokenFamily();
 * // Store with refresh token for rotation detection
 * ```
 */
export const generateRefreshTokenFamily = (): string => {
  return crypto.randomUUID();
};

/**
 * Hashes refresh token for secure storage.
 *
 * @param {string} token - Refresh token to hash
 * @returns {string} Token hash
 *
 * @example
 * ```typescript
 * const hash = hashRefreshToken(refreshToken);
 * // Store hash in database instead of plain token
 * ```
 */
export const hashRefreshToken = (token: string): string => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

/**
 * Verifies refresh token and returns payload.
 *
 * @param {string} token - Refresh token
 * @param {string} secret - Secret key
 * @returns {JWTPayload | null} Token payload or null if invalid
 *
 * @example
 * ```typescript
 * const payload = verifyRefreshToken(refreshToken, 'refresh-secret');
 * if (payload && payload.type === 'refresh') {
 *   // Issue new access token
 * }
 * ```
 */
export const verifyRefreshToken = (token: string, secret: string): JWTPayload | null => {
  const payload = verifyJWTToken(token, secret);
  if (!payload || payload.type !== 'refresh') return null;
  return payload;
};

// ============================================================================
// PASSPORT STRATEGY HELPERS
// ============================================================================

/**
 * Creates Passport JWT strategy options.
 *
 * @param {string} secret - JWT secret
 * @param {object} [options] - Additional options
 * @returns {object} Passport JWT strategy configuration
 *
 * @example
 * ```typescript
 * const strategyOptions = createPassportJWTOptions('secret-key', {
 *   issuer: 'white-cross',
 *   audience: 'white-cross-api'
 * });
 * ```
 */
export const createPassportJWTOptions = (
  secret: string,
  options?: { issuer?: string; audience?: string }
) => {
  return {
    jwtFromRequest: extractJWTFromHeader,
    secretOrKey: secret,
    issuer: options?.issuer,
    audience: options?.audience,
    ignoreExpiration: false,
  };
};

/**
 * Extracts JWT token from Authorization header.
 *
 * @param {any} request - HTTP request object
 * @returns {string | null} JWT token or null
 *
 * @example
 * ```typescript
 * const token = extractJWTFromHeader(request);
 * // Extracts from 'Authorization: Bearer <token>'
 * ```
 */
export const extractJWTFromHeader = (request: any): string | null => {
  const authHeader = request.headers?.authorization;
  if (!authHeader) return null;

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null;

  return parts[1];
};

/**
 * Extracts JWT token from cookie.
 *
 * @param {any} request - HTTP request object
 * @param {string} [cookieName] - Cookie name (default: 'access_token')
 * @returns {string | null} JWT token or null
 *
 * @example
 * ```typescript
 * const token = extractJWTFromCookie(request, 'auth_token');
 * ```
 */
export const extractJWTFromCookie = (
  request: any,
  cookieName: string = 'access_token'
): string | null => {
  return request.cookies?.[cookieName] || null;
};

/**
 * Creates basic authentication credentials from username and password.
 *
 * @param {string} username - Username
 * @param {string} password - Password
 * @returns {string} Base64 encoded credentials
 *
 * @example
 * ```typescript
 * const credentials = createBasicAuthCredentials('user', 'pass');
 * // Result: 'dXNlcjpwYXNz'
 * // Use in header: 'Authorization: Basic dXNlcjpwYXNz'
 * ```
 */
export const createBasicAuthCredentials = (username: string, password: string): string => {
  return Buffer.from(`${username}:${password}`).toString('base64');
};

/**
 * Parses basic authentication credentials from header.
 *
 * @param {string} authHeader - Authorization header value
 * @returns {object | null} Credentials object or null
 *
 * @example
 * ```typescript
 * const creds = parseBasicAuthCredentials('Basic dXNlcjpwYXNz');
 * // Result: { username: 'user', password: 'pass' }
 * ```
 */
export const parseBasicAuthCredentials = (
  authHeader: string
): { username: string; password: string } | null => {
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Basic') return null;

  try {
    const decoded = Buffer.from(parts[1], 'base64').toString('utf8');
    const [username, password] = decoded.split(':');
    return { username, password };
  } catch (error) {
    return null;
  }
};

// ============================================================================
// SESSION MANAGEMENT
// ============================================================================

/**
 * Creates a new session with metadata.
 *
 * @param {string} userId - User ID
 * @param {object} [metadata] - Additional session metadata
 * @returns {SessionData} Session data object
 *
 * @example
 * ```typescript
 * const session = createSession('user123', {
 *   ipAddress: '192.168.1.1',
 *   userAgent: 'Mozilla/5.0...'
 * });
 * ```
 */
export const createSession = (
  userId: string,
  metadata?: { ipAddress?: string; userAgent?: string; expiresIn?: number }
): SessionData => {
  const now = new Date();
  const expiresIn = metadata?.expiresIn || 86400000; // 24 hours default

  return {
    userId,
    createdAt: now,
    lastActivity: now,
    expiresAt: new Date(now.getTime() + expiresIn),
    ipAddress: metadata?.ipAddress,
    userAgent: metadata?.userAgent,
  };
};

/**
 * Generates a secure session ID.
 *
 * @param {number} [length] - Session ID length in bytes (default: 32)
 * @returns {string} Session ID
 *
 * @example
 * ```typescript
 * const sessionId = generateSessionId();
 * // Result: 64 character hex string
 * ```
 */
export const generateSessionId = (length: number = 32): string => {
  return crypto.randomBytes(length).toString('hex');
};

/**
 * Validates if session is still active.
 *
 * @param {SessionData} session - Session data
 * @returns {boolean} True if session is active
 *
 * @example
 * ```typescript
 * if (isSessionActive(session)) {
 *   // Allow access
 * } else {
 *   // Require re-authentication
 * }
 * ```
 */
export const isSessionActive = (session: SessionData): boolean => {
  return session.expiresAt > new Date();
};

/**
 * Updates session last activity timestamp.
 *
 * @param {SessionData} session - Session data
 * @returns {SessionData} Updated session data
 *
 * @example
 * ```typescript
 * const updated = updateSessionActivity(session);
 * ```
 */
export const updateSessionActivity = (session: SessionData): SessionData => {
  return {
    ...session,
    lastActivity: new Date(),
  };
};

/**
 * Extends session expiration time.
 *
 * @param {SessionData} session - Session data
 * @param {number} extensionMs - Extension time in milliseconds
 * @returns {SessionData} Extended session data
 *
 * @example
 * ```typescript
 * const extended = extendSession(session, 3600000); // Extend by 1 hour
 * ```
 */
export const extendSession = (session: SessionData, extensionMs: number): SessionData => {
  return {
    ...session,
    expiresAt: new Date(session.expiresAt.getTime() + extensionMs),
  };
};

// ============================================================================
// OAUTH 2.0 HELPERS
// ============================================================================

/**
 * Generates OAuth 2.0 authorization URL.
 *
 * @param {string} authorizationEndpoint - OAuth provider's authorization endpoint
 * @param {OAuth2Config} config - OAuth configuration
 * @returns {string} Authorization URL
 *
 * @example
 * ```typescript
 * const url = generateOAuth2AuthorizationUrl(
 *   'https://provider.com/oauth/authorize',
 *   {
 *     clientId: 'client123',
 *     redirectUri: 'https://app.com/callback',
 *     scope: ['read', 'write'],
 *     state: 'random-state'
 *   }
 * );
 * ```
 */
export const generateOAuth2AuthorizationUrl = (
  authorizationEndpoint: string,
  config: OAuth2Config
): string => {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    state: config.state || generateStateParameter(),
  });

  if (config.scope && config.scope.length > 0) {
    params.append('scope', config.scope.join(' '));
  }

  return `${authorizationEndpoint}?${params.toString()}`;
};

/**
 * Generates OAuth 2.0 state parameter for CSRF protection.
 *
 * @returns {string} Random state parameter
 *
 * @example
 * ```typescript
 * const state = generateStateParameter();
 * // Store in session and verify on callback
 * ```
 */
export const generateStateParameter = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Exchanges authorization code for access token (client credentials).
 *
 * @param {string} tokenEndpoint - OAuth provider's token endpoint
 * @param {string} code - Authorization code
 * @param {OAuth2Config} config - OAuth configuration
 * @returns {Promise<OAuth2TokenResponse>} Token response
 *
 * @example
 * ```typescript
 * const tokens = await exchangeCodeForToken(
 *   'https://provider.com/oauth/token',
 *   authCode,
 *   { clientId: '...', clientSecret: '...', redirectUri: '...' }
 * );
 * ```
 */
export const exchangeCodeForToken = async (
  tokenEndpoint: string,
  code: string,
  config: OAuth2Config
): Promise<OAuth2TokenResponse> => {
  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: config.redirectUri,
    client_id: config.clientId,
    client_secret: config.clientSecret,
  });

  const response = await fetch(tokenEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  return response.json();
};

/**
 * Requests access token using client credentials grant.
 *
 * @param {string} tokenEndpoint - OAuth provider's token endpoint
 * @param {string} clientId - Client ID
 * @param {string} clientSecret - Client secret
 * @param {string[]} [scope] - Requested scopes
 * @returns {Promise<OAuth2TokenResponse>} Token response
 *
 * @example
 * ```typescript
 * const tokens = await requestClientCredentialsToken(
 *   'https://provider.com/oauth/token',
 *   'client123',
 *   'secret456',
 *   ['read', 'write']
 * );
 * ```
 */
export const requestClientCredentialsToken = async (
  tokenEndpoint: string,
  clientId: string,
  clientSecret: string,
  scope?: string[]
): Promise<OAuth2TokenResponse> => {
  const params = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: clientId,
    client_secret: clientSecret,
  });

  if (scope && scope.length > 0) {
    params.append('scope', scope.join(' '));
  }

  const response = await fetch(tokenEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  return response.json();
};

/**
 * Refreshes OAuth 2.0 access token using refresh token.
 *
 * @param {string} tokenEndpoint - OAuth provider's token endpoint
 * @param {string} refreshToken - Refresh token
 * @param {string} clientId - Client ID
 * @param {string} clientSecret - Client secret
 * @returns {Promise<OAuth2TokenResponse>} Token response
 *
 * @example
 * ```typescript
 * const newTokens = await refreshOAuth2Token(
 *   'https://provider.com/oauth/token',
 *   refreshToken,
 *   'client123',
 *   'secret456'
 * );
 * ```
 */
export const refreshOAuth2Token = async (
  tokenEndpoint: string,
  refreshToken: string,
  clientId: string,
  clientSecret: string
): Promise<OAuth2TokenResponse> => {
  const params = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: clientId,
    client_secret: clientSecret,
  });

  const response = await fetch(tokenEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  return response.json();
};

// ============================================================================
// API KEY GENERATION AND VALIDATION
// ============================================================================

/**
 * Generates a secure API key.
 *
 * @param {ApiKeyConfig} [config] - API key configuration
 * @returns {string} Generated API key
 *
 * @example
 * ```typescript
 * const apiKey = generateApiKey({ prefix: 'wc_live_', length: 32 });
 * // Result: 'wc_live_a1b2c3d4e5f6...'
 * ```
 */
export const generateApiKey = (config?: ApiKeyConfig): string => {
  const length = config?.length || 32;
  const prefix = config?.prefix || '';
  const key = crypto.randomBytes(length).toString('hex');
  return `${prefix}${key}`;
};

/**
 * Validates API key format.
 *
 * @param {string} apiKey - API key to validate
 * @param {string} [expectedPrefix] - Expected prefix
 * @returns {boolean} True if valid format
 *
 * @example
 * ```typescript
 * const isValid = validateApiKeyFormat(apiKey, 'wc_live_');
 * ```
 */
export const validateApiKeyFormat = (apiKey: string, expectedPrefix?: string): boolean => {
  if (expectedPrefix && !apiKey.startsWith(expectedPrefix)) return false;
  const keyPart = expectedPrefix ? apiKey.slice(expectedPrefix.length) : apiKey;
  return /^[a-f0-9]+$/.test(keyPart) && keyPart.length >= 32;
};

/**
 * Hashes API key for secure storage.
 *
 * @param {string} apiKey - API key to hash
 * @returns {string} Hashed API key
 *
 * @example
 * ```typescript
 * const hash = hashApiKey(apiKey);
 * // Store hash in database, compare on requests
 * ```
 */
export const hashApiKey = (apiKey: string): string => {
  return crypto.createHash('sha256').update(apiKey).digest('hex');
};

/**
 * Verifies API key against stored hash.
 *
 * @param {string} apiKey - API key to verify
 * @param {string} storedHash - Stored hash to compare
 * @returns {boolean} True if API key matches hash
 *
 * @example
 * ```typescript
 * if (verifyApiKey(providedKey, storedHash)) {
 *   // Allow API access
 * }
 * ```
 */
export const verifyApiKey = (apiKey: string, storedHash: string): boolean => {
  const hash = hashApiKey(apiKey);
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(storedHash));
};

// ============================================================================
// MULTI-FACTOR AUTHENTICATION HELPERS
// ============================================================================

/**
 * Generates TOTP secret for 2FA setup.
 *
 * @returns {string} Base32 encoded secret
 *
 * @example
 * ```typescript
 * const secret = generateTOTPSecret();
 * // Use with QR code for authenticator app
 * ```
 */
export const generateTOTPSecret = (): string => {
  const buffer = crypto.randomBytes(20);
  return base32Encode(buffer);
};

/**
 * Generates TOTP code from secret (simulated).
 *
 * @param {string} secret - TOTP secret
 * @param {number} [step] - Time step in seconds (default: 30)
 * @returns {string} 6-digit TOTP code
 *
 * @example
 * ```typescript
 * const code = generateTOTPCode(secret);
 * // Result: '123456'
 * ```
 */
export const generateTOTPCode = (secret: string, step: number = 30): string => {
  const time = Math.floor(Date.now() / 1000 / step);
  const hmac = crypto.createHmac('sha1', base32Decode(secret));
  hmac.update(Buffer.from(time.toString(16).padStart(16, '0'), 'hex'));
  const hash = hmac.digest();
  const offset = hash[hash.length - 1] & 0xf;
  const code = ((hash[offset] & 0x7f) << 24 |
    (hash[offset + 1] & 0xff) << 16 |
    (hash[offset + 2] & 0xff) << 8 |
    (hash[offset + 3] & 0xff)) % 1000000;
  return code.toString().padStart(6, '0');
};

/**
 * Verifies TOTP code against secret (simulated).
 *
 * @param {string} code - TOTP code to verify
 * @param {string} secret - TOTP secret
 * @param {number} [window] - Time window tolerance (default: 1)
 * @returns {boolean} True if code is valid
 *
 * @example
 * ```typescript
 * if (verifyTOTPCode(userCode, secret, 1)) {
 *   // MFA verification successful
 * }
 * ```
 */
export const verifyTOTPCode = (
  code: string,
  secret: string,
  window: number = 1
): boolean => {
  for (let i = -window; i <= window; i++) {
    const time = Math.floor(Date.now() / 1000 / 30) + i;
    const expectedCode = generateTOTPCode(secret, 30);
    if (code === expectedCode) return true;
  }
  return false;
};

/**
 * Generates backup codes for 2FA recovery.
 *
 * @param {number} [count] - Number of backup codes (default: 10)
 * @returns {string[]} Array of backup codes
 *
 * @example
 * ```typescript
 * const backupCodes = generateBackupCodes(10);
 * // Result: ['A1B2-C3D4', 'E5F6-G7H8', ...]
 * ```
 */
export const generateBackupCodes = (count: number = 10): string[] => {
  const codes: string[] = [];
  for (let i = 0; i < count; i++) {
    const code = crypto.randomBytes(4).toString('hex').toUpperCase();
    codes.push(`${code.slice(0, 4)}-${code.slice(4, 8)}`);
  }
  return codes;
};

/**
 * Hashes backup code for storage.
 *
 * @param {string} code - Backup code
 * @returns {string} Hashed code
 *
 * @example
 * ```typescript
 * const hash = hashBackupCode('A1B2-C3D4');
 * // Store hashed version in database
 * ```
 */
export const hashBackupCode = (code: string): string => {
  return crypto.createHash('sha256').update(code.replace(/-/g, '')).digest('hex');
};

// ============================================================================
// PASSWORD STRENGTH VALIDATION
// ============================================================================

/**
 * Validates password strength with comprehensive checks.
 *
 * @param {string} password - Password to validate
 * @returns {PasswordStrengthResult} Validation result with score and feedback
 *
 * @example
 * ```typescript
 * const result = validatePasswordStrength('MyP@ssw0rd123');
 * // Result: { score: 4, isStrong: true, feedback: [] }
 * ```
 */
export const validatePasswordStrength = (password: string): PasswordStrengthResult => {
  let score = 0;
  const feedback: string[] = [];

  // Length check
  if (password.length >= 8) score++;
  else feedback.push('Password must be at least 8 characters');

  if (password.length >= 12) score++;
  else if (password.length >= 8) feedback.push('Consider using 12+ characters for better security');

  // Character variety
  if (/[a-z]/.test(password)) score++;
  else feedback.push('Include lowercase letters');

  if (/[A-Z]/.test(password)) score++;
  else feedback.push('Include uppercase letters');

  if (/\d/.test(password)) score++;
  else feedback.push('Include numbers');

  if (/[^A-Za-z0-9]/.test(password)) score++;
  else feedback.push('Include special characters');

  // Common patterns check
  if (/(.)\1{2,}/.test(password)) {
    score--;
    feedback.push('Avoid repeated characters');
  }

  if (/^(password|admin|user|12345)/i.test(password)) {
    score = 0;
    feedback.push('Avoid common passwords');
  }

  return {
    score: Math.max(0, Math.min(5, score)),
    isStrong: score >= 4,
    feedback,
  };
};

/**
 * Checks if password meets minimum requirements.
 *
 * @param {string} password - Password to check
 * @param {object} [requirements] - Custom requirements
 * @returns {boolean} True if password meets requirements
 *
 * @example
 * ```typescript
 * const isValid = checkPasswordRequirements('MyP@ss123', {
 *   minLength: 8,
 *   requireUppercase: true,
 *   requireNumbers: true
 * });
 * ```
 */
export const checkPasswordRequirements = (
  password: string,
  requirements?: {
    minLength?: number;
    requireUppercase?: boolean;
    requireLowercase?: boolean;
    requireNumbers?: boolean;
    requireSpecialChars?: boolean;
  }
): boolean => {
  const {
    minLength = 8,
    requireUppercase = true,
    requireLowercase = true,
    requireNumbers = true,
    requireSpecialChars = true,
  } = requirements || {};

  if (password.length < minLength) return false;
  if (requireUppercase && !/[A-Z]/.test(password)) return false;
  if (requireLowercase && !/[a-z]/.test(password)) return false;
  if (requireNumbers && !/\d/.test(password)) return false;
  if (requireSpecialChars && !/[^A-Za-z0-9]/.test(password)) return false;

  return true;
};

/**
 * Generates a strong random password.
 *
 * @param {number} [length] - Password length (default: 16)
 * @returns {string} Generated password
 *
 * @example
 * ```typescript
 * const password = generateStrongPassword(20);
 * // Result: 'aB3@xY9#mN2$pQ1&'
 * ```
 */
export const generateStrongPassword = (length: number = 16): string => {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  const allChars = uppercase + lowercase + numbers + special;

  const randomBytes = crypto.randomBytes(length);
  let password = '';

  // Ensure at least one of each character type
  password += uppercase[randomBytes[0] % uppercase.length];
  password += lowercase[randomBytes[1] % lowercase.length];
  password += numbers[randomBytes[2] % numbers.length];
  password += special[randomBytes[3] % special.length];

  // Fill remaining with random characters
  for (let i = 4; i < length; i++) {
    password += allChars[randomBytes[i] % allChars.length];
  }

  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
};

// ============================================================================
// BIOMETRIC AUTHENTICATION HELPERS
// ============================================================================

/**
 * Creates biometric authentication challenge.
 *
 * @returns {string} Random challenge for biometric verification
 *
 * @example
 * ```typescript
 * const challenge = createBiometricChallenge();
 * // Send to client for biometric signing
 * ```
 */
export const createBiometricChallenge = (): string => {
  return crypto.randomBytes(32).toString('base64');
};

/**
 * Enrolls biometric template (simulated).
 *
 * @param {string} userId - User ID
 * @param {string} biometricType - Type of biometric
 * @param {string} template - Biometric template data
 * @returns {BiometricAuthData} Enrollment data
 *
 * @example
 * ```typescript
 * const enrollment = enrollBiometric('user123', 'fingerprint', templateData);
 * ```
 */
export const enrollBiometric = (
  userId: string,
  biometricType: 'fingerprint' | 'face' | 'voice',
  template: string
): BiometricAuthData => {
  return {
    userId,
    biometricType,
    templateHash: crypto.createHash('sha256').update(template).digest('hex'),
    enrolledAt: new Date(),
  };
};

/**
 * Verifies biometric authentication (simulated).
 *
 * @param {string} template - Biometric template to verify
 * @param {string} storedHash - Stored template hash
 * @returns {boolean} True if biometric matches
 *
 * @example
 * ```typescript
 * if (verifyBiometric(scannedTemplate, storedHash)) {
 *   // Biometric authentication successful
 * }
 * ```
 */
export const verifyBiometric = (template: string, storedHash: string): boolean => {
  const templateHash = crypto.createHash('sha256').update(template).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(templateHash), Buffer.from(storedHash));
};

// ============================================================================
// SAML INTEGRATION HELPERS (PLACEHOLDER)
// ============================================================================

/**
 * Generates SAML authentication request (placeholder).
 *
 * @param {string} entityId - Service provider entity ID
 * @param {string} acsUrl - Assertion consumer service URL
 * @returns {string} SAML AuthnRequest XML
 *
 * @example
 * ```typescript
 * const samlRequest = generateSAMLRequest(
 *   'https://app.whitecross.com',
 *   'https://app.whitecross.com/saml/acs'
 * );
 * ```
 */
export const generateSAMLRequest = (entityId: string, acsUrl: string): string => {
  const requestId = crypto.randomUUID();
  const timestamp = new Date().toISOString();

  return `<?xml version="1.0"?>
<samlp:AuthnRequest xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol"
  ID="${requestId}"
  Version="2.0"
  IssueInstant="${timestamp}"
  AssertionConsumerServiceURL="${acsUrl}">
  <saml:Issuer xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion">${entityId}</saml:Issuer>
</samlp:AuthnRequest>`;
};

/**
 * Parses SAML response (placeholder).
 *
 * @param {string} samlResponse - Base64 encoded SAML response
 * @returns {object} Parsed SAML data
 *
 * @example
 * ```typescript
 * const userData = parseSAMLResponse(base64Response);
 * // Result: { userId: '...', attributes: {...} }
 * ```
 */
export const parseSAMLResponse = (samlResponse: string): any => {
  // This is a placeholder - actual implementation requires xml2js or similar
  const decoded = Buffer.from(samlResponse, 'base64').toString('utf8');
  return {
    userId: 'user123',
    attributes: {
      email: 'user@example.com',
      name: 'John Doe',
    },
  };
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Converts time string to seconds (e.g., '15m', '7d', '1h').
 *
 * @param {string} timeStr - Time string
 * @returns {number} Time in seconds
 */
const parseTimeToSeconds = (timeStr: string): number => {
  const units: Record<string, number> = {
    s: 1,
    m: 60,
    h: 3600,
    d: 86400,
  };

  const match = timeStr.match(/^(\d+)([smhd])$/);
  if (!match) return 900; // Default 15 minutes

  const [, value, unit] = match;
  return parseInt(value) * units[unit];
};

/**
 * Base64 URL encodes a string.
 *
 * @param {string} str - String to encode
 * @returns {string} Base64 URL encoded string
 */
const base64UrlEncode = (str: string): string => {
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
};

/**
 * Base64 URL decodes a string.
 *
 * @param {string} str - Base64 URL encoded string
 * @returns {string} Decoded string
 */
const base64UrlDecode = (str: string): string => {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  return Buffer.from(base64, 'base64').toString('utf8');
};

/**
 * Signs JWT using HMAC SHA-256.
 *
 * @param {string} data - Data to sign
 * @param {string} secret - Secret key
 * @returns {string} Signature
 */
const signJWT = (data: string, secret: string): string => {
  return crypto.createHmac('sha256', secret).update(data).digest('base64url');
};

/**
 * Base32 encodes buffer.
 *
 * @param {Buffer} buffer - Buffer to encode
 * @returns {string} Base32 string
 */
const base32Encode = (buffer: Buffer): string => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let bits = 0;
  let value = 0;
  let output = '';

  for (let i = 0; i < buffer.length; i++) {
    value = (value << 8) | buffer[i];
    bits += 8;

    while (bits >= 5) {
      output += alphabet[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }

  if (bits > 0) {
    output += alphabet[(value << (5 - bits)) & 31];
  }

  return output;
};

/**
 * Base32 decodes string to buffer.
 *
 * @param {string} str - Base32 string
 * @returns {Buffer} Decoded buffer
 */
const base32Decode = (str: string): Buffer => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let bits = 0;
  let value = 0;
  const output: number[] = [];

  for (let i = 0; i < str.length; i++) {
    const idx = alphabet.indexOf(str[i].toUpperCase());
    if (idx === -1) continue;

    value = (value << 5) | idx;
    bits += 5;

    if (bits >= 8) {
      output.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }

  return Buffer.from(output);
};

export default {
  // JWT tokens
  createJWTToken,
  verifyJWTToken,
  decodeJWTToken,
  isJWTExpired,
  getJWTTimeToExpiry,

  // Refresh tokens
  createRefreshToken,
  generateRefreshTokenFamily,
  hashRefreshToken,
  verifyRefreshToken,

  // Passport helpers
  createPassportJWTOptions,
  extractJWTFromHeader,
  extractJWTFromCookie,
  createBasicAuthCredentials,
  parseBasicAuthCredentials,

  // Session management
  createSession,
  generateSessionId,
  isSessionActive,
  updateSessionActivity,
  extendSession,

  // OAuth 2.0
  generateOAuth2AuthorizationUrl,
  generateStateParameter,
  exchangeCodeForToken,
  requestClientCredentialsToken,
  refreshOAuth2Token,

  // API keys
  generateApiKey,
  validateApiKeyFormat,
  hashApiKey,
  verifyApiKey,

  // MFA
  generateTOTPSecret,
  generateTOTPCode,
  verifyTOTPCode,
  generateBackupCodes,
  hashBackupCode,

  // Password strength
  validatePasswordStrength,
  checkPasswordRequirements,
  generateStrongPassword,

  // Biometric
  createBiometricChallenge,
  enrollBiometric,
  verifyBiometric,

  // SAML
  generateSAMLRequest,
  parseSAMLResponse,
};
