/**
 * @fileoverview MessageTemplate repository interface.
 * Repository interface for MessageTemplate data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * MessageTemplate repository interface
 * Extends base repository with MessageTemplate-specific operations
 */
export interface IMessageTemplateRepository extends IRepository<any, any, any> {
  // Domain-specific methods can be added here
}

/**
 * Create MessageTemplate DTO
 */
export interface CreateMessageTemplateDTO {
  // Properties defined by MessageTemplate model
  id?: string;
}

/**
 * Update MessageTemplate DTO
 */
export interface UpdateMessageTemplateDTO {
  // Properties defined by MessageTemplate model  
  id?: string;
}
