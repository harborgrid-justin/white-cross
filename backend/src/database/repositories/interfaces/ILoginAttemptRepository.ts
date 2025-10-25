/**
 * @fileoverview LoginAttempt repository interface.
 * Repository interface for LoginAttempt data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * LoginAttempt repository interface
 * Extends base repository with LoginAttempt-specific operations
 */
export interface ILoginAttemptRepository extends IRepository<any, any, any> {
  // Domain-specific methods can be added here
}

/**
 * Create LoginAttempt DTO
 */
export interface CreateLoginAttemptDTO {
  // Properties defined by LoginAttempt model
  id?: string;
}

/**
 * Update LoginAttempt DTO
 */
export interface UpdateLoginAttemptDTO {
  // Properties defined by LoginAttempt model  
  id?: string;
}
