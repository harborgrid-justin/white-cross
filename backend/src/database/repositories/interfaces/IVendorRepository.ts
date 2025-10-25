/**
 * @fileoverview Vendor repository interface.
 * Auto-generated repository interface for Vendor data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * Vendor repository interface
 * Extends base repository with Vendor-specific operations
 */
export interface IVendorRepository extends IRepository<any, any, any> {
  // Add Vendor-specific methods here if needed
}

/**
 * Create Vendor DTO
 */
export interface CreateVendorDTO {
  [key: string]: any;
}

/**
 * Update Vendor DTO
 */
export interface UpdateVendorDTO {
  [key: string]: any;
}
