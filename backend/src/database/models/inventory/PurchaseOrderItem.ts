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
    },
    unitCost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    totalCost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    receivedQty: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    purchaseOrderId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'purchase_orders',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    inventoryItemId: {
      type: DataTypes.STRING,
      allowNull: false,
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
  }
);
