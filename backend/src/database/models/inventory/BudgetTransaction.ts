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
      validate: {
        isDecimal: {
          msg: 'Amount must be a valid decimal number'
        },
        notZero(value: number) {
          if (value === 0) {
            throw new Error('Transaction amount cannot be zero');
          }
        },
        validRange(value: number) {
          if (Math.abs(value) > 99999999.99) {
            throw new Error('Transaction amount cannot exceed $99,999,999.99 in absolute value');
          }
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Description cannot be empty'
        },
        len: {
          args: [1, 5000],
          msg: 'Description must be between 1 and 5000 characters'
        }
      }
    },
    transactionDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      validate: {
        isDate: {
          msg: 'Transaction date must be a valid date'
        },
        notTooOld(value: Date) {
          if (value < new Date('2000-01-01')) {
            throw new Error('Transaction date cannot be before year 2000');
          }
        },
        notInFuture(value: Date) {
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          tomorrow.setHours(0, 0, 0, 0);
          if (value >= tomorrow) {
            throw new Error('Transaction date cannot be in the future');
          }
        }
      }
    },
    referenceId: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: {
          args: [0, 255],
          msg: 'Reference ID cannot exceed 255 characters'
        }
      }
    },
    referenceType: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: {
          args: [0, 100],
          msg: 'Reference type cannot exceed 100 characters'
        },
        isValidType(value: string | null) {
          if (value) {
            const validTypes = ['PURCHASE_ORDER', 'INVOICE', 'MANUAL', 'ADJUSTMENT', 'OTHER'];
            if (!validTypes.includes(value)) {
              throw new Error(
                `Reference type must be one of: ${validTypes.join(', ')}`
              );
            }
          }
        }
      }
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: {
          args: [0, 10000],
          msg: 'Notes cannot exceed 10,000 characters'
        }
      }
    },
    categoryId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'budget_categories',
        key: 'id',
      },
      validate: {
        notEmpty: {
          msg: 'Category ID cannot be empty'
        }
      }
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
    validate: {
      referenceConsistency() {
        if ((this.referenceId && !this.referenceType) || (!this.referenceId && this.referenceType)) {
          throw new Error('Both reference ID and reference type must be provided together, or both omitted');
        }
      }
    }
  }
);
