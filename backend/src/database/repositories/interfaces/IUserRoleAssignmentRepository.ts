/**
 * @fileoverview UserRoleAssignment repository interface.
 * Repository interface for UserRoleAssignment data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * UserRoleAssignment repository interface
 * Extends base repository with UserRoleAssignment-specific operations
 */
export interface IUserRoleAssignmentRepository extends IRepository<any, any, any> {
  // Domain-specific methods can be added here
}

/**
 * Create UserRoleAssignment DTO
 */
export interface CreateUserRoleAssignmentDTO {
  // Properties defined by UserRoleAssignment model
  id?: string;
}

/**
 * Update UserRoleAssignment DTO
 */
export interface UpdateUserRoleAssignmentDTO {
  // Properties defined by UserRoleAssignment model  
  id?: string;
}
