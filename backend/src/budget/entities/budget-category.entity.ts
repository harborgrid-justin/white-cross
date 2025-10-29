/**
 * Budget Category Entity
 *
 * Represents a budget category for fiscal year tracking.
 * Fiscal year runs from July 1 to June 30.
 *
 * Business Rules:
 * - Each category has an allocated amount for a fiscal year
 * - Spent amount is automatically updated when transactions are created
 * - Soft delete via isActive flag preserves historical data
 * - Over-budget spending is allowed but generates warnings
 * Re-export of Sequelize model for backward compatibility
 */

// Re-export the Sequelize model
export {
  BudgetCategory
} from '../../database/models/budget-category.model';
