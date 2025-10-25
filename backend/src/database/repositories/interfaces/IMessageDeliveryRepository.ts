/**
 * @fileoverview MessageDelivery repository interface.
 * Repository interface for MessageDelivery data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * MessageDelivery repository interface
 * Extends base repository with MessageDelivery-specific operations
 */
export interface IMessageDeliveryRepository extends IRepository<any, any, any> {
  // Domain-specific methods can be added here
}

/**
 * Create MessageDelivery DTO
 */
export interface CreateMessageDeliveryDTO {
  // Properties defined by MessageDelivery model
  id?: string;
}

/**
 * Update MessageDelivery DTO
 */
export interface UpdateMessageDeliveryDTO {
  // Properties defined by MessageDelivery model  
  id?: string;
}
