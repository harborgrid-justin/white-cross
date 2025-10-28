/**
 * @fileoverview Purchase Order Database Model
 * @module database/models/inventory/PurchaseOrder
 * @description Sequelize model for managing purchase orders and procurement workflow
 *
 * Key Features:
 * - Multi-stage approval workflow (PENDING → APPROVED → ORDERED → RECEIVED)
 * - Financial tracking with itemized costs (subtotal, tax, shipping)
 * - Partial receipt support
 * - Vendor linking and payment tracking
 * - Date tracking (order, expected, received)
 *
 * @business Purchase orders require approval before submission to vendor
 * @business Approval workflow may require authorization based on order total
 * @business Orders over $X may require additional approval levels (configurable)
 * @business Partial receipts update status to PARTIALLY_RECEIVED
 * @business Budget impact recorded when order is APPROVED
 *
 * @financial Total must equal subtotal + tax + shipping
 * @financial Purchase orders create pending budget transactions when approved
 * @financial Actual budget charge occurs when items are received
 *
 * @requires sequelize
 * @requires PurchaseOrderStatus
 */

/**
 * LOC: E3F3A9F510
 * WC-GEN-082 | PurchaseOrder.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - sequelize.ts (database/config/sequelize.ts)
 *   - enums.ts (database/types/enums.ts)
 *   - PurchaseOrderItem.ts (database/models/inventory/PurchaseOrderItem.ts)
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (database/models/index.ts)
 */

import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';
import { PurchaseOrderStatus } from '../../types/enums';
import type { PurchaseOrderItem } from './PurchaseOrderItem';

/**
 * @interface PurchaseOrderAttributes
 * @description Defines the complete structure of a purchase order record
 *
 * @property {string} id - Unique identifier (UUID v4)
 * @property {string} orderNumber - Human-readable order number (unique, e.g., "PO-2024-001")
 * @property {PurchaseOrderStatus} status - Current order status in workflow
 * @property {Date} orderDate - Date order was created
 * @property {Date} [expectedDate] - Expected delivery date
 * @property {Date} [receivedDate] - Date order was fully received
 * @property {number} subtotal - Sum of all line items before tax/shipping (DECIMAL 10,2)
 * @property {number} tax - Sales tax amount (DECIMAL 10,2)
 * @property {number} shipping - Shipping/delivery charges (DECIMAL 10,2)
 * @property {number} total - Grand total (subtotal + tax + shipping)
 * @property {string} [notes] - Order notes or special instructions
 * @property {string} [approvedBy] - User ID who approved the order
 * @property {Date} [approvedAt] - Timestamp of approval
 * @property {Date} createdAt - Record creation timestamp
 * @property {Date} updatedAt - Record last update timestamp
 * @property {string} vendorId - Foreign key to Vendor
 *
 * @business Purchase Order Workflow:
 * 1. PENDING: Created, awaiting approval
 * 2. APPROVED: Approved by authorized user, ready to send to vendor
 * 3. ORDERED: Submitted to vendor, awaiting delivery
 * 4. PARTIALLY_RECEIVED: Some items received, awaiting remainder
 * 5. RECEIVED: All items received, order complete
 * 6. CANCELLED: Order cancelled before receipt
 *
 * @business Status transitions:
 * - PENDING → APPROVED (requires approver)
 * - APPROVED → ORDERED (sent to vendor)
 * - ORDERED → PARTIALLY_RECEIVED (some items received)
 * - ORDERED/PARTIALLY_RECEIVED → RECEIVED (all items received)
 * - Any status → CANCELLED (before full receipt)
 */
interface PurchaseOrderAttributes {
  id: string;
  orderNumber: string;
  status: PurchaseOrderStatus;
  orderDate: Date;
  expectedDate?: Date;
  receivedDate?: Date;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  notes?: string;
  approvedBy?: string;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;

  // Foreign Keys
  vendorId: string;
}

/**
 * @interface PurchaseOrderCreationAttributes
 * @description Attributes required/optional when creating a new purchase order
 * @extends {Optional<PurchaseOrderAttributes>}
 *
 * Required on creation:
 * - orderNumber (unique identifier)
 * - vendorId (vendor to purchase from)
 *
 * Optional on creation (with defaults):
 * - id (auto-generated UUID)
 * - status (defaults to PENDING)
 * - orderDate (defaults to NOW)
 * - subtotal, tax, shipping, total (default to 0, calculated from line items)
 * - expectedDate, receivedDate, notes
 * - approvedBy, approvedAt (set during approval)
 * - createdAt, updatedAt (auto-generated)
 */
interface PurchaseOrderCreationAttributes
  extends Optional<PurchaseOrderAttributes, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'orderDate' | 'expectedDate' | 'receivedDate' | 'subtotal' | 'tax' | 'shipping' | 'total' | 'notes' | 'approvedBy' | 'approvedAt'> {}

/**
 * @class PurchaseOrder
 * @extends {Model<PurchaseOrderAttributes, PurchaseOrderCreationAttributes>}
 * @description Sequelize model for purchase order records
 *
 * Manages the complete purchase order lifecycle from creation through approval,
 * ordering, and receipt. Integrates with vendor management and budget tracking.
 *
 * @example
 * // Create a new purchase order
 * const po = await PurchaseOrder.create({
 *   orderNumber: "PO-2024-001",
 *   vendorId: vendor.id,
 *   expectedDate: new Date("2024-12-31"),
 *   notes: "Annual first aid supplies order"
 * });
 *
 * // Add line items
 * await PurchaseOrderItem.create({
 *   purchaseOrderId: po.id,
 *   inventoryItemId: item.id,
 *   quantity: 500,
 *   unitCost: 0.15,
 *   totalCost: 75.00
 * });
 *
 * @example
 * // Approve purchase order
 * await po.update({
 *   status: PurchaseOrderStatus.APPROVED,
 *   approvedBy: manager.id,
 *   approvedAt: new Date()
 * });
 *
 * @example
 * // Mark as received
 * await po.update({
 *   status: PurchaseOrderStatus.RECEIVED,
 *   receivedDate: new Date()
 * });
 */
export class PurchaseOrder extends Model<PurchaseOrderAttributes, PurchaseOrderCreationAttributes> implements PurchaseOrderAttributes {
  /**
   * @property {string} id - Unique identifier (UUID v4)
   */
  public id!: string;

  /**
   * @property {string} orderNumber - Purchase order number
   * @validation Required, unique, 1-50 characters
   * @business Format suggestion: "PO-YYYY-###" or custom numbering scheme
   * @business Must be unique across all purchase orders
   */
  public orderNumber!: string;

  /**
   * @property {PurchaseOrderStatus} status - Order workflow status
   * @validation Required, must be valid PurchaseOrderStatus enum
   * @default PENDING
   * @business Status workflow: PENDING → APPROVED → ORDERED → PARTIALLY_RECEIVED/RECEIVED
   * @business CANCELLED available at any stage before full receipt
   */
  public status!: PurchaseOrderStatus;

  /**
   * @property {Date} orderDate - Order creation date
   * @validation Required, cannot be before year 2000
   * @default NOW
   * @business Used for reporting and order aging calculations
   */
  public orderDate!: Date;

  /**
   * @property {Date} [expectedDate] - Expected delivery date
   * @validation Optional, must be on or after orderDate
   * @business Set based on vendor lead time
   * @business Used to track late deliveries and vendor performance
   */
  public expectedDate?: Date;

  /**
   * @property {Date} [receivedDate] - Date fully received
   * @validation Optional, must be on or after orderDate
   * @business Only set when status is RECEIVED or PARTIALLY_RECEIVED
   * @business For partial receipts, tracks first receipt date
   */
  public receivedDate?: Date;

  /**
   * @property {number} subtotal - Line items total before tax/shipping
   * @validation Required, non-negative, DECIMAL(10,2), max $99,999,999.99
   * @default 0
   * @financial Calculated as SUM(items.totalCost)
   * @financial Must match sum of all PurchaseOrderItem.totalCost values
   */
  public subtotal!: number;

  /**
   * @property {number} tax - Sales tax amount
   * @validation Required, non-negative, DECIMAL(10,2), max $99,999,999.99
   * @default 0
   * @financial Calculated based on jurisdiction tax rate and taxable items
   * @financial Some jurisdictions exempt medical supplies from sales tax
   */
  public tax!: number;

  /**
   * @property {number} shipping - Shipping and handling charges
   * @validation Required, non-negative, DECIMAL(10,2), max $9,999,999.99
   * @default 0
   * @financial Charged by vendor based on order weight/size
   * @financial May be waived for orders exceeding minimum threshold
   */
  public shipping!: number;

  /**
   * @property {number} total - Grand total amount
   * @validation Required, non-negative, DECIMAL(10,2), max $99,999,999.99
   * @default 0
   * @financial MUST equal subtotal + tax + shipping (validated in model)
   * @financial This amount is charged to budget when order is approved
   */
  public total!: number;

  /**
   * @property {string} [notes] - Order notes and instructions
   * @validation Optional, up to 10,000 characters
   * @business Can include delivery instructions, account numbers, or special requirements
   */
  public notes?: string;

  /**
   * @property {string} [approvedBy] - Approver user ID
   * @validation Optional, must have corresponding approvedAt when set
   * @business Links to User with appropriate approval authority
   * @business Required before order can transition to ORDERED status
   */
  public approvedBy?: string;

  /**
   * @property {Date} [approvedAt] - Approval timestamp
   * @validation Optional, must have corresponding approvedBy when set
   * @business Marks when order received authorization
   * @business Used for audit trail and approval timeline reporting
   */
  public approvedAt?: Date;

  /**
   * @property {Date} createdAt - Record creation timestamp
   * @readonly Auto-generated on creation
   */
  public readonly createdAt!: Date;

  /**
   * @property {Date} updatedAt - Last update timestamp
   * @readonly Auto-updated on any modification
   */
  public readonly updatedAt!: Date;

  /**
   * @property {string} vendorId - Vendor reference
   * @validation Required, must reference valid Vendor
   * @business Vendor must be active to create new orders
   */
  public vendorId!: string;

  /**
   * @property {PurchaseOrderItem[]} [items] - Associated line items
   * @association HasMany relationship with PurchaseOrderItem
   */
  declare items?: PurchaseOrderItem[];

  /**
   * @property {Vendor} [vendor] - Associated vendor
   * @association BelongsTo relationship with Vendor
   */
  declare vendor?: any;
}

PurchaseOrder.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    orderNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        name: 'unique_order_number',
        msg: 'Order number must be unique'
      },
      validate: {
        notEmpty: {
          msg: 'Order number cannot be empty'
        },
        len: {
          args: [1, 50],
          msg: 'Order number must be between 1 and 50 characters'
        }
      }
    },
    status: {
      type: DataTypes.ENUM(...Object.values(PurchaseOrderStatus)),
      allowNull: false,
      defaultValue: PurchaseOrderStatus.PENDING,
      validate: {
        notEmpty: {
          msg: 'Status cannot be empty'
        }
      }
    },
    orderDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      validate: {
        isDate: {
          args: true,
          msg: 'Order date must be a valid date'
        },
        notTooOld(value: Date) {
          if (value < new Date('2000-01-01')) {
            throw new Error('Order date cannot be before year 2000');
          }
        }
      }
    },
    expectedDate: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        isDate: {
          args: true,
          msg: 'Expected date must be a valid date'
        },
        isAfterOrderDate(value: Date | null) {
          if (value && this.orderDate && value < this.orderDate) {
            throw new Error('Expected date must be on or after the order date');
          }
        }
      }
    },
    receivedDate: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        isDate: {
          args: true,
          msg: 'Received date must be a valid date'
        },
        isAfterOrderDate(value: Date | null) {
          if (value && this.orderDate && value < this.orderDate) {
            throw new Error('Received date must be on or after the order date');
          }
        }
      }
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: {
          args: [0],
          msg: 'Subtotal must be non-negative'
        },
        isDecimal: {
          msg: 'Subtotal must be a valid decimal number'
        },
        maxValue(value: number) {
          if (value > 99999999.99) {
            throw new Error('Subtotal cannot exceed $99,999,999.99');
          }
        }
      }
    },
    tax: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: {
          args: [0],
          msg: 'Tax must be non-negative'
        },
        isDecimal: {
          msg: 'Tax must be a valid decimal number'
        },
        maxValue(value: number) {
          if (value > 99999999.99) {
            throw new Error('Tax cannot exceed $99,999,999.99');
          }
        }
      }
    },
    shipping: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: {
          args: [0],
          msg: 'Shipping must be non-negative'
        },
        isDecimal: {
          msg: 'Shipping must be a valid decimal number'
        },
        maxValue(value: number) {
          if (value > 9999999.99) {
            throw new Error('Shipping cannot exceed $9,999,999.99');
          }
        }
      }
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: {
          args: [0],
          msg: 'Total must be non-negative'
        },
        isDecimal: {
          msg: 'Total must be a valid decimal number'
        },
        maxValue(value: number) {
          if (value > 99999999.99) {
            throw new Error('Total cannot exceed $99,999,999.99');
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
    approvedBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    approvedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        isDate: {
          args: true,
          msg: 'Approved date must be a valid date'
        }
      }
    },
    vendorId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'vendors',
        key: 'id',
      },
      validate: {
        notEmpty: {
          msg: 'Vendor ID cannot be empty'
        }
      }
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'purchase_orders',
    timestamps: true,
    indexes: [
      { fields: ['orderNumber'] },
      { fields: ['vendorId'] },
      { fields: ['status'] },
      { fields: ['orderDate'] },
      { fields: ['expectedDate'] },
    ],
    validate: {
      totalMatchesComponents() {
        const calculatedTotal = Number(this.subtotal) + Number(this.tax) + Number(this.shipping);
        const total = Number(this.total);
        if (Math.abs(calculatedTotal - total) > 0.01) {
          throw new Error('Total must equal subtotal + tax + shipping');
        }
      },
      approvalConsistency() {
        if (this.approvedBy && !this.approvedAt) {
          throw new Error('Approval date required when approver is set');
        }
        if (!this.approvedBy && this.approvedAt) {
          throw new Error('Approver required when approval date is set');
        }
      },
      receivedDateRequiresStatus() {
        if (this.receivedDate &&
            this.status !== PurchaseOrderStatus.RECEIVED &&
            this.status !== PurchaseOrderStatus.PARTIALLY_RECEIVED) {
          throw new Error('Received date can only be set when status is RECEIVED or PARTIALLY_RECEIVED');
        }
      }
    }
  }
);
