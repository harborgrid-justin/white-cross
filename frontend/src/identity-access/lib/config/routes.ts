/**
 * Centralized Route Configuration
 *
 * This module defines all application routes, their access levels,
 * and required permissions. Used by middleware, guards, and navigation.
 *
 * @module identity-access/lib/config/routes
 * @since 2025-11-04
 */

/**
 * Public routes - accessible without authentication
 */
export const PUBLIC_ROUTES = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/session-expired',
  '/access-denied',
  '/unauthorized',
  '/404',
  '/500',
] as const;

/**
 * Protected routes - require authentication
 */
export const PROTECTED_ROUTES = [
  '/dashboard',
  '/profile',
  '/settings',
  '/notifications',
  '/students',
  '/medications',
  '/appointments',
  '/health-records',
  '/incidents',
  '/inventory',
  '/communications',
  '/emergency-contacts',
] as const;

/**
 * Admin routes - require admin role or higher
 */
export const ADMIN_ROUTES = [
  '/admin',
  '/users',
  '/compliance',
  '/analytics',
  '/audit',
  '/system-settings',
] as const;

/**
 * API routes configuration
 */
export const API_ROUTES = {
  PUBLIC: [
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/forgot-password',
    '/api/auth/reset-password',
    '/api/health',
  ],
  PROTECTED: [
    '/api/user',
    '/api/profile',
    '/api/students',
    '/api/medications',
    '/api/appointments',
    '/api/health-records',
    '/api/incidents',
    '/api/inventory',
    '/api/communications',
    '/api/emergency-contacts',
  ],
  ADMIN: [
    '/api/users',
    '/api/compliance',
    '/api/analytics',
    '/api/audit',
    '/api/admin',
  ],
} as const;

/**
 * Route permissions mapping
 * Maps routes to required permissions
 */
export const ROUTE_PERMISSIONS = {
  // Dashboard
  '/dashboard': ['view_dashboard'],

  // Students
  '/students': ['students:read'],
  '/students/new': ['students:create'],
  '/students/[id]': ['students:read'],
  '/students/[id]/edit': ['students:update'],
  '/students/[id]/delete': ['students:delete'],

  // Medications
  '/medications': ['medications:read'],
  '/medications/new': ['medications:create'],
  '/medications/[id]': ['medications:read'],
  '/medications/[id]/edit': ['medications:update'],
  '/medications/[id]/administer': ['medications:administer'],

  // Appointments
  '/appointments': ['appointments:read'],
  '/appointments/new': ['appointments:create'],
  '/appointments/[id]': ['appointments:read'],
  '/appointments/[id]/edit': ['appointments:update'],
  '/appointments/[id]/cancel': ['appointments:delete'],

  // Health Records
  '/health-records': ['health-records:read'],
  '/health-records/new': ['health-records:create'],
  '/health-records/[id]': ['health-records:read'],
  '/health-records/[id]/edit': ['health-records:update'],

  // Incidents
  '/incidents': ['incidents:read'],
  '/incidents/new': ['incidents:create'],
  '/incidents/[id]': ['incidents:read'],
  '/incidents/[id]/edit': ['incidents:update'],

  // Inventory
  '/inventory': ['inventory:read'],
  '/inventory/new': ['inventory:create'],
  '/inventory/[id]': ['inventory:read'],
  '/inventory/[id]/edit': ['inventory:update'],

  // Communications
  '/communications': ['communications:read'],
  '/communications/new': ['communications:create'],

  // Emergency Contacts
  '/emergency-contacts': ['emergency-contacts:read'],
  '/emergency-contacts/new': ['emergency-contacts:create'],

  // Compliance
  '/compliance': ['compliance:read'],
  '/compliance/reports': ['compliance:read'],

  // Analytics
  '/analytics': ['analytics:read'],

  // Audit
  '/audit': ['audit:read'],

  // Users
  '/users': ['users:read'],
  '/users/new': ['users:create'],
  '/users/[id]': ['users:read'],
  '/users/[id]/edit': ['users:update'],

  // Settings
  '/settings': ['settings:read'],
  '/settings/edit': ['settings:update'],

  // Admin
  '/admin': ['admin:read'],
} as const;

/**
 * Role-based route access
 * Maps routes to minimum required roles
 */
export const ROUTE_ROLES = {
  // Admin-only routes
  '/admin': ['SUPER_ADMIN', 'ADMIN'],
  '/users': ['SUPER_ADMIN', 'ADMIN', 'DISTRICT_ADMIN'],
  '/compliance': ['SUPER_ADMIN', 'ADMIN', 'DISTRICT_ADMIN'],
  '/analytics': ['SUPER_ADMIN', 'ADMIN', 'DISTRICT_ADMIN', 'SCHOOL_ADMIN'],
  '/audit': ['SUPER_ADMIN', 'ADMIN'],

  // School admin routes
  '/system-settings': ['SUPER_ADMIN', 'ADMIN', 'SCHOOL_ADMIN'],

  // Clinical routes
  '/medications': ['SUPER_ADMIN', 'ADMIN', 'SCHOOL_ADMIN', 'SCHOOL_NURSE', 'NURSE'],
  '/health-records': ['SUPER_ADMIN', 'ADMIN', 'SCHOOL_ADMIN', 'SCHOOL_NURSE', 'NURSE', 'COUNSELOR'],

  // General access (all authenticated users)
  '/dashboard': ['SUPER_ADMIN', 'ADMIN', 'DISTRICT_ADMIN', 'SCHOOL_ADMIN', 'SCHOOL_NURSE', 'NURSE', 'OFFICE_STAFF', 'STAFF', 'COUNSELOR', 'VIEWER'],
  '/profile': ['SUPER_ADMIN', 'ADMIN', 'DISTRICT_ADMIN', 'SCHOOL_ADMIN', 'SCHOOL_NURSE', 'NURSE', 'OFFICE_STAFF', 'STAFF', 'COUNSELOR', 'VIEWER'],
  '/students': ['SUPER_ADMIN', 'ADMIN', 'DISTRICT_ADMIN', 'SCHOOL_ADMIN', 'SCHOOL_NURSE', 'NURSE', 'OFFICE_STAFF', 'STAFF', 'COUNSELOR', 'VIEWER'],
} as const;

/**
 * Default redirect paths by role
 * Where users should land after login
 */
export const DEFAULT_REDIRECT_BY_ROLE = {
  SUPER_ADMIN: '/admin',
  ADMIN: '/admin',
  DISTRICT_ADMIN: '/analytics',
  SCHOOL_ADMIN: '/dashboard',
  SCHOOL_NURSE: '/dashboard',
  NURSE: '/dashboard',
  OFFICE_STAFF: '/dashboard',
  STAFF: '/dashboard',
  COUNSELOR: '/dashboard',
  VIEWER: '/dashboard',
} as const;

/**
 * Route metadata
 */
export interface RouteMetadata {
  path: string;
  title: string;
  description?: string;
  requiresAuth: boolean;
  permissions?: string[];
  roles?: string[];
}

/**
 * All routes metadata
 */
export const ROUTES_METADATA: Record<string, RouteMetadata> = {
  // Public routes
  '/login': {
    path: '/login',
    title: 'Login',
    requiresAuth: false,
  },
  '/forgot-password': {
    path: '/forgot-password',
    title: 'Forgot Password',
    requiresAuth: false,
  },

  // Protected routes
  '/dashboard': {
    path: '/dashboard',
    title: 'Dashboard',
    description: 'Main application dashboard',
    requiresAuth: true,
    permissions: ['view_dashboard'],
  },
  '/students': {
    path: '/students',
    title: 'Students',
    description: 'Student management',
    requiresAuth: true,
    permissions: ['students:read'],
  },
  '/medications': {
    path: '/medications',
    title: 'Medications',
    description: 'Medication management',
    requiresAuth: true,
    permissions: ['medications:read'],
    roles: ['NURSE', 'SCHOOL_NURSE', 'SCHOOL_ADMIN', 'ADMIN', 'SUPER_ADMIN'],
  },

  // Admin routes
  '/admin': {
    path: '/admin',
    title: 'Administration',
    description: 'System administration',
    requiresAuth: true,
    permissions: ['admin:read'],
    roles: ['ADMIN', 'SUPER_ADMIN'],
  },
  '/users': {
    path: '/users',
    title: 'User Management',
    description: 'Manage system users',
    requiresAuth: true,
    permissions: ['users:read'],
    roles: ['ADMIN', 'SUPER_ADMIN', 'DISTRICT_ADMIN'],
  },
};

/**
 * Type guards
 */
export type PublicRoute = typeof PUBLIC_ROUTES[number];
export type ProtectedRoute = typeof PROTECTED_ROUTES[number];
export type AdminRoute = typeof ADMIN_ROUTES[number];
export type Permission = string;
export type Role = keyof typeof DEFAULT_REDIRECT_BY_ROLE;

/**
 * Utility functions
 */

/**
 * Check if a route is public
 */
export function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some((route) => pathname === route || pathname.startsWith(route));
}

/**
 * Check if a route requires admin access
 */
export function isAdminRoute(pathname: string): boolean {
  return ADMIN_ROUTES.some((route) => pathname === route || pathname.startsWith(route));
}

/**
 * Get required permissions for a route
 */
export function getRoutePermissions(pathname: string): string[] | undefined {
  // Try exact match first
  if (pathname in ROUTE_PERMISSIONS) {
    return ROUTE_PERMISSIONS[pathname as keyof typeof ROUTE_PERMISSIONS];
  }

  // Try pattern matching for dynamic routes
  for (const [route, permissions] of Object.entries(ROUTE_PERMISSIONS)) {
    const pattern = route.replace(/\[([^\]]+)\]/g, '([^/]+)');
    const regex = new RegExp(`^${pattern}$`);

    if (regex.test(pathname)) {
      return permissions;
    }
  }

  return undefined;
}

/**
 * Get required roles for a route
 */
export function getRouteRoles(pathname: string): string[] | undefined {
  // Try exact match first
  if (pathname in ROUTE_ROLES) {
    return ROUTE_ROLES[pathname as keyof typeof ROUTE_ROLES];
  }

  // Try pattern matching for dynamic routes
  for (const [route, roles] of Object.entries(ROUTE_ROLES)) {
    const pattern = route.replace(/\[([^\]]+)\]/g, '([^/]+)');
    const regex = new RegExp(`^${pattern}$`);

    if (regex.test(pathname)) {
      return roles;
    }
  }

  return undefined;
}

/**
 * Get default redirect for a role
 */
export function getDefaultRedirect(role: Role): string {
  return DEFAULT_REDIRECT_BY_ROLE[role] || '/dashboard';
}

/**
 * Get route metadata
 */
export function getRouteMetadata(pathname: string): RouteMetadata | undefined {
  return ROUTES_METADATA[pathname];
}

/**
 * Check if user role has access to route
 */
export function hasRouteAccess(userRole: string, pathname: string): boolean {
  const requiredRoles = getRouteRoles(pathname);

  // No specific roles required - allow access
  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

  // Check if user role is in required roles
  return requiredRoles.includes(userRole);
}
