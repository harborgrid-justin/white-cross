/**
 * @fileoverview Medication Inventory Database Model
 * @module database/models/medications/MedicationInventory
 * @description Sequelize model for medication inventory tracking and management
 *
 * Key Features:
 * - Batch/lot number tracking for medication recalls
 * - Expiration date monitoring with automated alerts
 * - Quantity tracking with reorder level automation
 * - Cost tracking per unit for budget management
 * - Supplier information for reordering
 * - Full audit trail (createdBy, updatedBy)
 * - Computed properties for status checking
 *
 * @business Medications tracked separately from general inventory due to:
 * - DEA controlled substance requirements
 * - FDA batch tracking and recall requirements
 * - Stricter expiration date management
 * - State pharmacy board regulations
 * - HIPAA compliance for student medication administration
 *
 * @business Batch Tracking Requirements:
 * - Each medication batch must have unique batchNumber from manufacturer
 * - Critical for recalls and quality control
 * - Enables FIFO (First In, First Out) dispensing
 * - Required for controlled substances (Schedule II-V)
 *
 * @business Expiration Management:
 * - System alerts when medication expires in 90 days (isExpiringSoon)
 * - Expired medications must be disposed per DEA regulations
 * - Cannot dispense medications past expiration date
 * - Document disposal with witness for controlled substances
 *
 * @requires sequelize
 * @requires AuditableModel
 */

/**
 * LOC: A2D3373EE8
 * WC-GEN-085 | MedicationInventory.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - sequelize.ts (database/config/sequelize.ts)
 *   - AuditableModel.ts (database/models/base/AuditableModel.ts)
 *   - Medication.ts (database/models/core/Medication.ts)
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (database/models/index.ts)
 */

import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';
import { AuditableModel } from '../base/AuditableModel';
import type { Medication } from '../core/Medication';

/**
 * @interface MedicationInventoryAttributes
 * @description Defines the complete structure of a medication inventory record
 *
 * @property {string} id - Unique identifier (UUID v4)
 * @property {string} batchNumber - Manufacturer batch/lot number (required for tracking)
 * @property {Date} expirationDate - Medication expiration date
 * @property {number} quantity - Current quantity in stock
 * @property {number} reorderLevel - Minimum quantity threshold for reorder alert
 * @property {number} [costPerUnit] - Cost per unit for budget tracking
 * @property {string} [supplier] - Supplier/pharmacy name
 * @property {Date} createdAt - Record creation timestamp
 * @property {Date} updatedAt - Record last update timestamp
 * @property {string} medicationId - Foreign key to Medication
 * @property {string} [createdBy] - User ID who created record
 * @property {string} [updatedBy] - User ID who last updated record
 *
 * @business Batch Number Requirements:
 * - Format varies by manufacturer (e.g., "LOT-2024-001", "BN-12345")
 * - Must be recorded for all medications
 * - Critical for FDA recall notifications
 * - Required for controlled substance tracking (DEA Form 222)
 *
 * @business Expiration Date Compliance:
 * - Cannot dispense expired medications (state pharmacy board violation)
 * - Must dispose of expired controlled substances per DEA regulations
 * - Document disposal with witness and disposal method
 * - Some medications (e.g., epinephrine) lose effectiveness before printed expiration
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

/**
 * @interface MedicationInventoryCreationAttributes
 * @description Attributes required/optional when creating medication inventory
 * @extends {Optional<MedicationInventoryAttributes>}
 *
 * Required on creation:
 * - medicationId (medication being stocked)
 * - batchNumber (manufacturer lot number)
 * - expirationDate (medication expiration date)
 * - quantity (current stock quantity)
 *
 * Optional on creation:
 * - id (auto-generated UUID)
 * - reorderLevel (defaults to 10)
 * - costPerUnit, supplier
 * - createdAt, updatedAt (auto-generated)
 * - createdBy, updatedBy (set via audit hooks)
 */
interface MedicationInventoryCreationAttributes
  extends Optional<MedicationInventoryAttributes, 'id' | 'createdAt' | 'updatedAt' | 'reorderLevel' | 'costPerUnit' | 'supplier' | 'createdBy' | 'updatedBy'> {}

/**
 * @class MedicationInventory
 * @extends {Model<MedicationInventoryAttributes, MedicationInventoryCreationAttributes>}
 * @description Sequelize model for medication inventory records
 *
 * Tracks medication stock levels with batch numbers, expiration dates, and costs.
 * Provides automated reorder alerts and expiration warnings. Includes audit trail
 * for regulatory compliance.
 *
 * @example
 * // Add new medication batch to inventory
 * const inventory = await MedicationInventory.create({
 *   medicationId: acetaminophen.id,
 *   batchNumber: "LOT-2024-001",
 *   expirationDate: new Date("2026-12-31"),
 *   quantity: 500,
 *   reorderLevel: 100,
 *   costPerUnit: 0.05,
 *   supplier: "ABC Pharmacy"
 * });
 *
 * @example
 * // Check for medications needing reorder
 * const lowStock = await MedicationInventory.findAll({
 *   where: sequelize.where(
 *     sequelize.col('quantity'),
 *     Op.lte,
 *     sequelize.col('reorderLevel')
 *   ),
 *   include: [{ model: Medication }]
 * });
 *
 * @example
 * // Find medications expiring in next 90 days
 * const expiringSoon = await MedicationInventory.findAll({
 *   where: {
 *     expirationDate: {
 *       [Op.lte]: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
 *       [Op.gt]: new Date()
 *     }
 *   }
 * });
 *
 * @example
 * // Use computed properties
 * if (inventory.isExpired) {
 *   // Dispose of medication per DEA regulations
 * } else if (inventory.isExpiringSoon) {
 *   // Send alert to nurse
 * } else if (inventory.needsReorder) {
 *   // Generate purchase order
 * }
 */
export class MedicationInventory extends Model<MedicationInventoryAttributes, MedicationInventoryCreationAttributes> implements MedicationInventoryAttributes {
  /**
   * @property {string} id - Unique identifier (UUID v4)
   */
  public id!: string;

  /**
   * @property {string} batchNumber - Manufacturer batch/lot number
   * @validation Required, non-empty
   * @business Critical for FDA recalls and quality control
   * @business Must match manufacturer's batch documentation
   * @business Required for all controlled substances (DEA regulation)
   */
  public batchNumber!: string;

  /**
   * @property {Date} expirationDate - Medication expiration date
   * @validation Required, valid date
   * @business Cannot dispense after this date (regulatory violation)
   * @business System should alert 90 days before expiration
   * @business Must follow FIFO dispensing (use oldest first)
   */
  public expirationDate!: Date;

  /**
   * @property {number} quantity - Current stock quantity
   * @validation Required, non-negative integer
   * @business Updated when medication is dispensed or received
   * @business For controlled substances, discrepancies require investigation
   * @business Regular cycle counts recommended for audit compliance
   */
  public quantity!: number;

  /**
   * @property {number} reorderLevel - Reorder threshold
   * @validation Required, non-negative integer
   * @default 10
   * @business When quantity <= reorderLevel, trigger reorder alert
   * @business Set higher for critical medications (e.g., epinephrine, insulin)
   * @business Consider lead time and usage patterns when setting level
   */
  public reorderLevel!: number;

  /**
   * @property {number} [costPerUnit] - Cost per unit
   * @validation Optional, non-negative, DECIMAL(10,2)
   * @financial Used for budget tracking and inventory valuation
   * @financial May include pharmacy markup and dispensing fees
   * @financial Required for accurate budget forecasting
   */
  public costPerUnit?: number;

  /**
   * @property {string} [supplier] - Supplier/pharmacy name
   * @validation Optional
   * @business Typically a licensed pharmacy for prescription medications
   * @business Must maintain DEA registration for controlled substances
   * @business May vary by medication based on availability and pricing
   */
  public supplier?: string;

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

  /**
   * @property {string} medicationId - Medication reference
   * @validation Required, must reference valid Medication
   * @business Links to medication master record with name, NDC, etc.
   */
  public medicationId!: string;

  /**
   * @property {string} [createdBy] - User who created record
   * @validation Optional, set via audit hook
   * @business Required for controlled substance audit trail
   */
  public createdBy?: string;

  /**
   * @property {string} [updatedBy] - User who last updated record
   * @validation Optional, set via audit hook
   * @business Tracks who adjusted quantities or made corrections
   */
  public updatedBy?: string;

  /**
   * @property {Medication} [medication] - Associated medication record
   * @association BelongsTo relationship with Medication
   */
  declare medication?: Medication;

  /**
   * @method needsReorder
   * @description Check if inventory is below reorder level
   * @returns {boolean} True if quantity <= reorderLevel
   * @business Use to generate automated reorder alerts
   * @business Critical medications may need manual review even above reorder level
   */
  get needsReorder(): boolean {
    return this.quantity <= this.reorderLevel;
  }

  /**
   * @method isExpired
   * @description Check if medication is expired
   * @returns {boolean} True if current date > expirationDate
   * @business Expired medications cannot be dispensed (regulatory violation)
   * @business Must be disposed per DEA regulations for controlled substances
   */
  get isExpired(): boolean {
    return new Date() > this.expirationDate;
  }

  /**
   * @method isExpiringSoon
   * @description Check if medication expires within 90 days
   * @returns {boolean} True if expiration within 90 days but not yet expired
   * @business Provides advance warning for procurement planning
   * @business Some medications (epinephrine) may need earlier warning
   * @business 90-day threshold allows time for ordering and delivery
   */
  get isExpiringSoon(): boolean {
    const ninetyDaysFromNow = new Date();
    ninetyDaysFromNow.setDate(ninetyDaysFromNow.getDate() + 90);
    return this.expirationDate <= ninetyDaysFromNow && !this.isExpired;
  }

  /**
   * @method daysUntilExpiration
   * @description Calculate days remaining until expiration
   * @returns {number} Days until expiration (negative if expired)
   * @business Useful for prioritizing FIFO dispensing
   * @business Alerts can escalate as expiration approaches
   */
  get daysUntilExpiration(): number {
    const now = new Date();
    const diff = this.expirationDate.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  /**
   * @method totalValue
   * @description Calculate total inventory value for this batch
   * @returns {number|null} Total value (quantity × costPerUnit) or null if no cost
   * @financial Used for balance sheet inventory valuation
   * @financial Null if costPerUnit not set
   */
  get totalValue(): number | null {
    if (!this.costPerUnit) return null;
    return this.quantity * this.costPerUnit;
  }

  /**
   * @method status
   * @description Get current inventory status
   * @returns {'EXPIRED'|'EXPIRING_SOON'|'LOW_STOCK'|'ADEQUATE'} Status indicator
   * @business Priority order: EXPIRED > EXPIRING_SOON > LOW_STOCK > ADEQUATE
   * @business Use for dashboard alerts and color-coding in UI
   *
   * Status meanings:
   * - EXPIRED: Past expiration date, must dispose
   * - EXPIRING_SOON: Expires in <90 days, plan replacement
   * - LOW_STOCK: Quantity at or below reorder level
   * - ADEQUATE: Sufficient stock, not expiring soon
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
