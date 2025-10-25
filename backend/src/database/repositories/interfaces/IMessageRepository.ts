/**
 * @fileoverview Message repository interface.
 * Auto-generated repository interface for Message data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * Message repository interface
 * Extends base repository with Message-specific operations
 */
export interface IMessageRepository extends IRepository<any, any, any> {
  // Add Message-specific methods here if needed
}

/**
 * Create Message DTO
 */
export interface CreateMessageDTO {
  [key: string]: any;
}

/**
 * Update Message DTO
 */
export interface UpdateMessageDTO {
  [key: string]: any;
}
