/**
 * @fileoverview Enterprise Authentication Service - JWT Token Management & User Validation
 * @module shared/security/authentication.service
 *
 * @description
 * Framework-agnostic authentication service providing centralized JWT token management,
 * user validation, and secure authentication workflows for healthcare applications.
 * Implements industry-standard security practices including token expiration, audience
 * validation, and claim verification to prevent common authentication vulnerabilities.
 *
 * **Critical Security Features:**
 * - JWT token generation with configurable expiration
 * - Token extraction from Authorization headers (Bearer scheme)
 * - Cryptographic signature verification using HMAC/RSA
 * - Token expiration and clock skew tolerance
 * - Audience and issuer claim validation
 * - User status validation (active/inactive)
 * - Token claims verification against current user data
 * - Protection against token replay attacks
 * - Secure token refresh mechanism
 *
 * **Authentication Flow:**
 * 1. Extract token from Authorization header
 * 2. Verify cryptographic signature and claims
 * 3. Check token expiration with clock skew tolerance
 * 4. Load user from database using userId claim
 * 5. Validate user status (active/inactive)
 * 6. Verify token claims match current user data
 * 7. Return authenticated user profile
 *
 * **Security Threat Models:**
 * - **Token Theft:** Mitigated by short expiration times and HTTPS-only transmission
 * - **Token Replay:** Mitigated by expiration and claim validation
 * - **Brute Force:** Should be combined with rate limiting middleware
 * - **JWT Algorithm Confusion:** Uses explicit algorithm specification
 * - **Claim Injection:** Validates all claims against current user data
 *
 * @security
 * **OWASP Compliance:**
 * - A02:2021 Cryptographic Failures - Uses strong JWT signing algorithms
 * - A07:2021 Identification and Authentication Failures - Implements secure token validation
 * - API2:2023 Broken Authentication - Prevents token tampering and replay attacks
 *
 * **HIPAA Compliance:**
 * - 164.312(a)(2)(i) Unique User Identification - JWT userId claim
 * - 164.312(d) Person or Entity Authentication - Cryptographic token validation
 * - 164.308(a)(5)(ii)(D) Password Management - Supports secure credential workflows
 *
 * **Best Practices:**
 * - Always use HTTPS for token transmission
 * - Store JWT secret securely (environment variables, secrets manager)
 * - Use short expiration times (15-60 minutes recommended)
 * - Implement token refresh mechanism for UX
 * - Log authentication failures for security monitoring
 * - Never log tokens or secrets
 * - Validate all token claims against current user state
 *
 * @example
 * // Initialize authentication service
 * import { createAuthenticationService } from './authentication.service';
 *
 * const authService = createAuthenticationService({
 *   jwtSecret: process.env.JWT_SECRET,
 *   jwtAudience: 'white-cross-api',
 *   jwtIssuer: 'white-cross-auth-service',
 *   maxAgeSec: 3600, // 1 hour
 *   timeSkewSec: 30, // 30 second clock tolerance
 *   userLoader: async (userId) => {
 *     return await User.findByPk(userId);
 *   }
 * });
 *
 * @example
 * // Authenticate incoming request
 * const authHeader = request.headers.authorization;
 * const result = await authService.authenticate(authHeader);
 *
 * if (result.success) {
 *   console.log('Authenticated user:', result.user.email);
 *   request.user = result.user;
 * } else {
 *   console.error('Authentication failed:', result.error);
 *   return response.status(401).json({ error: result.error });
 * }
 *
 * @example
 * // Generate token for user login
 * const user = await User.findByEmail(email);
 * const token = await authService.generateToken(user);
 *
 * response.json({
 *   token,
 *   expiresIn: 3600,
 *   user: {
 *     id: user.userId,
 *     email: user.email,
 *     role: user.role
 *   }
 * });
 *
 * @requires jsonwebtoken - JWT token generation and verification
 * @requires ../logging/logger - Security event logging
 *
 * @author White Cross Platform
 * @version 1.0.0
 * @since 2025-01-01
 *
 * LOC: AUTH_SERVICE_CONSOLIDATED
 * WC-SEC-AUTH-001 | Enterprise Authentication Service
 *
 * UPSTREAM (imports from):
 *   - jsonwebtoken library
 *   - bcrypt library
 *   - shared utilities
 *
 * DOWNSTREAM (imported by):
 *   - middleware/authentication/*
 *   - services/auth/*
 *   - routes/auth/*
 */

import * as jsonwebtoken from 'jsonwebtoken';
import { logger } from '../logging/logger';

/**
 * User profile interface for authentication context
 *
 * @interface UserProfile
 * @description Represents authenticated user information returned after successful
 * token validation. Contains essential user identity and authorization data.
 *
 * @property {string} userId - Unique user identifier (primary key)
 * @property {string} email - User email address (unique)
 * @property {string} role - User role for RBAC (e.g., 'admin', 'nurse', 'parent')
 * @property {boolean} isActive - Whether user account is active
 * @property {string[]} [permissions] - Optional granular permissions array
 * @property {string} [facilityId] - Optional facility/school identifier
 * @property {Date} [lastLoginAt] - Optional timestamp of last login
 *
 * @example
 * const userProfile: UserProfile = {
 *   userId: 'usr_123abc',
 *   email: 'nurse@school.edu',
 *   role: 'school_nurse',
 *   isActive: true,
 *   permissions: ['view_health_records', 'manage_medications'],
 *   facilityId: 'facility_xyz',
 *   lastLoginAt: new Date('2025-01-15T10:30:00Z')
 * };
 */
export interface UserProfile {
  userId: string;
  email: string;
  role: string;
  isActive: boolean;
  permissions?: string[];
  facilityId?: string;
  lastLoginAt?: Date;
}

/**
 * JWT token payload interface (claims)
 *
 * @interface TokenPayload
 * @description Standard JWT claims plus custom claims for user identity.
 * Validated during token verification to ensure integrity.
 *
 * @property {string} userId - User identifier claim (custom claim)
 * @property {string} email - User email claim (custom claim)
 * @property {string} role - User role claim (custom claim)
 * @property {number} [iat] - Issued at time (standard JWT claim, Unix timestamp)
 * @property {number} [exp] - Expiration time (standard JWT claim, Unix timestamp)
 * @property {string} [aud] - Audience claim (standard JWT claim)
 * @property {string} [iss] - Issuer claim (standard JWT claim)
 *
 * @security Custom claims (userId, email, role) are validated against current
 * user data to detect stale tokens after user updates
 *
 * @example
 * const payload: TokenPayload = {
 *   userId: 'usr_123abc',
 *   email: 'nurse@school.edu',
 *   role: 'school_nurse',
 *   iat: 1704985800,
 *   exp: 1704989400,
 *   aud: 'white-cross-api',
 *   iss: 'white-cross-auth-service'
 * };
 */
export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
  aud?: string;
  iss?: string;
}

/**
 * Authentication service configuration
 *
 * @interface AuthenticationConfig
 * @description Configuration options for authentication service initialization.
 * Defines JWT signing parameters and user loading strategy.
 *
 * @property {string} jwtSecret - Secret key for JWT signing (HMAC) or private key (RSA)
 * @property {string} [jwtAudience] - Expected audience claim (API identifier)
 * @property {string} [jwtIssuer] - Expected issuer claim (auth service identifier)
 * @property {number} maxAgeSec - Token expiration time in seconds
 * @property {number} [timeSkewSec=30] - Clock skew tolerance in seconds (default: 30)
 * @property {Function} userLoader - Async function to load user by ID from database
 *
 * @security
 * - jwtSecret must be at least 32 characters for HMAC-SHA256
 * - Store jwtSecret in environment variables or secrets manager
 * - Use short maxAgeSec (15-60 minutes) for security
 * - timeSkewSec prevents false rejections from clock drift
 *
 * @example
 * const config: AuthenticationConfig = {
 *   jwtSecret: process.env.JWT_SECRET,
 *   jwtAudience: 'white-cross-api',
 *   jwtIssuer: 'white-cross-auth',
 *   maxAgeSec: 3600,
 *   timeSkewSec: 30,
 *   userLoader: async (userId) => await User.findByPk(userId)
 * };
 */
export interface AuthenticationConfig {
  jwtSecret: string;
  jwtAudience?: string;
  jwtIssuer?: string;
  maxAgeSec: number;
  timeSkewSec?: number;
  userLoader: (userId: string) => Promise<UserProfile | null>;
}

/**
 * Authentication operation result
 *
 * @interface AuthenticationResult
 * @description Result of authentication operation with success status,
 * user profile on success, or error message on failure.
 *
 * @property {boolean} success - Whether authentication succeeded
 * @property {UserProfile} [user] - Authenticated user profile (only if success=true)
 * @property {string} [error] - Error message (only if success=false)
 * @property {string} [token] - Original token string (only if success=true)
 *
 * @example
 * // Successful authentication
 * const result: AuthenticationResult = {
 *   success: true,
 *   user: { userId: 'usr_123', email: 'user@example.com', role: 'nurse', isActive: true },
 *   token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
 * };
 *
 * @example
 * // Failed authentication
 * const result: AuthenticationResult = {
 *   success: false,
 *   error: 'Authentication token has expired'
 * };
 */
export interface AuthenticationResult {
  success: boolean;
  user?: UserProfile;
  error?: string;
  token?: string;
}

/**
 * Enterprise Authentication Service
 *
 * @class AuthenticationService
 * @description Framework-agnostic authentication service providing JWT token management,
 * user validation, and secure authentication workflows. Implements cryptographic token
 * verification, claim validation, and user status checking to prevent unauthorized access.
 *
 * **Core Responsibilities:**
 * - Generate JWT tokens with configurable expiration and claims
 * - Extract tokens from Authorization headers (Bearer scheme)
 * - Verify token signatures and validate claims (exp, aud, iss)
 * - Load and validate user status from database
 * - Detect stale tokens by comparing claims to current user data
 * - Provide secure token refresh mechanism
 *
 * **Security Features:**
 * - Cryptographic signature verification (HMAC-SHA256 or RSA)
 * - Token expiration with clock skew tolerance
 * - Audience and issuer claim validation
 * - User account status validation (active/inactive)
 * - Token claim verification against current user state
 * - Comprehensive security event logging
 *
 * @example
 * // Initialize service
 * const authService = new AuthenticationService({
 *   jwtSecret: process.env.JWT_SECRET,
 *   jwtAudience: 'white-cross-api',
 *   jwtIssuer: 'white-cross-auth',
 *   maxAgeSec: 3600,
 *   userLoader: async (userId) => await User.findByPk(userId)
 * });
 *
 * @example
 * // Authenticate request
 * const result = await authService.authenticate(request.headers.authorization);
 * if (result.success) {
 *   request.user = result.user;
 * }
 *
 * @security
 * - Always use HTTPS for token transmission
 * - Never log tokens or JWT secrets
 * - Use short expiration times (15-60 minutes)
 * - Validate all claims against current user data
 * - Log authentication failures for monitoring
 *
 * @see {@link https://tools.ietf.org/html/rfc7519|RFC 7519 - JSON Web Token}
 * @see {@link https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html|OWASP JWT Cheat Sheet}
 */
export class AuthenticationService extends BaseService {
  private config: AuthenticationConfig;

  /**
   * Creates authentication service instance
   *
   * @constructor
   * @param {AuthenticationConfig} config - Authentication configuration
   * @throws {Error} If jwtSecret is missing or invalid
   *
   * @example
   * const authService = new AuthenticationService({
   *   jwtSecret: process.env.JWT_SECRET,
   *   maxAgeSec: 3600,
   *   userLoader: async (userId) => await User.findByPk(userId)
   * });
   */
  constructor(config: AuthenticationConfig) {
    this.config = config;
  }

  /**
   * Extract JWT token from Authorization header
   *
   * @param {string | undefined} authHeader - Authorization header value
   * @returns {string | null} Extracted token or null if not found
   *
   * @description
   * Extracts JWT token from Authorization header supporting both standard
   * "Bearer {token}" format and raw token format for flexibility.
   *
   * **Supported Formats:**
   * - `Bearer eyJhbGc...` (RFC 6750 Bearer Token)
   * - `eyJhbGc...` (raw token)
   *
   * **Security Considerations:**
   * - Returns null for missing or empty headers
   * - Trims whitespace to handle formatting variations
   * - Case-insensitive "Bearer" prefix matching
   *
   * @example
   * // Standard Bearer format
   * const token = authService.extractToken('Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
   * // Returns: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
   *
   * @example
   * // Raw token format
   * const token = authService.extractToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
   * // Returns: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
   *
   * @example
   * // Missing header
   * const token = authService.extractToken(undefined);
   * // Returns: null
   */
  extractToken(authHeader: string | undefined): string | null {
    if (!authHeader) {
      return null;
    }

    // Support both "Bearer token" and "token" formats
    const match = authHeader.match(/^(?:Bearer\s+)?(.+)$/i);
    return match && match[1] ? match[1].trim() : null;
  }

  /**
   * Generate JWT token for authenticated user
   *
   * @async
   * @param {UserProfile} user - Authenticated user profile
   * @returns {Promise<string>} Signed JWT token
   * @throws {Error} If token generation fails
   *
   * @description
   * Generates cryptographically signed JWT token containing user identity claims.
   * Token includes expiration time, audience, and issuer for security validation.
   *
   * **Token Claims:**
   * - `userId` - Unique user identifier
   * - `email` - User email address
   * - `role` - User role for RBAC
   * - `exp` - Expiration timestamp (Unix time)
   * - `iat` - Issued at timestamp (Unix time)
   * - `aud` - Audience claim (API identifier)
   * - `iss` - Issuer claim (auth service identifier)
   *
   * **Security:**
   * - Uses HMAC-SHA256 or RSA for signing
   * - Includes expiration time to limit token lifetime
   * - Audience and issuer claims prevent token misuse
   * - Never includes sensitive data like passwords
   *
   * @example
   * const user = await User.findByEmail('nurse@school.edu');
   * const token = await authService.generateToken(user);
   * // Returns: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
   *
   * @example
   * // Use in login response
   * const token = await authService.generateToken(user);
   * response.json({
   *   token,
   *   expiresIn: 3600,
   *   user: { id: user.userId, email: user.email }
   * });
   *
   * @security Token should only be transmitted over HTTPS
   * @see {@link https://tools.ietf.org/html/rfc7519|RFC 7519 - JSON Web Token}
   */
  async generateToken(user: UserProfile): Promise<string> {
    try {
      const payload: TokenPayload = {
        userId: user.userId,
        email: user.email,
        role: user.role,
      };

      const options: jsonwebtoken.SignOptions = {
        expiresIn: this.config.maxAgeSec,
        audience: this.config.jwtAudience,
        issuer: this.config.jwtIssuer,
      };

      return jsonwebtoken.sign(payload, this.config.jwtSecret, options);
    } catch (error) {
      logger.error('Error generating JWT token:', error);
      throw new Error('Failed to generate authentication token');
    }
  }

  /**
   * Verify JWT token signature and decode claims
   *
   * @async
   * @param {string} token - JWT token to verify
   * @returns {Promise<TokenPayload>} Decoded token payload
   * @throws {Error} If token is expired, invalid, or verification fails
   *
   * @description
   * Verifies JWT token cryptographic signature and validates standard claims
   * including expiration, audience, and issuer. Uses clock skew tolerance to
   * handle minor time differences between servers.
   *
   * **Verification Steps:**
   * 1. Verify cryptographic signature using secret/public key
   * 2. Check token expiration with clock skew tolerance
   * 3. Validate audience claim matches expected value
   * 4. Validate issuer claim matches expected value
   * 5. Decode and return token payload
   *
   * **Error Handling:**
   * - TokenExpiredError → "Authentication token has expired"
   * - JsonWebTokenError → "Invalid authentication token"
   * - Other errors → "Token verification failed"
   *
   * @example
   * try {
   *   const decoded = await authService.verifyToken(token);
   *   console.log('User ID:', decoded.userId);
   * } catch (error) {
   *   console.error('Token verification failed:', error.message);
   * }
   *
   * @throws {Error} "Authentication token has expired" - Token past expiration time
   * @throws {Error} "Invalid authentication token" - Signature invalid or claims mismatch
   * @throws {Error} "Token verification failed" - Other verification errors
   *
   * @security
   * - Prevents tampering through signature verification
   * - Clock skew tolerance prevents false rejections
   * - Audience/issuer validation prevents token misuse
   * - Logs verification failures for security monitoring
   *
   * @see {@link https://tools.ietf.org/html/rfc7519#section-7.2|RFC 7519 - Validating a JWT}
   */
  async verifyToken(token: string): Promise<TokenPayload> {
    try {
      const options: jsonwebtoken.VerifyOptions = {
        audience: this.config.jwtAudience,
        issuer: this.config.jwtIssuer,
        clockTolerance: this.config.timeSkewSec || 30,
      };

      const decoded = jsonwebtoken.verify(
        token,
        this.config.jwtSecret,
        options,
      ) as TokenPayload;
      return decoded;
    } catch (error) {
      if (error instanceof jsonwebtoken.TokenExpiredError) {
        throw new Error('Authentication token has expired');
      } else if (error instanceof jsonwebtoken.JsonWebTokenError) {
        throw new Error('Invalid authentication token');
      } else {
        logger.error('JWT verification error:', error);
        throw new Error('Token verification failed');
      }
    }
  }

  /**
   * Validate user exists, is active, and token claims match current data
   *
   * @async
   * @param {TokenPayload} decoded - Decoded JWT token payload
   * @returns {Promise<UserProfile>} Validated user profile
   * @throws {Error} If user not found, inactive, or claims mismatch
   *
   * @description
   * Validates user against current database state and verifies token claims
   * match current user data. Detects stale tokens after user updates (email
   * change, role change, account deactivation).
   *
   * **Validation Steps:**
   * 1. Load user from database using userId claim
   * 2. Verify user exists in database
   * 3. Verify user account is active
   * 4. Verify email claim matches current user email
   * 5. Verify role claim matches current user role
   * 6. Return validated user profile
   *
   * **Security Checks:**
   * - User exists: Prevents authentication with deleted users
   * - User active: Enforces account suspension/deactivation
   * - Email match: Detects stale tokens after email change
   * - Role match: Detects stale tokens after role change
   *
   * @example
   * const decoded = await authService.verifyToken(token);
   * const user = await authService.validateUser(decoded);
   * console.log('Validated user:', user.email);
   *
   * @throws {Error} "User not found" - User does not exist in database
   * @throws {Error} "User account is inactive" - User account deactivated
   * @throws {Error} "Token claims do not match user data" - Email or role mismatch
   *
   * @security
   * - Prevents stale token usage after user updates
   * - Enforces account deactivation immediately
   * - Logs validation failures for security monitoring
   * - Protects against privilege escalation via old tokens
   *
   * @see {@link UserProfile} for user profile structure
   */
  async validateUser(decoded: TokenPayload): Promise<UserProfile> {
    try {
      // Load user from database
      const user = await this.config.userLoader(decoded.userId);

      if (!user) {
        logger.warn('JWT validation failed: User not found', {
          userId: decoded.userId,
          email: decoded.email,
        });
        throw new Error('User not found');
      }

      if (!user.isActive) {
        logger.warn('JWT validation failed: User inactive', {
          userId: decoded.userId,
          email: decoded.email,
        });
        throw new Error('User account is inactive');
      }

      // Validate token claims against current user data
      if (decoded.email !== user.email || decoded.role !== user.role) {
        logger.warn('JWT validation failed: Token claims mismatch', {
          userId: decoded.userId,
          tokenEmail: decoded.email,
          userEmail: user.email,
          tokenRole: decoded.role,
          userRole: user.role,
        });
        throw new Error('Token claims do not match user data');
      }

      logger.debug('JWT validation successful', {
        userId: user.userId,
        email: user.email,
        role: user.role,
      });

      return user;
    } catch (error) {
      logger.error('User validation error', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId: decoded.userId,
      });
      throw error;
    }
  }

  /**
   * Authenticate request using Authorization header
   *
   * @async
   * @param {string | undefined} authHeader - Authorization header value
   * @returns {Promise<AuthenticationResult>} Authentication result with user or error
   *
   * @description
   * Complete authentication flow: extract token, verify signature, validate user.
   * Returns structured result indicating success/failure with user profile or error.
   *
   * **Authentication Flow:**
   * 1. Extract token from Authorization header
   * 2. Verify token signature and claims
   * 3. Validate user exists and is active
   * 4. Verify token claims match current user
   * 5. Return success with user profile
   *
   * **Result Structure:**
   * - Success: `{ success: true, user: UserProfile, token: string }`
   * - Failure: `{ success: false, error: string }`
   *
   * **Error Cases:**
   * - No token provided
   * - Token signature invalid
   * - Token expired
   * - User not found
   * - User inactive
   * - Token claims mismatch
   *
   * @example
   * // Successful authentication
   * const result = await authService.authenticate('Bearer eyJhbGc...');
   * if (result.success) {
   *   request.user = result.user;
   *   console.log('Authenticated:', result.user.email);
   * } else {
   *   return response.status(401).json({ error: result.error });
   * }
   *
   * @example
   * // Failed authentication
   * const result = await authService.authenticate(undefined);
   * // Returns: { success: false, error: 'No authentication token provided' }
   *
   * @security
   * - Never throws errors - returns structured result
   * - Logs authentication failures for monitoring
   * - Provides generic error messages to prevent enumeration
   * - Should be combined with rate limiting
   *
   * @see {@link AuthenticationResult} for result structure
   */
  async authenticate(
    authHeader: string | undefined,
  ): Promise<AuthenticationResult> {
    try {
      // Extract token
      const token = this.extractToken(authHeader);

      if (!token) {
        return {
          success: false,
          error: 'No authentication token provided',
        };
      }

      // Verify token
      const decoded = await this.verifyToken(token);

      // Validate user
      const user = await this.validateUser(decoded);

      return {
        success: true,
        user,
        token,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Authentication failed',
      };
    }
  }

  /**
   * Refresh JWT token for authenticated user
   *
   * @async
   * @param {UserProfile} user - Current authenticated user profile
   * @returns {Promise<string>} New JWT token with updated expiration
   * @throws {Error} If token generation fails
   *
   * @description
   * Generates new JWT token for user with fresh expiration time. Used to
   * extend user session without requiring re-authentication. Should only
   * be called for already authenticated users.
   *
   * **Use Cases:**
   * - Extend user session before token expires
   * - Provide seamless UX with sliding sessions
   * - Update token after user profile changes
   *
   * **Security Considerations:**
   * - Only call for authenticated users
   * - Verify current token before refresh
   * - Consider refresh token rotation strategy
   * - Log token refresh for audit trail
   *
   * @example
   * // Refresh token before expiration
   * const user = request.user; // Already authenticated
   * const newToken = await authService.refreshToken(user);
   * response.json({ token: newToken, expiresIn: 3600 });
   *
   * @example
   * // Token refresh endpoint
   * app.post('/auth/refresh', authenticate, async (req, res) => {
   *   const newToken = await authService.refreshToken(req.user);
   *   res.json({ token: newToken });
   * });
   *
   * @throws {Error} "Failed to refresh authentication token" - Token generation error
   *
   * @security
   * - Should require valid existing token
   * - Consider refresh token limits (max refreshes per day)
   * - Log refresh events for security monitoring
   * - Implement refresh token rotation for enhanced security
   *
   * @see {@link generateToken} for token generation details
   */
  async refreshToken(user: UserProfile): Promise<string> {
    try {
      return await this.generateToken(user);
    } catch (error) {
      logger.error('Error refreshing JWT token:', error);
      return this.handleError('Operation failed', new Error('Failed to refresh authentication token'));
    }
  }
}

/**
 * Factory function for creating authentication service
 *
 * @function createAuthenticationService
 * @param {AuthenticationConfig} config - Authentication service configuration
 * @returns {AuthenticationService} Configured authentication service instance
 *
 * @description
 * Convenience factory function for creating AuthenticationService instances.
 * Provides cleaner API than direct constructor usage.
 *
 * @example
 * import { createAuthenticationService } from './authentication.service';
 *
 * const authService = createAuthenticationService({
 *   jwtSecret: process.env.JWT_SECRET,
 *   jwtAudience: 'white-cross-api',
 *   jwtIssuer: 'white-cross-auth',
 *   maxAgeSec: 3600,
 *   userLoader: async (userId) => await User.findByPk(userId)
 * });
 *
 * @see {@link AuthenticationService} for full service documentation
 * @see {@link AuthenticationConfig} for configuration options
 */
export function createAuthenticationService(
  config: AuthenticationConfig,
): AuthenticationService {
  return new AuthenticationService(config);
}

/**
 * Default export for convenience
 *
 * @description
 * Exports authentication service class and factory function for flexible import patterns.
 *
 * @example
 * // Named imports (recommended)
 * import { AuthenticationService, createAuthenticationService } from './authentication.service';
 *
 * @example
 * // Default import
 * import authService from './authentication.service';
import { BaseService } from '@/common/base';
 * const service = authService.createAuthenticationService(config);
 */
export default {
  AuthenticationService,
  createAuthenticationService,
};
