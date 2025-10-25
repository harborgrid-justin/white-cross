/**
 * @fileoverview PurchaseOrderItem repository interface.
 * Auto-generated repository interface for PurchaseOrderItem data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * PurchaseOrderItem repository interface
 * Extends base repository with PurchaseOrderItem-specific operations
 */
export interface IPurchaseOrderItemRepository extends IRepository<any, any, any> {
  // Add PurchaseOrderItem-specific methods here if needed
}

/**
 * Create PurchaseOrderItem DTO
 */
export interface CreatePurchaseOrderItemDTO {
  [key: string]: any;
}

/**
 * Update PurchaseOrderItem DTO
 */
export interface UpdatePurchaseOrderItemDTO {
  [key: string]: any;
}
