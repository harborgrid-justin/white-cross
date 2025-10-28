/**
 * @fileoverview Permission repository interface.
 * Repository interface for Permission data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * Permission repository interface
 * Extends base repository with Permission-specific operations
 */
export interface IPermissionRepository extends IRepository<any, any, any> {
  // Domain-specific methods can be added here
}

/**
 * Create Permission DTO
 */
export interface CreatePermissionDTO {
  // Properties defined by Permission model
  id?: string;
}

/**
 * Update Permission DTO
 */
export interface UpdatePermissionDTO {
  // Properties defined by Permission model  
  id?: string;
}
