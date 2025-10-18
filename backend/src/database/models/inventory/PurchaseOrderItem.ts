/**
 * WC-GEN-083 | PurchaseOrderItem.ts - General utility functions and operations
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
 * PurchaseOrderItem Model
 * Line items for purchase orders.
 * Links inventory items to purchase orders with quantity, pricing, and receipt tracking.
 * Supports partial receipt tracking for accurate inventory management.
 */

interface PurchaseOrderItemAttributes {
  id: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  receivedQty: number;
  notes?: string;
  createdAt: Date;

  // Foreign Keys
  purchaseOrderId: string;
  inventoryItemId: string;
}

interface PurchaseOrderItemCreationAttributes
  extends Optional<PurchaseOrderItemAttributes, 'id' | 'createdAt' | 'receivedQty' | 'notes'> {}

export class PurchaseOrderItem extends Model<PurchaseOrderItemAttributes, PurchaseOrderItemCreationAttributes> implements PurchaseOrderItemAttributes {
  public id!: string;
  public quantity!: number;
  public unitCost!: number;
  public totalCost!: number;
  public receivedQty!: number;
  public notes?: string;
  public readonly createdAt!: Date;

  // Foreign Keys
  public purchaseOrderId!: string;
  public inventoryItemId!: string;
}

PurchaseOrderItem.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          msg: 'Quantity must be an integer'
        },
        min: {
          args: [1],
          msg: 'Quantity must be at least 1'
        },
        max: {
          args: [1000000],
          msg: 'Quantity cannot exceed 1,000,000'
        }
      }
    },
    unitCost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: {
          args: [0],
          msg: 'Unit cost must be non-negative'
        },
        isDecimal: {
          msg: 'Unit cost must be a valid decimal number'
        },
        maxValue(value: number) {
          if (value > 99999999.99) {
            throw new Error('Unit cost cannot exceed $99,999,999.99');
          }
        }
      }
    },
    totalCost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: {
          args: [0],
          msg: 'Total cost must be non-negative'
        },
        isDecimal: {
          msg: 'Total cost must be a valid decimal number'
        },
        maxValue(value: number) {
          if (value > 99999999.99) {
            throw new Error('Total cost cannot exceed $99,999,999.99');
          }
        }
      }
    },
    receivedQty: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        isInt: {
          msg: 'Received quantity must be an integer'
        },
        min: {
          args: [0],
          msg: 'Received quantity must be non-negative'
        },
        notExceedOrdered(this: PurchaseOrderItem, value: number) {
          if (value > this.quantity) {
            throw new Error('Received quantity cannot exceed ordered quantity');
          }
        }
      }
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: {
          args: [0, 5000],
          msg: 'Notes cannot exceed 5000 characters'
        }
      }
    },
    purchaseOrderId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'purchase_orders',
        key: 'id',
      },
      onDelete: 'CASCADE',
      validate: {
        notEmpty: {
          msg: 'Purchase order ID cannot be empty'
        }
      }
    },
    inventoryItemId: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Inventory item ID cannot be empty'
        }
      }
    },
    createdAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'purchase_order_items',
    timestamps: false,
    indexes: [
      { fields: ['purchaseOrderId'] },
      { fields: ['inventoryItemId'] },
    ],
    validate: {
      totalCostMatchesCalculation() {
        const calculatedTotal = Number(this.quantity) * Number(this.unitCost);
        const total = Number(this.totalCost);
        if (Math.abs(calculatedTotal - total) > 0.01) {
          throw new Error('Total cost must equal quantity × unit cost');
        }
      }
    }
  }
);
