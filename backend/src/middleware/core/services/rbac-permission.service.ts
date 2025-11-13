/**
 * @fileoverview RBAC Permission Service
 * @module middleware/core/services
 * @description Shared service for permission checking logic used by guards
 * 
 * @security Critical authorization service - centralized permission logic
 * @compliance HIPAA - Implements minimum necessary access principle
 */

import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../../../common/base';
import {
  Permission,
  type RbacConfig,
  ROLE_HIERARCHY,
  ROLE_PERMISSIONS,
  type UserProfile,
  UserRole,
} from '../types/rbac.types';

/**
 * RBAC Permission Service - Centralized permission checking logic
 *
 * @class RbacPermissionService
 * @description Provides reusable permission checking methods for RBAC guards.
 * This service eliminates code duplication between PermissionsGuard and RbacGuard.
 */
@Injectable()
export class RbacPermissionService extends BaseService {
  /**
   * Check if user has specific permission
   *
   * @param {UserProfile} user - User profile
   * @param {Permission} requiredPermission - Required permission
   * @param {RbacConfig} config - RBAC configuration
   * @returns {boolean} True if user has permission
   */
  hasPermission(
    user: UserProfile,
    requiredPermission: Permission,
    config: Required<RbacConfig>,
  ): boolean {
    const userRole = user.role as UserRole;

    // Check explicit user permissions first
    if (user.permissions && user.permissions.includes(requiredPermission)) {
      return true;
    }

    // Check role-based permissions
    const rolePermissions = ROLE_PERMISSIONS[userRole] || [];
    if (rolePermissions.includes(requiredPermission)) {
      return true;
    }

    // Check inherited permissions from lower roles (if hierarchy enabled)
    if (config.enableHierarchy) {
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
   * Check if user has ANY of the required permissions (OR logic)
   *
   * @param {UserProfile} user - User profile
   * @param {Permission[]} requiredPermissions - Required permissions
   * @param {RbacConfig} config - RBAC configuration
   * @returns {boolean} True if user has at least one permission
   */
  hasAnyPermission(
    user: UserProfile,
    requiredPermissions: Permission[],
    config: Required<RbacConfig>,
  ): boolean {
    return requiredPermissions.some((permission) =>
      this.hasPermission(user, permission, config),
    );
  }

  /**
   * Check if user has ALL required permissions (AND logic)
   *
   * @param {UserProfile} user - User profile
   * @param {Permission[]} requiredPermissions - Required permissions
   * @param {RbacConfig} config - RBAC configuration
   * @returns {boolean} True if user has all permissions
   */
  hasAllPermissions(
    user: UserProfile,
    requiredPermissions: Permission[],
    config: Required<RbacConfig>,
  ): boolean {
    return requiredPermissions.every((permission) =>
      this.hasPermission(user, permission, config),
    );
  }

  /**
   * Check if user has required role (with hierarchy support)
   *
   * @param {UserProfile} user - User profile
   * @param {UserRole} requiredRole - Required role
   * @param {RbacConfig} config - RBAC configuration
   * @returns {boolean} True if user has role
   */
  hasRole(
    user: UserProfile,
    requiredRole: UserRole,
    config: Required<RbacConfig>,
  ): boolean {
    const userRole = user.role as UserRole;

    if (!config.enableHierarchy) {
      return userRole === requiredRole;
    }

    // With hierarchy, check if user role is equal or higher
    const userLevel = ROLE_HIERARCHY[userRole];
    const requiredLevel = ROLE_HIERARCHY[requiredRole];

    return userLevel >= requiredLevel;
  }

  /**
   * Check if user has any of the required roles
   *
   * @param {UserProfile} user - User profile
   * @param {UserRole[]} requiredRoles - Required roles
   * @param {RbacConfig} config - RBAC configuration
   * @returns {boolean} True if user has at least one required role
   */
  hasAnyRole(
    user: UserProfile,
    requiredRoles: UserRole[],
    config: Required<RbacConfig>,
  ): boolean {
    return requiredRoles.some((role) => this.hasRole(user, role, config));
  }

  /**
   * Get missing permissions for a user
   *
   * @param {UserProfile} user - User profile
   * @param {Permission[]} requiredPermissions - Required permissions
   * @param {RbacConfig} config - RBAC configuration
   * @returns {Permission[]} Array of missing permissions
   */
  getMissingPermissions(
    user: UserProfile,
    requiredPermissions: Permission[],
    config: Required<RbacConfig>,
  ): Permission[] {
    return requiredPermissions.filter(
      (permission) => !this.hasPermission(user, permission, config),
    );
  }

  /**
   * Log authorization attempt
   *
   * @param {string} type - Authorization type ('role' | 'permission')
   * @param {boolean} success - Whether authorization succeeded
   * @param {UserProfile} user - User profile
   * @param {any[]} required - Required roles/permissions
   * @param {any[]} missing - Missing roles/permissions (if failed)
   * @param {string} mode - Permission mode (if applicable)
   */
  logAuthorizationAttempt(
    type: 'role' | 'permission' | 'rbac',
    success: boolean,
    user: UserProfile,
    required: any[],
    missing: any[] = [],
    mode?: string,
  ): void {
    const logLevel = success ? 'debug' : 'warn';
    const message = `${type.charAt(0).toUpperCase() + type.slice(1)} authorization ${success ? 'successful' : 'failed'}`;

    const logData = {
      userId: user.userId,
      userRole: user.role,
      [`required${type.charAt(0).toUpperCase() + type.slice(1)}s`]: required,
      ...(mode && { mode }),
      ...(missing.length > 0 && { [`missing${type.charAt(0).toUpperCase() + type.slice(1)}s`]: missing }),
    };

    this.logger[logLevel](message, logData);
  }
}
