/**
 * @fileoverview Administration domain user-related type definitions
 * @module hooks/domains/administration/administrationUserTypes
 * @category Hooks - Administration
 *
 * Type definitions for users, roles, and permissions in the administration domain.
 *
 * @remarks
 * **RBAC Integration:**
 * - Roles provide bulk permission grants
 * - Direct permissions supplement role permissions
 * - Permission checking should combine both sources
 *
 * **HIPAA Compliance:**
 * - User actions must be logged in audit trail
 * - Access to PHI requires specific permissions
 * - Profile data should be encrypted at rest
 */

/**
 * Administrator or system user entity.
 *
 * Represents a user account with full profile information, roles, permissions,
 * and organizational affiliations. Used throughout the administration domain
 * for user management, RBAC, and audit tracking.
 *
 * @property {string} id - Unique user identifier (UUID)
 * @property {string} username - Unique username for login
 * @property {string} email - User's email address (unique, required for auth)
 * @property {string} firstName - User's first name
 * @property {string} lastName - User's last name
 * @property {string} displayName - Formatted display name (typically "firstName lastName")
 * @property {string} [avatar] - URL to user's avatar/profile image
 * @property {'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING'} status - Account status
 * @property {UserRole[]} roles - Assigned roles with permissions
 * @property {string[]} permissions - Direct permission grants (beyond roles)
 * @property {string[]} departments - Department IDs user belongs to
 * @property {string} [lastLoginAt] - ISO timestamp of last successful login
 * @property {string} createdAt - ISO timestamp of account creation
 * @property {string} updatedAt - ISO timestamp of last update
 * @property {UserProfile} profile - Extended user profile information
 *
 * @remarks
 * **Status States:**
 * - `ACTIVE`: User can log in and access assigned resources
 * - `INACTIVE`: User deactivated, cannot log in (soft delete)
 * - `SUSPENDED`: Temporarily suspended, typically for security reasons
 * - `PENDING`: New account awaiting activation/verification
 *
 * **RBAC Integration:**
 * - Roles provide bulk permission grants
 * - Direct permissions supplement role permissions
 * - Permission checking should combine both sources
 *
 * **HIPAA Compliance:**
 * - User actions must be logged in audit trail
 * - Access to PHI requires specific permissions
 * - Profile data should be encrypted at rest
 *
 * @example
 * ```typescript
 * const user: AdminUser = {
 *   id: 'usr-123',
 *   username: 'jsmith',
 *   email: 'jsmith@school.edu',
 *   firstName: 'Jane',
 *   lastName: 'Smith',
 *   displayName: 'Jane Smith',
 *   avatar: 'https://cdn.example.com/avatars/jsmith.jpg',
 *   status: 'ACTIVE',
 *   roles: [{
 *     id: 'role-1',
 *     name: 'SCHOOL_NURSE',
 *     description: 'School nurse with medication administration rights',
 *     permissions: ['administer_medication', 'view_health_records'],
 *     isSystem: true
 *   }],
 *   permissions: ['manage_inventory'],
 *   departments: ['dept-nursing'],
 *   lastLoginAt: '2025-10-26T08:30:00Z',
 *   createdAt: '2025-01-15T10:00:00Z',
 *   updatedAt: '2025-10-26T08:30:00Z',
 *   profile: {
 *     phoneNumber: '+1-555-0123',
 *     preferences: {
 *       theme: 'light',
 *       language: 'en',
 *       timezone: 'America/New_York',
 *       notifications: {
 *         email: true,
 *         sms: false,
 *         push: true,
 *         categories: { 'medication_alerts': true }
 *       }
 *     }
 *   }
 * };
 * ```
 *
 * @see {@link UserRole} for role structure
 * @see {@link UserProfile} for profile details
 * @see {@link useUserDetails} for fetching user data
 * @see {@link useUpdateUser} for updating user information
 */
export interface AdminUser {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  avatar?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING';
  roles: UserRole[];
  permissions: string[];
  departments: string[];
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
  profile: UserProfile;
}

/**
 * Role definition for RBAC system.
 *
 * @property {string} id - Unique role identifier
 * @property {string} name - Role name (e.g., 'SCHOOL_NURSE', 'ADMIN')
 * @property {string} description - Human-readable role description
 * @property {string[]} permissions - Array of permission strings granted by this role
 * @property {boolean} isSystem - Whether this is a system-defined role (cannot be deleted)
 *
 * @remarks
 * System roles are predefined and cannot be modified or deleted to ensure
 * application security. Custom roles can be created for organization-specific needs.
 */
export interface UserRole {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isSystem: boolean;
}

export interface UserProfile {
  phoneNumber?: string;
  address?: Address;
  emergencyContact?: EmergencyContact;
  preferences: UserPreferences;
  metadata?: Record<string, any>;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phoneNumber: string;
  email?: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
  notifications: NotificationPreferences;
  accessibility?: AccessibilitySettings;
}

export interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
  categories: Record<string, boolean>;
}

export interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  screenReader: boolean;
}

export interface UserActivity {
  id: string;
  userId: string;
  sessionId: string;
  action: string;
  resource?: string;
  duration?: number;
  ipAddress: string;
  userAgent: string;
  location?: string;
  timestamp: string;
}
