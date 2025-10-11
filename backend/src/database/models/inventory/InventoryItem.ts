import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';

/**
 * InventoryItem Model
 * Master catalog of all non-medication inventory items (medical supplies,
 * equipment, first aid items, etc.).
 * Supports SKU tracking, cost management, and reorder automation.
 */

interface InventoryItemAttributes {
  id: string;
  name: string;
  category: string;
  description?: string;
  sku?: string;
  supplier?: string;
  unitCost?: number;
  reorderLevel: number;
  reorderQuantity: number;
  location?: string;
  notes?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface InventoryItemCreationAttributes
  extends Optional<InventoryItemAttributes, 'id' | 'createdAt' | 'updatedAt' | 'description' | 'sku' | 'supplier' | 'unitCost' | 'reorderLevel' | 'reorderQuantity' | 'location' | 'notes' | 'isActive'> {}

export class InventoryItem extends Model<InventoryItemAttributes, InventoryItemCreationAttributes> implements InventoryItemAttributes {
  public id!: string;
  public name!: string;
  public category!: string;
  public description?: string;
  public sku?: string;
  public supplier?: string;
  public unitCost?: number;
  public reorderLevel!: number;
  public reorderQuantity!: number;
  public location?: string;
  public notes?: string;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

InventoryItem.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    sku: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    supplier: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    unitCost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    reorderLevel: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10,
    },
    reorderQuantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 50,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'inventory_items',
    timestamps: true,
    indexes: [
      { fields: ['name'] },
      { fields: ['category'] },
      { fields: ['sku'] },
      { fields: ['isActive'] },
    ],
  }
);
