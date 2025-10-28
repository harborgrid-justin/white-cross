/**
 * @fileoverview RBAC Type Definitions for NestJS
 * @module middleware/core/types/rbac
 * @description Type-safe role-based access control types for NestJS healthcare platform.
 * Migrated from backend/src/middleware/core/authorization/rbac.middleware.ts
 *
 * @security Critical authorization types - all access control depends on these
 * @compliance HIPAA - Implements minimum necessary access principle
 */

/**
 * Healthcare platform roles in hierarchical order
 *
 * @enum {string}
 * @readonly
 *
 * @description Defines all user roles in the healthcare platform with implicit hierarchy.
 * Higher roles in the enumeration inherit permissions from lower roles when hierarchy is enabled.
 *
 * Role Hierarchy (lowest to highest privilege):
 * 1. STUDENT - Students can view their own basic information
 * 2. PARENT_GUARDIAN - Parents can view their children's health information
 * 3. SCHOOL_NURSE - School nurses can manage student health records at school level
 * 4. SCHOOL_ADMINISTRATOR - School admins can manage school operations and view reports
 * 5. DISTRICT_NURSE - District nurses have school nurse permissions across multiple schools
 * 6. DISTRICT_ADMINISTRATOR - District admins manage multiple schools and users
 * 7. SYSTEM_ADMINISTRATOR - System admins have full system access except super admin functions
 * 8. SUPER_ADMIN - Super admins have unrestricted access to all features
 */
export enum UserRole {
  STUDENT = 'student',
  PARENT_GUARDIAN = 'parent_guardian',
  SCHOOL_NURSE = 'school_nurse',
  SCHOOL_ADMINISTRATOR = 'school_administrator',
  DISTRICT_NURSE = 'district_nurse',
  DISTRICT_ADMINISTRATOR = 'district_administrator',
  SYSTEM_ADMINISTRATOR = 'system_administrator',
  SUPER_ADMIN = 'super_admin'
}

/**
 * System permissions for fine-grained access control
 *
 * @enum {string}
 * @readonly
 *
 * @description Defines all granular permissions in the healthcare platform.
 * Permissions follow a resource:action naming pattern for clarity and consistency.
 */
export enum Permission {
  // Student data permissions
  READ_STUDENT_BASIC = 'read_student_basic',
  READ_STUDENT_HEALTH = 'read_student_health',
  UPDATE_STUDENT_BASIC = 'update_student_basic',
  UPDATE_STUDENT_HEALTH = 'update_student_health',
  DELETE_STUDENT = 'delete_student',

  // Health record permissions
  READ_HEALTH_RECORDS = 'read_health_records',
  CREATE_HEALTH_RECORDS = 'create_health_records',
  UPDATE_HEALTH_RECORDS = 'update_health_records',
  DELETE_HEALTH_RECORDS = 'delete_health_records',

  // Medication permissions
  READ_MEDICATIONS = 'read_medications',
  ADMINISTER_MEDICATIONS = 'administer_medications',
  MANAGE_MEDICATIONS = 'manage_medications',

  // Communication permissions
  SEND_MESSAGES = 'send_messages',
  BROADCAST_MESSAGES = 'broadcast_messages',
  MANAGE_COMMUNICATIONS = 'manage_communications',

  // Emergency permissions
  CREATE_EMERGENCY_ALERT = 'create_emergency_alert',
  MANAGE_EMERGENCY_RESPONSES = 'manage_emergency_responses',

  // Administrative permissions
  MANAGE_USERS = 'manage_users',
  MANAGE_SCHOOLS = 'manage_schools',
  VIEW_REPORTS = 'view_reports',
  EXPORT_DATA = 'export_data',
  MANAGE_SYSTEM = 'manage_system',

  // Audit and compliance
  VIEW_AUDIT_LOGS = 'view_audit_logs',
  MANAGE_COMPLIANCE = 'manage_compliance'
}

/**
 * Role hierarchy mapping
 *
 * @constant {Record<UserRole, number>}
 * @readonly
 *
 * @description Maps each role to a numeric privilege level for hierarchical comparison.
 */
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  [UserRole.STUDENT]: 0,
  [UserRole.PARENT_GUARDIAN]: 1,
  [UserRole.SCHOOL_NURSE]: 2,
  [UserRole.SCHOOL_ADMINISTRATOR]: 3,
  [UserRole.DISTRICT_NURSE]: 4,
  [UserRole.DISTRICT_ADMINISTRATOR]: 5,
  [UserRole.SYSTEM_ADMINISTRATOR]: 6,
  [UserRole.SUPER_ADMIN]: 7
};

/**
 * Permission mappings for each role
 *
 * @constant {Record<UserRole, Permission[]>}
 * @readonly
 *
 * @description Defines explicit permission assignments for each user role in the system.
 */
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.STUDENT]: [
    Permission.READ_STUDENT_BASIC,
    Permission.SEND_MESSAGES
  ],

  [UserRole.PARENT_GUARDIAN]: [
    Permission.READ_STUDENT_BASIC,
    Permission.READ_STUDENT_HEALTH,
    Permission.SEND_MESSAGES
  ],

  [UserRole.SCHOOL_NURSE]: [
    Permission.READ_STUDENT_BASIC,
    Permission.READ_STUDENT_HEALTH,
    Permission.UPDATE_STUDENT_HEALTH,
    Permission.READ_HEALTH_RECORDS,
    Permission.CREATE_HEALTH_RECORDS,
    Permission.UPDATE_HEALTH_RECORDS,
    Permission.READ_MEDICATIONS,
    Permission.ADMINISTER_MEDICATIONS,
    Permission.SEND_MESSAGES,
    Permission.CREATE_EMERGENCY_ALERT
  ],

  [UserRole.SCHOOL_ADMINISTRATOR]: [
    Permission.READ_STUDENT_BASIC,
    Permission.UPDATE_STUDENT_BASIC,
    Permission.READ_HEALTH_RECORDS,
    Permission.SEND_MESSAGES,
    Permission.BROADCAST_MESSAGES,
    Permission.VIEW_REPORTS,
    Permission.MANAGE_EMERGENCY_RESPONSES
  ],

  [UserRole.DISTRICT_NURSE]: [
    Permission.READ_STUDENT_BASIC,
    Permission.READ_STUDENT_HEALTH,
    Permission.UPDATE_STUDENT_HEALTH,
    Permission.READ_HEALTH_RECORDS,
    Permission.CREATE_HEALTH_RECORDS,
    Permission.UPDATE_HEALTH_RECORDS,
    Permission.READ_MEDICATIONS,
    Permission.ADMINISTER_MEDICATIONS,
    Permission.MANAGE_MEDICATIONS,
    Permission.SEND_MESSAGES,
    Permission.BROADCAST_MESSAGES,
    Permission.CREATE_EMERGENCY_ALERT,
    Permission.VIEW_REPORTS
  ],

  [UserRole.DISTRICT_ADMINISTRATOR]: [
    Permission.READ_STUDENT_BASIC,
    Permission.UPDATE_STUDENT_BASIC,
    Permission.READ_HEALTH_RECORDS,
    Permission.SEND_MESSAGES,
    Permission.BROADCAST_MESSAGES,
    Permission.MANAGE_COMMUNICATIONS,
    Permission.MANAGE_EMERGENCY_RESPONSES,
    Permission.MANAGE_USERS,
    Permission.MANAGE_SCHOOLS,
    Permission.VIEW_REPORTS,
    Permission.EXPORT_DATA,
    Permission.VIEW_AUDIT_LOGS
  ],

  [UserRole.SYSTEM_ADMINISTRATOR]: [
    Permission.READ_STUDENT_BASIC,
    Permission.READ_STUDENT_HEALTH,
    Permission.UPDATE_STUDENT_BASIC,
    Permission.UPDATE_STUDENT_HEALTH,
    Permission.DELETE_STUDENT,
    Permission.READ_HEALTH_RECORDS,
    Permission.CREATE_HEALTH_RECORDS,
    Permission.UPDATE_HEALTH_RECORDS,
    Permission.DELETE_HEALTH_RECORDS,
    Permission.READ_MEDICATIONS,
    Permission.MANAGE_MEDICATIONS,
    Permission.SEND_MESSAGES,
    Permission.BROADCAST_MESSAGES,
    Permission.MANAGE_COMMUNICATIONS,
    Permission.CREATE_EMERGENCY_ALERT,
    Permission.MANAGE_EMERGENCY_RESPONSES,
    Permission.MANAGE_USERS,
    Permission.MANAGE_SCHOOLS,
    Permission.VIEW_REPORTS,
    Permission.EXPORT_DATA,
    Permission.VIEW_AUDIT_LOGS,
    Permission.MANAGE_COMPLIANCE,
    Permission.MANAGE_SYSTEM
  ],

  [UserRole.SUPER_ADMIN]: Object.values(Permission)
};

/**
 * Authorization result interface
 *
 * @interface AuthorizationResult
 *
 * @description Result object returned by all authorization check methods.
 */
export interface AuthorizationResult {
  authorized: boolean;
  reason?: string;
  requiredRole?: UserRole;
  requiredPermissions?: Permission[];
}

/**
 * RBAC configuration interface
 *
 * @interface RbacConfig
 *
 * @description Configuration options for RBAC guards.
 */
export interface RbacConfig {
  enableHierarchy?: boolean;
  enableAuditLogging?: boolean;
  customPermissions?: Record<string, Permission[]>;
}

/**
 * User profile interface for authorization
 *
 * @interface UserProfile
 *
 * @description Minimal user profile required for authorization checks.
 */
export interface UserProfile {
  userId: string;
  email: string;
  role: string;
  permissions?: string[];
}
