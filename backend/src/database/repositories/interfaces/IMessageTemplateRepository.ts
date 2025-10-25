/**
 * @fileoverview MessageTemplate repository interface.
 * Auto-generated repository interface for MessageTemplate data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * MessageTemplate repository interface
 * Extends base repository with MessageTemplate-specific operations
 */
export interface IMessageTemplateRepository extends IRepository<any, any, any> {
  // Add MessageTemplate-specific methods here if needed
}

/**
 * Create MessageTemplate DTO
 */
export interface CreateMessageTemplateDTO {
  [key: string]: any;
}

/**
 * Update MessageTemplate DTO
 */
export interface UpdateMessageTemplateDTO {
  [key: string]: any;
}
