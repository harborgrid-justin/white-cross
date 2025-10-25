/**
 * @fileoverview Session repository interface.
 * Auto-generated repository interface for Session data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * Session repository interface
 * Extends base repository with Session-specific operations
 */
export interface ISessionRepository extends IRepository<any, any, any> {
  // Add Session-specific methods here if needed
}

/**
 * Create Session DTO
 */
export interface CreateSessionDTO {
  [key: string]: any;
}

/**
 * Update Session DTO
 */
export interface UpdateSessionDTO {
  [key: string]: any;
}
