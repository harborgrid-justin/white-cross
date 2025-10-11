import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';
import { PurchaseOrderStatus } from '../../types/enums';

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
      unique: true,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(PurchaseOrderStatus)),
      allowNull: false,
      defaultValue: PurchaseOrderStatus.PENDING,
    },
    orderDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    expectedDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    receivedDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    tax: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    shipping: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    approvedBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    approvedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    vendorId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'vendors',
        key: 'id',
      },
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
  }
);
