/**
 * @fileoverview BudgetTransaction repository interface.
 * Auto-generated repository interface for BudgetTransaction data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * BudgetTransaction repository interface
 * Extends base repository with BudgetTransaction-specific operations
 */
export interface IBudgetTransactionRepository extends IRepository<any, any, any> {
  // Add BudgetTransaction-specific methods here if needed
}

/**
 * Create BudgetTransaction DTO
 */
export interface CreateBudgetTransactionDTO {
  [key: string]: any;
}

/**
 * Update BudgetTransaction DTO
 */
export interface UpdateBudgetTransactionDTO {
  [key: string]: any;
}
