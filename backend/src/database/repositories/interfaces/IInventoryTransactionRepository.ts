/**
 * @fileoverview InventoryTransaction repository interface.
 * Repository interface for InventoryTransaction data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * InventoryTransaction repository interface
 * Extends base repository with InventoryTransaction-specific operations
 */
export interface IInventoryTransactionRepository extends IRepository<any, any, any> {
  // Domain-specific methods can be added here
}

/**
 * Create InventoryTransaction DTO
 */
export interface CreateInventoryTransactionDTO {
  // Properties defined by InventoryTransaction model
  id?: string;
}

/**
 * Update InventoryTransaction DTO
 */
export interface UpdateInventoryTransactionDTO {
  // Properties defined by InventoryTransaction model  
  id?: string;
}
