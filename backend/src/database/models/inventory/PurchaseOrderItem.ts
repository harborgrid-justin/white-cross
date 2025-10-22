/**
 * @fileoverview Purchase Order Item (Line Item) Database Model
 * @module database/models/inventory/PurchaseOrderItem
 * @description Sequelize model for individual line items within purchase orders
 *
 * Key Features:
 * - Links specific inventory items to purchase orders
 * - Tracks ordered quantity, unit cost, and total cost per line
 * - Supports partial receipt tracking
 * - Enables detailed cost analysis per item
 * - Cascades deletion with parent purchase order
 *
 * @business Each PurchaseOrder contains one or more PurchaseOrderItems
 * @business Line items are immutable once order is approved (to preserve pricing)
 * @business Partial receipts update receivedQty; when receivedQty = quantity, item is complete
 * @business Unit cost may differ from InventoryItem.unitCost due to pricing negotiations
 *
 * @financial totalCost MUST equal quantity × unitCost (validated)
 * @financial Purchase order subtotal = SUM(all line items' totalCost)
 *
 * @requires sequelize
 */

/**
 * LOC: 6FCE2F76CB
 * WC-GEN-083 | PurchaseOrderItem.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - sequelize.ts (database/config/sequelize.ts)
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (database/models/index.ts)
 *   - PurchaseOrder.ts (database/models/inventory/PurchaseOrder.ts)
 */

import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';

/**
 * @interface PurchaseOrderItemAttributes
 * @description Defines the complete structure of a purchase order line item
 *
 * @property {string} id - Unique identifier (UUID v4)
 * @property {number} quantity - Quantity ordered
 * @property {number} unitCost - Cost per unit at time of order (DECIMAL 10,2)
 * @property {number} totalCost - Total cost for this line (quantity × unitCost)
 * @property {number} receivedQty - Quantity received so far
 * @property {string} [notes] - Line item specific notes
 * @property {Date} createdAt - Record creation timestamp
 * @property {string} purchaseOrderId - Foreign key to PurchaseOrder
 * @property {string} inventoryItemId - Foreign key to InventoryItem (not medication)
 *
 * @business Line Item Receipt Tracking:
 * - receivedQty starts at 0 when order is created
 * - Updated incrementally as shipments are received
 * - When receivedQty = quantity, line item is complete
 * - receivedQty cannot exceed ordered quantity
 *
 * @business Pricing Considerations:
 * - unitCost captured at order time may differ from current InventoryItem.unitCost
 * - Preserves historical pricing for accurate cost analysis
 * - Used to update InventoryItem.unitCost via weighted average when received
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

/**
 * @interface PurchaseOrderItemCreationAttributes
 * @description Attributes required/optional when creating a new line item
 * @extends {Optional<PurchaseOrderItemAttributes>}
 *
 * Required on creation:
 * - purchaseOrderId
 * - inventoryItemId
 * - quantity (minimum 1)
 * - unitCost (non-negative)
 * - totalCost (must equal quantity × unitCost)
 *
 * Optional on creation:
 * - id (auto-generated UUID)
 * - receivedQty (defaults to 0)
 * - notes
 * - createdAt (auto-generated)
 */
interface PurchaseOrderItemCreationAttributes
  extends Optional<PurchaseOrderItemAttributes, 'id' | 'createdAt' | 'receivedQty' | 'notes'> {}

/**
 * @class PurchaseOrderItem
 * @extends {Model<PurchaseOrderItemAttributes, PurchaseOrderItemCreationAttributes>}
 * @description Sequelize model for purchase order line items
 *
 * Represents individual items within a purchase order. Each line tracks the
 * specific inventory item, quantity, pricing, and receipt status.
 *
 * @example
 * // Add line item to purchase order
 * const lineItem = await PurchaseOrderItem.create({
 *   purchaseOrderId: po.id,
 *   inventoryItemId: bandages.id,
 *   quantity: 500,
 *   unitCost: 0.15,
 *   totalCost: 75.00,
 *   notes: "Bulk discount applied"
 * });
 *
 * @example
 * // Record partial receipt
 * await lineItem.update({
 *   receivedQty: lineItem.receivedQty + 250 // Received 250 of 500 ordered
 * });
 *
 * @example
 * // Check if line item is fully received
 * const isComplete = lineItem.receivedQty === lineItem.quantity;
 *
 * @example
 * // Calculate purchase order completion percentage
 * const items = await PurchaseOrderItem.findAll({
 *   where: { purchaseOrderId: po.id }
 * });
 * const totalOrdered = items.reduce((sum, item) => sum + item.quantity, 0);
 * const totalReceived = items.reduce((sum, item) => sum + item.receivedQty, 0);
 * const percentComplete = (totalReceived / totalOrdered) * 100;
 */
export class PurchaseOrderItem extends Model<PurchaseOrderItemAttributes, PurchaseOrderItemCreationAttributes> implements PurchaseOrderItemAttributes {
  /**
   * @property {string} id - Unique identifier (UUID v4)
   */
  public id!: string;

  /**
   * @property {number} quantity - Quantity ordered
   * @validation Required, integer, minimum 1, max 1,000,000
   * @business Quantity must be positive and reasonable for the item
   */
  public quantity!: number;

  /**
   * @property {number} unitCost - Cost per unit
   * @validation Required, non-negative, DECIMAL(10,2), max $99,999,999.99
   * @financial Captured from vendor quote/invoice at order time
   * @financial May include negotiated discounts or bulk pricing
   * @financial Used to calculate weighted average cost when inventory is received
   */
  public unitCost!: number;

  /**
   * @property {number} totalCost - Total line cost
   * @validation Required, non-negative, DECIMAL(10,2), max $99,999,999.99
   * @financial MUST equal quantity × unitCost (validated in model)
   * @financial Included in purchase order subtotal
   */
  public totalCost!: number;

  /**
   * @property {number} receivedQty - Quantity received
   * @validation Required, non-negative integer
   * @default 0
   * @business Updated when shipments are received
   * @business Cannot exceed ordered quantity
   * @business Enables partial receipt tracking and backorder management
   */
  public receivedQty!: number;

  /**
   * @property {string} [notes] - Line item notes
   * @validation Optional, up to 5000 characters
   * @business Can include item-specific instructions or discounts
   */
  public notes?: string;

  /**
   * @property {Date} createdAt - Record creation timestamp
   * @readonly Timestamp-only model (no updatedAt)
   */
  public readonly createdAt!: Date;

  /**
   * @property {string} purchaseOrderId - Parent purchase order reference
   * @validation Required, must reference valid PurchaseOrder
   * @business Cascades on delete - removing PO deletes all line items
   */
  public purchaseOrderId!: string;

  /**
   * @property {string} inventoryItemId - Inventory item reference
   * @validation Required, must reference valid InventoryItem
   * @business Links to the specific item being ordered
   * @business For medications, use separate medication ordering workflow
   */
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
