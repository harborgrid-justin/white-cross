/**
 * @fileoverview FollowUpAction repository interface.
 * Auto-generated repository interface for FollowUpAction data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * FollowUpAction repository interface
 * Extends base repository with FollowUpAction-specific operations
 */
export interface IFollowUpActionRepository extends IRepository<any, any, any> {
  // Add FollowUpAction-specific methods here if needed
}

/**
 * Create FollowUpAction DTO
 */
export interface CreateFollowUpActionDTO {
  [key: string]: any;
}

/**
 * Update FollowUpAction DTO
 */
export interface UpdateFollowUpActionDTO {
  [key: string]: any;
}
