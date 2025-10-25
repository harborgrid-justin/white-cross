/**
 * @fileoverview LoginAttempt repository interface.
 * Auto-generated repository interface for LoginAttempt data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * LoginAttempt repository interface
 * Extends base repository with LoginAttempt-specific operations
 */
export interface ILoginAttemptRepository extends IRepository<any, any, any> {
  // Add LoginAttempt-specific methods here if needed
}

/**
 * Create LoginAttempt DTO
 */
export interface CreateLoginAttemptDTO {
  [key: string]: any;
}

/**
 * Update LoginAttempt DTO
 */
export interface UpdateLoginAttemptDTO {
  [key: string]: any;
}
