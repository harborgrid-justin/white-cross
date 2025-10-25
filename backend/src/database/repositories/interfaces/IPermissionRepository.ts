/**
 * @fileoverview Permission repository interface.
 * Auto-generated repository interface for Permission data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * Permission repository interface
 * Extends base repository with Permission-specific operations
 */
export interface IPermissionRepository extends IRepository<any, any, any> {
  // Add Permission-specific methods here if needed
}

/**
 * Create Permission DTO
 */
export interface CreatePermissionDTO {
  [key: string]: any;
}

/**
 * Update Permission DTO
 */
export interface UpdatePermissionDTO {
  [key: string]: any;
}
