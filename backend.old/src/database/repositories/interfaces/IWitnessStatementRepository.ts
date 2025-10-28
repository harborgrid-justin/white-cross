/**
 * @fileoverview WitnessStatement repository interface.
 * Repository interface for WitnessStatement data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * WitnessStatement repository interface
 * Extends base repository with WitnessStatement-specific operations
 */
export interface IWitnessStatementRepository extends IRepository<any, any, any> {
  // Domain-specific methods can be added here
}

/**
 * Create WitnessStatement DTO
 */
export interface CreateWitnessStatementDTO {
  // Properties defined by WitnessStatement model
  id?: string;
}

/**
 * Update WitnessStatement DTO
 */
export interface UpdateWitnessStatementDTO {
  // Properties defined by WitnessStatement model  
  id?: string;
}
