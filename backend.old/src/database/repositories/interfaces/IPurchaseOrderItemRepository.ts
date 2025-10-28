/**
 * @fileoverview PurchaseOrderItem repository interface.
 * Repository interface for PurchaseOrderItem data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * PurchaseOrderItem repository interface
 * Extends base repository with PurchaseOrderItem-specific operations
 */
export interface IPurchaseOrderItemRepository extends IRepository<any, any, any> {
  // Domain-specific methods can be added here
}

/**
 * Create PurchaseOrderItem DTO
 */
export interface CreatePurchaseOrderItemDTO {
  // Properties defined by PurchaseOrderItem model
  id?: string;
}

/**
 * Update PurchaseOrderItem DTO
 */
export interface UpdatePurchaseOrderItemDTO {
  // Properties defined by PurchaseOrderItem model  
  id?: string;
}
