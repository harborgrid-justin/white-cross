/**
 * @fileoverview InventoryItem repository interface.
 * Auto-generated repository interface for InventoryItem data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * InventoryItem repository interface
 * Extends base repository with InventoryItem-specific operations
 */
export interface IInventoryItemRepository extends IRepository<any, any, any> {
  // Add InventoryItem-specific methods here if needed
}

/**
 * Create InventoryItem DTO
 */
export interface CreateInventoryItemDTO {
  [key: string]: any;
}

/**
 * Update InventoryItem DTO
 */
export interface UpdateInventoryItemDTO {
  [key: string]: any;
}
