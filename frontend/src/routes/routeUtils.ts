/**
 * Route Utilities for White Cross Healthcare Platform
 *
 * Provides utility functions for route management including:
 * - Route accessibility checking
 * - Permission resolution
 * - Parameter validation
 * - Breadcrumb generation
 * - Route metadata management
 *
 * @module routes/routeUtils
 */

import { User } from '../types';
import { PROTECTED_ROUTES, PUBLIC_ROUTES } from '../constants/routes';
import { isValidUUID, isValidNumber, isValidEnum, UserRole, Permission } from './guards';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Route metadata for breadcrumbs and navigation
 */
export interface RouteMetadata {
  path: string;
  title: string;
  icon?: string;
  parent?: string;
  roles?: UserRole[];
  permissions?: Permission[];
  hidden?: boolean;
}

/**
 * Breadcrumb item for navigation
 */
export interface Breadcrumb {
  label: string;
  path: string;
  icon?: string;
  isActive: boolean;
}

/**
 * Route accessibility result
 */
export interface RouteAccessibility {
  isAccessible: boolean;
  reason?: 'not_authenticated' | 'insufficient_role' | 'missing_permission' | 'feature_disabled';
  message?: string;
}

/**
 * Parameter validation result
 */
export interface ParamValidationResult {
  isValid: boolean;
  errors: {
    param: string;
    message: string;
  }[];
}

// ============================================================================
// ROUTE METADATA REGISTRY
// ============================================================================

/**
 * Route metadata registry
 * Maps route paths to their metadata for breadcrumb generation and navigation
 */
export const ROUTE_METADATA: Record<string, RouteMetadata> = {
  // Dashboard
  [PROTECTED_ROUTES.DASHBOARD]: {
    path: PROTECTED_ROUTES.DASHBOARD,
    title: 'Dashboard',
    icon: 'Home',
  },

  // Students
  [PROTECTED_ROUTES.STUDENTS]: {
    path: PROTECTED_ROUTES.STUDENTS,
    title: 'Students',
    icon: 'Users',
    roles: ['ADMIN', 'NURSE', 'COUNSELOR', 'READ_ONLY'],
  },
  [PROTECTED_ROUTES.STUDENTS_LIST]: {
    path: PROTECTED_ROUTES.STUDENTS_LIST,
    title: 'Student List',
    parent: PROTECTED_ROUTES.STUDENTS,
    hidden: true,
  },
  [PROTECTED_ROUTES.STUDENTS_CREATE]: {
    path: PROTECTED_ROUTES.STUDENTS_CREATE,
    title: 'New Student',
    parent: PROTECTED_ROUTES.STUDENTS,
    roles: ['ADMIN', 'NURSE'],
    permissions: ['students.create'],
  },
  [PROTECTED_ROUTES.STUDENTS_DETAIL]: {
    path: PROTECTED_ROUTES.STUDENTS_DETAIL,
    title: 'Student Details',
    parent: PROTECTED_ROUTES.STUDENTS,
  },
  [PROTECTED_ROUTES.STUDENTS_EDIT]: {
    path: PROTECTED_ROUTES.STUDENTS_EDIT,
    title: 'Edit Student',
    parent: PROTECTED_ROUTES.STUDENTS_DETAIL,
    roles: ['ADMIN', 'NURSE'],
    permissions: ['students.update'],
  },

  // Medications
  [PROTECTED_ROUTES.MEDICATIONS]: {
    path: PROTECTED_ROUTES.MEDICATIONS,
    title: 'Medications',
    icon: 'Pill',
    roles: ['ADMIN', 'NURSE', 'READ_ONLY'],
  },
  [PROTECTED_ROUTES.MEDICATIONS_LIST]: {
    path: PROTECTED_ROUTES.MEDICATIONS_LIST,
    title: 'Medication List',
    parent: PROTECTED_ROUTES.MEDICATIONS,
    hidden: true,
  },
  [PROTECTED_ROUTES.MEDICATIONS_CREATE]: {
    path: PROTECTED_ROUTES.MEDICATIONS_CREATE,
    title: 'New Medication',
    parent: PROTECTED_ROUTES.MEDICATIONS,
    roles: ['ADMIN', 'NURSE'],
    permissions: ['medications.create'],
  },
  [PROTECTED_ROUTES.MEDICATIONS_DETAIL]: {
    path: PROTECTED_ROUTES.MEDICATIONS_DETAIL,
    title: 'Medication Details',
    parent: PROTECTED_ROUTES.MEDICATIONS,
  },
  [PROTECTED_ROUTES.MEDICATIONS_ADMINISTER]: {
    path: PROTECTED_ROUTES.MEDICATIONS_ADMINISTER,
    title: 'Administer Medication',
    parent: PROTECTED_ROUTES.MEDICATIONS_DETAIL,
    roles: ['ADMIN', 'NURSE'],
    permissions: ['medications.administer'],
  },

  // Health Records
  [PROTECTED_ROUTES.HEALTH_RECORDS]: {
    path: PROTECTED_ROUTES.HEALTH_RECORDS,
    title: 'Health Records',
    icon: 'FileText',
    roles: ['ADMIN', 'NURSE', 'COUNSELOR', 'READ_ONLY'],
  },
  [PROTECTED_ROUTES.HEALTH_RECORDS_LIST]: {
    path: PROTECTED_ROUTES.HEALTH_RECORDS_LIST,
    title: 'Health Records',
    parent: PROTECTED_ROUTES.HEALTH_RECORDS,
    hidden: true,
  },
  [PROTECTED_ROUTES.HEALTH_RECORDS_CREATE]: {
    path: PROTECTED_ROUTES.HEALTH_RECORDS_CREATE,
    title: 'New Health Record',
    parent: PROTECTED_ROUTES.HEALTH_RECORDS,
    roles: ['ADMIN', 'NURSE'],
    permissions: ['health_records.create'],
  },
  [PROTECTED_ROUTES.HEALTH_RECORDS_DETAIL]: {
    path: PROTECTED_ROUTES.HEALTH_RECORDS_DETAIL,
    title: 'Health Record Details',
    parent: PROTECTED_ROUTES.HEALTH_RECORDS,
  },

  // Appointments
  [PROTECTED_ROUTES.APPOINTMENTS]: {
    path: PROTECTED_ROUTES.APPOINTMENTS,
    title: 'Appointments',
    icon: 'Calendar',
    roles: ['ADMIN', 'NURSE', 'READ_ONLY'],
  },
  [PROTECTED_ROUTES.APPOINTMENTS_CREATE]: {
    path: PROTECTED_ROUTES.APPOINTMENTS_CREATE,
    title: 'Schedule Appointment',
    parent: PROTECTED_ROUTES.APPOINTMENTS,
    roles: ['ADMIN', 'NURSE'],
    permissions: ['appointments.create'],
  },
  [PROTECTED_ROUTES.APPOINTMENTS_DETAIL]: {
    path: PROTECTED_ROUTES.APPOINTMENTS_DETAIL,
    title: 'Appointment Details',
    parent: PROTECTED_ROUTES.APPOINTMENTS,
  },

  // Incident Reports
  [PROTECTED_ROUTES.INCIDENT_REPORTS]: {
    path: PROTECTED_ROUTES.INCIDENT_REPORTS,
    title: 'Incident Reports',
    icon: 'AlertTriangle',
    roles: ['ADMIN', 'NURSE', 'COUNSELOR', 'READ_ONLY'],
  },
  [PROTECTED_ROUTES.INCIDENT_REPORTS_CREATE]: {
    path: PROTECTED_ROUTES.INCIDENT_REPORTS_CREATE,
    title: 'New Incident Report',
    parent: PROTECTED_ROUTES.INCIDENT_REPORTS,
    roles: ['ADMIN', 'NURSE', 'COUNSELOR'],
    permissions: ['incidents.create'],
  },
  [PROTECTED_ROUTES.INCIDENT_REPORTS_DETAIL]: {
    path: PROTECTED_ROUTES.INCIDENT_REPORTS_DETAIL,
    title: 'Incident Report Details',
    parent: PROTECTED_ROUTES.INCIDENT_REPORTS,
  },
  [PROTECTED_ROUTES.INCIDENT_REPORTS_EDIT]: {
    path: PROTECTED_ROUTES.INCIDENT_REPORTS_EDIT,
    title: 'Edit Incident Report',
    parent: PROTECTED_ROUTES.INCIDENT_REPORTS_DETAIL,
    roles: ['ADMIN', 'NURSE'],
    permissions: ['incidents.update'],
  },
  [PROTECTED_ROUTES.INCIDENT_REPORTS_WITNESSES]: {
    path: PROTECTED_ROUTES.INCIDENT_REPORTS_WITNESSES,
    title: 'Witness Statements',
    parent: PROTECTED_ROUTES.INCIDENT_REPORTS_DETAIL,
    roles: ['ADMIN', 'NURSE'],
    permissions: ['incidents.read'],
  },
  [PROTECTED_ROUTES.INCIDENT_REPORTS_ACTIONS]: {
    path: PROTECTED_ROUTES.INCIDENT_REPORTS_ACTIONS,
    title: 'Follow-up Actions',
    parent: PROTECTED_ROUTES.INCIDENT_REPORTS_DETAIL,
    roles: ['ADMIN', 'NURSE'],
    permissions: ['incidents.read'],
  },
  [PROTECTED_ROUTES.INCIDENT_REPORTS_EVIDENCE]: {
    path: PROTECTED_ROUTES.INCIDENT_REPORTS_EVIDENCE,
    title: 'Evidence Management',
    parent: PROTECTED_ROUTES.INCIDENT_REPORTS_DETAIL,
    roles: ['ADMIN', 'NURSE'],
    permissions: ['incidents.read'],
  },
  [PROTECTED_ROUTES.INCIDENT_REPORTS_TIMELINE]: {
    path: PROTECTED_ROUTES.INCIDENT_REPORTS_TIMELINE,
    title: 'Incident Timeline',
    parent: PROTECTED_ROUTES.INCIDENT_REPORTS_DETAIL,
    roles: ['ADMIN', 'NURSE', 'SCHOOL_ADMIN'],
    permissions: ['incidents.read'],
  },
  [PROTECTED_ROUTES.INCIDENT_REPORTS_EXPORT]: {
    path: PROTECTED_ROUTES.INCIDENT_REPORTS_EXPORT,
    title: 'Export Report',
    parent: PROTECTED_ROUTES.INCIDENT_REPORTS_DETAIL,
    roles: ['ADMIN', 'NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN'],
    permissions: ['incidents.read'],
  },

  // Emergency Contacts
  [PROTECTED_ROUTES.EMERGENCY_CONTACTS]: {
    path: PROTECTED_ROUTES.EMERGENCY_CONTACTS,
    title: 'Emergency Contacts',
    icon: 'Phone',
    roles: ['ADMIN', 'NURSE'],
  },

  // Communication
  [PROTECTED_ROUTES.COMMUNICATION]: {
    path: PROTECTED_ROUTES.COMMUNICATION,
    title: 'Communication',
    icon: 'MessageSquare',
  },

  // Documents
  [PROTECTED_ROUTES.DOCUMENTS]: {
    path: PROTECTED_ROUTES.DOCUMENTS,
    title: 'Documents',
    icon: 'FileText',
    roles: ['ADMIN', 'NURSE'],
  },

  // Inventory
  [PROTECTED_ROUTES.INVENTORY]: {
    path: PROTECTED_ROUTES.INVENTORY,
    title: 'Inventory',
    icon: 'Package',
    roles: ['ADMIN', 'NURSE'],
  },

  // Reports
  [PROTECTED_ROUTES.REPORTS]: {
    path: PROTECTED_ROUTES.REPORTS,
    title: 'Reports',
    icon: 'BarChart3',
    roles: ['ADMIN', 'NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN'],
  },

  // Settings
  [PROTECTED_ROUTES.SETTINGS]: {
    path: PROTECTED_ROUTES.SETTINGS,
    title: 'Settings',
    icon: 'Settings',
    roles: ['ADMIN'],
  },

  // Administration
  [PROTECTED_ROUTES.ADMIN]: {
    path: PROTECTED_ROUTES.ADMIN,
    title: 'Administration',
    icon: 'Shield',
    roles: ['ADMIN'],
  },
};

// ============================================================================
// ROUTE ACCESSIBILITY CHECKING
// ============================================================================

/**
 * Check if a route is accessible to a user
 *
 * @param route - Route path to check
 * @param user - User to check access for
 * @returns Route accessibility result
 *
 * @example
 * ```ts
 * const { isAccessible, reason } = isRouteAccessible('/medications', user);
 * if (!isAccessible) {
 *   console.log(`Access denied: ${reason}`);
 * }
 * ```
 */
export function isRouteAccessible(route: string, user: User | null): RouteAccessibility {
  // Public routes are always accessible
  if (Object.values(PUBLIC_ROUTES).includes(route)) {
    return { isAccessible: true };
  }

  // Protected routes require authentication
  if (!user) {
    return {
      isAccessible: false,
      reason: 'not_authenticated',
      message: 'You must be logged in to access this page',
    };
  }

  // Get route metadata
  const metadata = ROUTE_METADATA[route];
  if (!metadata) {
    // Unknown routes - allow by default (will hit 404 if truly invalid)
    return { isAccessible: true };
  }

  // Check role-based access
  if (metadata.roles && !metadata.roles.includes(user.role as UserRole)) {
    return {
      isAccessible: false,
      reason: 'insufficient_role',
      message: `Your role (${user.role}) does not have access to this page`,
    };
  }

  // Check permission-based access
  if (metadata.permissions && metadata.permissions.length > 0) {
    const hasPermission = hasAnyPermission(user, metadata.permissions);
    if (!hasPermission) {
      return {
        isAccessible: false,
        reason: 'missing_permission',
        message: 'You do not have the required permissions to access this page',
      };
    }
  }

  return { isAccessible: true };
}

/**
 * Check if user has any of the specified permissions
 *
 * @param user - User to check
 * @param permissions - Permissions to check for
 * @returns True if user has at least one permission
 */
function hasAnyPermission(user: User, permissions: Permission[]): boolean {
  // Admin has all permissions
  if (user.role === 'ADMIN') return true;

  // Role-based permission mapping
  const rolePermissions: Record<UserRole, string[]> = {
    ADMIN: ['*.*'],
    NURSE: [
      'students.*', 'medications.*', 'health_records.*',
      'appointments.*', 'incidents.*', 'emergency_contacts.*'
    ],
    SCHOOL_ADMIN: [
      'students.read', 'medications.read', 'health_records.read',
      'reports.read', 'incidents.read'
    ],
    DISTRICT_ADMIN: [
      'students.read', 'medications.read', 'health_records.read',
      'reports.*', 'incidents.read', 'settings.read'
    ],
    READ_ONLY: [
      'students.read', 'medications.read', 'health_records.read',
      'appointments.read', 'incidents.read'
    ],
    COUNSELOR: [
      'students.read', 'students.update', 'health_records.read',
      'incidents.read', 'incidents.create'
    ],
    STAFF: ['communication.*', 'incidents.read']
  };

  const userPermissions = rolePermissions[user.role as UserRole] || [];

  return permissions.some(permission => {
    if (userPermissions.includes('*.*')) return true;
    const [resource] = permission.split('.');
    if (userPermissions.includes(`${resource}.*`)) return true;
    if (userPermissions.includes(permission)) return true;
    return false;
  });
}

// ============================================================================
// PERMISSION RESOLUTION
// ============================================================================

/**
 * Get required permissions for a route
 *
 * @param route - Route path
 * @returns Array of required permissions
 *
 * @example
 * ```ts
 * const permissions = getRoutePermissions('/medications/new');
 * // Returns: ['medications.create']
 * ```
 */
export function getRoutePermissions(route: string): Permission[] {
  const metadata = ROUTE_METADATA[route];
  return metadata?.permissions || [];
}

/**
 * Get required roles for a route
 *
 * @param route - Route path
 * @returns Array of allowed roles
 *
 * @example
 * ```ts
 * const roles = getRouteRoles('/settings');
 * // Returns: ['ADMIN']
 * ```
 */
export function getRouteRoles(route: string): UserRole[] {
  const metadata = ROUTE_METADATA[route];
  return metadata?.roles || [];
}

// ============================================================================
// PARAMETER VALIDATION
// ============================================================================

/**
 * Validate route parameters against a schema
 *
 * @param params - Route parameters to validate
 * @param schema - Validation schema
 * @returns Validation result with errors
 *
 * @example
 * ```ts
 * const result = validateRouteParams(
 *   { id: '123', type: 'INJURY' },
 *   { id: 'uuid', type: ['INJURY', 'ILLNESS'] }
 * );
 * if (!result.isValid) {
 *   console.error(result.errors);
 * }
 * ```
 */
export function validateRouteParams(
  params: Record<string, string>,
  schema: Record<string, 'uuid' | 'number' | string[] | RegExp | ((value: string) => boolean)>
): ParamValidationResult {
  const errors: { param: string; message: string }[] = [];

  for (const [paramName, validator] of Object.entries(schema)) {
    const paramValue = params[paramName];

    if (!paramValue) {
      errors.push({
        param: paramName,
        message: `Parameter '${paramName}' is required`,
      });
      continue;
    }

    let isValid = false;
    let errorMessage = '';

    if (validator === 'uuid') {
      isValid = isValidUUID(paramValue);
      errorMessage = `Parameter '${paramName}' must be a valid UUID`;
    } else if (validator === 'number') {
      isValid = isValidNumber(paramValue);
      errorMessage = `Parameter '${paramName}' must be a number`;
    } else if (typeof validator === 'function') {
      isValid = validator(paramValue);
      errorMessage = `Parameter '${paramName}' failed validation`;
    } else if (validator instanceof RegExp) {
      isValid = validator.test(paramValue);
      errorMessage = `Parameter '${paramName}' does not match required pattern`;
    } else if (Array.isArray(validator)) {
      isValid = isValidEnum(paramValue, validator);
      errorMessage = `Parameter '${paramName}' must be one of: ${validator.join(', ')}`;
    }

    if (!isValid) {
      errors.push({ param: paramName, message: errorMessage });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// ============================================================================
// BREADCRUMB GENERATION
// ============================================================================

/**
 * Build breadcrumbs for a given location
 *
 * @param pathname - Current pathname
 * @param params - Route parameters for dynamic segments
 * @returns Array of breadcrumb items
 *
 * @example
 * ```ts
 * const breadcrumbs = buildBreadcrumbs('/students/123/edit', { id: '123' });
 * // Returns:
 * // [
 * //   { label: 'Dashboard', path: '/dashboard', isActive: false },
 * //   { label: 'Students', path: '/students', isActive: false },
 * //   { label: 'Student Details', path: '/students/123', isActive: false },
 * //   { label: 'Edit Student', path: '/students/123/edit', isActive: true },
 * // ]
 * ```
 */
export function buildBreadcrumbs(
  pathname: string,
  params: Record<string, string> = {}
): Breadcrumb[] {
  const breadcrumbs: Breadcrumb[] = [];

  // Always start with Dashboard
  if (pathname !== PROTECTED_ROUTES.DASHBOARD) {
    breadcrumbs.push({
      label: 'Dashboard',
      path: PROTECTED_ROUTES.DASHBOARD,
      icon: 'Home',
      isActive: false,
    });
  }

  // Find matching route metadata
  let currentPath = pathname;
  const matchedRoutes: RouteMetadata[] = [];

  // Try to find exact match first
  let metadata = ROUTE_METADATA[currentPath];

  // If no exact match, try to match with params replaced
  if (!metadata) {
    const matchedRoute = Object.keys(ROUTE_METADATA).find(route => {
      const routePattern = route.replace(/:[^/]+/g, '[^/]+');
      const regex = new RegExp(`^${routePattern}$`);
      return regex.test(currentPath);
    });

    if (matchedRoute) {
      metadata = ROUTE_METADATA[matchedRoute];
      currentPath = matchedRoute;
    }
  }

  // Build hierarchy by following parent chain
  if (metadata) {
    matchedRoutes.unshift(metadata);
    let parent = metadata.parent;

    while (parent && ROUTE_METADATA[parent]) {
      const parentMetadata = ROUTE_METADATA[parent];
      matchedRoutes.unshift(parentMetadata);
      parent = parentMetadata.parent;
    }
  }

  // Convert to breadcrumbs
  matchedRoutes.forEach((route, index) => {
    if (route.hidden) return;

    let path = route.path;
    // Replace param placeholders with actual values
    Object.entries(params).forEach(([key, value]) => {
      path = path.replace(`:${key}`, value);
    });

    breadcrumbs.push({
      label: route.title,
      path,
      icon: route.icon,
      isActive: index === matchedRoutes.length - 1,
    });
  });

  return breadcrumbs;
}

// ============================================================================
// ROUTE HELPERS
// ============================================================================

/**
 * Check if a path matches a route pattern
 *
 * @param path - Current path
 * @param pattern - Route pattern with :params
 * @returns True if path matches pattern
 */
export function matchesRoutePattern(path: string, pattern: string): boolean {
  const routePattern = pattern.replace(/:[^/]+/g, '[^/]+');
  const regex = new RegExp(`^${routePattern}$`);
  return regex.test(path);
}

/**
 * Extract params from path based on pattern
 *
 * @param path - Current path
 * @param pattern - Route pattern with :params
 * @returns Object with extracted params
 */
export function extractRouteParams(path: string, pattern: string): Record<string, string> {
  const params: Record<string, string> = {};
  const patternParts = pattern.split('/');
  const pathParts = path.split('/');

  if (patternParts.length !== pathParts.length) {
    return params;
  }

  patternParts.forEach((part, index) => {
    if (part.startsWith(':')) {
      const paramName = part.slice(1);
      params[paramName] = pathParts[index];
    }
  });

  return params;
}

/**
 * Get the parent route for a given route
 *
 * @param route - Route path
 * @returns Parent route path or null
 */
export function getParentRoute(route: string): string | null {
  const metadata = ROUTE_METADATA[route];
  return metadata?.parent || null;
}

/**
 * Check if route requires authentication
 *
 * @param route - Route path
 * @returns True if route requires authentication
 */
export function requiresAuthentication(route: string): boolean {
  return !Object.values(PUBLIC_ROUTES).includes(route);
}

/**
 * Get route metadata
 *
 * @param route - Route path
 * @returns Route metadata or null
 */
export function getRouteMetadata(route: string): RouteMetadata | null {
  return ROUTE_METADATA[route] || null;
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  isRouteAccessible,
  getRoutePermissions,
  getRouteRoles,
  validateRouteParams,
  buildBreadcrumbs,
  matchesRoutePattern,
  extractRouteParams,
  getParentRoute,
  requiresAuthentication,
  getRouteMetadata,
};
