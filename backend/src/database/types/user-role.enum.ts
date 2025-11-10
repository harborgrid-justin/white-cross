/**
 * User Role Enumeration
 * Defines the different roles available in the White Cross system
 *
 * Extracted to prevent circular dependencies between types and models
 */

export enum UserRole {
  ADMIN = 'ADMIN',
  NURSE = 'NURSE',
  SCHOOL_ADMIN = 'SCHOOL_ADMIN',
  DISTRICT_ADMIN = 'DISTRICT_ADMIN',
  VIEWER = 'VIEWER',
  COUNSELOR = 'COUNSELOR',
}

/**
 * Type guard to check if a value is a valid UserRole
 */
export function isUserRole(value: unknown): value is UserRole {
  return (
    typeof value === 'string' &&
    Object.values(UserRole).includes(value as UserRole)
  );
}

/**
 * Get display name for a user role
 */
export function getUserRoleDisplayName(role: UserRole): string {
  const displayNames: Record<UserRole, string> = {
    [UserRole.ADMIN]: 'Administrator',
    [UserRole.NURSE]: 'Nurse',
    [UserRole.SCHOOL_ADMIN]: 'School Administrator',
    [UserRole.DISTRICT_ADMIN]: 'District Administrator',
    [UserRole.VIEWER]: 'Viewer',
    [UserRole.COUNSELOR]: 'Counselor',
  };
  return displayNames[role];
}
