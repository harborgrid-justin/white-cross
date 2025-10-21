/**
 * LOC: 1C3AB3EEBA
 * WC-MID-RBC-049 | Role-Based Access Control Middleware
 *
 * UPSTREAM (imports from):
 *   - shared/security/permissionUtils (shared security utilities)
 *   - core/authentication/jwt.middleware (user profile interface)
 *
 * DOWNSTREAM (imported by):
 *   - adapters/hapi/authorization.adapter.ts
 *   - adapters/express/authorization.adapter.ts
 */

/**
 * WC-MID-RBC-049 | Role-Based Access Control Middleware
 * Purpose: Framework-agnostic RBAC implementation for healthcare platform
 * Upstream: shared/security/permissionUtils, authentication middleware
 * Downstream: Protected routes, admin functions | Called by: Framework adapters
 * Related: authentication/jwt.middleware.ts, shared/security/permissionUtils.ts
 * Exports: RbacMiddleware class, authorization functions | Key Services: Permission checking, role validation
 * Last Updated: 2025-10-21 | Dependencies: Framework-agnostic
 * Critical Path: User context → Role validation → Permission check → Access decision
 * LLM Context: HIPAA-compliant authorization, healthcare role hierarchy, audit logging
 */

/**
 * Framework-agnostic Role-Based Access Control Middleware
 * 
 * Provides comprehensive RBAC functionality for healthcare platforms
 * with support for hierarchical roles and fine-grained permissions.
 */

import { logger } from '../../../utils/logger';
import type { UserProfile } from '../authentication/jwt.middleware';

/**
 * Healthcare platform roles in hierarchical order
 * Higher index = higher privileges
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
 * Each role inherits permissions from roles below it
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
 */
export interface AuthorizationResult {
  authorized: boolean;
  reason?: string;
  requiredRole?: UserRole;
  requiredPermissions?: Permission[];
}

/**
 * RBAC configuration interface
 */
export interface RbacConfig {
  enableHierarchy?: boolean;
  enableAuditLogging?: boolean;
  customPermissions?: Record<string, Permission[]>;
}

/**
 * Role-Based Access Control Middleware
 */
export class RbacMiddleware {
  private config: RbacConfig;

  constructor(config: RbacConfig = {}) {
    this.config = {
      enableHierarchy: true,
      enableAuditLogging: true,
      ...config
    };
  }

  /**
   * Check if user has required role
   */
  hasRole(user: UserProfile, requiredRole: UserRole): boolean {
    const userRole = user.role as UserRole;
    
    if (!this.config.enableHierarchy) {
      return userRole === requiredRole;
    }

    // With hierarchy, check if user role is equal or higher
    const userLevel = ROLE_HIERARCHY[userRole];
    const requiredLevel = ROLE_HIERARCHY[requiredRole];
    
    return userLevel >= requiredLevel;
  }

  /**
   * Check if user has required permission
   */
  hasPermission(user: UserProfile, requiredPermission: Permission): boolean {
    const userRole = user.role as UserRole;
    
    // Check explicit permissions first
    if (user.permissions && user.permissions.includes(requiredPermission)) {
      return true;
    }

    // Check role-based permissions
    const rolePermissions = ROLE_PERMISSIONS[userRole] || [];
    
    if (rolePermissions.includes(requiredPermission)) {
      return true;
    }

    // Check inherited permissions from lower roles (if hierarchy enabled)
    if (this.config.enableHierarchy) {
      const userLevel = ROLE_HIERARCHY[userRole];
      
      for (const [role, level] of Object.entries(ROLE_HIERARCHY)) {
        if (level < userLevel) {
          const inheritedPermissions = ROLE_PERMISSIONS[role as UserRole] || [];
          if (inheritedPermissions.includes(requiredPermission)) {
            return true;
          }
        }
      }
    }

    return false;
  }

  /**
   * Check if user has any of the required permissions
   */
  hasAnyPermission(user: UserProfile, requiredPermissions: Permission[]): boolean {
    return requiredPermissions.some(permission => 
      this.hasPermission(user, permission)
    );
  }

  /**
   * Check if user has all required permissions
   */
  hasAllPermissions(user: UserProfile, requiredPermissions: Permission[]): boolean {
    return requiredPermissions.every(permission => 
      this.hasPermission(user, permission)
    );
  }

  /**
   * Authorize user for specific role requirement
   */
  authorizeRole(user: UserProfile, requiredRole: UserRole): AuthorizationResult {
    if (this.hasRole(user, requiredRole)) {
      if (this.config.enableAuditLogging) {
        logger.debug('Role authorization successful', {
          userId: user.userId,
          userRole: user.role,
          requiredRole,
          success: true
        });
      }
      
      return { authorized: true };
    }

    if (this.config.enableAuditLogging) {
      logger.warn('Role authorization failed', {
        userId: user.userId,
        userRole: user.role,
        requiredRole,
        success: false
      });
    }

    return {
      authorized: false,
      reason: `Insufficient role privileges. Required: ${requiredRole}, Current: ${user.role}`,
      requiredRole
    };
  }

  /**
   * Authorize user for specific permission requirement
   */
  authorizePermission(user: UserProfile, requiredPermission: Permission): AuthorizationResult {
    if (this.hasPermission(user, requiredPermission)) {
      if (this.config.enableAuditLogging) {
        logger.debug('Permission authorization successful', {
          userId: user.userId,
          userRole: user.role,
          requiredPermission,
          success: true
        });
      }
      
      return { authorized: true };
    }

    if (this.config.enableAuditLogging) {
      logger.warn('Permission authorization failed', {
        userId: user.userId,
        userRole: user.role,
        requiredPermission,
        success: false
      });
    }

    return {
      authorized: false,
      reason: `Insufficient permissions. Required: ${requiredPermission}`,
      requiredPermissions: [requiredPermission]
    };
  }

  /**
   * Authorize user for multiple permission requirements (AND logic)
   */
  authorizeAllPermissions(user: UserProfile, requiredPermissions: Permission[]): AuthorizationResult {
    const missingPermissions = requiredPermissions.filter(permission => 
      !this.hasPermission(user, permission)
    );

    if (missingPermissions.length === 0) {
      if (this.config.enableAuditLogging) {
        logger.debug('Multiple permissions authorization successful', {
          userId: user.userId,
          userRole: user.role,
          requiredPermissions,
          success: true
        });
      }
      
      return { authorized: true };
    }

    if (this.config.enableAuditLogging) {
      logger.warn('Multiple permissions authorization failed', {
        userId: user.userId,
        userRole: user.role,
        requiredPermissions,
        missingPermissions,
        success: false
      });
    }

    return {
      authorized: false,
      reason: `Missing required permissions: ${missingPermissions.join(', ')}`,
      requiredPermissions: missingPermissions
    };
  }

  /**
   * Authorize user for multiple permission requirements (OR logic)
   */
  authorizeAnyPermission(user: UserProfile, requiredPermissions: Permission[]): AuthorizationResult {
    if (this.hasAnyPermission(user, requiredPermissions)) {
      if (this.config.enableAuditLogging) {
        logger.debug('Any permission authorization successful', {
          userId: user.userId,
          userRole: user.role,
          requiredPermissions,
          success: true
        });
      }
      
      return { authorized: true };
    }

    if (this.config.enableAuditLogging) {
      logger.warn('Any permission authorization failed', {
        userId: user.userId,
        userRole: user.role,
        requiredPermissions,
        success: false
      });
    }

    return {
      authorized: false,
      reason: `None of the required permissions found: ${requiredPermissions.join(', ')}`,
      requiredPermissions
    };
  }

  /**
   * Get all permissions for a user
   */
  getUserPermissions(user: UserProfile): Permission[] {
    const userRole = user.role as UserRole;
    const permissions = new Set<Permission>();

    // Add explicit user permissions
    if (user.permissions) {
      user.permissions.forEach(p => permissions.add(p as Permission));
    }

    // Add role-based permissions
    const rolePermissions = ROLE_PERMISSIONS[userRole] || [];
    rolePermissions.forEach(p => permissions.add(p));

    // Add inherited permissions (if hierarchy enabled)
    if (this.config.enableHierarchy) {
      const userLevel = ROLE_HIERARCHY[userRole];
      
      for (const [role, level] of Object.entries(ROLE_HIERARCHY)) {
        if (level < userLevel) {
          const inheritedPermissions = ROLE_PERMISSIONS[role as UserRole] || [];
          inheritedPermissions.forEach(p => permissions.add(p));
        }
      }
    }

    return Array.from(permissions);
  }

  /**
   * Check if user can access resource owned by another user
   */
  canAccessUserResource(
    accessor: UserProfile, 
    resourceOwnerId: string, 
    requiredPermission: Permission
  ): AuthorizationResult {
    // Users can always access their own resources
    if (accessor.userId === resourceOwnerId) {
      return { authorized: true };
    }

    // Check if user has permission to access other users' resources
    return this.authorizePermission(accessor, requiredPermission);
  }

  /**
   * Create factory function for different configurations
   */
  static create(config?: RbacConfig): RbacMiddleware {
    return new RbacMiddleware(config);
  }
}

/**
 * Factory function for creating RBAC middleware
 */
export function createRbacMiddleware(config?: RbacConfig): RbacMiddleware {
  return RbacMiddleware.create(config);
}

/**
 * Convenience functions for common authorization checks
 */

export function requireRole(requiredRole: UserRole) {
  return (user: UserProfile): AuthorizationResult => {
    const rbac = new RbacMiddleware();
    return rbac.authorizeRole(user, requiredRole);
  };
}

export function requirePermission(requiredPermission: Permission) {
  return (user: UserProfile): AuthorizationResult => {
    const rbac = new RbacMiddleware();
    return rbac.authorizePermission(user, requiredPermission);
  };
}

export function requireAnyPermission(requiredPermissions: Permission[]) {
  return (user: UserProfile): AuthorizationResult => {
    const rbac = new RbacMiddleware();
    return rbac.authorizeAnyPermission(user, requiredPermissions);
  };
}

export function requireAllPermissions(requiredPermissions: Permission[]) {
  return (user: UserProfile): AuthorizationResult => {
    const rbac = new RbacMiddleware();
    return rbac.authorizeAllPermissions(user, requiredPermissions);
  };
}

/**
 * Default export for convenience
 */
export default RbacMiddleware;
