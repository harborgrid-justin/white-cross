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
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    fiscalYear: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    allocatedAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    spentAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
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
    ],
  }
);
