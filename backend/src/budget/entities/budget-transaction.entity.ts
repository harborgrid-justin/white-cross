/**
 * Budget Transaction Entity
 *
 * Represents individual spending transactions against budget categories.
 *
 * Business Rules:
 * - Each transaction must belong to an active budget category
 * - Amount is always positive (represents spending)
 * - Transactions can reference external entities (POs, Invoices)
 * - Transaction date defaults to creation time
 * - Updating/deleting transactions automatically adjusts category spent amount
 * Re-export of Sequelize model for backward compatibility
 */

// Re-export the Sequelize model
export {
  BudgetTransaction
} from '../../database/models/budget-transaction.model';
