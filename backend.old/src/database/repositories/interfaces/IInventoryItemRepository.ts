/**
 * @fileoverview InventoryItem repository interface.
 * Repository interface for InventoryItem data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * InventoryItem repository interface
 * Extends base repository with InventoryItem-specific operations
 */
export interface IInventoryItemRepository extends IRepository<any, any, any> {
  // Domain-specific methods can be added here
}

/**
 * Create InventoryItem DTO
 */
export interface CreateInventoryItemDTO {
  // Properties defined by InventoryItem model
  id?: string;
}

/**
 * Update InventoryItem DTO
 */
export interface UpdateInventoryItemDTO {
  // Properties defined by InventoryItem model  
  id?: string;
}
