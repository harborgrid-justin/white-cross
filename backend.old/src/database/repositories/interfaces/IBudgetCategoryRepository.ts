/**
 * @fileoverview BudgetCategory repository interface.
 * Repository interface for BudgetCategory data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * BudgetCategory repository interface
 * Extends base repository with BudgetCategory-specific operations
 */
export interface IBudgetCategoryRepository extends IRepository<any, any, any> {
  // Domain-specific methods can be added here
}

/**
 * Create BudgetCategory DTO
 */
export interface CreateBudgetCategoryDTO {
  // Properties defined by BudgetCategory model
  id?: string;
}

/**
 * Update BudgetCategory DTO
 */
export interface UpdateBudgetCategoryDTO {
  // Properties defined by BudgetCategory model  
  id?: string;
}
