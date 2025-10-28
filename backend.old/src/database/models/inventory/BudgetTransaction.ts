/**
 * @fileoverview Budget Transaction Database Model
 * @module database/models/inventory/BudgetTransaction
 * @description Sequelize model for recording individual budget transactions
 *
 * Key Features:
 * - Detailed transaction logging for audit compliance
 * - Links to purchase orders and other source documents
 * - Supports positive (spending) and negative (refunds/adjustments) amounts
 * - Categorized spending for budget tracking
 * - Immutable records with timestamp-only tracking
 *
 * @business All spending against budget categories must be recorded as transactions
 * @business Transactions are immutable once created (no updates/deletes)
 * @business Budget category spentAmount = SUM(transactions.amount) for that category
 * @business Negative amounts represent refunds, credits, or downward adjustments
 * @business Positive amounts represent expenditures, encumbrances, or upward adjustments
 *
 * @financial Transaction Date vs Created At:
 * - transactionDate: When expense actually occurred (e.g., invoice date)
 * - createdAt: When record was entered into system
 * - These may differ for backdated entries or delayed invoice processing
 *
 * @financial Reference Types:
 * - PURCHASE_ORDER: Linked to PurchaseOrder record
 * - INVOICE: External vendor invoice
 * - MANUAL: Manual entry by admin
 * - ADJUSTMENT: Budget correction or reallocation
 * - OTHER: Other document types
 *
 * @requires sequelize
 */

/**
 * LOC: 63D7B4C804
 * WC-GEN-078 | BudgetTransaction.ts - General utility functions and operations
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
 * @interface BudgetTransactionAttributes
 * @description Defines the complete structure of a budget transaction record
 *
 * @property {string} id - Unique identifier (UUID v4)
 * @property {number} amount - Transaction amount (positive = expense, negative = credit)
 * @property {string} description - Transaction description (required, 1-5000 characters)
 * @property {Date} transactionDate - Date transaction occurred
 * @property {string} [referenceId] - ID of related document (e.g., PO number, invoice number)
 * @property {string} [referenceType] - Type of referenced document
 * @property {string} [notes] - Additional transaction notes
 * @property {Date} createdAt - Record creation timestamp
 * @property {string} categoryId - Foreign key to BudgetCategory
 *
 * @business Transaction Amount Rules:
 * - Positive: Expenditures, encumbrances (reserved funds)
 * - Negative: Refunds, credits, reversed encumbrances
 * - Cannot be zero (validation enforced)
 * - Absolute value cannot exceed $99,999,999.99
 *
 * @business Reference Tracking:
 * - referenceId + referenceType together link to source document
 * - Both must be provided together or both omitted
 * - Enables audit trail from budget to source documentation
 * - Examples: ("PO-2024-001", "PURCHASE_ORDER") or ("INV-12345", "INVOICE")
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

/**
 * @interface BudgetTransactionCreationAttributes
 * @description Attributes required/optional when creating a new budget transaction
 * @extends {Optional<BudgetTransactionAttributes>}
 *
 * Required on creation:
 * - amount (cannot be zero)
 * - description (explanation of transaction)
 * - categoryId (budget category to charge)
 *
 * Optional on creation:
 * - id (auto-generated UUID)
 * - transactionDate (defaults to NOW)
 * - referenceId, referenceType (both required together if used)
 * - notes
 * - createdAt (auto-generated, immutable)
 */
interface BudgetTransactionCreationAttributes
  extends Optional<BudgetTransactionAttributes, 'id' | 'createdAt' | 'transactionDate' | 'referenceId' | 'referenceType' | 'notes'> {}

/**
 * @class BudgetTransaction
 * @extends {Model<BudgetTransactionAttributes, BudgetTransactionCreationAttributes>}
 * @description Sequelize model for budget transaction records
 *
 * Records all financial transactions against budget categories. Provides
 * complete audit trail and supports automated budget tracking.
 *
 * @example
 * // Record purchase order expense
 * const transaction = await BudgetTransaction.create({
 *   categoryId: medicalSuppliesCategory.id,
 *   amount: 1250.00,
 *   description: "Monthly medical supplies order",
 *   transactionDate: new Date(),
 *   referenceId: "PO-2024-001",
 *   referenceType: "PURCHASE_ORDER",
 *   notes: "Approved by director 10/15/2024"
 * });
 *
 * @example
 * // Record vendor refund
 * const refund = await BudgetTransaction.create({
 *   categoryId: equipmentCategory.id,
 *   amount: -150.00, // Negative for credit
 *   description: "Refund for defective thermometer",
 *   transactionDate: new Date(),
 *   referenceId: "INV-98765",
 *   referenceType: "INVOICE",
 *   notes: "Vendor credit memo #CM-456"
 * });
 *
 * @example
 * // Calculate category spending
 * const transactions = await BudgetTransaction.findAll({
 *   where: { categoryId: category.id },
 *   attributes: [
 *     [sequelize.fn('SUM', sequelize.col('amount')), 'totalSpent'],
 *     [sequelize.fn('COUNT', sequelize.col('id')), 'transactionCount']
 *   ]
 * });
 *
 * @example
 * // Find recent transactions
 * const recentTransactions = await BudgetTransaction.findAll({
 *   where: {
 *     transactionDate: {
 *       [Op.gte]: new Date(new Date().setDate(new Date().getDate() - 30))
 *     }
 *   },
 *   order: [['transactionDate', 'DESC']],
 *   include: [{ model: BudgetCategory }]
 * });
 */
export class BudgetTransaction extends Model<BudgetTransactionAttributes, BudgetTransactionCreationAttributes> implements BudgetTransactionAttributes {
  /**
   * @property {string} id - Unique identifier (UUID v4)
   */
  public id!: string;

  /**
   * @property {number} amount - Transaction amount
   * @validation Required, non-zero, DECIMAL(10,2), absolute value max $99,999,999.99
   * @financial Positive values = expenditures/charges to budget
   * @financial Negative values = refunds/credits to budget
   * @financial Cannot be zero (use ADJUSTMENT type for zero-sum corrections)
   */
  public amount!: number;

  /**
   * @property {string} description - Transaction description
   * @validation Required, 1-5000 characters, non-empty
   * @business Should clearly explain purpose of transaction
   * @business Include relevant details: vendor, item, quantity, reason
   * @business Used for audit reporting and budget reviews
   */
  public description!: string;

  /**
   * @property {Date} transactionDate - Date transaction occurred
   * @validation Required, cannot be before year 2000, cannot be in future
   * @default NOW
   * @business Represents actual transaction date (e.g., invoice date, PO approval date)
   * @business May differ from createdAt for backdated or delayed entries
   * @business Used for fiscal year reporting and accrual accounting
   */
  public transactionDate!: Date;

  /**
   * @property {string} [referenceId] - Reference document ID
   * @validation Optional, up to 255 characters, required if referenceType is set
   * @business Links to source document for audit trail
   * @business Examples: "PO-2024-001", "INV-12345", "ADJ-2024-Q2-01"
   * @business Must be provided with referenceType
   */
  public referenceId?: string;

  /**
   * @property {string} [referenceType] - Reference document type
   * @validation Optional, up to 100 characters, must be valid type, required if referenceId is set
   * @business Valid types: PURCHASE_ORDER, INVOICE, MANUAL, ADJUSTMENT, OTHER
   * @business Categorizes source document for reporting
   * @business Must be provided with referenceId
   */
  public referenceType?: string;

  /**
   * @property {string} [notes] - Additional notes
   * @validation Optional, up to 10,000 characters
   * @business Can include approval information, special circumstances, or audit notes
   */
  public notes?: string;

  /**
   * @property {Date} createdAt - Record creation timestamp
   * @readonly Immutable once created, tracks when record was entered
   * @business May differ from transactionDate for backdated entries
   */
  public readonly createdAt!: Date;

  /**
   * @property {string} categoryId - Budget category reference
   * @validation Required, must reference valid BudgetCategory
   * @business Determines which budget category is charged/credited
   * @business Category should be active and match fiscal year of transaction
   */
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
          args: true,
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
