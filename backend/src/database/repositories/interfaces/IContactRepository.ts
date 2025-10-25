/**
 * @fileoverview Contact repository interface.
 * Repository interface for Contact data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * Contact repository interface
 * Extends base repository with Contact-specific operations
 */
export interface IContactRepository extends IRepository<any, any, any> {
  // Domain-specific methods can be added here
}

/**
 * Create Contact DTO
 */
export interface CreateContactDTO {
  // Properties defined by Contact model
  id?: string;
}

/**
 * Update Contact DTO
 */
export interface UpdateContactDTO {
  // Properties defined by Contact model  
  id?: string;
}
