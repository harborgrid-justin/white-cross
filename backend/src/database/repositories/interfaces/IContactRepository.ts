/**
 * @fileoverview Contact repository interface.
 * Auto-generated repository interface for Contact data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * Contact repository interface
 * Extends base repository with Contact-specific operations
 */
export interface IContactRepository extends IRepository<any, any, any> {
  // Add Contact-specific methods here if needed
}

/**
 * Create Contact DTO
 */
export interface CreateContactDTO {
  [key: string]: any;
}

/**
 * Update Contact DTO
 */
export interface UpdateContactDTO {
  [key: string]: any;
}
