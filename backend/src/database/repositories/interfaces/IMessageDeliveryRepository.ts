/**
 * @fileoverview MessageDelivery repository interface.
 * Auto-generated repository interface for MessageDelivery data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * MessageDelivery repository interface
 * Extends base repository with MessageDelivery-specific operations
 */
export interface IMessageDeliveryRepository extends IRepository<any, any, any> {
  // Add MessageDelivery-specific methods here if needed
}

/**
 * Create MessageDelivery DTO
 */
export interface CreateMessageDeliveryDTO {
  [key: string]: any;
}

/**
 * Update MessageDelivery DTO
 */
export interface UpdateMessageDeliveryDTO {
  [key: string]: any;
}
