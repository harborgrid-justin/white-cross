import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';
import { InventoryTransactionType } from '../../types/enums';

/**
 * InventoryTransaction Model
 * Records all inventory movements including purchases, usage, adjustments,
 * transfers, and disposals.
 * Provides complete audit trail for inventory management and cost tracking.
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

interface InventoryTransactionCreationAttributes
  extends Optional<InventoryTransactionAttributes, 'id' | 'createdAt' | 'unitCost' | 'reason' | 'batchNumber' | 'expirationDate' | 'notes'> {}

export class InventoryTransaction extends Model<InventoryTransactionAttributes, InventoryTransactionCreationAttributes> implements InventoryTransactionAttributes {
  public id!: string;
  public type!: InventoryTransactionType;
  public quantity!: number;
  public unitCost?: number;
  public reason?: string;
  public batchNumber?: string;
  public expirationDate?: Date;
  public notes?: string;
  public readonly createdAt!: Date;

  // Foreign Keys
  public inventoryItemId!: string;
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
