/**
 * @fileoverview Role repository interface.
 * Repository interface for Role data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * Role repository interface
 * Extends base repository with Role-specific operations
 */
export interface IRoleRepository extends IRepository<any, any, any> {
  // Domain-specific methods can be added here
}

/**
 * Create Role DTO
 */
export interface CreateRoleDTO {
  // Properties defined by Role model
  id?: string;
}

/**
 * Update Role DTO
 */
export interface UpdateRoleDTO {
  // Properties defined by Role model  
  id?: string;
}
