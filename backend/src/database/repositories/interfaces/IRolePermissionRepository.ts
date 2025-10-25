/**
 * @fileoverview RolePermission repository interface.
 * Auto-generated repository interface for RolePermission data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * RolePermission repository interface
 * Extends base repository with RolePermission-specific operations
 */
export interface IRolePermissionRepository extends IRepository<any, any, any> {
  // Add RolePermission-specific methods here if needed
}

/**
 * Create RolePermission DTO
 */
export interface CreateRolePermissionDTO {
  [key: string]: any;
}

/**
 * Update RolePermission DTO
 */
export interface UpdateRolePermissionDTO {
  [key: string]: any;
}
