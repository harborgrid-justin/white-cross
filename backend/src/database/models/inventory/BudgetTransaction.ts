import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';

/**
 * BudgetTransaction Model
 * Records individual budget transactions against budget categories.
 * Tracks spending with descriptions, dates, and optional references to
 * purchase orders or other transactions.
 * Provides detailed financial audit trail.
 */

interface BudgetTransactionAttributes {
  id: string;
  amount: number;
  description: string;
  transactionDate: Date;
  referenceId?: string;
  referenceType?: string;
  notes?: string;
  createdAt: Date;

  // Foreign Keys
  categoryId: string;
}

interface BudgetTransactionCreationAttributes
  extends Optional<BudgetTransactionAttributes, 'id' | 'createdAt' | 'transactionDate' | 'referenceId' | 'referenceType' | 'notes'> {}

export class BudgetTransaction extends Model<BudgetTransactionAttributes, BudgetTransactionCreationAttributes> implements BudgetTransactionAttributes {
  public id!: string;
  public amount!: number;
  public description!: string;
  public transactionDate!: Date;
  public referenceId?: string;
  public referenceType?: string;
  public notes?: string;
  public readonly createdAt!: Date;

  // Foreign Keys
  public categoryId!: string;
}

BudgetTransaction.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    transactionDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    referenceId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    referenceType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    categoryId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'budget_categories',
        key: 'id',
      },
    },
    createdAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'budget_transactions',
    timestamps: false,
    indexes: [
      { fields: ['categoryId'] },
      { fields: ['transactionDate'] },
      { fields: ['referenceId', 'referenceType'] },
      { fields: ['createdAt'] },
    ],
  }
);
