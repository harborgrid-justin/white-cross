import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';
import { MaintenanceType } from '../../types/enums';

/**
 * MaintenanceLog Model
 * Tracks maintenance activities for medical equipment and inventory items.
 * Records routine maintenance, repairs, calibrations, inspections, and cleaning.
 * Critical for equipment safety and regulatory compliance.
 */

interface MaintenanceLogAttributes {
  id: string;
  type: MaintenanceType;
  description: string;
  cost?: number;
  nextMaintenanceDate?: Date;
  vendor?: string;
  notes?: string;
  createdAt: Date;

  // Foreign Keys
  inventoryItemId: string;
  performedById: string;
}

interface MaintenanceLogCreationAttributes
  extends Optional<MaintenanceLogAttributes, 'id' | 'createdAt' | 'cost' | 'nextMaintenanceDate' | 'vendor' | 'notes'> {}

export class MaintenanceLog extends Model<MaintenanceLogAttributes, MaintenanceLogCreationAttributes> implements MaintenanceLogAttributes {
  public id!: string;
  public type!: MaintenanceType;
  public description!: string;
  public cost?: number;
  public nextMaintenanceDate?: Date;
  public vendor?: string;
  public notes?: string;
  public readonly createdAt!: Date;

  // Foreign Keys
  public inventoryItemId!: string;
  public performedById!: string;
}

MaintenanceLog.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    type: {
      type: DataTypes.ENUM(...Object.values(MaintenanceType)),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Maintenance type cannot be empty'
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Description cannot be empty'
        },
        len: {
          args: [1, 5000],
          msg: 'Description must be between 1 and 5000 characters'
        }
      }
    },
    cost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      validate: {
        min: {
          args: [0],
          msg: 'Cost must be non-negative'
        },
        isDecimal: {
          msg: 'Cost must be a valid decimal number'
        },
        maxValue(value: number | null) {
          if (value !== null && value > 99999999.99) {
            throw new Error('Cost cannot exceed $99,999,999.99');
          }
        }
      }
    },
    nextMaintenanceDate: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        isDate: {
          msg: 'Next maintenance date must be a valid date'
        },
        isInFuture(value: Date | null) {
          if (value) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (value < today) {
              throw new Error('Next maintenance date should be in the future');
            }
          }
        },
        notTooFarInFuture(value: Date | null) {
          if (value) {
            const tenYearsFromNow = new Date();
            tenYearsFromNow.setFullYear(tenYearsFromNow.getFullYear() + 10);
            if (value > tenYearsFromNow) {
              throw new Error('Next maintenance date cannot be more than 10 years in the future');
            }
          }
        }
      }
    },
    vendor: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: {
          args: [0, 255],
          msg: 'Vendor name cannot exceed 255 characters'
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
    inventoryItemId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'inventory_items',
        key: 'id',
      },
      validate: {
        notEmpty: {
          msg: 'Inventory item ID cannot be empty'
        }
      }
    },
    performedById: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      validate: {
        notEmpty: {
          msg: 'Performed by user ID cannot be empty'
        }
      }
    },
    createdAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'maintenance_logs',
    timestamps: false,
    indexes: [
      { fields: ['inventoryItemId'] },
      { fields: ['performedById'] },
      { fields: ['type'] },
      { fields: ['nextMaintenanceDate'] },
      { fields: ['createdAt'] },
    ],
  }
);
