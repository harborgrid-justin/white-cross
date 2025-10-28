/**
 * @fileoverview Message repository interface.
 * Repository interface for Message data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * Message repository interface
 * Extends base repository with Message-specific operations
 */
export interface IMessageRepository extends IRepository<any, any, any> {
  // Domain-specific methods can be added here
}

/**
 * Create Message DTO
 */
export interface CreateMessageDTO {
  // Properties defined by Message model
  id?: string;
}

/**
 * Update Message DTO
 */
export interface UpdateMessageDTO {
  // Properties defined by Message model  
  id?: string;
}
