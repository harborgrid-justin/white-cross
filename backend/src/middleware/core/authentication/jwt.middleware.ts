/**
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
 */
export class JwtAuthenticationMiddleware {
  private authService: AuthenticationService;

  constructor(config: AuthenticationConfig) {
    this.authService = createAuthenticationService(config);
  }

  /**
   * Extract token from authorization header
   * Delegates to authentication service
   */
  extractToken(authHeader: string | undefined): string | null {
    return this.authService.extractToken(authHeader);
  }

  /**
   * Authenticate request with JWT token
   * Delegates to authentication service
   */
  async authenticate(authHeader: string | undefined): Promise<AuthenticationResult> {
    return await this.authService.authenticate(authHeader);
  }

  /**
   * Generate JWT token for user
   * Delegates to authentication service
   */
  async generateToken(user: UserProfile): Promise<string> {
    return await this.authService.generateToken(user);
  }

  /**
   * Refresh JWT token for user
   * Delegates to authentication service
   */
  async refreshToken(user: UserProfile): Promise<string> {
    return await this.authService.refreshToken(user);
  }

  /**
   * Verify and decode JWT token
   * Delegates to authentication service
   */
  async verifyToken(token: string): Promise<TokenPayload> {
    return await this.authService.verifyToken(token);
  }

  /**
   * Validate user and token claims
   * Delegates to authentication service
   */
  async validateUser(decoded: TokenPayload): Promise<UserProfile> {
    return await this.authService.validateUser(decoded);
  }

  /**
   * Create factory function for different configurations
   */
  static create(config: AuthenticationConfig): JwtAuthenticationMiddleware {
    return new JwtAuthenticationMiddleware(config);
  }
}

/**
 * Factory function for creating JWT authentication middleware
 */
export function createJwtAuthenticationMiddleware(
  config: AuthenticationConfig
): JwtAuthenticationMiddleware {
  return JwtAuthenticationMiddleware.create(config);
}

/**
 * Default export for convenience
 */
export default JwtAuthenticationMiddleware;
