/**
 * @fileoverview Role repository interface.
 * Auto-generated repository interface for Role data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * Role repository interface
 * Extends base repository with Role-specific operations
 */
export interface IRoleRepository extends IRepository<any, any, any> {
  // Add Role-specific methods here if needed
}

/**
 * Create Role DTO
 */
export interface CreateRoleDTO {
  [key: string]: any;
}

/**
 * Update Role DTO
 */
export interface UpdateRoleDTO {
  [key: string]: any;
}
