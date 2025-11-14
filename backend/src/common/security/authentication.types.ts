/**
 * @fileoverview Authentication Type Definitions
 * @module shared/security/authentication.types
 *
 * @description
 * Core type definitions for the authentication system. Provides strongly-typed
 * interfaces for user profiles, JWT token payloads, authentication configuration,
 * and authentication results.
 *
 * **Type Safety:**
 * - Enforces type safety across authentication flows
 * - Prevents invalid state representations
 * - Enables compile-time validation of authentication data
 *
 * @author White Cross Platform
 * @version 1.0.0
 * @since 2025-01-01
 *
 * LOC: AUTH_TYPES
 * WC-SEC-AUTH-002 | Authentication Type Definitions
 *
 * UPSTREAM (imports from):
 *   - None (pure type definitions)
 *
 * DOWNSTREAM (imported by):
 *   - authentication.service.ts
 *   - token.service.ts
 *   - user-validator.service.ts
 */

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
