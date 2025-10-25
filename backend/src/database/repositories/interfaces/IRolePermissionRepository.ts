/**
 * @fileoverview RolePermission repository interface.
 * Repository interface for RolePermission data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * RolePermission repository interface
 * Extends base repository with RolePermission-specific operations
 */
export interface IRolePermissionRepository extends IRepository<any, any, any> {
  // Domain-specific methods can be added here
}

/**
 * Create RolePermission DTO
 */
export interface CreateRolePermissionDTO {
  // Properties defined by RolePermission model
  id?: string;
}

/**
 * Update RolePermission DTO
 */
export interface UpdateRolePermissionDTO {
  // Properties defined by RolePermission model  
  id?: string;
}
