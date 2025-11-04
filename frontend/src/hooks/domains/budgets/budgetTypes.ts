/**
 * Budget Domain Type Definitions
 *
 * Provides comprehensive TypeScript type definitions for the budget domain
 * including budgets, categories, transactions, reports, and user references.
 *
 * @module hooks/domains/budgets/budgetTypes
 *
 * @remarks
 * **Type Safety:**
 * - End-to-end type safety for budget operations
 * - Strict type definitions for all entities
 * - Union types for status and type enums
 *
 * **Entity Relationships:**
 * - Budget -> BudgetCategory[] (one-to-many)
 * - BudgetCategory -> BudgetTransaction[] (one-to-many)
 * - BudgetCategory -> BudgetCategory[] (hierarchical children)
 *
 * @since 1.0.0
 */

// Core types: Budget, BudgetCategory, BudgetUser
export type {
  Budget,
  BudgetCategory,
  BudgetUser
} from './budgetTypes.core';

// Transaction types: BudgetTransaction, TransactionAttachment
export type {
  BudgetTransaction,
  TransactionAttachment
} from './budgetTypes.transactions';

// Report types: BudgetReport
export type {
  BudgetReport
} from './budgetTypes.reports';
