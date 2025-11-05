/**
 * Role-Based Access Control (RBAC) Middleware
 *
 * This middleware implements fine-grained permission checking based on user roles
 * and resource access patterns for the White Cross healthcare platform.
 *
 * @module middleware/rbac
 * @since 2025-10-26
 */

import { NextRequest, NextResponse } from 'next/server';

/**
 * User roles matching backend RBAC system
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
}

/**
 * Resource types for permission checking
 */
export enum Resource {
  STUDENTS = 'students',
  MEDICATIONS = 'medications',
  APPOINTMENTS = 'appointments',
  HEALTH_RECORDS = 'health-records',
  INCIDENTS = 'incidents',
  INVENTORY = 'inventory',
  COMMUNICATIONS = 'communications',
  EMERGENCY_CONTACTS = 'emergency-contacts',
  COMPLIANCE = 'compliance',
  ANALYTICS = 'analytics',
  AUDIT = 'audit',
  USERS = 'users',
  SETTINGS = 'settings',
  ADMIN = 'admin',
}

/**
 * Actions that can be performed on resources
 */
export enum Action {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  ADMINISTER = 'administer',
  EXPORT = 'export',
  IMPORT = 'import',
}

/**
 * Permission format: resource:action
 * Special permission: * (all permissions)
 */
type Permission = string;

/**
 * Role-based permission matrix
 * Each role has a list of permissions in the format "resource:action"
 */
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  // Super Admin - Full access to everything
  [UserRole.SUPER_ADMIN]: ['*'],

  // Admin - Full access except super admin functions
  [UserRole.ADMIN]: [
    `${Resource.STUDENTS}:*`,
    `${Resource.MEDICATIONS}:*`,
    `${Resource.APPOINTMENTS}:*`,
    `${Resource.HEALTH_RECORDS}:*`,
    `${Resource.INCIDENTS}:*`,
    `${Resource.INVENTORY}:*`,
    `${Resource.COMMUNICATIONS}:*`,
    `${Resource.EMERGENCY_CONTACTS}:*`,
    `${Resource.COMPLIANCE}:${Action.READ}`,
    `${Resource.ANALYTICS}:${Action.READ}`,
    `${Resource.AUDIT}:${Action.READ}`,
    `${Resource.USERS}:*`,
    `${Resource.SETTINGS}:*`,
    `${Resource.ADMIN}:${Action.READ}`,
  ],

  // District Admin - Multi-school oversight
  [UserRole.DISTRICT_ADMIN]: [
    `${Resource.STUDENTS}:${Action.READ}`,
    `${Resource.STUDENTS}:${Action.UPDATE}`,
    `${Resource.MEDICATIONS}:${Action.READ}`,
    `${Resource.APPOINTMENTS}:${Action.READ}`,
    `${Resource.HEALTH_RECORDS}:${Action.READ}`,
    `${Resource.INCIDENTS}:${Action.READ}`,
    `${Resource.INVENTORY}:${Action.READ}`,
    `${Resource.COMMUNICATIONS}:${Action.READ}`,
    `${Resource.COMMUNICATIONS}:${Action.CREATE}`,
    `${Resource.EMERGENCY_CONTACTS}:${Action.READ}`,
    `${Resource.COMPLIANCE}:${Action.READ}`,
    `${Resource.ANALYTICS}:${Action.READ}`,
    `${Resource.AUDIT}:${Action.READ}`,
    `${Resource.USERS}:${Action.READ}`,
    `${Resource.SETTINGS}:${Action.READ}`,
    `${Resource.ADMIN}:${Action.READ}`,
  ],

  // School Admin - Single school management
  [UserRole.SCHOOL_ADMIN]: [
    `${Resource.STUDENTS}:${Action.READ}`,
    `${Resource.STUDENTS}:${Action.UPDATE}`,
    `${Resource.MEDICATIONS}:${Action.READ}`,
    `${Resource.MEDICATIONS}:${Action.UPDATE}`,
    `${Resource.APPOINTMENTS}:*`,
    `${Resource.HEALTH_RECORDS}:${Action.READ}`,
    `${Resource.HEALTH_RECORDS}:${Action.UPDATE}`,
    `${Resource.INCIDENTS}:${Action.READ}`,
    `${Resource.INCIDENTS}:${Action.UPDATE}`,
    `${Resource.INVENTORY}:${Action.READ}`,
    `${Resource.COMMUNICATIONS}:${Action.READ}`,
    `${Resource.COMMUNICATIONS}:${Action.CREATE}`,
    `${Resource.EMERGENCY_CONTACTS}:${Action.READ}`,
    `${Resource.ANALYTICS}:${Action.READ}`,
    `${Resource.USERS}:${Action.READ}`,
    `${Resource.SETTINGS}:${Action.READ}`,
  ],

  // School Nurse - Clinical operations
  [UserRole.SCHOOL_NURSE]: [
    `${Resource.STUDENTS}:${Action.READ}`,
    `${Resource.STUDENTS}:${Action.UPDATE}`,
    `${Resource.MEDICATIONS}:*`,
    `${Resource.APPOINTMENTS}:*`,
    `${Resource.HEALTH_RECORDS}:*`,
    `${Resource.INCIDENTS}:*`,
    `${Resource.INVENTORY}:${Action.READ}`,
    `${Resource.INVENTORY}:${Action.UPDATE}`,
    `${Resource.COMMUNICATIONS}:${Action.READ}`,
    `${Resource.COMMUNICATIONS}:${Action.CREATE}`,
    `${Resource.EMERGENCY_CONTACTS}:${Action.READ}`,
    `${Resource.EMERGENCY_CONTACTS}:${Action.CREATE}`,
  ],

  // Nurse - Same as School Nurse (alias)
  [UserRole.NURSE]: [
    `${Resource.STUDENTS}:${Action.READ}`,
    `${Resource.STUDENTS}:${Action.UPDATE}`,
    `${Resource.MEDICATIONS}:*`,
    `${Resource.APPOINTMENTS}:*`,
    `${Resource.HEALTH_RECORDS}:*`,
    `${Resource.INCIDENTS}:*`,
    `${Resource.INVENTORY}:${Action.READ}`,
    `${Resource.INVENTORY}:${Action.UPDATE}`,
    `${Resource.COMMUNICATIONS}:${Action.READ}`,
    `${Resource.COMMUNICATIONS}:${Action.CREATE}`,
    `${Resource.EMERGENCY_CONTACTS}:${Action.READ}`,
    `${Resource.EMERGENCY_CONTACTS}:${Action.CREATE}`,
  ],

  // Office Staff - Administrative support
  [UserRole.OFFICE_STAFF]: [
    `${Resource.STUDENTS}:${Action.READ}`,
    `${Resource.APPOINTMENTS}:*`,
    `${Resource.EMERGENCY_CONTACTS}:${Action.READ}`,
    `${Resource.COMMUNICATIONS}:${Action.READ}`,
  ],

  // Staff - General staff (alias)
  [UserRole.STAFF]: [
    `${Resource.STUDENTS}:${Action.READ}`,
    `${Resource.APPOINTMENTS}:${Action.READ}`,
    `${Resource.EMERGENCY_CONTACTS}:${Action.READ}`,
    `${Resource.COMMUNICATIONS}:${Action.READ}`,
  ],

  // Counselor - Student support
  [UserRole.COUNSELOR]: [
    `${Resource.STUDENTS}:${Action.READ}`,
    `${Resource.APPOINTMENTS}:${Action.READ}`,
    `${Resource.HEALTH_RECORDS}:${Action.READ}`,
    `${Resource.INCIDENTS}:${Action.READ}`,
    `${Resource.COMMUNICATIONS}:${Action.READ}`,
    `${Resource.EMERGENCY_CONTACTS}:${Action.READ}`,
  ],

  // Viewer - Read-only access
  [UserRole.VIEWER]: [
    `${Resource.STUDENTS}:${Action.READ}`,
    `${Resource.APPOINTMENTS}:${Action.READ}`,
    `${Resource.HEALTH_RECORDS}:${Action.READ}`,
    `${Resource.COMMUNICATIONS}:${Action.READ}`,
  ],
};

/**
 * Route to resource and action mapping
 * Maps URL patterns to required permissions
 */
interface RoutePermission {
  resource: Resource;
  action: Action;
  pattern?: RegExp; // For dynamic route matching
}

export const ROUTE_PERMISSIONS: Record<string, RoutePermission> = {
  // Students
  '/students': { resource: Resource.STUDENTS, action: Action.READ },
  '/students/new': { resource: Resource.STUDENTS, action: Action.CREATE },
  '/students/[id]': { resource: Resource.STUDENTS, action: Action.READ },
  '/students/[id]/edit': { resource: Resource.STUDENTS, action: Action.UPDATE },
  '/students/[id]/delete': { resource: Resource.STUDENTS, action: Action.DELETE },

  // Medications
  '/medications': { resource: Resource.MEDICATIONS, action: Action.READ },
  '/medications/new': { resource: Resource.MEDICATIONS, action: Action.CREATE },
  '/medications/[id]': { resource: Resource.MEDICATIONS, action: Action.READ },
  '/medications/[id]/edit': { resource: Resource.MEDICATIONS, action: Action.UPDATE },
  '/medications/[id]/administer': { resource: Resource.MEDICATIONS, action: Action.ADMINISTER },

  // Appointments
  '/appointments': { resource: Resource.APPOINTMENTS, action: Action.READ },
  '/appointments/new': { resource: Resource.APPOINTMENTS, action: Action.CREATE },
  '/appointments/[id]': { resource: Resource.APPOINTMENTS, action: Action.READ },
  '/appointments/[id]/edit': { resource: Resource.APPOINTMENTS, action: Action.UPDATE },

  // Health Records
  '/health-records': { resource: Resource.HEALTH_RECORDS, action: Action.READ },
  '/health-records/new': { resource: Resource.HEALTH_RECORDS, action: Action.CREATE },
  '/health-records/[id]': { resource: Resource.HEALTH_RECORDS, action: Action.READ },
  '/health-records/[id]/edit': { resource: Resource.HEALTH_RECORDS, action: Action.UPDATE },

  // Incidents
  '/incidents': { resource: Resource.INCIDENTS, action: Action.READ },
  '/incidents/new': { resource: Resource.INCIDENTS, action: Action.CREATE },
  '/incidents/[id]': { resource: Resource.INCIDENTS, action: Action.READ },
  '/incidents/[id]/edit': { resource: Resource.INCIDENTS, action: Action.UPDATE },

  // Inventory
  '/inventory': { resource: Resource.INVENTORY, action: Action.READ },
  '/inventory/new': { resource: Resource.INVENTORY, action: Action.CREATE },
  '/inventory/[id]': { resource: Resource.INVENTORY, action: Action.READ },
  '/inventory/[id]/edit': { resource: Resource.INVENTORY, action: Action.UPDATE },

  // Communications
  '/communications': { resource: Resource.COMMUNICATIONS, action: Action.READ },
  '/communications/new': { resource: Resource.COMMUNICATIONS, action: Action.CREATE },

  // Emergency Contacts
  '/emergency-contacts': { resource: Resource.EMERGENCY_CONTACTS, action: Action.READ },
  '/emergency-contacts/new': { resource: Resource.EMERGENCY_CONTACTS, action: Action.CREATE },

  // Compliance
  '/compliance': { resource: Resource.COMPLIANCE, action: Action.READ },

  // Analytics
  '/analytics': { resource: Resource.ANALYTICS, action: Action.READ },

  // Audit Logs
  '/audit': { resource: Resource.AUDIT, action: Action.READ },

  // Users
  '/users': { resource: Resource.USERS, action: Action.READ },
  '/users/new': { resource: Resource.USERS, action: Action.CREATE },
  '/users/[id]': { resource: Resource.USERS, action: Action.READ },
  '/users/[id]/edit': { resource: Resource.USERS, action: Action.UPDATE },

  // Settings
  '/settings': { resource: Resource.SETTINGS, action: Action.READ },

  // Admin
  '/admin': { resource: Resource.ADMIN, action: Action.READ },
};

/**
 * Check if a user role has a specific permission
 */
export function checkPermission(role: UserRole, permission: Permission): boolean {
  const rolePermissions = ROLE_PERMISSIONS[role] || [];

  // Super admin has all permissions
  if (rolePermissions.includes('*')) {
    return true;
  }

  // Check exact permission
  if (rolePermissions.includes(permission)) {
    return true;
  }

  // Check wildcard permissions (e.g., "students:*")
  const [resource, action] = permission.split(':');
  const wildcardPermission = `${resource}:*`;

  return rolePermissions.includes(wildcardPermission);
}

/**
 * Match a pathname to a route permission
 */
function matchRoutePermission(pathname: string): RoutePermission | null {
  // Try exact match first
  if (ROUTE_PERMISSIONS[pathname]) {
    return ROUTE_PERMISSIONS[pathname];
  }

  // Try pattern matching for dynamic routes
  for (const [route, permission] of Object.entries(ROUTE_PERMISSIONS)) {
    // Convert Next.js route pattern to regex
    // e.g., /students/[id] -> /students/([^/]+)
    const pattern = route.replace(/\[([^\]]+)\]/g, '([^/]+)');
    const regex = new RegExp(`^${pattern}$`);

    if (regex.test(pathname)) {
      return permission;
    }
  }

  return null;
}

/**
 * RBAC middleware function
 */
export function rbacMiddleware(request: NextRequest): NextResponse | null {
  const { pathname } = request.nextUrl;
  const role = request.headers.get('x-user-role') as UserRole;

  if (!role) {
    console.warn('[RBAC] No user role found in request headers');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Find matching route permission
  const routePermission = matchRoutePermission(pathname);

  if (!routePermission) {
    // No specific permission required, allow access
    return null;
  }

  // Build permission string
  const requiredPermission = `${routePermission.resource}:${routePermission.action}`;

  // Check if user has permission
  if (!checkPermission(role, requiredPermission)) {
    console.warn(
      `[RBAC] Access denied: User role ${role} lacks permission ${requiredPermission} for ${pathname}`
    );
    return NextResponse.redirect(new URL('/access-denied', request.url));
  }

  // Permission granted
  return null;
}

/**
 * Get all permissions for a role
 */
export function getRolePermissions(role: UserRole): Permission[] {
  return ROLE_PERMISSIONS[role] || [];
}

/**
 * Check if a role can perform an action on a resource
 */
export function canPerformAction(
  role: UserRole,
  resource: Resource,
  action: Action
): boolean {
  const permission = `${resource}:${action}`;
  return checkPermission(role, permission);
}

/**
 * Export types and enums
 */
export type { Permission, RoutePermission };
