/**
 * @fileoverview Vendor repository interface.
 * Repository interface for Vendor data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * Vendor repository interface
 * Extends base repository with Vendor-specific operations
 */
export interface IVendorRepository extends IRepository<any, any, any> {
  // Domain-specific methods can be added here
}

/**
 * Create Vendor DTO
 */
export interface CreateVendorDTO {
  // Properties defined by Vendor model
  id?: string;
}

/**
 * Update Vendor DTO
 */
export interface UpdateVendorDTO {
  // Properties defined by Vendor model  
  id?: string;
}
