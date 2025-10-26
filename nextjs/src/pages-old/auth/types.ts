/**
 * Authentication Module Type Definitions - White Cross Healthcare Platform
 *
 * @fileoverview Type definitions for authentication components, pages, and forms.
 * Defines interfaces for login flows, access control, and session management
 * with HIPAA compliance considerations.
 *
 * @module pages/auth/types
 * @version 1.0.0
 */

/**
 * Access Denied Page Parameters.
 *
 * Query string parameters passed to the Access Denied page to provide context
 * about why access was denied and what resource was being accessed.
 *
 * @interface AccessDeniedParams
 * @property {string} [studentId] - ID of the student whose record was attempted to be accessed (optional)
 * @property {string} [resource] - Name of the resource that was denied (e.g., "student records", "health records", "medication logs")
 * @property {string} [reason] - Human-readable reason for access denial (e.g., "insufficient permissions", "record restricted")
 *
 * @remarks
 * Used in URL query strings when redirecting to /access-denied page:
 * `/access-denied?studentId=123&resource=health records&reason=insufficient permissions`
 *
 * All parameters are optional to support various access denial scenarios:
 * - Missing permissions for a general area
 * - Attempting to access a specific student record
 * - RBAC violations
 * - Time-based access restrictions
 *
 * @example
 * ```ts
 * const params: AccessDeniedParams = {
 *   studentId: 'student-123',
 *   resource: 'sensitive health records',
 *   reason: 'insufficient permissions'
 * };
 * navigate(`/access-denied?${new URLSearchParams(params as Record<string, string>)}`);
 * ```
 */
export interface AccessDeniedParams {
  studentId?: string | null
  resource?: string | null
  reason?: string | null
}

/**
 * Login Form Data Interface.
 *
 * Represents the data structure for user login form submissions with optional
 * remember-me functionality for persistent sessions.
 *
 * @interface LoginForm
 * @property {string} email - User's email address used as login identifier
 * @property {string} password - User's password in plain text (encrypted over HTTPS, never stored in plain text)
 * @property {boolean} [rememberMe] - Optional flag to persist session beyond browser close (optional, defaults to false)
 *
 * @remarks
 * Security Considerations:
 * - Email and password are transmitted over HTTPS only
 * - Password is never logged or stored in plain text
 * - Remember-me uses secure, HTTP-only cookies with appropriate expiration
 * - Session tokens are encrypted and include role-based claims
 *
 * HIPAA Compliance:
 * - All login attempts are logged for audit purposes
 * - Failed login attempts trigger security monitoring
 * - Session expiration enforced based on healthcare industry standards
 *
 * @example
 * ```tsx
 * const loginData: LoginForm = {
 *   email: 'nurse@example.com',
 *   password: 'securePassword123',
 *   rememberMe: false
 * };
 *
 * await authApi.login(loginData);
 * ```
 */
export interface LoginForm {
  email: string
  password: string
  rememberMe?: boolean
}
