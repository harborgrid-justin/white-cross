/**
 * @fileoverview FollowUpAction repository interface.
 * Repository interface for FollowUpAction data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * FollowUpAction repository interface
 * Extends base repository with FollowUpAction-specific operations
 */
export interface IFollowUpActionRepository extends IRepository<any, any, any> {
  // Domain-specific methods can be added here
}

/**
 * Create FollowUpAction DTO
 */
export interface CreateFollowUpActionDTO {
  // Properties defined by FollowUpAction model
  id?: string;
}

/**
 * Update FollowUpAction DTO
 */
export interface UpdateFollowUpActionDTO {
  // Properties defined by FollowUpAction model  
  id?: string;
}
