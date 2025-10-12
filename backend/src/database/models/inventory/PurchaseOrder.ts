import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';
import { PurchaseOrderStatus } from '../../types/enums';
import type { PurchaseOrderItem } from './PurchaseOrderItem';

/**
 * PurchaseOrder Model
 * Manages purchase orders for inventory procurement.
 * Tracks order lifecycle from creation through approval, ordering, and receipt.
 * Supports financial tracking with subtotal, tax, shipping, and total calculations.
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

interface PurchaseOrderCreationAttributes
  extends Optional<PurchaseOrderAttributes, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'orderDate' | 'expectedDate' | 'receivedDate' | 'subtotal' | 'tax' | 'shipping' | 'total' | 'notes' | 'approvedBy' | 'approvedAt'> {}

export class PurchaseOrder extends Model<PurchaseOrderAttributes, PurchaseOrderCreationAttributes> implements PurchaseOrderAttributes {
  public id!: string;
  public orderNumber!: string;
  public status!: PurchaseOrderStatus;
  public orderDate!: Date;
  public expectedDate?: Date;
  public receivedDate?: Date;
  public subtotal!: number;
  public tax!: number;
  public shipping!: number;
  public total!: number;
  public notes?: string;
  public approvedBy?: string;
  public approvedAt?: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Foreign Keys
  public vendorId!: string;

  // Associations
  declare items?: PurchaseOrderItem[];
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
