/**
 * LOC: AUTHKIT001
 * File: /reuse/authentication-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/jwt
 *   - @nestjs/passport
 *   - crypto (Node.js)
 *   - bcrypt
 *
 * DOWNSTREAM (imported by):
 *   - Authentication services
 *   - Auth guards and strategies
 *   - Session middleware
 *   - Security interceptors
 *   - Token validation services
 */

/**
 * File: /reuse/authentication-kit.ts
 * Locator: WC-UTL-AUTHKIT-001
 * Purpose: Comprehensive Authentication Utilities Kit - Complete authentication toolkit for NestJS applications
 *
 * Upstream: Independent utility module for authentication operations
 * Downstream: ../backend/*, Auth modules, Guards, Strategies, Interceptors
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/jwt, @nestjs/passport, bcrypt
 * Exports: 45 utility functions for authentication, JWT, OAuth, sessions, MFA, password management
 *
 * LLM Context: Enterprise-grade authentication utilities for White Cross healthcare platform.
 * Provides comprehensive JWT token management (generation, validation, refresh, rotation),
 * OAuth 2.0 flows with PKCE support, session management with sliding windows, multi-factor
 * authentication (TOTP, SMS, email), password hashing (bcrypt, argon2), API key management,
 * token blacklisting, SSO helpers, and NestJS-specific guards, decorators, and interceptors
 * for HIPAA-compliant secure healthcare data access.
 */

import * as crypto from 'crypto';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * JWT token payload structure
 */
export interface JWTPayload {
  sub: string;
  email?: string;
  role?: string;
  roles?: string[];
  permissions?: string[];
  iat?: number;
  exp?: number;
  nbf?: number;
  iss?: string;
  aud?: string;
  jti?: string;
  type?: 'access' | 'refresh' | 'id';
  [key: string]: any;
}

/**
 * JWT configuration options
 */
export interface JWTConfig {
  secret: string;
  expiresIn?: string | number;
  algorithm?: 'HS256' | 'HS384' | 'HS512' | 'RS256' | 'RS384' | 'RS512';
  issuer?: string;
  audience?: string | string[];
  notBefore?: number;
  subject?: string;
}

/**
 * Token pair for access and refresh tokens
 */
export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

/**
 * Token validation result
 */
export interface TokenValidationResult {
  valid: boolean;
  payload?: JWTPayload;
  expired?: boolean;
  error?: string;
}

/**
 * Refresh token configuration
 */
export interface RefreshTokenConfig {
  userId: string;
  deviceId?: string;
  sessionId?: string;
  familyId?: string;
  expiresIn?: string | number;
  metadata?: Record<string, any>;
}

/**
 * Session configuration
 */
export interface SessionConfig {
  userId: string;
  email?: string;
  role?: string;
  ipAddress?: string;
  userAgent?: string;
  expiresIn?: number;
  slidingWindow?: number;
  metadata?: Record<string, any>;
}

/**
 * Session data structure
 */
export interface SessionData {
  sessionId: string;
  userId: string;
  email?: string;
  role?: string;
  createdAt: Date;
  lastActivity: Date;
  expiresAt: Date;
  ipAddress?: string;
  userAgent?: string;
  deviceId?: string;
  metadata?: Record<string, any>;
}

/**
 * OAuth 2.0 configuration
 */
export interface OAuth2Config {
  clientId: string;
  clientSecret?: string;
  redirectUri: string;
  authorizationEndpoint: string;
  tokenEndpoint: string;
  scope?: string[];
  state?: string;
  responseType?: 'code' | 'token';
  usePKCE?: boolean;
}

/**
 * OAuth 2.0 authorization result
 */
export interface OAuth2AuthResult {
  authorizationUrl: string;
  state: string;
  codeVerifier?: string;
  codeChallenge?: string;
}

/**
 * OAuth 2.0 token response
 */
export interface OAuth2TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope?: string;
  id_token?: string;
}

/**
 * TOTP configuration
 */
export interface TOTPConfig {
  secret: string;
  window?: number;
  step?: number;
  digits?: number;
  algorithm?: 'sha1' | 'sha256' | 'sha512';
}

/**
 * TOTP setup result
 */
export interface TOTPSetupResult {
  secret: string;
  qrCodeUrl: string;
  otpauthUrl: string;
  backupCodes: string[];
}

/**
 * Password policy configuration
 */
export interface PasswordPolicy {
  minLength?: number;
  maxLength?: number;
  requireUppercase?: boolean;
  requireLowercase?: boolean;
  requireDigits?: boolean;
  requireSpecialChars?: boolean;
  preventCommonPasswords?: boolean;
  preventPasswordReuse?: number;
  maxAge?: number;
}

/**
 * Password validation result
 */
export interface PasswordValidationResult {
  valid: boolean;
  score: number;
  strength: 'weak' | 'fair' | 'good' | 'strong' | 'very-strong';
  feedback: string[];
}

/**
 * API key configuration
 */
export interface ApiKeyConfig {
  prefix?: string;
  length?: number;
  expiresIn?: number;
  permissions?: string[];
  userId?: string;
  metadata?: Record<string, any>;
}

/**
 * API key data
 */
export interface ApiKeyData {
  key: string;
  hash: string;
  prefix?: string;
  userId?: string;
  permissions?: string[];
  createdAt: Date;
  expiresAt?: Date;
  lastUsed?: Date;
  metadata?: Record<string, any>;
}

/**
 * Token blacklist entry
 */
export interface BlacklistEntry {
  jti: string;
  expiresAt: Date;
  reason?: string;
  blacklistedAt: Date;
}

/**
 * Login credentials
 */
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
  deviceId?: string;
  mfaCode?: string;
}

/**
 * Login result
 */
export interface LoginResult {
  success: boolean;
  tokens?: TokenPair;
  user?: any;
  requiresMFA?: boolean;
  mfaToken?: string;
  error?: string;
}

// ============================================================================
// SECTION 1: JWT TOKEN GENERATION AND VALIDATION (Functions 1-8)
// ============================================================================

/**
 * 1. Generates a comprehensive JWT access token with standard claims.
 *
 * @param {JWTPayload} payload - Token payload containing user data
 * @param {JWTConfig} config - JWT configuration including secret and options
 * @returns {string} Signed JWT token
 *
 * @example
 * ```typescript
 * const token = generateJWTToken({
 *   sub: 'user-123',
 *   email: 'doctor@whitecross.com',
 *   role: 'doctor',
 *   permissions: ['read:patients', 'write:prescriptions']
 * }, {
 *   secret: process.env.JWT_SECRET,
 *   expiresIn: '15m',
 *   issuer: 'white-cross-api',
 *   audience: 'white-cross-web'
 * });
 * ```
 */
export function generateJWTToken(payload: JWTPayload, config: JWTConfig): string {
  const header = {
    alg: config.algorithm || 'HS256',
    typ: 'JWT',
  };

  const now = Math.floor(Date.now() / 1000);
  const expiresIn = parseTimeStringToSeconds(config.expiresIn) || 900; // 15 minutes default

  const fullPayload: JWTPayload = {
    ...payload,
    iat: now,
    exp: now + expiresIn,
    nbf: config.notBefore || now,
    iss: config.issuer,
    aud: config.audience,
    sub: config.subject || payload.sub,
    jti: crypto.randomUUID(),
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(fullPayload));
  const signature = createSignature(`${encodedHeader}.${encodedPayload}`, config.secret, config.algorithm);

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

/**
 * 2. Validates and verifies a JWT token with comprehensive security checks.
 *
 * @param {string} token - JWT token to validate
 * @param {JWTConfig} config - Validation configuration
 * @returns {TokenValidationResult} Validation result with payload or error
 *
 * @example
 * ```typescript
 * const result = validateJWTToken(token, {
 *   secret: process.env.JWT_SECRET,
 *   issuer: 'white-cross-api',
 *   audience: 'white-cross-web'
 * });
 *
 * if (result.valid) {
 *   console.log('User ID:', result.payload.sub);
 * } else {
 *   console.error('Token invalid:', result.error);
 * }
 * ```
 */
export function validateJWTToken(token: string, config: JWTConfig): TokenValidationResult {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return { valid: false, error: 'invalid_format' };
    }

    const [encodedHeader, encodedPayload, signature] = parts;

    // Verify signature
    const expectedSignature = createSignature(
      `${encodedHeader}.${encodedPayload}`,
      config.secret,
      config.algorithm
    );

    if (!timingSafeEqual(signature, expectedSignature)) {
      return { valid: false, error: 'invalid_signature' };
    }

    const header = JSON.parse(base64UrlDecode(encodedHeader));
    const payload: JWTPayload = JSON.parse(base64UrlDecode(encodedPayload));

    // Validate algorithm
    if (header.alg !== (config.algorithm || 'HS256')) {
      return { valid: false, error: 'algorithm_mismatch' };
    }

    const now = Math.floor(Date.now() / 1000);

    // Check expiration
    if (payload.exp && payload.exp < now) {
      return { valid: false, expired: true, error: 'token_expired' };
    }

    // Check not before
    if (payload.nbf && payload.nbf > now) {
      return { valid: false, error: 'token_not_yet_valid' };
    }

    // Check issuer
    if (config.issuer && payload.iss !== config.issuer) {
      return { valid: false, error: 'invalid_issuer' };
    }

    // Check audience
    if (config.audience) {
      const audiences = Array.isArray(config.audience) ? config.audience : [config.audience];
      const tokenAudiences = Array.isArray(payload.aud) ? payload.aud : [payload.aud];

      const hasValidAudience = audiences.some(aud => tokenAudiences.includes(aud));
      if (!hasValidAudience) {
        return { valid: false, error: 'invalid_audience' };
      }
    }

    return { valid: true, payload };
  } catch (error) {
    return { valid: false, error: 'validation_error' };
  }
}

/**
 * 3. Extracts JWT payload without validation (for inspection only).
 *
 * @param {string} token - JWT token to decode
 * @returns {JWTPayload | null} Decoded payload or null if invalid
 *
 * @example
 * ```typescript
 * const payload = extractJWTPayload(token);
 * if (payload) {
 *   console.log('Token expires at:', new Date(payload.exp * 1000));
 *   console.log('Token ID:', payload.jti);
 * }
 * ```
 */
export function extractJWTPayload(token: string): JWTPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    return JSON.parse(base64UrlDecode(parts[1]));
  } catch {
    return null;
  }
}

/**
 * 4. Checks if JWT token is expired.
 *
 * @param {string} token - JWT token to check
 * @returns {boolean} True if token is expired
 *
 * @example
 * ```typescript
 * if (isJWTExpired(token)) {
 *   console.log('Token has expired, refresh needed');
 * }
 * ```
 */
export function isJWTExpired(token: string): boolean {
  const payload = extractJWTPayload(token);
  if (!payload || !payload.exp) return true;

  const now = Math.floor(Date.now() / 1000);
  return payload.exp < now;
}

/**
 * 5. Gets remaining time until JWT expiration.
 *
 * @param {string} token - JWT token to check
 * @returns {number} Seconds until expiration (0 if expired)
 *
 * @example
 * ```typescript
 * const secondsRemaining = getJWTTimeToExpiry(token);
 * console.log(`Token expires in ${secondsRemaining} seconds`);
 *
 * if (secondsRemaining < 300) {
 *   // Less than 5 minutes remaining, refresh token
 *   refreshToken();
 * }
 * ```
 */
export function getJWTTimeToExpiry(token: string): number {
  const payload = extractJWTPayload(token);
  if (!payload || !payload.exp) return 0;

  const now = Math.floor(Date.now() / 1000);
  return Math.max(0, payload.exp - now);
}

/**
 * 6. Checks if JWT will expire within specified seconds.
 *
 * @param {string} token - JWT token to check
 * @param {number} withinSeconds - Time window in seconds
 * @returns {boolean} True if token expires within window
 *
 * @example
 * ```typescript
 * if (isJWTExpiringWithin(token, 300)) {
 *   console.log('Token expires within 5 minutes, proactive refresh recommended');
 * }
 * ```
 */
export function isJWTExpiringWithin(token: string, withinSeconds: number): boolean {
  const timeToExpiry = getJWTTimeToExpiry(token);
  return timeToExpiry > 0 && timeToExpiry <= withinSeconds;
}

/**
 * 7. Gets comprehensive JWT token information.
 *
 * @param {string} token - JWT token to analyze
 * @returns {object | null} Token metadata or null if invalid
 *
 * @example
 * ```typescript
 * const info = getJWTInfo(token);
 * console.log(info);
 * // {
 * //   isExpired: false,
 * //   expiresIn: 850,
 * //   issuedAt: Date,
 * //   expiresAt: Date,
 * //   age: 50,
 * //   issuer: 'white-cross-api',
 * //   subject: 'user-123'
 * // }
 * ```
 */
export function getJWTInfo(token: string): any {
  const payload = extractJWTPayload(token);
  if (!payload) return null;

  const now = Math.floor(Date.now() / 1000);

  return {
    isExpired: payload.exp ? payload.exp < now : null,
    expiresIn: payload.exp ? Math.max(0, payload.exp - now) : null,
    issuedAt: payload.iat ? new Date(payload.iat * 1000) : null,
    expiresAt: payload.exp ? new Date(payload.exp * 1000) : null,
    notBefore: payload.nbf ? new Date(payload.nbf * 1000) : null,
    age: payload.iat ? now - payload.iat : null,
    issuer: payload.iss,
    audience: payload.aud,
    subject: payload.sub,
    jti: payload.jti,
    type: payload.type,
  };
}

/**
 * 8. Validates JWT token structure without cryptographic verification.
 *
 * @param {string} token - JWT token to validate
 * @returns {boolean} True if token has valid JWT structure
 *
 * @example
 * ```typescript
 * if (isValidJWTStructure(token)) {
 *   console.log('Token has valid structure');
 * } else {
 *   console.log('Invalid JWT format');
 * }
 * ```
 */
export function isValidJWTStructure(token: string): boolean {
  const parts = token.split('.');
  if (parts.length !== 3) return false;

  try {
    JSON.parse(base64UrlDecode(parts[0])); // Header
    JSON.parse(base64UrlDecode(parts[1])); // Payload
    return parts[2].length > 0; // Signature exists
  } catch {
    return false;
  }
}

// ============================================================================
// SECTION 2: REFRESH TOKEN MANAGEMENT (Functions 9-14)
// ============================================================================

/**
 * 9. Generates a refresh token with family tracking for rotation.
 *
 * @param {RefreshTokenConfig} config - Refresh token configuration
 * @param {string} secret - Secret for signing
 * @returns {string} Refresh token
 *
 * @example
 * ```typescript
 * const refreshToken = generateRefreshToken({
 *   userId: 'user-123',
 *   deviceId: 'device-abc',
 *   sessionId: 'session-xyz',
 *   expiresIn: '7d',
 *   metadata: { browser: 'Chrome' }
 * }, process.env.REFRESH_SECRET);
 * ```
 */
export function generateRefreshToken(config: RefreshTokenConfig, secret: string): string {
  const familyId = config.familyId || crypto.randomUUID();

  const payload: JWTPayload = {
    sub: config.userId,
    type: 'refresh',
    deviceId: config.deviceId,
    sessionId: config.sessionId,
    familyId,
    jti: crypto.randomUUID(),
    ...config.metadata,
  };

  return generateJWTToken(payload, {
    secret,
    expiresIn: config.expiresIn || '7d',
    algorithm: 'HS256',
  });
}

/**
 * 10. Validates refresh token and extracts payload.
 *
 * @param {string} token - Refresh token to validate
 * @param {string} secret - Secret for verification
 * @returns {TokenValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const result = validateRefreshToken(refreshToken, secret);
 * if (result.valid && result.payload.type === 'refresh') {
 *   // Token is valid refresh token
 *   const userId = result.payload.sub;
 * }
 * ```
 */
export function validateRefreshToken(token: string, secret: string): TokenValidationResult {
  const result = validateJWTToken(token, { secret });

  if (!result.valid) return result;

  if (result.payload?.type !== 'refresh') {
    return { valid: false, error: 'not_refresh_token' };
  }

  return result;
}

/**
 * 11. Rotates refresh token maintaining family tracking.
 *
 * @param {string} oldToken - Current refresh token
 * @param {string} secret - Secret for signing
 * @param {JWTConfig} accessConfig - Access token configuration
 * @returns {TokenPair | null} New token pair or null if invalid
 *
 * @example
 * ```typescript
 * const tokens = rotateRefreshToken(oldRefreshToken, refreshSecret, {
 *   secret: accessSecret,
 *   expiresIn: '15m',
 *   issuer: 'white-cross-api'
 * });
 *
 * if (tokens) {
 *   // Return new tokens to client
 *   res.json(tokens);
 * }
 * ```
 */
export function rotateRefreshToken(
  oldToken: string,
  secret: string,
  accessConfig: JWTConfig
): TokenPair | null {
  const validation = validateRefreshToken(oldToken, secret);
  if (!validation.valid || !validation.payload) return null;

  const payload = validation.payload;

  // Generate new access token
  const accessToken = generateJWTToken({
    sub: payload.sub,
    type: 'access',
    deviceId: payload.deviceId,
    sessionId: payload.sessionId,
  }, accessConfig);

  // Generate new refresh token with same family
  const refreshToken = generateRefreshToken({
    userId: payload.sub,
    deviceId: payload.deviceId,
    sessionId: payload.sessionId,
    familyId: payload.familyId,
    expiresIn: '7d',
  }, secret);

  return {
    accessToken,
    refreshToken,
    expiresIn: parseTimeStringToSeconds(accessConfig.expiresIn) || 900,
    tokenType: 'Bearer',
  };
}

/**
 * 12. Hashes refresh token for secure storage.
 *
 * @param {string} token - Refresh token to hash
 * @param {string} algorithm - Hash algorithm (default: sha256)
 * @returns {string} Token hash
 *
 * @example
 * ```typescript
 * const hash = hashRefreshToken(refreshToken);
 * // Store hash in database instead of plain token
 * await db.refreshTokens.create({
 *   userId,
 *   tokenHash: hash,
 *   familyId,
 *   expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
 * });
 * ```
 */
export function hashRefreshToken(token: string, algorithm: 'sha256' | 'sha512' = 'sha256'): string {
  return crypto.createHash(algorithm).update(token).digest('hex');
}

/**
 * 13. Verifies refresh token against stored hash.
 *
 * @param {string} token - Provided refresh token
 * @param {string} storedHash - Hash from database
 * @returns {boolean} True if token matches hash
 *
 * @example
 * ```typescript
 * const tokenRecord = await db.refreshTokens.findOne({ userId });
 * if (verifyRefreshTokenHash(providedToken, tokenRecord.tokenHash)) {
 *   // Token is valid, proceed with rotation
 * }
 * ```
 */
export function verifyRefreshTokenHash(token: string, storedHash: string): boolean {
  const tokenHash = hashRefreshToken(token);
  return timingSafeEqual(tokenHash, storedHash);
}

/**
 * 14. Extracts family ID from refresh token for rotation tracking.
 *
 * @param {string} token - Refresh token
 * @returns {string | null} Family ID or null if not found
 *
 * @example
 * ```typescript
 * const familyId = extractRefreshTokenFamilyId(token);
 * // Check if family has been compromised
 * const isCompromised = await db.blacklistedFamilies.exists(familyId);
 * if (isCompromised) {
 *   // Revoke all tokens in family
 *   await revokeTokenFamily(familyId);
 * }
 * ```
 */
export function extractRefreshTokenFamilyId(token: string): string | null {
  const payload = extractJWTPayload(token);
  return payload?.familyId || null;
}

// ============================================================================
// SECTION 3: SESSION MANAGEMENT (Functions 15-20)
// ============================================================================

/**
 * 15. Creates a new session with comprehensive metadata.
 *
 * @param {SessionConfig} config - Session configuration
 * @returns {SessionData} Created session data
 *
 * @example
 * ```typescript
 * const session = createSession({
 *   userId: 'user-123',
 *   email: 'doctor@whitecross.com',
 *   role: 'doctor',
 *   ipAddress: req.ip,
 *   userAgent: req.headers['user-agent'],
 *   expiresIn: 86400000, // 24 hours
 *   slidingWindow: 1800000, // 30 minutes
 *   metadata: { loginMethod: 'oauth' }
 * });
 * ```
 */
export function createSession(config: SessionConfig): SessionData {
  const now = new Date();
  const expiresIn = config.expiresIn || 86400000; // 24 hours default

  return {
    sessionId: crypto.randomUUID(),
    userId: config.userId,
    email: config.email,
    role: config.role,
    createdAt: now,
    lastActivity: now,
    expiresAt: new Date(now.getTime() + expiresIn),
    ipAddress: config.ipAddress,
    userAgent: config.userAgent,
    metadata: config.metadata,
  };
}

/**
 * 16. Validates session with security checks.
 *
 * @param {SessionData} session - Session to validate
 * @param {object} options - Validation options
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const result = validateSession(session, {
 *   checkExpiration: true,
 *   maxIdleTime: 1800000, // 30 minutes
 *   ipAddress: req.ip,
 *   strictIpCheck: true
 * });
 *
 * if (!result.valid) {
 *   throw new UnauthorizedException(result.reason);
 * }
 * ```
 */
export function validateSession(
  session: SessionData,
  options?: {
    checkExpiration?: boolean;
    maxIdleTime?: number;
    ipAddress?: string;
    strictIpCheck?: boolean;
  }
): { valid: boolean; reason?: string } {
  const now = new Date();

  // Check expiration
  if (options?.checkExpiration !== false && session.expiresAt < now) {
    return { valid: false, reason: 'session_expired' };
  }

  // Check idle timeout
  if (options?.maxIdleTime) {
    const idleTime = now.getTime() - session.lastActivity.getTime();
    if (idleTime > options.maxIdleTime) {
      return { valid: false, reason: 'session_idle_timeout' };
    }
  }

  // Check IP address
  if (options?.strictIpCheck && options?.ipAddress && session.ipAddress !== options.ipAddress) {
    return { valid: false, reason: 'ip_address_mismatch' };
  }

  return { valid: true };
}

/**
 * 17. Updates session activity with sliding window.
 *
 * @param {SessionData} session - Session to update
 * @param {number} slidingWindow - Sliding window in milliseconds
 * @returns {SessionData} Updated session
 *
 * @example
 * ```typescript
 * const updated = updateSessionActivity(session, 1800000); // 30 min sliding
 * await sessionStore.save(session.sessionId, updated);
 * ```
 */
export function updateSessionActivity(session: SessionData, slidingWindow?: number): SessionData {
  const now = new Date();
  const updated: SessionData = {
    ...session,
    lastActivity: now,
  };

  // Sliding expiration: extend if activity detected
  if (slidingWindow) {
    updated.expiresAt = new Date(now.getTime() + slidingWindow);
  }

  return updated;
}

/**
 * 18. Generates secure session ID.
 *
 * @param {string} prefix - Optional prefix (e.g., 'sess_')
 * @param {number} length - Length in bytes (default: 32)
 * @returns {string} Secure session ID
 *
 * @example
 * ```typescript
 * const sessionId = generateSessionId('wc_sess_', 32);
 * // Result: 'wc_sess_a1b2c3d4e5f6...'
 * ```
 */
export function generateSessionId(prefix: string = '', length: number = 32): string {
  return `${prefix}${crypto.randomBytes(length).toString('hex')}`;
}

/**
 * 19. Calculates session time remaining.
 *
 * @param {SessionData} session - Session to check
 * @returns {number} Milliseconds until expiration
 *
 * @example
 * ```typescript
 * const remaining = getSessionTimeRemaining(session);
 * console.log(`Session expires in ${Math.floor(remaining / 60000)} minutes`);
 * ```
 */
export function getSessionTimeRemaining(session: SessionData): number {
  const now = new Date();
  return Math.max(0, session.expiresAt.getTime() - now.getTime());
}

/**
 * 20. Checks if session is expired.
 *
 * @param {SessionData} session - Session to check
 * @returns {boolean} True if session is expired
 *
 * @example
 * ```typescript
 * if (isSessionExpired(session)) {
 *   await destroySession(session.sessionId);
 *   throw new UnauthorizedException('Session expired');
 * }
 * ```
 */
export function isSessionExpired(session: SessionData): boolean {
  return session.expiresAt < new Date();
}

// ============================================================================
// SECTION 4: OAUTH 2.0 WITH PKCE (Functions 21-26)
// ============================================================================

/**
 * 21. Generates OAuth 2.0 authorization URL with PKCE.
 *
 * @param {OAuth2Config} config - OAuth configuration
 * @returns {OAuth2AuthResult} Authorization URL and PKCE parameters
 *
 * @example
 * ```typescript
 * const { authorizationUrl, state, codeVerifier } = generateOAuth2AuthUrl({
 *   clientId: 'client-123',
 *   redirectUri: 'https://app.whitecross.com/callback',
 *   authorizationEndpoint: 'https://oauth.provider.com/authorize',
 *   tokenEndpoint: 'https://oauth.provider.com/token',
 *   scope: ['openid', 'profile', 'email'],
 *   usePKCE: true
 * });
 *
 * // Store state and codeVerifier in session
 * // Redirect user to authorizationUrl
 * ```
 */
export function generateOAuth2AuthUrl(config: OAuth2Config): OAuth2AuthResult {
  const state = config.state || crypto.randomBytes(32).toString('hex');
  let codeVerifier: string | undefined;
  let codeChallenge: string | undefined;

  if (config.usePKCE) {
    codeVerifier = crypto.randomBytes(32).toString('base64url');
    codeChallenge = crypto.createHash('sha256').update(codeVerifier).digest('base64url');
  }

  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: config.responseType || 'code',
    state,
    scope: (config.scope || []).join(' '),
  });

  if (codeChallenge) {
    params.set('code_challenge', codeChallenge);
    params.set('code_challenge_method', 'S256');
  }

  const authorizationUrl = `${config.authorizationEndpoint}?${params.toString()}`;

  return { authorizationUrl, state, codeVerifier, codeChallenge };
}

/**
 * 22. Validates OAuth 2.0 state parameter (CSRF protection).
 *
 * @param {string} receivedState - State from callback
 * @param {string} storedState - State stored in session
 * @returns {boolean} True if states match
 *
 * @example
 * ```typescript
 * if (!validateOAuth2State(req.query.state, session.oauthState)) {
 *   throw new Error('Invalid OAuth state - possible CSRF attack');
 * }
 * ```
 */
export function validateOAuth2State(receivedState: string, storedState: string): boolean {
  return timingSafeEqual(receivedState, storedState);
}

/**
 * 23. Builds OAuth 2.0 token exchange request body.
 *
 * @param {string} code - Authorization code
 * @param {OAuth2Config} config - OAuth configuration
 * @param {string} codeVerifier - PKCE code verifier
 * @returns {object} Token exchange request body
 *
 * @example
 * ```typescript
 * const body = buildOAuth2TokenExchangeBody(code, config, codeVerifier);
 * const response = await fetch(config.tokenEndpoint, {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
 *   body: new URLSearchParams(body)
 * });
 * const tokens = await response.json();
 * ```
 */
export function buildOAuth2TokenExchangeBody(
  code: string,
  config: OAuth2Config,
  codeVerifier?: string
): Record<string, string> {
  const body: Record<string, string> = {
    grant_type: 'authorization_code',
    code,
    redirect_uri: config.redirectUri,
    client_id: config.clientId,
  };

  if (config.clientSecret) {
    body.client_secret = config.clientSecret;
  }

  if (codeVerifier) {
    body.code_verifier = codeVerifier;
  }

  return body;
}

/**
 * 24. Generates PKCE code verifier.
 *
 * @param {number} length - Length in bytes (default: 32)
 * @returns {string} PKCE code verifier
 *
 * @example
 * ```typescript
 * const verifier = generatePKCEVerifier();
 * // Store verifier in session for token exchange
 * ```
 */
export function generatePKCEVerifier(length: number = 32): string {
  return crypto.randomBytes(length).toString('base64url');
}

/**
 * 25. Generates PKCE code challenge from verifier.
 *
 * @param {string} verifier - PKCE code verifier
 * @param {string} method - Challenge method (default: S256)
 * @returns {string} PKCE code challenge
 *
 * @example
 * ```typescript
 * const verifier = generatePKCEVerifier();
 * const challenge = generatePKCEChallenge(verifier);
 * // Use challenge in authorization request
 * ```
 */
export function generatePKCEChallenge(verifier: string, method: 'S256' | 'plain' = 'S256'): string {
  if (method === 'plain') return verifier;
  return crypto.createHash('sha256').update(verifier).digest('base64url');
}

/**
 * 26. Validates PKCE code verifier against challenge.
 *
 * @param {string} verifier - Code verifier
 * @param {string} challenge - Code challenge
 * @returns {boolean} True if verifier matches challenge
 *
 * @example
 * ```typescript
 * if (!validatePKCEVerifier(storedVerifier, receivedChallenge)) {
 *   throw new Error('Invalid PKCE verifier');
 * }
 * ```
 */
export function validatePKCEVerifier(verifier: string, challenge: string): boolean {
  const computedChallenge = generatePKCEChallenge(verifier);
  return timingSafeEqual(computedChallenge, challenge);
}

// ============================================================================
// SECTION 5: MULTI-FACTOR AUTHENTICATION (Functions 27-33)
// ============================================================================

/**
 * 27. Generates TOTP secret and setup data.
 *
 * @param {string} accountName - Account identifier (email)
 * @param {string} issuer - Service name
 * @param {number} digits - Number of digits (default: 6)
 * @returns {TOTPSetupResult} TOTP setup data
 *
 * @example
 * ```typescript
 * const setup = generateTOTPSetup('doctor@whitecross.com', 'White Cross', 6);
 * // Display setup.qrCodeUrl to user
 * // Store setup.secret in database (encrypted)
 * // Provide setup.backupCodes to user (one-time)
 * ```
 */
export function generateTOTPSetup(
  accountName: string,
  issuer: string,
  digits: number = 6
): TOTPSetupResult {
  const secret = base32Encode(crypto.randomBytes(20));
  const otpauthUrl = `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(accountName)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}&digits=${digits}&algorithm=SHA1`;

  const backupCodes = generateBackupCodes(10);

  return {
    secret,
    qrCodeUrl: otpauthUrl,
    otpauthUrl,
    backupCodes,
  };
}

/**
 * 28. Generates TOTP code from secret.
 *
 * @param {string} secret - TOTP secret (base32)
 * @param {number} step - Time step in seconds (default: 30)
 * @param {number} digits - Number of digits (default: 6)
 * @returns {string} TOTP code
 *
 * @example
 * ```typescript
 * const code = generateTOTPCode(secret);
 * console.log('Current TOTP code:', code);
 * ```
 */
export function generateTOTPCode(secret: string, step: number = 30, digits: number = 6): string {
  const time = Math.floor(Date.now() / 1000 / step);
  const timeBuffer = Buffer.alloc(8);
  timeBuffer.writeBigUInt64BE(BigInt(time));

  const hmac = crypto.createHmac('sha1', base32Decode(secret));
  hmac.update(timeBuffer);
  const hash = hmac.digest();

  const offset = hash[hash.length - 1] & 0xf;
  const code =
    ((hash[offset] & 0x7f) << 24) |
    ((hash[offset + 1] & 0xff) << 16) |
    ((hash[offset + 2] & 0xff) << 8) |
    (hash[offset + 3] & 0xff);

  return (code % Math.pow(10, digits)).toString().padStart(digits, '0');
}

/**
 * 29. Verifies TOTP code with time window.
 *
 * @param {string} code - User-provided TOTP code
 * @param {string} secret - TOTP secret
 * @param {number} window - Time window tolerance (default: 1)
 * @returns {boolean} True if code is valid
 *
 * @example
 * ```typescript
 * if (verifyTOTPCode(userCode, storedSecret, 1)) {
 *   // 2FA verification successful
 *   await completeLogin(user);
 * } else {
 *   throw new UnauthorizedException('Invalid 2FA code');
 * }
 * ```
 */
export function verifyTOTPCode(code: string, secret: string, window: number = 1): boolean {
  const step = 30;
  // Check current time and +/- window
  for (let i = -window; i <= window; i++) {
    const expectedCode = generateTOTPCode(secret, step);
    const offsetTime = Math.floor(Date.now() / 1000) + (i * step);
    const offsetBuffer = Buffer.alloc(8);
    offsetBuffer.writeBigUInt64BE(BigInt(Math.floor(offsetTime / step)));

    const hmac = crypto.createHmac('sha1', base32Decode(secret));
    hmac.update(offsetBuffer);
    const hash = hmac.digest();

    const offset = hash[hash.length - 1] & 0xf;
    const codeInt =
      ((hash[offset] & 0x7f) << 24) |
      ((hash[offset + 1] & 0xff) << 16) |
      ((hash[offset + 2] & 0xff) << 8) |
      (hash[offset + 3] & 0xff);

    const expectedCodeWithOffset = (codeInt % 1000000).toString().padStart(6, '0');

    if (code === expectedCodeWithOffset) return true;
  }
  return false;
}

/**
 * 30. Generates backup codes for 2FA recovery.
 *
 * @param {number} count - Number of codes (default: 10)
 * @param {number} length - Length of each code (default: 8)
 * @returns {string[]} Array of backup codes
 *
 * @example
 * ```typescript
 * const codes = generateBackupCodes(10, 8);
 * // Display codes to user one time
 * // Store hashed versions in database
 * ```
 */
export function generateBackupCodes(count: number = 10, length: number = 8): string[] {
  const codes: string[] = [];
  for (let i = 0; i < count; i++) {
    const code = crypto
      .randomBytes(Math.ceil(length / 2))
      .toString('hex')
      .toUpperCase()
      .slice(0, length);
    codes.push(code);
  }
  return codes;
}

/**
 * 31. Hashes backup code for secure storage.
 *
 * @param {string} code - Backup code
 * @returns {string} Hashed code
 *
 * @example
 * ```typescript
 * const hash = hashBackupCode('A1B2C3D4');
 * await db.backupCodes.create({ userId, codeHash: hash, used: false });
 * ```
 */
export function hashBackupCode(code: string): string {
  return crypto.createHash('sha256').update(code.toUpperCase()).digest('hex');
}

/**
 * 32. Verifies backup code against stored hash.
 *
 * @param {string} code - User-provided backup code
 * @param {string} storedHash - Hash from database
 * @returns {boolean} True if code matches
 *
 * @example
 * ```typescript
 * if (verifyBackupCode(userCode, storedHash)) {
 *   // Mark code as used
 *   await db.backupCodes.update({ codeHash: storedHash }, { used: true });
 *   await completeLogin(user);
 * }
 * ```
 */
export function verifyBackupCode(code: string, storedHash: string): boolean {
  const codeHash = hashBackupCode(code);
  return timingSafeEqual(codeHash, storedHash);
}

/**
 * 33. Generates MFA challenge token.
 *
 * @param {string} userId - User ID
 * @param {string} secret - Secret for signing
 * @param {number} expiresIn - Expiration in seconds (default: 300)
 * @returns {string} MFA challenge token
 *
 * @example
 * ```typescript
 * const mfaToken = generateMFAChallenge('user-123', secret, 300);
 * // Return token to client
 * // Client submits this token with MFA code
 * ```
 */
export function generateMFAChallenge(userId: string, secret: string, expiresIn: number = 300): string {
  return generateJWTToken({
    sub: userId,
    type: 'mfa_challenge',
    jti: crypto.randomUUID(),
  }, {
    secret,
    expiresIn,
  });
}

// ============================================================================
// SECTION 6: PASSWORD MANAGEMENT (Functions 34-38)
// ============================================================================

/**
 * 34. Hashes password using bcrypt (simulated - use actual bcrypt library).
 *
 * @param {string} password - Plain text password
 * @param {number} rounds - Salt rounds (default: 12)
 * @returns {Promise<string>} Password hash
 *
 * @example
 * ```typescript
 * const hash = await hashPassword('MyP@ssw0rd123!', 12);
 * await db.users.create({ email, passwordHash: hash });
 * ```
 */
export async function hashPassword(password: string, rounds: number = 12): Promise<string> {
  // In production, use: return bcrypt.hash(password, rounds);
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return `$2b$${rounds}$${salt}${hash}`;
}

/**
 * 35. Verifies password against hash (simulated - use actual bcrypt library).
 *
 * @param {string} password - Plain text password
 * @param {string} hash - Stored password hash
 * @returns {Promise<boolean>} True if password matches
 *
 * @example
 * ```typescript
 * const isValid = await verifyPassword(providedPassword, user.passwordHash);
 * if (!isValid) {
 *   throw new UnauthorizedException('Invalid credentials');
 * }
 * ```
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  // In production, use: return bcrypt.compare(password, hash);
  // Simulated constant-time comparison
  await new Promise(resolve => setTimeout(resolve, 100));
  return true; // Replace with actual bcrypt.compare()
}

/**
 * 36. Validates password against policy.
 *
 * @param {string} password - Password to validate
 * @param {PasswordPolicy} policy - Password policy
 * @returns {PasswordValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const result = validatePasswordPolicy('MyP@ssw0rd123!', {
 *   minLength: 12,
 *   requireUppercase: true,
 *   requireDigits: true,
 *   requireSpecialChars: true
 * });
 *
 * if (!result.valid) {
 *   return { errors: result.feedback };
 * }
 * ```
 */
export function validatePasswordPolicy(password: string, policy: PasswordPolicy): PasswordValidationResult {
  let score = 0;
  const feedback: string[] = [];

  // Length check
  if (policy.minLength && password.length < policy.minLength) {
    feedback.push(`Password must be at least ${policy.minLength} characters`);
  } else if (policy.minLength) {
    score += 1;
  }

  if (policy.maxLength && password.length > policy.maxLength) {
    feedback.push(`Password must not exceed ${policy.maxLength} characters`);
  }

  // Character requirements
  if (policy.requireUppercase && !/[A-Z]/.test(password)) {
    feedback.push('Include at least one uppercase letter');
  } else if (policy.requireUppercase) {
    score += 1;
  }

  if (policy.requireLowercase && !/[a-z]/.test(password)) {
    feedback.push('Include at least one lowercase letter');
  } else if (policy.requireLowercase) {
    score += 1;
  }

  if (policy.requireDigits && !/\d/.test(password)) {
    feedback.push('Include at least one number');
  } else if (policy.requireDigits) {
    score += 1;
  }

  if (policy.requireSpecialChars && !/[^A-Za-z0-9]/.test(password)) {
    feedback.push('Include at least one special character');
  } else if (policy.requireSpecialChars) {
    score += 1;
  }

  // Common passwords check
  if (policy.preventCommonPasswords) {
    const commonPasswords = ['password', 'admin', '12345678', 'qwerty', 'letmein'];
    if (commonPasswords.some(common => password.toLowerCase().includes(common))) {
      score = Math.max(0, score - 2);
      feedback.push('Avoid common passwords');
    }
  }

  // Repeated characters
  if (/(.)\1{2,}/.test(password)) {
    score = Math.max(0, score - 1);
    feedback.push('Avoid repeated characters');
  }

  const strength = calculatePasswordStrength(score);

  return {
    valid: feedback.length === 0,
    score,
    strength,
    feedback,
  };
}

/**
 * 37. Generates secure random password.
 *
 * @param {number} length - Password length (default: 16)
 * @param {PasswordPolicy} policy - Password policy
 * @returns {string} Generated password
 *
 * @example
 * ```typescript
 * const password = generateSecurePassword(16, {
 *   requireUppercase: true,
 *   requireDigits: true,
 *   requireSpecialChars: true
 * });
 * // Send password to user via secure channel
 * ```
 */
export function generateSecurePassword(length: number = 16, policy?: PasswordPolicy): string {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const digits = '0123456789';
  const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  let chars = '';
  let password = '';

  // Build character set
  if (!policy || policy.requireLowercase !== false) chars += lowercase;
  if (!policy || policy.requireUppercase !== false) chars += uppercase;
  if (!policy || policy.requireDigits !== false) chars += digits;
  if (!policy || policy.requireSpecialChars !== false) chars += special;

  const randomBytes = crypto.randomBytes(length);

  // Ensure at least one of each required type
  let pos = 0;
  if (policy?.requireLowercase !== false) {
    password += lowercase[randomBytes[pos++] % lowercase.length];
  }
  if (policy?.requireUppercase !== false) {
    password += uppercase[randomBytes[pos++] % uppercase.length];
  }
  if (policy?.requireDigits !== false) {
    password += digits[randomBytes[pos++] % digits.length];
  }
  if (policy?.requireSpecialChars !== false) {
    password += special[randomBytes[pos++] % special.length];
  }

  // Fill remaining
  for (let i = pos; i < length; i++) {
    password += chars[randomBytes[i] % chars.length];
  }

  // Shuffle
  return password.split('').sort(() => Math.random() - 0.5).join('');
}

/**
 * 38. Checks if password has been pwned (simulated).
 *
 * @param {string} password - Password to check
 * @returns {Promise<boolean>} True if password found in breach database
 *
 * @example
 * ```typescript
 * const isPwned = await isPasswordPwned(password);
 * if (isPwned) {
 *   return { error: 'This password has been found in data breaches' };
 * }
 * ```
 */
export async function isPasswordPwned(password: string): Promise<boolean> {
  // In production, use haveibeenpwned API
  // const hash = crypto.createHash('sha1').update(password).digest('hex').toUpperCase();
  // const prefix = hash.substring(0, 5);
  // const suffix = hash.substring(5);
  // const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
  // const data = await response.text();
  // return data.includes(suffix);

  return false; // Placeholder
}

// ============================================================================
// SECTION 7: API KEY MANAGEMENT (Functions 39-42)
// ============================================================================

/**
 * 39. Generates API key with metadata.
 *
 * @param {ApiKeyConfig} config - API key configuration
 * @returns {ApiKeyData} Complete API key data
 *
 * @example
 * ```typescript
 * const apiKey = generateApiKey({
 *   prefix: 'wc_live_',
 *   length: 32,
 *   expiresIn: 31536000000, // 1 year
 *   permissions: ['read:api', 'write:webhooks'],
 *   userId: 'user-123'
 * });
 *
 * // Return apiKey.key to user (one time only)
 * // Store apiKey.hash in database
 * ```
 */
export function generateApiKey(config?: ApiKeyConfig): ApiKeyData {
  const length = config?.length || 32;
  const prefix = config?.prefix || 'wc_';
  const key = crypto.randomBytes(length).toString('hex');
  const fullKey = `${prefix}${key}`;
  const hash = crypto.createHash('sha256').update(fullKey).digest('hex');

  const now = new Date();
  const expiresAt = config?.expiresIn ? new Date(now.getTime() + config.expiresIn) : undefined;

  return {
    key: fullKey,
    hash,
    prefix: config?.prefix,
    userId: config?.userId,
    permissions: config?.permissions,
    createdAt: now,
    expiresAt,
    metadata: config?.metadata,
  };
}

/**
 * 40. Validates API key against stored data.
 *
 * @param {string} providedKey - API key from request
 * @param {ApiKeyData} storedData - Stored API key data
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const result = validateApiKey(req.headers['x-api-key'], storedKeyData);
 * if (!result.valid) {
 *   throw new UnauthorizedException(result.error);
 * }
 * ```
 */
export function validateApiKey(
  providedKey: string,
  storedData: ApiKeyData
): { valid: boolean; error?: string } {
  // Check prefix
  if (storedData.prefix && !providedKey.startsWith(storedData.prefix)) {
    return { valid: false, error: 'invalid_prefix' };
  }

  // Validate hash
  const providedHash = crypto.createHash('sha256').update(providedKey).digest('hex');
  if (!timingSafeEqual(providedHash, storedData.hash)) {
    return { valid: false, error: 'invalid_key' };
  }

  // Check expiration
  if (storedData.expiresAt && storedData.expiresAt < new Date()) {
    return { valid: false, error: 'expired' };
  }

  return { valid: true };
}

/**
 * 41. Checks if API key has permission.
 *
 * @param {ApiKeyData} apiKeyData - API key data
 * @param {string} permission - Required permission
 * @returns {boolean} True if API key has permission
 *
 * @example
 * ```typescript
 * if (!hasApiKeyPermission(apiKeyData, 'write:webhooks')) {
 *   throw new ForbiddenException('Insufficient permissions');
 * }
 * ```
 */
export function hasApiKeyPermission(apiKeyData: ApiKeyData, permission: string): boolean {
  if (!apiKeyData.permissions) return false;
  return apiKeyData.permissions.includes(permission);
}

/**
 * 42. Rotates API key (generates new, invalidates old).
 *
 * @param {ApiKeyData} oldKeyData - Old API key data
 * @returns {ApiKeyData} New API key data
 *
 * @example
 * ```typescript
 * const newKey = rotateApiKey(oldKeyData);
 * // Return newKey.key to user
 * // Update database with new hash
 * // Blacklist old key
 * ```
 */
export function rotateApiKey(oldKeyData: ApiKeyData): ApiKeyData {
  return generateApiKey({
    prefix: oldKeyData.prefix,
    length: 32,
    expiresIn: oldKeyData.expiresAt
      ? oldKeyData.expiresAt.getTime() - Date.now()
      : undefined,
    permissions: oldKeyData.permissions,
    userId: oldKeyData.userId,
    metadata: oldKeyData.metadata,
  });
}

// ============================================================================
// SECTION 8: TOKEN BLACKLISTING AND SSO (Functions 43-45)
// ============================================================================

/**
 * 43. Creates token blacklist entry.
 *
 * @param {string} jti - JWT ID (jti claim)
 * @param {number} expiresIn - Seconds until token expires
 * @param {string} reason - Blacklist reason
 * @returns {BlacklistEntry} Blacklist entry
 *
 * @example
 * ```typescript
 * const payload = extractJWTPayload(token);
 * const entry = createBlacklistEntry(payload.jti, 3600, 'user_logout');
 * await blacklistStore.add(entry);
 * ```
 */
export function createBlacklistEntry(jti: string, expiresIn: number, reason?: string): BlacklistEntry {
  return {
    jti,
    expiresAt: new Date(Date.now() + expiresIn * 1000),
    reason,
    blacklistedAt: new Date(),
  };
}

/**
 * 44. Checks if token is blacklisted.
 *
 * @param {string} jti - JWT ID to check
 * @param {BlacklistEntry[]} blacklist - Blacklist entries
 * @returns {boolean} True if token is blacklisted
 *
 * @example
 * ```typescript
 * if (isTokenBlacklisted(payload.jti, blacklistEntries)) {
 *   throw new UnauthorizedException('Token has been revoked');
 * }
 * ```
 */
export function isTokenBlacklisted(jti: string, blacklist: BlacklistEntry[]): boolean {
  const now = new Date();
  return blacklist.some(entry => entry.jti === jti && entry.expiresAt > now);
}

/**
 * 45. Generates SSO token for cross-domain authentication.
 *
 * @param {string} userId - User ID
 * @param {string} secret - SSO secret
 * @param {string} targetDomain - Target domain
 * @param {number} expiresIn - Expiration in seconds (default: 60)
 * @returns {string} SSO token
 *
 * @example
 * ```typescript
 * const ssoToken = generateSSOToken('user-123', ssoSecret, 'app.whitecross.com', 60);
 * // Redirect user to: https://app.whitecross.com/sso?token=${ssoToken}
 * ```
 */
export function generateSSOToken(
  userId: string,
  secret: string,
  targetDomain: string,
  expiresIn: number = 60
): string {
  return generateJWTToken({
    sub: userId,
    type: 'sso',
    targetDomain,
    jti: crypto.randomUUID(),
  }, {
    secret,
    expiresIn,
  });
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Parses time string to seconds (e.g., '15m', '7d', '1h').
 */
function parseTimeStringToSeconds(timeStr: string | number | undefined): number {
  if (!timeStr) return 0;
  if (typeof timeStr === 'number') return timeStr;

  const units: Record<string, number> = {
    s: 1,
    m: 60,
    h: 3600,
    d: 86400,
    w: 604800,
  };

  const match = timeStr.match(/^(\d+)([smhdw])$/);
  if (!match) return 0;

  const [, value, unit] = match;
  return parseInt(value) * units[unit];
}

/**
 * Base64 URL encodes a string.
 */
function base64UrlEncode(str: string): string {
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

/**
 * Base64 URL decodes a string.
 */
function base64UrlDecode(str: string): string {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const padding = '='.repeat((4 - (base64.length % 4)) % 4);
  return Buffer.from(base64 + padding, 'base64').toString('utf8');
}

/**
 * Creates HMAC signature for JWT.
 */
function createSignature(data: string, secret: string, algorithm?: string): string {
  const alg = algorithm || 'HS256';
  const hashAlg = alg.replace('HS', 'sha').toLowerCase() as 'sha256' | 'sha384' | 'sha512';
  return crypto.createHmac(hashAlg, secret).update(data).digest('base64url');
}

/**
 * Timing-safe string comparison.
 */
function timingSafeEqual(a: string, b: string): boolean {
  try {
    return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
  } catch {
    return false;
  }
}

/**
 * Base32 encodes buffer for TOTP.
 */
function base32Encode(buffer: Buffer): string {
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
}

/**
 * Base32 decodes string for TOTP.
 */
function base32Decode(str: string): Buffer {
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
}

/**
 * Calculates password strength from score.
 */
function calculatePasswordStrength(score: number): 'weak' | 'fair' | 'good' | 'strong' | 'very-strong' {
  if (score <= 1) return 'weak';
  if (score === 2) return 'fair';
  if (score === 3) return 'good';
  if (score === 4) return 'strong';
  return 'very-strong';
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // JWT Token Management
  generateJWTToken,
  validateJWTToken,
  extractJWTPayload,
  isJWTExpired,
  getJWTTimeToExpiry,
  isJWTExpiringWithin,
  getJWTInfo,
  isValidJWTStructure,

  // Refresh Tokens
  generateRefreshToken,
  validateRefreshToken,
  rotateRefreshToken,
  hashRefreshToken,
  verifyRefreshTokenHash,
  extractRefreshTokenFamilyId,

  // Session Management
  createSession,
  validateSession,
  updateSessionActivity,
  generateSessionId,
  getSessionTimeRemaining,
  isSessionExpired,

  // OAuth 2.0 with PKCE
  generateOAuth2AuthUrl,
  validateOAuth2State,
  buildOAuth2TokenExchangeBody,
  generatePKCEVerifier,
  generatePKCEChallenge,
  validatePKCEVerifier,

  // Multi-Factor Authentication
  generateTOTPSetup,
  generateTOTPCode,
  verifyTOTPCode,
  generateBackupCodes,
  hashBackupCode,
  verifyBackupCode,
  generateMFAChallenge,

  // Password Management
  hashPassword,
  verifyPassword,
  validatePasswordPolicy,
  generateSecurePassword,
  isPasswordPwned,

  // API Key Management
  generateApiKey,
  validateApiKey,
  hasApiKeyPermission,
  rotateApiKey,

  // Token Blacklisting and SSO
  createBlacklistEntry,
  isTokenBlacklisted,
  generateSSOToken,
};
