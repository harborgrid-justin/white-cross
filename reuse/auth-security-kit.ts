/**
 * LOC: AUTHSEC1234567
 * File: /reuse/auth-security-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - NestJS authentication services
 *   - Authorization guards
 *   - Security middleware
 *   - RBAC implementations
 *   - Permission systems
 */

/**
 * File: /reuse/auth-security-kit.ts
 * Locator: WC-UTL-AUTHSEC-001
 * Purpose: Comprehensive Authentication & Security Kit - Complete auth/authz toolkit for NestJS
 *
 * Upstream: Independent utility module for authentication and authorization operations
 * Downstream: ../backend/*, Auth services, Guards, Interceptors, Passport strategies, RBAC modules
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/jwt, @nestjs/passport, bcrypt
 * Exports: 45+ utility functions for JWT, OAuth, sessions, MFA, RBAC, permissions, API keys, security headers
 *
 * LLM Context: Enterprise-grade authentication and authorization utilities for White Cross healthcare platform.
 * Provides comprehensive JWT management, OAuth 2.0 flows, session handling, multi-factor authentication,
 * role-based access control (RBAC), permission systems, API key management, security headers, rate limiting,
 * and HIPAA-compliant authentication patterns for secure healthcare data access.
 */

import * as crypto from 'crypto';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface JWTPayload {
  sub: string;
  email?: string;
  role?: string;
  roles?: string[];
  permissions?: string[];
  iat?: number;
  exp?: number;
  iss?: string;
  aud?: string;
  [key: string]: any;
}

interface JWTConfig {
  secret: string;
  expiresIn?: string | number;
  algorithm?: 'HS256' | 'HS384' | 'HS512' | 'RS256';
  issuer?: string;
  audience?: string;
  notBefore?: number;
}

interface RefreshTokenConfig {
  userId: string;
  deviceId?: string;
  sessionId?: string;
  familyId?: string;
  expiresIn?: string | number;
  metadata?: Record<string, any>;
}

interface SessionConfig {
  userId: string;
  ipAddress?: string;
  userAgent?: string;
  expiresIn?: number;
  metadata?: Record<string, any>;
}

interface SessionData {
  sessionId: string;
  userId: string;
  createdAt: Date;
  lastActivity: Date;
  expiresAt: Date;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
}

interface OAuth2Config {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scope?: string[];
  state?: string;
  responseType?: 'code' | 'token';
  grantType?: 'authorization_code' | 'client_credentials' | 'refresh_token' | 'password';
}

interface OAuth2TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope?: string;
  id_token?: string;
}

interface ApiKeyConfig {
  prefix?: string;
  length?: number;
  expiresIn?: number;
  permissions?: string[];
  metadata?: Record<string, any>;
}

interface ApiKeyData {
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

interface MFAConfig {
  secret: string;
  window?: number;
  step?: number;
  algorithm?: 'sha1' | 'sha256' | 'sha512';
}

interface TOTPResult {
  secret: string;
  qrCode: string;
  uri: string;
}

interface RolePermissions {
  role: string;
  permissions: string[];
  inherits?: string[];
}

interface PermissionCheck {
  resource: string;
  action: string;
  context?: Record<string, any>;
}

interface AccessControlList {
  userId: string;
  roles: string[];
  permissions: string[];
  deniedPermissions?: string[];
}

interface SecurityHeaders {
  'Strict-Transport-Security'?: string;
  'X-Content-Type-Options'?: string;
  'X-Frame-Options'?: string;
  'X-XSS-Protection'?: string;
  'Content-Security-Policy'?: string;
  'Referrer-Policy'?: string;
  'Permissions-Policy'?: string;
}

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  identifier?: string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

interface RateLimitStatus {
  remaining: number;
  limit: number;
  resetAt: Date;
  retryAfter?: number;
}

interface PasswordPolicy {
  minLength?: number;
  maxLength?: number;
  requireUppercase?: boolean;
  requireLowercase?: boolean;
  requireNumbers?: boolean;
  requireSpecialChars?: boolean;
  preventCommon?: boolean;
  preventReuse?: number;
  maxAge?: number;
}

interface PasswordValidationResult {
  isValid: boolean;
  score: number;
  strength: 'weak' | 'fair' | 'good' | 'strong' | 'very-strong';
  feedback: string[];
  metadata?: Record<string, any>;
}

// ============================================================================
// JWT TOKEN CREATION AND VALIDATION
// ============================================================================

/**
 * Creates a comprehensive JWT access token with all standard and custom claims.
 *
 * @param {JWTPayload} payload - Token payload with user data
 * @param {JWTConfig} config - JWT configuration with security settings
 * @returns {string} Signed JWT token
 *
 * @example
 * ```typescript
 * const token = createComprehensiveJWT(
 *   {
 *     sub: 'user123',
 *     email: 'doctor@whitecross.com',
 *     role: 'doctor',
 *     permissions: ['read:patients', 'write:prescriptions']
 *   },
 *   {
 *     secret: process.env.JWT_SECRET,
 *     expiresIn: '15m',
 *     issuer: 'white-cross-api',
 *     audience: 'white-cross-frontend',
 *     algorithm: 'HS256'
 *   }
 * );
 * ```
 */
export const createComprehensiveJWT = (payload: JWTPayload, config: JWTConfig): string => {
  const header = {
    alg: config.algorithm || 'HS256',
    typ: 'JWT',
  };

  const now = Math.floor(Date.now() / 1000);
  const exp = config.expiresIn
    ? now + (typeof config.expiresIn === 'string' ? parseTimeToSeconds(config.expiresIn) : config.expiresIn)
    : now + 900; // 15 minutes default

  const fullPayload: JWTPayload = {
    ...payload,
    iat: now,
    exp,
    iss: config.issuer,
    aud: config.audience,
    nbf: config.notBefore || now,
    jti: crypto.randomUUID(), // JWT ID for tracking
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(fullPayload));
  const signature = signJWT(`${encodedHeader}.${encodedPayload}`, config.secret, config.algorithm);

  return `${encodedHeader}.${encodedPayload}.${signature}`;
};

/**
 * Verifies JWT token with comprehensive validation checks.
 *
 * @param {string} token - JWT token to verify
 * @param {JWTConfig} config - Verification configuration
 * @returns {JWTPayload | null} Decoded payload or null if invalid
 *
 * @example
 * ```typescript
 * const payload = verifyComprehensiveJWT(token, {
 *   secret: process.env.JWT_SECRET,
 *   issuer: 'white-cross-api',
 *   audience: 'white-cross-frontend'
 * });
 * if (payload) {
 *   console.log('User:', payload.sub, 'Role:', payload.role);
 * }
 * ```
 */
export const verifyComprehensiveJWT = (
  token: string,
  config: JWTConfig
): JWTPayload | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [encodedHeader, encodedPayload, signature] = parts;
    const expectedSignature = signJWT(
      `${encodedHeader}.${encodedPayload}`,
      config.secret,
      config.algorithm
    );

    // Timing-safe comparison to prevent timing attacks
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      return null;
    }

    const header = JSON.parse(base64UrlDecode(encodedHeader));
    const payload: JWTPayload = JSON.parse(base64UrlDecode(encodedPayload));

    // Validate algorithm
    if (header.alg !== (config.algorithm || 'HS256')) return null;

    const now = Math.floor(Date.now() / 1000);

    // Check expiration
    if (payload.exp && payload.exp < now) return null;

    // Check not before
    if (payload.nbf && payload.nbf > now) return null;

    // Check issuer
    if (config.issuer && payload.iss !== config.issuer) return null;

    // Check audience
    if (config.audience && payload.aud !== config.audience) return null;

    return payload;
  } catch (error) {
    return null;
  }
};

/**
 * Extracts JWT claims without verification (for inspection only).
 *
 * @param {string} token - JWT token to decode
 * @returns {JWTPayload | null} Decoded payload or null if invalid format
 *
 * @example
 * ```typescript
 * const claims = extractJWTClaims(token);
 * console.log('Expires at:', new Date(claims.exp * 1000));
 * console.log('Issued at:', new Date(claims.iat * 1000));
 * ```
 */
export const extractJWTClaims = (token: string): JWTPayload | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    return JSON.parse(base64UrlDecode(parts[1]));
  } catch (error) {
    return null;
  }
};

/**
 * Validates JWT token structure and format without verification.
 *
 * @param {string} token - JWT token to validate
 * @returns {boolean} True if token has valid structure
 *
 * @example
 * ```typescript
 * if (validateJWTStructure(token)) {
 *   console.log('Token has valid JWT structure');
 * }
 * ```
 */
export const validateJWTStructure = (token: string): boolean => {
  const parts = token.split('.');
  if (parts.length !== 3) return false;

  try {
    JSON.parse(base64UrlDecode(parts[0])); // Header
    JSON.parse(base64UrlDecode(parts[1])); // Payload
    return parts[2].length > 0; // Signature exists
  } catch {
    return false;
  }
};

/**
 * Checks if JWT token will expire within specified seconds.
 *
 * @param {string} token - JWT token to check
 * @param {number} withinSeconds - Time window in seconds
 * @returns {boolean} True if token expires within window
 *
 * @example
 * ```typescript
 * if (isJWTExpiringWithin(token, 300)) {
 *   console.log('Token expires in less than 5 minutes, refresh needed');
 * }
 * ```
 */
export const isJWTExpiringWithin = (token: string, withinSeconds: number): boolean => {
  const payload = extractJWTClaims(token);
  if (!payload || !payload.exp) return true;

  const now = Math.floor(Date.now() / 1000);
  const expiresIn = payload.exp - now;

  return expiresIn <= withinSeconds;
};

/**
 * Gets detailed JWT token information.
 *
 * @param {string} token - JWT token to analyze
 * @returns {object} Token metadata
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
 * //   age: 50
 * // }
 * ```
 */
export const getJWTInfo = (token: string): any => {
  const payload = extractJWTClaims(token);
  if (!payload) return null;

  const now = Math.floor(Date.now() / 1000);

  return {
    isExpired: payload.exp ? payload.exp < now : null,
    expiresIn: payload.exp ? Math.max(0, payload.exp - now) : null,
    issuedAt: payload.iat ? new Date(payload.iat * 1000) : null,
    expiresAt: payload.exp ? new Date(payload.exp * 1000) : null,
    age: payload.iat ? now - payload.iat : null,
    issuer: payload.iss,
    audience: payload.aud,
    subject: payload.sub,
    jti: payload.jti,
  };
};

// ============================================================================
// REFRESH TOKEN MANAGEMENT
// ============================================================================

/**
 * Creates a comprehensive refresh token with metadata and tracking.
 *
 * @param {RefreshTokenConfig} config - Refresh token configuration
 * @param {string} secret - Secret key for signing
 * @returns {string} Refresh token
 *
 * @example
 * ```typescript
 * const refreshToken = createComprehensiveRefreshToken(
 *   {
 *     userId: 'user123',
 *     deviceId: 'device-abc',
 *     sessionId: 'session-xyz',
 *     familyId: 'family-123',
 *     expiresIn: '7d',
 *     metadata: { ipAddress: '192.168.1.1' }
 *   },
 *   process.env.REFRESH_SECRET
 * );
 * ```
 */
export const createComprehensiveRefreshToken = (
  config: RefreshTokenConfig,
  secret: string
): string => {
  const payload: JWTPayload = {
    sub: config.userId,
    type: 'refresh',
    deviceId: config.deviceId,
    sessionId: config.sessionId,
    familyId: config.familyId || crypto.randomUUID(),
    metadata: config.metadata,
    jti: crypto.randomUUID(),
  };

  return createComprehensiveJWT(payload, {
    secret,
    expiresIn: config.expiresIn || '7d',
    algorithm: 'HS256',
  });
};

/**
 * Validates refresh token with family tracking for rotation detection.
 *
 * @param {string} token - Refresh token to validate
 * @param {string} secret - Secret key for verification
 * @param {string} [expectedFamilyId] - Expected family ID for rotation check
 * @returns {JWTPayload | null} Token payload or null if invalid
 *
 * @example
 * ```typescript
 * const payload = validateRefreshToken(refreshToken, secret, familyId);
 * if (!payload) {
 *   // Token reuse detected - potential security breach
 *   revokeAllTokensInFamily(familyId);
 * }
 * ```
 */
export const validateRefreshToken = (
  token: string,
  secret: string,
  expectedFamilyId?: string
): JWTPayload | null => {
  const payload = verifyComprehensiveJWT(token, { secret });

  if (!payload || payload.type !== 'refresh') return null;

  // Check family ID for rotation detection
  if (expectedFamilyId && payload.familyId !== expectedFamilyId) return null;

  return payload;
};

/**
 * Rotates refresh token while maintaining family tracking.
 *
 * @param {string} oldToken - Old refresh token
 * @param {string} secret - Secret key
 * @param {string} newExpiresIn - New expiration time
 * @returns {object} New tokens with family ID
 *
 * @example
 * ```typescript
 * const { accessToken, refreshToken, familyId } = rotateRefreshToken(
 *   oldRefreshToken,
 *   secret,
 *   '7d'
 * );
 * ```
 */
export const rotateRefreshToken = (
  oldToken: string,
  secret: string,
  newExpiresIn: string | number = '7d'
): { accessToken: string; refreshToken: string; familyId: string } | null => {
  const payload = validateRefreshToken(oldToken, secret);
  if (!payload) return null;

  const familyId = payload.familyId || crypto.randomUUID();

  const accessToken = createComprehensiveJWT(
    {
      sub: payload.sub,
      deviceId: payload.deviceId,
      sessionId: payload.sessionId,
    },
    { secret, expiresIn: '15m' }
  );

  const refreshToken = createComprehensiveRefreshToken(
    {
      userId: payload.sub,
      deviceId: payload.deviceId,
      sessionId: payload.sessionId,
      familyId,
      expiresIn: newExpiresIn,
      metadata: payload.metadata,
    },
    secret
  );

  return { accessToken, refreshToken, familyId };
};

/**
 * Generates secure hash for refresh token storage.
 *
 * @param {string} token - Refresh token to hash
 * @param {string} [algorithm] - Hash algorithm (default: sha256)
 * @returns {string} Token hash
 *
 * @example
 * ```typescript
 * const hash = hashRefreshTokenSecure(refreshToken);
 * // Store hash in database for comparison
 * await db.refreshTokens.create({ userId, hash, familyId });
 * ```
 */
export const hashRefreshTokenSecure = (
  token: string,
  algorithm: 'sha256' | 'sha512' = 'sha256'
): string => {
  return crypto.createHash(algorithm).update(token).digest('hex');
};

// ============================================================================
// SESSION MANAGEMENT
// ============================================================================

/**
 * Creates comprehensive session with full metadata tracking.
 *
 * @param {SessionConfig} config - Session configuration
 * @returns {SessionData} Session data object
 *
 * @example
 * ```typescript
 * const session = createComprehensiveSession({
 *   userId: 'user123',
 *   ipAddress: '192.168.1.1',
 *   userAgent: 'Mozilla/5.0...',
 *   expiresIn: 86400000, // 24 hours
 *   metadata: { loginMethod: '2fa', deviceType: 'mobile' }
 * });
 * ```
 */
export const createComprehensiveSession = (config: SessionConfig): SessionData => {
  const now = new Date();
  const expiresIn = config.expiresIn || 86400000; // 24 hours default

  return {
    sessionId: crypto.randomUUID(),
    userId: config.userId,
    createdAt: now,
    lastActivity: now,
    expiresAt: new Date(now.getTime() + expiresIn),
    ipAddress: config.ipAddress,
    userAgent: config.userAgent,
    metadata: config.metadata,
  };
};

/**
 * Validates session with comprehensive security checks.
 *
 * @param {SessionData} session - Session to validate
 * @param {object} [options] - Validation options
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const result = validateSession(session, {
 *   checkExpiration: true,
 *   maxIdleTime: 1800000, // 30 minutes
 *   ipAddress: request.ip
 * });
 * if (!result.valid) {
 *   console.log('Session invalid:', result.reason);
 * }
 * ```
 */
export const validateSession = (
  session: SessionData,
  options?: {
    checkExpiration?: boolean;
    maxIdleTime?: number;
    ipAddress?: string;
    strictIpCheck?: boolean;
  }
): { valid: boolean; reason?: string } => {
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

  // Check IP address if strict mode enabled
  if (options?.strictIpCheck && options?.ipAddress && session.ipAddress !== options.ipAddress) {
    return { valid: false, reason: 'ip_address_mismatch' };
  }

  return { valid: true };
};

/**
 * Updates session activity with sliding expiration.
 *
 * @param {SessionData} session - Session to update
 * @param {number} [slidingWindow] - Sliding window in milliseconds
 * @returns {SessionData} Updated session
 *
 * @example
 * ```typescript
 * const updated = updateSessionWithSliding(session, 1800000); // 30 min sliding
 * ```
 */
export const updateSessionWithSliding = (
  session: SessionData,
  slidingWindow?: number
): SessionData => {
  const now = new Date();
  const updated: SessionData = {
    ...session,
    lastActivity: now,
  };

  // Sliding expiration: extend session if activity detected
  if (slidingWindow) {
    updated.expiresAt = new Date(now.getTime() + slidingWindow);
  }

  return updated;
};

/**
 * Generates secure session ID with custom format.
 *
 * @param {string} [prefix] - Optional prefix (e.g., 'sess_')
 * @param {number} [length] - Length in bytes (default: 32)
 * @returns {string} Secure session ID
 *
 * @example
 * ```typescript
 * const sessionId = generateSecureSessionId('sess_', 32);
 * // Result: 'sess_a1b2c3d4e5f6...'
 * ```
 */
export const generateSecureSessionId = (prefix: string = '', length: number = 32): string => {
  const randomId = crypto.randomBytes(length).toString('hex');
  return `${prefix}${randomId}`;
};

// ============================================================================
// ROLE-BASED ACCESS CONTROL (RBAC)
// ============================================================================

/**
 * Creates RBAC role with permissions and inheritance.
 *
 * @param {string} role - Role name
 * @param {string[]} permissions - List of permissions
 * @param {string[]} [inherits] - Parent roles to inherit from
 * @returns {RolePermissions} Role configuration
 *
 * @example
 * ```typescript
 * const doctorRole = createRBACRole('doctor', [
 *   'read:patients',
 *   'write:prescriptions',
 *   'read:medical-records'
 * ], ['user']);
 * ```
 */
export const createRBACRole = (
  role: string,
  permissions: string[],
  inherits?: string[]
): RolePermissions => {
  return {
    role,
    permissions,
    inherits,
  };
};

/**
 * Checks if user has required permission with role inheritance.
 *
 * @param {AccessControlList} acl - User's access control list
 * @param {string} permission - Required permission
 * @param {RolePermissions[]} roleDefinitions - All role definitions
 * @returns {boolean} True if user has permission
 *
 * @example
 * ```typescript
 * const hasAccess = checkRBACPermission(
 *   { userId: 'user123', roles: ['doctor'], permissions: [] },
 *   'write:prescriptions',
 *   allRoleDefinitions
 * );
 * ```
 */
export const checkRBACPermission = (
  acl: AccessControlList,
  permission: string,
  roleDefinitions: RolePermissions[]
): boolean => {
  // Check if explicitly denied
  if (acl.deniedPermissions?.includes(permission)) return false;

  // Check direct permissions
  if (acl.permissions.includes(permission)) return true;

  // Check role-based permissions with inheritance
  const userPermissions = resolveRolePermissions(acl.roles, roleDefinitions);
  return userPermissions.includes(permission);
};

/**
 * Resolves all permissions from roles including inheritance.
 *
 * @param {string[]} roles - User's roles
 * @param {RolePermissions[]} roleDefinitions - All role definitions
 * @returns {string[]} All resolved permissions
 *
 * @example
 * ```typescript
 * const permissions = resolveRolePermissions(['doctor'], allRoleDefinitions);
 * // Returns all permissions from 'doctor' role and inherited roles
 * ```
 */
export const resolveRolePermissions = (
  roles: string[],
  roleDefinitions: RolePermissions[]
): string[] => {
  const resolvedPermissions = new Set<string>();
  const processedRoles = new Set<string>();

  const resolveRole = (roleName: string) => {
    if (processedRoles.has(roleName)) return;
    processedRoles.add(roleName);

    const roleDef = roleDefinitions.find(r => r.role === roleName);
    if (!roleDef) return;

    // Add role's permissions
    roleDef.permissions.forEach(p => resolvedPermissions.add(p));

    // Recursively resolve inherited roles
    roleDef.inherits?.forEach(inheritedRole => resolveRole(inheritedRole));
  };

  roles.forEach(role => resolveRole(role));
  return Array.from(resolvedPermissions);
};

/**
 * Checks multiple permissions with AND/OR logic.
 *
 * @param {AccessControlList} acl - User's access control list
 * @param {string[]} permissions - Required permissions
 * @param {RolePermissions[]} roleDefinitions - All role definitions
 * @param {'AND' | 'OR'} logic - Permission check logic
 * @returns {boolean} True if permissions check passes
 *
 * @example
 * ```typescript
 * const hasAllPermissions = checkMultiplePermissions(
 *   acl,
 *   ['read:patients', 'write:prescriptions'],
 *   roleDefinitions,
 *   'AND'
 * );
 * ```
 */
export const checkMultiplePermissions = (
  acl: AccessControlList,
  permissions: string[],
  roleDefinitions: RolePermissions[],
  logic: 'AND' | 'OR' = 'AND'
): boolean => {
  if (logic === 'AND') {
    return permissions.every(perm => checkRBACPermission(acl, perm, roleDefinitions));
  } else {
    return permissions.some(perm => checkRBACPermission(acl, perm, roleDefinitions));
  }
};

/**
 * Creates permission string from resource and action.
 *
 * @param {string} resource - Resource name
 * @param {string} action - Action name
 * @returns {string} Permission string
 *
 * @example
 * ```typescript
 * const permission = createPermissionString('patients', 'read');
 * // Result: 'read:patients'
 * ```
 */
export const createPermissionString = (resource: string, action: string): string => {
  return `${action}:${resource}`;
};

/**
 * Parses permission string into components.
 *
 * @param {string} permission - Permission string
 * @returns {object} Permission components
 *
 * @example
 * ```typescript
 * const { action, resource } = parsePermissionString('read:patients');
 * // Result: { action: 'read', resource: 'patients' }
 * ```
 */
export const parsePermissionString = (
  permission: string
): { action: string; resource: string } | null => {
  const parts = permission.split(':');
  if (parts.length !== 2) return null;
  return { action: parts[0], resource: parts[1] };
};

// ============================================================================
// API KEY GENERATION AND VALIDATION
// ============================================================================

/**
 * Generates comprehensive API key with metadata.
 *
 * @param {ApiKeyConfig} [config] - API key configuration
 * @returns {ApiKeyData} Complete API key data
 *
 * @example
 * ```typescript
 * const apiKey = generateComprehensiveApiKey({
 *   prefix: 'wc_live_',
 *   length: 32,
 *   expiresIn: 31536000000, // 1 year
 *   permissions: ['read:api', 'write:webhooks']
 * });
 * ```
 */
export const generateComprehensiveApiKey = (config?: ApiKeyConfig): ApiKeyData => {
  const length = config?.length || 32;
  const prefix = config?.prefix || '';
  const key = crypto.randomBytes(length).toString('hex');
  const fullKey = `${prefix}${key}`;
  const hash = crypto.createHash('sha256').update(fullKey).digest('hex');

  const now = new Date();
  const expiresAt = config?.expiresIn ? new Date(now.getTime() + config.expiresIn) : undefined;

  return {
    key: fullKey,
    hash,
    prefix: config?.prefix,
    permissions: config?.permissions,
    createdAt: now,
    expiresAt,
    metadata: config?.metadata,
  };
};

/**
 * Validates API key with comprehensive security checks.
 *
 * @param {string} providedKey - API key to validate
 * @param {ApiKeyData} storedKeyData - Stored API key data
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const result = validateComprehensiveApiKey(providedKey, storedKeyData);
 * if (!result.valid) {
 *   console.log('API key invalid:', result.reason);
 * }
 * ```
 */
export const validateComprehensiveApiKey = (
  providedKey: string,
  storedKeyData: ApiKeyData
): { valid: boolean; reason?: string } => {
  // Validate format
  if (storedKeyData.prefix && !providedKey.startsWith(storedKeyData.prefix)) {
    return { valid: false, reason: 'invalid_prefix' };
  }

  // Validate hash
  const providedHash = crypto.createHash('sha256').update(providedKey).digest('hex');
  if (!crypto.timingSafeEqual(Buffer.from(providedHash), Buffer.from(storedKeyData.hash))) {
    return { valid: false, reason: 'invalid_key' };
  }

  // Check expiration
  if (storedKeyData.expiresAt && storedKeyData.expiresAt < new Date()) {
    return { valid: false, reason: 'expired' };
  }

  return { valid: true };
};

/**
 * Checks if API key has specific permission.
 *
 * @param {ApiKeyData} apiKeyData - API key data
 * @param {string} permission - Required permission
 * @returns {boolean} True if API key has permission
 *
 * @example
 * ```typescript
 * if (checkApiKeyPermission(apiKeyData, 'write:webhooks')) {
 *   // Allow webhook creation
 * }
 * ```
 */
export const checkApiKeyPermission = (apiKeyData: ApiKeyData, permission: string): boolean => {
  if (!apiKeyData.permissions) return false;
  return apiKeyData.permissions.includes(permission);
};

// ============================================================================
// MULTI-FACTOR AUTHENTICATION (MFA/2FA)
// ============================================================================

/**
 * Generates TOTP secret with QR code data.
 *
 * @param {string} accountName - Account identifier (e.g., email)
 * @param {string} issuer - Service name
 * @returns {TOTPResult} TOTP setup data
 *
 * @example
 * ```typescript
 * const totp = generateTOTPSetup('doctor@whitecross.com', 'White Cross');
 * // Display QR code to user for scanning with authenticator app
 * ```
 */
export const generateTOTPSetup = (accountName: string, issuer: string): TOTPResult => {
  const secret = base32Encode(crypto.randomBytes(20));
  const uri = `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(accountName)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}`;

  return {
    secret,
    qrCode: uri, // Use QR code library to generate actual QR code image
    uri,
  };
};

/**
 * Generates TOTP code from secret at current time.
 *
 * @param {string} secret - TOTP secret (base32)
 * @param {number} [step] - Time step in seconds (default: 30)
 * @param {number} [offset] - Time offset for testing
 * @returns {string} 6-digit TOTP code
 *
 * @example
 * ```typescript
 * const code = generateTOTPCode(secret);
 * // Result: '123456'
 * ```
 */
export const generateTOTPCode = (
  secret: string,
  step: number = 30,
  offset: number = 0
): string => {
  const time = Math.floor((Date.now() / 1000 + offset) / step);
  const timeBuffer = Buffer.alloc(8);
  timeBuffer.writeBigUInt64BE(BigInt(time));

  const hmac = crypto.createHmac('sha1', base32Decode(secret));
  hmac.update(timeBuffer);
  const hash = hmac.digest();

  const offset_bits = hash[hash.length - 1] & 0xf;
  const code =
    ((hash[offset_bits] & 0x7f) << 24) |
    ((hash[offset_bits + 1] & 0xff) << 16) |
    ((hash[offset_bits + 2] & 0xff) << 8) |
    (hash[offset_bits + 3] & 0xff);

  return (code % 1000000).toString().padStart(6, '0');
};

/**
 * Verifies TOTP code with time window tolerance.
 *
 * @param {string} code - TOTP code to verify
 * @param {string} secret - TOTP secret
 * @param {number} [window] - Time window tolerance (default: 1)
 * @returns {boolean} True if code is valid
 *
 * @example
 * ```typescript
 * if (verifyTOTPCode(userCode, secret, 1)) {
 *   // 2FA verification successful
 *   grantAccess();
 * }
 * ```
 */
export const verifyTOTPCode = (
  code: string,
  secret: string,
  window: number = 1
): boolean => {
  // Check current time and +/- window
  for (let i = -window; i <= window; i++) {
    const expectedCode = generateTOTPCode(secret, 30, i * 30);
    if (code === expectedCode) return true;
  }
  return false;
};

/**
 * Generates recovery codes for 2FA backup.
 *
 * @param {number} [count] - Number of codes to generate
 * @param {number} [length] - Length of each code
 * @returns {string[]} Array of recovery codes
 *
 * @example
 * ```typescript
 * const codes = generate2FARecoveryCodes(10, 8);
 * // Result: ['A1B2C3D4', 'E5F6G7H8', ...]
 * ```
 */
export const generate2FARecoveryCodes = (count: number = 10, length: number = 8): string[] => {
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
};

// ============================================================================
// PASSWORD POLICIES AND VALIDATION
// ============================================================================

/**
 * Validates password against comprehensive policy.
 *
 * @param {string} password - Password to validate
 * @param {PasswordPolicy} policy - Password policy rules
 * @returns {PasswordValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const result = validatePasswordPolicy('MyP@ssw0rd123!', {
 *   minLength: 12,
 *   requireUppercase: true,
 *   requireNumbers: true,
 *   requireSpecialChars: true,
 *   preventCommon: true
 * });
 * ```
 */
export const validatePasswordPolicy = (
  password: string,
  policy: PasswordPolicy
): PasswordValidationResult => {
  let score = 0;
  const feedback: string[] = [];

  // Length checks
  if (policy.minLength && password.length < policy.minLength) {
    feedback.push(`Password must be at least ${policy.minLength} characters`);
  } else {
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

  if (policy.requireNumbers && !/\d/.test(password)) {
    feedback.push('Include at least one number');
  } else if (policy.requireNumbers) {
    score += 1;
  }

  if (policy.requireSpecialChars && !/[^A-Za-z0-9]/.test(password)) {
    feedback.push('Include at least one special character');
  } else if (policy.requireSpecialChars) {
    score += 1;
  }

  // Common password check
  if (policy.preventCommon) {
    const commonPasswords = ['password', 'admin', 'user', '12345678', 'qwerty'];
    if (commonPasswords.some(common => password.toLowerCase().includes(common))) {
      score = Math.max(0, score - 2);
      feedback.push('Avoid common passwords');
    }
  }

  // Pattern checks
  if (/(.)\1{2,}/.test(password)) {
    score = Math.max(0, score - 1);
    feedback.push('Avoid repeated characters');
  }

  const isValid = feedback.length === 0;
  const strength = calculatePasswordStrength(score);

  return {
    isValid,
    score,
    strength,
    feedback,
  };
};

/**
 * Calculates password strength category from score.
 *
 * @param {number} score - Password score
 * @returns {string} Strength category
 */
const calculatePasswordStrength = (
  score: number
): 'weak' | 'fair' | 'good' | 'strong' | 'very-strong' => {
  if (score <= 1) return 'weak';
  if (score === 2) return 'fair';
  if (score === 3) return 'good';
  if (score === 4) return 'strong';
  return 'very-strong';
};

/**
 * Generates strong password meeting policy requirements.
 *
 * @param {number} length - Password length
 * @param {PasswordPolicy} [policy] - Password policy
 * @returns {string} Generated password
 *
 * @example
 * ```typescript
 * const password = generateSecurePassword(16, {
 *   requireUppercase: true,
 *   requireNumbers: true,
 *   requireSpecialChars: true
 * });
 * ```
 */
export const generateSecurePassword = (length: number = 16, policy?: PasswordPolicy): string => {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  let chars = '';
  let password = '';

  // Build character set based on policy
  if (!policy || policy.requireLowercase !== false) chars += lowercase;
  if (!policy || policy.requireUppercase !== false) chars += uppercase;
  if (!policy || policy.requireNumbers !== false) chars += numbers;
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
  if (policy?.requireNumbers !== false) {
    password += numbers[randomBytes[pos++] % numbers.length];
  }
  if (policy?.requireSpecialChars !== false) {
    password += special[randomBytes[pos++] % special.length];
  }

  // Fill remaining with random characters
  for (let i = pos; i < length; i++) {
    password += chars[randomBytes[i] % chars.length];
  }

  // Shuffle password
  return password
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('');
};

// ============================================================================
// SECURITY HEADERS CONFIGURATION
// ============================================================================

/**
 * Generates comprehensive security headers for HTTP responses.
 *
 * @param {object} [options] - Header configuration options
 * @returns {SecurityHeaders} Security headers object
 *
 * @example
 * ```typescript
 * const headers = generateSecurityHeaders({
 *   hsts: { maxAge: 31536000, includeSubDomains: true },
 *   csp: {
 *     directives: {
 *       defaultSrc: ["'self'"],
 *       scriptSrc: ["'self'", "'unsafe-inline'"]
 *     }
 *   }
 * });
 * ```
 */
export const generateSecurityHeaders = (options?: any): SecurityHeaders => {
  return {
    'Strict-Transport-Security':
      options?.hsts !== false
        ? `max-age=${options?.hsts?.maxAge || 31536000}; includeSubDomains; preload`
        : undefined,
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': options?.frameOptions || 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Content-Security-Policy': options?.csp || "default-src 'self'",
    'Referrer-Policy': options?.referrerPolicy || 'strict-origin-when-cross-origin',
    'Permissions-Policy': options?.permissionsPolicy || 'geolocation=(), microphone=(), camera=()',
  };
};

// ============================================================================
// RATE LIMITING UTILITIES
// ============================================================================

/**
 * Checks if request should be rate limited.
 *
 * @param {string} identifier - Rate limit identifier (e.g., user ID or IP)
 * @param {RateLimitConfig} config - Rate limit configuration
 * @param {Map<string, any>} store - Rate limit storage
 * @returns {RateLimitStatus} Rate limit status
 *
 * @example
 * ```typescript
 * const status = checkRateLimit('user123', {
 *   maxRequests: 100,
 *   windowMs: 900000 // 15 minutes
 * }, rateLimitStore);
 * if (status.remaining === 0) {
 *   throw new Error('Rate limit exceeded');
 * }
 * ```
 */
export const checkRateLimit = (
  identifier: string,
  config: RateLimitConfig,
  store: Map<string, any>
): RateLimitStatus => {
  const now = Date.now();
  const key = config.identifier || identifier;
  const record = store.get(key) || { count: 0, resetAt: now + config.windowMs };

  // Reset if window expired
  if (now >= record.resetAt) {
    record.count = 0;
    record.resetAt = now + config.windowMs;
  }

  record.count += 1;
  store.set(key, record);

  const remaining = Math.max(0, config.maxRequests - record.count);
  const retryAfter = remaining === 0 ? Math.ceil((record.resetAt - now) / 1000) : undefined;

  return {
    remaining,
    limit: config.maxRequests,
    resetAt: new Date(record.resetAt),
    retryAfter,
  };
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Converts time string to seconds (e.g., '15m', '7d', '1h').
 */
const parseTimeToSeconds = (timeStr: string): number => {
  const units: Record<string, number> = {
    s: 1,
    m: 60,
    h: 3600,
    d: 86400,
    w: 604800,
  };

  const match = timeStr.match(/^(\d+)([smhdw])$/);
  if (!match) return 900;

  const [, value, unit] = match;
  return parseInt(value) * units[unit];
};

/**
 * Base64 URL encodes a string.
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
 */
const base64UrlDecode = (str: string): string => {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  return Buffer.from(base64, 'base64').toString('utf8');
};

/**
 * Signs JWT using HMAC.
 */
const signJWT = (data: string, secret: string, algorithm?: string): string => {
  const alg = algorithm || 'HS256';
  const hashAlg = alg.replace('HS', 'sha');
  return crypto.createHmac(hashAlg, secret).update(data).digest('base64url');
};

/**
 * Base32 encodes buffer.
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
  createComprehensiveJWT,
  verifyComprehensiveJWT,
  extractJWTClaims,
  validateJWTStructure,
  isJWTExpiringWithin,
  getJWTInfo,

  // Refresh tokens
  createComprehensiveRefreshToken,
  validateRefreshToken,
  rotateRefreshToken,
  hashRefreshTokenSecure,

  // Session management
  createComprehensiveSession,
  validateSession,
  updateSessionWithSliding,
  generateSecureSessionId,

  // RBAC
  createRBACRole,
  checkRBACPermission,
  resolveRolePermissions,
  checkMultiplePermissions,
  createPermissionString,
  parsePermissionString,

  // API keys
  generateComprehensiveApiKey,
  validateComprehensiveApiKey,
  checkApiKeyPermission,

  // MFA/2FA
  generateTOTPSetup,
  generateTOTPCode,
  verifyTOTPCode,
  generate2FARecoveryCodes,

  // Password policies
  validatePasswordPolicy,
  generateSecurePassword,

  // Security headers
  generateSecurityHeaders,

  // Rate limiting
  checkRateLimit,
};
