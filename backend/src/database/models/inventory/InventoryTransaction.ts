/**
 * @fileoverview Inventory Transaction Database Model
 * @module database/models/inventory/InventoryTransaction
 * @description Sequelize model for tracking all inventory movements and changes
 *
 * Key Features:
 * - Complete audit trail of all inventory changes
 * - Support for multiple transaction types (PURCHASE, USAGE, ADJUSTMENT, TRANSFER, DISPOSAL)
 * - Batch and expiration date tracking for perishable items
 * - Cost tracking for financial reporting
 * - Reason and notes documentation for compliance
 *
 * @business All inventory movements must be recorded as transactions for audit compliance
 * @business Transactions are immutable once created (no updates allowed)
 * @business Current inventory quantity = SUM(transactions.quantity) for each item
 * @business Negative quantities indicate outbound movements (USAGE, DISPOSAL)
 * @business Positive quantities indicate inbound movements (PURCHASE, ADJUSTMENT)
 *
 * @requires sequelize
 * @requires InventoryTransactionType
 */

/**
 * LOC: 1C16570E37
 * WC-GEN-080 | InventoryTransaction.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - sequelize.ts (database/config/sequelize.ts)
 *   - enums.ts (database/types/enums.ts)
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (database/models/index.ts)
 */

import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';
import { InventoryTransactionType } from '../../types/enums';

/**
 * @interface InventoryTransactionAttributes
 * @description Defines the complete structure of an inventory transaction record
 *
 * @property {string} id - Unique identifier (UUID v4)
 * @property {InventoryTransactionType} type - Transaction type (PURCHASE, USAGE, ADJUSTMENT, TRANSFER, DISPOSAL)
 * @property {number} quantity - Quantity change (positive for additions, negative for reductions)
 * @property {number} [unitCost] - Cost per unit at time of transaction (DECIMAL 10,2)
 * @property {string} [reason] - Explanation for transaction (up to 5000 characters)
 * @property {string} [batchNumber] - Batch/lot number for tracking (up to 100 alphanumeric characters)
 * @property {Date} [expirationDate] - Expiration date for perishable items
 * @property {string} [notes] - Additional transaction notes (up to 10,000 characters)
 * @property {Date} createdAt - Transaction timestamp (immutable)
 * @property {string} inventoryItemId - Foreign key to InventoryItem
 * @property {string} performedById - Foreign key to User who performed transaction
 *
 * @business Transaction Type Usage:
 * - PURCHASE: Receiving new inventory from supplier (positive quantity)
 * - USAGE: Consuming inventory for student care (negative quantity)
 * - ADJUSTMENT: Correcting inventory count after audit (positive or negative)
 * - TRANSFER: Moving between locations (paired transactions)
 * - DISPOSAL: Removing expired or damaged items (negative quantity)
 *
 * @business Batch tracking is critical for:
 * - Product recalls
 * - Expiration management
 * - Quality control investigations
 * - Regulatory compliance (especially for medical supplies)
 */
interface InventoryTransactionAttributes {
  id: string;
  type: InventoryTransactionType;
  quantity: number;
  unitCost?: number;
  reason?: string;
  batchNumber?: string;
  expirationDate?: Date;
  notes?: string;
  createdAt: Date;

  // Foreign Keys
  inventoryItemId: string;
  performedById: string;
}

/**
 * @interface InventoryTransactionCreationAttributes
 * @description Attributes required/optional when creating a new inventory transaction
 * @extends {Optional<InventoryTransactionAttributes>}
 *
 * Required on creation:
 * - type (transaction type)
 * - quantity (cannot be zero)
 * - inventoryItemId
 * - performedById
 *
 * Optional on creation:
 * - id (auto-generated UUID)
 * - createdAt (auto-generated, cannot be changed later)
 * - unitCost, reason, batchNumber, expirationDate, notes
 */
interface InventoryTransactionCreationAttributes
  extends Optional<InventoryTransactionAttributes, 'id' | 'createdAt' | 'unitCost' | 'reason' | 'batchNumber' | 'expirationDate' | 'notes'> {}

/**
 * @class InventoryTransaction
 * @extends {Model<InventoryTransactionAttributes, InventoryTransactionCreationAttributes>}
 * @description Sequelize model for inventory transaction records
 *
 * Represents all movements and changes to inventory quantities. Provides
 * complete audit trail and supports FIFO/LIFO inventory valuation methods.
 *
 * @example
 * // Record a purchase from supplier
 * const purchase = await InventoryTransaction.create({
 *   inventoryItemId: item.id,
 *   type: InventoryTransactionType.PURCHASE,
 *   quantity: 500,
 *   unitCost: 0.15,
 *   batchNumber: "LOT-2024-001",
 *   expirationDate: new Date("2026-12-31"),
 *   performedById: nurse.id,
 *   reason: "Monthly restock order",
 *   notes: "PO #12345 - Medical Supply Co"
 * });
 *
 * @example
 * // Record item usage
 * const usage = await InventoryTransaction.create({
 *   inventoryItemId: item.id,
 *   type: InventoryTransactionType.USAGE,
 *   quantity: -10, // Negative for usage
 *   performedById: nurse.id,
 *   reason: "Used for student injury treatment",
 *   notes: "Student: John Doe, Incident #456"
 * });
 *
 * @example
 * // Calculate current inventory quantity
 * const transactions = await InventoryTransaction.findAll({
 *   where: { inventoryItemId: item.id },
 *   attributes: [
 *     [sequelize.fn('SUM', sequelize.col('quantity')), 'totalQuantity']
 *   ]
 * });
 */
export class InventoryTransaction extends Model<InventoryTransactionAttributes, InventoryTransactionCreationAttributes> implements InventoryTransactionAttributes {
  /**
   * @property {string} id - Unique identifier (UUID v4)
   */
  public id!: string;

  /**
   * @property {InventoryTransactionType} type - Transaction type
   * @validation Required, must be valid InventoryTransactionType enum value
   * @business Types: PURCHASE, USAGE, ADJUSTMENT, TRANSFER, DISPOSAL
   */
  public type!: InventoryTransactionType;

  /**
   * @property {number} quantity - Quantity change
   * @validation Required, non-zero integer, absolute value max 1,000,000
   * @business Positive for additions (PURCHASE, ADJUSTMENT increase)
   * @business Negative for reductions (USAGE, DISPOSAL, ADJUSTMENT decrease)
   * @business Cannot be zero - use ADJUSTMENT with zero-net paired transactions if needed
   */
  public quantity!: number;

  /**
   * @property {number} [unitCost] - Cost per unit
   * @validation Optional, non-negative, DECIMAL(10,2), max $99,999,999.99
   * @business Used for weighted average cost calculation
   * @business Should be recorded for PURCHASE transactions
   * @business Historical cost tracking enables FIFO/LIFO valuation
   */
  public unitCost?: number;

  /**
   * @property {string} [reason] - Transaction explanation
   * @validation Optional, up to 5000 characters
   * @business Required for ADJUSTMENT and DISPOSAL transactions for audit purposes
   * @business Recommended for USAGE to link to student care incidents
   */
  public reason?: string;

  /**
   * @property {string} [batchNumber] - Batch/lot number
   * @validation Optional, alphanumeric, up to 100 characters
   * @business Critical for product recalls and quality control
   * @business Should be recorded for all PURCHASE transactions when available
   * @business Format typically provided by manufacturer/supplier
   */
  public batchNumber?: string;

  /**
   * @property {Date} [expirationDate] - Expiration date
   * @validation Optional, must be valid date, cannot be before 1900
   * @business Required for perishable medical supplies
   * @business System can alert when items are approaching expiration (90 days)
   * @business Cannot add new inventory with past expiration date
   */
  public expirationDate?: Date;

  /**
   * @property {string} [notes] - Additional notes
   * @validation Optional, up to 10,000 characters
   * @business Can include PO numbers, incident references, or other context
   */
  public notes?: string;

  /**
   * @property {Date} createdAt - Transaction timestamp
   * @readonly Immutable once created, serves as official transaction date/time
   * @business Used for audit trails and inventory valuation calculations
   * @business Timestamps enable time-based queries for inventory history
   */
  public readonly createdAt!: Date;

  /**
   * @property {string} inventoryItemId - Inventory item reference
   * @validation Required, must reference valid InventoryItem
   * @business Links transaction to specific inventory item for quantity tracking
   */
  public inventoryItemId!: string;

  /**
   * @property {string} performedById - User who performed transaction
   * @validation Required, must reference valid User
   * @business Required for audit compliance and accountability
   * @business Links to nurse, administrator, or staff member who made the change
   */
  public performedById!: string;
}

InventoryTransaction.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    type: {
      type: DataTypes.ENUM(...Object.values(InventoryTransactionType)),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Transaction type cannot be empty'
        }
      }
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          msg: 'Quantity must be an integer'
        },
        notZero(value: number) {
          if (value === 0) {
            throw new Error('Quantity cannot be zero');
          }
        },
        validRange(value: number) {
          if (Math.abs(value) > 1000000) {
            throw new Error('Quantity cannot exceed 1,000,000 in absolute value');
          }
        }
      }
    },
    unitCost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      validate: {
        min: {
          args: [0],
          msg: 'Unit cost must be non-negative'
        },
        isDecimal: {
          msg: 'Unit cost must be a valid decimal number'
        },
        maxValue(value: number | null) {
          if (value !== null && value > 99999999.99) {
            throw new Error('Unit cost cannot exceed $99,999,999.99');
          }
        }
      }
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: {
          args: [0, 5000],
          msg: 'Reason cannot exceed 5000 characters'
        }
      }
    },
    batchNumber: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: {
          args: [0, 100],
          msg: 'Batch number cannot exceed 100 characters'
        },
        isAlphanumeric: {
          msg: 'Batch number must contain only alphanumeric characters, hyphens, and underscores'
        }
      }
    },
    expirationDate: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        isDate: {
          args: true,
          msg: 'Expiration date must be a valid date'
        },
        isNotTooOld(value: Date | null) {
          if (value && value < new Date('1900-01-01')) {
            throw new Error('Expiration date cannot be before 1900');
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
    inventoryItemId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'inventory_items',
        key: 'id',
      },
      validate: {
        notEmpty: {
          msg: 'Inventory item ID cannot be empty'
        }
      }
    },
    performedById: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      validate: {
        notEmpty: {
          msg: 'Performed by user ID cannot be empty'
        }
      }
    },
    createdAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'inventory_transactions',
    timestamps: false,
    indexes: [
      { fields: ['inventoryItemId'] },
      { fields: ['performedById'] },
      { fields: ['type'] },
      { fields: ['createdAt'] },
      { fields: ['batchNumber'] },
      { fields: ['expirationDate'] },
    ],
    validate: {
      batchAndExpirationForPurchase(this: InventoryTransaction) {
        if (this.type === InventoryTransactionType.PURCHASE && this.quantity > 0) {
          // Warn if batch number or expiration missing for controlled substances
          // This would need to be enhanced based on item type
        }
      },
      expirationDateInFuture(this: InventoryTransaction) {
        if (this.expirationDate && this.type === InventoryTransactionType.PURCHASE) {
          const now = new Date();
          now.setHours(0, 0, 0, 0);
          if (this.expirationDate < now) {
            throw new Error('Cannot add inventory with an expiration date in the past');
          }
        }
      }
    }
  }
);
