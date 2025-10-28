/**
 * @fileoverview Session repository interface.
 * Repository interface for Session data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * Session repository interface
 * Extends base repository with Session-specific operations
 */
export interface ISessionRepository extends IRepository<any, any, any> {
  // Domain-specific methods can be added here
}

/**
 * Create Session DTO
 */
export interface CreateSessionDTO {
  // Properties defined by Session model
  id?: string;
}

/**
 * Update Session DTO
 */
export interface UpdateSessionDTO {
  // Properties defined by Session model  
  id?: string;
}
