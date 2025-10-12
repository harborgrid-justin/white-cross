import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';
import { AuditableModel } from '../base/AuditableModel';
import type { Medication } from '../core/Medication';

/**
 * MedicationInventory Model
 * Tracks medication stock levels, batch numbers, and expiration dates.
 * Enables automated reordering alerts and cost tracking.
 * Essential for regulatory compliance and medication safety.
 */

interface MedicationInventoryAttributes {
  id: string;
  batchNumber: string;
  expirationDate: Date;
  quantity: number;
  reorderLevel: number;
  costPerUnit?: number;
  supplier?: string;
  createdAt: Date;
  updatedAt: Date;

  // Foreign Keys
  medicationId: string;

  // Audit Fields
  createdBy?: string;
  updatedBy?: string;
}

interface MedicationInventoryCreationAttributes
  extends Optional<MedicationInventoryAttributes, 'id' | 'createdAt' | 'updatedAt' | 'reorderLevel' | 'costPerUnit' | 'supplier' | 'createdBy' | 'updatedBy'> {}

export class MedicationInventory extends Model<MedicationInventoryAttributes, MedicationInventoryCreationAttributes> implements MedicationInventoryAttributes {
  public id!: string;
  public batchNumber!: string;
  public expirationDate!: Date;
  public quantity!: number;
  public reorderLevel!: number;
  public costPerUnit?: number;
  public supplier?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Foreign Keys
  public medicationId!: string;

  // Audit Fields
  public createdBy?: string;
  public updatedBy?: string;

  // Association declarations
  declare medication?: Medication;

  /**
   * Check if inventory is below reorder level
   */
  get needsReorder(): boolean {
    return this.quantity <= this.reorderLevel;
  }

  /**
   * Check if medication is expired
   */
  get isExpired(): boolean {
    return new Date() > this.expirationDate;
  }

  /**
   * Check if medication will expire soon (within 90 days)
   */
  get isExpiringSoon(): boolean {
    const ninetyDaysFromNow = new Date();
    ninetyDaysFromNow.setDate(ninetyDaysFromNow.getDate() + 90);
    return this.expirationDate <= ninetyDaysFromNow && !this.isExpired;
  }

  /**
   * Get days until expiration
   */
  get daysUntilExpiration(): number {
    const now = new Date();
    const diff = this.expirationDate.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  /**
   * Calculate total inventory value
   */
  get totalValue(): number | null {
    if (!this.costPerUnit) return null;
    return this.quantity * this.costPerUnit;
  }

  /**
   * Get inventory status
   */
  get status(): 'EXPIRED' | 'EXPIRING_SOON' | 'LOW_STOCK' | 'ADEQUATE' {
    if (this.isExpired) return 'EXPIRED';
    if (this.isExpiringSoon) return 'EXPIRING_SOON';
    if (this.needsReorder) return 'LOW_STOCK';
    return 'ADEQUATE';
  }
}

MedicationInventory.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    batchNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Manufacturer batch/lot number for tracking',
    },
    expirationDate: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: 'Date when medication expires',
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Current quantity in stock',
      validate: {
        min: 0,
      },
    },
    reorderLevel: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10,
      comment: 'Threshold quantity for reordering',
      validate: {
        min: 0,
      },
    },
    costPerUnit: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: 'Cost per unit for budget tracking',
      validate: {
        min: 0,
      },
    },
    supplier: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Supplier or vendor name',
    },
    medicationId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'medications',
        key: 'id',
      },
    },
    ...AuditableModel.getAuditableFields(),
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'medication_inventory',
    timestamps: true,
    indexes: [
      { fields: ['medicationId'] },
      { fields: ['batchNumber'] },
      { fields: ['expirationDate'] },
      { fields: ['quantity'] },
      { fields: ['medicationId', 'expirationDate'] },
      { fields: ['createdBy'] },
    ],
  }
);

AuditableModel.setupAuditHooks(MedicationInventory, 'MedicationInventory');
