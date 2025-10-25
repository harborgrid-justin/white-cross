/**
 * @fileoverview PurchaseOrder repository interface.
 * Repository interface for PurchaseOrder data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * PurchaseOrder repository interface
 * Extends base repository with PurchaseOrder-specific operations
 */
export interface IPurchaseOrderRepository extends IRepository<any, any, any> {
  // Domain-specific methods can be added here
}

/**
 * Create PurchaseOrder DTO
 */
export interface CreatePurchaseOrderDTO {
  // Properties defined by PurchaseOrder model
  id?: string;
}

/**
 * Update PurchaseOrder DTO
 */
export interface UpdatePurchaseOrderDTO {
  // Properties defined by PurchaseOrder model  
  id?: string;
}
