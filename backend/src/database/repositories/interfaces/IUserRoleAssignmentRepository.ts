/**
 * @fileoverview UserRoleAssignment repository interface.
 * Auto-generated repository interface for UserRoleAssignment data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * UserRoleAssignment repository interface
 * Extends base repository with UserRoleAssignment-specific operations
 */
export interface IUserRoleAssignmentRepository extends IRepository<any, any, any> {
  // Add UserRoleAssignment-specific methods here if needed
}

/**
 * Create UserRoleAssignment DTO
 */
export interface CreateUserRoleAssignmentDTO {
  [key: string]: any;
}

/**
 * Update UserRoleAssignment DTO
 */
export interface UpdateUserRoleAssignmentDTO {
  [key: string]: any;
}
