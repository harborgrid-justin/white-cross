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
      validate: {
        notEmpty: {
          msg: 'Item name cannot be empty'
        },
        len: {
          args: [1, 255],
          msg: 'Item name must be between 1 and 255 characters'
        }
      }
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Category cannot be empty'
        },
        len: {
          args: [1, 100],
          msg: 'Category must be between 1 and 100 characters'
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: {
          args: [0, 5000],
          msg: 'Description cannot exceed 5000 characters'
        }
      }
    },
    sku: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: {
        name: 'unique_sku',
        msg: 'SKU must be unique'
      },
      validate: {
        len: {
          args: [0, 50],
          msg: 'SKU cannot exceed 50 characters'
        }
      }
    },
    supplier: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: {
          args: [0, 255],
          msg: 'Supplier name cannot exceed 255 characters'
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
        }
      }
    },
    reorderLevel: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10,
      validate: {
        isInt: {
          msg: 'Reorder level must be an integer'
        },
        min: {
          args: [0],
          msg: 'Reorder level must be non-negative'
        },
        max: {
          args: [1000000],
          msg: 'Reorder level cannot exceed 1,000,000'
        }
      }
    },
    reorderQuantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 50,
      validate: {
        isInt: {
          msg: 'Reorder quantity must be an integer'
        },
        min: {
          args: [1],
          msg: 'Reorder quantity must be at least 1'
        },
        max: {
          args: [1000000],
          msg: 'Reorder quantity cannot exceed 1,000,000'
        }
      }
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: {
          args: [0, 255],
          msg: 'Location cannot exceed 255 characters'
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
    validate: {
      reorderQuantityGreaterThanZero() {
        if (this.reorderQuantity <= 0) {
          throw new Error('Reorder quantity must be greater than zero');
        }
      },
      reorderLevelValid() {
        if (this.reorderLevel < 0) {
          throw new Error('Reorder level cannot be negative');
        }
      }
    }
  }
);
