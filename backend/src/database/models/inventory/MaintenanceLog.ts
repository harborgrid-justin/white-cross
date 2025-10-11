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
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    cost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    nextMaintenanceDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    vendor: {
      type: DataTypes.STRING,
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
