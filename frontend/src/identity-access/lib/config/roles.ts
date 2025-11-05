/**
 * Centralized Role Configuration
 *
 * Single source of truth for role hierarchy and role-related types.
 * Used across the application for consistent role handling.
 *
 * @module lib/config/roles
 * @since 2025-11-04
 */

/**
 * System roles enum
 * Represents all user roles in the system
 */
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  DISTRICT_ADMIN = 'DISTRICT_ADMIN',
  SCHOOL_ADMIN = 'SCHOOL_ADMIN',
  SCHOOL_NURSE = 'SCHOOL_NURSE',
  NURSE = 'NURSE',
  OFFICE_STAFF = 'OFFICE_STAFF',
  STAFF = 'STAFF',
  COUNSELOR = 'COUNSELOR',
  VIEWER = 'VIEWER',
  PARENT = 'PARENT',
  STUDENT = 'STUDENT',
}

/**
 * Role hierarchy for permission inheritance and comparison
 * Higher values indicate higher privilege levels
 *
 * Used for:
 * - Permission inheritance (higher roles inherit lower role permissions)
 * - Role comparison (checking if user has minimum required role)
 * - Authorization checks across the application
 */
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  [UserRole.SUPER_ADMIN]: 100,
  [UserRole.ADMIN]: 90,
  [UserRole.DISTRICT_ADMIN]: 80,
  [UserRole.SCHOOL_ADMIN]: 70,
  [UserRole.SCHOOL_NURSE]: 65,
  [UserRole.NURSE]: 60,
  [UserRole.COUNSELOR]: 50,
  [UserRole.OFFICE_STAFF]: 45,
  [UserRole.STAFF]: 40,
  [UserRole.VIEWER]: 30,
  [UserRole.PARENT]: 20,
  [UserRole.STUDENT]: 10,
};

/**
 * Check if a user role has minimum required role level
 *
 * @param userRole - The user's current role
 * @param minimumRole - The minimum required role
 * @returns true if user role meets or exceeds minimum role
 *
 * @example
 * ```typescript
 * hasMinimumRole(UserRole.NURSE, UserRole.STAFF) // true (NURSE > STAFF)
 * hasMinimumRole(UserRole.VIEWER, UserRole.NURSE) // false (VIEWER < NURSE)
 * ```
 */
export function hasMinimumRole(userRole: UserRole | string, minimumRole: UserRole | string): boolean {
  const userLevel = ROLE_HIERARCHY[userRole as UserRole] || 0;
  const requiredLevel = ROLE_HIERARCHY[minimumRole as UserRole] || 0;

  return userLevel >= requiredLevel;
}

/**
 * Compare two roles
 *
 * @param role1 - First role
 * @param role2 - Second role
 * @returns Negative if role1 < role2, 0 if equal, positive if role1 > role2
 */
export function compareRoles(role1: UserRole | string, role2: UserRole | string): number {
  const level1 = ROLE_HIERARCHY[role1 as UserRole] || 0;
  const level2 = ROLE_HIERARCHY[role2 as UserRole] || 0;

  return level1 - level2;
}

/**
 * Get role level
 *
 * @param role - Role to get level for
 * @returns Numeric level of the role (higher = more privileged)
 */
export function getRoleLevel(role: UserRole | string): number {
  return ROLE_HIERARCHY[role as UserRole] || 0;
}

/**
 * Check if role exists in system
 *
 * @param role - Role to check
 * @returns true if role is valid
 */
export function isValidRole(role: string): role is UserRole {
  return Object.values(UserRole).includes(role as UserRole);
}

/**
 * Get all roles at or above a certain level
 *
 * @param minimumRole - Minimum role level
 * @returns Array of roles that meet the minimum level
 */
export function getRolesAbove(minimumRole: UserRole | string): UserRole[] {
  const minLevel = ROLE_HIERARCHY[minimumRole as UserRole] || 0;

  return Object.entries(ROLE_HIERARCHY)
    .filter(([_, level]) => level >= minLevel)
    .map(([role]) => role as UserRole);
}

/**
 * Get all roles below a certain level
 *
 * @param maximumRole - Maximum role level
 * @returns Array of roles below the maximum level
 */
export function getRolesBelow(maximumRole: UserRole | string): UserRole[] {
  const maxLevel = ROLE_HIERARCHY[maximumRole as UserRole] || 0;

  return Object.entries(ROLE_HIERARCHY)
    .filter(([_, level]) => level < maxLevel)
    .map(([role]) => role as UserRole);
}

/**
 * Role type for string literals
 */
export type Role = keyof typeof ROLE_HIERARCHY;

/**
 * Get human-readable role name
 *
 * @param role - Role to format
 * @returns Formatted role name
 */
export function formatRoleName(role: UserRole | string): string {
  const roleMap: Record<string, string> = {
    [UserRole.SUPER_ADMIN]: 'Super Administrator',
    [UserRole.ADMIN]: 'Administrator',
    [UserRole.DISTRICT_ADMIN]: 'District Administrator',
    [UserRole.SCHOOL_ADMIN]: 'School Administrator',
    [UserRole.SCHOOL_NURSE]: 'School Nurse',
    [UserRole.NURSE]: 'Nurse',
    [UserRole.OFFICE_STAFF]: 'Office Staff',
    [UserRole.STAFF]: 'Staff',
    [UserRole.COUNSELOR]: 'Counselor',
    [UserRole.VIEWER]: 'Viewer',
    [UserRole.PARENT]: 'Parent',
    [UserRole.STUDENT]: 'Student',
  };

  return roleMap[role] || role;
}
