/**
 * @fileoverview Inventory Item Database Model
 * @module database/models/inventory/InventoryItem
 * @description Sequelize model for managing non-medication inventory items including
 * medical supplies, equipment, and first aid supplies.
 *
 * Key Features:
 * - SKU-based inventory tracking
 * - Automated reorder point management
 * - Cost tracking and budget integration
 * - Multi-location storage support
 * - Category-based organization
 *
 * @business Inventory items are tracked separately from medications to support
 * different regulatory requirements and reorder workflows
 * @business Reorder automation triggers when quantity falls to or below reorderLevel
 * @business Each item can be linked to a preferred supplier for streamlined purchasing
 *
 * @requires sequelize
 */

/**
 * LOC: C500ED3C99
 * WC-GEN-079 | InventoryItem.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - sequelize.ts (database/config/sequelize.ts)
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (database/models/index.ts)
 */

import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';

/**
 * @interface InventoryItemAttributes
 * @description Defines the complete structure of an inventory item record
 * @property {string} id - Unique identifier (UUID v4)
 * @property {string} name - Item name (1-255 characters, required)
 * @property {string} category - Category classification (e.g., "First Aid", "Medical Supplies")
 * @property {string} [description] - Detailed item description (up to 5000 characters)
 * @property {string} [sku] - Stock Keeping Unit identifier (unique, up to 50 characters)
 * @property {string} [supplier] - Default supplier/vendor name (up to 255 characters)
 * @property {number} [unitCost] - Cost per unit in dollars (DECIMAL 10,2)
 * @property {number} reorderLevel - Minimum quantity threshold for reordering
 * @property {number} reorderQuantity - Quantity to order when reorder point is reached
 * @property {string} [location] - Storage location (e.g., "Nurse's Office - Cabinet A")
 * @property {string} [notes] - Additional notes (up to 10,000 characters)
 * @property {boolean} isActive - Whether item is currently active in system
 * @property {Date} createdAt - Record creation timestamp
 * @property {Date} updatedAt - Record last update timestamp
 *
 * @business reorderLevel and reorderQuantity work together to automate procurement:
 * When current stock <= reorderLevel, system suggests ordering reorderQuantity units
 * @business unitCost is used for budget tracking and total inventory value calculations
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

/**
 * @interface InventoryItemCreationAttributes
 * @description Attributes required/optional when creating a new inventory item
 * @extends {Optional<InventoryItemAttributes>}
 *
 * Optional fields on creation:
 * - id (auto-generated UUID)
 * - createdAt, updatedAt (auto-generated)
 * - description, sku, supplier, unitCost
 * - reorderLevel (defaults to 10)
 * - reorderQuantity (defaults to 50)
 * - location, notes
 * - isActive (defaults to true)
 */
interface InventoryItemCreationAttributes
  extends Optional<InventoryItemAttributes, 'id' | 'createdAt' | 'updatedAt' | 'description' | 'sku' | 'supplier' | 'unitCost' | 'reorderLevel' | 'reorderQuantity' | 'location' | 'notes' | 'isActive'> {}

/**
 * @class InventoryItem
 * @extends {Model<InventoryItemAttributes, InventoryItemCreationAttributes>}
 * @description Sequelize model representing non-medication inventory items
 *
 * This model tracks medical supplies, equipment, and consumables excluding medications.
 * Supports automated reorder workflows and budget tracking.
 *
 * @example
 * // Create a new inventory item
 * const bandages = await InventoryItem.create({
 *   name: "Adhesive Bandages - Large",
 *   category: "First Aid",
 *   sku: "BND-LG-001",
 *   supplier: "Medical Supply Co",
 *   unitCost: 0.15,
 *   reorderLevel: 100,
 *   reorderQuantity: 500,
 *   location: "Nurse's Office - Cabinet A, Shelf 2"
 * });
 *
 * @example
 * // Find items needing reorder
 * const lowStockItems = await InventoryItem.findAll({
 *   where: {
 *     isActive: true
 *   },
 *   include: [{
 *     model: InventoryTransaction,
 *     // Use transaction aggregation to calculate current quantity
 *   }]
 * });
 */
export class InventoryItem extends Model<InventoryItemAttributes, InventoryItemCreationAttributes> implements InventoryItemAttributes {
  /**
   * @property {string} id - Unique identifier (UUID v4)
   */
  public id!: string;

  /**
   * @property {string} name - Item name
   * @validation Required, 1-255 characters, non-empty
   */
  public name!: string;

  /**
   * @property {string} category - Category classification
   * @validation Required, 1-100 characters
   * @business Common categories: First Aid, Medical Supplies, Equipment, PPE,
   * Diagnostic Tools, Office Supplies
   */
  public category!: string;

  /**
   * @property {string} [description] - Detailed item description
   * @validation Optional, up to 5000 characters
   */
  public description?: string;

  /**
   * @property {string} [sku] - Stock Keeping Unit identifier
   * @validation Optional, unique, up to 50 characters
   * @business SKU format should be consistent across organization for easier tracking
   */
  public sku?: string;

  /**
   * @property {string} [supplier] - Default supplier name
   * @validation Optional, up to 255 characters
   * @business Links to Vendor table for full supplier details and purchase orders
   */
  public supplier?: string;

  /**
   * @property {number} [unitCost] - Cost per unit
   * @validation Optional, non-negative, DECIMAL(10,2)
   * @business Used for budget tracking and inventory valuation
   * @business Should be updated when new purchases are made at different prices
   */
  public unitCost?: number;

  /**
   * @property {number} reorderLevel - Minimum quantity before reorder
   * @validation Required, non-negative integer, max 1,000,000
   * @default 10
   * @business When current quantity <= reorderLevel, system triggers reorder alert
   * @business Consider lead time and usage rate when setting reorder level
   * @business Formula: reorderLevel = (daily usage × lead time) + safety stock
   */
  public reorderLevel!: number;

  /**
   * @property {number} reorderQuantity - Quantity to reorder
   * @validation Required, minimum 1, max 1,000,000
   * @default 50
   * @business Standard order quantity when reorder point is reached
   * @business Should consider bulk discounts, storage capacity, and usage patterns
   * @business Economic Order Quantity (EOQ) formula can optimize this value
   */
  public reorderQuantity!: number;

  /**
   * @property {string} [location] - Physical storage location
   * @validation Optional, up to 255 characters
   * @business Format suggestion: "Building - Room - Cabinet/Area - Shelf"
   * @business Helps staff quickly locate items during emergencies
   */
  public location?: string;

  /**
   * @property {string} [notes] - Additional notes
   * @validation Optional, up to 10,000 characters
   * @business Can include special handling instructions, expiration concerns,
   * or regulatory notes
   */
  public notes?: string;

  /**
   * @property {boolean} isActive - Active status
   * @validation Required boolean
   * @default true
   * @business Inactive items are hidden from normal operations but retained for history
   * @business Set to false when discontinuing an item rather than deleting the record
   */
  public isActive!: boolean;

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
      reorderQuantityGreaterThanZero(this: InventoryItem) {
        if (this.reorderQuantity <= 0) {
          throw new Error('Reorder quantity must be greater than zero');
        }
      },
      reorderLevelValid(this: InventoryItem) {
        if (this.reorderLevel < 0) {
          throw new Error('Reorder level cannot be negative');
        }
      }
    }
  }
);
