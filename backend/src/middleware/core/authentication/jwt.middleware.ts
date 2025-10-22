/**
 * @fileoverview JWT Authentication Middleware
 * @module middleware/authentication/jwt
 * @description Framework-agnostic JWT authentication middleware for HIPAA-compliant healthcare applications.
 * Provides secure token validation, user authentication, and session management.
 *
 * @requires ../../../shared/security/authentication.service - Core authentication service
 * @requires jsonwebtoken - JWT token handling
 *
 * LOC: FFA8084CE0
 * WC-MID-AUTH-011 | JWT Authentication Middleware
 *
 * UPSTREAM (imports from):
 *   - shared/auth/* (shared authentication utilities)
 *
 * DOWNSTREAM (imported by):
 *   - adapters/hapi/authentication.adapter.ts
 *   - adapters/express/authentication.adapter.ts
 */

/**
 * WC-MID-AUTH-011 | JWT Authentication Middleware
 * Purpose: JWT token validation, user authentication, and session management
 * Upstream: shared/auth/jwt, database/models/User | Dependencies: @hapi/hapi, jsonwebtoken
 * Downstream: All protected routes | Called by: Framework-specific adapters
 * Related: jwt.ts, userService.ts, rbac.ts, securityHeaders.ts
 * Exports: JwtAuthenticationMiddleware class | Key Services: JWT validation, user loading, session management
 * Last Updated: 2025-10-21 | Dependencies: Framework-agnostic
 * Critical Path: Token extraction → JWT verification → User loading → Role assignment
 * LLM Context: HIPAA-compliant authentication, role-based access control, audit logging
 */

/**
 * Framework-agnostic JWT Authentication Middleware
 *
 * This middleware provides framework adapters that use the consolidated
 * authentication service from shared/security/authentication.service.ts
 *
 * Security Features:
 * - JWT token validation with configurable expiration
 * - Bearer token extraction from Authorization header
 * - User profile loading and validation
 * - Token refresh capabilities
 * - HIPAA-compliant audit logging
 *
 * @example
 * // Create authentication middleware
 * const authMiddleware = createJwtAuthenticationMiddleware({
 *   jwtSecret: process.env.JWT_SECRET,
 *   jwtIssuer: 'white-cross-platform',
 *   jwtAudience: 'healthcare-app',
 *   userLoader: async (userId) => await User.findById(userId)
 * });
 *
 * // Authenticate request
 * const result = await authMiddleware.authenticate(authHeader);
 * if (result.authenticated && result.user) {
 *   // User is authenticated
 * }
 */

import { 
  AuthenticationService,
  createAuthenticationService,
  type AuthenticationConfig,
  type UserProfile,
  type AuthenticationResult,
  type TokenPayload
} from '../../../shared/security/authentication.service';

// Re-export types for convenience
export type {
  AuthenticationConfig,
  UserProfile,
  AuthenticationResult,
  TokenPayload
};

/**
 * JWT Authentication Middleware Adapter
 *
 * This class wraps the consolidated AuthenticationService to provide
 * middleware-specific functionality while delegating core logic to the service.
 *
 * @class JwtAuthenticationMiddleware
 * @implements {AuthenticationService}
 *
 * @example
 * // Initialize middleware
 * const authMiddleware = new JwtAuthenticationMiddleware({
 *   jwtSecret: 'your-secret-key',
 *   jwtIssuer: 'white-cross',
 *   userLoader: async (userId) => User.findById(userId)
 * });
 *
 * @example
 * // Usage in route handler
 * const authHeader = request.headers.authorization;
 * const result = await authMiddleware.authenticate(authHeader);
 */
export class JwtAuthenticationMiddleware {
  private authService: AuthenticationService;

  /**
   * Creates an instance of JwtAuthenticationMiddleware
   *
   * @constructor
   * @param {AuthenticationConfig} config - Authentication configuration
   * @param {string} config.jwtSecret - Secret key for JWT signing/verification
   * @param {string} config.jwtIssuer - JWT issuer identifier
   * @param {string} config.jwtAudience - JWT audience identifier
   * @param {Function} config.userLoader - Function to load user by ID
   * @param {number} [config.maxAgeSec=86400] - Token maximum age in seconds
   *
   * @example
   * const middleware = new JwtAuthenticationMiddleware({
   *   jwtSecret: process.env.JWT_SECRET,
   *   jwtIssuer: 'white-cross-platform',
   *   jwtAudience: 'healthcare-app',
   *   userLoader: async (userId) => await UserModel.findById(userId),
   *   maxAgeSec: 24 * 60 * 60 // 24 hours
   * });
   */
  constructor(config: AuthenticationConfig) {
    this.authService = createAuthenticationService(config);
  }

  /**
   * Extract JWT token from Authorization header
   *
   * @function extractToken
   * @param {string} [authHeader] - Authorization header value (e.g., "Bearer <token>")
   * @returns {string|null} Extracted JWT token or null if not found
   *
   * @example
   * const token = middleware.extractToken('Bearer eyJhbGci...');
   * // Returns: 'eyJhbGci...'
   *
   * @example
   * const token = middleware.extractToken(undefined);
   * // Returns: null
   */
  extractToken(authHeader: string | undefined): string | null {
    return this.authService.extractToken(authHeader);
  }

  /**
   * Authenticate request using JWT token from Authorization header
   *
   * @function authenticate
   * @async
   * @middleware
   * @param {string} [authHeader] - Authorization header containing Bearer token
   * @returns {Promise<AuthenticationResult>} Authentication result with user profile if successful
   * @throws {UnauthorizedError} When token is missing or invalid
   * @throws {TokenExpiredError} When token has expired
   *
   * @example
   * const result = await middleware.authenticate('Bearer eyJhbGci...');
   * if (result.authenticated && result.user) {
   *   console.log('User authenticated:', result.user.userId);
   * }
   *
   * @example
   * // Usage in Hapi route
   * {
   *   method: 'GET',
   *   path: '/api/protected',
   *   handler: async (request, h) => {
   *     const result = await authMiddleware.authenticate(request.headers.authorization);
   *     if (!result.authenticated) {
   *       return h.response({ error: 'Unauthorized' }).code(401);
   *     }
   *     return { data: 'Protected resource' };
   *   }
   * }
   */
  async authenticate(authHeader: string | undefined): Promise<AuthenticationResult> {
    return await this.authService.authenticate(authHeader);
  }

  /**
   * Generate new JWT token for authenticated user
   *
   * @function generateToken
   * @async
   * @param {UserProfile} user - User profile to encode in token
   * @param {string} user.userId - Unique user identifier
   * @param {string} user.email - User email address
   * @param {string} user.role - User role for authorization
   * @returns {Promise<string>} Signed JWT token
   *
   * @example
   * const token = await middleware.generateToken({
   *   userId: '12345',
   *   email: 'nurse@hospital.com',
   *   role: 'school_nurse'
   * });
   * // Returns: 'eyJhbGci...'
   *
   * @example
   * // Usage in login handler
   * const user = await authenticateCredentials(email, password);
   * const token = await authMiddleware.generateToken(user);
   * return { token, user };
   */
  async generateToken(user: UserProfile): Promise<string> {
    return await this.authService.generateToken(user);
  }

  /**
   * Refresh existing JWT token for user
   *
   * @function refreshToken
   * @async
   * @param {UserProfile} user - User profile for new token
   * @returns {Promise<string>} New JWT token with extended expiration
   *
   * @example
   * const newToken = await middleware.refreshToken(currentUser);
   * // Returns fresh token with new expiration
   *
   * @example
   * // Usage in token refresh endpoint
   * {
   *   method: 'POST',
   *   path: '/api/auth/refresh',
   *   handler: async (request, h) => {
   *     const result = await authMiddleware.authenticate(request.headers.authorization);
   *     if (result.authenticated && result.user) {
   *       const newToken = await authMiddleware.refreshToken(result.user);
   *       return { token: newToken };
   *     }
   *     return h.response({ error: 'Unauthorized' }).code(401);
   *   }
   * }
   */
  async refreshToken(user: UserProfile): Promise<string> {
    return await this.authService.refreshToken(user);
  }

  /**
   * Verify and decode JWT token
   *
   * @function verifyToken
   * @async
   * @param {string} token - JWT token to verify
   * @returns {Promise<TokenPayload>} Decoded token payload
   * @throws {JsonWebTokenError} When token signature is invalid
   * @throws {TokenExpiredError} When token has expired
   * @throws {NotBeforeError} When token is not yet valid
   *
   * @example
   * const payload = await middleware.verifyToken('eyJhbGci...');
   * console.log('Token payload:', payload);
   * // { userId: '12345', email: 'user@example.com', role: 'nurse', ... }
   *
   * @example
   * // Verify token without full authentication
   * try {
   *   const payload = await middleware.verifyToken(token);
   *   console.log('Valid token for user:', payload.userId);
   * } catch (error) {
   *   console.error('Invalid token:', error.message);
   * }
   */
  async verifyToken(token: string): Promise<TokenPayload> {
    return await this.authService.verifyToken(token);
  }

  /**
   * Validate user profile and token claims
   *
   * @function validateUser
   * @async
   * @param {TokenPayload} decoded - Decoded JWT payload
   * @returns {Promise<UserProfile>} Validated user profile
   * @throws {UnauthorizedError} When user not found or inactive
   *
   * @example
   * const decoded = await middleware.verifyToken(token);
   * const user = await middleware.validateUser(decoded);
   * console.log('Validated user:', user);
   *
   * @example
   * // Multi-step authentication
   * const decoded = await middleware.verifyToken(token);
   * const user = await middleware.validateUser(decoded);
   * if (user.role === 'admin') {
   *   // Allow admin access
   * }
   */
  async validateUser(decoded: TokenPayload): Promise<UserProfile> {
    return await this.authService.validateUser(decoded);
  }

  /**
   * Create factory method for different configurations
   *
   * @static
   * @function create
   * @param {AuthenticationConfig} config - Authentication configuration
   * @returns {JwtAuthenticationMiddleware} New middleware instance
   *
   * @example
   * const middleware = JwtAuthenticationMiddleware.create({
   *   jwtSecret: process.env.JWT_SECRET,
   *   jwtIssuer: 'white-cross',
   *   userLoader: loadUserById
   * });
   */
  static create(config: AuthenticationConfig): JwtAuthenticationMiddleware {
    return new JwtAuthenticationMiddleware(config);
  }
}

/**
 * Factory function for creating JWT authentication middleware
 *
 * @function createJwtAuthenticationMiddleware
 * @param {AuthenticationConfig} config - Authentication configuration
 * @param {string} config.jwtSecret - JWT secret for signing and verification
 * @param {string} config.jwtIssuer - JWT issuer identifier
 * @param {string} config.jwtAudience - JWT audience identifier
 * @param {Function} config.userLoader - Function to load user profile by ID
 * @param {number} [config.maxAgeSec] - Token expiration time in seconds
 * @param {number} [config.timeSkewSec] - Allowed clock skew in seconds
 * @returns {JwtAuthenticationMiddleware} Configured middleware instance
 *
 * @example
 * // Basic usage
 * const authMiddleware = createJwtAuthenticationMiddleware({
 *   jwtSecret: process.env.JWT_SECRET!,
 *   jwtIssuer: 'white-cross-platform',
 *   jwtAudience: 'healthcare-app',
 *   userLoader: async (userId) => {
 *     return await User.findById(userId);
 *   }
 * });
 *
 * @example
 * // With custom expiration
 * const authMiddleware = createJwtAuthenticationMiddleware({
 *   jwtSecret: process.env.JWT_SECRET!,
 *   jwtIssuer: 'white-cross',
 *   jwtAudience: 'app',
 *   userLoader: loadUser,
 *   maxAgeSec: 12 * 60 * 60, // 12 hours
 *   timeSkewSec: 60 // 1 minute clock skew tolerance
 * });
 *
 * @example
 * // Usage in Express
 * app.use(async (req, res, next) => {
 *   const result = await authMiddleware.authenticate(req.headers.authorization);
 *   if (result.authenticated) {
 *     req.user = result.user;
 *     next();
 *   } else {
 *     res.status(401).json({ error: 'Unauthorized' });
 *   }
 * });
 */
export function createJwtAuthenticationMiddleware(
  config: AuthenticationConfig
): JwtAuthenticationMiddleware {
  return JwtAuthenticationMiddleware.create(config);
}

/**
 * Default export for convenience
 *
 * @default JwtAuthenticationMiddleware
 */
export default JwtAuthenticationMiddleware;
