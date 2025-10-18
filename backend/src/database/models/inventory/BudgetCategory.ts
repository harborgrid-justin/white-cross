/**
 * WC-GEN-077 | BudgetCategory.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../../config/sequelize | Dependencies: sequelize, ../../config/sequelize
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: classes | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';

/**
 * BudgetCategory Model
 * Manages budget categories for healthcare spending tracking.
 * Organizes spending by fiscal year with allocated and spent amounts.
 * Enables budget compliance monitoring and financial reporting.
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

interface BudgetCategoryCreationAttributes
  extends Optional<BudgetCategoryAttributes, 'id' | 'createdAt' | 'updatedAt' | 'description' | 'spentAmount' | 'isActive'> {}

export class BudgetCategory extends Model<BudgetCategoryAttributes, BudgetCategoryCreationAttributes> implements BudgetCategoryAttributes {
  public id!: string;
  public name!: string;
  public description?: string;
  public fiscalYear!: number;
  public allocatedAmount!: number;
  public spentAmount!: number;
  public isActive!: boolean;
  public readonly createdAt!: Date;
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
