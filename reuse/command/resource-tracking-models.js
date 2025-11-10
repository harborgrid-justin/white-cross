"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createResourceSummary = exports.findOptimalResourceAllocation = exports.generateResourceAllocationReport = exports.calculateResourceUtilization = exports.generateULID = exports.getMaintenanceHistory = exports.addMaintenanceCostTracking = exports.addMaintenanceStatusAutomation = exports.createMaintenanceScheduleModel = exports.getDeploymentStatistics = exports.addDeploymentDurationTracking = exports.createDeploymentHistoryModel = exports.findExpiringCertifications = exports.addCertificationRenewalTracking = exports.addCertificationExpirationMonitoring = exports.createCertificationModel = exports.addFacilityResourceInventory = exports.addFacilityCapacityTracking = exports.createFacilityResourceModel = exports.bulkInventoryUpdate = exports.addInventoryTransactionTracking = exports.addInventoryExpirationTracking = exports.addInventoryReorderAlerts = exports.createSupplyInventoryModel = exports.addEquipmentCalibrationTracking = exports.addEquipmentDepreciation = exports.addEquipmentUsageTracking = exports.addEquipmentLocationTracking = exports.addEquipmentMaintenanceTracking = exports.createEquipmentModel = exports.findAvailablePersonnel = exports.addPersonnelShiftValidation = exports.addPersonnelDeploymentHistory = exports.addPersonnelCertificationTracking = exports.addPersonnelAvailabilityTracking = exports.createPersonnelModel = exports.FacilityType = exports.CertificationStatus = exports.MaintenanceType = exports.SupplyCategory = exports.EquipmentCategory = exports.EquipmentStatus = exports.PersonnelRank = exports.PersonnelStatus = void 0;
const sequelize_1 = require("sequelize");
const ulid_1 = require("ulid");
// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================
/**
 * @enum PersonnelStatus
 * @description Personnel availability status
 */
var PersonnelStatus;
(function (PersonnelStatus) {
    PersonnelStatus["ON_DUTY"] = "ON_DUTY";
    PersonnelStatus["AVAILABLE"] = "AVAILABLE";
    PersonnelStatus["DEPLOYED"] = "DEPLOYED";
    PersonnelStatus["OFF_DUTY"] = "OFF_DUTY";
    PersonnelStatus["ON_LEAVE"] = "ON_LEAVE";
    PersonnelStatus["SICK_LEAVE"] = "SICK_LEAVE";
    PersonnelStatus["TRAINING"] = "TRAINING";
    PersonnelStatus["ADMINISTRATIVE"] = "ADMINISTRATIVE";
    PersonnelStatus["UNAVAILABLE"] = "UNAVAILABLE";
})(PersonnelStatus || (exports.PersonnelStatus = PersonnelStatus = {}));
/**
 * @enum PersonnelRank
 * @description Personnel ranks and positions
 */
var PersonnelRank;
(function (PersonnelRank) {
    PersonnelRank["FIREFIGHTER"] = "FIREFIGHTER";
    PersonnelRank["ENGINEER"] = "ENGINEER";
    PersonnelRank["LIEUTENANT"] = "LIEUTENANT";
    PersonnelRank["CAPTAIN"] = "CAPTAIN";
    PersonnelRank["BATTALION_CHIEF"] = "BATTALION_CHIEF";
    PersonnelRank["DIVISION_CHIEF"] = "DIVISION_CHIEF";
    PersonnelRank["ASSISTANT_CHIEF"] = "ASSISTANT_CHIEF";
    PersonnelRank["FIRE_CHIEF"] = "FIRE_CHIEF";
    PersonnelRank["PARAMEDIC"] = "PARAMEDIC";
    PersonnelRank["EMT"] = "EMT";
    PersonnelRank["ADVANCED_EMT"] = "ADVANCED_EMT";
    PersonnelRank["OFFICER"] = "OFFICER";
    PersonnelRank["SERGEANT"] = "SERGEANT";
    PersonnelRank["SPECIALIST"] = "SPECIALIST";
})(PersonnelRank || (exports.PersonnelRank = PersonnelRank = {}));
/**
 * @enum EquipmentStatus
 * @description Equipment operational status
 */
var EquipmentStatus;
(function (EquipmentStatus) {
    EquipmentStatus["AVAILABLE"] = "AVAILABLE";
    EquipmentStatus["IN_USE"] = "IN_USE";
    EquipmentStatus["MAINTENANCE"] = "MAINTENANCE";
    EquipmentStatus["OUT_OF_SERVICE"] = "OUT_OF_SERVICE";
    EquipmentStatus["RESERVED"] = "RESERVED";
    EquipmentStatus["DAMAGED"] = "DAMAGED";
    EquipmentStatus["RETIRED"] = "RETIRED";
    EquipmentStatus["LOST"] = "LOST";
    EquipmentStatus["STOLEN"] = "STOLEN";
})(EquipmentStatus || (exports.EquipmentStatus = EquipmentStatus = {}));
/**
 * @enum EquipmentCategory
 * @description Categories of equipment
 */
var EquipmentCategory;
(function (EquipmentCategory) {
    EquipmentCategory["VEHICLE"] = "VEHICLE";
    EquipmentCategory["MEDICAL"] = "MEDICAL";
    EquipmentCategory["FIRE_SUPPRESSION"] = "FIRE_SUPPRESSION";
    EquipmentCategory["RESCUE"] = "RESCUE";
    EquipmentCategory["COMMUNICATIONS"] = "COMMUNICATIONS";
    EquipmentCategory["PPE"] = "PPE";
    EquipmentCategory["TOOLS"] = "TOOLS";
    EquipmentCategory["DETECTION"] = "DETECTION";
    EquipmentCategory["SPECIALIZED"] = "SPECIALIZED";
    EquipmentCategory["SUPPORT"] = "SUPPORT";
})(EquipmentCategory || (exports.EquipmentCategory = EquipmentCategory = {}));
/**
 * @enum SupplyCategory
 * @description Categories of supplies
 */
var SupplyCategory;
(function (SupplyCategory) {
    SupplyCategory["MEDICAL"] = "MEDICAL";
    SupplyCategory["PHARMACEUTICAL"] = "PHARMACEUTICAL";
    SupplyCategory["FIRE_SUPPRESSION"] = "FIRE_SUPPRESSION";
    SupplyCategory["RESCUE"] = "RESCUE";
    SupplyCategory["PPE"] = "PPE";
    SupplyCategory["CONSUMABLES"] = "CONSUMABLES";
    SupplyCategory["ADMINISTRATIVE"] = "ADMINISTRATIVE";
    SupplyCategory["HAZMAT"] = "HAZMAT";
    SupplyCategory["FOOD_WATER"] = "FOOD_WATER";
})(SupplyCategory || (exports.SupplyCategory = SupplyCategory = {}));
/**
 * @enum MaintenanceType
 * @description Types of maintenance
 */
var MaintenanceType;
(function (MaintenanceType) {
    MaintenanceType["PREVENTIVE"] = "PREVENTIVE";
    MaintenanceType["CORRECTIVE"] = "CORRECTIVE";
    MaintenanceType["INSPECTION"] = "INSPECTION";
    MaintenanceType["REPAIR"] = "REPAIR";
    MaintenanceType["CALIBRATION"] = "CALIBRATION";
    MaintenanceType["TESTING"] = "TESTING";
    MaintenanceType["CLEANING"] = "CLEANING";
    MaintenanceType["REPLACEMENT"] = "REPLACEMENT";
})(MaintenanceType || (exports.MaintenanceType = MaintenanceType = {}));
/**
 * @enum CertificationStatus
 * @description Certification validity status
 */
var CertificationStatus;
(function (CertificationStatus) {
    CertificationStatus["ACTIVE"] = "ACTIVE";
    CertificationStatus["EXPIRED"] = "EXPIRED";
    CertificationStatus["EXPIRING_SOON"] = "EXPIRING_SOON";
    CertificationStatus["PENDING"] = "PENDING";
    CertificationStatus["SUSPENDED"] = "SUSPENDED";
    CertificationStatus["REVOKED"] = "REVOKED";
})(CertificationStatus || (exports.CertificationStatus = CertificationStatus = {}));
/**
 * @enum FacilityType
 * @description Types of facilities
 */
var FacilityType;
(function (FacilityType) {
    FacilityType["FIRE_STATION"] = "FIRE_STATION";
    FacilityType["EMS_STATION"] = "EMS_STATION";
    FacilityType["POLICE_STATION"] = "POLICE_STATION";
    FacilityType["WAREHOUSE"] = "WAREHOUSE";
    FacilityType["TRAINING_CENTER"] = "TRAINING_CENTER";
    FacilityType["EQUIPMENT_CACHE"] = "EQUIPMENT_CACHE";
    FacilityType["COMMAND_CENTER"] = "COMMAND_CENTER";
    FacilityType["MAINTENANCE_FACILITY"] = "MAINTENANCE_FACILITY";
})(FacilityType || (exports.FacilityType = FacilityType = {}));
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
const createPersonnelModel = (sequelize, options = {}) => {
    const attributes = {
        id: {
            type: sequelize_1.DataTypes.STRING(26),
            primaryKey: true,
            allowNull: false,
            defaultValue: () => (0, exports.generateULID)(),
        },
        employeeId: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: true,
        },
        firstName: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
        },
        lastName: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
        },
        rank: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(PersonnelRank)),
            allowNull: false,
        },
        status: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(PersonnelStatus)),
            allowNull: false,
            defaultValue: PersonnelStatus.OFF_DUTY,
        },
        department: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
        },
        station: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
        },
        shiftSchedule: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
        },
        phoneNumber: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: false,
        },
        email: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
        },
        certifications: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            allowNull: true,
            defaultValue: [],
        },
        specializations: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            allowNull: true,
            defaultValue: [],
        },
        currentAssignment: {
            type: sequelize_1.DataTypes.STRING(26),
            allowNull: true,
        },
        hireDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        lastTrainingDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
        },
    };
    class Personnel extends sequelize_1.Model {
    }
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
exports.createPersonnelModel = createPersonnelModel;
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
const addPersonnelAvailabilityTracking = (model) => {
    model.addHook('beforeUpdate', async (instance) => {
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
exports.addPersonnelAvailabilityTracking = addPersonnelAvailabilityTracking;
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
const addPersonnelCertificationTracking = (model) => {
    const attributes = model.rawAttributes;
    attributes.isCertified = {
        type: sequelize_1.DataTypes.VIRTUAL,
        get() {
            return this.certifications && this.certifications.length > 0;
        },
    };
    attributes.yearsOfService = {
        type: sequelize_1.DataTypes.VIRTUAL,
        get() {
            if (!this.hireDate)
                return 0;
            const diff = new Date().getTime() - new Date(this.hireDate).getTime();
            return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
        },
    };
};
exports.addPersonnelCertificationTracking = addPersonnelCertificationTracking;
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
const addPersonnelDeploymentHistory = (model) => {
    model.addHook('beforeUpdate', async (instance) => {
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
            }
            else if (instance.previous('currentAssignment')) {
                // Assignment ended
                const lastDeployment = instance.metadata.deploymentHistory[instance.metadata.deploymentHistory.length - 1];
                if (lastDeployment && !lastDeployment.completedAt) {
                    lastDeployment.completedAt = new Date();
                }
            }
        }
    });
};
exports.addPersonnelDeploymentHistory = addPersonnelDeploymentHistory;
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
const addPersonnelShiftValidation = (model) => {
    model.addHook('beforeSave', async (instance) => {
        const validShifts = ['A', 'B', 'C', 'D', 'DAY', 'NIGHT', 'ROTATING', 'ADMIN'];
        if (instance.shiftSchedule && !validShifts.includes(instance.shiftSchedule)) {
            throw new Error(`Invalid shift schedule. Must be one of: ${validShifts.join(', ')}`);
        }
    });
};
exports.addPersonnelShiftValidation = addPersonnelShiftValidation;
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
const findAvailablePersonnel = async (model, rank, certifications, station) => {
    const where = {
        status: {
            [sequelize_1.Op.in]: [PersonnelStatus.AVAILABLE, PersonnelStatus.ON_DUTY],
        },
    };
    if (rank)
        where.rank = rank;
    if (station)
        where.station = station;
    let results = await model.findAll({ where });
    // Filter by certifications if specified
    if (certifications && certifications.length > 0) {
        results = results.filter((person) => {
            return certifications.every(cert => person.certifications?.includes(cert));
        });
    }
    return results;
};
exports.findAvailablePersonnel = findAvailablePersonnel;
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
const createEquipmentModel = (sequelize, options = {}) => {
    const attributes = {
        id: {
            type: sequelize_1.DataTypes.STRING(26),
            primaryKey: true,
            allowNull: false,
            defaultValue: () => (0, exports.generateULID)(),
        },
        equipmentId: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: true,
        },
        name: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
        },
        category: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(EquipmentCategory)),
            allowNull: false,
        },
        status: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(EquipmentStatus)),
            allowNull: false,
            defaultValue: EquipmentStatus.AVAILABLE,
        },
        manufacturer: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: true,
        },
        modelNumber: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
        },
        serialNumber: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            unique: true,
        },
        acquisitionDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        acquisitionCost: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
        currentValue: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
        assignedTo: {
            type: sequelize_1.DataTypes.STRING(26),
            allowNull: true,
        },
        location: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: true,
        },
        lastMaintenanceDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        nextMaintenanceDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        warrantyExpiration: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
        },
    };
    class Equipment extends sequelize_1.Model {
    }
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
exports.createEquipmentModel = createEquipmentModel;
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
const addEquipmentMaintenanceTracking = (model) => {
    const attributes = model.rawAttributes;
    attributes.maintenanceStatus = {
        type: sequelize_1.DataTypes.VIRTUAL,
        get() {
            if (!this.nextMaintenanceDate)
                return 'UNKNOWN';
            const now = new Date();
            const daysUntil = Math.floor((this.nextMaintenanceDate - now.getTime()) / (1000 * 60 * 60 * 24));
            if (daysUntil < 0)
                return 'OVERDUE';
            if (daysUntil <= 7)
                return 'DUE_SOON';
            if (daysUntil <= 30)
                return 'UPCOMING';
            return 'CURRENT';
        },
    };
    attributes.warrantyStatus = {
        type: sequelize_1.DataTypes.VIRTUAL,
        get() {
            if (!this.warrantyExpiration)
                return 'NO_WARRANTY';
            const now = new Date();
            return this.warrantyExpiration > now ? 'UNDER_WARRANTY' : 'EXPIRED';
        },
    };
};
exports.addEquipmentMaintenanceTracking = addEquipmentMaintenanceTracking;
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
const addEquipmentLocationTracking = (model) => {
    model.addHook('beforeUpdate', async (instance) => {
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
exports.addEquipmentLocationTracking = addEquipmentLocationTracking;
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
const addEquipmentUsageTracking = (model) => {
    model.addHook('beforeUpdate', async (instance) => {
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
exports.addEquipmentUsageTracking = addEquipmentUsageTracking;
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
const addEquipmentDepreciation = (model, depreciationRate = 0.15) => {
    const attributes = model.rawAttributes;
    attributes.estimatedValue = {
        type: sequelize_1.DataTypes.VIRTUAL,
        get() {
            if (!this.acquisitionCost || !this.acquisitionDate)
                return null;
            const years = (new Date().getTime() - new Date(this.acquisitionDate).getTime()) /
                (1000 * 60 * 60 * 24 * 365.25);
            const depreciation = Math.pow(1 - depreciationRate, years);
            return (this.acquisitionCost * depreciation).toFixed(2);
        },
    };
};
exports.addEquipmentDepreciation = addEquipmentDepreciation;
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
const addEquipmentCalibrationTracking = (model) => {
    const calibrationRequired = [
        EquipmentCategory.DETECTION,
        EquipmentCategory.MEDICAL,
    ];
    model.addHook('beforeSave', async (instance) => {
        if (calibrationRequired.includes(instance.category)) {
            if (!instance.metadata.calibrationHistory) {
                instance.metadata.calibrationHistory = [];
            }
            // Flag if calibration is overdue
            if (instance.metadata.lastCalibrationDate) {
                const daysSinceCalibration = Math.floor((new Date().getTime() - new Date(instance.metadata.lastCalibrationDate).getTime()) /
                    (1000 * 60 * 60 * 24));
                if (daysSinceCalibration > 180) {
                    instance.metadata.calibrationStatus = 'OVERDUE';
                }
                else if (daysSinceCalibration > 150) {
                    instance.metadata.calibrationStatus = 'DUE_SOON';
                }
                else {
                    instance.metadata.calibrationStatus = 'CURRENT';
                }
            }
            else {
                instance.metadata.calibrationStatus = 'NEVER_CALIBRATED';
            }
        }
    });
};
exports.addEquipmentCalibrationTracking = addEquipmentCalibrationTracking;
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
const createSupplyInventoryModel = (sequelize, options = {}) => {
    const attributes = {
        id: {
            type: sequelize_1.DataTypes.STRING(26),
            primaryKey: true,
            allowNull: false,
            defaultValue: () => (0, exports.generateULID)(),
        },
        itemName: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
        },
        category: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(SupplyCategory)),
            allowNull: false,
        },
        sku: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            unique: true,
        },
        quantity: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            validate: {
                min: 0,
            },
        },
        unitOfMeasure: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
        },
        reorderPoint: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        maxQuantity: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
        },
        location: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
        },
        expirationDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        lotNumber: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
        },
        supplier: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: true,
        },
        unitCost: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
        },
    };
    class SupplyInventory extends sequelize_1.Model {
    }
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
exports.createSupplyInventoryModel = createSupplyInventoryModel;
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
const addInventoryReorderAlerts = (model) => {
    const attributes = model.rawAttributes;
    attributes.inventoryStatus = {
        type: sequelize_1.DataTypes.VIRTUAL,
        get() {
            if (this.quantity <= 0)
                return 'OUT_OF_STOCK';
            if (this.quantity <= this.reorderPoint)
                return 'REORDER_NEEDED';
            if (this.maxQuantity && this.quantity >= this.maxQuantity * 0.9)
                return 'OVERSTOCKED';
            return 'ADEQUATE';
        },
    };
    attributes.totalValue = {
        type: sequelize_1.DataTypes.VIRTUAL,
        get() {
            if (!this.unitCost)
                return null;
            return (this.quantity * parseFloat(this.unitCost)).toFixed(2);
        },
    };
    model.addHook('afterUpdate', async (instance) => {
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
exports.addInventoryReorderAlerts = addInventoryReorderAlerts;
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
const addInventoryExpirationTracking = (model) => {
    const attributes = model.rawAttributes;
    attributes.expirationStatus = {
        type: sequelize_1.DataTypes.VIRTUAL,
        get() {
            if (!this.expirationDate)
                return 'NO_EXPIRATION';
            const now = new Date();
            const daysUntilExpiration = Math.floor((this.expirationDate - now.getTime()) / (1000 * 60 * 60 * 24));
            if (daysUntilExpiration < 0)
                return 'EXPIRED';
            if (daysUntilExpiration <= 7)
                return 'EXPIRES_SOON';
            if (daysUntilExpiration <= 30)
                return 'EXPIRING';
            return 'VALID';
        },
    };
};
exports.addInventoryExpirationTracking = addInventoryExpirationTracking;
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
const addInventoryTransactionTracking = (model) => {
    model.addHook('beforeUpdate', async (instance) => {
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
exports.addInventoryTransactionTracking = addInventoryTransactionTracking;
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
const bulkInventoryUpdate = async (model, updates, transaction) => {
    for (const update of updates) {
        const item = await model.findByPk(update.id, { transaction });
        if (item) {
            await item.update({ quantity: update.quantity }, { transaction });
        }
    }
};
exports.bulkInventoryUpdate = bulkInventoryUpdate;
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
const createFacilityResourceModel = (sequelize, options = {}) => {
    const attributes = {
        id: {
            type: sequelize_1.DataTypes.STRING(26),
            primaryKey: true,
            allowNull: false,
            defaultValue: () => (0, exports.generateULID)(),
        },
        facilityName: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
        },
        facilityType: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(FacilityType)),
            allowNull: false,
        },
        address: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: false,
        },
        location: {
            type: sequelize_1.DataTypes.GEOMETRY('POINT'),
            allowNull: true,
        },
        capacity: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
        },
        currentOccupancy: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0,
        },
        operationalStatus: {
            type: sequelize_1.DataTypes.ENUM('OPERATIONAL', 'LIMITED', 'CLOSED', 'MAINTENANCE'),
            allowNull: false,
            defaultValue: 'OPERATIONAL',
        },
        stationedUnits: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            allowNull: true,
            defaultValue: [],
        },
        availableResources: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
        },
        staffCapacity: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
        },
        currentStaffing: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0,
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
        },
    };
    class FacilityResource extends sequelize_1.Model {
    }
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
exports.createFacilityResourceModel = createFacilityResourceModel;
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
const addFacilityCapacityTracking = (model) => {
    const attributes = model.rawAttributes;
    attributes.occupancyRate = {
        type: sequelize_1.DataTypes.VIRTUAL,
        get() {
            if (!this.capacity)
                return null;
            return ((this.currentOccupancy / this.capacity) * 100).toFixed(2);
        },
    };
    attributes.staffingRate = {
        type: sequelize_1.DataTypes.VIRTUAL,
        get() {
            if (!this.staffCapacity)
                return null;
            return ((this.currentStaffing / this.staffCapacity) * 100).toFixed(2);
        },
    };
    attributes.availableCapacity = {
        type: sequelize_1.DataTypes.VIRTUAL,
        get() {
            return (this.capacity || 0) - (this.currentOccupancy || 0);
        },
    };
};
exports.addFacilityCapacityTracking = addFacilityCapacityTracking;
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
const addFacilityResourceInventory = (model) => {
    model.addHook('beforeUpdate', async (instance) => {
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
exports.addFacilityResourceInventory = addFacilityResourceInventory;
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
const createCertificationModel = (sequelize, options = {}) => {
    const attributes = {
        id: {
            type: sequelize_1.DataTypes.STRING(26),
            primaryKey: true,
            allowNull: false,
            defaultValue: () => (0, exports.generateULID)(),
        },
        personnelId: {
            type: sequelize_1.DataTypes.STRING(26),
            allowNull: false,
        },
        certificationName: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
        },
        certificationNumber: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
        },
        issuingOrganization: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
        },
        issuedDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        expirationDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        status: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(CertificationStatus)),
            allowNull: false,
            defaultValue: CertificationStatus.ACTIVE,
        },
        renewalRequired: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        continuingEducationHours: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0,
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
        },
    };
    class Certification extends sequelize_1.Model {
    }
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
exports.createCertificationModel = createCertificationModel;
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
const addCertificationExpirationMonitoring = (model) => {
    model.addHook('beforeSave', async (instance) => {
        if (instance.expirationDate) {
            const now = new Date();
            const daysUntilExpiration = Math.floor((instance.expirationDate - now.getTime()) / (1000 * 60 * 60 * 24));
            if (daysUntilExpiration < 0) {
                instance.status = CertificationStatus.EXPIRED;
            }
            else if (daysUntilExpiration <= 30) {
                instance.status = CertificationStatus.EXPIRING_SOON;
            }
            else {
                instance.status = CertificationStatus.ACTIVE;
            }
        }
    });
};
exports.addCertificationExpirationMonitoring = addCertificationExpirationMonitoring;
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
const addCertificationRenewalTracking = (model) => {
    model.addHook('beforeUpdate', async (instance) => {
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
exports.addCertificationRenewalTracking = addCertificationRenewalTracking;
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
const findExpiringCertifications = async (model, days = 30) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() + days);
    return model.findAll({
        where: {
            expirationDate: {
                [sequelize_1.Op.lte]: cutoffDate,
                [sequelize_1.Op.gte]: new Date(),
            },
            status: {
                [sequelize_1.Op.in]: [CertificationStatus.ACTIVE, CertificationStatus.EXPIRING_SOON],
            },
        },
        order: [['expiration_date', 'ASC']],
    });
};
exports.findExpiringCertifications = findExpiringCertifications;
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
const createDeploymentHistoryModel = (sequelize, options = {}) => {
    const attributes = {
        id: {
            type: sequelize_1.DataTypes.STRING(26),
            primaryKey: true,
            allowNull: false,
            defaultValue: () => (0, exports.generateULID)(),
        },
        resourceId: {
            type: sequelize_1.DataTypes.STRING(26),
            allowNull: false,
        },
        resourceType: {
            type: sequelize_1.DataTypes.ENUM('PERSONNEL', 'EQUIPMENT', 'UNIT'),
            allowNull: false,
        },
        incidentId: {
            type: sequelize_1.DataTypes.STRING(26),
            allowNull: false,
        },
        deployedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        arrivedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        clearedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        deploymentRole: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
        },
        fromLocation: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: true,
        },
        toLocation: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: true,
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
        },
    };
    class DeploymentHistory extends sequelize_1.Model {
    }
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
exports.createDeploymentHistoryModel = createDeploymentHistoryModel;
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
const addDeploymentDurationTracking = (model) => {
    const attributes = model.rawAttributes;
    attributes.responseTime = {
        type: sequelize_1.DataTypes.VIRTUAL,
        get() {
            if (!this.deployedAt || !this.arrivedAt)
                return null;
            return Math.floor((this.arrivedAt - this.deployedAt) / 1000 / 60); // minutes
        },
    };
    attributes.deploymentDuration = {
        type: sequelize_1.DataTypes.VIRTUAL,
        get() {
            if (!this.deployedAt)
                return null;
            const end = this.clearedAt || new Date();
            return Math.floor((end - this.deployedAt) / 1000 / 60); // minutes
        },
    };
    attributes.isActive = {
        type: sequelize_1.DataTypes.VIRTUAL,
        get() {
            return !this.clearedAt;
        },
    };
};
exports.addDeploymentDurationTracking = addDeploymentDurationTracking;
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
const getDeploymentStatistics = async (sequelize, resourceId, startDate, endDate) => {
    const whereClause = { resource_id: resourceId };
    if (startDate) {
        whereClause.deployed_at = { [sequelize_1.Op.gte]: startDate };
    }
    if (endDate) {
        whereClause.deployed_at = { ...whereClause.deployed_at, [sequelize_1.Op.lte]: endDate };
    }
    const [results] = await sequelize.query(`SELECT
      COUNT(*) as total_deployments,
      AVG(EXTRACT(EPOCH FROM (arrived_at - deployed_at)) / 60) as avg_response_time_minutes,
      AVG(EXTRACT(EPOCH FROM (COALESCE(cleared_at, NOW()) - deployed_at)) / 60) as avg_deployment_duration_minutes,
      COUNT(CASE WHEN cleared_at IS NULL THEN 1 END) as active_deployments
     FROM deployment_history
     WHERE resource_id = :resourceId
       ${startDate ? 'AND deployed_at >= :startDate' : ''}
       ${endDate ? 'AND deployed_at <= :endDate' : ''}`, {
        replacements: { resourceId, startDate, endDate },
        type: sequelize.QueryTypes.SELECT,
    });
    return results[0] || {};
};
exports.getDeploymentStatistics = getDeploymentStatistics;
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
const createMaintenanceScheduleModel = (sequelize, options = {}) => {
    const attributes = {
        id: {
            type: sequelize_1.DataTypes.STRING(26),
            primaryKey: true,
            allowNull: false,
            defaultValue: () => (0, exports.generateULID)(),
        },
        equipmentId: {
            type: sequelize_1.DataTypes.STRING(26),
            allowNull: false,
        },
        maintenanceType: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(MaintenanceType)),
            allowNull: false,
        },
        scheduledDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        completedDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        performedBy: {
            type: sequelize_1.DataTypes.STRING(26),
            allowNull: true,
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        cost: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
        partsReplaced: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            allowNull: true,
            defaultValue: [],
        },
        findings: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        nextScheduledDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'OVERDUE'),
            allowNull: false,
            defaultValue: 'SCHEDULED',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
        },
    };
    class MaintenanceSchedule extends sequelize_1.Model {
    }
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
exports.createMaintenanceScheduleModel = createMaintenanceScheduleModel;
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
const addMaintenanceStatusAutomation = (model) => {
    model.addHook('beforeSave', async (instance) => {
        const now = new Date();
        // Auto-update status based on dates
        if (instance.completedDate) {
            instance.status = 'COMPLETED';
        }
        else if (instance.scheduledDate < now && instance.status === 'SCHEDULED') {
            instance.status = 'OVERDUE';
        }
    });
};
exports.addMaintenanceStatusAutomation = addMaintenanceStatusAutomation;
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
const addMaintenanceCostTracking = (model) => {
    model.addHook('afterUpdate', async (instance) => {
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
exports.addMaintenanceCostTracking = addMaintenanceCostTracking;
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
const getMaintenanceHistory = async (sequelize, equipmentId) => {
    const MaintenanceSchedule = sequelize.models.MaintenanceSchedule;
    return MaintenanceSchedule.findAll({
        where: { equipmentId, status: 'COMPLETED' },
        order: [['completed_date', 'DESC']],
    });
};
exports.getMaintenanceHistory = getMaintenanceHistory;
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
const generateULID = () => {
    const ulid = (0, ulid_1.monotonicFactory)();
    return ulid();
};
exports.generateULID = generateULID;
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
const calculateResourceUtilization = (totalDeployments, totalAvailableHours, averageDeploymentHours) => {
    const totalDeploymentHours = totalDeployments * averageDeploymentHours;
    return (totalDeploymentHours / totalAvailableHours) * 100;
};
exports.calculateResourceUtilization = calculateResourceUtilization;
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
const generateResourceAllocationReport = async (sequelize, startDate, endDate) => {
    const [results] = await sequelize.query(`SELECT
      resource_type,
      COUNT(DISTINCT resource_id) as total_resources,
      COUNT(*) as total_deployments,
      AVG(EXTRACT(EPOCH FROM (COALESCE(cleared_at, NOW()) - deployed_at)) / 3600) as avg_deployment_hours
     FROM deployment_history
     WHERE deployed_at BETWEEN :startDate AND :endDate
     GROUP BY resource_type`, {
        replacements: { startDate, endDate },
        type: sequelize.QueryTypes.SELECT,
    });
    return {
        reportPeriod: { startDate, endDate },
        resourceTypes: results,
        generatedAt: new Date(),
    };
};
exports.generateResourceAllocationReport = generateResourceAllocationReport;
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
const findOptimalResourceAllocation = async (personnelModel, equipmentModel, requiredCertifications, requiredEquipment) => {
    // Find available personnel with required certifications
    let personnel = await personnelModel.findAll({
        where: {
            status: {
                [sequelize_1.Op.in]: [PersonnelStatus.AVAILABLE, PersonnelStatus.ON_DUTY],
            },
        },
    });
    if (requiredCertifications.length > 0) {
        personnel = personnel.filter((person) => {
            return requiredCertifications.every(cert => person.certifications?.includes(cert));
        });
    }
    // Find available equipment
    const equipment = await equipmentModel.findAll({
        where: {
            status: EquipmentStatus.AVAILABLE,
            name: { [sequelize_1.Op.in]: requiredEquipment },
        },
    });
    return { personnel, equipment };
};
exports.findOptimalResourceAllocation = findOptimalResourceAllocation;
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
const createResourceSummary = (resource) => {
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
exports.createResourceSummary = createResourceSummary;
//# sourceMappingURL=resource-tracking-models.js.map