'use client';

/**
 * Permission Definitions - Role-Based Access Control (RBAC)
 *
 * Defines permission system, role hierarchy, and permission mappings.
 * Used by permission hooks for centralized access control.
 *
 * @module hooks/core/auth-permissions
 */

// ==========================================
// ROLE HIERARCHY
// ==========================================

/**
 * Role hierarchy for permission inheritance
 * Higher roles inherit permissions from lower roles
 */
export const ROLE_HIERARCHY: Record<string, number> = {
  VIEWER: 1,
  STAFF: 2,
  COUNSELOR: 3,
  NURSE: 4,
  SCHOOL_ADMIN: 5,
  DISTRICT_ADMIN: 6,
  ADMIN: 7,
};

// ==========================================
// PERMISSION DEFINITIONS
// ==========================================

/**
 * System permissions mapped to required roles
 */
export const PERMISSIONS = {
  // Student Management
  'students:view': ['NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN', 'ADMIN', 'COUNSELOR', 'STAFF'],
  'students:create': ['NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN', 'ADMIN'],
  'students:edit': ['NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN', 'ADMIN'],
  'students:delete': ['SCHOOL_ADMIN', 'DISTRICT_ADMIN', 'ADMIN'],

  // Health Records (PHI)
  'health_records:view': ['NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN', 'ADMIN'],
  'health_records:create': ['NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN', 'ADMIN'],
  'health_records:edit': ['NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN', 'ADMIN'],
  'health_records:delete': ['SCHOOL_ADMIN', 'DISTRICT_ADMIN', 'ADMIN'],

  // Medications
  'medications:view': ['NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN', 'ADMIN'],
  'medications:administer': ['NURSE', 'ADMIN'],
  'medications:create': ['NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN', 'ADMIN'],
  'medications:edit': ['NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN', 'ADMIN'],
  'medications:delete': ['SCHOOL_ADMIN', 'DISTRICT_ADMIN', 'ADMIN'],

  // Inventory
  'inventory:view': ['NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN', 'ADMIN', 'STAFF'],
  'inventory:create': ['NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN', 'ADMIN'],
  'inventory:edit': ['NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN', 'ADMIN'],
  'inventory:delete': ['SCHOOL_ADMIN', 'DISTRICT_ADMIN', 'ADMIN'],

  // Reports
  'reports:view': ['NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN', 'ADMIN', 'COUNSELOR'],
  'reports:create': ['NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN', 'ADMIN'],
  'reports:export': ['SCHOOL_ADMIN', 'DISTRICT_ADMIN', 'ADMIN'],

  // Admin Functions
  'admin:users': ['ADMIN', 'DISTRICT_ADMIN'],
  'admin:schools': ['ADMIN', 'DISTRICT_ADMIN'],
  'admin:districts': ['ADMIN'],
  'admin:settings': ['ADMIN', 'DISTRICT_ADMIN', 'SCHOOL_ADMIN'],
  'admin:audit_logs': ['ADMIN', 'DISTRICT_ADMIN'],
  'admin:compliance': ['ADMIN', 'DISTRICT_ADMIN'],

  // Communication
  'communication:send': ['NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN', 'ADMIN'],
  'communication:broadcast': ['SCHOOL_ADMIN', 'DISTRICT_ADMIN', 'ADMIN'],
  'communication:emergency': ['NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN', 'ADMIN'],

  // Appointments
  'appointments:view': ['NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN', 'ADMIN', 'STAFF'],
  'appointments:create': ['NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN', 'ADMIN'],
  'appointments:edit': ['NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN', 'ADMIN'],
  'appointments:cancel': ['NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN', 'ADMIN'],
} as const;

export type Permission = keyof typeof PERMISSIONS;
