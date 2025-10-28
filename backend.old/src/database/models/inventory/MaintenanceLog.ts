/**
 * @fileoverview Maintenance Log Database Model
 * @module database/models/inventory/MaintenanceLog
 * @description Sequelize model for tracking maintenance, repair, and calibration activities
 * for medical equipment and inventory items. Critical for equipment safety, regulatory
 * compliance, and liability protection.
 *
 * Key Features:
 * - Comprehensive maintenance activity logging (routine, repair, calibration, inspection, cleaning)
 * - Cost tracking for maintenance and repair budgeting
 * - Next maintenance date scheduling with automated alerts
 * - Vendor/service provider tracking
 * - Equipment lifecycle management
 * - Immutable audit trail (timestamp-only, no updates)
 *
 * @business Maintenance tracking ensures:
 * - Equipment operates safely and effectively
 * - Compliance with manufacturer maintenance schedules
 * - Regulatory compliance (FDA, state health dept, OSHA)
 * - Extended equipment lifespan through preventive maintenance
 * - Budget planning for equipment replacement and repairs
 * - Legal liability protection through documented maintenance
 *
 * @business Maintenance Type Categories:
 * - ROUTINE: Scheduled preventive maintenance per manufacturer guidelines
 * - REPAIR: Fixing broken or malfunctioning equipment
 * - CALIBRATION: Precision adjustment for medical devices (thermometers, BP monitors, scales)
 * - INSPECTION: Safety and functionality checks
 * - CLEANING: Deep cleaning and sanitization (distinct from daily cleaning)
 * - REPLACEMENT: Component replacement (batteries, filters, parts)
 *
 * @compliance FDA - Medical device maintenance required by 21 CFR 820
 * @compliance Joint Commission - Equipment management standards (EC.02.04.01)
 * @compliance OSHA - Safety equipment inspection requirements
 * @compliance State Health - Medical equipment maintenance records retention (7+ years)
 *
 * @legal Retention requirement: 7 years minimum, equipment lifetime + 3 years recommended
 * @legal Required for liability protection in equipment-related incidents
 * @legal Manufacturer warranty may require documented maintenance
 *
 * @requires sequelize
 * @requires ../../config/sequelize
 * @requires ../../types/enums
 *
 * LOC: 19C8EC59A1
 * WC-GEN-081 | MaintenanceLog.ts
 * Last Updated: 2025-10-26
 *
 * UPSTREAM (imports from):
 *   - sequelize.ts (database/config/sequelize.ts)
 *   - enums.ts (database/types/enums.ts)
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (database/models/index.ts)
 *   - InventoryItem.ts (database/models/inventory/InventoryItem.ts)
 *   - MaintenanceService.ts (services/maintenance/)
 */

import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';
import { MaintenanceType } from '../../types/enums';

/**
 * @interface MaintenanceLogAttributes
 * @description Defines the complete structure of a maintenance log record
 *
 * @property {string} id - Unique identifier (UUID v4)
 * @property {MaintenanceType} type - Type of maintenance activity performed
 * @enum {MaintenanceType} ['ROUTINE', 'REPAIR', 'CALIBRATION', 'INSPECTION', 'CLEANING', 'REPLACEMENT']
 * @business ROUTINE: Scheduled preventive maintenance (monthly, quarterly, annual)
 * @business REPAIR: Fixing broken or malfunctioning equipment
 * @business CALIBRATION: Precision adjustment for accuracy (thermometers, scales, BP monitors)
 * @business INSPECTION: Safety and functionality checks (emergency equipment, defibrillators)
 * @business CLEANING: Deep cleaning and sanitization beyond daily cleaning
 * @business REPLACEMENT: Component replacement (batteries, filters, bulbs, parts)
 *
 * @property {string} description - Detailed description of maintenance performed (1-5000 characters)
 * @business Must be specific enough for audit and liability purposes
 * @business Include: What was done, findings, parts replaced, issues discovered
 * @business Example: "Annual calibration of infrared thermometer. Adjusted sensor to manufacturer specs. Verified accuracy ±0.2°F within acceptable range."
 *
 * @property {number} [cost] - Cost of maintenance/repair (DECIMAL 10,2, max $99,999,999.99)
 * @business Used for equipment lifecycle cost analysis and budget planning
 * @business Include parts, labor, service fees
 * @business Track to determine when equipment replacement more cost-effective than repair
 *
 * @property {Date} [nextMaintenanceDate] - Next scheduled maintenance date
 * @business Auto-calculated based on manufacturer recommendations and maintenance type
 * @business System alerts when approaching (30 days before)
 * @business Must be in future (0-10 years)
 * @business ROUTINE maintenance typically sets next maintenance date
 * @business CALIBRATION equipment often requires 6-12 month recalibration
 *
 * @property {string} [vendor] - Service provider or vendor name (up to 255 characters)
 * @business Track which vendors service which equipment
 * @business Required for warranty service
 * @business Helps evaluate vendor performance and quality
 *
 * @property {string} [notes] - Additional notes about maintenance (up to 10,000 characters)
 * @business Can include warranty information, parts ordered, follow-up needed
 * @business Document any safety concerns or recommendations for equipment replacement
 *
 * @property {Date} createdAt - Record creation timestamp (immutable log entry)
 * @business Represents when maintenance was performed and logged
 * @business Used for maintenance history timeline and frequency analysis
 *
 * Foreign Keys:
 * @property {string} inventoryItemId - Foreign key to InventoryItem being maintained
 * @business Links maintenance record to specific equipment
 * @business Enables equipment maintenance history queries
 *
 * @property {string} performedById - Foreign key to User who performed/logged maintenance
 * @business Required for accountability and audit trail
 * @business Tracks which staff member performed maintenance
 * @business May be internal staff or external vendor technician logged by staff
 *
 * @business Maintenance Scheduling Guidelines:
 * - Daily use equipment: Inspect monthly, routine maintenance quarterly
 * - Critical emergency equipment (AEDs, oxygen): Inspect monthly, test quarterly
 * - Calibration equipment: Calibrate annually or per manufacturer
 * - Refrigerators (medication storage): Check daily, service annually
 * - First aid kits: Inspect monthly, restock as needed
 *
 * @compliance FDA - Medical device maintenance records required by 21 CFR 820.72
 * @compliance Joint Commission - Equipment management program (EC.02.04.01)
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

/**
 * @interface MaintenanceLogCreationAttributes
 * @description Attributes required/optional when creating a new maintenance log entry
 * @extends {Optional<MaintenanceLogAttributes>}
 *
 * Required on creation:
 * - type (maintenance activity type)
 * - description (detailed work performed)
 * - inventoryItemId (equipment being maintained)
 * - performedById (staff member performing/logging maintenance)
 *
 * Optional on creation:
 * - id (auto-generated UUID)
 * - createdAt (auto-generated, immutable timestamp)
 * - cost (maintenance/repair cost)
 * - nextMaintenanceDate (next scheduled maintenance)
 * - vendor (service provider name)
 * - notes (additional information)
 */
interface MaintenanceLogCreationAttributes
  extends Optional<MaintenanceLogAttributes, 'id' | 'createdAt' | 'cost' | 'nextMaintenanceDate' | 'vendor' | 'notes'> {}

/**
 * @class MaintenanceLog
 * @extends {Model<MaintenanceLogAttributes, MaintenanceLogCreationAttributes>}
 * @description Sequelize model for equipment maintenance log records
 *
 * Tracks all maintenance, repair, calibration, and inspection activities for medical equipment
 * and inventory items. Provides complete maintenance history for regulatory compliance,
 * equipment lifecycle management, and liability protection.
 *
 * Immutability Pattern:
 * - Timestamp-only model (no updatedAt)
 * - Logs should not be modified after creation
 * - Corrections require new log entry with notes explaining correction
 *
 * Use Cases:
 * - Scheduled preventive maintenance tracking
 * - Repair and breakdown documentation
 * - Calibration record keeping for medical devices
 * - Safety inspection logging
 * - Equipment lifecycle cost analysis
 * - Regulatory compliance audits
 * - Warranty claim support
 *
 * Maintenance Workflow:
 * 1. Equipment identified for maintenance (scheduled or as-needed)
 * 2. Maintenance performed by staff or external vendor
 * 3. Log created with detailed description of work performed
 * 4. Cost tracked for budgeting and lifecycle analysis
 * 5. Next maintenance date calculated and set
 * 6. Alerts generated when next maintenance approaching
 *
 * Associations:
 * - BelongsTo InventoryItem (inventoryItemId FK) - Equipment being maintained
 * - BelongsTo User (performedById FK) - Staff member who performed maintenance
 *
 * @example
 * // Log routine preventive maintenance
 * const routineMaintenance = await MaintenanceLog.create({
 *   inventoryItemId: 'blood-pressure-monitor-uuid',
 *   type: MaintenanceType.ROUTINE,
 *   description: 'Quarterly preventive maintenance: Cleaned device, checked cuff for leaks, verified display functionality, tested against calibrated unit - all within acceptable range',
 *   performedById: 'nurse-uuid',
 *   nextMaintenanceDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
 *   notes: 'Device operating normally, no issues found'
 * });
 *
 * @example
 * // Log calibration with cost and vendor
 * const calibrationLog = await MaintenanceLog.create({
 *   inventoryItemId: 'digital-scale-uuid',
 *   type: MaintenanceType.CALIBRATION,
 *   description: 'Annual calibration by certified technician. Adjusted to NIST-traceable standards. Accuracy verified ±0.1 lb within acceptable range per manufacturer specifications.',
 *   cost: 125.00,
 *   vendor: 'MedEquip Calibration Services',
 *   performedById: 'admin-uuid',
 *   nextMaintenanceDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
 *   notes: 'Certificate of calibration on file. Next calibration due 2026-10-26. Service contract renewed.'
 * });
 *
 * @example
 * // Log equipment repair
 * const repairLog = await MaintenanceLog.create({
 *   inventoryItemId: 'thermometer-uuid',
 *   type: MaintenanceType.REPAIR,
 *   description: 'Infrared thermometer not powering on. Replaced battery (CR2032) and tested. Device now functioning correctly, accuracy verified against calibrated unit.',
 *   cost: 3.50,
 *   performedById: 'nurse-uuid',
 *   notes: 'Keep spare batteries in stock to prevent future downtime'
 * });
 *
 * @example
 * // Log safety inspection for emergency equipment
 * const inspectionLog = await MaintenanceLog.create({
 *   inventoryItemId: 'aed-uuid',
 *   type: MaintenanceType.INSPECTION,
 *   description: 'Monthly AED inspection: Checked indicator light (green/ready), verified pads expiration (good until 2026-12), confirmed no physical damage, tested battery level indicator (full)',
 *   performedById: 'nurse-uuid',
 *   nextMaintenanceDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
 *   notes: 'AED ready for emergency use. Pads will expire in 14 months - order replacements when 6 months remain.'
 * });
 *
 * @example
 * // Query maintenance history for equipment
 * const maintenanceHistory = await MaintenanceLog.findAll({
 *   where: { inventoryItemId: 'equipment-uuid' },
 *   order: [['createdAt', 'DESC']],
 *   include: [
 *     { model: User, as: 'performedBy', attributes: ['firstName', 'lastName'] },
 *     { model: InventoryItem, as: 'inventoryItem', attributes: ['name', 'category'] }
 *   ]
 * });
 *
 * @example
 * // Find equipment needing maintenance soon (next 30 days)
 * const upcomingMaintenance = await MaintenanceLog.findAll({
 *   where: {
 *     nextMaintenanceDate: {
 *       [Op.between]: [new Date(), new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)]
 *     }
 *   },
 *   order: [['nextMaintenanceDate', 'ASC']],
 *   include: [{ model: InventoryItem, as: 'inventoryItem' }]
 * });
 *
 * @example
 * // Calculate total maintenance cost for equipment
 * const maintenanceCosts = await MaintenanceLog.findAll({
 *   where: { inventoryItemId: 'equipment-uuid' },
 *   attributes: [
 *     [sequelize.fn('SUM', sequelize.col('cost')), 'totalCost'],
 *     [sequelize.fn('COUNT', sequelize.col('id')), 'maintenanceCount'],
 *     [sequelize.fn('AVG', sequelize.col('cost')), 'avgCost']
 *   ]
 * });
 *
 * @compliance FDA - Medical device maintenance records (21 CFR 820.72)
 * @compliance Joint Commission - Equipment management program (EC.02.04.01)
 * @compliance OSHA - Safety equipment inspection documentation
 * @legal Retention: 7 years minimum, equipment lifetime + 3 years recommended
 * @immutable Logs are immutable after creation; create new entry for corrections
 */
export class MaintenanceLog extends Model<MaintenanceLogAttributes, MaintenanceLogCreationAttributes> implements MaintenanceLogAttributes {
  /**
   * @property {string} id - Unique identifier (UUID v4)
   */
  public id!: string;

  /**
   * @property {MaintenanceType} type - Maintenance activity type
   * @validation Required, must be valid MaintenanceType enum
   * @business Types: ROUTINE, REPAIR, CALIBRATION, INSPECTION, CLEANING, REPLACEMENT
   */
  public type!: MaintenanceType;

  /**
   * @property {string} description - Detailed maintenance description
   * @validation Required, 1-5000 characters
   * @business Must be specific enough for regulatory audits and liability protection
   * @business Include: work performed, findings, parts replaced, test results
   */
  public description!: string;

  /**
   * @property {number} [cost] - Maintenance/repair cost
   * @validation Optional, non-negative, DECIMAL(10,2), max $99,999,999.99
   * @business Used for equipment lifecycle cost analysis
   * @business Track to determine repair vs replacement decisions
   */
  public cost?: number;

  /**
   * @property {Date} [nextMaintenanceDate] - Next scheduled maintenance date
   * @validation Optional, must be future date, max 10 years from now
   * @business System alerts generated when approaching (30 days before)
   * @business Calculated based on maintenance type and manufacturer recommendations
   */
  public nextMaintenanceDate?: Date;

  /**
   * @property {string} [vendor] - Service provider name
   * @validation Optional, up to 255 characters
   * @business Track vendor performance and quality
   * @business Required for warranty service claims
   */
  public vendor?: string;

  /**
   * @property {string} [notes] - Additional notes
   * @validation Optional, up to 10,000 characters
   * @business Can include warranty info, follow-up needs, safety concerns
   */
  public notes?: string;

  /**
   * @property {Date} createdAt - Record creation timestamp
   * @readonly Immutable, represents when maintenance was performed
   */
  public readonly createdAt!: Date;

  /**
   * @property {string} inventoryItemId - Equipment reference
   * @validation Required, must reference valid InventoryItem
   * @business Links to equipment being maintained
   */
  public inventoryItemId!: string;

  /**
   * @property {string} performedById - User who performed maintenance
   * @validation Required, must reference valid User
   * @business Required for accountability and audit trail
   */
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
          args: true,
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
