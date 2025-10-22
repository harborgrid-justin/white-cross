/**
 * @fileoverview Budget Category Database Model
 * @module database/models/inventory/BudgetCategory
 * @description Sequelize model for managing budget categories and fiscal year allocations
 *
 * Key Features:
 * - Fiscal year-based budget tracking
 * - Category-level spending organization
 * - Real-time spent amount tracking
 * - Budget overrun prevention (with small buffer)
 * - Multi-year budget planning support
 *
 * @business Budget categories organize healthcare spending into logical groups
 * @business Each category has allocated amount per fiscal year
 * @business Spent amount updated automatically via BudgetTransaction records
 * @business Categories can be reused across multiple fiscal years
 * @business Inactive categories retained for historical reporting
 *
 * @financial School districts typically use July 1 - June 30 fiscal year
 * @financial Budget allocations approved by school board annually
 * @financial Spending typically restricted to allocated amounts (may allow 0.5% buffer)
 * @financial Year-end unused funds may roll over or be returned to general fund
 *
 * @requires sequelize
 */

/**
 * LOC: 3B66ED3FFF
 * WC-GEN-077 | BudgetCategory.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - sequelize.ts (database/config/sequelize.ts)
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (database/models/index.ts)
 */

import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';

/**
 * @interface BudgetCategoryAttributes
 * @description Defines the complete structure of a budget category record
 *
 * @property {string} id - Unique identifier (UUID v4)
 * @property {string} name - Category name (e.g., "Medical Supplies", "Medications")
 * @property {string} [description] - Category description and purpose
 * @property {number} fiscalYear - Fiscal year (e.g., 2024 for FY 2024-2025)
 * @property {number} allocatedAmount - Total budget allocated for fiscal year
 * @property {number} spentAmount - Total amount spent to date
 * @property {boolean} isActive - Whether category is currently active
 * @property {Date} createdAt - Record creation timestamp
 * @property {Date} updatedAt - Record last update timestamp
 *
 * @business Common Budget Categories:
 * - Medical Supplies: Bandages, gauze, diagnostic supplies
 * - Medications: Over-the-counter and prescription medications
 * - Equipment: Medical devices, thermometers, blood pressure monitors
 * - First Aid: Emergency response supplies
 * - PPE (Personal Protective Equipment): Gloves, masks, sanitizers
 * - Professional Development: Nurse training and certifications
 * - Software/Technology: Health management software subscriptions
 *
 * @financial Budget Lifecycle:
 * 1. Category created with allocatedAmount for fiscal year
 * 2. Transactions recorded against category throughout year
 * 3. spentAmount auto-updated from BudgetTransaction sum
 * 4. Year-end: Review utilization, plan next fiscal year
 */
interface BudgetCategoryAttributes {
  id: string;
  name: string;
  description?: string;
  fiscalYear: number;
  allocatedAmount: number;
  spentAmount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * @interface BudgetCategoryCreationAttributes
 * @description Attributes required/optional when creating a new budget category
 * @extends {Optional<BudgetCategoryAttributes>}
 *
 * Required on creation:
 * - name (category name)
 * - fiscalYear (year for budget allocation)
 * - allocatedAmount (budget amount for the year)
 *
 * Optional on creation:
 * - id (auto-generated UUID)
 * - description
 * - spentAmount (defaults to 0, updated via transactions)
 * - isActive (defaults to true)
 * - createdAt, updatedAt (auto-generated)
 */
interface BudgetCategoryCreationAttributes
  extends Optional<BudgetCategoryAttributes, 'id' | 'createdAt' | 'updatedAt' | 'description' | 'spentAmount' | 'isActive'> {}

/**
 * @class BudgetCategory
 * @extends {Model<BudgetCategoryAttributes, BudgetCategoryCreationAttributes>}
 * @description Sequelize model for budget category records
 *
 * Organizes and tracks healthcare spending by category and fiscal year.
 * Provides budget allocation limits and real-time spending visibility.
 *
 * @example
 * // Create budget category for new fiscal year
 * const category = await BudgetCategory.create({
 *   name: "Medical Supplies",
 *   description: "Non-medication medical supplies including bandages, gauze, and diagnostic supplies",
 *   fiscalYear: 2025,
 *   allocatedAmount: 15000.00,
 *   notes: "Approved by school board 6/15/2024"
 * });
 *
 * @example
 * // Check budget utilization
 * const categories = await BudgetCategory.findAll({
 *   where: { fiscalYear: 2025, isActive: true }
 * });
 * categories.forEach(cat => {
 *   const percentUsed = (cat.spentAmount / cat.allocatedAmount) * 100;
 *   const remaining = cat.allocatedAmount - cat.spentAmount;
 *   console.log(`${cat.name}: ${percentUsed.toFixed(1)}% used, $${remaining} remaining`);
 * });
 *
 * @example
 * // Find categories over budget
 * const overBudget = await BudgetCategory.findAll({
 *   where: {
 *     fiscalYear: 2025,
 *     spentAmount: { [Op.gt]: sequelize.col('allocatedAmount') }
 *   }
 * });
 */
export class BudgetCategory extends Model<BudgetCategoryAttributes, BudgetCategoryCreationAttributes> implements BudgetCategoryAttributes {
  /**
   * @property {string} id - Unique identifier (UUID v4)
   */
  public id!: string;

  /**
   * @property {string} name - Category name
   * @validation Required, 1-255 characters, non-empty
   * @business Should be descriptive and consistent across fiscal years
   * @business Common names: Medical Supplies, Medications, Equipment, First Aid
   */
  public name!: string;

  /**
   * @property {string} [description] - Category description
   * @validation Optional, up to 5000 characters
   * @business Clarifies what expenses belong in this category
   * @business Helps staff correctly categorize purchases
   */
  public description?: string;

  /**
   * @property {number} fiscalYear - Fiscal year
   * @validation Required, integer, 2000-2100
   * @business Typically the year fiscal period begins (e.g., 2024 for FY 2024-2025)
   * @business School fiscal years commonly run July 1 - June 30
   * @business Same category name can exist for multiple fiscal years
   */
  public fiscalYear!: number;

  /**
   * @property {number} allocatedAmount - Allocated budget amount
   * @validation Required, non-negative, DECIMAL(10,2), max $99,999,999.99
   * @financial Set at beginning of fiscal year based on board approval
   * @financial Cannot be reduced below spentAmount
   * @financial Mid-year adjustments may increase allocation if approved
   */
  public allocatedAmount!: number;

  /**
   * @property {number} spentAmount - Amount spent to date
   * @validation Required, non-negative, DECIMAL(10,2), max $99,999,999.99
   * @default 0
   * @financial Auto-calculated from BudgetTransaction records
   * @financial Should not be manually edited except for corrections
   * @financial Cannot exceed allocatedAmount (with 0.5% buffer for rounding)
   */
  public spentAmount!: number;

  /**
   * @property {boolean} isActive - Active status
   * @validation Required boolean
   * @default true
   * @business Set to false to prevent new transactions
   * @business Keep inactive for historical reporting
   * @business Common to deactivate when fiscal year ends
   */
  public isActive!: boolean;

  /**
   * @property {Date} createdAt - Record creation timestamp
   * @readonly Auto-generated on creation
   */
  public readonly createdAt!: Date;

  /**
   * @property {Date} updatedAt - Last update timestamp
   * @readonly Auto-updated on any modification
   * @business Updated when allocatedAmount adjusted or spentAmount recalculated
   */
  public readonly updatedAt!: Date;
}

BudgetCategory.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Budget category name cannot be empty'
        },
        len: {
          args: [1, 255],
          msg: 'Budget category name must be between 1 and 255 characters'
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: {
          args: [0, 5000],
          msg: 'Description cannot exceed 5000 characters'
        }
      }
    },
    fiscalYear: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          msg: 'Fiscal year must be an integer'
        },
        min: {
          args: [2000],
          msg: 'Fiscal year must be 2000 or later'
        },
        max: {
          args: [2100],
          msg: 'Fiscal year cannot exceed 2100'
        }
      }
    },
    allocatedAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: {
          args: [0],
          msg: 'Allocated amount must be non-negative'
        },
        isDecimal: {
          msg: 'Allocated amount must be a valid decimal number'
        },
        maxValue(value: number) {
          if (value > 99999999.99) {
            throw new Error('Allocated amount cannot exceed $99,999,999.99');
          }
        }
      }
    },
    spentAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: {
          args: [0],
          msg: 'Spent amount must be non-negative'
        },
        isDecimal: {
          msg: 'Spent amount must be a valid decimal number'
        },
        maxValue(value: number) {
          if (value > 99999999.99) {
            throw new Error('Spent amount cannot exceed $99,999,999.99');
          }
        }
      }
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'budget_categories',
    timestamps: true,
    indexes: [
      { fields: ['fiscalYear'] },
      { fields: ['isActive'] },
      { fields: ['name'] },
      { fields: ['fiscalYear', 'name'] },
    ],
    validate: {
      spentNotExceedAllocated() {
        const spent = Number(this.spentAmount);
        const allocated = Number(this.allocatedAmount);
        // Allow a small buffer for rounding (0.5%)
        const buffer = allocated * 0.005;
        if (spent > allocated + buffer) {
          throw new Error(
            `Spent amount ($${spent.toFixed(2)}) cannot exceed allocated amount ($${allocated.toFixed(2)})`
          );
        }
      }
    }
  }
);
