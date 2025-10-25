/**
 * @fileoverview License repository interface.
 * Auto-generated repository interface for License data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * License repository interface
 * Extends base repository with License-specific operations
 */
export interface ILicenseRepository extends IRepository<any, any, any> {
  // Add License-specific methods here if needed
}

/**
 * Create License DTO
 */
export interface CreateLicenseDTO {
  [key: string]: any;
}

/**
 * Update License DTO
 */
export interface UpdateLicenseDTO {
  [key: string]: any;
}
