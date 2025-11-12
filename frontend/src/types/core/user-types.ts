/**
 * WF-COMP-319 | user-types.ts - User Entity Type Definitions
 * Purpose: User entity and authentication-related types
 * Upstream: Backend User model | Dependencies: enumerations
 * Downstream: Auth services, user components, RBAC | Called by: Authentication system
 * Related: Base entities, enumerations
 * Exports: User interface | Key Features: User profile and permissions
 * Last Updated: 2025-11-12 | File Type: .ts
 * Critical Path: Login → User fetch → Role check → Permission validation → UI render
 * LLM Context: User entity types, part of type system refactoring
 */

/**
 * User Types Module
 *
 * Defines the User entity and related authentication/authorization types.
 * These types are aligned with the backend User model.
 *
 * @module types/core/user-types
 * @category Types
 */

/**
 * User entity representing authenticated system users.
 *
 * Aligned with backend User model. Contains user profile information,
 * authentication status, and organizational relationships.
 *
 * **Security Note**: Sensitive fields (password, tokens, secrets) are
 * excluded from frontend types for security.
 *
 * **PHI Warning**: firstName and lastName may be considered PHI in
 * healthcare context. Handle according to HIPAA requirements.
 *
 * @property {string} id - Unique user identifier (UUID v4)
 * @property {string} email - User email address (unique, used for login)
 * @property {string} firstName - User's first name (1-100 chars)
 * @property {string} lastName - User's last name (1-100 chars)
 * @property {string} role - User role (see UserRole type)
 * @property {string[]} [permissions] - User permissions for RBAC
 * @property {unknown} [user] - Optional nested user data for complex authentication scenarios
 * @property {boolean} isActive - Account active status (inactive users cannot login)
 * @property {string} [lastLogin] - ISO 8601 timestamp of last successful login
 * @property {string} [schoolId] - Associated school UUID (for school-level users)
 * @property {string} [districtId] - Associated district UUID (for district-level users)
 * @property {string} [phone] - Contact phone number (E.164 format preferred)
 * @property {boolean} emailVerified - Email verification status
 * @property {boolean} twoFactorEnabled - Two-factor authentication enabled status
 * @property {string} [lockoutUntil] - ISO 8601 timestamp until account is locked
 * @property {string} [lastPasswordChange] - ISO 8601 timestamp of last password change
 * @property {boolean} mustChangePassword - Forces password change on next login
 * @property {string} createdAt - ISO 8601 creation timestamp
 * @property {string} updatedAt - ISO 8601 last update timestamp
 *
 * @see {@link backend/src/database/models/core/User.ts} Backend User model
 *
 * @example
 * ```typescript
 * const user: User = {
 *   id: 'a1b2c3d4-...',
 *   email: 'nurse@school.edu',
 *   firstName: 'Jane',
 *   lastName: 'Smith',
 *   role: 'NURSE',
 *   isActive: true,
 *   emailVerified: true,
 *   twoFactorEnabled: false,
 *   mustChangePassword: false,
 *   createdAt: '2025-01-15T10:00:00Z',
 *   updatedAt: '2025-01-15T10:00:00Z'
 * };
 * ```
 */
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  permissions?: string[];
  user?: unknown;
  isActive: boolean;
  lastLogin?: string;
  schoolId?: string;
  districtId?: string;
  phone?: string;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  lockoutUntil?: string;
  lastPasswordChange?: string;
  mustChangePassword: boolean;
  createdAt: string;
  updatedAt: string;
}
