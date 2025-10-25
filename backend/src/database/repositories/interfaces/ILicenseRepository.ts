/**
 * @fileoverview License repository interface.
 * Repository interface for License data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * License repository interface
 * Extends base repository with License-specific operations
 */
export interface ILicenseRepository extends IRepository<any, any, any> {
  // Domain-specific methods can be added here
}

/**
 * Create License DTO
 */
export interface CreateLicenseDTO {
  // Properties defined by License model
  id?: string;
}

/**
 * Update License DTO
 */
export interface UpdateLicenseDTO {
  // Properties defined by License model  
  id?: string;
}
