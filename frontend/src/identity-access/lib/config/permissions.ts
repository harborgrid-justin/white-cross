/**
 * Centralized Permission Configuration
 *
 * Single source of truth for all permission definitions and permission-checking logic.
 * Implements Role-Based Access Control (RBAC) for the White Cross platform.
 *
 * @module lib/config/permissions
 * @since 2025-11-04
 */

import { UserRole, hasMinimumRole } from './roles';

/**
 * Resource types in the system
 */
export enum Resource {
  STUDENTS = 'students',
  HEALTH_RECORDS = 'health-records',
  MEDICATIONS = 'medications',
  INCIDENTS = 'incidents',
  APPOINTMENTS = 'appointments',
  DOCUMENTS = 'documents',
  FORMS = 'forms',
  REPORTS = 'reports',
  USERS = 'users',
  SETTINGS = 'settings',
  AUDIT_LOGS = 'audit-logs',
  INVENTORY = 'inventory',
  COMMUNICATIONS = 'communications',
  EMERGENCY_CONTACTS = 'emergency-contacts',
  COMPLIANCE = 'compliance',
  ANALYTICS = 'analytics',
  ADMIN = 'admin',
}

/**
 * Action types that can be performed on resources
 */
export enum Action {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  MANAGE = 'manage',
  ADMINISTER = 'administer',
  EXPORT = 'export',
  IMPORT = 'import',
  VIEW = 'view',
  EDIT = 'edit',
  SUBMIT = 'submit',
  VIEW_RESPONSES = 'view_responses',
}

/**
 * Permission string format: "resource:action"
 * Example: "students:create", "medications:read"
 */
export type Permission = `${Resource}:${Action}` | `${Resource}:*` | '*';

/**
 * Minimum role required for each permission
 * Maps permission strings to the minimum role level needed
 */
export const PERMISSION_REQUIREMENTS: Record<string, UserRole> = {
  // Students
  'students:create': UserRole.NURSE,
  'students:read': UserRole.VIEWER,
  'students:update': UserRole.NURSE,
  'students:delete': UserRole.ADMIN,
  'students:manage': UserRole.SCHOOL_ADMIN,

  // Health Records (PHI - Protected Health Information)
  'health-records:create': UserRole.NURSE,
  'health-records:read': UserRole.NURSE,
  'health-records:update': UserRole.NURSE,
  'health-records:delete': UserRole.ADMIN,
  'health-records:manage': UserRole.ADMIN,

  // Medications
  'medications:create': UserRole.NURSE,
  'medications:read': UserRole.NURSE,
  'medications:update': UserRole.NURSE,
  'medications:delete': UserRole.SCHOOL_ADMIN,
  'medications:manage': UserRole.ADMIN,
  'medications:administer': UserRole.NURSE,

  // Incidents
  'incidents:create': UserRole.NURSE,
  'incidents:read': UserRole.COUNSELOR,
  'incidents:update': UserRole.NURSE,
  'incidents:delete': UserRole.SCHOOL_ADMIN,
  'incidents:manage': UserRole.ADMIN,

  // Appointments
  'appointments:create': UserRole.VIEWER,
  'appointments:read': UserRole.VIEWER,
  'appointments:update': UserRole.NURSE,
  'appointments:delete': UserRole.NURSE,
  'appointments:manage': UserRole.SCHOOL_ADMIN,

  // Documents
  'documents:create': UserRole.NURSE,
  'documents:read': UserRole.VIEWER,
  'documents:update': UserRole.NURSE,
  'documents:delete': UserRole.SCHOOL_ADMIN,
  'documents:manage': UserRole.ADMIN,

  // Forms
  'forms:create': UserRole.NURSE,
  'forms:read': UserRole.VIEWER,
  'forms:view': UserRole.VIEWER,
  'forms:edit': UserRole.NURSE,
  'forms:update': UserRole.NURSE,
  'forms:delete': UserRole.SCHOOL_ADMIN,
  'forms:submit': UserRole.VIEWER,
  'forms:view_responses': UserRole.NURSE,
  'forms:manage': UserRole.ADMIN,

  // Reports
  'reports:create': UserRole.NURSE,
  'reports:read': UserRole.VIEWER,
  'reports:update': UserRole.NURSE,
  'reports:delete': UserRole.ADMIN,
  'reports:manage': UserRole.ADMIN,
  'reports:export': UserRole.SCHOOL_ADMIN,

  // Users
  'users:create': UserRole.SCHOOL_ADMIN,
  'users:read': UserRole.VIEWER,
  'users:update': UserRole.SCHOOL_ADMIN,
  'users:delete': UserRole.ADMIN,
  'users:manage': UserRole.ADMIN,

  // Settings
  'settings:create': UserRole.ADMIN,
  'settings:read': UserRole.SCHOOL_ADMIN,
  'settings:update': UserRole.ADMIN,
  'settings:delete': UserRole.SUPER_ADMIN,
  'settings:manage': UserRole.SUPER_ADMIN,

  // Audit Logs
  'audit-logs:read': UserRole.SCHOOL_ADMIN,
  'audit-logs:manage': UserRole.SUPER_ADMIN,

  // Inventory
  'inventory:create': UserRole.NURSE,
  'inventory:read': UserRole.STAFF,
  'inventory:update': UserRole.NURSE,
  'inventory:delete': UserRole.SCHOOL_ADMIN,
  'inventory:manage': UserRole.ADMIN,

  // Communications
  'communications:create': UserRole.NURSE,
  'communications:read': UserRole.STAFF,
  'communications:send': UserRole.NURSE,
  'communications:broadcast': UserRole.SCHOOL_ADMIN,
  'communications:emergency': UserRole.NURSE,

  // Emergency Contacts
  'emergency-contacts:create': UserRole.NURSE,
  'emergency-contacts:read': UserRole.STAFF,
  'emergency-contacts:update': UserRole.NURSE,
  'emergency-contacts:delete': UserRole.SCHOOL_ADMIN,

  // Compliance
  'compliance:read': UserRole.SCHOOL_ADMIN,
  'compliance:manage': UserRole.ADMIN,

  // Analytics
  'analytics:read': UserRole.SCHOOL_ADMIN,
  'analytics:manage': UserRole.ADMIN,

  // Admin
  'admin:read': UserRole.SCHOOL_ADMIN,
  'admin:users': UserRole.DISTRICT_ADMIN,
  'admin:schools': UserRole.DISTRICT_ADMIN,
  'admin:districts': UserRole.ADMIN,
  'admin:settings': UserRole.SCHOOL_ADMIN,
  'admin:audit_logs': UserRole.DISTRICT_ADMIN,
  'admin:compliance': UserRole.DISTRICT_ADMIN,
};

/**
 * Role-based permission matrix
 * Maps each role to its complete set of permissions
 */
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  // Super Admin - Full access to everything
  [UserRole.SUPER_ADMIN]: ['*'],

  // Admin - Full access except super admin functions
  [UserRole.ADMIN]: [
    'students:*',
    'medications:*',
    'appointments:*',
    'health-records:*',
    'incidents:*',
    'inventory:*',
    'communications:*',
    'emergency-contacts:*',
    'forms:*',
    'documents:*',
    'reports:*',
    'users:*',
    'settings:*',
    'compliance:read',
    'analytics:read',
    'audit-logs:read',
    'admin:read',
  ],

  // District Admin - Multi-school oversight
  [UserRole.DISTRICT_ADMIN]: [
    'students:read',
    'students:update',
    'medications:read',
    'appointments:read',
    'health-records:read',
    'incidents:read',
    'inventory:read',
    'communications:read',
    'communications:create',
    'emergency-contacts:read',
    'compliance:read',
    'analytics:read',
    'audit-logs:read',
    'users:read',
    'settings:read',
    'admin:read',
    'admin:users',
    'admin:schools',
    'admin:audit_logs',
  ],

  // School Admin - Single school management
  [UserRole.SCHOOL_ADMIN]: [
    'students:read',
    'students:update',
    'medications:read',
    'medications:update',
    'appointments:*',
    'health-records:read',
    'health-records:update',
    'incidents:read',
    'incidents:update',
    'inventory:read',
    'communications:read',
    'communications:create',
    'emergency-contacts:read',
    'analytics:read',
    'users:read',
    'settings:read',
    'forms:delete',
    'admin:settings',
  ],

  // School Nurse - Same as Nurse (alias)
  [UserRole.SCHOOL_NURSE]: [
    'students:read',
    'students:update',
    'medications:*',
    'appointments:*',
    'health-records:*',
    'incidents:*',
    'inventory:read',
    'inventory:update',
    'communications:read',
    'communications:create',
    'emergency-contacts:read',
    'emergency-contacts:create',
    'forms:create',
    'forms:update',
    'forms:view_responses',
  ],

  // Nurse - Clinical operations
  [UserRole.NURSE]: [
    'students:read',
    'students:update',
    'medications:*',
    'appointments:*',
    'health-records:*',
    'incidents:*',
    'inventory:read',
    'inventory:update',
    'communications:read',
    'communications:create',
    'emergency-contacts:read',
    'emergency-contacts:create',
    'forms:create',
    'forms:update',
    'forms:view_responses',
  ],

  // Counselor - Student support
  [UserRole.COUNSELOR]: [
    'students:read',
    'appointments:read',
    'health-records:read',
    'incidents:read',
    'communications:read',
    'emergency-contacts:read',
    'reports:read',
  ],

  // Office Staff - Administrative support
  [UserRole.OFFICE_STAFF]: [
    'students:read',
    'appointments:*',
    'emergency-contacts:read',
    'communications:read',
  ],

  // Staff - General staff
  [UserRole.STAFF]: [
    'students:read',
    'appointments:read',
    'emergency-contacts:read',
    'communications:read',
    'inventory:read',
  ],

  // Viewer - Read-only access
  [UserRole.VIEWER]: [
    'students:read',
    'appointments:read',
    'health-records:read',
    'communications:read',
    'forms:read',
    'forms:submit',
    'reports:read',
  ],

  // Parent - Limited access
  [UserRole.PARENT]: [
    'appointments:read',
    'communications:read',
  ],

  // Student - Minimal access
  [UserRole.STUDENT]: [
    'appointments:read',
  ],
};

/**
 * Check if a user role has a specific permission
 *
 * @param role - User's role
 * @param permission - Permission to check
 * @returns true if user has permission
 *
 * @example
 * ```typescript
 * checkPermission(UserRole.NURSE, 'students:read') // true
 * checkPermission(UserRole.VIEWER, 'students:delete') // false
 * ```
 */
export function checkPermission(role: UserRole | string, permission: string): boolean {
  const userRole = role as UserRole;
  const rolePermissions = ROLE_PERMISSIONS[userRole] || [];

  // Super admin has all permissions
  if (rolePermissions.includes('*')) {
    return true;
  }

  // Check exact permission
  if (rolePermissions.includes(permission as Permission)) {
    return true;
  }

  // Check wildcard permissions (e.g., "students:*")
  const [resource, action] = permission.split(':');
  const wildcardPermission = `${resource}:*` as Permission;

  if (rolePermissions.includes(wildcardPermission)) {
    return true;
  }

  // Check minimum role requirement
  const minimumRole = PERMISSION_REQUIREMENTS[permission];
  if (minimumRole && hasMinimumRole(userRole, minimumRole)) {
    return true;
  }

  return false;
}

/**
 * Get all permissions for a role
 *
 * @param role - User role
 * @returns Array of permissions for the role
 */
export function getRolePermissions(role: UserRole | string): Permission[] {
  return ROLE_PERMISSIONS[role as UserRole] || [];
}

/**
 * Check if role can perform action on resource
 *
 * @param role - User role
 * @param resource - Resource to access
 * @param action - Action to perform
 * @returns true if allowed
 */
export function canPerformAction(
  role: UserRole | string,
  resource: Resource | string,
  action: Action | string
): boolean {
  const permission = `${resource}:${action}`;
  return checkPermission(role, permission);
}

/**
 * Get minimum role required for a permission
 *
 * @param permission - Permission string
 * @returns Minimum required role or null if not defined
 */
export function getMinimumRole(permission: string): UserRole | null {
  return PERMISSION_REQUIREMENTS[permission] || null;
}

/**
 * Check multiple permissions (requires ALL)
 *
 * @param role - User role
 * @param permissions - Array of required permissions
 * @returns true if user has all permissions
 */
export function checkAllPermissions(role: UserRole | string, permissions: string[]): boolean {
  return permissions.every(permission => checkPermission(role, permission));
}

/**
 * Check if user has any of the specified permissions (requires ANY)
 *
 * @param role - User role
 * @param permissions - Array of permissions
 * @returns true if user has at least one permission
 */
export function checkAnyPermission(role: UserRole | string, permissions: string[]): boolean {
  return permissions.some(permission => checkPermission(role, permission));
}
