/**
 * @fileoverview BudgetCategory repository interface.
 * Auto-generated repository interface for BudgetCategory data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * BudgetCategory repository interface
 * Extends base repository with BudgetCategory-specific operations
 */
export interface IBudgetCategoryRepository extends IRepository<any, any, any> {
  // Add BudgetCategory-specific methods here if needed
}

/**
 * Create BudgetCategory DTO
 */
export interface CreateBudgetCategoryDTO {
  [key: string]: any;
}

/**
 * Update BudgetCategory DTO
 */
export interface UpdateBudgetCategoryDTO {
  [key: string]: any;
}
