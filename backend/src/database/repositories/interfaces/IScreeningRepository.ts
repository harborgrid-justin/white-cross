/**
 * @fileoverview Screening repository interface.
 * Repository interface for Screening data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * Screening repository interface
 * Extends base repository with Screening-specific operations
 */
export interface IScreeningRepository extends IRepository<any, any, any> {
  // Domain-specific methods can be added here
}

/**
 * Create Screening DTO
 */
export interface CreateScreeningDTO {
  // Properties defined by Screening model
  id?: string;
}

/**
 * Update Screening DTO
 */
export interface UpdateScreeningDTO {
  // Properties defined by Screening model  
  id?: string;
}
