/**
 * @fileoverview WitnessStatement repository interface.
 * Auto-generated repository interface for WitnessStatement data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * WitnessStatement repository interface
 * Extends base repository with WitnessStatement-specific operations
 */
export interface IWitnessStatementRepository extends IRepository<any, any, any> {
  // Add WitnessStatement-specific methods here if needed
}

/**
 * Create WitnessStatement DTO
 */
export interface CreateWitnessStatementDTO {
  [key: string]: any;
}

/**
 * Update WitnessStatement DTO
 */
export interface UpdateWitnessStatementDTO {
  [key: string]: any;
}
