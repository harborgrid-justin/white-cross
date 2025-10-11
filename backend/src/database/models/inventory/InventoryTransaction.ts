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
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    unitCost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    batchNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    expirationDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    inventoryItemId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'inventory_items',
        key: 'id',
      },
    },
    performedById: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
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
    ],
  }
);
