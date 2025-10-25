/**
 * @fileoverview PurchaseOrder repository interface.
 * Auto-generated repository interface for PurchaseOrder data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * PurchaseOrder repository interface
 * Extends base repository with PurchaseOrder-specific operations
 */
export interface IPurchaseOrderRepository extends IRepository<any, any, any> {
  // Add PurchaseOrder-specific methods here if needed
}

/**
 * Create PurchaseOrder DTO
 */
export interface CreatePurchaseOrderDTO {
  [key: string]: any;
}

/**
 * Update PurchaseOrder DTO
 */
export interface UpdatePurchaseOrderDTO {
  [key: string]: any;
}
