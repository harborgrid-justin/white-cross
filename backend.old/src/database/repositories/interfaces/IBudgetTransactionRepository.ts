/**
 * @fileoverview BudgetTransaction repository interface.
 * Repository interface for BudgetTransaction data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * BudgetTransaction repository interface
 * Extends base repository with BudgetTransaction-specific operations
 */
export interface IBudgetTransactionRepository extends IRepository<any, any, any> {
  // Domain-specific methods can be added here
}

/**
 * Create BudgetTransaction DTO
 */
export interface CreateBudgetTransactionDTO {
  // Properties defined by BudgetTransaction model
  id?: string;
}

/**
 * Update BudgetTransaction DTO
 */
export interface UpdateBudgetTransactionDTO {
  // Properties defined by BudgetTransaction model  
  id?: string;
}
