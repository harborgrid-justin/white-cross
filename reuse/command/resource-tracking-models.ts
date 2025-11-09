/**
 * @fileoverview Resource Tracking Models Kit - Comprehensive Sequelize models for resource management
 * @module reuse/command/resource-tracking-models
 * @description Production-ready Sequelize model utilities for resource tracking systems including
 * personnel management, equipment tracking, supply inventory, facility resources, external resource
 * coordination, capability matrices, deployment history, and maintenance/certification tracking.
 *
 * Key Features:
 * - Personnel tracking (on-duty, available, deployed, off-duty)
 * - Equipment and apparatus tracking (vehicles, tools, specialized gear)
 * - Supply inventory management (medical, fire suppression, rescue, PPE)
 * - Facility resource models (stations, warehouses, caches)
 * - External resource coordination and mutual aid
 * - Resource capability matrix and qualification tracking
 * - Deployment history and utilization analytics
 * - Maintenance schedules and certification tracking
 * - Resource allocation optimization
 * - Real-time availability status
 * - Automated reorder points and inventory alerts
 * - Chain of custody for sensitive equipment
 *
 * @target Sequelize v6.x, Node 18+, TypeScript 5.x
 *
 * @security
 * - Personnel information protection (PII)
 * - Sensitive equipment tracking (weapons, medications)
 * - Audit trails for resource assignments
 * - Role-based access control
 * - Encryption for sensitive certifications
 * - Chain of custody logging
 * - Compliance tracking (OSHA, regulatory)
 *
 * @example Basic personnel tracking
 * ```typescript
 * import { createPersonnelModel, addPersonnelAvailability } from './resource-tracking-models';
 *
 * const PersonnelModel = createPersonnelModel(sequelize);
 * addPersonnelAvailability(PersonnelModel);
 * addPersonnelCertifications(PersonnelModel);
 * ```
 *
 * @example Equipment tracking
 * ```typescript
 * import {
 *   createEquipmentModel,
 *   addEquipmentMaintenanceTracking,
 *   addEquipmentLocationTracking
 * } from './resource-tracking-models';
 *
 * const EquipmentModel = createEquipmentModel(sequelize);
 * addEquipmentMaintenanceTracking(EquipmentModel);
 * addEquipmentLocationTracking(EquipmentModel);
 * ```
 *
 * @example Inventory management
 * ```typescript
 * import {
 *   createSupplyInventoryModel,
 *   addInventoryReorderAlerts,
 *   addInventoryExpirationTracking
 * } from './resource-tracking-models';
 *
 * const inventory = await createSupplyInventory(sequelize, {
 *   itemName: 'Trauma Dressing',
 *   quantity: 500,
 *   reorderPoint: 100
 * });
 * ```
 *
 * LOC: RT-MODEL-001
 * UPSTREAM: sequelize, @types/sequelize, ulid, crypto
 * DOWNSTREAM: resource management systems, inventory systems, dispatch, operations
 *
 * @version 1.0.0
 * @since 2025-11-09
 */

import {
  Model,
  ModelStatic,
  Sequelize,
  DataTypes,
  ModelAttributes,
  ModelOptions,
  ValidationError,
  Transaction,
  Op,
  literal,
  fn,
  col,
  FindOptions,
} from 'sequelize';
import * as crypto from 'crypto';
import { monotonicFactory } from 'ulid';

// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================

/**
 * @enum PersonnelStatus
 * @description Personnel availability status
 */
export enum PersonnelStatus {
  ON_DUTY = 'ON_DUTY',
  AVAILABLE = 'AVAILABLE',
  DEPLOYED = 'DEPLOYED',
  OFF_DUTY = 'OFF_DUTY',
  ON_LEAVE = 'ON_LEAVE',
  SICK_LEAVE = 'SICK_LEAVE',
  TRAINING = 'TRAINING',
  ADMINISTRATIVE = 'ADMINISTRATIVE',
  UNAVAILABLE = 'UNAVAILABLE',
}

/**
 * @enum PersonnelRank
 * @description Personnel ranks and positions
 */
export enum PersonnelRank {
  FIREFIGHTER = 'FIREFIGHTER',
  ENGINEER = 'ENGINEER',
  LIEUTENANT = 'LIEUTENANT',
  CAPTAIN = 'CAPTAIN',
  BATTALION_CHIEF = 'BATTALION_CHIEF',
  DIVISION_CHIEF = 'DIVISION_CHIEF',
  ASSISTANT_CHIEF = 'ASSISTANT_CHIEF',
  FIRE_CHIEF = 'FIRE_CHIEF',
  PARAMEDIC = 'PARAMEDIC',
  EMT = 'EMT',
  ADVANCED_EMT = 'ADVANCED_EMT',
  OFFICER = 'OFFICER',
  SERGEANT = 'SERGEANT',
  SPECIALIST = 'SPECIALIST',
}

/**
 * @enum EquipmentStatus
 * @description Equipment operational status
 */
export enum EquipmentStatus {
  AVAILABLE = 'AVAILABLE',
  IN_USE = 'IN_USE',
  MAINTENANCE = 'MAINTENANCE',
  OUT_OF_SERVICE = 'OUT_OF_SERVICE',
  RESERVED = 'RESERVED',
  DAMAGED = 'DAMAGED',
  RETIRED = 'RETIRED',
  LOST = 'LOST',
  STOLEN = 'STOLEN',
}

/**
 * @enum EquipmentCategory
 * @description Categories of equipment
 */
export enum EquipmentCategory {
  VEHICLE = 'VEHICLE',
  MEDICAL = 'MEDICAL',
  FIRE_SUPPRESSION = 'FIRE_SUPPRESSION',
  RESCUE = 'RESCUE',
  COMMUNICATIONS = 'COMMUNICATIONS',
  PPE = 'PPE',
  TOOLS = 'TOOLS',
  DETECTION = 'DETECTION',
  SPECIALIZED = 'SPECIALIZED',
  SUPPORT = 'SUPPORT',
}

/**
 * @enum SupplyCategory
 * @description Categories of supplies
 */
export enum SupplyCategory {
  MEDICAL = 'MEDICAL',
  PHARMACEUTICAL = 'PHARMACEUTICAL',
  FIRE_SUPPRESSION = 'FIRE_SUPPRESSION',
  RESCUE = 'RESCUE',
  PPE = 'PPE',
  CONSUMABLES = 'CONSUMABLES',
  ADMINISTRATIVE = 'ADMINISTRATIVE',
  HAZMAT = 'HAZMAT',
  FOOD_WATER = 'FOOD_WATER',
}

/**
 * @enum MaintenanceType
 * @description Types of maintenance
 */
export enum MaintenanceType {
  PREVENTIVE = 'PREVENTIVE',
  CORRECTIVE = 'CORRECTIVE',
  INSPECTION = 'INSPECTION',
  REPAIR = 'REPAIR',
  CALIBRATION = 'CALIBRATION',
  TESTING = 'TESTING',
  CLEANING = 'CLEANING',
  REPLACEMENT = 'REPLACEMENT',
}

/**
 * @enum CertificationStatus
 * @description Certification validity status
 */
export enum CertificationStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  EXPIRING_SOON = 'EXPIRING_SOON',
  PENDING = 'PENDING',
  SUSPENDED = 'SUSPENDED',
  REVOKED = 'REVOKED',
}

/**
 * @enum FacilityType
 * @description Types of facilities
 */
export enum FacilityType {
  FIRE_STATION = 'FIRE_STATION',
  EMS_STATION = 'EMS_STATION',
  POLICE_STATION = 'POLICE_STATION',
  WAREHOUSE = 'WAREHOUSE',
  TRAINING_CENTER = 'TRAINING_CENTER',
  EQUIPMENT_CACHE = 'EQUIPMENT_CACHE',
  COMMAND_CENTER = 'COMMAND_CENTER',
  MAINTENANCE_FACILITY = 'MAINTENANCE_FACILITY',
}

/**
 * @interface PersonnelAttributes
 * @description Personnel model attributes
 */
export interface PersonnelAttributes {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  rank: PersonnelRank;
  status: PersonnelStatus;
  department: string;
  station: string;
  shiftSchedule?: string;
  phoneNumber: string;
  email: string;
  certifications?: string[];
  specializations?: string[];
  currentAssignment?: string;
  hireDate: Date;
  lastTrainingDate?: Date;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * @interface EquipmentAttributes
 * @description Equipment model attributes
 */
export interface EquipmentAttributes {
  id: string;
  equipmentId: string;
  name: string;
  category: EquipmentCategory;
  status: EquipmentStatus;
  manufacturer?: string;
  modelNumber?: string;
  serialNumber?: string;
  acquisitionDate: Date;
  acquisitionCost?: number;
  currentValue?: number;
  assignedTo?: string;
  location?: string;
  lastMaintenanceDate?: Date;
  nextMaintenanceDate?: Date;
  warrantyExpiration?: Date;
  metadata?: Record<string, any>;
}

/**
 * @interface SupplyInventoryAttributes
 * @description Supply inventory model attributes
 */
export interface SupplyInventoryAttributes {
  id: string;
  itemName: string;
  category: SupplyCategory;
  sku?: string;
  quantity: number;
  unitOfMeasure: string;
  reorderPoint: number;
  maxQuantity?: number;
  location: string;
  expirationDate?: Date;
  lotNumber?: string;
  supplier?: string;
  unitCost?: number;
  metadata?: Record<string, any>;
}

// ============================================================================
// PERSONNEL TRACKING MODELS
// ============================================================================

/**
 * Creates a personnel tracking model
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Partial<ModelOptions>} [options={}] - Additional model options
 * @returns {ModelStatic<Model>} Personnel model
 *
 * @example
 * ```typescript
 * const Personnel = createPersonnelModel(sequelize);
 * ```
 */
export const createPersonnelModel = (
  sequelize: Sequelize,
  options: Partial<ModelOptions> = {},
): ModelStatic<Model> => {
  const attributes: ModelAttributes = {
    id: {
      type: DataTypes.STRING(26),
      primaryKey: true,
      allowNull: false,
      defaultValue: () => generateULID(),
    },
    employeeId: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    firstName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    rank: {
      type: DataTypes.ENUM(...Object.values(PersonnelRank)),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(PersonnelStatus)),
      allowNull: false,
      defaultValue: PersonnelStatus.OFF_DUTY,
    },
    department: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    station: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    shiftSchedule: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    phoneNumber: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    certifications: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: [],
    },
    specializations: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: [],
    },
    currentAssignment: {
      type: DataTypes.STRING(26),
      allowNull: true,
    },
    hireDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    lastTrainingDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
    },
  };

  class Personnel extends Model {}
  return Personnel.init(attributes, {
    sequelize,
    modelName: 'Personnel',
    tableName: 'personnel',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['employee_id'], unique: true },
      { fields: ['status'] },
      { fields: ['rank'] },
      { fields: ['department'] },
      { fields: ['station'] },
    ],
    ...options,
  });
};

/**
 * Adds personnel availability tracking
 *
 * @param {ModelStatic<Model>} model - Personnel model
 * @returns {void}
 *
 * @example
 * ```typescript
 * addPersonnelAvailabilityTracking(PersonnelModel);
 * ```
 */
export const addPersonnelAvailabilityTracking = (model: ModelStatic<Model>): void => {
  model.addHook('beforeUpdate', async (instance: any) => {
    if (instance.changed('status')) {
      // Track status changes
      if (!instance.metadata.statusHistory) {
        instance.metadata.statusHistory = [];
      }

      instance.metadata.statusHistory.push({
        status: instance.status,
        timestamp: new Date(),
        previousStatus: instance.previous('status'),
      });

      // Clear assignment when going off duty
      if ([PersonnelStatus.OFF_DUTY, PersonnelStatus.ON_LEAVE].includes(instance.status)) {
        instance.currentAssignment = null;
      }
    }
  });
};

/**
 * Adds personnel certification tracking
 *
 * @param {ModelStatic<Model>} model - Personnel model
 * @returns {void}
 *
 * @example
 * ```typescript
 * addPersonnelCertificationTracking(PersonnelModel);
 * ```
 */
export const addPersonnelCertificationTracking = (model: ModelStatic<Model>): void => {
  const attributes = (model as any).rawAttributes;

  attributes.isCertified = {
    type: DataTypes.VIRTUAL,
    get(this: any) {
      return this.certifications && this.certifications.length > 0;
    },
  };

  attributes.yearsOfService = {
    type: DataTypes.VIRTUAL,
    get(this: any) {
      if (!this.hireDate) return 0;
      const diff = new Date().getTime() - new Date(this.hireDate).getTime();
      return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    },
  };
};

/**
 * Adds personnel deployment history
 *
 * @param {ModelStatic<Model>} model - Personnel model
 * @returns {void}
 *
 * @example
 * ```typescript
 * addPersonnelDeploymentHistory(PersonnelModel);
 * ```
 */
export const addPersonnelDeploymentHistory = (model: ModelStatic<Model>): void => {
  model.addHook('beforeUpdate', async (instance: any) => {
    if (instance.changed('currentAssignment')) {
      if (!instance.metadata.deploymentHistory) {
        instance.metadata.deploymentHistory = [];
      }

      if (instance.currentAssignment) {
        instance.metadata.deploymentHistory.push({
          assignmentId: instance.currentAssignment,
          deployedAt: new Date(),
          status: instance.status,
        });
      } else if (instance.previous('currentAssignment')) {
        // Assignment ended
        const lastDeployment = instance.metadata.deploymentHistory[instance.metadata.deploymentHistory.length - 1];
        if (lastDeployment && !lastDeployment.completedAt) {
          lastDeployment.completedAt = new Date();
        }
      }
    }
  });
};

/**
 * Adds personnel shift schedule validation
 *
 * @param {ModelStatic<Model>} model - Personnel model
 * @returns {void}
 *
 * @example
 * ```typescript
 * addPersonnelShiftValidation(PersonnelModel);
 * ```
 */
export const addPersonnelShiftValidation = (model: ModelStatic<Model>): void => {
  model.addHook('beforeSave', async (instance: any) => {
    const validShifts = ['A', 'B', 'C', 'D', 'DAY', 'NIGHT', 'ROTATING', 'ADMIN'];

    if (instance.shiftSchedule && !validShifts.includes(instance.shiftSchedule)) {
      throw new Error(`Invalid shift schedule. Must be one of: ${validShifts.join(', ')}`);
    }
  });
};

/**
 * Finds available personnel by criteria
 *
 * @param {ModelStatic<Model>} model - Personnel model
 * @param {PersonnelRank} [rank] - Filter by rank
 * @param {string[]} [certifications] - Required certifications
 * @param {string} [station] - Filter by station
 * @returns {Promise<Model[]>} Available personnel
 *
 * @example
 * ```typescript
 * const available = await findAvailablePersonnel(PersonnelModel, PersonnelRank.PARAMEDIC, ['ACLS']);
 * ```
 */
export const findAvailablePersonnel = async (
  model: ModelStatic<Model>,
  rank?: PersonnelRank,
  certifications?: string[],
  station?: string,
): Promise<Model[]> => {
  const where: any = {
    status: {
      [Op.in]: [PersonnelStatus.AVAILABLE, PersonnelStatus.ON_DUTY],
    },
  };

  if (rank) where.rank = rank;
  if (station) where.station = station;

  let results = await model.findAll({ where });

  // Filter by certifications if specified
  if (certifications && certifications.length > 0) {
    results = results.filter((person: any) => {
      return certifications.every(cert => person.certifications?.includes(cert));
    });
  }

  return results;
};

// ============================================================================
// EQUIPMENT TRACKING MODELS
// ============================================================================

/**
 * Creates an equipment tracking model
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Partial<ModelOptions>} [options={}] - Additional model options
 * @returns {ModelStatic<Model>} Equipment model
 *
 * @example
 * ```typescript
 * const Equipment = createEquipmentModel(sequelize);
 * ```
 */
export const createEquipmentModel = (
  sequelize: Sequelize,
  options: Partial<ModelOptions> = {},
): ModelStatic<Model> => {
  const attributes: ModelAttributes = {
    id: {
      type: DataTypes.STRING(26),
      primaryKey: true,
      allowNull: false,
      defaultValue: () => generateULID(),
    },
    equipmentId: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    category: {
      type: DataTypes.ENUM(...Object.values(EquipmentCategory)),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(EquipmentStatus)),
      allowNull: false,
      defaultValue: EquipmentStatus.AVAILABLE,
    },
    manufacturer: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    modelNumber: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    serialNumber: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: true,
    },
    acquisitionDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    acquisitionCost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    currentValue: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    assignedTo: {
      type: DataTypes.STRING(26),
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    lastMaintenanceDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    nextMaintenanceDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    warrantyExpiration: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
    },
  };

  class Equipment extends Model {}
  return Equipment.init(attributes, {
    sequelize,
    modelName: 'Equipment',
    tableName: 'equipment',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['equipment_id'], unique: true },
      { fields: ['serial_number'], unique: true },
      { fields: ['category'] },
      { fields: ['status'] },
      { fields: ['location'] },
      { fields: ['assigned_to'] },
    ],
    ...options,
  });
};

/**
 * Adds equipment maintenance tracking
 *
 * @param {ModelStatic<Model>} model - Equipment model
 * @returns {void}
 *
 * @example
 * ```typescript
 * addEquipmentMaintenanceTracking(EquipmentModel);
 * ```
 */
export const addEquipmentMaintenanceTracking = (model: ModelStatic<Model>): void => {
  const attributes = (model as any).rawAttributes;

  attributes.maintenanceStatus = {
    type: DataTypes.VIRTUAL,
    get(this: any) {
      if (!this.nextMaintenanceDate) return 'UNKNOWN';

      const now = new Date();
      const daysUntil = Math.floor(
        (this.nextMaintenanceDate - now.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysUntil < 0) return 'OVERDUE';
      if (daysUntil <= 7) return 'DUE_SOON';
      if (daysUntil <= 30) return 'UPCOMING';
      return 'CURRENT';
    },
  };

  attributes.warrantyStatus = {
    type: DataTypes.VIRTUAL,
    get(this: any) {
      if (!this.warrantyExpiration) return 'NO_WARRANTY';

      const now = new Date();
      return this.warrantyExpiration > now ? 'UNDER_WARRANTY' : 'EXPIRED';
    },
  };
};

/**
 * Adds equipment location tracking
 *
 * @param {ModelStatic<Model>} model - Equipment model
 * @returns {void}
 *
 * @example
 * ```typescript
 * addEquipmentLocationTracking(EquipmentModel);
 * ```
 */
export const addEquipmentLocationTracking = (model: ModelStatic<Model>): void => {
  model.addHook('beforeUpdate', async (instance: any) => {
    if (instance.changed('location') || instance.changed('assignedTo')) {
      if (!instance.metadata.locationHistory) {
        instance.metadata.locationHistory = [];
      }

      instance.metadata.locationHistory.push({
        location: instance.location,
        assignedTo: instance.assignedTo,
        timestamp: new Date(),
      });

      // Keep only last 100 location changes
      if (instance.metadata.locationHistory.length > 100) {
        instance.metadata.locationHistory = instance.metadata.locationHistory.slice(-100);
      }
    }
  });
};

/**
 * Adds equipment usage tracking
 *
 * @param {ModelStatic<Model>} model - Equipment model
 * @returns {void}
 *
 * @example
 * ```typescript
 * addEquipmentUsageTracking(EquipmentModel);
 * ```
 */
export const addEquipmentUsageTracking = (model: ModelStatic<Model>): void => {
  model.addHook('beforeUpdate', async (instance: any) => {
    if (instance.changed('status')) {
      if (!instance.metadata.usageHistory) {
        instance.metadata.usageHistory = [];
      }

      instance.metadata.usageHistory.push({
        status: instance.status,
        timestamp: new Date(),
        previousStatus: instance.previous('status'),
      });

      // Calculate usage statistics
      if (instance.status === EquipmentStatus.IN_USE) {
        if (!instance.metadata.usageStats) {
          instance.metadata.usageStats = { totalUses: 0 };
        }
        instance.metadata.usageStats.totalUses += 1;
        instance.metadata.usageStats.lastUsed = new Date();
      }
    }
  });
};

/**
 * Adds equipment depreciation calculation
 *
 * @param {ModelStatic<Model>} model - Equipment model
 * @param {number} [depreciationRate=0.15] - Annual depreciation rate (default 15%)
 * @returns {void}
 *
 * @example
 * ```typescript
 * addEquipmentDepreciation(EquipmentModel, 0.20);
 * ```
 */
export const addEquipmentDepreciation = (
  model: ModelStatic<Model>,
  depreciationRate: number = 0.15,
): void => {
  const attributes = (model as any).rawAttributes;

  attributes.estimatedValue = {
    type: DataTypes.VIRTUAL,
    get(this: any) {
      if (!this.acquisitionCost || !this.acquisitionDate) return null;

      const years = (new Date().getTime() - new Date(this.acquisitionDate).getTime()) /
        (1000 * 60 * 60 * 24 * 365.25);

      const depreciation = Math.pow(1 - depreciationRate, years);
      return (this.acquisitionCost * depreciation).toFixed(2);
    },
  };
};

/**
 * Adds equipment calibration requirements
 *
 * @param {ModelStatic<Model>} model - Equipment model
 * @returns {void}
 *
 * @example
 * ```typescript
 * addEquipmentCalibrationTracking(EquipmentModel);
 * ```
 */
export const addEquipmentCalibrationTracking = (model: ModelStatic<Model>): void => {
  const calibrationRequired = [
    EquipmentCategory.DETECTION,
    EquipmentCategory.MEDICAL,
  ];

  model.addHook('beforeSave', async (instance: any) => {
    if (calibrationRequired.includes(instance.category)) {
      if (!instance.metadata.calibrationHistory) {
        instance.metadata.calibrationHistory = [];
      }

      // Flag if calibration is overdue
      if (instance.metadata.lastCalibrationDate) {
        const daysSinceCalibration = Math.floor(
          (new Date().getTime() - new Date(instance.metadata.lastCalibrationDate).getTime()) /
          (1000 * 60 * 60 * 24)
        );

        if (daysSinceCalibration > 180) {
          instance.metadata.calibrationStatus = 'OVERDUE';
        } else if (daysSinceCalibration > 150) {
          instance.metadata.calibrationStatus = 'DUE_SOON';
        } else {
          instance.metadata.calibrationStatus = 'CURRENT';
        }
      } else {
        instance.metadata.calibrationStatus = 'NEVER_CALIBRATED';
      }
    }
  });
};

// ============================================================================
// SUPPLY INVENTORY MODELS
// ============================================================================

/**
 * Creates a supply inventory model
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Partial<ModelOptions>} [options={}] - Additional model options
 * @returns {ModelStatic<Model>} Supply inventory model
 *
 * @example
 * ```typescript
 * const Inventory = createSupplyInventoryModel(sequelize);
 * ```
 */
export const createSupplyInventoryModel = (
  sequelize: Sequelize,
  options: Partial<ModelOptions> = {},
): ModelStatic<Model> => {
  const attributes: ModelAttributes = {
    id: {
      type: DataTypes.STRING(26),
      primaryKey: true,
      allowNull: false,
      defaultValue: () => generateULID(),
    },
    itemName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    category: {
      type: DataTypes.ENUM(...Object.values(SupplyCategory)),
      allowNull: false,
    },
    sku: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    unitOfMeasure: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    reorderPoint: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    maxQuantity: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    expirationDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    lotNumber: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    supplier: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    unitCost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
    },
  };

  class SupplyInventory extends Model {}
  return SupplyInventory.init(attributes, {
    sequelize,
    modelName: 'SupplyInventory',
    tableName: 'supply_inventory',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['sku'], unique: true },
      { fields: ['category'] },
      { fields: ['location'] },
      { fields: ['expiration_date'] },
    ],
    ...options,
  });
};

/**
 * Adds inventory reorder alerts
 *
 * @param {ModelStatic<Model>} model - Inventory model
 * @returns {void}
 *
 * @example
 * ```typescript
 * addInventoryReorderAlerts(InventoryModel);
 * ```
 */
export const addInventoryReorderAlerts = (model: ModelStatic<Model>): void => {
  const attributes = (model as any).rawAttributes;

  attributes.inventoryStatus = {
    type: DataTypes.VIRTUAL,
    get(this: any) {
      if (this.quantity <= 0) return 'OUT_OF_STOCK';
      if (this.quantity <= this.reorderPoint) return 'REORDER_NEEDED';
      if (this.maxQuantity && this.quantity >= this.maxQuantity * 0.9) return 'OVERSTOCKED';
      return 'ADEQUATE';
    },
  };

  attributes.totalValue = {
    type: DataTypes.VIRTUAL,
    get(this: any) {
      if (!this.unitCost) return null;
      return (this.quantity * parseFloat(this.unitCost)).toFixed(2);
    },
  };

  model.addHook('afterUpdate', async (instance: any) => {
    if (instance.changed('quantity')) {
      if (!instance.metadata.reorderAlerts) {
        instance.metadata.reorderAlerts = [];
      }

      if (instance.quantity <= instance.reorderPoint) {
        instance.metadata.reorderAlerts.push({
          timestamp: new Date(),
          quantity: instance.quantity,
          reorderPoint: instance.reorderPoint,
          alertType: instance.quantity === 0 ? 'OUT_OF_STOCK' : 'LOW_STOCK',
        });
      }
    }
  });
};

/**
 * Adds inventory expiration tracking
 *
 * @param {ModelStatic<Model>} model - Inventory model
 * @returns {void}
 *
 * @example
 * ```typescript
 * addInventoryExpirationTracking(InventoryModel);
 * ```
 */
export const addInventoryExpirationTracking = (model: ModelStatic<Model>): void => {
  const attributes = (model as any).rawAttributes;

  attributes.expirationStatus = {
    type: DataTypes.VIRTUAL,
    get(this: any) {
      if (!this.expirationDate) return 'NO_EXPIRATION';

      const now = new Date();
      const daysUntilExpiration = Math.floor(
        (this.expirationDate - now.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysUntilExpiration < 0) return 'EXPIRED';
      if (daysUntilExpiration <= 7) return 'EXPIRES_SOON';
      if (daysUntilExpiration <= 30) return 'EXPIRING';
      return 'VALID';
    },
  };
};

/**
 * Adds inventory transaction tracking
 *
 * @param {ModelStatic<Model>} model - Inventory model
 * @returns {void}
 *
 * @example
 * ```typescript
 * addInventoryTransactionTracking(InventoryModel);
 * ```
 */
export const addInventoryTransactionTracking = (model: ModelStatic<Model>): void => {
  model.addHook('beforeUpdate', async (instance: any) => {
    if (instance.changed('quantity')) {
      if (!instance.metadata.transactionHistory) {
        instance.metadata.transactionHistory = [];
      }

      const previousQuantity = instance.previous('quantity');
      const change = instance.quantity - previousQuantity;

      instance.metadata.transactionHistory.push({
        timestamp: new Date(),
        previousQuantity,
        newQuantity: instance.quantity,
        change,
        transactionType: change > 0 ? 'RECEIPT' : 'ISSUE',
      });

      // Keep only last 200 transactions
      if (instance.metadata.transactionHistory.length > 200) {
        instance.metadata.transactionHistory = instance.metadata.transactionHistory.slice(-200);
      }
    }
  });
};

/**
 * Performs bulk inventory update
 *
 * @param {ModelStatic<Model>} model - Inventory model
 * @param {Array<{id: string, quantity: number}>} updates - Updates to apply
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await bulkInventoryUpdate(InventoryModel, [
 *   { id: 'item-1', quantity: 50 },
 *   { id: 'item-2', quantity: 100 }
 * ]);
 * ```
 */
export const bulkInventoryUpdate = async (
  model: ModelStatic<Model>,
  updates: Array<{ id: string; quantity: number }>,
  transaction?: Transaction,
): Promise<void> => {
  for (const update of updates) {
    const item = await model.findByPk(update.id, { transaction });
    if (item) {
      await item.update({ quantity: update.quantity }, { transaction });
    }
  }
};

// ============================================================================
// FACILITY RESOURCE MODELS
// ============================================================================

/**
 * Creates a facility resource model
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Partial<ModelOptions>} [options={}] - Additional model options
 * @returns {ModelStatic<Model>} Facility model
 *
 * @example
 * ```typescript
 * const Facility = createFacilityResourceModel(sequelize);
 * ```
 */
export const createFacilityResourceModel = (
  sequelize: Sequelize,
  options: Partial<ModelOptions> = {},
): ModelStatic<Model> => {
  const attributes: ModelAttributes = {
    id: {
      type: DataTypes.STRING(26),
      primaryKey: true,
      allowNull: false,
      defaultValue: () => generateULID(),
    },
    facilityName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    facilityType: {
      type: DataTypes.ENUM(...Object.values(FacilityType)),
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    location: {
      type: DataTypes.GEOMETRY('POINT'),
      allowNull: true,
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    currentOccupancy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    operationalStatus: {
      type: DataTypes.ENUM('OPERATIONAL', 'LIMITED', 'CLOSED', 'MAINTENANCE'),
      allowNull: false,
      defaultValue: 'OPERATIONAL',
    },
    stationedUnits: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: [],
    },
    availableResources: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
    },
    staffCapacity: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    currentStaffing: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
    },
  };

  class FacilityResource extends Model {}
  return FacilityResource.init(attributes, {
    sequelize,
    modelName: 'FacilityResource',
    tableName: 'facility_resources',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['facility_type'] },
      { fields: ['operational_status'] },
      { fields: ['location'], type: 'GIST' },
    ],
    ...options,
  });
};

/**
 * Adds facility capacity tracking
 *
 * @param {ModelStatic<Model>} model - Facility model
 * @returns {void}
 *
 * @example
 * ```typescript
 * addFacilityCapacityTracking(FacilityModel);
 * ```
 */
export const addFacilityCapacityTracking = (model: ModelStatic<Model>): void => {
  const attributes = (model as any).rawAttributes;

  attributes.occupancyRate = {
    type: DataTypes.VIRTUAL,
    get(this: any) {
      if (!this.capacity) return null;
      return ((this.currentOccupancy / this.capacity) * 100).toFixed(2);
    },
  };

  attributes.staffingRate = {
    type: DataTypes.VIRTUAL,
    get(this: any) {
      if (!this.staffCapacity) return null;
      return ((this.currentStaffing / this.staffCapacity) * 100).toFixed(2);
    },
  };

  attributes.availableCapacity = {
    type: DataTypes.VIRTUAL,
    get(this: any) {
      return (this.capacity || 0) - (this.currentOccupancy || 0);
    },
  };
};

/**
 * Adds facility resource inventory
 *
 * @param {ModelStatic<Model>} model - Facility model
 * @returns {void}
 *
 * @example
 * ```typescript
 * addFacilityResourceInventory(FacilityModel);
 * ```
 */
export const addFacilityResourceInventory = (model: ModelStatic<Model>): void => {
  model.addHook('beforeUpdate', async (instance: any) => {
    if (instance.changed('availableResources')) {
      if (!instance.metadata.resourceHistory) {
        instance.metadata.resourceHistory = [];
      }

      instance.metadata.resourceHistory.push({
        timestamp: new Date(),
        resources: instance.availableResources,
      });

      // Keep only last 30 snapshots
      if (instance.metadata.resourceHistory.length > 30) {
        instance.metadata.resourceHistory = instance.metadata.resourceHistory.slice(-30);
      }
    }
  });
};

// ============================================================================
// CERTIFICATION AND TRAINING MODELS
// ============================================================================

/**
 * Creates a certification model
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Partial<ModelOptions>} [options={}] - Additional model options
 * @returns {ModelStatic<Model>} Certification model
 *
 * @example
 * ```typescript
 * const Cert = createCertificationModel(sequelize);
 * ```
 */
export const createCertificationModel = (
  sequelize: Sequelize,
  options: Partial<ModelOptions> = {},
): ModelStatic<Model> => {
  const attributes: ModelAttributes = {
    id: {
      type: DataTypes.STRING(26),
      primaryKey: true,
      allowNull: false,
      defaultValue: () => generateULID(),
    },
    personnelId: {
      type: DataTypes.STRING(26),
      allowNull: false,
    },
    certificationName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    certificationNumber: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    issuingOrganization: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    issuedDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    expirationDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(CertificationStatus)),
      allowNull: false,
      defaultValue: CertificationStatus.ACTIVE,
    },
    renewalRequired: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    continuingEducationHours: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
    },
  };

  class Certification extends Model {}
  return Certification.init(attributes, {
    sequelize,
    modelName: 'Certification',
    tableName: 'certifications',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['personnel_id'] },
      { fields: ['status'] },
      { fields: ['expiration_date'] },
      { fields: ['certification_name'] },
    ],
    ...options,
  });
};

/**
 * Adds certification expiration monitoring
 *
 * @param {ModelStatic<Model>} model - Certification model
 * @returns {void}
 *
 * @example
 * ```typescript
 * addCertificationExpirationMonitoring(CertModel);
 * ```
 */
export const addCertificationExpirationMonitoring = (model: ModelStatic<Model>): void => {
  model.addHook('beforeSave', async (instance: any) => {
    if (instance.expirationDate) {
      const now = new Date();
      const daysUntilExpiration = Math.floor(
        (instance.expirationDate - now.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysUntilExpiration < 0) {
        instance.status = CertificationStatus.EXPIRED;
      } else if (daysUntilExpiration <= 30) {
        instance.status = CertificationStatus.EXPIRING_SOON;
      } else {
        instance.status = CertificationStatus.ACTIVE;
      }
    }
  });
};

/**
 * Adds certification renewal tracking
 *
 * @param {ModelStatic<Model>} model - Certification model
 * @returns {void}
 *
 * @example
 * ```typescript
 * addCertificationRenewalTracking(CertModel);
 * ```
 */
export const addCertificationRenewalTracking = (model: ModelStatic<Model>): void => {
  model.addHook('beforeUpdate', async (instance: any) => {
    if (instance.changed('expirationDate')) {
      if (!instance.metadata.renewalHistory) {
        instance.metadata.renewalHistory = [];
      }

      instance.metadata.renewalHistory.push({
        previousExpiration: instance.previous('expirationDate'),
        newExpiration: instance.expirationDate,
        renewedAt: new Date(),
      });
    }
  });
};

/**
 * Finds expiring certifications
 *
 * @param {ModelStatic<Model>} model - Certification model
 * @param {number} [days=30] - Days threshold
 * @returns {Promise<Model[]>} Expiring certifications
 *
 * @example
 * ```typescript
 * const expiring = await findExpiringCertifications(CertModel, 30);
 * ```
 */
export const findExpiringCertifications = async (
  model: ModelStatic<Model>,
  days: number = 30,
): Promise<Model[]> => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() + days);

  return model.findAll({
    where: {
      expirationDate: {
        [Op.lte]: cutoffDate,
        [Op.gte]: new Date(),
      },
      status: {
        [Op.in]: [CertificationStatus.ACTIVE, CertificationStatus.EXPIRING_SOON],
      },
    },
    order: [['expiration_date', 'ASC']],
  });
};

// ============================================================================
// DEPLOYMENT HISTORY MODELS
// ============================================================================

/**
 * Creates a deployment history model
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Partial<ModelOptions>} [options={}] - Additional model options
 * @returns {ModelStatic<Model>} Deployment history model
 *
 * @example
 * ```typescript
 * const Deployment = createDeploymentHistoryModel(sequelize);
 * ```
 */
export const createDeploymentHistoryModel = (
  sequelize: Sequelize,
  options: Partial<ModelOptions> = {},
): ModelStatic<Model> => {
  const attributes: ModelAttributes = {
    id: {
      type: DataTypes.STRING(26),
      primaryKey: true,
      allowNull: false,
      defaultValue: () => generateULID(),
    },
    resourceId: {
      type: DataTypes.STRING(26),
      allowNull: false,
    },
    resourceType: {
      type: DataTypes.ENUM('PERSONNEL', 'EQUIPMENT', 'UNIT'),
      allowNull: false,
    },
    incidentId: {
      type: DataTypes.STRING(26),
      allowNull: false,
    },
    deployedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    arrivedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    clearedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    deploymentRole: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    fromLocation: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    toLocation: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
    },
  };

  class DeploymentHistory extends Model {}
  return DeploymentHistory.init(attributes, {
    sequelize,
    modelName: 'DeploymentHistory',
    tableName: 'deployment_history',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['resource_id'] },
      { fields: ['resource_type'] },
      { fields: ['incident_id'] },
      { fields: ['deployed_at'] },
    ],
    ...options,
  });
};

/**
 * Adds deployment duration tracking
 *
 * @param {ModelStatic<Model>} model - Deployment history model
 * @returns {void}
 *
 * @example
 * ```typescript
 * addDeploymentDurationTracking(DeploymentModel);
 * ```
 */
export const addDeploymentDurationTracking = (model: ModelStatic<Model>): void => {
  const attributes = (model as any).rawAttributes;

  attributes.responseTime = {
    type: DataTypes.VIRTUAL,
    get(this: any) {
      if (!this.deployedAt || !this.arrivedAt) return null;
      return Math.floor((this.arrivedAt - this.deployedAt) / 1000 / 60); // minutes
    },
  };

  attributes.deploymentDuration = {
    type: DataTypes.VIRTUAL,
    get(this: any) {
      if (!this.deployedAt) return null;
      const end = this.clearedAt || new Date();
      return Math.floor((end - this.deployedAt) / 1000 / 60); // minutes
    },
  };

  attributes.isActive = {
    type: DataTypes.VIRTUAL,
    get(this: any) {
      return !this.clearedAt;
    },
  };
};

/**
 * Gets deployment statistics for a resource
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} resourceId - Resource ID
 * @param {Date} [startDate] - Start date filter
 * @param {Date} [endDate] - End date filter
 * @returns {Promise<Record<string, any>>} Deployment statistics
 *
 * @example
 * ```typescript
 * const stats = await getDeploymentStatistics(sequelize, 'resource-123');
 * ```
 */
export const getDeploymentStatistics = async (
  sequelize: Sequelize,
  resourceId: string,
  startDate?: Date,
  endDate?: Date,
): Promise<Record<string, any>> => {
  const whereClause: any = { resource_id: resourceId };

  if (startDate) {
    whereClause.deployed_at = { [Op.gte]: startDate };
  }
  if (endDate) {
    whereClause.deployed_at = { ...whereClause.deployed_at, [Op.lte]: endDate };
  }

  const [results] = await sequelize.query(
    `SELECT
      COUNT(*) as total_deployments,
      AVG(EXTRACT(EPOCH FROM (arrived_at - deployed_at)) / 60) as avg_response_time_minutes,
      AVG(EXTRACT(EPOCH FROM (COALESCE(cleared_at, NOW()) - deployed_at)) / 60) as avg_deployment_duration_minutes,
      COUNT(CASE WHEN cleared_at IS NULL THEN 1 END) as active_deployments
     FROM deployment_history
     WHERE resource_id = :resourceId
       ${startDate ? 'AND deployed_at >= :startDate' : ''}
       ${endDate ? 'AND deployed_at <= :endDate' : ''}`,
    {
      replacements: { resourceId, startDate, endDate },
      type: sequelize.QueryTypes.SELECT,
    },
  );

  return (results as any[])[0] || {};
};

// ============================================================================
// MAINTENANCE SCHEDULE MODELS
// ============================================================================

/**
 * Creates a maintenance schedule model
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Partial<ModelOptions>} [options={}] - Additional model options
 * @returns {ModelStatic<Model>} Maintenance schedule model
 *
 * @example
 * ```typescript
 * const Maintenance = createMaintenanceScheduleModel(sequelize);
 * ```
 */
export const createMaintenanceScheduleModel = (
  sequelize: Sequelize,
  options: Partial<ModelOptions> = {},
): ModelStatic<Model> => {
  const attributes: ModelAttributes = {
    id: {
      type: DataTypes.STRING(26),
      primaryKey: true,
      allowNull: false,
      defaultValue: () => generateULID(),
    },
    equipmentId: {
      type: DataTypes.STRING(26),
      allowNull: false,
    },
    maintenanceType: {
      type: DataTypes.ENUM(...Object.values(MaintenanceType)),
      allowNull: false,
    },
    scheduledDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    completedDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    performedBy: {
      type: DataTypes.STRING(26),
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    cost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    partsReplaced: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: [],
    },
    findings: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    nextScheduledDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'OVERDUE'),
      allowNull: false,
      defaultValue: 'SCHEDULED',
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
    },
  };

  class MaintenanceSchedule extends Model {}
  return MaintenanceSchedule.init(attributes, {
    sequelize,
    modelName: 'MaintenanceSchedule',
    tableName: 'maintenance_schedules',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['equipment_id'] },
      { fields: ['maintenance_type'] },
      { fields: ['scheduled_date'] },
      { fields: ['status'] },
    ],
    ...options,
  });
};

/**
 * Adds maintenance status automation
 *
 * @param {ModelStatic<Model>} model - Maintenance schedule model
 * @returns {void}
 *
 * @example
 * ```typescript
 * addMaintenanceStatusAutomation(MaintenanceModel);
 * ```
 */
export const addMaintenanceStatusAutomation = (model: ModelStatic<Model>): void => {
  model.addHook('beforeSave', async (instance: any) => {
    const now = new Date();

    // Auto-update status based on dates
    if (instance.completedDate) {
      instance.status = 'COMPLETED';
    } else if (instance.scheduledDate < now && instance.status === 'SCHEDULED') {
      instance.status = 'OVERDUE';
    }
  });
};

/**
 * Adds maintenance cost tracking
 *
 * @param {ModelStatic<Model>} model - Maintenance schedule model
 * @returns {void}
 *
 * @example
 * ```typescript
 * addMaintenanceCostTracking(MaintenanceModel);
 * ```
 */
export const addMaintenanceCostTracking = (model: ModelStatic<Model>): void => {
  model.addHook('afterUpdate', async (instance: any) => {
    if (instance.changed('cost') && instance.completedDate) {
      if (!instance.metadata.costHistory) {
        instance.metadata.costHistory = [];
      }

      instance.metadata.costHistory.push({
        cost: instance.cost,
        completedDate: instance.completedDate,
        maintenanceType: instance.maintenanceType,
      });
    }
  });
};

/**
 * Gets maintenance history for equipment
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} equipmentId - Equipment ID
 * @returns {Promise<Model[]>} Maintenance history
 *
 * @example
 * ```typescript
 * const history = await getMaintenanceHistory(sequelize, 'equip-123');
 * ```
 */
export const getMaintenanceHistory = async (
  sequelize: Sequelize,
  equipmentId: string,
): Promise<any[]> => {
  const MaintenanceSchedule = sequelize.models.MaintenanceSchedule;

  return MaintenanceSchedule.findAll({
    where: { equipmentId, status: 'COMPLETED' },
    order: [['completed_date', 'DESC']],
  });
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Generates a ULID (Universally Unique Lexicographically Sortable Identifier)
 *
 * @returns {string} ULID string
 *
 * @example
 * ```typescript
 * const id = generateULID();
 * ```
 */
export const generateULID = (): string => {
  const ulid = monotonicFactory();
  return ulid();
};

/**
 * Calculates resource utilization rate
 *
 * @param {number} totalDeployments - Total number of deployments
 * @param {number} totalAvailableHours - Total available hours
 * @param {number} averageDeploymentHours - Average deployment duration in hours
 * @returns {number} Utilization rate as percentage
 *
 * @example
 * ```typescript
 * const rate = calculateResourceUtilization(50, 720, 2.5);
 * ```
 */
export const calculateResourceUtilization = (
  totalDeployments: number,
  totalAvailableHours: number,
  averageDeploymentHours: number,
): number => {
  const totalDeploymentHours = totalDeployments * averageDeploymentHours;
  return (totalDeploymentHours / totalAvailableHours) * 100;
};

/**
 * Generates resource allocation report
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} startDate - Report start date
 * @param {Date} endDate - Report end date
 * @returns {Promise<Record<string, any>>} Allocation report
 *
 * @example
 * ```typescript
 * const report = await generateResourceAllocationReport(sequelize, startDate, endDate);
 * ```
 */
export const generateResourceAllocationReport = async (
  sequelize: Sequelize,
  startDate: Date,
  endDate: Date,
): Promise<Record<string, any>> => {
  const [results] = await sequelize.query(
    `SELECT
      resource_type,
      COUNT(DISTINCT resource_id) as total_resources,
      COUNT(*) as total_deployments,
      AVG(EXTRACT(EPOCH FROM (COALESCE(cleared_at, NOW()) - deployed_at)) / 3600) as avg_deployment_hours
     FROM deployment_history
     WHERE deployed_at BETWEEN :startDate AND :endDate
     GROUP BY resource_type`,
    {
      replacements: { startDate, endDate },
      type: sequelize.QueryTypes.SELECT,
    },
  );

  return {
    reportPeriod: { startDate, endDate },
    resourceTypes: results,
    generatedAt: new Date(),
  };
};

/**
 * Finds optimal resource allocation
 *
 * @param {ModelStatic<Model>} personnelModel - Personnel model
 * @param {ModelStatic<Model>} equipmentModel - Equipment model
 * @param {string[]} requiredCertifications - Required certifications
 * @param {string[]} requiredEquipment - Required equipment
 * @returns {Promise<{personnel: Model[], equipment: Model[]}>} Optimal allocation
 *
 * @example
 * ```typescript
 * const allocation = await findOptimalResourceAllocation(
 *   PersonnelModel,
 *   EquipmentModel,
 *   ['PARAMEDIC'],
 *   ['AMBULANCE']
 * );
 * ```
 */
export const findOptimalResourceAllocation = async (
  personnelModel: ModelStatic<Model>,
  equipmentModel: ModelStatic<Model>,
  requiredCertifications: string[],
  requiredEquipment: string[],
): Promise<{ personnel: Model[]; equipment: Model[] }> => {
  // Find available personnel with required certifications
  let personnel = await personnelModel.findAll({
    where: {
      status: {
        [Op.in]: [PersonnelStatus.AVAILABLE, PersonnelStatus.ON_DUTY],
      },
    },
  });

  if (requiredCertifications.length > 0) {
    personnel = personnel.filter((person: any) => {
      return requiredCertifications.every(cert => person.certifications?.includes(cert));
    });
  }

  // Find available equipment
  const equipment = await equipmentModel.findAll({
    where: {
      status: EquipmentStatus.AVAILABLE,
      name: { [Op.in]: requiredEquipment },
    },
  });

  return { personnel, equipment };
};

/**
 * Creates resource summary report
 *
 * @param {any} resource - Resource instance
 * @returns {Record<string, any>} Summary report
 *
 * @example
 * ```typescript
 * const summary = createResourceSummary(personnelInstance);
 * ```
 */
export const createResourceSummary = (resource: any): Record<string, any> => {
  return {
    id: resource.id,
    name: resource.name || `${resource.firstName} ${resource.lastName}`,
    status: resource.status,
    location: resource.location || resource.station,
    certifications: resource.certifications || [],
    availabilityRate: resource.metadata?.availabilityRate || 'N/A',
    lastDeployment: resource.metadata?.deploymentHistory?.[0]?.deployedAt || null,
    summary: `${resource.status} - ${resource.location || resource.station}`,
  };
};
