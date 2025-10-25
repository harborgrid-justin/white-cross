/**
 * @fileoverview InventoryTransaction repository interface.
 * Auto-generated repository interface for InventoryTransaction data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * InventoryTransaction repository interface
 * Extends base repository with InventoryTransaction-specific operations
 */
export interface IInventoryTransactionRepository extends IRepository<any, any, any> {
  // Add InventoryTransaction-specific methods here if needed
}

/**
 * Create InventoryTransaction DTO
 */
export interface CreateInventoryTransactionDTO {
  [key: string]: any;
}

/**
 * Update InventoryTransaction DTO
 */
export interface UpdateInventoryTransactionDTO {
  [key: string]: any;
}
