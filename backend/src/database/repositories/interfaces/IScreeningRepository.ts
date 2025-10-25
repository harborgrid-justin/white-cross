/**
 * @fileoverview Screening repository interface.
 * Auto-generated repository interface for Screening data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * Screening repository interface
 * Extends base repository with Screening-specific operations
 */
export interface IScreeningRepository extends IRepository<any, any, any> {
  // Add Screening-specific methods here if needed
}

/**
 * Create Screening DTO
 */
export interface CreateScreeningDTO {
  [key: string]: any;
}

/**
 * Update Screening DTO
 */
export interface UpdateScreeningDTO {
  [key: string]: any;
}
