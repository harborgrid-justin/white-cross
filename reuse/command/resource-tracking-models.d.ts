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
import { Model, ModelStatic, Sequelize, ModelOptions, Transaction } from 'sequelize';
/**
 * @enum PersonnelStatus
 * @description Personnel availability status
 */
export declare enum PersonnelStatus {
    ON_DUTY = "ON_DUTY",
    AVAILABLE = "AVAILABLE",
    DEPLOYED = "DEPLOYED",
    OFF_DUTY = "OFF_DUTY",
    ON_LEAVE = "ON_LEAVE",
    SICK_LEAVE = "SICK_LEAVE",
    TRAINING = "TRAINING",
    ADMINISTRATIVE = "ADMINISTRATIVE",
    UNAVAILABLE = "UNAVAILABLE"
}
/**
 * @enum PersonnelRank
 * @description Personnel ranks and positions
 */
export declare enum PersonnelRank {
    FIREFIGHTER = "FIREFIGHTER",
    ENGINEER = "ENGINEER",
    LIEUTENANT = "LIEUTENANT",
    CAPTAIN = "CAPTAIN",
    BATTALION_CHIEF = "BATTALION_CHIEF",
    DIVISION_CHIEF = "DIVISION_CHIEF",
    ASSISTANT_CHIEF = "ASSISTANT_CHIEF",
    FIRE_CHIEF = "FIRE_CHIEF",
    PARAMEDIC = "PARAMEDIC",
    EMT = "EMT",
    ADVANCED_EMT = "ADVANCED_EMT",
    OFFICER = "OFFICER",
    SERGEANT = "SERGEANT",
    SPECIALIST = "SPECIALIST"
}
/**
 * @enum EquipmentStatus
 * @description Equipment operational status
 */
export declare enum EquipmentStatus {
    AVAILABLE = "AVAILABLE",
    IN_USE = "IN_USE",
    MAINTENANCE = "MAINTENANCE",
    OUT_OF_SERVICE = "OUT_OF_SERVICE",
    RESERVED = "RESERVED",
    DAMAGED = "DAMAGED",
    RETIRED = "RETIRED",
    LOST = "LOST",
    STOLEN = "STOLEN"
}
/**
 * @enum EquipmentCategory
 * @description Categories of equipment
 */
export declare enum EquipmentCategory {
    VEHICLE = "VEHICLE",
    MEDICAL = "MEDICAL",
    FIRE_SUPPRESSION = "FIRE_SUPPRESSION",
    RESCUE = "RESCUE",
    COMMUNICATIONS = "COMMUNICATIONS",
    PPE = "PPE",
    TOOLS = "TOOLS",
    DETECTION = "DETECTION",
    SPECIALIZED = "SPECIALIZED",
    SUPPORT = "SUPPORT"
}
/**
 * @enum SupplyCategory
 * @description Categories of supplies
 */
export declare enum SupplyCategory {
    MEDICAL = "MEDICAL",
    PHARMACEUTICAL = "PHARMACEUTICAL",
    FIRE_SUPPRESSION = "FIRE_SUPPRESSION",
    RESCUE = "RESCUE",
    PPE = "PPE",
    CONSUMABLES = "CONSUMABLES",
    ADMINISTRATIVE = "ADMINISTRATIVE",
    HAZMAT = "HAZMAT",
    FOOD_WATER = "FOOD_WATER"
}
/**
 * @enum MaintenanceType
 * @description Types of maintenance
 */
export declare enum MaintenanceType {
    PREVENTIVE = "PREVENTIVE",
    CORRECTIVE = "CORRECTIVE",
    INSPECTION = "INSPECTION",
    REPAIR = "REPAIR",
    CALIBRATION = "CALIBRATION",
    TESTING = "TESTING",
    CLEANING = "CLEANING",
    REPLACEMENT = "REPLACEMENT"
}
/**
 * @enum CertificationStatus
 * @description Certification validity status
 */
export declare enum CertificationStatus {
    ACTIVE = "ACTIVE",
    EXPIRED = "EXPIRED",
    EXPIRING_SOON = "EXPIRING_SOON",
    PENDING = "PENDING",
    SUSPENDED = "SUSPENDED",
    REVOKED = "REVOKED"
}
/**
 * @enum FacilityType
 * @description Types of facilities
 */
export declare enum FacilityType {
    FIRE_STATION = "FIRE_STATION",
    EMS_STATION = "EMS_STATION",
    POLICE_STATION = "POLICE_STATION",
    WAREHOUSE = "WAREHOUSE",
    TRAINING_CENTER = "TRAINING_CENTER",
    EQUIPMENT_CACHE = "EQUIPMENT_CACHE",
    COMMAND_CENTER = "COMMAND_CENTER",
    MAINTENANCE_FACILITY = "MAINTENANCE_FACILITY"
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
export declare const createPersonnelModel: (sequelize: Sequelize, options?: Partial<ModelOptions>) => ModelStatic<Model>;
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
export declare const addPersonnelAvailabilityTracking: (model: ModelStatic<Model>) => void;
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
export declare const addPersonnelCertificationTracking: (model: ModelStatic<Model>) => void;
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
export declare const addPersonnelDeploymentHistory: (model: ModelStatic<Model>) => void;
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
export declare const addPersonnelShiftValidation: (model: ModelStatic<Model>) => void;
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
export declare const findAvailablePersonnel: (model: ModelStatic<Model>, rank?: PersonnelRank, certifications?: string[], station?: string) => Promise<Model[]>;
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
export declare const createEquipmentModel: (sequelize: Sequelize, options?: Partial<ModelOptions>) => ModelStatic<Model>;
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
export declare const addEquipmentMaintenanceTracking: (model: ModelStatic<Model>) => void;
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
export declare const addEquipmentLocationTracking: (model: ModelStatic<Model>) => void;
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
export declare const addEquipmentUsageTracking: (model: ModelStatic<Model>) => void;
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
export declare const addEquipmentDepreciation: (model: ModelStatic<Model>, depreciationRate?: number) => void;
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
export declare const addEquipmentCalibrationTracking: (model: ModelStatic<Model>) => void;
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
export declare const createSupplyInventoryModel: (sequelize: Sequelize, options?: Partial<ModelOptions>) => ModelStatic<Model>;
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
export declare const addInventoryReorderAlerts: (model: ModelStatic<Model>) => void;
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
export declare const addInventoryExpirationTracking: (model: ModelStatic<Model>) => void;
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
export declare const addInventoryTransactionTracking: (model: ModelStatic<Model>) => void;
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
export declare const bulkInventoryUpdate: (model: ModelStatic<Model>, updates: Array<{
    id: string;
    quantity: number;
}>, transaction?: Transaction) => Promise<void>;
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
export declare const createFacilityResourceModel: (sequelize: Sequelize, options?: Partial<ModelOptions>) => ModelStatic<Model>;
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
export declare const addFacilityCapacityTracking: (model: ModelStatic<Model>) => void;
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
export declare const addFacilityResourceInventory: (model: ModelStatic<Model>) => void;
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
export declare const createCertificationModel: (sequelize: Sequelize, options?: Partial<ModelOptions>) => ModelStatic<Model>;
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
export declare const addCertificationExpirationMonitoring: (model: ModelStatic<Model>) => void;
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
export declare const addCertificationRenewalTracking: (model: ModelStatic<Model>) => void;
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
export declare const findExpiringCertifications: (model: ModelStatic<Model>, days?: number) => Promise<Model[]>;
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
export declare const createDeploymentHistoryModel: (sequelize: Sequelize, options?: Partial<ModelOptions>) => ModelStatic<Model>;
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
export declare const addDeploymentDurationTracking: (model: ModelStatic<Model>) => void;
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
export declare const getDeploymentStatistics: (sequelize: Sequelize, resourceId: string, startDate?: Date, endDate?: Date) => Promise<Record<string, any>>;
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
export declare const createMaintenanceScheduleModel: (sequelize: Sequelize, options?: Partial<ModelOptions>) => ModelStatic<Model>;
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
export declare const addMaintenanceStatusAutomation: (model: ModelStatic<Model>) => void;
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
export declare const addMaintenanceCostTracking: (model: ModelStatic<Model>) => void;
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
export declare const getMaintenanceHistory: (sequelize: Sequelize, equipmentId: string) => Promise<any[]>;
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
export declare const generateULID: () => string;
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
export declare const calculateResourceUtilization: (totalDeployments: number, totalAvailableHours: number, averageDeploymentHours: number) => number;
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
export declare const generateResourceAllocationReport: (sequelize: Sequelize, startDate: Date, endDate: Date) => Promise<Record<string, any>>;
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
export declare const findOptimalResourceAllocation: (personnelModel: ModelStatic<Model>, equipmentModel: ModelStatic<Model>, requiredCertifications: string[], requiredEquipment: string[]) => Promise<{
    personnel: Model[];
    equipment: Model[];
}>;
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
export declare const createResourceSummary: (resource: any) => Record<string, any>;
//# sourceMappingURL=resource-tracking-models.d.ts.map